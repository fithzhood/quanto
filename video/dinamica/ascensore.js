'use strict';
/* La bilancia in ascensore — la bilancia misura N = m·(g + a): conta l'accelerazione, non il verso del moto; in caduta libera segna zero. Argomento: dinamica. */
CVIDEO.registra('dinamica/ascensore', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [89.8, 190], [91.1, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [89.8, 1050], [91.1, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [89.8, 2.2], [91.1, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [89.8, 2], [91.1, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [89.8, -1.5], [91.1, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.2, 'felice'], [26.0, 'sorpreso'],
  [30.6, 'neutro'], [35.1, 'sorpreso'], [39.7, 'pensa'], [44.3, 'neutro'], [53.7, 'felice'], [58.8, 'neutro'],
  [67.9, 'sorpreso'], [72.5, 'pensa'], [76.9, 'sorpreso'], [81.3, 'neutro'], [86.0, 'felice'], [90.0, 'neutro'],
  [92.2, 'felice'], [97.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'In ascensore la bilancia\nsegna sempre lo stesso?'],
  [7.9, 12.7, 'Una ragazza di 50 kg, in ascensore,\nsu una bilancia in newton.'],
  [12.8, 17.4, 'Due forze su di lei:\nil peso {my:P}, 490 N, in giù…'],
  [17.5, 21.1, '…e la spinta {my:N} della bilancia,\nverso l’alto.'],
  [21.2, 25.8, 'La bilancia misura quanto la premi:\nper il terzo principio, proprio {my:N}.'],
  [26.0, 30.5, 'Parte verso l’alto e accelera:\nla bilancia segna {g:di più}, 590 N.'],
  [30.6, 35.0, 'Ora sale a velocità costante:\nla bilancia torna a 490 N.'],
  [35.1, 39.5, 'Frena, ma sta ancora salendo:\nla bilancia segna {g:meno}, 390 N!'],
  [39.7, 44.1, 'Conta l’{v:accelerazione}, non il verso\nin cui si muove l’ascensore.'],
  [44.3, 49.1, 'Secondo principio: {my:N} − {my:P} = {mink:m·}{mv:a},\ncon {mv:a} positiva verso l’alto.'],
  [49.2, 53.6, 'Con {my:P} = {mink:m·g} si ottiene\n{my:N} = {mink:m·(g + }{mv:a}{mink:)}.'],
  [53.7, 58.5, 'Quello che segna la bilancia si\nchiama {g:peso apparente}.'],
  [58.8, 63.3, 'Ora scende e accelera in giù:\nsegna {g:meno}, 390 N.'],
  [63.4, 67.8, 'Scende a velocità costante:\ndi nuovo 490 N.'],
  [67.9, 72.3, 'Frena scendendo: {mv:a} punta in su,\nsegna 590 N.'],
  [72.5, 76.8, 'E se il cavo si spezzasse\ne l’ascensore cadesse libero?'],
  [76.9, 81.2, 'In caduta libera {mv:a} = {mink:g}, in giù:\nsegna {g:zero}!'],
  [81.3, 85.9, 'Il peso c’è ancora, 490 N:\nè la bilancia che non spinge.'],
  [86.0, 89.8, 'Peso {g:apparente} nullo: non è\n«assenza di gravità».'],
  [92.2, 97.0, 'La bilancia sente l’accelerazione,\nnon il verso del moto.'],
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
function fermo(ctx, x, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28);
  txt(ctx, 'fermo immagine', x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il moto dell'ascensore: accelerazioni costanti a tratti, la legge oraria vera ----------
const G = 9.8, MASSA = 50, A = 2, D = 4.5, VM = A * D;   // 2 m/s² per 4,5 s: fino a 9 m/s
const TU = 26.0, TD = 58.8, TF = 77.0, DF = 1.0;          // salita, discesa, caduta libera (1 s vero, poi fermo immagine)
function viaggio(d) {   // spostamento, velocità, accelerazione d secondi dopo la partenza (verso l'alto)
  if (d <= 0) return [0, 0, 0];
  if (d < D) return [A * d * d / 2, A * d, A];
  if (d < 2 * D) return [A * D * D / 2 + VM * (d - D), VM, 0];
  if (d < 3 * D) { const e = d - 2 * D; return [A * D * D / 2 + VM * D + VM * e - A * e * e / 2, VM - A * e, -A]; }
  return [A * D * D + VM * D, 0, 0];
}
const HTOP = A * D * D + VM * D;   // 81 m
const moto = t => { const r = moto0(t); return [r[0] + 30, r[1], r[2]]; };   // il piano terra è 30 m più in basso: la caduta libera parte da 30 m
function moto0(t) {   // [quota in m, velocità, accelerazione]
  if (t < TD) return viaggio(t - TU);
  if (t < TF) { const [s, v, a] = viaggio(t - TD); return [HTOP - s, -v, -a]; }
  const d = clamp(t - TF, 0, DF);
  return [-G * d * d / 2, -G * d, -G];   // dal piano terra verso i piani interrati
}
const N_DI = a => MASSA * (G + a);

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La bilancia in ascensore', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–5 · il vano, la cabina, la ragazza sulla bilancia (la cabina resta ferma sullo schermo: scorrono i piani)
const PXA = 40, YPAV = 745;   // 40 px per metro; il pavimento della cabina sullo schermo
function persona(ctx) {
  const col = mix(C.dim, C.ink, .25);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = css(mix(col, C.ink, .4)); ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(548, 610); ctx.lineTo(546, 698); ctx.moveTo(572, 610); ctx.lineTo(574, 698); ctx.stroke();
  ctx.strokeStyle = css(col); ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(530, 495); ctx.lineTo(518, 590); ctx.moveTo(590, 495); ctx.lineTo(602, 590); ctx.stroke();
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.roundRect(528, 470, 64, 150, 18); ctx.fill();
  ctx.fillStyle = css(mix(col, C.paper, .35)); ctx.beginPath(); ctx.arc(560, 440, 27, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function sceneVano(ctx, t) {
  if (t < 7.5 || t > 90.4) return;
  const al = life(t, 7.6, 90.2, .6, .6);
  const [y] = moto(t);
  ctx.save(); ctx.globalAlpha *= al;
  // il vano con i solai che scorrono
  ctx.save(); ctx.beginPath(); ctx.rect(340, 105, 440, 690); ctx.clip();
  ctx.fillStyle = css(mix(C.dim, C.bg, .84)); ctx.fillRect(340, 105, 440, 690);
  const kp = 1;
  ctx.globalAlpha *= kp; ctx.fillStyle = css(mix(C.dim, C.bg, .5));
  for (let k = Math.floor((y - 3) / 3); k <= Math.ceil((y + 18) / 3); k++) { const yk = YPAV - (3 * k - y) * PXA; ctx.fillRect(340, yk, 440, 14); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= kp;
  for (let k = Math.floor((y - 3) / 3); k <= Math.ceil((y + 18) / 3); k++) {
    const yk = YPAV - (3 * k - y) * PXA;
    if (yk > 125 && yk < 780) txt(ctx, (k < 0 ? '−' : '') + Math.abs(3 * k) + ' m', 325, yk + 7, { size: 30, color: C.dim, align: 'right' });
  }
  ctx.restore();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(340, 105); ctx.lineTo(340, 795); ctx.moveTo(780, 105); ctx.lineTo(780, 795); ctx.stroke();
  // il cavo (si spezza all'inizio della caduta libera)
  if (t < TF) { ctx.strokeStyle = css(C.ink, kp); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(560, 105); ctx.lineTo(560, 250); ctx.stroke(); }
  // la cabina
  ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(380, 250, 360, 495, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .5)); ctx.fillRect(520, 254, 80, 10);   // la luce
  // la bilancia
  ctx.fillStyle = css(mix(C.dim, C.paper, .6)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(475, 700, 170, 40, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.bg); ctx.fillRect(590, 710, 40, 20);
  persona(ctx);
  ctx.restore();
}

// le schede a destra: il moto dell'ascensore, la bilancia, le forze sulla ragazza
function freccina(ctx, x, y0, val, scala, col) {   // freccia verticale con il punto d'origine
  ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(x, y0, 5, 0, Math.PI * 2); ctx.fill();
  if (Math.abs(val) > .01) freccia(ctx, [x, y0], [x, y0 - val * scala], col);
}
const verso = (v, z) => Math.abs(v) < .01 ? z : v > 0 ? 'in su' : 'in giù';
function sceneSchede(ctx, t) {
  if (t < 12.6 || t > 90.4) return;
  const fuori = life(t, 7, 44.6, .1, .5) + life(t, 58.4, 90.2, .5, .6);   // via mentre c'è il conto
  if (fuori <= 0) return;
  const [, v, a] = moto(t), N = N_DI(a);
  // l'ascensore: velocità e accelerazione
  const kB = P(t, 25.2, 25.8) * fuori;
  if (kB > 0) {
    card(ctx, 830, 120, 320, 650, kB);
    ctx.save(); ctx.globalAlpha *= kB;
    conFont(TITOLI, () => drawRich(ctx, 'ascensore', 990, 165, { size: 34, weight: 600 }));
    drawRich(ctx, '{mx:v}{dim: velocità}', 990, 212, { size: 32 });
    drawRich(ctx, '{mv:a}{dim: accelerazione}', 990, 252, { size: 32 });
    txt(ctx, fmtN(Math.abs(v), 1) + ' m/s', 915, 300, { size: 30, color: C.x });
    txt(ctx, fmtN(Math.abs(a), 1) + ' m/s²', 1065, 300, { size: 30, color: C.v });
    txt(ctx, verso(v, ''), 915, 336, { size: 30, color: C.dim });
    txt(ctx, verso(a, ''), 1065, 336, { size: 30, color: C.dim });
    freccina(ctx, 915, 535, v, 16, C.x);
    freccina(ctx, 1065, 535, a, 20, C.v);
    ctx.restore();
  }
  // la bilancia
  const kC1 = P(t, 21.2, 21.8) * fuori;
  if (kC1 > 0) {
    card(ctx, 1190, 120, 650, 180, kC1);
    ctx.save(); ctx.globalAlpha *= kC1;
    conFont(TITOLI, () => drawRich(ctx, 'la bilancia segna', 1515, 160, { size: 34, weight: 600 }));
    ctx.fillStyle = css(C.bg); ctx.strokeStyle = css(C.panelEdge); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(1330, 192, 370, 88, 12); ctx.fill(); ctx.stroke();
    fixedNum(ctx, String(Math.round(N)), 1585, 237, 68, C.g);
    txt(ctx, 'N', 1605, 237, { size: 68, color: C.g, align: 'left' });
    ctx.restore();
  }
  // le forze sulla ragazza: il peso non cambia mai, la spinta della bilancia sì
  const kC2 = P(t, 12.8, 13.4) * fuori;
  if (kC2 > 0) {
    card(ctx, 1190, 330, 650, 440, kC2);
    ctx.save(); ctx.globalAlpha *= kC2;
    conFont(TITOLI, () => drawRich(ctx, 'forze su di lei', 1215, 372, { size: 34, weight: 600, align: 'left' }));
    const xd = 1500, yd = 580, FN = .3, kP = P(t, 13.4, 13.9), kN = P(t, 17.6, 18.1);
    freccia(ctx, [xd, yd + 8], [xd, yd + 8 + 490 * FN], C.y, kP);
    drawRich(ctx, '{my:P} = 490 N', xd + 32, yd + 8 + 245 * FN, { size: 32, align: 'left', alpha: kP });
    freccia(ctx, [xd, yd - 8], [xd, yd - 8 - N * FN], C.y, kN);
    drawRich(ctx, '{my:N} = ' + Math.round(N) + ' N', xd + 32, N > 1 ? yd - 8 - N * FN / 2 : yd - 34, { size: 32, align: 'left', alpha: kN });
    M.dot(ctx, [xd, yd], C.ink, 1, 12);
    // in caduta libera: il peso c'è ancora
    const kx = life(t, 86.1, 90.2, .4, .6);
    if (kx > 0) {
      drawRich(ctx, '{r:«assenza di gravità»}', 1815, 425, { size: 30, align: 'right', alpha: kx });
      const ks = P(t, 87.0, 87.5);
      if (ks > 0) { ctx.save(); ctx.globalAlpha *= kx; ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1525, 427); ctx.lineTo(1525 + 292 * ks, 427); ctx.stroke(); ctx.restore(); }
      drawRich(ctx, '{g:peso apparente nullo}', 1815, 470, { size: 30, align: 'right', alpha: kx * P(t, 87.4, 87.9) });
    }
    ctx.restore();
  }
  fermo(ctx, 1240, 812, life(t, TF + DF, 90.2, .3, .5));
  drawRich(ctx, '{dim:negli ascensori veri scattano}\n{dim:i freni d’emergenza}', 1840, 890, { size: 30, align: 'right', alpha: life(t, 81.4, 90.2, .5, .5) });
}

// 3 · il conto (44,3–58,6)
function sceneConto(ctx, t) {
  if (t < 44 || t > 58.8) return;
  const al = life(t, 44.4, 58.6, .5, .5);
  card(ctx, 830, 120, 1010, 650, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'secondo principio, con {mv:a} positiva in su', 1335, 172, { size: 36, weight: 600 }));
  drawRich(ctx, '{my:N}{mink: − }{my:P}{mink: = m·}{mv:a}', 1335, 270, { size: 58, local: t - 44.8 });
  drawRich(ctx, '{my:N}{mink: = m·(g + }{mv:a}{mink:)}', 1335, 372, { size: 64, local: t - 49.4 });
  drawRich(ctx, '{mink:m} = 50 kg', 1110, 450, { size: 34, local: t - 44.9 });
  drawRich(ctx, '{my:P}{mink: = m·g}', 1335, 450, { size: 34, local: t - 49.4 });
  drawRich(ctx, '{mink:g} = 9,8 m/s²', 1560, 450, { size: 34, local: t - 49.6 });
  drawRich(ctx, 'il valore di {my:N} è il {g:peso apparente}', 1335, 735, { size: 30, local: t - 53.9, stagger: .03 });
  const righe = [['{mv:a}{v: = +2 m/s²}', '50 · 11,8', '{y:590 N}'], ['{mv:a}{v: = 0}', '50 · 9,8', '{y:490 N}'], ['{mv:a}{v: = −2 m/s²}', '50 · 7,8', '{y:390 N}']];
  righe.forEach(([x, c, r], i) => {
    const k = P(t, 53.9 + i * .5, 54.4 + i * .5, E.out);
    if (k <= 0) return;
    drawRich(ctx, x, 1130, 545 + i * 66, { size: 40, align: 'right', alpha: k });
    drawRich(ctx, '{my:N} = ' + c + ' = ' + r, 1170, 545 + i * 66, { size: 40, align: 'left', alpha: k });
  });
  ctx.restore();
}

// 6 · riassunto (90–99,5)
function sceneFine(ctx, t) {
  if (t < 89.9) return;
  const al = 1 - P(t, 97.4, 98.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 90.2 });
    drawRich(ctx, 'La bilancia segna {my:N}{mink: = m·(g + }{mv:a}{mink:)}:\nconta l’accelerazione, non la velocità.', W / 2, 290, { size: 66, weight: 600, local: t - 90.6, stagger: .09 });
  });
  const pills = [[490, '{mv:a} in su:\nsegna {g:di più}'], [960, '{mv:a} in giù:\nsegna {g:di meno}'], [1430, 'caduta libera:\nsegna {g:zero}']];
  pills.forEach(([x, s], i) => {
    const a = 93.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, la cabina
    ['soffio', 12.8], ['pop', 13.4, .2], ['pop', 17.6, .7],                           // le forze: P in giù, N in su
    ['soffio', 21.2], ['soffio', 25.2],                                               // la bilancia, l'ascensore
    ['pop', 26.0, .7], ['tono', 26.0, 30.5, [.2, .21, .24, .29, .38]],                // parte in su: 590 N
    ['pop', 30.5, .5],                                                                // velocità costante: 490 N
    ['pop', 35.0, .3], ['tono', 35.0, 39.5, [.73, .81, .86, .89, .9]],                // frena salendo: 390 N
    ['soffio', 44.4], ['pop', 44.8, .45], ['pop', 49.4, .6],                          // N − P = m·a, N = m·(g + a)
    ['pop', 53.9, .7], ['pop', 54.4, .5], ['pop', 54.9, .3],                          // 590, 490, 390 N
    ['soffio', 58.4],                                                                 // si scende
    ['pop', 58.8, .3], ['tono', 58.8, 63.3, [.9, .89, .86, .81, .73]],                // accelera in giù: 390 N
    ['pop', 63.3, .5],                                                                // velocità costante: 490 N
    ['pop', 67.8, .7], ['tono', 67.8, 72.3, [.38, .29, .24, .21, .2]],                // frena scendendo: 590 N
    ['tono', 77.0, 78.0, [.4, .37, .3, .17, 0]], ['ding', 77.2],                      // il cavo si spezza: segna zero
    ['traccia', 87.0, 87.5], ['pop', 87.4, .6],                                       // non è «assenza di gravità»
    ['soffio', 90.2], ['pop', 93.4, .5], ['pop', 93.9, .6], ['pop', 94.4, .7],        // in una frase
  ];
  return {
    titolo: 'La bilancia in ascensore', durata: 99.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.9, 'la bilancia'], [25.9, 44.2, 'si sale'], [44.2, 58.7, 'il conto'], [58.7, 72.4, 'si scende'], [72.4, 89.9, 'caduta libera']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneVano(ctx, t); sceneSchede(ctx, t); sceneConto(ctx, t); sceneFine(ctx, t); },
  };
});
