'use strict';
/* Condensatori in fila e affiancati — C₁ = 3 µF, C₂ = 6 µF, pila da 12 V. In parallelo: stessa tensione, Q₁ = 36 µC,
   Q₂ = 72 µC, Q = 108 µC, C = C₁ + C₂ = 9 µF. In serie: la pila carica le armature esterne, quelle interne (isolate) si
   dividono per induzione: stessa carica Q su tutte; V = V₁ + V₂ = Q/C₁ + Q/C₂, quindi 1/C = 1/C₁ + 1/C₂: C = 2 µF,
   Q = 24 µC, V₁ = 8 V, V₂ = 4 V. Le armature sono disegnate lunghe in proporzione alla capacità, e ogni segno
   vale 12 µC. (Il confronto con le resistenze sta in corrente/serie-parallelo.) Colori fissi dell'elettrostatica: positive C.v, negative C.x.
   Argomento: potenziale. */
CVIDEO.registra('potenziale/serie-parallelo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card } = M;

const T_FINE = 79.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.2, 'felice'], [24.5, 'neutro'],
  [36.4, 'festa'], [42.0, 'neutro'], [51.5, 'sorpreso'], [56.8, 'neutro'], [66.9, 'felice'], [73.4, 'sorpreso'],
  [81.3, 'felice'], [85.1, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Due condensatori insieme: quanto\nvale la capacità del gruppo?'],
  [7.9, 13.6, 'La capacità {mink:C} = {mink:Q}/{mink:V} dice quanta carica\nprende un condensatore per ogni volt.'],
  [13.7, 20.1, 'Qui {mink:C₁} = 3 µF e {mink:C₂} = 6 µF: un µF,\nmicrofarad, è un milionesimo di farad.'],
  [20.2, 24.4, 'In {g:parallelo}: affiancati, ognuno\ncollegato agli stessi due fili.'],
  [24.5, 30.2, 'Hanno la {g:stessa tensione}: i 12 V\ndella pila, ai capi di tutti e due.'],
  [30.3, 36.3, 'Le cariche: {mink:Q₁} = 36 µC, {mink:Q₂} = 72 µC.\nIn tutto 108 µC: la {g:somma}.'],
  [36.4, 41.9, 'Quindi {mink:C} = {mink:C₁} + {mink:C₂} = 9 µF: come\nun’unica armatura più grande.'],
  [42.0, 46.3, 'In {g:serie}: uno dopo l’altro,\nsullo stesso filo.'],
  [46.4, 51.4, 'La pila carica solo le armature esterne:\n+{mink:Q} su una, −{mink:Q} sull’altra.'],
  [51.5, 56.7, 'Quelle interne, isolate, si dividono\nin −{mink:Q} e +{mink:Q}: {g:stessa carica} per tutti.'],
  [56.8, 61.3, 'Le tensioni invece si sommano:\n{mink:V} = {mink:V₁} + {mink:V₂}.'],
  [61.4, 66.8, 'Ognuna è {mink:Q} diviso la sua capacità:\nda qui 1/{mink:C} = 1/{mink:C₁} + 1/{mink:C₂}.'],
  [66.9, 73.3, 'Qui {mink:C} = 2 µF: {mink:Q} = 24 µC,\n{mink:V₁} = 8 V e {mink:V₂} = 4 V.'],
  [73.4, 78.6, 'In serie la capacità è {g:minore} della\npiù piccola: come armature più lontane.'],
  [81.3, 87.5,'In parallelo le capacità si sommano;\nin serie si sommano i loro inversi.'],
];
// ---------- aiutanti ----------
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a, x0 = 1190, x1 = 1770) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
function etichetta(ctx, s, x, y, al, w = 96, size = 32) { if (al <= 0) return; fondo(ctx, x, y, w, size + 14, al); drawRich(ctx, s, x, y, { size, alpha: al }); }
function segno(ctx, p, s, al, r = 9) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(s > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); if (s > 0) { ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); } ctx.stroke(); ctx.restore();
}
// un filo (spezzata) disegnato fino alla frazione k della sua lunghezza
function filo(ctx, pts, k, al = 1) {
  if (k <= 0 || al <= 0) return;
  let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let resto = tot * k;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && resto > 0; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(1, resto / l);
    ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); resto -= l;
  }
  ctx.stroke(); ctx.restore();
}
function lastra(ctx, a, b, al) {   // un'armatura, vista di taglio
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 8; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function pila(ctx, x, yc, al) {   // su un ramo verticale: il polo + (lungo) in alto
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 36, yc - 15); ctx.lineTo(x + 36, yc - 15); ctx.stroke();
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x - 18, yc + 15); ctx.lineTo(x + 18, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 52, yc - 30, { size: 30, color: C.v, alpha: al });
  txt(ctx, '−', x + 52, yc + 32, { size: 30, color: C.x, alpha: al });
}

