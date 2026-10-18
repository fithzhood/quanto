'use strict';
/* Perché i fili dell'alta tensione — l'effetto Joule e la potenza. Pila da 12 V e resistenza da 6 Ω: I = 2 A,
   P = V·I = 24 W = R·I² = V²/R, tutta in calore (nell'ingrandimento gli atomi vibrano sempre di più, gli elettroni
   risalgono la resistenza contro la corrente). L'alta tensione: una centrale manda 10 MW su fili
   con R = 5 Ω; a 10 000 V servono 1000 A e nei fili si perdono R·I² = 5 MW (metà); a 100 000 V bastano 100 A e si perdono
   50 kW (0,5%). Coda: la corrente nel corpo (1 mA si sente, ~10 mA non si molla la presa, il salvavita scatta a 30 mA,
   da ~50 mA pericolo per il cuore) e l'uccello sul filo: ogni filo (2,5 Ω su 50 km) ha 5·10⁻⁵ Ω/m, fra zampe a 5 cm
   R = 2,5·10⁻⁶ Ω e con 100 A ΔV = R·I = 2,5·10⁻⁴ V: quasi zero. Frecce della corrente C.v lunghe in proporzione (60 px/A
   nel circuito, 0,3 px/A nella linea); le barre della potenza sono in proporzione (80 px/MW). Colori fissi della corrente:
   corrente C.v, tensione C.y, energia e calore C.g, perdite C.y. La parte della linea è scritta nei tempi di prima
   (54,3–86,2) e si disegna con t + SPOSTA. Argomento: corrente. */
CVIDEO.registra('corrente/joule', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 96.4;
const SPOSTA = 15.2, FINE_LINEA = 86.2;   // la linea era a 54,3–86,2: ora va a 39,1–71,0
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.0, 'pensa'], [18.4, 'neutro'],
  [28.8, 'felice'], [33.9, 'neutro'], [49.3, 'sorpreso'], [54.7, 'felice'], [60.1, 'festa'], [65.5, 'neutro'],
  [76.7, 'sorpreso'], [81.5, 'pensa'], [85.6, 'felice'], [91.0, 'neutro'], [98.8, 'felice'], [103.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché l’energia viaggia sui fili\nad {g:alta tensione}?'],
  [7.9, 12.9, 'Pila da 12 V, resistenza da 6 Ω:\nla resistenza si {g:scalda}.'],
  [13.0, 18.3, 'È l’{g:effetto Joule}: gli elettroni urtano\ngli atomi del metallo e li fanno vibrare.'],
  [18.4, 23.5, 'La tensione {my:V} è energia per coulomb;\nla corrente {mv:I}, coulomb al secondo.'],
  [23.6, 28.7, 'Il prodotto è energia al secondo, la\n{g:potenza}: {mink:P} = {my:V}·{mv:I}, in watt (W).'],
  [28.8, 33.8, 'Qui {mink:P} = 24 W: ogni secondo\n24 J diventano calore.'],
  [33.9, 39.0, 'Con {my:V} = {mink:R}·{mv:I} si può scrivere anche\n{mink:P} = {mink:R}·{mv:I}² = {my:V}²/{mink:R}.'],
  [39.1, 44.1, 'Una centrale manda 10 MW, dieci milioni\ndi watt, a una città lontana.'],
  [44.2, 49.2, 'I fili, lunghi chilometri, hanno\nresistenza 5 Ω: si scaldano anche loro.'],
  [49.3, 54.6, 'A 10 000 V servono 1000 A: nei fili\nsi perdono {y:5 MW}, la metà!'],
  [54.7, 60.0, 'A 100 000 V bastano 100 A: si\nperdono solo {g:50 kW}, lo 0,5%.'],
  [60.1, 65.4, 'Corrente 10 volte minore: il calore\n{mink:R}·{mv:I}² diventa {g:100 volte} minore.'],
  [65.5, 70.4, 'Per questo viaggia ad alta tensione\ne arriva in casa a 230 V.'],
  [71.6, 76.6, 'Anche nel corpo la corrente scalda\ne fa contrarre i muscoli, cuore compreso.'],
  [76.7, 81.4, 'Poche decine di milliampere attraverso\nil cuore sono già pericolose.'],
  [81.5, 85.5, 'Ma allora perché l’uccello sul filo\nnon si fulmina?'],
  [85.6, 90.9, 'Tocca un filo solo: fra le sue zampe la\ndifferenza di potenziale è quasi {g:zero}.'],
  [91.0, 95.8, 'Se toccasse due fili, la corrente\npasserebbe attraverso di lui.'],
  [98.8, 104.8, 'A parità di potenza, alta tensione vuol\ndire poca corrente e poco calore perso.'],
];

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
function filo(ctx, pts, k, al = 1, col = C.ink, w = 5) {
  if (k <= 0 || al <= 0) return;
  let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let resto = tot * k;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
// resistenza a zig-zag lungo un filo, fra a e b; «caldo» la colora e le dà un alone
function resistenza(ctx, a, b, al = 1, caldo = 0) {
  if (al <= 0) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  ctx.save(); ctx.globalAlpha *= al;
  if (caldo > 0) {
    const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], g = ctx.createRadialGradient(c[0], c[1], 10, c[0], c[1], L * .75);
    g.addColorStop(0, css(C.g, .4 * caldo)); g.addColorStop(1, css(C.g, 0));   // il calore: verde come l'energia
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], L * .75, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = css(mix(C.ink, C.y, .75 * caldo)); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const n = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
  for (let i = 0; i < n; i++) for (const [f, s] of [[.25, 1], [.75, -1]]) { const d = (i + f) * L / n; ctx.lineTo(a[0] + ux * d + nx * 20 * s, a[1] + uy * d + ny * 20 * s); }
  ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function etichetta(ctx, s, x, y, al, align = 'center', size = 34) { if (al > 0) drawRich(ctx, s, x, y, { size, align, alpha: al }); }
// un elettrone: pallino azzurro col segno meno
function elettrone(ctx, p, al = 1, r = 9) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]); ctx.stroke();
  ctx.restore();
}
// numeri con lo spazio delle migliaia: 10000 → «10 000»
const migliaia = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];

