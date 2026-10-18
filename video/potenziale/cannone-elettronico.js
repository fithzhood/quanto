'use strict';
/* Il cannone elettronico — un elettrone (carica −e, e = 1,60·10⁻¹⁹ C, m = 9,11·10⁻³¹ kg) accelerato da fermo fra due
   piatti a 1000 V su 2 cm (E = 5·10⁴ V/m, 20 px/mm): F = e·E ≈ 8,0·10⁻¹⁵ N costante, a = e·E/m ≈ 8,8·10¹⁵ m/s², x = ½·a·t²;
   attraversa in 2,13·10⁻⁹ s (al rallentatore di 10⁹: 2,13 s) ed esce a v = √(2·e·ΔV/m) ≈ 1,87·10⁷ m/s (6% di c):
   m·v²/2 = e·ΔV, 1000 eV. Il moto di traverso fra due piatti sta in potenziale/deflessione. Colori: elettrone C.x,
   cariche positive C.v, forze C.y, velocità C.x, accelerazione C.v, campo C.ink. Argomento: potenziale. */
CVIDEO.registra('potenziale/cannone-elettronico', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 52.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [25.5, 'pensa'], [30.5, 'neutro'],
  [32.6, 'sorpreso'], [35.6, 'neutro'], [40.4, 'sorpreso'], [46.5, 'felice'],
  [54.2, 'festa'], [58.0, 'occhiolino'],
];
const FUMETTI = [
  [2.4, 6.7, 'Come si lancia un elettrone a quasi\nventimila chilometri al secondo?'],
  [7.9, 14.1, 'Il cannone: due piatti con una differenza\ndi potenziale Δ{mink:V} = 1000 V, a 2 cm.'],
  [14.2, 19.6, 'Il campo elettrico {mink:E} è uniforme:\n1000 V / 0,02 m = 5·10{mink:⁴} V/m.'],
  [19.7, 25.4, 'L’elettrone ha carica −{mink:e}: la forza è\nopposta al campo, di modulo {my:F} = {mink:e·E}.'],
  [25.5, 30.4, 'Forza costante, accelerazione costante:\n{mv:a} = {mink:e·E}/{mink:m}, con {mink:m} la sua massa.'],
  [30.5, 35.5, 'Parte da fermo. Al rallentatore,\nun miliardo di volte: accelera.'],
  [35.6, 40.3, 'Il lavoro del campo diventa energia\ncinetica: {mink:m}·{mx:v²}/2 = {mink:e}·Δ{mink:V} ({mx:v}: velocità).'],
  [40.4, 46.4, 'Con 1000 V esce a {mx:v} ≈ 1,87·10{mink:⁷} m/s:\ncirca il 6% della velocità della luce.'],
  [46.5, 51.5, 'L’energia di un elettrone accelerato\nda 1 V è l’{g:elettronvolt}: 1,60·10{mink:⁻¹⁹} J.'],
  [54.2, 60.4, 'Ogni volt di dislivello dà all’elettrone\nun elettronvolt di energia cinetica.'],
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
function etichetta(ctx, s, x, y, al, w = 96, size = 32) { if (al <= 0) return; fondo(ctx, x, y, w, size + 14, al); drawRich(ctx, s, x, y, { size, alpha: al }); }
function segno(ctx, p, s, al, r = 8) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(s > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); if (s > 0) { ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); } ctx.stroke(); ctx.restore();
}
function piatto(ctx, a, b, s, al, w = 12) {   // un piatto carico, visto di taglio
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(s > 0 ? C.v : C.x, C.paper, .25)); ctx.lineWidth = w; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function linea(ctx, pts, col, w, al, tratt = null) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (tratt) ctx.setLineDash(tratt);
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function lineaCampo(ctx, a, b, al) {   // dritta, con la punta a metà
  if (al <= 0) return;
  linea(ctx, [a, b], mix(C.ink, C.paper, .4), 3, al);
  ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], Math.atan2(b[1] - a[1], b[0] - a[0]), mix(C.ink, C.paper, .15), .95); ctx.restore();
}

const CARTA = [110, 110, 1000, 680];
const RE = 14;   // raggio dell'elettrone disegnato

