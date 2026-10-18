'use strict';
/* L'occhio e gli occhiali — come una lente corregge l'occhio. Cornea e cristallino fanno da una lente convergente sola
   (focale 2,0 cm, occhio a riposo); i raggi di una cosa lontana, quasi paralleli, si incontrano sulla retina: nitido.
   Occhio miope: la retina sta più indietro (2,216 cm), i raggi si incontrano prima e sulla retina arriva una macchia;
   una lente divergente di focale −20 cm (−5 diottrie) a 0,5 cm dall'occhio li allarga e il punto torna sulla retina
   (il miope vede nitido fino a 20,5 cm dall'occhio). Occhio ipermetrope: retina più avanti (1,814 cm), a riposo i raggi
   la raggiungono prima di incontrarsi; una lente convergente di +20 cm (+5 diottrie) li riporta sulla retina.
   Le posizioni della retina sono calcolate perché quegli occhiali correggano esattamente: 1/q = 1/2 − 1/20,5 e
   1/q = 1/2 + 1/19,5 (cm). Raggi calcolati con le lenti sottili (a ogni lente la pendenza cambia di −y/f).
   Occhio in sezione, 230 px per centimetro (ingrandito). Il riquadro «come vede» è solo indicativo: la sfocatura
   cresce con la macchia sulla retina. Il resto degli strumenti ottici (lente d'ingrandimento, microscopio,
   cannocchiale) è un'altra idea, per un altro video. Argomento: ottica. */
CVIDEO.registra('ottica/occhio', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed, dot } = M;
  const TAU = Math.PI * 2;

const T_FINE = 86.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [21.6, 'felice'], [26.2, 'neutro'],
  [30.8, 'sorpreso'], [35.4, 'pensa'], [39.6, 'neutro'], [44.4, 'festa'], [49.0, 'neutro'], [53.8, 'felice'],
  [58.8, 'neutro'], [63.4, 'sorpreso'], [68.0, 'pensa'], [72.8, 'neutro'], [77.4, 'festa'], [82.0, 'felice'], [89.3, 'felice'],
  [93.3, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Perché chi è miope vede\nsfocato da lontano?'],
  [7.9, 12.4, 'Cornea e cristallino fanno da lente\n{v:convergente}: una lente sola.'],
  [12.6, 16.9, 'In fondo c’è la {v:retina}: lì deve\nformarsi l’immagine.'],
  [17.1, 21.4, 'Da una cosa lontana arrivano\nraggi quasi {x:paralleli}…'],
  [21.6, 26.0, '…e nell’occhio sano si incontrano\nsulla retina: {g:nitido}.'],
  [26.2, 30.6, 'Nell’occhio {v:miope} la retina sta\nun po’ più {v:indietro}…'],
  [30.8, 35.2, '…e i raggi si incontrano {r:prima}:\nsulla retina arriva una macchia.'],
  [35.4, 39.4, 'Da lontano si vede {r:sfocato}.'],
  [39.6, 44.2, 'Serve una lente {v:divergente}: più sottile\nal centro, allarga i raggi…'],
  [44.4, 48.8, '…così si incontrano più indietro,\nproprio {g:sulla retina}.'],
  [49.0, 53.6, 'La sua focale è {mink:f} = −20 cm:\n{v:negativa}, perché è divergente.'],
  [53.8, 58.6, 'Sulla ricetta c’è la {v:potenza}, {mink:1/f}\ncon {mink:f} in metri: −5 diottrie.'],
  [58.8, 63.2, 'Nell’occhio {v:ipermetrope} la retina\nsta invece più {v:avanti}…'],
  [63.4, 67.8, '…e a riposo i raggi la raggiungono\nprima di incontrarsi: {r:sfocato}.'],
  [68.0, 72.6, 'Accomodando ci arriva, ma si stanca;\nda vicino non ce la fa.'],
  [72.8, 77.2, 'Qui serve una lente {v:convergente}:\npiega di più i raggi…'],
  [77.4, 81.8, '…e il punto torna {g:sulla retina}:\n+5 diottrie.'],
  [82.0, 86.6, 'Il segno dice tutto: {v:meno} per\nil miope, {v:più} per l’ipermetrope.'],
  [89.3, 95.1, 'Una lente davanti all’occhio porta\nil punto d’incontro sulla retina.'],
];

