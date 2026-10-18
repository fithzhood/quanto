'use strict';
/* La lente che capovolge — lente convergente, fuoco e focale; i tre raggi notevoli; oggetto oltre 2f, fra f e 2f, dentro f;
   1/p + 1/q = 1/f (q negativa per l'immagine virtuale). Le immagini disegnate sono l'incrocio vero dei raggi. Argomento: ottica. */
CVIDEO.registra('ottica/lenti', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, glowStroke, dashed, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [97.6, 190], [98.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [97.6, 1050], [98.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [97.6, 2.2], [98.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [97.6, 2], [98.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [97.6, -1.5], [98.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.0, 'felice'], [21.6, 'neutro'],
  [43.4, 'sorpreso'], [47.8, 'neutro'], [57.0, 'pensa'], [62.0, 'festa'], [66.6, 'neutro'], [71.2, 'felice'],
  [75.8, 'neutro'], [80.2, 'sorpreso'], [84.8, 'pensa'], [89.4, 'felice'], [92.8, 'neutro'], [99.8, 'felice'],
  [105.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché una lente, a volte,\ncapovolge le cose?'],
  [7.9, 12.0, 'Una lente {v:convergente}: più spessa\nal centro che ai bordi.'],
  [12.2, 16.8, 'I raggi paralleli all’{v:asse}, dopo\nla lente, passano tutti per un punto…'],
  [17.0, 21.4, '…il {v:fuoco} {mink:F}. La distanza\ndalla lente è la focale {mink:f}.'],
  [21.6, 25.4, 'Dall’altra parte c’è un secondo\nfuoco, alla stessa distanza.'],
  [25.7, 30.0, 'L’oggetto: una freccia a 30 cm.\nLa focale è 10 cm.'],
  [30.2, 34.6, 'Raggio 1: {x:parallelo} all’asse,\npoi passa per il fuoco.'],
  [34.8, 38.8, 'Raggio 2: per il {g:centro}\ndella lente, non devia.'],
  [39.0, 43.2, 'Raggio 3: passa per il fuoco,\npoi esce {v:parallelo}.'],
  [43.4, 47.6, 'Si incontrano in un punto:\nla punta dell’{v:immagine}.'],
  [47.8, 52.2, 'Oltre 2{mink:f}: immagine {g:reale},\ncapovolta, più piccola, a 15 cm.'],
  [52.4, 56.8, 'Reale: su un foglio messo lì\nla vedresti davvero.'],
  [57.0, 61.8, '{mink:p} è la distanza dell’oggetto,\n{mink:q} quella dell’immagine.'],
  [62.0, 66.4, '{mink:1/p + 1/q = 1/f}, e con\ni nostri numeri {g:torna}.'],
  [66.6, 71.0, 'Avvicino l’oggetto a 15 cm:\nora sta fra {mink:f} e 2{mink:f}.'],
  [71.2, 75.6, 'L’immagine è ancora capovolta,\nma {g:più grande}: a 30 cm.'],
  [75.8, 80.0, 'Ancora più vicino, a 6 cm:\ndentro la focale.'],
  [80.2, 84.6, 'I raggi escono {r:divergenti}:\ndopo la lente non si incontrano.'],
  [84.8, 89.2, 'Prolungati all’indietro, sì: immagine\n{v:virtuale}, dritta e più grande.'],
  [89.4, 92.6, 'È la {g:lente d’ingrandimento}.'],
  [92.8, 97.4, 'La formula vale ancora, con {mink:q}\n{r:negativa}: −15 cm, virtuale.'],
  [99.8, 105.6, 'Oltre il fuoco, reale e capovolta;\ndentro, virtuale e ingrandita.'],
];

// ---------- aiutanti ----------
function raggio(ctx, pts, k, col, w = 5, al = 1) {
  if (k <= 0 || al <= 0.01) return;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  const fin = L[L.length - 1] * clamp(k);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
    if (m + 12 > fin || L[i] - L[i - 1] < 70) continue;
    const f = (m - L[i - 1]) / (L[i] - L[i - 1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, 1.1);
  }
  ctx.restore();
}
function freccia(ctx, x, y0, y1, col, al = 1, tratt = false) {   // oggetto e immagine: frecce verticali dall'asse
  if (al <= 0.01 || Math.abs(y1 - y0) < 4) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 7; ctx.lineCap = 'round';
  if (tratt) ctx.setLineDash([12, 10]);
  const su = y1 < y0 ? -1 : 1;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 - su * 16); ctx.stroke(); ctx.setLineDash([]);
  arrowHead(ctx, [x, y1 + su * 2], su * Math.PI / 2, col, 1.3);
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La lente che capovolge', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la lente: 15 px per centimetro, focale 10 cm, oggetto alto 6 cm ----------
const U = 15, LX = 640, AY = 470, FOC = 10, HO = 8, XFINE = 1270, YMIN = 130, YMAX = 780;
const F1 = [LX - FOC * U, AY], F2 = [LX + FOC * U, AY];
const pOgg = t => kf(t, [[66.9, 30], [68.9, 15], [76.6, 15], [77.6, 6]]);   // distanza dell'oggetto, cm
const qDi = p => 1 / (1 / FOC - 1 / p);                                       // dalla formula
function finoAlBordo(p, d) {   // il raggio da p in direzione d, fino al bordo della scheda
  let k = 1e9;
  if (d[0] > 0) k = Math.min(k, (XFINE - p[0]) / d[0]); if (d[0] < 0) k = Math.min(k, (130 - p[0]) / d[0]);
  if (d[1] > 0) k = Math.min(k, (YMAX - p[1]) / d[1]); if (d[1] < 0) k = Math.min(k, (YMIN - p[1]) / d[1]);
  return [p[0] + d[0] * k, p[1] + d[1] * k];
}
// i tre raggi notevoli dalla punta dell'oggetto; la lente sottile li piega tutti nel piano x = LX
function costruzione(p) {
  const T = [LX - p * U, AY - HO * U];
  const a1 = [LX, T[1]], d1 = [F2[0] - a1[0], F2[1] - a1[1]];                         // 1: parallelo, poi per F2
  const d2 = [LX - T[0], AY - T[1]];                                                    // 2: per il centro, dritto
  const y3 = AY + (T[1] - AY) * FOC / (FOC - p), a3 = [LX, y3];                        // 3: sulla retta per F1, poi parallelo
  const r1 = [T, a1, finoAlBordo(a1, d1)], r2 = [T, [LX, AY], finoAlBordo([LX, AY], d2)], r3 = [T, a3, finoAlBordo(a3, [1, 0])];
  // l'immagine: dove si incrociano i raggi 1 e 2 dopo la lente (o i loro prolungamenti all'indietro)
  const den = d1[0] * d2[1] - d1[1] * d2[0], k = ((LX - a1[0]) * d2[1] - (AY - a1[1]) * d2[0]) / den;
  const Im = [a1[0] + d1[0] * k, a1[1] + d1[1] * k];
  return { T, r1, r2, r3, a1, a3, Im, reale: Im[0] > LX };
}
function lente(ctx, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const h = 305, s = 26;
  ctx.beginPath(); ctx.moveTo(LX, AY - h); ctx.quadraticCurveTo(LX + 2 * s, AY, LX, AY + h); ctx.quadraticCurveTo(LX - 2 * s, AY, LX, AY - h); ctx.closePath();
  ctx.fillStyle = css(C.x, .16); ctx.fill(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
function asse(ctx, al = 1, fuochi = [1, 1], doppi = 0, primaParte = false) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(130, AY); ctx.lineTo(XFINE, AY); ctx.stroke();
  txt(ctx, 'asse', XFINE - 4, AY - 22, { size: 30, color: C.dim, align: 'right' });
  // il nome del fuoco dove non passano raggi: sotto F nella prima parte; poi F a sinistra in basso, F a destra in alto
  const posF = i => primaParte ? [0, 58] : i ? [26, -32] : [-26, 36];
  [F1, F2].forEach((F, i) => { if (fuochi[i] > 0) { dot(ctx, F, C.v, fuochi[i], 9); drawRich(ctx, '{mink:F}', F[0] + posF(i)[0], AY + posF(i)[1], { size: 38, alpha: fuochi[i] }); } });
  if (doppi > 0) [-1, 1].forEach(s => { const x = LX + s * 2 * FOC * U; ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(x, AY, 6, 0, Math.PI * 2); ctx.fill(); drawRich(ctx, '{dim:2}{mink:F}', x, AY + 38, { size: 34, alpha: doppi }); });
  ctx.restore();
}

// 1 · la lente e il fuoco (7,5–25,6)
const PARALLELI = [-150, -75, 0, 75, 150];
function sceneFuoco(ctx, t) {
  if (t < 7.5 || t > 26) return;
  const al = 1 - P(t, 25.0, 25.6);
  ctx.save(); ctx.globalAlpha *= al;
  PARALLELI.forEach((h, i) => {
    const a = [LX, AY + h], d = [F2[0] - a[0], F2[1] - a[1]], L = Math.hypot(...d);
    const fine = [a[0] + d[0] / L * 620, a[1] + d[1] / L * 620];
    raggio(ctx, [[150, AY + h], a, fine], P(t, 12.4 + .12 * i, 14.4 + .12 * i, E.lin), C.y, 4);
  });
  // la focale
  const kf2 = life(t, 17.6, 25.4, .5, .4);
  if (kf2 > 0) {
    ctx.save(); ctx.globalAlpha *= kf2; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    const y = AY + 96;
    ctx.beginPath(); ctx.moveTo(LX + 6, y); ctx.lineTo(F2[0] - 6, y); ctx.stroke();
    arrowHead(ctx, [LX + 2, y], Math.PI, C.v, .8); arrowHead(ctx, [F2[0] - 2, y], 0, C.v, .8);
    drawRich(ctx, '{mink:f}', (LX + F2[0]) / 2, y + 30, { size: 40 });
    const k2 = P(t, 21.8, 22.3);
    if (k2 > 0) {
      ctx.globalAlpha *= k2;
      ctx.beginPath(); ctx.moveTo(F1[0] + 6, y); ctx.lineTo(LX - 6, y); ctx.stroke();
      arrowHead(ctx, [F1[0] + 2, y], Math.PI, C.v, .8); arrowHead(ctx, [LX - 2, y], 0, C.v, .8);
      drawRich(ctx, '{mink:f}', (LX + F1[0]) / 2, y + 30, { size: 40 });
    }
    ctx.restore();
  }
  ctx.restore();
}

// il banco: scheda, asse, lente, fuochi (7,5–97,6)
function sceneBanco(ctx, t) {
  if (t < 7.4 || t > 98) return;
  const al = life(t, 7.6, 97.6, .6, .5);
  card(ctx, 110, 110, 1180, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  asse(ctx, P(t, 8.0, 8.6), [P(t, 21.8, 22.3), P(t, 17.2, 17.7, E.back)], P(t, 25.8, 26.3), t < 25.6);
  lente(ctx, P(t, 7.9, 8.5));
  ctx.restore();
}
// le finestre in cui l'oggetto si sposta: lì i numeri spariscono, e (nel secondo spostamento) anche i raggi
const fermo = t => 1 - life(t, 66.8, 69.1, .25, .25) - life(t, 76.0, 77.9, .3, .3);
function staffa(ctx, x0, x1, y, nome, col, al) {
  if (al <= 0.01 || Math.abs(x1 - x0) < 10) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  const a = Math.min(x0, x1), b = Math.max(x0, x1);
  ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.moveTo(a, y - 10); ctx.lineTo(a, y + 10); ctx.moveTo(b, y - 10); ctx.lineTo(b, y + 10); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.fillRect((a + b) / 2 - 20, y - 22, 40, 44);
  drawRich(ctx, nome, (a + b) / 2, y, { size: 36 });
  ctx.restore();
}
// 2–4 · l'oggetto, i tre raggi, l'immagine (25,6–97,6)
function sceneCostruzione(ctx, t) {
  if (t < 25.6 || t > 98) return;
  const al = life(t, 25.6, 97.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  const p = pOgg(t), G = costruzione(p), vicino = p < FOC;
  const aR = clamp(1 - P(t, 76.0, 76.5) + P(t, 77.7, 78.2));
  const k1 = P(t, 30.4, 32.0, E.lin), k2 = P(t, 35.0, 36.4, E.lin), k3 = P(t, 39.2, 40.8, E.lin);
  // i prolungamenti all'indietro, quando l'immagine è virtuale
  const kp = P(t, 85.0, 86.2) * aR;
  if (vicino && kp > 0) {
    dashed(ctx, G.a1, G.Im, C.v, kp, .9); dashed(ctx, [LX, AY], G.Im, C.v, kp, .9); dashed(ctx, G.a3, G.Im, C.v, kp, .9);
  }
  if (vicino) dashed(ctx, F1, G.T, C.y, k3, aR * .9);   // il raggio 3 viene come dal fuoco
  raggio(ctx, G.r1, k1, C.y, 4, aR); raggio(ctx, G.r2, k2, C.y, 4, aR); raggio(ctx, G.r3, k3, C.y, 4, aR);
  // l'oggetto
  freccia(ctx, G.T[0], AY, G.T[1], C.ink, P(t, 25.8, 26.4));
  txt(ctx, 'oggetto', Math.min(G.T[0], LX - 110), AY + 82, { size: 30, color: C.dim, alpha: P(t, 26.0, 26.5) });
  // l'immagine: reale (piena) o virtuale (tratteggiata)
  const kI = P(t, 43.6, 44.3) * (1 - P(t, 76.0, 76.5)) + P(t, 85.6, 86.3);
  if (kI > 0) {
    dot(ctx, G.Im, C.v, Math.min(1, kI), 9);
    freccia(ctx, G.Im[0], AY, G.Im[1], C.v, kI, !G.reale);
    if (G.reale) txt(ctx, 'immagine', G.Im[0] - 18, G.Im[1] + 36, { size: 30, color: C.v, align: 'right', alpha: kI });
    else txt(ctx, 'immagine', G.Im[0] - 26, G.Im[1], { size: 30, color: C.v, align: 'right', alpha: kI });
  }
  // il foglio dove si raccoglie l'immagine reale
  const ks = life(t, 52.6, 56.8, .4, .4);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(C.dim, .35); ctx.fillRect(G.Im[0] - 4, AY - 110, 8, 230); ctx.restore();
    txt(ctx, 'foglio', G.Im[0], AY - 132, { size: 30, color: C.dim, alpha: ks });
  }
  // p e q sul disegno
  const kq = P(t, 57.2, 57.8) * fermo(t) * (t > 76 && t < 92.8 ? 0 : 1);
  staffa(ctx, G.T[0], LX, 735, '{mink:p}', C.ink, P(t, 57.2, 57.8) * fermo(t));
  staffa(ctx, LX, G.Im[0], 770, '{mink:q}', C.v, kq);
  ctx.restore();
}
// la scheda dei numeri, a destra (25,6–97,6)
const CASI = [
  { da: 47.8, a: 66.8, testo: 'immagine {g:reale},\ncapovolta, più piccola', conto: ['30', '15'] },
  { da: 71.2, a: 75.8, testo: 'immagine {g:reale},\ncapovolta, più grande', conto: ['15', '30'] },
  { da: 84.8, a: 97.6, testo: 'immagine {v:virtuale},\ndritta, più grande', conto: ['6', '−15'] },
];
function sceneScheda(ctx, t) {
  if (t < 25.4 || t > 98) return;
  const al = life(t, 25.6, 97.6, .5, .5);
  card(ctx, 1320, 110, 490, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'le misure', 1565, 170, { size: 38, weight: 600 }));
  const p = pOgg(t), q = qDi(p), kn = fermo(t);
  const riga = (nome, val, y, col, a) => { if (a <= 0.01) return; drawRich(ctx, nome, 1360, y, { size: 38, align: 'left', alpha: a }); txt(ctx, val, 1770, y, { size: 40, weight: 600, color: col, align: 'right', alpha: a }); };
  riga('{mink:f}{dim:  focale}', '10 cm', 245, C.ink, P(t, 26.0, 26.5));
  riga('{mink:p}{dim:  oggetto}', Math.round(p) + ' cm', 305, C.ink, P(t, 26.0, 26.5) * kn);
  const kq = P(t, 48.0, 48.5) * (t < 66.8 ? 1 : 0) + P(t, 71.3, 71.8) * (t < 75.9 ? 1 : 0) + P(t, 93.0, 93.5);
  riga('{mink:q}{dim:  immagine}', (q < 0 ? '−' : '') + Math.round(Math.abs(q)) + ' cm', 365, C.v, Math.min(1, kq) * kn);
  CASI.forEach(K => {
    const k = life(t, K.da, K.a, .4, .4); if (k <= 0) return;
    drawRich(ctx, K.testo, 1565, 460, { size: 32, lh: 1.35, alpha: k });
    const kc = life(t, K === CASI[0] ? 62.2 : K.da + .4, K.a, .4, .4);
    if (kc > 0) drawSeq(ctx, [{ num: '{mink:1}', den: '{mink:' + K.conto[0] + '}' }, '{mink:+}', { num: '{mink:1}', den: '{mink:' + K.conto[1] + '}' }, '{mink:=}', { num: '{mink:1}', den: '{mink:10}' }], 1565, 705, 42, { alpha: kc });
  });
  const kf2 = P(t, 57.2, 57.8);
  if (kf2 > 0) drawSeq(ctx, [{ num: '{mink:1}', den: '{mink:p}' }, '{mink:+}', { num: '{mink:1}', den: '{mink:q}' }, '{mink:=}', { num: '{mink:1}', den: '{mink:f}' }], 1565, 575, 50, { local: t - 57.2 });
  ctx.restore();
}

// 5 · in una frase (97,6–108,6)
function sceneFine(ctx, t) {
  if (t < 97.6) return;
  const al = 1 - P(t, 107.0, 107.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.8 });
    drawRich(ctx, 'L’immagine sta dove i raggi\n(o i loro prolungamenti) si incontrano.', W / 2, 290, { size: 66, weight: 600, local: t - 98.2, stagger: .09 });
  });
  const pills = [[490, '{mink:1/p + 1/q = 1/f}'], [960, 'oltre {mink:f}: {g:reale}\ne capovolta'], [1430, 'dentro {mink:f}: {v:virtuale},\ndritta e ingrandita']];
  pills.forEach(([x, s], i) => {
    const a = 99.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): l'incrocio dei raggi disegnati deve cadere dove dice la formula
  const verifica = [30, 15, 6].map(p => { const G = costruzione(p), q = qDi(p); return { p, q: +q.toFixed(6), qDisegno: +((G.Im[0] - LX) / U).toFixed(6), altezza: +((AY - G.Im[1]) / U).toFixed(6), raggio3: +((AY - G.a3[1]) / U).toFixed(6) }; });
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.0, 8.6], ['pop', 8.2, .45],                        // l'asse e la lente
    ['traccia', 12.4, 14.9],                                                          // i raggi paralleli
    ['pop', 17.4, .6], ['traccia', 17.6, 18.1],                                       // il fuoco, la focale
    ['pop', 22.0, .5], ['traccia', 21.8, 22.3],                                       // il secondo fuoco
    ['soffio', 25.6], ['pop', 26.0, .4], ['pop', 26.2, .55],                          // le misure, 2F, l'oggetto
    ['traccia', 30.4, 32.0], ['traccia', 35.0, 36.4], ['traccia', 39.2, 40.8],        // i tre raggi
    ['pop', 43.9, .6], ['ding', 44.4],                                                // l'immagine
    ['pop', 48.3, .5], ['pop', 52.8, .4],                                             // q = 15 cm, il foglio
    ['traccia', 57.2, 57.8], ['pop', 57.5, .6],                                       // p, q e la formula
    ['tono', 66.9, 68.9, [.25, .25, .26, .3, .4, .61, .84, .98, 1]],                  // l'oggetto si avvicina: l'immagine cresce
    ['pop', 71.5, .55], ['ding', 72.0],                                               // q = 30 cm
    ['tono', 76.6, 77.6, [.5, .49, .46, .35, .24, .21, .2]],                          // ancora più vicino, a 6 cm
    ['traccia', 77.7, 78.2],                                                          // tornano i raggi, divergenti
    ['traccia', 85.0, 86.2], ['pop', 85.9, .6],                                       // i prolungamenti: immagine virtuale
    ['ding', 89.5], ['pop', 93.2, .5],                                                // lente d'ingrandimento, q = -15 cm
    ['soffio', 97.7], ['pop', 99.8, .5], ['pop', 100.3, .6], ['pop', 100.8, .7],      // in una frase
  ];
  return {
    titolo: 'La lente che capovolge', durata: 108.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.6, 'il fuoco'], [25.6, 66.6, 'i tre raggi'], [66.6, 97.6, 'più vicino alla lente']],
    verifica,
    scena(ctx, t) { sceneIntro(ctx, t); sceneBanco(ctx, t); sceneFuoco(ctx, t); sceneCostruzione(ctx, t); sceneScheda(ctx, t); sceneFine(ctx, t); },
  };
});
