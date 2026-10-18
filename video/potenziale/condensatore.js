'use strict';
/* Il condensatore — due armature piane affacciate collegate a una pila: +Q e −Q, campo uniforme fra loro (linee
   parallele ed equidistanti, una per ogni carica disegnata; bordi trascurati), quasi zero fuori. Con 12 V → Q, con 24 V
   → 2Q: C = Q/V costante, in farad. Grafico V–Q: la retta V = Q/C; l'energia U = Q·V/2 = C·V²/2 è l'area del
   triangolo (ogni carica sale in media V/2). C = ε₀·S/d nel vuoto (ε₀ ≈ 8,85·10⁻¹² F/m): a pila collegata, metà
   distanza → C doppia → carica 4Q, linee doppie (E = V/d doppio). 1 m² a 1 mm: 8,85·10⁻⁹ F. Colori fissi
   dell'elettrostatica: positive C.v, negative C.x, campo C.ink. Argomento: potenziale. */
CVIDEO.registra('potenziale/condensatore', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const T_FINE = 89.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.3, 'felice'], [22.9, 'neutro'],
  [33.8, 'sorpreso'], [39.9, 'felice'], [44.7, 'neutro'], [49.8, 'pensa'], [53.7, 'neutro'], [59.8, 'felice'],
  [64.6, 'neutro'], [74.4, 'sorpreso'], [79.0, 'felice'], [83.3, 'sorpreso'], [86.0, 'neutro'],
  [91.2, 'felice'], [95.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come si mette da parte\nun po’ di carica elettrica?'],
  [7.9, 12.9, 'Due lastre di metallo affacciate, le\n{g:armature}, collegate a una pila.'],
  [13.0, 17.2, 'La pila sposta carica: un’armatura\nprende +{mink:Q}, l’altra −{mink:Q}.'],
  [17.3, 22.8, 'Fra le armature il campo è {g:uniforme}:\nlinee dritte e parallele (bordi a parte).'],
  [22.9, 28.1, 'Fuori i campi delle due armature si\nannullano: il campo {mink:E} è quasi zero.'],
  [28.2, 33.7, 'La pila tiene fra le armature una\ndifferenza di potenziale {mink:V} = 12 V.'],
  [33.8, 39.8, 'Con 24 V la carica {g:raddoppia}: 2{mink:Q},\ne le linee di campo sono il doppio.'],
  [39.9, 44.6, 'Il rapporto {mink:Q}/{mink:V} non cambia: è la\n{g:capacità} {mink:C} del condensatore.'],
  [44.7, 49.7, '{mink:C} = {mink:Q}/{mink:V} si misura in coulomb al volt:\nil {g:farad} (F).'],
  [49.8, 53.6, 'Caricarlo costa lavoro: il condensatore\n{g:immagazzina energia}.'],
  [53.7, 59.7, 'Ogni carica in più sale un dislivello che\ncresce da 0 a {mink:V}: in media {mink:V}/2.'],
  [59.8, 64.5, 'Energia {mink:U} = {mink:Q·V}/2 = {mink:C·V} ²/2:\nè l’area sotto la retta.'],
  [64.6, 69.8, 'Nel vuoto {mink:C} = {mink:ε₀·S/d}: {mink:S} è l’area\ndi un’armatura, {mink:d} la distanza.'],
  [69.9, 74.3, '{mink:ε₀} ≈ 8,85·10{mink:⁻¹²} F/m: è la costante\ndielettrica del vuoto.'],
  [74.4, 78.9, 'Avvicino le armature a metà distanza:\nla capacità {g:raddoppia}.'],
  [79.0, 83.2, 'Con la stessa pila, la carica\nraddoppia ancora: 4{mink:Q}.'],
  [83.3, 88.5, 'Il farad è enorme: 1 m² a 1 mm\nfa appena 8,85·10{mink:⁻⁹} F.'],
  [91.2, 97.4, 'Un condensatore tiene separate +{mink:Q} e −{mink:Q}:\n{mink:C} = {mink:Q}/{mink:V}, e immagazzina energia.'],
];
// ---------- aiutanti ----------
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function etichetta(ctx, s, x, y, al, w = 96, size = 30) { if (al <= 0) return; fondo(ctx, x, y, w, size + 14, al); drawRich(ctx, s, x, y, { size, alpha: al }); }
function segno(ctx, p, s, al, r = 9) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(s > 0 ? C.v : C.x); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); if (s > 0) { ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); } ctx.stroke(); ctx.restore();
}
function linea(ctx, pts, col, w = 4, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}

