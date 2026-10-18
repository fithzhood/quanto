'use strict';
/* Il rendimento massimo — il ciclo di Carnot fra 400 K e 300 K, calcolato davvero (aria, γ = 1,4; n·R = 7,5 J/K):
   A(10 L; 300 kPa) → B(20 L; 150 kPa) isoterma a 400 K, Q ass = 3000·ln 2 ≈ 2080 J; → C(≈ 41,1 L; ≈ 54,8 kPa)
   adiabatica (T·V^0,4 costante); → D(≈ 20,5 L; ≈ 109,6 kPa) isoterma a 300 K, Q ced = 2250·ln 2 ≈ 1560 J;
   → A adiabatica. L ≈ 520 J, η = 0,25 = 1 − 300/400. Poi η = 1 − Tf/Tc in kelvin: 300 K e 600 K → 50%;
   centrale a 800 K e fiume a 300 K → 62,5% al massimo. Argomento: termodinamica. */
CVIDEO.registra('termodinamica/carnot', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, dashed } = M;

const T_FINE = 90.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.6, 'felice'], [20.8, 'neutro'],
  [43.3, 'festa'], [45.5, 'neutro'], [52.1, 'felice'], [54.3, 'neutro'], [67.6, 'felice'], [69.8, 'neutro'],
  [77.7, 'pensa'], [81.9, 'neutro'], [85.9, 'felice'], [88.3, 'neutro'], [92.9, 'felice'], [96.9, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Quanto può rendere, al massimo,\nun motore?'],
  [7.9, 13.3, 'Il motore ideale di {v:Carnot} lavora\nfra due sole sorgenti: 400 K e 300 K.'],
  [13.5, 18.4, 'Il gas, a contatto con quella calda,\nsi espande piano a 400 K…'],
  [18.6, 22.8, '…è un’{v:isoterma}: assorbe\n{y:calore}, circa 2080 J.'],
  [23.0, 28.4, 'Poi lo isolo: si espande ancora senza\ncalore e si raffredda fino a 300 K.'],
  [28.6, 33.3, 'Sulla sorgente fredda lo comprimo\na 300 K: cede circa 1560 J.'],
  [33.5, 38.7, 'Infine lo isolo e lo comprimo:\ntorna a 400 K, nel punto di partenza.'],
  [38.9, 43.1, 'Due isoterme e due adiabatiche,\npercorse in senso orario.'],
  [43.3, 47.5, 'L’area racchiusa è il lavoro:\n{mv:L} ≈ 520 J.'],
  [47.7, 51.9, 'Tutto avviene piano e senza attriti:\nil ciclo è {v:reversibile}.'],
  [52.1, 56.3, '{mink:η} = 520 / 2080 = {g:0,25}:\nil 25%.'],
  [56.5, 61.2, 'E 300 / 400 = 0,75: conta solo\nil rapporto delle temperature.'],
  [61.4, 67.0, 'Per Carnot {mink:η} = 1 − {mink:T} fredda / {mink:T} calda,\ncon le temperature in {v:kelvin}.'],
  [67.6, 72.4, 'Fra 300 K e 600 K:\n{mink:η} = 1 − 300/600 = {g:50%}.'],
  [73.0, 77.5, 'Centrale a 800 K, fiume a 300 K:\nal massimo il {g:62,5%}.'],
  [77.7, 81.7, 'Le centrali vere rendono meno:\nattriti e cicli non reversibili.'],
  [81.9, 85.7, 'Per rendere tanto serve una grande\n{v:differenza} di temperatura.'],
  [85.9, 90.2, 'Nessun motore fra le stesse due\ntemperature rende più di Carnot.'],
  [92.9, 97.9, 'Il massimo fra due temperature:\n{mink:η} = 1 − {mink:T} fredda / {mink:T} calda.'],
];

