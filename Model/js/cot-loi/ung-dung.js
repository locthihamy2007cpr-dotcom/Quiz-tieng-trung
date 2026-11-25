let selectedQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let currentMode = 'dict';
let isPaused = false;
let currentGameStarter = null;

let matchRounds = 0;
let matchSelectedLeft = null;
let matchSelectedRight = null;
let matchScore = 0;
let matchPairs = [];

let dailyStats = safeStorage.get('cn_quiz_daily_stats') || {};
let srsWords = safeStorage.get('cn_quiz_srs_words') || [];
if (!Array.isArray(srsWords)) srsWords = [];
srsWords = srsWords.map(w => {
  if (!w.nextReview) w.nextReview = Date.now();
  if (!w.box) w.box = 1;
  if (!w.correctStreak) w.correctStreak = 0;
  return w;
}).filter(w => w.text && w.meaning && w.meaning.trim() !== '' && w.meaning !== 'Không rõ');

function getLocalDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}

function splitPinyin(text){
  if(!text) return {pinyin:null, text:""};
  const regex=/\(([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ][a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ\s\.\-']*)\)/;
  const m=text.match(regex);
  if(m){ return {pinyin:m[1].trim(), text:text.replace(m[0],'').replace(/\s+/g,' ').trim()}; }
  return {pinyin:null, text};
}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function escapeHTML(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function show(id) {
  ['welcome-screen','stats-screen','srs-screen','vocab-screen','hsk-screen','flash-screen','quiz-screen','listen-screen','match-screen','result-screen','order-screen','write-screen','pinyin-screen','hub-screen','px-screen']
    .forEach(s => { const el = document.getElementById(s); if (el) el.style.display = 'none'; });
  document.getElementById(id).style.display = 'block';
  if (id !== 'quiz-screen' && id !== 'listen-screen') stopQTimer();
  const cd = document.getElementById('corner-data');
  if (cd) cd.style.display = (id === 'welcome-screen') ? 'flex' : 'none';
}
function goHome() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isPaused = false;
  document.getElementById('pause-overlay').classList.remove('active');
  show('welcome-screen');
  updateDueBanner();
  updateHomeCard();
}
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

let UNIFIED_POOL = null;
let SENTENCE_POOL = null;

let activeOptDrag = null;

function optModel(btn) {
  const root = btn.querySelector('.option-text');
  if (!root) return null;
  const nodes = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let t;
  while (t = tw.nextNode()) nodes.push(t);
  if (!nodes.length) return null;
  let total = 0;
  for (const n of nodes) total += n.nodeValue.length;
  return { root, nodes, total };
}

function optPosAtOffset(model, offset) {
  let rem = Math.max(0, Math.min(offset, model.total));
  for (const t of model.nodes) {
    if (rem <= t.nodeValue.length) return [t, rem];
    rem -= t.nodeValue.length;
  }
  const last = model.nodes[model.nodes.length - 1];
  return [last, last.nodeValue.length];
}

function optOffsetAtPoint(model, x, y) {
  let node = null, off = 0, ok = false;
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p && p.offsetNode && model.root.contains(p.offsetNode)) {
      if (p.offsetNode.nodeType === 3) {
        node = p.offsetNode; off = p.offset; ok = true;
      } else {
        const kids = p.offsetNode.childNodes;
        for (let k = p.offset - 1; k >= 0; k--) {
          if (kids[k] && kids[k].nodeType === 3) { node = kids[k]; off = kids[k].nodeValue.length; ok = true; break; }
        }
      }
    }
  } else if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r && r.startContainer.nodeType === 3 && model.root.contains(r.startContainer)) {
      node = r.startContainer; off = r.startOffset; ok = true;
    }
  }
  if (!ok) return null;
  let total = 0;
  for (const t of model.nodes) {
    if (t === node) return total + Math.max(0, Math.min(off, t.nodeValue.length));
    total += t.nodeValue.length;
  }
  return null;
}

function setOptHighlight(model, a, b) {
  const lo = Math.min(a, b), hi = Math.max(a, b);
  if (hi - lo < 1) return;
  const p1 = optPosAtOffset(model, lo), p2 = optPosAtOffset(model, hi);
  const sel = window.getSelection();
  const r = document.createRange();
  r.setStart(p1[0], p1[1]);
  r.setEnd(p2[0], p2[1]);
  sel.removeAllRanges();
  sel.addRange(r);
}

function clearOptHighlight() {
  try { const sel = window.getSelection(); if (sel && sel.rangeCount) sel.removeAllRanges(); } catch (e) {}
}

function optBeginDrag(btn, x, y) {
  const model = optModel(btn);
  activeOptDrag = { btn, down: true, moved: false, startX: x, startY: y, model, startOff: model ? optOffsetAtPoint(model, x, y) : null };
}

function optHandleMove(x, y) {
  const d = activeOptDrag;
  if (!d || !d.down || !d.btn || d.btn.disabled) return;
  if (!d.moved) {
    const dx = x - d.startX, dy = y - d.startY;
    if (dx * dx + dy * dy < 36) return;
    d.moved = true;
    if (d.startOff == null) d.startOff = 0;
  }
  if (!d.model) return;
  const off = optOffsetAtPoint(d.model, x, y);
  if (off != null) setOptHighlight(d.model, d.startOff, off);
}

window.addEventListener('mousemove', e => { optHandleMove(e.clientX, e.clientY); });
window.addEventListener('mouseup', () => {
  const d = activeOptDrag;
  if (!d || !d.down) return;
  d.down = false;
  if (!d.moved) clearOptHighlight();
});

