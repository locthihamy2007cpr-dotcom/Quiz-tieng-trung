

(function () {
  'use strict';
  const K = { mode: 'cn_quiz_mode_stats', time: 'cn_quiz_mode_time', claims: 'cn_quiz_xp_claims', mist: 'cn_quiz_mistakes' };
  const today = () => getLocalDateStr();
  const SC = window.StudyCore = {};
  const load = (k, d) => { const v = safeStorage.get(k); return v == null ? d : v; };
  let modeStats = load(K.mode, {});
  let timeStats = load(K.time, {});
  let claims = load(K.claims, { date: today(), keys: [] });
  let mist = load(K.mist, []);
  if (!Array.isArray(mist)) mist = [];
  if (!claims || claims.date !== today()) claims = { date: today(), keys: [] };

  SC.bump = function (mode, field, n) {
    const m = modeStats[mode] || (modeStats[mode] = {});
    m[field] = (m[field] || 0) + (n || 1);
    safeStorage.set(K.mode, modeStats);
  };
  SC.getModeStats = () => modeStats;

  SC.awardOnce = function (key) {
    if (claims.date !== today()) claims = { date: today(), keys: [] };
    if (claims.keys.includes(key)) return false;
    claims.keys.push(key);
    if (claims.keys.length > 3000) claims.keys = claims.keys.slice(-3000);
    safeStorage.set(K.claims, claims);
    return true;
  };

  SC.record = function (mode, key, ok, item, statFields) {
    const first = SC.awardOnce(mode + ':' + key);
    if (!first) return { counted: false };
    recordAnswer(ok, item, { noSRS: true, tag: mode });
    (statFields || []).forEach(f => SC.bump(mode, f));
    return { counted: true };
  };

  const INTERVALS = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
  SC.mistakes = kind => mist.filter(m => !kind || m.kind === kind);
  SC.mistakeWrong = function (kind, id, data) {
    let m = mist.find(x => x.id === kind + ':' + id);
    if (!m) { m = Object.assign({ id: kind + ':' + id, kind, wrongCount: 0, box: 1, correctStreak: 0, added: Date.now() }, data); mist.push(m); }
    else Object.assign(m, data);
    m.wrongCount = (m.wrongCount || 0) + 1; m.correctStreak = 0; m.box = 1; m.nextReview = Date.now(); m.lastWrong = Date.now();
    safeStorage.set(K.mist, mist);
  };
  SC.mistakeRight = function (kind, id) {
    const m = mist.find(x => x.id === kind + ':' + id); if (!m) return;
    m.correctStreak = (m.correctStreak || 0) + 1; m.box = Math.min(5, (m.box || 1) + 1);
    m.nextReview = Date.now() + INTERVALS[m.box] * 86400000;
    safeStorage.set(K.mist, mist);
  };
  SC.mistakeRemove = function (id) { mist = mist.filter(m => m.id !== id); safeStorage.set(K.mist, mist); };

  const SCREEN_MODE = { 'quiz-screen': 'quiz', 'listen-screen': 'quiz', 'match-screen': 'quiz', 'order-screen': 'order', 'write-screen': 'write', 'pinyin-screen': 'pinyin', 'hub-screen': 'practice', 'px-screen': 'practice' };
  let curMode = null, since = Date.now();
  function flushTime() {
    const now = Date.now();
    if (curMode) { const s = Math.min(1800, Math.max(0, (now - since) / 1000)); timeStats[curMode] = Math.round(((timeStats[curMode] || 0) + s) * 10) / 10; safeStorage.set(K.time, timeStats); }
    since = now;
  }
  const _show = window.show;
  window.show = function (id) { flushTime(); curMode = SCREEN_MODE[id] || null; return _show.apply(this, arguments); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { flushTime(); curMode = null; } else { since = Date.now(); const vis = Object.keys(SCREEN_MODE).find(id => document.getElementById(id) && document.getElementById(id).style.display === 'block'); curMode = vis ? SCREEN_MODE[vis] : null; } });
  window.addEventListener('pagehide', flushTime);

  const css = document.createElement('style');
  css.textContent = `
  .mode-grid.new-modes{grid-template-columns:repeat(3,1fr)!important}
  .mode-grid.hub-row{grid-template-columns:1fr!important}
  .mode-card.hub-mode:hover{border-color:#34d399;box-shadow:0 15px 35px rgba(52,211,153,.2),var(--shadow-3)}
  .mode-card.hub-mode .mode-title{color:#34d399}
  .mode-card.pinyin-mode:hover{border-color:#60a5fa;box-shadow:0 15px 35px rgba(96,165,250,.2),var(--shadow-3)}
  .mode-card.pinyin-mode .mode-title{color:#60a5fa}
  .mode-card.order-mode:hover{border-color:#fbbf24;box-shadow:0 15px 35px rgba(251,191,36,.2),var(--shadow-3)}
  .mode-card.order-mode .mode-title{color:#fbbf24}
  .mode-card.write-mode:hover{border-color:#34d399;box-shadow:0 15px 35px rgba(52,211,153,.2),var(--shadow-3)}
  .mode-card.write-mode .mode-title{color:#34d399}
  .mstat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
  .mstat{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 8px;text-align:center}
  .mstat b{display:block;font-family:var(--font-heading);font-size:22px;color:var(--text)}
  .mstat span{font-size:11px;color:var(--muted);font-weight:700}
  .mstat-title{font-weight:800;margin:14px 0 8px;font-size:14px}
  .mist-actions{display:none;gap:10px;margin-bottom:14px}
  .mist-actions .btn-start-srs{flex:1}
  .mist-sub{font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5}
  .mist-sub .han{font-family:var(--font-hanzi);color:var(--text)}
  @media(max-width:420px){.mstat-grid{grid-template-columns:1fr 1fr}}`;
  document.head.appendChild(css);

  function injectHome() {
    const grid = document.querySelector('#welcome-screen .mode-grid');
    if (!grid || document.getElementById('btn-order-mode')) return;
    const row = document.createElement('div');
    row.className = 'mode-grid new-modes';
    row.innerHTML = `
      <button class="mode-card order-mode" id="btn-order-mode" onclick="OrderMode.open()"><span class="mode-icon">🔤</span><div class="mode-title">Xếp câu</div><div class="mode-desc">Sắp xếp từ thành câu</div></button>
      <button class="mode-card write-mode" id="btn-write-mode" onclick="WriteMode.open()"><span class="mode-icon">✍️</span><div class="mode-title">Luyện viết</div><div class="mode-desc">Viết chữ Hán</div></button>
      <button class="mode-card pinyin-mode" id="btn-pinyin-mode" onclick="PinyinMode.open()"><span class="mode-icon">⌨️</span><div class="mode-title">Gõ pinyin</div><div class="mode-desc">Nghe/nghĩa → gõ</div></button>`;
    grid.parentNode.insertBefore(row, grid.nextSibling);
    const row2 = document.createElement('div'); row2.className = 'mode-grid new-modes hub-row';
    row2.innerHTML = `<button class="mode-card hub-mode" id="btn-hub-mode" onclick="PracticeHub.open()"><span class="mode-icon">🎯</span><div class="mode-title">Luyện thêm</div><div class="mode-desc">Lộ trình hằng ngày · chính tả · điền từ · thi thử</div></button>`;
    row.parentNode.insertBefore(row2, row.nextSibling);
    row2.querySelectorAll('.mode-card').forEach(el => { try { attachSpotlight(el, { tilt: true }); } catch (e) {} });
    row.querySelectorAll('.mode-card').forEach(el => { try { attachSpotlight(el, { tilt: true }); } catch (e) {} });
  }

  function injectSRS() {
    const tabs = document.getElementById('srs-tabs');
    if (!tabs || document.getElementById('srs-tab-sent')) return;
    tabs.insertAdjacentHTML('beforeend',
      `<button class="hsk-tab" id="srs-tab-sent" onclick="setSRSTab('sent', this)">🧩 Câu sai</button>
       <button class="hsk-tab" id="srs-tab-char" onclick="setSRSTab('char', this)">✍️ Chữ viết lại</button>`);
    const act = document.getElementById('srs-actions');
    act.insertAdjacentHTML('afterend',
      `<div class="mist-actions" id="mist-actions"><button class="btn-start-srs" id="mist-practice" onclick="StudyCore.practiceMistakes()">🚀 Luyện lại</button></div>`);
  }
  SC.practiceMistakes = function () {
    const kind = srsTab === 'char' ? 'char' : 'sent';
    if (kind === 'char') WriteMode.openMistakes(); else OrderMode.openMistakes();
  };
  const _render = window.renderSRSList;
  window.renderSRSList = function () {
    injectSRS();
    const sCount = SC.mistakes('sent').length, cCount = SC.mistakes('char').length;
    const isM = srsTab === 'sent' || srsTab === 'char';
    if (!isM) _render.apply(this, arguments);
    else {
      const now = Date.now();
      document.getElementById('srs-tab-due').textContent = `🔴 Cần ôn (${srsWords.filter(w => w.nextReview <= now).length})`;
      document.getElementById('srs-tab-all').textContent = `📚 Tất cả (${srsWords.length})`;
      document.getElementById('srs-tab-done').textContent = `✅ Đã thuộc (${srsWords.filter(w => (w.box || 1) >= 5).length})`;
    }
    document.getElementById('srs-tab-sent').textContent = `🧩 Câu sai (${sCount})`;
    document.getElementById('srs-tab-char').textContent = `✍️ Chữ viết lại (${cCount})`;
    ['srs-tab-due', 'srs-tab-all', 'srs-tab-done', 'srs-tab-sent', 'srs-tab-char'].forEach(id => {
      const b = document.getElementById(id); b.classList.toggle('active', id === 'srs-tab-' + srsTab);
    });
    if (sCount + cCount > 0) document.getElementById('srs-tabs').style.display = 'flex';
    const ma = document.getElementById('mist-actions');
    ma.style.display = isM ? 'flex' : 'none';
    if (isM) {
      document.getElementById('srs-actions').style.display = 'none';
      const list = document.getElementById('srs-list'), items = SC.mistakes(srsTab === 'char' ? 'char' : 'sent').sort((a, b) => a.nextReview - b.nextReview);
      document.getElementById('mist-practice').style.display = items.length ? '' : 'none';
      document.getElementById('mist-practice').textContent = srsTab === 'char' ? '✍️ Viết lại các chữ này' : '🧩 Xếp lại các câu này';
      if (!items.length) { list.innerHTML = `<div class="srs-empty">${srsTab === 'char' ? '✍️ Chưa có chữ nào cần viết lại.' : '🧩 Chưa có câu nào bị sai.'}</div>`; return; }
      list.innerHTML = '';
      const now = Date.now();
      items.forEach(m => {
        const row = document.createElement('div'); row.className = 'vocab-row srs-row';
        const isDue = m.nextReview <= now, days = Math.ceil((m.nextReview - now) / 86400000), box = Math.max(1, Math.min(5, m.box || 1));
        const big = m.kind === 'char';
        row.innerHTML = `<div class="vocab-info"><div class="vocab-text">${m.level ? `<span class="v-badge hsk-lv">${escapeHTML(m.level)}</span>` : ''}<span class="v-hanzi ${!big && m.text.length > 12 ? 'text-sm' : ''}" style="${big ? 'font-size:34px' : ''}">${escapeHTML(m.text)}</span></div>
          ${m.pinyin ? `<div class="v-pinyin">${escapeHTML(m.pinyin)}</div>` : ''}<div class="v-meaning">${escapeHTML(m.meaning || '')}</div>
          ${m.note ? `<div class="mist-sub">${escapeHTML(m.note)}</div>` : ''}
          <div class="srs-meta"><span class="srs-pips">${'●'.repeat(box)}${'○'.repeat(5 - box)}</span><span>${isDue ? '🔴 Cần ôn' : '⏳ ' + days + ' ngày'}</span><span>❌ sai ${m.wrongCount || 1} lần</span></div></div>
          <div class="vocab-actions"><button class="v-speak" title="Nghe">🔊</button><button class="btn-del" title="Xoá khỏi sổ tay">✕</button></div>`;
        row.querySelector('.v-speak').addEventListener('click', function () { if (!zhVoice) loadVoices(); speakChinese(m.text, this); });
        row.querySelector('.btn-del').addEventListener('click', () => { SC.mistakeRemove(m.id); renderSRSList(); });
        list.appendChild(row);
      });
    }
  };

  const _stats = window.openStats;
  window.openStats = function () {
    const r = _stats.apply(this, arguments);
    try { renderModePanel(); } catch (e) { console.warn('mode stats', e); }
    return r;
  };
  function mins(s) { s = s || 0; return s < 90 ? Math.round(s) + ' giây' : Math.round(s / 60) + ' phút'; }
  function renderModePanel() {
    let box = document.getElementById('mode-stats');
    if (!box) {
      box = document.createElement('div'); box.id = 'mode-stats';
      const hp = document.getElementById('hsk-progress');
      hp.previousElementSibling.parentNode.insertBefore(box, hp.previousElementSibling);
    }
    const o = modeStats.order || {}, w = modeStats.write || {}, pn = modeStats.pinyin || {};
    const oa = o.asked || 0, oc = o.correct || 0, wa = w.asked || 0, wp = w.pass || 0, wr = w.retry || 0;
    const bk = SC.backups();
    box.innerHTML = `
      <div class="mist-sub" style="margin:0 0 10px">💾 ${bk.length ? 'Sao lưu tự động gần nhất: ' + new Date(bk[0].t).toLocaleString('vi-VN') + ' (' + bk[0].why + ') · <a href="#" id="bk-restore" style="color:var(--accent3)">↩ Khôi phục</a>' : 'Chưa có bản sao lưu tự động.'}</div>
      <h3 class="stat-h3">🧩 Xếp câu</h3>
      <div class="mstat-grid"><div class="mstat"><b>${oa}</b><span>Câu đã xếp</span></div><div class="mstat"><b>${oc}</b><span>Xếp đúng</span></div><div class="mstat"><b>${oa ? Math.round(oc / oa * 100) + '%' : '—'}</b><span>Chính xác</span></div></div>
      <h3 class="stat-h3">✍️ Luyện viết</h3>
      <div class="mstat-grid"><div class="mstat"><b>${wa}</b><span>Chữ đã luyện</span></div><div class="mstat"><b>${wp}</b><span>Đạt ≥80%</span></div><div class="mstat"><b>${wr}</b><span>Cần viết lại</span></div></div>
      <h3 class="stat-h3">⌨️ Gõ pinyin</h3>
      <div class="mstat-grid"><div class="mstat"><b>${pn.asked || 0}</b><span>Từ đã gõ</span></div><div class="mstat"><b>${pn.correct || 0}</b><span>Gõ đúng</span></div><div class="mstat"><b>${pn.asked ? Math.round((pn.correct || 0) / pn.asked * 100) + '%' : '—'}</b><span>Chính xác</span></div></div>
      <h3 class="stat-h3">⏱ Thời gian học theo chế độ</h3>
      <div class="mstat-grid"><div class="mstat"><b style="font-size:16px">${mins(timeStats.quiz)}</b><span>Trắc nghiệm</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.order)}</b><span>Xếp câu</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.write)}</b><span>Luyện viết</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.pinyin)}</b><span>Gõ pinyin</span></div><div class="mstat"><b style="font-size:16px">${mins(timeStats.practice)}</b><span>Luyện thêm</span></div></div>`;
    const rb = document.getElementById('bk-restore'); if (rb) rb.onclick = ev => { ev.preventDefault(); SC.restoreBackup(0); };
  }

  const EXTRA = [['modeStats', K.mode], ['modeTime', K.time], ['mistakes', K.mist]];
  const CORE = [['dailyStats', 'cn_quiz_daily_stats', {}], ['srsWords', 'cn_quiz_srs_words', []], ['extraDict', 'cn_quiz_extra_dict', []], ['levelStats', 'cn_quiz_level_stats', {}], ['xp', 'cn_quiz_xp', 0], ['hskEver', 'cn_quiz_hsk_ever', {}], ['hskSeen', 'cn_quiz_hsk_seen', {}]];
  const BK = 'cn_quiz_backups';
  function collect() {
    const data = { _app: 'quiz-tieng-trung', _version: 2, _savedAt: new Date().toISOString() };
    CORE.forEach(([n, k, d]) => { const v = safeStorage.get(k); data[n] = v == null ? d : v; });
    EXTRA.forEach(([n, k]) => { const v = safeStorage.get(k); if (v != null) data[n] = v; });
    return data;
  }
  function apply(d) {
    CORE.forEach(([n, k]) => { if (d[n] != null) safeStorage.set(k, d[n]); });
    EXTRA.forEach(([n, k]) => { if (d[n] != null) safeStorage.set(k, d[n]); });
  }

  function merge(a, b) {
    if (a == null) return b; if (b == null) return a;
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    if (Array.isArray(a) && Array.isArray(b)) {
      const keyOf = x => x && typeof x === 'object' ? (x.id != null ? 'id:' + x.id : x.text != null ? 't:' + x.text : null) : 'v:' + JSON.stringify(x);
      const out = a.slice(), pos = new Map(); out.forEach((x, i) => { const k = keyOf(x); if (k != null) pos.set(k, i); });
      b.forEach(x => { const k = keyOf(x); if (k != null && pos.has(k)) out[pos.get(k)] = merge(out[pos.get(k)], x); else { out.push(x); if (k != null) pos.set(k, out.length - 1); } });
      return out;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      const out = Object.assign({}, a); Object.keys(b).forEach(k => { out[k] = k in a ? merge(a[k], b[k]) : b[k]; }); return out;
    }
    return a;
  }

  function snapshot(why) {
    try {
      const list = safeStorage.get(BK) || [];
      list.push({ t: Date.now(), why: why || 'auto', day: today(), data: collect() });
      while (list.length > 3) list.shift();
      safeStorage.set(BK, list);
    } catch (e) {}
  }
  SC.snapshot = snapshot;
  SC.backups = () => (safeStorage.get(BK) || []).slice().reverse();
  SC.restoreBackup = function (n) {
    const b = SC.backups()[n || 0]; if (!b) { alert('Chưa có bản sao lưu nào.'); return; }
    if (!confirm('Khôi phục dữ liệu về bản ' + new Date(b.t).toLocaleString('vi-VN') + ' (' + b.why + ')? Dữ liệu hiện tại sẽ bị thay thế (vẫn được sao lưu lại trước).')) return;
    snapshot('trước khi khôi phục'); apply(b.data); location.reload();
  };
  try { const l = safeStorage.get(BK) || []; if (!l.length || l[l.length - 1].day !== today()) snapshot('tự động hằng ngày'); } catch (e) {}

  window.exportData = function () {
    const blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'quiz_data_' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  window.importData = function (e) {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = ev => {
      let d; try { d = JSON.parse(ev.target.result); if (!d || typeof d !== 'object') throw 0; } catch (x) { alert('❌ File không hợp lệ!'); return; }
      const mergeIt = confirm('Nhập dữ liệu:\n\nOK = GỘP với dữ liệu hiện tại (giữ số liệu cao hơn, không mất tiến trình ở cả 2 máy)\nHuỷ = GHI ĐÈ hoàn toàn bằng file này');
      snapshot('trước khi nhập file');
      if (mergeIt) {
        const cur = collect(), out = {};
        CORE.concat(EXTRA.map(([n, k]) => [n, k, null])).forEach(([n]) => { if (cur[n] != null || d[n] != null) out[n] = merge(cur[n], d[n]); });
        apply(out);
      } else apply(d);
      alert('✅ Nhập dữ liệu thành công (' + (mergeIt ? 'đã gộp' : 'đã ghi đè') + ')! Trang sẽ tải lại.'); location.reload();
    };
    rd.readAsText(file); e.target.value = '';
  };
  SC._merge = merge;
  const _reset = window.confirmReset;
  window.confirmReset = function () { snapshot('trước khi reset'); [K.mode, K.time, K.claims, K.mist, 'cn_quiz_write_cache'].forEach(k => safeStorage.remove(k)); return _reset.apply(this, arguments); };

  window.addEventListener('load', injectHome);
  if (document.readyState === 'complete') injectHome();
})();
