'use strict';
/* Due passeggiate da 5 km — stessa strada percorsa, arrivi diversi: lo spostamento è un vettore (modulo, direzione,
   verso); la strada percorsa è uno scalare. Argomento: vettori. */
CVIDEO.registra('vettori/spostamento', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, ball, dot, glowStroke, dashed, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [95.4, 190], [96.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [95.4, 1050], [96.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [95.4, 2.2], [96.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [95.4, 2], [96.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [95.4, -1.5], [96.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.0, 'sorpreso'], [25.4, 'pensa'],
  [30.0, 'neutro'], [39.6, 'felice'], [44.2, 'neutro'], [57.6, 'felice'], [62.8, 'neutro'], [81.4, 'sorpreso'],
  [86.0, 'neutro'], [90.8, 'felice'], [95.4, 'neutro'], [98.1, 'felice'], [102.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Due passeggiate da 5 km:\narrivano nello stesso posto?'],
  [7.9, 12.0, 'Due persone partono\ndallo stesso punto.'],
  [12.2, 16.4, 'La prima cammina 5 km\ndritta verso est.'],
  [16.6, 20.8, 'La seconda cammina 5 km\ndritta verso nord.'],
  [21.0, 25.2, 'Stessa strada percorsa, ma\narrivano in posti {r:diversi}!'],
  [25.4, 29.8, 'Dire «5 km» non basta:\nbisogna dire anche {v:dove}.'],
  [30.0, 34.6, 'Una terza cammina 5 km\nverso ovest…'],
  [34.8, 39.4, '…sulla stessa retta della prima,\nma nel verso {v:opposto}.'],
  [39.6, 44.0, 'Ogni spostamento si disegna\ncon una {v:freccia}: è un {v:vettore}.'],
  [44.2, 48.6, 'La lunghezza della freccia è il\n{v:modulo}: 5 km, sempre positivo.'],
  [48.8, 53.2, 'La retta su cui sta è la\n{v:direzione}: qui est–ovest.'],
  [53.4, 57.4, 'La punta dice il {v:verso}:\nverso est.'],
  [57.6, 62.4, 'Modulo, direzione e verso: senza\ntutti e tre non sai dove arrivi.'],
  [62.8, 67.6, 'Un giro: 1 km a nord,\n4 a est, 1 a sud.'],
  [67.8, 72.0, 'La {g:strada percorsa} è 6 km:\nè solo un numero.'],
  [72.2, 76.8, 'Lo {v:spostamento} va dalla partenza\nall’arrivo: 4 km verso est.'],
  [77.0, 81.2, 'Andata e ritorno:\n5 km di strada…'],
  [81.4, 85.8, '…ma spostamento {g:zero}: sei di\nnuovo al punto di partenza.'],
  [86.0, 90.6, 'Massa, tempo, temperatura, strada\npercorsa: sono {g:scalari}, solo un numero.'],
  [90.8, 95.2, 'Spostamento, velocità, forza\nsono {v:vettori}: serve la freccia.'],
  [98.1, 103.2, 'Un vettore dice quanto, in che\ndirezione e in che verso.'],
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
// etichetta piccola sopra, valore grande sotto: nel pannello stretto non si accavallano
function voce(ctx, nome, valore, y, al = 1, x = 1340) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, nome, x, y, { size: 32, color: C.dim, align: 'left' });
  drawRich(ctx, valore, x, y + 52, { size: 44, align: 'left' });
  ctx.restore();
}

// ---------- la mappa: 76 px per km, partenza in S ----------
const MAP = [372, 110, 900, 690], PAN = [1300, 110, 540, 690];
const S = [822, 640], U = 76;
const km = (x, y) => [S[0] + x * U, S[1] - y * U];
// le passeggiate dritte: si cammina a velocità costante, quindi la strada fatta cresce come il tempo
const DRITTE = [
  { fine: [5, 0], t0: 12.5, t1: 15.5, n: '1', off: [0, 50], testo: '5 km verso est' },
  { fine: [0, 5], t0: 16.9, t1: 19.9, n: '2', off: [50, 0], testo: '5 km verso nord' },
  { fine: [-5, 0], t0: 30.3, t1: 33.3, n: '3', off: [0, 50], testo: '5 km verso ovest' },
];
// il giro a U: 1 km a nord, 4 a est, 1 a sud (6 km di strada), a velocità costante fra 63,1 e 67,3
const GIRO = [[0, 0], [0, 1], [4, 1], [4, 0]], G0 = 63.1, G1 = 67.3;
// andata e ritorno: 2,5 km verso nord e indietro, fra 77,4 e 81,0; si sale a sinistra e si scende a destra
const AR0 = 77.4, AR1 = 81.0;

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due passeggiate da 5 km', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–3 · la mappa (7,5–86,4)
function sceneMappa(ctx, t) {
  if (t < 7.5 || t > 86.5) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 85.8, 86.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...MAP);
  // quadretti da 1 km
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let i = -5; i <= 5; i++) { const x = S[0] + i * U; ctx.moveTo(x, 140); ctx.lineTo(x, 770); }
  for (let j = -1; j <= 6; j++) { const y = S[1] - j * U; ctx.moveTo(392, y); ctx.lineTo(1252, y); }
  ctx.stroke();
  // la rosa dei venti ridotta al nord, e la scala
  freccia(ctx, [1214, 262], [1214, 182], C.ink, .8, 5);
  txt(ctx, 'N', 1214, 152, { size: 34, weight: 600 });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(410, 760); ctx.lineTo(410 + U, 760); ctx.moveTo(410, 750); ctx.lineTo(410, 770); ctx.moveTo(410 + U, 750); ctx.lineTo(410 + U, 770); ctx.stroke();
  txt(ctx, '1 km', 410 + U + 16, 760, { size: 30, color: C.dim, align: 'left' });
  dot(ctx, S, C.ink, P(t, 8.2, 8.6, E.back), 10);
  // le camminate vanno a 1 km al secondo: tempo accelerato, e lo si scrive mentre si cammina
  const kAcc = Math.max(life(t, 12.4, 33.6, .3, .4), life(t, 62.9, 67.6, .3, .4), life(t, 77.2, 81.3, .3, .4));
  txt(ctx, 'tempo accelerato', 1240, 760, { size: 30, color: C.dim, align: 'right', alpha: kAcc });
  txt(ctx, 'partenza', S[0], S[1] + 46, { size: 30, color: C.dim, alpha: P(t, 8.4, 8.9) });

  // 1 · tre passeggiate dritte
  const kVia = 1 - P(t, 39.9, 40.6);
  DRITTE.forEach(D => {
    if (t < D.t0) return;
    const k = P(t, D.t0, D.t1, E.lin), fin = km(...D.fine);
    const p = [lerp(S[0], fin[0], k), lerp(S[1], fin[1], k)];
    if (kVia > 0) {
      ctx.save(); ctx.globalAlpha *= kVia;
      ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      dot(ctx, p, C.ink, 1, 11);
      ctx.restore();
    }
    const kb = P(t, D.t1, D.t1 + .4, E.back) * (1 - P(t, 44.2, 44.7));
    ball(ctx, fin[0] + D.off[0], fin[1] + D.off[1], D.n, C.g, { r: 22, scale: kb });
  });
  // arrivi diversi: la distanza fra il primo e il secondo arrivo
  const kd = life(t, 21.2, 25.2, .4, .4);
  if (kd > 0) dashed(ctx, km(5, 0), km(0, 5), C.r, P(t, 21.2, 21.9), kd);
  // la stessa retta per la prima e la terza
  const kr = life(t, 35.0, 39.6, .4, .4);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    dashed(ctx, [400, S[1] - 26], [1244, S[1] - 26], C.dim, P(t, 35.0, 35.8));
    drawRich(ctx, '{dim:stessa retta}', km(-2.5, 0)[0], S[1] - 60, { size: 32 });
    ctx.restore();
  }

  // 2 · le frecce: modulo, direzione, verso
  const fa = life(t, 39.9, 62.6, .3, .4);
  if (fa > 0) {
    ctx.save(); ctx.globalAlpha *= fa;
    const kDir = P(t, 48.9, 49.6);
    if (kDir > 0) {
      ctx.save(); ctx.globalAlpha *= kDir; ctx.strokeStyle = css(C.v, .7); ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
      ctx.beginPath(); ctx.moveTo(398, S[1]); ctx.lineTo(1246, S[1]); ctx.stroke(); ctx.setLineDash([]);
      drawRich(ctx, '{v:direzione}', 560, S[1] - 36, { size: 34 });
      ctx.restore();
    }
    const kf = P(t, 39.9, 40.9), smorza = 1 - .72 * P(t, 44.2, 44.8);
    DRITTE.forEach((D, i) => {
      const fin = km(...D.fine);
      freccia(ctx, S, [lerp(S[0], fin[0], kf), lerp(S[1], fin[1], kf)], C.v, i ? smorza : 1, 8);
    });
    const kMod = P(t, 44.4, 45.0);
    if (kMod > 0) {
      const y = S[1] - 44, a = S[0] + 6, b = km(5, 0)[0] - 4;
      ctx.save(); ctx.globalAlpha *= kMod; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.moveTo(a, y - 12); ctx.lineTo(a, y + 12); ctx.moveTo(b, y - 12); ctx.lineTo(b, y + 12); ctx.stroke();
      drawRich(ctx, '{v:5 km}', (a + b) / 2, y - 34, { size: 40 });
      ctx.restore();
    }
    const kVer = P(t, 53.5, 54.1, E.back);
    if (kVer > 0) {
      const [hx, hy] = km(5, 0);
      ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(hx - 8, hy, 38 * kVer, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{v:verso}', hx - 8, hy + 66, { size: 34, alpha: P(t, 53.7, 54.2) });
    }
    ctx.restore();
  }

  // 3 · il giro a U: strada 6 km, spostamento 4 km verso est
  const ga = life(t, 63.0, 77.0, .4, .4);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha *= ga;
    const pts = GIRO.map(p => km(...p)), k = P(t, G0, G1, E.lin);
    ctx.save(); ctx.globalAlpha *= .55; const e = glowStroke(ctx, pts, k, C.ink, 5); ctx.restore();
    if (e) dot(ctx, e[0], C.ink, 1, 11);
    const nomi = [[0.25, '1 km', km(0, .5), [-22, 0], 'right'], [0.5, '4 km', km(2, 1), [0, -34], 'center'], [5 / 6 + .02, '1 km', km(4, .5), [22, 0], 'left']];
    for (const [kk, s, p, o, a] of nomi) txt(ctx, s, p[0] + o[0], p[1] + o[1], { size: 30, color: C.dim, align: a, alpha: clamp((k - kk + .02) / .08) });
    const ks = P(t, 72.5, 73.3);
    if (ks > 0) {
      freccia(ctx, S, [lerp(S[0], km(4, 0)[0], ks), S[1]], C.v, 1, 8);
      drawRich(ctx, '{v:4 km}', km(2, 0)[0] + 40, S[1] + 46, { size: 36, alpha: P(t, 73.1, 73.6) });
    }
    ctx.restore();
  }
  // andata e ritorno
  const ra = life(t, 77.2, 85.8, .4, .4);
  if (ra > 0) {
    ctx.save(); ctx.globalAlpha *= ra;
    const d = 5 * P(t, AR0, AR1, E.lin), su = Math.min(d, 2.5), giu = Math.max(0, d - 2.5);
    ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...km(-.1, 0)); ctx.lineTo(...km(-.1, su));
    if (giu > 0) { ctx.lineTo(...km(.1, 2.5)); ctx.lineTo(...km(.1, 2.5 - giu)); }
    ctx.stroke();
    dot(ctx, giu > 0 ? km(.1, 2.5 - giu) : km(-.1, su), C.ink, 1, 11);
    const kz = P(t, 81.5, 82.0, E.back);
    if (kz > 0) {
      ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(S[0], S[1], 30 * kz, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:spostamento zero}', S[0] + 54, S[1] - 50, { size: 36, align: 'left', alpha: P(t, 81.7, 82.2) });
    }
    ctx.restore();
  }
  ctx.restore();
}

