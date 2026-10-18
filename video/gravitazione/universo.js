'use strict';
/* L'universo che si allontana — cenni di cosmologia. La luce delle galassie lontane arriva allungata (spostata verso il
   rosso; qui l'allungamento è esagerato); Hubble (1929): si allontanano, v = H₀·d con H₀ ≈ 70 km/s per megaparsec
   (1 Mpc ≈ 3,26 milioni di anni luce ≈ 3,09·10¹⁹ km): a 100 Mpc 7000 km/s, a 300 Mpc 21 000 km/s.
   Il palloncino: i puntini (le galassie, che non si gonfiano) stanno su una superficie che si dilata in modo uniforme,
   p = centro + ρ(t)·u, con ρ lineare nel tempo (velocità costanti): da ogni puntino le velocità degli altri sono
   proporzionali alla distanza, e nessun puntino è il centro. Il film all'indietro: tutti insieme. A velocità costanti
   t = d/v = 1/H₀ = 3,09·10¹⁹ km / 70 km/s ≈ 4,4·10¹⁷ s ≈ 14 miliardi di anni; le misure più precise danno 13,8.
   Argomento: gravitazione. */
CVIDEO.registra('gravitazione/universo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot, drawSeq } = M;

const T_FINE = 90.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.5, 'sorpreso'], [17.1, 'neutro'],
  [30.9, 'felice'], [35.5, 'pensa'], [40.1, 'felice'], [44.7, 'neutro'], [49.3, 'felice'], [53.9, 'pensa'],
  [57.7, 'sorpreso'], [62.1, 'neutro'], [71.5, 'sorpreso'], [76.1, 'pensa'], [80.7, 'felice'], [85.3, 'festa'],
  [T_FINE, 'neutro'], [92.5, 'felice'], [96.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Le galassie lontane stanno ferme,\no si muovono?'],
  [7.9, 12.4, 'La luce di una galassia lontana\narriva {g:allungata}: più verso il rosso.'],
  [12.5, 17.0, 'Hubble, 1929: si {g:allontanano}, e più\nsono lontane, più vanno veloci.'],
  [17.1, 21.6, '{v:Legge di Hubble}: {mx:v} = {mink:H₀·d},\nvelocità proporzionale alla distanza.'],
  [21.7, 26.2, '{mink:H₀} ≈ 70 km/s per megaparsec:\nè la {v:costante di Hubble}.'],
  [26.3, 30.8, 'Un megaparsec, Mpc, è circa\n3,26 milioni di anni luce.'],
  [30.9, 35.4, 'A 100 Mpc, 7000 km/s;\na 300 Mpc, 21 000 km/s.'],
  [35.5, 40.0, 'Perché? Pensa a un palloncino\ncon tanti puntini: le galassie.'],
  [40.1, 44.6, 'Lo gonfio: ogni puntino si allontana\nda tutti gli altri.'],
  [44.7, 49.2, 'Visti da qui: i vicini si allontanano\npiano, i lontani in fretta.'],
  [49.3, 53.8, 'Distanza doppia, velocità {g:doppia}:\nproprio la legge di Hubble.'],
  [53.9, 57.6, '{r:Allora noi siamo al centro?}'],
  [57.7, 62.0, '{r:No}: da {g:qualunque} puntino\nsi vede la stessa cosa.'],
  [62.1, 66.85, 'Sulla gomma non c’è un centro: è lo\n{v:spazio} stesso che si dilata.'],
  [66.9, 71.4, 'Ora il film all’indietro:\nle galassie si avvicinano…'],
  [71.5, 76.0, '…tutto lo spazio piccolissimo e\ncaldissimo: il {v:Big Bang}.'],
  [76.1, 80.6, 'Quanto tempo fa? A velocità costante\n{mink:t} = {mink:d}/{mx:v} = 1/{mink:H₀}.'],
  [80.7, 85.2, '1/{mink:H₀} ≈ {g:14 miliardi di anni},\nse le velocità fossero sempre queste.'],
  [85.3, 89.8, 'Le misure più precise danno\n{g:13,8 miliardi di anni}.'],
  [92.5, 97.5, 'L’universo si dilata, {mx:v} = {mink:H₀·d}:\nil Big Bang, 13,8 miliardi di anni fa.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 6) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.2, L / 22);
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
// una galassia: un'ellisse sfumata col nucleo chiaro (le galassie non si gonfiano col palloncino)
function galassia(ctx, p, r, col, al = 1, ang = -.4) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.scale(1, .55);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .6))); g.addColorStop(.35, css(col, .9)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
const COL_G = () => mix(C.v, C.dim, .35);

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’universo che si allontana', W / 2, 180, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · la legge di Hubble (7,5–35,6): noi a sinistra, tre galassie a 100, 200 e 300 Mpc (2 px per Mpc), frecce delle
//     velocità a 0,007 px per km/s; sotto, il grafico v–d con la stessa scala delle distanze
const NOI = [220, 260], XG = d => 220 + 2 * d, DS = [100, 200, 300], KV = .007;
const GO = [220, 740], gxd = d => GO[0] + 2 * d, gyv = v => GO[1] - v * 320 / 30000;
function onda(ctx, x0, x1, y, lam, A, fase, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 240; i++) { const x = lerp(x0, x1, i / 240), yy = y - A * Math.sin(2 * Math.PI * ((x - x0) / lam - fase)); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
function sceneHubble(ctx, t) {
  const al = life(t, 7.6, 35.6, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  galassia(ctx, NOI, 44, mix(C.g, C.dim, .2));
  txt(ctx, 'noi', NOI[0], NOI[1] + 46, { size: 30, color: C.dim });
  galassia(ctx, [XG(300), NOI[1]], 40, COL_G());
  // la luce che viaggia verso di noi e si allunga strada facendo (da 40 a 52 px), poi i due tratti a confronto
  const kW = life(t, 8.0, 12.6, .4, .4);
  if (kW > 0) {
    ctx.save(); ctx.globalAlpha *= kW; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath();
    let fi = 0; const xa = 790, xb = 255, n = 300;
    for (let i = 0; i <= n; i++) {
      const x = lerp(xa, xb, i / n), lam = lerp(40, 52, i / n);
      if (i) fi += (xa - xb) / n / lam;
      const y = NOI[1] - 16 * Math.sin(2 * Math.PI * (fi - (t - 8.0) * .8));
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke(); ctx.restore();
  }
  const kS = life(t, 8.4, 17.2, .5, .4);
  if (kS > 0) {
    txt(ctx, 'luce emessa', 140, 470, { size: 30, color: C.dim, align: 'left', alpha: kS });
    onda(ctx, 420, 1060, 470, 60, 30, 0, C.v, kS);
    txt(ctx, 'luce arrivata', 140, 610, { size: 30, color: C.dim, align: 'left', alpha: P(t, 9.4, 9.9) * kS });
    onda(ctx, 420, 1060, 610, 75, 30, 0, C.v, P(t, 9.4, 9.9) * kS);
    txt(ctx, 'allungamento esagerato', 1085, 700, { size: 30, color: C.dim, align: 'right', alpha: P(t, 9.4, 9.9) * kS });
  }
  // le tre galassie e le loro velocità, proporzionali alla distanza
  const kG = P(t, 12.6, 13.1);
  DS.forEach((d, i) => {
    if (i < 2) galassia(ctx, [XG(d), NOI[1]], 40, COL_G(), kG);
    const k = P(t, 13.2 + i * .4, 13.7 + i * .4), x0 = XG(d) + 36;
    freccia(ctx, [x0, NOI[1]], [x0 + KV * 70 * d, NOI[1]], C.x, k, 6);
  });
  drawRich(ctx, '{mx:v}', XG(300) + 36 + KV * 70 * 300 / 2, NOI[1] - 34, { size: 38, alpha: P(t, 14.0, 14.4) });
  // la distanza d
  const kD = P(t, 17.2, 17.7);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    const y = NOI[1] + 90;
    ctx.beginPath(); ctx.moveTo(NOI[0], y); ctx.lineTo(XG(300), y); ctx.moveTo(NOI[0], y - 10); ctx.lineTo(NOI[0], y + 10); ctx.moveTo(XG(300), y - 10); ctx.lineTo(XG(300), y + 10); ctx.stroke();
    fondo(ctx, (NOI[0] + XG(300)) / 2, y, 60, 40);
    drawRich(ctx, '{mink:d}', (NOI[0] + XG(300)) / 2, y, { size: 40 });
    ctx.restore();
  }
  // il grafico v–d
  const kA = P(t, 17.3, 17.9);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let v = 10000; v <= 30000; v += 10000) { ctx.beginPath(); ctx.moveTo(GO[0], gyv(v)); ctx.lineTo(gxd(410), gyv(v)); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(gxd(415), GO[1]); ctx.stroke(); arrowHead(ctx, [gxd(415) + 6, GO[1]], 0, C.ink);
    ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(GO[0], gyv(31500)); ctx.stroke(); arrowHead(ctx, [GO[0], gyv(31500) - 6], -Math.PI / 2, C.ink);
    for (let v = 10000; v <= 30000; v += 10000) txt(ctx, String(v / 1000), GO[0] - 14, gyv(v), { size: 30, color: C.dim, align: 'right' });
    for (let d = 100; d <= 400; d += 100) txt(ctx, String(d), gxd(d), GO[1] + 30, { size: 30, color: C.dim });
    drawRich(ctx, '{mx:v} {dim:(migliaia di km/s)}', GO[0] + 20, gyv(31500), { size: 30, align: 'left' });
    drawRich(ctx, '{mink:d} {dim:(Mpc)}', 1085, GO[1] - 30, { size: 30, align: 'right' });
    ctx.restore();
    glowLinea(ctx, [gxd(0), gyv(0)], [gxd(400), gyv(28000)], P(t, 17.8, 19.2), C.x);
    [[100, 31.0], [300, 32.4]].forEach(([d, ta]) => {
      const k = P(t, ta, ta + .4);
      if (k <= 0) return;
      dashed(ctx, [XG(d), NOI[1] + (d === 300 ? 110 : 40)], [gxd(d), gyv(70 * d) - 14], C.dim, 1, .5 * k);
      dot(ctx, [gxd(d), gyv(70 * d)], C.x, k, 10);
    });
  }
  ctx.restore();
}
function glowLinea(ctx, a, b, k, col) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); ctx.restore();
}

