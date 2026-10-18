'use strict';
/* Temperatura non è calore — la scintilla a 1000 °C cede pochissima energia, la vasca tiepida tantissima; la temperatura
   è l'agitazione media delle particelle; l'equilibrio termico; il calore è energia che passa. Argomento: calore. */
CVIDEO.registra('calore/temperatura', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, arrowHead, card, crossMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [94.4, 190], [95.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [94.4, 1050], [95.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [94.4, 2.2], [95.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [94.4, 2], [95.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [94.4, -1.5], [95.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [11.8, 'sorpreso'], [14.0, 'neutro'],
  [16.2, 'pensa'], [21.2, 'felice'], [23.6, 'neutro'], [29.8, 'sorpreso'], [32.4, 'neutro'], [44.2, 'sorpreso'],
  [46.6, 'neutro'], [58.4, 'felice'], [61.0, 'neutro'], [77.0, 'festa'], [79.6, 'neutro'], [89.8, 'occhiolino'],
  [92.0, 'neutro'], [97.2, 'felice'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché la scintilla a mille gradi\nnon brucia?'],
  [7.9, 11.6, 'La scintilla di una stellina:\ncirca 1000 °C.'],
  [11.8, 16.0, 'Ma è un granello minuscolo:\ncirca 0,1 mg di metallo.'],
  [16.2, 21.0, 'Se temperatura e calore fossero\nla stessa cosa, ci brucerebbe.'],
  [21.2, 25.6, 'Invece, raffreddandosi fino a 37 °C,\ncede solo circa {g:0,04 J}.'],
  [25.8, 29.6, 'Una vasca d’acqua tiepida:\n40 °C, circa 150 kg.'],
  [29.8, 34.6, 'Scendendo a 37 °C cede quasi\n{g:2 milioni di joule}!'],
  [34.8, 39.4, 'Temperatura alta non vuol dire\ntanta energia da cedere.'],
  [39.6, 44.0, 'Dentro, le particelle si agitano\nsenza sosta.'],
  [44.2, 48.7, 'Nella scintilla si agitano di più:\nenergia cinetica media circa 4 volte.'],
  [48.8, 53.4, 'La {v:temperatura} misura l’agitazione:\nl’energia cinetica media.'],
  [53.6, 58.2, 'Nella vasca si agitano meno,\nma sono tantissime di più.'],
  [58.4, 62.8, 'Tutte insieme hanno tanta energia:\nè l’{g:energia interna}.'],
  [63.0, 67.6, 'La temperatura, in kelvin:\n{mink:T = t +} 273,15.'],
  [68.0, 72.4, 'Due blocchi uguali: uno a 80 °C,\nl’altro a 20 °C.'],
  [72.6, 76.9, 'Da solo, il {g:calore} passa\ndal più caldo al più freddo…'],
  [77.0, 81.4, '…finché le temperature sono uguali:\n50 °C. È l’{v:equilibrio termico}.'],
  [81.6, 86.2, 'Il calore è {g:energia che passa},\nper una differenza di temperatura.'],
  [86.4, 89.6, 'Si misura in joule (J).'],
  [89.8, 94.2, 'Un corpo {r:non contiene} calore:\ncontiene {g:energia interna}.'],
  [97.2, 101.8, 'La temperatura misura l’agitazione;\nil calore è energia che passa.'],
];

// ---------- aiutanti ----------
const h = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };   // numeri fissi «a caso»
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
function riga(ctx, nome, val, y, col, al, x0, x1, size = 38) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  numero(ctx, val, x1, y, size + 2, col);
  ctx.restore();
}
function freccia(ctx, a, b, col, w = 7, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, L / 26);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
// colore di una temperatura: azzurro freddo, arancio caldo (20 °C → 80 °C)
const colT = tc => mix(C.x, C.y, clamp((tc - 20) / 60));
const titolo = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 40, weight: 600, alpha: al }));

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Temperatura non è calore', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · la scintilla e la vasca (7.5–39.6)
const PUNTA = [520, 320], SCALA = 260;   // 260 px = 1 m
function stellina(ctx, t) {
  // il filo della stellina e la punta che brucia
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(300, 560); ctx.lineTo(PUNTA[0], PUNTA[1]); ctx.stroke();
  const g = ctx.createRadialGradient(PUNTA[0], PUNTA[1], 0, PUNTA[0], PUNTA[1], 46);
  g.addColorStop(0, css(mix(C.y, [255, 255, 255], .6), .95)); g.addColorStop(1, css(C.y, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(PUNTA[0], PUNTA[1], 46, 0, Math.PI * 2); ctx.fill();
  // le scintille: proiettili veri, con g = 9,8 m/s², che si spengono in mezzo secondo
  for (let i = 0; i < 70; i++) {
    const per = .45 + .25 * h(i, 1), u = t + h(i, 2) * per, n = Math.floor(u / per), tau = u - n * per, vita = per * .9;
    if (tau > vita) continue;
    const th = h(i * 31 + n, 3) * Math.PI * 2, v = .8 + 1.4 * h(i * 17 + n, 4);
    const pos = s => [PUNTA[0] + v * Math.cos(th) * s * SCALA, PUNTA[1] - v * Math.sin(th) * s * SCALA + .5 * 9.8 * SCALA * s * s];
    const a = pos(Math.max(0, tau - .05)), b = pos(tau), k = 1 - tau / vita;
    ctx.strokeStyle = css(mix(C.y, [255, 200, 60], .35), k); ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
}
function vasca(ctx, t) {
  const x0 = 1110, x1 = 1690, y0 = 240, y1 = 500, pelo = 300;
  ctx.fillStyle = css(C.x, .22);
  ctx.beginPath(); ctx.moveTo(x0 + 6, pelo);
  for (let x = x0 + 6; x <= x1 - 6; x += 10) ctx.lineTo(x, pelo + 3 * Math.sin(x / 38 + t * 1.6));
  ctx.lineTo(x1 - 6, y1 - 40); ctx.quadraticCurveTo(x1 - 6, y1, x1 - 46, y1); ctx.lineTo(x0 + 46, y1); ctx.quadraticCurveTo(x0 + 6, y1, x0 + 6, y1 - 40);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0 - 20, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y1 - 46); ctx.quadraticCurveTo(x0, y1 + 6, x0 + 46, y1 + 6);
  ctx.lineTo(x1 - 46, y1 + 6); ctx.quadraticCurveTo(x1, y1 + 6, x1, y1 - 46); ctx.lineTo(x1, y0); ctx.lineTo(x1 + 20, y0); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0 + 70, y1 + 8); ctx.lineTo(x0 + 60, y1 + 34); ctx.moveTo(x1 - 70, y1 + 8); ctx.lineTo(x1 - 60, y1 + 34); ctx.stroke();
}
function scenaConfronto(ctx, t) {
  if (t < 7.5 || t > 39.8) return;
  const al = 1 - P(t, 39.0, 39.6);
  ctx.save(); ctx.globalAlpha *= al;
  // la scintilla
  const ka = P(t, 7.6, 8.3);
  card(ctx, 110, 110, 830, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  titolo(ctx, 'scintilla', 525, 165);
  ctx.save(); ctx.beginPath(); ctx.roundRect(116, 236, 818, 330, 10); ctx.clip(); stellina(ctx, t); ctx.restore();
  drawRich(ctx, '{dim:energia ceduta raffreddandosi fino a 37 °C}', 525, 212, { size: 30, alpha: P(t, 21.6, 22.1) });
  const enfasi = life(t, 34.8, 39.4, .4, .4);
  riga(ctx, 'temperatura', '≈ 1000 °C', 610, C.y, P(t, 8.2, 8.7), 170, 880);
  riga(ctx, 'massa', '≈ 0,1 mg', 675, C.ink, P(t, 12.0, 12.5), 170, 880);
  riga(ctx, 'energia ceduta', '≈ 0,04 J', 740, C.g, P(t, 21.6, 22.1), 170, 880, 38 + 4 * enfasi);
  ctx.restore();
  // l'idea sbagliata, in rosso, finché la misura non la smentisce
  const kh = life(t, 16.4, 25.6, .4, .5);
  if (kh > 0) {
    card(ctx, 990, 250, 820, 330, kh);
    ctx.save(); ctx.globalAlpha *= kh;
    drawRich(ctx, '{r:temperatura alta = tanto calore?}', 1400, 350, { size: 44, local: t - 16.6 });
    drawRich(ctx, '{r:allora la scintilla brucerebbe}', 1400, 430, { size: 36, local: t - 17.6 });
    crossMark(ctx, 1400, 527, P(t, 21.8, 22.6), C.r, .65);
    ctx.restore();
  }
  // la vasca
  const kv = P(t, 25.8, 26.5);
  if (kv > 0) {
    card(ctx, 980, 110, 830, 680, kv);
    ctx.save(); ctx.globalAlpha *= kv;
    titolo(ctx, 'vasca', 1395, 165);
    drawRich(ctx, '{dim:energia ceduta raffreddandosi fino a 37 °C}', 1395, 212, { size: 30, alpha: P(t, 30.0, 30.5) });
    vasca(ctx, t);
    riga(ctx, 'temperatura', '40 °C', 610, C.y, 1, 1040, 1750);
    riga(ctx, 'massa', '≈ 150 kg', 675, C.ink, P(t, 26.4, 26.9), 1040, 1750);
    riga(ctx, 'energia ceduta', '≈ 1 900 000 J', 740, C.g, P(t, 30.0, 30.5), 1040, 1750, 38 + 4 * enfasi);
    ctx.restore();
  }
  ctx.restore();
}

// 2 · le particelle (39.6–67.8)
// ogni particella vibra attorno al suo posto. L'energia cinetica media va come T (in kelvin): 1273 K contro 313 K,
// circa 4 volte, quindi ampiezza circa doppia; ma gli atomi di ferro pesano circa 3 volte le molecole d'acqua e la
// loro velocità media è solo circa 1,15 volte: oscillano più larghi e più lenti (frequenza per 1,15 / 2)
const A0 = 6, K_SC = Math.sqrt(1273.15 / 313.15), F_SC = 1.15 / K_SC;
function agita(i, t, amp, fs = 1) {
  const wx = (10 + 4 * h(i, 5)) * fs, wy = (11 + 4 * h(i, 6)) * fs, fx = h(i, 7) * 6.28, fy = h(i, 8) * 6.28;
  return [amp * (.7 * Math.sin(wx * t + fx) + .3 * Math.sin(1.7 * wx * t + fy)), amp * (.7 * Math.sin(wy * t + fy) + .3 * Math.sin(1.6 * wy * t + fx))];
}
function scenaParticelle(ctx, t) {
  if (t < 39.4 || t > 68.0) return;
  const al = life(t, 39.6, 67.8, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 570, 680); card(ctx, 710, 110, 570, 680);
  titolo(ctx, 'la scintilla, tutta', 395, 165);
  titolo(ctx, 'un pezzetto di vasca', 995, 165);
  // la scintilla: un granello di 4 per 4 atomi, molto agitati
  for (let i = 0; i < 16; i++) {
    const [dx, dy] = agita(i, t, A0 * K_SC, F_SC), x = 290 + (i % 4) * 70 + dx, y = 300 + Math.floor(i / 4) * 70 + dy;
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
  }
  // la vasca: le molecole riempiono tutto il riquadro (la vasca continua fuori), si agitano meno e scorrono piano
  ctx.save(); ctx.beginPath(); ctx.rect(740, 210, 510, 400); ctx.clip();
  ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.strokeRect(742, 212, 506, 396); ctx.setLineDash([]);
  for (let i = 0; i < 80; i++) {
    const c = i % 10, r = Math.floor(i / 10), [dx, dy] = agita(i + 40, t, A0);
    const x = 752 + c * 52 + (r % 2) * 26 + 5 * Math.sin(.45 * t + 6.28 * h(i, 9)) + dx, y = 226 + r * 52 + 5 * Math.cos(.38 * t + 6.28 * h(i, 10)) + dy;
    ctx.fillStyle = css(C.x, .75); ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  drawRich(ctx, '{dim:pochissime particelle}', 395, 660, { size: 32, alpha: P(t, 53.8, 54.3) });
  drawRich(ctx, '{dim:tantissime particelle}', 995, 660, { size: 32, alpha: P(t, 53.8, 54.3) });
  // le temperature, poi anche in kelvin
  const kK = P(t, 63.2, 63.8);
  // il valore in °C resta fermo; il valore in kelvin si aggiunge accanto
  drawRich(ctx, '{y:1000 °C}', 380, 730, { size: 40, align: 'right' });
  drawRich(ctx, '{y:40 °C}', 980, 730, { size: 40, align: 'right' });
  drawRich(ctx, '{dim:≈ }{v:1273 K}', 396, 730, { size: 40, align: 'left', alpha: kK });
  drawRich(ctx, '{dim:≈ }{v:313 K}', 996, 730, { size: 40, align: 'left', alpha: kK });
  // la scheda delle parole nuove
  const kc = P(t, 48.8, 49.4);
  if (kc > 0) {
    card(ctx, 1310, 110, 500, 680, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, '{v:temperatura}', 1560, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:quanto si agitano}\n{dim:le particelle:}', 1560, 255, { size: 32, local: t - 49.2 });
    drawRich(ctx, '{v:energia cinetica media}', 1560, 335, { size: 34, local: t - 50.4 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 58.4, 58.9);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1350, 380); ctx.lineTo(1770, 380); ctx.stroke();
    conFont(TITOLI, () => drawRich(ctx, '{g:energia interna}', 1560, 430, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:l’energia di tutte}\n{dim:le particelle insieme}', 1560, 510, { size: 32, local: t - 58.8 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 63.0, 63.5);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1350, 575); ctx.lineTo(1770, 575); ctx.stroke();
    drawRich(ctx, '{mink:T = t +} 273,15', 1560, 630, { size: 46, local: t - 63.2 });
    drawRich(ctx, '{mink:T}{dim: in kelvin (K), }{mink:t}{dim: in °C}', 1560, 695, { size: 30, local: t - 64.2 });
    drawRich(ctx, '{dim:1 °C di differenza = 1 K}', 1560, 745, { size: 30, local: t - 65.0 });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · l'equilibrio termico (67.8–94.4): due blocchi uguali, la differenza cala in modo esponenziale (legge di Newton)
const T_CONT = 73.4, TAU = .85;
const tBlocchi = t => { const u = t - T_CONT; if (u <= 0) return [80, 20]; const d = 30 * Math.exp(-u / TAU); return [50 + d, 50 - d]; };
function blocco(ctx, x, tc, i0, t) {
  ctx.fillStyle = css(colT(tc), .3); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.rect(x, 300, 300, 240); ctx.fill(); ctx.stroke();
  const amp = A0 * Math.sqrt((tc + 273.15) / 293.15);
  for (let i = 0; i < 12; i++) {
    const [dx, dy] = agita(i0 + i, t, amp);
    ctx.fillStyle = css(colT(tc), .8); ctx.beginPath(); ctx.arc(x + 50 + (i % 4) * 67 + dx, 360 + Math.floor(i / 4) * 60 + dy, 14, 0, Math.PI * 2); ctx.fill();
  }
  numero(ctx, Math.round(tc) + ' °C', x + 210, 255, 48, C.ink);
}
function scenaEquilibrio(ctx, t) {
  if (t < 67.6 || t > 94.6) return;
  const al = life(t, 67.8, 94.4, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680); card(ctx, 1200, 110, 610, 680);
  const [tA, tB] = tBlocchi(t), s = 40 * P(t, 72.8, T_CONT);
  blocco(ctx, 295 + s, tA, 100, t); blocco(ctx, 675 - s, tB, 120, t);
  // la freccia del calore, lunga quanto la differenza di temperatura
  const L = 6 * (tA - tB), kc = P(t, T_CONT, T_CONT + .3) * clamp(L / 30);
  if (kc > 0) {
    freccia(ctx, [635 - L / 2, 600], [635 + L / 2, 600], C.g, 8, kc);
    txt(ctx, 'calore', 635, 645, { size: 34, weight: 600, color: C.g, alpha: kc });
  }
  drawRich(ctx, '{g:calore}{dim: = energia che passa dal più caldo al più freddo}', 635, 700, { size: 32, local: t - 81.8 });
  const kj = life(t, 86.6, 90.0, .4, .4), ki = P(t, 90.0, 90.5);
  drawRich(ctx, '{dim:si misura in joule (J)}', 635, 750, { size: 32, alpha: kj, local: t - 86.6 });
  drawRich(ctx, '{dim:un corpo }{r:non contiene}{dim: calore: ha }{g:energia interna}', 635, 750, { size: 32, alpha: ki, local: t - 90.0 });
  // il grafico delle due temperature
  conFont(TITOLI, () => drawRich(ctx, 'le due temperature', 1505, 165, { size: 38, weight: 600 }));
  const X = u => 1300 + (u + 1) * 460 / 7, Y = c => 680 - c * 4.4;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const c of [20, 50, 80]) { ctx.beginPath(); ctx.moveTo(1300, Y(c)); ctx.lineTo(1760, Y(c)); ctx.stroke(); txt(ctx, c + ' °C', 1288, Y(c), { size: 30, color: C.dim, align: 'right' }); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(1300, 700); ctx.lineTo(1300, 230); ctx.moveTo(1300, 680); ctx.lineTo(1770, 680); ctx.stroke();
  arrowHead(ctx, [1776, 680], 0, C.ink); arrowHead(ctx, [1300, 224], -Math.PI / 2, C.ink);
  txt(ctx, 'tempo', 1760, 715, { size: 30, color: C.dim, align: 'right' });
  const uN = clamp(t - T_CONT, -1, 6);
  for (const [k, col] of [[0, C.y], [1, C.x]]) {
    ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= 80; i++) { const u = lerp(-1, uN, i / 80), v = tBlocchi(u + T_CONT)[k]; i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)); }
    ctx.stroke();
    const v = tBlocchi(uN + T_CONT)[k]; ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(X(uN), Y(v), 9, 0, Math.PI * 2); ctx.fill();
  }
  if (t > 77.0) drawRich(ctx, '{g:equilibrio}', X(4.2), Y(50) - 34, { size: 32, local: t - 77.2 });
  ctx.restore();
}

// 4 · in una frase (94.4–104.5)
function scenaFine(ctx, t) {
  if (t < 94.5) return;
  const al = 1 - P(t, 102.4, 103.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.7 });
    drawRich(ctx, 'La temperatura misura l’agitazione;\nil calore è {g:energia che passa}.', W / 2, 290, { size: 68, weight: 600, local: t - 95.1, stagger: .09 });
  });
  const pills = [[490, '{y:temperatura}\nin °C o in K'], [960, '{g:calore}: energia\nche passa, in J'], [1430, '{v:equilibrio}:\nstessa temperatura']];
  pills.forEach(([x, s], i) => {
    const a = 96.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue le temperature dei due blocchi che vanno all'equilibrio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .5], ['pop', 12.0, .3],                             // la scintilla: 1000 °C, 0,1 mg
    ['soffio', 16.4], ['pop', 16.6, .45], ['pop', 17.6, .35],                         // l'idea sbagliata
    ['pop', 21.6, .2], ['traccia', 21.8, 22.6],                                       // cede solo 0,04 J: la croce
    ['soffio', 25.8], ['pop', 26.4, .4],                                              // la vasca, 150 kg
    ['pop', 30.0, .8], ['ding', 30.3],                                                // quasi 2 milioni di joule
    ['soffio', 39.6],                                                                 // le particelle
    ['soffio', 48.8], ['pop', 49.2, .45], ['pop', 50.4, .5],                          // la temperatura: energia cinetica media
    ['pop', 53.8, .4],                                                                // poche, tantissime
    ['traccia', 58.4, 58.9], ['pop', 58.4, .6],                                       // l'energia interna
    ['traccia', 63.0, 63.5], ['pop', 63.2, .5], ['pop', 64.2, .35],                   // T = t + 273,15, i kelvin
    ['soffio', 67.8], ['pop', 73.4, .5],                                              // i due blocchi, a contatto
    ['tono', 73.4, 76.4, [.9, .7, .6, .55, .52, .51]],                                // il caldo scende verso 50 °C
    ['tono', 73.4, 76.4, [.1, .3, .4, .45, .48, .49]],                                // il freddo sale verso 50 °C
    ['traccia', 73.4, 76.4],                                                          // le due curve nel grafico
    ['pop', 81.8, .5], ['pop', 86.6, .35], ['pop', 90.0, .45],                        // il calore: energia che passa, in joule
    ['soffio', 94.7], ['pop', 95.1, .6], ['pop', 96.6, .5], ['pop', 97.1, .6], ['pop', 97.6, .7],   // in una frase
  ];
  return {
    titolo: 'Temperatura non è calore', durata: 104.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.6, 'scintilla e vasca'], [39.6, 67.8, 'le particelle'], [67.8, 94.4, 'l’equilibrio termico']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaConfronto(ctx, t); scenaParticelle(ctx, t); scenaEquilibrio(ctx, t); scenaFine(ctx, t); },
  };
});
