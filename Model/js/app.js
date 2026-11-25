/* Quiz Tiếng Trung — toàn bộ logic trong 1 file (Data.js & HSK1–6.js vẫn tách riêng). */

/* ============================================================
   1. Lưu trữ dữ liệu & tra từ
   ============================================================ */
const safeStorage = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } },
  remove(k){ try{ localStorage.removeItem(k); }catch(e){} }
};

function stripDiacritics(s){
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'u')
    .replace(/đ/g, 'd');
}

function smartMatch(query, field){
  if (!query || !field) return false;
  return stripDiacritics(field).includes(stripDiacritics(query));
}

function getMeaningLetter(meaning) {
  if (!meaning) return '#';
  const stripped = stripDiacritics(String(meaning)).trim();
  if (!stripped) return '#';
  const ch = stripped[0].toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

function parseDictLine(line) {
  const m = line.match(/^(.+?)\s*\(([^)]+)\)\s*[:：]\s*(.+)$/);
  if (!m) return null;
  const text = m[1].trim();
  const pinyin = m[2].trim();
  const meaning = m[3].trim();
  if (!text || !meaning) return null;
  return { text, pinyin, meaning };
}
function isSentence(text) {
  return /[。！？，；：]/.test(text) || text.length > 20;
}
function parseDictData(raw) {
  if (!raw || typeof raw !== 'string') return [];
  const lines = raw.split('\n');
  const seen = new Set();
  const out = [];
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//')) continue;
    const item = parseDictLine(line);
    if (!item) continue;
    if (seen.has(item.text)) continue;
    seen.add(item.text);
    item.type = isSentence(item.text) ? 'sentence' : 'word';
    out.push(item);
  }
  return out;
}

window.dictIndex = [];
window.dictWords = [];
window.dictSentences = [];

function buildDictFromRaw() {
  const raw = window.DICT_DATA_1 || '';
  const parsed = parseDictData(raw);
  const extra = safeStorage.get('cn_quiz_extra_dict') || [];
  const seen = new Set(parsed.map(p => p.text));
  const extraClean = extra.filter(e => e && e.text && !seen.has(e.text));
  window.dictIndex = [...parsed, ...extraClean];
  window.dictWords = window.dictIndex.filter(p => p.type === 'word');
  window.dictSentences = window.dictIndex.filter(p => p.type === 'sentence');
  console.log(`📚 Loaded ${window.dictIndex.length} entries (${window.dictWords.length} words, ${window.dictSentences.length} sentences)`);
}
buildDictFromRaw();

let hskAll = [];
function parseHSKData(rawText, levelName) {
  if (!rawText || typeof rawText !== 'string') return [];
  const lines = rawText.split('\n');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let cols = line.split('\t');
    if (cols.length < 4) cols = line.split(/\s{2,}/);

    if (cols.length >= 4) {
      const item = {
        level: levelName,
        text: cols[1] ? cols[1].trim() : '',
        pinyin: cols[2] ? cols[2].trim() : '',
        meaning: cols[3] ? cols[3].trim() : '',
        example: cols[4] ? cols[4].trim() : '',
        examplePinyin: cols[5] ? cols[5].trim() : '',
        exampleMeaning: cols[6] ? cols[6].trim() : ''
      };
      if (item.text && item.meaning) result.push(item);
    }
  }
  return result;
}

function loadHSKData() {

  const sources = [
    ['HSK1', typeof HSK1_RAW !== 'undefined' ? HSK1_RAW : window.HSK1_RAW],
    ['HSK2', typeof HSK2_RAW !== 'undefined' ? HSK2_RAW : window.HSK2_RAW],
    ['HSK3', typeof HSK3_RAW !== 'undefined' ? HSK3_RAW : window.HSK3_RAW],
    ['HSK4', typeof HSK4_RAW !== 'undefined' ? HSK4_RAW : window.HSK4_RAW],
    ['HSK5', typeof HSK5_RAW !== 'undefined' ? HSK5_RAW : window.HSK5_RAW],
    ['HSK6', typeof HSK6_RAW !== 'undefined' ? HSK6_RAW : window.HSK6_RAW]
  ];
  hskAll = [];
  sources.forEach(([lv, raw]) => hskAll.push(...parseHSKData(raw, lv)));
  console.log(`🎓 Loaded ${hskAll.length} HSK words`);
}
loadHSKData();

