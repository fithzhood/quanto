'use strict';
/* Dove va l'energia — con l'attrito Ec + Ep cala a ogni passaggio (il vagone in una conca risale sempre meno: moto vero,
   integrato con una resistenza costante); la parte che manca diventa energia interna, il totale si conserva;
   per questo le montagne russe hanno il primo dosso più alto di tutti. Argomento: energia. */
CVIDEO.registra('energia/attrito', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed, fmtN } = M;

const T_FINE = 92.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.1, 'pensa'], [21.7, 'neutro'],
  [28.3, 'sorpreso'], [32.7, 'pensa'], [37.3, 'neutro'], [41.9, 'felice'], [46.7, 'neutro'], [51.3, 'festa'],
  [55.9, 'neutro'], [62.1, 'sorpreso'], [65.1, 'neutro'], [71.0, 'sorpreso'], [74.1, 'felice'], [78.1, 'pensa'],
  [82.9, 'neutro'], [87.9, 'felice'], [T_FINE, 'neutro'], [94.9, 'felice'], [98.7, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché le montagne russe non tornano\nmai alla stessa altezza?'],
  [7.85, 12.35, 'Vagone di 500 kg tenuto\nda un freno, a 20 m.'],
  [12.4, 17.0, 'Ora però ci sono l’{y:attrito} delle ruote\ne la resistenza dell’aria.'],
  [17.1, 21.6, 'Tutte e due vanno {r:contro} il moto:\nfanno lavoro negativo.'],
  [21.7, 28.2, 'Tolgo il freno: scende e risale\ndall’altra parte…'],
  [28.3, 32.6, '…ma solo fino a 15,8 m, non a 20!'],
  [32.7, 37.2, 'Potenziale più cinetica:\n≈ 77 200 J. {r:Mancano} 20 800 J.'],
  [37.3, 41.8, 'Non sono spariti: ruote, binari e aria\nsi sono un po’ {v:scaldati}.'],
  [41.9, 46.6, 'Sono diventati {v:energia interna}:\nil lavoro dell’attrito, cambiato di segno.'],
  [46.7, 51.2, 'Con l’energia interna il totale\nresta {g:98 000 J}.'],
  [51.3, 55.8, 'Il totale si conserva; la {v:meccanica},\npotenziale più cinetica, no.'],
  [55.9, 62.05, 'A ogni passaggio arriva\npiù in basso…'],
  [62.1, 65.0, '…stavolta solo 12,1 m.'],
  [65.1, 70.9, 'Riscende e risale…'],
  [71.0, 74.0, '…poi 9,1 m.'],
  [74.1, 78.0, 'L’energia interna è salita\na {v:53 400 J}.'],
  [78.1, 82.8, 'Per questo nelle montagne russe\nogni dosso è più basso del primo.'],
  [82.9, 87.8, 'Il primo lo sale tirato da una catena;\npoi va solo con quell’energia.'],
  [87.9, 92.4, 'E alla fine i freni trasformano il resto\nin energia interna.'],
  [94.9, 99.9, 'Con l’attrito l’energia meccanica cala:\nquella che manca diventa energia interna.'],
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
function conPedici(ctx, s, x, y, o = {}) {   // «{mg:E}⌊c⌋» scrive E con la c piccola in basso
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
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
const migliaia = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
const lin = (t, keys) => {   // interpolazione lineare fra fotogrammi chiave (il tempo fisico scorre uniforme)
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};

// ---------- la conca e il moto vero ----------
// conca a parabola h = x²/45 (metri); resistenza costante F = 300 N (attrito delle ruote + aria), sempre contro il moto
const G = 9.8, MASSA = 500, FR = 300, AP = 45, H0 = 20;
const prof = x => [x * x / AP, 2 * x / AP, 2 / AP];
const X0 = -Math.sqrt(H0 * AP);
// x″ = [−h′·(g + h″·x′²) − (F/m)·segno(x′)·√(1 + h′²)] / (1 + h′²), integrato una volta sola (RK4)
const DT = 1 / 1000, TMAX = 18.4;
const SIM = (() => {
  const acc = (x, v) => { const [, hp, hpp] = prof(x), q = 1 + hp * hp; return (-hp * (G + hpp * v * v) - FR / MASSA * Math.sign(v) * Math.sqrt(q)) / q; };
  const n = Math.ceil(TMAX / DT) + 2, X = new Float64Array(n), V = new Float64Array(n), D = new Float64Array(n);
  let x = X0, v = 1e-6, d = 0; const inv = [];
  for (let i = 0; i < n; i++) {
    X[i] = x; V[i] = v * Math.sqrt(1 + prof(x)[1] ** 2); D[i] = d;
    const a1 = acc(x, v), a2 = acc(x + v * DT / 2, v + a1 * DT / 2), a3 = acc(x + (v + a1 * DT / 2) * DT / 2, v + a2 * DT / 2), a4 = acc(x + (v + a2 * DT / 2) * DT, v + a3 * DT);
    const nx = x + DT * (v + 2 * (v + a1 * DT / 2) + 2 * (v + a2 * DT / 2) + (v + a3 * DT)) / 6, nv = v + DT * (a1 + 2 * a2 + 2 * a3 + a4) / 6;
    d += Math.abs(nx - x) * Math.sqrt(1 + prof((x + nx) / 2)[1] ** 2);
    if (v * nv < 0) inv.push({ t: (i + 1) * DT, x: nx, h: prof(nx)[0] });
    x = nx; v = nv;
  }
  return { X, V, D, inv };
})();
const tab = (A, tau) => { const f = clamp(tau, 0, TMAX) / DT, i = Math.floor(f); return lerp(A[i], A[i + 1], f - i); };
// tempi veri delle inversioni: 6,31 s (h ≈ 15,8 m), 12,32 s (≈ 12,1 m), 18,08 s (≈ 9,1 m); nel video si va a velocità vera
const INV = SIM.inv;
const TAU = [[21.8, 0], [21.8 + INV[0].t, INV[0].t], [56.0, INV[0].t], [56.0 + INV[1].t - INV[0].t, INV[1].t], [65.1, INV[1].t], [65.1 + INV[2].t - INV[1].t, INV[2].t]];
function stato(t) {
  const tau = lin(t, TAU), x = tab(SIM.X, tau), v = tab(SIM.V, tau), d = tab(SIM.D, tau), [h, hp] = prof(x);
  const ep = MASSA * G * h, ei = FR * d;
  return { tau, x, h, hp, v: Math.abs(v), verso: v >= 0 ? 1 : -1, ep, ei, ec: .5 * MASSA * v * v };
}
const MOSSO = [[21.8, 21.8 + INV[0].t], [56.0, 56.0 + INV[1].t - INV[0].t], [65.1, 65.1 + INV[2].t - INV[1].t]];

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Dove va l’energia', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la conca: 13 px per metro in tutte e due le direzioni ----------
const SC = [110, 110, 1000, 680], OX = 610, OY = 690, PXM = 13, XM = 33;
const sx = x => OX + x * PXM, sy = h => OY - h * PXM;
const CONCA = (() => { const p = []; for (let i = 0; i <= 240; i++) { const x = -XM + 2 * XM * i / 240; p.push([sx(x), sy(prof(x)[0])]); } return p; })();
function vagone(ctx, s, al) {
  const ang = Math.atan2(-s.hp, 1), cx = sx(s.x), cy = sy(s.h);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.v, C.paper, .55)); ctx.strokeStyle = css(mix(C.v, C.ink, .4)); ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.roundRect(-30, -40, 60, 30, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink);
  for (const xw of [-18, 18]) { ctx.beginPath(); ctx.arc(xw, -8, 7, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  return [cx + 25 * Math.sin(ang), cy - 25 * Math.cos(ang)];
}
// le quote raggiunte: 20 m alla partenza, poi a ogni inversione
const QUOTE = [{ t: 7.9, h: H0, s: '20 m' }, { t: 28.3, h: INV[0].h, s: '≈ ' + fmtN(INV[0].h, 1) + ' m' },
  { t: 56.0 + INV[1].t - INV[0].t, h: INV[1].h, s: '≈ ' + fmtN(INV[1].h, 1) + ' m' },
  { t: 65.1 + INV[2].t - INV[1].t, h: INV[2].h, s: '≈ ' + fmtN(INV[2].h, 1) + ' m' }];
function sceneConca(ctx, t) {
  if (t < 7.5 || t > 78.5) return;
  const al = life(t, 7.6, 78.3, .6, .5), s = stato(t);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // le quote raggiunte, una linea per ogni inversione (la linea va da un braccio all'altro della conca)
  QUOTE.forEach((q, i) => {
    const k = P(t, q.t, q.t + .5);
    if (k <= 0) return;
    const xh = Math.sqrt(q.h * AP);
    dashed(ctx, [sx(-xh), sy(q.h)], [sx(xh), sy(q.h)], i ? C.r : C.g, 1, .6 * k);
    txt(ctx, q.s, OX, sy(q.h) - 20, { size: 30, weight: 600, color: i ? C.r : C.g, alpha: k });
  });
  // i piloni e la conca
  ctx.strokeStyle = css(C.dim, .45); ctx.lineWidth = 3;
  for (let x = -32; x <= 32; x += 4) { const h = prof(x)[0]; if (h > .8) { ctx.beginPath(); ctx.moveTo(sx(x), sy(h) + 4); ctx.lineTo(sx(x), OY + 10); ctx.stroke(); } }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, OY + 10); ctx.lineTo(1070, OY + 10); ctx.stroke();
  ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...CONCA[0]); CONCA.slice(1).forEach(p => ctx.lineTo(...p)); ctx.stroke();
  // il vagone e la velocità (5 px per m/s); intorno alle ruote un alone quando l'energia interna cresce
  const c = vagone(ctx, s, P(t, 8.0, 8.5));
  if (s.v > .3) {
    const q = Math.sqrt(1 + s.hp * s.hp), ux = s.verso / q, uy = -s.verso * s.hp / q, nx = -s.hp / q, ny = -1 / q, L = s.v * 5;
    const a = [c[0] + nx * 44, c[1] + ny * 44];
    freccia(ctx, a, [a[0] + ux * L, a[1] + uy * L], C.x, clamp(s.v / 2), 6);
  }
  // la resistenza (300 N, 0,2 px per newton), contro la velocità, finché il vagone si muove
  const kR = clamp(s.v / .5) * P(t, 21.8, 22.0);
  if (kR > 0) {
    const q = Math.sqrt(1 + s.hp * s.hp), ux = s.verso / q, uy = -s.verso * s.hp / q, L = FR * .2;
    const nx = -s.hp / q, ny = -1 / q, b = [c[0] + nx * 88 + ux * L / 2, c[1] + ny * 88 + uy * L / 2];   // sopra la freccia della velocità, mai sul vagone
    freccia(ctx, b, [b[0] - ux * L, b[1] - uy * L], C.y, kR, 6);
  }
  // la legenda: la resistenza va sempre contro la velocità
  const kL = life(t, 12.6, 78.2, .5, .5);
  if (kL > 0) {
    ctx.save(); ctx.globalAlpha *= kL;
    freccia(ctx, [170, 200], [270, 200], C.x, 1, 6);
    txt(ctx, 'velocità', 290, 200, { size: 30, color: C.x, align: 'left' });
    freccia(ctx, [270, 255], [210, 255], C.y, 1, 6);
    txt(ctx, 'resistenza, sempre contro', 290, 255, { size: 30, color: C.y, align: 'left' });
    ctx.restore();
  }
  const muove = MOSSO.some(([a, b]) => t >= a && t <= b), partito = t > 21.8;
  txt(ctx, muove ? 'velocità vera' : partito ? 'fermo immagine' : '', 1090, 150, { size: 30, color: C.dim, align: 'right' });
  ctx.restore();
}

