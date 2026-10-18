'use strict';
/* Due fili che si attraggono — due fili paralleli e flessibili: con correnti nello stesso verso si attraggono, con versi
   opposti si respingono (al contrario delle cariche). Il perché: il filo 1 crea un campo B₁ (⊗ a destra, ⊙ a sinistra,
   definiti; verso con la mano destra che stringe il filo), B₁ = μ₀·I₁/(2π·d) con μ₀ = 4π·10⁻⁷ T·m/A; su un tratto L del
   filo 2 agisce F = I₂·L·B₁ (filo perpendicolare a B₁), verso con la mano destra aperta (pollice su I₂, dita su B₁, che
   entra: la forza esce dal palmo, verso il filo 1). Sul filo 1 una forza uguale e opposta. Numeri: 10 A per filo a 1 cm:
   B₁ = 2·10⁻⁴ T, F = 2·10⁻³ N per metro. La flessione dei fili segue la risposta di un oscillatore smorzato a una forza
   che si accende (ingrandita). Colori fissi del magnetismo: campo B C.g, corrente convenzionale C.v, forze C.y.
   Argomento: magnetismo. */
CVIDEO.registra('magnetismo/due-fili', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 92.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.7, 'sorpreso'], [14.8, 'neutro'],
  [17.1, 'felice'], [19.2, 'neutro'], [21.5, 'pensa'], [23.6, 'neutro'], [26.5, 'pensa'], [28.6, 'neutro'],
  [64.1, 'festa'], [66.2, 'neutro'], [68.8, 'sorpreso'], [70.9, 'neutro'], [73.5, 'felice'], [75.6, 'neutro'],
  [85.4, 'felice'], [87.5, 'neutro'], [94.4, 'felice'], [98.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.8, 'Due fili con la corrente: si\nattraggono o si respingono?'],
  [7.9, 12.4, 'Due fili paralleli e flessibili,\nfissati in alto e in basso.'],
  [12.5, 17.0, 'Correnti nello {g:stesso verso}:\ni fili si {g:attraggono}!'],
  [17.1, 21.4, 'Correnti in versi {g:opposti}:\nsi {g:respingono}.'],
  [21.5, 26.4, 'Al contrario delle cariche, dove\nquelle {g:uguali} si respingono.'],
  [26.5, 31.4, 'Perché? Il filo 1 crea attorno\na sé un campo magnetico {mg:B₁}.'],
  [31.5, 37.0, 'Il cerchio con la croce vuol dire\n«entra nello schermo», col punto «esce».'],
  [37.1, 42.8, 'Lo dice la mano destra: pollice\nsulla corrente, le dita girano come {mg:B₁}.'],
  [42.9, 47.6, 'Il filo 2 è nel campo del filo 1,\na distanza {mink:d}.'],
  [47.7, 52.6, 'Vale {mg:B₁} = {mink:μ₀}·{mv:I₁} / (2{mink:π}·{mink:d}).'],
  [52.7, 58.2, 'Su un tratto lungo {mink:L} del filo 2:\n{my:F} = {mv:I₂}·{mink:L}·{mg:B₁}.'],
  [58.3, 64.0, 'Il verso con la mano aperta: pollice\nsu {mv:I₂}, dita su {mg:B₁}, che qui entra…'],
  [64.1, 68.7, '…e {my:F} esce dal palmo, verso\nil filo 1: si {g:attraggono}!'],
  [68.8, 73.4, 'Se {mv:I₂} va al contrario, {my:F} si gira:\ni fili si {g:respingono}.'],
  [73.5, 78.4, 'Sul filo 1 agisce una forza\n{g:uguale e opposta}: azione e reazione.'],
  [78.5, 85.3, 'Con 10 A per filo, a 1 cm:\n{mg:B₁} = 2·10⁻⁴ T.'],
  [85.4, 91.8, 'Su un metro di filo:\n{my:F} = {mv:I₂}·{mink:L}·{mg:B₁} = 2·10⁻³ N.'],
  [94.4, 100.6, 'Correnti concordi si attraggono,\nopposte si respingono: {my:F} = {mv:I}·{mink:L}·{mg:B}.'],
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
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
// ⊙ (verso = +1, esce dallo schermo: la punta della freccia) e ⊗ (verso = −1, entra: la coda)
function simbolo(ctx, p, r, verso, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(col); ctx.lineWidth = Math.max(3, r * .16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  if (verso > 0) { ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(p[0], p[1], r * .26, 0, TAU); ctx.fill(); }
  else { const a = r * .55; ctx.beginPath(); ctx.moveTo(p[0] - a, p[1] - a); ctx.lineTo(p[0] + a, p[1] + a); ctx.moveTo(p[0] + a, p[1] - a); ctx.lineTo(p[0] - a, p[1] + a); ctx.stroke(); }
  ctx.restore();
}
const scuro = () => parseInt(String(C.paper).slice(1, 3), 16) < 128;   // tema scuro: la pelle resta chiara
const PELLE = () => scuro() ? mix(C.y, C.ink, .5) : mix(C.y, C.paper, .62);
const BORDO_PELLE = () => scuro() ? mix(C.y, C.paper, .55) : mix(C.ink, C.paper, .2);
// una fascia con il bordo (dita, pollice): spezzata disegnata due volte, scura e poi color pelle
function fascia(ctx, pts, w) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [col, lw] of [[BORDO_PELLE(), w + 6], [PELLE(), w]]) {
    ctx.strokeStyle = css(col); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }
  ctx.restore();
}
// la regola della mano destra per il filo: il pollice lungo la corrente, le dita chiuse girano come B
function manoPresa(ctx, cx, cy, s, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.scale(s, s);
  const colB = C.g;
  // la linea di B dietro il filo (tratteggiata)
  ctx.save(); ctx.strokeStyle = css(colB); ctx.lineWidth = 4; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, Math.PI, TAU); ctx.stroke(); ctx.restore();
  // il filo con la corrente
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 215); ctx.lineTo(0, -190); ctx.stroke();
  arrowHead(ctx, [0, -208], -Math.PI / 2, C.v, 1.3);
  // la linea di B davanti al filo, con il verso
  ctx.save(); ctx.strokeStyle = css(colB); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [6, 180], 0, colB, 1.1);
  // il palmo, dietro a sinistra; il pollice in su lungo il filo; le dita che passano davanti
  ctx.save(); ctx.fillStyle = css(PELLE()); ctx.strokeStyle = css(BORDO_PELLE()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-112, -46, 82, 140, 26); ctx.fill(); ctx.stroke(); ctx.restore();
  fascia(ctx, [[-44, -34], [-26, -92], [-16, -128]], 26);
  for (let k = 0; k < 4; k++) {
    const y = -22 + k * 31;
    fascia(ctx, [[-60, y], [-20, y + 12], [20, y + 14], [46, y + 6], [56, y - 6]], 25);
  }
  ctx.restore();
}

