'use strict';
/* Lo stesso millimetro — 1 mm di errore sul lato di un foglio A4 e sullo spessore di un capello: l'errore assoluto
   è lo stesso, la qualità della misura no. L'errore relativo (errore assoluto / valore medio) la misura. Argomento: incertezza. */
CVIDEO.registra('incertezza/errore-relativo', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [77.8, 190], [79.1, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [77.8, 1050], [79.1, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [77.8, 2.2], [79.1, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [77.8, 2], [79.1, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [77.8, -1.5], [79.1, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.2, 'felice'], [19.4, 'neutro'],
  [34.0, 'sorpreso'], [36.2, 'neutro'], [43.0, 'pensa'], [47.0, 'neutro'], [60.0, 'sorpreso'], [62.4, 'neutro'],
  [69.2, 'festa'], [71.6, 'neutro'], [80.3, 'felice'], [83.4, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Sbagliare di un millimetro:\nè tanto o è poco?'],
  [7.9, 12.4, 'Misuro il lato lungo di un\nfoglio A4 col righello: 297 mm.'],
  [12.6, 16.8, 'Le tacche sono a ogni millimetro:\nl’errore è {v:1 mm}.'],
  [17.0, 20.8, 'La misura si scrive\n{g:(297 ± 1) mm}.'],
  [21.0, 25.2, 'Un millimetro su 297:\nsul foglio quasi non si vede.'],
  [25.6, 29.4, 'Ora lo spessore di un capello:\ncirca 0,07 mm.'],
  [29.6, 33.8, 'Se lo misurassi col righello,\nl’errore sarebbe {v:1 mm}…'],
  [34.0, 38.4, '…ma qui 1 mm è {r:più di 14 volte}\nil capello!'],
  [38.6, 42.8, 'Stesso errore assoluto,\nmisure di qualità diversissima.'],
  [43.0, 46.8, 'Conta il {v:rapporto} fra\nl’errore e la misura.'],
  [47.0, 50.8, 'È l’{v:errore relativo}: errore\nassoluto diviso valore misurato.'],
  [51.0, 55.2, 'Foglio: 1 mm / 297 mm\n≈ 0,003 = {g:0,3 %}.'],
  [55.4, 59.8, 'mm diviso mm: un {v:numero puro},\nsenza unità, spesso in %.'],
  [60.0, 64.6, 'Capello: 1 mm / 0,07 mm ≈ 14,\ncirca il {r:1400 %}!'],
  [64.8, 69.0, 'Serve uno strumento più fine:\nil micrometro legge 0,01 mm.'],
  [69.2, 73.2, '0,01 / 0,07 ≈ 0,14:\nil {g:14 %}. Molto meglio.'],
  [73.4, 77.4, 'Più è piccolo l’errore relativo,\nmigliore è la misura.'],
  [80.3, 85.6, 'L’errore relativo dice\nquanto è buona una misura.'],
];

// ---------- aiutanti ----------
function riga(ctx, nome, val, y, al, size = 36) {
  if (al <= 0) return;
  txt(ctx, nome, 1260, y, { size: 30, color: C.dim, align: 'left', alpha: al });
  drawRich(ctx, val, 1800, y, { size, align: 'right', alpha: al });
}
function graffa(ctx, xa, xb, y, verso, col) {   // parentesi orizzontale con le stanghette verso il basso (+1) o l'alto (−1)
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xa, y + 12 * verso); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y + 12 * verso); ctx.stroke();
  ctx.restore();
}

// ---------- 1 · il foglio A4 col righello (7.5–25.4): 2,2 px per mm ----------
const S1 = 2.2, X0F = 455, YF = 150;
const xF = mm => X0F + mm * S1;
const LENTE = [930, 330, 125], S_LENTE = 40;   // la lente ingrandisce il righello intorno a 297 mm: 40 px per mm
function scenaFoglio(ctx, t) {
  if (t < 7.3 || t > 25.9) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 25.2, 25.8));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 820, 680);
  // il foglio, 297 mm per 210 mm, appoggiato sul righello
  ctx.fillStyle = css(C.x, .06); ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(xF(0), YF, 297 * S1, 210 * S1); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .25); ctx.lineWidth = 2;
  for (let y = YF + 50; y < YF + 210 * S1 - 60; y += 34) { ctx.beginPath(); ctx.moveTo(xF(15), y); ctx.lineTo(xF(282), y); ctx.stroke(); }
  txt(ctx, 'A4', 640, 381, { size: 64, weight: 600, color: C.dim, alpha: .6 });
  // il righello: tacche ai millimetri, numeri ai centimetri
  ctx.fillStyle = css(C.dim, .12); ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(440, 626, 740, 80); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.ink, .75);
  for (let mm = 0; mm <= 300; mm++) {
    ctx.lineWidth = mm % 10 ? 1.2 : 2;
    ctx.beginPath(); ctx.moveTo(xF(mm), 626); ctx.lineTo(xF(mm), 626 + (mm % 10 ? (mm % 5 ? 9 : 15) : 24)); ctx.stroke();
  }
  for (let c = 0; c <= 30; c += 5) txt(ctx, String(c), xF(c * 10), 684, { size: 30, color: C.dim });
  txt(ctx, 'cm', 476, 684, { size: 30, color: C.dim, align: 'left' });
  // la misura: 297 mm
  const km = P(t, 9.0, 9.5);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km;
    graffa(ctx, xF(0), xF(297), 598, 1, C.g);
    txt(ctx, '297 mm', xF(148.5), 574, { size: 36, weight: 600, color: C.g });
    ctx.restore();
  }
  // la lente sul bordo del foglio
  const kl = P(t, 12.8, 13.4, E.back);
  if (kl > 0) {
    const [cx, cy, r] = LENTE, xL = mm => cx + (mm - 297) * S_LENTE;
    ctx.save(); ctx.globalAlpha *= clamp(kl);
    dashed(ctx, [cx + r * .55, cy + r * .83], [xF(297), 626], C.dim, 1, .8);
    ctx.translate(cx, cy); ctx.scale(kl, kl); ctx.translate(-cx, -cy);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.save(); ctx.clip();
    ctx.fillStyle = C.paper; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    ctx.fillStyle = css(C.x, .06); ctx.fillRect(cx - r, cy - r, xL(297) - cx + r, 50 + r);
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xL(297), cy - r); ctx.lineTo(xL(297), cy + 50); ctx.stroke();
    ctx.fillStyle = css(C.dim, .12); ctx.fillRect(cx - r, cy + 50, 2 * r, r);
    ctx.strokeStyle = css(C.ink, .8);
    for (let mm = 293; mm <= 301; mm++) { ctx.lineWidth = mm % 10 ? 2 : 3.5; ctx.beginPath(); ctx.moveTo(xL(mm), cy + 50); ctx.lineTo(xL(mm), cy + 50 + (mm % 10 ? (mm % 5 ? 22 : 36) : 54)); ctx.stroke(); }
    txt(ctx, '30', xL(300), cy + 104, { size: 30, color: C.dim });
    // l'errore: fra una tacca e l'altra c'è 1 mm
    const ke = P(t, 13.6, 14.1);
    if (ke > 0) { ctx.globalAlpha *= ke; graffa(ctx, xL(297), xL(298), cy + 36, 1, C.v); txt(ctx, '1 mm', xL(298.5), cy + 18, { size: 30, weight: 600, color: C.v }); }
    ctx.restore();
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · il capello, ingrandito: 400 px per mm (25.4–42.8) ----------
const S2 = 400, X0C = 470, xC = mm => X0C + mm * S2;
function scenaCapello(ctx, t) {
  if (t < 25.2 || t > 43.4) return;
  const al = P(t, 25.5, 26.1) * (1 - P(t, 42.6, 43.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 820, 680);
  txt(ctx, 'ingrandito', 1160, 148, { size: 30, color: C.dim, align: 'right' });
  // il righello: solo due tacche, 0 e 1 mm
  ctx.fillStyle = css(C.dim, .12); ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(400, 600, 780, 90); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  for (const mm of [0, 1]) { ctx.beginPath(); ctx.moveTo(xC(mm), 600); ctx.lineTo(xC(mm), 640); ctx.stroke(); }
  txt(ctx, '0', xC(0), 664, { size: 32, color: C.dim }); txt(ctx, '1 mm', xC(1), 664, { size: 32, color: C.dim });
  // le copie del capello: ne stanno più di 14 in un millimetro
  // 13 copie intere (14 spessori col capello vero, 0,98 mm) più un pezzetto da 0,02 mm: 1 mm esatto
  for (let i = 1; i <= 14; i++) {
    const k = life(t, 34.3 + i * .08, 42.8, .3, .4);
    if (k <= 0) continue;
    ctx.fillStyle = css(C.y, .14 * k); ctx.strokeStyle = css(C.y, .5 * k); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.rect(xC(i * .07), 300, (i < 14 ? .07 : 1 - 14 * .07) * S2, 220); ctx.fill(); ctx.stroke();
  }
  const kq = life(t, 35.0, 42.8, .4, .4);
  if (kq > 0) drawRich(ctx, '{r:più di 14 spessori}', (xC(0) + xC(1)) / 2, 272, { size: 32, alpha: kq });
  // il capello vero, spesso 0,07 mm
  const kc = P(t, 26.0, 26.6);
  ctx.save(); ctx.globalAlpha *= kc;
  ctx.fillStyle = css(C.y, .45); ctx.strokeStyle = css(C.y); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(xC(0), 150, .07 * S2, 450); ctx.fill(); ctx.stroke();
  graffa(ctx, xC(0), xC(.07), 176, 1, C.ink);
  txt(ctx, '≈ 0,07 mm', xC(.07) + 22, 186, { size: 34, align: 'left' });
  ctx.restore();
  // l'errore del righello: 1 mm
  const ke = P(t, 30.0, 30.5);
  if (ke > 0) {
    ctx.save(); ctx.globalAlpha *= ke;
    graffa(ctx, xC(0), xC(1), 566, 1, C.r);
    drawRich(ctx, '{r:errore: 1 mm}', (xC(0) + xC(1)) / 2, 540, { size: 34 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- i numeri delle due misure (7.5–42.8) ----------
function scenaNumeri(ctx, t) {
  if (t < 7.5 || t > 43.4) return;
  const al = P(t, 7.7, 8.4) * (1 - P(t, 42.6, 43.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1220, 110, 620, 680);
  conFont(TITOLI, () => drawRich(ctx, 'foglio A4', 1530, 165, { size: 36, weight: 600 }));
  riga(ctx, 'misura', '297 mm', 232, P(t, 9.0, 9.5));
  riga(ctx, 'errore assoluto', '{v:1 mm}', 288, P(t, 14.0, 14.5));
  drawRich(ctx, '{g:(297 ± 1) mm}', 1530, 352, { size: 50, weight: 600, alpha: P(t, 17.4, 17.9), local: t - 17.4 });
  // 1 mm su 297, in proporzione: la barra è il foglio, la scheggia rossa è l'errore
  const kb = P(t, 21.4, 21.9);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb;
    ctx.fillStyle = css(C.dim, .35); ctx.fillRect(1260, 404, 540, 24);
    ctx.fillStyle = css(C.r); ctx.fillRect(1800 - Math.max(2.5, 540 / 297), 398, Math.max(2.5, 540 / 297), 36);
    arrowHead(ctx, [1799, 440], -Math.PI / 2, C.r, .8);
    txt(ctx, '1 mm', 1786, 466, { size: 30, color: C.r, align: 'right' });
    ctx.restore();
  }
  ctx.save(); ctx.globalAlpha *= P(t, 25.6, 26.0); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1250, 500); ctx.lineTo(1810, 500); ctx.stroke(); ctx.restore();
  conFont(TITOLI, () => drawRich(ctx, 'capello', 1530, 548, { size: 36, weight: 600, alpha: P(t, 25.8, 26.3) }));
  riga(ctx, 'misura', '≈ 0,07 mm', 612, P(t, 26.2, 26.7));
  riga(ctx, 'errore assoluto', '{r:1 mm}', 660, P(t, 30.0, 30.5));
  txt(ctx, 'col righello, per assurdo', 1260, 702, { size: 30, color: C.dim, align: 'left', alpha: P(t, 30.0, 30.5) });
  drawRich(ctx, '{r:l’errore supera 14 volte la misura}', 1530, 752, { size: 30, alpha: P(t, 34.4, 34.9), local: t - 34.4 });
  ctx.restore();
}

// ---------- 3 · l'errore relativo (42.8–77.6) ----------
// ogni riga in proporzione: la barra grigia è la misura, quella rossa l'errore, nella stessa scala
const errCapello = t => Math.pow(10, lerp(0, -2, P(t, 65.4, 67.2)));   // 1 mm col righello, 0,01 mm col micrometro
function barre(ctx, y, nome, err, misura, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, nome, 430, y, { size: 34, align: 'left' });
  ctx.fillStyle = css(C.dim, .35); ctx.fillRect(430, y + 44, 700, 32);
  const w = 700 * err / misura, wv = Math.max(2.5, Math.min(w, 730));
  ctx.fillStyle = css(C.r); ctx.fillRect(430, y + 88, wv, 16);
  if (w > 730) { arrowHead(ctx, [1166, y + 96], 0, C.r, 1); txt(ctx, 'continua: 14 volte la grigia', 1150, y + 134, { size: 30, color: C.r, align: 'right' }); }
  ctx.restore();
}
function scenaBarre(ctx, t) {
  if (t < 42.6 || t > 78.4) return;
  const al = P(t, 42.8, 43.4) * (1 - P(t, 77.4, 78.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 820, 680);
  conFont(TITOLI, () => drawRich(ctx, 'errore e misura, in proporzione', 782, 162, { size: 34, weight: 600 }));
  const kF = P(t, 51.6, 52.1), kC = P(t, 61.0, 61.5), kM = P(t, 69.4, 69.9);
  barre(ctx, 240, 'foglio A4', 1, 297, P(t, 43.3, 43.8));
  drawRich(ctx, '{g:0,3 %}', 1150, 240, { size: 38, align: 'right', alpha: kF });
  // la riga del capello: prima col righello (1400 %), poi col micrometro (14 %)
  const ac = P(t, 59.9, 60.4);
  if (ac > 0) {
    ctx.save(); ctx.globalAlpha *= ac;
    barre(ctx, 470, 'capello', errCapello(t), .07, 1);
    drawRich(ctx, '{r:1400 %}', 1150, 470, { size: 38, align: 'right', alpha: kC * (1 - P(t, 65.1, 65.4)) });
    drawRich(ctx, '{g:14 %}', 1150, 470, { size: 38, align: 'right', alpha: kM });
    txt(ctx, 'col micrometro', 610, 470, { size: 30, color: C.dim, align: 'left', alpha: P(t, 65.4, 65.9) });
    ctx.restore();
  }
  // la legenda
  ctx.fillStyle = css(C.dim, .35); ctx.fillRect(430, 724, 40, 26); txt(ctx, 'misura', 482, 737, { size: 30, align: 'left' });
  ctx.fillStyle = css(C.r); ctx.fillRect(660, 729, 40, 16); txt(ctx, 'errore', 712, 737, { size: 30, align: 'left' });
  ctx.restore();
}
function scenaFormula(ctx, t) {
  if (t < 42.6 || t > 78.4) return;
  const al = P(t, 42.8, 43.4) * (1 - P(t, 77.4, 78.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1220, 110, 620, 680);
  conFont(TITOLI, () => drawRich(ctx, 'errore relativo', 1530, 162, { size: 36, weight: 600 }));
  drawRich(ctx, 'errore relativo =', 1530, 212, { size: 32, alpha: P(t, 47.3, 47.8) });
  drawSeq(ctx, [{ num: 'errore assoluto', den: 'valore misurato (o medio)' }], 1530, 280, 32, { local: t - 47.6 });
  const r = (a, nome, val, y) => { const k = P(t, a, a + .5); txt(ctx, nome, 1260, y, { size: 30, color: C.dim, align: 'left', alpha: k }); drawRich(ctx, val, 1530, y + 44, { size: 36, alpha: k, local: t - a }); };
  r(51.2, 'foglio A4', '1 / 297 ≈ 0,003 = {g:0,3 %}', 360);
  r(60.2, 'capello, righello (per assurdo)', '1 / 0,07 ≈ 14 = {r:1400 %}', 480);
  r(69.4, 'capello, col micrometro', '0,01 / 0,07 ≈ 0,14 = {g:14 %}', 600);
  drawRich(ctx, '{v:numero puro}: mm / mm, senza unità', 1530, 738, { size: 30, alpha: P(t, 55.6, 56.1), local: t - 55.6 });
  ctx.restore();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Lo stesso millimetro', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
// 4 · in una frase (77.8–88.6)
function scenaFine(ctx, t) {
  if (t < 77.9) return;
  const al = 1 - P(t, 86.1, 87.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 78.1 });
    drawRich(ctx, 'L’errore relativo dice\nla {g:qualità} di una misura.', W / 2, 290, { size: 70, weight: 600, local: t - 78.5, stagger: .09 });
  });
  const pills = [[490, 'errore relativo =\nerrore / valore misurato'], [960, 'un numero puro,\nspesso in {v:%}'], [1430, 'foglio {g:0,3 %}\ncapello {r:1400 %}']];
  pills.forEach(([x, s], i) => {
    const a = 79.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): col micrometro il tono segue l'errore del capello in scala logaritmica,
  // da 1 mm (1) a 0,01 mm (0)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 9.0, .55],                                               // il foglio sul righello: 297 mm
    ['pop', 12.8, .5], ['pop', 13.6, .4], ['pop', 14.0, .45],                         // la lente, 1 mm fra due tacche, l'errore
    ['ding', 17.4], ['pop', 21.4, .4],                                                // (297 ± 1) mm; 1 mm su 297, in proporzione
    ['soffio', 25.5], ['pop', 26.0, .6], ['pop', 30.0, .3],                           // il capello ingrandito, l'errore del righello
    ['tono', 34.38, 35.5, [.2, .9]], ['pop', 35.0, .7],                               // ci stanno più di 14 capelli
    ['soffio', 42.8], ['pop', 43.3, .45],                                             // errore e misura, in proporzione
    ['pop', 47.3, .5], ['pop', 51.2, .45], ['ding', 51.8],                            // la formula; foglio: 0,3 %
    ['pop', 55.6, .45],                                                               // un numero puro
    ['pop', 59.9, .4], ['pop', 61.0, .85],                                            // capello col righello: 1400 %
    ['pop', 65.4, .5], ['tono', 65.4, 67.2, [1, .94, .5, .06, 0]],                    // il micrometro: l'errore si accorcia
    ['soffio', 78.1], ['pop', 79.9, .5], ['pop', 80.4, .6], ['pop', 80.9, .7],        // in una frase
  ];
  return {
    titolo: 'Lo stesso millimetro', durata: 88.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.4, 'il foglio'], [25.4, 42.8, 'il capello'], [42.8, 77.6, 'l’errore relativo']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaFoglio(ctx, t); scenaCapello(ctx, t); scenaNumeri(ctx, t); scenaBarre(ctx, t); scenaFormula(ctx, t); scenaFine(ctx, t); },
  };
});