// il pannello a destra della mappa
function scenePannello(ctx, t) {
  if (t < 12 || t > 86.5) return;
  const al = P(t, 12.2, 12.8) * (1 - P(t, 85.8, 86.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...PAN);
  const cx = PAN[0] + PAN[2] / 2;
  // 1 · le passeggiate
  const a1 = 1 - P(t, 39.4, 39.9);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    conFont(TITOLI, () => drawRich(ctx, 'le passeggiate', cx, 175, { size: 40, weight: 600 }));
    DRITTE.forEach((D, i) => {
      const k = P(t, D.t1, D.t1 + .4); if (k <= 0) return;
      ball(ctx, 1352, 270 + i * 82, D.n, C.g, { r: 22, scale: P(t, D.t1, D.t1 + .4, E.back) });
      txt(ctx, D.testo, 1392, 270 + i * 82, { size: 38, align: 'left', alpha: k });
    });
    drawRich(ctx, '{r:arrivi diversi}', cx, 560, { size: 40, alpha: P(t, 21.2, 21.7) });
    drawRich(ctx, '«5 km» … {v:dove?}', cx, 650, { size: 44, alpha: P(t, 25.6, 26.1) });
    ctx.restore();
  }
  // 2 · un vettore
  const a2 = life(t, 39.7, 62.6, .4, .4);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    conFont(TITOLI, () => drawRich(ctx, 'un vettore', cx, 175, { size: 40, weight: 600 }));
    voce(ctx, 'modulo', '{v:5 km}', 280, P(t, 44.4, 44.9));
    voce(ctx, 'direzione', '{v:est–ovest}', 420, P(t, 48.9, 49.4));
    voce(ctx, 'verso', '{v:est}', 560, P(t, 53.5, 54.0));
    ctx.restore();
  }
  // 3 · il giro e l'andata e ritorno: la strada cresce mentre si cammina
  const giro = life(t, 62.8, 77.0, .4, .4), ar = life(t, 77.0, 85.8, .4, .4);
  for (const [a, nome, d, sp, ts] of [[giro, 'un giro', 6 * P(t, G0, G1, E.lin), '{v:4 km verso est}', 72.5],
    [ar, 'andata e ritorno', 5 * P(t, AR0, AR1, E.lin), '{g:zero}', 81.5]]) {
    if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha *= a;
    conFont(TITOLI, () => drawRich(ctx, nome, cx, 175, { size: 40, weight: 600 }));
    txt(ctx, 'strada percorsa', 1340, 280, { size: 32, color: C.dim, align: 'left' });
    fixedNum(ctx, fmtN(d, 1), 1414, 334, 48, C.ink);
    txt(ctx, 'km', 1430, 334, { size: 40, color: C.ink, align: 'left' });
    if (a === giro) txt(ctx, 'solo un numero', 1340, 396, { size: 32, color: C.g, align: 'left', alpha: P(t, 67.9, 68.4) });
    voce(ctx, 'spostamento', sp, 490, P(t, ts, ts + .5));
    ctx.restore();
  }
  ctx.restore();
}

