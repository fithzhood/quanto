'use strict';
/* Il calore va solo in giù — due blocchi uguali (80 °C e 20 °C) arrivano a 50 °C; il film al contrario non
   violerebbe il primo principio ma non succede mai: enunciato di Clausius. Il frigorifero ci riesce solo spendendo
   lavoro: toglie 300 J dall'interno, spende 100 J, cede 400 J alla stanza (Q ceduto = Q tolto + L). Il motore non può
   trasformare in lavoro tutto il calore di una sola sorgente: enunciato di Kelvin; i due enunciati sono equivalenti.
   Argomento: termodinamica. */
CVIDEO.registra('termodinamica/secondo-principio', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, crossMark } = M;

const T_FINE = 96.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.6, 'pensa'], [23.2, 'neutro'],
  [37.1, 'felice'], [39.3, 'neutro'], [46.2, 'sorpreso'], [48.4, 'neutro'], [60.1, 'felice'], [62.3, 'neutro'],
  [74.2, 'pensa'], [78.6, 'neutro'], [83.2, 'felice'], [85.4, 'neutro'], [92.4, 'felice'], [T_FINE, 'neutro'],
  [99.3, 'felice'], [103.3, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Il caffè caldo si raffredda:\nperché mai il contrario?'],
  [7.9, 12.8, 'Due blocchi uguali, uno a 80 °C\ne l’altro a 20 °C.'],
  [13.0, 18.4, 'A contatto, il {y:calore} passa dal caldo\nal freddo: arrivano a 50 °C.'],
  [18.6, 23.0, 'E al contrario? Se il calore passasse\ndal freddo al caldo…'],
  [23.2, 27.8, '…dai 50 °C tornerebbero\na 80 °C e a 20 °C.'],
  [28.0, 32.4, 'L’energia si conserverebbe lo stesso:\nil primo principio non lo vieta.'],
  [32.6, 36.9, '{r:Eppure non succede mai.}'],
  [37.1, 41.4, 'È il {v:secondo principio},\nnelle parole di Clausius.'],
  [41.6, 46.0, 'Impossibile che l’{v:unico} risultato sia\nportare calore dal freddo al caldo.'],
  [46.2, 50.6, 'Eppure il frigorifero toglie calore\nal suo interno, che è freddo.'],
  [50.8, 55.0, 'Ci riesce solo spendendo {v:lavoro}:\nquello del motore elettrico.'],
  [55.2, 59.9, 'Toglie 300 J di calore dall’interno\ne spende 100 J di lavoro…'],
  [60.1, 64.8, '…e cede alla stanza 400 J:\nil calore tolto più il lavoro.'],
  [65.0, 69.4, 'Non è l’{v:unico} risultato: è stato\nspeso lavoro. Clausius ha ragione.'],
  [69.6, 74.0, 'E un motore? Prende calore\ndalla sorgente calda e fa lavoro.'],
  [74.2, 78.4, 'Potrebbe trasformare in lavoro\n{r:tutto} il calore preso?'],
  [78.6, 83.0, '{r:No}: deve sempre cederne una parte\na una sorgente più fredda.'],
  [83.2, 87.7, 'È l’enunciato di {v:Kelvin}: impossibile\ntrasformare in lavoro tutto il calore…'],
  [87.9, 92.2, '…preso da una sola sorgente,\nse è l’unico risultato.'],
  [92.4, 96.7, 'I due enunciati sono equivalenti:\nse cadesse uno, cadrebbe anche l’altro.'],
  [99.3, 104.3, 'Da solo il calore va dal caldo\nal freddo; al contrario serve lavoro.'],
];

