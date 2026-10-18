'use strict';
/* Sulla Luna pesi meno, ma non dimagrisci — la massa resta, il peso P = m·g cambia; la bilancia a molla e quella a bracci;
   in coda il peso specifico d·g (acqua 9800 N/m³). Argomento: forze. */
CVIDEO.registra('forze/massa-e-peso', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [98.5, 190], [99.8, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [98.5, 1050], [99.8, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [98.5, 2.2], [99.8, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [98.5, 2], [99.8, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [98.5, -1.5], [99.8, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.5, 'felice'], [21.8, 'neutro'],
  [37.1, 'felice'], [40.9, 'sorpreso'], [45.7, 'felice'], [50.6, 'neutro'], [59.7, 'sorpreso'], [64.1, 'neutro'],
  [73.5, 'felice'], [77.0, 'sorpreso'], [80.7, 'neutro'], [92.6, 'felice'], [95.0, 'neutro'], [100.8, 'felice'], [104.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Sulla Luna un astronauta\ndimagrisce?'],
  [7.9, 12.3, 'Lo stesso astronauta sulla Terra\ne sulla Luna.'],
  [12.4, 17.4, 'La {v:massa} {mink:m} dice quanta materia ha:\nsi misura in kg.'],
  [17.5, 21.6, 'Qui e lassù: 60 kg.\nLa massa {g:non cambia}.'],
  [21.8, 27.1, 'Il {y:peso} {my:P} è un’altra cosa: è la {y:forza}\ncon cui il pianeta lo attira.'],
  [27.2, 31.6, 'Si misura in newton (N):\n{my:P} = {mink:m·g}.'],
  [31.7, 37.0, 'Sulla Terra {mink:g} = 9,8 m/s²: vuol dire\n9,8 N per ogni kg.'],
  [37.1, 40.8, '60 kg · 9,8 m/s² = {y:588 N}.'],
  [40.9, 45.5, 'Sulla Luna {mink:g} ≈ 1,6 m/s²:\nil peso è circa {y:96 N}.'],
  [45.7, 50.4, 'Pesa {g:circa sei volte} meno,\nma la massa è la {g:stessa}.'],
  [50.6, 54.8, 'Come si misurano? Una {v:bilancia a molla}\nsente il peso.'],
  [54.9, 59.6, 'Appendo 2 kg: sulla Terra\nla molla segna {y:19,6 N}.'],
  [59.7, 64.0, 'Sulla Luna, stessi 2 kg:\nsegna solo {y:3,2 N}.'],
  [64.1, 68.4, 'La molla misura il {y:peso}:\nsulla Luna segna {g:meno}.'],
  [68.6, 73.4, 'Una {v:bilancia a bracci} confronta i 2 kg\ncon dei pesi campione.'],
  [73.5, 76.9, 'Sulla Terra sta {g:in equilibrio}.'],
  [77.0, 80.6, 'Sulla Luna: {g:ancora in equilibrio}!'],
  [80.7, 86.3, 'I due piatti pesano meno tutti e due:\nla bilancia a bracci misura la {v:massa}.'],
  [86.6, 92.4, 'Il {y:peso specifico} è il peso di ogni\nmetro cubo: {mink:d·g}, in N/m³.'],
  [92.6, 98.3, 'Per l’acqua: 1000 · 9,8\n= {y:9800 N/m³}.'],
  [100.8, 105.9, 'La massa non cambia mai;\nil peso dipende da dove sei.'],
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
const G_T = 9.8, G_L = 1.6, MA = 60, MS = 2;
const TERRA = [110, 110, 820, 680], LUNA = [990, 110, 820, 680];
const GY = 600;   // il suolo
function suolo(ctx, K, luna) {
  const x0 = K[0] + 24, x1 = K[0] + K[2] - 24, yb = K[1] + K[3] - 24;
  ctx.save();
  ctx.fillStyle = css(luna ? mix(C.dim, C.paper, .78) : mix(C.g, C.paper, .82));
  ctx.fillRect(x0, GY, x1 - x0, yb - GY);
  ctx.strokeStyle = css(luna ? C.dim : mix(C.g, C.ink, .2)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x0, GY); ctx.lineTo(x1, GY); ctx.stroke();
  if (luna) {   // due crateri
    ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 3;
    for (const [cx, w] of [[K[0] + 690, 80], [K[0] + 768, 36]]) { ctx.beginPath(); ctx.ellipse(cx, GY + 40, w / 2, 9, 0, 0, Math.PI * 2); ctx.stroke(); }
  }
  ctx.restore();
}
function titoloScheda(ctx, K, s, al) {
  conFont(TITOLI, () => drawRich(ctx, s, K[0] + 40, K[1] + 52, { size: 40, weight: 600, align: 'left', alpha: al }));
}
// l'astronauta, i piedi in (x, GY); il baricentro a 120 px dai piedi
function astronauta(ctx, x, al) {
  if (al <= 0) return;
  const tuta = css(mix(C.dim, C.paper, .7)), bordo = css(C.ink);
  ctx.save(); ctx.globalAlpha *= al; ctx.lineWidth = 3; ctx.strokeStyle = bordo;
  ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.beginPath(); ctx.roundRect(x - 62, GY - 178, 26, 92, 8); ctx.fill(); ctx.stroke();   // zaino
  ctx.fillStyle = tuta;
  for (const dx of [-38, 8]) { ctx.beginPath(); ctx.roundRect(x + dx, GY - 78, 30, 78, 8); ctx.fill(); ctx.stroke(); }   // gambe
  for (const dx of [-62, 44]) { ctx.beginPath(); ctx.roundRect(x + dx, GY - 172, 22, 84, 10); ctx.fill(); ctx.stroke(); }   // braccia
  ctx.beginPath(); ctx.roundRect(x - 44, GY - 182, 88, 112, 16); ctx.fill(); ctx.stroke();   // busto
  ctx.beginPath(); ctx.arc(x, GY - 222, 40, 0, Math.PI * 2); ctx.fill(); ctx.stroke();      // casco
  ctx.fillStyle = css(mix(C.x, C.ink, .35)); ctx.beginPath(); ctx.roundRect(x - 26, GY - 240, 52, 34, 14); ctx.fill();
  ctx.restore();
}
function riga(ctx, nome, val, y, col, al, x0, x1, size = 40) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 4, align: 'right', fill: css(col) });
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Sulla Luna pesi meno,\nma non dimagrisci', W / 2, 205, { size: 104, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.25 }));
}

// le due schede, Terra e Luna, per tutto il video (7,5–86,6)
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > 86.8) return;
  const al = life(t, 7.6, 86.6, .6, .5);
  [[TERRA, false, 'sulla {x:Terra}'], [LUNA, true, 'sulla {v:Luna}']].forEach(([K, luna, nome]) => {
    card(ctx, ...K, al);
    ctx.save(); ctx.globalAlpha *= al;
    suolo(ctx, K, luna);
    titoloScheda(ctx, K, nome, 1);
    ctx.restore();
  });
}

// 1 · l'astronauta: stessa massa, peso diverso (7,5–50,5)
function sceneAstronauta(ctx, t) {
  if (t < 7.5 || t > 50.8) return;
  const al = life(t, 7.9, 50.6, .6, .5);
  ctx.save(); ctx.globalAlpha *= al;
  [[TERRA, G_T, 31.9, 37.3], [LUNA, G_L, 41.0, 41.2]].forEach(([K, g, tg, tp], i) => {
    const ax = K[0] + 210, x0 = K[0] + 410, x1 = K[0] + K[2] - 40;
    astronauta(ctx, ax, P(t, 8.1 + i * .3, 8.7 + i * .3));
    // la massa: 60 kg in tutte e due, verde quando Stilla dice che non cambia
    const km = P(t, 12.6, 13.1), verde = P(t, 17.6, 18.1);
    riga(ctx, 'massa {mink:m}', '60 kg', 230, mix(C.ink, C.g, verde), km, x0, x1);
    riga(ctx, '{my:P} {mink:= m·g}', '', 320, C.ink, P(t, 27.4, 27.9), x0, x1);
    riga(ctx, '{mink:g}', (i ? '≈ ' : '') + fmtN(g, 1) + ' m/s²', 400, C.ink, P(t, tg, tg + .5), x0, x1);
    const kp = P(t, tp, tp + .6), Pn = MA * g;
    riga(ctx, '{my:P}', (i ? '≈ ' : '') + Math.round(Pn) + ' N', 520, C.y, kp, x0, x1, 44);
    // il peso, dal baricentro verso il basso: 0,4 px per newton
    const yg = GY - 120;
    if (kp > 0) {
      M.dot(ctx, [ax, yg], C.ink, kp, 8);
      freccia(ctx, [ax, yg], [ax, yg + Pn * .4 * kp], C.y, kp);
      drawRich(ctx, '{my:P}', i ? ax + 84 : ax + 30, i ? yg + 16 : GY + 70, { size: 40, align: 'left', alpha: kp });
    }
    if (!i) txt(ctx, '(9,8 N per ogni kg)', x0, 448, { size: 30, color: C.dim, align: 'left', alpha: P(t, tg + .3, tg + .8) });
  });
  ctx.restore();
}

// 2 · la bilancia a molla: segna il peso (50,5–68,5)
const L0 = 110, PXN = 10, OM = 2 * Math.PI / .9, GAM = 4.5;   // molla: 10 px per newton; oscillazione smorzata, stesso periodo sui due astri
const molla = (xe, tau) => tau <= 0 ? 0 : xe * (1 - Math.exp(-GAM * tau) * (Math.cos(OM * tau) + GAM / OM * Math.sin(OM * tau)));
function disegnaMolla(ctx, x, y0, y1, n = 13) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + 10);
  const h = (y1 - y0 - 20) / n;
  for (let i = 0; i < n; i++) { ctx.lineTo(x + (i % 2 ? -20 : 20), y0 + 10 + h * (i + .5)); }
  ctx.lineTo(x, y1 - 10); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
}
function sceneMolle(ctx, t) {
  if (t < 50.2 || t > 68.8) return;
  const al = life(t, 50.6, 68.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  [[TERRA, G_T, 55.3], [LUNA, G_L, 60.1]].forEach(([K, g, th]) => {
    const sx = K[0] + 410, yT = 150, yR = yT + L0;
    // il supporto e la scala in newton (0–20 N)
    ctx.fillStyle = css(C.dim); ctx.fillRect(sx - 70, yT - 12, 140, 12);
    ctx.fillStyle = css(mix(C.dim, C.paper, .85)); ctx.strokeStyle = css(C.panelEdge); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(sx + 70, yR - 14, 70, 278, 8); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
    for (let n = 0; n <= 25; n++) { const y = yR + n * PXN, l = n % 5 ? 12 : 24; ctx.beginPath(); ctx.moveTo(sx + 140 - l, y); ctx.lineTo(sx + 140, y); ctx.stroke(); }
    for (let n = 0; n <= 25; n += 5) txt(ctx, String(n), sx + 154, yR + n * PXN, { size: 30, color: C.dim, align: 'left' });
    txt(ctx, 'N', sx + 105, yR - 40, { size: 30, color: C.dim });
    const xe = MS * g * PXN, kb = P(t, th - .45, th - .1), x = molla(xe, t - th), yb = yR + x;
    disegnaMolla(ctx, sx, yT, yb);
    // l'indice
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, yb); ctx.lineTo(sx + 132, yb); ctx.stroke();
    arrowHead(ctx, [sx + 140, yb], 0, C.v, .8);
    // i 2 kg appesi
    if (kb > 0) {
      ctx.save(); ctx.globalAlpha *= kb;
      ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, yb); ctx.lineTo(sx, yb + 18); ctx.stroke();
      ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.beginPath(); ctx.roundRect(sx - 55, yb + 18, 110, 76, 10); ctx.fill(); ctx.stroke();
      txt(ctx, '2 kg', sx, yb + 57, { size: 32, weight: 600 });
      ctx.restore();
    }
    // la lettura, sul suolo
    const lett = x / PXN;
    drawRich(ctx, '{dim:segna}', sx - 60, GY + 82, { size: 40, align: 'right' });
    fixedNum(ctx, fmtN(lett, 1), sx + 110, GY + 82, 56, C.y);
    txt(ctx, 'N', sx + 124, GY + 82, { size: 56, color: C.y, align: 'left' });
  });
  ctx.restore();
}

