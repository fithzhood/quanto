'use strict';
/* Doppio lato, quadrupla area — la proporzionalità quadratica: il quadrato (lato doppio, area quadrupla; A/l cambia,
   A/l² no), l'arco di parabola, e lo spazio di frenata che cresce col quadrato della velocità. Argomento: relazioni. */
CVIDEO.registra('relazioni/quadratica', M => {
  const { W, C, E, P, life, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, txt, fmtN, dot, glowStroke, dashed, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [95.2, 190], [96.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [95.2, 1050], [96.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [95.2, 2.2], [96.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [95.2, 2], [96.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [95.2, -1.5], [96.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.3, 'pensa'], [16.9, 'sorpreso'],
  [21.5, 'felice'], [26.1, 'neutro'], [30.9, 'felice'], [35.7, 'neutro'], [45.0, 'felice'], [49.6, 'neutro'],
  [67.6, 'sorpreso'], [71.8, 'neutro'], [77.7, 'festa'], [81.5, 'neutro'], [86.1, 'felice'], [90.7, 'neutro'],
  [97.9, 'felice'], [101.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Lato doppio:\narea doppia?'],
  [7.9, 12.1, 'Un quadrato di lato 1 cm:\narea 1 cm².'],
  [12.3, 16.7, 'Raddoppio il lato: 2 cm.\nL’area {r:raddoppia}?'],
  [16.9, 21.3, 'No: ci stanno {g:4} quadretti.\nL’area è 4 cm².'],
  [21.5, 25.9, 'Lato triplo, 3 cm:\n{g:9} quadretti, 9 cm².'],
  [26.1, 30.7, 'Il rapporto {my:A}{mink:/}{mx:l} cambia: 1, 2, 3…\n{r:non} è proporzionalità diretta.'],
  [30.9, 35.5, 'Costante è {my:A}{mink:/}{mx:l}{mink:²}: l’area è\n{v:proporzionale al quadrato} del lato.'],
  [35.7, 40.1, 'In generale {mink:y = k·x²}:\n{mink:y/x² = k} è costante.'],
  [40.3, 44.8, 'I punti non stanno su una\nretta: è un arco di {y:parabola}.'],
  [45.0, 49.4, 'Parte dall’origine e sale\nsempre più ripida.'],
  [49.6, 54.1, 'A ogni centimetro l’area cresce\ndi più: prima 3, poi 5.'],
  [54.3, 58.7, 'Anche la frenata: un’auto frena\nperdendo 7,7 m/s ogni secondo.'],
  [58.9, 63.3, 'Da 50 km/h si ferma\nin circa {g:12,5 m}.'],
  [63.5, 67.4, 'Da 100 km/h,\ndoppia velocità…'],
  [67.6, 71.6, '…circa {g:50 m}:\nquattro volte!'],
  [71.8, 77.5, 'Da 150 km/h,\ntripla…'],
  [77.7, 81.3, '…circa {g:113 m}:\nnove volte.'],
  [81.5, 85.9, 'Lo spazio di frenata è proporzionale\nal {v:quadrato} della velocità.'],
  [86.1, 90.5, 'Sul grafico, di nuovo\nun arco di {y:parabola}.'],
  [90.7, 95.5, 'Velocità 1, 2, 3 volte: spazio\n1, 4, 9 volte. È il {v:quadrato}.'],
  [97.9, 102.9, 'Doppio {mink:x}, quadruplo {mink:y}:\nè la proporzionalità quadratica.'],
];

// ---------- aiutanti ----------
// un'auto vista di fianco; (x, y) = centro, a livello della strada
function auto(ctx, x, y, col, s = 1, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = css(col);
  ctx.beginPath(); ctx.roundRect(-50, -40, 100, 27, 10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-33, -38); ctx.lineTo(-21, -61); ctx.lineTo(14, -61); ctx.lineTo(33, -38); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.paper, .85);
  ctx.beginPath(); ctx.moveTo(-26, -41); ctx.lineTo(-17, -56); ctx.lineTo(-4, -56); ctx.lineTo(-4, -41); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2, -41); ctx.lineTo(2, -56); ctx.lineTo(11, -56); ctx.lineTo(25, -41); ctx.closePath(); ctx.fill();
  for (const wx of [-28, 28]) {
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(wx, -13, 13, 0, TAU); ctx.fill();
    ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(wx, -13, 5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// assi con scale diverse: o = { ox, oy, ux, uy, x1, y1, xt, yt, xlab, ylab, sotto }
function assi(ctx, o, k) {
  if (k <= 0) return;
  const { ox, oy, ux, uy, x1, y1 } = o, X1 = ox + x1 * ux, Y1 = oy - y1 * uy;
  ctx.save(); ctx.globalAlpha *= k;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const x of o.xt) { const X = ox + x * ux; ctx.beginPath(); ctx.moveTo(X, oy); ctx.lineTo(X, Y1); ctx.stroke(); }
  for (const y of o.yt) { const Y = oy - y * uy; ctx.beginPath(); ctx.moveTo(ox, Y); ctx.lineTo(X1, Y); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(ox - 8, oy); ctx.lineTo(X1 + 26, oy); ctx.moveTo(ox, oy + 8); ctx.lineTo(ox, Y1 - 26); ctx.stroke();
  arrowHead(ctx, [X1 + 32, oy], 0, C.ink); arrowHead(ctx, [ox, Y1 - 32], -Math.PI / 2, C.ink);
  for (const x of o.xt) txt(ctx, String(x), ox + x * ux, oy + 30, { size: 29, color: C.dim });
  for (const y of o.yt) txt(ctx, String(y), ox - 16, oy - y * uy, { size: 29, color: C.dim, align: 'right' });
  drawRich(ctx, o.xlab, X1 + 30, o.sotto ? oy + 30 : oy - 34, { size: 34, align: 'right' });
  drawRich(ctx, o.ylab, ox + 24, Y1 - 26, { size: 34, align: 'left' });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Doppio lato, quadrupla area', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- 1 · i quadrati (7,5–54,5): quadretti da 1 cm, 70 px ----------
const QU = 70, QB = 520;   // lato del quadretto e base dei quadrati
const QUADRATI = [
  { n: 1, x: 410, t0: 8.2, celle: [8.6], tA: 9.0 },
  { n: 2, x: 560, t0: 12.6, celle: [17.1, 17.55, 18.0, 18.45], tA: 18.9 },
  { n: 3, x: 760, t0: 21.5, celle: [21.7, 22.0, 22.3, 22.6, 22.9, 23.2, 23.5, 23.8, 24.1], tA: 24.5 },
];
function sceneQuadrati(ctx, t) {
  if (t < 7.5 || t > 54.8) return;
  const al = P(t, 7.5, 8.1) * (1 - P(t, 54.0, 54.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 700, 690);
  for (const Q of QUADRATI) {
    const k = P(t, Q.t0, Q.t0 + .5); if (k <= 0) continue;
    const L = Q.n * QU, x0 = Q.x, y0 = QB - L;
    ctx.save(); ctx.globalAlpha *= k;
    Q.celle.forEach((tc, i) => {
      const kc = P(t, tc, tc + .3); if (kc <= 0) return;
      const cx = x0 + (i % Q.n) * QU, cy = y0 + Math.floor(i / Q.n) * QU;
      ctx.fillStyle = css(C.g, .2 * kc); ctx.fillRect(cx, cy, QU, QU);
      if (Q.n > 1) txt(ctx, String(i + 1), cx + QU / 2, cy + QU / 2, { size: 30, weight: 600, color: C.g, alpha: kc });
    });
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 1.5;
    for (let i = 1; i < Q.n; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * QU, y0); ctx.lineTo(x0 + i * QU, QB); ctx.moveTo(x0, y0 + i * QU); ctx.lineTo(x0 + L, y0 + i * QU); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.strokeRect(x0, y0, L, L);
    // il lato in azzurro, sotto
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, QB + 14); ctx.lineTo(x0 + L, QB + 14); ctx.stroke();
    drawRich(ctx, '{mx:l} = ' + Q.n + ' cm', x0 + L / 2, QB + 52, { size: 34 });
    drawRich(ctx, '{my:A} = ' + Q.n * Q.n + ' cm²', x0 + L / 2, y0 - 32, { size: 34, alpha: P(t, Q.tA, Q.tA + .4) });
    ctx.restore();
  }
  // l'idea sbagliata: «area doppia»
  const kr = life(t, 12.9, 17.0, .4, .3);
  if (kr > 0) drawRich(ctx, '{r:2 cm²?}', 630, QB - 2 * QU - 32, { size: 38, alpha: kr });
  drawRich(ctx, '{mink:y = k·x²}', 722, 200, { size: 60, local: t - 35.9 });
  ctx.restore();
}
// la tabella e il grafico A–l
const G1 = { ox: 1180, oy: 760, ux: 160, uy: 32, x1: 3.5, y1: 10, xt: [1, 2, 3], yt: [2, 4, 6, 8, 10], xlab: '{mx:l} (cm)', ylab: '{my:A} (cm²)' };
const g1 = (l, A) => [G1.ox + l * G1.ux, G1.oy - A * G1.uy];
const PAR1 = []; for (let i = 0; i <= 120; i++) { const l = 3.15 * i / 120; PAR1.push(g1(l, l * l)); }
function sceneTabellaA(ctx, t) {
  if (t < 7.5 || t > 54.8) return;
  const al = P(t, 7.8, 8.4) * (1 - P(t, 54.0, 54.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1100, 110, 740, 690);
  drawRich(ctx, '{dim:lato} {mx:l} (cm)', 1130, 165, { size: 32, align: 'left' });
  drawRich(ctx, '{dim:area} {my:A} (cm²)', 1130, 225, { size: 32, align: 'left' });
  drawRich(ctx, '{my:A}{mink:/}{mx:l}', 1130, 295, { size: 36, align: 'left', alpha: P(t, 26.2, 26.7) });
  drawRich(ctx, '{my:A}{mink:/}{mx:l}{mink:²}', 1130, 355, { size: 36, align: 'left', alpha: P(t, 31.0, 31.5) });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1130, 258); ctx.lineTo(1810, 258); ctx.stroke();
  QUADRATI.forEach((Q, i) => {
    const xc = 1530 + i * 110, k = P(t, Q.tA, Q.tA + .4);
    txt(ctx, String(Q.n), xc, 165, { size: 36, color: C.x, alpha: k });
    txt(ctx, String(Q.n * Q.n), xc, 225, { size: 36, color: C.y, alpha: k });
    txt(ctx, String(Q.n), xc, 295, { size: 36, weight: 600, color: C.r, alpha: P(t, 26.3 + i * .3, 26.7 + i * .3) });
    txt(ctx, '1', xc, 355, { size: 36, weight: 600, color: C.g, alpha: P(t, 31.1 + i * .3, 31.5 + i * .3) });
  });
  // 2 · il grafico: arco di parabola dall'origine
  assi(ctx, G1, P(t, 40.3, 41.0));
  const kp = P(t, 40.8, 42.0);
  if (kp > 0) glowStroke(ctx, PAR1, kp, C.y, 5);
  QUADRATI.forEach((Q, i) => dot(ctx, g1(Q.n, Q.n * Q.n), C.y, P(t, 40.6 + i * .25, 41.0 + i * .25, E.back), 10));
  dot(ctx, g1(0, 0), C.y, P(t, 45.1, 45.5, E.back), 9);
  // gli scalini: +3, poi +5
  for (const [a, ta] of [[1, 49.8], [2, 51.6]]) {
    const k = life(t, ta, 54.3, .4, .3); if (k <= 0) continue;
    const b = a + 1;
    ctx.save(); ctx.globalAlpha *= k;
    dashed(ctx, g1(a, a * a), g1(b, a * a), C.dim, 1, .9);
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...g1(b, a * a)); ctx.lineTo(...g1(b, b * b)); ctx.stroke();
    drawRich(ctx, '{g:+' + (b * b - a * a) + '}', g1(b, 0)[0] + 16, g1(0, (a * a + b * b) / 2)[1], { size: 38, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · la frenata (54,3–87,8): decelerazione 7,7 m/s², come nel video della frenata ----------
const A = 7.7;
const spazio = kmh => (kmh / 3.6) ** 2 / (2 * A);                // 12,5 m, 50,1 m, 112,7 m
const X0 = 560, PXM = 10;                                        // la riga di frenata in x 560, 10 px per metro
// tempo vero (1 s = 1 s): ogni auto passa la riga a tb e frena fino a fermarsi (1,80 s, 3,61 s, 5,41 s)
const AUTO = [{ k: 50, y: 200, tb: 59.1, s: '12,5' }, { k: 100, y: 265, tb: 63.7, s: '50' }, { k: 150, y: 330, tb: 72.0, s: '113' }];
function posizione(kmh, tau) {
  const v = kmh / 3.6;
  if (tau < 0) return v * tau;                                   // prima della riga: velocità costante
  const tt = Math.min(tau, v / A);
  return v * tt - A * tt * tt / 2;
}
function sceneStrada(ctx, t) {
  if (t < 54.2 || t > 95.6) return;
  const al = P(t, 54.4, 55.0) * (1 - P(t, 94.9, 95.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 1468, 250);
  ctx.strokeStyle = css(C.r, .8); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(X0, 130); ctx.lineTo(X0, 340); ctx.stroke(); ctx.setLineDash([]);
  txt(ctx, 'qui inizia a frenare', X0 + 12, 132, { size: 30, color: C.dim, align: 'left' });
  for (const Q of AUTO) {
    ctx.fillStyle = css(C.dim, .22); ctx.fillRect(X0 - 20, Q.y, 1280, 8);
    txt(ctx, Q.k + ' km/h', 392, Q.y - 22, { size: 30, color: C.x, align: 'left' });
    const s = posizione(Q.k, t - Q.tb), fronte = X0 + s * PXM;
    // l'auto arriva già lanciata da sinistra: è nascosta finché non passa dietro le etichette
    if (t > Q.tb - 1.5) { ctx.save(); ctx.beginPath(); ctx.rect(562, 112, 1276, 246); ctx.clip(); auto(ctx, fronte - 30, Q.y, C.x, .6); ctx.restore(); }
    const tf = Q.tb + Q.k / 3.6 / A;
    txt(ctx, '≈ ' + Q.s + ' m', fronte + 12, Q.y - 22, { size: 30, weight: 600, color: C.g, align: 'left', alpha: P(t, tf, tf + .4) });
  }
  ctx.restore();
}
const G3 = { ox: 470, oy: 750, ux: 4.6, uy: 2.7, x1: 160, y1: 120, xt: [50, 100, 150], yt: [20, 40, 60, 80, 100, 120], xlab: '{mx:v} (km/h)', ylab: '{my:s} (m)' };
const g3 = (v, s) => [G3.ox + v * G3.ux, G3.oy - s * G3.uy];
const PAR3 = []; for (let i = 0; i <= 160; i++) { const v = 154 * i / 160; PAR3.push(g3(v, spazio(v))); }
function sceneGraficoS(ctx, t) {
  if (t < 54.2 || t > 95.6) return;
  const al = P(t, 54.6, 55.2) * (1 - P(t, 94.9, 95.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 380, 880, 420);
  assi(ctx, G3, P(t, 54.8, 55.6));
  const kp = P(t, 86.2, 87.5);
  if (kp > 0) glowStroke(ctx, PAR3, kp, C.y, 5);
  for (const Q of AUTO) { const tf = Q.tb + Q.k / 3.6 / A; dot(ctx, g3(Q.k, spazio(Q.k)), C.y, P(t, tf, tf + .4, E.back), 10); }
  ctx.restore();
}
function sceneTabellaS(ctx, t) {
  if (t < 54.2 || t > 95.6) return;
  const al = P(t, 54.8, 55.4) * (1 - P(t, 94.9, 95.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1280, 380, 560, 420);
  const kr = P(t, 90.8, 91.3);
  txt(ctx, 'velocità', 1362, 420, { size: 30, color: C.dim });
  txt(ctx, 'frenata', 1497, 420, { size: 30, color: C.dim });
  txt(ctx, 'quante volte', 1695, 420, { size: 30, color: C.dim, alpha: kr });
  drawRich(ctx, '{mx:v} (km/h)', 1362, 462, { size: 30 });
  drawRich(ctx, '{my:s} (m)', 1497, 462, { size: 30 });
  drawRich(ctx, '{mx:v}{mink:/}50', 1625, 462, { size: 32, alpha: kr });
  drawRich(ctx, '{my:s}{mink:/}12,5', 1765, 462, { size: 32, alpha: kr });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1305, 492); ctx.lineTo(1815, 492); ctx.stroke();
  AUTO.forEach((Q, i) => {
    const tf = Q.tb + Q.k / 3.6 / A, k = P(t, tf, tf + .4), y = 535 + i * 60, kq = P(t, 90.9 + i * .3, 91.3 + i * .3);
    txt(ctx, String(Q.k), 1362, y, { size: 38, color: C.x, alpha: k });
    txt(ctx, '≈ ' + Q.s, 1497, y, { size: 38, color: C.y, alpha: k });
    txt(ctx, String(Q.k / 50), 1625, y, { size: 38, weight: 600, color: C.x, alpha: kq });
    txt(ctx, '≈ ' + Math.round(spazio(Q.k) / 12.5), 1765, y, { size: 38, weight: 600, color: C.g, alpha: kq });
  });
  drawRich(ctx, '{mx:v} {dim:doppia →} {my:s} {dim:quadrupla}', 1560, 735, { size: 36, alpha: life(t, 81.6, 90.6, .4, .3) });
  drawRich(ctx, '{dim:velocità} 1, 2, 3 → {dim:spazio} {g:1, 4, 9}', 1560, 735, { size: 36, alpha: P(t, 91.4, 91.9) });
  ctx.restore();
}

// in una frase (88–98)
function sceneFine(ctx, t) {
  if (t < 95.3) return;
  const al = 1 - P(t, 103.3, 104.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 95.5 });
    drawRich(ctx, 'Proporzionalità quadratica: {mink:x} doppio,\n{mink:y} quattro volte; il grafico è un arco di {y:parabola}.', W / 2, 290, { size: 60, weight: 600, local: t - 95.9, stagger: .08 });
  });
  const pills = [[490, '{mink:y = k·x²}:\n{mink:y/x²} costante'], [960, '{mink:y/x} {r:non} è\ncostante'], [1430, 'arco di {y:parabola}\ndall’origine']];
  pills.forEach(([x, s], i) => {
    const a = 97.7 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 34, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nei quadrati il tono segue i quadretti contati, da 0 (0) a 9 (1);
  // nelle parabole segue l'altezza della curva; in frenata segue la velocità, da ferma (0) a 150 km/h (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.3, .3], ['pop', 9.0, .35],                             // lato 1 cm, area 1 cm²
    ['pop', 12.7, .4],                                                                // lato 2 cm
    ['tono', 17.1, 18.75, [.11, .22, .33, .44]], ['pop', 18.9, .45],                  // 4 quadretti: 4 cm²
    ['pop', 21.6, .5], ['tono', 21.7, 24.4, [.11, .22, .33, .44, .56, .67, .78, .89, 1]], ['pop', 24.5, .6],   // 9 quadretti
    ['pop', 26.4, .4], ['ding', 31.9],                                                // A/l cambia; A/l² sempre 1
    ['pop', 36.0, .55],                                                               // y = k·x²
    ['traccia', 40.3, 41.0], ['traccia', 40.8, 42.0], ['tono', 40.8, 42.0, [0, 0, .01, .1, .47, .82, .97, .99]],   // l'arco di parabola
    ['pop', 45.2, .3],                                                                // dall'origine
    ['pop', 49.9, .5], ['pop', 51.7, .65],                                            // gli scalini: +3, +5
    ['soffio', 54.4], ['traccia', 54.8, 55.6],                                        // la frenata, gli assi
    ['tono', 59.1, 60.9, [.33, 0]], ['pop', 60.95, .35],                              // da 50 km/h: 12,5 m
    ['tono', 63.7, 67.3, [.67, 0]], ['pop', 67.35, .5],                               // da 100 km/h: 50 m
    ['tono', 72.0, 77.4, [1, 0]], ['pop', 77.45, .65],                                // da 150 km/h: 113 m
    ['pop', 81.7, .5],                                                                // velocità doppia, spazio quadruplo
    ['traccia', 86.2, 87.5], ['tono', 86.2, 87.5, [0, 0, .01, .1, .46, .81, .97, .99]],   // di nuovo una parabola
    ['pop', 91.0, .45], ['ding', 91.9],                                               // 1, 4, 9
    ['soffio', 95.5], ['pop', 97.7, .5], ['pop', 98.2, .6], ['pop', 98.7, .7],        // in una frase
  ];
  return {
    titolo: 'Doppio lato, quadrupla area', durata: 105.3, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.2, 'lato e area'], [40.2, 54.2, 'l’arco di parabola'], [54.2, 95.1, 'lo spazio di frenata']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneQuadrati(ctx, t); sceneTabellaA(ctx, t); sceneStrada(ctx, t); sceneGraficoS(ctx, t); sceneTabellaS(ctx, t); sceneFine(ctx, t); },
  };
});
