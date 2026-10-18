'use strict';
/* E = m·c² — la massa è energia. c ≈ 3·10⁸ m/s, c² ≈ 9·10¹⁶ m²/s² (kg·m²/s² = J). Un grammo: E = 0,001 kg · 9·10¹⁶
   m²/s² = 9·10¹³ J = 2,5·10⁷ kWh (1 kWh = 3,6·10⁶ J): con circa 2700 kWh all'anno per famiglia, 9259 anni, «più di
   9000». Bruciando 1 kg di metano (5,55·10⁷ J) la massa cala di 5,55·10⁷/9·10¹⁶ ≈ 6·10⁻¹⁰ kg: meno di un miliardesimo.
   Il Sole: potenza 3,8·10²⁶ W → m = E/c² = 3,8·10²⁶/9·10¹⁶ ≈ 4,2·10⁹ kg al secondo ≈ 4,2 milioni di tonnellate; nel nucleo
   ogni secondo circa 600 milioni di t di idrogeno diventano 596 milioni di t di elio (lo 0,7 % in meno); in 4,6 miliardi
   di anni ha perso circa 6·10²⁶ kg, 3·10⁻⁴ della sua massa (2·10³⁰ kg): meno di un millesimo. Tutto ricontrollato con node.
   Il moto: la luce lascia il Sole in TEMPO REALE (non al rallentatore), alla scala del disegno: raggio del Sole 696 000 km
   = 150 px, quindi c = 299 792 km/s = 64,6 px/s; un fronte ogni secondo. Il contatore della massa persa corre in tempo
   reale, 4,22 milioni di t ogni secondo. Colori: la luce e il Sole C.y, la cosa nuova (E = m·c²) C.v, risultati e
   energia C.g, «non si nota» C.r. Argomento: relativita. */
CVIDEO.registra('relativita/massa-energia', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fixedNum, fmtN, card } = M;
  const TAU = Math.PI * 2;

const T_FINE = 80.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.3, 'sorpreso'], [22.9, 'neutro'],
  [27.5, 'festa'], [31.7, 'pensa'], [36.6, 'neutro'], [47.5, 'pensa'], [53.7, 'sorpreso'], [58.3, 'neutro'],
  [62.7, 'felice'], [67.9, 'neutro'], [74.0, 'felice'], [86.2, 'occhiolino'],
];
const FUMETTI = [
  [2.4, 6.4, 'Quanta energia c’è in un grammo\ndi materia?'],
  [7.9, 13.1, 'Per Einstein una massa {mink:m} vale\nun’energia {mink:E} = {mink:m}·{mink:c}².'],
  [13.2, 18.2, '{mink:c} è la velocità della luce,\ncirca 3·10⁸ m/s.'],
  [18.3, 22.8, '{mink:c}² ≈ {g:9·10¹⁶}: un numero enorme.'],
  [22.9, 27.4, 'Per un grammo di massa:\n{mink:E} ≈ {g:9·10¹³ J}.'],
  [27.5, 31.6, 'È l’elettricità di una famiglia\nper più di 9000 anni.'],
  [31.7, 36.2, 'Ma bruciando gas o benzina la massa\ncala meno di un miliardesimo.'],
  [36.6, 42.1, 'Il Sole splende con una potenza\ndi 3,8·10²⁶ W.'],
  [42.2, 47.4, 'La luce parte a {mink:c}: in tempo reale,\nogni secondo fa quasi mezzo raggio.'],
  [47.5, 53.6, 'Quanta massa se ne va? Basta dividere\nper {mink:c}²: {mink:m} = {mink:E}/{mink:c}².'],
  [53.7, 58.2, 'Ogni secondo il Sole perde circa\n{g:4 milioni di tonnellate}.'],
  [58.3, 62.6, 'Il contatore corre in tempo reale:\nquattro milioni ogni secondo.'],
  [62.7, 67.8, 'Nel nucleo l’idrogeno si fonde in elio,\ne l’elio pesa un po’ meno.'],
  [67.9, 73.9, 'Su 600 milioni di tonnellate di idrogeno\nal secondo, 4 milioni diventano energia.'],
  [74.0, 79.8, 'In 4,6 miliardi di anni ha perso meno\ndi un millesimo della sua massa.'],
  [82.4, 88.1, 'La massa è energia: poca massa,\ntantissima energia. {mink:E} = {mink:m}·{mink:c}².'],
];