// ---------- la scheda delle energie (3,6 px per kJ) ----------
const BY = 690, BK = 3.6 / 1000, BW = 100, XB = [1238, 1395, 1552, 1706];
function sceneBarre(ctx, t) {
  if (t < 7.5 || t > 78.5) return;
  const al = life(t, 8.0, 78.3, .5, .5), s = stato(t);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'energia');
  drawRich(ctx, '{mink:h} =', 1290, 222, { size: 36, align: 'right' }); numero(ctx, fmtN(s.h, 1) + ' m', 1440, 222, 36, C.ink);
  drawRich(ctx, '{mx:v} =', 1560, 222, { size: 36, align: 'right' }); numero(ctx, fmtN(s.v, 1) + ' m/s', 1775, 222, 36, C.x);
  drawRich(ctx, '{y:resistenza} 300 N', 1480, 275, { size: 32, alpha: P(t, 12.6, 13.1) });
  // valori arrotondati a 100 J; la cinetica è quello che resta, così la somma torna sempre (il moto vero la rispetta)
  const ep = Math.round(s.ep / 100) * 100, ei = Math.round(s.ei / 100) * 100, ec = Math.max(0, 98000 - ep - ei);
  const colP = mix(C.g, C.paper, .5), colI = C.v;
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1190, BY); ctx.lineTo(1770, BY); ctx.stroke();
  const barra = (x, y0, e, col) => { if (e > 0) { ctx.fillStyle = css(col); ctx.fillRect(x - BW / 2, y0 - e * BK, BW, e * BK); } };
  barra(XB[0], BY, ep, colP); barra(XB[1], BY, ec, C.g);
  const kI = P(t, 37.4, 37.9);   // l'energia interna compare quando Stilla dice dove è finita l'energia
  ctx.save(); ctx.globalAlpha *= kI; barra(XB[2], BY, ei, colI); ctx.restore();
  // il totale: le tre una sopra l'altra
  const kT = P(t, 46.8, 47.3);
  ctx.save(); ctx.globalAlpha *= kT;
  barra(XB[3], BY, ep, colP); barra(XB[3], BY - ep * BK, ec, C.g); barra(XB[3], BY - (ep + ec) * BK, ei, colI);
  ctx.restore();
  numero(ctx, migliaia(ep) + ' J', XB[0], BY - ep * BK - 24, 30, C.g, 1, 'center');
  numero(ctx, migliaia(ec) + ' J', XB[1], BY - ec * BK - 24, 30, C.g, 1, 'center');
  numero(ctx, migliaia(ei) + ' J', XB[2], BY - ei * BK - 24, 30, C.v, kI, 'center');
  numero(ctx, '98 000 J', XB[3], BY - 98000 * BK - 24, 30, C.g, kT, 'center');
  txt(ctx, 'potenziale', XB[0], BY + 34, { size: 30, color: C.dim });
  txt(ctx, 'cinetica', XB[1], BY + 34, { size: 30, color: C.dim });
  conPedici(ctx, '{mg:E}⌊p⌋', XB[0], BY + 72, { size: 34, align: 'center' });
  conPedici(ctx, '{mg:E}⌊c⌋', XB[1], BY + 72, { size: 34, align: 'center' });
  txt(ctx, 'interna', XB[2], BY + 34, { size: 30, color: C.v, alpha: kI });
  txt(ctx, 'totale', XB[3], BY + 34, { size: 30, color: C.g, alpha: kT });
  // la somma meccanica: una graffa sopra potenziale e cinetica, dopo la prima risalita
  const kM = life(t, 32.8, 46.6, .4, .4);
  if (kM > 0) {
    ctx.save(); ctx.globalAlpha *= kM;
    drawRich(ctx, '{dim:potenziale + cinetica:}', 1640, 330, { size: 30 });
    numero(ctx, '≈ ' + migliaia(ep + ec) + ' J', 1640, 372, 34, C.r, 1, 'center');
    ctx.restore();
  }
  ctx.restore();
}

