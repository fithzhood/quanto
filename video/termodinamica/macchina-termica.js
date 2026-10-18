'use strict';
/* Il motore che non rende tutto — un gas (aria, cv = 5/2·R, cp = 7/2·R) percorre in senso orario il ciclo
   A(10 L; 100 kPa) → B(10 L; 300 kPa) → C(20 L; 300 kPa) → D(20 L; 100 kPa) → A. Con kPa · L = J:
   Q(AB) = 5/2·V·Δp = 5000 J, Q(BC) = 7/2·p·ΔV = 10 500 J → assorbiti 15 500 J; ceduti 10 000 + 3500 = 13 500 J;
   L netto = area racchiusa = 200 kPa · 10 L = 2000 J; ΔU = 0 sul giro; η = 2000/15 500 ≈ 0,13.
   Temperature (n fisso, T = 0,3·p·V): 300 K, 900 K, 1800 K, 600 K. Argomento: termodinamica. */
CVIDEO.registra('termodinamica/macchina-termica', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, crossMark } = M;

const T_FINE = 98.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [29.8, 'felice'], [32.0, 'neutro'],
  [38.8, 'festa'], [41.0, 'neutro'], [73.9, 'sorpreso'], [76.1, 'neutro'], [84.2, 'pensa'], [88.9, 'neutro'],
  [93.6, 'felice'], [96.0, 'neutro'], [100.6, 'felice'], [104.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Un motore brucia carburante: quanta\nenergia diventa lavoro?'],
  [7.9, 13.1, 'Un gas in un cilindro fa un {v:ciclo}:\nalla fine torna sempre in {mink:A}.'],
  [13.3, 18.8, 'Da {mink:A} a {mink:B} e poi a {mink:C} il gas\n{y:assorbe calore} e si scalda.'],
  [19.0, 24.2, 'Da {mink:C} a {mink:D} e di nuovo ad {mink:A}\n{y:cede calore} e si raffredda.'],
  [24.4, 29.6, 'Il giro è in senso {v:orario}: si espande\nin alto, si comprime in basso.'],
  [29.8, 34.2, 'In alto il gas fa lavoro:\nl’area sotto {mink:BC}, 3000 J.'],
  [34.4, 38.6, 'In basso lo subisce:\nl’area sotto {mink:DA}, 1000 J.'],
  [38.8, 43.5, 'Resta l’area {v:racchiusa}: il lavoro\nnetto del ciclo, {mv:L} = 2000 J.'],
  [43.7, 48.6, 'Tornato in {mink:A} ha la stessa temperatura:\nin un ciclo {mink:Δ}{mg:U} = 0.'],
  [48.8, 54.0, 'Il bilancio di un giro: dalla parte\ncalda entrano 15 500 J di {y:calore}…'],
  [54.2, 58.4, '…ne escono 2000 J di {v:lavoro}…'],
  [58.6, 62.8, '…e 13 500 J vanno\nalla parte fredda.'],
  [63.0, 69.2, 'Con {mink:Δ}{mg:U} = 0 il lavoro è il calore\nnetto: 15 500 − 13 500 = 2000 J.'],
  [69.4, 73.7, 'Il {v:rendimento} {mink:η} è il lavoro\ndiviso il calore assorbito.'],
  [73.9, 78.4, '{mink:η} = 2000 / 15 500 ≈ {g:0,13}:\nsolo il 13%.'],
  [78.6, 84.0, 'Oppure {mink:η} = 1 − 13 500 / 15 500:\nuno meno ceduto su assorbito.'],
  [84.2, 88.7, 'E se non cedesse niente\nal freddo? Sarebbe {mink:η} = 1.'],
  [88.9, 93.5, '{r:Impossibile}: un motore deve sempre\ncedere calore a qualcosa di più freddo.'],
  [93.6, 97.9, 'Lo dice il {v:secondo principio}:\n{mink:η} è sempre minore di 1.'],
  [100.6, 105.6, 'Un motore trasforma in lavoro solo\nuna parte del calore: {mink:η} < 1.'],
];

