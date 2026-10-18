'use strict';
/* p·V = n·R·T — le tre leggi dei gas (Boyle, e le due di Gay-Lussac) stanno in una sola equazione di stato;
   il pallone che si sgonfia nel congelatore e la bombola al sole. Argomento: gas. */
CVIDEO.registra('gas/gas-perfetto', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed, fmtN } = M;

const T_FINE = 94.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [26.4, 'felice'], [28.8, 'neutro'],
  [40.8, 'festa'], [43.2, 'neutro'], [50.4, 'felice'], [52.8, 'neutro'], [60.8, 'freddo'], [65.6, 'felice'],
  [68.0, 'neutro'], [80.2, 'pensa'], [85.0, 'felice'], [87.4, 'neutro'], [89.8, 'sorpreso'], [92.0, 'neutro'],
  [96.8, 'felice'], [100.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Tre leggi dei gas:\nstanno in una sola?'],
  [7.9, 12.4, 'Stessa quantità di gas: pressione {mv:p},\nvolume {mink:V}, temperatura {v:assoluta} {mink:T}.'],
  [12.6, 17.0, 'Se {mink:T} non cambia,\n{mv:p}{mink:·V} è costante: Boyle.'],
  [17.2, 21.6, 'Se {mv:p} non cambia, {mink:V} cresce con {mink:T}:\n{mink:V/T} è costante.'],
  [21.8, 26.2, 'Se {mink:V} non cambia, {mv:p} cresce con {mink:T}:\n{mv:p}{mink:/T} è costante.'],
  [26.4, 31.0, 'Tutte e tre stanno in una sola:\n{mv:p}{mink:·V/T} è costante.'],
  [31.2, 35.8, 'Doppio gas, stessa {mv:p} e stessa {mink:T}:\nvolume {g:doppio}.'],
  [36.0, 40.6, '{mink:n} conta le moli: una mole sono\ncirca {mink:6,02·10²³} molecole.'],
  [40.8, 45.4, 'Ecco l’{v:equazione di stato}:\n{mv:p}{mink:·V = n·R·T}.'],
  [45.6, 50.2, '{mink:R} ≈ 8,31 J/(mol·K): la stessa\nper tutti i gas ideali.'],
  [50.4, 55.6, 'Una mole, a 0 °C e 1 atm, occupa\n{g:22,4 litri}, qualunque gas sia.'],
  [56.0, 60.6, 'Un pallone da 6 litri, a 20 °C,\nva nel congelatore.'],
  [60.8, 65.4, 'La pressione resta circa la stessa:\n{mink:V} cala con {mink:T} in kelvin.'],
  [65.6, 70.2, 'Da 293 K a 255 K: circa\n{g:5,2 litri}, un po’ sgonfio.'],
  [70.6, 75.0, 'Una bombola d’aria compressa:\n20 MPa a 20 °C.'],
  [75.2, 80.0, 'Al sole arriva a 50 °C. Il volume\nnon cambia: {mv:p} cresce.'],
  [80.2, 84.8, 'Attenzione: {mink:T} in kelvin! Non è\n50/20 = {r:2,5 volte}…'],
  [85.0, 89.6, '…ma 323/293 ≈ 1,1:\n{g:circa 22 MPa}.'],
  [89.8, 94.4, 'Per questo le bombole\n{r:non si lasciano al sole}.'],
  [96.8, 102.2, 'Pressione per volume è proporzionale\na moli e temperatura assoluta.'],
];