// 3 · la bilancia a bracci: confronta le masse (68,4–86,6)
const BRACCIO = 230, FILO = 160, OMB = 2 * Math.PI / 1.4, GAMB = 2.2;
// il giogo: oscillazione smorzata verso l'angolo di riposo (−12° col solo carico a sinistra, 0 coi campioni)
function giogo(t, tCarico, tCampioni) {
  const verso = (a0, a1, tau) => a1 + (a0 - a1) * Math.exp(-GAMB * tau) * (Math.cos(OMB * tau) + GAMB / OMB * Math.sin(OMB * tau));
  const a1 = -12 * Math.PI / 180;
  if (t < tCarico) return 0;
  if (t < tCampioni) return verso(0, a1, t - tCarico);
  return verso(verso(0, a1, tCampioni - tCarico), 0, t - tCampioni);
}
function piatto(ctx, x, y) {   // il piatto appeso: tre fili e il piatto
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x, y - FILO); ctx.lineTo(x - 70, y); ctx.moveTo(x, y - FILO); ctx.lineTo(x + 70, y); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 80, y); ctx.lineTo(x + 80, y); ctx.lineTo(x + 62, y + 14); ctx.lineTo(x - 62, y + 14); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function sceneBracci(ctx, t) {
  if (t < 68.2 || t > 86.8) return;
  const al = life(t, 68.7, 86.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  [[TERRA, G_T, 69.3, 71.4], [LUNA, G_L, 77.2, 77.2]].forEach(([K, g, tc, tk]) => {
    const bx = K[0] + 410, by = 250, th = giogo(t, tc, tk);
    const ex = BRACCIO * Math.cos(th), ey = BRACCIO * Math.sin(th);
    const L = [bx - ex, by - ey], R = [bx + ex, by + ey], yL = L[1] + FILO, yR = R[1] + FILO;
    // la colonna e il giogo
    ctx.fillStyle = css(mix(C.dim, C.paper, .4)); ctx.fillRect(bx - 9, by, 18, GY - by);
    ctx.fillRect(bx - 70, GY - 16, 140, 16);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(R[0], R[1]); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(bx, by - 6); ctx.lineTo(bx - 16, by + 22); ctx.lineTo(bx + 16, by + 22); ctx.closePath(); ctx.fill();
    piatto(ctx, L[0], yL); piatto(ctx, R[0], yR);
    // a sinistra i 2 kg, a destra due campioni da 1 kg
    const k1 = P(t, tc - .4, tc), k2 = P(t, tk - .4, tk);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1; ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(L[0] - 52, yL - 64, 104, 64, 10); ctx.fill(); ctx.stroke();
      txt(ctx, '2 kg', L[0], yL - 32, { size: 30, weight: 600 });
      ctx.restore();
    }
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2; ctx.fillStyle = css(mix(C.y, C.paper, .6)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      for (const dx of [-39, 39]) { ctx.beginPath(); ctx.roundRect(R[0] + dx - 37, yR - 62, 74, 62, 8); ctx.fill(); ctx.stroke(); txt(ctx, '1 kg', R[0] + dx, yR - 31, { size: 30, weight: 600 }); }
      ctx.restore();
    }
    // i pesi dei due piatti: uguali fra loro, più corti sulla Luna (7 px per newton)
    const kf = P(t, 80.9, 81.5);
    if (kf > 0) {
      const Pn = MS * g, lab = fmtN(Pn, 1) + ' N';
      freccia(ctx, [L[0], yL + 18], [L[0], yL + 18 + Pn * 7], C.y, kf);
      freccia(ctx, [R[0], yR + 18], [R[0], yR + 18 + Pn * 7], C.y, kf);
      drawRich(ctx, '{y:' + lab + '}', L[0] + 26, yL + 18 + Math.max(Pn * 3.5, 20), { size: 34, align: 'left', alpha: kf });
      drawRich(ctx, '{y:' + lab + '}', R[0] + 26, yR + 18 + Math.max(Pn * 3.5, 20), { size: 34, align: 'left', alpha: kf });
    }
    drawRich(ctx, 'confronta le {v:masse}: 2 kg = 2 kg', bx, GY + 82, { size: 34, alpha: P(t, 81.6, 82.2) });
  });
  ctx.restore();
}

