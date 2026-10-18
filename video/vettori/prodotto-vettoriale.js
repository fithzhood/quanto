'use strict';
/* La freccia che esce dal foglio — il prodotto vettoriale: a lungo 4, b lungo 3, angolo α; la parte di b perpendicolare
   ad a (b·sin α) per a dà l'area del parallelogramma a·b·sin α (≈ 10,4 a 60°, 0 se paralleli, 12 se perpendicolari);
   il risultato a ∧ b è una freccia perpendicolare al piano (disegnata in scala ridotta, 20 px per unità), verso con la
   mano destra; b ∧ a = −(a ∧ b). È il momento di una forza, M = r ∧ F. Argomento: vettori. */
CVIDEO.registra('vettori/prodotto-vettoriale', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, fixedNum, fmtN, card, arrowHead, dashed, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [62.9, 190], [64.2, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [62.9, 1050], [64.2, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [62.9, 2.2], [64.2, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [62.9, 2], [64.2, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [62.9, -1.5], [64.2, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.6, 'pensa'], [19.3, 'felice'],
  [24.5, 'neutro'], [28.9, 'pensa'], [32.5, 'felice'], [36.5, 'sorpreso'], [41.7, 'neutro'], [46.5, 'pensa'],
  [51.9, 'sorpreso'], [56.9, 'neutro'], [65.2, 'felice'], [70.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Due frecce moltiplicate\npossono dare una freccia?'],
  [7.9, 13.5, 'Due vettori: {mx:a} lungo 4 e {my:b} lungo 3,\nfra loro un angolo {mink:α} = 60°.'],
  [13.6, 19.2, 'Conta la parte di {my:b} {v:perpendicolare}\nad {mx:a}: è lunga {mink:b·sin α}.'],
  [19.3, 24.4, 'Per la lunghezza di {mx:a}: è l’area\ndel {v:parallelogramma}, {mink:a·b·sin α}.'],
  [24.5, 28.8, 'A 60°: 4 · 3 · 0,87 ≈ 10,4.'],
  [28.9, 32.4, 'Paralleli: area zero.'],
  [32.5, 36.4, 'Perpendicolari: 12,\nil massimo.'],
  [36.5, 41.6, 'Ma il risultato è una freccia: il prodotto\n{v:vettoriale}, {mx:a} ∧ {my:b}.'],
  [41.7, 46.4, 'È perpendicolare al piano\ndi {mx:a} e {my:b}, lunga 10,4.'],
  [46.5, 51.8, 'Mano destra: le dita da {mx:a} verso {my:b},\nil pollice dà il verso.'],
  [51.9, 56.8, 'Scambio l’ordine, da {my:b} verso {mx:a}:\nla freccia si {v:capovolge}.'],
  [56.9, 62.7, 'Il {v:momento} di una forza è un prodotto\nvettoriale: {mink:r} dal perno, per la forza {my:F}.'],
  [65.2, 70.2, 'Il prodotto vettoriale è una freccia\nperpendicolare, lunga {mink:a·b·sin α}.'],
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
const ALFA = [[29.1, 60], [30.2, 0], [32.7, 0], [33.8, 90], [36.6, 90], [37.6, 60]];
const alfa = t => kf(t, ALFA);
// la vista: 0 = dall'alto (il piano delle frecce è lo schermo), 1 = inclinata, per vedere la freccia che esce dal piano
const incl = t => P(t, 36.7, 38.1);
const verso = t => 1 - 2 * P(t, 52.2, 53.2) + 2 * P(t, 56.9, 57.9);   // +1: da a verso b; −1: ordine scambiato; col momento si torna a +1
const mom = t => P(t, 57.4, 57.9);                                // col momento le frecce si chiamano r, F, M
const O = [520, 540], K = 90, KZ = 20;                // 90 px per unità nel piano; la freccia del vettoriale a 20 px per unità
// vista inclinata: il piano delle frecce si stende in prospettiva (asse y in diagonale, più corto), l'asse z va in su
function proj(x, y, z, k) {
  const s = 1 - .15 * k;
  return [O[0] + s * K * (x + .45 * k * y), O[1] - s * K * (1 - .55 * k) * y - KZ * k * z];
}
const unit = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
// un arco nel piano delle frecce (raggio r, da a0 ad a1 radianti), proiettato
function arco(r, a0, a1, k) { const pts = []; for (let i = 0; i <= 40; i++) { const a = lerp(a0, a1, i / 40); pts.push(proj(r * Math.cos(a), r * Math.sin(a), 0, k)); } return pts; }
function linea(ctx, pts, col, w, al) {
  if (al <= 0 || pts.length < 2) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La freccia che esce\ndal foglio', W / 2, 230, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.15 }));
}

// ---------- le due frecce (scheda di sinistra) ----------
function sceneFrecce(ctx, t) {
  if (t < 7.5 || t > 63.3) return;
  const al = life(t, 7.5, 63.2, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const k = incl(t), ar = alfa(t) * RAD, bx = B * Math.cos(ar), by = B * Math.sin(ar);
  const Os = proj(0, 0, 0, k), At = proj(A, 0, 0, k), Bt = proj(bx, by, 0, k), ABt = proj(A + bx, by, 0, k), foot = proj(bx, 0, 0, k);
  // il parallelogramma: sparisce quando le frecce diventano parallele
  const kpar = life(t, 19.5, 62.9, .5, .4) * clamp(by / .3);
  if (kpar > 0) {
    ctx.save(); ctx.globalAlpha *= kpar; ctx.fillStyle = css(C.v, .14);
    ctx.beginPath(); ctx.moveTo(Os[0], Os[1]); ctx.lineTo(At[0], At[1]); ctx.lineTo(ABt[0], ABt[1]); ctx.lineTo(Bt[0], Bt[1]); ctx.closePath(); ctx.fill();
    ctx.restore();
    dashed(ctx, At, ABt, C.v, 1, .6 * kpar); dashed(ctx, Bt, ABt, C.v, 1, .6 * kpar);
  }
  // l'altezza: la parte di b perpendicolare ad a
  const kh = life(t, 13.8, 36.6, .5, .4);
  if (kh > 0) {
    dashed(ctx, Bt, foot, C.v, 1, kh);
    drawRich(ctx, '{my:b}{mink:·sin α}', foot[0] + 18, (Bt[1] + foot[1]) / 2, { size: 34, align: 'left', alpha: kh * clamp((by - .5) / .3) });
  }
  // l'angolo
  const ka = life(t, 8.4, 62.9, .4, .4) * clamp(ar / (10 * RAD));
  linea(ctx, arco(.75, 0, ar, k), C.ink, 3, ka);
  const am = ar / 2, pl = proj(1.08 * Math.cos(am), 1.08 * Math.sin(am), 0, k);
  drawRich(ctx, '{mink:α}', pl[0], pl[1], { size: 36, alpha: ka });
  // il giro delle dita, da a verso b (o al contrario)
  const kr = life(t, 46.7, 57.0, .4, .4), vs = verso(t);
  if (kr > 0) {
    const pts = vs > 0 ? arco(1.7, .08, ar - .1, k) : arco(1.7, ar - .1, .08, k);
    const kk = Math.abs(vs);
    linea(ctx, pts, C.g, 5, kr * kk);
    const e = pts[pts.length - 1], d = unit(pts[pts.length - 4], e);
    ctx.save(); ctx.globalAlpha *= kr * kk; arrowHead(ctx, e, Math.atan2(d[1], d[0]), C.g, 1.1); ctx.restore();
  }
  // le due frecce
  freccia(ctx, Os, At, C.x, P(t, 8.0, 8.6), 7);
  freccia(ctx, Os, Bt, C.y, P(t, 8.6, 9.2), 7);
  const km = mom(t);
  drawRich(ctx, '{mx:a}', At[0] + 30, At[1], { size: 40, alpha: P(t, 8.2, 8.6) * (1 - km) });
  drawRich(ctx, '{mx:r}', At[0] + 30, At[1], { size: 40, alpha: km });
  drawRich(ctx, '{my:F}', Bt[0], Bt[1] - 32, { size: 40, alpha: km });
  drawRich(ctx, '{my:b}', Bt[0], Bt[1] - 32, { size: 40, alpha: P(t, 8.8, 9.2) * (1 - km) });
  // il prodotto vettoriale: una freccia perpendicolare al piano, in scala ridotta (20 px per unità)
  const kc = P(t, 37.8, 38.7);
  if (kc > 0) {
    const cz = A * B * Math.sin(ar) * vs * kc, Ct = proj(0, 0, cz, k);
    freccia(ctx, Os, Ct, C.v, Math.min(1, Math.abs(vs) * 3) * kc, 8);
    const kl = clamp(Math.abs(vs) * 2 - .6) * kc, yl = Ct[1] + (vs > 0 ? 18 : -18);
    drawRich(ctx, vs > 0 ? '{mx:a} ∧ {my:b}' : '{my:b} ∧ {mx:a}', Ct[0] + 22, yl, { size: 38, align: 'left', alpha: kl * (1 - km) });
    drawRich(ctx, '{mv:M} = {mx:r} ∧ {my:F}', Ct[0] + 22, yl, { size: 38, align: 'left', alpha: kl * km });
    drawRich(ctx, '{dim:in scala ridotta}', Ct[0] + 22, yl + (vs > 0 ? -44 : 40), { size: 30, align: 'left', alpha: kl });
    // l'angolo retto fra la freccia e il piano
    const kq = life(t, 41.9, 62.9, .4, .4);
    if (kq > 0) {
      const s = vs > 0 ? 1 : -1, q1 = proj(.32, 0, 0, k), q2 = proj(.32, 0, s * 1.6, k), q3 = proj(0, 0, s * 1.6, k);
      linea(ctx, [q1, q2, q3], C.ink, 2.5, kq * Math.abs(vs));
    }
  }
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
  if (t < 8.0 || t > 63.3) return;
  const al = life(t, 8.1, 63.2, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const adq = Math.round(alfa(t)), sq = Math.round(Math.sin(adq * RAD) * 1000) / 1000;
  conFont(TITOLI, () => drawRich(ctx, 'il prodotto {v:vettoriale}', PCX, 165, { size: 38, weight: 600 }));
  riga(ctx, '{dim:lunghezza di} {mx:a}', '4', 235, P(t, 8.2, 8.7));
  riga(ctx, '{dim:lunghezza di} {my:b}', '3', 290, P(t, 8.8, 9.3));
  riga(ctx, '{dim:angolo} {mink:α}', adq + '°', 345, P(t, 9.6, 10.1));
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 390); ctx.lineTo(1800, 390); ctx.stroke();
  riga(ctx, '{dim:altezza} {my:b}{mink:·sin α}', fmtN(B * sq, 1), 445, P(t, 13.8, 14.3));
  ctx.save(); ctx.globalAlpha *= P(t, 19.5, 20.0);
  drawRich(ctx, '{mink:a·b·sin α} =', 1180, 545, { size: 44, align: 'left' });
  fixedNum(ctx, fmtN(A * B * sq, 1), 1790, 545, 66, C.v);
  ctx.restore();
  drawRich(ctx, 'l’area del {v:parallelogramma}', PCX, 640, { size: 34, alpha: life(t, 19.7, 36.7, .4, .4) });
  drawRich(ctx, 'una {v:freccia} perpendicolare al piano', PCX, 640, { size: 34, alpha: life(t, 36.8, 57.0, .4, .4) });
  drawRich(ctx, 'dita da {mx:a} verso {my:b}: il pollice dà il verso', PCX, 715, { size: 30, alpha: life(t, 46.7, 52.0, .4, .4) });
  drawRich(ctx, '{my:b} ∧ {mx:a} = −({mx:a} ∧ {my:b})', PCX, 715, { size: 38, alpha: life(t, 52.4, 57.0, .4, .4) });
  drawRich(ctx, '{v:momento}:  {mink:M = r ∧ }{my:F}', PCX, 640, { size: 40, alpha: P(t, 57.1, 57.6) });
  drawRich(ctx, '{mink:r}{dim: va dal perno al punto della forza}', PCX, 715, { size: 30, alpha: P(t, 57.6, 58.1) });
  ctx.restore();
}

// ---------- in una frase (62,9–72,7) ----------
function sceneFine(ctx, t) {
  if (t < 62.8) return;
  const al = 1 - P(t, 70.7, 71.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 63.1 });
    drawRich(ctx, 'Il prodotto vettoriale è una freccia perpendicolare\nal piano, lunga quanto l’area del parallelogramma.', W / 2, 290, { size: 54, weight: 600, local: t - 63.5, stagger: .08 });
  });
  const pills = [[490, 'lunga\n{mink:a·b·sin α}'], [960, 'verso:\n{v:mano destra}'], [1430, '{my:b} ∧ {mx:a} = −({mx:a} ∧ {my:b})\n{dim:l’ordine conta}']];
  pills.forEach(([x, s], i) => {
    const a = 65.4 + i * .5, kp = P(t, a, a + .5, E.back);
    if (kp <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(kp, kp); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // un fermo immagine per dare tempo alla voce sul conto: [istante del copione, secondi di fermo]
  const PAUSE = [[28.3, 1.7]];
  const reale = td => { let r = td; for (const [x, d] of PAUSE) if (td > x) r += d; return Math.round(r * 100) / 100; };
  const disegno = t => { let s = 0; for (const [x, d] of PAUSE) { if (t < x + s) return t - s; if (t < x + s + d) return x; s += d; } return t - s; };
  const conv = keys => keys.map(([a, v]) => [reale(a), v]);
  // effetti sonori (strumenti/suoni-sintesi.py), nel tempo vero del video (dopo 28,3 s del copione +1,7 s): mentre
  // l'angolo cambia il tono segue l'area, da 0 (0) a 12 (1); poi segue la punta della freccia, da −12 (0) a 12 (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.3, .5], ['pop', 8.9, .6], ['traccia', 8.4, 8.8],       // le frecce a e b, l'angolo
    ['traccia', 13.8, 14.3], ['pop', 14.0, .45],                                      // l'altezza b·sin α
    ['traccia', 19.5, 20.0], ['pop', 19.7, .55],                                      // il parallelogramma: 10,4
    ['tono', 30.8, 31.9, [.87, .83, .5, .07, 0]], ['pop', 32.0, .1],                  // paralleli: area zero
    ['tono', 34.4, 35.5, [0, .1, .71, 1, 1]], ['pop', 35.6, 1],                       // perpendicolari: 12
    ['tono', 38.3, 39.3, [1, 1, .97, .88, .87]], ['soffio', 38.5],                    // di nuovo 60°; il piano si inclina
    ['tono', 39.5, 40.4, [.5, .53, .72, .91, .93]], ['pop', 40.5, .93],               // la freccia esce dal piano
    ['traccia', 43.6, 44.0],                                                          // perpendicolare al piano
    ['traccia', 48.4, 48.8],                                                          // le dita da a verso b
    ['tono', 53.9, 54.9, [.93, .88, .5, .12, .07]], ['pop', 54.2, .4],                // scambio l'ordine: si capovolge
    ['tono', 58.6, 59.6, [.07, .12, .5, .88, .93]], ['pop', 58.9, .6],                // col momento torna su
    ['soffio', 64.8], ['pop', 67.1, .5], ['pop', 67.6, .6], ['pop', 68.1, .7],        // in una frase
  ];
  return {
    titolo: 'La freccia che esce dal foglio', durata: reale(72.7), copertina: 4.2, suoni: SUONI,
    stilla: {
      posa: { x: conv(POSA.x), y: conv(POSA.y), s: conv(POSA.s), lx: conv(POSA.lx), ly: conv(POSA.ly) },
      facce: conv(FACCIA), fumetti: FUMETTI.map(([a, b, s]) => [reale(a), reale(b), s]),
    },
    capitoli: [[7.5, 36.4, 'l’area del parallelogramma'], [36.4, 56.8, 'una freccia fuori dal piano'], [56.8, 62.7, 'il momento']].map(([a, b, n]) => [reale(a), reale(b), n]),
    scena(ctx, t) { const td = disegno(t); sceneIntro(ctx, td); sceneFrecce(ctx, td); scenePannello(ctx, td); sceneFine(ctx, td); },
  };
});
