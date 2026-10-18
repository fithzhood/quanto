'use strict';
/* Da dove viene l'energia che usiamo — le fonti di energia primaria (presa dalla natura, prima di trasformarla), con i numeri
   veri arrotondati e dichiarati «circa»: il mondo usa ≈ 6,2·10²⁰ J all'anno (≈ 620 EJ, anni recenti; Energy Institute,
   Statistical Review of World Energy); diviso fra 8·10⁹ persone e 3,15·10⁷ s fa ≈ 2460 W a testa, circa 2500 W, come 25
   lampadine da 100 W sempre accese. Quote arrotondate (somma 100): petrolio 32%, carbone 26%, gas naturale 23% (fossili 81%),
   nucleare 4%, idroelettrico 6%, eolico e solare 6%, altre rinnovabili (biomasse moderne, geotermia) 3%: non rinnovabili 85%,
   rinnovabili 15%. Il Sole: 1361 W/m² sul disco della Terra, π·(6,37·10⁶ m)² ≈ 1,27·10¹⁴ m² → ≈ 1,7·10¹⁷ W; l'energia di un
   anno arriva in 6,2·10²⁰ / 1,7·10¹⁷ ≈ 3600 s, circa un'ora. Le forme di energia e la catena con i rendimenti sono in
   energia/forme ed energia/catena. Argomento: energia. */
CVIDEO.registra('energia/fonti', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.5;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [17.1, 'sorpreso'], [21.7, 'felice'],
  [26.5, 'neutro'], [44.1, 'sorpreso'], [48.7, 'neutro'], [57.5, 'felice'], [61.7, 'neutro'], [66.5, 'pensa'],
  [71.1, 'neutro'], [75.8, 'felice'], [80.4, 'pensa'], [85.0, 'sorpreso'], [89.6, 'festa'], [96.2, 'felice'],
  [100.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Da dove viene l’energia\nche usiamo ogni giorno?'],
  [7.9, 12.3, 'In un anno l’umanità usa circa\n6,2·10²⁰ J di energia {v:primaria}…'],
  [12.5, 16.9, '…cioè presa dalle fonti, prima\ndi trasformarla in altro.'],
  [17.1, 21.5, 'Divisa fra 8 miliardi di persone:\ncirca {g:2500 W} a testa.'],
  [21.7, 26.1, 'Come 25 lampadine da 100 W\naccese giorno e notte.'],
  [26.5, 30.9, 'Da dove viene? Ogni quadretto\nè l’1% del totale.'],
  [31.1, 35.5, 'Il {y:petrolio}: circa 32 quadretti.'],
  [35.7, 39.7, 'Il {y:carbone}: circa 26.'],
  [39.9, 43.9, 'Il {y:gas naturale}: circa 23.'],
  [44.1, 48.5, 'Insieme sono i combustibili {y:fossili}:\ncirca l’81%, più di quattro quinti!'],
  [48.7, 52.7, 'Il {v:nucleare}: circa 4.'],
  [52.9, 57.3, 'L’{x:idroelettrico}, l’acqua\ndelle dighe: circa 6.'],
  [57.5, 61.5, 'Il {g:vento} e il {g:Sole}: circa 6.'],
  [61.7, 66.1, 'Il resto, circa 3: biomasse\ne calore della Terra.'],
  [66.5, 70.9, 'Fossili e uranio sono fonti\n{v:non rinnovabili}: prima o poi finiscono.'],
  [71.1, 75.6, 'Il petrolio si forma in milioni d’anni;\nlo bruciamo in pochi secoli.'],
  [75.8, 80.2, 'Le {g:rinnovabili} si rinnovano\nda sole: acqua, vento, Sole.'],
  [80.4, 84.6, 'Oggi sono circa il {g:15%}\ndell’energia che usiamo.'],
  [85.0, 89.4, 'Eppure il Sole manda sulla Terra\n1,7·10¹⁷ J ogni secondo.'],
  [89.6, 94.1, 'In circa {g:un’ora} ci manda tutta\nl’energia che usiamo in un anno.'],
  [96.2, 101.8, 'Usiamo soprattutto fonti che finiscono,\nma il Sole ne manda molta di più.'],
];

// ---------- i numeri ----------
const E_ANNO = 6.2e20, PERSONE = 8e9, S_ANNO = 3.15e7, W_TESTA = E_ANNO / (PERSONE * S_ANNO);   // ≈ 2460 W
const P_SOLE = 1361 * Math.PI * 6.37e6 * 6.37e6, T_SOLE = E_ANNO / P_SOLE;                         // ≈ 1,7·10¹⁷ W, ≈ 3600 s
const FONTI = [   // quote arrotondate, in quadretti da 1%
  { nome: 'petrolio', q: 32, col: () => mix(C.y, C.ink, .4), t: 31.3 },
  { nome: 'carbone', q: 26, col: () => mix(C.ink, C.dim, .3), t: 35.9 },
  { nome: 'gas naturale', q: 23, col: () => C.y, t: 40.1 },
  { nome: 'nucleare', q: 4, col: () => C.v, t: 48.9 },
  { nome: 'idroelettrico', q: 6, col: () => C.x, t: 53.1 },
  { nome: 'vento e Sole', q: 6, col: () => C.g, t: 57.7 },
  { nome: 'biomasse, geotermia', q: 3, col: () => mix(C.g, C.paper, .5), t: 61.9 },
];
let somma = 0; FONTI.forEach(F => { F.da = somma; somma += F.q; });                          // somma = 100
const migliaia = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Da dove viene l’energia\nche usiamo', W / 2, 230, { size: 104, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.15 }));
}