// la mano destra aperta, palmo verso di me, dita in su e pollice a destra (ruotata di rot nel piano), poi inclinata di th
// attorno all'asse del pollice. Fino a circa 55° si vede il palmo che si accorcia (come cos th); poi la mano di taglio:
// le dita entrano nello schermo (le loro punte sono ⊗) e il palmo è la striscia rivolta dove puntavano le dita.
function mappa(c, s, rot, th) {
  const k = Math.max(Math.cos(th), .3), cr = Math.cos(rot), sr = Math.sin(rot);
  return (x, y) => [c[0] + s * (x * cr - y * k * sr), c[1] + s * (x * sr + y * k * cr)];
}
const taglio = th => P(th, Math.PI * .3, Math.PI * .5);
function manoAperta(ctx, c, s, rot, th, al = 1) {
  if (al <= 0) return;
  const k = Math.max(Math.cos(th), .3), kT = taglio(th);
  const bordo = css(BORDO_PELLE()), pelle = css(PELLE());
  // dritta (o appena inclinata): il palmo si vede e si accorcia
  if (kT < 1) {
    ctx.save(); ctx.globalAlpha *= al * (1 - kT); ctx.translate(c[0], c[1]); ctx.rotate(rot); ctx.scale(s, s * k);
    const dito = (x, y0, y1, w) => { ctx.beginPath(); ctx.roundRect(x - w / 2, y1, w, y0 - y1, w / 2); ctx.fill(); ctx.stroke(); };
    ctx.fillStyle = pelle; ctx.strokeStyle = bordo; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-42, 40, 84, 70, 14); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(44, 22); ctx.rotate(-.18); ctx.beginPath(); ctx.roundRect(-10, -15, 92, 30, 15); ctx.fill(); ctx.stroke(); ctx.restore();
    dito(-39, -30, -110, 23); dito(-13, -30, -136, 24); dito(13, -30, -146, 24); dito(39, -30, -134, 24);
    ctx.beginPath(); ctx.roundRect(-54, -58, 108, 116, 24); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = bordo; ctx.globalAlpha *= .6; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-40, -22); ctx.quadraticCurveTo(0, -8, 38, -26); ctx.moveTo(-40, 4); ctx.quadraticCurveTo(-6, 16, 24, 2); ctx.stroke();
    ctx.restore();
  }
  // di taglio: la striscia della mano, il pollice in fuori, le punte delle dita che entrano (⊗)
  if (kT > 0) {
    ctx.save(); ctx.globalAlpha *= al * kT; ctx.translate(c[0], c[1]); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = pelle; ctx.strokeStyle = bordo; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(40, -13, 96, 26, 13); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-60, -19, 120, 38, 14); ctx.fill(); ctx.stroke();
    // il palmo: il bordo della striscia dalla parte delle dita di prima, più chiaro
    ctx.fillStyle = css(mix(PELLE(), C.paper, .45)); ctx.beginPath(); ctx.roundRect(-52, -17, 104, 8, 4); ctx.fill();
    ctx.restore();
    const m = mappa(c, s, rot, Math.PI / 2);
    for (const x of [-39, -13, 13, 39]) { const p = [c[0] + s * x * Math.cos(rot), c[1] + s * x * Math.sin(rot)]; simbolo(ctx, p, 8.5, -1, C.g, al * kT); }
  }
}
// le tre frecce della regola sulla mano: v (o I) lungo il pollice, B lungo le dita, F fuori dal palmo
// cartellino sulla mano dritta: è solo un esempio, con B nel piano
function cartellino(ctx, x, y, al) {
  if (al <= 0) return;
  fondo(ctx, x, y, 150, 44, al);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 75, y - 22, 150, 44, 10); ctx.stroke(); ctx.restore();
  txt(ctx, 'esempio', x, y + 1, { size: 30, color: C.dim, alpha: al });
}
function frecceMano(ctx, c, s, rot, th, al, nomeV, colV, nomeB, kF) {
  if (kF == null) kF = 1;
  if (al <= 0) return;
  nomeB = nomeB || '{mg:B}';
  const m = mappa(c, s, rot, th), m0 = mappa(c, s, rot, 0), kT = taglio(th);
  const u = [Math.cos(rot), Math.sin(rot)], d = [Math.sin(rot), -Math.cos(rot)];   // pollice; dove puntavano le dita
  const R = (x, y) => [c[0] + s * (x * u[0] + y * -d[0] * 1), c[1] + s * (x * u[1] + y * -d[1] * 1)];
  // v: lungo il pollice, oltre la punta
  const a = m0(150, 8), b = m0(250, 8);
  freccia(ctx, a, b, colV, al, 7);
  drawRich(ctx, nomeV, b[0] + u[0] * 36, b[1] + u[1] * 36, { size: 40, alpha: al });
  // B: accanto alle dita finché la mano è dritta; di taglio è il ⊗ a fianco della mano
  const b0 = m(-100, 40), b1 = m(-100, -150), kB = 1 - P(th, Math.PI * .2, Math.PI * .35);
  freccia(ctx, b0, b1, C.g, al * kB, 7);
  drawRich(ctx, '{mg:B}', b1[0] - u[0] * 46, b1[1] - u[1] * 46, { size: 40, alpha: al * kB });
  const pX = R(-100, 0);
  simbolo(ctx, pX, 20, -1, C.g, al * kT);
  drawRich(ctx, nomeB, pX[0] - u[0] * 52 + d[0] * 0, pX[1] - u[1] * 52, { size: 40, alpha: al * kT });
  // F: dritta esce dal palmo (⊙); di taglio parte dal palmo, verso dove puntavano le dita
  const pc = m(0, 0);
  simbolo(ctx, pc, 20, 1, C.y, al * kF * (1 - P(th, 0, Math.PI * .25)));
  drawRich(ctx, '{my:F}', pc[0] - d[0] * 40, pc[1] - d[1] * 40, { size: 40, alpha: al * kF * (1 - P(th, 0, Math.PI * .25)) });
  if (kT > 0) {
    const p0 = R(0, -24), LF = 150 * s;
    freccia(ctx, p0, [p0[0] + d[0] * LF, p0[1] + d[1] * LF], C.y, al * kT * kF, 8);
    drawRich(ctx, '{my:F}', p0[0] + d[0] * (LF + 30) + u[0] * 32, p0[1] + d[1] * (LF + 30) + u[1] * 32, { size: 40, alpha: al * kT * kF });
  }
}

