'use strict';
/* Il dislivello elettrico — il potenziale in un campo uniforme fra due piastre (E = 100 N/C, piastre a 10 cm, 52 px/cm).
   Portare una carica q da A (h = 2 cm) a B (h = 8 cm), piano piano, costa q·E·d (d = 6 cm): resta come energia potenziale
   U = q·E·h (zero sulla piastra negativa; analogia dichiarata con m·g·h). U/q = E·h non dipende da q: è il potenziale V,
   in J/C = volt; lo zero si sceglie (spostato sulla piastra +: valori da −10 a 0 V), ΔV fra A e B resta 6 V = lavoro per
   portare 1 C positivo da A a B. Lasciata libera, la positiva cade con accelerazione costante (y = ½·a·τ², al rallentatore)
   verso V più basso: ΔV = −L/q; la negativa sale verso V più alto. ΔV = E·d, quindi N/C = V/m. Colori fissi
   dell'elettrostatica: positive C.v, negative C.x, forze C.y, campo C.ink. Argomento: potenziale. */
CVIDEO.registra('potenziale/potenziale', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 96.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [24.7, 'pensa'], [31.4, 'felice'],
  [35.7, 'neutro'], [46.4, 'sorpreso'], [51.5, 'felice'], [57.6, 'occhiolino'], [62.2, 'neutro'], [67.3, 'felice'],
  [73.6, 'neutro'], [75.6, 'sorpreso'], [79.3, 'neutro'], [86.0, 'sorpreso'], [90.0, 'felice'], [93.0, 'neutro'],
  [98.2, 'felice'], [102.0, 'occhiolino'],
];
const FUMETTI = [
  [2.4, 6.7, 'Un sasso cade verso il basso.\nE una carica, dove «cade»?'],
  [7.9, 13.7, 'Due piastre cariche, {v:+} sopra e {x:−} sotto:\nfra loro il campo è {g:uniforme}.'],
  [13.8, 19.0, '{mink:E} è il campo elettrico, la forza\nsu ogni coulomb: qui 100 N/C.'],
  [19.1, 24.6, 'Una carica {mink:q} positiva sente la forza\n{my:F} = {mink:q·E}, uguale in ogni punto.'],
  [24.7, 31.3, 'La porto da {mink:A} a {mink:B}, su di {mink:d} = 6 cm,\npiano piano: lavoro = {mink:q·E·d}.'],
  [31.4, 35.6, 'Quel lavoro diventa {g:energia potenziale}\n{mink:U} della carica nel campo.'],
  [35.7, 41.7, 'A quota {mink:h} sopra la piastra {x:−}: {mink:U} = {mink:q·E·h}.\nÈ un’{g:analogia}: per un sasso, {mink:m·g·h}.'],
  [41.8, 46.3, 'Con carica doppia, 2{mink:q}, nello stesso\npunto anche {mink:U} {g:raddoppia}…'],
  [46.4, 51.4, '…ma {mink:U}/{mink:q} non cambia: dipende solo\ndal punto. È il {g:potenziale} {mink:V}.'],
  [51.5, 57.5, '{mink:V} = {mink:U}/{mink:q} si misura in joule al coulomb:\nil {g:volt} (V). Qui {mink:V} = {mink:E·h}.'],
  [57.6, 62.1, 'Lo zero l’ho scelto io: lo sposto\nsulla piastra {v:+}.'],
  [62.2, 67.2, 'Cambiano tutti i valori, ma non la\n{g:differenza} Δ{mink:V} fra due punti.'],
  [67.3, 73.5, 'Δ{mink:V} è il lavoro per portare 1 C\npositivo da {mink:A} a {mink:B}: 6 J, quindi 6 V.'],
  [73.6, 79.2, 'Ora la lascio libera: la carica positiva\n«scende» verso il potenziale {g:più basso}.'],
  [79.3, 84.5, 'Il campo fa un lavoro {mink:L} positivo:\nΔ{mink:V} = −{mink:L}/{mink:q}, il potenziale {g:scende}.'],
  [84.6, 89.9, 'Una carica {x:negativa} fa il contrario:\n«sale» verso il potenziale {g:più alto}.'],
  [90.0, 95.5, 'Nel campo uniforme Δ{mink:V} = {mink:E·d}: per\nquesto {mink:E} si misura anche in {g:V/m}.'],
  [98.2, 104.5, 'Il potenziale è energia per coulomb:\nconta solo il dislivello Δ{mink:V}.'],
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
// una quota: segmento verticale con due stanghette e il nome a lato
function quota(ctx, x, y0, y1, nome, al, lato = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - 10, y0); ctx.lineTo(x + 10, y0); ctx.moveTo(x - 10, y1); ctx.lineTo(x + 10, y1); ctx.stroke();
  ctx.restore();
  const ym = (y0 + y1) / 2;
  fondo(ctx, x + lato * 30, ym, 44, 48, al); drawRich(ctx, nome, x + lato * 30, ym, { size: 40, alpha: al });
}

