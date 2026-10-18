'use strict';
/* Il peso sul piano inclinato — il peso si scompone in P·h/l lungo il piano e P·b/l contro il piano (triangoli simili, niente trigonometria); il piano risponde. Argomento: equilibrio. */
CVIDEO.registra('equilibrio/piano-inclinato', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [100.5, 190], [101.8, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [100.5, 1050], [101.8, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [100.5, 2.2], [101.8, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [100.5, 2], [101.8, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [100.5, -1.5], [101.8, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.1, 'pensa'], [25.5, 'neutro'],
  [29.9, 'pensa'], [32.8, 'neutro'], [38.2, 'felice'], [41.5, 'neutro'], [46.6, 'felice'], [51.5, 'festa'],
  [55.9, 'neutro'], [65.2, 'felice'], [68.6, 'neutro'], [73.5, 'festa'], [77.1, 'neutro'], [79.7, 'felice'],
  [83.8, 'neutro'], [86.4, 'sorpreso'], [89.8, 'pensa'], [92.9, 'neutro'], [96.4, 'sorpreso'], [102.6, 'felice'],
  [106.1, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché su una salita ripida\nsi scivola di più?'],
  [7.9, 12.4, 'Un blocco di 10 kg, un piano inclinato\ndi 30°, {g:senza attrito}.'],
  [12.5, 15.6, 'Una fune lo tiene fermo.'],
  [15.7, 21.0, 'Il peso {my:P} = {mink:m·g} = 98 N punta\nsempre in {g:verticale}, verso il basso.'],
  [21.1, 25.4, 'Lo scompongo in due parti: una\n{y:lungo il piano}, una {y:perpendicolare}.'],
  [25.5, 29.8, 'Il piano è un triangolo: altezza {mink:h},\nlunghezza {mink:l}, base {mink:b}.'],
  [29.9, 32.7, 'Ingrandisco il triangolo delle forze.'],
  [32.8, 38.1, '{mv:P} va con {mv:l}, la parte {g:lungo il piano}\ncon {mg:h}, quella {x:perpendicolare} con {mx:b}.'],
  [38.2, 41.4, 'Hanno gli stessi angoli:\nsono {v:simili}.'],
  [41.5, 46.5, 'Così la parte lungo il piano vale\n{my:P}{mink:·h/l}, quella contro il piano {my:P}{mink:·b/l}.'],
  [46.6, 51.4, 'A 30° il piano è mezzo triangolo\nequilatero: {mink:h} è metà di {mink:l}.'],
  [51.5, 55.8, 'La parte lungo il piano è metà\ndel peso: {y:49 N}.'],
  [55.9, 60.2, 'Contro il piano: {mink:b/l} ≈ 0,87 (misurato),\nquindi {y:≈ 85 N}.'],
  [60.3, 65.1, 'Il piano risponde con la reazione {my:N},\n{g:perpendicolare} al piano: ≈ 85 N.'],
  [65.2, 68.5, '{my:N} e la parte perpendicolare\nsi {g:annullano}.'],
  [68.6, 73.4, 'Resta quella lungo il piano: la fune\nla equilibra tirando con {g:49 N}.'],
  [73.5, 77.0, 'Per tenerlo bastano 49 N:\n{g:metà} del peso.'],
  [77.1, 79.6, 'Lo alzo a 60°…'],
  [79.7, 83.7, '{mink:h/l} ≈ 0,87: la fune tira\ncon {y:≈ 85 N}.'],
  [83.8, 86.3, 'Lo abbasso a 10°…'],
  [86.4, 89.7, '{mink:h/l} ≈ 0,17: appena {y:≈ 17 N}.'],
  [89.8, 92.8, 'Più ripido, più forza\nper tenerlo.'],
  [92.9, 96.2, 'Torno a 30°. Ora taglio la fune…'],
  [96.4, 100.2, '…nessuno equilibra più i 49 N:\nil blocco {r:scivola}.'],
  [102.6, 106.9, 'Sul piano inclinato tira giù solo\nuna parte del peso: {my:P}{mink:·h/l}.'],
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
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
const RAD = Math.PI / 180, G = 9.8, MASSA = 10, PESO = MASSA * G;   // 98 N
const A = [300, 640], LP = 560, BL = 130, BH = 90, FS = 1.6;          // il piano incernierato in A; 1,6 px per newton
const S0 = 330, SMIN = BL / 2 + 138, PXM = 100, LENTO = 5.4, T_TAGLIO = 96.3;
// l'angolo del piano nel tempo (gradi)
const alfa = t => kf(t, [[77.3, 30], [78.8, 60], [84.0, 60], [85.5, 10], [90.0, 10], [91.8, 50], [93.0, 50], [94.2, 30]]);
// la posizione del blocco lungo il piano: fermo, poi s = s0 − ½·a·τ² con a = g·h/l = 4,9 m/s² a 30° (al rallentatore), fino al fermo
function posizione(t) {
  if (t <= T_TAGLIO) return S0;
  const tau = (t - T_TAGLIO) / LENTO, a = G * Math.sin(30 * RAD);
  return Math.max(SMIN, S0 - .5 * a * tau * tau * PXM);
}
// numeri arrotondati all'unità, con ≈ se l'arrotondamento si vede
const tondo = v => (Math.abs(v - Math.round(v)) > .005 ? '≈ ' : '') + Math.round(v) + ' N';

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il peso sul piano inclinato', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il piano, il blocco, le forze (7,5–77,5)
function scenePiano(ctx, t) {
  if (t < 7.5 || t > 100.9) return;
  const al = life(t, 7.6, 100.7, .6, .5), a = alfa(t) * RAD;
  const u = [Math.cos(a), -Math.sin(a)], n = [-Math.sin(a), -Math.cos(a)];   // lungo il piano in su, e perpendicolare verso fuori
  const B = add(A, u, LP);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // pavimento, piano, angolo
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, A[1]); ctx.lineTo(1070, A[1]); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .84)); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(B[0], A[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
  // il triangolo del piano: altezza h, lunghezza l, base b; evidenziato quando Stilla parla dei triangoli simili
  // l ↔ P (viola), h ↔ parte lungo il piano (verde), b ↔ parte perpendicolare (azzurro)
  const kTri = life(t, 30.0, 41.4, .5, .4);
  if (kTri > 0) {
    ctx.save(); ctx.globalAlpha *= kTri; ctx.lineWidth = 7; ctx.lineCap = 'round';
    for (const [p0, p1, col] of [[A, B, C.v], [B, [B[0], A[1]], C.g], [A, [B[0], A[1]], C.x]]) {
      ctx.strokeStyle = css(col); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    }
    ctx.restore();
  }
  const kLat = P(t, 25.7, 26.2);
  drawRich(ctx, kTri > .5 ? '{mg:h}' : '{mink:h}', B[0] + 30, (B[1] + A[1]) / 2, { size: 40, align: 'left', alpha: kLat });
  drawRich(ctx, kTri > .5 ? '{mx:b}' : '{mink:b}', (A[0] + B[0]) / 2, A[1] + 40, { size: 40, alpha: kLat });
  drawRich(ctx, kTri > .5 ? '{mv:l}' : '{mink:l}', ...add(add(A, [Math.cos(a), -Math.sin(a)], 470), [Math.sin(a), Math.cos(a)], 34), { size: 40, alpha: kLat });   // dentro il triangolo, verso la cima: lontano da blocco, fune e frecce
  // il fermo in fondo
  const F0 = add(A, u, 130);
  ctx.save(); ctx.translate(F0[0], F0[1]); ctx.rotate(-a); ctx.fillStyle = css(C.dim); ctx.fillRect(-8, -34, 16, 34); ctx.restore();
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(A[0], A[1], 92, -a, 0); ctx.stroke();
  drawRich(ctx, '{mink:α} = ' + Math.round(alfa(t)) + '°', A[0] - 20, A[1] + 42, { size: 36, align: 'right' });
  // il blocco
  const s = posizione(t), Cb = add(add(A, u, s), n, BH / 2);
  ctx.save(); ctx.translate(Cb[0], Cb[1]); ctx.rotate(-a);
  ctx.fillStyle = css(mix(C.x, C.paper, .7)); ctx.strokeStyle = css(mix(C.x, C.ink, .4)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(-BL / 2, -BH / 2, BL, BH, 8); ctx.fill(); ctx.stroke();
  ctx.restore();
  txt(ctx, '10 kg', Cb[0] + n[0] * 76, Cb[1] + n[1] * 76, { size: 30, weight: 600, alpha: P(t, 8.2, 8.7) * (1 - P(t, 15.6, 16.0)) });
  // la fune fino in cima, finché non la taglio
  const kfu = P(t, 12.6, 13.2) * (1 - P(t, T_TAGLIO - .1, T_TAGLIO + .1));
  // la fune corre parallela al piano, fino a una carrucola in cima
  const Bp = add(B, n, BH / 2);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(Bp[0], Bp[1]); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(Bp[0], Bp[1], 8, 0, Math.PI * 2); ctx.fill();
  if (kfu > 0) {
    const a1 = add(Cb, u, BL / 2), k = P(t, 12.6, 13.2);
    ctx.save(); ctx.globalAlpha *= kfu; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(lerp(a1[0], Bp[0], k), lerp(a1[1], Bp[1], k)); ctx.stroke();
    ctx.restore();
  }
  // le forze, tutte dal centro del blocco (1,6 px per newton); i valori stanno nella scheda
  const Ppar = PESO * Math.sin(a), Pperp = PESO * Math.cos(a);
  // dal taglio della fune si spengono il tratteggio e le etichette delle due parti
  const spento = 1 - P(t, T_TAGLIO, T_TAGLIO + .4);
  const kP = P(t, 15.9, 16.4), kScomp = P(t, 21.3, 22.0), kPar = P(t, 51.7, 52.2) * spento, kPerp = P(t, 56.1, 56.6) * spento;
  const kN = P(t, 60.5, 61.0), kT = P(t, 68.8, 69.3) * (1 - P(t, T_TAGLIO - .1, T_TAGLIO + .1));
  const tipP = [Cb[0], Cb[1] + PESO * FS], tipPar = add(Cb, u, -Ppar * FS), tipPerp = add(Cb, n, -Pperp * FS);
  // il parallelogramma della scomposizione
  if (kScomp * spento > 0) { dashed(ctx, tipPar, tipP, C.dim, kScomp, .8 * spento); dashed(ctx, tipPerp, tipP, C.dim, kScomp, .8 * spento); }
  // il triangolo delle forze (peso, parte lungo il piano, parte perpendicolare): simile a quello del piano
  if (kTri > 0) {
    ctx.save(); ctx.globalAlpha *= kTri; ctx.fillStyle = css(C.y, .22);
    ctx.beginPath(); ctx.moveTo(Cb[0], Cb[1]); ctx.lineTo(tipPar[0], tipPar[1]); ctx.lineTo(tipP[0], tipP[1]); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  freccia(ctx, Cb, tipP, C.y, kP * (1 - .6 * kScomp));
  drawRich(ctx, '{my:P}', tipP[0], tipP[1] + 30, { size: 38, alpha: kP * (1 - kScomp) });
  freccia(ctx, Cb, tipPar, C.y, Math.max(kScomp * .9, kPar));
  freccia(ctx, Cb, tipPerp, C.y, Math.max(kScomp * .9, kPerp));
  // le etichette lungo il piano stanno sopra il blocco; quella perpendicolare oltre la punta
  const sopra = (k, len) => add(add(Cb, u, k * Math.max(len / 2, 92)), n, BH / 2 + 44);
  drawRich(ctx, '{y:' + tondo(Ppar) + '}', ...sopra(-1, Ppar * FS), { size: 32, alpha: kPar });
  drawRich(ctx, '{y:' + tondo(Pperp) + '}', ...add(tipPerp, n, -50), { size: 32, alpha: kPerp });
  // la reazione del piano e la fune
  const tipN = add(Cb, n, Pperp * FS);
  freccia(ctx, Cb, tipN, C.y, kN);
  drawRich(ctx, '{my:N}', ...add(tipN, n, 30), { size: 38, alpha: kN });
  const tipT = add(Cb, u, Ppar * FS);
  freccia(ctx, Cb, tipT, C.y, kT);
  drawRich(ctx, '{y:fune}', ...sopra(1, Ppar * FS), { size: 32, alpha: kT });
  M.dot(ctx, Cb, C.ink, kP, 8);
  txt(ctx, 'al rallentatore', 1090, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, T_TAGLIO, T_TAGLIO + 4.1, .3, .4) });
  ctx.restore();
}

// il triangolo delle forze, ingrandito nella scheda (30–41,4): stessi colori dei lati corrispondenti del piano
function sceneSimili(ctx, t) {
  const k = life(t, 30.0, 41.3, .6, .4);
  if (k <= 0) return;
  const a = 30 * RAD, Lp = 360, top = [1560, 345], bot = [top[0], top[1] + Lp];
  const par = [top[0] - Math.cos(a) * Lp * Math.sin(a), top[1] + Math.sin(a) * Lp * Math.sin(a)];   // la punta della parte lungo il piano
  ctx.save(); ctx.globalAlpha *= k; ctx.lineCap = 'round';
  ctx.fillStyle = css(C.y, .14); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(par[0], par[1]); ctx.lineTo(bot[0], bot[1]); ctx.closePath(); ctx.fill();
  freccia(ctx, top, bot, C.v, 1, 7);
  freccia(ctx, top, par, C.g, 1, 7);
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(par[0], par[1]); ctx.lineTo(bot[0], bot[1]); ctx.stroke();
  // l'angolo retto e l'angolo α (fra il peso e la parte perpendicolare)
  const v1 = [(top[0] - par[0]) / Math.hypot(top[0] - par[0], top[1] - par[1]), (top[1] - par[1]) / Math.hypot(top[0] - par[0], top[1] - par[1])];
  const v2 = [(bot[0] - par[0]) / Math.hypot(bot[0] - par[0], bot[1] - par[1]), (bot[1] - par[1]) / Math.hypot(bot[0] - par[0], bot[1] - par[1])];
  const q1 = add(par, v1, 22), q2 = add(add(par, v1, 22), v2, 22), q3 = add(par, v2, 22);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.lineTo(q3[0], q3[1]); ctx.stroke();
  const aSu = -Math.PI / 2, aPar = Math.atan2(par[1] - bot[1], par[0] - bot[0]);
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bot[0], bot[1], 64, aPar, aSu); ctx.stroke();
  drawRich(ctx, '{mink:α}', bot[0] - 26, bot[1] - 96, { size: 36 });
  drawRich(ctx, '{mv:P}', top[0] + 30, (top[1] + bot[1]) / 2, { size: 40, align: 'left' });
  drawRich(ctx, '{g:lungo il piano}', (top[0] + par[0]) / 2 - 30, (top[1] + par[1]) / 2 - 34, { size: 30, align: 'right' });
  drawRich(ctx, '{x:perpendicolare}', (par[0] + bot[0]) / 2 - 30, (par[1] + bot[1]) / 2 + 22, { size: 30, align: 'right' });
  ctx.restore();
}

// la scheda dei conti, a destra
function riga(ctx, nome, val, y, col, al, size = 38) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, 1185, y, { size: size - 4, align: 'left' });
  drawRich(ctx, val, 1780, y, { size, align: 'right', fill: css(col) });
  ctx.restore();
}
// h/l e b/l: 0,5 esatto a 30° (mezzo triangolo equilatero), altrimenti misurati e scritti con ≈
const rapporto = v => Math.abs(v - .5) < 1e-6 ? '0,5' : '≈ ' + M.fmtN(v, 2);
function sceneScheda(ctx, t) {
  if (t < 15 || t > 100.9) return;
  const al = life(t, 15.8, 100.7, .5, .5), a = alfa(t) * RAD, hl = Math.sin(a), bl = Math.cos(a);   // h/l e b/l del triangolo disegnato
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'il peso si scompone', 1480, 165, { size: 36, weight: 600 }));
  riga(ctx, '{my:P} = {mink:m·g}', '98 N', 240, C.y, 1);
  drawRich(ctx, '{dim:10 kg · 9,8 m/s²}', 1185, 285, { size: 30, align: 'left' });
  riga(ctx, '{mink:h/l}', rapporto(hl), 350, C.ink, P(t, 46.8, 47.3));
  riga(ctx, '{mink:b/l}', rapporto(bl), 410, C.ink, P(t, 56.1, 56.6));
  riga(ctx, '{dim:lungo il piano} {my:P}{mink:·h/l}', t > 51.7 ? tondo(PESO * hl) : '', 480, C.y, P(t, 41.7, 42.2));
  riga(ctx, '{dim:contro il piano} {my:P}{mink:·b/l}', t > 56.1 ? tondo(PESO * bl) : '', 545, C.y, P(t, 41.7, 42.2));
  riga(ctx, '{dim:reazione del piano} {my:N}', tondo(PESO * bl), 610, C.y, P(t, 60.5, 61.0));
  riga(ctx, '{dim:fune}', tondo(PESO * hl), 675, C.y, P(t, 68.8, 69.3) * (1 - P(t, T_TAGLIO - .1, T_TAGLIO + .3)));
  drawRich(ctx, '{dim:a 30°: mezzo triangolo equilatero}', 1480, 740, { size: 30, alpha: life(t, 46.8, 77.0, .4, .4) });
  drawRich(ctx, '{mink:h/l}{dim: si chiama seno di }{mink:α}{dim: (più avanti)}', 1480, 740, { size: 30, alpha: life(t, 77.3, 100.7, .4, .4) });
  ctx.restore();
}

