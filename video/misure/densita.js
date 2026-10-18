'use strict';
/* Un chilo di piume e un chilo di ferro — stessa massa, volumi diversissimi (disegnati in scala): la densità
   d = m/V in kg/m³; l'acqua che gela aumenta di volume e scende da 1000 a 917 kg/m³, e il ghiaccio galleggia.
   Piume ≈ 2,5 kg/m³: valore indicativo, dichiarato. Argomento: misure. */
CVIDEO.registra('misure/densita', M => {
  const { W, C, E, P, life, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [87.1, 190], [88.4, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [87.1, 1050], [88.4, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [87.1, 2.2], [88.4, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [87.1, 2], [88.4, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [87.1, -1.5], [88.4, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.0, 'sorpreso'], [14.2, 'neutro'],
  [29.1, 'felice'], [31.4, 'neutro'], [55.9, 'sorpreso'], [58.2, 'neutro'], [70.8, 'freddo'], [74.0, 'neutro'],
  [84.9, 'felice'], [87.1, 'neutro'], [89.5, 'felice'], [92.5, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.7, 'Pesa di più 1 kg di piume\no di ferro?'],
  [7.9, 11.8, 'Sulla bilancia a due piatti\npesano {g:uguale}: stessa massa.'],
  [12.0, 15.6, 'Ma guarda quanto posto occupano,\ndisegnati {v:in scala}!'],
  [15.8, 22.0, 'Il ferro: un cubetto di circa\n5 cm di lato, 127 cm³.'],
  [22.2, 28.9, 'Le piume: una cassa di circa\n74 cm di lato, 0,4 m³.'],
  [29.1, 33.4, 'Stessa massa, volumi diversissimi:\nil ferro è molto più {v:denso}.'],
  [33.8, 38.7, 'La {v:densità} è la massa diviso\nil volume: {mink:d} = {mink:m} / {mink:V}.'],
  [38.9, 43.9, 'Si misura in {g:kg/m³}: chilogrammi\nper ogni metro cubo.'],
  [44.1, 49.5, 'Per il ferro viene circa\n{g:7870 kg/m³}.'],
  [49.7, 55.7, 'Per le piume circa {g:2,5 kg/m³}:\nun valore indicativo.'],
  [55.9, 60.3, 'Il ferro è più di {g:3000 volte}\npiù denso delle piume!'],
  [60.7, 66.8, 'Ora 1 kg d’acqua: occupa 1 L,\ncioè 0,001 m³.'],
  [67.0, 70.4, 'La sua densità:\n{g:1000 kg/m³}.'],
  [70.6, 75.5, 'Lo metto a gelare: la massa resta\n1 kg, ma il volume {v:cresce}.'],
  [75.7, 82.7, 'Il ghiaccio occupa 1,09 L:\ncirca {g:917 kg/m³}.'],
  [82.9, 86.9, 'Meno denso dell’acqua:\nil ghiaccio {g:galleggia}.'],
  [89.5, 93.6, 'La densità dice quanta massa\nsta in ogni metro cubo.'],
];

// ---------- i numeri (ricontrollati con node) ----------
// ferro 7870 kg/m³: 1 kg occupa 1/7870 m³ ≈ 127 cm³, un cubo di 5,03 cm
// piume ≈ 2,5 kg/m³ (indicativo: dipende da quanto sono schiacciate): 1 kg occupa 0,4 m³, un cubo di 73,7 cm
// acqua 1000 kg/m³: 1 kg = 1 L; ghiaccio 917 kg/m³: 1 kg occupa 1000/917 ≈ 1,09 L, un cubo di 10,29 cm;
// galleggiando ne sta sott'acqua 917/1000 = 91,7 %
const S1 = 450;                                         // scala della bilancia: 450 px per metro
const L_FE = Math.cbrt(1 / 7870) * S1, L_PI = Math.cbrt(1 / 2.5) * S1;   // ≈ 22,6 px e ≈ 331,6 px
const S2 = 2900;                                        // scala di acqua e ghiaccio: 2900 px per metro
const L_AC = 0.1 * S2, L_GH = Math.cbrt(1 / 917) * S2;   // 290 px e ≈ 298,5 px
const IMM = 917 / 1000;

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Un chilo di piume\ne un chilo di ferro', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// le due schede
function scenaSchede(ctx, t) {
  if (t < 7.5 || t > 87.6) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 86.9, 87.5));
  card(ctx, 372, 110, 860, 680, al);
  card(ctx, 1260, 110, 580, 680, al);
}
// ---------- 1 · la bilancia: stessa massa, volumi diversi (7.5–60.5) ----------
const XL = 582, XR = 1022, YP = 650;                    // i due piatti; YP = il piano dei piatti
const caso = i => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };   // numeri fissi, non casuali
const PIUME = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
  const i = r * 5 + c;
  PIUME.push([(c + .2 + .6 * caso(i)) / 5, (r + .2 + .6 * caso(i + 40)) / 5, (caso(i + 80) - .5) * 2.4]);
}
function piuma(ctx, x, y, s, a) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
  ctx.fillStyle = css(C.dim, .22); ctx.beginPath(); ctx.ellipse(0, 0, 22, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-28, 2); ctx.quadraticCurveTo(0, -3, 24, 0); ctx.stroke();
  ctx.restore();
}
function bilancia(ctx) {
  ctx.fillStyle = css(C.dim, .25); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(692, 776); ctx.lineTo(912, 776); ctx.lineTo(882, 746); ctx.lineTo(722, 746); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink, .55); ctx.fillRect(795, 696, 14, 50);
  ctx.fillStyle = css(C.ink, .7); ctx.beginPath(); ctx.roundRect(XL - 4, 685, XR - XL + 8, 10, 5); ctx.fill();
  ctx.fillRect(XL - 6, YP + 10, 12, 26); ctx.fillRect(XR - 6, YP + 10, 12, 26);
  ctx.fillStyle = css(C.ink, .6);
  for (const x of [XL, XR]) { ctx.beginPath(); ctx.roundRect(x - 170, YP, 340, 12, 6); ctx.fill(); }
  ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(802, 690, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}
function frecciaDoppia(ctx, a, b, col) {
  ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(a[0] + 8, a[1]); ctx.lineTo(b[0] - 8, b[1]); ctx.stroke();
  arrowHead(ctx, a, Math.PI, col, .7); arrowHead(ctx, b, 0, col, .7);
}
function scenaBilancia(ctx, t) {
  if (t < 7.6 || t > 61.0) return;
  const al = P(t, 7.7, 8.3) * (1 - P(t, 60.3, 60.9));
  ctx.save(); ctx.globalAlpha *= al;
  bilancia(ctx);
  // la cassa di piume
  const xp = XL - L_PI / 2, yp = YP - L_PI;
  ctx.fillStyle = css(C.dim, .07); ctx.fillRect(xp, yp, L_PI, L_PI);
  ctx.save(); ctx.beginPath(); ctx.rect(xp, yp, L_PI, L_PI); ctx.clip();
  PIUME.forEach(([u, v, a]) => piuma(ctx, xp + u * L_PI, yp + v * L_PI, 1.1, a));
  ctx.restore();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.strokeRect(xp, yp, L_PI, L_PI);
  // il cubetto di ferro
  ctx.fillStyle = css(C.ink, .7); ctx.fillRect(XR - L_FE / 2, YP - L_FE, L_FE, L_FE);
  // i nomi
  txt(ctx, '1 kg di piume', XL, 212, { size: 36, weight: 600 });
  txt(ctx, '1 kg di ferro', XR, 500, { size: 36, weight: 600 });
  // la bilancia è in pari: lo dice il segno verde sul fulcro
  const kp = life(t, 8.6, 11.8, .4, .4);
  if (kp > 0) drawRich(ctx, '{g:in pari}', 860, 612, { size: 32, alpha: kp });
  // la scala del disegno
  const ks = P(t, 12.2, 12.8);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks;
    const x0 = 970, x1 = 970 + .5 * S1;
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0, 170); ctx.lineTo(x1, 170); ctx.stroke();
    for (const x of [x0, x1]) { ctx.beginPath(); ctx.moveTo(x, 158); ctx.lineTo(x, 182); ctx.stroke(); }
    txt(ctx, '50 cm', (x0 + x1) / 2, 206, { size: 30, color: C.v });
    txt(ctx, 'in scala', x0 - 20, 170, { size: 32, weight: 600, color: C.v, align: 'right' });
    ctx.restore();
  }
  // il ferro: misure
  const kf2 = P(t, 16.0, 16.5);
  if (kf2 > 0) {
    ctx.save(); ctx.globalAlpha *= kf2;
    ctx.strokeStyle = css(C.v, life(t, 16.0, 22.0, .4, .4) + .25); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(XR, YP - L_FE / 2, 34, 0, Math.PI * 2); ctx.stroke();
    txt(ctx, 'lato ≈ 5 cm', XR, 548, { size: 32 });
    txt(ctx, '127 cm³', XR, 590, { size: 32, weight: 600, color: C.v });
    ctx.restore();
  }
  // le piume: misure
  const kp2 = P(t, 22.4, 22.9);
  if (kp2 > 0) {
    ctx.save(); ctx.globalAlpha *= kp2;
    frecciaDoppia(ctx, [xp, yp - 24], [xp + L_PI, yp - 24], C.v);
    txt(ctx, 'lato ≈ 74 cm', XL, yp - 54, { size: 32 });
    ctx.fillStyle = css(C.paper, .9); ctx.beginPath(); ctx.roundRect(XL - 90, YP - L_PI / 2 - 32, 180, 64, 14); ctx.fill();
    txt(ctx, '0,4 m³', XL, YP - L_PI / 2, { size: 44, weight: 600, color: C.v });
    ctx.restore();
  }
  ctx.restore();
}
function scenaTestoDensita(ctx, t) {
  if (t < 33.6 || t > 61.0) return;
  const al = P(t, 33.8, 34.3) * (1 - P(t, 60.3, 60.9));
  ctx.save(); ctx.globalAlpha *= al;
  const r = (ta, s, y, size) => { const k = P(t, ta, ta + .5, E.out); if (k > 0) drawRich(ctx, s, 1550, y, { size, alpha: k, local: t - ta }); };
  conFont(TITOLI, () => drawRich(ctx, 'densità', 1550, 170, { size: 40, weight: 600 }));
  r(34.2, '{mink:d} = {mink:m} / {mink:V}', 252, 64);
  r(35.4, '{mink:d}{dim: densità  }{mink:m}{dim: massa  }{mink:V}{dim: volume}', 314, 30);
  r(39.1, 'si misura in {g:kg/m³}', 380, 38);
  r(44.3, 'ferro: 1 kg / 0,000127 m³', 450, 34);
  r(45.0, '≈ {g:7870 kg/m³}', 502, 44);
  r(49.9, 'piume: 1 kg / 0,4 m³', 572, 34);
  r(50.6, '= {g:2,5 kg/m³}', 624, 44);
  r(51.6, '{dim:(valore indicativo)}', 670, 30);
  r(56.1, '7870 / 2,5 ≈ {g:3150}', 742, 42);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.globalAlpha *= P(t, 44.1, 44.5);
  ctx.beginPath(); ctx.moveTo(1290, 412); ctx.lineTo(1810, 412); ctx.stroke();
  ctx.restore();
}
// ---------- 2 · acqua e ghiaccio (60.5–87.1) ----------
// il più chiaro fra carta e inchiostro: i riflessi del ghiaccio restano chiari in tutti e due i temi
const lum = c => { const n = parseInt(String(c).slice(1), 16); return (n >> 16 & 255) + (n >> 8 & 255) + (n & 255); };
const chiaro = () => lum(C.paper) > lum(C.ink) ? C.paper : C.ink;
const XC = 802, YF = 740;                               // centro e fondo dei cubi
const livello = t => lerp(YF, 330, P(t, 83.2, 85.2, E.lin));   // l'acqua versata nella vasca
function scenaGhiaccio(ctx, t) {
  if (t < 60.5 || t > 87.6) return;
  const al = P(t, 60.8, 61.4) * (1 - P(t, 87.0, 87.5));
  ctx.save(); ctx.globalAlpha *= al;
  const kg = P(t, 71.0, 72.6);                          // l'acqua gela
  const lato = lerp(L_AC, L_GH, P(t, 71.2, 73.2));      // e il cubo si allarga: in scala, da 10 cm a 10,29 cm
  const kv = P(t, 83.0, 83.5);                          // la vasca
  // la vasca d'acqua dove poi galleggia
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv;
    ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(452, 318); ctx.lineTo(452, YF + 2); ctx.lineTo(1152, YF + 2); ctx.lineTo(1152, 318); ctx.stroke();
    ctx.restore();
  }
  // il cubo: posa sul fondo finché l'acqua non basta a farlo galleggiare
  const lv = livello(t);
  const fondo = kv > 0 ? Math.min(YF, lv + IMM * lato) : YF;
  const x0 = XC - lato / 2, y0 = fondo - lato;
  // la sagoma del litro d'acqua di partenza, tratteggiata, per vedere quanto è cresciuto
  const ks = P(t, 71.4, 71.9) * (1 - kv);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]);
    ctx.strokeRect(XC - L_AC / 2, YF - L_AC, L_AC, L_AC); ctx.restore();
  }
  // acqua (azzurra) che diventa ghiaccio (più chiaro, coi riflessi)
  ctx.fillStyle = css(C.x, lerp(.32, .16, kg)); ctx.fillRect(x0, y0, lato, lato);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = css(chiaro(), .9); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0 + 30, y0 + 70); ctx.lineTo(x0 + 70, y0 + 30); ctx.moveTo(x0 + 30, y0 + 120); ctx.lineTo(x0 + 120, y0 + 30); ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = css(C.x, .95); ctx.lineWidth = 3; ctx.strokeRect(x0, y0, lato, lato);
  // il contenitore da 1 L, che sparisce quando l'acqua gela
  if (kg < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - kg; ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0 - 6, y0 - 20); ctx.lineTo(x0 - 6, YF + 6); ctx.lineTo(x0 + lato + 6, YF + 6); ctx.lineTo(x0 + lato + 6, y0 - 20); ctx.stroke();
    ctx.restore();
  }
  // l'acqua della vasca, sopra al ghiaccio: la parte immersa si vede attraverso
  if (kv > 0 && lv < YF) { ctx.fillStyle = css(C.x, .28 * kv); ctx.fillRect(455, lv, 694, YF - lv); ctx.strokeStyle = css(C.x, .9 * kv); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(455, lv); ctx.lineTo(1149, lv); ctx.stroke(); }
  // le scritte
  const kn = 1 - kv;
  txt(ctx, '1 kg d’acqua · 1 L', XC, 392, { size: 36, weight: 600, alpha: P(t, 61.0, 61.5) * (1 - kg) });
  txt(ctx, '1 kg di ghiaccio', XC, 392, { size: 36, weight: 600, alpha: kg * kn });
  txt(ctx, '1,09 L', XC, YF - L_GH / 2, { size: 48, weight: 600, color: C.v, alpha: P(t, 76.0, 76.5) * kn });
  txt(ctx, '+9 % di volume', XC + L_GH / 2 + 24, YF - L_GH / 2, { size: 32, weight: 600, color: C.v, align: 'left', alpha: P(t, 73.2, 73.7) * kn });
  txt(ctx, '10 cm', XC, YF + 32, { size: 30, color: C.dim, alpha: P(t, 61.0, 61.5) * (1 - kg) });
  ctx.restore();
}
function scenaTestoGhiaccio(ctx, t) {
  if (t < 60.5 || t > 87.6) return;
  const al = P(t, 60.8, 61.4) * (1 - P(t, 87.0, 87.5));
  ctx.save(); ctx.globalAlpha *= al;
  const r = (ta, s, y, size) => { const k = P(t, ta, ta + .5, E.out); if (k > 0) drawRich(ctx, s, 1550, y, { size, alpha: k, local: t - ta }); };
  conFont(TITOLI, () => drawRich(ctx, 'acqua e ghiaccio', 1550, 170, { size: 40, weight: 600 }));
  r(61.0, '{x:acqua}: 1 kg in 1 L = 0,001 m³', 262, 32);
  r(67.2, '{mink:d} = 1 kg / 0,001 m³', 322, 36);
  r(67.8, '= {g:1000 kg/m³}', 378, 44);
  r(76.0, '{x:ghiaccio}: 1 kg in 1,09 L', 472, 32);
  r(76.6, '{mink:d} = 1 kg / 0,00109 m³', 532, 36);
  r(77.4, '≈ {g:917 kg/m³}', 588, 44);
  r(83.2, '917 < 1000: {g:galleggia}', 690, 40);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.globalAlpha *= P(t, 76.0, 76.4);
  ctx.beginPath(); ctx.moveTo(1290, 425); ctx.lineTo(1810, 425); ctx.stroke();
  ctx.restore();
}

