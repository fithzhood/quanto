'use strict';
/* La cannuccia spezzata — passando dall'aria all'acqua la luce cambia velocità e direzione (rifrazione); l'indice
   n = c/v; entrando verso n maggiore si avvicina alla normale; la cannuccia; il bagnino (tempo minimo, come analogia).
   Primo biennio: niente seni sullo schermo (gli angoli si calcolano nel codice con la legge di Snell). Argomento: ottica. */
CVIDEO.registra('ottica/rifrazione', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, fmtN, card, arrowHead, glowStroke, dashed, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [97.6, 190], [98.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [97.6, 1050], [98.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [97.6, 2.2], [98.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [97.6, 2], [98.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [97.6, -1.5], [98.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'sorpreso'], [12.2, 'pensa'], [16.8, 'neutro'],
  [25.6, 'felice'], [29.8, 'pensa'], [34.6, 'neutro'], [44.2, 'sorpreso'], [49.15, 'neutro'], [53.4, 'pensa'],
  [57.8, 'neutro'], [62.2, 'sorpreso'], [66.8, 'felice'], [71.2, 'neutro'], [84.4, 'festa'], [89.0, 'pensa'],
  [93.4, 'felice'], [97.0, 'neutro'], [100.0, 'felice'], [105.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché una cannuccia nell’acqua\nsembra spezzata?'],
  [7.9, 12.0, 'Una cannuccia nel bicchiere: sotto\nil pelo dell’acqua {r:si piega}.'],
  [12.2, 16.4, 'Eppure è {g:dritta}. Il trucco\nlo fa la luce.'],
  [16.8, 21.0, 'Dall’aria all’acqua il raggio\ncambia direzione: è la {v:rifrazione}.'],
  [21.2, 25.4, 'Angoli dalla {v:normale}: 45° in aria,\ncirca 32° in acqua.'],
  [25.6, 29.6, 'Entrando nell’acqua il raggio\nsi {g:avvicina} alla normale.'],
  [29.8, 34.4, 'Perché? Nell’acqua la luce\nva più {x:piano} che nell’aria.'],
  [34.6, 39.4, 'L’{v:indice di rifrazione} {mink:n} dice\nquante volte è più lenta.'],
  [39.6, 44.0, 'Aria circa 1, acqua circa 1,33,\nvetro circa 1,5.'],
  [44.1, 48.6, 'Nel vetro, con {mink:n} più grande,\nsi piega di più: circa 28°.'],
  [49.15, 53.4, 'Al contrario, uscendo nell’aria,\nil raggio si {v:allontana} dalla normale.'],
  [53.4, 57.6, 'Torniamo alla cannuccia: dalla\npunta partono raggi verso l’alto…'],
  [57.8, 62.0, '…che escono dall’acqua e si piegano,\nallontanandosi dalla normale.'],
  [62.2, 66.6, 'L’occhio li prolunga {v:dritti}:\nla punta sembra più in alto.'],
  [66.8, 71.0, 'Ecco perché la cannuccia\nsembra {r:spezzata}.'],
  [71.2, 75.4, 'Un paragone. Un bagnino deve\nraggiungere chi chiede aiuto.'],
  [75.6, 79.8, 'Corre sulla sabbia a 6 m/s,\nnuota a 2 m/s.'],
  [80.0, 84.2, 'Partono in due, insieme\n(tempo accelerato 4 volte).'],
  [84.4, 88.9, 'Vince chi corre di più sulla\nsabbia: {g:12,6 s} contro 15,5 s.'],
  [89.0, 93.25, 'La dritta è più corta,\nma {r:non è la più veloce}.'],
  [93.4, 97.4, 'Anche la luce segue la strada\nche richiede {g:meno tempo}.'],
  [100.0, 106.0, 'Cambia la velocità, cambia la direzione:\nla luce si {v:rifrange}.'],
];

// ---------- aiutanti ----------
const RAD = Math.PI / 180;
const lung = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
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
function lampo(ctx, p, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 30);
  g.addColorStop(0, css(col, .75)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// impulsi di luce lungo una spezzata, con una velocità (px/s) per ogni tratto: nell'acqua vanno più piano
function impulsi(ctx, pts, vel, t, t0, t1, ogni, col, al = 1) {
  if (t < t0 || al <= 0) return;
  const L = lung(pts);
  for (let n = 0; t0 + n * ogni <= Math.min(t, t1); n++) {
    let e = t - t0 - n * ogni;
    for (let i = 1; i < pts.length; i++) {
      const d = L[i] - L[i - 1], dur = d / vel[i - 1];
      if (e <= dur) { const f = e / dur; lampo(ctx, [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)], col, al * (i === pts.length - 1 ? clamp((1 - f) * d / 60) : 1)); break; }
      e -= dur;
    }
  }
}
function arco(ctx, c, a0, a1, r, col, k = 1, w = 4) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(c[0], c[1], r, a0, lerp(a0, a1, clamp(k)), a1 < a0); ctx.stroke(); ctx.restore();
}
function occhio(ctx, x, y, ang, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';   // il bianco dell'occhio resta bianco nel tema scuro
  ctx.beginPath(); ctx.moveTo(-44, 0); ctx.quadraticCurveTo(0, -38, 44, 0); ctx.quadraticCurveTo(0, 38, -44, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(16, 0, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#10132b'; ctx.beginPath(); ctx.arc(19, 0, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(12, -6, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function lampada(ctx, S, ang, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(S[0], S[1]); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-104, -22, 92, 44, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.roundRect(-14, -26, 16, 52, 5); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La cannuccia spezzata', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 e 3 · la cannuccia nel bicchiere (7,5–16,6 e 53,3–71,1)
// i raggi che dalla punta vanno all'occhio escono dalla superficie dove n·(scarto in acqua) = (scarto in aria), n = 1,33
// la cannuccia pende verso sinistra e l'occhio guarda da destra, basso: i raggi salgono lontano dalla cannuccia e la piega si vede
const NA = 1.33, GL = { x0: 480, x1: 1180, orlo: 455, fondo: 775 }, YW = 485, OCC = [1400, 170], CIMA = [600, 220], PUNTA = [900, 745];
function uscita(T, Eo) {
  const f = x => NA * (x - T[0]) / Math.hypot(x - T[0], YW - T[1]) - (Eo[0] - x) / Math.hypot(Eo[0] - x, Eo[1] - YW);
  let a = T[0], b = Eo[0];
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; }
  return [(a + b) / 2, YW];
}
const OCC2 = [[OCC[0] - 3, OCC[1] - 6], [OCC[0] + 3, OCC[1] + 6]];   // due punti vicinissimi della pupilla: i loro raggi, prolungati, si incrociano dove si vede la punta
const OCC_R = [[OCC[0] - 7, OCC[1] - 14], [OCC[0] + 7, OCC[1] + 14]];   // i due raggi disegnati
function apparente(T) {   // dove l'occhio vede T: l'incrocio dei due raggi prolungati all'indietro
  const r = OCC2.map(Eo => { const X = uscita(T, Eo); return [X, [X[0] - Eo[0], X[1] - Eo[1]]]; });
  const [[p1, d1], [p2, d2]] = r, den = d1[0] * d2[1] - d1[1] * d2[0];
  const k = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + d1[0] * k, p1[1] + d1[1] * k];
}
const sPelo = (YW - CIMA[1]) / (PUNTA[1] - CIMA[1]), PELO = [lerp(CIMA[0], PUNTA[0], sPelo), YW];
const APP = [PELO];
for (let i = 1; i <= 10; i++) { const u = sPelo + (1 - sPelo) * i / 10; APP.push(apparente([lerp(CIMA[0], PUNTA[0], u), lerp(CIMA[1], PUNTA[1], u)])); }
const PUNTA_APP = APP[APP.length - 1];
const RAGGI_C = OCC_R.map(Eo => { const X = uscita(PUNTA, Eo); return { X, pts: [PUNTA, X, Eo] }; });
const colCann = () => mix(C.r, C.paper, .3);
function tubo(ctx, pts, col, al = 1, w = 16) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.restore();
}
function sceneBicchiere(ctx, t) {
  const a1 = life(t, 7.6, 16.6, .6, .4), a3 = life(t, 53.4, 71.1, .5, .5), al = Math.max(a1, a3);
  if (al <= 0) return;
  const spiega = t > 40;   // nella parte 3 si vede la cannuccia vera, e i raggi
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il bicchiere e l'acqua
  ctx.fillStyle = css(C.x, .18); ctx.fillRect(GL.x0 + 3, YW, GL.x1 - GL.x0 - 6, GL.fondo - YW - 3);
  ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(GL.x0, YW); ctx.lineTo(GL.x1, YW); ctx.stroke();
  // la cannuccia: sopra l'acqua com'è; sotto, com'è e come la si vede
  tubo(ctx, [CIMA, PELO], colCann());
  if (!spiega) {
    tubo(ctx, APP, colCann());
    const kv = P(t, 12.5, 13.2);
    if (kv > 0) {
      ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(PELO[0], PELO[1]); ctx.lineTo(PUNTA[0], PUNTA[1]); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:dov’è davvero}', PUNTA[0] + 34, PUNTA[1] - 4, { size: 32, align: 'left', alpha: kv });
    }
  } else {
    tubo(ctx, [PELO, PUNTA], colCann());
    txt(ctx, 'la punta', PUNTA[0] + 34, PUNTA[1] - 4, { size: 30, color: C.dim, align: 'left', alpha: P(t, 53.8, 54.3) });
    // i raggi dalla punta all'occhio, e i prolungamenti
    // i raggi crescono fino al pelo dell'acqua (mentre Stilla dice che partono); il tratto in aria dopo, dal 57,8 s
    RAGGI_C.forEach((R, i) => { const l1 = Math.hypot(R.X[0] - PUNTA[0], R.X[1] - PUNTA[1]), l2 = Math.hypot(R.pts[2][0] - R.X[0], R.pts[2][1] - R.X[1]), fW = l1 / (l1 + l2);
      raggio(ctx, R.pts, fW * P(t, 54.6 + .5 * i, 56.6 + .5 * i, E.lin) + (1 - fW) * P(t, 57.8 + .3 * i, 58.8 + .3 * i, E.lin), C.y, 4); });
    // la normale dove escono
    const kn = life(t, 58.0, 62.2, .4, .4);
    if (kn > 0) { dashed(ctx, [RAGGI_C[1].X[0], YW - 130], [RAGGI_C[1].X[0], YW + 130], C.v, 1, kn); drawRich(ctx, '{v:normale}', RAGGI_C[1].X[0] - 14, YW - 150, { size: 30, align: 'right', alpha: kn }); }
    const ka = P(t, 63.4, 64.0);
    tubo(ctx, APP, C.v, .6 * ka, 12);
    const kx = P(t, 62.5, 63.5);   // i prolungamenti, tratteggiati e spessi: si leggono anche nel tema scuro
    if (kx > 0) RAGGI_C.forEach(R => { ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(R.X[0], R.X[1]); ctx.lineTo(lerp(R.X[0], PUNTA_APP[0], kx), lerp(R.X[1], PUNTA_APP[1], kx)); ctx.stroke(); ctx.restore(); });
    dot(ctx, PUNTA_APP, C.v, ka, 9);
    drawRich(ctx, '{v:sembra}\n{v:qui}', PUNTA_APP[0] + 60, PUNTA_APP[1] + 22, { size: 30, lh: 1.1, align: 'left', alpha: P(t, 63.8, 64.3) });
  }
  // il vetro del bicchiere, sopra a tutto
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(GL.x0, GL.orlo); ctx.lineTo(GL.x0, GL.fondo); ctx.lineTo(GL.x1, GL.fondo); ctx.lineTo(GL.x1, GL.orlo); ctx.stroke();
  occhio(ctx, OCC[0], OCC[1], Math.atan2(YW - OCC[1], 1100 - OCC[0]));
  txt(ctx, 'acqua', GL.x0 + 22, YW + 36, { size: 30, color: C.x, align: 'left' });
  ctx.restore();
}

// 2 · il raggio fra aria e acqua (16,6–53,3)
const I = [800, 440], LI = 330, TH1 = 45 * RAD;
// il vetro torna acqua fra un fumetto e l'altro (48,6–49,1), non mentre Stilla parla
const nSotto = t => kf(t, [[44.4, 1.33], [45.4, 1.5], [48.6, 1.5], [49.1, 1.33]]);
function sceneRaggio(ctx, t) {
  if (t < 16.4 || t > 53.6) return;
  const al = life(t, 16.6, 53.3, .6, .5);
  card(ctx, 110, 110, 1110, 680, al); card(ctx, 1250, 110, 560, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const n2 = nSotto(t), kv = clamp((n2 - 1.33) / .17), th2 = Math.asin(Math.sin(TH1) / n2);
  // l'aria sopra, l'acqua (o il vetro) sotto
  ctx.fillStyle = css(mix(C.x, C.g, kv), .17); ctx.fillRect(112, I[1], 1106, 788 - I[1] - 12);
  ctx.strokeStyle = css(mix(C.x, C.g, kv), .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, I[1]); ctx.lineTo(1218, I[1]); ctx.stroke();
  txt(ctx, 'aria', 150, 170, { size: 34, weight: 600, color: C.dim, align: 'left' });
  txt(ctx, 'acqua', 150, I[1] + 44, { size: 34, weight: 600, color: C.x, align: 'left', alpha: 1 - kv });
  txt(ctx, 'vetro', 150, I[1] + 44, { size: 34, weight: 600, color: C.g, align: 'left', alpha: kv });
  const S = [I[0] - LI * Math.sin(TH1), I[1] - LI * Math.cos(TH1)], R = [I[0] + LI * Math.sin(th2), I[1] + LI * Math.cos(th2)];
  // la normale e gli angoli
  const kn = P(t, 21.4, 22.1);
  dashed(ctx, [I[0], 150], [I[0], 770], C.v, kn, 1);
  drawRich(ctx, '{v:normale}', I[0] + 16, 150, { size: 30, align: 'left', alpha: P(t, 21.8, 22.2) });
  const ka = P(t, 21.9, 22.6), kb = P(t, 22.6, 23.3);
  arco(ctx, I, -Math.PI / 2, -Math.PI / 2 - TH1, 150, C.x, ka);
  arco(ctx, I, Math.PI / 2, Math.PI / 2 - th2, 150, C.g, kb);
  if (ka > 0) { const a = -Math.PI / 2 - TH1 / 2; txt(ctx, '45°', I[0] + 235 * Math.cos(a), I[1] + 235 * Math.sin(a), { size: 40, weight: 600, color: C.x, alpha: ka }); }
  if (kb > 0) { const a = Math.PI / 2 - th2 / 2; txt(ctx, '≈ ' + Math.round(th2 / RAD) + '°', I[0] + 300 * Math.cos(a), I[1] + 300 * Math.sin(a), { size: 40, weight: 600, color: C.g, alpha: kb }); }
  // il raggio: prima dall'aria all'acqua, poi (da 49 s) al contrario, dall'acqua all'aria
  const kAv = 1 - P(t, 48.6, 48.85), kIn = P(t, 48.85, 49.1),   // l'inversione avviene col ritorno all'acqua, prima del fumetto
    vA = 600, vS = 600 / n2;
  raggio(ctx, [S, I, R], P(t, 17.1, 18.3, E.lin), C.y, 5, kAv);
  impulsi(ctx, [S, I, R], [vA, vS], t, 18.4, 48.6, 1.4, C.y, kAv);
  lampada(ctx, S, Math.atan2(I[1] - S[1], I[0] - S[0]), P(t, 16.8, 17.2) * kAv);
  if (kIn > 0) {
    const Rl = [I[0] + 230 * Math.sin(th2), I[1] + 230 * Math.cos(th2)];   // la lampada sott'acqua, dentro la scheda
    raggio(ctx, [Rl, I, S], 1, C.y, 5, kIn);
    impulsi(ctx, [Rl, I, S], [vS, vA], t, 49.2, 53.0, 1.4, C.y, kIn);
    lampada(ctx, Rl, Math.atan2(I[1] - Rl[1], I[0] - Rl[0]), kIn);
  }
  // la scheda: n = c/v e i valori
  const kc = P(t, 34.8, 35.3);
  conFont(TITOLI, () => drawRich(ctx, 'indice di rifrazione', 1530, 175, { size: 38, weight: 600, alpha: kc }));
  drawSeq(ctx, ['{mink:n =}', { num: '{mx:c}', den: '{mx:v}' }], 1530, 285, 60, { local: t - 35.0, alpha: kc });
  drawRich(ctx, '{mx:c}{dim:  velocità della luce nel vuoto}\n{mx:v}{dim:  velocità nel mezzo}', 1530, 410, { size: 30, local: t - 35.8, lh: 1.5 });
  const RIGHE = [['aria', '≈ 1', 0], ['acqua', '≈ 1,33', 1], ['vetro', '≈ 1,5', 2]];
  RIGHE.forEach(([nome, val, i]) => {
    const k = P(t, 39.8 + .5 * i, 40.3 + .5 * i); if (k <= 0) return;
    const ora = (i === 1 && kv < .5 && t > 44) || (i === 2 && kv >= .5);   // il mezzo che si vede sotto
    const y = 530 + 70 * i;
    txt(ctx, nome, 1300, y, { size: 38, weight: ora ? 600 : 500, color: C.ink, align: 'left', alpha: k });
    drawRich(ctx, '{mink:n} ' + val, 1760, y, { size: 38, align: 'right', alpha: k });
  });
  ctx.restore();
}

// 4 · il bagnino (71,1–97,6): vista dall'alto, 25 px per metro; la riva è y = 450
// il bagnino parte da (0; 12 m), il bagnante è in (40 m; −12 m); corre a 6 m/s, nuota a 2 m/s
const PXM = 25, O = [400, 450], VC = 6, VN = 2, ACC = 4, T_VIA = 80.2;
const aPx = (x, y) => [O[0] + x * PXM, O[1] - y * PXM];
const BAGNINO = [0, 12], AIUTO = [40, -12];
function strada(xr) {   // passa dalla riva in (xr; 0): tempi e lunghezze dei due tratti
  const l1 = Math.hypot(xr - BAGNINO[0], BAGNINO[1]), l2 = Math.hypot(AIUTO[0] - xr, AIUTO[1]);
  return { pts: [aPx(...BAGNINO), aPx(xr, 0), aPx(...AIUTO)], l1, l2, t1: l1 / VC, tot: l1 / VC + l2 / VN, lung: l1 + l2 };
}
const DRITTA = strada(20), MIGLIORE = (() => {   // la strada più veloce, cercata al centimetro
  let best = null; for (let x = 0; x <= 40; x += .01) { const s = strada(x); if (!best || s.tot < best.tot) best = s; } return best;
})();
// la luce fra gli stessi due punti: in acqua è 1,33 volte più lenta (non 3 come il bagnino), quindi si piega meno
const LUCE = (() => {
  let xb = 0, tb = Infinity;
  for (let x = 0; x <= 40; x += .01) { const tt = Math.hypot(x, BAGNINO[1]) + 1.33 * Math.hypot(AIUTO[0] - x, AIUTO[1]); if (tt < tb) { tb = tt; xb = x; } }
  return [aPx(...BAGNINO), aPx(xb, 0), aPx(...AIUTO)];
})();
function dove(S, tau) {   // dove si trova dopo tau secondi veri
  const [a, b, c] = S.pts;
  if (tau <= S.t1) return [lerp(a[0], b[0], tau / S.t1), lerp(a[1], b[1], tau / S.t1)];
  const f = Math.min(1, (tau - S.t1) / (S.tot - S.t1)); return [lerp(b[0], c[0], f), lerp(b[1], c[1], f)];
}
function tratteggio(ctx, pts, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col, .9); ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function sceneBagnino(ctx, t) {
  if (t < 70.9 || t > 97.9) return;
  const al = life(t, 71.2, 97.6, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 22); ctx.clip();
  ctx.fillStyle = css(C.y, .13); ctx.fillRect(112, 112, 1696, O[1] - 112);
  ctx.fillStyle = css(C.x, .18); ctx.fillRect(112, O[1], 1696, 788 - O[1]);
  ctx.restore();
  ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, O[1]); ctx.lineTo(1808, O[1]); ctx.stroke();
  drawRich(ctx, 'sabbia{dim:, corsa a 6 m/s}', 150, 390, { size: 32, align: 'left', alpha: P(t, 75.8, 76.3) });
  drawRich(ctx, 'mare{dim:, nuoto a 2 m/s}', 150, 510, { size: 32, align: 'left', alpha: P(t, 76.6, 77.1) });
  // le due strade
  const kd = P(t, 80.0, 80.5);
  tratteggio(ctx, DRITTA.pts, C.r, kd * (1 - .5 * P(t, 93.2, 93.7)));
  tratteggio(ctx, MIGLIORE.pts, C.g, kd * (1 - .5 * P(t, 93.2, 93.7)));   // resta, più tenue, per confrontarla con la luce
  // la luce fa la stessa strada
  raggio(ctx, LUCE, P(t, 93.4, 94.6, E.lin), C.y, 5);
  drawRich(ctx, '{v:principio di Fermat}', 1780, 410, { size: 32, align: 'right', alpha: P(t, 94.4, 94.9) });
  drawRich(ctx, '{y:la luce}{dim:: in acqua 1,33 volte più lenta,}\n{dim:si piega meno del bagnino}', 150, 650, { size: 30, align: 'left', alpha: P(t, 94.6, 95.1) });
  // il bagnante che chiede aiuto
  const [ax, ay] = aPx(...AIUTO);
  ctx.save(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
  for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(ax, ay, 18 + 12 * i + 3 * Math.sin(t * 4 + i), Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  ctx.restore();
  M.ball(ctx, ax, ay, '', C.dim, { r: 16 });
  txt(ctx, 'aiuto!', ax + 36, ay - 6, { size: 30, color: C.ink, align: 'left', alpha: P(t, 71.6, 72.1) });
  // i due bagnini, al tempo accelerato
  const tau = Math.max(0, (t - T_VIA) * ACC);
  const kb = P(t, 71.4, 71.9, E.back);
  M.ball(ctx, ...dove(DRITTA, tau), '', C.r, { r: 17, scale: kb * (t < 80 ? 0 : 1) });
  M.ball(ctx, ...dove(MIGLIORE, tau), '', t < 80 ? C.dim : C.g, { r: 17, scale: kb });
  txt(ctx, 'bagnino', aPx(...BAGNINO)[0] + 32, aPx(...BAGNINO)[1], { size: 30, color: C.ink, align: 'left', alpha: life(t, 71.6, 80.0, .4, .3) });
  // il cronometro
  const kc = P(t, 80.0, 80.5);
  if (kc > 0) {
    card(ctx, 1440, 140, 350, 230, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    txt(ctx, 'tempo vero', 1615, 180, { size: 30, color: C.dim });
    txt(ctx, 'dritta', 1470, 240, { size: 34, color: C.r, align: 'left' });
    txt(ctx, fmtN(Math.min(tau, DRITTA.tot), 1) + ' s', 1760, 240, { size: 38, weight: 600, color: C.r, align: 'right' });
    txt(ctx, 'piegata', 1470, 310, { size: 34, color: C.g, align: 'left' });
    txt(ctx, fmtN(Math.min(tau, MIGLIORE.tot), 1) + ' s', 1760, 310, { size: 38, weight: 600, color: C.g, align: 'right' });
    ctx.restore();
  }
  // le lunghezze: la dritta è più corta
  const kl = life(t, 89.0, 93.2, .4, .4);
  if (kl > 0) {
    const md = aPx(10, 6), mm = aPx(18, 6);
    txt(ctx, fmtN(DRITTA.lung, 1) + ' m', md[0] - 24, md[1] + 30, { size: 32, weight: 600, color: C.r, align: 'right', alpha: kl });
    txt(ctx, fmtN(MIGLIORE.lung, 1) + ' m', mm[0] + 10, aPx(0, 9)[1] - 30, { size: 32, weight: 600, color: C.g, align: 'left', alpha: kl });
  }
  if (t > 80) txt(ctx, 'tempo accelerato 4 volte', 1615, 402, { size: 30, color: C.dim, alpha: life(t, 80.0, 88.9, .4, .4) });
  ctx.restore();
}

// 5 · in una frase (97,6–109)
function sceneFine(ctx, t) {
  if (t < 97.6) return;
  const al = 1 - P(t, 107.4, 108.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.8 });
    drawRich(ctx, 'La luce cambia direzione perché\ncambia {x:velocità} da un mezzo all’altro.', W / 2, 290, { size: 66, weight: 600, local: t - 98.2, stagger: .09 });
  });
  const pills = [[490, '{mink:n = }{mx:c}{mink: / }{mx:v}\n{dim:acqua ≈ 1,33, vetro ≈ 1,5}'], [960, 'verso un {mink:n} maggiore:\nsi {g:avvicina} alla normale'], [1430, 'la cannuccia: l’occhio\nprolunga i raggi {v:dritti}']];
  pills.forEach(([x, s], i) => {
    const a = 100.0 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['traccia', 12.5, 13.2], ['pop', 13.0, .5],                      // la cannuccia: dov'è davvero
    ['soffio', 16.6], ['pop', 17.0, .45],                                             // aria e acqua, la lampada
    ['traccia', 17.1, 18.3], ['tono', 17.1, 18.3, [1, .5, 0]],                        // il raggio scende e si piega
    ['traccia', 21.4, 22.1], ['pop', 22.5, .5], ['pop', 23.2, .55],                   // la normale, 45 e 32 gradi
    ['pop', 35.0, .5],                                                                // n = c/v
    ['pop', 39.9, .4], ['pop', 40.4, .5], ['pop', 40.9, .6],                          // aria, acqua, vetro
    ['tono', 44.4, 45.4, [.36, .35, .33, .31, .31]],                                  // nel vetro si piega di più
    ['pop', 49.0, .45],                                                               // al contrario: la lampada sotto
    ['soffio', 53.4], ['pop', 54.0, .4],                                              // di nuovo la cannuccia, la punta
    ['traccia', 54.6, 57.1], ['traccia', 57.8, 59.1], ['traccia', 58.0, 58.4],        // i raggi escono, la normale
    ['traccia', 62.5, 63.5], ['pop', 63.7, .6], ['ding', 67.0],                       // i prolungamenti: sembra qui
    ['soffio', 71.2], ['pop', 71.6, .5],                                              // il bagnino
    ['pop', 76.0, .35], ['pop', 76.8, .4],                                            // sabbia e mare
    ['traccia', 80.0, 80.5],                                                          // le due strade
    ['tono', 80.2, 84.09, [0, .25, .5, .75, 1]],                                      // il cronometro corre
    ['ding', 83.36], ['pop', 84.09, .35],                                             // arriva la piegata, poi la dritta
    ['pop', 89.2, .45],                                                               // le lunghezze
    ['traccia', 93.4, 94.6], ['pop', 94.6, .55],                                      // la luce: Fermat
    ['soffio', 97.7], ['pop', 100.0, .5], ['pop', 100.5, .6], ['pop', 101.0, .7],     // in una frase
  ];
  return {
    titolo: 'La cannuccia spezzata', durata: 109, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[16.6, 53.3, 'la rifrazione'], [53.3, 71.1, 'la cannuccia'], [71.1, 97.6, 'il bagnino']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneBicchiere(ctx, t); sceneRaggio(ctx, t); sceneBagnino(ctx, t); sceneFine(ctx, t); },
  };
});
