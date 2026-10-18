'use strict';
/* Scomporre un vettore — la forza obliqua sulla corda della slitta, le sue ombre sugli assi; le componenti contando le tacche
   e, a 30°, col mezzo triangolo equilatero e Pitagora (niente seno e coseno nel biennio); l'angolo che cambia e la ricomposizione. Argomento: vettori. */
CVIDEO.registra('vettori/componenti', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [95.9, 190], [97.2, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [95.9, 1050], [97.2, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [95.9, 2.2], [97.2, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [95.9, 2], [97.2, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [95.9, -1.5], [97.2, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.1, 'felice'], [21.7, 'neutro'],
  [35.7, 'felice'], [40.5, 'neutro'], [45.3, 'felice'], [49.9, 'pensa'], [54.7, 'neutro'], [64.3, 'felice'],
  [69.3, 'neutro'], [74.1, 'sorpreso'], [78.9, 'neutro'], [90.8, 'festa'], [95.9, 'neutro'], [98.5, 'felice'],
  [102.1, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Una forza obliqua: quanto\ntira avanti e quanto su?'],
  [7.9, 12.3, 'Tiro una slitta con una corda\ninclinata di 30°.'],
  [12.5, 16.9, 'La forza {my:F} sta lungo la corda:\n10 N, di sbieco.'],
  [17.1, 21.5, 'Una parte tira la slitta {g:avanti},\nuna parte la tira {g:su}.'],
  [21.7, 26.1, 'Metto la forza su due assi:\n{mink:x} orizzontale, {mink:y} verticale.'],
  [26.3, 30.7, 'L’angolo {mink:α} si misura\ndall’asse {mink:x}: qui 30°.'],
  [30.9, 35.5, 'Una luce dall’alto: l’{v:ombra}\ndi {my:F} sull’asse {mink:x}…'],
  [35.7, 40.3, '…è la {y:componente} {mink:x}:\nquanto tira in avanti.'],
  [40.5, 45.1, 'Una luce da destra: l’ombra\nsull’asse {mink:y} è la componente {mink:y}.'],
  [45.3, 49.7, 'Ecco {my:F} scomposta in due\nforze lungo gli assi.'],
  [49.9, 54.5, 'Quanto sono lunghe? Basta\ncontare le tacche da 1 N.'],
  [54.7, 59.1, 'Quasi 9 tacche in avanti,\n5 in su.'],
  [59.3, 64.1, 'A 30° c’è un trucco: è mezzo\ntriangolo {v:equilatero}.'],
  [64.3, 69.1, 'Opposto a 30° c’è la metà:\ncomponente {mink:y} = {g:5 N}.'],
  [69.3, 73.9, 'L’altra con Pitagora:\n√(10² − 5²) ≈ {g:8,7 N}.'],
  [74.1, 78.7, 'Se l’angolo cresce, la componente\n{mink:x} cala e la {mink:y} cresce.'],
  [78.9, 83.3, 'A 60° si scambiano:\n5 N avanti, 8,7 N in su.'],
  [83.5, 85.8, 'Torno a 30°.'],
  [86.0, 90.6, 'Al contrario, dalle componenti\nsi ricompone la forza: punta-coda.'],
  [90.8, 95.6, 'Pitagora: {my:F} = √(8,7² + 5²)\n≈ 10 N. Torna!'],
  [98.5, 103.7, 'Ogni vettore è la somma delle\nsue componenti lungo gli assi.'],
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
// testo ricco con pedici a lettere: «{my:F}⌊{mink:x}⌋» scrive F con la x piccola in basso
function conPedici(ctx, s, x, y, o = {}) {
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.round(size * .62);
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
const FX = '{my:F}⌊{mink:x}⌋', FY = '{my:F}⌊{mink:y}⌋';
// un numero col segno = se è esatto ai centesimi, ≈ se è arrotondato
const uguale = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-6 ? '=' : '≈';

// ---------- la scena: 55 px per newton, la coda della forza in O (il gancio della slitta) ----------
const SCH = [372, 110, 860, 690], PAN = [1260, 110, 580, 690];
const O = [500, 660], U = 55, F = 10, RAD = Math.PI / 180;
const pt = (x, y) => [O[0] + x * U, O[1] - y * U];
// l'angolo della corda: 30°, poi sale a 60° e torna a 30°
const alfa = t => kf(t, [[74.4, 30], [77.6, 60], [83.6, 60], [84.6, 30]]);

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Scomporre un vettore', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// la slitta, col gancio della corda in O
function slitta(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(392, 704); ctx.lineTo(1212, 704); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(392, 694); ctx.lineTo(472, 694); ctx.quadraticCurveTo(500, 694, O[0], O[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(412, 672); ctx.lineTo(412, 694); ctx.moveTo(458, 672); ctx.lineTo(458, 694); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .7)); ctx.strokeStyle = css(mix(C.y, C.ink, .5)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(394, 626, 82, 46, 8); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function sceneForza(ctx, t) {
  if (t < 7.5 || t > 96.3) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 95.5, 96.1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...SCH);
  const a = alfa(t), c = Math.cos(a * RAD), s = Math.sin(a * RAD);
  const fx = F * c, fy = F * s, punta = pt(fx, fy);
  // 1 · la slitta e la corda
  const ks = 1 - P(t, 21.8, 22.5);
  slitta(ctx, ks);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(O[0] + 700 * c, O[1] - 700 * s); ctx.stroke(); ctx.restore();
    const kp = life(t, 17.2, 21.8, .4, .4);
    if (kp > 0) {
      freccia(ctx, O, pt(fx, 0), C.y, kp * .45, 6); freccia(ctx, O, pt(0, fy), C.y, kp * .45, 6);
      drawRich(ctx, '{g:avanti}', pt(fx / 2, 0)[0], O[1] + 74, { size: 36, alpha: kp });
      drawRich(ctx, '{g:su}', O[0] - 24, pt(0, fy / 2)[1], { size: 36, align: 'right', alpha: kp });
    }
  }
  // 2 · gli assi, con una tacca ogni newton
  const ka = P(t, 21.9, 22.7);
  if (ka > 0) {
    ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    const X1 = pt(10.8, 0)[0], Y1 = pt(0, 9.3)[1];
    ctx.beginPath(); ctx.moveTo(O[0] - 20, O[1]); ctx.lineTo(X1, O[1]); ctx.moveTo(O[0], O[1] + 20); ctx.lineTo(O[0], Y1); ctx.stroke();
    arrowHead(ctx, [X1 + 6, O[1]], 0, C.ink); arrowHead(ctx, [O[0], Y1 - 6], -Math.PI / 2, C.ink);
    ctx.lineWidth = 2;
    for (let n = 1; n <= 10; n++) {
      ctx.beginPath(); ctx.moveTo(pt(n, 0)[0], O[1] - 7); ctx.lineTo(pt(n, 0)[0], O[1] + 7); ctx.stroke();
      if (n <= 9) { ctx.beginPath(); ctx.moveTo(O[0] - 7, pt(0, n)[1]); ctx.lineTo(O[0] + 7, pt(0, n)[1]); ctx.stroke(); }
    }
    drawRich(ctx, '{mink:x}', X1 + 36, O[1], { size: 44 });
    drawRich(ctx, '{mink:y}', O[0] + 32, Y1, { size: 44, align: 'left' });
    txt(ctx, '1 N per tacca', 1190, 768, { size: 30, color: C.dim, align: 'right' });
    ctx.restore();
  }
  // l'angolo α, misurato dall'asse x
  const kα = P(t, 26.4, 27.0);
  if (kα > 0) {
    ctx.save(); ctx.globalAlpha *= kα; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(O[0], O[1], 90, -a * RAD * P(t, 26.4, 27.0), 0); ctx.stroke();
    // l'etichetta sta fra l'asse e la forza, lontana dalla proiezione tratteggiata; si spegne quando le passa sopra un raggio o Fy
    const m = a * .4 * RAD, r = 240 - (a - 30) * 4 / 3;
    drawRich(ctx, '{mink:α} = ' + Math.round(a) + '°', O[0] + r * Math.cos(m), O[1] - r * Math.sin(m),
      { size: 40, alpha: P(t, 26.7, 27.2) * (1 - life(t, 40.4, 43.8, .2, .4)) * (1 - life(t, 86.4, 88.0, .2, .3)) });
    ctx.restore();
  }
  // le luci: dall'alto (ombra sull'asse x) e da destra (ombra sull'asse y); i raggi si fermano sulla freccia
  const kl1 = life(t, 31.0, 36.6, .3, .4);
  if (kl1 > 0) {
    ctx.save(); ctx.globalAlpha *= kl1;
    const kd = P(t, 31.1, 32.1);
    for (let i = 0; i < 7; i++) {
      const u = fx * (i + .5) / 7, x = pt(u, 0)[0], yF = pt(u, u * s / c)[1];
      dashed(ctx, [x, 140], [x, yF], C.dim, kd, .8);
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 32.0, 32.6) * (1 - P(t, 35.8, 36.4)); ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(...pt(fx, 0)); ctx.stroke(); ctx.restore();
  }
  const kl2 = life(t, 40.6, 43.6, .3, .4);
  if (kl2 > 0) {
    ctx.save(); ctx.globalAlpha *= kl2;
    const kd = P(t, 40.7, 41.7);
    for (let i = 0; i < 6; i++) {
      const v = fy * (i + .5) / 6, y = pt(0, v)[1], xF = pt(v * c / s, 0)[0];
      dashed(ctx, [1200, y], [xF, y], C.dim, kd, .8);
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 41.6, 42.2) * (1 - P(t, 42.8, 43.4)); ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(...pt(0, fy)); ctx.stroke(); ctx.restore();
  }
  // il mezzo triangolo equilatero: O, il piede di Fx, la punta (30° in O, 90° al piede)
  const kh = life(t, 59.4, 74.0, .4, .4);
  if (kh > 0) { ctx.save(); ctx.fillStyle = css(C.y, .14 * kh); ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(...pt(fx, 0)); ctx.lineTo(...punta); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // le proiezioni tratteggiate chiudono il rettangolo
  const kr = P(t, 45.4, 46.2);
  if (kr > 0) { dashed(ctx, punta, pt(fx, 0), C.dim, kr, .9); dashed(ctx, punta, pt(0, fy), C.dim, kr, .9); }
  // il cateto opposto ai 30°, in arancio mentre Stilla dice che è la metà
  const ko = life(t, 64.4, 69.2, .4, .4);
  if (ko > 0) { ctx.save(); ctx.globalAlpha *= ko; ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...punta); ctx.lineTo(...pt(fx, 0)); ctx.stroke(); ctx.restore(); }
  // le componenti: Fy scivola con la coda sulla punta di Fx per ricomporre la forza
  // contare le tacche: numeri verdi sotto l'asse x e a sinistra dell'asse y (le etichette Fx, Fy si fanno da parte)
  const kn = life(t, 50.1, 59.2, .3, .4);
  if (kn > 0) {
    for (let n = 1; n <= 8; n++) txt(ctx, String(n), pt(n, 0)[0], O[1] + 32, { size: 30, weight: 600, color: C.g, alpha: kn * P(t, 50.2 + (n - 1) * .28, 50.45 + (n - 1) * .28) });
    drawRich(ctx, '{g:quasi 9}', pt(fx, 0)[0], O[1] + 66, { size: 30, alpha: kn * P(t, 52.5, 52.9) });   // sotto la punta di Fx, una riga più giù
    for (let n = 1; n <= 5; n++) txt(ctx, String(n), O[0] - 18, pt(0, n)[1], { size: 30, weight: 600, color: C.g, align: 'right', alpha: kn * P(t, 53.0 + (n - 1) * .28, 53.25 + (n - 1) * .28) });
  }
  const kx = P(t, 35.8, 36.4), ky = P(t, 42.8, 43.4), kc = P(t, 86.6, 87.6);
  freccia(ctx, O, pt(fx, 0), C.y, kx, 7);
  conPedici(ctx, FX, pt(fx / 2, 0)[0], O[1] + 46, { size: 44, align: 'center', alpha: kx * (1 - kn) });
  const by = [lerp(O[0], pt(fx, 0)[0], kc), O[1]];
  freccia(ctx, by, [by[0], by[1] - fy * U], C.y, ky, 7);
  conPedici(ctx, FY, by[0] + lerp(-22, 22, kc), O[1] - fy * U / 2, { size: 44, align: kc < .5 ? 'right' : 'left', alpha: ky * Math.abs(1 - 2 * kc) * (1 - kn) });
  // la forza, sopra tutto; più spessa quando si ricompone
  const kF = P(t, 12.7, 13.5);
  freccia(ctx, O, [lerp(O[0], punta[0], kF), lerp(O[1], punta[1], kF)], C.y, 1, 9 + 3 * life(t, 87.6, 95.6, .4, .4));
  drawRich(ctx, '{my:F} = 10 N', punta[0] + 52 * s + 10, punta[1] + 52 * c, { size: 40, align: 'left', alpha: P(t, 13.3, 13.8) * (1 - life(t, 40.4, 43.8, .2, .4)) });
  // Pitagora
  const kq = P(t, 90.9, 91.4);
  if (kq > 0) drawRich(ctx, '{my:F}{mink: = √(8,7² + 5²) ≈ }10 N', 900, 210, { size: 44, alpha: kq, local: t - 90.9 });
  ctx.restore();
}

// il pannello: i dati, il mezzo triangolo, le componenti
const newton = v => Math.abs(v - Math.round(v)) < 1e-6 ? String(Math.round(v)) : fmtN(v, 1);
function scenePannello(ctx, t) {
  if (t < 12.4 || t > 96.3) return;
  const al = P(t, 12.5, 13.1) * (1 - P(t, 95.5, 96.1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...PAN);
  const a = Math.round(alfa(t) * 10) / 10, ar = Math.round(a);   // i conti si fanno sull'angolo mostrato
  const c = Math.cos(ar * RAD), s = Math.sin(ar * RAD);
  txt(ctx, 'forza', 1300, 165, { size: 32, color: C.dim, align: 'left' });
  drawRich(ctx, '{my:F} = 10 N', 1300, 217, { size: 44, align: 'left' });
  const kα = P(t, 26.4, 26.9);
  txt(ctx, 'angolo', 1300, 295, { size: 32, color: C.dim, align: 'left', alpha: 1 - kα });
  drawRich(ctx, '{dim:angolo con l’asse }{mink:x}', 1300, 295, { size: 32, align: 'left', alpha: kα });
  drawRich(ctx, (kα > .5 ? '{mink:α} = ' : '') + ar + '°', 1300, 347, { size: 44, align: 'left' });
  // il mezzo triangolo equilatero: lati da 10 N, l'altezza lo taglia in due; il lato opposto a 30° è metà
  // vale per 30°: si spegne mentre l'angolo cambia e si riaccende quando torna a 30°
  const kt = P(t, 59.4, 60.0) * Math.max(1 - P(t, 74.0, 74.4), P(t, 84.6, 85.0));
  const km = P(t, 64.4, 64.9);   // «opposto a 30°: metà» si accende quando Stilla lo dice
  if (kt > 0) {
    ctx.save(); ctx.globalAlpha *= kt;
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1295, 395); ctx.lineTo(1805, 395); ctx.stroke();
    const TA = [1330, 505], TB = [1486, 415], TC = [1486, 595], TM = [1486, 505];
    ctx.fillStyle = css(C.y, .16); ctx.beginPath(); ctx.moveTo(...TA); ctx.lineTo(...TB); ctx.lineTo(...TM); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(...TA); ctx.lineTo(...TB); ctx.lineTo(...TC); ctx.closePath(); ctx.stroke();
    dashed(ctx, TA, TM, C.dim, 1, 1);
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(TA[0], TA[1], 52, -Math.PI / 6, 0); ctx.stroke();
    txt(ctx, '30°', 1392, 488, { size: 30, color: C.v, align: 'left' });
    txt(ctx, '10 N', 1398, 432, { size: 30, align: 'right' });
    txt(ctx, '5 N', 1500, 460, { size: 30, weight: 600, color: C.y, align: 'left', alpha: km });
    txt(ctx, '5 N', 1500, 550, { size: 30, align: 'left', alpha: km });
    txt(ctx, 'equilatero,', 1575, 430, { size: 30, color: C.dim, align: 'left' });
    txt(ctx, 'lati da 10 N', 1575, 470, { size: 30, color: C.dim, align: 'left' });
    drawRich(ctx, 'opposto a 30°:', 1575, 530, { size: 30, align: 'left', alpha: km });
    drawRich(ctx, '{g:metà}, 5 N', 1575, 570, { size: 30, align: 'left', alpha: km });
    ctx.restore();
  }
  // le componenti: prima contando le tacche, poi a 30° col mezzo triangolo e Pitagora, poi coi numeri dell'angolo mostrato
  const kr = P(t, 54.8, 55.3), kye = P(t, 64.4, 64.9), kxe = P(t, 69.4, 69.9), kv = P(t, 73.9, 74.3);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1295, 615); ctx.lineTo(1805, 615); ctx.stroke();
    ctx.restore();
  }
  const fx = Math.round(F * c * 10) / 10, fy = Math.round(F * s * 10) / 10;
  conPedici(ctx, FX + ' {dim:quasi} 9 N', 1300, 665, { size: 40, alpha: kr * (1 - kxe) });
  conPedici(ctx, FX + '{mink: = √(10² − 5²) ≈ }8,7 N', 1300, 665, { size: 40, alpha: kxe * (1 - kv) });
  conPedici(ctx, FY + '{mink: ≈ }5 N', 1300, 735, { size: 40, alpha: kr * (1 - kye) });
  conPedici(ctx, FY + '{mink: = }10 N / 2{mink: = }5 N', 1300, 735, { size: 40, alpha: kye * (1 - kv) });
  conPedici(ctx, FX + '{mink: ' + uguale(F * c, 1) + ' }' + newton(fx) + ' N', 1300, 665, { size: 40, alpha: kv });
  conPedici(ctx, FY + '{mink: ' + uguale(F * s, 1) + ' }' + newton(fy) + ' N', 1300, 735, { size: 40, alpha: kv });
  ctx.restore();
}

// in una frase (96–106,5)
function sceneFine(ctx, t) {
  if (t < 96.0) return;
  const al = 1 - P(t, 104.3, 105.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 96.2 });
    drawRich(ctx, 'Un vettore è la somma delle sue\n{y:componenti} lungo gli assi.', W / 2, 290, { size: 70, weight: 600, local: t - 96.6, stagger: .09 });
  });
  const pills = [[490, 'si contano\nle {g:tacche}'], [960, 'a 30°: metà,\npoi {g:Pitagora}'], [1430, 'si ricompone\n{v:punta-coda}']];
  pills.forEach(([x, s], i) => {
    const a = 98.1 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 36, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della punta della forza, da 0 (0) a 10 N (1);
  // nel conteggio delle tacche segue il numero contato
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 12.7, 13.5], ['tono', 12.7, 13.5, [0, .03, .25, .47, .5]],   // la slitta; la forza da 10 N
    ['pop', 17.3, .5],                                                                // avanti e su
    ['traccia', 21.9, 22.7], ['traccia', 26.4, 27.0],                                 // gli assi; l'angolo α
    ['traccia', 31.1, 32.1], ['pop', 35.9, .4],                                       // luce dall'alto: la componente x
    ['traccia', 40.7, 41.7], ['pop', 42.9, .6],                                       // luce da destra: la componente y
    ['traccia', 45.4, 46.2],                                                          // le proiezioni chiudono il rettangolo
    ['tono', 50.2, 52.4, [.1, .2, .3, .4, .5, .6, .7, .8]], ['pop', 52.6, .85],       // contare le tacche: quasi 9
    ['tono', 53.0, 54.1, [.1, .2, .3, .4, .5]],                                       // 5 in su
    ['pop', 59.5, .5], ['traccia', 64.4, 64.8], ['pop', 64.6, .5],                    // mezzo equilatero: opposto a 30°, 5 N
    ['ding', 70.0],                                                                   // Pitagora: 8,7 N
    ['tono', 74.4, 77.6, [.5, .51, .61, .79, .86, .87]],                              // l'angolo cresce: la y cresce
    ['tono', 83.6, 84.6, [.87, .82, .57, .5]],                                        // torno a 30°
    ['traccia', 86.6, 87.6],                                                          // punta-coda: si ricompone
    ['soffio', 96.2], ['pop', 98.1, .5], ['pop', 98.6, .6], ['pop', 99.1, .7],        // in una frase
  ];
  return {
    titolo: 'Scomporre un vettore', durata: 106.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.6, 'una forza obliqua'], [21.6, 49.8, 'le ombre sugli assi'], [49.8, 74.0, 'quanto sono lunghe'],
      [74.0, 95.7, 'l’angolo cambia, la forza si ricompone']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneForza(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