function wireOptButtons(btn, selectFn) {
  btn.addEventListener('mousedown', function (e) {
    if (e.button !== 0 || btn.disabled) return;
    optBeginDrag(btn, e.clientX, e.clientY);
    e.preventDefault();
  });
  btn.addEventListener('click', function () {
    const d = activeOptDrag;
    if (d && d.moved && d.btn === btn) { d.moved = false; return; }
    selectFn();
  });
  let touchLive = false;
  btn.addEventListener('touchstart', function (e) {
    if (btn.disabled || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchLive = true;
    optBeginDrag(btn, t.clientX, t.clientY);
  });
  btn.addEventListener('touchmove', function (e) {
    if (!touchLive) return;
    const d = activeOptDrag;
    if (!d || d.btn !== btn) return;
    const t = e.touches[0];
    if (!t) return;
    if (!d.moved) {
      const dx = t.clientX - d.startX, dy = t.clientY - d.startY;
      if (dx * dx + dy * dy < 144) return;
    }
    e.preventDefault();
    optHandleMove(t.clientX, t.clientY);
  }, { passive: false });
  btn.addEventListener('touchend', function (e) {
    if (!touchLive) return;
    const d = activeOptDrag;
    const isOurs = d && d.btn === btn;
    touchLive = false;
    if (!isOurs) return;
    e.preventDefault();
    if (d.moved) return;
    if (!e.touches.length && !btn.disabled) selectFn();
  }, { passive: false });
  btn.addEventListener('touchcancel', function () {
    touchLive = false;
    const d = activeOptDrag;
    if (d && d.btn === btn) { d.down = false; if (!d.moved) clearOptHighlight(); }
  });
}

function renderQuiz() {
  const q = selectedQuestions[currentIndex];
  if (!q) { showResult(); return; }
  document.getElementById('q-counter').textContent = `CÂU ${currentIndex+1} / ${selectedQuestions.length}`;
  document.getElementById('score-display').textContent = `⭐ ${score}`;
  document.getElementById('progress-bar').style.width = `${(currentIndex/selectedQuestions.length)*100}%`;

  const isLast = currentIndex === selectedQuestions.length - 1;
  let qNumText = `Câu hỏi ${currentIndex+1}`;
  if (isLast && q.isSentence) qNumText = `🎯 Câu hỏi ${currentIndex+1} — Mẫu câu`;
  document.getElementById('q-num').textContent = qNumText;

  const qText = document.getElementById('q-text');
  const qPinyin = document.getElementById('q-pinyin');
  const speakBtn = document.getElementById('btn-speak');

  qText.classList.remove('is-hanzi', 'is-sentence', 'is-meaning');

  if (q.view) {
    document.getElementById('q-num').textContent = `Câu hỏi ${currentIndex+1} — ${q.view.label}`;
    qText.textContent = q.view.text;
    if (q.view.cls) qText.classList.add(q.view.cls);
    if (q.view.pinyin) {
      qPinyin.textContent = q.view.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.toggle('hidden', !q.view.speak);
  } else if (q.isSentence) {
    qText.textContent = q.hanzi;
    qText.classList.add('is-sentence');
    if (q.pinyin) {
      qPinyin.textContent = q.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.remove('hidden');
  } else if (q.hanzi && q.hanzi.length > 0) {
    qText.textContent = q.hanzi;
    qText.classList.add('is-hanzi');
    if (q.pinyin) {
      qPinyin.textContent = q.pinyin;
      qPinyin.style.display = 'inline-block';
    } else qPinyin.style.display = 'none';
    speakBtn.classList.remove('hidden');
  } else {
    qText.textContent = q.q;
    qPinyin.style.display = 'none';
    speakBtn.classList.add('hidden');
  }

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.a.forEach((ans, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'option-wrap';
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.idx = i;
    let optHTML;
    if (q.optHanzi) {
      const parts = String(ans).split('\n');
      optHTML = `<span class="option-text hanzi-opt"><span class="opt-han">${escapeHTML(parts[0])}</span>${parts[1] ? `<span class="opt-py">${escapeHTML(parts[1])}</span>` : ''}</span>`;
    } else {
      optHTML = `<span class="option-text">${escapeHTML(ans)}</span>`;
    }
    btn.innerHTML = `
      <span class="option-label">${String.fromCharCode(65+i)}</span>
      ${optHTML}
    `;
    wireOptButtons(btn, () => selectAnswer(i, btn));
    wrap.appendChild(btn);
    grid.appendChild(wrap);
  });

  document.getElementById('feedback').className = 'feedback-msg';
  document.getElementById('feedback').textContent = '';
  const nextBtn = document.getElementById('btn-next');
  nextBtn.classList.remove('visible');
  nextBtn.textContent = currentIndex === selectedQuestions.length - 1 ? 'Xem Kết Quả 🏆' : 'Câu Tiếp Theo →';
  answered = false;
  renderReveal('reveal', null);
  updateComboChip();
  startQTimer(quizTimeout);
  if (autoSpeakQ && voiceEnabled && !speakBtn.classList.contains('hidden')) setTimeout(() => { if (!answered) speakCurrentQuestion(); }, 300);
}

function nextQuestion() {
  if (!answered) return;
  currentIndex++;
  if (currentIndex >= selectedQuestions.length) { showResult(); return; }
  renderQuiz();
}

function speakCurrentQuestion() {
  if (!voiceEnabled) { showToast('🔇 Giọng đọc đang tắt trong cài đặt'); return; }
  if (!zhVoice) loadVoices();
  const q = selectedQuestions[currentIndex];
  if (q) speakChinese(q.speakText || q.hanzi || q.q);
}

function restartCurrentGame() {
  document.getElementById('pause-overlay').classList.remove('active');
  if (currentGameStarter) currentGameStarter();
}

function updateDueBanner() {
  const due = srsWords.filter(w => w.nextReview <= Date.now()).length;
  const banner = document.getElementById('due-review-banner');
  if (due > 0) {
    banner.classList.add('show');
    document.getElementById('due-count').textContent = due;
  } else {
    banner.classList.remove('show');
  }
}

function closeSrsWarning() { document.getElementById('srs-warning-modal').classList.remove('active'); }
function startDueReview() { startSRSGame(true); }

function calculateStreak() {
  let streak = 0;
  let d = new Date();
  while (true) {
    const ds = getLocalDateStr(d);
    const day = dailyStats[ds];
    if (day && (day.correct > 0 || day.wrong > 0)) {
      streak++;
      d.setDate(d.getDate()-1);
    } else {
      if (streak === 0 && ds === getLocalDateStr()) { d.setDate(d.getDate()-1); continue; }
      break;
    }
  }
  return streak;
}

let vocabAll = [];
let vocabFiltered = [];
let vocabType = 'all';

function openVocab() {
  show('vocab-screen');
  vocabAll = [...(window.dictIndex || [])].filter(i => i.text && i.meaning);
  vocabType = 'all';
  document.querySelectorAll('.vocab-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === 'all');
  });
  document.getElementById('vocab-search').value = '';
  filterVocabList('');
}

function closeVocab() { goHome(); }

function filterVocabType(type, btn) {
  vocabType = type;
  document.querySelectorAll('.vocab-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterVocabList(document.getElementById('vocab-search').value);
}

function filterVocabList(q) {
  const raw = (q || '').trim();
  let base = vocabAll;
  if (vocabType === 'word') base = vocabAll.filter(i => i.type === 'word');
  else if (vocabType === 'sentence') base = vocabAll.filter(i => i.type === 'sentence');

  const byMeaning = (a, b) =>
    (a.meaning || '').localeCompare(b.meaning || '', 'vi', { sensitivity: 'base' });

  if (!raw) {
    vocabFiltered = [...base].sort(byMeaning);
  } else {
    vocabFiltered = base.filter(i =>
      smartMatch(raw, i.text) ||
      smartMatch(raw, i.pinyin) ||
      smartMatch(raw, i.meaning)
    ).sort(byMeaning);
  }
  renderVocabList();
}

function renderVocabList() {
  const list = document.getElementById('vocab-list');
  list.innerHTML = '';
  resetScroll(list);
  document.getElementById('vocab-count').textContent = `${vocabFiltered.length} mục`;

  if (vocabFiltered.length === 0) {
    list.innerHTML = `<div class="dict-empty">Không tìm thấy từ nào.</div>`;
    document.getElementById('alphabet-sidebar').innerHTML = '';
    return;
  }

  const groups = {};
  vocabFiltered.forEach(item => {
    const letter = getMeaningLetter(item.meaning);
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });

  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#' && b !== '#') return 1;
    if (b === '#' && a !== '#') return -1;
    return a.localeCompare(b);
  });

  letters.forEach(letter => {
    const grp = document.createElement('div');
    grp.id = 'vocab-letter-' + letter;
    const header = document.createElement('div');
    header.className = 'vocab-letter-header';
    header.textContent = letter;
    grp.appendChild(header);
    list.appendChild(grp);

    groups[letter].forEach(item => {
      const row = document.createElement('div');
      row.className = 'vocab-row';
      const badge = item.type === 'sentence'
        ? '<span class="v-badge">💬 câu</span>'
        : '<span class="v-badge word">🔤 từ</span>';

      let hanziClass = 'v-hanzi';
      if (item.text.length > 15) hanziClass += ' text-xxs';
      else if (item.text.length > 8) hanziClass += ' text-xs';
      else if (item.text.length > 5) hanziClass += ' text-sm';

      let meaningClass = 'v-meaning';
      if (item.meaning.length > 30) meaningClass += ' text-xs';
      else if (item.meaning.length > 15) meaningClass += ' text-sm';

      row.innerHTML = `
        <div class="vocab-info">
          <div class="vocab-text">
            ${badge}
            <span class="${hanziClass}">${escapeHTML(item.text)}</span>
          </div>
          <div class="${meaningClass}">${escapeHTML(item.meaning)}</div>
          <div class="v-pinyin">${escapeHTML(item.pinyin || '')}</div>
        </div>
        <div class="vocab-actions">
          <button class="v-speak" data-text="${escapeHTML(item.text)}">🔊</button>
        </div>
      `;
      row.querySelector('.v-speak').addEventListener('click', function(e){
        e.stopPropagation();
        if (!zhVoice) loadVoices();
        speakChinese(item.text, this);
      });
      grp.appendChild(row);
    });
  });

  renderAlphabetSidebar(letters);
}

function renderAlphabetSidebar(letters) {
  const bar = document.getElementById('alphabet-sidebar');
  bar.innerHTML = '';
  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  all.forEach(l => {
    const el = document.createElement('div');
    el.className = 'alphabet-letter' + (letters.includes(l) ? '' : ' disabled');
    el.textContent = l;
    el.addEventListener('click', () => {
      const target = document.getElementById('vocab-letter-' + l);
      if (target) {
        const list = document.getElementById('vocab-list');
        list.scrollTo({ top: target.offsetTop - 10, behavior: 'smooth' });
      }
    });
    bar.appendChild(el);
  });
  enableDragScroll(bar);
}

function enableDragScroll(el) {
  if (!el || el.dataset.dragscroll === '1') return;
  el.dataset.dragscroll = '1';
  let isDown = false, dragged = false, startY = 0, scrollTop = 0;
  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;
    isDown = true; dragged = false;
    startY = e.pageY; scrollTop = el.scrollTop;
  });
  el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('dragging'); });
  el.addEventListener('mouseup', () => {
    isDown = false;
    el.classList.remove('dragging');
    if (dragged) setTimeout(() => { dragged = false; }, 50);
  });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    const delta = e.pageY - startY;
    if (!dragged && Math.abs(delta) > 5) { dragged = true; el.classList.add('dragging'); }
    if (dragged) { e.preventDefault(); el.scrollTop = scrollTop - delta; }
  });
  el.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

let hskFiltered = [];
let hskLevel = 'HSK1';

function openHSK() {
  show('hsk-screen');
  hskLevel = 'HSK1';
  document.querySelectorAll('#hsk-level-tabs .hsk-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.level === 'HSK1');
  });
  document.getElementById('hsk-search').value = '';
  filterHSKList('');
}

function closeHSK() { goHome(); }

function filterHSKLevel(level, btn) {
  hskLevel = level;
  document.querySelectorAll('#hsk-level-tabs .hsk-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterHSKList(document.getElementById('hsk-search').value);
}

function filterHSKList(q) {
  const raw = (q || '').trim();
  let base = hskLevel === 'all' ? hskAll : hskAll.filter(i => i.level === hskLevel);
  if (raw) {
    base = base.filter(i =>
      smartMatch(raw, i.text) ||
      smartMatch(raw, i.pinyin) ||
      smartMatch(raw, i.meaning)
    );
  }

  hskFiltered = [...base].sort((a, b) =>
    (a.meaning || '').localeCompare(b.meaning || '', 'vi', { sensitivity: 'base' }));
  renderHSKList();
}

function renderHSKList() {
  const list = document.getElementById('hsk-list');
  const sidebar = document.getElementById('hsk-sidebar');
  document.getElementById('hsk-count').textContent =
    hskAll.length ? `${hskFiltered.length} / ${hskAll.length} từ vựng` : '';

  if (hskAll.length === 0) {
    list.innerHTML = `<div class="dict-empty" style="color:var(--wrong)">❌ Không tìm thấy dữ liệu HSK!
Kiểm tra lại xem file HSK1.js ... HSK6.js đã có dữ liệu và nằm trong thư mục Model chưa.</div>`;
    sidebar.innerHTML = '';
    return;
  }
  if (hskFiltered.length === 0) {
    list.innerHTML = `<div class="dict-empty">Không tìm thấy từ nào.</div>`;
    sidebar.innerHTML = '';
    return;
  }

  const groups = {};
  hskFiltered.forEach((item, idx) => {
    const letter = getMeaningLetter(item.meaning);
    (groups[letter] = groups[letter] || []).push([item, idx]);
  });
  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#' && b !== '#') return 1;
    if (b === '#' && a !== '#') return -1;
    return a.localeCompare(b);
  });

  let html = '';
  letters.forEach(letter => {
    html += `<div id="hsk-letter-${letter === '#' ? 'hash' : letter}"><div class="vocab-letter-header">${letter}</div>`;
    groups[letter].forEach(([item, idx]) => {
      let hanziClass = 'v-hanzi';
      if (item.text.length > 15) hanziClass += ' text-xxs';
      else if (item.text.length > 8) hanziClass += ' text-xs';
      else if (item.text.length > 5) hanziClass += ' text-sm';
      html += `
        <div class="vocab-row hsk-row">
          <div class="vocab-info">
            <div class="vocab-text">
              <span class="v-badge hsk-lv">${escapeHTML(item.level)}</span>
              <span class="${hanziClass}">${escapeHTML(item.text)}</span>
            </div>
            <div class="v-meaning">${escapeHTML(item.meaning)}</div>
            <div class="v-pinyin">${escapeHTML(item.pinyin)}</div>
          </div>
          <div class="vocab-actions">
            <button class="v-speak" data-idx="${idx}">🔊</button>
          </div>
          ${item.example ? `
          <div class="hsk-example">
            <div class="ex-body">
              <div class="ex-hanzi">${escapeHTML(item.example)}</div>
              ${item.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(item.examplePinyin)}</div>` : ''}
              ${item.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(item.exampleMeaning)}</div>` : ''}
            </div>
            <button class="v-speak ex-speak" data-idx="${idx}" data-ex="1" title="Đọc câu ví dụ">🔊</button>
          </div>` : ''}
        </div>`;
    });
    html += '</div>';
  });
  list.innerHTML = html;
  resetScroll(list);

  renderHSKSidebar(letters);
}

