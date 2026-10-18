'use strict';
/* Il trasformatore — un anello di ferro con due bobine: il ferro porta lo stesso flusso Φ in ogni spira, quindi ogni
   spira ha la stessa f.e.m. e; le spire sono in serie: V₁ = N₁·e, V₂ = N₂·e, V₂/V₁ = N₂/N₁ (trasformatore ideale).
   In continua: pila da 12 V, chiudendo il flusso cresce come Φ = Φm·(1 − e^(−t/τ)) e il secondario dà
   V₂ = (N₂/N₁)·12 V·e^(−t/τ) (un guizzo, τ = 0,8 s sullo schermo, al rallentatore), poi zero. In alternata (rallentata
   100 volte: 0,5 Hz sullo schermo, 50 Hz dal vero) V₁ = V₀·sin(ω·t), Φ = −Φa·cos(ω·t), V₂ = (N₂/N₁)·V₁: i grafici
   vengono da queste formule. Disegnate 4 e 8 spire (rapporto 2: 12 V → 24 V, con N₁ = 100 e N₂ = 200), poi 10 e 1
   (rapporto 1/10: 230 V → 23 V, con N₁ = 1000 e N₂ = 100). Potenza conservata nel trasformatore ideale: V₁·I₁ = V₂·I₂.
   Perché si trasmette ad alta tensione è in corrente/joule: qui solo una riga. Colori: flusso C.g, tensione del
   primario C.x (ingresso), del secondario C.y (uscita), f.e.m. di una spira C.y, correnti C.v. Argomento: induzione. */
CVIDEO.registra('induzione/trasformatore', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 85.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.4, 'sorpreso'], [22.6, 'neutro'],
  [28.5, 'pensa'], [33.1, 'neutro'], [38.3, 'felice'], [43.5, 'neutro'], [59.1, 'festa'], [62.0, 'neutro'],
  [64.3, 'felice'], [69.5, 'sorpreso'], [74.7, 'neutro'], [87.8, 'felice'], [92.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come si alza o si abbassa\nuna tensione?'],
  [7.9, 12.8, 'Un anello di ferro con due bobine:\nil {g:primario} e il {g:secondario}.'],
  [12.9, 17.8, 'Il primario a una pila,\nil secondario a un voltmetro.'],
  [17.9, 22.5, 'Chiudo: il flusso nel ferro cresce\ne il voltmetro dà un {g:guizzo}.'],
  [22.6, 28.4, 'È la {g:mutua induzione}: {my:ε₂} = −{mink:M}·Δ{mv:I₁}/Δ{mink:t},\ncon {mv:I₁} nel primario e {mink:M} in henry.'],
  [28.5, 33.0, 'Poi il flusso è costante: niente.\nIn continua il trasformatore {r:non} funziona.'],
  [33.1, 38.2, 'Al posto della pila, una tensione\n{g:alternata} (al rallentatore).'],
  [38.3, 43.4, 'Il flusso cambia sempre: nel\nsecondario c’è sempre tensione.'],
  [43.5, 48.6, 'Il ferro porta lo {g:stesso flusso}\nin ogni spira delle due bobine.'],
  [48.7, 53.8, 'Ogni spira ha la stessa f.e.m. {my:e},\nper la legge di Faraday-Neumann.'],
  [53.9, 59.0, 'Le spire sono in serie: {mx:V₁} = {mink:N₁}·{my:e}\ne {my:V₂} = {mink:N₂}·{my:e}.'],
  [59.1, 64.2, 'Quindi {my:V₂}/{mx:V₁} = {mink:N₂}/{mink:N₁}:\nconta il {g:rapporto delle spire}.'],
  [64.3, 69.4, 'Spire doppie nel secondario:\ntensione {g:doppia}, da 12 V a 24 V.'],
  [69.5, 74.6, 'Dieci volte meno spire:\nda 230 V a {g:23 V}.'],
  [74.7, 79.8, 'La potenza non si crea: se la tensione\nsale, la corrente {g:scende}.'],
  [79.9, 85.0, 'Linee ad alta tensione: meno corrente,\nmeno calore nei fili; in casa 230 V.'],
  [87.8, 94.0, 'Il rapporto delle spire fa il rapporto\ndelle tensioni, ma solo in alternata.'],
];

