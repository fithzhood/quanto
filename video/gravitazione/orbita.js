'use strict';
/* Il cannone di Newton — dalla cima di una montagna alta 50 km (esagerata, ma disegnata in scala: 2 px), senza aria, si
   spara in orizzontale a 5, 7 e 7,8 km/s e alla velocità dell'orbita circolare a quella quota, √(g·R²/(R + h)) ≈ 7,87 km/s
   (g = 9,8 m/s², R = 6370 km): le traiettorie vere, integrate con la gravità 1/r² (RK4, passo fisso). Cadono a circa 660,
   1560 e 6200 km dal cannone (6°, 14° e 55° di giro; i primi due anche in un riquadro ingrandito); a circa 7,9 km/s la palla cade senza mai toccare terra: in 1 s avanza 7,9 km e cade di 4,9 m,
   e in 7,9 km la superficie si abbassa di 7,9² / (2 · 6370) km ≈ 4,9 m. A 400 km g ≈ 8,7 m/s²: gli astronauti cadono insieme
   alla stazione. Più in alto il giro dura di più (GPS a circa 20 000 km: circa 12 ore); a circa 36 000 km sopra
   l'equatore dura un giorno: il geostazionario (in scala, vista dal polo nord). Argomento: gravitazione. */
CVIDEO.registra('gravitazione/orbita', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot } = M;

