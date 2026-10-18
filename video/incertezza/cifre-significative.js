'use strict';
/* 12 cm o 12,0 cm? — le cifre che si scrivono dicono quanto è precisa la misura: le cifre significative sono le
   certe più la prima incerta; gli zeri davanti non contano, quelli in fondo sì; il risultato di un prodotto ha tante
   cifre quante il dato meno preciso, arrotondato (55,35 → 55, 57,6 → 58). Argomento: incertezza. */
CVIDEO.registra('incertezza/cifre-significative', M => {
  const { W, C, E, P, life, css, TITOLI, conFont, drawRich, richW, txt, fixedNum, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [96.3, 190], [97.6, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [96.3, 1050], [97.6, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.3, 2.2], [97.6, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [96.3, 2], [97.6, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.3, -1.5], [97.6, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.6, 'pensa'], [22.8, 'neutro'],
  [28.4, 'felice'], [30.6, 'neutro'], [51.2, 'sorpreso'], [53.4, 'neutro'], [65.1, 'sorpreso'], [67.4, 'neutro'],
  [70.5, 'pensa'], [76.6, 'felice'], [78.8, 'neutro'], [86.9, 'felice'], [89.0, 'neutro'], [98.5, 'felice'],
  [101.5, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.8, '12 cm o 12,0:\nche differenza c’è?'],
  [7.9, 12.3, 'Misuro una matita con un righello\nche ha solo i centimetri.'],
  [12.5, 16.4, 'La punta è vicina al 12:\nscrivo {g:12 cm}.'],
  [16.6, 22.6, 'Ma potrebbe essere 11,8 o 12,3:\nl’ultima cifra è {v:incerta}.'],
  [22.8, 28.2, 'Ora un righello con i millimetri:\nla punta è proprio sul 12,0.'],
  [28.4, 34.2, 'Scrivo {g:12,0 cm}: lo zero dice\nche ho letto anche i millimetri.'],
  [34.6, 39.0, 'Le cifre {v:significative} sono quelle\ncerte, più la prima incerta.'],
  [39.2, 44.1, '12 cm ne ha {g:due},\n12,0 cm ne ha {g:tre}.'],
  [44.3, 51.0, 'In metri, 12,0 cm sono 0,120 m:\nsempre {g:tre} cifre.'],
  [51.2, 55.3, 'Gli zeri {r:davanti} non contano:\ndicono solo dov’è la virgola.'],
  [55.5, 59.1, 'Gli zeri {g:in fondo} sì:\nsono cifre misurate.'],
  [59.5, 64.9, 'Un rettangolo di lati\n12,3 e 4,5 cm.'],
  [65.1, 70.3, 'La calcolatrice dà\n55,35 cm².'],
  [70.5, 76.4, 'Ma 4,5 ha solo {v:due} cifre: il risultato\nnon può essere più preciso.'],
  [76.6, 81.9, 'Tengo due cifre: dopo c’è un 3,\nresta {g:55 cm²}.'],
  [82.1, 86.7, 'Se la cifra dopo è 5 o più,\nsi arrotonda {v:in su}.'],
  [86.9, 90.6, 'Così 57,6 diventa {g:58}.'],
  [90.8, 96.1, 'Prodotti e quozienti: tante cifre quante\nil dato con {v:meno cifre} significative.'],
  [98.5, 102.6, 'Le cifre che scrivi dicono\nquanto è precisa la misura.'],
];

// ---------- aiutanti ----------
// un numero scritto a pezzi colorati: [[testo, colore], …]; restituisce dove sta ogni pezzo [x0, x1]
function pezzi(ctx, parti, x, y, size, al) {
  const tot = parti.reduce((s, [p]) => s + richW(ctx, p, size, 600), 0);
  let xx = x - tot / 2; const pos = [];
  for (const [p, col] of parti) {
    const w = richW(ctx, p, size, 600);
    txt(ctx, p, xx, y, { size, weight: 600, color: col, align: 'left', alpha: al });
    pos.push([xx, xx + w]); xx += w;
  }
  return pos;
}
function sottolinea(ctx, p, y, col, k) {
  if (k <= 0) return;
  ctx.strokeStyle = css(col, k); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] + 2, y); ctx.lineTo(p[1] - 2, y); ctx.stroke();
}

// ---------- 0 · titolo (0–7.5) ----------
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, '12 cm o 12,0 cm?', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
function scenaSchede(ctx, t) {
  if (t < 7.5 || t > 96.8) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 96.1, 96.7));
  card(ctx, 372, 110, 1468, 330, al);
  card(ctx, 372, 460, 728, 330, al);
  card(ctx, 1130, 460, 710, 330, al);
}
// ---------- 1 · due righelli (7.5–34.4) ----------
const X0R = 430, PXC = 100, L_MAT = 12.04;              // 100 px per centimetro; la matita è lunga 12,04 cm
const XP = X0R + L_MAT * PXC;                           // dove sta la punta
function matita(ctx, x0, x1, y) {
  const h = 22, g = 34, p = 70;                         // gomma e punta
  ctx.fillStyle = css(C.dim, .7); ctx.beginPath(); ctx.roundRect(x0, y - h / 2, g + 4, h, 5); ctx.fill();
  ctx.fillStyle = css(C.y); ctx.fillRect(x0 + g, y - h / 2, x1 - x0 - g - p, h);
  ctx.fillStyle = css(C.y, .35); ctx.beginPath(); ctx.moveTo(x1 - p, y - h / 2); ctx.lineTo(x1, y); ctx.lineTo(x1 - p, y + h / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(x1 - p * .3, y - h * .15); ctx.lineTo(x1, y); ctx.lineTo(x1 - p * .3, y + h * .15); ctx.closePath(); ctx.fill();
}
function scenaRighello(ctx, t) {
  if (t < 7.6 || t > 59.6) return;
  const al = P(t, 7.9, 8.5) * (1 - P(t, 59.1, 59.5));
  ctx.save(); ctx.globalAlpha *= al;
  const kmm = P(t, 23.0, 23.8);
  // il righello
  ctx.fillStyle = css(C.dim, .12); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(X0R - 24, 250, 13 * PXC + 48, 84, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.ink, .8);
  for (let mm = 0; mm <= 130; mm++) {
    const x = X0R + mm * PXC / 10, cm = mm % 10 === 0;
    const l = cm ? 34 : mm % 5 === 0 ? 22 : 14;
    if (!cm) { if (kmm <= 0) continue; ctx.globalAlpha *= kmm; }
    ctx.lineWidth = cm ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x, 250 + l); ctx.stroke();
    if (!cm) ctx.globalAlpha /= kmm;
    if (cm) txt(ctx, String(mm / 10), x, 306, { size: 30, color: C.dim });
  }
  txt(ctx, 'righello al centimetro', X0R + 650, 400, { size: 30, color: C.dim, alpha: 1 - kmm });
  txt(ctx, 'righello al millimetro', X0R + 650, 400, { size: 30, color: C.dim, alpha: kmm });
  // la matita
  matita(ctx, X0R, XP, 214);
  // la lettura
  const k1 = P(t, 12.8, 13.3) * (1 - P(t, 28.6, 29.0)), k2 = P(t, 28.6, 29.1);
  txt(ctx, 'lettura:', 420, 152, { size: 36, color: C.dim, align: 'left', alpha: P(t, 12.8, 13.3) });
  txt(ctx, '12 cm', 560, 152, { size: 44, weight: 600, color: C.g, align: 'left', alpha: k1 });
  txt(ctx, '12,0 cm', 560, 152, { size: 44, weight: 600, color: C.g, align: 'left', alpha: k2 });
  // la punta
  const kp = Math.max(life(t, 12.6, 16.4, .3, .3), life(t, 23.2, 28.2, .3, .3));
  if (kp > 0) { ctx.save(); ctx.strokeStyle = css(C.v, kp); ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.arc(XP, 236, 46, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  // l'ultima cifra è incerta: potrebbe essere 11,8 o 12,3
  const ki = life(t, 16.8, 22.6, .4, .4);
  if (ki > 0) {
    ctx.save(); ctx.globalAlpha *= ki;
    ctx.fillStyle = css(C.v, .16); ctx.fillRect(X0R + 11.5 * PXC, 252, PXC, 80);
    for (const [v, s] of [[11.8, '11,8 ?'], [12.3, '12,3 ?']]) {
      const x = X0R + v * PXC;
      ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.moveTo(x, 252); ctx.lineTo(x, 352); ctx.stroke(); ctx.setLineDash([]);
      txt(ctx, s, x + (v < 12 ? -6 : 6), 376, { size: 30, weight: 600, color: C.v, align: v < 12 ? 'right' : 'left' });
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · contare le cifre (34.4–59.3) ----------
function scenaCifre(ctx, t) {
  if (t < 12.6 || t > 59.6) return;
  const al = 1 - P(t, 59.1, 59.5);
  ctx.save(); ctx.globalAlpha *= al;
  const kc = P(t, 34.8, 35.3);                          // le etichette «certe» e «incerta»
  // 12 cm
  const k1 = P(t, 12.9, 13.4), u1 = P(t, 17.2, 17.7);
  const p1 = pezzi(ctx, [['1', C.ink], ['2', u1 > .5 ? C.v : C.ink], [' cm', C.dim]], 600, 540, 60, k1);
  sottolinea(ctx, p1[1], 580, C.v, u1 * k1);
  if (kc > 0) {
    txt(ctx, 'certa', (p1[0][0] + p1[0][1]) / 2, 612, { size: 30, color: C.dim, alpha: kc });
    txt(ctx, 'incerta', p1[1][1] + 6, 612, { size: 30, color: C.v, alpha: kc, align: 'left' });
  }
  // 12,0 cm
  const k2 = P(t, 28.7, 29.2), u2 = P(t, 29.6, 30.1);
  const p2 = pezzi(ctx, [['12,', C.ink], ['0', u2 > .5 ? C.v : C.ink], [' cm', C.dim]], 600, 680, 60, k2);
  sottolinea(ctx, p2[1], 720, C.v, u2 * k2);
  if (kc > 0) {
    txt(ctx, 'certe', (p2[0][0] + p2[0][1]) / 2 - 8, 752, { size: 30, color: C.dim, alpha: kc });
    txt(ctx, 'incerta', p2[1][1] + 6, 752, { size: 30, color: C.v, alpha: kc, align: 'left' });
  }
  // quante sono
  drawRich(ctx, '→ {g:2 cifre}', 870, 540, { size: 40, align: 'left', alpha: P(t, 39.5, 40.0), local: t - 39.5 });
  drawRich(ctx, '→ {g:3 cifre}', 870, 680, { size: 40, align: 'left', alpha: P(t, 41.6, 42.1), local: t - 41.6 });
  // in metri
  const km = P(t, 44.6, 45.1);
  if (km > 0) {
    const zd = P(t, 51.4, 51.9), zf = P(t, 55.7, 56.2);
    const pm = pezzi(ctx, [['12,0 cm = ', C.ink], ['0,', zd > .5 ? C.r : C.ink], ['12', C.ink], ['0', zf > .5 ? C.g : C.ink], [' m', C.dim]], 1485, 540, 52, km);
    if (zd > 0) {
      ctx.strokeStyle = css(C.r, zd); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(pm[1][0] - 2, 560); ctx.lineTo(pm[1][1] + 2, 520); ctx.stroke();
      drawRich(ctx, 'zero davanti: {r:non conta}', 1485, 700, { size: 32, alpha: zd, local: t - 51.4 });
    }
    sottolinea(ctx, pm[3], 578, C.g, zf);
    if (zf > 0) drawRich(ctx, 'zero in fondo: {g:conta}', 1485, 752, { size: 32, alpha: zf, local: t - 55.7 });
    drawRich(ctx, 'sempre {g:3 cifre} significative', 1485, 625, { size: 36, alpha: P(t, 46.6, 47.1), local: t - 46.6 });
  }
  ctx.restore();
}
// ---------- 3 · il risultato di un calcolo (59.3–95.1) ----------
function scenaCalcolo(ctx, t) {
  if (t < 59.2 || t > 96.8) return;
  const al = P(t, 59.5, 60.0) * (1 - P(t, 96.1, 96.7));
  ctx.save(); ctx.globalAlpha *= al;
  // il rettangolo, in scala: 50 px per centimetro
  const kr = P(t, 59.7, 60.3);
  ctx.save(); ctx.globalAlpha *= kr;
  ctx.fillStyle = css(C.x, .12); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
  ctx.fillRect(460, 160, 615, 225); ctx.strokeRect(460, 160, 615, 225);
  txt(ctx, '12,3 cm', 767, 416, { size: 34, weight: 600 });
  txt(ctx, '4,5 cm', 1092, 272, { size: 34, weight: 600, align: 'left' });
  ctx.restore();
  // la calcolatrice
  const kk = P(t, 65.3, 65.8);
  if (kk > 0) {
    ctx.save(); ctx.globalAlpha *= kk;
    ctx.fillStyle = css(C.dim, .16); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(1300, 150, 460, 250, 24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.x, .10); ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(1330, 176, 400, 100, 12); ctx.fill(); ctx.stroke();
    fixedNum(ctx, '55,35', 1705, 226, 70, C.ink);
    txt(ctx, '12,3 · 4,5 =', 1530, 336, { size: 36, color: C.dim });
    ctx.restore();
  }
  // a sinistra: le cifre dei dati e il risultato
  const r = (ta, s, x, y, size) => { const k = P(t, ta, ta + .5, E.out); if (k > 0) drawRich(ctx, s, x, y, { size, alpha: k, local: t - ta }); };
  const kmp = life(t, 90.8, 96.1, .4, .4);
  if (kmp > 0) { ctx.strokeStyle = css(C.v, kmp); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(520, 552, 432, 56, 12); ctx.stroke(); }
  r(70.7, '12,3 cm → {g:3} cifre', 736, 520, 38);
  r(71.4, '4,5 cm → {v:2} cifre', 736, 580, 38);
  r(77.0, '55,{v:3}5 cm² → {g:55 cm²}', 736, 668, 48);
  r(78.2, '{dim:3 < 5: si tiene 55}', 736, 734, 30);
  // a destra: la regola dell'arrotondamento
  r(82.4, 'cifra dopo {v:5 o più}: in su', 1485, 525, 38);
  r(87.1, '4,5 · 12,8 = 57,{v:6} cm²', 1485, 625, 40);
  r(87.9, '→ {g:58 cm²}', 1485, 695, 50);
  ctx.restore();
}

// ---------- in una frase (96.3–105.4) ----------
function scenaFine(ctx, t) {
  if (t < 96.4) return;
  const al = 1 - P(t, 103.1, 104.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 96.6 });
    drawRich(ctx, 'Si scrivono le cifre {g:certe}\npiù la prima {v:incerta}.', W / 2, 290, { size: 70, weight: 600, local: t - 97.0, stagger: .09 });
  });
  const pills = [[490, '12 cm: {g:2} cifre\n12,0 cm: {g:3} cifre'], [960, 'zeri davanti: no\nzeri in fondo: {g:sì}'], [1430, 'prodotti: come il dato\ncon {v:meno cifre}']];
  pills.forEach(([x, s], i) => {
    const a = 98.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // il righello e la matita
    ['pop', 12.6, .4], ['pop', 12.8, .5],                                             // la punta, lettura 12 cm
    ['traccia', 16.8, 17.2], ['traccia', 17.2, 17.7], ['pop', 17.2, .6],              // 11,8 o 12,3: l'ultima cifra è incerta
    ['traccia', 23.0, 23.8], ['pop', 23.2, .45],                                      // il righello al millimetro
    ['pop', 28.6, .55], ['traccia', 29.6, 30.1],                                      // 12,0 cm, lo zero incerto
    ['pop', 34.8, .4],                                                                // certe e incerta
    ['pop', 39.5, .5], ['pop', 41.6, .6],                                             // 2 cifre, 3 cifre
    ['pop', 44.6, .45], ['ding', 47.1],                                               // 0,120 m: sempre 3 cifre
    ['traccia', 51.4, 51.9], ['pop', 51.4, .3],                                       // zero davanti: non conta
    ['traccia', 55.7, 56.2], ['pop', 55.7, .6],                                       // zero in fondo: conta
    ['soffio', 59.5], ['pop', 59.7, .45],                                             // il rettangolo di lati 12,3 e 4,5 cm
    ['pop', 65.3, .55],                                                               // la calcolatrice: 55,35
    ['pop', 70.7, .5], ['pop', 71.4, .4],                                             // 3 cifre e 2 cifre
    ['pop', 77.0, .5], ['ding', 77.6],                                                // 55 cm²
    ['pop', 82.4, .45], ['pop', 87.1, .5], ['ding', 88.3],                            // 5 o più in su: 57,6 → 58
    ['traccia', 90.8, 91.2],                                                          // il dato con meno cifre
    ['soffio', 96.6], ['pop', 98.6, .5], ['pop', 99.1, .6], ['pop', 99.6, .7],        // in una frase
  ];
  return {
    titolo: '12 cm o 12,0 cm?', durata: 105.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.4, 'due righelli'], [34.4, 59.3, 'contare le cifre'], [59.3, 96.1, 'il risultato di un calcolo']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSchede(ctx, t); scenaRighello(ctx, t); scenaCifre(ctx, t); scenaCalcolo(ctx, t); scenaFine(ctx, t); },
  };
});
