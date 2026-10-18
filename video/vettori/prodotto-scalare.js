'use strict';
/* L'ombra di una freccia sull'altra — il prodotto scalare: a lungo 4, b lungo 3, angolo α; l'ombra di b su a è b·cos α,
   per la lunghezza di a fa a·b·cos α: un numero (6 a 60°, 12 se paralleli, 0 se perpendicolari, −6 a 120°). È il lavoro,
   L = F·s·cos α. Argomento: vettori. */
CVIDEO.registra('vettori/prodotto-scalare', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, fixedNum, fmtN, card, arrowHead, dashed, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [47.6, 190], [48.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [47.6, 1050], [48.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [47.6, 2.2], [48.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [47.6, 2], [48.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [47.6, -1.5], [48.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.6, 'pensa'], [18.5, 'neutro'],
  [23.5, 'felice'], [29.6, 'sorpreso'], [33.7, 'neutro'], [37.9, 'sorpreso'], [42.5, 'felice'], [47.6, 'neutro'],
  [49.8, 'felice'], [55.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Due frecce moltiplicate\npossono dare un numero?'],
  [7.9, 13.5, 'Due vettori: {mx:a} lungo 4 e {my:b} lungo 3,\nfra loro un angolo {mink:α} = 60°.'],
  [13.6, 18.4, 'L’{y:ombra} di {my:b} su {mx:a}\nè lunga {mink:b·cos α}.'],
  [18.5, 23.4, 'La moltiplico per la lunghezza di {mx:a}:\nè il prodotto {g:scalare}.'],
  [23.5, 29.5, 'Vale {mink:a·b·cos α} = 4 · 3 · 0,5 = 6:\nun {g:numero}, non una freccia.'],
  [29.6, 33.6, 'Frecce parallele:\n12, il massimo.'],
  [33.7, 37.8, 'Perpendicolari: l’ombra\nsparisce, zero.'],
  [37.9, 42.4, 'Oltre 90° l’ombra va\nall’indietro: {v:negativo}.'],
  [42.5, 47.4, 'È il {g:lavoro}: forza per spostamento\nper coseno, {mink:L = F·s·cos α}.'],
  [49.8, 55.3, 'Il prodotto scalare è un numero,\n{mink:a·b·cos α}: positivo, zero o negativo.'],
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
const RAD = Math.PI / 180, A = 4, B = 3;
// l'angolo fra le due frecce nel tempo (gradi): le spazzate non sono un moto fisico, l'easing va bene
const ALFA = [[29.8, 60], [30.9, 0], [33.9, 0], [35.0, 90], [38.1, 90], [39.2, 120], [42.6, 120], [43.6, 60]];
const alfa = t => kf(t, ALFA);
const O = [600, 540], K = 90;                          // 90 px per unità
const pt = (x, y) => [O[0] + K * x, O[1] - K * y];
function linea(ctx, pts, col, w, al) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’ombra di una freccia\nsull’altra', W / 2, 230, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.15 }));
}

// ---------- le due frecce (scheda di sinistra) ----------
function sceneFrecce(ctx, t) {
  if (t < 7.5 || t > 48.0) return;
  const al = life(t, 7.5, 47.9, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const ar = alfa(t) * RAD, bx = B * Math.cos(ar), by = B * Math.sin(ar);
  const Os = pt(0, 0), At = pt(A, 0), Bt = pt(bx, by), foot = pt(bx, 0);
  // l'ombra di b su a: in avanti arancio, all'indietro viola
  const kom = life(t, 13.8, 47.6, .5, .4);
  if (kom > 0) {
    dashed(ctx, Bt, foot, C.dim, 1, kom);
    if (Math.abs(bx) > .02) {
      ctx.save(); ctx.globalAlpha *= kom * .55; ctx.strokeStyle = css(bx > 0 ? C.y : C.v); ctx.lineWidth = 14; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.moveTo(Os[0], Os[1] + 18); ctx.lineTo(foot[0], foot[1] + 18); ctx.stroke(); ctx.restore();
    }
    drawRich(ctx, bx >= 0 ? '{my:b}{mink:·cos α}' : '{v:all’indietro}', (Os[0] + foot[0]) / 2, Os[1] + 58, { size: 34, alpha: kom * clamp((Math.abs(bx) - .4) / .3) });
  }
  // l'angolo
  const ka = life(t, 8.4, 47.6, .4, .4) * clamp(ar / (10 * RAD));
  const arcp = []; for (let i = 0; i <= 40; i++) { const a = ar * i / 40; arcp.push(pt(.75 * Math.cos(a), .75 * Math.sin(a))); }
  linea(ctx, arcp, C.ink, 3, ka);
  const pl = pt(1.08 * Math.cos(ar / 2), 1.08 * Math.sin(ar / 2));
  drawRich(ctx, '{mink:α}', pl[0], pl[1], { size: 36, alpha: ka });
  // le due frecce
  freccia(ctx, Os, At, C.x, P(t, 8.0, 8.6), 7);
  freccia(ctx, Os, Bt, C.y, P(t, 8.6, 9.2), 7);
  drawRich(ctx, '{mx:a}', At[0] + 30, At[1], { size: 40, alpha: P(t, 8.2, 8.6) });
  drawRich(ctx, '{my:b}', Bt[0], Bt[1] - 32, { size: 40, alpha: P(t, 8.8, 9.2) });
  dot(ctx, Os, C.ink, 1, 7);
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1490;
function riga(ctx, nome, val, y, al, col) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1180, y, { size: 34, align: 'left', alpha: al });
  ctx.save(); ctx.globalAlpha *= al; fixedNum(ctx, val, 1790, y, 42, col || C.ink); ctx.restore();
}
function scenePannello(ctx, t) {
  if (t < 8.0 || t > 48.0) return;
  const al = life(t, 8.1, 47.9, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const adq = Math.round(alfa(t)), cq = Math.round(Math.cos(adq * RAD) * 1000) / 1000;
  conFont(TITOLI, () => drawRich(ctx, 'il prodotto {g:scalare}', PCX, 165, { size: 38, weight: 600 }));
  riga(ctx, '{dim:lunghezza di} {mx:a}', '4', 235, P(t, 8.2, 8.7));
  riga(ctx, '{dim:lunghezza di} {my:b}', '3', 290, P(t, 8.8, 9.3));
  riga(ctx, '{dim:angolo} {mink:α}', adq + '°', 345, P(t, 9.6, 10.1));
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 390); ctx.lineTo(1800, 390); ctx.stroke();
  const om = B * cq, sc = A * B * cq;
  riga(ctx, '{dim:ombra} {my:b}{mink:·cos α}', fmtN(om, 1), 445, P(t, 13.8, 14.3), om < -.01 ? C.v : C.ink);
  ctx.save(); ctx.globalAlpha *= P(t, 18.7, 19.2);
  drawRich(ctx, '{mink:a·b·cos α} =', 1180, 545, { size: 44, align: 'left' });
  fixedNum(ctx, fmtN(sc, 1), 1790, 545, 66, sc < -.01 ? C.v : C.g);
  ctx.restore();
  drawRich(ctx, 'un {g:numero}, non una freccia', PCX, 660, { size: 36, local: t - 27.0, alpha: 1 - P(t, 42.3, 42.7) });
  drawRich(ctx, '{g:lavoro}:  {mink:L = F·s·cos α}', PCX, 650, { size: 42, alpha: P(t, 42.7, 43.2) });
  drawRich(ctx, '{dim:forza} {mink:F}{dim:, spostamento} {mink:s}', PCX, 720, { size: 32, alpha: P(t, 43.2, 43.7) });
  ctx.restore();
}

// ---------- in una frase (47,6–57,5) ----------
function sceneFine(ctx, t) {
  if (t < 47.5) return;
  const al = 1 - P(t, 56.0, 57.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 47.8 });
    drawRich(ctx, 'Il prodotto scalare è un numero:\nl’ombra di una freccia per la lunghezza dell’altra.', W / 2, 290, { size: 56, weight: 600, local: t - 48.2, stagger: .08 });
  });
  const pills = [[490, 'paralleli:\n{g:il massimo}'], [960, 'perpendicolari:\n{g:zero}'], [1430, 'oltre 90°:\n{v:negativo}']];
  pills.forEach(([x, s], i) => {
    const a = 50.0 + i * .5, kp = P(t, a, a + .5, E.back);
    if (kp <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(kp, kp); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // un fermo immagine per dare tempo alla voce sul conto: [istante del copione, secondi di fermo]
  const PAUSE = [[28.8, .7], [47.0, .8]];
  const reale = td => { let r = td; for (const [x, d] of PAUSE) if (td > x) r += d; return Math.round(r * 100) / 100; };
  const disegno = t => { let s = 0; for (const [x, d] of PAUSE) { if (t < x + s) return t - s; if (t < x + s + d) return x; s += d; } return t - s; };
  const conv = keys => keys.map(([a, v]) => [reale(a), v]);
  // effetti sonori (strumenti/suoni-sintesi.py), nel tempo vero del video (dopo 28,8 s del copione +0,7 s, dopo 47,0 s
  // +1,5 s): mentre l'angolo cambia il tono segue il prodotto scalare, da −12 (0) a 12 (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.3, .5], ['pop', 8.9, .6], ['traccia', 8.4, 8.8],       // le frecce a e b, l'angolo
    ['traccia', 13.8, 14.3], ['pop', 14.0, .4],                                       // l'ombra di b su a
    ['pop', 18.9, .55], ['ding', 19.3], ['pop', 27.1, .4],                            // a·b·cos α = 6: un numero
    ['tono', 30.5, 31.6, [.75, .78, .93, 1, 1]], ['pop', 31.7, 1],                    // paralleli: 12
    ['tono', 34.6, 35.7, [1, 1, .85, .55, .5]], ['pop', 35.8, .5],                    // perpendicolari: zero
    ['tono', 38.8, 39.9, [.5, .48, .37, .26, .25]], ['pop', 40.0, .25],               // oltre 90°: negativo
    ['tono', 43.3, 44.3, [.25, .28, .5, .72, .75]], ['pop', 43.5, .5],                // di nuovo 60°; il lavoro
    ['soffio', 49.3], ['pop', 51.5, .5], ['pop', 52.0, .6], ['pop', 52.5, .7],        // in una frase
  ];
  return {
    titolo: 'L’ombra di una freccia sull’altra', durata: reale(58), copertina: 4.2, suoni: SUONI,
    stilla: {
      posa: { x: conv(POSA.x), y: conv(POSA.y), s: conv(POSA.s), lx: conv(POSA.lx), ly: conv(POSA.ly) },
      facce: conv(FACCIA), fumetti: FUMETTI.map(([a, b, s]) => [reale(a), reale(b), s]),
    },
    capitoli: [[7.5, 29.5, 'l’ombra per la lunghezza'], [29.5, 47.4, 'quando cambia l’angolo']].map(([a, b, n]) => [reale(a), reale(b), n]),
    scena(ctx, t) { const td = disegno(t); sceneIntro(ctx, td); sceneFrecce(ctx, td); scenePannello(ctx, td); sceneFine(ctx, td); },
  };
});
