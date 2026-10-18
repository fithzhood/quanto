'use strict';
/* Il lavoro diventa velocità — il teorema dell'energia cinetica: il lavoro della risultante è ΔEc, con Ec = ½·m·v²;
   la frenata fa lavoro negativo; a velocità doppia l'energia è quattro volte (e lo spazio di frenata pure). Argomento: energia. */
CVIDEO.registra('energia/cinetica', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed, fmtN } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [92.6, 190], [93.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [92.6, 1050], [93.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [92.6, 2.2], [93.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [92.6, 2], [93.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [92.6, -1.5], [93.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.0, 'sorpreso'], [26.7, 'neutro'],
  [31.9, 'felice'], [36.7, 'neutro'], [41.7, 'festa'], [46.6, 'neutro'], [51.7, 'felice'], [55.5, 'neutro'],
  [60.7, 'pensa'], [65.5, 'neutro'], [73.9, 'sorpreso'], [78.5, 'pensa'], [83.0, 'neutro'], [87.8, 'sorpreso'],
  [92.6, 'neutro'], [94.6, 'felice'], [98.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Spingi un carrello fermo:\ndove finisce il tuo lavoro?'],
  [7.9, 12.3, 'Carrello di 2 kg, rotaia a cuscino\nd’aria: {g:niente attrito}.'],
  [12.4, 17.2, 'Il peso {my:P} e la spinta {my:N} della rotaia\nsono perpendicolari: {g:non lavorano}.'],
  [17.3, 21.9, 'Lo spingo con 16 N per 4 m:\nè la {g:risultante}.'],
  [22.0, 26.6, 'Mentre lo spingo il lavoro cresce\ne il carrello {x:accelera}.'],
  [26.7, 31.8, 'Lavoro: 16 N · 4 m = {g:64 J}.\nVelocità: {mx:v} = 8 m/s.'],
  [31.9, 36.6, 'Il lavoro è diventato {g:energia}\n{g:cinetica}: l’energia del moto.'],
  [36.7, 41.6, 'L’energia cinetica vale ½·{mink:m}·{mx:v}²:\nmetà massa per velocità al quadrato.'],
  [41.7, 46.7, '½ · 2 kg · (8 m/s)² = {g:64 J}:\nproprio il lavoro fatto!'],
  [46.75, 51.6, 'Il lavoro della {g:risultante} è uguale\nalla {v:variazione} dell’energia cinetica.'],
  [51.7, 55.4, 'È il {v:teorema dell’energia cinetica}.'],
  [55.5, 60.6, 'Ora corre a 8 m/s costanti:\nnessuna forza fa lavoro.'],
  [60.7, 65.45, 'Freno con 16 N, {r:contro} il moto:\nlavoro {g:−64 J} in 4 m.'],
  [65.5, 69.3, 'L’energia cinetica perde 64 J:\nsi {g:ferma}.'],
  [69.35, 73.85, 'Un’auto di 1000 kg a 10 m/s:\nenergia cinetica {g:50 000 J}.'],
  [73.9, 78.4, 'A velocità doppia, 20 m/s:\n{g:200 000 J}, {g:quattro volte} tanto.'],
  [78.5, 82.9, 'Perché la velocità è {v:al quadrato}:\n{mink:2² = 4}.'],
  [83.0, 87.7, 'Per fermarla con la stessa forza\nserve uno spazio {g:quattro volte}.'],
  [87.8, 92.5, 'Con 5000 N: 10 m a 10 m/s,\n40 m a 20 m/s.'],
  [94.6, 99.4, 'Il lavoro della risultante è la\nvariazione dell’energia cinetica.'],
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
// testo ricco con pedici a lettere: «{mg:E}⌊c⌋» scrive E con la c piccola in basso
function conPedici(ctx, s, x, y, o = {}) {
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
const migliaia = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 50 000 con lo spazio
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));

// il moto vero, al rallentatore (4 s di video per 1 s vero): spinta 16 N su 2 kg (a = 8 m/s²) per 4 m,
// poi 8 m/s costanti, poi frenata 16 N (a = −8 m/s²) per 4 m fino a fermo
const MASSA = 2, FORZA = 16, ACC = FORZA / MASSA, T0 = 22.2, LENTO = 4, TB = 60.6;
const tauB = (TB - T0) / LENTO;                 // 9,6 s veri
const XB = 4 + 8 * (tauB - 1);                  // 72,8 m: lì comincia la frenata
function moto(t) {
  const tau = Math.max(0, (t - T0) / LENTO);
  if (tau <= 1) return { x: .5 * ACC * tau * tau, v: ACC * tau, fase: tau > 0 ? 'spinta' : 'fermo' };
  if (tau <= tauB) return { x: 4 + 8 * (tau - 1), v: 8, fase: 'libero' };
  const u = Math.min(1, tau - tauB);
  return { x: XB + 8 * u - .5 * ACC * u * u, v: 8 - ACC * u, fase: u < 1 ? 'frenata' : 'fermo' };
}
const ec = v => .5 * MASSA * v * v;

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il lavoro diventa velocità', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–3 · il carrello sulla rotaia (7,5–69,3): il carrello sta al centro e la rotaia scorre
const SC = [110, 110, 1000, 680], XC = 560, YR = 560, PXM = 110, FS = 6;   // 110 px per metro, 6 px per newton
function sceneCarrello(ctx, t) {
  if (t < 7.5 || t > 69.6) return;
  const al = life(t, 7.6, 69.4, .6, .5), m = moto(t);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.save(); ctx.beginPath(); ctx.roundRect(SC[0] + 4, SC[1] + 4, SC[2] - 8, SC[3] - 8, 20); ctx.clip();
  // la rotaia, con i forellini dell'aria che scorrono
  ctx.fillStyle = css(mix(C.dim, C.paper, .7)); ctx.fillRect(130, YR, 960, 26);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.strokeRect(130, YR, 960, 26);
  const off = ((m.x * PXM) % 44 + 44) % 44;
  ctx.fillStyle = css(C.dim);
  for (let x = 150 - off; x < 1090; x += 44) if (x > 136) { ctx.beginPath(); ctx.arc(x, YR + 13, 3.5, 0, Math.PI * 2); ctx.fill(); }
  // i segni dei 4 m: della spinta (da 0 a 4 m) e della frenata
  const sx = w => XC + (w - m.x) * PXM;
  const segni = (a, b, k, nome) => {
    if (k <= 0) return;
    for (const w of [a, b]) dashed(ctx, [sx(w), YR + 30], [sx(w), 760], C.dim, 1, .8 * k);
    const xa = sx(a), xb = Math.min(XC, sx(b));
    if (xb > xa + 4) freccia(ctx, [xa, 735], [xb, 735], C.ink, k, 5);
    drawRich(ctx, nome, (sx(a) + sx(b)) / 2, 692, { size: 34, alpha: k * clamp((XC - sx(b)) / 40 + 1) });
  };
  segni(0, 4, life(t, 17.2, 40, .4, .5), '4 m');
  segni(XB, XB + 4, life(t, 60.3, 69.3, .4, .4), '4 m');
  ctx.restore();
  // il carrello
  const yb = YR - 14;
  ctx.fillStyle = css(mix(C.x, C.paper, .7)); ctx.strokeStyle = css(mix(C.x, C.ink, .4)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(XC - 90, yb); ctx.lineTo(XC - 70, yb - 90); ctx.lineTo(XC + 70, yb - 90); ctx.lineTo(XC + 90, yb); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.fillRect(XC - 90, yb, 180, 10);
  txt(ctx, '2 kg', XC - 58, yb - 116, { size: 30, weight: 600 });
  const yc = yb - 45;
  // peso e spinta della rotaia (uguali, 19,6 N), che non lavorano
  const kPN = life(t, 12.6, 31.7, .5, .5);
  freccia(ctx, [XC, yc], [XC, yc + 19.6 * FS], C.y, kPN);
  drawRich(ctx, '{my:P}', XC + 24, yc + 19.6 * FS - 12, { size: 36, align: 'left', alpha: kPN });
  freccia(ctx, [XC, yc], [XC, yc - 19.6 * FS], C.y, kPN);
  drawRich(ctx, '{my:N}', XC + 24, yc - 19.6 * FS + 12, { size: 36, align: 'left', alpha: kPN });
  M.dot(ctx, [XC, yc], C.ink, kPN, 7);
  // la spinta, poi la frenata
  const kF = m.fase === 'spinta' || (m.fase === 'fermo' && t < T0 + 1) ? P(t, 17.3, 17.8) : 0;
  freccia(ctx, [XC - 94 - FORZA * FS, yc], [XC - 94, yc], C.y, kF);
  drawRich(ctx, '{my:F} = 16 N', XC - 100, yc - 50, { size: 32, align: 'right', alpha: kF });
  const kB = m.fase === 'frenata' ? 1 : 0;
  freccia(ctx, [XC + 94 + FORZA * FS, yc], [XC + 94, yc], C.y, kB);
  drawRich(ctx, '{y:frenata} 16 N', XC + 100, yc - 50, { size: 32, align: 'left', alpha: kB });
  // la velocità, sopra il carrello (14 px per m/s)
  if (m.v > .05) {
    const L = m.v * 14, kv = clamp(m.v / 1.5);
    freccia(ctx, [XC - L / 2, yb - 222], [XC + L / 2, yb - 222], C.x, kv);
    drawRich(ctx, '{mx:v} = ' + fmtN(m.v, 1) + ' m/s', XC, yb - 266, { size: 34, alpha: kv });
  }
  txt(ctx, 'al rallentatore', 1090, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, 22.2, 69.3, .3, .4) });
  ctx.restore();
}

// la scheda con le barre: il lavoro fatto e l'energia cinetica (5 px per joule)
const BY = 640, BS = 5, BW = 150, XL = 1340, XE = 1620;
function barra(ctx, x, h, col, pieno = true) {
  if (h <= .5) return;
  ctx.save();
  if (pieno) { ctx.fillStyle = css(col); ctx.fillRect(x - BW / 2, BY - h, BW, h); }
  else {
    ctx.fillStyle = css(col, .18); ctx.fillRect(x - BW / 2, BY - h, BW, h);
    ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.strokeRect(x - BW / 2, BY - h, BW, h);
  }
  ctx.restore();
}
function sceneBarre(ctx, t) {
  if (t < 7.5 || t > 69.6) return;
  const al = life(t, 8.0, 69.4, .5, .5), m = moto(t);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'lavoro ed energia');
  conPedici(ctx, '{mg:E}⌊c⌋{mink: = ½·m·}{mx:v}{mink:²}', 1480, 232, { size: 44, align: 'center', alpha: P(t, 36.9, 37.4) });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1200, BY); ctx.lineTo(1760, BY); ctx.stroke();
  // il lavoro della spinta: F·x finché spinge
  const kL = P(t, 17.3, 17.8) * (1 - P(t, 55.3, 55.8));
  const L = m.fase === 'spinta' ? FORZA * m.x : t > T0 + 1 ? 64 : 0;
  if (kL > 0) {
    ctx.save(); ctx.globalAlpha *= kL;
    barra(ctx, XL, L * BS, C.g, false);
    numero(ctx, L, XL, BY - L * BS - 28);
    drawRich(ctx, '{dim:lavoro} {mink:L}', XL, BY + 38, { size: 32 });
    ctx.restore();
  }
  // il lavoro della frenata, negativo
  const kN = P(t, 60.6, 61.1);
  if (kN > 0) {
    const Lf = m.fase === 'frenata' || (t > TB) ? -FORZA * (m.x - XB) : 0;
    ctx.save(); ctx.globalAlpha *= kN;
    drawRich(ctx, '{dim:lavoro}\n{dim:della frenata}', XL, 420, { size: 32 });
    numero(ctx, Lf, XL, 520, true);
    ctx.restore();
  }
  // l'energia cinetica, e la parte persa in frenata (tratteggiata)
  const kE = P(t, 22.2, 22.7);
  if (kE > 0) {
    const K = ec(m.v);
    ctx.save(); ctx.globalAlpha *= kE;
    barra(ctx, XE, K * BS, C.g);
    if (t > TB) { barra(ctx, XE, 64 * BS, C.dim, false); barra(ctx, XE, K * BS, C.g); }
    numero(ctx, K, XE, BY - K * BS - 28);
    conPedici(ctx, '{dim:energia cinetica} {mg:E}⌊c⌋', XE, BY + 38, { size: 32, align: 'center' });
    ctx.restore();
  }
  conPedici(ctx, '{v:teorema:}  {mink:L = Δ}{mg:E}⌊c⌋', 1480, 742, { size: 42, align: 'center', alpha: P(t, 46.8, 47.3) });
  ctx.restore();
}
function numero(ctx, j, x, y, neg = false) {   // joule interi, cifre ferme
  const s = (neg && j < -.5 ? '−' : '') + Math.round(Math.abs(j)) + ' J';
  M.fixedNum(ctx, s.replace(' J', ''), x + 14, y, 40, C.g);
  txt(ctx, 'J', x + 24, y, { size: 40, color: C.g, align: 'left' });
}

// 4 · doppia velocità (69,4–92,6): l'energia cinetica di un'auto di 1000 kg in funzione della velocità
const GO = [262, 700], GU = 36, GK = 2.4;               // 36 px per m/s, 2,4 px per kJ
const gp = (v, k) => [GO[0] + v * GU, GO[1] - k * GK];
const ecAuto = v => .5 * 1000 * v * v / 1000;           // in kJ
function sceneAuto(ctx, t) {
  if (t < 69.2 || t > 93) return;
  const al = life(t, 69.4, 92.8, .5, .5);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // assi
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const v of [5, 10, 15, 20]) { ctx.beginPath(); ctx.moveTo(...gp(v, 0)); ctx.lineTo(...gp(v, 215)); ctx.stroke(); }
  for (const k of [50, 100, 150, 200]) { ctx.beginPath(); ctx.moveTo(...gp(0, k)); ctx.lineTo(...gp(21.5, k)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...gp(0, 0)); ctx.lineTo(...gp(22, 0)); ctx.moveTo(...gp(0, 0)); ctx.lineTo(...gp(0, 222)); ctx.stroke();
  arrowHead(ctx, [gp(22, 0)[0] + 6, GO[1]], 0, C.ink); arrowHead(ctx, [GO[0], gp(0, 222)[1] - 6], -Math.PI / 2, C.ink);
  for (const v of [5, 10, 15, 20]) txt(ctx, String(v), gp(v, 0)[0], GO[1] + 30, { size: 30, color: C.dim });
  for (const k of [50, 100, 150, 200]) txt(ctx, migliaia(k * 1000), GO[0] - 14, gp(0, k)[1], { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'velocità (m/s)', gp(22, 0)[0], GO[1] + 66, { size: 30, color: C.dim, align: 'right' });
  conPedici(ctx, '{mg:E}⌊c⌋{dim: (J)}', GO[0] + 20, gp(0, 222)[1] + 4, { size: 34 });
  // la parabola
  const pts = []; for (let i = 0; i <= 80; i++) { const v = 20.8 * i / 80; pts.push(gp(v, ecAuto(v))); }
  M.glowStroke(ctx, pts, P(t, 69.7, 71.2), C.g, 5);
  // i due punti
  for (const [v, ta, nome] of [[10, 70.4, '50 000 J'], [20, 74.1, '200 000 J']]) {
    const k = P(t, ta, ta + .5);
    if (k <= 0) continue;
    const p = gp(v, ecAuto(v));
    dashed(ctx, gp(v, 0), p, C.x, k, .8); dashed(ctx, gp(0, ecAuto(v)), p, C.g, k, .8);
    M.dot(ctx, p, C.g, k, 11);
    drawRich(ctx, '{g:' + nome + '}', p[0] - 24, p[1] - 36, { size: 34, align: 'right', alpha: k });
  }
  drawRich(ctx, '{v:velocità doppia}\n{v:→ energia quadrupla}', 300, 370, { size: 34, align: 'left', alpha: P(t, 78.6, 79.1) });
  ctx.restore();
}
function schedaAuto(ctx, t) {
  if (t < 69.2 || t > 93) return;
  const al = life(t, 69.5, 92.8, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'un’auto di 1000 kg');
  conPedici(ctx, '{mg:E}⌊c⌋{mink: = ½·m·}{mx:v}{mink:²}', 1480, 240, { size: 40, align: 'center' });
  const riga = (sv, se, y, ta) => {
    const k = P(t, ta, ta + .5); if (k <= 0) return;
    drawRich(ctx, sv, 1190, y, { size: 36, align: 'left', alpha: k });
    drawRich(ctx, se, 1770, y, { size: 40, align: 'right', alpha: k });
  };
  riga('{mx:v} = 10 m/s', '{g:50 000 J}', 320, 69.6);
  riga('{mx:v} = 20 m/s', '{g:200 000 J}', 385, 74.0);
  const ks = P(t, 83.1, 83.6);
  ctx.save(); ctx.globalAlpha *= ks;
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 435); ctx.lineTo(1770, 435); ctx.stroke();
  conPedici(ctx, '{dim:spazio di frenata} = {mg:E}⌊c⌋ {mink:/} {my:F}', 1480, 485, { size: 36, align: 'center' });
  ctx.restore();
  // gli spazi di frenata con 5000 N, in scala (11 px per metro)
  for (const [d, y, ta] of [[10, 580, 87.9], [40, 680, 88.6]]) {
    const k = P(t, ta, ta + .7);
    if (k <= 0) continue;
    ctx.fillStyle = css(C.dim, .7); ctx.fillRect(1190, y - 14, d * 11 * k, 28);
    txt(ctx, d + ' m', 1190 + d * 11 * k + 14, y, { size: 36, weight: 600, color: C.ink, align: 'left', alpha: k });
    drawRich(ctx, '{dim:a ' + (d > 20 ? 20 : 10) + ' m/s}', 1190, y - 42, { size: 30, align: 'left', alpha: k });
  }
  ctx.restore();
}

// 5 · in una frase (92,6–102)
function sceneFine(ctx, t) {
  if (t < 92.5) return;
  const al = 1 - P(t, 99.9, 100.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.8 });
    drawRich(ctx, 'Il lavoro della risultante\ndiventa energia cinetica.', W / 2, 290, { size: 70, weight: 600, local: t - 93.2, stagger: .09 });
  });
  const pills = [[490, ''], [960, ''], [1430, 'velocità doppia:\nenergia {g:quadrupla}']];
  pills.forEach(([x, s], i) => {
    const a = 95.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    if (i === 0) conPedici(ctx, '{mg:E}⌊c⌋{mink: = ½·m·}{mx:v}{mink:²}', x, 505, { size: 42, align: 'center' });
    else if (i === 1) conPedici(ctx, '{mink:L = Δ}{mg:E}⌊c⌋', x, 505, { size: 42, align: 'center' });
    else drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, il carrello
    ['pop', 12.6, .5], ['pop', 17.3, .5],                                             // P e N non lavorano; la spinta 16 N
    ['tono', 22.2, 26.2, [.2, .24, .38, .59, .9]], ['ding', 26.3],                    // spinge: lavoro ed energia salgono a 64 J
    ['pop', 36.9, .6], ['ding', 46.8],                                                // Ec = ½·m·v²; il teorema
    ['pop', 60.6, .3], ['tono', 60.6, 64.6, [.9, .59, .38, .24, .2]], ['pop', 64.6, .2],   // la frenata: −64 J, si ferma
    ['soffio', 69.4], ['pop', 69.6, .4], ['traccia', 69.7, 71.2], ['pop', 70.4, .4],  // l'auto: 50 000 J a 10 m/s
    ['ding', 74.1],                                                                   // 200 000 J a 20 m/s
    ['pop', 78.6, .6], ['pop', 83.1, .5],                                             // energia quadrupla; spazio di frenata
    ['tono', 87.9, 88.6, [.3, .4]], ['tono', 88.6, 89.3, [.3, .8]], ['pop', 89.3, .7],   // 10 m e 40 m
    ['soffio', 92.8], ['pop', 95.2, .5], ['pop', 95.7, .6], ['pop', 96.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il lavoro diventa velocità', durata: 102, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.8, 'la spinta'], [31.8, 55.4, 'l’energia cinetica'], [55.4, 69.3, 'la frenata'], [69.3, 92.5, 'velocità doppia']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneCarrello(ctx, t); sceneBarre(ctx, t); sceneAuto(ctx, t); schedaAuto(ctx, t); sceneFine(ctx, t); },
  };
});
