'use strict';
/* La sirena che passa — effetto Doppler con la sorgente in moto. La sirena emette sempre f = 900 Hz; il suono va a
   v = 340 m/s; la sirena corre a u = 34 m/s (≈ 122 km/h) a velocità costante. Ogni cresta è un cerchio centrato dove
   stava la sirena quando l'ha emessa, che si allarga a v. Davanti λ′ = (v − u)/f = 0,34 m, dietro (v + u)/f ≈ 0,42 m
   (λ = 0,38 m da ferma). Ricevuta: f·v/(v − u) = 1000 Hz in avvicinamento, f·v/(v + u) ≈ 818 Hz in allontanamento.
   Scala 270 px per metro, al rallentatore 200 volte: v = 459 px/s, u = 45,9 px/s, una cresta ogni 0,222 s di video.
   L'ascoltatore sta 30 px (≈ 0,11 m) di lato alla strada: la frequenza ricevuta si calcola dagli arrivi veri delle
   creste, e nel passaggio scende in fretta ma senza salti. Argomento: suono. */
CVIDEO.registra('suono/doppler', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, glowStroke } = M;

  // ---------- la scena: px e secondi di video ----------
  const CV = 459, U = 45.9, TV = 200 / 900;             // velocità del suono, della sirena; periodo (video)
  const RY = 380, OX = 1180, OY = RY + 40;               // la strada; l'ascoltatore, di lato
  const XA = 640, TA0 = 7.6;                             // A: sirena ferma, accesa a 7,6 s
  // B: la sirena corre; tempo della scena (fermo immagine fra 27,2 e 44,9 e dopo 68,6)
  const tauB = t => 22.4 + (clamp(t, 22.4, 27.2) - 22.4) + (clamp(t, 44.9, 68.6) - 44.9);
  const TP = tauB(60.1);                                 // passa davanti all'ascoltatore a 60,1 s
  const xsB = te => OX + U * (te - TP);
  const fermoB = t => (t > 27.25 && t < 44.9) || t > 68.65;
  const TAUSTAR = tauB(30);                              // la scena ferma
  // gli arrivi delle creste all'ascoltatore (B): cresta k emessa a te = k·TV
  const KB0 = Math.floor((22.4 - 4) / TV), KB1 = Math.ceil(52 / TV);
  const ARR = [];
  for (let k = KB0; k <= KB1; k++) { const te = k * TV, xs = xsB(te); ARR.push([k, te + Math.hypot(OX - xs, OY - RY) / CV]); }
  const fRic = tau => {                                   // dalla distanza fra due arrivi
    for (let i = 0; i + 1 < ARR.length; i++) if (ARR[i + 1][1] > tau) return 900 * TV / (ARR[i + 1][1] - ARR[i][1]);
    return 818;
  };
  const ARRA = k => TA0 + k * TV + Math.hypot(OX - XA, OY - RY) / CV;

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [78.3, 190], [79.6, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [78.3, 1050], [79.6, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [78.3, 2.2], [79.6, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [78.3, 2], [79.6, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [78.3, -1.5], [79.6, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.4, 'felice'], [22.6, 'neutro'],
    [27.3, 'pensa'], [31.6, 'sorpreso'], [35.7, 'neutro'], [39.3, 'pensa'], [44.9, 'felice'], [49.7, 'neutro'],
    [54.6, 'felice'], [59.0, 'sorpreso'], [63.5, 'neutro'], [68.7, 'pensa'], [73.4, 'felice'], [78.1, 'neutro'],
    [81.0, 'felice'], [85.8, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Perché la sirena, quando ti passa\naccanto, cambia nota?'],
    [7.6, 11.9, 'Ogni cerchio è una {v:cresta}: una\ncompressione, il massimo di pressione.'],
    [12.0, 16.3, 'Da ferma ne emette 900 al\nsecondo: {mink:f} = 900 Hz.'],
    [16.4, 21.9, 'Corrono a {mink:v} = 340 m/s, sempre\na λ = 0,38 m l’una dall’altra.'],
    [22.6, 27.1, 'Ora corre verso di te:\n{mink:u} = 34 m/s, circa 122 km/h.'],
    [27.3, 31.55, 'Ogni cerchio è centrato dove\nera la sirena quando è nato.'],
    [31.6, 35.6, 'Davanti le creste si {g:ammucchiano}:\nλ = 0,34 m.'],
    [35.7, 39.2, 'Dietro si {g:allargano}:\nλ = 0,42 m.'],
    [39.3, 44.0, 'In un periodo la sirena avanza\ndi 0,04 m: λ cambia di tanto.'],
    [44.9, 49.65, 'Creste più fitte arrivano più spesso:\nsenti {mink:f′} = {g:1000 Hz}, più acuto.'],
    [49.7, 54.4, '{mink:f′ = f·v/(v − u)}: 900·340/306\n= {g:1000 Hz}.'],
    [54.6, 58.85, 'Emette sempre 900 Hz, cambia ciò\nche ricevi: è l’{v:effetto Doppler}.'],
    [59.0, 63.4, 'Ti passa davanti…\ne la nota scende in un attimo.'],
    [63.5, 68.6, 'Ora si allontana, creste più rade:\n{mink:f′ = f·v/(v + u)} ≈ {g:818 Hz}.'],
    [68.7, 73.3, 'Mentre si avvicina la nota resta\nalta, poi resta bassa: un salto.'],
    [73.4, 78.2, 'Il Doppler cambia l’{g:altezza},\n{r:non} il volume.'],
    [81.0, 85.5, 'Si avvicina: più acuto.\nSi allontana: più grave.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 5) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  // un'etichetta su un fondino color carta: le creste le passano sotto
  function etichetta(ctx, s, x, y, o = {}) {
    const al = (o.alpha != null ? o.alpha : 1); if (al <= 0) return;
    const size = o.size || 32, w = o.w || 200, align = o.align || 'center';
    const x0 = align === 'left' ? x - 10 : align === 'right' ? x - w + 10 : x - w / 2;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x0, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, align, alpha: al, weight: o.weight });
  }
  function creste(ctx, tau, xs, k0, k1, te0, al, hi) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.lineWidth = 3;
    for (let k = k0; k <= k1; k++) {
      const te = te0 + k * TV; if (te > tau) break;
      const r = CV * (tau - te); if (r < 1 || r > 1900) continue;
      const evid = k === hi;
      ctx.strokeStyle = css(evid ? C.y : C.v, evid ? 1 : .85 * (1 - r / 2000)); ctx.lineWidth = evid ? 6 : 3;
      ctx.beginPath(); ctx.arc(xs(te), RY, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
  function sirena(ctx, x, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x - 30, RY - 14, 60, 28, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.ink, .8); ctx.beginPath(); ctx.arc(x, RY - 14, 9, Math.PI, 0); ctx.fill();
    ctx.restore();
  }
  function persona(ctx, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .9); ctx.fillStyle = C.paper; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(OX, OY + 13, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(OX, OY + 27); ctx.lineTo(OX, OY + 72); ctx.moveTo(OX - 20, OY + 44); ctx.lineTo(OX + 20, OY + 44);
    ctx.moveTo(OX, OY + 72); ctx.lineTo(OX - 14, OY + 104); ctx.moveTo(OX, OY + 72); ctx.lineTo(OX + 14, OY + 104); ctx.stroke();
    ctx.restore();
    etichetta(ctx, 'tu, a bordo strada', OX, OY + 128, { size: 30, w: 290, alpha: al });
  }

  // ---------- la strada, le creste, la sirena (7,5–78,6) ----------
  const KSTAR = Math.floor((TAUSTAR - 1.0) / TV);        // la cresta messa in evidenza nel fermo immagine
  function scenaStrada(ctx, t) {
    if (t < 7.5 || t > 79.0) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 77.9, 78.5));
    const kA = 1 - P(t, 21.9, 22.4), kB = P(t, 22.3, 22.8), tb = tauB(t);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 1720, 490);
    ctx.save(); ctx.beginPath(); ctx.rect(104, 114, 1712, 482); ctx.clip();
    ctx.fillStyle = css(C.ink, .07); ctx.fillRect(104, RY - 22, 1712, 34);
    if (t < 22.4) creste(ctx, t, () => XA, 0, 70, TA0, kA, -1);
    if (t > 22.3) creste(ctx, tb, xsB, Math.floor((tb - 4.3) / TV), Math.floor(tb / TV), 0, kB, life(t, 27.4, 31.6, .4, .4) > .02 ? KSTAR : -1);
    ctx.restore();
    // la sirena
    if (t < 22.4) sirena(ctx, XA, kA * P(t, 7.6, 8.0));
    if (t > 22.3) sirena(ctx, xsB(tb), kB);
    const xs = t < 22.4 ? XA : xsB(tb);
    etichetta(ctx, 'sirena', xs, RY - 56, { size: 30, w: 120, alpha: Math.min(P(t, 7.8, 8.3), 1 - P(t, 21.9, 22.3)) + life(t, 22.6, 31.5, .4, .4) });
    // la velocità della sirena
    const ku = life(t, 22.8, 59.2, .4, .4);
    if (ku > 0) {
      freccia(ctx, [xs + 36, RY], [xs + 110, RY], C.x, ku, 6);
      etichetta(ctx, '{mink:u}', xs + 132, RY - 30, { size: 36, w: 44, alpha: ku });
    }
    // da dove è partita la cresta in evidenza
    const kh = life(t, 27.4, 31.6, .4, .4);
    if (kh > 0) {
      const xc = xsB(KSTAR * TV);
      ctx.save(); ctx.globalAlpha *= kh; ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(xc, RY, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      dashed(ctx, [xc, RY + 12], [xc, RY + 62], C.y, 1, kh);
      etichetta(ctx, '{y:partita da qui}', xc, RY + 92, { size: 30, w: 220, alpha: kh });
    }
    // λ davanti e dietro, nel fermo immagine
    const davanti = [], dietro = [];
    for (let k = Math.floor((TAUSTAR - 4.3) / TV); k <= Math.floor(TAUSTAR / TV); k++) {
      const te = k * TV, r = CV * (TAUSTAR - te);
      davanti.push(xsB(te) + r); dietro.push(xsB(te) - r);
    }
    const graffa = (a, b, s, k) => {
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(a, RY - 30); ctx.lineTo(a, RY - 44); ctx.lineTo(b, RY - 44); ctx.lineTo(b, RY - 30); ctx.stroke(); ctx.restore();
      etichetta(ctx, s, (a + b) / 2, RY - 80, { size: 32, w: 120, alpha: k });
    };
    const da = davanti.filter(x => x > 700).sort((p, q) => p - q), di = dietro.filter(x => x < 330 && x > 150).sort((p, q) => q - p);
    graffa(da[0], da[1], '{g:0,34 m}', life(t, 31.7, 39.2, .4, .4));
    graffa(di[1], di[0], '{g:0,42 m}', life(t, 35.8, 44.0, .4, .4));
    // l'ascoltatore
    persona(ctx, P(t, 7.8, 8.4));
    // il rallentatore e la scala
    const lento = (t < 22.4) || !fermoB(t);
    etichetta(ctx, lento ? 'al rallentatore, 200 volte più lento' : 'fermo immagine', 130, 148, { size: 30, w: lento ? 520 : 240, align: 'left' });
    ctx.save(); ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(1500, 530, 300, 62, 10); ctx.fill(); ctx.restore();
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1520, 568); ctx.lineTo(1790, 568); ctx.moveTo(1520, 558); ctx.lineTo(1520, 578); ctx.moveTo(1790, 558); ctx.lineTo(1790, 578); ctx.stroke();
    txt(ctx, '1 m', 1655, 548, { size: 30, color: C.dim });
    ctx.restore();
  }

  // ---------- sotto: le creste che arrivano, i conti, il grafico (8–78,6) ----------
  const SX = 1140, SPX = 160;                            // la striscia: l'adesso a destra, 160 px per secondo di scena
  const TB1 = tauB(68.6), GX0 = 160, GX1 = 1150;
  const gx = tau => GX0 + (tau - 22.4) / (TB1 - 22.4) * (GX1 - GX0), gy = f => 765 - (f - 818) * 75 / 182;
  // un punto a metà fra due arrivi consecutivi: la frequenza ricevuta in quel momento
  const CURVA = [];
  for (let i = 0; i + 1 < ARR.length; i++) { const tm = (ARR[i][1] + ARR[i + 1][1]) / 2; if (tm >= 22.4 && tm <= TB1) CURVA.push([gx(tm), gy(900 * TV / (ARR[i + 1][1] - ARR[i][1]))]); }
  function scenaSotto(ctx, t) {
    if (t < 8.3 || t > 79.0) return;
    const al = P(t, 8.3, 8.9) * (1 - P(t, 77.9, 78.5));
    const kA = 1 - P(t, 21.9, 22.4), kB = P(t, 22.3, 22.8), tb = tauB(t);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 620, 1080, 176);
    // la striscia degli arrivi
    const ks = (1 - life(t, 39.2, 44.9, .3, .3)) * (1 - P(t, 68.6, 69.0));
    if (ks > 0) {
      ctx.save(); ctx.globalAlpha *= ks;
      txt(ctx, 'le creste che arrivano a te', 130, 650, { size: 30, color: C.dim, align: 'left' });
      ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(130, 730); ctx.lineTo(SX + 20, 730); ctx.stroke();
      txt(ctx, 'adesso', SX + 18, 650, { size: 30, color: C.dim, align: 'right' });
      ctx.lineWidth = 4;
      const tacca = (ta, now, a) => { const x = SX - (now - ta) * SPX; if (x < 130 || ta > now) return; ctx.strokeStyle = css(C.v, a); ctx.beginPath(); ctx.moveTo(x, 690); ctx.lineTo(x, 770); ctx.stroke(); };
      if (t < 22.4) for (let k = 0; k < 70; k++) tacca(ARRA(k), t, kA);
      if (t > 22.3) for (const [, ta] of ARR) tacca(ta, tb, kB);
      ctx.restore();
    }
    // i conti di λ, nel fermo immagine
    const kt = life(t, 39.3, 44.8, .4, .3);
    if (kt > 0) {
      drawRich(ctx, 'in un periodo, {mink:T} = 1/900 s, la sirena avanza di {mink:u·T} ≈ 0,04 m', 640, 672, { size: 30, alpha: kt, local: t - 39.4 });
      drawRich(ctx, 'davanti: 0,38 − 0,04 = {g:0,34 m}     dietro: 0,38 + 0,04 ≈ {g:0,42 m}', 640, 742, { size: 32, alpha: kt, local: t - 40.2 });
    }
    // il grafico della frequenza ricevuta
    const kg = P(t, 68.7, 69.2);
    if (kg > 0) {
      ctx.save(); ctx.globalAlpha *= kg;
      glowStroke(ctx, CURVA, P(t, 68.8, 70.4, E.lin), C.g, 5);
      drawRich(ctx, '{g:1000 Hz}', gx(34), gy(1000) - 26, { size: 30 });
      drawRich(ctx, '{g:≈ 818 Hz}', gx(48), gy(818) - 26, { size: 30 });
      dashed(ctx, [gx(TP), 640], [gx(TP), 780], C.dim, 1, .8);
      txt(ctx, 'ti passa davanti', gx(TP) + 14, 650, { size: 30, color: C.dim, align: 'left' });
      drawRich(ctx, '{dim:ricevuta} {mink:f′}', 130, 650, { size: 30, align: 'left' });
      ctx.restore();
    }
    // i numeri
    card(ctx, 1220, 620, 600, 176);
    drawRich(ctx, '{dim:emessa} {mink:f}', 1250, 668, { size: 32, align: 'left' });
    drawRich(ctx, '900 Hz', 1790, 668, { size: 40, align: 'right' });
    drawRich(ctx, '{dim:ricevuta} {mink:f′}', 1250, 748, { size: 32, align: 'left' });
    let fr = null;
    if (t < 22.4) { if (t > ARRA(1)) fr = 900; } else fr = fRic(tb);
    const fv = fr === null ? '…' : Math.round(fr) + ' Hz', diversa = fr !== null && Math.abs(fr - 900) > 3;
    drawRich(ctx, diversa ? '{g:' + fv + '}' : fv, 1790, 748, { size: 40, align: 'right' });
    ctx.restore();
  }

  // ---------- titolo e chiusura ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'La sirena che passa', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 78.3) return;
    const al = 1 - P(t, 86.4, 87.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 78.5 });
      drawRich(ctx, 'La sirena emette sempre la stessa nota:\navvicinandosi le creste arrivano più fitte.', W / 2, 290, { size: 64, weight: 600, local: t - 78.9, stagger: .08 });
    });
    const pills = [[490, '{mink:f′ = f·v/(v − u)}\nsi avvicina: più acuto'], [960, '{mink:f′ = f·v/(v + u)}\nsi allontana: più grave'], [1430, 'cambia l’{g:altezza},\n{r:non} il volume']];
    pills.forEach(([x, s], i) => {
      const a = 80.5 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti: niente toni (si
  // confonderebbero con la nota della sirena), solo pop, tracce e soffi
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 7.8, .5], ['pop', 9.0, .45],                             // la sirena ferma; arriva: 900 Hz
    ['soffio', 22.3], ['pop', 22.6, .65], ['traccia', 22.8, 23.2],                    // ora corre: 1000 Hz, u
    ['pop', 27.4, .5], ['traccia', 27.4, 27.8],                                       // fermo: partita da qui
    ['traccia', 31.7, 32.1], ['traccia', 35.8, 36.2],                                 // davanti 0,34 m, dietro 0,42 m
    ['pop', 39.5, .45], ['pop', 40.3, .5],                                            // i conti di λ
    ['pop', 60.2, .3],                                                                // ti passa davanti: 818 Hz
    ['traccia', 68.8, 70.4], ['pop', 70.5, .4],                                       // il grafico della nota ricevuta
    ['soffio', 78.5], ['pop', 80.5, .5], ['pop', 81.0, .6], ['pop', 81.5, .7],        // in una frase
  ];
  return {
    titolo: 'La sirena che passa', durata: 88.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.3, 'la sirena ferma'], [22.3, 44.8, 'la sirena che corre'], [44.8, 68.6, 'la nota che senti'], [68.6, 78.0, 'un salto di altezza']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaStrada(ctx, t); scenaSotto(ctx, t); scenaFine(ctx, t); },
  };
});

