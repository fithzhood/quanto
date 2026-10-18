'use strict';
/* L'elettrone di traverso — un elettrone (carica −e, e = 1,60·10⁻¹⁹ C, massa m = 9,11·10⁻³¹ kg) entra a v₀ ≈ 1,87·10⁷ m/s
   fra due piatti lunghi 5 cm, a 2 cm (12 px/mm). Piatti scarichi: va dritto, x = v₀·t. Con 200 V: E = 10⁴ V/m,
   F = e·E ≈ 1,6·10⁻¹⁵ N verso il piatto + (il peso, 8,9·10⁻³⁰ N, è 1,8·10¹⁴ volte più piccolo), a = e·E/m ≈ 1,76·10¹⁵ m/s².
   Al rallentatore di 10⁹: x = v₀·t, y = ½·a·t², per t = 2,67·10⁻⁹ s (2,67 s): esce deviato di 6,25 mm con pendenza 0,25,
   poi va dritto. La freccia della velocità è tangente (v₀ in orizzontale, a·t in verticale, stessa scala).
   Tubo a raggi catodici: la deviazione sullo schermo è proporzionale alla tensione fra i piatti, e i segni dei piatti
   seguono il segno della tensione. Colori: elettrone C.x, cariche positive C.v, forze C.y, velocità C.x,
   accelerazione C.v, campo C.ink. Argomento: potenziale. */
CVIDEO.registra('potenziale/deflessione', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 63.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.4, 'felice'], [19.4, 'neutro'],
  [25.5, 'pensa'], [31.0, 'sorpreso'], [35.3, 'neutro'], [42.0, 'sorpreso'], [46.4, 'felice'], [52.2, 'neutro'],
  [57.6, 'felice'], [60.0, 'neutro'], [65.8, 'felice'], [69.6, 'occhiolino'],
];
const FUMETTI = [
  [2.4, 6.7, 'Un elettrone veloce passa fra due\npiatti carichi: che strada fa?'],
  [7.9, 13.3, 'Ecco un elettrone veloce: la sua velocità\nd’ingresso è {mx:v₀} ≈ 1,87·10{mink:⁷} m/s.'],
  [13.4, 19.3, 'Piatti scarichi, nessuna forza: va dritto.\n{mink:x} = {mx:v₀}·{mink:t}: la strada fatta nel tempo {mink:t}.'],
  [19.4, 25.4, 'Ora carico i piatti, 200 V a 2 cm:\ncampo elettrico {mink:E} = 10{mink:⁴} V/m.'],
  [25.5, 30.9, 'La forza sull’elettrone, carica −{mink:e}, è\nverticale, verso il piatto {v:+}: {my:F} = {mink:e·E}.'],
  [31.0, 35.2, 'Vale 1,6·10{mink:⁻¹⁵} N. Il peso, 8,9·10{mink:⁻³⁰} N,\nè {g:trascurabile}.'],
  [35.3, 40.0, 'In verticale accelera: {mv:a} = {mink:e·E}/{mink:m},\ncon {mink:m} la massa dell’elettrone.'],
  [40.1, 46.3, 'Lo rilancio: {mink:x} = {mx:v₀}·{mink:t} e {mink:y} = {mv:a}·{mink:t²}/2.\nInsieme, una {g:parabola}.'],
  [46.4, 52.1, 'Esce deviato di 6,25 mm, poi va dritto:\nfuori dai piatti il campo non c’è.'],
  [52.2, 57.5, 'È il {g:tubo a raggi catodici} dei vecchi\ntelevisori e degli oscilloscopi.'],
  [57.6, 63.1, 'Cambiando la tensione fra i piatti,\nil puntino si sposta sullo schermo.'],
  [65.8, 72.0, 'Entrando di traverso fa una parabola:\ncome un sasso, ma spinto dal campo.'],
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
function carica(ctx, p, segno, r = 34, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  const col = segno > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
  if (segno > 0) { ctx.moveTo(0, -a); ctx.lineTo(0, a); }
  ctx.stroke(); ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function etichetta(ctx, s, x, y, al, w = 96, size = 32) { if (al <= 0) return; fondo(ctx, x, y, w, size + 14, al); drawRich(ctx, s, x, y, { size, alpha: al }); }
function segno(ctx, p, s, al, r = 8) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(s > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); if (s > 0) { ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); } ctx.stroke(); ctx.restore();
}
// un piatto visto di taglio; kq = quanto è carico (0 scarico, grigio), s = segno della carica
function piatto(ctx, a, b, s, kq, al = 1, w = 12) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(C.dim, mix(s > 0 ? C.v : C.x, C.paper, .25), clamp(kq))); ctx.lineWidth = w; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function linea(ctx, pts, col, w, al, tratt = null) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (tratt) ctx.setLineDash(tratt);
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function lineaCampo(ctx, a, b, al) {   // dritta, con la punta a metà
  if (al <= 0) return;
  linea(ctx, [a, b], mix(C.ink, C.paper, .4), 3, al);
  ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], Math.atan2(b[1] - a[1], b[0] - a[0]), mix(C.ink, C.paper, .15), .95); ctx.restore();
}
const rallenta = (ctx, t, a, b) => { const k = life(t, a, b, .3, .4); if (k > 0) txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: k }); };