// ---------- aiutanti ----------
const h = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };   // numeri fissi «a caso»
function agita(i, t, amp) {   // la vibrazione di una particella attorno al suo posto
  const wx = 10 + 4 * h(i, 5), wy = 11 + 4 * h(i, 6), fx = h(i, 7) * 6.28, fy = h(i, 8) * 6.28;
  return [amp * (.7 * Math.sin(wx * t + fx) + .3 * Math.sin(1.7 * wx * t + fy)), amp * (.7 * Math.sin(wy * t + fy) + .3 * Math.sin(1.6 * wy * t + fx))];
}
function freccia(ctx, a, b, col, al = 1, w = 7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.4, L / 22);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
// una freccia larga come un nastro (diagramma di flusso): w in pixel, proporzionale all'energia
function nastro(ctx, a, b, w, col, k, al = 1) {
  if (k <= 0 || al <= 0) return;
  const D = Math.hypot(b[0] - a[0], b[1] - a[1]), L = D * k, ux = (b[0] - a[0]) / D, uy = (b[1] - a[1]) / D;
  const nx = -uy, ny = ux, pt = Math.max(26, w * .45), ex = a[0] + ux * L, ey = a[1] + uy * L, bx = ex - ux * pt, by = ey - uy * pt;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col);
  ctx.beginPath();
  ctx.moveTo(a[0] + nx * w / 2, a[1] + ny * w / 2); ctx.lineTo(bx + nx * w / 2, by + ny * w / 2); ctx.lineTo(bx + nx * (w / 2 + 14), by + ny * (w / 2 + 14));
  ctx.lineTo(ex, ey); ctx.lineTo(bx - nx * (w / 2 + 14), by - ny * (w / 2 + 14)); ctx.lineTo(bx - nx * w / 2, by - ny * w / 2); ctx.lineTo(a[0] - nx * w / 2, a[1] - ny * w / 2);
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function blocco(ctx, x, y, w, hh, nome, col) {   // una sorgente o un ambiente: rettangolo colorato col nome
  ctx.fillStyle = css(col, .22); ctx.beginPath(); ctx.roundRect(x, y, w, hh, 14); ctx.fill();
  txt(ctx, nome, x + w / 2, y + hh / 2, { size: 32, weight: 600 });
}
const colT = tc => mix(C.x, C.y, clamp((tc - 20) / 60));   // colore di una temperatura: azzurro a 20 °C, arancio a 80 °C

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il calore va solo in giù', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- 1 · i due blocchi (7,5–46,1): la differenza cala in modo esponenziale (legge di Newton) ----------
const T_CONT = 13.6, TAU = 1.0, IP_A = 23.3, IP_B = 37.1;   // contatto; l'ipotesi «al contrario» fra IP_A e IP_B
const ipotesi = t => t >= IP_A && t < IP_B;
function temperature(t) {
  let d;
  if (ipotesi(t)) d = 30 * Math.exp(-Math.max(0, 27.0 - t) / .8);   // il film al contrario
  else { const u = t - T_CONT; d = u <= 0 ? 30 : 30 * Math.exp(-u / TAU); }
  return [50 + d, 50 - d];
}
function scenaBlocchi(ctx, t) {
  if (t < 7.5 || t > 46.4) return;
  const al = life(t, 7.6, 46.1, .6, .5);
  card(ctx, 110, 110, 1040, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const [tA, tB] = temperature(t), s = 40 * P(t, 13.0, T_CONT), ip = ipotesi(t) ? life(t, IP_A, IP_B, .3, .4) : 0;
  [[295 + s, tA, 100], [675 - s, tB, 120]].forEach(([x, tc, i0]) => {
    ctx.fillStyle = css(colT(tc), .3); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.rect(x, 300, 300, 240); ctx.fill(); ctx.stroke();
    const amp = 6 * Math.sqrt((tc + 273.15) / 293.15);
    for (let i = 0; i < 12; i++) {
      const [dx, dy] = agita(i0 + i, t, amp);
      ctx.fillStyle = css(colT(tc), .8); ctx.beginPath(); ctx.arc(x + 50 + (i % 4) * 67 + dx, 360 + Math.floor(i / 4) * 60 + dy, 14, 0, Math.PI * 2); ctx.fill();
    }
    txt(ctx, Math.round(tc) + ' °C', x + 150, 255, { size: 48, weight: 600, color: ip > .5 ? C.r : C.ink });
  });
  // il calore: dal caldo al freddo, freccia lunga quanto la differenza; nell'ipotesi, al contrario e in rosso
  const L = 6 * (tA - tB);
  if (!ipotesi(t)) {
    const kc = P(t, T_CONT, T_CONT + .3) * clamp(L / 30);
    if (kc > 0) { freccia(ctx, [635 - L / 2, 600], [635 + L / 2, 600], C.y, kc, 8); txt(ctx, 'calore', 635, 645, { size: 34, weight: 600, color: C.y, alpha: kc }); }
  } else {
    const kc = clamp(L / 30) * ip;
    if (kc > 0) { freccia(ctx, [635 + L / 2, 600], [635 - L / 2, 600], C.r, kc, 8); txt(ctx, 'calore?', 635, 645, { size: 34, weight: 600, color: C.r, alpha: kc }); }
  }
  // l'ipotesi si dichiara, poi si smonta
  if (ip > 0) {
    ctx.save(); ctx.globalAlpha *= ip; ctx.strokeStyle = css(C.r, .7); ctx.lineWidth = 4; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.roundRect(150, 150, 960, 600, 18); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{r:se fosse così…}', 630, 190, { size: 36, alpha: ip });
    crossMark(ctx, 1010, 690, P(t, 32.8, 33.6), C.r, .5);
  }
  ctx.restore();
}
// il grafico delle due temperature, poi l'enunciato di Clausius (stessa scheda)
const GX = tt => 1312 + (tt - 12.6) * 448 / 16, GY = c => 620 - c * 4.4;   // asse a 1312: i pallini fermi sull'asse non toccano «80 °C»
function scenaGrafico(ctx, t) {
  if (t < 7.5 || t > 46.4) return;
  card(ctx, 1190, 110, 620, 680, life(t, 8.0, 46.1, .6, .5));
  const kg = life(t, 8.0, 37.0, .6, .4);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg;
    conFont(TITOLI, () => drawRich(ctx, 'le due temperature', 1500, 165, { size: 38, weight: 600 }));
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (const c of [20, 50, 80]) { ctx.beginPath(); ctx.moveTo(1312, GY(c)); ctx.lineTo(1760, GY(c)); ctx.stroke(); txt(ctx, c + ' °C', 1288, GY(c), { size: 30, color: C.dim, align: 'right' }); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1312, 640); ctx.lineTo(1312, 222); ctx.moveTo(1312, 620); ctx.lineTo(1770, 620); ctx.stroke();
    arrowHead(ctx, [1776, 620], 0, C.ink); arrowHead(ctx, [1312, 216], -Math.PI / 2, C.ink);
    txt(ctx, 'tempo', 1760, 652, { size: 30, color: C.dim, align: 'right' });
    const curva = (a, b, k, col, tratt) => {
      if (b <= a) return;
      ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; if (tratt) ctx.setLineDash([12, 10]);
      ctx.beginPath(); for (let i = 0; i <= 80; i++) { const tt = lerp(a, b, i / 80), v = temperature(tt)[k]; i ? ctx.lineTo(GX(tt), GY(v)) : ctx.moveTo(GX(tt), GY(v)); } ctx.stroke(); ctx.restore();
    };
    const fine = clamp(t, 12.6, 28.6);   // prima del contatto i pallini stanno fermi sull'asse
    for (const [k, col] of [[0, C.y], [1, C.x]]) {
      curva(12.6, Math.min(fine, IP_A - .01), k, col, false);
      if (t > IP_A) curva(IP_A, fine, k, C.r, true);
      const v = temperature(fine)[k]; ctx.fillStyle = css(ipotesi(t) ? C.r : col); ctx.beginPath(); ctx.arc(GX(fine), GY(v), 9, 0, Math.PI * 2); ctx.fill();
    }
    drawRich(ctx, '{dim:energia ceduta = energia ricevuta:}', 1500, 712, { size: 30, alpha: life(t, 28.2, 36.9, .4, .4) });
    drawRich(ctx, '{dim:il primo principio è rispettato}', 1500, 752, { size: 30, alpha: life(t, 28.6, 36.9, .4, .4) });
    ctx.restore();
  }
  const kc = life(t, 37.3, 46.0, .5, .4);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, 'enunciato di Clausius', 1500, 165, { size: 38, weight: 600 }));
    ['È impossibile una trasformazione', 'il cui {v:unico} risultato sia', 'far passare calore da un corpo', 'più freddo a uno più caldo.']
      .forEach((s, i) => drawRich(ctx, s, 1500, 260 + i * 50, { size: 32, local: t - 37.6 - i * .3 }));
    ctx.fillStyle = css(C.x, .22); ctx.beginPath(); ctx.roundRect(1250, 560, 170, 70, 12); ctx.fill();
    ctx.fillStyle = css(C.y, .22); ctx.beginPath(); ctx.roundRect(1580, 560, 170, 70, 12); ctx.fill();
    txt(ctx, 'freddo', 1335, 595, { size: 32, weight: 600 }); txt(ctx, 'caldo', 1665, 595, { size: 32, weight: 600 });
    freccia(ctx, [1430, 595], [1570, 595], C.y, P(t, 41.8, 42.2), 7);
    crossMark(ctx, 1500, 595, P(t, 42.4, 43.2), C.r, .4);
    drawRich(ctx, '{r:da solo, mai}', 1500, 690, { size: 34, alpha: P(t, 42.8, 43.3) });
    ctx.restore();
  }
}

