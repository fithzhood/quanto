'use strict';
/* Dieci volte lo stesso pendolo — dieci tempi col cronometro, tutti diversi: valore medio, semidispersione,
   e il risultato scritto (2,4 ± 0,1) s. Il pendolo oscilla col suo periodo vero, 2,40 s; i tempi misurati
   sono diversi perché la mano preme il pulsante un po' prima o un po' dopo. Argomento: incertezza. */
CVIDEO.registra('incertezza/misure-ripetute', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, dot, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [85.0, 190], [86.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [85.0, 1050], [86.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [85.0, 2.2], [86.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [85.0, 2], [86.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [85.0, -1.5], [86.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.1, 'sorpreso'], [23.3, 'neutro'],
  [28.2, 'pensa'], [33.1, 'neutro'], [45.1, 'felice'], [47.4, 'neutro'], [58.2, 'pensa'], [63.4, 'neutro'],
  [72.2, 'felice'], [74.4, 'neutro'], [76.6, 'festa'], [79.0, 'neutro'], [87.5, 'felice'], [90.6, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Dieci misure della stessa cosa:\ndieci numeri uguali?'],
  [7.9, 11.7, 'Il pendolo oscilla: misuro il tempo\ndi un’oscillazione completa.'],
  [11.9, 16.15, 'Avvio il cronometro all’estremo,\nlo fermo quando ci ritorna…'],
  [16.3, 18.4, '…{g:2,41 s}.'],
  [18.6, 20.9, 'Rifaccio la misura…'],
  [21.1, 24.1, '…{g:2,35 s}. Un numero diverso!'],
  [24.3, 28.05, 'Altre otto volte: dieci tempi,\ntutti un po’ diversi.'],
  [28.2, 32.95, 'Colpa della mano: premo il pulsante\nun po’ prima o un po’ dopo.'],
  [33.1, 37.1, 'Errori {v:casuali}: a volte\nin più, a volte in meno.'],
  [37.4, 41.4, 'Il valore più attendibile\nè il {g:valore medio}.'],
  [41.6, 44.9, 'Sommo le dieci misure:\n{g:24,04 s}.'],
  [45.1, 50.1, 'Divido per il numero di misure:\n24,04 s / 10 = {g:2,404 s}.'],
  [50.2, 53.6, 'Metto le dieci misure\nsu una retta.'],
  [53.8, 58.0, 'La più piccola è {x:2,30 s},\nla più grande {y:2,50 s}.'],
  [58.2, 63.2, 'Semidispersione: (massima − minima) / 2\n= 0,20 s / 2 = {g:0,10 s}.'],
  [63.4, 67.6, 'È l’{v:errore assoluto} della misura:\nl’errore massimo.'],
  [68.0, 72.0, 'L’errore si arrotonda a\n{v:una cifra significativa}: {g:0,1 s}.'],
  [72.2, 76.4, 'Il valore medio, alla stessa\ncifra decimale: 2,404 → {g:2,4 s}.'],
  [76.6, 80.2, 'Il risultato si scrive\n{g:(2,4 ± 0,1) s}.'],
  [80.3, 84.85, 'Il valore vero sta, quasi certamente,\nfra {g:2,3 s} e {g:2,5 s}.'],
  [87.5, 92.8, 'Tante misure: il valore medio,\npiù o meno la semidispersione.'],
];

// ---------- i dati ----------
const TEMPI = [2.41, 2.35, 2.50, 2.44, 2.38, 2.30, 2.46, 2.40, 2.43, 2.37];   // somma 24,04 s; media 2,404 s
const SOMMA = 24.04, MEDIA = 2.404, MIN = 2.30, MAX = 2.50;                    // semidispersione (2,50 − 2,30)/2 = 0,10 s
const T_PEND = 2.4, TH0 = .2, T_EST = 9.0;          // periodo vero 2,40 s, ampiezza 0,2 rad; a 9,0 s è all'estremo destro
// le prime due misure si vedono dal vivo: si parte con il pendolo all'estremo, si ferma quando la mano preme
const MISURE_VIVE = [[13.8, TEMPI[0]], [18.6, TEMPI[1]]];
// quando compare ogni riga della tabella
const T_RIGA = TEMPI.map((v, i) => i === 0 ? 13.8 + v + .1 : i === 1 ? 18.6 + v + .1 : 24.5 + (i - 2) * .35);
function cronometro(t) {   // [secondi mostrati, sta correndo?]
  for (const [a, v] of MISURE_VIVE) if (t >= a && t < a + v) return [t - a, true];
  let ultimo = 0;
  TEMPI.forEach((v, i) => { if (t >= T_RIGA[i] - .1) ultimo = v; });
  return [ultimo, false];
}

// ---------- 1 · il pendolo e il cronometro (7.5–50) ----------
const PX = 692, PY = 150, LP = 420;
function scenaPendolo(ctx, t) {
  if (t < 7.3 || t > 50.6) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 49.8, 50.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 640, 680);
  // il moto vero, per piccole oscillazioni: θ = θ₀·cos(2π·t/T)
  const th = TH0 * Math.cos(2 * Math.PI * (t - T_EST) / T_PEND);
  const bx = PX + LP * Math.sin(th), by = PY + LP * Math.cos(th);
  ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
  ctx.beginPath(); ctx.arc(PX, PY, LP, Math.PI / 2 - TH0, Math.PI / 2 + TH0); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = css(C.ink, .8); ctx.fillRect(PX - 70, PY - 14, 140, 10);
  ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PX, PY - 4); ctx.lineTo(bx, by); ctx.stroke();
  dot(ctx, [bx, by], C.y, 1, 26);
  // il cronometro
  const [s, corre] = cronometro(t);
  ctx.fillStyle = css(C.dim, .12); ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(PX - 170, 650, 340, 100, 20); ctx.fill(); ctx.stroke();
  fixedNum(ctx, fmtN(s, 2), PX + 50, 700, 60, C.ink);
  txt(ctx, 's', PX + 62, 700, { size: 60, align: 'left' });
  ctx.fillStyle = css(corre ? C.g : C.dim, corre ? 1 : .4); ctx.beginPath(); ctx.arc(PX - 135, 700, 11, 0, Math.PI * 2); ctx.fill();
  txt(ctx, 'cronometro', PX, 625, { size: 30, color: C.dim });
  ctx.restore();
}

// ---------- la tabella delle misure e i conti (7.5–85) ----------
function scenaTabella(ctx, t) {
  if (t < 7.3 || t > 85.4) return;
  const al = P(t, 7.7, 8.4) * (1 - P(t, 84.6, 85.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1040, 110, 800, 680);
  conFont(TITOLI, () => drawRich(ctx, 'dieci misure del tempo', 1440, 162, { size: 38, weight: 600 }));
  TEMPI.forEach((v, i) => {
    const k = P(t, T_RIGA[i], T_RIGA[i] + .35, E.out);
    if (k <= 0) return;
    const x = i < 5 ? 1240 : 1640, y = 226 + (i % 5) * 52;
    // la minima e la massima, colorate quando Stilla le nomina
    const col = v === MIN ? C.x : v === MAX ? C.y : C.ink, kc = P(t, 54.0, 54.4);
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 12);
    txt(ctx, (i + 1) + '.', x - 110, y, { size: 32, color: C.dim, align: 'right' });
    txt(ctx, fmtN(v, 2) + ' s', x - 80, y, { size: 40, align: 'left', color: kc > .5 ? col : C.ink, weight: kc > .5 && col !== C.ink ? 600 : 500 });
    ctx.restore();
  });
  ctx.save(); ctx.globalAlpha *= P(t, 41.6, 42.0); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1080, 470); ctx.lineTo(1800, 470); ctx.stroke(); ctx.restore();
  drawRich(ctx, 'somma = {g:24,04 s}', 1440, 514, { size: 38, alpha: P(t, 41.8, 42.3), local: t - 41.8 });
  drawRich(ctx, 'valore medio = 24,04 s / 10', 1440, 568, { size: 38, alpha: P(t, 45.2, 45.7), local: t - 45.2 });
  drawRich(ctx, '= {g:2,404 s}', 1560, 620, { size: 36, align: 'right', alpha: P(t, 46.6, 47.1) });
  drawRich(ctx, '→ {g:2,4 s}', 1580, 620, { size: 36, align: 'left', alpha: P(t, 73.6, 74.1) });
  drawRich(ctx, 'semidispersione = {g:0,10 s}', 1560, 676, { size: 36, align: 'right', alpha: P(t, 61.2, 61.7) });
  drawRich(ctx, '→ {g:0,1 s}', 1580, 676, { size: 36, align: 'left', alpha: P(t, 69.6, 70.1) });
  const kr = P(t, 77.6, 78.2, E.back);
  if (kr > 0) {
    ctx.save(); ctx.translate(1440, 740); ctx.scale(kr, kr);
    ctx.fillStyle = css(C.g, .12); ctx.beginPath(); ctx.roundRect(-210, -36, 420, 72, 16); ctx.fill();
    drawRich(ctx, '{g:(2,4 ± 0,1) s}', 0, 0, { size: 52, weight: 600 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3–4 · le misure su una retta (50–85) ----------
const XV = v => 420 + (v - 2.25) / .30 * 544, YL = 430;
function graffa(ctx, xa, xb, y, verso, col) {   // parentesi orizzontale, aperta verso l'alto (verso −1) o il basso (+1)
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xa, y - 12 * verso); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y - 12 * verso); ctx.stroke();
  ctx.restore();
}
function scenaRetta(ctx, t) {
  if (t < 49.8 || t > 85.4) return;
  const al = P(t, 50.0, 50.6) * (1 - P(t, 84.6, 85.2));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 640, 680);
  conFont(TITOLI, () => drawRich(ctx, 'le misure, in secondi', 692, 162, { size: 38, weight: 600 }));
  // la fascia del risultato: da 2,3 s a 2,5 s
  const kb = P(t, 80.6, 81.2);
  if (kb > 0) { ctx.fillStyle = css(C.g, .16 * kb); ctx.fillRect(XV(2.3), YL - 40, XV(2.5) - XV(2.3), 80); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(400, YL); ctx.lineTo(984, YL); ctx.stroke();
  for (let i = 0; i <= 6; i++) {
    const v = 2.25 + i * .05, x = XV(v);
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, YL - 8); ctx.lineTo(x, YL + 8); ctx.stroke();
    txt(ctx, fmtN(v, 2), x, YL + 40, { size: 30, color: C.dim });
  }
  // il valore medio
  const km = P(t, 50.9, 51.4);
  if (km > 0) {
    dashed(ctx, [XV(MEDIA), YL], [XV(MEDIA), 230], C.g, 1, km);
    drawRich(ctx, '{g:valore medio 2,404 s}', XV(MEDIA), 212, { size: 32, alpha: km });
  }
  // i dieci punti, uno alla volta
  TEMPI.forEach((v, i) => {
    const k = P(t, 51.0 + i * .2, 51.3 + i * .2, E.back);
    const col = v === MIN ? C.x : v === MAX ? C.y : C.v;
    dot(ctx, [XV(v), YL], P(t, 54.0, 54.4) > .5 ? col : C.v, k, 8);
  });
  const kmm = P(t, 54.0, 54.5);
  if (kmm > 0) {
    drawRich(ctx, '{x:2,30 s}', XV(MIN), YL - 52, { size: 32, alpha: kmm });
    drawRich(ctx, '{y:2,50 s}', XV(MAX), YL - 52, { size: 32, alpha: kmm });
  }
  // massima − minima, e la sua metà
  const k1 = P(t, 59.2, 59.8);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    graffa(ctx, XV(MIN), XV(MAX), 320, -1, C.ink);
    txt(ctx, '0,20 s', XV(2.46), 290, { size: 32 });
    ctx.restore();
  }
  const k2 = P(t, 61.2, 61.8);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    graffa(ctx, XV(MIN), XV(2.40), 530, 1, C.g); graffa(ctx, XV(2.40), XV(MAX), 530, 1, C.g);
    txt(ctx, '0,10 s', (XV(MIN) + XV(2.40)) / 2, 566, { size: 32, color: C.g });
    txt(ctx, '0,10 s', (XV(2.40) + XV(MAX)) / 2, 566, { size: 32, color: C.g });
    ctx.restore();
  }
  const ke = P(t, 63.6, 64.1);
  drawRich(ctx, '{v:errore assoluto} = semidispersione', 692, 650, { size: 34, alpha: ke, local: t - 63.6 });
  drawRich(ctx, '{dim:(l’errore massimo)}', 692, 700, { size: 30, alpha: ke });
  ctx.restore();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Dieci volte lo stesso pendolo', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
// 5 · in una frase (85.0–95.8)
function scenaFine(ctx, t) {
  if (t < 85.1) return;
  const al = 1 - P(t, 93.3, 94.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.3 });
    drawRich(ctx, 'Una misura si scrive\n{g:valore medio ± errore}, con l’unità.', W / 2, 290, { size: 66, weight: 600, local: t - 85.7, stagger: .08 });
  });
  const pills = [[490, 'valore medio:\nsomma / numero di misure'], [960, 'semidispersione:\n(massima − minima) / 2'], [1430, 'tempo del pendolo:\n{g:(2,4 ± 0,1) s}']];
  pills.forEach(([x, s], i) => {
    const a = 87.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della pallina del pendolo (alta agli estremi);
  // sulla retta ogni punto suona all'altezza del suo tempo, da 2,25 s (0) a 2,55 s (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5],                                                                  // il pendolo, il cronometro, la tabella
    ['tono', 13.8, 16.21, [.7, .5, .3, .5, .7, .5, .3, .5, .7]], ['pop', 16.31, .55], // la prima oscillazione: 2,41 s
    ['tono', 18.6, 20.95, [.7, .5, .3, .5, .7, .5, .3, .5, .7]], ['pop', 21.05, .35], // la seconda: 2,35 s
    ['tono', 24.5, 27.3, [.2, .9]],                                                   // altre otto misure in tabella
    ['pop', 41.8, .5], ['pop', 45.2, .45], ['ding', 46.6],                            // la somma, il valore medio: 2,404 s
    ['soffio', 50.0], ['pop', 50.9, .5],                                              // la retta, il valore medio
    ['pop', 51.0, .53], ['pop', 51.2, .33], ['pop', 51.4, .83], ['pop', 51.6, .63], ['pop', 51.8, .43],   // i dieci tempi sulla retta
    ['pop', 52.0, .17], ['pop', 52.2, .7], ['pop', 52.4, .5], ['pop', 52.6, .6], ['pop', 52.8, .4],
    ['pop', 54.0, .5],                                                                // la minima e la massima
    ['pop', 59.2, .5], ['pop', 61.2, .45], ['ding', 61.4],                            // 0,20 s, la metà: 0,10 s
    ['pop', 63.6, .5],                                                                // è l'errore assoluto
    ['pop', 69.6, .5], ['pop', 73.6, .55], ['pop', 77.6, .7],                         // 0,1 s; 2,4 s; (2,4 ± 0,1) s
    ['pop', 80.6, .5],                                                                // la fascia da 2,3 a 2,5 s
    ['soffio', 85.3], ['pop', 87.3, .5], ['pop', 87.8, .6], ['pop', 88.3, .7],        // in una frase
  ];
  return {
    titolo: 'Dieci volte lo stesso pendolo', durata: 95.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 37.2, 'dieci misure'], [37.2, 50.0, 'il valore medio'], [50.0, 67.8, 'la semidispersione'], [67.8, 84.8, 'il risultato']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPendolo(ctx, t); scenaRetta(ctx, t); scenaTabella(ctx, t); scenaFine(ctx, t); },
  };
});
