'use strict';
/* Il freddo che non si supera — a volume costante la pressione di un gas cresce in modo lineare con la temperatura;
   prolungate, le rette di gas diversi arrivano tutte a p = 0 a −273,15 °C: lo zero assoluto, lo zero della scala Kelvin.
   Argomento: gas. */
CVIDEO.registra('gas/zero-assoluto', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, glowStroke, dot } = M;

const T_FINE = 93.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [30.8, 'felice'], [33.2, 'neutro'],
  [40.6, 'pensa'], [45.2, 'freddo'], [54.8, 'felice'], [57.2, 'neutro'], [69.0, 'felice'], [71.4, 'neutro'],
  [88.2, 'pensa'], [92.8, 'neutro'], [95.2, 'felice'], [99.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Quanto freddo può fare?\nC’è un limite in basso?'],
  [7.9, 12.4, 'Un recipiente rigido, pieno d’aria,\nchiuso, con un manometro.'],
  [12.6, 16.8, 'Le pareti sono rigide: il volume\ndel gas resta {v:costante}.'],
  [17.0, 21.4, 'Nel ghiaccio che fonde, a 0 °C:\n{mv:p} = 100 kPa.'],
  [21.6, 26.0, 'A 50 °C le molecole corrono\ndi più: circa {g:118 kPa}.'],
  [26.2, 30.6, 'Nell’acqua che bolle, a 100 °C:\ncirca {g:137 kPa}.'],
  [30.8, 35.4, 'I tre punti stanno su una {v:retta}:\n{mv:p} cresce in modo lineare.'],
  [35.6, 40.2, 'È la seconda legge di {v:Gay-Lussac},\na volume costante.'],
  [40.6, 45.0, 'Prolungo la retta verso il freddo:\ndove arriva a pressione zero?'],
  [45.2, 49.8, 'A −273,15 °C!'],
  [50.0, 54.6, 'Un altro recipiente, con meno gas:\nun’altra retta, meno ripida…'],
  [54.8, 59.0, '…ma punta allo {g:stesso} punto.'],
  [59.2, 63.8, 'Con qualunque gas e qualunque\nquantità: sempre −273,15 °C.'],
  [64.0, 68.6, 'In realtà, prima di arrivarci,\nogni gas diventa liquido.'],
  [69.0, 73.6, 'Quel punto è lo {v:zero assoluto}:\nlo zero della scala {v:Kelvin}.'],
  [73.8, 78.4, '{mink:T} in kelvin, {mink:t} in °C:\n{mink:T = t +} 273,15.'],
  [78.6, 83.2, 'In kelvin la pressione è\n{v:direttamente proporzionale} a {mink:T}.'],
  [83.4, 88.0, 'A 0 K un gas ideale avrebbe\npressione {g:nulla}.'],
  [88.2, 92.8, 'Lo zero assoluto {r:non si raggiunge}:\nci si avvicina, senza arrivarci.'],
  [95.2, 100.6, 'Il freddo ha un limite:\n0 K, cioè −273,15 °C.'],
];

