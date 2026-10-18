'use strict';
/* Che cosa vuol dire «energia» — un'unica grandezza in sei forme: cinetica (½·m·v²), potenziale (m·g·h), interna o termica
   (le particelle che si agitano), chimica (i legami fra gli atomi), elettrica (cariche e correnti), nucleare (i nuclei).
   Si misurano tutte in joule: 1 J è 100 g alzati di 1 m (0,1 · 9,8 · 1 = 0,98 J), 0,5 kg a 2 m/s (½ · 0,5 · 2² = 1 J),
   1 g d'acqua scaldato di 0,24 °C (1 / 4,186), un LED da 1 W per 1 s; un grammo di zucchero ≈ 17 000 J (17 kJ/g, il valore
   delle etichette), un grammo di uranio 235 che si spezza nel reattore ≈ 8·10¹⁰ J (200 MeV a nucleo: 8,2·10¹⁰ J/g).
   Il passaggio da una forma all'altra: un cucchiaino di zucchero (4 g, ≈ 68 000 J) per una persona di 60 kg; se tutta
   servisse a salire, m·g·h = 68 000 J → h ≈ 116 m; i muscoli ne trasformano in lavoro circa un quarto: sale di 17 000 J /
   (60 · 9,8) ≈ 29 m (salita a velocità costante), e gli altri 51 000 J diventano energia interna. 17 000 + 51 000 = 68 000.
   La catena di trasformazioni con i rendimenti è in energia/catena; le fonti in energia/fonti. Argomento: energia. */
CVIDEO.registra('energia/forme', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, fixedNum } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.3;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [12.5, 'felice'], [16.9, 'neutro'],
  [25.9, 'felice'], [30.5, 'neutro'], [34.9, 'sorpreso'], [39.1, 'felice'], [43.7, 'neutro'], [60.5, 'sorpreso'],
  [65.7, 'neutro'], [75.4, 'sorpreso'], [79.8, 'pensa'], [84.8, 'neutro'], [89.4, 'festa'], [96.0, 'felice'],
  [99.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.5, 'Un panino, una pila, il Sole:\ncosa hanno in comune?'],
  [7.9, 12.3, 'Possono compiere un {v:lavoro}: hanno\n{g:energia}. Ma in forme diverse.'],
  [12.5, 16.7, 'Energia {g:cinetica}: ce l’ha chi\nsi muove, ½·{mink:m}·{mx:v}².'],
  [16.9, 21.3, 'Energia {g:potenziale}: dipende dalla\nposizione, come {mink:m·g·h}.'],
  [21.5, 25.7, 'Energia {g:interna}, o termica:\nle particelle che si agitano.'],
  [25.9, 30.3, 'Energia {g:chimica}: nei legami fra\ngli atomi. Cibo, benzina, pile.'],
  [30.5, 34.7, 'Energia {g:elettrica}: quella delle\ncariche, che corre nei fili.'],
  [34.9, 38.9, 'Energia {g:nucleare}: nei nuclei.\nFa splendere il Sole.'],
  [39.1, 43.5, 'Sono la {v:stessa grandezza}:\nsi misurano tutte in {g:joule}.'],
  [43.7, 48.2, '1 J, circa: una mela\nda 100 g alzata di 1 m…'],
  [48.4, 52.2, '…o una palla\nda 0,5 kg a 2 m/s…'],
  [52.4, 56.3, '…o 1 g d’acqua scaldato\ndi 0,24 °C.'],
  [56.5, 60.3, 'Un LED da 1 W:\n1 J ogni secondo.'],
  [60.4, 65.65, 'Un grammo di zucchero: 17 000 J.\nDi uranio 235 che si spezza: 8·10¹⁰ J!'],
  [65.7, 70.5, 'Un cucchiaino di zucchero, 4 g:\ncirca {g:68 000 J} di energia chimica.'],
  [70.7, 75.2, 'Una persona di 60 kg sale.\nSe tutta servisse a salire…'],
  [75.4, 79.6, '…{mink:m·g·h} = 68 000 J darebbe\n{mink:h} ≈ 116 m!'],
  [79.8, 84.6, 'I muscoli ne fanno lavoro per\n{v:circa un quarto}: sale di 29 m.'],
  [84.8, 89.2, 'Gli altri 51 000 J la scaldano:\ndiventano energia {g:interna}.'],
  [89.4, 93.9, 'Potenziale più interna: di nuovo\n{g:68 000 J}. Nessun joule perso.'],
  [96.0, 101.6, 'Cambia forma, ma è sempre energia:\nuna sola grandezza, in joule.'],
];

