'use strict';
/* Il miele e l'acqua — la viscosità: l'attrito interno fra gli strati di un liquido (η, in Pa·s: acqua 0,001, glicerina ≈ 1,4,
   miele ≈ 10). Tre tubi alti 20 cm, una sfera d'acciaio (d = 7800 kg/m³) di raggio r = 3 mm in ciascuno, lasciate insieme,
   in tempo reale. Nel miele e nella glicerina vale la legge di Stokes, F = 6π·η·r·v (numero di Reynolds 0,01 e 0,5): la sfera
   arriva in pochi millesimi di secondo alla velocità limite v = 2·r²·(d_sfera − d_liquido)·g / (9·η) e poi scende costante:
   1,25 cm/s nel miele (19,2 cm in 15,3 s), 9,2 cm/s nella glicerina (2,1 s). Nell'acqua la sfera va così veloce che fa vortici
   (Reynolds ≈ 6500): lì Stokes non vale, e il moto è calcolato con la resistenza quadratica (coefficiente 0,45): in fondo in
   ≈ 0,27 s. Forze sulla sfera nel miele: peso ≈ 8,6 mN, spinta di Archimede ≈ 1,6 mN, attrito viscoso ≈ 7,1 mN.
   La tensione superficiale, che VIDEO.md metteva insieme, è un'altra idea: va in un video a parte. Argomento: fluidodinamica. */
