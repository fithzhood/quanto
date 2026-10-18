'use strict';
/* Il filo che sposta la bussola — l'esperimento di Oersted (1820): il filo sopra l'ago, parallelo; con la corrente
   l'ago si mette quasi di traverso (campo del filo 5 volte quello terrestre: 78,7° dal nord), invertita gira dall'altra
   parte. Poi il filo perpendicolare allo schermo (⊙ esce, ⊗ entra, definiti): le bussole attorno si dispongono in cerchio,
   le linee di campo sono cerchi chiusi, verso con la mano destra (pollice sulla corrente, le dita chiuse girano come B).
   B = μ₀·I/(2π·r), μ₀ = 4π·10⁻⁷ T·m/A: frecce di B lunghe in proporzione (150 px a r = 120 px con corrente I: a 2r la
   metà, con 2I il doppio); esempio 10 A a 2 cm: B = 10⁻⁴ T, circa il doppio del campo terrestre (≈ 5·10⁻⁵ T).
   Gli aghi ruotano con l'equazione del pendolo smorzato (integrata). Colori fissi del magnetismo: polo nord scuro, polo sud
   chiaro, campo B C.g, corrente convenzionale C.v. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/oersted', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 91.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.9, 'sorpreso'], [15.0, 'neutro'],
  [17.7, 'felice'], [19.8, 'neutro'], [26.7, 'felice'], [28.8, 'neutro'], [45.1, 'felice'], [47.2, 'neutro'],
  [55.9, 'sorpreso'], [58.0, 'neutro'], [66.5, 'felice'], [68.6, 'neutro'], [83.5, 'felice'], [85.6, 'neutro'],
  [93.2, 'felice'], [97.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Una corrente elettrica può\nmuovere l’ago di una bussola?'],
  [7.9, 12.6, 'Un filo passa sopra una bussola,\nparallelo al suo ago, verso nord.'],
  [12.7, 17.6, 'Chiudo il circuito: la corrente {mv:I}\nva verso nord, e l’ago {g:ruota}!'],
  [17.7, 22.2, 'Si mette quasi di traverso: la\ncorrente crea un {g:campo magnetico}.'],
  [22.3, 26.6, 'Inverto la corrente:\nl’ago gira dall’altra parte.'],
  [26.7, 30.6, 'È l’esperimento di {g:Oersted},\nnel 1820.'],
  [30.7, 35.2, 'Ora guardo un filo dritto\nche {g:esce} dallo schermo.'],
  [35.3, 40.4, 'Il cerchio col punto vuol dire «esce»:\nè la punta della freccia che arriva.'],
  [40.5, 45.0, 'Attorno metto tante bussole:\nsi dispongono in {g:cerchio}.'],
  [45.1, 50.0, 'Le linee di campo sono {g:cerchi}\nattorno al filo: chiuse.'],
  [50.1, 55.8, 'Il verso: pollice destro sulla corrente,\nle dita chiuse girano come {mg:B}.'],
  [55.9, 61.4, 'Se la corrente entra (cerchio con\nla croce, la coda), girano al contrario.'],
  [61.5, 66.4, 'Lontano dal filo è più debole:\na distanza doppia, {mg:B} è la {g:metà}.'],
  [66.5, 71.0, 'Con corrente doppia,\n{mg:B} {g:raddoppia}.'],
  [71.1, 77.8, 'In formula: {mg:B} = {mink:μ₀}·{mv:I} / (2{mink:π}·{mink:r}),\ncon {mink:μ₀} una costante e {mink:r} la distanza.'],
  [77.9, 83.4, 'La costante {mink:μ₀} («mi zero»)\nvale 4{mink:π}·10⁻⁷ T·m/A.'],
  [83.5, 90.6, 'Con 10 A a 2 cm: {mg:B} = 10⁻⁴ T,\ncirca il doppio di quello terrestre.'],
  [93.2, 99.4, 'Una corrente crea un campo magnetico:\ncerchi attorno al filo, deboli lontano.'],
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
// l'ago di una bussola: punta nord scura, coda sud chiara; con la cassa se cassa > 0
function ago(ctx, p, ang, s, al = 1, cassa = 0) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]);
  if (cassa > 0) {
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, cassa, 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.rotate(ang);
  const w = s * .2;
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = Math.max(1.5, s * .05); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(0, 0, Math.max(2.5, s * .07), 0, TAU); ctx.fill();
  ctx.restore();
}
// rotazione libera di un ago: θ'' = −ω0²·sin(θ − θf) − 2γ·θ', integrata una volta sola
function oscilla(th0, thF, w0, gam, dur) {
  const n = Math.ceil(dur * 240), tab = [th0]; let th = th0, om = 0;
  const dt = 1 / 960;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 4; j++) { const a = -w0 * w0 * Math.sin(th - thF) - 2 * gam * om; om += a * dt; th += om * dt; }
    tab.push(th);
  }
  return tau => { if (tau <= 0) return th0; const i = Math.min(tab.length - 1, tau * 240), i0 = Math.floor(i), i1 = Math.min(tab.length - 1, i0 + 1); return lerp(tab[i0], tab[i1], i - i0); };
}
const vicino = (a, rif) => { while (a - rif > Math.PI) a -= TAU; while (a - rif < -Math.PI) a += TAU; return a; };
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

const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];

// ---------- 1 · l'esperimento di Oersted, visto dall'alto (7,9–30,6) ----------
const CB = [560, 460], RB = 190;
const TH_N = -Math.PI / 2, TH_W = Math.atan2(-1, -5), TH_E = Math.atan2(-1, 5);   // campo del filo 5 volte quello terrestre
const GIRO1 = oscilla(TH_N, TH_W, TAU / 1.6, .85, 10), T1 = 12.9;
const GIRO2 = oscilla(TH_W, TH_E, TAU / 1.6, .85, 10), T2 = 22.6;
const angAgo = t => t < T2 ? GIRO1(t - T1) : GIRO2(t - T2);
function sceneOersted(ctx, t) {
  const al = life(t, 7.9, 31.0, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ago(ctx, CB, angAgo(t), 150, P(t, 7.9, 8.4), RB);
  txt(ctx, 'N', CB[0] + 34, CB[1] - RB + 30, { size: 30, weight: 600, color: C.dim, alpha: P(t, 8.2, 8.7) });
  // il filo, sopra la bussola, con l'interruttore in basso
  const kf = P(t, 8.2, 9.0);
  ctx.save(); ctx.globalAlpha *= kf; ctx.strokeStyle = css(mix(C.ink, C.paper, .1)); ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(CB[0], 130); ctx.lineTo(CB[0], 700); ctx.moveTo(CB[0], 752); ctx.lineTo(CB[0], 790); ctx.stroke();
  const chiuso = P(t, 12.7, 12.95), a = lerp(-.85, -Math.PI / 2, chiuso);
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(CB[0], 752); ctx.lineTo(CB[0] + 54 * Math.cos(a), 752 + 54 * Math.sin(a)); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(CB[0], 752, 8, 0, TAU); ctx.arc(CB[0], 700, 6, 0, TAU); ctx.fill();
  ctx.restore();
  txt(ctx, 'interruttore', CB[0] - 40, 726, { size: 30, color: C.dim, align: 'right', alpha: kf });
  // la corrente: prima verso nord, poi verso sud
  const kSu = life(t, 12.9, 22.6, .3, .2), kGiu = P(t, 22.7, 23.0);
  freccia(ctx, [CB[0] + 44, 252], [CB[0] + 44, 150], C.v, kSu, 7);
  freccia(ctx, [CB[0] + 44, 150], [CB[0] + 44, 252], C.v, kGiu, 7);
  drawRich(ctx, '{mv:I}', CB[0] + 84, 200, { size: 44, alpha: Math.max(kSu, kGiu) });
  // il nord geografico
  freccia(ctx, [1000, 430], [1000, 250], C.ink, kf, 5);
  txt(ctx, 'nord', 1000, 165, { size: 34, weight: 600, alpha: kf });
  txt(ctx, 'geografico', 1000, 207, { size: 30, color: C.dim, alpha: kf });
  ctx.restore();
}

// ---------- 2 · il filo perpendicolare allo schermo (30,7–86,8) ----------
const WC = [610, 450];
const T_INV = 56.2;   // la corrente si inverte: da ⊙ a ⊗
const versoI = t => lerp(1, -1, P(t, T_INV, T_INV + .4));
const ANELLI = [[105, 8, 22.5], [205, 8, 0], [330, 12, 15]];
const BUSSOLE = [];
ANELLI.forEach(([r, n, a0]) => { for (let k = 0; k < n; k++) {
  const a = (a0 + k * 360 / n) * Math.PI / 180, p = [WC[0] + r * Math.cos(a), WC[1] + r * Math.sin(a)];
  if (p[1] < 150 || p[1] > 760) continue;
  const thA = vicino(Math.atan2(-Math.cos(a), Math.sin(a)), TH_N);   // tangente in verso antiorario
  BUSSOLE.push({ p, giro1: oscilla(TH_N, thA, TAU / 1.4, 1.3, 8), giro2: oscilla(thA + .12, thA + Math.PI, TAU / 1.4, 1.3, 8) });
} });
const R_LINEE = [70, 140, 280];
const L0 = 150, R0 = 120;   // freccia di B: 150 px a 120 px dal filo, con la corrente I
function sceneFilo(ctx, t) {
  const al = life(t, 30.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const v = versoI(t), colB = mix(C.g, C.paper, .12);
  // le linee di campo: cerchi, con il verso (antiorario se la corrente esce)
  const kl = P(t, 45.3, 46.8), kp = P(t, 46.6, 47.1), sbiadL = 1 - .55 * P(t, 61.6, 62.2);
  R_LINEE.forEach(r => {
    if (kl <= 0) return;
    ctx.save(); ctx.globalAlpha *= sbiadL; ctx.strokeStyle = css(colB); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(WC[0], WC[1], r, -Math.PI / 2, -Math.PI / 2 - TAU * kl, true); ctx.stroke();
    // una punta in alto e una in basso; quando la corrente si inverte, cambiano verso
    for (const [ang, dir] of [[-Math.PI / 2, Math.PI], [Math.PI / 2, 0]]) {
      const p = [WC[0] + r * Math.cos(ang), WC[1] + r * Math.sin(ang)];
      const k1 = clamp((v + 1) / 2), k2 = clamp((1 - v) / 2);
      ctx.save(); ctx.globalAlpha *= kp * k1; arrowHead(ctx, p, dir, colB, .95); ctx.restore();
      ctx.save(); ctx.globalAlpha *= kp * k2; arrowHead(ctx, p, dir + Math.PI, colB, .95); ctx.restore();
    }
    ctx.restore();
  });
  // le bussole
  const kb = P(t, 40.6, 41.0), sbiadB = (1 - .65 * P(t, 45.3, 46.3)) * (1 - P(t, 61.5, 62.0));
  if (kb > 0 && sbiadB > 0) BUSSOLE.forEach(b => ago(ctx, b.p, t < T_INV ? b.giro1(t - 41.0) : b.giro2(t - T_INV), 27, kb * sbiadB));
  // il filo verticale ruota verso di me finché lo vedo di punta: la sua lunghezza apparente va come il coseno
  const phi = P(t, 30.9, 32.5) * Math.PI / 2, kRot = life(t, 30.8, 32.7, .3, .25);
  if (kRot > 0) {
    const Lp = 520 * Math.cos(phi), top = [WC[0], WC[1] - Lp / 2];
    ctx.save(); ctx.globalAlpha *= kRot; ctx.strokeStyle = css(mix(C.ink, C.paper, .1)); ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(WC[0], WC[1] + Lp / 2); ctx.lineTo(top[0], top[1]); ctx.stroke(); ctx.restore();
    freccia(ctx, [WC[0] + 44, WC[1] - Lp * .1], [WC[0] + 44, WC[1] - Lp * .1 - 100 * Math.cos(phi)], C.v, kRot, 7);
  }
  // il filo e la sua corrente
  const kw = P(t, 32.2, 32.7);
  simbolo(ctx, WC, 34, 1, C.v, kw * clamp((v + 1) / 2));
  simbolo(ctx, WC, 34, -1, C.v, kw * clamp((1 - v) / 2));
  const k2I = P(t, 66.6, 67.0) * (1 - P(t, 71.1, 71.5));
  const pI = [WC[0] - 74, WC[1] + 74];   // fra i cerchi di 70 e 140 px, fra due bussole
  fondo(ctx, pI[0], pI[1], lerp(46, 70, k2I), 48, kw);
  drawRich(ctx, '{mv:I}', pI[0], pI[1], { size: 44, alpha: kw * (1 - k2I) });
  drawRich(ctx, '{mv:2I}', pI[0], pI[1], { size: 44, alpha: kw * k2I });
  // 3 · quanto è intenso: B a r e a 2r, lungo in proporzione a I/r
  const kr = P(t, 61.7, 62.3);
  if (kr > 0) {
    const nI = 1 + k2I;
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const [r, y] of [[R0, 392], [2 * R0, 352]]) {
      ctx.beginPath(); ctx.moveTo(WC[0], y); ctx.lineTo(WC[0] + r, y); ctx.moveTo(WC[0], y - 10); ctx.lineTo(WC[0], y + 10); ctx.moveTo(WC[0] + r, y - 10); ctx.lineTo(WC[0] + r, y + 10); ctx.stroke();
    }
    ctx.restore();
    fondo(ctx, WC[0] + R0 / 2, 392, 50, 40, kr); drawRich(ctx, '{mink:r}', WC[0] + R0 / 2, 392, { size: 38, alpha: kr });
    fondo(ctx, WC[0] + R0 * 1.5, 352, 64, 40, kr); drawRich(ctx, '{mink:2r}', WC[0] + R0 * 1.5, 352, { size: 38, alpha: kr });
    for (const r of [R0, 2 * R0]) {
      const p = [WC[0] + r, WC[1]], L = L0 * nI * R0 / r;
      freccia(ctx, p, [p[0], p[1] - v * L], C.g, kr, 7);
      ctx.save(); ctx.globalAlpha *= kr; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, TAU); ctx.fill(); ctx.restore();
      fondo(ctx, p[0] + 40, p[1] - v * L / 2, 50, 50, kr); drawRich(ctx, '{mg:B}', p[0] + 40, p[1] - v * L / 2, { size: 40, alpha: kr });
    }
  }
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const s1 = life(t, 7.9, 30.7, .5, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    conFont(TITOLI, () => drawRich(ctx, 'l’esperimento di Oersted', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:un filo sopra l’ago, parallelo}', cx, 245, { size: 32, local: t - 8.1 });
    drawRich(ctx, '{dim:corrente} {mv:I} {dim:verso nord:}', cx, 320, { size: 34, local: t - 12.9 });
    drawRich(ctx, '{dim:l’ago si mette quasi di traverso}', cx, 368, { size: 32, local: t - 13.3 });
    drawRich(ctx, '{dim:la corrente crea un}', cx, 435, { size: 34, local: t - 17.8 });
    drawRich(ctx, '{g:campo magnetico}', cx, 483, { size: 38, local: t - 18.0 });
    separa(ctx, 535, P(t, 22.3, 22.7));
    drawRich(ctx, '{dim:corrente invertita:}', cx, 585, { size: 32, local: t - 22.4 });
    drawRich(ctx, '{dim:l’ago gira dall’altra parte}', cx, 630, { size: 32, local: t - 22.6 });
    drawRich(ctx, 'Hans Christian Oersted, 1820', cx, 712, { size: 32, local: t - 26.8 });
    ctx.restore();
  }
  const s2 = life(t, 30.7, 50.1, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'il filo visto di punta', cx, 175, { size: 40, weight: 600 }));
    const k1 = P(t, 35.4, 35.9);
    simbolo(ctx, [1265, 270], 26, 1, C.v, k1);
    drawRich(ctx, '{dim:esce dallo schermo:}', 1315, 252, { size: 32, align: 'left', alpha: k1 });
    drawRich(ctx, '{dim:la punta della freccia}', 1315, 292, { size: 32, align: 'left', alpha: k1 });
    separa(ctx, 345, P(t, 40.5, 40.9));
    drawRich(ctx, '{dim:le bussole si dispongono}', cx, 400, { size: 34, local: t - 40.6 });
    drawRich(ctx, '{g:in cerchio}', cx, 448, { size: 36, local: t - 40.9 });
    drawRich(ctx, '{dim:linee di campo:}', cx, 530, { size: 34, local: t - 45.2 });
    drawRich(ctx, '{g:cerchi chiusi} {dim:attorno al filo}', cx, 578, { size: 34, local: t - 45.4 });
    ctx.restore();
  }
  const s3 = life(t, 50.1, 61.5, .4, .4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    conFont(TITOLI, () => drawRich(ctx, 'regola della mano destra', cx, 175, { size: 40, weight: 600 }));
    manoPresa(ctx, 1390, 420, .95, P(t, 50.2, 50.8));
    drawRich(ctx, '{mv:I}', 1430, 238, { size: 40, alpha: P(t, 50.6, 51.0) });
    drawRich(ctx, '{mg:B}', 1515, 565, { size: 40, alpha: P(t, 50.8, 51.2) });
    drawRich(ctx, '{dim:pollice:}', 1555, 300, { size: 30, align: 'left', alpha: P(t, 51.0, 51.4) });
    drawRich(ctx, '{dim:la corrente} {mv:I}', 1555, 340, { size: 30, align: 'left', alpha: P(t, 51.0, 51.4) });
    drawRich(ctx, '{dim:dita chiuse:}', 1555, 410, { size: 30, align: 'left', alpha: P(t, 51.4, 51.8) });
    drawRich(ctx, '{dim:il verso di} {mg:B}', 1555, 450, { size: 30, align: 'left', alpha: P(t, 51.4, 51.8) });
    const k2 = P(t, 56.0, 56.5);
    simbolo(ctx, [1265, 700], 26, -1, C.v, k2);
    drawRich(ctx, '{dim:entra nello schermo: la coda}', 1315, 700, { size: 32, align: 'left', alpha: k2 });
    ctx.restore();
  }
  const s4 = life(t, 61.5, T_FINE + .1, .4, .5);
  if (s4 > 0) {
    ctx.save(); ctx.globalAlpha *= s4;
    conFont(TITOLI, () => drawRich(ctx, 'quanto è intenso', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:r}{dim:: distanza dal filo}', cx, 240, { size: 34, local: t - 61.6 });
    drawRich(ctx, '{dim:distanza doppia:} {mg:B} {dim:metà}', cx, 292, { size: 34, local: t - 63.0 });
    drawRich(ctx, '{dim:corrente doppia:} {mg:B} {dim:doppio}', cx, 344, { size: 34, local: t - 66.6 });
    separa(ctx, 392, P(t, 71.1, 71.5));
    drawSeq(ctx, ['{mg:B}{mink: =}', { num: '{mink:μ₀}·{mv:I}', den: '{mink:2π}·{mink:r}' }], cx, 470, 54, { local: t - 71.2 });
    drawRich(ctx, '{mink:μ₀ = 4π·10⁻⁷} T·m/A', cx, 570, { size: 40, local: t - 78.2 });
    separa(ctx, 620, P(t, 83.5, 83.9));
    drawRich(ctx, '10 A {dim:a} 2 cm{dim::} {mg:B = 10⁻⁴} T', cx, 670, { size: 36, local: t - 83.6 });
    drawRich(ctx, '{dim:campo della Terra ≈ 5·10⁻⁵ T}', cx, 728, { size: 30, local: t - 85.2 });
    ctx.restore();
  }
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il filo che sposta la bussola', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.5, 101.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La corrente crea un campo magnetico:\nlinee circolari attorno al filo.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mg:B} = {mink:μ₀}·{mv:I} / (2{mink:π}·{mink:r})\n{dim:più debole lontano}'], [960, '{dim:pollice sulla corrente,}\n{dim:le dita girano come} {mg:B}'], [1470, '{mink:μ₀ = 4π·10⁻⁷} T·m/A\n{mg:B} {dim:in tesla (T)}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): gli aghi sono simulati; il tono segue il loro angolo, rieseguendo
  // oscilla() (l'ago grande: verso ovest 0,2, nord 0,5, verso est 0,8; attorno al filo, la prima bussola del primo anello)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .45], ['pop', 8.4, .4],                             // la bussola, il filo
    ['pop', 12.8, .5], ['tono', 12.9, 15.1, [.5, .44, .3, .16, .07, .07, .13, .21, .26, .26, .24, .2]],   // chiudo: l'ago ruota
    ['ding', 18.1],                                                                   // un campo magnetico
    ['pop', 22.7, .45], ['tono', 22.6, 24.8, [.2, .22, .3, .44, .65, .86, .98, .99, .91, .8, .72, .71]],  // corrente invertita
    ['pop', 26.9, .4],                                                                // Oersted, 1820
    ['soffio', 30.8], ['tono', 30.9, 32.5, [.7, .7, .66, .4, .23, .2]],               // il filo ruota: lo vedo di punta
    ['pop', 32.3, .55], ['pop', 35.5, .4],                                            // esce dallo schermo
    ['pop', 40.7, .45], ['tono', 41.0, 42.5, [.05, .1, .16, .19, .17, .14, .14]],     // le bussole in cerchio
    ['traccia', 45.3, 46.8], ['pop', 46.7, .5],                                       // le linee: cerchi chiusi
    ['pop', 50.3, .5],                                                                // la mano destra
    ['pop', 56.1, .45], ['tono', 56.2, 57.7, [.18, .2, .26, .39, .65, .97, 1]],       // la corrente entra: girano al contrario
    ['traccia', 61.7, 62.3], ['pop', 61.9, .5], ['pop', 63.1, .45],                   // r e 2r: a distanza doppia, metà
    ['tono', 66.6, 67.0, [.4, .5, .7, .8]], ['pop', 66.7, .5],                        // corrente doppia: B doppio
    ['pop', 71.3, .6], ['ding', 71.7],                                                // B = μ₀·I/(2π·r)
    ['pop', 78.3, .45],                                                               // μ₀
    ['ding', 83.8], ['pop', 85.3, .35],                                               // 10⁻⁴ T; la Terra
    ['soffio', 91.0], ['pop', 93.2, .5], ['pop', 93.7, .6], ['pop', 94.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il filo che sposta la bussola', durata: 101.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.6, 'l’esperimento di Oersted'], [30.6, 61.4, 'le linee del campo'], [61.4, T_FINE, 'quanto è intenso']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneOersted(ctx, t); sceneFilo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