function renderHSKSidebar(letters) {
  const bar = document.getElementById('hsk-sidebar');
  bar.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').forEach(l => {
    const el = document.createElement('div');
    el.className = 'alphabet-letter' + (letters.includes(l) ? '' : ' disabled');
    el.textContent = l;
    el.addEventListener('click', () => {
      const target = document.getElementById('hsk-letter-' + (l === '#' ? 'hash' : l));
      if (target) document.getElementById('hsk-list').scrollTo({ top: target.offsetTop - 10, behavior: 'smooth' });
    });
    bar.appendChild(el);
  });
  enableDragScroll(bar);
}

function resetScroll(el) {
  if (!el) return;
  el.style.scrollBehavior = 'auto';
  el.scrollTop = 0;
  el.style.scrollBehavior = '';
}

let hskQuizMode = 'quiz';
let quizResultLabel = 'Chế độ Đấu trí';
const hskRange = l => { const m = /^range:(\d)-(\d)$/.exec(String(l)); return m ? [+m[1], +m[2]] : null; };
const hskLabel = l => { const r = hskRange(l); return r ? (r[0] === r[1] ? 'HSK ' + r[0] : 'HSK ' + r[0] + '-' + r[1]) : l === 'all' ? 'HSK 1-6' : String(l).replace('HSK', 'HSK '); };

function normKey(s) { return stripDiacritics(String(s || '')).replace(/\s+/g, ' ').trim(); }
function rawKey(s) { return String(s || '').normalize('NFC').toLowerCase().replace(/\s+/g, '').trim(); }

function synTokens(item) {
  if (item._syn) return item._syn;
  item._syn = String(item.meaning || '').split(/[,;\/()（）、]|\s-\s/).map(normKey).filter(t => t.length >= 2);
  return item._syn;
}
function meaningConflict(a, b) {
  const A = synTokens(a), B = synTokens(b);
  for (const x of A) for (const y of B) {
    if (x === y) return true;
    if ((' ' + x + ' ').includes(' ' + y + ' ') || (' ' + y + ' ').includes(' ' + x + ' ')) return true;
  }
  return false;
}

function hskPool(level) {
  const r = hskRange(level);
  const base = r ? hskAll.filter(i => { const n = +String(i.level).replace('HSK', ''); return n >= r[0] && n <= r[1]; })
    : level === 'all' ? hskAll : hskAll.filter(i => i.level === level);
  return base.filter(i => i.text && i.meaning);
}
function distractorPool(level) {
  const p = hskPool(level);
  return p.length >= 40 ? p : hskAll.filter(i => i.text && i.meaning);
}

function pickDistractors(t, cands, valFn, n, scoreFn, o) {
  o = o || {};
  const keyFn = o.keyFn || normKey;
  const taken = new Set((o.exclude || []).map(keyFn));
  taken.add(keyFn(valFn(t)));
  const ranked = [];
  for (const c of cands) {
    if (c === t || c.text === t.text) continue;
    if (!o.noConflict && meaningConflict(t, c)) continue;
    if (o.filter && !o.filter(c)) continue;
    const v = valFn(c);
    if (!v) continue;
    const k = keyFn(v);
    if (taken.has(k)) continue;
    ranked.push([scoreFn(t, c), v, k]);
  }
  ranked.sort((a, b) => a[0] - b[0]);
  const top = shuffle(ranked.slice(0, Math.max(n * 5, 12)));
  const out = [];
  for (const [, v, k] of top) {
    if (taken.has(k)) continue;
    taken.add(k); out.push(v);
    if (out.length >= n) break;
  }
  return out;
}
const lenRatio = (a, b) => Math.abs(a - b) / Math.max(a, b, 1) * 10;
const simMeaning = (t, c) => lenRatio(t.meaning.length, c.meaning.length) + (c.text.length === t.text.length ? 0 : 3) + Math.random() * 2;
const simHanzi = (t, c) => (c.text.length === t.text.length ? 0 : 6) + ([...t.text].some(ch => c.text.includes(ch)) ? -2 : 0) + Math.random() * 3;
const simCloze = (t, c) => (c.text.length === t.text.length ? 0 : 6) + Math.random() * 3;
const simSentence = (t, c) => lenRatio(t.exampleMeaning.length, c.exampleMeaning.length) + Math.random() * 3;
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[m][n];
}
const hanOpt = c => c.pinyin ? `${c.text}\n${String(c.pinyin).normalize('NFC')}` : c.text;

const TONE_MAP = { a: 'aāáǎà', e: 'eēéěè', o: 'oōóǒò', i: 'iīíǐì', u: 'uūúǔù', 'ü': 'üǖǘǚǜ' };
function toneVariants(py, n) {
  py = String(py).normalize('NFC');
  const chars = [...py];
  const low = chars.map(c => c.toLowerCase());
  const marked = [];
  low.forEach((ch, i) => {
    for (const b in TONE_MAP) { const idx = TONE_MAP[b].indexOf(ch); if (idx > 0) { marked.push([i, b, idx]); break; } }
  });
  let spots = marked;
  if (!spots.length) {
    let at = -1, base = '';
    for (const v of ['a', 'e', 'o']) { at = low.indexOf(v); if (at >= 0) { base = v; break; } }
    if (at < 0) for (let i = low.length - 1; i >= 0; i--) if ('iuü'.includes(low[i])) { at = i; base = low[i]; break; }
    if (at >= 0) spots = [[at, base, 0]];
  }
  const make = list => {
    const c = [...chars];
    list.forEach(([i, b, t]) => { const r = TONE_MAP[b][t]; c[i] = chars[i] !== low[i] ? r.toUpperCase() : r; });
    return c.join('');
  };
  const out = new Set();
  const singles = [];
  spots.forEach(([i, b, idx]) => { for (let t = 1; t <= 4; t++) if (t !== idx) singles.push([i, b, t]); });
  shuffle(singles).forEach(x => { if (out.size < n) out.add(make([x])); });
  let guard = 0;
  while (out.size < n && spots.length > 1 && guard++ < 30) {
    const two = shuffle(spots).slice(0, 2).map(([i, b, idx]) => [i, b, [1, 2, 3, 4].filter(t => t !== idx)[Math.floor(Math.random() * 3)]]);
    out.add(make(two));
  }
  out.delete(py);
  return [...out].slice(0, n);
}

function mkQ(t, opts, correctVal, view, optHanzi) {
  const idx = opts.indexOf(correctVal);
  const kf = view.pinyinOpts ? rawKey : normKey;
  if (idx < 0 || new Set(opts.map(kf)).size !== opts.length) return null;
  return { q: view.text, a: opts, correct: idx, rawTarget: t, view, speakText: view.speakText || null,
           optHanzi: !!optHanzi, pinyin: null, hanzi: '', isSentence: false };
}

function qH2M(t, cands) {
  const d = pickDistractors(t, cands, c => c.meaning, 3, simMeaning);
  if (d.length < 3) return null;
  return mkQ(t, shuffle([t.meaning, ...d]), t.meaning,
    { label: 'Chữ Hán này nghĩa là gì?', text: t.text, cls: 'is-hanzi', pinyin: t.pinyin, speak: true, speakText: t.text });
}

function qM2H(t, cands) {
  const d = pickDistractors(t, cands, hanOpt, 3, simHanzi);
  if (d.length < 3) return null;
  return mkQ(t, shuffle([hanOpt(t), ...d]), hanOpt(t),
    { label: 'Chọn chữ Hán đúng với nghĩa:', text: t.meaning, cls: 'is-meaning', pinyin: null, speak: false }, true);
}

function qH2P(t, cands) {
  if (!t.pinyin) return null;
  const correct = String(t.pinyin).normalize('NFC');
  let d = toneVariants(correct, 3);
  if (d.length < 3) {
    const more = pickDistractors(t, cands, c => c.pinyin ? String(c.pinyin).normalize('NFC') : '', 3 - d.length,
      (a, c) => levenshtein(stripDiacritics(a.pinyin).replace(/\s/g, ''), stripDiacritics(c.pinyin).replace(/\s/g, '')) + Math.random(),
      { keyFn: rawKey, noConflict: true, exclude: [correct, ...d] });
    d = d.concat(more);
  }
  if (d.length < 3) return null;
  return mkQ(t, shuffle([correct, ...d.slice(0, 3)]), correct,
    { label: 'Pinyin đúng của chữ này là gì?', text: t.text, cls: 'is-hanzi', pinyin: null, speak: true, speakText: t.text, pinyinOpts: true });
}

function qCloze(t, cands) {
  if (!t.example || !t.exampleMeaning || !/[一-龥]/.test(t.text)) return null;
  const cnt = t.example.split(t.text).length - 1;
  if (cnt < 1 || cnt > 2) return null;
  const blank = t.example.split(t.text).join('＿＿');
  const d = pickDistractors(t, cands, hanOpt, 3, simCloze,
    { filter: c => !t.example.includes(c.text) && !c.text.includes(t.text) && !t.text.includes(c.text) });
  if (d.length < 3) return null;
  return mkQ(t, shuffle([hanOpt(t), ...d]), hanOpt(t),
    { label: 'Điền từ còn thiếu vào chỗ trống:', text: blank, cls: 'is-sentence', pinyin: '💡 ' + t.exampleMeaning, speak: false }, true);
}

function qSent(t, cands) {
  if (!t.example || !t.exampleMeaning) return null;
  const d = pickDistractors(t, cands, c => c.exampleMeaning || '', 3, simSentence,
    { noConflict: true, filter: c => c.example && c.example !== t.example });
  if (d.length < 3) return null;
  return mkQ(t, shuffle([t.exampleMeaning, ...d]), t.exampleMeaning,
    { label: 'Câu này nghĩa là gì?', text: t.example, cls: 'is-sentence', pinyin: t.examplePinyin || null, speak: true, speakText: t.example });
}

function runHSKQuiz(level, n) {
  n = n || 10;
  const qs = buildHSKQuestions(level, n);
  if (!qs.length) { showToast('❌ Chưa đủ dữ liệu để tạo đề'); return; }
  currentGameStarter = () => runHSKQuiz(level, n);
  resetSession();
  selectedQuestions = qs;
  currentIndex = 0; score = 0; answered = false;
  quizResultLabel = `Kiểm tra ${hskLabel(level)}`;
  show('quiz-screen');
  const badge = document.getElementById('mode-badge');
  badge.textContent = `📝 ${hskLabel(level)}`;
  badge.className = 'mode-badge hsk-mode';
  renderQuiz();
}

