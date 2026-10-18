'use strict';
/* Dal Sole alla lampadina — la catena di trasformazioni con le perdite: 100 J di energia chimica del carbone (luce del Sole
   catturata dalle piante) → caldaia, 90 J al vapore (10 J coi fumi) → turbina, 36 J di energia cinetica (54 J al fiume che
   raffredda il vapore) → alternatore, 35 J elettrici (1 J in attriti) → rete, 33 J (2 J nei fili) → LED, 13 J di luce
   (20 J lo scaldano). Diagramma a nastro largo 1,5 px per joule. Gli 87 J persi non spariscono: energia interna dell'ambiente.
   Rendimenti 90%, 40%, ≈ 97%, ≈ 94%, ≈ 39%; il prodotto è 13/100 (0,90 · 0,40 · 0,97 · 0,94 · 0,39 ≈ 0,128 con i valori
   arrotondati). Con una lampadina a incandescenza (≈ 5%) la luce sarebbe 33 · 0,05 ≈ 1,7 J, circa 2 J.
   Non ci sono: le forme di energia una per una, le fonti rinnovabili e non (due video a parte). Argomento: energia. */
CVIDEO.registra('energia/catena', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, checkMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [96.6, 190], [97.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [96.6, 1050], [97.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.6, 2.2], [97.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [96.6, 2], [97.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.6, -1.5], [97.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.9, 'felice'], [17.7, 'neutro'],
  [27.0, 'pensa'], [31.1, 'neutro'], [36.0, 'sorpreso'], [41.8, 'neutro'], [51.5, 'felice'], [56.5, 'pensa'],
  [60.4, 'sorpreso'], [64.3, 'felice'], [69.5, 'neutro'], [79.5, 'pensa'], [86.0, 'sorpreso'], [91.6, 'neutro'],
  [98.9, 'felice'], [103.4, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Da dove viene la luce\ndi una lampadina?'],
  [7.9, 12.8, 'Dal Sole: milioni di anni fa le piante\nne hanno catturato la luce…'],
  [12.9, 17.6, '…e, sepolte, sono diventate {v:carbone}:\nenergia {g:chimica}.'],
  [17.7, 21.9, 'Seguiamo 100 J di quell’energia\nfino alla lampadina.'],
  [22.0, 26.9, 'Nella {v:caldaia} il carbone brucia e\nscalda il {g:vapore}: 90 J.'],
  [27.0, 31.0, '10 J se ne vanno coi fumi:\nscaldano l’aria.'],
  [31.1, 35.9, 'Il vapore fa girare una {v:turbina}:\nenergia {g:cinetica}, 36 J.'],
  [36.0, 41.7, 'La perdita più grande, 54 J: il vapore\nva raffreddato, e scalda un fiume.'],
  [41.8, 46.7, 'L’{v:alternatore} la fa {g:elettrica}: 35 J;\n1 J va perso in attriti.'],
  [46.8, 51.4, 'Nei fili della rete si perdono\naltri 2 J: arrivano 33 J.'],
  [51.5, 56.4, 'Il {v:LED} ne fa {g:luce}: 13 J.\nGli altri 20 J lo scaldano.'],
  [56.5, 60.3, 'Di 100 J, solo 13\nsono diventati luce.'],
  [60.4, 64.2, 'Gli altri 87 J sono {r:spariti}?'],
  [64.3, 69.4, '{g:No}: sono nell’aria, nel fiume,\nnei fili, come {v:energia interna}.'],
  [69.5, 74.4, '13 + 87 = 100 J: l’energia\nsi {g:conserva}, ma si {v:disperde}.'],
  [74.5, 79.4, 'Ogni passaggio ha un {v:rendimento}:\nenergia utile / energia spesa.'],
  [79.5, 85.9, 'Caldaia 90%, turbina 40%,\nalternatore 97%, rete 94%, LED 39%.'],
  [86.0, 91.5, 'Il rendimento di tutta la catena\nè il {g:prodotto}: circa 13%.'],
  [91.6, 96.5, 'Con una lampadina a incandescenza\nla luce sarebbe appena 2 J.'],
  [98.9, 104.5, 'Lungo la catena l’energia si conserva,\nma a ogni passaggio un po’ si disperde.'],
];

// ---------- i numeri della catena ----------
const EN = [100, 90, 36, 35, 33, 13];                       // joule dopo ogni passaggio
const NOMI = ['carbone', 'caldaia', 'turbina', 'alternatore', 'rete', 'LED'];
const FORME = ['chimica', 'termica', 'cinetica', 'elettrica', 'elettrica', 'luce'];
const DOVE = ['', 'fumi', 'fiume', 'attriti', 'fili', 'calore'];
const REND = ['', '90%', '40%', '97%', '94%', '39%'];
const XS = [300, 560, 820, 1080, 1350, 1620], X0 = 200, X1 = 1790, YT = 290, PXJ = 1.5, YG = 600;
// quando compare ogni passaggio: icona, nastro, perdita
const T_ICONA = [8.0, 22.0, 31.1, 41.8, 46.8, 51.5];
const T_NASTRO = [13.5, 22.2, 31.3, 42.0, 47.0, 51.7];
const T_PERDITA = [0, 27.1, 36.2, 42.2, 47.2, 51.9];
// fin dove arriva il nastro
function xNastro(t) {
  let x = X0;
  for (let i = 0; i < 6; i++) { const a = T_NASTRO[i], b = i < 5 ? XS[i + 1] : X1, x0 = i ? XS[i] : X0; if (t > a) x = lerp(x0, b, P(t, a, a + 1.0, E.io)); }
  return x;
}

// ---------- le icone (centro x, y; k = quanto è comparsa) ----------
function sole(ctx, x, y, r, t) {
  ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * .3; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25); ctx.lineTo(x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6); ctx.stroke(); }
  ctx.fillStyle = css(mix(C.y, C.paper, .2)); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function pianta(ctx, x, y) {
  ctx.save(); ctx.strokeStyle = css(mix(C.g, C.ink, .3)); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + 40); ctx.lineTo(x, y - 30); ctx.stroke();
  ctx.fillStyle = css(C.g, .85);
  for (const [dx, dy, s] of [[-1, 0, 1], [1, -14, 1], [-1, -30, .8]]) {
    ctx.beginPath(); ctx.ellipse(x + dx * 20 * s, y + dy, 22 * s, 10 * s, dx * -.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function carbone(ctx, x, y) {
  ctx.save(); ctx.fillStyle = css(mix(C.ink, C.dim, .25)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
  for (const [dx, dy, r] of [[-24, 14, 22], [20, 16, 20], [0, -10, 22]]) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + dx * .05; const rr = r * (i % 2 ? .85 : 1); ctx.lineTo(x + dx + Math.cos(a) * rr, y + dy + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function caldaia(ctx, x, y, t) {
  ctx.save(); ctx.fillStyle = css(mix(C.dim, C.paper, .6)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - 34, y - 34, 68, 56, 8); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 14, y - 34); ctx.lineTo(x + 14, y - 46); ctx.stroke();
  for (let i = 0; i < 3; i++) {   // la fiamma sotto
    const cx = x - 20 + i * 20, hf = 18 + 4 * Math.sin(t * 9 + i * 2);
    ctx.fillStyle = css(C.y, .9); ctx.beginPath(); ctx.moveTo(cx, y + 42 - hf); ctx.quadraticCurveTo(cx + 9, y + 40, cx, y + 44); ctx.quadraticCurveTo(cx - 9, y + 40, cx, y + 42 - hf); ctx.fill();
  }
  ctx.restore();
}
function turbina(ctx, x, y, ang) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.fillStyle = C.paper;
  ctx.beginPath(); ctx.arc(x, y, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x, .7);
  for (let i = 0; i < 6; i++) {
    const a = ang + i * Math.PI / 3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 33, y + Math.sin(a) * 33); ctx.lineTo(x + Math.cos(a + .45) * 30, y + Math.sin(a + .45) * 30); ctx.closePath(); ctx.fill();
  }
  M.dot(ctx, [x, y], C.ink, 1, 6);
  ctx.restore();
}
function alternatore(ctx, x, y) {
  ctx.save(); ctx.fillStyle = css(mix(C.v, C.paper, .75)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - 38, y - 30, 76, 60, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.v); ctx.beginPath();   // un fulmine
  ctx.moveTo(x + 6, y - 22); ctx.lineTo(x - 12, y + 4); ctx.lineTo(x, y + 4); ctx.lineTo(x - 6, y + 24); ctx.lineTo(x + 14, y - 4); ctx.lineTo(x + 2, y - 4); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function traliccio(ctx, x, y) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - 24, y + 40); ctx.lineTo(x - 6, y - 38); ctx.lineTo(x + 6, y - 38); ctx.lineTo(x + 24, y + 40);
  ctx.moveTo(x - 32, y - 22); ctx.lineTo(x + 32, y - 22); ctx.moveTo(x - 26, y - 4); ctx.lineTo(x + 26, y - 4);
  ctx.moveTo(x - 18, y + 14); ctx.lineTo(x + 14, y - 22); ctx.moveTo(x + 18, y + 14); ctx.lineTo(x - 14, y - 22); ctx.stroke();
  ctx.restore();
}
function lampadina(ctx, x, y, acceso) {
  ctx.save();
  if (acceso > 0) { ctx.fillStyle = css(C.y, .18 * acceso); ctx.beginPath(); ctx.arc(x, y - 8, 52, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(mix(C.paper, C.y, .55 * acceso)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y - 10, 28, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(x + 12, y + 24); ctx.lineTo(x - 12, y + 24); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.dim); ctx.fillRect(x - 12, y + 26, 24, 14);
  ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Dal Sole alla lampadina', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il nastro: largo 1,5 px per joule ----------
const YI = 212;
function perdita(i) {   // la perdita al passaggio i: larghezza, centro, raggio della curva, x del tratto in discesa
  const w = (EN[i - 1] - EN[i]) * PXJ, yc = YT + (EN[i] + (EN[i - 1] - EN[i]) / 2) * PXJ, R = w / 2 + 16;
  const pts = [];
  for (let j = 0; j <= 16; j++) { const u = j / 16, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; pts.push([a * (XS[i] - 2) + b * (XS[i] + R) + c * (XS[i] + R), a * yc + b * yc + c * (yc + R)]); }
  pts.push([XS[i] + R, YG]);
  return { w, yc, R, xc: XS[i] + R, pts };
}
function scenaCatena(ctx, t) {
  if (t < 7.5 || t > 97.1) return;
  const al = life(t, 7.6, 96.9, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il Sole, all'origine di tutto
  const kS = P(t, 8.0, 8.6);
  if (kS > 0) { ctx.save(); ctx.globalAlpha *= kS; sole(ctx, 168, 205, 24, t); txt(ctx, 'Sole', 168, 140, { size: 30, weight: 600, color: C.dim }); ctx.restore(); }
  // il nastro, fin dove è arrivato
  const xN = xNastro(t);
  if (xN > X0 + 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(X0 - 2, YT - 4, xN - X0 + 2, 200); ctx.clip();
    ctx.beginPath(); ctx.moveTo(X0, YT); ctx.lineTo(X1, YT);
    for (let i = 5; i >= 0; i--) { const xa = i ? XS[i] : X0, xb = i < 5 ? XS[i + 1] : X1, y = YT + EN[i] * PXJ; ctx.lineTo(xb, y); ctx.lineTo(xa, y); }
    ctx.closePath(); ctx.fillStyle = css(C.g, .26); ctx.fill(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    if (xN < X1 - 2) arrowHead(ctx, [xN + 6, YT + 10], 0, C.g, .9);
    else arrowHead(ctx, [X1 + 18, YT + EN[5] * PXJ / 2], 0, C.g, 1.1);
  }
  // le scritte dentro il nastro
  for (let i = 0; i < 6; i++) {
    const xa = i ? XS[i] : X0, xb = i < 5 ? XS[i + 1] : X1, k = P(t, T_NASTRO[i] + .6, T_NASTRO[i] + 1.0);
    if (k <= 0) continue;
    if (i < 5) drawRich(ctx, FORME[i] + '  {g:' + EN[i] + ' J}', (xa + xb) / 2 + (i ? 0 : 10), YT + EN[i] * PXJ / 2, { size: 30, weight: 600, alpha: k });
    else drawRich(ctx, '{g:luce ' + EN[5] + ' J}', (xa + xb) / 2 + 12, YT - 22, { size: 30, weight: 600, alpha: k });
  }
  // le perdite: energia interna dell'ambiente
  for (let i = 1; i < 6; i++) {
    const k = P(t, T_PERDITA[i], T_PERDITA[i] + .9, E.lin);
    if (k <= 0) continue;
    const pe = perdita(i);
    ctx.save(); ctx.strokeStyle = css(C.v, .32); ctx.lineWidth = Math.max(3, pe.w); ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    M.partial(ctx, pe.pts, k); ctx.restore();
    const kf2 = P(t, T_PERDITA[i] + .8, T_PERDITA[i] + 1.2);
    if (kf2 > 0) {
      const hw = Math.max(3, pe.w) / 2 + 9;
      ctx.save(); ctx.globalAlpha *= kf2; ctx.fillStyle = css(C.v, .7);
      ctx.beginPath(); ctx.moveTo(pe.xc - hw, YG); ctx.lineTo(pe.xc + hw, YG); ctx.lineTo(pe.xc, YG + 20 + pe.w / 5); ctx.closePath(); ctx.fill();
      ctx.restore();
      drawRich(ctx, '{v:' + (EN[i - 1] - EN[i]) + ' J}', pe.xc, 668, { size: 34, weight: 600, alpha: kf2 });
      txt(ctx, DOVE[i], pe.xc, 704, { size: 30, color: C.dim, alpha: kf2 });
    }
  }
  // le icone con il loro nome
  for (let i = 0; i < 6; i++) {
    const k = P(t, T_ICONA[i], T_ICONA[i] + .5, E.back);
    if (k <= 0) continue;
    const x = XS[i];
    ctx.save(); ctx.translate(x, YI); ctx.scale(k, k); ctx.translate(-x, -YI);
    if (i === 0) {
      const kc = P(t, 12.9, 13.6);
      if (kc < 1) { ctx.save(); ctx.globalAlpha *= 1 - kc; pianta(ctx, x, YI); ctx.restore(); }
      if (kc > 0) { ctx.save(); ctx.globalAlpha *= kc; carbone(ctx, x, YI); ctx.restore(); }
    }
    if (i === 1) caldaia(ctx, x, YI, t);
    if (i === 2) turbina(ctx, x, YI, t * 2.4);
    if (i === 3) alternatore(ctx, x, YI);
    if (i === 4) traliccio(ctx, x, YI);
    if (i === 5) lampadina(ctx, x, YI, P(t, 52.3, 53.0));
    ctx.restore();
    const nome = i === 0 ? (t < 13.2 ? 'piante' : 'carbone') : NOMI[i];
    txt(ctx, nome, x, 140, { size: 30, weight: 600, color: C.ink, alpha: k * (i === 0 ? Math.abs(1 - 2 * P(t, 12.9, 13.5, E.lin)) : 1) });
  }
  // la riga in fondo: dove sono finiti gli 87 J, poi i rendimenti
  const yR = 752;
  drawRich(ctx, '10 + 54 + 1 + 2 + 20 = {v:87 J}  {r:spariti?}', 960, yR, { size: 36, alpha: life(t, 60.5, 64.3, .4, .3) });
  drawRich(ctx, '{v:energia interna (termica):} 10 + 54 + 1 + 2 + 20 = {v:87 J}', 960, yR, { size: 36, alpha: life(t, 64.4, 69.5, .3, .3) });
  drawRich(ctx, '{g:luce 13 J} + {v:dispersi 87 J} = 100 J', 960, yR, { size: 38, local: t - 69.6, alpha: life(t, 69.5, 74.5, .3, .3) });
  drawRich(ctx, '{v:rendimento} = energia utile / energia spesa', 960, yR, { size: 36, local: t - 74.6, alpha: life(t, 74.5, 79.6, .3, .3) });
  const kRe = life(t, 79.6, 86.1, .3, .3);
  if (kRe > 0) {
    txt(ctx, 'rendimento', 140, yR, { size: 30, color: C.dim, align: 'left', alpha: kRe });
    for (let i = 1; i < 6; i++) drawRich(ctx, '{v:' + REND[i] + '}', XS[i], yR, { size: 36, weight: 600, alpha: kRe * P(t, 79.7 + i * .25, 80.1 + i * .25) });
  }
  drawRich(ctx, '0,90 · 0,40 · 0,97 · 0,94 · 0,39 ≈ {g:0,13}, cioè {g:13%}', 960, yR, { size: 36, local: t - 86.2, alpha: life(t, 86.1, 91.7, .3, .3) });
  drawRich(ctx, '{dim:a incandescenza, circa 5%:} 33 J · 0,05 ≈ {g:2 J} {dim:di luce}', 960, yR, { size: 36, local: t - 91.8, alpha: life(t, 91.7, 96.9, .3, .3) });
  ctx.restore();
}

// 5 · in una frase (96,6–107)
function scenaFine(ctx, t) {
  if (t < 96.5) return;
  const al = 1 - P(t, 105.4, 106.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 96.8 });
    drawRich(ctx, 'L’energia si conserva, ma a ogni\npassaggio un po’ si disperde.', W / 2, 290, { size: 70, weight: 600, local: t - 97.2, stagger: .09 });
  });
  const pills = [[490, '{g:13 J} di luce\nda 100 J di carbone'], [960, '{v:rendimento} =\nutile / spesa'], [1430, 'il resto è energia\ninterna {v:dispersa}']];
  pills.forEach(([x, s], i) => {
    const a = 99.1 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 8.0, .7],                               // il titolo, il Sole e le piante
    ['pop', 12.9, .35], ['traccia', 13.5, 14.5],                                      // il carbone: 100 J
    ['pop', 22.0, .85], ['traccia', 22.2, 23.2], ['tono', 27.1, 28.0, [.5, .35, .2]], // caldaia: 90 J, 10 J coi fumi
    ['pop', 31.1, .5], ['traccia', 31.3, 32.3], ['tono', 36.2, 37.1, [.5, .35, .2]],  // turbina: 36 J, 54 J al fiume
    ['pop', 41.8, .5], ['traccia', 42.0, 43.0],                                       // alternatore: 35 J
    ['pop', 46.8, .48], ['traccia', 47.0, 48.0],                                      // rete: 33 J
    ['pop', 51.5, .3], ['traccia', 51.7, 52.7], ['tono', 51.9, 52.8, [.5, .35, .2]],  // LED: 13 J di luce
    ['pop', 52.3, .8],                                                                // la lampadina si accende
    ['pop', 60.5, .3], ['pop', 64.4, .6], ['ding', 69.6],                             // 87 J spariti? no: 13 + 87 = 100
    ['pop', 74.6, .5],                                                                // il rendimento
    ['pop', 79.95, .9], ['pop', 80.2, .4], ['pop', 80.45, .97], ['pop', 80.7, .94], ['pop', 80.95, .39],   // 90%, 40%, 97%, 94%, 39%
    ['ding', 86.2], ['pop', 91.8, .2],                                                // il prodotto: 13%; a incandescenza 2 J
    ['soffio', 96.8], ['pop', 99.1, .5], ['pop', 99.6, .6], ['pop', 100.1, .7],       // in una frase
  ];
  return {
    titolo: 'Dal Sole alla lampadina', durata: 107, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.9, 'dal Sole al carbone'], [21.9, 60.3, 'la catena'], [60.3, 74.4, 'dove va l’energia persa'], [74.4, 96.6, 'il rendimento']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCatena(ctx, t); scenaFine(ctx, t); },
  };
});
