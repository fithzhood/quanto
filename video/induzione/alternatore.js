'use strict';
/* La corrente alternata — l'alternatore. Una spira rettangolare fra i poli di due calamite (campo B uniforme), vista
   lungo l'asse di rotazione: gira a velocità angolare costante, θ = ω·t, con θ l'angolo fra B e la perpendicolare
   alla spira. Al rallentatore 100 volte: sullo schermo mezzo giro al secondo (ω = π rad/s), dal vero 50 giri al secondo
   (ω = 2π·50 ≈ 314 rad/s), periodo 0,02 s. Φ = B·S·cos(ω·t), ε = −dΦ/dt = ε₀·sin(ω·t) con ε₀ = N·B·S·ω: i grafici sono
   calcolati da queste formule, con il tempo vero sull'asse (il cursore segue la spira). Due fermi immagine: a θ = 90°
   (flusso zero, ε massima) e a θ = 360° (flusso massimo, ε zero). Il verso della corrente nei lati: per il
   lato A (che gira in senso antiorario sullo schermo) la forza di Lorentz sulle cariche entra nello schermo quando sin θ > 0, quindi con ε > 0 il
   lato A ha ⊗ e il lato B ⊙. Le prese: V = 325 V·sin(2π·50·t), efficace 325/√2 ≈ 230 V. Colori fissi del magnetismo:
   nord C.ink pieno, sud chiaro col bordo scuro, campo B e flusso C.g, corrente C.v, f.e.m. e tensione C.y. Argomento: induzione. */
CVIDEO.registra('induzione/alternatore', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 81.7;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.6, 'felice'], [25.5, 'neutro'],
  [33.6, 'sorpreso'], [40.2, 'pensa'], [45.3, 'felice'], [50.5, 'neutro'], [55.9, 'sorpreso'], [61.1, 'neutro'],
  [66.3, 'pensa'], [71.0, 'felice'], [76.2, 'neutro'], [84.1, 'felice'], [88.3, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Da dove viene la corrente\nalternata delle prese?'],
  [7.9, 12.6, 'Fra i poli di due calamite il campo\nmagnetico {mg:B} è {g:uniforme}.'],
  [12.7, 17.6, 'Una spira gira a velocità costante:\nla guardo di taglio, lungo l’asse.'],
  [17.7, 22.5, '{mink:θ}, angolo fra {mg:B} e la perpendicolare,\ncresce uniforme: {mink:θ} = {mink:ω}·{mink:t}.'],
  [22.6, 28.2, '{mg:Φ} = {mg:B}·{mink:S}·cos {mink:θ}, con {mink:S} l’area\ndella spira: va su e giù, un {g:coseno}.'],
  [28.3, 33.6, 'Per Faraday-Neumann è un {g:seno}:\n{my:ε} = {my:ε₀}·sin({mink:ω}·{mink:t}), {my:ε₀} il massimo.'],
  [33.6, 38.6, 'Qui il flusso è zero, ma la f.e.m.\nè {g:massima}: cambia più in fretta.'],
  [40.2, 45.2, 'Qui il flusso è massimo, ma per\nun attimo non cambia: f.e.m. {g:zero}.'],
  [45.3, 50.4, 'Ogni mezzo giro la corrente cambia\nverso: è una corrente {g:alternata}.'],
  [50.5, 55.8, 'Con {mink:N} spire, {my:ε₀} = {mink:N}·{mg:B}·{mink:S}·{mink:ω}:\npiù in fretta gira, più tensione.'],
  [55.9, 61.0, 'Qui è rallentata cento volte: nelle\ncentrali fa {g:50 giri al secondo}.'],
  [61.1, 66.2, 'Un giro in 0,02 s: la frequenza\nè {mink:f} = 50 Hz (hertz).'],
  [66.3, 70.9, 'Nelle prese la tensione arriva\na un picco di circa 325 V…'],
  [71.0, 76.1, '…ma si dice {g:230 V}: è il valore\n{g:efficace}, 325 V diviso √2.'],
  [76.2, 81.3, '230 V costanti scalderebbero una\nstufa {g:quanto} questa tensione alternata.'],
  [84.1, 90.3, 'Una spira che gira nel campo dà una\ntensione sinusoidale: 50 Hz nelle prese.'],
];

