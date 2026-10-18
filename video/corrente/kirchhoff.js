'use strict';
/* Nodi e maglie — un circuito a due maglie che non è né serie né parallelo: pila da 18 V (ramo di sinistra, con
   R₁ = 6 Ω), pila da 9 V (ramo di destra, con R₂ = 3 Ω), R₃ = 2 Ω nel ramo di mezzo fra i nodi A (in alto) e B (in
   basso). Legge dei nodi in A: I₁ + I₂ = I₃ (la carica si conserva). Legge delle maglie: un pallino percorre la maglia e
   il pannello disegna il potenziale (B a 0 V): +18 V nella pila, −R₁·I₁ in R₁, −R₃·I₃ in R₃, di nuovo 0 (l'energia si
   conserva). Equazioni: 18 − 6·I₁ − 2·I₃ = 0, 9 − 3·I₂ − 2·I₃ = 0; da qui I₁ = 3 − I₃/3, I₂ = 3 − 2·I₃/3, e nel nodo
   6 − I₃ = I₃: I₃ = 3 A, I₁ = 2 A, I₂ = 1 A (cadute 12 V, 3 V, 6 V). Le frecce della corrente (C.v) sono lunghe in
   proporzione fin dall'inizio (60 px/A) e il grafico usa le cadute vere. Colori fissi della corrente: corrente C.v,
   tensione e potenziale C.y. Argomento: corrente. */
CVIDEO.registra('corrente/kirchhoff', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 98.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [28.7, 'felice'], [33.7, 'neutro'],
  [38.9, 'felice'], [44.1, 'neutro'], [53.5, 'felice'], [57.1, 'sorpreso'], [61.5, 'neutro'], [66.7, 'felice'],
  [72.0, 'neutro'], [82.1, 'pensa'], [87.1, 'festa'], [92.5, 'felice'], [T_FINE, 'neutro'], [100.6, 'felice'],
  [104.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Due pile nello stesso circuito:\nquanta corrente in ogni filo?'],
  [7.9, 12.8, 'Due pile, 18 V e 9 V, e tre\n{g:resistenze}: frenano la corrente.'],
  [12.9, 17.9, 'La {g:tensione} {my:V} è l’energia data a ogni\ncoulomb di carica, in volt (V).'],
  [18.0, 23.4, 'La {g:corrente} {mv:I} è carica al secondo (A).\nIn ogni resistenza {my:V} = {mink:R}·{mv:I}.'],
  [23.5, 28.6, 'Un {g:nodo} è dove si incontrano tre\no più fili: qui {mink:A} e {mink:B}.'],
  [28.7, 33.6, 'Fra due nodi c’è un {g:ramo}: qui tre,\nognuno con la sua corrente.'],
  [33.7, 38.8, 'Legge dei {g:nodi}: quanta corrente\nentra in un nodo, tanta ne esce.'],
  [38.9, 44.0, 'In {mink:A}: {mv:I₁} + {mv:I₂} = {mv:I₃}.\nLa carica si {g:conserva}.'],
  [44.1, 48.8, 'Una {g:maglia} è un giro chiuso\nfatto di rami. Ecco la prima.'],
  [48.9, 53.4, 'La percorro segnando il {g:potenziale}:\nla tensione è un suo dislivello.'],
  [53.5, 57.0, 'Attraverso la pila si {g:sale} di 18 V…'],
  [57.1, 61.4, '…nella resistenza {mink:R₁} si {y:scende}\ndi {mink:R₁}·{mv:I₁}…'],
  [61.5, 66.6, '…e in {mink:R₃} di {mink:R₃}·{mv:I₃}: torno al punto\ndi partenza, alla stessa quota.'],
  [66.7, 71.9, 'Legge delle {g:maglie}: lungo un giro\nle tensioni, col segno, sommano a zero.'],
  [72.0, 76.8, 'Una carica che fa il giro torna con\nla stessa energia: si {g:conserva}.'],
  [76.9, 82.0, 'Lo stesso nella seconda maglia:\n9 − 3·{mv:I₂} − 2·{mv:I₃} = 0.'],
  [82.1, 87.0, 'Tre equazioni per tre incognite:\ndalle maglie ricavo {mv:I₁} e {mv:I₂}…'],
  [87.1, 92.4, '…e nel nodo: {mv:I₃} = 3 A,\n{mv:I₁} = 2 A, {mv:I₂} = 1 A.'],
  [92.5, 97.6, 'Verifica: nel nodo e nella maglia\ni conti {g:tornano}.'],
  [100.6, 106.4, 'Nei nodi si conserva la carica,\nlungo le maglie l’energia.'],
];

// ---------- aiutanti (gli stessi disegni dei video sulla corrente) ----------
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
// la pila su un ramo verticale: il polo + (lungo e sottile) in alto; i segni dalla parte «lato» (+1 destra, −1 sinistra)
function pila(ctx, x, yc, al, lato = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 44, yc - 22, 88, 44);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, yc - 15); ctx.lineTo(x + 40, yc - 15); ctx.stroke();
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 20, yc + 15); ctx.lineTo(x + 20, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 62 * lato, yc - 32, { size: 40, weight: 600, color: C.v, alpha: al });
  txt(ctx, '−', x + 62 * lato, yc + 34, { size: 40, weight: 600, color: C.x, alpha: al });
}
// resistenza a zig-zag lungo un filo (orizzontale o verticale), fra a e b
function resistenza(ctx, a, b, al = 1) {
  if (al <= 0) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const n = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
  for (let i = 0; i < n; i++) for (const [f, s] of [[.25, 1], [.75, -1]]) { const d = (i + f) * L / n; ctx.lineTo(a[0] + ux * d + nx * 20 * s, a[1] + uy * d + ny * 20 * s); }
  ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function nodo(ctx, p, al, r = 10) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.restore(); }
