/* Il Compasso di fisica — i video: brevi lezioni animate su canvas, raccontate da Stilla (la goccia).
   Motore preso da Compasso (compasso-video.js): stessa tela, stessi strumenti; al posto di Ada c'è Stilla.
   Ogni fotogramma è una funzione pura del tempo: il lettore va in tempo reale, l'esportazione
   (strumenti/video.html?render) cattura fotogrammi esatti per gli MP4.
   Un video sta in video/<argomento>/<nome>.js e si registra con CVIDEO.registra('<argomento>/<nome>', M => {...}).
   Nel testo di un argomento si cita con [[video:<argomento>/<nome>]]. Contratto in SCHEMA-VIDEO.md. */
(function () {
  'use strict';

const W = 1920, H = 1080, TAU = Math.PI * 2;
// i colori seguono il tema del sito; C si riempie a ogni fotogramma con quello giusto
const TEMI = {
  chiaro: {
    ink: '#1a1f2d', dim: '#6b7183', x: '#2a78d6', y: '#eb6834', v: '#6a3fd1', g: '#178a3a', r: '#c63636',
    grid: '#ebe6da', paper: '#fffdf8', panel: 'rgba(255,253,248,0.97)', panelEdge: '#d2cab9',
    bg: '#f5f2ea', quad: 'rgba(43,80,216,0.07)', vign: 'rgba(90,70,30,0.10)', ombra: 'rgba(30,30,50,.16)',
    bolla: '#fffdf8', chip: '#fffdf8', glow: .3,
  },
  scuro: {
    ink: '#e9ece6', dim: '#a8b1ad', x: '#5fa0f0', y: '#f5895c', v: '#b196ff', g: '#52cf78', r: '#ff7f7f',
    grid: '#29333a', paper: '#1a2225', panel: 'rgba(26,34,37,0.97)', panelEdge: '#37424a',
    bg: '#131a1c', quad: 'rgba(255,255,255,0.03)', vign: 'rgba(0,0,0,0.28)', ombra: 'rgba(0,0,0,.5)',
    bolla: '#20292c', chip: '#131a1c', glow: .55,
  },
};
const C = Object.assign({}, TEMI.chiaro);
let FONT = 'Lexend, "Segoe UI", sans-serif';
const TITOLI = 'Fraunces, Georgia, serif';
// la matematica con i font di KaTeX, che il sito ha già (Cambria sui telefoni non c'è)
const MATH = '"KaTeX_Main", Cambria, Georgia, serif';
const MATH_I = '"KaTeX_Math", Cambria, Georgia, serif';
let GLOW = .3;   // intensità degli aloni
let SK = 1;      // le ombre sono in pixel veri: si scalano con la tela
function conFont(font, fn) { const old = FONT; FONT = font; try { fn(); } finally { FONT = old; } }

// ---------- tempo ed easing ----------
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  out: t => 1 - (1 - t) ** 3,
  in: t => t ** 3,
  io: t => t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; },
};
const P = (t, a, b, e = E.io) => e(clamp((t - a) / (b - a)));
// dissolvenza in entrata ad a, in uscita a b
const life = (t, a, b, fi = .45, fo = .45) => Math.min(P(t, a, a + fi, E.out), 1 - P(t, b - fo, b, E.io));
// valore interpolato fra fotogrammi chiave [[t, v], ...]
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], P(t, keys[i - 1][0], keys[i][0]));
  }
  return keys[keys.length - 1][1];
}

