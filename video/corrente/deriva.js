'use strict';
/* Elettroni lenti, luce immediata — 1 A in un filo di rame da 1 mm²: 1 C = 6,25·10¹⁸ elettroni (e = 1,6·10⁻¹⁹ C), in 1 mm
   di filo ce ne sono 8,5·10¹⁹ liberi (8,5·10²⁸ al m³), quindi ogni secondo avanzano di 6,25·10¹⁸/8,5·10¹⁹ mm ≈ 0,0735 mm:
   la velocità di deriva. Il pezzo di filo è ingrandito (1 mm = 420 px, diametro vero 1,13 mm) e il tempo è quello vero: i
   pallini (ognuno vale tantissimi elettroni) scorrono a 30,9 px/s, verso sinistra, contro la corrente (C.v): è solo
   l'avanzare d'insieme (lo si scrive: ognuno in più si agita a caso, velocissimo, e non si disegna). Un metro:
   13 600 s ≈ 3,8 ore. Poi il circuito: l'ipotesi «la luce aspetta gli elettroni partiti dall'interruttore» in rosso; il
   filo è già pieno; chiuso l'interruttore, il campo si propaga a ≈ 2·10⁸ m/s (al rallentatore di un miliardo di volte:
   1 m = 704 px in 5 s) in tutte e due le direzioni, e dove passa gli elettroni si mettono in moto. Colori fissi della
   corrente: corrente convenzionale C.v, elettroni C.x. Argomento: corrente. */
