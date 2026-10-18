'use strict';
/* 3 + 4 = 5 — due spostamenti perpendicolari di 3 km e 4 km danno 5 km: la somma punta-coda e il parallelogramma;
   il modulo della somma dipende dall'angolo e sta fra 1 e 7 km. Argomento: vettori. */
CVIDEO.registra('vettori/somma', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, dot, dashed, card, arrowHead, crossMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [93.0, 190], [94.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [93.0, 1050], [94.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [93.0, 2.2], [94.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [93.0, 2], [94.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [93.0, -1.5], [94.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [25.4, 'sorpreso'], [29.8, 'felice'],
  [34.6, 'neutro'], [44.0, 'felice'], [48.8, 'neutro'], [53.6, 'felice'], [58.0, 'pensa'], [62.6, 'felice'],
  [68.9, 'neutro'], [74.4, 'felice'], [78.6, 'pensa'], [83.4, 'neutro'], [88.0, 'sorpreso'], [93.0, 'neutro'],
  [95.6, 'felice'], [99.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Quando fa 5\nuna somma di 3 più 4?'],
  [7.9, 11.6, 'Cammino 3 km verso est…'],
  [11.8, 16.2, '…poi 4 km verso nord.'],
  [16.4, 20.6, 'Strada percorsa:\n3 km + 4 km = 7 km.'],
  [20.8, 25.2, 'Ma lo {v:spostamento} va dritto\ndalla partenza all’arrivo…'],
  [25.4, 29.6, '…ed è lungo {g:5 km}, non 7!'],
  [29.8, 34.4, 'È il teorema di Pitagora:\n√(3² + 4²) = √25 = 5.'],
  [34.6, 39.0, 'Chiamo {mx:a} e {mx:b} i due\nspostamenti: sono vettori.'],
  [39.2, 43.8, 'Sono messi {v:punta-coda}: la coda\ndi {mx:b} sulla punta di {mx:a}.'],
  [44.0, 48.6, 'La {v:somma} va dalla coda di {mx:a}\nalla punta di {mx:b}.'],
  [48.8, 53.4, 'Oppure: le due code nello stesso\npunto, e si chiude il {v:parallelogramma}.'],
  [53.6, 57.8, 'La {v:diagonale} è la stessa\nsomma di prima.'],
  [58.0, 62.4, 'Ora giro {mx:b}: cambia l’angolo\nfra i due vettori.'],
  [62.6, 67.0, 'Stesso verso: 3 + 4 = {g:7 km},\nil massimo.'],
  [68.9, 72.9, 'Versi opposti: 4 − 3 = {g:1 km},\nil minimo.'],
  [74.4, 78.4, 'Perpendicolari: {g:5 km},\nproprio come nel cammino.'],
  [78.6, 83.2, 'Con un angolo qualsiasi,\nla somma sta fra 1 e 7 km.'],
  [83.4, 87.8, 'Il modulo della somma sta fra\ndifferenza e somma dei moduli.'],
  [88.0, 92.6, 'Pitagora vale {r:solo} se i\nvettori sono perpendicolari.'],
  [95.6, 100.6, 'I vettori si sommano punta-coda:\nconta anche l’angolo fra loro.'],
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
function voce(ctx, nome, valore, y, al = 1, x = 1300) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, nome, x, y, { size: 32, color: C.dim, align: 'left' });
  drawRich(ctx, valore, x, y + 52, { size: 44, align: 'left' });
  ctx.restore();
}
// angolo retto: il quadratino nell'angolo fra due direzioni (in pixel)
function angoloRetto(ctx, p, d1, d2, al = 1, l = 26) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(p[0] + d1[0] * l, p[1] + d1[1] * l); ctx.lineTo(p[0] + (d1[0] + d2[0]) * l, p[1] + (d1[1] + d2[1]) * l);
  ctx.lineTo(p[0] + d2[0] * l, p[1] + d2[1] * l); ctx.stroke(); ctx.restore();
}

// ---------- il piano in km: 95 px per km, coda di a in O ----------
const MAP = [372, 110, 860, 690], PAN = [1260, 110, 580, 690];
const O = [520, 690], U = 95;
const km = (x, y) => [O[0] + x * U, O[1] - y * U];
const A = km(3, 0), B = km(3, 4);
const RAD = Math.PI / 180;
// l'angolo fra a e b nella terza parte (gradi); b è sempre lungo 4 km e parte dalla punta di a
const PHI = [[58.8, 90], [61.8, 0], [67.1, 0], [68.7, 180], [73.0, 180], [74.2, 90], [78.8, 90], [79.8, 30], [81.2, 150], [82.6, 60]];
const phi = t => kf(t, PHI);
const modulo = f => Math.sqrt(25 + 24 * Math.cos(f * RAD));   // |a + b| con a = 3 e b = 4
// il cammino, accelerato a 1 km al secondo e a passo costante: 3 km verso est, poi 4 km verso nord
const cammino = t => t < 8.4 ? 0 : t < 11.4 ? t - 8.4 : t < 12.0 ? 3 : Math.min(7, 3 + (t - 12.0));
const posCammino = d => d <= 3 ? km(d, 0) : km(3, d - 3);

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, '3 + 4 = 5', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

function scenePiano(ctx, t) {
  if (t < 7.5 || t > 93.4) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 92.6, 93.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...MAP);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let i = -1; i <= 7; i++) { const x = O[0] + i * U; ctx.moveTo(x, 140); ctx.lineTo(x, 775); }
  for (let j = 0; j <= 5; j++) { const y = O[1] - j * U; ctx.moveTo(392, y); ctx.lineTo(1212, y); }
  ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(1030, 760); ctx.lineTo(1030 + U, 760); ctx.moveTo(1030, 750); ctx.lineTo(1030, 770); ctx.moveTo(1030 + U, 750); ctx.lineTo(1030 + U, 770); ctx.stroke();
  txt(ctx, '1 km', 1030 + U + 14, 760, { size: 30, color: C.dim, align: 'left' });
  const kPart = 1 - P(t, 57.8, 58.3);
  dot(ctx, O, C.ink, P(t, 8.0, 8.4, E.back), 10);
  txt(ctx, 'partenza', O[0], O[1] + 46, { size: 30, color: C.dim, alpha: P(t, 8.2, 8.7) * kPart });

  // 1 · il cammino: strada 7 km
  const kPath = 1 - P(t, 34.8, 35.5);
  if (kPath > 0 && t > 8.3) {
    const d = cammino(t);
    ctx.save(); ctx.globalAlpha *= kPath;
    ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(...O); if (d > 3) ctx.lineTo(...A); ctx.lineTo(...posCammino(d)); ctx.stroke();
    dot(ctx, posCammino(d), C.ink, 1, 11);
    txt(ctx, '3 km', km(1.5, 0)[0], O[1] + 46, { size: 30, color: C.dim, alpha: clamp((d - 1.5) / .4) });
    txt(ctx, '4 km', A[0] + 24, km(3, 2)[1], { size: 30, color: C.dim, align: 'left', alpha: clamp((d - 5) / .4) });
    txt(ctx, 'arrivo', B[0] + 30, B[1], { size: 30, color: C.dim, align: 'left', alpha: P(t, 16.0, 16.4) });
    ctx.restore();
  }
  // lo spostamento, con le tacche di un km
  const ks = P(t, 21.2, 22.0);
  const kt = life(t, 25.6, 34.6, .4, .4);
  if (kt > 0) {
    ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    for (let k = 1; k <= 4; k++) { const p = km(.6 * k, .8 * k); ctx.beginPath(); ctx.moveTo(p[0] - 12 * .8, p[1] - 12 * .6); ctx.lineTo(p[0] + 12 * .8, p[1] + 12 * .6); ctx.stroke(); }
    const m = km(1.5, 2);
    drawRich(ctx, '{v:5 km}', m[0] - .8 * 70, m[1] - .6 * 70, { size: 40 });
    ctx.restore();
  }
  angoloRetto(ctx, A, [-1, 0], [0, -1], life(t, 29.9, 58.0, .4, .3));

  // 2–3 · i vettori a e b, e la loro somma
  const kv = P(t, 34.8, 35.6);
  if (kv > 0 || ks > 0) {
    const bt = P(t, 49.0, 50.0) * (1 - P(t, 58.0, 58.6));     // b che scivola con la coda in O e poi torna
    const f = phi(t), c = Math.cos(f * RAD), s = Math.sin(f * RAD);
    const offS = -20 * clamp((30 - f) / 20) + 20 * clamp((f - 150) / 20), offB = -20 * clamp((f - 150) / 20);
    const base = [lerp(A[0], O[0], bt), A[1] + offB];
    const punta = [base[0] + 4 * U * c, base[1] - 4 * U * s];
    const Bf = km(3 + 4 * c, 4 * s);
    // l'angolo fra a e b: il prolungamento di a e l'arco
    const ka = life(t, 58.6, 92.8, .4, .4);
    if (ka > 0) {
      dashed(ctx, A, km(4.5, 0), C.dim, 1, ka);
      ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(A[0], A[1], 52, -f * RAD, 0); ctx.stroke(); ctx.restore();
      angoloRetto(ctx, A, [1, 0], [0, -1], ka * clamp(1 - Math.abs(f - 90) / 3) * P(t, 74.4, 74.8));
    }
    // il parallelogramma: le copie tratteggiate chiudono la figura
    const kp = life(t, 50.2, 58.0, .4, .3);
    if (kp > 0) {
      dashed(ctx, km(0, 4), B, C.x, P(t, 50.2, 50.9), kp);
      dashed(ctx, A, B, C.x, P(t, 50.4, 51.1), kp);
    }
    // la somma: più spessa mentre si parla della diagonale
    const w = 8 + 4 * life(t, 53.7, 57.8, .3, .3);
    const kl = P(t, 21.2, 22.0), kSom = t < 58.3 ? 1 - P(t, 57.9, 58.2) : P(t, 58.6, 59.0);
    freccia(ctx, [O[0], O[1] + offS], [lerp(O[0], Bf[0], kl), lerp(O[1], Bf[1], kl) + offS], C.v, kSom * kl, w);
    freccia(ctx, O, A, C.x, kv, 8);
    freccia(ctx, base, punta, C.x, kv, 8);
    // il giunto punta-coda
    const kg = life(t, 39.3, 43.8, .3, .3);
    if (kg > 0) {
      ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(A[0], A[1], 30 * P(t, 39.3, 39.8, E.back), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{dim:punta di }{mx:a}{dim: = coda di }{mx:b}', A[0] + 44, A[1] - 44, { size: 32, align: 'left', alpha: kg });
    }
    // i nomi: a sotto, b dalla parte lontana da O, la somma dalla parte lontana dal triangolo
    ctx.save(); ctx.globalAlpha *= kv;
    drawRich(ctx, '{mx:a}', km(1.5, 0)[0], O[1] + 58, { size: 44 });
    const mb = [(base[0] + punta[0]) / 2, (base[1] + punta[1]) / 2], lato = lerp(1, -1, bt);
    drawRich(ctx, '{mx:b}', mb[0] + lato * 46 * s, mb[1] + 46 * c, { size: 44 });
    const ms = [(O[0] + Bf[0]) / 2, (O[1] + Bf[1]) / 2 + offS], L = Math.hypot(3 + 4 * c, 4 * s) || 1;
    const sx = (3 + 4 * c) / L, sy = 4 * s / L;
    drawRich(ctx, '{mv:a + b}', ms[0] + .8 * 80, ms[1] + .6 * 80, { size: 44, alpha: P(t, 44.1, 44.6) * (1 - P(t, 58.0, 58.3)) });
    drawRich(ctx, '{mv:a + b}', ms[0] - sy * 66, ms[1] - sx * 66, { size: 44, alpha: P(t, 58.4, 58.8) });
    ctx.restore();
  }
  ctx.restore();
}

// il pannello a destra
function scenePannello(ctx, t) {
  if (t < 8 || t > 93.4) return;
  const al = P(t, 8.0, 8.6) * (1 - P(t, 92.6, 93.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...PAN);
  const cx = PAN[0] + PAN[2] / 2, tit = s => conFont(TITOLI, () => drawRich(ctx, s, cx, 175, { size: 40, weight: 600 }));
  // 1 · il cammino
  const a1 = 1 - P(t, 34.4, 34.9);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    tit('il cammino');
    txt(ctx, 'strada percorsa', 1300, 260, { size: 32, color: C.dim, align: 'left' });
    const ke = P(t, 16.5, 17.0);
    ctx.save(); ctx.globalAlpha *= 1 - ke;
    fixedNum(ctx, fmtN(cammino(t), 1), 1368, 312, 44, C.ink); txt(ctx, 'km', 1382, 312, { size: 40, align: 'left' });
    ctx.restore();
    drawRich(ctx, '3 km + 4 km = 7 km', 1300, 312, { size: 44, align: 'left', alpha: ke });
    voce(ctx, 'spostamento', '{v:5 km}', 410, P(t, 25.6, 26.1));
    txt(ctx, 'teorema di Pitagora', 1300, 560, { size: 32, color: C.dim, align: 'left', alpha: P(t, 29.9, 30.4) });
    drawRich(ctx, '{mink:√(3² + 4²) = √25 = 5}', 1300, 625, { size: 44, align: 'left', local: t - 30.1 });
    ctx.restore();
  }
  // 2 · la regola
  const a2 = life(t, 34.6, 58.0, .4, .4);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    tit('la somma');
    drawRich(ctx, '{v:punta-coda}', 1300, 270, { size: 44, align: 'left', alpha: P(t, 39.3, 39.8) });
    drawRich(ctx, 'la coda di {mx:b} sulla punta di {mx:a};\nla somma va dalla coda di {mx:a}\nalla punta di {mx:b}', 1300, 375, { size: 32, align: 'left', alpha: P(t, 39.5, 40.0) * 1, lh: 1.35 });
    drawRich(ctx, '{v:parallelogramma}', 1300, 530, { size: 44, align: 'left', alpha: P(t, 48.9, 49.4) });
    drawRich(ctx, 'le code nello stesso punto;\nla somma è la {v:diagonale}', 1300, 610, { size: 32, align: 'left', alpha: P(t, 49.1, 49.6), lh: 1.35 });
    ctx.restore();
  }
  // 3 · l'angolo
  const a3 = life(t, 58.0, 92.8, .4, .4);
  if (a3 > 0) {
    ctx.save(); ctx.globalAlpha *= a3;
    tit('l’angolo');
    const f = phi(t), m = modulo(f);
    drawRich(ctx, '{dim:angolo fra }{mx:a}{dim: e }{mx:b}', 1300, 250, { size: 32, align: 'left' });
    txt(ctx, Math.round(f) + '°', 1300, 302, { size: 44, align: 'left' });
    txt(ctx, 'modulo della somma', 1300, 380, { size: 32, color: C.dim, align: 'left' });
    fixedNum(ctx, fmtN(m, 1), 1368, 432, 44, C.v); txt(ctx, 'km', 1382, 432, { size: 40, color: C.v, align: 'left' });
    // la sbarra da 0 a 8 km: la somma resta fra 1 e 7
    const X0 = 1320, PX = 57, YB = 545;
    const kz = P(t, 78.8, 79.3);
    ctx.fillStyle = css(C.g, .16 * kz); ctx.fillRect(X0 + PX, YB - 18, 6 * PX, 36);
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, YB); ctx.lineTo(X0 + 8 * PX, YB); ctx.stroke();
    for (let k = 0; k <= 8; k++) {
      ctx.beginPath(); ctx.moveTo(X0 + k * PX, YB - 10); ctx.lineTo(X0 + k * PX, YB + 10); ctx.stroke();
      const forte = (k === 1 || k === 7) && kz > 0;
      txt(ctx, String(k), X0 + k * PX, YB + 38, { size: 30, color: forte ? C.g : C.dim, weight: forte ? 600 : 500 });
    }
    dot(ctx, [X0 + m * PX, YB], C.v, 1, 12);
    drawRich(ctx, '{dim:fra} 4 − 3 {dim:e} 4 + 3', 1300, 660, { size: 40, align: 'left', alpha: P(t, 83.6, 84.1) });
    const kp = P(t, 88.2, 88.7);
    if (kp > 0) {
      drawRich(ctx, '{dim:qui} {mr:√(3² + 4²) = 5}', 1300, 745, { size: 36, align: 'left', alpha: kp });
      crossMark(ctx, 1770, 745, P(t, 88.6, 89.4), C.r, .3);
    }
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (93–103,2)
function sceneFine(ctx, t) {
  if (t < 93.1) return;
  const al = 1 - P(t, 101.0, 102.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 93.3 });
    drawRich(ctx, 'I vettori si sommano {v:punta-coda}:\nil risultato dipende dall’angolo.', W / 2, 290, { size: 70, weight: 600, local: t - 93.7, stagger: .09 });
  });
  const pills = [[490, '{v:punta-coda}\no parallelogramma'], [960, 'il modulo sta fra\ndifferenza e somma'], [1430, 'Pitagora solo se\n{g:perpendicolari}']];
  pills.forEach(([x, s], i) => {
    const a = 95.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nel cammino il tono segue la strada percorsa, da 0 (0) a 7 km (1);
  // quando b gira segue il modulo della somma, da 0 (0) a 8 km (1), come la sbarra del pannello
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.1, .3],                                                // la partenza
    ['tono', 8.4, 11.4, [0, .43]], ['tono', 12.0, 16.0, [.43, 1]],                     // 3 km verso est, 4 km verso nord
    ['pop', 16.5, .6],                                                                // strada: 7 km
    ['traccia', 21.2, 22.0], ['ding', 25.8],                                          // lo spostamento: 5 km
    ['pop', 30.0, .5],                                                                // Pitagora
    ['soffio', 34.8], ['pop', 35.2, .5],                                              // i vettori a e b
    ['pop', 39.4, .6], ['pop', 44.2, .55],                                            // punta-coda; la somma
    ['traccia', 49.0, 50.0], ['traccia', 50.2, 51.1], ['pop', 53.8, .5],              // il parallelogramma, la diagonale
    ['traccia', 58.6, 59.0], ['tono', 58.8, 61.8, [.63, .64, .73, .86, .87, .88]], ['pop', 61.9, .88],   // stesso verso: 7 km
    ['tono', 67.1, 68.7, [.88, .87, .81, .36, .13, .13]], ['pop', 68.8, .13],         // versi opposti: 1 km
    ['tono', 73.0, 74.2, [.13, .13, .35, .59, .63]], ['pop', 74.3, .63],              // perpendicolari: 5 km
    ['tono', 78.8, 82.6, [.63, .67, .83, .85, .82, .59, .3, .26, .3, .55, .74, .76]],   // un angolo qualsiasi: fra 1 e 7
    ['pop', 83.7, .5], ['pop', 88.3, .5], ['traccia', 88.6, 89.4],                    // fra 4 − 3 e 4 + 3; Pitagora no
    ['soffio', 93.3], ['pop', 95.2, .5], ['pop', 95.7, .6], ['pop', 96.2, .7],        // in una frase
  ];
  return {
    titolo: '3 + 4 = 5', durata: 103.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.4, 'il cammino'], [34.4, 57.9, 'punta-coda e parallelogramma'], [57.9, 92.8, 'conta l’angolo']],
    scena(ctx, t) { sceneIntro(ctx, t); scenePiano(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