// ---------- la fisica ----------
const T_CL = 18.3, T_AC = 33.4, TAUD = .8, OMD = Math.PI;   // chiusura, alternata, τ e ω sullo schermo
const T_ES2 = 69.5;                                          // secondo esempio: 10 spire contro 1
const rapporto = t => t < T_ES2 ? 2 : .1;                   // N₂/N₁
// in unità relative: flusso massimo 1, tensione del primario 1 (picco in alternata, 12 V in continua)
function flusso(s) {
  if (s < T_CL) return 0;
  if (s < T_AC) return 1 - Math.exp(-(s - T_CL) / TAUD);
  return -Math.cos(OMD * (s - T_AC));
}
function v1(s) { if (s < T_CL) return 0; if (s < T_AC) return 1; return Math.sin(OMD * (s - T_AC)); }
function v2(s) {
  if (s < T_CL) return 0;
  if (s < T_AC) return 2 * Math.exp(-(s - T_CL) / TAUD);
  return rapporto(s) * Math.sin(OMD * (s - T_AC));
}
const chiuso = t => P(t, T_CL - .2, T_CL);
// la tensione del secondario in volt (per l'ago): 24 V di guizzo in continua; in alternata 24 V e poi 23 V efficaci
function v2volt(s) {
  if (s < T_CL) return 0;
  if (s < T_AC) return 24 * Math.exp(-(s - T_CL) / TAUD);
  return (s < T_ES2 ? 24 : 23) * Math.SQRT2 * Math.sin(OMD * (s - T_AC));
}

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
function filo(ctx, pts, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function pila(ctx, x, yc, al) {   // su un ramo verticale: il polo + (lungo e sottile) in alto
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 44, yc - 22, 88, 44);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, yc - 15); ctx.lineTo(x + 40, yc - 15); ctx.stroke();
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 20, yc + 15); ctx.lineTo(x + 20, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 58, yc - 30, { size: 36, weight: 600, color: C.v, alpha: al });
  txt(ctx, '−', x + 58, yc + 32, { size: 36, weight: 600, color: C.x, alpha: al });
}
function generatore(ctx, x, yc, al) {   // tensione alternata: cerchio con un'onda
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, yc, 40, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 4; ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const u = i / 40, px = x - 24 + 48 * u, py = yc - 13 * Math.sin(TAU * u); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
  ctx.stroke(); ctx.restore();
}
function interruttore(ctx, a, b, k, al) {
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - k) * .6;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function strumento(ctx, c, r, defl, al) {   // voltmetro con lo zero al centro
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(c[0] - r - 26, c[1] - r - 30, 2 * r + 52, r + 44, 12); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2); ctx.stroke();
  for (let k = -4; k <= 4; k++) {
    const a = -Math.PI / 2 + k * 17 * Math.PI / 180, r0 = k === 0 ? r - 16 : r - 9;
    ctx.lineWidth = k === 0 ? 4 : 2.5;
    ctx.beginPath(); ctx.moveTo(c[0] + r0 * Math.cos(a), c[1] + r0 * Math.sin(a)); ctx.lineTo(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)); ctx.stroke();
  }
  const a = -Math.PI / 2 + defl;
  ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + (r - 6) * Math.cos(a), c[1] + (r - 6) * Math.sin(a)); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(c[0], c[1], 7, 0, TAU); ctx.fill();
  ctx.restore();
}
const COL_B = () => mix(C.g, C.paper, .12), RAME = () => mix(C.y, C.ink, .35);

