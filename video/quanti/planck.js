'use strict';
/* La luce a pacchetti — lo spettro del corpo nero e i quanti di Planck. A sinistra il grafico «luce emessa per ogni λ»
   (λ da 0 a 3000 nm, in scala lineare; altezza normalizzata al massimo della curva a 6000 K): la curva di Planck
   B(λ,T) = 2hc²/λ⁵ · 1/(e^{hc/(λkT)} − 1), calcolata nel codice, prima a 4000 K (massimo a 724 nm, legge di Wien
   λ_max = 2,898·10⁻³ m·K / T) poi a 6000 K (483 nm). La curva classica di Rayleigh-Jeans B = 2ckT/λ⁴ (rossa: idea sbagliata)
   coincide quasi a onde lunghe e sale senza limite a onde corte (catastrofe ultravioletta). Poi Planck: E = h·f,
   h = 6,626·10⁻³⁴ J·s (mostrato 6,63), fotone rosso a 700 nm: f = c/λ = 4,28·10¹⁴ Hz, E = 2,84·10⁻¹⁹ J;
   onde corte = pacchetti cari, quindi rari. La curva di Planck (verde) ricalca quella misurata.
   Il colore del disco caldo è l'approssimazione usuale (Tanner Helland) del colore percepito di un corpo nero; la banda
   del visibile ha i colori veri (approssimazione di Bruton, come in maxwell/spettro). Argomento: quanti. */