function etichetta(ctx, s, x, y, al, align = 'center', size = 34) { if (al > 0) drawRich(ctx, s, x, y, { size, align, alpha: al }); }
// una spezzata spessa e trasparente sotto i fili: la maglia che si sta percorrendo
function evidenzia(ctx, pts, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col, .22); ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}

// ---------- il circuito ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XS = 260, XM = 600, XD = 940, YT = 230, YG = 670, YC = 450;
const NA = [XM, YT], NB = [XM, YG];
const E1 = 18, E2 = 9, R1 = 6, R2 = 3, R3 = 2;
// le correnti vere del circuito (verso: I₁ e I₂ salgono nelle pile ed entrano in A, I₃ scende da A a B)
const I3 = (E1 / R1 + E2 / R2) / (1 + R3 * (1 / R1 + 1 / R2)), I1 = (E1 - R3 * I3) / R1, I2 = (E2 - R3 * I3) / R2;   // 2, 1, 3 A
const PX_A = 60;
// le due maglie, percorse a partire da B: la prima in senso orario, la seconda antiorario
const MAGLIA1 = percorso([NB, [XS, YG], [XS, YC + 15], [XS, YC - 15], [XS, YT], [350, YT], [510, YT], NA, [XM, 360], [XM, 540], NB]);
const MAGLIA2 = percorso([NB, [XD, YG], [XD, YC + 15], [XD, YC - 15], [XD, YT], [850, YT], [690, YT], NA, [XM, 360], [XM, 540], NB]);
// i punti dove il potenziale cambia, lungo il giro (stesse lunghezze nelle due maglie)
const SC = MAGLIA1.cum;   // 0, 340, 545, 575, 780, 870, 1030, 1120, 1250, 1430, 1560
// il potenziale (B = 0 V) lungo la maglia: sale di E nella pila, scende di R·I in ogni resistenza
function potenziale(s, Ep, d1, d3) {
  if (s < SC[2]) return 0;
  if (s < SC[3]) return Ep * (s - SC[2]) / (SC[3] - SC[2]);
  if (s < SC[5]) return Ep;
  if (s < SC[6]) return Ep - d1 * (s - SC[5]) / (SC[6] - SC[5]);
  if (s < SC[8]) return Ep - d1;
  if (s < SC[9]) return Ep - d1 - d3 * (s - SC[8]) / (SC[9] - SC[8]);
  return Ep - d1 - d3;
}
const giro1 = t => kf(t, [[53.6, 0], [55.4, SC[3]], [57.2, SC[3]], [59.0, SC[6]], [61.6, SC[6]], [63.8, SC[10]]]);
const giro2 = t => kf(t, [[77.2, 0], [80.2, SC[10]]]);
const SOLUZIONE = 87.3;   // da qui le correnti hanno il loro valore scritto

