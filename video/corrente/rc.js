'use strict';
/* Il condensatore che si carica — pila da 12 V, R = 50 kΩ, C = 100 µF: τ = R·C = 5 s, Q = C·12 V = 1,2 mC,
   I₀ = 12 V / 50 kΩ = 0,24 mA. Il tempo fisico tf(t) scorre a velocità vera (1 s per 1 s) e si ferma solo nei fermi
   immagine: all'istante della chiusura (q = 0, I = I₀), a t = τ (63%), a 2τ (86%) e a 5τ (99,3%). q(t) = Q·(1 − e^(−t/τ)),
   I(t) = I₀·e^(−t/τ): i grafici, i numeri, i segni sulle armature (8 al massimo) e gli elettroni (spostati di 300 px
   per tutta la carica Q: si muovono in proporzione alla carica passata) vengono tutti da queste due formule. La curva
   tratteggiata è quella con R doppia (τ = 10 s). Frecce della corrente C.v lunghe in proporzione (1000 px/mA).
   Colori fissi della corrente: corrente C.v, elettroni C.x, tensione C.y; la carica che arriva C.g. Argomento: corrente. */
CVIDEO.registra('corrente/rc', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 84.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [23.7, 'pensa'], [29.0, 'sorpreso'],
  [34.5, 'neutro'], [39.7, 'felice'], [44.9, 'neutro'], [55.1, 'felice'], [58.0, 'neutro'], [65.0, 'pensa'],
  [73.0, 'festa'], [78.2, 'neutro'], [86.4, 'felice'], [90.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Un condensatore si carica\nin un istante?'],
  [7.9, 13.0, 'Una pila da 12 V, una {g:resistenza}\ne un {g:condensatore}, con un interruttore.'],
  [13.1, 18.4, 'La carica {mink:q} cresce con la tensione:\n{mink:q} = {mink:C}·{my:V}, con {mink:C} la {g:capacità}.'],
  [18.5, 23.6, '{mink:C} si misura in farad: qui 100 µF\n(microfarad, milionesimi di farad).'],
  [23.7, 28.95, 'A pieno, a 12 V: {mink:Q} = 1,2 mC\n(millesimi di coulomb).'],
  [29.0, 34.4, 'Chiudo: il condensatore è scarico,\ne {mv:I} = 12 V / {mink:R} = 0,24 mA.'],
  [34.5, 39.6, 'Più carica c’è, più il condensatore\nrespinge quella nuova: la corrente {v:cala}.'],
  [39.7, 44.8, 'Dopo un tempo {mink:τ} = {mink:R}·{mink:C} = 5 s\nla carica è al {g:63%}.'],
  [44.9, 50.0, 'La curva è un’{g:esponenziale}: dopo {mink:τ}\nmanca il 37% della carica finale.'],
  [50.1, 55.0, 'Nel {mink:τ} dopo manca il 37%\ndi quel che mancava…'],
  [55.1, 57.9, '…e a 2{mink:τ} è all’{g:86%}.'],
  [58.0, 63.1, 'Anche la corrente cala in modo\n{g:esponenziale}: ogni {mink:τ} si riduce al 37%.'],
  [65.0, 70.1, 'La carica sale sempre più piano:\nsi avvicina a {mink:Q} senza fretta.'],
  [73.0, 78.1, 'Dopo 5{mink:τ}, 25 s, è al 99%:\n{g:praticamente carico}.'],
  [78.2, 83.4, 'Con {mink:R} o {mink:C} doppi, {mink:τ} raddoppia:\nla carica è {g:due volte} più lenta.'],
  [86.4, 92.4, 'La carica sale in fretta e poi sempre\npiù piano: dopo {mink:R}·{mink:C} è al 63%.'],
];

// ---------- la fisica: tutto viene da qui ----------
const V0 = 12, RES = 50e3, CAP = 100e-6, TAU_RC = RES * CAP, QMAX = CAP * V0, I0 = V0 / RES;   // 5 s, 1,2 mC, 0,24 mA
const T_CHIUDE = 29.0;
// il tempo fisico: fermo alla chiusura, poi a velocità vera, fermo a τ e a 2τ, di nuovo vero fino a 5τ
const tf = t => t < 34.5 ? 0 : t < 39.5 ? t - 34.5 : t < 50.0 ? 5 : t < 55.0 ? 5 + (t - 50.0) : t < 58.0 ? 10 : t < 73.0 ? 10 + (t - 58.0) : 25;
const fermoImmagine = t => t < 34.5 || (t >= 39.5 && t < 50.0) || (t >= 55.0 && t < 58.0) || t >= 73.0;
const carica = s => QMAX * (1 - Math.exp(-s / TAU_RC));            // coulomb
const corrente = s => I0 * Math.exp(-s / TAU_RC);                   // ampere

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
function resistenza(ctx, a, b, al = 1) {
  if (al <= 0) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const n = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
  for (let i = 0; i < n; i++) for (const [f, s] of [[.25, 1], [.75, -1]]) { const d = (i + f) * L / n; ctx.lineTo(a[0] + ux * d + nx * 20 * s, a[1] + uy * d + ny * 20 * s); }
  ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function interruttore(ctx, a, b, chiuso, al) {   // su un filo orizzontale: perno in a, contatto in b
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - chiuso) * .55;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function elettrone(ctx, p, al = 1, r = 11) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]); ctx.stroke();
  ctx.restore();
}
function segno(ctx, p, s, al, r = 8) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(s > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); if (s > 0) { ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); } ctx.stroke(); ctx.restore();
}
function etichetta(ctx, s, x, y, al, align = 'center', size = 34) { if (al > 0) drawRich(ctx, s, x, y, { size, align, alpha: al }); }
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}
// «prima e» + esponente piccolo e alzato + «dopo»: il motore alza da solo solo cifre e segni, non −t/τ
function conEsponente(ctx, prima, esp, dopo, x, y, size, al = 1) {
  if (al <= 0) return;
  const se = Math.round(size * .62);
  ctx.save(); ctx.font = `italic ${Math.round(se * 1.12)}px "KaTeX_Math", Cambria, serif`; const we = ctx.measureText(esp).width; ctx.restore();
  drawRich(ctx, prima, x, y, { size, align: 'right', alpha: al });
  drawRich(ctx, '{mink:' + esp + '}', x + 3, y - size * .4, { size: se, align: 'left', alpha: al });
  drawRich(ctx, dopo, x + 8 + we, y, { size, align: 'left', alpha: al });
}