// ---------- 1 · il cannone: 2 cm = 400 px; al rallentatore di 10⁹ attraversa in 2,13 s ----------
const XK = 250, XA = 650, YK0 = 280, YK1 = 620, YE = 450;   // catodo (−) e anodo (+, col foro), quota del fascio
const TG = 2.133, AG = 2 * 400 / TG ** 2, VG = AG * TG;      // px/s² e px/s (≈ 375 px/s all'uscita)
const T_G0 = 32.0;
function xCannone(t) {
  const tau = t - T_G0, x0 = XK + 6 + RE;
  if (tau <= 0) return x0;
  if (tau <= TG) return x0 + .5 * AG * tau * tau;
  return x0 + 400 + VG * (tau - TG);
}
const vCannone = t => { const tau = clamp(t - T_G0, 0, 99); return tau <= TG ? AG * tau : VG; };


// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il cannone elettronico', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}
const rallenta = (ctx, t, a, b) => { const k = life(t, a, b, .3, .4); if (k > 0) txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: k }); };

// il cannone (7,5–52)
function sceneCannone(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // il campo: dall'anodo (+) al catodo (−), verso sinistra
  const kE = P(t, 14.3, 15.3);
  [330, 390, 510, 570].forEach(y => lineaCampo(ctx, [XA - 26, y], [XK + 26, y], kE));
  etichetta(ctx, '{mink:E}', 450, 360, kE, 44, 36);
  const kp = P(t, 8.0, 8.6);
  piatto(ctx, [XK, YK0], [XK, YK1], -1, kp);
  piatto(ctx, [XA, YK0], [XA, YE - 24], 1, kp); piatto(ctx, [XA, YE + 24], [XA, YK1], 1, kp);
  [305, 350, 395, 505, 550, 595].forEach(y => { segno(ctx, [XK + 20, y], -1, P(t, 8.5, 9.0)); segno(ctx, [XA - 20, y], 1, P(t, 8.5, 9.0)); });
  // 2 cm e 1000 V
  const kq = P(t, 8.8, 9.3);
  if (kq > 0) {
    linea(ctx, [[XK, 238], [XA, 238]], C.dim, 3, kq); linea(ctx, [[XK, 226], [XK, 250]], C.dim, 3, kq); linea(ctx, [[XA, 226], [XA, 250]], C.dim, 3, kq);
    etichetta(ctx, '2 cm', (XK + XA) / 2, 206, kq, 90, 30);
    etichetta(ctx, 'Δ{mink:V} = 1000 V', (XK + XA) / 2, 680, kq, 230, 34);
  }
  // l'elettrone: la scia, le frecce, la pallina
  const ke = P(t, 19.8, 20.3, E.back);
  if (ke > 0) {
    const x = xCannone(t), v = vCannone(t), dentro = t < T_G0 + TG;
    const x0 = XK + 6 + RE;
    if (x > x0 + 2) linea(ctx, [[x0, YE], [Math.min(x, 1100), YE]], C.x, 3, .45, [6, 8]);
    // F e a si spengono quando arrivano all'anodo: oltre, il campo non c'è
    const primaAnodo = tip => clamp((XA - 14 - tip) / 40);
    const kF = P(t, 20.0, 20.5) * (dentro ? 1 : 0) * primaAnodo(x + RE + 137);
    freccia(ctx, [x + RE + 2, YE], [x + RE + 127, YE], C.y, kF, 6);   // F = 8,0·10⁻¹⁵ N ↔ 125 px
    etichetta(ctx, '{my:F}', x + RE + 150, YE, kF, 40, 32);
    const ka = P(t, 25.7, 26.2) * (dentro ? 1 : 0) * primaAnodo(x + 52 + 40);
    freccia(ctx, [x, YE + 36], [x + 52, YE + 36], C.v, ka, 5);
    etichetta(ctx, '{mv:a}', x + 76, YE + 36, ka, 36, 30);
    // v: sopra l'asse finché non tocca l'anodo, poi sull'asse davanti all'elettrone (passa dal foro), anche dopo l'uscita
    const kv0 = t > T_G0 ? 1 : 0, kAsse = 1 - primaAnodo(x + .22 * v + 44), kv = kv0 * (1 - kAsse);
    freccia(ctx, [x, YE - 36], [x + .22 * v, YE - 36], C.x, kv, 5);
    if (v > 60) etichetta(ctx, '{mx:v}', x + .22 * v + 24, YE - 36, kv, 34, 30);
    const kva = kv0 * kAsse * (1 - P(t, 40.3, 40.6));   // a 40,5 entra la freccia d'uscita
    freccia(ctx, [x + RE + 2, YE], [x + RE + 2 + .22 * v, YE], C.x, kva, 5);
    etichetta(ctx, '{mx:v}', x + RE + 2 + .22 * v / 2, YE - 30, kva, 34, 30);
    if (x < 1130) carica(ctx, [x, YE], -1, RE, 1, ke);
  }
  rallenta(ctx, t, T_G0 - .3, T_G0 + 3.4);
  // la velocità d'uscita, sulla scia
  const ku = life(t, 40.5, T_FINE + .1, .4, .4);
  freccia(ctx, [790, YE - 36], [790 + .22 * VG, YE - 36], C.x, ku, 5);
  etichetta(ctx, '{mx:v} ≈ 1,87·10{mink:⁷} m/s', 880, YE - 92, ku, 270, 32);
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il cannone', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:E} = 1000 V / 0,02 m = 5·10{mink:⁴} V/m', cx, 225, { size: 30, local: t - 14.3 });
    drawRich(ctx, '{dim:carica:} −{mink:e}{dim:,} {mink:e} ≈ 1,60·10{mink:⁻¹⁹} C', cx, 270, { size: 30, local: t - 19.8 });
    drawRich(ctx, '{dim:massa:} {mink:m} ≈ 9,11·10{mink:⁻³¹} kg', cx, 313, { size: 30, local: t - 25.6 });
    drawRich(ctx, '{my:F} = {mink:e·E} ≈ 8,0·10{mink:⁻¹⁵} N', cx, 362, { size: 34, local: t - 19.9 });
    drawRich(ctx, '{mv:a} = {mink:e·E}/{mink:m} ≈ 8,8·10{mink:¹⁵} m/s²', cx, 412, { size: 30, local: t - 25.8 });
    separa(ctx, 452, P(t, 35.6, 36.0));
    drawRich(ctx, '{mink:m}·{mx:v²}/2 = {mink:e}·Δ{mink:V}', cx, 500, { size: 40, local: t - 35.7 });
    drawRich(ctx, '{mx:v} ≈ 1,87·10{mink:⁷} m/s', cx, 558, { size: 34, local: t - 40.5 });
    drawRich(ctx, '{g:1 eV} ≈ 1,60·10{mink:⁻¹⁹} J', cx, 618, { size: 34, local: t - 46.6 });
    drawRich(ctx, '{dim:qui:} 1000 eV ≈ 1,60·10{mink:⁻¹⁶} J', cx, 668, { size: 30, local: t - 47.2 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 61.7, 62.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il campo spinge l’elettrone: ogni volt\ngli dà un elettronvolt di energia.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mv:a} = {mink:e·E}/{mink:m}\n{dim:costante}'], [960, '{mink:m}·{mx:v²}/2 = {mink:e}·Δ{mink:V}\n{dim:l’energia presa nel campo}'], [1470, '1 eV ≈ 1,60·10{mink:⁻¹⁹} J\n{dim:l’elettronvolt}']];
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
    ['soffio', 7.6], ['pop', 8.3, .45], ['pop', 8.75, .35],                           // i due piatti, le cariche
    ['traccia', 8.8, 9.3],                                                            // 2 cm e 1000 V
    ['traccia', 14.3, 15.3], ['pop', 14.6, .45],                                      // le linee del campo, E
    ['pop', 20.0, .55], ['pop', 20.4, .45],                                           // l'elettrone, la forza
    ['pop', 25.9, .45],                                                               // l'accelerazione
    ['tono', 32.0, 34.13, [0, .25, .5, .75, 1]], ['pop', 34.13, .4],                  // accelera: la velocità cresce
    ['tono', 34.13, 35.36, [1, 1]],                                                   // esce dal foro a velocità costante
    ['pop', 35.9, .5],                                                                // m v quadro / 2 = e dV
    ['traccia', 40.5, 40.9], ['ding', 41.0],                                          // esce a 1,87 per dieci alla 7 m/s
    ['pop', 46.8, .55], ['pop', 47.4, .45],                                           // l'elettronvolt, 1000 eV
    ['soffio', 52.1], ['pop', 54.2, .5], ['pop', 54.7, .6], ['pop', 55.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il cannone elettronico', durata: 63.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.5, 'la forza del campo'], [35.5, T_FINE, 'l’energia']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCannone(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
