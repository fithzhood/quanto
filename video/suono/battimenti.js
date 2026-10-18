'use strict';
/* Due diapason quasi uguali — i battimenti. Pressione di due diapason, f₁ = 440 Hz e f₂ = 444 Hz, stessa ampiezza:
   p₁ = sin(2π·f₁·t), p₂ = sin(2π·f₂·t + φ) con φ = π (a t = 0 si annullano). Somma punto per punto, disegnata davvero:
   p₁ + p₂ = 2·sin(2π·442·t + φ/2)·cos(π·4·t + φ/2): una nota a 442 Hz (la media) con un inviluppo che va e viene
   f₂ − f₁ = 4 volte al secondo. A 125 ms le creste coincidono (somma doppia), a 250 ms il secondo è avanti di mezza
   oscillazione e la somma si annulla. Finestre di 10 ms (96 px per ms) e un secondo intero (960 px, 6000 punti).
   Accordare: f₂ scende a 442 (2 battimenti al secondo), 441 (1), 440 (nessuno). φ = π·(f₂ − 440)/4 (ogni volta il
   diapason si percuote di nuovo, la fase è arbitraria): a 440 Hz le due onde sono in fase. Argomento: suono. */
CVIDEO.registra('suono/battimenti', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, dashed, dot } = M;

const T_FINE = 90.3;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.5, 'pensa'], [17.1, 'neutro'],
  [21.7, 'felice'], [26.3, 'neutro'], [35.5, 'sorpreso'], [40.1, 'neutro'], [44.7, 'felice'], [49.3, 'neutro'],
  [57.9, 'festa'], [62.5, 'felice'], [67.1, 'neutro'], [71.7, 'felice'], [76.3, 'neutro'], [85.5, 'festa'],
  [T_FINE, 'neutro'], [92.7, 'felice'], [96.7, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Due diapason quasi uguali:\nperché il suono va e viene?'],
  [7.9, 12.4, 'Il primo, {mink:f₁} = 440 Hz: ecco\nla pressione, per 10 ms.'],
  [12.5, 17.0, 'L’altro a {mink:f₂} = 444 Hz: quasi\nidentico, appena più fitto.'],
  [17.1, 21.6, 'Suonano insieme: le pressioni\nsi {g:sommano}, punto per punto.'],
  [21.7, 26.2, 'Qui le creste coincidono:\nla somma è {g:doppia}, suono forte.'],
  [26.3, 30.8, 'Ogni secondo, quello a 444 Hz\nfa 4 oscillazioni in più.'],
  [30.9, 35.4, 'Dopo 125 ms è avanti\ndi mezza oscillazione…'],
  [35.5, 40.0, '…cresta contro gola: le pressioni\nsi {g:annullano}. Silenzio.'],
  [40.1, 44.6, 'Ecco un secondo intero della somma:\nuna nota a 442 Hz…'],
  [44.7, 49.2, '…con un volume che {g:va e viene}:\nè l’{v:inviluppo}.'],
  [49.3, 57.8, 'Al rallentatore conto i massimi\nin un secondo…'],
  [57.9, 62.4, '…sono {g:4}: sono i {v:battimenti}.'],
  [62.5, 67.0, '444 − 440 = 4: la differenza\nfra le due frequenze.'],
  [67.1, 71.6, '{v:Battimenti al secondo} = {mink:f₂ − f₁},\ncon {mink:f₂} la più alta.'],
  [71.7, 76.2, 'Così si {g:accorda} uno strumento:\nporto l’altro a 442 Hz…'],
  [76.3, 80.8, '…2 battimenti al secondo,\npiù lenti.'],
  [80.9, 85.4, 'A 441 Hz, uno al secondo…'],
  [85.5, 90.0, '…a 440 Hz spariscono:\n{g:accordato}!'],
  [92.7, 97.7, 'Due note vicine fanno battimenti:\n{mink:f₂ − f₁} volte al secondo.'],
];

// ---------- la fisica ----------
const F1 = 440;
const f2 = t => kf(t, [[72.6, 444], [73.8, 442], [81.2, 442], [82.2, 441], [86.0, 441], [87.0, 440]]);
const fase = f => Math.PI * (f - 440) / 4;
const p1 = s => Math.sin(2 * Math.PI * F1 * s);
const p2 = (s, f) => Math.sin(2 * Math.PI * f * s + fase(f));
const inv = (s, f) => 2 * Math.abs(Math.cos(Math.PI * (f - F1) * s + fase(f) / 2));
const w0 = t => lerp(.120, .245, P(t, 31.0, 32.0));      // inizio della finestra di 10 ms, in s

