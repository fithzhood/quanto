'use strict';
/* Misurare è confrontare — si sceglie un campione e si conta quante volte ci sta nella grandezza; le sette grandezze
   di base del SI, e le derivate (m/s, m², N) che nascono da quelle. Argomento: misure. */
CVIDEO.registra('misure/misurare', M => {
  const { W, C, E, P, life, kf, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [88.8, 190], [90.1, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [88.8, 1050], [90.1, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [88.8, 2.2], [90.1, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [88.8, 2], [90.1, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [88.8, -1.5], [90.1, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.8, 'felice'], [21.1, 'neutro'],
  [23.8, 'sorpreso'], [27.8, 'pensa'], [31.6, 'neutro'], [36.1, 'festa'], [39.0, 'neutro'], [61.8, 'felice'],
  [64.4, 'neutro'], [84.8, 'felice'], [88.8, 'neutro'], [91.3, 'felice'], [94.6, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.3, 'Che cosa vuol dire\n{v:misurare} una lunghezza?'],
  [7.9, 11.8, 'Per misurare scelgo un {v:campione}:\nper esempio questa matita.'],
  [12.0, 16.6, 'La metto in fila sul tavolo\ne conto quante volte ci sta.'],
  [16.8, 20.9, 'Ci sta {g:10 volte}: il tavolo\nè lungo 10 matite.'],
  [21.1, 23.6, 'Una matita più corta…'],
  [23.8, 27.6, '…ci sta {g:16 volte}:\nil numero cambia.'],
  [27.8, 31.4, 'Stesso tavolo, numeri diversi:\ndipende dal {v:campione}.'],
  [31.6, 35.9, 'Per capirsi serve un campione\nuguale per tutti: il {g:metro}.'],
  [36.1, 40.1, 'Il tavolo è lungo {g:2 m}:\nun numero e un’unità.'],
  [40.1, 44.6, 'Misurare è {v:confrontare} con l’unità\ne dire quante volte ci sta.'],
  [44.6, 49.0, 'Nel Sistema Internazionale (SI)\nle grandezze {v:di base} sono sette.'],
  [49.2, 53.6, 'Lunghezza, massa e tempo:\nmetro, chilogrammo e secondo.'],
  [53.8, 57.6, 'Poi l’intensità di corrente\ne la temperatura…'],
  [57.8, 61.6, '…la quantità di sostanza\ne l’intensità luminosa.'],
  [61.8, 66.3, 'Ogni unità ha un simbolo:\nm, kg, s, A, K, mol, cd.'],
  [66.6, 70.6, 'Tutte le altre grandezze\n{v:nascono} da queste sette.'],
  [70.8, 75.6, 'La velocità è una lunghezza\ndivisa per un tempo: {x:m/s}.'],
  [75.8, 79.6, 'Un’area: lunghezza per\nlunghezza, in {x:m²}.'],
  [79.8, 84.6, 'L’unità della forza, il newton (N),\nè {x:kg·m/s²}.'],
  [84.8, 88.4, 'Sono unità {v:derivate}:\nnate da quelle di base.'],
  [91.3, 96.5, 'Una misura è un numero e un’unità:\nquante volte ci sta il campione.'],
];

// ---------- aiutanti ----------
const X0 = 520, PXM = 600;                         // il tavolo comincia in x 520; 600 px per metro: 2 m = 1200 px
const L_LUNGA = .20 * PXM, L_CORTA = .125 * PXM;   // matita nuova 20 cm (10 nel tavolo), consumata 12,5 cm (16)
function matita(ctx, x, y, L, al = 1) {
  if (al <= 0) return;
  const h = 18, g = L * .07, p = L * .17;          // gomma e punta
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.r, .7); ctx.beginPath(); ctx.roundRect(x + 1, y - h / 2, g + 4, h, 4); ctx.fill();
  ctx.fillStyle = css(C.y); ctx.fillRect(x + g, y - h / 2, L - g - p, h);
  ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + g, y); ctx.lineTo(x + L - p, y); ctx.stroke();
  ctx.fillStyle = css(C.y, .35); ctx.beginPath(); ctx.moveTo(x + L - p, y - h / 2); ctx.lineTo(x + L - 1, y); ctx.lineTo(x + L - p, y + h / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(x + L - p * .35, y - h * .18); ctx.lineTo(x + L - 1, y); ctx.lineTo(x + L - p * .35, y + h * .18); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// il metro campione: un'asta con le tacche dei decimetri
function metro(ctx, x, y, L, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.v, .16); ctx.strokeStyle = css(C.v); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.rect(x + 1, y - 12, L - 2, 24); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 1; i < 10; i++) { const xx = x + L * i / 10; ctx.beginPath(); ctx.moveTo(xx, y - 12); ctx.lineTo(xx, y - (i === 5 ? 0 : 5)); ctx.stroke(); }
  ctx.restore();
}
// una fila di copie del campione, una dopo l'altra dall'inizio del tavolo; restituisce quante ne sono già posate
function fila(ctx, t, t0, dt, n, L, y, disegna) {
  let quante = 0;
  for (let i = 0; i < n; i++) {
    const k = P(t, t0 + i * dt, t0 + i * dt + .25, E.out);
    if (k <= 0) break;
    disegna(ctx, X0 + i * L, y - (1 - k) * 26, L, k);
    if (k > .5) quante++;
  }
  return quante;
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Misurare è confrontare', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · il campione (7.5–44.4)
const R_LUNGA = 290, R_CORTA = 250, R_METRO = 208;   // le tre file sopra il tavolo
function scenaTavolo(ctx, t) {
  if (t < 7.5 || t > 45.0) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 44.3, 44.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 120, 1468, 420);
  // il tavolo, visto di fianco
  ctx.fillStyle = css(C.dim, .22); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.rect(X0, 300, 2 * PXM, 26); ctx.fill(); ctx.stroke();
  for (const xg of [X0 + 40, X0 + 2 * PXM - 66]) { ctx.beginPath(); ctx.rect(xg, 326, 26, 104); ctx.fill(); ctx.stroke(); }
  // la quota: quanto è lungo?
  const kq = P(t, 8.6, 9.3);
  if (kq > 0) {
    ctx.save(); ctx.globalAlpha *= kq;
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(X0 + 8, 480); ctx.lineTo(X0 + 2 * PXM - 8, 480); ctx.stroke();
    for (const xx of [X0, X0 + 2 * PXM]) { ctx.beginPath(); ctx.moveTo(xx, 462); ctx.lineTo(xx, 498); ctx.stroke(); }
    arrowHead(ctx, [X0 + 2, 480], Math.PI, C.ink, .8); arrowHead(ctx, [X0 + 2 * PXM - 2, 480], 0, C.ink, .8);
    ctx.fillStyle = C.paper; ctx.fillRect(X0 + PXM - 90, 454, 180, 52);
    const k2 = P(t, 36.1, 36.6);
    txt(ctx, '?', X0 + PXM, 480, { size: 44, weight: 600, color: C.v, alpha: 1 - k2 });
    txt(ctx, '2 m', X0 + PXM, 480, { size: 44, weight: 600, color: C.g, alpha: k2 });
    ctx.restore();
  }
  // le tre file di campioni, e il conto in fondo a ognuna
  const n1 = fila(ctx, t, 12.4, .34, 10, L_LUNGA, R_LUNGA, matita);
  const n2 = fila(ctx, t, 21.4, .14, 16, L_CORTA, R_CORTA, matita);
  const n3 = fila(ctx, t, 32.4, 1.0, 2, PXM, R_METRO, metro);
  if (n1) txt(ctx, String(n1), 1786, R_LUNGA, { size: 34, weight: 600, color: C.g });
  if (n2) txt(ctx, String(n2), 1786, R_CORTA, { size: 34, weight: 600, color: C.g });
  if (n3) txt(ctx, String(n3), 1786, R_METRO, { size: 34, weight: 600, color: C.g });
  ctx.restore();
}
// i tre conti: campione e risultato
function scenaConti(ctx, t) {
  if (t < 8.3 || t > 45.0) return;
  const al = P(t, 8.4, 8.9) * (1 - P(t, 44.3, 44.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 560, 1468, 230);
  const cx = [640, 1106, 1572];
  matita(ctx, cx[0] - L_LUNGA / 2, 622, L_LUNGA, P(t, 8.6, 9.1));
  drawRich(ctx, '{g:10} matite', cx[0], 712, { size: 44, alpha: P(t, 15.9, 16.4) });
  matita(ctx, cx[1] - L_CORTA / 2, 622, L_CORTA, P(t, 21.2, 21.7));
  drawRich(ctx, '{g:16} matite corte', cx[1], 712, { size: 44, alpha: P(t, 23.8, 24.3) });
  metro(ctx, cx[2] - 150, 622, 240, P(t, 31.8, 32.3));
  txt(ctx, '1 m', cx[2] + 112, 622, { size: 30, color: C.v, align: 'left', alpha: P(t, 31.8, 32.3) });
  const k3 = P(t, 34.0, 34.5), k4 = P(t, 36.3, 36.8);
  txt(ctx, '2', cx[2] - 60, 712, { size: 56, weight: 600, color: C.g, alpha: k3 });
  txt(ctx, 'm', cx[2] + 60, 712, { size: 56, weight: 600, color: C.v, alpha: k3 });
  txt(ctx, 'numero', cx[2] - 60, 764, { size: 30, color: C.dim, alpha: k4 });
  txt(ctx, 'unità', cx[2] + 60, 764, { size: 30, color: C.dim, alpha: k4 });
  ctx.restore();
}

// 2 · le sette grandezze di base del SI (44.4–66.4); la tabella resta, spostata a sinistra, anche nella parte 3
const SI = [['lunghezza', 'metro', 'm'], ['massa', 'chilogrammo', 'kg'], ['tempo', 'secondo', 's'],
  ['intensità di corrente', 'ampere', 'A'], ['temperatura', 'kelvin', 'K'], ['quantità di sostanza', 'mole', 'mol'],
  ['intensità luminosa', 'candela', 'cd']];
const T_RIGA = [49.4, 50.0, 50.6, 54.0, 54.8, 58.0, 58.8];
// le righe di cui Stilla sta parlando: [da, a, righe]
const EVID = [[49.4, 53.6, [0, 1, 2]], [54.0, 57.6, [3, 4]], [58.0, 61.6, [5, 6]],
  [71.0, 75.6, [0, 2]], [76.0, 79.6, [0]], [80.0, 84.6, [0, 1, 2]]];
function scenaTabella(ctx, t) {
  if (t < 44.2 || t > 89.2) return;
  const al = P(t, 44.7, 45.3) * (1 - P(t, 88.4, 89.0));
  const x0 = lerp(550, 372, P(t, 66.5, 67.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, x0, 110, 820, 680);
  conFont(TITOLI, () => drawRich(ctx, 'grandezze di base del SI', x0 + 410, 162, { size: 38, weight: 600 }));
  txt(ctx, 'grandezza', x0 + 36, 228, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'unità', x0 + 450, 228, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'simbolo', x0 + 730, 228, { size: 30, color: C.dim });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 24, 256); ctx.lineTo(x0 + 796, 256); ctx.stroke();
  SI.forEach(([g, u, s], i) => {
    const y = 298 + i * 68, k = P(t, T_RIGA[i], T_RIGA[i] + .45, E.out);
    if (k <= 0) return;
    let h = 0;
    for (const [a, b, righe] of EVID) if (righe.includes(i)) h = Math.max(h, life(t, a, b, .3, .3));
    if (h > 0) { ctx.fillStyle = css(C.x, .13 * h); ctx.beginPath(); ctx.roundRect(x0 + 16, y - 30, 788, 60, 12); ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 16);
    txt(ctx, g, x0 + 36, y, { size: 32, align: 'left' });
    txt(ctx, u, x0 + 450, y, { size: 32, align: 'left' });
    txt(ctx, s, x0 + 730, y, { size: 36, weight: 600, color: C.v });
    ctx.restore();
  });
  // la colonna dei simboli, mentre Stilla li elenca
  const ks = life(t, 62.0, 66.3, .4, .4);
  if (ks > 0) { ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x0 + 668, 200, 124, 570, 16); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

// 3 · le grandezze derivate (66.4–88.6)
function scenaDerivate(ctx, t) {
  if (t < 66.8 || t > 89.2) return;
  const al = P(t, 67.0, 67.6) * (1 - P(t, 88.4, 89.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1220, 110, 620, 680);
  conFont(TITOLI, () => drawRich(ctx, 'grandezze derivate', 1530, 162, { size: 38, weight: 600 }));
  const blocco = (ta, y, s1, s2) => {
    drawRich(ctx, s1, 1530, y, { size: 32, alpha: P(t, ta, ta + .5), local: t - ta });
    drawRich(ctx, s2, 1530, y + 70, { size: 50, alpha: P(t, ta + .8, ta + 1.3), local: t - ta - .8 });
  };
  blocco(71.0, 270, 'velocità = lunghezza / tempo', '{x:m/s}');
  blocco(76.0, 460, 'area = lunghezza · lunghezza', '{x:m · m = m²}');
  blocco(80.0, 650, 'forza: il newton', '{x:N = kg·m/s²}');
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.globalAlpha *= P(t, 76.0, 76.5); ctx.beginPath(); ctx.moveTo(1260, 393); ctx.lineTo(1800, 393); ctx.stroke();
  ctx.globalAlpha *= P(t, 80.0, 80.5); ctx.beginPath(); ctx.moveTo(1260, 583); ctx.lineTo(1800, 583); ctx.stroke();
  ctx.restore();
}

// 4 · in una frase (88.8–99.4)
function scenaFine(ctx, t) {
  if (t < 88.9) return;
  const al = 1 - P(t, 97.1, 98.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 89.1 });
    drawRich(ctx, 'Misurare è contare quante volte\nl’{v:unità} sta nella grandezza.', W / 2, 290, { size: 70, weight: 600, local: t - 89.5, stagger: .09 });
  });
  const pills = [[490, 'una misura:\n{g:numero} e {g:unità}'], [960, '{v:sette} grandezze\ndi base nel SI'], [1430, 'le altre sono\n{x:derivate}: m/s, m², N']];
  pills.forEach(([x, s], i) => {
    const a = 91.1 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.5], ['traccia', 8.6, 9.3], ['pop', 8.6, .5],                         // il tavolo, la quota, la matita
    ['tono', 12.4, 15.7, [.1, .3, .5, .7, .9]], ['ding', 15.9],                       // le matite in fila: 10
    ['pop', 21.2, .45],                                                               // la matita corta
    ['tono', 21.4, 23.75, [.1, .4, .7, 1]], ['ding', 23.9],                           // in fila: 16
    ['pop', 31.8, .5], ['pop', 32.4, .55], ['pop', 33.4, .6], ['pop', 34.0, .65],     // il metro, due volte: 2 m
    ['soffio', 44.7],                                                                 // le grandezze di base del SI
    ['pop', 49.4, .7], ['pop', 50.0, .65], ['pop', 50.6, .6],                         // metro, chilogrammo, secondo
    ['pop', 54.0, .55], ['pop', 54.8, .5], ['pop', 58.0, .45], ['pop', 58.8, .4],     // le altre quattro
    ['pop', 62.0, .6],                                                                // la colonna dei simboli
    ['soffio', 67.0],                                                                 // le grandezze derivate
    ['pop', 71.0, .45], ['ding', 71.8],                                               // m/s
    ['pop', 76.0, .45], ['ding', 76.8],                                               // m²
    ['pop', 80.0, .45], ['ding', 80.8],                                               // N = kg·m/s²
    ['soffio', 89.1], ['pop', 91.1, .5], ['pop', 91.6, .6], ['pop', 92.1, .7],        // in una frase
  ];
  return {
    titolo: 'Misurare è confrontare', durata: 99.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 44.4, 'il campione'], [44.4, 66.4, 'le grandezze di base'], [66.4, 88.6, 'le grandezze derivate']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaTavolo(ctx, t); scenaConti(ctx, t); scenaTabella(ctx, t); scenaDerivate(ctx, t); scenaFine(ctx, t); },
  };
});