// ---------- colori ----------
function rgb(c) { if (Array.isArray(c)) return c; const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function css(c, a = 1) { c = rgb(c); return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; }
function mix(a, b, t) { a = rgb(a); b = rgb(b); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function shade(c, k) { return k >= 0 ? mix(c, [255, 255, 255], k) : mix(c, [0, 0, 0], -k); }

// ---------- testo ricco ----------
// "{x:parola}" colora, "{mx:f(x)}" scrive in carattere matematico (lettere in corsivo).
function parseRich(str) {
  const runs = [], re = /\{(m?)([a-z]+):([^}]*)\}/g; let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) runs.push({ text: str.slice(last, m.index), key: 'ink', math: false });
    runs.push({ text: m[3], key: m[2], math: m[1] === 'm' });
    last = re.lastIndex;
  }
  if (last < str.length) runs.push({ text: str.slice(last), key: 'ink', math: false });
  return runs;
}
const pieceCache = new Map();
const SU = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '−', '⁺': '+', 'ⁿ': 'n', 'ˣ': 'x' };
const GIU = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n' };
function pieces(ctx, str, size, weight) {
  const key = str + '|' + size + '|' + weight + '|' + FONT;
  if (pieceCache.has(key)) return pieceCache.get(key);
  const out = []; let word = 0;
  for (const run of parseRich(str)) {
    // i nomi delle funzioni (sin, cos, log, lim…) restano dritti, come in KaTeX; le variabili in corsivo
    const chars = Array.from(run.text), dritto = new Array(chars.length).fill(false);
    if (run.math) {
      const re = /arcsin|arccos|arctan|sinh|cosh|sen|sin|cos|cotg|cot|tan|tg|log|ln|lim|max|min|exp|det|mod/g; let m;
      const piatto = chars.join('');
      while ((m = re.exec(piatto))) for (let j = 0; j < m[0].length; j++) dritto[m.index + j] = true;
    }
    for (let ci = 0; ci < chars.length; ci++) {
      const ch = chars[ci];
      // lettere latine e greche minuscole in corsivo, come le scrive KaTeX nel sito (α, σ, μ, π…)
      const it = run.math && /[a-zA-Zα-ω]/.test(ch) && !dritto[ci];
      const font = run.math ? (it ? `italic ${Math.round(size * 1.12)}px ${MATH_I}` : `${Math.round(size * 1.12)}px ${MATH}`) : `${weight} ${size}px ${FONT}`;
      const key = run.key in C ? run.key : 'ink';
      // l'apice (f′) nel font di KaTeX è un segno grande da usare rimpicciolito e alzato, come fa KaTeX
      if (run.math && ch === '′') { out.push({ s: ch, font: `${Math.round(size * .8)}px ${MATH}`, key, word, dy: -size * .3, pad: size * .07 }); continue; }
      // esponenti e pedici (x², f⁻¹, a₁): KaTeX non ha questi segni; si scrivono cifre piccole alzate o abbassate
      let s = ch, f = font, dy = 0, barra = false;
      if (run.math && (SU[ch] || GIU[ch])) {
        // dentro un testo già piccolo (il pedice di un lim) l'esponente non si rimpicciolisce ancora: il ⁺/⁻ deve leggersi
        const fs = size < 40 ? .95 : .76;
        s = SU[ch] || GIU[ch]; dy = SU[ch] ? -size * (size < 40 ? .26 : .33) : size * .26;
        f = /[a-zα-ω]/.test(s) ? `italic ${Math.round(size * fs)}px ${MATH_I}` : `${Math.round(size * fs)}px ${MATH}`;
      }
      if (run.math && ch === '≠') { s = '='; barra = true; }   // ≠ = uguale barrato, come lo disegna KaTeX
      const last = out[out.length - 1];
      if (!barra && last && !last.barra && (last.dy || 0) === dy && last.dy !== -size * .3 && last.font === f && last.key === key && last.word === word) last.s += s;
      else out.push({ s, font: f, key, word, dy, barra });
      if (ch === ' ') word++;
    }
  }
  for (const p of out) { ctx.font = p.font; p.w = ctx.measureText(p.s).width + (p.pad || 0); }
  pieceCache.set(key, out);
  return out;
}
function drawRich(ctx, str, x, y, o = {}) {
  const size = o.size || 48, weight = o.weight || 500, align = o.align || 'center';
  const alpha = (o.alpha != null ? o.alpha : 1), local = (o.local != null ? o.local : 99), st = (o.stagger != null ? o.stagger : 0.055), rise = (o.rise != null ? o.rise : 18);
  const lh = (o.lh || 1.3) * size;
  if (alpha <= 0.002) return;
  const lines = str.split('\n'); let wbase = 0;
  const y0 = y - (lines.length - 1) * lh / 2;
  lines.forEach((line, li) => {
    const ps = pieces(ctx, line, size, weight);
    const tw = ps.reduce((s, p) => s + p.w, 0);
    let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    const ly = y0 + li * lh; let maxw = 0;
    for (const p of ps) {
      maxw = Math.max(maxw, p.word);
      const k = E.out(clamp((local - (p.word + wbase) * st) / 0.4));
      if (k > 0) {
        ctx.save();
        ctx.globalAlpha *= alpha * k;
        ctx.font = p.font; ctx.fillStyle = o.fill || css(C[p.key]);
        ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        ctx.fillText(p.s, cx + (p.pad || 0), ly + (1 - k) * rise + (p.dy || 0));
        if (p.barra) {
          const yy = ly + (1 - k) * rise;
          ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, size * .055); ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(cx + p.w * .32, yy + size * .3); ctx.lineTo(cx + p.w * .68, yy - size * .3); ctx.stroke();
        }
        ctx.restore();
      }
      cx += p.w;
    }
    wbase += maxw + 1;
  });
}
function txt(ctx, s, x, y, o = {}) {
  const { size = 40, weight = 500, color = C.ink, align = 'center', alpha = 1 } = o;
  if (alpha <= 0.002) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = css(color);
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y); ctx.restore();
}
// numeri a larghezza fissa (le cifre non ballano mentre cambiano)
function fixedNum(ctx, str, xr, y, size, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = css(color);
  ctx.font = `500 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let x = xr;
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str[i], cw = ch === ',' ? size * .3 : size * .62;
    x -= cw; ctx.fillText(ch, x + cw / 2, y);
  }
  ctx.restore();
}
const fmt = v => (v < -0.004 ? '−' : '') + Math.abs(v).toFixed(2).replace('.', ',');

// ---------- forme ----------
function partial(ctx, pts, k) {
  // disegna la frazione k di una spezzata; restituisce [punto finale, angolo]
  if (k <= 0 || pts.length < 2) return null;
  let total = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let left = total * clamp(k);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  let end = pts[0], ang = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]; ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    if (left >= seg[i - 1]) { ctx.lineTo(b[0], b[1]); left -= seg[i - 1]; end = b; }
    else { const f = seg[i - 1] ? left / seg[i - 1] : 0; end = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; ctx.lineTo(end[0], end[1]); break; }
  }
  ctx.stroke();
  return [end, ang];
}
function ball(ctx, x, y, label, color, o = {}) {
  const r = o.r || 46, s = (o.scale != null ? o.scale : 1), al = (o.alpha != null ? o.alpha : 1);
  if (s <= 0.003 || al <= 0.003) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = css(color, .7); ctx.shadowBlur = 34 * GLOW * SK;
  ctx.fillStyle = css(color); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  const g = ctx.createRadialGradient(-r * .35, -r * .45, r * .05, 0, 0, r);
  g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(.6, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#10132b'; ctx.font = `600 ${label.length > 2 ? r * .8 : r * .95}px ${FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, r * .05);
  ctx.restore();
}
function gear(ctx, x, y, r, n, ang, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = css(col); ctx.beginPath();
  for (let i = 0; i < n * 2; i++) ctx.arc(0, 0, i % 2 ? r * .8 : r, i / (n * 2) * TAU, (i + 1) / (n * 2) * TAU);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(shade(col, -.45)); ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, TAU); ctx.fill();
  ctx.restore();
}
function machine(ctx, cx, cy, o = {}) {
  const w = o.w || 380, h = o.h || 280, col = rgb(o.color || C.v), sc = (o.scale != null ? o.scale : 1), al = (o.alpha != null ? o.alpha : 1);
  if (sc <= 0.003 || al <= 0.003) return;
  const t = o.t || 0, sh = o.shake || 0, glow = o.glow || 0, spin = o.spin || 0;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.translate(cx + Math.sin(t * 83) * 8 * sh, cy + Math.cos(t * 67) * 5 * sh); ctx.scale(sc, sc);
  gear(ctx, -w * .2, -h / 2 + 4, 54, 9, spin, shade(col, -.35));
  gear(ctx, w * .15, -h / 2 - 8, 72, 11, -spin * .82 + .2, shade(col, -.18));
  ctx.fillStyle = css(shade(col, -.3));
  // tubo d'ingresso e tubo d'uscita, con la bocchetta
  for (const sd of [-1, 1]) {
    ctx.fillStyle = css(shade(col, -.3));
    ctx.fillRect(sd < 0 ? -w / 2 - 80 : w / 2 - 6, -40, 86, 80);
    ctx.fillStyle = css(shade(col, -.12));
    ctx.beginPath(); ctx.roundRect(sd * (w / 2 + 92) - 13, -60, 26, 120, 10); ctx.fill();
    ctx.fillStyle = 'rgba(8,10,28,0.5)';
    ctx.fillRect(sd < 0 ? -w / 2 - 80 : w / 2 - 6, 26, 86, 14);
  }
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  g.addColorStop(0, css(shade(col, .2))); g.addColorStop(1, css(shade(col, -.25)));
  ctx.save(); ctx.shadowColor = css(col, .45 + .45 * glow); ctx.shadowBlur = (40 + 80 * glow) * GLOW * SK;
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 34); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgba(8,10,28,0.62)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 28, -h / 2 + 28, w - 56, h - 100, 22); ctx.fill();
  const ly = -h / 2 + 28 + (h - 100) / 2;
  if (o.label) drawRich(ctx, o.label, 0, ly, { size: o.labelSize || 104, alpha: (o.labelAlpha != null ? o.labelAlpha : 1) });
  if (o.label2) drawRich(ctx, o.label2, 0, ly, { size: o.labelSize || 104, alpha: (o.label2Alpha != null ? o.label2Alpha : 0) });
  for (let i = 0; i < 3; i++) {
    const on = glow > .05 && ((Math.floor(t * 9) + i) % 3 === 0);
    ctx.fillStyle = on ? css(C.g) : css(shade(col, -.5));
    ctx.beginPath(); ctx.arc(-44 + i * 44, h / 2 - 36, 9, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
function checkMark(ctx, x, y, k, color, s = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(color); ctx.shadowColor = css(color, .7); ctx.shadowBlur = 24 * GLOW * SK;
  ctx.beginPath(); ctx.arc(0, 0, 78, -Math.PI / 2, -Math.PI / 2 + TAU * P(k, 0, .55, E.out)); ctx.stroke();
  partial(ctx, [[-34, 2], [-8, 28], [38, -26]], P(k, .4, 1, E.out));
  ctx.restore();
}
function crossMark(ctx, x, y, k, color, s = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.strokeStyle = css(color); ctx.shadowColor = css(color, .7); ctx.shadowBlur = 24 * GLOW * SK;
  ctx.beginPath(); ctx.arc(0, 0, 78, -Math.PI / 2, -Math.PI / 2 + TAU * P(k, 0, .55, E.out)); ctx.stroke();
  partial(ctx, [[-28, -28], [28, 28]], P(k, .4, .72, E.out));
  partial(ctx, [[28, -28], [-28, 28]], P(k, .66, 1, E.out));
  ctx.restore();
}

// ---------- palline che attraversano la macchina ----------
function runTimes(R) { const a = R.t0, b = a + 1.0 * R.d, c = b + .7 * R.d, e = c + .8 * R.d; return { a, b, c, e }; }
function drawRunIn(ctx, t, R, M) {
  const T = runTimes(R), mouth = [M.cx - M.w / 2 - 95, M.cy];
  if (t < T.a - .35 || t >= T.b) return;
  const k = P(t, T.a, T.b, E.io);
  const s = (1 - P(t, T.b - .28 * R.d, T.b, E.in)) * P(t, T.a - .35, T.a, E.back);
  ball(ctx, lerp(R.from[0], mouth[0], k), lerp(R.from[1], mouth[1], k), R.inp, C.x, { scale: s });
}
function drawRunOut(ctx, t, R, M) {
  const T = runTimes(R), exit = [M.cx + M.w / 2 + 92, M.cy];
  if (t < T.c) return;
  for (const O of R.outs) {
    const k = P(t, T.c, T.e, E.out);
    let x = lerp(exit[0], O.to[0], k), y = lerp(exit[1], O.to[1], k);
    let s = P(t, T.c, T.c + .4 * R.d, E.back);
    if (O.fly) {
      const f = P(t, O.fly.t, O.fly.t + .7, E.io);
      x = lerp(x, O.fly.to[0], f); y = lerp(y, O.fly.to[1], f); s = lerp(s, O.fly.s, f);
    }
    const al = O.fade ? 1 - P(t, O.fade, O.fade + .4) : 1;
    ball(ctx, x, y, O.label, O.color || C.y, { scale: s, alpha: al });
  }
}
function machineFx(t, runs) {
  let spin = t * .6, glow = 0, shake = 0;
  for (const R of runs) {
    const T = runTimes(R);
    spin += P(t, T.b, T.c, E.io) * TAU * .8;
    const q = clamp((t - T.b) / (T.c - T.b));
    if (q > 0 && q < 1) { const b = Math.sin(q * Math.PI); glow = Math.max(glow, b); shake = Math.max(shake, b * ((R.shake != null ? R.shake : .35))); }
  }
  return { spin, glow, shake };
}


// ---------- frecce e tratti ----------
function arrowHead(ctx, p, ang, col, s = 1) {
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.scale(s, s); ctx.fillStyle = css(col);
  ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-16, -10); ctx.lineTo(-11, 0); ctx.lineTo(-16, 10); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function glowStroke(ctx, pts, k, col, w = 6) {
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = css(col, .7); ctx.shadowBlur = 22 * GLOW * SK; const e = partial(ctx, pts, k); ctx.restore(); return e;
}
function dashed(ctx, a, b, col, k = 1, al = 1) {
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col, .85); ctx.lineWidth = 3; ctx.setLineDash([9, 9]);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); ctx.restore();
}
function dot(ctx, p, col, s = 1, r = 13) { ball(ctx, p[0], p[1], '', col, { r, scale: s }); }

