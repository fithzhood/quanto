'use strict';
/* Le tre leggi di Keplero — 1: l'orbita è un'ellisse con il Sole in un fuoco (qui eccentricità 0,6, esagerata: quella della
   Terra è 0,017, quasi un cerchio). 2: il raggio vettore spazza aree uguali in tempi uguali; al perielio il pianeta va
   (1 + e)/(1 − e) = 4 volte più veloce che all'afelio. 3: T²/a³ è lo stesso per tutti i pianeti (in anni e UA vale 1).
   Moto vero: l'equazione di Keplero M = E − e·sin E risolta con il metodo di Newton (sempre lo stesso risultato); la
   velocità disegnata è la derivata della posizione, lunga in proporzione. I pianeti interni girano con i periodi veri
   (in scala: 1 anno = 6 s), sulle loro orbite in scala come cerchi. Argomento: gravitazione. */
CVIDEO.registra('gravitazione/keplero', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot, glowStroke } = M;

const T_FINE = 97.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.3, 'sorpreso'], [22.1, 'neutro'],
  [36.1, 'felice'], [40.6, 'neutro'], [46.6, 'sorpreso'], [51.1, 'neutro'], [60.2, 'festa'], [64.7, 'neutro'],
  [83.4, 'felice'], [88.1, 'sorpreso'], [92.7, 'felice'], [T_FINE, 'neutro'], [99.8, 'felice'], [103.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Come si muovono i pianeti\nattorno al Sole?'],
  [7.9, 12.6, 'Prima legge: l’orbita è un’{v:ellisse},\ncol Sole in un {g:fuoco}.'],
  [12.7, 17.2, 'L’altro fuoco è vuoto:\nlì non c’è niente.'],
  [17.3, 22.0, 'Qui l’ellisse è {r:esagerata}: quella\ndella Terra è quasi un cerchio.'],
  [22.1, 26.7, '{mink:a} è il {v:semiasse maggiore}:\nmetà dell’asse più lungo.'],
  [26.8, 31.4, 'Più vicino al Sole: il {v:perielio}.\nPiù lontano: l’{v:afelio}.'],
  [31.5, 36.0, 'Guarda la freccia della velocità\nmentre il pianeta gira.'],
  [36.1, 40.4, 'Al perielio va {g:più veloce}.'],
  [40.6, 46.4, 'Poi, allontanandosi dal Sole,\nrallenta sempre di più…'],
  [46.6, 51.0, '…e all’afelio va quattro volte\npiù piano che al perielio.'],
  [51.1, 55.4, 'Seconda legge: il raggio dal Sole\nal pianeta spazza {g:aree}.'],
  [55.5, 60.1, 'In 1/8 del periodo, qui uno spicchio\nlungo; là, corto e largo.'],
  [60.2, 64.6, 'Le due aree sono {g:uguali}:\n{g:aree uguali in tempi uguali}.'],
  [64.7, 69.3, 'Col raggio corto, per fare la stessa\narea deve correre di più.'],
  [69.4, 74.0, 'Terza legge: più l’orbita è grande,\npiù lungo è il {v:periodo} {mink:T}.'],
  [74.1, 78.6, '{mink:T} è il tempo di un giro:\nper la Terra, un anno.'],
  [78.7, 83.3, 'Distanze in {v:UA}: 1 UA è la distanza\nmedia Terra–Sole.'],
  [83.4, 88.0, 'Per ogni pianeta {mink:T²/a³} dà\n{g:lo stesso numero}: qui 1.'],
  [88.1, 92.6, 'Anche per Giove e Saturno,\nlontanissimi.'],
  [92.7, 97.0, 'Quindi {mink:T²} è {v:proporzionale}\nad {mink:a³}.'],
  [99.8, 104.9, 'Ellissi, aree uguali in tempi uguali,\n{mink:T²} proporzionale ad {mink:a³}.'],
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
const lin = (t, keys) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function sole(ctx, p, r, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0], p[1], r * .3, p[0], p[1], r * 2.2);
  g.addColorStop(0, css(C.y, .45)); g.addColorStop(1, css(C.y, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.y, [255, 214, 90], .5)); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- l'orbita vera: equazione di Keplero ----------