const T_FINE = 95.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [35.1, 'festa'], [38.0, 'felice'],
  [40.6, 'pensa'], [45.1, 'neutro'], [54.3, 'festa'], [58.9, 'felice'], [63.5, 'pensa'], [67.7, 'neutro'],
  [72.3, 'felice'], [76.9, 'neutro'], [81.5, 'sorpreso'], [86.1, 'neutro'], [90.7, 'felice'], [T_FINE, 'neutro'],
  [97.7, 'felice'], [101.7, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Che cosa tiene un satellite\nlassù, senza motori?'],
  [7.9, 12.5, 'Newton immaginò un cannone in cima\na una montagna altissima.'],
  [12.6, 17.2, 'Montagna alta 50 km ({r:esagerata}),\nniente aria: spara in orizzontale.'],
  [17.3, 21.6, 'A 5 km/s la palla cade dopo\ncirca 660 km.'],
  [21.7, 26.0, 'A 7 km/s cade più lontano:\ncirca 1560 km.'],
  [26.1, 30.4, 'A 7,8 km/s fa un bel pezzo\ndi giro, poi atterra.'],
  [30.5, 35.0, 'A circa 7,9 km/s…'],
  [35.1, 40.4, '…cade per sempre, senza mai\ntoccare terra: è in {g:orbita}!'],
  [40.6, 45.0, 'Che cosa succede in un secondo?\nIngrandisco.'],
  [45.1, 49.6, 'Senza gravità andrebbe dritta:\n7,9 km in 1 s.'],
  [49.7, 54.2, 'Invece cade, come una mela:\n½·{mv:g}{mink:·t²} = 4,9 m.'],
  [54.3, 58.8, 'E in 7,9 km la Terra si abbassa\nproprio di 4,9 m!'],
  [58.9, 63.4, 'Resta sempre alla stessa quota:\nun’orbita è una {g:caduta continua}.'],
  [63.5, 67.6, '{r:Ma in orbita non c’è gravità?}'],
  [67.7, 72.2, 'C’è: a 400 km {mv:g} ≈ 8,7 m/s²,\nquasi come qui.'],
  [72.3, 76.8, 'Stazione e astronauti cadono\n{g:insieme}: per questo galleggiano.'],
  [76.9, 81.4, 'Più in alto, giri più lunghi:\na 20 000 km, 12 ore.'],
  [81.5, 86.0, 'A circa 36 000 km di quota\ndura {g:un giorno}…'],
  [86.1, 90.6, '…come la Terra: resta sopra lo stesso\n{v:punto dell’equatore}.'],
  [90.7, 95.0, 'È il satellite {v:geostazionario},\nsopra l’equatore.'],
  [97.7, 102.7, 'Un’orbita è una caduta che non finisce:\nla Terra si incurva sotto.'],
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
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function terra(ctx, p, r, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0] - r * .3, p[1] - r * .35, r * .1, p[0], p[1], r);
  g.addColorStop(0, css(mix(mix(C.x, C.g, .35), [255, 255, 255], .4))); g.addColorStop(1, css(mix(C.x, C.g, .35)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function fermo(ctx, x, y, al, testo) {   // in alto a destra della scheda: tempo accelerato, fermo immagine…
  if (al <= 0 || !testo) return;
  txt(ctx, testo, x, y, { size: 30, color: C.dim, align: 'right', alpha: al });
}

// ---------- i tiri: gravità 1/r², GM = 1, partenza a r = 1 con velocità orizzontale u (u = 1: orbita circolare a 50 km) ----------
const R_KM = 6370, H_KM = 50, V_CIRC = Math.sqrt(9.8 * (R_KM * 1e3) ** 2 / ((R_KM + H_KM) * 1e3)) / 1000;   // ≈ 7,870 km/s
const RT = 270, HM = RT * H_KM / R_KM, R0 = RT + HM, RS = RT / R0, CT = [610, 470];   // la Terra (270 px) e la montagna (2,1 px, in scala)
function traiettoria(u, passi = 3300) {
  const h = .002, pts = []; let x = 0, y = 1, vx = u, vy = 0;
  const acc = (x, y) => { const r3 = Math.pow(x * x + y * y, 1.5); return [-x / r3, -y / r3]; };
  for (let i = 0; i < passi; i++) {
    pts.push([x, y]);
    if (Math.hypot(x, y) < RS) break;
    const a1 = acc(x, y), a2 = acc(x + h / 2 * vx, y + h / 2 * vy);
    const v2 = [vx + h / 2 * a1[0], vy + h / 2 * a1[1]], a3 = acc(x + h / 2 * v2[0], y + h / 2 * v2[1]);
    const v3 = [vx + h / 2 * a2[0], vy + h / 2 * a2[1]], a4 = acc(x + h * v3[0], y + h * v3[1]);
    const v4 = [vx + h * a3[0], vy + h * a3[1]];
    x += h / 6 * (vx + 2 * v2[0] + 2 * v3[0] + v4[0]); y += h / 6 * (vy + 2 * v2[1] + 2 * v3[1] + v4[1]);
    vx += h / 6 * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]); vy += h / 6 * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
  }
  return pts;   // un punto ogni 0,002 unità di tempo
}
// tempo accelerato: i primi due tiri a 2 min al secondo (volano 0,9 e 1,9 s: la caduta si vede, e tocca terra presto nel fumetto), gli altri a 10 min al secondo (l'orbita intera,
// 85 min, in 8,5 s); l'unità di tempo vale (R + h)/v ≈ 816 s. arrivo: km lungo il suolo dal cannone (≈ 660 e 1560 km)
const T_UNITA = (R_KM + H_KM) / V_CIRC;
const TIRI = [[5, '5', 17.6, () => C.y, 120], [7, '7', 21.9, () => C.v, 120], [7.8, '7,8', 26.3, () => C.ink, 600], [V_CIRC, '≈ 7,9', 30.7, () => C.g, 600]]
  .map(([v, nome, t0, col, scala], i) => {
    const pts = traiettoria(v / V_CIRC, i === 3 ? 4200 : 3300), ult = pts[pts.length - 1];
    return { v, nome, t0, col, scala, pts, vola: (pts.length - 1) * .002 * T_UNITA / scala, arrivo: Math.atan2(ult[0], ult[1]) * R_KM };
  });
