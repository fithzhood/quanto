'use strict';
/* Perché la cassa non parte — l'attrito statico si adatta alla spinta fino a μs·N; poi l'attrito dinamico μd·N, più piccolo. Argomento: forze. */
CVIDEO.registra('forze/attrito', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [77.1, 190], [78.4, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [77.1, 1050], [78.4, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [77.1, 2.2], [78.4, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [77.1, 2], [78.4, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [77.1, -1.5], [78.4, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.6, 'sorpreso'], [25.7, 'neutro'],
  [34.8, 'felice'], [39.1, 'pensa'], [43.7, 'neutro'], [53.4, 'sorpreso'], [58.3, 'neutro'], [63.2, 'felice'],
  [67.8, 'neutro'], [72.4, 'pensa'], [79.4, 'felice'], [82.9, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Spingo una cassa pesante:\nperché non si muove?'],
  [7.9, 11.6, 'Una cassa di 50 kg\nsul pavimento.'],
  [11.7, 16.3, 'Il suo peso {my:P}, 490 N,\nla preme sul pavimento…'],
  [16.4, 21.4, '…e il pavimento risponde con la forza\n{y:normale} {my:N}: anche lei 490 N.'],
  [21.6, 25.6, 'Spingo con 100 N:\nla cassa {r:non si muove}.'],
  [25.7, 30.3, 'Il pavimento la trattiene: è l’{y:attrito}\n{y:statico}, 100 N all’indietro.'],
  [30.4, 34.7, 'Spingo con 200 N: l’attrito\nsale a 200 N. Ancora ferma.'],
  [34.8, 39.0, 'L’attrito statico si {g:adatta}:\nuguale e opposto alla spinta.'],
  [39.1, 43.6, 'Ma non può crescere per sempre:\nha un {v:valore massimo}.'],
  [43.7, 48.4, 'Vale {mink:μ·}{my:N}: {mink:μ} è il {v:coefficiente}\n{v:di attrito statico}, qui 0,5.'],
  [48.5, 53.3, '0,5 · 490 N = {y:245 N}:\nfin lì la cassa resta ferma.'],
  [53.4, 58.2, 'Spingo con 250 N: supero il massimo\ne la cassa {g:parte}, al rallentatore.'],
  [58.3, 63.1, 'Si muove: ora c’è l’{y:attrito dinamico},\n0,3 · 490 N = {y:147 N}.'],
  [63.2, 67.7, 'Per farla scivolare a velocità costante\nbastano {g:147 N}: {g:meno} di 245.'],
  [67.8, 72.3, '{mink:μ} dinamico 0,3, {mink:μ} statico 0,5:\nper partire serve {g:più forza}.'],
  [72.4, 76.9, 'L’attrito dinamico quasi non dipende\ndalla velocità né dall’area di contatto.'],
  [79.4, 84.2, 'Per far partire una cassa serve\npiù forza che per tenerla in moto.'],
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
// testo ricco con pedici a lettere: «{mink:μ}⌊s⌋» scrive μ con la s piccola in basso
function conPedici(ctx, s, x, y, o = {}) {
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .75));   // pedice in tondo, almeno 30 px
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
const MASSA = 50, NN = 490, MUS = .5, MUD = .3, FS = MUS * NN, FD = MUD * NN;   // 245 N e 147 N
// il tempo fisico: dal via (53,6) a 58,6 il video va al rallentatore, 10 volte più lento
const TV = 53.6, LENTO = 3;   // dal via in poi, tutto al rallentatore: 3 s di video per 1 s vero
const tau = t => t < TV ? t : TV + (t - TV) / LENTO;
// la spinta, in funzione del tempo fisico
const SPINTA = [[21.8, 0], [22.6, 100], [30.6, 100], [31.6, 200], [48.7, 200], [49.9, 245], [53.6, 245], [53.62, 250], [55.17, 250], [55.40, 147]];   // 250 N fino a 58,3 s di video, poi 147 N
const spinta = s => kf(s, SPINTA);
// la cassa: ferma finché la spinta non supera 245 N; poi a = (F − 147 N)/m. Integrata dal via, sempre uguale per lo stesso t
function moto(t) {
  const s = tau(t);
  if (s <= TV) return { x: 0, v: 0, F: spinta(s), f: Math.min(spinta(s), FS), va: false };
  let x = 0, v = 0; const dt = 1 / 240;
  for (let u = TV; u < s; u += dt) { const h = Math.min(dt, s - u), a = (spinta(u) - FD) / MASSA; v = Math.max(0, v + a * h); x += v * h; }
  return { x, v, F: spinta(s), f: FD, va: true };
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché la cassa non parte', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · la cassa sul pavimento (7,5–76,6)
const SC = [110, 110, 1050, 680], FY = 600, XB0 = 380, BW = 180, BH = 150, PXM = 180, FSC = .5, CORSA = 260;   // 180 px per metro (la cassa è larga 1 m), 0,5 px per newton; dopo 260 px scorre il pavimento
function cassa(ctx, xb, al) {
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.y, C.paper, .66)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.rect(xb, FY - BH, BW, BH); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.rect(xb + 12, FY - BH + 12, BW - 24, BH - 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xb + 12, FY - BH + 12); ctx.lineTo(xb + BW - 12, FY - 12); ctx.stroke();
  ctx.fillStyle = css(C.paper); ctx.beginPath(); ctx.roundRect(xb + BW / 2 - 52, FY - BH / 2 - 22, 104, 44, 8); ctx.fill();
  txt(ctx, '50 kg', xb + BW / 2, FY - BH / 2, { size: 32, weight: 600 });
  ctx.restore();
}
function sceneCassa(ctx, t) {
  if (t < 7.5 || t > 77.5) return;
  const al = life(t, 7.6, 77.3, .6, .5);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il pavimento
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(135, FY); ctx.lineTo(1135, FY); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.beginPath();
  const m = moto(t), scorre = Math.max(0, m.x * PXM - CORSA), off = scorre % 30;
  for (let x = 140 - off; x < 1130; x += 30) if (x > 150) { ctx.moveTo(x, FY + 4); ctx.lineTo(x - 16, FY + 22); }
  ctx.stroke();
  const xb = XB0 + Math.min(m.x * PXM, CORSA), xc = xb + BW / 2, yc = FY - BH / 2;
  cassa(ctx, xb, P(t, 8.0, 8.6));
  // peso e reazione normale, uguali (0,5 px per newton)
  const kP = life(t, 11.9, 21.8, .5, .4), kN = life(t, 16.6, 21.8, .5, .4);
  freccia(ctx, [xc - 64, yc], [xc - 64, yc + NN * FSC], C.y, kP);
  drawRich(ctx, '{my:P} = 490 N', xc - 40, yc + 200, { size: 34, align: 'left', alpha: kP });
  freccia(ctx, [xc + 64, FY], [xc + 64, FY - NN * FSC], C.y, kN);
  drawRich(ctx, '{my:N} = 490 N', xc + 86, FY - 220, { size: 34, align: 'left', alpha: kN });
  // la spinta, da sinistra, e l'attrito, sul pavimento verso sinistra
  const ks = P(t, 21.6, 21.9);
  if (ks > 0 && m.F > .5) {
    ctx.save(); ctx.globalAlpha *= ks;
    freccia(ctx, [xb - 4 - m.F * FSC, yc], [xb - 4, yc], C.y);
    drawRich(ctx, '{y:spinta} ' + Math.round(m.F) + ' N', xb - 12, yc - 44, { size: 34, align: 'right' });
    freccia(ctx, [xc, FY + 14], [xc - m.f * FSC, FY + 14], C.y);
    drawRich(ctx, '{y:attrito} ' + Math.round(m.f) + ' N', xc - m.f * FSC / 2, FY + 56, { size: 34, alpha: P(t, 25.9, 26.4) });
    ctx.restore();
  }
  // la velocità, quando parte
  if (m.v > .01) {
    const L = m.v * 45;   // 45 px per m/s
    freccia(ctx, [xc, FY - BH - 26], [xc + L, FY - BH - 26], C.x, clamp(m.v / .3));
    drawRich(ctx, '{x:velocità}', xc + Math.max(L, 120) / 2, FY - BH - 64, { size: 30, alpha: clamp(m.v / .3) });
  }
  // il rallentatore
  const kr = life(t, 53.6, 77.3, .3, .4);
  if (kr > 0) txt(ctx, 'al rallentatore', 1120, 300, { size: 30, color: C.dim, align: 'right', alpha: kr });
  // i conti: il massimo dello statico, poi il dinamico
  conPedici(ctx, '{dim:statico, al massimo:}', 150, 180, { size: 32, alpha: P(t, 43.9, 44.4) });
  conPedici(ctx, '{mink:μ}⌊s⌋{mink:·}{my:N} = 0,5 · 490 N = {y:245 N}', 490, 180, { size: 40, alpha: P(t, 44.1, 44.6) });
  conPedici(ctx, '{dim:dinamico:}', 150, 245, { size: 32, alpha: P(t, 58.5, 59.0) });
  conPedici(ctx, '{mink:μ}⌊d⌋{mink:·}{my:N} = 0,3 · 490 N = {y:147 N}', 490, 245, { size: 40, alpha: P(t, 58.7, 59.2) });
  drawRich(ctx, '{dim:quasi uguale a ogni velocità e con ogni area}', 150, 310, { size: 30, align: 'left', alpha: P(t, 72.6, 73.1) });
  ctx.restore();
}

// il grafico: l'attrito in funzione della spinta (1,5 px per newton)
const GC = [1200, 110, 610, 680], GX = 1290, GY = 700, GS = 1.5;
const gp = (F, f) => [GX + F * GS, GY - f * GS];
function sceneGrafico(ctx, t) {
  if (t < 21 || t > 77.5) return;
  const al = life(t, 21.7, 77.3, .6, .5);
  card(ctx, ...GC, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'attrito e spinta', 1505, 165, { size: 36, weight: 600 }));
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX, GY); ctx.lineTo(GX + 310 * GS, GY); ctx.moveTo(GX, GY); ctx.lineTo(GX, GY - 310 * GS); ctx.stroke();
  arrowHead(ctx, [GX + 310 * GS + 6, GY], 0, C.ink); arrowHead(ctx, [GX, GY - 310 * GS - 6], -Math.PI / 2, C.ink);
  for (const n of [100, 200, 300]) {
    const [x] = gp(n, 0), [, y] = gp(0, n);
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, GY - 7); ctx.lineTo(x, GY + 7); ctx.moveTo(GX - 7, y); ctx.lineTo(GX + 7, y); ctx.stroke();
    txt(ctx, String(n), x, GY + 28, { size: 29, color: C.dim }); txt(ctx, String(n), GX - 14, y, { size: 29, color: C.dim, align: 'right' });
  }
  txt(ctx, 'spinta (N)', GX + 310 * GS, GY + 64, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'attrito (N)', GX + 18, GY - 310 * GS + 2, { size: 30, color: C.dim, align: 'left' });
  const m = moto(t), Fmax = m.va ? FS : Math.min(m.F, FS);
  // il massimo dello statico
  const km = P(t, 44.0, 44.6);
  if (km > 0) { dashed(ctx, gp(0, FS), gp(300, FS), C.v, 1, km); drawRich(ctx, '{v:massimo 245 N}', gp(300, FS)[0], gp(300, FS)[1] - 26, { size: 30, align: 'right', alpha: km }); }
  // lo statico: l'attrito uguale alla spinta, sulla diagonale
  if (Fmax > 1) { ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round'; const a = gp(0, 0), b = gp(Fmax, Fmax); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  drawRich(ctx, '{y:statico}', 1435, 505, { size: 30, align: 'right', alpha: P(t, 35.0, 35.5) });
  // il dinamico: 147 N, qualunque sia la spinta
  if (m.va) {
    ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; const a = gp(Math.min(m.F, 250), FD), b = gp(250, FD);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    ctx.strokeStyle = css(C.y, .5); ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(gp(250, FS)[0], gp(250, FS)[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    drawRich(ctx, '{y:dinamico 147 N}', gp(225, FD)[0], gp(225, FD)[1] + 34, { size: 30, alpha: P(t, 58.5, 59.0) });
  }
  if (m.F > .5) M.dot(ctx, gp(m.F, m.f), C.ink, 1, 11);
  ctx.restore();
}

// 2 · in una frase (77,1–87)
function sceneFine(ctx, t) {
  if (t < 77.0) return;
  const al = 1 - P(t, 85.1, 86.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 77.3 });
    drawRich(ctx, 'Per partire serve più forza\nche per scivolare.', W / 2, 290, { size: 70, weight: 600, local: t - 77.7, stagger: .09 });
  });
  const pills = [[490, 'statico: si {g:adatta}\nfino a un massimo'], [960, 'dinamico:\n{g:più piccolo}'], [1430, 'tutti e due\nproporzionali a {my:N}']];
  pills.forEach(([x, s], i) => {
    const a = 79.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  // le due formule, con i pedici
  const kf2 = P(t, 81.7, 82.3);
  conPedici(ctx, '{mink:μ}⌊s⌋{mink:·}{my:N}', 490, 650, { size: 48, align: 'center', alpha: kf2 });
  conPedici(ctx, '{mink:μ}⌊d⌋{mink:·}{my:N}  <  {mink:μ}⌊s⌋{mink:·}{my:N}', 960, 650, { size: 48, align: 'center', alpha: kf2 });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4],                                                // la cassa
    ['pop', 11.9, .4], ['pop', 16.6, .45],                                            // il peso P, la normale N
    ['soffio', 21.7],                                                                 // il grafico
    ['tono', 21.8, 22.6, [0, .33]], ['traccia', 21.8, 22.6], ['pop', 25.9, .4],       // spinta 100 N, l'attrito risponde
    ['tono', 30.6, 31.6, [.33, .67]], ['traccia', 30.6, 31.6], ['pop', 35.0, .45],    // spinta 200 N, statico
    ['pop', 44.1, .55], ['ding', 44.6],                                               // μs·N = 245 N, il massimo
    ['tono', 48.7, 49.9, [.67, .82]], ['traccia', 48.7, 49.9],                        // spinta fino a 245 N
    ['pop', 53.6, .7], ['tono', 53.6, 58.31, [0, .25, .5, .75, 1]],                   // 250 N: parte, la velocità cresce
    ['tono', 58.31, 59.0, [.83, .49]],                                                // la spinta scende a 147 N
    ['pop', 58.5, .4], ['pop', 58.7, .5], ['ding', 59.3],                             // μd·N = 147 N
    ['pop', 72.6, .35],                                                               // non dipende da velocità e area
    ['soffio', 77.3], ['pop', 79.9, .5], ['pop', 80.4, .6], ['pop', 80.9, .7],        // in una frase
    ['pop', 81.7, .6],                                                                // μd·N < μs·N
  ];
  return {
    titolo: 'Perché la cassa non parte', durata: 87, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.0, 'l’attrito statico'], [39.0, 53.3, 'il massimo'], [53.3, 77.0, 'l’attrito dinamico']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneCassa(ctx, t); sceneGrafico(ctx, t); sceneFine(ctx, t); },
  };
});
