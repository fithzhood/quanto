'use strict';
/* La legge di Ohm — un filo di costantana (L = 4 m, S = 0,1 mm², ρ ≈ 5·10⁻⁷ Ω·m: R = 20 Ω) attaccato a un generatore
   regolabile, con un amperometro in serie. La tensione parte da 2 V e sale a passi di 2 V: 0,1 / 0,2 / 0,3 / 0,4 / 0,5 A; i punti
   (I; V) stanno su una retta per l'origine: V/I = 20 Ω costante, V = R·I (a temperatura costante). La lampadina a
   filamento invece (modello V = I·(R₀ + k·I²), R₀ = 5 Ω a freddo, k = 560 Ω/A²: 15 Ω a 2 V, 40 Ω a 10 V) dà una curva:
   non è ohmica. Il rapporto 20 si scrive in V/A finché non si è detto che cos'è l'ohm.
   Poi la seconda legge: L doppia → 40 Ω; S doppia → 20 Ω; R = ρ·L/S; lo stesso filo (8 m, 0,2 mm²) di rame
   (ρ ≈ 1,7·10⁻⁸ Ω·m) fa 0,68 Ω. Frecce della corrente C.v lunghe in proporzione (400 px/A); il filo è disegnato lungo
   in proporzione a L (100 px/m) e spesso in proporzione alla radice di S. Colori fissi della corrente: corrente C.v,
   tensione C.y. Argomento: corrente. */
