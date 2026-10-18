'use strict';
/* Il lampadario di Pisa — il periodo del pendolo semplice (filo senza massa, pallina puntiforme) non dipende dalla massa né,
   per oscillazioni piccole, dall'ampiezza: T = 2π·√(l/g). Tutti i pendoli sono integrati numericamente (RK4, θ″ = −(g/l)·sin θ),
   in tempo reale: 1 m e 10° → 2,01 s; 5° → 2,01 s; 60° → 2,15 s (circa il 7% in più); 0,25 m → 1,01 s.
   Il lampadario (aneddoto tradizionale): 3 m, 8°, poco smorzato, ogni oscillazione 3,48 s. Argomento: dinamica-applicazioni. */
CVIDEO.registra('dinamica-applicazioni/pendolo', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, card, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [91.6, 190], [92.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [91.6, 1050], [92.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [91.6, 2.2], [92.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [91.6, 2], [92.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [91.6, -1.5], [92.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.6, 'sorpreso'], [17.5, 'felice'],
  [22.5, 'neutro'], [32.1, 'pensa'], [36.1, 'neutro'], [40.4, 'sorpreso'], [44.7, 'neutro'], [48.9, 'felice'],
  [53.7, 'neutro'], [58.1, 'pensa'], [62.9, 'sorpreso'], [67.7, 'neutro'], [72.3, 'felice'], [77.6, 'neutro'],
  [82.5, 'felice'], [87.4, 'festa'], [91.6, 'neutro'], [94.0, 'felice'], [98.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Da che cosa dipende il ritmo\ndi un pendolo?'],
  [7.9, 12.5, 'Si racconta che Galileo, nel Duomo\ndi Pisa, guardasse un lampadario.'],
  [12.6, 17.4, 'Le oscillazioni si stringevano, ma\nsembravano durare sempre uguali.'],
  [17.5, 22.4, 'Misurata col cronometro, ogni oscillazione\ndura 3,48 s, anche quando si stringe.'],
  [22.5, 27.1, 'Il {v:pendolo semplice}: un filo senza\nmassa e una pallina piccola.'],
  [27.2, 32.0, 'Il {v:periodo} {mink:T} è il tempo di andata\ne ritorno: un’oscillazione completa.'],
  [32.1, 36.0, 'Dieci volte più pesante:\nandrà più in fretta?'],
  [36.1, 40.3, 'Stessi 1 m, stessi 10°:\nle lascio insieme.'],
  [40.4, 44.6, 'Oscillano {g:insieme}: il periodo\nnon dipende dalla massa.'],
  [44.7, 48.8, 'Stessa massa, ampiezze 10° e 5°:\nle lascio insieme.'],
  [48.9, 53.6, 'Ancora {g:insieme}: è l’{v:isocronismo},\nvale per oscillazioni piccole.'],
  [53.7, 58.0, '{g:Piccole} vuol dire\nfino a circa 10–15°.'],
  [58.1, 62.8, 'Con 60° invece si vede:\nlo lascio insieme a quello da 10°.'],
  [62.9, 67.6, 'Quello a 60° resta {r:indietro}:\nperiodo più lungo, circa il 7%.'],
  [67.7, 72.2, 'Fili di 1 m e di 0,25 m:\nli lascio insieme.'],
  [72.3, 77.5, 'Il corto fa {g:due} oscillazioni\nmentre il lungo ne fa una.'],
  [77.6, 82.4, 'Un quarto della lunghezza, {g:metà}\ndel periodo: circa 1 s contro 2 s.'],
  [82.5, 87.3, 'In formula: {mink:T = 2π·√(l/g)},\ncon {mink:g} = 9,8 m/s².'],
  [87.4, 91.4, 'La massa nella formula\n{g:non c’è}.'],
  [94.0, 98.6, 'Per piccole oscillazioni il periodo\ndipende solo da {mink:l} e da {mink:g}.'],
];

// ---------- aiutanti ----------
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill();
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il moto vero ----------
const G = 9.8, RAD = Math.PI / 180, PXM = 320, YP = 150;   // 320 px per metro; i perni a y 150
// θ(τ) del pendolo semplice lasciato da fermo a θ0: θ″ = −(g/l)·sin θ, RK4 con passo fisso (sempre lo stesso risultato)
function theta(l, th0, tau) {
  if (tau <= 0) return th0;
  const h0 = 1 / 400, n = Math.ceil(tau / h0), h = tau / n, f = th => -G / l * Math.sin(th);
  let th = th0, w = 0;
  for (let i = 0; i < n; i++) {
    const k1t = w, k1w = f(th), k2t = w + h / 2 * k1w, k2w = f(th + h / 2 * k1t);
    const k3t = w + h / 2 * k2w, k3w = f(th + h / 2 * k2t), k4t = w + h * k3w, k4w = f(th + h * k3t);
    th += h / 6 * (k1t + 2 * k2t + 2 * k3t + k4t); w += h / 6 * (k1w + 2 * k2w + 2 * k3w + k4w);
  }
  return th;
}
// le prove: per ciascuna [inizio, fine, rilascio, A, B]; un pendolo è { l, a (gradi), m (kg), T (periodo misurato, s) }
const XA = 620, XB = 990;
const PROVE = [
  [22.6, 31.9, 27.2, { l: 1, a: 10, m: .1, T: '2,01' }, null],
  [32.0, 44.6, 37.0, { l: 1, a: 10, m: .1, T: '2,01' }, { l: 1, a: 10, m: 1, T: '2,01' }],
  [44.7, 57.9, 46.0, { l: 1, a: 10, m: .1, T: '2,01' }, { l: 1, a: 5, m: .1, T: '2,01' }],
  [58.0, 67.5, 60.0, { l: 1, a: 10, m: .1, T: '2,01' }, { l: 1, a: 60, m: .1, T: '2,15' }],
  [67.6, 91.5, 69.0, { l: 1, a: 10, m: .1, T: '2,01', px: 560 }, { l: .25, a: 10, m: .1, T: '1,01', px: 560 }],   // qui 560 px per metro: il corto si vede
];
const PERIODO = { '2,01': 2.011, '2,15': 2.154, '1,01': 1.006 };   // dal conto con node (RK4): servono a far comparire il numero
function pendolo(ctx, x, p, t, rel, al, nome) {
  if (al <= 0) return;
  const th = theta(p.l, p.a * RAD, t - rel), L = p.l * (p.px || PXM);
  const bx = x + L * Math.sin(th), by = YP + L * Math.cos(th), r = p.m >= 1 ? 27 : 17;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.dim); ctx.fillRect(x - 46, YP - 12, 92, 12);
  txt(ctx, nome, x + 64, YP - 4, { size: 32, weight: 600, color: C.dim, align: 'left' });
  dashed(ctx, [x, YP], [x, YP + L + 30], C.dim, 1, .45);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, YP); ctx.lineTo(bx, by); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .3)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il lampadario di Pisa', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il lampadario (7,5–22,6): 3 m di catena (disegnata a 160 px per metro), 8°, poco smorzato, in tempo reale
const LL = 3, TH0 = 8 * RAD, GAM = .05, OML = Math.sqrt(G / LL), OMD = Math.sqrt(OML * OML - GAM * GAM), TL = 2 * Math.PI / OMD, T_LAMP = 7.6;
const lampAng = tau => TH0 * Math.exp(-GAM * tau) * (Math.cos(OMD * tau) + GAM / OMD * Math.sin(OMD * tau));
function sceneLampadario(ctx, t) {
  if (t < 7.5 || t > 23.0) return;
  const al = life(t, 7.6, 22.8, .6, .5), tau = Math.max(0, t - T_LAMP), th = lampAng(tau);
  const X0 = 836, Y0 = 120, LP = LL * 160, bx = X0 + LP * Math.sin(th), by = Y0 + LP * Math.cos(th);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.dim); ctx.fillRect(X0 - 60, Y0 - 10, 120, 12);
  // la catena: anelli lungo il filo
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.setLineDash([10, 6]);
  ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
  // il lampadario, che oscilla col filo
  ctx.translate(bx, by); ctx.rotate(-th);
  ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(70, 46); ctx.lineTo(-70, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 46, 70, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  for (const dx of [-50, -17, 17, 50]) {
    ctx.fillStyle = css(C.paper); ctx.fillRect(dx - 5, 18, 10, 24); ctx.strokeRect(dx - 5, 18, 10, 24);
    ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.ellipse(dx, 10, 5, 9, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// 2 · il pendolo semplice e le prove (22,6–91,5)
function scenePendoli(ctx, t) {
  for (const [a, b, rel, A, B] of PROVE) {
    if (t < a - .1 || t > b + .1) continue;
    pendolo(ctx, XA, A, t, rel, life(t, a, b, .4, .3), 'A');
    if (B) pendolo(ctx, XB, B, t, rel, life(t, a + .3, b, .4, .3), 'B');
  }
  // la gara delle lunghezze: il contatore delle oscillazioni complete
  const kc = life(t, 69.0, 91.4, .4, .3);
  if (kc > 0) {
    const n = T => Math.max(0, Math.floor((t - 69.0) / T + 1e-9));
    txt(ctx, 'oscillazioni', 1190, 215, { size: 30, color: C.dim, alpha: kc });
    txt(ctx, 'A', 1125, 265, { size: 40, weight: 600, align: 'left', alpha: kc });
    txt(ctx, String(n(PERIODO['2,01'])), 1265, 265, { size: 48, weight: 600, align: 'right', alpha: kc });
    txt(ctx, 'B', 1125, 320, { size: 40, weight: 600, color: C.v, align: 'left', alpha: kc });
    txt(ctx, String(n(PERIODO['1,01'])), 1265, 320, { size: 48, weight: 600, color: C.v, align: 'right', alpha: kc });
  }
  // l'ipotesi sbagliata, poi smentita
  const ki = life(t, 32.4, 44.5, .4, .4);
  if (ki > 0) {
    drawRich(ctx, '{r:più pesante, più veloce?}', 805, 640, { size: 36, alpha: ki });
    const kx = P(t, 40.6, 41.2);   // smentita: la frase si cancella
    if (kx > 0) {
      const w = M.richW(ctx, '{r:più pesante, più veloce?}', 36);
      ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(805 - w / 2 - 10, 642); ctx.lineTo(805 - w / 2 - 10 + (w + 20) * kx, 642); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:stesso periodo}', 805, 700, { size: 36, alpha: ki * P(t, 41.0, 41.5) });
    }
  }
  // l'ampiezza dei 60°: l'arco
  const k6 = life(t, 58.3, 67.4, .4, .3);
  if (k6 > 0) {
    ctx.save(); ctx.globalAlpha *= k6 * .6; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.arc(XB, YP, PXM, Math.PI / 2 - 60 * RAD, Math.PI / 2 + 60 * RAD); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
}

function sceneStage(ctx, t) {
  if (t < 7.5 || t > 91.8) return;
  const al = life(t, 7.5, 91.6, .6, .5);
  card(ctx, 372, 108, 928, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  sceneLampadario(ctx, t);
  scenePendoli(ctx, t);
  chip(ctx, 400, 762, P(t, 7.8, 8.2), 'tempo reale');
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1585, XL0 = 1355, XCA = 1638, XCB = 1762;
function scenePannello(ctx, t) {
  if (t < 8.2 || t > 91.8) return;
  const al = life(t, 8.3, 91.6, .5, .5);
  card(ctx, 1330, 108, 510, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, PCX, 165, { size: 38, weight: 600, alpha: a }));
  const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XL0, y); ctx.lineTo(1810, y); ctx.stroke(); ctx.restore(); };
  // 1 · il lampadario
  const s1 = 1 - P(t, 22.3, 22.7);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    tit('il lampadario', 1);
    drawRich(ctx, '{dim:catena}', XL0, 240, { size: 32, align: 'left', alpha: P(t, 8.6, 9.0) });
    drawRich(ctx, '3 m', 1810, 240, { size: 36, align: 'right', alpha: P(t, 8.6, 9.0) });
    const amp = Math.round(TH0 / RAD * Math.exp(-GAM * Math.max(0, t - T_LAMP)));
    drawRich(ctx, '{dim:ampiezza}', XL0, 295, { size: 32, align: 'left', alpha: P(t, 12.8, 13.2) });
    drawRich(ctx, amp + '°', 1810, 295, { size: 36, align: 'right', alpha: P(t, 12.8, 13.2) });
    riga(340, P(t, 12.8, 13.2));
    txt(ctx, 'durata di ogni oscillazione', PCX, 385, { size: 30, color: C.dim, alpha: P(t, 17.6, 18.0) });
    for (let k = 1; k <= 4; k++) {
      const tk = Math.max(T_LAMP + k * TL, 17.6 + .3 * k), a = P(t, tk, tk + .3);   // si leggono da quando Stilla nomina il cronometro
      if (a <= 0) continue;
      drawRich(ctx, '{dim:' + k + 'ª}', XL0, 385 + 55 * k, { size: 32, align: 'left', alpha: a });
      drawRich(ctx, '3,48 s', 1810, 385 + 55 * k, { size: 36, align: 'right', alpha: a });
    }
    ctx.restore();
  }
  // 2 · il pendolo semplice
  const s2 = P(t, 22.6, 23.0);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    tit('il pendolo semplice', 1);
    const kB = P(t, 32.2, 32.6);
    txt(ctx, 'A', XCA, 235, { size: 32, weight: 600, color: C.dim });
    txt(ctx, 'B', XCB, 235, { size: 32, weight: 600, color: C.dim, alpha: kB });
    drawRich(ctx, '{dim:lunghezza} {mink:l}', XL0, 290, { size: 32, align: 'left' });
    drawRich(ctx, '{dim:massa}', XL0, 345, { size: 32, align: 'left' });
    drawRich(ctx, '{dim:ampiezza}', XL0, 400, { size: 32, align: 'left' });
    riga(440, 1);
    drawRich(ctx, '{dim:periodo} {mink:T}', XL0, 485, { size: 32, align: 'left' });
    const val = (p, q) => ({ l: (p.l === 1 ? '1 m' : '0,25 m'), m: (p.m === 1 ? '1 kg' : '0,1 kg'), a: p.a + '°', diff: q });
    PROVE.forEach(([a, b, rel, A, B]) => {
      const k = life(t, a, b, .4, .3);
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      [[A, XCA, B], [B, XCB, A]].forEach(([p, x, q]) => {
        if (!p) return;
        const c = (key) => q && p[key] !== q[key] ? '{v:' : '{ink:';
        drawRich(ctx, c('l') + (p.l === 1 ? '1 m' : '0,25 m') + '}', x, 290, { size: 32 });
        drawRich(ctx, c('m') + (p.m === 1 ? '1 kg' : '0,1 kg') + '}', x, 345, { size: 32 });
        drawRich(ctx, c('a') + p.a + '°}', x, 400, { size: 32 });
        const tT = rel + PERIODO[p.T];
        drawRich(ctx, '{g:' + p.T + ' s}', x, 485, { size: 32, alpha: P(t, tT, tT + .3) });
      });
      ctx.restore();
    });
    riga(535, 1);
    // le conclusioni di ogni prova
    const nota = (s, y, a, b, sz = 32) => drawRich(ctx, s, PCX, y, { size: sz, alpha: life(t, a, b, .4, .3) });
    nota('{g:la massa non conta}', 590, 41.0, 44.6, 34);
    nota('{v:isocronismo}', 590, 49.2, 57.9, 36);
    nota('{dim:per oscillazioni piccole,}', 645, 49.6, 57.9);
    nota('{dim:fino a circa 10–15°}', 695, 54.0, 57.9);
    nota('{dim:60°:} 2,15 s ≈ 1,07 · 2,01 s', 590, 63.2, 67.5);
    nota('{dim:circa il 7% in più}', 645, 63.6, 67.5);
    nota('{dim:un quarto della lunghezza,}', 590, 77.8, 82.4);
    nota('{g:metà del periodo}', 645, 78.2, 82.4, 34);
    nota('{mink:T = 2π·√(l/g)}', 600, 82.7, 91.6, 46);
    nota('{dim:con} {mink:l} {dim:= 1 m e} {mink:g} {dim:= 9,8 m/s²:}', 660, 83.6, 91.6);
    nota('{mink:T} ≈ 2,01 s', 710, 84.0, 91.6, 36);
    nota('{g:la massa non c’è}', 762, 87.6, 91.6, 34);
    ctx.restore();
  }
  ctx.restore();
}

// 3 · in una frase (91,6–101)
function sceneFine(ctx, t) {
  if (t < 91.5) return;
  const al = 1 - P(t, 99.1, 100.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 91.8 });
    drawRich(ctx, 'Il periodo dipende dalla lunghezza,\nnon dalla massa né dall’ampiezza (se piccola).', W / 2, 290, { size: 66, weight: 600, local: t - 92.2, stagger: .09 });
  });
  const pills = [[490, '{mink:T = 2π·√(l/g)}'], [960, 'la massa\n{g:non conta}'], [1430, 'l’ampiezza non conta,\nse è {g:piccola}']];
  pills.forEach(([x, s], i) => {
    const a = 93.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 44, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 7.6, 11.08, [.75, .68, .51, .34, .27, .34, .49, .65, .71]],   // il lampadario: un'oscillazione
    ['pop', 12.8, .45],                                                               // l'ampiezza
    ['pop', 17.9, .5], ['pop', 18.5, .5], ['pop', 21.51, .5],                         // ogni oscillazione 3,48 s
    ['soffio', 22.6],                                                                 // il pendolo semplice
    ['tono', 27.2, 29.21, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['ding', 29.21],   // un periodo: 2,01 s
    ['pop', 32.3, .5],                                                                // B dieci volte più pesante
    ['tono', 37.0, 39.01, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['pop', 39.01, .5],   // lasciati insieme
    ['traccia', 40.6, 41.2], ['ding', 41.3],                                          // ipotesi cancellata: stesso periodo
    ['pop', 45.0, .4],                                                                // B a 5°
    ['tono', 46.0, 48.01, [.75, .68, .5, .32, .25, .32, .5, .68, .75]],               // 10° e 5°, lasciati insieme
    ['tono', 46.0, 48.01, [.63, .59, .5, .41, .38, .41, .5, .59, .62]], ['ding', 48.01],
    ['pop', 49.2, .55], ['pop', 54.0, .45],                                           // isocronismo, fino a 10–15°
    ['pop', 58.3, .6],                                                                // B a 60°, l'arco
    ['tono', 60.0, 62.01, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['pop', 62.01, .5],   // 10°: 2,01 s
    ['tono', 60.0, 62.15, [1, .89, .5, .11, 0, .11, .5, .89, 1]], ['pop', 62.15, .3], // 60°: 2,15 s, resta indietro
    ['pop', 63.2, .45],                                                               // circa il 7% in più
    ['pop', 67.9, .4],                                                                // B da 0,25 m
    ['tono', 69.0, 70.01, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['pop', 70.01, .6],   // il corto: 1,01 s
    ['tono', 69.0, 71.01, [.75, .68, .5, .32, .25, .32, .5, .68, .75]], ['ding', 71.01],      // il lungo: 1 contro 2
    ['pop', 77.8, .4], ['ding', 78.2],                                                // metà del periodo
    ['pop', 82.7, .6], ['ding', 84.0],                                                // T = 2π·√(l/g) ≈ 2,01 s
    ['soffio', 91.8], ['pop', 93.6, .5], ['pop', 94.1, .6], ['pop', 94.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il lampadario di Pisa', durata: 101, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.4, 'il lampadario'], [22.4, 44.6, 'la massa'], [44.6, 67.6, 'l’ampiezza'], [67.6, 82.4, 'la lunghezza'], [82.4, 91.4, 'la formula']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneStage(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