// ---------- i due circuiti (armature lunghe in proporzione alla capacità: 30 px per µF) ----------
const CARTA = [110, 110, 1000, 680];
const XB = 260, YT = 230, YG = 670, YC = 450;
// parallelo: due rami verticali
const RAMI = [{ x: 600, w: 90, n: 3, nome: '{mink:C₁}' }, { x: 900, w: 180, n: 6, nome: '{mink:C₂}' }];
// serie: due condensatori sul filo in alto
const SER = [{ x: 490, h: 90, nome: '{mink:C₁}', v: '{mink:V₁}', vv: '{mink:V₁} = 8 V' }, { x: 770, h: 180, nome: '{mink:C₂}', v: '{mink:V₂}', vv: '{mink:V₂} = 4 V' }];

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Condensatori in fila\ne affiancati', W / 2, 220, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.1 }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

// 1 · in parallelo (7,5–42)
function sceneParallelo(ctx, t) {
  const al = life(t, 7.8, 42.2, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 20.4, 21.8, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], [900, YT]], kf);
  filo(ctx, [[XB, YC + 15], [XB, YG], [900, YG]], kf);
  pila(ctx, XB, YC, P(t, 20.4, 20.9));
  etichetta(ctx, '12 V', 172, YC, P(t, 24.6, 25.1), 80, 30);
  // il gruppo, come un'unica armatura più grande
  const kg = life(t, 36.6, 42.2, .4, .4);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.roundRect(520, 385, 560, 130, 18); ctx.stroke(); ctx.restore();   // comprende anche i nomi
    etichetta(ctx, '{g:9 µF}', 750, 560, kg, 100, 34);
  }
  RAMI.forEach((r, i) => {
    filo(ctx, [[r.x, YT], [r.x, YC - 28]], kf); filo(ctx, [[r.x, YC + 28], [r.x, YG]], kf);
    const kc = P(t, 8.1 + i * .3, 8.6 + i * .3);
    lastra(ctx, [r.x - r.w / 2, YC - 28], [r.x + r.w / 2, YC - 28], kc);
    lastra(ctx, [r.x - r.w / 2, YC + 28], [r.x + r.w / 2, YC + 28], kc);
    etichetta(ctx, r.nome, r.x + r.w / 2 + 44, YC, P(t, 13.9 + i * .3, 14.4 + i * .3), 54, 38);
    etichetta(ctx, '12 V', r.x + 52, YC + 78, life(t, 24.9 + i * .3, 36.6, .5, .4), 84, 30);   // sotto, accanto al proprio filo
    // le cariche sulle facce affacciate: un segno ogni 12 µC
    for (let j = 0; j < r.n; j++) {
      const x = r.x + (j - (r.n - 1) / 2) * 30, k = P(t, 30.5 + j * .12 + i * .2, 30.9 + j * .12 + i * .2);
      segno(ctx, [x, YC - 13], 1, k, 7); segno(ctx, [x, YC + 13], -1, k, 7);
    }
  });
  ctx.restore();
}