// ---------- il trasformatore (sinistra) ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XO0 = 300, XO1 = 820, YO0 = 190, YO1 = 710, SP = 70;   // nucleo: rettangolo esterno e spessore
const XP = XO0 + SP / 2, XS = XO1 - SP / 2, YC0 = 320, YC1 = 580;   // assi delle due bobine, tratto avvolto
const yFila = (i, n) => YC0 + (i + .5) * (YC1 - YC0) / n;
function spire(ctx, xc, n, davanti, al, luce = 0) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const y = yFila(i, n);
    ctx.strokeStyle = css(davanti ? RAME() : mix(RAME(), C.paper, .45)); ctx.lineWidth = davanti ? 7 : 4;
    if (luce > 0 && davanti) { ctx.shadowColor = css(C.y, .9 * luce); ctx.shadowBlur = 18 * luce; }
    ctx.beginPath(); ctx.ellipse(xc, y, SP / 2 + 22, 13, 0, davanti ? 0 : Math.PI, davanti ? Math.PI : TAU); ctx.stroke();
  }
  ctx.restore();
}
function nucleo(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(XO0, YO0, XO1 - XO0, YO1 - YO0); ctx.rect(XO0 + SP, YO0 + SP, XO1 - XO0 - 2 * SP, YO1 - YO0 - 2 * SP);
  ctx.fill('evenodd'); ctx.stroke(); ctx.restore();
}
// quante spire si disegnano: 4 e 8, poi (secondo esempio) 10 e 1
const nP = t => t < T_ES2 ? 4 : 10, nS = t => t < T_ES2 ? 8 : 1;
function sceneTrasformatore(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const k0 = P(t, 8.0, 8.8), kc = 1 - P(t, T_ES2 - .5, T_ES2 - .1) + P(t, T_ES2, T_ES2 + .4);   // le spire si ridisegnano
  const np = nP(t), ns = nS(t), luce = life(t, 48.8, 53.8, .4, .4);
  // i fili del primario (alla sorgente) e del secondario (al voltmetro)
  const yp0 = yFila(0, np), yp1 = yFila(np - 1, np), ys0 = yFila(0, ns), ys1 = yFila(ns - 1, ns);
  const XG = 190, YG = 450, kw = P(t, 12.9, 13.6);
  filo(ctx, [[XP - SP / 2 - 22, yp0], [262, yp0]], kw * kc);
  filo(ctx, [[205, yp0], [XG, yp0], [XG, YG - 40]], kw * kc);
  filo(ctx, [[XG, YG + 40], [XG, yp1], [XP - SP / 2 - 22, yp1]], kw * kc);
  interruttore(ctx, [205, yp0], [262, yp0], chiuso(t), kw * kc);
  const kAC = P(t, 33.1, 33.6);
  pila(ctx, XG, YG, kw * (1 - kAC));
  generatore(ctx, XG, YG, kAC);
  const V0 = [960, 520], RV = 56;
  filo(ctx, [[XS + SP / 2 + 22, ys0], [860, ys0], [860, V0[1] - 36], [V0[0] - RV - 26, V0[1] - 36]], kw * kc);
  filo(ctx, [[XS + SP / 2 + 22, ys1 + (ns === 1 ? 0 : 0)], [XS + SP / 2 + 22, Math.max(ys1, 640)], [990, Math.max(ys1, 640)], [990, V0[1] + 14]], kw * kc);
  // il nucleo e le bobine (dietro, ferro, davanti)
  spire(ctx, XP, np, false, k0 * kc); spire(ctx, XS, ns, false, k0 * kc);
  nucleo(ctx, k0);
  spire(ctx, XP, np, true, k0 * kc, luce); spire(ctx, XS, ns, true, k0 * kc, luce);
  // il flusso nel ferro: frecce lungo l'anello, lunghe in proporzione (in senso orario se positivo)
  const f = flusso(t), Lf = 150 * f, kf = P(t, 17.9, 18.4);
  if (Math.abs(Lf) > 4) {
    const cx = (XO0 + XO1) / 2, yt = YO0 + SP / 2, yb = YO1 - SP / 2;
    freccia(ctx, [cx - Lf / 2, yt], [cx + Lf / 2, yt], COL_B(), kf, 7);
    freccia(ctx, [cx + Lf / 2, yb], [cx - Lf / 2, yb], COL_B(), kf, 7);
  }
  drawRich(ctx, '{mg:Φ}', (XO0 + XO1) / 2, YO0 - 28, { size: 38, alpha: kf });
  // il voltmetro: ago proporzionale a V₂
  strumento(ctx, V0, RV, v2volt(t) / 34, kw);   // 34 V → un radiante (57°)
  txt(ctx, 'voltmetro', 960, 408, { size: 28, color: C.dim, alpha: kw });
  // le scritte
  txt(ctx, 'primario', XP, 750, { size: 30, color: C.dim, alpha: k0 });
  txt(ctx, 'secondario', XS, 750, { size: 30, color: C.dim, alpha: k0 });
  txt(ctx, 'ferro', (XO0 + XO1) / 2, YO1 - SP / 2 + 2, { size: 28, color: C.ink, alpha: k0 * (1 - P(t, 17.6, 18.0)) });
  const sorg = t < T_ES2 ? '12 V' : '230 V';
  drawRich(ctx, '{mx:V₁} = ' + sorg, 128, 655, { size: 32, align: 'left', alpha: kw });
  if (t > T_AC) drawRich(ctx, '{my:V₂} = ' + (t < T_ES2 ? '24 V' : '23 V'), 916, 684, { size: 32, alpha: P(t, 64.4, 64.9) * (1 - P(t, T_ES2 - .5, T_ES2 - .1)) + P(t, T_ES2 + .1, T_ES2 + .5) });
  drawRich(ctx, '{mink:N₁} {dim:spire}', XO0 + SP + 40, 450, { size: 32, align: 'left', alpha: P(t, 53.9, 54.4) });
  drawRich(ctx, '{mink:N₂} {dim:spire}', XO1 - SP - 40, 450, { size: 32, align: 'right', alpha: P(t, 53.9, 54.4) });
  const stato = t > T_CL && t < T_AC ? 'al rallentatore' : t >= T_AC ? 'al rallentatore (100 volte)' : '';
  if (stato) txt(ctx, stato, 1090, 142, { size: 28, color: C.dim, align: 'right' });
  ctx.restore();
}