CVIDEO.registra('corrente/deriva', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 83.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.5, 'pensa'], [24.1, 'neutro'],
  [35.1, 'felice'], [40.7, 'sorpreso'], [45.7, 'pensa'], [50.7, 'neutro'], [56.3, 'felice'], [61.7, 'neutro'],
  [67.5, 'sorpreso'], [72.5, 'festa'], [77.9, 'neutro'], [85.9, 'felice'], [90.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Premo l’interruttore: luce subito.\nGli elettroni sono velocissimi?'],
  [7.9, 13.2, 'Un millimetro di filo di rame,\ningrandito: sezione {mink:S} = 1 mm².'],
  [13.3, 18.4, 'Corrente: 1 A. L’{g:intensità} è la carica\nal secondo: 1 A = 1 C/s.'],
  [18.5, 24.0, 'Un elettrone porta 1,6·10⁻¹⁹ C:\nper fare 1 C ne servono 6,25·10¹⁸.'],
  [24.1, 29.6, 'Ne passano tanti ogni secondo, ma il\nrame è {g:pieno} di elettroni liberi:'],
  [29.7, 35.0, 'in ogni millimetro di questo filo\nce ne sono 8,5·10¹⁹.'],
  [35.1, 40.6, 'Ogni secondo basta che avanzino di\n6,25·10¹⁸ / 8,5·10¹⁹ mm ≈ {g:0,07 mm}.'],
  [40.7, 45.6, 'È la {g:velocità di deriva}: per un\nmetro ci vogliono quasi {g:4 ore}!'],
  [45.7, 50.6, 'Eppure, quando chiudo l’interruttore,\nla lampadina si accenderà {g:subito}.'],
  [50.7, 56.2, '{r:Se} la luce aspettasse gli elettroni\npartiti dall’interruttore: ore di buio.'],
  [56.3, 61.6, 'Ma il filo è già {g:pieno} di elettroni,\nin tutto il giro, anche nella lampadina.'],
  [61.7, 67.4, 'Chiudo: il {g:campo elettrico} della pila,\nla sua spinta, corre quasi come la luce.'],
  [67.5, 72.4, 'Rallentato un miliardo di volte:\nin realtà bastano 5 miliardesimi di s.'],
  [72.5, 77.8, 'Gli elettroni del giro partono quasi\n{g:insieme}: la lampadina si accende subito.'],
  [77.9, 83.4, 'Nella lampadina si muovono quelli già lì:\nnessuno arriva dall’interruttore.'],
  [85.9, 92.1, 'Gli elettroni avanzano pianissimo:\nè la loro {g:spinta} che arriva subito.'],
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
function elettrone(ctx, p, al = 1, r = 12, anello = 0, colAnello = C.v) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (anello > 0.01) { ctx.strokeStyle = css(colAnello, anello); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], r + 8, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(2, r * .25); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]); ctx.stroke();
  ctx.restore();
}
function lampadina(ctx, c, r, luce, al = 1) {
  if (al <= 0) return;
  const caldo = mix(C.y, [255, 214, 90], .45);
  ctx.save(); ctx.globalAlpha *= al;
  if (luce > 0) {
    const g = ctx.createRadialGradient(c[0], c[1], r * .3, c[0], c[1], r * 2.4);
    g.addColorStop(0, css(caldo, .55 * luce)); g.addColorStop(1, css(caldo, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r * 2.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(caldo, luce); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) * TAU / 8; if (Math.abs(Math.cos(a)) < .3) continue;
      ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(a) * (r + 14), c[1] + Math.sin(a) * (r + 14)); ctx.lineTo(c[0] + Math.cos(a) * (r + 40), c[1] + Math.sin(a) * (r + 40)); ctx.stroke();
    }
  }
  ctx.fillStyle = luce > 0 ? css(mix(C.paper, caldo, .35 * luce)) : C.paper;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(mix(C.ink, caldo, luce)); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(c[0], c[1] + r); ctx.lineTo(c[0], c[1] + r * .4);
  for (let i = 0; i <= 8; i++) ctx.lineTo(c[0] + (i % 2 ? 14 : -14) * (i && i < 8 ? 1 : 0), c[1] + r * .4 - i * r * .1);
  ctx.lineTo(c[0], c[1] - r); ctx.stroke();
  ctx.restore();
}
function interruttore(ctx, a, b, chiuso, al) {
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - chiuso) * .55;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}
// un tratto di spezzata fra le ascisse curvilinee s0 e s1
function tratto(ctx, pc, s0, s1, col, w, al = 1) {
  if (al <= 0 || s1 <= s0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); const a = puntoSu(pc, s0); ctx.moveTo(a[0], a[1]);
  for (let i = 1; i < pc.pts.length; i++) if (pc.cum[i] > s0 && pc.cum[i] < s1) ctx.lineTo(pc.pts[i][0], pc.pts[i][1]);
  const b = puntoSu(pc, s1); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
const caso = i => { const s = Math.sin(i * 12.9898 + 4.1414) * 43758.5453; return s - Math.floor(s); };
// ---------- 1 · il pezzo di filo ingrandito: 1 mm = 420 px, tempo vero ----------
const CARTA = [110, 110, 1000, 680];
const MM = 420, V_DERIVA = 6.25e18 / 8.5e19;   // mm/s ≈ 0,0735
const VPX = V_DERIVA * MM;                       // ≈ 30,9 px/s, verso sinistra (contro la corrente)
const FY = 425, FR = Math.round(Math.sqrt(1 / Math.PI) * MM);   // raggio vero: 0,564 mm → 237 px
const FX0 = 300, FX1 = 1070, EX0 = 372, EX1 = 1060;
const N_D = 70;
const DOTS = Array.from({ length: N_D }, (_, i) => ({ x: EX0 + caso(i) * (EX1 - EX0), y: FY - FR + 26 + caso(i + 100) * (2 * FR - 52) }));
const xDot = (d, t) => { const L = EX1 - EX0; return EX0 + (((d.x - EX0 - VPX * (t - 7.0)) % L) + L) % L; };
// l'elettrone che si segue: a 36 s sta vicino a x = 820, in mezzo al filo
const SEGUITO = (() => { let b = 0, best = 1e9; DOTS.forEach((d, i) => { const e = Math.abs(xDot(d, 36) - 820) + Math.abs(d.y - FY) * .5; if (e < best) { best = e; b = i; } }); return b; })();
function sceneFilo(ctx, t) {
  const al = life(t, 7.8, 45.8, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const rame = mix(C.y, C.paper, .78), rameS = mix(C.y, C.paper, .55);
  const kw = P(t, 8.0, 8.8);
  ctx.save(); ctx.globalAlpha *= kw;
  // il corpo del filo, che continua a destra (sfuma)
  const g = ctx.createLinearGradient(FX0, 0, FX1, 0); g.addColorStop(0, css(rame)); g.addColorStop(.92, css(rame)); g.addColorStop(1, css(rame, 0));
  ctx.fillStyle = g; ctx.fillRect(FX0, FY - FR, FX1 - FX0, 2 * FR);
  const gl = ctx.createLinearGradient(FX0, 0, FX1, 0); gl.addColorStop(0, css(C.ink)); gl.addColorStop(.92, css(C.ink)); gl.addColorStop(1, css(C.ink, 0));
  ctx.strokeStyle = gl; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(FX0, FY - FR); ctx.lineTo(FX1, FY - FR); ctx.moveTo(FX0, FY + FR); ctx.lineTo(FX1, FY + FR); ctx.stroke();
  // la sezione tagliata, a sinistra
  ctx.fillStyle = css(rameS); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(FX0, FY, 64, FR, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
  const kS = P(t, 10.6, 11.2);
  fondo(ctx, FX0, FY, 120, 50, kS); drawRich(ctx, '{mink:S}', FX0, FY, { size: 40, alpha: kS });
  // gli elettroni, alla velocità di deriva vera
  const ke = P(t, 8.6, 9.4);
  DOTS.forEach((d, i) => {
    const x = xDot(d, t), bordo = clamp((x - EX0) / 30) * clamp((EX1 - x) / 50);
    const segue = i === SEGUITO ? life(t, 35.3, 45.6, .4, .4) : 0;
    elettrone(ctx, [x, d.y], ke * bordo, 11, segue, C.g);
  });
  // un secondo di cammino dell'elettrone seguito
  const d = DOTS[SEGUITO], kA = life(t, 36.0, 45.6, .3, .4), kB = life(t, 37.0, 45.6, .3, .4);
  const xa = xDot(d, 36.0), xb = xDot(d, 37.0);
  for (const [x, k] of [[xa, kA], [xb, kB]]) if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(x, d.y, 11, 0, TAU); ctx.stroke(); ctx.restore(); }
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.lineCap = 'round';
    const y = d.y - 34; ctx.beginPath(); ctx.moveTo(xa, y - 8); ctx.lineTo(xa, y + 8); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.moveTo(xb, y - 8); ctx.lineTo(xb, y + 8); ctx.stroke(); ctx.restore();
    fondo(ctx, (xa + xb) / 2, d.y - 76, 250, 46, kB); drawRich(ctx, '{g:0,07 mm in 1 s}', (xa + xb) / 2, d.y - 76, { size: 32, alpha: kB });
  }
  // la corrente (convenzionale) verso destra, gli elettroni verso sinistra
  const kI = P(t, 13.5, 14.0);
  freccia(ctx, [FX0 + 60, FY - FR - 42], [FX0 + 60 + 240, FY - FR - 42], C.v, kI, 7);
  drawRich(ctx, '{mv:I} = 1 A', FX0 + 330, FY - FR - 42, { size: 36, align: 'left', alpha: kI });
  // il righello di 1 mm
  const kR = P(t, 8.4, 9.0);
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    const y = FY + FR + 32, x0 = 480, x1 = 480 + MM;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (const x of [x0, x1]) { ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10); } ctx.stroke(); ctx.restore();
    fondo(ctx, (x0 + x1) / 2, y, 100, 40, kR); txt(ctx, '1 mm', (x0 + x1) / 2, y, { size: 30, color: C.dim, alpha: kR });
    txt(ctx, 'ingrandito', 140, 735, { size: 30, color: C.dim, align: 'left', alpha: kR });
    txt(ctx, 'tempo vero: solo l’avanzare d’insieme;', 1085, 733, { size: 30, color: C.dim, align: 'right', alpha: kR });
    txt(ctx, 'in più ognuno si agita a caso, velocissimo', 1085, 766, { size: 30, color: C.dim, align: 'right', alpha: kR });
  }
  ctx.restore();
}