// ---------- 1 · l'effetto Joule (7,5–39) ----------
const XB = 260, XR = 640, YT = 230, YG = 670, YC = 450, PX_A = 60;
const ZC = [900, 450], ZR = 150;   // l'ingrandimento dentro la resistenza
function sceneJoule(ctx, t) {
  const al = life(t, 7.8, 39.2, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kw = P(t, 8.1, 9.6, E.lin), caldo = P(t, 9.4, 14.0);
  filo(ctx, [[XB, YC - 15], [XB, YT], [XR, YT], [XR, 340]], kw);
  filo(ctx, [[XR, 560], [XR, YG], [XB, YG], [XB, YC + 15]], kw);
  resistenza(ctx, [XR, 340], [XR, 560], P(t, 8.6, 9.1), caldo);
  pila(ctx, XB, YC, P(t, 8.1, 8.6));
  etichetta(ctx, '{y:12 V}', 198, YC, P(t, 8.1, 8.6), 'right', 36);
  etichetta(ctx, '{mink:R} = 6 Ω', 606, YC, P(t, 8.8, 9.3), 'right', 34);
  // la corrente: 2 A, dal + giù attraverso la resistenza e indietro sotto
  const kI = P(t, 18.7, 19.2), I = 12 / 6;
  freccia(ctx, [450 + PX_A * I / 2, YG + 45], [450 - PX_A * I / 2, YG + 45], C.v, kI);
  etichetta(ctx, '{mv:I} = 2 A', 532, YG + 45, kI, 'left', 34);
  // l'ingrandimento: atomi che vibrano sempre di più, elettroni che risalgono (contro la corrente)
  const kz = P(t, 13.1, 13.8);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz;
    ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(XR + 26, 352); ctx.lineTo(ZC[0] - ZR * .71, ZC[1] - ZR * .71);
    ctx.moveTo(XR + 26, 548); ctx.lineTo(ZC[0] - ZR * .71, ZC[1] + ZR * .71); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR - 3, 0, TAU); ctx.clip();
    const A = 1.5 + 7 * P(t, 13.6, 17.6);
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
      const x = ZC[0] + i * 56 + A * Math.sin(23 * t + i * 1.7 + j * 2.3), y = ZC[1] + j * 56 + A * Math.cos(19 * t + i * 2.9 + j * 1.1);
      const g = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, 15);
      g.addColorStop(0, css(mix(C.dim, C.paper, .5))); g.addColorStop(1, css(mix(C.dim, C.y, .5 * caldo)));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill();
    }
    for (let k = 0; k < 7; k++) {
      const x = ZC[0] - 168 + k * 56 + 28 + 9 * Math.sin(5 * t + k * 2.1);
      const y = ZC[1] + ZR - (((t - 13.1) * 55 + k * 97) % (2 * ZR));
      elettrone(ctx, [x, y], 1, 9);
    }
    ctx.restore();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR, 0, TAU); ctx.stroke();
    ctx.restore();
    txt(ctx, 'ingrandito e accelerato', ZC[0], ZC[1] + ZR + 34, { size: 30, color: C.dim, alpha: kz });
  }
  ctx.restore();
}

