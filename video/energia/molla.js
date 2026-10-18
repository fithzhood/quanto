'use strict';
/* La molla che lancia — l'energia potenziale elastica ½·k·x² è l'area sotto la retta F = k·x (non F·x: la forza cresce
   da zero). Molla con k = 200 N/m compressa di 10 cm: 20 N alla fine, ½ · 0,1 · 20 = 1 J (non 2 J). Lancia un carrello
   da 0,5 kg senza attrito: parte a 2 m/s (½·m·v² = 1 J) e risale una rampa di 30° fino a h = 1 / (0,5 · 9,8) ≈ 0,204 m.
   Compressa di 20 cm: 40 N, area quattro volte (4 J), parte a 4 m/s e sale a ≈ 0,816 m.
   Moto vero, al rallentatore (8 s di video per 1 s vero): finché tocca la molla x = x₀·cos(ω·τ) con ω = √(k/m) = 20 rad/s
   (un quarto di periodo, 0,0785 s), poi velocità costante sul piano (20 cm), poi sulla rampa s = v₀·σ − ½·g·sin 30°·σ².
   In cima, fermo immagine dichiarato. Argomento: energia. */
CVIDEO.registra('energia/molla', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, crossMark, fmtN } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [92.7, 190], [94.0, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [92.7, 1050], [94.0, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [92.7, 2.2], [94.0, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [92.7, 2], [94.0, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [92.7, -1.5], [94.0, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [24.8, 'pensa'], [29.4, 'sorpreso'],
  [33.3, 'neutro'], [37.8, 'felice'], [43.6, 'neutro'], [54.5, 'felice'], [58.9, 'sorpreso'], [62.5, 'felice'],
  [66.4, 'neutro'], [75.6, 'sorpreso'], [80.3, 'neutro'], [88.3, 'festa'], [92.7, 'neutro'], [95.0, 'felice'],
  [99.5, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Quanta energia c’è\nin una molla compressa?'],
  [7.9, 13.4, 'Un carrello contro una molla di\ncostante elastica {mink:k} = 200 N/m.'],
  [13.5, 18.6, 'La comprimo di {mx:x}: la forza che\nserve cresce, {my:F} = {mink:k}·{mx:x}.'],
  [18.7, 24.7, 'A {mx:x} = 10 cm la molla spinge\ncon 200 · 0,1 = {y:20 N}.'],
  [24.8, 29.3, 'Il lavoro fatto è {r:20 N · 0,1 m = 2 J}?'],
  [29.4, 33.2, '{r:No}: 20 N è la forza\nsolo alla fine.'],
  [33.3, 37.7, 'Tante strisce sottili: ognuna è\nforza per un piccolo spostamento.'],
  [37.8, 43.5, 'Insieme fanno il {g:triangolo}:\n½ · 0,1 m · 20 N = {g:1 J}.'],
  [43.6, 48.9, 'Il lavoro resta nella molla: è l’energia\n{g:elastica}, ½·{mink:k}·{mx:x}².'],
  [49.0, 54.4, 'Lascio il carrello, 0,5 kg, senza\nattrito. Al rallentatore.'],
  [54.5, 58.8, 'Parte a 2 m/s e risale\nla rampa, sempre più piano…'],
  [58.9, 62.4, '…fino a {g:20 cm} di altezza.\nFermo immagine.'],
  [62.5, 66.3, 'Elastica, cinetica, potenziale:\nil totale resta {g:1 J}.'],
  [66.4, 71.1, 'Infatti {mink:m·g·h} = 1 J:\n{mink:h} ≈ 0,20 m.'],
  [71.2, 75.5, 'Ora la comprimo di 20 cm:\nforza doppia, {y:40 N}.'],
  [75.6, 80.2, 'Base e altezza doppie: il triangolo\nha area {g:quattro volte}, 4 J.'],
  [80.3, 88.2, 'Lo lascio: parte a 4 m/s,\nil doppio, e sale, sale…'],
  [88.3, 92.6, '…fino a {g:82 cm}: quattro volte\nl’altezza di prima!'],
  [95.0, 101.0, 'Energia elastica: ½·{mink:k}·{mx:x}², l’area\nsotto la retta {my:F} = {mink:k}·{mx:x}.'],
];

// ---------- la fisica ----------
const K = 200, MC = 0.5, G = 9.8, SINA = 0.5, COSA = Math.sqrt(3) / 2, OM = Math.sqrt(K / MC), SL = 8, PIANO = 0.2;
const LANCI = [{ t0: 53.6, c0: 0.1, fine: 71.3 }, { t0: 80.6, c0: 0.2, fine: 200 }];
// stato del carrello lanciato con la molla compressa di c0 all'istante t0 (tempo del video; τ è il tempo vero)
function lancio(t, L) {
  const tau = Math.max(0, (t - L.t0) / SL), t1 = Math.PI / (2 * OM), v0 = L.c0 * OM;
  if (tau < t1) { const c = L.c0 * Math.cos(OM * tau); return { c, xc: -c, s: -1, v: v0 * Math.sin(OM * tau) }; }
  const t2 = t1 + PIANO / v0;
  if (tau < t2) return { c: 0, xc: v0 * (tau - t1), s: -1, v: v0 };
  const a = G * SINA, sig = Math.min(tau - t2, v0 / a);
  return { c: 0, xc: PIANO, s: v0 * sig - a * sig * sig / 2, v: v0 - a * sig };
}
// compressione prima dei lanci: a mano, piano piano
function compressione(t) {
  if (t < LANCI[0].t0) return 0.1 * P(t, 13.9, 17.9);
  if (t < 71.9) return 0;
  return 0.2 * P(t, 71.9, 73.6);
}
function stato(t) {
  if (t < LANCI[0].t0) { const c = compressione(t); return { c, xc: -c, s: -1, v: 0, al: 1 }; }
  if (t < 71.6) return Object.assign(lancio(t, LANCI[0]), { al: 1 - P(t, 71.0, 71.4) });
  if (t < LANCI[1].t0) { const c = compressione(t); return { c, xc: -c, s: -1, v: 0, al: P(t, 71.5, 71.9) }; }
  return Object.assign(lancio(t, LANCI[1]), { al: 1 });
}
const energie = st => ({ el: K * st.c * st.c / 2, ci: MC * st.v * st.v / 2, po: st.s > 0 ? MC * G * st.s * SINA : 0 });

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, w = 6, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, L / 26);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
function numero(ctx, s, x, y, size, col, al = 1) {   // cifre a larghezza fissa, allineate a destra, con l'unità dopo
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z°]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La molla che lancia', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la pista: 400 px per metro ----------
const PXM = 400, YF = 690, XW = 160, XN = XW + 0.3 * PXM, CW = 64, XC0 = XN + CW / 2, XF = XC0 + PIANO * PXM;
const RAMPA = [XF + 1.75 * PXM * COSA, YF - 1.75 * PXM * SINA];   // ≈ (998; 340)
function posa(st) {
  if (st.s < 0) return { p: [XC0 + st.xc * PXM, YF], ang: 0 };
  return { p: [XF + st.s * PXM * COSA, YF - st.s * PXM * SINA], ang: -Math.PI / 6 };
}
function molla(ctx, x1) {   // dal muro fino a x1, dieci spire
  const y = YF - 27, n = 10, x0 = XW;
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y);
  const a = x0 + 8, b = x1 - 8;
  ctx.lineTo(a, y);
  for (let i = 0; i < 2 * n; i++) ctx.lineTo(a + (b - a) * (i + .5) / (2 * n), y + (i % 2 ? 15 : -15));
  ctx.lineTo(b, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x1, y - 16); ctx.lineTo(x1, y + 16); ctx.stroke();
  ctx.restore();
}
function carrello(ctx, ps, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(ps.p[0], ps.p[1]); ctx.rotate(ps.ang);
  ctx.fillStyle = css(mix(C.x, C.paper, .6)); ctx.strokeStyle = css(mix(C.x, C.ink, .5)); ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.roundRect(-CW / 2, -50, CW, 38, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink);
  for (const wx of [-19, 19]) { ctx.beginPath(); ctx.arc(wx, -8, 8, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
const locale = (ps, x, y) => [ps.p[0] + x * Math.cos(ps.ang) - y * Math.sin(ps.ang), ps.p[1] + x * Math.sin(ps.ang) + y * Math.cos(ps.ang)];

function scenaPista(ctx, t) {
  if (t < 7.5 || t > 93.2) return;
  const al = life(t, 7.6, 93.0, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il pavimento, il muro, la rampa
  ctx.fillStyle = css(mix(C.dim, C.paper, .85));
  ctx.beginPath(); ctx.moveTo(XF, YF); ctx.lineTo(RAMPA[0], RAMPA[1]); ctx.lineTo(RAMPA[0], YF); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(140, YF); ctx.lineTo(XF, YF); ctx.lineTo(RAMPA[0], RAMPA[1]); ctx.lineTo(RAMPA[0], YF); ctx.lineTo(XF, YF); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.fillRect(140, 590, XW - 140, YF - 590);
  ctx.strokeRect(140, 590, XW - 140, YF - 590);
  txt(ctx, '30°', XF + 92, YF - 22, { size: 30, color: C.dim });
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(XF, YF, 66, -Math.PI / 6, 0); ctx.stroke();
  // la molla e il carrello
  const st = stato(t), ps = posa(st);
  molla(ctx, st.s < 0 ? XC0 + st.xc * PXM - CW / 2 : XN);
  carrello(ctx, ps, st.al);
  // la compressione x, sotto il pavimento
  const lanciato = t >= LANCI[0].t0 && t < 71.4 || t >= LANCI[1].t0;
  const kx = (t < LANCI[0].t0 ? life(t, 13.6, LANCI[0].t0, .4, .3) : life(t, 71.6, LANCI[1].t0, .4, .3)) * (st.c > .004 ? 1 : 0);
  if (kx > 0 && !lanciato) {
    const xs = XN - st.c * PXM;
    ctx.save(); ctx.globalAlpha *= kx;
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(xs, 708); ctx.lineTo(xs, 728); ctx.moveTo(XN, 708); ctx.lineTo(XN, 728); ctx.moveTo(xs, 718); ctx.lineTo(XN, 718); ctx.stroke();
    drawRich(ctx, '{mx:x} = ' + Math.round(st.c * 100) + ' cm', (xs + XN) / 2 + 30, 752, { size: 32 });
    ctx.restore();
  }
  // la forza della mano: lunga 3 px per newton, verso la molla
  const kF = (t < LANCI[0].t0 ? 1 - P(t, LANCI[0].t0 - .5, LANCI[0].t0 - .1) : 1 - P(t, LANCI[1].t0 - .5, LANCI[1].t0 - .1)) * (lanciato ? 0 : 1) * st.al;
  const F = K * st.c;
  if (kF > 0 && F > 1) {
    const xr = XC0 + st.xc * PXM + CW / 2 + 4;
    freccia(ctx, [xr + F * 3 + 14, YF - 31], [xr, YF - 31], C.y, 6, kF);
    drawRich(ctx, '{my:F}', xr + F * 1.5 + 8, YF - 74, { size: 36, alpha: kF });
  }
  // la velocità: 40 px per m/s, lungo il moto
  if (lanciato && st.v > .05 && st.al > 0) {
    const a = locale(ps, CW / 2 + 6, -30), b = locale(ps, CW / 2 + 6 + st.v * 40, -30);
    freccia(ctx, a, b, C.x, 5, st.al);
    const lab = locale(ps, 0, -100);
    drawRich(ctx, '{mx:v} = ' + fmtN(st.v, 1) + ' m/s', lab[0], lab[1], { size: 32, alpha: st.al });
  }
  // l'altezza raggiunta
  for (const [a, b, L] of [[58.4, 71.0, LANCI[0]], [88.2, 93.0, LANCI[1]]]) {
    const kh = life(t, a, b, .4, .3);
    if (kh <= 0) continue;
    const top = lancio(t, L), yt = YF - top.s * PXM * SINA, xt = posa(top).p[0];
    ctx.save(); ctx.globalAlpha *= kh;
    dashed(ctx, [xt + 40, yt], [1072, yt], C.g, 1, 1);
    freccia(ctx, [1072, (yt + YF) / 2], [1072, yt + 2], C.g, 3); freccia(ctx, [1072, (yt + YF) / 2], [1072, YF - 2], C.g, 3);
    drawRich(ctx, '{g:' + Math.round(top.s * SINA * 100) + ' cm}', 985, (yt + YF) / 2, { size: 32, weight: 600, align: 'right' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la scheda: il grafico F(x) in alto, conti ed energie in basso ----------
const GO = [1262, 440], UX = 22, UY = 6.5;                 // 22 px per cm, 6,5 px per newton
const gS = (xcm, fN) => [GO[0] + xcm * UX, GO[1] - fN * UY];
function assi(ctx, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const x of [5, 10, 15, 20]) { ctx.beginPath(); ctx.moveTo(...gS(x, 0)); ctx.lineTo(...gS(x, 42)); ctx.stroke(); }
  for (const f of [10, 20, 30, 40]) { ctx.beginPath(); ctx.moveTo(...gS(0, f)); ctx.lineTo(...gS(21.5, f)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...gS(-.4, 0)); ctx.lineTo(...gS(22.4, 0)); ctx.moveTo(...gS(0, -1)); ctx.lineTo(...gS(0, 44)); ctx.stroke();
  arrowHead(ctx, gS(22.6, 0), 0, C.ink); arrowHead(ctx, gS(0, 44.4), -Math.PI / 2, C.ink);
  for (const x of [5, 10, 15, 20]) txt(ctx, x + (x === 20 ? ' cm' : ''), gS(x, 0)[0] + (x === 20 ? 22 : 0), GO[1] + 30, { size: 29, color: C.dim });
  for (const f of [10, 20, 30, 40]) txt(ctx, f + (f === 40 ? ' N' : ''), GO[0] - 14, gS(0, f)[1], { size: 29, color: C.dim, align: 'right' });
  drawRich(ctx, '{mx:x}', gS(22.6, 0)[0] + 24, GO[1], { size: 40 });
  drawRich(ctx, '{my:F}', GO[0] + 22, gS(0, 44.4)[1] + 4, { size: 40, align: 'left' });
  ctx.restore();
}
function poligono(ctx, pts, fill, stroke, al, tratt) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.beginPath(); ctx.moveTo(...gS(...pts[0])); pts.slice(1).forEach(p => ctx.lineTo(...gS(...p))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; if (tratt) ctx.setLineDash([9, 7]); ctx.stroke(); }
  ctx.restore();
}
function sbarra(ctx, nome, E, y, al) {   // una barra di energia: 35 px per joule
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, nome, 1190, y, { size: 30, align: 'left' });
  numero(ctx, fmtN(E, 2) + ' J', 1640, y, 30, C.g);
  ctx.fillStyle = css(C.g, .8); ctx.beginPath(); ctx.roundRect(1655, y - 15, Math.max(2, E * 35), 30, 6); ctx.fill();
  ctx.restore();
}
function scenaScheda(ctx, t) {
  if (t < 7.5 || t > 93.2) return;
  const al = life(t, 13.4, 93.0, .5, .5);
  card(ctx, 1150, 110, 660, 680, life(t, 7.8, 93.0, .5, .5));
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  assi(ctx, 1);
  const st = stato(t);
  // la retta fin dove è arrivata la compressione, e il punto che dice la compressione di adesso
  const cMax = t < 71.2 ? 0.1 * P(t, 13.9, 17.9) : Math.max(0.1, compressione(t));
  // il «2 J» sbagliato: un rettangolo 20 N · 10 cm
  const kR = life(t, 25.0, 33.2, .4, .4);
  poligono(ctx, [[0, 0], [10, 0], [10, 20], [0, 20]], css(C.r, .12), css(C.r), kR, true);
  if (kR > 0) drawRich(ctx, '{r:2 J ?}', gS(5, 25.5)[0], gS(5, 25.5)[1], { size: 36, weight: 600, alpha: kR });
  if (t > 29.4) { ctx.save(); ctx.globalAlpha *= kR; crossMark(ctx, gS(5, 10)[0], gS(5, 10)[1], P(t, 29.4, 30.0), C.r, .8); ctx.restore(); }
  // le strisce: forza a metà striscia per 1 cm
  for (let i = 0; i < 10; i++) {
    const k = P(t, 33.6 + i * .28, 33.9 + i * .28) * (1 - P(t, 38.0, 38.6));
    poligono(ctx, [[i, 0], [i + 1, 0], [i + 1, 2 * (i + .5)], [i, 2 * (i + .5)]], css(C.g, .22), css(C.g, .9), k);
  }
  // il triangolo da 1 J, poi quello da 4 J diviso in quattro
  const kT = P(t, 38.0, 38.8);
  poligono(ctx, [[0, 0], [10, 0], [10, 20]], css(C.g, .28), css(C.g), kT * (1 - P(t, 75.7, 76.3)));
  if (kT > 0) drawRich(ctx, '{g:1 J}', gS(7.2, 6)[0], gS(7.2, 6)[1], { size: 34, weight: 600, alpha: kT * (1 - P(t, 75.7, 76.3)) });
  const kB = P(t, 75.7, 76.4);
  poligono(ctx, [[0, 0], [20, 0], [20, 40]], css(C.g, .28), css(C.g), kB);
  if (kB > 0) {
    const kd = P(t, 76.4, 77.2);
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(...gS(10, 0)); ctx.lineTo(...gS(10, 20)); ctx.lineTo(...gS(20, 20)); ctx.lineTo(...gS(10, 0)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:4 J}', gS(13.2, 14)[0], gS(13.2, 14)[1], { size: 36, weight: 600, alpha: kd });
  }
  if (cMax > 0) {
    ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...GO); ctx.lineTo(...gS(cMax * 100, K * cMax)); ctx.stroke(); ctx.restore();
    const pc = gS(st.c * 100, K * st.c);
    dashed(ctx, [pc[0], GO[1]], pc, C.x, 1, .8); dashed(ctx, [GO[0], pc[1]], pc, C.y, 1, .8);
    M.dot(ctx, pc, C.ink, 1, 9);
  }
  drawRich(ctx, '{my:F} = {mink:k}·{mx:x}', gS(5.5, 32.5)[0], gS(5.5, 32.5)[1], { size: 36, alpha: P(t, 18.0, 18.6) });
  // in basso: i conti prima del lancio
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 500); ctx.lineTo(1770, 500); ctx.stroke();
  const kA = life(t, 18.8, 49.1, .4, .4);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    drawRich(ctx, '{my:F} = 200 · 0,1 = {y:20 N}', 1480, 548, { size: 38, local: t - 18.9 });
    drawRich(ctx, '{r:20 N · 0,1 m = 2 J ?}', 1480, 620, { size: 38, alpha: life(t, 25.0, 33.2, .4, .4) });
    drawRich(ctx, '½ · 0,1 m · 20 N = {g:1 J}', 1480, 620, { size: 38, local: t - 38.0, alpha: P(t, 37.9, 38.3) });
    drawRich(ctx, '{mg:E} = ½·{mink:k}·{mx:x}²', 1480, 712, { size: 50, local: t - 43.8 });
    ctx.restore();
  }
  // le energie durante il primo lancio, poi il conto dell'altezza
  const kE1 = life(t, 49.2, 66.5, .4, .4), en = energie(st);
  if (kE1 > 0) {
    sbarra(ctx, 'elastica', en.el, 545, kE1); sbarra(ctx, 'cinetica', en.ci, 605, kE1); sbarra(ctx, 'potenziale del peso', en.po, 665, kE1);
    ctx.save(); ctx.globalAlpha *= kE1 * P(t, 62.5, 62.9);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 698); ctx.lineTo(1770, 698); ctx.stroke();
    ctx.restore();
    sbarra(ctx, 'totale', en.el + en.ci + en.po, 735, kE1 * P(t, 62.5, 62.9));
  }
  const kH = life(t, 66.5, 71.2, .4, .4);
  if (kH > 0) {
    ctx.save(); ctx.globalAlpha *= kH;
    drawRich(ctx, '{mink:m} = 0,5 kg   {mink:g} = 9,8 m/s²', 1480, 548, { size: 34 });
    drawRich(ctx, '{mink:h} = 1 J / ({mink:m·g})', 1480, 625, { size: 38, local: t - 66.6 });
    drawRich(ctx, '= 1 / (0,5 · 9,8) ≈ {g:0,20 m}', 1480, 700, { size: 38, local: t - 67.2 });
    ctx.restore();
  }
  // la compressione doppia
  const kD = life(t, 71.4, 80.3, .4, .4);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD;
    drawRich(ctx, '{my:F} = 200 · 0,2 = {y:40 N}', 1480, 560, { size: 38, local: t - 73.6 });
    drawRich(ctx, '½ · 0,2 m · 40 N = {g:4 J}', 1480, 650, { size: 38, local: t - 76.4 });
    ctx.restore();
  }
  const kE2 = P(t, 80.4, 80.8);
  if (kE2 > 0) {
    sbarra(ctx, 'elastica', en.el, 545, kE2); sbarra(ctx, 'cinetica', en.ci, 605, kE2); sbarra(ctx, 'potenziale del peso', en.po, 665, kE2);
    sbarra(ctx, 'totale', en.el + en.ci + en.po, 735, kE2);
  }
  ctx.restore();
}

// 4 · in una frase (92,7–103,5)
function scenaFine(ctx, t) {
  if (t < 92.6) return;
  const al = 1 - P(t, 101.8, 102.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.9 });
    drawRich(ctx, 'L’energia di una molla compressa\nè l’area sotto la retta della forza.', W / 2, 290, { size: 70, weight: 600, local: t - 93.3, stagger: .09 });
  });
  const pills = [[490, '{mg:E} = ½·{mink:k}·{mx:x}²'], [960, 'compressione doppia:\nenergia {g:quattro volte}'], [1430, 'elastica, cinetica,\npotenziale: {g:si conserva}']];
  pills.forEach(([x, s], i) => {
    const a = 95.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 0 ? 44 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nella compressione il tono segue la forza che cresce; sulla rampa segue
  // l'altezza del carrello (moto vero, da lancio()), da 0 (.1) a 82 cm (1): il secondo lancio sale quattro volte tanto
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 13.5, .4],                                               // la pista, poi il grafico F(x)
    ['tono', 13.9, 17.9, [.15, .156, .202, .325, .448, .494, .5]], ['traccia', 13.9, 17.9],   // la comprimo: la retta cresce
    ['pop', 18.0, .55], ['pop', 19.0, .5],                                            // F = k·x, 20 N
    ['pop', 25.0, .3], ['traccia', 29.4, 30.0],                                       // il «2 J» sbagliato, cancellato
    ['tono', 33.6, 36.42, [.15, .5]],                                                 // le strisce, sempre più alte
    ['pop', 38.0, .6], ['ding', 38.4], ['pop', 43.8, .6],                             // il triangolo: 1 J; E = ½·k·x²
    ['pop', 49.2, .45],                                                               // le barre delle energie
    ['pop', 53.6, .7], ['tono', 55.03, 58.29, [.1, .153, .199, .237, .269, .293, .311, .322, .325]],   // il lancio, la rampa
    ['ding', 58.4],                                                                   // 20 cm, fermo immagine
    ['traccia', 62.5, 62.9], ['pop', 62.8, .6],                                       // il totale: 1 J
    ['pop', 66.6, .5], ['ding', 67.6],                                                // h = 1 J / (m·g) ≈ 0,20 m
    ['soffio', 71.4],                                                                 // di nuovo contro la molla
    ['tono', 71.9, 73.6, [.15, .163, .254, .5, .746, .837, .85]], ['traccia', 71.9, 73.6],   // compressa di 20 cm
    ['pop', 73.7, .6], ['pop', 75.7, .65], ['traccia', 76.4, 77.2], ['ding', 76.8],   // 40 N, il triangolo grande: 4 J
    ['pop', 80.4, .45], ['pop', 80.6, .8],                                            // le barre, il lancio a 4 m/s
    ['tono', 81.63, 88.16, [.1, .311, .494, .649, .775, .874, .944, .986, 1]], ['pop', 88.2, .9],   // sale fino a 82 cm
    ['soffio', 92.9], ['pop', 95.2, .5], ['pop', 95.7, .6], ['pop', 96.2, .7],        // in una frase
  ];
  return {
    titolo: 'La molla che lancia', durata: 103.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 49.0, 'l’area sotto la retta'], [49.0, 71.2, 'il lancio'], [71.2, 92.7, 'compressione doppia']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPista(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
