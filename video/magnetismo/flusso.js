'use strict';
/* Le linee che tornano indietro — Gauss per il campo magnetico. Una calamita a sbarra verticale (300 px per 180) e sei linee di B
   calcolate davvero: il campo di una sbarra magnetizzata in modo uniforme è quello di un solenoide della stessa forma
   (40 spire circolari, integrali ellittici K ed E con la media aritmetico-geometrica), tracciato con Runge-Kutta. Si
   scelgono solo le linee che si chiudono dentro la scheda: escono dal nord, girano fuori, rientrano dal sud e proseguono
   dentro la calamita. Una superficie chiusa (vista di taglio: un'ellisse) attorno al polo nord: il flusso è contato come
   linee che escono meno linee che entrano, e i punti di passaggio sono calcolati sulle linee vere (6 e 6). Spostata e
   allargata, il conto cambia ma resta pari (6/6, 4/4, 2/2). Confronto con il campo elettrico: la carica Q è dentro la
   sua superficie, 12 linee escono e nessuna rientra, flusso Q/ε₀ (ε₀ ≈ 8,85·10⁻¹² C²/(N·m²), costante dielettrica del
   vuoto). Colori fissi del magnetismo: nord pieno scuro, sud chiaro col bordo, campo B C.g; carica positiva C.v.
   Argomento: magnetismo. */
