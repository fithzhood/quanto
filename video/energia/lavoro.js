'use strict';
/* Spingere un muro non è lavoro — L = F·s·cos α: senza spostamento niente lavoro; della forza inclinata lavora solo la parte
   lungo lo spostamento; sulla valigia trascinata peso e reazione non lavorano (90°), l'attrito sì, in negativo (180°). Argomento: energia. */
CVIDEO.registra('energia/lavoro', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [96.9, 190], [98.2, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [96.9, 1050], [98.2, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.9, 2.2], [98.2, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [96.9, 2], [98.2, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.9, -1.5], [98.2, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.1, 'sorpreso'], [16.0, 'neutro'],
  [20.5, 'felice'], [23.7, 'pensa'], [28.5, 'neutro'], [42.0, 'felice'], [48.2, 'neutro'], [58.0, 'pensa'],
  [63.0, 'neutro'], [70.2, 'felice'], [74.4, 'neutro'], [83.4, 'felice'], [87.1, 'neutro'], [92.2, 'pensa'],
  [96.9, 'neutro'], [99.0, 'felice'], [103.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Spingi un muro per un minuto:\nhai fatto lavoro?'],
  [7.9, 12.0, 'Spingo un muro con una forza\n{my:F} di 300 N.'],
  [12.1, 15.9, 'Il muro {r:non si sposta}\nneanche di un millimetro.'],
  [16.0, 20.4, 'In fisica una forza fa lavoro\nsolo se c’è uno {g:spostamento}.'],
  [20.5, 23.6, 'Spostamento zero:\nlavoro {g:zero}.'],
  [23.7, 28.4, 'La stanchezza è vera: i muscoli\nconsumano energia anche da fermi.'],
  [28.5, 32.6, 'Ma è un’altra cosa: sul muro\nil lavoro resta {g:zero}.'],
  [32.75, 37.3, 'Ora spingo con 50 N una cassa\nsu un pavimento {g:senza attrito}.'],
  [37.4, 41.9, 'La spinta la accompagna per 4 m:\nè lo spostamento {mink:s}.'],
  [42.0, 48.1, 'Il lavoro è forza per spostamento:\n{mink:L = }{my:F}{mink:·s} = 50 N · 4 m = {g:200 J}.'],
  [48.2, 53.3, 'L’unità di misura è il {g:joule}:\n1 J = 1 N · 1 m.'],
  [53.4, 57.95, 'Ora tiro una valigia a passo\ncostante, con 50 N di forza.'],
  [58.0, 62.9, 'La forza è inclinata: forma un angolo\n{mink:α} = 60° con lo spostamento.'],
  [63.0, 67.8, 'Conta solo la sua parte {y:lungo}\n{y:lo spostamento}: {my:F}{mink:·cos α}.'],
  [67.9, 74.2, 'Nei 4 m segnati:\n{mink:L = }{my:F}{mink:·s·cos α} = 50 · 4 · 0,5 = {g:100 J}.'],
  [74.4, 78.7, 'Sulla valigia agiscono anche\nil peso {my:P} e la reazione {my:N}.'],
  [78.8, 83.3, 'Sono {g:perpendicolari} allo spostamento:\n{mink:α} = 90°, {mink:cos} 90° = 0.'],
  [83.4, 87.0, 'Il loro lavoro è {g:zero}.'],
  [87.1, 92.1, 'L’{y:attrito}, 25 N, va contro il moto:\n{mink:α} = 180°, {mink:cos} 180° = −1.'],
  [92.15, 96.95, 'Il suo lavoro è {g:negativo}:\n25 · 4 · (−1) = {g:−100 J}.'],
  [99.0, 104.0, 'Fa lavoro solo la parte della forza\nlungo lo spostamento.'],
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
function riga(ctx, nome, val, y, col, al, size = 38) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, 1190, y, { size: size - 2, align: 'left' });
  if (/°$/.test(val)) txt(ctx, val, 1770, y, { size: size + 2, color: col, align: 'right' }); else numero(ctx, val, 1770, y, size + 2, col);
  ctx.restore();
}
const titoletto = (ctx, s, al) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
const SC = [110, 110, 1000, 680], FY = 620;
function pavimento(ctx, off) {   // off: di quanto è scorso il pavimento, in pixel
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(135, FY); ctx.lineTo(1085, FY); ctx.stroke();
  ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.beginPath();
  const o = ((off % 30) + 30) % 30;
  for (let x = 170 - o; x < 1085; x += 30) if (x > 150) { ctx.moveTo(x, FY + 4); ctx.lineTo(x - 16, FY + 22); }
  ctx.stroke();
}
const clipCard = ctx => { ctx.beginPath(); ctx.roundRect(SC[0] + 4, SC[1] + 4, SC[2] - 8, SC[3] - 8, 20); ctx.clip(); };

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Spingere un muro non è lavoro', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il muro (7,5–33): la forza c'è, lo spostamento no
function omino(ctx) {
  ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const linea = pts => { ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p)); ctx.stroke(); };
  linea([[540, FY - 4], [568, 566], [604, 518], [664, 444]]);          // gamba dietro, schiena
  linea([[606, FY - 4], [622, 566], [604, 518]]);                       // gamba avanti
  linea([[664, 444], [716, 452], [758, 440]]);                          // braccia tese contro il muro
  linea([[656, 456], [712, 478], [758, 470]]);
  ctx.fillStyle = css(C.paper); ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(690, 404, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function sceneMuro(ctx, t) {
  if (t < 7.5 || t > 33.2) return;
  const al = life(t, 7.6, 33.0, .6, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...SC);
  pavimento(ctx, 0);
  // il muro di mattoni
  ctx.fillStyle = css(mix(C.y, C.paper, .8)); ctx.fillRect(762, 230, 120, FY - 230);
  ctx.strokeStyle = css(mix(C.y, C.ink, .5), .55); ctx.lineWidth = 2; ctx.beginPath();
  for (let y = 230, r = 0; y < FY; y += 39, r++) {
    ctx.moveTo(762, y); ctx.lineTo(882, y);
    for (let x = 762 + (r % 2 ? 30 : 60); x < 882; x += 60) { ctx.moveTo(x, y); ctx.lineTo(x, Math.min(y + 39, FY)); }
  }
  ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.strokeRect(762, 230, 120, FY - 230);
  omino(ctx);
  const kF = P(t, 8.1, 8.6);
  freccia(ctx, [610, 330], [760, 330], C.y, kF);
  drawRich(ctx, '{my:F} = 300 N', 650, 288, { size: 34, alpha: kF });
  drawRich(ctx, '{mink:s} = 0 m', 822, FY + 62, { size: 36, alpha: P(t, 12.3, 12.8) });
  ctx.restore();
  // la scheda
  const as = life(t, 8.0, 33.0, .5, .5);
  card(ctx, 1150, 110, 660, 680, as);
  ctx.save(); ctx.globalAlpha *= as;
  titoletto(ctx, 'il lavoro sul muro', 1);
  riga(ctx, '{dim:forza} {my:F}', '300 N', 260, C.y, P(t, 8.1, 8.6));
  riga(ctx, '{dim:spostamento} {mink:s}', '0 m', 340, C.ink, P(t, 12.3, 12.8));
  riga(ctx, '{dim:lavoro} {mink:L}', '0 J', 440, C.g, P(t, 20.7, 21.2), 44);
  drawRich(ctx, '{dim:la fatica dei muscoli}\n{dim:è un’altra cosa}', 1480, 600, { size: 32, alpha: P(t, 23.9, 24.4) });
  ctx.restore();
}

// 2 · la cassa (32,6–53,5): parte da ferma, 50 N per 4 m, poi va avanti da sola (niente attrito); al rallentatore
const XB0 = 250, BW = 130, BH = 110, PX2 = 150, TV2 = 37.6, LENTO2 = 2, ACC2 = 2;   // 25 kg, 50 N: a = 2 m/s²
function xCassa(t) {   // metri dal via
  const tau = Math.max(0, (t - TV2) / LENTO2);
  return tau <= 2 ? .5 * ACC2 * tau * tau : 4 + 4 * (tau - 2);   // dopo 4 m la spinta finisce: 4 m/s costanti
}
function sceneCassa(ctx, t) {
  if (t < 32.4 || t > 53.6) return;
  const al = life(t, 32.6, 53.4, .5, .5), x = xCassa(t), xb = XB0 + x * PX2, yc = FY - BH / 2;
  const XA = XB0 + BW / 2, XB = XA + 4 * PX2;
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...SC);
  pavimento(ctx, 0);
  // i due segni dello spostamento e la freccia s
  for (const xs of [XA, XB]) dashed(ctx, [xs, FY + 8], [xs, 770], C.dim, 1, .8);
  const ks = P(t, 37.5, 37.9), xs = Math.min(XA + x * PX2, XB);
  if (xs > XA + 4) freccia(ctx, [XA, 742], [xs, 742], C.ink, ks, 5);
  drawRich(ctx, '{mink:s} = 4 m', (XA + XB) / 2, 702, { size: 36, alpha: P(t, 41.4, 41.9) });
  ctx.save(); clipCard(ctx);
  ctx.fillStyle = css(mix(C.y, C.paper, .66)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.rect(xb, FY - BH, BW, BH); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xb + 12, FY - BH + 12); ctx.lineTo(xb + BW - 12, FY - 12); ctx.stroke();
  ctx.restore();
  // la spinta, finché la cassa non ha fatto 4 m
  const kF = P(t, 33.1, 33.6) * (x < 4 ? 1 : 0);
  freccia(ctx, [xb - 104, yc], [xb - 4, yc], C.y, kF);
  drawRich(ctx, '{my:F} = 50 N', xb - 54, yc - 92, { size: 34, alpha: kF });
  txt(ctx, 'al rallentatore', 1090, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, 37.6, 43.5, .3, .4) });
  ctx.restore();
  // la scheda
  const as = life(t, 33.0, 53.4, .5, .5);
  card(ctx, 1150, 110, 660, 680, as);
  ctx.save(); ctx.globalAlpha *= as;
  titoletto(ctx, 'la cassa', 1);
  riga(ctx, '{dim:forza} {my:F}', '50 N', 260, C.y, P(t, 33.1, 33.6));
  riga(ctx, '{dim:spostamento} {mink:s}', M.fmtN(Math.min(x, 4), 1).replace(',0', '') + ' m', 340, C.ink, P(t, 37.5, 37.9));
  drawRich(ctx, '{mink:L = }{my:F}{mink:·s}', 1480, 445, { size: 54, local: t - 42.1 });
  drawRich(ctx, '= 50 N · 4 m = {g:200 J}', 1480, 525, { size: 42, local: t - 42.7 });
  ctx.save(); ctx.globalAlpha *= P(t, 48.3, 48.8);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1200, 595); ctx.lineTo(1760, 595); ctx.stroke();
  ctx.restore();
  drawRich(ctx, '{g:joule}: 1 J = 1 N · 1 m', 1480, 660, { size: 40, local: t - 48.4 });
  ctx.restore();
}