// 2 · in una frase (100,5–109,5)
function sceneFine(ctx, t) {
  if (t < 100.4) return;
  const al = 1 - P(t, 107.4, 108.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 100.7 });
    drawRich(ctx, 'Sul piano inclinato tira giù\nsolo una parte del peso.', W / 2, 290, { size: 70, weight: 600, local: t - 101.1, stagger: .09 });
  });
  const pills = [[490, 'lungo il piano:\n{my:P}{mink:·h/l}'], [960, 'contro il piano:\n{my:P}{mink:·b/l}'], [1430, '{my:N}: {g:perpendicolare}\nal piano']];
  pills.forEach(([x, s], i) => {
    const a = 103.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): quando il piano si alza o si abbassa il tono segue l'angolo (α/70°,
  // con l'easing di alfa()); tagliata la fune segue il blocco che scivola giù (posizione(), si ferma a 100,19 s)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .5], ['traccia', 12.6, 13.2],                       // il blocco sul piano, la fune
    ['soffio', 15.8], ['pop', 15.9, .6],                                              // la scheda, il peso P
    ['pop', 21.3, .5], ['traccia', 21.3, 22.0],                                       // la scomposizione
    ['pop', 25.7, .45],                                                               // h, l, b
    ['pop', 30.0, .6], ['traccia', 30.1, 30.6],                                       // i due triangoli simili
    ['pop', 41.7, .5], ['pop', 46.8, .55],                                            // P·h/l e P·b/l; h/l = 0,5
    ['pop', 51.7, .45], ['pop', 56.1, .55], ['pop', 60.5, .65],                       // 49 N, ≈ 85 N, la reazione N
    ['ding', 69.0],                                                                   // la fune tira 49 N
    ['tono', 77.3, 78.8, [.429, .455, .643, .83, .857]],                              // a 60°: ≈ 85 N
    ['tono', 84.0, 85.5, [.857, .813, .5, .188, .143]],                               // a 10°: ≈ 17 N
    ['tono', 90.0, 91.8, [.143, .179, .429, .679, .714]],                             // più ripido, più forza
    ['tono', 93.0, 94.2, [.714, .696, .571, .446, .429]],                             // di nuovo 30°
    ['pop', 96.3, .7], ['tono', 96.3, 100.19, [.5, .484, .438, .36, .25]], ['pop', 100.19, .15],   // taglio la fune: scivola
    ['soffio', 100.7], ['pop', 103.3, .5], ['pop', 103.8, .6], ['pop', 104.3, .7],    // in una frase
  ];
  return {
    titolo: 'Il peso sul piano inclinato', durata: 109.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 29.8, 'il peso si scompone'], [29.8, 46.5, 'triangoli simili'], [46.5, 77.0, 'a 30°'], [77.0, 92.8, 'più ripido, più forza'], [92.8, 100.4, 'senza fune']],
    scena(ctx, t) { sceneIntro(ctx, t); scenePiano(ctx, t); sceneScheda(ctx, t); sceneSimili(ctx, t); sceneFine(ctx, t); },
  };
});