// ---------- il circuito ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XB = 260, XC = 960, YT = 230, YG = 670, YC = 450, Y_SU = 410, Y_GIU = 490;   // armature a 410 e 490
const SW_A = [380, YT], SW_B = [470, YT];
const SOPRA = percorso([[XC, Y_SU - 6], [XC, YT], [XB, YT], [XB, YC - 15]]);       // dall'armatura + verso il polo +
const SOTTO = percorso([[XB, YC + 15], [XB, YG], [XC, YG], [XC, Y_GIU + 6]]);      // dal polo − verso l'armatura −
const N_E = 21, PASSO = SOTTO.L / N_E, SPOST = 300;                                // SPOST px per tutta la carica Q
const PX_MA = 1000;
function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = tf(t), q = carica(s), chiuso = P(t, T_CHIUDE - .3, T_CHIUDE), I = corrente(s) * (t >= T_CHIUDE ? 1 : 0);
  const kw = P(t, 8.1, 9.6, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], SW_A], kw);
  filo(ctx, [SW_B, [560, YT]], kw);
  filo(ctx, [[760, YT], [XC, YT], [XC, Y_SU]], kw);
  filo(ctx, [[XB, YC + 15], [XB, YG], [XC, YG], [XC, Y_GIU]], kw);
  resistenza(ctx, [560, YT], [760, YT], P(t, 8.6, 9.1));
  interruttore(ctx, SW_A, SW_B, chiuso, P(t, 8.8, 9.3));
  pila(ctx, XB, YC, P(t, 8.1, 8.6));
  // il condensatore: due armature, e le cariche che vi arrivano (8 segni per tutta Q)
  const kc = P(t, 8.6, 9.1);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(XC - 85, Y_SU); ctx.lineTo(XC + 85, Y_SU); ctx.moveTo(XC - 85, Y_GIU); ctx.lineTo(XC + 85, Y_GIU); ctx.stroke(); ctx.restore();
  }
  const n = Math.round(8 * q / QMAX);
  for (let k = 0; k < n; k++) { const x = XC + (k - 3.5) * 21; segno(ctx, [x, Y_SU + 20], 1, 1); segno(ctx, [x, Y_GIU - 20], -1, 1); }
  etichetta(ctx, '{y:12 V}', 198, YC, P(t, 8.1, 8.6), 'right', 36);
  etichetta(ctx, '{mink:R} = 50 kΩ', 660, 168, P(t, 8.8, 9.3));
  txt(ctx, 'interruttore', 425, 168, { size: 30, color: C.dim, alpha: P(t, 9.0, 9.5) });
  etichetta(ctx, '{mink:C} = 100 µF', 860, YC, P(t, 18.8, 19.3), 'right');   // quando si dice che cos'è C
  // gli elettroni: spostati in proporzione alla carica passata
  const ke = P(t, 9.4, 10.0), D = SPOST * q / QMAX;
  if (ke > 0) for (const pc of [SOPRA, SOTTO]) for (let i = 0; i < N_E; i++) {
    const u = ((i * PASSO + D) % pc.L + pc.L) % pc.L, bordo = clamp(u / 18) * clamp((pc.L - u) / 18), p = puntoSu(pc, u);
    const nelVuoto = pc === SOPRA && p[1] === YT && p[0] > SW_A[0] - 16 && p[0] < SW_B[0] + 16 ? 1 - chiuso : 0;
    elettrone(ctx, p, ke * bordo * (1 - nelVuoto), 10);
  }
  drawRich(ctx, '{dim:pallini: elettroni (accelerati)}', 150, 752, { size: 30, align: 'left', alpha: ke });
  // la corrente: freccia sotto, lunga in proporzione, e il suo valore
  const kI = P(t, T_CHIUDE, T_CHIUDE + .3), L = PX_MA * I * 1e3;
  freccia(ctx, [610 + L / 2, YG + 45], [610 - L / 2, YG + 45], C.v, kI);
  if (kI > 0) {
    drawRich(ctx, '{mv:I} =', 760, YG + 45, { size: 34, align: 'left', alpha: kI });
    fixedNum(ctx, fmtN(I * 1e3, 3), 965, YG + 45, 34, C.v, kI);
    txt(ctx, 'mA', 975, YG + 45, { size: 32, align: 'left', alpha: kI });
  }
  ctx.restore();
}

