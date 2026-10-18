'use strict';
/* La luce intrappolata — dall'acqua all'aria il raggio si allontana dalla normale; all'angolo limite (≈ 49°) rade la
   superficie; oltre, la luce torna tutta dentro (riflessione totale). La fibra ottica. Argomento: ottica. */
CVIDEO.registra('ottica/riflessione-totale', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [80.2, 190], [81.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [80.2, 1050], [81.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [80.2, 2.2], [81.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [80.2, 2], [81.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [80.2, -1.5], [81.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.8, 'pensa'], [21.0, 'neutro'],
  [25.2, 'sorpreso'], [29.8, 'felice'], [33.8, 'sorpreso'], [38.4, 'festa'], [43.2, 'neutro'], [52.8, 'felice'],
  [57.2, 'neutro'], [61.6, 'felice'], [66.0, 'neutro'], [70.6, 'festa'], [75.2, 'felice'], [80.2, 'neutro'],
  [82.4, 'felice'], [88.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Può la luce restare chiusa\ndentro l’acqua?'],
  [7.9, 12.0, 'Una lampada sott’acqua manda\nun raggio verso la superficie.'],
  [12.2, 16.6, 'Uscendo nell’aria si {v:allontana}\ndalla normale: da 20° a circa 27°.'],
  [16.8, 20.8, 'Una piccola parte della luce\nsi {v:riflette} e torna giù.'],
  [21.0, 25.0, 'Inclino il raggio: l’angolo\nin aria cresce più in fretta.'],
  [25.2, 29.6, 'A circa 49° il raggio uscito\n{v:rade la superficie}: 90°.'],
  [29.8, 33.6, 'È l’{v:angolo limite}.'],
  [33.8, 38.2, 'Oltre l’angolo limite la luce\nnon esce più: torna {g:tutta dentro}.'],
  [38.4, 43.0, 'È la {v:riflessione totale}:\nla superficie fa da specchio.'],
  [43.2, 47.8, 'Succede solo verso un mezzo\ncon {mink:n} {g:minore}: dall’acqua all’aria.'],
  [48.0, 52.4, 'Dal vetro all’aria l’angolo\nlimite è più piccolo: circa 42°.'],
  [52.8, 57.0, 'Una {v:fibra ottica} è un filo\ndi vetro sottilissimo.'],
  [57.2, 61.4, 'La luce entra da un capo\ne batte sulla parete…'],
  [61.6, 65.8, '…a 75° dalla normale, oltre 42°:\n{g:riflessione totale}.'],
  [66.0, 70.4, 'Di rimbalzo in rimbalzo,\nanche dove la fibra {g:si piega}.'],
  [70.6, 75.0, 'Esce tutta dall’altro capo:\nla luce resta {g:intrappolata}.'],
  [75.2, 79.6, 'Così viaggiano internet\ne le telefonate: lampi di luce.'],
  [82.4, 88.0, 'Oltre l’angolo limite la luce\nnon esce: torna {g:tutta dentro}.'],
];

// ---------- aiutanti ----------
const RAD = Math.PI / 180;
const lung = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
function raggio(ctx, pts, k, col, w = 5, al = 1) {
  if (k <= 0 || al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  const L = lung(pts), fin = L[L.length - 1] * clamp(k);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
    if (m + 12 > fin || L[i] - L[i - 1] < 60) continue;
    const f = (m - L[i - 1]) / (L[i] - L[i - 1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, 1.15);
  }
  ctx.restore();
}
function lampo(ctx, p, col, al = 1) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 30);
  g.addColorStop(0, css(col, .75)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function suSpezzata(pts, s) {   // il punto a distanza s lungo la spezzata
  const L = lung(pts); s = clamp(s, 0, L[L.length - 1]);
  let i = 1; while (i < pts.length - 1 && L[i] < s) i++;
  const f = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
  return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
}
function arco(ctx, c, a0, a1, r, col, k = 1, w = 4) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(c[0], c[1], r, a0, lerp(a0, a1, clamp(k)), a1 < a0); ctx.stroke(); ctx.restore();
}
function lampada(ctx, S, ang, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(S[0], S[1]); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-104, -22, 92, 44, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.roundRect(-14, -26, 16, 52, 5); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const gradi = a => { const g = a / RAD, r = Math.round(g); return (Math.abs(g - r) > .05 ? '≈ ' : '') + r + '°'; };

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La luce intrappolata', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · dall'acqua all'aria (7,5–52,6): superficie in y = 420; l'angolo in aria viene da 1,33·(scarto in acqua) = (scarto in aria)
const I = [760, 420], LR = 300, NW = 1.33, TC = Math.asin(1 / NW);
const theta = t => kf(t, [[21.3, 20 * RAD], [24.0, 40 * RAD], [25.4, 40 * RAD], [27.0, TC], [34.0, TC], [35.4, 60 * RAD]]);
function sceneSuperficie(ctx, t) {
  if (t < 7.4 || t > 52.9) return;
  const al = life(t, 7.6, 52.6, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.x, .17); ctx.fillRect(112, I[1], 1696, 776 - I[1]);
  ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, I[1]); ctx.lineTo(1808, I[1]); ctx.stroke();
  drawRich(ctx, 'aria {dim:(}{mink:n}{dim: ≈ 1)}', 150, 170, { size: 34, align: 'left' });
  drawRich(ctx, '{x:acqua} {dim:(}{mink:n}{dim: ≈ 1,33)}', 150, I[1] + 46, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:n}{dim: è l’indice di rifrazione}', 1780, 740, { size: 30, align: 'right', alpha: P(t, 8.2, 8.7) });
  const th = theta(t), s = NW * Math.sin(th), esce = s <= 1 + 1e-9, ph = esce ? Math.asin(Math.min(1, s)) : 0;
  const q = Math.pow(th / TC, 8), aRif = esce ? 1 - .45 * q : 0, aRifl = esce ? .22 + .4 * q : 1;
  const S = [I[0] - 240 * Math.sin(th), I[1] + 240 * Math.cos(th)];   // la lampada più vicina: resta dentro la scheda
  const Rf = [I[0] + LR * Math.sin(ph), I[1] - LR * Math.cos(ph) - (ph > 89.5 * RAD ? 4 : 0)];   // a 90° il raggio rade la superficie, appena sopra
  const Rr = [I[0] + LR * Math.sin(th), I[1] + LR * Math.cos(th)];
  // la normale
  dashed(ctx, [I[0], 150], [I[0], 770], C.v, P(t, 8.0, 8.8), 1);
  drawRich(ctx, '{v:normale}', I[0] - 16, 150, { size: 30, align: 'right', alpha: P(t, 8.4, 8.9) });
  // i raggi: incidente, uscito (finché esce), riflesso (debole, poi tutto)
  const kr = P(t, 8.3, 9.3, E.lin);
  raggio(ctx, [S, I], kr, C.y);
  if (kr >= 1) {
    raggio(ctx, [I, Rf], P(t, 9.3, 10.1, E.lin), C.y, 5, aRif);
    raggio(ctx, [I, Rr], P(t, 17.0, 17.8, E.lin), C.y, 4, aRifl);
  }
  // gli impulsi di luce: in acqua più lenti; arrivati in superficie si dividono come il raggio
  const vA = 500, vW = 500 / NW, L = LR, LI = 240;
  for (let n = 0; 10.2 + n * 1.4 <= Math.min(t, 52.0); n++) {
    const e = t - 10.2 - n * 1.4, t1 = LI / vW;
    if (e < t1) lampo(ctx, suSpezzata([S, I], e * vW), C.y);
    else {
      if (esce) lampo(ctx, suSpezzata([I, Rf], (e - t1) * vA), C.y, aRif * clamp((L - (e - t1) * vA) / 60));
      if (t > 17.0) lampo(ctx, suSpezzata([I, Rr], (e - t1) * vW), C.y, aRifl * clamp((L - (e - t1) * vW) / 60));
    }
  }
  lampada(ctx, S, Math.atan2(I[1] - S[1], I[0] - S[0]), P(t, 7.9, 8.3));
  // gli angoli, dalla normale
  const ki = P(t, 12.4, 13.0);
  if (ki > 0) {
    arco(ctx, I, Math.PI / 2, Math.PI / 2 + th, 120, C.x, ki);
    // con angoli piccoli il numero sta appena fuori dallo spicchio, dalla parte opposta alla normale
    const a = Math.PI / 2 + (th > 40 * RAD ? th / 2 : th + .3); txt(ctx, gradi(th), I[0] + 190 * Math.cos(a), I[1] + 190 * Math.sin(a), { size: 38, weight: 600, color: C.x, alpha: ki });
  }
  const kf2 = P(t, 12.8, 13.4) * (esce ? 1 : 0);
  if (kf2 > 0) {
    arco(ctx, I, -Math.PI / 2, -Math.PI / 2 + ph, 120, C.g, kf2);
    const a = -Math.PI / 2 + (ph > 40 * RAD ? Math.min(ph, 80 * RAD) / 2 : ph + .3); txt(ctx, gradi(ph), I[0] + 190 * Math.cos(a), I[1] + 190 * Math.sin(a), { size: 38, weight: 600, color: C.g, alpha: kf2 });
  }
  const kt = P(t, 38.6, 39.2) * (esce ? 0 : 1);
  if (kt > 0) {
    arco(ctx, I, Math.PI / 2, Math.PI / 2 - th, 150, C.g, kt);
    const a = Math.PI / 2 - th / 2; txt(ctx, gradi(th), I[0] + 235 * Math.cos(a), I[1] + 235 * Math.sin(a), { size: 38, weight: 600, color: C.g, alpha: kt });
  }
  // la scritta dell'angolo limite, sotto la superficie
  const kl = life(t, 30.0, 33.7, .4, .4);
  if (kl > 0) drawRich(ctx, '{v:angolo limite ≈ 49°}', I[0] + 40, 735, { size: 38, align: 'left', alpha: kl });
  // la scheda degli angoli limite
  const kc = P(t, 48.2, 48.7);
  if (kc > 0) {
    card(ctx, 1290, 140, 490, 220, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, 'angolo limite', 1535, 190, { size: 36, weight: 600 }));
    txt(ctx, 'dall’acqua all’aria', 1320, 255, { size: 32, align: 'left' }); txt(ctx, '≈ 49°', 1750, 255, { size: 36, weight: 600, color: C.v, align: 'right' });
    txt(ctx, 'dal vetro all’aria', 1320, 315, { size: 32, align: 'left', alpha: P(t, 48.9, 49.4) }); txt(ctx, '≈ 42°', 1750, 315, { size: 36, weight: 600, color: C.v, align: 'right', alpha: P(t, 48.9, 49.4) });
    ctx.restore();
  }
  ctx.restore();
}

// 2 · la fibra ottica (52,6–80,2): un filo di vetro (n = 1,5) nell'aria, disegnato molto ingrandito
// l'asse della fibra: dritto, una curva in giù, un tratto, una curva in su, dritto fino al capo d'uscita
const NV = 1.5, MEZZA = 40;
const ASSE = (() => {
  const pts = []; let p = [400, 320], h = 0; pts.push({ p: p.slice(), h });
  const curva = (ang, R) => { const n = Math.ceil(Math.abs(ang) * R / 3), ds = Math.abs(ang) * R / n; for (let i = 0; i < n; i++) { h += ang / n; p = [p[0] + Math.cos(h) * ds, p[1] + Math.sin(h) * ds]; pts.push({ p: p.slice(), h }); } };
  const dritto = L => { const n = Math.ceil(L / 3); for (let i = 0; i < n; i++) { p = [p[0] + Math.cos(h) * L / n, p[1] + Math.sin(h) * L / n]; pts.push({ p: p.slice(), h }); } };
  dritto(480); curva(35 * RAD, 330); dritto(150); curva(-35 * RAD, 330); h = 0; dritto(1640 - p[0]);
  return pts;
})();
const PARETE = s => ASSE.map(({ p, h }) => [p[0] - Math.sin(h) * MEZZA * s, p[1] + Math.cos(h) * MEZZA * s]);
const SOPRA = PARETE(-1), SOTTO = PARETE(1), CAPO = ASSE[ASSE.length - 1];
// il percorso della luce dentro la fibra: riflessione sulle pareti, finché non arriva al capo d'uscita
const ENTRA = [ASSE[0].p[0], ASSE[0].p[1] - 12], A_DENTRO = 15 * RAD, A_FUORI = Math.asin(NV * Math.sin(A_DENTRO));
const PERCORSO = (() => {
  let p = ENTRA.slice(), d = [Math.cos(A_DENTRO), Math.sin(A_DENTRO)];
  const pts = [p.slice()], urti = [];
  const segs = [];
  for (const W2 of [SOPRA, SOTTO]) for (let i = 1; i < W2.length; i++) segs.push([W2[i - 1], W2[i]]);
  const cx = CAPO.p[0], ch = CAPO.h;
  for (let k = 0; k < 40; k++) {
    let best = null;
    for (const [a, b] of segs) {
      const ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
      if (Math.abs(den) < 1e-12) continue;
      const s = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
      if (s > 1e-6 && u >= 0 && u <= 1 && (!best || s < best.s)) best = { s, a, b };
    }
    // il capo d'uscita: la faccia verticale in x = cx (l'ultimo tratto è orizzontale)
    const sCapo = d[0] > 0 ? (cx - p[0]) / d[0] : Infinity;
    if (!best || sCapo < best.s) { p = [p[0] + d[0] * sCapo, p[1] + d[1] * sCapo]; pts.push(p); break; }
    p = [p[0] + d[0] * best.s, p[1] + d[1] * best.s];
    const ex = best.b[0] - best.a[0], ey = best.b[1] - best.a[1], l = Math.hypot(ex, ey), nx = -ey / l, ny = ex / l;
    const dn = d[0] * nx + d[1] * ny;
    urti.push({ p: p.slice(), angolo: Math.acos(Math.abs(dn)), n: [nx, ny] });
    d = [d[0] - 2 * dn * nx, d[1] - 2 * dn * ny];
    pts.push(p.slice());
  }
  // fuori dal capo: si allontana dalla normale (vetro → aria)
  const aIn = Math.atan2(d[1], d[0]) - ch, aOut = Math.asin(NV * Math.sin(aIn));
  const fuori = [p[0] + Math.cos(ch + aOut) * 140, p[1] + Math.sin(ch + aOut) * 140];
  return { pts, urti, fuori, aIn, aOut };
})();
const LAMPADA_F = [ENTRA[0] - Math.cos(A_FUORI) * 120, ENTRA[1] - Math.sin(A_FUORI) * 120];
const PERC_TOT = lung(PERCORSO.pts).slice(-1)[0];
function sceneFibra(ctx, t) {
  if (t < 52.4 || t > 80.6) return;
  const al = life(t, 52.6, 80.2, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il filo di vetro
  ctx.fillStyle = css(C.g, .14);
  ctx.beginPath(); SOPRA.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = SOTTO.length - 1; i >= 0; i--) ctx.lineTo(SOTTO[i][0], SOTTO[i][1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(mix(C.g, C.ink, .3)); ctx.lineWidth = 3; ctx.stroke();
  drawRich(ctx, '{g:vetro}', 890, 336, { size: 32, alpha: P(t, 53.2, 53.7) });
  txt(ctx, 'aria', 620, 430, { size: 32, color: C.dim, alpha: P(t, 53.2, 53.7) });
  drawRich(ctx, '{dim:disegno ingrandito: la fibra vera è spessa circa 0,1 mm}', 1780, 750, { size: 30, align: 'right', alpha: P(t, 54.0, 54.5) });
  // la luce: entra dal capo sinistro e percorre la fibra (il raggio si disegna dietro all'impulso)
  const v = 420, s = (t - 57.6) * v, sTot = PERC_TOT;
  const kEnt = P(t, 57.3, 57.6, E.lin);
  lampada(ctx, LAMPADA_F, A_FUORI, P(t, 57.0, 57.4));
  raggio(ctx, [LAMPADA_F, ENTRA], kEnt, C.y, 5);
  // fino a 66 s il raggio si ferma al primo urto, mentre Stilla ne parla
  const sMax = t < 66.0 ? lung(PERCORSO.pts)[1] : sTot;
  const sOra = clamp(t < 66.0 ? s : lung(PERCORSO.pts)[1] + (t - 66.2) * v, 0, sMax);
  if (sOra > 0) raggio(ctx, PERCORSO.pts, sOra / sTot, C.y, 4);
  if (sOra < sTot && sOra > 0) lampo(ctx, suSpezzata(PERCORSO.pts, sOra), C.y);
  const kOut = P(t, 66.2 + (sTot - lung(PERCORSO.pts)[1]) / v, 66.6 + (sTot - lung(PERCORSO.pts)[1]) / v, E.lin);
  if (kOut > 0) raggio(ctx, [PERCORSO.pts[PERCORSO.pts.length - 1], PERCORSO.fuori], kOut, C.y, 5);
  // impulsi che continuano a correre, dopo il primo giro
  const t0 = 66.2 + (sTot - lung(PERCORSO.pts)[1]) / v + .4;
  for (let n = 0; t0 + n * 1.2 <= Math.min(t, 79.6); n++) { const ss = (t - t0 - n * 1.2) * v; if (ss < sTot) lampo(ctx, suSpezzata(PERCORSO.pts, ss), C.y, .9); }
  // il primo urto, sulla parete di sotto: la normale (dentro il vetro) e l'angolo
  const U = PERCORSO.urti[0], ku = life(t, 61.7, 66.0, .4, .4);
  if (ku > 0 && U) {
    dashed(ctx, [U.p[0], U.p[1] + 30], [U.p[0], U.p[1] - 2 * MEZZA], C.v, 1, ku);
    const din = Math.atan2(PERCORSO.pts[0][1] - U.p[1], PERCORSO.pts[0][0] - U.p[0]);   // verso da cui arriva
    arco(ctx, U.p, -Math.PI / 2, din, 64, C.g, ku);
    txt(ctx, Math.round(U.angolo / RAD) + '°', U.p[0] - 55, U.p[1] - 110, { size: 34, weight: 600, color: C.g, alpha: ku });
  }
  ctx.restore();
}

// 3 · in una frase (80,2–91)
function sceneFine(ctx, t) {
  if (t < 80.2) return;
  const al = 1 - P(t, 89.4, 90.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 80.4 });
    drawRich(ctx, 'Oltre l’angolo limite la luce\nnon esce più: torna {g:tutta dentro}.', W / 2, 290, { size: 70, weight: 600, local: t - 80.8, stagger: .09 });
  });
  const pills = [[490, 'solo verso un mezzo\ncon {mink:n} {g:minore}'], [960, 'angolo limite:\nacqua ≈ 49°, vetro ≈ 42°'], [1430, 'fibra ottica:\n{v:riflessioni totali}']];
  pills.forEach(([x, s], i) => {
    const a = 82.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .45], ['traccia', 8.0, 8.8],                        // la lampada, la normale
    ['traccia', 8.3, 9.3], ['traccia', 9.3, 10.1],                                    // il raggio entra ed esce
    ['pop', 12.7, .5], ['pop', 13.1, .55],                                            // 20 gradi e 27 gradi
    ['traccia', 17.0, 17.8],                                                          // il riflesso debole
    ['tono', 21.3, 24.0, [.3, .3, .32, .37, .46, .57, .63, .65, .65]],                // inclino: l'angolo in aria cresce
    ['tono', 25.4, 27.0, [.65, .66, .68, .76, .87, .96, 1]], ['ding', 27.0],          // fino a 90: rade la superficie
    ['pop', 30.2, .55],                                                               // angolo limite
    ['tono', 34.0, 35.4, [.54, .55, .6, .66, .67]],                                   // oltre: torna tutta dentro
    ['pop', 39.0, .5],                                                                // l'angolo del riflesso
    ['pop', 48.4, .5], ['pop', 49.2, .55],                                            // la scheda: acqua, vetro
    ['soffio', 52.6], ['pop', 53.4, .4], ['pop', 54.2, .3],                           // la fibra ottica
    ['pop', 57.2, .45], ['traccia', 57.3, 58.1],                                      // la luce entra
    ['traccia', 61.7, 62.1], ['pop', 62.0, .55], ['ding', 62.4],                      // 75 gradi: riflessione totale
    ['traccia', 66.2, 69.0],                                                          // di rimbalzo in rimbalzo
    ['tono', 66.2, 69.0, [.7, .79, .89, .98, .9, .78, .56, .27, 0, .07, .14, .21, .16]],   // la luce segue la fibra
    ['traccia', 69.0, 69.4], ['pop', 69.4, .6],                                       // esce dall'altro capo
    ['soffio', 80.3], ['pop', 82.4, .5], ['pop', 82.9, .6], ['pop', 83.4, .7],        // in una frase
  ];
  return {
    titolo: 'La luce intrappolata', durata: 91, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 52.6, 'l’angolo limite'], [52.6, 80.2, 'la fibra ottica']],
    verifica: { urti: PERCORSO.urti.map(u => +(u.angolo / RAD).toFixed(2)), dentroAlCapo: PERCORSO.aIn / RAD, fuoriDalCapo: PERCORSO.aOut / RAD, entraFuori: A_FUORI / RAD },
    scena(ctx, t) { sceneIntro(ctx, t); sceneSuperficie(ctx, t); sceneFibra(ctx, t); sceneFine(ctx, t); },
  };
});