// ---------- 3 · in una frase (87.1–96.4) ----------
function scenaFine(ctx, t) {
  if (t < 87.2) return;
  const al = 1 - P(t, 94.1, 95.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.4 });
    drawRich(ctx, 'La {v:densità} è la massa\nin ogni metro cubo: {mink:d} = {mink:m} / {mink:V}.', W / 2, 290, { size: 66, weight: 600, local: t - 87.8, stagger: .08 });
  });
  const pills = [[490, 'stessa massa,\nvolumi diversi'], [960, 'ferro {g:7870} kg/m³\npiume ≈ {g:2,5} kg/m³'], [1430, 'ghiaccio {g:917} kg/m³:\ngalleggia sull’acqua']];
  pills.forEach(([x, s], i) => {
    const a = 89.4 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.5], ['pop', 8.6, .5],                                                // la bilancia in pari
    ['traccia', 12.2, 12.8],                                                          // la scala del disegno
    ['pop', 16.0, .35],                                                               // il cubetto di ferro, 127 cm³
    ['traccia', 22.4, 22.9], ['pop', 22.4, .7],                                       // la cassa di piume, 0,4 m³
    ['soffio', 33.8], ['pop', 34.2, .6],                                              // d = m / V
    ['pop', 39.1, .5],                                                                // kg/m³
    ['pop', 44.3, .5], ['ding', 45.0],                                                // ferro: 7870 kg/m³
    ['pop', 49.9, .4], ['ding', 50.6],                                                // piume: 2,5 kg/m³
    ['ding', 56.1],                                                                   // circa 3150 volte
    ['soffio', 60.8], ['pop', 61.0, .5],                                              // un litro d'acqua
    ['pop', 67.2, .5], ['ding', 67.8],                                                // 1000 kg/m³
    ['tono', 71.2, 73.2, [.45, .5, .55]], ['pop', 73.2, .6],                          // gela e si allarga: +9 %
    ['pop', 76.0, .5], ['pop', 76.6, .5], ['ding', 77.4],                             // 1,09 L: 917 kg/m³
    ['pop', 83.0, .4], ['pop', 83.2, .55],                                            // la vasca, galleggia
    ['tono', 83.2, 85.2, [0, .25, .5, .75, 1]], ['ding', 84.55],                      // l'acqua sale e il ghiaccio si stacca
    ['soffio', 87.4], ['pop', 89.4, .5], ['pop', 89.9, .6], ['pop', 90.4, .7],        // in una frase
  ];
  return {
    titolo: 'Un chilo di piume e un chilo di ferro', durata: 96.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI, stati: [[70.8, 'ghiaccio'], [86.0, 'liquida']] },
    capitoli: [[7.5, 33.6, 'stessa massa, volumi diversi'], [33.6, 60.5, 'la densità'], [60.5, 87.1, 'acqua e ghiaccio']],
    scena(ctx, t) {
      scenaTitolo(ctx, t); scenaSchede(ctx, t); scenaBilancia(ctx, t); scenaTestoDensita(ctx, t);
      scenaGhiaccio(ctx, t); scenaTestoGhiaccio(ctx, t); scenaFine(ctx, t);
    },
  };
});