// ---------- il ciclo: p in kPa, V in litri; T = 0,3·p·V (300 K in A) ----------
const VERTICI = [[10, 100], [10, 300], [20, 300], [20, 100]];   // A, B, C, D
const TRATTI = [[13.8, 15.8], [16.0, 18.4], [19.5, 21.5], [21.7, 23.9]];   // A→B, B→C, C→D, D→A
const sCiclo = t => { let s = 0; TRATTI.forEach(([a, b]) => { s += P(t, a, b, E.io); }); return s; };   // 0…4
function punto(s) {   // lo stato a metà del giro: s = 1,5 è a metà fra B e C
  const i = Math.min(3, Math.floor(s)), u = s - i, a = VERTICI[i], b = VERTICI[(i + 1) % 4];
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
}
const TK = (V, p) => .3 * p * V;

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
// una freccia larga come un nastro (diagramma di flusso): w in pixel, proporzionale all'energia
function nastro(ctx, a, b, w, col, k, al = 1) {
  if (k <= 0 || al <= 0) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) * k, ux = dx / Math.hypot(dx, dy), uy = dy / Math.hypot(dx, dy);
  const nx = -uy, ny = ux, pt = Math.max(26, w * .45), ex = a[0] + ux * L, ey = a[1] + uy * L, bx = ex - ux * pt, by = ey - uy * pt;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col);
  ctx.beginPath();
  ctx.moveTo(a[0] + nx * w / 2, a[1] + ny * w / 2); ctx.lineTo(bx + nx * w / 2, by + ny * w / 2); ctx.lineTo(bx + nx * (w / 2 + 14), by + ny * (w / 2 + 14));
  ctx.lineTo(ex, ey); ctx.lineTo(bx - nx * (w / 2 + 14), by - ny * (w / 2 + 14)); ctx.lineTo(bx - nx * w / 2, by - ny * w / 2); ctx.lineTo(a[0] - nx * w / 2, a[1] - ny * w / 2);
  ctx.closePath(); ctx.fill(); ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il motore che non rende tutto', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- il piano p–V: 32 px per litro, 1,5 px per kPa ----------