// ---------- aiutanti ----------
const migliaia = v => { const s = String(Math.round(v)); return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };   // 68 000
function freccia(ctx, a, b, col, w = 5, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5, L / 26);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
function cerchio(ctx, x, y, r, fill, stroke, lw = 2) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}

// ---------- le sei icone (centro x, y; tutte stanno in un raggio di 75 px) ----------
function iconaCinetica(ctx, x, y, t) {   // una palla che rotola a velocità costante, e la sua velocità
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 80, y + 40); ctx.lineTo(x + 80, y + 40); ctx.stroke();
  // palle una dietro l'altra alla stessa velocità: svaniscono ai bordi dell'icona, quella in mezzo si vede sempre intera
  const s = (t * 40) % 100;
  for (const bx of [x - 150 + s, x - 50 + s, x + 50 + s]) {
    const ab = clamp((65 - Math.abs(bx - x)) / 20);
    if (ab <= 0) continue;
    ctx.save(); ctx.globalAlpha *= ab;
    cerchio(ctx, bx, y + 14, 26, css(mix(C.y, C.paper, .35)), css(C.ink), 2.5);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2; const a = (bx - x) / 26;
    ctx.beginPath(); ctx.moveTo(bx, y + 14); ctx.lineTo(bx + Math.cos(a) * 26, y + 14 + Math.sin(a) * 26); ctx.stroke();
    freccia(ctx, [bx - 28, y - 32], [bx + 28, y - 32], C.x, 5, 1);
    ctx.restore();
  }
  ctx.restore();
}
function iconaPotenziale(ctx, x, y) {   // una mela su una mensola, all'altezza h
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 80, y + 60); ctx.lineTo(x + 80, y + 60); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 50, y - 26); ctx.lineTo(x + 20, y - 26); ctx.stroke();
  cerchio(ctx, x - 15, y - 48, 21, css(mix(C.g, C.paper, .25)), css(mix(C.g, C.ink, .4)), 2.5);
  ctx.strokeStyle = css(mix(C.g, C.ink, .5)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 15, y - 67); ctx.lineTo(x - 11, y - 78); ctx.stroke();
  ctx.restore();
  freccia(ctx, [x + 50, y + 40], [x + 50, y - 22], C.ink, 3); freccia(ctx, [x + 50, y + 4], [x + 50, y + 58], C.ink, 3);
  drawRich(ctx, '{mink:h}', x + 36, y + 18, { size: 36, align: 'right' });
}
function iconaInterna(ctx, x, y, t) {   // particelle che si agitano in una scatola
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.strokeRect(x - 72, y - 62, 144, 124);
  for (let i = 0; i < 12; i++) {
    const cx = x - 48 + (i % 4) * 32, cy = y - 36 + Math.floor(i / 4) * 36;
    const dx = 9 * Math.sin(t * (7 + i % 5) + i * 1.7), dy = 9 * Math.cos(t * (6 + i % 3) + i * 2.3);
    cerchio(ctx, cx + dx, cy + dy, 10, css(mix(C.v, C.paper, .3)), css(C.v), 1.5);
  }
  ctx.restore();
}
function iconaChimica(ctx, x, y) {   // una molecola: atomi tenuti dai legami
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6;
  const A = [[x - 40, y + 10], [x + 10, y - 22], [x + 52, y + 18], [x + 10, y + 40]];
  [[0, 1], [1, 2], [1, 3]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(...A[i]); ctx.lineTo(...A[j]); ctx.stroke(); });
  [[0, 22, C.y], [1, 28, C.dim], [2, 22, C.y], [3, 18, C.x]].forEach(([i, r, c]) => cerchio(ctx, A[i][0], A[i][1], r, css(mix(c, C.paper, .3)), css(C.ink), 2.5));
  ctx.restore();
}
function iconaElettrica(ctx, x, y, t) {   // una pila e un filo in cui scorrono le cariche
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  const X0 = x - 70, X1 = x + 70, Y0 = y - 50, Y1 = y + 50;
  ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.lineTo(X1, Y1); ctx.lineTo(X0, Y1); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.fillRect(X0 - 20, y - 26, 40, 52);
  ctx.lineWidth = 3; ctx.strokeRect(X0 - 20, y - 26, 40, 52);
  ctx.fillStyle = css(C.ink); ctx.fillRect(X0 - 8, y - 33, 16, 7);
  // le cariche, a passo costante lungo il giro
  const per = 2 * (X1 - X0) + 2 * (Y1 - Y0);
  for (let i = 0; i < 10; i++) {
    let s = ((i / 10) * per + t * 50) % per, px, py;
    if (s < X1 - X0) { px = X0 + s; py = Y0; } else if ((s -= X1 - X0) < Y1 - Y0) { px = X1; py = Y0 + s; }
    else if ((s -= Y1 - Y0) < X1 - X0) { px = X1 - s; py = Y1; } else { s -= X1 - X0; px = X0; py = Y1 - s; }
    if (px < X0 + 22 && py > y - 30 && py < y + 30) continue;
    cerchio(ctx, px, py, 6, css(C.x), null);
  }
  ctx.restore();
}
function iconaNucleare(ctx, x, y, t) {   // un nucleo: protoni e neutroni stretti insieme
  ctx.save();
  const P0 = [[0, 0], [22, 4], [-20, 8], [6, -20], [-10, -18], [14, 24], [-14, 26], [30, -16], [-32, -10], [32, 22], [-30, 30], [2, 40], [0, -42]];
  P0.forEach(([dx, dy], i) => {
    const w = 1.5 * Math.sin(t * 9 + i);
    cerchio(ctx, x + dx + w, y + dy - w, 15, css(mix(i % 2 ? C.y : C.dim, C.paper, .25)), css(C.ink), 2);
  });
  ctx.restore();
}

