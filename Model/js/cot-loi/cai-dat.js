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

