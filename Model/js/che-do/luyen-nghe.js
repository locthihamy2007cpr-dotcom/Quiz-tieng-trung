let listenQuestions = [];
let listenIndex = 0;
let listenScore = 0;
let listenAnswered = false;

function renderListen() {
  const q = listenQuestions[listenIndex];
  if (!q) { finishListen(); return; }
  document.getElementById('l-counter').textContent = `CÂU ${listenIndex+1} / ${listenQuestions.length}`;
  document.getElementById('l-score').textContent = `⭐ ${listenScore}`;
  document.getElementById('l-progress').style.width = `${(listenIndex/listenQuestions.length)*100}%`;

  const grid = document.getElementById('l-options');
  grid.innerHTML = '';
  q.options.arr.forEach((ans, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'option-wrap';
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="option-label">${String.fromCharCode(65+i)}</span>
      <span class="option-text">${escapeHTML(ans)}</span>
    `;
    wireOptButtons(btn, () => selectListenAnswer(i, btn));
    wrap.appendChild(btn);
    grid.appendChild(wrap);
  });

  document.getElementById('l-feedback').className = 'feedback-msg';
  document.getElementById('l-feedback').textContent = '';
  document.getElementById('l-next').classList.remove('visible');
  listenAnswered = false;
  document.getElementById('l-num').textContent = q.isSentence ? 'Nghe cả câu — chọn nghĩa đúng' : 'Bấm để nghe âm thanh';
  renderReveal('l-reveal', null);
  updateComboChip();
  startQTimer(listenTimeout);
  if (autoPlayListen && voiceEnabled) setTimeout(() => { if (!listenAnswered) playListenAudio(); }, 350);
}

function playListenAudio() {
  if (!voiceEnabled) { showToast('🔇 Giọng đọc đang tắt trong cài đặt'); return; }
  if (!zhVoice) loadVoices();
  const q = listenQuestions[listenIndex];
  if (!q) return;
  speakChinese(q.target.text, document.getElementById('l-speak-btn'));
}

function nextListenQuestion() {
  if (!listenAnswered) return;
  listenIndex++;
  if (listenIndex >= listenQuestions.length) { finishListen(); return; }
  renderListen();
}

let listenLabel = 'Chế độ Nghe đoán';
function makeListenQ(t, pool, isSent) {
  const d = pickDistractors(t, pool, c => c.meaning, 3,
    isSent ? (a, c) => lenRatio(a.meaning.length, c.meaning.length) + Math.random() * 3 : simMeaning,
    { noConflict: isSent, filter: c => rawKey(c.pinyin) !== rawKey(t.pinyin) });
  if (d.length < 3) return null;
  const arr = shuffle([t.meaning, ...d]);
  return { target: t, isSentence: isSent, options: { arr, correct: arr.indexOf(t.meaning) } };
}
function startListenGame() {
  currentGameStarter = startListenGame;
  listenLabel = 'Chế độ Nghe đoán';
  const words = validWords(), sents = validSents();
  if (!words.length && !sents.length) { alert('Cần dữ liệu có chữ Hán!'); return; }
  resetSession();
  const nS = sents.length >= 4 ? 2 : 0;
  let list = words.length >= 4 ? pickTargets(words, 'dict', 10 - nS).map(t => makeListenQ(t, words, false)).filter(Boolean) : [];
  if (nS) list = list.concat(pickTargets(sents, 'dictsent', nS).map(t => makeListenQ(t, sents, true)).filter(Boolean));
  if (!list.length && sents.length >= 4) list = pickTargets(sents, 'dictsent', 10).map(t => makeListenQ(t, sents, true)).filter(Boolean);
  if (!list.length) { alert('Chưa đủ dữ liệu để tạo đề (cần ít nhất 4 từ).'); return; }
  listenQuestions = shuffle(list);
  listenIndex = 0; listenScore = 0; listenAnswered = false;
  show('listen-screen');
  renderListen();
}
function selectListenAnswer(idx, btn) {
  if (listenAnswered) return;
  listenAnswered = true; stopQTimer();
  clearOptHighlight();
  const q = listenQuestions[listenIndex];
  const isCorrect = idx === q.options.correct;
  document.querySelectorAll('#l-options .option-btn').forEach(b => b.disabled = true);
  if (isCorrect) {
    btn.classList.add('correct');
    listenScore++;
    playSound('correct');
    document.getElementById('l-feedback').textContent = comboCount >= 2 ? `✅ Chính xác! Combo x${comboCount + 1} 🔥` : '✅ Chính xác!';
    document.getElementById('l-feedback').className = 'feedback-msg show correct-msg';
    recordAnswer(true, q.target);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#l-options .option-btn')[q.options.correct].classList.add('correct');
    playSound('wrong');
    document.getElementById('l-feedback').textContent = `❌ Sai! Đáp án: ${q.options.arr[q.options.correct]}`;
    document.getElementById('l-feedback').className = 'feedback-msg show wrong-msg';
    recordAnswer(false, q.target);
  }
  document.getElementById('l-score').textContent = `⭐ ${listenScore}`;
  renderReveal('l-reveal', q.target);
  document.getElementById('l-next').classList.add('visible');
  finishAnswerUI('l');
}
function listenTimeout() {
  if (listenAnswered) return;
  listenAnswered = true;
  const q = listenQuestions[listenIndex];
  document.querySelectorAll('#l-options .option-btn').forEach(b => b.disabled = true);
  document.querySelectorAll('#l-options .option-btn')[q.options.correct].classList.add('correct');
  playSound('wrong');
  document.getElementById('l-feedback').textContent = `⏰ Hết giờ! Đáp án: ${q.options.arr[q.options.correct]}`;
  document.getElementById('l-feedback').className = 'feedback-msg show wrong-msg';
  recordAnswer(false, q.target);
  renderReveal('l-reveal', q.target);
  document.getElementById('l-next').classList.add('visible');
  finishAnswerUI('l');
}
function finishListen() {
  showFinal({ score: listenScore, totalText: `trên ${listenQuestions.length} câu`, pct: listenScore / listenQuestions.length * 100, sub: listenLabel });
}

function handleListenKeys(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (document.querySelector('.modal-time-overlay.active')) return;
  const vis = id => document.getElementById(id).style.display === 'block';
  if (!vis('listen-screen')) return;
  const k = e.key;
  const idx = '1234'.includes(k) && k.length === 1 ? Number(k) - 1 : 'abcd'.includes(k.toLowerCase()) && k.length === 1 ? k.toLowerCase().charCodeAt(0) - 97 : -1;
  if (idx >= 0) { const b = document.querySelectorAll('#l-options .option-btn')[idx]; if (b && !b.disabled) { e.preventDefault(); b.click(); } }
  else if ((k === 'Enter' || k === ' ' || k === 'ArrowRight') && listenAnswered) { e.preventDefault(); nextListenQuestion(); }
  else if (k.toLowerCase() === 'r' || k.toLowerCase() === 'l' || (k === ' ' && !listenAnswered)) { e.preventDefault(); playListenAudio(); }
}

window.addEventListener('load', () => { document.addEventListener('keydown', handleListenKeys); });
