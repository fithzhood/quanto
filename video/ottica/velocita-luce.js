'use strict';
/* Le lune di Giove in ritardo — Rømer (1676) e le eclissi di Io: quando la Terra si allontana da Giove le eclissi arrivano
   in ritardo, perché la luce che ne porta la notizia deve fare un tratto in più: la luce ha una velocità finita.
   Numeri: Terra–Sole 1,5·10¹¹ m (150 milioni di km), Giove a 5,2 volte tanto, tenuto fermo (gira in 12 anni, lo si dice).
   Terra vicina (stessa parte di Giove): 4,2·150 = 630 milioni di km; dopo cinque mesi (150° di orbita) la distanza è
   √((5,2 − cos150°)² + sin²150°)·150 ≈ 913 milioni di km (lì Giove si vede ancora, a circa 25° dal Sole). Il diametro
   dell'orbita della Terra è 3·10¹¹ m: Rømer stimò circa 22 minuti di ritardo per attraversarlo (storico), il valore vero
   è 1000 s ≈ 16,7 minuti; c = 3·10¹¹ m / 1000 s = 3·10⁸ m/s. Giro della Terra 40 000 km: 7,5 giri in un secondo.
   Moto vero: la Terra gira a velocità angolare costante; Io gira attorno a Giove a velocità costante (42,5 h per giro,
   accelerato, con un fermo immagine dichiarato durante l'eclisse); i lampi di luce vanno a velocità costante (al
   rallentatore). Distanze in scala (Io: 5,9 raggi di Giove; Giove: 5,2 volte la distanza Terra–Sole); Sole, pianeti e Io
   ingranditi. Fizeau (1849, ruota dentata) solo come cenno. Argomento: ottica. */
CVIDEO.registra('ottica/velocita-luce', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, shade, TITOLI, conFont, drawRich, txt, drawSeq, fixedNum, card, arrowHead, dashed, dot, hole } = M;
  const TAU = Math.PI * 2, DEG = Math.PI / 180;

const T_FINE = 84.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [12.3, 'sorpreso'], [16.7, 'felice'],
  [21.0, 'neutro'], [29.8, 'pensa'], [34.2, 'sorpreso'], [38.8, 'neutro'], [47.8, 'pensa'], [52.2, 'neutro'],
  [57.0, 'sorpreso'], [61.6, 'felice'], [66.0, 'neutro'], [70.8, 'festa'], [75.2, 'felice'], [79.6, 'neutro'],
  [87.5, 'felice'], [91.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'La luce arriva subito,\no ci mette del tempo?'],
  [7.9, 12.15, 'Giove ha una luna, {v:Io}:\ngli gira attorno in 42,5 ore.'],
  [12.3, 16.55, 'A ogni giro passa nell’{v:ombra} di Giove\ne sparisce: è un’{v:eclisse}.'],
  [16.7, 20.8, 'Le eclissi si ripetono regolari,\ncome un {g:orologio}.'],
  [21.0, 25.2, 'Nel 1676 {v:Rømer} le osservava\ndalla Terra, vicina a Giove.'],
  [25.4, 29.6, 'Giove fa un giro in 12 anni:\nqui lo teniamo {v:fermo}.'],
  [29.8, 34.0, 'Passano cinque mesi: la Terra\nsi allontana da Giove…'],
  [34.2, 38.6, '…e le eclissi arrivano {v:in ritardo}\nrispetto alle previsioni.'],
  [38.8, 43.2, 'La notizia dell’eclisse viaggia con\nla luce: due lampi partono insieme.'],
  [43.4, 47.65, 'Verso la Terra lontana c’è un\n{v:tratto in più}: arriva dopo.'],
  [47.8, 52.0, 'Il ritardo è il tempo per fare\nquel {v:tratto in più}.'],
  [52.2, 56.8, 'Con la Terra proprio dall’altra parte\nsarebbe tutto il {v:diametro} dell’orbita.'],
  [57.0, 61.4, 'Per il diametro Rømer stimò\ncirca {v:22 minuti} di ritardo.'],
  [61.6, 65.8, 'Un po’ troppo: oggi sappiamo\nche sono circa {g:16,7 minuti}.'],
  [66.0, 70.6, 'Velocità uguale distanza diviso tempo:\n{mink:3·10¹¹} m in 1000 s.'],
  [70.8, 75.05, 'È la velocità della luce, {mink:c}:\n300 000 km al {g:secondo}!'],
  [75.2, 79.4, 'In un secondo farebbe\n7 giri e mezzo della Terra.'],
  [79.6, 84.6, 'Nel 1849 {v:Fizeau} la misurò sulla Terra,\ncon una ruota dentata: quasi uguale.'],
  [87.5, 93.3, 'La luce non arriva in un istante:\nva a circa 300 000 km/s.'],
];

