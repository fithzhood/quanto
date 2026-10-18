'use strict';
/* La gabbia di Faraday — conduttori in equilibrio. I conduttori sono disegnati in sezione (cilindri lunghi): così la
   fisica del disegno è esatta in 2D. (1) 8 elettroni in più dentro: si respingono con forza ∝ 1/d (cariche in linea),
   attrito nel metallo, integrati: finiscono tutti sul bordo, a 45° l'uno dall'altro (al rallentatore). (2) cilindro
   neutro in campo uniforme E₀: gli elettroni vanno contro il campo, σ ∝ cos θ, fuori E = E₀ + E₀·R²·(2(x̂·r̂)r̂ − x̂)/r²
   (linee calcolate, perpendicolari alla superficie), dentro E = 0. (3) sfere collegate da un filo: campo in superficie
   ∝ 1/R (R = 150, 50, 15 px: frecce 30, 90, 300 px; segni sul bordo ∝ √R: 12, 7), la punta come sfera piccolissima: potere delle punte. (4) auto colpita
   dal fulmine: protegge la carrozzeria (gabbia di Faraday), non le gomme; il parafulmine offre una strada verso terra.
   Colori fissi dell'elettrostatica: positive C.v, negative C.x, forze C.y, campo C.ink. Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/conduttori', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 95.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.5, 'sorpreso'], [22.7, 'felice'],
  [27.1, 'neutro'], [41.5, 'festa'], [46.6, 'neutro'], [61.0, 'sorpreso'], [65.7, 'neutro'], [70.5, 'sorpreso'],
  [75.2, 'pensa'], [80.1, 'felice'], [85.0, 'neutro'], [89.7, 'felice'], [93.5, 'neutro'],
  [97.2, 'felice'], [101.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché in auto, durante un temporale,\nsei al sicuro?'],
  [7.9, 12.7, 'In un {g:conduttore}, come un metallo,\ngli elettroni si muovono liberi.'],
  [12.8, 17.4, 'Ci metto dentro elettroni in più:\nsi respingono a vicenda…'],
  [17.5, 22.6, '…e scappano tutti sulla {g:superficie}.\nAl rallentatore: è quasi istantaneo.'],
  [22.7, 26.9, 'In equilibrio la carica in eccesso\nsta tutta sulla superficie.'],
  [27.1, 31.6, 'Ora un conduttore {g:neutro} dentro\nun campo elettrico esterno.'],
  [31.7, 36.3, 'Il campo spinge gli elettroni a sinistra,\ncontro il suo verso.'],
  [36.4, 41.4, 'A destra restano le {v:positive}. Il campo\ndi {x:−} e {v:+}, dentro, annulla l’esterno.'],
  [41.5, 46.5, 'Dentro il conduttore il campo è {g:zero}:\naltrimenti gli elettroni si muoverebbero.'],
  [46.6, 51.4, 'Fuori le linee arrivano {g:perpendicolari}:\nnessuna spinta lungo la superficie.'],
  [51.6, 56.1, 'Tre sfere di metallo cariche,\ncollegate da un filo.'],
  [56.2, 60.9, 'Sfera più piccola: carica più fitta\ne campo più {g:intenso}.'],
  [61.0, 65.6, 'Una {g:punta} è come una sfera\npiccolissima: campo fortissimo.'],
  [65.7, 70.3, 'Lì l’aria diventa conduttrice:\nè il {g:potere delle punte}.'],
  [70.5, 75.1, 'Un fulmine colpisce un’auto:\nchi è dentro non si fa niente.'],
  [75.2, 80.0, 'Merito delle gomme? {r:No}: dopo chilometri\nd’aria, pochi centimetri non bastano.'],
  [80.1, 84.9, 'È la carrozzeria, una {g:gabbia di Faraday}:\ndentro il campo è zero.'],
  [85.0, 89.6, 'Il {g:parafulmine}: una punta collegata\na terra da un cavo di metallo.'],
  [89.7, 94.5, 'Non crea il fulmine: gli offre\nuna strada sicura verso terra.'],
  [97.2, 103.3, 'In un conduttore la carica sta sulla\nsuperficie e dentro il campo è zero.'],
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
function carica(ctx, p, segno, r = 34, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  const col = segno > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(2.5, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
  if (segno > 0) { ctx.moveTo(0, -a); ctx.lineTo(0, a); }
  ctx.stroke(); ctx.restore();
}
function segnetto(ctx, p, segno, al = 1, s = 9) {   // un segno + o − senza pallina, per le cariche in superficie
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(segno > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - s, p[1]); ctx.lineTo(p[0] + s, p[1]);
  if (segno > 0) { ctx.moveTo(p[0], p[1] - s); ctx.lineTo(p[0], p[1] + s); }
  ctx.stroke(); ctx.restore();
}
function metallo(ctx, c, R, al = 1) {   // un conduttore in sezione
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(c[0] - R * .35, c[1] - R * .4, R * .1, c[0], c[1], R);
  g.addColorStop(0, css(mix(C.dim, C.paper, .78))); g.addColorStop(1, css(mix(C.dim, C.paper, .5)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function linea(ctx, pts, al, conPunta = true, w = 3) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(mix(C.ink, C.paper, .4)); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
  if (conPunta) { const im = Math.floor(pts.length * .5), a = pts[Math.max(0, im - 1)], b = pts[Math.min(pts.length - 1, im + 1)]; arrowHead(ctx, pts[im], Math.atan2(b[1] - a[1], b[0] - a[0]), mix(C.ink, C.paper, .15), .95); }
  ctx.restore();
}

const CARTA = [110, 110, 1000, 680];

// ---------- 1 · gli elettroni in più scappano sul bordo (integrati una volta sola) ----------
const C1 = [610, 450], R1 = 220, RE = 14, MURO = R1 - 18;
const SIM_DT = 1 / 600, SIM_T = 2.5;
const ELETTRONI = (() => {
  const N = 8, K = 2e5, GAM = 6;   // forza fra cariche in linea ∝ 1/d; attrito nel metallo
  const p = Array.from({ length: N }, (_, i) => { const a = i * 2.39996, r = 18 + 26 * Math.sqrt(i); return [-40 + r * Math.cos(a), 10 + r * Math.sin(a)]; });
  const v = p.map(() => [0, 0]), fotogrammi = [];
  for (let k = 0; k * SIM_DT <= SIM_T; k++) {
    if (k % 10 === 0) fotogrammi.push(p.map(q => q.slice()));   // uno ogni 1/60 s
    const f = p.map(() => [0, 0]);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (i !== j) {
      const dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1], d2 = dx * dx + dy * dy + 25;
      f[i][0] += K * dx / d2; f[i][1] += K * dy / d2;
    }
    for (let i = 0; i < N; i++) {
      v[i][0] += (f[i][0] - GAM * v[i][0]) * SIM_DT; v[i][1] += (f[i][1] - GAM * v[i][1]) * SIM_DT;
      p[i][0] += v[i][0] * SIM_DT; p[i][1] += v[i][1] * SIM_DT;
      const r = Math.hypot(p[i][0], p[i][1]);
      if (r > MURO) { const ux = p[i][0] / r, uy = p[i][1] / r; p[i][0] = ux * MURO; p[i][1] = uy * MURO; const vr = v[i][0] * ux + v[i][1] * uy; if (vr > 0) { v[i][0] -= vr * ux; v[i][1] -= vr * uy; } }
    }
  }
  return fotogrammi;
})();
const T_VIA = 17.7, RALLENTA = 1.0 / 3.0;   // 3 s di video per 1 s di simulazione: tutti sul bordo a 20,4 s, fermi (entro 2 px) a 22,2 s
function posElettroni(t) {
  const u = clamp((t - T_VIA) * RALLENTA, 0, SIM_T) * 60, i0 = Math.floor(u), i1 = Math.min(ELETTRONI.length - 1, i0 + 1), f = u - i0;
  return ELETTRONI[i0].map((q, i) => [C1[0] + lerp(q[0], ELETTRONI[i1][i][0], f), C1[1] + lerp(q[1], ELETTRONI[i1][i][1], f)]);
}

// ---------- 2 · conduttore neutro in un campo uniforme ----------
const C2 = [610, 450], R2 = 130;
function campoCil(x, y) {   // fuori: E₀ + campo delle cariche indotte; dentro: zero
  const dx = x - C2[0], dy = y - C2[1], r2 = dx * dx + dy * dy;
  if (r2 < R2 * R2) return [0, 0];
  const r = Math.sqrt(r2), ux = dx / r, uy = dy / r, k = R2 * R2 / r2;
  return [1 + k * (2 * ux * ux - 1), k * 2 * ux * uy];
}
const YS = Array.from({ length: 15 }, (_, j) => 450 + (j - 7) * 44);
const LINEE0 = YS.map(y => [[125, y], [1095, y]]);
const LINEE1 = (() => {
  const dir = (x, y) => { const [ex, ey] = campoCil(x, y), l = Math.hypot(ex, ey) || 1; return [ex / l, ey / l]; };
  const out = [];
  YS.forEach(y0 => {
    let x = 125, y = y0; const pts = [[x, y]]; let tocca = false;
    for (let i = 0; i < 2000; i++) {
      const h = 3, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      if (Math.hypot(x - C2[0], y - C2[1]) < R2 + 1.5) { tocca = true; break; }
      pts.push([x, y]);
      if (x > 1095 || y < 125 || y > 775) break;
    }
    out.push({ pts, tocca });
    // per simmetria, chi finisce sul conduttore riparte dal lato destro (specchiata e percorsa al contrario)
    if (tocca) out.push({ pts: pts.map(([px, py]) => [2 * C2[0] - px, py]).reverse(), tocca: true });
  });
  return out;
})();
// le cariche indotte: densità ∝ cos θ, quindi seni equidistanti
const INDOTTE = Array.from({ length: 7 }, (_, i) => { const s = -.86 + 1.72 * i / 6, c = Math.sqrt(1 - s * s); return [c, s]; });
const separazione = t => P(t, 32.0, 35.0);

// ---------- 3 · sfere collegate: campo in superficie ∝ 1/R ----------
const SFERE = [{ c: [300, 520], R: 150, n: '{mink:R}', e: '{mink:E}', angoli: [-150, -120, -90, -60, -30] },
  { c: [640, 520], R: 50, n: '{mink:R}/3', e: '3{mink:E}', angoli: [-150, -120, -90, -60, -30] },
  { c: [880, 520], R: 15, n: '{mink:R}/10', e: '10{mink:E}', angoli: [-120, -90, -60] }];
const L_CAMPO = R => 30 * 150 / R;   // 30 px sulla sfera grande

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La gabbia di Faraday', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

// 1 · la carica in più va sulla superficie (7,5–27)
function sceneUno(ctx, t) {
  const al = life(t, 7.8, 27.2, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  metallo(ctx, C1, R1);
  txt(ctx, 'conduttore, in sezione', C1[0], C1[1] + R1 + 40, { size: 30, color: C.dim });
  const ke = P(t, 12.9, 13.6, E.back);
  if (ke > 0) posElettroni(t).forEach((p, i) => carica(ctx, p, -1, RE, 1, P(t, 12.9 + i * .08, 13.4 + i * .08, E.back)));
  if (t > T_VIA && t < T_VIA + 4.4) txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, T_VIA, T_VIA + 4.4, .3, .4) });
  ctx.restore();
}

// 2 · il conduttore neutro nel campo esterno (27–51,5)
function sceneDue(ctx, t) {
  const al = life(t, 27.2, 51.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const s = separazione(t), kl = P(t, 27.3, 28.3);
  // le linee: dritte prima che le cariche si separino, piegate dopo (calcolate tutte e due)
  LINEE0.forEach(pts => linea(ctx, pts, kl * (1 - s)));
  LINEE1.forEach(l => linea(ctx, l.pts, kl * s));
  metallo(ctx, C2, R2);
  // le cariche indotte: gli elettroni attraversano il conduttore verso sinistra, a destra restano le positive
  INDOTTE.forEach(([c, sn]) => {
    const pr = [C2[0] + (R2 - 16) * c, C2[1] - (R2 - 16) * sn], pl = [C2[0] - (R2 - 16) * c, C2[1] - (R2 - 16) * sn];
    segnetto(ctx, pr, 1, clamp(s * 2));
    segnetto(ctx, [lerp(pr[0], pl[0], s), pl[1]], -1, clamp(s * 3));
  });
  if (t > 31.9 && t < 35.3) fondo(ctx, 980, 150, 230, 44, life(t, 31.9, 35.3, .3, .3)), txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, 31.9, 35.3, .3, .3) });
  // dentro, zero
  const kz = P(t, 41.6, 42.1);
  if (kz > 0) { fondo(ctx, C2[0], C2[1], 150, 56, kz); drawRich(ctx, '{mink:E} = {g:0}', C2[0], C2[1], { size: 48, alpha: kz }); }
  // fuori, perpendicolari: un angolo retto dove due linee arrivano
  const kp = life(t, 46.7, 51.6, .4, .4);
  if (kp > 0) [2, 12].forEach(j => {
    const l = LINEE1.filter(q => q.tocca)[j]; if (!l) return;
    const p = l.pts[l.pts.length - 1], a = Math.atan2(p[1] - C2[1], p[0] - C2[0]), n = [Math.cos(a), Math.sin(a)], tg = [-n[1], n[0]], q = 22;
    const b = [C2[0] + R2 * n[0], C2[1] + R2 * n[1]];
    ctx.save(); ctx.globalAlpha *= kp; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(b[0] + n[0] * q, b[1] + n[1] * q); ctx.lineTo(b[0] + n[0] * q + tg[0] * q, b[1] + n[1] * q + tg[1] * q); ctx.lineTo(b[0] + tg[0] * q, b[1] + tg[1] * q); ctx.stroke();
    ctx.restore();
  });
  // il verso del campo esterno
  const kE = P(t, 27.6, 28.2) * (1 - P(t, 31.7, 32.0));
  if (kE > 0) { fondo(ctx, 190, 180, 90, 50, kE); drawRich(ctx, '{mink:E}', 190, 180, { size: 44, alpha: kE }); }
  ctx.restore();
}

// 3 · le punte (51,5–70,4)
function sceneTre(ctx, t) {
  const al = life(t, 51.6, 70.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il filo che le collega
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(SFERE[0].c[0] + SFERE[0].R, 520); ctx.lineTo(SFERE[2].c[0] - SFERE[2].R, 520); ctx.stroke(); ctx.restore();
  SFERE.forEach((S, k) => {
    metallo(ctx, S.c, S.R);
    // la carica in superficie: carica ∝ R, densità ∝ 1/R, quindi distanza fra due cariche ∝ √R: lungo il bordo
    // ci stanno segni ∝ √R (12 sulla grande, 12/√3 ≈ 7 sulla media): meno carica, ma più fitta; sulla minuscola, un anello pieno
    const kc = P(t, 51.9 + k * .2, 52.5 + k * .2), nS = Math.round(12 * Math.sqrt(S.R / 150));
    if (S.R > 30) for (let i = 0; i < nS; i++) { const a = i / nS * TAU + .26; segnetto(ctx, [S.c[0] + (S.R - 13) * Math.cos(a), S.c[1] + (S.R - 13) * Math.sin(a)], 1, kc, S.R > 100 ? 9 : 6); }
    else { ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = css(C.v); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(S.c[0], S.c[1], S.R - 3, 0, TAU); ctx.stroke(); ctx.restore(); }
    drawRich(ctx, S.n, S.c[0], S.c[1] + S.R + 44, { size: 38, alpha: P(t, 52.0, 52.5) });
    // il campo appena fuori: lungo come 1/R (la sfera minuscola arriva quando si parla della punta)
    const kE = k < 2 ? P(t, 56.4, 57.0) : P(t, 61.2, 61.8);
    if (kE > 0) {
      const L = L_CAMPO(S.R);
      S.angoli.forEach(g => { const a = g * Math.PI / 180, u = [Math.cos(a), Math.sin(a)]; freccia(ctx, [S.c[0] + u[0] * (S.R + 4), S.c[1] + u[1] * (S.R + 4)], [S.c[0] + u[0] * (S.R + 4 + L), S.c[1] + u[1] * (S.R + 4 + L)], C.ink, kE, 5); });
      const yt = S.c[1] - S.R - 4 - L - 30;
      fondo(ctx, S.c[0], yt, 80, 46, kE); drawRich(ctx, S.e, S.c[0], yt, { size: 38, alpha: kE });
    }
  });
  // l'aria attorno alla punta diventa conduttrice: un alone che pulsa
  const ka = P(t, 65.9, 66.6);
  if (ka > 0) {
    const S = SFERE[2], pul = .75 + .25 * Math.sin(t * 9);
    ctx.save(); ctx.globalAlpha *= ka * pul;
    const g = ctx.createRadialGradient(S.c[0], S.c[1], S.R, S.c[0], S.c[1], S.R + 60);
    g.addColorStop(0, css(C.v, .55)); g.addColorStop(1, css(C.v, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(S.c[0], S.c[1], S.R + 60, 0, TAU); ctx.fill(); ctx.restore();
    fondo(ctx, 960, 660, 240, 44, ka); txt(ctx, 'l’aria conduce', 960, 660, { size: 30, color: C.dim, alpha: ka });
  }
  ctx.restore();
}

// 4 · il fulmine sull'auto e il parafulmine (70,4–95)
const SUOLO = 690;
const lampo = (a, b, n, amp, seme) => {   // un fulmine a zig-zag, sempre uguale (niente caso)
  const pts = [a];
  for (let i = 1; i < n; i++) { const f = i / n, o = amp * Math.sin(seme * 12.9898 * i) * (1 - f * .3); pts.push([lerp(a[0], b[0], f) + o, lerp(a[1], b[1], f)]); }
  pts.push(b); return pts;
};
const FULMINE_AUTO = lampo([470, 112], [560, 528], 11, 34, 1.7);
const FULMINE_TORRE = lampo([500, 112], [610, 196], 6, 22, 2.3);
// la carrozzeria: dove passa la corrente (dal tetto, lungo il metallo, fino a terra davanti e dietro)
const CORRENTE = [[[560, 528], [652, 528], [712, 594], [800, 600], [810, 662], [818, SUOLO]], [[560, 528], [470, 528], [410, 594], [330, 604], [322, 662], [312, SUOLO]]];
function scia(ctx, pts, k, col, w, al) {   // la corrente che scorre: un tratteggio che avanza
  if (al <= 0 || k <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = css(col, .8); ctx.shadowBlur = 14;
  ctx.setLineDash([18, 14]); ctx.lineDashOffset = -k * 400;
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function disegnaFulmine(ctx, pts, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = css(mix(C.y, C.paper, .35)); ctx.shadowColor = css(C.y, .9); ctx.shadowBlur = 26; ctx.lineWidth = 10;
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.shadowBlur = 0; ctx.lineWidth = 4; ctx.strokeStyle = css(C.paper); ctx.stroke();
  ctx.restore();
}
function auto(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // carrozzeria
  ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(330, 662); ctx.lineTo(322, 604); ctx.lineTo(410, 592); ctx.lineTo(470, 528); ctx.lineTo(652, 528); ctx.lineTo(712, 592); ctx.lineTo(800, 600); ctx.lineTo(810, 662); ctx.closePath(); ctx.fill(); ctx.stroke();
  // finestrini, con qualcuno dentro
  ctx.fillStyle = css(mix(C.x, C.paper, .7));
  ctx.beginPath(); ctx.moveTo(482, 542); ctx.lineTo(555, 542); ctx.lineTo(555, 590); ctx.lineTo(432, 590); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(570, 542); ctx.lineTo(642, 542); ctx.lineTo(690, 590); ctx.lineTo(570, 590); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(612, 566, 13, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.roundRect(596, 580, 32, 12, 6); ctx.fill();
  // ruote
  for (const x of [420, 712]) { ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, 662, 30, 0, TAU); ctx.fill(); ctx.fillStyle = css(mix(C.dim, C.paper, .3)); ctx.beginPath(); ctx.arc(x, 662, 12, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function torre(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.y, C.paper, .7)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(470, 360, 280, SUOLO - 360); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.x, C.paper, .7));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) ctx.fillRect(500 + i * 85, 390 + j * 75, 50, 45);
  // l'asta con la punta, il cavo lungo il muro, il dispersore nel terreno
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(610, 360); ctx.lineTo(610, 206); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(603, 210); ctx.lineTo(610, 192); ctx.lineTo(617, 210); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(610, 360); ctx.lineTo(770, 360); ctx.lineTo(770, SUOLO); ctx.lineTo(770, 760); ctx.stroke();
  ctx.restore();
}
const CAVO = [[610, 196], [610, 360], [770, 360], [770, SUOLO], [770, 760]];
function sceneQuattro(ctx, t) {
  const al = life(t, 70.5, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(CARTA[0] + 1, CARTA[1] + 1, CARTA[2] - 2, CARTA[3] - 2, 21); ctx.clip();
  // il terreno
  ctx.fillStyle = css(mix(C.g, C.paper, .78)); ctx.fillRect(110, SUOLO, 1000, 100);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(110, SUOLO); ctx.lineTo(1110, SUOLO); ctx.stroke();
  // l'auto (70,5–85), poi l'edificio col parafulmine (85–95)
  const ka = life(t, 70.5, 85.2, .5, .5), kt = life(t, 85.0, T_FINE + .1, .5, .5);
  auto(ctx, ka);
  torre(ctx, kt);
  const tremolio = tt => .7 + .3 * Math.sin(tt * 47) * Math.sin(tt * 31);
  // il fulmine sull'auto: il lampo, poi la corrente che corre sulla carrozzeria fino a terra
  disegnaFulmine(ctx, FULMINE_AUTO, ka * life(t, 70.8, 75.0, .1, .6) * tremolio(t));
  const kc = ka * Math.max(life(t, 70.9, 75.0, .2, .6), life(t, 80.2, 84.9, .4, .4));
  CORRENTE.forEach(pts => scia(ctx, pts, t, mix(C.y, C.paper, .2), 6, kc));
  // l'idea sbagliata: le gomme
  const kg = ka * life(t, 75.3, 80.1, .3, .4);
  if (kg > 0) {
    fondo(ctx, 420, 758, 300, 46, kg); drawRich(ctx, '{r:le gomme isolano?}', 420, 758, { size: 32, alpha: kg });
    ctx.save(); ctx.globalAlpha *= kg; crossMark(ctx, 420, 662, P(t, 76.2, 77.0), C.r, .55); ctx.restore();
  }
  // dentro, il campo è zero
  const kz = ka * life(t, 80.3, 85.0, .4, .4);
  if (kz > 0) { fondo(ctx, 545, 628, 124, 44, kz); drawRich(ctx, '{mink:E} = {g:0}', 545, 628, { size: 36, alpha: kz }); }
  // il parafulmine: il fulmine sulla punta, la corrente giù per il cavo
  disegnaFulmine(ctx, FULMINE_TORRE, kt * life(t, 89.9, 94.6, .1, .6) * tremolio(t));
  scia(ctx, CAVO, t, mix(C.y, C.paper, .2), 6, kt * life(t, 90.0, 94.6, .3, .5));
  const kn = kt * P(t, 85.4, 86.0);
  if (kn > 0) {
    fondo(ctx, 760, 205, 200, 46, kn); txt(ctx, 'parafulmine', 760, 205, { size: 32, color: C.dim, alpha: kn });
    fondo(ctx, 900, 740, 130, 44, kn); txt(ctx, 'a terra', 900, 740, { size: 32, color: C.dim, alpha: kn });
  }
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 27.2, () => {
    conFont(TITOLI, () => drawRich(ctx, 'conduttori', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:elettroni liberi di muoversi}', cx, 240, { size: 34, local: t - 8.1 });
    drawRich(ctx, '{dim:(i metalli)}', cx, 285, { size: 32, local: t - 8.4 });
    drawRich(ctx, '{x:−}{dim: elettroni in più: si respingono}', cx, 370, { size: 32, local: t - 12.9 });
    drawRich(ctx, '{dim:in equilibrio la carica in eccesso}', cx, 470, { size: 32, local: t - 22.8 });
    drawRich(ctx, '{g:sta sulla superficie}', cx, 520, { size: 40, local: t - 23.1 });
  });
  blocco(27.2, 51.6, () => {
    drawRich(ctx, '{mink:E}{dim:: campo elettrico,}', cx, 165, { size: 34, local: t - 27.2 });
    drawRich(ctx, '{dim:la forza su ogni coulomb}', cx, 210, { size: 32, local: t - 27.4 });
    drawRich(ctx, '{dim:linee di campo: seguono} {mink:E}', cx, 262, { size: 32, local: t - 27.6 });
    drawRich(ctx, '{x:−}{dim: elettroni contro} {mink:E}{dim:, a sinistra}', cx, 330, { size: 32, local: t - 31.8 });
    drawRich(ctx, '{v:+}{dim: positive, a destra}', cx, 378, { size: 32, local: t - 36.7 });
    drawRich(ctx, '{dim:il campo di} {x:−} {dim:e} {v:+} {dim:annulla}', cx, 424, { size: 32, local: t - 37.0 });
    drawRich(ctx, '{dim:quello esterno}', cx, 466, { size: 32, local: t - 37.3 });
    drawRich(ctx, '{dim:dentro:} {mink:E} = {g:0}', cx, 545, { size: 50, local: t - 41.6 });
    drawRich(ctx, '{dim:fuori:} {mink:E} {g:perpendicolare}', cx, 620, { size: 38, local: t - 46.7 });
    drawRich(ctx, '{dim:alla superficie}', cx, 668, { size: 34, local: t - 47.0 });
  });
  blocco(51.6, 70.6, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il potere delle punte', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:sfere collegate da un filo}', cx, 240, { size: 32, local: t - 51.7 });
    drawRich(ctx, '{dim:la più piccola ha meno carica,}', cx, 305, { size: 32, local: t - 56.3 });
    drawRich(ctx, '{dim:ma più} {g:fitta}', cx, 350, { size: 32, local: t - 56.6 });
    drawRich(ctx, '{dim:raggio} {mink:R}/3 → {dim:campo} {g:3 volte}', cx, 420, { size: 36, local: t - 56.8 });
    drawRich(ctx, '{dim:raggio} {mink:R}/10 → {dim:campo} {g:10 volte}', cx, 475, { size: 36, local: t - 61.2 });
    drawRich(ctx, '{dim:punta: campo fortissimo}', cx, 545, { size: 34, local: t - 61.6 });
    drawRich(ctx, '{dim:l’aria diventa conduttrice}', cx, 620, { size: 34, local: t - 65.8 });
  });
  blocco(70.5, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il fulmine', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{r:le gomme?} {dim:no: pochi centimetri}', cx, 245, { size: 32, local: t - 75.4 });
    drawRich(ctx, '{dim:dopo chilometri d’aria}', cx, 290, { size: 32, local: t - 75.7 });
    drawRich(ctx, '{dim:la carrozzeria di metallo:}', cx, 370, { size: 32, local: t - 80.2 });
    drawRich(ctx, '{g:gabbia di Faraday}', cx, 420, { size: 40, local: t - 80.4 });
    drawRich(ctx, '{dim:dentro} {mink:E} = {g:0}', cx, 470, { size: 34, local: t - 80.7 });
    drawRich(ctx, '{dim:parafulmine: punta collegata a terra}', cx, 560, { size: 32, local: t - 85.1 });
    drawRich(ctx, '{dim:non crea il fulmine:}', cx, 630, { size: 32, local: t - 89.8 });
    drawRich(ctx, '{g:gli offre una strada}', cx, 677, { size: 36, local: t - 90.0 });
  });
}

// in una frase (95–106)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.3, 105.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La carica di un conduttore sta in superficie;\ndentro, il campo è zero.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'carica in eccesso\nsulla {g:superficie}'], [960, 'campo più {g:intenso}\nsulle punte'], [1470, 'il metallo che avvolge:\n{g:gabbia di Faraday}']];
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

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, il conduttore
    ['pop', 12.9, .4], ['pop', 13.2, .5], ['pop', 13.5, .6],                          // gli elettroni in più
    ['tono', 17.7, 20.4, [.3, .45, .6, .7, .75]],                                     // scappano verso il bordo
    ['ding', 23.1],                                                                   // la carica sta sulla superficie
    ['soffio', 27.2], ['traccia', 27.3, 28.3], ['pop', 27.6, .5],                     // il campo esterno E
    ['tono', 32.0, 35.0, [.6, .57, .5, .43, .4]],                                     // gli elettroni vanno a sinistra
    ['pop', 36.7, .6], ['pop', 41.6, .6], ['pop', 46.7, .5],                          // le positive; E = 0; perpendicolari
    ['soffio', 51.6], ['pop', 51.9, .3], ['pop', 52.1, .5], ['pop', 52.3, .7],        // tre sfere collegate
    ['pop', 56.4, .5], ['pop', 61.2, .8],                                             // campo 3 volte, 10 volte
    ['pop', 65.9, .7],                                                                // l'aria conduce
    ['soffio', 70.5], ['tono', 70.8, 71.1, [1, .7, .4, .2]], ['traccia', 70.9, 72.0], // il fulmine sull'auto, la corrente
    ['pop', 75.3, .3], ['traccia', 76.2, 77.0],                                       // le gomme? no
    ['ding', 80.4],                                                                   // gabbia di Faraday: dentro E = 0
    ['soffio', 85.0], ['pop', 85.4, .5],                                              // il parafulmine
    ['tono', 89.9, 90.1, [1, .75]], ['traccia', 90.0, 91.5],                          // il fulmine sulla punta, giù per il cavo
    ['soffio', 95.2], ['pop', 97.2, .5], ['pop', 97.7, .6], ['pop', 98.2, .7],        // in una frase
  ];
  return {
    titolo: 'La gabbia di Faraday', durata: 106, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.0, 'la carica va in superficie'], [27.0, 51.5, 'dentro, campo zero'], [51.5, 70.4, 'il potere delle punte'], [70.4, T_FINE, 'fulmini']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneUno(ctx, t); sceneDue(ctx, t); sceneTre(ctx, t); sceneQuattro(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