function runHSKListen(level, n) {
  n = n || 10;
  const targets = pickHSKTargets(level, n);
  const cands = distractorPool(level);
  listenQuestions = targets.map(t => {

    const d = pickDistractors(t, cands, c => c.meaning, 3, simMeaning,
      { filter: c => rawKey(c.pinyin) !== rawKey(t.pinyin) });
    if (d.length < 3) return null;
    const arr = shuffle([t.meaning, ...d]);
    return { target: t, options: { arr, correct: arr.indexOf(t.meaning) } };
  }).filter(Boolean);
  if (!listenQuestions.length) { showToast('❌ Chưa đủ dữ liệu để tạo đề'); return; }
  currentGameStarter = () => runHSKListen(level, n);
  resetSession();
  listenLabel = `Nghe đoán ${hskLabel(level)}`;
  listenIndex = 0; listenScore = 0; listenAnswered = false;
  show('listen-screen');
  renderListen();
}

function startHSKQuiz(level, n) {
  closeHSKQuizModal();
  if (hskPool(level).length < 4) { showToast('❌ Chưa đủ dữ liệu HSK'); return; }
  if (hskQuizMode === 'listen') runHSKListen(level, n); else runHSKQuiz(level, n);
}
function startHSKRange() {
  let a = +document.getElementById('hsk-from').value, b = +document.getElementById('hsk-to').value;
  if (a > b) [a, b] = [b, a];
  const n = +document.getElementById('hsk-count').value || 20;
  safeStorage.set('cn_quiz_hsk_range', { a, b, n });
  startHSKQuiz('range:' + a + '-' + b, n);
}

