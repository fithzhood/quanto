'use strict';
/* La mela e la Luna — la legge di gravitazione F = G·m₁·m₂/r² (r fra i centri, G ≈ 6,67·10⁻¹¹ N·m²/kg²): forze uguali e
   opposte; distanza doppia, forza un quarto; tripla, un nono (frecce lunghe in proporzione). Per la mela, a un raggio
   terrestre (≈ 6370 km) dal centro, a = G·M/R² = g ≈ 9,8 m/s². La Luna è a circa 60 raggi: a = 9,8/3600 ≈ 2,7·10⁻³ m/s²; dal suo
   moto (T = 27,3 giorni, r ≈ 384 000 km) ω²·r ≈ 2,7·10⁻³ m/s²: torna, circa (il conto di Newton).
   La mela cade davvero: s = ½·g·t², al rallentatore. Argomento: gravitazione. */
CVIDEO.registra('gravitazione/newton', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot, drawSeq } = M;

const T_FINE = 91.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.0, 'sorpreso'], [26.7, 'neutro'],
  [35.7, 'felice'], [40.2, 'neutro'], [49.7, 'felice'], [54.3, 'neutro'], [59.0, 'pensa'], [63.6, 'neutro'],
  [77.6, 'festa'], [82.1, 'felice'], [86.8, 'neutro'], [T_FINE, 'neutro'], [94.0, 'felice'], [98.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'La forza che fa cadere la mela\narriva alla Luna?'],
  [7.9, 12.3, 'Newton: due corpi qualsiasi\nsi {g:attraggono}.'],
  [12.4, 17.2, 'La forza è {my:F} = {mink:G·m₁·m₂/r²},\ncon {mink:m₁} e {mink:m₂} le due masse.'],
  [17.3, 21.9, '{mink:r} è la distanza fra i {g:centri},\nnon fra le superfici.'],
  [22.0, 26.6, '{mink:G} ≈ 6,67·10{mink:⁻¹¹} N·m²/kg²:\nun numero piccolissimo.'],
  [26.7, 31.1, 'Le due forze sono {g:uguali} e opposte,\nanche con masse diverse.'],
  [31.2, 35.6, 'Distanza doppia: la forza\ndiventa {g:un quarto}.'],
  [35.7, 40.0, 'Distanza tripla:\n{g:un nono}.'],
  [40.2, 44.8, 'La mela è a un raggio terrestre\ndal centro: circa 6370 km.'],
  [44.9, 49.6, 'La Terra ha massa {mink:M}: per la mela\n{mv:a} = {my:F}/{mink:m} = {mink:G·M/R²}.'],
  [49.7, 54.2, 'Fa {mv:g} ≈ 9,8 m/s², qualunque\nsia la massa della mela.'],
  [54.3, 58.9, 'La Luna è circa {g:60 volte} più\nlontana dal centro della Terra.'],
  [59.0, 63.5, 'Distanza 60 volte: accelerazione\n60² = 3600 volte più piccola…'],
  [63.6, 68.2, '…cioè 9,8 / 3600\n≈ 2,7·10{mink:⁻³} m/s².'],
  [68.3, 72.8, 'Ma la Luna gira attorno alla Terra:\nun giro ogni 27,3 giorni.'],
  [72.9, 77.5, '{mx:ω} è la {x:velocità angolare};\nnel moto circolare {mv:a} = {mx:ω}{mink:²·r}.'],
  [77.6, 82.0, 'Fa ancora circa 2,7·10{mink:⁻³} m/s²:\n{g:torna}!'],
  [82.1, 86.7, 'La stessa forza fa cadere la mela\ne regge l’orbita della Luna.'],
  [86.8, 91.3, 'Newton fece questo conto con i\ndati del suo tempo: tornava, circa.'],
  [94.0, 99.0, 'Una sola gravità, {my:F} = {mink:G·m₁·m₂/r²},\ndalla mela fino alla Luna.'],
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
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function sfera(ctx, p, r, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0] - r * .35, p[1] - r * .4, r * .1, p[0], p[1], r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .45))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La mela e la Luna', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · due masse che si attraggono (7,5–40): la distanza raddoppia e triplica, le frecce seguono 1/r²
//     (222 px a distanza r, poi 55,5 e 24,7 px); partono dalla superficie, una appena sopra e una appena sotto la retta dei
//     centri, così a distanza r non si coprono
const X1 = 165, YM = 470, R0 = 295, RA = 40, RB = 28, LF = 222, DY = 15;
const distanza = t => R0 * (1 + P(t, 31.4, 33.2) + P(t, 35.8, 37.4));
function sceneMasse(ctx, t) {
  const al = life(t, 7.6, 40.1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const d = distanza(t), x2 = X1 + d, L = LF * (R0 / d) ** 2;
  sfera(ctx, [X1, YM], RA, mix(C.dim, C.v, .25)); sfera(ctx, [x2, YM], RB, mix(C.dim, C.x, .25));
  drawRich(ctx, '{mink:m₁}', X1, YM + 100, { size: 44 }); drawRich(ctx, '{mink:m₂}', x2, YM + 100, { size: 44 });
  // la distanza fra i centri
  const kr = P(t, 17.4, 17.9);
  if (kr > 0) {
    const yr = YM - 130;
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(X1, yr); ctx.lineTo(x2, yr); ctx.moveTo(X1, yr - 12); ctx.lineTo(X1, yr + 12); ctx.moveTo(x2, yr - 12); ctx.lineTo(x2, yr + 12); ctx.stroke(); ctx.restore();
    dashed(ctx, [X1, yr + 12], [X1, YM], C.dim, 1, .6 * kr); dashed(ctx, [x2, yr + 12], [x2, YM], C.dim, 1, .6 * kr);
    const n = Math.round(d / R0), nome = d / R0 > 1.05 && Math.abs(d / R0 - n) < .02 ? n + 'r' : 'r';
    fondo(ctx, (X1 + x2) / 2, yr - 30, 70, 44, kr);
    drawRich(ctx, '{mink:' + (d / R0 < 1.02 ? 'r' : nome) + '}', (X1 + x2) / 2, yr - 30, { size: 40, alpha: kr * (Math.abs(d / R0 - Math.round(d / R0)) < .02 ? 1 : 0) });
  }
  // le due forze, uguali e opposte, sulla retta dei centri
  const kF = P(t, 8.2, 8.7);
  const a1 = X1 + Math.sqrt(RA * RA - DY * DY), a2 = x2 - Math.sqrt(RB * RB - DY * DY);   // dalla superficie
  freccia(ctx, [a1, YM - DY], [a1 + L, YM - DY], C.y, kF, 7);
  freccia(ctx, [a2, YM + DY], [a2 - L, YM + DY], C.y, kF, 7);
  drawRich(ctx, '{my:F}', a1 + Math.max(L, 44) / 2, YM - DY - 38, { size: 38, alpha: kF });
  drawRich(ctx, '{my:F}', a2 - Math.max(L, 44) / 2, YM + DY + 38, { size: 38, alpha: kF });
  ctx.restore();
}

// 2 · la mela (40–54,3): la Terra (non in scala con l'albero), la mela cade da 2 m: s = ½·g·t², al rallentatore 4 volte
const TC = [560, 770], RT = 330, SUOLO = TC[1] - RT, PXM_M = 34, T_CADE = 49.9;
function sceneMela(ctx, t) {
  const al = life(t, 40.0, 54.4, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(110, 110, 1000, 680); ctx.clip();
  sfera(ctx, TC, RT, mix(C.x, C.g, .35));
  // l'albero
  ctx.strokeStyle = css(mix(C.y, C.ink, .55)); ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(500, SUOLO + 4); ctx.lineTo(500, SUOLO - 150); ctx.stroke();
  sfera(ctx, [500, SUOLO - 190], 70, mix(C.g, C.ink, .2));
  // la mela: appesa a 2 m, poi cade
  const tau = Math.max(0, t - T_CADE) / 4, h = Math.max(0, 2 - .5 * 9.8 * tau * tau);
  const pm = [548, SUOLO - 14 - h * PXM_M];
  if (h >= 2) { ctx.strokeStyle = css(mix(C.y, C.ink, .55)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(548, SUOLO - 190 + 50); ctx.lineTo(548, pm[1] - 12); ctx.stroke(); }
  sfera(ctx, pm, 14, C.r);
  // il raggio: dal centro della Terra alla mela
  const kR = P(t, 40.4, 40.9);
  if (kR > 0) {
    dashed(ctx, TC, [548, SUOLO], C.ink, 1, kR);
    dot(ctx, TC, C.ink, kR, 8);
    fondo(ctx, 660, TC[1] - 4, 104, 38, kR); txt(ctx, 'centro', 660, TC[1] - 4, { size: 30, color: C.dim, alpha: kR });
    fondo(ctx, 690, SUOLO + 170, 240, 46, kR); drawRich(ctx, '{mink:R} ≈ 6370 km', 690, SUOLO + 170, { size: 36, alpha: kR });
  }
  // l'accelerazione della mela, mentre cade (60 px per g)
  const kg = life(t, 49.8, 54.3, .3, .4);
  if (kg > 0) { freccia(ctx, [pm[0] + 34, pm[1]], [pm[0] + 34, pm[1] + 60], C.v, kg, 6); drawRich(ctx, '{mv:g}', pm[0] + 68, pm[1] + 30, { size: 40, alpha: kg }); }
  ctx.restore();
  txt(ctx, 'Terra e albero non in scala', 140, 150, { size: 30, color: C.dim, align: 'left', alpha: al });
  txt(ctx, t > T_CADE && h > 0 ? 'al rallentatore' : '', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: al });
}

// 3 · la Luna (54,3–91,6): distanze in scala (4,5 px per raggio terrestre), Terra e Luna ingrandite; un giro in 10 s
const TL = [610, 450], DL = 60 * 4.5, T_GIRA = 68.4;
function sceneLuna(ctx, t) {
  const al = life(t, 54.3, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink, .25); ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
  ctx.beginPath(); ctx.arc(TL[0], TL[1], DL, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  const ang = Math.max(0, t - T_GIRA) / 10 * 2 * Math.PI, pl = [TL[0] + DL * Math.cos(ang), TL[1] - DL * Math.sin(ang)];
  // la distanza: 60 raggi terrestri
  const kD = life(t, 54.5, 68.3, .4, .4);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(TL[0], TL[1] + 40); ctx.lineTo(pl[0], TL[1] + 40); ctx.stroke();
    for (let i = 0; i <= 60; i += 10) { const x = TL[0] + i * 4.5; ctx.beginPath(); ctx.moveTo(x, TL[1] + 32); ctx.lineTo(x, TL[1] + 48); ctx.stroke(); }
    ctx.restore();
    drawRich(ctx, 'circa 60 {mink:R}', (TL[0] + pl[0]) / 2, TL[1] + 80, { size: 36, alpha: kD });
  }
  sfera(ctx, TL, 16, mix(C.x, C.g, .35));
  sfera(ctx, pl, 10, mix(C.dim, C.paper, .2));
  txt(ctx, 'Terra', TL[0], TL[1] - 40, { size: 30, color: C.dim });
  // l'accelerazione della Luna: verso il centro della Terra
  const ka = P(t, 73.0, 73.5);
  if (ka > 0) {
    const u = [(TL[0] - pl[0]) / DL, (TL[1] - pl[1]) / DL];
    freccia(ctx, [pl[0] + u[0] * 14, pl[1] + u[1] * 14], [pl[0] + u[0] * 84, pl[1] + u[1] * 84], C.v, ka, 6);
    drawRich(ctx, '{mv:a}', pl[0] + u[0] * 50 - u[1] * 32, pl[1] + u[1] * 50 + u[0] * 32, { size: 40, alpha: ka });
  }
  txt(ctx, 'Luna', pl[0] + 66, pl[1], { size: 30, color: C.dim, alpha: 1 - P(t, T_GIRA - .4, T_GIRA) });
  txt(ctx, 'distanze in scala; Terra e Luna ingrandite', 140, 150, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, t > T_GIRA ? 'tempo accelerato' : '', 1085, 150, { size: 30, color: C.dim, align: 'right' });
  ctx.restore();
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  sceneMasse(ctx, t); sceneMela(ctx, t); sceneLuna(ctx, t);
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 12.2 || t > T_FINE + .3) return;
  const al = life(t, 12.4, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · la legge
  const s1 = life(t, 12.4, 40.1, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'gravitazione universale');
    drawSeq(ctx, ['{my:F}{mink: = G·}', { num: '{mink:m₁·m₂}', den: '{mink:r²}' }], 1480, 275, 58, { local: t - 12.6 });
    drawRich(ctx, '{mink:m₁}, {mink:m₂}{dim:: le due masse}', 1480, 380, { size: 34, local: t - 13.6 });
    drawRich(ctx, '{mink:r}{dim:: distanza fra i centri}', 1480, 430, { size: 34, local: t - 17.5 });
    drawRich(ctx, '{mink:G} ≈ 6,67·10{mink:⁻¹¹} N·m²/kg²', 1480, 490, { size: 34, local: t - 22.2 });
    riga(540, P(t, 31.3, 31.7));
    const tab = [[31.4, '{mink:r}', '{my:F}'], [33.3, '{mink:2r}', '{my:F} / 4'], [37.5, '{mink:3r}', '{my:F} / 9']];
    tab.forEach(([ta, d, f], i) => {
      const k = P(t, ta, ta + .4), y = 590 + 55 * i;
      drawRich(ctx, '{dim:distanza} ' + d, 1400, y, { size: 36, align: 'right', alpha: k });
      drawRich(ctx, '{dim:→ forza} ' + f, 1460, y, { size: 36, align: 'left', alpha: k });
    });
    ctx.restore();
  }
  // 2 · la mela
  const s2 = life(t, 40.2, 54.3, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'la mela');
    drawRich(ctx, '{mink:r} = {mink:R} ≈ 6370 km', 1480, 245, { size: 36, local: t - 40.4 });
    drawRich(ctx, '{mink:M}{dim:: massa della Terra}', 1480, 330, { size: 34, local: t - 45.0 });
    drawRich(ctx, '{mink:m}{dim:: massa della mela}', 1480, 380, { size: 34, local: t - 45.3 });
    drawRich(ctx, '{mv:a} = {my:F}/{mink:m} = {mink:G·M/R²}', 1480, 460, { size: 44, local: t - 45.6 });
    drawRich(ctx, '{dim:la massa della mela si semplifica}', 1480, 520, { size: 30, local: t - 46.6 });
    riga(570, P(t, 49.8, 50.2));
    drawRich(ctx, '{mv:g} ≈ 9,8 m/s²', 1480, 640, { size: 56, local: t - 49.9 });
    ctx.restore();
  }
  // 3 · la Luna: due conti, lo stesso risultato
  const s3 = P(t, 54.4, 54.8);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'la Luna');
    drawRich(ctx, '{dim:distanza} ≈ 60 · {mink:R}', 1480, 235, { size: 36, local: t - 54.5 });
    drawRich(ctx, '{mv:a} = 9,8 / 60² = 9,8 / 3600', 1480, 295, { size: 38, local: t - 59.2 });
    drawRich(ctx, '{v:≈ 2,7·10}{mv:⁻³}{v: m/s²}', 1480, 357, { size: 46, local: t - 63.8 });
    riga(408, P(t, 68.4, 68.8));
    drawRich(ctx, '{dim:dal suo moto:} {mink:T} = 27,3 {dim:giorni}', 1480, 455, { size: 34, local: t - 68.5 });
    drawRich(ctx, '{mx:ω} = 2π/{mink:T} ≈ 2,66·10{mink:⁻⁶} rad/s', 1480, 510, { size: 34, local: t - 73.1 });
    drawRich(ctx, '{mink:r} ≈ 384 000 km', 1480, 562, { size: 34, local: t - 73.6 });
    drawRich(ctx, '{mv:a} = {mx:ω}{mink:²·r} {v:≈ 2,7·10}{mv:⁻³}{v: m/s²}', 1480, 630, { size: 42, local: t - 77.7 });
    drawRich(ctx, '{g:lo stesso valore, circa}', 1480, 705, { size: 36, local: t - 78.3 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (91,6–102)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.4, 101.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La forza che fa cadere la mela\nè la stessa che tiene la Luna.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{my:F} = {mink:G·m₁·m₂/r²}\n{dim:con} {mink:r} {dim:fra i centri}'], [960, 'distanza doppia:\nforza {g:un quarto}'], [1430, 'a 60 raggi: {mv:g}/3600,\ncome dice il moto']];
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
    ['soffio', 7.6], ['pop', 8.2, .5],                                                // due masse, le due forze
    ['pop', 12.6, .55],                                                               // F = G·m₁·m₂/r²
    ['traccia', 17.4, 17.9], ['pop', 17.5, .4],                                       // r fra i centri
    ['pop', 22.2, .35],                                                               // G ≈ 6,67·10⁻¹¹
    ['tono', 31.4, 33.2, [.9, .89, .82, .68, .51, .42, .39, .38, .38]], ['pop', 33.3, .5],   // distanza doppia: un quarto
    ['tono', 35.8, 37.4, [.38, .37, .36, .34, .31, .29, .28, .28, .28]], ['pop', 37.5, .3],  // distanza tripla: un nono
    ['soffio', 40.2], ['pop', 40.4, .4],                                              // la mela, R ≈ 6370 km
    ['pop', 45.6, .55],                                                               // a = G·M/R²
    ['tono', 49.9, 52.46, [.8, .79, .75, .69, .6, .49, .35, .19, 0]], ['ding', 50.4], ['pop', 52.46, .2],   // cade: g ≈ 9,8 m/s²
    ['soffio', 54.4], ['pop', 54.5, .45],                                             // la Luna, a 60 raggi
    ['pop', 59.2, .45], ['pop', 63.8, .55],                                           // 9,8 / 3600 ≈ 2,7·10⁻³ m/s²
    ['tono', 68.4, 69.9, [.5, .59, .68, .76, .82]], ['pop', 68.5, .4],                // la Luna gira, T = 27,3 giorni
    ['pop', 73.0, .5], ['pop', 73.1, .4], ['pop', 73.6, .4],                          // a verso il centro, ω, r
    ['pop', 77.8, .6],                                                                // a = ω²·r: lo stesso valore
    ['soffio', 91.8], ['pop', 93.8, .5], ['pop', 94.3, .6], ['pop', 94.8, .7],        // in una frase
  ];
  return {
    titolo: 'La mela e la Luna', durata: 102, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.0, 'la legge di gravitazione'], [40.0, 54.2, 'la mela'], [54.2, T_FINE, 'la Luna']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
