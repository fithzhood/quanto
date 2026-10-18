'use strict';
/* Quattro strade sul piano p–V — dallo stesso stato A (200 kPa, 10 L, 300 K; n ≈ 0,80 mol d'aria, cv = 5/2·R,
   γ = 1,4) quattro trasformazioni: isobara fino a 20 L (L = p·ΔV = 2000 J), isocora fino a 300 kPa (L = 0,
   ΔU = Q = 2500 J), isoterma fino a 20 L (p·V costante, L = Q ≈ 1390 J), adiabatica fino a 20 L (p·V^γ costante,
   Q = 0, L ≈ 1210 J, 227 K). Curve calcolate con p·V = n·R·T; il lavoro è l'area sotto la curva.
   Unità comode: kPa · L = J. Argomento: termodinamica. */
CVIDEO.registra('termodinamica/trasformazioni', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, richW, card, arrowHead } = M;

const T_FINE = 98.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [27.6, 'felice'], [32.0, 'neutro'],
  [46.4, 'sorpreso'], [48.6, 'neutro'], [61.0, 'felice'], [63.4, 'neutro'], [75.3, 'pensa'], [79.7, 'neutro'],
  [84.6, 'sorpreso'], [89.2, 'freddo'], [94.4, 'felice'], [96.6, 'neutro'], [101.1, 'felice'], [105.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Quanto lavoro fa un gas\nche si espande?'],
  [7.9, 12.8, 'Pressione {mink:p} in su, volume {mink:V}\na destra: ogni stato è un punto.'],
  [13.0, 17.7, 'Il gas è nel punto {mink:A}:\n200 kPa, 10 L, 300 K.'],
  [17.9, 22.8, '{mv:L} lavoro fatto dal gas, {my:Q} calore\nassorbito: {mink:Δ}{mg:U} = {my:Q} − {mv:L}.'],
  [23.0, 27.4, 'Scaldo e lascio salire il pistone:\nla pressione resta 200 kPa.'],
  [27.6, 31.8, 'È un’{v:isobara}: pressione costante.\nIl volume è raddoppiato.'],
  [32.0, 36.7, '{mv:L} = {mink:p·Δ}{mink:V} = 200 kPa · 10 L\n= {g:2000 J}.'],
  [36.9, 41.3, 'È l’{v:area} sotto la linea,\npositiva perché il gas si espande.'],
  [41.5, 46.2, 'Torno in {mink:A}. Ora blocco il pistone\ne scaldo: sale la pressione.'],
  [46.4, 50.6, 'È un’{v:isocora}: volume costante.\nSotto una linea verticale, area zero.'],
  [50.8, 55.7, 'Quindi {mv:L} = 0: tutto il calore\ndiventa energia interna, {mink:Δ}{mg:U} = {my:Q}.'],
  [55.9, 60.8, 'Da {mink:A}, a contatto con un bagno\na 300 K, si espande piano.'],
  [61.0, 65.2, 'È un’{v:isoterma}: {mink:T} costante,\nquindi {mink:p·V} costante. Un’iperbole.'],
  [65.4, 69.7, 'Area sotto la curva: {mv:L} ≈ 1390 J,\nmeno dell’isobara.'],
  [69.9, 75.1, '{mink:T} non cambia: {mink:Δ}{mg:U} = 0.\nIl calore diventa tutto lavoro: {my:Q} = {mv:L}.'],
  [75.3, 79.5, 'Ultima strada: pareti isolanti.\nNessun calore, {my:Q} = 0.'],
  [79.7, 84.4, 'Da {mink:A} fino a 20 L: la pressione\nscende più che nell’isoterma.'],
  [84.6, 89.0, 'È l’{v:adiabatica}: resta costante\n{mink:p·V} elevato a {mink:γ} = 1,4 (aria).'],
  [89.2, 94.2, '{mv:L} ≈ 1210 J, pagato da {mg:U}:\nil gas scende a 227 K.'],
  [94.4, 98.4, 'Quattro strade dallo stesso punto:\naree diverse, lavori diversi.'],
  [101.1, 106.1, 'Il lavoro di un gas è l’{v:area}\nsotto la sua strada nel piano {mink:p}–{mink:V}.'],
];

