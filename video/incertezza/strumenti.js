'use strict';
/* La bilancia che segna già 200 grammi — conoscere lo strumento prima di misurare: portata (5 kg), sensibilità (1 g),
   prontezza (il numero si assesta in circa un secondo), e lo zero sbagliato, un errore sistematico che ripetere
   non scopre; si corregge con la tara. Il display segue sempre la stessa risposta dello strumento:
   lettura = massa · (1 − (1 + u/τ)·e^(−u/τ)), u = tempo dall'appoggio, τ = 0,12 s. Argomento: incertezza. */
CVIDEO.registra('incertezza/strumenti', M => {
  const { W, C, E, P, life, clamp, css, TITOLI, conFont, drawRich, txt, fixedNum, card, dot, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [85.1, 190], [86.4, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [85.1, 1050], [86.4, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [85.1, 2.2], [86.4, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [85.1, 2], [86.4, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [85.1, -1.5], [86.4, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.5, 'sorpreso'], [14.8, 'neutro'],
  [43.3, 'felice'], [45.5, 'neutro'], [57.0, 'sorpreso'], [59.2, 'neutro'], [69.1, 'pensa'], [73.6, 'neutro'],
  [77.4, 'felice'], [79.7, 'neutro'], [82.0, 'festa'], [87.5, 'felice'], [90.5, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.7, 'Di uno strumento, che cosa\nbisogna sapere prima di usarlo?'],
  [7.9, 12.3, 'Una bilancia da cucina:\nc’è scritto «max 5 kg».'],
  [12.5, 17.0, 'Ci metto un’anguria da 6 kg:\nil display segna {r:errore}.'],
  [17.2, 22.0, 'Il valore più grande che misura\nè la sua {v:portata}: 5 kg.'],
  [22.4, 25.8, 'Ora un pacco di farina:\n{g:500 g}.'],
  [26.0, 32.2, 'Aggiungo un chicco di riso, circa\n0,02 g: segna ancora 500.'],
  [32.4, 38.4, 'Aggiungo una moneta da 1 centesimo,\n2,30 g: segna {g:502}.'],
  [38.6, 43.1, 'La variazione più piccola che legge\nè la {v:sensibilità}: 1 g.'],
  [43.3, 48.0, 'Per questo la misura si scrive\n{g:(502 ± 1) g}.'],
  [48.4, 52.3, 'Tolgo tutto e rimetto la farina:\nil numero sale…'],
  [52.5, 56.6, '…e si ferma dopo circa un secondo:\nè la {v:prontezza}.'],
  [57.0, 61.1, 'Ora la bilancia è vuota,\nma segna già {r:200 g}!'],
  [61.3, 64.7, 'Ci metto la farina:\nsegna {r:700 g}.'],
  [64.9, 68.9, 'La rifaccio tre volte:\n700, 700, 700.'],
  [69.1, 73.4, 'Ripetere {r:non aiuta}: ogni misura\nha 200 g di troppo.'],
  [73.6, 77.2, 'È un errore {v:sistematico}: sempre\nnello stesso verso.'],
  [77.4, 81.8, 'Lo zero si sistema col tasto {g:tara}:\nora segna 0 g…'],
  [82.0, 84.9, '…e la farina, {g:500 g}.'],
  [87.5, 91.8, 'Portata, sensibilità, prontezza\ne zero: si controllano prima.'],
];

// ---------- lo strumento ----------
const TAU = .12, PORTATA = 5000;
const risposta = u => u <= 0 ? 0 : 1 - (1 + u / TAU) * Math.exp(-u / TAU);   // da 0 a 1: a 1,1 s manca meno di un millesimo
// [quando, grammi, subito?]: ciò che si appoggia o si toglie; «subito» = il cambio di scena, senza transitorio
const EVENTI = [[13.0, 6000], [20.6, -6000], [22.6, 500], [27.0, .02], [33.4, 2.30], [48.6, -502.32], [50.3, 500],
  [56.9, -500, true], [61.6, 500], [65.0, -500], [65.5, 500], [66.8, -500], [67.3, 500], [77.6, -500], [82.2, 500]];
const T_ZERO = 56.9, T_TARA = 78.9;                     // da qui lo zero è spostato di 200 g; qui si preme la tara
function lettura(t) {
  let v = 0;
  for (const [a, g, subito] of EVENTI) if (t >= a) v += g * (subito ? 1 : risposta(t - a));
  if (t >= T_ZERO && t < T_TARA) v += 200;
  return v;
}
const display = t => { const v = lettura(t); return v > PORTATA ? 'Err' : String(Math.max(0, Math.round(v))); };
// chi sta sul piatto: [appoggio, rimozione]
const FARINA = [[22.6, 48.6], [50.3, 56.9], [61.6, 65.0], [65.5, 66.8], [67.3, 77.6], [82.2, 999]];
const presenza = (t, a, b, taglio) => {   // 0 → 1 mentre scende sul piatto, 1 → 0 mentre si alza
  if (t < a - .4 || t > b + .4) return [0, 0];
  if (t < a) return [P(t, a - .4, a), 1 - P(t, a - .4, a, E.out)];
  if (t <= b) return [1, 0];
  return taglio ? [0, 0] : [1 - P(t, b, b + .4), P(t, b, b + .4, E.in)];
};

// ---------- 0 · titolo (0–7.5) ----------
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'La bilancia che segna\ngià 200 grammi', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
// ---------- la bilancia (7.5–90.2) ----------
const XS = 736, YPI = 532;                              // centro della bilancia, piano del piatto
function scenaBilancia(ctx, t) {
  if (t < 7.4 || t > 85.6) return;
  // a 56,9 s c'è un taglio di scena: la bilancia si spegne e si riaccende vuota, con lo zero spostato
  const al = P(t, 7.6, 8.2) * (1 - P(t, 84.9, 85.5)) * (1 - .85 * life(t, 56.5, 57.3, .4, .4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 728, 680);
  // il corpo, il piatto, il display
  ctx.fillStyle = css(C.dim, .18); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(456, 560, 560, 150, 24); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.dim, .7); ctx.fillRect(700, YPI + 20, 72, 10);
  ctx.fillStyle = css(C.dim, .55); ctx.beginPath(); ctx.roundRect(446, YPI, 580, 22, 10); ctx.fill();
  ctx.fillStyle = css(C.x, .10); ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(612, 590, 244, 92, 12); ctx.fill(); ctx.stroke();
  txt(ctx, 'max 5 kg', 534, 636, { size: 30, weight: 600, color: C.dim });
  const kt = life(t, T_TARA - .2, T_TARA + .6, .15, .4);
  ctx.fillStyle = css(kt > 0 ? C.g : C.dim, kt > 0 ? .4 + .5 * kt : .45);
  ctx.beginPath(); ctx.arc(936, 616, 22, 0, Math.PI * 2); ctx.fill();
  txt(ctx, 'tara', 936, 670, { size: 30, color: C.dim });
  // il numero
  const d = display(t), rosso = d === 'Err' || (t >= T_ZERO && t < T_TARA);
  if (d === 'Err') txt(ctx, 'Err', 734, 636, { size: 62, weight: 600, color: C.r });
  else { fixedNum(ctx, d, 800, 636, 62, rosso ? C.r : C.ink); txt(ctx, 'g', 812, 640, { size: 40, align: 'left', color: rosso ? C.r : C.ink }); }
  // la sensibilità: l'ultima cifra
  const ku = life(t, 38.8, 43.1, .3, .3);
  if (ku > 0) { ctx.strokeStyle = css(C.v, ku); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.roundRect(757, 600, 48, 72, 8); ctx.stroke(); }
  // l'anguria
  const [aa, ya] = presenza(t, 13.0, 20.6);
  if (aa > 0) {
    ctx.save(); ctx.globalAlpha *= aa; ctx.translate(0, -80 * ya);
    ctx.fillStyle = css(C.g, .75); ctx.beginPath(); ctx.ellipse(XS, YPI - 92, 150, 92, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = css(C.g, 1); ctx.lineWidth = 6;
    for (const k of [-.6, -.2, .2, .6]) { ctx.beginPath(); ctx.ellipse(XS, YPI - 92, 150 * Math.abs(k) + 8, 90, 0, k < 0 ? Math.PI / 2 : -Math.PI / 2, k < 0 ? Math.PI * 1.5 : Math.PI / 2); ctx.stroke(); }
    txt(ctx, 'anguria da 6 kg', XS, YPI - 214, { size: 34, weight: 600 });
    ctx.restore();
  }
  // la farina
  for (const [a, b] of FARINA) {
    const [af, yf] = presenza(t, a, b, b === 56.9);
    if (af <= 0) continue;
    ctx.save(); ctx.globalAlpha *= af; ctx.translate(0, -80 * yf);
    ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(651, YPI); ctx.lineTo(651, YPI - 190); ctx.lineTo(666, YPI - 212); ctx.lineTo(806, YPI - 212); ctx.lineTo(821, YPI - 190); ctx.lineTo(821, YPI); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(651, YPI - 190); ctx.lineTo(821, YPI - 190); ctx.stroke();
    txt(ctx, 'farina', XS, YPI - 128, { size: 32, color: C.dim });
    txt(ctx, '500 g', XS, YPI - 80, { size: 38, weight: 600 });
    ctx.restore();
  }
  // il chicco di riso e la moneta
  const [ar, yr] = presenza(t, 27.0, 48.6);
  if (ar > 0) {
    ctx.save(); ctx.globalAlpha *= ar; ctx.translate(0, -80 * yr);
    ctx.fillStyle = css(C.ink, .3); ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(866, YPI - 5, 10, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    txt(ctx, 'riso ≈ 0,02 g', 852, YPI - 40, { size: 30, align: 'left' });
    ctx.restore();
  }
  const [am, ym] = presenza(t, 33.4, 48.6);
  if (am > 0) {
    ctx.save(); ctx.globalAlpha *= am; ctx.translate(0, -80 * ym);
    ctx.fillStyle = css(C.y, .85); ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(966, YPI - 6, 19, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    txt(ctx, 'moneta 2,30 g', 852, YPI - 84, { size: 30, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}
// ---------- la scheda delle caratteristiche (7.5–90.2) ----------
const PROP = [['portata', '5 kg', 17.4, C => C.ink], ['sensibilità', '1 g', 38.8, C => C.ink], ['prontezza', '≈ 1 s', 52.8, C => C.ink], ['zero', 'tasto tara', 79.1, C => C.g]];
function scenaScheda(ctx, t) {
  if (t < 7.4 || t > 85.6) return;
  const al = P(t, 7.8, 8.4) * (1 - P(t, 84.9, 85.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1130, 110, 710, 680);
  PROP.forEach(([n, v, a, col], i) => {
    const k = P(t, a, a + .5, E.out), y = 180 + 66 * i;
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 14);
    txt(ctx, n, 1170, y, { size: 36, weight: 600, color: C.v, align: 'left' });
    txt(ctx, v, 1440, y, { size: 36, weight: 600, color: col(C), align: 'left' });
    ctx.restore();
  });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.save(); ctx.globalAlpha *= P(t, 17.4, 17.9);
  ctx.beginPath(); ctx.moveTo(1160, 450); ctx.lineTo(1810, 450); ctx.stroke(); ctx.restore();
  // la misura scritta con la sensibilità
  const km = life(t, 43.5, 48.3, .5, .4);
  if (km > 0) {
    drawRich(ctx, '{g:(502 ± 1) g}', 1485, 590, { size: 64, weight: 600, alpha: km, local: t - 43.5 });
    drawRich(ctx, '{dim:valore letto ± sensibilità}', 1485, 668, { size: 30, alpha: km });
  }
  // la prontezza: il numero sul display, istante per istante, dopo l'appoggio a 50,3 s
  const kp = life(t, 49.9, 56.9, .4, .4);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp;
    const x0 = 1232, y0 = 735, sx = 270, sy = .42;      // 270 px al secondo, 0,42 px al grammo
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x0, y0 - 230); ctx.lineTo(x0, y0); ctx.lineTo(x0 + 2.1 * sx, y0); ctx.stroke();
    for (let s = 0; s <= 2; s++) { txt(ctx, String(s), x0 + s * sx, y0 + 28, { size: 30, color: C.dim }); }
    txt(ctx, 's', x0 + 2.1 * sx + 16, y0, { size: 30, color: C.dim, align: 'left' });
    txt(ctx, '500 g', x0 - 12, y0 - 500 * sy, { size: 30, color: C.dim, align: 'right' });
    dashed(ctx, [x0, y0 - 500 * sy], [x0 + 2.05 * sx, y0 - 500 * sy], C.dim, 1, .6);
    const u = clamp(t - 50.3, 0, 2.05), pts = [];
    for (let i = 0; i <= 80; i++) { const uu = u * i / 80; pts.push([x0 + uu * sx, y0 - 500 * risposta(uu) * sy]); }
    ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    if (u > 0) dot(ctx, pts[pts.length - 1], C.y, 1, 8);
    const kf = P(t, 52.7, 53.2);
    if (kf > 0) { dashed(ctx, [x0 + 1.2 * sx, y0], [x0 + 1.2 * sx, y0 - 500 * sy - 10], C.v, 1, kf); drawRich(ctx, '{v:fermo}', x0 + 1.2 * sx + 14, y0 - 90, { size: 30, align: 'left', alpha: kf }); }
    txt(ctx, 'il numero sul display', 1485, 488, { size: 30, color: C.dim });
    ctx.restore();
  }
  // lo zero sbagliato: le misure
  const kz = life(t, 57.2, 77.6, .4, .4);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz;
    const righe = [[57.4, 'vuota', '200 g', null], [62.8, '1ª misura', '700 g', 69.4], [66.6, '2ª misura', '700 g', 69.6], [68.4, '3ª misura', '700 g', 69.8]];
    righe.forEach(([a, n, v, tp], i) => {
      const k = P(t, a, a + .4), y = 500 + 56 * i;
      txt(ctx, n, 1200, y, { size: 32, color: C.dim, align: 'left', alpha: k });
      txt(ctx, v, 1420, y, { size: 36, weight: 600, color: C.r, align: 'left', alpha: k });
      if (tp) txt(ctx, '= 500 g + 200 g', 1560, y, { size: 30, align: 'left', alpha: P(t, tp, tp + .4) });
    });
    drawRich(ctx, '{v:errore sistematico}: sempre + 200 g', 1485, 742, { size: 32, alpha: P(t, 73.8, 74.3), local: t - 73.8 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- in una frase (85.1–94.6) ----------
function scenaFine(ctx, t) {
  if (t < 85.2) return;
  const al = 1 - P(t, 92.3, 93.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.4 });
    drawRich(ctx, 'Prima di misurare, si conosce\nlo {v:strumento}: e si controlla lo zero.', W / 2, 290, { size: 66, weight: 600, local: t - 85.8, stagger: .08 });
  });
  const pills = [[490, '{v:portata}: 5 kg\n{v:sensibilità}: 1 g'], [960, '{v:prontezza}:\ncirca un secondo'], [1430, 'zero sbagliato:\nerrore {v:sistematico}']];
  pills.forEach(([x, s], i) => {
    const a = 87.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue il numero sul display, da 0 (0) a 1000 g (1); per
  // l'anguria, da 0 a 6000 g; i numeri salgono e scendono con risposta(u)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // la bilancia e la scheda
    ['tono', 13.0, 13.3, [0, .4, .8]], ['pop', 13.3, .9],                             // l'anguria da 6 kg: Err
    ['pop', 17.4, .5], ['tono', 20.6, 21.3, [.83, .55, .27, .12, .05, .02]],          // la portata; via l'anguria
    ['tono', 22.6, 23.3, [0, .17, .34, .43, .48, .49]],                               // la farina: 500 g
    ['pop', 27.0, .6], ['pop', 33.4, .55],                                            // il chicco di riso, la moneta
    ['pop', 38.8, .5], ['ding', 43.5],                                                // la sensibilità; (502 ± 1) g
    ['tono', 48.6, 49.3, [.5, .33, .16, .07, .02, .01]],                              // tolgo tutto
    ['traccia', 50.3, 52.35], ['tono', 50.3, 51.4, [0, .19, .37, .45, .49, .5, .5, .5]], ['pop', 52.7, .5],   // la prontezza: sale e si ferma
    ['soffio', 56.9], ['pop', 57.4, .3],                                              // la bilancia vuota segna 200 g
    ['tono', 61.6, 62.3, [.2, .37, .54, .63, .68, .69]], ['pop', 62.8, .7],           // la farina: 700 g
    ['pop', 66.6, .7], ['pop', 68.4, .7],                                             // seconda e terza misura: 700, 700
    ['pop', 73.8, .4],                                                                // errore sistematico
    ['tono', 77.6, 78.3, [.7, .53, .36, .27, .22, .21]], ['pop', 78.9, .6],           // via la farina, il tasto tara
    ['tono', 82.2, 82.9, [0, .17, .34, .43, .48, .49]],                               // la farina: 500 g giusti
    ['soffio', 85.4], ['pop', 87.3, .5], ['pop', 87.8, .6], ['pop', 88.3, .7],        // in una frase
  ];
  return {
    titolo: 'La bilancia che segna già 200 grammi', durata: 94.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.2, 'la portata'], [22.2, 48.2, 'la sensibilità'], [48.2, 56.8, 'la prontezza'], [56.8, 84.9, 'lo zero sbagliato']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBilancia(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