// ---------- le montagne russe vere (67,9–82,4): ogni dosso più basso del primo ----------
const RK = [[0, 0], [14, 30], [26, 4], [38, 24], [50, 6], [61, 18], [71, 5], [80, 11], [88, 2], [100, 2]];
function hRusse(x) {
  for (let i = 0; i < RK.length - 1; i++) {
    const [x0, h0] = RK[i], [x1, h1] = RK[i + 1];
    if (x <= x1) { if (i === 0) return h0 + (h1 - h0) * (x - x0) / (x1 - x0); const u = (x - x0) / (x1 - x0); return h0 + (h1 - h0) * (1 - Math.cos(Math.PI * u)) / 2; }
  }
  return 2;
}
function sceneRusse(ctx, t) {
  if (t < 77.8 || t > T_FINE + .3) return;
  const al = life(t, 78.1, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const gx = x => 200 + x * 15, gy = h => 700 - h * 15;
  // il livello del primo dosso
  dashed(ctx, [gx(14), gy(30)], [gx(98), gy(30)], C.g, 1, .7);
  txt(ctx, 'primo dosso: il più alto', gx(98), gy(30) - 26, { size: 32, weight: 600, color: C.g, align: 'right' });
  ctx.strokeStyle = css(C.dim, .45); ctx.lineWidth = 3;
  for (let x = 2; x < 100; x += 4) { const h = hRusse(x); if (h > 2.6) { ctx.beginPath(); ctx.moveTo(gx(x), gy(h) + 4); ctx.lineTo(gx(x), gy(0)); ctx.stroke(); } }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, gy(0)); ctx.lineTo(1770, gy(0)); ctx.stroke();
  ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i <= 400; i++) { const x = 100 * i / 400, p = [gx(x), gy(hRusse(x))]; i ? ctx.lineTo(...p) : ctx.moveTo(...p); }
  ctx.stroke();
  // la catena di salita e i freni
  const kC = P(t, 83.0, 83.5);
  if (kC > 0) {
    ctx.save(); ctx.globalAlpha *= kC; ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(gx(0.5), gy(hRusse(.5)) - 9); ctx.lineTo(gx(13.5), gy(hRusse(13.5)) - 9); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{y:catena}', gx(4), gy(hRusse(7)) - 30, { size: 32, align: 'right', alpha: kC });
  }
  const kF = P(t, 88.0, 88.5);
  if (kF > 0) {
    ctx.save(); ctx.globalAlpha *= kF; ctx.fillStyle = css(C.v, .8);
    for (let x = 90; x <= 98; x += 2) ctx.fillRect(gx(x) - 6, gy(2) - 6, 12, 12);
    ctx.restore();
    txt(ctx, 'freni', gx(94), gy(2) - 40, { size: 32, weight: 600, color: C.v, alpha: kF });
  }
  ctx.restore();
}