// ---------- le piastre: 10 cm = 520 px, campo E = 100 N/C verso il basso ----------
const CARTA = [110, 110, 1000, 680];
const Y_SU = 190, Y_GIU = 710, PX_CM = 52, X0 = 330, X1 = 1050, SPESS = 14;
const yDi = h => Y_GIU - PX_CM * h;            // quota h (cm) → pixel
const COL = 690;                               // la colonna dove si muovono le cariche
const LINEE_X = [390, 510, 630, 750, 870, 990];
const Y_A = yDi(2), Y_B = yDi(8), RQ = 24;
const LF = 62;                                 // la forza su q è lunga 62 px (su 2q, 124)
// lasciata libera: y = y0 ± ½·a·τ², fino a toccare la piastra (385 px in 2,0 s)
const CORSA = (Y_GIU - SPESS / 2 - RQ) - Y_B, T_CADUTA = 2.0, ACC = 2 * CORSA / T_CADUTA ** 2;
const T_VIA_POS = 75.6, T_VIA_NEG = 86.0;
function piastra(ctx, y, segno, al) {
  if (al <= 0) return;
  const col = segno > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(col, C.paper, .55)); ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(X0, y - SPESS / 2, X1 - X0, SPESS, 5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineCap = 'round';
  const yy = y + (segno > 0 ? -30 : 30);
  for (let x = X0 + 40; x < X1; x += 80) { ctx.beginPath(); ctx.moveTo(x - 9, yy); ctx.lineTo(x + 9, yy); if (segno > 0) { ctx.moveTo(x, yy - 9); ctx.lineTo(x, yy + 9); } ctx.stroke(); }
  ctx.restore();
}
function lineaCampo(ctx, x, k, al) {
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(C.ink, C.paper, .4)); ctx.lineWidth = 3; ctx.lineCap = 'round';
  const y0 = Y_SU + SPESS / 2 + 4, y1 = lerp(y0, Y_GIU - SPESS / 2 - 4, k);
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  if (k > .55) arrowHead(ctx, [x, (Y_SU + Y_GIU) / 2 + 12], Math.PI / 2, mix(C.ink, C.paper, .15), .95);
  ctx.restore();
}
// la carica di prova: ferma in A, portata piano in B (velocità costante), poi raddoppiata
function yProva(t) { return lerp(Y_A, Y_B, clamp((t - 26.0) / 3.0)); }
const nProva = t => 1 + P(t, 42.0, 42.6);
const yCade = t => Y_B + .5 * ACC * clamp(t - T_VIA_POS, 0, T_CADUTA) ** 2;    // la positiva lasciata libera
const ySale = t => Y_A - .5 * ACC * clamp(t - T_VIA_NEG, 0, T_CADUTA) ** 2;    // la negativa lasciata libera
// valori della scala: V = E·h con lo zero in basso, poi con lo zero sulla piastra +
const kZero = t => P(t, 58.8, 59.4);          // i valori nuovi entrano solo dopo che i vecchi sono usciti
const vecchi = t => 1 - P(t, 58.2, 58.8);
const volt = v => (v < 0 ? '−' : '') + Math.abs(v) + ' V';

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il dislivello elettrico', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