const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];

// ---------- 1 · l'esperimento: i fili si piegano (7,9–26,4) ----------
const XA = 520, XB = 700, Y0 = 170, Y1 = 710;
// risposta di un oscillatore smorzato a una forza che si accende al tempo 0 (da 0 a 1, con un piccolo rimbalzo)
function passo(tau) { if (tau <= 0) return 0; const g = 2.4, w = TAU / .9; return 1 - Math.exp(-g * tau) * (Math.cos(w * tau) + g / w * Math.sin(w * tau)); }
const T_ON = 12.9, T_INV1 = 17.4;
const flessione = t => 22 * passo(t - T_ON) - 44 * passo(t - T_INV1);   // > 0: verso l'altro filo
function filo(ctx, x0, verso, delta, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const s = i / 40, y = lerp(Y0, Y1, s), x = x0 + verso * delta * Math.sin(Math.PI * s); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}
function sceneEsperimento(ctx, t) {
  const al = life(t, 7.9, 26.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const dl = flessione(t);
  // i due sostegni
  ctx.save(); ctx.fillStyle = css(mix(C.dim, C.paper, .3));
  ctx.beginPath(); ctx.roundRect(440, Y0 - 22, 340, 22, 6); ctx.roundRect(440, Y1, 340, 22, 6); ctx.fill(); ctx.restore();
  filo(ctx, XA, 1, dl, 1); filo(ctx, XB, -1, dl, 1);
  txt(ctx, '1', XA, Y0 - 42, { size: 36, weight: 600, color: C.dim });
  txt(ctx, '2', XB, Y0 - 42, { size: 36, weight: 600, color: C.dim });
  // le correnti, a fianco dei fili, in alto
  const kI = P(t, 12.6, 13.0);
  freccia(ctx, [XA - 44, 330], [XA - 44, 230], C.v, kI, 7);
  drawRich(ctx, '{mv:I₁}', XA - 92, 280, { size: 40, alpha: kI });
  const kSu = kI * (1 - P(t, 17.2, 17.4)), kGiu = P(t, 17.4, 17.6);
  freccia(ctx, [XB + 44, 330], [XB + 44, 230], C.v, kSu, 7);
  freccia(ctx, [XB + 44, 230], [XB + 44, 330], C.v, kGiu, 7);
  drawRich(ctx, '{mv:I₂}', XB + 92, 280, { size: 40, alpha: Math.max(kSu, kGiu) });
  // le forze a metà dei fili: verso l'altro filo, poi verso fuori
  const kA = P(t, 13.4, 13.8) * (1 - P(t, 17.2, 17.4)), kR = P(t, 17.8, 18.2);
  const ym = (Y0 + Y1) / 2, xa = XA + dl, xb = XB - dl;
  freccia(ctx, [xa + 8, ym], [xa + 68, ym], C.y, kA, 7); freccia(ctx, [xb - 8, ym], [xb - 68, ym], C.y, kA, 7);
  freccia(ctx, [xa - 8, ym], [xa - 68, ym], C.y, kR, 7); freccia(ctx, [xb + 8, ym], [xb + 68, ym], C.y, kR, 7);
  drawRich(ctx, '{my:F}', XA - 70, ym - 40, { size: 38, alpha: kR }); drawRich(ctx, '{my:F}', XB + 70, ym - 40, { size: 38, alpha: kR });
  drawRich(ctx, '{my:F}', XA - 36, ym, { size: 38, alpha: kA }); drawRich(ctx, '{my:F}', XB + 36, ym, { size: 38, alpha: kA });
  txt(ctx, 'spostamento ingrandito', 610, Y1 + 52, { size: 30, color: C.dim, alpha: P(t, 13.2, 13.7) });
  ctx.restore();
}

// ---------- 2 · perché: il campo del filo 1 e la forza sul filo 2 (26,5–92) ----------
const X1 = 470, X2 = 750, YM = 450;
const T_INV2 = 69.0;
const versoI2 = t => lerp(1, -1, P(t, T_INV2, T_INV2 + .4));
function sceneSpiegazione(ctx, t) {
  const al = life(t, 26.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // i fili, dritti
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X1, Y0); ctx.lineTo(X1, Y1); ctx.moveTo(X2, Y0); ctx.lineTo(X2, Y1); ctx.stroke(); ctx.restore();
  txt(ctx, '1', X1, Y0 - 32, { size: 36, weight: 600, color: C.dim });
  txt(ctx, '2', X2, Y0 - 32, { size: 36, weight: 600, color: C.dim });
  // le correnti
  const v2 = versoI2(t);
  freccia(ctx, [X1 - 44, 340], [X1 - 44, 240], C.v, 1, 7);
  drawRich(ctx, '{mv:I₁}', X1 - 92, 290, { size: 40 });
  freccia(ctx, [X2 + 44, 340], [X2 + 44, 240], C.v, clamp((v2 + 1) / 2), 7);
  freccia(ctx, [X2 + 44, 240], [X2 + 44, 340], C.v, clamp((1 - v2) / 2), 7);
  drawRich(ctx, '{mv:I₂}', X2 + 92, 290, { size: 40 });
  // il campo del filo 1: entra a destra, esce a sinistra; più debole lontano (simboli più piccoli)
  const kB = P(t, 31.6, 32.4), colB = mix(C.g, C.paper, .1);
  for (const [x, r, verso] of [[610, 17, -1], [330, 17, 1], [900, 12, -1]]) for (const y of [250, 400, 550]) {
    const k = kB * P(t, 31.6 + Math.abs(x - X1) / 900, 32.1 + Math.abs(x - X1) / 900);
    simbolo(ctx, [x, y], r, verso, colB, k);
  }
  // sul filo 2, il campo del filo 1 entra
  const k2 = P(t, 43.0, 43.5);
  simbolo(ctx, [X2, 470], 18, -1, C.g, k2);
  drawRich(ctx, '{mg:B₁}', X2 - 46, 470, { size: 38, alpha: k2 });
  // la distanza d
  const kd = P(t, 43.2, 43.7);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(X1, 190); ctx.lineTo(X2, 190); ctx.moveTo(X1, 180); ctx.lineTo(X1, 200); ctx.moveTo(X2, 180); ctx.lineTo(X2, 200); ctx.stroke(); ctx.restore();
    fondo(ctx, 610, 190, 44, 42, kd); drawRich(ctx, '{mink:d}', 610, 190, { size: 38, alpha: kd });
  }
  // il tratto L del filo 2
  const kL = P(t, 52.8, 53.3);
  if (kL > 0) {
    ctx.save(); ctx.globalAlpha *= kL; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(X2 + 34, 380); ctx.lineTo(X2 + 34, 600); ctx.moveTo(X2 + 24, 380); ctx.lineTo(X2 + 44, 380); ctx.moveTo(X2 + 24, 600); ctx.lineTo(X2 + 44, 600); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha *= kL; ctx.strokeStyle = css(C.v); ctx.lineWidth = 11; ctx.globalAlpha *= .35; ctx.beginPath(); ctx.moveTo(X2, 380); ctx.lineTo(X2, 600); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:L}', X2 + 62, 490, { size: 40, alpha: kL });
  }
  // la forza sul filo 2: verso il filo 1 (si attraggono), poi verso fuori quando I₂ si inverte
  const kF = P(t, 62.7, 63.2), yF = 670;
  const kAtt = kF * clamp((v2 + 1) / 2), kRep = kF * clamp((1 - v2) / 2);
  freccia(ctx, [X2 - 10, yF], [X2 - 100, yF], C.y, kAtt, 7);
  freccia(ctx, [X2 + 10, yF], [X2 + 100, yF], C.y, kRep, 7);
  drawRich(ctx, '{my:F}', X2 - 55, yF - 36, { size: 38, alpha: kAtt }); drawRich(ctx, '{my:F}', X2 + 55, yF - 36, { size: 38, alpha: kRep });
  // sul filo 1, la forza uguale e opposta
  const k1 = P(t, 73.6, 74.1);
  freccia(ctx, [X1 - 10, yF], [X1 - 100, yF], C.y, k1 * kRep / Math.max(kF, .001), 7);
  drawRich(ctx, '{my:F}', X1 - 55, yF - 36, { size: 38, alpha: k1 });
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
const HC = [1510, 540], HS = 1.1;
function scenePannello(ctx, t) {
  const cx = 1480;
  const s1 = life(t, 7.9, 26.5, .5, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    conFont(TITOLI, () => drawRich(ctx, 'due fili paralleli', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:correnti nello stesso verso:}', cx, 260, { size: 32, local: t - 12.6 });
    drawRich(ctx, '{g:si attraggono}', cx, 305, { size: 38, local: t - 12.9 });
    drawRich(ctx, '{dim:correnti in versi opposti:}', cx, 385, { size: 32, local: t - 17.2 });
    drawRich(ctx, '{g:si respingono}', cx, 430, { size: 38, local: t - 17.5 });
    separa(ctx, 490, P(t, 21.5, 21.9));
    drawRich(ctx, '{dim:cariche uguali: si respingono}', cx, 545, { size: 32, local: t - 21.6 });
    drawRich(ctx, '{dim:correnti uguali: si attraggono}', cx, 595, { size: 32, local: t - 22.4 });
    ctx.restore();
  }
  const s2 = life(t, 26.5, 42.9, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'il campo del filo 1', cx, 175, { size: 40, weight: 600 }));
    const kl = P(t, 31.6, 32.1);
    simbolo(ctx, [1245, 250], 22, -1, C.g, kl);
    drawRich(ctx, '{dim:entra nello schermo (la coda)}', 1285, 250, { size: 30, align: 'left', alpha: kl });
    simbolo(ctx, [1245, 310], 22, 1, C.g, P(t, 32.4, 32.9));
    drawRich(ctx, '{dim:esce dallo schermo (la punta)}', 1285, 310, { size: 30, align: 'left', alpha: P(t, 32.4, 32.9) });
    const km = P(t, 37.2, 37.8);
    manoPresa(ctx, 1380, 575, .78, km);
    drawRich(ctx, '{mv:I₁}', 1420, 405, { size: 38, alpha: km });
    drawRich(ctx, '{mg:B₁}', 1505, 700, { size: 38, alpha: km });
    drawRich(ctx, '{dim:pollice:}', 1545, 480, { size: 30, align: 'left', alpha: P(t, 37.8, 38.2) });
    drawRich(ctx, '{dim:la corrente} {mv:I₁}', 1545, 520, { size: 30, align: 'left', alpha: P(t, 37.8, 38.2) });
    drawRich(ctx, '{dim:dita chiuse:}', 1545, 590, { size: 30, align: 'left', alpha: P(t, 38.4, 38.8) });
    drawRich(ctx, '{dim:il verso di} {mg:B₁}', 1545, 630, { size: 30, align: 'left', alpha: P(t, 38.4, 38.8) });
    ctx.restore();
  }
  const s3 = life(t, 42.9, 58.3, .4, .4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    conFont(TITOLI, () => drawRich(ctx, 'la forza sul filo 2', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:d}{dim:: distanza fra i fili}', cx, 240, { size: 34, local: t - 43.0 });
    drawSeq(ctx, ['{mg:B₁}{mink: =}', { num: '{mink:μ₀}·{mv:I₁}', den: '{mink:2π}·{mink:d}' }], cx, 335, 54, { local: t - 47.8 });
    drawRich(ctx, '{mink:μ₀ = 4π·10⁻⁷} T·m/A', cx, 430, { size: 36, local: t - 48.6 });
    separa(ctx, 480, P(t, 52.7, 53.1));
    drawRich(ctx, '{my:F} = {mv:I₂}·{mink:L}·{mg:B₁}', cx, 550, { size: 56, local: t - 52.8 });
    drawRich(ctx, '{mink:L}{dim:: lunghezza del tratto}', cx, 625, { size: 32, local: t - 53.6 });
    drawRich(ctx, '{dim:(il filo è perpendicolare a} {mg:B₁}{dim:)}', cx, 675, { size: 30, local: t - 54.2 });
    ctx.restore();
  }
  const s4 = life(t, 58.3, 68.8, .4, .4);
  if (s4 > 0) {
    ctx.save(); ctx.globalAlpha *= s4;
    conFont(TITOLI, () => drawRich(ctx, 'mano destra aperta', cx, 175, { size: 40, weight: 600 }));
    const th = P(t, 59.5, 61.5) * Math.PI / 2, km = P(t, 58.4, 59.0);
    manoAperta(ctx, HC, HS, -Math.PI / 2, th, km);
    frecceMano(ctx, HC, HS, -Math.PI / 2, th, P(t, 59.0, 59.5), '{mv:I₂}', C.v, '{mg:B₁}', P(t, 64.1, 64.5));   // F con il fumetto delle 64,1
    cartellino(ctx, 1300, 250, P(t, 59.0, 59.4) * (1 - P(t, 59.6, 60.0)));
    drawRich(ctx, '{dim:palmo a sinistra:} {my:F} {dim:verso il filo 1}', cx, 752, { size: 30, alpha: P(t, 64.1, 64.6) });
    ctx.restore();
  }
  const s5 = life(t, 68.8, T_FINE + .1, .4, .5);
  if (s5 > 0) {
    ctx.save(); ctx.globalAlpha *= s5;
    conFont(TITOLI, () => drawRich(ctx, 'forze fra i fili', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:stesso verso:} {g:si attraggono}', cx, 240, { size: 34, local: t - 68.9 });
    drawRich(ctx, '{dim:versi opposti:} {g:si respingono}', cx, 292, { size: 34, local: t - 69.4 });
    drawRich(ctx, '{dim:sul filo 1: forza} {g:uguale e opposta}', cx, 344, { size: 32, local: t - 73.6 });
    separa(ctx, 395, P(t, 78.5, 78.9));
    drawRich(ctx, '{mv:I₁} = {mv:I₂} = 10 A{dim:,} {mink:d} = 1 cm = 0,01 m', cx, 445, { size: 32, local: t - 78.6 });
    drawRich(ctx, '{mink:μ₀}/(2{mink:π}) = 2·10⁻⁷ T·m/A', cx, 495, { size: 30, local: t - 79.0 });
    drawRich(ctx, '{mg:B₁} = 2·10⁻⁷ T·m/A · 10 A / 0,01 m', cx, 545, { size: 30, local: t - 79.6 });
    drawRich(ctx, '{mg:B₁} = 2·10⁻⁴ T', cx, 600, { size: 40, local: t - 80.6 });
    drawRich(ctx, '{my:F} = 10 A · 1 m · 2·10⁻⁴ T', cx, 668, { size: 34, local: t - 85.5 });
    drawRich(ctx, '{my:F} = {g:2·10⁻³ N} {dim:per metro}', cx, 728, { size: 40, local: t - 86.4 });
    ctx.restore();
  }
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due fili che si attraggono', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 101.8, 102.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Correnti nello stesso verso si attraggono,\nin versi opposti si respingono.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mg:B₁} = {mink:μ₀}·{mv:I₁} / (2{mink:π}·{mink:d})\n{dim:il campo del filo 1}'], [960, '{my:F} = {mv:I₂}·{mink:L}·{mg:B₁}\n{dim:la forza sul filo 2}'], [1470, '{dim:sul filo 1 una forza}\n{g:uguale e opposta}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): quando i fili si piegano il tono segue flessione() (rieseguita), da
  // −40 px (0) a +40 px verso l'altro filo (1); quando la mano si inclina segue l'angolo
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4],                                                // i due fili
    ['pop', 12.7, .5], ['tono', 12.9, 14.7, [.5, .69, .86, .83, .75, .75, .78, .79, .78, .77]],   // stesso verso: si attraggono
    ['pop', 13.5, .45],                                                               // le forze
    ['pop', 17.4, .4], ['tono', 17.4, 19.2, [.77, .4, .05, .12, .27, .27, .22, .2, .22, .23]],    // versi opposti: si respingono
    ['pop', 17.9, .45],
    ['pop', 21.7, .4],                                                                // al contrario delle cariche
    ['soffio', 26.6],                                                                 // perché
    ['pop', 31.7, .5], ['pop', 32.1, .42], ['pop', 32.5, .35],                        // il campo del filo 1, più debole lontano
    ['pop', 37.3, .5],                                                                // la mano destra
    ['pop', 43.1, .5], ['traccia', 43.2, 43.7],                                       // B₁ sul filo 2, la distanza d
    ['pop', 47.9, .6], ['pop', 48.7, .4],                                             // B₁ = μ₀·I₁/(2π·d), μ₀
    ['traccia', 52.8, 53.3], ['pop', 52.9, .6],                                       // il tratto L, F = I₂·L·B₁
    ['pop', 58.5, .45], ['tono', 59.5, 61.5, [.2, .22, .33, .57, .68, .7]],           // la mano aperta si gira
    ['pop', 62.8, .55], ['pop', 64.2, .5],                                            // F verso il filo 1
    ['pop', 69.1, .5],                                                                // I₂ al contrario: F si gira
    ['pop', 73.7, .5],                                                                // sul filo 1, uguale e opposta
    ['pop', 78.7, .4], ['ding', 80.7],                                                // B₁ = 2·10⁻⁴ T
    ['pop', 85.6, .4], ['ding', 86.5],                                                // F = 2·10⁻³ N
    ['soffio', 92.2], ['pop', 94.4, .5], ['pop', 94.9, .6], ['pop', 95.4, .7],        // in una frase
  ];
  return {
    titolo: 'Due fili che si attraggono', durata: 103, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.4, 'l’esperimento'], [26.4, 42.8, 'il campo del filo 1'], [42.8, 68.7, 'la forza sul filo 2'], [68.7, T_FINE, 'quanto è forte']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneEsperimento(ctx, t); sceneSpiegazione(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});

