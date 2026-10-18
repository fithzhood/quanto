'use strict';
/* Il cucchiaio che ti capovolge — lo specchio concavo: un pezzo di sfera di raggio R e centro C; i raggi paralleli all'asse,
   riflessi, passano per il fuoco F, a metà fra lo specchio e C (f = R/2). I tre raggi notevoli dalla punta dell'oggetto
   (parallelo → per F; per F → parallelo; per C → torna su se stesso). Oggetto a 60 cm con f = 20 cm: immagine reale,
   capovolta, più piccola, a 30 cm (il cucchiaio); oggetto a 10 cm, dentro la focale: immagine virtuale, dritta, doppia,
   a 20 cm dietro lo specchio (q = −20 cm: lo specchio per truccarsi). 1/p + 1/q = 1/f in tutti e due i casi.
   I raggi sono calcolati: ognuno parte dalla punta dell'oggetto, tocca l'arco dello specchio nel punto vero, e dopo la
   riflessione segue la sua regola (per F, parallelo, o all'indietro lungo la retta per C); l'immagine è dove dice la
   formula. È lo specchio ideale dei raggi vicini all'asse (la stessa approssimazione della formula): con questi numeri i
   raggi passano entro 5 px dall'immagine (campo `verifica`). 12,5 px per centimetro, oggetto alto 4 cm. Argomento: ottica. */
CVIDEO.registra('ottica/specchio-concavo', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, glowStroke, dashed, dot } = M;
  const TAU = Math.PI * 2;

const T_FINE = 86.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [17.1, 'felice'], [21.8, 'neutro'],
  [45.0, 'sorpreso'], [49.6, 'festa'], [54.2, 'neutro'], [58.8, 'felice'], [63.6, 'neutro'], [68.2, 'sorpreso'],
  [72.8, 'pensa'], [77.6, 'felice'], [82.0, 'neutro'], [89.3, 'felice'], [93.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Perché nel cucchiaio\nti vedi a testa in giù?'],
  [7.9, 12.2, 'L’interno del cucchiaio è\nuno specchio {v:concavo}.'],
  [12.4, 16.95, 'È un pezzo di sfera di raggio {mink:R}:\nil centro è {mink:C}.'],
  [17.1, 21.6, 'I raggi paralleli all’{v:asse}, riflessi,\npassano tutti per un punto…'],
  [21.8, 26.4, '…il {v:fuoco} {mink:F}, a metà strada:\nfocale {mink:f = R/2}.'],
  [26.6, 31.0, 'L’oggetto: una freccia a 60 cm.\nLa focale è 20 cm.'],
  [31.2, 35.6, 'Raggio 1: {x:parallelo} all’asse,\npoi passa per il fuoco.'],
  [35.8, 40.2, 'Raggio 2: passa per il fuoco,\npoi torna {v:parallelo}.'],
  [40.4, 44.8, 'Raggio 3: passa per {mink:C} e torna\nindietro su se stesso.'],
  [45.0, 49.4, 'Si incontrano davanti allo specchio:\nla punta dell’{v:immagine}.'],
  [49.6, 54.0, 'Immagine {g:reale}, capovolta e più\npiccola: ecco il cucchiaio!'],
  [54.2, 58.6, '{mink:p} è la distanza dell’oggetto,\n{mink:q} quella dell’immagine.'],
  [58.8, 63.4, '{mink:1/p + 1/q = 1/f}:\ncon 60 e 30 {g:torna}.'],
  [63.6, 68.0, 'Ora avvicino l’oggetto a 10 cm:\ndentro la focale.'],
  [68.2, 72.6, 'I raggi riflessi si {r:allargano}: davanti\nallo specchio non si incontrano.'],
  [72.8, 77.4, 'I loro prolungamenti sì, dietro: immagine\n{v:virtuale}, dritta e più grande.'],
  [77.6, 81.8, 'È lo specchio per {g:truccarsi}:\nti vedi ingrandito.'],
  [82.0, 86.6, 'La formula vale ancora, con {mink:q}\n{r:negativa}: −20 cm, virtuale.'],
  [89.3, 95.1, 'Da lontano ti capovolge;\nda vicino ti ingrandisce.'],
];

