'use strict';
/* Il foro nel secchio — l'acqua esce a v = √(2·g·h), come una goccia caduta dal pelo libero (Torricelli);
   il getto è una parabola; più il foro è profondo, più l'acqua esce veloce. Argomento: fluidodinamica. */
CVIDEO.registra('fluidodinamica/efflusso', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const T_FINE = 94.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.0, 'sorpreso'], [19.2, 'neutro'],
  [26.2, 'felice'], [28.6, 'neutro'], [35.2, 'festa'], [37.6, 'neutro'], [44.8, 'felice'], [47.2, 'neutro'],
  [64.6, 'felice'], [67.0, 'neutro'], [74.4, 'sorpreso'], [76.8, 'neutro'], [84.2, 'felice'], [86.6, 'neutro'],
  [89.0, 'pensa'], [94.0, 'neutro'], [96.2, 'felice'], [99.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Un foro nel secchio: quanto\nveloce esce l’acqua?'],
  [7.9, 12.2, 'Un secchio largo, pieno d’acqua,\ncon un foro tappato.'],
  [12.4, 16.8, '{mink:h}: profondità del foro\nsotto il pelo libero, 20 cm.'],
  [17.0, 21.0, 'Tolgo il tappo: esce un getto.\nAl rallentatore.'],
  [21.2, 26.0, 'Esce a {mx:v} = √(2·{mink:g·h}):\nè la legge di {v:Torricelli}.'],
  [26.2, 30.4, '√(2 · 9,8 · 0,2) ≈ {g:2,0 m/s}.'],
  [30.6, 35.0, 'Una goccia cade da ferma\ndal pelo libero, per 20 cm…'],
  [35.2, 39.6, '…arriva a 2,0 m/s: {g:la stessa}\nvelocità del getto!'],
  [39.8, 44.6, 'È Bernoulli: al pelo libero e al foro\nc’è la pressione dell’aria, {mv:p₀}…'],
  [44.8, 49.4, '…così {mink:d·g·h} diventa ½·{mink:d}·{mx:v}²:\nquota che diventa velocità.'],
  [49.6, 54.4, 'Il secchio è largo: il livello scende\npianissimo e {mx:v} quasi non cambia.'],
  [54.8, 59.6, 'Fuori il getto è una {v:parabola},\ncome un sasso lanciato in orizzontale.'],
  [59.8, 64.4, 'Avanza a 2,0 m/s e intanto cade,\naccelerato da {mink:g}.'],
  [64.6, 69.4, 'Foro a 1 m da terra:\nil getto arriva a circa 89 cm.'],
  [69.8, 74.2, 'Tre fori: 10, 20 e 30 cm\nsotto il pelo libero.'],
  [74.4, 79.0, 'Più il foro è profondo,\npiù l’acqua esce {g:veloce}.'],
  [79.2, 84.0, '1,4 m/s, 2,0 m/s, 2,4 m/s:\n{mx:v} cresce come √{mink:h}.'],
  [84.2, 88.8, 'Profondità tripla: velocità\n√3 ≈ 1,7 volte.'],
  [89.0, 94.0, 'Gittata: 2·√({mink:h·(H − h)}), con {mink:H} altezza\ndel pelo libero: massima a metà altezza.'],
  [96.2, 101.6, 'L’acqua esce dal foro come se\ncadesse dal pelo libero.'],
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
function riga(ctx, nome, val, y, col, al, x0, x1, size = 36) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right', fill: css(col) });
  ctx.restore();
}
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function quota(ctx, x, y0, y1, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y0 + 5); ctx.lineTo(x, y1 - 5); ctx.stroke();
  arrowHead(ctx, [x, y0], -Math.PI / 2, col, .65); arrowHead(ctx, [x, y1], Math.PI / 2, col, .65);
  ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il foro nel secchio', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il secchio: 450 px per metro, in orizzontale e in verticale ----------