// ---------- 1 · quanta ne usiamo (7,5–26,3) ----------
function lampadina(ctx, x, y, acceso) {
  ctx.save();
  if (acceso > 0) { ctx.fillStyle = css(C.y, .2 * acceso); ctx.beginPath(); ctx.arc(x, y - 8, 40, 0, TAU); ctx.fill(); }
  ctx.fillStyle = css(mix(C.paper, C.y, .6 * acceso)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(x, y - 10, 21, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(x + 9, y + 17); ctx.lineTo(x - 9, y + 17); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.dim); ctx.fillRect(x - 9, y + 19, 18, 10);
  ctx.restore();
}
function scenaQuanta(ctx, t) {
  if (t < 7.5 || t > 26.8) return;
  const al = life(t, 7.7, 26.3, .5, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'tutta l’umanità, in un anno', 610, 170, { size: 40, weight: 600 }));
  drawRich(ctx, '≈ {g:6,2·10²⁰ J}', 610, 270, { size: 80, local: t - 8.0 });
  drawRich(ctx, '{dim:energia}{v: primaria}{dim:: presa dalle fonti,}\n{dim:prima di trasformarla}', 610, 390, { size: 32, alpha: P(t, 12.7, 13.2), lh: 1.35 });
  const kD = P(t, 17.3, 17.8);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(170, 470); ctx.lineTo(1050, 470); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{dim:8·10⁹ persone; 1 anno ≈ 3,15·10⁷ s}', 610, 520, { size: 32, alpha: kD });
    drawRich(ctx, '6,2·10²⁰ J / (8·10⁹ · 3,15·10⁷ s)', 610, 590, { size: 40, alpha: kD });
    drawRich(ctx, '≈ {g:2500 W} {dim:a testa}', 610, 680, { size: 56, alpha: P(t, 18.4, 18.9) });
  }
  ctx.restore();
  // 25 lampadine da 100 W
  const kL = life(t, 21.8, 26.3, .5, .5);
  if (kL > 0) {
    card(ctx, 1140, 110, 670, 680, kL);
    ctx.save(); ctx.globalAlpha *= kL;
    for (let i = 0; i < 25; i++) {
      const x = 1255 + (i % 5) * 110, y = 210 + Math.floor(i / 5) * 100;
      lampadina(ctx, x, y, P(t, 22.0 + i * .05, 22.3 + i * .05));
    }
    drawRich(ctx, '25 · 100 W = {g:2500 W}', 1475, 735, { size: 40 });
    ctx.restore();
  }
}

