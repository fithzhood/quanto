'use strict';
/* La carta delle altezze — le equipotenziali come curve di livello (analogia dichiarata). (1) Una collina
   H = 900 m · exp(−(dx²/sx² + dy²/sy²)), più ripida a sinistra (sx 150 px) che a destra (330 px): curve di livello
   esatte ogni 100 m; un sentiero su quella dei 500 m; la via di massima pendenza (integrata lungo −∇H) le taglia ad
   angolo retto. (2) Carica puntiforme: V = k·Q/r, zero all'infinito, con k·Q = 4800 V·px: equipotenziali ogni 10 V
   (r = 480, 240, 160, 120… px), più fitte vicino a Q; linee radiali perpendicolari; una carica di prova spostata lungo
   quella dei 20 V: forza radiale ⟂ spostamento, lavoro zero. (3) Dipolo (+Q e −Q a 360 px): V = k·Q/r₁ − k·Q/r₂,
   equipotenziali tracciate (passo lungo la tangente + correzione di Newton), V = 0 sull'asse, linee di campo con
   Runge-Kutta. Colori fissi dell'elettrostatica: positive C.v, negative C.x, forze C.y, campo C.ink; equipotenziali C.g.
   Argomento: potenziale. */
CVIDEO.registra('potenziale/equipotenziali', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.3, 'sorpreso'], [18.4, 'felice'],
  [23.5, 'neutro'], [28.5, 'pensa'], [33.2, 'neutro'], [43.9, 'felice'], [49.0, 'neutro'], [59.4, 'sorpreso'],
  [64.4, 'neutro'], [69.4, 'festa'], [74.9, 'neutro'], [80.5, 'sorpreso'], [85.1, 'felice'], [89.9, 'neutro'],
  [96.8, 'felice'], [100.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come si disegna una montagna\nsu un foglio piatto?'],
  [7.9, 13.2, 'Sulle carte, le {g:curve di livello} uniscono\ni punti alla stessa altezza.'],
  [13.3, 18.3, 'Dove sono fitte il pendio è {g:ripido},\ndove sono rade è dolce.'],
  [18.4, 23.4, 'Un sentiero lungo una curva di livello\nnon sale e non scende.'],
  [23.5, 28.4, 'La via più ripida in discesa taglia\nogni curva ad {g:angolo retto}.'],
  [28.5, 33.1, 'Per le cariche vale un’{g:analogia}:\nal posto dell’altezza, il potenziale.'],
  [33.2, 38.7, 'Il {g:potenziale} {mink:V} è l’energia potenziale\nper coulomb di carica: si misura in volt.'],
  [38.8, 43.8, 'Attorno a una carica {mink:Q} vale {mink:k·Q/r},\ncon lo zero lontanissimo, all’infinito.'],
  [43.9, 48.9, 'Stessa distanza {mink:r}, stesso {mink:V}: i punti\na uguale potenziale fanno {g:circonferenze}.'],
  [49.0, 53.5, 'Sono le {g:equipotenziali}: nello spazio,\nsuperfici sferiche attorno a {mink:Q}.'],
  [53.6, 59.3, 'Le disegno ogni 10 V: vicino a {mink:Q}\nsono {g:fitte}, dove il campo è intenso.'],
  [59.4, 64.3, 'Le linee di campo escono dritte: tagliano\nogni equipotenziale ad {g:angolo retto}.'],
  [64.4, 69.3, 'Sposto una carica su un’equipotenziale:\nla forza è sempre {g:perpendicolare}…'],
  [69.4, 74.8, '…e il campo {g:non fa lavoro}: Δ{mink:V} = 0,\ncome sul sentiero in piano.'],
  [74.9, 80.4, 'Due cariche, {v:+} e {x:−}: il potenziale\nè la {g:somma} dei due potenziali.'],
  [80.5, 85.0, 'Le equipotenziali, calcolate punto\nper punto, non sono più circonferenze.'],
  [85.1, 89.8, 'A metà strada {mink:V} = 0: i due contributi\nsi annullano.'],
  [89.9, 94.3, 'Le linee di campo le tagliano\nancora ad {g:angolo retto}.'],
  [96.8, 103.0, 'Le equipotenziali sono le curve di livello\ndel potenziale, perpendicolari al campo.'],
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
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
  if (segno > 0) { ctx.moveTo(0, -a); ctx.lineTo(0, a); }
  ctx.stroke(); ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
// una spezzata disegnata fino alla frazione k
function tratto(ctx, pts, k, col, w = 3, al = 1) {
  if (k <= 0 || al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.max(2, Math.round(pts.length * k));
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
  ctx.restore();
}
// una linea di campo con la punta a metà
function lineaCampo(ctx, pts, k, al, w = 3) {
  if (k <= 0 || al <= 0) return;
  tratto(ctx, pts, k, mix(C.ink, C.paper, .4), w, al);
  const im = Math.floor(pts.length * .5), n = Math.round(pts.length * k);
  if (n > im + 1) { ctx.save(); ctx.globalAlpha *= al; const a = pts[im - 1], b = pts[im + 1]; arrowHead(ctx, pts[im], Math.atan2(b[1] - a[1], b[0] - a[0]), mix(C.ink, C.paper, .15), .95); ctx.restore(); }
}
// l'angolo retto: in p, lungo le direzioni u e w (unitarie)
function angoloRetto(ctx, p, u, w, al, q = 24) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] + u[0] * q, p[1] + u[1] * q); ctx.lineTo(p[0] + (u[0] + w[0]) * q, p[1] + (u[1] + w[1]) * q); ctx.lineTo(p[0] + w[0] * q, p[1] + w[1] * q); ctx.stroke();
  ctx.restore();
}
function etichetta(ctx, s, x, y, al, w = 96, size = 30) {
  if (al <= 0) return;
  fondo(ctx, x, y, w, size + 12, al); drawRich(ctx, s, x, y, { size, alpha: al });
}
const nel = (x, y) => x > 118 && x < 1102 && y > 118 && y < 782;   // dentro la scheda

