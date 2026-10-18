'use strict';
/* Perché il mare si scalda piano — Q = m·c·ΔT: con la stessa energia la sabbia sale di 25 °C, l'acqua di meno di 5;
   il calore specifico dell'acqua; acqua calda e fredda mescolate: la temperatura di equilibrio. Argomento: calore. */
CVIDEO.registra('calore/calore-specifico', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, fmtN, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [91.6, 190], [92.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [91.6, 1050], [92.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [91.6, 2.2], [92.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [91.6, 2], [92.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [91.6, -1.5], [92.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.8, 'sorpreso'], [24.0, 'neutro'],
  [31.1, 'felice'], [33.4, 'neutro'], [58.2, 'pensa'], [62.6, 'festa'], [65.0, 'neutro'], [76.2, 'felice'],
  [78.4, 'neutro'], [85.4, 'pensa'], [90.0, 'neutro'], [94.4, 'felice'],
];
const FUMETTI = [
  [2.5, 6.4, 'Perché d’estate la sabbia scotta\ne il mare no?'],
  [7.9, 12.5, 'Acqua e sabbia, 1 kg ciascuna,\na 20 °C.'],
  [12.7, 16.9, 'Due fornelli uguali danno\nla stessa energia a entrambe.'],
  [17.1, 21.6, 'Scaldo: la sabbia sale in fretta,\nl’acqua piano piano.'],
  [21.8, 26.3, 'Dopo 20 000 J: sabbia a 45 °C,\nacqua a 24,8 °C!'],
  [26.5, 30.9, 'L’acqua vuole {g:molta più energia}\nper ogni grado.'],
  [31.1, 35.5, 'Per questo d’estate la sabbia scotta\ne il mare resta fresco.'],
  [35.7, 40.0, 'Di notte la sabbia si raffredda\nin fretta, il mare piano.'],
  [40.2, 43.3, 'L’energia che serve:\n{mg:Q}{mink: = m·}{mv:c}{mink:·}{mx:ΔT}.'],
  [43.4, 47.6, '{mink:m} è la massa, {mx:ΔT} quanto\nsale la temperatura.'],
  [47.8, 52.6, '{mv:c} è il {v:calore specifico}: l’energia\nper scaldare 1 kg di 1 °C.'],
  [52.8, 56.2, 'Acqua: 4186 J/(kg·°C).\nSabbia: circa 800.'],
  [56.4, 60.6, 'Per l’acqua: 20 000 J diviso\n4186 fa circa {g:4,8 °C}.'],
  [60.8, 65.0, 'Per la sabbia: 20 000 diviso\n800 fa {g:25 °C}. Torna!'],
  [65.2, 70.0, 'Mescolo 1 kg d’acqua a 80 °C\ncon 3 kg a 20 °C.'],
  [70.2, 74.0, 'La calda cede calore,\nla fredda lo prende…'],
  [74.2, 77.8, '…finché arrivano insieme a {g:35 °C}.'],
  [78.0, 82.4, 'Calore ceduto = calore preso:\n1·4186·45 = 3·4186·15.'],
  [82.6, 86.8, 'L’equilibrio è una media\npesata con le masse.'],
  [87.0, 91.4, 'Vale per la stessa sostanza\ne senza dispersioni di calore.'],
  [94.4, 99.4, 'L’acqua ha un calore specifico grande:\nsi scalda e si raffredda piano.'],
];

// ---------- aiutanti ----------
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
const colT = tc => mix(C.x, C.y, clamp((tc - 20) / 60));   // azzurro a 20 °C, arancio a 80 °C
const titolo = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 40, weight: 600, alpha: al }));
const migliaia = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 20 000 con lo spazio
const C_ACQUA = 4186, C_SABBIA = 800;

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Perché il mare si scalda piano', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · stessa energia, gradi diversi (7.5–39.6): i fornelli danno energia a ritmo costante, la temperatura sale in linea retta
const Q = t => 20000 * P(t, 17.3, 21.5, E.lin);
const tAcqua = q => 20 + q / C_ACQUA, tSabbia = q => 20 + q / C_SABBIA;
function becher(ctx, x0, x1, sabbia, tc, t, fiamma) {
  // il contenuto
  if (sabbia) {
    ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.fillRect(x0, 340, x1 - x0, 220);
    ctx.fillStyle = css(mix(C.y, C.ink, .35), .5);
    for (let i = 0; i < 70; i++) { const x = x0 + 12 + (i * 37) % (x1 - x0 - 24), y = 352 + (i * 53) % 196; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
  } else { ctx.fillStyle = css(C.x, .25); ctx.fillRect(x0, 340, x1 - x0, 220); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, 290); ctx.lineTo(x0, 562); ctx.lineTo(x1, 562); ctx.lineTo(x1, 290); ctx.stroke();
  // il termometro: da 10 a 60 °C
  const xt = x1 - 46, yT = c => 520 - (c - 10) * 5;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(xt - 10, 255, 20, 280, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(xt, 535, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(xt, 535, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(xt - 5, yT(tc), 10, 535 - yT(tc));
  ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2;
  for (const c of [20, 30, 40, 50]) { ctx.beginPath(); ctx.moveTo(xt - 20, yT(c)); ctx.lineTo(xt - 11, yT(c)); ctx.stroke(); }
  // il fornello
  ctx.fillStyle = css(C.dim); ctx.fillRect(x0 + 30, 590, x1 - x0 - 60, 18);
  if (fiamma > 0) for (let i = 0; i < 4; i++) {
    const cx = x0 + 70 + i * (x1 - x0 - 140) / 3, hf = (22 + 5 * Math.sin(t * 17 + i * 2)) * fiamma;
    ctx.fillStyle = css(mix(C.x, C.y, .25), .85); ctx.beginPath(); ctx.moveTo(cx, 586 - hf); ctx.quadraticCurveTo(cx + 11, 582, cx, 586); ctx.quadraticCurveTo(cx - 11, 582, cx, 586 - hf); ctx.fill();
  }
}
function scenaFornelli(ctx, t) {
  if (t < 7.5 || t > 31.4) return;
  const al = P(t, 7.6, 8.3) * (1 - P(t, 30.8, 31.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  const q = Q(t), fi = P(t, 16.9, 17.3) * (1 - P(t, 21.5, 21.9));
  becher(ctx, 200, 520, false, tAcqua(q), t, fi); becher(ctx, 750, 1070, true, tSabbia(q), t, fi);
  txt(ctx, 'acqua, 1 kg', 360, 655, { size: 34, weight: 600 }); txt(ctx, 'sabbia, 1 kg', 910, 655, { size: 34, weight: 600 });
  numero(ctx, fmtN(tAcqua(q), 1) + ' °C', 430, 720, 44, C.y); numero(ctx, fmtN(tSabbia(q), 1) + ' °C', 980, 720, 44, C.y);
  const ke = P(t, 12.8, 13.3);
  drawRich(ctx, '{dim:energia data a ciascuno}', 635, 172, { size: 30, alpha: ke });
  numero(ctx, migliaia(q) + ' J', 720, 222, 44, C.g, ke);
  ctx.restore();
}
// la spiaggia, di giorno e di notte (31.1–39.6)
function scenaSpiaggia(ctx, t) {
  if (t < 30.8 || t > 40.3) return;
  const al = life(t, 31.0, 40.1, .5, .4), notte = P(t, 35.6, 36.4);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1046, 676, 20); ctx.clip();
  ctx.fillStyle = css(mix(C.x, C.paper, .78)); ctx.fillRect(112, 112, 1046, 400);
  ctx.fillStyle = css(mix(C.v, C.ink, .4), .55 * notte); ctx.fillRect(112, 112, 1046, 400);
  // il Sole, poi la Luna
  ctx.fillStyle = css(C.y, 1 - notte); ctx.beginPath(); ctx.arc(330, 230, 54, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.paper, [255, 255, 255], .5), notte); ctx.beginPath(); ctx.arc(330, 230, 44, 0, Math.PI * 2); ctx.fill();
  // la sabbia e il mare, con le onde che scorrono
  ctx.fillStyle = css(mix(C.y, C.paper, .5)); ctx.beginPath(); ctx.moveTo(112, 520); ctx.lineTo(620, 500); ctx.lineTo(760, 788); ctx.lineTo(112, 788); ctx.fill();
  ctx.fillStyle = css(C.x, .45); ctx.beginPath(); ctx.moveTo(620, 500);
  for (let x = 620; x <= 1160; x += 10) ctx.lineTo(x, 500 + 5 * Math.sin(x / 30 - t * 2));
  ctx.lineTo(1160, 788); ctx.lineTo(760, 788); ctx.closePath(); ctx.fill();
  ctx.restore();
  drawRich(ctx, '{y:sabbia: scotta}', 360, 640, { size: 40, alpha: 1 - notte });
  drawRich(ctx, '{x:mare: fresco}', 930, 640, { size: 40, alpha: 1 - notte });
  drawRich(ctx, '{x:sabbia: fredda}', 360, 640, { size: 40, alpha: notte });
  drawRich(ctx, '{y:mare: tiepido}', 930, 640, { size: 40, alpha: notte });
  conFont(TITOLI, () => { drawRich(ctx, 'di giorno', 760, 230, { size: 44, weight: 600, alpha: 1 - notte }); drawRich(ctx, 'di notte', 760, 230, { size: 44, weight: 600, alpha: notte }); });
  ctx.restore();
}
// il grafico temperatura–energia, che resta fino al conto (7.5–65.2)
const GX = q => 1300 + q * .018, GY = c => 650 - (c - 20) * 12;
function scenaGrafico(ctx, t) {
  if (t < 7.5 || t > 65.4) return;
  const al = P(t, 7.8, 8.5) * (1 - P(t, 64.8, 65.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1200, 110, 610, 680);
  titolo(ctx, 'temperatura ed energia', 1505, 165);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const c of [30, 40, 50]) { ctx.beginPath(); ctx.moveTo(GX(0), GY(c)); ctx.lineTo(GX(21000), GY(c)); ctx.stroke(); }
  for (const q of [10000, 20000]) { ctx.beginPath(); ctx.moveTo(GX(q), GY(20)); ctx.lineTo(GX(q), GY(52)); ctx.stroke(); txt(ctx, migliaia(q), GX(q), GY(20) + 30, { size: 30, color: C.dim }); }
  for (const c of [20, 30, 40, 50]) txt(ctx, String(c), GX(0) - 14, GY(c), { size: 30, color: C.dim, align: 'right' });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX(0), GY(20)); ctx.lineTo(GX(22500), GY(20)); ctx.moveTo(GX(0), GY(20)); ctx.lineTo(GX(0), GY(55)); ctx.stroke();
  arrowHead(ctx, [GX(22500) + 6, GY(20)], 0, C.ink); arrowHead(ctx, [GX(0), GY(55) - 6], -Math.PI / 2, C.ink);
  txt(ctx, 'temperatura (°C)', GX(0) + 20, GY(55), { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'energia (J)', GX(22500), GY(20) + 68, { size: 30, color: C.dim, align: 'right' });
  const q = Q(t);
  for (const [f, col, nome] of [[tAcqua, C.x, 'acqua'], [tSabbia, C.y, 'sabbia']]) {
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(GX(0), GY(20)); ctx.lineTo(GX(q), GY(f(q))); ctx.stroke(); ctx.restore();
    ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(GX(q), GY(f(q)), 9, 0, Math.PI * 2); ctx.fill();
    // il nome sopra e a destra della punta, quando le due punte sono già lontane: nessuna linea lo attraversa
    txt(ctx, nome, GX(q) + 12, GY(f(q)) - 28, { size: 32, weight: 600, color: col, align: 'left', alpha: clamp((q - 8000) / 1500) });
  }
  drawRich(ctx, '{g:+4,8 °C}', GX(20000) - 40, GY(tAcqua(20000)) - 28, { size: 32, align: 'right', alpha: P(t, 56.6, 57.1) });
  drawRich(ctx, '{g:+25 °C}', GX(20000) - 40, GY(45) - 22, { size: 32, align: 'right', alpha: P(t, 61.0, 61.5) });
  ctx.restore();
}

// 2 · il calore specifico (39.8–65.2)
function scenaFormula(ctx, t) {
  if (t < 40.0 || t > 65.4) return;
  const al = life(t, 40.2, 65.2, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  drawRich(ctx, '{mg:Q}{mink: = m·}{mv:c}{mink:·}{mx:ΔT}', 635, 200, { size: 72, local: t - 40.4 });
  drawRich(ctx, '{mg:Q}{dim:  energia (J)}', 180, 290, { size: 34, align: 'left', local: t - 41.0 });
  drawRich(ctx, '{mink:m}{dim:  massa (kg),   }{mx:ΔT}{dim:  aumento di temperatura (°C)}', 180, 340, { size: 34, align: 'left', local: t - 43.6 });
  drawRich(ctx, '{mv:c}{dim:  }{v:calore specifico}{dim:, in J/(kg·°C)}', 180, 410, { size: 36, align: 'left', local: t - 48.0 });
  riga(ctx, 'acqua', '4186 J/(kg·°C)', 485, C.v, P(t, 52.8, 53.3), 240, 1040);
  riga(ctx, 'sabbia', '≈ 800 J/(kg·°C)', 545, C.v, P(t, 53.6, 54.1), 240, 1040);
  ctx.save(); ctx.globalAlpha *= P(t, 56.4, 56.9);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(170, 590); ctx.lineTo(1100, 590); ctx.stroke();
  ctx.restore();
  drawRich(ctx, '{mx:ΔT}{mink: = }{mg:Q}{mink: / (m·}{mv:c}{mink:)}', 635, 635, { size: 40, local: t - 56.5 });
  drawRich(ctx, 'acqua:  20 000 / 4186 ≈ {g:4,8 °C}', 635, 695, { size: 38, local: t - 57.2 });
  drawRich(ctx, 'sabbia:  20 000 / 800 = {g:25 °C}', 635, 750, { size: 38, local: t - 61.0 });
  ctx.restore();
}

// 3 · acqua calda e acqua fredda (65.2–94.6): la paratia si alza e le due acque si scambiano calore;
// la differenza cala in modo esponenziale e in ogni istante 1·(80 − t₁) = 3·(t₂ − 20)
const T_VIA = 70.4, TAU = .85;
const tMix = t => { const u = t - T_VIA; if (u <= 0) return [80, 20]; const e = Math.exp(-u / TAU); return [35 + 45 * e, 35 - 15 * e]; };
function scenaMiscela(ctx, t) {
  if (t < 65.0 || t > 91.8) return;
  const al = life(t, 65.2, 91.6, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680); card(ctx, 1200, 110, 610, 680);
  // la vasca: 1 kg a sinistra, 3 kg a destra (larghezze in proporzione)
  const [t1, t2] = tMix(t), x0 = 240, xp = 440, x1 = 1040, yw = 360, yb = 620;
  const u = Math.max(0, t - T_VIA), w = 40 + 380 * (1 - Math.exp(-u / 1.4));   // la zona dove le due acque si mescolano
  const g = ctx.createLinearGradient(x0, 0, x1, 0), a = clamp((xp - w / 2 - x0) / (x1 - x0)), b = clamp((xp + w / 2 - x0) / (x1 - x0));
  g.addColorStop(0, css(colT(t1), .35)); g.addColorStop(a, css(colT(t1), .35)); g.addColorStop(b, css(colT(t2), .35)); g.addColorStop(1, css(colT(t2), .35));
  ctx.fillStyle = g; ctx.fillRect(x0, yw, x1 - x0, yb - yw);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, 320); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, 320); ctx.stroke();
  // la paratia che si alza
  const sp = 120 * P(t, 69.8, 70.5), kp = 1 - P(t, 70.2, 70.6);
  if (kp > 0) { ctx.fillStyle = css(C.dim, kp); ctx.fillRect(xp - 5, 330 - sp, 10, yb - 330); }
  drawRich(ctx, '{mink:m₁}{dim: = 1 kg,  }{mink:t₁}{dim: = 80 °C}', 340, 270, { size: 30, alpha: 1 - P(t, 69.6, 70.0) });
  drawRich(ctx, '{mink:m₂}{dim: = 3 kg,  }{mink:t₂}{dim: = 20 °C}', 740, 270, { size: 30, alpha: 1 - P(t, 69.6, 70.0) });
  numero(ctx, Math.round(t1) + ' °C', 390, 420, 46, C.ink); numero(ctx, Math.round(t2) + ' °C', 790, 420, 46, C.ink);
  // il calore passa dalla calda alla fredda, tanto più quanto è grande la differenza
  const L = 5 * (t1 - t2), kc = P(t, T_VIA, T_VIA + .3) * clamp(L / 25);
  if (kc > 0) { freccia(ctx, [xp - L / 2, 530], [xp + L / 2, 530], C.g, 8, kc); txt(ctx, 'calore', xp, 578, { size: 32, weight: 600, color: C.g, alpha: kc }); }
  drawRich(ctx, '{dim:la calda scende di }{y:45 °C}{dim:, la fredda sale di }{x:15 °C}', 640, 690, { size: 32, local: t - 78.2 });
  drawRich(ctx, '{dim:più vicina alla temperatura della massa più grande}', 640, 745, { size: 30, local: t - 82.8 });
  // i conti
  titolo(ctx, 'temperatura di equilibrio', 1505, 165);
  drawSeq(ctx, [{ num: '{mink:m₁·t₁ + m₂·t₂}', den: '{mink:m₁ + m₂}' }], 1505, 270, 44, { local: t - 74.4 });
  drawSeq(ctx, [{ num: '1·80 + 3·20', den: '1 + 3' }, '= ', { num: '140', den: '4' }, '= {g:35 °C}'], 1505, 410, 40, { local: t - 75.6 });
  ctx.save(); ctx.globalAlpha *= P(t, 78.0, 78.5);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1250, 495); ctx.lineTo(1760, 495); ctx.stroke();
  ctx.restore();
  drawRich(ctx, '{y:calore ceduto dalla calda}', 1505, 530, { size: 30, local: t - 78.2 });
  drawRich(ctx, '1·4186·45 = 188 370 J', 1505, 572, { size: 36, local: t - 78.6 });
  drawRich(ctx, '{x:calore preso dalla fredda}', 1505, 630, { size: 30, local: t - 79.6 });
  drawRich(ctx, '3·4186·15 = 188 370 J', 1505, 672, { size: 36, local: t - 80.0 });
  drawRich(ctx, '{dim:stessa sostanza, senza dispersioni}', 1505, 745, { size: 30, local: t - 87.2 });
  ctx.restore();
}

// 4 · in una frase (94.6–105)
function scenaFine(ctx, t) {
  if (t < 91.7) return;
  const al = 1 - P(t, 99.9, 100.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 91.9 });
    drawRich(ctx, 'Il calore specifico dice quanta energia\nserve per scaldare 1 kg di {g:1 °C}.', W / 2, 290, { size: 66, weight: 600, local: t - 92.3, stagger: .08 });
  });
  const pills = [[490, '{mg:Q}{mink: = m·}{mv:c}{mink:·}{mx:ΔT}'], [960, 'acqua:\n{v:4186 J/(kg·°C)}'], [1430, 'equilibrio: media\npesata con le masse']];
  pills.forEach(([x, s], i) => {
    const a = 93.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 42, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la temperatura che sale o scende
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.8, .5],                                               // i due becher, l'energia data
    ['pop', 16.9, .3], ['traccia', 17.3, 21.5],                                       // si accendono i fornelli, le rette si disegnano
    ['tono', 17.3, 21.5, [.1, .8]], ['tono', 17.3, 21.5, [.1, .2]],                   // la sabbia sale in fretta, l'acqua piano
    ['ding', 21.6],                                                                   // 45 °C contro 24,8 °C
    ['soffio', 31.0], ['tono', 35.6, 36.4, [.7, .3]],                                 // la spiaggia; il Sole tramonta, è notte
    ['soffio', 40.2], ['pop', 40.4, .6], ['pop', 41.0, .4], ['pop', 43.6, .45],       // Q = m·c·ΔT e le sue lettere
    ['pop', 48.0, .55], ['pop', 52.8, .5], ['pop', 53.6, .4],                         // il calore specifico, acqua e sabbia
    ['traccia', 56.4, 56.9], ['pop', 56.5, .5], ['ding', 57.3],                       // ΔT = Q/(m·c): acqua 4,8 °C
    ['pop', 61.4, .6],                                                                // sabbia 25 °C (il ding lo dà la faccia «festa»)
    ['soffio', 65.2], ['tono', 69.8, 70.5, [.2, .6]],                                 // la vasca; la paratia si alza
    ['tono', 70.4, 73.4, [1, .62, .43, .34, .29, .27]],                               // la calda scende verso 35 °C
    ['tono', 70.4, 73.4, [0, .13, .19, .22, .24, .24]],                               // la fredda sale verso 35 °C
    ['pop', 74.4, .5], ['ding', 76.5],                                                // la formula, = 35 °C
    ['traccia', 78.0, 78.5], ['pop', 78.6, .45], ['pop', 80.0, .5], ['ding', 80.3],   // ceduto = preso
    ['pop', 82.8, .4], ['pop', 87.2, .3],
    ['soffio', 91.9], ['pop', 92.3, .6], ['pop', 93.8, .5], ['pop', 94.3, .6], ['pop', 94.8, .7],   // in una frase
  ];
  return {
    titolo: 'Perché il mare si scalda piano', durata: 102, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.1, 'stessa energia, gradi diversi'], [40.1, 65.2, 'il calore specifico'], [65.2, 91.6, 'acqua calda e fredda']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaFornelli(ctx, t); scenaSpiaggia(ctx, t); scenaGrafico(ctx, t); scenaFormula(ctx, t); scenaMiscela(ctx, t); scenaFine(ctx, t); },
  };
});