// ---------- la fisica: p in kPa, V in litri (kPa · L = J); T = p·V/(n·R) = 0,15·p·V ----------
const TK = (p, V) => .15 * p * V;
const STRADE = [   // nome, inizio e fine del moto, fine della fase, stato in funzione dell'avanzamento u
  { nome: 'isobara', a: 23.5, b: 27.0, da: 23.0, fino: 41.5,
    st: u => { const V = 10 + 10 * u, L = 200 * (V - 10); return { p: 200, V, L, Q: 3.5 * L, dU: 2.5 * L }; },
    curva: V => 200, V1: 20 },
  { nome: 'isocora', a: 42.3, b: 45.8, da: 41.5, fino: 55.9,
    st: u => { const p = 200 + 100 * u, dU = 25 * (p - 200); return { p, V: 10, L: 0, Q: dU, dU }; } },
  { nome: 'isoterma', a: 56.4, b: 60.4, da: 55.9, fino: 75.3,
    st: u => { const V = 10 + 10 * u, L = 2000 * Math.log(V / 10); return { p: 2000 / V, V, L, Q: L, dU: 0 }; },
    curva: V => 2000 / V, V1: 20 },
  { nome: 'adiabatica', a: 80.0, b: 84.0, da: 75.3, fino: 200,
    st: u => { const V = 10 + 10 * u, p = 200 * (10 / V) ** 1.4, L = (2000 - p * V) / .4; return { p, V, L, Q: 0, dU: -L }; },
    curva: V => 200 * (10 / V) ** 1.4, V1: 20 },
];
function stato(t) {
  const i = STRADE.findIndex(s => t >= s.da && t < s.fino);
  if (i < 0) return { i, p: 200, V: 10, L: 0, Q: 0, dU: 0, T: 300 };
  const s = STRADE[i].st(P(t, STRADE[i].a, STRADE[i].b, E.io));
  return Object.assign(s, { i, T: TK(s.p, s.V) });
}

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
// joule arrotondati a 10, col segno meno vero; «≈» solo se l'arrotondamento cambia il numero
const joule = v => { const r = Math.round(v / 10) * 10; return (Math.abs(r - v) > .5 ? '≈ ' : '') + (r < 0 ? '−' : '') + Math.abs(r) + ' J'; };
function linea(ctx, pts, col, w, al = 1) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
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

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Quattro strade sul piano {mink:p}–{mink:V}', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- il piano p–V: 34 px per litro, 1,6 px per kPa ----------
const OX = 250, OY = 700, KV = 34, KP = 1.6;
const S = (V, p) => [OX + KV * V, OY - KP * p];
const NOMI_T = [27.6, 46.4, 61.0, 84.6];                        // quando Stilla dice il nome della strada
const ETICHETTE = [[20, 200, 0], [10, 300, 0], [20, 100, 0], [20, 200 * .5 ** 1.4, 12]];   // dove sta il nome (V, p, spostamento in giù)
function tratto(i, u) {   // la strada i da A fino all'avanzamento u
  const s = STRADE[i], pts = [];
  if (!s.curva) return [S(10, 200), S(10, 200 + 100 * u)];
  for (let k = 0; k <= 60; k++) { const V = 10 + 10 * u * k / 60; pts.push(S(V, s.curva(V))); }
  return pts;
}
function area(ctx, i, al) {   // l'area sotto la strada i, fino all'asse V
  if (al <= 0) return;
  const pts = tratto(i, 1).concat([S(20, 0), S(10, 0)]);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.v, .2);
  ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function assi(ctx) {
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const V of [5, 10, 15, 20]) { ctx.beginPath(); ctx.moveTo(...S(V, 0)); ctx.lineTo(...S(V, 310)); ctx.stroke(); }
  for (let p = 50; p <= 300; p += 50) { ctx.beginPath(); ctx.moveTo(...S(0, p)); ctx.lineTo(...S(24, p)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(24.6, 0)); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(0, 322)); ctx.stroke();
  arrowHead(ctx, [S(24.6, 0)[0] + 6, OY], 0, C.ink); arrowHead(ctx, [OX, S(0, 322)[1] - 6], -Math.PI / 2, C.ink);
  for (const V of [5, 10, 15, 20]) txt(ctx, String(V), S(V, 0)[0], OY + 32, { size: 30, color: C.dim });
  for (let p = 50; p <= 300; p += 50) txt(ctx, String(p), OX - 16, S(0, p)[1], { size: 30, color: C.dim, align: 'right' });
  drawRich(ctx, '{mink:p}{dim: (kPa)}', OX + 22, 176, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:V}{dim: (L)}', 1112, OY + 34, { size: 34, align: 'right' });
}
function scenaPiano(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5), st = stato(t), kSom = P(t, 94.4, 95.0);
  card(ctx, 110, 110, 1040, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.save(); ctx.globalAlpha *= P(t, 7.8, 8.6); assi(ctx); ctx.restore();
  // le aree, ciascuna mentre se ne parla
  area(ctx, 0, life(t, 37.0, 41.3, .6, .4));
  area(ctx, 2, life(t, 65.5, 75.1, .6, .4));
  area(ctx, 3, life(t, 89.3, 94.2, .6, .4));
  // le strade: quella in corso si disegna col punto; quelle finite restano chiare; alla fine tutte e quattro
  STRADE.forEach((s, i) => {
    if (t < s.a) return;
    const corrente = i === st.i, fatta = t >= s.fino;
    const u = corrente ? P(t, s.a, s.b, E.io) : 1;
    const col = corrente ? C.ink : C.dim;   // txt rifà css da sé
    const pts = tratto(i, u);
    if (corrente) linea(ctx, pts, C.ink, 6);
    else if (fatta) { linea(ctx, pts, C.dim, 4, .55 * (1 - kSom)); linea(ctx, pts, C.ink, 5, kSom); }
    const [eV, eP, giu] = ETICHETTE[i], [ex, ey] = S(eV, eP);
    const kn = P(t, NOMI_T[i], NOMI_T[i] + .5);
    if (kn > 0) txt(ctx, s.nome, ex + 20, ey + giu, { size: 30, weight: 600, color: corrente || kSom > .5 ? C.v : col, align: 'left', alpha: kn * (corrente ? 1 : lerp(.7, 1, kSom)) });
    if (corrente) M.dot(ctx, pts[pts.length - 1], C.ink, 1, 11);
  });
  // il punto A
  const ka = P(t, 13.2, 13.7, E.back);
  if (ka > 0) { M.dot(ctx, S(10, 200), C.ink, ka, 11); drawRich(ctx, '{mink:A}', S(10, 200)[0] - 30, S(10, 200)[1] + 30, { size: 40, alpha: ka }); }
  // isobara: ΔV e L = p·ΔV
  const kd = life(t, 32.2, 41.3, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    const y = OY - 34, a = S(10, 0)[0] + 6, b = S(20, 0)[0] - 6;
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a + 10, y); ctx.lineTo(b - 10, y); ctx.stroke();
    arrowHead(ctx, [a, y], Math.PI, C.ink, .8); arrowHead(ctx, [b, y], 0, C.ink, .8);
    drawRich(ctx, '{mink:Δ}{mink:V} = 10 L', (a + b) / 2, y - 34, { size: 34 });
    drawRich(ctx, '{mv:L} = 2000 J', (a + b) / 2, 520, { size: 40, local: t - 32.4 });
    ctx.restore();
  }
  // isocora: sotto una linea verticale non c'è area
  drawRich(ctx, '{v:area zero}', S(10, 0)[0] + 22, S(0, 250)[1], { size: 32, align: 'left', alpha: life(t, 46.6, 55.7, .4, .4) });
  drawRich(ctx, '{mv:L} ≈ 1390 J', S(15, 0)[0], 630, { size: 40, alpha: life(t, 65.6, 75.1, .4, .4) });
  drawRich(ctx, '{mv:L} ≈ 1210 J', S(15, 0)[0], 630, { size: 40, alpha: life(t, 89.4, 94.2, .4, .4) });
  ctx.restore();
}