// ---------- la griglia delle sei schede ----------
const SX = [120, 690, 1260], SY = [120, 470], SW = 540, SH = 320;
const FORME = [
  { nome: 'cinetica', righe: ['chi si muove', '{mink:½·m·}{mx:v}{mink:²}', '{mink:m} massa, {mx:v} velocità'], icona: iconaCinetica, t: 12.5, uno: '{g:1 J}: 0,5 kg a 2 m/s', tu: 48.5 },
  { nome: 'potenziale', righe: ['dalla posizione', '{mink:m·g·h}', '{mink:g} = 9,8 m/s²'], icona: iconaPotenziale, t: 16.9, uno: '{g:≈ 1 J}: 100 g alzati di 1 m', tu: 43.8 },
  { nome: 'interna', righe: ['o termica:', 'particelle', 'che si agitano'], icona: iconaInterna, t: 21.5, uno: '{g:1 J}: 1 g d’acqua, +0,24 °C', tu: 52.5 },
  { nome: 'chimica', righe: ['legami fra', 'gli atomi', 'cibo, benzina, pile'], icona: iconaChimica, t: 25.9, uno: '1 g di zucchero: {g:17 000 J}', tu: 60.6 },
  { nome: 'elettrica', righe: ['cariche', 'e correnti', 'nei fili'], icona: iconaElettrica, t: 30.5, uno: 'LED da 1 W: {g:1 J} al secondo', tu: 56.6 },
  { nome: 'nucleare', righe: ['legami', 'nei nuclei', 'il Sole, le centrali'], icona: iconaNucleare, t: 34.9, uno: '1 g di uranio 235: {g:8·10¹⁰ J}', tu: 60.6, su: 30 },
];
function scenaGriglia(ctx, t) {
  if (t < 12.3 || t > 66.2) return;
  const al = 1 - P(t, 65.5, 66.1);
  ctx.save(); ctx.globalAlpha *= al;
  FORME.forEach((F, i) => {
    const x = SX[i % 3], y = SY[Math.floor(i / 3)], k = P(t, F.t + .1, F.t + .6, E.back);
    if (k <= 0) return;
    const cx = x + SW / 2, cy = y + SH / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy);
    card(ctx, x, y, SW, SH);
    F.icona(ctx, x + 100, y + 130, t);
    conFont(TITOLI, () => drawRich(ctx, '{g:' + F.nome + '}', x + 200, y + 52, { size: 42, weight: 600, align: 'left' }));
    drawRich(ctx, F.righe[0], x + 200, y + 112, { size: 32, align: 'left' });
    drawRich(ctx, F.righe[1], x + 200, y + 158, { size: F.righe[1].indexOf('{m') === 0 ? 40 : 32, align: 'left' });
    drawRich(ctx, F.righe[2], x + 200, y + 206, { size: 30, align: 'left', fill: F.righe[2].indexOf('{') < 0 ? css(C.dim) : undefined });
    // la riga del joule, in fondo
    const ku = P(t, F.tu, F.tu + .5);
    if (ku > 0) {
      ctx.save(); ctx.globalAlpha *= ku; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 24, y + 250); ctx.lineTo(x + SW - 24, y + 250); ctx.stroke(); ctx.restore();
      drawRich(ctx, F.uno, x + SW / 2, y + 286, { size: F.su || 32, alpha: ku, local: t - F.tu });
    }
    ctx.restore();
  });
  // una sola unità per tutte
  const kJ = life(t, 39.3, 43.6, .4, .4);
  if (kJ > 0) {
    const s = 'tutte si misurano in {g:joule} (J)', w = M.richW(ctx, s, 40) + 60;
    ctx.save(); ctx.globalAlpha *= kJ; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(960 - w / 2, 455 - 42, w, 84, 20); ctx.fill(); ctx.stroke(); ctx.restore();
    drawRich(ctx, s, 960, 455, { size: 40, alpha: kJ, local: t - 39.4 });
  }
  ctx.restore();
}