const OX = 240, OY = 700, KV = 32, KP = 1.5;
const S = (V, p) => [OX + KV * V, OY - KP * p];
function rettangolo(ctx, V0, V1, p0, p1, col, a, righe) {
  if (a <= 0) return;
  const [x0, y1] = S(V0, p1), [x1, y0] = S(V1, p0);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = css(col, .2); ctx.fillRect(x0, y1, x1 - x0, y0 - y1);
  if (righe) {   // il lavoro subito: tratteggiato
    ctx.beginPath(); ctx.rect(x0, y1, x1 - x0, y0 - y1); ctx.clip();
    ctx.strokeStyle = css(col, .5); ctx.lineWidth = 2.5;
    for (let x = x0 - (y0 - y1); x < x1; x += 18) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + (y0 - y1), y1); ctx.stroke(); }
  }
  ctx.restore();
}
function scenaPiano(ctx, t) {
  if (t < 7.5 || t > 69.6) return;
  const al = life(t, 7.6, 69.4, .6, .5);
  card(ctx, 110, 110, 950, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // assi e griglia
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const V of [5, 10, 15, 20]) { ctx.beginPath(); ctx.moveTo(...S(V, 0)); ctx.lineTo(...S(V, 330)); ctx.stroke(); }
  for (let p = 50; p <= 300; p += 50) { ctx.beginPath(); ctx.moveTo(...S(0, p)); ctx.lineTo(...S(24, p)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(24.6, 0)); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(0, 340)); ctx.stroke();
  arrowHead(ctx, [S(24.6, 0)[0] + 6, OY], 0, C.ink); arrowHead(ctx, [OX, S(0, 340)[1] - 6], -Math.PI / 2, C.ink);
  for (const V of [5, 10, 15, 20]) txt(ctx, String(V), S(V, 0)[0], OY + 32, { size: 30, color: C.dim });
  for (const p of [100, 200, 300]) txt(ctx, String(p), OX - 16, S(0, p)[1], { size: 30, color: C.dim, align: 'right' });
  drawRich(ctx, '{mink:p}{dim: (kPa)}', OX + 22, 172, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:V}{dim: (L)}', 1040, OY + 34, { size: 34, align: 'right' });
  // le aree: sotto BC (lavoro fatto), sotto DA (lavoro subito), poi solo quella racchiusa
  rettangolo(ctx, 10, 20, 0, 300, C.v, life(t, 29.9, 34.2, .5, .4));
  rettangolo(ctx, 10, 20, 0, 100, C.v, life(t, 34.5, 38.6, .5, .4), true);
  rettangolo(ctx, 10, 20, 100, 300, C.v, life(t, 38.9, 69.4, .5, .4));
  rettangolo(ctx, 10, 20, 100, 300, C.v, life(t, 38.9, 43.5, .5, .4));
  drawRich(ctx, '{v:fatto: 3000 J}', S(15, 0)[0], S(0, 150)[1], { size: 36, alpha: life(t, 30.1, 34.2, .4, .4) });
  const ks = life(t, 34.6, 38.6, .4, .4);
  if (ks > 0) { ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(S(15, 0)[0] - 130, S(0, 50)[1] - 26, 260, 52, 12); ctx.fill(); ctx.restore(); }
  drawRich(ctx, '{v:subito: 1000 J}', S(15, 0)[0], S(0, 50)[1], { size: 36, alpha: ks });
  drawRich(ctx, '{mv:L}{mink: = }{v:2000 J}', S(15, 0)[0], S(0, 200)[1], { size: 42, alpha: life(t, 39.0, 69.4, .4, .4) });
  // il ciclo: prima tratteggiato, poi la strada fatta
  const giro = VERTICI.concat([VERTICI[0]]).map(([V, p]) => S(V, p));
  ctx.save(); ctx.globalAlpha *= .55 * P(t, 8.2, 9.2); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
  ctx.beginPath(); giro.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  const s = sCiclo(t), fatti = [];
  for (let k = 0; k <= 200; k++) fatti.push(S(...punto(Math.min(s, 4 * k / 200))));
  if (s > 0) { ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); fatti.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
  // il verso: orario
  const kv = P(t, 24.6, 25.2);
  if (kv > 0) [[10, 200, -Math.PI / 2], [15, 300, 0], [20, 200, Math.PI / 2], [15, 100, Math.PI]].forEach(([V, p, a]) => arrowHead(ctx, S(V, p), a, C.v, 1.5 * kv));
  [['A', 10, 100, -30, 28], ['B', 10, 300, -30, -28], ['C', 20, 300, 30, -28], ['D', 20, 100, 30, 28]].forEach(([n, V, p, dx, dy]) =>
    drawRich(ctx, '{mink:' + n + '}', S(V, p)[0] + dx, S(V, p)[1] + dy, { size: 40, alpha: P(t, 8.6, 9.2) }));
  M.dot(ctx, S(...punto(s)), C.ink, P(t, 8.4, 8.9, E.back), 11);
  drawRich(ctx, '{dim:sul giro: }{mink:Δ}{mg:U}{mink: = 0}', S(10, 0)[0] - 24, S(0, 150)[1], { size: 34, align: 'right', alpha: life(t, 43.9, 48.6, .4, .4) });
  ctx.restore();
}