function anello(ctx, p, k, al) {   // un anello che si allarga attorno a un nodo, per indicarlo
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al * (1 - k); ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(p[0], p[1], 14 + 30 * k, 0, TAU); ctx.stroke(); ctx.restore();
}
function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // le maglie evidenziate, sotto i fili
  evidenzia(ctx, MAGLIA1.pts, C.g, life(t, 44.3, 76.9, .5, .4) + life(t, 94.6, T_FINE + .1, .5, .3));
  evidenzia(ctx, MAGLIA2.pts, C.g, life(t, 76.9, 82.0, .4, .5));
  const kw = P(t, 8.1, 9.6, E.lin);
  filo(ctx, [[XS, YC - 15], [XS, YT], [350, YT]], kw);
  filo(ctx, [[510, YT], [690, YT]], kw);
  filo(ctx, [[850, YT], [XD, YT], [XD, YC - 15]], kw);
  filo(ctx, [[XS, YC + 15], [XS, YG], [XD, YG], [XD, YC + 15]], kw);
  filo(ctx, [NA, [XM, 360]], kw); filo(ctx, [[XM, 540], NB], kw);
  const kr = P(t, 8.6, 9.2);
  resistenza(ctx, [350, YT], [510, YT], kr); resistenza(ctx, [690, YT], [850, YT], kr); resistenza(ctx, [XM, 360], [XM, 540], kr);
  const kp = P(t, 8.1, 8.6);
  pila(ctx, XS, YC, kp, 1); pila(ctx, XD, YC, kp, -1);
  etichetta(ctx, '{y:' + E1 + ' V}', 198, YC, kp, 'right', 36);
  etichetta(ctx, '{y:' + E2 + ' V}', 1002, YC, kp, 'left', 36);
  etichetta(ctx, '{mink:R₁} = ' + R1 + ' Ω', 430, 168, P(t, 8.9, 9.4));
  etichetta(ctx, '{mink:R₂} = ' + R2 + ' Ω', 770, 168, P(t, 9.1, 9.6));
  etichetta(ctx, '{mink:R₃} = ' + R3 + ' Ω', 636, YC, P(t, 9.3, 9.8), 'left');
  // i nodi
  const kn = P(t, 23.7, 24.2);
  nodo(ctx, NA, kn); nodo(ctx, NB, kn);
  etichetta(ctx, '{mink:A}', XM, 186, kn, 'center', 38); etichetta(ctx, '{mink:B}', XM, 716, kn, 'center', 38);
  for (const [a, p] of [[23.8, NA], [24.4, NB], [33.9, NA], [35.1, NA], [39.1, NA], [92.5, NA]]) anello(ctx, p, P(t, a, a + 1.1), t > a && t < a + 1.1 ? 1 : 0);
  // le correnti nei rami, lunghe in proporzione (60 px/A), coi nomi e poi coi valori
  const k1 = P(t, 29.0, 29.5), k2 = P(t, 29.5, 30.0), k3 = P(t, 30.0, 30.5), kv = P(t, SOLUZIONE, SOLUZIONE + .5);
  const L1 = PX_A * I1, L2 = PX_A * I2, L3 = PX_A * I3;
  freccia(ctx, [430 - L1 / 2, 280], [430 + L1 / 2, 280], C.v, k1);
  freccia(ctx, [490, YG + 45], [490 - L1, YG + 45], C.v, k1);
  freccia(ctx, [770 + L2 / 2, 280], [770 - L2 / 2, 280], C.v, k2);
  freccia(ctx, [740, YG + 45], [740 + L2, YG + 45], C.v, k2);
  freccia(ctx, [556, 450 - L3 / 2], [556, 450 + L3 / 2], C.v, k3);
  etichetta(ctx, '{mv:I₁}', 430, 320, k1 * (1 - kv), 'center', 36);
  etichetta(ctx, '{mv:I₂}', 770, 320, k2 * (1 - kv), 'center', 36);
  etichetta(ctx, '{mv:I₃}', 528, YC, k3 * (1 - kv), 'right', 36);
  etichetta(ctx, '{mv:I₁} = 2 A', 430, 320, kv, 'center', 34);
  etichetta(ctx, '{mv:I₂} = 1 A', 770, 320, kv, 'center', 34);
  etichetta(ctx, '{mv:I₃} = 3 A', 528, YC, kv, 'right', 34);
  // il pallino che percorre la maglia
  for (const [pc, s, a, b] of [[MAGLIA1, giro1(t), 49.1, 66.6], [MAGLIA2, giro2(t), 76.9, 81.9]]) {
    const k = life(t, a, b, .4, .4); if (k <= 0) continue;
    const p = puntoSu(pc, s);
    ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.paper); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}