const G = 9.8, SC = 450, TERRA = 760, LENTO = 5;            // al rallentatore 5 volte
const yDi = q => TERRA - q * SC;                              // quota (m) → pixel
const XS0 = 300, XS1 = 462, Q_FONDO = .8, Q_PELO = 1.2, Q_BORDO = 1.3;
// rapporto fra la sezione del foro (6 mm di diametro) e quella del secchio (36 cm): il livello scende pianissimo
const A_RAP = (.003 / .18) ** 2;
// la quota del pelo libero dopo tau secondi veri con questi fori aperti (profondità iniziali h0)
function pelo(tau, fori) {
  const scende = A_RAP * fori.reduce((s, h0) => s + Math.sqrt(2 * G * h0), 0) * Math.max(0, tau);
  return Q_PELO - scende;
}
function secchio(ctx, qPelo, fori, tappi) {
  // il tavolino
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(XS0 - 20, yDi(Q_FONDO) + 8); ctx.lineTo(XS1 + 20, yDi(Q_FONDO) + 8); ctx.stroke();
  ctx.lineWidth = 6;
  for (const x of [XS0, XS1]) { ctx.beginPath(); ctx.moveTo(x, yDi(Q_FONDO) + 12); ctx.lineTo(x, TERRA); ctx.stroke(); }
  // l'acqua e le pareti
  ctx.fillStyle = css(C.x, .22); ctx.fillRect(XS0, yDi(qPelo), XS1 - XS0, yDi(Q_FONDO) - yDi(qPelo));
  ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XS0, yDi(qPelo)); ctx.lineTo(XS1, yDi(qPelo)); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(XS0, yDi(Q_BORDO)); ctx.lineTo(XS0, yDi(Q_FONDO)); ctx.lineTo(XS1, yDi(Q_FONDO)); ctx.stroke();
  // la parete col foro: interrotta dove c'è un foro
  let y = yDi(Q_BORDO); ctx.beginPath(); ctx.moveTo(XS1, y);
  for (const h of fori.slice().sort((a, b) => a - b)) { const yf = yDi(Q_PELO - h); ctx.lineTo(XS1, yf - 7); ctx.moveTo(XS1, yf + 7); }
  ctx.lineTo(XS1, yDi(Q_FONDO)); ctx.stroke();
  // i tappi
  fori.forEach((h, i) => { const k = tappi[i]; if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.roundRect(XS1 - 6 + 30 * (1 - k), yDi(Q_PELO - h) - 9, 22, 18, 5); ctx.fill(); ctx.restore(); } });
}
// il getto da un foro a profondità h0: ogni goccia esce a √(2·g·h) (h al momento dell'uscita) e poi è un proiettile
function getto(ctx, h0, tau, fori) {
  if (tau <= 0) return;
  const q0 = Q_PELO - h0, tVolo = Math.sqrt(2 * q0 / G), n = 120, d = tVolo / n;
  const v = te => Math.sqrt(2 * G * (pelo(te, fori) - q0));
  const pos = (te, dt) => [XS1 + v(te) * dt * SC, yDi(q0 - .5 * G * dt * dt)];
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = css(mix(C.x, C.paper, .3));
  let prec = null;
  for (let i = 0; i <= n; i++) {
    const dt = i * d; if (dt > tau) break;
    const te = tau - dt, p = pos(te, dt), w = 12 * Math.sqrt(v(te) / Math.hypot(v(te), G * dt));
    if (prec) { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...prec); ctx.lineTo(...p); ctx.stroke(); }
    prec = p;
  }
  ctx.fillStyle = css(C.paper, .9);
  for (let k = Math.ceil(Math.max(0, tau - tVolo) / .03); k * .03 <= tau; k++) {
    const te = k * .03, p = pos(te, tau - te);
    ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

const SV = 40;                                   // frecce: 40 px per m/s
const T_TAPPO = 17.4, T_GOCCIA = 31.0, Q_FORO = 1.0;
const V_FORO = Math.sqrt(2 * G * .2);             // ≈ 1,98 m/s
// 1–2 · un foro (7,5–69,6)
function scenaUnForo(ctx, t) {
  if (t < 7.5 || t > 69.8) return;
  const ka = life(t, 7.6, 69.6, .6, .6);
  card(ctx, 110, 110, 1060, 680, ka); card(ctx, 1210, 110, 600, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const tau = (t - T_TAPPO) / LENTO, fori = [.2], qp = pelo(tau, fori);
  txt(ctx, 'al rallentatore', 1150, 140, { size: 30, color: C.dim, align: 'right', alpha: P(t, 17.4, 17.9) });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, TERRA); ctx.lineTo(1150, TERRA); ctx.stroke();
  secchio(ctx, qp, fori, [1 - P(t, 17.1, 17.5)]);
  getto(ctx, .2, tau, fori);
  // la profondità h, dentro l'acqua
  const kh = life(t, 12.5, 54.6, .4, .4);
  if (kh > 0) { quota(ctx, 432, yDi(qp), yDi(Q_FORO), C.ink, kh); drawRich(ctx, '{mink:h}', 412, (yDi(qp) + yDi(Q_FORO)) / 2, { size: 40, align: 'right', alpha: kh }); }
  // la velocità d'uscita
  const kv = life(t, 21.3, 69.4, .4, .4);
  if (kv > 0) { freccia(ctx, [XS1 + 10, yDi(Q_FORO) - 42], [XS1 + 10 + V_FORO * SV, yDi(Q_FORO) - 42], C.x, kv, 6); drawRich(ctx, '2,0 m/s', XS1 + 26 + V_FORO * SV, yDi(Q_FORO) - 42, { size: 32, align: 'left', alpha: kv, fill: css(C.x) }); }
  // la goccia che cade dal pelo libero (moto vero, al rallentatore come il getto)
  const kg = life(t, 30.7, 39.6, .3, .4);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg;
    txt(ctx, 'pelo libero', 280, yDi(Q_PELO) - 26, { size: 28, color: C.dim, align: 'right' });
    dashed(ctx, [140, yDi(Q_PELO)], [XS0 - 6, yDi(Q_PELO)], C.dim, 1, 1); dashed(ctx, [140, yDi(Q_FORO)], [XS0 - 6, yDi(Q_FORO)], C.dim, 1, 1);
    const tCad = Math.sqrt(2 * .2 / G), dt = clamp((t - T_GOCCIA) / LENTO, 0, tCad), y = yDi(Q_PELO) + .5 * G * dt * dt * SC;
    ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(180, y, 9, 0, Math.PI * 2); ctx.fill();
    if (dt > .01) freccia(ctx, [180, y + 12], [180, y + 12 + G * dt * SV], C.x, 1, 6);
    drawRich(ctx, '2,0 m/s', 180, yDi(Q_FORO) + 110, { size: 30, alpha: P(t, 35.2, 35.6), fill: css(C.x) });
    ctx.restore();
  }
  // 2 · il getto: l'altezza del foro e dove arriva
  const kq = life(t, 64.7, 69.4, .4, .4), xArr = XS1 + V_FORO * Math.sqrt(2 * Q_FORO / G) * SC;
  if (kq > 0) {
    quota(ctx, 478, yDi(Q_FORO) + 14, TERRA, C.dim, kq); txt(ctx, '1 m', 494, 560, { size: 30, color: C.dim, align: 'left', alpha: kq });
    ctx.save(); ctx.globalAlpha *= kq; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(XS1 + 5, TERRA - 16); ctx.lineTo(xArr - 5, TERRA - 16); ctx.stroke();
    arrowHead(ctx, [XS1, TERRA - 16], Math.PI, C.g, .65); arrowHead(ctx, [xArr, TERRA - 16], 0, C.g, .65);
    ctx.restore();
    drawRich(ctx, '≈ 89 cm', (XS1 + xArr) / 2, TERRA - 46, { size: 32, alpha: kq, fill: css(C.g) });
  }
  // la scheda
  const xa = 1250, xb = 1770, k1 = life(t, 12.4, 54.6, .4, .5);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    titoletto(ctx, 'il foro', 1510, 165);
    riga(ctx, 'profondità {mink:h}', '20 cm', 240, C.ink, 1, xa, xb);
    riga(ctx, '{mink:g}', '9,8 m/s²', 300, C.ink, P(t, 21.3, 21.8), xa, xb);
    drawRich(ctx, '{mx:v} = √(2·{mink:g·h})', 1510, 385, { size: 50, local: t - 21.4 });
    drawRich(ctx, '√(2 · 9,8 · 0,2) ≈ {g:2,0 m/s}', 1510, 455, { size: 34, local: t - 26.4 });
    ctx.save(); ctx.globalAlpha *= P(t, 39.9, 40.4); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xa, 505); ctx.lineTo(xb, 505); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mv:p₀} + {mink:d·g·h} = {mv:p₀} + ½·{mink:d}·{mx:v}{mink:²}', 1510, 560, { size: 34, local: t - 40.0 });
    drawRich(ctx, '{dim:pelo libero}', 1385, 610, { size: 30, local: t - 40.6 }); drawRich(ctx, '{dim:foro}', 1650, 610, { size: 30, local: t - 40.6 });
    drawRich(ctx, '{mink:d·g·h} = ½·{mink:d}·{mx:v}{mink:²}', 1510, 680, { size: 42, local: t - 45.0 });
    drawRich(ctx, '{mink:d}{dim:: densità dell’acqua}', 1510, 740, { size: 30, local: t - 40.6 });
    ctx.restore();
  }
  const k2 = life(t, 54.8, 69.4, .5, .4);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    titoletto(ctx, 'il getto', 1510, 165);
    drawRich(ctx, '{dim:in orizzontale:} {mx:v}{mink:·t}', 1510, 250, { size: 38, local: t - 55.0 });
    drawRich(ctx, '{dim:in verticale:} ½·{mink:g·t²}', 1510, 315, { size: 38, local: t - 55.6 });
    drawRich(ctx, '{dim:t: tempo dall’uscita}', 1510, 375, { size: 30, local: t - 56.2 });
    riga(ctx, 'caduta di 1 m', '≈ 0,45 s', 470, C.ink, P(t, 64.8, 65.3), xa, xb);
    riga(ctx, 'distanza', '≈ 0,89 m', 540, C.g, P(t, 65.2, 65.7), xa, xb);
    ctx.restore();
  }
  ctx.restore();
}