CVIDEO.registra('magnetismo/flusso', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 83.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.1, 'felice'], [15.3, 'neutro'],
  [23.7, 'pensa'], [29.1, 'neutro'], [34.3, 'sorpreso'], [39.7, 'felice'], [42.0, 'neutro'], [44.7, 'pensa'],
  [50.1, 'felice'], [52.4, 'neutro'], [55.5, 'sorpreso'], [57.8, 'neutro'], [72.1, 'pensa'], [77.5, 'festa'],
  [80.0, 'felice'], [85.6, 'felice'], [89.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Quante linee di campo escono\nda una superficie chiusa?'],
  [7.9, 13.0, 'Una calamita: le linee del campo {mg:B}\nescono dal nord e rientrano nel sud.'],
  [13.1, 18.2, 'Dentro la calamita proseguono\ndal sud al nord: sono {g:chiuse}.'],
  [18.3, 23.6, 'Chiudo il polo nord in una superficie\nchiusa, qui vista di taglio.'],
  [23.7, 29.0, 'Il {g:flusso} di {mg:B} conta le linee: quelle\nche escono meno quelle che entrano.'],
  [29.1, 34.2, 'Dal polo nord le linee {g:escono}:\nle conto, sono 6.'],
  [34.3, 39.6, 'Ma le stesse linee {g:rientrano},\npassando dentro la calamita: 6.'],
  [39.7, 44.6, 'Escono 6, entrano 6:\nil flusso è {g:zero}.'],
  [44.7, 50.0, 'Sposto e allargo la superficie:\nil conto torna sempre zero.'],
  [50.1, 55.4, 'Ogni linea che entra deve anche uscire:\nle linee di {mg:B} non hanno un inizio.'],
  [55.5, 60.8, 'Con il campo elettrico {mink:E} è diverso:\nle linee partono dalla carica {mink:Q}.'],
  [60.9, 66.2, 'La carica è {g:dentro} la superficie:\nle linee escono tutte, nessuna rientra.'],
  [66.3, 72.0, 'Il flusso di {mink:E} è {mink:Q}/{mink:ε₀}: {mink:ε₀} è\nla costante dielettrica del vuoto.'],
  [72.1, 77.4, 'Per {mg:B} non ci sono «cariche magnetiche»\nda cui le linee partano.'],
  [77.5, 82.8, 'Così il flusso di {mg:B} attraverso\nogni superficie chiusa è {g:zero}.'],
  [85.6, 91.8, 'Le linee di {mg:B} sono chiuse:\nquante ne escono, tante ne rientrano.'],
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
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
const COL_B = () => mix(C.g, C.paper, .12);
// la sbarretta di calamite.js: a sinistra di xm il sud (chiaro), a destra il nord (scuro)
function sbarra(ctx, x0, x1, y, h, xm, kc = 1, al = 1, lettere = true) {
  if (al <= 0 || x1 - x0 < 1) return;
  const grigio = mix(C.dim, C.paper, .3), cS = mix(grigio, mix(C.dim, C.paper, .55), kc), cN = mix(grigio, C.ink, kc);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(x0, y - h / 2, x1 - x0, h, Math.min(10, h * .15)); ctx.save(); ctx.clip();
  ctx.fillStyle = css(cS); ctx.fillRect(x0, y - h / 2, Math.max(0, xm - x0), h);
  ctx.fillStyle = css(cN); ctx.fillRect(xm, y - h / 2, Math.max(0, x1 - xm), h);
  ctx.restore();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3; ctx.stroke();
  if (lettere && kc > 0) {
    const fs = Math.round(Math.min(h * .55, 56));
    if (xm - x0 > fs) txt(ctx, 'S', (x0 + xm) / 2, y + 2, { size: fs, weight: 600, color: C.ink, alpha: kc });
    if (x1 - xm > fs) txt(ctx, 'N', (xm + x1) / 2, y + 2, { size: fs, weight: 600, color: C.paper, alpha: kc });
  }
  ctx.restore();
}
function punto(ctx, p, pieno, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = pieno ? css(col) : C.paper; ctx.strokeStyle = css(col); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}

// ---------- il campo della calamita (come un solenoide della stessa forma) ----------
function KE(m) {
  let a = 1, b = Math.sqrt(1 - m), cc = Math.sqrt(m), s = .5 * cc * cc, p = 1;
  for (let i = 0; i < 12 && Math.abs(cc) > 1e-12; i++) { const an = (a + b) / 2; cc = (a - b) / 2; b = Math.sqrt(a * b); a = an; p *= 2; s += .5 * p * cc * cc; }
  const K = Math.PI / (2 * a); return [K, K * (1 - s)];
}
function anello(a, r, z) {   // [Bz, Br] di una spira di raggio a, in (r ≥ 0, z), a meno di una costante
  r = Math.max(r, 1e-6);
  const al2 = a * a + r * r + z * z - 2 * a * r, be2 = a * a + r * r + z * z + 2 * a * r, be = Math.sqrt(be2), m = 1 - al2 / be2;
  const ke = KE(m), K = ke[0], Ee = ke[1];
  return [((a * a - r * r - z * z) * Ee + al2 * K) / (2 * al2 * be), z * ((a * a + r * r + z * z) * Ee - al2 * K) / (2 * al2 * be * r)];
}
// la calamita è verticale (nord in alto): il campo si calcola con l'asse orizzontale (x lungo l'asse, nord a destra) e
// poi ogni punto si porta sullo schermo con (x, y) → (AX − (y − AY), AY − (x − AX)): l'asse va in verticale
const AX = 610, AY = 450, LM = 300, RM = 90, X0 = AX - LM / 2, X1 = AX + LM / 2;
const SPIRE = Array.from({ length: 40 }, (_, i) => X0 + LM * (i + .5) / 40);
const sullo = p => [AX - (p[1] - AY), AY - (p[0] - AX)];
function campo(x, y) {
  const r = Math.abs(AY - y), s = AY - y >= 0 ? 1 : -1; let bz = 0, br = 0;
  for (let i = 0; i < SPIRE.length; i++) { const q = anello(RM, r, x - SPIRE[i]); bz += q[0]; br += q[1]; }
  return [bz, -br * s];
}
function segui(p0) {
  const dir = (x, y) => { const b = campo(x, y), l = Math.hypot(b[0], b[1]) || 1; return [b[0] / l, b[1] / l]; };
  const pts = [p0]; let x = p0[0], y = p0[1];
  for (let i = 0; i < 4000; i++) {
    const h = 3, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
    x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (i > 40 && Math.hypot(x - p0[0], y - p0[1]) < 4.5) { pts.push(p0); return { pts, chiusa: true }; }
    pts.push([x, y]);
  }
  return { pts, chiusa: false };
}
// solo linee che si chiudono dentro la scheda: partono dal centro della calamita, a 55, 67, 79 px dall'asse (da entrambi i lati)
const LINEE = [];
[55, 67, 79].forEach(r0 => {
  const a = segui([AX, AY - r0]);
  if (!a.chiusa) return;
  let iF = 0; a.pts.forEach((p, i) => { if (AY - p[1] > AY - a.pts[iF][1]) iF = i; });
  LINEE.push({ pts: a.pts.map(sullo), iF });
  LINEE.push({ pts: a.pts.map(p => sullo([p[0], 2 * AY - p[1]])), iF });
});
function disegnaLinee(ctx, al, w = 3.5) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(COL_B()); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  LINEE.forEach(L => { ctx.beginPath(); L.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); });
  ctx.restore();
}
function punta(ctx, pts, i, al) {
  if (al <= 0 || i < 1 || i >= pts.length - 1) return;
  const a = pts[i - 1], b = pts[i + 1];
  ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, pts[i], Math.atan2(b[1] - a[1], b[0] - a[0]), COL_B(), 1); ctx.restore();
}
// la superficie chiusa (un'ellisse sullo schermo): centro a uc px sopra il centro della calamita, semiassi a (verticale) e b
function superficie(t) {
  if (t >= 72.2) return { uc: -150, a: 110, b: 150 };
  const k = P(t, 45.0, 49.5);
  return { uc: lerp(150, 0, k), a: lerp(110, 290, k), b: lerp(150, 400, k) };
}
// i punti dove le linee attraversano la superficie: entra = da fuori a dentro (nel verso del campo)
function passaggi(S) {
  const ins = p => Math.pow((p[0] - AX) / S.b, 2) + Math.pow((p[1] - (AY - S.uc)) / S.a, 2) < 1, out = [];
  LINEE.forEach(L => { for (let i = 1; i < L.pts.length; i++) { const a = ins(L.pts[i - 1]), b = ins(L.pts[i]); if (a !== b) out.push({ p: [(L.pts[i][0] + L.pts[i - 1][0]) / 2, (L.pts[i][1] + L.pts[i - 1][1]) / 2], entra: b }); } });
  return out;
}
// quanti punti si vedono: prima le uscite una alla volta, poi le entrate; dal 44,7 tutti
function visibili(t, pass) {
  const esc = pass.filter(q => !q.entra), ent = pass.filter(q => q.entra);
  if (t >= 44.7) return { esc, ent };
  const ne = Math.floor(clamp((t - 29.5) / .55 + 1, 0, esc.length)), ni = Math.floor(clamp((t - 34.7) / .55 + 1, 0, ent.length));
  return { esc: esc.slice(0, ne), ent: ent.slice(0, ni) };
}