const CARTA = [110, 110, 1000, 680];
const RE = 14, YE = 498;   // raggio dell'elettrone disegnato; entra 4 mm sotto l'asse dei piatti (450), così la forza ci sta sopra
const YTUBO = 450;         // l'asse del tubo a raggi catodici

// ---------- i piatti: 5 cm = 600 px, 2 cm = 240 px; esce a 6,25 mm = 75 px, pendenza 0,25 ----------
const XP0 = 330, XP1 = 930, YP_SU = 330, YP_GIU = 570;
const TD = 2.668, VD = 600 / TD, AD = 2 * 75 / TD ** 2;     // v₀ ≈ 225 px/s, a ≈ 21 px/s² verso l'alto (10⁹ volte più lento)
const SV = 82 / VD;                                         // scala delle velocità: v₀ ↔ 82 px
const LF = 42;                                              // la forza fra i piatti
const X_PARTENZA = 150;
const T_DRITTO = 14.4;                                      // primo passaggio, piatti scarichi
const T_D0 = 41.8, T_D_INIZIO = T_D0 - (XP0 - X_PARTENZA) / VD;   // secondo passaggio: entra nei piatti a T_D0
function posDritto(t) { return [X_PARTENZA + VD * Math.max(0, t - T_DRITTO), YE]; }
function posDeviato(t) {   // x = v₀·t; y = ½·a·t² fra i piatti, poi una retta
  const tau = t - T_D0, x = XP0 + VD * tau;
  if (tau <= 0) return [x, YE];
  if (tau <= TD) return [x, YE - .5 * AD * tau * tau];
  return [x, YE - 75 - AD * TD * (tau - TD)];
}
const vyDeviato = t => AD * clamp(t - T_D0, 0, TD);   // componente verticale (verso l'alto) della velocità
const kCarica = t => P(t, 19.6, 20.4);                 // i piatti si caricano

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’elettrone di traverso', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}
function elettrone(ctx, p, al, frecce) {   // la pallina con la velocità tangente e, se serve, la forza
  if (al <= 0) return;
  const { vy = 0, kv = 0, kF = 0, nomeV = 0 } = frecce;
  const tip = [p[0] + SV * VD, p[1] - SV * vy];   // v₀ in orizzontale, a·t in verticale: la freccia è tangente
  freccia(ctx, p, tip, C.x, al * kv, 5);
  etichetta(ctx, '{mx:v₀}', p[0] + 52, p[1] - 38, al * kv * nomeV, 50, 34);
  freccia(ctx, [p[0], p[1] - RE - 2], [p[0], p[1] - RE - 2 - LF], C.y, al * kF, 6);   // la forza parte dall'elettrone, verso il piatto +
  carica(ctx, p, -1, RE, al);
}

