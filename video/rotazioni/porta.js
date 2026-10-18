'use strict';
/* Spingere la porta — la seconda legge della dinamica per le rotazioni, M = I·α. Prima θ (rad), ω (rad/s), α (rad/s²) come
   posizione, velocità e accelerazione di chi avanza. Porta vista dall'alto, 20 kg, larga L = 0,9 m: I = (1/3)·m·L² = 5,4 kg·m².
   Spinta di 27 N perpendicolare alla porta, per 0,5 s: a 0,8 m dai cardini M = 21,6 N·m, α = M/I = 4 rad/s², dopo 0,5 s
   ω = 2 rad/s e θ = 0,5 rad (≈ 29°); a 0,4 m M = 10,8 N·m, α = 2 rad/s², ω = 1 rad/s; porta blindata da 60 kg
   (I = 16,2 kg·m²) con 21,6 N·m: α ≈ 1,33 rad/s², ω ≈ 0,67 rad/s. Moto vero: θ = ½·α·τ² con α costante (la mano segue la
   porta e spinge sempre perpendicolare), al rallentatore (8 s di video per 1 s vero); le sagome ogni 0,1 s si allargano
   come per il moto uniformemente accelerato. Finita la spinta, fermo immagine dichiarato. Che il momento sia F·b lo spiega
   equilibrio/momento; l'energia di rotazione sta in rotazioni/rotolare e momento-angolare. Argomento: rotazioni. */