CVIDEO.registra('corrente/ohm', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 93.5;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [24.1, 'felice'], [26.2, 'neutro'],
  [29.7, 'sorpreso'], [34.7, 'felice'], [40.3, 'neutro'], [51.1, 'pensa'], [56.7, 'pensa'], [61.0, 'neutro'],
  [66.3, 'sorpreso'], [71.5, 'felice'], [76.9, 'neutro'], [82.3, 'felice'], [87.9, 'sorpreso'], [90.5, 'neutro'],
  [95.9, 'felice'], [99.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Raddoppio la tensione su un filo:\nche fa la corrente?'],
  [7.9, 13.2, 'Un filo di costantana (una lega)\nattaccato a un generatore regolabile.'],
  [13.3, 19.1, 'La {g:tensione} {my:V} è l’energia data a ogni\ncoulomb, in volt: 1 V = 1 J/C.'],
  [19.2, 24.0, 'La corrente {mv:I}, carica al secondo in\nampere, la misura l’{g:amperometro} (A).'],
  [24.1, 29.6, 'Alzo la tensione a passi di 2 V\ne segno ogni coppia nel grafico.'],
  [29.7, 34.6, 'Tensione doppia, corrente doppia:\nsono {g:direttamente proporzionali}.'],
  [34.7, 40.2, 'Il rapporto {my:V}/{mv:I} non cambia: è la\n{g:resistenza} {mink:R} del filo. Qui 20 V/A.'],
  [40.3, 45.9, 'In {g:ohm} (Ω): 1 Ω = 1 V/A.\nPrima legge di Ohm: {my:V} = {mink:R}·{mv:I}.'],
  [46.0, 51.0, 'Vale per i conduttori {g:ohmici}, come\nquesto, se la temperatura non cambia.'],
  [51.1, 56.6, 'Una lampadina a filamento {r:non} è ohmica:\nscaldandosi, la sua resistenza cresce.'],
  [56.7, 60.9, 'Da che cosa dipende\nla resistenza di un filo?'],
  [61.0, 66.2, 'Lungo {mink:L} = 4 m, con sezione {mink:S}\n(l’area del taglio) di 0,1 mm².'],
  [66.3, 71.4, 'Lungo il {g:doppio}: la resistenza\nè {g:doppia}, 40 Ω.'],
  [71.5, 76.8, 'Sezione doppia: la resistenza\ndiventa la {g:metà}, di nuovo 20 Ω.'],
  [76.9, 82.2, 'Conta anche il materiale: è la\n{g:resistività} {mink:ρ}, in Ω·m.'],
  [82.3, 87.8, 'Seconda legge di Ohm: {mink:R} = {mink:ρ·L}/{mink:S}.\nCostantana: {mink:ρ} ≈ 5·10⁻⁷ Ω·m.'],
  [87.9, 93.2, 'Lo stesso filo in {g:rame}: 0,68 Ω.\nPer questo i cavi sono di rame.'],
  [95.9, 102.1, 'Nei conduttori ohmici {my:V} = {mink:R}·{mv:I};\nper un filo, {mink:R} = {mink:ρ·L}/{mink:S}.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.4, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function filo(ctx, pts, k, al = 1) {
  if (k <= 0 || al <= 0) return;
  let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let resto = tot * k;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && resto > 0; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(1, resto / l);
    ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); resto -= l;
  }
  ctx.stroke(); ctx.restore();
}
// resistenza a zig-zag su un filo orizzontale, da x0 a x1
function resistenza(ctx, x0, x1, y, al = 1, col = C.ink) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x0 - 2, y - 26, x1 - x0 + 4, 52);
  const n = 8, w = (x1 - x0) / n;
  ctx.beginPath(); ctx.moveTo(x0, y);
  for (let i = 0; i < n; i++) { ctx.lineTo(x0 + (i + .25) * w, y - 22); ctx.lineTo(x0 + (i + .75) * w, y + 22); }
  ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
}
// uno strumento: cerchio con la lettera
function strumento(ctx, c, lettera, al = 1, r = 42) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, lettera, c[0], c[1] + 2, { size: 44, weight: 600, alpha: al });
}
// ---------- 1 · la prima legge ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const R_FILO = 20, PX_A = 400;
const PASSI = [24.6, 25.6, 26.6, 27.6, 28.6];
// il generatore parte da 2 V (così, quando si presenta la corrente, la freccia c'è già) e sale a passi di 2 V fino a 10 V
const tensione = t => 2 + 2 * PASSI.slice(1).reduce((s, a) => s + P(t, a, a + .35), 0);
const AMP = [960, 400];
function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, 56.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 8.1, 9.6, E.lin);
  filo(ctx, [[260, 330], [260, 220], [480, 220]], kf);
  filo(ctx, [[820, 220], [960, 220], [960, AMP[1] - 42]], kf);
  filo(ctx, [[960, AMP[1] + 42], [960, 580], [260, 580], [260, 470]], kf);
  resistenza(ctx, 480, 820, 220, P(t, 8.6, 9.1));
  txt(ctx, 'filo di costantana', 650, 160, { size: 30, color: C.dim, alpha: P(t, 8.8, 9.3) });
  // il generatore con la sua tensione
  const kg = P(t, 8.1, 8.6), V = tensione(t), Vq = Math.round(V), I = V / R_FILO;
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.roundRect(170, 330, 180, 140, 16); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(mix(C.paper, C.y, .12)); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(192, 365, 136, 70, 10); ctx.fill(); ctx.stroke();
    ctx.restore();
    const kv = P(t, 13.5, 14.0);
    drawRich(ctx, '{y:' + Vq + ' V}', 260, 400, { size: 44, alpha: kg * kv });
    txt(ctx, '+', 228, 306, { size: 40, weight: 600, color: C.v, alpha: kg });
    txt(ctx, '−', 228, 496, { size: 40, weight: 600, color: C.x, alpha: kg });
    txt(ctx, 'generatore', 372, 500, { size: 30, color: C.dim, align: 'left', alpha: kg });
  }
  // l'amperometro e la sua lettura
  strumento(ctx, AMP, 'A', P(t, 9.0, 9.5));
  const ka = P(t, 19.4, 19.9);
  drawRich(ctx, '{v:' + fmtN(Vq / R_FILO, 2) + ' A}', 895, AMP[1], { size: 40, align: 'right', alpha: ka });
  // la corrente: dal + del generatore, nel filo, giù e indietro (lunga in proporzione a I)
  const kI = P(t, 19.4, 19.9), L = PX_A * I;
  if (L > 3) freccia(ctx, [610 + L / 2, 625], [610 - L / 2, 625], C.v, kI, 7);
  drawRich(ctx, '{mv:I}', 750, 625, { size: 40, alpha: kI });
  // il rapporto
  const kr = P(t, 34.9, 35.4);
  const kOhm = P(t, 40.6, 41.1);   // prima in V/A; dopo che si è detto che cos'è l'ohm, in Ω
  if (kr > 0) {
    fondo(ctx, 610, 715, 400, 60, kr);
    drawRich(ctx, '{my:V}/{mv:I} = {g:20 V/A}', 610, 715, { size: 44, alpha: kr * (1 - kOhm) });
    drawRich(ctx, '{my:V}/{mv:I} = {g:20 Ω}', 610, 715, { size: 44, alpha: kr * kOhm });
  }
  ctx.restore();
}
// il grafico (I; V)
const G0 = [1260, 700], GXA = 900, GYV = 40;
const gp = (I, V) => [G0[0] + I * GXA, G0[1] - V * GYV];
const V_LAMP = I => I * (5 + 560 * I * I);   // R = 5 Ω a freddo, 40 Ω a 10 V (0,25 A)
function sceneGrafico(ctx, t) {
  const al = life(t, 8.0, 56.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const ka = P(t, 8.4, 9.4);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let i = 1; i <= 5; i++) { const x = gp(i / 10, 0)[0]; ctx.beginPath(); ctx.moveTo(x, G0[1]); ctx.lineTo(x, gp(0, 12)[1]); ctx.stroke(); }
  for (let v = 2; v <= 12; v += 2) { const y = gp(0, v)[1]; ctx.beginPath(); ctx.moveTo(G0[0], y); ctx.lineTo(gp(.58, 0)[0], y); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(G0[0], G0[1]); ctx.lineTo(lerp(G0[0], 1780, ka), G0[1]); ctx.moveTo(G0[0], G0[1]); ctx.lineTo(G0[0], lerp(G0[1], 205, ka)); ctx.stroke();
  arrowHead(ctx, [lerp(G0[0], 1780, ka) + 4, G0[1]], 0, C.ink); arrowHead(ctx, [G0[0], lerp(G0[1], 205, ka) - 4], -Math.PI / 2, C.ink);
  const kn = P(ka, .6, 1);
  for (let i = 1; i <= 5; i++) txt(ctx, fmtN(i / 10, 1), gp(i / 10, 0)[0], G0[1] + 34, { size: 29, color: C.dim, alpha: kn });
  for (let v = 2; v <= 12; v += 2) txt(ctx, String(v), G0[0] - 20, gp(0, v)[1], { size: 29, color: C.dim, align: 'right', alpha: kn });
  drawRich(ctx, '{mv:I} {dim:(A)}', 1770, 662, { size: 34, align: 'right', alpha: kn });
  drawRich(ctx, '{my:V} {dim:(V)}', G0[0] + 26, 200, { size: 34, align: 'left', alpha: kn });
  // la retta del filo, poi la curva della lampadina
  const kl = P(t, 29.9, 31.1);
  if (kl > 0) {
    ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.lineCap = 'round';
    const b = gp(.55 * kl, 11 * kl); ctx.beginPath(); ctx.moveTo(G0[0], G0[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{y:filo}', gp(.5, 0)[0] - 10, gp(0, 7)[1], { size: 34, alpha: P(t, 30.8, 31.3) });
  }
  const kc = P(t, 51.4, 52.6);
  if (kc > 0) {
    ctx.save(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); for (let i = 0; i <= 60; i++) { const I = .25 * kc * i / 60, p = gp(I, V_LAMP(I)); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    drawRich(ctx, '{x:lampadina}', gp(.25, 0)[0] - 26, gp(0, 10)[1] - 4, { size: 34, align: 'right', alpha: P(t, 52.4, 52.9) });
  }
  // i punti misurati
  PASSI.forEach((a, i) => { const k = P(t, a + .3, a + .6, E.back); if (k > 0) { const p = gp((i + 1) / 10, 2 * (i + 1)); ctx.save(); ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 9 * k, 0, TAU); ctx.fill(); ctx.restore(); } });
  ctx.restore();
}

// ---------- 2 · la seconda legge ----------
const lungh = t => kf(t, [[66.6, 4], [67.8, 8]]);
const sez = t => kf(t, [[71.8, .1], [73.0, .2]]);
const kRame = t => P(t, 88.1, 88.9);
const resist = (t, rame) => (rame ? 1.7e-8 : 5e-7) * lungh(t) / (sez(t) * 1e-6);   // ρ·L/S, con S in m²
const fmtR = R => R >= 10 ? fmtN(Math.round(R), 0) : fmtN(R, 2);
function sceneFilo(ctx, t) {
  const al = life(t, 56.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const x0 = 190, y = 330, Lp = 100 * lungh(t), th = 26 * Math.sqrt(sez(t) / .1);
  const col = mix(mix(C.dim, C.paper, .35), mix(C.y, C.paper, .3), kRame(t));
  const kw = P(t, 57.0, 58.0);
  ctx.save(); ctx.globalAlpha *= kw; ctx.fillStyle = css(col); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x0, y - th / 2, Lp, th, th / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(col, C.ink, .2)); ctx.beginPath(); ctx.ellipse(x0, y, th * .32, th / 2, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
  // L sotto il filo, S a sinistra
  const kL = P(t, 61.2, 61.7);
  if (kL > 0) {
    const yq = y + 64;
    ctx.save(); ctx.globalAlpha *= kL; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, yq); ctx.lineTo(x0 + Lp, yq); for (const x of [x0, x0 + Lp]) { ctx.moveTo(x, yq - 10); ctx.lineTo(x, yq + 10); } ctx.stroke(); ctx.restore();
    fondo(ctx, x0 + Lp / 2, yq, 170, 46, kL); drawRich(ctx, '{mink:L} = ' + fmtN(Math.round(lungh(t) * 10) / 10, lungh(t) % 1 ? 1 : 0) + ' m', x0 + Lp / 2, yq, { size: 36, alpha: kL });
  }
  const kS = P(t, 62.3, 62.8);
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y - th / 2 - 6); ctx.lineTo(x0 + 40, y - 92); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:S} = ' + fmtN(sez(t), 1) + ' mm²', x0 + 50, y - 112, { size: 36, align: 'left', alpha: kS });
  }
  // il materiale e la resistenza
  const km = P(t, 61.2, 61.7);
  txt(ctx, 'costantana', 610, 500, { size: 34, color: C.dim, alpha: km * (1 - kRame(t)) });
  txt(ctx, 'rame', 610, 500, { size: 34, color: C.dim, alpha: km * kRame(t) });
  const kr = P(t, 57.6, 58.2), k = kRame(t);
  drawRich(ctx, '{mink:R} = {g:' + fmtR(resist(t, 0)) + ' Ω}', 610, 600, { size: 72, alpha: kr * (1 - k) });
  drawRich(ctx, '{mink:R} = {g:' + fmtR(resist(t, 1)) + ' Ω}', 610, 600, { size: 72, alpha: kr * k });
  ctx.restore();
}
function riga(ctx, label, val, y, col, al = 1) {
  if (al <= 0) return;
  drawRich(ctx, label, 1230, y, { size: 40, align: 'left', alpha: al });
  drawRich(ctx, val, 1740, y, { size: 40, align: 'right', alpha: al, });
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const k = life(t, 56.8, T_FINE + .1, .5, .5);
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  conFont(TITOLI, () => drawRich(ctx, 'da che cosa dipende', cx, 170, { size: 40, weight: 600 }));
  const kL = P(t, 61.2, 61.7), kS = P(t, 62.3, 62.8), kR = P(t, 57.6, 58.2), kc = kRame(t);
  riga(ctx, '{mink:L} =', fmtN(lungh(t), lungh(t) % 1 ? 1 : 0) + ' m', 250, C.ink, kL);
  riga(ctx, '{mink:S} =', fmtN(sez(t), 1) + ' mm²', 310, C.ink, kS);
  riga(ctx, '{mink:R} =', '{g:' + fmtR(resist(t, 0)) + ' Ω}', 370, C.g, kR * (1 - kc));
  riga(ctx, '{mink:R} =', '{g:' + fmtR(resist(t, 1)) + ' Ω}', 370, C.g, kR * kc);
  separa(ctx, 420, P(t, 76.9, 77.3));
  drawRich(ctx, '{g:resistività} {mink:ρ}{dim:: dipende dal materiale}', cx, 470, { size: 30, local: t - 77.1 });
  drawRich(ctx, '{mink:R} = {mink:ρ·L}/{mink:S}', cx, 545, { size: 52, local: t - 82.4 });
  drawRich(ctx, '{dim:costantana:} {mink:ρ ≈ 5·10⁻⁷} Ω·m', cx, 620, { size: 32, local: t - 83.6 });
  drawRich(ctx, '{dim:rame:} {mink:ρ ≈ 1,7·10⁻⁸} Ω·m', cx, 672, { size: 32, local: t - 88.0 });
  drawRich(ctx, '{dim:in metri quadri:} 0,2 mm² = {mink:2·10⁻⁷} m²', cx, 735, { size: 30, local: t - 84.6 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La legge di Ohm', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.8, 103.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La resistenza è il rapporto fra tensione\ne corrente; dipende da forma e materiale.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:V} = {mink:R}·{mv:I}\n{dim:nei conduttori ohmici}'], [960, '{mink:R} = {mink:ρ·L}/{mink:S}\n{dim:più lungo, più resistenza}'], [1470, '{dim:la lampadina a filamento}\n{r:non} è ohmica']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nel grafico il tono segue la tensione, da 0 V (0) a 12 V (1);
  // nella seconda parte segue la resistenza, da 0 (0) a 40 Ω (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 9.6], ['pop', 8.3, .4], ['pop', 9.0, .45],      // il circuito, il generatore, l'amperometro
    ['pop', 13.6, .4], ['pop', 19.5, .5],                                             // la tensione, la corrente
    ['pop', 25.0, .2],                                                                // il primo punto: 2 V
    ['tono', 25.6, 25.95, [.17, .33]], ['pop', 26.05, .3],                            // a passi di 2 V, un punto per passo
    ['tono', 26.6, 26.95, [.33, .5]], ['pop', 27.05, .4],
    ['tono', 27.6, 27.95, [.5, .67]], ['pop', 28.05, .5],
    ['tono', 28.6, 28.95, [.67, .83]], ['pop', 29.05, .6],
    ['traccia', 29.9, 31.1], ['tono', 29.9, 31.1, [0, .03, .23, .68, .89, .92]],      // la retta del filo
    ['pop', 35.0, .55], ['ding', 40.8],                                               // V/I = 20 V/A, cioè 20 Ω
    ['traccia', 51.4, 52.6], ['tono', 51.4, 52.6, [0, 0, .01, .06, .31, .64, .81, .83]],   // la curva della lampadina
    ['soffio', 56.8], ['pop', 57.1, .4], ['pop', 57.7, .55],                          // il filo, R = 20 Ω
    ['pop', 61.3, .45], ['pop', 62.4, .5],                                            // L e S
    ['tono', 66.6, 67.8, [.5, .52, .63, .87, .98, 1]], ['ding', 68.0],                // lungo il doppio: 40 Ω
    ['tono', 71.8, 73.0, [1, .97, .8, .57, .51, .5]], ['ding', 73.2],                 // sezione doppia: 20 Ω
    ['pop', 77.2, .45],                                                               // la resistività
    ['pop', 82.5, .6], ['pop', 83.7, .45], ['pop', 84.7, .4],                         // R = ρ·L/S, la costantana, i m²
    ['pop', 88.1, .4], ['ding', 89.0],                                                // il rame: 0,68 Ω
    ['soffio', 93.6], ['pop', 95.7, .5], ['pop', 96.2, .6], ['pop', 96.7, .7],        // in una frase
  ];
  return {
    titolo: 'La legge di Ohm', durata: 104.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 56.6, 'tensione e corrente'], [56.6, T_FINE, 'da che cosa dipende la resistenza']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); sceneGrafico(ctx, t); sceneFilo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