// ---------- lo specchio: 12,5 px per cm, f = 20 cm, R = 40 cm ----------
const U = 12.5, VX = 960, AY = 440, FOC = 20, RR = 2 * FOC, HO = 4;
const RP = RR * U, CC = [VX - RP, AY], FF = [VX - FOC * U, AY];
const HM = 215, AMAX = Math.asin(HM / RP);              // mezza apertura dello specchio, in px e in angolo
const XFINE = 1270, X0 = 130, YMIN = 128, YMAX = 785;
const pOgg = t => kf(t, [[63.8, 60], [65.8, 10]]);        // distanza dell'oggetto, cm
const qDi = p => 1 / (1 / FOC - 1 / p);                    // dalla formula
// il punto dell'arco toccato da un raggio che parte da A in direzione d (la radice verso lo specchio)
function sullArco(A, d) {
  const ox = A[0] - CC[0], oy = A[1] - CC[1], b = ox * d[0] + oy * d[1], c = ox * ox + oy * oy - RP * RP;
  const s = -b + Math.sqrt(b * b - c);
  return [A[0] + d[0] * s, A[1] + d[1] * s];
}
const norm = v => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
function finoAlBordo(p, d) {
  let k = 1e9;
  if (d[0] > 0) k = Math.min(k, (XFINE - p[0]) / d[0]); if (d[0] < 0) k = Math.min(k, (X0 - p[0]) / d[0]);
  if (d[1] > 0) k = Math.min(k, (YMAX - p[1]) / d[1]); if (d[1] < 0) k = Math.min(k, (YMIN - p[1]) / d[1]);
  return [p[0] + d[0] * k, p[1] + d[1] * k];
}
// i tre raggi notevoli dalla punta T dell'oggetto: [T, punto sull'arco, fine]; e i prolungamenti all'indietro
function costruzione(p) {
  const T = [VX - p * U, AY - HO * U], q = qDi(p);
  const Im = [VX - q * U, AY + HO * U * q / p];            // la punta dell'immagine (y verso il basso)
  const H1 = sullArco(T, [1, 0]), d1 = norm([FF[0] - H1[0], FF[1] - H1[1]]);
  const v2 = norm(p > FOC ? [FF[0] - T[0], FF[1] - T[1]] : [T[0] - FF[0], T[1] - FF[1]]);
  const H2 = sullArco(T, v2), d2 = [-1, 0];
  const v3 = norm(p > RR ? [CC[0] - T[0], CC[1] - T[1]] : [T[0] - CC[0], T[1] - CC[1]]);
  const H3 = sullArco(T, v3), d3 = [-v3[0], -v3[1]];
  return { T, Im, H: [H1, H2, H3], d: [d1, d2, d3], v: [[1, 0], v2, v3], reale: q > 0,
    r: [[T, H1, finoAlBordo(H1, d1)], [T, H2, finoAlBordo(H2, d2)], [T, H3, finoAlBordo(H3, d3)]] };
}

