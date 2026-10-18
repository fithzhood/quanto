'use strict';
/* Le lampadine di casa — pila da 12 V, R₁ = 4 Ω e R₂ = 12 Ω. In serie: stessa corrente, R = R₁ + R₂ = 16 Ω,
   I = 0,75 A, V₁ = 3 V, V₂ = 9 V; con due lampadine, svitandone una il giro si apre e si spengono tutte e due.
   In parallelo, fra due nodi: stessa tensione 12 V, I₁ = 3 A, I₂ = 1 A, I = 4 A, R = 3 Ω (1/R = 1/4 + 1/12 = 1/3),
   minore della più piccola; svitandone una l'altra resta accesa: l'impianto di casa. Gli strumenti: amperometro in
   serie (resistenza piccolissima), voltmetro in parallelo (resistenza grandissima): segnano 3 A e 12 V su R₁. Frecce
   della corrente C.v lunghe in proporzione (80 px/A). Le lampadine, che non sono ohmiche, servono solo per lo svitare:
   i conti si fanno con le resistenze, e quando compaiono le lampadine i numeri delle correnti sfumano. Colori fissi
   della corrente: corrente C.v, tensione C.y. Argomento: corrente. */
CVIDEO.registra('corrente/serie-parallelo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 78.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.5, 'felice'], [23.9, 'neutro'],
  [29.8, 'sorpreso'], [35.1, 'neutro'], [45.9, 'felice'], [51.6, 'sorpreso'], [56.8, 'neutro'], [62.0, 'felice'],
  [67.5, 'neutro'], [80.4, 'felice'], [84.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Se si brucia una lampadina,\nperché le altre restano accese?'],
  [7.9, 13.0, 'Due resistenze in {g:serie}: una dopo\nl’altra, sullo stesso filo.'],
  [13.1, 18.4, 'La carica non ha altre strade: la\n{g:stessa corrente} {mv:I} passa in tutte e due.'],
  [18.5, 23.8, 'Le tensioni si dividono:\n3 V + 9 V = 12 V, quella della pila.'],
  [23.9, 29.7, 'In tutto {mink:R} = {mink:R₁} + {mink:R₂} = 16 Ω:\nla {g:resistenza equivalente}.'],
  [29.8, 35.0, 'Con due lampadine: ne svito una,\nil giro si apre, si spengono {r:tutte}.'],
  [35.1, 40.4, 'In {g:parallelo}: ognuna su un suo ramo,\nfra gli stessi due {g:nodi}.'],
  [40.5, 45.8, 'Un {g:nodo} è un punto dove il filo\nsi divide: lì la corrente si spartisce.'],
  [45.9, 51.5, 'Ogni ramo ha la {g:stessa tensione}, 12 V:\npassano 3 A e 1 A.'],
  [51.6, 56.7, 'In tutto 4 A, quindi {mink:R} = 3 Ω:\n{g:meno} della più piccola!'],
  [56.8, 61.9, 'Infatti 1/{mink:R} = 1/{mink:R₁} + 1/{mink:R₂}\n= 1/4 + 1/12 = 1/3.'],
  [62.0, 67.4, 'Svito una lampadina: l’altra resta\naccesa. In casa tutto è in {g:parallelo}.'],
  [67.5, 72.6, 'L’{g:amperometro} (corrente) va in {g:serie},\ncon resistenza piccolissima.'],
  [72.7, 77.8, 'Il {g:voltmetro} (tensione) va in {g:parallelo},\ncon resistenza grandissima.'],
  [80.4, 86.6, 'Serie: stessa corrente. Parallelo:\nstessa tensione, come in casa.'],
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
function pila(ctx, x, yc, al) {   // su un ramo verticale: il polo + (lungo e sottile) in alto
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 44, yc - 22, 88, 44);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, yc - 15); ctx.lineTo(x + 40, yc - 15); ctx.stroke();
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 20, yc + 15); ctx.lineTo(x + 20, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 62, yc - 32, { size: 40, weight: 600, color: C.v, alpha: al });
  txt(ctx, '−', x + 62, yc + 34, { size: 40, weight: 600, color: C.x, alpha: al });
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
// la lampadina: vetro e filamento lungo la direzione del filo (ang = 0 verticale, π/2 orizzontale)
function lampadina(ctx, c, r, luce, al = 1, ang = 0) {
  if (al <= 0) return;
  const caldo = mix(C.y, [255, 214, 90], .45);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(c[0], c[1]); ctx.rotate(ang);
  if (luce > 0) {
    const g = ctx.createRadialGradient(0, 0, r * .3, 0, 0, r * 2.2);
    g.addColorStop(0, css(caldo, .55 * luce)); g.addColorStop(1, css(caldo, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(caldo, luce); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) * TAU / 8; if (Math.abs(Math.cos(a)) < .3) continue;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * (r + 12), Math.sin(a) * (r + 12)); ctx.lineTo(Math.cos(a) * (r + 34), Math.sin(a) * (r + 34)); ctx.stroke();
    }
  }
  ctx.fillStyle = luce > 0 ? css(mix(C.paper, caldo, .35 * luce)) : C.paper;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(mix(C.ink, caldo, luce)); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, r); ctx.lineTo(0, r * .4);
  for (let i = 0; i <= 8; i++) ctx.lineTo((i % 2 ? 13 : -13) * (i && i < 8 ? 1 : 0), r * .4 - i * r * .1);
  ctx.lineTo(0, -r); ctx.stroke();
  ctx.restore();
}
function strumento(ctx, c, lettera, al = 1, r = 42) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, lettera, c[0], c[1] + 2, { size: 44, weight: 600, alpha: al });
}
function nodo(ctx, p, al) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.fill(); ctx.restore(); }
// ---------- i circuiti ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XB = 260, YT = 230, YG = 670, YC = 450, XR = 960, RLAMP = 46, PX_A = 80;
// un elemento fra a e b: resistenza che può diventare lampadina (kL), accesa (luce), svitata (spostata di d)
function elemento(ctx, a, b, kL, luce, d, al) {
  if (al <= 0) return;
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  resistenza(ctx, a, b, al * (1 - kL));
  if (kL > 0) {
    filo(ctx, [a, [c[0] - u[0] * RLAMP, c[1] - u[1] * RLAMP]], 1, al * kL);
    filo(ctx, [[c[0] + u[0] * RLAMP, c[1] + u[1] * RLAMP], b], 1, al * kL);
    lampadina(ctx, [c[0] + d[0], c[1] + d[1]], RLAMP, luce, al * kL, Math.abs(u[0]) > .5 ? Math.PI / 2 : 0);
  }
}
function etichetta(ctx, s, x, y, al, align = 'center', size = 34) { if (al > 0) drawRich(ctx, s, x, y, { size, align, alpha: al }); }
function generatore(ctx, al) { pila(ctx, XB, YC, al); etichetta(ctx, '{y:12 V}', 196, YC, al, 'right', 36); }