// 4 · il peso specifico (86,6–98,4): il peso di ogni metro cubo, d·g (d = densità)
function sceneSpecifico(ctx, t) {
  if (t < 86.2 || t > 98.9) return;
  const al = life(t, 86.5, 98.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 728, 680); card(ctx, 1130, 110, 710, 680);
  // un metro cubo d'acqua, in prospettiva obliqua, e il suo peso: una freccia sola
  const u = 30, d = u * .5 * Math.SQRT1_2, Q = (i, j, k) => [560 + i * u + k * d, 690 - j * u - k * d];
  const faccia = (pts, a) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = css(C.x, a); ctx.fill(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 2.5; ctx.stroke(); };
  faccia([Q(0, 0, 0), Q(10, 0, 0), Q(10, 10, 0), Q(0, 10, 0)], .22);
  faccia([Q(0, 10, 0), Q(10, 10, 0), Q(10, 10, 10), Q(0, 10, 10)], .34);
  faccia([Q(10, 0, 0), Q(10, 0, 10), Q(10, 10, 10), Q(10, 10, 0)], .14);
  txt(ctx, '1 m³ d’acqua: massa 1000 kg', 736, 160, { size: 34, weight: 600 });
  const c = Q(5, 5, 5), kp = P(t, 87.2, 88.0);
  if (kp > 0) {
    freccia(ctx, c, [c[0], c[1] + 270 * kp], C.y, 1, 8);
    drawRich(ctx, '{y:peso 9800 N}', c[0] + 28, c[1] + 250, { size: 36, align: 'left', alpha: P(t, 87.8, 88.3) });
  }
  const r = (ta, s2, y, size) => { const k = P(t, ta, ta + .5, E.out); if (k > 0) drawRich(ctx, s2, 1485, y, { size, alpha: k, local: t - ta }); };
  conFont(TITOLI, () => drawRich(ctx, 'peso specifico', 1485, 170, { size: 40, weight: 600 }));
  r(86.9, 'peso / volume = {mink:d·g}', 270, 46);
  r(88.4, '{mink:d}{dim: densità, in kg/m³}', 335, 32);
  r(89.4, 'si misura in {y:N/m³}', 400, 36);
  r(92.8, 'acqua: 1000 kg/m³ · 9,8 m/s²', 540, 34);
  r(94.0, '= {y:9800 N/m³}', 615, 58);
  ctx.restore();
}

