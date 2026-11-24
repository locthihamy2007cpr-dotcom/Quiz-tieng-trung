

(function () {
  'use strict';
  const LS_LEVEL = 'cn_quiz_write_level', LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Tất cả'];
  const FS = () => (window.FitScale && window.FitScale.s) || 1;
  const $ = id => document.getElementById(id), SC = () => window.StudyCore;
  const ONLYHAN = /^[一-鿿]+$/;
  let level = 'HSK1', rounds = [], idx = 0, cells = [], locked = false, pool = [], seq = 0;

  const SLOW = [{ k: 0.3, t: 'Vừa' }, { k: 0.15, t: 'Mạnh' }, { k: 0, t: 'Tắt' }];
  let slowIdx = Math.min(2, Math.max(0, +(safeStorage.get('cn_quiz_write_slow') || 0)));
  function labelSlow() { const b = $('wr-slow'); if (b) b.textContent = '🐢 Chuột chậm: ' + SLOW[slowIdx].t; document.querySelectorAll('.wr-box').forEach(x => x.classList.toggle('slow', SLOW[slowIdx].k > 0)); }
  function cycleSlow() { slowIdx = (slowIdx + 1) % SLOW.length; safeStorage.set('cn_quiz_write_slow', slowIdx); labelSlow(); showToast('Chuột chậm: ' + SLOW[slowIdx].t); }
  function swapWord() {
    if (!rounds.length) return;
    const used = new Set(rounds.map(r => r.text)); let cand;
    if (level === 'Sổ tay') cand = SC().mistakes('char').filter(m => !used.has(m.text)).map(m => ({ text: m.text, pinyin: m.pinyin || '', meaning: m.meaning || '', level: m.level || '' }));
    else cand = pool.filter(p => !used.has(p.text));
    if (!cand.length) { showToast('Không còn chữ khác để đổi'); return; }
    const w = shuffle(cand)[0]; rounds[idx] = w;
    if (level !== 'Sổ tay') { const store = safeStorage.get('cn_quiz_write_seen') || {}; (store[level] = store[level] || []).push(w.text); safeStorage.set('cn_quiz_write_seen', store); }
    setRound(); showToast('🔄 Đã đổi sang chữ khác (không tính điểm chữ cũ)');
  }

  function gather(lv) {
    const out = [], seen = new Set();
    if (typeof hskAll === 'undefined') return out;
    hskAll.forEach(w => {
      if (lv !== 'Tất cả' && w.level !== lv) return;
      const t = String(w.text || '').split(/[\/／,，;；(（]/)[0].trim();
      if (!ONLYHAN.test(t) || t.length > 3 || seen.has(t)) return;
      seen.add(t); out.push({ text: t, pinyin: w.pinyin || '', meaning: w.meaning || '', level: w.level });
    });
    return out;
  }
  function build() {
    if ($('write-screen')) return;
    const css = document.createElement('style');
    css.textContent = `
    #write-screen{display:none;width:100%}
    .wr-prompt{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-align:center;margin-bottom:14px}
    .wr-prompt .py{font-size:26px;font-weight:800;color:var(--accent3)} .wr-prompt .mn{margin-top:4px;color:var(--text);line-height:1.45}
    .wr-cells{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:12px}
    .wr-cell{width:min(190px,calc((var(--W,100vw) - 64px - 12px*(var(--n,1) - 1))/var(--n,1)));flex:0 0 auto}
    .wr-box{position:relative;aspect-ratio:1;border:2px solid var(--border);border-radius:var(--radius-md);background:color-mix(in oklab,var(--surface2) 85%,transparent);overflow:hidden}
    .wr-box.pass{border-color:var(--correct)} .wr-box.fail{border-color:var(--wrong)} .wr-box.err{border-color:var(--fire)}
    .wr-box canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}
    .wr-grid{position:absolute;inset:0;pointer-events:none;background:
      linear-gradient(to right,transparent calc(50% - .5px),var(--border) calc(50% - .5px),var(--border) calc(50% + .5px),transparent calc(50% + .5px)),
      linear-gradient(to bottom,transparent calc(50% - .5px),var(--border) calc(50% - .5px),var(--border) calc(50% + .5px),transparent calc(50% + .5px))}
    .wr-ghost{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-family:var(--font-hanzi);font-size:min(130px,calc(var(--W,100vw) * .3));opacity:.18;pointer-events:none}
    .wr-ghost.on{display:flex}
    .wr-res{min-height:38px;margin-top:6px;font-size:13px;line-height:1.4;text-align:center;color:var(--muted)}
    .wr-res b{font-size:18px}
    .wr-res.pass b{color:var(--correct)} .wr-res.fail b{color:var(--wrong)} .wr-res.err{color:var(--fire)}
    .wr-tools{display:flex;gap:8px;justify-content:center;margin-top:4px}
    .wr-tools button{padding:5px 9px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface2);color:var(--text);cursor:pointer;font-size:12px;font-weight:700}
    .wr-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
    .wr-actions button{flex:1;min-width:110px;padding:13px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;font-family:var(--font-heading)}
    .wr-actions button.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;color:#fff}
    .wr-actions button:disabled{opacity:.45;cursor:default}
    .wr-guide{display:none;margin-top:14px;padding:14px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface2);text-align:center}
    .wr-guide.show{display:block}
    .wr-guide svg{width:170px;height:170px;background:color-mix(in oklab,var(--surface) 80%,transparent);border-radius:var(--radius-md);border:1px solid var(--border)}
    .wr-guide .gn{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}
    .wr-guide .gchars{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .wr-vc{position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid var(--accent);background:color-mix(in oklab,var(--accent) 25%,transparent);pointer-events:none;transform:translate(-50%,-50%);display:none;z-index:3}
    .wr-box.slow canvas{cursor:none}
    .wr-note{font-size:12px;color:var(--muted);text-align:center;margin-top:10px;line-height:1.5}
    @media all{
      #wr-body>.btn-next{flex:0 0 auto}
      #write-screen[style*="block"]{gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #wr-lv{margin:0!important;padding:0!important;gap:6px!important;flex-wrap:nowrap}
      #wr-lv .hsk-tab{padding:6px 11px;font-size:12px;flex:0 0 auto}
      #wr-body{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;gap:clamp(5px,calc(1.1 * var(--hu)),10px)}
      #wr-body>*{margin:0!important;flex-shrink:0}
      .wr-prompt{padding:7px 12px}.wr-prompt .py{font-size:clamp(18px,calc(3.2 * var(--hu)),24px)}.wr-prompt .mn{font-size:13px;margin-top:1px}
      .wr-cells{flex:1 1 0;min-height:0;align-items:center;gap:8px;container-type:size}
      .wr-cell{width:min(calc((var(--W,100vw) - 40px - 8px*(var(--n,1) - 1))/var(--n,1)),calc(31 * var(--hu)),calc(100cqh - 40px))}
      .wr-res{min-height:0;font-size:12px;margin-top:3px}.wr-res b{font-size:15px}
      .wr-tools{margin-top:2px}.wr-tools button{padding:3px 8px;font-size:11px}
      .wr-actions{gap:6px}.wr-actions button{min-width:0;flex:1 1 30%;padding:8px 2px;font-size:11.5px}
      .wr-actions button.primary{flex:1 1 40%}
      .wr-note{display:none}
      .wr-guide{margin:0;padding:8px;max-height:calc(30 * var(--hu));overflow:auto}.wr-guide svg{width:110px;height:110px}
    }`;
    document.head.appendChild(css);
    const d = document.createElement('div'); d.id = 'write-screen';
    d.innerHTML = `
      <div class="screen-header"><button class="btn-back" onclick="goHome()">⬅️ Quay lại</button><h2 class="screen-title">✍️ Luyện viết chữ Hán</h2></div>
      <div class="ord-lv" id="wr-lv" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px"></div>
      <div id="wr-body">
        <div class="quiz-header"><span class="mode-badge" id="wr-badge">✍️ Viết chữ</span><span class="question-counter" id="wr-counter">1 / 8</span><div class="header-actions"><button class="btn-icon" id="wr-speak" title="Nghe">🔊</button></div></div>
        <div class="progress-track"><div class="progress-fill" id="wr-progress" style="width:0%"></div></div>
        <div class="wr-prompt"><div class="py" id="wr-py"></div><div class="mn" id="wr-mn"></div></div>
        <div class="wr-cells" id="wr-cells"></div>
        <div class="wr-actions"><button id="wr-guide-btn">🖌 Thứ tự nét</button><button id="wr-ghost-btn">👁 Chữ mẫu mờ</button><button id="wr-swap">🔄 Đổi chữ</button><button id="wr-slow">🐢 Chuột chậm: Vừa</button><button class="primary" id="wr-check">✔ Kiểm tra</button></div>
        <div class="wr-guide" id="wr-guide"></div>
        <button class="btn-next" id="wr-next" style="margin-top:14px">Từ tiếp →</button>
        <div class="wr-note">Điểm = độ khớp hình dạng với chữ chuẩn (≥80% là đạt, có dung sai cho nét tay). Đây là so khớp hình dạng, không phải AI nhận dạng chữ viết tay. Chuột chậm = làm mượt/chậm nét khi dùng chuột để dễ viết; cảm ứng và bút không bị chậm.</div>
      </div>`;
    $('result-screen').parentNode.appendChild(d);
    $('wr-check').onclick = checkAll; $('wr-next').onclick = next; $('wr-guide-btn').onclick = toggleGuide; $('wr-swap').onclick = swapWord; $('wr-slow').onclick = cycleSlow; labelSlow();
    $('wr-ghost-btn').onclick = () => cells.forEach(c => c.ghost.classList.toggle('on'));
    $('wr-speak').onclick = function () { if (rounds[idx]) { if (!zhVoice) loadVoices(); speakChinese(rounds[idx].text, this); } };
  }
  function drawLevels() {
    $('wr-lv').innerHTML = LEVELS.map(l => `<button class="hsk-tab ${l === level ? 'active' : ''}" data-l="${l}">${l}</button>`).join('');
    $('wr-lv').querySelectorAll('button').forEach(b => b.onclick = () => { level = b.dataset.l; safeStorage.set(LS_LEVEL, level); start(level); });
  }
  function ensureBody() { if (!$('wr-cells')) { $('write-screen').remove(); build(); show('write-screen'); drawLevels(); } }
  function open() { build(); level = safeStorage.get(LS_LEVEL) || 'HSK1'; if (!LEVELS.includes(level)) level = 'HSK1'; show('write-screen'); start(level); }
  function start(lv) {
    build(); show('write-screen'); level = lv; drawLevels(); resetSession(); currentGameStarter = () => start(level);
    pool = gather(lv);
    if (pool.length < 1) return empty('Chưa có từ vựng ' + lv + ' để luyện viết. Hãy kiểm tra file HSK đã được tải chưa.');
    ensureBody();
    const store = safeStorage.get('cn_quiz_write_seen') || {}, seen = new Set(store[lv] || []);
    const due = SC().mistakes('char').filter(m => m.nextReview <= Date.now()).map(m => pool.find(p => p.text === m.text)).filter(Boolean);
    let fresh = pool.filter(p => !seen.has(p.text)); if (fresh.length < 8) { seen.clear(); fresh = pool; }
    const picked = []; const used = new Set(); const add = w => { if (w && !used.has(w.text) && picked.length < 8) { used.add(w.text); picked.push(w); } };
    shuffle(due).slice(0, 2).forEach(add); shuffle(fresh).forEach(add);
    store[lv] = [...seen, ...picked.map(p => p.text)]; safeStorage.set('cn_quiz_write_seen', store);
    rounds = picked; idx = 0; setRound();
  }
  function openMistakes() {
    build(); show('write-screen'); level = 'Sổ tay'; drawLevels();
    const lst = SC().mistakes('char').sort((a, b) => a.nextReview - b.nextReview).slice(0, 8);
    if (!lst.length) return empty('Sổ tay chưa có chữ nào cần viết lại.');
    ensureBody(); currentGameStarter = () => openMistakes(); resetSession();
    rounds = lst.map(m => ({ text: m.text, pinyin: m.pinyin || '', meaning: m.meaning || '', level: m.level || '' })); idx = 0; setRound();
  }
  function empty(msg) { $('wr-body').innerHTML = `<div class="ord-empty" style="padding:30px;text-align:center;color:var(--muted)">✍️<br>${escapeHTML(msg)}</div>`; rounds = []; }

  function setRound() {
    const w = rounds[idx]; locked = false; seq++;
    $('wr-py').textContent = w.pinyin || '';
    $('wr-mn').textContent = w.meaning || '';
    $('wr-counter').textContent = `${idx + 1} / ${rounds.length}`;
    $('wr-progress').style.width = (idx / rounds.length * 100) + '%';
    $('wr-next').classList.remove('visible'); $('wr-guide').className = 'wr-guide'; $('wr-guide').innerHTML = '';
    $('wr-check').disabled = false;
    try { if (window.HanziRecognizer && HanziRecognizer.prefetch) HanziRecognizer.prefetch(w.text); } catch (e) {}
    const host = $('wr-cells'); host.innerHTML = ''; cells = []; host.style.setProperty('--n', [...w.text].length);
    [...w.text].forEach(ch => cells.push(makeCell(host, ch, w)));
  }
  function makeCell(host, ch, word) {
    const el = document.createElement('div'); el.className = 'wr-cell';
    el.innerHTML = `<div class="wr-box"><div class="wr-grid"></div><div class="wr-ghost">${escapeHTML(ch)}</div><canvas></canvas></div>
      <div class="wr-tools"><button data-a="undo">↩ Nét</button><button data-a="clear">🗑 Xoá</button></div><div class="wr-res"></div>`;
    host.appendChild(el);
    const cv = el.querySelector('canvas'), box = el.querySelector('.wr-box');
    const c = { ch, word, strokes: [], cur: null, pid: null, cv, box, res: el.querySelector('.wr-res'), ghost: el.querySelector('.wr-ghost'), recorded: false, result: null, w: 0 };
    const fit = () => { const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; c.w = r.width / FS(); cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr)); redraw(c); };
    c.fit = fit; setTimeout(fit, 0); if (window.ResizeObserver) new ResizeObserver(fit).observe(cv);
    const pt = e => { const r = cv.getBoundingClientRect(); const f = FS(); return { x: (e.clientX - r.left) / f, y: (e.clientY - r.top) / f }; };
    const vc = document.createElement('div'); vc.className = 'wr-vc'; box.appendChild(vc);
    box.classList.toggle('slow', SLOW[slowIdx].k > 0);
    let tgt = null, vir = null, raf = 0, hover = false;
    const useSlow = e => SLOW[slowIdx].k > 0 && (!e || e.pointerType === 'mouse');
    const showVC = () => { if (vir && hover && SLOW[slowIdx].k > 0) { vc.style.display = 'block'; vc.style.left = vir.x + 'px'; vc.style.top = vir.y + 'px'; } else vc.style.display = 'none'; };
    function tick() {
      raf = 0; if (!tgt || !vir) return;
      const k = SLOW[slowIdx].k || 1;
      vir.x += (tgt.x - vir.x) * k; vir.y += (tgt.y - vir.y) * k;
      if (c.cur) { const l = c.cur[c.cur.length - 1]; if (Math.hypot(vir.x - l.x, vir.y - l.y) > 0.5) { c.cur.push({ x: vir.x, y: vir.y }); redraw(c); } }
      showVC();
      if (Math.hypot(tgt.x - vir.x, tgt.y - vir.y) > 0.4) raf = requestAnimationFrame(tick);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    cv.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; hover = true; tgt = pt(e); vir = { x: tgt.x, y: tgt.y }; showVC(); });
    cv.addEventListener('pointerleave', e => { if (c.pid !== null) return; hover = false; vc.style.display = 'none'; });
    cv.addEventListener('pointerdown', e => {
      if (locked || c.pid !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault(); c.pid = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      const p0 = pt(e); tgt = p0; vir = { x: p0.x, y: p0.y }; hover = e.pointerType === 'mouse';
      c.cur = [p0]; c.strokes.push(c.cur); clearResult(c); redraw(c); showVC();
    });
    cv.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' && !hover) { hover = true; vir = pt(e); }
      if (useSlow(e)) { tgt = pt(e); if (!vir) vir = { x: tgt.x, y: tgt.y }; kick(); return; }
      if (e.pointerId !== c.pid || !c.cur) return; e.preventDefault();
      const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; (ev.length ? ev : [e]).forEach(x => c.cur.push(pt(x))); redraw(c);
    });
    const end = e => {
      if (e.pointerId !== c.pid) return;
      if (c.cur && useSlow(e) && vir) { const t = pt(e); for (let i = 1; i <= 5; i++) c.cur.push({ x: vir.x + (t.x - vir.x) * i / 5, y: vir.y + (t.y - vir.y) * i / 5 }); vir = { x: t.x, y: t.y }; redraw(c); }
      c.pid = null; c.cur = null;
    };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('lostpointercapture', end);
    el.querySelector('[data-a=undo]').onclick = () => { if (locked) return; c.strokes.pop(); clearResult(c); redraw(c); };
    el.querySelector('[data-a=clear]').onclick = () => { if (locked) return; c.strokes = []; clearResult(c); redraw(c); };
    return c;
  }
  function clearResult(c) { c.result = null; c.box.className = 'wr-box'; c.res.className = 'wr-res'; c.res.textContent = ''; }
  function redraw(c) {
    const g = c.cv.getContext('2d'), dpr = c.cv.width / (c.w || 1);
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, c.cv.width, c.cv.height);
    g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = Math.max(5, c.w * 0.045);
    g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#fff';
    c.strokes.forEach(s => {
      g.beginPath();
      if (s.length === 1) { g.arc(s[0].x, s[0].y, g.lineWidth / 2, 0, 7); g.fillStyle = g.strokeStyle; g.fill(); return; }
      g.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length - 1; i++) { const mx = (s[i].x + s[i + 1].x) / 2, my = (s[i].y + s[i + 1].y) / 2; g.quadraticCurveTo(s[i].x, s[i].y, mx, my); }
      g.lineTo(s[s.length - 1].x, s[s.length - 1].y); g.stroke();
    });
  }

  async function checkAll() {
    if (locked) return;
    if (!window.HanziRecognizer || typeof HanziRecognizer.recognize !== 'function') {
      cells.forEach(c => fail(c, 'err', 'Không tải được module nhận diện chữ viết — chưa thể chấm. (Không tự cho đạt.)')); return;
    }
    if (cells.some(c => !c.strokes.length)) { showToast('Hãy viết đủ tất cả các chữ trước khi kiểm tra'); return; }
    const mine = seq; $('wr-check').disabled = true; $('wr-check').textContent = '⏳ Đang chấm…';
    const cands = [...new Set(pool.flatMap(p => [...p.text]))];
    let results = [];
    for (const c of cells) {
      const others = shuffle(cands.filter(x => x !== c.ch)).slice(0, 36);
      try { results.push(await HanziRecognizer.recognize(c.strokes, c.ch, others)); }
      catch (e) { results.push({ ok: false, error: 'exception', message: 'Lỗi nhận diện: ' + (e && e.message || e) }); }
    }
    if (mine !== seq) return;
    $('wr-check').textContent = '✔ Kiểm tra';
    let allDone = true;
    cells.forEach((c, i) => {
      const r = results[i]; c.result = r;
      if (!r.ok) { fail(c, 'err', r.message || 'Không nhận diện được.'); allDone = false; return; }
      const parts = [`<b>${r.percent}%</b> · ${r.pass ? 'Đạt ✅' : 'Cần viết lại ❌'}`];
      if (r.note) parts.push(escapeHTML(r.note));
      if (r.strokeInfo && r.strokeInfo.expected !== r.strokeInfo.got) parts.push(`Chữ có ${r.strokeInfo.expected} nét, bạn viết ${r.strokeInfo.got}`);
      if (r.strokeCheck && r.strokeCheck.issues && r.strokeCheck.issues.length) r.strokeCheck.issues.forEach(x => parts.push('⚠️ ' + escapeHTML(x.msg)));
      else if (r.strokeCheck && r.strokeCheck.checked) parts.push('✔ Thứ tự & hướng nét đúng');
      c.box.className = 'wr-box ' + (r.pass ? 'pass' : 'fail'); c.res.className = 'wr-res ' + (r.pass ? 'pass' : 'fail'); c.res.innerHTML = parts.join('<br>');
      settle(c, r);
    });
    $('wr-check').disabled = false;
    if (allDone) { $('wr-next').classList.add('visible'); $('wr-next').textContent = idx + 1 >= rounds.length ? 'Xem kết quả →' : 'Từ tiếp →'; locked = cells.every(c => c.result && c.result.ok && c.result.pass) ? true : false; if (locked) { $('wr-check').disabled = true; } }
  }
  function fail(c, cls, msg) { c.box.className = 'wr-box ' + cls; c.res.className = 'wr-res ' + cls; c.res.textContent = '⚠️ ' + msg; }
  function settle(c, r) {
    if (c.recorded) { if (r.pass) SC().mistakeRight('char', c.ch); return; }
    c.recorded = true;
    const w = c.word, item = { text: c.ch, pinyin: w.pinyin || '', meaning: w.meaning ? `trong từ ${w.text}: ${w.meaning}` : '', level: w.level || '' };
    const rec = SC().record('write', c.ch, r.pass, item, ['asked'].concat(r.pass ? ['pass'] : ['retry']));
    if (r.pass) { SC().mistakeRight('char', c.ch); score++; }
    else SC().mistakeWrong('char', c.ch, { text: c.ch, pinyin: w.pinyin || '', meaning: item.meaning || ('chữ trong ' + w.text), level: w.level || '', note: `Điểm lần gần nhất ${r.percent}%` });
  }
  function next() {
    if (!$('wr-next').classList.contains('visible')) return;
    idx++; if (idx >= rounds.length) {
      const ok = sessionLog.filter(x => x.ok).length, tot = sessionLog.length;
      showFinal({ score: ok, totalText: '/ ' + tot, pct: tot ? ok / tot * 100 : 0, title: 'Hoàn thành Luyện viết', sub: 'Chữ đã luyện hôm nay không cộng XP lần nữa' });
      document.getElementById('btn-practice-wrong').classList.remove('show'); window._lastWrongTexts = []; return;
    }
    setRound();
  }

  async function toggleGuide() {
    const g = $('wr-guide'); if (g.classList.contains('show')) { g.classList.remove('show'); return; }
    const w = rounds[idx]; g.className = 'wr-guide show'; g.innerHTML = '<div class="gn">⏳ Đang tải dữ liệu nét…</div>';
    const parts = []; let missing = false;
    for (const ch of w.text) {
      let data = null; try { data = window.HanziRecognizer && await HanziRecognizer.getStrokeData(ch); } catch (e) {}
      if (!data) { missing = true; parts.push(`<div><div style="font-family:var(--font-hanzi);font-size:110px;line-height:1.1;opacity:.6">${escapeHTML(ch)}</div></div>`); continue; }
      const paths = data.strokes.map((d, i) => `<path d="${d}" fill="var(--accent)" opacity="0" data-i="${i}"/>`).join('');
      parts.push(`<svg viewBox="0 0 1024 1024" data-ch="${escapeHTML(ch)}"><g transform="scale(1,-1) translate(0,-900)">${paths}</g></svg>`);
    }
    g.innerHTML = `<div class="gchars">${parts.join('')}</div><div class="gn">${missing ? 'Chưa tải được dữ liệu thứ tự nét (cần mạng tới CDN hanzi-writer-data; module đã sẵn sàng nhận dữ liệu này). Đang hiện chữ mẫu thay thế.' : 'Các nét hiện lần lượt theo đúng thứ tự viết. Bấm lại để xem lần nữa.'}</div>`;
    g.querySelectorAll('svg').forEach(svg => {
      const ps = [...svg.querySelectorAll('path')]; ps.forEach((p, i) => setTimeout(() => { p.style.transition = 'opacity .3s'; p.setAttribute('opacity', '1'); }, 350 + i * 600));
    });
  }

  window.WriteMode = { open, start, openMistakes, gather, _cells: () => cells, _state: () => ({ rounds, idx }) };
})();
