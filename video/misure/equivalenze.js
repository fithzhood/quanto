'use strict';
/* 72 km/h = 20 m/s — convertire è moltiplicare per 1: 1000 m/1 km e 1 h/3600 s, le unità che si semplificano come
   lettere; la prova con l'auto che fa 20 m ogni secondo; il fattore 3,6. Argomento: misure. */
CVIDEO.registra('misure/equivalenze', M => {
  const { W, C, E, P, life, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, richW, txt, fixedNum, fmtN, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [84.8, 190], [86.1, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [84.8, 1050], [86.1, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [84.8, 2.2], [86.1, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [84.8, 2], [86.1, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [84.8, -1.5], [86.1, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.6, 'felice'], [14.8, 'neutro'],
  [22.4, 'pensa'], [26.8, 'neutro'], [35.8, 'sorpreso'], [38.0, 'neutro'], [43.8, 'felice'], [46.0, 'neutro'],
  [53.4, 'festa'], [56.0, 'neutro'], [62.5, 'felice'], [64.8, 'neutro'], [75.9, 'felice'], [78.2, 'neutro'],
  [87.3, 'felice'], [90.4, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Un’auto va a 72 km/h:\nquanti metri al secondo?'],
  [7.9, 12.4, '1 km e 1000 m: la stessa\nlunghezza, scritta in due modi.'],
  [12.6, 16.7, 'Quindi 1000 m / 1 km\nvale esattamente {g:1}.'],
  [16.9, 21.9, 'Così 1 h = 3600 s,\ne 1 h / 3600 s vale {g:1}.'],
  [22.0, 26.4, 'Moltiplicare per 1 non cambia\nla velocità: cambia solo l’unità.'],
  [26.8, 31.0, 'Scrivo 72 km/h come frazione:\n72 km in 1 h.'],
  [31.2, 35.6, 'Moltiplico per due {g:fattori 1}:\nprima i metri, poi i secondi.'],
  [35.8, 40.0, 'Le unità si semplificano\ncome le lettere: via i {r:km}…'],
  [40.2, 43.6, '…e via le {r:h}.'],
  [43.8, 48.0, 'Restano i metri sopra\ne i secondi sotto: {x:m/s}.'],
  [48.2, 53.2, 'I numeri: 72 · 1000 / 3600\n= 72 000 / 3600 = {g:20}.'],
  [53.4, 57.9, '{g:72 km/h = 20 m/s}: in un secondo\nl’auto fa 20 metri.'],
  [58.3, 62.3, 'Guardo l’auto andare: ogni\nsecondo, {g:20 m} più avanti.'],
  [62.5, 66.5, 'In 3 secondi, 60 metri:\nproprio {g:20 m/s}.'],
  [66.7, 71.0, 'Moltiplicare per 1000 / 3600\nè dividere per {v:3,6}.'],
  [71.3, 75.7, 'Da km/h a m/s si divide:\n72 / 3,6 = 20.'],
  [75.9, 80.15, 'Da m/s a km/h si moltiplica:\n20 · 3,6 = 72.'],
  [80.3, 84.4, 'Per esempio 10 m/s\nsono 36 km/h.'],
  [87.3, 92.6, 'Per cambiare unità, si moltiplica\nper frazioni che valgono 1.'],
];

// ---------- aiutanti ----------
// una riga di fattori centrata in cx: testi ricchi { s, a } o frazioni { n: [pezzi], d: [pezzi], a }, con a = quando compare;
// un pezzo è [testo, nome]: di quelli con un nome si restituisce la posizione, per barrarli o cerchiarli
function riga(ctx, t, items, cx, cy, size) {
  const gap = size * .3, pos = {};
  const wP = ps => ps.reduce((s, [x]) => s + richW(ctx, x, size), 0);
  const ws = items.map(it => it.n ? Math.max(wP(it.n), wP(it.d)) + size * .4 : richW(ctx, it.s, size));
  const tot = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = cx - tot / 2;
  items.forEach((it, i) => {
    const k = P(t, it.a, it.a + .5, E.out);
    if (it.n) {
      const m = x + ws[i] / 2;
      const pezzi = (ps, y) => {
        let xx = m - wP(ps) / 2;
        for (const [s, nome] of ps) { const w = richW(ctx, s, size); if (k > 0) drawRich(ctx, s, xx, y, { size, align: 'left', alpha: k }); if (nome) pos[nome] = [xx, xx + w, y]; xx += w; }
      };
      pezzi(it.n, cy - size * .62); pezzi(it.d, cy + size * .72);
      if (k > 0) {
        ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.ink); ctx.lineWidth = Math.max(2, size * .055); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + size * .1, cy + size * .05); ctx.lineTo(x + ws[i] - size * .1, cy + size * .05); ctx.stroke();
        ctx.restore();
      }
    } else if (k > 0) drawRich(ctx, it.s, x, cy, { size, align: 'left', alpha: k });
    x += ws[i] + gap;
  });
  return pos;
}
// un'unità che si semplifica: una barra rossa che la attraversa
function barra(ctx, p, k, size) {
  if (!p || k <= 0) return;
  const [x0, x1, y] = p;
  ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0 - 4, y + size * .38); ctx.lineTo(lerp(x0 - 4, x1 + 4, k), y + size * .38 - (x1 - x0 + 8) * k * size * .76 / (x1 - x0 + 8)); ctx.stroke();
  ctx.restore();
}
// un'unità che resta: un riquadro verde intorno
function cerchia(ctx, p, k, size) {
  if (!p || k <= 0) return;
  const [x0, x1, y] = p;
  ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(x0 - 5, y - size * .55, x1 - x0 + 12, size * 1.1, 12); ctx.stroke();
  ctx.restore();
}
function auto(ctx, x, y, col, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = css(col);
  ctx.beginPath(); ctx.roundRect(-50, -40, 100, 27, 10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-33, -38); ctx.lineTo(-21, -61); ctx.lineTo(14, -61); ctx.lineTo(33, -38); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.paper, .85);
  ctx.beginPath(); ctx.moveTo(-26, -41); ctx.lineTo(-17, -56); ctx.lineTo(-4, -56); ctx.lineTo(-4, -41); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2, -41); ctx.lineTo(2, -56); ctx.lineTo(11, -56); ctx.lineTo(25, -41); ctx.closePath(); ctx.fill();
  for (const wx of [-28, 28]) {
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(wx, -13, 13, 0, TAU); ctx.fill();
    ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(wx, -13, 5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, '72 km/h = 20 m/s', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// le due schede, sempre al loro posto: sopra le formule, sotto i conti e l'esperimento
function scenaSchede(ctx, t) {
  if (t < 7.5 || t > 85.2) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 84.4, 85.0));
  card(ctx, 372, 110, 1468, 360, al);
  card(ctx, 372, 490, 1468, 300, al);
}

// 1 · moltiplicare per 1 (7.5–26.6)
function scenaUno(ctx, t) {
  if (t < 7.5 || t > 27.0) return;
  const al = 1 - P(t, 26.2, 26.7);
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '1 km = 1000 m', 740, 196, { size: 52, alpha: P(t, 8.2, 8.7), local: t - 8.2 });
  riga(ctx, t, [{ n: [['1000 m']], d: [['1 km']], a: 12.9 }, { s: '= {g:1}', a: 13.6 }], 740, 350, 56);
  drawRich(ctx, '1 h = 3600 s', 1470, 196, { size: 52, alpha: P(t, 17.3, 17.8), local: t - 17.3 });
  riga(ctx, t, [{ n: [['1 h']], d: [['3600 s']], a: 19.0 }, { s: '= {g:1}', a: 19.7 }], 1470, 350, 56);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.globalAlpha *= P(t, 17.0, 17.5);
  ctx.beginPath(); ctx.moveTo(1106, 150); ctx.lineTo(1106, 430); ctx.stroke();
  ctx.restore();
  drawRich(ctx, '72 km/h · {g:1} = 72 km/h', 1106, 640, { size: 60, alpha: life(t, 22.4, 26.6, .5, .4), local: t - 22.4 });
}

// 2 · le unità si semplificano (26.6–57.9)
const PRODOTTO = [{ n: [['72 '], ['km', 'km1']], d: [['1 '], ['h', 'h1']], a: 27.1 }, { s: '·', a: 31.5 },
  { n: [['1000 '], ['m', 'm']], d: [['1 '], ['km', 'km2']], a: 31.6 }, { s: '·', a: 33.0 },
  { n: [['1 '], ['h', 'h2']], d: [['3600 '], ['s', 's']], a: 33.1 }];
const CONTO = [{ s: '72 km/h =', a: 48.4 }, { n: [['72 · 1000 m']], d: [['3600 s']], a: 48.4 }, { s: '=', a: 49.9 },
  { n: [['72 000 m']], d: [['3600 s']], a: 49.9 }, { s: '=', a: 51.3 }, { s: '{g:20 m/s}', a: 51.3 }];
function scenaProdotto(ctx, t) {
  if (t < 26.8 || t > 58.4) return;
  const al = 1 - P(t, 53.0, 53.5);
  if (al > 0) {
    ctx.save(); ctx.globalAlpha *= al;
    const pos = riga(ctx, t, PRODOTTO, 1106, 290, 64);
    barra(ctx, pos.km1, P(t, 36.2, 36.7), 64); barra(ctx, pos.km2, P(t, 36.6, 37.1), 64);
    barra(ctx, pos.h1, P(t, 40.4, 40.9), 64); barra(ctx, pos.h2, P(t, 40.8, 41.3), 64);
    cerchia(ctx, pos.m, P(t, 44.0, 44.4), 64); cerchia(ctx, pos.s, P(t, 44.4, 44.8), 64);
    ctx.restore();
  }
  const ab = 1 - P(t, 57.6, 58.1);
  ctx.save(); ctx.globalAlpha *= ab;
  drawRich(ctx, 'restano {g:m} sopra e {g:s} sotto: {x:m/s}', 1106, 550, { size: 42, alpha: P(t, 44.6, 45.1), local: t - 44.6 });
  riga(ctx, t, CONTO, 1106, 685, 50);
  ctx.restore();
}

// 3 · la prova: un'auto a 20 m/s, col tempo vero (1 s = 1 s) (57.9–66.5)
const X0S = 520, PPM = 20, T0 = 58.8;            // la riga dello 0 in x 520, 20 px per metro; l'auto passa sullo 0 a 58,8 s
const tAuto = t => t - T0;                       // secondi trascorsi dal passaggio sullo 0
function scenaUguale(ctx, t) {
  if (t < 53.2 || t > 67.0) return;
  const al = life(t, 53.6, 66.6, .5, .4);
  drawRich(ctx, '{x:72 km/h} = {g:20 m/s}', 1106, 270, { size: 90, alpha: al, local: t - 53.6 });
  const kc = life(t, 58.3, 66.6, .4, .4);
  if (kc <= 0) return;
  const tt = clamp(tAuto(t), 0, 3);
  ctx.save(); ctx.globalAlpha *= kc;
  txt(ctx, 'tempo', 700, 400, { size: 36, color: C.dim, align: 'right' });
  fixedNum(ctx, fmtN(tt, 2), 860, 400, 46, C.x); txt(ctx, 's', 872, 400, { size: 46, align: 'left' });
  txt(ctx, 'distanza', 1300, 400, { size: 36, color: C.dim, align: 'right' });
  fixedNum(ctx, fmtN(20 * tt, 1), 1480, 400, 46, C.g); txt(ctx, 'm', 1492, 400, { size: 46, align: 'left' });
  ctx.restore();
}
function scenaStrada(ctx, t) {
  if (t < 57.8 || t > 67.0) return;
  const al = P(t, 58.0, 58.5) * (1 - P(t, 66.2, 66.7));
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.dim, .2); ctx.fillRect(400, 600, 1412, 90);
  ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([16, 14]);
  ctx.beginPath(); ctx.moveTo(400, 660); ctx.lineTo(1812, 660); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = css(C.dim, .8);
  for (let m = 0; m <= 60; m += 5) { ctx.beginPath(); ctx.moveTo(X0S + m * PPM, 690); ctx.lineTo(X0S + m * PPM, m % 10 ? 698 : 704); ctx.stroke(); }
  for (let m = 0; m <= 60; m += 10) txt(ctx, String(m), X0S + m * PPM, 728, { size: 30, color: C.dim });
  txt(ctx, 'm', X0S + 60 * PPM + 34, 728, { size: 30, color: C.dim, align: 'left' });
  // dove si trova l'auto a ogni secondo: 0, 20, 40, 60 m
  for (let k = 0; k <= 3; k++) {
    const kk = P(t, T0 + k, T0 + k + .25);
    if (kk <= 0) continue;
    const x = X0S + 20 * k * PPM;
    ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(x, 568); ctx.lineTo(x, 690); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:' + k + ' s}', x, 540, { size: 34, alpha: kk });
  }
  // l'auto, a velocità costante: 20 m ogni secondo
  ctx.save(); ctx.beginPath(); ctx.rect(400, 560, 1412, 140); ctx.clip();
  auto(ctx, X0S + 20 * tAuto(t) * PPM, 648, C.x, .9);
  ctx.restore();
  ctx.restore();
}