// 5 · in una frase (98,5–108,7)
function sceneFine(ctx, t) {
  if (t < 98.4) return;
  const al = 1 - P(t, 106.5, 107.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.7 });
    drawRich(ctx, 'La massa non cambia;\nil peso dipende da dove sei.', W / 2, 290, { size: 70, weight: 600, local: t - 99.1, stagger: .09 });
  });
  const pills = [[490, 'massa {mink:m}, in kg:\n{g:sempre la stessa}'], [960, 'peso: una forza\n{my:P} = {mink:m·g}, in N'], [1430, 'Terra 9,8 m/s²\nLuna ≈ 1,6 m/s²']];
  pills.forEach(([x, s], i) => {
    const a = 101.3 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.2, .4],                                                // Terra e Luna, i due astronauti
    ['pop', 12.6, .45], ['ding', 17.8],                                               // massa 60 kg: non cambia
    ['pop', 27.4, .5],                                                                // P = m·g
    ['pop', 31.9, .5], ['tono', 37.3, 37.9, [.6, .1]], ['ding', 37.9],               // Terra: g = 9,8, P = 588 N
    ['pop', 41.0, .4], ['tono', 41.2, 41.8, [.6, .5]],                                // Luna: g ≈ 1,6, P ≈ 96 N
    ['soffio', 50.6],                                                                 // la bilancia a molla
    ['pop', 55.0, .5], ['tono', 55.3, 56.3, [1, .81, .47, .23, .12, .12, .16, .2, .22, .23, .23]], ['ding', 56.4],   // Terra: segna 19,6 N
    ['pop', 59.8, .5], ['tono', 60.1, 61.1, [1, .97, .91, .87, .86, .86, .86, .87, .87, .87, .87]], ['pop', 61.2, .3],   // Luna: solo 3,2 N
    ['soffio', 68.7], ['pop', 69.1, .45],                                             // la bilancia a bracci, i 2 kg
    ['tono', 69.3, 71.3, [.7, .52, .25, .11, .1, .16, .21, .22, .21, .2, .2]],         // il giogo si inclina
    ['pop', 71.2, .55], ['tono', 71.4, 73.4, [.2, .25, .52, .74, .81, .77, .71, .68, .68, .69, .7]], ['ding', 73.5],   // i campioni: in equilibrio
    ['pop', 77.0, .5], ['ding', 77.5],                                                // sulla Luna: ancora in equilibrio
    ['pop', 81.0, .45], ['pop', 81.6, .5],                                            // i pesi dei piatti, confronta le masse
    ['soffio', 86.5], ['pop', 86.9, .5],                                              // il peso specifico, d·g
    ['tono', 87.2, 88.0, [.7, .1]],                                                   // il peso del metro cubo
    ['pop', 88.4, .35], ['pop', 89.4, .4], ['pop', 92.8, .4], ['ding', 94.3],         // densità, N/m³, acqua: 9800 N/m³
    ['soffio', 98.7], ['pop', 101.3, .5], ['pop', 101.8, .6], ['pop', 102.3, .7],     // in una frase
  ];
  return {
    titolo: 'Sulla Luna pesi meno, ma non dimagrisci', durata: 108.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 50.5, 'massa e peso'], [50.5, 68.5, 'la bilancia a molla'], [68.5, 86.5, 'la bilancia a bracci'], [86.5, 98.4, 'il peso specifico']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneAstronauta(ctx, t); sceneMolle(ctx, t); sceneBracci(ctx, t); sceneSpecifico(ctx, t); sceneFine(ctx, t); },
  };
});
