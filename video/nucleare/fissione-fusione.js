'use strict';
/* Spezzare o unire — la curva dell'energia di legame per nucleone (valori veri, in MeV: deuterio 1,112, elio-4 7,074,
   ferro-56 8,790, uranio-235 7,591) e le due strade verso il ferro. 1 MeV = 10⁶ eV = 1,6·10⁻¹³ J. Fissione: n + ²³⁵U →
   ⁹²Kr + ¹⁴¹Ba + 3 n; i frammenti (8,51 e 8,33 MeV per nucleone, media ≈ 8,4) sono ≈ 0,8 MeV per nucleone più legati
   dell'uranio: 0,8 · 235 ≈ 190 MeV, con i decadimenti dei frammenti ≈ 200 MeV; bruciare un atomo di carbonio ne dà ≈ 4 eV
   (393 kJ/mol), cinquanta milioni di volte meno. (La reazione a catena è un'altra idea: qui non c'è.) Fusione nel Sole:
   4 ¹H → ⁴He + 2 e⁺ + 2 ν, 26,7 MeV (dal difetto di massa 0,0287 u · 931,5 MeV/u), 6,7 MeV per nucleone; i nuclei vanno
   spinti a contatto contro la repulsione: nel Sole ≈ 15 milioni di kelvin. L'idrogeno-1 (un protone solo) ha energia di
   legame 0: è il punto da cui parte la freccia della fusione.
   Colori: energia e risultati C.g, protoni C.v, neutroni C.dim, la cosa nuova (fissione/fusione) C.v. Argomento: nucleare. */
CVIDEO.registra('nucleare/fissione-fusione', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke } = M;
  const TAU = Math.PI * 2;

const T_FINE = 86.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.6, 'felice'], [22.8, 'neutro'],
  [30.8, 'felice'], [35.0, 'neutro'], [39.9, 'pensa'], [44.5, 'sorpreso'], [49.3, 'neutro'], [54.1, 'felice'], [58.9, 'sorpreso'],
  [64.0, 'felice'], [68.9, 'neutro'], [75.5, 'festa'], [81.0, 'pensa'],
  [89.2, 'felice'], [93.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Spezzare un nucleo o unirne due:\nda dove esce l’energia?'],
  [7.9, 12.7, 'Per separare tutti i nucleoni serve\nenergia: è l’{g:energia di legame}.'],
  [12.8, 17.5, 'Si misura in {g:MeV}, megaelettronvolt:\nun milione di elettronvolt.'],
  [17.6, 22.7, 'Divisa per i nucleoni è l’energia\n{g:per nucleone}: sale, poi scende piano.'],
  [22.8, 26.6, 'Il deuterio, 1 protone e 1 neutrone:\nappena 1,1.'],
  [26.7, 30.7, 'L’elio-4 sale già a 7,1 MeV.'],
  [30.8, 34.9, 'Il massimo è al {g:ferro-56}:\n8,8 MeV per nucleone.'],
  [35.0, 39.8, 'L’uranio, in fondo, 7,6: i nuclei grandi\nsono {g:meno legati} del ferro.'],
  [39.9, 44.4, 'Andare verso il ferro, da una parte\no dall’altra, {g:libera} energia.'],
  [44.5, 49.2, '{v:Fissione}: un neutrone urta l’uranio-235,\nche si spezza in due frammenti.'],
  [49.3, 54.0, 'I frammenti sono più legati:\ncirca 0,8 MeV in più per nucleone.'],
  [54.1, 58.8, 'Per 235 nucleoni: circa {g:200 MeV}\nda ogni nucleo spezzato.'],
  [58.9, 63.9, 'Bruciare un atomo di carbonio ne dà 4 eV:\ncinquanta milioni di volte meno.'],
  [64.0, 68.8, '{v:Fusione}: dall’altra parte, unire nuclei\nleggeri. Nel Sole: da idrogeno a elio.'],
  [68.9, 75.4, 'Quattro protoni → un elio-4,\npiù 2 positroni e 2 neutrini: 26,7 MeV.'],
  [75.5, 80.9, 'Per nucleone è molto più della fissione:\n6,7 MeV contro 0,8.'],
  [81.0, 86.4, 'La repulsione li tiene lontani:\nnel Sole la superano grazie ai {g:quanti}.'],
  [89.2, 95.2, 'Verso il ferro si libera energia:\nspezzando i grandi o unendo i piccoli.'],
];