// ---------- il disegno: finestra di 10 ms (righe A e B) e un secondo intero (riga C) ----------
const X0 = 260, LW = 960, YA = 250, YB = 440, YC = 675, UA = 55, UC = 42;
const fmt = (v, d) => v.toFixed(d).replace('.', ',');
function traccia(ctx, n, xy, col, w, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= n; i++) { const q = xy(i / n); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
  ctx.stroke(); ctx.restore();
}
function asse(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(X0 + LW, y); ctx.stroke(); ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due diapason quasi uguali', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

function sceneGrafico(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, 100, 110, 1180, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  const f = f2(t), fr = Math.round(f), a0 = w0(t);
  const xw = u => X0 + u * LW;                                   // u da 0 a 1 nella finestra
  // la finestra di 10 ms: dove sta nel tempo
  txt(ctx, Math.round(a0 * 1000) + ' ms', X0, 168, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, Math.round(a0 * 1000 + 10) + ' ms', X0 + LW, 168, { size: 30, color: C.dim, align: 'right' });
  // riga A: i due diapason
  const kA1 = P(t, 8.3, 10.3, E.lin), kA2 = P(t, 13.0, 15.0, E.lin);
  asse(ctx, YA, P(t, 8.0, 8.4));
  drawRich(ctx, '{y:440 Hz}', 125, YA - 26, { size: 32, align: 'left', alpha: P(t, 8.3, 8.7) });
  drawRich(ctx, '{x:' + fr + ' Hz}', 125, YA + 26, { size: 32, align: 'left', alpha: P(t, 13.0, 13.4) });
  if (kA1 > 0) traccia(ctx, Math.round(400 * kA1), u => { const uu = u * kA1, s = a0 + uu * .01; return [xw(uu), YA - UA * p1(s)]; }, C.y, 4, 1);
  if (kA2 > 0) traccia(ctx, Math.round(400 * kA2), u => { const uu = u * kA2, s = a0 + uu * .01; return [xw(uu), YA - UA * p2(s, f)]; }, C.x, 4, 1);
  // riga B: la somma, punto per punto
  const kB = P(t, 17.3, 19.3, E.lin);
  asse(ctx, YB, P(t, 17.1, 17.5));
  drawRich(ctx, '{v:somma}', 125, YB, { size: 32, align: 'left', alpha: P(t, 17.2, 17.6) });
  if (kB > 0) traccia(ctx, Math.round(400 * kB), u => { const uu = u * kB, s = a0 + uu * .01; return [xw(uu), YB - UA * (p1(s) + p2(s, f))]; }, C.v, 5, 1);
  // le creste allineate (125,6 ms) e la cresta contro la gola (250,6 ms)
  [[21.8, 26.2, 55.25 / 440], [35.6, 40.0, 110.25 / 440]].forEach(([a, b, s]) => {
    const k = life(t, a, b, .3, .3), x = xw((s - a0) / .01);
    if (k > 0 && x > X0 && x < X0 + LW) dashed(ctx, [x, YA - UA - 14], [x, YB + 2 * UA + 4], C.g, 1, .8 * k);
  });
  // riga C: un secondo intero della somma
  const kC = P(t, 40.3, 41.8, E.lin);
  if (t > 40.1) {
    asse(ctx, YC, P(t, 40.1, 40.5));
    drawRich(ctx, '{v:somma}', 125, YC - 22, { size: 32, align: 'left', alpha: P(t, 40.2, 40.6) });
    drawRich(ctx, '{v:in 1 s}', 125, YC + 22, { size: 32, align: 'left', alpha: P(t, 40.2, 40.6) });
    ['0', '0,25', '0,5', '0,75', '1 s'].forEach((s, i) => txt(ctx, s, X0 + i * LW / 4, 782, { size: 30, color: C.dim, alpha: P(t, 40.2, 40.6) }));
    if (kC > 0) traccia(ctx, Math.round(6000 * kC), u => { const s = u * kC; return [X0 + s * LW, YC - UC * (p1(s) + p2(s, f))]; }, C.v, 1.6, 1);
    // dove sta la finestra di 10 ms
    ctx.save(); ctx.globalAlpha *= P(t, 40.4, 40.8) * (1 - P(t, 71.6, 72.2)); ctx.fillStyle = css(C.ink, .15);
    ctx.fillRect(X0 + a0 * LW - 1, YC - 2 * UC - 8, .01 * LW + 2, 4 * UC + 16); ctx.restore();
    // l'inviluppo
    const kI = P(t, 44.8, 45.6);
    if (kI > 0) {
      ctx.save(); ctx.setLineDash([10, 8]);
      traccia(ctx, 500, u => [X0 + u * LW, YC - UC * inv(u, f)], C.g, 3, kI);
      traccia(ctx, 500, u => [X0 + u * LW, YC + UC * inv(u, f)], C.g, 3, kI);
      ctx.restore();
    }
    // il cursore al rallentatore (un secondo in 8 s) e i massimi contati
    const kP = life(t, 49.4, 58.0, .3, .4);
    if (kP > 0) {
      const s = clamp((t - 49.5) / 8), x = X0 + s * LW;
      ctx.save(); ctx.globalAlpha *= kP; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, YC - 2 * UC - 10); ctx.lineTo(x, YC + 2 * UC + 10); ctx.stroke(); ctx.restore();
      dot(ctx, [x, YC - UC * inv(s, f)], C.g, kP, 9);
    }
    for (let k = 1; k <= 4; k++) {
      const sm = (k - .5) / 4, ta = 49.5 + 8 * sm, kk = P(t, ta, ta + .3, E.back) * (1 - P(t, 71.6, 72.0));
      if (kk > 0) txt(ctx, String(k), X0 + sm * LW, YC - 2 * UC - 24, { size: 36, weight: 600, color: C.g, alpha: kk });
    }
  }
  ctx.restore();
}