// 3–4 · la valigia (53,3–97): va a passo costante, 1 m/s; la valigia resta al centro e il pavimento scorre
const XS = 520, CY = 528, PX3 = 110, FS3 = 3, T3 = 53.3, VA = 1, WA = 15.3, WB = 19.3;   // i due segni a 15,3 m e 19,3 m: la valigia li passa a 68,6 s e 72,6 s
const RAD = Math.PI / 180, ALFA = 60 * RAD, DIR = [Math.cos(ALFA), -Math.sin(ALFA)];
const G0 = [XS + 65, 470], GR = [G0[0] + 150 * DIR[0], G0[1] + 150 * DIR[1]];      // attacco del manico e impugnatura
const MASSA3 = 8, PESO3 = MASSA3 * 9.8, FT = 50, FPAR = FT * Math.cos(ALFA), FPERP = FT * Math.sin(ALFA), NN3 = PESO3 - FPERP;   // 78,4 N, 25 N, 43,3 N, 35,1 N
const dist = t => Math.max(0, t - T3) * VA;
function valigia(ctx, t) {
  const d = dist(t), ang = d * PX3 / 15;
  ctx.save();
  ctx.fillStyle = css(mix(C.v, C.paper, .72)); ctx.strokeStyle = css(mix(C.v, C.ink, .45)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(XS - 65, 465, 130, 125, 14); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XS - 30, 475); ctx.lineTo(XS - 30, 580); ctx.moveTo(XS + 30, 475); ctx.lineTo(XS + 30, 580); ctx.stroke();
  // il manico tirato a 60°
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...G0); ctx.lineTo(...GR); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(GR[0], GR[1], 9, 0, Math.PI * 2); ctx.fill();
  // le ruote che girano
  for (const xw of [XS - 36, XS + 36]) {
    ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(xw, FY - 15, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath();
    for (let k = 0; k < 3; k++) { const a = ang + k * Math.PI / 3; ctx.moveTo(xw - 12 * Math.cos(a), FY - 15 - 12 * Math.sin(a)); ctx.lineTo(xw + 12 * Math.cos(a), FY - 15 + 12 * Math.sin(a)); }
    ctx.stroke();
  }
  ctx.restore();
}
function sceneValigia(ctx, t) {
  if (t < 53.2 || t > 97.2) return;
  const al = life(t, 53.4, 97.0, .5, .5), d = dist(t);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...SC);
  ctx.save(); clipCard(ctx);
  pavimento(ctx, d * PX3);
  // i due segni dello spostamento, che scorrono col pavimento
  const sx = w => XS + (w - d) * PX3, ks = 1 - P(t, 74.0, 74.6);
  if (ks > 0) {
    for (const w of [WA, WB]) dashed(ctx, [sx(w), FY + 8], [sx(w), 770], C.dim, 1, .8 * ks);
    const a = sx(WA), b = Math.min(XS, sx(WB));
    if (b > a + 4) freccia(ctx, [a, 742], [b, 742], C.ink, ks, 5);
    drawRich(ctx, '{mink:s} = 4 m', (sx(WA) + sx(WB)) / 2, 702, { size: 36, alpha: P(t, 72.6, 73.0) * ks });
  }
  ctx.restore();
  // il verso del moto
  const km = P(t, 53.7, 54.2);
  freccia(ctx, [160, 190], [330, 190], C.ink, km, 5);
  txt(ctx, 'verso del moto', 350, 190, { size: 30, color: C.dim, align: 'left', alpha: km });
  valigia(ctx, t);
  // la forza F lungo il manico, e l'angolo α con lo spostamento
  const kF = P(t, 53.8, 54.3), FTIP = [GR[0] + FT * FS3 * DIR[0], GR[1] + FT * FS3 * DIR[1]];
  const kA = P(t, 58.2, 58.7);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    dashed(ctx, G0, [G0[0] + 150, G0[1]], C.dim, 1, 1);
    ctx.beginPath(); ctx.arc(G0[0], G0[1], 62, -ALFA, 0); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:α}', G0[0] + 92 * Math.cos(ALFA / 2), G0[1] - 92 * Math.sin(ALFA / 2), { size: 34, alpha: kA });
  }
  // le due parti di F (fino al capitolo 4)
  const kC = P(t, 63.2, 63.8) * (1 - P(t, 74.2, 74.8));
  if (kC > 0) {
    const tx = [GR[0] + FPAR * FS3, GR[1]], ty = [GR[0], GR[1] - FPERP * FS3];
    dashed(ctx, tx, FTIP, C.dim, kC, .8); dashed(ctx, ty, FTIP, C.dim, kC, .8);
    freccia(ctx, GR, tx, C.y, kC, 7);
    drawRich(ctx, '{my:F}{mink:·cos α}', GR[0] + 34, GR[1] + 40, { size: 34, align: 'left', alpha: kC });
  }
  freccia(ctx, GR, FTIP, C.y, kF);
  drawRich(ctx, '{my:F} = 50 N', FTIP[0] + 22, FTIP[1] - 6, { size: 34, align: 'left', alpha: kF });
  // peso e reazione (perpendicolari al moto), poi l'attrito
  const kPN = P(t, 74.6, 75.1);
  freccia(ctx, [XS, CY], [XS, CY + PESO3 * FS3], C.y, kPN);
  drawRich(ctx, '{my:P}', XS + 24, CY + PESO3 * FS3 - 14, { size: 36, align: 'left', alpha: kPN });
  freccia(ctx, [XS, CY], [XS, CY - NN3 * FS3], C.y, kPN);
  drawRich(ctx, '{my:N}', XS - 22, CY - NN3 * FS3 + 8, { size: 36, align: 'right', alpha: kPN });
  M.dot(ctx, [XS, CY], C.ink, kPN, 7);
  const kR = life(t, 79.0, 87.0, .4, .4);   // gli angoli retti fra P, N e il verso del moto
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3.5;
    dashed(ctx, [XS, CY], [XS + 120, CY], C.g, 1, 1);
    ctx.beginPath(); ctx.moveTo(XS, CY - 22); ctx.lineTo(XS + 22, CY - 22); ctx.lineTo(XS + 22, CY); ctx.lineTo(XS + 22, CY + 22); ctx.lineTo(XS, CY + 22); ctx.stroke();
    ctx.restore();
  }
  const kAt = P(t, 87.3, 87.8);
  // l'attrito parte dal contatto della ruota dietro, appena sopra il pavimento: lontano dalla freccia del peso
  freccia(ctx, [XS - 36, FY - 6], [XS - 36 - FPAR * FS3, FY - 6], C.y, kAt);
  drawRich(ctx, '{y:attrito}', XS - 36 - FPAR * FS3 / 2, FY + 44, { size: 32, alpha: kAt });
  ctx.restore();
}