function searchAllDict(raw, limit) {
  const q = stripDiacritics(raw);
  const out = [];
  const pools = [window.dictIndex || [], hskAll];
  for (const pool of pools) {
    for (const i of pool) {
      if (!i._k) i._k = [stripDiacritics(i.text), stripDiacritics(i.pinyin), stripDiacritics(i.meaning)];
      if (i._k[0].includes(q) || i._k[1].includes(q) || i._k[2].includes(q)) {
        out.push(i);
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

function showResetModal() { document.getElementById('reset-modal').classList.add('active'); }
function closeResetModal() { document.getElementById('reset-modal').classList.remove('active'); }
function confirmReset() {
  safeStorage.remove('cn_quiz_daily_stats');
  safeStorage.remove('cn_quiz_srs_words');
  safeStorage.remove('cn_quiz_extra_dict');
  ['cn_quiz_hsk_seen','cn_quiz_level_stats','cn_quiz_xp','cn_quiz_hsk_ever','cn_quiz_goal_done'].forEach(k => safeStorage.remove(k));
  location.reload();
}
function exportData() {
  const data = {
    dailyStats: safeStorage.get('cn_quiz_daily_stats') || {},
    srsWords: safeStorage.get('cn_quiz_srs_words') || [],
    extraDict: safeStorage.get('cn_quiz_extra_dict') || [],
    levelStats: safeStorage.get('cn_quiz_level_stats') || {},
    xp: safeStorage.get('cn_quiz_xp') || 0,
    hskEver: safeStorage.get('cn_quiz_hsk_ever') || {},
    hskSeen: safeStorage.get('cn_quiz_hsk_seen') || {}
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'quiz_data.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.dailyStats) safeStorage.set('cn_quiz_daily_stats', data.dailyStats);
      if (Array.isArray(data.srsWords)) safeStorage.set('cn_quiz_srs_words', data.srsWords);
      if (Array.isArray(data.extraDict)) safeStorage.set('cn_quiz_extra_dict', data.extraDict);
      if (data.levelStats) safeStorage.set('cn_quiz_level_stats', data.levelStats);
      if (typeof data.xp === 'number') safeStorage.set('cn_quiz_xp', data.xp);
      if (data.hskEver) safeStorage.set('cn_quiz_hsk_ever', data.hskEver);
      if (data.hskSeen) safeStorage.set('cn_quiz_hsk_seen', data.hskSeen);
      alert('✅ Nhập dữ liệu thành công! Trang sẽ tải lại.');
      location.reload();
    } catch(err) { alert('❌ File không hợp lệ!'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

async function handleTxtUpload(e) {
  const files = e.target.files;
  if (!files || !files.length) return;

  const parsePromises = Array.from(files).map(file =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    })
  );

  const contents = await Promise.all(parsePromises);
  const allNew = [];
  for (const content of contents) {
    allNew.push(...parseDictData(content));
  }

  const existingTexts = new Set((window.dictIndex || []).map(x => x.text));
  const added = allNew.filter(x => !existingTexts.has(x.text));

  if (added.length === 0) {
    showToast('📂 Không có từ mới nào để thêm');
    e.target.value = '';
    return;
  }

  window.dictIndex = [...(window.dictIndex || []), ...added];
  window.dictWords = window.dictIndex.filter(p => p.type === 'word');
  window.dictSentences = window.dictIndex.filter(p => p.type === 'sentence');
  UNIFIED_POOL = null;
  SENTENCE_POOL = null;

  const existingExtra = safeStorage.get('cn_quiz_extra_dict') || [];
  safeStorage.set('cn_quiz_extra_dict', [...existingExtra, ...added]);

  showToast(`✅ Đã thêm ${added.length} mục mới`);
  e.target.value = '';

  if (document.getElementById('vocab-screen').style.display === 'block') {
    openVocab();
  }
}

function hskLookup(text) {
  if (!_hskMap) { _hskMap = new Map(); hskAll.forEach(i => { if (!_hskMap.has(i.text)) _hskMap.set(i.text, i); }); }
  return _hskMap.get(text) || null;
}
function enrich(item) {
  if (!item || item.example) return item;
  const h = hskLookup(item.text);
  if (!h) return item;
  return { ...item, level: item.level || h.level, example: h.example, examplePinyin: h.examplePinyin, exampleMeaning: h.exampleMeaning };
}

/* ============================================================
   2. Cài đặt, âm thanh, TTS
   ============================================================ */
let voiceEnabled = safeStorage.get('cn_quiz_voice');
if (voiceEnabled === null) voiceEnabled = true;
let soundEnabled = safeStorage.get('cn_quiz_sound');
if (soundEnabled === null) soundEnabled = true;
let musicEnabled = safeStorage.get('cn_quiz_music');
if (musicEnabled === null) musicEnabled = true;
let musicVolume = safeStorage.get('cn_quiz_music_vol');
if (typeof musicVolume !== 'number') musicVolume = 0.15;

function updateSetting(key, value) {
  if (key === 'voice') {
    voiceEnabled = value;
    safeStorage.set('cn_quiz_voice', value);
    if (!value && window.speechSynthesis) window.speechSynthesis.cancel();
  } else if (key === 'sound') {
    soundEnabled = value;
    safeStorage.set('cn_quiz_sound', value);
  } else if (key === 'music') {
    musicEnabled = value;
    safeStorage.set('cn_quiz_music', value);
    updateMusicState();
  } else if (key === 'autoplay') {
    autoPlayListen = value; safeStorage.set('cn_quiz_autoplay', value);
  } else if (key === 'autospeak') {
    autoSpeakQ = value; safeStorage.set('cn_quiz_autospeak', value);
  }
  showToast('✅ Đã lưu cài đặt');
}

function updateVolume(value) {
  musicVolume = Math.max(0, Math.min(1, parseInt(value) / 100));
  safeStorage.set('cn_quiz_music_vol', musicVolume);
  document.getElementById('volume-label').textContent = Math.round(musicVolume * 100) + '%';
  const m = document.getElementById('bg-music');
  if (m && !musicDucked) {
    clearInterval(musicFadeTimer);
    m.volume = musicVolume;
  }
}

function openSettings() {
  const ov = document.getElementById('settings-modal');
  ov.classList.add('active');
  document.getElementById('setting-voice').checked = voiceEnabled;
  document.getElementById('setting-sound').checked = soundEnabled;
  document.getElementById('setting-music').checked = musicEnabled;
  document.getElementById('setting-autoplay').checked = autoPlayListen;
  document.getElementById('setting-autospeak').checked = autoSpeakQ;
  syncSegs();
  document.getElementById('setting-volume').value = Math.round(musicVolume * 100);
  document.getElementById('volume-label').textContent = Math.round(musicVolume * 100) + '%';
}
function closeSettings() {
  document.getElementById('settings-modal').classList.remove('active');
}

let musicDucked = false;
let savedVolume = musicVolume;

function updateMusicState() {
  const m = document.getElementById('bg-music');
  if (!m) return;
  m.volume = musicVolume;
  if (musicEnabled) {
    const playPromise = m.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {});
    }
  } else {
    m.pause();
  }
}

let musicFadeTimer = null;

function fadeMusicTo(target, ms) {
  const m = document.getElementById('bg-music');
  if (!m) return;
  clearInterval(musicFadeTimer);
  const from = m.volume;
  const steps = Math.max(1, Math.round(ms / 30));
  let i = 0;
  musicFadeTimer = setInterval(() => {
    i++;
    const t = Math.min(1, i / steps);
    const eased = t * t * (3 - 2 * t);
    m.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
    if (i >= steps) { clearInterval(musicFadeTimer); musicFadeTimer = null; }
  }, 30);
}

function duckMusic() {
  const m = document.getElementById('bg-music');
  if (!m || m.paused || musicDucked) return;
  musicDucked = true;
  savedVolume = musicVolume;
  fadeMusicTo(Math.min(0.03, musicVolume * 0.15), 450);
}

function unduckMusic() {
  const m = document.getElementById('bg-music');
  if (!m || !musicDucked) return;
  musicDucked = false;
  fadeMusicTo(musicVolume, 1400);
}

function initMusicAutoplay() {
  const tryPlay = () => {
    if (!musicEnabled) return;
    const m = document.getElementById('bg-music');
    if (m && m.paused) {
      m.volume = musicVolume;
      const p = m.play();
      if (p && p.then) p.then(() => {
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('keydown', tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      }).catch(() => {});
    }
  };
  document.addEventListener('click', tryPlay);
  document.addEventListener('keydown', tryPlay);
  document.addEventListener('touchstart', tryPlay);
  const m = document.getElementById('bg-music');
  if (m && musicEnabled) {
    m.volume = musicVolume;
    m.play().then(() => {}).catch(() => {});
  }
}

const MUSIC_DIR = 'Music';
let musicTrack = safeStorage.get('cn_quiz_music_track');
if (!(typeof musicTrack === 'number' && musicTrack >= 0 && musicTrack <= 12)) musicTrack = 1;
let musicChanging = false;

function updateMusicLabel() {
  const lb = document.getElementById('music-track-label');
  if (lb) lb.textContent = musicTrack === 0 ? 'music.mp3' : 'music' + musicTrack + '.mp3';
}
function probeSrc(src, cb) {
  const a = new Audio();
  let settled = false;
  const done = ok => { if (settled) return; settled = true; cb(ok); };
  a.addEventListener('loadeddata', () => done(true));
  a.addEventListener('canplay', () => done(true));
  a.addEventListener('error', () => done(false));
  setTimeout(() => done(false), 2500);
  a.src = src;
  if (a.load) a.load();
}
function applyMusicSrc(src, label) {
  const m = document.getElementById('bg-music');
  if (m) {
    m.src = src;
    if (musicEnabled) { m.volume = musicVolume; m.play().catch(() => {}); }
  }
  const lb = document.getElementById('music-track-label');
  if (lb) lb.textContent = label;
}
function setMusicTrack(n) {
  musicTrack = n;
  safeStorage.set('cn_quiz_music_track', n);
  applyMusicSrc(MUSIC_DIR + '/music' + n + '.mp3', 'music' + n + '.mp3');
  showToast('🎵 Đang phát: music' + n + '.mp3');
}
function changeMusicTrack() {
  if (musicChanging) return;
  musicChanging = true;
  const start = musicTrack;
  let tried = 0, n = start;
  const step = () => {
    tried++;
    n = (n % 12) + 1;
    if (tried > 12) {
      probeSrc('music.mp3', ok => {
        musicChanging = false;
        if (ok) { musicTrack = 0; safeStorage.set('cn_quiz_music_track', 0); applyMusicSrc('music.mp3', 'music.mp3'); showToast('🎵 Đang phát: music.mp3'); }
        else showToast('⚠️ Không tìm thấy nhạc trong Music/ (music1.mp3, music2.mp3…)');
      });
      return;
    }
    probeSrc(MUSIC_DIR + '/music' + n + '.mp3', ok => {
      if (ok) { musicChanging = false; setMusicTrack(n); }
      else step();
    });
  };
  step();
}

let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playSound(type) {
  if (!soundEnabled) return;
  try { if (navigator.vibrate) navigator.vibrate(type === 'wrong' ? [30, 40, 30] : 15); } catch(e) {}
  try {
    initAudio(); if (!audioCtx) return;
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    if (type === 'correct') {
      osc.type='sine'; osc.frequency.setValueAtTime(800,now);
      osc.frequency.exponentialRampToValueAtTime(1200,now+0.1);
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.2,now+0.02);
      g.gain.exponentialRampToValueAtTime(0.01,now+0.3);
      osc.start(now); osc.stop(now+0.3);
    } else if (type === 'wrong') {
      osc.type='sawtooth'; osc.frequency.setValueAtTime(150,now);
      osc.frequency.linearRampToValueAtTime(100,now+0.2);
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.15,now+0.02);
      g.gain.exponentialRampToValueAtTime(0.01,now+0.3);
      osc.start(now); osc.stop(now+0.3);
    }
  } catch(e) {}
}

let zhVoice = null;
let speakToken = 0;

const TTS_RATES = [0.6, 0.85, 1.0];
let ttsRate = (function(){ const v = Number(safeStorage.get('cn_quiz_tts_rate')); return TTS_RATES.includes(v) ? v : 0.85; })();
function ttsRateLabel() { return (ttsRate === 0.6 ? '🐢 ' : ttsRate === 1 ? '🐇 ' : '🚶 ') + ttsRate + 'x'; }
function refreshTTSBtns() { document.querySelectorAll('.tts-rate-btn:not(.tts-replay)').forEach(b => b.textContent = ttsRateLabel()); }
function cycleTTSRate(replay) {
  ttsRate = TTS_RATES[(TTS_RATES.indexOf(ttsRate) + 1) % TTS_RATES.length];
  safeStorage.set('cn_quiz_tts_rate', ttsRate); refreshTTSBtns();
  if (typeof replay === 'function') { try { replay(); } catch (e) {} }
}
refreshTTSBtns();
function setSlowTTS() { if (ttsRate !== 0.6) { ttsRate = 0.6; safeStorage.set('cn_quiz_tts_rate', ttsRate); refreshTTSBtns(); } }
let ttsSupported = ('speechSynthesis' in window);
function loadVoices() {
  if (!ttsSupported || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter(v => v.lang.startsWith('zh'));
  if (zhVoices.length === 0) { zhVoice = null; return; }
  const priority = ['Xiaoxiao','Xiaoyi','Xiaomo','Xiaoxuan','Huihui','Yaoyao','Ting-Ting','Google 普通话'];
  for (let n of priority) {
    let f = zhVoices.find(v => v.name.includes(n) && v.localService);
    if (f) { zhVoice = f; return; }
  }
  zhVoice = zhVoices.find(v => v.localService) || zhVoices[0];
}
function speakChinese(text, btn) {
  if (!voiceEnabled || !ttsSupported || !window.speechSynthesis) return;
  const clean = String(text).replace(/\(.*?\)/g,'');
  const hanzi = (clean.match(/[\u4e00-\u9fa5]+/g) || []).join(' ');
  if (!hanzi) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(hanzi);
  u.lang = 'zh-CN'; u.rate = ttsRate;
  if (zhVoice) u.voice = zhVoice;
  const target = btn || document.getElementById('btn-speak');
  if (target) target.classList.add('speaking');
  const myToken = ++speakToken;
  duckMusic();
  u.onend = u.onerror = () => {
    if (target) target.classList.remove('speaking');
    if (myToken === speakToken) unduckMusic();
  };
  window.speechSynthesis.speak(u);
}

function cycleTheme() {
  const themes = ['neon','sakura','light'];
  const cur = document.documentElement.getAttribute('data-skin') || 'neon';
  const next = themes[(themes.indexOf(cur) + 1) % themes.length];
  document.documentElement.setAttribute('data-skin', next);
  safeStorage.set('cn_quiz_theme', next);
}

let autoPlayListen = (v => v === null ? true : !!v)(safeStorage.get('cn_quiz_autoplay'));
let autoSpeakQ = !!safeStorage.get('cn_quiz_autospeak');
let timerSec = Number(safeStorage.get('cn_quiz_timer')) || 0;
let dailyGoal = Number(safeStorage.get('cn_quiz_goal')) || 20;
function setTimerSec(n) { timerSec = n; safeStorage.set('cn_quiz_timer', n); syncSegs(); showToast(n ? `⏱️ Đếm ngược ${n}s mỗi câu` : '⏱️ Đã tắt đếm ngược'); }
function setDailyGoal(n) { dailyGoal = n; safeStorage.set('cn_quiz_goal', n); syncSegs(); updateHomeCard(); showToast(`🎯 Mục tiêu ${n} câu/ngày`); }
function syncSegs() {
  document.querySelectorAll('#timer-seg button').forEach(b => b.classList.toggle('active', Number(b.dataset.v) === timerSec));
  document.querySelectorAll('#goal-seg button').forEach(b => b.classList.toggle('active', Number(b.dataset.v) === dailyGoal));
  const tl = document.getElementById('timer-label'); if (tl) tl.textContent = timerSec ? timerSec + ' giây' : 'Tắt';
  const gl = document.getElementById('goal-label'); if (gl) gl.textContent = dailyGoal + ' câu';
  document.body.classList.toggle('has-timer', timerSec > 0);
}

let qTimer = null, qRemain = 0, qTotal = 0;
function startQTimer(onTimeout) {
  stopQTimer();
  if (!timerSec) return;
  qTotal = qRemain = timerSec * 1000;
  setTimerFill(1);
  qTimer = setInterval(() => {
    if (isPaused) return;
    qRemain -= 100;
    setTimerFill(Math.max(0, qRemain / qTotal));
    if (qRemain <= 0) { stopQTimer(); onTimeout(); }
  }, 100);
}
function stopQTimer() { clearInterval(qTimer); qTimer = null; }
function setTimerFill(f) {
  document.querySelectorAll('.timer-fill').forEach(el => {
    el.style.width = (f * 100) + '%';
    el.style.background = f > .5 ? 'var(--correct)' : f > .25 ? '#facc15' : 'var(--wrong)';
  });
}

/* ============================================================
   3. Ứng dụng chính (quiz, HSK, SRS, thống kê…)
   ============================================================ */
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
  let a = +document.getElementById('hskq-from').value, b = +document.getElementById('hskq-to').value;
  if (a > b) [a, b] = [b, a];
  const n = +document.getElementById('hskq-count').value || 20;
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
        Từ <select id="hskq-from" style="${selCss}">${[1,2,3,4,5,6].map(v => opt(v, saved.a)).join('')}</select>
        đến <select id="hskq-to" style="${selCss}">${[1,2,3,4,5,6].map(v => opt(v, saved.b)).join('')}</select>
        <select id="hskq-count" style="${selCss}">${[10,20,30,40].map(v => `<option value="${v}" ${v === saved.n ? 'selected' : ''}>${v} câu</option>`).join('')}</select>
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

/* ============================================================
   4. Chế độ Nghe đoán
   ============================================================ */
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

/* ============================================================
   5. Tối ưu giao diện (tự co giãn)
   ============================================================ */
(function () {
  const root = document.documentElement;
  const FitScale = { s: 1, W: 390, H: 700 };
  let lastW = 0, lastH = 0;
  function typing() { const a = document.activeElement; return !!a && /^(INPUT|TEXTAREA)$/.test(a.tagName); }
  function apply() {
    const vw = window.innerWidth, vh = window.innerHeight;

    if (lastW && typing() && vw === lastW && vh < lastH) return;
    lastW = vw; lastH = vh;
    const s = Math.max(0.5, Math.min(vw / 390, vh / 700, 2.4));
    const W = Math.min(vw / s, 560), H = vh / s;
    Object.assign(FitScale, { s, W, H });
    root.style.setProperty('--s', s.toFixed(4));
    root.style.setProperty('--W', W.toFixed(2) + 'px');
    root.style.setProperty('--H', H.toFixed(2) + 'px');
    root.style.setProperty('--hu', (H / 100).toFixed(4) + 'px');
    root.classList.toggle('fit-short', H <= 680);
  }
  function mount() {
    const c = document.querySelector('.container');
    if (c) document.querySelectorAll('.top-bar,.corner-data').forEach(e => { if (e.parentNode !== c) c.appendChild(e); });
  }
  apply();
  window.FitScale = FitScale;
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', () => setTimeout(apply, 120));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();

/* ============================================================
   6. Nhận diện chữ Hán viết tay
   ============================================================ */
(function () {
  'use strict';
  const N = 64, BOX = 54, PAD = (N - BOX) / 2;
  const CFG = {

    fonts: [
      '"KaiTi","STKaiti","Kaiti SC","AR PL UKai CN","BiauKai"',
      '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Noto Sans SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif',
      '"SimSun","Songti SC","Noto Serif CJK SC","Noto Serif SC","STSong",serif'
    ],
    dataUrl: 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/',
    useStrokeData: true,
    m0: 2.2,
    tol: 1.3,
    pass: 80,
    rivalMin: 88, rivalGap: 15,
    noteMin: 72, noteGap: 12,
    maxCandidates: 40
  };
  const LS_PREFIX = 'cn_hw_';
  const cache = { font: new Map(), data: new Map(), dt: new Map() };

  function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h || w; return c; }
  function distTransform(grid) {
    const INF = 1e9, d = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) d[i] = grid[i] ? 0 : INF;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x; let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      if (y > 0) { v = Math.min(v, d[i - N] + 3); if (x > 0) v = Math.min(v, d[i - N - 1] + 4); if (x < N - 1) v = Math.min(v, d[i - N + 1] + 4); }
      d[i] = v;
    }
    for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
      const i = y * N + x; let v = d[i];
      if (x < N - 1) v = Math.min(v, d[i + 1] + 3);
      if (y < N - 1) { v = Math.min(v, d[i + N] + 3); if (x < N - 1) v = Math.min(v, d[i + N + 1] + 4); if (x > 0) v = Math.min(v, d[i + N - 1] + 4); }
      d[i] = v;
    }
    for (let i = 0; i < N * N; i++) d[i] /= 3;
    return d;
  }
  function gridOf(pts) {
    const g = new Uint8Array(N * N);
    pts.forEach(p => { const x = Math.round(p[0]), y = Math.round(p[1]); if (x >= 0 && y >= 0 && x < N && y < N) g[y * N + x] = 1; });
    return g;
  }
  function normalize(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    const w = x1 - x0, h = y1 - y0, s = BOX / Math.max(w, h, 1e-6);
    const ox = PAD + (BOX - w * s) / 2, oy = PAD + (BOX - h * s) / 2;
    return pts.map(p => [(p[0] - x0) * s + ox, (p[1] - y0) * s + oy]);
  }
  function densify(strokes, step) {
    const out = [];
    strokes.forEach(st => {
      const P = st.map(p => Array.isArray(p) ? p : [p.x, p.y]);
      if (P.length === 1) out.push(P[0]);
      for (let i = 1; i < P.length; i++) {
        const a = P[i - 1], b = P[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step));
        for (let j = 0; j <= k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
      }
    });
    return out;
  }

  function thin(img, W, H) {
    let changed = true, guard = 0;
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : img[y * W + x];
    while (changed && guard++ < 40) {
      changed = false;
      for (let pass = 0; pass < 2; pass++) {
        const del = [];
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          if (!img[y * W + x]) continue;
          const p2 = get(x, y - 1), p3 = get(x + 1, y - 1), p4 = get(x + 1, y), p5 = get(x + 1, y + 1), p6 = get(x, y + 1), p7 = get(x - 1, y + 1), p8 = get(x - 1, y), p9 = get(x - 1, y - 1);
          const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9; if (B < 2 || B > 6) continue;
          const seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]; let A = 0;
          for (let i = 0; i < 8; i++) if (!seq[i] && seq[i + 1]) A++;
          if (A !== 1) continue;
          if (pass === 0) { if (p2 * p4 * p6 || p4 * p6 * p8) continue; } else { if (p2 * p4 * p8 || p2 * p6 * p8) continue; }
          del.push(y * W + x);
        }
        if (del.length) { changed = true; del.forEach(i => img[i] = 0); }
      }
    }
    return img;
  }
  function fontInk(ch, fam) {
    const S = 160, c = mkCanvas(S), g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff'; g.fillRect(0, 0, S, S); g.fillStyle = '#000';
    g.font = '120px ' + fam; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, S / 2, S / 2 + 6);
    const d = g.getImageData(0, 0, S, S).data, img = new Uint8Array(S * S); let n = 0;
    for (let i = 0; i < S * S; i++) if (d[i * 4] < 128) { img[i] = 1; n++; }
    return { img, n, S };
  }
  function fontVariant(ch, fam) {
    const f = fontInk(ch, fam);
    if (f.n < 40) return null;
    const ref = fontInk('\uE0BB', fam);
    if (ref.n > 0 && Math.abs(ref.n - f.n) < 4) {
      let same = 0; for (let i = 0; i < f.img.length; i++) if (f.img[i] === ref.img[i]) same++;
      if (same > f.img.length * 0.999) return null;
    }
    thin(f.img, f.S, f.S);
    const pts = []; for (let y = 0; y < f.S; y++) for (let x = 0; x < f.S; x++) if (f.img[y * f.S + x]) pts.push([x, y]);
    if (pts.length < 5) return null;
    return { pts: normalize(pts), source: 'font' };
  }
  function fontTargets(ch) {
    if (cache.font.has(ch)) return cache.font.get(ch);
    const out = [], seen = new Set();
    (CFG.fonts || []).forEach(fam => {
      let v = null; try { v = fontVariant(ch, fam); } catch (e) {}
      if (!v) return;
      let sx = 0, sy = 0; v.pts.forEach(p => { sx += p[0]; sy += p[1]; });
      const key = v.pts.length + ':' + Math.round(sx) + ':' + Math.round(sy);
      if (!seen.has(key)) { seen.add(key); out.push(v); }
    });
    if (!out.length) { const e = new Error('Thiết bị chưa có font tiếng Trung để chấm chữ "' + ch + '".'); e.code = 'no-font'; throw e; }
    cache.font.set(ch, out); return out;
  }
  function fontTarget(ch) { return fontTargets(ch)[0]; }

  async function getStrokeData(ch) {
    if (!CFG.useStrokeData) return null;
    if (cache.data.has(ch)) return cache.data.get(ch);
    let res = null;
    try { const raw = localStorage.getItem(LS_PREFIX + ch); if (raw) { const j = JSON.parse(raw); if (j && j.strokes && j.medians) { cache.data.set(ch, j); return j; } } } catch (e) {}
    try {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const to = setTimeout(() => ctl && ctl.abort(), 4000);
      const r = await fetch(CFG.dataUrl + encodeURIComponent(ch) + '.json', ctl ? { signal: ctl.signal } : undefined);
      clearTimeout(to);
      if (r.ok) { const j = await r.json(); if (j && j.strokes && j.medians && j.strokes.length === j.medians.length) { res = j; try { localStorage.setItem(LS_PREFIX + ch, JSON.stringify({ strokes: j.strokes, medians: j.medians })); } catch (e) {} } }
    } catch (e) { res = null; }
    if (res) cache.data.set(ch, res);
    return res;
  }
  function prefetch(chars) { [...new Set([...(chars || '')].filter(c => /[一-鿿]/.test(c)))].slice(0, 40).forEach(c => { getStrokeData(c).catch(() => {}); }); }
  function medianTarget(j) {
    const strokes = j.medians.map(m => m.map(p => [p[0], 900 - p[1]]));
    return { pts: normalize(densify(strokes, 12)), source: 'strokes', strokeCount: strokes.length, medians: j.medians };
  }
  async function getTargets(ch) {
    const j = await getStrokeData(ch);
    const v = [];
    if (j) v.push(medianTarget(j));
    try { fontTargets(ch).forEach(t => v.push(t)); } catch (e) { if (!v.length) throw e; }
    return v;
  }
  async function getTarget(ch) { return (await getTargets(ch))[0]; }
  function dtOf(ch, t, i) { const k = ch + '|' + t.source + '|' + i; if (!cache.dt.has(k)) cache.dt.set(k, distTransform(gridOf(t.pts))); return cache.dt.get(k); }

  function meanTo(pts, dt) {
    let s = 0, n = 0;
    for (const p of pts) { const x = Math.min(N - 1, Math.max(0, Math.round(p[0]))), y = Math.min(N - 1, Math.max(0, Math.round(p[1]))); s += Math.max(0, Math.min(dt[y * N + x], 14) - CFG.tol); n++; }
    return n ? s / n : 14;
  }
  function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(p => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return [x0, y0, x1, y1]; }
  function fitTo(dense, tb) {
    const ub = bbox(dense), uw = ub[2] - ub[0], uh = ub[3] - ub[1], tw = tb[2] - tb[0], th = tb[3] - tb[1];
    if (uw < 1 || uh < 1 || tw < 3 || th < 3) return null;
    const ra = (uw / uh) / (tw / th);
    if (ra < 0.55 || ra > 1.8) return null;
    return dense.map(p => [(p[0] - ub[0]) * tw / uw + tb[0], (p[1] - ub[1]) * th / uh + tb[1]]);
  }
  function alignScore(U, tgt, tdt, full) {
    const sc = full ? [0.92, 1, 1.08] : [1], sh = full ? [-2.5, 0, 2.5] : [0];
    let best = 1e9;
    for (const sx of sc) for (const sy of sc) for (const dx of sh) for (const dy of sh) {
      const P = (sx === 1 && sy === 1 && !dx && !dy) ? U : U.map(p => [(p[0] - 32) * sx + 32 + dx, (p[1] - 32) * sy + 32 + dy]);
      const d1 = meanTo(P, tdt), d2 = meanTo(tgt.pts, distTransform(gridOf(P)));
      const m = (d1 + d2) / 2 + 0.3 * Math.abs(d1 - d2) + 0.15 * (Math.abs(Math.log(sx)) + Math.abs(Math.log(sy))) * 10 + 0.08 * (Math.abs(dx) + Math.abs(dy));
      if (m < best) best = m;
    }
    return best;
  }
  const toPct = m => Math.round(100 / (1 + Math.pow(m / CFG.m0, 2.4)));

  function scoreChar(dense, ch, variants, full) {
    const A = normalize(dense); let best = 1e9;
    variants.forEach((t, i) => {
      const tdt = dtOf(ch, t, i), B = fitTo(dense, bbox(t.pts));
      best = Math.min(best, alignScore(A, t, tdt, full)); if (B) best = Math.min(best, alignScore(B, t, tdt, full));
    });
    return toPct(best);
  }

  function resample(P, k) {
    const d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const L = d[d.length - 1], out = [];
    if (L < 1e-6) { for (let i = 0; i < k; i++) out.push(P[0]); return { pts: out, len: 0 }; }
    for (let i = 0; i < k; i++) { const t = L * i / (k - 1); let j = 1; while (j < d.length - 1 && d[j] < t) j++; const u = (t - d[j - 1]) / ((d[j] - d[j - 1]) || 1); out.push([P[j - 1][0] + (P[j][0] - P[j - 1][0]) * u, P[j - 1][1] + (P[j][1] - P[j - 1][1]) * u]); }
    return { pts: out, len: L };
  }
  const meanD = (A, B) => { let t = 0; for (let i = 0; i < A.length; i++) t += Math.hypot(A[i][0] - B[i][0], A[i][1] - B[i][1]); return t / A.length; };
  function strokeName(pts, short) {
    if (short) return 'chấm (丶)';
    const a = pts[0], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (Math.abs(ang) <= 25) return 'ngang (一)';
    if (ang > 25 && ang <= 65) return 'mác (㇏, xuống phải)';
    if (ang > 65 && ang <= 115) return 'sổ (丨)';
    if (ang > 115 && ang <= 170) return 'phẩy (丿, xuống trái)';
    if (ang < -25 && ang >= -65) return 'hất (㇀, lên phải)';
    if (ang < -65 && ang >= -115) return 'sổ ngược (lên)';
    return 'ngang ngược (sang trái)';
  }
  function dirWords(pts) {
    const a = pts[0], b = pts[pts.length - 1], dx = b[0] - a[0], dy = b[1] - a[1];
    const h = Math.abs(dx) > Math.abs(dy) * 0.4 ? (dx > 0 ? 'trái sang phải' : 'phải sang trái') : '';
    const v = Math.abs(dy) > Math.abs(dx) * 0.4 ? (dy > 0 ? 'trên xuống dưới' : 'dưới lên trên') : '';
    return [v, h].filter(Boolean).join(' và ') || 'đúng chiều chuẩn';
  }

  function analyzeStrokes(real, medians) {
    const n = medians.length, m = real.length;
    if (!n || n !== m) return { checked: false, reason: 'count', issues: [] };
    const M = medians.map(s => s.map(p => [p[0], 900 - p[1]]));
    const U0 = real.map(s => s.map(p => [p.x, p.y]));
    const mb = bbox(M.flat()), ub = bbox(U0.flat());
    const mw = mb[2] - mb[0], mh = mb[3] - mb[1], uw = ub[2] - ub[0], uh = ub[3] - ub[1], S = Math.max(mw, mh, 1);
    const sc = S / Math.max(uw, uh, 1e-6);
    const ox = (mb[0] + mb[2]) / 2 - (ub[0] + ub[2]) / 2 * sc, oy = (mb[1] + mb[3]) / 2 - (ub[1] + ub[3]) / 2 * sc;
    const U = U0.map(s => s.map(p => [p[0] * sc + ox, p[1] * sc + oy]));
    const K = 12, ur = U.map(s => resample(s, K)), mr = M.map(s => resample(s, K));
    const fwd = [], rev = [];
    for (let i = 0; i < n; i++) { fwd.push([]); rev.push([]); for (let j = 0; j < n; j++) { fwd[i].push(meanD(ur[i].pts, mr[j].pts) / S); rev[i].push(meanD(ur[i].pts.slice().reverse(), mr[j].pts) / S); } }
    const cost = (i, j) => Math.min(fwd[i][j], rev[i][j]);

    const pairs = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pairs.push([cost(i, j), i, j]);
    pairs.sort((a, b) => a[0] - b[0]);
    const match = new Array(n).fill(-1), used = new Array(n).fill(false);
    pairs.forEach(([c, i, j]) => { if (match[i] < 0 && !used[j]) { match[i] = j; used[j] = true; } });
    const issues = [], isShort = j => mr[j].len < S * 0.12;
    const bad = [];
    for (let i = 0; i < n; i++) {
      const j = match[i];
      if (j !== i && cost(i, j) < 0.2 && cost(i, i) - cost(i, j) > 0.05) bad.push([i, j]);
    }
    for (let k = bad.length - 1; k >= 0; k--) if (match[bad[k][1]] === bad[k][0] && bad[k][1] < bad[k][0]) bad.splice(k, 1);
    if (bad.length) {
      const [i, j] = bad[0];
      issues.push({ type: 'order', stroke: i + 1, msg: `Thứ tự nét: nét thứ ${i + 1} phải là nét ${strokeName(mr[i].pts, isShort(i))}, nhưng bạn viết nét ${strokeName(mr[j].pts, isShort(j))} (đúng ra là nét thứ ${j + 1}).` + (bad.length > 1 ? ' Còn vài nét khác cũng sai thứ tự — xem “Thứ tự nét”.' : '') });
    }
    if (!bad.length) for (let i = 0; i < n; i++) {
      if (isShort(i) || cost(i, i) > 0.2) continue;
      if (rev[i][i] < fwd[i][i] * 0.7 && fwd[i][i] - rev[i][i] > 0.04) issues.push({ type: 'dir', stroke: i + 1, msg: `Hướng nét: nét thứ ${i + 1} (${strokeName(mr[i].pts, false)}) bạn viết ngược chiều — phải viết từ ${dirWords(mr[i].pts)}.` });
    }
    return { checked: true, issues: issues.slice(0, 3), match };
  }

  async function recognize(strokes, ch, candidates) {
    const real = (strokes || []).filter(s => s && s.length);
    if (!real.length) return { ok: false, error: 'empty', message: 'Chưa có nét nào.' };
    const dense = densify(real, 1);
    const ext = bbox(dense);
    if (Math.max(ext[2] - ext[0], ext[3] - ext[1]) < 12) return { ok: false, error: 'tiny', message: 'Nét quá nhỏ — hãy viết to hơn.' };
    let tv;
    try { tv = await getTargets(ch); } catch (e) { return { ok: false, error: e.code || 'target', message: e.message }; }
    const pct = scoreChar(dense, ch, tv, true), meCoarse = scoreChar(dense, ch, tv, false);
    let best = { ch, pct: meCoarse }, rank = 1, cands = 0;
    const list = (candidates || []).filter(c => c && c !== ch).slice(0, CFG.maxCandidates);
    for (const c of list) {
      let v2; try { v2 = fontTargets(c); } catch (e) { continue; }
      const sc = scoreChar(dense, c, v2, false); cands++;
      if (sc > meCoarse) rank++;
      if (sc > best.pct) best = { ch: c, pct: sc };
    }
    const rivalStrong = best.ch !== ch && best.pct >= CFG.rivalMin && best.pct - meCoarse >= CFG.rivalGap;
    const pass = pct >= CFG.pass && !rivalStrong;
    let note = '';
    if (best.ch !== ch && best.pct >= CFG.noteMin && best.pct - meCoarse >= CFG.noteGap) note = 'Nét của bạn khớp với chữ "' + best.ch + '" hơn (' + best.pct + '%).';
    const first = tv[0], strokeInfo = first.source === 'strokes' ? { expected: first.strokeCount, got: real.length } : null;
    let strokeCheck = null;
    if (first.source === 'strokes' && first.medians) { try { strokeCheck = analyzeStrokes(real, first.medians); } catch (e) { strokeCheck = null; } }
    return { ok: true, percent: pct, pass, rank, candidates: cands, best, source: first.source, strokeInfo, strokeCheck, note };
  }

  window.HanziRecognizer = { name: 'chamfer-shape-v2', recognize, getStrokeData, prefetch, analyzeStrokes, getTarget, config: CFG, _internals: { normalize, densify, fontTarget, fontTargets, N, cache } };
})();

