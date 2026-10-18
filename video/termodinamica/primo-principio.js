'use strict';
/* La pompa che scotta — il primo principio ΔU = Q − L, con la convenzione dichiarata: Q calore assorbito dal gas
   (positivo se entra), L lavoro fatto dal gas (positivo se si espande). 0,50 L d'aria a 20 °C e 1 atm
   (n ≈ 0,0208 mol, cv = 5/2·R, γ = 1,4): compressione rapida (adiabatica) a metà volume → ≈ 114 °C, ΔU ≈ +40 J;
   raffreddamento a volume fisso → Q ≈ −40 J; espansione rapida fino a 0,50 L → ≈ −51 °C, L ≈ +31 J.
   Le molecole rimbalzano con velocità proporzionale a √T. Argomento: termodinamica. */
CVIDEO.registra('termodinamica/primo-principio', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const T_FINE = 92.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.6, 'pensa'], [26.0, 'neutro'],
  [35.2, 'felice'], [39.8, 'neutro'], [44.4, 'sorpreso'], [46.6, 'neutro'], [58.4, 'felice'], [63.2, 'neutro'],
  [77.6, 'felice'], [82.2, 'freddo'], [87.0, 'felice'], [89.4, 'neutro'], [94.6, 'felice'], [98.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Perché la pompa della bici\nsi scalda quando gonfi?'],
  [7.9, 12.3, 'Aria chiusa in un cilindro\nda un pistone, a 20 °C.'],
  [12.5, 17.0, 'Le molecole rimbalzano: la loro energia\nè l’{g:energia interna} {mg:U}.'],
  [17.2, 21.4, 'In un gas ideale {mg:U} dipende\nsolo dalla temperatura.'],
  [21.6, 25.8, '{mg:U} cambia col {y:calore} {my:Q}\ne col {v:lavoro} {mv:L}.'],
  [26.0, 30.4, '{my:Q}: calore {y:assorbito} dal gas,\npositivo se entra.'],
  [30.6, 35.0, '{mv:L}: lavoro fatto {v:dal} gas,\npositivo se si espande.'],
  [35.2, 39.6, 'Il primo principio:\n{mink:Δ}{mg:U}{mink: = }{my:Q}{mink: − }{mv:L}.'],
  [39.8, 44.2, 'Spingo il pistone di colpo,\nqui al rallentatore.'],
  [44.4, 48.8, 'Volume dimezzato: le molecole\nvanno più veloci. 114 °C!'],
  [49.0, 53.4, 'Troppo in fretta per scambiare\ncalore: {my:Q} ≈ 0.'],
  [53.6, 58.2, '{mv:L} ≈ −40 J: il lavoro lo fa\nil pistone {v:sul} gas.'],
  [58.4, 63.0, '{mink:Δ}{mg:U} = 0 − (−40 J) = {g:+40 J}:\nl’energia interna sale.'],
  [63.2, 67.6, 'Pistone fermo: il calore esce,\nil gas torna a 20 °C.'],
  [67.8, 72.6, 'Qui {mv:L} = 0 e {my:Q} ≈ −40 J:\n{mink:Δ}{mg:U} ≈ −40 J.'],
  [72.8, 77.4, 'Ora lo lascio andare di colpo:\nil gas spinge e si espande.'],
  [77.6, 82.0, 'Ha fatto lavoro, {mv:L} ≈ +31 J,\nsenza ricevere calore.'],
  [82.2, 86.8, '{mink:Δ}{mg:U} ≈ −31 J: le molecole rallentano,\nl’aria scende a −51 °C!'],
  [87.0, 91.6, 'L’aria che sale si espande\ne si raffredda: nascono le nuvole.'],
  [94.6, 99.6, '{mink:Δ}{mg:U} = {my:Q} − {mv:L}: senza calore,\ncomprimere scalda, espandere raffredda.'],
];