// ---------- aiutanti ----------
function raggio(ctx, pts, k, col, w = 4, al = 1) {
  if (k <= 0 || al <= 0.01) return;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  const fin = L[L.length - 1] * clamp(k);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
    if (m + 12 > fin || L[i] - L[i - 1] < 70) continue;
    const f = (m - L[i - 1]) / (L[i] - L[i - 1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, 1.1);
  }
  ctx.restore();
}
function freccia(ctx, x, y0, y1, col, al = 1, tratt = false) {   // oggetto e immagine: frecce verticali dall'asse
  if (al <= 0.01 || Math.abs(y1 - y0) < 4) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 7; ctx.lineCap = 'round';
  if (tratt) ctx.setLineDash([12, 10]);
  const su = y1 < y0 ? -1 : 1, sc = Math.abs(y1 - y0) < 40 ? .9 : 1.3;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 - su * 12 * sc); ctx.stroke(); ctx.setLineDash([]);
  arrowHead(ctx, [x, y1 + su * 2], su * Math.PI / 2, col, sc);
  ctx.restore();
}
function specchio(ctx, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il dorso tratteggiato, dalla parte che non riflette
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2;
  for (let a = -AMAX + .02; a <= AMAX; a += .045) {
    const x = CC[0] + RP * Math.cos(a), y = CC[1] + RP * Math.sin(a);
    ctx.beginPath(); ctx.moveTo(x + 3, y); ctx.lineTo(x + 19, y + 14); ctx.stroke();
  }
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(CC[0], CC[1], RP, -AMAX, AMAX); ctx.stroke();
  ctx.restore();
}
function asse(ctx, al, kC, kF) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, AY); ctx.lineTo(XFINE, AY); ctx.stroke();
  txt(ctx, 'asse', XFINE - 8, AY + 26, { size: 30, color: C.dim, align: 'right' });
  if (kC > 0) dot(ctx, CC, C.v, kC, 9);
  if (kF > 0) dot(ctx, FF, C.v, kF, 9);
  ctx.restore();
}
// i nomi di C e F su un fondino color carta: i raggi ci passano dietro
function nomi(ctx, al, kC, kF) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  [[CC, kC, '{mink:C}'], [FF, kF, '{mink:F}']].forEach(([Q, k, s]) => {
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(Q[0] - 24, AY - 66, 48, 50, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, Q[0], AY - 41, { size: 38, alpha: k });
  });
  ctx.restore();
}
function staffa(ctx, x0, x1, y, nome, col, al) {
  if (al <= 0.01 || Math.abs(x1 - x0) < 10) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  const a = Math.min(x0, x1), b = Math.max(x0, x1);
  ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.moveTo(a, y - 10); ctx.lineTo(a, y + 10); ctx.moveTo(b, y - 10); ctx.lineTo(b, y + 10); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.fillRect((a + b) / 2 - 20, y - 22, 40, 44);
  drawRich(ctx, nome, (a + b) / 2, y, { size: 36 });
  ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il cucchiaio che ti capovolge', W / 2, 180, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// il banco: scheda, asse, specchio, C e F (7,5–86,8)
function scenaBanco(ctx, t) {
  if (t < 7.4 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE, .6, .5);
  card(ctx, 110, 110, 1180, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  asse(ctx, P(t, 8.0, 8.6), P(t, 12.6, 13.1, E.back), P(t, 21.9, 22.4, E.back));
  specchio(ctx, P(t, 7.9, 8.5));
  txt(ctx, 'specchio', VX + 24, AY - HM - 24, { size: 30, color: C.x, alpha: P(t, 8.4, 8.9) });
  // il raggio della sfera
  const kR = life(t, 12.6, 21.6, .5, .5);
  if (kR > 0) {
    const a = -.32, Q = [CC[0] + RP * Math.cos(a), CC[1] + RP * Math.sin(a)];
    dashed(ctx, CC, Q, C.v, P(t, 12.8, 13.8), kR);
    drawRich(ctx, '{mink:R}', lerp(CC[0], Q[0], .5) - 6, lerp(CC[1], Q[1], .5) - 30, { size: 38, alpha: kR * P(t, 13.4, 13.9) });
    ctx.save(); ctx.globalAlpha *= kR * .35; ctx.strokeStyle = css(C.v); ctx.lineWidth = 2; ctx.setLineDash([4, 10]);
    ctx.beginPath(); ctx.rect(114, 114, 1172, 682); ctx.clip();   // il resto della sfera, dentro la scheda
    ctx.beginPath(); ctx.arc(CC[0], CC[1], RP, AMAX + .05, TAU - AMAX - .05); ctx.stroke(); ctx.restore();
  }
  // la focale: a metà fra lo specchio e C
  const kf2 = life(t, 22.4, 26.4, .5, .4);
  if (kf2 > 0) {
    ctx.save(); ctx.globalAlpha *= kf2; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    const y = AY + 120, xa = CC[0] + Math.sqrt(RP * RP - 120 * 120);   // la freccia arriva sull'arco
    ctx.beginPath(); ctx.moveTo(FF[0] + 6, y); ctx.lineTo(xa - 6, y); ctx.stroke();
    arrowHead(ctx, [FF[0] + 2, y], Math.PI, C.v, .8); arrowHead(ctx, [xa - 2, y], 0, C.v, .8);
    drawRich(ctx, '{mink:f}', (FF[0] + VX) / 2, y + 30, { size: 40 });
    ctx.beginPath(); ctx.moveTo(CC[0] + 6, y); ctx.lineTo(FF[0] - 6, y); ctx.stroke();
    arrowHead(ctx, [CC[0] + 2, y], Math.PI, C.v, .8); arrowHead(ctx, [FF[0] - 2, y], 0, C.v, .8);
    drawRich(ctx, '{mink:f}', (CC[0] + FF[0]) / 2, y + 30, { size: 40 });
    ctx.restore();
  }
  ctx.restore();
}

// 1 · i raggi paralleli e il fuoco (17–26,4)
const PARALLELI = [-100, -50, 0, 50, 100];
function scenaFuoco(ctx, t) {
  if (t < 17 || t > 26.6) return;
  const al = 1 - P(t, 25.9, 26.4);
  ctx.save(); ctx.globalAlpha *= al;
  PARALLELI.forEach((h, i) => {
    const A = [X0 + 20, AY + h], H = sullArco(A, [1, 0]), d = norm([FF[0] - H[0], FF[1] - H[1]]);
    const fine = [H[0] + d[0] * 420, H[1] + d[1] * 420];
    raggio(ctx, [A, H, fine], P(t, 17.3 + .12 * i, 19.8 + .12 * i, E.lin), C.y, 4);
  });
  // la formula vale per lo specchio ideale: i raggi sono fatti passare tutti per F (vicini all'asse lo fanno davvero)
  const kc = life(t, 17.2, 26.4, .4, .4);
  if (kc > 0) {
    const s = '{dim:specchio ideale: raggi vicini all’asse}', w = M.richW(ctx, s, 30) + 22;
    ctx.save(); ctx.globalAlpha *= kc * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(520 - w / 2, 128, w, 44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, 520, 150, { size: 30, alpha: kc });
  }
  ctx.restore();
}

// 2–3 · l'oggetto, i tre raggi, l'immagine (26,4–86,8)
const fermo = t => 1 - life(t, 63.6, 66.0, .25, .25);       // mentre l'oggetto si sposta, niente misure
function scenaCostruzione(ctx, t) {
  if (t < 26.4 || t > T_FINE + .3) return;
  const al = life(t, 26.6, T_FINE, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  const p = pOgg(t), G = costruzione(p), vicino = p < FOC;
  const aR = clamp(1 - P(t, 63.6, 64.0) + P(t, 68.2, 68.5));
  const kk = vicino ? [0, 1, 2].map(() => P(t, 68.4, 70.0, E.lin))
    : [P(t, 31.4, 33.2, E.lin), P(t, 36.0, 37.8, E.lin), P(t, 40.6, 42.4, E.lin)];
  // dentro la focale: il raggio 2 viene come dal fuoco, il raggio 3 come da C
  if (vicino) { dashed(ctx, FF, G.T, C.y, kk[1], aR * .8); dashed(ctx, CC, G.T, C.y, kk[2], aR * .8); }
  // i prolungamenti dietro lo specchio, fino all'immagine virtuale
  const kp = P(t, 73.0, 74.2) * aR;
  if (vicino && kp > 0) G.H.forEach((H, i) => {
    const d = G.d[i], s = (G.Im[0] - H[0]) / -d[0];
    dashed(ctx, H, [H[0] - d[0] * s, H[1] - d[1] * s], C.v, kp, .9);
  });
  G.r.forEach((r, i) => raggio(ctx, r, kk[i], C.y, 4, aR));
  // l'oggetto
  freccia(ctx, G.T[0], AY, G.T[1], C.ink, P(t, 26.8, 27.4));
  txt(ctx, 'oggetto', G.T[0], vicino ? AY + 40 : G.T[1] - 46, { size: 30, color: C.dim, alpha: P(t, 27.0, 27.5) * fermo(t) });
  // l'immagine: reale (piena) o virtuale (tratteggiata)
  const kI = P(t, 45.2, 45.9) * (1 - P(t, 63.6, 64.0)) + P(t, 73.6, 74.3);
  if (kI > 0) {
    dot(ctx, G.Im, C.v, Math.min(1, kI), 8);
    freccia(ctx, G.Im[0], AY, G.Im[1], C.v, kI, !G.reale);
    txt(ctx, 'immagine', G.Im[0], G.Im[1] + (G.reale ? 46 : -38), { size: 30, color: C.v, alpha: kI });
  }
  // p e q sul disegno
  staffa(ctx, G.T[0], VX, 735, '{mink:p}', C.ink, P(t, 54.4, 54.9) * fermo(t));
  const kq = P(t, 54.4, 54.9) * (1 - P(t, 63.6, 64.0)) + P(t, 82.2, 82.7);
  staffa(ctx, VX, G.Im[0], 772, '{mink:q}', C.v, kq * fermo(t));
  ctx.restore();
}
function scenaNomi(ctx, t) {
  if (t < 12.4 || t > T_FINE + .3) return;
  nomi(ctx, life(t, 7.6, T_FINE, .6, .5), P(t, 12.6, 13.1), P(t, 21.9, 22.4));
}

// la scheda dei numeri, a destra
const CASI = [
  { da: 49.6, a: 63.6, testo: 'immagine {g:reale},\ncapovolta, più piccola', conto: ['60', '30'], dc: 58.9 },
  { da: 72.8, a: T_FINE, testo: 'immagine {v:virtuale},\ndritta, più grande', conto: ['10', '(−20)'], dc: 82.2 },
];
function cucchiaio(ctx, al) {   // il cucchiaio visto di fronte, con la goccia capovolta dentro
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const cx = 1565, cy = 360;
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.beginPath(); ctx.roundRect(cx - 20, cy + 140, 40, 190, 20); ctx.fill();
  ctx.fillStyle = css(mix(C.x, C.paper, .78)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, cy, 120, 165, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // la goccia a testa in giù
  ctx.save(); ctx.translate(cx, cy + 10); ctx.scale(1, -1);
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.moveTo(0, -62); ctx.bezierCurveTo(22, -30, 40, -6, 40, 18); ctx.arc(0, 18, 40, 0, Math.PI); ctx.bezierCurveTo(-40, -6, -22, -30, 0, -62); ctx.fill();
  ctx.restore();
  ctx.restore();
}
function scenaScheda(ctx, t) {
  if (t < 7.6 || t > T_FINE + .3) return;
  const al = life(t, 7.8, T_FINE, .5, .5);
  card(ctx, 1320, 110, 490, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  const kc = 1 - P(t, 26.2, 26.6);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, 'il cucchiaio', 1565, 165, { size: 38, weight: 600 }));
    cucchiaio(ctx, P(t, 8.2, 8.8));
    txt(ctx, 'dentro: specchio concavo', 1565, 745, { size: 30, color: C.x, alpha: P(t, 9.4, 9.9) });
    ctx.restore();
  }
  const km = P(t, 26.6, 27.0);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km;
    conFont(TITOLI, () => drawRich(ctx, 'le misure', 1565, 170, { size: 38, weight: 600 }));
    const p = pOgg(t), q = qDi(p), kn = fermo(t);
    const riga = (nome, val, y, col, a) => { if (a <= 0.01) return; drawRich(ctx, nome, 1360, y, { size: 38, align: 'left', alpha: a }); txt(ctx, val, 1770, y, { size: 40, weight: 600, color: col, align: 'right', alpha: a }); };
    riga('{mink:f}{dim:  focale}', '20 cm', 245, C.ink, 1);
    riga('{mink:p}{dim:  oggetto}', Math.round(p) + ' cm', 305, C.ink, kn);
    const kq = P(t, 49.8, 50.3) * (1 - P(t, 63.6, 64.0)) + P(t, 82.2, 82.7);
    riga('{mink:q}{dim:  immagine}', (q < 0 ? '−' : '') + Math.round(Math.abs(q)) + ' cm', 365, C.v, Math.min(1, kq) * kn);
    CASI.forEach(K => {
      const k = life(t, K.da, K.a, .4, .4); if (k <= 0) return;
      drawRich(ctx, K.testo, 1565, 460, { size: 32, lh: 1.35, alpha: k });
      const kc2 = life(t, K.dc, K.a, .4, .4);
      if (kc2 > 0) drawSeq(ctx, [{ num: '{mink:1}', den: '{mink:' + K.conto[0] + '}' }, '{mink:+}', { num: '{mink:1}', den: '{mink:' + K.conto[1] + '}' }, '{mink:=}', { num: '{mink:1}', den: '{mink:20}' }], 1565, 705, 42, { alpha: kc2 });
    });
    const kf2 = P(t, 59.0, 59.5);
    if (kf2 > 0) drawSeq(ctx, [{ num: '{mink:1}', den: '{mink:p}' }, '{mink:+}', { num: '{mink:1}', den: '{mink:q}' }, '{mink:=}', { num: '{mink:1}', den: '{mink:f}' }], 1565, 580, 50, { local: t - 59.0 });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 96.6, 97.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Lo specchio concavo raccoglie\nla luce nel fuoco e forma immagini.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'oltre il fuoco: {g:reale}\ne capovolta'], [960, 'dentro il fuoco: {v:virtuale},\ndritta e ingrandita'], [1430, '{mink:1/p + 1/q = 1/f}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 2 ? 40 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): quanto passano lontano dall'immagine i raggi calcolati, e lo scarto dalla legge della riflessione esatta
  const verifica = [60, 10].map(p => {
    const G = costruzione(p), q = qDi(p);
    const dist = G.H.map((H, i) => { const d = G.d[i], v = [G.Im[0] - H[0], G.Im[1] - H[1]]; return +Math.abs(v[0] * d[1] - v[1] * d[0]).toFixed(2); });
    const scarto = G.H.map((H, i) => {   // angolo fra il raggio disegnato e quello della riflessione esatta, in gradi
      const n = [(CC[0] - H[0]) / RP, (CC[1] - H[1]) / RP], v = G.v[i], k = v[0] * n[0] + v[1] * n[1], e = [v[0] - 2 * k * n[0], v[1] - 2 * k * n[1]];
      return +(Math.acos(clamp(e[0] * G.d[i][0] + e[1] * G.d[i][1], -1, 1)) * 180 / Math.PI).toFixed(2);
    });
    return { p, q: +q.toFixed(3), immagineCm: +((AY - G.Im[1]) / U).toFixed(3), distPx: dist, scartoGradi: scarto, conto: 1 / p + 1 / q - 1 / FOC };
  });
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 7.9, 8.6], ['pop', 8.5, .5],                         // lo specchio, l'asse, il cucchiaio
    ['pop', 12.9, .5], ['traccia', 12.8, 13.8],                                       // il centro C, il raggio R
    ['traccia', 17.3, 20.3],                                                          // i raggi paralleli
    ['pop', 22.2, .6], ['traccia', 22.4, 22.9],                                       // il fuoco, la focale
    ['soffio', 26.4], ['pop', 27.1, .55],                                             // le misure, l'oggetto
    ['traccia', 31.4, 33.2], ['traccia', 36.0, 37.8], ['traccia', 40.6, 42.4],        // i tre raggi
    ['pop', 45.6, .6],                                                                // l'immagine
    ['pop', 50.1, .5],                                                                // q = 30 cm
    ['traccia', 54.4, 54.9],                                                          // p e q sul disegno
    ['pop', 59.2, .55], ['ding', 59.6],                                               // la formula torna
    ['tono', 63.8, 65.8, [1, .98, .88, .58, .29, .18, .17]],                          // l'oggetto si avvicina a 10 cm
    ['traccia', 68.4, 70.0],                                                          // i raggi si allargano
    ['traccia', 73.0, 74.2], ['pop', 74.0, .6], ['ding', 77.8],                       // i prolungamenti: immagine virtuale
    ['pop', 82.5, .5],                                                                // q = -20 cm
    ['soffio', 86.9], ['pop', 88.4, .5], ['pop', 88.9, .6], ['pop', 89.4, .7],        // in una frase
  ];
  return {
    titolo: 'Il cucchiaio che ti capovolge', durata: 97.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.4, 'il fuoco'], [26.4, 63.4, 'da lontano'], [63.4, 86.6, 'da vicino']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBanco(ctx, t); scenaFuoco(ctx, t); scenaCostruzione(ctx, t); scenaNomi(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