// ---------- aiutanti ----------
function chip(ctx, s, x, y, al = 1, size = 30) {
  if (al <= 0) return;
  const w = M.richW(ctx, s, size) + 22;
  ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
  drawRich(ctx, s, x, y, { size, alpha: al });
}
function linea(ctx, a, b, col, w, al = 1, k = 1) {
  if (al <= 0 || k <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); ctx.restore();
}
function disco(ctx, p, r, col, al = 1, alone = 0) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (alone) { ctx.shadowColor = css(col, .8); ctx.shadowBlur = alone; }
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.restore();
}
const COL_GIOVE = () => mix(C.y, C.ink, .35);
const OMBRA = () => shade(C.paper, -.28);

// ---------- 1 · Io attorno a Giove, visto dall'alto (7,5–21) ----------
const CS = [110, 110, 1180, 690];
const ZJ = [640, 455], RJ = 50, RIO = 5.9 * RJ;          // l'orbita di Io è 5,9 raggi di Giove: in scala
const TP = 3.5, TIO = 8.0, FERMO = [13.6, 16.4];          // un giro (42,5 h) in 3,5 s; fermo immagine nell'eclisse
const twIo = t => (t - TIO) - clamp(t - FERMO[0], 0, FERMO[1] - FERMO[0]);
const A0 = -TAU * (FERMO[0] - TIO) / TP;                 // così al fermo Io è al centro dell'ombra (α = 0)
const alfaIo = t => A0 + TAU * twIo(t) / TP;
const inOmbra = a => Math.cos(a) > 0 && Math.abs(Math.sin(a)) * RIO < RJ;
function scenaIo(ctx, t) {
  if (t < 7.4 || t > 21.4) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 20.7, 21.3));
  ctx.save(); ctx.globalAlpha *= al;
  // l'ombra di Giove, dalla parte opposta al Sole
  ctx.save(); ctx.beginPath(); ctx.rect(ZJ[0], ZJ[1] - RJ, CS[0] + CS[2] - 12 - ZJ[0], 2 * RJ); ctx.fillStyle = css(OMBRA()); ctx.fill();
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(ZJ[0], ZJ[1] - RJ); ctx.lineTo(CS[0] + CS[2] - 12, ZJ[1] - RJ); ctx.moveTo(ZJ[0], ZJ[1] + RJ); ctx.lineTo(CS[0] + CS[2] - 12, ZJ[1] + RJ); ctx.stroke(); ctx.restore();
  txt(ctx, 'ombra di Giove', 1130, ZJ[1], { size: 30, color: C.dim });
  // la luce del Sole, da sinistra
  for (const dy of [-120, 0, 120]) { linea(ctx, [150, ZJ[1] + dy], [300, ZJ[1] + dy], C.y, 4, .8); arrowHead(ctx, [312, ZJ[1] + dy], 0, C.y, 1); }
  txt(ctx, 'luce del Sole', 232, ZJ[1] - 165, { size: 30, color: C.y });
  // l'orbita di Io
  ctx.save(); ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([6, 10]); ctx.beginPath(); ctx.arc(ZJ[0], ZJ[1], RIO, 0, TAU); ctx.stroke(); ctx.restore();
  disco(ctx, ZJ, RJ, COL_GIOVE(), 1);
  txt(ctx, 'Giove', ZJ[0], ZJ[1] + RJ + 34, { size: 30, color: C.ink });
  // Io: a velocità costante; nell'ombra si spegne
  if (t > TIO - .4) {
    const a = alfaIo(Math.max(t, TIO)), p = [ZJ[0] + RIO * Math.cos(a), ZJ[1] - RIO * Math.sin(a)];
    const kIo = P(t, TIO - .4, TIO);
    if (inOmbra(a)) hole(ctx, p, C.dim, kIo, 12); else dot(ctx, p, C.v, kIo, 12);
    drawRich(ctx, '{v:Io}', ZJ[0] + (RIO - 46) * Math.cos(a), ZJ[1] - (RIO - 46) * Math.sin(a), { size: 34, alpha: kIo });
  }
  chip(ctx, '{dim:visto dall’alto · distanze in scala, Giove e Io ingranditi}', 690, 760, P(t, 8.0, 8.6), 28);
  chip(ctx, '{dim:fermo immagine}', 1130, 300, life(t, FERMO[0], FERMO[1], .25, .25), 30);
  ctx.restore();
}

