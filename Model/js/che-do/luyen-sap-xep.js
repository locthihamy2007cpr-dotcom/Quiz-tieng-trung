

(function () {
  'use strict';
  const LS_LEVEL = 'cn_quiz_order_level', LS_SEEN = 'cn_quiz_order_seen';
  const LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả'];
  const PUNCT = /[，。！？、；：,.!?;:“”"'‘’（）()《》…—~～·\s]/;
  const HAN = /[一-鿿]/;
  const SC = () => window.StudyCore;
  const FS = () => (window.FitScale && window.FitScale.s) || 1;
  const $ = id => document.getElementById(id);
  let showHz = safeStorage.get('cn_quiz_order_hz') !== false;
  let level = 'HSK1', rounds = [], idx = 0, st = null, locked = false, active = false, lexCache = null, lexSig = '';

  function lexicon() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictWords ? window.dictWords.length : 0);
    if (lexCache && sig === lexSig) return lexCache;
    const L = new Set(), add = t => { t = String(t || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, ''); if (t && t.length <= 5 && /^[一-鿿]+$/.test(t)) L.add(t); };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => add(w.text));
    (window.dictWords || []).forEach(w => add(w.text));
    ['我们', '你们', '他们', '她们', '什么', '怎么', '为什么', '不是', '没有', '可以', '一起', '知道', '喜欢', '今天', '明天', '昨天', '现在', '朋友', '老师', '学生', '谢谢'].forEach(w => L.add(w));
    lexCache = L; lexSig = sig; return L;
  }
  function segment(text) {
    const L = lexicon(), chars = [...text], n = chars.length;
    const best = new Array(n + 1).fill(Infinity), prev = new Array(n + 1).fill(0), len = new Array(n + 1).fill(1);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      if (!HAN.test(chars[i])) {
        if (best[i] < best[i + 1]) { best[i + 1] = best[i]; prev[i + 1] = i; len[i + 1] = 1; } continue;
      }
      for (let l = 1; l <= 5 && i + l <= n; l++) {
        const w = chars.slice(i, i + l).join('');
        const c = l === 1 ? (L.has(w) ? 1 : 1.7) : (L.has(w) ? 1 - 0.05 * l + 0 : Infinity);
        if (best[i] + c < best[i + l]) { best[i + l] = best[i] + c; prev[i + l] = i; len[i + l] = l; }
      }
    }
    const out = []; let p = n; while (p > 0) { out.unshift(chars.slice(prev[p], p).join('')); p = prev[p]; }

    const toks = []; let lead = '';
    out.forEach(t => {
      if (!HAN.test(t) && PUNCT.test(t)) { if (toks.length) toks[toks.length - 1] += t; else lead += t; }
      else { toks.push(lead + t); lead = ''; }
    });
    return toks.filter(t => HAN.test(t) || /\d|[a-zA-Z]/.test(t));
  }
  const core = s => String(s).replace(/[，。！？、；：,.!?;:“”"'‘’（）()《》…—~～·\s]/g, '');

  const FIN = new Set('a o e ai ei ao ou an en ang eng ong er i ia ie iao iu ian in iang ing iong u ua uo uai ui uan un uang ueng ue v ve van vn'.split(' '));
  const INI = ['', 'zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
  const baseCh = c => { if ('üǖǘǚǜÜ'.includes(c)) return 'v'; const d = c.normalize('NFD')[0]; return d.toLowerCase(); };
  const validSyl = t => INI.some(i => t.startsWith(i) && t.length > i.length && FIN.has(t.slice(i.length)));
  function splitChunk(orig) {
    const plain = [...orig].map(baseCh).join(''), n = plain.length, best = new Array(n + 1).fill(Infinity), prev = new Array(n + 1).fill(-1);
    best[0] = 0;
    for (let i = 0; i < n; i++) { if (best[i] === Infinity) continue; for (let l = 1; l <= 6 && i + l <= n; l++) if (validSyl(plain.slice(i, i + l)) && best[i] + 1 < best[i + l]) { best[i + l] = best[i] + 1; prev[i + l] = i; } }
    if (best[n] === Infinity) return null;
    const out = []; let p = n; const chars = [...orig]; while (p > 0) { out.unshift(chars.slice(prev[p], p).join('')); p = prev[p]; } return out;
  }
  function syllables(pinyin, K) {
    const chunks = String(pinyin || '').replace(/[^\p{L}'’\s]/gu, ' ').split(/[\s'’]+/).filter(Boolean), all = [];
    for (const ch of chunks) { const r = splitChunk(ch); if (!r) return null; all.push(...r); }
    return all.length === K ? all : null;
  }
  function dictPinyin(t) {
    const clean = x => String(x || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
    if (typeof hskAll !== 'undefined') { const w = hskAll.find(x => clean(x.text) === t && x.pinyin); if (w) return String(w.pinyin).split(/[\/／,，;；]/)[0].trim(); }
    const d = (window.dictWords || []).find(x => clean(x.text) === t && x.pinyin); return d ? String(d.pinyin).trim() : null;
  }
  const hanLen = t => (t.match(/[\u4e00-\u9fff]/g) || []).length;
  function tokensPinyin(item) {
    const K = hanLen(item.text), sy = syllables(item.pinyin, K); let pos = 0;
    return item.tokens.map(t => {
      const k = hanLen(t); if (!k) return null;
      if (sy) { const out = sy.slice(pos, pos + k).join('').toLowerCase(); pos += k; return out; }
      pos += k; const d = dictPinyin(t.replace(/[^\u4e00-\u9fff]/g, '')); return d ? d.toLowerCase() : null;
    });
  }

  function gather(lv) {
    const arr = [];
    const push = (text, pinyin, meaning, level) => {
      text = String(text || '').trim(); meaning = String(meaning || '').trim();
      if (!text || !meaning || !HAN.test(text)) return;
      const c = core(text); if (c.length < 4 || c.length > 26) return;
      arr.push({ text, pinyin: pinyin || '', meaning, level });
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => { if (w.example && (lv === 'Tất cả' || w.level === lv)) push(w.example, w.examplePinyin, w.exampleMeaning, w.level); });
    if (lv === 'Tất cả') (window.dictSentences || []).forEach(s => push(s.text, s.pinyin, s.meaning, 'Data'));
    const seen = new Set(), out = [];
    arr.forEach(s => { if (seen.has(s.text)) return; seen.add(s.text); const t = segment(s.text); if (t.length >= 3 && t.length <= 9) { s.tokens = t; out.push(s); } });
    return out;
  }

  const RULES = [
    [/把/, 'Cấu trúc 把: Chủ ngữ + 把 + Tân ngữ + Động từ + thành phần khác (了/结果/地点).'],
    [/被/, 'Câu bị động: Tân ngữ + 被 + (Người làm) + Động từ + thành phần khác.'],
    [/是.*的/, 'Mẫu 是…的 nhấn mạnh thời gian/nơi chốn/cách thức của hành động đã xảy ra.'],
    [/吗[？?]?$/, '吗 đặt cuối câu trần thuật để tạo câu hỏi có/không.'],
    [/呢[？?。]?$/, '呢 đặt cuối câu để hỏi tiếp ("thế còn…?") hoặc nhấn mạnh trạng thái.'],
    [/(什么|谁|哪|几|怎么|为什么|多少)/, 'Từ để hỏi giữ nguyên vị trí của thành phần được hỏi (không đảo lên đầu như tiếng Việt).'],
    [/(今天|明天|昨天|现在|早上|晚上|每天|去年|明年|上午|下午)/, 'Từ chỉ thời gian đứng sau chủ ngữ (hoặc đầu câu), trước động từ.'],
    [/不|没/, '不/没 đứng ngay trước động từ hoặc tính từ được phủ định.'],
    [/(很|非常|太|最|比较)/, 'Phó từ mức độ 很/非常/太… đứng trước tính từ.'],
    [/在/, '在 + nơi chốn thường đứng trước động từ: 我在家学习.'],
    [/得/, '得 nối động từ với bổ ngữ trạng thái/mức độ: động từ + 得 + tính từ.'],
    [/了/, '了 sau động từ báo hoàn thành; cuối câu báo thay đổi/tình huống mới.'],
    [/的/, '的 nối định ngữ với danh từ: định ngữ + 的 + danh từ.'],
    [/(想|要|会|能|可以)/, 'Động từ năng nguyện (想/要/会/能/可以) đứng trước động từ chính.']
  ];
  function grammarNotes(text) { const o = []; RULES.forEach(([re, t]) => { if (re.test(text) && o.length < 2) o.push(t); }); return o; }

  function build() {
    if ($('order-screen')) return;
    const css = document.createElement('style');
    css.textContent = `
    #order-screen{display:none;width:100%}
    .ord-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .ord-lv{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px}
    .ord-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;text-align:center;margin-bottom:14px}
    .ord-prompt .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:800}
    .ord-prompt .vi{font-size:19px;font-weight:700;line-height:1.45;margin-top:6px}
    .ord-zone{min-height:74px;border:2px dashed var(--border);border-radius:var(--radius-lg);padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;margin-bottom:12px;background:color-mix(in oklab,var(--surface) 70%,transparent);transition:border-color .2s}
    .ord-zone.over{border-color:var(--accent)}
    .ord-zone.empty::before{content:attr(data-ph);color:var(--muted);font-size:13px;margin:auto}
    .ord-chip{touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;padding:10px 16px;border-radius:var(--radius-md);background:var(--surface2);border:1px solid var(--border);font-family:var(--font-hanzi);font-size:24px;font-weight:600;color:var(--text);box-shadow:var(--shadow-1);transition:transform .15s,border-color .15s,background .15s}
    .ord-chip:hover{border-color:var(--accent);transform:translateY(-2px)}
    .ord-chip.py{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 14px}
    .ord-chip .cp{font-family:var(--font-body);font-size:19px;font-weight:700;color:var(--accent3);letter-spacing:.01em}
    .ord-chip .ch{font-family:var(--font-hanzi);font-size:13px;font-weight:500;color:var(--muted);line-height:1}
    .ord-chip.ghosted{opacity:.25}
    .ord-chip.before{box-shadow:-5px 0 0 0 var(--accent)}
    .ord-chip.ok{border-color:var(--correct);background:color-mix(in oklab,var(--correct) 18%,var(--surface2))}
    .ord-chip.bad{border-color:var(--wrong);background:color-mix(in oklab,var(--wrong) 18%,var(--surface2))}
    .ord-zone.endmark{box-shadow:inset -5px 0 0 0 var(--accent)}
    .ord-float{position:fixed;z-index:9999;pointer-events:none;opacity:.92;transform:scale(1.08);box-shadow:var(--shadow-3)}
    .ord-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
    .ord-actions button{flex:1;min-width:110px;padding:13px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading)}
    .ord-actions button.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;color:#fff}
    .ord-actions button:disabled{opacity:.45;cursor:default}
    .ord-fb{display:none;margin-top:14px;padding:14px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);line-height:1.55}
    .ord-fb.show{display:block}
    .ord-fb.good{border-color:var(--correct)} .ord-fb.bad{border-color:var(--wrong)}
    .ord-fb .han{font-family:var(--font-hanzi);font-size:22px;font-weight:700}
    .ord-fb .py{color:var(--accent3);font-size:14px}
    .ord-fb .note{font-size:13px;color:var(--muted);margin-top:8px}
    .ord-empty{padding:30px 16px;text-align:center;color:var(--muted);line-height:1.6}
    @media all{
      #ord-body>.btn-next{flex:0 0 auto}
      #order-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #order-screen .screen-header{margin:0}
      .ord-top{margin:0}.ord-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}
      .ord-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}
      .ord-prompt{padding:9px 12px;margin:0!important}.ord-prompt .vi{font-size:clamp(15px,calc(2.6 * var(--hu)),19px);margin-top:3px;line-height:1.35}
      .ord-prompt .lbl{font-size:9.5px}
      #ord-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #ord-body>*{margin:0!important;flex-shrink:0}
      .ord-zone{min-height:0;flex:1 1 0;padding:7px;gap:6px;margin:0!important;overflow-y:auto;scrollbar-width:none}
      .ord-chip{padding:6px 11px;font-size:20px}
      .ord-chip.py{padding:5px 10px}.ord-chip .cp{font-size:16px}.ord-chip .ch{font-size:11px}
      .ord-actions{margin:0;gap:6px}.ord-actions button{padding:9px 4px;min-width:0;font-size:12px}
      .ord-fb{margin:0;padding:8px 10px;font-size:12px;max-height:calc(24 * var(--hu));overflow-y:auto}.ord-fb .han{font-size:17px}
      #ord-body #ord-bank{min-height:0!important}
    }`;
    document.head.appendChild(css);
    const d = document.createElement('div'); d.id = 'order-screen';
    d.innerHTML = `
      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">🧩 Xếp câu</h2></div>
      <div class="ord-lv" id="ord-lv"></div>
      <div id="ord-body">
        <div class="quiz-header"><span class="mode-badge" id="ord-badge">🧩 Xếp câu</span><span class="question-counter" id="ord-counter">1 / 10</span><div class="header-actions"><button class="btn-icon" id="ord-speak" title="Nghe câu (hiện đáp án)">🔊</button></div></div>
        <div class="progress-track"><div class="progress-fill" id="ord-progress" style="width:0%"></div></div>
        <div class="ord-prompt"><div class="lbl">Xếp các từ thành câu có nghĩa</div><div class="vi" id="ord-vi"></div></div>
        <div class="ord-zone empty" id="ord-answer" data-ph="Bấm hoặc kéo các từ vào đây"></div>
        <div class="ord-zone" id="ord-bank" style="border-style:solid"></div>
        <div class="ord-actions"><button id="ord-hint">💡 Gợi ý</button><button id="ord-hz">Hán phụ: Bật</button><button id="ord-clear">🗑 Xoá</button><button class="primary" id="ord-check">✔ Kiểm tra</button></div>
        <div class="ord-fb" id="ord-fb"></div>
        <button class="btn-next" id="ord-next" style="margin-top:14px">Câu tiếp →</button>
      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('ord-hint').onclick = hint; $('ord-hz').onclick = toggleHz; labelHz(); $('ord-clear').onclick = clearAll; $('ord-check').onclick = check; $('ord-next').onclick = next;
    $('ord-speak').onclick = function () { if (st) { if (!zhVoice) loadVoices(); speakChinese(st.item.text, this); } };
    ['pointerdown'].forEach(ev => $('order-screen').addEventListener(ev, down));
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  function drawLevels() {
    $('ord-lv').innerHTML = LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('ord-lv').querySelectorAll('button').forEach(b => b.onclick = () => { level = b.dataset.l; safeStorage.set(LS_LEVEL, level); start(level); });
  }

  function pick(pool, n) {
    const store = safeStorage.get(LS_SEEN) || {}, seen = new Set(store[level] || []);
    const due = SC().mistakes('sent').filter(m => m.nextReview <= Date.now()).map(m => pool.find(p => p.text === m.text)).filter(Boolean);
    const chosen = [], used = new Set(), add = s => { if (s && !used.has(s.text) && chosen.length < n) { used.add(s.text); chosen.push(s); } };
    shuffle(due).slice(0, 3).forEach(add);
    let fresh = pool.filter(p => !seen.has(p.text));
    if (fresh.length < n - chosen.length) { seen.clear(); fresh = pool; }
    shuffle(fresh).forEach(add);
    store[level] = [...seen, ...chosen.map(c => c.text)]; safeStorage.set(LS_SEEN, store);
    return chosen;
  }
  function open() { build(); level = safeStorage.get(LS_LEVEL) || 'HSK1'; if (!LEVELS.includes(level)) level = 'HSK1'; show('order-screen'); drawLevels(); start(level); }
  function start(lv) {
    build(); show('order-screen'); active = true; level = lv; drawLevels(); resetSession();
    const pool = gather(lv);
    currentGameStarter = () => start(level);
    if (pool.length < 3) { empty('Chưa đủ câu ví dụ cho ' + lv + '. Hãy chắc chắn file HSK' + (lv.replace('HSK', '') || 'x') + '.js đã được tải (cần ít nhất 3 câu có nghĩa tiếng Việt).'); return; }
    begin(pick(pool, 10));
  }
  function openMistakes() {
    build(); show('order-screen'); level = 'Sổ tay'; drawLevels();
    const lst = SC().mistakes('sent').sort((a, b) => a.nextReview - b.nextReview).slice(0, 10);
    const items = lst.map(m => ({ text: m.text, pinyin: m.pinyin, meaning: m.meaning, level: m.level, tokens: segment(m.text) })).filter(i => i.tokens.length >= 2 && i.tokens.length <= 10);
    if (!items.length) { empty('Sổ tay chưa có câu nào để luyện lại.'); return; }
    currentGameStarter = () => openMistakes();
    resetSession(); begin(items);
  }
  function empty(msg) { $('ord-body').innerHTML = `<div class="ord-empty">🧩<br>${escapeHTML(msg)}</div>`; rounds = []; }
  function begin(items) {
    if (!$('ord-vi')) {
      document.getElementById('order-screen').remove(); build(); show('order-screen'); drawLevels();
    }
    items.forEach(it => { it.tokPy = tokensPinyin(it); });
    rounds = items; idx = 0; setRound();
  }
  function setRound() {
    const it = rounds[idx];
    let order; do { order = shuffle(it.tokens.map((t, i) => i)); } while (order.length > 1 && order.every((v, i) => v === i) && it.tokens.length > 1);
    st = { item: it, bank: order, answer: [], hinted: false, recorded: false, done: false, tries: 0 };
    locked = false;
    $('ord-vi').textContent = it.meaning;
    $('ord-counter').textContent = `${idx + 1} / ${rounds.length}`;
    $('ord-progress').style.width = (idx / rounds.length * 100) + '%';
    $('ord-fb').className = 'ord-fb'; $('ord-fb').innerHTML = '';
    $('ord-next').classList.remove('visible');
    $('ord-check').disabled = false; $('ord-hint').disabled = false; $('ord-clear').disabled = false;
    render();
  }
  function chip(i, cls) {
    const t = st.item.tokens[i], py = st.item.tokPy && st.item.tokPy[i];
    return py ? `<div class="ord-chip py ${cls || ''}" data-id="${i}"><span class="cp">${escapeHTML(py)}</span>${showHz ? `<span class="ch">${escapeHTML(t.replace(/[^\u4e00-\u9fff0-9a-zA-Z]/g, ''))}</span>` : ''}</div>`
      : `<div class="ord-chip ${cls || ''}" data-id="${i}">${escapeHTML(t)}</div>`;
  }
  function render(marks, beforeId, endMark) {
    const a = $('ord-answer'), b = $('ord-bank');
    a.innerHTML = st.answer.map((i, pos) => chip(i, (marks ? marks[pos] : '') + (beforeId === i ? ' before' : ''))).join('');
    b.innerHTML = st.bank.map(i => chip(i)).join('');
    a.classList.toggle('empty', !st.answer.length); a.classList.toggle('endmark', !!endMark);
    b.style.minHeight = '74px';
    $('ord-check').disabled = locked || !st.answer.length;
  }
  function labelHz() { const b = $('ord-hz'); if (b) b.textContent = 'Hán phụ: ' + (showHz ? 'Bật' : 'Tắt'); }
  function toggleHz() { showHz = !showHz; safeStorage.set('cn_quiz_order_hz', showHz); labelHz(); if (st) render(); }
  function clearAll() { if (locked) return; st.bank = st.bank.concat(st.answer); st.answer = []; render(); }

  let press = null, drag = null;
  function down(e) {
    const c = e.target.closest && e.target.closest('.ord-chip'); if (!c || locked || (e.button != null && e.button > 0)) return;
    press = { id: +c.dataset.id, x: e.clientX, y: e.clientY, from: c.parentElement.id === 'ord-answer' ? 'a' : 'b', el: c };
  }
  function insertIndex(x, y) {
    const chips = [...$('ord-answer').querySelectorAll('.ord-chip:not(.ghosted)')];
    for (let k = 0; k < chips.length; k++) { const r = chips[k].getBoundingClientRect(); if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) return { pos: k, before: +chips[k].dataset.id }; }
    return { pos: chips.length, before: null };
  }
  function zoneAt(x, y) { const el = document.elementFromPoint(x, y); const z = el && el.closest && el.closest('#ord-answer,#ord-bank'); return z ? z.id : null; }
  function move(e) {
    if (!press) return;
    const dx = e.clientX - press.x, dy = e.clientY - press.y;
    if (!drag && Math.hypot(dx, dy) > 7) {
      const r = press.el.getBoundingClientRect(); const g = press.el.cloneNode(true); g.className = 'ord-chip ord-float'; g.style.width = r.width / FS() + 'px'; g.style.zoom = FS();
      document.body.appendChild(g); drag = { g, offx: press.x - r.left, offy: press.y - r.top }; press.el.classList.add('ghosted');
    }
    if (drag) {
      drag.g.style.left = (e.clientX - drag.offx) / FS() + 'px'; drag.g.style.top = (e.clientY - drag.offy) / FS() + 'px';
      const z = zoneAt(e.clientX, e.clientY);
      $('ord-answer').classList.toggle('over', z === 'ord-answer'); $('ord-bank').classList.toggle('over', z === 'ord-bank');
      document.querySelectorAll('.ord-chip.before').forEach(c => c.classList.remove('before'));
      $('ord-answer').classList.remove('endmark');
      if (z === 'ord-answer') { const ix = insertIndex(e.clientX, e.clientY); if (ix.before != null) { const t = $('ord-answer').querySelector(`.ord-chip[data-id="${ix.before}"]`); if (t) t.classList.add('before'); } else $('ord-answer').classList.add('endmark'); }
    }
  }
  function up(e) {
    if (!press) return;
    const p = press; press = null;
    if (!drag) {
      if (locked) return;
      if (p.from === 'b') { st.bank = st.bank.filter(i => i !== p.id); st.answer.push(p.id); } else { st.answer = st.answer.filter(i => i !== p.id); st.bank.push(p.id); }
      render(); return;
    }
    const z = zoneAt(e.clientX, e.clientY), ix = insertIndex(e.clientX, e.clientY);
    drag.g.remove(); drag = null;
    $('ord-answer').classList.remove('over', 'endmark'); $('ord-bank').classList.remove('over');
    st.bank = st.bank.filter(i => i !== p.id); st.answer = st.answer.filter(i => i !== p.id);
    if (z === 'ord-answer') { const at = ix.before == null ? st.answer.length : Math.max(0, st.answer.indexOf(ix.before)); st.answer.splice(at, 0, p.id); }
    else st.bank.push(p.id);
    render();
  }

  function hint() {
    if (locked) return;

    let k = 0; while (k < st.answer.length && st.answer[k] === k) k++;
    const back = st.answer.slice(k); st.answer = st.answer.slice(0, k); st.bank = st.bank.concat(back);
    if (k < st.item.tokens.length) { st.bank = st.bank.filter(i => i !== k); st.answer.push(k); }
    st.hinted = true; render(); showToast('💡 Dùng gợi ý: câu này không tính điểm');
  }
  function check() {
    if (locked || !st.answer.length) return;
    const toks = st.item.tokens, built = core(st.answer.map(i => toks[i]).join('')), want = core(toks.join(''));
    const full = st.answer.length === toks.length;
    const ok = full && built === want;
    st.tries++;
    if (!ok) {
      const marks = st.answer.map((id, pos) => toks[id] === toks[pos] ? 'ok' : 'bad');
      if (!full) showToast('Còn ' + (toks.length - st.answer.length) + ' từ chưa xếp');
      if (!st.recorded && full && !st.hinted) { settle(false); }
      if (full) { render(marks); feedback(false); }
      return;
    }
    if (!st.recorded && !st.hinted) settle(true);
    render(st.answer.map(() => 'ok')); feedback(true);
  }
  function settle(ok) {
    st.recorded = true;
    const it = st.item, key = it.text;
    const item = { text: it.text, pinyin: it.pinyin, meaning: it.meaning, level: it.level === 'Data' ? 'Khác' : it.level };
    const r = SC().record('order', key, ok, item, ['asked'].concat(ok ? ['correct'] : []));
    const note = grammarNotes(it.text)[0] || '';
    if (ok) SC().mistakeRight('sent', key); else SC().mistakeWrong('sent', key, { text: it.text, pinyin: it.pinyin, meaning: it.meaning, level: it.level === 'Data' ? '' : it.level, note });
    if (ok && !st.hinted) score++;
    st.counted = r.counted;
  }
  function feedback(ok) {
    const it = st.item, fb = $('ord-fb'), notes = grammarNotes(it.text);
    locked = ok || false;
    fb.className = 'ord-fb show ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<b>${ok ? '✅ Chính xác!' : '❌ Chưa đúng — nhìn các từ đỏ, xếp lại hoặc xem đáp án.'}</b>` +
      (st.hinted ? '<div class="note">Đã dùng gợi ý nên câu này không tính điểm.</div>' : '') +
      (ok ? answerBlock(it, notes) : `<div class="ord-actions" style="margin-top:10px"><button id="ord-retry">↩ Thử lại</button><button id="ord-show">👁 Xem đáp án</button></div>`);
    if (ok) finishRound();
    else {
      $('ord-retry').onclick = () => { fb.className = 'ord-fb'; render(); };
      $('ord-show').onclick = () => { locked = true; st.answer = st.item.tokens.map((t, i) => i); st.bank = []; render(st.answer.map(() => 'ok')); fb.className = 'ord-fb show bad'; fb.innerHTML = `<b>Đáp án</b>${answerBlock(it, notes)}`; finishRound(); };
    }
  }
  function answerBlock(it, notes) {
    return `<div class="han">${escapeHTML(it.text)}</div>${it.pinyin ? `<div class="py">${escapeHTML(it.pinyin)}</div>` : ''}<div>${escapeHTML(it.meaning)}</div>` +
      (notes.length ? `<div class="note">📌 ${notes.map(escapeHTML).join('<br>📌 ')}</div>` : '');
  }
  function finishRound() {
    locked = true; $('ord-check').disabled = true; $('ord-hint').disabled = true; $('ord-clear').disabled = true;
    const nx = $('ord-next'); nx.classList.add('visible'); nx.textContent = idx + 1 >= rounds.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (typeof autoSpeakQ !== 'undefined' && autoSpeakQ) { try { speakChinese(st.item.text); } catch (e) {} }
  }
  function next() {
    if (!locked) return;
    idx++;
    if (idx >= rounds.length) return finish();
    setRound();
  }
  function finish() {
    const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
    showFinal({ score: ok, totalText: '/ ' + (tot || rounds.length), pct: tot ? ok / tot * 100 : 0, title: 'Hoàn thành Xếp câu', sub: 'Câu dùng gợi ý hoặc đã làm hôm nay không cộng thêm điểm' });
    document.getElementById('btn-practice-wrong').classList.remove('show');
    window._lastWrongTexts = [];
  }

  document.addEventListener('keydown', e => {
    const sc = $('order-screen'); if (!sc || sc.style.display !== 'block' || !rounds.length) return;
    if (e.key === 'Enter') { e.preventDefault(); locked ? next() : check(); }
  });

  window.OrderMode = { tokensPinyin, open, start, openMistakes, segment, gather, _state: () => ({ st, rounds, idx }) };
})();