// 2 · il palloncino (35,5–90): p = centro + ρ(t)·u; ρ lineare nel tempo quando cambia (velocità costanti)
const BC = [610, 420];
const rho = t => {
  if (t < 40.2) return 110;
  if (t < 44.4) return lerp(110, 250, (t - 40.2) / 4.2);
  if (t < 67.0) return 250;
  if (t < 74.0) return lerp(250, 30, (t - 67.0) / 7.0);     // il film all'indietro: tutto lo spazio si rimpicciolisce
  if (t < 76.6) return 30;
  if (t < 80.4) return lerp(30, 250, (t - 76.6) / 3.8);     // e di nuovo in avanti, fino a oggi
  return 250;
};
// i puntini: tre allineati (noi, a distanza d, a distanza 2d), un osservatore lontano dal centro, gli altri a caso con
// un seme fisso
const U_NOI = [-.30, .10], U_A = [.05, .10], U_B = [.40, .10], U_ALTRO = [.55, -.42];
const PUNTI = (() => {
  const pts = [U_NOI, U_A, U_B, U_ALTRO];
  let s = 20261014;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let tent = 0; tent < 5000 && pts.length < 24; tent++) {
    const u = [rnd() * 1.8 - .9, rnd() * 1.8 - .9];
    if (Math.hypot(u[0], u[1]) > .84) continue;
    if (Math.abs(u[1] - .10) < .14 && u[0] > -.5 && u[0] < .6) continue;   // la fila dei tre resta libera
    if (pts.some(q => Math.hypot(q[0] - u[0], q[1] - u[1]) < .2)) continue;
    pts.push(u);
  }
  return pts;
})();
const KF = .45;   // freccia della velocità = 0,45 · distanza (in px)
const pos = (u, r) => [BC[0] + r * u[0], BC[1] + r * u[1]];
function scenePalloncino(ctx, t) {
  const al = life(t, 35.5, T_FINE + .1, .6, .5);
  if (al <= 0) return;
  const r = rho(t);
  ctx.save(); ctx.globalAlpha *= al;
  // il palloncino, con un reticolo disegnato sulla gomma che si allarga con lui
  if (r > 4) {
    ctx.save();
    ctx.fillStyle = css(mix(C.paper, C.x, .1)); ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(BC[0], BC[1], r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BC[0], BC[1] + r); ctx.lineTo(BC[0] - 9, BC[1] + r + 16); ctx.lineTo(BC[0] + 9, BC[1] + r + 16); ctx.closePath(); ctx.fillStyle = css(C.x, .7); ctx.fill();
    ctx.beginPath(); ctx.arc(BC[0], BC[1], r - 1.5, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = css(C.x, .18); ctx.lineWidth = 1.5;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(BC[0] + i * .25 * r, BC[1] - r); ctx.lineTo(BC[0] + i * .25 * r, BC[1] + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(BC[0] - r, BC[1] + i * .25 * r); ctx.lineTo(BC[0] + r, BC[1] + i * .25 * r); ctx.stroke();
    }
    ctx.restore();
  }
  // chi guarda: noi, poi un puntino lontano dal centro
  const kO = P(t, 57.8, 58.6), oss = kO < .5 ? U_NOI : U_ALTRO, kOss = kO < .5 ? 1 - 2 * kO : 2 * kO - 1;
  const po = pos(oss, r);
  const kFr = life(t, 44.8, 66.9, .5, .4) * kOss;
  const kH = life(t, 49.4, 53.9, .4, .4);          // si confrontano due puntini: gli altri si attenuano
  const kC = life(t, 54.0, 57.8, .3, .4);          // l'idea sbagliata: noi al centro?
  const gr = Math.min(1, r / 150), ga = clamp((r - 60) / 80);   // da piccolissimo: niente galassie, solo spazio caldo
  PUNTI.forEach((u, i) => {
    const p = pos(u, r), io = u === oss;
    const evid = !io && oss === U_NOI && (u === U_A || u === U_B);
    const a = 1 - (evid || io ? 0 : .7 * Math.max(kH, kC));
    if (!io && kFr > 0) freccia(ctx, p, [p[0] + KF * (p[0] - po[0]), p[1] + KF * (p[1] - po[1])], C.x, kFr * a, 4);
    const noi = u === U_NOI;
    galassia(ctx, p, (noi ? 34 : 30) * gr + 3, noi ? mix(C.g, C.dim, .2) : COL_G(), a * ga, -.4 + i * .7);
  });
  txt(ctx, 'noi', pos(U_NOI, r)[0], pos(U_NOI, r)[1] - 74, { size: 30, color: C.ink, alpha: P(t, 36.0, 36.4) * clamp((r - 60) / 40) * (1 - P(t, 66.9, 67.4)) });
  // l'anello verde: il puntino da cui si guarda
  if (kFr > 0) { const q = pos(oss, r); ctx.save(); ctx.globalAlpha *= kFr; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q[0], q[1], 26, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  // noi a distanza d e 2d: velocità v e 2v
  if (kH > 0) {
    ctx.save(); ctx.globalAlpha *= kH;
    const pn = pos(U_NOI, r), pa = pos(U_A, r), pb = pos(U_B, r);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    [[pa, 42, '{mink:d}'], [pb, 84, '2{mink:d}']].forEach(([q, dy, s]) => {
      ctx.beginPath(); ctx.moveTo(pn[0], pn[1] + dy); ctx.lineTo(q[0], q[1] + dy); ctx.moveTo(pn[0], pn[1] + dy - 8); ctx.lineTo(pn[0], pn[1] + dy + 8); ctx.moveTo(q[0], q[1] + dy - 8); ctx.lineTo(q[0], q[1] + dy + 8); ctx.stroke();
      fondo(ctx, (pn[0] + q[0]) / 2, pn[1] + dy, 64, 36); drawRich(ctx, s, (pn[0] + q[0]) / 2, pn[1] + dy, { size: 34 });
    });
    drawRich(ctx, '{mx:v}', pa[0] + 20 + KF * (pa[0] - pn[0]) / 2, pa[1] - 32, { size: 34 });
    drawRich(ctx, '2{mx:v}', pb[0] + 20 + KF * (pb[0] - pn[0]) / 2, pb[1] - 32, { size: 34 });
    ctx.restore();
  }
  // l'idea sbagliata: noi al centro?
  if (kC > 0) {
    const pn = pos(U_NOI, r);
    ctx.save(); ctx.globalAlpha *= kC; ctx.strokeStyle = css(C.r); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(pn[0], pn[1], 32, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    fondo(ctx, pn[0], pn[1] - 122, 150, 44, kC);
    drawRich(ctx, '{r:centro?}', pn[0], pn[1] - 122, { size: 34, alpha: kC });
  }
  // il Big Bang
  // il Big Bang: tutto il palloncino, piccolissimo, brilla (caldissimo); si raffredda mentre si allarga
  const kB = clamp((110 - r) / 70) * P(t, 66.9, 67.5);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    const g = ctx.createRadialGradient(BC[0], BC[1], 0, BC[0], BC[1], r * 1.5);
    g.addColorStop(0, css(C.y, .95)); g.addColorStop(.6, css(C.y, .75)); g.addColorStop(1, css(C.y, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(BC[0], BC[1], r * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    conFont(TITOLI, () => drawRich(ctx, '{v:Big Bang}', BC[0], BC[1] - r - 70, { size: 46, weight: 600, alpha: life(t, 74.0, 77.0, .4, .5) }));
  }
  // la linea del tempo: da 0 a 14 miliardi di anni, il segnalino segue il film in avanti
  const kT = P(t, 76.2, 76.7);
  if (kT > 0) {
    const xt = gy => 200 + gy * 58.6, Y = 728;
    ctx.save(); ctx.globalAlpha *= kT;
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(xt(0), Y); ctx.lineTo(xt(14.2), Y); ctx.stroke();
    for (let a = 0; a <= 14; a += 1) { ctx.beginPath(); ctx.moveTo(xt(a), Y - (a % 5 ? 6 : 11)); ctx.lineTo(xt(a), Y + (a % 5 ? 6 : 11)); ctx.stroke(); }
    txt(ctx, 'Big Bang', xt(0), Y + 32, { size: 30, color: C.dim });
    txt(ctx, '5', xt(5), Y + 32, { size: 30, color: C.dim }); txt(ctx, '10', xt(10), Y + 32, { size: 30, color: C.dim });
    txt(ctx, 'miliardi di anni', xt(7.5), Y + 32, { size: 30, color: C.dim });
    const age = clamp((t - 76.6) / 3.8) * 13.8;
    dot(ctx, [xt(age), Y], C.g, 1, 11);
    txt(ctx, 'oggi', xt(13.8), Y - 34, { size: 30, color: C.ink, alpha: P(t, 80.4, 80.8) });
    ctx.restore();
  }
  ctx.restore();
  txt(ctx, t > 67.0 && t < 74.0 ? 'film all’indietro' : t > 76.6 && t < 80.4 ? 'film in avanti' : '', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: al });
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  sceneHubble(ctx, t); scenePalloncino(ctx, t);
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 16.9 || t > T_FINE + .3) return;
  const al = life(t, 17.1, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · la legge
  const s1 = life(t, 17.1, 35.6, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'legge di Hubble');
    drawRich(ctx, '{mx:v} = {mink:H₀·d}', 1480, 255, { size: 62, local: t - 17.2 });
    drawRich(ctx, '{mx:v}{dim:: velocità di allontanamento}', 1480, 330, { size: 30, local: t - 17.6 });
    drawRich(ctx, '{mink:d}{dim:: distanza}', 1480, 372, { size: 30, local: t - 18.0 });
    riga(410, P(t, 21.7, 22.1));
    drawRich(ctx, '{mink:H₀} ≈ 70 km/s {dim:per} Mpc', 1480, 460, { size: 38, local: t - 21.8 });
    drawRich(ctx, '1 Mpc ≈ 3,26 {dim:milioni di anni luce}', 1480, 520, { size: 32, local: t - 26.4 });
    riga(565, P(t, 30.9, 31.3));
    drawRich(ctx, '100 Mpc {dim:→} {mx:v} ≈ 7000 km/s', 1480, 620, { size: 34, local: t - 31.0 });
    drawRich(ctx, '300 Mpc {dim:→} {mx:v} ≈ 21 000 km/s', 1480, 678, { size: 34, local: t - 32.4 });
    drawRich(ctx, '{dim:(70 · 300 = 21 000)}', 1480, 730, { size: 30, local: t - 33.0 });
    ctx.restore();
  }
  // 2 · il palloncino: le velocità misurate dal puntino che guarda, contro le distanze
  const s2 = life(t, 35.6, 76.1, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'nel palloncino');
    drawRich(ctx, '{dim:i puntini:} galassie', 1480, 235, { size: 34, local: t - 35.8 });
    drawRich(ctx, '{dim:la gomma:} lo spazio', 1480, 285, { size: 34, alpha: P(t, 62.4, 62.8) });
    const kP = P(t, 49.4, 49.9);
    if (kP > 0) {
      ctx.save(); ctx.globalAlpha *= kP;
      const O = [1230, 720], sx = 1.2, sy = sx * KF * 2.2;   // distanza in px del palloncino → px del grafico
      ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(1770, O[1]); ctx.stroke(); arrowHead(ctx, [1776, O[1]], 0, C.ink);
      ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(O[0], 345); ctx.stroke(); arrowHead(ctx, [O[0], 339], -Math.PI / 2, C.ink);
      txt(ctx, 'distanza', 1760, O[1] + 32, { size: 30, color: C.dim, align: 'right' });
      txt(ctx, 'velocità', O[0] + 16, 352, { size: 30, color: C.dim, align: 'left' });
      const kO = P(t, 57.8, 58.6), oss = kO < .5 ? U_NOI : U_ALTRO, kOss = kO < .5 ? 1 - 2 * kO : 2 * kO - 1;
      const r = rho(t), po = pos(oss, r);
      PUNTI.forEach(u => {
        if (u === oss) return;
        const p = pos(u, r), D = Math.hypot(p[0] - po[0], p[1] - po[1]);
        dot(ctx, [O[0] + D * sx, O[1] - D * sy * .5], C.x, kOss, 7);
      });
      ctx.restore();
    }
    ctx.restore();
  }
  // 3 · l'età
  const s3 = P(t, 76.1, 76.5);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'quanto tempo fa?');
    drawRich(ctx, '{mink:t} = {mink:d}/{mx:v} = {mink:d}/({mink:H₀·d}) = 1/{mink:H₀}', 1480, 260, { size: 40, local: t - 76.2 });
    drawRich(ctx, '1 Mpc ≈ 3,09·10{mink:¹⁹} km', 1480, 340, { size: 32, local: t - 77.4 });
    drawRich(ctx, '1/{mink:H₀} = 3,09·10{mink:¹⁹} km / (70 km/s)', 1480, 400, { size: 32, local: t - 80.8 });
    drawRich(ctx, '≈ 4,4·10{mink:¹⁷} s', 1480, 460, { size: 36, local: t - 81.4 });
    drawRich(ctx, '{g:≈ 14 miliardi di anni}', 1480, 530, { size: 44, local: t - 82.0 });
    riga(590, P(t, 85.4, 85.8));
    drawRich(ctx, '{dim:misure più precise:}', 1480, 640, { size: 32, local: t - 85.4 });
    drawRich(ctx, '{g:13,8 miliardi di anni}', 1480, 700, { size: 44, local: t - 85.8 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (90,1–100,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 99.0, 100.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Le galassie si allontanano: lo spazio\nsi dilata da 13,8 miliardi di anni.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{mx:v} = {mink:H₀·d}\n{dim:legge di Hubble}'], [960, '{mink:H₀} ≈ 70 km/s\n{dim:per megaparsec}'], [1430, 'nessun centro:\n{dim:si dilata ovunque}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): nel grafico il tono segue la velocità; nel palloncino segue il raggio
  // rho(t), da 30 px (0) a 250 px (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .6], ['pop', 9.4, .35],                             // la luce emessa e quella arrivata, più lunga
    ['pop', 12.6, .5], ['pop', 13.45, .4], ['pop', 13.85, .55], ['pop', 14.25, .7],   // le galassie, le frecce sempre più lunghe
    ['soffio', 17.1], ['pop', 17.2, .45],                                             // il pannello, la distanza d
    ['traccia', 17.8, 19.2], ['tono', 17.8, 19.2, [0, .06, .5, .94, 1]],              // la retta v = H₀·d
    ['pop', 21.8, .5], ['pop', 26.4, .45],                                            // H₀ ≈ 70 km/s per Mpc, il megaparsec
    ['pop', 31.0, .25], ['pop', 32.4, .7],                                            // 100 Mpc e 300 Mpc sul grafico
    ['soffio', 35.5],                                                                 // il palloncino
    ['tono', 40.2, 44.4, [.36, 1]], ['pop', 44.8, .5],                                // si gonfia; le velocità viste da noi
    ['pop', 49.4, .4], ['ding', 50.0],                                                // d e 2d: v e 2v
    ['pop', 54.0, .3], ['pop', 58.2, .6], ['pop', 62.4, .5],                          // centro? un altro puntino; la gomma è lo spazio
    ['tono', 67.0, 74.0, [1, 0]], ['pop', 74.0, .9],                                  // il film all'indietro: il Big Bang
    ['soffio', 76.1], ['pop', 76.2, .5],                                              // quanto tempo fa? t = 1/H₀
    ['tono', 76.6, 80.4, [0, 1]],                                                     // il film in avanti, fino a oggi
    ['pop', 80.8, .45], ['pop', 81.4, .5], ['ding', 82.0],                            // 4,4·10¹⁷ s ≈ 14 miliardi di anni
    ['soffio', 90.3], ['pop', 92.3, .5], ['pop', 92.8, .6], ['pop', 93.3, .7],        // in una frase
  ];
  return {
    titolo: 'L’universo che si allontana', durata: 100.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.4, 'la legge di Hubble'], [35.4, 66.8, 'il palloncino'], [66.8, T_FINE, 'il Big Bang']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