// le schede della valigia
function schedaValigia(ctx, t) {
  if (t < 53.4 || t > 97.2) return;
  const as = life(t, 53.6, 97.0, .5, .5);
  card(ctx, 1150, 110, 660, 680, as);
  ctx.save(); ctx.globalAlpha *= as;
  // 3 · la forza inclinata
  const a3 = 1 - P(t, 74.0, 74.5);
  if (a3 > 0) {
    ctx.save(); ctx.globalAlpha *= a3;
    titoletto(ctx, 'la forza inclinata', 1);
    riga(ctx, '{dim:forza} {my:F}', '50 N', 240, C.y, P(t, 53.8, 54.3));
    riga(ctx, '{dim:angolo} {mink:α}', '60°', 305, C.v, P(t, 58.2, 58.7));
    riga(ctx, '{mink:cos α}', '0,5', 370, C.ink, P(t, 58.6, 59.1));
    riga(ctx, '{dim:parte utile} {my:F}{mink:·cos α}', '25 N', 435, C.y, P(t, 63.2, 63.7));
    const s = clamp(dist(t) - WA, 0, 4);
    riga(ctx, '{dim:spostamento} {mink:s}', M.fmtN(s, 1).replace(',0', '') + ' m', 500, C.ink, P(t, 67.9, 68.4));
    drawRich(ctx, '{mink:L = }{my:F}{mink:·s·cos α}', 1480, 600, { size: 48, local: t - 68.1 });
    drawRich(ctx, '= 50 · 4 · 0,5 = {g:100 J}', 1480, 680, { size: 42, local: t - 68.8 });
    ctx.restore();
  }
  // 4 · chi lavora e chi no
  const a4 = P(t, 74.4, 74.9);
  if (a4 > 0) {
    ctx.save(); ctx.globalAlpha *= a4;
    titoletto(ctx, 'chi lavora?', 1);
    txt(ctx, 'forza', 1190, 235, { size: 30, color: C.dim, align: 'left' });
    drawRich(ctx, '{mink:α}', 1545, 235, { size: 34 });
    txt(ctx, 'lavoro', 1770, 235, { size: 30, color: C.dim, align: 'right' });
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 268); ctx.lineTo(1770, 268); ctx.stroke();
    const righe = [[74.6, '{dim:tiro} {my:F}', '60°', '100 J', 74.6], [74.6, '{dim:peso} {my:P}', '90°', '0 J', 83.5],
      [74.6, '{dim:reazione} {my:N}', '90°', '0 J', 83.5], [87.3, '{y:attrito}', '180°', '−100 J', 92.4]];
    righe.forEach(([ta, nome, ang, lav, tl], i) => {
      const y = 320 + i * 72, k = P(t, ta, ta + .5);
      drawRich(ctx, nome, 1190, y, { size: 36, align: 'left', alpha: k });
      txt(ctx, ang, 1545, y, { size: 38, color: C.v, alpha: k * (i === 0 ? 1 : P(t, i === 3 ? 87.6 : 79.0, i === 3 ? 88.1 : 79.5)) });
      numero(ctx, lav, 1770, y, 40, C.g, P(t, tl, tl + .5));
    });
    drawRich(ctx, '{mink:cos} 90° = 0', 1480, 640, { size: 38, alpha: P(t, 79.2, 79.7) });
    drawRich(ctx, '{mink:cos} 180° = −1', 1480, 700, { size: 38, alpha: P(t, 87.6, 88.1) });
    ctx.restore();
  }
  ctx.restore();
}