const passi = (T, t) => Math.min(T.pts.length, Math.floor((t - T.t0) * T.scala / T_UNITA / .002) + 1);
const aSchermo = ([x, y]) => [CT[0] + x * R0, CT[1] - y * R0];

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il cannone di Newton', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · i tiri (7,5–40,6)
function sceneCannone(ctx, t) {
  const al = life(t, 7.6, 40.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  terra(ctx, CT, RT);
  // la montagna (50 km: 2 px, in scala) e il cannone (non in scala), con la bocca dove parte la palla
  ctx.fillStyle = css(mix(C.dim, C.ink, .3));
  ctx.beginPath(); ctx.moveTo(CT[0] - 9, CT[1] - RT + 1); ctx.lineTo(CT[0] - 1, CT[1] - R0); ctx.lineTo(CT[0] + 1, CT[1] - R0); ctx.lineTo(CT[0] + 9, CT[1] - RT + 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.roundRect(CT[0] - 22, CT[1] - R0 - 5, 24, 10, 3); ctx.fill();
  // le traiettorie: ognuna si disegna mentre la palla vola, poi resta
  // (prima tutti i bordini chiari, perché la traiettoria corre a 2 px dal suolo; poi le linee, i tiri corti sopra l'orbita)
  let palla = null;
  const visti = TIRI.filter(T => t >= T.t0).map(T => ({ T, n: passi(T, t) }));
  const linea = ({ T, n }) => { ctx.beginPath(); for (let i = 0; i < n; i++) { const q = aSchermo(T.pts[i]); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const v of visti) { linea(v); ctx.strokeStyle = css(C.paper); ctx.lineWidth = 9; ctx.stroke(); }
  for (const v of visti.slice().reverse()) { linea(v); ctx.strokeStyle = css(v.T.col()); ctx.lineWidth = 4; ctx.stroke(); }
  for (const { T, n } of visti) {
    const fine = aSchermo(T.pts[n - 1]);
    if (n < T.pts.length) palla = fine;
    else dot(ctx, fine, T.col(), 1, 7);   // dove è caduta
  }
  if (palla) dot(ctx, palla, C.ink, 1, 9);
  txt(ctx, 'montagna alta 50 km, in scala', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: P(t, 12.8, 13.3) });
  txt(ctx, 'cannone non in scala', 140, 192, { size: 30, color: C.dim, align: 'left', alpha: P(t, 12.8, 13.3) });
  fermo(ctx, 1085, 150, P(t, 17.6, 18.0), 'senza aria, tempo accelerato');
  ctx.restore();
  riquadro(ctx, t, al);
}

// il riquadro ingrandito dei primi due tiri (17,4–26,2): in orizzontale la strada lungo il suolo (0,44 px per km), in
// verticale la quota (4,4 px per km: esagerata 10 volte); il suolo è disegnato dritto. Stessi punti delle traiettorie vere.
const ZX0 = 270, KX = .44, ZY0 = 540, KY = 4.4;
const inRiquadro = ([x, y]) => [ZX0 + Math.atan2(x, y) * R_KM * KX, ZY0 - (Math.hypot(x, y) * (R_KM + H_KM) - R_KM) * KY];
function riquadro(ctx, t, al) {
  const k = life(t, 17.4, 26.2, .4, .4) * al;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  // la zona ingrandita sul disegno grande, e i fili verso il riquadro
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
  ctx.strokeRect(590, 184, 106, 32);
  ctx.beginPath(); ctx.moveTo(590, 216); ctx.lineTo(140, 250); ctx.moveTo(696, 216); ctx.lineTo(1075, 250); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  card(ctx, 140, 250, 935, 345, k);
  ctx.save(); ctx.globalAlpha *= k;
  ctx.fillStyle = css(mix(C.x, C.g, .35)); ctx.fillRect(152, ZY0, 911, 40);   // il suolo
  ctx.fillStyle = css(mix(C.dim, C.ink, .3));
  ctx.beginPath(); ctx.moveTo(ZX0 - 30, ZY0); ctx.lineTo(ZX0, ZY0 - H_KM * KY); ctx.lineTo(ZX0 + 30, ZY0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.roundRect(ZX0 - 22, ZY0 - H_KM * KY - 5, 24, 10, 3); ctx.fill();
  txt(ctx, 'ingrandito, quota esagerata 10 volte', 160, 282, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'tempo: 2 min al secondo', 1060, 320, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'suolo disegnato dritto', 1060, 358, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, '50 km', ZX0 - 32, ZY0 - H_KM * KY + 22, { size: 30, color: C.dim, align: 'right' });
  for (const T of TIRI.slice(0, 2)) {
    if (t < T.t0) continue;
    const n = passi(T, t);
    ctx.strokeStyle = css(T.col()); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i < n; i++) { const q = inRiquadro(T.pts[i]); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }
    ctx.stroke();
    const fine = inRiquadro(T.pts[n - 1]);
    if (n < T.pts.length) { dot(ctx, fine, C.ink, 1, 10); continue; }
    const xa = ZX0 + T.arrivo * KX;   // dove tocca terra, con la strada fatta
    dot(ctx, [xa, ZY0], T.col(), 1, 12);
    fondo(ctx, xa, ZY0 + 27, 176, 34);
    txt(ctx, '≈ ' + Math.round(T.arrivo / 10) * 10 + ' km', xa, ZY0 + 27, { size: 30, weight: 600, color: T.col() });
  }
  ctx.restore();
}

// 2 · un secondo, ingrandito ed esagerato (40,6–63,4): la tangente, la caduta, la superficie che si abbassa
const ZA = [300, 330], ZL = 560, RZ = 980, ZH = 44;          // punto di partenza della superficie, lunghezza del secondo, raggio esagerato, quota
const ZC = [ZA[0], ZA[1] + RZ];                              // il centro della Terra (molto più in basso)
const suArco = (x, r) => [x, ZC[1] - Math.sqrt(r * r - (x - ZC[0]) ** 2)];
function sceneSecondo(ctx, t) {
  const al = life(t, 40.6, 63.5, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(110, 110, 1000, 680); ctx.clip();
  // la Terra: un arco enorme
  ctx.fillStyle = css(mix(C.x, C.g, .35), .55); ctx.beginPath(); ctx.arc(ZC[0], ZC[1], RZ, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(mix(C.x, C.g, .35)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(ZC[0], ZC[1], RZ, -Math.PI / 2 - .5, -Math.PI / 2 + .75); ctx.stroke();
  const P0 = [ZA[0], ZA[1] - ZH], X1 = ZA[0] + ZL;
  const fine = suArco(X1, RZ + ZH);
  // la palla: in 1 s vero (4 s di video) va dal punto di partenza a quello finale lungo l'arco, a velocità costante
  // (l'angolo cresce uniforme: moto circolare uniforme)
  const TH1 = Math.asin(ZL / (RZ + ZH)), suGiro = (th, r) => [ZC[0] + r * Math.sin(th), ZC[1] - r * Math.cos(th)];
  const k = P(t, 49.8, 53.8, E.lin), pb = suGiro(k * TH1, RZ + ZH);
  // quanto cade sotto la sua tangente (CADE); la superficie si abbassa sotto la sua tangente della stessa quantità: nel
  // disegno, con la quota esagerata, i due raggi sono diversi, quindi la sbarra verde si misura dove la superficie scende di CADE
  const CADE = fine[1] - P0[1], s1 = [ZA[0] + Math.sqrt(RZ * RZ - (RZ - CADE) ** 2), ZA[1] + CADE];
  // la tangente: dove andrebbe senza gravità
  const kT = P(t, 45.2, 45.9);
  if (kT > 0) {
    dashed(ctx, P0, [X1, P0[1]], C.dim, kT, 1);
    dot(ctx, [X1, P0[1]], C.dim, kT, 8);
    drawRich(ctx, '{dim:senza gravità: 7,9 km in 1 s}', (P0[0] + X1) / 2, P0[1] - 34, { size: 32, alpha: kT });
  }
  // la traccia vera
  if (k > 0) {
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([3, 9]); ctx.beginPath();
    for (let i = 0; i <= 60; i++) { const q = suGiro(k * TH1 * i / 60, RZ + ZH); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }
    ctx.stroke(); ctx.restore();
  }
  // la caduta: dalla tangente fino alla palla
  const kC = P(t, 53.6, 54.1);
  if (kC > 0) {
    freccia(ctx, [X1, P0[1] + 10], [X1, fine[1] - 12], C.v, kC, 6);
    drawRich(ctx, '{v:cade 4,9 m}', X1 + 26, P0[1], { size: 32, align: 'left', alpha: kC });
  }
  // la superficie si abbassa della stessa quantità
  const kS = P(t, 54.4, 54.9);
  if (kS > 0) {
    const s0 = ZA, XB = X1 + 44;
    dashed(ctx, s0, [XB, s0[1]], C.g, kS, .8); dashed(ctx, s1, [XB, s1[1]], C.g, kS, .8);
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(XB, s0[1]); ctx.lineTo(XB, s1[1]); ctx.moveTo(XB - 12, s0[1]); ctx.lineTo(XB + 12, s0[1]); ctx.moveTo(XB - 12, s1[1]); ctx.lineTo(XB + 12, s1[1]); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:la Terra:}\n{g:−4,9 m}', XB + 92, (s0[1] + s1[1]) / 2, { size: 32, alpha: kS });
  }
  // la quota, uguale all'inizio e alla fine: sbarrette lungo il raggio
  const kQ = P(t, 59.0, 59.5);
  if (kQ > 0) {
    for (const th of [0, TH1]) { const a = suGiro(th, RZ), b = suGiro(th, RZ + ZH); ctx.save(); ctx.globalAlpha *= kQ; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.restore(); }
    const pq = [(P0[0] + X1) / 2 - 110, suArco((P0[0] + X1) / 2, RZ)[1] + 60];   // su un fondino: sotto c'è la Terra
    fondo(ctx, pq[0], pq[1], 240, 48, kQ); drawRich(ctx, '{g:stessa quota}', pq[0], pq[1], { size: 34, alpha: kQ });
  }
  dot(ctx, k > 0 ? pb : P0, C.ink, 1, 11);
  ctx.restore();
  txt(ctx, 'disegno esagerato', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: al });
  fermo(ctx, 1085, 150, al, t > 49.8 && t < 53.8 ? 'al rallentatore' : '');
}

// 3 · la stazione e l'astronauta (63,5–76,8): la stessa accelerazione, 8,7 m/s² verso il centro della Terra
function sceneStazione(ctx, t) {
  const al = life(t, 63.5, 76.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(110, 110, 1000, 680); ctx.clip();
  terra(ctx, [610, 1900], 1180);
  txt(ctx, 'Terra', 610, 770, { size: 30, color: C.paper });
  // la stazione
  const S = [610, 380];
  ctx.fillStyle = css(mix(C.x, C.paper, .5)); for (const s of [-1, 1]) ctx.fillRect(S[0] + s * 250 - 70, S[1] - 50, 140, 100);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(S[0] - 180, S[1]); ctx.lineTo(S[0] + 180, S[1]); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .75)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(S[0] - 150, S[1] - 90, 300, 180, 30); ctx.fill(); ctx.stroke();
  // l'astronauta che galleggia (ondeggia piano: la cabina e lui cadono insieme)
  const f = Math.sin((t - 63.5) * 1.1) * .25, A = [S[0] - 40, S[1] - 10];
  ctx.save(); ctx.translate(...A); ctx.rotate(f);
  ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-16, -28, 32, 50, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -42, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.strokeStyle = css(mix(C.ink, C.paper, .3));
  ctx.beginPath(); ctx.moveTo(-14, -18); ctx.lineTo(-40, -36); ctx.moveTo(14, -18); ctx.lineTo(40, -30); ctx.moveTo(-8, 22); ctx.lineTo(-18, 50); ctx.moveTo(8, 22); ctx.lineTo(22, 46); ctx.stroke();
  ctx.restore();
  // le due accelerazioni, uguali (8 px per m/s²)
  const kg = P(t, 67.8, 68.3);
  freccia(ctx, [S[0] + 110, S[1] + 92], [S[0] + 110, S[1] + 92 + 8.7 * 8], C.v, kg, 6);
  drawRich(ctx, '{mv:g}', S[0] + 140, S[1] + 92 + 8.7 * 4, { size: 38, alpha: kg });
  freccia(ctx, [A[0] + 80, A[1] - 40], [A[0] + 80, A[1] - 40 + 8.7 * 8], C.v, kg, 6);
  drawRich(ctx, '{mv:g}', A[0] + 110, A[1] - 40 + 8.7 * 4, { size: 38, alpha: kg });
  txt(ctx, 'stazione a 400 km di quota', 610, 200, { size: 32, color: C.dim });
  const kI = life(t, 72.4, 76.8, .4, .4);
  drawRich(ctx, '{g:cadono insieme}', 610, 615, { size: 36, alpha: kI });
  ctx.restore();
  txt(ctx, 'non in scala', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: al });
}

// 4 · GPS e geostazionario, visti dal polo nord, in scala (42 px per raggio terrestre); un giorno = 12 s di video
const CG = [610, 450], RG = 42, R_GPS = 4.17 * RG, R_GEO = 6.62 * RG, T_G = 76.9;
const angGiorno = t => .9 + (t - T_G) / 12 * 2 * Math.PI;
function sceneGeo(ctx, t) {
  const al = life(t, 76.9, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const aT = angGiorno(t), aG = .2 + (t - T_G) / 6 * 2 * Math.PI, pol = (r, a) => [CG[0] + r * Math.cos(a), CG[1] - r * Math.sin(a)];
  const kGeo = P(t, 81.6, 82.1);
  ctx.strokeStyle = css(C.ink, .3); ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
  ctx.beginPath(); ctx.arc(CG[0], CG[1], R_GPS, 0, Math.PI * 2); ctx.stroke();
  ctx.save(); ctx.globalAlpha *= kGeo; ctx.beginPath(); ctx.arc(CG[0], CG[1], R_GEO, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  ctx.setLineDash([]);
  // l'allineamento: centro, punto dell'equatore, satellite
  const kL = P(t, 86.2, 86.7);
  if (kL > 0) dashed(ctx, CG, pol(R_GEO, aT), C.g, 1, kL);
  terra(ctx, CG, RG);
  ctx.save(); ctx.strokeStyle = css(C.paper, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...CG); ctx.lineTo(...pol(RG, aT + Math.PI)); ctx.stroke(); ctx.restore();   // un meridiano: si vede girare
  dot(ctx, pol(RG, aT), C.v, kL, 8);   // un punto dell'equatore: compare quando Stilla lo nomina (e il pannello lo scrive in viola)
  dot(ctx, pol(R_GPS, aG), C.x, 1, 10);
  if (kGeo > 0) {
    dot(ctx, pol(R_GEO, aT), C.g, kGeo, 11);
  }
  ctx.restore();
  txt(ctx, 'in scala, visto dal polo nord', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: al });
  fermo(ctx, 1085, 150, al, 'tempo accelerato');
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  sceneCannone(ctx, t); sceneSecondo(ctx, t); sceneStazione(ctx, t); sceneGeo(ctx, t);
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 7.7 || t > T_FINE + .3) return;
  const al = life(t, 7.9, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · i colpi
  const s1 = life(t, 7.9, 40.6, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'i colpi');
    txt(ctx, 'velocità di partenza, in orizzontale', 1480, 228, { size: 30, color: C.dim, alpha: P(t, 12.8, 13.3) });
    const esiti = ['cade poco lontano', 'cade più lontano', 'fa un bel pezzo di giro', '{g:non tocca più terra}'];
    TIRI.forEach((T, i) => {
      const k = P(t, T.t0 - .2, T.t0 + .2), y = 300 + 80 * i;
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      ctx.strokeStyle = css(T.col()); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1175, y); ctx.lineTo(1198, y); ctx.stroke();
      txt(ctx, T.nome + ' km/s', 1405, y, { size: 36, weight: 600, align: 'right' });
      drawRich(ctx, esiti[i], 1425, y, { size: 30, align: 'left', alpha: P(t, T.t0 + (i === 3 ? 4.6 : T.vola), T.t0 + (i === 3 ? 5.0 : T.vola + .4)) });   // quando tocca terra
      ctx.restore();
    });
    ctx.restore();
  }
  // 2 · un secondo
  const s2 = life(t, 40.7, 63.4, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'in un secondo');
    drawRich(ctx, '{dim:avanza:} 7,9 km', 1480, 250, { size: 36, local: t - 45.3 });
    drawRich(ctx, '{dim:cade:} ½·{mv:g}{mink:·t²} = ½ · 9,8 · 1² = {v:4,9 m}', 1480, 320, { size: 34, local: t - 49.9 });
    riga(372, P(t, 54.4, 54.8));
    drawRich(ctx, '{dim:la Terra si abbassa:} {g:4,9 m}', 1480, 420, { size: 36, local: t - 54.5 });
    drawRich(ctx, '{dim:(7,9 km)² / (2 · 6370 km) ≈ 4,9 m}', 1480, 475, { size: 30, local: t - 55.0 });
    riga(527, P(t, 59.0, 59.4));
    drawRich(ctx, '{g:caduta continua}', 1480, 590, { size: 44, local: t - 59.1 });
    drawRich(ctx, '{dim:sempre alla stessa quota}', 1480, 650, { size: 30, local: t - 59.5 });
    ctx.restore();
  }
  // 3 · in orbita c'è gravità
  const s3 = life(t, 63.5, 76.8, .4, .4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'in orbita');
    drawRich(ctx, '{r:lassù niente gravità?}', 1480, 255, { size: 36 });
    const kx = P(t, 67.8, 68.4);
    if (kx > 0) { ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1310, 257); ctx.lineTo(lerp(1310, 1650, kx), 257); ctx.stroke(); ctx.restore(); }
    drawRich(ctx, '{mv:g} {dim:a 400 km} ≈ 8,7 m/s²', 1480, 345, { size: 40, local: t - 67.9 });
    drawRich(ctx, '{dim:= 9,8 · (6370 / 6770)²}', 1480, 405, { size: 30, local: t - 68.4 });
    drawRich(ctx, '{dim:quasi come qui:} 9,8 m/s²', 1480, 460, { size: 32, local: t - 68.8 });
    riga(515, P(t, 72.4, 72.8));
    drawRich(ctx, '{g:cadono insieme:}', 1480, 575, { size: 36, local: t - 72.5 });
    drawRich(ctx, '{g:per questo galleggiano}', 1480, 625, { size: 36, local: t - 72.9 });
    ctx.restore();
  }
  // 4 · più in alto
  const s4 = P(t, 77.0, 77.4);
  if (s4 > 0) {
    ctx.save(); ctx.globalAlpha *= s4;
    titoletto(ctx, 'più in alto, più lento');
    drawRich(ctx, '{x:GPS}{dim:: quota ≈ 20 000 km}', 1480, 245, { size: 34, local: t - 77.1 });
    drawRich(ctx, '{dim:un giro ≈} 12 h', 1480, 295, { size: 34, local: t - 77.6 });
    drawRich(ctx, '{g:geostazionario}{dim:: quota ≈ 36 000 km}', 1480, 375, { size: 34, local: t - 81.7 });
    drawRich(ctx, '{dim:un giro =} 1 giorno', 1480, 425, { size: 34, local: t - 82.2 });
    riga(475);
    const ore = Math.floor((t - T_G) * 2);
    txt(ctx, 'ore passate', 1400, 535, { size: 30, color: C.dim, align: 'right' });
    txt(ctx, String(ore), 1500, 535, { size: 48, weight: 600, align: 'right' });
    txt(ctx, 'h', 1512, 535, { size: 32, color: C.dim, align: 'left' });
    const kP = P(t, 86.3, 86.7);
    dot(ctx, [1215, 605], C.v, kP, 8);
    drawRich(ctx, '{v:un punto dell’equatore}', 1240, 605, { size: 32, align: 'left', alpha: kP });
    drawRich(ctx, '{dim:il geostazionario gli resta sopra}', 1480, 660, { size: 30, local: t - 86.8 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (95,4–105,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.0, 105.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Un satellite cade sempre verso la Terra,\nma la Terra si incurva sotto di lui.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, 'a circa 7,9 km/s la palla\n{g:non tocca più terra}'], [960, 'un’orbita è una\n{g:caduta continua}'], [1430, '{v:geostazionario}:\n36 000 km, un giorno']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 12.8, .4],                                               // la Terra, la montagna di 50 km
    ['pop', 17.4, .4], ['tono', 17.6, 18.7, [.8, .78, .75, .69, .59, .48, .34, .18, 0]], ['pop', 18.7, .3],     // 5 km/s: cade a 660 km
    ['pop', 21.7, .45], ['tono', 21.9, 23.76, [.8, .78, .75, .69, .59, .48, .34, .18, 0]], ['pop', 23.76, .35], // 7 km/s: 1560 km
    ['pop', 26.1, .5], ['tono', 26.3, 27.62, [.8, .78, .74, .68, .58, .47, .34, .18, 0]], ['pop', 27.62, .4],   // 7,8 km/s: un bel pezzo di giro
    ['pop', 30.5, .6], ['tono', 30.7, 32.2, [.8, .8]],                                // circa 7,9 km/s: resta alla stessa quota
    ['soffio', 40.7], ['traccia', 45.2, 45.9], ['pop', 45.3, .45],                    // un secondo: senza gravità, 7,9 km
    ['traccia', 49.8, 53.8], ['tono', 49.8, 53.8, [.8, .79, .78, .75, .7, .64, .57, .49, .4]], ['pop', 49.9, .4],   // cade di 4,9 m
    ['pop', 53.6, .5], ['pop', 54.5, .5],                                             // la caduta, la Terra si abbassa
    ['pop', 59.0, .55],                                                               // stessa quota: caduta continua
    ['soffio', 63.5], ['traccia', 67.8, 68.4], ['pop', 67.9, .5],                     // in orbita c'è gravità: 8,7 m/s²
    ['pop', 72.4, .55], ['ding', 72.9],                                               // cadono insieme
    ['soffio', 77.0], ['tono', 77.0, 78.0, [.62, .7, .78, .84, .89]], ['pop', 77.6, .4],   // il GPS: 12 h
    ['pop', 81.6, .6],                                                                // il geostazionario: un giorno
    ['traccia', 86.2, 86.7], ['pop', 86.3, .5], ['ding', 87.0],                       // resta sopra lo stesso punto
    ['soffio', 95.6], ['pop', 97.6, .5], ['pop', 98.1, .6], ['pop', 98.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il cannone di Newton', durata: 105.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.5, 'sempre più forte'], [40.5, 76.8, 'una caduta continua'], [76.8, T_FINE, 'il geostazionario']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
