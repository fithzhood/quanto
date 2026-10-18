'use strict';
/* Che cosa tiene insieme il nucleo — l'atomo è largo ≈ 10⁻¹⁰ m, il nucleo ≈ 10⁻¹⁵ m = 1 fm (centomila volte meno:
   stadio da 100 m contro chicco da 1 mm). Protoni (C.v, come le cariche positive dell'elettrostatica) e neutroni (C.dim);
   Z = numero atomico (protoni), A = numero di massa (protoni + neutroni). Due protoni a 1 fm si respingono con
   F = k·e²/r² = 8,99·10⁹ · (1,6·10⁻¹⁹)² / (10⁻¹⁵)² ≈ 230,7 N (il peso di ≈ 23,5 kg); a 2 fm 58 N, a 3 fm 26 N: la curva
   arancio nel grafico è questa, calcolata. La forza forte (C.g: «tiene») è decine di volte più intensa a 1 fm e sparisce
   oltre 2–3 fm: la sua curva è solo indicativa, e lo dice; la freccia verde è accorciata, e lo dice. Nei nuclei grandi la
   forza forte lega solo i vicini, la repulsione agisce fra tutti i protoni: servono più neutroni (uranio-238: 92 p, 146 n).
   Isotopi: stesso Z, A diverso (carbonio-12, 13, 14). L'idea sbagliata («solo repulsione: scoppia») in rosso, poi smontata.
   Argomento: nucleare. */
CVIDEO.registra('nucleare/nucleo', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, drawSeq, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

// le scene sono scritte in un tempo «di scena»: dal 41,9 l'animazione sta ferma 1 s (il fumetto della formula è più
// lungo, per la voce), poi riparte. Fumetti, facce, posa e capitoli sono invece nel tempo vero del video.
const PAUSA = 41.9, DT = 1;
const tScena = t => t < PAUSA ? t : t < PAUSA + DT ? PAUSA : t - DT;
const T_FINE = 94.6, T_FINE_V = T_FINE + DT;   // T_FINE nel tempo di scena, T_FINE_V in quello vero
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE_V, 190], [T_FINE_V + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE_V, 1050], [T_FINE_V + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE_V, 2.2], [T_FINE_V + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE_V, 2], [T_FINE_V + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE_V, -1.5], [T_FINE_V + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.7, 'sorpreso'], [17.7, 'felice'],
  [22.9, 'neutro'], [37.2, 'pensa'], [43.0, 'sorpreso'], [47.7, 'neutro'], [52.1, 'felice'], [56.9, 'neutro'],
  [66.4, 'felice'], [71.0, 'neutro'], [80.4, 'pensa'], [86.7, 'felice'], [91.5, 'neutro'],
  [98.0, 'festa'], [101.2, 'felice'], [103.7, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Nel nucleo i protoni si respingono:\nperché non esplode?'],
  [7.9, 12.6, 'Un atomo è largo 10{mink:⁻¹⁰} m:\nun decimo di miliardesimo di metro.'],
  [12.7, 17.6, 'Il nucleo, al centro, è circa 10{mink:⁻¹⁵} m:\n{g:centomila volte} più piccolo.'],
  [17.7, 22.8, 'Atomo come uno stadio da 100 m:\nnucleo come un chicco da 1 mm.'],
  [22.9, 27.2, 'Dentro: {v:protoni}, positivi, e {dim:neutroni},\nsenza carica. Insieme: {g:nucleoni}.'],
  [27.3, 32.1, '{mink:Z}, il numero atomico, conta i protoni\ne dice l’elemento: qui 6, {g:carbonio}.'],
  [32.2, 37.1, '{mink:A}, numero di massa, conta i nucleoni:\nqui 6 + 6 = 12.'],
  [37.2, 42.9, 'Due protoni a 1 fm (un femtometro)\nsi respingono: {my:F} = {mink:k·e²/r²}.'],
  [43.0, 47.6, 'Circa {g:230 N}, il peso di 23 kg:\nsu una particella minuscola!'],
  [47.7, 52.0, '{r:Se ci fosse solo questa}, il nucleo\nscoppierebbe all’istante.'],
  [52.1, 56.8, 'Fra nucleoni a contatto c’è la\n{g:forza forte}: attrae, molto più intensa.'],
  [56.9, 61.7, 'Ed è {g:cortissima}: a 1 fm vince,\noltre 2 o 3 fm sparisce.'],
  [61.8, 66.3, 'La repulsione invece cala piano:\na 3 fm è ancora 26 N.'],
  [66.4, 70.9, 'Lega anche neutrone e protone:\nè uguale per tutti i nucleoni.'],
  [71.0, 75.5, 'In un nucleo grande la forza forte\ntiene solo i {g:vicini}…'],
  [75.6, 80.3, '…mentre la repulsione agisce fra {y:tutti}\ni protoni, anche lontani.'],
  [80.4, 86.6, 'Per questo servono più neutroni, colla\nsenza carica: uranio-238, 92 p e 146 n.'],
  [86.7, 91.4, 'Stesso {mink:Z}, neutroni diversi: {g:isotopi}.\nCarbonio-12, 13 e 14: stessa chimica.'],
  [91.5, 95.2, 'Cambia solo la massa:\nl’elemento resta carbonio.'],
  [98.0, 104.2, 'Forza forte fra vicini contro repulsione\nfra tutti: così sta insieme il nucleo.'],
];

