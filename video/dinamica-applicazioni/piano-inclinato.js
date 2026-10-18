'use strict';
/* La slitta che scivola — dinamica sul piano inclinato: slitta di 20 kg (P = 196 N) su una discesa di 30°; lungo il
   piano m·g·sin α = 98 N, contro il piano m·g·cos α ≈ 170 N, annullata da N. Senza attrito a = g·sin α = 4,9 m/s²:
   10 m in 2,02 s, a 9,9 m/s. Sulla neve, μ = 0,2: attrito μ·N ≈ 34 N, a = g·(sin α − μ·cos α) ≈ 3,20 m/s²: 10 m in
   2,50 s, a 8,0 m/s. La massa si semplifica. Discese al rallentatore (2 s di video per 1 s).
   Argomento: dinamica-applicazioni. */
CVIDEO.registra('dinamica-applicazioni/piano-inclinato', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [89.4, 190], [90.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [89.4, 1050], [90.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [89.4, 2.2], [90.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [89.4, 2], [90.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [89.4, -1.5], [90.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [26.7, 'felice'], [31.5, 'neutro'],
  [41.1, 'felice'], [45.5, 'neutro'], [50.0, 'sorpreso'], [54.4, 'neutro'], [64.1, 'pensa'], [69.3, 'felice'],
  [74.7, 'neutro'], [80.2, 'sorpreso'], [84.7, 'felice'], [89.4, 'neutro'], [91.5, 'felice'], [96.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Quanto accelera una slitta\nche scende da una discesa?'],
  [7.9, 12.4, 'Slitta di 20 kg, discesa\ndi 30°, lunga 10 m.'],
  [12.5, 16.6, 'Prima sul ghiaccio,\n{g:senza attrito}.'],
  [16.7, 21.4, 'Il peso {my:P} = {mink:m·g} = 196 N\nsi scompone in due.'],
  [21.5, 26.6, 'Lungo il piano {mink:m·g·sin α},\ncontro il piano {mink:m·g·cos α}.'],
  [26.7, 31.4, 'Il piano risponde con {my:N}:\nle due si {g:annullano}.'],
  [31.5, 35.8, 'Resta la parte lungo il piano:\n{mink:m·g·sin α} = 98 N.'],
  [36.0, 41.0, 'Secondo principio: {mink:m·}{mv:a} = {mink:m·g·sin α},\nquindi {mv:a} = {mink:g·sin α}.'],
  [41.1, 45.6, 'La massa si semplifica:\n{mv:a} = 9,8 · 0,5 = 4,9 m/s².'],
  [45.7, 49.9, 'La lascio andare,\nal rallentatore…'],
  [50.0, 54.2, '…10 m in 2,02 s:\narriva a 9,9 m/s.'],
  [54.4, 58.8, 'Ora sulla neve: attrito\ndinamico con {mink:μ} = 0,2.'],
  [58.9, 64.0, 'L’attrito vale {mink:μ·}{my:N} = {mink:μ·m·g·cos α}\n≈ 34 N, e punta {g:in su}.'],
  [64.1, 69.2, '{mink:m·}{mv:a} = {mink:m·g·sin α − μ·m·g·cos α}:\nla massa si semplifica ancora.'],
  [69.3, 74.6, '{mv:a} = {mink:g·(sin α − μ·cos α)}\n≈ 3,2 m/s².'],
  [74.7, 80.1, 'Gara con la slitta di prima,\nal rallentatore…'],
  [80.2, 84.6, '…quella in 2,02 s,\nquesta in 2,50 s, a 8 m/s.'],
  [84.7, 89.2, 'Con o senza attrito, {mv:a} non\ndipende dalla massa.'],
  [91.5, 96.4, 'Sul piano inclinato\n{mv:a} = {mink:g·(sin α − μ·cos α)}.'],
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
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 13, 8, 26); ctx.fillRect(x + 14, y - 13, 8, 26); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 13); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- la fisica (metri, secondi, newton) ----------
const G = 9.8, MASSA = 20, PESO = MASSA * G, RAD = Math.PI / 180, ALFA = 30 * RAD, MU = .2;
const SIN = Math.sin(ALFA), COS = Math.cos(ALFA);
const PPAR = PESO * SIN, PPERP = PESO * COS, ATTR = MU * PPERP;          // 98 N, ≈ 169,7 N, ≈ 33,9 N
const A1 = G * SIN, A2 = G * (SIN - MU * COS);                          // 4,9 m/s² e ≈ 3,20 m/s²
const L = 10, T1 = Math.sqrt(2 * L / A1), T2 = Math.sqrt(2 * L / A2);   // 2,02 s e 2,50 s
const LENTO = 2, TV1 = 45.8, TV2 = 75.0;                                 // due discese al rallentatore
const tau1 = t => clamp((t - TV1) / LENTO, 0, T1);
const tauG = t => clamp((t - TV2) / LENTO, 0, T1);                      // la slitta di prima, in trasparenza
const tau2 = t => clamp((t - TV2) / LENTO, 0, T2);
const S0 = .75;                                                          // dove parte il centro della slitta (m dalla cima)
// la posizione della slitta lungo il piano, in metri dalla cima
function posizione(t) {
  if (t < 54.4) return S0 + A1 * tau1(t) * tau1(t) / 2;
  if (t < 74.4) return SF;                                               // fermo immagine mentre scivola sulla neve
  return S0 + A2 * tau2(t) * tau2(t) / 2;
}
const SF = 5.5, VF = Math.sqrt(2 * A2 * (SF - S0));                     // a metà discesa sulla neve: ≈ 5,5 m/s
function velocita(t) { return t < 54.4 ? A1 * tau1(t) : t < 74.4 ? VF : A2 * tau2(t); }

// ---------- il piano (scheda di sinistra): 52 px per metro, lungo 11,4 m ----------
const KP = 50, LP = 12, T = [570, 330];
const U = [COS, SIN], N = [SIN, -COS];                                   // giù lungo il piano; perpendicolare, verso fuori
const B = add(T, U, LP * KP), B0 = [T[0], B[1]];
const SC = 1.3, CODA = 38 * SC;                                          // la slitta è grande 1,3 volte il disegno base
const centro = s => add(add(T, U, s * KP), N, 22 * SC);                  // il centro della slitta
function slitta(ctx, s, al = 1, fantasma = false) {
  if (al <= 0) return;
  const c = add(T, U, s * KP);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(c[0], c[1]); ctx.rotate(ALFA); ctx.scale(SC, SC);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round';
  if (fantasma) ctx.setLineDash([7, 6]);
  // il pattino con la punta ricurva in avanti, e il sedile
  ctx.beginPath(); ctx.moveTo(-38, -3); ctx.lineTo(30, -3); ctx.arc(30, -13, 10, Math.PI / 2, -Math.PI / 3, true); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-24, -3); ctx.lineTo(-24, -14); ctx.moveTo(18, -3); ctx.lineTo(18, -14); ctx.stroke();
  ctx.fillStyle = css(fantasma ? C.paper : mix(C.x, C.paper, .55)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-34, -34, 60, 20, 6); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La slitta che scivola', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenePiano(ctx, t) {
  if (t < 7.5 || t > 89.8) return;
  const al = life(t, 7.5, 89.7, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il terreno e il piano: neve dopo 54,4 s
  const neve = P(t, 54.4, 55.2);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(420, B[1]); ctx.lineTo(1100, B[1]); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .84)); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(B0[0], B0[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
  // la superficie: azzurra (ghiaccio) o bianca e spessa (neve)
  ctx.lineCap = 'round';
  ctx.strokeStyle = css(C.x, .7 * (1 - neve)); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  if (neve > 0) {
    const pc = M.rgb(C.paper), scura = pc[0] + pc[1] + pc[2] < 384;   // la neve resta chiara anche sulla carta scura
    ctx.strokeStyle = css(scura ? mix(C.ink, C.paper, .25) : mix(C.paper, C.dim, .12), neve); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(T[0] + 3, T[1] - 6); ctx.lineTo(B[0] - 3, B[1] - 6); ctx.stroke();
    ctx.strokeStyle = css(C.dim, .5 * neve); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(T[0] + 6, T[1] - 12); ctx.lineTo(B[0] - 6, B[1] - 12); ctx.stroke();
  }
  txt(ctx, neve > .5 ? 'neve' : 'ghiaccio', 1060, 160, { size: 30, color: neve > .5 ? C.dim : C.x, align: 'right' });
  // l'angolo
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(B[0], B[1], 90, Math.PI, Math.PI + ALFA); ctx.stroke();
  drawRich(ctx, '{mink:α} = 30°', B[0] - 70, B[1] + 42, { size: 34 });
  // i 10 m di discesa: dalla partenza all'arrivo
  const k10 = life(t, 8.2, 16.4, .4, .4) + life(t, 45.6, 54.2, .4, .4);
  if (k10 > 0) {
    ctx.save(); ctx.globalAlpha *= k10; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    const a = add(add(T, U, S0 * KP), N, -34), b = add(add(T, U, (S0 + L) * KP), N, -34);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    for (const p of [a, b]) { const q = add(p, N, 10), r = add(p, N, -10); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.stroke(); }
    const m = add(add(T, U, (S0 + L / 2) * KP), N, -64);
    txt(ctx, '10 m', m[0], m[1], { size: 32, color: C.dim });
    ctx.restore();
  }
  // la slitta di prima, in trasparenza, durante la gara
  const kg = life(t, 74.8, 89.2, .3, .4);
  if (kg > 0) slitta(ctx, S0 + A1 * tauG(t) * tauG(t) / 2, .5 * kg, true);
  // la slitta: dopo la prima discesa va a metà della pista di neve (fermo immagine mentre scivola), poi torna in cima
  const kr = (1 - life(t, 53.9, 55.0, .4, .4)) * (1 - life(t, 74.0, 74.8, .4, .4));
  const s = posizione(t);
  slitta(ctx, s, kr);
  const c = centro(s);
  if (t > 54.4 && t < 74.4) txt(ctx, 'mentre scivola', ...add(add(T, U, (s + 1.2) * KP), N, -80), { size: 30, color: C.dim, alpha: kr });
  // le forze, 1 px per newton; l'attrito parte dal contatto, dietro il pattino
  const kP = life(t, 16.9, 36.0, .4, .4), kS = life(t, 21.7, 36.0, .4, .4), kPerp = life(t, 22.4, 31.9, .4, .4);
  const kN = life(t, 26.9, 31.9, .4, .4), kPar = Math.max(life(t, 21.7, 45.6, .4, .3), life(t, 55.2, 74.2, .4, .3));
  const kA = life(t, 59.1, 74.2, .4, .3);
  const base0 = add(add(T, U, s * KP), U, -CODA);
  const tipP = [c[0], c[1] + PESO], tipPar = add(c, U, PPAR), tipPerp = add(c, N, -PPERP), tipN = add(c, N, PPERP), tipA = add(base0, U, -ATTR);
  if (kS > 0) { dashed(ctx, tipPar, tipP, C.dim, 1, .7 * kS); dashed(ctx, tipPerp, tipP, C.dim, 1, .7 * kPerp); }
  freccia(ctx, c, tipP, C.y, kP * (1 - .5 * kS));
  drawRich(ctx, '{my:P}', tipP[0] + 26, tipP[1] - 16, { size: 36, align: 'left', alpha: kP });
  freccia(ctx, c, tipPerp, C.y, kPerp);
  drawRich(ctx, '{my:m·g·cos α}', tipPerp[0] - 14, tipPerp[1] + 14, { size: 30, align: 'right', alpha: kPerp });
  freccia(ctx, c, tipN, C.y, kN);
  drawRich(ctx, '{my:N}', tipN[0] + 30, tipN[1] + 6, { size: 36, align: 'left', alpha: kN });
  freccia(ctx, c, tipPar, C.y, kPar);
  const lp = add(tipPar, N, 40);
  drawRich(ctx, t < 31.5 ? '{my:m·g·sin α}' : '{y:98 N}', lp[0] + 4, lp[1], { size: 32, align: 'left', alpha: kPar });
  freccia(ctx, base0, tipA, C.y, kA);
  const la = add(tipA, N, -34);
  drawRich(ctx, '{y:≈ 34 N}', la[0], la[1], { size: 32, align: 'right', alpha: kA });
  M.dot(ctx, c, C.ink, Math.max(kP, kPar), 6);
  // velocità e accelerazione mentre scivola, sopra la slitta; finiscono sopra il centro, così in fondo restano nella scheda
  const v = velocita(t), corre = (t > TV1 && t < 54.3) || (t > 54.4 && t < 74.4) || t > TV2;
  if (corre) {
    const lv = v * 10, la2 = (t < 54.4 ? A1 : A2) * 16, base = add(c, N, 62), baseA = add(c, N, 108);
    const kv = clamp(v / .8) * kr, ka = kr * (t > 54.4 && t < 74.4 ? P(t, 69.5, 70.0) : 1);
    freccia(ctx, add(base, U, -lv), base, C.x, kv, 6);
    freccia(ctx, add(baseA, U, -la2), baseA, C.v, ka, 6);
    drawRich(ctx, '{mx:v}', ...add(base, U, -lv - 22), { size: 34, alpha: kv });
    drawRich(ctx, '{mv:a}', ...add(baseA, U, -la2 - 22), { size: 34, alpha: ka });
  }
  const st = (t > TV1 && t < TV1 + T1 * LENTO) || (t > TV2 && t < TV2 + T2 * LENTO) ? 'al rallentatore' : corre ? 'fermo immagine' : '';
  chip(ctx, 404, 765, st ? kr : 0, st || 'al rallentatore');
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1490;
function riga(ctx, nome, val, y, al, col) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1180, y, { size: 32, align: 'left', alpha: al });
  drawRich(ctx, val, 1800, y, { size: 38, align: 'right', alpha: al, fill: col ? css(col) : undefined });
}
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1180, y); ctx.lineTo(1800, y); ctx.stroke(); ctx.restore();
}
function cronometro(ctx, y, tau, s, v, al) {
  ctx.save(); ctx.globalAlpha *= al;
  // due righe: tempo e strada percorsa, poi la velocità
  const voci = [['{dim:tempo} {mink:t} =', fmtN(tau, 2), 's', 1180, y, 1430], ['{dim:strada} {mink:s} =', fmtN(s, 2), 'm', 1478, y, 1768],
    ['{dim:velocità} {mx:v} =', fmtN(v, 1), 'm/s', 1180, y + 58, 1430]];
  voci.forEach(([n, x, u, x0, yy, xr]) => {
    drawRich(ctx, n, x0, yy, { size: 32, align: 'left' });
    fixedNum(ctx, x, xr, yy, 38, C.ink); txt(ctx, u, xr + 8, yy, { size: 30, color: C.dim, align: 'left' });
  });
  ctx.restore();
}
function scenePannello(ctx, t) {
  if (t < 8.0 || t > 89.8) return;
  const al = life(t, 8.1, 89.7, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, PCX, 165, { size: 38, weight: 600, alpha: a }));
  // A · la slitta e il peso (8–35,9)
  const kA = 1 - P(t, 35.6, 36.0);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    tit('la slitta', 1);
    riga(ctx, '{dim:massa} {mink:m}', '20 kg', 235, P(t, 8.3, 8.8));
    riga(ctx, '{dim:inclinazione} {mink:α}', '30°', 290, P(t, 9.4, 9.9));
    riga(ctx, '{dim:superficie}', '{x:ghiaccio}, senza attrito', 345, P(t, 12.7, 13.2));
    linea(ctx, 390, P(t, 16.8, 17.2));
    riga(ctx, '{dim:peso} {my:P} = {mink:m·g}', '196 N', 440, P(t, 16.9, 17.4), C.y);
    riga(ctx, '{dim:lungo il piano} {mink:m·g·sin α}', '98 N', 500, P(t, 21.7, 22.2), C.y);
    riga(ctx, '{dim:contro il piano} {mink:m·g·cos α}', '≈ 170 N', 560, P(t, 23.4, 23.9), C.y);
    riga(ctx, '{dim:reazione del piano} {my:N}', '≈ 170 N', 620, P(t, 26.9, 27.4), C.y);
    drawRich(ctx, 'resta {y:98 N} lungo il piano', PCX, 710, { size: 38, local: t - 31.7 });
    ctx.restore();
  }
  // B · senza attrito (36–54,3)
  const kB = life(t, 36.0, 54.4, .4, .4);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    tit('senza attrito', 1);
    drawRich(ctx, '{mink:m·}{mv:a}{mink: = m·g·sin α}', PCX, 250, { size: 44, local: t - 36.2 });
    drawRich(ctx, '{mv:a}{mink: = g·sin α}', PCX, 330, { size: 52, local: t - 38.6 });
    drawRich(ctx, '{mv:a} = 9,8 · 0,5 = {g:4,9 m/s²}', PCX, 410, { size: 40, local: t - 41.3 });
    linea(ctx, 465, P(t, 45.5, 45.9));
    cronometro(ctx, 515, tau1(t), A1 * tau1(t) * tau1(t) / 2, A1 * tau1(t), P(t, 45.5, 45.9));
    drawRich(ctx, '{g:10 m in 2,02 s, a 9,9 m/s}', PCX, 665, { size: 40, local: t - 50.1 });
    ctx.restore();
  }
  // C · sulla neve (54,4–89,2)
  const kC = P(t, 54.4, 54.8);
  if (kC > 0) {
    ctx.save(); ctx.globalAlpha *= kC;
    tit('sulla neve', 1);
    riga(ctx, '{dim:attrito dinamico} {mink:μ}', '0,2', 235, P(t, 54.6, 55.1));
    riga(ctx, '{dim:attrito} {mink:μ·}{my:N}', '≈ 34 N', 290, P(t, 59.1, 59.6), C.y);
    drawRich(ctx, '{mink:m·}{mv:a}{mink: = m·g·sin α − μ·m·g·cos α}', PCX, 355, { size: 38, local: t - 64.3 });
    drawRich(ctx, '{mv:a}{mink: = g·(sin α − μ·cos α)}', PCX, 425, { size: 46, local: t - 69.5 });
    drawRich(ctx, '= 9,8 · (0,5 − 0,2 · 0,87) ≈ {g:3,2 m/s²}', PCX, 490, { size: 36, local: t - 70.6 });
    // la gara
    const kg = P(t, 74.8, 75.2);
    linea(ctx, 535, kg);
    ctx.save(); ctx.globalAlpha *= kg;
    txt(ctx, 'tempo', 1590, 575, { size: 30, color: C.dim, align: 'right' });
    txt(ctx, 'velocità', 1790, 575, { size: 30, color: C.dim, align: 'right' });
    const tg = tauG(t), tn = tau2(t);
    drawRich(ctx, '{x:ghiaccio}', 1180, 630, { size: 34, align: 'left' });
    fixedNum(ctx, fmtN(tg, 2), 1555, 630, 40, tg >= T1 ? C.g : C.ink); txt(ctx, 's', 1562, 630, { size: 30, align: 'left' });
    fixedNum(ctx, fmtN(A1 * tg, 1), 1720, 630, 40, C.ink); txt(ctx, 'm/s', 1727, 630, { size: 30, color: C.dim, align: 'left' });
    drawRich(ctx, '{dim:neve}', 1180, 690, { size: 34, align: 'left' });
    fixedNum(ctx, fmtN(tn, 2), 1555, 690, 40, tn >= T2 ? C.g : C.ink); txt(ctx, 's', 1562, 690, { size: 30, align: 'left' });
    fixedNum(ctx, fmtN(A2 * tn, 1), 1720, 690, 40, C.ink); txt(ctx, 'm/s', 1727, 690, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
    drawRich(ctx, 'la massa {g:si semplifica} sempre', PCX, 755, { size: 34, local: t - 84.9 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (89,4–99)
function sceneFine(ctx, t) {
  if (t < 89.3) return;
  const al = 1 - P(t, 97.0, 98.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 89.6 });
    drawRich(ctx, 'Sul piano inclinato la slitta accelera\ncon {mv:a}{mink: = g·(sin α − μ·cos α)}.', W / 2, 290, { size: 64, weight: 600, local: t - 90.0, stagger: .09 });
  });
  const pills = [[490, 'senza attrito:\n{mv:a}{mink: = g·sin α}'], [960, 'attrito {mink:μ·}{my:N}\n{g:contro} il moto'], [1430, 'la massa\n{g:si semplifica}']];
  pills.forEach(([x, s], i) => {
    const a = 92.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // fermi immagine aggiunti per dare tempo alla voce sulle formule lunghe: [istante del copione, secondi di fermo].
  // Il copione (tutti i tempi qui sopra) resta in «tempo di disegno»; il video vero lo allunga di questi fermi.
  const PAUSE = [[45.0, 3.3], [53.0, 1.5], [63.0, 1.1], [68.0, .7], [73.0, .8], [84.0, 2.3]];
  const reale = td => { let r = td; for (const [x, d] of PAUSE) if (td > x) r += d; return Math.round(r * 100) / 100; };
  const disegno = t => { let s = 0; for (const [x, d] of PAUSE) { if (t < x + s) return t - s; if (t < x + s + d) return x; s += d; } return t - s; };
  const conv = keys => keys.map(([a, v]) => [reale(a), v]);
  const SUONI = [   // istanti già in tempo reale (con i fermi)
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.3, .4], ['pop', 9.4, .45], ['pop', 12.7, .5],          // 20 kg, 30°, ghiaccio
    ['pop', 16.9, .2],                                                                // il peso P
    ['pop', 21.7, .4], ['pop', 22.4, .3], ['pop', 26.9, .7],                          // le due parti, la reazione N
    ['ding', 31.7],                                                                   // resta 98 N lungo il piano
    ['soffio', 36.0], ['pop', 36.2, .45], ['pop', 38.6, .55], ['ding', 41.3],         // m·a = m·g·sin α, a = 4,9 m/s²
    ['tono', 49.1, 53.14, [.94, .91, .84, .73, .57, .36, .1]], ['ding', 53.4],        // la discesa: 10 m in 2,02 s
    ['soffio', 59.2], ['pop', 59.4, .4], ['pop', 63.9, .4],                           // la neve, μ = 0,2, l'attrito
    ['pop', 70.2, .45], ['pop', 76.1, .5], ['ding', 77.2],                            // a = g·(sin α − μ·cos α) ≈ 3,2 m/s²
    ['soffio', 82.2],                                                                 // la gara
    ['tono', 82.4, 86.44, [.94, .91, .84, .73, .57, .36, .1]], ['pop', 86.44, .5],    // sul ghiaccio: 2,02 s
    ['tono', 82.4, 87.4, [.94, .91, .84, .73, .57, .36, .1]], ['ding', 87.4],         // sulla neve: 2,50 s
    ['pop', 94.6, .6],                                                                // la massa si semplifica
    ['soffio', 99.3], ['pop', 101.7, .5], ['pop', 102.2, .6], ['pop', 102.7, .7],     // in una frase
  ];
  return {
    titolo: 'La slitta che scivola', durata: reale(99), copertina: 4.2, suoni: SUONI,
    stilla: {
      posa: { x: conv(POSA.x), y: conv(POSA.y), s: conv(POSA.s), lx: conv(POSA.lx), ly: conv(POSA.ly) },
      facce: conv(FACCIA), fumetti: FUMETTI.map(([a, b, s]) => [reale(a), reale(b), s]),
    },
    capitoli: [[7.5, 35.8, 'il peso lungo il piano'], [35.8, 54.2, 'senza attrito'], [54.2, 89.2, 'con l’attrito']].map(([a, b, n]) => [reale(a), reale(b), n]),
    scena(ctx, t) { const td = disegno(t); sceneIntro(ctx, td); scenePiano(ctx, td); scenePannello(ctx, td); sceneFine(ctx, td); },
  };
});