// i punti fuori dalla calamita si disegnano uno per uno; quelli dentro (a 12 px l'uno dall'altro) piccoli, e accanto a
// ciascun gruppo, fuori dalla calamita, il numero dei punti
const DENTRO_M = p => Math.abs(p[0] - AX) < RM + 4 && Math.abs(p[1] - AY) < LM / 2 + 4;
function gruppi(ctx, punti, pieno, al) {
  if (al <= 0) return;
  const lati = [[], []];
  punti.forEach(q => { if (DENTRO_M(q.p)) lati[q.p[0] < AX ? 0 : 1].push(q); else punto(ctx, q.p, pieno, C.g, al); });
  lati.forEach((g, i) => {
    if (!g.length) return;
    g.forEach(q => { ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = pieno ? css(C.g) : C.paper; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(q.p[0], q.p[1], 4.5, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); });
    const y = g.reduce((s, q) => s + q.p[1], 0) / g.length, x = i ? AX + RM + 40 : AX - RM - 40;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 22, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, String(g.length), x, y + 1, { size: 32, weight: 700, color: C.g, alpha: al });
  });
}

// ---------- 1 · la calamita e la superficie chiusa ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const aCalamita = t => Math.max(life(t, 7.8, 55.7, .5, .5), life(t, 72.2, T_FINE + .1, .5, .5));
const MAG = [AX - RM, AY - LM / 2, 2 * RM, LM];   // la calamita sullo schermo: x, y, larghezza, altezza
function sceneCalamita(ctx, t) {
  const al = aCalamita(t);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 6, CARTA[1] + 6, CARTA[2] - 12, CARTA[3] - 12); ctx.clip();
  const S = superficie(t), kS = t < 72 ? P(t, 18.6, 19.2) : P(t, 77.8, 78.3), cy = AY - S.uc;
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.fillStyle = css(C.dim, .1); ctx.beginPath(); ctx.ellipse(AX, cy, S.b, S.a, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  // la sbarretta, ruotata: il nord in alto (le lettere restano dritte)
  const km = P(t, 7.9, 8.5);
  ctx.save(); ctx.translate(AX, AY); ctx.rotate(-Math.PI / 2); sbarra(ctx, -LM / 2, LM / 2, 0, 2 * RM, 0, 1, km, false); ctx.restore();
  txt(ctx, 'N', AX, AY - LM / 4, { size: 56, weight: 600, color: C.paper, alpha: km });
  txt(ctx, 'S', AX, AY + LM / 4, { size: 56, weight: 600, color: C.ink, alpha: km });
  // le linee: prima la parte fuori dalla calamita, poi quella dentro (sopra la calamita, perché si veda)
  const kO = t > 72 ? 1 : P(t, 8.4, 9.8), kI = t > 72 ? 1 : P(t, 13.3, 14.3);
  if (kO > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1080); ctx.rect(MAG[0], MAG[1], MAG[2], MAG[3]); ctx.clip('evenodd');
    ctx.beginPath(); ctx.rect(AX - 500 * kO, 0, 1000 * kO, 1080); ctx.clip();
    disegnaLinee(ctx, 1); ctx.restore();
    LINEE.forEach(L => punta(ctx, L.pts, L.iF, P(t, 9.6, 10.0) + (t > 72 ? 1 : 0)));
  }
  if (kI > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(MAG[0], AY - LM / 2 * kI, MAG[2], LM * kI); ctx.clip();
    disegnaLinee(ctx, 1, 3.5); ctx.restore();
    LINEE.forEach(L => punta(ctx, L.pts, 8, P(t, 14.1, 14.5) + (t > 72 ? 1 : 0)));
  }
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(AX, cy, S.b, S.a, 0, 0, TAU); ctx.stroke(); ctx.restore();
    const v = visibili(t, passaggi(S));
    gruppi(ctx, v.esc, true, kS);
    gruppi(ctx, v.ent, false, kS);
    if (t < 44.7 || t > 72) txt(ctx, 'superficie chiusa', AX, t > 72 ? cy + S.a + 26 : cy - S.a - 26, { size: 30, color: C.dim, alpha: kS });
  }
  ctx.restore();
}

