

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