// 2 · in serie (42–78,7)
function sceneSerie(ctx, t) {
  const al = life(t, 42.1, 78.8, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 42.3, 43.7, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], [SER[0].x - 30, YT]], kf);
  filo(ctx, [[SER[0].x + 30, YT], [SER[1].x - 30, YT]], kf);
  filo(ctx, [[SER[1].x + 30, YT], [960, YT], [960, YG], [XB, YG], [XB, YC + 15]], kf);
  pila(ctx, XB, YC, P(t, 42.3, 42.8));
  etichetta(ctx, '12 V', 172, YC, P(t, 42.6, 43.1), 80, 30);
  etichetta(ctx, '{mink:V} = 12 V', 405, YC, life(t, 57.0, 78.8, .4, .4), 150, 32);
  // le armature interne, isolate dal resto
  const ki = life(t, 51.7, 56.8, .4, .4);
  if (ki > 0) {
    ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.roundRect(SER[0].x, 124, SER[1].x - SER[0].x, 212, 16); ctx.stroke(); ctx.restore();
    etichetta(ctx, '{g:isolate}', (SER[0].x + SER[1].x) / 2, 300, ki, 110, 30);
  }
  SER.forEach((s, i) => {
    const kc = P(t, 8.1, 8.6) * P(t, 42.4 + i * .3, 42.9 + i * .3);
    lastra(ctx, [s.x - 30, YT - s.h / 2], [s.x - 30, YT + s.h / 2], kc);
    lastra(ctx, [s.x + 30, YT - s.h / 2], [s.x + 30, YT + s.h / 2], kc);
    const xe = i ? s.x : s.x - 70, ye = i ? YT + s.h / 2 + 46 : YT + 70;   // C₁ in basso a sinistra, fuori dal riquadro delle interne
    etichetta(ctx, s.nome, xe, ye, kc, 54, 38);
    // due segni per armatura: Q = 24 µC; prima le esterne (dalla pila), poi le interne (per induzione)
    const kEst = P(t, 46.6, 47.2), kInt = P(t, 51.8, 52.4);
    for (let j = 0; j < 2; j++) {
      const y = YT + (j - .5) * s.h / 2;
      segno(ctx, [s.x - 17, y], 1, i === 0 ? kEst : kInt);
      segno(ctx, [s.x + 17, y], -1, i === 0 ? kInt : kEst);
    }
    const kv = life(t, 57.0, 78.8, .4, .4), k2 = P(t, 67.1, 67.6);
    etichetta(ctx, s.v, xe, ye + 56, kv * (1 - k2), 60, 36);
    etichetta(ctx, s.vv, xe, ye + 56, kv * k2, 150, 34);
  });
  etichetta(ctx, '{mink:C} = {g:2 µF}', 640, 600, life(t, 67.1, 78.8, .4, .4), 150, 36);
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 42.1, () => {
    drawRich(ctx, '{g:capacità} {mink:C} = {mink:Q}/{mink:V}', cx, 165, { size: 42, local: t - 8.0 });
    drawRich(ctx, '{mink:Q}{dim:: carica;} {mink:V}{dim:: differenza di potenziale}', cx, 215, { size: 30, local: t - 8.4 });
    drawRich(ctx, '{mink:C₁} = 3 µF    {mink:C₂} = 6 µF', cx, 270, { size: 36, local: t - 13.8 });
    drawRich(ctx, '{dim:µF: milionesimo di farad}', cx, 314, { size: 30, local: t - 14.3 });
    drawRich(ctx, '{dim:µC: milionesimo di coulomb}', cx, 353, { size: 30, local: t - 30.4 });
    separa(ctx, 390, P(t, 20.3, 20.7));
    conFont(TITOLI, () => drawRich(ctx, 'in parallelo', cx, 435, { size: 40, weight: 600, alpha: P(t, 20.3, 20.8) }));
    drawRich(ctx, '{dim:stessa tensione:} {mink:V} = 12 V', cx, 492, { size: 32, local: t - 24.6 });
    drawRich(ctx, '{mink:Q₁} = 36 µC    {mink:Q₂} = 72 µC', cx, 545, { size: 32, local: t - 30.5 });
    drawRich(ctx, '{mink:Q} = {mink:Q₁} + {mink:Q₂} = 108 µC', cx, 595, { size: 32, local: t - 31.5 });
    drawRich(ctx, '{mink:C} = {mink:C₁} + {mink:C₂}', cx, 662, { size: 46, local: t - 36.5 });
    drawRich(ctx, '{mink:C} = 108 µC / 12 V = {g:9 µF}', cx, 725, { size: 32, local: t - 37.2 });
  });
  blocco(42.1, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'in serie', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:stessa carica} {mink:Q} {dim:su tutte le armature}', cx, 225, { size: 30, local: t - 51.6 });
    drawRich(ctx, '{mink:V} = {mink:V₁} + {mink:V₂}', cx, 285, { size: 42, local: t - 56.9 });
    drawRich(ctx, '{mink:V₁}, {mink:V₂}{dim:: tensioni di} {mink:C₁} {dim:e} {mink:C₂}', cx, 332, { size: 30, local: t - 57.2 });
    drawRich(ctx, '{mink:Q}/{mink:C} = {mink:Q}/{mink:C₁} + {mink:Q}/{mink:C₂}', cx, 390, { size: 34, local: t - 61.5 });
    drawRich(ctx, '1/{mink:C} = 1/{mink:C₁} + 1/{mink:C₂}', cx, 450, { size: 44, local: t - 62.6 });
    separa(ctx, 495, P(t, 67.0, 67.4));
    drawRich(ctx, '1/{mink:C} = 1/3 + 1/6 = 1/2{dim::} {mink:C} = {g:2 µF}', cx, 540, { size: 32, local: t - 67.0 });
    drawRich(ctx, '{mink:Q} = 2 µF · 12 V = 24 µC', cx, 590, { size: 32, local: t - 67.6 });
    drawRich(ctx, '{mink:V₁} = 24 µC / 3 µF = 8 V', cx, 640, { size: 30, local: t - 68.2 });
    drawRich(ctx, '{mink:V₂} = 24 µC / 6 µF = 4 V', cx, 682, { size: 30, local: t - 68.6 });
    drawRich(ctx, '{dim:più piccola di} {mink:C₁} {dim:e di} {mink:C₂}', cx, 738, { size: 30, local: t - 73.5 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 88.8, 89.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'In parallelo le capacità si sommano;\nin serie si sommano gli inversi.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'in {g:parallelo}: stessa tensione\n{mink:C} = {mink:C₁} + {mink:C₂}'], [960, 'in {g:serie}: stessa carica\n1/{mink:C} = 1/{mink:C₁} + 1/{mink:C₂}'], [1470, 'in serie la capacità è\n{g:minore} della più piccola']];
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

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .4], ['pop', 8.4, .6],                              // i due condensatori
    ['pop', 13.9, .45], ['pop', 14.2, .55],                                           // C1 e C2
    ['traccia', 20.4, 21.8], ['pop', 20.4, .5],                                       // in parallelo: fili e pila
    ['pop', 24.6, .5], ['pop', 24.9, .45], ['pop', 25.2, .55],                        // 12 V su tutti e due
    ['tono', 30.5, 31.3, [.1, .4, .7, 1]], ['ding', 31.6],                            // le cariche si sommano
    ['pop', 36.6, .6], ['ding', 37.3],                                                // un'unica armatura: 9 µF
    ['soffio', 42.1], ['traccia', 42.3, 43.7], ['pop', 42.4, .4], ['pop', 42.7, .6],  // in serie
    ['pop', 46.6, .55],                                                               // le armature esterne
    ['pop', 51.7, .45], ['pop', 51.8, .65],                                           // le interne, per induzione
    ['pop', 57.0, .5],                                                                // V = V1 + V2
    ['pop', 61.5, .45], ['pop', 62.6, .6],                                            // 1/C = 1/C1 + 1/C2
    ['ding', 67.1], ['pop', 67.6, .5], ['pop', 68.2, .6], ['pop', 68.6, .4],          // C = 2 µF, Q, V1, V2
    ['pop', 73.5, .35],                                                               // minore della più piccola
    ['soffio', 79.1], ['pop', 81.3, .5], ['pop', 81.8, .6], ['pop', 82.3, .7],        // in una frase
  ];
  return {
    titolo: 'Condensatori in fila e affiancati', durata: 90.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.9, 'in parallelo'], [41.9, T_FINE, 'in serie']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneParallelo(ctx, t); sceneSerie(ctx, t);scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