/* ============================================================
   7. Xử lý học tập (thống kê, sổ lỗi, sao lưu)
   ============================================================ */
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

/* ============================================================
   8. Chế độ Xếp câu
   ============================================================ */
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

/* ============================================================
   9. Chế độ Luyện viết
   ============================================================ */
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

/* ============================================================
   10. Chế độ Gõ pinyin
   ============================================================ */
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

/* ============================================================
   11. Dịch Việt ⇄ Trung
   ============================================================ */
(function () {
  'use strict';
  const PM = () => window.PinyinMode, $ = id => document.getElementById(id);
  const esc = s => escapeHTML(String(s == null ? '' : s));
  const HANRE = /[一-鿿]/;
  const PYRE = /^[a-zA-Z0-9üÜ:'’\s\-āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/;
  const norm = s => String(s || '').normalize('NFC').toLowerCase().replace(/[.,!?;:"“”'‘’()（）。，！？、；：…\-–—]/g, ' ').replace(/\s+/g, ' ').trim();
  const clean = py => String(py || '').split(/[\/／]/)[0].replace(/[\[［(（].*?[\]］)）]/g, '').trim();
  const sKey = t => String(t || '').replace(/[^一-鿿a-zA-Z0-9]/g, '');
  const vKey = t => stripDiacritics(norm(t)).replace(/[^a-z0-9]/g, '');

  function glossesOf(e) {
    if (e._gl) return e._gl;
    const g = String(e.meaning || '').replace(/\([^)]*\)|（[^）]*）/g, ' ').split(/[;,\/、；，]/).map(x => x.trim()).filter(x => x && x.length <= 40);
    return (e._gl = g.length ? g : [String(e.meaning || '').trim()]);
  }
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }

  let X = null, sig = '';
  function index() {
    const L = PM().lexicon(), s = L.list.length + ':' + (window.dictIndex || []).length;
    if (X && s === sig) return X;
    const zh = new Map(), g1 = new Map(), g2 = new Map(), syls = new Map();
    const put = (m, k, v) => (m.get(k) || m.set(k, []).get(k)).push(v);
    // cụm / câu ngắn trong Data.js (kể cả có dấu ! ? ASCII) cũng được đưa vào từ điển ghép
    const have = new Set(L.list.map(e => e.text + '|' + e.key)), phr = [];
    (window.dictIndex || []).forEach(d => {
      const han = String(d.text || '').replace(/[^一-鿿]/g, '');
      if (han.length < 2 || han.length > 14 || !d.meaning || !String(d.meaning).trim()) return;
      const t = PM().parseTarget(d.pinyin), er = (han.match(/儿/g) || []).length;
      if (!t.syl.length || (t.syl.length !== han.length && t.syl.length !== han.length - er)) return;
      if (have.has(han + '|' + t.key)) return; have.add(han + '|' + t.key);
      phr.push({ text: han, pinyin: String(d.pinyin), meaning: String(d.meaning).trim(), level: 'Data', key: t.key, syl: t.syl, tones: t.tones, rank: 7 });
    });
    const map = new Map(); L.map.forEach((a, k) => map.set(k, a.slice()));
    phr.forEach(e => put(map, e.key, e));
    const ALL = L.list.concat(phr);
    ALL.forEach(e => {
      put(zh, e.text, e);
      glossesOf(e).forEach((g, pos) => { const a = norm(g); if (!a) return; put(g1, a, { e, pos }); put(g2, stripDiacritics(a), { e, pos }); });
      e.syl.forEach(y => syls.set(y, (syls.get(y) || 0) + 1));
    });
    zh.forEach(a => a.sort((x, y) => x.rank - y.rank));
    const rk = m => m.forEach(a => a.sort((x, y) => x.pos - y.pos || x.e.rank - y.e.rank || x.e.text.length - y.e.text.length));
    rk(g1); rk(g2);
    const sz = new Map(), sv = new Map(), sl = [];
    const addS = (text, pinyin, meaning, level) => {
      text = String(text || '').trim(); meaning = String(meaning || '').trim();
      if (!text || !meaning || !HANRE.test(text)) return;
      const k = sKey(text); if (sz.has(k)) return;
      const it = { text, pinyin: String(pinyin || ''), meaning, level: level || '', vk: vKey(meaning) };
      sz.set(k, it); sv.set(it.vk, it); sl.push(it);
    };
    if (typeof hskAll !== 'undefined') hskAll.forEach(w => { if (w.example) addS(w.example, w.examplePinyin, w.exampleMeaning, w.level); });
    (window.dictIndex || []).forEach(x => addS(x.text, x.pinyin, x.meaning, 'Data'));

    /* ---- TỰ HỌC TỪ CẶP CÂU: tách từ lạ (vd "láo") ra khỏi câu có sẵn rồi dùng để ghép ---- */
    try {
      const PART_H = new Set([...'啊吧呢吗了啦呀哦嘛哇']), PART_V = new Set(['nhỉ', 'nhé', 'à', 'ạ', 'hả', 'hử', 'nhá', 'nha', 'nè']);
      const segL = text => {
        const ch = [...text].filter(c => HANRE.test(c)), n = ch.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(0);
        best[0] = 0;
        for (let i = 0; i < n; i++) { if (best[i] === Infinity) continue; for (let l = 1; l <= 3 && i + l <= n; l++) { const c = zh.get(ch.slice(i, i + l).join('')); const cost = c ? 1 - 0.12 * (l - 1) : l === 1 ? 2.5 : Infinity; if (best[i] + cost < best[i + l]) { best[i + l] = best[i] + cost; prv[i + l] = i; } } }
        const out = []; let q, p = n; while (p > 0) { q = prv[p]; const t = ch.slice(q, p).join(''); out.unshift({ t, s: q, e: zh.get(t) || null }); p = q; }
        return { toks: out, n };
      };
      const sd = sl.map(x => { const g = segL(x.text); return { s: x, toks: g.toks, nh: g.n, words: norm(x.meaning).split(' ').filter(Boolean) }; });
      const mk = (han, vi, d, st) => {
        const t = PM().parseTarget(d.s.pinyin); let py = '', syl = [], tones = [];
        if (t.syl.length === d.nh) { syl = t.syl.slice(st, st + han.length); tones = t.tones.slice(st, st + han.length); const tm = window.PracticeHub && window.PracticeHub.toMarks; py = syl.map((y, i) => tm ? tm(y, tones[i]) : y).join(' '); }
        return { text: han, pinyin: py, meaning: vi, level: 'Câu', key: syl.join(''), syl, tones, rank: 6, learned: d.s.text + ' = ' + d.s.meaning };
      };
      const addE = e => {
        ALL.push(e); put(zh, e.text, e); put(g1, norm(e.meaning), { e, pos: 0 }); put(g2, stripDiacritics(norm(e.meaning)), { e, pos: 0 });
        if (e.syl.length) { put(map, e.key, e); e.syl.forEach(y => syls.set(y, (syls.get(y) || 0) + 1)); }
      };
      const alias = (e, v, pos) => { (e._al = e._al || []); if (!e._al.includes(v)) e._al.push(v); put(g1, v, { e, pos }); put(g2, stripDiacritics(v), { e, pos }); };
      // Lượt 1: từ Việt lạ lặp lại nhiều lần trong câu ↔ token Hán hay đi cùng (vd mày ↔ 你)
      const cv = new Map(), ch1 = new Map(), cvh = new Map(), inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
      sd.forEach(d => {
        if (d.s.level !== 'Data') return;
        d.hs = d.toks.map(t => t.t).join(''); d.H = new Set(d.toks.map(t => t.t));
        for (let i = 0; i + 2 <= d.hs.length; i++) d.H.add(d.hs.slice(i, i + 2));
        d.V = new Set(d.words.filter(w => !g1.has(w) && w.length >= 2));
        d.H.forEach(h => inc(ch1, h)); d.V.forEach(v => { inc(cv, v); d.H.forEach(h => inc(cvh, v + '\t' + h)); });
      });
      const byV = new Map();
      cvh.forEach((c, k) => { if (c < 2) return; const [v, h] = k.split('\t'); (byV.get(v) || byV.set(v, []).get(v)).push([h, c]); });
      byV.forEach((arr, v) => {
        const n = cv.get(v); if (n < 2 || g1.has(v)) return;
        let best = null, bd = 0; arr.forEach(([h, c]) => { const dice = 2 * c / (n + ch1.get(h)); if (c / n >= 0.5 && dice > bd) { bd = dice; best = [h, c]; } });
        if (!best || bd < 0.25) return;
        const h = best[0], ents = zh.get(h);
        if (ents) alias(ents[0], v, 0.5);
        else { const d = sd.find(x => x.V && x.V.has(v) && x.H.has(h)); if (d) addE(mk(h, v, d, d.hs.indexOf(h))); }
      });
      // Lượt 2: phần còn lại của câu Data.js sau khi trừ các từ đã biết (vd "láo" trong "Mày láo nhỉ" ↔ 你丫挺狂啊!)
      const found = new Map();
      const runs = fl => { const r = []; let st = -1; fl.forEach((f, i) => { if (!f && st < 0) st = i; if (f && st >= 0) { r.push([st, i]); st = -1; } }); if (st >= 0) r.push([st, fl.length]); return r; };
      sd.forEach(d => {
        if (d.s.level !== 'Data') return;
        const vm = new Array(d.words.length).fill(false), hm = new Array(d.toks.length).fill(false);
        d.toks.forEach((tk, ti) => {
          if (!tk.e) return;
          const gl = new Set(); tk.e.forEach(e => { glossesOf(e).forEach(g => gl.add(norm(g))); (e._al || []).forEach(a => gl.add(a)); });
          let hit = null;
          for (let l = 3; l >= 1 && !hit; l--) for (let i = 0; i + l <= d.words.length; i++) { if (vm.slice(i, i + l).some(Boolean)) continue; if (gl.has(d.words.slice(i, i + l).join(' '))) { hit = [i, l]; break; } }
          if (hit) { for (let k = hit[0]; k < hit[0] + hit[1]; k++) vm[k] = true; hm[ti] = true; }
        });
        let vr = runs(vm).map(([a, b]) => { while (b > a && PART_V.has(d.words[b - 1])) b--; while (a < b && PART_V.has(d.words[a])) a++; return [a, b]; }).filter(([a, b]) => b > a);
        let hr = runs(hm).map(([a, b]) => { while (b > a && PART_H.has(d.toks[b - 1].t)) b--; return [a, b]; }).filter(([a, b]) => b > a);
        if (vr.length !== 1 || hr.length !== 1) return;
        const [va, vb] = vr[0], [ha, hb] = hr[0]; if (vb - va > 3 || hb - ha > 4) return;
        const vi = d.words.slice(va, vb).join(' '), tk = d.toks.slice(ha, hb), han = tk.map(t => t.t).join('');
        if (!vi || g1.has(vi) || han.length > 5) return;
        const m = found.get(vi) || found.set(vi, new Map()).get(vi), o = m.get(han) || m.set(han, { n: 0, d, s: tk[0].s }).get(han); o.n++;
      });
      found.forEach((m, vi) => {
        [...m.entries()].sort((a, b) => b[1].n - a[1].n || a[0].length - b[0].length).slice(0, 4).forEach(([han, o]) => addE(mk(han, vi, o.d, o.s)));
      });
      rk(g1); rk(g2); zh.forEach(a => a.sort((x, y) => x.rank - y.rank));
    } catch (err) { console.warn('learn', err); }
    X = { zh, g1, g2, syls, sz, sv, sl, list: ALL, map }; sig = s; return X;
  }

  const pyOf = e => clean(e.pinyin);
  function glossOf(sg) {
    const e = sg.cands[sg.sel];
    if (sg.vi && ((e._al && e._al.includes(sg.vi)) || glossesOf(e).some(g => norm(g) === sg.vi || stripDiacritics(norm(g)) === stripDiacritics(sg.vi)))) return sg.vi;
    return glossesOf(e)[0];
  }
  function compose(o) {
    let han = '', py = [], vi = [];
    o.segs.forEach(sg => {
      if (sg.lit != null) { han += sg.lit; if (sg.lit.trim()) vi.push(sg.lit.trim()); return; }
      if (sg.unk != null) { han += '[' + sg.unk + ']'; vi.push(sg.unk); return; }
      const e = sg.cands[sg.sel]; han += e.text; py.push(pyOf(e)); vi.push(glossOf(sg));
    });
    return { han, py: py.join(' '), vi: vi.join(' ') };
  }

  /* ---------- Trung → Việt ---------- */
  function segZh(text) {
    const Z = index(), ch = [...text], n = ch.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(0);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      if (!HANRE.test(ch[i])) { let j = i; while (j < n && !HANRE.test(ch[j])) j++; if (best[i] + 0.2 < best[j]) { best[j] = best[i] + 0.2; prv[j] = i; } continue; }
      for (let l = 1; l <= 14 && i + l <= n; l++) {
        const c = Z.zh.get(ch.slice(i, i + l).join(''));
        const cost = c ? 1 + 0.06 * c[0].rank - 0.12 * (l - 1) : l === 1 ? 2.5 : Infinity;
        if (best[i] + cost < best[i + l]) { best[i + l] = best[i] + cost; prv[i + l] = i; }
      }
    }
    const out = []; let p = n; while (p > 0) { const q = prv[p]; out.unshift(ch.slice(q, p).join('')); p = q; }
    return out.map(t => { const c = HANRE.test(t) ? Z.zh.get(t) : null; return c ? { cands: c, sel: 0 } : HANRE.test(t) ? { unk: t } : { lit: t }; });
  }

  /* ---------- pinyin → chữ Hán ---------- */
  function fuzzySyl(s) {
    const Z = index(), out = [];
    Z.syls.forEach((f, k) => {
      let d = Infinity;
      if (k.startsWith(s) && k.length - s.length <= 2) d = 0.8;
      else if (Math.abs(k.length - s.length) <= 1) { const l = lev(s, k); if (l <= 1) d = 1; }
      if (d < Infinity) out.push({ s: k, d, f });
    });
    return out.sort((a, b) => a.d - b.d || b.f - a.f).slice(0, 4);
  }
  function beam(syl, tones) {
    const Z = index(), n = syl.length, K = 4, best = Array.from({ length: n + 1 }, () => []);
    best[0] = [{ c: 0, segs: [] }];
    for (let i = 0; i < n; i++) {
      if (!best[i].length) continue;
      for (let l = 1; l <= 8 && i + l <= n; l++) {
        const all = Z.map.get(syl.slice(i, i + l).join('')) || [];
        const cs = all.filter(e => e.syl.length === l && e.syl.every((y, k) => y === syl[i + k]) && tones.slice(i, i + l).every((t, k) => t === null || t === undefined || (t === 5 ? 0 : t) === e.tones[k]));
        if (!cs.length) continue;
        best[i].forEach(st => best[i + l].push({ c: st.c + 1 + 0.07 * cs[0].rank, segs: st.segs.concat([{ cands: cs, sel: 0 }]) }));
        best[i + l].sort((a, b) => a.c - b.c); best[i + l].length = Math.min(best[i + l].length, K);
      }
    }
    return best[n];
  }
  function pinyinOptions(raw) {
    if (!PYRE.test(raw)) return null;
    const inp = PM().parseInput(raw); if (!inp.syl.length) return null;
    const Z = index();
    const alts = inp.syl.map(s => Z.syls.has(s) ? [{ s, d: 0 }] : fuzzySyl(s));
    if (alts.some(a => !a.length)) return { opts: [], fuzzy: false, inp };
    let vars = [{ syl: [], d: 0 }];
    alts.forEach(a => { const nv = []; vars.forEach(v => a.forEach(x => nv.push({ syl: v.syl.concat(x.s), d: v.d + x.d }))); vars = nv.sort((p, q) => p.d - q.d).slice(0, 24); });
    const seen = new Set(), opts = [];
    vars.forEach(v => beam(v.syl, inp.tones).forEach(r => {
      const o = { segs: r.segs, cost: r.c + 2 * v.d, fuzzy: v.d > 0, said: v.syl.join(' ') };
      const k = compose(o).han; if (seen.has(k)) return; seen.add(k); opts.push(o);
    }));
    opts.sort((a, b) => a.cost - b.cost);
    return { opts: opts.slice(0, 6), fuzzy: alts.some(a => a[0].d > 0), inp };
  }

  /* ---------- Việt → Trung ---------- */
  function viOptions(raw) {
    const Z = index(), words = norm(raw).split(' ').filter(Boolean); if (!words.length) return null;
    const n = words.length, best = new Array(n + 1).fill(Infinity), prv = new Array(n + 1).fill(null);
    best[0] = 0;
    const look = p => Z.g1.get(p) || (p === stripDiacritics(p) ? Z.g2.get(p) : null) || null;
    for (let i = 0; i < n; i++) {
      if (best[i] === Infinity) continue;
      for (let l = 1; l <= 10 && i + l <= n; l++) {
        const p = words.slice(i, i + l).join(' '), m = look(p); if (!m) continue;
        const c = best[i] + 1 + 0.07 * m[0].e.rank + 0.12 * m[0].pos - 0.3 * (l - 1);
        if (c < best[i + l]) { best[i + l] = c; prv[i + l] = { from: i, p, m }; }
      }
      const c = best[i] + 3; if (c < best[i + 1]) { best[i + 1] = c; prv[i + 1] = { from: i, unk: words[i] }; }
    }
    const segs = []; let p = n, hit = 0;
    while (p > 0) {
      const st = prv[p]; if (!st) break;
      if (st.unk) segs.unshift({ unk: st.unk });
      else { const seen = new Set(), cands = []; st.m.forEach(x => { if (!seen.has(x.e.text)) { seen.add(x.e.text); cands.push(x.e); } }); segs.unshift({ cands: cands.slice(0, 8), sel: 0, vi: st.p }); hit += p - st.from; }
      p = st.from;
    }
    const qk = stripDiacritics(words.join(' '));
    const related = n <= 4 && qk.length >= 2 ? Z.list.filter(e => (' ' + stripDiacritics(norm(e.meaning)) + ' ').includes(' ' + qk + ' ')).sort((a, b) => a.rank - b.rank).slice(0, 8) : [];
    return { opt: { segs }, cover: hit / n, related };
  }

  /* ---------- tổng hợp ---------- */
  function sentenceHits(raw, hasHan) {
    const Z = index(), hits = [];
    if (hasHan) {
      const k = sKey(raw), ex = Z.sz.get(k);
      if (ex) hits.push(ex);
      if (k.length >= 3) Z.sl.forEach(x => { if (hits.length < 4 && x !== ex && (sKey(x.text).includes(k) || (k.includes(sKey(x.text)) && sKey(x.text).length >= 4))) hits.push(x); });
    } else {
      const k = vKey(raw), ex = Z.sv.get(k);
      if (ex) hits.push(ex);
      if (k.length >= 6) Z.sl.forEach(x => { if (hits.length < 4 && x !== ex && (x.vk.includes(k) || (x.vk.length >= 8 && k.includes(x.vk)))) hits.push(x); });
    }
    return hits;
  }
  function translate(raw, mode) {
    raw = String(raw || '').trim(); mode = mode || 'auto';
    const out = { raw, sections: [], sentences: [] };
    if (!raw) return out;
    const hasHan = HANRE.test(raw);
    out.sentences = sentenceHits(raw, hasHan);
    if (hasHan) { out.sections.push({ title: '🇨🇳 → 🇻🇳 Trung → Việt (ghép từng từ)', cards: [{ segs: segZh(raw) }], score: 1 }); return out; }
    const secs = [], exact = out.sentences.length && vKey(out.sentences[0].meaning) === vKey(raw) && sKey(out.sentences[0].text).length >= 4;
    if (exact && mode !== 'zh') return out;
    const v = mode !== 'zh' ? viOptions(raw) : null;
    const viFull = !!v && v.cover === 1 && norm(raw).split(' ').length >= 3;
    if (mode !== 'vi' && !(mode === 'auto' && viFull)) {
      const r = pinyinOptions(raw);
      if (r && r.opts.length) secs.push({ title: '🇨🇳 → 🇻🇳 Đọc là pinyin' + (r.fuzzy ? ' (gợi ý gần đúng)' : ''), cards: r.opts, score: r.fuzzy ? 0.5 : 1, note: r.fuzzy ? 'Một số âm tiết không có trong từ điển nên app đoán âm gần nhất.' : '' });
    }
    if (v && v.cover > 0 && (mode === 'vi' || v.cover >= (secs.length ? 1 : 0.6))) secs.push({ title: '🇻🇳 → 🇨🇳 Ghép từng từ tiếng Việt', cards: [v.opt], related: v.related, score: v.cover + 0.01 });
    out.sections = secs.sort((a, b) => b.score - a.score);
    return out;
  }

  /* ---------- giao diện ---------- */
  let cssDone = false, cur = null, reg = [], mode = 'auto', timer = 0;
  function addCss() {
    if (cssDone) return; cssDone = true;
    const s = document.createElement('style');
    s.textContent = `
    .tr-in{width:100%;box-sizing:border-box;min-height:64px;resize:none;padding:10px 12px;border-radius:var(--radius-md);border:2px solid var(--border);background:var(--surface);color:var(--text);font:600 17px var(--font-body);outline:none}
    .tr-in:focus{border-color:var(--accent)}
    .tr-dir{display:flex;gap:6px;flex-wrap:wrap}
    .tr-dir button{padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font:700 12px var(--font-body);cursor:pointer}
    .tr-dir button.on{background:var(--accent);border-color:var(--accent);color:#fff}
    .tr-sec{font:800 12px var(--font-heading);color:var(--accent3);margin:6px 0 2px}
    .tr-note{font-size:11.5px;color:var(--muted);line-height:1.45}
    .tr-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:10px 12px;margin:6px 0;display:flex;flex-direction:column;gap:6px}
    .tr-main{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .tr-han{font:700 26px var(--font-hanzi);line-height:1.3;word-break:break-all}
    .tr-py{font-size:13px;color:var(--accent3);font-weight:700}
    .tr-vi{font-size:15px;font-weight:700;line-height:1.45}
    .tr-tools{margin-left:auto;display:flex;gap:6px}
    .tr-tools button{padding:4px 9px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-size:13px}
    .tr-segs{display:flex;flex-wrap:wrap;gap:6px}
    .tr-chip{display:flex;flex-direction:column;align-items:center;gap:0;padding:5px 9px;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;max-width:46%;position:relative}
    .tr-chip b{font:700 20px var(--font-hanzi);line-height:1.2}
    .tr-chip i{font-style:normal;font-size:10.5px;color:var(--accent3);font-weight:700}
    .tr-chip span{font-size:11px;color:var(--muted);max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tr-chip u{position:absolute;top:-6px;right:-4px;text-decoration:none;font-size:9px;font-weight:800;background:var(--accent);color:#fff;border-radius:99px;padding:1px 5px}
    .tr-lit{font:700 20px var(--font-hanzi);padding:5px 2px}
    .tr-unk{border-style:dashed;opacity:.75}
    .tr-alts{display:flex;flex-direction:column;gap:4px;border-top:1px dashed var(--border);padding-top:6px}
    .tr-alt{display:flex;gap:8px;align-items:baseline;padding:4px 6px;border-radius:8px;cursor:pointer;font-size:13px;text-align:left;background:transparent;border:0;color:var(--text)}
    .tr-alt.on,.tr-alt:hover{background:var(--surface)}
    .tr-alt b{font:700 18px var(--font-hanzi)} .tr-alt i{font-style:normal;color:var(--accent3);font-size:11.5px;font-weight:700} .tr-alt span{color:var(--muted);font-size:12px}
    .tr-empty{text-align:center;color:var(--muted);padding:18px 8px;font-size:13px;line-height:1.55}`;
    document.head.appendChild(s);
  }
  const chipHtml = (sg, oi, si) => {
    if (sg.lit != null) return `<span class="tr-lit">${esc(sg.lit)}</span>`;
    if (sg.unk != null) return `<span class="tr-chip tr-unk"><b style="font-family:var(--font-body);font-size:15px">${esc(sg.unk)}</b><span>chưa có trong từ điển</span></span>`;
    const e = sg.cands[sg.sel];
    return `<button type="button" class="tr-chip" data-a="chip" data-o="${oi}" data-s="${si}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(glossOf(sg))}</span>${sg.cands.length > 1 ? `<u>⇅${sg.cands.length}</u>` : ''}</button>`;
  };
  function cardHtml(o, oi) {
    const c = compose(o), real = o.segs.filter(s => s.cands);
    let h = `<div class="tr-card" data-o="${oi}"><div class="tr-main"><span class="tr-han">${esc(c.han)}</span><span class="tr-py">${esc(c.py)}</span><span class="tr-tools"><button type="button" data-a="say" data-o="${oi}" title="Nghe">🔊</button><button type="button" data-a="copy" data-o="${oi}" title="Sao chép chữ Hán">📋</button></span></div>`;
    h += `<div class="tr-vi">${esc(c.vi)}</div>`;
    if (o.said && o.fuzzy) h += `<div class="tr-note">Đoán âm: ${esc(o.said)}</div>`;
    h += `<div class="tr-segs">${o.segs.map((s, si) => chipHtml(s, oi, si)).join('')}</div>`;
    o.segs.forEach(sg => { if (sg.cands) { const e = sg.cands[sg.sel]; if (e.learned) h += `<div class="tr-note">🧠 Tự học “${esc(e.meaning)}” = ${esc(e.text)} từ câu: ${esc(e.learned)}</div>`; } });
    if (real.length === 1 && real[0].cands.length > 1) {
      const si = o.segs.indexOf(real[0]);
      h += `<div class="tr-alts">${real[0].cands.slice(0, 8).map((e, k) => `<button type="button" class="tr-alt ${k === real[0].sel ? 'on' : ''}" data-a="alt" data-o="${oi}" data-s="${si}" data-k="${k}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(e.meaning)}${e.level && e.level !== 'Data' ? ' · ' + esc(e.level) : ''}</span></button>`).join('')}</div>`;
    }
    return h + '</div>';
  }
  function render() {
    const box = $('tr-out'); if (!box) return;
    reg = [];
    if (!cur || !cur.raw) { box.innerHTML = '<div class="tr-empty">Gõ <b>tiếng Việt</b> (“cảm ơn”), <b>chữ Hán</b> (你好吗) hoặc <b>pinyin</b> (nihao · ni3 hao3 · wo ai ni).<br>App ghép các từ trong toàn bộ từ điển (HSK 1–6 + Data) thành từ / cụm có nghĩa. Chạm vào một ô từ để đổi nghĩa khác.</div>'; return; }
    let h = '', hs = '';
    if (cur.sentences.length) hs = `<div class="tr-sec">📖 Câu có sẵn trong dữ liệu (Data.js / HSK)</div>` + cur.sentences.map(s => `<div class="tr-card"><div class="tr-main"><span class="tr-han" style="font-size:20px">${esc(s.text)}</span><span class="tr-tools"><button type="button" data-a="say1" data-t="${esc(s.text)}">🔊</button></span></div><div class="tr-py">${esc(s.pinyin)}</div><div class="tr-vi" style="font-size:14px">${esc(s.meaning)}</div></div>`).join('');
    h = hs;
    cur.sections.forEach(sec => {
      h += `<div class="tr-sec">${esc(sec.title)}</div>`;
      if (sec.note) h += `<div class="tr-note">${esc(sec.note)}</div>`;
      sec.cards.forEach(o => { reg.push(o); h += cardHtml(o, reg.length - 1); });
      if (sec.related && sec.related.length) h += `<div class="tr-sec">📚 Từ liên quan</div><div class="tr-card">${sec.related.map(e => `<button type="button" class="tr-alt" data-a="say1" data-t="${esc(e.text)}"><b>${esc(e.text)}</b><i>${esc(pyOf(e))}</i><span>${esc(e.meaning)}</span></button>`).join('')}</div>`;
    });
    if (!cur.sections.length && !cur.sentences.length) h = `<div class="tr-empty">Không tìm thấy kết quả cho “${esc(cur.raw)}”.<br>Thử gõ pinyin đúng chính tả (ni3 hao3), tiếng Việt có dấu, hoặc chọn hướng dịch ở trên.</div>`;
    box.innerHTML = h + '<div class="tr-note" style="margin-top:6px">⚠️ Đây là tra & ghép từ theo từ điển trong máy (dịch từng từ), không phải dịch máy hoàn chỉnh — trật tự câu tiếng Việt có thể cần chỉnh lại.</div>';
  }
  function run() {
    const v = $('tr-in') ? $('tr-in').value : '';
    try { cur = translate(v, mode); } catch (e) { cur = { raw: v, sections: [], sentences: [] }; console.warn('translate', e); }
    render();
  }
  function say(t) { if (typeof speakChinese !== 'function') return; if (typeof zhVoice !== 'undefined' && !zhVoice && typeof loadVoices === 'function') loadVoices(); speakChinese(t); }
  function mount(root) {
    addCss(); mode = 'auto';
    root.innerHTML = `<textarea class="tr-in" id="tr-in" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Gõ tiếng Việt, chữ Hán hoặc pinyin… (vd: hao do · xin chào · 你好吗)"></textarea>
      <div class="tr-dir" id="tr-dir"><button type="button" data-m="auto" class="on">🔄 Tự nhận</button><button type="button" data-m="vi">🇻🇳 → 🇨🇳 Việt → Trung</button><button type="button" data-m="zh">🇨🇳 → 🇻🇳 Trung / pinyin → Việt</button><button type="button" data-m="clear">✕ Xoá</button></div>
      <div id="tr-out"></div>`;
    $('tr-in').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 140); });
    $('tr-dir').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.m === 'clear') { $('tr-in').value = ''; cur = null; render(); $('tr-in').focus(); return; }
      mode = b.dataset.m; $('tr-dir').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); run();
    });
    $('tr-out').addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a, o = reg[Number(b.dataset.o)];
      if (a === 'say1') { say(b.dataset.t); return; }
      if (!o) return;
      if (a === 'chip') { const sg = o.segs[Number(b.dataset.s)]; sg.sel = (sg.sel + 1) % sg.cands.length; }
      else if (a === 'alt') { o.segs[Number(b.dataset.s)].sel = Number(b.dataset.k); }
      else if (a === 'say') { say(compose(o).han.replace(/[\[\]]/g, '')); return; }
      else if (a === 'copy') { try { navigator.clipboard.writeText(compose(o).han); if (typeof showToast === 'function') showToast('📋 Đã sao chép'); } catch (x) {} return; }
      const keep = $('tr-out').scrollTop; const html = cardHtml(o, Number(b.dataset.o)), card = $('tr-out').querySelector(`.tr-card[data-o="${b.dataset.o}"]`);
      if (card) { const t = document.createElement('div'); t.innerHTML = html; card.replaceWith(t.firstChild); }
      $('tr-out').scrollTop = keep;
    });
    render();
    setTimeout(() => { try { $('tr-in').focus({ preventScroll: true }); } catch (e) {} }, 60);
  }
  window.Translator = { mount, translate, compose, segZh, pinyinOptions, viOptions, _index: index };
})();

