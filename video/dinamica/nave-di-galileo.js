'use strict';
/* Nella stiva della nave — la relatività galileiana: una pallina cade da 4,9 m nella stiva (1 s, g = 9,8 m/s²), a nave
   ferma e a nave che va a 5 m/s in linea retta: da dentro cade dritta sul segno in tutti e due i casi; da riva fa una
   parabola x = 5·t, y = 4,9 − 4,9·t² e cade 5 m più avanti, dove è arrivato il segno. Trasformazioni di Galileo
   x′ = x − v·t, y′ = y, t′ = t; le velocità orizzontali 5 − 5 = 0 m/s. Tutto al rallentatore (3 s di video per 1 s).
   Argomento: dinamica. */
CVIDEO.registra('dinamica/nave-di-galileo', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed, ball } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [97.9, 190], [99.2, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [97.9, 1050], [99.2, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [97.9, 2.2], [99.2, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [97.9, 2], [99.2, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [97.9, -1.5], [99.2, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.6, 'felice'], [16.5, 'neutro'],
  [25.3, 'sorpreso'], [29.5, 'felice'], [34.0, 'neutro'], [43.3, 'sorpreso'], [48.5, 'felice'], [53.2, 'neutro'],
  [73.5, 'felice'], [78.1, 'neutro'], [83.5, 'pensa'], [88.5, 'neutro'], [93.3, 'festa'], [97.9, 'neutro'],
  [100.4, 'felice'], [105.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Chiuso nella stiva, capisci\nse la nave si muove?'],
  [7.9, 12.5, 'Nave ferma in porto: lascio cadere\nuna pallina da 4,9 m.'],
  [12.6, 16.4, 'Cade dritta sul segno,\nin 1 s.'],
  [16.5, 21.0, 'Ora la nave va a 5 m/s,\ndritta e senza scossoni.'],
  [21.1, 25.2, 'Rifaccio la prova…'],
  [25.3, 29.4, '…cade dritta, sul segno,\nin 1 s: come in porto!'],
  [29.5, 33.9, 'Da dentro, le due prove\nsono {g:identiche}.'],
  [34.0, 38.4, 'Ma la nave si muove: guardiamo\ndalla riva.'],
  [38.5, 43.2, 'Stessa caduta, vista da dentro\ne da riva nello stesso istante.'],
  [43.3, 48.4, 'Da riva fa una {v:parabola}: parte\ngià a 5 m/s, con la nave.'],
  [48.5, 53.0, 'In 1 s avanza 5 m, come\nla nave: cade sul segno.'],
  [53.2, 58.0, 'Riavvolgo. Da riva misuro {mink:x},\ndalla nave {mink:x′}: all’inizio coincidono.'],
  [58.1, 63.4, 'Dopo un tempo {mink:t} la nave è avanzata\ndi {mink:v·t}: {mink:x′ = x − v·t}.'],
  [63.5, 68.5, 'A metà caduta: {mink:x} = 2,5 m,\n{mink:x′} = 0.'],
  [68.6, 73.4, 'All’arrivo {mink:x} = 5 m\ne {mink:x′} = 5 − 5 = 0.'],
  [73.5, 78.0, 'Per chi è sulla nave {mink:x′} resta 0:\nla caduta è {g:dritta}.'],
  [78.1, 83.4, 'Altezze uguali, {mink:y′ = y},\ne stesso tempo, {mink:t′ = t}.'],
  [83.5, 88.3, 'Le velocità si sottraggono: in\norizzontale 5 − 5 = 0 m/s.'],
  [88.5, 93.2, 'Nessun esperimento nella stiva distingue\nla quiete dal moto rettilineo uniforme.'],
  [93.3, 97.8, 'È il principio di {v:relatività} galileiana:\nGalileo lo racconta nel {v:Dialogo}.'],
  [100.4, 105.0, 'In moto rettilineo uniforme, nella\nstiva tutto va come in porto.'],
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
// il segno del tempo: triangolo (scorre), due barrette (fermo), due triangoli all'indietro (riavvolge)
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 13, 8, 26); ctx.fillRect(x + 14, y - 13, 8, 26); }
  else if (testo === 'riavvolgo') {
    for (const d of [0, 13]) { ctx.beginPath(); ctx.moveTo(x + 11 + d, y - 13); ctx.lineTo(x + d, y); ctx.lineTo(x + 11 + d, y + 13); ctx.closePath(); ctx.fill(); }
  } else { ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 13); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il moto vero (metri e secondi) ----------
const G = 9.8, H0 = 4.9, V = 5, LENTO = 3;              // 4,9 m di caduta: 1 s; nave a 5 m/s; 3 s di video per 1 s
const quota = tau => H0 - G * tau * tau / 2;           // altezza della pallina sul pavimento della stiva
// i tempi veri delle tre prove: in porto, in moto (da dentro), e la prova vista insieme da dentro e da riva
const tau1 = t => clamp((t - 12.8) / LENTO, 0, 1);
const tau2 = t => clamp((t - 21.6) / LENTO, 0, 1);
const TR = 39.6;                                        // il rilascio della terza prova
// fra due fotogrammi chiave il tempo scorre in modo uniforme (niente easing: il moto resta quello vero)
function lineare(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
}
function tau3(t) {
  if (t <= TR + LENTO) return (t - TR) / LENTO;         // prima del rilascio la nave avanza già (τ < 0)
  if (t < 55.0) return kf(t, [[53.4, 1], [55.0, 0]]);   // il riavvolgimento
  return lineare(t, [[63.6, 0], [65.1, .5], [68.7, .5], [70.2, 1]]);   // avanti al rallentatore: 1,5 s per 0,5 s veri
}
const riavvolge = t => t > 53.4 && t < 55.0;
// il legno della nave: bruno sulla carta chiara, arancio scuro sulla carta scura
function legno() { const c = M.rgb(C.paper); return c[0] + c[1] + c[2] < 384 ? mix(C.y, C.paper, .45) : mix(C.y, C.ink, .33); }
// che cosa fa il tempo in questo istante (per il segno in basso nelle schede)
function statoTempo(t) {
  if ((t > 12.8 && t < 15.8) || (t > 21.6 && t < 24.6)) return 'al rallentatore';
  if (t < 34) return '';
  if (t < TR + LENTO || (t > 63.6 && t < 65.1) || (t > 68.7 && t < 70.2)) return 'al rallentatore';
  if (riavvolge(t)) return 'riavvolgo';
  return 'fermo immagine';
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Nella stiva della nave', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · dentro la stiva (scheda di sinistra, 7,5–97,9): 100 px per metro
const K = 100, XC = 742, YF = 680, RB = 18;
function sceneDentro(ctx, t) {
  if (t < 7.5 || t > 98.2) return;
  const al = life(t, 7.5, 98.1, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  // la stiva: pareti di tavole, soffitto, pavimento
  ctx.fillStyle = css(mix(C.y, C.paper, .9)); ctx.fillRect(420, 150, 644, YF - 150);
  ctx.strokeStyle = css(mix(C.y, C.paper, .7)); ctx.lineWidth = 2;
  for (let y = 150 + 54; y < YF; y += 54) { ctx.beginPath(); ctx.moveTo(420, y); ctx.lineTo(1064, y); ctx.stroke(); }
  ctx.fillStyle = css(legno()); ctx.fillRect(408, 138, 668, 14); ctx.fillRect(408, YF, 668, 26);
  ctx.fillRect(408, 138, 14, YF - 138); ctx.fillRect(1062, 138, 14, YF - 138);
  txt(ctx, 'dentro la nave', 450, 186, { size: 30, color: C.dim, align: 'left' });
  // il gancio che tiene la pallina, e il segno sul pavimento
  ctx.fillStyle = css(C.dim); ctx.fillRect(XC - 22, 152, 44, 8);
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(XC - 30, YF - 2); ctx.lineTo(XC + 30, YF - 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(XC, YF - 2); ctx.lineTo(XC, YF - 14); ctx.stroke();
  // quale prova si vede
  const tau = t < 20 ? tau1(t) : t < 34 ? tau2(t) : Math.max(0, tau3(t));
  const yb = YF - quota(tau) * K - RB;
  const ytop = YF - H0 * K - RB;
  if (tau > 0) dashed(ctx, [XC, ytop], [XC, yb], C.v, 1, .55);
  ball(ctx, XC, yb, '', C.y, { r: RB });
  // l'altezza di caduta
  const kh = life(t, 8.4, 20.5, .4, .4);
  if (kh > 0) {
    ctx.save(); ctx.globalAlpha *= kh; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    const x = XC + 150, y0 = YF - H0 * K;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, YF - 4); ctx.moveTo(x - 9, y0); ctx.lineTo(x + 9, y0); ctx.moveTo(x - 9, YF - 4); ctx.lineTo(x + 9, YF - 4); ctx.stroke();
    txt(ctx, '4,9 m', x + 18, (y0 + YF) / 2, { size: 32, align: 'left' });
    ctx.restore();
  }
  // l'asse x′, solidale con la nave, con lo zero sul segno
  const kx = P(t, 55.2, 55.8) * (1 - P(t, 88.3, 88.8));
  if (kx > 0) {
    ctx.save(); ctx.globalAlpha *= kx; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(452, YF + 46); ctx.lineTo(1030, YF + 46); ctx.stroke();
    arrowHead(ctx, [1036, YF + 46], 0, C.ink);
    for (let i = -2; i <= 2; i++) { const x = XC + i * K; ctx.beginPath(); ctx.moveTo(x, YF + 38); ctx.lineTo(x, YF + 54); ctx.stroke(); }
    txt(ctx, '0', XC, YF + 80, { size: 30, color: C.dim });
    drawRich(ctx, '{mink:x′}', 1048, YF + 80, { size: 38, align: 'right' });
    ctx.restore();
  }
  // il valore di x′ della pallina
  const kv = life(t, 63.5, 88.3, .4, .4);
  if (kv > 0) drawRich(ctx, '{mink:x′} = 0', XC + 60, yb, { size: 36, align: 'left', alpha: kv });
  const st = statoTempo(t);
  chip(ctx, 404, 765, st ? 1 : 0, st || 'al rallentatore');
  ctx.restore();
}

// 2 · il pannello delle prime due prove (8–34)
function riga(ctx, nome, val, y, al) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1180, y, { size: 32, align: 'left', alpha: al });
  drawRich(ctx, val, 1800, y, { size: 36, align: 'right', alpha: al });
}
function scenePannello(ctx, t) {
  if (t < 8.0 || t > 34.4) return;
  const al = life(t, 8.1, 34.3, .5, .5);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'due prove nella stiva', 1490, 165, { size: 38, weight: 600 }));
  const kN = P(t, 16.6, 17.0);
  riga(ctx, '{dim:la nave}', 'ferma in porto', 245, 1 - kN);
  riga(ctx, '{dim:la nave}', 'va a {x:5 m/s}, dritta', 245, kN);
  riga(ctx, '{dim:altezza di caduta}', '4,9 m', 305, P(t, 8.6, 9.1));
  const tau = t < 20 ? tau1(t) : tau2(t);
  ctx.save(); ctx.globalAlpha *= P(t, 8.6, 9.1);
  drawRich(ctx, '{dim:tempo di caduta}  {mink:t} =', 1180, 365, { size: 32, align: 'left' });
  fixedNum(ctx, fmtN(tau, 2), 1770, 365, 40, tau >= 1 ? C.g : C.ink); txt(ctx, 's', 1780, 365, { size: 34, align: 'left' });
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= P(t, 15.9, 16.3);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 415); ctx.lineTo(1800, 415); ctx.stroke();
  ctx.restore();
  riga(ctx, '{dim:prova 1: nave ferma}', '{g:sul segno}', 470, P(t, 15.9, 16.3));
  riga(ctx, '{dim:prova 2: nave a 5 m/s}', '{g:sul segno}', 535, P(t, 24.7, 25.1));
  drawRich(ctx, 'le due prove sono {g:identiche}', 1490, 640, { size: 38, local: t - 29.7 });
  ctx.restore();
}

