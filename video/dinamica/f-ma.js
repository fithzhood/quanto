'use strict';
/* F = m·a — la stessa forza su un carrello vuoto e su uno carico: massa doppia, accelerazione metà; risultante e verso. Argomento: dinamica. */
CVIDEO.registra('dinamica/f-ma', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [86.6, 190], [87.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [86.6, 1050], [87.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [86.6, 2.2], [87.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [86.6, 2], [87.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [86.6, -1.5], [87.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.6, 'sorpreso'], [25.8, 'neutro'],
  [34.9, 'felice'], [38.6, 'neutro'], [45.7, 'felice'], [50.0, 'neutro'], [54.3, 'pensa'], [59.3, 'neutro'],
  [63.6, 'felice'], [68.0, 'neutro'], [76.2, 'sorpreso'], [82.3, 'felice'], [86.3, 'neutro'], [88.9, 'felice'],
  [94.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Stessa spinta, due carrelli:\nchi accelera di più?'],
  [7.9, 12.1, 'Due carrelli su rotaie {g:senza attrito}:\nuno vuoto, uno carico.'],
  [12.2, 17.0, 'Massa {mink:m} = 10 kg il vuoto,\n20 kg il carico: il doppio.'],
  [17.1, 21.5, 'Li spingo con la stessa forza {my:F},\n20 N, al rallentatore.'],
  [21.6, 25.6, 'Il vuoto scatta avanti,\nil carico resta indietro.'],
  [25.8, 30.3, 'Dopo 4 s: 16 m il vuoto,\nsolo 8 m il carico.'],
  [30.4, 34.8, 'Accelerazione {mv:a}: 2 m/s² il vuoto,\nsolo 1 m/s² il carico.'],
  [34.9, 38.2, 'Massa {g:doppia},\naccelerazione {g:metà}.'],
  [38.6, 41.8, 'È il {v:secondo principio}\ndella dinamica:'],
  [41.9, 45.6, 'la forza è uguale alla massa\nper l’accelerazione.'],
  [45.7, 49.9, 'Torna con tutti e due:\nfa sempre 20 N.'],
  [50.0, 54.2, 'A parità di forza, più massa\nvuol dire {g:meno} accelerazione.'],
  [54.3, 58.9, 'La massa misura l’{v:inerzia}: quanto\nil corpo resiste ai cambi di velocità.'],
  [59.3, 63.5, 'Se sul carrello agiscono più forze,\n{my:F} è la loro {y:risultante}.'],
  [63.6, 67.9, 'Avanti 30 N, indietro 10 N:\nrestano 20 N in avanti.'],
  [68.0, 72.8, 'Così {mv:a} = 20 N / 10 kg = 2 m/s²,\nin avanti.'],
  [72.9, 76.15, 'Ora il carrello corre a 6 m/s.'],
  [76.2, 81.2, 'Lo freno con 10 N: la velocità punta\navanti, ma {mv:a} punta {g:indietro}.'],
  [82.3, 86.2, 'L’accelerazione ha la direzione\ne il verso della {y:risultante}.'],
  [88.9, 93.6, 'L’accelerazione è la forza risultante\ndivisa per la massa.'],
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
const LC = 150;   // lunghezza del carrello in pixel (disegno schematico, non in scala)
function carrello(ctx, xb, yc, massa, carico, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.ink);
  for (const dx of [32, 118]) { ctx.beginPath(); ctx.arc(xb + dx, yc + 42, 13, 0, Math.PI * 2); ctx.fill(); }
  if (carico) {   // la cassa che lo carica
    ctx.fillStyle = css(mix(C.y, C.paper, .65)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(xb + 30, yc - 85, 90, 50); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xb + 30, yc - 85); ctx.lineTo(xb + 120, yc - 35); ctx.moveTo(xb + 120, yc - 85); ctx.lineTo(xb + 30, yc - 35); ctx.stroke();
  }
  ctx.fillStyle = css(mix(C.dim, C.paper, .78)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(xb, yc - 35, LC, 70, 10); ctx.fill(); ctx.stroke();
  txt(ctx, massa, xb + LC / 2, yc + 1, { size: 32, weight: 600 });
  ctx.restore();
}
function binario(ctx, yc, al, x0 = 120, x1 = 1800) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x0, yc + 56); ctx.lineTo(x1, yc + 56); ctx.stroke(); ctx.restore();
}
// il segno di pausa: due barrette, poi la scritta
function fermo(ctx, x, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28);
  txt(ctx, 'fermo immagine', x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, '{my:F}{mink: = m·}{mv:a}', W / 2, 190, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · la stessa forza su due carrelli (7,5–38,6)
const YA = 330, YB = 640, XB0 = 260, PX = 70, VSC = 30, FSC = 6, ASC = 60;
const CARRI = [{ y: YA, m: '10 kg', a: 2, carico: false, nome: 'vuoto' }, { y: YB, m: '20 kg', a: 1, carico: true, nome: 'carico' }];
const TP0 = 17.6, LENTO = 2, TFINE = 4;   // al rallentatore: 4 s veri in 8 s di video
const tp = t => clamp((t - TP0) / LENTO, 0, TFINE);
function sceneCarrelli(ctx, t) {
  if (t < 7.5 || t > 38.8) return;
  const al = life(t, 7.6, 38.6, .6, .5), tf = tp(t);
  ctx.save(); ctx.globalAlpha *= al;
  CARRI.forEach((K, i) => {
    const k = P(t, 7.7 + i * .3, 8.3 + i * .3);
    binario(ctx, K.y, k);
    ctx.save(); ctx.globalAlpha *= k;
    txt(ctx, K.nome, 130, K.y + 92, { size: 30, color: C.dim, align: 'left' });
    const s = K.a * tf * tf / 2, v = K.a * tf, xb = XB0 + s * PX;
    carrello(ctx, xb, K.y, K.m, K.carico);
    if (t >= TP0) {
      freccia(ctx, [xb - 4 - 20 * FSC, K.y], [xb - 4, K.y], C.y);
      drawRich(ctx, '{my:F} = 20 N', xb - 84, K.y - 44, { size: 32 });
    }
    if (v > 0) {
      const L = v * VSC;
      freccia(ctx, [xb + LC + 6, K.y - 6], [xb + LC + 6 + L, K.y - 6], C.x);
      drawRich(ctx, '{x:velocità}', xb + LC + 24 + Math.max(L, 110) / 2, K.y + 34, { size: 30 });
    }
    // l'accelerazione, costante finché la forza agisce: compare quando Stilla la nomina
    const ka = P(t, 30.5, 31.1);
    if (ka > 0) {
      const ya = K.y - 35 - (K.carico ? 50 : 0) - 26, xc = xb + LC / 2;
      freccia(ctx, [xc, ya], [xc + K.a * ASC, ya], C.v, ka);
      drawRich(ctx, '{mv:a} = ' + K.a + ' m/s²', xc + K.a * ASC + 16, ya, { size: 32, align: 'left', alpha: ka });
    }
    // fermo a 4 s: lo spazio percorso
    const kd = P(t, 25.9, 26.5);
    if (kd > 0) {
      ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5;
      const yq = K.y + 84;
      ctx.beginPath(); ctx.moveTo(XB0, yq); ctx.lineTo(xb, yq); ctx.moveTo(XB0, yq - 10); ctx.lineTo(XB0, yq + 10); ctx.moveTo(xb, yq - 10); ctx.lineTo(xb, yq + 10); ctx.stroke();
      txt(ctx, fmtN(s, 0) + ' m', (XB0 + xb) / 2, yq + 28, { size: 34, weight: 600 });
      ctx.restore();
    }
    ctx.restore();
  });
  // il cronometro dei 4 s veri
  const kc = P(t, 16.8, 17.4);
  if (kc > 0) {
    card(ctx, 1480, 105, 360, 104, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    drawRich(ctx, '{dim:tempo}  ' + fmtN(tf, 1) + ' s', 1660, 140, { size: 36 });
    if (t < 25.6) txt(ctx, 'al rallentatore', 1660, 180, { size: 30, color: C.dim });
    else fermo(ctx, 1530, 180, 1);
    ctx.restore();
  }
  ctx.restore();
}

// 2 · il secondo principio (38,4–59)
function scenePrincipio(ctx, t) {
  if (t < 38.2 || t > 59.4) return;
  const al = life(t, 38.4, 59.2, .6, .5);
  card(ctx, 360, 110, 1200, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'secondo principio della dinamica', 960, 168, { size: 40, weight: 600 }));
  drawRich(ctx, '{my:F}{mink: = m·}{mv:a}', 960, 282, { size: 110, local: t - 39.6, stagger: .2 });
  drawRich(ctx, '{my:F}: la risultante delle forze sul corpo, in N', 960, 392, { size: 34, local: t - 42.2, stagger: .03 });
  drawRich(ctx, '{mink:m}: la massa, in kg   ·   {mv:a}: l’accelerazione, in m/s²', 960, 440, { size: 34, local: t - 43.0, stagger: .03 });
  drawRich(ctx, '{dim:vuoto}     {y:20 N} = 10 kg · {v:2 m/s²}', 960, 528, { size: 44, local: t - 46.0 });
  drawRich(ctx, '{dim:carico}     {y:20 N} = 20 kg · {v:1 m/s²}', 960, 590, { size: 44, local: t - 46.8 });
  drawRich(ctx, '{mv:a}{mink: = }{my:F}{mink: / m}', 960, 672, { size: 56, local: t - 50.4 });
  drawRich(ctx, 'la massa è {v:inerzia}: resiste ai cambi di velocità', 960, 742, { size: 34, local: t - 54.6, stagger: .03 });
  ctx.restore();
}

// 3 · la risultante (59–73) e il verso dell'accelerazione (73–86,6)
const Y3 = 480, PX3 = 30, VSC3 = 32;
function sceneRisultante(ctx, t) {
  if (t < 59 || t > 73.2) return;
  const al = life(t, 59.2, 72.9, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  binario(ctx, Y3, 1);
  const T0 = 68.2, d = Math.max(0, t - T0), xb = 560 + d * d * PX3;   // a = 2 m/s²: s = ½·2·t²
  const xc = xb + LC / 2, kf = P(t, 59.6, 60.2);
  carrello(ctx, xb, Y3, '10 kg', false);
  fermo(ctx, 520, 270, life(t, 59.6, T0, .4, .3));
  // le due forze sullo stesso carrello
  freccia(ctx, [xb + LC + 4, Y3], [xb + LC + 4 + 30 * FSC, Y3], C.y, kf);
  freccia(ctx, [xb - 4, Y3], [xb - 4 - 10 * FSC, Y3], C.y, kf);
  drawRich(ctx, '{y:30 N}', xb + LC + 4 + 15 * FSC, Y3 - 44, { size: 32, alpha: kf });
  drawRich(ctx, '{y:10 N}', xb - 50, Y3 - 44, { size: 32, alpha: kf });
  // la loro somma
  const kr = P(t, 64.6, 65.3);
  freccia(ctx, [xc, Y3 - 105], [xc + 20 * FSC, Y3 - 105], C.y, kr, 9);
  drawRich(ctx, '{y:risultante 20 N}', xc + 20 * FSC + 16, Y3 - 105, { size: 32, align: 'left', alpha: kr });
  const ka = P(t, 68.2, 68.8);
  freccia(ctx, [xc, Y3 - 160], [xc + 2 * ASC, Y3 - 160], C.v, ka);
  drawRich(ctx, '{mv:a} = 2 m/s²', xc + 2 * ASC + 16, Y3 - 160, { size: 32, align: 'left', alpha: ka });
  ctx.restore();
}
const TB = 76.2, V5 = 6, DF = 6;   // corre a 6 m/s, poi 10 N su 10 kg: a = 1 m/s², si ferma in 6 s
function sceneVerso(ctx, t) {
  if (t < 72.8 || t > 86.8) return;
  const al = life(t, 72.9, 86.6, .4, .6);
  ctx.save(); ctx.globalAlpha *= al;
  binario(ctx, Y3, 1);
  let xb, v;
  if (t <= TB) { xb = 120 + V5 * PX3 * (t - 73.0); v = V5; }
  else { const d = Math.min(t - TB, DF); xb = 120 + V5 * PX3 * (TB - 73.0) + (V5 * d - d * d / 2) * PX3; v = V5 - d; }
  const xc = xb + LC / 2, frena = t > TB && t < TB + DF;
  carrello(ctx, xb, Y3, '10 kg', false);
  if (v > .001) {
    const L = v * VSC3;
    freccia(ctx, [xb + LC + 6, Y3 - 6], [xb + LC + 6 + L, Y3 - 6], C.x);
    drawRich(ctx, '{x:velocità}', xb + LC + 24 + Math.max(L, 110) / 2, Y3 + 34, { size: 30, alpha: clamp(v / 1.5) });
  }
  if (frena) {
    const k = clamp((t - TB) / .15) * clamp((TB + DF - t) / .15);
    freccia(ctx, [xb - 4, Y3], [xb - 4 - 10 * FSC, Y3], C.y, k);
    drawRich(ctx, '{my:F} = 10 N', xb - 84, Y3 - 44, { size: 32, alpha: k });
    freccia(ctx, [xc, Y3 - 80], [xc - 1 * ASC, Y3 - 80], C.v, k);
    drawRich(ctx, '{mv:a} = 1 m/s²', xc + 14, Y3 - 80, { size: 32, align: 'left', alpha: k });
  }
  drawRich(ctx, '{mv:a} ha la direzione e il verso della {y:risultante}', 960, 250, { size: 44, local: t - 82.4, alpha: 1 - P(t, 86.0, 86.6) });
  ctx.restore();
}

// 4 · riassunto (86,6–96,5)
function sceneFine(ctx, t) {
  if (t < 86.5) return;
  const al = 1 - P(t, 94.6, 95.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 86.8 });
    drawRich(ctx, 'La forza risultante dà l’accelerazione:', W / 2, 262, { size: 66, weight: 600, local: t - 87.2, stagger: .09 });
    drawRich(ctx, '{my:F}{mink: = m·}{mv:a}', W / 2, 358, { size: 80, weight: 600, local: t - 88.0, stagger: .12 });
  });
  const pills = [[490, 'massa doppia,\naccelerazione {g:metà}'], [960, '{mv:a} ha il verso\ndella {y:risultante}'], [1430, 'la massa\nè {v:inerzia}']];
  pills.forEach(([x, s], i) => {
    const a = 89.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 530); ctx.scale(k, k); ctx.translate(-x, -530);
    card(ctx, x - 215, 465, 430, 130);
    drawRich(ctx, s, x, 532, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 7.7, .55], ['pop', 8.0, .4],            // il titolo, i due carrelli
    ['soffio', 16.8], ['pop', 17.6, .5],                                              // il cronometro, la spinta F = 20 N
    ['tono', 17.6, 25.6, [.2, .21, .26, .33, .43, .56, .71, .9]],                     // il vuoto: 16 m in 4 s
    ['tono', 17.6, 25.6, [.2, .21, .23, .26, .31, .38, .46, .55]],                    // il carico: 8 m
    ['pop', 25.9, .6], ['ding', 26.2],                                                // 16 m contro 8 m
    ['pop', 30.5, .6],                                                                // a = 2 m/s² e 1 m/s²
    ['soffio', 38.4], ['pop', 39.6, .6], ['pop', 42.2, .4],                           // F = m·a, che cosa vuol dire
    ['pop', 46.0, .5], ['ding', 46.8],                                                // torna con tutti e due
    ['pop', 50.4, .55], ['pop', 54.6, .45],                                           // a = F/m, l'inerzia
    ['soffio', 59.2], ['pop', 59.6, .5], ['pop', 64.6, .6],                           // 30 N e 10 N, la risultante
    ['pop', 68.2, .6], ['tono', 68.2, 72.9, [.3, .32, .37, .45, .57, .72, .9]],       // parte con a = 2 m/s²
    ['soffio', 72.9],                                                                 // corre a 6 m/s
    ['pop', 76.2, .3], ['tono', 76.2, 82.2, [.8, .7, .6, .5, .4, .3, .2]],            // frenato: la velocità cala
    ['ding', 82.4],                                                                   // a ha il verso della risultante
    ['soffio', 86.8], ['pop', 88.0, .6],                                              // in una frase
    ['pop', 89.9, .5], ['pop', 90.4, .6], ['pop', 90.9, .7],
  ];
  return {
    titolo: 'F = m·a', durata: 96.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 38.4, 'la stessa forza'], [38.4, 59.1, 'il secondo principio'], [59.1, 73.0, 'più forze insieme'], [73.0, 86.5, 'il verso dell’accelerazione']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneCarrelli(ctx, t); scenePrincipio(ctx, t); sceneRisultante(ctx, t); sceneVerso(ctx, t); sceneFine(ctx, t); },
  };
});