// 5 · in una frase (96,9–106,5)
function sceneFine(ctx, t) {
  if (t < 96.8) return;
  const al = 1 - P(t, 104.4, 105.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.1 });
    drawRich(ctx, 'Lavora solo la parte della forza\nlungo lo spostamento.', W / 2, 290, { size: 70, weight: 600, local: t - 97.5, stagger: .09 });
  });
  const pills = [[490, '{mink:L = }{my:F}{mink:·s·cos α}\nin joule'], [960, 'senza spostamento:\nlavoro {g:zero}'], [1430, 'forza perpendicolare:\nlavoro {g:zero}']];
  pills.forEach(([x, s], i) => {
    const a = 99.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 38, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue lo spostamento che cresce (cassa da 0 a 4 m, accelerata;
  // valigia da 15,3 a 19,3 m, a passo costante)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .6],                                                // il muro, F = 300 N
    ['pop', 12.3, .25], ['ding', 20.7], ['pop', 23.9, .4],                            // s = 0 m, L = 0 J, la fatica
    ['soffio', 32.6], ['pop', 33.1, .6],                                              // la cassa, la spinta di 50 N
    ['tono', 37.6, 41.6, [.1, .11, .15, .21, .3, .41, .55, .71, .9]], ['traccia', 37.6, 41.6],   // parte: s cresce fino a 4 m
    ['pop', 41.4, .5], ['pop', 42.1, .55], ['ding', 43.0],                            // s = 4 m, L = F·s = 200 J
    ['traccia', 48.3, 48.8], ['pop', 48.4, .5],                                       // il joule
    ['soffio', 53.3], ['tono', 53.4, 54.4, [.3, .3]], ['pop', 53.8, .6],              // la valigia a passo costante, F = 50 N
    ['traccia', 58.2, 58.7], ['pop', 58.3, .55], ['pop', 58.6, .4],                   // l'angolo α = 60°, cos α = 0,5
    ['pop', 63.2, .5],                                                                // la parte utile, 25 N
    ['pop', 68.1, .55], ['ding', 69.2],                                              // L = F·s·cos α = 100 J
    ['tono', 68.6, 72.6, [.2, .35, .5, .65, .8]], ['traccia', 68.6, 72.6], ['pop', 72.6, .5],   // i 4 m segnati
    ['soffio', 74.4], ['pop', 74.7, .6],                                            // chi lavora? peso e reazione
    ['traccia', 79.0, 79.4], ['pop', 79.2, .4], ['ding', 83.5],                       // perpendicolari: cos 90° = 0, lavoro zero
    ['pop', 87.3, .3], ['pop', 87.6, .35], ['ding', 92.4],                            // l'attrito, cos 180° = −1: −100 J
    ['soffio', 97.1], ['pop', 99.6, .5], ['pop', 100.1, .6], ['pop', 100.6, .7],      // in una frase
  ];
  return {
    titolo: 'Spingere un muro non è lavoro', durata: 106.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 32.6, 'il muro'], [32.6, 53.3, 'forza per spostamento'], [53.3, 74.2, 'la forza inclinata'], [74.2, 96.8, 'chi non lavora']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMuro(ctx, t); sceneCassa(ctx, t); sceneValigia(ctx, t); schedaValigia(ctx, t); sceneFine(ctx, t); },
  };
});
