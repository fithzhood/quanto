'use strict';
/* Due lenti in fila — microscopio e cannocchiale: l'immagine della prima lente fa da oggetto per la seconda.
   Microscopio (numeri piccoli perché stia nel disegno): obiettivo f₁ = 2 cm, oggetto a p₁ = 3 cm → q₁ = 6 cm, immagine reale
   capovolta, ingrandimento q₁/p₁ = 2; l'oculare (f₂ = 4 cm) sta 3 cm dopo quell'immagine: 1/3 + 1/q₂ = 1/4 → q₂ = −12 cm,
   virtuale, ingrandimento 12/3 = 4; in tutto 8 (oggetto 0,8 cm → 1,6 cm → 6,4 cm). L'immagine finale cade nel piano
   dell'oggetto (12 cm prima dell'oculare). Cannocchiale: obiettivo f₁ = 12 cm, oculare f₂ = 3 cm, a 15 cm; raggi paralleli
   con pendenza 0,15 (giù di 1,5 cm ogni 10) si raccolgono nel fuoco comune a 1,8 cm sotto l'asse ed escono paralleli con
   pendenza 0,6 (su di 6 ogni 10): f₁/f₂ = 4; passano tutti per la pupilla d'uscita, 3,75 cm dopo l'oculare (lì l'occhio).
   Raggi calcolati con le lenti sottili (a ogni lente la pendenza cambia di −y/f): gli incroci disegnati sono quelli veri.
   La lente d'ingrandimento da sola è in ottica/lenti. Argomento: ottica. */
CVIDEO.registra('ottica/strumenti', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, glowStroke, dashed, dot } = M;

const T_FINE = 93.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [21.7, 'felice'], [25.9, 'neutro'],
  [30.5, 'felice'], [35.1, 'pensa'], [39.5, 'neutro'], [48.7, 'sorpreso'], [53.3, 'neutro'], [58.1, 'festa'],
  [63.0, 'neutro'], [76.2, 'felice'], [80.8, 'neutro'], [85.0, 'sorpreso'], [89.6, 'festa'],
  [95.5, 'felice'], [99.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Come fa un microscopio\na ingrandire così tanto?'],
  [7.9, 12.3, 'Dentro ci sono due lenti {v:convergenti}\nin fila: {x:obiettivo} e {x:oculare}.'],
  [12.5, 16.9, 'L’oggetto, a 3 cm dall’obiettivo,\nsta oltre il fuoco {mink:F₁}.'],
  [17.1, 21.5, 'Due raggi dalla punta: uno {x:parallelo}\nall’asse, uno per il {g:centro}.'],
  [21.7, 25.7, 'Si incontrano a 6 cm: un’immagine\n{g:reale} e capovolta.'],
  [25.9, 30.3, 'La formula delle lenti:\n1/3 + 1/6 = 1/2. {g:Torna}.'],
  [30.5, 34.9, 'È alta il doppio: l’{v:ingrandimento}\nè {mink:q/p} = 6/3 = 2.'],
  [35.1, 39.3, 'Ora il trucco: quell’immagine fa\nda {v:oggetto} per l’oculare.'],
  [39.5, 43.9, 'È a 3 cm dall’oculare:\ndentro il suo fuoco {mink:F₂}.'],
  [44.1, 48.5, 'I raggi proseguono, e l’oculare\nli piega: escono {r:divergenti}.'],
  [48.7, 53.1, 'Prolungati all’indietro si incontrano:\nimmagine {v:virtuale}, grandissima.'],
  [53.3, 57.9, 'Qui {mink:q} = −12 cm: virtuale.\nL’oculare ingrandisce 12/3 = 4.'],
  [58.1, 62.5, 'In tutto 2 · 4 = {g:8}: gli\ningrandimenti si {v:moltiplicano}.'],
  [63.0, 67.4, 'Il {v:cannocchiale}: obiettivo con focale\nlunga, oculare con focale corta.'],
  [67.6, 71.4, 'Da un punto lontanissimo\ni raggi arrivano {x:paralleli}.'],
  [71.6, 76.0, 'Si incontrano alla distanza {mink:f₁}:\nuna piccola immagine {g:reale}.'],
  [76.2, 80.6, 'Lì c’è anche il fuoco dell’oculare,\nche fa da {v:lente d’ingrandimento}.'],
  [80.8, 84.8, 'I raggi escono di nuovo paralleli,\nma {g:più inclinati}.'],
  [85.0, 89.6, 'Pendenza 1,5 su 10 all’entrata,\n6 su 10 all’uscita: {g:4 volte}.'],
  [89.8, 93.6, 'L’ingrandimento è {mink:f₁/f₂} = 12/3 = {g:4}.'],
  [95.5, 100.9, 'Due lenti in fila: la seconda ingrandisce\nl’immagine fatta dalla prima.'],
];

