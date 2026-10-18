'use strict';
/* La legge di Coulomb — F = k·q₁·q₂/r² (k ≈ 8,99·10⁹ N·m²/C² = 1/(4π·ε₀), ε₀ ≈ 8,85·10⁻¹² C²/(N·m²)): forze uguali e
   opposte sulla congiungente; stesso segno si respingono, segni opposti si attraggono. Frecce lunghe in proporzione:
   220 px per q₁·q₂ a distanza r; carica doppia 440, poi distanza doppia 110, tripla 48,9; l'attrazione a 1,5r, 97,8 px.
   Elettrone e protone a 5,3·10⁻¹¹ m (idrogeno): forza elettrica ≈ 8,2·10⁻⁸ N, gravitazionale ≈ 3,6·10⁻⁴⁷ N, rapporto
   ≈ 2,3·10³⁹, lo stesso a 1,0·10⁻⁹ m (2,3·10⁻¹⁰ N e 1,0·10⁻⁴⁹ N) e a 1 m (2,3·10⁻²⁸ N e 1,0·10⁻⁶⁷ N).
   Colori fissi dell'elettrostatica: cariche positive C.v (viola), negative C.x (azzurro), forze C.y, campo C.ink.
   Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/coulomb', M => {
  const { W, C, E, P, life, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, drawSeq } = M;
  const TAU = Math.PI * 2;

const T_FINE = 92.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.4, 'felice'], [21.9, 'neutro'],
  [26.7, 'sorpreso'], [31.1, 'neutro'], [36.1, 'felice'], [40.4, 'neutro'], [49.9, 'felice'], [54.7, 'pensa'],
  [59.8, 'neutro'], [73.5, 'pensa'], [78.4, 'sorpreso'], [82.7, 'neutro'], [87.4, 'festa'], [91.0, 'neutro'],
  [94.4, 'felice'], [98.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Con che forza si spingono\ndue cariche elettriche?'],
  [7.9, 12.4, 'Due cariche {mink:q₁} e {mink:q₂}, puntiformi,\na distanza {mink:r} fra loro.'],
  [12.5, 17.3, 'La carica si misura in {g:coulomb} (C).\nQui sono tutte e due positive.'],
  [17.4, 21.8, 'Si {g:respingono}: le due forze stanno\nsulla retta che le unisce.'],
  [21.9, 26.6, 'Legge di Coulomb: {my:F} = {mink:k·q₁·q₂/r²},\ncome la gravità di Newton.'],
  [26.7, 31.0, '{mink:k} ≈ 8,99·10{mink:⁹} N·m²/C²:\nun numero {g:enorme}.'],
  [31.1, 36.0, 'Si scrive anche {mink:k} = 1/(4π·{mink:ε₀}): {mink:ε₀}\nè la costante dielettrica del vuoto.'],
  [36.1, 40.3, 'Raddoppio {mink:q₁}: le due forze\n{g:raddoppiano}.'],
  [40.4, 44.6, 'Distanza doppia: la forza\ndiventa {g:un quarto}.'],
  [44.7, 48.5, 'Distanza tripla:\n{g:un nono}.'],
  [49.9, 54.6, 'Ora {mink:q₂} è {x:negativa}:\nle cariche si {g:attraggono}.'],
  [54.7, 59.4, 'Col segno nella formula: {my:F} > 0\nrespinge, {my:F} < 0 attrae.'],
  [59.8, 64.6, 'Nell’atomo di idrogeno: un elettrone\ne un protone a 5,3·10{mink:⁻¹¹} m.'],
  [64.7, 68.9, 'Le loro cariche: +{mink:e} e −{mink:e},\ncon {mink:e} ≈ 1,6·10{mink:⁻¹⁹} C.'],
  [69.0, 73.4, 'La forza elettrica fra loro\nè circa 8,2·10{mink:⁻⁸} N.'],
  [73.5, 78.3, 'La gravità fra le loro masse:\nappena 3,6·10{mink:⁻⁴⁷} N.'],
  [78.4, 82.6, 'L’elettrica è circa {g:2,3·10}{mg:³⁹}\nvolte più forte!'],
  [82.7, 87.3, 'Allontano l’elettrone: le due forze\ncalano tutte e due come 1/{mink:r²}…'],
  [87.4, 91.6, '…e il rapporto {g:non cambia}:\nnon dipende dalla distanza.'],
  [94.4, 100.6, 'Come la gravità, ma col segno\ne molto più forte: {my:F} = {mink:k·q₁·q₂/r²}.'],
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
// una carica: sfera viola se positiva, azzurra se negativa, col segno disegnato sopra (k: da − a + mentre cambia)
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
function righello(ctx, xa, xb, y, al) {   // la distanza fra i centri: una barra con le tacche
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.moveTo(xa, y - 12); ctx.lineTo(xa, y + 12); ctx.moveTo(xb, y - 12); ctx.lineTo(xb, y + 12); ctx.stroke();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La legge di Coulomb', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// le schede: in alto la scena, in basso le formule (sinistra) e le regole (destra)
const TOP = [110, 110, 1700, 330], BL = [110, 465, 1000, 325], BR = [1150, 465, 660, 325];
const YM = 285;
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, ...TOP, al);
  card(ctx, ...BL, Math.max(life(t, 9.6, 59.9, .5, .5), life(t, 68.8, T_FINE + .1, .5, .5)));
  card(ctx, ...BR, Math.max(life(t, 36.1, 59.9, .5, .5), life(t, 78.2, T_FINE + .1, .5, .5)));
}

// 1 · due cariche (7,5–59,6): 220 px di forza per q₁·q₂ a distanza r = 300 px
const X1 = 640, R0 = 300, RQ = 34, LF = 220, DY = 15;
const distanza = t => R0 * (1 + P(t, 40.5, 42.0) + P(t, 44.8, 46.2) - 1.5 * P(t, 48.6, 49.8));   // r, 2r, 3r, poi 1,5r per l'attrazione
const fattoreQ1 = t => 1 + P(t, 36.3, 37.0) - P(t, 48.6, 49.8);
function sceneDue(ctx, t) {
  const al = life(t, 7.8, 59.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const d = distanza(t), x2 = X1 + d, kNeg = P(t, 50.0, 50.6);
  // la retta che le unisce
  const kr = life(t, 18.3, 21.9, .4, .4);
  if (kr > 0) dashed(ctx, [150, YM], [1770, YM], C.dim, 1, .55 * kr);
  carica(ctx, [X1, YM], 1, RQ, 1, P(t, 7.9, 8.4, E.back));
  carica(ctx, [x2, YM], 1, RQ, 1 - kNeg, P(t, 8.2, 8.7, E.back));
  if (kNeg > 0) carica(ctx, [x2, YM], -1, RQ, kNeg);
  // i nomi
  const kq = P(t, 8.4, 8.9), k2 = P(t, 36.3, 37.0) - P(t, 48.6, 49.8);
  drawRich(ctx, '{mink:q₁}', X1, YM + 95, { size: 44, alpha: kq * (1 - k2) });
  drawRich(ctx, '{mink:2q₁}', X1, YM + 95, { size: 44, alpha: kq * k2 });
  drawRich(ctx, '{mink:q₂}', x2, YM + 95, { size: 44, alpha: kq });
  // la distanza fra i centri
  const kd = P(t, 9.6, 10.1);
  if (kd > 0) {
    righello(ctx, X1, x2, YM - 115, kd);
    const n = d / R0, nm = [[1, 'r'], [1.5, '1,5r'], [2, '2r'], [3, '3r']].find(q => Math.abs(n - q[0]) < .02);
    fondo(ctx, (X1 + x2) / 2, YM - 150, nm && nm[1].length > 2 ? 116 : 80, 46, kd);
    if (nm) drawRich(ctx, '{mink:' + nm[1] + '}', (X1 + x2) / 2, YM - 150, { size: 42, alpha: kd });
  }
  // le due forze: uguali e opposte, lunghe come q₁·q₂/r²; positive = si respingono
  const kF = P(t, 17.6, 18.1);
  if (kF > 0) {
    const L = LF * fattoreQ1(t) * (R0 / d) ** 2 * lerp(1, -1, kNeg);   // con segno: > 0 verso l'esterno
    const dy = 0, sx = RQ;   // sulla retta: a distanza 1,5r le due frecce d'attrazione non si toccano
    const a1 = L >= 0 ? X1 - sx : X1 + sx, a2 = L >= 0 ? x2 + sx : x2 - sx;
    freccia(ctx, [a1, YM - dy], [a1 - L, YM - dy], C.y, kF, 7);
    freccia(ctx, [a2, YM + dy], [a2 + L, YM + dy], C.y, kF, 7);
    const m = Math.max(Math.abs(L), 50) / 2 * Math.sign(L || 1);
    drawRich(ctx, '{my:F}', a1 - m, YM - dy - 38, { size: 38, alpha: kF * P(Math.abs(L), 8, 20, E.lin) });
    drawRich(ctx, '{my:F}', a2 + m, YM + dy + 38, { size: 38, alpha: kF * P(Math.abs(L), 8, 20, E.lin) });
  }
  ctx.restore();
}
function scenePannelliDue(ctx, t) {
  const al = life(t, 9.6, 59.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // sinistra: la legge
  drawSeq(ctx, ['{my:F}{mink: = k·}', { num: '{mink:q₁·q₂}', den: '{mink:r²}' }], 320, 625, 60, { local: t - 22.0 });
  const x = 560;
  drawRich(ctx, '{mink:q₁}, {mink:q₂}{dim:: cariche, in coulomb (C)}', x, 525, { size: 32, align: 'left', local: t - 12.6 });
  drawRich(ctx, '{mink:r}{dim:: distanza, in metri}', x, 578, { size: 32, align: 'left', local: t - 9.8 });
  drawRich(ctx, '{mink:k} ≈ 8,99·10{mink:⁹} N·m²/C²', x, 640, { size: 34, align: 'left', local: t - 26.8 });
  drawRich(ctx, '{mink:k} = 1/(4π·{mink:ε₀})', x, 700, { size: 34, align: 'left', local: t - 31.2 });
  drawRich(ctx, '{mink:ε₀} ≈ 8,85·10{mink:⁻¹²} C²/(N·m²)', x, 752, { size: 34, align: 'left', local: t - 31.7 });
  // destra: come cambia, e il segno
  const cx = 1480;
  drawRich(ctx, '{dim:carica doppia →} forza {g:doppia}', cx, 520, { size: 34, local: t - 36.3 });
  drawRich(ctx, '{dim:distanza doppia →} forza {g:un quarto}', cx, 572, { size: 34, local: t - 40.5 });
  drawRich(ctx, '{dim:distanza tripla →} forza {g:un nono}', cx, 624, { size: 34, local: t - 44.8 });
  const ks = P(t, 54.8, 55.2);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1190, 668); ctx.lineTo(1770, 668); ctx.stroke(); ctx.restore();
  }
  drawRich(ctx, '{my:F} > 0{dim:: si respingono}', cx, 712, { size: 34, local: t - 54.9 });
  drawRich(ctx, '{my:F} < 0{dim:: si attraggono}', cx, 760, { size: 34, local: t - 55.3 });
  ctx.restore();
}

// 2 · elettrone e protone (59,6–92): disegno non in scala; i valori cambiano quando l'elettrone arriva
const XP = 230;
const TAPPE = [   // [istante d'arrivo, r, forza elettrica, forza gravitazionale]
  [0, '≈ 5,3·10{mink:⁻¹¹} m', '8,2·10{mink:⁻⁸} N', '3,6·10{mink:⁻⁴⁷} N'],
  [83.6, '= 1,0·10{mink:⁻⁹} m', '2,3·10{mink:⁻¹⁰} N', '1,0·10{mink:⁻⁴⁹} N'],
  [85.9, '= 1 m', '2,3·10{mink:⁻²⁸} N', '1,0·10{mink:⁻⁶⁷} N'],
];
function tappa(ctx, t, i, s, x, y, o) {   // un valore della tappa i, in dissolvenza con la successiva
  const a = i ? P(t, TAPPE[i][0], TAPPE[i][0] + .35) : 1, b = i < TAPPE.length - 1 ? 1 - P(t, TAPPE[i + 1][0], TAPPE[i + 1][0] + .35) : 1;
  drawRich(ctx, s, x, y, Object.assign({}, o, { alpha: (o.alpha != null ? o.alpha : 1) * Math.min(a, b) }));
}
function sceneAtomo(ctx, t) {
  const al = life(t, 59.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const D = 300 + 170 * P(t, 82.9, 83.6) + 170 * P(t, 85.2, 85.9), XE = XP + D;
  carica(ctx, [XP, YM], 1, 34, 1, P(t, 60.0, 60.5, E.back));
  carica(ctx, [XE, YM], -1, 22, 1, P(t, 60.3, 60.8, E.back));
  txt(ctx, 'protone', XP, YM + 85, { size: 32, color: C.dim, alpha: P(t, 60.2, 60.7) });
  txt(ctx, 'elettrone', XE, YM + 85, { size: 32, color: C.dim, alpha: P(t, 60.5, 61.0) });
  const ke = P(t, 64.8, 65.3);
  drawRich(ctx, '+{mink:e}', XP, YM - 62, { size: 38, alpha: ke });
  drawRich(ctx, '−{mink:e}', XE, YM - 52, { size: 38, alpha: ke });
  const kr = P(t, 60.6, 61.1);
  righello(ctx, XP, XE, YM - 120, kr);
  fondo(ctx, (XP + XE) / 2, YM - 152, 60, 44, kr);
  drawRich(ctx, '{mink:r}', (XP + XE) / 2, YM - 152, { size: 40, alpha: kr });
  txt(ctx, 'disegno non in scala', 1780, 410, { size: 30, color: C.dim, align: 'right', alpha: P(t, 60.6, 61.1) });
  // la forza elettrica, attrattiva; la gravitazionale sarebbe 10³⁹ volte più corta: non si disegna
  const kF = life(t, 69.1, 83.0, .5, .3);
  if (kF > 0) {
    const L = 150, s1 = Math.sqrt(34 * 34 - DY * DY), s2 = Math.sqrt(22 * 22 - DY * DY);
    freccia(ctx, [XP + s1, YM - DY], [XP + s1 + L, YM - DY], C.y, kF, 7);
    freccia(ctx, [XE - s2, YM + DY], [XE - s2 - L, YM + DY], C.y, kF, 7);
  }
  // i dati, a destra nella scheda in alto
  const x = 1000;
  TAPPE.forEach((tp, i) => tappa(ctx, t, i, '{mink:r} ' + tp[1], x, 158, { size: 34, align: 'left', local: t - 60.0 }));
  drawRich(ctx, '{mink:e} ≈ 1,6·10{mink:⁻¹⁹} C {dim:(carica del protone)}', x, 208, { size: 34, align: 'left', local: t - 64.8 });
  drawRich(ctx, '{mink:m₁} ≈ 9,11·10{mink:⁻³¹} kg {dim:(elettrone)}', x, 258, { size: 34, align: 'left', local: t - 73.6 });
  drawRich(ctx, '{mink:m₂} ≈ 1,67·10{mink:⁻²⁷} kg {dim:(protone)}', x, 308, { size: 34, align: 'left', local: t - 73.9 });
  drawRich(ctx, '{mink:G} ≈ 6,67·10{mink:⁻¹¹} N·m²/kg² {dim:(gravitazione)}', x, 358, { size: 34, align: 'left', local: t - 74.2 });
  // in basso a sinistra le due forze, in basso a destra il rapporto
  drawRich(ctx, '{dim:forza elettrica} {mink:= k·e²/r²}', 160, 520, { size: 34, align: 'left', local: t - 69.1 });
  TAPPE.forEach((tp, i) => tappa(ctx, t, i, '≈ ' + tp[2], 160, 582, { size: 46, align: 'left', local: t - 69.4 }));
  drawRich(ctx, '{dim:forza gravitazionale} {mink:= G·m₁·m₂/r²}', 160, 660, { size: 34, align: 'left', local: t - 73.6 });
  TAPPE.forEach((tp, i) => tappa(ctx, t, i, '≈ ' + tp[3], 160, 722, { size: 46, align: 'left', local: t - 74.6 }));
  drawRich(ctx, '{dim:elettrica / gravitazionale}', 1480, 540, { size: 34, local: t - 78.5 });
  drawRich(ctx, '{g:≈ 2,3·10}{mg:³⁹}', 1480, 630, { size: 70, local: t - 78.6 });
  drawRich(ctx, '{g:a ogni distanza}', 1480, 725, { size: 36, local: t - 87.5 });
  ctx.restore();
}

// in una frase (92–103,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 101.8, 102.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due cariche si respingono o si attraggono\ncon una forza che va come 1/r².', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:F} = {mink:k·q₁·q₂/r²}\n{mink:k} ≈ 8,99·10{mink:⁹} N·m²/C²'], [960, 'stesso segno: {g:repulsione}\nsegni opposti: {g:attrazione}'], [1470, 'elettrone e protone:\n{g:2,3·10}{mg:³⁹} {g:volte} la gravità']];
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
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 7.9, .6], ['pop', 8.2, .6],             // il titolo, q₁ e q₂
    ['pop', 9.6, .4], ['pop', 12.6, .4],                                              // la distanza r, i coulomb
    ['pop', 17.6, .6],                                                                // si respingono: le due forze
    ['pop', 22.0, .6], ['pop', 26.8, .5], ['pop', 31.2, .45],                         // F = k·q₁·q₂/r², k, ε₀
    ['soffio', 36.1], ['tono', 36.3, 37.0, [.5, .7]],                                 // carica doppia: forza doppia
    ['tono', 40.5, 42.0, [.7, .57, .47, .38, .3]],                                    // distanza doppia: un quarto
    ['tono', 44.8, 46.2, [.3, .23, .17, .12, .07]],                                   // distanza tripla: un nono
    ['pop', 50.0, .25],                                                               // q₂ negativa: si attraggono
    ['pop', 54.9, .6], ['pop', 55.3, .3],                                             // F > 0 respinge, F < 0 attrae
    ['soffio', 59.8], ['pop', 60.0, .6], ['pop', 60.3, .3],                           // protone ed elettrone
    ['pop', 64.8, .5], ['pop', 69.1, .6], ['pop', 73.6, .15],                         // ±e, la forza elettrica, la gravità
    ['ding', 78.6],                                                                   // 2,3·10³⁹ volte
    ['tono', 82.9, 83.6, [.4, .6]], ['pop', 83.6, .4],                                // l'elettrone si allontana…
    ['tono', 85.2, 85.9, [.6, .8]], ['pop', 85.9, .3],                                // …fino a 1 m
    ['soffio', 92.2], ['pop', 94.2, .5], ['pop', 94.7, .6], ['pop', 95.2, .7],        // in una frase
  ];
  return {
    titolo: 'La legge di Coulomb', durata: 103.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 59.6, 'la forza fra due cariche'], [59.6, T_FINE, 'elettrone e protone']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneDue(ctx, t); scenePannelliDue(ctx, t); sceneAtomo(ctx, t); sceneFine(ctx, t); },
  };
});