const EC = .6, A_PX = 360, B_PX = A_PX * Math.sqrt(1 - EC * EC), CX = 610, CY = 445;   // semiassi 360 e 288 px
const SOLE = [CX + EC * A_PX, CY], VUOTO = [CX - EC * A_PX, CY];
function anomaliaEccentrica(Mm) {   // risolve M = E − e·sin E (Newton, 30 passi: sempre lo stesso risultato)
  const giri = Math.floor((Mm + Math.PI) / (2 * Math.PI)), m = Mm - giri * 2 * Math.PI;
  let Ea = m + EC * Math.sin(m);
  for (let i = 0; i < 30; i++) Ea -= (Ea - EC * Math.sin(Ea) - m) / (1 - EC * Math.cos(Ea));
  return Ea + giri * 2 * Math.PI;
}
const posE = Ea => [CX + A_PX * Math.cos(Ea), CY - B_PX * Math.sin(Ea)];             // gira in senso antiorario
const velE = Ea => { const k = 1 / (1 - EC * Math.cos(Ea)); return [-A_PX * Math.sin(Ea) * k, -B_PX * Math.cos(Ea) * k]; };   // d(posizione)/dM
const posM = Mm => posE(anomaliaEccentrica(Mm));
// l'orologio dell'orbita, in giri: 12 s di video per giro, con i fermi immagine
const GIRO = 12;
const FASE = [[7.9, 3 - 28.1 / GIRO], [36.0, 3], [40.6, 3], [46.6, 3.5], [51.2, 3.5], [52.7, 3.625], [56.45, 3.9375], [57.95, 4.0625]];
const fase = t => lin(t, FASE);
const MUOVE = [[7.9, 36.0], [40.6, 46.6], [51.2, 57.95]];
const SETTORI = [[3.5, 3.625, 51.2], [3.9375, 4.0625, 56.45]];   // un ottavo di giro ciascuno
const ELLISSE = Array.from({ length: 361 }, (_, i) => posE(i / 360 * Math.PI * 2));

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le tre leggi di Keplero', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–2 · l'ellisse e le aree (7,5–69,3)
function sceneOrbita(ctx, t) {
  if (t < 7.5 || t > 69.8) return;
  const al = life(t, 7.6, 69.6, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const ph = fase(t), Mm = ph * 2 * Math.PI, Ea = anomaliaEccentrica(Mm), p = posE(Ea);
  // l'asse maggiore e il semiasse a
  const kAx = life(t, 22.2, 31.4, .5, .5);
  if (kAx > 0) {
    dashed(ctx, [CX - A_PX, CY], [CX + A_PX, CY], C.dim, 1, .8 * kAx);
    ctx.save(); ctx.globalAlpha *= kAx; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(CX - A_PX, CY + 34); ctx.lineTo(CX, CY + 34); ctx.moveTo(CX - A_PX, CY + 22); ctx.lineTo(CX - A_PX, CY + 46); ctx.moveTo(CX, CY + 22); ctx.lineTo(CX, CY + 46); ctx.stroke(); ctx.restore();
    fondo(ctx, CX - A_PX / 2, CY + 70, 44, 46, kAx); drawRich(ctx, '{mink:a}', CX - A_PX / 2, CY + 70, { size: 44, alpha: kAx });
  }
  // gli spicchi spazzati in un ottavo di giro
  for (const [f0, f1] of SETTORI) {
    if (ph <= f0) continue;
    const ff = Math.min(ph, f1), pts = [SOLE];
    for (let i = 0; i <= 60; i++) pts.push(posM(lerp(f0, ff, i / 60) * 2 * Math.PI));
    ctx.save(); ctx.fillStyle = css(C.v, .22); ctx.strokeStyle = css(C.v, .8); ctx.lineWidth = 2.5;
    ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  // l'orbita: il primo giro si disegna dietro al pianeta
  const giro0 = FASE[0][1], kTr = clamp(ph - giro0);
  ctx.save(); ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 3;
  if (kTr < 1) {
    ctx.beginPath();
    for (let i = 0; i <= 240; i++) { const q = posM(lerp(giro0, ph, i / 240) * 2 * Math.PI); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }
    ctx.stroke();
  } else { ctx.beginPath(); ELLISSE.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.stroke(); }
  ctx.restore();
  // i due fuochi
  sole(ctx, SOLE, 24, P(t, 7.8, 8.3));
  // «Sole» sopra, a sinistra: lontano dagli spicchi (a destra e in basso) e dal raggio vettore
  fondo(ctx, SOLE[0] - 74, SOLE[1] - 42, 80, 38, P(t, 8.1, 8.5)); txt(ctx, 'Sole', SOLE[0] - 74, SOLE[1] - 42, { size: 30, color: C.dim, alpha: P(t, 8.1, 8.5) });
  const kV = life(t, 12.8, 51.0, .5, .4);   // il fuoco vuoto è della prima legge: se ne va prima che lo spicchio lo attraversi
  if (kV > 0) {
    ctx.save(); ctx.globalAlpha *= kV; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(VUOTO[0] - 11, VUOTO[1] - 11); ctx.lineTo(VUOTO[0] + 11, VUOTO[1] + 11); ctx.moveTo(VUOTO[0] + 11, VUOTO[1] - 11); ctx.lineTo(VUOTO[0] - 11, VUOTO[1] + 11); ctx.stroke(); ctx.restore();
    fondo(ctx, VUOTO[0], VUOTO[1] - 44, 170, 38, kV); txt(ctx, 'fuoco vuoto', VUOTO[0], VUOTO[1] - 44, { size: 30, color: C.dim, alpha: kV });
  }
  // perielio e afelio, fuori dall'ellisse
  const kPA = P(t, 26.9, 27.4);
  txt(ctx, 'perielio', CX + A_PX + 66, CY + 45, { size: 30, color: C.v, alpha: kPA });
  txt(ctx, 'afelio', CX - A_PX - 72, CY, { size: 30, color: C.v, alpha: kPA });
  // il raggio vettore
  const kR = P(t, 51.2, 51.6);
  if (kR > 0) { ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...SOLE); ctx.lineTo(...p); ctx.stroke(); ctx.restore(); }
  // la velocità: tangente, lunga in proporzione
  const kVel = P(t, 31.6, 32.1), vv = velE(Ea), Lv = Math.hypot(...vv);
  if (kVel > 0) {
    const p0 = [p[0] + vv[0] / Lv * 17, p[1] + vv[1] / Lv * 17], tip = [p0[0] + vv[0] * .2, p0[1] + vv[1] * .2];   // dal bordo del pianeta
    freccia(ctx, p0, tip, C.x, kVel, 6);
    // la «v» oltre la punta; quando passa sopra una scritta (didascalie, perielio, afelio, Sole) sfuma e lascia la freccia sola
    const lv = [tip[0] + vv[0] / Lv * 30, Math.max(140, tip[1] + vv[1] / Lv * 30)];
    const SCRITTE = [[806, 114, 1104, 186], [121, 114, 409, 186], [121, 727, 559, 796], [962, 454, 1110, 526], [116, 409, 240, 481], [698, 366, 806, 440]];
    const lontano = Math.min(...SCRITTE.map(([x0, y0, x1, y1]) => Math.hypot(Math.max(x0 - lv[0], 0, lv[0] - x1), Math.max(y0 - lv[1], 0, lv[1] - y1))));
    drawRich(ctx, '{mx:v}', lv[0], lv[1], { size: 40, alpha: kVel * clamp(lontano / 14) });
  }
  dot(ctx, p, mix(C.x, C.ink, .25), P(t, 7.8, 8.2, E.back), 15);
  // il tempo e la scala
  const muove = MUOVE.some(([a, b]) => t >= a && t <= b);
  txt(ctx, muove ? 'tempo accelerato' : 'fermo immagine', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: P(t, 8.0, 8.4) });
  txt(ctx, 'ellisse esagerata', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: P(t, 17.4, 17.9) });
  txt(ctx, 'Sole e pianeta non in scala', 140, 762, { size: 30, color: C.dim, align: 'left', alpha: P(t, 17.4, 17.9) });
  ctx.restore();
}