// ---------- 1 · la collina ----------
const CARTA = [110, 110, 1000, 680];
const CH = [590, 450], H0 = 900, SY = 200;
const sx = dx => dx < 0 ? 150 : 330;                       // a sinistra ripida, a destra dolce
const alt = (x, y) => { const dx = x - CH[0], dy = y - CH[1]; return H0 * Math.exp(-(dx * dx / sx(dx) ** 2 + dy * dy / SY ** 2)); };
const LIVELLI = [100, 200, 300, 400, 500, 600, 700, 800];
const puntoCurva = (h, th) => { const r = Math.sqrt(Math.log(H0 / h)), c = Math.cos(th); return [CH[0] + r * (c < 0 ? 150 : 330) * c, CH[1] + r * SY * Math.sin(th)]; };
const CURVE = LIVELLI.map(h => Array.from({ length: 241 }, (_, i) => puntoCurva(h, i / 240 * TAU)));
const MARRONE = () => mix(C.y, C.ink, .45);
const TH_ETI = 25 * Math.PI / 180;                         // le quote si leggono in basso a destra
const thSentiero = t => lerp(210, 330, clamp((t - 19.0) / 3.6)) * Math.PI / 180;
// la via più ripida in discesa: si segue −∇H, con Runge-Kutta, dalla vetta verso l'alto a sinistra
const DISCESA = (() => {
  const dir = (x, y) => { const dx = x - CH[0], dy = y - CH[1], gx = dx / sx(dx) ** 2, gy = dy / SY ** 2, l = Math.hypot(gx, gy) || 1; return [gx / l, gy / l]; };
  let x = CH[0] - 14, y = CH[1] - 26; const pts = [[x, y]];
  for (let i = 0; i < 2000; i++) {
    const h = 2, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
    x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    pts.push([x, y]);
    if (alt(x, y) < 70 || !nel(x, y)) break;
  }
  return pts;
})();
// dove la discesa attraversa le curve dei 700 e dei 300 m: lì si mostra l'angolo retto
const INCROCI = [700, 300].map(h => {
  const i = DISCESA.findIndex((p, j) => j && alt(...DISCESA[j - 1]) >= h && alt(...p) < h);
  const p = DISCESA[i], a = DISCESA[i - 1], b = DISCESA[Math.min(DISCESA.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  return { p, u: [-u[0], -u[1]], w: [-u[1], u[0]], f: i / DISCESA.length };
});

// ---------- 2 · la carica puntiforme: V = k·Q/r con k·Q = 4800 V·px ----------
const QC = [610, 450], RQ = 32, KQ = 4800;
const CERCHI = [1, 2, 3, 4].map(n => ({ v: 10 * n, r: KQ / (10 * n) }));   // 480, 240, 160, 120 px: fino a 40 V, così il nome di Q resta libero
const TH_Q = 25 * Math.PI / 180;
const RAGGI = Array.from({ length: 16 }, (_, k) => k * TAU / 16);
const raggio = a => { const pts = []; for (let r = RQ + 4; ; r += 4) { const x = QC[0] + r * Math.cos(a), y = QC[1] + r * Math.sin(a); if (!nel(x, y)) break; pts.push([x, y]); } return pts; };
const LINEE_Q = RAGGI.map(raggio);
const A_RETTO = 14 * TAU / 16;                             // in alto a destra
const thProva = t => lerp(190, 240, clamp((t - 65.2) / 3.4)) * Math.PI / 180;   // spostata a mano, piano

// ---------- 3 · il dipolo ----------
const PP = [430, 450], PM = [790, 450], RD = 28;
const Vdip = (x, y) => KQ / Math.hypot(x - PP[0], y - PP[1]) - KQ / Math.hypot(x - PM[0], y - PM[1]);
function campoDip(x, y) {   // E = −∇V (in unità arbitrarie, basta la direzione)
  let ex = 0, ey = 0;
  for (const [c, q] of [[PP, 1], [PM, -1]]) { const dx = x - c[0], dy = y - c[1], r2 = dx * dx + dy * dy, r = Math.sqrt(r2); ex += q * dx / (r2 * r); ey += q * dy / (r2 * r); }
  return [ex, ey];
}
// un'equipotenziale: si cammina lungo la tangente (⟂ al campo) e si corregge con Newton verso il livello giusto
function equipotenziale(lev) {
  let a = lev > 0 ? PP[0] + RD + 2 : 610, b = lev > 0 ? 610 : PM[0] - RD - 2;
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if ((Vdip(m, 450) - lev) * (Vdip(a, 450) - lev) <= 0) b = m; else a = m; }
  const p0 = [(a + b) / 2, 450], pts = [p0.slice()];
  let p = p0.slice();
  const tang = q => { const [ex, ey] = campoDip(q[0], q[1]), l = Math.hypot(ex, ey); return [-ey / l, ex / l]; };
  for (let i = 0; i < 8000; i++) {
    const h = 2, k1 = tang(p), k2 = tang([p[0] + h / 2 * k1[0], p[1] + h / 2 * k1[1]]);
    p = [p[0] + h * k2[0], p[1] + h * k2[1]];
    for (let j = 0; j < 2; j++) {   // Newton: ∇V = −E·KQ
      const [ex, ey] = campoDip(p[0], p[1]), gx = -ex * KQ, gy = -ey * KQ, g2 = gx * gx + gy * gy, d = (lev - Vdip(p[0], p[1])) / g2;
      p = [p[0] + d * gx, p[1] + d * gy];
    }
    pts.push(p.slice());
    if (i > 30 && Math.hypot(p[0] - p0[0], p[1] - p0[1]) < 2.5) { pts.push(p0.slice()); break; }
  }
  return pts;
}
const LIV_DIP = [10, 20, 30, 40, -10, -20, -30, -40];
const EQUI_DIP = LIV_DIP.map(v => ({ v, pts: equipotenziale(v) }));
const LINEE_DIP = (() => {
  const dir = (x, y) => { const [ex, ey] = campoDip(x, y), l = Math.hypot(ex, ey); return [ex / l, ey / l]; };
  const out = [];
  for (let k = 0; k < 16; k++) {
    const a = k * Math.PI / 8; let x = PP[0] + (RD + 2) * Math.cos(a), y = PP[1] + (RD + 2) * Math.sin(a);
    const pts = [[x, y]]; let esce = false;
    for (let i = 0; i < 3000; i++) {
      const h = 2, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      pts.push([x, y]);
      if (Math.hypot(x - PM[0], y - PM[1]) < RD + 2) break;
      if (!nel(x, y)) { esce = true; break; }
    }
    out.push({ pts, k });
    if (esce) out.push({ pts: pts.map(([px, py]) => [PP[0] + PM[0] - px, py]).reverse(), k: -k });
  }
  return out;
})();
// l'angolo retto: dove la linea che parte in alto a destra (k = 13) attraversa l'equipotenziale dei 20 V
const RETTO_DIP = (() => {
  const L = LINEE_DIP.find(l => l.k === 13).pts, i = L.findIndex((p, j) => j && Vdip(...L[j - 1]) >= 20 && Vdip(...p) < 20);
  const p = L[i], [ex, ey] = campoDip(p[0], p[1]), l = Math.hypot(ex, ey), u = [ex / l, ey / l];
  return { p, u, w: [-u[1], u[0]] };
})();

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La carta delle altezze', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

// 1 · la collina (7,5–33)
function sceneCollina(ctx, t) {
  const al = life(t, 7.8, 33.3, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // fitte a sinistra, rade a destra: due fasce lungo l'orizzontale per la vetta
  const kf = life(t, 13.5, 18.4, .4, .4);
  if (kf > 0) {
    const sin = [puntoCurva(100, Math.PI), puntoCurva(800, Math.PI)], des = [puntoCurva(800, 0), puntoCurva(100, 0)];
    ctx.save(); ctx.globalAlpha *= kf * .35; ctx.strokeStyle = css(C.g); ctx.lineWidth = 26; ctx.lineCap = 'round';
    for (const [a, b] of [sin, des]) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.restore();
  }
  CURVE.forEach((pts, i) => {
    const sent = LIVELLI[i] === 500 ? life(t, 18.6, 23.5, .3, .4) : 0;
    tratto(ctx, pts, P(t, 8.1 + i * .15, 9.7 + i * .15), mix(MARRONE(), C.g, sent), 3 + 2 * sent);
  });
  // la vetta
  const kv = P(t, 9.6, 10.0);
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv; ctx.fillStyle = css(MARRONE());
    ctx.beginPath(); ctx.moveTo(CH[0], CH[1] - 12); ctx.lineTo(CH[0] + 11, CH[1] + 8); ctx.lineTo(CH[0] - 11, CH[1] + 8); ctx.closePath(); ctx.fill(); ctx.restore();
    txt(ctx, '900 m', CH[0] + 34, CH[1] + 30, { size: 30, color: C.dim, alpha: kv });   // a destra, dove la curva più interna è lontana
  }
  [100, 400, 700].forEach((h, i) => { const p = puntoCurva(h, TH_ETI); etichetta(ctx, h + ' m', p[0], p[1], P(t, 10.0 + i * .1, 10.4 + i * .1), 104, 30); });
  if (kf > 0) {
    etichetta(ctx, '{g:ripido}', 453, 400, kf, 112, 30);
    etichetta(ctx, '{g:dolce}', 890, 400, kf, 100, 30);
  }
  // il sentiero sulla curva dei 500 m
  const ks = life(t, 18.6, 23.5, .3, .4);
  if (ks > 0) {
    const th0 = 210 * Math.PI / 180, th = thSentiero(t), tr = [];
    for (let i = 0; i <= 60; i++) tr.push(puntoCurva(500, lerp(th0, th, i / 60)));
    tratto(ctx, tr, 1, C.g, 7, ks);
    const p = puntoCurva(500, th);
    ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.fill(); ctx.restore();
  }
  // la discesa più ripida, e gli angoli retti
  const kd = P(t, 23.8, 25.8, E.lin), ad = life(t, 23.6, 33.3, .3, .5);
  if (ad > 0) {
    tratto(ctx, DISCESA, kd, C.x, 6, ad);
    INCROCI.forEach(c => angoloRetto(ctx, c.p, c.u, c.w, ad * clamp((kd - c.f) * 8)));
  }
  ctx.restore();
}
// 2 · la carica puntiforme (33–75)
function sceneCarica(ctx, t) {
  const al = life(t, 33.3, 75.0, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // le linee di campo, radiali
  const kl = P(t, 59.6, 60.8);
  if (kl > 0) LINEE_Q.forEach(pts => lineaCampo(ctx, pts, kl, 1));
  // le equipotenziali: prima quella dei 20 V, che parte dal punto a distanza r; poi tutte, ogni 10 V
  const A0 = 155 * Math.PI / 180;
  CERCHI.forEach((c, i) => {
    const k = c.v === 20 ? P(t, 44.2, 46.0) : P(t, 53.8 + i * .15, 54.8 + i * .15);
    if (k <= 0) return;
    const w = c.v === 20 && t < 53.6 ? 5 : 3.5;
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(QC[0], QC[1], c.r, A0, A0 + k * TAU); ctx.stroke(); ctx.restore();
  });
  // il raggio r e il punto a 20 V
  const kr = life(t, 38.9, 49.0, .4, .4);
  if (kr > 0) {
    const p = [QC[0] + 240 * Math.cos(A0), QC[1] + 240 * Math.sin(A0)];
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(QC[0] + RQ * Math.cos(A0), QC[1] + RQ * Math.sin(A0)); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha *= kr; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); ctx.restore();
    const m = [QC[0] + 130 * Math.cos(A0), QC[1] + 130 * Math.sin(A0)];
    etichetta(ctx, '{mink:r}', m[0] + 14, m[1] + 30, kr, 44, 36);
  }
  // i valori
  const kv = P(t, 44.6, 45.1);
  [[20, kv], [10, P(t, 54.0, 54.5)], [30, P(t, 54.3, 54.8)]].forEach(([v, k]) => {
    const r = KQ / v; etichetta(ctx, '{g:' + v + ' V}', QC[0] + r * Math.cos(TH_Q), QC[1] + r * Math.sin(TH_Q), k, 90, 30);
  });
  // l'angolo retto fra una linea di campo e l'equipotenziale dei 20 V
  const ka = life(t, 60.8, 64.5, .3, .4);
  if (ka > 0) { const u = [Math.cos(A_RETTO), Math.sin(A_RETTO)]; angoloRetto(ctx, [QC[0] + 240 * u[0], QC[1] + 240 * u[1]], u, [-u[1], u[0]], ka); }
  // la carica di prova spostata lungo l'equipotenziale dei 20 V
  const kp = life(t, 64.6, 75.0, .4, .5);
  if (kp > 0) {
    const th = thProva(t), th0 = 190 * Math.PI / 180, u = [Math.cos(th), Math.sin(th)], p = [QC[0] + 240 * u[0], QC[1] + 240 * u[1]];
    ctx.save(); ctx.globalAlpha *= kp; ctx.strokeStyle = css(C.g); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(QC[0], QC[1], 240, th0, th); ctx.stroke(); ctx.restore();
    // la direzione dello spostamento: tangente all'equipotenziale
    const tg = [u[1], -u[0]];
    ctx.save(); ctx.globalAlpha *= kp; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(p[0] - tg[0] * 80, p[1] - tg[1] * 80); ctx.lineTo(p[0] + tg[0] * 80, p[1] + tg[1] * 80); ctx.stroke(); ctx.restore();
    freccia(ctx, [p[0] + u[0] * 25, p[1] + u[1] * 25], [p[0] + u[0] * 125, p[1] + u[1] * 125], C.y, kp, 8);
    const pf = [p[0] + u[0] * 80 - u[1] * 36, p[1] + u[1] * 80 + u[0] * 36];
    etichetta(ctx, '{my:F}', pf[0], pf[1], kp, 44, 40);
    angoloRetto(ctx, p, u, [-tg[0], -tg[1]], kp, 40);   // fra la forza e la direzione in cui si sposta
    carica(ctx, p, 1, 22, kp);
    const pq = [p[0] - u[0] * 50, p[1] - u[1] * 50];
    etichetta(ctx, '{mink:q}', pq[0], pq[1], kp, 40, 38);
  }
  carica(ctx, QC, 1, RQ, 1, P(t, 33.4, 34.0, E.back));
  // il nome sta dentro il cerchio dei 40 V; esce quando arrivano le linee di campo, che ci passerebbero sopra
  etichetta(ctx, '{mink:Q}', QC[0] - 48, QC[1] - 48, P(t, 33.8, 34.3) * (1 - P(t, 59.4, 59.8)), 46, 40);
  ctx.restore();
}

// 3 · il dipolo (75–94,6)
function sceneDipolo(ctx, t) {
  const al = life(t, 75.0, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const kl = P(t, 90.0, 91.6);
  if (kl > 0) LINEE_DIP.forEach(l => lineaCampo(ctx, l.pts, kl, 1));
  EQUI_DIP.forEach((e, i) => tratto(ctx, e.pts, P(t, 80.7 + i * .12, 82.3 + i * .12, E.lin), C.g, 3.5));
  // V = 0: la retta a metà strada
  const k0 = P(t, 81.0, 82.4, E.lin), e0 = life(t, 85.2, T_FINE + .1, .4, .4);
  tratto(ctx, [[610, 114], [610, 786]], k0, C.g, 3.5 + 3 * e0);
  if (e0 > 0) etichetta(ctx, '{mink:V} = 0', 610, 740, e0, 110, 32);
  const RD2 = RETTO_DIP;
  angoloRetto(ctx, RD2.p, RD2.u, RD2.w, P(t, 91.6, 92.0));
  carica(ctx, PP, 1, RD, 1, P(t, 75.0, 75.6, E.back));
  carica(ctx, PM, -1, RD, 1, P(t, 75.3, 75.9, E.back));
  const kNomi = 1 - P(t, 89.7, 90.1);   // via prima delle linee di campo
  etichetta(ctx, '{mink:Q}', PP[0], PP[1] + 58, P(t, 75.4, 75.9) * kNomi, 46, 38);
  etichetta(ctx, '{mink:−Q}', PM[0], PM[1] + 58, P(t, 75.6, 76.1) * kNomi, 64, 38);
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 33.3, () => {
    conFont(TITOLI, () => drawRich(ctx, 'curve di livello', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:uniscono i punti}', cx, 235, { size: 34, local: t - 8.0 });
    drawRich(ctx, '{dim:alla stessa altezza}', cx, 280, { size: 34, local: t - 8.2 });
    drawRich(ctx, '{g:fitte}{dim:: pendio ripido}', cx, 350, { size: 34, local: t - 13.4 });
    drawRich(ctx, '{dim:rade: pendio dolce}', cx, 395, { size: 34, local: t - 13.7 });
    drawRich(ctx, '{dim:lungo una curva: né su né giù}', cx, 465, { size: 32, local: t - 18.5 });
    drawRich(ctx, '{dim:la via più ripida le taglia}', cx, 535, { size: 32, local: t - 23.6 });
    drawRich(ctx, '{g:ad angolo retto}', cx, 580, { size: 36, local: t - 23.9 });
    separa(ctx, 630, P(t, 28.6, 29.0));
    drawRich(ctx, '{dim:un’analogia: altezza →} {g:potenziale}', cx, 680, { size: 32, local: t - 28.7 });
  });
  blocco(33.3, 75.0, () => {
    drawRich(ctx, '{g:potenziale} {mink:V}{dim:: energia potenziale}', cx, 170, { size: 34, local: t - 33.3 });
    drawRich(ctx, '{dim:per coulomb, in volt (V)}', cx, 215, { size: 32, local: t - 33.6 });
    separa(ctx, 255, P(t, 38.9, 39.3));
    drawRich(ctx, '{mink:V} = {mink:k·Q/r}', cx, 305, { size: 50, local: t - 38.9 });
    drawRich(ctx, '{mink:k} ≈ 8,99·10{mink:⁹} N·m²/C²', cx, 362, { size: 30, local: t - 39.2 });
    drawRich(ctx, '{mink:r}{dim:: distanza da} {mink:Q}{dim:; zero all’infinito}', cx, 407, { size: 30, local: t - 39.5 });
    separa(ctx, 450, P(t, 44.0, 44.4));
    drawRich(ctx, '{g:equipotenziali}{dim:: stesso} {mink:V}', cx, 495, { size: 36, local: t - 49.1 });
    drawRich(ctx, '{dim:più fitte dove il campo è intenso}', cx, 545, { size: 30, local: t - 53.7 });
    drawRich(ctx, '{dim:ad angolo retto con le linee}', cx, 592, { size: 30, local: t - 59.5 });
    drawRich(ctx, '{dim:lungo un’equipotenziale}', cx, 662, { size: 32, local: t - 69.5 });
    drawRich(ctx, '{dim:lavoro del campo =} {g:0}', cx, 715, { size: 38, local: t - 69.8 });
  });
  blocco(75.0, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'dipolo', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:V} = {mink:k·Q/r₁} − {mink:k·Q/r₂}', cx, 245, { size: 44, local: t - 75.1 });
    drawRich(ctx, '{mink:r₁}, {mink:r₂}{dim:: distanze dalla} {v:+} {dim:e dalla} {x:−}', cx, 305, { size: 30, local: t - 75.5 });
    drawRich(ctx, '{dim:equipotenziali calcolate}', cx, 385, { size: 32, local: t - 80.6 });
    drawRich(ctx, '{dim:punto per punto}', cx, 428, { size: 32, local: t - 80.8 });
    drawRich(ctx, '{dim:a metà strada:} {mink:V} = {g:0}', cx, 505, { size: 38, local: t - 85.2 });
    drawRich(ctx, '{dim:linee di campo} {g:ad angolo retto}', cx, 580, { size: 32, local: t - 90.0 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.3, 105.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Le equipotenziali sono le curve di livello\ndel potenziale, ad angolo retto col campo.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{g:equipotenziale}\n{dim:punti con lo stesso} {mink:V}'], [960, 'ad {g:angolo retto}\ncon le linee di campo'], [1470, 'più {g:fitte}\ndove il campo è intenso']];
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
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 10.75],                                         // le curve di livello
    ['pop', 9.6, .7], ['pop', 10.2, .45],                                             // la vetta, le quote
    ['pop', 13.6, .5],                                                                // fitte e rade
    ['pop', 18.6, .5], ['tono', 19.0, 22.6, [.5, .5]],                                // il sentiero: né su né giù
    ['traccia', 23.8, 25.8], ['tono', 23.8, 25.8, [.97, .89, .78, .62, .47, .33, .22, .13, .08]],   // la via più ripida scende
    ['pop', 24.3, .6], ['pop', 25.05, .4],                                            // gli angoli retti
    ['soffio', 33.3], ['pop', 33.4, .6],                                              // la carica Q
    ['traccia', 38.9, 39.4], ['pop', 39.0, .45],                                      // il raggio r
    ['traccia', 44.2, 46.0], ['pop', 44.6, .5],                                       // l'equipotenziale dei 20 V
    ['traccia', 53.8, 55.25], ['pop', 54.0, .4], ['pop', 54.3, .6],                   // tutte, ogni 10 V
    ['traccia', 59.6, 60.8], ['pop', 60.8, .55],                                      // le linee di campo, l'angolo retto
    ['pop', 64.6, .5], ['tono', 65.2, 68.6, [.5, .5]],                                // la carica di prova: potenziale costante
    ['soffio', 75.0], ['pop', 75.0, .65], ['pop', 75.3, .35],                         // il dipolo
    ['traccia', 80.7, 83.15],                                                         // le equipotenziali calcolate
    ['ding', 85.3],                                                                   // a metà strada V = 0
    ['traccia', 90.0, 91.6], ['pop', 91.6, .55],                                      // le linee di campo, l'angolo retto
    ['soffio', 94.6], ['pop', 96.8, .5], ['pop', 97.3, .6], ['pop', 97.8, .7],        // in una frase
  ];
  return {
    titolo: 'La carta delle altezze', durata: 106, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.1, 'le curve di livello'], [33.1, 74.8, 'una carica'], [74.8, T_FINE, 'il dipolo']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCollina(ctx, t); sceneCarica(ctx, t); sceneDipolo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