// 3 · tre fori (69,6–94,2)
const FORI3 = [.1, .2, .3], T_TAPPI3 = 74.6;
function scenaTreFori(ctx, t) {
  if (t < 69.4 || t > T_FINE + .3) return;
  const ka = life(t, 69.6, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1060, 680, ka); card(ctx, 1210, 110, 600, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const tau = (t - T_TAPPI3) / LENTO, qp = pelo(tau, FORI3), kt = 1 - P(t, 74.3, 74.7);
  txt(ctx, 'al rallentatore', 1150, 140, { size: 30, color: C.dim, align: 'right', alpha: P(t, 74.6, 75.1) });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, TERRA); ctx.lineTo(1150, TERRA); ctx.stroke();
  secchio(ctx, qp, FORI3, [kt, kt, kt]);
  FORI3.forEach(h => getto(ctx, h, tau, FORI3));
  FORI3.forEach(h => txt(ctx, Math.round(h * 100) + ' cm', 440, yDi(Q_PELO - h), { size: 28, align: 'right', alpha: P(t, 70.0, 70.5) }));
  const xa = 1270, xb = 1750;
  titoletto(ctx, 'tre fori', 1510, 165);
  drawRich(ctx, '{dim:profondità} {mink:h}', xa, 240, { size: 32, align: 'left', alpha: P(t, 70.0, 70.5) });
  drawRich(ctx, '{mx:v}', xb, 240, { size: 36, align: 'right', alpha: P(t, 79.3, 79.8) });
  [['10 cm', '1,4 m/s'], ['20 cm', '2,0 m/s'], ['30 cm', '2,4 m/s']].forEach(([a, b], i) => {
    txt(ctx, a, xa, 305 + 62 * i, { size: 38, align: 'left', alpha: P(t, 70.0, 70.5) });
    txt(ctx, b, xb, 305 + 62 * i, { size: 40, color: C.x, align: 'right', alpha: P(t, 79.4 + .3 * i, 79.9 + .3 * i) });
  });
  drawRich(ctx, '{mx:v} cresce come √{mink:h}', 1510, 530, { size: 38, local: t - 80.6 });
  drawRich(ctx, '30 cm / 10 cm = 3', 1510, 620, { size: 34, local: t - 84.4 });
  drawRich(ctx, '2,4 / 1,4 ≈ {g:√3 ≈ 1,7}', 1510, 680, { size: 38, local: t - 85.0 });
  // la gittata: x = √(2·g·h) · √(2·(H − h)/g) = 2·√(h·(H − h)), H = quota del pelo libero da terra
  const kH = P(t, 89.1, 89.6);
  if (kH > 0) { quota(ctx, 250, yDi(qp), TERRA, C.ink, kH); drawRich(ctx, '{mink:H}', 226, (yDi(qp) + TERRA) / 2, { size: 40, align: 'right', alpha: kH }); }
  drawRich(ctx, '{dim:gittata:} 2·√({mink:h·(H − h)})', 1510, 745, { size: 34, local: t - 89.2 });
  ctx.restore();
}