// ---------- 3 · l'alta tensione (54–86) ----------
const P_C = 10, R_LINEA = 5, PX_LA = .3, PX_MW = 80;               // 10 MW, 5 Ω, frecce 0,3 px/A, barre 80 px/MW
const scenario = t => kf(t, [[69.95, 0], [70.75, 1]]);             // 0: 10 000 V, 1: 100 000 V
const correnteLinea = t => P_C * 1e6 / lerp(1e4, 1e5, scenario(t));   // I = P/V
function casa(ctx, x, y, w, h) {
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h); ctx.lineTo(x, y - h - w * .45); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function sceneLinea(ctx, t) {
  const al = life(t, 54.3, FINE_LINEA + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = scenario(t), I = correnteLinea(t), perso = R_LINEA * I * I / 1e6, kC = P(t, 64.6, 65.2);   // MW persi nei fili
  // la centrale e la città
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.rect(244, 230, 26, 60); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(140, 285, 150, 140, 8); ctx.fill(); ctx.stroke();
  txt(ctx, 'centrale', 215, 455, { size: 30, color: C.dim });
  casa(ctx, 975, 425, 80, 70); casa(ctx, 1040, 425, 56, 50); casa(ctx, 925, 425, 50, 44);
  txt(ctx, 'città', 990, 455, { size: 30, color: C.dim });
  // i fili: andata (fino al tetto della casa grande) e ritorno (fino al muro della casa piccola); si scaldano in
  // proporzione al calore che vi si sviluppa, da quando si dice che si scaldano (alone verde del calore)
  const kR = P(t, 59.6, 60.1), f = clamp(perso / 5) * kR, yA = 320, yB = 390;
  for (const [y, fine] of [[yA, [[1000, yA], [1000, 341]]], [yB, []]]) {
    if (f > 0) { ctx.save(); ctx.globalAlpha *= f; ctx.strokeStyle = css(C.g, .3); ctx.lineWidth = 24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(290, y); ctx.lineTo(900, y); ctx.stroke(); ctx.restore(); }
    filo(ctx, [[290, y], [900, y]].concat(fine), P(t, 54.5, 55.5, E.lin), 1, mix(C.ink, C.y, .7 * f), 5);
  }
  etichetta(ctx, '{dim:fili:} {mink:R} = 5 Ω', 595, 462, kR, 'center', 32);
  // tensione e corrente, con la freccia lunga in proporzione
  const k0 = kC * (1 - P(t, 69.95, 70.35)), k1 = P(t, 70.35, 70.75);
  etichetta(ctx, '{dim:tensione} {y:10 000 V}', 595, 185, k0, 'center', 34);
  etichetta(ctx, '{dim:tensione} {y:100 000 V}', 595, 185, k1, 'center', 34);
  etichetta(ctx, '{mv:I} = 1000 A', 595, 245, k0, 'center', 34);
  etichetta(ctx, '{mv:I} = 100 A', 595, 245, k1, 'center', 34);
  const L = PX_LA * I;
  freccia(ctx, [595 - L / 2, yA - 32], [595 + L / 2, yA - 32], C.v, kC);
  freccia(ctx, [595 + L / 2, yB + 32], [595 - L / 2, yB + 32], C.v, kC);
  // la barra della potenza: quel che arriva (verde) e quel che si perde nei fili (arancio, come le perdite)
  const kb = P(t, 54.8, 55.4), x0 = 195, yb = 600, kp = kC * P(t, 64.8, 65.6);
  etichetta(ctx, '{dim:la centrale manda} 10 MW', 595, 545, kb, 'center', 32);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb;
    const wr = PX_MW * perso * kp, wtot = PX_MW * P_C;
    ctx.fillStyle = css(C.g, .8); ctx.fillRect(x0, yb - 24, wtot - wr, 48);
    ctx.fillStyle = css(C.y, .85); ctx.fillRect(x0 + wtot - wr, yb - 24, wr, 48);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.strokeRect(x0, yb - 24, wtot, 48);
    ctx.restore();
  }
  const kl0 = kp * (1 - P(t, 69.95, 70.35));
  etichetta(ctx, '{g:arriva: 5 MW}', x0, 668, kl0, 'left', 32);
  etichetta(ctx, '{y:calore nei fili: 5 MW}', x0 + 800, 668, kl0, 'right', 32);
  etichetta(ctx, '{g:arriva: 9,95 MW}', x0, 668, k1, 'left', 32);
  etichetta(ctx, '{y:calore nei fili: 50 kW}', x0 + 800, 668, k1, 'right', 32);
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 39.0, () => {
    conFont(TITOLI, () => drawRich(ctx, 'effetto Joule', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:R}{dim:: resistenza, in ohm (Ω)}', cx, 232, { size: 32, local: t - 8.1 });
    drawRich(ctx, '{dim:percorsa da corrente, si} {g:scalda}', cx, 280, { size: 32, local: t - 10.0 });
    separa(ctx, 325, P(t, 18.4, 18.8));
    drawRich(ctx, '{my:V}{dim:: tensione, energia per coulomb}', cx, 370, { size: 32, local: t - 18.5 });
    drawRich(ctx, '{mv:I}{dim:: corrente, coulomb al secondo}', cx, 415, { size: 32, local: t - 20.0 });
    drawRich(ctx, '{mv:I} = {my:V}/{mink:R} = 12 V / 6 Ω = 2 A', cx, 462, { size: 32, local: t - 21.4 });
    separa(ctx, 505, P(t, 23.6, 24.0));
    drawRich(ctx, '{mink:P} = {my:V}·{mv:I}', cx, 560, { size: 56, local: t - 23.7 });
    drawRich(ctx, '{dim:potenza, in watt: 1 W = 1 J/s}', cx, 615, { size: 30, local: t - 25.6 });
    drawRich(ctx, '12 V · 2 A = {g:24 W}', cx, 668, { size: 38, local: t - 28.9 });
    drawRich(ctx, '{mink:P} = {mink:R}·{mv:I}² = {my:V}²/{mink:R}', cx, 736, { size: 38, local: t - 34.0 });
  });
}
// il pannello della linea, nei tempi di prima (si chiama con t + SPOSTA)
function pannelloLinea(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(54.3, FINE_LINEA + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'perdite nei fili', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:P} = {my:V}·{mv:I}{dim:, quindi} {mv:I} = {mink:P}/{my:V}', cx, 235, { size: 34, local: t - 54.5 });
    drawRich(ctx, '{dim:1 MW = 10}{mdim:⁶}{dim: W,  1 kW = 1000 W}', cx, 285, { size: 30, local: t - 55.6 });
    drawRich(ctx, '{dim:calore nei fili:} {mink:R}·{mv:I}²', cx, 340, { size: 34, local: t - 59.6 });
    separa(ctx, 385, P(t, 64.5, 64.9));
    const kh = P(t, 64.6, 65.0);
    for (const [x, s] of [[1290, 'tensione'], [1490, 'corrente'], [1680, 'calore']]) txt(ctx, s, x, 425, { size: 30, color: C.dim, alpha: kh });
    drawRich(ctx, '{y:10 000 V}', 1290, 482, { size: 34, local: t - 64.7 });
    drawRich(ctx, '{v:1000 A}', 1490, 482, { size: 34, local: t - 65.0 });
    drawRich(ctx, '{y:5 MW}', 1680, 482, { size: 34, local: t - 66.6 });
    drawRich(ctx, '{y:100 000 V}', 1290, 542, { size: 34, local: t - 70.0 });
    drawRich(ctx, '{v:100 A}', 1490, 542, { size: 34, local: t - 70.4 });
    drawRich(ctx, '{g:50 kW}', 1680, 542, { size: 34, local: t - 71.6 });
    separa(ctx, 592, P(t, 75.3, 75.7));
    drawRich(ctx, '{dim:corrente / 10  →  calore / 100}', cx, 638, { size: 32, local: t - 75.4 });
    drawRich(ctx, '{dim:vicino alle case si torna a} {y:230 V}', cx, 712, { size: 30, local: t - 81.6 });
  });
}