// 4 · scalari e vettori (86–95,4)
function sceneScalari(ctx, t) {
  if (t < 85.9 || t > 95.8) return;
  const al = 1 - P(t, 95.1, 95.7);
  ctx.save(); ctx.globalAlpha *= al;
  const ka = P(t, 86.0, 86.6);
  card(ctx, 372, 110, 700, 690, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  conFont(TITOLI, () => drawRich(ctx, '{g:scalari}', 722, 180, { size: 48, weight: 600, alpha: P(t, 86.1, 86.6) }));
  txt(ctx, 'un numero con l’unità', 722, 245, { size: 32, color: C.dim });
  const RIGHE = [['massa', '60 kg', 86.3], ['tempo', '2 h', 86.8], ['temperatura', '20 °C', 87.3], ['strada percorsa', '6 km', 87.8]];
  RIGHE.forEach(([n, v, a], i) => {
    const k = P(t, a, a + .4); if (k <= 0) return;
    txt(ctx, n, 420, 350 + i * 100, { size: 40, align: 'left', alpha: k });
    txt(ctx, v, 1030, 350 + i * 100, { size: 44, weight: 600, color: C.g, align: 'right', alpha: k });
  });
  ctx.restore();
  const kb = P(t, 90.8, 91.4);
  card(ctx, 1110, 110, 730, 690, kb);
  ctx.save(); ctx.globalAlpha *= kb;
  conFont(TITOLI, () => drawRich(ctx, '{v:vettori}', 1475, 180, { size: 48, weight: 600 }));
  txt(ctx, 'modulo, direzione e verso', 1475, 245, { size: 32, color: C.dim });
  // una freccia per ognuno, nel colore di sempre
  const V = [['spostamento', C.v, [1560, 350], [1780, 350]], ['velocità', C.x, [1560, 490], [1750, 410]], ['forza', C.y, [1640, 560], [1640, 720]]];
  V.forEach(([n, col, a, b], i) => {
    const k = P(t, 91.1 + i * .4, 91.6 + i * .4); if (k <= 0) return;
    txt(ctx, n, 1150, [350, 470, 640][i], { size: 40, align: 'left', alpha: k });
    freccia(ctx, a, [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], col, 1, 8);
  });
  ctx.restore();
  ctx.restore();
}

// 5 · in una frase (95,5–105,7)
function sceneFine(ctx, t) {
  if (t < 95.5) return;
  const al = 1 - P(t, 103.5, 104.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 95.7 });
    drawRich(ctx, 'Lo spostamento è un {v:vettore}: modulo, direzione\ne verso. La strada percorsa è uno {g:scalare}.', W / 2, 290, { size: 60, weight: 600, local: t - 96.1, stagger: .08 });
  });
  const pills = [[490, '{v:modulo}: quanto,\ncon l’unità'], [960, '{v:direzione} e {v:verso}:\ndove va'], [1430, 'uno {g:scalare}:\nsolo un numero']];
  pills.forEach(([x, s], i) => {
    const a = 97.7 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nelle camminate il tono segue la strada percorsa, da 0 (0) a 6 km (1);
  // nell'andata e ritorno segue la posizione verso nord, da 0 (0) a 5 km (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.3, .3],                                                // la mappa, la partenza
    ['tono', 12.5, 15.5, [0, .83]], ['pop', 15.6, .55],                               // la prima: 5 km verso est
    ['tono', 16.9, 19.9, [0, .83]], ['pop', 20.0, .65],                               // la seconda: 5 km verso nord
    ['traccia', 21.2, 21.9], ['pop', 21.3, .3], ['pop', 25.7, .55],                   // arrivi diversi; dove?
    ['tono', 30.3, 33.3, [0, .83]], ['pop', 33.4, .45], ['traccia', 35.0, 35.8],      // la terza, verso ovest; stessa retta
    ['traccia', 39.9, 40.9], ['pop', 40.1, .5],                                       // le frecce: vettori
    ['pop', 44.5, .5], ['traccia', 48.9, 49.6], ['pop', 49.1, .55], ['pop', 53.6, .6],   // modulo, direzione, verso
    ['tono', 63.1, 67.3, [0, 1]], ['pop', 68.0, .4],                                  // il giro: 6 km, solo un numero
    ['traccia', 72.5, 73.3], ['pop', 73.4, .55],                                      // spostamento: 4 km verso est
    ['tono', 77.4, 81.0, [0, .25, .5, .25, 0]], ['ding', 81.8],                       // andata e ritorno: spostamento zero
    ['soffio', 86.0], ['pop', 86.4, .4], ['pop', 86.9, .45], ['pop', 87.4, .5], ['pop', 87.9, .55],   // gli scalari
    ['pop', 90.9, .6], ['traccia', 91.1, 92.4],                                       // i vettori: le loro frecce
    ['soffio', 95.7], ['pop', 97.7, .5], ['pop', 98.2, .6], ['pop', 98.7, .7],        // in una frase
  ];
  return {
    titolo: 'Due passeggiate da 5 km', durata: 105.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 39.4, 'stessa strada, arrivi diversi'], [39.4, 62.6, 'il vettore'], [62.6, 85.8, 'spostamento e strada percorsa'],
      [85.8, 95.2, 'scalari e vettori']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMappa(ctx, t); scenePannello(ctx, t); sceneScalari(ctx, t); sceneFine(ctx, t); },
  };
});