// ---------- l'occhio in sezione: 230 px per cm ----------
const K = 230, LX = 700, AY = 440, FOCCHIO = 2.0;                    // cm
const D_SANO = 2.0, D_MIOPE = 1 / (1 / FOCCHIO - 1 / 20.5), D_IPER = 1 / (1 / FOCCHIO + 1 / 19.5);
const G_X = LX - .5 * K, F_MIOPE = -20, F_IPER = 20;                // occhiali a 0,5 cm, focali in cm
const dRet = t => kf(t, [[26.4, D_SANO], [28.4, D_MIOPE], [58.9, D_MIOPE], [61.0, D_IPER]]);
const PUPILLA = 95, ALTEZZE = [-80, -40, 0, 40, 80], X_IN = 150;
// un raggio parallelo all'asse ad altezza y0: occhiali (facoltativi) e lente dell'occhio, fino alla retina
// l'accomodamento dell'ipermetrope (68–72,9): il cristallino si incurva finché la focale scende a quella che serve
const fOcchio = t => kf(t, [[68.4, FOCCHIO], [69.8, D_IPER], [72.5, D_IPER], [72.9, FOCCHIO]]);
function traccia(y0, D, fg, fe = FOCCHIO) {
  const pts = [[X_IN, AY + y0]];
  let y = y0, u = 0;
  if (fg) { pts.push([G_X, AY + y]); u -= y / (fg * K); y += u * (LX - G_X); }
  pts.push([LX, AY + y]);
  u -= y / (fe * K);
  const yr = y + u * D * K;
  pts.push([LX + D * K, AY + yr]);
  return { pts, yr, xFuoco: LX - y / u, u, y };
}