// ---------- 4 · la corrente nel corpo (71,2–81,5) ----------
function sceneCorpo(ctx, t) {
  const kl = life(t, 71.4, 81.6, .5, .5), kr = life(t, 76.7, 85.6, .5, .3);
  if (kl > 0) {
    ctx.save(); ctx.globalAlpha *= kl;
    conFont(TITOLI, () => drawRich(ctx, 'la corrente nel corpo', 610, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:calore}{dim:: ustioni}', 610, 300, { size: 38, local: t - 71.8 });
    drawRich(ctx, '{dim:i} muscoli {dim:si contraggono}', 610, 420, { size: 38, local: t - 72.8 });
    drawRich(ctx, '{dim:anche il} cuore{dim:: può perdere il ritmo}', 610, 540, { size: 38, local: t - 74.2 });
    ctx.restore();
  }
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    conFont(TITOLI, () => drawRich(ctx, 'quanta corrente', 1480, 170, { size: 40, weight: 600 }));
    [['{v:1 mA}', 'si sente un formicolio'], ['{v:10 mA}', 'i muscoli non mollano la presa'],
      ['{v:30 mA}', 'soglia del salvavita (corrente verso terra)'], ['{v:50 mA e oltre}', 'pericolo per il cuore']].forEach(([v, d], i) => {
      const a = 76.9 + i * .7;
      drawRich(ctx, v, 1480, 250 + i * 120, { size: 40, local: t - a });
      drawRich(ctx, '{dim:' + d + '}', 1480, 295 + i * 120, { size: 30, local: t - a - .3 });
    });
    drawRich(ctx, '{dim:(dipende da durata e percorso)}', 1480, 735, { size: 30, local: t - 79.5 });
    ctx.restore();
  }
}

