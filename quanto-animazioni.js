/* Quanto — animazioni didattiche (motion graphics in SVG, guidate da un tempo t ∈ [0,1]).
   Il lettore e il meccanismo di Compasso, senza le sue 22 animazioni di matematica: in fisica le cose che si
   muovono stanno nei video (quanto-video.js). Se serve un'animazione corta dentro la teoria, si aggiunge qui.
   Ogni animazione: ANIM.<nome> = { W, H, durata (ms), fasi: [[t0, 'didascalia'], ...], disegna(svg, t) }.
   Nel testo: [[animazione:<nome>]] da solo sulla riga. Espone window.CANIM = { render, nomi, ANIM }. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function el(n, a, f) { const e = document.createElementNS(NS, n); if (a) for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]); if (f) (Array.isArray(f) ? f : [f]).forEach(x => { if (x != null) e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); }); return e; }
  /* attrezzi per chi scrive un'animazione nuova (come in Compasso) */
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const f = (t, a, b) => ease((t - a) / (b - a));           /* avanzamento di una fase */
  const S = [1, 2, 3, 4].map(i => 'var(--s' + i + ')');
  const T = 'var(--g-testo)', SF = 'var(--g-sfondo)', AS = 'var(--g-asse)', GR = 'var(--g-griglia)';
  const L = (svg, x1, y1, x2, y2, attr) => svg.appendChild(el('line', Object.assign({ x1, y1, x2, y2, stroke: AS, 'stroke-width': 1.5 }, attr)));
  const C = (svg, cx, cy, r, attr) => svg.appendChild(el('circle', Object.assign({ cx, cy, r }, attr)));
  const X = (svg, x, y, s, attr) => svg.appendChild(el('text', Object.assign({ x, y, class: 'cg-etichetta', 'text-anchor': 'middle' }, attr), s));
  const fmt = (n, d) => String(Number(n.toFixed(d == null ? 2 : d))).replace('.', ',');
  const attrezzi = { el, lerp, clamp, ease, f, S, T, SF, AS, GR, L, C, X, fmt };

  const ANIM = {};

  /* ===================== LETTORE ===================== */
  const nomi = () => Object.keys(ANIM);
  function render(spec, wrap) {
    const A = ANIM[spec.nome];
    if (!A) { wrap.textContent = 'Animazione sconosciuta: ' + spec.nome; return; }
    const svg = el('svg', { viewBox: '0 0 ' + A.W + ' ' + A.H, class: 'cg-svg cg-anim-svg', role: 'img', 'aria-label': spec.didascalia || spec.nome });
    wrap.appendChild(svg);
    const ctrl = document.createElement('div'); ctrl.className = 'cg-anim-ctrl';
    ctrl.innerHTML = '<button type="button" class="cg-anim-play" aria-label="Avvia">▶</button><button type="button" class="cg-anim-replay" aria-label="Ricomincia">↺</button><input type="range" min="0" max="1000" value="0" aria-label="Avanzamento"><span class="cg-anim-fase"></span>';
    wrap.appendChild(ctrl);
    const play = ctrl.querySelector('.cg-anim-play'), range = ctrl.querySelector('input'), fase = ctrl.querySelector('.cg-anim-fase');
    let t = 0, inCorso = false, ultimo = 0, giaPartita = false;
    function didascalia() { let s = ''; (A.fasi || []).forEach(([t0, testo]) => { if (t >= t0) s = testo; }); return s; }
    /* sul telefono il disegno largo 600 si rimpicciolisce: le scritte si ingrandiscono in proporzione */
    function scalaTesti() {
      const w = svg.clientWidth; if (!w || w >= 470) return;
      const k = Math.min(1.45, 440 / w);
      svg.querySelectorAll('text').forEach(tx => { const fs = parseFloat(tx.getAttribute('font-size')) || 13; tx.setAttribute('font-size', (fs * k).toFixed(1)); tx.style.fontSize = (fs * k).toFixed(1) + 'px'; });
    }
    function disegna() { while (svg.firstChild) svg.removeChild(svg.firstChild); A.disegna(svg, t); scalaTesti(); range.value = Math.round(t * 1000); fase.textContent = didascalia(); play.textContent = inCorso ? '❚❚' : (t >= 1 ? '↺' : '▶'); }
    function ciclo(ts) { if (!inCorso) return; t = Math.min(1, t + (ts - ultimo) / (A.durata || 7000)); ultimo = ts; disegna(); if (t >= 1) { inCorso = false; disegna(); return; } requestAnimationFrame(ciclo); }
    function avvia() { if (t >= 1) t = 0; inCorso = true; giaPartita = true; ultimo = performance.now(); requestAnimationFrame(ciclo); disegna(); }
    function ferma() { inCorso = false; disegna(); }
    play.addEventListener('click', () => inCorso ? ferma() : avvia());
    ctrl.querySelector('.cg-anim-replay').addEventListener('click', () => { t = 0; avvia(); });
    range.addEventListener('input', () => { inCorso = false; t = range.value / 1000; disegna(); });
    svg.addEventListener('click', () => inCorso ? ferma() : avvia());
    disegna();
    if (spec.autoplay !== false && 'IntersectionObserver' in window) {
      const oss = new IntersectionObserver(e => { if (e[0].isIntersecting && !giaPartita) { setTimeout(() => { if (!giaPartita && document.body.contains(svg)) avvia(); }, 400); oss.disconnect(); } }, { threshold: 0.5 });
      oss.observe(svg);
    }
  }

  const api = { render, nomi, ANIM, attrezzi };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.CANIM = api;
})();
