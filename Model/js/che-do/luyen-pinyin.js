

(function () {
  'use strict';
  const LS_LEVEL = 'cn_quiz_pinyin_level', LS_SEEN = 'cn_quiz_pinyin_seen', LS_KIND = 'cn_quiz_pinyin_kind';
  const LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả'];
  const KINDS = [['mix', '🎲 Trộn'], ['listen', '🎧 Nghe'], ['meaning', '📖 Nghĩa']];
  const SC = () => window.StudyCore;
  const $ = id => document.getElementById(id);
  const V = 'aeiouv', isV = c => !!c && V.includes(c);

  const TONE = {};
  [['a', 'āáǎà'], ['e', 'ēéěè'], ['i', 'īíǐì'], ['o', 'ōóǒò'], ['u', 'ūúǔù'], ['v', 'ǖǘǚǜ']].forEach(([b, s]) => [...s].forEach((c, i) => TONE[c] = [b, i + 1]));
  function fold(str) {
    let base = '', tone = [];
    for (const c0 of String(str).toLowerCase()) {
      const c = c0 === 'ü' ? 'v' : c0;
      if (TONE[c]) { base += TONE[c][0]; tone.push(TONE[c][1]); } else { base += c; tone.push(0); }
    }
    return { base, tone };
  }
  function splitSyl(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const st = i;
      if (/^(zh|ch|sh)/.test(s.slice(i, i + 2))) i += 2; else if (!isV(s[i])) i += 1;
      while (i < s.length && isV(s[i])) i++;
      if (i < s.length) {
        if (s.startsWith('ng', i) && !isV(s[i + 2])) i += 2;
        else if (s[i] === 'n' && !isV(s[i + 1])) i += 1;
        else if (s[i] === 'r' && !isV(s[i + 1]) && i > st) i += 1;
      }
      out.push([st, i]);
    }
    return out;
  }
  function parseTarget(py) {
    const first = String(py || '').replace(/[\[［].*?[\]］]/g, '').replace(/[（(].*?[）)]/g, '').split(/[\/／]/)[0];
    const syl = [], tones = [];
    first.split(/[\s'’\-·,，]+/).forEach(chunk => {
      chunk = chunk.replace(/[^a-zA-ZāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ]/g, ''); if (!chunk) return;
      const f = fold(chunk);
      splitSyl(f.base).forEach(([a, b]) => { syl.push(f.base.slice(a, b)); tones.push(f.tone.slice(a, b).find(t => t) || 0); });
    });
    return { syl, tones, key: syl.join('') };
  }
  function parseInput(raw) {
    const syl = [], tones = []; let buf = '';
    const flush = d => {
      if (!buf) return;
      const f = fold(buf); buf = '';
      const parts = splitSyl(f.base);
      parts.forEach(([a, b], k) => { syl.push(f.base.slice(a, b)); const mark = f.tone.slice(a, b).find(t => t); tones.push(mark ? mark : (k === parts.length - 1 && d != null ? d : null)); });
    };
    const s = String(raw || '').toLowerCase().replace(/u:/g, 'v');
    for (const c of s) {
      if (/[0-5]/.test(c)) flush(Number(c)); else if (/[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüv]/.test(c)) buf += c; else flush(null);
    }
    flush(null);
    return { syl, tones, key: syl.join(''), hasTone: tones.some(t => t !== null) };
  }
  const numbered = t => t.syl.map((s, i) => s.replace(/v/g, 'ü') + (t.tones[i] || '')).join(' ');

  let idx = null, idxSig = '';
  const LV = { HSK1: 1, HSK2: 2, HSK3: 3, HSK4: 4, HSK5: 5, HSK6: 6 };
  function lexicon() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictWords ? window.dictWords.length : 0);
    if (idx && sig === idxSig) return idx;
    const map = new Map(), seen = new Set(), list = [];
    const add = (text, pinyin, meaning, level) => {
      text = String(text || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
      if (!text || !/^[一-鿿]{1,6}$/.test(text)) return;
      const t = parseTarget(pinyin); if (!t.syl.length || t.syl.length !== [...text].length && Math.abs(t.syl.length - [...text].length) > 1) return;
      if (seen.has(text + '|' + t.key)) return; seen.add(text + '|' + t.key);
      const e = { text, pinyin: String(pinyin || ''), meaning: String(meaning || '').trim(), level: level || 'Data', key: t.key, syl: t.syl, tones: t.tones, rank: LV[level] || 7 };
      (map.get(e.key) || map.set(e.key, []).get(e.key)).push(e); list.push(e);
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => add(w.text, w.pinyin, w.meaning, w.level));
    (window.dictWords || []).forEach(w => add(w.text, w.pinyin, w.meaning, 'Data'));
    map.forEach(a => a.sort((x, y) => x.rank - y.rank || x.text.length - y.text.length));
    idx = { map, list }; idxSig = sig; return idx;
  }
  function candidates(inp) {
    if (!inp.key) return { list: [], loose: false };
    const all = lexicon().map.get(inp.key) || [];
    if (!inp.hasTone) return { list: all, loose: false };
    const ok = all.filter(e => e.syl.length === inp.syl.length && inp.tones.every((t, i) => t === null || (t === 5 ? 0 : t) === e.tones[i]));
    return ok.length ? { list: ok, loose: false } : { list: all, loose: true };
  }

  let level = 'HSK1', kind = safeStorage.get(LS_KIND) || 'mix', rounds = [], i = 0, st = null, locked = false, cur = { list: [], loose: false }, parsed = null;
  if (!KINDS.some(k => k[0] === kind)) kind = 'mix';
  function gather(lv) {
    const out = [];
    lexicon().list.forEach(e => { if ((lv === 'Tất cả' || e.level === lv) && e.meaning && e.syl.length >= 1 && e.syl.length <= 4 && [...e.text].length === e.syl.length) out.push(e); });
    return out;
  }
  function pick(pool, n) {
    const store = safeStorage.get(LS_SEEN) || {}, seen = new Set(store[level] || []);
    let fresh = pool.filter(p => !seen.has(p.text));
    if (fresh.length < n) { seen.clear(); fresh = pool; }
    const chosen = shuffle(fresh).slice(0, n);
    store[level] = [...seen, ...chosen.map(c => c.text)]; safeStorage.set(LS_SEEN, store);
    return chosen;
  }
  function build() {
    if ($('pinyin-screen')) return;
    const css = document.createElement('style');
    css.textContent = `
    #pinyin-screen{display:none;width:100%}
    .pn-lv{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px}
    .pn-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-align:center}
    .pn-prompt .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:800}
    .pn-prompt .vi{font-size:22px;font-weight:700;line-height:1.4;margin-top:6px}
    .pn-prompt .pn-speak{margin-top:6px}
    .pn-in{width:100%;box-sizing:border-box;padding:14px 16px;border-radius:var(--radius-md);border:2px solid var(--border);background:var(--surface);color:var(--text);font:700 22px var(--font-body);letter-spacing:.02em;outline:none}
    .pn-in:focus{border-color:var(--accent)}
    .pn-in.good{border-color:var(--correct)} .pn-in.bad{border-color:var(--wrong)}
    .pn-tip{font-size:12px;color:var(--muted);line-height:1.5}
    .pn-cands{display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;min-height:60px}
    .pn-cand{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 14px;border-radius:var(--radius-md);background:var(--surface2);border:1px solid var(--border);color:var(--text);cursor:pointer;min-width:64px;max-width:48%}
    .pn-cand:hover,.pn-cand.first{border-color:var(--accent)}
    .pn-cand .h{font-family:var(--font-hanzi);font-size:26px;font-weight:700;line-height:1.1}
    .pn-cand .p{font-size:11px;color:var(--accent3);font-weight:700}
    .pn-cand .m{font-size:10.5px;color:var(--muted);max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pn-cand.loose{opacity:.6}
    .pn-cand.ok{border-color:var(--correct);background:color-mix(in oklab,var(--correct) 18%,var(--surface2))}
    .pn-cand.bad{border-color:var(--wrong);background:color-mix(in oklab,var(--wrong) 18%,var(--surface2))}
    .pn-msg{font-size:13px;color:var(--muted);padding:6px 2px}
    .pn-actions{display:flex;gap:8px;flex-wrap:wrap}
    .pn-actions button{flex:1;min-width:90px;padding:11px 6px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading);font-size:13px}
    .pn-actions button:disabled{opacity:.45;cursor:default}
    .pn-fb{display:none;padding:12px 14px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);line-height:1.55}
    .pn-fb.show{display:block} .pn-fb.good{border-color:var(--correct)} .pn-fb.bad{border-color:var(--wrong)}
    .pn-fb .han{font-family:var(--font-hanzi);font-size:24px;font-weight:700}
    .pn-fb .py{color:var(--accent3);font-size:14px}
    .pn-fb .note{font-size:12.5px;color:var(--muted);margin-top:6px}
    @media all{
      #pinyin-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #pinyin-screen .screen-header{margin:0}
      .pn-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}
      .pn-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}
      #pn-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #pn-body>*{margin:0!important;flex-shrink:0}
      .pn-prompt{padding:9px 12px}.pn-prompt .vi{font-size:clamp(16px,calc(2.8 * var(--hu)),22px);margin-top:3px}
      .pn-in{padding:10px 12px;font-size:20px}
      .pn-cands{flex:1 1 0;min-height:0;overflow-y:auto;scrollbar-width:none;gap:6px}
      .pn-cand{padding:5px 10px}.pn-cand .h{font-size:22px}
      .pn-actions{gap:6px}.pn-actions button{padding:9px 4px;min-width:0;font-size:12px}
      .pn-fb{padding:8px 10px;font-size:12px;max-height:calc(24 * var(--hu));overflow-y:auto}.pn-fb .han{font-size:19px}
      #pn-body>.btn-next{flex:0 0 auto}
    }`;
    document.head.appendChild(css);
    const d = document.createElement('div'); d.id = 'pinyin-screen';
    d.innerHTML = `
      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">⌨️ Gõ pinyin</h2></div>
      <div class="pn-lv" id="pn-lv"></div>
      <div id="pn-body">
        <div class="quiz-header"><span class="mode-badge" id="pn-badge">⌨️ Gõ pinyin</span><span class="question-counter" id="pn-counter">1 / 10</span><div class="header-actions"></div></div>
        <div class="progress-track"><div class="progress-fill" id="pn-progress" style="width:0%"></div></div>
        <div class="pn-prompt"><div class="lbl" id="pn-lbl"></div><div class="vi" id="pn-vi"></div><div class="pn-speak" id="pn-speakrow"><button class="btn-speak" id="pn-speak" type="button">🔊</button> <button class="tts-rate-btn" id="pn-rate" type="button">🚶 0.85x</button><button class="tts-rate-btn tts-replay" id="pn-replay" type="button">🔊 Nghe lại</button></div></div>
        <input class="pn-in" id="pn-in" type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="gõ pinyin: ni3 hao3 hoặc nihao">
        <div class="pn-tip">Thanh điệu gõ số 1-5 sau mỗi âm (ni3 hao3) hoặc bỏ qua (nihao) · ü gõ v (nv) · Enter chọn chữ đầu · chọn đúng chữ Hán.</div>
        <div class="pn-cands" id="pn-cands"></div>
        <div class="pn-actions"><button id="pn-hint">💡 Gợi ý</button><button id="pn-kind">🎲 Trộn</button><button id="pn-show">👁 Đáp án</button></div>
        <div class="pn-fb" id="pn-fb"></div>
        <button class="btn-next" id="pn-next">Câu tiếp →</button>
      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('pn-in').addEventListener('input', onInput);
    $('pn-in').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); if (locked) next(); else if (cur.list.length) choose(cur.list[0]); }
      else if (e.key === 'Escape') { $('pn-in').value = ''; onInput(); }
    });
    $('pn-hint').onclick = hint; $('pn-show').onclick = showAnswer; $('pn-next').onclick = next;
    $('pn-kind').onclick = () => { kind = KINDS[(KINDS.findIndex(k => k[0] === kind) + 1) % KINDS.length][0]; safeStorage.set(LS_KIND, kind); start(level); };
    $('pn-speak').onclick = speak;
    $('pn-rate').onclick = () => cycleTTSRate(speak); $('pn-replay').onclick = speak;
  }
  function drawLevels() {
    $('pn-lv').innerHTML = custom ? `<span class="pn-msg">${escapeHTML(custom.title || 'Luyện tập')}</span>` : LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('pn-lv').querySelectorAll('button').forEach(b => b.onclick = () => { level = b.dataset.l; safeStorage.set(LS_LEVEL, level); start(level); });
    const k = KINDS.find(x => x[0] === kind); $('pn-kind').textContent = k[1];
  }
  function open() { build(); level = safeStorage.get(LS_LEVEL) || 'HSK1'; if (!LEVELS.includes(level)) level = 'HSK1'; start(level); }
  let custom = null;
  function start(lv, opts) {
    custom = opts && opts.pool ? opts : null;
    build(); show('pinyin-screen'); level = lv; drawLevels(); resetSession();
    currentGameStarter = () => start(level, custom);
    const pool = custom ? custom.pool : gather(lv);
    if (pool.length < 3) { $('pn-body').innerHTML = `<div class="pn-msg" style="text-align:center;padding:30px 10px">Chưa đủ từ cho ${escapeHTML(lv)}. Hãy chắc chắn file HSK tương ứng đã được tải.</div>`; return; }
    if (!$('pn-in')) { $('pinyin-screen').remove(); build(); show('pinyin-screen'); drawLevels(); }
    rounds = custom ? shuffle(pool.slice()).slice(0, custom.n || 10) : pick(pool, 10); i = 0; setRound();
  }
  const canSpeak = () => typeof ttsSupported !== 'undefined' && ttsSupported && typeof voiceEnabled !== 'undefined' && voiceEnabled;
  function setRound() {
    const it = rounds[i];
    const k = kind === 'mix' ? (Math.random() < 0.5 ? 'listen' : 'meaning') : kind;
    st = { item: it, kind: canSpeak() || k === 'meaning' ? k : 'meaning', hinted: false, recorded: false, tries: 0 };
    locked = false; parsed = null; cur = { list: [], loose: false };
    $('pn-counter').textContent = `${i + 1} / ${rounds.length}`;
    $('pn-progress').style.width = (i / rounds.length * 100) + '%';
    $('pn-fb').className = 'pn-fb'; $('pn-fb').innerHTML = '';
    $('pn-next').classList.remove('visible');
    const inp = $('pn-in'); inp.value = ''; inp.disabled = false; inp.className = 'pn-in';
    $('pn-hint').disabled = false; $('pn-show').disabled = false;
    drawPrompt(); renderCands();
    setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }, 50);
    if (st.kind === 'listen') setTimeout(() => { if (st && st.item === it && !locked) speak(); }, 350);
  }
  function drawPrompt() {
    const lis = st.kind === 'listen';
    $('pn-lbl').textContent = lis ? 'Nghe rồi gõ pinyin, chọn chữ Hán' : 'Gõ pinyin của từ có nghĩa:';
    $('pn-vi').textContent = lis && !st.showMeaning ? '❓' : st.item.meaning;
    $('pn-speakrow').style.display = lis ? '' : 'none';
    $('pn-badge').textContent = lis ? '🎧 Nghe · gõ' : '📖 Nghĩa · gõ';
    refreshTTSBtns();
  }
  function speak() { if (!st) return; if (!zhVoice) loadVoices(); speakChinese(st.item.text, $('pn-speak')); }
  function onInput() {
    if (locked) return;
    parsed = parseInput($('pn-in').value); cur = candidates(parsed);
    $('pn-in').className = 'pn-in'; $('pn-fb').className = 'pn-fb';
    renderCands();
  }
  function renderCands() {
    const box = $('pn-cands');
    if (!parsed || !parsed.key) { box.innerHTML = '<div class="pn-msg">Chữ Hán ứng viên sẽ hiện ở đây khi bạn gõ pinyin…</div>'; return; }
    if (!cur.list.length) { box.innerHTML = `<div class="pn-msg">Không có từ nào đọc là “${escapeHTML(parsed.syl.join(' '))}”. Kiểm tra lại chính tả pinyin.</div>`; return; }
    const note = cur.loose ? '<div class="pn-msg" style="width:100%">Không có từ nào khớp thanh điệu bạn gõ — đang hiện các từ cùng âm:</div>' : '';
    box.innerHTML = note + cur.list.slice(0, 12).map((e, n) => `<button type="button" class="pn-cand ${n === 0 ? 'first' : ''} ${cur.loose ? 'loose' : ''}" data-n="${n}"><span class="h">${escapeHTML(e.text)}</span><span class="p">${escapeHTML(numbered(e))}</span><span class="m">${escapeHTML(e.meaning)}</span></button>`).join('');
    box.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => choose(cur.list[Number(b.dataset.n)], b));
  }
  function hint() {
    if (locked || !st) return;
    st.hinted = true; st.showMeaning = true; drawPrompt();
    const t = parseTarget(st.item.pinyin);
    const fb = $('pn-fb'); fb.className = 'pn-fb show';
    fb.innerHTML = `<b>💡 Gợi ý</b><div class="note">${t.syl.length} âm tiết · bắt đầu bằng “${escapeHTML(t.key[0] || '')}” · thanh điệu: ${t.tones.map(x => x || 'nhẹ').join('-')}. Câu có dùng gợi ý không tính điểm.</div>`;
  }
  function settle(ok) {
    st.recorded = true;
    const it = st.item, item = { text: it.text, pinyin: it.pinyin, meaning: it.meaning, level: it.level === 'Data' ? 'Khác' : it.level };
    SC().record('pinyin', it.text, ok, item, ['asked'].concat(ok ? ['correct'] : []));
    if (ok) SC().mistakeRight('pinyin', it.text); else SC().mistakeWrong('pinyin', it.text, { text: it.text, pinyin: it.pinyin, meaning: it.meaning, level: it.level === 'Data' ? '' : it.level });
  }
  function same(e) { const it = st.item, k = parseTarget(it.pinyin).key; return e.key === k && (e.text === it.text || e.meaning === it.meaning); }
  function choose(e, btn) {
    if (locked || !e) return;
    const it = st.item, t = parseTarget(it.pinyin), fb = $('pn-fb');
    st.tries++;
    if (same(e)) {
      const toneBad = parsed && parsed.hasTone && parsed.syl.length === t.syl.length && parsed.tones.some((x, n) => x !== null && (x === 5 ? 0 : x) !== t.tones[n]);
      if (toneBad) {
        if (!st.recorded && !st.hinted) settle(false);
        $('pn-in').className = 'pn-in bad'; fb.className = 'pn-fb show bad';
        fb.innerHTML = `<b>⚠️ Đúng chữ nhưng sai thanh điệu</b><div class="note">Bạn gõ ${escapeHTML(parsed.syl.map((s, n) => s + (parsed.tones[n] || '')).join(' '))}, đúng là <b>${escapeHTML(numbered(t))}</b>. Gõ lại với thanh đúng.</div>`;
        return;
      }
      if (!st.recorded && !st.hinted) settle(true);
      locked = true; $('pn-in').className = 'pn-in good'; if (btn) btn.classList.add('ok');
      success(true);
    } else {
      if (!st.recorded && !st.hinted) settle(false);
      if (btn) btn.classList.add('bad');
      $('pn-in').className = 'pn-in bad'; fb.className = 'pn-fb show bad';
      const homo = e.key === t.key;
      fb.innerHTML = `<b>❌ ${homo ? 'Đúng cách đọc nhưng sai chữ Hán' : 'Chưa đúng'}</b><div class="note">${homo ? `Đề cần từ có nghĩa “${escapeHTML(it.meaning)}”. Thử chữ khác trong danh sách.` : 'Hãy nghe/đọc lại nghĩa, sửa pinyin rồi chọn lại, hoặc bấm “Đáp án”.'}</div>`;
    }
  }
  function success(ok) {
    const it = st.item, t = parseTarget(it.pinyin), fb = $('pn-fb');
    fb.className = 'pn-fb show ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<b>${ok ? '✅ Chính xác!' : 'Đáp án'}</b><div class="han">${escapeHTML(it.text)}</div><div class="py">${escapeHTML(it.pinyin)} · gõ: <b>${escapeHTML(numbered(t))}</b> hoặc <b>${escapeHTML(t.key.replace(/v/g, 'v'))}</b></div><div>${escapeHTML(it.meaning)}</div>` + (st.hinted ? '<div class="note">Đã dùng gợi ý nên không tính điểm.</div>' : '');
    $('pn-in').disabled = true; $('pn-hint').disabled = true; $('pn-show').disabled = true; locked = true;
    st.showMeaning = true; drawPrompt();
    const nx = $('pn-next'); nx.classList.add('visible'); nx.textContent = i + 1 >= rounds.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (typeof autoSpeakQ !== 'undefined' && autoSpeakQ) { try { speakChinese(it.text); } catch (e) {} }
  }
  function showAnswer() { if (locked || !st) return; if (!st.recorded && !st.hinted) settle(false); st.hinted = true; success(false); }
  function next() {
    if (!locked) return;
    i++;
    if (i >= rounds.length) {
      const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
      if (PM.onFinish) { const f = PM.onFinish; PM.onFinish = null; f({ ok, total: tot }); return; }
      showFinal({ score: ok, totalText: '/ ' + (tot || rounds.length), pct: tot ? ok / tot * 100 : 0, title: 'Hoàn thành Gõ pinyin', sub: 'Từ đã làm hôm nay không cộng thêm điểm' });
      const b = document.getElementById('btn-practice-wrong'); if (b) b.classList.remove('show'); window._lastWrongTexts = [];
      return;
    }
    setRound();
  }
  document.addEventListener('keydown', e => {
    const sc = $('pinyin-screen'); if (!sc || sc.style.display !== 'block' || !st) return;
    if (e.key === 'Enter' && locked && document.activeElement !== $('pn-in')) { e.preventDefault(); next(); }
  });

  function openMistakes() {
    build(); const L = lexicon().list;
    const due = SC().mistakes('pinyin').sort((a, b) => a.nextReview - b.nextReview).slice(0, 10)
      .map(m => L.find(e => e.text === m.text) || (m.pinyin ? Object.assign({ key: parseTarget(m.pinyin).key, level: m.level || 'Data' }, m, { syl: parseTarget(m.pinyin).syl, tones: parseTarget(m.pinyin).tones }) : null)).filter(e => e && e.key);
    if (due.length < 1) { show('pinyin-screen'); drawLevels(); $('pn-body').innerHTML = '<div class="pn-msg" style="text-align:center;padding:30px 10px">Chưa có từ gõ sai nào để ôn. 🎉</div>'; return; }
    start('Sổ tay', { pool: due, n: due.length, title: '📒 Ôn từ gõ sai' });
  }
  const PM = window.PinyinMode = { open, start, openMistakes, build, lexicon, numbered, fold, splitSyl, parseInput, parseTarget, candidates, _state: () => ({ st, rounds, i, parsed, cur }) };
  PM.onFinish = null;
})();
