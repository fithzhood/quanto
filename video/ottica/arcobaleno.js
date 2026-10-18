'use strict';
/* Perché c'è l'arcobaleno — dispersione nel prisma; nella goccia la luce entra, si riflette una volta ed esce, e i colori si
   separano: il rosso torna a circa 42° dalla direzione opposta al Sole, il violetto a circa 40°; rosso fuori, violetto dentro;
   il Sole alle spalle. Nella goccia gli indici dell'acqua sono quelli veri; nel prisma la dispersione è ingrandita (lo si dice).
   Argomento: ottica. */
CVIDEO.registra('ottica/arcobaleno', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [89.8, 190], [91.1, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [89.8, 1050], [91.1, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [89.8, 2.2], [91.1, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [89.8, 2], [91.1, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [89.8, -1.5], [91.1, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.2, 'sorpreso'], [16.8, 'neutro'],
  [26.2, 'felice'], [30.6, 'neutro'], [39.4, 'sorpreso'], [44.0, 'pensa'], [48.6, 'neutro'], [57.8, 'felice'],
  [62.4, 'neutro'], [67.0, 'felice'], [71.6, 'neutro'], [76.4, 'festa'], [81.0, 'felice'], [85.2, 'neutro'],
  [92.0, 'felice'], [97.9, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Da dove vengono i colori\ndell’arcobaleno?'],
  [7.75, 12.0, 'La luce bianca del Sole\nentra in un prisma di vetro…'],
  [12.2, 16.6, '…ed esce a ventaglio: {g:tutti}\n{g:i colori}, dal rosso al violetto.'],
  [16.8, 21.2, 'Ogni colore si piega diversamente:\nil {v:violetto} più del rosso.'],
  [21.4, 25.8, 'L’indice di rifrazione dipende\ndal colore: è la {v:dispersione}.'],
  [26.2, 30.4, 'In una goccia di pioggia\nsuccede la stessa cosa.'],
  [30.6, 34.8, 'La luce del Sole entra\nnella goccia e si piega…'],
  [35.0, 39.2, '…si {v:riflette} una volta\nsul fondo della goccia…'],
  [39.4, 43.8, '…ed esce piegandosi di nuovo:\ni colori si {g:separano}.'],
  [44.0, 48.4, 'Torna quasi indietro, verso\nil lato da cui arriva il Sole.'],
  [48.6, 53.2, 'Il rosso esce a circa 42° dalla\ndirezione opposta al Sole…'],
  [53.4, 57.4, '…il violetto a circa 40°.'],
  [57.8, 62.2, 'Ora da lontano: il Sole\nè {g:alle spalle} di chi guarda.'],
  [62.4, 66.8, 'Il tratteggio è la direzione\nopposta al Sole: va verso l’ombra.'],
  [67.0, 71.4, 'Da questa goccia, a 42°,\nall’occhio arriva il rosso.'],
  [71.6, 76.0, 'Da quella appena più in basso,\na 40°, arriva il violetto.'],
  [76.4, 80.8, 'Le gocce a 42° formano un arco:\nil rosso sta {g:fuori}…'],
  [81.0, 85.0, '…e il violetto {g:dentro}.'],
  [85.2, 89.6, 'Per questo l’arcobaleno si vede\nsolo con il Sole {g:alle spalle}.'],
  [92.0, 97.8, 'Ogni goccia separa i colori:\nrosso fuori, violetto dentro.'],
];

// ---------- aiutanti ----------
const RAD = Math.PI / 180;
// i colori dell'arcobaleno sono colori veri, uguali nei due temi (non sono colori di significato)
const SPETTRO = [
  { nome: 'rosso', col: '#e53935', nAcqua: 1.3311 }, { nome: 'arancione', col: '#fb8c00', nAcqua: 1.3320 },
  { nome: 'giallo', col: '#f2c200', nAcqua: 1.3330 }, { nome: 'verde', col: '#43a047', nAcqua: 1.3345 },
  { nome: 'blu', col: '#1e88e5', nAcqua: 1.3375 }, { nome: 'violetto', col: '#8e24aa', nAcqua: 1.3445 },   // il violetto più estremo, verso i 390 nm
];
const lung = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
function tratto(ctx, pts, k, col, w = 4, al = 1, punte = true) {
  if (k <= 0 || al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  if (punte) {
    const L = lung(pts), fin = L[L.length - 1] * clamp(k);
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
      if (m + 12 > fin || L[i] - L[i - 1] < 80) continue;
      const f = (m - L[i - 1]) / (L[i] - L[i - 1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, w / 4);
    }
  }
  ctx.restore();
}
// la luce bianca: un tratto bianco bordato di grigio, che si legge su tutti e due i temi
function bianca(ctx, pts, k, al = 1) {
  if (k <= 0 || al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 11; M.partial(ctx, pts, k);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; const e = M.partial(ctx, pts, k);
  if (e && k > .3) arrowHead(ctx, e[0], e[1], C.dim, 1.1);
  ctx.restore();
}
// rifrazione vettoriale: d direzione, nrm normale verso chi arriva, n1 → n2
function rifrangi(d, nrm, n1, n2) {
  const c = -(d[0] * nrm[0] + d[1] * nrm[1]), e = n1 / n2, k = 1 - e * e * (1 - c * c);
  if (k < 0) return null;
  const f = e * c - Math.sqrt(k); return [e * d[0] + f * nrm[0], e * d[1] + f * nrm[1]];
}
function arco(ctx, c, a0, a1, r, col, k = 1, w = 4) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(c[0], c[1], r, a0, lerp(a0, a1, clamp(k)), a1 < a0); ctx.stroke(); ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché c’è l’arcobaleno', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il prisma (7,5–26): triangolo equilatero di vetro; la dispersione è ingrandita circa tre volte per vederla
const PA = [760, 250], PBL = [590, 250 + 340 * Math.sqrt(3) / 2], PBR = [930, 250 + 340 * Math.sqrt(3) / 2];
const SCHERMO = 1640;
const N_SX = [-Math.sqrt(3) / 2, -.5], N_DX = [Math.sqrt(3) / 2, -.5];   // normali verso l'esterno delle due facce
const P_IN = [lerp(PBL[0], PA[0], .45), lerp(PBL[1], PA[1], .45)], D0 = [Math.cos(-20 * RAD), Math.sin(-20 * RAD)];
const P_START = [P_IN[0] - D0[0] * 560, P_IN[1] - D0[1] * 560];
function interseca(p, d, a, b) {   // il raggio p + s·d con il segmento ab
  const ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
  const s = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den;
  return [p[0] + d[0] * s, p[1] + d[1] * s];
}
const PRISMA = SPETTRO.map((S, i) => {
  const n = 1.50 + .012 * i;
  const d1 = rifrangi(D0, N_SX, 1, n), P2 = interseca(P_IN, d1, PA, PBR);
  const d2 = rifrangi(d1, [-N_DX[0], -N_DX[1]], n, 1), k = (SCHERMO - P2[0]) / d2[0];
  return { ...S, n, P2, fine: [SCHERMO, P2[1] + d2[1] * k] };
});
function scenePrisma(ctx, t) {
  if (t < 7.4 || t > 26.4) return;
  const al = life(t, 7.6, 26.0, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il prisma
  ctx.beginPath(); ctx.moveTo(...PA); ctx.lineTo(...PBR); ctx.lineTo(...PBL); ctx.closePath();
  ctx.fillStyle = css(C.x, .12); ctx.fill(); ctx.strokeStyle = css(mix(C.x, C.ink, .3)); ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
  txt(ctx, 'prisma di vetro', PA[0], PBL[1] + 40, { size: 30, color: C.dim });
  // lo schermo
  ctx.fillStyle = css(C.dim, .45); ctx.fillRect(SCHERMO, 430, 14, 340);
  txt(ctx, 'schermo', SCHERMO + 7, 404, { size: 30, color: C.dim });
  // la luce bianca, poi i colori: dentro il vetro e fuori, fino allo schermo
  bianca(ctx, [P_START, P_IN], P(t, 8.2, 9.4, E.lin));
  txt(ctx, 'luce bianca', 360, 620, { size: 30, color: C.dim, alpha: P(t, 8.8, 9.3) });
  const k1 = P(t, 12.3, 13.0, E.lin), k2 = P(t, 13.0, 14.4, E.lin);
  PRISMA.forEach(R => {
    tratto(ctx, [P_IN, R.P2], k1, R.col, 3, 1, false);
    tratto(ctx, [R.P2, R.fine], k2, R.col, 4, 1, R === PRISMA[0] || R === PRISMA[5]);
  });
  // i nomi dei due estremi, sullo schermo
  const kn = P(t, 14.6, 15.1);
  txt(ctx, 'rosso', SCHERMO + 32, PRISMA[0].fine[1], { size: 32, weight: 600, color: PRISMA[0].col, align: 'left', alpha: kn });
  txt(ctx, 'violetto', SCHERMO + 32, PRISMA[5].fine[1], { size: 32, weight: 600, color: PRISMA[5].col, align: 'left', alpha: kn });
  drawRich(ctx, '{dim:nel disegno i colori sono più separati che nella realtà}', 1780, 160, { size: 30, align: 'right', alpha: P(t, 15.0, 15.5) });
  ctx.restore();
}

// 2 · la goccia (26–57,6): indici dell'acqua veri; la luce del Sole scende con 40° di inclinazione, così i colori usciti attraversano quasi tutta la scheda
const GC = [1420, 470], GR = 220, SOLE = 40 * RAD, DS = [Math.cos(SOLE), Math.sin(SOLE)], B_IMP = .861;
function cerchio(p, d) {
  const ox = p[0] - GC[0], oy = p[1] - GC[1], b = ox * d[0] + oy * d[1], c = ox * ox + oy * oy - GR * GR, D = b * b - c;
  const s1 = -b - Math.sqrt(D), s2 = -b + Math.sqrt(D), s = s1 > 1e-6 ? s1 : s2;
  return [p[0] + d[0] * s, p[1] + d[1] * s];
}
const nor = p => [(p[0] - GC[0]) / GR, (p[1] - GC[1]) / GR];
function finoAlBordo(p, d) {
  let k = 1e9;
  if (d[0] < 0) k = Math.min(k, (130 - p[0]) / d[0]); if (d[0] > 0) k = Math.min(k, (1790 - p[0]) / d[0]);
  if (d[1] < 0) k = Math.min(k, (130 - p[1]) / d[1]); if (d[1] > 0) k = Math.min(k, (775 - p[1]) / d[1]);
  return [p[0] + d[0] * k, p[1] + d[1] * k];
}
const G_LINEA = [GC[0] + B_IMP * GR * Math.sin(SOLE), GC[1] - B_IMP * GR * Math.cos(SOLE)];   // la retta del raggio di Sole
const G_P1 = cerchio([G_LINEA[0] - DS[0] * 1000, G_LINEA[1] - DS[1] * 1000], DS);
const G_START = finoAlBordo(G_P1, [-DS[0], -DS[1]]);
const GOCCIA = SPETTRO.map(S => {
  const n = S.nAcqua;
  const d1 = rifrangi(DS, nor(G_P1), 1, n), P2 = cerchio(G_P1, d1), n2 = nor(P2);
  const dn = d1[0] * n2[0] + d1[1] * n2[1], d2 = [d1[0] - 2 * dn * n2[0], d1[1] - 2 * dn * n2[1]];
  const P3 = cerchio(P2, d2), n3 = nor(P3), d3 = rifrangi(d2, [-n3[0], -n3[1]], n, 1);
  const angolo = Math.acos(-(d3[0] * DS[0] + d3[1] * DS[1]));   // dalla direzione opposta al Sole
  return { ...S, P2, P3, d3, fine: finoAlBordo(P3, d3), angolo };
});
function goccia(ctx, al = 1) {
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(GC[0] - GR * .35, GC[1] - GR * .4, GR * .1, GC[0], GC[1], GR);
  g.addColorStop(0, 'rgba(215,240,255,.55)'); g.addColorStop(1, 'rgba(70,150,220,.30)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(GC[0], GC[1], GR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(mix(C.x, C.ink, .2)); ctx.lineWidth = 3; ctx.stroke();
  // il riflesso, come nella goccia di Stilla
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(GC[0] - GR * .45, GC[1] - GR * .3, GR * .09, GR * .22, .5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(GC[0] - GR * .3, GC[1] - GR * .58, GR * .05, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function sceneGoccia(ctx, t) {
  if (t < 25.8 || t > 58) return;
  const al = life(t, 26.0, 57.6, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  goccia(ctx, P(t, 26.3, 27.0));
  txt(ctx, 'una goccia d’acqua, ingrandita', GC[0], GC[1] + GR + 34, { size: 30, color: C.dim, alpha: life(t, 26.5, 39.2, .5, .4) });
  bianca(ctx, [G_START, G_P1], P(t, 30.8, 31.6, E.lin));
  drawRich(ctx, '{dim:luce del Sole}', G_START[0] - 30, G_START[1] + 40, { size: 30, align: 'right', alpha: P(t, 31.0, 31.5) });
  const k1 = P(t, 31.7, 33.2, E.lin), k2 = P(t, 35.2, 36.6, E.lin), k3 = P(t, 39.6, 41.2, E.lin);
  GOCCIA.forEach(G => {
    tratto(ctx, [G_P1, G.P2], k1, G.col, 3.5, .9, false);
    tratto(ctx, [G.P2, G.P3], k2, G.col, 3.5, .9, false);
    tratto(ctx, [G.P3, G.fine], k3, G.col, 6, 1, G === GOCCIA[0] || G === GOCCIA[5]);
  });
  // la direzione opposta al Sole, e gli angoli del rosso e del violetto
  const P3 = GOCCIA[0].P3, aOpp = Math.atan2(-DS[1], -DS[0]);
  const ko = P(t, 48.8, 49.4);
  if (ko > 0) {
    dashed(ctx, P3, [P3[0] - DS[0] * 420, P3[1] - DS[1] * 420], C.dim, ko, 1);
    drawRich(ctx, '{dim:opposto al Sole}', P3[0] - DS[0] * 430 - 12, P3[1] - DS[1] * 430 - 6, { size: 30, align: 'right', alpha: ko });
  }
  [[0, 49.2, 190, C.r], [5, 53.6, 300, C.v]].forEach(([i, t0, r, col]) => {
    const G = GOCCIA[i], a1 = Math.atan2(G.d3[1], G.d3[0]), k = P(t, t0, t0 + .7);
    if (k <= 0) return;
    arco(ctx, G.P3, aOpp + 2 * Math.PI * (aOpp < a1 ? 1 : 0), a1, r, col, k, 4);
    // il valore sta in una legenda in alto a sinistra: nello spicchio fra le due misure non c'è posto
    const yl = 205 + (i ? 60 : 0);
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(180, yl); ctx.lineTo(220, yl); ctx.stroke(); ctx.restore();   // il colore del suo arco
    drawRich(ctx, (i ? '{v:violetto}' : '{r:rosso}') + '  ≈ ' + Math.round(G.angolo / RAD) + '°', 240, yl, { size: 36, align: 'left', alpha: k });
  });
  ctx.restore();
}

// 3 · da lontano (57,6–76,2): chi guarda, il Sole alto 20° alle sue spalle, due gocce a 900 px
const OCC = [330, 600], SUOLO = 720, ALTO = 20 * RAD, DSOLE = [Math.cos(ALTO), Math.sin(ALTO)];
const ANG_R = GOCCIA[0].angolo, ANG_V = GOCCIA[5].angolo;
const GOC = [[ANG_R, 0], [ANG_V, 5]].map(([ang, i]) => {
  const el = ang - ALTO;   // altezza sull'orizzonte: angolo dall'opposto al Sole meno l'altezza del Sole
  return { i, ang, p: [OCC[0] + 900 * Math.cos(el), OCC[1] - 900 * Math.sin(el)] };
});
function persona(ctx, x, piedi, al = 1) {   // di profilo, guarda a destra; l'occhio è OCC
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.ink); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x - 8, OCC[1], 24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 10, OCC[1] + 24); ctx.lineTo(x - 10, piedi - 52); ctx.moveTo(x - 10, piedi - 52); ctx.lineTo(x - 26, piedi); ctx.moveTo(x - 10, piedi - 52); ctx.lineTo(x + 6, piedi);
  ctx.moveTo(x - 10, OCC[1] + 44); ctx.lineTo(x + 8, OCC[1] + 80); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + 6, OCC[1] - 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function sole(ctx, x, y, al = 1) {
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = '#f9c80e'; ctx.strokeStyle = '#f9a80e'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + 40 * Math.cos(a), y + 40 * Math.sin(a)); ctx.lineTo(x + 54 * Math.cos(a), y + 54 * Math.sin(a)); ctx.stroke(); }
  ctx.restore();
}
function sceneLontano(ctx, t) {
  if (t < 57.4 || t > 76.6) return;
  const al = life(t, 57.6, 76.2, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.g, .14); ctx.fillRect(112, SUOLO, 1696, 776 - SUOLO);
  ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, SUOLO); ctx.lineTo(1808, SUOLO); ctx.stroke();
  // il Sole sta sulla retta del raggio che sfiora la testa, sul bordo sinistro
  const SOLE_P = [180, OCC[1] - (OCC[0] - 180) * Math.tan(ALTO)];
  sole(ctx, SOLE_P[0], SOLE_P[1], P(t, 57.9, 58.4));
  drawRich(ctx, '{dim:il Sole, lontano, alle spalle}', 150, SOLE_P[1] - 78, { size: 30, align: 'left', alpha: P(t, 58.1, 58.6) });
  // i raggi del Sole: paralleli, uno sfiora la testa, gli altri arrivano alle gocce
  const ks = P(t, 58.4, 59.6, E.lin);
  [OCC, ...GOC.map(G => G.p)].forEach((p, j) => {
    const da = j ? finoAlBordo(p, [-DSOLE[0], -DSOLE[1]]) : [SOLE_P[0] + 58 * Math.cos(ALTO), SOLE_P[1] + 58 * Math.sin(ALTO)];
    bianca(ctx, [da, [p[0] - DSOLE[0] * (j ? 12 : 30), p[1] - DSOLE[1] * (j ? 12 : 30)]], ks, .9);
  });
  // la direzione opposta al Sole, dall'occhio verso l'ombra
  const ko = P(t, 62.6, 63.4);
  dashed(ctx, OCC, [OCC[0] + DSOLE[0] * 470, OCC[1] + DSOLE[1] * 470], C.dim, ko, 1);
  drawRich(ctx, '{dim:opposto al Sole}', OCC[0] + DSOLE[0] * 470 + 16, OCC[1] + DSOLE[1] * 470 + 4, { size: 30, align: 'left', alpha: ko });
  persona(ctx, OCC[0], SUOLO, P(t, 57.8, 58.3));
  // le due gocce: ciascuna rimanda tutti i colori, a ventaglio; all'occhio ne arriva uno solo
  GOC.forEach((G, j) => {
    const t0 = j ? 71.8 : 67.2, k = P(t, t0, t0 + 1.4, E.lin);
    ctx.save(); ctx.fillStyle = 'rgba(110,180,240,.85)'; ctx.strokeStyle = css(mix(C.x, C.ink, .2)); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(G.p[0], G.p[1], 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    if (k <= 0) return;
    GOCCIA.forEach((S, c) => {
      const a = Math.atan2(DSOLE[1], DSOLE[0]) - S.angolo + Math.PI;   // direzione d'uscita del colore c
      const L = c === G.i ? Math.hypot(OCC[0] - G.p[0], OCC[1] - G.p[1]) - 30 : 170;
      tratto(ctx, [G.p, [G.p[0] + L * Math.cos(a), G.p[1] + L * Math.sin(a)]], k, S.col, c === G.i ? 4 : 2.5, c === G.i ? 1 : .55, c === G.i);
    });
    const col = j ? C.v : C.r;
    arco(ctx, OCC, Math.atan2(DSOLE[1], DSOLE[0]), -(G.ang - ALTO), j ? 230 : 160, col, P(t, t0 + 1.2, t0 + 1.8), 4);
    drawRich(ctx, (j ? '{v:violetto}' : '{r:rosso}') + ', ≈ ' + Math.round(G.ang / RAD) + '°', G.p[0] + 28, G.p[1] + (j ? 26 : -26), { size: 32, align: 'left', alpha: P(t, t0 + 1.2, t0 + 1.7) });
  });
  ctx.restore();
}

// 4 · l'arco nel cielo (76,2–89,8): visto da chi guarda; centro nella direzione opposta al Sole, 20° sotto l'orizzonte
const ORIZZ = 600, PXG = 540 / (ANG_R / RAD), CENTRO = [960, ORIZZ + 20 * PXG];
function sceneCielo(ctx, t) {
  if (t < 76.0 || t > 90.2) return;
  const al = life(t, 76.2, 89.8, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 22); ctx.clip();
  ctx.fillStyle = css(C.x, .1); ctx.fillRect(112, 112, 1696, ORIZZ - 112);
  ctx.fillStyle = css(C.g, .14); ctx.fillRect(112, ORIZZ, 1696, 788 - ORIZZ);
  // l'arco: un colore per anello, alla sua distanza angolare vera (in proporzione)
  ctx.beginPath(); ctx.rect(112, 112, 1696, ORIZZ - 112); ctx.clip();
  const k = P(t, 76.6, 78.6);
  GOCCIA.forEach(S => {
    const r = S.angolo / RAD * PXG, a0 = Math.PI + Math.asin((CENTRO[1] - ORIZZ) / r);
    ctx.save(); ctx.strokeStyle = S.col; ctx.lineWidth = 6; ctx.shadowColor = S.col; ctx.shadowBlur = 10 * (C.glow || .3);
    ctx.beginPath(); ctx.arc(CENTRO[0], CENTRO[1], r, a0, a0 + (3 * Math.PI - 2 * a0) * k); ctx.stroke(); ctx.restore();
  });
  ctx.restore();
  ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, ORIZZ); ctx.lineTo(1808, ORIZZ); ctx.stroke();
  const rR = ANG_R / RAD * PXG, rV = ANG_V / RAD * PXG;
  txt(ctx, 'rosso, fuori', CENTRO[0], CENTRO[1] - rR - 34, { size: 32, weight: 600, color: GOCCIA[0].col, alpha: P(t, 77.6, 78.1) });
  txt(ctx, 'violetto, dentro', CENTRO[0], CENTRO[1] - rV + 40, { size: 32, weight: 600, color: GOCCIA[5].col, alpha: P(t, 81.2, 81.7) });
  // chi guarda, di spalle; il Sole è dietro di lui
  ctx.save(); ctx.fillStyle = css(C.ink);
  ctx.beginPath(); ctx.arc(960, 690, 26, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(925, 718, 70, 70, [26, 26, 0, 0]); ctx.fill(); ctx.restore();
  drawRich(ctx, '{dim:il Sole è alle spalle di chi guarda}', 1780, 750, { size: 30, align: 'right', alpha: P(t, 85.4, 85.9) });
  ctx.restore();
}

// 5 · in una frase (89,8–100,6)
function sceneFine(ctx, t) {
  if (t < 89.8) return;
  const al = 1 - P(t, 98.8, 99.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 90.0 });
    drawRich(ctx, 'Ogni goccia piega i colori in modo\ndiverso e li rimanda indietro.', W / 2, 290, { size: 68, weight: 600, local: t - 90.4, stagger: .09 });
  });
  const pills = [[490, 'il {v:violetto} si piega\npiù del rosso'], [960, 'rosso a circa 42°,\nvioletto a circa 40°'], [1430, 'il Sole sempre\n{g:alle spalle}']];
  pills.forEach(([x, s], i) => {
    const a = 92.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.2, 9.4],                                           // il prisma, la luce bianca
    ['traccia', 12.3, 13.0], ['traccia', 13.0, 14.4], ['ding', 14.4],                 // i colori a ventaglio
    ['pop', 14.8, .5],                                                                // rosso e violetto
    ['soffio', 26.0], ['pop', 26.6, .5],                                              // la goccia
    ['traccia', 30.8, 31.6], ['traccia', 31.7, 33.2],                                 // la luce entra e si piega
    ['traccia', 35.2, 36.6], ['pop', 35.2, .45],                                      // si riflette sul fondo
    ['traccia', 39.6, 41.2], ['ding', 41.2],                                          // esce: i colori si separano
    ['traccia', 48.8, 49.4],                                                          // opposto al Sole
    ['traccia', 49.2, 49.9], ['pop', 49.9, .5],                                       // il rosso a 42 gradi
    ['traccia', 53.6, 54.3], ['pop', 54.3, .55],                                     // il violetto a 40 gradi
    ['soffio', 57.6], ['pop', 58.0, .4], ['pop', 58.2, .55], ['traccia', 58.4, 59.6], // da lontano: chi guarda, il Sole
    ['traccia', 62.6, 63.4],                                                          // opposto al Sole
    ['traccia', 67.2, 68.6], ['traccia', 68.4, 69.0], ['pop', 68.6, .5],              // la goccia del rosso
    ['traccia', 71.8, 73.2], ['traccia', 73.0, 73.6], ['pop', 73.2, .45],             // la goccia del violetto
    ['soffio', 76.2], ['tono', 76.6, 78.6, [0, .03, .22, .64, 1, .64, .22, .03, 0]],  // l'arco nel cielo
    ['pop', 77.8, .5], ['pop', 81.4, .45],                                            // rosso fuori, violetto dentro
    ['soffio', 89.9], ['pop', 92.0, .5], ['pop', 92.5, .6], ['pop', 93.0, .7],        // in una frase
  ];
  return {
    titolo: 'Perché c’è l’arcobaleno', durata: 100.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.0, 'il prisma'], [26.0, 57.6, 'dentro la goccia'], [57.6, 89.8, 'l’arco nel cielo']],
    verifica: {
      prisma: PRISMA.map(R => [R.nome, R.n, R.fine.map(Math.round)]),
      goccia: GOCCIA.map(G => [G.nome, +(G.angolo / RAD).toFixed(2), G.P3.map(Math.round), G.fine.map(Math.round)]),
      gocceLontane: GOC.map(G => [+(G.ang / RAD).toFixed(2), G.p.map(Math.round)]),
    },
    scena(ctx, t) { sceneIntro(ctx, t); scenePrisma(ctx, t); sceneGoccia(ctx, t); sceneLontano(ctx, t); sceneCielo(ctx, t); sceneFine(ctx, t); },
  };
});