// ---------- il grafico del potenziale lungo la maglia ----------
const gx = s => 1240 + s * 500 / SC[10], gy = v => 590 - v * 15;
function grafico(ctx, t, al, sNow, Ep, d1, nomeR, posR) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const v of [6, 12, 18]) { ctx.beginPath(); ctx.moveTo(1240, gy(v)); ctx.lineTo(1745, gy(v)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(1236, 590); ctx.lineTo(1752, 590); ctx.moveTo(1240, 594); ctx.lineTo(1240, 296); ctx.stroke();
  arrowHead(ctx, [1758, 590], 0, C.ink); arrowHead(ctx, [1240, 290], -Math.PI / 2, C.ink);
  for (const v of [6, 12, 18]) txt(ctx, String(v), 1226, gy(v), { size: 28, color: C.dim, align: 'right' });
  drawRich(ctx, '{my:V} {dim:(V)}', 1262, 292, { size: 32, align: 'left' });
  txt(ctx, 'pila', gx(560), 622, { size: 30, color: C.dim });
  drawRich(ctx, '{mink:' + nomeR + '}', gx(950), 622, { size: 32 });
  drawRich(ctx, '{mink:R₃}', gx(1340), 622, { size: 32 });
  // la traccia del potenziale fino al punto raggiunto
  const pts = [];
  for (const s of SC) { if (s > sNow) break; pts.push([gx(s), gy(potenziale(s, Ep, d1, 6))]); }
  pts.push([gx(sNow), gy(potenziale(sNow, Ep, d1, 6))]);
  ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  const pn = pts[pts.length - 1];
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(pn[0], pn[1], 10, 0, TAU); ctx.fill();
  // i salti, scritti quando il pallino li ha passati
  const kE = clamp((sNow - SC[3] + 41) / 40), kR = clamp((sNow - SC[6] + 41) / 40), k3 = clamp((sNow - SC[9] + 41) / 40);
  drawRich(ctx, '{y:+' + Ep + ' V}', gx(SC[2]) - 16, gy(Ep / 2), { size: 34, align: 'right', alpha: kE });
  drawRich(ctx, '−{mink:' + nomeR + '}·{mv:' + (nomeR === 'R₁' ? 'I₁' : 'I₂') + '}', posR[0], posR[1], { size: 32, alpha: kR });
  drawRich(ctx, '−{mink:R₃}·{mv:I₃}', 1712, 470, { size: 32, alpha: k3 });
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 23.4, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il circuito', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:due pile:} {y:18 V} {dim:e} {y:9 V}', cx, 240, { size: 34, local: t - 8.0 });
    drawRich(ctx, '{mink:R₁} = 6 Ω{dim:,}  {mink:R₂} = 3 Ω{dim:,}  {mink:R₃} = 2 Ω', cx, 295, { size: 34, local: t - 9.0 });
    drawRich(ctx, '{dim:resistenze, in ohm (Ω)}', cx, 342, { size: 30, local: t - 10.2 });
    separa(ctx, 388, P(t, 12.9, 13.3));
    drawRich(ctx, '{my:V}{dim:: tensione, energia per coulomb}', cx, 438, { size: 32, local: t - 13.0 });
    drawRich(ctx, '{dim:in volt: 1 V = 1 J/C}', cx, 484, { size: 30, local: t - 15.4 });
    separa(ctx, 530, P(t, 18.0, 18.4));
    drawRich(ctx, '{mv:I}{dim:: corrente, carica al secondo}', cx, 580, { size: 32, local: t - 18.1 });
    drawRich(ctx, '{dim:in ampere: 1 A = 1 C/s}', cx, 626, { size: 30, local: t - 19.6 });
    drawRich(ctx, '{dim:in una resistenza} {my:V} = {mink:R}·{mv:I}', cx, 700, { size: 36, local: t - 20.6 });
  });
  blocco(23.5, 33.6, () => {
    conFont(TITOLI, () => drawRich(ctx, 'nodi e rami', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:nodo}{dim:: dove si incontrano}', cx, 250, { size: 34, local: t - 23.6 });
    drawRich(ctx, '{dim:tre o più fili}', cx, 298, { size: 34, local: t - 24.6 });
    drawRich(ctx, '{dim:qui} {mink:A} {dim:e} {mink:B}', cx, 360, { size: 40, local: t - 26.6 });
    separa(ctx, 420, P(t, 28.7, 29.1));
    drawRich(ctx, '{g:ramo}{dim:: il tratto fra due nodi}', cx, 475, { size: 34, local: t - 28.8 });
    drawRich(ctx, '{dim:tre rami, tre correnti}', cx, 528, { size: 32, local: t - 30.0 });
    drawRich(ctx, '{mv:I₁}{dim:,}  {mv:I₂}{dim:,}  {mv:I₃}', cx, 600, { size: 46, local: t - 30.6 });
  });
  blocco(33.7, 44.0, () => {
    conFont(TITOLI, () => drawRich(ctx, 'legge dei nodi', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:nel nodo} {mink:A}', cx, 238, { size: 34, local: t - 33.8 });
    // le frecce, con le lunghezze del circuito: I₁ e I₂ in fila sono lunghe quanto I₃
    const x0 = cx - PX_A * I3 / 2, ke = P(t, 35.0, 35.5), ku = P(t, 36.2, 36.7);
    freccia(ctx, [x0, 330], [x0 + PX_A * I1, 330], C.v, ke);
    freccia(ctx, [x0 + PX_A * I1, 330], [x0 + PX_A * (I1 + I2), 330], C.v, ke);
    drawRich(ctx, '{mv:I₁}', x0 + PX_A * I1 / 2, 290, { size: 36, alpha: ke });
    drawRich(ctx, '{mv:I₂}', x0 + PX_A * (I1 + I2 / 2), 290, { size: 36, alpha: ke });
    txt(ctx, 'entrano', x0 - 24, 330, { size: 30, color: C.dim, align: 'right', alpha: ke });
    freccia(ctx, [x0, 430], [x0 + PX_A * I3, 430], C.v, ku);
    drawRich(ctx, '{mv:I₃}', cx, 390, { size: 36, alpha: ku });
    txt(ctx, 'esce', x0 - 24, 430, { size: 30, color: C.dim, align: 'right', alpha: ku });
    drawRich(ctx, '{mv:I₁} + {mv:I₂} = {mv:I₃}', cx, 520, { size: 52, local: t - 39.0 });
    separa(ctx, 580, P(t, 39.6, 40.0));
    drawRich(ctx, '{dim:nel nodo la carica non si ferma}', cx, 628, { size: 30, local: t - 40.0 });
    drawRich(ctx, '{g:la carica si conserva}', cx, 684, { size: 38, local: t - 41.6 });
  });
  blocco(44.1, 82.0, () => {
    conFont(TITOLI, () => drawRich(ctx, 'legge delle maglie', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:maglia}{dim:: un giro chiuso di rami}', cx, 232, { size: 32, local: t - 44.2 });
    grafico(ctx, t, life(t, 49.0, 76.9, .5, .3), giro1(t), E1, R1 * I1, 'R₁', [1615, 395]);
    grafico(ctx, t, life(t, 77.0, 82.0, .3, .5), giro2(t), E2, R2 * I2, 'R₂', [1545, 412]);
    drawRich(ctx, '{dim:maglia 1:} 18 − 6·{mv:I₁} − 2·{mv:I₃} = 0', cx, 690, { size: 34, local: t - 67.0 });
    drawRich(ctx, '{dim:maglia 2:} 9 − 3·{mv:I₂} − 2·{mv:I₃} = 0', cx, 745, { size: 34, local: t - 77.6 });
  });
  blocco(82.1, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'tre equazioni', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mv:I₁} + {mv:I₂} = {mv:I₃}', cx, 232, { size: 34, local: t - 82.2 });
    drawRich(ctx, '18 − 6·{mv:I₁} − 2·{mv:I₃} = 0', cx, 280, { size: 34, local: t - 82.5 });
    drawRich(ctx, '9 − 3·{mv:I₂} − 2·{mv:I₃} = 0', cx, 328, { size: 34, local: t - 82.8 });
    separa(ctx, 372, P(t, 84.0, 84.4));
    drawRich(ctx, '{mv:I₁} = 3 − {mv:I₃}/3', cx, 418, { size: 36, local: t - 84.2 });
    drawRich(ctx, '{mv:I₂} = 3 − 2·{mv:I₃}/3', cx, 468, { size: 36, local: t - 85.2 });
    separa(ctx, 512, P(t, 87.1, 87.5));
    drawRich(ctx, '{dim:nel nodo:} 6 − {mv:I₃} = {mv:I₃}', cx, 558, { size: 36, local: t - 87.2 });
    drawRich(ctx, '{mv:I₃} = {g:3 A}{dim:,}  {mv:I₁} = {g:2 A}{dim:,}  {mv:I₂} = {g:1 A}', cx, 616, { size: 36, local: t - 88.6 });
    separa(ctx, 662, P(t, 92.3, 92.7));
    drawRich(ctx, '{dim:nodo:} 2 + 1 = 3', cx, 706, { size: 34, local: t - 92.5 });
    drawRich(ctx, '{dim:maglia 1:} 18 − 12 − 6 = 0', cx, 752, { size: 34, local: t - 94.6 });
  });
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Nodi e maglie', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 107.9, 108.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Nei nodi si conserva la carica,\nlungo le maglie l’energia.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{dim:nodi: entra = esce}\n{mv:I₁} + {mv:I₂} = {mv:I₃}'], [960, '{dim:maglie: lungo un giro}\nle tensioni sommano a {g:zero}'], [1470, '{dim:con le due leggi}\nsi trova ogni corrente']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): nei giri il tono segue il potenziale del pallino, da 0 V (0) a 18 V (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 9.6], ['pop', 8.3, .4], ['pop', 8.9, .5],       // i fili, le pile, le resistenze
    ['pop', 23.8, .55], ['pop', 24.4, .35],                                           // i nodi A e B
    ['pop', 29.0, .4], ['pop', 29.5, .45], ['pop', 30.0, .5],                         // le tre correnti
    ['pop', 35.0, .45], ['pop', 36.2, .55], ['pop', 39.1, .6], ['ding', 41.6],        // entrano, esce, I₁ + I₂ = I₃
    ['traccia', 44.3, 44.8], ['traccia', 49.0, 49.5],                                 // la prima maglia, gli assi del grafico
    ['tono', 53.6, 55.4, [0, 0, 0, 0, 0, 0, 0, .16, .89, 1]],                         // la pila: si sale di 18 V
    ['tono', 57.2, 59.0, [1, 1, 1, 1, 1, 1, .61, .42, .34, .33]],                     // R₁: si scende di 12 V
    ['tono', 61.6, 63.8, [.33, .33, .33, .33, .33, .1, 0, 0, 0, 0]],                  // R₃: di nuovo a 0 V
    ['ding', 64.0], ['pop', 67.0, .5],                                                // stessa quota, l'equazione
    ['traccia', 76.9, 77.4],                                                          // la seconda maglia
    ['tono', 77.2, 80.2, [0, 0, 0, 0, 0, 0, 0, 0, .05, .5, .35, .33, .19, .01, 0, 0, 0, 0, 0]],   // il giro: +9 V, −3 V, −6 V
    ['pop', 77.7, .5],
    ['pop', 82.2, .4], ['pop', 82.5, .45], ['pop', 82.8, .5],                         // tre equazioni
    ['pop', 84.2, .55], ['pop', 85.2, .6],                                            // I₁ e I₂ in funzione di I₃
    ['pop', 87.3, .5], ['ding', 88.7],                                                // nel nodo, e le tre correnti
    ['pop', 92.5, .55], ['ding', 93.0], ['ding', 95.0],                               // verifica nel nodo e nella maglia
    ['soffio', 98.3], ['pop', 100.4, .5], ['pop', 100.9, .6], ['pop', 101.4, .7],     // in una frase
  ];
  return {
    titolo: 'Nodi e maglie', durata: 109.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 23.4, 'il circuito'], [23.4, 44.0, 'i nodi'], [44.0, 82.0, 'le maglie'], [82.0, T_FINE, 'le correnti']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