// ---------- la fisica ----------
const K_C = 8.9875517923e9, E_C = 1.602176634e-19;
const forzaCoulomb = r => K_C * E_C * E_C / Math.pow(r * 1e-15, 2);    // r in fm → newton (230,7 N a 1 fm)
const PX_N = .5;                                                        // frecce: 0,5 px per newton
const forte = r => r <= 1 ? 1 : Math.exp(-Math.pow((r - 1) / .55, 2));   // andamento INDICATIVO: a 2 fm quasi nulla
const L_FORTE = 320;                                                    // freccia verde accorciata (sarebbe decine di volte più lunga)

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
// numeri «a caso» ma sempre gli stessi: mulberry32 con un seme fisso
function generatore(seme) {
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// un nucleone: sfera viola col + se protone, grigia se neutrone
function nucleone(ctx, p, protone, r = 34, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  const col = protone ? C.v : mix(C.dim, C.paper, .25);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  if (protone && r >= 14) {
    ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
    const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0); ctx.moveTo(0, -a); ctx.lineTo(0, a); ctx.stroke();
  }
  ctx.restore();
}
// un nucleo: Z protoni e N neutroni impacchettati a spirale (sempre uguale: seme fisso), dall'esterno verso il centro
function nucleo(Z, N, rN, seme) {
  const A = Z + N, rnd = generatore(seme), tipi = [];
  for (let i = 0; i < A; i++) tipi.push(i < Z);
  for (let i = A - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const s = tipi[i]; tipi[i] = tipi[j]; tipi[j] = s; }
  const pts = [];
  for (let i = 0; i < A; i++) { const rr = 1.08 * rN * Math.sqrt(i + .3), a = i * 2.39996323; pts.push({ x: rr * Math.cos(a), y: rr * Math.sin(a), p: tipi[i], rr }); }
  pts.sort((a, b) => b.rr - a.rr);
  return pts;
}
function disegnaNucleo(ctx, pts, cx, cy, rN, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  for (const q of pts) nucleone(ctx, [cx + q.x * sc, cy + q.y * sc], q.p, rN * sc, al);
}
const C12 = nucleo(6, 6, 36, 12), C12s = nucleo(6, 6, 22, 12), C13s = nucleo(6, 7, 22, 13), C14s = nucleo(6, 8, 22, 14), U238 = nucleo(92, 146, 10, 238);
// notazione ᴬ_Z X: A in alto a sinistra, Z in basso a sinistra, poi il simbolo
function nuclide(ctx, A, Z, sym, x, y, size, al = 1, col) {
  if (al <= 0) return;
  const sz = Math.round(size * .52), c = col || C.ink;
  txt(ctx, sym, x, y, { size, weight: 600, color: c, align: 'left', alpha: al });
  txt(ctx, String(A), x - 5, y - size * .3, { size: sz, color: c, align: 'right', alpha: al });
  txt(ctx, String(Z), x - 5, y + size * .32, { size: sz, color: c, align: 'right', alpha: al });
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function righello(ctx, xa, xb, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.moveTo(xa, y - 12); ctx.lineTo(xa, y + 12); ctx.moveTo(xb, y - 12); ctx.lineTo(xb, y + 12); ctx.stroke();
  ctx.restore();
}
function separa(ctx, x0, x1, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Che cosa tiene insieme il nucleo', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · l'atomo e il nucleo (7,5–22,5): una scheda larga, l'atomo a sinistra e lo zoom sul nucleo a destra
const TOP = [110, 110, 1700, 680];
const XA = 540, YA = 420, RA = 240, XN = 1380, RN = 230;
function sceneAtomo(ctx, t) {
  const al = life(t, 7.6, 22.8, .5, .5);
  if (al <= 0) return;
  card(ctx, ...TOP, al);
  ctx.save(); ctx.globalAlpha *= al;
  // la nuvola degli elettroni
  const ka = P(t, 7.9, 8.8, E.out);
  const g = ctx.createRadialGradient(XA, YA, 0, XA, YA, RA * ka);
  g.addColorStop(0, css(C.x, .32)); g.addColorStop(.7, css(C.x, .16)); g.addColorStop(1, css(C.x, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(XA, YA, RA * ka, 0, TAU); ctx.fill();
  ctx.save(); ctx.strokeStyle = css(C.x, .5); ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(XA, YA, RA * ka, 0, TAU); ctx.stroke(); ctx.restore();
  txt(ctx, 'atomo', XA, 140, { size: 34, color: C.dim, alpha: P(t, 8.4, 8.9) });
  // il nucleo: un puntino (non in scala: sarebbe invisibile)
  const kn = P(t, 8.6, 9.0, E.back);
  ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(XA, YA, 6 * kn, 0, TAU); ctx.fill();
  // la larghezza
  const kr = P(t, 9.3, 9.8);
  righello(ctx, XA - RA, XA + RA, YA + RA + 40, kr);
  drawRich(ctx, '≈ 10{mink:⁻¹⁰} m', XA, YA + RA + 82, { size: 40, alpha: kr });
  // lo zoom sul nucleo
  const kz = P(t, 12.8, 13.6);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2.5; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.arc(XA, YA, 30, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(XA, YA - 30); ctx.lineTo(XN, YA - RN); ctx.moveTo(XA, YA + 30); ctx.lineTo(XN, YA + RN); ctx.stroke();
    ctx.beginPath(); ctx.arc(XN, YA, RN, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  const ks = P(t, 13.4, 13.9, E.back);
  disegnaNucleo(ctx, C12, XN, YA, 30, kz, ks * .85);
  txt(ctx, 'nucleo', XN, YA - RN - 40, { size: 34, color: C.dim, alpha: P(t, 13.8, 14.3) });
  const kr2 = P(t, 14.4, 14.9);
  righello(ctx, XN - 125, XN + 125, YA + RN + 50, kr2);
  drawRich(ctx, '≈ 10{mink:⁻¹⁵} m = 1 fm', XN, YA + RN + 92, { size: 40, alpha: kr2 });
  txt(ctx, 'non in scala: sarebbe 100 000 volte più piccolo', 960, 672, { size: 30, color: C.dim, alpha: P(t, 15.2, 15.7) });
  // lo stadio e il chicco
  const kst = P(t, 17.8, 18.3);
  if (kst > 0) {
    fondo(ctx, 960, 400, 330, 150, kst);
    drawRich(ctx, '{dim:stadio} 100 m\n{dim:chicco} 1 mm', 960, 400, { size: 36, alpha: kst, lh: 1.4 });
    drawRich(ctx, '{g:100 000 volte}', 960, 500, { size: 34, alpha: P(t, 18.6, 19.1) });
  }
  ctx.restore();
}

// 2–6 · due schede: a sinistra il disegno, a destra il pannello (22,5–94)
const SX = [110, 110, 850, 680], DX = [1000, 110, 810, 680];
const CX = 535, PX = 1405;   // centri
function sceneSchede(ctx, t) {
  if (t < 22.7 || t > T_FINE + .3) return;
  const al = life(t, 22.8, T_FINE + .1, .5, .5);
  card(ctx, ...SX, al); card(ctx, ...DX, al);
}

// 2 · il carbonio-12: protoni, neutroni, Z e A (22,6–36,9)
function sceneCarbonio(ctx, t) {
  const al = life(t, 22.9, 37.2, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  disegnaNucleo(ctx, C12, CX, 420, 36, 1, P(t, 23.0, 23.6, E.back));
  const kl = P(t, 23.7, 24.2);
  nucleone(ctx, [330, 700], true, 20, kl); txt(ctx, 'protone', 365, 700, { size: 32, color: C.dim, align: 'left', alpha: kl });
  nucleone(ctx, [560, 700], false, 20, kl); txt(ctx, 'neutrone', 595, 700, { size: 32, color: C.dim, align: 'left', alpha: kl });
  const kc = P(t, 28.0, 28.5);
  txt(ctx, 'carbonio-12', CX, 630, { size: 34, color: C.dim, alpha: kc });
  // il pannello
  titoletto(ctx, 'il nucleo', PX, 170, P(t, 23.1, 23.6));
  drawRich(ctx, '{v:protone}{dim:: carica positiva}', PX, 240, { size: 36, local: t - 23.3 });
  drawRich(ctx, '{dim:neutrone: carica 0}', PX, 292, { size: 36, local: t - 23.9 });
  drawRich(ctx, '{dim:tutti e due:} {g:nucleoni}', PX, 344, { size: 36, local: t - 25.9 });
  separa(ctx, 1040, 1770, 388, P(t, 27.3, 27.7));
  drawRich(ctx, '{mink:Z} {dim:= numero atomico = protoni}', PX, 432, { size: 36, local: t - 27.4 });
  drawRich(ctx, '{dim:carbonio:} {mink:Z} = 6', PX, 484, { size: 36, local: t - 29.2 });
  separa(ctx, 1040, 1770, 528, P(t, 32.2, 32.6));
  drawRich(ctx, '{mink:A} {dim:= numero di massa = nucleoni}', PX, 572, { size: 36, local: t - 32.3 });
  drawRich(ctx, '{mink:A} = 6 + 6 = 12', PX, 624, { size: 36, local: t - 33.5 });
  const kn = P(t, 35.0, 35.5, E.back);
  if (kn > 0) {
    ctx.save(); ctx.translate(PX, 710); ctx.scale(kn, kn); ctx.translate(-PX, -710);
    nuclide(ctx, 12, 6, 'C', PX - 10, 712, 64);
    drawRich(ctx, '{mink:A}', PX - 140, 690, { size: 30 }); drawRich(ctx, '{mink:Z}', PX - 140, 736, { size: 30 });
    ctx.restore();
  }
  ctx.restore();
}

// 3–4 · due nucleoni: la repulsione (37,1–50,9) e la forza forte (51–69,8); 1 fm = 100 px, nucleoni di raggio 40
const XL = 430, YN = 470, PX_FM = 100;
const distanza = t => kf(t, [[56.2, 1], [60.5, 3], [65.3, 3], [65.9, 1]]);
function sceneForze(ctx, t) {
  const al = life(t, 37.2, 70.1, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const r = distanza(t), XR = XL + PX_FM * r, rq = Math.round(r * 10) / 10;
  const F = forzaCoulomb(rq), L = F * PX_N;
  const kNeu = P(t, 65.9, 66.4);                    // a sinistra il protone diventa un neutrone
  const kDx = 1 - P(t, 51.1, 51.7);                 // dal 51 le forze si guardano solo sul nucleone di destra
  // la forza forte: una freccia (accorciata) dietro i nucleoni, dal nucleone di destra verso l'altro
  const kg = P(t, 51.3, 52.0, E.out) * forte(r);
  if (kg > 0.01) freccia(ctx, [XR - 40, YN], [XR - 40 - L_FORTE * kg, YN], C.g, 1, 10);
  // i nucleoni
  nucleone(ctx, [XL, YN], true, 40, 1 - kNeu, P(t, 37.3, 37.8, E.back));
  if (kNeu > 0) nucleone(ctx, [XL, YN], false, 40, kNeu);
  nucleone(ctx, [XR, YN], true, 40, 1, P(t, 37.5, 38.0, E.back));
  // la distanza
  const kr = P(t, 38.1, 38.6);
  righello(ctx, XL, XR, YN - 120, kr);
  fondo(ctx, (XL + XR) / 2, YN - 158, 220, 46, kr);
  drawRich(ctx, '{mink:r} = ' + fmtN(rq, 1) + ' fm', (XL + XR) / 2, YN - 158, { size: 38, alpha: kr });
  // la repulsione di Coulomb: frecce arancio verso l'esterno, 0,5 px per newton
  const kF = P(t, 39.4, 39.9), kFl = kF * kDx, kFr = kF * (1 - kNeu);
  freccia(ctx, [XL - 40, YN], [XL - 40 - L, YN], C.y, kFl);
  freccia(ctx, [XR + 40, YN], [XR + 40 + L, YN], C.y, kFr);
  drawRich(ctx, '{my:F}', XL - 40 - L / 2, YN - 42, { size: 38, alpha: kFl });
  drawRich(ctx, '{my:F}', XR + 40 + Math.max(L, 40) / 2, YN - 42, { size: 38, alpha: kFr * P(L, 6, 20, E.lin) });
  txt(ctx, 'repulsione', XR + 50, YN + 80, { size: 30, color: C.y, align: 'left', alpha: kFr * (1 - kDx) * P(L, 6, 20, E.lin) });
  if (kg > 0.01) txt(ctx, 'forza forte', XR - 40 - L_FORTE * kg / 2, YN + 72, { size: 32, color: C.g, alpha: P(kg, .05, .3, E.lin) });
  txt(ctx, 'forze sul nucleone di destra (sull’altro: uguali e opposte)', CX, 740, { size: 30, color: C.dim, alpha: 1 - kDx });
  txt(ctx, 'freccia verde: in realtà decine di volte più lunga', CX, 700, { size: 30, color: C.dim, alpha: P(t, 52.1, 52.6) });
  txt(ctx, 'nucleoni non in scala', 940, 150, { size: 30, color: C.dim, align: 'right', alpha: P(t, 38.1, 38.6) });
  // l'idea sbagliata: se ci fosse solo la repulsione, i due protoni schizzerebbero via (fantasmi rossi)
  const kw = life(t, 46.7, 51.3, .3, .5);
  if (kw > 0) {
    const s = clamp((t - 46.8) / 2.4), d = 40 + 260 * s * s;   // accelerano: partono da fermi
    ctx.save(); ctx.globalAlpha *= kw * .75;
    for (const sg of [-1, 1]) {
      const x = (sg < 0 ? XL : XR) + sg * d;
      ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.setLineDash([8, 7]);
      ctx.beginPath(); ctx.arc(x, YN + 170, 40, 0, TAU); ctx.stroke();
      ctx.setLineDash([]); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - 18, YN + 170); ctx.lineTo(x + 18, YN + 170); ctx.moveTo(x, YN + 152); ctx.lineTo(x, YN + 188); ctx.stroke();
    }
    ctx.restore();
    drawRich(ctx, '{r:solo repulsione: scoppierebbe}', CX, YN + 250, { size: 34, alpha: kw });
  }
  ctx.restore();
}
// il pannello della repulsione (37,1–50,9) e poi il grafico forza–distanza (51–69,8)
function scenePannelloForze(ctx, t) {
  const a1 = life(t, 37.2, 51.1, .5, .4);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    titoletto(ctx, 'due protoni a 1 fm', PX, 170, P(t, 37.4, 37.9));
    drawSeq(ctx, ['{my:F}{mink: = k·}', { num: '{mink:e²}', den: '{mink:r²}' }], PX, 290, 56, { local: t - 39.4 });
    drawRich(ctx, '{mink:k} ≈ 8,99·10{mink:⁹} N·m²/C²', PX, 400, { size: 34, local: t - 40.1 });
    drawRich(ctx, '{mink:e} ≈ 1,6·10{mink:⁻¹⁹} C {dim:(carica del protone)}', PX, 452, { size: 34, local: t - 40.4 });
    drawRich(ctx, '{mink:r} = 1 fm = 10{mink:⁻¹⁵} m', PX, 504, { size: 34, local: t - 40.7 });
    separa(ctx, 1040, 1770, 548, P(t, 42.0, 42.4));
    drawRich(ctx, '{my:F} ≈ {g:230 N}', PX, 612, { size: 60, local: t - 42.1 });
    drawRich(ctx, '{dim:come il peso di} 23 kg', PX, 690, { size: 36, local: t - 43.4 });
    drawRich(ctx, '{dim:(230 N / 9,8 N per kg ≈ 23,5 kg)}', PX, 740, { size: 30, local: t - 43.8 });
    ctx.restore();
  }
  const a2 = life(t, 51.1, 70.1, .5, .4);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    titoletto(ctx, 'forza e distanza', PX, 170, P(t, 51.3, 51.8));
    const r = distanza(t), rq = Math.round(r * 10) / 10, F = forzaCoulomb(rq);
    // il piano: r da 0,6 a 3,4 fm, F da 0 a 300 N
    const gx = rr => 1090 + (rr - .6) * 239, gy = ff => 700 - ff * 400 / 300;
    const kA = P(t, 51.5, 52.3);
    ctx.save(); ctx.globalAlpha *= kA; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gx(.6) - 4, 700); ctx.lineTo(1780, 700); ctx.moveTo(gx(.6), 704); ctx.lineTo(gx(.6), 270); ctx.stroke();
    arrowHead(ctx, [1786, 700], 0, C.ink); arrowHead(ctx, [gx(.6), 264], -Math.PI / 2, C.ink);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(gx(i), 702); ctx.lineTo(gx(i), 280); ctx.stroke(); }
    for (let j = 100; j <= 300; j += 100) { ctx.beginPath(); ctx.moveTo(gx(.6) - 2, gy(j)); ctx.lineTo(1770, gy(j)); ctx.stroke(); }
    for (let i = 1; i <= 3; i++) txt(ctx, String(i), gx(i), 728, { size: 30, color: C.dim });
    for (let j = 100; j <= 300; j += 100) txt(ctx, String(j), gx(.6) - 12, gy(j), { size: 30, color: C.dim, align: 'right' });
    drawRich(ctx, '{mink:r} {dim:(fm)}', 1775, 735, { size: 30, align: 'right' });
    drawRich(ctx, '{my:F} {dim:(N)}', gx(.6) + 16, 262, { size: 30, align: 'left' });
    ctx.restore();
    // le due curve, dentro il piano
    ctx.save(); ctx.beginPath(); ctx.rect(gx(.6), 262, 1786 - gx(.6), 440); ctx.clip();
    const kc = P(t, 52.1, 53.5), kv = P(t, 55.9, 57.2);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kv > 0) {   // forza forte: solo indicativa, scappa in alto e sparisce verso i 2 fm
      ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.globalAlpha *= kv; ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const rr = .6 + 2.8 * i / 120, p = [gx(rr), gy(900 * forte(rr))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke(); ctx.restore();
    }
    if (kc > 0) {   // la repulsione: k·e²/r², vera
      ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.beginPath();
      const r0 = .877, r1 = r0 + (3.4 - r0) * kc;
      for (let i = 0; i <= 120; i++) { const rr = r0 + (r1 - r0) * i / 120, p = [gx(rr), gy(forzaCoulomb(rr))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    ctx.restore();
    drawRich(ctx, '{y:repulsione}', 1540, 590, { size: 32, align: 'left', alpha: P(t, 53.1, 53.6) });
    fondo(ctx, 1612, 330, 364, 86, kv);   // la griglia dei 3 fm non attraversa l'etichetta
    drawRich(ctx, '{g:forza forte}\n{dim:(andamento indicativo)}', 1790, 330, { size: 30, align: 'right', alpha: kv, lh: 1.25 });
    // il punto sulla curva arancio e la lettura
    const kp = P(t, 53.5, 54.0);
    if (kp > 0) {
      ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(gx(rq), gy(F), 9, 0, TAU); ctx.fill(); ctx.restore();
      drawRich(ctx, '{mink:r} =', 1230, 228, { size: 34, align: 'left', alpha: kp });
      fixedNum(ctx, fmtN(rq, 1), 1380, 228, 36, C.ink, kp); txt(ctx, 'fm', 1390, 228, { size: 32, align: 'left', alpha: kp });
      drawRich(ctx, '{my:F} =', 1480, 228, { size: 34, align: 'left', alpha: kp });
      fixedNum(ctx, String(Math.round(F)), 1680, 228, 36, C.y, kp); txt(ctx, 'N', 1690, 228, { size: 32, align: 'left', alpha: kp });
    }
    ctx.restore();
  }
}

// 5 · l'uranio-238: la forza forte fra vicini, la repulsione fra tutti i protoni (69,9–84,4)
const YU = 430, RU = 10;
const U_PROT = U238.map((q, i) => i).filter(i => U238[i].p);
const I_VIC = U238.findIndex(q => q.rr > 90 && q.rr < 100), V = U238[I_VIC];      // un nucleone a metà strada dal bordo
const I_PRO = U_PROT.find(i => U238[i].rr > 120 && U238[i].x < 0), PR = U238[I_PRO];   // un protone a sinistra, verso il bordo
const LONTANI = U_PROT.filter(i => { const q = U238[i]; return Math.hypot(q.x - PR.x, q.y - PR.y) > 150; }).filter((i, k) => k % 6 === 0).slice(0, 9);
function sceneUranio(ctx, t) {
  const al = life(t, 70.0, 85.7, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  disegnaNucleo(ctx, U238, CX, YU, RU, 1, P(t, 70.1, 70.7, E.back));
  // la forza forte: un anello verde attorno a un nucleone, che copre solo i vicini
  const kv = P(t, 71.1, 71.7, E.back);
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(CX + V.x, YU + V.y, 2.6 * RU, 0, TAU); ctx.stroke();
    ctx.fillStyle = css(C.g, .22); ctx.fill(); ctx.restore();
    drawRich(ctx, '{g:forza forte: solo i vicini}', CX, 690, { size: 32, alpha: kv });
  }
  // la repulsione: linee arancio da un protone verso protoni lontani
  const ko = P(t, 74.7, 75.9);
  if (ko > 0) {
    ctx.save(); ctx.globalAlpha *= ko; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3; ctx.setLineDash([7, 6]);
    for (const i of LONTANI) { const q = U238[i]; ctx.beginPath(); ctx.moveTo(CX + PR.x, YU + PR.y); ctx.lineTo(CX + q.x, YU + q.y); ctx.stroke(); }
    ctx.restore();
    nucleone(ctx, [CX + PR.x, YU + PR.y], true, RU + 3, ko);
    drawRich(ctx, '{y:repulsione: fra tutti i protoni}', CX, 740, { size: 32, alpha: ko });
  }
  txt(ctx, 'uranio-238', CX, 150, { size: 34, color: C.dim, alpha: P(t, 70.5, 71.0) });
  // il pannello
  titoletto(ctx, 'un nucleo grande', PX, 170, P(t, 70.3, 70.8));
  const kp = P(t, 70.7, 71.2, E.back);
  if (kp > 0) { ctx.save(); ctx.translate(PX, 270); ctx.scale(kp, kp); ctx.translate(-PX, -270); nuclide(ctx, 238, 92, 'U', PX - 24, 272, 64); ctx.restore(); }
  drawRich(ctx, '{mink:Z} = 92 {dim:protoni}', PX, 350, { size: 36, local: t - 70.9 });
  drawRich(ctx, '{mink:A} = 238 {dim:nucleoni}', PX, 400, { size: 36, local: t - 71.3 });
  separa(ctx, 1040, 1770, 444, P(t, 74.7, 75.1));
  drawRich(ctx, '{g:forza forte}{dim:: lega i vicini}', PX, 490, { size: 36, local: t - 71.5 });
  drawRich(ctx, '{y:repulsione}{dim:: fra tutti i 92 protoni}', PX, 542, { size: 36, local: t - 74.9 });
  separa(ctx, 1040, 1770, 586, P(t, 79.4, 79.8));
  drawRich(ctx, '{dim:servono più neutroni}', PX, 630, { size: 36, local: t - 79.6 });
  drawRich(ctx, '238 − 92 = {g:146 neutroni}', PX, 690, { size: 40, local: t - 80.8 });
  ctx.restore();
}

// 6 · gli isotopi del carbonio (84,5–93,6)
function sceneIsotopi(ctx, t) {
  const al = life(t, 85.7, T_FINE + .1, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  [[300, C12s, 12, 6, 85.8], [535, C13s, 13, 7, 86.2], [770, C14s, 14, 8, 86.6]].forEach(([x, pts, A, n, t0]) => {
    const k = P(t, t0, t0 + .5, E.back);
    disegnaNucleo(ctx, pts, x, 400, 22, 1, k);
    nuclide(ctx, A, 6, 'C', x - 8, 590, 56, P(t, t0 + .3, t0 + .7));
    drawRich(ctx, '{v:6 p}{dim:,} ' + n + ' n', x, 660, { size: 32, alpha: P(t, t0 + .5, t0 + .9) });
  });
  txt(ctx, 'carbonio-12', 300, 250, { size: 32, color: C.dim, alpha: P(t, 86.1, 86.5) });
  txt(ctx, 'carbonio-13', 535, 250, { size: 32, color: C.dim, alpha: P(t, 86.5, 86.9) });
  txt(ctx, 'carbonio-14', 770, 250, { size: 32, color: C.dim, alpha: P(t, 86.9, 87.3) });
  titoletto(ctx, 'isotopi', PX, 170, P(t, 85.9, 86.4));
  drawRich(ctx, '{dim:stesso} {mink:Z} = 6{dim:: sempre carbonio}', PX, 250, { size: 36, local: t - 86.8 });
  drawRich(ctx, '{mink:A} {dim:diverso: 12, 13, 14}', PX, 302, { size: 36, local: t - 87.4 });
  separa(ctx, 1040, 1770, 350, P(t, 88.2, 88.6));
  drawRich(ctx, '{g:stessa chimica}', PX, 400, { size: 38, local: t - 88.3 });
  drawRich(ctx, '{dim:massa diversa}', PX, 452, { size: 36, local: t - 91.2 });
  drawRich(ctx, '{dim:il carbonio-14 è radioattivo}', PX, 530, { size: 32, local: t - 92.4 });
  ctx.restore();
}

// in una frase (94–108)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.2, 105.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La forza forte, cortissima, vince sulla\nrepulsione e tiene insieme il nucleo.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:Z} protoni, {mink:A} nucleoni\n{dim:isotopi: stesso} {mink:Z}{dim:,} {mink:A} {dim:diverso}'], [960, 'forza forte: {g:fra vicini}\n{dim:oltre 2–3 fm sparisce}'], [1470, 'repulsione {y:fra tutti} i protoni\n{dim:230 N a 1 fm}']];
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

  // effetti nel tempo vero del video: dopo il 41,9 le scene sono indietro di 1 s
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 9.3, 9.8],                                           // l'atomo, 10 alla meno 10 m
    ['traccia', 12.8, 13.6], ['pop', 13.4, .6],                                       // lo zoom sul nucleo, 1 fm
    ['pop', 17.8, .5],                                                                // stadio e chicco: 100 000 volte
    ['soffio', 22.8], ['pop', 23.0, .5],                                              // il carbonio-12
    ['pop', 27.4, .5], ['pop', 32.3, .55], ['pop', 35.0, .7],                         // Z, A, il simbolo
    ['soffio', 37.2], ['pop', 37.3, .5], ['traccia', 38.1, 38.6], ['pop', 39.4, .6],  // due protoni a 1 fm, la repulsione
    ['ding', 43.1],                                                                   // circa 230 N
    ['tono', 47.8, 50.2, [.4, .45, .55, .7, .9]],                                     // solo repulsione: schizzano via
    ['pop', 52.3, .6], ['traccia', 52.5, 53.3],                                       // la forza forte, il grafico
    ['traccia', 53.1, 54.5], ['tono', 53.1, 54.5, [.95, .7, .2, .11, .11]],           // la curva della repulsione
    ['pop', 54.5, .7],                                                                // il punto a 1 fm
    ['traccia', 56.9, 58.2],                                                          // la curva della forza forte
    ['tono', 57.2, 61.5, [.74, .6, .22, .13, .13]],                                   // si allontanano: F cala fino a 26 N
    ['soffio', 71.1], ['pop', 71.7, .7], ['pop', 72.1, .5],                           // l'uranio-238, i vicini
    ['traccia', 75.7, 76.9],                                                          // repulsione fra tutti i protoni
    ['pop', 80.6, .5], ['ding', 81.8],                                                // 146 neutroni
    ['soffio', 86.7], ['pop', 86.8, .4], ['pop', 87.2, .5], ['pop', 87.6, .6],        // gli isotopi del carbonio
    ['ding', 89.3], ['pop', 93.4, .5],                                                // stessa chimica; il carbonio-14
    ['soffio', 95.8], ['pop', 97.8, .5], ['pop', 98.3, .6], ['pop', 98.8, .7],        // in una frase
  ];
  return {
    titolo: 'Che cosa tiene insieme il nucleo', durata: 107.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.8, 'l’atomo e il nucleo'], [22.8, 37.2, 'protoni e neutroni'], [37.2, 52.1, 'la repulsione'], [52.1, 71.0, 'la forza forte'], [71.0, 86.7, 'un nucleo grande'], [86.7, T_FINE_V, 'gli isotopi']],
    scena(ctx, tv) { const t = tScena(tv); sceneIntro(ctx, t); sceneAtomo(ctx, t); sceneSchede(ctx, t); sceneCarbonio(ctx, t); sceneForze(ctx, t); scenePannelloForze(ctx, t); sceneUranio(ctx, t); sceneIsotopi(ctx, t); sceneFine(ctx, t); },
  };
});