// ---------- la fisica: 0,50 L d'aria, n fisso; volumi in litri ----------
const R = 8.314, CV = 2.5 * R, T0 = 293.15, V0 = .5, N_MOL = 101325 * .0005 / (R * T0);
const T_C0 = 40.4, T_C1 = 43.8, T_R0 = 63.6, T_R1 = 67.2, T_E0 = 73.2, T_E1 = 76.8;
const T1 = T0 * 2 ** .4, T3 = T0 * .5 ** .4;                     // ≈ 386,8 K (114 °C) e ≈ 222,2 K (−51 °C)
const DU_C = N_MOL * CV * (T1 - T0), DU_E = N_MOL * CV * (T3 - T0);   // ≈ +40,5 J e ≈ −30,7 J
const vol = t => t < T_E0 ? lerp(V0, V0 / 2, P(t, T_C0, T_C1)) : lerp(V0 / 2, V0, P(t, T_E0, T_E1));
function temp(t) {
  if (t < T_C0) return T0;
  if (t < T_R0) return T0 * (V0 / vol(t)) ** .4;                 // adiabatica: T·V^(γ−1) costante
  if (t < T_E0) {                                               // il calore esce: la differenza cala in modo esponenziale
    const u = clamp((t - T_R0) / (T_R1 - T_R0)), f = (Math.exp(-3 * u) - Math.exp(-3)) / (1 - Math.exp(-3));
    return T0 + (T1 - T0) * f;
  }
  return T0 * (V0 / 2 / vol(t)) ** .4;
}

