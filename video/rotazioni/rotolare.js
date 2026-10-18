'use strict';
/* La gara dei cilindri — un cilindro pieno e uno cavo (parete sottile), stessa massa 2 kg e stesso raggio 15 cm, rotolano
   senza strisciare giù per lo stesso piano di 30°, lungo 2 m fino al traguardo. Moto vero: s = ½·a·τ², con
   a = (2/3)·g·sin α ≈ 3,27 m/s² (pieno) e a = (1/2)·g·sin α = 2,45 m/s² (cavo); la rotazione è φ = s/R (ω = v/R).
   Al rallentatore (4 s di video per 1 s vero): il pieno arriva in 1,11 s, il cavo in 1,28 s (quando arriva il pieno il cavo
   ha fatto 1,5 m). L'energia m·g·h = 19,6 J si divide fra traslazione e rotazione: 13,1 + 6,5 J (pieno), 9,8 + 9,8 J (cavo).
   Il momento d'inerzia I = Σ m·r²: pieno ½·m·R², cavo m·R². Argomento: rotazioni. */
CVIDEO.registra('rotazioni/rotolare', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed, dot } = M;

const T_FINE = 99.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.6, 'pensa'], [26.0, 'neutro'],
  [30.7, 'sorpreso'], [36.2, 'felice'], [40.9, 'neutro'], [59.4, 'pensa'], [63.7, 'neutro'], [82.3, 'felice'],
  [86.9, 'neutro'], [95.6, 'felice'], [T_FINE, 'neutro'], [102.2, 'felice'], [106.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Due cilindri rotolano giù:\nquale arriva prima in fondo?'],
  [7.9, 12.3, 'Uno è {y:pieno}, l’altro è {v:cavo}:\nun tubo dalla parete sottile.'],
  [12.4, 16.9, 'Stessa massa, 2 kg, e stesso\nraggio, 15 cm.'],
  [17.0, 21.5, 'Stesso piano, inclinato di {mink:α} = 30°:\n2 m fino al traguardo.'],
  [21.6, 25.9, '{r:Stessa massa, stesso raggio:}\n{r:arriveranno insieme?}'],
  [26.0, 30.5, 'Tolgo i fermi: partono insieme.\nAl rallentatore.'],
  [30.7, 35.3, 'Il pieno è al traguardo, il cavo\nè ancora 50 cm indietro.'],
  [36.2, 40.8, 'Vince il {g:pieno}: 1,11 s\ncontro 1,28 s.'],
  [40.9, 45.4, 'Scendono di 1 m: perdono 19,6 J\ndi energia potenziale.'],
  [45.5, 50.0, 'Rotolando, l’energia diventa cinetica\ndi {g:traslazione} e di {v:rotazione}.'],
  [50.1, 54.7, 'Il pieno: 13,1 J per correre\ne 6,5 J per girare.'],
  [54.8, 59.3, 'Il cavo: 9,8 J e 9,8 J,\nmetà e metà.'],
  [59.4, 63.6, 'Al cavo girare costa di più.\nPerché?'],
  [63.7, 68.4, 'Lo dice il {v:momento d’inerzia}:\n{mv:I} = Σ {mink:m·r²}, su tutti i pezzetti.'],
  [68.5, 73.0, 'Per ogni pezzetto: la sua massa per\nil quadrato della distanza dall’asse.'],
  [73.1, 77.6, 'Nel cavo tutto sta a distanza {mink:R}:\n{mv:I} = {mink:m·R²}.'],
  [77.7, 82.2, 'Nel pieno molta massa è vicina\nall’asse: {mv:I} = ½·{mink:m·R²}.'],
  [82.3, 86.8, 'Stessa massa, ma più lontana\ndall’asse: {mv:I} {g:più grande}.'],
  [86.9, 91.15, 'Il pieno mette 2/3 dell’energia nel\ncorrere: {mv:a} = (2/3)·{mink:g}·sin {mink:α}.'],
  [91.25, 95.5, 'Il cavo, con {mv:I} doppio, solo metà:\n{mv:a} = (1/2)·{mink:g}·sin {mink:α}.'],
  [95.6, 99.9, 'Massa e raggio {g:non compaiono}:\nconta come è distribuita la massa.'],
  [102.2, 107.0, 'Rotola prima chi ha la massa più\nvicina all’asse: {mv:I} più piccolo.'],
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
function fermo(ctx, x, y, al, testo) {   // ❚❚ fermo immagine, ▶ rallentatore
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
const lin = (t, keys) => {   // interpolazione lineare: il tempo vero scorre uniforme
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));

// ---------- il moto vero ----------
const RAD = Math.PI / 180, AL = 30 * RAD, G = 9.8, MASSA = 2, RC = .15, LP = 2;   // 30°, 2 kg, raggio 15 cm, 2 m
const A_PIENO = 2 / 3 * G * Math.sin(AL), A_CAVO = 1 / 2 * G * Math.sin(AL);     // 3,27 e 2,45 m/s²
const TP = Math.sqrt(2 * LP / A_PIENO), TC = Math.sqrt(2 * LP / A_CAVO);           // 1,107 s e 1,278 s
const SLOW = 4, TR = 26.2, T_SBLOCCA = 35.4;                                        // al rallentatore: 4 s di video per 1 s vero
const T_PA = TR + SLOW * TP, T_CA = T_SBLOCCA + SLOW * (TC - TP);                   // 30,63 e 36,08
// il tempo vero dal via: fermo immagine quando arriva il pieno, poi riparte fino all'arrivo del cavo
const TAU = [[TR, 0], [T_PA, TP], [T_SBLOCCA, TP], [T_CA, TC]];
const tau = t => lin(t, TAU);
const T_RESET = 87.2;   // per le accelerazioni i cilindri tornano alla partenza
const T_TRAG = 41.1;    // per l'energia ciascuno si mostra mentre passa il traguardo (lì ha perso 19,6 J)
const sPieno = t => t > T_RESET - .6 ? 0 : t > T_TRAG ? LP : .5 * A_PIENO * tau(t) ** 2;
const sCavo = t => t > T_RESET - .6 ? 0 : t > T_TRAG ? LP : .5 * A_CAVO * tau(t) ** 2;
const V_PIENO = A_PIENO * TP, V_CAVO = A_CAVO * TC;   // al traguardo: 3,61 e 3,13 m/s

// ---------- la scena: due piani uguali, uno dietro l'altro (250 px per metro) ----------
const PXM = 250, RPX = RC * PXM, PRIMA = .35, LTOT = 3.2;      // 0,35 m prima della partenza, 0,85 m dopo il traguardo
const U = [Math.cos(AL), Math.sin(AL)], N = [Math.sin(AL), -Math.cos(AL)];   // giù lungo il piano; perpendicolare, verso fuori
const TB = [190, 345], OFF = [70, -140], TA = add(TB, OFF, 1), PAV = TB[1] + LTOT * PXM * U[1];   // pavimento a y = 745
const BB = add(TB, U, LTOT * PXM), BA = add(TA, U, LTOT * PXM);
const sulPiano = (T, s) => add(T, U, (PRIMA + s) * PXM);
// s è la strada fatta dal davanti del cilindro: a s = 0 tocca la partenza, a s = 2 m il traguardo
const centro = (T, s) => add(sulPiano(T, s - RC), N, RPX);
// il cilindro visto di fronte: pieno = disco con una riga dipinta su un diametro; cavo = anello sottile con una tacca
function cilindro(ctx, c, r, phi, pieno, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(c[0], c[1]); ctx.rotate(phi);
  if (pieno) {
    ctx.fillStyle = css(mix(C.y, C.paper, .45)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = Math.max(3, r * .07);
    ctx.beginPath(); ctx.arc(0, 0, Math.max(0, r), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = Math.max(4, r * .1); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-r * .82, 0); ctx.lineTo(r * .82, 0); ctx.stroke();
  } else {
    const sp = Math.max(7, r * .16);
    ctx.strokeStyle = css(mix(C.v, C.paper, .3)); ctx.lineWidth = sp;
    ctx.beginPath(); ctx.arc(0, 0, Math.max(0, r - sp / 2), 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = css(mix(C.v, C.ink, .45)); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, Math.max(0, r - sp), 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = css(mix(C.v, C.ink, .45));   // la tacca: si vede girare
    ctx.beginPath(); ctx.arc(r - sp / 2, 0, Math.max(0, sp * .42), 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-(r - sp / 2), 0, sp * .42, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(0, 0, Math.max(3, r * .06), 0, Math.PI * 2); ctx.fill();   // l'asse
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La gara dei cilindri', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · i due piani e la gara (7,5–63,6), poi di nuovo per le accelerazioni (86,9–99,6)
function corsia(ctx, T, B, dietro) {
  ctx.fillStyle = css(mix(C.dim, C.paper, dietro ? .72 : .86)); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(B[0], B[1]);
  if (dietro) { ctx.lineTo(B[0], PAV); ctx.lineTo(T[0], PAV); } else ctx.lineTo(T[0], B[1]);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  // partenza e traguardo: tacche perpendicolari al piano
  for (const [s, col] of [[0, C.dim], [LP, C.g]]) {
    const p = sulPiano(T, s);
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(...add(p, N, 2 * RPX + 26)); ctx.stroke(); ctx.restore();
  }
}
function sceneRampa(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, 63.6, .6, .5) + life(t, 86.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, PAV); ctx.lineTo(1070, PAV); ctx.stroke();
  corsia(ctx, TA, BA, true);
  corsia(ctx, TB, BB, false);
  // l'angolo e la lunghezza, quando Stilla li nomina
  const kA = P(t, 17.2, 17.7);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(BB[0], BB[1], 110, Math.PI, Math.PI + AL); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:α} = 30°', BB[0] - 128, BB[1] - 30, { size: 34, align: 'right', alpha: kA });
    txt(ctx, 'traguardo', ...add(sulPiano(TA, LP), N, 2 * RPX + 56), { size: 30, color: C.g, alpha: kA * (1 - life(t, 40.9, 87.0, .3, .3)) });
  }
  // i cilindri: il pieno sulla corsia di dietro, il cavo davanti
  const sp = sPieno(t), sc = sCavo(t), kC = P(t, 8.0, 8.5, E.back);
  const cP = centro(TA, sp), cC = centro(TB, sc);
  // i fermi davanti ai cilindri, tolti al via
  const kF = P(t, 8.0, 8.4) * (1 - P(t, TR - .5, TR - .1)) + P(t, T_RESET - .4, T_RESET);
  for (const T of [TA, TB]) {
    const p = sulPiano(T, .03);
    ctx.save(); ctx.globalAlpha *= kF; ctx.translate(p[0], p[1]); ctx.rotate(AL); ctx.fillStyle = css(C.dim); ctx.fillRect(-6, -40, 12, 40); ctx.restore();
  }
  // spariscono e ricompaiono: al traguardo per l'energia, alla partenza per le accelerazioni
  const ka = (1 - life(t, T_TRAG - .4, T_TRAG + .4, .4, .4)) * (1 - life(t, T_RESET - 1.0, T_RESET - .2, .4, .4));
  cilindro(ctx, cP, RPX * kC, sp / RC, true, ka);
  cilindro(ctx, cC, RPX * kC, sc / RC, false, ka);
  const kN = life(t, 8.2, 26.0, .4, .4);
  // i nomi sotto la superficie, sulla faccia del piano
  drawRich(ctx, '{y:pieno}', ...add(sulPiano(TA, .5), N, -50), { size: 34, alpha: kN });
  drawRich(ctx, '{v:cavo}', ...add(sulPiano(TB, .1), N, -50), { size: 34, alpha: kN });
  // al traguardo: la velocità (40 px per m/s) e il verso in cui girano
  const kV = life(t, 45.7, 63.4, .4, .4);
  if (kV > 0) {
    for (const [c, v] of [[cP, V_PIENO], [cC, V_CAVO]]) {
      const a = add(c, N, RPX + 40);   // sopra la tacca del traguardo
      freccia(ctx, a, add(a, U, v * 40), C.x, kV, 6);
      drawRich(ctx, '{mx:v}', ...add(a, U, v * 40 + 30), { size: 38, alpha: kV });
      // la rotazione: un arco sul lato in salita, in senso orario (lì il cilindro sale)
      ctx.save(); ctx.globalAlpha *= kV; ctx.strokeStyle = css(C.x); ctx.lineWidth = 4;
      const r = RPX + 12, a0 = 175 * RAD, a1 = 255 * RAD;
      ctx.beginPath(); ctx.arc(c[0], c[1], r, a0, a1); ctx.stroke();
      arrowHead(ctx, [c[0] + r * Math.cos(a1 + .12), c[1] + r * Math.sin(a1 + .12)], a1 + Math.PI / 2 + .12, C.x, .8);
      ctx.restore();
    }
  }
  // la distanza che manca al cavo quando arriva il pieno
  const kD = life(t, 30.8, 35.4, .3, .3);
  if (kD > 0) {
    const a = add(sulPiano(TB, sc), N, -34), b = add(sulPiano(TB, LP), N, -34);
    ctx.save(); ctx.globalAlpha *= kD; ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.restore();
    txt(ctx, '50 cm', ...add(add(a, U, (LP - sc) * PXM / 2), N, -42), { size: 32, weight: 600, color: C.r, alpha: kD });
  }
  // le accelerazioni, frecce lunghe in proporzione (40 px per m/s²)
  const kAp = P(t, 87.3, 87.8), kAc = P(t, 91.4, 91.9);
  freccia(ctx, add(cP, U, RPX + 8), add(cP, U, RPX + 8 + A_PIENO * 40), C.v, kAp * (1 - P(t, T_FINE - .4, T_FINE)));
  freccia(ctx, add(cC, U, RPX + 8), add(cC, U, RPX + 8 + A_CAVO * 40), C.v, kAc * (1 - P(t, T_FINE - .4, T_FINE)));
  drawRich(ctx, '{mv:a}', ...add(add(cP, U, RPX + 8 + A_PIENO * 20), N, 36), { size: 40, alpha: kAp });
  drawRich(ctx, '{mv:a}', ...add(add(cC, U, RPX + 8 + A_CAVO * 20), N, 36), { size: 40, alpha: kAc });
  // fermo immagine / rallentatore
  const muove = (t > TR && t < T_PA) || (t > T_SBLOCCA && t < T_CA);
  fermo(ctx, 760, 150, t > TR && t < 63.6 ? 1 : 0, muove ? 'al rallentatore' : 'fermo immagine');
  ctx.restore();
}

// 2 · il momento d'inerzia: le sezioni ingrandite, con i pezzetti di massa (63,6–86,9)
const SP = [380, 470], SCV = [840, 470], RS = 190, PARETE = 30;
const PEZZI_PIENO = (() => { const p = []; for (let k = 1; k <= 5; k++) { const r = (k - .5) / 5 * (RS - 8), n = 6 * k; for (let i = 0; i < n; i++) p.push([r, (i + .5 * k) / n * Math.PI * 2]); } return p; })();
const PEZZI_CAVO = Array.from({ length: 36 }, (_, i) => [RS - PARETE / 2, (i + .5) / 36 * Math.PI * 2]);
function sceneSezioni(ctx, t) {
  const al = life(t, 63.7, 86.8, .6, .5);
  if (al <= 0) return;
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, 'le sezioni, ingrandite', 610, 160, { size: 30, color: C.dim });
  drawRich(ctx, '{y:pieno}', SP[0], 232, { size: 38 });
  drawRich(ctx, '{v:cavo}', SCV[0], 232, { size: 38 });
  ctx.fillStyle = css(mix(C.y, C.paper, .75)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(SP[0], SP[1], RS, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(mix(C.v, C.paper, .6)); ctx.lineWidth = PARETE;
  ctx.beginPath(); ctx.arc(SCV[0], SCV[1], RS - PARETE / 2, 0, Math.PI * 2); ctx.stroke();
  // i pezzetti: nel pieno quelli vicini all'asse si accendono quando Stilla ne parla
  const kIn = life(t, 77.9, 86.8, .4, .4), kOut = life(t, 73.3, 86.8, .4, .4);
  for (const [r, a] of PEZZI_PIENO) dot(ctx, [SP[0] + r * Math.cos(a), SP[1] + r * Math.sin(a)], r < .6 * RS ? mix(C.dim, C.g, kIn) : C.dim, 1, 7);
  for (const [r, a] of PEZZI_CAVO) dot(ctx, [SCV[0] + r * Math.cos(a), SCV[1] + r * Math.sin(a)], mix(C.dim, C.v, kOut), 1, 7);
  // le etichette stanno su un fondino del colore della scheda: sotto ci sono i pezzetti
  const fondo = (x, y, w, h, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); };
  for (const c of [SP, SCV]) { dot(ctx, c, C.ink, 1, 8); fondo(c[0] + 52, c[1] + 38, 76, 36); txt(ctx, 'asse', c[0] + 52, c[1] + 38, { size: 30, color: C.dim }); }
  // un pezzetto del pieno: la sua massa m e la sua distanza r dall'asse (in alto a destra, lontano dal raggio R)
  const kr = life(t, 64.2, 77.6, .4, .4);
  if (kr > 0) {
    const a = -.55, r = PEZZI_PIENO[30][0], q = [SP[0] + r * Math.cos(a), SP[1] + r * Math.sin(a)];
    ctx.save(); ctx.globalAlpha *= kr;
    dashed(ctx, SP, q, C.ink, 1, 1);
    dot(ctx, q, C.x, 1, 11);
    const pr = [(SP[0] + q[0]) / 2 - 22, (SP[1] + q[1]) / 2 - 30];
    fondo(pr[0], pr[1], 40, 44); drawRich(ctx, '{mink:r}', pr[0], pr[1], { size: 40 });
    fondo(q[0] + 32, q[1] - 26, 44, 44); drawRich(ctx, '{mink:m}', q[0] + 32, q[1] - 26, { size: 40 });
    ctx.restore();
  }
  // il raggio R dei due cilindri, verso il basso a sinistra
  const kR = life(t, 73.3, 86.8, .4, .4), kR2 = life(t, 77.9, 86.8, .4, .4);
  for (const [c, k] of [[SCV, kR], [SP, kR2]]) {
    if (k <= 0) continue;
    const d = [-Math.cos(.5), Math.sin(.5)], pp = [Math.sin(.5), Math.cos(.5)];
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + RS * d[0], c[1] + RS * d[1]); ctx.stroke(); ctx.restore();
    const pR = [c[0] + RS * .5 * d[0] + 34 * pp[0], c[1] + RS * .5 * d[1] + 34 * pp[1]];
    fondo(pR[0], pR[1], 46, 46, k); drawRich(ctx, '{mink:R}', pR[0], pR[1], { size: 40, alpha: k });
  }
  ctx.restore();
}

// ---------- il pannello ----------
const XP = 1560, XC = 1710;
function scenePannello(ctx, t) {
  if (t < 12.2 || t > T_FINE + .3) return;
  const al = life(t, 12.4, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const nome = (s, y, a = 1) => drawRich(ctx, '{dim:' + s + '}', 1190, y, { size: 32, align: 'left', alpha: a });
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · i dati e il cronometro
  const s1 = life(t, 12.4, 40.8, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'i due cilindri');
    cilindro(ctx, [XP, 225], 26, 0, true); cilindro(ctx, [XC, 225], 26, 0, false);
    drawRich(ctx, '{y:pieno}', XP, 275, { size: 30 }); drawRich(ctx, '{v:cavo}', XC, 275, { size: 30 });
    const k1 = P(t, 12.6, 13.0), k2 = P(t, 13.4, 13.8);
    nome('massa', 330, k1); txt(ctx, '2 kg', XP, 330, { size: 36, alpha: k1 }); txt(ctx, '2 kg', XC, 330, { size: 36, alpha: k1 });
    nome('raggio', 382, k2); txt(ctx, '15 cm', XP, 382, { size: 36, alpha: k2 }); txt(ctx, '15 cm', XC, 382, { size: 36, alpha: k2 });
    riga(418, k2);
    drawRich(ctx, '{dim:piano:} {mink:α} = 30°, lungo 2 m', 1480, 462, { size: 34, alpha: P(t, 17.2, 17.6) });
    const kI = P(t, 21.8, 22.3);
    if (kI > 0) {
      drawRich(ctx, '{r:arriveranno insieme?}', 1480, 530, { size: 36, alpha: kI });
      const kx = P(t, 36.3, 36.9);
      if (kx > 0) { ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1290, 532); ctx.lineTo(lerp(1290, 1670, kx), 532); ctx.stroke(); ctx.restore(); }
    }
    const kT = P(t, 26.0, 26.4);
    if (kT > 0) {
      ctx.save(); ctx.globalAlpha *= kT;
      riga(580);
      nome('tempo vero', 640);
      const tv = tau(t);
      for (const [x, T, vince] of [[XP, TP, true], [XC, TC, false]]) {
        const arr = tv >= T - 1e-9, col = arr ? (vince ? C.g : C.ink) : C.ink;
        fixedNum(ctx, fmtN(Math.min(tv, T), 2), x + 34, 640, 44, col);
        txt(ctx, 's', x + 42, 640, { size: 32, color: C.dim, align: 'left' });
      }
      ctx.restore();
    }
    drawRich(ctx, '{g:vince il pieno}', 1480, 720, { size: 36, alpha: P(t, 36.4, 36.9) });
    ctx.restore();
  }
  // 2 · dove va l'energia (al traguardo)
  const s2 = life(t, 40.9, 63.6, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'al traguardo');
    drawRich(ctx, '{dim:dislivello} {mink:h} = 1 m', 1480, 235, { size: 34 });
    drawRich(ctx, '{mink:m·g·h} = 2 · 9,8 · 1 = {g:19,6 J}', 1480, 295, { size: 38, local: t - 41.2 });
    const KX = 26, X0 = 1250, BH = 62;
    const barra = (y, a, tr, rot) => {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = css(C.g); ctx.fillRect(X0, y - BH / 2, tr * KX * a, BH);
      ctx.fillStyle = css(mix(C.g, C.paper, .6)); ctx.fillRect(X0 + tr * KX, y - BH / 2, rot * KX * P(a, .5, 1), BH);
      txt(ctx, fmtN(tr, 1) + ' J', X0 + tr * KX / 2, y, { size: 32, weight: 600, color: C.paper, alpha: P(a, .6, 1) });
      txt(ctx, fmtN(rot, 1) + ' J', X0 + tr * KX + rot * KX / 2, y, { size: 32, weight: 600, color: C.ink, alpha: P(a, .8, 1) });
      ctx.restore();
    };
    const kp = P(t, 50.3, 51.3), kc = P(t, 55.0, 56.0);
    cilindro(ctx, [1205, 400], 22, 0, true, P(t, 50.3, 50.6)); barra(400, kp, 13.0667, 6.5333);
    cilindro(ctx, [1205, 510], 22, 0, false, P(t, 55.0, 55.3)); barra(510, kc, 9.8, 9.8);
    const kL = P(t, 45.7, 46.2);
    ctx.save(); ctx.globalAlpha *= kL;
    ctx.fillStyle = css(C.g); ctx.fillRect(1250, 600, 30, 30);
    ctx.fillStyle = css(mix(C.g, C.paper, .6)); ctx.fillRect(1250, 660, 30, 30);
    ctx.restore();
    drawRich(ctx, 'traslazione {dim:(correre)}', 1300, 615, { size: 32, align: 'left', alpha: kL });
    drawRich(ctx, 'rotazione {dim:(girare)}', 1300, 675, { size: 32, align: 'left', alpha: kL });
    drawRich(ctx, '{v:al cavo girare costa di più}', 1480, 745, { size: 34, alpha: P(t, 59.6, 60.1) });
    ctx.restore();
  }
  // 3 · il momento d'inerzia
  const s3 = life(t, 63.7, 86.8, .4, .4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'momento d’inerzia');
    drawRich(ctx, '{mv:I} = Σ {mink:m·r²}', 1480, 255, { size: 60, local: t - 63.9 });
    drawRich(ctx, '{dim:su tutti i pezzetti}', 1480, 322, { size: 30, local: t - 64.4 });
    riga(370, P(t, 73.3, 73.7));
    cilindro(ctx, [1205, 440], 22, 0, false, P(t, 73.3, 73.7));
    drawRich(ctx, '{mv:I} = {mink:m·R²}', 1250, 440, { size: 44, align: 'left', local: t - 73.4 });
    drawRich(ctx, '= 2 · 0,15² = 0,045 kg·m²', 1250, 497, { size: 32, align: 'left', local: t - 74.2 });
    drawRich(ctx, '{dim:qui} {mink:m} {dim:= 2 kg, la massa del cilindro}', 1480, 690, { size: 30, alpha: P(t, 73.6, 74.1) });
    cilindro(ctx, [1205, 580], 22, 0, true, P(t, 77.9, 78.3));
    drawRich(ctx, '{mv:I} = ½·{mink:m·R²}', 1250, 580, { size: 44, align: 'left', local: t - 78.0 });
    drawRich(ctx, '= ½ · 2 · 0,15² = 0,0225 kg·m²', 1250, 637, { size: 32, align: 'left', local: t - 78.8 });
    drawRich(ctx, '{g:il cavo ha} {mv:I} {g:doppio}', 1480, 745, { size: 36, local: t - 82.5 });
    ctx.restore();
  }
  // 4 · le accelerazioni
  const s4 = life(t, 86.9, T_FINE + .1, .4, .5);
  if (s4 > 0) {
    ctx.save(); ctx.globalAlpha *= s4;
    titoletto(ctx, 'l’accelerazione');
    drawRich(ctx, '{mink:g·sin α} = 9,8 · 0,5 = 4,9 m/s²', 1480, 240, { size: 36, local: t - 87.1 });
    drawRich(ctx, '{dim:(un blocco che scivola senza attrito)}', 1480, 290, { size: 30, local: t - 87.4 });
    riga(335);
    cilindro(ctx, [1205, 400], 22, 0, true, P(t, 87.3, 87.7));
    drawRich(ctx, '{mv:a} = (2/3)·{mink:g·sin α}', 1250, 400, { size: 40, align: 'left', local: t - 87.4 });
    txt(ctx, '≈ 3,27 m/s²', 1250, 458, { size: 44, weight: 600, color: C.v, align: 'left', alpha: P(t, 88.2, 88.7) });
    cilindro(ctx, [1205, 545], 22, 0, false, P(t, 91.4, 91.8));
    drawRich(ctx, '{mv:a} = (1/2)·{mink:g·sin α}', 1250, 545, { size: 40, align: 'left', local: t - 91.5 });
    txt(ctx, '= 2,45 m/s²', 1250, 603, { size: 44, weight: 600, color: C.v, align: 'left', alpha: P(t, 92.3, 92.8) });
    drawRich(ctx, '{g:non dipende da massa e raggio}', 1480, 700, { size: 36, local: t - 95.8 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (99,6–110)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 107.9, 108.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Chi tiene la massa più vicina all’asse\nha {mv:I} più piccolo e rotola più in fretta.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{mv:I} = Σ {mink:m·r²}\n{dim:conta dove sta la massa}'], [960, 'pieno: {mv:I} = ½·{mink:m·R²}\ncavo: {mv:I} = {mink:m·R²}'],
    [1430, 'pieno: (2/3)·{mink:g}·sin {mink:α}\ncavo: (1/2)·{mink:g}·sin {mink:α}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nella gara il tono segue l'altezza di ciascun cilindro, dalla
  // partenza (1) al traguardo (0); nelle barre segue l'energia riempita, da 0 (0) a 19,6 J (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .5],                                                // i due piani, i cilindri
    ['soffio', 12.4], ['pop', 12.7, .4], ['pop', 13.5, .45],                          // il pannello: massa e raggio
    ['traccia', 17.2, 17.7], ['pop', 17.3, .5],                                       // α = 30°, lungo 2 m
    ['pop', 21.9, .55], ['pop', 26.1, .4],                                            // arriveranno insieme? il cronometro
    ['tono', 26.2, 30.63, [1, .96, .84, .64, .36, 0]],                                // via: il pieno scende
    ['tono', 26.2, 30.63, [1, .97, .88, .73, .52, .25]], ['pop', 30.65, .6],          // il cavo resta indietro; il pieno arriva
    ['traccia', 30.8, 31.1],                                                          // mancano 50 cm
    ['tono', 35.4, 36.08, [.25, .13, 0]], ['pop', 36.1, .45],                         // riparte: arriva il cavo
    ['traccia', 36.3, 36.9], ['ding', 36.95],                                         // vince il pieno
    ['pop', 41.3, .55], ['pop', 45.8, .5],                                            // 19,6 J; velocità e rotazione
    ['tono', 50.3, 51.3, [0, .02, .17, .65, .98, 1]],                                 // il pieno: 13,1 J più 6,5 J
    ['tono', 55.0, 56.0, [0, .02, .13, .6, .98, 1]],                                  // il cavo: 9,8 J più 9,8 J
    ['pop', 59.7, .45],                                                               // al cavo girare costa di più
    ['soffio', 63.7], ['pop', 64.0, .6], ['traccia', 64.2, 64.6],                     // I = Σ m·r², un pezzetto
    ['traccia', 73.3, 73.7], ['pop', 73.5, .5],                                       // il cavo: I = m·R²
    ['traccia', 77.9, 78.3], ['pop', 78.1, .45], ['ding', 82.9],                      // il pieno: ½·m·R²; il cavo ha I doppio
    ['soffio', 86.7], ['pop', 87.4, .6], ['pop', 91.5, .45],                          // le accelerazioni: 3,27 e 2,45 m/s²
    ['ding', 96.3],                                                                   // non dipende da massa e raggio
    ['soffio', 99.8], ['pop', 101.8, .5], ['pop', 102.3, .6], ['pop', 102.8, .7],     // in una frase
  ];
  return {
    titolo: 'La gara dei cilindri', durata: 110, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.8, 'la gara'], [40.8, 63.6, 'dove va l’energia'], [63.6, 86.8, 'il momento d’inerzia'], [86.8, T_FINE, 'chi accelera di più']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneRampa(ctx, t); sceneSezioni(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