CVIDEO.registra('quanti/planck', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed, dot, fixedNum, crossMark, richW } = M;
  const TAU = Math.PI * 2;

  // ---------- le costanti e le curve (SI) ----------
  const HP = 6.62607e-34, CL = 2.99792e8, KB = 1.380649e-23, EV = 1.602177e-19, WIEN = 2.898e-3;
  const planck = (lam, T) => 2 * HP * CL * CL / Math.pow(lam, 5) / (Math.exp(HP * CL / (lam * KB * T)) - 1);
  const rayleigh = (lam, T) => 2 * CL * KB * T / Math.pow(lam, 4);
  const BMAX = planck(WIEN / 6000, 6000);                 // l'altezza del grafico: il massimo a 6000 K
  const lamMax = T => WIEN / T;                            // legge di Wien

  const T_FINE = 81.4;
  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.4, 'felice'], [23.6, 'sorpreso'],
    [29.6, 'neutro'], [34.6, 'pensa'], [40.6, 'sorpreso'], [45.8, 'neutro'], [51.4, 'felice'], [56.4, 'neutro'],
    [70.8, 'felice'], [76.4, 'festa'], [T_FINE, 'neutro'], [84.0, 'felice'], [88.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.6, 'Un ferro rovente è rosso. Più caldo,\ndiventa bianco. Perché?'],
    [7.9, 13.2, 'Ogni corpo caldo emette luce di tutte\nle lunghezze d’onda, non in parti uguali.'],
    [13.4, 18.2, 'Lo misuro: in basso la lunghezza d’onda\n{mink:λ}, in alto quanta luce esce.'],
    [18.4, 23.4, 'A 4000 K il massimo è nell’infrarosso:\nil corpo è arancione.'],
    [23.6, 29.4, 'Scaldo a 6000 K: molta più luce, e il\nmassimo si sposta verso il blu: bianco.'],
    [29.6, 34.4, 'Questa curva è lo spettro del {v:corpo nero}:\ndipende solo dalla temperatura.'],
    [34.6, 40.4, 'Fisica classica: ogni onda ha la stessa\nenergia, e la curva {r:schizza all’infinito}.'],
    [40.6, 45.6, 'A onde corte il conto dà energia {r:infinita}:\nla catastrofe ultravioletta.'],
    [45.8, 51.2, 'Planck, 1900: un corpo caldo emette e\nassorbe luce solo a {v:pacchetti}.'],
    [51.4, 56.2, 'Un pacchetto di luce di frequenza {mink:f}\nha energia {mink:E} = {mink:h}·{mink:f}.'],
    [56.4, 63.4, '{mink:h} è la costante di Planck:\n{mink:h} ≈ 6,63·10⁻³⁴ J·s.'],
    [63.6, 70.6, 'Luce rossa, 700 nm: un pacchetto\nvale 2,8·10⁻¹⁹ J.'],
    [70.8, 76.2, 'Onde corte: {mink:f} alta, pacchetti cari.\nSono {g:rari}: la curva {g:scende}.'],
    [76.4, 81.0, 'Con il suo {mink:h}, Planck ritrova la curva\nmisurata, punto per punto.'],
    [84.0, 89.2, 'La luce si scambia a pacchetti di energia\n{mink:h}·{mink:f}: è il {v:quanto} di Planck.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al, size) {
    if (al <= 0) return;
    size = size || 32;
    const w = richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size: size, alpha: al });
  }
  function linea(ctx, a, b, col, w, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
  }
  // il colore vero della luce di lunghezza d'onda nm (approssimazione di Bruton, come in maxwell/spettro)
  function colLuce(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
    const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
    const q = v => 255 * Math.pow(clamp(v * k), .8);
    return [q(r), q(g), q(b)];
  }
  // il colore percepito di un corpo nero a T kelvin (approssimazione di Tanner Helland)
  function colCorpo(T) {
    const x = T / 100;
    const r = x <= 66 ? 255 : 329.698727446 * Math.pow(x - 60, -.1332047592);
    const g = x <= 66 ? 99.4708025861 * Math.log(x) - 161.1195681661 : 288.1221695283 * Math.pow(x - 60, -.0755148492);
    const b = x >= 66 ? 255 : x <= 19 ? 0 : 138.5177312231 * Math.log(x - 10) - 305.0447927307;
    return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255)];
  }

  // ---------- il grafico (scheda di sinistra) ----------
  const CS = [120, 110, 1060, 690];
  const OX = 250, OY = 720, SX = .29, HY = 520;            // λ = 0 in x 250, 3000 nm in x 1120; I = 1 in y 200
  const xl = nm => OX + nm * SX, yi = I => OY - HY * I;
  const temp = t => kf(t, [[18.5, 4000], [23.8, 4000], [27.6, 6000]]);
  function curvaPlanck(T) { const p = []; for (let nm = 20; nm <= 3000; nm += 10) p.push([xl(nm), yi(planck(nm * 1e-9, T) / BMAX)]); return p; }
  function curvaRJ(T) { const p = []; for (let nm = 3000; nm >= 20; nm -= 10) p.push([xl(nm), yi(Math.min(rayleigh(nm * 1e-9, T) / BMAX, 1.5))]); return p; }
  function assi(ctx, k) {
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    linea(ctx, [OX, OY], [lerp(OX, 1150, k), OY], C.ink, 3, .85);
    linea(ctx, [OX, OY], [OX, lerp(OY, 170, k)], C.ink, 3, .85);
    if (k > .95) { arrowHead(ctx, [1152, OY], 0, C.ink, .9); arrowHead(ctx, [OX, 168], -Math.PI / 2, C.ink, .9); }
    for (let nm = 500; nm <= 3000; nm += 500) {
      const x = xl(nm); if (x > lerp(OX, 1150, k)) break;
      linea(ctx, [x, OY - (nm % 1000 ? 6 : 10)], [x, OY + (nm % 1000 ? 6 : 10)], C.ink, 2, .85);
      if (!(nm % 1000)) txt(ctx, String(nm), x, OY + 34, { size: 28, color: C.dim });
    }
    txt(ctx, 'lunghezza d’onda, in nm', 760, 782, { size: 28, color: C.dim });
    ctx.save(); ctx.translate(170, 450); ctx.rotate(-Math.PI / 2); txt(ctx, 'luce emessa, per ogni lunghezza d’onda', 0, 0, { size: 28, color: C.dim }); ctx.restore();
    ctx.restore();
  }
  function bandaVisibile(ctx, k) {
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    for (let nm = 400; nm < 700; nm += 2) { ctx.fillStyle = css(colLuce(nm), .22); ctx.fillRect(xl(nm), yi(1) - 10, 2.2 * SX + .6, OY - yi(1) + 10); }
    txt(ctx, 'visibile', xl(550), OY + 34, { size: 26, color: C.dim });
    ctx.restore();
  }
  function scenaGrafico(ctx, t) {
    if (t < 13.3 || t > T_FINE + .3) return;
    const al = P(t, 13.3, 13.9) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, CS[0], CS[1], CS[2], CS[3]);
    const kA = P(t, 13.5, 15.0);
    assi(ctx, kA);
    bandaVisibile(ctx, P(t, 15.0, 15.8));
    const T = temp(t), lm = lamMax(T) * 1e9;
    // la curva misurata (arancio), poi i punti
    const kC = P(t, 18.6, 20.8);
    if (kC > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(CS[0] + 4, CS[1] + 4, CS[2] - 8, CS[3] - 8); ctx.clip();
      // la curva classica, rossa, da destra verso sinistra: sale senza limite
      const kR = P(t, 34.8, 38.2) * (1 - P(t, 70.8, 71.8));
      if (kR > 0) glowStroke(ctx, curvaRJ(T), P(t, 34.8, 38.2), C.r, 5);
      if (t > 38.0) {
        const a = kR * .9;
        if (a > 0) chip(ctx, '{r:fisica classica}', 790, 300, a, 32);
      }
      glowStroke(ctx, curvaPlanck(T), kC, C.y, 5);
      // la curva di Planck (verde) ricalca quella misurata
      const kG = P(t, 71.0, 74.6);
      if (kG > 0) glowStroke(ctx, curvaPlanck(T), kG, C.g, 6);
      ctx.restore();
      // il massimo
      const kM = P(t, 20.8, 21.4), ym = yi(planck(lm * 1e-9, T) / BMAX);
      if (kM > 0) {
        dashed(ctx, [xl(lm), OY], [xl(lm), ym + 8], C.v, 1, .8 * kM);
        chip(ctx, '{v:' + Math.round(lm) + ' nm}', xl(lm) + 70 * clamp((lm - 560) / 100), ym - 44, kM, 30);   // a destra del visibile quando il massimo è nell'infrarosso
      }
      // i punti misurati (ogni 150 nm)
      const kD = P(t, 29.7, 30.9);
      if (kD > 0) for (let nm = 200; nm <= 2900; nm += 150) dot(ctx, [xl(nm), yi(planck(nm * 1e-9, T) / BMAX)], C.y, kD, 6);
      if (t > 76.4) chip(ctx, '{g:Planck}', 1000, 560, life(t, 76.5, T_FINE, .4, .3), 32);
      if (t > 29.7) chip(ctx, '{y:misurata}', 1000, 620, life(t, 29.8, T_FINE, .4, .3), 32);
    }
    ctx.restore();
  }

  // ---------- la scheda di destra ----------
  const RC = [1230, 110, 580, 690], CX = 1520;
  function scenaDestra(ctx, t) {
    if (t < 7.6 || t > T_FINE + .3) return;
    const al = P(t, 7.6, 8.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, RC[0], RC[1], RC[2], RC[3]);
    const T = temp(t), lm = lamMax(T) * 1e9;
    // 1 · il corpo caldo
    const k1 = 1 - P(t, 34.4, 34.9);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      const kN = P(t, 29.6, 30.1);
      conFont(TITOLI, () => {
        if (kN < 1) drawRich(ctx, 'un corpo caldo', CX, 165, { size: 42, weight: 600, alpha: 1 - kN });
        if (kN > 0) drawRich(ctx, 'il corpo nero', CX, 165, { size: 42, weight: 600, alpha: kN });
      });
      const col = colCorpo(T), kT = P(t, 8.0, 8.8);
      const g = ctx.createRadialGradient(CX, 300, 20, CX, 300, 120);
      g.addColorStop(0, css(col, .55 * kT)); g.addColorStop(1, css(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, 300, 120, 0, TAU); ctx.fill();
      ctx.fillStyle = css(col, kT); ctx.beginPath(); ctx.arc(CX, 300, 64, 0, TAU); ctx.fill();
      ctx.strokeStyle = css(C.ink, .35 * kT); ctx.lineWidth = 2; ctx.stroke();
      const kK = P(t, 18.5, 19.0);
      if (kK > 0) {
        drawRich(ctx, '{mink:T} =', 1420, 450, { size: 40, align: 'right', alpha: kK });
        fixedNum(ctx, String(Math.round(T / 10) * 10), 1580, 450, 40, C.ink, kK);
        txt(ctx, 'K', 1596, 450, { size: 40, align: 'left', alpha: kK });
        const kM = P(t, 20.8, 21.4);
        drawRich(ctx, '{dim:massimo a}', 1420, 520, { size: 32, align: 'right', alpha: kM });
        fixedNum(ctx, String(Math.round(lm)), 1580, 520, 36, C.v, kM);
        txt(ctx, 'nm', 1596, 520, { size: 36, align: 'left', color: C.v, alpha: kM });
        txt(ctx, lm > 700 ? 'nell’infrarosso' : 'nel visibile', CX, 575, { size: 30, color: C.dim, alpha: kM });
      }
      const kS = P(t, 29.7, 30.3);
      if (kS > 0) {
        drawRich(ctx, '{dim:assorbe tutta la luce che riceve}', CX, 650, { size: 28, alpha: kS });
        drawRich(ctx, '{dim:e brilla solo perché è caldo}', CX, 692, { size: 28, alpha: kS });
        drawRich(ctx, '{dim:lo spettro dipende solo da} {mink:T}', CX, 750, { size: 28, alpha: kS });
      }
      ctx.restore();
    }
    // 2 · il conto classico
    const k2 = life(t, 34.6, 45.9, .5, .4);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      conFont(TITOLI, () => drawRich(ctx, '{r:il conto classico}', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{dim:ogni onda nel corpo caldo porta,}', CX, 240, { size: 30, local: t - 34.8 });
      drawRich(ctx, '{dim:in media, la stessa energia}', CX, 282, { size: 30, local: t - 35.0 });
      drawRich(ctx, '{dim:di onde corte ce ne sono sempre di più:}', CX, 350, { size: 28, local: t - 36.2 });
      drawRich(ctx, '{dim:luce emessa} {mr:∝ T/λ⁴}', CX, 420, { size: 40, local: t - 36.6 });
      drawRich(ctx, '{r:per λ → 0 sale all’infinito}', CX, 490, { size: 32, local: t - 37.6 });
      const kK = P(t, 40.8, 41.3);
      if (kK > 0) {
        drawRich(ctx, '{r:catastrofe ultravioletta}', CX, 600, { size: 36, alpha: kK });
        drawRich(ctx, '{dim:un corpo caldo emetterebbe}\n{dim:energia infinita}', CX, 690, { size: 28, alpha: kK, lh: 1.3 });
        crossMark(ctx, 1770, 165, P(t, 40.8, 41.6), C.r, .7);
      }
      ctx.restore();
    }
    // 3 · Planck
    const k3 = P(t, 45.9, 46.4);
    if (k3 > 0) {
      ctx.save(); ctx.globalAlpha *= k3;
      conFont(TITOLI, () => drawRich(ctx, 'Planck, 1900', CX, 165, { size: 42, weight: 600, local: t - 46.0 }));
      drawRich(ctx, '{dim:emette e assorbe luce a pacchetti}', CX, 222, { size: 28, local: t - 46.4 });
      drawRich(ctx, '{mink:E} = {mink:h}·{mink:f}', CX, 300, { size: 68, local: t - 51.6 });
      drawRich(ctx, '{mink:h} ≈ {mink:6,63·10⁻³⁴} J·s', CX, 380, { size: 36, local: t - 56.6 });
      drawRich(ctx, '{dim:rosso, 700 nm:} {mink:f} = {mink:c}/{mink:λ} ≈ {mink:4,3·10¹⁴} Hz', CX, 450, { size: 29, local: t - 63.8 });
      drawRich(ctx, '{dim:con} {mink:c} ≈ {mink:3·10⁸} m/s{dim:, velocità della luce}', CX, 494, { size: 28, local: t - 64.4 });
      drawRich(ctx, '{mink:E} = {mink:h}·{mink:f} ≈ {mink:2,8·10⁻¹⁹} J', CX, 552, { size: 34, local: t - 65.6 });
      drawRich(ctx, '{dim:onde corte:} {mink:f} {dim:alta,} {mink:E} {dim:grande}', CX, 640, { size: 30, local: t - 71.0 });
      drawRich(ctx, '{g:pacchetti costosi: rari}', CX, 710, { size: 32, local: t - 72.4 });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'La luce a pacchetti', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < T_FINE - .1) return;
    const al = 1 - P(t, 89.6, 90.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
      drawRich(ctx, 'La luce si scambia a pacchetti:\nogni quanto vale {mink:E} = {mink:h}·{mink:f}.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
    });
    const pills = [[450, '{mink:h} ≈ {mink:6,63·10⁻³⁴} J·s\n{dim:la costante di Planck}'], [960, '{r:catastrofe ultravioletta}\n{dim:evitata dai quanti}'], [1470, 'il corpo nero:\n{dim:lo spettro dipende solo da} {mink:T}']];
    pills.forEach(([x, s], i) => {
      const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 240, 445, 480, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4],                                                // il corpo caldo
    ['soffio', 13.3], ['traccia', 13.5, 15.0], ['pop', 15.0, .5],                     // il grafico, la banda del visibile
    ['pop', 18.5, .4], ['traccia', 18.6, 20.8],                                       // 4000 K: la curva misurata
    ['tono', 18.6, 20.8, [0, 0, 0, 0, 0, .04, .13, .1, .05, .02, .01, .01, .01, .01, .01, .01, .01]],
    ['pop', 20.8, .45],                                                               // il massimo, 724 nm
    ['tono', 23.8, 27.6, [.13, .13, .15, .22, .4, .69, .9, .99, 1]],                  // scaldo a 6000 K: il massimo sale
    ['pop', 29.7, .5], ['pop', 29.8, .6],                                             // i punti misurati
    ['pop', 34.6, .45], ['traccia', 34.8, 38.2],                                      // il conto classico
    ['tono', 34.8, 38.2, [.01, .01, .01, .02, .04, .2, 1, 1, 1, 1, 1]],               // la curva rossa schizza in alto
    ['pop', 40.8, .1],                                                                // catastrofe ultravioletta
    ['pop', 45.9, .5], ['pop', 51.6, .7], ['pop', 56.6, .5],                          // Planck: E = h·f, h
    ['pop', 63.8, .45], ['ding', 65.7],                                               // il rosso: f, poi E ≈ 2,8·10⁻¹⁹ J
    ['traccia', 71.0, 74.6],                                                          // la curva di Planck ricalca la misurata
    ['tono', 71.0, 74.6, [0, 0, 0, 0, .09, .87, .83, .36, .12, .05, .03, .02, .02, .01, .01, .01, .01]],
    ['pop', 72.4, .55], ['pop', 76.5, .6],                                            // rari, Planck
    ['soffio', 81.4], ['pop', 83.6, .5], ['pop', 84.1, .6], ['pop', 84.6, .7],        // in una frase
  ];
  return {
    titolo: 'La luce a pacchetti', durata: 91, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.4, 'un corpo caldo'], [34.4, 45.6, 'la catastrofe ultravioletta'], [45.6, T_FINE, 'i quanti di Planck']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaGrafico(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