CVIDEO.registra('fluidodinamica/viscosita', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [92.5, 190], [93.8, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [92.5, 1050], [93.8, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [92.5, 2.2], [93.8, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [92.5, 2], [93.8, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [92.5, -1.5], [93.8, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.7, 'felice'], [17.3, 'neutro'],
  [32.5, 'felice'], [36.7, 'sorpreso'], [41.7, 'neutro'], [46.5, 'felice'], [51.5, 'pensa'], [55.6, 'neutro'],
  [71.7, 'felice'], [77.1, 'neutro'], [82.1, 'festa'], [87.1, 'pensa'], [92.5, 'neutro'], [94.8, 'felice'],
  [99.3, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Perché il miele scende così piano\ndal cucchiaio?'],
  [7.9, 12.6, 'Nei liquidi veri gli strati scorrono\nuno sull’altro e si {y:frenano}.'],
  [12.7, 17.2, 'È un attrito interno:\nla {v:viscosità}.'],
  [17.3, 23.0, 'Si misura con {mink:η}, in Pa·s:\nacqua 0,001, miele circa 10.'],
  [23.1, 27.6, 'Tre tubi alti 20 cm: acqua,\nglicerina e miele.'],
  [27.7, 32.4, 'In ognuno una sfera d’acciaio\ndi raggio {mink:r} = 3 mm.'],
  [32.5, 36.6, 'Le lascio andare insieme.'],
  [36.7, 41.6, 'L’acqua: in fondo in un attimo.\nLa glicerina: in circa 2 s.'],
  [41.7, 46.4, 'Nel miele scende piano piano,\nsempre alla {g:stessa velocità}.'],
  [46.5, 51.4, 'Segno dov’è ogni secondo:\ntacche {g:equidistanti}.'],
  [51.5, 55.5, 'Ne lascio un’altra: non accelera,\nle forze sono in {g:equilibrio}.'],
  [55.6, 61.0, 'Giù il peso {my:P}; su la spinta di\nArchimede {my:S} e l’{y:attrito viscoso} {my:F}.'],
  [61.1, 66.6, 'L’attrito cresce con la velocità:\n{my:F} = 6π·{mink:η}·{mink:r}·{mx:v}, legge di {v:Stokes}.'],
  [66.7, 71.6, 'La sfera accelera solo un istante,\nfinché {my:F} + {my:S} = {my:P}.'],
  [71.7, 77.0, 'Poi va alla {g:velocità limite}:\nnel miele 1,25 cm/s.'],
  [77.1, 82.0, 'Glicerina: {mink:η} sette volte più piccola,\nsfera circa sette volte più veloce.'],
  [82.1, 87.0, 'Più il liquido è viscoso,\npiù la sfera è {g:lenta}.'],
  [87.1, 92.4, 'Nell’acqua va così veloce che fa\nvortici: lì Stokes non vale.'],
  [94.8, 100.4, 'La viscosità è l’attrito interno di un\nliquido: più è grande, più frena.'],
];

// ---------- la fisica ----------
const G = 9.8, R = 0.003, DS = 7800, VOL = 4 / 3 * Math.PI * R * R * R, MS = DS * VOL;
const LIQ = [
  { nome: 'acqua', eta: 0.001, d: 1000 },
  { nome: 'glicerina', eta: 1.4, d: 1260 },
  { nome: 'miele', eta: 10, d: 1420 },
];
LIQ.forEach(l => { l.vL = 2 * R * R * (DS - l.d) * G / (9 * l.eta); l.tc = MS / (6 * Math.PI * l.eta * R); });
// l'acqua: resistenza quadratica, integrata una volta sola (passo 0,1 ms), un valore ogni millisecondo
const ACQ = (() => {
  const l = LIQ[0], A = Math.PI * R * R, out = [0]; let v = 0, s = 0;
  for (let i = 1; i <= 600; i++) for (let j = 0; j < 10; j++) {
    const a = ((DS - l.d) * VOL * G - .5 * l.d * .45 * A * v * v) / MS;
    v += a * 1e-4; s += v * 1e-4; if (j === 9) out.push(s);
  }
  return out;
})();
const CORSA = 0.1917;                                        // dal pelo libero al fondo, per il centro della sfera
function discesa(i, tau) {                                   // metri percorsi dopo tau secondi (tempo vero)
  if (tau <= 0) return 0;
  if (i === 0) { const k = Math.min(600, tau * 1000), a = Math.floor(k); return Math.min(CORSA, lerp(ACQ[a], ACQ[Math.min(600, a + 1)], k - a)); }
  const l = LIQ[i];
  return Math.min(CORSA, l.vL * (tau - l.tc * (1 - Math.exp(-tau / l.tc))));
}
const TR = 35.4, TR2 = 51.6;                                 // si lasciano le sfere; la seconda nel miele

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, w = 6, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, L / 26);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
function sfera(ctx, x, y, r, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
  g.addColorStop(0, css(mix(C.paper, C.dim, .15))); g.addColorStop(1, css(mix(C.dim, C.ink, .35)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}
const colLiq = i => i === 0 ? css(C.x, .16) : i === 1 ? css(C.v, .12) : css(C.y, .42);

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il miele e l’acqua', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- i tre tubi: 24 px per centimetro, in scala ----------
const XT = [300, 610, 920], YS = 260, YB = 740, PXM = 2400, RS = 10;
const ySfera = s => YS + RS + s * PXM;
function scenaTubi(ctx, t) {
  if (t < 7.5 || t > 93.0) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, 92.8, .6, .5));
  const al = life(t, 7.8, 92.8, .6, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  for (let i = 0; i < 3; i++) {
    const x = XT[i];
    ctx.fillStyle = colLiq(i); ctx.fillRect(x - 58, YS, 116, YB - YS);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x - 60, 215); ctx.lineTo(x - 60, YB + 2); ctx.lineTo(x + 60, YB + 2); ctx.lineTo(x + 60, 215); ctx.stroke();
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 58, YS); ctx.lineTo(x + 58, YS); ctx.stroke();
    txt(ctx, LIQ[i].nome, x, 172, { size: 32, weight: 600 });
  }
  // l'altezza dei tubi
  const kH = life(t, 23.3, 32.4, .4, .4);
  if (kH > 0) {
    ctx.save(); ctx.globalAlpha *= kH;
    freccia(ctx, [180, (YS + YB) / 2], [180, YS + 2], C.ink, 3); freccia(ctx, [180, (YS + YB) / 2], [180, YB - 2], C.ink, 3);
    ctx.fillStyle = C.paper; ctx.fillRect(140, (YS + YB) / 2 - 24, 80, 48);
    txt(ctx, '20 cm', 180, (YS + YB) / 2, { size: 30, weight: 600 });
    ctx.restore();
  }
  // le tacche: dov'è la sfera ogni secondo nel miele, ogni mezzo secondo nella glicerina
  const kTac = life(t, TR, 92.8, .2, .5);
  if (kTac > 0) {
    ctx.save(); ctx.globalAlpha *= kTac; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    for (let k = 1; k <= 15; k++) if (t - TR >= k) {
      const y = ySfera(discesa(2, k)); ctx.beginPath(); ctx.moveTo(XT[2] + 64, y); ctx.lineTo(XT[2] + 82, y); ctx.stroke();
      if (k % 5 === 0) txt(ctx, k + ' s', XT[2] + 90, y, { size: 30, color: C.g, align: 'left' });
    }
    for (let k = 1; k <= 4; k++) if (t - TR >= k / 2) {
      const y = ySfera(discesa(1, k / 2)); ctx.beginPath(); ctx.moveTo(XT[1] + 64, y); ctx.lineTo(XT[1] + 82, y); ctx.stroke();
    }
    if (t - TR >= 2) txt(ctx, '2 s', XT[1] + 90, ySfera(discesa(1, 2)), { size: 30, color: C.g, align: 'left' });
    if (t - TR >= .5) txt(ctx, '0,5 s', XT[1] + 90, ySfera(discesa(1, .5)), { size: 30, color: C.g, align: 'left' });
    ctx.restore();
  }
  // le sfere
  const kS = P(t, 27.8, 28.3);
  for (let i = 0; i < 3; i++) sfera(ctx, XT[i], ySfera(discesa(i, t - TR)), RS, kS);
  if (t > TR2 - .4) {
    const y2 = ySfera(discesa(2, t - TR2)), x2 = XT[2] - 26;
    sfera(ctx, x2, y2, RS, P(t, TR2 - .4, TR2 - .1));
    // le forze sulla seconda sfera: 5,8 px per millinewton
    const kF = life(t, 55.6, 71.6, .4, .4);
    if (kF > 0) {
      const l = LIQ[2], Pm = MS * G * 1e3, Sm = l.d * VOL * G * 1e3, Fm = Pm - Sm;
      freccia(ctx, [x2, y2 + RS], [x2, y2 + RS + Pm * 5.8], C.y, 4, kF);
      freccia(ctx, [x2 - 6, y2 - RS], [x2 - 6, y2 - RS - Sm * 5.8], C.y, 4, kF);
      freccia(ctx, [x2 + 6, y2 - RS], [x2 + 6, y2 - RS - Fm * 5.8], C.y, 4, kF);
    }
  }
  ctx.restore();
}

// ---------- la scheda a destra ----------
function riga(ctx, nome, val, y, al, col = C.ink, x1 = 1765) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, 1195, y, { size: 34, align: 'left' });
  drawRich(ctx, val, x1, y, { size: 34, align: 'right', fill: css(col) });
  ctx.restore();
}
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore();
}
function strati(ctx, t, al) {   // il miele fra due lastre: sotto ferma, sopra scorre; gli strati vanno sempre più piano verso il basso
  if (al <= 0) return;
  const X0 = 1200, X1 = 1760, Y0 = 250, Y1 = 520, NS = 6;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.y, .3); ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  ctx.save(); ctx.beginPath(); ctx.rect(X0, Y0, X1 - X0, Y1 - Y0); ctx.clip();
  for (let k = 0; k < NS; k++) {
    const y = Y1 - (k + .5) * (Y1 - Y0) / NS, v = 22 * (k + .5);   // px al secondo, proporzionale all'altezza
    ctx.strokeStyle = css(C.ink, .18); ctx.lineWidth = 1.5; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.moveTo(X0, y + (Y1 - Y0) / NS / 2); ctx.lineTo(X1, y + (Y1 - Y0) / NS / 2); ctx.stroke(); ctx.setLineDash([]);
    for (let j = 0; j < 5; j++) { const x = X0 + ((j * 112 + v * t) % (X1 - X0)); M.dot(ctx, [x, y], mix(C.y, C.ink, .45), 1, 6); }
  }
  ctx.restore();
  ctx.fillStyle = css(mix(C.dim, C.paper, .4)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.rect(X0 - 10, Y1, X1 - X0 + 20, 18); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(X0 - 10, Y0 - 18, X1 - X0 + 20, 18); ctx.fill(); ctx.stroke();
  // le velocità degli strati: frecce lunghe come la velocità
  for (let k = 0; k < NS; k++) {
    const y = Y1 - (k + .5) * (Y1 - Y0) / NS;
    freccia(ctx, [X0 + 20, y], [X0 + 20 + 40 * (k + .5), y], C.x, 4, 1);
  }
  freccia(ctx, [X0 + 20, Y0 - 44], [X0 + 20 + 40 * NS, Y0 - 44], C.x, 4, 1);
  txt(ctx, 'scorre', X0 + 40 * NS + 40, Y0 - 44, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'ferma', X0 + 20, Y1 + 46, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
function scenaScheda(ctx, t) {
  if (t < 7.5 || t > 93.0) return;
  const al = life(t, 7.8, 92.8, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // 1 · gli strati e la viscosità
  strati(ctx, t, life(t, 8.0, 51.5, .5, .5));
  const kEta = life(t, 17.4, 51.5, .4, .4);
  if (kEta > 0) {
    linea(ctx, 600, kEta);
    drawRich(ctx, '{dim:viscosità} {mink:η}', 1480, 626, { size: 32, alpha: kEta });
    riga(ctx, 'acqua', '0,001 Pa·s', 668, kEta * P(t, 17.6, 18.0));
    riga(ctx, 'glicerina', '≈ 1,4 Pa·s', 710, kEta * P(t, 18.0, 18.4));
    riga(ctx, 'miele', '≈ 10 Pa·s', 752, kEta * P(t, 18.4, 18.8));
  }
  // 2 · le forze sulla sfera nel miele: 20 px per millinewton
  const kF = life(t, 51.6, 82.0, .5, .5);
  if (kF > 0) {
    ctx.save(); ctx.globalAlpha *= kF;
    const l = LIQ[2], Pm = MS * G * 1e3, Sm = l.d * VOL * G * 1e3, Fm = Pm - Sm, cx = 1480, cy = 330, r = 46;
    ctx.fillStyle = css(C.y, .3); ctx.beginPath(); ctx.roundRect(1250, 140, 460, 440, 18); ctx.fill();
    sfera(ctx, cx, cy, r, 1);
    const kP = P(t, 55.6, 56.0), kS2 = P(t, 56.4, 56.8), kA = P(t, 57.4, 57.8);
    freccia(ctx, [cx, cy + r], [cx, cy + r + Pm * 20], C.y, 6, kP);
    drawRich(ctx, '{my:P}', cx + 24, cy + r + Pm * 10, { size: 40, align: 'left', alpha: kP });
    freccia(ctx, [cx - 34, cy - r + 8], [cx - 34, cy - r + 8 - Sm * 20], C.y, 6, kS2);
    drawRich(ctx, '{my:S}', cx - 54, cy - r - 10, { size: 40, align: 'right', alpha: kS2 });
    freccia(ctx, [cx + 34, cy - r + 8], [cx + 34, cy - r + 8 - Fm * 20], C.y, 6, kA);
    drawRich(ctx, '{my:F}', cx + 56, cy - r - 60, { size: 40, align: 'left', alpha: kA });
    ctx.restore();
  }
  const kSt = life(t, 61.2, 66.7, .4, .3);
  if (kSt > 0) {
    drawRich(ctx, '{my:F} = 6π·{mink:η}·{mink:r}·{mx:v}', 1480, 650, { size: 46, local: t - 61.3, alpha: kSt });
    drawRich(ctx, '{mink:r}{dim: raggio,} {mx:v}{dim: velocità della sfera}', 1480, 722, { size: 30, alpha: kSt * P(t, 61.8, 62.2) });
  }
  const kEq = life(t, 66.8, 71.7, .3, .3);
  if (kEq > 0) {
    drawRich(ctx, '{my:F} + {my:S} = {my:P}', 1480, 650, { size: 46, local: t - 66.9, alpha: kEq });
    drawRich(ctx, '{dim:dopo pochi millesimi di secondo}', 1480, 722, { size: 30, alpha: kEq * P(t, 67.4, 67.8) });
  }
  const kV = life(t, 71.8, 82.0, .3, .4);
  if (kV > 0) {
    drawRich(ctx, '{dim:velocità limite}', 1480, 630, { size: 32, alpha: kV });
    riga(ctx, 'miele', '1,25 cm/s', 690, kV, C.g);
    riga(ctx, 'glicerina', '9,2 cm/s', 745, kV * P(t, 77.2, 77.6), C.g);
  }
  // 3 · più viscoso, più lento
  const kR = life(t, 82.2, 92.8, .4, .4);
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR;
    drawRich(ctx, '{mink:η}', 1500, 240, { size: 40 }); drawRich(ctx, '{mx:v}{dim: limite}', 1690, 240, { size: 36 });
    linea(ctx, 285, 1);
    riga(ctx, 'glicerina', '1,4 Pa·s', 340, 1, C.ink, 1560); drawRich(ctx, '{g:9,2 cm/s}', 1765, 340, { size: 34, align: 'right' });
    riga(ctx, 'miele', '10 Pa·s', 400, 1, C.ink, 1560); drawRich(ctx, '{g:1,25 cm/s}', 1765, 400, { size: 34, align: 'right' });
    const ka = P(t, 87.2, 87.6);
    riga(ctx, 'acqua', '0,001 Pa·s', 460, ka, C.ink, 1560); drawRich(ctx, '{dim:vortici}', 1765, 460, { size: 34, align: 'right', alpha: ka });
    drawRich(ctx, '{dim:più viscoso,} {g:più lenta}', 1480, 560, { size: 36 });
    drawRich(ctx, '{dim:nell’acqua Stokes non vale}', 1480, 650, { size: 32, alpha: ka });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (92,5–103)
function scenaFine(ctx, t) {
  if (t < 92.4) return;
  const al = 1 - P(t, 101.6, 102.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.7 });
    drawRich(ctx, 'La viscosità è l’attrito interno\nfra gli strati di un liquido.', W / 2, 290, { size: 70, weight: 600, local: t - 93.1, stagger: .09 });
  });
  const pills = [[490, 'miele {mink:η} ≈ 10 Pa·s,\nacqua 0,001'], [960, 'velocità limite:\n{my:F} + {my:S} = {my:P}'], [1430, 'più viscoso,\nsfera più {g:lenta}']];
  pills.forEach(([x, s], i) => {
    const a = 95.0 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['tono', 8.0, 9.2, [.5, .5]],                                    // i tubi, gli strati che scorrono
    ['pop', 17.6, .3], ['pop', 18.0, .5], ['pop', 18.4, .7],                          // η: acqua, glicerina, miele
    ['pop', 23.3, .4], ['pop', 28.0, .5],                                             // 20 cm, le tre sfere
    ['tono', 35.4, 35.67, [1, 0]], ['pop', 35.67, .3],                                // l'acqua: in fondo in un attimo
    ['tono', 35.4, 37.48, [1, .5, 0]], ['pop', 37.48, .4],                            // la glicerina: circa 2 s
    ['pop', 40.4, .45], ['pop', 45.4, .4], ['pop', 50.73, .3],                        // il miele: 5 s, 10 s, in fondo
    ['pop', 51.4, .5], ['soffio', 51.6],                                              // la seconda sfera, le forze
    ['pop', 55.6, .3], ['pop', 56.4, .5], ['pop', 57.4, .6],                          // P, S, F
    ['pop', 61.3, .55],                                                               // legge di Stokes
    ['pop', 66.9, .55], ['ding', 67.4],                                               // F + S = P
    ['pop', 71.8, .45], ['pop', 77.2, .6],                                            // velocità limite: miele, glicerina
    ['pop', 82.3, .5], ['pop', 87.2, .4],                                             // più viscoso, più lenta; l'acqua
    ['soffio', 92.7], ['pop', 95.0, .5], ['pop', 95.5, .6], ['pop', 96.0, .7],        // in una frase
  ];
  return {
    titolo: 'Il miele e l’acqua', durata: 103, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 23.0, 'l’attrito fra gli strati'], [23.0, 51.4, 'tre sfere che cadono'], [51.4, 92.5, 'la velocità limite']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaTubi(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
