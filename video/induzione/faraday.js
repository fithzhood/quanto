'use strict';
/* Corrente solo se cambia — la legge di Faraday-Neumann. Una spira (raggio a = 90 px ≙ 5 cm) collegata a un amperometro
   con lo zero al centro; una calamita a sbarra spinta lungo l'asse della spira. Il flusso nella spira è quello di un
   dipolo sull'asse: Φ(z) = Φ₀·(1 + z²/a²)^(−3/2), con Φ₀ = 0,4 mWb (calamita al centro della spira) e z la distanza
   del centro della calamita dalla spira. La mano muove la calamita con la legge x = x₀ ± D·(1 − cos(π·s))/2 (s da 0 a 1
   in d secondi: la velocità sale e scende come quella di una mano), D = 480 px ≙ 27 cm: piano in d = 2 s, in fretta in
   d = 0,5 s (quattro volte più in fretta: ε quattro volte più grande, stessa forma). ε = −dΦ/dt calcolata con la derivata
   esatta; l'ago (senza inerzia) e il grafico della corrente sono proporzionali a ε. Medie: ΔΦ = 0,4 − 0,0025 mWb,
   ε ≈ −0,2 mV in 2 s, ≈ −0,8 mV in 0,5 s. Il flusso in un campo uniforme: B = 0,4 T, S = 0,01 m², Φ = 4 mWb·cos θ;
   linee ogni 40 px, spira lunga 320 px: 8 linee a 0°, 4 a 60°, 0 a 90°. Colori fissi del magnetismo: nord C.ink pieno, sud chiaro col bordo scuro,
   campo B e flusso C.g, corrente C.v, f.e.m. C.y. Argomento: induzione. */
CVIDEO.registra('induzione/faraday', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));   // per i conti fatti al caricamento

const T_FINE = 98.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.0, 'sorpreso'], [21.0, 'neutro'],
  [24.5, 'felice'], [30.0, 'sorpreso'], [34.6, 'pensa'], [39.7, 'neutro'], [58.0, 'felice'],
  [62.4, 'neutro'], [70.5, 'sorpreso'], [75.4, 'felice'], [80.3, 'neutro'], [92.3, 'festa'],
  [95.0, 'felice'], [97.5, 'neutro'], [100.2, 'felice'], [104.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Una calamita {g:ferma} dentro una spira\nfa passare corrente?'],
  [7.9, 12.8, 'Una spira collegata a un amperometro\ncon lo zero al centro.'],
  [12.9, 16.4, 'La calamita ferma, lontana:\nl’ago sta sullo {g:zero}.'],
  [16.5, 20.9, 'La spingo piano dentro la spira:\nl’ago si {g:sposta}!'],
  [21.0, 24.4, 'Ferma dentro la spira:\n{r:nessuna} corrente.'],
  [24.5, 28.9, 'La tiro fuori: la corrente va\nnel verso {g:opposto}.'],
  [29.0, 34.4, 'Dentro e fuori, quattro volte più\nin fretta: l’ago si sposta {g:di più}.'],
  [34.6, 39.6, 'Che cosa cambia? Il {g:flusso} del campo\nmagnetico {mg:B} attraverso la spira.'],
  [39.7, 44.3, 'Il flusso conta le linee di campo\nche {g:attraversano} la spira.'],
  [44.4, 49.0, '{mg:Φ} = {mg:B}·{mink:S}·cos {mink:θ}: {mink:S} è l’area,\n{mink:θ} un angolo che vedremo.'],
  [49.1, 53.1, 'Si misura in weber (Wb):\n1 Wb = 1 T·m².'],
  [53.2, 57.9, 'Giro: {mink:θ} è l’angolo fra {mg:B}\ne la {g:perpendicolare} alla spira.'],
  [58.0, 62.3, 'A 60°: cos {mink:θ} = 0,5, metà delle\nlinee, {g:metà} flusso.'],
  [62.4, 65.4, 'A 90°: nessuna linea,\nflusso {g:zero}.'],
  [65.6, 70.4, 'Torno all’esperimento: ecco il flusso\nnella spira, istante per istante.'],
  [70.5, 75.3, 'Calamita ferma dentro: il flusso è\n{g:grande}, ma la corrente è {r:zero}.'],
  [75.4, 80.2, 'La corrente c’è solo mentre il flusso\ncambia: conta la {g:variazione}.'],
  [80.3, 85.6, 'Legge di Faraday-Neumann: la f.e.m.\nindotta è {my:ε} = −Δ{mg:Φ}/Δ{mink:t}.'],
  [85.7, 92.2, 'Entrando piano: 0,4 mWb in 2 s,\n{my:ε} ≈ −0,2 mV in media.'],
  [92.3, 98.6, 'In 0,5 s, quattro volte più in fretta:\n{my:ε} ≈ −0,8 mV, il quadruplo.'],
  [100.2, 106.2, 'Non conta quanto flusso c’è, ma quanto\nin fretta {g:cambia}: {my:ε} = −Δ{mg:Φ}/Δ{mink:t}.'],
];

