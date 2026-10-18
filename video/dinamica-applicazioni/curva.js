'use strict';
/* Quanto veloce in curva — vista dall'alto: la forza verso il centro m·v²/r la dà l'attrito statico laterale delle gomme,
   che ha un massimo μ·m·g; da m·v²/r ≤ μ·m·g viene v max = √(μ·g·r). r = 50 m: asciutto μ ≈ 0,8 → ≈ 19,8 m/s (≈ 71 km/h),
   bagnato μ ≈ 0,4 → 14 m/s (≈ 50 km/h). A 22 m/s l'attrito non basta: la traiettoria si allarga (raggio v²/(μ·g) ≈ 61,7 m).
   La curva sopraelevata, solo a parole: la reazione del fondo ha una parte verso il centro. Argomento: dinamica-applicazioni. */
CVIDEO.registra('dinamica-applicazioni/curva', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, richW, txt, fixedNum, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [98.6, 190], [99.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [98.6, 1050], [99.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [98.6, 2.2], [99.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [98.6, 2], [99.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [98.6, -1.5], [99.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.5, 'pensa'], [21.1, 'neutro'],
  [30.8, 'pensa'], [35.5, 'felice'], [39.5, 'sorpreso'], [43.9, 'neutro'], [52.3, 'pensa'], [56.5, 'felice'],
  [61.1, 'neutro'], [66.9, 'pensa'], [71.5, 'sorpreso'], [76.3, 'neutro'], [81.4, 'sorpreso'], [85.5, 'neutro'],
  [94.5, 'felice'], [98.6, 'neutro'], [101.0, 'felice'], [105.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'In curva, quanto forte\nsi può andare?'],
  [7.9, 12.0, 'Un’auto in curva, vista dall’alto:\nraggio {mink:r} = 50 m.'],
  [12.1, 16.4, 'Sempre 15 m/s, cioè 54 km/h:\nil tachimetro è fermo.'],
  [16.5, 21.0, 'Ma la velocità {mx:v} cambia direzione:\nserve un’{v:accelerazione} verso il centro.'],
  [21.1, 25.0, '{mv:a} = {mx:v}²/{mink:r} = 225/50 = 4,5 m/s².'],
  [25.1, 30.7, 'Da fuori serve una {y:forza} verso il centro:\n{my:F} = {mink:m·}{mx:v}²/{mink:r}, 4500 N per 1000 kg.'],
  [30.8, 35.4, 'Chi spinge l’auto verso il centro?\nL’asfalto, con l’{y:attrito} sulle gomme.'],
  [35.5, 39.4, 'È attrito {v:statico}: la gomma\nnon slitta di lato.'],
  [39.5, 43.8, 'Senza attrito, sul ghiaccio,\nl’auto andrebbe {r:dritta}.'],
  [43.9, 47.7, 'L’attrito statico però\nha un {r:massimo}…'],
  [47.8, 52.2, '…{mink:μ·m·g}, con {mink:μ} coefficiente di\nattrito statico fra gomma e asfalto.'],
  [52.3, 56.4, 'Serve {mink:m·}{mx:v}²/{mink:r} ≤ {mink:μ·m·g}:\nla massa {g:si semplifica}.'],
  [56.5, 61.0, 'La velocità massima è {mink:√(μ·g·r)}:\nnon dipende dalla massa.'],
  [61.1, 66.8, 'Asciutto, {mink:μ} ≈ 0,8: si arriva a\n19,8 m/s, circa 71 km/h.'],
  [66.9, 71.4, 'A 22 m/s servirebbe più forza\ndi quella che l’asfalto può dare…'],
  [71.5, 76.2, '…e l’auto {r:sbanda}: fa una curva\npiù larga ed esce di strada.'],
  [76.3, 81.3, 'Sul bagnato {mink:μ} scende a circa 0,4:\nal massimo 14 m/s, circa 50 km/h.'],
  [81.4, 85.4, 'I 54 km/h di prima, sul bagnato,\nsono già {r:troppi}.'],
  [85.5, 89.5, 'Da dietro: la curva {v:sopraelevata}\nsi inclina verso il centro.'],
  [89.6, 94.4, 'La reazione del fondo {my:N} è inclinata:\nuna parte punta verso il centro…'],
  [94.5, 98.4, '…e aiuta l’attrito\na tenere l’auto in curva.'],
  [101.0, 106.0, 'La velocità massima in curva cresce\ncon l’attrito e con il raggio.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 7, tratt = false) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.4, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = tratt ? 'butt' : 'round';
    if (tratt) ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    ctx.setLineDash([]);
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
// testo ricco con pedici a lettere: «{mx:v}⌊max⌋» scrive v con «max» piccolo in basso
function pedici(ctx, s, x, y, o = {}) {
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
// l'auto vista dall'alto (disegno schematico, non in scala): ang = direzione di marcia sullo schermo
function auto(ctx, x, y, ang, al = 1, fant = false) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = css(C.ink);
  for (const [dx, dy] of [[-18, -17], [18, -17], [-18, 17], [18, 17]]) ctx.fillRect(dx - 8, dy - 4, 16, 8);
  ctx.fillStyle = css(fant ? C.paper : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(fant ? C.r : C.ink); ctx.lineWidth = 3;
  if (fant) ctx.setLineDash([7, 6]);
  ctx.beginPath(); ctx.roundRect(-32, -15, 64, 30, 8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = css(mix(C.ink, C.paper, .35)); ctx.beginPath(); ctx.roundRect(6, -11, 12, 22, 3); ctx.fill();
  ctx.restore();
}

// ---------- il moto vero (metri e secondi; 9 px per metro) ----------
const G = 9.8, R = 50, MASSA = 1000, MU = .8, MUB = .4, RAD = Math.PI / 180;
const O = [540, 730], K = 9, RL = R * K, F0 = 0;                        // centro, corsia a 450 px
const VA = 15, VB = Math.sqrt(MU * G * R), VC = 22;                              // 15 m/s; 19,8 m/s (il massimo); 22 m/s
const RS = VC * VC / (MU * G);                                                   // a 22 m/s l'attrito massimo curva su ≈ 61,7 m
const OS = [O[0] + (RL - RS * K) * Math.cos(F0), O[1] - (RL - RS * K) * Math.sin(F0)];   // centro della sbandata
// le corse, in tempo reale: [inizio, velocità, angolo percorso]
const CA = [12.4, VA, 45 * RAD], CB = [61.6, VB, 100 * RAD], CC = [71.8, VC, 75 * RAD];
const durata = c => c[2] * (c === CC ? RS : R) / c[1];
const corsa = (t, c) => clamp(t - c[0], 0, durata(c)) * c[1] / (c === CC ? RS : R);   // angolo già percorso
const TG = 39.8, DG = 2.5;                                                       // il fantasma senza attrito
function sulCerchio(cx, cy, rr, f) { return [cx + rr * Math.cos(f), cy - rr * Math.sin(f), Math.atan2(-Math.cos(f), -Math.sin(f))]; }
// lo stato dell'auto: dove sta, dove punta, quanto va forte, verso dove tira l'attrito (e quanto)
function stato(t) {
  if (t < 60.9) { const f = F0 + corsa(t, CA); return { p: sulCerchio(O[0], O[1], RL, f), v: VA, al: P(t, 8.0, 8.5) * (1 - P(t, 60.6, 60.9)), c: O, F: MASSA * VA * VA / R }; }
  if (t < 66.9) { const f = F0 + corsa(t, CB); return { p: sulCerchio(O[0], O[1], RL, f), v: VB, al: P(t, 61.0, 61.3) * (1 - P(t, 66.6, 66.9)), c: O, F: MU * MASSA * G }; }
  if (t < 76.3) { const f = F0 + corsa(t, CC); return { p: sulCerchio(OS[0], OS[1], RS * K, f), v: VC, al: P(t, 67.0, 67.3) * (1 - P(t, 76.0, 76.3)), c: OS, F: MU * MASSA * G }; }
  return { p: sulCerchio(O[0], O[1], RL, F0), v: VA, al: P(t, 76.4, 76.7), c: O, F: 0 };
}
const scorre = t => [CA, CB, CC].some(c => t >= c[0] && t <= c[0] + durata(c)) || (t >= TG && t <= TG + DG);
const VSC = 6, ASC = 20, FSC = .02;                                               // px per m/s, per m/s², per N

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Quanto veloce in curva', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–2 · la curva vista dall'alto (7,5–85,4)
const ST = [372, 108, 860, 692];
function sceneAlto(ctx, t) {
  if (t < 7.5 || t > 85.6) return;
  const al = life(t, 7.5, 85.4, .6, .5);
  card(ctx, ...ST, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(ST[0] + 2, ST[1] + 2, ST[2] - 4, ST[3] - 4, 20); ctx.clip();
  // la strada
  ctx.lineCap = 'butt';
  ctx.strokeStyle = css(mix(C.dim, C.paper, .72)); ctx.lineWidth = 10 * K;
  ctx.beginPath(); ctx.arc(O[0], O[1], RL, 14 * RAD, -110 * RAD, true); ctx.stroke();
  const kb = life(t, 76.6, 85.4, .6, .3);   // bagnato
  if (kb > 0) { ctx.save(); ctx.globalAlpha *= .55 * kb; ctx.strokeStyle = css(mix(C.x, C.paper, .35)); ctx.beginPath(); ctx.arc(O[0], O[1], RL, 14 * RAD, -110 * RAD, true); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
  for (const rr of [RL - 5 * K, RL + 5 * K]) { ctx.beginPath(); ctx.arc(O[0], O[1], rr, 14 * RAD, -110 * RAD, true); ctx.stroke(); }
  ctx.strokeStyle = css(C.paper); ctx.setLineDash([18, 16]); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(O[0], O[1], RL, 14 * RAD, -110 * RAD, true); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= al;
  if (kb > 0) drawRich(ctx, '{x:bagnato}', 860, 230, { size: 34, alpha: kb });
  // il centro e il raggio
  M.dot(ctx, O, C.ink, 1, 7);
  txt(ctx, 'centro', O[0], O[1] + 36, { size: 30, color: C.dim });
  const pr = sulCerchio(O[0], O[1], RL, 18 * RAD);
  dashed(ctx, O, pr, C.dim, 1, .9);
  drawRich(ctx, '{mink:r} = 50 m', (O[0] + pr[0]) / 2 + 20, (O[1] + pr[1]) / 2 + 40, { size: 32, alpha: P(t, 8.4, 8.9) });
  // il fantasma: senza attrito l'auto va dritta per la tangente
  const kg = life(t, 39.6, 43.9, .3, .4);
  const s = stato(t), [x, y, ang] = s.p;
  if (kg > 0) {
    const g0 = sulCerchio(O[0], O[1], RL, F0 + CA[2]), d = clamp(t - TG, 0, DG) * VA * K;
    const dir = [Math.cos(g0[2]), Math.sin(g0[2])];
    ctx.save(); ctx.globalAlpha *= kg;
    dashed(ctx, [g0[0], g0[1]], [g0[0] + dir[0] * DG * VA * K, g0[1] + dir[1] * DG * VA * K], C.r, 1, .8);
    auto(ctx, g0[0] + dir[0] * d, g0[1] + dir[1] * d, g0[2], 1, true);
    drawRich(ctx, '{r:senza attrito}', 730, 215, { size: 32, align: 'left' });
    ctx.restore();
  }
  auto(ctx, x, y, ang, s.al * (1 - .75 * kg));
  // le frecce: velocità sempre; accelerazione e forza verso il centro della traiettoria
  const kv = P(t, 12.2, 12.6) * s.al * (1 - .75 * kg);
  if (kv > 0) {
    const ux = Math.cos(ang), uy = Math.sin(ang), L = s.v * VSC;
    const a0 = [x + ux * 38, y + uy * 38], a1 = [x + ux * (38 + L), y + uy * (38 + L)];
    freccia(ctx, a0, a1, C.x, kv);
    const nx = x - s.c[0], ny = y - s.c[1], nn = Math.hypot(nx, ny);   // verso l'esterno
    drawRich(ctx, '{mx:v}', (a0[0] + a1[0]) / 2 + nx / nn * (s.c === O ? 72 : 32), (a0[1] + a1[1]) / 2 + ny / nn * (s.c === O ? 72 : 32), { size: 36, alpha: kv });
  }
  const dx = s.c[0] - x, dy = s.c[1] - y, dd = Math.hypot(dx, dy), cx = dx / dd, cy = dy / dd;
  const ka = life(t, 16.8, 25.2, .4, .4);
  if (ka > 0) {
    const L = VA * VA / R * ASC;
    freccia(ctx, [x + cx * 24, y + cy * 24], [x + cx * (24 + L), y + cy * (24 + L)], C.v, ka);
    drawRich(ctx, '{mv:a}', x + cx * (52 + L), y + cy * (52 + L), { size: 36, alpha: ka });
  }
  const kF = (life(t, 25.3, 43.7, .4, .3) * (1 - kg) + life(t, 61.4, 66.8, .3, .3) + life(t, 71.8, 76.1, .3, .3)) * s.al;
  if (kF > 0 && s.F > 0) {
    const L = s.F * FSC;
    freccia(ctx, [x + cx * 24, y + cy * 24], [x + cx * (24 + L), y + cy * (24 + L)], C.y, kF);
    drawRich(ctx, '{my:F}', x + cx * (54 + L), y + cy * (54 + L), { size: 36, alpha: kF });
    const kat = P(t, 31.2, 31.7) * (1 - P(t, 43.4, 43.7));
    if (kat > 0) drawRich(ctx, '{y:attrito}', x + cx * (54 + L) - 10, y + cy * (54 + L) + 44, { size: 32, alpha: kat * kF });
  }
  if (t > 8.0) chip(ctx, 930, 152, P(t, 8.0, 8.4), scorre(t) ? 'tempo reale' : 'fermo immagine');
  ctx.restore();
}

// 3 · la curva sopraelevata, in sezione (85,4–98,6): strada inclinata di 20°, il centro della curva a sinistra
const TH = 20 * RAD, YS = x => 640 - (x - 420) * Math.tan(TH);
const C0 = [800 - 52 * Math.sin(TH), YS(800) - 52 * Math.cos(TH)];
function sceneSezione(ctx, t) {
  if (t < 85.0 || t > 98.8) return;
  const al = life(t, 85.4, 98.6, .6, .5);
  card(ctx, ...ST, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il terreno e la strada
  ctx.fillStyle = css(mix(C.dim, C.paper, .8));
  ctx.beginPath(); ctx.moveTo(400, YS(400)); ctx.lineTo(1212, YS(1212)); ctx.lineTo(1212, 780); ctx.lineTo(400, 780); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, YS(400)); ctx.lineTo(1212, YS(1212)); ctx.stroke();
  drawRich(ctx, '{dim:← centro della curva}', 410, 160, { size: 32, align: 'left' });
  // l'auto vista da dietro, ruote sulla strada
  ctx.save(); ctx.translate(C0[0], C0[1]); ctx.rotate(-TH);
  ctx.fillStyle = css(C.ink); ctx.fillRect(-78, 20, 30, 32); ctx.fillRect(48, 20, 30, 32);
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-90, -42, 180, 64, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.ink, C.paper, .35)); ctx.beginPath(); ctx.roundRect(-60, -70, 120, 30, 10); ctx.fill();
  ctx.restore();
  // le forze: il peso e la reazione del fondo, perpendicolare alla strada
  const LP = 200, LN = LP / Math.cos(TH), N1 = [C0[0] - LN * Math.sin(TH), C0[1] - LN * Math.cos(TH)];
  const kp = P(t, 86.0, 86.5), kn = P(t, 89.8, 90.4), kh = P(t, 91.6, 92.3);
  freccia(ctx, C0, [C0[0], C0[1] + LP], C.y, kp);
  drawRich(ctx, '{my:P}', C0[0] + 24, C0[1] + 150, { size: 38, align: 'left', alpha: kp });
  freccia(ctx, C0, N1, C.y, kn);
  drawRich(ctx, '{my:N}', (C0[0] + N1[0]) / 2 + 26, (C0[1] + N1[1]) / 2 - 10, { size: 38, align: 'left', alpha: kn });
  if (kh > 0) {
    dashed(ctx, N1, [N1[0], C0[1]], C.dim, 1, .7 * kh);   // la parte orizzontale di N parte dall'auto
    freccia(ctx, C0, [N1[0], C0[1]], C.y, kh, 6, true);
    drawRich(ctx, '{y:verso il centro}', N1[0] - 40, C0[1], { size: 32, align: 'right', alpha: kh });
  }
  ctx.restore();
}

// ---------- il pannello ----------
const PX0 = 1262, PCX = 1551;
function scenePannello(ctx, t) {
  if (t < 8.2 || t > 98.8) return;
  const al = life(t, 8.3, 98.6, .5, .5);
  card(ctx, PX0, 108, 578, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const tit = s => conFont(TITOLI, () => drawRich(ctx, s, PCX, 165, { size: 38, weight: 600 }));
  const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1295, y); ctx.lineTo(1808, y); ctx.stroke(); ctx.restore(); };
  const voce = (nome, val, y, a) => { drawRich(ctx, nome, 1295, y, { size: 32, align: 'left', alpha: a }); drawRich(ctx, val, 1808, y, { size: 34, align: 'right', alpha: a }); };
  // 1 · la curva (8,3–43,9)
  const s1 = 1 - P(t, 43.6, 44.0);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    tit('la curva');
    voce('{dim:raggio}', '{mink:r} = 50 m', 240, P(t, 8.6, 9.1));
    voce('{dim:velocità}', '15 m/s = 54 km/h', 295, P(t, 12.3, 12.8));
    voce('{dim:massa}', '{mink:m} = 1000 kg', 350, P(t, 25.4, 25.9));
    riga(395, P(t, 16.7, 17.1));
    drawRich(ctx, '{mv:a} = {mx:v}²/{mink:r} = 4,5 m/s²', PCX, 450, { size: 40, local: t - 21.3 });
    drawRich(ctx, '{my:F} = {mink:m·}{mx:v}²/{mink:r} = 4500 N', PCX, 525, { size: 40, local: t - 25.4 });
    riga(580, P(t, 31.0, 31.4));
    drawRich(ctx, '{dim:la fa} {y:l’attrito statico}', PCX, 630, { size: 34, local: t - 31.2 });
    drawRich(ctx, '{dim:delle gomme sull’asfalto}', PCX, 680, { size: 32, local: t - 31.8 });
    ctx.restore();
  }
  // 2 · il limite (44–85,4)
  const s2 = life(t, 44.0, 85.4, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    tit('il limite dell’attrito');
    drawRich(ctx, '{dim:massimo:} {mink:μ·m·g}', 1295, 230, { size: 32, align: 'left', alpha: P(t, 48.0, 48.5) });
    drawRich(ctx, '{mink:g} = 9,8 m/s²', 1808, 230, { size: 32, align: 'right', alpha: P(t, 48.0, 48.5) });
    drawRich(ctx, '{mink:m·}{mx:v}²/{mink:r} ≤ {mink:μ·m·g}', PCX, 290, { size: 38, local: t - 52.5 });
    pedici(ctx, '{mx:v}⌊max⌋{mink: = √(μ·g·r)}', PCX, 360, { size: 50, align: 'center', alpha: P(t, 56.7, 57.3) });
    riga(410, P(t, 61.2, 61.6));
    // la forza che serve contro l'attrito massimo (0,04 px per N)
    const kb = P(t, 61.3, 61.8);
    if (kb > 0) {
      ctx.save(); ctx.globalAlpha *= kb;
      const bagn = P(t, 76.6, 77.4), FM = MASSA * G * (MU + (MUB - MU) * bagn);
      const serve = t < 66.9 ? MU * MASSA * G : t < 76.3 ? MASSA * VC * VC / R : MASSA * VA * VA / R;
      const ks = t < 76.3 ? 1 : P(t, 81.6, 82.1), troppo = serve > FM + 1;
      const X0 = 1295, SC = .04;
      drawRich(ctx, '{dim:serve}  {my:F} = {mink:m·}{mx:v}²/{mink:r}', X0, 450, { size: 30, align: 'left', alpha: ks });
      txt(ctx, Math.round(serve) + ' N', 1808, 450, { size: 34, align: 'right', color: troppo ? C.r : C.ink, alpha: ks });
      ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(troppo ? C.r : C.y, .85);
      ctx.beginPath(); ctx.roundRect(X0, 478, serve * SC, 30, 6); ctx.fill(); ctx.restore();
      ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.moveTo(X0 + FM * SC, 466); ctx.lineTo(X0 + FM * SC, 520); ctx.stroke(); ctx.setLineDash([]);
      drawRich(ctx, '{dim:massimo}  {mink:μ·m·g}', X0, 545, { size: 30, align: 'left' });
      txt(ctx, Math.round(FM / 10) * 10 + ' N', 1808, 545, { size: 34, align: 'right' });
      ctx.restore();
    }
    riga(585, P(t, 61.2, 61.6));
    // tabellina: con r = 50 m
    ctx.save(); ctx.globalAlpha *= P(t, 61.4, 61.9);
    drawRich(ctx, '{dim:con} {mink:r} {dim:= 50 m}', 1295, 625, { size: 30, align: 'left' });
    drawRich(ctx, '{mink:μ}', 1530, 625, { size: 34 });
    pedici(ctx, '{mx:v}⌊max⌋', 1700, 622, { size: 34, align: 'center' });
    drawRich(ctx, '{dim:asciutto}', 1295, 680, { size: 32, align: 'left' });
    drawRich(ctx, '≈ 0,8', 1530, 680, { size: 34 });
    drawRich(ctx, '≈ 19,8 m/s', 1808, 680, { size: 34, align: 'right' });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 76.6, 77.1);
    drawRich(ctx, '{dim:bagnato}', 1295, 735, { size: 32, align: 'left' });
    drawRich(ctx, '≈ 0,4', 1530, 735, { size: 34 });
    drawRich(ctx, '14 m/s', 1808, 735, { size: 34, align: 'right' });
    ctx.restore();
    ctx.restore();
  }
  // 3 · la sopraelevata (85,4–98,6)
  const s3 = P(t, 85.4, 85.9);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    tit('la curva sopraelevata');
    drawRich(ctx, '{my:P}   {dim:il peso}', 1295, 250, { size: 34, align: 'left', alpha: P(t, 86.0, 86.5) });
    drawRich(ctx, '{my:N}   {dim:la reazione del fondo,}', 1295, 320, { size: 34, align: 'left', alpha: P(t, 89.8, 90.3) });
    drawRich(ctx, '{dim:perpendicolare alla strada}', 1345, 370, { size: 32, align: 'left', alpha: P(t, 90.2, 90.7) });
    riga(425, P(t, 91.6, 92.0));
    drawRich(ctx, 'una parte di {my:N} punta', PCX, 480, { size: 34, alpha: P(t, 91.8, 92.3) });
    drawRich(ctx, '{y:verso il centro}', PCX, 530, { size: 34, alpha: P(t, 92.0, 92.5) });
    riga(585, P(t, 94.6, 95.0));
    drawRich(ctx, '{g:aiuta l’attrito:}', PCX, 640, { size: 34, alpha: P(t, 94.7, 95.2) });
    drawRich(ctx, '{g:si può andare più forte}', PCX, 690, { size: 34, alpha: P(t, 95.0, 95.5) });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (98,6–108,5)
function sceneFine(ctx, t) {
  if (t < 98.5) return;
  const al = 1 - P(t, 106.6, 107.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.8 });
    drawRich(ctx, 'In curva è l’attrito delle gomme\na tenere l’auto verso il centro.', W / 2, 290, { size: 66, weight: 600, local: t - 99.2, stagger: .09 });
  });
  const pills = [[490, null], [960, 'bagnato: {mink:μ} più piccolo,\nvelocità più {r:bassa}'], [1430, 'sopraelevata:\nil fondo {g:aiuta}']];
  pills.forEach(([x, s], i) => {
    const a = 101.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    if (s) drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    else pedici(ctx, '{mx:v}⌊max⌋{mink: = √(μ·g·r)}', x, 500, { size: 44, align: 'center' });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nelle corse il tono segue l'altezza dell'auto sullo schermo;
  // sul bagnato segue la linea del massimo, da 0 (0) a 8000 N (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .4], ['pop', 8.7, .45],                             // la curva, l'auto, il raggio
    ['tono', 12.4, 15.02, [.1, .17, .25, .32, .38, .45, .51, .56]],                   // 15 m/s, in tempo reale
    ['pop', 16.9, .5], ['pop', 21.4, .55],                                            // l'accelerazione verso il centro, 4,5 m/s²
    ['pop', 25.4, .55], ['pop', 31.3, .5],                                            // la forza, 4500 N; l'attrito
    ['pop', 39.7, .3], ['tono', 39.8, 42.3, [.56, .68, .79, .91]],                    // senza attrito: dritta per la tangente
    ['soffio', 43.8], ['pop', 48.1, .45], ['pop', 52.6, .5], ['ding', 57.0],          // il limite: μ·m·g, la disuguaglianza, v max
    ['pop', 61.4, .5],                                                                // la forza che serve contro il massimo
    ['tono', 61.6, 66.01, [.1, .26, .41, .54, .65, .72, .75, .74]],                   // 19,8 m/s: ce la fa
    ['pop', 67.0, .25],                                                               // 22 m/s: la barra diventa rossa
    ['tono', 71.8, 75.47, [.1, .25, .39, .53, .65, .75, .82, .88]],                   // sbanda: curva più larga
    ['soffio', 76.6], ['tono', 76.6, 77.4, [.8, .78, .6, .43, .4]], ['pop', 76.8, .4],   // bagnato: il massimo si dimezza
    ['pop', 81.7, .3],                                                                // 54 km/h sono troppi
    ['soffio', 85.5], ['pop', 86.1, .4], ['pop', 89.9, .5],                           // la sopraelevata: P e N
    ['traccia', 91.6, 92.3], ['pop', 92.0, .55], ['ding', 95.0],                      // la parte verso il centro; aiuta l'attrito
    ['soffio', 98.7], ['pop', 101.2, .5], ['pop', 101.7, .6], ['pop', 102.2, .7],     // in una frase
  ];
  return {
    titolo: 'Quanto veloce in curva', durata: 108.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.7, 'girare vuol dire una forza'], [30.7, 43.8, 'chi la fa: l’attrito'], [43.8, 76.2, 'la velocità massima'],
      [76.2, 85.4, 'sul bagnato'], [85.4, 98.4, 'la curva sopraelevata']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneAlto(ctx, t); sceneSezione(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
