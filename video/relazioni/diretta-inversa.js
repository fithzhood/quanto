'use strict';
/* Retta o iperbole — proporzionalità diretta (la molla: forza doppia, allungamento doppio, rapporto costante, retta per
   l'origine) e inversa (120 km di viaggio: velocità doppia, tempo metà, prodotto costante, ramo di iperbole). Argomento: relazioni. */
CVIDEO.registra('relazioni/diretta-inversa', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TAU, TITOLI, conFont, drawRich, txt, fmtN, dot, glowStroke, dashed, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [100.1, 190], [101.4, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [100.1, 1050], [101.4, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [100.1, 2.2], [101.4, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [100.1, 2], [101.4, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [100.1, -1.5], [101.4, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [24.1, 'felice'], [28.7, 'neutro'],
  [61.5, 'felice'], [66.1, 'pensa'], [69.7, 'neutro'], [74.3, 'felice'], [80.4, 'sorpreso'], [86.1, 'neutro'],
  [90.1, 'felice'], [95.1, 'neutro'], [102.6, 'felice'], [106.2, 'occhiolino'],
];
// un fumetto per ogni stato: mentre è aperto, la scena resta ferma su quello stato
const FUMETTI = [
  [2.5, 6.3, 'Retta o curva: che cosa\nci dice un grafico?'],
  [7.9, 12.6, 'Appendo alla molla pesi da 1 newton\n(N), uno alla volta.'],
  [12.8, 16.6, 'Con 1 N si allunga\ndi 4 cm.'],
  [17.3, 20.1, 'Con 2 N, 8 cm.'],
  [21.1, 23.9, 'Con 3 N, 12 cm.'],
  [24.1, 28.5, 'Forza doppia, allungamento {g:doppio}:\nsono {v:direttamente proporzionali}.'],
  [28.7, 33.1, 'Il rapporto {my:F}{mink:/}{mx:x} è sempre\nlo stesso: 0,25 N/cm.'],
  [33.3, 37.7, 'I punti del grafico stanno su\nuna {v:retta} per l’origine.'],
  [37.9, 42.5, 'In generale {mink:y = k·x}:\n{mink:y/x = k} è costante.'],
  [42.7, 47.3, 'Qui {mink:y} è la forza, {mink:x} l’allungamento\ne {mink:k} = 0,25 N/cm.'],
  [47.5, 52.3, 'Ora un viaggio di 120 km. Più vai\nveloce, meno tempo ci metti.'],
  [52.4, 56.4, 'Velocità {mx:v} = 60 km/h:\ntempo {mink:t} = {g:2 h}.'],
  [56.5, 61.3, 'A 30 km/h, metà velocità:\nservono {g:4 h}, il doppio.'],
  [61.5, 65.9, 'Velocità doppia, tempo {g:metà}:\nsono {v:inversamente proporzionali}.'],
  [66.1, 69.5, 'E a 20, 40, 120 km/h?'],
  [69.7, 74.1, 'Il {g:prodotto} {mx:v}{mink:·t} resta sempre\n120 km: ecco la regola.'],
  [74.3, 78.7, 'Sul grafico i punti stanno\nsu un ramo di {y:iperbole}.'],
  [80.4, 84.2, 'Andando piano piano, il tempo\ndiventa {g:enorme}.'],
  [86.1, 89.9, 'Velocissimi, il tempo\ndiventa piccolissimo…'],
  [90.1, 94.9, '…ma mai zero: la curva si avvicina\nagli assi {g:senza toccarli}.'],
  [95.1, 99.9, 'In generale {mink:y = k/x}, con\n{mink:x} velocità e {mink:y} tempo.'],
  [102.6, 107.6, 'Diretta: rapporto costante, retta.\nInversa: prodotto costante, iperbole.'],
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
function disegnaMolla(ctx, x, y0, y1, n = 16, larga = 22) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + 10);
  const h = (y1 - y0 - 20) / n;
  for (let i = 0; i < n; i++) ctx.lineTo(x + (i % 2 ? -larga : larga), y0 + 10 + h * (i + .5));
  ctx.lineTo(x, y1 - 10); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
}
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
// assi con scale diverse: o = { ox, oy, ux, uy, x1, y1, xt: [tacche], yt: [tacche], xlab, ylab }
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
  conFont(TITOLI, () => drawRich(ctx, 'Retta o iperbole', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- 1 · la molla (7,5–47,5): k = 25 N/m, cioè 4 cm per newton; un peso alla volta, nelle pause fra i fumetti ----------
const K = 25, EVENTI = [[12.2, 1], [16.8, 2], [20.4, 3]];
const quanti = t => { let n = 0; for (const [te, k] of EVENTI) if (t >= te) n = k; return n; };
// oscillazione smorzata verso il nuovo equilibrio (4 cm per newton): ω = √(k/m), m = n · 0,102 kg
function allungamento(t) {
  let prima = 0, ora = 0, t0 = -99, n = 0;
  for (const [te, k] of EVENTI) { if (t < te) break; prima = ora; n = k; t0 = te; ora = 4 * k; }
  if (t0 < 0) return 0;
  const tau = t - t0, m = n * .102, om = Math.sqrt(K / m), g = 4;
  const omd = Math.sqrt(om * om - g * g);
  return ora + (prima - ora) * Math.exp(-g * tau) * (Math.cos(omd * tau) + g / omd * Math.sin(omd * tau));
}
const SPR = [372, 110, 400, 690], SX = 560, YT = 140, YR = 310, PXC = 7;   // 7 px per cm
function sceneMolla(ctx, t) {
  if (t < 7.5 || t > 47.9) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 47.1, 47.6));
  card(ctx, ...SPR, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.dim); ctx.fillRect(SX - 70, YT - 12, 140, 12);
  const xr = SX - 110;
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xr, YR); ctx.lineTo(xr, YR + 20 * PXC); ctx.stroke();
  for (let c = 0; c <= 20; c++) { const y = YR + c * PXC, l = c % 10 === 0 ? 22 : c % 5 === 0 ? 15 : 8; ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(xr + l, y); ctx.stroke(); }
  for (const c of [0, 10, 20]) txt(ctx, String(c), xr - 12, YR + c * PXC, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'cm', xr - 12, YR + 20 * PXC + 40, { size: 30, color: C.dim, align: 'right' });
  dashed(ctx, [xr - 4, YR], [SX + 60, YR], C.dim, 1, P(t, 8.4, 9.0) * .8);
  const x = allungamento(t), ye = YR + x * PXC;
  disegnaMolla(ctx, SX, YT, ye);
  // i pesi da 1 N: ognuno compare appena prima di essere lasciato, a fumetto chiuso
  let nv = 0, kl = 1;
  for (const [te, k] of EVENTI) if (t >= te - .2) { nv = k; kl = P(t, te - .2, te); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  if (nv) { ctx.beginPath(); ctx.moveTo(SX, ye); ctx.lineTo(SX, ye + 14); ctx.stroke(); }
  for (let i = 0; i < nv; i++) {
    ctx.save(); ctx.globalAlpha *= i === nv - 1 ? kl : 1;
    ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(SX - 42, ye + 14 + i * 15, 84, 13, 4); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // l'allungamento x, in azzurro, sul righello
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(xr + 4, ye); ctx.lineTo(SX - 26, ye); ctx.stroke(); ctx.setLineDash([]);
  if (x > 1.5) {
    ctx.save(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 9; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(xr + 30, YR); ctx.lineTo(xr + 30, ye); ctx.stroke();
    drawRich(ctx, '{mx:x}', xr + 58, (YR + ye) / 2, { size: 40, alpha: clamp((x - 6) / 2) });   // solo quando c'è posto fra le due linee
    ctx.restore();
  }
  // la forza: il peso dei dischi, 40 px per newton
  const n = quanti(t);
  if (n) {
    freccia(ctx, [SX + 80, ye], [SX + 80, ye + n * 40], C.y);
    drawRich(ctx, '{my:F} = ' + n + ' N', SX + 80, ye + n * 40 + 32, { size: 34 });
  }
  ctx.restore();
}
// la tabella e il grafico F–x
const GR = [800, 110, 1040, 690], G1 = { ox: 900, oy: 745, ux: 40, uy: 72, x1: 20, y1: 5, xt: [4, 8, 12, 16, 20], yt: [1, 2, 3, 4, 5], xlab: '{mx:x} (cm)', ylab: '{my:F} (N)' };
const g1 = (x, F) => [G1.ox + x * G1.ux, G1.oy - F * G1.uy];
function sceneGraficoF(ctx, t) {
  if (t < 7.5 || t > 47.9) return;
  const al = P(t, 7.9, 8.5) * (1 - P(t, 47.1, 47.6));
  card(ctx, ...GR, al);
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{dim:forza} {my:F} (N)', 830, 165, { size: 32, align: 'left' });
  drawRich(ctx, '{dim:allungamento} {mx:x} (cm)', 830, 222, { size: 32, align: 'left' });
  const kr = P(t, 28.8, 29.3);
  drawRich(ctx, '{my:F}{mink:/}{mx:x} (N/cm)', 830, 282, { size: 32, align: 'left', alpha: kr });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(830, 252); ctx.lineTo(1810, 252); ctx.stroke();
  EVENTI.forEach(([te, k], i) => {
    const kk = P(t, te + .9, te + 1.3); if (kk <= 0) return;
    const xc = 1320 + i * 170;
    txt(ctx, String(k), xc, 165, { size: 36, color: C.y, alpha: kk });
    txt(ctx, String(4 * k), xc, 222, { size: 36, color: C.x, alpha: kk });
    txt(ctx, fmtN(k / (4 * k), 2), xc, 282, { size: 36, weight: 600, color: C.g, alpha: P(t, 28.9 + i * .3, 29.3 + i * .3) });
  });
  assi(ctx, G1, P(t, 8.4, 9.2));
  const kl = P(t, 33.5, 34.6);
  if (kl > 0) glowStroke(ctx, [g1(0, 0), g1(19, 4.75)], kl, C.v, 5);
  EVENTI.forEach(([te, k]) => dot(ctx, g1(4 * k, k), C.y, P(t, te + .9, te + 1.3, E.back), 10));
  dot(ctx, g1(0, 0), C.v, P(t, 34.2, 34.6, E.back), 9);
  drawRich(ctx, '{mink:y = k·x}', 1120, 450, { size: 52, local: t - 38.0 });
  drawRich(ctx, '{mink:k} = 0,25 N/cm', 1120, 525, { size: 40, local: t - 42.9 });
  ctx.restore();
}

// ---------- 2 · il viaggio di 120 km (47,5–99,9) ----------
// tempo accelerato: 1 h in mezzo secondo, a velocità costante; le due auto partono insieme mentre Stilla dice
// «più vai veloce, meno tempo ci metti» e sono già arrivate quando si dicono i numeri (2 h a 50,6 s, 4 h a 51,6 s)
const X0 = 620, PXK = 9.4;                                 // la strada: 0 km in x 620 (a destra delle scritte), 9,4 px per km
const CORSIE = [{ v: 30, y: 200, t0: 49.6 }, { v: 60, y: 268, t0: 49.6 }];
const ore = (L, t) => clamp((t - L.t0) * 2, 0, 120 / L.v);
// ore scritte senza zeri inutili: 2 → «2», 0,75 → «0,75», 6,666… → «6,7»
const ore2 = h => { const c = Math.round(h * 100); return c % 100 === 0 ? String(c / 100) : c % 10 === 0 ? fmtN(h, 1) : Math.abs(h * 100 - c) < 1e-9 ? fmtN(h, 2) : fmtN(h, 1); };
function sceneStrada(ctx, t) {
  if (t < 47.4 || t > 100.4) return;
  const al = P(t, 47.5, 48.1) * (1 - P(t, 99.7, 100.3));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 1468, 172);
  for (const L of CORSIE) {
    ctx.fillStyle = css(C.dim, .22); ctx.fillRect(X0 - 20, L.y, 120 * PXK + 40, 8);
    txt(ctx, L.v + ' km/h', 392, L.y - 22, { size: 30, color: C.x, align: 'left' });
    auto(ctx, X0 + L.v * ore(L, t) * PXK - 35, L.y, C.x, .7);
    const tArr = L.t0 + 120 / L.v / 2;
    txt(ctx, (120 / L.v) + ' h', X0 + 120 * PXK + 18, L.y - 18, { size: 30, weight: 600, align: 'left', alpha: P(t, tArr, tArr + .4) });
  }
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
  for (const x of [X0, X0 + 120 * PXK]) { ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, 278); ctx.stroke(); }
  ctx.setLineDash([]);
  txt(ctx, 'partenza', X0 + 10, 132, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'arrivo: 120 km', X0 + 120 * PXK - 10, 132, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'tempo accelerato', 1180, 132, { size: 30, color: C.dim, alpha: life(t, 49.3, 52.3, .3, .4) });
  ctx.restore();
}
const G2 = { ox: 470, oy: 745, ux: 4.6, uy: 39, x1: 160, sotto: true, y1: 10, xt: [20, 40, 60, 80, 100, 120], yt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xlab: '{mx:v} (km/h)', ylab: '{mink:t} (h)' };
const g2 = (v, h) => [G2.ox + v * G2.ux, G2.oy - h * G2.uy];
const RIGHE = [[20, 66.6], [30, 56.7], [40, 67.1], [60, 52.6], [120, 67.6]];   // velocità e istante in cui compare
// l'iperbole da 12 km/h (10 h) a 160 km/h (0,75 h): si avvicina ai due assi senza toccarli
const IPER = []; for (let i = 0; i <= 240; i++) { const v = 12 * Math.pow(160 / 12, i / 240); IPER.push(g2(v, 120 / v)); }
// il punto che scorre sulla curva verso i due estremi, nelle pause fra i fumetti
const vPunto = t => kf(t, [[78.8, 30], [80.2, 15], [84.3, 15], [85.9, 160]]);
function sceneGraficoV(ctx, t) {
  if (t < 47.4 || t > 100.4) return;
  const al = P(t, 47.7, 48.3) * (1 - P(t, 99.7, 100.3));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 300, 880, 500);
  assi(ctx, G2, P(t, 48.0, 48.8));
  const kc = P(t, 74.5, 75.8);
  if (kc > 0) glowStroke(ctx, IPER, kc, C.y, 5);
  RIGHE.forEach(([v, ta]) => dot(ctx, g2(v, 120 / v), C.y, P(t, ta, ta + .4, E.back), 10));
  // il punto che va verso gli estremi, con le sue proiezioni
  const ke = life(t, 78.7, 95.0, .3, .4);
  if (ke > 0) {
    const v = vPunto(t), p = g2(v, 120 / v);
    ctx.save(); ctx.globalAlpha *= ke;
    dashed(ctx, g2(v, 0), p, C.x, 1, .8); dashed(ctx, g2(0, 120 / v), p, C.dim, 1, .8);
    dot(ctx, p, C.y, 1, 12);
    const vr = Math.round(v), tr = 120 / vr;   // il tempo viene dalla velocità mostrata
    drawRich(ctx, '{mx:v} = ' + vr + ' km/h   {mink:t} ' + (Math.abs(tr * 100 - Math.round(tr * 100)) < 1e-9 ? '=' : '≈') + ' ' + ore2(tr) + ' h', 1180, 370, { size: 34, align: 'right' });
    ctx.restore();
  }
  drawRich(ctx, '{g:senza toccare gli assi}', 1180, 440, { size: 34, align: 'right', alpha: life(t, 90.2, 95.0, .4, .4) });
  drawRich(ctx, '{mink:y = k/x}', 1000, 450, { size: 52, local: t - 95.2 });
  ctx.restore();
}
function sceneTabella(ctx, t) {
  if (t < 47.4 || t > 100.4) return;
  const al = P(t, 47.9, 48.5) * (1 - P(t, 99.7, 100.3));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1280, 300, 560, 500);
  drawRich(ctx, '{mx:v} (km/h)', 1375, 350, { size: 32 });
  drawRich(ctx, '{mink:t} (h)', 1550, 350, { size: 32 });
  drawRich(ctx, '{mx:v}{mink:·t} (km)', 1725, 350, { size: 32, alpha: P(t, 69.7, 70.2) });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1305, 380); ctx.lineTo(1815, 380); ctx.stroke();
  RIGHE.forEach(([v, ta], i) => {
    const k = P(t, ta, ta + .4); if (k <= 0) return;
    const y = 420 + i * 60;
    txt(ctx, String(v), 1375, y, { size: 38, color: C.x, alpha: k });
    txt(ctx, String(120 / v), 1550, y, { size: 38, alpha: k });
    txt(ctx, '120', 1725, y, { size: 38, weight: 600, color: C.g, alpha: P(t, 69.9 + i * .2, 70.3 + i * .2) });
  });
  // durante i viaggi: il cronometro dell'auto che corre; poi la regola
  const kt = life(t, 49.3, 52.3, .3, .3);
  if (kt > 0) {
    const h = ore(CORSIE[0], t);   // partono insieme: il cronometro è lo stesso
    drawRich(ctx, '{dim:tempo di viaggio}  ' + ore2(h) + ' h', 1560, 735, { size: 36, alpha: kt });
  }
  drawRich(ctx, 'velocità doppia → tempo {g:metà}', 1560, 735, { size: 34, alpha: life(t, 61.6, 66.0, .3, .3) });
  drawRich(ctx, '{mx:v}{mink:·t} = 120 km {dim:sempre}', 1560, 735, { size: 38, alpha: P(t, 69.9, 70.4) * (1 - P(t, 95.1, 95.5)) });
  drawRich(ctx, '{mink:x·y = k}, {dim:qui} {mink:k} = 120 km', 1560, 735, { size: 38, alpha: P(t, 95.6, 96.1) });
  ctx.restore();
}

// in una frase (100–110)
function sceneFine(ctx, t) {
  if (t < 99.9) return;
  const al = 1 - P(t, 107.9, 108.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 100.1 });
    drawRich(ctx, 'Diretta: {mink:y/x} costante, una {v:retta}.\nInversa: {mink:x·y} costante, un’{y:iperbole}.', W / 2, 290, { size: 66, weight: 600, local: t - 100.5, stagger: .09 });
  });
  const pills = [[490, '{v:diretta}: {mink:x} doppio,\n{mink:y} doppio'], [960, '{y:inversa}: {mink:x} doppio,\n{mink:y} metà'], [1430, 'l’{y:iperbole} non\ntocca gli assi']];
  pills.forEach(([x, s], i) => {
    const a = 102.1 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nella molla il tono segue il peso, da 16 cm di allungamento (0) a
  // molla scarica (1); nel viaggio segue il tempo, da 0 h (0) a 10 h (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.4, 9.2],                                           // la molla, gli assi
    ['tono', 12.2, 13.1, [1, .73, .67, .79, .76, .73, .75, .75]], ['pop', 13.1, .3],  // 1 N: scende di 4 cm, il punto
    ['tono', 16.8, 17.7, [.75, .59, .44, .45, .51, .52, .5, .49]], ['pop', 17.7, .4], // 2 N: 8 cm
    ['tono', 20.4, 21.3, [.5, .39, .24, .2, .22, .25, .26, .26]], ['pop', 21.3, .5],  // 3 N: 12 cm
    ['pop', 28.9, .45], ['ding', 29.7],                                               // il rapporto: sempre 0,25
    ['traccia', 33.5, 34.6], ['tono', 33.5, 34.6, [0, .06, .5, .94, 1]], ['pop', 34.3, .3],   // la retta per l'origine
    ['pop', 38.1, .55], ['pop', 43.0, .45],                                           // y = k·x, k = 0,25 N/cm
    ['soffio', 47.5], ['traccia', 48.0, 48.8],                                        // il viaggio, gli assi
    ['tono', 49.6, 51.6, [0, .2, .4]], ['pop', 50.6, .5], ['pop', 51.6, .45],          // il cronometro: 2 h e 4 h
    ['pop', 52.7, .2], ['pop', 56.8, .4],                                             // 60 km/h: 2 h; 30 km/h: 4 h
    ['pop', 66.7, .6], ['pop', 67.2, .3], ['pop', 67.7, .1],                          // 20, 40, 120 km/h
    ['pop', 70.0, .5], ['ding', 70.8],                                                // il prodotto: sempre 120
    ['traccia', 74.5, 75.8], ['tono', 74.5, 75.8, [1, .97, .79, .44, .17, .1, .08, .07]],   // il ramo di iperbole
    ['pop', 78.9, .4], ['tono', 78.8, 80.2, [.4, .41, .53, .75, .8]],                 // il punto: piano piano, tempo enorme
    ['tono', 84.3, 85.9, [.8, .72, .42, .2, .1, .08, .08, .07]],                      // velocissimi: tempo piccolissimo
    ['pop', 90.4, .35],                                                               // senza toccare gli assi
    ['pop', 95.3, .55], ['pop', 95.7, .5],                                            // y = k/x
    ['soffio', 100.0], ['pop', 102.1, .5], ['pop', 102.6, .6], ['pop', 103.1, .7],    // in una frase
  ];
  return {
    titolo: 'Retta o iperbole', durata: 110, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 47.3, 'proporzionalità diretta'], [47.3, 99.9, 'proporzionalità inversa']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMolla(ctx, t); sceneGraficoF(ctx, t); sceneStrada(ctx, t); sceneGraficoV(ctx, t); sceneTabella(ctx, t); sceneFine(ctx, t); },
  };
});
