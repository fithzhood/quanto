'use strict';
/* La massa sulla molla — carrello su un piano senza attrito, molla di massa trascurabile: moto armonico x = A·cos(ω·t) con
   ω = √(k/m), periodo T = 2π·√(m/k), che non dipende dall'ampiezza. In tempo reale: 1 kg e 10 N/m → 1,99 s; 4 kg → 3,97 s
   (il doppio); 40 N/m → 0,99 s (la metà); 10 cm e 20 cm → stesso periodo, velocità doppia. Argomento: dinamica-applicazioni. */
CVIDEO.registra('dinamica-applicazioni/molla', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [87.4, 190], [88.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [87.4, 1050], [88.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [87.4, 2.2], [88.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [87.4, 2], [88.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [87.4, -1.5], [88.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.4, 'sorpreso'], [23.0, 'neutro'],
  [27.9, 'felice'], [32.8, 'neutro'], [40.8, 'sorpreso'], [45.2, 'felice'], [49.7, 'neutro'], [54.3, 'sorpreso'],
  [58.9, 'felice'], [63.7, 'neutro'], [68.3, 'pensa'], [73.0, 'neutro'], [77.5, 'festa'], [82.1, 'felice'],
  [87.4, 'neutro'], [89.5, 'felice'], [93.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Una massa e una molla:\nche ritmo ha?'],
  [7.9, 12.8, 'Un carrello da 1 kg e una molla,\nsu un piano {g:senza attrito}.'],
  [12.9, 17.1, 'La molla ha {mink:k} = 10 N/m: la sua\n{v:costante elastica}.'],
  [17.2, 20.3, 'Lo sposto: {mink:x} = 10 cm…'],
  [20.4, 22.9, '…e lo lascio.'],
  [23.0, 27.8, 'La molla lo richiama sempre verso\nla posizione di riposo: {my:F} = −{mink:k·x}.'],
  [27.9, 32.7, 'Avanti e indietro: è un {v:moto armonico}\ndi ampiezza {mink:A} = 10 cm.'],
  [32.8, 36.6, 'Un’oscillazione completa dura\n{mink:T} ≈ 1,99 s: il {v:periodo}.'],
  [36.7, 40.7, 'Sotto, la stessa molla\ncon un carrello da 4 kg.'],
  [40.8, 45.1, 'Li lascio insieme: quello da 4 kg\nva {g:più piano}.'],
  [45.2, 49.6, 'Quattro volte la massa: {mink:T} ≈ 3,97 s,\nil {g:doppio}.'],
  [49.7, 54.2, 'Ora una molla più rigida:\n{mink:k} = 40 N/m, quattro volte.'],
  [54.3, 58.8, 'Va {g:più veloce}: {mink:T} ≈ 0,99 s,\nla {g:metà}.'],
  [58.9, 63.6, 'Tutto in una formula:\n{mink:T = 2π·√(m/k)}.'],
  [63.7, 68.2, 'Più massa, più lenta;\nmolla più rigida, più veloce.'],
  [68.3, 72.9, 'E se la tiro di più, ci metterà\npiù tempo a tornare?'],
  [73.0, 77.4, '10 cm sopra, 20 cm sotto:\nli lascio insieme.'],
  [77.5, 82.0, 'Tornano {g:insieme}: il periodo\nnon dipende dall’ampiezza.'],
  [82.1, 87.0, 'Fa il doppio della strada,\nma a velocità {g:doppia}.'],
  [89.5, 94.5, 'Il periodo dipende solo dalla massa\ne dalla molla, non da quanto la tiri.'],
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
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill();
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
// molla orizzontale da x0 a x1 all'altezza y: spire fisse, si allungano e si accorciano
function molla(ctx, x0, x1, y, dura) {
  const n = 14, h = (x1 - x0 - 30) / n;
  ctx.save(); ctx.strokeStyle = css(dura ? C.ink : mix(C.ink, C.paper, .25)); ctx.lineWidth = dura ? 5.5 : 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 15, y);
  for (let i = 0; i < n; i++) ctx.lineTo(x0 + 15 + h * (i + .5), y + (i % 2 ? 18 : -18));
  ctx.lineTo(x1 - 15, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
}

// ---------- il moto vero: x = A·cos(ω·t), ω = √(k/m), in tempo reale ----------
const PXM = 1000, XW = 440, XE = 840, FLA = 400, FLB = 690;      // 1 m = 1000 px (10 cm = 100 px); pavimenti delle due righe
// le prove: [inizio, fine, rilascio, sopra, sotto]; un carrello è { m (kg), k (N/m), A (m), T (periodo, per il pannello) }
const FASI = [
  [7.5, 36.6, 20.6, { m: 1, k: 10, A: .1, T: '1,99' }, null],
  [36.7, 49.6, 41.0, { m: 1, k: 10, A: .1, T: '1,99' }, { m: 4, k: 10, A: .1, T: '3,97' }],
  [49.7, 68.2, 54.3, { m: 1, k: 10, A: .1, T: '1,99' }, { m: 1, k: 40, A: .1, T: '0,99' }],
  [68.3, 87.0, 74.0, { m: 1, k: 10, A: .1, T: '1,99' }, { m: 1, k: 10, A: .2, T: '1,99' }],
];
const om = c => Math.sqrt(c.k / c.m);
function posizione(c, t, i, rel) {
  if (i === 0 && t < 18.6) return c.A * P(t, 17.6, 18.6);      // la mano lo sposta di 10 cm (poi lo tiene fermo fino al rilascio)
  if (t < rel) return c.A;
  return c.A * Math.cos(om(c) * (t - rel));
}
const velocita = (c, t, rel) => t < rel ? 0 : -c.A * om(c) * Math.sin(om(c) * (t - rel));
const FSC = 120, VSC = 300;                                         // px per N, px per m/s
function riga(ctx, fl, c, x, al, vista) {
  if (al <= 0) return;
  const w = c.m >= 4 ? 130 : 90, h = c.m >= 4 ? 100 : 70, xc = XE + x * PXM;
  ctx.save(); ctx.globalAlpha *= al;
  // muro, pavimento, posizione di riposo, righello in cm
  ctx.fillStyle = css(C.dim); ctx.fillRect(XW - 20, fl - 150, 20, 150);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XW - 20, fl); ctx.lineTo(1260, fl); ctx.stroke();
  dashed(ctx, [XE, fl - 66], [XE, fl], C.dim, 1, .7);   // basso: non incrocia le frecce sopra i carrelli
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  for (let k = -2; k <= 2; k++) {
    const xx = XE + k * 100; ctx.beginPath(); ctx.moveTo(xx, fl); ctx.lineTo(xx, fl + 10); ctx.stroke();
    txt(ctx, k < 0 ? '−' + (-k * 10) : String(k * 10), xx, fl + 32, { size: 29, color: C.dim });
  }
  txt(ctx, 'cm', XE + 262, fl + 32, { size: 29, color: C.dim });
  // molla e carrello
  molla(ctx, XW, xc - w / 2, fl - 35, c.k >= 40);
  ctx.fillStyle = css(mix(C.dim, C.paper, .7)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(xc - w / 2, fl - h, w, h, 8); ctx.fill(); ctx.stroke();
  txt(ctx, c.m + ' kg', xc, fl - h / 2, { size: 30, weight: 600 });
  // spostamento, forza, velocità
  const yf = fl - h - 26;
  if (vista.x > 0 && Math.abs(x) > .004) {
    ctx.save(); ctx.globalAlpha *= vista.x;
    freccia(ctx, [XE, fl + 64], [xc, fl + 64], C.ink, 1, 4);
    drawRich(ctx, '{mink:x}', (XE + xc) / 2, fl + 96, { size: 36 });
    ctx.restore();
  }
  if (vista.F > 0) {
    const F = -c.k * x, L = F * FSC;
    if (Math.abs(L) > 6) {
      freccia(ctx, [xc, yf], [xc + L, yf], C.y, vista.F);
      drawRich(ctx, '{my:F}', xc + L + (L > 0 ? 30 : -30), yf, { size: 36, alpha: vista.F * clamp(Math.abs(L) / 30) });
    }
  }
  if (vista.v !== undefined && vista.kv > 0) {
    const L = vista.v * VSC;
    if (Math.abs(L) > 6) {
      freccia(ctx, [xc, yf], [xc + L, yf], C.x, vista.kv);
      drawRich(ctx, '{mx:v}', xc + L + (L > 0 ? 30 : -30), yf, { size: 36, alpha: vista.kv * clamp(Math.abs(L) / 30) });
    }
  }
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La massa sulla molla', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–4 · le prove (7,5–87)
function sceneStage(ctx, t) {
  if (t < 7.5 || t > 87.4) return;
  const al = life(t, 7.5, 87.2, .6, .5);
  card(ctx, 372, 108, 928, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  FASI.forEach(([a, b, rel, A, B], i) => {
    if (t < a - .1 || t > b + .1) return;
    const ka = i === 0 ? P(t, 7.6, 8.1) * (1 - P(t, b - .3, b)) : life(t, a, b, .4, .3);
    const vista = { x: i === 0 ? life(t, 17.4, 36.4, .4, .3) : 0, F: i === 0 ? life(t, 23.2, 36.4, .4, .3) : 0 };
    const vk = i === 3 ? life(t, 82.2, 86.9, .4, .3) : 0;
    riga(ctx, FLA, A, posizione(A, t, i, rel), ka, Object.assign({}, vista, { v: velocita(A, t, rel), kv: vk }));
    if (B) riga(ctx, FLB, B, posizione(B, t, i, rel), i === 0 ? 0 : life(t, a + .3, b, .4, .3), { x: 0, F: 0, v: velocita(B, t, rel), kv: vk });
  });
  // l'ipotesi sbagliata, poi smentita
  const ki = life(t, 68.6, 86.9, .4, .3);
  if (ki > 0) {
    drawRich(ctx, '{r:più strada, più tempo?}', XE, 486, { size: 36, alpha: ki });
    const kx = P(t, 77.7, 78.3);
    if (kx > 0) {
      const w = M.richW(ctx, '{r:più strada, più tempo?}', 36);
      ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(XE - w / 2 - 10, 488); ctx.lineTo(XE - w / 2 - 10 + (w + 20) * kx, 488); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:stesso periodo}', XE, 530, { size: 34, alpha: ki * P(t, 78.0, 78.5) });
    }
  }
  chip(ctx, 400, 762, P(t, 7.8, 8.2), 'tempo reale');
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1585, XL0 = 1355, XS = 1612, XT = 1745;
function scenePannello(ctx, t) {
  if (t < 8.2 || t > 87.4) return;
  const al = life(t, 8.3, 87.2, .5, .5);
  card(ctx, 1330, 108, 510, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'la massa sulla molla', PCX, 165, { size: 38, weight: 600 }));
  const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XL0, y); ctx.lineTo(1810, y); ctx.stroke(); ctx.restore(); };
  const kB = P(t, 36.9, 37.3);
  txt(ctx, 'sopra', XS, 235, { size: 30, weight: 600, color: C.dim });
  txt(ctx, 'sotto', XT, 235, { size: 30, weight: 600, color: C.dim, alpha: kB });
  drawRich(ctx, '{dim:massa} {mink:m}', XL0, 290, { size: 32, align: 'left' });
  drawRich(ctx, '{dim:molla} {mink:k}', XL0, 345, { size: 32, align: 'left', alpha: P(t, 13.0, 13.4) });
  drawRich(ctx, '{dim:ampiezza} {mink:A}', XL0, 400, { size: 32, align: 'left', alpha: P(t, 28.1, 28.5) });
  riga(440, P(t, 32.9, 33.3));
  drawRich(ctx, '{dim:periodo} {mink:T}', XL0, 485, { size: 32, align: 'left', alpha: P(t, 32.9, 33.3) });
  FASI.forEach(([a, b, rel, A, B], i) => {
    const k = i === 0 ? P(t, 8.4, 8.8) * (1 - P(t, b - .3, b)) : life(t, a, b, .4, .3);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    [[A, XS, B], [B, XT, A]].forEach(([c, x, q]) => {
      if (!c) return;
      const col = key => q && c[key] !== q[key] ? '{v:' : '{ink:';
      drawRich(ctx, col('m') + c.m + ' kg}', x, 290, { size: 30 });
      drawRich(ctx, col('k') + c.k + ' N/m}', x, 345, { size: 30, alpha: i ? 1 : P(t, 13.0, 13.4) });
      drawRich(ctx, col('A') + Math.round(c.A * 100) + ' cm}', x, 400, { size: 30, alpha: i ? 1 : P(t, 28.1, 28.5) });
      const tT = rel + 2 * Math.PI / om(c);
      drawRich(ctx, '{g:' + c.T + ' s}', x, 485, { size: 30, alpha: P(t, Math.max(tT, i ? 0 : 33.0), Math.max(tT, i ? 0 : 33.0) + .3) });
    });
    ctx.restore();
  });
  riga(535, P(t, 21.8, 22.2));
  const nota = (s, y, a, b, sz = 32) => drawRich(ctx, s, PCX, y, { size: sz, alpha: life(t, a, b, .4, .3) });
  nota('{my:F} = −{mink:k·x}', 590, 23.2, 36.4, 40);
  nota('{mink:x = A·cos(ω·t)}', 650, 28.1, 36.4, 40);
  nota('{mink:ω = √(k/m)}', 710, 28.1, 36.4, 40);   // formula, ω e il suo nome compaiono insieme
  nota('{mink:ω}{dim: è la pulsazione, in rad/s}', 762, 28.1, 36.4, 30);
  nota('{dim:quattro volte la massa:}', 590, 45.1, 49.6);
  nota('{g:periodo doppio}', 645, 45.4, 49.6, 34);
  nota('{dim:molla 4 volte più rigida:}', 590, 54.9, 58.8);
  nota('{g:periodo metà}', 645, 55.2, 58.8, 34);
  nota('{mink:T = 2π·√(m/k)}', 600, 59.1, 68.2, 46);
  nota('{dim:più} {mink:m}{dim:: più lenta}', 670, 63.9, 68.2);
  nota('{dim:più} {mink:k}{dim:: più veloce}', 720, 64.4, 68.2);
  nota('{g:l’ampiezza non conta}', 600, 77.7, 87.0, 34);
  nota('{dim:strada e velocità doppie}', 655, 82.3, 87.0);
  ctx.restore();
}

// 5 · in una frase (87,4–97)
function sceneFine(ctx, t) {
  if (t < 87.3) return;
  const al = 1 - P(t, 95.1, 96.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.6 });
    drawRich(ctx, 'Il periodo dipende dalla massa\ne dalla molla, non dall’ampiezza.', W / 2, 290, { size: 66, weight: 600, local: t - 88.0, stagger: .09 });
  });
  const pills = [[490, '{mink:T = 2π·√(m/k)}'], [960, 'più massa, più lenta;\npiù rigida, più veloce'], [1430, 'l’ampiezza\n{g:non conta}']];
  pills.forEach(([x, s], i) => {
    const a = 89.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 44, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la posizione del carrello, da −20 cm (0) a +20 cm (1);
  // di ogni oscillazione si sente solo il primo periodo
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4], ['pop', 13.1, .45],                            // il carrello, la costante k
    ['tono', 17.6, 18.6, [.5, .54, .71, .75]],                                        // lo sposto di 10 cm
    ['tono', 20.6, 22.59, [.75, .68, .5, .32, .25, .32, .5, .68, .75]],               // lo lascio: un'oscillazione
    ['pop', 23.3, .5], ['pop', 28.2, .5], ['ding', 33.1],                             // F = −k·x, x = A·cos(ω·t), T ≈ 1,99 s
    ['soffio', 36.7], ['pop', 37.1, .3],                                              // sotto, il carrello da 4 kg
    ['tono', 41.0, 42.99, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['pop', 42.99, .5],   // insieme: 1 kg, 1,99 s…
    ['tono', 41.0, 44.97, [.75, .72, .63, .5, .38, .28, .25, .28, .37, .5, .62, .72, .75]], ['ding', 44.97],   // …4 kg, 3,97 s
    ['pop', 45.5, .55],                                                               // periodo doppio
    ['soffio', 49.7],                                                                 // la molla più rigida
    ['tono', 54.3, 55.29, [.75, .63, .38, .25, .37, .62, .75]], ['ding', 55.29],      // 40 N/m: 0,99 s, la metà
    ['tono', 54.3, 56.29, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['pop', 56.29, .5],
    ['pop', 59.2, .6], ['pop', 64.0, .45], ['pop', 64.5, .5],                         // T = 2π·√(m/k), più m, più k
    ['soffio', 68.3], ['pop', 68.7, .3],                                              // più strada, più tempo?
    ['tono', 74.0, 75.99, [.75, .68, .5, .32, .25, .32, .5, .68, .75]],               // 10 cm e 20 cm, lasciati insieme
    ['tono', 74.0, 75.99, [1, .85, .5, .15, 0, .15, .5, .86, 1]], ['ding', 76.0],     // tornano insieme
    ['traccia', 77.7, 78.3],                                                          // l'ipotesi cancellata
    ['pop', 82.3, .45],                                                               // le velocità: doppie
    ['soffio', 87.4], ['pop', 89.6, .5], ['pop', 90.1, .6], ['pop', 90.6, .7],        // in una frase
  ];
  return {
    titolo: 'La massa sulla molla', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 36.6, 'il moto armonico'], [36.6, 49.6, 'più massa'], [49.7, 58.8, 'molla più rigida'], [58.8, 68.2, 'la formula'], [68.2, 87.0, 'l’ampiezza']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneStage(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
