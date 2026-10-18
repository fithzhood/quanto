'use strict';
/* Scaldare l'acqua girando una manovella — l'esperimento di Joule: due pesi da 11,5 kg scendono di 1,3 m e fanno girare
   un mulinello a palette in 0,5 kg d'acqua, in un recipiente isolato. Ogni discesa il peso fa peso · discesa = (23 · 9,8 N) · 1,3 m ≈ 293 J
   di lavoro e l'acqua sale di 293,02 / (0,5 · 4186) = 0,14 °C; i pesi arrivano lenti (0,2 m/s: energia cinetica ≈ 0,46 J, trascurabile; nel video, 2° anno, solo la velocità), quindi il
   lavoro è finito nell'acqua. Con la manovella si riavvolgono i fili: venti discese, ≈ 5860 J, da 20 °C a 22,8 °C.
   1 kcal scalda 1 kg d'acqua di 1 °C: 0,5 · 2,8 = 1,4 kcal, e 5860,4 J / 1,4 kcal = 4186 J per kcal.
   Moto vero: i pesi partono da fermi e arrivano subito alla velocità limite 0,2 m/s (l'acqua frena le palette),
   s = vL·(τ − τ0·(1 − e^(−τ/τ0))); le palette girano di s/r (tamburo di raggio 4 cm). La temperatura cresce col lavoro fatto.
   Argomento: calore. */
