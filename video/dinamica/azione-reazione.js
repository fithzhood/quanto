'use strict';
/* Perché non si annullano — azione e reazione: i due pattinatori, il terzo principio, il cavallo e il carretto. Argomento: dinamica. */
CVIDEO.registra('dinamica/azione-reazione', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [95.0, 190], [96.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [95.0, 1050], [96.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [95.0, 2.2], [96.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [95.0, 2], [96.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [95.0, -1.5], [96.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.0, 'felice'], [24.5, 'neutro'],
  [33.1, 'sorpreso'], [37.7, 'felice'], [41.8, 'neutro'], [50.1, 'felice'], [54.6, 'neutro'], [64.3, 'pensa'],
  [68.4, 'neutro'], [72.5, 'sorpreso'], [77.4, 'felice'], [81.9, 'neutro'], [86.4, 'felice'], [90.5, 'neutro'],
  [97.6, 'felice'], [102.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Azione e reazione sono opposte:\nperché non si annullano?'],
  [7.9, 12.1, 'Due pattinatori fermi sul ghiaccio,\nuno di fronte all’altro.'],
  [12.2, 16.0, 'A ha massa 60 kg,\nB solo 40 kg.'],
  [16.1, 19.9, 'Si spingono con le mani,\nal rallentatore…'],
  [20.0, 24.4, 'A spinge B: questa forza\nagisce {g:su B}, verso destra.'],
  [24.5, 28.9, 'B spinge A: questa forza\nagisce {g:su A}, verso sinistra.'],
  [29.0, 33.0, 'Stesso modulo, stessa direzione,\nverso {g:opposto}.'],
  [33.1, 37.5, 'Ma agiscono su {v:corpi diversi}:\nnon possono annullarsi.'],
  [37.7, 41.7, 'Ognuno parte per la forza\nche agisce {g:su di lui}…'],
  [41.8, 46.1, '…B, più leggero, va più veloce:\n1,5 m/s contro 1 m/s.'],
  [46.6, 50.0, 'È il {v:terzo principio}\ndella dinamica.'],
  [50.1, 54.5, 'A ogni azione corrisponde una\nreazione uguale e contraria…'],
  [54.6, 59.2, '…ma su un altro corpo. Si annullano\nsolo forze sullo {v:stesso} corpo.'],
  [59.6, 64.2, 'Il cavallo tira il carretto, e il\ncarretto tira il cavallo indietro.'],
  [64.3, 68.3, 'Forze uguali e opposte:\ncome fanno a partire?'],
  [68.4, 72.4, 'Stanno su corpi diversi.\nGuardiamo {g:solo il cavallo}.'],
  [72.5, 77.3, 'Il cavallo spinge il terreno indietro,\ne il terreno spinge il cavallo {g:avanti}.'],
  [77.4, 81.8, 'In avanti 600 N, indietro 350 N:\nil cavallo {g:accelera}.'],
  [81.9, 86.3, 'Sul carretto: 350 N avanti,\nsolo 200 N di {y:attrito} indietro.'],
  [86.4, 90.4, 'E partono insieme, con la stessa\naccelerazione: 0,5 m/s².'],
  [90.5, 94.6, 'Il moto dipende dalle forze\nche agiscono {g:su quel corpo}.'],
  [97.6, 102.4, 'Ogni forza ha la sua reazione,\nma sempre su {g:un altro corpo}.'],
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
function fermo(ctx, x, y, al, testo = 'fermo immagine') {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
// un pattinatore visto di fianco: x al centro, piedi in yp, dir = verso in cui guarda, braccio lungo br
function pattinatore(ctx, x, yp, dir, br, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 34, yp); ctx.lineTo(x + 30, yp); ctx.quadraticCurveTo(x + 40, yp, x + 38, yp - 8); ctx.stroke();   // la lama
  ctx.lineWidth = 12; ctx.strokeStyle = css(mix(C.ink, col, .25));
  ctx.beginPath(); ctx.moveTo(x - 8, yp - 92); ctx.lineTo(x - 14, yp - 8); ctx.moveTo(x + 8, yp - 92); ctx.lineTo(x + 14, yp - 8); ctx.stroke();   // le gambe
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.roundRect(x - 26, yp - 178, 52, 92, 16); ctx.fill();   // il corpo
  ctx.strokeStyle = css(col); ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(x + dir * 12, yp - 160); ctx.lineTo(x + dir * br, yp - 150); ctx.stroke();   // il braccio teso
  ctx.fillStyle = css(mix(col, C.paper, .35)); ctx.beginPath(); ctx.arc(x, yp - 204, 24, 0, Math.PI * 2); ctx.fill();   // la testa
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché non si annullano', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · i due pattinatori (7,5–46,4)
// la spinta dura 0,5 s veri con 120 N: A (60 kg) accelera di 2 m/s², B (40 kg) di 3 m/s²; poi scivolano a 1 e 1,5 m/s
const YP = 600, PXS = 60, XA0 = 890, XB0 = 1030, XC = 960, FS = 1;   // FS: 1 px per newton
function fase(t) {   // [tempo vero della spinta 0–0,5 s, tempo vero dello scivolamento]
  if (t < 16.5) return [0, 0];
  if (t < 19.9) return [(t - 16.5) / 13.6, 0];
  if (t < 37.7) return [.25, 0];
  if (t < 41.1) return [.25 + (t - 37.7) / 13.6, 0];
  return [.5, t - 41.1];
}
function scenePattinatori(ctx, t) {
  if (t < 7.5 || t > 46.6) return;
  const al = life(t, 7.6, 46.4, .6, .5);
  ctx.save(); ctx.globalAlpha *= al;
  // il ghiaccio
  ctx.fillStyle = css(mix(C.x, C.paper, .84)); ctx.beginPath(); ctx.roundRect(120, YP, 1680, 34, 10); ctx.fill();
  const [tp, tg] = fase(t);
  const dA = tp * tp + tg, dB = 1.5 * tp * tp + 1.5 * tg, vA = 2 * tp, vB = 3 * tp;
  const xA = XA0 - dA * PXS, xB = XB0 + dB * PXS;
  const pA = Math.min(tp, .5) ** 2, pB = 1.5 * Math.min(tp, .5) ** 2;   // spostamento durante la spinta: le mani restano a contatto
  // corpi diversi: un alone per ciascuno
  const kh = life(t, 33.2, 37.6, .4, .4);
  if (kh > 0) {
    ctx.save(); ctx.globalAlpha *= kh * .14; ctx.fillStyle = css(C.v);
    ctx.beginPath(); ctx.ellipse(xA - 50, 470, 130, 190, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(xB + 50, 470, 130, 190, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  pattinatore(ctx, xA, YP, 1, 70 + pA * PXS, mix(C.dim, C.ink, .2));
  pattinatore(ctx, xB, YP, -1, 70 + pB * PXS, mix(C.dim, C.paper, .25));
  txt(ctx, 'A · 60 kg', xA + 20, YP + 70, { size: 32, weight: 600, align: 'right' });
  txt(ctx, 'B · 40 kg', xB - 20, YP + 70, { size: 32, weight: 600, align: 'left' });
  // le due forze, finché le mani si toccano
  const spinge = t >= 16.5 && t < 41.1;
  const kAB = spinge ? P(t, 20.1, 20.6) : 0, kBA = spinge ? P(t, 24.6, 25.1) : 0, kN = P(t, 29.2, 29.7);
  freccia(ctx, [xB, 470], [xB + 120 * FS, 470], C.y, kAB);
  drawRich(ctx, '{y:forza di A su B}', xB + 36, 420, { size: 30, align: 'left', alpha: kAB });
  drawRich(ctx, '{y:120 N}', xB + 82, 506, { size: 30, alpha: kAB * kN });
  freccia(ctx, [xA, 470], [xA - 120 * FS, 470], C.y, kBA);
  drawRich(ctx, '{y:forza di B su A}', xA - 36, 420, { size: 30, align: 'right', alpha: kBA });
  drawRich(ctx, '{y:120 N}', xA - 82, 506, { size: 30, alpha: kBA * kN });
  // le velocità, quando ripartono
  const kv = P(t, 37.8, 38.3), kn = P(t, 41.3, 41.8);
  freccia(ctx, [xA, 330], [xA - vA * 80, 330], C.x, kv);
  freccia(ctx, [xB, 330], [xB + vB * 80, 330], C.x, kv);
  drawRich(ctx, '{x:1 m/s}', xA - 40, 292, { size: 30, alpha: kn });
  drawRich(ctx, '{x:1,5 m/s}', xB + 60, 292, { size: 30, alpha: kn });
  // che tempo si sta guardando
  if (t > 16.4) {
    const testo = t < 19.9 || (t >= 37.7 && t < 41.1) ? 'al rallentatore' : t < 37.7 ? 'fermo immagine' : 'tempo reale';
    fermo(ctx, 1500, 150, P(t, 16.4, 16.8), testo);
  }
  ctx.restore();
}

// 2 · il terzo principio (46,4–59,4)
function scenePrincipio(ctx, t) {
  if (t < 46.2 || t > 59.6) return;
  const al = life(t, 46.4, 59.4, .6, .5);
  card(ctx, 300, 120, 1320, 650, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'terzo principio della dinamica', 960, 180, { size: 40, weight: 600 }));
  drawRich(ctx, 'Se un corpo A esercita una forza su un corpo B,\nB esercita su A una forza con lo stesso modulo\ne la stessa direzione, ma verso {g:opposto}.', 960, 315, { size: 40, local: t - 47.0, stagger: .035 });
  // A e B a contatto, ciascuno con la forza che riceve
  const kd = P(t, 50.3, 50.9);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    ctx.fillStyle = css(mix(C.dim, C.paper, .7)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(845, 520, 112, 100, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(963, 520, 112, 100, 12); ctx.fill(); ctx.stroke();
    txt(ctx, 'A', 901, 570, { size: 44, weight: 600 }); txt(ctx, 'B', 1019, 570, { size: 44, weight: 600 });
    freccia(ctx, [1056, 570], [1256, 570], C.y);
    freccia(ctx, [864, 570], [664, 570], C.y);
    drawRich(ctx, '{y:di A su B}', 1170, 528, { size: 30 });
    drawRich(ctx, '{y:di B su A}', 750, 528, { size: 30 });
    ctx.restore();
  }
  drawRich(ctx, 'si annullano solo forze sullo {v:stesso} corpo', 960, 700, { size: 40, local: t - 56.6, stagger: .04 });
  ctx.restore();
}

// 3 · il cavallo e il carretto (59,4–95,2)
// cavallo 500 kg, carretto 300 kg, a = 0,5 m/s² per tutti e due: sul cavallo 600 − 350 = 250 N, sul carretto 350 − 200 = 150 N
const YT = 620, XC0 = 330, XH0 = 790, FN = .4, PXC = 30, T0 = 86.6;   // FN: px per newton
// in secondo piano si sbiadisce mescolando i colori con lo sfondo (non con la trasparenza: le parti sovrapposte si vedrebbero)
function cavallo(ctx, xh, col0, k) {
  const col = mix(col0, C.bg, 1 - k);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = css(mix(mix(col0, C.ink, .3), C.bg, 1 - k)); ctx.lineWidth = 12;
  ctx.beginPath();
  for (const [a, b] of [[-80, -84], [-55, -50], [55, 52], [80, 86]]) { ctx.moveTo(xh + a, 500); ctx.lineTo(xh + b, YT - 4); }
  ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(xh - 108, 455); ctx.quadraticCurveTo(xh - 140, 470, xh - 138, 525); ctx.stroke();   // la coda
  ctx.strokeStyle = css(col); ctx.lineWidth = 42; ctx.beginPath(); ctx.moveTo(xh + 80, 460); ctx.lineTo(xh + 138, 392); ctx.stroke();   // il collo
  ctx.fillStyle = css(col);
  ctx.beginPath(); ctx.ellipse(xh, 470, 112, 46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(xh + 168, 398, 44, 22, .45, 0, Math.PI * 2); ctx.fill();   // la testa
  ctx.beginPath(); ctx.moveTo(xh + 128, 372); ctx.lineTo(xh + 136, 344); ctx.lineTo(xh + 148, 372); ctx.closePath(); ctx.fill();   // l'orecchio
  txt(ctx, '500 kg', xh - 10, 472, { size: 30, weight: 600, color: mix(C.paper, col, 1 - k) });
  ctx.restore();
}
function carretto(ctx, xc, k) {
  const sb = c => mix(c, C.bg, 1 - k);
  ctx.save();
  ctx.fillStyle = css(sb(mix(mix(C.y, C.ink, .45), C.paper, .45))); ctx.strokeStyle = css(sb(C.ink)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(xc - 90, 462, 180, 70, 10); ctx.fill(); ctx.stroke();
  txt(ctx, '300 kg', xc, 492, { size: 30, weight: 600, color: sb(C.ink) });
  ctx.lineWidth = 6; ctx.fillStyle = css(sb(C.paper));
  ctx.beginPath(); ctx.arc(xc, YT - 45, 43, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath();
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4 + (xc - XC0) / 43; ctx.moveTo(xc + Math.cos(a) * 40, YT - 45 + Math.sin(a) * 40); ctx.lineTo(xc - Math.cos(a) * 40, YT - 45 - Math.sin(a) * 40); }
  ctx.stroke();
  ctx.restore();
}
function sceneCavallo(ctx, t) {
  if (t < 59.2 || t > 95.4) return;
  const al = life(t, 59.4, 95.2, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  const d = Math.max(0, t - T0), s = .25 * d * d * PXC;   // s = ½·0,5·t²
  const xc = XC0 + s, xh = XH0 + s;
  // chi è al centro dell'attenzione: prima il cavallo, poi il carretto
  const kH = 1 - .7 * P(t, 81.9, 82.4) * (1 - P(t, 86.4, 86.9)), kC = 1 - .7 * P(t, 68.4, 68.9) * (1 - P(t, 81.9, 82.4));
  // il terreno
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(120, YT); ctx.lineTo(1800, YT); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 130; x < 1800; x += 28) { ctx.moveTo(x, YT + 4); ctx.lineTo(x - 14, YT + 20); }
  ctx.stroke();
  // il timone che li lega
  ctx.save(); ctx.globalAlpha *= Math.min(kH, kC); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(xc + 90, 505); ctx.lineTo(xh - 100, 488); ctx.stroke(); ctx.restore();
  carretto(ctx, xc, kC);
  cavallo(ctx, xh, mix(C.dim, C.ink, .2), kH);
  // le forze del tiro: uguali e opposte, una per corpo
  const kT = P(t, 59.9, 60.5);
  freccia(ctx, [xc + 90, 505], [xc + 90 + 350 * FN, 505], C.y, kT * kC);
  drawRich(ctx, '{y:dal cavallo 350 N}', xc + 182, 552, { size: 30, alpha: kT * kC });
  freccia(ctx, [xh - 112, 462], [xh - 112 - 350 * FN, 462], C.y, kT * kH);
  drawRich(ctx, '{y:dal carretto 350 N}', xh - 115, 420, { size: 30, align: 'right', alpha: kT * kH });
  // l'idea sbagliata
  const kr = life(t, 64.5, 69.6, .4, .6);
  if (kr > 0) {
    drawRich(ctx, '{r:«Si annullano: quindi restano fermi?»}', 960, 240, { size: 44, alpha: kr });
    const kx = P(t, 68.5, 68.9);
    if (kx > 0) { ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(560, 242); ctx.lineTo(560 + 800 * kx, 242); ctx.stroke(); ctx.restore(); }
  }
  // il cavallo spinge il terreno, il terreno spinge il cavallo
  const kG = P(t, 73.0, 73.5), kR = life(t, 74.0, 77.4, .4, .5);
  freccia(ctx, [xh + 86, YT - 8], [xh + 86 + 600 * FN, YT - 8], C.y, kG * kH);
  drawRich(ctx, '{y:dal terreno 600 N}', xh + 206, YT + 42, { size: 30, alpha: kG * kH });
  freccia(ctx, [xh + 60, YT + 16], [xh + 60 - 600 * FN, YT + 16], C.y, kR * .6);
  drawRich(ctx, '{y:sul terreno 600 N}', xh - 90, YT + 74, { size: 30, alpha: kR * .8 });
  // le accelerazioni
  const kaH = P(t, 79.2, 79.7), kaC = P(t, 84.0, 84.5);
  freccia(ctx, [xh - 60, 320], [xh - 60 + .5 * 120, 320], C.v, kaH * kH);
  drawRich(ctx, '{mv:a} = 0,5 m/s²', xh + 14, 320, { size: 30, align: 'left', alpha: kaH * kH });
  // l'attrito delle ruote, sul carretto
  const kF = P(t, 82.4, 82.9);
  freccia(ctx, [xc, YT - 6], [xc - 200 * FN, YT - 6], C.y, kF * kC);
  drawRich(ctx, '{y:attrito 200 N}', xc - 40, YT + 42, { size: 30, alpha: kF * kC });
  freccia(ctx, [xc - 30, 360], [xc - 30 + .5 * 120, 360], C.v, kaC * kC);
  drawRich(ctx, '{mv:a} = 0,5 m/s²', xc + 44, 360, { size: 30, align: 'left', alpha: kaC * kC });
  fermo(ctx, 1500, 150, P(t, 59.8, 60.2), t < T0 ? 'fermo immagine' : 'tempo reale');
  ctx.restore();
}

// 4 · riassunto (95,2–105)
function sceneFine(ctx, t) {
  if (t < 95.1) return;
  const al = 1 - P(t, 103.4, 104.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 95.4 });
    drawRich(ctx, 'Azione e reazione sono uguali e opposte,\nma agiscono su {g:corpi diversi}.', W / 2, 290, { size: 66, weight: 600, local: t - 95.8, stagger: .09 });
  });
  const pills = [[490, 'stesso modulo,\nverso {g:opposto}'], [960, 'si annullano solo\nsullo {v:stesso} corpo'], [1430, 'il moto dipende dalle\nforze {g:su quel corpo}']];
  pills.forEach(([x, s], i) => {
    const a = 98.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, i pattinatori
    ['tono', 16.5, 19.9, [.45, .48, .55]],                                            // si spingono, al rallentatore
    ['pop', 20.1, .6], ['pop', 24.6, .4], ['pop', 29.2, .5],                          // A su B, B su A, 120 N
    ['pop', 33.2, .55],                                                               // corpi diversi
    ['tono', 37.7, 41.1, [.55, .6, .7, .8]], ['pop', 37.8, .6], ['ding', 41.3],       // ripartono: 1 m/s e 1,5 m/s
    ['soffio', 46.4], ['pop', 47.0, .45], ['pop', 50.3, .5], ['ding', 56.6],          // il terzo principio
    ['soffio', 59.4], ['pop', 59.9, .5],                                              // il cavallo e il carretto: 350 N
    ['pop', 64.5, .3], ['traccia', 68.5, 68.9],                                       // l'idea sbagliata, cancellata
    ['pop', 73.0, .7], ['pop', 74.0, .3], ['pop', 79.2, .6],                          // dal terreno 600 N, a = 0,5 m/s²
    ['pop', 82.4, .3], ['pop', 84.0, .6],                                             // l'attrito, il carretto
    ['ding', 86.6], ['tono', 86.6, 89.6, [.3, .33, .42, .57]],                        // partono insieme
    ['soffio', 95.4], ['pop', 98.6, .5], ['pop', 99.1, .6], ['pop', 99.6, .7],        // in una frase
  ];
  return {
    titolo: 'Perché non si annullano', durata: 105, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 46.4, 'i due pattinatori'], [46.4, 59.4, 'il terzo principio'], [59.4, 95.1, 'il cavallo e il carretto']],
    scena(ctx, t) { sceneIntro(ctx, t); scenePattinatori(ctx, t); scenePrincipio(ctx, t); sceneCavallo(ctx, t); sceneFine(ctx, t); },
  };
});