// ---------- il condensatore, in prospettiva ----------
const CARTA = [110, 110, 1000, 680];
const XL = 470, Y0 = 230, Y1 = 610, PROF = [60, -45];       // armatura sinistra (+); la destra sta a XL + d
const dPx = t => lerp(280, 140, P(t, 74.8, 76.6));           // metà distanza quando Stilla lo dice
const xDestra = t => XL + dPx(t);
const BATT = 540, YB = 730;
// quante cariche (e linee) per armatura: Q ↔ 4, 2Q ↔ 8, 4Q ↔ 16
const NQ = [[0, 4], [34.3, 8], [76.0, 16]];   // la carica raddoppia mentre le armature si avvicinano (pila collegata)
function armatura(ctx, x, s, al, kS = 0) {
  if (al <= 0) return;
  const col = s > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(mix(col, C.paper, .72), mix(C.g, C.paper, .55), kS)); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, Y0); ctx.lineTo(x + PROF[0], Y0 + PROF[1]); ctx.lineTo(x + PROF[0], Y1 + PROF[1]); ctx.lineTo(x, Y1); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function pila(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(BATT - 15, YB - 32); ctx.lineTo(BATT - 15, YB + 32); ctx.stroke();   // polo +, lungo
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(BATT + 15, YB - 17); ctx.lineTo(BATT + 15, YB + 17); ctx.stroke();  // polo −, corto
  ctx.restore();
  txt(ctx, '+', BATT - 40, YB - 34, { size: 30, color: C.v, alpha: al });
  txt(ctx, '−', BATT + 40, YB - 34, { size: 30, color: C.x, alpha: al });
}
// le cariche sulle facce interne e le linee di campo fra loro, una per carica
function cariche(ctx, t, n, al, kl) {
  if (al <= 0) return;
  const xr = xDestra(t);
  for (let i = 0; i < n; i++) {
    const y = Y0 + (i + .5) * (Y1 - Y0) / n;
    if (kl > 0) {
      ctx.save(); ctx.globalAlpha *= al * kl; ctx.strokeStyle = css(mix(C.ink, C.paper, .4)); ctx.lineWidth = 3; ctx.lineCap = 'round';
      const x1 = lerp(XL + 22, xr - 22, kl);
      ctx.beginPath(); ctx.moveTo(XL + 22, y); ctx.lineTo(x1, y); ctx.stroke();
      if (kl > .6) arrowHead(ctx, [(XL + xr) / 2 + 10, y], 0, mix(C.ink, C.paper, .15), .8);
      ctx.restore();
    }
    segno(ctx, [XL + 10, y], 1, al, n > 10 ? 6 : 8);
    segno(ctx, [xr - 10, y], -1, al, n > 10 ? 6 : 8);
  }
}
// alfa di ciascuno stato di carica (Q, 2Q, 4Q): ognuno entra mentre il precedente esce
const statoQ = (t, i) => (i ? P(t, NQ[i][0], NQ[i][0] + .6) : 1) * (i < NQ.length - 1 ? 1 - P(t, NQ[i + 1][0], NQ[i + 1][0] + .6) : 1);
const NOMI_Q = ['Q', '2Q', '4Q'];

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il condensatore', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

function sceneCondensatore(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const xr = xDestra(t), kS = life(t, 64.8, 74.3, .4, .4);
  armatura(ctx, XL, 1, P(t, 8.0, 8.6), kS);
  armatura(ctx, xr, -1, P(t, 8.2, 8.8));
  // i fili e la pila
  const kf = P(t, 8.6, 9.4);
  linea(ctx, [[XL, Y1], [XL, YB], [BATT - 15, YB]], C.ink, 4, kf);
  linea(ctx, [[xr, Y1], [xr, YB], [BATT + 15, YB]], C.ink, 4, kf);
  pila(ctx, kf);
  const kv = P(t, 28.4, 28.9), k24 = P(t, 34.0, 34.5);
  txt(ctx, '12 V', BATT + 40, 764, { size: 30, align: 'left', alpha: kv * (1 - k24) });
  txt(ctx, '24 V', BATT + 40, 764, { size: 30, align: 'left', alpha: k24 });
  // cariche e linee di campo
  const kq = P(t, 13.3, 14.3), kl = P(t, 17.5, 18.7);
  NQ.forEach(([, n], i) => cariche(ctx, t, n, kq * statoQ(t, i), kl));
  NOMI_Q.forEach((s, i) => {
    const k = P(t, 13.9, 14.4) * statoQ(t, i);
    etichetta(ctx, '{v:+}{mink:' + s + '}', 395, 250, k, 80, 36);
    etichetta(ctx, '{x:−}{mink:' + s + '}', xr + 128, 250, k, 80, 36);
  });
  // fuori, campo quasi zero
  const kz = life(t, 23.1, 28.2, .4, .4);
  etichetta(ctx, '{mink:E} ≈ 0', 300, 380, kz, 120, 34);
  etichetta(ctx, '{mink:E} ≈ 0', xr + 190, 380, kz, 120, 34);
  // l'area S e la distanza d
  etichetta(ctx, '{mink:S}', XL - 42, (Y0 + Y1) / 2, kS, 44, 38);   // accanto all'armatura, non sopra cariche e linee
  const kd = life(t, 65.2, T_FINE + .1, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(XL, 168); ctx.lineTo(xr, 168); ctx.moveTo(XL, 156); ctx.lineTo(XL, 180); ctx.moveTo(xr, 156); ctx.lineTo(xr, 180); ctx.stroke(); ctx.restore();
    const k2 = P(t, 75.0, 75.5);
    etichetta(ctx, '{mink:d}', (XL + xr) / 2, 140, kd * (1 - k2), 44, 36);
    etichetta(ctx, '{mink:d}/2', (XL + xr) / 2, 140, kd * k2, 72, 36);
  }
  ctx.restore();
}