/* ============================================================
   12. Trung tâm Luyện thêm
   ============================================================ */
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

  function quizPool(sc) {
    const all = typeof hskAll !== 'undefined' ? hskAll : [];
    if (sc === 'SLANG') return (window.dictWords || []).filter(w => w.meaning && w.meaning.trim());
    if (sc === 'ALL') return all;
    if (sc.startsWith('topic:')) { const tp = topicOf(sc.slice(6)); return tp ? all.filter(w => w.meaning && tp.re.test(w.meaning)) : []; }
    return all.filter(w => w.level === sc);
  }
  function openQuizPanel() {
    const cs = 'padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:700 13px var(--font-body)';
    const sv = safeStorage.get('cn_quiz_hsk_range') || { a: 1, b: 2, n: 20 };
    const num = (v, c) => `<option value="${v}" ${v === c ? 'selected' : ''}>${v}</option>`;
    const cnt = `<select id="qz-n" style="${cs}">${[10, 20, 30, 40].map(v => `<option value="${v}" ${v === sv.n ? 'selected' : ''}>${v} câu</option>`).join('')}</select>`;
    subPanel('🚀 Trắc nghiệm (như Đấu trí)', `
      <div class="hub-card hub-sub-body">Cùng kiểu câu hỏi như Đấu trí: Hán → nghĩa, nghĩa → Hán, pinyin, điền từ, nghĩa cả câu; đáp án nhiễu cùng cấp, không trùng nghĩa.</div>
      <div class="hub-card hub-sub-body"><b class="k">📐 Theo khoảng HSK</b><br>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0">Từ <select id="qz-a" style="${cs}">${[1,2,3,4,5,6].map(v => num(v, sv.a)).join('')}</select> đến <select id="qz-b" style="${cs}">${[1,2,3,4,5,6].map(v => num(v, sv.b)).join('')}</select> ${cnt}</div>
        <button class="hub-btn" id="qz-range" style="width:100%">▶ Bắt đầu theo khoảng HSK</button></div>
      <div class="hub-card hub-sub-body"><b class="k">🎯 Theo phạm vi đang chọn</b><br>${esc(scopeLabel(scope))} · ${quizPool(scope).length} từ
        <button class="hub-btn" id="qz-scope" style="width:100%;margin-top:8px">▶ Bắt đầu</button></div>`);
    const n = () => Number($('qz-n').value) || 20;
    $('qz-range').onclick = () => {
      let a = Number($('qz-a').value), b = Number($('qz-b').value); if (a > b) [a, b] = [b, a];
      safeStorage.set('cn_quiz_hsk_range', { a, b, n: n() });
      if (hskPoolSafe('range:' + a + '-' + b) < 4) { toastMsg('Chưa đủ dữ liệu HSK ' + a + '-' + b); return; }
      runHSKQuiz('range:' + a + '-' + b, n());
    };
    $('qz-scope').onclick = () => runPoolQuiz(quizPool(scope), scopeLabel(scope), n());
  }
  const hskPoolSafe = lv => { try { return hskPool(lv).length; } catch (e) { return 0; } };

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
        <button class="hub-btn" data-d="trans" style="grid-column:1/-1">🌐 Dịch Việt ⇄ Trung<small>gõ tiếng Việt · chữ Hán · pinyin (hao do, nihao…) → ghép từ có nghĩa</small></button>
        <button class="hub-btn" data-d="quiz">🚀 Trắc nghiệm<small>như Đấu trí · chọn phạm vi</small></button>
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
      else if (k === 'quiz') openQuizPanel();
      else if (k === 'trans') { subPanel('🌐 Dịch Việt ⇄ Trung', '<div id="tr-root" style="display:flex;flex-direction:column;gap:8px"></div>'); window.Translator.mount($('tr-root')); }
      else if (k === 'validate') openValidator();
      else if (k === 'preload') openPreload();
    });
  }

  window.PracticeHub = { open: openHub, build, _data: data, _run: () => run, _polyQ: polyQuestions, _homoQ: homoQuestions, _validate: validate, toMarks, TOPICS, setScope: s => { scope = s; } };
})();

/* ============================================================
   13. Gắn sự kiện cho HTML (HTML chỉ chứa data-click / data-input / data-change)
   ============================================================ */
(function () {
  function resolve(tok, el, ev) {
    if (tok === '@this') return el;
    if (tok === '@value') return el.value;
    if (tok === '@checked') return el.checked;
    if (tok === '@event') return ev;
    if (tok.indexOf('@fn:') === 0) return window[tok.slice(4)];
    if (tok === 'true') return true;
    if (tok === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(tok)) return Number(tok);
    return tok;
  }
  function dispatch(type, ev) {
    const el = ev.target.closest && ev.target.closest('[data-' + type + ']');
    if (!el) return;
    const name = el.getAttribute('data-' + type);
    if (name.indexOf('@click:') === 0) { const t = document.getElementById(name.slice(7)); if (t) t.click(); return; }
    const fn = window[name];
    if (typeof fn !== 'function') { console.warn('Chưa có hàm', name); return; }
    const raw = el.getAttribute('data-args');
    fn.apply(null, raw ? raw.split('|').map(t => resolve(t, el, ev)) : []);
  }
  ['click', 'input', 'change'].forEach(type => document.addEventListener(type, ev => dispatch(type, ev)));
})();
