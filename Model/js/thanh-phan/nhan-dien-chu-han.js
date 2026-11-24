

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