// ---------- 2 · le fonti: cento quadretti (26,3–84,8) ----------
const QX = 248, QY = 143, QL = 56, QG = 6;
const quadretto = i => [QX + (i % 10) * (QL + QG), QY + Math.floor(i / 10) * (QL + QG)];
function scenaFonti(ctx, t) {
  if (t < 26.2 || t > 85.2) return;
  const al = life(t, 26.4, 84.8, .5, .5);
  card(ctx, 110, 110, 890, 680, al);
  card(ctx, 1030, 110, 780, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // i quadretti vuoti, poi pieni fonte per fonte; le non rinnovabili si spengono quando si parla delle rinnovabili
  const kVuoti = P(t, 26.6, 27.4), spegni = life(t, 75.9, 84.8, .5, .3);
  for (let i = 0; i < 100; i++) {
    const [x, y] = quadretto(i);
    ctx.save(); ctx.globalAlpha *= kVuoti; ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y, QL, QL, 8); ctx.stroke(); ctx.restore();
  }
  FONTI.forEach((F, j) => {
    const rinn = j >= 4;
    for (let n = 0; n < F.q; n++) {
      const k = P(t, F.t + .25 + n * .035, F.t + .45 + n * .035, E.back);
      if (k <= 0) continue;
      const [x, y] = quadretto(F.da + n), c = QL / 2;
      ctx.save(); ctx.translate(x + c, y + c); ctx.scale(k, k);
      ctx.globalAlpha *= rinn ? 1 : 1 - .7 * spegni;
      ctx.fillStyle = css(F.col()); ctx.beginPath(); ctx.roundRect(-c, -c, QL, QL, 8); ctx.fill();
      ctx.restore();
    }
  });
  // la legenda
  conFont(TITOLI, () => drawRich(ctx, 'le fonti, nel mondo', 1420, 165, { size: 38, weight: 600, alpha: P(t, 26.6, 27.1) }));
  drawRich(ctx, '{dim:un quadretto = 1%; quote arrotondate}', 1420, 212, { size: 30, alpha: P(t, 26.8, 27.3) });
  const YR = [280, 340, 400, 475, 550, 610, 670];
  FONTI.forEach((F, j) => {
    const k = P(t, F.t, F.t + .4);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k * (j >= 4 ? 1 : 1 - .6 * spegni);
    ctx.fillStyle = css(F.col()); ctx.beginPath(); ctx.roundRect(1070, YR[j] - 15, 30, 30, 6); ctx.fill();
    drawRich(ctx, F.nome, 1118, YR[j], { size: 32, align: 'left' });
    drawRich(ctx, '≈ ' + F.q + '%', 1560, YR[j], { size: 34, weight: 600, align: 'right' });
    ctx.restore();
  });
  // le parentesi: prima i fossili, poi non rinnovabili e rinnovabili
  const graffa = (y0, y1, s, col, a) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(1585, y0 - 18); ctx.lineTo(1600, y0 - 18); ctx.lineTo(1600, y1 + 18); ctx.lineTo(1585, y1 + 18); ctx.stroke();
    ctx.restore();
    drawRich(ctx, s, 1622, (y0 + y1) / 2, { size: 30, align: 'left', alpha: a, lh: 1.25 });
  };
  graffa(YR[0], YR[2], '{y:fossili}\n{y:≈ 81%}', C.y, life(t, 44.3, 66.6, .4, .4));
  graffa(YR[0], YR[3], '{v:non}\n{v:rinnovabili}\n{v:≈ 85%}', C.v, life(t, 66.7, 84.8, .4, .4));
  graffa(YR[4], YR[6], '{g:rinnovabili}\n{g:≈ 15%}', C.g, life(t, 76.0, 84.8, .4, .4));
  // milioni di anni contro pochi secoli
  const kT = life(t, 71.3, 75.7, .4, .4);
  if (kT > 0) {
    ctx.save(); ctx.globalAlpha *= kT;
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(1060, 715, 720, 62, 14); ctx.fill(); ctx.stroke();
    drawRich(ctx, 'si forma in {v:milioni di anni}, si brucia in {y:secoli}', 1420, 746, { size: 30 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · il Sole (84,8–T_FINE) ----------
function scenaSole(ctx, t) {
  if (t < 84.6 || t > T_FINE + .2) return;
  const al = life(t, 84.9, T_FINE, .5, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il Sole, la luce, la Terra (non in scala)
  const sx = 330, sy = 330, R = 120;
  ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + t * .15; ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * R * 1.18, sy + Math.sin(a) * R * 1.18); ctx.lineTo(sx + Math.cos(a) * R * 1.42, sy + Math.sin(a) * R * 1.42); ctx.stroke(); }
  ctx.fillStyle = css(mix(C.y, C.paper, .2)); ctx.beginPath(); ctx.arc(sx, sy, R, 0, TAU); ctx.fill();
  ctx.restore();
  const ex = 1000, ey = 330, r = 46;
  ctx.save(); ctx.strokeStyle = css(C.y, .55); ctx.lineWidth = 3; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 60;
  for (let j = -2; j <= 2; j++) { ctx.beginPath(); ctx.moveTo(sx + R * 1.6, sy + j * 20); ctx.lineTo(ex - r - 14, ey + j * 20); ctx.stroke(); }
  ctx.restore();
  ctx.fillStyle = css(mix(C.x, C.paper, .25)); ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.fill();
  ctx.fillStyle = css(mix(C.g, C.paper, .2)); ctx.beginPath(); ctx.ellipse(ex - 12, ey - 10, 18, 12, .5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ex + 16, ey + 16, 12, 9, -.3, 0, TAU); ctx.fill();
  txt(ctx, 'Sole', sx, sy + R + 70, { size: 34, weight: 600 });
  txt(ctx, 'Terra', ex, ey + r + 40, { size: 34, weight: 600 });
  txt(ctx, '(non in scala)', 700, 470, { size: 30, color: C.dim });
  // i conti, a destra
  drawRich(ctx, '{dim:su ogni m², fuori dall’aria:} 1361 W', 1480, 190, { size: 32, local: t - 85.1 });
  drawRich(ctx, '{dim:su tutto il disco della Terra:}', 1480, 250, { size: 30, local: t - 85.5 });
  drawRich(ctx, '1361 W/m² · {mink:π} · (6,37·10⁶ m)²', 1480, 300, { size: 34, local: t - 85.7 });
  drawRich(ctx, '≈ {g:1,7·10¹⁷ W}', 1480, 385, { size: 60, alpha: P(t, 86.2, 86.7) });
  drawRich(ctx, '{dim:cioè 1,7·10¹⁷ J ogni secondo}', 1480, 465, { size: 30, alpha: P(t, 86.4, 86.9) });
  const kO = P(t, 89.8, 90.3);
  if (kO > 0) {
    ctx.save(); ctx.globalAlpha *= kO; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(240, 560); ctx.lineTo(1680, 560); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{dim:l’energia di un anno:} 6,2·10²⁰ J / 1,7·10¹⁷ W ≈ 3600 s ≈ {g:1 ora}', 960, 640, { size: 44, alpha: kO, local: t - 89.8 });
    drawRich(ctx, '{dim:in un anno il Sole ne manda circa 9000 volte di più}', 960, 720, { size: 32, alpha: P(t, 91.2, 91.7) });
  }
  ctx.restore();
}

// in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 102.5, 103.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Usiamo soprattutto fonti che finiscono;\nil Sole ne manda molta di più.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, 'circa {g:2500 W}\na testa'], [960, 'fossili {y:≈ 81%},\nrinnovabili {g:≈ 15%}'], [1430, 'dal Sole in {g:un’ora}\nl’energia di un anno']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const verifica = { wTesta: W_TESTA, sommaQuote: somma, fossili: 32 + 26 + 23, nonRinnovabili: 32 + 26 + 23 + 4, rinnovabili: 6 + 6 + 3, pSole: P_SOLE, secondi: T_SOLE, ore: T_SOLE / 3600, volteAnno: P_SOLE * S_ANNO / E_ANNO, conti: 6.2e20 / 1.7e17 };
  // effetti sonori (strumenti/suoni-sintesi.py): nei quadretti il tono segue quanti se ne sono riempiti, da 0 (0) a 100 (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.7], ['pop', 8.0, .6], ['pop', 12.7, .4],                             // 6,2·10²⁰ J, energia primaria
    ['pop', 17.3, .45], ['ding', 18.4],                                               // il conto a testa: 2500 W
    ['soffio', 21.8], ['tono', 22.0, 23.5, [.1, .9]],                                 // 25 lampadine si accendono
    ['soffio', 26.4], ['pop', 26.6, .3],                                              // i cento quadretti vuoti
    ['pop', 31.3, .4], ['tono', 31.55, 32.85, [0, .32]],                              // petrolio: 32
    ['pop', 35.9, .4], ['tono', 36.15, 37.25, [.32, .58]],                            // carbone: 26
    ['pop', 40.1, .4], ['tono', 40.35, 41.3, [.58, .81]],                             // gas naturale: 23
    ['ding', 44.4],                                                                   // fossili ≈ 81%
    ['pop', 48.9, .5], ['tono', 49.15, 49.45, [.81, .85]],                            // nucleare: 4
    ['pop', 53.1, .5], ['tono', 53.35, 53.75, [.85, .91]],                            // idroelettrico: 6
    ['pop', 57.7, .5], ['tono', 57.95, 58.35, [.91, .97]],                            // vento e Sole: 6
    ['pop', 61.9, .5], ['tono', 62.15, 62.4, [.97, 1]],                               // biomasse e geotermia: 3
    ['pop', 66.7, .45], ['pop', 71.3, .5],                                            // non rinnovabili; milioni di anni contro secoli
    ['pop', 76.0, .7],                                                                // le rinnovabili: 15%
    ['soffio', 84.9], ['pop', 85.1, .45], ['pop', 85.7, .5], ['ding', 86.2],          // il Sole: 1,7·10¹⁷ W
    ['pop', 91.2, .6],                                                                // 9000 volte di più
    ['soffio', 94.7], ['pop', 96.1, .5], ['pop', 96.6, .6], ['pop', 97.1, .7],        // in una frase
  ];
  return {
    titolo: 'Da dove viene l’energia che usiamo', durata: 104.3, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.3, 'quanta ne usiamo'], [26.3, 66.3, 'le fonti'], [66.3, 84.8, 'rinnovabili e non'], [84.8, T_FINE, 'il Sole']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaQuanta(ctx, t); scenaFonti(ctx, t); scenaSole(ctx, t); scenaFine(ctx, t); },
  };
});