// ---------- aiutanti ----------
function raggio(ctx, pts, k, col, w = 4, al = 1) {   // spezzata che si disegna, con le punte a metà dei tratti lunghi
  if (k <= 0 || al <= 0.01) return;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  const fin = L[L.length - 1] * clamp(k);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
    if (m + 12 > fin || L[i] - L[i - 1] < 90) continue;
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), f = (m - L[i - 1]) / (L[i] - L[i - 1]);
    arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, 1.05);
  }
  ctx.restore();
}
function freccia(ctx, x, y0, y1, col, al = 1, tratt = false, w = 7) {   // oggetti e immagini: frecce verticali dall'asse
  if (al <= 0.01 || Math.abs(y1 - y0) < 4) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  if (tratt) ctx.setLineDash([12, 10]);
  const su = y1 < y0 ? -1 : 1;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 - su * 14); ctx.stroke(); ctx.setLineDash([]);
  arrowHead(ctx, [x, y1 + su * 2], su * Math.PI / 2, col, 1.15);
  ctx.restore();
}
function lente(ctx, x, ay, h, al = 1) {   // lente convergente: più spessa al centro
  if (al <= 0) return;
  const s = Math.min(24, h * .16);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.moveTo(x, ay - h); ctx.quadraticCurveTo(x + 2 * s, ay, x, ay + h); ctx.quadraticCurveTo(x - 2 * s, ay, x, ay - h); ctx.closePath();
  ctx.fillStyle = css(C.x, .16); ctx.fill(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
function chip(ctx, s, x, y, al = 1, size = 30, align = 'center') {   // scritta su un fondino, sopra raggi e assi
  if (al <= 0) return;
  const righe = s.split('\n'), h = size * (1.4 + 1.3 * (righe.length - 1));
  const w = Math.max(...righe.map(r => M.richW(ctx, r, size))) + 20, x0 = align === 'left' ? x - 10 : align === 'right' ? x - w + 10 : x - w / 2;
  ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x0, y - h / 2, w, h, 10); ctx.fill(); ctx.restore();
  drawRich(ctx, s, x, y, { size, align, alpha: al });
}
function occhio(ctx, x, y, r, al) {   // un occhio di profilo che guarda a sinistra; x è la pupilla
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.x, C.paper, .88)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x + r, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 4, y - r * .62); ctx.lineTo(x + 4, y - r * .22); ctx.moveTo(x + 4, y + r * .22); ctx.lineTo(x + 4, y + r * .62); ctx.stroke();
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(x + r, y, r - 4, -.8, .8); ctx.stroke();
  ctx.restore();
}
function asse(ctx, x0, x1, ay, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, ay); ctx.lineTo(x1, ay); ctx.stroke(); ctx.restore();
}
// un raggio parallelo all'asse: le lenti sottili in fila cambiano la pendenza di −y/f
function traccia(x0, y0, u0, lenti, xFine) {   // lenti: [[x, f], …] in cm, in ordine
  const pts = [[x0, y0]]; let x = x0, y = y0, u = u0;
  for (const [xl, f] of lenti) { y += u * (xl - x); x = xl; pts.push([x, y]); u -= y / f; }
  y += u * (xFine - x); pts.push([xFine, y]);
  return { pts, u };
}
function staffa(ctx, x0, x1, y, nome, al) {   // una distanza lungo l'asse, col nome in mezzo
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y - 10); ctx.lineTo(x0, y + 10); ctx.moveTo(x1, y - 10); ctx.lineTo(x1, y + 10); ctx.stroke();
  ctx.restore();
  chip(ctx, nome, (x0 + x1) / 2, y + 36, al, 30);
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due lenti in fila', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il microscopio: 60 px per cm, oggetto alto 0,8 cm ----------
const U = 60, X0 = 290, AY = 360, H_OGG = .8;
const OB = [3, 2], OC = [12, 4], X_FIN = 14.3;                 // [posizione, focale] in cm
const mpx = (x, y) => [X0 + x * U, AY - y * U];
const qDi = (p, f) => 1 / (1 / f - 1 / p);
const Q1 = qDi(OB[0], OB[1]), I1 = [OB[0] + Q1, -H_OGG * Q1 / OB[0]];                       // 6 cm, alta −1,6 cm
const P2 = OC[0] - I1[0], Q2 = qDi(P2, OC[1]), IF = [OC[0] + Q2, I1[1] * (-Q2 / P2)];      // −12 cm: in x = 0, alta −6,4 cm
const RM = [traccia(0, H_OGG, 0, [OB, OC], X_FIN), traccia(0, H_OGG, -H_OGG / OB[0], [OB, OC], X_FIN)];   // parallelo; per il centro
const tratto = (a, b) => [mpx(a[0], a[1]), mpx(b[0], b[1])];
function scenaMicroscopio(ctx, t) {
  if (t < 7.6 || t > 63.1) return;
  const al = 1 - P(t, 62.4, 63.0);
  ctx.save(); ctx.globalAlpha *= al;
  asse(ctx, 130, 1270, AY, P(t, 7.8, 8.4));
  lente(ctx, mpx(OB[0], 0)[0], AY, 1.3 * U, P(t, 8.0, 8.6));
  lente(ctx, mpx(OC[0], 0)[0], AY, 3.2 * U, P(t, 8.4, 9.0));
  chip(ctx, '{x:obiettivo}', mpx(OB[0], 0)[0], AY - 1.3 * U - 32, P(t, 8.6, 9.1));
  chip(ctx, '{x:oculare}', mpx(OC[0], 0)[0], AY + 3.2 * U + 36, P(t, 9.0, 9.5));
  // i fuochi: quelli dell'obiettivo con l'oggetto, quello dell'oculare quando serve
  const kF1 = P(t, 12.7, 13.2, E.back), kF2 = P(t, 39.7, 40.2, E.back);
  dot(ctx, mpx(OB[0] - OB[1], 0), C.v, kF1, 9); chip(ctx, '{mink:F₁}', mpx(OB[0] - OB[1], 0)[0], AY + 40, kF1, 34);
  dot(ctx, mpx(OB[0] + OB[1], 0), C.v, kF1, 9); chip(ctx, '{mink:F₁}', mpx(OB[0] + OB[1], 0)[0] + 26, AY - 34, kF1, 34);
  dot(ctx, mpx(OC[0] - OC[1], 0), C.v, kF2, 9); chip(ctx, '{mink:F₂}', mpx(OC[0] - OC[1], 0)[0], AY - 36, kF2, 34);
  // l'oggetto
  const kO = P(t, 12.6, 13.2);
  freccia(ctx, X0, AY, mpx(0, H_OGG)[1], C.ink, kO);
  chip(ctx, 'oggetto', X0 - 16, AY - 26, kO, 30, 'right');
  // i due raggi fino all'immagine dell'obiettivo, poi oltre, attraverso l'oculare
  const kA = [P(t, 17.3, 18.7, E.lin), P(t, 18.8, 20.2, E.lin)], kB = [P(t, 44.3, 45.7, E.lin), P(t, 44.6, 46.0, E.lin)];
  RM.forEach((R, i) => {
    raggio(ctx, [mpx(...R.pts[0]), mpx(...R.pts[1]), mpx(...I1)], kA[i], C.y);
    raggio(ctx, [mpx(...I1), mpx(...R.pts[2]), mpx(...R.pts[3])], kB[i], C.y);
  });
  chip(ctx, '{dim:all’occhio}', mpx(X_FIN, 0)[0] + 20, AY + 40, P(t, 45.8, 46.3), 30);
  // i prolungamenti all'indietro e l'immagine finale, virtuale
  const kD = P(t, 48.9, 50.3);
  RM.forEach(R => { if (kD > 0) dashed(ctx, ...tratto(R.pts[2], IF), C.v, kD, .9); });
  const kIF = P(t, 50.2, 50.9);
  freccia(ctx, X0, AY, mpx(0, IF[1])[1], C.v, kIF, true);
  chip(ctx, 'immagine finale,\n{v:virtuale}', X0 + 22, AY + 190, kIF, 30, 'left');
  // l'immagine dell'obiettivo: reale; poi oggetto per l'oculare
  const kI = P(t, 21.8, 22.5);
  if (kI > 0) {
    const kOgg = P(t, 35.3, 35.8);
    if (kOgg > 0) { ctx.save(); ctx.globalAlpha *= kOgg * (1 - P(t, 44.0, 44.5)) * .35; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(mpx(...I1)[0], AY + 48, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    freccia(ctx, mpx(I1[0], 0)[0], AY, mpx(...I1)[1], C.g, kI);
    chip(ctx, '{g:immagine reale}', mpx(I1[0], 0)[0] - 20, AY + 132, kI * (1 - kOgg), 30, 'right');
    chip(ctx, '{v:oggetto per l’oculare}', mpx(I1[0], 0)[0] - 20, AY + 132, kOgg, 30, 'right');
  }
  // la formula delle lenti, poi l'ingrandimento totale
  chip(ctx, '{mink:1/p + 1/q = 1/f}', 720, 168, life(t, 26.1, 35.0, .4, .4), 44);
  const kT = P(t, 58.3, 58.9, E.back);
  if (kT > 0) chip(ctx, 'ingrandimento: 2 · 4 = {g:8}', 720, 168, kT, 40);
  chip(ctx, '{dim:numeri da disegno: un microscopio vero}\n{dim:arriva a 40 · 10 = 400 e oltre}', 880, 722, P(t, 58.6, 59.1), 30);
  ctx.restore();
}

// ---------- il cannocchiale: 44 px per cm ----------
const U2 = 44, XT = 260, AY2 = 420, F_OB = 12, F_OC = 3, PEND = -.15, X_PUP = 1 / (1 / F_OC - 1 / (F_OB + F_OC));   // 3,75 cm dopo l'oculare
const tpx = (x, y) => [XT + x * U2, AY2 - y * U2];
const RT = [1.5, 0, -1.5].map(h => traccia(-3, h - PEND * 3, PEND, [[0, F_OB], [F_OB + F_OC, F_OC]], F_OB + F_OC + X_PUP));
const yFuoco = PEND * F_OB;                                   // dove si raccolgono: 1,8 cm sotto l'asse
function scenaCannocchiale(ctx, t) {
  if (t < 62.8 || t > T_FINE + .2) return;
  const al = P(t, 63.0, 63.6) * (1 - P(t, T_FINE - .4, T_FINE));
  ctx.save(); ctx.globalAlpha *= al;
  asse(ctx, 130, 1270, AY2, 1);
  lente(ctx, XT, AY2, 2.0 * U2, 1);
  lente(ctx, tpx(F_OB + F_OC, 0)[0], AY2, 2.9 * U2, 1);
  chip(ctx, '{x:obiettivo}', XT, AY2 - 2.0 * U2 - 32, 1);
  chip(ctx, '{x:oculare}', tpx(F_OB + F_OC, 0)[0], AY2 - 2.9 * U2 - 32, 1);
  staffa(ctx, XT, tpx(F_OB, 0)[0], AY2 + 175, '{mink:f₁} = 12 cm', P(t, 63.4, 64.0));
  staffa(ctx, tpx(F_OB, 0)[0], tpx(F_OB + F_OC, 0)[0], AY2 + 175, '{mink:f₂} = 3 cm', P(t, 64.0, 64.6));
  // i raggi: arrivano, si raccolgono nel fuoco, escono dall'oculare fino all'occhio
  const kA = P(t, 67.8, 69.0, E.lin), kB = P(t, 71.8, 73.0, E.lin), kC = P(t, 81.0, 82.4, E.lin);
  RT.forEach(R => {
    const pF = [F_OB, R.pts[1][1] + (R.pts[2][1] - R.pts[1][1]) * F_OB / (F_OB + F_OC)];
    raggio(ctx, [tpx(...R.pts[0]), tpx(...R.pts[1])], kA, C.y);
    raggio(ctx, [tpx(...R.pts[1]), tpx(...pF)], kB, C.y);
    raggio(ctx, [tpx(...pF), tpx(...R.pts[2]), tpx(...R.pts[3])], kC, C.y);
  });
  chip(ctx, '{dim:da un punto lontanissimo}', 330, AY2 - 175, P(t, 67.8, 68.4), 30);
  // il fuoco comune e la piccola immagine reale
  const kF = P(t, 73.0, 73.5, E.back), kF2 = P(t, 76.4, 76.9);
  dot(ctx, tpx(F_OB, 0), C.v, kF, 9);
  chip(ctx, '{mink:F₁}', tpx(F_OB, 0)[0], AY2 - 40, kF * (1 - kF2), 34);
  chip(ctx, '{mink:F₁} e {mink:F₂}', tpx(F_OB, 0)[0], AY2 - 40, kF2, 34);
  freccia(ctx, tpx(F_OB, 0)[0], AY2, tpx(F_OB, yFuoco)[1], C.g, P(t, 73.2, 73.8), false, 6);
  occhio(ctx, tpx(F_OB + F_OC + X_PUP, 0)[0], AY2, 1.2 * U2, P(t, 63.6, 64.2));
  chip(ctx, '{dim:occhio}', tpx(F_OB + F_OC + X_PUP, 0)[0] + 1.2 * U2, AY2 + 1.2 * U2 + 30, P(t, 63.6, 64.2));
  ctx.restore();
}

// ---------- la scheda a destra ----------
function riga(ctx, nome, val, y, al, col = C.ink, size = 34) {
  if (al <= 0.01) return;
  drawRich(ctx, nome, 1355, y, { size, align: 'left', alpha: al });
  drawRich(ctx, val, 1780, y, { size: size + 2, weight: 600, align: 'right', alpha: al, fill: css(col) });
}
function titoletto(ctx, s, y, al) { if (al > 0) conFont(TITOLI, () => drawRich(ctx, s, 1565, y, { size: 36, weight: 600, alpha: al })); }
function scenaScheda(ctx, t) {
  if (t < 7.6 || t > T_FINE + .2) return;
  card(ctx, 1320, 110, 490, 680, life(t, 7.8, T_FINE, .5, .5));
  ctx.save(); ctx.globalAlpha *= 1 - P(t, T_FINE - .4, T_FINE);
  // microscopio
  const aM = 1 - P(t, 62.4, 63.0);
  if (aM > 0) {
    ctx.save(); ctx.globalAlpha *= aM;
    titoletto(ctx, 'obiettivo', 160, P(t, 8.6, 9.1));
    const k1 = P(t, 12.7, 13.2);
    drawRich(ctx, '{dim:distanze dalla lente}', 1565, 202, { size: 28, alpha: k1 });
    riga(ctx, '{mink:f₁}{dim:  focale}', '2 cm', 250, k1);
    riga(ctx, '{mink:p₁}{dim:  oggetto}', '3 cm', 298, k1);
    riga(ctx, '{mink:q₁}{dim:  immagine}', '6 cm', 346, P(t, 21.9, 22.4), C.g);
    const kf = P(t, 26.1, 26.6);
    if (kf > 0) drawSeq(ctx, [{ num: '{mink:1}', den: '{mink:3}' }, '{mink:+}', { num: '{mink:1}', den: '{mink:6}' }, '{mink:=}', { num: '{mink:1}', den: '{mink:2}' }], 1565, 418, 34, { alpha: kf, local: t - 26.1 });
    riga(ctx, '{v:ingrandimento} {mink:q₁/p₁}', '2', 490, P(t, 30.7, 31.2), C.v);
    titoletto(ctx, 'oculare', 556, P(t, 39.7, 40.2));
    const k2 = P(t, 39.9, 40.4);
    riga(ctx, '{mink:f₂}{dim:  focale}', '4 cm', 608, k2);
    riga(ctx, '{mink:p₂}{dim:  oggetto}', '3 cm', 656, k2);
    riga(ctx, '{mink:q₂}{dim:  immagine}', '−12 cm', 704, P(t, 53.5, 54.0), C.v);
    riga(ctx, '{v:ingrandimento} {mink:12/3}', '4', 752, P(t, 55.6, 56.1), C.v);
    ctx.restore();
  }
  // cannocchiale
  const aT = P(t, 63.0, 63.6);
  if (aT > 0) {
    ctx.save(); ctx.globalAlpha *= aT;
    titoletto(ctx, 'cannocchiale', 165, 1);
    riga(ctx, '{x:obiettivo} {mink:f₁}', '12 cm', 235, 1);
    riga(ctx, '{x:oculare} {mink:f₂}', '3 cm', 290, 1);
    const kE = P(t, 85.2, 85.7), kU = P(t, 86.6, 87.1);
    if (kE > 0) { drawRich(ctx, '{dim:i raggi entrano}', 1565, 375, { size: 30, alpha: kE }); drawRich(ctx, 'giù di 1,5 cm ogni 10 cm', 1565, 420, { size: 34, alpha: kE }); }
    if (kU > 0) { drawRich(ctx, '{dim:ed escono}', 1565, 490, { size: 30, alpha: kU }); drawRich(ctx, 'su di {g:6 cm} ogni 10 cm', 1565, 535, { size: 34, alpha: kU }); }
    const kG = P(t, 90.0, 90.5);
    if (kG > 0) {
      drawRich(ctx, '{v:ingrandimento}', 1565, 625, { size: 34, alpha: kG });
      drawRich(ctx, '{mink:f₁/f₂} = 12/3 = {g:4}', 1565, 700, { size: 46, alpha: kG, local: t - 89.8 });
    }
    ctx.restore();
  }
  ctx.restore();
}

// il banco: la scheda dei disegni (7,5–T_FINE)
function scenaBanco(ctx, t) {
  if (t < 7.4 || t > T_FINE + .2) return;
  card(ctx, 110, 110, 1180, 680, life(t, 7.6, T_FINE, .6, .5));
}

// in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 101.6, 102.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'L’immagine della prima lente\nè l’oggetto della seconda.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, 'microscopio:\n2 · 4 = {g:8} volte'], [960, 'gli ingrandimenti\nsi {v:moltiplicano}'], [1430, 'cannocchiale:\n{mink:f₁/f₂} = 12/3 = {g:4}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): i raggi disegnati passano per le immagini date dalla formula
  const aX = (R, x) => { const p = R.pts; for (let i = 1; i < p.length; i++) if (x <= p[i][0] + 1e-9) return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); };
  const prol = R => { const a = R.pts[2], b = R.pts[3], u = (b[1] - a[1]) / (b[0] - a[0]); return a[1] + u * (IF[0] - a[0]); };
  const verifica = {
    q1: Q1, immagine1: I1, raggiInI1: RM.map(R => +aX(R, I1[0]).toFixed(9)), q2: Q2, finale: IF, prolungamentiInIF: RM.map(R => +prol(R).toFixed(9)),
    ingrandimenti: [Q1 / OB[0], -Q2 / P2, IF[1] / H_OGG],
    cannocchiale: { pendenzaUscita: RT.map(R => +R.u.toFixed(9)), rapporto: RT[0].u / PEND, alFuoco: RT.map(R => +aX(R, F_OB).toFixed(9)), allaPupilla: RT.map(R => +R.pts[3][1].toFixed(4)), pupillaCm: X_PUP },
  };
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 7.8, 8.4], ['pop', 8.5, .5],                         // l'asse, le due lenti
    ['pop', 12.9, .55],                                                               // l'oggetto e i fuochi
    ['traccia', 17.3, 18.7], ['traccia', 18.8, 20.2],                                 // parallelo e per il centro
    ['pop', 22.2, .6], ['ding', 22.5],                                                // l'immagine reale a 6 cm
    ['pop', 26.3, .5], ['ding', 27.2],                                                // la formula torna
    ['pop', 31.0, .55],                                                               // ingrandimento 2
    ['pop', 35.5, .45],                                                               // diventa l'oggetto dell'oculare
    ['pop', 40.0, .5],                                                                // il fuoco dell'oculare
    ['traccia', 44.3, 46.0],                                                          // i raggi escono divergenti
    ['traccia', 48.9, 50.3], ['pop', 50.6, .65],                                      // i prolungamenti: immagine finale
    ['pop', 53.7, .45], ['pop', 55.8, .55],                                           // q = -12 cm, ingrandimento 4
    ['pop', 58.6, .6],                                                                // in tutto 8
    ['soffio', 63.0], ['traccia', 63.4, 64.0], ['traccia', 64.0, 64.6],               // il cannocchiale: le due focali
    ['traccia', 67.8, 69.0], ['traccia', 71.8, 73.0],                                 // i raggi paralleli, fino al fuoco
    ['pop', 73.3, .55],                                                               // la piccola immagine reale
    ['traccia', 81.0, 82.4],                                                          // escono più inclinati
    ['pop', 85.4, .45], ['pop', 86.8, .55],                                           // 1,5 su 10 e 6 su 10
    ['pop', 90.2, .6],                                                                // ingrandimento 4
    ['soffio', 93.9], ['pop', 95.4, .5], ['pop', 95.9, .6], ['pop', 96.4, .7],        // in una frase
  ];
  return {
    titolo: 'Due lenti in fila', durata: 103.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 62.7, 'il microscopio'], [62.7, T_FINE, 'il cannocchiale']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBanco(ctx, t); scenaMicroscopio(ctx, t); scenaCannocchiale(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