// ---------- formule, piani cartesiani, pannelli ----------
function richW(ctx, str, size, weight = 500) { return pieces(ctx, str, size, weight).reduce((s, p) => s + p.w, 0); }
// sequenza in riga di testi, frazioni e lim, centrata in cx: items = ['{mink:f(x) = }', {num, den}, {lim: '{mx:h}{mink:→0}'}, ...]
function drawSeq(ctx, items, cx, cy, size, o = {}) {
  const al = (o.alpha != null ? o.alpha : 1); if (al <= 0.002) return;
  const local = (o.local != null ? o.local : 99), gap = size * .12;
  const limW = () => { ctx.font = `${Math.round(size * 1.12)}px ${MATH}`; return ctx.measureText('lim').width; };
  const ws = items.map(it => typeof it === 'string' ? richW(ctx, it, size) : it.lim ? limW() + size * .4 : Math.max(richW(ctx, it.num, size), richW(ctx, it.den, size)) + size * .35);
  const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = cx - total / 2;
  items.forEach((it, i) => {
    const k = P(local, i * .3, i * .3 + .5, E.out);
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= al * k; ctx.translate(0, (1 - k) * 16);
      if (typeof it === 'string') drawRich(ctx, it, x, cy, { size, align: 'left' });
      else if (it.lim) {
        ctx.font = `${Math.round(size * 1.12)}px ${MATH}`; ctx.fillStyle = css(C.ink); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        ctx.fillText('lim', x + size * .15, cy);
        drawRich(ctx, it.lim, x + size * .15 + (ws[i] - size * .4) / 2, cy + size * .72, { size: Math.round(size * .55) });
      } else {
        const m = x + ws[i] / 2;
        drawRich(ctx, it.num, m, cy - size * .6, { size });
        drawRich(ctx, it.den, m, cy + size * (/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿˣ′]/.test(it.den) ? .8 : .66), { size });   // un esponente al denominatore non deve toccare la linea
        ctx.strokeStyle = css(it.bar || C.ink); ctx.lineWidth = Math.max(2, size * .055); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + size * .08, cy + size * .04); ctx.lineTo(x + ws[i] - size * .08, cy + size * .04); ctx.stroke();
      }
      ctx.restore();
    }
    x += ws[i] + gap;
  });
}
// "lim" con il pedice sotto, poi il resto
function drawLim(ctx, sub, body, x, y, o = {}) {
  const size = o.size || 70, local = (o.local != null ? o.local : 99);
  const k = P(local, 0, .6, E.out), al = ((o.alpha != null ? o.alpha : 1)) * k;
  if (al <= 0.002) return;
  ctx.save(); ctx.globalAlpha *= al;
  const limFont = `${Math.round(size * 1.12)}px ${MATH}`;
  ctx.font = limFont; const lw = ctx.measureText('lim').width;
  const gap = size * .28, total = lw + gap + richW(ctx, body, size);
  const x0 = o.align === 'left' ? x : x - total / 2, yy = y + (1 - k) * 16;
  ctx.font = limFont; ctx.fillStyle = css(o.color || C.ink); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText('lim', x0, yy);
  drawRich(ctx, sub, x0 + lw / 2, yy + size * .72, { size: Math.round(size * .55) });
  drawRich(ctx, body, x0 + lw + gap, yy, { size, align: 'left' });
  ctx.restore();
}
function makePlane(o) {
  const p = { ...o };
  p.toS = (x, y) => [o.ox + x * o.u, o.oy - y * o.u];
  p.axes = (ctx, k) => {
    if (k <= 0) return;
    const { ox, oy, u, x0, x1, y0, y1 } = o;
    ctx.save();
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let i = Math.ceil(x0); i <= x1; i++) { if (!i) continue; const x = ox + i * u; ctx.beginPath(); ctx.moveTo(x, oy - y1 * u * k); ctx.lineTo(x, oy - y0 * u * k); ctx.stroke(); }
    for (let j = Math.ceil(y0); j <= y1; j++) { if (!j) continue; const y = oy - j * u; ctx.beginPath(); ctx.moveTo(ox + x0 * u * k, y); ctx.lineTo(ox + x1 * u * k, y); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ox + (x0 - .1) * u * k, oy); ctx.lineTo(ox + (x1 + .15) * u * k, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, oy - (y0 - .1) * u * k); ctx.lineTo(ox, oy - (y1 + .2) * u * k); ctx.stroke();
    arrowHead(ctx, [ox + (x1 + .15) * u * k + 6, oy], 0, C.ink);
    arrowHead(ctx, [ox, oy - (y1 + .2) * u * k - 6], -Math.PI / 2, C.ink);
    ctx.globalAlpha *= P(k, .6, 1);
    for (let i = Math.ceil(x0); i <= x1; i++) if (i) txt(ctx, (i < 0 ? '−' : '') + Math.abs(i), ox + i * u, oy + 32, { size: 29, color: C.dim });
    for (let j = Math.ceil(y0); j <= y1; j++) if (j && j % (o.ystep || 1) === 0) txt(ctx, (j < 0 ? '−' : '') + Math.abs(j), ox - 20, oy - j * u, { size: 29, color: C.dim, align: 'right' });
    drawRich(ctx, '{mx:x}', ox + (x1 + .15) * u + 38, oy, { size: 44 });
    drawRich(ctx, o.ylab || '{my:y}', ox + 30, oy - (y1 + .2) * u - 8, { size: 44, align: o.ylab ? 'left' : 'center' });
    ctx.restore();
  };
  p.curve = (f, a, b, n = 200) => { const pts = []; for (let i = 0; i <= n; i++) { const x = lerp(a, b, i / n); pts.push(p.toS(x, f(x))); } return pts; };
  return p;
}
// cerchietto vuoto: il punto che manca
function hole(ctx, p, col, s = 1, r = 14) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(s, s);
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.shadowColor = css(col, .7); ctx.shadowBlur = 14 * GLOW * SK; ctx.stroke();
  ctx.restore();
}
// punto che viaggia sul grafico, con le sue proiezioni sugli assi
function traveler(ctx, Pl, xv, f, col, al = 1, r = 11) {
  if (al <= 0) return;
  const yv = f(xv), px = Pl.toS(xv, 0), pc = Pl.toS(xv, yv), py = Pl.toS(0, yv);
  ctx.save(); ctx.globalAlpha *= al;
  dashed(ctx, px, pc, col); dashed(ctx, pc, py, C.y);
  dot(ctx, px, col, 1, r + 2); dot(ctx, py, C.y, 1, r + 1); dot(ctx, pc, col, 1, r);
  ctx.restore();
}
function axisLabel(ctx, p, s, col) {
  ctx.fillStyle = C.paper; ctx.fillRect(p[0] - 48, p[1] - 20, 30, 40);
  txt(ctx, s, p[0] - 22, p[1], { size: 34, weight: 600, color: col, align: 'right' });
}
function panel(ctx, x, y, w, h, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.panel; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const fmtN = (v, d = 2) => (v < -Math.pow(10, -d) / 2 ? '−' : '') + Math.abs(v).toFixed(d).replace('.', ',');

// ---------- carta a quadretti e schede ----------
function carta(ctx) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.quad; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let x = 12; x <= W; x += 36) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 18; y <= H; y += 36) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  const g = ctx.createRadialGradient(W / 2, H / 2, 520, W / 2, H / 2, 1250);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, C.vign);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function card(ctx, x, y, w, h, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.shadowColor = C.ombra; ctx.shadowBlur = 30 * SK; ctx.shadowOffsetY = 10 * SK;
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x, y, w, h, 22); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}