function openHSKQuiz() {
  const grid = document.getElementById('hsk-level-grid');
  if (!hskAll.length) {
    grid.innerHTML = `<div class="dict-empty" style="grid-column:1/-1;color:var(--wrong)">❌ Chưa có dữ liệu HSK1.js … HSK6.js (trong thư mục Model)</div>`;
  } else {
    let html = '';
    for (let i = 1; i <= 6; i++) {
      const lv = 'HSK' + i, c = hskPool(lv).length;
      html += `<button class="time-btn" ${c < 4 ? 'disabled' : ''} onclick="startHSKQuiz('${lv}')">HSK ${i}<small>${c} từ</small></button>`;
    }
    html += `<button class="time-btn wide" onclick="startHSKQuiz('all')">🎯 Tổng hợp HSK 1-6<small>${hskPool('all').length} từ · trộn đều các cấp</small></button>`;
    const saved = safeStorage.get('cn_quiz_hsk_range') || { a: 1, b: 2, n: 20 };
    const opt = (v, cur) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${v}</option>`;
    const selCss = 'padding:8px 6px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 14px var(--font-body);';
    html += `<div style="grid-column:1/-1;border:1px solid var(--border);border-radius:var(--radius-md);padding:10px;display:flex;flex-direction:column;gap:8px;text-align:left">
      <div style="font-weight:800;font-size:13px">📐 Chọn phạm vi HSK</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px">
        Từ <select id="hsk-from" style="${selCss}">${[1,2,3,4,5,6].map(v => opt(v, saved.a)).join('')}</select>
        đến <select id="hsk-to" style="${selCss}">${[1,2,3,4,5,6].map(v => opt(v, saved.b)).join('')}</select>
        <select id="hsk-count" style="${selCss}">${[10,20,30,40].map(v => `<option value="${v}" ${v === saved.n ? 'selected' : ''}>${v} câu</option>`).join('')}</select>
      </div>
      <button class="time-btn" style="border-color:#f472b6" onclick="startHSKRange()">▶ Bắt đầu</button></div>`;
    grid.innerHTML = html;
  }
  document.getElementById('hsk-quiz-modal').classList.add('active');
}
function closeHSKQuizModal() { document.getElementById('hsk-quiz-modal').classList.remove('active'); }
function setHSKQuizMode(m, btn) {
  hskQuizMode = m;
  document.querySelectorAll('.hsk-mode-btn').forEach(b => b.classList.toggle('active', b === btn));
}

document.getElementById('hsk-list').addEventListener('click', function (e) {
  const btn = e.target.closest('.v-speak');
  if (!btn) return;
  e.stopPropagation();
  const item = hskFiltered[parseInt(btn.dataset.idx, 10)];
  if (!item) return;
  if (!zhVoice) loadVoices();
  speakChinese(btn.dataset.ex ? item.example : item.text, btn);
});

function renderDictResultItem(item) {
  const div = document.createElement('div');
  div.className = 'dict-item';
  const badge = item.level
    ? `<span class="v-badge hsk-lv">${escapeHTML(item.level)}</span>`
    : (item.type === 'sentence' ? '<span class="v-badge">💬 câu</span>' : '');

  let hanziClass = 'dict-item-text';
  if (item.text.length > 15) hanziClass += ' text-xs';
  else if (item.text.length > 8) hanziClass += ' text-sm';

  div.innerHTML = `
    <div class="dict-item-info">
      <div class="${hanziClass}">
        ${badge}
        <span>${escapeHTML(item.text)}</span>
        <span class="dict-item-pinyin">${escapeHTML(item.pinyin || '')}</span>
      </div>
      <div style="font-size:14px;color:var(--text);">${escapeHTML(item.meaning || '')}</div>
      ${item.example ? `
      <div class="dict-example">
        <div class="ex-hanzi">${escapeHTML(item.example)}<button class="dict-ex-speak" title="Đọc câu ví dụ">🔊</button></div>
        ${item.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(item.examplePinyin)}</div>` : ''}
        ${item.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(item.exampleMeaning)}</div>` : ''}
      </div>` : ''}
    </div>
    <button class="dict-speak" data-text="${escapeHTML(item.text)}">🔊</button>
  `;
  div.querySelector('.dict-speak').addEventListener('click', function(){
    if (!zhVoice) loadVoices();
    speakChinese(item.text, this);
  });
  const exBtn = div.querySelector('.dict-ex-speak');
  if (exBtn) exBtn.addEventListener('click', function(){
    if (!zhVoice) loadVoices();
    speakChinese(item.example, this);
  });
  return div;
}

function handleDictSearch(q) {
  const raw = (q || '').trim();
  const results = document.getElementById('dict-results');
  const clear = document.getElementById('dict-clear');
  if (clear) clear.classList.toggle('visible', !!raw);
  if (!raw) { results.classList.remove('active'); results.innerHTML = ''; return; }

  resetScroll(results);
  const matches = searchAllDict(raw, 50);

  results.classList.add('active');
  if (matches.length === 0) {
    results.innerHTML = `<div class="dict-empty">Không tìm thấy "${escapeHTML(q)}".</div>`;
    return;
  }
  results.innerHTML = '';
  matches.forEach(item => results.appendChild(renderDictResultItem(item)));
}

function clearDictSearch() {
  document.getElementById('dict-search').value = '';
  document.getElementById('dict-results').classList.remove('active');
  document.getElementById('dict-results').innerHTML = '';
  document.getElementById('dict-clear').classList.remove('visible');
}

function handleQuizSearch(q) {
  const raw = (q || '').trim();
  const results = document.getElementById('quiz-dict-results');
  if (!raw) { results.innerHTML = ''; return; }
  resetScroll(results);
  const matches = searchAllDict(raw, 40);
  if (matches.length === 0) {
    results.innerHTML = `<div class="dict-empty">Không tìm thấy "${escapeHTML(q)}".</div>`;
    return;
  }
  results.innerHTML = '';
  matches.forEach(item => results.appendChild(renderDictResultItem(item)));
}


function togglePause(show) {
  isPaused = show;
  const ov = document.getElementById('pause-overlay');
  if (show) ov.classList.add('active');
  else ov.classList.remove('active');
}

function toggleQuizDict(show) {
  isPaused = !!show;
  document.getElementById('quiz-dict-overlay').classList.toggle('active', show);
  if (show) setTimeout(() => document.getElementById('quiz-dict-search').focus(), 100);
}

(function(){
  const c = document.getElementById('stars');
  if (!c) return;
  for (let i=0; i<80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.setProperty('--dur', (Math.random()*4+2)+'s');
    s.style.setProperty('--delay', (Math.random()*5)+'s');
    s.style.setProperty('--max-opacity', (Math.random()*.5+.1).toFixed(2));
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    c.appendChild(s);
  }
})();

function attachSpotlight(el, { tilt = false } = {}) {
  if (!el || el.dataset.spotlight === '1') return;
  el.dataset.spotlight = '1';
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (tilt) {
      const dx = (e.clientX - r.left - r.width/2) / r.width;
      const dy = (e.clientY - r.top - r.height/2) / r.height;
      el.style.setProperty('--rx', `${-dy*6}deg`);
      el.style.setProperty('--ry', `${dx*6}deg`);
    }
  });
  el.addEventListener('pointerleave', () => {
    if (tilt) { el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); }
  });
}

let sessionLog = [];
let comboCount = 0, bestCombo = 0, sessionXP = 0;
let xp = Number(safeStorage.get('cn_quiz_xp')) || 0;
let levelStats = safeStorage.get('cn_quiz_level_stats') || {};
let _hskMap = null;

function resetSession() { sessionLog = []; comboCount = 0; bestCombo = 0; sessionXP = 0; updateComboChip(); }

const xpForLevel = l => 60 * (l - 1) * (l - 1);
const levelFromXP = x => Math.floor(Math.sqrt(x / 60)) + 1;
function gainXP(n) {
  const before = levelFromXP(xp);
  xp += n; sessionXP += n;
  safeStorage.set('cn_quiz_xp', xp);
  const after = levelFromXP(xp);
  if (after > before) { showToast(`🎉 Lên cấp ${after}!`); burstConfetti(); }
}
function todayTotal() { const d = dailyStats[getLocalDateStr()]; return d ? (d.correct || 0) + (d.wrong || 0) : 0; }
function checkDailyGoal() {
  if (todayTotal() >= dailyGoal && safeStorage.get('cn_quiz_goal_done') !== getLocalDateStr()) {
    safeStorage.set('cn_quiz_goal_done', getLocalDateStr());
    showToast(`🎯 Hoàn thành mục tiêu ${dailyGoal} câu hôm nay!`);
    burstConfetti();
  }
}
function updateHomeCard() {
  const t = todayTotal(), pct = Math.min(100, Math.round(t / dailyGoal * 100));
  const ring = document.getElementById('goal-ring'); if (!ring) return;
  ring.style.setProperty('--p', pct);
  ring.classList.toggle('done', pct >= 100);
  document.getElementById('goal-ring-text').textContent = pct >= 100 ? '✓' : pct + '%';
  document.getElementById('hp-sub').textContent = pct >= 100 ? `Xong rồi! ${t} câu hôm nay 🎉` : `${t} / ${dailyGoal} câu`;
  document.getElementById('chip-streak').textContent = `🔥 ${calculateStreak()} ngày`;
  document.getElementById('chip-level').textContent = `⚡ Lv ${levelFromXP(xp)}`;
}

function burstConfetti() {
  const cv = document.getElementById('confetti'); if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cv.width = innerWidth; cv.height = innerHeight;
  const ctx = cv.getContext('2d');
  const colors = ['#7c6aff', '#c084fc', '#38bdf8', '#22c55e', '#facc15', '#f472b6', '#ff6b35'];
  const ps = Array.from({ length: 110 }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .45,
    vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, g: .35 + Math.random() * .2,
    s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); ctx.restore(); });
    if (++frames < 130) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}
function countUp(el, to) {
  const t0 = performance.now(), dur = 700;
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}
function updateComboChip() {
  document.querySelectorAll('.combo-chip').forEach(c => {
    c.classList.toggle('show', comboCount >= 2);
    c.textContent = `🔥 x${comboCount}`;
  });
}

function renderReveal(id, item) {
  const box = document.getElementById(id);
  if (!box) return;
  if (!item) { box.innerHTML = ''; box.classList.remove('show'); return; }
  const it = enrich(item);
  box.innerHTML = `
    <div class="rv-top">
      <span class="rv-han${it.text.length > 8 ? ' long' : ''}">${escapeHTML(it.text)}</span>
      <span class="rv-py">${escapeHTML(it.pinyin || '')}</span>
      ${it.level ? `<span class="v-badge hsk-lv">${escapeHTML(it.level)}</span>` : ''}
      <button class="v-speak" data-s="w" title="Nghe từ">🔊</button>
    </div>
    <div class="rv-mean">${escapeHTML(it.meaning || '')}</div>
    ${it.example ? `
    <div class="rv-ex">
      <div class="ex-hanzi">${escapeHTML(it.example)}<button class="dict-ex-speak" data-s="e" title="Đọc câu ví dụ">🔊</button></div>
      ${it.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(it.examplePinyin)}</div>` : ''}
      ${it.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(it.exampleMeaning)}</div>` : ''}
    </div>` : ''}`;
  box.classList.add('show');
  box.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', function () {
    if (!zhVoice) loadVoices();
    speakChinese(this.dataset.s === 'e' ? it.example : it.text, this);
  }));
}

function recordAnswer(isCorrect, targetWord, opts) {
  opts = opts || {};
  const today = getLocalDateStr();
  if (!dailyStats[today]) dailyStats[today] = { correct: 0, wrong: 0 };
  if (isCorrect) dailyStats[today].correct++; else dailyStats[today].wrong++;
  safeStorage.set('cn_quiz_daily_stats', dailyStats);

  if (isCorrect) { comboCount++; bestCombo = Math.max(bestCombo, comboCount); if (!opts.noXP) gainXP(10 + Math.min(comboCount - 1, 5) * 2); }
  else { comboCount = 0; if (!opts.noXP) gainXP(2); }
  updateComboChip();

  if (targetWord && typeof targetWord === 'object') {
    const lv = targetWord.level || 'Khác';
    const ls = levelStats[lv] || (levelStats[lv] = { c: 0, w: 0 });
    if (isCorrect) ls.c++; else ls.w++;
    safeStorage.set('cn_quiz_level_stats', levelStats);
    sessionLog.push({ text: targetWord.text, pinyin: targetWord.pinyin || '', meaning: targetWord.meaning || '', ok: isCorrect });
  }

  if (targetWord && !opts.noSRS) {
    let wordObj = (typeof targetWord === 'object') ? { ...targetWord } : null;
    if (wordObj) {
      if (!wordObj.meaning || !wordObj.meaning.trim() || wordObj.meaning === 'Không rõ') {
        const found = (window.dictIndex || []).find(i => i.text === wordObj.text);
        if (found && found.meaning) wordObj.meaning = found.meaning;
      }
      if (wordObj.text && wordObj.meaning && wordObj.meaning.trim()) {
        const existing = srsWords.find(w => w.text === wordObj.text);
        if (existing) {
          if (isCorrect) {
            existing.correctStreak = (existing.correctStreak || 0) + 1;
            existing.wrongCount = 0;
            existing.box = Math.min(5, (existing.box || 1) + 1);
            const intervals = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
            existing.nextReview = Date.now() + (intervals[existing.box] || 30) * 86400000;
          } else {
            existing.correctStreak = 0;
            existing.wrongCount = (existing.wrongCount || 0) + 1;
            existing.box = 1;
            existing.nextReview = Date.now();
          }
          if (wordObj.level && !existing.level) existing.level = wordObj.level;
        } else if (!isCorrect) {
          srsWords.push({ text: wordObj.text, pinyin: wordObj.pinyin || '', meaning: wordObj.meaning, level: wordObj.level || '',
            wrongCount: 1, correctStreak: 0, box: 1, nextReview: Date.now() });
        }
        safeStorage.set('cn_quiz_srs_words', srsWords);
      }
    }
  }
  updateDueBanner();
  updateHomeCard();
  checkDailyGoal();
}

function pickTargets(pool, key, n) {
  pool = pool.filter(i => i.text && i.meaning);
  const store = safeStorage.get('cn_quiz_hsk_seen') || {};
  let seen = new Set(store[key] || []);
  const now = Date.now();
  const dueSet = new Set(srsWords.filter(w => w.nextReview <= now).map(w => w.text));
  const wrongSet = new Set(srsWords.map(w => w.text));
  const chosen = [], used = new Set();
  const add = it => { if (chosen.length >= n || used.has(it.text)) return; used.add(it.text); chosen.push(it); };
  const takeFrom = list => {
    const groups = {};
    shuffle(list).forEach(i => (groups[i.level || '-'] = groups[i.level || '-'] || []).push(i));
    const keys = shuffle(Object.keys(groups));
    let progressed = true;
    while (chosen.length < n && progressed) {
      progressed = false;
      for (const k of keys) {
        const it = groups[k].shift();
        if (it) { progressed = true; add(it); }
        if (chosen.length >= n) break;
      }
    }
  };
  shuffle(pool.filter(i => dueSet.has(i.text))).slice(0, 2).forEach(add);
  shuffle(pool.filter(i => wrongSet.has(i.text) && !dueSet.has(i.text))).slice(0, 1).forEach(add);
  takeFrom(pool.filter(i => !seen.has(i.text) && !used.has(i.text)));
  if (chosen.length < n) { seen = new Set(); takeFrom(pool.filter(i => !used.has(i.text))); }
  chosen.forEach(i => seen.add(i.text));
  store[key] = [...seen];
  safeStorage.set('cn_quiz_hsk_seen', store);

  const ever = safeStorage.get('cn_quiz_hsk_ever') || {};
  let dirty = false;
  chosen.forEach(i => { if (i.level) { const a = ever[i.level] || (ever[i.level] = []); if (!a.includes(i.text)) { a.push(i.text); dirty = true; } } });
  if (dirty) safeStorage.set('cn_quiz_hsk_ever', ever);
  return shuffle(chosen);
}
const pickHSKTargets = (level, n) => pickTargets(hskPool(level), level, n);

function allWordsPool() {
  return [...(window.dictWords || []).filter(w => w.meaning && w.meaning.trim()), ...hskAll.filter(i => i.text && i.meaning)];
}

function buildFromTargets(targets, cands, quota) {
  const builders = { h2m: qH2M, m2h: qM2H, h2p: qH2P, cloze: qCloze, sent: qSent };
  quota = { ...quota };
  const out = [];
  targets.forEach(t0 => {
    const t = enrich(t0);
    let q = null, kind = null;
    for (const k of shuffle(Object.keys(quota).filter(k => quota[k] > 0))) {
      q = builders[k](t, cands);
      if (q) { kind = k; break; }
    }
    if (!q) for (const k of shuffle(['h2m', 'm2h'])) { q = builders[k](t, cands); if (q) { kind = k; break; } }
    if (q) { if (quota[kind] > 0) quota[kind]--; out.push(q); }
  });
  return out;
}
function scaledQuota(n) {
  const k = (n || 10) / 10, q = { h2m: 3, m2h: 2, h2p: 2, cloze: 2, sent: 1 };
  Object.keys(q).forEach(x => q[x] = Math.max(1, Math.round(q[x] * k)));
  return q;
}
function buildHSKQuestions(level, n) {
  return buildFromTargets(pickHSKTargets(level, n || 10), distractorPool(level), scaledQuota(n));
}

// Trắc nghiệm kiểu Đấu trí trên một danh sách từ bất kỳ (dùng cho Luyện thêm: chủ đề, khẩu ngữ…)
function runPoolQuiz(pool, label, n) {
  pool = (pool || []).filter(i => i.text && i.meaning);
  if (pool.length < 4) { showToast('❌ Chưa đủ dữ liệu để tạo đề'); return; }
  n = n || 10;
  const qs = buildFromTargets(pickTargets(pool, 'pool:' + label, n), pool.length >= 40 ? pool : allWordsPool(), scaledQuota(n));
  if (!qs.length) { showToast('❌ Chưa đủ dữ liệu để tạo đề'); return; }
  currentGameStarter = () => runPoolQuiz(pool, label, n);
  resetSession();
  selectedQuestions = qs; currentIndex = 0; score = 0; answered = false;
  quizResultLabel = 'Trắc nghiệm ' + label;
  show('quiz-screen');
  const badge = document.getElementById('mode-badge');
  badge.textContent = '🚀 ' + label; badge.className = 'mode-badge hsk-mode';
  renderQuiz();
}
function qSentenceItem(item, sents, label) {
  const d = pickDistractors(item, sents, c => c.meaning, 3,
    (a, c) => lenRatio(a.meaning.length, c.meaning.length) + Math.random() * 3, { noConflict: true });
  if (d.length < 3) return null;
  return mkQ(item, shuffle([item.meaning, ...d]), item.meaning,
    { label, text: item.text, cls: 'is-sentence', pinyin: item.pinyin || null, speak: true, speakText: item.text });
}
const validWords = () => (window.dictWords || []).filter(w => w.meaning && w.meaning.trim());
const validSents = () => (window.dictSentences || []).filter(s => s.meaning && s.meaning.trim());

function startGame(mode) {
  currentMode = mode || 'dict';
  quizResultLabel = 'Chế độ Đấu trí';
  currentGameStarter = () => startGame(mode);
  const words = validWords(), sents = validSents();
  if (!words.length && !sents.length) { alert('Chưa có dữ liệu quiz! Kiểm tra Data.js trong thư mục Model.'); return; }
  resetSession();
  const useSent = sents.length >= 4;
  let qs = words.length >= 4
    ? buildFromTargets(pickTargets(words, 'dict', useSent ? 9 : 10), words, { h2m: 4, m2h: 3, h2p: 2, cloze: 1 })
    : [];
  if (useSent) {
    const it = pickTargets(sents, 'dictsent', 1)[0];
    const q = it && qSentenceItem(it, sents, '🎯 Câu hỏi cuối — Mẫu câu');
    if (q) qs.push(q);
  }
  if (qs.length < 10 && sents.length >= 4 && words.length < 4) {
    qs = qs.concat(pickTargets(sents, 'dictsent', 10 - qs.length).map(i => qSentenceItem(i, sents, 'Mẫu câu')).filter(Boolean));
  }
  if (!qs.length) { alert('Chưa đủ dữ liệu để tạo đề (cần ít nhất 4 từ).'); return; }
  selectedQuestions = qs;
  currentIndex = 0; score = 0; answered = false;
  show('quiz-screen');
  document.getElementById('mode-badge').textContent = '🚀 Đấu trí';
  document.getElementById('mode-badge').className = 'mode-badge dict-mode';
  renderQuiz();
}

function finishAnswerUI(prefix) {
  const nb = document.getElementById(prefix === 'l' ? 'l-next' : 'btn-next');
  setTimeout(() => nb && nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120);
}
function selectAnswer(idx, btn) {
  if (answered) return;
  answered = true; stopQTimer();
  clearOptHighlight();
  const q = selectedQuestions[currentIndex];
  const isCorrect = idx === q.correct;
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);
  if (isCorrect) {
    btn.classList.add('correct');
    score++;
    playSound('correct');
    document.getElementById('feedback').textContent = comboCount >= 2 ? `✅ Chính xác! Combo x${comboCount + 1} 🔥` : '✅ Chính xác!';
    document.getElementById('feedback').className = 'feedback-msg show correct-msg';
    recordAnswer(true, q.rawTarget);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#options-grid .option-btn')[q.correct].classList.add('correct');
    playSound('wrong');
    document.getElementById('feedback').textContent = `❌ Sai rồi! Đáp án đúng: ${String(q.a[q.correct]).replace('\n', ' ')}`;
    document.getElementById('feedback').className = 'feedback-msg show wrong-msg';
    recordAnswer(false, q.rawTarget);
  }
  document.getElementById('score-display').textContent = `⭐ ${score}`;
  renderReveal('reveal', q.rawTarget);
  document.getElementById('btn-next').classList.add('visible');
  finishAnswerUI('q');
}
function quizTimeout() {
  if (answered) return;
  answered = true;
  const q = selectedQuestions[currentIndex];
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);
  document.querySelectorAll('#options-grid .option-btn')[q.correct].classList.add('correct');
  playSound('wrong');
  document.getElementById('feedback').textContent = `⏰ Hết giờ! Đáp án đúng: ${String(q.a[q.correct]).replace('\n', ' ')}`;
  document.getElementById('feedback').className = 'feedback-msg show wrong-msg';
  recordAnswer(false, q.rawTarget);
  renderReveal('reveal', q.rawTarget);
  document.getElementById('btn-next').classList.add('visible');
  finishAnswerUI('q');
}

let matchRoundsData = [], matchTotalRounds = 5, matchWrongSet = new Set();
function startMatchGame() {
  currentGameStarter = startMatchGame;
  const words = validWords();
  if (words.length < 8) { alert('Cần ít nhất 8 từ để chơi Nối từ!'); return; }
  resetSession();
  matchTotalRounds = Math.min(5, Math.floor(words.length / 4));
  let rest = pickTargets(words, 'dict', matchTotalRounds * 4);
  matchRoundsData = [];
  for (let r = 0; r < matchTotalRounds; r++) {
    const round = [];

    for (const w of rest) {
      if (round.length >= 4) break;
      if (!round.some(x => x.text === w.text || rawKey(x.pinyin) === rawKey(w.pinyin) || meaningConflict(x, w))) round.push(w);
    }
    for (const w of rest) { if (round.length >= 4) break; if (!round.includes(w)) round.push(w); }
    rest = rest.filter(w => !round.includes(w));
    matchRoundsData.push(round);
  }
  matchRounds = 0; matchScore = 0;
  show('match-screen');
  setupMatchRound();
}
function setupMatchRound() {
  matchRounds++;
  matchSelectedLeft = null; matchSelectedRight = null; matchWrongSet = new Set();
  document.getElementById('m-counter').textContent = `MÀN ${matchRounds} / ${matchTotalRounds}`;
  document.getElementById('m-score').textContent = `⭐ ${matchScore}`;
  document.getElementById('m-feedback').className = 'feedback-msg';
  document.getElementById('m-next').classList.remove('visible');
  matchPairs = matchRoundsData[matchRounds - 1].map(w => ({ text: w.text, meaning: w.meaning, pinyin: w.pinyin || '' }));
  const left = document.getElementById('m-left'), right = document.getElementById('m-right');
  left.innerHTML = ''; right.innerHTML = '';
  shuffle([...matchPairs]).forEach(p => {
    const el = document.createElement('div');
    el.className = 'match-item'; el.textContent = p.text; el.dataset.text = p.text;
    el.addEventListener('click', () => selectMatchItem('left', el));
    left.appendChild(el);
  });
  shuffle([...matchPairs]).forEach(p => {
    const el = document.createElement('div');
    el.className = 'match-item'; el.textContent = p.meaning; el.dataset.text = p.text;
    el.addEventListener('click', () => selectMatchItem('right', el));
    right.appendChild(el);
  });
}
function selectMatchItem(side, el) {
  if (el.classList.contains('matched')) return;
  if (side === 'left') { if (matchSelectedLeft) matchSelectedLeft.classList.remove('selected'); matchSelectedLeft = el; }
  else { if (matchSelectedRight) matchSelectedRight.classList.remove('selected'); matchSelectedRight = el; }
  el.classList.add('selected');
  if (side === 'left' && voiceEnabled) { if (!zhVoice) loadVoices(); speakChinese(el.dataset.text); }
  if (matchSelectedLeft && matchSelectedRight) {
    const target = matchPairs.find(p => p.text === matchSelectedLeft.dataset.text);
    const ok = matchSelectedLeft.dataset.text === matchSelectedRight.dataset.text;
    if (ok) {
      matchSelectedLeft.classList.add('matched'); matchSelectedRight.classList.add('matched');
      matchScore += matchWrongSet.has(target.text) ? 2 : 5;
      document.getElementById('m-score').textContent = `⭐ ${matchScore}`;
      playSound('correct');
      document.getElementById('m-feedback').textContent = matchWrongSet.has(target.text) ? '✅ Đúng rồi! +2' : '✅ Ghép đúng! +5';
      document.getElementById('m-feedback').className = 'feedback-msg show correct-msg';
      if (target && !matchWrongSet.has(target.text)) recordAnswer(true, { text: target.text, pinyin: target.pinyin, meaning: target.meaning });
    } else {
      const l = matchSelectedLeft, r = matchSelectedRight;
      l.classList.add('error'); r.classList.add('error');
      playSound('wrong');
      document.getElementById('m-feedback').textContent = '❌ Sai cặp!';
      document.getElementById('m-feedback').className = 'feedback-msg show wrong-msg';
      if (target && !matchWrongSet.has(target.text)) { matchWrongSet.add(target.text); recordAnswer(false, { text: target.text, pinyin: target.pinyin, meaning: target.meaning }); }
      setTimeout(() => { l.classList.remove('error', 'selected'); r.classList.remove('error', 'selected'); }, 600);
    }
    matchSelectedLeft = null; matchSelectedRight = null;
    if (document.querySelectorAll('#m-left .match-item:not(.matched)').length === 0) {
      const nb = document.getElementById('m-next');
      nb.classList.add('visible');
      nb.textContent = matchRounds >= matchTotalRounds ? 'Xem Kết Quả 🏆' : 'Màn Tiếp Theo →';
    }
  }
}
function nextMatchRound() {
  if (matchRounds >= matchTotalRounds) { finishMatch(); return; }
  setupMatchRound();
}
function finishMatch() {
  showFinal({ score: matchScore, totalText: 'điểm', pct: matchScore / (matchTotalRounds * 4 * 5) * 100,
    sub: `Nối từ · ${matchTotalRounds} màn`, emoji: '🧩', title: 'Hoàn thành Nối từ!' });
}

function showResult() {
  showFinal({ score, totalText: `trên ${selectedQuestions.length} câu`, pct: score / selectedQuestions.length * 100, sub: quizResultLabel });
}
function showFinal(o) {
  stopQTimer();
  show('result-screen');
  const pct = Math.max(0, Math.min(100, Math.round(o.pct)));
  countUp(document.getElementById('score-big'), o.score);
  document.getElementById('score-total').textContent = o.totalText;
  document.getElementById('score-pct').textContent = pct + '%';
  const bar = document.getElementById('score-bar');
  bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth; bar.style.transition = '';
  setTimeout(() => { bar.style.width = pct + '%'; }, 100);
  document.getElementById('result-emoji').textContent = o.emoji || (pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪');
  document.getElementById('result-title').textContent = o.title || (pct >= 80 ? 'Xuất Sắc!' : pct >= 50 ? 'Cố lên!' : 'Luyện thêm nhé!');
  document.getElementById('result-sub').textContent = o.sub || '';

  const ok = sessionLog.filter(x => x.ok).length, bad = sessionLog.length - ok;
  document.getElementById('result-chips').innerHTML =
    `<span class="chip">✅ ${ok} đúng</span><span class="chip">❌ ${bad} sai</span>` +
    `<span class="chip">🔥 Combo cao nhất x${bestCombo}</span><span class="chip">⚡ +${sessionXP} XP</span>`;

  const wrongMap = new Map();
  sessionLog.filter(x => !x.ok).forEach(x => wrongMap.set(x.text, x));
  const wrong = [...wrongMap.values()];
  const rb = document.getElementById('review-box');
  rb.classList.toggle('show', wrong.length > 0);
  rb.innerHTML = wrong.length ? `<h4>Cần xem lại (${wrong.length})</h4>` + wrong.slice(0, 15).map((w, i) => `
    <div class="review-row">
      <span class="rr-han">${escapeHTML(w.text)}</span>
      <div class="rr-info"><div class="rr-py">${escapeHTML(w.pinyin)}</div><div class="rr-mean">${escapeHTML(w.meaning)}</div></div>
      <button class="v-speak" data-i="${i}">🔊</button>
    </div>`).join('') : '';
  rb.querySelectorAll('.v-speak').forEach(b => b.addEventListener('click', function () {
    if (!zhVoice) loadVoices();
    speakChinese(wrong[Number(this.dataset.i)].text, this);
  }));
  window._lastWrongTexts = wrong.map(w => w.text);
  const pb = document.getElementById('btn-practice-wrong');
  pb.classList.toggle('show', wrong.length > 0);
  pb.textContent = `🧠 Luyện ${wrong.length} từ sai`;
  if (pct >= 80) burstConfetti();
}
function practiceSessionWrong() { startSRSGame(false, window._lastWrongTexts || []); }

let srsTab = 'due';
function setSRSTab(t, btn) {
  srsTab = t;
  document.querySelectorAll('#srs-tabs .hsk-tab').forEach(b => b.classList.toggle('active', b === btn));
  renderSRSList();
}
function openSRS() { show('srs-screen'); renderSRSList(); }
function removeSRS(text) {
  srsWords = srsWords.filter(w => w.text !== text);
  safeStorage.set('cn_quiz_srs_words', srsWords);
  updateDueBanner(); renderSRSList();
}
function renderSRSList() {
  const now = Date.now();
  const due = srsWords.filter(w => w.nextReview <= now), done = srsWords.filter(w => (w.box || 1) >= 5);
  document.getElementById('srs-tab-due').textContent = `🔴 Cần ôn (${due.length})`;
  document.getElementById('srs-tab-all').textContent = `📚 Tất cả (${srsWords.length})`;
  document.getElementById('srs-tab-done').textContent = `✅ Đã thuộc (${done.length})`;
  const list = document.getElementById('srs-list');
  const has = srsWords.length > 0;
  document.getElementById('srs-actions').style.display = has ? 'grid' : 'none';
  document.getElementById('srs-tabs').style.display = has ? 'flex' : 'none';
  if (!has) {
    list.innerHTML = `<div class="srs-empty">🎉 Tuyệt vời! Chưa có từ nào bị sai.