// 1 · che cos'è l'energia (7,5–12,3)
function scenaDefinizione(ctx, t) {
  const al = life(t, 7.8, 12.3, .5, .5);
  if (al <= 0) return;
  card(ctx, 360, 260, 1200, 330, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'ha {g:energia} chi può\ncompiere un {v:lavoro}', 960, 390, { size: 62, weight: 600, local: t - 8.0, stagger: .08 }));
  drawRich(ctx, '{dim:in forme diverse}', 960, 535, { size: 34, alpha: P(t, 10.4, 10.9) });
  ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Che cosa vuol dire «energia»', W / 2, 180, { size: 104, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- 3 · lo zucchero diventa salita e calore (65,7–T_FINE) ----------
const G = 9.8, MASSA = 60, E_ZUCC = 4 * 17000, E_SALITA = E_ZUCC / 4;           // J
const H_TUTTA = E_ZUCC / (MASSA * G), H_VERA = E_SALITA / (MASSA * G);          // ≈ 115,6 m e ≈ 28,9 m
const GY = 740, SM = 5, BX0 = 330, BX1 = 560, PIANO = 2.9;                       // 5 px per metro
const hSale = t => H_VERA * P(t, 80.0, 83.8, E.lin);                            // sale a velocità costante
function persona(ctx, x, y) {   // in piedi su (x, y)
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x, y - 20); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 44);
  ctx.moveTo(x - 11, y - 34); ctx.lineTo(x, y - 40); ctx.lineTo(x + 11, y - 34); ctx.stroke();
  cerchio(ctx, x, y - 55, 10, css(C.paper), css(C.ink), 3);
  ctx.restore();
}
function posScala(h) {   // le scale a zig-zag: un piano verso destra, uno verso sinistra
  const k = Math.min(9, Math.floor(h / PIANO)), f = clamp(h / PIANO - k);
  return [k % 2 ? lerp(BX1 - 26, BX0 + 26, f) : lerp(BX0 + 26, BX1 - 26, f), GY - h * SM];
}
function scenaSalita(ctx, t) {
  if (t < 65.4 || t > T_FINE + .2) return;
  const al = life(t, 65.8, T_FINE, .5, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il cucchiaino di zucchero, finché non arriva il palazzo
  const kZ = life(t, 66.0, 71.0, .5, .5);
  if (kZ > 0) {
    ctx.save(); ctx.globalAlpha *= kZ;
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(700, 470); ctx.lineTo(900, 420); ctx.stroke();
    ctx.fillStyle = css(mix(C.dim, C.paper, .6)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(600, 480, 110, 48, -.12, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2;
    [[540, 470], [580, 462], [620, 458], [660, 466], [560, 438], [600, 432], [640, 438], [600, 405]].forEach(([x, y]) => { ctx.fillRect(x - 17, y - 17, 34, 34); ctx.strokeRect(x - 17, y - 17, 34, 34); });
    txt(ctx, '4 g di zucchero', 610, 590, { size: 34, weight: 600 });
    ctx.restore();
  }
  // il terreno e il palazzo di 10 piani
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, GY); ctx.lineTo(1070, GY); ctx.stroke();
  const kB = P(t, 70.8, 71.4);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    ctx.fillStyle = css(mix(C.dim, C.paper, .85)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.fillRect(BX0, GY - 10 * PIANO * SM, BX1 - BX0, 10 * PIANO * SM); ctx.strokeRect(BX0, GY - 10 * PIANO * SM, BX1 - BX0, 10 * PIANO * SM);
    ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 1.5;
    for (let k = 1; k < 10; k++) { const y = GY - k * PIANO * SM; ctx.beginPath(); ctx.moveTo(BX0, y); ctx.lineTo(BX1, y); ctx.stroke(); }
    ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2;
    ctx.beginPath(); for (let k = 0; k <= 10; k++) { const p = posScala(Math.min(k * PIANO, 10 * PIANO - .001)); if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke();
    persona(ctx, ...posScala(hSale(t)));
    txt(ctx, '60 kg', BX1 + 70, GY - 30, { size: 30, color: C.dim, alpha: 1 - P(t, 79.8, 80.3) });
    ctx.restore();
  }
  // se tutta l'energia servisse a salire: 116 m
  const kT = P(t, 75.6, 77.0, E.lin);
  if (kT > 0) {
    const yT = GY - H_TUTTA * SM * kT;
    ctx.save(); ctx.strokeStyle = css(C.v, .85); ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.moveTo(BX0, GY); ctx.lineTo(BX0, yT); ctx.lineTo(BX1, yT); ctx.lineTo(BX1, GY); ctx.stroke(); ctx.restore();
    const kL = P(t, 76.8, 77.3);
    drawRich(ctx, '{dim:se tutta servisse a salire}', BX1 + 30, GY - H_TUTTA * SM + 4, { size: 30, align: 'left', alpha: kL });
    drawRich(ctx, '{mink:h} ≈ {v:116 m}', BX1 + 30, GY - H_TUTTA * SM + 52, { size: 40, align: 'left', alpha: kL });
  }
  // l'altezza vera
  const h = hSale(t), kH = P(t, 80.0, 80.4);
  if (kH > 0 && h > .3) {
    const yP = GY - h * SM, xS = BX1 + 50;
    ctx.save(); ctx.globalAlpha *= kH; ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(xS, GY); ctx.lineTo(xS, yP); ctx.moveTo(xS - 10, yP); ctx.lineTo(xS + 10, yP); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:h} = {x:' + Math.round(h) + ' m}', xS + 24, yP + 28, { size: 40, align: 'left', alpha: kH });
  }
  ctx.restore();
}
// il conto in joule: la colonna resta alta 68 000 J, cambiano solo i colori
function scenaConto(ctx, t) {
  if (t < 65.4 || t > T_FINE + .2) return;
  const al = life(t, 65.9, T_FINE, .5, .5);
  card(ctx, 1140, 110, 670, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'il conto in joule', 1475, 160, { size: 38, weight: 600 }));
  drawRich(ctx, '{dim:un cucchiaino di zucchero, 4 g}', 1475, 210, { size: 30 });
  const Ep = MASSA * G * hSale(t), Ei = 3 * Ep, Ec = E_ZUCC - Ep - Ei;
  const Y0 = 270, Y1 = 560, X0 = 1190, X1 = 1310, k = (Y1 - Y0) / E_ZUCC;
  const seg = [[Ep, C.x], [Ei, C.v], [Ec, C.y]];
  let y = Y1;
  const kInt = life(t, 84.9, 89.2, .3, .4);
  seg.forEach(([v, c], i) => {
    const hh = v * k; if (hh < .5) return;
    ctx.fillStyle = css(c, .55); ctx.fillRect(X0, y - hh, X1 - X0, hh);
    if (i === 1 && kInt > 0) { ctx.save(); ctx.globalAlpha *= kInt; ctx.strokeStyle = css(C.v); ctx.lineWidth = 6; ctx.strokeRect(X0 - 3, y - hh - 3, X1 - X0 + 6, hh + 6); ctx.restore(); }
    y -= hh;
  });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
  const riga = (nome, col, v, yy, a = 1) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = css(col, .55); ctx.fillRect(1350, yy - 14, 28, 28);
    drawRich(ctx, nome, 1395, yy, { size: 32, align: 'left' });
    drawRich(ctx, migliaia(Math.round(v / 100) * 100) + ' J', 1775, yy, { size: 34, weight: 600, align: 'right' });
    ctx.restore();
  };
  riga('chimica', C.y, Ec, 300);
  riga('potenziale', C.x, Ep, 370, P(t, 79.9, 80.3));
  riga('interna', C.v, Ei, 440, P(t, 79.9, 80.3));
  ctx.save(); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1350, 490); ctx.lineTo(1780, 490); ctx.stroke(); ctx.restore();
  drawRich(ctx, '{dim:totale}', 1395, 535, { size: 32, align: 'left' });
  drawRich(ctx, '{g:68 000 J}', 1775, 535, { size: 36, weight: 600, align: 'right' });
  // il calcolo di h, poi la somma finale
  const kH = life(t, 75.6, 79.7, .4, .4);
  if (kH > 0) {
    drawRich(ctx, '{mink:h} = 68 000 J / (60 kg · 9,8 m/s²)', 1475, 615, { size: 30, alpha: kH });
    drawRich(ctx, '≈ {v:116 m}', 1475, 675, { size: 40, alpha: kH * P(t, 76.4, 76.8) });
  }
  const kM = life(t, 79.9, 84.7, .4, .4);
  if (kM > 0) {
    drawRich(ctx, '{dim:circa un quarto:} 68 000 J / 4 = {x:17 000 J}', 1475, 600, { size: 30, alpha: kM });
    drawRich(ctx, '{mink:h} = 17 000 J / (60 kg · 9,8 m/s²)', 1475, 655, { size: 30, alpha: kM * P(t, 80.6, 81.0) });
    drawRich(ctx, '≈ {x:29 m}', 1475, 712, { size: 40, alpha: kM * P(t, 80.6, 81.0) });
  }
  const kI = life(t, 84.9, 89.3, .4, .4);
  if (kI > 0) drawRich(ctx, '68 000 − 17 000 = {v:51 000 J}', 1475, 640, { size: 36, alpha: kI });
  const kS = P(t, 89.5, 90.0);
  if (kS > 0) drawRich(ctx, '17 000 + 51 000 = {g:68 000 J}', 1475, 640, { size: 40, alpha: kS, local: t - 89.5 });
  ctx.restore();
}