// 3 · i pianeti interni, con orbite e periodi in scala (190 px per UA, un anno = 6 s)
const PIANETI = [   // nome, a (UA), T (anni), colore, fase iniziale
  ['Mercurio', '0,387', '0,241', () => C.dim, .4], ['Venere', '0,723', '0,615', () => C.y, 2.2],
  ['Terra', '1,000', '1,000', () => C.x, 4.1], ['Marte', '1,524', '1,881', () => C.r, 5.6],
  ['Giove', '5,203', '11,86', () => mix(C.y, C.g, .5), 0], ['Saturno', '9,537', '29,46', () => mix(C.dim, C.y, .4), 0],
];
const num = s => +s.replace(',', '.');
function scenePianeti(ctx, t) {
  if (t < 69.0 || t > T_FINE + .3) return;
  const al = life(t, 69.4, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const S = [610, 440], UA = 190;
  for (const [nome, a, T, col, f0] of PIANETI.slice(0, 4)) {
    const r = num(a) * UA, ang = f0 + 2 * Math.PI * (t - 69.4) / (num(T) * 6);
    ctx.strokeStyle = css(C.ink, .3); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(S[0], S[1], r, 0, Math.PI * 2); ctx.stroke();
    dot(ctx, [S[0] + r * Math.cos(ang), S[1] - r * Math.sin(ang)], col(), 1, 12);
  }
  // 1 UA: dal Sole all'orbita della Terra
  const kU = life(t, 78.8, 88.0, .4, .4);
  if (kU > 0) {
    const ang = 3.6, q = [S[0] + UA * Math.cos(ang), S[1] - UA * Math.sin(ang)];
    dashed(ctx, S, q, C.x, 1, kU);
    fondo(ctx, (S[0] + q[0]) / 2 - 10, (S[1] + q[1]) / 2 + 34, 84, 40, kU);
    txt(ctx, '1 UA', (S[0] + q[0]) / 2 - 10, (S[1] + q[1]) / 2 + 34, { size: 30, weight: 600, color: C.x, alpha: kU });
  }
  sole(ctx, S, 20);
  txt(ctx, 'tempo accelerato: 1 anno = 6 s', 1085, 762, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'orbite in scala', 140, 150, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'Sole e pianeti non in scala', 140, 762, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 7.6 || t > T_FINE + .3) return;
  const al = life(t, 7.9, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // 1 · prima legge
  const s1 = life(t, 7.9, 31.4, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'prima legge');
    drawRich(ctx, 'l’orbita è un’{v:ellisse}', 1480, 240, { size: 36, local: t - 8.1 });
    drawRich(ctx, 'con il Sole in un {g:fuoco}', 1480, 292, { size: 36, local: t - 8.6 });
    const kT = P(t, 17.4, 17.9);
    if (kT > 0) {
      ctx.save(); ctx.globalAlpha *= kT;
      txt(ctx, 'l’orbita della Terra, in scala', 1480, 370, { size: 30, color: C.dim });
      // eccentricità 0,017: il Sole è a 2,5 px dal centro
      const ce = [1480, 545], ae = 140, be = ae * Math.sqrt(1 - .0167 ** 2);
      ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ce[0], ce[1], ae, be, 0, 0, Math.PI * 2); ctx.stroke();
      sole(ctx, [ce[0] + .0167 * ae, ce[1]], 12);
      drawRich(ctx, '{g:quasi un cerchio}', 1480, 735, { size: 34 });
      ctx.restore();
    }
    ctx.restore();
  }
  // 2 · seconda legge
  const s2 = life(t, 31.5, 69.3, .4, .5);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'seconda legge');
    const vv = velE(anomaliaEccentrica(fase(t) * 2 * Math.PI)), bw = Math.hypot(...vv) / (B_PX / (1 - EC)) * 520;
    txt(ctx, 'velocità', 1190, 235, { size: 30, color: C.dim, align: 'left' });
    ctx.fillStyle = css(C.x); ctx.fillRect(1190, 262, bw, 30);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.strokeRect(1190, 262, 520, 30);
    drawRich(ctx, '{dim:al perielio:} {g:massima}', 1190, 335, { size: 32, align: 'left', alpha: P(t, 36.3, 36.8) });
    drawRich(ctx, '{dim:all’afelio:} un quarto', 1190, 385, { size: 32, align: 'left', alpha: P(t, 46.8, 47.3) });
    const kA = P(t, 51.3, 51.8);
    if (kA > 0) {
      ctx.save(); ctx.globalAlpha *= kA;
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 432); ctx.lineTo(1770, 432); ctx.stroke();
      txt(ctx, 'area spazzata in 1/8 del periodo', 1480, 480, { size: 32, color: C.dim });
      for (const [i, ta] of [[0, 52.7], [1, 57.95]]) {
        const k = P(t, ta, ta + .4), y = 545 + 55 * i;
        ctx.fillStyle = css(C.v, .22 * k); ctx.strokeStyle = css(C.v, .8 * k); ctx.lineWidth = 2;
        ctx.fillRect(1230, y - 16, 40, 32); ctx.strokeRect(1230, y - 16, 40, 32);
        txt(ctx, i ? 'vicino al Sole: 1/8 dell’ellisse' : 'lontano: 1/8 dell’ellisse', 1290, y, { size: 30, align: 'left', alpha: k });
      }
      drawRich(ctx, '{g:aree uguali in tempi uguali}', 1480, 690, { size: 36, local: t - 60.4 });
      ctx.restore();
    }
    ctx.restore();
  }
  // 3 · terza legge: la tabella
  const s3 = P(t, 69.4, 69.9);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'terza legge');
    const XN = 1180, XAc = 1470, XT = 1620, XR = 1775;
    drawRich(ctx, '{mink:a} {dim:(UA)}', XAc, 235, { size: 32, align: 'right' });
    drawRich(ctx, '{mink:T} {dim:(anni)}', XT, 235, { size: 32, align: 'right' });
    drawRich(ctx, '{mink:T²/a³}', XR, 235, { size: 34, align: 'right', alpha: P(t, 83.6, 84.0) });
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 266); ctx.lineTo(1780, 266); ctx.stroke();
    PIANETI.forEach(([nome, a, T, col], i) => {
      const y = 305 + 54 * i, k = P(t, i < 4 ? 74.3 + .3 * i : 88.3 + .4 * (i - 4), (i < 4 ? 74.7 + .3 * i : 88.7 + .4 * (i - 4)));
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      dot(ctx, [XN + 10, y], col(), 1, 10);
      txt(ctx, nome, XN + 32, y, { size: 32, align: 'left' });
      txt(ctx, a, XAc, y, { size: 32, align: 'right' });
      txt(ctx, T, XT, y, { size: 32, align: 'right' });
      txt(ctx, '1,00', XR, y, { size: 32, weight: 600, color: C.g, align: 'right', alpha: P(t, i < 4 ? 83.7 : 88.8, i < 4 ? 84.2 : 89.3) });
      ctx.restore();
    });
    drawRich(ctx, '{mink:T²} {v:è proporzionale ad} {mink:a³}', 1480, 680, { size: 40, local: t - 92.9 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (97,4–107,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 106.1, 107.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'I pianeti girano su ellissi, più veloci\nvicino al Sole e più lenti lontano.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{v:ellisse}\ncon il Sole in un fuoco'], [960, '{g:aree uguali}\nin tempi uguali'], [1430, '{mink:T²/a³}\nuguale per tutti i pianeti']];
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
    ['soffio', 7.6], ['pop', 7.9, .5],                                                // l'orbita, il Sole e il pianeta
    ['tono', 7.9, 9.9, [.2, .17, .13, .1, .08, .05, .03, .01, 0]],                     // il pianeta parte e traccia l'ellisse
    ['pop', 8.1, .45], ['pop', 8.6, .5],                                              // ellisse, Sole in un fuoco
    ['pop', 17.4, .4],                                                                // l'orbita della Terra, quasi un cerchio
    ['traccia', 22.2, 22.7], ['pop', 22.3, .45],                                      // l'asse maggiore, il semiasse a
    ['pop', 26.9, .45],                                                               // perielio e afelio
    ['soffio', 31.5], ['pop', 31.6, .4],                                              // seconda legge: la freccia della velocità
    ['tono', 31.6, 36.0, [.19, .22, .26, .31, .38, .47, .61, .82, 1]], ['pop', 36.3, .8],   // accelera fino al perielio
    ['tono', 40.6, 46.6, [1, .73, .5, .37, .28, .22, .18, .16, .15]], ['pop', 46.8, .2],    // rallenta fino all'afelio: un quarto
    ['pop', 51.2, .5], ['traccia', 51.2, 52.7], ['pop', 52.7, .4],                    // il raggio vettore, lo spicchio lontano
    ['tono', 51.2, 57.95, [.15, .16, .19, .24, .32, .45, .66, .99, .73]],              // il pianeta torna veloce verso il Sole
    ['traccia', 56.45, 57.95], ['pop', 57.95, .45],                                   // lo spicchio vicino al Sole
    ['soffio', 69.4],                                                                 // terza legge: i pianeti interni
    ['pop', 74.3, .3], ['pop', 74.6, .4], ['pop', 74.9, .5], ['pop', 75.2, .6],       // Mercurio, Venere, Terra, Marte
    ['traccia', 78.8, 79.2], ['pop', 78.9, .4],                                       // 1 UA
    ['pop', 83.6, .5], ['ding', 84.2],                                                // T²/a³ = 1 per tutti
    ['pop', 88.3, .7], ['pop', 88.7, .8], ['ding', 89.3],                             // anche Giove e Saturno
    ['pop', 92.9, .55],                                                               // T² proporzionale ad a³
    ['soffio', 97.6], ['pop', 99.6, .5], ['pop', 100.1, .6], ['pop', 100.6, .7],      // in una frase
  ];
  return {
    titolo: 'Le tre leggi di Keplero', durata: 107.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.4, 'prima legge: l’ellisse'], [31.4, 69.3, 'seconda legge: le aree'], [69.3, T_FINE, 'terza legge: i periodi']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneOrbita(ctx, t); scenePianeti(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