// ---------- il cilindro (fino a 48,7 s), poi il flusso dell'energia ----------
const CL = 1150, CR = 1346, BOT = 716, KH = 20, RM = 8;
const stato = t => { const [V, p] = punto(sCiclo(t)); return { V, p, T: TK(V, p) }; };
const MOL = (() => { const r = rng(5), m = []; for (let i = 0; i < 22; i++) { const a = r() * 2 * Math.PI, v = 110 + 120 * r(); m.push({ ux: r(), uy: r(), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } return m; })();
const DT = .01, NT = Math.ceil(52 / DT) + 2, FX = new Float64Array(NT), FY = new Float64Array(NT);
for (let i = 1; i < NT; i++) {
  const tt = (i - .5) * DT, s = stato(tt), v = Math.sqrt(s.T / 300);
  FX[i] = FX[i - 1] + v / (CR - CL - 2 * RM) * DT; FY[i] = FY[i - 1] + v / (KH * s.V - 2 * RM) * DT;
}
const tab = (A, t) => { const f = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(f); return lerp(A[i], A[i + 1], f - i); };
function scenaCilindro(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 1100, 110, 710, 680, life(t, 8.0, T_FINE + .1, .6, .5));
  const al = life(t, 8.0, 48.7, .6, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'il gas', 1455, 165, { size: 38, weight: 600 }));
  const st = stato(t), yp = BOT - KH * st.V;
  ctx.fillStyle = css(C.x, .07); ctx.fillRect(CL, yp, CR - CL, BOT - yp);
  const fx = tab(FX, t), fy = tab(FY, t), lx = CR - CL - 2 * RM, ly = KH * st.V - 2 * RM;
  ctx.fillStyle = css(C.x, .85);
  for (const m of MOL) { ctx.beginPath(); ctx.arc(CL + RM + piega(m.ux + m.vx * fx) * lx, yp + RM + piega(m.uy + m.vy * fy) * ly, RM, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(C.dim); ctx.fillRect(CL, yp - 22, CR - CL, 22); ctx.fillRect((CL + CR) / 2 - 8, yp - 140, 16, 118);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(CL - 4, 200); ctx.lineTo(CL - 4, BOT + 4); ctx.lineTo(CR + 4, BOT + 4); ctx.lineTo(CR + 4, 200); ctx.stroke();
  // il calore: entra dal fornello (A→B→C), esce dalle pareti (C→D→A)
  const kin = life(t, 13.4, 18.6, .3, .4);
  if (kin > 0) for (let i = 0; i < 5; i++) {
    const cx = CL + 20 + i * (CR - CL - 40) / 4, hf = (22 + 5 * Math.sin(t * 17 + i * 2)) * kin;
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.moveTo(cx, 756 - hf); ctx.quadraticCurveTo(cx + 11, 752, cx, 756); ctx.quadraticCurveTo(cx - 11, 752, cx, 756 - hf); ctx.fill();
  }
  const kout = life(t, 19.1, 24.1, .3, .4);
  for (const y of [560, 650]) { freccia(ctx, [CL - 12, y], [CL - 50, y], C.y, kout); freccia(ctx, [CR + 12, y], [CR + 50, y], C.y, kout); }
  // le letture
  const riga = (nome, val, y) => { drawRich(ctx, nome, 1420, y, { size: 36, align: 'left' }); numero(ctx, val, 1785, y, 36, C.ink); };
  riga('{mink:p}', Math.round(st.p) + ' kPa', 250); riga('{mink:V}', M.fmtN(st.V, 1) + ' L', 300); riga('{mink:T}', Math.round(st.T) + ' K', 350);
  drawRich(ctx, '{y:assorbe calore}', 1600, 430, { size: 34, alpha: life(t, 13.4, 18.8, .3, .3) });
  drawRich(ctx, '{y:cede calore}', 1600, 430, { size: 34, alpha: life(t, 19.1, 24.2, .3, .3) });
  drawRich(ctx, '{dim:di nuovo }{mink:T}{dim: = 300 K}', 1600, 430, { size: 34, alpha: life(t, 43.8, 48.6, .3, .3) });
  ctx.restore();
}
// il flusso di un giro: frecce larghe in proporzione all'energia (100 px = 15 500 J)
const XC = 1455, KJ = 100 / 15500;
function scenaFlusso(ctx, t) {
  if (t < 48.6 || t > T_FINE + .3) return;
  const al = life(t, 48.8, T_FINE + .1, .5, .5), kh = life(t, 84.4, 93.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'un giro del motore', XC, 165, { size: 38, weight: 600 }));
  ctx.fillStyle = css(C.y, .22); ctx.beginPath(); ctx.roundRect(1250, 200, 410, 64, 14); ctx.fill();
  txt(ctx, 'parte calda', XC, 232, { size: 32, weight: 600 });
  ctx.fillStyle = css(C.x, .22); ctx.beginPath(); ctx.roundRect(1250, 610, 410, 64, 14); ctx.fill();
  txt(ctx, 'parte fredda', XC, 642, { size: 32, weight: 600 });
  nastro(ctx, [XC, 266], [XC, 366], 15500 * KJ, C.y, P(t, 49.2, 50.2, E.out));
  ctx.fillStyle = css(C.dim, .16); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(XC, 432, 64, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  txt(ctx, 'motore', XC, 432, { size: 28, weight: 600 });
  nastro(ctx, [XC + 66, 432], [1790, 432], 2000 * KJ, C.v, P(t, 54.4, 55.2, E.out), 1 - kh);
  nastro(ctx, [XC, 498], [XC, 608], 13500 * KJ, C.y, P(t, 58.8, 59.8, E.out), 1 - kh);
  drawRich(ctx, '{y:calore assorbito}', 1368, 296, { size: 30, align: 'right', alpha: P(t, 49.6, 50.1) });
  numero(ctx, '15 500 J', 1368, 336, 36, C.y, P(t, 49.6, 50.1));
  drawRich(ctx, '{mv:L}{mink: = }{v:2000 J}', 1660, 390, { size: 34, alpha: P(t, 54.8, 55.3) * (1 - kh) });
  drawRich(ctx, '{y:calore ceduto}', 1368, 530, { size: 30, align: 'right', alpha: P(t, 59.2, 59.7) * (1 - kh) });
  numero(ctx, '13 500 J', 1368, 570, 36, C.y, P(t, 59.2, 59.7) * (1 - kh));
  drawRich(ctx, '{y:15 500 J}{mink: − }{y:13 500 J}{mink: = }{v:2000 J}', XC, 718, { size: 34, alpha: life(t, 63.2, 69.2, .4, .4) });
  drawRich(ctx, '{dim:perché sul giro }{mink:Δ}{mg:U}{mink: = 0}', XC, 762, { size: 30, alpha: life(t, 63.6, 69.2, .4, .4) });
  // l'ipotesi impossibile: niente al freddo, tutto in lavoro
  if (kh > 0) {
    nastro(ctx, [XC + 66, 432], [1790, 432], 15500 * KJ, C.r, P(t, 84.6, 85.4, E.out), .85 * kh);
    drawRich(ctx, '{r:tutto in lavoro?}', 1660, 330, { size: 32, alpha: kh });
    ctx.save(); ctx.globalAlpha *= kh; crossMark(ctx, XC, 432, P(t, 89.1, 90.0), C.r, .7); ctx.restore();   // sfuma con l'ipotesi
  }
  ctx.restore();
}

// ---------- il rendimento (69,3–98,1) ----------
function scenaRendimento(ctx, t) {
  if (t < 69.2 || t > T_FINE + .3) return;
  const al = life(t, 69.4, T_FINE + .1, .5, .5);
  card(ctx, 110, 110, 950, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'rendimento', 585, 165, { size: 38, weight: 600 }));
  drawSeq(ctx, ['{mink:η =}', { num: '{mv:L}', den: '{y:calore assorbito}' }], 585, 290, 50, { local: t - 69.7 });
  drawSeq(ctx, ['{mink:η =}', { num: '2000 J', den: '15 500 J' }, '{mink:≈ }{g:0,13 = 13%}'], 585, 440, 46, { local: t - 74.1 });
  drawSeq(ctx, ['{mink:η = 1 −}', { num: '{y:calore ceduto}', den: '{y:calore assorbito}' }], 585, 585, 46, { local: t - 78.8 });
  const kh = life(t, 84.4, 93.6, .4, .4);
  if (kh > 0) {
    drawRich(ctx, '{r:se non cedesse niente: }{mink:η = 1}', 585, 720, { size: 40, alpha: kh });
    ctx.save(); ctx.globalAlpha *= kh; crossMark(ctx, 985, 720, P(t, 89.1, 90.0), C.r, .42); ctx.restore();
  }
  drawRich(ctx, '{v:secondo principio}: {mink:η < 1}', 585, 720, { size: 44, local: t - 93.9, alpha: 1 });
  ctx.restore();
}

// in una frase (98,1–108,2)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 106.1, 107.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.3 });
    drawRich(ctx, 'Un motore trasforma in lavoro solo\nuna parte del calore che assorbe.', W / 2, 290, { size: 68, weight: 600, local: t - 98.7, stagger: .09 });
  });
  const pills = [[490, 'in un ciclo\n{mink:Δ}{mg:U} = 0'], [960, '{mv:L} = area\n{v:racchiusa} dal ciclo'], [1430, '{mink:η} = {mv:L} / calore\nassorbito, sempre < 1']];
  pills.forEach(([x, s], i) => {
    const a = 100.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): nel ciclo il tono segue la pressione, da 0 (0) a 300 kPa (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.2, 9.2], ['pop', 8.6, .33],                        // il ciclo tratteggiato, A B C D
    ['traccia', 13.8, 15.8], ['tono', 13.8, 15.8, [.33, .38, .67, .96, 1]],           // da A a B: si scalda, la pressione sale
    ['traccia', 16.0, 18.4], ['tono', 16.0, 18.4, [1, 1]],                            // da B a C: si espande
    ['traccia', 19.5, 21.5], ['tono', 19.5, 21.5, [1, .96, .67, .38, .33]],           // da C a D: cede calore
    ['traccia', 21.7, 23.9], ['tono', 21.7, 23.9, [.33, .33]],                        // da D ad A: compresso
    ['pop', 24.7, .5],                                                                // il verso orario
    ['pop', 30.0, .6], ['pop', 34.6, .35],                                            // lavoro fatto 3000 J, subito 1000 J
    ['pop', 44.0, .4],                                                                // sul giro ΔU = 0
    ['soffio', 48.8], ['pop', 49.7, .8], ['pop', 54.9, .4], ['pop', 59.3, .7],        // il flusso: 15 500, 2000, 13 500 J
    ['ding', 63.5],                                                                   // 15 500 meno 13 500 = 2000 J
    ['soffio', 69.4], ['pop', 69.9, .5], ['ding', 74.9], ['pop', 79.0, .5],           // il rendimento: 0,13
    ['traccia', 84.6, 85.4], ['pop', 84.8, .9], ['traccia', 89.1, 90.0],              // tutto in lavoro? impossibile
    ['pop', 94.1, .6],                                                                // il secondo principio: η < 1
    ['soffio', 98.3], ['pop', 100.8, .5], ['pop', 101.3, .6], ['pop', 101.8, .7],     // in una frase
  ];
  return {
    titolo: 'Il motore che non rende tutto', durata: 108.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 48.7, 'il ciclo'], [48.7, 69.3, 'il bilancio di un giro'], [69.3, T_FINE, 'il rendimento']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPiano(ctx, t); scenaRendimento(ctx, t); scenaCilindro(ctx, t); scenaFlusso(ctx, t); scenaFine(ctx, t); },
  };
});