// ---------- i grafici (destra, 12,9–43,4): il flusso e le due tensioni ----------
const GX0 = 1240, YF = 290, KF = 80, YV = 565, KV = 40;    // flusso: 1 → 80 px; tensione: 1 → 40 px (i picchi restano sotto le etichette)
function traccia(ctx, f, a, b, xOf, yOf, col, w = 5) {
  if (b <= a) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); const n = Math.max(2, Math.ceil((b - a) * 40));
  for (let i = 0; i <= n; i++) { const s = a + (b - a) * i / n, p = [xOf(s), yOf(f(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
  ctx.stroke(); ctx.restore();
}
function assiG(ctx, y0, top, bot, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, y0); ctx.lineTo(1760, y0); ctx.moveTo(GX0, bot); ctx.lineTo(GX0, top); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [1766, y0], 0, C.ink); arrowHead(ctx, [GX0, top - 6], -Math.PI / 2, C.ink);
  drawRich(ctx, '{mink:t}', 1770, y0 + 30, { size: 32, alpha: al });
}
function sceneGrafici(ctx, t) {
  const al = life(t, 12.9, 43.5, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const ka = P(t, 13.0, 13.5);
  assiG(ctx, YF, 180, YF + 112, ka); assiG(ctx, YV, 440, 690, ka);
  drawRich(ctx, '{mg:Φ} {dim:nel ferro}', GX0 + 18, 176, { size: 32, align: 'left', alpha: ka });
  drawRich(ctx, '{mx:V₁} {dim:primario,} {my:V₂} {dim:secondario}', GX0 + 18, 436, { size: 32, align: 'left', alpha: ka });
  // la mutua induzione: la tensione del secondario è la f.e.m. indotta dalla corrente del primario
  drawRich(ctx, '{my:ε₂} = −{mink:M}·Δ{mv:I₁}/Δ{mink:t}   {dim:(}{mink:M}{dim: in henry)}', 1480, 742, { size: 32, local: t - 22.8 });
  const yF = f => YF - KF * f, yV = v => YV - KV * v;
  // in continua: il tratto da 16 a 33,4 s riempie il grafico
  const kD = 1 - P(t, 33.1, 33.4);
  if (kD > 0 && t > T_CL - 2) {
    ctx.save(); ctx.globalAlpha *= kD;
    const xD = s => GX0 + (s - 16) / 17.4 * 500, s1 = Math.min(t, T_AC);
    traccia(ctx, flusso, 16, s1, xD, yF, C.g);
    traccia(ctx, v1, 16, s1, xD, yV, C.x, 4);
    traccia(ctx, v2, 16, s1, xD, yV, C.y);
    ctx.restore();
  }
  // in alternata: una finestra di 8 s che scorre
  if (t > T_AC) {
    const kA = P(t, T_AC, T_AC + .3), s0 = Math.max(T_AC, t - 8), xA = s => GX0 + (s - s0) * 62.5;
    ctx.save(); ctx.globalAlpha *= kA;
    traccia(ctx, flusso, s0, t, xA, yF, C.g);
    traccia(ctx, v1, s0, t, xA, yV, C.x, 4);
    traccia(ctx, v2, s0, t, xA, yV, C.y);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- perché il rapporto delle spire (destra, 43,5–64,2) ----------
function scenePerche(ctx, t) {
  const al = life(t, 43.5, 64.3, .5, .5);
  if (al <= 0) return;
  const cx = 1480;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'perché le spire contano', cx, 168, { size: 40, weight: 600, local: t - 43.6 }));
  drawRich(ctx, 'lo stesso flusso {mg:Φ} in ogni spira', cx, 240, { size: 34, local: t - 43.8 });
  drawRich(ctx, '{dim:f.e.m. di una spira:} {my:e}', cx, 300, { size: 34, local: t - 48.8 });
  separa(ctx, 344, P(t, 53.9, 54.3));
  drawRich(ctx, '{mx:V₁} = {mink:N₁}·{my:e}', cx, 400, { size: 46, local: t - 54.0 });
  drawRich(ctx, '{my:V₂} = {mink:N₂}·{my:e}', cx, 462, { size: 46, local: t - 55.4 });
  separa(ctx, 514, P(t, 59.1, 59.5));
  drawSeq(ctx, [{ num: '{my:V₂}', den: '{mx:V₁}' }, '{mink:=}', { num: '{mink:N₂}', den: '{mink:N₁}' }], cx, 610, 66, { local: t - 59.2 });
  drawRich(ctx, '{dim:il rapporto delle spire}', cx, 722, { size: 32, local: t - 60.6 });
  ctx.restore();
}

// ---------- gli esempi (destra, 64,3–85) ----------
function sceneEsempi(ctx, t) {
  const al = life(t, 64.3, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  const cx = 1480;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{mink:N₁} = 100   {mink:N₂} = 200', cx, 170, { size: 34, local: t - 64.4 });
  drawRich(ctx, '{x:12 V} → {y:24 V}', cx, 232, { size: 48, local: t - 65.0 });
  drawRich(ctx, '{dim:la tensione si} {g:alza}', cx, 290, { size: 32, local: t - 66.0 });
  separa(ctx, 332, P(t, 69.5, 69.9));
  drawRich(ctx, '{mink:N₁} = 1000   {mink:N₂} = 100', cx, 380, { size: 34, local: t - 69.6 });
  drawRich(ctx, '{x:230 V} → {y:23 V}', cx, 442, { size: 48, local: t - 70.2 });
  drawRich(ctx, '{dim:la tensione si} {g:abbassa}', cx, 500, { size: 32, local: t - 71.2 });
  separa(ctx, 542, P(t, 74.7, 75.1));
  drawRich(ctx, '{mx:V₁}·{mv:I₁} = {my:V₂}·{mv:I₂}', cx, 596, { size: 44, local: t - 74.8 });
  drawRich(ctx, '{dim:trasformatore ideale;} {mv:I}{dim: = corrente}', cx, 648, { size: 30, local: t - 75.8 });
  separa(ctx, 690, P(t, 79.9, 80.3));
  drawRich(ctx, '{dim:linee:} {g:alta tensione}{dim:; case:} 230 V', cx, 740, { size: 32, local: t - 80.0 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il trasformatore', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.7, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 95.0, 96.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il rapporto delle spire fa il rapporto\ndelle tensioni, ma solo in {g:alternata}.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:V₂}/{mx:V₁} = {mink:N₂}/{mink:N₁}'], [960, 'più spire nel secondario:\nla tensione si {g:alza}'], [1470, 'in continua:\n{r:niente} nel secondario']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'ago del voltmetro (v2volt), da −34 V (0) a +34 V (1),
  // zero = 0,5; l'alternata gira sempre: un periodo solo, all'inizio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .5],                                                // l'anello di ferro con le due bobine
    ['soffio', 12.7], ['pop', 12.9, .4],                                              // i grafici; la pila e il voltmetro
    ['pop', 18.3, .5], ['traccia', 18.3, 20.7], ['tono', 18.3, 20.7, [.85, .72, .63, .58, .55, .53, .52]],   // chiudo: il guizzo
    ['pop', 22.8, .5],                                                                // la mutua induzione
    ['pop', 33.1, .55], ['tono', 33.4, 35.4, [.5, .85, 1, .85, .5, .15, 0, .15, .5]], // la tensione alternata
    ['soffio', 43.5], ['pop', 43.8, .5],                                              // perché le spire contano: lo stesso flusso
    ['pop', 48.8, .6],                                                                // la f.e.m. di ogni spira
    ['pop', 54.0, .45], ['pop', 55.4, .6],                                            // V₁ = N₁·e, V₂ = N₂·e
    ['soffio', 64.3], ['pop', 64.4, .5], ['ding', 65.2],                              // 100 e 200 spire: da 12 V a 24 V
    ['pop', 69.6, .4], ['pop', 70.2, .3], ['ding', 70.4],                             // 1000 e 100 spire: da 230 V a 23 V
    ['pop', 74.8, .5], ['pop', 80.0, .6],                                             // la potenza; le linee ad alta tensione
    ['soffio', 85.6], ['pop', 87.6, .5], ['pop', 88.1, .6], ['pop', 88.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il trasformatore', durata: 96.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.0, 'in continua'], [33.0, 64.2, 'in alternata'], [64.2, T_FINE, 'alzare e abbassare']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneTrasformatore(ctx, t); sceneGrafici(ctx, t); scenePerche(ctx, t); sceneEsempi(ctx, t); sceneFine(ctx, t); },
  };
});