// ---------- aiutanti ----------
function chip(ctx, s, x, y, al = 1, size = 30) {
  if (al <= 0) return;
  const w = M.richW(ctx, s, size) + 22;
  ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
  drawRich(ctx, s, x, y, { size, alpha: al });
}
function occhio(ctx, D, al, fe = FOCCHIO) {
  if (al <= 0) return;
  const xr = LX + D * K, x0 = LX - 70, cx = (x0 + xr) / 2, rx = (xr - x0) / 2, ry = 230;
  ctx.save(); ctx.globalAlpha *= al;
  // il bulbo
  ctx.fillStyle = css(mix(C.x, C.paper, .9)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx, AY, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // la retina, sul fondo
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(cx, AY, rx, ry, 0, -.95, .95); ctx.stroke();
  // l'iride, con la pupilla aperta in mezzo
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(LX - 10, AY - PUPILLA - 8); ctx.lineTo(LX - 10, AY - 175); ctx.moveTo(LX - 10, AY + PUPILLA + 8); ctx.lineTo(LX - 10, AY + 175); ctx.stroke();
  // il cristallino
  const h = 100, s = 24 * (1 + 3 * (FOCCHIO / fe - 1));   // più curvo quando accomoda
  ctx.beginPath(); ctx.moveTo(LX, AY - h); ctx.quadraticCurveTo(LX + 2 * s, AY, LX, AY + h); ctx.quadraticCurveTo(LX - 2 * s, AY, LX, AY - h); ctx.closePath();
  ctx.fillStyle = css(C.x, .25); ctx.fill(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
function lente(ctx, x, conv, al) {   // gli occhiali: convergente (più spessa al centro) o divergente (più sottile)
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const h = 150, s = 22;
  ctx.beginPath();
  if (conv) { ctx.moveTo(x, AY - h); ctx.quadraticCurveTo(x + 2 * s, AY, x, AY + h); ctx.quadraticCurveTo(x - 2 * s, AY, x, AY - h); }
  else { ctx.moveTo(x - s, AY - h); ctx.lineTo(x + s, AY - h); ctx.quadraticCurveTo(x - s * .2, AY, x + s, AY + h); ctx.lineTo(x - s, AY + h); ctx.quadraticCurveTo(x + s * .2, AY, x - s, AY - h); }
  ctx.closePath(); ctx.fillStyle = css(C.g, .18); ctx.fill(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();
}
function linee(ctx, pts, k, col, w, al) {
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; glowStroke(ctx, pts, k, col, w); ctx.restore();
}
// i cinque raggi, la macchia (o il punto) sulla retina; restituisce la mezza larghezza della macchia, in px
function fascio(ctx, D, fg, k, al, fe = FOCCHIO) {
  const R = ALTEZZE.map(y0 => traccia(y0, D, fg, fe));
  R.forEach(r => linee(ctx, r.pts, k, C.y, 4, al));
  const mezza = Math.max(...R.map(r => Math.abs(r.yr)));
  if (k >= 1 && al > 0) {
    const xr = LX + D * K;
    ctx.save(); ctx.globalAlpha *= al;
    if (mezza > 2) { ctx.strokeStyle = css(C.r); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xr + 8, AY - mezza); ctx.lineTo(xr + 8, AY + mezza); ctx.stroke(); }
    else dot(ctx, [xr, AY], C.g, 1, 10);
    ctx.restore();
  }
  return { mezza, R };
}
// «come vede»: le lettere di un ottotipo, sfocate quanto la macchia sulla retina (solo indicativo)
function ottotipo(ctx, sfoco, al) {
  if (al <= 0) return;
  // tre anelli di copie spostate: più la macchia è larga, più gli anelli si allargano
  const x = 1565, y = 315, r = sfoco * 2.2, off = [[0, 0]];
  if (sfoco > .5) [[1, 14], [.62, 9], [.28, 5]].forEach(([q, m]) => { for (let i = 0; i < m; i++) off.push([q * r * Math.cos(TAU * i / m + q), q * r * Math.sin(TAU * i / m + q)]); });
  const n = off.length;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.paper, C.dim, .06)); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(1375, 215, 380, 200, 16); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(1377, 217, 376, 196, 15); ctx.clip();
  off.forEach(([ox, oy]) => {
    txt(ctx, 'E  F  P', x + ox, y - 28 + oy, { size: 64, weight: 600, color: C.ink, alpha: n > 1 ? 2.2 / n : 1 });
    txt(ctx, 'T  O  Z', x + ox, y + 52 + oy, { size: 44, weight: 600, color: C.ink, alpha: n > 1 ? 2.2 / n : 1 });
  });
  ctx.restore();
}

// 0 · titolo
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’occhio e gli occhiali', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–3 · l'occhio, i raggi, gli occhiali (7,5–82)
const FASI = [
  { a: 17.1, b: 39.9, fg: 0, k: [17.3, 19.3] },
  { a: 40.0, b: 58.9, fg: F_MIOPE, k: [40.1, 41.7] },
  { a: 59.0, b: 72.9, fg: 0, k: [59.1, 60.5] },
  { a: 73.0, b: T_FINE, fg: F_IPER, k: [73.1, 74.7] },
];
function fase(t) {
  for (const f of FASI) if (t >= f.a && t <= f.b) return { fg: f.fg, b: f.b, k: P(t, f.k[0], f.k[1], E.lin) };
  return null;
}
// la mezza larghezza della macchia sulla retina, a raggi disegnati (0 se non ci sono)
function macchia(t) {
  const f = fase(t); if (!f || f.k < 1) return -1;
  return Math.max(...ALTEZZE.map(y0 => Math.abs(traccia(y0, dRet(t), f.fg, fOcchio(t)).yr)));
}
function scenaOcchio(ctx, t) {
  if (t < 7.4 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE, .6, .5);
  card(ctx, 110, 110, 1180, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  const D = dRet(t);
  occhio(ctx, D, P(t, 7.9, 8.6), fOcchio(t));
  chip(ctx, '{dim:l’occhio in sezione, ingrandito}', 370, 160, P(t, 8.2, 8.8), 30);
  chip(ctx, '{x:cornea e cristallino}', LX, AY - 205, life(t, 8.4, 16.9, .5, .5), 30);
  chip(ctx, '{v:il cristallino si incurva}', LX, AY - 205, life(t, 68.4, 72.6, .4, .4), 30);
  chip(ctx, '{v:retina}', LX + D * K - 30, AY - 255, P(t, 12.8, 13.3), 30);
  // gli occhiali
  const kgM = life(t, 39.7, 58.8, .4, .3), kgI = life(t, 72.9, T_FINE, .4, .3);
  lente(ctx, G_X, false, kgM); lente(ctx, G_X, true, kgI);
  chip(ctx, '{g:occhiali}', G_X, AY - 190, Math.max(kgM, kgI), 30);
  // i raggi: senza occhiali, con quelli da miope, senza, con quelli da ipermetrope
  const f = fase(t);
  if (f) fascio(ctx, D, f.fg, f.k, 1 - P(t, f.b - .3, f.b), fOcchio(t));
  // dove si incontrano: davanti alla retina (miope) o, prolungando, dietro (ipermetrope)
  const kfM = life(t, 31.0, 39.6, .4, .3);
  if (kfM > 0) { const r = traccia(80, D, 0); dot(ctx, [r.xFuoco, AY], C.r, kfM, 8); chip(ctx, '{r:si incontrano davanti alla retina}', 930, AY + 272, kfM, 30); }
  const kfI = life(t, 63.6, 68.0, .4, .3);
  if (kfI > 0) {
    ALTEZZE.forEach(y0 => { if (!y0) return; const r = traccia(y0, D, 0); dashed(ctx, r.pts[r.pts.length - 1], [r.xFuoco, AY], C.r, P(t, 63.7, 64.5), kfI); });
    const r = traccia(80, D, 0); dot(ctx, [r.xFuoco, AY], C.r, kfI * P(t, 64.3, 64.6), 8);
    chip(ctx, '{r:si incontrerebbero dietro la retina}', 930, AY + 272, kfI, 30);
  }
  ctx.restore();
}

// la scheda di destra: come vede, e gli occhiali
function riga(ctx, s, y, al, size = 34) { if (al > 0) drawRich(ctx, s, 1565, y, { size, alpha: al }); }
function scenaScheda(ctx, t) {
  if (t < 7.6 || t > T_FINE + .3) return;
  const al = life(t, 7.8, T_FINE, .5, .5);
  card(ctx, 1320, 110, 490, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'come vede da lontano', 1565, 150, { size: 36, weight: 600 }));
  const kAcc = life(t, 68.2, 72.8, .4, .4), kRil = P(t, 59.0, 59.5) * (1 - kAcc);
  riga(ctx, '{dim:a occhio rilassato}', 192, kRil, 30); riga(ctx, '{v:accomodando}', 192, kAcc, 30);
  riga(ctx, '{dim:ma si stanca; e da vicino}\n{dim:non ce la fa}', 570, kAcc, 30);
  const m = macchia(t), kO = P(t, 19.3, 19.8);
  ottotipo(ctx, Math.max(0, m), kO);
  if (m >= 0) riga(ctx, m > 2 ? '{r:sfocato}' : '{g:nitido}', 455, kO * (t > 26.3 && t < 31 ? 0 : 1), 40);
  // gli occhiali da miope
  const kM = life(t, 49.0, 58.8, .4, .4);
  if (kM > 0) {
    riga(ctx, 'lente {v:divergente}', 545, kM);
    riga(ctx, '{mink:f} = −20 cm = −0,20 m', 610, kM);
    riga(ctx, 'potenza = {mink:1/f}', 680, kM * P(t, 54.0, 54.5));
    riga(ctx, '= {g:−5 diottrie}', 740, kM * P(t, 55.0, 55.5), 40);
  }
  // gli occhiali da ipermetrope
  const kI = life(t, 77.4, T_FINE, .4, .4);
  if (kI > 0) {
    riga(ctx, 'lente {v:convergente}', 545, kI);
    riga(ctx, '{mink:f} = +20 cm = +0,20 m', 610, kI);
    riga(ctx, 'potenza = {mink:1/f}', 680, kI);
    riga(ctx, '= {g:+5 diottrie}', 740, kI, 40);
  }
  ctx.restore();
}

// 4 · in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 96.6, 97.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Gli occhiali spostano il punto\nin cui i raggi si incontrano.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'miope: {v:divergente},\ndiottrie {v:negative}'], [960, 'ipermetrope: {v:convergente},\ndiottrie {v:positive}'], [1430, 'potenza = {mink:1/f}\n({mink:f} in metri)']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.35 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): le retine, e la macchia sulla retina nei quattro casi (px; 0 = a fuoco)
  const verifica = {
    retinaMiopeCm: +D_MIOPE.toFixed(4), retinaIperCm: +D_IPER.toFixed(4),
    macchiaPx: [[D_SANO, 0], [D_MIOPE, 0], [D_MIOPE, F_MIOPE], [D_IPER, 0], [D_IPER, F_IPER]].map(([D, fg]) => +Math.max(...ALTEZZE.map(y0 => Math.abs(traccia(y0, D, fg).yr))).toFixed(3)),
    diottrie: [1 / (F_MIOPE / 100), 1 / (F_IPER / 100)], puntoRemotoMiopeCm: 1 / (1 / FOCCHIO - 1 / D_MIOPE),
  };
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.3, .5], ['pop', 13.0, .45],                            // l'occhio, la retina
    ['traccia', 17.3, 19.3], ['pop', 19.3, .55], ['pop', 19.6, .4], ['ding', 21.8],   // raggi paralleli: nitido
    ['tono', 26.4, 28.4, [.5, .51, .55, .68, .81, .85, .86]],                         // miope: la retina va indietro
    ['pop', 31.2, .5],                                                                // si incontrano davanti
    ['pop', 40.0, .55], ['traccia', 40.1, 41.7], ['pop', 41.7, .5],                   // la lente divergente
    ['pop', 49.2, .45], ['pop', 54.2, .45], ['ding', 55.5],                           // f, potenza, meno 5 diottrie
    ['tono', 58.9, 61.0, [.86, .85, .76, .53, .29, .2, .19]],                         // ipermetrope: la retina avanti
    ['traccia', 59.1, 60.5],                                                          // i raggi
    ['traccia', 63.7, 64.5], ['pop', 64.5, .5],                                       // si incontrerebbero dietro
    ['tono', 68.4, 69.8, [.33, .34, .38, .5, .62, .67, .68]],                         // il cristallino si incurva
    ['tono', 72.5, 72.9, [.68, .65, .5, .35, .33]],                                   // e si rilassa
    ['pop', 73.2, .55], ['traccia', 73.1, 74.7], ['pop', 74.7, .5],                   // la lente convergente
    ['pop', 77.7, .45],                                                               // più 5 diottrie
    ['soffio', 86.9], ['pop', 88.4, .5], ['pop', 88.9, .6], ['pop', 89.4, .7],        // in una frase
  ];
  return {
    titolo: 'L’occhio e gli occhiali', durata: 97.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.0, 'l’occhio'], [26.0, 58.6, 'il miope'], [58.6, 86.6, 'l’ipermetrope']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaOcchio(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