// 3 · vista da riva (scheda in alto a destra, 34–97,9): 42 px per metro, x = 0 dove parte la pallina
const KS = 42, OX = 1290, YFS = 432, YW = 452, YQ = 478, RBS = 10, YCIELO = YFS - H0 * KS - 2 * RBS;   // soffitto della stiva
const SX = X => OX + X * KS, SY = h => YFS - h * KS;
function nave(ctx, xs) {
  // lo scafo, tagliato per far vedere la stiva; la prua è a destra
  const yd = YCIELO - 8;
  ctx.fillStyle = css(legno()); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(xs - 168, yd - 6); ctx.lineTo(xs + 170, yd); ctx.lineTo(xs + 214, yd - 20);
  ctx.quadraticCurveTo(xs + 178, YW - 40, xs + 118, YW + 18); ctx.lineTo(xs - 138, YW + 18);
  ctx.quadraticCurveTo(xs - 160, YW - 60, xs - 168, yd - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .9)); ctx.fillRect(xs - 136, YCIELO, 262, YFS - YCIELO);
  ctx.fillStyle = css(C.dim); ctx.fillRect(xs - 9, YCIELO, 18, 4);
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xs - 14, YFS - 1); ctx.lineTo(xs + 14, YFS - 1); ctx.stroke();
}
function sceneRiva(ctx, t) {
  if (t < 33.9 || t > 98.2) return;
  const al = life(t, 34.0, 98.1, .6, .6);
  card(ctx, 1140, 108, 700, 412, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(1141, 109, 698, 410, 22); ctx.clip();
  // il mare e la riva
  ctx.fillStyle = css(mix(C.x, C.paper, .82)); ctx.fillRect(1140, YW, 700, YQ - YW);
  const tau = tau3(t), X = V * tau, xs = SX(X);
  nave(ctx, xs);
  ctx.fillStyle = css(mix(C.dim, C.paper, .62)); ctx.fillRect(1140, YQ, 700, 60);
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1140, YW); ctx.lineTo(1840, YW); ctx.stroke();
  txt(ctx, 'vista da riva', 1166, 134, { size: 30, color: C.dim, align: 'left' });
  // la velocità della nave
  const kv = clamp((xs - 1200) / 40);   // compare quando la freccia è tutta dentro la scheda
  freccia(ctx, [xs - 50, YCIELO - 44], [xs + 50, YCIELO - 44], C.x, kv, 6);
  drawRich(ctx, '{x:5 m/s}', xs + 66, YCIELO - 44, { size: 30, align: 'left', alpha: kv });
  // la parabola (solo per τ > 0) e la pallina
  const tt = Math.max(0, tau);
  if (tt > 0) {
    const pts = []; for (let i = 0; i <= 40; i++) { const u = tt * i / 40; pts.push([SX(V * u), SY(quota(u)) - RBS]); }
    M.glowStroke(ctx, pts, 1, C.v, 4);
  }
  const bx = SX(V * tt) + (tau < 0 ? X * KS : 0), by = SY(quota(tt)) - RBS;
  // la velocità con cui parte: quella della nave
  const k0 = life(t, 43.5, 53.2, .4, .4);
  if (k0 > 0) {
    ctx.save(); ctx.globalAlpha *= .45 * k0; ball(ctx, SX(0), SY(H0) - RBS, '', C.y, { r: RBS }); ctx.restore();
    freccia(ctx, [SX(0), SY(H0) - RBS], [SX(0) + V * 20, SY(H0) - RBS], C.x, k0, 6);
  }
  ball(ctx, bx, by, '', C.y, { r: RBS });
  // l'asse x lungo la riva
  const kx = P(t, 55.2, 55.8) * (1 - P(t, 88.3, 88.8));
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  if (kx > 0) {
    ctx.save(); ctx.globalAlpha *= kx;
    ctx.beginPath(); ctx.moveTo(1160, YQ + 4); ctx.lineTo(1810, YQ + 4); ctx.stroke();
    arrowHead(ctx, [1816, YQ + 4], 0, C.ink);
    for (let i = -3; i <= 12; i++) { const x = SX(i); ctx.beginPath(); ctx.moveTo(x, YQ - 2); ctx.lineTo(x, YQ + (i % 5 ? 10 : 14)); ctx.stroke(); }
    txt(ctx, '0', SX(0) + 16, YQ + 26, { size: 30, color: C.dim }); txt(ctx, '5', SX(5) + 16, YQ + 26, { size: 30, color: C.dim }); txt(ctx, '10', SX(10) + 22, YQ + 26, { size: 30, color: C.dim });
    drawRich(ctx, '{mink:x}', 1790, YQ + 26, { size: 36, align: 'right' });
    // la pallina proiettata sull'asse, e quanto è avanzata la nave
    if (t > 63.5) dashed(ctx, [bx, by + RBS], [bx, YQ], C.dim, 1, .8);
    ctx.restore();
  }
  // quanto avanza in 1 s
  const k5 = life(t, 48.6, 53.2, .4, .4);
  if (k5 > 0) {
    ctx.save(); ctx.globalAlpha *= k5; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    const y = YQ + 22;
    ctx.beginPath(); ctx.moveTo(SX(0), y); ctx.lineTo(SX(5), y); ctx.moveTo(SX(0), y - 9); ctx.lineTo(SX(0), y + 9); ctx.moveTo(SX(5), y - 9); ctx.lineTo(SX(5), y + 9); ctx.stroke();
    ctx.fillStyle = css(mix(C.dim, C.paper, .62)); ctx.fillRect(SX(2.5) - 34, y - 16, 68, 32);
    drawRich(ctx, '{g:5 m}', SX(2.5), y, { size: 30 });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · le trasformazioni di Galileo e il principio (scheda in basso a destra, 53–97,9)
function sceneFormule(ctx, t) {
  if (t < 53.0 || t > 98.2) return;
  const al = life(t, 53.2, 98.1, .5, .6);
  card(ctx, 1140, 540, 700, 260, al);
  ctx.save(); ctx.globalAlpha *= al;
  const kA = 1 - P(t, 88.3, 88.8), kB = P(t, 88.6, 89.1);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    conFont(TITOLI, () => drawRich(ctx, 'le trasformazioni di Galileo', 1490, 574, { size: 34, weight: 600 }));
    drawRich(ctx, '{mink:x′ = x − v·t}', 1180, 634, { size: 42, align: 'left', local: t - 58.4 });
    drawRich(ctx, '{mink:y′ = y}', 1540, 634, { size: 42, align: 'left', local: t - 78.3 });
    drawRich(ctx, '{mink:t′ = t}', 1800, 634, { size: 42, align: 'right', local: t - 79.0 });
    const kn = P(t, 55.3, 55.8), tau = Math.max(0, tau3(t)), xq = Math.round(V * tau * 100) / 100;
    ctx.save(); ctx.globalAlpha *= kn;
    drawRich(ctx, '{mink:t} =', 1180, 692, { size: 34, align: 'left' });
    fixedNum(ctx, fmtN(tau, 2), 1340, 692, 36, C.ink); txt(ctx, 's', 1348, 692, { size: 30, align: 'left' });
    drawRich(ctx, '{mink:x} =', 1400, 692, { size: 34, align: 'left' });
    fixedNum(ctx, fmtN(xq, 2), 1566, 692, 36, C.ink); txt(ctx, 'm', 1574, 692, { size: 30, align: 'left' });
    drawRich(ctx, '{mink:x′} =', 1625, 692, { size: 34, align: 'left' });
    fixedNum(ctx, fmtN(xq - V * tau + 0, 2), 1772, 692, 36, C.g); txt(ctx, 'm', 1780, 692, { size: 30, align: 'left' });
    ctx.restore();
    drawRich(ctx, '{mink:v} = {x:5 m/s}{dim:, la velocità della nave}', 1490, 752, { size: 32, alpha: life(t, 58.6, 83.6, .4, .3) });
    drawRich(ctx, '{dim:in orizzontale:}  {x:5 m/s} − {x:5 m/s} = {g:0 m/s}', 1490, 752, { size: 32, local: t - 83.7 });
    ctx.restore();
  }
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    conFont(TITOLI, () => drawRich(ctx, 'principio di relatività galileiana', 1490, 574, { size: 34, weight: 600 }));
    drawRich(ctx, 'nessun esperimento nella stiva distingue\nla {g:quiete} dal {g:moto rettilineo uniforme}', 1490, 652, { size: 31, lh: 1.35, local: t - 88.8, stagger: .04 });
    drawRich(ctx, '{dim:Galileo,} {v:Dialogo sopra i due massimi}\n{v:sistemi del mondo} {dim:(1632)}', 1490, 744, { size: 30, lh: 1.25, local: t - 93.5, stagger: .03 });
    ctx.restore();
  }
  ctx.restore();
}