Hãy chơi quiz — từ nào sai sẽ được ghi vào đây và ôn lại đúng lúc.</div>`;
    return;
  }
  let items = srsTab === 'due' ? due : srsTab === 'done' ? done : srsWords;
  items = [...items].sort((a, b) => a.nextReview - b.nextReview);
  if (!items.length) {
    list.innerHTML = `<div class="srs-empty">${srsTab === 'due' ? '✅ Không có từ nào đến hạn ôn hôm nay.' : 'Chưa có từ nào ở mục này.'}</div>`;
    return;
  }
  list.innerHTML = '';
  items.forEach(word => {
    const row = document.createElement('div');
    row.className = 'vocab-row srs-row';
    const isDue = word.nextReview <= now;
    const days = Math.ceil((word.nextReview - now) / 86400000);
    const box = Math.max(1, Math.min(5, word.box || 1));
    let hc = 'v-hanzi'; if (word.text.length > 15) hc += ' text-xxs'; else if (word.text.length > 8) hc += ' text-xs'; else if (word.text.length > 5) hc += ' text-sm';
    let mc = 'v-meaning'; if (word.meaning.length > 30) mc += ' text-xs'; else if (word.meaning.length > 15) mc += ' text-sm';
    row.innerHTML = `
      <div class="vocab-info">
        <div class="vocab-text">
          ${word.level ? `<span class="v-badge hsk-lv">${escapeHTML(word.level)}</span>` : ''}
          <span class="${hc}">${escapeHTML(word.text)}</span>
        </div>
        <div class="${mc}">${escapeHTML(word.meaning)}</div>
        <div class="v-pinyin">${escapeHTML(word.pinyin || '')}</div>
        <div class="srs-meta">
          <span class="srs-pips" title="Mức nhớ ${box}/5">${'●'.repeat(box)}${'○'.repeat(5 - box)}</span>
          <span>${isDue ? '🔴 Cần ôn' : `⏳ ${days} ngày`}</span>
          ${word.wrongCount ? `<span>❌ sai ${word.wrongCount} lần liên tiếp</span>` : ''}
        </div>
      </div>
      <div class="vocab-actions">
        <button class="v-speak" title="Nghe">🔊</button>
        <button class="btn-del" title="Xoá khỏi sổ tay">✕</button>
      </div>`;
    row.querySelector('.v-speak').addEventListener('click', function () { if (!zhVoice) loadVoices(); speakChinese(word.text, this); });
    row.querySelector('.btn-del').addEventListener('click', () => removeSRS(word.text));
    list.appendChild(row);
  });
}
function startSRSGame(onlyDue, onlyTexts) {
  onlyDue = onlyDue === true;
  const now = Date.now();
  let pool = srsWords.filter(w => w.meaning && w.meaning.trim());
  if (onlyTexts) pool = pool.filter(w => onlyTexts.includes(w.text));
  else if (onlyDue) pool = pool.filter(w => w.nextReview <= now);
  if (!pool.length) { document.getElementById('srs-warning-modal').classList.add('active'); return; }
  currentGameStarter = () => startSRSGame(onlyDue, onlyTexts);
  resetSession();

  const picked = [...pool].sort((a, b) =>
    ((a.nextReview <= now ? 0 : 1) - (b.nextReview <= now ? 0 : 1)) || ((a.box || 1) - (b.box || 1)) ||
    ((b.wrongCount || 0) - (a.wrongCount || 0)) || (Math.random() - .5)).slice(0, 10);
  selectedQuestions = buildFromTargets(shuffle(picked), allWordsPool(), { h2m: 3, m2h: 3, h2p: 2, cloze: 2 });
  if (!selectedQuestions.length) { showToast('❌ Chưa đủ dữ liệu để tạo đề'); return; }
  currentIndex = 0; score = 0; answered = false;
  show('quiz-screen');
  quizResultLabel = 'Chế độ Ôn lỗi';
  document.getElementById('mode-badge').textContent = '🧠 Ôn lỗi';
  document.getElementById('mode-badge').className = 'mode-badge srs-mode';
  renderQuiz();
}

let flashItems = [], flashIdx = 0, flashFlipped = false, flashEasy = 0, flashTitle = '';
function srsTouch(item, grade) {
  if (grade === 0) { recordAnswer(false, item); return; }
  if (grade === 2) { recordAnswer(true, item); return; }
  const w = srsWords.find(x => x.text === item.text);
  if (!w) srsWords.push({ text: item.text, pinyin: item.pinyin || '', meaning: item.meaning, level: item.level || '', wrongCount: 0, correctStreak: 0, box: 1, nextReview: Date.now() + 86400000 });
  else { w.nextReview = Date.now() + 86400000; w.correctStreak = 0; }
  safeStorage.set('cn_quiz_srs_words', srsWords);
  gainXP(3); updateDueBanner(); updateHomeCard();
}
function startFlashcards(items, title) {
  if (!items.length) { showToast('Không có thẻ nào để ôn'); return; }
  resetSession();
  flashItems = items.map(enrich); flashTitle = title; flashIdx = 0; flashEasy = 0;
  currentGameStarter = () => startFlashcards(items, title);
  show('flash-screen');
  renderFlash();
}
function renderFlash() {
  const it = flashItems[flashIdx];
  flashFlipped = false;
  document.getElementById('f-counter').textContent = `${flashIdx + 1} / ${flashItems.length}`;
  document.getElementById('f-progress').style.width = `${(flashIdx / flashItems.length) * 100}%`;
  const han = document.getElementById('fc-han');
  han.textContent = it.text;
  han.classList.toggle('long', it.text.length > 6);
  const back = document.getElementById('fc-back');
  back.classList.remove('show');
  back.innerHTML = `
    <div class="fc-py">${escapeHTML(it.pinyin || '')}</div>
    <div class="fc-mean">${escapeHTML(it.meaning)}</div>
    ${it.level ? `<span class="v-badge hsk-lv">${escapeHTML(it.level)}</span>` : ''}
    ${it.example ? `<div class="fc-ex"><div class="ex-hanzi" style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap">${escapeHTML(it.example)}<button class="v-speak fc-ex-speak" title="Đọc câu ví dụ" onclick="event.stopPropagation(); speakFlashExample()">🔊</button></div>
      ${it.examplePinyin ? `<div class="ex-pinyin">${escapeHTML(it.examplePinyin)}</div>` : ''}
      ${it.exampleMeaning ? `<div class="ex-meaning">${escapeHTML(it.exampleMeaning)}</div>` : ''}</div>` : ''}`;
  document.getElementById('flash-actions').classList.remove('show');
  document.getElementById('flash-hint').style.display = '';
  if (autoSpeakQ && voiceEnabled) setTimeout(speakFlash, 250);
}
function speakFlash() { if (!voiceEnabled) { showToast('🔇 Giọng đọc đang tắt trong cài đặt'); return; } if (!zhVoice) loadVoices(); const it = flashItems[flashIdx]; if (it) speakChinese(it.text, document.getElementById('fc-speak')); }
function speakFlashExample() {
  const it = flashItems[flashIdx];
  if (!it || !it.example) { showToast('Thẻ này không có câu ví dụ'); return; }
  if (!voiceEnabled) { showToast('🔇 Giọng đọc đang tắt trong cài đặt'); return; }
  if (!zhVoice) loadVoices();
  speakChinese(it.example, document.querySelector('#fc-back .fc-ex-speak'));
}
function flipFlash() {
  if (flashFlipped) return;
  flashFlipped = true;
  document.getElementById('fc-back').classList.add('show');
  document.getElementById('flash-actions').classList.add('show');
  document.getElementById('flash-hint').style.display = 'none';
}
function rateFlash(g) {
  if (!flashFlipped) { flipFlash(); return; }
  srsTouch(flashItems[flashIdx], g);
  if (g === 2) flashEasy++;
  flashIdx++;
  if (flashIdx >= flashItems.length) {
    showFinal({ score: flashEasy, totalText: `thẻ nhớ trên ${flashItems.length}`, pct: flashEasy / flashItems.length * 100,
      sub: flashTitle, emoji: flashEasy / flashItems.length >= .8 ? '🏆' : '🃏', title: 'Xong bộ thẻ!' });
  } else renderFlash();
}
function startSRSFlash() {
  const now = Date.now();
  const all = srsWords.filter(w => w.meaning);
  const due = all.filter(w => w.nextReview <= now);
  const src = due.length ? due : all;
  if (!src.length) { document.getElementById('srs-warning-modal').classList.add('active'); return; }
  startFlashcards(shuffle(src).slice(0, 20).map(w => ({ ...w })), due.length ? 'Ôn thẻ · từ đến hạn' : 'Ôn thẻ · sổ tay lỗi');
}
function startHSKFlash() {
  if (!hskFiltered.length) { showToast('Không có từ nào để học'); return; }
  startFlashcards(shuffle(hskFiltered).slice(0, 20).map(w => ({ ...w })), `Học thẻ ${hskLevel === 'all' ? 'HSK 1-6' : hskLabel(hskLevel)}`);
}

function calcLongestStreak() {
  const days = Object.keys(dailyStats).filter(k => dailyStats[k] && ((dailyStats[k].correct || 0) + (dailyStats[k].wrong || 0)) > 0).sort();
  let best = 0, cur = 0, prev = null;
  days.forEach(ds => {
    const d = new Date(ds + 'T00:00:00');
    if (prev && Math.round((d - prev) / 86400000) === 1) cur++; else cur = 1;
    best = Math.max(best, cur); prev = d;
  });
  return best;
}
function openStats(range, btn) {
  range = typeof range === 'number' ? range : 7;
  show('stats-screen');
  if (btn) document.querySelectorAll('#range-seg button').forEach(b => b.classList.toggle('active', b === btn));
  let tot = 0, ok = 0;
  Object.values(dailyStats).forEach(d => { if (d) { tot += (d.correct || 0) + (d.wrong || 0); ok += d.correct || 0; } });
  document.getElementById('stat-streak').textContent = calculateStreak();
  document.getElementById('stat-best').textContent = Math.max(calcLongestStreak(), calculateStreak());
  document.getElementById('stat-total').textContent = tot;
  document.getElementById('stat-acc').textContent = tot ? Math.round(ok / tot * 100) + '%' : '—';

  const lv = levelFromXP(xp), base = xpForLevel(lv), next = xpForLevel(lv + 1);
  document.getElementById('xp-level').textContent = `⚡ Cấp ${lv}`;
  document.getElementById('xp-text').textContent = `${xp} XP`;
  document.getElementById('xp-sub').textContent = `Còn ${next - xp} XP nữa để lên cấp ${lv + 1} · +10 XP mỗi câu đúng, combo thêm điểm`;
  const fill = document.getElementById('xp-fill'); fill.style.width = '0';
  setTimeout(() => { fill.style.width = ((xp - base) / (next - base) * 100) + '%'; }, 60);

  const chart = document.getElementById('chart-container'); chart.innerHTML = '';
  const days = []; let maxVal = 10;
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const data = dailyStats[getLocalDateStr(d)] || { correct: 0, wrong: 0 };
    days.push({ ...data, label: `${d.getDate()}/${d.getMonth() + 1}` });
    maxVal = Math.max(maxVal, data.correct || 0, data.wrong || 0);
  }
  days.forEach((day, i) => {
    const wrap = document.createElement('div'); wrap.className = 'chart-bar-wrap';
    const group = document.createElement('div');
    group.style.cssText = 'display:flex;align-items:flex-end;gap:2px;width:100%;height:100%;justify-content:center;';
    const b1 = document.createElement('div'); b1.className = 'chart-bar correct'; b1.style.height = `${((day.correct || 0) / maxVal) * 100}%`; b1.title = `${day.label}: ${day.correct || 0} đúng`;
    const b2 = document.createElement('div'); b2.className = 'chart-bar wrong'; b2.style.height = `${((day.wrong || 0) / maxVal) * 100}%`; b2.title = `${day.label}: ${day.wrong || 0} sai`;
    group.appendChild(b1); group.appendChild(b2);
    const lbl = document.createElement('div'); lbl.className = 'chart-label';
    lbl.textContent = (range <= 7 || i % 5 === 0 || i === days.length - 1) ? day.label : '';
    lbl.style.fontSize = range > 7 ? '10px' : '';
    wrap.appendChild(group); wrap.appendChild(lbl); chart.appendChild(wrap);
  });
  chart.style.gap = range > 7 ? '3px' : '';

  const hm = document.getElementById('heatmap'); hm.innerHTML = '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 83);
  const pad = (start.getDay() + 6) % 7;
  const cols = Math.ceil((pad + 84) / 7);
  hm.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < pad; i++) { const c = document.createElement('div'); c.className = 'hm-cell blank'; hm.appendChild(c); }
  for (let i = 0; i < 84; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const rec = dailyStats[getLocalDateStr(d)];
    const n = rec ? (rec.correct || 0) + (rec.wrong || 0) : 0;
    const c = document.createElement('div');
    c.className = 'hm-cell' + (n === 0 ? '' : n < dailyGoal * .5 ? ' l1' : n < dailyGoal ? ' l2' : n < dailyGoal * 2 ? ' l3' : ' l4');
    c.title = `${d.getDate()}/${d.getMonth() + 1}: ${n} câu`;
    hm.appendChild(c);
  }

  const ever = safeStorage.get('cn_quiz_hsk_ever') || {};
  let html = '';
  if (!hskAll.length) html = '<div class="dict-empty">Chưa có dữ liệu HSK1.js … HSK6.js (trong thư mục Model)</div>';
  else for (let i = 1; i <= 6; i++) {
    const L = 'HSK' + i, total = hskPool(L).length, seen = Math.min((ever[L] || []).length, total), st = levelStats[L];
    const acc = st && (st.c + st.w) ? Math.round(st.c / (st.c + st.w) * 100) + '% đúng' : 'chưa làm';
    html += `<div class="prog-row"><div class="prog-top"><span>HSK ${i}</span><span>${seen}/${total} từ đã gặp · ${acc}</span></div>
      <div class="prog-track"><div class="prog-fill" style="width:${total ? seen / total * 100 : 0}%"></div></div></div>`;
  }
  document.getElementById('hsk-progress').innerHTML = html;

  const counts = [0, 0, 0, 0, 0];
  srsWords.forEach(w => counts[Math.max(1, Math.min(5, w.box || 1)) - 1]++);
  const mx = Math.max(1, ...counts), names = ['Mới sai', 'Đang học', 'Khá nhớ', 'Nhớ tốt', 'Đã thuộc'];
  document.getElementById('srs-dist').innerHTML = srsWords.length
    ? counts.map((c, i) => `<div class="prog-row"><div class="prog-top"><span>${'●'.repeat(i + 1)} ${names[i]}</span><span>${c} từ</span></div>
        <div class="prog-track"><div class="prog-fill box${i + 1}" style="width:${c / mx * 100}%"></div></div></div>`).join('')
    : '<div class="dict-empty">Chưa có từ nào trong sổ tay lỗi 🎉</div>';

  const weak = [...srsWords].filter(w => (w.wrongCount || 0) > 0).sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0)).slice(0, 5);
  const wl = document.getElementById('weak-list'); wl.innerHTML = '';
  if (!weak.length) wl.innerHTML = '<div class="dict-empty">Chưa có từ nào hay sai.</div>';
  weak.forEach(w => {
    const r = document.createElement('div'); r.className = 'review-row';
    r.innerHTML = `<span class="rr-han">${escapeHTML(w.text)}</span><div class="rr-info"><div class="rr-py">${escapeHTML(w.pinyin || '')}</div><div class="rr-mean">${escapeHTML(w.meaning)}</div></div><span class="chip">❌ ${w.wrongCount}</span><button class="v-speak">🔊</button>`;
    r.querySelector('.v-speak').addEventListener('click', function () { if (!zhVoice) loadVoices(); speakChinese(w.text, this); });
    wl.appendChild(r);
  });
}

function handleGameKeys(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (document.querySelector('.modal-time-overlay.active')) return;
  const vis = id => document.getElementById(id).style.display === 'block';
  const k = e.key;
  const idx = '1234'.includes(k) && k.length === 1 ? Number(k) - 1 : 'abcd'.includes(k.toLowerCase()) && k.length === 1 ? k.toLowerCase().charCodeAt(0) - 97 : -1;
  if (vis('quiz-screen')) {
    if (idx >= 0) { const b = document.querySelectorAll('#options-grid .option-btn')[idx]; if (b && !b.disabled) { e.preventDefault(); b.click(); } }
    else if ((k === 'Enter' || k === ' ' || k === 'ArrowRight') && answered) { e.preventDefault(); nextQuestion(); }
    else if (k.toLowerCase() === 'r' || k.toLowerCase() === 'l') speakCurrentQuestion();
  } else if (vis('match-screen')) {
    if ((k === 'Enter' || k === ' ') && document.getElementById('m-next').classList.contains('visible')) { e.preventDefault(); nextMatchRound(); }
  } else if (vis('flash-screen')) {
    if (k === ' ' || k === 'Enter') { e.preventDefault(); flashFlipped ? null : flipFlash(); }
    else if (flashFlipped && '123'.includes(k) && k.length === 1) rateFlash(Number(k) - 1);
    else if (k.toLowerCase() === 'r') speakFlash();
  } else if (vis('result-screen')) {
    if (k === 'Enter' && tag !== 'button') restartCurrentGame();
  }
}

window.addEventListener('load', () => {
  if (ttsSupported) {
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 200);
  }
  updateDueBanner();
  updateHomeCard();
  syncSegs();
  const savedTheme = safeStorage.get('cn_quiz_theme');
  if (['neon','sakura','light'].includes(savedTheme)) document.documentElement.setAttribute('data-skin', savedTheme);

  document.querySelectorAll('.mode-card').forEach(el => attachSpotlight(el, { tilt: true }));
  document.querySelectorAll('.btn-feature, .btn-vocab').forEach(el => attachSpotlight(el));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelectorAll('.modal-time-overlay.active');
      if (open.length) { open.forEach(m => m.classList.remove('active')); isPaused = false; return; }
      if (['quiz-screen','listen-screen','match-screen'].some(id => document.getElementById(id).style.display === 'block')) togglePause(true);
    }
  });
  document.addEventListener('keydown', handleGameKeys);

  const music = document.getElementById('bg-music');
  if (music) {
    music.volume = musicVolume;
    if (musicTrack > 1) music.src = MUSIC_DIR + '/music' + musicTrack + '.mp3';
    else if (musicTrack === 0) music.src = 'music.mp3';
    music.addEventListener('error', () => {
      console.warn('⚠️ Không tải được ' + (music.getAttribute('src') || 'nhạc nền') + ' (bỏ qua)');
    });
  }
  updateMusicLabel();
  initMusicAutoplay();
});

