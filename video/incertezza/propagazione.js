'use strict';
/* Gli errori si sommano — somma e differenza: si sommano gli errori assoluti; prodotto e quoziente: si sommano gli
   errori relativi (l'area di un rettangolo misurato). Regola degli errori massimi, con i casi estremi a riprova.
   Argomento: incertezza. */
CVIDEO.registra('incertezza/propagazione', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, richW, txt, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [93.2, 190], [94.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [93.2, 1050], [94.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [93.2, 2.2], [94.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [93.2, 2], [94.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [93.2, -1.5], [94.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [33.7, 'felice'], [36.0, 'neutro'],
  [38.3, 'pensa'], [42.5, 'neutro'], [48.2, 'sorpreso'], [50.4, 'neutro'], [65.6, 'felice'], [67.8, 'neutro'],
  [79.3, 'festa'], [81.8, 'neutro'], [95.7, 'felice'], [99.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.5, 'Dati con un errore:\nche errore ha il risultato?'],
  [7.9, 12.4, 'Due lati misurati col righello:\n{mx:a} = (20,0 ± 0,1) cm…'],
  [12.6, 16.2, '…e {my:b} = (10,0 ± 0,1) cm.'],
  [16.4, 20.4, 'In grigio gli errori,\ndisegnati 10 volte più grandi.'],
  [20.6, 24.4, 'In fila: {mx:a} + {my:b} = 30,0 cm.'],
  [24.6, 29.1, 'Tutti e due più lunghi:\n20,1 + 10,1 = 30,2 cm.'],
  [29.3, 33.5, 'Se sono più corti:\n19,9 + 9,9 = 29,8 cm.'],
  [33.7, 37.9, 'Errore della somma: 0,2 cm.\n{g:Si sommano gli errori assoluti}.'],
  [38.3, 42.3, 'E la differenza {mx:a} − {my:b}?\nGli errori si {r:sottraggono}?'],
  [42.5, 48.0, 'Al massimo 20,1 − 9,9 = 10,2 cm,\nal minimo 19,9 − 10,1 = 9,8 cm.'],
  [48.2, 52.4, '{r:No}: anche qui {g:si sommano}:\n± 0,2 cm.'],
  [52.8, 56.6, 'Ora l’area del rettangolo:\n{mx:a}·{my:b} = 200 cm².'],
  [56.8, 61.0, 'Rettangolo più grande:\n20,1 · 10,1 = 203,01 cm².'],
  [61.2, 65.4, 'Più piccolo:\n19,9 · 9,9 = 197,01 cm².'],
  [65.6, 70.0, 'L’area sta fra le due:\n{g:(200 ± 3) cm²}.'],
  [70.2, 74.95, 'Più svelto, con gli errori relativi:\n{mx:a}: 0,1 / 20,0 = 0,5 %…'],
  [75.1, 79.1, '…{my:b}: 0,1 / 10,0 = 1 %.\nSommati: {g:1,5 %}.'],
  [79.3, 83.5, 'L’1,5 % di 200 cm² è {g:3 cm²}:\nlo stesso risultato!'],
  [83.7, 88.1, 'Prodotto e quoziente: {g:si sommano}\n{g:gli errori relativi}.'],
  [88.3, 93.0, 'Per esempio {mx:a}/{my:b} = 2,00\nha errore 1,5 %: ± 0,03.'],
  [95.7, 101.0, 'Somme e differenze: errori assoluti.\nProdotti e quozienti: relativi.'],
];

// ---------- 1–2 · somma e differenza: segmenti in scala, 40 px per cm; gli errori disegnati 10 volte più grandi ----------
const X0 = 520, PXC = 40, DE = .1 * 10 * PXC;    // 0,1 cm d'errore, ingrandito 10 volte: 40 px
const xs = cm => X0 + cm * PXC;
function barra(ctx, xa, xb, y, col, al = 1, vuota = false) {
  if (al <= 0) return;
  const x = Math.min(xa, xb), w = Math.abs(xb - xa);
  ctx.save(); ctx.globalAlpha *= al;
  if (vuota) { ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.setLineDash([9, 7]); ctx.strokeRect(x, y - 15, w, 30); }
  else { ctx.fillStyle = css(col, .5); ctx.fillRect(x, y - 13, w, 26); ctx.strokeStyle = css(col); ctx.lineWidth = 2; ctx.strokeRect(x, y - 13, w, 26); }
  ctx.restore();
}
function fascia(ctx, x, y, mezza, col, al = 1) {   // la fascia d'errore intorno a un estremo
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col, .22); ctx.fillRect(x - mezza, y - 26, 2 * mezza, 52);
  ctx.strokeStyle = css(col, .8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - mezza, y - 26); ctx.lineTo(x - mezza, y + 26); ctx.moveTo(x + mezza, y - 26); ctx.lineTo(x + mezza, y + 26); ctx.stroke();
  ctx.restore();
}
function tacca(ctx, x, y, testo, col, al) {   // un estremo segnato, col suo valore sopra
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.lineTo(x, y + 30); ctx.stroke();
  txt(ctx, testo, x, y - 50, { size: 30, weight: 600, color: col });
  ctx.restore();
}
function scenaSegmenti(ctx, t) {
  if (t < 7.3 || t > 53.0) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 52.4, 53.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 1468, 360);
  const kf = P(t, 16.6, 17.1);
  txt(ctx, 'errori disegnati 10 volte più grandi', 1810, 146, { size: 30, color: C.dim, align: 'right', alpha: kf });
  drawRich(ctx, '{mx:a}', 500, 200, { size: 40, align: 'right', alpha: P(t, 8.2, 8.7) });
  barra(ctx, xs(0), xs(20), 200, C.x, P(t, 8.2, 8.8)); fascia(ctx, xs(20), 200, DE, C.dim, kf);
  drawRich(ctx, '{my:b}', 500, 280, { size: 40, align: 'right', alpha: P(t, 12.8, 13.3) });
  barra(ctx, xs(0), xs(10), 280, C.y, P(t, 12.8, 13.4)); fascia(ctx, xs(10), 280, DE, C.dim, kf);
  // la somma: b in fila dopo a
  const ks = life(t, 20.8, 38.2, .5, .4);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; const y = 400;
    drawRich(ctx, '{mx:a}{mink: + }{my:b}', 500, y, { size: 40, align: 'right' });
    barra(ctx, xs(0), xs(20), y, C.x); barra(ctx, xs(20), xs(30), y, C.y, P(t, 21.2, 21.7));
    const kl = life(t, 24.8, 38.2, .4, .4), kc = life(t, 29.5, 38.2, .4, .4);
    barra(ctx, xs(0), xs(20) + DE, y, C.x, life(t, 24.8, 29.3, .4, .4), true); barra(ctx, xs(20) + DE, xs(30) + 2 * DE, y, C.y, life(t, 24.8, 29.3, .4, .4), true);
    barra(ctx, xs(0), xs(20) - DE, y, C.x, life(t, 29.5, 33.7, .4, .4), true); barra(ctx, xs(20) - DE, xs(30) - 2 * DE, y, C.y, life(t, 29.5, 33.7, .4, .4), true);
    tacca(ctx, xs(30) + 2 * DE, y, '30,2', C.ink, kl); tacca(ctx, xs(30) - 2 * DE, y, '29,8', C.ink, kc);
    fascia(ctx, xs(30), y, 2 * DE, C.g, P(t, 34.0, 34.5));
    ctx.restore();
  }
  // la differenza: b all'indietro dalla fine di a
  const kd = life(t, 38.5, 52.4, .5, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; const y = 390;
    drawRich(ctx, '{mx:a}{mink: − }{my:b}', 500, y + 10, { size: 40, align: 'right' });
    barra(ctx, xs(0), xs(20), y, C.x); barra(ctx, xs(20), xs(10), y + 34, C.y, P(t, 38.9, 39.4));
    const kM = life(t, 42.7, 48.2, .4, .4), km = life(t, 44.6, 48.2, .4, .4);
    barra(ctx, xs(0), xs(20) + DE, y, C.x, kM, true); barra(ctx, xs(20) + DE, xs(10) + 2 * DE, y + 34, C.y, kM, true);
    barra(ctx, xs(0), xs(20) - DE, y, C.x, km, true); barra(ctx, xs(20) - DE, xs(10) - 2 * DE, y + 34, C.y, km, true);
    tacca(ctx, xs(10) + 2 * DE, y - 20, '10,2', C.ink, life(t, 42.7, 52.4, .4, .4));
    tacca(ctx, xs(10) - 2 * DE, y - 20, '9,8', C.ink, life(t, 44.6, 52.4, .4, .4));
    fascia(ctx, xs(10), y + 17, 2 * DE, C.g, P(t, 48.4, 48.9));
    ctx.restore();
  }
  ctx.restore();
}
function scenaConti(ctx, t) {
  if (t < 7.3 || t > 53.0) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 52.4, 53.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 490, 1468, 300);
  drawRich(ctx, '{mx:a} = (20,0 ± 0,1) cm', 760, 545, { size: 38, alpha: P(t, 8.4, 8.9) });
  drawRich(ctx, '{my:b} = (10,0 ± 0,1) cm', 1450, 545, { size: 38, alpha: P(t, 13.0, 13.5) });
  const r = (a, b, s, y, x = 1106, size = 36) => drawRich(ctx, s, x, y, { size, alpha: life(t, a, b, .45, .4), local: t - a });
  r(20.9, 38.2, '{mx:a} + {my:b} = 20,0 + 10,0 = 30,0 cm', 607);
  r(25.0, 38.2, 'più lunghi: 20,1 + 10,1 = 30,2 cm', 657);
  r(29.7, 38.2, 'più corti: 19,9 + 9,9 = 29,8 cm', 707);
  r(34.0, 38.2, '{mg:a}{g: + }{mg:b}{g: = (30,0 ± 0,2) cm}', 758, 1106, 40);
  r(38.5, 52.4, '{mx:a} − {my:b} = 20,0 − 10,0 = 10,0 cm', 607);
  const sbaglio = 'gli errori si sottraggono? 0,1 − 0,1 = 0';
  r(39.6, 52.4, '{r:' + sbaglio + '}', 657);
  const kx = P(t, 48.3, 48.8) * life(t, 39.6, 52.4, .45, .4);
  if (kx > 0) {
    const w = richW(ctx, sbaglio, 36);
    ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.globalAlpha *= life(t, 39.6, 52.4, .45, .4);
    ctx.beginPath(); ctx.moveTo(1106 - w / 2 - 6, 657); ctx.lineTo(lerp(1106 - w / 2 - 6, 1106 + w / 2 + 6, P(t, 48.3, 48.8)), 657); ctx.stroke(); ctx.restore();
  }
  r(42.7, 52.4, 'massima: 20,1 − 9,9 = 10,2 cm', 707, 760, 34);
  r(44.6, 52.4, 'minima: 19,9 − 10,1 = 9,8 cm', 707, 1450, 34);
  r(48.4, 52.4, '{mg:a}{g: − }{mg:b}{g: = (10,0 ± 0,2) cm}', 758, 1106, 40);
  ctx.restore();
}

// ---------- 3 · il prodotto: l'area del rettangolo, 28 px per cm; errori disegnati 10 volte più grandi ----------
const BX = 450, BY = 540, PR = 28, DR = .1 * 10 * PR;    // spigolo in basso a sinistra; 0,1 cm ingrandito: 28 px
function scenaRettangolo(ctx, t) {
  if (t < 52.4 || t > 93.8) return;
  const al = P(t, 52.6, 53.2) * (1 - P(t, 92.8, 93.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 740, 680);
  txt(ctx, 'errori disegnati 10 volte più grandi', 742, 150, { size: 30, color: C.dim });
  const wa = 20 * PR, hb = 10 * PR;
  // la fascia dell'errore sull'area: fra il rettangolo più grande e il più piccolo
  const kb = P(t, 65.8, 66.4);
  if (kb > 0) {
    ctx.fillStyle = css(C.g, .22 * kb); ctx.beginPath();
    ctx.rect(BX, BY - hb - DR, wa + DR, hb + DR); ctx.rect(BX, BY - hb + DR, wa - DR, hb - DR); ctx.fill('evenodd');
  }
  ctx.fillStyle = css(C.x, .1); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(BX, BY - hb, wa, hb); ctx.fill(); ctx.stroke();
  // il più grande (20,1 · 10,1) e il più piccolo (19,9 · 9,9)
  ctx.save(); ctx.setLineDash([10, 8]); ctx.lineWidth = 3;
  ctx.strokeStyle = css(C.v, P(t, 57.0, 57.5)); ctx.strokeRect(BX, BY - hb - DR, wa + DR, hb + DR);
  ctx.strokeStyle = css(C.v, P(t, 61.4, 61.9)); ctx.strokeRect(BX, BY - hb + DR, wa - DR, hb - DR);
  ctx.restore();
  drawRich(ctx, '{mx:a}', BX + wa / 2, BY + 44, { size: 38 });
  drawRich(ctx, '{my:b}', BX + wa + DR + 18, BY - hb / 2, { size: 38, align: 'left' });
  txt(ctx, '200 cm²', BX + wa / 2 - DR / 2, BY - hb / 2 + DR / 2, { size: 44, weight: 600, alpha: P(t, 53.2, 53.7) });
  drawRich(ctx, '{mx:a} / {my:b} = 2,00 ± 0,03', 742, 700, { size: 40, alpha: P(t, 88.6, 89.1), local: t - 88.6 });
  ctx.restore();
}
function scenaArea(ctx, t) {
  if (t < 52.4 || t > 93.8) return;
  const al = P(t, 52.8, 53.4) * (1 - P(t, 92.8, 93.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1140, 110, 700, 680);
  conFont(TITOLI, () => drawRich(ctx, 'l’area', 1490, 158, { size: 36, weight: 600 }));
  const r = (a, s, y, size = 32) => drawRich(ctx, s, 1490, y, { size, alpha: P(t, a, a + .5), local: t - a });
  r(53.0, '{mx:a}·{my:b} = 20,0 · 10,0 = {g:200 cm²}', 216);
  r(57.0, 'più grande: 20,1 · 10,1 = 203,01 cm²', 268);
  r(61.4, 'più piccola: 19,9 · 9,9 = 197,01 cm²', 318);
  r(65.8, '(203,01 − 197,01) / 2 = {g:3 cm²}', 370);
  const kr = P(t, 67.4, 68.0, E.back);
  if (kr > 0) {
    ctx.save(); ctx.translate(1490, 432); ctx.scale(kr, kr);
    ctx.fillStyle = css(C.g, .12); ctx.beginPath(); ctx.roundRect(-190, -34, 380, 68, 16); ctx.fill();
    drawRich(ctx, '{g:(200 ± 3) cm²}', 0, 0, { size: 48, weight: 600 });
    ctx.restore();
  }
  ctx.save(); ctx.globalAlpha *= P(t, 70.3, 70.7); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1180, 488); ctx.lineTo(1800, 488); ctx.stroke(); ctx.restore();
  conFont(TITOLI, () => drawRich(ctx, 'con gli errori relativi', 1490, 530, { size: 32, weight: 600, alpha: P(t, 70.4, 70.9) }));
  r(71.4, '{mx:a}: 0,1 / 20,0 = 0,5 %', 580, 34);
  r(75.3, '{my:b}: 0,1 / 10,0 = 1 %', 628, 34);
  r(77.0, 'area: 0,5 % + 1 % = {g:1,5 %}', 676, 34);
  r(79.5, '1,5 % di 200 cm² = {g:3 cm²}', 730, 34);
  ctx.restore();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Gli errori si sommano', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
// 4 · in una frase (93.2–104)
function scenaFine(ctx, t) {
  if (t < 93.3) return;
  const al = 1 - P(t, 101.5, 102.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 93.5 });
    drawRich(ctx, 'Somma e differenza: si sommano gli errori {x:assoluti}.\nProdotto e quoziente: si sommano i {v:relativi}.', W / 2, 290, { size: 56, weight: 600, local: t - 93.9, stagger: .07 });
  });
  const pills = [[490, '{mx:a} + {my:b}\n(30,0 ± 0,2) cm'], [960, '{mx:a} − {my:b}\n(10,0 ± 0,2) cm'], [1430, '{mx:a}·{my:b}\n{g:(200 ± 3) cm²}']];
  pills.forEach(([x, s], i) => {
    const a = 95.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 34, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): qui non si muove niente, compaiono segmenti e rettangoli; i pop dei casi
  // estremi sono alti per il più lungo/grande e bassi per il più corto/piccolo
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.2, .6], ['pop', 12.8, .4],                             // i due lati, a e b
    ['pop', 16.6, .3],                                                                // gli errori, 10 volte più grandi
    ['pop', 20.9, .45], ['pop', 21.2, .5],                                            // in fila: a + b
    ['pop', 24.8, .7], ['pop', 29.5, .3], ['ding', 34.0],                             // più lunghi, più corti: (30,0 ± 0,2) cm
    ['pop', 38.5, .5], ['pop', 39.6, .3],                                             // la differenza; gli errori si sottraggono?
    ['pop', 42.7, .7], ['pop', 44.6, .3],                                             // massima e minima
    ['traccia', 48.3, 48.8], ['ding', 48.4],                                          // no: (10,0 ± 0,2) cm
    ['soffio', 52.6], ['pop', 53.0, .5],                                              // il rettangolo: 200 cm²
    ['pop', 57.0, .7], ['pop', 61.4, .3],                                             // più grande, più piccolo
    ['pop', 65.8, .5], ['ding', 67.4],                                                // la fascia: (200 ± 3) cm²
    ['pop', 70.4, .4], ['pop', 71.4, .45], ['pop', 75.3, .55], ['pop', 77.0, .6],     // con gli errori relativi: 0,5 % + 1 % = 1,5 %
    ['pop', 88.6, .55],                                                               // a/b = 2,00 ± 0,03
    ['soffio', 93.5], ['pop', 95.3, .5], ['pop', 95.8, .6], ['pop', 96.3, .7],        // in una frase
  ];
  return {
    titolo: 'Gli errori si sommano', durata: 104.0, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 38.1, 'la somma'], [38.1, 52.5, 'la differenza'], [52.5, 93.0, 'prodotto e quoziente']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSegmenti(ctx, t); scenaConti(ctx, t); scenaRettangolo(ctx, t); scenaArea(ctx, t); scenaFine(ctx, t); },
  };
});