// 5 · in una frase (97,9–107,5)
function sceneFine(ctx, t) {
  if (t < 97.8) return;
  const al = 1 - P(t, 105.5, 106.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.1 });
    drawRich(ctx, 'In moto rettilineo uniforme, nella stiva\ntutto va come in porto.', W / 2, 290, { size: 66, weight: 600, local: t - 98.5, stagger: .09 });
  });
  const pills = [[490, 'da dentro:\ncaduta {g:dritta}'], [960, 'da riva:\nuna {v:parabola}'], [1430, '{mink:x′ = x − v·t}\n{mink:y′ = y},   {mink:t′ = t}']];
  pills.forEach(([x, s], i) => {
    const a = 100.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.5], ['pop', 8.4, .6],                               // il titolo, la stiva, 4,9 m
    ['tono', 12.8, 15.8, [.9, .87, .79, .65, .45, .2]], ['ding', 15.9],               // nave ferma: cade sul segno in 1 s
    ['pop', 16.6, .5],                                                                // la nave va a 5 m/s
    ['tono', 21.6, 24.6, [.9, .87, .79, .65, .45, .2]], ['ding', 24.7],               // nave in moto: sul segno, come in porto
    ['pop', 29.7, .6],                                                                // le due prove sono identiche
    ['soffio', 34.0],                                                                 // vista da riva
    ['tono', 39.6, 42.6, [.9, .87, .79, .65, .45, .2]], ['traccia', 39.6, 42.6], ['pop', 42.6, .3],   // la parabola
    ['pop', 43.5, .6], ['ding', 48.6],                                                // parte a 5 m/s; avanza 5 m, sul segno
    ['soffio', 53.2], ['tono', 53.4, 55.0, [.2, .45, .65, .79, .87, .9]],             // riavvolgo
    ['pop', 55.3, .5], ['pop', 58.4, .55],                                            // gli assi x e x′; x′ = x − v·t
    ['pop', 63.5, .5], ['tono', 63.6, 65.1, [.9, .88, .82, .73]],                     // a metà caduta: x′ = 0
    ['tono', 68.7, 70.2, [.73, .59, .41, .2]], ['ding', 70.2],                        // all'arrivo: x′ = 5 − 5 = 0
    ['pop', 78.3, .5], ['pop', 79.0, .55],                                            // y′ = y, t′ = t
    ['ding', 84.0],                                                                   // 5 m/s − 5 m/s = 0 m/s
    ['soffio', 88.6], ['pop', 88.8, .5],                                              // il principio di relatività
    ['soffio', 98.1], ['pop', 100.6, .5], ['pop', 101.1, .6], ['pop', 101.6, .7],     // in una frase
  ];
  return {
    titolo: 'Nella stiva della nave', durata: 107.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.9, 'dentro la stiva'], [33.9, 53.0, 'vista da riva'], [53.0, 88.3, 'le trasformazioni di Galileo'], [88.3, 97.8, 'il principio di relatività']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneDentro(ctx, t); scenePannello(ctx, t); sceneRiva(ctx, t); sceneFormule(ctx, t); sceneFine(ctx, t); },
  };
});