// ---------- aiutanti ----------
// un cubetto di materia in assonometria, centrato in (x, y), lato s
function cubetto(ctx, x, y, s, al) {
  if (al <= 0) return;
  const d = s * .42;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineJoin = 'round'; ctx.strokeStyle = css(mix(C.ink, C.paper, .3)); ctx.lineWidth = 3;
  const x0 = x - s / 2 - d / 2, y0 = y - s / 2 + d / 2;
  ctx.fillStyle = css(mix(C.ink, C.paper, .78));
  ctx.beginPath(); ctx.rect(x0, y0, s, s); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.ink, C.paper, .88));
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + d, y0 - d); ctx.lineTo(x0 + s + d, y0 - d); ctx.lineTo(x0 + s, y0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.ink, C.paper, .66));
  ctx.beginPath(); ctx.moveTo(x0 + s, y0); ctx.lineTo(x0 + s + d, y0 - d); ctx.lineTo(x0 + s + d, y0 + s - d); ctx.lineTo(x0 + s, y0 + s); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function scritta(ctx, s, x, y, size, al) {   // testo ricco su un fondino color carta
  if (al <= 0) return;
  fondo(ctx, x, y, richW(ctx, s, size) + 20, size * 1.35, al * .92);
  drawRich(ctx, s, x, y, { size, alpha: al });
}
function riga(ctx, x0, x1, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
}