// 1 · in serie (7,5–35)
const iSerie = t => .75 * (1 - P(t, 31.8, 31.9));
function sceneSerie(ctx, t) {
  const al = life(t, 7.8, 35.3, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 8.0, 9.4, E.lin), kL = P(t, 30.0, 30.8), I = iSerie(t);
  filo(ctx, [[XB, YC - 15], [XB, YT], [420, YT]], kf);
  filo(ctx, [[560, YT], [700, YT]], kf);
  filo(ctx, [[860, YT], [XR, YT], [XR, YG], [XB, YG], [XB, YC + 15]], kf);
  const ke = P(t, 8.6, 9.2), luce = I > 0 ? 1 : 0;
  elemento(ctx, [420, YT], [560, YT], kL, luce, [0, 0], ke);
  elemento(ctx, [700, YT], [860, YT], kL, luce, [0, -62 * P(t, 31.6, 32.3)], ke);
  generatore(ctx, P(t, 8.0, 8.5));
  etichetta(ctx, '{mink:R₁} = 4 Ω', 490, 168, P(t, 8.8, 9.3) * (1 - kL));
  etichetta(ctx, '{mink:R₂} = 12 Ω', 780, 168, P(t, 9.0, 9.5) * (1 - kL));
  const kv = life(t, 18.6, 30.0, .4, .4);
  etichetta(ctx, '{y:3 V}', 490, 292, kv, 'center', 36); etichetta(ctx, '{y:9 V}', 780, 292, kv, 'center', 36);
  const kI = P(t, 13.3, 13.8);
  if (I > .01) freccia(ctx, [610 + PX_A * I / 2, YG + 42], [610 - PX_A * I / 2, YG + 42], C.v, kI, 7);
  etichetta(ctx, '{mv:I} = 0,75 A', 680, YG + 42, kI * (I > .01 ? 1 : 0) * (1 - kL), 'left');
  etichetta(ctx, '{r:circuito aperto: niente corrente}', 610, 560, P(t, 32.4, 32.9), 'center', 34);
  ctx.restore();
}
// 2 · in parallelo (35–67,5)
const i2Par = t => 1 - P(t, 63.6, 63.7);
function sceneParallelo(ctx, t) {
  const al = life(t, 35.2, 67.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 35.4, 36.8, E.lin), kL = P(t, 62.2, 63.0), I1 = 3, I2 = i2Par(t), I = I1 + I2;
  filo(ctx, [[XB, YC - 15], [XB, YT], [860, YT], [860, 360]], kf);
  filo(ctx, [[600, YT], [600, 360]], kf);
  filo(ctx, [[600, 540], [600, YG]], kf);
  filo(ctx, [[860, 540], [860, YG], [XB, YG], [XB, YC + 15]], kf);
  const ke = P(t, 36.0, 36.6);
  elemento(ctx, [600, 360], [600, 540], kL, 1, [0, 0], ke);
  elemento(ctx, [860, 360], [860, 540], kL, I2 > 0 ? 1 : 0, [86 * P(t, 63.4, 64.1), 0], ke);
  generatore(ctx, P(t, 35.4, 35.9));
  const kn = P(t, 40.6, 41.1);
  nodo(ctx, [600, YT], kn); nodo(ctx, [600, YG], kn);
  etichetta(ctx, '{dim:nodo}', 600, 186, kn * life(t, 40.6, 51.5, .4, .4), 'center', 30);
  etichetta(ctx, '{dim:nodo}', 600, 752, kn * life(t, 40.6, 51.5, .4, .4), 'center', 30);
  const kr = P(t, 36.4, 36.9) * (1 - kL);
  etichetta(ctx, '{mink:R₁} = 4 Ω', 565, 426, kr, 'right', 32);
  etichetta(ctx, '{mink:R₂} = 12 Ω', 925, 426, kr, 'left', 32);
  const kv = P(t, 46.0, 46.5) * (1 - kL);
  etichetta(ctx, '{y:12 V}', 565, 474, kv, 'right', 32); etichetta(ctx, '{y:12 V}', 925, 474, kv, 'left', 32);
  // le correnti, lunghe in proporzione: 3 A, 1 A e in tutto 4 A
  const kI = P(t, 46.6, 47.1);
  freccia(ctx, [700, 330], [700, 330 + PX_A * I1], C.v, kI, 7);
  // con la lampadina (più larga della resistenza) la freccia del ramo 2 sfuma: starebbe sul vetro
  if (I2 > .01) freccia(ctx, [900, 410], [900, 410 + PX_A * I2], C.v, kI * (1 - kL), 7);
  freccia(ctx, [590, YG + 42], [590 - PX_A * I, YG + 42], C.v, kI, 7);
  etichetta(ctx, '{v:3 A}', 720, 606, kI * (1 - kL), 'left', 32);
  etichetta(ctx, '{v:1 A}', 918, 540, kI * (I2 > .01 ? 1 : 0) * (1 - kL), 'left', 32);
  etichetta(ctx, '{mv:I} = 4 A', 430, 752, kI * (1 - kL) * (1 - life(t, 40.6, 51.5, .4, .4)), 'center', 32);
  ctx.restore();
}
// 3 · gli strumenti (67,5–78)
function sceneStrumenti(ctx, t) {
  const al = life(t, 67.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 67.7, 68.9, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], [558, YT]], kf);
  filo(ctx, [[642, YT], [860, YT], [860, 360]], kf);
  filo(ctx, [[860, 540], [860, YG], [XB, YG], [XB, YC + 15]], kf);
  resistenza(ctx, [860, 360], [860, 540], P(t, 68.0, 68.5));
  etichetta(ctx, '{mink:R₁} = 4 Ω', 820, 450, P(t, 68.0, 68.5), 'right', 34);
  generatore(ctx, P(t, 67.7, 68.2));
  const ka = P(t, 68.4, 68.9);
  strumento(ctx, [600, YT], 'A', ka);
  etichetta(ctx, '{v:3 A}', 600, 168, ka, 'center', 38);
  freccia(ctx, [560 + PX_A * 1.5, YG + 42], [560 - PX_A * 1.5, YG + 42], C.v, ka, 7);
  const kv = P(t, 72.9, 73.4);
  filo(ctx, [[860, 330], [1010, 330], [1010, 408]], 1, kv);
  filo(ctx, [[1010, 492], [1010, 570], [860, 570]], 1, kv);
  nodo(ctx, [860, 330], kv); nodo(ctx, [860, 570], kv);
  strumento(ctx, [1010, YC], 'V', kv);
  etichetta(ctx, '{y:12 V}', 1010, 616, kv, 'center', 38);
  ctx.restore();
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 35.1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'in serie', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:R}{dim:: resistenza, frena la corrente (Ω)}', cx, 232, { size: 30, local: t - 8.0 });
    drawRich(ctx, '{mink:R₁} = 4 Ω{dim:,} {mink:R₂} = 12 Ω', cx, 280, { size: 34, local: t - 8.8 });
    separa(ctx, 322, P(t, 13.1, 13.5));
    drawRich(ctx, '{dim:stessa corrente:} {mv:I} = 0,75 A', cx, 367, { size: 34, local: t - 13.3 });
    drawRich(ctx, '{dim:(carica al secondo, in ampere)}', cx, 410, { size: 30, local: t - 14.0 });
    separa(ctx, 452, P(t, 18.5, 18.9));
    drawRich(ctx, '{my:V₁} + {my:V₂} = 3 V + 9 V = 12 V', cx, 497, { size: 34, local: t - 18.6 });
    drawRich(ctx, '{dim:(tensioni, in volt)}', cx, 540, { size: 30, local: t - 19.6 });
    separa(ctx, 582, P(t, 23.9, 24.3));
    drawRich(ctx, '{mink:R} = {mink:R₁} + {mink:R₂} = {g:16 Ω}', cx, 632, { size: 38, local: t - 24.0 });
    drawRich(ctx, '{mv:I} = 12 V / 16 Ω = 0,75 A', cx, 688, { size: 34, local: t - 26.2 });
    drawRich(ctx, '{r:svitata una: niente corrente}', cx, 745, { size: 30, local: t - 32.4 });
  });
  blocco(35.1, 67.5, () => {
    conFont(TITOLI, () => drawRich(ctx, 'in parallelo', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:nodo}{dim:: dove il filo si divide}', cx, 232, { size: 32, local: t - 40.6 });
    separa(ctx, 278, P(t, 45.9, 46.3));
    drawRich(ctx, '{dim:stessa tensione:} {y:12 V}', cx, 322, { size: 34, local: t - 46.0 });
    drawRich(ctx, '{mv:I₁} = 12 V / 4 Ω = 3 A', cx, 370, { size: 34, local: t - 46.8 });
    drawRich(ctx, '{mv:I₂} = 12 V / 12 Ω = 1 A', cx, 416, { size: 34, local: t - 47.4 });
    drawRich(ctx, '{mv:I} = 3 A + 1 A = 4 A', cx, 462, { size: 34, local: t - 51.7 });
    separa(ctx, 506, P(t, 51.6, 52.0));
    drawRich(ctx, '{mink:R} = 12 V / 4 A = {g:3 Ω}', cx, 552, { size: 38, local: t - 51.8 });
    drawRich(ctx, '1/{mink:R} = 1/{mink:R₁} + 1/{mink:R₂}', cx, 608, { size: 34, local: t - 56.9 });
    drawRich(ctx, '1/4 + 1/12 = 4/12 = 1/3', cx, 656, { size: 32, local: t - 58.6 });
    drawRich(ctx, '{dim:in casa: tutto in parallelo}', cx, 735, { size: 30, local: t - 64.6 });
  });
  blocco(67.5, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'gli strumenti', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:amperometro}{dim:: misura la corrente}', cx, 245, { size: 32, local: t - 67.7 });
    drawRich(ctx, '{dim:in serie: ci passa la stessa corrente}', cx, 295, { size: 30, local: t - 68.6 });
    drawRich(ctx, '{dim:resistenza piccolissima,}', cx, 340, { size: 30, local: t - 69.6 });
    drawRich(ctx, '{dim:per non frenare la corrente}', cx, 380, { size: 30, local: t - 70.2 });
    separa(ctx, 430, P(t, 72.7, 73.1));
    drawRich(ctx, '{g:voltmetro}{dim:: misura la tensione}', cx, 480, { size: 32, local: t - 72.8 });
    drawRich(ctx, '{dim:in parallelo: ha la stessa tensione}', cx, 530, { size: 30, local: t - 73.7 });
    drawRich(ctx, '{dim:resistenza grandissima,}', cx, 575, { size: 30, local: t - 74.7 });
    drawRich(ctx, '{dim:per non rubare corrente}', cx, 615, { size: 30, local: t - 75.3 });
  });
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le lampadine di casa', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 87.3, 88.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'In serie è uguale la corrente,\nin parallelo la tensione.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[430, '{dim:serie:} {mink:R} = {mink:R₁} + {mink:R₂}\n{dim:svitata una, si spegne tutto}'], [960, '{dim:parallelo:} 1/{mink:R} = 1/{mink:R₁} + 1/{mink:R₂}\n{dim:l’impianto di casa}'], [1490, 'amperometro in serie,\nvoltmetro in parallelo']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 255, 445, 510, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.0, 9.4], ['pop', 8.2, .4], ['pop', 8.8, .5],       // in serie: il circuito, la pila, R₁ e R₂
    ['pop', 13.4, .5], ['pop', 18.7, .5],                                             // la stessa corrente; 3 V e 9 V
    ['pop', 24.1, .6], ['ding', 26.4],                                                // R = 16 Ω, I = 0,75 A
    ['pop', 30.4, .55],                                                               // diventano lampadine, accese
    ['tono', 31.6, 32.3, [.5, .62, .78, .8]], ['pop', 31.85, .2], ['pop', 32.5, .3],  // ne svito una: si spengono tutte
    ['soffio', 35.3], ['traccia', 35.4, 36.8], ['pop', 35.5, .4], ['pop', 36.1, .5],  // in parallelo
    ['pop', 40.7, .5],                                                                // i nodi
    ['pop', 46.1, .5], ['pop', 46.7, .55],                                            // 12 V su ogni ramo, 3 A e 1 A
    ['pop', 51.8, .6], ['ding', 52.2],                                                // 4 A in tutto, R = 3 Ω
    ['pop', 57.0, .5], ['ding', 59.0],                                                // 1/R = 1/4 + 1/12 = 1/3
    ['pop', 62.6, .55], ['pop', 63.65, .3],                                           // le lampadine; svitata una, l'altra resta accesa
    ['soffio', 67.6], ['traccia', 67.7, 68.9], ['pop', 68.1, .45], ['pop', 68.6, .55],   // gli strumenti: l'amperometro
    ['traccia', 72.9, 73.4], ['pop', 73.2, .6],                                       // il voltmetro
    ['soffio', 78.1], ['pop', 80.2, .5], ['pop', 80.7, .6], ['pop', 81.2, .7],        // in una frase
  ];
  return {
    titolo: 'Le lampadine di casa', durata: 89, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.0, 'in serie'], [35.0, 67.4, 'in parallelo'], [67.4, T_FINE, 'amperometro e voltmetro']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneSerie(ctx, t); sceneParallelo(ctx, t); sceneStrumenti(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