// ---------- il cilindro: 20 px per litro, molecole con velocità ∝ √T ----------
const CL = 1232, CR = 1428, BOT = 716, KH = 20, RM = 8;
const MOL = (() => { const r = rng(11), m = []; for (let i = 0; i < 22; i++) { const a = r() * 2 * Math.PI, v = 140 + 160 * r(); m.push({ ux: r(), uy: r(), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } return m; })();
const DT = .01, NT = Math.ceil(112 / DT) + 2, FX = new Float64Array(NT), FY = new Float64Array(NT);
for (let i = 1; i < NT; i++) {
  const tt = (i - .5) * DT, s = stato(tt), v = Math.sqrt(s.T / 300);
  FX[i] = FX[i - 1] + v / (CR - CL - 2 * RM) * DT; FY[i] = FY[i - 1] + v / (KH * s.V - 2 * RM) * DT;
}
const tab = (A, t) => { const f = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(f); return lerp(A[i], A[i + 1], f - i); };
const RESET = [41.5, 55.9, 75.3];
function fiamma(ctx, t, k) {
  if (k <= 0) return;
  for (let i = 0; i < 5; i++) {
    const cx = CL + 20 + i * (CR - CL - 40) / 4, hf = (22 + 5 * Math.sin(t * 17 + i * 2)) * k;
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.moveTo(cx, 756 - hf); ctx.quadraticCurveTo(cx + 11, 752, cx, 756); ctx.quadraticCurveTo(cx - 11, 752, cx, 756 - hf); ctx.fill();
  }
}
function scenaCilindro(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 8.0, T_FINE + .1, .6, .5), st = stato(t), yp = BOT - KH * st.V;
  card(ctx, 1190, 110, 620, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const nome = t < 23.0 ? 'il gas' : t >= 94.4 ? 'il lavoro' : STRADE[st.i].nome;
  conFont(TITOLI, () => drawRich(ctx, nome, 1500, 165, { size: 38, weight: 600, local: t - [8, 23.0, 41.5, 55.9, 75.3, 94.4].filter(x => x <= t).pop() }));
  const dip = Math.min(...RESET.map(r => clamp(Math.abs(t - r) / .3)));   // al ritorno in A il cilindro sfuma un attimo
  // il bagno a 300 K (isoterma) e le pareti isolanti (adiabatica), dietro al cilindro
  const kb = life(t, 55.9, 75.3, .4, .4);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb; ctx.fillStyle = css(C.x, .16); ctx.beginPath(); ctx.roundRect(CL - 34, 540, CR - CL + 68, 196, 14); ctx.fill(); ctx.restore();
    txt(ctx, 'bagno a 300 K', (CL + CR) / 2, 762, { size: 30, color: C.x, alpha: kb });
    for (const [a, b] of [[[CL - 30, 660], [CL - 6, 660]], [[CR + 30, 660], [CR + 6, 660]]]) freccia(ctx, a, b, C.y, kb * life(t, 56.3, 60.8, .3, .3), 5);
  }
  const ki = life(t, 75.3, T_FINE + .1, .4, .4);
  if (ki > 0) {
    ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.dim, .35); ctx.lineWidth = 22; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(CL - 15, 200); ctx.lineTo(CL - 15, BOT + 15); ctx.lineTo(CR + 15, BOT + 15); ctx.lineTo(CR + 15, 200); ctx.stroke(); ctx.restore();
    txt(ctx, 'pareti isolanti', (CL + CR) / 2, 764, { size: 30, color: C.dim, alpha: ki });
  }
  // il gas e le molecole
  ctx.save(); ctx.globalAlpha *= dip;
  ctx.fillStyle = css(C.x, .07); ctx.fillRect(CL, yp, CR - CL, BOT - yp);
  const fx = tab(FX, t), fy = tab(FY, t), lx = CR - CL - 2 * RM, ly = KH * st.V - 2 * RM;
  ctx.fillStyle = css(C.x, .85);
  for (const m of MOL) { ctx.beginPath(); ctx.arc(CL + RM + piega(m.ux + m.vx * fx) * lx, yp + RM + piega(m.uy + m.vy * fy) * ly, RM, 0, Math.PI * 2); ctx.fill(); }
  // il pistone con l'asta; nell'isocora due fermi lo bloccano
  ctx.fillStyle = css(C.dim); ctx.fillRect(CL, yp - 22, CR - CL, 22); ctx.fillRect((CL + CR) / 2 - 8, yp - 140, 16, 118);
  const kf = life(t, 41.6, 55.9, .4, .4);
  if (kf > 0) { ctx.save(); ctx.globalAlpha *= kf; ctx.fillStyle = css(C.ink); ctx.fillRect(CL - 14, yp - 40, 40, 14); ctx.fillRect(CR - 26, yp - 40, 40, 14); ctx.restore(); }
  ctx.restore();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(CL - 4, 200); ctx.lineTo(CL - 4, BOT + 4); ctx.lineTo(CR + 4, BOT + 4); ctx.lineTo(CR + 4, 200); ctx.stroke();
  // la fiamma: calore che entra (isobara e isocora)
  fiamma(ctx, t, Math.max(life(t, 23.1, 27.4, .3, .4), life(t, 41.8, 46.2, .3, .4)));
  // le letture
  const kr = P(t, 13.2, 13.7) * (1 - kSomma(t));
  const riga = (nome, val, y, col, k) => { if (k <= 0) return; drawRich(ctx, nome, 1478, y, { size: 36, align: 'left', alpha: k }); numero(ctx, val, 1790, y, 36, col, k); };
  riga('{mink:p}', Math.round(st.p) + ' kPa', 250, C.ink, kr);
  riga('{mink:V}', M.fmtN(st.V, 1) + ' L', 300, C.ink, kr);
  riga('{mink:T}', Math.round(st.T) + ' K', 350, C.ink, kr);
  const ke = P(t, 18.0, 18.5) * (1 - kSomma(t));
  riga('{mv:L}', joule(st.L), 430, C.v, ke);
  riga('{my:Q}', joule(st.Q), 480, C.y, ke);
  riga('{mink:Δ}{mg:U}', joule(st.dU), 530, C.g, ke);
  // alla fine: il lavoro di ciascuna strada
  const ks = kSomma(t);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks;
    drawRich(ctx, '{dim:fatto dal gas}', 1630, 250, { size: 30 });
    [['isobara', '2000 J'], ['isocora', '0 J'], ['isoterma', '≈ 1390 J'], ['adiabatica', '≈ 1210 J']].forEach(([n, v], i) => {
      txt(ctx, n, 1478, 305 + i * 56, { size: 30, color: C.ink, align: 'left' }); numero(ctx, v, 1790, 305 + i * 56, 32, C.v);
    });
    ctx.restore();
  }
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.save(); ctx.globalAlpha *= P(t, 18.0, 18.5);
  ctx.beginPath(); ctx.moveTo(1478, 572); ctx.lineTo(1790, 572); ctx.stroke();
  drawRich(ctx, '{mink:Δ}{mg:U}{mink: = }{my:Q}{mink: − }{mv:L}', 1634, 620, { size: 44, local: t - 18.2 });
  drawRich(ctx, '{my:Q}{dim: calore assorbito}', 1634, 670, { size: 30, local: t - 18.6 });
  drawRich(ctx, '{mv:L}{dim: fatto dal gas}', 1634, 712, { size: 30, local: t - 18.9 });
  ctx.restore();
  // la legge dell'adiabatica, con γ in apice
  const kg = life(t, 84.8, 94.2, .4, .4);
  if (kg > 0) {
    const s1 = '{mink:p·V}', w1 = richW(ctx, s1, 40), sg = '{mink:γ}', wg = richW(ctx, sg, 30), s2 = '{dim: costante}', w2 = richW(ctx, s2, 30);
    const x0 = 1634 - (w1 + 3 + wg + 4 + w2) / 2;
    drawRich(ctx, s1, x0, 760, { size: 40, align: 'left', alpha: kg });
    drawRich(ctx, sg, x0 + w1 + 3, 745, { size: 30, align: 'left', alpha: kg });
    drawRich(ctx, s2, x0 + w1 + 3 + wg + 4, 760, { size: 30, align: 'left', alpha: kg });
  }
  ctx.restore();
}
const kSomma = t => P(t, 94.4, 95.0);