// ---------- la fisica: tutto viene da qui ----------
const A = 90, XS = 340, XL = 820, YA = 400, D = XL - XS, PHI0 = 0.40;   // px, px, px, px, mWb
const MOSSE = [[17.0, 2.0, 1], [25.0, 2.0, -1], [29.5, .5, 1], [31.5, .5, -1]];   // [inizio, durata, verso]
function xMag(t) {
  let x = XS;
  for (const [t0, d, s] of MOSSE) { const k = cl((t - t0) / d, 0, 1); x += s * D * (1 - Math.cos(Math.PI * k)) / 2; }
  return x;
}
function vMag(t) {   // px/s
  let v = 0;
  for (const [t0, d, s] of MOSSE) { const k = (t - t0) / d; if (k > 0 && k < 1) v += s * D * Math.PI / (2 * d) * Math.sin(Math.PI * k); }
  return v;
}
const flusso = t => { const u = (XL - xMag(t)) / A; return PHI0 * Math.pow(1 + u * u, -1.5); };           // mWb
// ε = −dΦ/dt = −(dΦ/dz)·(dz/dt), con z = XL − x, dz/dt = −v
const fem = t => { const z = XL - xMag(t), u = z / A; const dPdz = -3 * PHI0 * z / (A * A) * Math.pow(1 + u * u, -2.5); return -(dPdz * -vMag(t)); };   // mV
const EPS_MAX = (() => { let m = 0; for (let t = 29.5; t <= 30.0; t += .0005) m = Math.max(m, Math.abs(fem(t))); return m; })();

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
function separa(ctx, y, a, x0 = 1190, x1 = 1770) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
const COL_B = () => mix(C.g, C.paper, .12);
function linea(ctx, pts, col, w = 5, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
// la calamita a sbarra orizzontale, centrata in (cx, cy): a sinistra il sud, a destra il nord
function calamita(ctx, cx, cy, L, h, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(cx - L / 2, cy - h / 2, L, h, 10); ctx.save(); ctx.clip();
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.fillRect(cx - L / 2, cy - h / 2, L / 2, h);
  ctx.fillStyle = css(C.ink); ctx.fillRect(cx, cy - h / 2, L / 2, h);
  ctx.restore();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  txt(ctx, 'S', cx - L / 4, cy + 2, { size: 40, weight: 600, color: C.ink, alpha: al });
  txt(ctx, 'N', cx + L / 4, cy + 2, { size: 40, weight: 600, color: C.paper, alpha: al });
}
// mezza spira vista di sbieco: davanti = metà sinistra dell'ellisse, dietro = metà destra
function mezzaSpira(ctx, davanti, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(C.ink, C.y, .35)); ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath();
  if (davanti) ctx.ellipse(XL, YA, 30, A, 0, Math.PI / 2 + .06, 3 * Math.PI / 2);
  else ctx.ellipse(XL, YA, 30, A, 0, -Math.PI / 2, Math.PI / 2 - .06);
  ctx.stroke(); ctx.restore();
}