// il grafico V–Q nel pannello
const GO = [1250, 740], qx = q => GO[0] + 200 * q, vy = v => GO[1] - 10 * v;
function grafico(ctx, t, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // l'energia: il triangolo che cresce mentre la carica arriva
  const qE = 2 * P(t, 54.0, 57.0, E.lin), kE = life(t, 54.0, 64.6, .2, .4);
  if (kE > 0 && qE > 0) {
    ctx.save(); ctx.globalAlpha *= kE; ctx.fillStyle = css(C.g, .28);
    ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(qx(qE), GO[1]); ctx.lineTo(qx(qE), vy(12 * qE)); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GO[0] - 4, GO[1]); ctx.lineTo(1735, GO[1]); ctx.moveTo(GO[0], GO[1] + 4); ctx.lineTo(GO[0], 475); ctx.stroke();
  arrowHead(ctx, [1741, GO[1]], 0, C.ink); arrowHead(ctx, [GO[0], 469], -Math.PI / 2, C.ink);
  drawRich(ctx, '{mink:Q}', 1770, GO[1], { size: 40 });
  drawRich(ctx, '{mink:V}', 1278, 470, { size: 40, align: 'left' });
  const k1 = P(t, 28.6, 29.1), k2 = P(t, 34.8, 35.3);
  for (const [q, v, k, s] of [[1, 12, k1, 'Q'], [2, 24, k2, '2Q']]) {
    if (k <= 0) continue;
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.setLineDash([7, 7]);
    ctx.beginPath(); ctx.moveTo(qx(q), GO[1]); ctx.lineTo(qx(q), vy(v)); ctx.lineTo(GO[0], vy(v)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:' + s + '}', qx(q), GO[1] + 30, { size: 34, alpha: k });
    txt(ctx, v + ' V', GO[0] - 14, vy(v), { size: 30, color: C.dim, align: 'right', alpha: k });
  }
  // la retta per l'origine: V = Q/C
  const kr = P(t, 40.1, 41.0);
  if (kr > 0) {
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(lerp(GO[0], qx(2.25), kr), lerp(GO[1], vy(27), kr)); ctx.stroke(); ctx.restore();
  }
  for (const [q, v, k] of [[1, 12, k1], [2, 24, k2]]) if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(qx(q), vy(v), 8, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  // la carica che arriva sale la retta; poi il dislivello medio V/2
  if (kE > 0 && t < 57.3) { ctx.save(); ctx.globalAlpha *= kE; ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(qx(qE), vy(12 * qE), 10, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  const km = life(t, 57.4, 64.6, .4, .4);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(GO[0], vy(12)); ctx.lineTo(qx(2), vy(12)); ctx.stroke(); ctx.restore();
    etichetta(ctx, '{mink:V}/2', qx(2) + 52, vy(12), km, 76, 32);
  }
  etichetta(ctx, '{mink:U}', qx(1.35), vy(4.5), life(t, 59.9, 64.6, .4, .4), 44, 36);
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  grafico(ctx, t, life(t, 28.2, 64.7, .5, .5));
  blocco(7.9, 49.8, () => {
    conFont(TITOLI, () => drawRich(ctx, 'condensatore', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{v:+}{mink:Q} {dim:e} {x:−}{mink:Q}{dim:: carica delle armature}', cx, 220, { size: 30, local: t - 13.1 });
    drawRich(ctx, '{dim:fra le armature:} {g:campo uniforme}', cx, 262, { size: 30, local: t - 17.4 });
    drawRich(ctx, '{dim:fuori: quasi zero}', cx, 304, { size: 30, local: t - 23.0 });
    drawRich(ctx, '{mink:V}{dim:: differenza di potenziale}', cx, 346, { size: 30, local: t - 28.3 });
    drawRich(ctx, '{g:capacità} {mink:C} = {mink:Q}/{mink:V}', cx, 398, { size: 40, local: t - 40.0 });
    drawRich(ctx, '{dim:in farad: 1 F = 1 C/V}', cx, 440, { size: 30, local: t - 44.8 });
  });
  blocco(49.8, 64.7, () => {
    conFont(TITOLI, () => drawRich(ctx, 'energia immagazzinata', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:dislivello medio:} {mink:V}/2', cx, 240, { size: 34, local: t - 57.4 });
    drawRich(ctx, '{mink:U} = {mink:Q·V}/2 = {mink:C·V} ²/2', cx, 320, { size: 42, local: t - 59.9 });
    drawRich(ctx, '{dim:l’area sotto la retta}', cx, 380, { size: 30, local: t - 60.3 });
  });
  blocco(64.7, T_FINE + .1, () => {
    drawRich(ctx, '{mink:C} = {mink:ε₀·S/d}', cx, 180, { size: 56, local: t - 64.8 });
    drawRich(ctx, '{mink:S}{dim:: area di un’armatura}', cx, 250, { size: 32, local: t - 65.2 });
    drawRich(ctx, '{mink:d}{dim:: distanza fra le armature}', cx, 295, { size: 32, local: t - 65.5 });
    drawRich(ctx, '{mink:ε₀} ≈ 8,85·10{mink:⁻¹²} F/m', cx, 360, { size: 36, local: t - 70.0 });
    drawRich(ctx, '{dim:costante dielettrica del vuoto}', cx, 408, { size: 30, local: t - 70.3 });
    separa(ctx, 450, P(t, 74.5, 74.9));
    drawRich(ctx, '{mink:d} → {mink:d}/2{dim::} {mink:C} → 2{mink:C}', cx, 500, { size: 38, local: t - 74.6 });
    drawRich(ctx, '{dim:stessa pila: carica} 4{mink:Q}', cx, 555, { size: 32, local: t - 79.1 });
    separa(ctx, 600, P(t, 83.4, 83.8));
    drawRich(ctx, '1 m² {dim:a} 1 mm{dim::} {mink:C} ≈ 8,85·10{mink:⁻⁹} F', cx, 650, { size: 32, local: t - 83.4 });
    drawRich(ctx, '{dim:il farad è un’unità enorme}', cx, 700, { size: 30, local: t - 83.8 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 98.7, 99.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due armature con cariche opposte:\nla capacità dice quanta carica per volt.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:C} = {mink:Q}/{mink:V} = {mink:ε₀·S/d}\n{dim:in farad (F)}'], [960, '{dim:fra le armature}\n{g:campo uniforme}'], [1470, '{dim:energia}\n{mink:U} = {mink:C·V} ²/2']];
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
    ['soffio', 7.6], ['pop', 8.3, .45], ['pop', 8.5, .5], ['traccia', 8.6, 9.4],      // le armature, i fili e la pila
    ['pop', 13.8, .5], ['pop', 14.2, .55],                                            // più Q e meno Q
    ['traccia', 17.5, 18.7],                                                          // le linee di campo
    ['pop', 23.3, .45],                                                               // fuori E quasi zero
    ['pop', 28.7, .45], ['pop', 29.0, .5],                                            // 12 V, il punto Q sul grafico
    ['pop', 34.2, .45], ['pop', 34.6, .55], ['pop', 35.1, .55],                       // 24 V: carica doppia
    ['traccia', 40.1, 41.0], ['tono', 40.1, 41.0, [0, .06, .5, .94, 1]], ['ding', 41.0],   // la retta: C costante
    ['pop', 45.0, .4],                                                                // il farad
    ['soffio', 49.8],                                                                 // l'energia
    ['tono', 54.0, 57.0, [0, .25, .5, .75, 1]],                                       // la carica sale la retta
    ['traccia', 57.4, 57.8], ['pop', 60.0, .55], ['ding', 60.4],                      // V/2, poi U = QV/2
    ['soffio', 64.8], ['pop', 65.0, .45], ['traccia', 65.2, 65.6],                    // C = epsilon0 S/d
    ['pop', 70.2, .45],                                                               // epsilon0
    ['tono', 74.8, 76.6, [.9, .89, .8, .55, .3, .21, .2]], ['pop', 76.3, .6],         // a metà distanza: più carica
    ['ding', 79.4],                                                                   // 4Q
    ['pop', 83.6, .5],                                                                // 1 m quadro a 1 mm
    ['soffio', 89.1], ['pop', 91.2, .5], ['pop', 91.7, .6], ['pop', 92.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il condensatore', durata: 100.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.8, 'due armature'], [39.8, 49.7, 'la capacità'], [49.7, 64.5, 'l’energia'], [64.5, T_FINE, 'da che cosa dipende']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCondensatore(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