// ---------- 2 · il circuito: il campo corre, gli elettroni no ----------
const XB = 260, XL = 960, YT = 230, YG = 670, YC = 450, RL = 56;
const SW_A = [330, YT], SW_B = [420, YT];
// il giro, dal contatto dell'interruttore verso la lampadina e indietro fino al perno
const GIRO = percorso([SW_B, [XL, YT], [XL, YC - RL], [XL, YC + RL], [XL, YG], [XB, YG], [XB, YC + 15], [XB, YC - 15], [XB, YT], SW_A]);
const S_LAMP = [GIRO.cum[2], GIRO.cum[3]], S_PILA = [GIRO.cum[6], GIRO.cum[7]];
const T_CH = 62.0, T_ARRIVO = 5.0, VF = S_LAMP[0] / T_ARRIVO;   // 1 m (704 px) in 5 s: un miliardo di volte più lento
const raggiunto = (s, t) => { const r = VF * Math.max(0, t - T_CH); return s <= r || s >= GIRO.L - r; };
const N_G = 54, PASSO_G = GIRO.L / N_G;
function sceneGiro(ctx, t) {
  const al = life(t, 45.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const tau = Math.max(0, t - T_CH), r = Math.min(GIRO.L / 2, VF * tau);
  // dove il campo è già arrivato, il filo si colora (lì c'è corrente)
  if (tau > 0) { tratto(ctx, GIRO, 0, r, C.v, 14, .3); tratto(ctx, GIRO, GIRO.L - r, GIRO.L, C.v, 14, .3); }
  const kf = P(t, 45.8, 47.0, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], SW_A], kf);
  filo(ctx, [SW_B, [XL, YT], [XL, YC - RL]], kf);
  filo(ctx, [[XB, YC + 15], [XB, YG], [XL, YG], [XL, YC + RL]], kf);
  lampadina(ctx, [XL, YC], RL, P(t, T_CH + T_ARRIVO, T_CH + T_ARRIVO + .15), P(t, 46.2, 46.7));
  interruttore(ctx, SW_A, SW_B, P(t, T_CH - .3, T_CH), P(t, 46.4, 46.9));
  pila(ctx, XB, YC, P(t, 46.0, 46.5));
  // gli elettroni: fermi (al rallentatore non si vede il loro moto); l'anello dice che si sono messi in moto
  const ke = P(t, 56.4, 57.2);
  for (let i = 0; i < N_G; i++) {
    const s = (i + .5) * PASSO_G;
    if (s > S_PILA[0] - 14 && s < S_PILA[1] + 14) continue;
    const p = puntoSu(GIRO, s), reach = raggiunto(s, t);
    const tr = s <= GIRO.L / 2 ? T_CH + s / VF : T_CH + (GIRO.L - s) / VF;
    let an = reach ? 1 - .5 * P(t, tr + .4, tr + 1.0) : 0;
    let col = C.v;
    const kLamp = life(t, 78.0, T_FINE + .1, .4, .4);
    if (kLamp > 0 && s > S_LAMP[0] - 10 && s < S_LAMP[1] + 10) { an = Math.max(an, kLamp); col = mix(C.v, C.g, kLamp); }
    elettrone(ctx, p, ke, 11, an, col);
  }
  // il fronte del campo
  if (tau > 0 && r < GIRO.L / 2) for (const s of [r, GIRO.L - r]) {
    const p = puntoSu(GIRO, s);
    const g = ctx.createRadialGradient(p[0], p[1], 2, p[0], p[1], 34);
    g.addColorStop(0, css(C.v, .9)); g.addColorStop(1, css(C.v, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 34, 0, TAU); ctx.fill();
  }
  // l'ipotesi: un elettrone parte dall'interruttore e la luce lo aspetta
  const kH = life(t, 50.9, 56.4, .4, .5);
  if (kH > 0) {
    // la strada che dovrebbe fare, accanto al filo, fino alla lampadina
    const strada = percorso([[SW_B[0], YT - 36], [XL + 36, YT - 36], [XL + 36, YC - RL]]);
    ctx.save(); ctx.globalAlpha *= kH; ctx.setLineDash([10, 8]);
    tratto(ctx, strada, 0, strada.L * P(t, 51.3, 53.0), C.r, 4);
    ctx.restore();
    elettrone(ctx, puntoSu(GIRO, 0.5 * PASSO_G), 1, 11, kH, C.r);
    fondo(ctx, 690, YT - 70, 220, 46, kH * P(t, 52.6, 53.2)); drawRich(ctx, '{r:≈ 3,8 ore?}', 690, YT - 70, { size: 34, alpha: kH * P(t, 52.6, 53.2) });
    crossMark(ctx, 830, YT - 70, P(t, 55.6, 56.2), C.r, .45);
  }
  const kM = P(t, 47.0, 47.5);
  txt(ctx, '1 m fino alla lampadina', 690, YT + 46, { size: 30, color: C.dim, alpha: kM * (1 - life(t, 50.9, 56.4, .4, .5)) });
  const kR = life(t, T_CH - .2, 72.5, .4, .4), kV = life(t, 72.5, T_FINE + .1, .4, .4);
  if (kR > 0) txt(ctx, 'al rallentatore: un miliardo di volte', 1085, 755, { size: 30, color: C.dim, align: 'right', alpha: kR });
  if (kV > 0) txt(ctx, 'tempo vero: si muovono tutti, piano', 1085, 755, { size: 30, color: C.dim, align: 'right', alpha: kV });
  ctx.restore();
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 29.7, () => {
    conFont(TITOLI, () => drawRich(ctx, 'un filo di rame', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:sezione} {mink:S} = 1 mm²', cx, 240, { size: 36, local: t - 10.6 });
    drawRich(ctx, '{dim:corrente} {mv:I} = 1 A', cx, 292, { size: 36, local: t - 13.4 });
    separa(ctx, 338, P(t, 13.3, 13.7));
    drawSeq(ctx, ['{mv:I} =', { num: 'Δ{mink:q}', den: 'Δ{mink:t}' }], cx, 410, 46, { local: t - 13.6 });
    drawRich(ctx, '{dim:ampere: 1 A = 1 C/s}', cx, 490, { size: 32, local: t - 15.0 });
    separa(ctx, 535, P(t, 18.5, 18.9));
    drawRich(ctx, '{dim:un elettrone:} {mink:1,6·10⁻¹⁹} C', cx, 585, { size: 36, local: t - 18.6 });
    drawRich(ctx, '1 C = {mink:6,25·10¹⁸} {dim:elettroni}', cx, 645, { size: 36, local: t - 20.6 });
    drawRich(ctx, '{g:elettroni liberi: tantissimi}', cx, 715, { size: 32, local: t - 25.6 });
  });
  blocco(29.7, 45.7, () => {
    conFont(TITOLI, () => drawRich(ctx, 'quanto vanno piano', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:in 1 mm di filo (1 mm³):}', cx, 240, { size: 32, local: t - 29.8 });
    drawRich(ctx, '{mink:8,5·10¹⁹} {dim:elettroni liberi}', cx, 292, { size: 36, local: t - 30.6 });
    separa(ctx, 340, P(t, 35.1, 35.5));
    drawSeq(ctx, ['{dim:avanzano di}', { num: '{mink:6,25·10¹⁸}', den: '{mink:8,5·10¹⁹}' }, 'mm'], cx, 412, 40, { local: t - 35.3 });
    drawRich(ctx, '≈ {g:0,07 mm} {dim:ogni secondo}', cx, 495, { size: 40, local: t - 37.0 });
    separa(ctx, 545, P(t, 40.7, 41.1));
    drawRich(ctx, '{dim:per 1 m:} 1000 mm / 0,0735 mm/s', cx, 600, { size: 32, local: t - 41.6 });
    drawRich(ctx, '≈ 13 600 s ≈ {g:3,8 ore}', cx, 665, { size: 42, local: t - 42.4 });
  });
  blocco(45.7, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il segnale', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:dall’interruttore alla lampadina:} 1 m', cx, 240, { size: 30, local: t - 47.0 });
    drawRich(ctx, '{r:aspettando gli elettroni:}', 1450, 300, { size: 32, local: t - 51.0 });
    drawRich(ctx, '{r:≈ 3,8 ore di buio}', 1450, 352, { size: 38, local: t - 52.6 });
    crossMark(ctx, 1730, 326, P(t, 56.4, 57.0), C.r, .45);
    separa(ctx, 400, P(t, 61.7, 62.1));
    drawRich(ctx, '{dim:il campo corre a ≈} {mink:2·10⁸} m/s', cx, 450, { size: 32, local: t - 62.4 });
    drawRich(ctx, '{dim:(la luce:} {mink:3·10⁸} m/s{dim:)}', cx, 500, { size: 30, local: t - 63.6 });
    drawRich(ctx, '1 m / ({mink:2·10⁸} m/s) = {mink:5·10⁻⁹} s', cx, 575, { size: 34, local: t - 68.0 });
    drawRich(ctx, '{g:5 miliardesimi di secondo}', cx, 630, { size: 36, local: t - 69.4 });
    separa(ctx, 680, P(t, 72.5, 72.9));
    drawRich(ctx, '{dim:poi nei fili ≈ 0,07 mm/s}', cx, 730, { size: 32, local: t - 72.8 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 92.8, 93.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Gli elettroni vanno pianissimo:\nla spinta arriva quasi subito.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{dim:deriva:} ≈ 0,07 mm/s\n{dim:1 A in 1 mm² di rame}'], [960, '{dim:campo:} ≈ {mink:2·10⁸} m/s\n{dim:quasi come la luce}'], [1470, 'gli elettroni partono\ntutti {g:insieme}']];
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
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Elettroni lenti, luce subito', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

  // effetti sonori (strumenti/suoni-sintesi.py): la deriva è lentissima e non suona; suona il campo che corre
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.0, 8.8], ['pop', 8.6, .5],                         // il filo ingrandito, gli elettroni
    ['pop', 10.6, .4],                                                                // la sezione S
    ['traccia', 13.5, 14.0], ['pop', 13.6, .6],                                       // I = 1 A, I = Δq/Δt
    ['pop', 18.6, .4], ['pop', 20.6, .6],                                             // 1,6·10⁻¹⁹ C, 6,25·10¹⁸ elettroni
    ['pop', 25.6, .5],                                                                // elettroni liberi: tantissimi
    ['soffio', 29.7], ['pop', 30.6, .6],                                              // 8,5·10¹⁹ in un millimetro
    ['pop', 35.3, .6], ['pop', 36.0, .5], ['traccia', 37.0, 37.3], ['ding', 37.0],    // l'elettrone seguito: 0,07 mm in 1 s
    ['pop', 41.6, .4], ['ding', 42.4],                                                // per 1 m: 3,8 ore
    ['soffio', 45.7], ['traccia', 45.8, 47.0], ['pop', 46.2, .6], ['pop', 46.4, .4],  // il circuito
    ['traccia', 51.3, 53.0], ['pop', 52.6, .3], ['traccia', 55.6, 56.2],              // l'ipotesi: 3,8 ore di buio, barrata
    ['pop', 56.6, .5],                                                                // il filo è già pieno di elettroni
    ['pop', 62.0, .7], ['tono', 62.0, 67.0, [.3, .7]], ['ding', 67.0],                // chiudo: il campo corre, la lampadina si accende
    ['pop', 68.0, .5], ['pop', 69.4, .7],                                             // 5 miliardesimi di secondo
    ['pop', 72.8, .4], ['pop', 78.0, .6],                                             // poi 0,07 mm/s; quelli nella lampadina
    ['soffio', 83.8], ['pop', 84.2, .6], ['pop', 85.8, .5], ['pop', 86.3, .6], ['pop', 86.8, .7],   // in una frase
  ];
  return {
    titolo: 'Elettroni lenti, luce subito', durata: 94.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 45.6, 'quanto vanno piano'], [45.6, T_FINE, 'perché la luce è subito']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneFilo(ctx, t); sceneGiro(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