// ---------- il pannello ----------
const PX0 = 1360, PX1 = 1780, PCX = 1570;
function scenePannello(ctx, t) {
  if (t < 8.0 || t > T_FINE + .3) return;
  const al = life(t, 8.2, T_FINE + .1, .5, .5);
  card(ctx, 1320, 110, 500, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX0, y); ctx.lineTo(PX1, y); ctx.stroke(); ctx.restore(); };
  conFont(TITOLI, () => drawRich(ctx, 'due diapason', PCX, 160, { size: 36, weight: 600 }));
  const f = f2(t), fr = Math.round(f), db = fr - F1;
  drawRich(ctx, '{mink:f₁}', PX0, 225, { size: 38, align: 'left', alpha: P(t, 8.3, 8.7) });
  drawRich(ctx, '{y:440 Hz}', PX1, 225, { size: 38, align: 'right', alpha: P(t, 8.3, 8.7) });
  drawRich(ctx, '{mink:f₂}', PX0, 282, { size: 38, align: 'left', alpha: P(t, 12.6, 13.0) });
  drawRich(ctx, '{x:' + fr + ' Hz}', PX1, 282, { size: 38, align: 'right', alpha: P(t, 12.6, 13.0) });
  riga(325, P(t, 40.1, 40.5));
  const nota = (F1 + fr) / 2;
  drawRich(ctx, '{dim:nota}', PX0, 372, { size: 34, align: 'left', alpha: P(t, 40.2, 40.6) });
  drawRich(ctx, (nota % 1 ? fmt(nota, 1) : String(nota)) + ' Hz', PX1, 372, { size: 36, align: 'right', alpha: P(t, 40.2, 40.6) });
  const kB = P(t, 57.9, 58.3);
  drawRich(ctx, '{dim:battimenti al secondo}', PCX, 430, { size: 32, alpha: kB });
  drawRich(ctx, '{g:' + db + '}', PCX, 495, { size: 64, alpha: kB });
  riga(545, P(t, 62.5, 62.9));
  drawRich(ctx, fr + ' − 440 = ' + db, PCX, 595, { size: 40, alpha: P(t, 62.6, 63.0) });
  drawRich(ctx, '{dim:battimenti/s =} {mink:f₂ − f₁}', PCX, 660, { size: 36, local: t - 67.2 });
  drawRich(ctx, '{dim:al rallentatore: 1 s in 8 s}', PCX, 735, { size: 30, alpha: life(t, 49.4, 58.0, .3, .4) });
  drawRich(ctx, db === 0 ? '{g:accordato}' : '', PCX, 735, { size: 36, alpha: P(t, 87.0, 87.4) });
  ctx.restore();
}

// in una frase (90,3–100,7)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 99.2, 100.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due frequenze vicine fanno un suono che\nva e viene {mink:f₂ − f₁} volte al secondo.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{y:440 Hz} + {x:444 Hz}\n{dim:somma punto per punto}'], [960, '{g:4} battimenti al secondo\n{dim:444 − 440}'], [1430, 'per accordare:\n{dim:battimenti più lenti}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti: niente toni (un tono
  // che va e viene si confonderebbe con i battimenti), solo tracce, pop e ding
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.3, 10.3],                                          // il primo diapason, 440 Hz
    ['traccia', 13.0, 15.0], ['traccia', 17.3, 19.3],                                 // il secondo, 444 Hz; la somma
    ['pop', 21.9, .7], ['pop', 35.7, .2],                                             // creste insieme; cresta contro gola
    ['traccia', 40.3, 41.8], ['pop', 40.4, .45], ['traccia', 44.8, 45.6],             // un secondo intero, 442 Hz; l'inviluppo
    ['pop', 50.5, .5], ['pop', 52.5, .55], ['pop', 54.5, .6], ['pop', 56.5, .65],     // i massimi contati: 4
    ['pop', 62.7, .5], ['pop', 67.3, .55],                                            // 444 meno 440; la regola
    ['pop', 73.9, .45], ['pop', 82.3, .4], ['ding', 87.2],                            // 442, 441, 440 Hz: accordato
    ['soffio', 90.5], ['pop', 92.5, .5], ['pop', 93.0, .6], ['pop', 93.5, .7],        // in una frase
  ];
  return {
    titolo: 'Due diapason quasi uguali', durata: 100.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.0, 'la somma di due onde'], [40.0, 71.6, 'i battimenti'], [71.6, T_FINE, 'accordare']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneGrafico(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
