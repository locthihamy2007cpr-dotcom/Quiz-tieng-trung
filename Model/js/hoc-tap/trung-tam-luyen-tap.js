

(function () {
  'use strict';
  const PM = () => window.PinyinMode, SC = () => window.StudyCore, $ = id => document.getElementById(id);
  const esc = s => escapeHTML(String(s == null ? '' : s));
  const LS_SCOPE = 'cn_quiz_px_scope', LS_PLAN = 'cn_quiz_plan', LS_EXAM = 'cn_quiz_exams';
  const todayStr = () => getLocalDateStr();

  const MARK = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', v: 'ǖǘǚǜ' };
  function toMarks(syl, tone) {
    let s = syl; if (!tone) return s.replace(/v/g, 'ü');
    let k = s.search(/[ae]/); if (k < 0) { k = s.indexOf('ou') >= 0 ? s.indexOf('o') : -1; }
    if (k < 0) { for (let j = s.length - 1; j >= 0; j--) if ('iouv'.includes(s[j])) { k = j; break; } }
    if (k < 0) return s;
    return (s.slice(0, k) + MARK[s[k]][tone - 1] + s.slice(k + 1)).replace(/v/g, 'ü');
  }
  const readingOf = t => t.syl.map((s, i) => toMarks(s, t.tones[i])).join(' ');
  function toneVariants(t) {
    const out = [];
    for (let i = 0; i < t.syl.length; i++) for (let tn = 0; tn <= 4; tn++) if (tn !== t.tones[i] && !(tn === 0 && !t.tones[i])) { const tt = t.tones.slice(); tt[i] = tn; out.push(readingOf({ syl: t.syl, tones: tt })); }
    return shuffle(out);
  }

  const HAN = /[一-鿿]/g;
  const coreOf = txt => String(txt || '').split(/[\/／,，;；(（]/)[0].replace(/[~～…\s]/g, '');
  let cacheSig = '', S = null;
  function data() {
    const sig = (typeof hskAll !== 'undefined' ? hskAll.length : 0) + ':' + (window.dictIndex ? window.dictIndex.length : 0);
    if (S && sig === cacheSig) return S;
    const sents = [], seen = new Set(), words = [];
    const addSent = (text, pinyin, meaning, level, word) => {
      text = String(text || '').trim(); if (!text || seen.has(text)) return;
      const t = PM().parseTarget(pinyin), han = (text.match(HAN) || []).length, er = (text.match(/儿/g) || []).length;
      if (han < 2 || t.syl.length < 2 || !(t.syl.length === han || t.syl.length === han - er || t.syl.length === han - er + 0)) return;
      if (!meaning || !String(meaning).trim()) return;
      seen.add(text); sents.push({ text, pinyin: String(pinyin), meaning: String(meaning).trim(), level, word, t, n: t.syl.length });
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => {
      const core = coreOf(w.text), t = PM().parseTarget(w.pinyin);
      const wd = { text: core, rawText: w.text, pinyin: w.pinyin, meaning: w.meaning, level: w.level, t, example: w.example, examplePinyin: w.examplePinyin, exampleMeaning: w.exampleMeaning };
      words.push(wd);
      if (w.example) addSent(w.example, w.examplePinyin, w.exampleMeaning, w.level, wd);
    });
    (window.dictSentences || []).forEach(s => addSent(s.text, s.pinyin, s.meaning, 'Data', null));
    S = { sents, words }; cacheSig = sig; return S;
  }

  const TOPICS = [
    ['num', '🔢 Số & lượng', 'số|một|hai|ba|bốn|sáu|bảy|tám|chín|mười|trăm|nghìn|ngàn|vạn|nửa|bao nhiêu|mấy|lần|đôi|cặp|tổng cộng|nhiều|ít'],
    ['time', '🕐 Thời gian', 'giờ|phút|ngày|tháng|tuần|năm ngoái|hôm|sáng|chiều|tối|trưa|đêm|mùa|xuân|hạ|thu|đông|lúc|khi|trước|sau|bây giờ|thường|luôn|sắp|đã|đang|mãi|lâu'],
    ['family', '👨‍👩‍👧 Gia đình & con người', 'bố|mẹ|ba|anh|chị|em|con trai|con gái|ông|bà|chú|dì|cô|vợ|chồng|bạn|gia đình|người|trẻ|hàng xóm|đồng nghiệp|khách|thầy|giáo viên|học sinh'],
    ['food', '🍜 Ăn uống', 'ăn|uống|cơm|nước|trà|cà phê|trái cây|táo|chuối|nho|dưa|món|rau|thịt|cá|trứng|sữa|bánh|mì|kẹo|đường|bia|rượu|ngon|đói|no|bát|đũa|đĩa|cốc|nhà hàng|thực đơn|đồ ăn'],
    ['weather', '🌦 Thời tiết & thiên nhiên', 'mưa|nắng|tuyết|gió|mây|lạnh|nóng|trời|thời tiết|trăng|mặt trời|sông|núi|cây|hoa|cỏ|chim|động vật|chó|mèo|ngựa|gấu'],
    ['move', '🚌 Đi lại & nơi chốn', 'xe|tàu|máy bay|sân bay|ga|đường|phố|đi|đến|về|vào|ra|lên|xuống|trường|bệnh viện|công ty|công viên|thư viện|cửa hàng|siêu thị|khách sạn|ngân hàng|nhà|phòng|thành phố|quốc gia|trái|phải|trước|sau|gần|xa|bản đồ|vé|du lịch'],
    ['body', '🩺 Cơ thể & sức khỏe', 'đầu|mắt|tai|mũi|miệng|tay|chân|mặt|tóc|cơ thể|sức khỏe|bệnh|ốm|thuốc|đau|sốt|cảm|bác sĩ|mệt|tắm|đánh răng|ngủ|dậy'],
    ['feel', '😊 Cảm xúc & tính cách', 'vui|buồn|giận|sợ|lo|yêu|thích|ghét|hài lòng|thông minh|chăm chỉ|nhiệt tình|đáng yêu|xinh|đẹp|tốt|xấu|hy vọng|nhớ|quên|ngạc nhiên|tức|nghiêm túc|cẩn thận'],
    ['study', '🏫 Học tập & công việc', 'học|dạy|thi|bài|sách|viết|đọc|chữ|từ|câu|lớp|điểm|thành tích|công việc|làm việc|họp|văn phòng|kế hoạch|dự án|kinh nghiệm|kỹ năng|luyện|ôn|trình độ|văn hóa|lịch sử|toán'],
    ['shop', '🛍 Mua sắm & đồ vật', 'mua|bán|tiền|giá|đắt|rẻ|đồng|quần|áo|giày|mũ|váy|túi|ví|đồng hồ|điện thoại|máy tính|ti vi|điều hòa|tủ lạnh|đèn|ghế|bàn|quà|kính|ô|dù|vali|máy ảnh']
  ].map(([id, label, kw]) => ({ id, label, re: new RegExp('(^|[^\\p{L}])(' + kw + ')(?=$|[^\\p{L}])', 'iu') }));
  const topicOf = id => TOPICS.find(t => t.id === id);
  let scope = safeStorage.get(LS_SCOPE) || 'HSK1';
  const scopeLabel = sc => sc === 'ALL' ? 'Tất cả HSK' : sc === 'SLANG' ? 'Khẩu ngữ (Data.js)' : sc.startsWith('topic:') ? (topicOf(sc.slice(6)) || {}).label : sc;
  function inScope(it, isSent) {
    const lv = it.level, w = isSent ? it.word : it;
    if (scope === 'SLANG') return lv === 'Data';
    if (lv === 'Data') return false;
    if (scope === 'ALL') return true;
    if (scope.startsWith('topic:')) { const tp = topicOf(scope.slice(6)); return !!(tp && w && w.meaning && tp.re.test(w.meaning)); }
    return lv === scope;
  }
  const sentPool = () => data().sents.filter(s => inScope(s, true));
  const wordPool = () => data().words.filter(w => inScope(w, false) && w.t.key);
  const fillPool = () => data().sents.filter(s => s.word && inScope(s, true) && s.word.text && s.text.includes(s.word.text) && [...s.word.text].length <= 4 && PM().lexicon().map.has(s.word.t.key));

  const pickN = (arr, n) => shuffle(arr.slice()).slice(0, n);
  function mkFill(s) { return { type: 'fill', key: 'fill:' + s.text, sent: s }; }
  function mkSent(type) { return s => ({ type, key: type + ':' + s.text, sent: s }); }
  function polyQuestions() {
    const by = new Map(); data().words.forEach(w => { if (w.text && w.t.key && w.example && w.example.includes(w.text) && w.level !== 'Data') (by.get(w.text) || by.set(w.text, []).get(w.text)).push(w); });
    const out = [];
    by.forEach(list => {
      const keys = new Set(list.map(w => w.t.key)); if (keys.size < 2) return;
      const readings = []; list.forEach(w => { const r = readingOf(w.t); if (!readings.includes(r)) readings.push(r); });
      list.forEach(w => {
        if (!inScope(w, false)) return;
        const ans = readingOf(w.t), opts = readings.slice();
        toneVariants(w.t).forEach(v => { if (opts.length < 4 && !opts.includes(v)) opts.push(v); });
        out.push({ type: 'choice', key: 'poly:' + w.text + ':' + w.t.key, kind: 'poly', title: `Trong câu này, 「${w.text}」 đọc là gì?`, sentence: w.example, mark: w.text, meaning: w.exampleMeaning, options: shuffle(opts.slice(0, 4)), answer: ans, explain: `${w.text} (${ans}) = ${w.meaning}`, level: w.level, text: w.text, pinyin: w.pinyin });
      });
    });
    return out;
  }
  function homoQuestions() {
    const out = [], map = PM().lexicon().map, L = PM().lexicon().list;
    map.forEach(g => {
      const grp = g.filter(e => e.level !== 'Data'); if (new Set(grp.map(e => e.text)).size < 2) return;
      grp.forEach(e => {
        if (!inScope(e, false) || !e.meaning || /^(thán từ|trợ từ|từ )/i.test(e.meaning)) return;
        const mn = x => String(x.meaning || '').trim().toLowerCase();
        let opts = shuffle(grp.filter(x => x.text !== e.text && mn(x) !== mn(e))).slice(0, 3);
        if (opts.length < 3) { const same = L.filter(x => x.syl.length === e.syl.length && x.syl[0] === e.syl[0] && x.text !== e.text && mn(x) !== mn(e) && !opts.includes(x) && x.level !== 'Data'); opts = opts.concat(pickN(same, 3 - opts.length)); }
        const all = shuffle([e].concat(opts).filter((v, i, a) => a.findIndex(y => y.text === v.text) === i)).slice(0, 4); if (!all.some(x => x.text === e.text) || all.length < 3) return;
        out.push({ type: 'choice', key: 'homo:' + e.text, kind: 'homo', title: `Chữ Hán nào có nghĩa “${e.meaning}”?`, sentence: '', hint: `Cách đọc: ${PM().numbered(e)}`, options: all.map(x => x.text), answer: e.text, explain: `${e.text} (${e.pinyin}) = ${e.meaning}`, level: e.level, text: e.text, pinyin: e.pinyin, meaning: e.meaning });
      });
    });
    return out;
  }
  const choicePool = () => { const p = polyQuestions(), h = homoQuestions(); return shuffle(p).slice(0, 6).concat(shuffle(h)); };
  function build(type, n) {
    n = n || 10;
    if (type === 'fill') return pickN(fillPool(), n).map(mkFill);
    if (type === 'dict') return pickN(sentPool().filter(s => s.n <= 14), n).map(mkSent('dict'));
    if (type === 'vi2zh') return pickN(sentPool().filter(s => s.n <= 14), n).map(mkSent('vi2zh'));
    if (type === 'shadow') return pickN(sentPool().filter(s => s.n <= 16), n).map(mkSent('shadow'));
    if (type === 'choice') return choicePool().slice(0, n);
    return [];
  }

  let run = null, cur = null, inp = null, cands = { list: [] }, locked = false;
  const TITLES = { fill: '✏️ Điền chỗ trống', dict: '🎧 Chép chính tả', vi2zh: '🔁 Dịch Việt → Trung', choice: '🧠 Đồng âm / đa âm', shadow: '🗣 Đọc theo' };
  const canSpeak = () => typeof ttsSupported !== 'undefined' && ttsSupported && typeof voiceEnabled !== 'undefined' && voiceEnabled;
  function speakAt(text, rate) { const old = ttsRate; ttsRate = rate; try { if (!zhVoice) loadVoices(); speakChinese(text, $('px-speak')); } finally { ttsRate = old; } }
  function buildScreens() {
    if ($('hub-screen')) return;
    PM().build();
    const css = document.createElement('style');
    css.textContent = `
    #hub-screen,#px-screen{display:none;width:100%}
    .hub-scope{display:flex;gap:8px;align-items:center}
    .hub-scope select{flex:1;padding:9px 10px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:700 13px var(--font-body)}
    .hub-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px}
    .hub-card h3{margin:0 0 8px;font-size:13px;font-family:var(--font-heading)}
    .hub-steps{display:flex;flex-direction:column;gap:6px}
    .hub-step{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 13px var(--font-body);cursor:pointer;text-align:left}
    .hub-step.done{opacity:.55;border-color:var(--correct)} .hub-step .ck{margin-left:auto}
    .hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .hub-btn{padding:11px 8px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:800 13px var(--font-heading);cursor:pointer;line-height:1.3}
    .hub-btn small{display:block;font:500 10.5px var(--font-body);color:var(--muted);margin-top:2px}
    .hub-btn:hover{border-color:var(--accent)}
    .hub-bar{height:6px;border-radius:99px;background:var(--surface);overflow:hidden;margin:2px 0 8px}.hub-bar i{display:block;height:100%;background:var(--correct)}
    .hub-sub-body{font-size:12.5px;line-height:1.55}
    .hub-sub-body .iss{padding:5px 8px;border-radius:8px;background:var(--surface);margin:3px 0;border-left:3px solid var(--wrong)}
    .hub-sub-body .iss.w{border-left-color:#f5a623}
    .hub-sub-body b.k{color:var(--accent3)}
    .px-blank{display:inline-block;min-width:2.2em;border-bottom:3px solid var(--accent);color:transparent;margin:0 2px}
    .px-sent{font-family:var(--font-hanzi);font-size:26px;line-height:1.5;font-weight:700}
    .px-sent mark{background:color-mix(in oklab,var(--accent) 35%,transparent);color:inherit;border-radius:6px;padding:0 3px}
    .px-diff span{display:inline-block;margin:2px 3px;padding:2px 7px;border-radius:8px;background:var(--surface);font-weight:800}
    .px-diff .m{color:var(--correct)} .px-diff .x{color:var(--wrong);text-decoration:underline wavy}
    .px-rate{display:flex;gap:8px}.px-rate button{flex:1;padding:10px 4px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font:800 13px var(--font-heading);cursor:pointer}
    @media all{
      #hub-screen[style*="block"],#px-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #hub-screen .screen-header,#px-screen .screen-header{margin:0}
      #hub-body{display:flex;flex-direction:column;gap:clamp(6px,calc(1.2 * var(--hu)),10px);flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:none}
      #hub-body::-webkit-scrollbar{display:none}
      #hub-body>*{flex-shrink:0;margin:0!important}
      .hub-btn{padding:clamp(7px,calc(1.2 * var(--hu)),11px) 6px;font-size:12px}
      #px-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #px-body>*{margin:0!important;flex-shrink:0}
      #px-body .px-sent{font-size:clamp(18px,calc(3.2 * var(--hu)),26px)}
      #px-body .pn-cands{flex:1 1 0;min-height:0;overflow-y:auto;scrollbar-width:none}
      #px-body>.btn-next{flex:0 0 auto}
    }`;
    document.head.appendChild(css);
    const host = $('result-screen').parentNode;
    const hub = document.createElement('div'); hub.id = 'hub-screen';
    hub.innerHTML = `
      <div class="screen-header"><button class="btn-back" id="hub-back">⬅️ Quay lại</button><h2 class="screen-title">🎯 Luyện thêm</h2></div>
      <div id="hub-body"></div>`;
    host.appendChild(hub);
    const px = document.createElement('div'); px.id = 'px-screen';
    px.innerHTML = `
      <div class="screen-header"><button class="btn-back" id="px-back">⬅️ Thoát</button><h2 class="screen-title" id="px-title"></h2></div>
      <div id="px-body">
        <div class="quiz-header"><span class="mode-badge" id="px-badge"></span><span class="question-counter" id="px-counter"></span><div class="header-actions"></div></div>
        <div class="progress-track"><div class="progress-fill" id="px-progress" style="width:0%"></div></div>
        <div class="pn-prompt" id="px-prompt"></div>
        <input class="pn-in" id="px-in" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="gõ pinyin: ni3 hao3 hoặc nihao">
        <div class="pn-tip" id="px-tip"></div>
        <div class="pn-cands" id="px-opts"></div>
        <div class="pn-actions" id="px-actions"></div>
        <div class="pn-fb" id="px-fb"></div>
        <button class="btn-next" id="px-next">Câu tiếp →</button>
      </div>`;
    host.appendChild(px);
    $('hub-back').onclick = () => { if (subOpen) openHub(); else goHome(); };
    $('px-back').onclick = () => { if (run && run.onQuit) run.onQuit(); else openHub(); };
    $('px-in').addEventListener('input', onInput);
    $('px-in').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return; e.preventDefault();
      if (locked) { next(); return; }
      if (!cur) return;
      if (cur.type === 'fill') { if (cands.list.length) pickCand(cands.list[0]); } else if (cur.type === 'dict' || cur.type === 'vi2zh') check();
    });
    $('px-next').onclick = next;
    document.addEventListener('keydown', e => { const sc = $('px-screen'); if (e.key === 'Enter' && sc && sc.style.display === 'block' && locked && document.activeElement !== $('px-in')) { e.preventDefault(); next(); } });
  }

  function startRun(type, items, opts) {
    opts = opts || {};
    buildScreens();
    if (!items.length) { toastMsg('Không đủ dữ liệu cho bài này ở “' + scopeLabel(scope) + '”. Thử đổi cấp / chủ đề.'); return false; }
    run = { type, items, i: 0, results: [], onDone: opts.onDone || null, onQuit: opts.onQuit || null, title: opts.title || TITLES[type] || 'Luyện thêm', replay: opts.replay || (() => startRun(type, build(type, items.length), opts)) };
    show('px-screen'); resetSession(); currentGameStarter = () => run.replay();
    $('px-title').textContent = run.title;
    setItem(); return true;
  }
  function toastMsg(m) { if (typeof showToast === 'function') showToast(m); else alert(m); }
  const itemSent = it => it.sent;
  function setItem() {
    cur = run.items[run.i]; locked = false; cands = { list: [] }; inp = null;
    cur.hinted = false; cur.recorded = false;
    $('px-counter').textContent = `${run.i + 1} / ${run.items.length}`;
    $('px-progress').style.width = (run.i / run.items.length * 100) + '%';
    $('px-fb').className = 'pn-fb'; $('px-fb').innerHTML = ''; $('px-next').classList.remove('visible');
    const input = $('px-in'), opts = $('px-opts'), act = $('px-actions'), tip = $('px-tip'), pr = $('px-prompt');
    input.value = ''; input.disabled = false; input.className = 'pn-in'; opts.innerHTML = ''; act.innerHTML = '';
    const typing = ['fill', 'dict', 'vi2zh'].includes(cur.type);
    input.style.display = typing ? '' : 'none'; tip.style.display = typing ? '' : 'none';
    const sp = '<div class="pn-speak"><button class="btn-speak" id="px-speak" type="button">🔊</button> <button class="tts-rate-btn" id="px-rate" type="button">🚶 0.85x</button><button class="tts-rate-btn tts-replay" id="px-replay" type="button">🔊 Nghe lại</button></div>';
    const bindSp = txt => { $('px-speak').onclick = $('px-replay').onclick = () => speakAt(txt, ttsRate); $('px-rate').onclick = () => cycleTTSRate(() => speakAt(txt, ttsRate)); refreshTTSBtns(); };
    const hintBtn = fn => { const b = document.createElement('button'); b.textContent = '💡 Gợi ý'; b.onclick = fn; act.appendChild(b); return b; };
    const showBtn = () => { const b = document.createElement('button'); b.textContent = '👁 Đáp án'; b.onclick = reveal; act.appendChild(b); };
    const s = cur.sent;
    if (cur.type === 'fill') {
      $('px-badge').textContent = '✏️ Điền từ';
      const idx = s.text.indexOf(s.word.text), blank = `<span class="px-blank">${'＿'.repeat(Math.max(2, [...s.word.text].length))}</span>`;
      pr.innerHTML = `<div class="lbl">Từ nào còn thiếu? Gõ pinyin rồi chọn chữ Hán</div><div class="px-sent">${esc(s.text.slice(0, idx))}${blank}${esc(s.text.slice(idx + s.word.text.length))}</div><div class="vi" style="font-size:15px">${esc(s.meaning)}</div>`;
      tip.textContent = 'Gõ pinyin của từ còn thiếu (ni3 hoặc ni) · Enter chọn chữ đầu · chọn đúng chữ Hán.';
      hintBtn(() => { cur.hinted = true; const t = s.word.t; fb(`💡 Từ này nghĩa “${esc(s.word.meaning)}” · ${t.syl.length} âm tiết, bắt đầu bằng “${esc(t.key[0])}”. (Dùng gợi ý nên không tính điểm.)`, ''); }); showBtn();
    } else if (cur.type === 'dict') {
      $('px-badge').textContent = '🎧 Chép chính tả';
      const aud = canSpeak();
      pr.innerHTML = `<div class="lbl">${aud ? 'Nghe câu rồi gõ pinyin cả câu' : 'Gõ pinyin của câu sau'}</div>` + (aud ? sp : `<div class="px-sent">${esc(s.text)}</div>`) + '<div class="vi" id="px-vi" style="font-size:15px">❓</div>';
      tip.textContent = 'Gõ cả câu: wo3 ai4 ni3 hoặc woaini · có thể bỏ dấu cách · Enter để kiểm tra.';
      if (aud) { bindSp(s.text); setTimeout(() => { if (cur && cur.sent === s && !locked) speakAt(s.text, ttsRate); }, 350); }
      hintBtn(() => { cur.hinted = true; $('px-vi').textContent = s.meaning; if (aud) { const f = $('px-fb'); } fb(`💡 Câu có ${s.n} âm tiết: ${esc(s.text)}. (Dùng gợi ý nên không tính điểm.)`, ''); });
      const ck = document.createElement('button'); ck.textContent = '✔ Kiểm tra'; ck.onclick = check; act.appendChild(ck); showBtn();
    } else if (cur.type === 'vi2zh') {
      $('px-badge').textContent = '🔁 Việt → Trung';
      pr.innerHTML = `<div class="lbl">Dịch sang tiếng Trung rồi gõ pinyin cả câu</div><div class="vi">${esc(s.meaning)}</div>`;
      tip.textContent = 'Gõ pinyin cả câu: ni3 hao3 hoặc nihao · Enter để kiểm tra.';
      hintBtn(() => { cur.hinted = true; fb(`💡 Chữ Hán: <span class="han">${esc(s.text)}</span> (${s.n} âm tiết). Dùng gợi ý nên không tính điểm.`, ''); });
      const ck = document.createElement('button'); ck.textContent = '✔ Kiểm tra'; ck.onclick = check; act.appendChild(ck); showBtn();
    } else if (cur.type === 'choice') {
      $('px-badge').textContent = cur.kind === 'poly' ? '🧠 Đa âm' : '🧠 Đồng âm';
      pr.innerHTML = `<div class="lbl">${esc(cur.title)}</div>` + (cur.sentence ? `<div class="px-sent">${esc(cur.sentence).replace(esc(cur.mark), `<mark>${esc(cur.mark)}</mark>`)}</div><div class="vi" style="font-size:14px">${esc(cur.meaning || '')}</div>` : `<div class="vi" style="font-size:15px">${esc(cur.hint || '')}</div>`);
      opts.innerHTML = cur.options.map((o, n) => `<button type="button" class="pn-cand" data-n="${n}" style="max-width:none;flex:1 1 44%"><span class="${cur.kind === 'poly' ? 'p' : 'h'}" style="${cur.kind === 'poly' ? 'font-size:15px' : ''}">${esc(o)}</span></button>`).join('');
      opts.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => pickChoice(cur.options[Number(b.dataset.n)], b));
    } else if (cur.type === 'shadow') {
      $('px-badge').textContent = '🗣 Đọc theo';
      const showPy = safeStorage.get('cn_quiz_px_showpy') !== false;
      pr.innerHTML = `<div class="lbl">Nghe chậm, đọc theo thành tiếng, rồi tự chấm</div><div class="px-sent">${esc(s.text)}</div><div class="vi" id="px-py" style="font-size:15px;color:var(--accent3)">${showPy ? esc(s.pinyin) : '• • •'}</div><div class="vi" style="font-size:14px">${esc(s.meaning)}</div>` + (canSpeak() ? sp : '<div class="pn-tip">Thiết bị chưa hỗ trợ giọng đọc — hãy đọc theo pinyin.</div>');
      if (canSpeak()) { bindSp(s.text); }
      const play = (r, b) => { const x = document.createElement('button'); x.textContent = b; x.onclick = () => { if (!canSpeak()) return; if (r === 'both') { speakAt(s.text, 0.6); setTimeout(() => speakAt(s.text, 1.0), Math.min(9000, 900 + s.n * 650)); } else speakAt(s.text, r); }; act.appendChild(x); };
      play(0.6, '🐢 Chậm'); play(1.0, '🔊 Thường'); play('both', '▶ Chậm → thường');
      const tg = document.createElement('button'); tg.textContent = '👁 Pinyin'; tg.onclick = () => { const v = $('px-py').textContent.includes('•'); safeStorage.set('cn_quiz_px_showpy', v); $('px-py').textContent = v ? s.pinyin : '• • •'; }; act.appendChild(tg);
      opts.innerHTML = '<div class="px-rate" style="width:100%"><button data-r="0">😅 Còn khó</button><button data-r="1">🙂 Được</button><button data-r="2">😎 Dễ</button></div>';
      opts.querySelectorAll('button').forEach(b => b.onclick = () => rateShadow(Number(b.dataset.r)));
      if (canSpeak()) setTimeout(() => { if (cur && cur.sent === s && !locked) speakAt(s.text, 0.6); }, 400);
    }
    if (typing) setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 60);
  }
  function fb(html, cls) { const f = $('px-fb'); f.className = 'pn-fb show ' + (cls || ''); f.innerHTML = html; }

  function recordItem(ok) {
    if (cur.recorded) return; cur.recorded = true;
    const s = cur.sent || cur, item = { text: (cur.sent ? cur.sent.text : cur.text), pinyin: (cur.sent ? cur.sent.pinyin : cur.pinyin), meaning: (cur.sent ? cur.sent.meaning : cur.meaning || cur.explain || ''), level: (cur.sent ? (cur.sent.level === 'Data' ? '' : cur.sent.level) : cur.level === 'Data' ? '' : cur.level) };
    SC().record('practice', cur.key, ok, { text: item.text, pinyin: item.pinyin, meaning: item.meaning, level: item.level || 'Khác' }, ['asked'].concat(ok ? ['correct'] : []));
    if (ok) SC().mistakeRight('drill', cur.key); else SC().mistakeWrong('drill', cur.key, Object.assign({}, item, { drill: cur.type, item: JSON.parse(JSON.stringify(cur, (k, v) => k === 'recorded' || k === 'hinted' ? undefined : v)) }));
    run.results.push({ ok, type: cur.type });
  }
  function onInput() {
    if (locked || !cur) return;
    const v = PM().parseInput($('px-in').value); $('px-in').className = 'pn-in'; $('px-fb').className = 'pn-fb';
    if (cur.type !== 'fill') return;
    inp = v; cands = PM().candidates(v);
    const box = $('px-opts');
    if (!v.key) { box.innerHTML = '<div class="pn-msg">Chữ Hán ứng viên sẽ hiện ở đây khi bạn gõ…</div>'; return; }
    if (!cands.list.length) { box.innerHTML = `<div class="pn-msg">Không có từ nào đọc là “${esc(v.syl.join(' '))}”.</div>`; return; }
    box.innerHTML = (cands.loose ? '<div class="pn-msg" style="width:100%">Không khớp thanh điệu — hiện các từ cùng âm:</div>' : '') + cands.list.slice(0, 12).map((e, n) => `<button type="button" class="pn-cand ${n === 0 ? 'first' : ''}" data-n="${n}"><span class="h">${esc(e.text)}</span><span class="p">${esc(PM().numbered(e))}</span><span class="m">${esc(e.meaning)}</span></button>`).join('');
    box.querySelectorAll('.pn-cand').forEach(b => b.onclick = () => pickCand(cands.list[Number(b.dataset.n)], b));
  }
  function pickCand(e, btn) {
    if (locked || !e) return;
    const w = cur.sent.word, ok = e.text === w.text && e.key === w.t.key;
    const toneBad = ok && inp && inp.hasTone && inp.syl.length === w.t.syl.length && inp.tones.some((x, n) => x !== null && (x === 5 ? 0 : x) !== w.t.tones[n]);
    if (toneBad) { if (!cur.hinted) recordItem(false); $('px-in').className = 'pn-in bad'; fb(`<b>⚠️ Đúng chữ nhưng sai thanh điệu</b><div class="note">Đúng là <b>${esc(PM().numbered(w.t))}</b>. Gõ lại với thanh đúng.</div>`, 'bad'); return; }
    if (ok) { if (!cur.hinted) recordItem(true); finish(true); if (btn) btn.classList.add('ok'); }
    else { if (!cur.hinted) recordItem(false); if (btn) btn.classList.add('bad'); $('px-in').className = 'pn-in bad'; fb(`<b>❌ Chưa đúng</b><div class="note">${e.key === w.t.key ? 'Đúng cách đọc nhưng sai chữ Hán — xem lại nghĩa câu.' : 'Hãy đọc kỹ câu, sửa pinyin rồi chọn lại, hoặc bấm “Đáp án”.'}</div>`, 'bad'); }
  }
  function lcs(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    const hit = new Array(m).fill(false); let i = m, j = n;
    while (i > 0 && j > 0) { if (a[i - 1] === b[j - 1]) { hit[i - 1] = true; i--; j--; } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--; }
    return { n: d[m][n], hit };
  }
  function check() {
    if (locked || !cur) return;
    const s = cur.sent, v = PM().parseInput($('px-in').value);
    if (!v.key) { fb('<b>Hãy gõ pinyin trước.</b>', ''); return; }
    if (v.key === s.t.key) {
      const sameSplit = v.syl.length === s.t.syl.length;
      const bad = v.hasTone && sameSplit ? v.tones.map((x, n) => x !== null && (x === 5 ? 0 : x) !== s.t.tones[n] ? n : -1).filter(n => n >= 0) : [];
      if (bad.length) { if (!cur.hinted) recordItem(false); $('px-in').className = 'pn-in bad'; fb(`<b>⚠️ Đúng âm nhưng sai thanh điệu</b><div class="px-diff">${s.t.syl.map((y, n) => `<span class="${bad.includes(n) ? 'x' : 'm'}">${esc(y.replace(/v/g, 'ü') + (s.t.tones[n] || ''))}</span>`).join('')}</div><div class="note">Các âm gạch chân đã gõ sai thanh.</div>`, 'bad'); return; }
      if (!cur.hinted) recordItem(true); finish(true); return;
    }
    const L = lcs(s.t.syl, v.syl), pct = Math.round(L.n / Math.max(s.t.syl.length, v.syl.length) * 100);
    if (!cur.hinted) recordItem(false);
    $('px-in').className = 'pn-in bad';
    fb(`<b>❌ Khớp ${pct}%</b><div class="px-diff">${s.t.syl.map((y, n) => `<span class="${L.hit[n] ? 'm' : 'x'}">${esc(y.replace(/v/g, 'ü'))}</span>`).join('')}</div><div class="note">Âm xanh là đúng, đỏ là thiếu/sai. Sửa lại rồi kiểm tra tiếp, hoặc bấm “Đáp án”.</div>`, 'bad');
  }
  function pickChoice(o, btn) {
    if (locked) return; const ok = o === cur.answer;
    recordItem(ok); if (btn) btn.classList.add(ok ? 'ok' : 'bad');
    $('px-opts').querySelectorAll('.pn-cand').forEach(b => { if (cur.options[Number(b.dataset.n)] === cur.answer) b.classList.add('ok'); });
    finish(ok, cur.explain);
  }
  function rateShadow(r) { if (locked) return; recordItem(r > 0); finish(r > 0, r === 0 ? 'Đã lưu vào sổ lỗi — sẽ gặp lại sớm.' : ''); }
  function reveal() { if (locked || !cur) return; if (!cur.hinted) recordItem(false); cur.hinted = true; finish(false); }
  function finish(ok, extra) {
    locked = true; $('px-in').disabled = true;
    const s = cur.sent;
    let body = '';
    if (s) body = `<div class="han">${esc(s.text)}</div><div class="py">${esc(s.pinyin)}</div><div>${esc(s.meaning)}</div>`;
    if (extra) body += `<div class="note">${esc(extra)}</div>`;
    if (cur.hinted && ok) body += '<div class="note">Đã dùng gợi ý nên không tính điểm.</div>';
    fb(`<b>${ok ? '✅ Chính xác!' : 'Đáp án'}</b>${body}`, ok ? 'good' : 'bad');
    $('px-in').className = 'pn-in ' + (ok ? 'good' : '');
    $('px-opts').querySelectorAll('button').forEach(b => { if (cur.type === 'shadow') b.disabled = true; });
    const vi = $('px-vi'); if (vi && s) vi.textContent = s.meaning;
    const nx = $('px-next'); nx.classList.add('visible'); nx.textContent = run.i + 1 >= run.items.length ? 'Xem kết quả →' : 'Câu tiếp →';
    if (s && typeof autoSpeakQ !== 'undefined' && autoSpeakQ && cur.type !== 'shadow') { try { speakAt(s.text, ttsRate); } catch (e) {} }
  }
  function next() {
    if (!locked) return;
    run.i++;
    if (run.i >= run.items.length) {
      const ok = run.results.filter(r => r.ok).length, tot = run.results.length;
      if (run.onDone) { const f = run.onDone; run.onDone = null; f({ ok, total: tot, results: run.results }); return; }
      showFinal({ score: ok, totalText: '/ ' + (tot || run.items.length), pct: tot ? ok / tot * 100 : 0, title: run.title + ' — hoàn thành', sub: 'Câu sai đã vào sổ lỗi để ôn lại' });
      const b = document.getElementById('btn-practice-wrong'); if (b) b.classList.remove('show'); window._lastWrongTexts = [];
      return;
    }
    setItem();
  }

  function planState() { const p = safeStorage.get(LS_PLAN); return p && p.date === todayStr() ? p : { date: todayStr(), done: {}, rewarded: false }; }
  const planSave = p => safeStorage.set(LS_PLAN, p);
  function dueMistakes() { return { drill: SC().mistakes('drill').filter(m => (m.nextReview || 0) <= Date.now()), pin: SC().mistakes('pinyin').filter(m => (m.nextReview || 0) <= Date.now()) }; }
  function planSteps() {
    const d = dueMistakes(), steps = [];
    if (d.drill.length + d.pin.length) steps.push({ id: 'review', icon: '📒', label: `Ôn lỗi cũ (${d.drill.length + d.pin.length} mục đến hạn)` });
    steps.push({ id: 'pinyin', icon: '⌨️', label: 'Gõ pinyin 8 từ' }, { id: 'fill', icon: '✏️', label: 'Điền chỗ trống 5 câu' }, { id: 'dict', icon: '🎧', label: 'Chép chính tả 3 câu' }, { id: 'shadow', icon: '🗣', label: 'Đọc theo 3 câu' });
    return steps;
  }
  function stepDone(id) { const p = planState(); p.done[id] = true; planSave(p); const steps = planSteps(); if (!p.rewarded && steps.every(s => p.done[s.id])) { p.rewarded = true; planSave(p); try { gainXP(30); } catch (e) {} toastMsg('🎉 Hoàn thành lộ trình hôm nay! +30 XP'); } }
  function runStep(id) {
    const back = () => openHub();
    const fin = () => r => { stepDone(id); toastMsg(`✅ Xong bước (${r.ok}/${r.total})`); back(); };
    if (id === 'review') {
      const d = dueMistakes();
      if (d.drill.length) { reviewDrill(fin()); return; }
      PM().onFinish = fin(); PM().openMistakes(); return;
    }
    if (id === 'pinyin') { const pool = wordPool().map(w => PM().lexicon().list.find(e => e.text === w.text && e.key === w.t.key)).filter(Boolean); if (pool.length < 3) { toastMsg('Không đủ từ ở phạm vi này.'); return; } PM().onFinish = fin(); PM().start(scope.startsWith('HSK') ? scope : 'Tất cả', { pool, n: 8, title: '📅 ' + scopeLabel(scope) }); return; }
    const n = { fill: 5, dict: 3, shadow: 3 }[id];
    startRun(id, build(id, n), { onDone: fin(), onQuit: back, replay: () => runStep(id) });
  }
  function reviewDrill(onDone) {
    const due = SC().mistakes('drill').filter(m => m.item).sort((a, b) => a.nextReview - b.nextReview).slice(0, 8).map(m => m.item);
    if (!due.length) { toastMsg('Chưa có câu luyện thêm nào cần ôn. 🎉'); return; }
    startRun('mix', due, { title: '📒 Ôn lỗi luyện thêm', onDone, replay: () => reviewDrill(onDone) });
  }

  function startExam() {
    const parts = [['choice', 6], ['fill', 6], ['dict', 4], ['vi2zh', 4]];
    let items = []; parts.forEach(([t, n]) => { items = items.concat(build(t, n)); });
    if (items.length < 6) { toastMsg('Không đủ dữ liệu để thi thử ở “' + scopeLabel(scope) + '”.'); return; }
    const t0 = Date.now();
    startRun('exam', items, {
      title: '📝 Thi thử ' + scopeLabel(scope), replay: startExam, onQuit: openHub,
      onDone: r => {
        const pct = r.total ? Math.round(r.ok / r.total * 100) : 0, mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
        const by = {}; r.results.forEach(x => { (by[x.type] = by[x.type] || { ok: 0, n: 0 }).n++; if (x.ok) by[x.type].ok++; });
        const names = { choice: 'Đồng/đa âm', fill: 'Điền từ', dict: 'Chính tả', vi2zh: 'Việt→Trung' };
        const detail = Object.keys(by).map(k => `${names[k] || k}: ${by[k].ok}/${by[k].n}`).join(' · ');
        const hist = safeStorage.get(LS_EXAM) || []; hist.push({ d: todayStr(), scope, pct, ok: r.ok, n: r.total }); safeStorage.set(LS_EXAM, hist.slice(-10));
        const grade = pct >= 90 ? 'Xuất sắc 🏆' : pct >= 75 ? 'Tốt 👍' : pct >= 60 ? 'Đạt — cần ôn thêm phần sai' : 'Chưa đạt — nên ôn lỗi rồi thi lại';
        showFinal({ score: r.ok, totalText: '/ ' + r.total, pct, title: 'Thi thử ' + scopeLabel(scope) + ' · ' + grade, sub: `${detail} · ${mins} phút` });
        const b = document.getElementById('btn-practice-wrong'); if (b) b.classList.remove('show'); window._lastWrongTexts = [];
      }
    });
  }

  function validate() {
    const issues = { fmt: [], cnt: [], ex: [], dup: [], empty: [] }, P = PM().parseTarget;
    const lv = {}, seenKey = new Map();
    (typeof hskAll !== 'undefined' ? hskAll : []).forEach(w => {
      lv[w.level] = (lv[w.level] || 0) + 1;
      const tag = `${w.level} · ${w.text}`;
      [w.meaning, w.example, w.examplePinyin, w.exampleMeaning].forEach(f => { if (f && /^["“”]|["“”]$|\\|\n/.test(String(f).trim())) issues.fmt.push(`${tag}: ký tự thừa (" hoặc \\) ở “${String(f).slice(0, 30)}…”`); });
      if (!w.meaning || !w.example || !w.examplePinyin || !w.exampleMeaning) issues.empty.push(`${tag}: thiếu ${[!w.meaning && 'nghĩa', !w.example && 'ví dụ', !w.examplePinyin && 'pinyin ví dụ', !w.exampleMeaning && 'dịch ví dụ'].filter(Boolean).join(', ')}`);
      const hanN = (coreOf(w.text).match(HAN) || []).length, t = P(w.pinyin);
      if (hanN && t.syl.length && Math.abs(t.syl.length - hanN) > 0 && !/儿/.test(w.text)) issues.cnt.push(`${tag}: ${hanN} chữ nhưng pinyin “${w.pinyin}” có ${t.syl.length} âm`);
      if (w.example && w.examplePinyin) {
        const eh = (w.example.match(HAN) || []).length, er = (w.example.match(/儿/g) || []).length, et = P(w.examplePinyin);
        if (!/[a-zA-Zāáǎà]/.test(w.examplePinyin)) issues.ex.push(`${tag}: pinyin ví dụ không có chữ Latin (“${w.examplePinyin.slice(0, 20)}”)`);
        else if (et.syl.length !== eh && et.syl.length !== eh - er) issues.ex.push(`${tag}: ví dụ ${eh} chữ nhưng pinyin ${et.syl.length} âm — “${w.example}”`);
      }
      const k = w.text + '|' + t.key; if (seenKey.has(k)) issues.dup.push(`${tag}: trùng với ${seenKey.get(k)} (cùng chữ, cùng cách đọc)`); else seenKey.set(k, w.level);
    });
    return { issues, lv };
  }
  function openValidator() {
    const { issues, lv } = validate();
    const sec = (title, arr, w) => `<div class="hub-card"><h3>${title} (${arr.length})</h3>${arr.length ? arr.slice(0, 25).map(x => `<div class="iss ${w ? 'w' : ''}">${esc(x)}</div>`).join('') + (arr.length > 25 ? `<div class="pn-msg">…và ${arr.length - 25} mục nữa (xem bằng “Sao chép báo cáo”).</div>` : '') : '<div class="pn-msg">Không có vấn đề. ✅</div>'}</div>`;
    const miss = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].filter(l => !lv[l]);
    const total = issues.fmt.length + issues.cnt.length + issues.ex.length + issues.dup.length + issues.empty.length;
    subPanel('🧪 Kiểm tra dữ liệu', `<div class="hub-card"><h3>Tổng quan</h3><div class="hub-sub-body">${Object.keys(lv).sort().map(l => `<b class="k">${l}</b>: ${lv[l]}`).join(' · ')}<br>Dữ liệu khẩu ngữ: ${(window.dictWords || []).length} từ, ${(window.dictSentences || []).length} câu.<br>${miss.length ? '⚠️ Chưa có dữ liệu: ' + miss.join(', ') : '✅ Đủ HSK1–6.'}<br>Tổng số vấn đề: <b>${total}</b></div></div>`
      + sec('Ký tự thừa / dòng bị vỡ', issues.fmt) + sec('Pinyin ví dụ lệch số chữ', issues.ex, true) + sec('Pinyin từ lệch số chữ', issues.cnt, true) + sec('Trùng lặp', issues.dup, true) + sec('Thiếu dữ liệu', issues.empty)
      + `<button class="hub-btn" id="val-copy">📋 Sao chép báo cáo</button>`);
    $('val-copy').onclick = () => { const txt = ['BÁO CÁO DỮ LIỆU', ...Object.entries({ 'Ký tự thừa': issues.fmt, 'Ví dụ lệch': issues.ex, 'Từ lệch': issues.cnt, 'Trùng': issues.dup, 'Thiếu': issues.empty }).flatMap(([k, a]) => ['## ' + k + ' (' + a.length + ')', ...a])].join('\n'); try { navigator.clipboard.writeText(txt); toastMsg('Đã sao chép báo cáo'); } catch (e) { toastMsg('Không sao chép được'); } };
  }

  function openPreload() {
    subPanel('📥 Tải sẵn dữ liệu nét (offline)', `<div class="hub-card hub-sub-body">Tải thứ tự/hướng nét của các chữ trong từ HSK về trình duyệt để <b>Luyện viết</b> báo lỗi thứ tự nét ngay cả khi không có mạng. Cần mạng khi tải (nguồn hanzi-writer-data). Mỗi chữ ~3 KB.<br><br>
      <select id="pl-lv" class="hub-scope" style="width:100%;padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text)"><option value="1">HSK1</option><option value="2" selected>HSK1–2</option><option value="3">HSK1–3</option></select>
      <div class="hub-bar" style="margin-top:10px"><i id="pl-bar" style="width:0"></i></div><div id="pl-txt" class="pn-msg">Chưa bắt đầu.</div>
      <button class="hub-btn" id="pl-go" style="width:100%">⬇️ Bắt đầu tải</button></div>`);
    $('pl-go').onclick = async () => {
      const max = Number($('pl-lv').value), chars = [...new Set(data().words.filter(w => w.level !== 'Data' && Number(w.level.slice(3)) <= max).flatMap(w => [...w.text].filter(c => /[一-鿿]/.test(c))))];
      let done = 0, fail = 0, streak = 0, stop = false; $('pl-go').disabled = true;
      const lsHas = c => { try { return !!localStorage.getItem('cn_hw_' + c); } catch (e) { return false; } };
      const todo = chars.filter(c => !lsHas(c)), total = todo.length, had = chars.length - total;
      const upd = () => { $('pl-bar').style.width = (done / Math.max(1, total) * 100) + '%'; $('pl-txt').textContent = `${done}/${total} chữ mới · đã có sẵn ${had} · lỗi ${fail}`; };
      const worker = async () => { while (todo.length && !stop) { const c = todo.shift(); const j = await HanziRecognizer.getStrokeData(c).catch(() => null); done++; if (j) streak = 0; else { fail++; if (++streak >= 8) stop = true; } upd(); } };
      upd(); await Promise.all([worker(), worker(), worker(), worker()]);
      $('pl-txt').textContent = (stop ? '⚠️ Không tải được (có thể đang offline) — hãy bật mạng rồi thử lại. ' : '✅ Xong. ') + `Đã lưu ${chars.filter(lsHas).length}/${chars.length} chữ trong máy.`; $('pl-go').disabled = false;
    };
  }

  let subOpen = false;
  function subPanel(title, html) { subOpen = true; $('hub-body').innerHTML = `<div class="hub-card"><h3>${title}</h3></div><div class="hub-sub-body" style="display:flex;flex-direction:column;gap:8px">${html}</div>`; }
  function scopeSelect() {
    const o = (v, l) => `<option value="${v}" ${v === scope ? 'selected' : ''}>${l}</option>`;
    return `<div class="hub-scope"><span style="font-size:12px;color:var(--muted);font-weight:800">Phạm vi</span><select id="hub-scope"><optgroup label="Cấp độ">${['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(l => o(l, l)).join('')}${o('ALL', 'Tất cả HSK')}</optgroup><optgroup label="Khẩu ngữ">${o('SLANG', 'Khẩu ngữ (Data.js)')}</optgroup><optgroup label="Chủ đề">${TOPICS.map(t => o('topic:' + t.id, t.label)).join('')}</optgroup></select></div>`;
  }
  function openHub() {
    buildScreens(); subOpen = false; show('hub-screen'); currentGameStarter = null;
    const p = planState(), steps = planSteps(), doneN = steps.filter(s => p.done[s.id]).length;
    const d = dueMistakes(), mistakeN = SC().mistakes('drill').length + SC().mistakes('pinyin').length;
    const hist = (safeStorage.get(LS_EXAM) || []).slice(-1)[0];
    $('hub-body').innerHTML = scopeSelect() + `
      <div class="hub-card"><h3>📅 Lộ trình hôm nay · ${doneN}/${steps.length}</h3><div class="hub-bar"><i style="width:${doneN / steps.length * 100}%"></i></div>
        <div class="hub-steps">${steps.map(s => `<button class="hub-step ${p.done[s.id] ? 'done' : ''}" data-s="${s.id}"><span>${s.icon}</span>${esc(s.label)}<span class="ck">${p.done[s.id] ? '✅' : '▶'}</span></button>`).join('')}</div></div>
      <div class="hub-grid">
        <button class="hub-btn" data-d="fill">✏️ Điền chỗ trống<small>gõ từ còn thiếu</small></button>
        <button class="hub-btn" data-d="dict">🎧 Chép chính tả<small>nghe câu → gõ pinyin</small></button>
        <button class="hub-btn" data-d="vi2zh">🔁 Dịch Việt → Trung<small>gõ pinyin cả câu</small></button>
        <button class="hub-btn" data-d="choice">🧠 Đồng âm / đa âm<small>chọn đúng theo ngữ cảnh</small></button>
        <button class="hub-btn" data-d="shadow">🗣 Đọc theo<small>nghe chậm → nhại lại</small></button>
        <button class="hub-btn" data-d="pinyin">⌨️ Gõ pinyin từ<small>nghe / nghĩa → gõ</small></button>
        <button class="hub-btn" data-d="exam">📝 Thi thử<small>${hist ? 'gần nhất ' + hist.pct + '% · ' + esc(scopeLabel(hist.scope)) : '20 câu hỗn hợp'}</small></button>
        <button class="hub-btn" data-d="review">📒 Ôn lỗi<small>${mistakeN} mục (${d.drill.length + d.pin.length} đến hạn)</small></button>
        <button class="hub-btn" data-d="validate">🧪 Kiểm tra dữ liệu<small>tìm dòng lỗi, trùng</small></button>
        <button class="hub-btn" data-d="preload">📥 Tải sẵn nét<small>dùng offline</small></button>
      </div>`;
    $('hub-scope').onchange = e => { scope = e.target.value; safeStorage.set(LS_SCOPE, scope); openHub(); };
    $('hub-body').querySelectorAll('.hub-step').forEach(b => b.onclick = () => runStep(b.dataset.s));
    $('hub-body').querySelectorAll('[data-d]').forEach(b => b.onclick = () => {
      const k = b.dataset.d, back = openHub;
      if (['fill', 'dict', 'vi2zh', 'choice', 'shadow'].includes(k)) startRun(k, build(k, 10), { onQuit: back });
      else if (k === 'pinyin') { const pool = wordPool().map(w => PM().lexicon().list.find(e => e.text === w.text && e.key === w.t.key)).filter(Boolean); if (pool.length < 3) { toastMsg('Không đủ từ ở phạm vi này.'); return; } PM().start(scope.startsWith('HSK') ? scope : 'Tất cả', { pool, n: 10, title: scopeLabel(scope) }); }
      else if (k === 'exam') startExam();
      else if (k === 'review') { if (SC().mistakes('drill').length) reviewDrill(null); else if (SC().mistakes('pinyin').length) PM().openMistakes(); else toastMsg('Chưa có lỗi nào để ôn. 🎉'); }
      else if (k === 'validate') openValidator();
      else if (k === 'preload') openPreload();
    });
  }

  window.PracticeHub = { open: openHub, build, _data: data, _run: () => run, _polyQ: polyQuestions, _homoQ: homoQuestions, _validate: validate, toMarks, TOPICS, setScope: s => { scope = s; } };
})();
