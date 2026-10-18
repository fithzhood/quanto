'use strict';
/* La giostra che accelera — moto circolare non uniforme: seggiolino a r = 4 m, parte da fermo con accelerazione
   tangenziale costante 1 m/s² (v = t); la centripeta v²/r cresce: 0,25 m/s² a 1 s, 1 m/s² a 2 s (uguale alla
   tangenziale, totale ≈ 1,41 m/s² a 45°), 4 m/s² a 4 s (totale ≈ 4,12 m/s², quasi verso il centro). Poi velocità
   costante 4 m/s: resta solo la centripeta. Moto al rallentatore (2 s di video per 1 s). Argomento: moti-piano. */
CVIDEO.registra('moti-piano/giostra', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fixedNum, fmtN, card, arrowHead, dashed, ball, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [86.6, 190], [87.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [86.6, 1050], [87.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [86.6, 2.2], [87.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [86.6, 2], [87.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [86.6, -1.5], [87.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.7, 'pensa'], [26.1, 'neutro'],
  [35.9, 'felice'], [40.7, 'sorpreso'], [45.1, 'neutro'], [54.1, 'felice'], [58.5, 'neutro'], [63.1, 'sorpreso'],
  [67.9, 'neutro'], [77.1, 'felice'], [81.7, 'neutro'], [88.6, 'felice'], [93.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Una giostra parte da ferma:\ndove punta l’accelerazione?'],
  [7.9, 12.3, 'Un seggiolino a {mink:r} = 4 m\ndal centro, ancora fermo.'],
  [12.4, 16.8, 'Parte: la velocità cresce\ndi 1 m/s ogni secondo.'],
  [16.9, 21.6, 'È l’accelerazione {v:tangenziale}:\n1 m/s², lungo la velocità.'],
  [21.7, 26.0, 'Ma il seggiolino gira: la velocità\ncambia anche direzione.'],
  [26.1, 31.2, 'Allora c’è anche la {v:centripeta},\nverso il centro: {mx:v}{mink:²/r}.'],
  [31.3, 35.8, 'A 1 m/s vale 1²/4 = 0,25 m/s²:\nancora piccola.'],
  [35.9, 40.6, 'Le due si sommano come vettori:\nè l’accelerazione {v:totale}.'],
  [40.7, 44.9, 'Punta {g:in avanti},\nnon verso il centro.'],
  [45.1, 49.4, 'Ancora 1 s:\nora va a 2 m/s.'],
  [49.5, 54.0, 'Centripeta 2²/4 = 1 m/s²:\ncome la tangenziale.'],
  [54.1, 58.4, 'La totale è inclinata di 45°,\ncirca 1,41 m/s².'],
  [58.5, 63.0, 'Altri 2 s:\nora va a 4 m/s.'],
  [63.1, 67.8, 'Velocità doppia, centripeta\n{g:quattro volte}: 4 m/s².'],
  [67.9, 72.4, 'Ora la totale punta\n{g:quasi} verso il centro.'],
  [72.6, 77.0, 'La giostra smette di accelerare:\nva sempre a 4 m/s.'],
  [77.1, 81.6, 'Niente più tangenziale:\nresta solo la centripeta.'],
  [81.7, 86.4, 'È il moto circolare {g:uniforme}:\naccelerazione verso il centro.'],
  [88.6, 93.6, 'Se cambia anche il modulo della velocità,\nalla centripeta si somma la tangenziale.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.3, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
// testo con pedici a lettere: «{mv:a}⌊{mv:t}⌋» scrive a con la t piccola in basso
function pedici(ctx, s, x, y, o = {}) {
  const size = o.size || 40, al = o.alpha != null ? o.alpha : 1, align = o.align || 'left', ps = Math.max(30, Math.round(size * .72));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 13, 8, 26); ctx.fillRect(x + 14, y - 13, 8, 26); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 13); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il moto vero (metri, secondi) ----------
const R = 4, AT = 1, TACC = 4, LENTO = 2;                 // raggio, accelerazione tangenziale, fine dell'accelerazione (s)
// il tempo vero τ in funzione del tempo del video: tratti al rallentatore e fermi immagine
const TRATTI = [[12.8, 0], [14.8, 1], [45.4, 1], [47.4, 2], [58.8, 2], [62.8, 4], [73.0, 4]];
function tau(t) {
  if (t >= 73.0) return 4 + (t - 73.0) / LENTO;            // da qui velocità costante
  if (t <= TRATTI[0][0]) return 0;
  for (let i = 1; i < TRATTI.length; i++) {
    const [ta, va] = TRATTI[i - 1], [tb, vb] = TRATTI[i];
    if (t <= tb) return va + (vb - va) * (t - ta) / (tb - ta);
  }
  return 4;
}
const vel = u => u < TACC ? AT * u : AT * TACC;                       // v = a·t, poi costante
const strada = u => u < TACC ? AT * u * u / 2 : AT * TACC * TACC / 2 + AT * TACC * (u - TACC);
const tang = (u, t) => (t < 73.0 ? AT : 0);                          // a 73 s smette di accelerare
const TH0 = -Math.PI / 2 - .125;                                      // così a τ = 1 il seggiolino è in basso
const angolo = u => TH0 + strada(u) / R;
const moving = t => (t > 12.8 && t < 14.8) || (t > 45.4 && t < 47.4) || (t > 58.8 && t < 62.8) || t > 73.0;

// ---------- la giostra vista dall'alto (scheda di sinistra): 60 px per metro ----------
const O = [742, 454], KR = 60, VS = 60, AS = 48;          // centro; px per metro, per m/s, per m/s²
const sul = th => [O[0] + R * KR * Math.cos(th), O[1] - R * KR * Math.sin(th)];
const tg = th => [-Math.sin(th), -Math.cos(th)];           // tangente, nel verso di marcia (antiorario)
const dentro = th => [-Math.cos(th), Math.sin(th)];        // verso il centro
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La giostra che accelera', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// la telecamera: finché le accelerazioni sono piccole la vista si ingrandisce 2,4 volte attorno al seggiolino
// (tutte le frecce insieme: le proporzioni restano vere)
const CX = 742, CY = 454;
function camera(t) {
  const z = kf(t, [[16.9, 1], [18.3, 2.4], [58.5, 2.4], [59.7, 1]]);
  return { z, f: [kf(t, [[16.9, O[0]], [18.3, 810], [58.5, 810], [59.7, O[0]]]), kf(t, [[16.9, O[1]], [18.3, 640], [58.5, 640], [59.7, O[1]]])] };
}
const scr = (cam, q) => [CX + cam.z * (q[0] - cam.f[0]), CY + cam.z * (q[1] - cam.f[1])];
function sceneGiostra(ctx, t) {
  if (t < 7.5 || t > 87.0) return;
  const al = life(t, 7.5, 86.9, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const u = tau(t), th = angolo(u), v = vel(u), at = tang(u, t), ac = v * v / R, cam = camera(t), z = cam.z;
  ctx.save(); ctx.beginPath(); ctx.roundRect(373, 109, 738, 690, 22); ctx.clip();
  // la pedana con i raggi, che gira insieme al seggiolino
  ctx.save(); ctx.translate(CX, CY); ctx.scale(z, z); ctx.translate(-cam.f[0], -cam.f[1]);
  ctx.fillStyle = css(mix(C.y, C.paper, .88)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3 / z;
  ctx.beginPath(); ctx.arc(O[0], O[1], 272, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .45); ctx.lineWidth = 2 / z;
  for (let i = 0; i < 8; i++) { const a = th + i * Math.PI / 4, q = [O[0] + 268 * Math.cos(a), O[1] - 268 * Math.sin(a)]; ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 2 / z; ctx.setLineDash([8 / z, 8 / z]); ctx.beginPath(); ctx.arc(O[0], O[1], R * KR, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.beginPath(); ctx.arc(O[0], O[1], 26, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  dot(ctx, scr(cam, O), C.ink, 1, 6);
  // il raggio
  const kr = life(t, 8.1, 16.6, .4, .4);
  if (kr > 0) {
    const q = scr(cam, sul(th)), o = scr(cam, O);
    dashed(ctx, o, q, C.ink, 1, kr);
    drawRich(ctx, '{mink:r} = 4 m', (o[0] + q[0]) / 2 + 22, (o[1] + q[1]) / 2, { size: 34, align: 'left', alpha: kr });
  }
  // le frecce (calcolate sulla pedana, poi inquadrate): velocità azzurra, tangenziale e centripeta viola, totale più spessa
  const pw = sul(th), T = tg(th), D = dentro(th), p = scr(cam, pw);
  const kv = clamp(v / .3) * (t > 12.6 ? 1 : 0) * (1 - P(t, 77.0, 77.6));   // a velocità costante si guardano le accelerazioni
  const kT = life(t, 17.1, 200, .4, .1) * (1 - P(t, 73.0, 73.6)), kC = P(t, 26.3, 26.8), kS = P(t, 36.1, 36.6) * (1 - P(t, 73.0, 73.6));
  const tipV = add(p, T, v * VS * z), tipT = add(p, T, at * AS * z), tipC = add(p, D, ac * AS * z), tipS = add(tipT, D, ac * AS * z);
  // più avanti sul cerchio la velocità punterà altrove: due frecce in trasparenza
  const kd = life(t, 21.9, 26.0, .4, .4);
  if (kd > 0) [.35, .7].forEach(da => {
    const q = scr(cam, sul(th + da)), Tq = tg(th + da);
    freccia(ctx, q, add(q, Tq, v * VS * z), C.x, .35 * kd, 5);
    dot(ctx, q, C.y, .7 * kd, 9);
  });
  if (kS > 0) { dashed(ctx, tipT, tipS, C.v, 1, .7 * kS); dashed(ctx, tipC, tipS, C.v, 1, .7 * kS); }
  ball(ctx, p[0], p[1], '', C.y, { r: z > 1.5 ? 12 : 17 });   // la pallina sotto le frecce: la centripeta piccola resta visibile
  freccia(ctx, p, tipT, C.v, kT * (1 - .45 * kS), 10);
  freccia(ctx, p, tipV, C.x, kv, 5);
  freccia(ctx, p, tipC, C.v, kC * (1 - .45 * kS), 7);
  freccia(ctx, p, tipS, C.v, kS, 8);
  // le etichette
  drawRich(ctx, '{mx:v}', ...add(tipV, T, 26), { size: 36, alpha: kv * (1 - P(t, 73.2, 73.6)) });
  pedici(ctx, '{mv:a}⌊{mv:t}⌋', ...add(add(p, T, at * AS * z / 2), D, -36), { size: 36, align: 'center', alpha: kT });
  const lc = add(add(p, D, Math.max(ac * AS * z / 2, 22)), T, -42);
  pedici(ctx, '{mv:a}⌊{mv:c}⌋', lc[0], lc[1], { size: 36, align: 'center', alpha: kC });
  const ds = [tipS[0] - p[0], tipS[1] - p[1]], ls = Math.hypot(ds[0], ds[1]) || 1;
  drawRich(ctx, '{mv:a}', ...add(tipS, [ds[0] / ls, ds[1] / ls], 28), { size: 38, alpha: kS });
  // l'angolo fra la totale e la tangente, a 45°
  const k45 = life(t, 54.3, 58.4, .4, .4);
  if (k45 > 0) {
    const a0 = Math.atan2(T[1], T[0]), a1 = Math.atan2(ds[1], ds[0]);
    ctx.save(); ctx.globalAlpha *= k45; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p[0], p[1], 70, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke();
    const am = (a0 + a1) / 2;
    txt(ctx, '45°', p[0] + 108 * Math.cos(am), p[1] + 108 * Math.sin(am), { size: 30, weight: 600, color: C.g });
    ctx.restore();
  }
  ctx.restore();
  const kz = clamp((z - 1.05) / .5);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz; ctx.fillStyle = css(C.paper, .92);
    ctx.beginPath(); ctx.roundRect(838, 124, 260, 44, 10); ctx.fill(); ctx.restore();
    txt(ctx, 'vista ingrandita', 1084, 146, { size: 30, color: C.dim, align: 'right', alpha: kz });
  }
  const st = t > 12.6 ? (moving(t) ? 'al rallentatore' : 'fermo immagine') : '';
  chip(ctx, 404, 765, st ? 1 : 0, st || 'al rallentatore');
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1490;
function riga(ctx, nome, y, al) { if (al > 0) pedici(ctx, nome, 1180, y, { size: 32, alpha: al }); }
function valore(ctx, num, unita, y, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  fixedNum(ctx, num, 1700, y, 42, col); txt(ctx, unita, 1710, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
function scenePannello(ctx, t) {
  if (t < 8.0 || t > 87.0) return;
  const al = life(t, 8.1, 86.9, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'il seggiolino', PCX, 165, { size: 38, weight: 600 }));
  const u = tau(t), v = vel(u), at = tang(u, t), ac = v * v / R;
  const vq = Math.round(v * 100) / 100, acq = Math.round(vq * vq / R * 100) / 100;   // i numeri mostrati vengono dalla v mostrata
  riga(ctx, '{dim:raggio} {mink:r}', 235, P(t, 8.2, 8.7)); valore(ctx, '4', 'm', 235, C.ink, P(t, 8.2, 8.7));
  riga(ctx, '{dim:tempo} {mink:t}', 295, P(t, 12.5, 13.0)); valore(ctx, fmtN(u, 2), 's', 295, C.ink, P(t, 12.5, 13.0));
  riga(ctx, '{dim:velocità} {mx:v}', 355, P(t, 12.5, 13.0)); valore(ctx, fmtN(vq, 2), 'm/s', 355, C.x, P(t, 12.5, 13.0));
  ctx.save(); ctx.globalAlpha *= P(t, 17.0, 17.4);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 400); ctx.lineTo(1800, 400); ctx.stroke();
  ctx.restore();
  riga(ctx, '{dim:tangenziale} {mv:a}⌊{mv:t}⌋', 455, P(t, 17.1, 17.6)); valore(ctx, fmtN(at, 2), 'm/s²', 455, C.v, P(t, 17.1, 17.6));
  riga(ctx, '{dim:centripeta} {mv:a}⌊{mv:c}⌋{mink: = }{mx:v}{mink:²/r}', 520, P(t, 26.3, 26.8)); valore(ctx, fmtN(acq, 2), 'm/s²', 520, C.v, P(t, 26.3, 26.8));
  riga(ctx, '{dim:totale} {mv:a}', 585, P(t, 36.1, 36.6)); valore(ctx, fmtN(Math.hypot(at, acq), 2), 'm/s²', 585, C.v, P(t, 36.1, 36.6));
  // la frase in fondo cambia con quello che si vede
  const note = [[40.9, 45.0, 'la totale punta {g:in avanti}'], [54.3, 58.4, 'centripeta = tangenziale: {g:45°}'],
    [63.3, 72.4, 'centripeta {g:quattro volte} più grande'], [77.3, 86.4, 'velocità costante: {g:solo la centripeta}']];
  note.forEach(([a, b, s]) => drawRich(ctx, s, PCX, 690, { size: 34, alpha: life(t, a, b, .4, .4) }));
  ctx.restore();
}

// ---------- in una frase (86,6–96) ----------
function sceneFine(ctx, t) {
  if (t < 86.5) return;
  const al = 1 - P(t, 94.0, 95.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 86.8 });
    drawRich(ctx, 'Nel moto circolare che accelera, l’accelerazione\nha una parte tangenziale e una centripeta.', W / 2, 290, { size: 58, weight: 600, local: t - 87.2, stagger: .08 });
  });
  const pills = [[490, 'tangenziale:\ncambia il {x:modulo} di {mx:v}'], [960, 'centripeta {mx:v}{mink:²/r}:\ncambia la {x:direzione}'], [1430, 'la totale è la\n{v:somma dei due vettori}']];
  pills.forEach(([x, s], i) => {
    const a = 89.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // fermi immagine aggiunti per dare tempo alla voce sui numeri lunghi: [istante del copione, secondi di fermo].
  // Il copione (tutti i tempi qui sopra) resta in «tempo di disegno»; il video vero lo allunga di questi fermi.
  const PAUSE = [[21.0, .3], [35.0, 3.4], [53.0, 1.4], [57.5, 2.2]];
  const reale = td => { let r = td; for (const [x, d] of PAUSE) if (td > x) r += d; return Math.round(r * 100) / 100; };
  const disegno = t => { let s = 0; for (const [x, d] of PAUSE) { if (t < x + s) return t - s; if (t < x + s + d) return x; s += d; } return t - s; };
  const conv = keys => keys.map(([a, v]) => [reale(a), v]);
  // gli effetti sono nel tempo vero del video (già spostati dei fermi qui sopra); i toni del moto seguono la velocità
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.1, 8.5], ['pop', 8.2, .5],                         // la giostra, r = 4 m
    ['pop', 12.5, .45],                                                               // tempo e velocità
    ['tono', 12.8, 14.8, [0, .12, .25]],                                              // parte: da 0 a 1 m/s
    ['pop', 17.1, .5],                                                                // la tangenziale
    ['pop', 22.2, .45],                                                               // la velocità cambia direzione
    ['pop', 26.6, .55],                                                               // la centripeta
    ['pop', 39.8, .6], ['ding', 44.6],                                                // la totale: punta in avanti
    ['tono', 49.1, 51.1, [.25, .37, .5]],                                             // da 1 a 2 m/s
    ['traccia', 59.4, 59.8], ['ding', 59.4],                                          // 45 gradi
    ['soffio', 65.8],                                                                 // la vista torna intera
    ['tono', 66.1, 70.1, [.5, .62, .75, .87, 1]],                                     // da 2 a 4 m/s
    ['ding', 70.6],                                                                   // centripeta quattro volte
    ['pop', 80.3, .35], ['tono', 80.3, 82.3, [.65, .76, .86, .93, .98]],               // smette di accelerare: gira e sale
    ['ding', 84.6],                                                                   // solo la centripeta
    ['soffio', 94.1], ['pop', 96.3, .5], ['pop', 96.8, .6], ['pop', 97.3, .7],        // in una frase
  ];
  return {
    titolo: 'La giostra che accelera', durata: reale(96), copertina: 4.2, suoni: SUONI,
    stilla: {
      posa: { x: conv(POSA.x), y: conv(POSA.y), s: conv(POSA.s), lx: conv(POSA.lx), ly: conv(POSA.ly) },
      facce: conv(FACCIA), fumetti: FUMETTI.map(([a, b, s]) => [reale(a), reale(b), s]),
    },
    capitoli: [[7.5, 44.9, 'due accelerazioni'], [44.9, 72.4, 'la centripeta cresce'], [72.4, 86.4, 'velocità costante']].map(([a, b, n]) => [reale(a), reale(b), n]),
    scena(ctx, t) { const td = disegno(t); sceneIntro(ctx, td); sceneGiostra(ctx, td); scenePannello(ctx, td); sceneFine(ctx, td); },
  };
});