// ---------- i grafici ----------
const GX0 = 1240, PX_S = 20;
const gx = s => GX0 + s * PX_S;
const GQ0 = 420, gq = q => GQ0 - 170 * q / QMAX;     // q da 0 a Q
const GI0 = 740, gi = i => GI0 - 170 * i / I0;       // I da 0 a I₀
function assi(ctx, y0, ytop, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, y0); ctx.lineTo(1752, y0); ctx.moveTo(GX0, y0 + 4); ctx.lineTo(GX0, ytop); ctx.stroke();
  arrowHead(ctx, [1758, y0], 0, C.ink); arrowHead(ctx, [GX0, ytop - 6], -Math.PI / 2, C.ink);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let k = 1; k <= 5; k++) { ctx.beginPath(); ctx.moveTo(gx(5 * k), y0 - 2); ctx.lineTo(gx(5 * k), ytop + 8); ctx.stroke(); }
  ctx.restore();
}
function curva(ctx, f, s1, y, col, w = 5, tratt = false) {
  if (s1 <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (tratt) ctx.setLineDash([12, 9]);
  ctx.beginPath(); for (let i = 0; i <= 120; i++) { const s = s1 * i / 120, p = [gx(s), y(f(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
}
function sceneGrafici(ctx, t) {
  const al = life(t, 29.0, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = tf(t), q = carica(s), I = corrente(s);
  // le letture
  drawRich(ctx, '{mink:t} =', 1200, 160, { size: 36, align: 'left' });
  fixedNum(ctx, fmtN(s, 1), 1385, 160, 38, C.ink); txt(ctx, 's', 1395, 160, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:q} =', 1470, 160, { size: 36, align: 'left' });
  fixedNum(ctx, fmtN(q * 1e3, 3), 1680, 160, 38, C.g); txt(ctx, 'mC', 1690, 160, { size: 32, align: 'left', color: C.g });
  // il tempo scorre a velocità vera, tranne nei fermi immagine (lo si scrive)
  const fermo = fermoImmagine(t);
  txt(ctx, fermo ? 'fermo immagine' : 'tempo vero', 1790, 205, { size: 30, color: C.dim, align: 'right' });
  // la percentuale della carica finale
  drawRich(ctx, '{dim:carica:}', 1440, 494, { size: 34, align: 'right' });
  fixedNum(ctx, String(Math.round(100 * q / QMAX)), 1540, 494, 40, C.g);
  drawRich(ctx, '{g:%} {dim:di} {mink:Q}', 1538, 494, { size: 34, align: 'left' });
  // la formula, mentre se ne parla (poi lì arriva il grafico della corrente)
  const kF = life(t, 45.1, 58.0, .5, .4);
  conEsponente(ctx, '{mink:q} = {mink:Q}·(1 − {mink:e}', '−t/τ', '{mink:)}', 1560, 640, 48, kF);
  if (kF > 0) drawRich(ctx, '{dim:con} {mink:e} {dim:≈ 2,72}', 1480, 712, { size: 32, alpha: kF });
  // q(t)
  assi(ctx, GQ0, 228, 1);
  const kTau = P(t, 39.7, 40.3);
  for (let k = 1; k <= 5; k++) {
    txt(ctx, String(5 * k), gx(5 * k), GQ0 + 26, { size: 30, color: C.dim, alpha: 1 - kTau });
    drawRich(ctx, '{mink:' + (k > 1 ? k : '') + 'τ}', gx(5 * k), GQ0 + 26, { size: 30, alpha: kTau });
  }
  drawRich(ctx, '{mink:t} {dim:(s)}', 1790, GQ0 - 30, { size: 30, align: 'right', alpha: 1 - kTau });
  drawRich(ctx, '{mink:q} {dim:(mC)}', GX0 + 18, 222, { size: 30, align: 'left' });
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(GX0, gq(QMAX)); ctx.lineTo(1740, gq(QMAX)); ctx.stroke(); ctx.restore();
  txt(ctx, '1,2', GX0 - 12, gq(QMAX), { size: 29, color: C.dim, align: 'right' });
  drawRich(ctx, '{mink:Q}', 1752, gq(QMAX) - 4, { size: 30, align: 'left' });
  // la curva con R doppia (τ = 10 s), per confronto
  const k2 = P(t, 78.4, 79.4);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    curva(ctx, u => QMAX * (1 - Math.exp(-u / (2 * TAU_RC))), 25 * k2, gq, C.dim, 4, true);
    drawRich(ctx, '{dim:con} {mink:R} {dim:doppia}', gx(18), 348, { size: 30 });
    ctx.restore();
  }
  curva(ctx, carica, s, gq, C.g);
  ctx.save(); ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(gx(s), gq(q), 9, 0, TAU); ctx.fill(); ctx.restore();
  // il 63% a t = τ
  const k63 = life(t, 39.7, 50.4, .4, .5);
  if (k63 > 0) {
    const q1 = carica(TAU_RC);
    ctx.save(); ctx.globalAlpha *= k63; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(gx(5), GQ0); ctx.lineTo(gx(5), gq(q1)); ctx.lineTo(GX0, gq(q1)); ctx.stroke(); ctx.restore();
    txt(ctx, '0,76', GX0 - 12, gq(q1), { size: 29, color: C.g, align: 'right', alpha: k63 });
    drawRich(ctx, '{g:63%}', gx(5) + 24, gq(q1) + 30, { size: 34, align: 'left', alpha: k63 });
  }
  // l'86% a t = 2τ
  const k86 = life(t, 55.1, 58.2, .4, .5);
  if (k86 > 0) {
    const q2 = carica(2 * TAU_RC);
    ctx.save(); ctx.globalAlpha *= k86; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(gx(10), GQ0); ctx.lineTo(gx(10), gq(q2)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:86%}', gx(10) + 24, gq(q2) + 30, { size: 34, align: 'left', alpha: k86 });
  }
  // I(t), dal momento in cui se ne parla
  const kI = P(t, 58.0, 58.6);
  if (kI > 0) {
    ctx.save(); ctx.globalAlpha *= kI;
    assi(ctx, GI0, 548, 1);
    for (let k = 1; k <= 5; k++) txt(ctx, String(5 * k), gx(5 * k), GI0 + 24, { size: 29, color: C.dim });
    drawRich(ctx, '{mink:t} {dim:(s)}', 1790, GI0 - 30, { size: 30, align: 'right' });
    drawRich(ctx, '{mv:I} {dim:(mA)}', GX0 + 18, 542, { size: 30, align: 'left' });
    txt(ctx, '0,24', GX0 - 12, gi(I0), { size: 29, color: C.dim, align: 'right' });
    curva(ctx, corrente, s, gi, C.v);
    ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(gx(s), gi(I), 9, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// ---------- il pannello prima della chiusura: che cos'è un condensatore ----------
function scenePannello(ctx, t) {
  const k = life(t, 7.9, 29.0, .5, .5);
  if (k <= 0) return;
  const cx = 1480;
  ctx.save(); ctx.globalAlpha *= k;
  conFont(TITOLI, () => drawRich(ctx, 'il condensatore', cx, 170, { size: 40, weight: 600, local: t - 8.0 }));
  drawRich(ctx, '{dim:due armature affacciate}', cx, 228, { size: 32, local: t - 8.3 });
  separa(ctx, 272, P(t, 13.1, 13.5));
  drawRich(ctx, '{mink:q} = {mink:C}·{my:V}', cx, 330, { size: 56, local: t - 13.3 });
  drawRich(ctx, '{mink:C}{dim:: la capacità}', cx, 390, { size: 32, local: t - 15.0 });
  separa(ctx, 434, P(t, 18.5, 18.9));
  drawRich(ctx, '{dim:si misura in farad (F)}', cx, 480, { size: 32, local: t - 18.6 });
  drawRich(ctx, '{mink:C} = 100 µF = 0,0001 F', cx, 535, { size: 38, local: t - 19.6 });
  separa(ctx, 580, P(t, 23.7, 24.1));
  drawRich(ctx, '{dim:a pieno, con 12 V:}', cx, 625, { size: 32, local: t - 23.8 });
  drawRich(ctx, '{mink:Q} = {mink:C}·12 V = {g:1,2 mC}', cx, 685, { size: 42, local: t - 24.4 });
  drawRich(ctx, '{dim:1 mC = 0,001 C}', cx, 742, { size: 30, local: t - 25.6 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il condensatore che si carica', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 93.2, 94.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La carica sale in fretta, poi sempre\npiù piano: dopo {mink:R}·{mink:C} è al 63%.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'dopo {mink:τ} = {mink:R}·{mink:C}:\n{g:63%} della carica'], [960, 'dopo 5{mink:τ}:\n{g:praticamente carico}'], [1470, 'la corrente {v:cala}\n{dim:fino a quasi zero}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la carica, da 0 (0) a Q (1), solo quando il tempo scorre;
  // il tratto lungo da 2τ a 5τ ha un tono breve (la carica non sale quasi più)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 9.6], ['pop', 8.3, .4], ['pop', 8.8, .5],       // il circuito, la pila, il condensatore
    ['pop', 9.6, .3],                                                                 // gli elettroni
    ['pop', 13.4, .55], ['pop', 18.9, .45], ['pop', 19.7, .4], ['pop', 24.5, .6],     // q = C·V, C = 100 µF, Q = 1,2 mC
    ['pop', 28.9, .4], ['soffio', 29.1],                                              // si chiude, arrivano i grafici
    ['tono', 34.5, 39.5, [0, .12, .22, .31, .39, .46, .53, .58, .63]],                // la carica cresce fino a τ
    ['traccia', 39.7, 40.1], ['ding', 39.9],                                          // 63%
    ['pop', 45.2, .55],                                                               // q = Q·(1 − e^(−t/τ))
    ['tono', 50.0, 55.0, [.63, .7, .75, .8, .83, .86]],                               // da τ a 2τ
    ['traccia', 55.1, 55.5], ['ding', 55.3],                                          // 86%
    ['traccia', 58.0, 58.6], ['tono', 58.0, 61.0, [.86, .89, .91, .93]],              // il grafico della corrente; verso 5τ
    ['traccia', 78.4, 79.4], ['tono', 78.4, 79.4, [0, .08, .47, .84, .91, .92]],      // la curva con R doppia
    ['soffio', 84.1], ['pop', 86.2, .5], ['pop', 86.7, .6], ['pop', 87.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il condensatore che si carica', durata: 95, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 28.9, 'il circuito'], [28.9, 63.1, 'la carica'], [63.1, T_FINE, 'quasi carico']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); scenePannello(ctx, t); sceneGrafici(ctx, t); sceneFine(ctx, t); },
  };
});