CVIDEO.registra('calore/mulinello', M => {
  const { W, C, E, P, life, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, fmtN } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [96.2, 190], [97.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [96.2, 1050], [97.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.2, 2.2], [97.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [96.2, 2], [97.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.2, -1.5], [97.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.7, 'felice'], [16.7, 'neutro'],
  [21.5, 'felice'], [25.5, 'neutro'], [29.7, 'sorpreso'], [34.1, 'pensa'], [42.0, 'neutro'], [45.1, 'felice'],
  [49.8, 'neutro'], [59.2, 'sorpreso'], [65.6, 'pensa'], [70.6, 'neutro'], [81.8, 'pensa'], [87.0, 'festa'],
  [91.4, 'felice'], [96.2, 'neutro'], [98.6, 'felice'], [103.1, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.4, 'Si può scaldare l’acqua\nsenza fuoco?'],
  [7.9, 12.6, 'L’esperimento di {v:Joule}: un mulinello\na palette dentro l’acqua.'],
  [12.7, 16.6, 'Il recipiente è {g:isolato}:\nil calore non passa.'],
  [16.7, 21.4, 'Due pesi, appesi a fili avvolti\nsull’asse del mulinello.'],
  [21.5, 25.4, 'Li lascio: scendono e fanno\ngirare le palette.'],
  [25.5, 29.6, 'Scendono piano, a velocità costante:\nl’acqua frena le palette.'],
  [29.7, 34.0, 'In fondo: l’acqua è salita\ndi {g:0,14 °C}.'],
  [34.1, 41.9, 'Lavoro del peso: peso · discesa\n= (23 · 9,8 N) · 1,3 m ≈ {g:293 J}.'],
  [42.0, 45.0, 'Niente velocità: i pesi\narrivano lenti.'],
  [45.1, 49.7, 'È finito nell’acqua: le palette\nla rimescolano e la {g:scaldano}.'],
  [49.8, 54.0, 'Con la {v:manovella} riavvolgo i fili,\ne si ricomincia.'],
  [54.1, 59.1, 'Altre diciannove discese,\nviste in fretta…'],
  [59.2, 65.5, '…in tutto {g:≈ 5860 J}: l’acqua\nè arrivata a {g:22,8 °C}.'],
  [65.6, 70.5, 'Prima di Joule il calore si misurava\nin {v:calorie}, non in joule.'],
  [70.6, 75.3, 'Una {v:chilocaloria} scalda\n1 kg d’acqua di 1 °C.'],
  [75.4, 81.7, '0,5 kg d’acqua, 2,8 °C in più:\n{v:1,4 kcal}.'],
  [81.8, 86.9, 'Il lavoro: 5860 J\nper 1,4 kcal…'],
  [87.0, 91.3, '…cioè {g:≈ 4186 J}\nper ogni kcal.'],
  [91.4, 96.2, 'Lavoro o fiamma, l’effetto è lo stesso:\nsono due modi di dare {g:energia}.'],
  [98.6, 104.6, 'Lavoro e calore: due modi di dare\nenergia. 1 kcal = 4186 J.'],
];

// ---------- la fisica ----------
const MP = 23, G = 9.8, HH = 1.3, MA = 0.5, CA = 4186, RT = 0.04;   // massa dei due pesi, dislivello, acqua, tamburo
const W1 = MP * G * HH;                    // 293,02 J a discesa
const VL = 0.2, T0 = 0.25, TA = 21.6;      // velocità limite 0,2 m/s, raggiunta in pochi decimi di secondo
const sPrima = tau => tau <= 0 ? 0 : Math.min(HH, VL * (tau - T0 * (1 - Math.exp(-tau / T0))));
// la manovella riavvolge (49,3–52,7); poi 19 discese veloci (53,5–58,0): giù 0,6 unità, su 0,4, l'ultima resta giù
const RA = 50.1, RB = 53.5, CA0 = 54.3, CB0 = 58.8, ND = 19, UNI = (CB0 - CA0) / (ND * .6 + (ND - 1) * .4);
// [quanto sono scesi i pesi adesso (m), quanti metri di discesa in tutto]
function pesi(t) {
  if (t < CA0) {
    const s1 = sPrima(t - TA);
    if (t < RA) return [s1, s1];
    return [HH * (1 - P(t, RA, RB)), HH];
  }
  let u = (t - CA0) / UNI;
  for (let i = 0; i < ND; i++) {
    if (u < .6) return [HH * u / .6, HH * (1 + i + u / .6)];
    u -= .6;
    if (i === ND - 1) break;
    if (u < .4) return [HH * (1 - u / .4), HH * (2 + i)];
    u -= .4;
  }
  return [HH, HH * (ND + 1)];
}
const lavoro = t => W1 * pesi(t)[1] / HH;
const temp = t => 20 + lavoro(t) / (MA * CA);
const discese = t => Math.floor(pesi(t)[1] / HH + 1e-6);

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
function riga(ctx, nome, val, y, col, al, size = 36) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, 1195, y, { size, align: 'left' });
  numero(ctx, val, 1765, y, size + 2, col);
  ctx.restore();
}
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1195, y); ctx.lineTo(1765, y); ctx.stroke(); ctx.restore();
}
function freccia(ctx, a, b, col, w = 4, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, L / 26);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Scaldare l’acqua\ngirando una manovella', W / 2, 200, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- l'apparato: 300 px per metro di discesa ----------
const PXM = 300, YP0 = 300, XA = 610, YS = 232;           // cima dei pesi a riposo, asse, quota dei fili
const PUL = [[230, 254], [990, 254]], RP = 22;              // carrucole
const XW = [208, 1012], BW = 130, BH = 70;                 // pesi
const VX0 = 430, VX1 = 790, VY0 = 470, VY1 = 760, IS = 16;  // recipiente con la parete isolante
const XT = 745, yT = c => 440 - (c - 20) * 45;             // termometro: 20 °C a y 440, 23 °C a y 305
function apparato(ctx, t, al) {
  if (al <= 0) return;
  const [s, sTot] = pesi(t), phi = sTot / RT;   // le palette girano solo mentre i pesi scendono
  ctx.save(); ctx.globalAlpha *= al;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // la trave in alto e i sostegni
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(190, 150); ctx.lineTo(1030, 150); ctx.stroke();
  ctx.lineWidth = 4;
  for (const [px, py] of PUL) { ctx.beginPath(); ctx.moveTo(px, 150); ctx.lineTo(px, py); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(XA, 150); ctx.lineTo(XA, 190); ctx.stroke();
  // il recipiente: due pareti con l'isolante in mezzo
  ctx.fillStyle = css(mix(C.dim, C.paper, .78));
  ctx.beginPath(); ctx.rect(VX0, VY0, VX1 - VX0, VY1 - VY0); ctx.fill();
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.rect(VX0 + IS, VY0 + IS, VX1 - VX0 - 2 * IS, VY1 - VY0 - 2 * IS); ctx.fill();
  ctx.fillStyle = css(C.x, .22); ctx.fillRect(VX0 + IS, 500, VX1 - VX0 - 2 * IS, VY1 - IS - 500);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.strokeRect(VX0, VY0, VX1 - VX0, VY1 - VY0); ctx.lineWidth = 2.5;
  ctx.strokeRect(VX0 + IS, VY0 + IS, VX1 - VX0 - 2 * IS, VY1 - VY0 - 2 * IS);
  // l'asse, il tamburo, la manovella
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(XA, 190); ctx.lineTo(XA, 715); ctx.stroke();
  ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(XA - 22, YS - 12, 44, 42); ctx.fill(); ctx.stroke();
  const psi = 1.9 * kfManovella(t);
  const hx = XA + 46 * Math.cos(psi);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(XA, 200); ctx.lineTo(hx, 200); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(hx, 200); ctx.lineTo(hx, 182); ctx.stroke();
  // le palette, viste di lato: quelle dietro più chiare
  const RPAL = 110;
  const pale = [0, 1, 2, 3].map(k => phi + .6 + k * Math.PI / 2).sort((a, b) => Math.sin(a) - Math.sin(b));
  for (const a of pale) {
    const dx = RPAL * Math.cos(a), dietro = Math.sin(a) < 0;
    ctx.fillStyle = css(mix(C.dim, C.paper, dietro ? .7 : .35)); ctx.strokeStyle = css(C.ink, dietro ? .35 : .8); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.rect(Math.min(XA, XA + dx), 592, Math.abs(dx), 108); ctx.fill(); ctx.stroke();
  }
  // il termometro, con la scala ingrandita da 20 a 23 °C
  const tc = temp(t);
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(XT - 9, 282, 18, 430, 9); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(XT, 712, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(XT, 712, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(XT - 4, yT(tc), 8, 712 - yT(tc));
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2;
  for (let c = 20; c <= 23.001; c += .5) { const lungo = Math.abs(c - Math.round(c)) < .01; ctx.beginPath(); ctx.moveTo(XT + 10, yT(c)); ctx.lineTo(XT + (lungo ? 24 : 18), yT(c)); ctx.stroke(); }
  for (const c of [20, 21, 22, 23]) txt(ctx, c + ' °C', XT + 32, yT(c), { size: 30, color: C.dim, align: 'left' });
  // i fili e le carrucole
  ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(XA - 22, YS); ctx.lineTo(PUL[0][0], YS); ctx.moveTo(XA + 22, YS); ctx.lineTo(PUL[1][0], YS); ctx.stroke();
  const yp = YP0 + s * PXM;
  ctx.beginPath(); ctx.moveTo(XW[0], PUL[0][1]); ctx.lineTo(XW[0], yp); ctx.moveTo(XW[1], PUL[1][1]); ctx.lineTo(XW[1], yp); ctx.stroke();
  for (const [px, py] of PUL) {
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px, py, RP, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    M.dot(ctx, [px, py], C.ink, 1, 4);
  }
  // i pesi
  for (const x of XW) {
    ctx.fillStyle = css(mix(C.dim, C.paper, .35)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.roundRect(x - BW / 2, yp, BW, BH, 8); ctx.fill(); ctx.stroke();
    txt(ctx, '11,5 kg', x, yp + BH / 2, { size: 30, weight: 600, color: C.paper });
  }
  ctx.restore();
}
// la manovella gira solo mentre riavvolge (giri in avanti nel tempo, poi ferma)
const kfManovella = t => 6 * Math.PI * P(t, RA, RB, E.lin) + 18 * Math.PI * P(t, CA0, CB0, E.lin);

// 1–3 · il mulinello (7,5–95,4)
function scenaMulinello(ctx, t) {
  if (t < 7.5 || t > 96.8) return;
  const al = life(t, 7.6, 96.6, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  apparato(ctx, t, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il recipiente isolato
  const kIs = life(t, 12.8, 16.6, .4, .4);
  if (kIs > 0) {
    ctx.save(); ctx.globalAlpha *= kIs;
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.strokeRect(VX0 - 6, VY0 - 6, VX1 - VX0 + 12, VY1 - VY0 + 12);
    drawRich(ctx, '{g:parete}\n{g:isolante}', VX0 - 18, 600, { size: 30, weight: 600, align: 'right' });
    ctx.restore();
  }
  // il nome delle parti, all'inizio
  const kNomi = life(t, 8.2, 12.6, .4, .4);
  if (kNomi > 0) {
    drawRich(ctx, '{v:palette}', 412, 646, { size: 30, align: 'right', alpha: kNomi });
    dashed(ctx, [420, 646], [XA - 60, 646], C.v, 1, kNomi);
    drawRich(ctx, '{x:acqua}', 462, 530, { size: 30, align: 'left', alpha: kNomi });
  }
  // i pesi e i fili
  const kPesi = life(t, 16.9, 21.4, .4, .4);
  if (kPesi > 0) {
    ctx.save(); ctx.globalAlpha *= kPesi;
    ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(XA - 24, YS); ctx.lineTo(PUL[0][0], YS); ctx.moveTo(XA + 24, YS); ctx.lineTo(PUL[1][0], YS); ctx.stroke();
    ctx.restore();
  }
  // il dislivello
  const kH = life(t, 29.8, 49.7, .4, .4);
  if (kH > 0) {
    ctx.save(); ctx.globalAlpha *= kH;
    const xh = 300;
    freccia(ctx, [xh, (YP0 + YP0 + HH * PXM) / 2], [xh, YP0 + 2], C.ink, 3); freccia(ctx, [xh, (YP0 + YP0 + HH * PXM) / 2], [xh, YP0 + HH * PXM - 2], C.ink, 3);
    dashed(ctx, [XW[0] + BW / 2 + 4, YP0], [xh + 14, YP0], C.dim, 1, .9);
    drawRich(ctx, '{mink:h} = 1,3 m', xh + 16, 400, { size: 32, align: 'left' });
    ctx.restore();
  }
  // l'acqua rimescolata si scalda: vortici che girano con le palette
  const kVor = life(t, 45.2, 49.7, .4, .4);
  if (kVor > 0) {
    ctx.save(); ctx.globalAlpha *= kVor; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.lineCap = 'round';
    const a0 = t * 2.2;
    for (const [cx, cy, r] of [[520, 560, 26], [700, 555, 22], [520, 715, 20]]) {
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + 4.2); ctx.stroke();
      arrowHead(ctx, [cx + r * Math.cos(a0 + 4.2), cy + r * Math.sin(a0 + 4.2)], a0 + 4.2 + Math.PI / 2, C.g, .6);
    }
    ctx.restore();
  }
  // la manovella
  const kMan = life(t, 49.9, 54.0, .4, .4);
  if (kMan > 0) drawRich(ctx, '{v:manovella}', XA + 70, 196, { size: 30, align: 'left', alpha: kMan });
  ctx.restore();
}

// la scheda a destra
function scenaScheda(ctx, t) {
  if (t < 7.5 || t > 96.8) return;
  const al = life(t, 8.0, 96.6, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const a1 = 1 - P(t, 65.4, 65.9);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    titoletto(ctx, 'le misure');
    riga(ctx, 'acqua', '0,5 kg', 240, C.x, P(t, 8.2, 8.7));
    riga(ctx, 'pesi', '2 · 11,5 kg', 300, C.ink, P(t, 16.9, 17.4));
    riga(ctx, 'discese', String(discese(t)), 360, C.ink, P(t, 21.5, 22.0));
    linea(ctx, 400, P(t, 21.5, 22.0));
    riga(ctx, 'temperatura', fmtN(temp(t), 2) + ' °C', 445, C.y, P(t, 8.2, 8.7));
    riga(ctx, 'lavoro dei pesi', Math.round(lavoro(t)) + ' J', 505, C.g, P(t, 34.2, 34.7));
    linea(ctx, 550, P(t, 34.2, 34.7));
    const kF = life(t, 34.2, 49.8, .4, .4);
    drawRich(ctx, '{dim:peso · discesa}', 1480, 588, { size: 32, local: t - 34.3, alpha: kF });
    drawRich(ctx, '(23 · 9,8 N) · 1,3 m', 1480, 634, { size: 36, local: t - 34.7, alpha: kF });
    drawRich(ctx, '≈ {g:293 J}{dim: a discesa}', 1480, 682, { size: 36, local: t - 35.2, alpha: kF });
    drawRich(ctx, '{dim:velocità finale} 0,2 m/s', 1480, 745, { size: 32, alpha: life(t, 42.1, 49.8, .4, .4) });
    drawRich(ctx, '20 · 293 J ≈ {g:5860 J}', 1480, 620, { size: 40, local: t - 59.4, alpha: P(t, 59.2, 59.6) });
    ctx.restore();
  }
  const a2 = P(t, 65.7, 66.2);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    titoletto(ctx, 'joule e calorie');
    drawRich(ctx, '{v:1 kcal}{dim: scalda 1 kg d’acqua}\n{dim:di 1 °C}', 1480, 270, { size: 34, alpha: P(t, 70.7, 71.2) });
    linea(ctx, 340, P(t, 75.5, 76.0));
    drawRich(ctx, '0,5 · 2,8 = {v:1,4 kcal}', 1480, 395, { size: 38, local: t - 75.6 });
    riga(ctx, '{dim:lavoro speso}', '5860 J', 470, C.g, P(t, 81.9, 82.4));
    drawRich(ctx, '5860 J / 1,4 kcal ≈ {g:4186 J}', 1480, 545, { size: 38, local: t - 87.1 });
    linea(ctx, 605, P(t, 91.5, 92.0));
    drawRich(ctx, '{g:1 kcal = 4186 J}', 1480, 685, { size: 58, weight: 600, local: t - 91.6 });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (95,4–106)
function scenaFine(ctx, t) {
  if (t < 96.1) return;
  const al = 1 - P(t, 105.2, 106.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 96.4 });
    drawRich(ctx, 'Lavoro e calore sono\ndue modi di dare energia.', W / 2, 290, { size: 70, weight: 600, local: t - 96.8, stagger: .09 });
  });
  const pills = [[490, '{v:1 kcal} scalda 1 kg\nd’acqua di 1 °C'], [960, '{g:1 kcal = 4186 J}'], [1430, 'i pesi scendono,\nl’acqua si {g:scalda}']];
  pills.forEach(([x, s], i) => {
    const a = 98.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 40 : 33, weight: i === 1 ? 600 : 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza dei pesi, e nelle discese veloci la temperatura
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .4], ['traccia', 8.2, 8.6],                         // il mulinello, i nomi delle parti
    ['pop', 12.8, .45],                                                               // la parete isolante
    ['pop', 16.9, .4], ['traccia', 16.9, 17.3],                                       // i pesi e i fili
    ['tono', 21.6, 28.35, [.8, .1]],                                                  // i pesi scendono di 1,3 m, a velocità costante
    ['ding', 28.4],                                                                   // in fondo: +0,14 °C
    ['traccia', 29.8, 30.2], ['pop', 30.0, .4],                                       // h = 1,3 m
    ['pop', 34.2, .5], ['traccia', 34.2, 34.7], ['pop', 34.7, .45], ['ding', 35.5],   // lavoro = peso · discesa ≈ 293 J
    ['pop', 42.1, .35], ['pop', 45.2, .4],                                            // la velocità finale; i vortici
    ['tono', 50.1, 53.5, [.1, .14, .45, .76, .8]],                                    // la manovella riavvolge: i pesi risalgono
    ['tono', 54.3, 58.8, [.15, .85]],                                                 // diciannove discese: la temperatura sale
    ['pop', 59.4, .5], ['ding', 59.8],                                                // 20 · 293 J ≈ 5860 J
    ['soffio', 65.7], ['pop', 70.7, .45],                                             // joule e calorie; 1 kcal
    ['traccia', 75.5, 76.0], ['pop', 75.6, .5], ['ding', 76.0],                       // 0,5 · 2,8 = 1,4 kcal
    ['pop', 81.9, .4], ['pop', 87.1, .5], ['ding', 87.3],                           // 5860 J / 1,4 kcal ≈ 4186 J
    ['traccia', 91.5, 92.0], ['pop', 91.6, .7],                                       // 1 kcal = 4186 J
    ['soffio', 96.4], ['pop', 96.8, .6], ['pop', 98.8, .5], ['pop', 99.3, .6], ['pop', 99.8, .7],   // in una frase
  ];
  return {
    titolo: 'Scaldare l’acqua girando una manovella', durata: 107.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 29.6, 'il mulinello di Joule'], [29.6, 65.5, 'dove va il lavoro'], [65.5, 96.2, 'joule e calorie']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaMulinello(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
