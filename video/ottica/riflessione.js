'use strict';
/* Lo specchio — l'angolo di riflessione è uguale all'angolo di incidenza (misurati dalla normale); l'immagine nello
   specchio piano è virtuale, dritta, uguale, alla stessa distanza dietro lo specchio. Argomento: ottica. */
CVIDEO.registra('ottica/riflessione', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [77.2, 190], [78.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [77.2, 1050], [78.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [77.2, 2.2], [78.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [77.2, 2], [78.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [77.2, -1.5], [78.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [25.0, 'felice'], [28.8, 'neutro'],
  [32.8, 'felice'], [37.0, 'neutro'], [50.8, 'pensa'], [55.2, 'sorpreso'], [59.4, 'felice'], [63.8, 'neutro'],
  [68.2, 'felice'], [72.6, 'neutro'], [79.4, 'felice'], [85.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Dove va la luce quando\nincontra uno specchio?'],
  [7.9, 11.9, 'Un raggio di luce arriva\nsu uno specchio e {g:rimbalza}.'],
  [12.0, 16.1, 'Nel punto in cui arriva tracciamo\nla {v:normale}: la perpendicolare.'],
  [16.3, 20.6, 'L’angolo di {x:incidenza} si misura\ndalla normale, non dallo specchio.'],
  [20.8, 24.8, 'Il raggio riflesso fa con la normale\nl’angolo di {g:riflessione}.'],
  [25.0, 28.6, 'Sono {g:uguali}: 30° e 30°.'],
  [28.8, 32.6, 'Inclino di più il raggio…'],
  [32.8, 36.8, '…e anche il riflesso si inclina:\n{g:55° e 55°}.'],
  [37.0, 41.6, 'Incidente, normale e riflesso stanno\nnello {v:stesso piano}: quello del foglio.'],
  [42.2, 46.0, 'Ora una candela davanti\na uno specchio.'],
  [46.2, 50.6, 'Dalla fiamma partono raggi\nche si riflettono sullo specchio.'],
  [50.8, 55.0, 'Questo arriva all’occhio, che lo\nprolunga {v:dritto} dietro lo specchio.'],
  [55.2, 59.2, 'Anche gli altri, prolungati,\npassano di lì: è l’{v:immagine}.'],
  [59.4, 63.6, 'È dietro lo specchio, alla\n{g:stessa distanza} della candela.'],
  [63.8, 68.0, 'È {v:virtuale}: dietro lo specchio\nla luce non arriva davvero.'],
  [68.2, 72.4, 'È dritta e grande quanto la candela:\n{g:simmetrica} rispetto allo specchio.'],
  [72.6, 76.9, 'Avvicino la candela a 40 cm:\nanche l’immagine si avvicina.'],
  [79.4, 85.2, 'Angoli uguali, misurati dalla normale;\nl’immagine è {g:simmetrica}.'],
];

// ---------- aiutanti ----------
const RAD = Math.PI / 180;
const lung = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
// un raggio di luce: la spezzata si disegna fino alla frazione k, con una punta di freccia a metà di ogni tratto
function raggio(ctx, pts, k, col, w = 5, al = 1) {
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  glowStroke(ctx, pts, k, col, w);
  const L = lung(pts), fin = L[L.length - 1] * clamp(k);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], m = (L[i - 1] + L[i]) / 2;
    if (m + 12 > fin || L[i] - L[i - 1] < 60) continue;
    const f = (m - L[i - 1]) / (L[i] - L[i - 1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    arrowHead(ctx, [lerp(a[0], b[0], f) + Math.cos(ang) * 12, lerp(a[1], b[1], f) + Math.sin(ang) * 12], ang, col, 1.15);
  }
  ctx.restore();
}
// l'impulso di luce che corre lungo il raggio: s è la strada fatta, in pixel
function impulso(ctx, pts, s, col, al = 1) {
  const L = lung(pts); if (s < 0 || s > L[L.length - 1] || al <= 0) return;
  let i = 1; while (i < pts.length - 1 && L[i] < s) i++;
  const f = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1), p = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 30);
  g.addColorStop(0, css(col, .75)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// impulsi che partono uno ogni «ogni» secondi da t0, a v pixel al secondo
function impulsi(ctx, pts, t, t0, t1, v, ogni, col, al = 1) {
  if (t < t0 || al <= 0) return;
  const tot = lung(pts).slice(-1)[0];
  for (let n = 0; t0 + n * ogni <= Math.min(t, t1); n++) impulso(ctx, pts, (t - t0 - n * ogni) * v, col, al * clamp((tot - (t - t0 - n * ogni) * v) / 60));
}
// arco d'angolo con centro c fra le direzioni a0 e a1 (radianti della tela)
function arco(ctx, c, a0, a1, r, col, k = 1, w = 4) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(c[0], c[1], r, a0, lerp(a0, a1, clamp(k)), a1 < a0); ctx.stroke(); ctx.restore();
}
function occhio(ctx, x, y, ang, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';   // il bianco dell'occhio resta bianco anche nel tema scuro
  ctx.beginPath(); ctx.moveTo(-44, 0); ctx.quadraticCurveTo(0, -38, 44, 0); ctx.quadraticCurveTo(0, 38, -44, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(16, 0, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#10132b'; ctx.beginPath(); ctx.arc(19, 0, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(12, -6, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Lo specchio', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il raggio sullo specchio (7,5–41,8): specchio orizzontale, raggio lungo 480 px
const I = [960, 650], LR = 480;
const theta = t => kf(t, [[29.0, 30], [31.6, 55]]) * RAD;   // l'angolo di incidenza, dalla normale
function lampada(ctx, S, ang, al = 1) {
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(S[0], S[1]); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-104, -22, 92, 44, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.roundRect(-14, -26, 16, 52, 5); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function specchioOrizzontale(ctx, x0, x1, y) {
  ctx.fillStyle = css(C.x, .16); ctx.fillRect(x0, y, x1 - x0, 16);
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2; ctx.beginPath();
  for (let x = x0 + 8; x < x1; x += 24) { ctx.moveTo(x, y + 18); ctx.lineTo(x - 16, y + 36); }
  ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
}
function sceneRaggio(ctx, t) {
  if (t < 7.4 || t > 42.2) return;
  const al = life(t, 7.6, 41.9, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // lo stesso piano: il foglio stesso, colorato appena
  const kp = life(t, 37.2, 41.7, .5, .4);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(C.v, .08); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 22); ctx.fill();
    drawRich(ctx, '{v:il piano del foglio}', 1780, 750, { size: 32, align: 'right' }); ctx.restore();
  }
  specchioOrizzontale(ctx, 380, 1540, I[1]);
  txt(ctx, 'specchio', 1560, I[1] + 4, { size: 30, color: C.dim, align: 'left' });
  const th = theta(t), s = Math.sin(th), c = Math.cos(th);
  const S = [I[0] - LR * s, I[1] - LR * c], R = [I[0] + LR * s, I[1] - LR * c];
  // la normale
  const kn = P(t, 12.2, 13.0);
  if (kn > 0) {
    dashed(ctx, I, [I[0], 175], C.v, kn, 1);
    drawRich(ctx, '{v:normale}', I[0], 148, { size: 32, alpha: P(t, 12.8, 13.3) });
  }
  // gli angoli, misurati dalla normale
  const ki = P(t, 16.6, 17.3), kr = P(t, 21.1, 21.8), gi = Math.round(th / RAD) + '°';
  if (ki > 0) {
    arco(ctx, I, -Math.PI / 2, -Math.PI / 2 - th, 175, C.x, ki);
    const a = -Math.PI / 2 - th / 2;
    txt(ctx, gi, I[0] + 255 * Math.cos(a), I[1] + 255 * Math.sin(a), { size: 40, weight: 600, color: C.x, alpha: P(t, 17.0, 17.4) });
  }
  if (kr > 0) {
    arco(ctx, I, -Math.PI / 2, -Math.PI / 2 + th, 175, C.g, kr);
    const a = -Math.PI / 2 + th / 2;
    txt(ctx, gi, I[0] + 255 * Math.cos(a), I[1] + 255 * Math.sin(a), { size: 40, weight: 600, color: C.g, alpha: P(t, 21.5, 21.9) });
  }
  // il raggio: incidente e riflesso, poi gli impulsi di luce che lo percorrono
  raggio(ctx, [S, I, R], P(t, 8.2, 10.0, E.lin), C.y);
  impulsi(ctx, [S, I, R], t, 10.1, 41.0, 520, 1.6, C.y);
  lampada(ctx, S, Math.atan2(I[1] - S[1], I[0] - S[0]), P(t, 7.9, 8.3));
  const kl = life(t, 9.2, 28.7, .5, .4);
  if (kl > 0) {
    const mi = [(S[0] + I[0]) / 2 - 170 * c, (S[1] + I[1]) / 2 + 170 * s], mr = [(R[0] + I[0]) / 2 + 170 * c, (R[1] + I[1]) / 2 + 170 * s];
    txt(ctx, 'raggio incidente', mi[0], mi[1], { size: 32, color: C.y, alpha: kl });
    txt(ctx, 'raggio riflesso', mr[0], mr[1], { size: 32, color: C.y, alpha: kl * P(t, 9.8, 10.3) });
  }
  // la scheda: i due angoli, uguali
  const kc = life(t, 16.7, 36.9, .5, .5);
  if (kc > 0) {
    card(ctx, 1440, 140, 350, 190, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    txt(ctx, 'incidenza', 1470, 200, { size: 34, align: 'left' }); txt(ctx, gi, 1760, 200, { size: 40, weight: 600, color: C.x, align: 'right' });
    const k2 = P(t, 21.2, 21.7);
    txt(ctx, 'riflessione', 1470, 270, { size: 34, align: 'left', alpha: k2 }); txt(ctx, gi, 1760, 270, { size: 40, weight: 600, color: C.g, align: 'right', alpha: k2 });
    ctx.restore();
  }
  ctx.restore();
}

// 2 · la candela e la sua immagine (41,8–77,2): specchio verticale in x = 1000, 6 px per centimetro
const XM = 1000, PXC = 6, YF = 568, OCCHIO = [250, 250], BORDO = { x0: 130, x1: 1790, y0: 130, y1: 770 };
const dist = t => kf(t, [[73.0, 60], [75.4, 40]]);   // distanza della candela dallo specchio, in cm
function candela(ctx, x, al = 1, immagine = false) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al * (immagine ? .6 : 1);
  ctx.strokeStyle = css(immagine ? C.v : C.ink); ctx.lineWidth = 3; if (immagine) ctx.setLineDash([8, 7]);
  ctx.fillStyle = css(C.dim, .5); ctx.beginPath(); ctx.ellipse(x, 724, 44, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.y, C.paper, .78)); ctx.beginPath(); ctx.rect(x - 18, 600, 36, 120); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 600); ctx.lineTo(x, 590); ctx.stroke();
  const g = ctx.createRadialGradient(x, YF + 6, 2, x, YF + 6, 34);
  g.addColorStop(0, css(C.y, .45)); g.addColorStop(1, css(C.y, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, YF + 6, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.moveTo(x, 538); ctx.quadraticCurveTo(x + 17, 572, x, 594); ctx.quadraticCurveTo(x - 17, 572, x, 538); ctx.fill();
  ctx.restore();
}
// dove un raggio che parte da p in direzione d esce dal riquadro
function finoAlBordo(p, d) {
  let k = 1e9;
  if (d[0] < 0) k = Math.min(k, (BORDO.x0 - p[0]) / d[0]); if (d[0] > 0) k = Math.min(k, (BORDO.x1 - p[0]) / d[0]);
  if (d[1] < 0) k = Math.min(k, (BORDO.y0 - p[1]) / d[1]); if (d[1] > 0) k = Math.min(k, (BORDO.y1 - p[1]) / d[1]);
  return [p[0] + d[0] * k, p[1] + d[1] * k];
}
function sceneCandela(ctx, t) {
  if (t < 41.6 || t > 77.6) return;
  const al = life(t, 41.9, 77.3, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const d = dist(t), xc = XM - PXC * d, xi = XM + PXC * d, F = [xc, YF], Fi = [xi, YF];
  // lo specchio, argentato dietro (a destra)
  ctx.fillStyle = css(C.x, .16); ctx.fillRect(XM, 170, 16, 600);
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2; ctx.beginPath();
  for (let y = 178; y < 770; y += 24) { ctx.moveTo(XM + 18, y); ctx.lineTo(XM + 36, y - 16); }
  ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(XM, 170); ctx.lineTo(XM, 770); ctx.stroke();
  txt(ctx, 'specchio', XM, 144, { size: 30, color: C.dim });
  // tre raggi dalla fiamma: due passano sopra l'occhio, il terzo ci arriva
  const yOcchio = YF + (OCCHIO[1] - YF) * (xi - XM) / (xi - OCCHIO[0]);
  const RAGGI = [330, 400, yOcchio].map((ym, i) => {
    const Mp = [XM, ym], dv = [Mp[0] - Fi[0], Mp[1] - Fi[1]];
    let fine;
    if (i < 2) fine = finoAlBordo(Mp, dv);
    else { const L = Math.hypot(OCCHIO[0] - XM, OCCHIO[1] - ym); fine = [OCCHIO[0] + (XM - OCCHIO[0]) * 46 / L, OCCHIO[1] + (ym - OCCHIO[1]) * 46 / L]; }
    return { Mp, pts: [F, Mp, fine] };
  });
  // i prolungamenti dietro lo specchio: prima quello dell'occhio, poi gli altri due
  RAGGI.forEach((Rg, i) => {
    const kx = i === 2 ? P(t, 51.3, 52.4) : P(t, 55.5, 56.5);
    dashed(ctx, Rg.Mp, Fi, C.v, kx, .9);
  });
  const kSolo = i => i === 2 ? 1 : 1 - .65 * life(t, 50.9, 55.1, .4, .4);   // mentre Stilla parla del raggio che va all'occhio, gli altri si fanno da parte
  RAGGI.forEach((Rg, i) => raggio(ctx, Rg.pts, P(t, 46.5 + .7 * i, 47.7 + .7 * i, E.lin), C.y, 4, kSolo(i)));
  RAGGI.forEach((Rg, i) => impulsi(ctx, Rg.pts, t, 49.0 + .5 * i, 77.0, 480, 1.8, C.y, kSolo(i)));
  // la candela e l'immagine
  candela(ctx, xc, P(t, 42.3, 42.9));
  const kim = P(t, 56.6, 57.4);
  candela(ctx, xi, kim, true);
  dot(ctx, Fi, C.v, P(t, 56.3, 56.7, E.back), 9);
  txt(ctx, 'candela', xc - 50, 680, { size: 30, color: C.dim, align: 'right', alpha: P(t, 42.5, 43.0) });
  txt(ctx, 'immagine', xi + 50, 650, { size: 30, color: C.v, align: 'left', alpha: kim });
  drawRich(ctx, '{v:virtuale}', xi + 50, 700, { size: 30, align: 'left', alpha: P(t, 64.0, 64.5) });
  occhio(ctx, OCCHIO[0], OCCHIO[1], Math.atan2(yOcchio - OCCHIO[1], XM - OCCHIO[0]), P(t, 47.6, 48.2));
  // le distanze, uguali
  const kd = P(t, 59.7, 60.3);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath();
    for (const [a, b] of [[xc, XM - 4], [XM + 4, xi]]) { ctx.moveTo(a, 768); ctx.lineTo(b, 768); ctx.moveTo(a, 756); ctx.lineTo(a, 780); ctx.moveTo(b, 756); ctx.lineTo(b, 780); }
    ctx.stroke();
    const sd = Math.round(d) + ' cm';
    txt(ctx, sd, (xc + XM) / 2, 744, { size: 34, weight: 600, color: C.g });
    txt(ctx, sd, (XM + xi) / 2, 744, { size: 34, weight: 600, color: C.g });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · in una frase (77,2–88)
function sceneFine(ctx, t) {
  if (t < 77.2) return;
  const al = 1 - P(t, 86.4, 87.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 77.4 });
    drawRich(ctx, 'L’angolo di riflessione è uguale\nall’angolo di incidenza.', W / 2, 290, { size: 70, weight: 600, local: t - 77.8, stagger: .09 });
  });
  const pills = [[490, 'angoli misurati\ndalla {v:normale}'], [960, 'immagine {v:virtuale},\ndritta e uguale'], [1430, 'dietro lo specchio,\nalla {g:stessa distanza}']];
  pills.forEach(([x, s], i) => {
    const a = 79.4 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.1, .45],                                               // lo specchio, la lampada
    ['traccia', 8.2, 10.0], ['tono', 8.2, 10.0, [1, .5, 0, .5, 1]],                   // il raggio scende e rimbalza
    ['traccia', 12.2, 13.0],                                                          // la normale
    ['traccia', 16.6, 17.3], ['pop', 17.2, .5],                                       // incidenza: 30 gradi
    ['traccia', 21.1, 21.8], ['pop', 21.7, .55], ['ding', 25.1],                      // riflessione: uguali
    ['tono', 29.0, 31.6, [.33, .34, .37, .47, .57, .61, .61]], ['ding', 33.0],        // inclino: 55 e 55
    ['pop', 37.4, .4],                                                                // lo stesso piano
    ['soffio', 41.9], ['pop', 42.6, .5],                                              // la candela
    ['traccia', 46.5, 49.1], ['pop', 47.9, .45],                                      // tre raggi, l'occhio
    ['traccia', 51.3, 52.4],                                                          // il prolungamento
    ['traccia', 55.5, 56.5], ['pop', 56.5, .55], ['pop', 57.0, .5], ['ding', 57.4],   // gli altri: l'immagine
    ['pop', 60.0, .55], ['ding', 60.4],                                               // stessa distanza
    ['pop', 64.2, .45],                                                               // virtuale
    ['tono', 73.0, 75.4, [.6, .6, .57, .5, .43, .4, .4]],                             // la candela si avvicina
    ['soffio', 77.3], ['pop', 79.4, .5], ['pop', 79.9, .6], ['pop', 80.4, .7],        // in una frase
  ];
  return {
    titolo: 'Lo specchio', durata: 88, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.8, 'angoli uguali'], [41.8, 77.2, 'l’immagine nello specchio']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneRaggio(ctx, t); sceneCandela(ctx, t); sceneFine(ctx, t); },
  };
});
