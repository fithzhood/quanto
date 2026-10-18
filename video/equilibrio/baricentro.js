'use strict';
/* Quando un corpo si ribalta — sta in piedi finché la verticale dal baricentro cade dentro la base d'appoggio; la torre di Pisa; equilibrio stabile, instabile, indifferente. Argomento: equilibrio. */
CVIDEO.registra('equilibrio/baricentro', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [72.6, 190], [73.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [72.6, 1050], [73.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [72.6, 2.2], [73.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [72.6, 2], [73.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [72.6, -1.5], [73.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [25.1, 'felice'], [29.0, 'neutro'],
  [33.4, 'sorpreso'], [37.3, 'pensa'], [41.7, 'neutro'], [45.3, 'felice'], [49.7, 'neutro'], [52.6, 'pensa'],
  [57.2, 'neutro'], [61.1, 'felice'], [63.9, 'sorpreso'], [68.3, 'neutro'], [74.9, 'felice'], [78.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Fino a quando un corpo inclinato\nresta in piedi?'],
  [7.9, 11.6, 'Una scatola alta e stretta,\nappoggiata sul tavolo.'],
  [11.7, 16.2, 'Il peso agisce nel {v:baricentro} {mink:G}:\nil punto dove lo pensiamo applicato.'],
  [16.3, 20.4, 'La {v:base d’appoggio} è la parte\nche tocca il tavolo.'],
  [20.5, 25.0, 'La inclino un poco: la verticale\nda {mink:G} cade {g:dentro} la base.'],
  [25.1, 28.9, 'La lascio: il peso la {g:riporta giù}\n(al rallentatore).'],
  [29.0, 33.3, 'La inclino di più: ora la verticale\ncade {r:fuori} dalla base…'],
  [33.4, 37.2, '…e la scatola si {r:ribalta},\ngirando sul suo spigolo.'],
  [37.3, 41.6, 'Il limite è quando la verticale\npassa proprio per lo spigolo.'],
  [41.7, 45.2, 'La torre di Pisa pende di circa 4°…'],
  [45.3, 49.6, '…ma la verticale dal suo baricentro\ncade ancora {g:dentro} la base.'],
  [49.7, 52.5, 'Per questo sta in piedi.'],
  [52.6, 57.1, 'Ma non basta stare in equilibrio:\nconta cosa succede se lo sposti.'],
  [57.2, 61.0, 'Pallina in una conca: la sposto,\ne {g:torna indietro}.'],
  [61.1, 63.8, 'È l’equilibrio {g:stabile}.'],
  [63.9, 68.2, 'Sopra una cupola: appena la sposto,\nsi {r:allontana}. Equilibrio {r:instabile}.'],
  [68.3, 72.3, 'Su un piano resta dove la metti:\nequilibrio {v:indifferente}.'],
  [74.9, 80.2, 'Un corpo appoggiato sta in piedi\nse la verticale da {mink:G} cade nella base.'],
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
const G = 9.8, RAD = Math.PI / 180;
// la scatola: larga 0,4 m e alta 1 m, 320 px per metro; ruota sullo spigolo destro in basso
const BW = .4, BH = 1, PXM = 320, YT = 640, PIV = [828, YT];
const TC = Math.atan(BW / BH);                                  // angolo limite: 21,8°
const KR = G * .5 * Math.hypot(BW, BH) / ((BW * BW + BH * BH) / 3);   // m·g·r / I dello spigolo, diviso m: 13,65 s⁻²
const LENTO = 3;
// rotazione libera attorno allo spigolo: θ'' = k·sin(θ − θc); integrata dall'istante in cui la lascio (sempre uguale per lo stesso t)
function cadutaLibera(th0, tau) {
  let th = th0, om = 0; const dt = 1 / 600;
  for (let u = 0; u < tau; u += dt) {
    om += KR * Math.sin(th - TC) * dt; th += om * dt;
    if (th <= 0) return 0;                 // torna giù e si posa sulla base
    if (th >= Math.PI / 2) return Math.PI / 2;   // si ribalta e si posa sul fianco
  }
  return th;
}
// l'angolo della scatola nel tempo: inclinata a mano, poi lasciata (al rallentatore)
function angoloScatola(t) {
  if (t < 25.4) return kf(t, [[20.7, 0], [22.2, 15 * RAD]]);
  if (t < 29.2) return cadutaLibera(15 * RAD, (t - 25.4) / LENTO);
  if (t < 33.6) return kf(t, [[29.2, 0], [31.0, 28 * RAD]]);
  return cadutaLibera(28 * RAD, (t - 33.6) / LENTO);
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Quando un corpo si ribalta', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// il tavolo e la verticale dal baricentro, verde se cade dentro la base, rossa se fuori
function tavolo(ctx) {
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(180, YT); ctx.lineTo(1740, YT); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 190; x < 1740; x += 30) { ctx.moveTo(x, YT + 4); ctx.lineTo(x - 16, YT + 22); }
  ctx.stroke();
}
function verticale(ctx, g, dentro, al) {
  if (al <= 0) return;
  const col = dentro ? C.g : C.r;
  dashed(ctx, g, [g[0], YT], col, 1, al);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(g[0], YT, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function base(ctx, x0, x1, al) {   // la base d'appoggio, evidenziata sul tavolo
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.v); ctx.lineWidth = 10; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(x0, YT + 1); ctx.lineTo(x1, YT + 1); ctx.stroke(); ctx.restore();
}
function scatola(ctx, th, al, tratteggio) {
  if (al <= 0) return null;
  const w = BW * PXM, h = BH * PXM;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(PIV[0], PIV[1]); ctx.rotate(th);
  ctx.fillStyle = css(mix(C.x, C.paper, tratteggio ? .9 : .72)); ctx.strokeStyle = css(mix(C.x, C.ink, .4)); ctx.lineWidth = 4;
  if (tratteggio) ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.rect(-w, -h, w, h); ctx.fill(); ctx.stroke();
  ctx.restore();
  // il baricentro, al centro della scatola
  const gx = -w / 2, gy = -h / 2, c = Math.cos(th), s = Math.sin(th);
  return [PIV[0] + gx * c - gy * s, PIV[1] + gx * s + gy * c];
}

// 1 · la scatola (7,5–41,4)
function sceneScatola(ctx, t) {
  if (t < 7.5 || t > 42.1) return;
  const al = life(t, 7.6, 41.9, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  tavolo(ctx);
  // fino a 37 la scatola delle prove; poi una scatola nuova, inclinata fino al limite e tenuta lì
  const k1 = 1 - P(t, 37.2, 37.6), k2 = P(t, 37.5, 37.9);
  const th1 = angoloScatola(t), th2 = kf(t, [[38.1, 0], [39.6, TC]]);
  base(ctx, PIV[0] - BW * PXM * Math.cos(th1), PIV[0], P(t, 16.4, 16.9) * k1 * (th1 < Math.PI / 2 - .01 ? 1 : 0));
  const g1 = scatola(ctx, th1, P(t, 7.9, 8.5) * k1, false);
  const g2 = scatola(ctx, th2, k2, false);
  if (g1) {
    // il peso, applicato nel baricentro
    const kp = life(t, 12.2, 20.4, .5, .4) * k1;
    if (kp > 0) { freccia(ctx, g1, [g1[0], g1[1] + 120], C.y, kp); drawRich(ctx, '{my:P}', g1[0] + 22, g1[1] + 92, { size: 38, align: 'left', alpha: kp }); }
    M.dot(ctx, g1, C.v, P(t, 11.9, 12.4) * k1, 10);
    drawRich(ctx, '{mink:G}', g1[0] + 26, g1[1] - 24, { size: 40, alpha: P(t, 11.9, 12.4) * k1 });
    verticale(ctx, g1, g1[0] <= PIV[0] + .5, P(t, 20.6, 21.1) * k1);
  }
  if (g2 && k2 > 0) {
    M.dot(ctx, g2, C.v, k2, 10);
    drawRich(ctx, '{mink:G}', g2[0] - 30, g2[1] - 24, { size: 40, alpha: k2 });
    verticale(ctx, g2, true, P(t, 38.3, 38.8) * k2);
    drawRich(ctx, '{v:spigolo}', PIV[0] + 40, YT + 56, { size: 32, align: 'left', alpha: P(t, 39.6, 40.1) * k2 });
  }
  drawRich(ctx, '{v:base d’appoggio}', PIV[0] - 64, YT + 56, { size: 32, alpha: life(t, 16.5, 29.0, .4, .4) });
  const kr = life(t, 25.4, 25.4 + .5 * LENTO + .3, .2, .3) + life(t, 33.6, 33.6 + .85 * LENTO + .3, .2, .3);
  if (kr > 0) txt(ctx, 'al rallentatore', 1770, 150, { size: 30, color: C.dim, align: 'right', alpha: Math.min(1, kr) });
  ctx.restore();
}

// 2 · la torre di Pisa (41,4–52,4): alta circa 56 m, larga circa 15,5 m, 8 px per metro; pende di 4°
const TX = 960, TPX = 8, TALT = 56, TLAR = 15.5, TINC = 4 * RAD;
function torre(ctx) {
  const w = TLAR * TPX, h = TALT * TPX, ord = 8, hb = h / ord;
  ctx.save(); ctx.translate(TX, YT); ctx.rotate(TINC);
  ctx.fillStyle = css(mix(C.dim, C.paper, .8)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  // sette ordini uguali e la cella campanaria più stretta in cima
  ctx.beginPath(); ctx.rect(-w / 2, -h + hb, w, h - hb); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(-w / 2 + 14, -h, w - 28, hb); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 1; i < ord - 1; i++) { const y = -i * hb; ctx.beginPath(); ctx.moveTo(-w / 2, y); ctx.lineTo(w / 2, y); ctx.stroke(); }
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  for (let i = 1; i < ord - 1; i++) for (let k = -2; k <= 2; k++) {   // gli archetti delle logge
    const x = k * w / 6, y = -i * hb - 8;
    ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 8, y - hb + 26); ctx.arc(x, y - hb + 26, 8, Math.PI, 0); ctx.lineTo(x + 8, y); ctx.stroke();
  }
  ctx.restore();
}
function scenePisa(ctx, t) {
  if (t < 41.3 || t > 53.0) return;
  const al = life(t, 41.6, 52.8, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  tavolo(ctx);
  const w = TLAR * TPX, hg = TALT * TPX / 2;
  base(ctx, TX - w / 2, TX + w / 2, 1);
  torre(ctx);
  // la pendenza: l'asse della torre e la verticale, con l'angolo fra loro
  // sopra la cima: la verticale e il prolungamento dell'asse, e l'angolo fra loro
  const top = [TX + Math.sin(TINC) * TALT * TPX, YT - Math.cos(TINC) * TALT * TPX];
  // la verticale dal centro della base e l'asse della torre, lunghi quanto la torre: in cima lo scarto si vede
  const LV = TALT * TPX + 60, da = TALT * TPX * .62;
  dashed(ctx, [TX, YT - da], [TX, YT - LV], C.dim, 1, .9);
  dashed(ctx, [TX + Math.sin(TINC) * da, YT - Math.cos(TINC) * da], [TX + Math.sin(TINC) * LV, YT - Math.cos(TINC) * LV], C.v, 1, .9);
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(TX, YT, LV - 10, -Math.PI / 2, -Math.PI / 2 + TINC); ctx.stroke();
  drawRich(ctx, '{v:circa 4°}', TX + 56, YT - LV + 10, { size: 34, align: 'left' });
  // il baricentro (a metà altezza, per una torre uniforme) e la sua verticale
  const g = [TX + Math.sin(TINC) * hg, YT - Math.cos(TINC) * hg], kg = P(t, 45.5, 46.0);
  M.dot(ctx, g, C.v, kg, 10);
  drawRich(ctx, '{mink:G}', g[0] + 100, g[1], { size: 40, alpha: kg });
  verticale(ctx, g, true, kg);
  drawRich(ctx, '{v:base d’appoggio}', TX, YT + 56, { size: 32, alpha: P(t, 45.7, 46.2) });
  drawRich(ctx, '{dim:alta circa 56 m, larga circa 15,5 m}', 1700, 740, { size: 30, align: 'right' });
  ctx.restore();
}

// 3 · stabile, instabile, indifferente (52,4–72,6): una pallina che rotola senza strisciare, 400 px per metro
const RP = 24, RC = 300, PXP = 400;
// nella conca: ψ'' = −(5g/7ρ)·sin ψ − 2γ·ψ' (un po' di attrito la ferma), con ρ = R − r
function conca(t) {
  const T0 = 58.0, psi0 = 20 * RAD;
  if (t < T0) return kf(t, [[57.2, 0], [57.8, psi0]]);
  const w2 = 5 * G / (7 * (RC - RP) / PXP), gam = .35, dt = 1 / 400;
  let psi = psi0, om = 0;
  for (let u = T0; u < t; u += dt) { om += (-w2 * Math.sin(psi) - 2 * gam * om) * dt; psi += om * dt; }
  return psi;
}
// sulla cupola: ψ'' = (5g/7ρ)·sin ψ, con ρ = R + r; dopo una piccola spinta si allontana sempre più in fretta
function cupola(t) {
  const T0 = 65.0, psi0 = 2 * RAD;
  if (t < T0) return 0;
  const w2 = 5 * G / (7 * (RC + RP) / PXP), dt = 1 / 400;
  let psi = psi0, om = 0;
  // fino a 50°: la pallina si stacca dalla cupola verso i 54° (cos ψ = 10/17), lì smettiamo di seguirla
  for (let u = T0; u < t && psi < 50 * RAD; u += dt) { om += w2 * Math.sin(psi) * dt; psi += om * dt; }
  return Math.min(psi, 50 * RAD);
}
const PANNELLI = [
  { cx: 430, nome: '{g:stabile}', t: 61.2, nota: '{g:torna indietro}' },
  { cx: 960, nome: '{r:instabile}', t: 66.2, nota: '{r:si allontana}' },
  { cx: 1490, nome: '{v:indifferente}', t: 70.3, nota: '{v:resta dove la metti}' },
];
function pallina(ctx, x, y, al = 1) {
  M.ball(ctx, x, y, '', C.x, { r: RP, alpha: al });
}
function scenePalline(ctx, t) {
  if (t < 52.4 || t > 73) return;
  const al = life(t, 52.8, 72.8, .6, .5);
  card(ctx, 110, 110, 1700, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  PANNELLI.forEach(Pn => {
    conFont(TITOLI, () => drawRich(ctx, Pn.nome, Pn.cx, 190, { size: 40, weight: 600, alpha: P(t, Pn.t, Pn.t + .5) }));
    drawRich(ctx, Pn.nota, Pn.cx, 690, { size: 34, alpha: P(t, Pn.t + .3, Pn.t + .8) });
  });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round';
  // la conca: arco di cerchio con il centro in alto
  const c1 = [430, 600 - RC];
  ctx.beginPath(); ctx.arc(c1[0], c1[1], RC, 55 * RAD, 125 * RAD); ctx.stroke();
  const p1 = conca(t);
  pallina(ctx, c1[0] + (RC - RP) * Math.sin(p1), c1[1] + (RC - RP) * Math.cos(p1));
  // la cupola: arco con il centro in basso
  const c2 = [960, 300 + RC + RP + 200];
  ctx.beginPath(); ctx.arc(c2[0], c2[1], RC, -150 * RAD, -30 * RAD); ctx.stroke();   // ±60°: la pallina (fino a 50°) rotola sempre sulla cupola
  const p2 = cupola(t), via = 1 - P(t, 66.2, 66.4);   // arriva a 50° verso 66,3 s: lì sparisce
  // dov'era, e la strada che ha fatto
  if (p2 > 3 * RAD) {
    ctx.save(); ctx.globalAlpha *= .8; ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.arc(c2[0], c2[1] - RC - RP, RP, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(c2[0], c2[1], RC + RP + 40, -Math.PI / 2, -Math.PI / 2 + p2); ctx.stroke(); ctx.setLineDash([]);
    arrowHead(ctx, [c2[0] + (RC + RP + 40) * Math.sin(p2), c2[1] - (RC + RP + 40) * Math.cos(p2)], p2, C.x, .9);
    ctx.restore();
  }
  pallina(ctx, c2[0] + (RC + RP) * Math.sin(p2), c2[1] - (RC + RP) * Math.cos(p2), via);
  // il piano: la pallina spostata a mano resta dove la metto
  ctx.beginPath(); ctx.moveTo(1290, 560); ctx.lineTo(1690, 560); ctx.stroke();
  pallina(ctx, kf(t, [[68.7, 1450], [69.9, 1560]]), 560 - RP - 3);
  ctx.restore();
}

// 4 · in una frase (72,6–82,5)
function sceneFine(ctx, t) {
  if (t < 72.5) return;
  const al = 1 - P(t, 80.6, 81.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 72.8 });
    drawRich(ctx, 'Sta in piedi finché la verticale\ndal baricentro cade nella base.', W / 2, 290, { size: 70, weight: 600, local: t - 73.2, stagger: .09 });
  });
  const pills = [[490, 'verticale da {mink:G}\n{g:dentro} la base'], [960, 'stabile: {g:torna}\ninstabile: {r:si allontana}'], [1430, 'Pisa: circa 4°,\nancora {g:dentro}']];
  pills.forEach(([x, s], i) => {
    const a = 75.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): con la scatola il tono segue l'inclinazione (dritta .15, sul fianco 1),
  // campionata da angoloScatola() (moto vero al rallentatore); con le palline segue l'altezza della pallina (conca(), cupola())
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 7.9, .6],                                                // la scatola sul tavolo
    ['pop', 11.9, .6], ['pop', 12.2, .4], ['traccia', 16.4, 16.9],                    // il baricentro G, il peso, la base d'appoggio
    ['traccia', 20.6, 21.1], ['tono', 20.7, 22.2, [.15, .159, .221, .283, .292]],     // la verticale; la inclino di 15°
    ['tono', 25.4, 26.89, [.292, .289, .279, .262, .237, .2, .15]], ['pop', 26.89, .25],   // lasciata: torna giù
    ['tono', 29.2, 31.0, [.15, .167, .282, .398, .414]],                              // la inclino di 28°: verticale fuori
    ['tono', 33.6, 36.14, [.414, .419, .433, .46, .502, .567, .663, .805, 1]], ['pop', 36.14, .15],   // si ribalta sul fianco
    ['pop', 37.6, .5], ['tono', 38.1, 39.6, [.15, .163, .253, .343, .356]], ['pop', 39.7, .45],   // il limite: verticale sullo spigolo
    ['soffio', 41.6], ['pop', 45.5, .6], ['ding', 46.0],                              // Pisa: G, la verticale cade dentro
    ['soffio', 52.8],                                                                 // stabile, instabile, indifferente
    ['tono', 57.2, 59.58, [.2, .231, .665, .7, .596, .274, .228, .407, .423, .263, .204]],   // nella conca: torna indietro
    ['pop', 61.2, .55],                                                               // stabile
    ['tono', 65.0, 66.34, [.8, .797, .797, .787, .763, .634, .2]], ['pop', 66.2, .35],   // sulla cupola: si allontana; instabile
    ['tono', 68.7, 69.9, [.3, .3]], ['pop', 70.3, .5],                                // sul piano resta dove la metti
    ['soffio', 72.8], ['pop', 75.4, .5], ['pop', 75.9, .6], ['pop', 76.4, .7],        // in una frase
  ];
  return {
    titolo: 'Quando un corpo si ribalta', durata: 82.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.6, 'dentro o fuori la base'], [41.6, 52.5, 'la torre di Pisa'], [52.5, 72.5, 'stabile e instabile']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScatola(ctx, t); scenePisa(ctx, t); scenePalline(ctx, t); sceneFine(ctx, t); },
  };
});