// in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 102.3, 103.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'L’energia cambia forma,\nma si conta sempre in joule.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, 'sei forme,\nuna sola grandezza'], [960, '{g:≈ 1 J}: 100 g\nalzati di 1 m'], [1430, 'chimica → potenziale\n+ interna, {g:68 000 J}']];
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

  const verifica = {
    mela: 0.1 * G * 1, palla: .5 * .5 * 2 * 2, acquaGradi: 1 / 4.186, zuccheroMgPerJ: 1000 / 17000,
    uranioJperG: 1 / 235 * 6.022e23 * 200e6 * 1.602e-19, zucchero: E_ZUCC, hTutta: H_TUTTA, hVera: H_VERA,
    fine: { Ep: MASSA * G * hSale(90), Ei: 3 * MASSA * G * hSale(90), somma: 4 * MASSA * G * hSale(90) },
  };
  // effetti sonori (strumenti/suoni-sintesi.py): nel palazzo il tono segue l'altezza, da terra (0) a 116 m (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.8], ['pop', 10.4, .4],                                               // chi può compiere un lavoro, in forme diverse
    ['pop', 12.6, .3], ['pop', 17.0, .4], ['pop', 21.6, .45],                         // le sei schede: cinetica, potenziale, interna
    ['pop', 26.0, .5], ['pop', 30.6, .55], ['pop', 35.0, .6],                         // chimica, elettrica, nucleare
    ['ding', 39.4],                                                                   // tutte in joule
    ['pop', 43.8, .4], ['pop', 48.5, .45], ['pop', 52.5, .5], ['pop', 56.6, .55], ['pop', 60.6, .65],   // le righe del joule
    ['soffio', 65.8], ['pop', 66.0, .45],                                             // il cucchiaino di zucchero
    ['pop', 70.8, .4],                                                                // il palazzo di 10 piani
    ['traccia', 75.6, 77.0], ['tono', 75.6, 77.0, [0, .5, 1]], ['pop', 76.8, .8],     // se tutta servisse a salire: 116 m
    ['pop', 79.9, .4], ['tono', 80.0, 83.8, [0, .06, .13, .19, .25]], ['ding', 83.8], // sale davvero: 29 m
    ['pop', 84.9, .5],                                                                // 51 000 J di energia interna
    ['soffio', 94.5], ['pop', 95.9, .5], ['pop', 96.4, .6], ['pop', 96.9, .7],        // in una frase
  ];
  return {
    titolo: 'Che cosa vuol dire «energia»', durata: 104.1, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.0, 'sei forme'], [39.0, 65.6, 'una sola unità: il joule'], [65.6, T_FINE, 'da una forma all’altra']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaDefinizione(ctx, t); scenaGriglia(ctx, t); scenaSalita(ctx, t); scenaConto(ctx, t); scenaFine(ctx, t); },
  };
});