CVIDEO.registra('rotazioni/porta', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, fmtN } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [99.2, 190], [100.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [99.2, 1050], [100.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [99.2, 2.2], [100.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [99.2, 2], [100.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [99.2, -1.5], [100.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.1, 'pensa'], [17.1, 'neutro'],
  [26.4, 'felice'], [30.9, 'neutro'], [40.4, 'felice'], [47.5, 'neutro'], [61.2, 'sorpreso'], [66.2, 'neutro'],
  [76.6, 'sorpreso'], [82.6, 'pensa'], [87.8, 'neutro'], [93.8, 'festa'], [99.2, 'neutro'], [101.5, 'felice'],
  [105.5, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Spingi una porta: quanto in fretta\ncomincia a girare?'],
  [7.9, 12.0, 'Una porta vista dall’alto:\ngira attorno ai cardini.'],
  [12.1, 17.0, 'La posizione è l’angolo {mink:θ}, in radianti:\nun giro è 2π rad.'],
  [17.1, 21.4, 'Quanto cambia {mink:θ} al secondo:\nla {x:velocità angolare} {mx:ω}.'],
  [21.5, 26.3, 'E quanto cambia {mx:ω} al secondo:\nl’{v:accelerazione angolare} {mv:α}.'],
  [26.4, 30.8, 'Come posizione, velocità e\naccelerazione di chi avanza.'],
  [30.9, 36.4, 'La spingo alla maniglia con 27 N.\nAl rallentatore.'],
  [36.5, 40.3, 'Mentre spingo, {mx:ω} cresce\nsempre allo stesso ritmo.'],
  [40.4, 47.4, 'In 0,5 s {mx:ω} arriva a 2 rad/s:\n{mv:α} = {g:4 rad/s²}.'],
  [47.5, 55.5, '{y:Momento} {my:M} = {my:F}·{mink:b} = 27 · 0,8 = 21,6 N·m,\ncon {mink:b} distanza dai cardini.'],
  [55.6, 61.1, 'Stessa forza, ma a 0,4 m\ndai cardini.'],
  [61.2, 66.1, 'Momento metà: {mv:α} = {g:2 rad/s²},\nanche lei la {g:metà}.'],
  [66.2, 71.3, 'Ora una porta blindata: uguale,\nma da 60 kg invece che da 20.'],
  [71.4, 76.5, 'Stessa spinta alla maniglia,\n21,6 N·m.'],
  [76.6, 82.5, '{mx:ω} cresce piano: {mv:α} ≈ {g:1,33 rad/s²},\nun {g:terzo}.'],
  [82.6, 87.7, 'Più massa, più fatica a farla girare:\nlo dice il {v:momento d’inerzia} {mv:I}.'],
  [87.8, 93.7, 'Per una porta {mv:I} = (1/3)·{mink:m}·{mink:L}²:\nla blindata ha {mv:I} tre volte più grande.'],
  [93.8, 99.1, '{my:M} = {mv:I}·{mv:α}, come {my:F} = {mink:m}·{mv:a}\nper chi avanza.'],
  [101.5, 106.1, 'Il momento fa accelerare la rotazione:\n{my:M} = {mv:I}·{mv:α}.'],
];

// ---------- la fisica ----------
const LP = 0.9, FZ = 27, SL = 8, TP = 0.5;                 // larghezza, spinta, rallentatore, durata della spinta (s veri)
const I_ = m => m * LP * LP / 3;                           // 5,4 e 16,2 kg·m²
const PROVE = [
  { t0: 34.4, b: 0.8, m: 20, da: 30.9, a: 55.6 },
  { t0: 56.9, b: 0.4, m: 20, da: 55.6, a: 66.2 },
  { t0: 72.4, b: 0.8, m: 60, da: 66.2, a: 99.3 },
];
PROVE.forEach(p => { p.M = FZ * p.b; p.I = I_(p.m); p.al = p.M / p.I; });
const tau = (t, p) => clamp((t - p.t0) / SL, 0, TP);       // tempo vero dall'inizio della spinta; dopo 0,5 s resta fermo
const theta = (t, p) => p.al * tau(t, p) * tau(t, p) / 2;
const omega = (t, p) => p.al * tau(t, p);
function provaDi(t) { for (const p of PROVE) if (t >= p.da && t < p.a) return p; return null; }

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
function numero(ctx, s, x, y, size, col, al = 1) {   // cifre a larghezza fissa, allineate a destra, con l'unità dopo
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z°]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore();
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Spingere la porta', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la porta vista dall'alto: 620 px per metro ----------
const H0 = [300, 630], PXM = 620, LPX = LP * PXM;
const U = th => [Math.cos(th), -Math.sin(th)], N = th => [-Math.sin(th), -Math.cos(th)];   // lungo la porta; verso cui si apre
const lungo = (th, d, o) => { const u = U(th), n = N(th); return [H0[0] + u[0] * d + n[0] * o, H0[1] + u[1] * d + n[1] * o]; };
function porta(ctx, th, m, al, sagoma) {
  if (al <= 0) return;
  const T = m > 30 ? 30 : 22;
  const a = lungo(th, 0, T / 2), b = lungo(th, LPX, T / 2), c = lungo(th, LPX, -T / 2), d = lungo(th, 0, -T / 2);
  ctx.save(); ctx.globalAlpha *= al; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath();
  if (sagoma) { ctx.setLineDash([8, 8]); ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); return; }
  ctx.fillStyle = css(m > 30 ? mix(C.dim, C.paper, .3) : mix(C.y, C.paper, .7)); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.stroke();
  // la maniglia a 0,8 m, sul lato da cui si spinge
  const h1 = lungo(th, 0.8 * PXM - 18, -T / 2 - 7), h2 = lungo(th, 0.8 * PXM + 18, -T / 2 - 7);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...h1); ctx.lineTo(...h2); ctx.stroke();
  ctx.restore();
}
function scenaPorta(ctx, t) {
  if (t < 7.5 || t > 99.6) return;
  const al = life(t, 7.6, 99.4, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il muro con il vano della porta, e i cardini
  ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5;
  for (const [x0, x1] of [[130, 284], [874, 1090]]) { ctx.beginPath(); ctx.rect(x0, 619, x1 - x0, 24); ctx.fill(); ctx.stroke(); }
  // la posizione chiusa, tratteggiata, come riferimento per l'angolo
  const p = provaDi(t);
  const th = p ? theta(t, p) : 0, m = p ? p.m : 20;
  const kRif = life(t, 12.2, 99.3, .4, .4);
  if (kRif > 0 && (th > .02 || t < 30.9)) dashed(ctx, H0, [H0[0] + LPX + 40, H0[1]], C.dim, 1, kRif * .9);
  // le sagome ogni 0,1 s di spinta
  const kP = p ? life(t, p.da, p.a, .5, .5) : 0;
  const kG = kP * (p === PROVE[0] ? 1 - P(t, 47.3, 47.8) : 1);   // mentre si parla del braccio le sagome si tolgono
  if (p && kG > 0) for (let k = 1; k <= 5; k++) if (k * .1 <= tau(t, p) + 1e-9) porta(ctx, p.al * (k * .1) * (k * .1) / 2, p.m, kG * .55, true);
  // l'angolo θ, prima su una porta disegnata, poi su quella vera
  const thA = t < 30.9 ? 0.5 : th, kA = t < 30.9 ? life(t, 12.2, 30.8, .4, .4) : (th > .03 ? 1 : 0) * life(t, 34.6, 99.3, .3, .4) * (1 - life(t, 47.3, 55.6, .4, .4));   // mentre si parla del braccio la θ si toglie
  if (kA > 0) {
    if (t < 30.9) porta(ctx, 0.5, 20, kA, true);
    ctx.save(); ctx.globalAlpha *= kA; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(H0[0], H0[1], 150, 0, -thA, true); ctx.stroke();
    // la θ sta accanto al suo arco: a metà arco se l'angolo è grande, sotto l'inizio dell'arco se è piccolo
    const q = thA >= .3 ? [H0[0] + 190 * Math.cos(thA / 2), H0[1] - 190 * Math.sin(thA / 2)] : [H0[0] + 150, H0[1] + 40];
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(q[0] - 20, q[1] - 24, 40, 48, 10); ctx.fill();
    drawRich(ctx, '{mink:θ}', q[0], q[1], { size: 40 });
    ctx.restore();
  }
  // la porta
  porta(ctx, th, m, p ? kP : P(t, 7.6, 8.2) * (t < 30.9 ? 1 : 0), false);
  M.dot(ctx, H0, C.ink, al, 9);
  // finita la spinta, il fermo immagine è dichiarato
  if (p) txt(ctx, 'fermo immagine', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, p.t0 + SL * TP + .1, p.a - .2, .3, .3) });
  const kCard = life(t, 8.0, 12.0, .4, .4);
  if (kCard > 0) drawRich(ctx, 'cardini', H0[0] - 20, H0[1] + 50, { size: 32, align: 'left', alpha: kCard });
  // la spinta: 4 px per newton, perpendicolare alla porta
  if (p) {
    const kF = Math.max(life(t, p.t0 - .6, p.t0 + SL * TP, .4, .3), p === PROVE[0] ? life(t, 47.6, 55.4, .4, .3) : 0);
    if (kF > 0) {
      const T = p.m > 30 ? 30 : 22, A = lungo(th, p.b * PXM, -T / 2 - 3), B0 = lungo(th, p.b * PXM, -T / 2 - 3 - FZ * 4);
      freccia(ctx, B0, A, C.y, 7, kF);
      drawRich(ctx, '{my:F} = 27 N', B0[0] + 18, B0[1] - 4, { size: 32, align: 'left', alpha: kF });
    }
    // il braccio b, prima della spinta e mentre se ne parla
    const kB = Math.max(life(t, p.da + .3, p.t0, .4, .3), p === PROVE[0] ? life(t, 47.6, 55.4, .4, .3) : 0);
    if (kB > 0) {
      const o = -(p.m > 30 ? 15 : 11) - 52, A1 = lungo(th, 0, o), A2 = lungo(th, p.b * PXM, o);
      ctx.save(); ctx.globalAlpha *= kB;
      freccia(ctx, [(A1[0] + A2[0]) / 2, (A1[1] + A2[1]) / 2], A1, C.ink, 3); freccia(ctx, [(A1[0] + A2[0]) / 2, (A1[1] + A2[1]) / 2], A2, C.ink, 3);
      const L1 = lungo(th, p.b * PXM * .62, o - 62);
      drawRich(ctx, '{mink:b} = ' + fmtN(p.b, 1) + ' m', L1[0], L1[1], { size: 32 });
      ctx.restore();
    }
  }
  // la larghezza L, quando si parla del momento d'inerzia
  const kL = life(t, 87.9, 99.2, .4, .4);
  if (kL > 0 && p) {
    const o = 62, A1 = lungo(th, 0, o), A2 = lungo(th, LPX, o);
    ctx.save(); ctx.globalAlpha *= kL;
    freccia(ctx, [(A1[0] + A2[0]) / 2, (A1[1] + A2[1]) / 2], A1, C.ink, 3); freccia(ctx, [(A1[0] + A2[0]) / 2, (A1[1] + A2[1]) / 2], A2, C.ink, 3);
    const L1 = lungo(th, LPX / 2 + 60, o + 32);
    drawRich(ctx, '{mink:L} = 0,9 m', L1[0], L1[1], { size: 32 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la scheda ----------
function riga(ctx, nome, val, y, col, al, size = 36) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, 1195, y, { size, align: 'left' });
  numero(ctx, val, 1765, y, size + 2, col);
  ctx.restore();
}
const COL = [1228, 1350, 1495, 1680];
function scenaScheda(ctx, t) {
  if (t < 7.5 || t > 99.6) return;
  const al = life(t, 8.0, 99.4, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // la porta
  const kB = P(t, 66.2, 66.7);
  riga(ctx, '{dim:massa}', '20 kg', 165, C.ink, 1 - kB); riga(ctx, '{dim:massa}', '60 kg', 165, C.ink, kB);
  riga(ctx, '{dim:larghezza}', '0,9 m', 220, C.ink, 1);
  linea(ctx, 262, 1);
  // 1 · chi avanza e chi ruota
  const kD = life(t, 12.2, 30.8, .4, .4);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD;
    const kAv = P(t, 26.5, 27.0);   // la colonna di chi avanza arriva quando Stilla la nomina
    txt(ctx, 'chi ruota', 1630, 320, { size: 30, color: C.dim }); txt(ctx, 'chi avanza', 1335, 320, { size: 30, color: C.dim, alpha: kAv });
    const righe = [[12.3, '{mink:s}{dim: in m}', '{mink:θ}{dim: in rad}'], [17.3, '{mx:v}{dim: in m/s}', '{mx:ω}{dim: in rad/s}'], [21.7, '{mv:a}{dim: in m/s²}', '{mv:α}{dim: in rad/s²}']];
    righe.forEach(([a, s1, s2], i) => {
      drawRich(ctx, s1, 1335, 400 + i * 80, { size: 36, alpha: P(t, 26.6 + i * .3, 27.1 + i * .3) });
      drawRich(ctx, s2, 1630, 400 + i * 80, { size: 36, alpha: P(t, a, a + .5) });
    });
    ctx.restore();
  }
  // 2 · durante le spinte: t, θ, ω
  const p = provaDi(t), kN = life(t, 31.0, 82.6, .4, .4);
  if (kN > 0 && p) {
    const ta = tau(t, p);
    riga(ctx, '{mink:t}', fmtN(ta, 2) + ' s', 315, C.ink, kN);
    riga(ctx, '{mink:θ}', fmtN(theta(t, p), 2) + ' rad', 370, C.ink, kN);
    riga(ctx, '{mx:ω}', fmtN(omega(t, p), 2) + ' rad/s', 425, C.x, kN);
  }
  // 3 · il momento d'inerzia e la legge
  const kI = life(t, 87.9, 93.9, .4, .4);
  if (kI > 0) {
    ctx.save(); ctx.globalAlpha *= kI;
    drawRich(ctx, '{mv:I} = (1/3)·{mink:m}·{mink:L}²', 1480, 318, { size: 40, local: t - 88.0 });
    drawRich(ctx, '20 kg:  {mv:I} = 5,4 kg·m²', 1480, 380, { size: 34, local: t - 88.6 });
    drawRich(ctx, '60 kg:  {mv:I} = 16,2 kg·m²', 1480, 432, { size: 34, local: t - 89.1 });
    ctx.restore();
  }
  const kL = life(t, 93.9, 99.3, .4, .4);
  if (kL > 0) {
    ctx.save(); ctx.globalAlpha *= kL;
    drawRich(ctx, '{my:M} = {mv:I}·{mv:α}', 1480, 316, { size: 56, weight: 600, local: t - 94.0 });
    drawRich(ctx, '21,6 = 5,4 · 4', 1480, 392, { size: 38, local: t - 94.7 });
    drawRich(ctx, '16,2 · 1,333 ≈ 21,6', 1480, 440, { size: 38, local: t - 95.3 });
    ctx.restore();
  }
  // 4 · la tabella delle prove
  const kT = P(t, 40.5, 41.0);
  if (kT > 0) {
    linea(ctx, 478, kT);
    const hdr = ['{mink:m}', '{mink:b}', '{my:M}', '{mv:α}'];
    hdr.forEach((s, i) => drawRich(ctx, s, COL[i], 528, { size: 38, alpha: i === 2 ? P(t, 47.6, 48.1) : kT }));
    const vals = [['20 kg', '0,8 m', '21,6 N·m', '4 rad/s²', 40.5, 47.6], ['20 kg', '0,4 m', '10,8 N·m', '2 rad/s²', 61.3, 61.3], ['60 kg', '0,8 m', '21,6 N·m', '1,33 rad/s²', 76.7, 76.7]];
    vals.forEach((r, j) => {
      const k = P(t, r[4], r[4] + .5), kM = P(t, r[5], r[5] + .5);
      [0, 1, 2, 3].forEach(i => txt(ctx, r[i], COL[i], 590 + j * 60, { size: 32, weight: i === 3 ? 600 : 500, color: i === 3 ? C.g : C.ink, alpha: i === 2 ? kM : k }));
    });
  }
  ctx.restore();
}

// 4 · in una frase (97,7–107)
function scenaFine(ctx, t) {
  if (t < 99.1) return;
  const al = 1 - P(t, 106.9, 107.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 99.4 });
    drawRich(ctx, 'Il momento della forza fa\naccelerare la rotazione.', W / 2, 290, { size: 70, weight: 600, local: t - 99.8, stagger: .09 });
  });
  const pills = [[490, '{my:M} = {mv:I}·{mv:α}'], [960, 'momento metà:\n{mv:α} {g:metà}'], [1430, '{mv:I} tre volte:\n{mv:α} un {g:terzo}']];
  pills.forEach(([x, s], i) => {
    const a = 101.7 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 0 ? 46 : 34, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): durante le spinte il tono segue la velocità angolare, da 0 (0) a 2 rad/s (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // la porta dall'alto
    ['traccia', 12.2, 12.6], ['pop', 12.4, .4],                                       // l'angolo θ
    ['pop', 17.4, .5], ['pop', 21.8, .6], ['pop', 26.6, .4],                          // ω, α, chi avanza
    ['traccia', 31.2, 31.6], ['pop', 33.9, .5],                                       // il braccio 0,8 m, la spinta
    ['tono', 34.4, 38.4, [0, .5, 1]],                                                 // spinge: ω fino a 2 rad/s
    ['pop', 40.6, .5], ['ding', 41.1],                                                // α = 4 rad/s²
    ['pop', 47.7, .55],                                                               // il momento M = F·b
    ['traccia', 55.9, 56.3], ['pop', 56.4, .45],                                      // a 0,4 m dai cardini
    ['tono', 56.9, 60.9, [0, .25, .5]], ['ding', 61.5],                               // ω fino a 1 rad/s: α metà
    ['pop', 66.3, .35], ['traccia', 66.5, 66.9], ['pop', 71.9, .5],                   // la porta blindata, la spinta
    ['tono', 72.4, 76.4, [0, .17, .33]], ['ding', 76.9],                              // ω cresce piano: un terzo
    ['traccia', 87.9, 88.3], ['pop', 88.1, .55], ['pop', 88.7, .4], ['pop', 89.2, .5],   // I = (1/3)·m·L², 5,4 e 16,2
    ['pop', 94.1, .65], ['pop', 94.8, .45], ['pop', 95.4, .5],                        // M = I·α, i conti
    ['soffio', 99.4], ['pop', 101.7, .5], ['pop', 102.2, .6], ['pop', 102.7, .7],     // in una frase
  ];
  return {
    titolo: 'Spingere la porta', durata: 108.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.8, 'angolo, velocità, accelerazione'], [30.8, 66.2, 'il momento'], [66.2, 99.2, 'il momento d’inerzia']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPorta(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