// in una frase (94,2–104,6)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.7, 103.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.4 });
    drawRich(ctx, 'L’acqua esce dal foro come se\ncadesse dal {x:pelo libero}.', W / 2, 290, { size: 70, weight: 600, local: t - 94.8, stagger: .09 });
  });
  const pills = [[490, '{mx:v} = √(2·{mink:g·h})'], [960, '{mink:h}: profondità\nsotto il pelo libero'], [1430, 'il getto:\nuna {v:parabola}']];
  pills.forEach(([x, s], i) => {
    const a = 96.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.5, .4],                                               // il secchio, la profondità h
    ['pop', 17.3, .5],                                                                // via il tappo
    ['tono', 17.4, 19.66, [.75, .74, .7, .65, .56, .46, .33, .18, 0]], ['pop', 19.66, .35],   // il getto cade da 1 m e tocca terra
    ['pop', 21.3, .45], ['pop', 21.4, .55], ['ding', 27.0],                           // v = √(2·g·h) ≈ 2,0 m/s
    ['pop', 30.8, .4], ['tono', 31.0, 32.01, [.9, .89, .88, .84, .8, .74, .68, .59, .5]],   // la goccia cade dal pelo libero
    ['pop', 40.0, .5], ['pop', 40.6, .35], ['pop', 45.0, .6],                         // Bernoulli: d·g·h = ½·d·v²
    ['soffio', 54.8], ['pop', 55.0, .4], ['pop', 55.6, .45],                          // il getto: v·t e ½·g·t²
    ['pop', 64.8, .4], ['ding', 65.3],                                                // caduta 0,45 s, distanza 0,89 m
    ['soffio', 69.6], ['pop', 70.0, .4],                                              // tre fori
    ['pop', 74.5, .5],                                                                // via i tappi
    ['tono', 74.6, 76.86, [.75, .74, .7, .65, .56, .46, .33, .18, 0]], ['pop', 76.86, .35],   // i tre getti cadono
    ['pop', 79.4, .35], ['pop', 79.7, .5], ['pop', 80.0, .65], ['pop', 80.6, .5],     // 1,4 – 2,0 – 2,4 m/s, cresce come √h
    ['pop', 84.4, .4], ['ding', 85.5],                                                // profondità tripla: √3 ≈ 1,7
    ['pop', 89.1, .4], ['pop', 89.2, .55],                                            // H e la gittata
    ['soffio', 94.4], ['pop', 96.6, .5], ['pop', 97.1, .6], ['pop', 97.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il foro nel secchio', durata: 104.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 54.6, 'la velocità d’uscita'], [54.6, 69.6, 'il getto'], [69.6, T_FINE, 'tre fori']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaUnForo(ctx, t); scenaTreFori(ctx, t); scenaFine(ctx, t); },
  };
});