function sceneCampo(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // le linee di campo, dritte e equidistanti
  LINEE_X.forEach((x, i) => lineaCampo(ctx, x, P(t, 9.0 + i * .12, 10.2 + i * .12), 1));
  piastra(ctx, Y_SU, 1, P(t, 8.0, 8.6));
  piastra(ctx, Y_GIU, -1, P(t, 8.3, 8.9));
  // il campo in tanti punti: frecce tutte uguali
  const kE = life(t, 14.0, 19.4, .5, .4);
  if (kE > 0) {
    [450, 570, 810, 930].forEach((x, i) => [300, 450, 600].forEach((y, j) => freccia(ctx, [x, y - 35], [x, y + 35], C.ink, kE * P(t, 14.0 + (i + j) * .08, 14.4 + (i + j) * .08), 5)));
    fondo(ctx, 968, 300, 40, 46, kE); drawRich(ctx, '{mink:E}', 968, 300, { size: 40, alpha: kE });
  }
  // la scala del potenziale
  const kS = P(t, 51.8, 52.6);
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(250, Y_SU); ctx.lineTo(250, Y_GIU); ctx.stroke();
    for (let h = 0; h <= 10; h += 2) { ctx.beginPath(); ctx.moveTo(240, yDi(h)); ctx.lineTo(260, yDi(h)); ctx.stroke(); }
    ctx.restore();
    drawRich(ctx, '{mink:V}', 250, 150, { size: 40, alpha: kS });
    const kz = kZero(t);
    for (let h = 0; h <= 10; h += 2) {
      txt(ctx, volt(h), 228, yDi(h), { size: 30, color: C.dim, align: 'right', alpha: kS * vecchi(t) });
      txt(ctx, volt(h - 10), 228, yDi(h), { size: 30, color: C.dim, align: 'right', alpha: kS * kz });
    }
  }
  // A e B
  const kAB = life(t, 24.9, T_FINE + .1, .4, .5);
  if (kAB > 0) for (const [y, n] of [[Y_A, 'A'], [Y_B, 'B']]) {
    ctx.save(); ctx.globalAlpha *= kAB; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([5, 6]);
    ctx.beginPath(); ctx.arc(COL, y, RQ + 4, 0, TAU); ctx.stroke(); ctx.restore();
    fondo(ctx, COL + 85, y, 42, 46, kAB); drawRich(ctx, '{mink:' + n + '}', COL + 85, y, { size: 40, alpha: kAB });   // lontano dall'etichetta di F
  }
  quota(ctx, 810, Y_GIU - SPESS / 2, Y_B, '{mink:h}', life(t, 35.9, 41.8, .4, .4), 1);
  quota(ctx, 570, Y_A, Y_B, '{mink:d}', Math.max(life(t, 29.0, 35.6, .4, .4), life(t, 90.2, T_FINE + .1, .4, .4)), 1);
  // la carica di prova q (poi 2q)
  const kq = P(t, 19.3, 19.8, E.back) * (1 - P(t, 51.4, 51.9));
  if (kq > 0) {
    const y = yProva(t), n = nProva(t), r = RQ * Math.sqrt(n);
    // un alone verde quando si parla di energia potenziale
    const kU = life(t, 31.6, 35.6, .4, .4);
    if (kU > 0) { ctx.save(); ctx.globalAlpha *= kU * (.7 + .3 * Math.sin(t * 6)); const g = ctx.createRadialGradient(COL, y, r, COL, y, r + 34); g.addColorStop(0, css(C.g, .6)); g.addColorStop(1, css(C.g, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(COL, y, r + 34, 0, TAU); ctx.fill(); ctx.restore(); }
    const kF = P(t, 19.9, 20.4) * (1 - P(t, 51.4, 51.9));
    freccia(ctx, [COL, y + r + 3], [COL, y + r + 3 + LF * n], C.y, kF, 6);
    if (kF > 0) { fondo(ctx, COL + 38, y + r + 3 + LF * n / 2, 42, 46, kF); drawRich(ctx, '{my:F}', COL + 38, y + r + 3 + LF * n / 2, { size: 38, alpha: kF }); }
    // la mia spinta, uguale e contraria, mentre la porto su
    const kS2 = life(t, 25.4, 29.6, .3, .4);
    if (kS2 > 0) {
      freccia(ctx, [COL, y - r - 3], [COL, y - r - 3 - LF], C.y, kS2, 6);
      fondo(ctx, COL - 72, y - r - 3 - LF / 2, 112, 42, kS2); txt(ctx, 'spinta', COL - 72, y - r - 3 - LF / 2, { size: 30, color: C.dim, alpha: kS2 });
    }
    carica(ctx, [COL, y], 1, r, 1, kq);
    // il nome si toglie mentre c'è la spinta, che sta dalla stessa parte
    const kl = P(t, 19.5, 20.0) * (1 - life(t, 25.3, 29.8, .3, .3)), lx = COL - 44 - r, ly = y - r - 6;
    fondo(ctx, lx, ly, 58, 44, kl);
    drawRich(ctx, '{mink:q}', lx, ly, { size: 38, alpha: kl * (1 - P(t, 42.0, 42.4)) });
    drawRich(ctx, '{mink:2q}', lx, ly, { size: 38, alpha: kl * P(t, 42.0, 42.4) });
  }
  // lasciate libere
  const kp = P(t, 73.8, 74.3, E.back) * (1 - P(t, 84.4, 84.8));
  if (kp > 0) {
    const y = yCade(t), kF = P(t, 74.3, 74.8);
    freccia(ctx, [COL, y + RQ + 3], [COL, y + RQ + 3 + LF], C.y, kp * kF * (1 - P(t, T_VIA_POS + T_CADUTA - .05, T_VIA_POS + T_CADUTA + .3)), 6);
    carica(ctx, [COL, y], 1, RQ, 1, kp);
  }
  const kn = P(t, 84.8, 85.3, E.back) * (1 - P(t, 89.8, 90.2));
  if (kn > 0) {
    const y = ySale(t), kF = P(t, 85.3, 85.8);
    freccia(ctx, [COL, y - RQ - 3], [COL, y - RQ - 3 - LF], C.y, kn * kF * (1 - P(t, T_VIA_NEG + T_CADUTA - .05, T_VIA_NEG + T_CADUTA + .3)), 6);
    carica(ctx, [COL, y], -1, RQ, 1, kn);
  }
  const kr = Math.max(life(t, T_VIA_POS - .2, T_VIA_POS + 2.6, .3, .4), life(t, T_VIA_NEG - .2, T_VIA_NEG + 2.6, .3, .4));
  if (kr > 0) txt(ctx, 'al rallentatore', 1085, 768, { size: 30, color: C.dim, align: 'right', alpha: kr });
  ctx.restore();
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 41.8, () => {
    conFont(TITOLI, () => drawRich(ctx, 'campo uniforme', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:E} = 100 N/C', cx, 245, { size: 44, local: t - 13.9 });
    drawRich(ctx, '{dim:stessa intensità e direzione}', cx, 295, { size: 30, local: t - 14.2 });
    separa(ctx, 335, P(t, 19.2, 19.6));
    drawRich(ctx, '{my:F} = {mink:q·E}', cx, 385, { size: 44, local: t - 19.3 });
    separa(ctx, 435, P(t, 24.8, 25.2));
    drawRich(ctx, '{dim:da} {mink:A} {dim:a} {mink:B}{dim:: lavoro =} {mink:q·E·d}', cx, 485, { size: 34, local: t - 26.0 });
    drawRich(ctx, '{g:energia potenziale} {mink:U}', cx, 560, { size: 36, local: t - 31.5 });
    drawRich(ctx, '{mink:U} = {mink:q·E·h}', cx, 630, { size: 44, local: t - 35.8 });
    drawRich(ctx, '{dim:sasso:} {mink:m·g·h}{dim:, con il peso} {my:m·g}', cx, 695, { size: 30, local: t - 37.6 });
  });
  blocco(41.8, 73.6, () => {
    drawRich(ctx, '{dim:carica}', 1290, 165, { size: 30, local: t - 41.9 });
    drawRich(ctx, '{dim:energia}', 1480, 165, { size: 30, local: t - 41.9 });
    drawRich(ctx, '{mink:U}/{mink:q}', 1665, 165, { size: 34, local: t - 46.5 });
    drawRich(ctx, '{mink:q}', 1290, 220, { size: 40, local: t - 42.0 });
    drawRich(ctx, '{mink:q·E·h}', 1480, 220, { size: 40, local: t - 42.0 });
    drawRich(ctx, '{mink:2q}', 1290, 275, { size: 40, local: t - 42.2 });
    drawRich(ctx, '{mink:2q·E·h}', 1480, 275, { size: 40, local: t - 42.2 });
    drawRich(ctx, '{mink:E·h}', 1665, 220, { size: 40, local: t - 46.6 });
    drawRich(ctx, '{mink:E·h}', 1665, 275, { size: 40, local: t - 46.8 });
    separa(ctx, 320, P(t, 46.5, 46.9));
    drawRich(ctx, '{g:potenziale}{dim::} {mink:V} = {mink:U}/{mink:q}', cx, 372, { size: 42, local: t - 47.6 });
    drawRich(ctx, '{dim:volt:} 1 V = 1 J/C', cx, 430, { size: 34, local: t - 51.7 });
    separa(ctx, 475, P(t, 52.4, 52.8));
    const kz = kZero(t), kv = P(t, 52.6, 53.1);
    for (const [y, n, v] of [[525, 'B', 8], [585, 'A', 2]]) {
      drawRich(ctx, '{dim:in} {mink:' + n + '}{dim::}', 1370, y, { size: 36, align: 'right', alpha: kv });
      txt(ctx, volt(v), 1400, y, { size: 40, align: 'left', alpha: kv * vecchi(t) });
      txt(ctx, volt(v - 10), 1400, y, { size: 40, align: 'left', alpha: kv * kz });
    }
    drawRich(ctx, '{dim:prima: }Δ{mink:V} = 8 V − 2 V = {g:6 V}', cx, 645, { size: 34, local: t - 62.4 });
    drawRich(ctx, '{dim:ora: }Δ{mink:V} = −2 V − (−8 V) = {g:6 V}', cx, 698, { size: 34, local: t - 62.9 });
    drawRich(ctx, '{dim:lavoro per 1 C da} {mink:A} {dim:a} {mink:B}', cx, 752, { size: 32, local: t - 67.4 });
  });
  blocco(73.6, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'lasciate libere', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{v:+} {dim:verso} {mink:V} {dim:più basso}', cx, 235, { size: 36, local: t - 73.8 });
    drawRich(ctx, 'Δ{mink:V} = −10 V − (−2 V) = −8 V', cx, 295, { size: 34, local: t - 79.4 });
    drawRich(ctx, '{mink:L}{dim:: lavoro del campo, positivo}', cx, 345, { size: 32, local: t - 79.7 });
    drawRich(ctx, 'Δ{mink:V} = −{mink:L}/{mink:q}', cx, 410, { size: 48, local: t - 80.2 });
    separa(ctx, 460, P(t, 84.7, 85.1));
    drawRich(ctx, '{x:−} {dim:verso} {mink:V} {dim:più alto}', cx, 505, { size: 36, local: t - 84.8 });
    separa(ctx, 555, P(t, 90.1, 90.5));
    drawRich(ctx, 'Δ{mink:V} = {mink:E·d}', cx, 605, { size: 46, local: t - 90.2 });
    drawRich(ctx, '100 N/C · 0,06 m = 6 V', cx, 665, { size: 34, local: t - 90.8 });
    drawRich(ctx, '{g:1 N/C = 1 V/m}', cx, 725, { size: 38, local: t - 92.2 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 105.8, 106.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il potenziale è l’energia per coulomb:\nconta solo il dislivello fra due punti.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:V} = {mink:U}/{mink:q}\n{dim:in volt: 1 V = 1 J/C}'], [960, '{v:+} verso {mink:V} più basso\n{x:−} verso {mink:V} più alto'], [1470, 'Δ{mink:V} = {mink:E·d}\n{dim:nel campo uniforme}']];
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
    ['soffio', 7.6], ['pop', 8.0, .7], ['pop', 8.3, .3],                              // le due piastre
    ['traccia', 9.0, 10.8],                                                           // le linee di campo
    ['pop', 14.0, .5],                                                                // E uguale in ogni punto
    ['pop', 19.3, .55], ['pop', 19.9, .4],                                            // la carica q, la forza
    ['pop', 24.9, .5], ['tono', 26.0, 29.0, [.2, .5, .8]],                            // A e B, la porto su piano piano
    ['traccia', 29.0, 29.4], ['pop', 31.6, .6],                                       // d, l'energia potenziale
    ['traccia', 35.9, 36.3],                                                          // la quota h
    ['pop', 42.0, .6], ['ding', 46.7],                                                // 2q, U/q non cambia
    ['traccia', 51.8, 52.6], ['pop', 52.6, .5],                                       // la scala dei volt
    ['tono', 58.2, 59.4, [.6, .35]],                                                  // lo zero si sposta
    ['pop', 62.4, .45], ['ding', 62.9],                                               // la differenza resta 6 V
    ['pop', 73.8, .6], ['tono', 75.6, 77.6, [.8, .75, .62, .38, .06]], ['pop', 77.6, .25],   // la positiva cade
    ['pop', 79.4, .4], ['pop', 80.2, .55],                                            // ΔV = −L/q
    ['pop', 84.8, .35], ['tono', 86.0, 88.0, [.2, .25, .38, .62, .94]], ['pop', 88.0, .8],   // la negativa sale
    ['traccia', 90.2, 90.6], ['pop', 90.8, .5], ['ding', 92.3],                       // ΔV = E·d, N/C = V/m
    ['soffio', 96.0], ['pop', 98.2, .5], ['pop', 98.7, .6], ['pop', 99.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il dislivello elettrico', durata: 107.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.7, 'l’energia potenziale'], [41.7, 73.5, 'il potenziale'], [73.5, T_FINE, 'chi scende e chi sale']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCampo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