// ---------- il ciclo: p in kPa, V in litri (kPa · L = J), T = p·V/7,5 ----------
const R43 = (4 / 3) ** 2.5, VA = 10, VB = 20, VC = 20 * R43, VD = 10 * R43;   // VC ≈ 41,06 L, VD ≈ 20,53 L
const TRATTI = [   // [inizio, fine, V iniziale, V finale, p(V)]
  [14.0, 18.0, VA, VB, V => 3000 / V],                      // isoterma a 400 K
  [23.6, 27.8, VB, VC, V => 150 * (VB / V) ** 1.4],          // adiabatica
  [29.2, 33.0, VC, VD, V => 2250 / V],                      // isoterma a 300 K
  [34.1, 38.3, VD, VA, V => 2250 / VD * (VD / V) ** 1.4],    // adiabatica
];
function stato(t) {
  let i = 0; while (i < 3 && t >= TRATTI[i + 1][0]) i++;
  const [a, b, V0, V1, pf] = TRATTI[i], V = t < a && i === 0 ? V0 : lerp(V0, V1, P(t, a, b, E.io));
  return { i, V, p: pf(V), T: pf(V) * V / 7.5 };
}
const tratto = (i, u) => { const [, , V0, V1, pf] = TRATTI[i], pts = []; for (let k = 0; k <= 60; k++) { const V = lerp(V0, V1, u * k / 60); pts.push([V, pf(V)]); } return pts; };