// ---------- 1 · l'esperimento (7,8–34,5) ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const GAL = [820, 742], RG = 112;   // perno e raggio del quadrante dell'amperometro
function amperometro(ctx, defl, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(690, 590, 260, 180, 16); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(GAL[0], GAL[1], RG, -Math.PI / 2 - 1.45, -Math.PI / 2 + 1.45); ctx.stroke();
  for (let k = -5; k <= 5; k++) {
    const a = -Math.PI / 2 + k * 16 * Math.PI / 180, r0 = k === 0 ? RG - 22 : RG - 12;
    ctx.lineWidth = k === 0 ? 4 : 2.5;
    ctx.beginPath(); ctx.moveTo(GAL[0] + r0 * Math.cos(a), GAL[1] + r0 * Math.sin(a)); ctx.lineTo(GAL[0] + RG * Math.cos(a), GAL[1] + RG * Math.sin(a)); ctx.stroke();
  }
  const a = -Math.PI / 2 + defl;
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(GAL[0], GAL[1]); ctx.lineTo(GAL[0] + (RG - 8) * Math.cos(a), GAL[1] + (RG - 8) * Math.sin(a)); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(GAL[0], GAL[1], 9, 0, TAU); ctx.fill();
  ctx.restore();
}
const angoloAgo = t => 78 * Math.PI / 180 * fem(t) / EPS_MAX;   // piano ≈ 19,5°, in fretta 78°
function sceneEsperimento(ctx, t) {
  const al = life(t, 7.8, 34.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kc = P(t, 8.0, 9.2);
  // i fili: dal fondo della spira all'amperometro
  linea(ctx, [[XL - 8, YA + A - 2], [XL - 8, 540], [760, 540], [760, 590]], C.ink, 5, kc);
  linea(ctx, [[XL + 8, YA + A - 2], [XL + 8, 540], [880, 540], [880, 590]], C.ink, 5, kc);
  mezzaSpira(ctx, false, kc);
  const km = P(t, 12.9, 13.4);
  calamita(ctx, xMag(t), YA, 220, 70, km);
  mezzaSpira(ctx, true, kc);
  amperometro(ctx, angoloAgo(t), P(t, 8.6, 9.2));
  txt(ctx, 'spira', XL + 70, YA - A - 10, { size: 32, color: C.dim, align: 'left', alpha: P(t, 8.4, 8.9) });
  txt(ctx, 'amperometro', 670, 680, { size: 30, color: C.dim, align: 'right', alpha: P(t, 8.8, 9.3) });
  txt(ctx, 'zero al centro', 670, 722, { size: 28, color: C.dim, align: 'right', alpha: P(t, 9.0, 9.5) });
  ctx.restore();
}
// nella parte 3 l'esperimento torna, fermo: la calamita dentro, l'ago a zero
function sceneEsperimentoFermo(ctx, t) {
  const al = life(t, 65.6, 80.4, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  linea(ctx, [[XL - 8, YA + A - 2], [XL - 8, 540], [760, 540], [760, 590]], C.ink, 5);
  linea(ctx, [[XL + 8, YA + A - 2], [XL + 8, 540], [880, 540], [880, 590]], C.ink, 5);
  mezzaSpira(ctx, false, 1); calamita(ctx, XL, YA, 220, 70, 1); mezzaSpira(ctx, true, 1);
  amperometro(ctx, 0, 1);
  txt(ctx, 'calamita ferma dentro', 400, 220, { size: 32, color: C.dim, alpha: P(t, 70.6, 71.1) });
  ctx.restore();
}

// ---------- i grafici (a destra): la corrente durante l'esperimento, poi anche il flusso ----------
const T0G = 13.0, T1G = 34.4, GX0 = 1215, GX1 = 1765;
const tg = s => GX0 + (s - T0G) / (T1G - T0G) * (GX1 - GX0);
const GP0 = 380, gp = f => GP0 - 150 * f / PHI0;          // il flusso (mWb)
const GI0 = 600, gi = e => GI0 - 160 * e / EPS_MAX;       // la corrente, proporzionale a ε
function traccia(ctx, f, s1, y, col, w = 4.5) {
  if (s1 <= T0G) return;
  const n = Math.max(2, Math.ceil((s1 - T0G) * 160));
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= n; i++) { const s = T0G + (s1 - T0G) * i / n, p = [tg(s), y(f(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
  ctx.stroke(); ctx.restore();
}
function assi(ctx, y0, ytop, ybot, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, y0); ctx.lineTo(GX1 + 10, y0); ctx.moveTo(GX0, ybot); ctx.lineTo(GX0, ytop); ctx.stroke();
  arrowHead(ctx, [GX1 + 16, y0], 0, C.ink); arrowHead(ctx, [GX0, ytop - 6], -Math.PI / 2, C.ink);
  ctx.restore();
  drawRich(ctx, '{mink:t}', GX1 + 14, y0 + 30, { size: 34, alpha: al });
}
function fascia(ctx, a, b, y0, y1, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col, .16); ctx.fillRect(tg(a), y0, tg(b) - tg(a), y1 - y0); ctx.restore();
}
function sceneGrafici(ctx, t) {
  const a1 = life(t, 12.8, 34.6, .5, .5), a3 = life(t, 65.6, T_FINE + .1, .5, .5), al = Math.max(a1, a3);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // la corrente: nella parte 1 si traccia mentre succede, nella parte 3 è già tutta
  txt(ctx, 'la corrente, istante per istante', 1490, 175, { size: 32, weight: 600, alpha: a1 });
  assi(ctx, GI0, 440, 772, 1);
  drawRich(ctx, '{mv:I}', GX0 + 18, 436, { size: 36, align: 'left' });
  const s1 = t < 40 ? Math.min(t, T1G) : T1G;
  // le fasce della parte 3: ferma dentro (verde), mentre si muove (viola), i due passaggi delle medie
  const kFerma = life(t, 70.6, 75.4, .4, .4);
  fascia(ctx, 19.0, 25.0, 196, 772, C.g, kFerma);
  const kMuove = life(t, 75.5, 80.3, .4, .4);
  for (const [a, d] of [[17, 2], [25, 2], [29.5, .5], [31.5, .5]]) fascia(ctx, a, a + d, 196, 772, C.v, kMuove);
  fascia(ctx, 17.0, 19.0, 196, 772, C.y, life(t, 85.8, 92.3, .4, .4));
  fascia(ctx, 29.5, 30.0, 196, 772, C.y, life(t, 92.4, 98.7, .4, .4));
  traccia(ctx, fem, s1, gi, C.v);
  if (a1 > 0 && t < 34.5) { ctx.save(); ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(tg(s1), gi(fem(s1)), 8, 0, TAU); ctx.fill(); ctx.restore(); }
  // il flusso (parte 3)
  const kP = P(t, 65.8, 66.3);
  if (kP > 0 && t > 60) {
    ctx.save(); ctx.globalAlpha *= kP;
    assi(ctx, GP0, 196, GP0 + 4, 1);
    drawRich(ctx, '{mg:Φ} {dim:(mWb)}', GX0 + 18, 188, { size: 32, align: 'left' });
    ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(GX0, gp(PHI0)); ctx.lineTo(GX1, gp(PHI0)); ctx.stroke(); ctx.restore();
    txt(ctx, '0,4', GX0 - 10, gp(PHI0), { size: 29, color: C.dim, align: 'right' });
    traccia(ctx, flusso, lerp(T0G, T1G, P(t, 66.2, 68.6, E.lin)), gp, C.g, 5);
    // le parentesi della media: ΔΦ e Δt, entrando piano
    const kD = life(t, 85.8, 92.3, .4, .4);
    if (kD > 0) {
      ctx.save(); ctx.globalAlpha *= kD; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(tg(17), GP0 + 14); ctx.lineTo(tg(19), GP0 + 14); ctx.stroke(); ctx.restore();
      drawRich(ctx, 'Δ{mink:t} = 2 s', tg(18), GP0 + 46, { size: 30, alpha: kD });
      // fra la salita e la discesa: 160 px, il nome su due righe
      drawRich(ctx, 'Δ{mg:Φ} =', tg(19) + 14, gp(.27), { size: 30, align: 'left', alpha: kD });
      drawRich(ctx, '0,4 mWb', tg(19) + 14, gp(.27) + 40, { size: 30, align: 'left', alpha: kD });
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · il flusso (34,6–65,5) ----------
const OF = [610, 400], LS = 160, LINEE_Y = [];
for (let j = 0; j < 7; j++) LINEE_Y.push(OF[1] - 20 - 40 * j, OF[1] + 20 + 40 * j);
const thetaDeg = t => 60 * P(t, 53.3, 54.5) + 30 * P(t, 62.5, 63.5);
function sceneFlusso(ctx, t) {
  const al = life(t, 34.8, 65.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const th = thetaDeg(t) * Math.PI / 180, mezza = LS * Math.cos(th);
  const kl = P(t, 35.0, 36.4, E.lin), kSel = P(t, 39.8, 40.4);
  // le linee del campo uniforme: piene quelle che attraversano la spira
  LINEE_Y.forEach((y, i) => {
    const passa = Math.abs(y - OF[1]) < mezza - 1, a = passa ? 1 : 1 - .65 * kSel;
    const k = cl(kl * 1.6 - i * .04, 0, 1); if (k <= 0) return;
    linea(ctx, [[150, y], [lerp(150, 1070, k), y]], COL_B(), passa ? 3.5 + 1.5 * kSel : 3.5, a);
    if (k >= 1) for (const x of [250, 990]) { ctx.save(); ctx.globalAlpha *= a; arrowHead(ctx, [x, y], 0, COL_B(), .85); ctx.restore(); }
  });
  fondo(ctx, 1010, OF[1], 46, 36, P(t, 36.2, 36.7)); drawRich(ctx, '{mg:B}', 1010, OF[1], { size: 36, alpha: P(t, 36.2, 36.7) });
  txt(ctx, 'la spira, vista di taglio', OF[0], 702, { size: 30, color: C.dim, alpha: life(t, 35.8, 44.4, .5, .5) });
  // la spira di taglio
  const ks = P(t, 35.6, 36.2), d = [Math.sin(th), Math.cos(th)];
  const pa = [OF[0] - LS * d[0], OF[1] - LS * d[1]], pb = [OF[0] + LS * d[0], OF[1] + LS * d[1]];
  linea(ctx, [pa, pb], mix(C.ink, C.y, .35), 10, ks);
  // la perpendicolare e l'angolo θ (dalla direzione di B)
  const kn = P(t, 53.2, 53.7);
  if (kn > 0) {
    const n = [Math.cos(th), -Math.sin(th)];
    ctx.save(); ctx.globalAlpha *= kn; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([9, 8]);
    ctx.beginPath(); ctx.moveTo(OF[0], OF[1]); ctx.lineTo(OF[0] + 230, OF[1]); ctx.stroke(); ctx.restore();
    freccia(ctx, OF, [OF[0] + 230 * n[0], OF[1] + 230 * n[1]], C.ink, kn, 5);
    if (th > .05) {
      ctx.save(); ctx.globalAlpha *= kn; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(OF[0], OF[1], 95, -th, 0); ctx.stroke(); ctx.restore();
      // l'etichetta sta fra due linee di campo (le linee sono a OF[1] ± 20, ± 60…, i vuoti a OF[1] − 40·k)
      const am = th / 2, lx = OF[0] + 135 * Math.cos(am), ly = OF[1] - 40 * Math.round((135 * Math.sin(am)) / 40);
      fondo(ctx, lx, ly, 34, 34, kn); drawRich(ctx, '{mink:θ}', lx, ly, { size: 34, alpha: kn });
    }
  }
  // quante linee la attraversano
  const nl = LINEE_Y.filter(y => Math.abs(y - OF[1]) < mezza - 1).length, kc = P(t, 40.0, 40.5);
  txt(ctx, 'linee che attraversano la spira:', 760, 738, { size: 32, align: 'right', alpha: kc });
  fixedNum(ctx, String(nl), 812, 738, 44, C.g, kc);
  ctx.restore();
}
function scenePannelloFlusso(ctx, t) {
  const al = life(t, 34.8, 65.6, .5, .5);
  if (al <= 0) return;
  const cx = 1480, th = thetaDeg(t);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'il flusso', cx, 170, { size: 40, weight: 600, local: t - 34.9 }));
  drawRich(ctx, '{dim:del campo} {mg:B} {dim:attraverso la spira}', cx, 224, { size: 32, local: t - 35.2 });
  separa(ctx, 266, P(t, 44.4, 44.8));
  drawRich(ctx, '{mg:Φ} = {mg:B}·{mink:S}·cos {mink:θ}', cx, 328, { size: 54, local: t - 44.5 });
  drawRich(ctx, '{mg:B} = 0,4 T    {mink:S} = 0,01 m²', cx, 402, { size: 36, local: t - 45.6 });
  separa(ctx, 444, P(t, 49.1, 49.5));
  drawRich(ctx, '{dim:si misura in} weber {dim:(Wb)}', cx, 488, { size: 34, local: t - 49.2 });
  drawRich(ctx, '1 Wb = 1 T·m²   {dim:1 mWb = 0,001 Wb}', cx, 540, { size: 34, local: t - 50.0 });
  separa(ctx, 584, P(t, 53.1, 53.5));
  const kv = P(t, 53.2, 53.7);
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv;
    drawRich(ctx, '{mink:θ} =', 1300, 638, { size: 40, align: 'left' });
    txt(ctx, Math.round(th) + '°', 1500, 638, { size: 44, weight: 600, align: 'right' });
    drawRich(ctx, '{mg:Φ} =', 1300, 712, { size: 40, align: 'left' });
    fixedNum(ctx, fmtN(Math.abs(4 * Math.cos(th * Math.PI / 180)), 1), 1500, 712, 44, C.g); txt(ctx, 'mWb', 1512, 712, { size: 36, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · la legge (80,3–96) ----------
function sceneLegge(ctx, t) {
  const al = life(t, 80.2, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  const cx = 610;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'legge di Faraday-Neumann', cx, 180, { size: 44, weight: 600, local: t - 80.3 }));
  drawSeq(ctx, ['{my:ε} = −', { num: 'Δ{mg:Φ}', den: 'Δ{mink:t}' }], cx, 305, 72, { local: t - 80.8 });
  drawRich(ctx, '{my:ε}{dim:: forza elettromotrice (f.e.m.) indotta}', cx, 420, { size: 32, local: t - 81.6 });
  drawRich(ctx, '{dim:il segno meno dà il verso della corrente}', cx, 466, { size: 30, local: t - 82.6 });
  separa(ctx, 512, P(t, 85.7, 86.1), 170, 1050);
  drawRich(ctx, '{dim:piano:} 0,4 mWb {dim:in} 2 s  →  {my:ε} ≈ −0,2 mV', cx, 572, { size: 38, local: t - 85.8 });
  drawRich(ctx, '{dim:in fretta:} 0,4 mWb {dim:in} 0,5 s  →  {my:ε} ≈ −0,8 mV', cx, 648, { size: 38, local: t - 92.4 });
  drawRich(ctx, '{dim:1 mV = 0,001 V}', cx, 722, { size: 30, local: t - 86.8 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Corrente solo se cambia', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.6, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 107.4, 108.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Non conta quanto flusso c’è,\nma quanto in fretta {g:cambia}.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mg:Φ} = {mg:B}·{mink:S}·cos {mink:θ}\n{dim:in weber}'], [960, '{my:ε} = −Δ{mg:Φ}/Δ{mink:t}\n{dim:Faraday-Neumann}'], [1470, 'calamita ferma:\n{r:nessuna} corrente']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): nell'esperimento il tono segue l'ago (la corrente, proporzionale a ε),
  // da tutto a sinistra (0) a tutto a destra (1), zero = 0,5; nel grafico del flusso e nella rotazione segue Φ, da 0 (0)
  // al massimo (1). Gli istanti vengono da fem(t), flusso(t) e thetaDeg(t)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.6, .5],                                                // la spira, l'amperometro
    ['soffio', 12.6], ['pop', 12.9, .5],                                              // il grafico; la calamita, ferma
    ['tono', 18.0, 19.0, [.49, .49, .47, .45, .42, .38, .38, .43, .48, .5, .5]],      // entra piano: l'ago va a sinistra
    ['tono', 25.0, 26.0, [.5, .5, .52, .58, .62, .62, .58, .55, .53, .52, .51]],      // esce piano: verso opposto
    ['tono', 29.75, 30.0, [.46, .43, .38, .29, .15, .03, .03, .2, .39, .49, .5]],     // dentro, quattro volte più in fretta
    ['tono', 31.5, 31.75, [.5, .52, .61, .81, .98, .98, .85, .72, .63, .57, .54]],    // e fuori
    ['soffio', 34.8], ['traccia', 35.0, 36.4], ['pop', 35.6, .45], ['pop', 36.2, .6], // il flusso: le linee di B, la spira di taglio
    ['pop', 40.0, .6],                                                                // 8 linee attraversano la spira
    ['pop', 44.5, .5], ['pop', 45.6, .45], ['pop', 49.2, .4], ['pop', 50.0, .45],     // Φ = B·S·cos θ, i valori, il weber
    ['pop', 53.2, .5], ['tono', 53.3, 54.5, [1, 1, .87, .56, .5]], ['ding', 54.6],    // giro a 60°: metà flusso
    ['tono', 62.5, 63.5, [.5, .47, .26, .03, 0]], ['ding', 63.6],                     // a 90°: flusso zero
    ['soffio', 65.6], ['pop', 65.8, .5], ['traccia', 66.2, 68.6],                     // l'esperimento torna: il flusso, istante per istante
    ['tono', 66.2, 68.6, [.01, .01, .01, .01, .01, .01, .24, 1, 1, 1, 1, 1, 1, 1, .53, .01, .01, .01, .01, .95, 1, .07, .01, .01, .01]],
    ['pop', 70.6, .5], ['pop', 75.5, .55],                                            // ferma dentro: zero; la corrente solo mentre cambia
    ['soffio', 80.2], ['pop', 80.8, .6], ['pop', 85.8, .4],                           // ε = −ΔΦ/Δt; piano: −0,2 mV
    ['soffio', 99.0], ['pop', 101.0, .5], ['pop', 101.5, .6], ['pop', 102.0, .7],     // in una frase
  ];
  return {
    titolo: 'Corrente solo se cambia', durata: 109, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.4, 'l’esperimento'], [34.4, 65.4, 'il flusso'], [65.4, T_FINE, 'conta la variazione']],
    scena(ctx, t) {
      sceneIntro(ctx, t); sceneSchede(ctx, t); sceneEsperimento(ctx, t); sceneEsperimentoFermo(ctx, t); sceneGrafici(ctx, t);
      sceneFlusso(ctx, t); scenePannelloFlusso(ctx, t); sceneLegge(ctx, t); sceneFine(ctx, t);
    },
  };
});