// ---------- la fisica: energia di legame per nucleone (MeV), lungo la valle di stabilità ----------
const BE = [[2, 1.112], [3, 2.827], [4, 7.074], [6, 5.332], [7, 5.606], [9, 6.463], [10, 6.475], [11, 6.928], [12, 7.680],
  [14, 7.476], [16, 7.976], [19, 7.779], [20, 8.032], [23, 8.112], [24, 8.261], [27, 8.332], [28, 8.448], [32, 8.493],
  [35, 8.520], [40, 8.551], [45, 8.619], [48, 8.723], [52, 8.776], [56, 8.790], [58, 8.732], [60, 8.781], [62, 8.795],
  [63, 8.752], [64, 8.736], [70, 8.722], [75, 8.701], [80, 8.711], [84, 8.717], [90, 8.710], [96, 8.654], [100, 8.605],
  [110, 8.551], [119, 8.499], [130, 8.438], [140, 8.376], [150, 8.250], [160, 8.184], [170, 8.107], [180, 8.035],
  [190, 7.962], [197, 7.916], [208, 7.867], [220, 7.702], [226, 7.662], [232, 7.615], [235, 7.591], [238, 7.570]];
const KR92 = [92, 8.513], BA141 = [141, 8.326];      // i frammenti della fissione (fuori dalla valle: più ricchi di neutroni)
const EV_J = 1.602176634e-19;                         // 1 MeV = 1,6·10⁻¹³ J

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
function generatore(seme) {
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function nucleone(ctx, p, protone, r = 34, al = 1) {
  if (al <= 0.01) return;
  const col = protone ? C.v : mix(C.dim, C.paper, .25);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  if (protone && r >= 12) {
    ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(2.5, r * .17); ctx.lineCap = 'round';
    const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0); ctx.moveTo(0, -a); ctx.lineTo(0, a); ctx.stroke();
  }
  ctx.restore();
}
function nucleo(Z, N, rN, seme) {
  const A = Z + N, rnd = generatore(seme), tipi = [];
  for (let i = 0; i < A; i++) tipi.push(i < Z);
  for (let i = A - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const s = tipi[i]; tipi[i] = tipi[j]; tipi[j] = s; }
  const pts = [];
  for (let i = 0; i < A; i++) { const rr = 1.08 * rN * Math.sqrt(i + .3), a = i * 2.39996323; pts.push({ x: rr * Math.cos(a), y: rr * Math.sin(a), p: tipi[i], rr }); }
  pts.sort((a, b) => b.rr - a.rr);
  return pts;
}
function disegnaNucleo(ctx, pts, cx, cy, rN, al = 1, sc = 1) { if (al > 0.01 && sc > 0.01) for (const q of pts) nucleone(ctx, [cx + q.x * sc, cy + q.y * sc], q.p, rN * sc, al); }
const U235 = nucleo(92, 143, 7, 235), KR = nucleo(36, 56, 7, 92), BA = nucleo(56, 85, 7, 141), HE4 = nucleo(2, 2, 16, 4);
function positrone(ctx, x, y, al = 1, r = 9) {
  if (al <= 0.01) return;
  // come nel video sulla radioattività: contorno azzurro e + azzurro (il protone è viola pieno)
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * .5, y); ctx.lineTo(x + r * .5, y); ctx.moveTo(x, y - r * .5); ctx.lineTo(x, y + r * .5); ctx.stroke(); ctx.restore();
}
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function nuclide(ctx, A, Z, sym, x, y, size, al = 1, col, misura = false) {
  const sz = Math.round(size * .52), c = col || C.ink;
  ctx.save(); ctx.font = `600 ${sz}px Lexend, "Segoe UI", sans-serif`;
  const wn = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
  ctx.font = `600 ${size}px Lexend, "Segoe UI", sans-serif`; const ws = ctx.measureText(sym).width;
  ctx.restore();
  if (!misura && al > 0) {
    txt(ctx, String(A), x + wn, y - size * .3, { size: sz, color: c, align: 'right', alpha: al });
    txt(ctx, String(Z), x + wn, y + size * .32, { size: sz, color: c, align: 'right', alpha: al });
    txt(ctx, sym, x + wn + 5, y, { size, weight: 600, color: c, align: 'left', alpha: al });
  }
  return wn + 5 + ws;
}
function reazione(ctx, pezzi, cx, y, size, al = 1) {
  if (al <= 0) return;
  const gap = size * .3;
  const ws = pezzi.map(p => typeof p === 'string' ? (ctx.save(), ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`, (w => (ctx.restore(), w))(ctx.measureText(p.replace(/\{[a-z]+:|\}/g, '')).width)) : nuclide(ctx, p.A, p.Z, p.s, 0, 0, size, 0, null, true));
  const tot = ws.reduce((s, w) => s + w, 0) + gap * (pezzi.length - 1);
  let x = cx - tot / 2;
  pezzi.forEach((p, i) => {
    if (typeof p === 'string') drawRich(ctx, p, x, y, { size, align: 'left', alpha: al });
    else nuclide(ctx, p.A, p.Z, p.s, x, y, size, al, p.col);
    x += ws[i] + gap;
  });
}

// ---------- il grafico (sinistra) ----------
const SX = [110, 110, 1000, 680], DX = [1150, 110, 660, 680], PX = 1480;
const GX0 = 210, GY0 = 740, PX_A = 3.44, PX_MEV = 460 / 9;
const gx = A => GX0 + A * PX_A, gy = e => GY0 - e * PX_MEV;
const CURVA = BE.map(([A, e]) => [gx(A), gy(e)]);
const FE = BE.find(p => p[0] === 56), U = BE.find(p => p[0] === 235), D2 = BE[0], HE = BE[2];
function puntoLabel(ctx, p, col, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(gx(p[0]), gy(p[1]), 9, 0, TAU); ctx.fill(); ctx.restore(); }
function sceneGrafico(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // assi (da 17,6)
  const ka = P(t, 17.6, 18.4);
  if (ka > 0) {
    ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(GX0 - 4, GY0); ctx.lineTo(1082, GY0); ctx.moveTo(GX0, GY0 + 4); ctx.lineTo(GX0, 262); ctx.stroke();
    arrowHead(ctx, [1088, GY0], 0, C.ink); arrowHead(ctx, [GX0, 256], -Math.PI / 2, C.ink);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let A = 50; A <= 250; A += 50) { ctx.beginPath(); ctx.moveTo(gx(A), GY0 - 2); ctx.lineTo(gx(A), 275); ctx.stroke(); }
    for (let e = 2; e <= 8; e += 2) { ctx.beginPath(); ctx.moveTo(GX0 + 2, gy(e)); ctx.lineTo(1075, gy(e)); ctx.stroke(); }
    for (let A = 50; A <= 250; A += 50) txt(ctx, String(A), gx(A), GY0 + 28, { size: 30, color: C.dim });
    for (let e = 2; e <= 8; e += 2) txt(ctx, String(e), GX0 - 12, gy(e), { size: 30, color: C.dim, align: 'right' });
    drawRich(ctx, '{mink:A} {dim:(numero di massa)}', 1075, 708, { size: 30, align: 'right' });
    drawRich(ctx, '{dim:energia di legame}\n{dim:per nucleone (MeV)}', 262, 500, { size: 30, align: 'left', lh: 1.25 });
    ctx.restore();
  }
  // la curva si disegna (18,2–22,2)
  const kc = P(t, 18.2, 22.2);
  if (kc > 0) glowStroke(ctx, CURVA, kc, C.y, 5);
  // i punti con nome
  const kd = P(t, 23.0, 23.5), kh = P(t, 26.9, 27.4), kf = P(t, 31.1, 31.6), ku = P(t, 35.1, 35.6);
  puntoLabel(ctx, D2, C.y, kd); drawRich(ctx, '{dim:deuterio:} 1,1', 330, 655, { size: 30, align: 'left', alpha: kd });
  puntoLabel(ctx, HE, C.y, kh); drawRich(ctx, '{dim:elio-4:} 7,1', 330, 420, { size: 30, align: 'left', alpha: kh });
  puntoLabel(ctx, FE, C.g, kf); drawRich(ctx, '{g:ferro-56: 8,8 MeV}', gx(56), gy(FE[1]) - 42, { size: 32, alpha: kf });
  puntoLabel(ctx, U, C.y, ku); drawRich(ctx, '{dim:uranio-235:} 7,6', 1080, gy(U[1]) + 50, { size: 30, align: 'right', alpha: ku });
  // le due strade verso il ferro: dall'uranio ai frammenti (fissione), dall'idrogeno all'elio (fusione)
  const kv = P(t, 40.0, 40.8), kFis = P(t, 44.6, 45.2), kFus = P(t, 63.8, 64.4);
  if (kv > 0) {
    const aF = lerp(.45, 1, kFis), aU = lerp(.45, 1, kFus);
    // l'idrogeno-1: un protone solo, niente da legare (0): da qui parte la freccia della fusione
    puntoLabel(ctx, [1, 0], C.y, kv); drawRich(ctx, '{dim:idrogeno-1:} 0', 330, 705, { size: 30, align: 'left', alpha: kv });
    freccia(ctx, [gx(228), gy(U[1]) - 28], [gx(130), gy(8.42) - 30], C.g, kv * aF, 6);
    freccia(ctx, [gx(1) + 22, gy(0) - 14], [gx(4) + 26, gy(HE[1]) + 24], C.g, kv * aU, 6);
    drawRich(ctx, '{g:verso il ferro: si libera energia}', 660, 170, { size: 32, alpha: P(t, 40.6, 41.1) * (1 - kFis) });
    drawRich(ctx, '{v:fissione}', gx(175), gy(8.0) - 60, { size: 34, alpha: kFis });
    drawRich(ctx, '{v:fusione}', 262, 590, { size: 34, align: 'left', alpha: kFus });
  }
  // i frammenti sulla curva: due punti verdi
  const kfr = P(t, 49.4, 50.0);
  if (kfr > 0) {
    puntoLabel(ctx, KR92, C.g, kfr); puntoLabel(ctx, BA141, C.g, kfr);
    drawRich(ctx, '{g:frammenti: ≈ 8,4}', gx(130), gy(8.4) + 46, { size: 30, alpha: kfr });
    drawRich(ctx, '{g:+ 0,8 MeV per nucleone}', gx(130), gy(8.4) + 82, { size: 30, alpha: P(t, 50.2, 50.7) });
  }
  ctx.restore();
}

// ---------- il pannello (destra) ----------
function scenePannello(ctx, t) {
  // 1 · energia di legame e MeV (7,9–37,2)
  const a1 = life(t, 7.9, 44.5, .5, .4);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    titoletto(ctx, 'energia di legame', PX, 170, P(t, 8, 8.5));
    drawRich(ctx, '{dim:per separare tutti i nucleoni}', PX, 232, { size: 30, local: t - 8.6 });
    drawRich(ctx, '{dim:serve energia}', PX, 274, { size: 30, local: t - 9.2 });
    separa(ctx, 314, P(t, 12.8, 13.2));
    drawRich(ctx, '1 eV = 1,6·10{mink:⁻¹⁹} J', PX, 362, { size: 34, local: t - 13 });
    drawRich(ctx, '1 {g:MeV} = 10{mink:⁶} eV = 1,6·10{mink:⁻¹³} J', PX, 414, { size: 34, local: t - 14.2 });
    drawRich(ctx, '{dim:(megaelettronvolt)}', PX, 458, { size: 30, local: t - 15.4 });
    separa(ctx, 498, P(t, 22.8, 23.2));
    drawRich(ctx, '{dim:per nucleone:}', PX, 536, { size: 30, local: t - 22.9 });
    drawRich(ctx, '{dim:deuterio} 1,1{dim:,}', PX - 8, 584, { size: 32, align: 'right', local: t - 23.2 });
    drawRich(ctx, '{dim:elio-4} 7,1', PX + 8, 584, { size: 32, align: 'left', local: t - 26.9 });
    drawRich(ctx, '{g:ferro-56: 8,8 MeV}', PX, 636, { size: 36, local: t - 31.3 });
    drawRich(ctx, '{dim:uranio-235} 7,6', PX, 686, { size: 32, local: t - 35.2 });
    drawRich(ctx, '{dim:verso il ferro:} {g:si libera energia}', PX, 746, { size: 30, local: t - 40.2 });
    ctx.restore();
  }
  // 2 · la fissione (44,5–64): il neutrone arriva, l'uranio si spezza
  const a2 = life(t, 44.5, 64.0, .5, .4);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    titoletto(ctx, '{v:fissione}', PX, 170, P(t, 44.6, 45.1));
    const YN = 330, kSplit = P(t, 46.8, 48.2, E.out), d = 110 * kSplit;
    // il neutrone in arrivo (45,1–46,7)
    const xn = lerp(1200, PX - 95, P(t, 45.1, 46.7, E.lin));
    if (t < 46.8) nucleone(ctx, [xn, YN], false, 10, P(t, 45.1, 45.4));
    if (kSplit <= 0) disegnaNucleo(ctx, U235, PX, YN, 7, 1, P(t, 44.7, 45.3, E.back));
    else {
      disegnaNucleo(ctx, KR, PX - d - 20, YN - d * .2, 7, 1, 1);
      disegnaNucleo(ctx, BA, PX + d + 10, YN + d * .1, 7, 1, 1);
      // tre neutroni che schizzano via
      [[-1, -.75], [1, -.6], [-.5, -1]].forEach(([ux, uy], i) => { const L = 60 + 150 * kSplit; nucleone(ctx, [PX + ux * L, YN + uy * L * .8], false, 9, P(kSplit, .15, .4, E.lin)); });
    }
    txt(ctx, 'uranio-235', PX, 462, { size: 30, color: C.dim, alpha: P(t, 45.1, 45.5) * (1 - kSplit) });
    txt(ctx, 'due frammenti + 3 neutroni', PX, 462, { size: 30, color: C.dim, alpha: kSplit });
    separa(ctx, 496, P(t, 49.0, 49.4));
    reazione(ctx, ['n', '+', { A: 235, Z: 92, s: 'U' }, '→', { A: 92, Z: 36, s: 'Kr' }, '+', { A: 141, Z: 56, s: 'Ba' }, '+', '3 n'], PX, 540, 32, P(t, 49.1, 49.6));
    drawRich(ctx, '{dim:frammenti:} ≈ 8,4 MeV {dim:per nucleone}', PX, 596, { size: 30, local: t - 49.8 });
    drawRich(ctx, '≈ 0,8 MeV · 235 ≈ 190 MeV', PX, 644, { size: 32, local: t - 54.2 });
    drawRich(ctx, '{dim:+ i decadimenti dei frammenti:} {g:≈ 200 MeV}', PX, 690, { size: 30, local: t - 55.6 });
    drawRich(ctx, '{dim:bruciare un atomo di carbonio: 4 eV}', PX, 746, { size: 30, local: t - 59.0 });
    ctx.restore();
  }
  // 3 · la fusione nel Sole (64–86)
  const a4 = life(t, 64.0, T_FINE + .1, .5, .4);
  if (a4 > 0) {
    ctx.save(); ctx.globalAlpha *= a4;
    titoletto(ctx, '{v:fusione}', PX, 170, P(t, 64.1, 64.6));
    const YF = 320, kIn = P(t, 64.7, 67.7, E.io), kHe = P(t, 70.6, 71.2, E.back);
    // quattro protoni che convergono (non è il moto vero: nel Sole avviene in più passi e in tempi lunghissimi)
    if (kHe < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([ux, uy]) => { const L = lerp(150, 22, kIn); nucleone(ctx, [PX + ux * L, YF + uy * L * .7], true, 16, P(t, 64.2, 64.7) * (1 - kHe)); });
    disegnaNucleo(ctx, HE4, PX, YF, 16, kHe, kHe);
    // due positroni e due neutrini che escono
    const kOut = P(t, 71.0, 72.3, E.out);
    if (kOut > 0) {
      positrone(ctx, PX - 60 - 90 * kOut, YF - 40 - 50 * kOut, P(kOut, 0, .3, E.lin)); positrone(ctx, PX + 60 + 90 * kOut, YF + 40 + 50 * kOut, P(kOut, 0, .3, E.lin));
      drawRich(ctx, '{dim:ν}', PX + 70 + 110 * kOut, YF - 60 - 30 * kOut, { size: 30, alpha: P(kOut, 0, .3, E.lin) });
      drawRich(ctx, '{dim:ν}', PX - 70 - 110 * kOut, YF + 60 + 30 * kOut, { size: 30, alpha: P(kOut, 0, .3, E.lin) });
    }
    txt(ctx, 'quattro protoni', PX, 452, { size: 30, color: C.dim, alpha: P(t, 64.3, 64.7) * (1 - kHe) });
    txt(ctx, 'elio-4 + 2 positroni + 2 neutrini', PX, 452, { size: 30, color: C.dim, alpha: kHe });
    separa(ctx, 486, P(t, 70.6, 71.0));
    reazione(ctx, ['4', { A: 1, Z: 1, s: 'H' }, '→', { A: 4, Z: 2, s: 'He' }, '+', '2 {x:e⁺}', '+', '2 {dim:ν}'], PX, 530, 34, P(t, 71.3, 71.8));
    drawRich(ctx, '{g:26,7 MeV}', PX, 586, { size: 38, local: t - 73.3 });
    drawRich(ctx, '{dim:per nucleone:} 26,7 / 4 ≈ {g:6,7 MeV}', PX, 638, { size: 30, local: t - 75.6 });
    drawRich(ctx, '{dim:(fissione: 0,8)}', PX, 678, { size: 30, local: t - 77.3 });
    drawRich(ctx, '{dim:nel Sole:} ≈ 15 milioni di kelvin', PX, 740, { size: 30, local: t - 81.2 });
    ctx.restore();
  }
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...SX, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DX, life(t, 7.8, T_FINE + .1, .5, .5));
}
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Spezzare o unire', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 95.9, 96.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Verso il ferro si libera energia:\nspezzando i nuclei grandi o unendo i piccoli.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{v:fissione} dell’uranio-235\n{g:≈ 200 MeV} {dim:per nucleo}'], [960, '{v:fusione} nel Sole: 4 H → He\n{g:26,7 MeV}{dim:, 6,7 per nucleone}'], [1470, '1 MeV = 10{mink:⁶} eV\n{dim:= 1,6·10}{mink:⁻¹³}{dim: J}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // il tono della curva segue la punta che si disegna (ricalcolata con node lungo la spezzata vera)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // energia di legame
    ['pop', 13.0, .5], ['pop', 14.2, .6],                                             // eV e MeV
    ['traccia', 17.6, 18.4],                                                          // gli assi
    ['tono', 18.2, 22.2, [.16, .17, .25, .45, .68, .91, .89, .84, .82, .81, .81]],     // la curva: sale, poi scende piano
    ['pop', 23.0, .15], ['pop', 26.9, .6],                                            // deuterio 1,1, elio-4 7,1
    ['ding', 31.1], ['pop', 35.1, .55],                                               // il massimo al ferro-56; l'uranio
    ['traccia', 40.0, 40.8], ['pop', 40.6, .5],                                       // verso il ferro si libera energia
    ['soffio', 44.6], ['pop', 44.7, .4],                                              // fissione: l'uranio-235
    ['tono', 45.1, 46.7, [.3, .4, .5]], ['pop', 46.8, .8],                            // il neutrone arriva: si spezza
    ['pop', 49.1, .5], ['pop', 49.4, .7],                                             // la reazione, i frammenti sulla curva
    ['pop', 54.2, .5], ['ding', 55.6],                                                // circa 200 MeV
    ['pop', 59.0, .3],                                                                // il carbonio: 4 eV
    ['soffio', 64.1], ['tono', 64.7, 67.7, [.3, .33, .5, .67, .7]],                   // fusione: quattro protoni si avvicinano
    ['pop', 70.6, .7], ['pop', 71.3, .5],                                             // elio-4, la reazione
    ['ding', 73.3],                                                                   // 26,7 MeV
    ['pop', 77.3, .3], ['pop', 81.2, .6],                                             // fissione 0,8; 15 milioni di kelvin
    ['soffio', 87.0], ['pop', 89.0, .5], ['pop', 89.5, .6], ['pop', 90.0, .7],        // in una frase
  ];
  return {
    titolo: 'Spezzare o unire', durata: 98.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 44.4, 'l’energia di legame'], [44.4, 63.6, 'la fissione'], [63.6, T_FINE, 'la fusione']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneGrafico(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
