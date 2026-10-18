'use strict';
/* L'altalena in equilibrio — la leva è in equilibrio quando F₁·b₁ = F₂·b₂; i tre generi di leva. Argomento: equilibrio. */
CVIDEO.registra('equilibrio/leve', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [85.6, 190], [86.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [85.6, 1050], [86.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [85.6, 2.2], [86.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [85.6, 2], [86.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [85.6, -1.5], [86.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.9, 'sorpreso'], [21.2, 'neutro'],
  [25.6, 'festa'], [28.7, 'neutro'], [39.7, 'felice'], [43.3, 'neutro'], [47.7, 'pensa'], [51.9, 'neutro'],
  [59.6, 'felice'], [64.0, 'pensa'], [68.7, 'neutro'], [73.3, 'felice'], [77.2, 'neutro'], [81.6, 'sorpreso'],
  [87.9, 'felice'], [91.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Un bambino può equilibrare\nun adulto, sull’altalena?'],
  [7.9, 12.2, 'L’altalena gira attorno al {v:fulcro}:\nil punto su cui è appoggiata.'],
  [12.3, 17.8, 'L’adulto pesa 600 N, il bambino 200 N:\ntutti e due a 1 m dal fulcro.'],
  [17.9, 21.1, 'Lascio andare: scende dalla\nparte dell’adulto.'],
  [21.2, 25.5, 'Il bambino si sposta più lontano,\na 3 m dal fulcro.'],
  [25.6, 28.6, 'Lascio andare: {g:resta in equilibrio}!'],
  [28.7, 33.7, '{v:Momento}: forza · {x:braccio}, la distanza\ndal fulcro (qui le forze sono verticali).'],
  [33.8, 39.6, '600 N · 1 m = 600 N·m;\n200 N · 3 m = 600 N·m: uguali.'],
  [39.7, 43.2, 'È la legge della leva:\n{my:F₁}{mink:·}{mx:b₁} = {my:F₂}{mink:·}{mx:b₂}.'],
  [43.3, 47.6, 'Una forza piccola con un braccio lungo\nequilibra una forza grande.'],
  [47.7, 51.8, 'In ogni leva c’è la forza che fai,\nla {y:potenza}…'],
  [51.9, 55.0, '…e quella da vincere,\nla {y:resistenza}.'],
  [55.1, 59.5, '{v:Primo genere}: il fulcro in mezzo,\ncome l’altalena e le forbici.'],
  [59.6, 63.9, 'Una leva è {g:vantaggiosa} se la potenza\nè minore della resistenza.'],
  [64.0, 68.6, 'Il primo genere può esserlo o no:\ndipende dai bracci.'],
  [68.7, 73.2, '{v:Secondo genere}: la resistenza in mezzo,\ncome la carriola e lo schiaccianoci.'],
  [73.3, 77.1, 'Il braccio della potenza è più lungo:\n{g:sempre vantaggiosa}.'],
  [77.2, 81.5, '{v:Terzo genere}: la potenza in mezzo,\ncome le pinzette e l’avambraccio.'],
  [81.6, 85.4, 'Il braccio della potenza è più corto:\n{r:sempre svantaggiosa}.'],
  [87.9, 92.2, 'Una leva è in equilibrio quando\ni due momenti sono uguali.'],
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
function fulcro(ctx, x, y, h = 70, w = 70) {
  ctx.save(); ctx.fillStyle = css(mix(C.v, C.paper, .55)); ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - w / 2, y + h); ctx.lineTo(x + w / 2, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// l'altalena: asse di 7 m, 120 px per metro, fulcro alto 80 px
const FX = 625, FY = 520, PXM = 120, MEZZA = 3.5, YG = 600, FSC = .3;   // 0,3 px per newton
const PA = 600, PB = 200, G = 9.8;
// prima prova: adulto e bambino a 1 m. Momento netto 400 N·m (cos φ ≈ 1); I = 61,2 + 20,4 + asse di 20 kg (81,7) kg·m²
const I1 = PA / G + PB / G + 20 * 49 / 12, ALFA1 = (PA - PB) / I1, FIMAX = Math.asin((YG - FY) / (MEZZA * PXM));
const T_VIA = 18.1;
function inclinazione(t) {   // φ > 0: scende la parte sinistra, quella dell'adulto
  if (t < T_VIA) return 0;
  const tau = t - T_VIA;
  return Math.min(FIMAX, .5 * ALFA1 * tau * tau);
}
const xBambino = t => kf(t, [[22.0, 1], [23.6, 3]]);   // metri dal fulcro

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’altalena in equilibrio', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · l'altalena (7,5–47)
function persona(ctx, x, yb, grande) {   // seduta, dritta; yb = dove poggia
  const w = grande ? 58 : 38, h = grande ? 92 : 58, r = grande ? 25 : 17, col = mix(C.dim, C.ink, .2);
  ctx.save();
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.roundRect(x - w / 2, yb - h, w, h, 14); ctx.fill();
  ctx.fillStyle = css(mix(col, C.paper, .35)); ctx.beginPath(); ctx.arc(x, yb - h - r - 4, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return yb - h / 2;   // il baricentro, circa a metà del busto
}
function altalena(ctx, fi, sB, al, t, conPesi) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const e = [Math.cos(fi), -Math.sin(fi)], n = [-Math.sin(fi), -Math.cos(fi)], c = [FX, FY - 8];
  const punto = s => [c[0] + e[0] * s * PXM + n[0] * 8, c[1] + e[1] * s * PXM + n[1] * 8];
  // l'asse
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(-fi);
  ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.strokeStyle = css(mix(C.y, C.ink, .5)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-MEZZA * PXM, -8, 2 * MEZZA * PXM, 16, 5); ctx.fill(); ctx.stroke();
  ctx.restore();
  // adulto a 1 m a sinistra, bambino a sB metri a destra
  const pa = punto(-1), pb = punto(sB);
  const ga = persona(ctx, pa[0], pa[1], true), gb = persona(ctx, pb[0], pb[1], false);
  if (conPesi > 0) {
    ctx.save(); ctx.globalAlpha *= conPesi;
    freccia(ctx, [pa[0], ga], [pa[0], ga + PA * FSC], C.y);
    freccia(ctx, [pb[0], gb], [pb[0], gb + PB * FSC], C.y);
    M.dot(ctx, [pa[0], ga], C.ink, 1, 7); M.dot(ctx, [pb[0], gb], C.ink, 1, 6);
    // le etichette sopra le teste: lontane dall'asse e dalle frecce
    drawRich(ctx, '{my:F₁} = 600 N', pa[0], pa[1] - 180, { size: 34 });
    drawRich(ctx, '{my:F₂} = 200 N', pb[0], pb[1] - 124, { size: 34 });
    ctx.restore();
  }
  ctx.restore();
}
function sceneAltalena(ctx, t) {
  if (t < 7.5 || t > 47.8) return;
  const al = life(t, 7.6, 47.6, .6, .5);
  card(ctx, 110, 110, 1030, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(140, YG); ctx.lineTo(1110, YG); ctx.stroke();
  fulcro(ctx, FX, FY, YG - FY, 84);
  drawRich(ctx, '{v:fulcro}', FX + 56, YG - 28, { size: 32, align: 'left', alpha: life(t, 8.2, 21.0, .4, .4) });
  const kp = P(t, 12.5, 13.0);
  // prima prova: tutti e due a 1 m; poi l'asse torna orizzontale e il bambino va a 3 m
  altalena(ctx, inclinazione(t), 1, 1 - P(t, 21.2, 21.7), t, kp);
  altalena(ctx, 0, xBambino(t), P(t, 21.3, 21.8), t, kp);
  // i bracci, misurati dal fulcro
  const kb = P(t, 28.8, 29.4);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb; ctx.strokeStyle = css(C.x); ctx.lineWidth = 6; ctx.lineCap = 'butt';
    for (const [s, nome] of [[-1, '{mx:b₁} = 1 m'], [3, '{mx:b₂} = 3 m']]) {
      const x = FX + s * PXM;
      ctx.beginPath(); ctx.moveTo(FX, 676); ctx.lineTo(x, 676); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 664); ctx.lineTo(x, 688); ctx.moveTo(FX, 664); ctx.lineTo(FX, 688); ctx.stroke(); ctx.lineWidth = 6;
      drawRich(ctx, nome, (FX + x) / 2, 720, { size: 34 });
    }
    ctx.restore();
  }
  ctx.restore();
}

// la scheda dei momenti
function sceneMomenti(ctx, t) {
  if (t < 28 || t > 47.8) return;
  const al = life(t, 28.8, 47.6, .5, .5);
  card(ctx, 1180, 110, 630, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'i due momenti', 1495, 165, { size: 36, weight: 600 }));
  drawRich(ctx, '{dim:adulto}', 1220, 250, { size: 32, align: 'left' });
  drawRich(ctx, '{my:F₁}{mink:·}{mx:b₁} = 600 N · 1 m', 1220, 305, { size: 38, align: 'left', local: t - 33.9 });
  drawRich(ctx, '= {g:600 N·m}', 1770, 360, { size: 40, align: 'right', local: t - 34.5 });
  drawRich(ctx, '{dim:bambino}', 1220, 430, { size: 32, align: 'left' });
  drawRich(ctx, '{my:F₂}{mink:·}{mx:b₂} = 200 N · 3 m', 1220, 485, { size: 38, align: 'left', local: t - 36.3 });
  drawRich(ctx, '= {g:600 N·m}', 1770, 540, { size: 40, align: 'right', local: t - 36.9 });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1210, 590); ctx.lineTo(1780, 590); ctx.stroke();
  conFont(TITOLI, () => drawRich(ctx, 'legge della leva', 1495, 640, { size: 32, weight: 600, alpha: P(t, 39.8, 40.3) }));
  drawRich(ctx, '{my:F₁}{mink:·}{mx:b₁} {mink:=} {my:F₂}{mink:·}{mx:b₂}', 1495, 715, { size: 54, local: t - 40.0 });
  ctx.restore();
}

// 2 · i tre generi di leva (47,6–85,6)
// asta lunga 420 px; ogni forza: posizione lungo l'asta (px dal centro), lunghezza della freccia (px), verso (+1 in giù).
// Le frecce rispettano la legge della leva: potenza · braccio = resistenza · braccio.
const GENERI = [
  { cx: 430, t0: 55.2, nome: 'primo genere', es: 'altalena, forbici', fulcro: -70, tb: 64.1,
    R: { x: -210, L: 100, giu: 1 }, Pt: { x: 210, L: 50, giu: 1 }, tag: '{dim:dipende dai bracci}', tt: 64.2 },
  { cx: 960, t0: 68.8, nome: 'secondo genere', es: 'carriola, schiaccianoci', fulcro: -210, tb: 68.8,
    R: { x: -70, L: 120, giu: 1 }, Pt: { x: 210, L: 40, giu: -1 }, tag: '{g:sempre vantaggiosa}', tt: 73.4 },
  { cx: 1490, t0: 77.3, nome: 'terzo genere', es: 'pinzette, avambraccio', fulcro: -210, tb: 77.3,
    R: { x: 210, L: 40, giu: 1 }, Pt: { x: -70, L: 120, giu: -1 }, tag: '{r:sempre svantaggiosa}', tt: 81.7 },
];
const YA = 400, YBP = 600, YBR = 650;   // l'asta, la quota del braccio della potenza e quella del braccio della resistenza
function forzaLeva(ctx, x, F, nome, al = 1) {
  if (al <= 0) return;
  const y0 = F.giu > 0 ? YA - 10 : YA + 10;   // le forze in giù arrivano da sopra, quelle in su da sotto
  const coda = [x, y0 - F.giu * F.L];
  freccia(ctx, coda, [x, y0], C.y, al);
  drawRich(ctx, '{y:' + nome + '}', x, coda[1] - F.giu * 26, { size: 32, alpha: al });
}
function quota(ctx, x0, x1, y, nome, al) {   // il braccio: dal fulcro al punto dove agisce la forza
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y - 11); ctx.lineTo(x0, y + 11); ctx.moveTo(x1, y - 11); ctx.lineTo(x1, y + 11); ctx.stroke();
  drawRich(ctx, nome, (x0 + x1) / 2, y + 26, { size: 30 });
  ctx.restore();
}
function sceneGeneri(ctx, t) {
  if (t < 47.2 || t > 86) return;
  const al = life(t, 47.6, 85.8, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  GENERI.forEach((Gn, i) => {
    // il primo genere fa da leva generica: prima la potenza, poi la resistenza, ognuna col suo fumetto
    const k = i === 0 ? P(t, 47.8, 48.4) : P(t, Gn.t0, Gn.t0 + .6);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    const { cx } = Gn, xf = cx + Gn.fulcro;
    conFont(TITOLI, () => drawRich(ctx, Gn.nome, cx, 180, { size: 36, weight: 600, alpha: i === 0 ? P(t, 55.2, 55.7) : 1 }));
    ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.strokeStyle = css(mix(C.y, C.ink, .5)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(cx - 215, YA - 9, 430, 18, 5); ctx.fill(); ctx.stroke();
    fulcro(ctx, xf, YA + 9, 56, 56);
    forzaLeva(ctx, cx + Gn.Pt.x, Gn.Pt, 'potenza', i === 0 ? P(t, 48.0, 48.5) : 1);
    forzaLeva(ctx, cx + Gn.R.x, Gn.R, 'resistenza', i === 0 ? P(t, 52.1, 52.6) : 1);
    const kb = P(t, Gn.tb, Gn.tb + .5);
    quota(ctx, xf, cx + Gn.Pt.x, YBP, '{mx:b} {x:potenza}', kb);
    quota(ctx, xf, cx + Gn.R.x, YBR, '{mx:b} {x:resistenza}', kb);
    drawRich(ctx, Gn.es, cx, 718, { size: 32, alpha: i === 0 ? P(t, 55.4, 55.9) : 1 });
    drawRich(ctx, Gn.tag, cx, 758, { size: 34, alpha: P(t, Gn.tt, Gn.tt + .5) });
    ctx.restore();
  });
  ctx.restore();
}

// 3 · in una frase (85,6–95)
function sceneFine(ctx, t) {
  if (t < 85.5) return;
  const al = 1 - P(t, 93.1, 94.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.8 });
    drawRich(ctx, 'Una leva è in equilibrio quando\ni due momenti sono uguali.', W / 2, 290, { size: 70, weight: 600, local: t - 86.2, stagger: .09 });
  });
  const pills = [[490, '{my:F₁}{mink:·}{mx:b₁} {mink:=} {my:F₂}{mink:·}{mx:b₂}'], [960, '2° genere:\n{g:sempre vantaggiosa}'], [1430, '3° genere:\n{r:sempre svantaggiosa}']];
  pills.forEach(([x, s], i) => {
    const a = 88.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la parte dell'adulto che scende (da inclinazione(),
  // si posa a terra a 18,5 s), poi la posizione del bambino che si sposta da 1 m a 3 m
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .4], ['pop', 12.5, .6],                             // l'altalena, il fulcro; i due pesi
    ['tono', 18.1, 18.5, [.6, .574, .498, .37, .2]], ['pop', 18.5, .15],              // lascio: scende dalla parte dell'adulto
    ['tono', 22.0, 23.6, [.3, .31, .38, .5, .62, .69, .7]],                           // il bambino va a 3 m
    ['soffio', 28.8], ['traccia', 28.8, 29.4],                                        // i due momenti, i bracci
    ['pop', 33.9, .5], ['pop', 34.6, .6], ['pop', 36.3, .5], ['ding', 37.2],          // 600 N·m e 600 N·m: uguali
    ['pop', 39.8, .5], ['pop', 40.0, .65],                                            // la legge della leva
    ['soffio', 47.6], ['pop', 48.0, .6], ['pop', 52.1, .45],                          // la potenza, la resistenza
    ['pop', 55.2, .5], ['traccia', 64.1, 64.6], ['pop', 64.2, .4],                    // primo genere: dipende dai bracci
    ['pop', 68.8, .55], ['traccia', 68.8, 69.3], ['ding', 73.4],                      // secondo genere: sempre vantaggiosa
    ['pop', 77.3, .6], ['traccia', 77.3, 77.8], ['pop', 81.7, .2],                    // terzo genere: sempre svantaggiosa
    ['soffio', 85.8], ['pop', 88.4, .5], ['pop', 88.9, .6], ['pop', 89.4, .7],        // in una frase
  ];
  return {
    titolo: 'L’altalena in equilibrio', durata: 95, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 28.6, 'l’altalena'], [28.6, 47.6, 'la legge della leva'], [47.6, 85.5, 'i tre generi']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneAltalena(ctx, t); sceneMomenti(ctx, t); sceneGeneri(ctx, t); sceneFine(ctx, t); },
  };
});