// ---------- 2 · la Terra, il Sole e Giove (21–84,8) ----------
const UA = 130, SOLE = [300, 455], GIOVE = [300 + 5.2 * UA, 455];   // in scala: Giove a 5,2 volte la distanza Terra–Sole
const PHI1 = 150 * DEG, TM = [30.0, 33.6];                           // cinque mesi: 150° a velocità angolare costante
const phi = t => PHI1 * clamp((t - TM[0]) / (TM[1] - TM[0]));
const terra = f => [SOLE[0] + UA * Math.cos(f), SOLE[1] - UA * Math.sin(f)];
const distUA = f => Math.hypot(5.2 - Math.cos(f), Math.sin(f));      // Terra–Giove, in distanze Terra–Sole
const T0 = terra(0), T1 = terra(PHI1), T180 = terra(Math.PI);
const D0 = distUA(0) * UA;                                           // 546 px: 630 milioni di km
const unit = (a, b) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
const lungo = (a, u, s) => [a[0] + u[0] * s, a[1] + u[1] * s];
// i due lampi: partono insieme da Giove a velocità costante (al rallentatore)
const TL = 38.9, VL = 120;                                           // px/s: il primo arriva a 43,45 s, il secondo a 45,5 s
function scenaSole(ctx, t) {
  if (t < 20.8 || t > T_FINE + .4) return;
  const al = P(t, 21.0, 21.7) * (1 - P(t, T_FINE - .5, T_FINE));
  ctx.save(); ctx.globalAlpha *= al;
  // le orbite
  ctx.save(); ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([6, 10]);
  ctx.beginPath(); ctx.arc(SOLE[0], SOLE[1], UA, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(SOLE[0], SOLE[1], 5.2 * UA, -26 * DEG, 26 * DEG); ctx.stroke(); ctx.restore();
  const f = phi(t), Tt = terra(f), dT = distUA(f) * UA, u = unit(GIOVE, Tt);
  // la linea di vista Giove → Terra, e il tratto in più oltre la distanza di prima
  const kV = P(t, 21.6, 22.3);
  dashed(ctx, GIOVE, Tt, C.dim, kV, .9);
  const kArco = life(t, 30.0, 52.2, .5, .5);
  if (kArco > 0) {   // l'arco con centro in Giove e raggio uguale alla distanza di prima
    ctx.save(); ctx.globalAlpha *= kArco * .8; ctx.strokeStyle = css(C.v); ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
    const aF = Math.atan2(T1[1] - GIOVE[1], T1[0] - GIOVE[0]) + TAU;   // dalla Terra di prima fino alla linea di vista di adesso
    ctx.beginPath(); ctx.arc(GIOVE[0], GIOVE[1], D0, Math.PI - 2 * DEG, aF + 3 * DEG); ctx.stroke(); ctx.restore();
  }
  const kTr = life(t, 30.0, 52.2, .4, .5);
  if (kTr > 0 && dT - D0 > 2) linea(ctx, lungo(GIOVE, u, D0), Tt, C.v, 9, kTr);
  // il diametro dell'orbita
  const kD = life(t, 52.3, T_FINE, .5, .5);
  if (kD > 0) {
    linea(ctx, T180, T0, C.v, 7, kD, P(t, 52.4, 53.4));
    hole(ctx, T180, C.x, kD, 11);
    txt(ctx, 'diametro: 300 milioni di km', 160, SOLE[1] + UA + 50, { size: 30, color: C.v, align: 'left', alpha: kD });
  }
  // il Sole, Giove, la Terra di prima e quella di adesso
  disco(ctx, SOLE, 30, C.y, 1, 30);
  txt(ctx, 'Sole', SOLE[0], SOLE[1] + 58, { size: 30, color: C.dim, alpha: 1 - kD });
  disco(ctx, GIOVE, 24, COL_GIOVE(), 1);
  txt(ctx, 'Giove', GIOVE[0], GIOVE[1] + 52, { size: 30, color: C.ink });
  const kPrima = life(t, 30.2, 52.2, .5, .5);
  if (kPrima > 0) { hole(ctx, T0, C.x, kPrima, 11); txt(ctx, 'prima', T0[0] + 46, T0[1] + 40, { size: 30, color: C.dim, alpha: kPrima }); }
  dot(ctx, Tt, C.x, 1, 12);
  txt(ctx, 'Terra', Tt[0] + (f > 1 ? -4 : 6), Tt[1] + (f > 1 ? -40 : 40), { size: 30, color: C.x });
  // i due lampi
  const kL = life(t, TL - .2, 52.2, .2, .5);
  if (kL > 0) {
    // arrivato, il lampo si spegne sulla Terra
    const s = VL * Math.max(0, t - TL), u0 = unit(GIOVE, T0), arr = d => TL + d / VL;
    disco(ctx, lungo(GIOVE, u0, Math.min(s, D0)), 9, C.y, kL * (1 - P(t, arr(D0) + .3, arr(D0) + .8)), 24);
    disco(ctx, lungo(GIOVE, u, Math.min(s, dT)), 9, C.y, kL * (1 - P(t, 47.2, 47.6)), 24);
  }
  chip(ctx, '{dim:visto dall’alto · distanze in scala, Sole e pianeti ingranditi}', 690, 760, P(t, 21.4, 22.0) * (1 - P(t, 65.6, 66.0)), 28);
  chip(ctx, '{dim:la luce al rallentatore}', 690, 160, life(t, TL - .2, 47.6, .4, .4), 30);
  chip(ctx, '{v:eclissi in ritardo}', 690, 160, life(t, 34.3, 38.6, .4, .3), 34);
  ctx.restore();
}

// ---------- la scheda di destra ----------
const RC = [1320, 110, 490, 690];
function riga(ctx, nome, val, y, col, al) {
  if (al <= 0.01) return;
  drawRich(ctx, nome, 1355, y, { size: 32, align: 'left', alpha: al });
  if (/^[\d,]+$/.test(val)) { ctx.save(); ctx.globalAlpha *= al; fixedNum(ctx, val, 1775, y, 44, col); ctx.restore(); }   // i numeri che cambiano
  else txt(ctx, val, 1775, y, { size: 44, weight: 500, color: col, align: 'right', alpha: al });
}
function scenaScheda(ctx, t) {
  if (t < 7.6 || t > T_FINE + .4) return;
  const al = P(t, 7.8, 8.4) * (1 - P(t, T_FINE - .5, T_FINE));
  card(ctx, ...RC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // Io
  const kI = 1 - P(t, 20.7, 21.2);
  if (kI > 0) {
    ctx.save(); ctx.globalAlpha *= kI;
    conFont(TITOLI, () => drawRich(ctx, 'la luna Io', 1565, 170, { size: 38, weight: 600 }));
    drawRich(ctx, 'un giro: {v:42,5 ore}', 1565, 260, { size: 34, local: t - 8.2 });
    drawRich(ctx, '{dim:(qui: 3,5 s)}', 1565, 310, { size: 30, local: t - 8.4 });
    drawRich(ctx, 'a ogni giro\nun’{v:eclisse}', 1565, 430, { size: 34, lh: 1.35, alpha: P(t, 12.5, 13.0) });
    drawRich(ctx, '{g:sempre ogni 42,5 ore}', 1565, 560, { size: 34, alpha: P(t, 16.9, 17.4) });
    ctx.restore();
  }
  // le distanze
  const kD = P(t, 21.2, 21.8) * (1 - P(t, 52.2, 52.7));
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD;
    conFont(TITOLI, () => drawRich(ctx, 'distanze', 1565, 170, { size: 38, weight: 600 }));
    txt(ctx, 'in milioni di km', 1565, 220, { size: 30, color: C.dim });
    const f = phi(t), dk = distUA(f) * 150;
    riga(ctx, 'Terra–Sole', '150', 300, C.ink, 1);
    riga(ctx, 'Sole–Giove', '780', 360, C.ink, 1);
    riga(ctx, 'Terra–Giove', String(Math.round(dk)), 440, C.x, P(t, 21.6, 22.1));
    riga(ctx, '{v:tratto in più}', String(Math.round(dk - 630)), 520, C.v, P(t, 30.0, 30.5));
    drawRich(ctx, 'ritardo =\n{v:tratto in più} / velocità', 1565, 660, { size: 32, lh: 1.35, alpha: P(t, 48.0, 48.6) });
    ctx.restore();
  }
  // il diametro, il ritardo e il conto
  const kC = P(t, 52.4, 53.0);
  if (kC > 0) {
    ctx.save(); ctx.globalAlpha *= kC;
    conFont(TITOLI, () => drawRich(ctx, 'il diametro', 1565, 170, { size: 38, weight: 600 }));
    drawRich(ctx, '{v:300 milioni di km}', 1565, 235, { size: 34 });
    drawRich(ctx, '= {mink:3·10¹¹} m', 1565, 290, { size: 34, alpha: P(t, 53.2, 53.7) });
    const kR = P(t, 57.2, 57.7) * (1 - P(t, 75.0, 75.5));
    if (kR > 0) {
      ctx.save(); ctx.globalAlpha *= kR;
      riga(ctx, 'Rømer, 1676', '22 min', 365, C.v, 1);
      ctx.save(); ctx.globalAlpha *= P(t, 61.8, 62.3);
      riga(ctx, 'oggi', '16,7 min', 425, C.g, 1);
      txt(ctx, '= 1000 s', 1775, 472, { size: 32, color: C.g, align: 'right' });
      ctx.restore();
      drawSeq(ctx, ['velocità =', { num: '{mink:3·10¹¹} m', den: '1000 s' }], 1565, 565, 40, { alpha: P(t, 66.2, 66.6), local: t - 66.2 });
      drawRich(ctx, '{mink:c} = {mg:3·10⁸} {g:m/s}', 1565, 672, { size: 44, local: t - 70.9 });
      drawRich(ctx, '= {g:300 000 km/s}', 1565, 735, { size: 36, local: t - 71.6 });
      ctx.restore();
    }
    const kG = P(t, 75.3, 75.8);
    if (kG > 0) {
      ctx.save(); ctx.globalAlpha *= kG;
      drawRich(ctx, '{mink:c} = {mg:300 000} {g:km/s}', 1565, 375, { size: 40 });
      drawRich(ctx, 'giro della Terra: 40 000 km', 1565, 465, { size: 34 });
      drawSeq(ctx, [{ num: '300 000 km', den: '40 000 km' }, '= {g:7,5 giri}'], 1565, 590, 36, { local: t - 75.6 });
      drawRich(ctx, '{v:Fizeau, 1849}', 1565, 715, { size: 36, alpha: P(t, 79.8, 80.3) });
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le lune di Giove in ritardo', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaCarta(ctx, t) {
  if (t < 7.4 || t > T_FINE + .4) return;
  card(ctx, ...CS, P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .5, T_FINE)));
}
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 94.4, 95.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La luce non arriva in un istante:\nci mette tempo a fare strada.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'le eclissi di Io\narrivano {v:in ritardo}'], [960, 'il ritardo è il\n{v:tratto in più} della luce'], [1430, '{mink:c} ≈ {mg:300 000} {g:km/s}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 2 ? 38 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): distanze, tratto in più, ritardo vero, c
  const verifica = {
    vicinaMlnKm: distUA(0) * 150, lontanaMlnKm: +(distUA(PHI1) * 150).toFixed(1), trattoMlnKm: +((distUA(PHI1) - distUA(0)) * 150).toFixed(1),
    ritardoVeroMin: +(3e11 / 3e8 / 60).toFixed(2), cRomer: +(3e11 / (22 * 60)).toExponential(2), giri: 300000 / 40000,
    elongazioneGiove: +(Math.acos(((Math.cos(PHI1)) * (Math.cos(PHI1) - 5.2) + Math.sin(PHI1) ** 2) / distUA(PHI1)) / DEG).toFixed(1),
    ombraGradi: +(2 * Math.asin(RJ / RIO) / DEG).toFixed(1),
  };
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 7.9, .5],                                                // Giove e Io
    ['tono', 8.0, 11.5, [.79, .42, .1, .01, .21, .58, .9, .99, .79]],                 // Io fa un giro
    ['pop', 12.7, .4], ['pop', 13.6, .45],                                            // l'eclisse: Io sparisce, fermo
    ['ding', 17.3],                                                                   // sempre ogni 42,5 ore
    ['soffio', 21.0], ['traccia', 21.6, 22.3],                                        // Sole, Terra, Giove: la linea di vista
    ['tono', 30.0, 33.6, [.09, .13, .27, .44, .63, .78, .89]], ['pop', 30.3, .45],    // cinque mesi: la distanza cresce
    ['pop', 34.5, .5],                                                                // eclissi in ritardo
    ['pop', 38.9, .5], ['tono', 38.9, 43.45, [.2, .4, .6, .8]],                       // partono i due lampi
    ['pop', 43.45, .45], ['pop', 45.5, .6],                                           // arriva il primo, poi il secondo
    ['pop', 48.3, .45],                                                               // ritardo = tratto in più / velocità
    ['soffio', 52.3], ['traccia', 52.4, 53.4], ['pop', 53.5, .45],                    // il diametro dell'orbita
    ['pop', 57.5, .5], ['pop', 62.0, .55], ['ding', 62.3],                            // 22 minuti, poi 16,7
    ['pop', 66.4, .5], ['pop', 71.6, .55],                                            // velocità = distanza / tempo
    ['pop', 75.5, .5], ['ding', 76.4],                                                // 7,5 giri della Terra
    ['pop', 80.0, .45],                                                               // Fizeau
    ['soffio', 84.9], ['pop', 86.4, .5], ['pop', 86.9, .6], ['pop', 87.4, .7],        // in una frase
  ];
  return {
    titolo: 'Le lune di Giove in ritardo', durata: 96, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 20.8, 'le eclissi di Io'], [20.8, 52.0, 'il ritardo'], [52.0, 84.6, 'quanto è veloce la luce']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCarta(ctx, t); scenaIo(ctx, t); scenaSole(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