// ---------- aiutanti ----------
function rng(seed) {   // numeri «a caso» sempre uguali (mulberry32)
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let q = Math.imul(a ^ a >>> 15, 1 | a); q = (q + Math.imul(q ^ q >>> 7, 61 | q)) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; };
}
const piega = u => { u = ((u % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // avanti e indietro fra 0 e 1: il rimbalzo
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
function numero(ctx, s, x, y, size, col, al = 1, align = 'right') {   // cifre a larghezza fissa, con l'unità dopo
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z°]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = align === 'center' ? x - (wu + wc) / 2 : x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
const segnato = v => (v < -.5 ? '−' : v > .5 ? '+' : '') + Math.abs(Math.round(v));

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La pompa che scotta', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- il cilindro: 560 px = 0,50 L ----------
const CX0 = 240, CY0 = 280, CY1 = 520, LPX = 560, RM = 8;
const xPist = t => CX0 + LPX * vol(t) / V0;
const MOL = (() => { const r = rng(7), m = []; for (let i = 0; i < 34; i++) { const a = r() * 2 * Math.PI, v = 150 + 170 * r(); m.push({ ux: r(), uy: r(), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } return m; })();
// ogni molecola avanza a velocità v·√(T/T0); la coordinata normalizzata (fra le pareti, anche quando il pistone
// si muove) cresce dell'integrale di √(T/T0)/L: integrato una volta sola, poi si legge in tabella
const DT = .01, NT = Math.ceil(105 / DT) + 2, FX = new Float64Array(NT), FY = new Float64Array(NT);
for (let i = 1; i < NT; i++) {
  const tt = (i - .5) * DT, s = Math.sqrt(temp(tt) / T0);
  FX[i] = FX[i - 1] + s / (xPist(tt) - CX0 - 2 * RM) * DT; FY[i] = FY[i - 1] + s / (CY1 - CY0 - 2 * RM) * DT;
}
const tab = (A, t) => { const f = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(f); return lerp(A[i], A[i + 1], f - i); };
function molecole(ctx, t) {
  const fx = tab(FX, t), fy = tab(FY, t), lx = xPist(t) - CX0 - 2 * RM, ly = CY1 - CY0 - 2 * RM;
  ctx.fillStyle = css(C.x, .85);
  for (const m of MOL) {
    ctx.beginPath(); ctx.arc(CX0 + RM + piega(m.ux + m.vx * fx) * lx, CY0 + RM + piega(m.uy + m.vy * fy) * ly, RM, 0, Math.PI * 2); ctx.fill();
  }
}
function scenaCilindro(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5), xp = xPist(t), ym = (CY0 + CY1) / 2;
  card(ctx, 110, 110, 990, 660, al);   // 20 px più bassa della solita: la nuvola alza il fumetto
  ctx.save(); ctx.globalAlpha *= al;
  // il gas, le pareti, il pistone con l'asta e il manico
  ctx.fillStyle = css(C.x, .07); ctx.fillRect(CX0, CY0, xp - CX0, CY1 - CY0);
  molecole(ctx, t);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(CX0 + LPX + 60, CY0 - 4); ctx.lineTo(CX0 - 4, CY0 - 4); ctx.lineTo(CX0 - 4, CY1 + 4); ctx.lineTo(CX0 + LPX + 60, CY1 + 4); ctx.stroke();
  ctx.fillStyle = css(C.dim);
  ctx.fillRect(xp, CY0, 26, CY1 - CY0); ctx.fillRect(xp + 26, ym - 9, 230, 18);
  ctx.beginPath(); ctx.roundRect(xp + 256, ym - 70, 26, 140, 10); ctx.fill();
  // il tempo: rallentato quando si muove il pistone, accelerato mentre il calore esce
  const lento = t > T_C0 - .3 && t < T_C1 + .3 || t > T_E0 - .3 && t < T_E1 + .3, svelto = t > T_R0 - .3 && t < T_R1 + .3;
  txt(ctx, lento ? 'al rallentatore' : svelto ? 'tempo accelerato' : '', 1075, 150, { size: 30, color: C.dim, align: 'right' });
  // i due versi positivi, mostrati una volta: il calore che entra, il gas che spinge fuori il pistone
  const kq = life(t, 26.2, 30.4, .4, .4);
  if (kq > 0) { freccia(ctx, [430, 168], [430, 262], C.y, kq); drawRich(ctx, '{my:Q} > 0: entra', 460, 200, { size: 34, align: 'left', alpha: kq }); }
  const kl = life(t, 30.8, 35.0, .4, .4);
  if (kl > 0) { freccia(ctx, [xp - 50, 232], [xp + 70, 232], C.v, kl); drawRich(ctx, '{mv:L} > 0: si espande', xp - 70, 232, { size: 34, align: 'right', alpha: kl }); }
  // il calore che esce dalle pareti mentre il gas torna a 20 °C (frecce lunghe quanto la differenza di temperatura)
  const kr = life(t, T_R0 - .2, 72.6, .3, .5);
  if (kr > 0) {
    const k = clamp((temp(t) - T0) / (T1 - T0));
    for (const x of [300, 380, 460]) freccia(ctx, [x, CY0 - 16], [x, CY0 - 30 - 80 * k], C.y, kr * clamp(k * 8), 6);
    drawRich(ctx, '{y:calore che esce}', 520, 210, { size: 32, align: 'left', alpha: kr });
  }
  // le letture
  txt(ctx, 'volume', 380, 610, { size: 30, color: C.dim });
  numero(ctx, M.fmtN(vol(t), 2) + ' L', 380, 662, 48, C.ink, 1, 'center');
  txt(ctx, 'temperatura', 790, 610, { size: 30, color: C.dim });
  const tc = Math.round(temp(t) - 273.15);
  numero(ctx, (tc < 0 ? '−' : '') + Math.abs(tc) + ' °C', 790, 662, 52, C.ink, 1, 'center');
  numero(ctx, '≈ ' + Math.round(temp(t)) + ' K', 790, 722, 32, C.dim, 1, 'center');
  ctx.restore();
}

// ---------- il primo principio e i bilanci (barre: 3,5 px per joule) ----------
const FASI = [   // [da, a, nome, [[comparsa, valore] di Q, L, ΔU]]
  [48.8, 63.0, 'compressione rapida', [[49.2, 0], [53.8, -DU_C], [58.6, DU_C]]],
  [67.6, 72.6, 'raffreddamento a volume fisso', [[68.0, -DU_C], [68.0, 0], [68.0, -DU_C]]],
  [77.4, T_FINE, 'espansione rapida', [[77.8, 0], [77.8, -DU_E], [82.4, DU_E]]],
];
function scenaBilancio(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 8.0, T_FINE + .1, .5, .5);
  card(ctx, 1140, 110, 670, 660, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'primo principio', 1475, 165, { size: 38, weight: 600 }));
  drawRich(ctx, '{mink:Δ}{mg:U}{mink: = }{my:Q}{mink: − }{mv:L}', 1475, 250, { size: 64, local: t - 35.4 });
  const voce = (s, a, b, y, t0) => {
    drawRich(ctx, s, 1200, y, { size: 40, local: t - t0 });
    drawRich(ctx, a, 1240, y - 17, { size: 30, align: 'left', local: t - t0 - .2 });
    drawRich(ctx, b, 1240, y + 19, { size: 30, align: 'left', local: t - t0 - .4 });
  };
  voce('{mg:U}', '{dim:energia interna: in un gas}', '{dim:ideale dipende solo da }{mink:T}', 330, 12.7);
  voce('{my:Q}', '{dim:calore assorbito dal gas,}', '{dim:positivo se entra}', 408, 26.2);
  voce('{mv:L}', '{dim:lavoro fatto dal gas,}', '{dim:positivo se si espande}', 486, 30.8);
  // le barre del bilancio, fase per fase
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 538); ctx.lineTo(1770, 538); ctx.stroke();
  for (const [a, b, nome, val] of FASI) {
    const kf = life(t, a, b, .4, .4);
    if (kf <= 0) continue;
    ctx.save(); ctx.globalAlpha *= kf;
    txt(ctx, nome, 1475, 570, { size: 30, weight: 600, color: C.dim });
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1500, 596); ctx.lineTo(1500, 750); ctx.stroke();
    [['{my:Q}', C.y], ['{mv:L}', C.v], ['{mink:Δ}{mg:U}', C.g]].forEach(([s, col], i) => {
      const [tc, v] = val[i], k = P(t, tc, tc + .6, E.out), y = 622 + i * 54;
      if (k <= 0) return;
      drawRich(ctx, s, 1190, y, { size: 38, align: 'left', alpha: k });
      const w = v * 3.5 * k;
      ctx.fillStyle = css(col); ctx.fillRect(Math.min(1500, 1500 + w), y - 16, Math.abs(w), 32);
      numero(ctx, (Math.abs(v) < .5 ? '' : '≈ ') + segnato(v) + ' J', 1795, y, 34, col, k);
    });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (92,1–102,2)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.1, 101.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.3 });
    drawRich(ctx, '{mink:Δ}{mg:U} = {my:Q} − {mv:L}: senza calore,\ncomprimere scalda, espandere raffredda.', W / 2, 290, { size: 66, weight: 600, local: t - 92.7, stagger: .09 });
  });
  const pills = [[490, '{my:Q} > 0: il calore\n{y:entra} nel gas'], [960, '{mv:L} > 0: il gas\nsi {v:espande}'], [1430, '{mg:U} dipende\nsolo dalla {g:temperatura}']];
  pills.forEach(([x, s], i) => {
    const a = 94.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la temperatura del gas, da −60 °C (0) a 120 °C (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.8, .5],                                               // il cilindro; l'energia interna U
    ['pop', 26.3, .45], ['pop', 30.9, .5], ['pop', 35.5, .6],                         // Q, L, il primo principio
    ['tono', 40.4, 43.8, [.45, .46, .54, .78, .94, .97]], ['pop', 44.0, .9],          // spingo di colpo: 114 °C
    ['pop', 49.3, .3], ['pop', 53.9, .35], ['ding', 58.9],                            // Q = 0, L = −40 J, ΔU = +40 J
    ['tono', 63.6, 67.2, [.97, .72, .58, .51, .47, .45]], ['pop', 68.1, .3],          // il calore esce: torna a 20 °C
    ['tono', 73.2, 76.8, [.45, .42, .3, .12, .06, .05]],                              // lo lascio andare: si raffredda
    ['pop', 77.9, .5], ['pop', 82.5, .2],                                             // L = +31 J, ΔU = −31 J: −51 °C
    ['soffio', 92.3], ['pop', 94.9, .5], ['pop', 95.4, .6], ['pop', 95.9, .7],        // in una frase
  ];
  return {
    titolo: 'La pompa che scotta', durata: 102.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI, stati: [[87.2, 'nuvola'], [T_FINE, 'liquida']] },
    capitoli: [[7.5, 39.6, 'il primo principio'], [39.6, 63.2, 'comprimere'], [63.2, T_FINE, 'raffreddare ed espandere']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCilindro(ctx, t); scenaBilancio(ctx, t); scenaFine(ctx, t); },
  };
});
