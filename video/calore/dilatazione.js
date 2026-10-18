'use strict';
/* I binari che si allungano — dilatazione lineare ΔL = λ·L₀·ΔT: il giunto del binario, il giunto a pettine del ponte;
   l'acqua che fra 0 e 4 °C si contrae e il lago che gela dalla superficie. Argomento: calore. */
CVIDEO.registra('calore/dilatazione', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [97.0, 190], [98.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [97.0, 1050], [98.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [97.0, 2.2], [98.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [97.0, 2], [98.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [97.0, -1.5], [98.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'freddo'], [12.5, 'neutro'], [21.8, 'sorpreso'],
  [24.0, 'neutro'], [26.4, 'pensa'], [30.9, 'neutro'], [47.2, 'felice'], [49.6, 'neutro'], [65.6, 'pensa'],
  [70.2, 'sorpreso'], [72.4, 'neutro'], [74.6, 'felice'], [76.8, 'neutro'], [86.8, 'freddo'], [91.4, 'felice'],
  [93.6, 'neutro'], [99.6, 'felice'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché fra un binario e l’altro\nc’è uno spazio vuoto?'],
  [7.9, 12.3, 'Un binario d’acciaio di 30 m,\nin inverno: 0 °C.'],
  [12.5, 17.1, 'Qui accanto, ingrandito:\nfra due binari ci sono 2 cm.'],
  [17.3, 21.6, 'Arriva l’estate: il binario\nsi scalda fino a 40 °C…'],
  [21.8, 26.2, '…e si allunga di circa 1,4 cm:\nlo spazio si stringe!'],
  [26.4, 30.7, 'Senza quello spazio, il binario\nspingerebbe e si piegherebbe.'],
  [30.9, 34.2, 'Quanto si allunga?\n{mg:ΔL}{mink: = λ·L₀·}{mx:ΔT}'],
  [34.4, 38.8, '{mink:L₀} è la lunghezza iniziale,\n{mx:ΔT} l’aumento di temperatura.'],
  [39.0, 43.4, '{mink:λ} è il coefficiente di dilatazione\nlineare: dipende dal materiale.'],
  [43.6, 47.0, 'Per l’acciaio {mink:λ} ≈ 1,2·10⁻⁵ 1/°C.'],
  [47.2, 51.6, 'Il conto: {mg:ΔL} ≈ 0,0144 m,\ncioè circa {g:1,4 cm}.'],
  [51.8, 56.2, 'Il grafico è una retta: con metà\n{mx:ΔT}, metà allungamento.'],
  [56.4, 60.8, 'Un ponte d’acciaio di 100 m,\nfra inverno ed estate…'],
  [61.0, 65.4, '…6 cm in più: il giunto\na pettine lo lascia scorrere.'],
  [65.6, 70.0, 'Quasi tutto, scaldandosi, si dilata.\nL’acqua, a volte, no!'],
  [70.2, 74.4, 'Scaldandosi da 0 a 4 °C\nsi {r:contrae}: la densità sale.'],
  [74.6, 78.4, 'A 4 °C l’acqua è più densa che mai.'],
  [78.6, 82.2, 'Oltre i 4 °C torna\na dilatarsi.'],
  [82.4, 86.6, 'D’inverno l’acqua a 4 °C,\npiù densa, va sul fondo…'],
  [86.8, 91.2, '…e il lago gela dalla superficie:\nil ghiaccio, meno denso, galleggia.'],
  [91.4, 96.6, 'Così sotto il ghiaccio l’acqua\nresta liquida: sul fondo, 4 °C.'],
  [99.6, 104.6, 'Scaldandosi i corpi si allungano:\n{mg:ΔL}{mink: = λ·L₀·}{mx:ΔT}.'],
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
const titolo = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 40, weight: 600, alpha: al }));
const LAMBDA = 1.2e-5;
const segno = v => (v < 0 ? '−' : '') + Math.abs(v);

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'I binari che si allungano', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · il binario (7.5–31): 30 m = 1440 px (48 px/m); nell'ingrandimento 1 cm = 40 px
const tBinario = t => 40 * P(t, 17.6, 21.6, E.lin);       // la temperatura sale piano, a ritmo costante
const dLcm = tc => LAMBDA * 30 * tc * 100;                 // l'allungamento in cm, dalla legge
function rotaia(ctx, x0, x1, y, hh) {   // il binario visto di fianco: il fungo chiaro sopra, l'anima sotto
  ctx.fillStyle = css(mix(C.dim, C.paper, .25)); ctx.fillRect(x0, y, x1 - x0, hh);
  ctx.fillStyle = css(mix(C.dim, C.paper, .6)); ctx.fillRect(x0, y, x1 - x0, hh * .3);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.strokeRect(x0, y, x1 - x0, hh);
}
function scenaBinario(ctx, t) {
  if (t < 7.5 || t > 31.2) return;
  const al = P(t, 7.6, 8.3) * (1 - P(t, 30.6, 31.2));
  ctx.save(); ctx.globalAlpha *= al;
  const tc = tBinario(t), tq = Math.round(tc), dl = dLcm(tq);
  // il binario intero: l'allungamento, a questa scala, è meno di un pixel
  card(ctx, 110, 110, 1700, 290);
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 286, 20); ctx.clip();
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, 318); ctx.lineTo(1808, 318); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .55));
  for (let m = 0; m <= 33; m++) { const x = 190 + m * 48 + 6; ctx.fillRect(x - 13, 296, 26, 20); }   // le traversine
  rotaia(ctx, 190, 1630, 262, 34); rotaia(ctx, 1631, 1830, 262, 34);
  ctx.restore();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(205, 279, 7, 0, Math.PI * 2); ctx.fill();
  txt(ctx, 'fissato qui', 205, 350, { size: 30, color: C.dim });
  // la quota: 30 m
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(190, 205); ctx.lineTo(1630, 205); ctx.moveTo(190, 192); ctx.lineTo(190, 218); ctx.moveTo(1630, 192); ctx.lineTo(1630, 218); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.fillRect(850, 185, 120, 40); txt(ctx, '30 m', 910, 205, { size: 34, weight: 600 });
  // la lente sul giunto
  const kl = P(t, 12.6, 13.2);
  if (kl > 0) {
    ctx.save(); ctx.globalAlpha *= kl;
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1631, 279, 38, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([9, 9]); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(1605, 307); ctx.lineTo(970, 440); ctx.moveTo(1657, 307); ctx.lineTo(1800, 440); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
  // l'idea sbagliata: niente spazio, il binario si inarca
  const kr = life(t, 26.6, 30.7, .4, .4);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath();
    for (let x = 1150; x <= 1630; x += 8) { const y = 262 - 48 * Math.sin(Math.PI * (x - 1150) / 480) ** 2; x === 1150 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke(); ctx.setLineDash([]);
    drawRich(ctx, '{r:senza spazio si piegherebbe}', 1390, 150, { size: 32 });
    ctx.restore();
  }
  // i numeri
  card(ctx, 110, 430, 810, 360);
  titolo(ctx, 'binario d’acciaio', 515, 482);
  riga(ctx, 'lunghezza', '30 m', 565, C.ink, 1, 170, 860);
  riga(ctx, 'temperatura', tq + ' °C', 635, C.y, 1, 170, 860);
  riga(ctx, 'allungamento', fmtN(dl, 2) + ' cm', 705, C.g, P(t, 17.4, 17.9), 170, 860);
  // il giunto, ingrandito
  card(ctx, 960, 430, 850, 360, kl);
  if (kl > 0) {
    ctx.save(); ctx.globalAlpha *= kl;
    titolo(ctx, 'il giunto, ingrandito', 1385, 482);
    ctx.save(); ctx.beginPath(); ctx.rect(964, 520, 842, 140); ctx.clip();
    const xL = 1345 + 40 * dl;
    rotaia(ctx, 940, xL, 560, 70); rotaia(ctx, 1425, 1830, 560, 70);
    ctx.restore();
    // lo spazio che resta
    const sp = 2 - dl;
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xL, 668); ctx.lineTo(1425, 668); ctx.moveTo(xL, 656); ctx.lineTo(xL, 680); ctx.moveTo(1425, 656); ctx.lineTo(1425, 680); ctx.stroke();
    drawRich(ctx, '{dim:spazio}', 1060, 700, { size: 30 });
    numero(ctx, fmtN(sp, 2) + ' cm', 1385 + 140, 710, 40, C.x);
    // il righello: 1 cm
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1660, 752); ctx.lineTo(1700, 752); ctx.moveTo(1660, 744); ctx.lineTo(1660, 760); ctx.moveTo(1700, 744); ctx.lineTo(1700, 760); ctx.stroke();
    txt(ctx, '1 cm', 1716, 752, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// 2 · la legge (31–56.2)
const GX = dt => 1170 + dt * 13, GY = cm => 650 - cm * 250;   // grafico ΔL–ΔT: 13 px per °C, 250 px per cm
function scenaLegge(ctx, t) {
  if (t < 30.7 || t > 56.4) return;
  const al = life(t, 30.9, 56.2, .6, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 900, 680); card(ctx, 1050, 110, 760, 680);
  drawRich(ctx, '{mg:ΔL}{mink: = λ·L₀·}{mx:ΔT}', 560, 200, { size: 64, local: t - 31.0 });
  riga(ctx, '{mink:L₀}{dim:  lunghezza iniziale}', '30 m', 300, C.ink, P(t, 34.6, 35.1), 170, 950, 36);
  riga(ctx, '{mx:ΔT}{dim:  aumento di temperatura}', '40 °C', 365, C.x, P(t, 35.6, 36.1), 170, 950, 36);
  drawRich(ctx, '{mink:λ}{dim:  coefficiente di dilatazione lineare}', 170, 440, { size: 36, align: 'left', local: t - 39.2 });
  drawRich(ctx, '{dim:dipende dal materiale, si misura in 1/°C}', 170, 492, { size: 30, align: 'left', local: t - 40.4 });
  drawRich(ctx, '{dim:acciaio:  }{mink:λ ≈ 1,2·10⁻⁵} 1/°C', 170, 570, { size: 40, align: 'left', local: t - 43.8 });
  ctx.save(); ctx.globalAlpha *= P(t, 47.2, 47.7);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(160, 615); ctx.lineTo(960, 615); ctx.stroke();
  ctx.restore();
  drawRich(ctx, '{mg:ΔL}{mink: = 1,2·10⁻⁵} 1/°C · 30 m · 40 °C', 560, 665, { size: 38, local: t - 47.4 });
  drawRich(ctx, '≈ 0,0144 m ≈ {g:1,4 cm}', 560, 735, { size: 46, local: t - 48.6 });
  // il grafico: una retta per l'origine
  conFont(TITOLI, () => drawRich(ctx, 'l’allungamento del binario', 1430, 165, { size: 36, weight: 600 }));
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const c of [.5, 1, 1.5]) { ctx.beginPath(); ctx.moveTo(GX(0), GY(c)); ctx.lineTo(GX(45), GY(c)); ctx.stroke(); txt(ctx, fmtN(c, 1), GX(0) - 14, GY(c), { size: 30, color: C.dim, align: 'right' }); }
  for (const d of [10, 20, 30, 40]) { ctx.beginPath(); ctx.moveTo(GX(d), GY(0)); ctx.lineTo(GX(d), GY(1.6)); ctx.stroke(); txt(ctx, String(d), GX(d), GY(0) + 30, { size: 30, color: C.dim }); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX(0), GY(0)); ctx.lineTo(GX(47), GY(0)); ctx.moveTo(GX(0), GY(0)); ctx.lineTo(GX(0), GY(1.72)); ctx.stroke();
  arrowHead(ctx, [GX(47) + 6, GY(0)], 0, C.ink); arrowHead(ctx, [GX(0), GY(1.72) - 6], -Math.PI / 2, C.ink);
  drawRich(ctx, '{mx:ΔT}{dim: (°C)}', GX(47) - 10, GY(0) + 68, { size: 32, align: 'right' });
  drawRich(ctx, '{mg:ΔL}{dim: (cm)}', GX(0) + 22, GY(1.72), { size: 32, align: 'left' });
  const kr = P(t, 47.4, 48.6);
  if (kr > 0) {
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(GX(0), GY(0)); ctx.lineTo(GX(40 * kr), GY(dLcm(40 * kr))); ctx.stroke(); ctx.restore();
    ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(GX(40 * kr), GY(dLcm(40 * kr)), 10, 0, Math.PI * 2); ctx.fill();
    drawRich(ctx, '1,44 cm', GX(40) - 20, GY(1.44) - 40, { size: 32, align: 'right', alpha: P(t, 48.6, 49.0) });
  }
  // metà ΔT, metà allungamento
  const km = P(t, 52.0, 52.5);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km;
    ctx.strokeStyle = css(C.x, .85); ctx.lineWidth = 3; ctx.setLineDash([9, 9]);
    ctx.beginPath(); ctx.moveTo(GX(20), GY(0)); ctx.lineTo(GX(20), GY(.72)); ctx.lineTo(GX(0), GY(.72)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(GX(20), GY(.72), 10, 0, Math.PI * 2); ctx.fill();
    drawRich(ctx, '0,72 cm', GX(20) + 20, GY(.72) + 36, { size: 32, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · il ponte (56.2–65.6): giunto a pettine visto dall'alto, in scala (1 cm = 10 px)
const tPonte = t => kf(t, [[56.6, -10], [57.4, -10], [60.4, 40]]);   // poi resta a 40 °C mentre Stilla dice «6 cm in più»
function scenaPonte(ctx, t) {
  if (t < 56.0 || t > 65.8) return;
  const al = life(t, 56.2, 65.6, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  titolo(ctx, 'il giunto a pettine di un ponte, visto dall’alto', 960, 152);
  const tc = Math.round(tPonte(t)), dx = 1000 * LAMBDA * 100 * (tc + 10);   // in metri per 1000 px
  const xe = 760 + dx;
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 20); ctx.clip();
  // la strada del ponte (si muove) e la spalla (ferma), con i denti che si incastrano
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(100, 240); ctx.lineTo(xe, 240);
  for (let k = 0; k < 5; k++) { const y = 262 + k * 80; ctx.lineTo(xe, y); ctx.lineTo(xe + 230, y); ctx.lineTo(xe + 230, y + 36); ctx.lineTo(xe, y + 36); }
  ctx.lineTo(xe, 660); ctx.lineTo(100, 660); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .7));
  ctx.beginPath(); ctx.moveTo(1830, 240); ctx.lineTo(1250, 240);
  for (let k = 0; k < 5; k++) { const y = 320 + k * 80; ctx.lineTo(1250, y - 18); ctx.lineTo(940, y - 18); ctx.lineTo(940, y + 18); ctx.lineTo(1250, y + 18); }
  ctx.lineTo(1250, 660); ctx.lineTo(1830, 660); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  txt(ctx, 'ponte: si allunga e si accorcia', 420, 450, { size: 32, weight: 600 });
  txt(ctx, 'spalla: ferma', 1540, 450, { size: 32, weight: 600 });
  riga(ctx, 'temperatura', segno(tc) + ' °C', 720, C.y, 1, 200, 760);
  riga(ctx, 'allungamento da −10 °C', fmtN((tc + 10) * LAMBDA * 100 * 100, 1) + ' cm', 720, C.g, 1, 1060, 1720);
  drawRich(ctx, '{mg:ΔL}{mink: = 1,2·10⁻⁵} 1/°C · 100 m · 50 °C = {g:6 cm}', 960, 208, { size: 40, local: t - 61.2 });
  ctx.restore();
}

// 4 · l'acqua al contrario (65.6–96.8): densità vera dell'acqua (kg/m³) da 0 a 10 °C, grado per grado
const DENS = [999.8395, 999.8985, 999.9399, 999.9642, 999.9720, 999.9638, 999.9402, 999.9015, 999.8482, 999.7808, 999.6996];
function dens(tc) {   // interpolazione di Catmull–Rom fra i valori della tabella
  const i = clamp(Math.floor(tc), 0, 9), u = tc - i, p = k => k < 0 ? 2 * DENS[0] - DENS[1] : k > 10 ? 2 * DENS[10] - DENS[9] : DENS[k];
  const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
  return p1 + .5 * u * (p2 - p0 + u * (2 * p0 - 5 * p1 + 4 * p2 - p3 + u * (3 * (p1 - p2) + p3 - p0)));
}
const DX = tc => 250 + tc * 78, DY = d => 690 - (d - 999.65) * 1100;
const tAcqua = t => kf(t, [[70.4, 0], [74.2, 4], [78.8, 4], [82.0, 10]]);
function scenaAcqua(ctx, t) {
  if (t < 65.4 || t > 97.0) return;
  const al = life(t, 65.6, 96.8, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1000, 680);
  conFont(TITOLI, () => drawRich(ctx, 'densità dell’acqua', 610, 165, { size: 38, weight: 600 }));
  drawRich(ctx, '{dim:kg/m³ — l’asse verticale non parte da zero}', 610, 208, { size: 30 });
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (const d of [999.7, 999.8, 999.9, 1000]) { ctx.beginPath(); ctx.moveTo(DX(0), DY(d)); ctx.lineTo(DX(10.3), DY(d)); ctx.stroke(); txt(ctx, fmtN(d, 2), DX(0) - 14, DY(d), { size: 30, color: C.dim, align: 'right' }); }
  for (let c = 1; c <= 10; c++) { ctx.beginPath(); ctx.moveTo(DX(c), DY(999.65)); ctx.lineTo(DX(c), DY(1000.02)); ctx.stroke(); if (c % 2 === 0 || c === 4) txt(ctx, String(c), DX(c), DY(999.65) + 30, { size: 30, color: c === 4 ? C.x : C.dim, weight: c === 4 ? 600 : 500 }); }
  txt(ctx, '0', DX(0), DY(999.65) + 30, { size: 30, color: C.dim });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(DX(0), DY(999.65)); ctx.lineTo(DX(10.6), DY(999.65)); ctx.moveTo(DX(0), DY(999.65)); ctx.lineTo(DX(0), DY(1000.04)); ctx.stroke();
  arrowHead(ctx, [DX(10.6) + 6, DY(999.65)], 0, C.ink); arrowHead(ctx, [DX(0), DY(1000.04) - 6], -Math.PI / 2, C.ink);
  txt(ctx, '°C', DX(10.6), DY(999.65) + 32, { size: 30, color: C.dim });
  // la curva si traccia dietro al punto, che va dove dice Stilla
  const tw = tAcqua(t), pts = [];
  for (let i = 0; i <= 80; i++) { const c = tw * i / 80; pts.push([DX(c), DY(dens(c))]); }
  ctx.save(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(DX(tw), DY(dens(tw)), 11, 0, Math.PI * 2); ctx.fill();
  drawRich(ctx, '{r:si contrae}', DX(2), 560, { size: 34, alpha: P(t, 70.6, 71.1) });
  drawRich(ctx, '{dim:si dilata}', DX(7.4), 560, { size: 34, alpha: P(t, 78.8, 79.3) });
  const km = P(t, 74.8, 75.3);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km;
    ctx.strokeStyle = css(C.x, .85); ctx.lineWidth = 3; ctx.setLineDash([9, 9]); ctx.beginPath(); ctx.moveTo(DX(4), DY(dens(4)) + 14); ctx.lineTo(DX(4), DY(999.65)); ctx.stroke(); ctx.setLineDash([]);
    drawRich(ctx, '{g:999,97 kg/m³ a 4 °C}', DX(4) + 24, DY(dens(4)) - 34, { size: 34, align: 'left' });
    ctx.restore();
  }
  // il lago d'inverno
  const kl = P(t, 82.4, 83.0);
  if (kl > 0) lago(ctx, t, kl);
  ctx.restore();
}
function lago(ctx, t, kl) {
  card(ctx, 1150, 110, 660, 680, kl);
  ctx.save(); ctx.globalAlpha *= kl;
  conFont(TITOLI, () => drawRich(ctx, 'un lago d’inverno', 1480, 165, { size: 38, weight: 600 }));
  txt(ctx, 'aria a −5 °C', 1480, 222, { size: 30, color: C.dim });
  const top = 262, fondo = 740, x0 = 1180, x1 = 1780;
  const conca = () => { ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.lineTo(x1, fondo - 90); ctx.quadraticCurveTo(x1, fondo, x1 - 120, fondo); ctx.lineTo(x0 + 120, fondo); ctx.quadraticCurveTo(x0, fondo, x0, fondo - 90); ctx.closePath(); };
  // l'acqua: più fredda (più chiara) in alto, 4 °C sul fondo
  const g = ctx.createLinearGradient(0, top, 0, fondo);
  g.addColorStop(0, css(C.x, .12)); g.addColorStop(1, css(C.x, .45));
  ctx.fillStyle = g; conca(); ctx.fill();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; conca(); ctx.stroke();
  // il ghiaccio che si forma in superficie
  const kg = P(t, 87.0, 90.0);
  if (kg > 0) {
    ctx.fillStyle = css(mix(C.x, [255, 255, 255], .82)); ctx.strokeStyle = css(mix(C.x, [40, 70, 100], .3)); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.rect(x0, top - 10 * kg, x1 - x0, 46 * kg); ctx.fill(); ctx.stroke();
    if (kg > .6) txt(ctx, 'ghiaccio', 1480, top + 13, { size: 30, weight: 600, color: mix(C.x, [20, 40, 70], .7), alpha: P(kg, .6, 1) });   // scuro su ghiaccio chiaro, in entrambi i temi
  }
  for (const [y, s] of [[322, '0 °C'], [406, '1 °C'], [490, '2 °C'], [574, '3 °C'], [660, '4 °C']]) txt(ctx, s, x1 - 24, y, { size: 32, weight: s === '4 °C' ? 600 : 500, color: s === '4 °C' ? C.x : C.dim, align: 'right' });
  // l'acqua a 4 °C, più densa, scende sul fondo
  const kd = life(t, 82.8, 86.8, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.x); ctx.lineWidth = 6; ctx.lineCap = 'round';
    const y0 = 330 + 60 * ((t - 82.8) % 1.6) / 1.6;
    ctx.beginPath(); ctx.moveTo(1300, y0); ctx.lineTo(1300, y0 + 240); ctx.stroke(); arrowHead(ctx, [1300, y0 + 252], Math.PI / 2, C.x, 1.2);
    txt(ctx, 'più densa', 1320, 420, { size: 30, color: C.x, align: 'left' });
    ctx.restore();
  }
  // un pesce che nuota tranquillo sul fondo
  const kp = P(t, 91.6, 92.2);
  if (kp > 0) {
    const xf = 1420 + 90 * Math.sin((t - 91.6) * .7), dir = Math.cos((t - 91.6) * .7) >= 0 ? 1 : -1;
    ctx.save(); ctx.globalAlpha *= kp; ctx.translate(xf, 640); ctx.scale(dir, 1);
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.ellipse(0, 0, 34, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-52, -14); ctx.lineTo(-52, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(18, -4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// 5 · in una frase (96.8–107.4)
function scenaFine(ctx, t) {
  if (t < 96.9) return;
  const al = 1 - P(t, 105.3, 106.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.1 });
    drawRich(ctx, 'Scaldandosi i corpi si allungano,\nin proporzione all’aumento di temperatura.', W / 2, 290, { size: 64, weight: 600, local: t - 97.5, stagger: .08 });
  });
  const pills = [[490, '{mg:ΔL}{mink: = λ·L₀·}{mx:ΔT}'], [960, 'binari e ponti:\nservono i {g:giunti}'], [1430, 'l’acqua è più densa\na {x:4 °C}']];
  pills.forEach(([x, s], i) => {
    const a = 99.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la temperatura che sale, o l'altezza del punto sulla curva
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.6, .5], ['traccia', 12.6, 13.2],                      // il binario; la lente sul giunto
    ['pop', 17.4, .4], ['tono', 17.6, 21.6, [.1, .6]],                                // l'estate: da 0 a 40 °C, il binario si allunga
    ['ding', 21.7],                                                                   // 1,4 cm: lo spazio si stringe
    ['traccia', 26.6, 27.0],                                                          // senza spazio si piegherebbe
    ['soffio', 30.9], ['pop', 31.0, .6], ['pop', 34.6, .4],                           // ΔL = λ·L₀·ΔT, L₀ e ΔT
    ['pop', 39.2, .45], ['pop', 43.8, .5],                                            // λ, l'acciaio
    ['traccia', 47.2, 48.6], ['tono', 47.4, 48.6, [.1, .13, .35, .57, .6]],           // il conto; la retta sale nel grafico
    ['ding', 48.6],                                                                   // 1,4 cm
    ['traccia', 52.0, 52.5], ['pop', 52.2, .45],                                      // metà ΔT, metà allungamento
    ['soffio', 56.2], ['tono', 57.4, 60.4, [.1, .13, .35, .57, .6]],                  // il ponte: da −10 a 40 °C
    ['pop', 61.2, .5], ['ding', 62.0],                                                // = 6 cm
    ['soffio', 65.6],                                                                 // la densità dell'acqua
    ['tono', 70.4, 74.2, [.54, .59, .83, .92, .92]], ['traccia', 70.4, 74.2], ['pop', 70.6, .4],   // da 0 a 4 °C la densità sale
    ['traccia', 74.8, 75.3], ['ding', 75.0],                                          // il massimo a 4 °C
    ['tono', 78.8, 82.0, [.92, .91, .72, .23, .14]], ['traccia', 78.8, 82.0],         // oltre i 4 °C scende
    ['soffio', 82.4],                                                                 // il lago d'inverno
    ['traccia', 87.0, 90.0], ['pop', 88.6, .5], ['pop', 91.6, .55],                   // il ghiaccio in superficie, il pesce sul fondo
    ['soffio', 97.1], ['pop', 97.5, .6], ['pop', 99.0, .5], ['pop', 99.5, .6], ['pop', 100.0, .7],   // in una frase
  ];
  return {
    titolo: 'I binari che si allungano', durata: 107.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI, stati: [[86.8, 'ghiaccio'], [97.0, 'liquida']] },
    capitoli: [[7.5, 30.9, 'il binario d’estate'], [30.9, 56.2, 'la legge'], [56.2, 65.6, 'il ponte'], [65.6, 96.8, 'l’acqua al contrario']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBinario(ctx, t); scenaLegge(ctx, t); scenaPonte(ctx, t); scenaAcqua(ctx, t); scenaFine(ctx, t); },
  };
});