// ---------- aiutanti ----------
const titoletto = (ctx, s, x, y, al = 1, size = 38) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size, weight: 600, alpha: al }));
function riga(ctx, nome, val, y, col, al, x0, x1, size = 36) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right', fill: css(col) });
  ctx.restore();
}
function generatore(seme) {   // mulberry32: numeri «a caso» ma sempre gli stessi
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const tri = s => { const u = ((s % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // il rimbalzo elastico fra due pareti
const ZK = 273.15;
const intero = v => { const n = Math.round(v); return (n < 0 ? '−' : '') + Math.abs(n); };   // col segno meno vero
const colT = tk => mix(C.x, C.y, clamp((tk - 260) / 200));   // colore del gas: freddo azzurro, caldo arancio
const colC = tc => mix(C.x, C.y, clamp((tc + 20) / 70));      // lo stesso, in °C, per il pallone e la bombola

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, '{mv:p}{mink:·V = n·R·T}', W / 2, 190, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- 1 · le tre leggi: tre cilindri con la stessa quantità di gas (100 kPa, 2 L, 300 K all'inizio) ----------
// ogni trasformazione è lenta (la fa la mano o un fornellino): va e torna mentre Stilla ne parla
const PAN = [
  { x: 110, tit: '{mink:T} costante', leg: '{mv:p}{mink:·V} = costante', tipo: 'T', a: 12.9, b: 16.7 },
  { x: 695, tit: '{mv:p} costante', leg: '{mink:V/T} = costante', tipo: 'p', a: 17.5, b: 21.3 },
  { x: 1280, tit: '{mink:V} costante', leg: '{mv:p}{mink:/T} = costante', tipo: 'V', a: 22.1, b: 25.9 },
];
const gobba = (t, a, b) => Math.sin(Math.PI * clamp((t - a) / (b - a))) ** 2;
function statoPan(k, t) {
  const g = gobba(t, k.a, k.b);
  if (k.tipo === 'T') { const V = 2 - g; return { T: 300, V, p: 200 / V, g }; }
  if (k.tipo === 'p') { const T = 300 + 150 * g; return { T, V: T / 150, p: 100, g }; }
  const T = 300 + 150 * g; return { T, V: 2, p: T / 3, g };
}
const YB = 440, CW = 130, PXL = 64, RM = 6, NM = 12, DT = .01, TM = 58;
let TAB = null;
function prepara() {
  if (TAB) return;
  const rnd = generatore(831);
  TAB = PAN.map(k => {
    const fx = new Float64Array(Math.ceil(TM / DT) + 2), fy = new Float64Array(fx.length);
    for (let i = 1; i < fx.length; i++) {
      const s = statoPan(k, (i - .5) * DT), r = Math.sqrt(s.T / 300);   // velocità come √T
      fx[i] = fx[i - 1] + DT * r; fy[i] = fy[i - 1] + DT * r / (s.V * PXL - 2 * RM);
    }
    const mol = Array.from({ length: NM }, () => { const v = 60 + 50 * rnd(), a = rnd() * Math.PI * 2; return { u: rnd() * 2, w: rnd() * 2, vx: v * Math.cos(a), vy: v * Math.sin(a) }; });
    return { fx, fy, mol };
  });
}
const leggi = (f, t) => { const q = clamp(t, 0, TM) / DT, i = Math.floor(q); return lerp(f[i], f[i + 1], q - i); };
function pannello(ctx, k, i, t) {
  const s = statoPan(k, t), x0 = k.x + 60, h = s.V * PXL, tb = TAB[i], fx = leggi(tb.fx, t), fy = leggi(tb.fy, t);
  card(ctx, k.x, 110, 530, 360);
  titoletto(ctx, k.tit, k.x + 265, 155, 1, 34);
  // il fornellino sotto (per le due trasformazioni in cui la temperatura cambia)
  if (k.tipo !== 'T') { ctx.fillStyle = css(mix(C.dim, C.y, s.g)); ctx.fillRect(x0 - 10, YB + 8, CW + 20, 10); }
  ctx.fillStyle = css(colT(s.T), .16); ctx.fillRect(x0, YB - h, CW, h);
  ctx.fillStyle = css(C.v, .8);
  for (const m of tb.mol) {
    const x = x0 + RM + (CW - 2 * RM) * tri(m.u + m.vx * fx / (CW - 2 * RM)), y = YB - RM - (h - 2 * RM) * tri(m.w + m.vy * fy);
    ctx.beginPath(); ctx.arc(x, y, RM, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, 222); ctx.lineTo(x0, YB); ctx.lineTo(x0 + CW, YB); ctx.lineTo(x0 + CW, 222); ctx.stroke();
  // il pistone (bloccato quando il volume è costante)
  ctx.fillStyle = css(mix(C.ink, C.paper, .25)); ctx.fillRect(x0, YB - h - 12, CW, 12);
  if (k.tipo === 'V') { ctx.fillStyle = css(C.dim); ctx.fillRect(x0 - 12, YB - h - 22, 12, 22); ctx.fillRect(x0 + CW, YB - h - 22, 12, 22); }
  else { ctx.fillStyle = css(C.dim); ctx.fillRect(x0 + CW / 2 - 6, YB - h - 52, 12, 40); ctx.fillRect(x0 + CW / 2 - 30, YB - h - 60, 60, 10); }
  const xa = k.x + 240, xb = k.x + 500;
  riga(ctx, '{mink:T}', Math.round(s.T) + ' K', 235, C.ink, 1, xa, xb, 34);
  riga(ctx, '{mink:V}', fmtN(s.V, 1) + ' L', 290, C.ink, 1, xa, xb, 34);
  riga(ctx, '{mv:p}', Math.round(s.p) + ' kPa', 345, C.v, 1, xa, xb, 34);
  drawRich(ctx, k.leg, (xa + xb) / 2, 418, { size: 32, alpha: P(t, k.a - .2, k.a + .3) });
}
// il gas doppio: a pari p e T, il doppio delle molecole sta nel doppio del volume
function scatola(ctx, x, y, w, h, n, t, seme) {
  const rnd = generatore(seme);
  ctx.fillStyle = css(C.v, .06); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = css(C.v, .8);
  for (let i = 0; i < n; i++) {
    const v = 60 + 50 * rnd(), a = rnd() * Math.PI * 2, u = rnd() * 2, q = rnd() * 2;
    const px = x + RM + (w - 2 * RM) * tri(u + v * Math.cos(a) * t / (w - 2 * RM)), py = y + RM + (h - 2 * RM) * tri(q + v * Math.sin(a) * t / (h - 2 * RM));
    ctx.beginPath(); ctx.arc(px, py, RM, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h);
}
function scenaLeggi(ctx, t) {
  if (t < 7.5 || t > 56.0) return;
  prepara();
  const ka = life(t, 7.6, 55.8, .6, .6);
  ctx.save(); ctx.globalAlpha *= ka;
  PAN.forEach((k, i) => pannello(ctx, k, i, t));
  card(ctx, 110, 500, 1700, 290, P(t, 26.0, 26.6));
  // la legge che le contiene tutte
  const k1 = life(t, 26.5, 41.0, .4, .4), k2 = P(t, 40.9, 41.4);
  drawRich(ctx, '{mv:p}{mink:·V/T} = costante', 960, 560, { size: 54, alpha: k1, local: t - 26.6 });
  drawRich(ctx, '{mv:p}{mink:·V = n·R·T}', 960, 560, { size: 60, alpha: k2, local: t - 41.0 });
  // doppio gas, doppio volume
  const kd = life(t, 31.3, 40.6, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    scatola(ctx, 190, 630, 120, 120, 12, t, 11); scatola(ctx, 360, 630, 240, 120, 24, t, 12);
    drawRich(ctx, '{dim:stessa }{mv:p}{dim:, stessa }{mink:T}', 395, 770, { size: 30 });
    drawRich(ctx, '{mink:V}', 250, 600, { size: 32 }); drawRich(ctx, '{mink:2V}', 480, 600, { size: 32 });
    ctx.restore();
  }
  drawRich(ctx, '{mink:n}{dim: = numero di moli;}  1 mol ≈ {mink:6,02·10²³}{dim: molecole}', 1230, 645, { size: 32, local: t - 36.2 });
  drawRich(ctx, '{mink:R} ≈ 8,31 J/(mol·K){dim: (costante dei gas)}', 1230, 700, { size: 32, local: t - 45.8 });
  drawRich(ctx, '{mink:V = n·R·T/}{mv:p} = 1 · 8,31 · 273,15 / 101 325 ≈ 0,0224 m³ = {g:22,4 L}', 960, 755, { size: 30, local: t - 50.6 });
  ctx.restore();
}

// ---------- 2 · il pallone nel congelatore (55,8–70,4): a pressione circa costante V va come T ----------
// la temperatura del gas insegue quella del congelatore (esponenziale); il tempo è accelerato
const tPallone = t => t < 60.9 ? 20 : -18 + 38 * Math.exp(-(t - 60.9) / 1.2);
const vPallone = t => 6 * (tPallone(t) + ZK) / (20 + ZK);
function scenaPallone(ctx, t) {
  if (t < 55.6 || t > 70.6) return;
  const ka = life(t, 55.8, 70.4, .6, .5), tc = tPallone(t), V = vPallone(t);
  card(ctx, 110, 110, 1100, 680, ka); card(ctx, 1250, 110, 560, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  // il congelatore
  ctx.fillStyle = css(C.x, .08); ctx.fillRect(240, 170, 840, 580);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.strokeRect(240, 170, 840, 580);
  ctx.strokeStyle = css(C.x, .35); ctx.lineWidth = 3;
  for (let i = 0; i < 9; i++) { const x = 270 + i * 95; ctx.beginPath(); ctx.moveTo(x, 182); ctx.lineTo(x + 12, 196); ctx.lineTo(x + 24, 182); ctx.stroke(); }
  txt(ctx, 'congelatore: −18 °C', 1060, 720, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'tempo accelerato', 1180, 140, { size: 30, color: C.dim, align: 'right', alpha: P(t, 60.9, 61.4) });
  // il pallone: il raggio va come la radice cubica del volume; tratteggiato, quello di prima
  const r0 = 170, r = r0 * Math.cbrt(V / 6), cx = 660, cy = 430;
  ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  ctx.fillStyle = css(mix(C.y, C.paper, .35)); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(mix(C.y, C.ink, .3)); ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = css(C.paper, .45); ctx.beginPath(); ctx.ellipse(cx - r * .4, cy - r * .45, r * .16, r * .26, .6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.y, C.ink, .3)); ctx.beginPath(); ctx.moveTo(cx, cy + r - 2); ctx.lineTo(cx - 12, cy + r + 18); ctx.lineTo(cx + 12, cy + r + 18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy + r + 18); ctx.quadraticCurveTo(cx + 30, cy + r + 90, cx, 740); ctx.stroke();
  // la scheda
  const xa = 1290, xb = 1770;
  titoletto(ctx, 'il pallone', 1530, 165);
  riga(ctx, 'temperatura', intero(tc) + ' °C', 250, colC(tc), 1, xa, xb);
  riga(ctx, '', '= ' + Math.round(tc + ZK) + ' K', 305, colC(tc), 1, xa, xb);
  riga(ctx, 'volume', fmtN(V, 1) + ' L', 380, C.ink, 1, xa, xb);
  riga(ctx, 'pressione', '≈ costante', 450, C.v, P(t, 60.9, 61.4), xa, xb);
  drawRich(ctx, '{mink:V} ≈ 6 L · 255 K / 293 K', 1530, 560, { size: 34, local: t - 65.8 });
  drawRich(ctx, '≈ {g:5,2 L}', 1530, 625, { size: 42, local: t - 66.6 });
  ctx.restore();
}

// ---------- 3 · la bombola al sole (70,4–94,8): a volume costante p va come T ----------
const tBombola = t => t < 75.5 ? 20 : 50 - 30 * Math.exp(-(t - 75.5) / 1.2);
const pBombola = t => 20 * (tBombola(t) + ZK) / (20 + ZK);
function scenaBombola(ctx, t) {
  if (t < 70.2 || t > T_FINE + .3) return;
  const ka = life(t, 70.4, T_FINE + .1, .6, .5), tc = tBombola(t), p = pBombola(t), ks = P(t, 75.3, 76.0);
  card(ctx, 110, 110, 1100, 680, ka); card(ctx, 1250, 110, 560, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  txt(ctx, 'tempo accelerato', 1180, 140, { size: 30, color: C.dim, align: 'right', alpha: P(t, 75.5, 76.0) });
  // il sole
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(280, 260, 60, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + t * .2; ctx.beginPath(); ctx.moveTo(280 + Math.cos(a) * 78, 260 + Math.sin(a) * 78); ctx.lineTo(280 + Math.cos(a) * 104, 260 + Math.sin(a) * 104); ctx.stroke(); }
    ctx.restore();
  }
  // la bombola: un cilindro d'acciaio con la valvola e il manometro
  ctx.fillStyle = css(mix(colC(tc), C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(560, 300, 220, 440, [90, 90, 20, 20]); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.dim); ctx.fillRect(650, 255, 40, 48);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(690, 275); ctx.lineTo(838, 275); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(890, 275, 52, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const a = Math.PI * .75 + clamp(p / 30) * Math.PI * 1.5;
  ctx.strokeStyle = css(C.v); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(890, 275); ctx.lineTo(890 + Math.cos(a) * 38, 275 + Math.sin(a) * 38); ctx.stroke();
  txt(ctx, fmtN(p, 1) + ' MPa', 890, 365, { size: 34, color: C.v });
  txt(ctx, intero(tc) + ' °C', 670, 520, { size: 40, color: colC(tc) });
  // la scheda
  const xa = 1290, xb = 1770;
  titoletto(ctx, 'la bombola', 1530, 165);
  riga(ctx, 'temperatura', intero(tc) + ' °C', 245, colC(tc), 1, xa, xb);
  riga(ctx, 'pressione', fmtN(p, 1) + ' MPa', 305, C.v, 1, xa, xb);
  riga(ctx, 'volume', 'costante', 365, C.ink, P(t, 75.4, 75.9), xa, xb);
  drawRich(ctx, '{dim:1 MPa = 1 000 000 Pa}', 1530, 425, { size: 30 });
  // l'idea sbagliata: i gradi Celsius non si dividono
  const kr = P(t, 80.4, 80.9);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    drawRich(ctx, '{r:50 / 20 = 2,5 volte?}', 1530, 520, { size: 38 });
    const kx = P(t, 84.4, 85.0), lw = richW(ctx, '50 / 20 = 2,5 volte?', 38) / 2;
    if (kx > 0) { ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1530 - lw, 520); ctx.lineTo(lerp(1530 - lw, 1530 + lw, kx), 520); ctx.stroke(); }
    ctx.restore();
  }
  drawRich(ctx, '323 K / 293 K ≈ {g:1,1}', 1530, 600, { size: 38, local: t - 85.2 });
  drawRich(ctx, '20 MPa · 1,1 ≈ {g:22 MPa}', 1530, 665, { size: 38, local: t - 85.8 });
  drawRich(ctx, '{r:non lasciarle al sole}', 1530, 740, { size: 34, local: t - 90.0 });
  ctx.restore();
}

// in una frase (94,8–105,2)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 103.3, 104.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 95.0 });
    drawRich(ctx, '{mv:p}{mink:·V} è proporzionale a moli\ne temperatura assoluta.', W / 2, 290, { size: 66, weight: 600, local: t - 95.4, stagger: .09 });
  });
  const pills = [[490, '{mv:p}{mink:·V = n·R·T}'], [960, '{mink:R} ≈ 8,31 J/(mol·K)'], [1430, '{mink:T} in kelvin,\n{mink:n} in moli']];
  pills.forEach(([x, s], i) => {
    const a = 97.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 2 ? 33 : 36, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // i tre cilindri
    ['pop', 12.7, .45], ['tono', 12.9, 16.7, [.7, .65, .53, .4, .35, .4, .53, .65, .7]],   // T costante: il pistone scende e torna
    ['pop', 17.3, .45], ['tono', 17.5, 21.3, [.5, .54, .63, .71, .75, .71, .63, .54, .5]], // p costante: scaldato, il pistone sale
    ['pop', 21.9, .45], ['tono', 22.1, 25.9, [.5, .54, .63, .71, .75, .71, .63, .54, .5]], // V costante: sale la pressione
    ['pop', 26.6, .55],                                                               // p·V/T = costante
    ['pop', 31.3, .45], ['pop', 36.2, .4], ['pop', 41.0, .6],                         // doppio gas, le moli, p·V = n·R·T
    ['pop', 45.8, .4], ['pop', 50.6, .45], ['ding', 51.5],                            // R ≈ 8,31; una mole: 22,4 L
    ['soffio', 55.8],                                                                 // il pallone nel congelatore
    ['pop', 60.9, .35], ['tono', 60.9, 65.0, [.7, .56, .47, .41, .37, .35, .33, .32, .31]],   // si raffredda e si sgonfia
    ['pop', 65.8, .45], ['ding', 67.0],                                               // circa 5,2 L
    ['soffio', 70.4], ['pop', 75.5, .5],                                              // la bombola, il sole
    ['tono', 75.5, 79.6, [.3, .44, .53, .59, .63, .65, .67, .68, .69]],               // si scalda: la pressione sale
    ['pop', 80.4, .3], ['traccia', 84.4, 85.0],                                       // 2,5 volte? cancellato
    ['pop', 85.2, .5], ['pop', 85.8, .55], ['ding', 86.6],                            // 323/293 ≈ 1,1: circa 22 MPa
    ['pop', 90.0, .4],                                                                // non lasciarle al sole
    ['soffio', 95.0], ['pop', 97.2, .5], ['pop', 97.7, .6], ['pop', 98.2, .7],        // in una frase
  ];
  return {
    titolo: 'p·V = n·R·T', durata: 105.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 55.8, 'tre leggi in una'], [55.8, 70.4, 'il pallone al freddo'], [70.4, T_FINE, 'la bombola al sole']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaLeggi(ctx, t); scenaPallone(ctx, t); scenaBombola(ctx, t); scenaFine(ctx, t); },
  };
});