// 4 · il fattore 3,6 (66.5–84.6)
function freccia(ctx, xa, xb, y, col, k) {
  if (k <= 0) return;
  const xe = lerp(xa, xb, k), dir = Math.sign(xb - xa);
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xe - dir * 14, y); ctx.stroke();
  arrowHead(ctx, [xe, y], dir > 0 ? 0 : Math.PI, col, 1.1);
  ctx.restore();
}
function scenaFattore(ctx, t) {
  if (t < 66.5 || t > 85.2) return;
  const al = P(t, 66.8, 67.3) * (1 - P(t, 84.4, 85.0));
  ctx.save(); ctx.globalAlpha *= al;
  for (const [x, s] of [[700, 'km/h'], [1510, 'm/s']]) {
    ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 130, 240, 260, 100, 18); ctx.stroke();
    txt(ctx, s, x, 290, { size: 64, weight: 600 });
  }
  freccia(ctx, 850, 1360, 230, C.v, P(t, 71.5, 72.2));
  drawRich(ctx, 'si divide per {v:3,6}', 1105, 186, { size: 38, alpha: P(t, 71.9, 72.3), local: t - 71.9 });
  freccia(ctx, 1360, 850, 350, C.g, P(t, 76.2, 76.9));
  drawRich(ctx, 'si moltiplica per {g:3,6}', 1105, 400, { size: 38, alpha: P(t, 76.6, 77.0), local: t - 76.6 });
  const righe = [[67.0, '72 · 1000 / 3600 = 72 / {v:3,6}', 548], [71.6, '72 km/h = (72 / 3,6) m/s = {g:20 m/s}', 612],
    [76.3, '20 m/s = (20 · 3,6) km/h = {g:72 km/h}', 676], [80.4, '10 m/s = (10 · 3,6) km/h = {g:36 km/h}', 740]];
  for (const [a, s, y] of righe) drawRich(ctx, s, 1106, y, { size: 44, alpha: P(t, a, a + .5), local: t - a });
  ctx.restore();
}

