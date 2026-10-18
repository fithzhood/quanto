'use strict';
/* Due masse e una carrucola — la macchina di Atwood (fune ideale, carrucola senza massa né attrito): stessa accelerazione
   a = g·(m₁ − m₂)/(m₁ + m₂), stessa tensione T = 2·m₁·m₂·g/(m₁ + m₂); con masse quasi uguali la caduta rallenta.
   3 kg e 2 kg: a = 1,96 m/s², T = 23,52 N. 2,1 kg e 2 kg: a ≈ 0,239 m/s² (g/41): 1 m in 2,89 s, contro 0,45 s in caduta libera.
   Argomento: dinamica-applicazioni. */
CVIDEO.registra('dinamica-applicazioni/carrucola', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, fixedNum, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [97.0, 190], [98.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [97.0, 1050], [98.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [97.0, 2.2], [98.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [97.0, 2], [98.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [97.0, -1.5], [98.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.6, 'sorpreso'], [26.7, 'neutro'],
  [31.4, 'felice'], [36.1, 'neutro'], [45.1, 'pensa'], [49.3, 'felice'], [53.6, 'neutro'], [58.5, 'felice'],
  [64.6, 'neutro'], [68.9, 'sorpreso'], [73.9, 'neutro'], [79.4, 'sorpreso'], [83.1, 'felice'], [87.4, 'neutro'],
  [92.1, 'felice'], [97.0, 'neutro'], [99.4, 'felice'], [103.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Due masse, una fune:\nquanto in fretta si muovono?'],
  [7.9, 13.1, 'Una carrucola: da una parte {mink:m₁} = 3 kg,\ndall’altra {mink:m₂} = 2 kg.'],
  [13.2, 17.5, 'Fune inestensibile e senza massa,\ncarrucola senza massa né attrito.'],
  [17.6, 22.0, 'I pesi: {my:P₁} = 29,4 N\ne {my:P₂} = 19,6 N.'],
  [22.1, 26.6, 'Le lascio andare, al rallentatore:\n{mink:m₁} scende, {mink:m₂} sale.'],
  [26.7, 31.3, 'La fune non si allunga: stessa\nvelocità {mx:v} per tutte e due.'],
  [31.4, 36.0, 'E stessa accelerazione {mv:a}:\nuna in giù, l’altra in su.'],
  [36.1, 40.6, 'La fune tira su tutte e due\ncon la {g:stessa} tensione {my:T}.'],
  [40.7, 45.0, 'Su ciascuna massa la risultante\nè {mink:m·}{mv:a}.'],
  [45.1, 49.2, 'Sommo le due equazioni:\nla tensione {g:si cancella}.'],
  [49.3, 53.5, 'Resta {mv:a} = {mink:g·(m₁ − m₂)/(m₁ + m₂)}.'],
  [53.6, 58.4, 'Qui {mv:a} = 9,8 · 1/5 = 1,96 m/s²:\nun quinto di {mink:g}.'],
  [58.5, 64.4, 'E {my:T} = 23,52 N: più del peso\ndi {mink:m₂}, meno del peso di {mink:m₁}.'],
  [64.6, 68.8, 'Ora masse {g:quasi uguali}:\n2,1 kg contro 2 kg.'],
  [68.9, 73.8, 'Qui {mv:a} ≈ 0,24 m/s²:\n41 volte meno di {mink:g}.'],
  [73.9, 79.0, 'In tempo reale, gara con una pallina\nin caduta libera: 1 m a testa.'],
  [79.1, 83.0, 'Via! La pallina arriva subito,\nla massa scende {g:piano}.'],
  [83.1, 87.3, 'Per 1 m: 0,45 s la pallina,\n2,89 s la massa.'],
  [87.4, 92.0, 'È il trucco di Galileo col piano\ninclinato: rallentare per misurare.'],
  [92.1, 96.8, 'Atwood la costruì nel Settecento:\nmisurando {mv:a}, si ricava {mink:g}.'],
  [99.4, 104.5, 'Le due masse hanno la stessa {mv:a}:\npiù si somigliano, più è piccola.'],
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
// il segno del tempo: due barrette (fermo), un triangolo (scorre)
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}
function cassa(ctx, cx, ytop, w, h, nome, massa, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.dim, C.paper, .78)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - w / 2, ytop, w, h, 8); ctx.fill(); ctx.stroke();
  drawRich(ctx, '{mink:' + nome + '}', cx, ytop + h / 2 - 17, { size: 32 });
  txt(ctx, massa, cx, ytop + h / 2 + 19, { size: 28, weight: 600 });
  ctx.restore();
}

// ---------- la macchina ----------
const G = 9.8, PC = [742, 190], RP = 70, XL = PC[0] - RP, XR = PC[0] + RP;   // carrucola; funi a sinistra (m₂) e a destra (m₁)
// parte 1: 3 kg e 2 kg; si lascia a TA, al rallentatore (4 s di video per 1 s vero), fermo immagine dopo 1 s vero
const A1 = G * (3 - 2) / (3 + 2), TA = 22.6, LENTO = 4, TAU1 = 1, PX1 = 100;     // 1,96 m/s²; 100 px per metro
const tau1 = t => clamp((t - TA) / LENTO, 0, TAU1);
const Y1R = 300, Y1L = 520, W1R = 110, H1R = 90, W1L = 96, H1L = 76;             // bordo alto delle casse a riposo
const FSC = 2.5, VSC = 60, ASC = 40;                                              // px per N, per m/s, per m/s²
// parte 2: 2,1 kg e 2 kg, in tempo reale dal via (TR); 1 m = 260 px
const A2 = G * .1 / 4.1, TR = 79.4, PX2 = 260, TB = Math.sqrt(2 / G), TM = Math.sqrt(2 / A2);   // 0,45 s e 2,89 s
const Y2R = 300, Y2L = 560, W2R = 100, H2R = 80, XBALL = 1050, RB = 18;
const T2 = 64.4;                                                                  // cambio di masse
function fune(ctx, yl, yr, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(XL, yl); ctx.lineTo(XL, PC[1]); ctx.arc(PC[0], PC[1], RP, Math.PI, 0); ctx.lineTo(XR, yr); ctx.stroke();
  ctx.restore();
}
function carrucola(ctx, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.dim); ctx.fillRect(PC[0] - 52, 118, 104, 12);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(PC[0], 130); ctx.lineTo(PC[0], PC[1]); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .7)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(PC[0], PC[1], RP - 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(PC[0], PC[1], RP - 18, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(PC[0], PC[1], 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due masse e una carrucola', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–2 · la macchina (7,5–96,8)
function sceneMacchina(ctx, t) {
  if (t < 7.5 || t > 97.0) return;
  const al = life(t, 7.5, 96.9, .6, .6);
  card(ctx, 372, 108, 740, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  carrucola(ctx, 1);
  // parte 1
  const k1 = 1 - P(t, T2, T2 + .5);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    const tf = tau1(t), s = A1 * tf * tf / 2 * PX1, v = A1 * tf;
    const yr = Y1R + s, yl = Y1L - s;                      // m₁ scende, m₂ sale dello stesso tratto
    fune(ctx, yl, yr, 1);
    cassa(ctx, XR, yr, W1R, H1R, 'm₁', '3 kg');
    cassa(ctx, XL, yl, W1L, H1L, 'm₂', '2 kg');
    // i pesi
    const kp = P(t, 17.9, 18.5);
    if (kp > 0) {
      freccia(ctx, [XR, yr + H1R], [XR, yr + H1R + 3 * G * FSC], C.y, kp);
      freccia(ctx, [XL, yl + H1L], [XL, yl + H1L + 2 * G * FSC], C.y, kp);
      drawRich(ctx, '{my:P₁}', XR + 18, yr + H1R + 45, { size: 34, align: 'left', alpha: kp });
      drawRich(ctx, '{my:P₂}', XL + 18, yl + H1L + 32, { size: 34, align: 'left', alpha: kp });
    }
    // la tensione: la stessa sulle due casse
    const kt = P(t, 36.4, 37.0);
    if (kt > 0) {
      const TT = 2 * 3 * 2 * G / 5 * FSC;
      freccia(ctx, [XR, yr], [XR, yr - TT], C.y, kt, 8);
      freccia(ctx, [XL, yl], [XL, yl - TT], C.y, kt, 8);
      drawRich(ctx, '{my:T}', XR - 26, yr - TT / 2, { size: 34, align: 'right', alpha: kt });
      drawRich(ctx, '{my:T}', XL + 26, yl - TT / 2, { size: 34, align: 'left', alpha: kt });
    }
    // velocità (azzurro) e accelerazione (viola), di fianco alle casse
    if (v > .02) {
      const L = v * VSC, ym = yr + H1R / 2, yn = yl + H1L / 2;
      freccia(ctx, [900, ym - L / 2], [900, ym + L / 2], C.x);
      freccia(ctx, [584, yn + L / 2], [584, yn - L / 2], C.x);
      const kv = clamp(v / .3);   // il nome compare con la freccia
      drawRich(ctx, '{mx:v}', 922, ym, { size: 36, align: 'left', alpha: kv });
      drawRich(ctx, '{mx:v}', 562, yn, { size: 36, align: 'right', alpha: kv });
    }
    const ka = P(t, 31.6, 32.2);
    if (ka > 0) {
      const L = A1 * ASC, ym = yr + H1R / 2, yn = yl + H1L / 2;
      freccia(ctx, [990, ym - L / 2], [990, ym + L / 2], C.v, ka);
      freccia(ctx, [494, yn + L / 2], [494, yn - L / 2], C.v, ka);
      drawRich(ctx, '{mv:a}', 1012, ym, { size: 36, align: 'left', alpha: ka });
      drawRich(ctx, '{mv:a}', 472, yn, { size: 36, align: 'right', alpha: ka });
    }
    if (t > TA - .3) chip(ctx, 400, 762, P(t, TA - .3, TA), t < TA + TAU1 * LENTO ? 'al rallentatore' : 'fermo immagine');
    ctx.restore();
  }
  // parte 2
  const k2 = P(t, T2 + .3, T2 + .9);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    const tm = clamp(t - TR, 0, TM), tb = clamp(t - TR, 0, TB);
    const s = A2 * tm * tm / 2 * PX2, sb = G * tb * tb / 2 * PX2;
    fune(ctx, Y2L - s, Y2R + s, 1);
    cassa(ctx, XR, Y2R + s, W2R, H2R, 'm₁', '2,1 kg');
    cassa(ctx, XL, Y2L - s, W1L, H1L, 'm₂', '2 kg');
    // la pallina libera, il metro e i due arresti
    const kb = P(t, 74.2, 74.8);
    if (kb > 0) {
      ctx.save(); ctx.globalAlpha *= kb;
      const y0 = Y2R + H2R, y1 = y0 + PX2;
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(XR - 62, y1 + 3); ctx.lineTo(XR + 62, y1 + 3); ctx.moveTo(XBALL - 36, y1 + 3); ctx.lineTo(XBALL + 36, y1 + 3); ctx.stroke();
      dashed(ctx, [XR + 56, y0], [XBALL + 36, y0], C.dim, 1, .7);
      ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(955, y0); ctx.lineTo(955, y1); ctx.moveTo(945, y0); ctx.lineTo(965, y0); ctx.moveTo(945, y1); ctx.lineTo(965, y1); ctx.stroke();
      txt(ctx, '1 m', 968, (y0 + y1) / 2, { size: 30, align: 'left' });
      M.ball(ctx, XBALL, y0 - RB + sb, '', C.y, { r: RB });
      ctx.restore();
    }
    if (t > 74.2) chip(ctx, 400, 762, P(t, 74.2, 74.6), 'tempo reale');
    ctx.restore();
  }
  ctx.restore();
}

// ---------- il pannello ----------
const PCX = 1490;
function scenePannello(ctx, t) {
  if (t < 8.2 || t > 97.0) return;
  const al = life(t, 8.3, 96.9, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, PCX, 165, { size: 38, weight: 600, alpha: a }));
  const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, y); ctx.lineTo(1800, y); ctx.stroke(); ctx.restore(); };
  const voce = (nome, val, y, a) => { drawRich(ctx, nome, 1180, y, { size: 32, align: 'left', alpha: a }); drawRich(ctx, val, 1800, y, { size: 36, align: 'right', alpha: a }); };
  // 1 · i dati (8,3–40,8)
  const s1 = 1 - P(t, 40.4, 40.8);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    tit('la macchina di Atwood', 1);
    voce('{dim:massa} {mink:m₁}', '3 kg', 240, P(t, 8.9, 9.4));
    voce('{dim:massa} {mink:m₂}', '2 kg', 295, P(t, 10.4, 10.9));
    riga(340, P(t, 13.3, 13.7));
    voce('{dim:fune}', 'inestensibile, senza massa', 385, P(t, 13.4, 13.9));
    voce('{dim:carrucola}', 'senza massa né attrito', 440, P(t, 15.0, 15.5));
    riga(485, P(t, 17.7, 18.1));
    voce('{dim:peso} {my:P₁} = {mink:m₁·g}', '29,4 N', 535, P(t, 17.9, 18.4));
    voce('{dim:peso} {my:P₂} = {mink:m₂·g}', '19,6 N', 590, P(t, 18.6, 19.1));
    drawRich(ctx, '{mink:g} = 9,8 m/s²', PCX, 660, { size: 34, alpha: P(t, 18.0, 18.5) });
    drawRich(ctx, '{dim:dopo 1 s:}  {mx:v} = 1,96 m/s', PCX, 740, { size: 34, alpha: P(t, 27.0, 27.5) });
    ctx.restore();
  }
  // 2 · le equazioni (40,8–64,6)
  const s2 = life(t, 40.8, 64.6, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    tit('una equazione per massa', 1);
    drawRich(ctx, '{mink:m₁}:   {my:P₁} − {my:T} = {mink:m₁·}{mv:a}', PCX, 245, { size: 40, local: t - 41.0 });
    drawRich(ctx, '{mink:m₂}:   {my:T} − {my:P₂} = {mink:m₂·}{mv:a}', PCX, 305, { size: 40, local: t - 41.8 });
    riga(350, P(t, 45.3, 45.7));
    drawRich(ctx, '{dim:sommo:}   {my:P₁} − {my:P₂} = {mink:(m₁ + m₂)·}{mv:a}', PCX, 400, { size: 36, local: t - 45.4 });
    drawSeq(ctx, ['{mv:a}{mink: = g·}', { num: '{mink:m₁ − m₂}', den: '{mink:m₁ + m₂}' }], PCX, 505, 52, { local: t - 49.6 });
    drawRich(ctx, '{mv:a} = 9,8 · (3 − 2)/(3 + 2) = {g:1,96 m/s²}', PCX, 610, { size: 36, local: t - 53.9 });
    drawRich(ctx, '{dim:da} {mink:m₂}{dim::}  {my:T} = {mink:m₂·(g + }{mv:a}{mink:)} = 2 · 11,76 = {g:23,52 N}', PCX, 712, { size: 32, local: t - 58.8 });
    ctx.restore();
  }
  // 3 · masse quasi uguali (64,6–96,8)
  const s3 = P(t, 64.6, 65.0);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    tit('masse quasi uguali', 1);
    voce('{dim:massa} {mink:m₁}', '2,1 kg', 240, 1);
    voce('{dim:massa} {mink:m₂}', '2 kg', 295, 1);
    drawRich(ctx, '{mv:a} = 9,8 · 0,1/4,1 ≈ {g:0,24 m/s²}', PCX, 370, { size: 38, local: t - 69.1 });
    drawRich(ctx, '{dim:41 volte meno di} {mink:g}', PCX, 425, { size: 32, alpha: P(t, 70.5, 71.0) });
    riga(470, P(t, 74.0, 74.4));
    const kc = P(t, 74.2, 74.7);
    txt(ctx, 'tempo per scendere di 1 m', PCX, 515, { size: 30, color: C.dim, alpha: kc });
    const tb = clamp(t - TR, 0, TB), tm = clamp(t - TR, 0, TM);
    ctx.save(); ctx.globalAlpha *= kc;
    drawRich(ctx, '{dim:pallina libera}', 1180, 575, { size: 32, align: 'left' });
    fixedNum(ctx, fmtN(tb, 2), 1760, 575, 44, t - TR >= TB ? C.g : C.ink); txt(ctx, 's', 1770, 575, { size: 36, align: 'left' });
    drawRich(ctx, '{dim:massa sulla carrucola}', 1180, 635, { size: 32, align: 'left' });
    fixedNum(ctx, fmtN(tm, 2), 1760, 635, 44, t - TR >= TM ? C.g : C.ink); txt(ctx, 's', 1770, 635, { size: 36, align: 'left' });
    ctx.restore();
    drawSeq(ctx, ['{mink:g = }{mv:a}{mink:·}', { num: '{mink:m₁ + m₂}', den: '{mink:m₁ − m₂}' }], PCX, 725, 40, { local: t - 92.4 });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · in una frase (97–107)
function sceneFine(ctx, t) {
  if (t < 96.9) return;
  const al = 1 - P(t, 105.0, 106.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.2 });
    drawRich(ctx, 'Le due masse accelerano insieme,', W / 2, 262, { size: 66, weight: 600, local: t - 97.6, stagger: .09 });
  });
  drawSeq(ctx, ['{mv:a}{mink: = g·}', { num: '{mink:m₁ − m₂}', den: '{mink:m₁ + m₂}' }], W / 2, 375, 60, { local: t - 98.4 });
  const pills = [[490, 'stessa {mv:a},\nstessa tensione {my:T}'], [960, 'masse quasi uguali:\ncaduta {g:lenta}'], [1430, 'misuro {mv:a},\nricavo {mink:g}']];
  pills.forEach(([x, s], i) => {
    const a = 99.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 560); ctx.scale(k, k); ctx.translate(-x, -560);
    card(ctx, x - 215, 495, 430, 130);
    drawRich(ctx, s, x, 562, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza di ciò che scende (m₁, la pallina)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.9, .5], ['pop', 10.4, .45],                            // la macchina, m₁ e m₂
    ['pop', 17.9, .4], ['pop', 18.6, .35],                                            // i pesi
    ['tono', 22.6, 26.6, [.7, .69, .66, .6, .52, .42, .3]],                           // al rallentatore: m₁ scende, m₂ sale
    ['pop', 27.1, .5], ['pop', 31.7, .55], ['pop', 36.5, .5],                         // v dopo 1 s, l'accelerazione, la tensione
    ['soffio', 40.6], ['pop', 41.1, .45], ['pop', 41.9, .5],                          // un'equazione per massa
    ['pop', 45.5, .5], ['pop', 49.7, .6],                                             // sommo: T si cancella; la formula
    ['ding', 54.2], ['ding', 59.2],                                                   // a = 1,96 m/s², T = 23,52 N
    ['soffio', 64.6], ['pop', 65.0, .5],                                              // masse quasi uguali
    ['ding', 69.4], ['pop', 70.6, .4],                                                // a ≈ 0,24 m/s², 41 volte meno
    ['traccia', 74.2, 74.8], ['pop', 74.4, .55],                                      // la pallina e il metro
    ['tono', 79.4, 79.85, [.8, .73, .54, .2]], ['pop', 79.85, .2],                    // via: la pallina arriva subito
    ['tono', 79.4, 82.29, [.8, .78, .73, .65, .53, .38, .2]], ['ding', 82.29],        // la massa scende piano: 2,89 s
    ['pop', 92.5, .6],                                                                // g = a·(m₁ + m₂)/(m₁ − m₂)
    ['soffio', 97.0], ['pop', 98.5, .6],                                              // in una frase
    ['pop', 99.8, .5], ['pop', 100.3, .6], ['pop', 100.8, .7],
  ];
  return {
    titolo: 'Due masse e una carrucola', durata: 107, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.0, 'le due masse'], [22.0, 40.6, 'stessa accelerazione'], [40.6, 64.4, 'la formula'], [64.4, 96.8, 'la caduta rallentata']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMacchina(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