// ---------- 2 · il campo elettrico di una carica, con la carica dentro la superficie ----------
const N_E = 12, R_SUP_E = 150;
function sceneCarica(ctx, t) {
  const al = life(t, 55.8, 72.4, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 6, CARTA[1] + 6, CARTA[2] - 12, CARTA[3] - 12); ctx.clip();
  const kS = P(t, 61.0, 61.5);
  if (kS > 0) { ctx.save(); ctx.globalAlpha *= kS; ctx.fillStyle = css(C.dim, .1); ctx.beginPath(); ctx.arc(AX, AY, R_SUP_E, 0, TAU); ctx.fill(); ctx.restore(); }
  const kl = P(t, 56.2, 57.4);
  for (let i = 0; i < N_E; i++) {
    const f = i * TAU / N_E, u = [Math.cos(f), Math.sin(f)];
    ctx.save(); ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(AX + u[0] * 34, AY + u[1] * 34); ctx.lineTo(AX + u[0] * (34 + 560 * kl), AY + u[1] * (34 + 560 * kl)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 57.2, 57.6); arrowHead(ctx, [AX + u[0] * 262, AY + u[1] * 262], f, mix(C.ink, C.paper, .35), 1); ctx.restore();
  }
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(AX, AY, R_SUP_E, 0, TAU); ctx.stroke(); ctx.restore();
    for (let i = 0; i < N_E; i++) { const f = i * TAU / N_E; punto(ctx, [AX + Math.cos(f) * R_SUP_E, AY + Math.sin(f) * R_SUP_E], true, C.ink, P(t, 61.4 + i * .25, 61.6 + i * .25)); }
    ctx.save(); ctx.globalAlpha *= kS; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(AX + 150 - 125, AY - R_SUP_E - 52, 250, 44, 10); ctx.fill(); ctx.restore();
    txt(ctx, 'superficie chiusa', AX + 150, AY - R_SUP_E - 30, { size: 30, color: C.dim, alpha: kS });
  }
  const kq = P(t, 55.9, 56.4, E.back);
  if (kq > 0) {
    ctx.save(); ctx.globalAlpha *= Math.min(1, kq); ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(AX, AY, 26 * kq, 0, TAU); ctx.fill(); ctx.restore();
    txt(ctx, '+', AX, AY + 1, { size: 40, weight: 700, color: C.paper, alpha: Math.min(1, kq) });
    ctx.save(); ctx.globalAlpha *= Math.min(1, kq); ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(AX + 57, AY - 57, 20, 0, TAU); ctx.fill(); ctx.restore();
    drawRich(ctx, '{mink:Q}', AX + 57, AY - 57, { size: 40, alpha: Math.min(1, kq) });
  }
  ctx.restore();
}