// in una frase (92,6–102,2)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.1, 101.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.8 });
    drawRich(ctx, 'Con l’attrito l’energia meccanica cala:\nil resto diventa energia interna.', W / 2, 290, { size: 66, weight: 600, local: t - 93.2, stagger: .09 });
  });
  const pills = [[490, ''], [960, 'ruote, binari, aria:\nsi {v:scaldano}'], [1430, 'energia {g:totale}:\nsi conserva']];
  pills.forEach(([x, s], i) => {
    const a = 95.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    if (i === 0) conPedici(ctx, '{mg:E}⌊c⌋{mink: + }{mg:E}⌊p⌋{r: cala}', x, 505, { size: 40, align: 'center' });
    else drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 8.0, .9],                               // il titolo, il vagone a 20 m
    ['pop', 12.6, .4],                                                                // la resistenza
    ['tono', 21.8, 28.11, [.9, .83, .63, .34, .11, .19, .45, .65, .73]], ['pop', 28.3, .7],   // scende e risale: 15,8 m
    ['pop', 32.8, .5], ['pop', 37.4, .6], ['ding', 47.0],                             // mancano 20 800 J; l'interna; il totale
    ['tono', 56.0, 62.02, [.73, .67, .51, .28, .11, .16, .36, .52, .59]], ['pop', 62.02, .55],   // poi 12,1 m
    ['tono', 65.1, 70.85, [.59, .54, .41, .23, .11, .14, .29, .42, .46]], ['pop', 70.85, .45],   // poi 9,1 m
    ['soffio', 78.1], ['pop', 83.0, .6], ['pop', 88.0, .3],                           // le montagne russe: la catena, i freni
    ['soffio', 92.8], ['pop', 95.4, .5], ['pop', 95.9, .6], ['pop', 96.4, .7],        // in una frase
  ];
  return {
    titolo: 'Dove va l’energia', durata: 102.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 46.6, 'con l’attrito'], [46.6, 78.0, 'il totale si conserva'], [78.0, T_FINE, 'le montagne russe vere']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneConca(ctx, t); sceneBarre(ctx, t); sceneRusse(ctx, t); sceneFine(ctx, t); },
  };
});