// ---------- 2 · il frigorifero (46,1–69,5); nel flusso 0,3 px per joule ----------
function scenaFrigo(ctx, t) {
  if (t < 45.9 || t > 69.8) return;
  const al = life(t, 46.2, 69.5, .5, .5);
  card(ctx, 110, 110, 790, 680, al); card(ctx, 940, 110, 870, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il frigorifero visto aperto: l'interno freddo, il motore in basso, la serpentina dietro
  txt(ctx, 'stanza a 20 °C', 505, 160, { size: 32, color: C.dim });
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(330, 200, 270, 500, 22); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x, .18); ctx.beginPath(); ctx.roundRect(350, 220, 230, 340, 12); ctx.fill();
  txt(ctx, '4 °C', 465, 300, { size: 52, weight: 600, color: C.x });
  ctx.fillStyle = css(C.dim, .25); ctx.fillRect(362, 588, 120, 92); txt(ctx, 'motore', 422, 634, { size: 28, weight: 600 });
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath();
  for (let i = 0; i <= 14; i++) { const y = 230 + i * 30, x = i % 2 ? 650 : 616; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  // la presa e il filo: il lavoro elettrico entra nel motore
  ctx.fillStyle = css(C.dim, .3); ctx.beginPath(); ctx.roundRect(140, 606, 52, 66, 10); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.fillRect(158, 624, 5, 14); ctx.fillRect(170, 624, 5, 14);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(192, 660); ctx.lineTo(362, 660); ctx.stroke();
  const kl = P(t, 51.0, 51.5);
  freccia(ctx, [205, 632], [345, 632], C.v, kl, 7); drawRich(ctx, '{v:lavoro}', 275, 596, { size: 30, alpha: kl });
  const k0 = P(t, 46.8, 47.3), kt = P(t, 55.4, 55.9);
  freccia(ctx, [470, 450], [600, 450], C.y, k0, 7); drawRich(ctx, '{y:calore tolto}', 465, 510, { size: 30, alpha: k0 });
  const kd = P(t, 60.3, 60.8);
  freccia(ctx, [668, 330], [760, 330], C.y, kd, 7); freccia(ctx, [668, 530], [760, 530], C.y, kd, 7);
  drawRich(ctx, '{y:calore}', 780, 410, { size: 30, alpha: kd }); drawRich(ctx, '{y:ceduto}', 780, 448, { size: 30, alpha: kd });
  // il flusso: stanza in alto, interno in basso
  conFont(TITOLI, () => drawRich(ctx, 'il bilancio', 1375, 160, { size: 38, weight: 600 }));
  blocco(ctx, 1170, 192, 410, 64, 'stanza, 20 °C', C.y);
  blocco(ctx, 1170, 612, 410, 64, 'interno, 4 °C', C.x);
  ctx.fillStyle = css(C.dim, .16); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(1375, 434, 62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  txt(ctx, 'frigo', 1375, 434, { size: 30, weight: 600 });
  nastro(ctx, [1375, 610], [1375, 500], 300 * .3, C.y, P(t, 55.4, 56.2, E.out));
  nastro(ctx, [990, 434], [1311, 434], 100 * .3, C.v, P(t, 51.0, 51.8, E.out));
  nastro(ctx, [1375, 370], [1375, 258], 400 * .3, C.y, P(t, 60.3, 61.1, E.out));
  drawRich(ctx, '{y:calore tolto}', 1462, 538, { size: 30, align: 'left', alpha: kt }); drawRich(ctx, '{y:300 J}', 1462, 576, { size: 36, align: 'left', alpha: kt });
  drawRich(ctx, '{mv:L}{mink: = }{v:100 J}', 1130, 390, { size: 34, alpha: P(t, 55.6, 56.1) });
  drawRich(ctx, '{y:calore ceduto}', 1462, 292, { size: 30, align: 'left', alpha: kd }); drawRich(ctx, '{y:400 J}', 1462, 330, { size: 36, align: 'left', alpha: kd });
  drawRich(ctx, '{y:400 J}{mink: = }{y:300 J}{mink: + }{v:100 J}', 1375, 732, { size: 38, local: t - 60.8 });
  ctx.restore();
}

// ---------- 3 · il motore e l'enunciato di Kelvin (69,5–96,8); nel flusso le larghezze sono in proporzione ----------
function scenaKelvin(ctx, t) {
  if (t < 69.3 || t > T_FINE + .3) return;
  const al = life(t, 69.6, T_FINE + .1, .5, .5);
  card(ctx, 110, 110, 790, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'un motore', 505, 160, { size: 38, weight: 600 }));
  blocco(ctx, 300, 192, 410, 64, 'sorgente calda', C.y);
  const kf = P(t, 80.2, 80.8);
  ctx.save(); ctx.globalAlpha *= kf; blocco(ctx, 300, 612, 410, 64, 'sorgente fredda', C.x); ctx.restore();
  ctx.fillStyle = css(C.dim, .16); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(505, 434, 64, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  txt(ctx, 'motore', 505, 434, { size: 28, weight: 600 });
  nastro(ctx, [505, 258], [505, 368], 100, C.y, P(t, 69.9, 70.7, E.out));
  drawRich(ctx, '{y:calore preso}', 425, 300, { size: 30, align: 'right', alpha: P(t, 70.2, 70.7) });
  // l'ipotesi: tutto il calore diventa lavoro (rosso), poi smontata
  const kh = life(t, 74.4, 80.6, .6, .5);
  nastro(ctx, [571, 434], [880, 434], 30, C.v, P(t, 70.6, 71.3, E.out), 1 - kh);
  drawRich(ctx, '{v:lavoro}', 735, 392, { size: 30, alpha: P(t, 70.9, 71.4) * (1 - kh) });
  if (kh > 0) {
    nastro(ctx, [571, 434], [880, 434], 100, C.r, 1, .85 * kh);
    drawRich(ctx, '{r:tutto in lavoro?}', 735, 352, { size: 30, alpha: kh });
    crossMark(ctx, 505, 434, P(t, 78.8, 79.6), C.r, .7);
  }
  nastro(ctx, [505, 500], [505, 610], 70, C.y, P(t, 80.4, 81.2, E.out));
  drawRich(ctx, '{y:calore ceduto}', 425, 548, { size: 30, align: 'right', alpha: P(t, 80.8, 81.3) });
  ctx.restore();
  // l'enunciato di Kelvin, e l'equivalenza con Clausius
  const ke = life(t, 83.2, T_FINE + .1, .5, .5);
  if (ke <= 0) return;
  card(ctx, 940, 110, 870, 680, ke);
  ctx.save(); ctx.globalAlpha *= ke;
  conFont(TITOLI, () => drawRich(ctx, 'enunciato di Kelvin', 1375, 165, { size: 38, weight: 600 }));
  ['È impossibile una trasformazione', 'il cui {v:unico} risultato sia', 'trasformare in lavoro tutto', 'il calore preso da una sola sorgente.']
    .forEach((s, i) => drawRich(ctx, s, 1375, 270 + i * 50, { size: 32, local: t - 83.5 - i * .4 }));
  const kq = P(t, 92.5, 93.0);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.globalAlpha *= kq;
  ctx.beginPath(); ctx.moveTo(1010, 520); ctx.lineTo(1740, 520); ctx.stroke();
  drawRich(ctx, '{v:Clausius} e {v:Kelvin}: due modi', 1375, 585, { size: 34, local: t - 92.6 });
  drawRich(ctx, 'di dire la stessa legge', 1375, 635, { size: 34, local: t - 93.0 });
  ctx.restore();
}

// in una frase (96,8–106,9)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.8, 105.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.0 });
    drawRich(ctx, 'Da solo il calore va dal caldo al freddo;\nal contrario serve lavoro.', W / 2, 290, { size: 66, weight: 600, local: t - 97.4, stagger: .09 });
  });
  const pills = [[490, '{v:Clausius}: il calore\nnon sale da solo'], [960, 'frigorifero:\n{y:400 J} = {y:300 J} + {v:100 J}'], [1430, '{v:Kelvin}: mai tutto\nil calore in lavoro']];
  pills.forEach(([x, s], i) => {
    const a = 99.5 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): i due toni seguono le temperature dei blocchi, da 0 °C (0) a 100 °C (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 13.6, .5],                                               // i due blocchi; a contatto
    ['tono', 13.6, 16.6, [.8, .64, .57, .53, .51]],                                   // il caldo scende verso 50 °C
    ['tono', 13.6, 16.6, [.2, .36, .43, .47, .49]],                                   // il freddo sale verso 50 °C
    ['tono', 24.2, 27.0, [.51, .52, .55, .63, .8]],                                   // il film al contrario: torna a 80 °C…
    ['tono', 24.2, 27.0, [.49, .48, .45, .38, .2]],                                   // …e a 20 °C
    ['pop', 28.3, .45], ['traccia', 32.8, 33.6],                                      // il primo principio lo permette; mai
    ['pop', 37.7, .5], ['traccia', 41.8, 42.2], ['traccia', 42.4, 43.2], ['pop', 42.9, .3],   // Clausius: da solo, mai
    ['soffio', 46.2], ['pop', 46.9, .3],                                              // il frigorifero: calore tolto
    ['traccia', 51.0, 51.8], ['traccia', 55.4, 56.2], ['traccia', 60.3, 61.1],        // lavoro 100 J, tolto 300 J, ceduto 400 J
    ['ding', 61.4],                                                                   // 400 = 300 + 100
    ['soffio', 69.6], ['traccia', 69.9, 70.7], ['pop', 70.9, .5],                     // un motore: calore preso, lavoro
    ['pop', 74.5, .9], ['traccia', 78.8, 79.6],                                       // tutto in lavoro? no
    ['pop', 80.3, .2], ['traccia', 80.4, 81.2],                                       // la sorgente fredda, il calore ceduto
    ['pop', 83.6, .5], ['pop', 92.7, .6],                                             // Kelvin; i due enunciati equivalenti
    ['soffio', 97.0], ['pop', 99.5, .5], ['pop', 100.0, .6], ['pop', 100.5, .7],      // in una frase
  ];
  return {
    titolo: 'Il calore va solo in giù', durata: 106.9, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 46.1, 'dal caldo al freddo'], [46.1, 69.5, 'il frigorifero'], [69.5, T_FINE, 'l’enunciato di Kelvin']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBlocchi(ctx, t); scenaGrafico(ctx, t); scenaFrigo(ctx, t); scenaKelvin(ctx, t); scenaFine(ctx, t); },
  };
});