// 1–2 · i piatti, prima scarichi e poi carichi (7,5–52,2)
function scenePiatti(ctx, t) {
  const al = life(t, 7.8, 52.3, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const kp = P(t, 8.0, 8.6), kq = kCarica(t);
  for (let k = 0; k < 6; k++) lineaCampo(ctx, [380 + k * 100, YP_SU + 26], [380 + k * 100, YP_GIU - 26], P(t, 20.0, 21.0));
  etichetta(ctx, '{mink:E}', 300, 400, P(t, 20.6, 21.1) * (1 - P(t, 40.6, 41.0)), 44, 36);
  // la distanza fra i piatti: 2 cm (esce prima che arrivi la quota dei 6,25 mm, nello stesso posto)
  const k2cm = life(t, 19.6, 46.3, .4, .4);
  if (k2cm > 0) {
    linea(ctx, [[965, YP_SU], [965, YP_GIU]], C.dim, 3, k2cm); linea(ctx, [[953, YP_SU], [977, YP_SU]], C.dim, 3, k2cm); linea(ctx, [[953, YP_GIU], [977, YP_GIU]], C.dim, 3, k2cm);
    etichetta(ctx, '2 cm', 1035, 450, k2cm, 90, 30);
  }
  piatto(ctx, [XP0, YP_SU], [XP1, YP_SU], 1, kq, kp); piatto(ctx, [XP0, YP_GIU], [XP1, YP_GIU], -1, kq, kp);
  for (let k = 0; k < 5; k++) { segno(ctx, [430 + k * 100, YP_SU + 20], 1, kq); segno(ctx, [430 + k * 100, YP_GIU - 20], -1, kq); }
  linea(ctx, [[XP0, 290], [XP1, 290]], C.dim, 3, kp); linea(ctx, [[XP0, 278], [XP0, 302]], C.dim, 3, kp); linea(ctx, [[XP1, 278], [XP1, 302]], C.dim, 3, kp);
  etichetta(ctx, '5 cm', (XP0 + XP1) / 2, 262, kp, 90, 30);
  etichetta(ctx, '200 V', 232, 262, P(t, 19.8, 20.3), 100, 32);
  // primo passaggio: dritto, a velocità costante
  const k1 = P(t, 8.2, 8.7, E.back) * (t < 19.4 ? 1 : 0);
  if (k1 > 0) {
    const p = posDritto(t);
    if (t > T_DRITTO) linea(ctx, [[X_PARTENZA, YE], p], C.x, 3, .55 * (1 - P(t, 19.0, 19.4)), [6, 8]);
    if (p[0] < 1130) elettrone(ctx, p, k1, { kv: P(t, 8.6, 9.0), nomeV: 1 });
  }
  rallenta(ctx, t, T_DRITTO - .3, 19.3);
  // fra i piatti carichi: la forza (una carica ferma, per vederla) e l'accelerazione
  const kg = life(t, 25.6, 40.1, .4, .4);
  if (kg > 0) {
    // un punto fra i piatti, nella colonna libera x = 630 (linee a 580 e 680); la carica tratteggiata: lì, non ferma davvero
    const RG = 20, xg = 630, yt = YE - RG - 2;
    ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = css(C.x); ctx.lineWidth = 4; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(xg, YE, RG, 0, TAU); ctx.stroke(); ctx.restore();
    segno(ctx, [xg, YE], -1, kg, 9);
    // con a, la F si sposta a sinistra e a compare a destra: tutte e due partono dalla carica, verso l'alto
    const ka = kg * P(t, 35.4, 35.9), xF = xg - 15 * ka, xa = xg + 15;
    freccia(ctx, [xF, yt], [xF, yt - LF], C.y, kg, 6);
    etichetta(ctx, '{my:F}', xF - 10 * ka, yt - LF - 26, kg, 40, 34);
    freccia(ctx, [xa, yt], [xa, yt - 30], C.v, ka, 5);
    etichetta(ctx, '{mv:a}', xa + 10, yt - 30 - 22, ka, 36, 32);
  }
  // le proiezioni del secondo passaggio: in orizzontale uniforme, in verticale accelerato
  const kpr = life(t, 41.0, 46.4, .4, .4);
  if (kpr > 0) {
    linea(ctx, [[XP0, 615], [XP1, 615]], C.dim, 2, kpr * .7, [6, 7]); linea(ctx, [[290, YP_SU], [290, YP_GIU]], C.dim, 2, kpr * .7, [6, 7]);
    const p = posDeviato(clamp(t, T_D0, T_D0 + TD));
    ctx.save(); ctx.globalAlpha *= kpr; ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], 615, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(290, p[1], 8, 0, TAU); ctx.fill(); ctx.restore();
    drawRich(ctx, '{mink:x}', XP1 + 30, 615, { size: 34, alpha: kpr }); drawRich(ctx, '{mink:y}', 290, YP_GIU + 26, { size: 34, alpha: kpr });
  }
  // secondo passaggio: la parabola
  const k2 = P(t, 40.2, 40.7, E.back);
  if (k2 > 0) {
    const tt = Math.max(t, T_D_INIZIO), p = posDeviato(tt);
    if (t > T_D_INIZIO) { const pts = []; for (let s = T_D_INIZIO; s < tt; s += 1 / 60) pts.push(posDeviato(s)); pts.push(p); linea(ctx, pts, C.x, 3, .55, [6, 8]); }
    const kpar = life(t, T_D0 + TD + .1, 52.3, .4, .4);
    if (kpar > 0) { const pp = []; for (let s = T_D0; s <= T_D0 + TD + 1e-6; s += TD / 60) pp.push(posDeviato(s)); linea(ctx, pp, C.g, 6, kpar); etichetta(ctx, '{g:parabola}', 680, 525, kpar, 140, 32); }
    const fra = t > T_D0 && t < T_D0 + TD;
    if (p[0] < 1130) elettrone(ctx, p, k2, { vy: vyDeviato(t), kv: 1, kF: fra ? 1 : 0, nomeV: t < T_D0 ? 1 : 0 });
  }
  rallenta(ctx, t, T_D_INIZIO - .3, T_D0 + TD + 1.0);
  // all'uscita: deviato di 6,25 mm
  const kd = life(t, 46.5, 52.3, .4, .4);
  if (kd > 0) {
    linea(ctx, [[XP1, YE], [1010, YE]], C.dim, 2, kd, [6, 6]);
    linea(ctx, [[962, YE], [962, YE - 75]], C.dim, 3, kd); linea(ctx, [[952, YE], [972, YE]], C.dim, 3, kd); linea(ctx, [[952, YE - 75], [972, YE - 75]], C.dim, 3, kd);
    etichetta(ctx, '6,25 mm', 1036, YE - 30, kd, 130, 30);
  }
  ctx.restore();
}
// 3 · il tubo a raggi catodici (52,2–63,6): la deviazione sullo schermo è proporzionale alla tensione fra i piatti
const TX0 = 360, TX1 = 480, SCHERMO = 1040, YMAX_USCITA = 18;   // all'uscita dei piatti al massimo 18 px
const T_SPAZZA = 58.0;
const vPiatti = t => t < T_SPAZZA ? 0 : 200 * Math.sin(TAU * (t - T_SPAZZA) / 2.4) * P(t, T_SPAZZA, T_SPAZZA + .5);
function fascio(u) {   // il percorso per una tensione u = V/200: dritto, parabola fra i piatti, poi dritto
  const ye = YMAX_USCITA * u, pts = [[196, YTUBO], [TX0, YTUBO]];
  for (let i = 1; i <= 24; i++) { const s = i / 24; pts.push([TX0 + (TX1 - TX0) * s, YTUBO - ye * s * s]); }
  pts.push([SCHERMO, YTUBO - ye - (SCHERMO - TX1) * 2 * ye / (TX1 - TX0)]);
  return pts;
}
function sceneTubo(ctx, t) {
  const al = life(t, 52.3, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il vetro
  ctx.save(); ctx.fillStyle = css(mix(C.x, C.paper, .9)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(150, 395); ctx.lineTo(560, 395); ctx.lineTo(SCHERMO, 170); ctx.lineTo(SCHERMO, 730); ctx.lineTo(560, 505); ctx.lineTo(150, 505); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  linea(ctx, [[SCHERMO, 172], [SCHERMO, 728]], mix(C.g, C.paper, .3), 10, 1);
  // cannone (catodo − e anodo + col foro) e piatti: i segni dei piatti seguono il segno della tensione
  piatto(ctx, [190, 425], [190, 475], -1, 1, 1, 8);
  piatto(ctx, [280, 418], [280, 440], 1, 1, 1, 8); piatto(ctx, [280, 460], [280, 482], 1, 1, 1, 8);
  const V = vPiatti(t), sV = V >= 0 ? 1 : -1, kq = clamp(Math.abs(V) / 40);
  piatto(ctx, [TX0, 426], [TX1, 426], sV, kq, 1, 8); piatto(ctx, [TX0, 474], [TX1, 474], -sV, kq, 1, 8);
  for (const x of [390, 450]) { segno(ctx, [x, 411], sV, kq, 7); segno(ctx, [x, 489], -sV, kq, 7); }
  // il fascio e la traccia lasciata sullo schermo
  linea(ctx, fascio(V / 200), C.x, 4, .9);
  for (let k = 12; k >= 0; k--) {
    const s = t - k * .04; if (s < T_SPAZZA && k) continue;
    const q = fascio(vPiatti(s) / 200), p = q[q.length - 1];
    ctx.save(); ctx.globalAlpha *= (1 - k / 13) * .9; ctx.fillStyle = css(C.g); ctx.shadowColor = css(C.g, .9); ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(p[0] - 4, p[1], 9, 0, TAU); ctx.fill(); ctx.restore();
  }
  txt(ctx, 'cannone', 235, 545, { size: 30, color: C.dim });
  txt(ctx, 'piatti', (TX0 + TX1) / 2, 545, { size: 30, color: C.dim });
  txt(ctx, 'schermo', SCHERMO, 760, { size: 30, color: C.dim });
  const kV = P(t, 57.8, 58.2), Vr = Math.round(V / 10) * 10;
  // cifre a larghezza fissa, allineate a destra: non ballano mentre la tensione cambia
  fixedNum(ctx, (Vr < 0 ? '−' : Vr > 0 ? '+' : '') + Math.abs(Vr), (TX0 + TX1) / 2 + 22, 355, 32, C.ink, kV);
  txt(ctx, 'V', (TX0 + TX1) / 2 + 32, 355, { size: 32, align: 'left', alpha: kV });
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 40.2, () => {
    conFont(TITOLI, () => drawRich(ctx, 'di traverso', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{mx:v₀} ≈ 1,87·10{mink:⁷} m/s', cx, 225, { size: 34, local: t - 8.0 });
    drawRich(ctx, '{dim:piatti scarichi:} {mink:x} = {mx:v₀}·{mink:t}', cx, 278, { size: 32, local: t - 13.5 });
    separa(ctx, 318, P(t, 19.5, 19.9));
    drawRich(ctx, '{mink:E} = 200 V / 0,02 m = 10{mink:⁴} V/m', cx, 362, { size: 30, local: t - 19.6 });
    drawRich(ctx, '{dim:carica} −{mink:e}{dim:,} {mink:e} ≈ 1,60·10{mink:⁻¹⁹} C', cx, 410, { size: 30, local: t - 25.6 });
    drawRich(ctx, '{my:F} = {mink:e·E} ≈ 1,6·10{mink:⁻¹⁵} N', cx, 458, { size: 30, local: t - 31.1 });
    drawRich(ctx, '{dim:peso} {mink:m·g} ≈ 8,9·10{mink:⁻³⁰} N{dim:, con} {mink:g} = 9,8 m/s²', cx, 500, { size: 30, local: t - 31.4 });
    drawRich(ctx, '{dim:più piccolo di} 1,8·10{mink:¹⁴} {dim:volte}', cx, 544, { size: 30, local: t - 31.7 });
    drawRich(ctx, '{dim:massa} {mink:m} ≈ 9,11·10{mink:⁻³¹} kg', cx, 608, { size: 30, local: t - 35.4 });
    drawRich(ctx, '{mv:a} = {mink:e·E}/{mink:m} ≈ 1,76·10{mink:¹⁵} m/s²', cx, 656, { size: 30, local: t - 35.7 });
  });
  blocco(40.2, 52.3, () => {
    conFont(TITOLI, () => drawRich(ctx, 'la parabola', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:x} = {mx:v₀}·{mink:t}', cx, 240, { size: 40, local: t - 40.2 });
    drawRich(ctx, '{mink:y} = {mv:a}·{mink:t²}/2', cx, 300, { size: 40, local: t - 40.6 });
    drawRich(ctx, '{dim:fra i piatti:} {mink:t} ≈ 2,67·10{mink:⁻⁹} s', cx, 380, { size: 32, local: t - 46.5 });
    drawRich(ctx, '{mink:y} ≈ 6,25 mm', cx, 435, { size: 38, local: t - 46.8 });
    drawRich(ctx, '{dim:fuori dai piatti: dritto}', cx, 495, { size: 32, local: t - 47.4 });
  });
  blocco(52.3, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'tubo a raggi catodici', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:il cannone accelera gli elettroni}', cx, 245, { size: 30, local: t - 52.4 });
    drawRich(ctx, '{dim:i piatti li deviano}', cx, 290, { size: 30, local: t - 52.7 });
    drawRich(ctx, '{dim:lo schermo si illumina dove arrivano}', cx, 335, { size: 30, local: t - 53.0 });
    drawRich(ctx, '{dim:la deviazione è proporzionale}', cx, 420, { size: 30, local: t - 57.7 });
    drawRich(ctx, '{dim:alla tensione fra i piatti}', cx, 462, { size: 30, local: t - 57.9 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 73.3, 74.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Di traverso in un campo uniforme,\nl’elettrone fa una parabola.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:x} = {mx:v₀}·{mink:t}\n{mink:y} = {mv:a}·{mink:t²}/2'], [960, '{mv:a} = {mink:e·E}/{mink:m}\n{dim:il peso è trascurabile}'], [1470, '{dim:come un}\n{g:proiettile}']];
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
    ['soffio', 7.6], ['pop', 8.3, .4], ['traccia', 8.0, 8.6], ['pop', 8.5, .55],      // i piatti, 5 cm, l'elettrone
    ['tono', 14.4, 15.6, [.4, .4]],                                                   // piatti scarichi: va dritto
    ['pop', 20.0, .5], ['traccia', 20.0, 21.0],                                       // 200 V: il campo
    ['pop', 25.8, .5],                                                                // la forza verso il piatto +
    ['pop', 31.6, .4],                                                                // il peso è trascurabile
    ['pop', 35.7, .5],                                                                // l'accelerazione
    ['soffio', 40.2], ['pop', 40.4, .5],                                              // la parabola: lo rilancio
    ['tono', 41.8, 45.36, [0, .02, .06, .14, .26, .4, .58, .77, .96]],                // sale lungo la parabola, poi dritto
    ['traccia', 44.57, 45.0], ['pop', 44.8, .5],                                      // la parabola in verde
    ['traccia', 46.5, 46.9], ['ding', 47.0],                                          // deviato di 6,25 mm
    ['soffio', 52.3],                                                                 // il tubo a raggi catodici
    ['pop', 58.0, .45], ['tono', 58.0, 60.4, [.5, .76, 1, .85, .5, .15, 0, .15, .5]], // la tensione oscilla: il puntino sale e scende
    ['soffio', 63.7], ['pop', 65.8, .5], ['pop', 66.3, .6], ['pop', 66.8, .7],        // in una frase
  ];
  return {
    titolo: 'L’elettrone di traverso', durata: 75.0, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.0, 'la forza fra i piatti'], [40.0, 52.1, 'la parabola'], [52.1, T_FINE, 'il tubo a raggi catodici']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); scenePiatti(ctx, t); sceneTubo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
