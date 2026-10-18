'use strict';
/* La molla misura le forze — la legge di Hooke F = k·x nel tratto elastico, il limite elastico, il dinamometro. Argomento: forze. */
CVIDEO.registra('forze/hooke', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [87.6, 190], [88.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [87.6, 1050], [88.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [87.6, 2.2], [88.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [87.6, 2], [88.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [87.6, -1.5], [88.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.0, 'sorpreso'], [16.5, 'neutro'],
  [26.8, 'felice'], [30.7, 'neutro'], [35.3, 'festa'], [38.9, 'neutro'], [49.1, 'pensa'], [54.2, 'neutro'],
  [58.1, 'sorpreso'], [62.0, 'neutro'], [66.1, 'sorpreso'], [69.8, 'pensa'], [74.6, 'neutro'], [79.1, 'felice'],
  [83.3, 'neutro'], [89.9, 'felice'], [93.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Come si misura una forza?\nCon una molla.'],
  [7.9, 11.9, 'Una molla appesa, a riposo:\nqui finisce, sullo zero.'],
  [12.0, 16.4, 'Appendo un peso da 1 N:\nsi allunga di 4 cm.'],
  [16.5, 20.9, '{mx:x} è l’{x:allungamento}: quanto è più\nlunga rispetto al riposo.'],
  [21.0, 23.8, 'Con 2 N, 8 cm…'],
  [23.9, 26.7, '…con 3 N, 12 cm…'],
  [26.8, 30.6, '…con 4 N, 16 cm: forza doppia,\nallungamento {g:doppio}.'],
  [30.7, 35.2, 'Sul grafico i punti stanno su una\n{v:retta} che passa per l’origine.'],
  [35.3, 38.8, 'È la legge di {v:Hooke}:\n{my:F} = {mink:k·}{mx:x}.'],
  [38.9, 43.9, '{mink:k} è la {v:costante elastica}, in N/m:\ndice quanto è dura la molla.'],
  [44.0, 49.0, 'Con {mink:k} = 25 N/m, 1 N la allunga\ndi 0,04 m: 4 cm.'],
  [49.1, 54.1, 'Una molla più dura ha {mink:k} più grande:\nsul grafico, una retta più {g:ripida}.'],
  [54.2, 58.0, 'Aggiungo pesi: 5 N, 6 N…\nancora sulla retta.'],
  [58.1, 61.9, 'Ma se la tiro {r:troppo}: 7 N, 8 N…'],
  [62.0, 66.0, '…si allunga molto di più:\ni punti {r:escono dalla retta}.'],
  [66.1, 69.7, 'Tolgo tutti i pesi:\n{r:non torna} allo zero!'],
  [69.8, 74.4, 'Si è deformata per sempre. Hooke vale\nsolo nel tratto {g:elastico}.'],
  [74.6, 79.0, 'Il {v:dinamometro} è una molla\ncon la scala già in newton.'],
  [79.1, 83.2, 'Le tacche sono {g:equidistanti}:\nforza doppia, allungamento doppio.'],
  [83.3, 87.5, 'Ci appendo un sasso:\nil suo peso è 3,5 N.'],
  [89.9, 95.0, 'Finché resta elastica, la molla\nsi allunga come la forza.'],
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
function disegnaMolla(ctx, x, y0, y1, n = 16, larga = 22) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + 10);
  const h = (y1 - y0 - 20) / n;
  for (let i = 0; i < n; i++) ctx.lineTo(x + (i % 2 ? -larga : larga), y0 + 10 + h * (i + .5));
  ctx.lineTo(x, y1 - 10); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
}
// la molla: k = 25 N/m, cioè 4 cm per newton finché è elastica (fino a 6 N); oltre si allunga di più,
// e scaricata torna indietro lungo una retta parallela: le restano 44 − 4·8 = 12 cm
const K = 25, F_LIM = 6;
const XEQ = [0, 4, 8, 12, 16, 20, 24, 31, 44];      // allungamento in cm con n pesi da 1 N
const X_RES = 44 - 8 * 100 / K;                      // 12 cm
const EVENTI = [[12.4, 1], [21.2, 2], [24.1, 3], [27.0, 4], [54.5, 5], [56.1, 6], [58.3, 7], [59.9, 8], [66.3, 0]];
const quanti = t => { let n = 0; for (const [te, k] of EVENTI) if (t >= te) n = k; return n; };
// oscillazione smorzata verso il nuovo equilibrio: ω = √(k/m) con m = n · 0,102 kg
function allungamento(t) {
  let prima = 0, ora = 0, t0 = -99, n = 0;
  for (const [te, k] of EVENTI) {
    if (t < te) break;
    prima = ora; n = k; t0 = te;
    ora = te >= 66.3 ? X_RES : XEQ[k];
  }
  if (t0 < 0) return 0;
  const tau = t - t0, m = Math.max(n, .3) * .102, om = Math.sqrt(K / m), g = n ? 4 : 9;
  const omd = Math.sqrt(Math.max(om * om - g * g, 1));
  return ora + (prima - ora) * Math.exp(-g * tau) * (Math.cos(omd * tau) + g / omd * Math.sin(omd * tau));
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La molla misura le forze', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–2 · la molla col righello (7,5–74,5)
const SPR = [110, 110, 640, 680], SX = 400, YT = 135, L0 = 170, YR = YT + L0, PXC = 7;   // 7 px per cm
function sceneMolla(ctx, t) {
  if (t < 7.5 || t > 74.8) return;
  const al = life(t, 7.6, 74.6, .6, .5);
  card(ctx, ...SPR, al);
  ctx.save(); ctx.globalAlpha *= al;
  // supporto e righello in cm, a sinistra della molla
  ctx.fillStyle = css(C.dim); ctx.fillRect(SX - 70, YT - 12, 140, 12);
  const xr = SX - 110;
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xr, YR); ctx.lineTo(xr, YR + 45 * PXC); ctx.stroke();
  for (let c = 0; c <= 45; c++) { const y = YR + c * PXC, l = c % 10 === 0 ? 22 : c % 5 === 0 ? 15 : 8; ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(xr + l, y); ctx.stroke(); }
  for (let c = 0; c <= 40; c += 10) txt(ctx, String(c), xr - 12, YR + c * PXC, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'cm', xr - 12, YR + 45 * PXC + 8, { size: 30, color: C.dim, align: 'right' });
  dashed(ctx, [xr - 4, YR], [SX + 60, YR], C.dim, 1, P(t, 8.4, 9.0) * .8);
  const x = allungamento(t), ye = YR + x * PXC;
  disegnaMolla(ctx, SX, YT, ye);
  // i pesi da 1 N: ognuno compare poco prima di essere lasciato
  const via = 1 - P(t, 66.0, 66.3);
  let nv = 0, kl = 1;
  for (const [te, k] of EVENTI) if (k && t >= te - .45) { nv = k; kl = P(t, te - .45, te - .1); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  if (nv && via > 0) { ctx.beginPath(); ctx.moveTo(SX, ye); ctx.lineTo(SX, ye + 14); ctx.stroke(); }
  if (via > 0) for (let i = 0; i < nv; i++) {
    ctx.save(); ctx.globalAlpha *= via * (i === nv - 1 ? kl : 1);
    ctx.fillStyle = css(i >= F_LIM ? mix(C.r, C.paper, .55) : mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(SX - 42, ye + 14 + i * 15, 84, 13, 4); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // l'indice sul righello e l'allungamento x, in azzurro
  ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(xr + 4, ye); ctx.lineTo(SX - 26, ye); ctx.stroke(); ctx.setLineDash([]);
  const kx = P(t, 16.6, 17.1);
  if (kx > 0 && x > 1.5) {
    ctx.save(); ctx.globalAlpha *= kx; ctx.strokeStyle = css(C.x); ctx.lineWidth = 9; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(xr + 30, YR); ctx.lineTo(xr + 30, ye); ctx.stroke();
    // con x piccolo l'etichetta sta sotto l'indice, non schiacciata fra i due tratteggi
    drawRich(ctx, '{mx:x}', x * PXC < 50 ? xr + 36 : xr + 54, x * PXC < 50 ? ye + 30 : (YR + ye) / 2, { size: 40 });
    ctx.restore();
  }
  // la forza sulla molla: il peso dei dischi, 20 px per newton
  const n = quanti(t);
  if (n && via > 0) {
    ctx.save(); ctx.globalAlpha *= via;
    freccia(ctx, [SX + 72, ye], [SX + 72, ye + n * 20], C.y);
    drawRich(ctx, '{my:F} = ' + n + ' N', SX + 94, ye + n * 10 + 4, { size: 36, align: 'left' });
    ctx.restore();
  }
  // scaricata: le restano 12 cm
  const kr = life(t, 66.9, 74.6, .4, .5);
  if (kr > 0) drawRich(ctx, '{r:resta allungata}\n{r:di 12 cm}', SX + 60, ye + 6, { size: 32, align: 'left', alpha: kr });
  ctx.restore();
}

// la tabella e il grafico F–x
const GR = [800, 110, 1010, 680], OX = 900, OY = 730, SXC = 17, SYF = 38;   // 17 px per cm, 38 px per newton
const gp = (x, F) => [OX + x * SXC, OY - F * SYF];
function sceneGrafico(ctx, t) {
  if (t < 7.5 || t > 74.8) return;
  const al = life(t, 7.9, 74.6, .6, .5);
  if (al <= 0) return;
  card(ctx, ...GR, al);
  ctx.save(); ctx.globalAlpha *= al;
  // la tabella: una colonna per ogni peso aggiunto
  drawRich(ctx, '{my:F} (N)', 830, 172, { size: 36, align: 'left' });
  drawRich(ctx, '{mx:x} (cm)', 830, 232, { size: 36, align: 'left' });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(830, 202); ctx.lineTo(1780, 202); ctx.stroke();
  EVENTI.forEach(([te, k]) => {
    if (!k) return;
    const kk = P(t, te + .9, te + 1.3); if (kk <= 0) return;
    const xc = 1045 + (k - 1) * 92, fuori = k > F_LIM;
    txt(ctx, String(k), xc, 172, { size: 36, color: fuori ? C.r : C.y, alpha: kk });
    txt(ctx, String(XEQ[k]), xc, 232, { size: 36, color: fuori ? C.r : C.x, alpha: kk });
  });
  // il tratto elastico
  const ke = life(t, 70.0, 74.6, .5, .4);
  if (ke > 0) {
    ctx.fillStyle = css(C.g, .1 * ke); const [ax, ay] = gp(0, 9.3), [bx] = gp(24, 0); ctx.fillRect(ax, ay, bx - ax, OY - ay);
    drawRich(ctx, '{g:tratto elastico}', (ax + bx) / 2 + 20, OY - 8.4 * SYF, { size: 30, alpha: ke });
  }
  // assi
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX + 49 * SXC, OY); ctx.moveTo(OX, OY); ctx.lineTo(OX, OY - 9.6 * SYF); ctx.stroke();
  arrowHead(ctx, [OX + 49 * SXC + 6, OY], 0, C.ink); arrowHead(ctx, [OX, OY - 9.6 * SYF - 6], -Math.PI / 2, C.ink);
  for (let c = 10; c <= 40; c += 10) { const [x] = gp(c, 0); ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, OY - 7); ctx.lineTo(x, OY + 7); ctx.stroke(); txt(ctx, String(c), x, OY + 30, { size: 29, color: C.dim }); }
  for (let f = 2; f <= 8; f += 2) { const [, y] = gp(0, f); ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(OX - 7, y); ctx.lineTo(OX + 7, y); ctx.stroke(); txt(ctx, String(f), OX - 16, y, { size: 29, color: C.dim, align: 'right' }); }
  drawRich(ctx, '{mx:x} (cm)', OX + 49 * SXC, OY - 34, { size: 34, align: 'right' });
  drawRich(ctx, '{my:F} (N)', OX + 18, OY - 9.6 * SYF + 4, { size: 34, align: 'left' });
  // la retta di Hooke, e quella di una molla più dura
  const kl = P(t, 30.9, 32.1);
  if (kl > 0) { ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; const a = gp(0, 0), b = gp(36 * kl, 9 * kl); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  drawRich(ctx, '{my:F} {mink:= k·}{mx:x}', 1560, 625, { size: 50, local: t - 35.5 });
  const kn = P(t, 44.2, 44.7);
  if (kn > 0) drawRich(ctx, '{mink:k} = 25 N/m', gp(36, 9)[0] + 18, gp(36, 9)[1] - 14, { size: 32, align: 'left', alpha: kn });
  const kd = life(t, 49.3, 57.9, .9, .5);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.setLineDash([12, 9]);
    const a = gp(0, 0), b = gp(18 * P(t, 49.3, 50.3), 9 * P(t, 49.3, 50.3)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    drawRich(ctx, '{mink:k} = 50 N/m', 1185, 440, { size: 32, align: 'left', alpha: P(t, 50.1, 50.6) });
    ctx.restore();
  }
  // i punti misurati
  EVENTI.forEach(([te, k]) => {
    if (!k) return;
    const kk = P(t, te + .9, te + 1.3, E.back); if (kk <= 0) return;
    M.dot(ctx, gp(XEQ[k], k), k > F_LIM ? C.r : C.y, kk, 10);
  });
  // scaricata: torna lungo una retta parallela e si ferma a 12 cm
  const ku = P(t, 66.4, 67.2);
  if (ku > 0) { dashed(ctx, gp(44, 8), gp(X_RES, 0), C.r, ku, 1); M.dot(ctx, gp(X_RES, 0), C.r, P(t, 67.0, 67.4, E.back), 10); }
  ctx.restore();
}

// 3 · il dinamometro (74,5–87,6): tacche ogni newton a 30 px, il sasso da 3,5 N lasciato a 83,7
const DX = 760, D0 = 230, PXN = 30, T_SASSO = 83.7, F_SASSO = 3.5;
function indice(t) {
  if (t < T_SASSO) return 0;
  const tau = t - T_SASSO, g = 4.5, om = 8;   // smorzata, come una molla vera
  return F_SASSO * (1 - Math.exp(-g * tau) * (Math.cos(om * tau) + g / om * Math.sin(om * tau)));
}
function sceneDinamometro(ctx, t) {
  if (t < 74.2 || t > 87.9) return;
  const al = life(t, 74.7, 87.6, .6, .5);
  card(ctx, 360, 110, 1200, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const f = indice(t), yi = D0 + f * PXN;
  // l'anello, il tubo, la scala
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(DX, 150, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .82)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(DX - 50, 166, 100, 400, 18); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  for (let n = 0; n <= 10; n++) { const y = D0 + n * PXN; ctx.beginPath(); ctx.moveTo(DX + 50, y); ctx.lineTo(DX + 72, y); ctx.stroke(); if (n % 2 === 0) txt(ctx, String(n), DX + 84, y, { size: 30, color: C.dim, align: 'left' }); }
  for (let n = 0; n < 10; n++) { const y = D0 + (n + .5) * PXN; ctx.beginPath(); ctx.moveTo(DX + 50, y); ctx.lineTo(DX + 62, y); ctx.stroke(); }
  txt(ctx, 'N', DX + 84, D0 - 42, { size: 30, color: C.dim, align: 'left' });
  disegnaMolla(ctx, DX, 176, yi, 12, 18);
  // l'indice e l'asta del gancio
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(DX - 44, yi); ctx.lineTo(DX + 60, yi); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(DX, yi); ctx.lineTo(DX, yi + 330); ctx.stroke();
  // il sasso
  const ks = P(t, T_SASSO - .45, T_SASSO - .1);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(mix(C.dim, C.paper, .4)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    const y = yi + 330;
    ctx.beginPath(); ctx.moveTo(DX - 50, y + 20); ctx.quadraticCurveTo(DX - 60, y - 6, DX - 10, y + 2); ctx.quadraticCurveTo(DX + 40, y - 8, DX + 56, y + 24);
    ctx.quadraticCurveTo(DX + 64, y + 66, DX + 6, y + 70); ctx.quadraticCurveTo(DX - 58, y + 72, DX - 50, y + 20); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // tacche equidistanti: 2 N e 4 N, un tratto e il doppio
  const kq = life(t, 79.3, 83.3, .5, .4);
  if (kq > 0) {
    ctx.save(); ctx.globalAlpha *= kq; ctx.lineCap = 'butt';
    for (const [n, x] of [[4, DX - 80], [2, DX - 150]]) {
      ctx.strokeStyle = css(C.x); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, D0); ctx.lineTo(x, D0 + n * PXN); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 10, D0 + n * PXN); ctx.lineTo(x + 10, D0 + n * PXN); ctx.stroke();
      drawRich(ctx, '{y:' + n + ' N}', x - 20, D0 + n * PXN + 6, { size: 32, align: 'right' });
    }
    ctx.restore();
  }
  // la lettura
  drawRich(ctx, '{dim:segna}', 1300, 330, { size: 40, alpha: P(t, 75.2, 75.7) });
  ctx.save(); ctx.globalAlpha *= P(t, 75.2, 75.7);
  fixedNum(ctx, fmtN(f, 1), 1320, 420, 80, C.y); txt(ctx, 'N', 1338, 420, { size: 80, color: C.y, align: 'left' });
  ctx.restore();
  drawRich(ctx, 'scala a tacche {g:uguali}:\nil dinamometro {g:usa Hooke}', 1300, 600, { size: 34, local: t - 79.6, lh: 1.4 });
  ctx.restore();
}

// 4 · in una frase (87,6–97,5)
function sceneFine(ctx, t) {
  if (t < 87.5) return;
  const al = 1 - P(t, 95.6, 96.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.8 });
    drawRich(ctx, 'Nel tratto elastico l’allungamento\nè proporzionale alla forza.', W / 2, 290, { size: 70, weight: 600, local: t - 88.2, stagger: .09 });
  });
  const pills = [[490, '{my:F} = {mink:k·}{mx:x}'], [960, '{mink:k} in N/m:\nquanto è {g:dura}'], [1430, 'oltre il limite\n{r:si deforma}']];
  pills.forEach(([x, s], i) => {
    const a = 90.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 44, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.4, 9.0],                                           // la molla a riposo, lo zero
    ['tono', 12.4, 13.2, [1, .93, .87, .9, .93, .92, .9, .91, .91]], ['pop', 13.3, .4],     // 1 N: 4 cm, il punto
    ['pop', 16.6, .4],                                                                // l'allungamento x
    ['tono', 21.2, 22.0, [.91, .87, .81, .79, .8, .82, .83, .82, .82]], ['pop', 22.1, .45],   // 2 N: 8 cm
    ['tono', 24.1, 24.9, [.82, .79, .75, .72, .71, .71, .72, .73, .73]], ['pop', 25.0, .5],   // 3 N: 12 cm
    ['tono', 27.0, 27.8, [.73, .71, .67, .64, .62, .62, .63, .63, .64]], ['pop', 27.9, .55],  // 4 N: 16 cm
    ['traccia', 30.9, 32.1], ['pop', 35.5, .6],                                       // la retta, F = k·x
    ['pop', 44.2, .45],                                                               // k = 25 N/m
    ['traccia', 49.3, 50.3], ['pop', 50.1, .5],                                       // la molla più dura: 50 N/m
    ['tono', 54.5, 55.3, [.64, .62, .59, .56, .54, .54, .54, .54, .54]], ['pop', 55.4, .6],   // 5 N
    ['tono', 56.1, 56.9, [.55, .53, .5, .48, .46, .45, .45, .45, .45]], ['pop', 57.0, .65],   // 6 N
    ['tono', 58.3, 59.1, [.45, .43, .39, .35, .32, .3, .29, .29, .29]], ['pop', 59.2, .3],    // 7 N: fuori dalla retta
    ['tono', 59.9, 60.7, [.3, .26, .19, .12, .06, .03, 0, 0, 0]], ['pop', 60.8, .25],         // 8 N: molto di più
    ['tono', 66.3, 66.9, [0, .96, .68, .73, .74, .72, .73]], ['traccia', 66.4, 67.2], ['pop', 67.0, .3],   // tolti i pesi: resta a 12 cm
    ['pop', 70.0, .5],                                                                // il tratto elastico
    ['soffio', 74.7], ['pop', 75.2, .4],                                              // il dinamometro, la lettura
    ['pop', 79.3, .45],                                                               // tacche equidistanti
    ['tono', 83.7, 84.5, [1, .9, .73, .62, .59, .61, .64, .66, .66]], ['ding', 84.6], // il sasso: 3,5 N
    ['soffio', 87.8], ['pop', 90.4, .5], ['pop', 90.9, .6], ['pop', 91.4, .7],        // in una frase
  ];
  return {
    titolo: 'La molla misura le forze', durata: 97.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 54.1, 'la legge di Hooke'], [54.1, 74.5, 'il limite elastico'], [74.5, 87.5, 'il dinamometro']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMolla(ctx, t); sceneGrafico(ctx, t); sceneDinamometro(ctx, t); sceneFine(ctx, t); },
  };
});