// ---------- il pannello ----------
function riga(ctx, y, pieno, s, n, al, col) {
  if (al <= 0) return;
  punto(ctx, [1240, y], pieno, col, al);
  drawRich(ctx, s, 1268, y, { size: 32, align: 'left', alpha: al });
  txt(ctx, String(n), 1740, y, { size: 40, weight: 600, align: 'right', alpha: al });
}
function scenePannello(ctx, t) {
  const al = life(t, 7.9, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const cx = 1480;
  // la calamita (7,9–55,6 e 77,4–fine)
  const kA = aCalamita(t);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    const fin = t > 72, kFin = P(t, 77.8, 78.3);   // nel finale le righe del conto tornano con la superficie attorno al sud
    drawRich(ctx, '{mg:B}{dim:: campo magnetico}', cx, 170, { size: 32, local: fin ? 9 : t - 8.0 });
    drawRich(ctx, '{dim:le sue linee sono chiuse}', cx, 218, { size: 30, local: fin ? 9 : t - 13.4 });
    separa(ctx, 262, fin ? 1 : P(t, 23.7, 24.1));
    conFont(TITOLI, () => drawRich(ctx, '{g:flusso}', cx, 312, { size: 40, weight: 600, local: fin ? 9 : t - 23.8 }));
    drawRich(ctx, '{dim:linee che escono − linee che entrano}', cx, 362, { size: 30, local: fin ? 9 : t - 24.1 });
    const v = visibili(t, passaggi(superficie(t)));
    riga(ctx, 435, true, '{dim:escono}', v.esc.length, fin ? kFin : P(t, 29.2, 29.6), C.g);
    riga(ctx, 490, false, '{dim:entrano}', v.ent.length, fin ? kFin : P(t, 34.4, 34.8), C.g);
    drawRich(ctx, '{dim:flusso =} ' + v.esc.length + ' − ' + v.ent.length + ' = {g:0}', cx, 565, { size: 42, alpha: fin ? kFin : P(t, 39.8, 40.3) });
    drawRich(ctx, '{dim:per ogni superficie chiusa}', cx, 650, { size: 30, alpha: P(t, 77.8, 78.3) });
    drawRich(ctx, '{dim:flusso di} {mg:B} = {g:0}', cx, 708, { size: 46, alpha: P(t, 78.2, 78.7) });
    ctx.restore();
  }
  // la carica (55,6–77,4)
  const kE = life(t, 55.8, 72.4, .5, .5);
  if (kE > 0) {
    ctx.save(); ctx.globalAlpha *= kE;
    drawRich(ctx, '{mink:E}{dim:: campo elettrico}', cx, 170, { size: 32 });
    drawRich(ctx, '{dim:le linee partono dalla carica}', cx, 218, { size: 30, local: t - 56.2 });
    separa(ctx, 262, 1);
    conFont(TITOLI, () => drawRich(ctx, '{g:flusso}', cx, 312, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:linee che escono − linee che entrano}', cx, 362, { size: 30 });
    const ne = Math.floor(clamp((t - 61.4) / .25 + 1, 0, N_E));
    riga(ctx, 435, true, '{dim:escono}', ne, P(t, 61.2, 61.6), C.ink);
    riga(ctx, 490, false, '{dim:entrano}', 0, P(t, 61.2, 61.6), C.ink);
    drawRich(ctx, '{dim:flusso di} {mink:E} = {mink:Q}/{mink:ε₀}', cx, 570, { size: 44, local: t - 66.4 });
    drawRich(ctx, '{mink:ε₀ ≈ 8,85·10⁻¹²} C²/(N·m²)', cx, 640, { size: 32, local: t - 67.0 });
    drawRich(ctx, '{dim:costante dielettrica del vuoto}', cx, 690, { size: 30, local: t - 67.4 });
    ctx.restore();
  }
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le linee che tornano indietro', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, T_FINE + 9.4, T_FINE + 10.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Le linee di B non cominciano mai:\nil flusso da una superficie chiusa è zero.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{dim:flusso = linee che escono}\n{dim:− linee che entrano}'], [960, '{dim:per} {mg:B}{dim: sempre} {g:0}{dim:: le linee}\n{dim:rientrano dentro la calamita}'], [1470, '{dim:per} {mink:E}{dim::} {mink:Q}/{mink:ε₀}\n{dim:con la carica dentro}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): un pop per ogni linea che esce (sempre più alto) e per ogni linea che
  // rientra (sempre più basso); quando la superficie si allarga il tono segue la sua altezza; per la carica il tono
  // segue il conto delle linee che escono, da 0 a 12
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .45],                                               // la calamita
    ['traccia', 8.4, 9.8], ['pop', 9.7, .4],                                          // le linee fuori, il verso
    ['traccia', 13.3, 14.3], ['pop', 14.2, .4],                                       // le linee dentro: chiuse
    ['pop', 18.7, .5],                                                                // la superficie chiusa
    ['pop', 23.9, .5],                                                                // il flusso
    ['pop', 29.5, .3], ['pop', 30.05, .35], ['pop', 30.6, .4],                        // escono: 6
    ['pop', 31.15, .45], ['pop', 31.7, .5], ['pop', 32.25, .55],
    ['pop', 34.7, .55], ['pop', 35.25, .5], ['pop', 35.8, .45],                       // entrano: 6
    ['pop', 36.35, .4], ['pop', 36.9, .35], ['pop', 37.45, .3],
    ['ding', 40.0],                                                                   // flusso = 6 − 6 = 0
    ['tono', 45.0, 49.5, [.2, .21, .29, .5, .71, .79, .8]], ['ding', 49.7],           // sposto e allargo: ancora 0
    ['soffio', 55.8], ['pop', 56.0, .55], ['traccia', 56.2, 57.4],                    // la carica Q e le sue linee
    ['pop', 61.1, .45], ['tono', 61.4, 64.2, [.2, .34, .48, .62, .76, .9]],           // escono tutte: 12, nessuna rientra
    ['pop', 66.5, .6], ['ding', 66.8], ['pop', 67.1, .4],                             // Q/ε₀, ε₀
    ['soffio', 72.2], ['pop', 77.9, .5], ['pop', 78.3, .6],                           // flusso di B = 0, sempre
    ['soffio', 83.2], ['pop', 85.4, .5], ['pop', 85.9, .6], ['pop', 86.4, .7],        // in una frase
  ];
  return {
    titolo: 'Le linee che tornano indietro', durata: 94.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 23.6, 'le linee chiuse'], [23.6, 55.4, 'il flusso di B'], [55.4, 72.1, 'e il campo elettrico?']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCalamita(ctx, t); sceneCarica(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