// ---------- la rotazione: velocità costante, con due fermi immagine ----------
const OMD = Math.PI, RALL = 100;                 // rad/s sullo schermo; rallentamento
function tMoto(t) {   // secondi di moto sullo schermo
  if (t < 13.0) return 0;
  if (t < 33.5) return t - 13.0;                 // a 33,5: θ = 20,5·π → 90° (dopo 10 giri)
  if (t < 38.7) return 20.5;
  if (t < 40.2) return 20.5 + (t - 38.7);        // un secondo e mezzo: da 90° a 360°
  if (t < 45.2) return 22.0;
  return 22.0 + (t - 45.2);
}
const fermo = t => (t >= 33.5 && t < 38.7) || (t >= 40.2 && t < 45.2);
const theta = t => OMD * tMoto(t);
const fase = t => (tMoto(t) % 4) / RALL;         // secondi veri dentro i due giri del grafico (0…0,04 s)
const W50 = TAU * 50;                            // rad/s veri

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
const COL_B = () => mix(C.g, C.paper, .12);
// un filo visto di taglio: puntino (la corrente esce dallo schermo) o crocetta (entra)
function filoTaglio(ctx, p, r, kOut, kIn, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  if (kOut > 0) { ctx.save(); ctx.globalAlpha *= kOut; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(p[0], p[1], r * .3, 0, TAU); ctx.fill(); ctx.restore(); }
  if (kIn > 0) {
    ctx.save(); ctx.globalAlpha *= kIn; ctx.strokeStyle = css(C.v); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
    const a = r * .5; ctx.beginPath(); ctx.moveTo(p[0] - a, p[1] - a); ctx.lineTo(p[0] + a, p[1] + a); ctx.moveTo(p[0] + a, p[1] - a); ctx.lineTo(p[0] - a, p[1] + a); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la spira fra i poli (sinistra) ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const O = [610, 450], RS = 180, RF = 26;
const YL = [170, 250, 330, 410, 490, 570, 650, 730];   // linee di B: nessuna passa per l'asse
function sceneSpira(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kp = P(t, 7.9, 8.5);
  // i poli come in magnetismo/calamite: N scuro con lettera chiara, S chiaro con bordo e lettera scuri
  for (const [x0, nome] of [[140, 'N'], [930, 'S']]) {
    ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(nome === 'N' ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x0, 150, 150, 600, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, nome, x0 + 75, 452, { size: 72, weight: 600, color: nome === 'N' ? C.paper : C.ink, alpha: kp });
  }
  const kl = P(t, 8.4, 9.8, E.lin);
  ctx.save(); ctx.strokeStyle = css(COL_B()); ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  YL.forEach((y, i) => { const k = clamp(kl * 1.6 - i * .08); if (k <= 0) return; ctx.beginPath(); ctx.moveTo(290, y); ctx.lineTo(lerp(290, 930, k), y); ctx.stroke(); });
  ctx.restore();
  const kf = P(t, 9.6, 10.1);
  if (kf > 0) YL.forEach(y => { for (const x of [345, 885]) { ctx.save(); ctx.globalAlpha *= kf; arrowHead(ctx, [x, y], 0, COL_B(), .9); ctx.restore(); } });
  fondo(ctx, 333, 290, 50, 46, P(t, 10.0, 10.5)); drawRich(ctx, '{mg:B}', 333, 290, { size: 44, alpha: P(t, 10.0, 10.5) });
  // la spira di taglio: lato A = O + RS·(sin θ, cos θ), lato B opposto; la perpendicolare n = (cos θ, −sin θ)
  const ks = P(t, 12.8, 13.3);
  if (ks > 0) {
    const th = theta(t), d = [Math.sin(th), Math.cos(th)], A = [O[0] + RS * d[0], O[1] + RS * d[1]], Bp = [O[0] - RS * d[0], O[1] - RS * d[1]];
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bp[0], Bp[1]); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(O[0], O[1], 8, 0, TAU); ctx.fill(); ctx.restore();
    // la perpendicolare e l'angolo θ: mentre se ne parla e nei fermi immagine
    const kn = life(t, 17.8, 23.0, .4, .4) + life(t, 33.6, 38.6, .4, .3) + life(t, 40.2, 45.2, .3, .4);
    if (kn > 0) {
      const n = [Math.cos(th), -Math.sin(th)];
      let thm = ((th % TAU) + TAU) % TAU; if (thm > TAU - .01) thm = 0;
      freccia(ctx, O, [O[0] + 150 * n[0], O[1] + 150 * n[1]], C.ink, kn, 5);
      ctx.save(); ctx.globalAlpha *= kn; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      if (thm > .05) { ctx.beginPath(); ctx.arc(O[0], O[1], 70, -thm, 0); ctx.stroke(); }
      ctx.restore();
      const am = thm / 2, lp = [O[0] + 105 * Math.cos(am), O[1] - 105 * Math.sin(am)];
      fondo(ctx, lp[0], lp[1], 40, 44, kn * (thm > .3 ? 1 : 0)); drawRich(ctx, '{mink:θ}', lp[0], lp[1], { size: 38, alpha: kn * (thm > .3 ? 1 : 0) });
    }
    // la corrente indotta nei due lati: con ε > 0 il lato A entra (⊗), il lato B esce (⊙)
    const ki = P(t, 45.3, 45.8);
    const e = Math.sin(th), kIn = clamp(e / .08), kOut = clamp(-e / .08);
    filoTaglio(ctx, A, RF, ki * kOut, ki * kIn, ks);
    filoTaglio(ctx, Bp, RF, ki * kIn, ki * kOut, ks);
  }
  const stato = fermo(t) ? 'fermo immagine' : t > 13.0 ? 'al rallentatore (100 volte)' : '';
  if (stato) txt(ctx, stato, 1090, 772, { size: 28, color: C.dim, align: 'right' });
  ctx.restore();
}

// ---------- i grafici (destra): due giri, con il tempo vero sull'asse ----------
const GX0 = 1240, gx = s => GX0 + s * 12000;     // 0,04 s → 480 px
const YP = 300, YE = 505, AMP = 68;
function asse(ctx, y0, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, y0); ctx.lineTo(gx(.04) + 20, y0); ctx.moveTo(GX0, y0 + AMP + 10); ctx.lineTo(GX0, y0 - AMP - 22); ctx.stroke();
  arrowHead(ctx, [gx(.04) + 26, y0], 0, C.ink); arrowHead(ctx, [GX0, y0 - AMP - 28], -Math.PI / 2, C.ink);
  ctx.restore();
}
function onda(ctx, f, s1, y0, amp, col) {
  if (s1 <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i <= 200; i++) { const s = s1 * i / 200, p = [gx(s), y0 - amp * f(s)]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
}
const phiN = s => Math.cos(W50 * s), epsN = s => Math.sin(W50 * s);   // in unità di B·S e di ε₀
function sceneGrafici(ctx, t) {
  const al = life(t, 12.8, 66.4, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{mink:θ} = {mink:ω}·{mink:t}   {dim:(}{mink:ω}{dim:: velocità angolare, rad/s)}', 1480, 160, { size: 32, local: t - 17.8 });
  const kP = P(t, 23.1, 23.5), kE = P(t, 28.3, 28.7);
  asse(ctx, YP, kP); asse(ctx, YE, kE);
  drawRich(ctx, '{mg:Φ}', GX0 + 16, YP - AMP - 26, { size: 36, align: 'left', alpha: kP });
  drawRich(ctx, '{my:ε}', GX0 + 16, YE - AMP - 26, { size: 36, align: 'left', alpha: kE });
  onda(ctx, phiN, .04 * P(t, 23.3, 24.8, E.lin), YP, AMP, C.g);
  onda(ctx, epsN, .04 * P(t, 28.5, 30.0, E.lin), YE, AMP, C.y);
  // il cursore segue la spira
  const s = fase(t), x = gx(s);
  if (kP > 0) {
    ctx.save(); ctx.globalAlpha *= kP; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([7, 7]);
    ctx.beginPath(); ctx.moveTo(x, YP - AMP - 10); ctx.lineTo(x, YE + AMP + 10); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha *= kP; ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(x, YP - AMP * phiN(s), 9, 0, TAU); ctx.fill(); ctx.restore();
  }
  if (kE > 0) { ctx.save(); ctx.globalAlpha *= kE; ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(x, YE - AMP * epsN(s), 9, 0, TAU); ctx.fill(); ctx.restore(); }
  // nei fermi immagine, che cosa si legge sul cursore
  const k1 = life(t, 33.7, 38.6, .3, .3), k2 = life(t, 40.3, 45.2, .3, .3);
  drawRich(ctx, '{g:zero}', x + 18, YP - 26, { size: 32, align: 'left', alpha: k1 });
  drawRich(ctx, '{g:massima}', x + 18, YE - AMP - 6, { size: 32, align: 'left', alpha: k1 });
  drawRich(ctx, '{g:massimo}', x + 18, YP - AMP - 6, { size: 32, align: 'left', alpha: k2 });
  drawRich(ctx, '{g:zero}', x + 18, YE - 26, { size: 32, align: 'left', alpha: k2 });
  // il tempo vero, e il periodo
  const kT = P(t, 55.9, 56.4);
  if (kT > 0) {
    for (const v of [1, 2, 3, 4]) txt(ctx, '0,0' + v, gx(v / 100), YE + AMP + 32, { size: 28, color: C.dim, alpha: kT });
    drawRich(ctx, '{mink:t} {dim:(s)}', gx(.04) + 72, YE + 34, { size: 30, align: 'right', alpha: kT });
  }
  const kPer = life(t, 61.2, 66.3, .4, .4);
  if (kPer > 0) {
    ctx.save(); ctx.globalAlpha *= kPer; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3;
    const yb = YE - AMP - 14;
    ctx.beginPath(); ctx.moveTo(gx(.005), yb + 8); ctx.lineTo(gx(.005), yb); ctx.lineTo(gx(.025), yb); ctx.lineTo(gx(.025), yb + 8); ctx.stroke(); ctx.restore();
    fondo(ctx, gx(.015), YE - AMP - 36, 190, 40, kPer);
    drawRich(ctx, '1 giro: 0,02 s', gx(.015), YE - AMP - 36, { size: 30, alpha: kPer });
  }
  // le formule
  separa(ctx, 622, P(t, 23.1, 23.5));
  drawRich(ctx, '{mg:Φ} = {mg:B}·{mink:S}·cos({mink:ω}·{mink:t})', 1480, 664, { size: 38, local: t - 23.2 });
  drawRich(ctx, '{my:ε} = {my:ε₀}·sin({mink:ω}·{mink:t})', 1480, 714, { size: 38, local: t - 28.4 });
  drawRich(ctx, '{my:ε₀} = {mink:N}·{mg:B}·{mink:S}·{mink:ω}', 1350, 764, { size: 36, local: t - 50.6 });
  drawRich(ctx, '{mink:f} = 50 Hz', 1665, 764, { size: 36, local: t - 61.6 });
  ctx.restore();
}

// ---------- la tensione delle prese (destra, 66,3–81,3) ----------
const YV = 470, KV = 165 / 325;                  // px per volt
function scenePrese(ctx, t) {
  const al = life(t, 66.3, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'la tensione delle prese', 1480, 165, { size: 40, weight: 600, local: t - 66.4 }));
  ctx.save(); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, YV); ctx.lineTo(gx(.04) + 20, YV); ctx.moveTo(GX0, YV + 190); ctx.lineTo(GX0, YV - 200); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [gx(.04) + 26, YV], 0, C.ink); arrowHead(ctx, [GX0, YV - 206], -Math.PI / 2, C.ink);
  drawRich(ctx, '{my:V} {dim:(V)}', GX0 + 16, YV - 206, { size: 32, align: 'left' });
  for (const v of [1, 2, 3, 4]) txt(ctx, '0,0' + v, gx(v / 100), YV + KV * 325 + 34, { size: 28, color: C.dim });
  drawRich(ctx, '{mink:t} {dim:(s)}', gx(.04) + 72, YV - 30, { size: 30, align: 'right' });
  // il picco
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
  for (const v of [325, -325]) { ctx.beginPath(); ctx.moveTo(GX0, YV - KV * v); ctx.lineTo(gx(.04), YV - KV * v); ctx.stroke(); }
  ctx.restore();
  txt(ctx, '325', GX0 - 10, YV - KV * 325, { size: 28, color: C.dim, align: 'right' });
  txt(ctx, '−325', GX0 - 10, YV + KV * 325, { size: 28, color: C.dim, align: 'right' });
  onda(ctx, s => 325 * Math.sin(W50 * s), .04 * P(t, 66.6, 68.4, E.lin), YV, KV, C.y);
  // il valore efficace: 325/√2 ≈ 230 V
  const ke = P(t, 71.2, 71.8);
  if (ke > 0) {
    ctx.save(); ctx.globalAlpha *= ke; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([14, 9]);
    ctx.beginPath(); ctx.moveTo(GX0, YV - KV * 230); ctx.lineTo(gx(.04), YV - KV * 230); ctx.stroke(); ctx.restore();
    txt(ctx, '230', GX0 - 10, YV - KV * 230, { size: 28, color: C.g, align: 'right', alpha: ke });
  }
  drawRich(ctx, '{g:efficace:} 325 V / √2 ≈ {g:230 V}', 1480, 720, { size: 38, local: t - 71.4 });
  drawRich(ctx, '{dim:230 V costanti: stesso calore in una stufa}', 1480, 766, { size: 30, local: t - 76.3 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La corrente alternata', W / 2, 180, { size: 125, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.6, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 91.2, 92.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Una spira che gira nel campo\ndà una tensione {g:sinusoidale}.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:ε} = {my:ε₀}·sin({mink:ω}·{mink:t})\n{my:ε₀} = {mink:N}·{mg:B}·{mink:S}·{mink:ω}'], [960, '50 Hz:\n{dim:50 giri al secondo}'], [1470, '{g:230 V} efficaci\n{dim:picco ≈ 325 V}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): sulla spira il tono segue l'altezza del lato A, (1 − cos θ)/2; nei
  // grafici segue la curva che si disegna, da −1 (0) a +1 (1). La spira gira sempre: un giro solo, all'inizio e alla ripresa
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.4, 9.8], ['pop', 10.0, .6],                        // i poli, le linee di B
    ['soffio', 12.6], ['pop', 12.8, .5],                                              // la scheda dei grafici, la spira di taglio
    ['tono', 13.0, 15.0, [0, .15, .5, .85, 1, .85, .5, .15, 0]],                      // il primo giro
    ['pop', 17.8, .45],                                                               // θ = ω·t
    ['traccia', 23.3, 24.8], ['tono', 23.3, 24.8, [1, .85, .5, .15, 0, .15, .5, .85, 1, .85, .5, .15, 0, .15, .5, .85, 1]],   // Φ: un coseno
    ['traccia', 28.5, 30.0], ['tono', 28.5, 30.0, [.5, .85, 1, .85, .5, .15, 0, .15, .5, .85, 1, .85, .5, .15, 0, .15, .5]],  // ε: un seno
    ['pop', 33.5, .5], ['pop', 33.7, .8],                                             // fermo a 90°: flusso zero, f.e.m. massima
    ['tono', 38.7, 40.2, [.5, .85, 1, .85, .5, .15, 0]], ['pop', 40.3, .3],           // da 90° a 360°: flusso massimo, f.e.m. zero
    ['tono', 45.2, 47.2, [0, .15, .5, .85, 1, .85, .5, .15, 0]], ['pop', 45.3, .6],   // riparte: la corrente nei lati cambia verso
    ['pop', 50.6, .5],                                                                // ε₀ = N·B·S·ω
    ['pop', 55.9, .4], ['pop', 61.2, .5], ['ding', 61.6],                             // il tempo vero, un giro in 0,02 s: 50 Hz
    ['soffio', 66.3], ['traccia', 66.6, 68.4], ['tono', 66.6, 68.4, [.5, .85, 1, .85, .5, .15, 0, .15, .5, .85, 1, .85, .5, .15, 0, .15, .5]],   // la tensione delle prese
    ['pop', 71.2, .85], ['ding', 71.4],                                               // efficace: 230 V
    ['pop', 76.3, .4],                                                                // lo stesso calore in una stufa
    ['soffio', 81.9], ['pop', 83.9, .5], ['pop', 84.4, .6], ['pop', 84.9, .7],        // in una frase
  ];
  return {
    titolo: 'La corrente alternata', durata: 92.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.5, 'la spira che gira'], [33.5, 66.2, 'una tensione alternata'], [66.2, T_FINE, 'nelle prese']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneSpira(ctx, t); sceneGrafici(ctx, t); scenePrese(ctx, t); sceneFine(ctx, t); },
  };
});