// ---------- aiutanti ----------
function rng(seed) {   // numeri «a caso» sempre uguali (mulberry32)
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let q = Math.imul(a ^ a >>> 15, 1 | a); q = (q + Math.imul(q ^ q >>> 7, 61 | q)) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; };
}
const piega = u => { u = ((u % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // avanti e indietro fra 0 e 1: il rimbalzo
function numero(ctx, s, x, y, size, col, al = 1, align = 'right') {   // cifre a larghezza fissa, con l'unità dopo
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z°]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = align === 'center' ? x - (wu + wc) / 2 : x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
function freccia(ctx, a, b, col, al = 1, w = 6) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.2, L / 22);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 12 * s, b[1] - uy * 12 * s); ctx.stroke();
  arrowHead(ctx, [b[0] - ux * 3 * s, b[1] - uy * 3 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function linea(ctx, pts, col, w, al = 1) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il rendimento massimo', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- il piano p–V: 18 px per litro, 1,5 px per kPa ----------
const OX = 240, OY = 700, KV = 18, KP = 1.5;
const S = (V, p) => [OX + KV * V, OY - KP * p];
function scenaPiano(ctx, t) {
  if (t < 7.5 || t > 61.6) return;
  const al = life(t, 7.6, 61.3, .6, .5);
  card(ctx, 110, 110, 990, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const V of [10, 20, 30, 40]) { ctx.beginPath(); ctx.moveTo(...S(V, 0)); ctx.lineTo(...S(V, 320)); ctx.stroke(); }
  for (let p = 50; p <= 300; p += 50) { ctx.beginPath(); ctx.moveTo(...S(0, p)); ctx.lineTo(...S(44, p)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(45.5, 0)); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(0, 335)); ctx.stroke();
  arrowHead(ctx, [S(45.5, 0)[0] + 6, OY], 0, C.ink); arrowHead(ctx, [OX, S(0, 335)[1] - 6], -Math.PI / 2, C.ink);
  for (const V of [10, 20, 30, 40]) txt(ctx, String(V), S(V, 0)[0], OY + 32, { size: 30, color: C.dim });
  for (const p of [100, 200, 300]) txt(ctx, String(p), OX - 16, S(0, p)[1], { size: 30, color: C.dim, align: 'right' });
  drawRich(ctx, '{mink:p}{dim: (kPa)}', OX + 22, 178, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:V}{dim: (L)}', 1080, OY + 34, { size: 34, align: 'right' });
  // l'area racchiusa: il lavoro del ciclo
  const ka = life(t, 43.5, 61.3, .6, .4);
  if (ka > 0) {
    const pts = [0, 1, 2, 3].flatMap(i => tratto(i, 1)).map(([V, p]) => S(V, p));
    ctx.save(); ctx.globalAlpha *= ka; ctx.fillStyle = css(C.v, .25); ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.restore();
    freccia(ctx, [810, 345], S(15, 185), C.v, ka, 4);
    drawRich(ctx, '{mv:L}{mink: ≈ }{v:520 J}', 830, 330, { size: 40, align: 'left', alpha: ka });
  }
  // il ciclo: prima tratteggiato, poi la strada fatta
  ctx.save(); ctx.globalAlpha *= .5 * P(t, 8.3, 9.3);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
  ctx.beginPath(); [0, 1, 2, 3].flatMap(i => tratto(i, 1)).forEach(([V, p], k) => k ? ctx.lineTo(...S(V, p)) : ctx.moveTo(...S(V, p))); ctx.closePath(); ctx.stroke();
  ctx.restore();
  const st = stato(t);
  for (let i = 0; i < 4; i++) {
    if (t < TRATTI[i][0]) break;
    linea(ctx, tratto(i, P(t, TRATTI[i][0], TRATTI[i][1], E.io)).map(([V, p]) => S(V, p)), C.ink, 6);
  }
  // i nomi delle quattro curve e il verso (orario)
  const kn = P(t, 39.0, 39.6);
  if (kn > 0) {
    ctx.save(); ctx.globalAlpha *= kn;
    drawRich(ctx, '{v:isoterma 400 K}', 560, 330, { size: 30, align: 'left' });
    drawRich(ctx, '{v:adiabatica}', 800, 520, { size: 30, align: 'left' });
    drawRich(ctx, '{v:isoterma 300 K}', 700, 646, { size: 30, align: 'left' });
    drawRich(ctx, '{v:adiabatica}', 468, 420, { size: 30, align: 'right' });
    for (let i = 0; i < 4; i++) {
      const pts = tratto(i, 1).map(([V, p]) => S(V, p)), a = pts[29], b = pts[31];
      arrowHead(ctx, pts[30], Math.atan2(b[1] - a[1], b[0] - a[0]), C.v, 1.3);
    }
    ctx.restore();
  }
  [['A', VA, 300, -26, -22], ['B', VB, 150, 26, -14], ['C', VC, 2250 / VC, 26, -24], ['D', VD, 2250 / VD, -24, 30]].forEach(([n, V, p, dx, dy]) =>
    drawRich(ctx, '{mink:' + n + '}', S(V, p)[0] + dx, S(V, p)[1] + dy, { size: 38, alpha: P(t, 8.6, 9.2) }));
  M.dot(ctx, S(st.V, st.p), C.ink, P(t, 8.4, 8.9, E.back), 11);
  ctx.restore();
}

// ---------- il cilindro e le letture (fino a 52 s); poi le formule ----------
const CL = 1180, CR = 1376, BOT = 716, KH = 10, RM = 8;
const MOL = (() => { const r = rng(9), m = []; for (let i = 0; i < 22; i++) { const a = r() * 2 * Math.PI, v = 130 + 150 * r(); m.push({ ux: r(), uy: r(), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } return m; })();
const DT = .01, NT = Math.ceil(56 / DT) + 2, FX = new Float64Array(NT), FY = new Float64Array(NT);
for (let i = 1; i < NT; i++) {
  const tt = (i - .5) * DT, s = stato(tt), v = Math.sqrt(s.T / 300);
  FX[i] = FX[i - 1] + v / (CR - CL - 2 * RM) * DT; FY[i] = FY[i - 1] + v / (KH * s.V - 2 * RM) * DT;
}
const tab = (A, t) => { const f = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(f); return lerp(A[i], A[i + 1], f - i); };
const NOMI = [[8, 'il gas'], [13.5, 'isoterma a 400 K'], [23.0, 'adiabatica'], [28.6, 'isoterma a 300 K'], [33.5, 'adiabatica'], [38.9, 'il ciclo']];
function piastra(ctx, nome, col, k) {   // la sorgente su cui poggia il cilindro
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(col, .3); ctx.beginPath(); ctx.roundRect(CL - 24, 726, CR - CL + 48, 40, 10); ctx.fill();
  txt(ctx, nome, (CL + CR) / 2, 746, { size: 28, weight: 600 }); ctx.restore();
}
function scenaCilindro(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 1140, 110, 670, 680, life(t, 8.0, T_FINE + .1, .6, .5));
  const al = life(t, 8.0, 52.0, .6, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const [ta, nome] = NOMI.filter(([a]) => a <= t).pop() || NOMI[0];
  conFont(TITOLI, () => drawRich(ctx, nome, 1475, 165, { size: 38, weight: 600, local: t - ta }));
  const st = stato(t), yp = BOT - KH * st.V;
  // le pareti isolanti nelle due adiabatiche
  const ki = Math.max(life(t, 23.1, 28.4, .4, .4), life(t, 33.6, 38.7, .4, .4));
  if (ki > 0) { ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.dim, .35); ctx.lineWidth = 22; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(CL - 15, 290); ctx.lineTo(CL - 15, BOT + 15); ctx.lineTo(CR + 15, BOT + 15); ctx.lineTo(CR + 15, 290); ctx.stroke(); ctx.restore(); }
  piastra(ctx, '400 K', C.y, life(t, 13.6, 22.8, .4, .4));
  piastra(ctx, '300 K', C.x, life(t, 28.7, 33.3, .4, .4));
  ctx.fillStyle = css(C.x, .07); ctx.fillRect(CL, yp, CR - CL, BOT - yp);
  const fx = tab(FX, t), fy = tab(FY, t), lx = CR - CL - 2 * RM, ly = KH * st.V - 2 * RM;
  ctx.fillStyle = css(C.x, .85);
  for (const m of MOL) { ctx.beginPath(); ctx.arc(CL + RM + piega(m.ux + m.vx * fx) * lx, yp + RM + piega(m.uy + m.vy * fy) * ly, RM, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(C.dim); ctx.fillRect(CL, yp - 22, CR - CL, 22); ctx.fillRect((CL + CR) / 2 - 8, yp - 122, 16, 100);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(CL - 4, 290); ctx.lineTo(CL - 4, BOT + 4); ctx.lineTo(CR + 4, BOT + 4); ctx.lineTo(CR + 4, 290); ctx.stroke();
  // il calore che entra dalla sorgente calda ed esce verso la fredda
  const kq = life(t, 14.0, 18.4, .3, .4), kc = life(t, 29.2, 33.3, .3, .4);
  for (const x of [1230, 1278, 1326]) { freccia(ctx, [x, 700], [x, 640], C.y, kq); freccia(ctx, [x, 640], [x, 700], C.y, kc); }
  // le letture
  const riga = (n, v, y) => { drawRich(ctx, n, 1425, y, { size: 36, align: 'left' }); numero(ctx, v, 1785, y, 36, C.ink); };
  riga('{mink:p}', Math.round(st.p) + ' kPa', 250); riga('{mink:V}', M.fmtN(st.V, 1) + ' L', 300); riga('{mink:T}', Math.round(st.T) + ' K', 350);
  const qa = 3000 * Math.log(st.i === 0 ? st.V / VA : 2), qc = st.i < 2 ? 0 : 2250 * Math.log(VC / (st.i === 2 ? st.V : VD));
  const ra = P(t, 14.0, 14.4), rc = P(t, 29.2, 29.6);
  drawRich(ctx, '{y:calore assorbito}', 1425, 430, { size: 30, align: 'left', alpha: ra });
  numero(ctx, '≈ ' + Math.round(qa / 10) * 10 + ' J', 1785, 470, 36, C.y, ra);
  drawRich(ctx, '{y:calore ceduto}', 1425, 530, { size: 30, align: 'left', alpha: rc });
  numero(ctx, '≈ ' + Math.round(qc / 10) * 10 + ' J', 1785, 570, 36, C.y, rc);
  const rl = P(t, 43.5, 44.0);
  drawRich(ctx, '{v:lavoro}', 1425, 630, { size: 30, align: 'left', alpha: rl });
  numero(ctx, '≈ 520 J', 1785, 670, 36, C.v, rl);
  ctx.restore();
}

// ---------- il rendimento: formule (destra) e grafico (sinistra) ----------
function scenaFormule(ctx, t) {
  if (t < 51.8 || t > T_FINE + .3) return;
  const al = life(t, 52.1, T_FINE + .1, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'rendimento', 1475, 165, { size: 38, weight: 600 }));
  drawSeq(ctx, ['{mink:η =}', { num: '{v:520 J}', den: '{y:2080 J}' }, '{mink:=}{g: 0,25}'], 1475, 262, 44, { local: t - 52.3 });
  drawRich(ctx, '{mink:T}{dim: fredda / }{mink:T}{dim: calda = 300 / 400 = 0,75}', 1475, 368, { size: 32, local: t - 56.7 });
  drawRich(ctx, '{dim:e 1 − 0,75 = }{g:0,25}{dim:: lo stesso numero}', 1475, 410, { size: 32, local: t - 57.6 });
  drawSeq(ctx, ['{mink:η = 1 −}', { num: '{mink:T} fredda', den: '{mink:T} calda' }], 1475, 520, 50, { local: t - 61.6 });
  drawRich(ctx, '{dim:temperature in }{v:kelvin}', 1475, 608, { size: 32, local: t - 62.6 });
  drawRich(ctx, '{dim:300 K e 600 K: }{g:50%}', 1475, 676, { size: 34, local: t - 67.8 });
  drawRich(ctx, '{dim:300 K e 800 K: }{g:62,5%}{dim: al massimo}', 1475, 730, { size: 34, local: t - 73.2 });
  ctx.restore();
}
// η in funzione della temperatura calda, con la fredda a 300 K: η = 1 − 300/Tc
const GX = Tc => 260 + (Tc - 300) * .65, GY = e => 690 - e * 440;
const eta = Tc => 1 - 300 / Tc;
const TC = t => kf(t, [[61.4, 400], [67.0, 400], [67.6, 600], [72.4, 600], [73.0, 800], [81.9, 800], [84.5, 1500]]);
function scenaGrafico(ctx, t) {
  if (t < 61.0 || t > T_FINE + .3) return;
  const al = life(t, 61.4, T_FINE + .1, .5, .5);
  card(ctx, 110, 110, 990, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{dim:con }{mink:T}{dim: fredda = 300 K}', 640, 165, { size: 34 });
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const e of [.25, .5, .75]) { ctx.beginPath(); ctx.moveTo(GX(300), GY(e)); ctx.lineTo(GX(1500), GY(e)); ctx.stroke(); }
  for (const T of [600, 900, 1200, 1500]) { ctx.beginPath(); ctx.moveTo(GX(T), GY(0)); ctx.lineTo(GX(T), GY(1)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX(300), GY(0)); ctx.lineTo(GX(1560), GY(0)); ctx.moveTo(GX(300), GY(0)); ctx.lineTo(GX(300), GY(1.1)); ctx.stroke();
  arrowHead(ctx, [GX(1560) + 6, GY(0)], 0, C.ink); arrowHead(ctx, [GX(300), GY(1.1) - 6], -Math.PI / 2, C.ink);
  for (const T of [300, 600, 900, 1200, 1500]) txt(ctx, String(T), GX(T), GY(0) + 32, { size: 30, color: C.dim });
  for (const e of [.25, .5, .75]) txt(ctx, Math.round(e * 100) + '%', GX(300) - 14, GY(e), { size: 30, color: C.dim, align: 'right' });
  drawRich(ctx, '{mink:T}{dim: calda (K)}', 1080, GY(0) + 66, { size: 30, align: 'right' });
  drawRich(ctx, '{mink:η}', GX(300) + 26, GY(1.1) - 4, { size: 40, align: 'left' });
  // il 100%: irraggiungibile
  dashed(ctx, [GX(300), GY(1)], [GX(1500), GY(1)], C.r, 1, .8);
  drawRich(ctx, '{r:100%: mai}', GX(1500), GY(1) - 26, { size: 30, align: 'right' });
  // la zona sopra la curva: nessun motore ci arriva
  const kz = life(t, 86.3, T_FINE + .1, .5, .4);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz; ctx.fillStyle = css(C.r, .12); ctx.beginPath(); ctx.moveTo(GX(300), GY(1));
    for (let T = 300; T <= 1500; T += 20) ctx.lineTo(GX(T), GY(eta(T)));
    ctx.lineTo(GX(1500), GY(1)); ctx.closePath(); ctx.fill(); ctx.restore();
    drawRich(ctx, '{r:nessun motore qui}', 470, 292, { size: 34, align: 'left', alpha: kz });
  }
  const pts = []; for (let T = 300; T <= 1500; T += 10) pts.push([GX(T), GY(eta(T))]);
  M.glowStroke(ctx, pts, P(t, 61.6, 62.8), C.g, 5);
  // il punto che scorre sulla curva
  const Tc = TC(t), e = eta(Tc), kp = P(t, 62.6, 63.0);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp;
    dashed(ctx, [GX(Tc), GY(0)], [GX(Tc), GY(e)], C.dim, 1, .8); dashed(ctx, [GX(300), GY(e)], [GX(Tc), GY(e)], C.dim, 1, .8);
    M.dot(ctx, [GX(Tc), GY(e)], C.g, 1, 11);
    const tq = Math.round(Tc), et = Math.round(e * 1000) / 10;
    const dx = Tc > 1100 ? -22 : 22;
    drawRich(ctx, '{dim:' + tq + ' K: }{g:' + String(et).replace('.', ',') + '%}', GX(Tc) + dx, GY(e) + (dx < 0 ? 72 : 40), { size: 32, align: dx < 0 ? 'right' : 'left' });
    ctx.restore();
  }
  // le centrali vere: sotto la curva
  const kv = life(t, 77.8, 81.7, .4, .4);
  if (kv > 0) { freccia(ctx, [GX(800) - 30, GY(eta(800)) + 20], [GX(800) - 30, GY(eta(800)) + 130], C.dim, kv, 5); drawRich(ctx, '{dim:centrali vere: meno}', GX(800) + 22, GY(eta(800)) + 125, { size: 30, align: 'left', alpha: kv }); }
  ctx.restore();
}

// in una frase (90,4–100,5)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 98.4, 99.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 90.6 });
    drawRich(ctx, 'Fra due temperature si arriva al massimo a\n{mink:η = 1 − T}{ink: fredda / }{mink:T}{ink: calda}.', W / 2, 290, { size: 64, weight: 600, local: t - 91.0, stagger: .09 });
  });
  const pills = [[490, 'due {v:isoterme} e\ndue {v:adiabatiche}'], [960, 'temperature\nin {v:kelvin}'], [1430, 'più {v:differenza},\npiù rendimento']];
  pills.forEach(([x, s], i) => {
    const a = 93.1 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): nel ciclo il tono segue la pressione, da 0 (0) a 320 kPa (1);
  // nel grafico del rendimento segue η, da 0 (0) a 100% (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.3, 9.3], ['pop', 8.6, .94],                        // il ciclo tratteggiato, A B C D
    ['traccia', 14.0, 18.0], ['tono', 14.0, 18.0, [.94, .91, .75, .54, .48, .47]],    // isoterma a 400 K: assorbe calore
    ['traccia', 23.6, 27.8], ['tono', 23.6, 27.8, [.47, .45, .34, .21, .18, .17]],    // adiabatica: si raffredda
    ['traccia', 29.2, 33.0], ['tono', 29.2, 33.0, [.17, .17, .2, .27, .33, .34]],     // isoterma a 300 K: cede calore
    ['traccia', 34.1, 38.3], ['tono', 34.1, 38.3, [.34, .35, .42, .67, .9, .94]], ['pop', 38.35, .94],   // adiabatica: torna in A
    ['pop', 39.1, .5],                                                                // due isoterme, due adiabatiche
    ['soffio', 52.1], ['pop', 52.4, .5], ['ding', 53.3],                              // il rendimento: 0,25
    ['pop', 56.8, .45], ['pop', 57.7, .5],                                            // 300/400 = 0,75: lo stesso numero
    ['soffio', 61.4], ['pop', 61.8, .6],                                              // η = 1 − T fredda / T calda
    ['traccia', 61.6, 62.8], ['tono', 61.6, 62.8, [0, .11, .51, .75, .79, .8]], ['pop', 62.7, .25],   // la curva, il punto a 400 K
    ['tono', 67.0, 67.6, [.25, .3, .47, .5]], ['pop', 67.9, .5],                      // 600 K: 50%
    ['tono', 72.4, 73.0, [.5, .52, .61, .63]], ['pop', 73.3, .63],                    // 800 K: 62,5%
    ['traccia', 77.8, 78.2],                                                          // le centrali vere: meno
    ['tono', 81.9, 84.5, [.63, .67, .79, .8]],                                        // più differenza, più rendimento
    ['pop', 86.4, .85],                                                               // nessun motore sopra la curva
    ['soffio', 90.6], ['pop', 93.1, .5], ['pop', 93.6, .6], ['pop', 94.1, .7],        // in una frase
  ];
  return {
    titolo: 'Il rendimento massimo', durata: 100.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 52.0, 'il ciclo di Carnot'], [52.0, T_FINE, 'il rendimento']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPiano(ctx, t); scenaGrafico(ctx, t); scenaCilindro(ctx, t); scenaFormule(ctx, t); scenaFine(ctx, t); },
  };
});
