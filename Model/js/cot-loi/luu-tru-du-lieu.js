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