// 5 · in una frase (84.8–95.6)
function scenaFine(ctx, t) {
  if (t < 84.9) return;
  const al = 1 - P(t, 93.1, 94.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.1 });
    drawRich(ctx, 'Convertire è moltiplicare per {g:1}:\nle unità si semplificano come lettere.', W / 2, 290, { size: 66, weight: 600, local: t - 85.5, stagger: .08 });
  });
  const pills = [[490, '1000 m / 1 km = {g:1}\n1 h / 3600 s = {g:1}'], [960, 'da km/h a m/s:\nsi divide per {v:3,6}'], [1430, '{x:72 km/h}\n= {g:20 m/s}']];
  pills.forEach(([x, s], i) => {
    const a = 87.1 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.2, .5],                                                // 1 km = 1000 m
    ['pop', 12.9, .5], ['ding', 13.6],                                                // 1000 m / 1 km = 1
    ['pop', 17.3, .5], ['pop', 19.0, .5], ['ding', 19.7],                             // 1 h / 3600 s = 1
    ['pop', 22.4, .45],                                                               // per 1 non cambia
    ['pop', 27.1, .5], ['pop', 31.6, .55], ['pop', 33.1, .6],                         // 72 km/h per i due fattori
    ['traccia', 36.2, 37.1],                                                          // via i km
    ['traccia', 40.4, 41.3],                                                          // via le h
    ['pop', 44.0, .6], ['pop', 44.4, .65],                                            // restano m e s
    ['pop', 48.4, .5], ['pop', 49.9, .55], ['ding', 51.3],                            // il conto: 20 m/s
    ['pop', 53.6, .7],                                                                // 72 km/h = 20 m/s
    ['soffio', 58.0], ['tono', 58.8, 61.8, [0, .33, .67, 1]],                         // l'auto: la distanza cresce
    ['pop', 59.8, .4], ['pop', 60.8, .5], ['ding', 61.8],                             // 20, 40, 60 m
    ['soffio', 66.8], ['pop', 67.0, .5],                                              // il fattore 3,6
    ['traccia', 71.5, 72.2], ['pop', 71.6, .45],                                      // si divide: 20 m/s
    ['traccia', 76.2, 76.9], ['pop', 76.3, .6],                                       // si moltiplica: 72 km/h
    ['pop', 80.4, .55],                                                               // 10 m/s = 36 km/h
    ['soffio', 85.1], ['pop', 87.1, .5], ['pop', 87.6, .6], ['pop', 88.1, .7],        // in una frase
  ];
  return {
    titolo: '72 km/h = 20 m/s', durata: 95.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.6, 'moltiplicare per 1'], [26.6, 57.9, 'le unità si semplificano'], [57.9, 66.5, 'la prova'], [66.5, 84.6, 'il fattore 3,6']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSchede(ctx, t); scenaUno(ctx, t); scenaProdotto(ctx, t); scenaUguale(ctx, t); scenaStrada(ctx, t); scenaFattore(ctx, t); scenaFine(ctx, t); },
  };
});