// ---------- ADA, ridisegnata dai tracciati SVG di compasso-mascotte.js ----------
// ---------- Stilla, la goccia che racconta (liquida, cubetto di ghiaccio, nuvola) ----------
// Coordinate locali 120 × 106, piedi in (60, 106), come Ada nel motore di Compasso: posa, fumetti e zone restano uguali.
const stHex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
function stMix3(c0, c1, c2, w1, w2) { const a = stHex(c0), b = stHex(c1), c = stHex(c2), w0 = 1 - w1 - w2; return a.map((v, i) => v * w0 + b[i] * w1 + c[i] * w2); }
function stStella(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill();
}
function stLuccichio(ctx, x, y, r) {
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
}
function stTracciato(ctx, pts) {
  const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  ctx.beginPath(); const s = m(pts[n - 1], pts[0]); ctx.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) { const p = pts[i], q = m(p, pts[(i + 1) % n]); ctx.quadraticCurveTo(p[0], p[1], q[0], q[1]); }
  ctx.closePath();
}
// le tre forme, percorse tutte in senso orario dal punto più alto: la trasformazione non si attorciglia
const ST_N = 132;
const stGoccia = u => [60 + 52 * Math.sin(u) * Math.pow(Math.abs(Math.sin(u / 2)), 1.25), 58 - 48 * Math.cos(u)];
const ST_CUBO = { x0: 23, x1: 93, y0: 42, y1: 105, dx: 11, dy: -15 };   // più grande della goccia: gelando l'acqua si allarga
const ST_CONTORNO_CUBO = (() => {
  const { x0, x1, y0, y1, dx, dy } = ST_CUBO;
  const spigoli = [[x0 + dx, y0 + dy], [x1 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1, y1], [x0, y1], [x0, y0]];
  const pts = [], R = 8;
  spigoli.forEach((p, i) => {   // spigoli arrotondati, come i cubetti veri
    const a = spigoli[(i + 5) % 6], b = spigoli[(i + 1) % 6];
    const verso = q => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]), r = Math.min(R, l / 2.5); return [p[0] + (q[0] - p[0]) / l * r, p[1] + (q[1] - p[1]) / l * r]; };
    const p1 = verso(a), p2 = verso(b);
    for (let k = 0; k <= 6; k++) { const s = k / 6; pts.push([(1 - s) * (1 - s) * p1[0] + 2 * s * (1 - s) * p[0] + s * s * p2[0], (1 - s) * (1 - s) * p1[1] + 2 * s * (1 - s) * p[1] + s * s * p2[1]]); }
  });
  const giro = [[(x0 + x1) / 2 + dx, y0 + dy], ...pts.slice(7), ...pts.slice(0, 7)];
  const lung = [0]; for (let i = 1; i <= giro.length; i++) { const a = giro[i - 1], b = giro[i % giro.length]; lung.push(lung[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  return { giro, lung };
})();
function stGhiaccio(u) {
  const { giro, lung } = ST_CONTORNO_CUBO, s = u / TAU * lung[lung.length - 1];
  let i = 1; while (i < lung.length - 1 && lung[i] < s) i++;
  const a = giro[i - 1], b = giro[i % giro.length], r = (s - lung[i - 1]) / ((lung[i] - lung[i - 1]) || 1);
  return [lerp(a[0], b[0], r), lerp(a[1], b[1], r)];
}
function stNuvola(u, t) {
  const w = clamp((1 + Math.cos(u)) / 2 * 1.6);
  const r = 1 + .2 * Math.pow(Math.abs(Math.sin(3.5 * u + Math.sin(t * .8) * .08)), .7) * w;
  return [60 + 58 * Math.sin(u) * r, Math.min(64 - 36 * Math.cos(u) * r, 92)];
}
// la faccia: occhi e bocca scuri sul corpo chiaro
function stFaccia(ctx, f, o) {
  const { cx, ey, dx, ew, eh, my, c, t } = o, lx = o.lx || 0, ly = o.ly || 0;
  ctx.save(); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.6;
  const occhio = (x, sc = 1, ox = 0, oy = 0) => {
    const h = o.blink ? eh * .14 : eh * sc;
    ctx.beginPath(); ctx.ellipse(x + lx + ox, ey + ly + oy, ew / 2 * sc, h / 2, 0, 0, TAU); ctx.fill();
    if (!o.blink) { ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(x + lx + ox - ew * .17 * sc, ey + ly + oy - h * .2, ew * .17 * sc, 0, TAU); ctx.fill(); ctx.fillStyle = c; }
  };
  const arco = (x, y, w, su) => { ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y + (su ? -w * .75 : w * .75), x + w / 2, y); ctx.stroke(); };
  const guance = () => { ctx.save(); ctx.fillStyle = 'rgba(255,128,160,.38)'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * dx * 1.55, my - 3, ew * .5, ew * .28, 0, 0, TAU); ctx.fill(); } ctx.restore(); };
  const boccaAperta = (w, h) => { ctx.beginPath(); ctx.moveTo(cx - w, my - 2); ctx.quadraticCurveTo(cx, my - 2 + h * 1.9, cx + w, my - 2); ctx.closePath(); ctx.fill(); };
  const bocca = () => {
    if (o.talk > 0) { ctx.beginPath(); ctx.ellipse(cx, my + 1, ew * .5, .8 + ew * .5 * o.talk, 0, 0, TAU); ctx.fill(); }
    else arco(cx, my - 1, ew * 1.1, false);
  };
  if (f === 'felice') { arco(cx - dx, ey + eh * .15, ew * 1.25, true); arco(cx + dx, ey + eh * .15, ew * 1.25, true); boccaAperta(ew * .8, ew * .75); guance(); }
  else if (f === 'occhiolino') { occhio(cx - dx); arco(cx + dx, ey + eh * .1, ew * 1.2, true); boccaAperta(ew * .7, ew * .6); guance(); }
  else if (f === 'pensa') {
    occhio(cx - dx, 1, ew * .3, -eh * .22); occhio(cx + dx, 1, ew * .3, -eh * .22);
    ctx.beginPath(); ctx.moveTo(cx + dx - ew * .6, ey - eh * .95); ctx.quadraticCurveTo(cx + dx, ey - eh * 1.25, cx + dx + ew * .6, ey - eh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - ew * .1, my); ctx.lineTo(cx + ew * .7, my - 1.5); ctx.stroke();
  }
  else if (f === 'sorpreso') {
    occhio(cx - dx, 1.25); occhio(cx + dx, 1.25);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * dx - ew * .55, ey - eh * 1.05); ctx.quadraticCurveTo(cx + s * dx, ey - eh * 1.35, cx + s * dx + ew * .55, ey - eh * 1.05); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(cx, my + 1, ew * .3, ew * .4, 0, 0, TAU); ctx.fill();
  }
  else if (f === 'festa') { stStella(ctx, cx - dx, ey, ew * .85); stStella(ctx, cx + dx, ey, ew * .85); boccaAperta(ew * .95, ew * .9); guance(); }
  else if (f === 'freddo') {
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * dx - s * ew * .55, ey - eh * .35); ctx.lineTo(cx + s * dx + s * ew * .3, ey); ctx.lineTo(cx + s * dx - s * ew * .55, ey + eh * .35); ctx.stroke(); }
    ctx.beginPath(); const w = ew * 1.3;
    for (let i = 0; i <= 6; i++) { const x = cx - w / 2 + w * i / 6, y = my + (i % 2 ? -1.6 : 1.6) * (1 + .5 * Math.sin(t * 38)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  else if (f === 'dorme') { arco(cx - dx, ey, ew * 1.2, false); arco(cx + dx, ey, ew * 1.2, false); ctx.beginPath(); ctx.ellipse(cx, my + 1, ew * .22, ew * .28, 0, 0, TAU); ctx.fill(); }
  else { occhio(cx - dx); occhio(cx + dx); bocca(); }
  ctx.restore();
}
// st: { x, y, s, face, faceAt, t, talk, blink, look, jump, shake, tilt, squash, ice, nub, piove, alfa, cade, scioglie }
function drawStilla(ctx, st) {
  const t = st.t, ice = clamp(st.ice), nub = clamp(st.nub, 0, 1 - ice), liq = 1 - ice - nub;
  if (st.alfa <= 0.001) return { ax: st.x + 52 * st.s, ay: st.y - 64 * st.s };
  const vola = 24 * nub + Math.sin(t * 1.3) * 2.5 * nub;
  ctx.save(); ctx.globalAlpha *= st.alfa;
  ctx.translate(st.x, st.y); ctx.scale(st.s, st.s); ctx.translate(-60, -106);
  const alto = clamp(-st.cade / 120);
  ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(60, 106, 32 * (1 - st.jump / 40) * (1 - .4 * nub) * (1 - .6 * alto) * (1 + .5 * st.scioglie), 4.5 * (1 - .3 * nub), 0, 0, TAU); ctx.fill();
  ctx.translate(60 + st.shake, 106 - st.jump - vola + st.cade); ctx.rotate(st.tilt);
  const molle = 1 - ice, resp = Math.sin(t * 1.9) * .02 * molle;
  let sx = 1 - resp - st.jump / 14 * .05 * molle + st.squash * .14 * molle, sy = 1 + resp + st.jump / 14 * .07 * molle - st.squash * .13 * molle;
  if (st.cade < 0) { sx *= .9; sy *= 1.12; }   // in caduta si allunga
  sx *= 1 + .7 * st.scioglie; sy *= 1 - .85 * st.scioglie;   // alla fine si scioglie in una pozzanghera
  ctx.scale(sx, sy); ctx.translate(-60, -106);
  const pts = [];
  for (let i = 0; i < ST_N; i++) {
    const u = i / ST_N * TAU, d = stGoccia(u), g = stGhiaccio(u), c = stNuvola(u, t);
    pts.push([d[0] * liq + g[0] * ice + c[0] * nub + Math.sin(u * 3 + t * 9) * 1.3 * liq * st.talk, d[1] * liq + g[1] * ice + c[1] * nub]);
  }
  const gr = ctx.createLinearGradient(0, 12, 0, 106);
  gr.addColorStop(0, css(stMix3('#b3e9ff', '#f6fdff', '#ffffff', ice, nub)));
  gr.addColorStop(1, css(stMix3('#2c8be0', '#97cfe8', '#d3dce7', ice, nub)));
  ctx.save(); ctx.shadowColor = 'rgba(20,40,80,.22)'; ctx.shadowBlur = 10 * st.s * SK; ctx.shadowOffsetY = 6 * st.s * SK;
  stTracciato(ctx, pts); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
  ctx.save(); stTracciato(ctx, pts); ctx.clip();
  if (liq > .01) {
    ctx.globalAlpha *= liq;
    ctx.fillStyle = 'rgba(255,255,255,.62)'; ctx.beginPath(); ctx.ellipse(39, 60, 5.5, 13, .45, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(47, 41, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.beginPath(); ctx.ellipse(60 + Math.sin(t * 1.4) * 3, 97, 15, 3.5, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha /= liq;
  }
  if (ice > .01) {   // il cubetto: sopra chiaro, fianco in ombra, cuore opaco, bollicine, luccichii
    const { x0, x1, y0, y1, dx, dy } = ST_CUBO, ga = ctx.globalAlpha;
    ctx.globalAlpha = ga * ice;
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dx, y0 + dy); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1, y0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(70,140,185,.22)'; ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1 + dx, y1 + dy); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x0 + 6, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1 - 6); ctx.moveTo(x1, y0); ctx.lineTo(x1 + dx - 3, y0 + dy + 4); ctx.stroke();
    const cuore = ctx.createRadialGradient(58, 76, 2, 58, 76, 26); cuore.addColorStop(0, 'rgba(255,255,255,.5)'); cuore.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cuore; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    [[38, 96, 1.6], [44, 99, 1], [80, 52, 1.3], [84, 57, .9], [72, 98, 1.2]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0 + 7, y0 + 9); ctx.lineTo(x0 + 7, y0 + 30); ctx.moveTo(x0 + 7, y0 + 36); ctx.lineTo(x0 + 7, y0 + 40); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    [[x0 + 16, y0 + 6, 0], [x1 + 4, y0 + 30, 1.7], [x0 + 46, y0 + dy + 7, 3.1], [x0 + 12, y1 - 10, 4.4]].forEach(([x, y, f]) => { const a = Math.max(0, Math.sin(t * 2.3 + f)); if (a > .05) stLuccichio(ctx, x, y, 4.5 * a); });
    ctx.globalAlpha = ga;
  }
  if (nub > .01) {
    const ga = ctx.globalAlpha; ctx.globalAlpha = ga * nub * .7; ctx.fillStyle = '#ffffff';
    [[38, 46, 13], [62, 36, 15], [84, 48, 11]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    ctx.globalAlpha = ga;
  }
  ctx.restore();
  ctx.strokeStyle = css(stMix3('#2373bd', '#7fb4cc', '#b4c3d2', ice, nub)); ctx.lineWidth = 2.2; stTracciato(ctx, pts); ctx.stroke();
  if (st.scioglie < .6) stFaccia(ctx, st.face, { cx: 60, ey: 68 - 11 * nub, dx: 13, ew: 9, eh: 12, my: 84 - 11 * nub,
    c: css(stMix3('#122b48', '#1b4460', '#56677c', ice, nub)), t, talk: st.talk, blink: st.blink, lx: st.look[0], ly: st.look[1] });
  // vapore mentre evapora, brina mentre gela
  if (st.vapore > .02) {
    ctx.strokeStyle = `rgba(200,215,230,${.8 * st.vapore})`; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); const x0 = 40 + i * 20, ph = t * 3 + i * 2; for (let k = 0; k <= 14; k++) { const y = 18 - k * 3.2, x = x0 + Math.sin(ph + k * .6) * 4; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  }
  if (st.brina > .02) {
    ctx.fillStyle = `rgba(230,250,255,${st.brina})`;
    for (let i = 0; i < 9; i++) { const [x, y] = pts[(i * 15) % ST_N]; stLuccichio(ctx, x + Math.sin(i * 7) * 6, y + Math.cos(i * 5) * 6, 4 + 2 * Math.sin(t * 6 + i)); }
  }
  if (st.piove !== null && nub > .5) {   // la pioggia cade dalla nuvola e schizza a terra
    const dt = st.piove, terra = 106 + vola;
    for (let i = 0; i < 9; i++) {
      const f = dt * 1.5 - i * .21; if (f < 0) continue;
      const ph = f % 1, x = 30 + i * 7.5 + Math.sin(i * 3.3) * 3, y = 94 + ph * (terra - 94);
      if (ph < .92) { ctx.fillStyle = 'rgba(64,150,230,.9)'; ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.quadraticCurveTo(x + 3, y, x, y + 2.5); ctx.quadraticCurveTo(x - 3, y, x, y - 5); ctx.fill(); }
      else { ctx.strokeStyle = 'rgba(64,150,230,.8)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(x, terra - 1, 2 + (ph - .92) * 60, 1.2, 0, Math.PI, TAU); ctx.stroke(); }
    }
  }
  if (st.face === 'festa' && liq > .5 && t - st.faceAt < 1.1) {   // festa da goccia: lo schizzo a corona
    const dt = t - st.faceAt;
    for (let i = 0; i < 6; i++) { const x = 60 + (i - 2.5) * 26 * dt, y = 98 - 95 * dt + 170 * dt * dt; if (y < 106 + st.jump) { ctx.fillStyle = 'rgba(64,150,230,.85)'; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill(); } }
  }
  ctx.restore();
  return { ax: st.x + 52 * st.s, ay: st.y - (64 + vola) * st.s };
}

function fumetto(ctx, t, ada, fumetti) {
  for (const [a, b, s] of fumetti) {
    if (t < a || t > b) continue;
    const size = 40, lines = s.split('\n'), lh = size * 1.4;
    const tw = Math.max(...lines.map(l => richW(ctx, l, size, 400)));
    const w = tw + 70, h = lines.length * lh + 40;
    const ax = (ada.ax != null ? ada.ax : ada.x + 52 * ada.s), ay = (ada.ay != null ? ada.ay : ada.y - 64 * ada.s);   // la nuvola fluttua: il fumetto la segue
    const bx = ax + 36; let by = clamp(ay - h / 2, 40, 1048 - h);
    const k = P(t, a, a + .4, E.back), out = 1 - P(t, b - .3, b);
    ctx.save(); ctx.globalAlpha *= out * clamp(k * 3);
    ctx.translate(bx, ay); const sk = lerp(.6, 1, k); ctx.scale(sk, sk); ctx.translate(-bx, -ay);
    ctx.shadowColor = C.ombra; ctx.shadowBlur = 34 * SK; ctx.shadowOffsetY = 12 * SK;
    ctx.fillStyle = C.bolla;
    ctx.beginPath(); ctx.roundRect(bx, by, w, h, [22, 22, 22, 22]); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.stroke();
    // codina verso lo schermo di Ada
    ctx.beginPath(); ctx.moveTo(bx + 3, ay - 15); ctx.lineTo(bx - 24, ay + 4); ctx.lineTo(bx + 3, ay + 13); ctx.closePath();
    ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + 1, ay - 15); ctx.lineTo(bx - 24, ay + 4); ctx.lineTo(bx + 1, ay + 13); ctx.stroke();
    ctx.fillStyle = C.bolla; ctx.fillRect(bx - 1, ay - 13, 5, 24);
    drawRich(ctx, s, bx + 35, by + h / 2 + 2, { size, weight: 400, align: 'left', local: t - a - .1, stagger: .045, lh: 1.4 });
    ctx.restore();
  }
}
function capitolo(ctx, t, a, b, n, nome) {
  const al = life(t, a + .2, b - .2, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha = al;
  ctx.fillStyle = C.v; ctx.beginPath(); ctx.roundRect(64, 40, 40, 40, 11); ctx.fill();
  txt(ctx, String(n), 84, 61, { size: 24, weight: 600, color: C.chip });
  conFont(TITOLI, () => drawRich(ctx, nome, 122, 60, { size: 34, weight: 600, align: 'left', local: t - a - .2 }));
  ctx.restore();
}

// ---------- il copione di Stilla: dove sta, che faccia fa, in che stato è, cosa dice ----------
// S = { posa, facce, fumetti, stati: [[t, 'liquida'|'ghiaccio'|'nuvola'], …], pioggia: [[a, b], …], entrata, uscita }
function stillaAt(t, S, durata) {
  const F = S.facce || [[0, 'neutro']];
  let i = 0; while (i + 1 < F.length && F[i + 1][0] <= t) i++;
  const [te, face] = F[i], dt = t - te;
  let jump = 0, shake = 0, tilt = 0, squash = 0;
  const allegra = ['felice', 'occhiolino', 'festa'].includes(face);
  if (allegra && dt < .55) jump = Math.sin(dt / .55 * Math.PI) * 12;
  if (allegra && dt >= .55 && dt < .85) squash = Math.sin((dt - .55) / .3 * Math.PI);
  if (face === 'sorpreso' && dt < .45) shake = Math.sin(dt * 70) * 3 * (1 - dt / .45);
  if (face === 'freddo') shake = Math.sin(t * 47) * .9;
  if (face === 'pensa') tilt = Math.sin(dt * 3.4) * .045;
  const fum = S.fumetti || [];
  const parla = fum.some(([a, b, s]) => t >= a + .1 && t < a + .1 + Math.min(3, .5 + s.split(/\s+/).length * .065));
  const talk = parla ? Math.abs(Math.sin(t * 13)) * (.55 + .45 * Math.abs(Math.sin(t * 3.1))) : 0;
  // entrata: cade dall'alto e atterra schiacciandosi; uscita: si scioglie in una pozzanghera
  const en = S.entrata === false ? null : (S.entrata || [.6, 1.3]);
  const us = S.uscita === false ? null : (S.uscita || [durata - 2.1, durata - 1.1]);
  let alfa = 1, cade = 0;
  if (en) {
    if (t < en[0]) alfa = 0;
    else if (t < en[1]) { const k = (t - en[0]) / (en[1] - en[0]); cade = -120 * (1 - k * k); }
    else if (t < en[1] + .3) squash = Math.max(squash, Math.sin((t - en[1]) / .3 * Math.PI));
  }
  const scioglie = us ? P(t, us[0], us[1], E.io) : 0;
  if (us) alfa *= 1 - P(t, us[1] - .3, us[1] + .3);
  // gli stati: ogni cambio dura 1,5 s
  const val = { liquida: [0, 0], ghiaccio: [1, 0], nuvola: [0, 1] };
  let da = [0, 0], a = [0, 0], at = -99, verso = null;
  const vale = tt => { const k = P(tt, at, at + 1.5, E.io); return [lerp(da[0], a[0], k), lerp(da[1], a[1], k)]; };
  for (const [ts, nome] of S.stati || []) { if (ts > t) break; da = vale(ts); a = val[nome] || [0, 0]; at = ts; verso = nome; }
  const [ice, nub] = vale(t), kk = P(t, at, at + 1.5, E.io);
  const vapore = verso === 'nuvola' && kk < 1 ? Math.sin(Math.PI * kk) : 0;
  const brina = verso === 'ghiaccio' && kk < 1 ? Math.sin(Math.PI * kk) : 0;
  let piove = null; for (const [pa, pb] of S.pioggia || []) if (t >= pa && t <= pb) piove = t - pa;
  const ps = S.posa || {};
  const k = (keys, d) => keys ? kf(t, keys) : d;
  return {
    x: k(ps.x, 190), y: k(ps.y, 1050), s: k(ps.s, 2.2), look: [k(ps.lx, 2), k(ps.ly, -1.5)],
    face, faceAt: te, t, talk, jump, shake, tilt, squash, ice, nub, vapore, brina, piove, alfa, cade, scioglie,
    blink: ((t + .7) % 3.9) < .13 && face !== 'festa' && face !== 'dorme',
  };
}

// ---------- un fotogramma ----------
function dipingi(ctx, V, t, k = 1, tema = 'chiaro') {
  Object.assign(C, TEMI[tema] || TEMI.chiaro); GLOW = C.glow; SK = k;
  ctx.setTransform(k, 0, 0, k, 0, 0); ctx.globalAlpha = 1; ctx.shadowColor = 'transparent';
  carta(ctx);
  V.scena(ctx, t);
  (V.capitoli || []).forEach(([a, b, nome], i) => capitolo(ctx, t, a, b, i + 1, nome));
  const S = V.stilla || V.ada;
  if (S) { const st = stillaAt(t, S, V.durata), a = drawStilla(ctx, st); st.ax = a.ax; st.ay = a.ay; fumetto(ctx, t, st, S.fumetti || []); }
  // dissolvenza dentro e fuori, sul colore della carta
  const a = Math.max(1 - P(t, 0, .6, E.out), P(t, V.durata - 1.2, V.durata - .2));
  if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
}

// ---------- registro e caricamento ----------
const SCRIPT = document.currentScript;
const BASE = SCRIPT ? new URL('.', SCRIPT.src).href : '';
const VER = ((SCRIPT && SCRIPT.src || '').match(/\?v=\d+/) || [''])[0];
const fabbriche = {}, pronti = {}, inCarico = {};
function registra(id, fab) { fabbriche[id] = fab; }
const API = {
  W, H, TAU, C, E, P, life, kf, clamp, lerp, rgb, css, mix, shade, TITOLI, conFont,
  drawRich, txt, richW, drawSeq, drawLim, fixedNum, fmt, fmtN,
  partial, ball, dot, gear, machine, checkMark, crossMark, runTimes, drawRunIn, drawRunOut, machineFx,
  arrowHead, glowStroke, dashed, makePlane, hole, traveler, axisLabel, panel, card,
};
function costruisci(id) {
  if (!pronti[id]) pronti[id] = Object.assign({ id, copertina: 4 }, fabbriche[id](API));
  return pronti[id];
}
function carica(id) {
  if (fabbriche[id]) return Promise.resolve();
  if (!inCarico[id]) inCarico[id] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = BASE + 'video/' + id + '.js' + VER;
    s.onload = () => fabbriche[id] ? res() : rej(new Error('non registrato'));
    s.onerror = () => { delete inCarico[id]; rej(new Error('file mancante')); };
    document.head.appendChild(s);
  });
  return inCarico[id];
}
let fontPronti = null;
function caricaFont() {
  if (!fontPronti) fontPronti = Promise.all(['400 40px Lexend', '500 40px Lexend', '600 40px Lexend', '500 40px Fraunces', '600 40px Fraunces',
    '40px KaTeX_Main', 'italic 40px KaTeX_Math'].map(f => document.fonts.load(f).catch(() => null))).then(() => pieceCache.clear());
  return fontPronti;
}
const temaSito = () => document.documentElement.dataset.tema === 'scuro' ? 'scuro' : 'chiaro';

// ---------- la voce di Stilla ----------
// voce/<id>.json: { durata, pause: [[t, d], …], parla: [[a, b], …] } (strumenti/voce-sito.js) e voce/<id>.m4a.
// Dove la battuta è più lunga del fumetto il video resta fermo d secondi all'istante t: il «tempo lungo» del sonoro
// è il tempo del video più le pause. Con il sonoro acceso l'orologio è l'audio, così voce e disegno non si scollano.
const voci = {};
function caricaVoce(id) {
  if (!voci[id]) voci[id] = fetch(BASE + 'voce/' + id + '.json' + VER).then(r => r.ok ? r.json() : null).catch(() => null);
  return voci[id];
}
const lungo = (vo, t) => t + vo.pause.filter(([p]) => p < t).reduce((s, [, d]) => s + d, 0);
function corto(vo, tl) {
  let acc = 0;
  for (const [p, d] of vo.pause) {
    if (tl < p + acc) return tl - acc;
    if (tl < p + acc + d) return p;
    acc += d;
  }
  return tl - acc;
}
// la voce è accesa di serie (scelta di Luca, 5/10); se la si spegne col tasto, resta spenta per tutti i video
const CHIAVE_SONORO = 'quanto.video-sonoro';   // Compasso e Quanto stanno sullo stesso dominio: chiavi separate
let sonoroScelto = true;
try { sonoroScelto = localStorage.getItem(CHIAVE_SONORO) !== '0'; } catch (e) {}
const ICONA_SONORO = on => '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke-width="1.6"/>' +
  (on ? '<path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.2 6.5a7.5 7.5 0 0 1 0 11"/>' : '<path d="M16 9.5l5 5M21 9.5l-5 5"/>') + '</svg>';
let inOnda = null;   // un solo video alla volta: quando ne parte uno, quello che andava si ferma

// ---------- il lettore ----------
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function monta(slot, id) {
  slot.classList.add('cv');
  slot.innerHTML = '<div class="cv-schermo"><canvas class="cv-tela" role="img"></canvas>' +
    '<button type="button" class="cv-grande" aria-label="Guarda il video">▶</button></div>' +
    '<div class="cv-ctrl"><button type="button" class="cv-play" aria-label="Avvia">▶</button>' +
    '<input type="range" min="0" max="1000" value="0" aria-label="Avanzamento">' +
    '<span class="cv-tempo">0:00</span>' +
    '<button type="button" class="cv-sonoro" hidden></button>' +
    '<button type="button" class="cv-intero" aria-label="Schermo intero" title="Schermo intero">⛶</button></div>';
  const schermo = slot.querySelector('.cv-schermo'), tela = slot.querySelector('canvas'), ctx = tela.getContext('2d');
  const grande = slot.querySelector('.cv-grande'), play = slot.querySelector('.cv-play');
  const range = slot.querySelector('input'), tempo = slot.querySelector('.cv-tempo'), bSonoro = slot.querySelector('.cv-sonoro');
  let V = null, t = 0, inCorso = false, ultimo = 0, k = 1;
  // il sonoro: vo = dati della voce (null se il video non ce l'ha), tl = posizione sul tempo lungo
  let vo = null, audio = null, sonoro = false, tl = 0, partito = false;
  const conVoce = () => sonoro && vo && audio;
  /* la durata e il tempo mostrati seguono la scelta della voce anche prima che l'audio sia scaricato */
  const fine = () => (sonoro && vo) ? vo.durata : V.durata;
  const ora = () => (sonoro && vo) ? tl : t;
  function disegna() {
    if (!V) return;
    dipingi(ctx, V, t, k, temaSito());
    /* prima di partire si vede la copertina (al secondo 4), ma il video ripartirà da zero: il tempo dice 0:00 */
    const mostra = partito ? ora() : 0;
    range.value = Math.round(mostra / fine() * 1000);
    tempo.textContent = `${mmss(mostra)} / ${mmss(fine())}`;
    tempo.title = vo ? 'Con la voce il video dura di più: si ferma mentre Stilla parla.' : '';
    play.textContent = inCorso ? '❚❚' : (t >= V.durata ? '↺' : '▶');
    grande.hidden = inCorso || (t > 0 && t < V.durata && t !== V.copertina);
    if (vo) {
      bSonoro.innerHTML = ICONA_SONORO(sonoro);
      bSonoro.setAttribute('aria-label', sonoro ? 'Togli la voce' : 'Accendi la voce');
      bSonoro.title = sonoro ? 'Voce accesa' : 'Voce spenta';
      bSonoro.setAttribute('aria-pressed', sonoro ? 'true' : 'false');
    }
  }
  function misura() {
    const w = schermo.clientWidth; if (!w) return;
    const cw = Math.min(W, Math.round(w * (window.devicePixelRatio || 1)));
    if (tela.width !== cw) { tela.width = cw; tela.height = Math.round(cw * H / W); }
    k = cw / W; disegna();
  }
  function ciclo(ts) {
    if (!inCorso) return;
    if (!document.body.contains(slot)) { inCorso = false; if (audio) audio.pause(); return; }
    if (conVoce()) {
      // l'orologio è l'audio: se sta caricando, il disegno aspetta. La traccia finisce con l'ultimo suono,
      // qualche secondo prima del video: da lì il video va avanti col suo orologio fino alla dissolvenza
      if (audio.ended) tl = Math.min(vo.durata, Math.max(tl, audio.duration || 0) + Math.min(.25, (ts - ultimo) / 1000));
      else if (!audio.paused && audio.readyState >= 2) tl = audio.currentTime;
      if (tl >= vo.durata - .02) { tl = vo.durata; inCorso = false; }
      t = Math.min(V.durata, corto(vo, tl));
      if (!inCorso) t = V.durata;
    } else {
      t = Math.min(V.durata, t + Math.min(.25, (ts - ultimo) / 1000));
      if (t >= V.durata) inCorso = false;
    }
    ultimo = ts;
    disegna();
    if (inCorso) requestAnimationFrame(ciclo);
  }
  function suona() {
    if (!conVoce()) return;
    audio.currentTime = tl;
    const p = audio.play();
    // se il browser rifiuta l'audio, il video va avanti muto
    if (p && p.catch) p.catch(() => { if (inCorso && sonoro) { sonoro = false; ultimo = performance.now(); disegna(); } });
  }
  function avvia() {
    if (!V) return;
    partito = true;
    if (sonoro && vo && !audio) preparaAudio();   /* l'audio si scarica al primo ▶, non all'apertura della pagina */
    if (t >= V.durata || t === V.copertina) { t = 0; tl = 0; }
    if (inOnda && inOnda !== ferma) inOnda();
    inOnda = ferma;
    inCorso = true; ultimo = performance.now();
    suona();
    requestAnimationFrame(ciclo); disegna();
  }
  function ferma() { inCorso = false; if (audio) audio.pause(); if (inOnda === ferma) inOnda = null; disegna(); }
  const alterna = () => inCorso ? ferma() : avvia();
  function cambiaSonoro() {
    if (!vo) return;
    sonoro = sonoroScelto = !sonoro;
    try { localStorage.setItem(CHIAVE_SONORO, sonoro ? '1' : '0'); } catch (e) {}
    if (sonoro) {
      if (!audio) preparaAudio();
      tl = lungo(vo, t);
      if (inCorso) suona();
    } else {
      if (audio) audio.pause();
      ultimo = performance.now();
    }
    disegna();
  }
  function preparaAudio() {
    audio = new Audio(BASE + 'voce/' + id + '.m4a' + VER);
    audio.preload = 'metadata';
    audio.addEventListener('error', () => {   // file che non arriva: niente voce per questo video
      if (inCorso && sonoro) ultimo = performance.now();
      audio = null; vo = null; sonoro = false; bSonoro.hidden = true; disegna();
    });
  }
  function schermoIntero() {
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return Promise.resolve(); }
    return (slot.requestFullscreen ? slot.requestFullscreen() : Promise.reject()).then(() => {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
    }).catch(() => {});
  }
  play.addEventListener('click', alterna); tela.addEventListener('click', alterna);
  bSonoro.addEventListener('click', cambiaSonoro);
  // su uno schermo stretto (telefono in verticale) le scritte sarebbero minuscole: si parte a schermo intero
  grande.addEventListener('click', () => {
    if (!document.fullscreenElement && schermo.clientWidth < 600) schermoIntero().then(avvia); else alterna();
  });
  range.addEventListener('input', () => {
    if (!V) return;
    partito = true;
    if (sonoro && vo) {
      tl = range.value / 1000 * vo.durata; t = Math.min(V.durata, corto(vo, tl));
      if (inCorso) audio.currentTime = tl;
    } else t = range.value / 1000 * V.durata;
    disegna();
  });
  slot.querySelector('.cv-intero').addEventListener('click', schermoIntero);
  slot.addEventListener('fullscreenchange', misura);
  if ('ResizeObserver' in window) new ResizeObserver(misura).observe(schermo); else addEventListener('resize', misura);
  // fuori dallo schermo, o con la pagina nascosta, si ferma; col cambio di tema si ridisegna
  if ('IntersectionObserver' in window) new IntersectionObserver(e => { if (!e[0].isIntersecting && inCorso) ferma(); }, { threshold: .2 }).observe(schermo);
  document.addEventListener('visibilitychange', () => { if (document.hidden && inCorso) ferma(); });
  new MutationObserver(() => { if (!inCorso) disegna(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
  Promise.all([caricaFont(), carica(id), caricaVoce(id)]).then(([, , dati]) => {
    V = costruisci(id); t = V.copertina;
    if (dati && Array.isArray(dati.pause)) {
      vo = dati; bSonoro.hidden = false;
      sonoro = sonoroScelto;
      tl = lungo(vo, t);
    }
    tela.setAttribute('aria-label', 'Video: ' + (V.titolo || id));
    misura();
  }).catch(e => { schermo.textContent = 'Video non disponibile (' + e.message + ')'; });
}

// drawStilla serve anche alla mascotte del sito (quanto-mascotte.js), che la disegna con lo stesso codice
window.CVIDEO = { registra, monta, carica, costruisci, caricaFont, dipingi, W, H, elenco: () => Object.keys(fabbriche), drawStilla };
})();