// ---------- aiutanti ----------
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function generatore(seme) {   // mulberry32: numeri «a caso» ma sempre gli stessi
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const tri = s => { const u = ((s % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // il rimbalzo elastico fra due pareti
const ZK = 273.15;

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il freddo che non si supera', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il bagno e il gas: la temperatura del gas insegue quella del bagno (legge esponenziale, 0,6 s) ----------
const BAGNO = [[0, 0], [21.6, 50], [26.2, 100]];
const tBagno = t => { let b = BAGNO[0][1]; for (const [s, v] of BAGNO) if (t >= s) b = v; return b; };
function tGas(t) {
  let T = BAGNO[0][1];
  for (let k = 1; k < BAGNO.length; k++) if (t > BAGNO[k][0]) T += (BAGNO[k][1] - BAGNO[k - 1][1]) * (1 - Math.exp(-(t - BAGNO[k][0]) / .6));
  return T;
}
const pA = tc => 100 * (tc + ZK) / ZK;            // a volume costante: 100 kPa a 0 °C
// le molecole: velocità proporzionali a √T (T in kelvin); la fase è ∫ √(T/273,15) dt, sommata una volta in tabella
const BX = [336, 504], BY = [456, 604], RM = 6, NM = 36, DT = .005, TM = 106;
// quanto gas c'è nel recipiente, rispetto al primo: 24 molecole (100 kPa a 0 °C), poi 14 (60 kPa), poi 36 (150 kPa).
// A pari volume e temperatura la pressione va come il numero di molecole.
const QUANTO = [[0, 1], [50.0, .6], [59.2, 1.5]];
function quanto(t) {   // passa al recipiente nuovo in 0,5 s
  let q = QUANTO[0][1];
  for (let k = 1; k < QUANTO.length; k++) q = lerp(q, QUANTO[k][1], P(t, QUANTO[k][0], QUANTO[k][0] + .5));
  return q;
}
let FASE = null, MOL = null;
function prepara() {
  if (FASE) return;
  FASE = new Float64Array(Math.ceil(TM / DT) + 2);
  for (let i = 1; i < FASE.length; i++) FASE[i] = FASE[i - 1] + DT * Math.sqrt((tGas((i - .5) * DT) + ZK) / ZK);
  const rnd = generatore(273015);
  MOL = Array.from({ length: NM }, () => { const v = 70 + 60 * rnd(), a = rnd() * Math.PI * 2; return { u: rnd() * 2, w: rnd() * 2, vx: v * Math.cos(a), vy: v * Math.sin(a) }; });
}
const fase = t => { const f = clamp(t, 0, TM) / DT, i = Math.floor(f); return lerp(FASE[i], FASE[i + 1], f - i); };
const colT = tc => mix(C.x, C.y, clamp(tc / 100));
function apparato(ctx, t) {
  const tb = tBagno(t), tg = tGas(t), f = fase(t);
  // il bagno
  ctx.fillStyle = css(colT(tb), .2); ctx.fillRect(272, 420, 296, 278);
  ctx.strokeStyle = css(colT(tb), .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(272, 420); ctx.lineTo(568, 420); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(270, 380); ctx.lineTo(270, 700); ctx.lineTo(570, 700); ctx.lineTo(570, 380); ctx.stroke();
  if (tb === 0) {   // il ghiaccio che galleggia
    ctx.fillStyle = css(C.paper, .9); ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 2;
    for (const [x, s] of [[520, 26], [545, 18], [296, 0]]) if (s) { ctx.beginPath(); ctx.roundRect(x - s / 2, 410 - s * .3, s, s, 4); ctx.fill(); ctx.stroke(); }
  }
  if (tb === 100) {   // le bolle dell'acqua che bolle
    ctx.strokeStyle = css(C.paper, .9); ctx.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
      const x = i % 2 ? 524 + (i * 7) % 34 : 312 + (i * 5) % 14, y = 690 - ((t * 140 + i * 47) % 270);
      ctx.beginPath(); ctx.arc(x, y, 5 + (i % 3), 0, Math.PI * 2); ctx.stroke();
    }
  }
  // il recipiente rigido col gas
  ctx.fillStyle = C.paper; ctx.fillRect(BX[0] - 6, BY[0] - 6, BX[1] - BX[0] + 12, BY[1] - BY[0] + 12);
  ctx.fillStyle = css(C.v, .06); ctx.fillRect(BX[0], BY[0], BX[1] - BX[0], BY[1] - BY[0]);
  ctx.fillStyle = css(C.v, .8);
  const nq = 24 * quanto(t);   // le molecole presenti: le altre compaiono o spariscono una dopo l'altra
  MOL.forEach((m, i) => {
    const k = clamp(nq - i);
    if (k <= 0) return;
    const x = BX[0] + RM + (BX[1] - BX[0] - 2 * RM) * tri(m.u + m.vx * f / (BX[1] - BX[0] - 2 * RM));
    const y = BY[0] + RM + (BY[1] - BY[0] - 2 * RM) * tri(m.w + m.vy * f / (BY[1] - BY[0] - 2 * RM));
    ctx.save(); ctx.globalAlpha *= k; ctx.beginPath(); ctx.arc(x, y, RM, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.strokeRect(BX[0] - 4, BY[0] - 4, BX[1] - BX[0] + 8, BY[1] - BY[0] + 8);
  // il tubicino verso il manometro
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(420, BY[0] - 8); ctx.lineTo(420, 260); ctx.lineTo(560, 260); ctx.stroke();
  const p = pA(tg) * quanto(t);
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(615, 260, 55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const a = Math.PI * .75 + clamp(p / 250) * Math.PI * 1.5;
  ctx.strokeStyle = css(C.v); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(615, 260); ctx.lineTo(615 + Math.cos(a) * 40, 260 + Math.sin(a) * 40); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(615, 260, 5, 0, Math.PI * 2); ctx.fill();
  txt(ctx, Math.round(p) + ' kPa', 615, 350, { size: 34, color: C.v });
  // il termometro nel bagno
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(300, 360); ctx.lineTo(300, 660); ctx.stroke();
  ctx.fillStyle = css(colT(tb)); ctx.beginPath(); ctx.arc(300, 668, 12, 0, Math.PI * 2); ctx.fill();
  txt(ctx, tb + ' °C', 300, 325, { size: 34, color: colT(tb) });
  txt(ctx, tb === 0 ? 'ghiaccio che fonde' : tb === 50 ? 'acqua a 50 °C' : 'acqua che bolle', 420, 745, { size: 30, color: C.dim });
}

// ---------- il grafico p–t: 2,05 px per °C, 2 px per kPa ----------
const GX = 860 / 420, X0 = 880, Y0 = 700;
const gp = (tc, p) => [X0 + (tc + 300) * GX, Y0 - p * 2];
const GAS = [   // pressione a 0 °C, colore, quando compare, quando si prolunga
  { p0: 100, col: () => C.y, t0: 30.8, tp: 40.8 },
  { p0: 60, col: () => C.x, t0: 50.2, tp: 51.6 },
  { p0: 150, col: () => C.v, t0: 59.4, tp: 60.8 },
];
function retta(ctx, g, t) {
  const p = tc => g.p0 * (tc + ZK) / ZK, k = P(t, g.t0, g.t0 + 1.2);
  if (k > 0) glowStroke(ctx, [gp(0, p(0)), gp(110, p(110))], k, g.col(), 5);
  const kp = P(t, g.tp, g.tp + 2.6, E.lin);
  if (kp > 0) {   // il prolungamento, tratteggiato, fino a pressione zero
    ctx.save(); ctx.strokeStyle = css(g.col()); ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
    const a = gp(0, p(0)), b = gp(-ZK, 0);
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(lerp(a[0], b[0], kp), lerp(a[1], b[1], kp)); ctx.stroke(); ctx.restore();
  }
}
function grafico(ctx, t) {
  titoletto(ctx, 'pressione e temperatura', 1290, 150);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let q = 50; q <= 200; q += 50) { ctx.beginPath(); ctx.moveTo(X0, gp(0, q)[1]); ctx.lineTo(gp(120, 0)[0], gp(0, q)[1]); ctx.stroke(); }
  for (let c = -200; c <= 100; c += 100) { ctx.beginPath(); ctx.moveTo(gp(c, 0)[0], Y0); ctx.lineTo(gp(c, 0)[0], gp(0, 215)[1]); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(X0, gp(0, 228)[1]); ctx.lineTo(X0, Y0); ctx.lineTo(gp(125, 0)[0], Y0); ctx.stroke();
  arrowHead(ctx, [X0, gp(0, 228)[1] - 6], -Math.PI / 2, C.ink); arrowHead(ctx, [gp(125, 0)[0] + 6, Y0], 0, C.ink);
  for (let c = -200; c <= 100; c += 100) txt(ctx, (c < 0 ? '−' : '') + Math.abs(c), gp(c, 0)[0], Y0 + 30, { size: 29, color: C.dim });
  for (let q = 50; q <= 200; q += 50) txt(ctx, String(q), X0 - 14, gp(0, q)[1], { size: 29, color: C.dim, align: 'right' });
  drawRich(ctx, '{mv:p}{dim: (kPa)}', X0 + 18, gp(0, 228)[1] - 4, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:t}{dim: (°C)}', 1800, Y0 - 32, { size: 34, align: 'right' });
}

// 1–3 · il recipiente e il grafico (7,5–93,2)
const MISURE = [[0, 17.4], [50, 23.6], [100, 28.2]];
function scenaEsperimento(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  prepara();
  const ka = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 620, 680, ka); card(ctx, 770, 110, 1040, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  titoletto(ctx, 'volume costante', 420, 160);
  apparato(ctx, t);
  ctx.save(); ctx.globalAlpha *= P(t, 17.0, 17.6); grafico(ctx, t); ctx.restore();
  GAS.forEach(g => retta(ctx, g, t));
  MISURE.forEach(([c, ta]) => dot(ctx, gp(c, pA(c)), C.y, P(t, ta, ta + .5, E.back), 9));
  for (const g of GAS.slice(1)) for (const c of [0, 100]) dot(ctx, gp(c, g.p0 * (c + ZK) / ZK), g.col(), P(t, g.t0 - .2, g.t0 + .3, E.back), 9);
  // lo stato del gas adesso, che sale lungo la retta mentre si scalda
  if (t > 17.0 && t < 40.6) dot(ctx, gp(tGas(t), pA(tGas(t))), C.g, life(t, 17.0, 40.6, .4, .4), 11);
  // lo zero assoluto
  const kz = P(t, 45.2, 45.8, E.back), zx = gp(-ZK, 0)[0];
  if (kz > 0) {
    dot(ctx, [zx, Y0], C.v, kz, 12);
    drawRich(ctx, '{v:−273,15 °C}', zx + 10, Y0 + 30, { size: 30, alpha: P(t, 45.4, 45.9) });
  }
  // i gas veri diventano liquidi prima: il tratteggio è solo un prolungamento
  const kl = life(t, 64.2, T_FINE, .4, .4);
  if (kl > 0) drawRich(ctx, '{dim:tratteggio: prolungamento}\n{r:un gas vero è già liquido}', 1160, 360, { size: 30, alpha: kl });
  // la scala Kelvin, sotto quella in gradi Celsius
  const kk = P(t, 73.9, 74.5);
  if (kk > 0) {
    ctx.save(); ctx.globalAlpha *= kk;
    for (let T = 0; T <= 300; T += 100) txt(ctx, String(T), gp(T - ZK, 0)[0], Y0 + 70, { size: 29, color: C.v });
    drawRich(ctx, '{mink:T}{v: (K)}', 860, Y0 + 70, { size: 30, align: 'right' });
    ctx.restore();
  }
  // in kelvin: proporzionalità diretta, la retta passa per l'origine della scala Kelvin
  const kd = life(t, 78.7, 88.0, .4, .4);
  if (kd > 0) drawRich(ctx, '{mv:p}{mink:/T}{dim: costante:}\n{dim:retta per 0 K}', 1110, 455, { size: 30, alpha: kd });
  const kn = life(t, 83.5, T_FINE, .4, .4);
  if (kn > 0) drawRich(ctx, '0 K: {mv:p} = {g:0}', 900, 540, { size: 34, align: 'left', alpha: kn });
  ctx.restore();
}

// in una frase (93,2–103,6)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 101.7, 102.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 93.4 });
    drawRich(ctx, 'Il freddo ha un limite:\n{v:0 K}, cioè −273,15 °C.', W / 2, 290, { size: 70, weight: 600, local: t - 93.8, stagger: .09 });
  });
  const pills = [[490, '{mink:T = t +} 273,15'], [960, 'a volume costante\n{mv:p} cresce con {mink:T}'], [1430, 'lo zero assoluto\n{r:non si raggiunge}']];
  pills.forEach(([x, s], i) => {
    const a = 95.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 8.0, 9.0, [.45, .45]],                                  // il recipiente rigido, le molecole
    ['pop', 17.0, .35], ['pop', 17.4, .45],                                           // il grafico, 0 °C: 100 kPa
    ['tono', 21.6, 23.6, [.3, .37, .41, .44, .46, .48, .48, .49, .49]], ['pop', 23.6, .5],   // a 50 °C: 118 kPa
    ['tono', 26.2, 28.2, [.5, .57, .61, .64, .66, .68, .68, .69, .69]], ['pop', 28.2, .6],   // a 100 °C: 137 kPa
    ['traccia', 30.8, 32.0],                                                          // la retta
    ['traccia', 40.8, 43.4], ['tono', 40.8, 43.4, [.5, 0]],                           // prolungata verso il freddo
    ['pop', 45.2, .7], ['ding', 45.6],                                                // −273,15 °C
    ['pop', 50.2, .4], ['traccia', 50.2, 51.4],                                       // meno gas: un'altra retta
    ['traccia', 51.6, 54.2], ['tono', 51.6, 54.2, [.3, 0]], ['ding', 54.4],           // punta allo stesso punto
    ['pop', 59.2, .55], ['traccia', 59.4, 60.6],                                      // più gas
    ['traccia', 60.8, 63.4], ['tono', 60.8, 63.4, [.75, 0]], ['pop', 63.4, .5],       // sempre −273,15 °C
    ['pop', 64.2, .35],                                                               // un gas vero è già liquido
    ['pop', 73.9, .55], ['pop', 78.7, .45], ['pop', 83.5, .5],                        // la scala Kelvin, p/T costante, 0 K
    ['soffio', 93.4], ['pop', 95.6, .5], ['pop', 96.1, .6], ['pop', 96.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il freddo che non si supera', durata: 103.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI, stati: [[45.2, 'ghiaccio'], [66.0, 'liquida']] },
    capitoli: [[7.5, 40.4, 'a volume costante'], [40.4, 68.8, 'tutte allo stesso punto'], [68.8, T_FINE, 'la scala Kelvin']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaEsperimento(ctx, t); scenaFine(ctx, t); },
  };
});