// in una frase (98,6–108,7)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 106.6, 107.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.8 });
    drawRich(ctx, 'Il lavoro di un gas è l’{v:area}\nsotto la sua strada nel piano {mink:p}–{mink:V}.', W / 2, 290, { size: 68, weight: 600, local: t - 99.2, stagger: .09 });
  });
  const pills = [[490, '{v:isobara}: {mink:p} costante\n{mv:L} = {mink:p·Δ}{mink:V}'], [960, '{v:isocora}: {mink:V} costante\n{mv:L} = 0'], [1430, '{v:isoterma}: {mink:Δ}{mg:U} = 0\n{v:adiabatica}: {my:Q} = 0']];
  pills.forEach(([x, s], i) => {
    const a = 101.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): lungo le strade il tono segue la pressione, da 0 (0) a 300 kPa (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 7.8, 8.6],                                           // il piano p–V
    ['pop', 13.3, .67], ['pop', 18.1, .5],                                            // il punto A; L, Q e ΔU
    ['traccia', 23.5, 27.0], ['tono', 23.5, 27.0, [.67, .67]],                        // isobara: pressione costante
    ['traccia', 32.2, 32.6], ['ding', 33.0], ['pop', 37.1, .4],                       // L = p·ΔV = 2000 J; l'area
    ['pop', 41.6, .67],                                                               // di nuovo in A
    ['traccia', 42.3, 45.8], ['tono', 42.3, 45.8, [.67, .69, .83, .98, 1]],           // isocora: sale la pressione
    ['pop', 46.7, .3],                                                                // area zero
    ['pop', 56.0, .67],                                                               // di nuovo in A, nel bagno
    ['traccia', 56.4, 60.4], ['tono', 56.4, 60.4, [.67, .65, .53, .38, .34, .33]],    // isoterma: un'iperbole
    ['pop', 65.7, .45],                                                               // L ≈ 1390 J
    ['pop', 75.4, .5],                                                                // pareti isolanti
    ['traccia', 80.0, 84.0], ['tono', 80.0, 84.0, [.67, .64, .48, .31, .26, .25]],    // adiabatica: scende di più
    ['pop', 84.9, .55], ['pop', 89.5, .4],                                            // p·V^γ costante; L ≈ 1210 J
    ['pop', 94.6, .6], ['ding', 95.1],                                                // quattro strade, quattro lavori
    ['soffio', 98.8], ['pop', 101.3, .5], ['pop', 101.8, .6], ['pop', 102.3, .7],     // in una frase
  ];
  return {
    titolo: 'Quattro strade sul piano p–V', durata: 108.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.9, 'il piano p–V'], [22.9, 41.4, 'isobara'], [41.4, 55.8, 'isocora'], [55.8, 75.2, 'isoterma'], [75.2, T_FINE, 'adiabatica']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPiano(ctx, t); scenaCilindro(ctx, t); scenaFine(ctx, t); },
  };
});