// ---------- 5 · l'uccello sul filo (81,5–96,4) ----------
const YW1 = 470, YW2 = 640, XU = 560;
function uccello(ctx, x, y, al, ala = null) {   // x, y: in mezzo alle zampe, sul filo
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - 12, y - 30); ctx.lineTo(x - 25, y); ctx.moveTo(x + 12, y - 30); ctx.lineTo(x + 25, y); ctx.stroke();
  ctx.fillStyle = css(mix(C.paper, C.ink, .22));
  ctx.beginPath(); ctx.moveTo(x - 40, y - 52); ctx.lineTo(x - 82, y - 40); ctx.lineTo(x - 44, y - 66); ctx.closePath(); ctx.fill(); ctx.stroke();   // coda
  ctx.beginPath(); ctx.ellipse(x, y - 58, 44, 30, -.12, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 38, y - 92, 19, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.moveTo(x + 55, y - 98); ctx.lineTo(x + 76, y - 90); ctx.lineTo(x + 55, y - 84); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x + 43, y - 96, 3.5, 0, TAU); ctx.fill();
  if (ala) { ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 6, y - 62); ctx.quadraticCurveTo(ala[0] - 50, (y + ala[1]) / 2, ala[0], ala[1]); ctx.stroke(); }
  ctx.restore();
}
function sceneUccello(ctx, t) {
  const al = life(t, 81.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il filo, con i suoi 100 A
  filo(ctx, [[150, YW1], [1070, YW1]], P(t, 81.7, 82.5, E.lin), 1, C.ink, 6);
  freccia(ctx, [215, YW1 - 50], [385, YW1 - 50], C.v, P(t, 82.3, 82.8));   // andata: dalla centrale verso la città
  etichetta(ctx, '{mv:I} = 100 A', 300, YW1 - 92, P(t, 82.3, 82.8), 'center', 34);
  uccello(ctx, XU, YW1, P(t, 82.6, 83.2, E.back));
  // le zampe a 5 cm
  const kz = P(t, 85.8, 86.3);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(XU - 25, YW1 + 22); ctx.lineTo(XU - 25, YW1 + 44); ctx.moveTo(XU + 25, YW1 + 22); ctx.lineTo(XU + 25, YW1 + 44);
    ctx.moveTo(XU - 25, YW1 + 33); ctx.lineTo(XU + 25, YW1 + 33); ctx.stroke(); ctx.restore();
    txt(ctx, '5 cm', XU, YW1 + 72, { size: 30, color: C.dim, alpha: kz });
  }
  // se toccasse due fili: l'altro filo, e la corrente che passerebbe nell'uccello
  const k2 = P(t, 91.1, 91.7);
  if (k2 > 0) {
    filo(ctx, [[150, YW2], [1070, YW2]], P(t, 91.1, 91.7, E.lin), 1, C.ink, 6);
    uccello(ctx, 880, YW1, .55 * k2, [905, YW2]);
    freccia(ctx, [836, YW1 + 18], [836, YW2 - 18], C.v, P(t, 91.8, 92.3), 7);
    txt(ctx, 'se toccasse due fili', 880, YW2 + 50, { size: 30, color: C.dim, alpha: k2 });
  }
  // il pannello
  const cx = 1480;
  conFont(TITOLI, () => drawRich(ctx, 'l’uccello sul filo', cx, 170, { size: 40, weight: 600, alpha: P(t, 85.6, 86.1) }));
  drawRich(ctx, '{dim:tocca un filo solo}', cx, 235, { size: 32, local: t - 85.8 });
  drawRich(ctx, '{dim:5 cm di filo:} {mink:R} ≈ 0,0000025 Ω', cx, 300, { size: 32, local: t - 86.5 });
  drawRich(ctx, '{my:ΔV} = {mink:R}·{mv:I} ≈ 0,00025 V', cx, 365, { size: 36, local: t - 87.5 });
  drawRich(ctx, '{g:quasi zero}', cx, 432, { size: 44, local: t - 88.6 });
  drawRich(ctx, '{dim:nell’uccello non passa quasi niente}', cx, 487, { size: 30, local: t - 89.2 });
  separa(ctx, 540, P(t, 91.0, 91.4));
  drawRich(ctx, '{dim:fra i due fili:} {y:100 000 V}', cx, 595, { size: 34, local: t - 91.2 });
  drawRich(ctx, '{dim:la corrente lo attraverserebbe}', cx, 650, { size: 30, local: t - 92.0 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché i fili dell’alta tensione', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 105.6, 106.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'A parità di potenza, alta tensione\nvuol dire poca corrente e poco calore.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:P} = {my:V}·{mv:I} = {mink:R}·{mv:I}²\n{dim:in watt: 1 W = 1 J/s}'], [960, '{dim:alta tensione:}\npoca corrente, poco calore'], [1470, '{dim:l’uccello tocca un filo solo:}\n{my:ΔV} {g:quasi zero}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): istanti veri del video (la linea, scritta nei tempi di prima, è
  // anticipata di SPOSTA = 15,2 s); il tono segue il calore, poi la corrente nei fili
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 9.6], ['pop', 8.6, .5],                         // il circuito, la resistenza
    ['tono', 9.4, 14.0, [.3, .35, .5, .65, .7]], ['pop', 13.1, .6],                   // la resistenza si scalda, l'ingrandimento
    ['traccia', 18.7, 19.2],                                                          // I = 2 A
    ['pop', 23.7, .6], ['ding', 28.9],                                                // P = V·I, 24 W
    ['pop', 34.0, .6],                                                                // P = R·I² = V²/R
    ['soffio', 39.1], ['pop', 39.6, .5],                                              // la linea, 10 MW
    ['pop', 44.4, .4],                                                                // i fili: R = 5 Ω
    ['traccia', 49.4, 50.0], ['tono', 49.6, 50.4, [.3, .7]],                          // 1000 A: la perdita cresce fino a metà
    ['tono', 54.75, 55.55, [.8, .37, .26, .17, .15]], ['pop', 54.8, .7], ['ding', 56.4],   // 100 000 V: 100 A, 50 kW
    ['soffio', 71.4], ['pop', 71.8, .5], ['pop', 72.8, .5], ['pop', 74.2, .6],        // la corrente nel corpo
    ['pop', 76.9, .3], ['pop', 77.6, .45], ['pop', 78.3, .6], ['pop', 79.0, .75],     // 1, 10, 30, 50 mA
    ['soffio', 81.6], ['traccia', 81.7, 82.5], ['pop', 82.6, .6],                     // il filo, l'uccello
    ['traccia', 85.8, 86.3], ['pop', 87.5, .5], ['ding', 88.6],                       // 5 cm, ΔV = R·I: quasi zero
    ['traccia', 91.1, 91.7], ['tono', 91.8, 92.3, [.7, .3]],                          // due fili: la corrente lo attraversa
    ['soffio', 96.6], ['pop', 97.0, .6], ['pop', 98.6, .5], ['pop', 99.1, .6], ['pop', 99.6, .7],   // in una frase
  ];
  return {
    titolo: 'Perché i fili dell’alta tensione', durata: 107.3, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.0, 'l’effetto Joule'], [39.0, 71.0, 'l’alta tensione'], [71.0, T_FINE, 'la corrente e il corpo']],
    scena(ctx, t) {
      sceneIntro(ctx, t); sceneSchede(ctx, t); sceneJoule(ctx, t);
      sceneLinea(ctx, t + SPOSTA); scenePannello(ctx, t); pannelloLinea(ctx, t + SPOSTA);
      sceneCorpo(ctx, t); sceneUccello(ctx, t); sceneFine(ctx, t);
    },
  };
});