// ---------- 1 · la formula e un grammo (7,5–36,4) ----------
const SX = [110, 110, 780, 680], DX = [930, 110, 880, 680];
function scenaGrammo(ctx, t) {
  if (t < 7.5 || t > 36.8) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 36.2, 36.6));
  ctx.save(); ctx.globalAlpha *= al;
  // a sinistra: la formula
  card(ctx, SX[0], SX[1], SX[2], SX[3]);
  const cs = SX[0] + SX[2] / 2;
  drawRich(ctx, '{dim:Einstein, 1905}', cs, 180, { size: 34, local: t - 8.0 });
  conFont(TITOLI, () => drawRich(ctx, '{mink:E} = {mink:m}·{mv:c}²', cs, 300, { size: 116, weight: 600, local: t - 8.4 }));
  drawRich(ctx, '{mink:E}{dim:: energia, in J  ·  }{mink:m}{dim:: massa, in kg}', cs, 410, { size: 30, local: t - 9.6 });
  riga(ctx, SX[0] + 60, SX[0] + SX[2] - 60, 460, P(t, 13.2, 13.6));
  drawRich(ctx, '{mink:c} ≈ 3·10⁸ m/s {dim:(la velocità della luce)}', cs, 525, { size: 36, local: t - 13.4 });
  drawRich(ctx, '{mink:c}² ≈ (3·10⁸)² = {g:9·10¹⁶} m²/s²', cs, 610, { size: 44, local: t - 18.5 });
  drawRich(ctx, '{dim:e kg·m²/s² fa proprio J}', cs, 680, { size: 30, local: t - 19.6 });
  // a destra: un grammo
  card(ctx, DX[0], DX[1], DX[2], DX[3]);
  const cd = DX[0] + DX[2] / 2;
  const kG = P(t, 22.9, 23.4);
  cubetto(ctx, DX[0] + 120, 250, 70, kG);
  drawRich(ctx, '1 g = 0,001 kg', DX[0] + 210, 245, { size: 44, align: 'left', alpha: kG });
  drawRich(ctx, '{mink:E} = 0,001 kg · 9·10¹⁶ m²/s²', cd, 360, { size: 38, local: t - 23.4 });
  drawRich(ctx, '= {g:9·10¹³ J}', cd, 440, { size: 60, local: t - 24.3 });
  riga(ctx, DX[0] + 60, DX[0] + DX[2] - 60, 505, P(t, 27.5, 27.9));
  // la famiglia (27,5–31,6), poi il gas (31,7–36,2)
  const kF = life(t, 27.5, 31.6, .3, .3);
  if (kF > 0) {
    ctx.save(); ctx.globalAlpha *= kF;
    drawRich(ctx, '{dim:con 1 kWh = 3,6·10⁶ J:} 9·10¹³ J = 2,5·10⁷ kWh', cd, 565, { size: 32, local: t - 27.6 });
    drawRich(ctx, '{dim:una famiglia ne usa circa 2700 all’anno}', cd, 625, { size: 30, local: t - 28.2 });
    drawRich(ctx, '{g:più di 9000 anni}', cd, 700, { size: 48, local: t - 28.9 });
    ctx.restore();
  }
  const kB = P(t, 31.7, 32.0);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    drawRich(ctx, '{dim:bruciando 1 kg di metano:} 5,5·10⁷ J', cd, 565, { size: 32, local: t - 31.8 });
    drawRich(ctx, '{dim:massa persa:} 5,5·10⁷ / 9·10¹⁶ ≈ 6·10⁻¹⁰ kg', cd, 625, { size: 32, local: t - 32.6 });
    drawRich(ctx, '{r:meno di un miliardesimo}', cd, 700, { size: 44, local: t - 33.6 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · il Sole, in tempo reale (36,4–80) ----------
const SOLE = { x: 430, y: 450, r: 150 };                // raggio 696 000 km = 150 px
const C_PX = SOLE.r * 299792 / 696000;                  // la luce: 64,6 px al secondo, in tempo reale
const PERDITA = 3.8e26 / 9e16 / 1e9;                    // 4,22 milioni di t al secondo
const T_CONT = 58.3;                                     // da qui corre il contatore
const ZONA = [114, 114, 846, 672];                       // dove si disegnano i fronti di luce
function scenaSole(ctx, t) {
  if (t < 36.2 || t > T_FINE + .3) return;
  const al = P(t, 36.4, 37.0) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  txt(ctx, 'il Sole · in tempo reale', 150, 150, { size: 30, color: C.dim, align: 'left' });
  // i fronti di luce: uno ogni secondo, partono dalla superficie e corrono a c
  ctx.save(); ctx.beginPath(); ctx.rect(ZONA[0], ZONA[1] + 60, ZONA[2], ZONA[3] - 60); ctx.clip();
  const kL = P(t, 37.0, 37.6);
  for (let k = Math.floor(t) - 8; k <= Math.floor(t); k++) {
    const r = SOLE.r + C_PX * (t - k);
    if (r <= SOLE.r) continue;
    const a = kL * (1 - clamp((r - SOLE.r) / 420, 0, 1));
    if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha *= a * .8; ctx.strokeStyle = css(C.y); ctx.lineWidth = 4; ctx.shadowColor = css(C.y, .5); ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(SOLE.x, SOLE.y, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  // il Sole
  ctx.save();
  const g = ctx.createRadialGradient(SOLE.x - 40, SOLE.y - 40, 10, SOLE.x, SOLE.y, SOLE.r);
  g.addColorStop(0, css(mix(C.y, C.paper, .35))); g.addColorStop(1, css(C.y));
  ctx.fillStyle = g; ctx.shadowColor = css(C.y, .6); ctx.shadowBlur = 40;
  ctx.beginPath(); ctx.arc(SOLE.x, SOLE.y, SOLE.r, 0, TAU); ctx.fill(); ctx.restore();
  // il raggio, per la scala
  const kR = P(t, 42.3, 42.8);
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(SOLE.x, SOLE.y); ctx.lineTo(SOLE.x, SOLE.y + SOLE.r); ctx.stroke(); ctx.restore();
    scritta(ctx, '{dim:raggio:} 700 000 km', SOLE.x, SOLE.y + SOLE.r + 40, 30, kR);
  }
  // il nucleo, dove l'idrogeno diventa elio
  const kN = P(t, 62.8, 63.3);
  if (kN > 0) {
    ctx.save(); ctx.globalAlpha *= kN; ctx.fillStyle = css(mix(C.y, C.r, .45)); ctx.beginPath(); ctx.arc(SOLE.x, SOLE.y, 44, 0, TAU); ctx.fill(); ctx.restore();
    drawRich(ctx, 'nucleo', SOLE.x, SOLE.y - 72, { size: 28, alpha: kN });
  }
  // i conti, a destra
  const cx = 1340;
  conFont(TITOLI, () => drawRich(ctx, 'quanta massa perde', cx, 180, { size: 40, weight: 600, local: t - 36.8 }));
  drawRich(ctx, '{dim:potenza:} 3,8·10²⁶ W {dim:= 3,8·10²⁶ J ogni secondo}', cx, 250, { size: 32, local: t - 37.2 });
  drawRich(ctx, '{dim:la luce in 1 s: 300 000 km, 0,43 raggi del Sole}', cx, 305, { size: 28, local: t - 42.6 });
  drawRich(ctx, '{mink:m} = {mink:E}/{mink:c}² = 3,8·10²⁶ J / 9·10¹⁶ m²/s²', cx, 390, { size: 34, local: t - 47.8 });
  drawRich(ctx, '≈ {g:4,2·10⁹ kg ogni secondo}', cx, 455, { size: 44, local: t - 53.8 });
  drawRich(ctx, '{dim:= 4,2 milioni di tonnellate}', cx, 510, { size: 30, local: t - 54.6 });
  const kC = P(t, T_CONT - .3, T_CONT);
  if (kC > 0) {
    riga(ctx, 920, 1760, 548, kC);
    drawRich(ctx, '{dim:perse da adesso:}', 960, 592, { size: 32, align: 'left', alpha: kC });
    fixedNum(ctx, fmtN(PERDITA * Math.max(0, t - T_CONT), 1), 1500, 592, 46, C.g, kC);
    drawRich(ctx, '{dim:milioni di t}', 1520, 592, { size: 32, align: 'left', alpha: kC });
  }
  riga(ctx, 920, 1760, 632, P(t, 62.7, 63.0));
  drawRich(ctx, '{dim:nel nucleo, ogni secondo:} 600 {dim:milioni di t di idrogeno}', cx, 670, { size: 28, local: t - 63.0 });
  drawRich(ctx, '{dim:→} 596 {dim:di elio, e} {g:4 diventano energia}', cx, 715, { size: 30, local: t - 68.0 });
  drawRich(ctx, '{dim:in 4,6 miliardi di anni:} {g:meno di un millesimo} {dim:della massa}', cx, 760, { size: 30, local: t - 74.1 });
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, '{mink:E} = {mink:m}·{mink:c}²', W / 2, 190, { size: 140, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 88.9, 89.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La massa è energia: {mink:E} = {mink:m}·{mv:c}².\nPoca massa, tantissima energia.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, '{mink:c}² ≈ 9·10¹⁶ m²/s²\n{dim:un numero enorme}'], [960, '1 g {dim:di massa}\n≈ {g:9·10¹³ J}'], [1470, 'il Sole: {g:4 milioni di t}\n{dim:di massa al secondo}']];
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
    ['soffio', 7.6], ['pop', 8.4, .7], ['pop', 9.6, .4],                              // E = m·c²
    ['traccia', 13.2, 13.6], ['pop', 13.4, .5], ['ding', 18.6],                       // c, poi c² ≈ 9·10¹⁶
    ['pop', 22.9, .45], ['pop', 23.4, .55], ['ding', 24.4],                           // un grammo: 9·10¹³ J
    ['traccia', 27.5, 27.9], ['pop', 27.6, .45], ['ding', 29.0],                      // più di 9000 anni
    ['pop', 31.7, .45], ['pop', 32.6, .4], ['pop', 33.6, .15],                        // il metano: meno di un miliardesimo
    ['soffio', 36.4], ['pop', 37.2, .5],                                              // il Sole, la potenza
    ['tono', 37.0, 39.0, [.3, .5]],                                                   // i fronti di luce si allargano
    ['traccia', 42.3, 42.8], ['pop', 42.6, .4],                                       // il raggio, la luce in un secondo
    ['pop', 47.8, .55], ['ding', 53.9], ['pop', 54.6, .45],                           // m = E/c², 4,2·10⁹ kg al secondo
    ['pop', 58.0, .5], ['tono', 58.3, 60.3, [.1, .5]],                                // il contatore corre
    ['traccia', 62.7, 63.0], ['pop', 62.8, .35], ['pop', 63.0, .5], ['pop', 68.0, .6],   // il nucleo: idrogeno in elio
    ['ding', 74.2],                                                                   // meno di un millesimo
    ['soffio', 80.0], ['pop', 82.2, .5], ['pop', 82.7, .6], ['pop', 83.2, .7],        // in una frase
  ];
  return {
    titolo: 'E = m·c²', durata: 90.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 36.4, 'un grammo'], [36.4, T_FINE, 'il Sole']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaGrammo(ctx, t); scenaSole(ctx, t); scenaFine(ctx, t); },
  };
});
