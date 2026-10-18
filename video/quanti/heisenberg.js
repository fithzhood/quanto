'use strict';
/* Più stringi, più si allarga — il principio di indeterminazione con una fessura sola. Luce verde (λ = 500 nm) contro una
   fessura larga a = 4, 2, 1 µm: dietro, sullo schermo, la figura di diffrazione I(θ) = sinc²(π·a·sin θ/λ), calcolata nel
   codice; il primo buio cade a sin θ = λ/a (7,18° · 14,48° · 30°). Disegno ingrandito ma in scala fra fessura e onda
   (λ = 20 px, a = 160 · 80 · 40 px, a/λ = 8 · 4 · 2); gli angoli sono quelli veri, lo schermo a 520 px dalla fessura.
   Fotone: p = h/λ = 1,33·10⁻²⁷ kg·m/s; Δx = a; Δp ≈ p·sin θ = h/a = 1,66 · 3,31 · 6,63·10⁻²⁸ kg·m/s;
   Δx·Δp ≈ h = 6,63·10⁻³⁴ J·s per ogni fessura, più di h/(4π) = 5,27·10⁻³⁵ J·s (Heisenberg, 1927).
   L'indeterminazione viene dall'onda, non dallo strumento. Onde al rallentatore (60 px/s); l'intensità sullo schermo è
   riferita al suo centro. Argomento: quanti. */
CVIDEO.registra('quanti/heisenberg', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dot, dashed, fixedNum, fmtN, crossMark, checkMark, richW } = M;
  const TAU = Math.PI * 2, GRAD = Math.PI / 180;

  // ---------- i numeri (SI) ----------
  const HP = 6.62607e-34, LAMBDA = 500e-9, PF = HP / LAMBDA;           // p del fotone: 1,33·10⁻²⁷ kg·m/s
  const larghezza = t => kf(t, [[0, 4], [18.9, 4], [20.4, 2], [27.7, 2], [29.2, 1]]);   // la fessura, in µm
  const senPrimoBuio = aum => LAMBDA / (aum * 1e-6);                                   // sin θ = λ/a
  const intensita = (phi, aum) => { const u = Math.PI * aum * 1e-6 * Math.sin(phi) / LAMBDA; return u === 0 ? 1 : Math.pow(Math.sin(u) / u, 2); };

  const T_FINE = 97.2;
  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.8, 'sorpreso'], [27.6, 'neutro'],
    [32.6, 'felice'], [38.6, 'neutro'], [43.8, 'pensa'], [49.6, 'neutro'], [61.2, 'felice'], [67.0, 'sorpreso'],
    [72.8, 'neutro'], [79.8, 'felice'], [87.4, 'pensa'], [91.4, 'festa'], [T_FINE, 'neutro'], [99.8, 'felice'],
    [103.8, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.9, 'Stringo la fessura: so meglio dove\npassa la luce. E dopo?'],
    [7.9, 13.4, 'Luce verde ({mink:λ} = 500 nm) contro una\nfessura larga {mink:a}; dietro, uno schermo.'],
    [13.6, 18.6, 'Fessura larga 4 µm: sullo schermo\narriva una macchia stretta.'],
    [18.8, 22.6, 'La stringo: 2 µm, la metà.'],
    [22.8, 27.4, 'La macchia {r:non} si stringe:\nsi {v:allarga}, circa il doppio!'],
    [27.6, 32.4, 'A 1 µm si allarga ancora: la luce\nesce aperta a {v:ventaglio}.'],
    [32.6, 38.4, 'È la {v:diffrazione}: il primo buio cade\ndove sin {mink:θ} = {mink:λ}/{mink:a}.'],
    [38.6, 43.6, 'Più stretta la fessura, più largo\nil ventaglio: 7°, 14°, 30°.'],
    [43.8, 49.4, 'Il fotone, un pacchetto di luce, sta\nnella fessura: lo so entro {mx:Δx} = {mink:a}.'],
    [49.6, 55.0, 'Ma esce in una direzione incerta,\nin un punto qualunque del ventaglio.'],
    [55.2, 61.0, 'Un fotone ha quantità di moto\n{mink:p} = {mink:h}/{mink:λ}, con {mink:h} la costante di Planck.'],
    [61.2, 66.8, 'Di traverso ne prende fino a {mink:p}·sin {mink:θ}:\n{mv:Δp} ≈ {mink:p}·{mink:λ}/{mink:a} = {mink:h}/{mink:a}.'],
    [67.0, 72.6, 'Stringo {mink:a}: {mx:Δx} cala, ma {mv:Δp} cresce.\nIl prodotto resta {mink:h}, per ogni fessura.'],
    [72.8, 79.6, 'Heisenberg: il limite esatto è\n{mx:Δx}·{mv:Δp} ≥ {mink:h/(4π)}, mai di meno.'],
    [79.8, 87.2, 'Vale circa 5,3·10⁻³⁵ J·s: la nostra\nstima, circa {mink:h}, sta sopra.'],
    [87.4, 91.2, '{r:Con uno strumento migliore}\n{r:si farebbe meglio?}'],
    [91.4, 97.0, 'No: il ventaglio viene dall’onda,\nnon da un difetto dello strumento.'],
    [99.8, 105.2, 'Più certa la posizione, più incerta\nla quantità di moto: lo vuole l’onda.'],
  ];

  // ---------- aiutanti (chip e linea come in quanti/de-broglie, colLuce come in quanti/fotoelettrico) ----------
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
  function freccia(ctx, a, b, col, w, al) {
    if (al <= 0) return;
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    linea(ctx, a, [b[0] - 10 * Math.cos(ang), b[1] - 10 * Math.sin(ang)], col, w, al);
    ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, b, ang, col, .9); ctx.restore();
  }
  function colLuce(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
    const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
    const q = v => 255 * Math.pow(clamp(v * k), .8);
    return [q(r), q(g), q(b)];
  }
  const VERDE = colLuce(500);
  const fmtA = v => Math.abs(v - Math.round(v)) < .04 ? String(Math.round(v)) : fmtN(v, 1);

  // ---------- la scheda di sinistra: visto dall'alto ----------
  const CS = [120, 110, 1060, 690];
  const X0 = 140, XW = 420, XS = 940, YC = 455, LS = XS - XW, LPX = 20, V = 60, BANDA = 130, T0 = 7.8;
  const PXUM = 40;                                                     // px per µm della fessura (λ = 0,5 µm → 20 px)
  const y1 = aum => LS * Math.tan(Math.asin(senPrimoBuio(aum)));     // dove cade il primo buio sullo schermo
  const modp = (v, m) => ((v % m) + m) % m;
  // i fronti d'onda: diritti prima della parete; dopo, a distanza r dalla fenditura (diritti davanti all'apertura,
  // tondi attorno ai bordi), con la luminosità della figura di diffrazione nella loro direzione
  function onde(ctx, t, al) {
    if (al <= 0) return;
    const aum = larghezza(t), h = aum * PXUM / 2, s = V * (t - T0);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath(); ctx.rect(CS[0] + 4, CS[1] + 4, XS - CS[0] - 6, CS[3] - 8); ctx.clip();
    ctx.fillStyle = css(VERDE, .1); ctx.fillRect(X0, YC - BANDA, XW - X0, 2 * BANDA);
    ctx.strokeStyle = css(VERDE, .6); ctx.lineWidth = 3;
    for (let x = X0 + modp(s, LPX); x < XW - 6; x += LPX) { ctx.beginPath(); ctx.moveTo(x, YC - BANDA); ctx.lineTo(x, YC + BANDA); ctx.stroke(); }
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let r = modp(s - (XW - X0), LPX); r < 640; r += LPX) {
      if (r < 3) continue;
      const pts = [];
      for (let g = -88; g <= 0; g += 2) pts.push([XW + r * Math.cos(g * GRAD), YC - h + r * Math.sin(g * GRAD)]);
      for (let y = YC - h + 4; y < YC + h; y += 6) pts.push([XW + r, y]);
      for (let g = 0; g <= 88; g += 2) pts.push([XW + r * Math.cos(g * GRAD), YC + h + r * Math.sin(g * GRAD)]);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (b[0] > XS - 3 || a[0] > XS - 3) continue;
        const dy = Math.max(0, Math.abs((a[1] + b[1]) / 2 - YC) - h * Math.max(0, 1 - r / LS));
        const I = intensita(Math.atan2(dy, (a[0] + b[0]) / 2 - XW), aum);
        if (I < .004) continue;
        ctx.strokeStyle = css(VERDE, .85 * Math.min(1, I * 1.3));
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    }
    ctx.restore();
  }
  // lo schermo: la luce che arriva in ogni punto, e il grafico di quanta ne arriva (riferita al centro)
  function schermo(ctx, t, al) {
    if (al <= 0) return;
    const aum = larghezza(t);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css([18, 20, 28]); ctx.fillRect(XS, 150, 26, 620);
    for (let y = 150; y < 770; y += 2) { ctx.fillStyle = css(VERDE, intensita(Math.atan2(y + 1 - YC, LS), aum)); ctx.fillRect(XS, y, 26, Math.min(2.4, 770 - y)); }
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(XS, 150, 26, 620);
    ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(990, 170); ctx.lineTo(990, 760); ctx.stroke();
    ctx.strokeStyle = css(VERDE); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let y = 170; y <= 760; y += 3) { const x = 992 + 150 * intensita(Math.atan2(y - YC, LS), aum); if (y === 170) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.restore();
  }
  // il ventaglio fino al primo buio, con l'angolo θ
  function ventaglio(ctx, aum, col, al, conAngolo) {
    if (al <= 0) return;
    const yy = y1(aum), S = [XW + 6, YC];
    dashed(ctx, S, [XS, YC - yy], col, 1, al); dashed(ctx, S, [XS, YC + yy], col, 1, al);
    if (!conAngolo) return;
    const th = Math.asin(senPrimoBuio(aum));
    dashed(ctx, S, [XS, YC], C.dim, 1, .8 * al);
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(S[0], S[1], 96, -th, 0); ctx.stroke(); ctx.restore();
    chip(ctx, '{mink:θ}', S[0] + 140 * Math.cos(th / 2), S[1] - 140 * Math.sin(th / 2), al, 34);
  }
  // i fotoni che escono: direzioni estratte dalla figura vera (fessura da 1 µm), con valori fissi
  const RAGGI = (() => {
    const cdf = [], ang = []; let acc = 0;
    for (let g = -60; g <= 60; g += .1) { acc += intensita(g * GRAD, 1); cdf.push(acc); ang.push(g * GRAD); }
    return [.16, .64, .37, .9, .06, .73].map(u => { let i = 0; while (cdf[i] < u * acc) i++; return ang[i]; });
  })();
  function scenaSinistra(ctx, t) {
    if (t < 7.5 || t > T_FINE + .3) return;
    const al = P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, CS[0], CS[1], CS[2], CS[3]);
    const aum = larghezza(t), h = aum * PXUM / 2;
    onde(ctx, t, P(t, 7.8, 8.6));
    schermo(ctx, t, P(t, 8.4, 9.2));
    // la parete con la fessura
    ctx.fillStyle = css(C.ink, .85);
    ctx.fillRect(XW - 6, 172, 12, YC - h - 172); ctx.fillRect(XW - 6, YC + h, 12, 786 - YC - h);
    chip(ctx, '{v:fessura}', XW, 146, 1, 28);
    txt(ctx, 'schermo', XS + 13, 128, { size: 26, color: C.dim, alpha: P(t, 8.4, 9.2) });
    txt(ctx, 'quanta luce →', 1080, 790, { size: 26, color: C.dim, alpha: P(t, 8.4, 9.2) });
    drawRich(ctx, '{dim:onde ingrandite}\n{dim:al rallentatore}', 275, 700, { size: 26, lh: 1.3, alpha: P(t, 8.0, 8.6) });
    // il ventaglio (dal 32,6), e i ventagli delle fessure più larghe per confronto (38,6–43,6)
    const kG = life(t, 38.7, 43.6, .4, .4);
    ventaglio(ctx, aum, C.v, life(t, 32.7, T_FINE, .5, .4), false);
    ventaglio(ctx, aum, C.v, life(t, 32.7, T_FINE, .5, .4) * (1 - kG) * (1 - life(t, 49.7, 55.4, .3, .4)), true);   // θ via mentre lo coprirebbero i confronti o i raggi
    ventaglio(ctx, 4, C.dim, kG, false); ventaglio(ctx, 2, C.dim, kG, false);
    [[4, '7°'], [2, '14°'], [1, '30°']].forEach(([a, s]) => chip(ctx, (a === 1 ? '{v:' : '{dim:') + s + '}', XS - 60, YC - y1(a) * (XS - 60 - XW) / LS - 26, kG, 28));
    // Δx: dove passa il fotone
    const kX = life(t, 43.9, 72.6, .4, .4);
    if (kX > 0) {
      ctx.save(); ctx.globalAlpha *= kX;
      ctx.fillStyle = css(C.paper, .92); ctx.fillRect(XW - 38, YC - h - 6, 26, 2 * h + 12);
      linea(ctx, [XW - 25, YC - h + 8], [XW - 25, YC + h - 8], C.x, 3, 1);
      arrowHead(ctx, [XW - 25, YC - h + 2], -Math.PI / 2, C.x, .6); arrowHead(ctx, [XW - 25, YC + h - 2], Math.PI / 2, C.x, .6);
      ctx.restore();
      chip(ctx, '{mx:Δx} = {mink:a}', XW - 120, YC, kX, 32);
    }
    // i fotoni escono in direzioni diverse (49,6–55,0)
    RAGGI.forEach((ph, i) => {
      const k = life(t, 49.9 + .7 * i, 55.0, .3, .4);
      if (k <= 0) return;
      const E1 = [XS, YC + LS * Math.tan(ph)];
      linea(ctx, [XW + 6, YC], E1, C.ink, 2.5, .75 * k);
      dot(ctx, E1, VERDE, k, 9);
    });
    // la quantità di moto al bordo del ventaglio e la sua parte di traverso (61,2–72,6)
    const kP = life(t, 61.3, 72.6, .4, .4);
    if (kP > 0) {
      const th = Math.asin(senPrimoBuio(aum)), LP = 240, S = [XW + 8, YC], Ep = [S[0] + LP * Math.cos(th), S[1] - LP * Math.sin(th)];
      dashed(ctx, S, [Ep[0], YC], C.dim, 1, kP);
      freccia(ctx, S, Ep, C.ink, 5, kP);
      freccia(ctx, [Ep[0], YC], Ep, C.v, 5, kP * P(t, 62.2, 62.8));
      chip(ctx, '{mink:p}', (S[0] + Ep[0]) / 2 - 30, (S[1] + Ep[1]) / 2 - 30, kP, 34);
      chip(ctx, '{mv:Δp} = {mink:p}·sin {mink:θ}', Ep[0] + 120, (YC + Ep[1]) / 2, kP * P(t, 62.4, 62.9), 30);
    }
    ctx.restore();
  }

  // ---------- la scheda di destra: i numeri ----------
  const RC = [1230, 110, 580, 690], CX = 1520;
  function scenaDestra(ctx, t) {
    if (t < 7.6 || t > T_FINE + .3) return;
    const al = P(t, 7.6, 8.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, RC[0], RC[1], RC[2], RC[3]);
    const aum = larghezza(t);
    // 1 · la fessura e il primo buio
    const k1 = 1 - P(t, 43.6, 44.1);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      conFont(TITOLI, () => drawRich(ctx, 'la fessura', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{mink:λ} = 500 nm', CX, 236, { size: 36, local: t - 8.0 });
      drawRich(ctx, '{dim:lunghezza d’onda della luce verde}', CX, 282, { size: 28, local: t - 8.4 });
      const kA = P(t, 10.4, 11.0);
      drawRich(ctx, '{mink:a} =', 1488, 370, { size: 48, align: 'right', alpha: kA });
      fixedNum(ctx, fmtA(aum), 1574, 370, 48, C.ink, kA);
      txt(ctx, 'µm', 1590, 370, { size: 48, align: 'left', alpha: kA });
      drawRich(ctx, '{dim:larghezza della fessura}', CX, 420, { size: 28, alpha: kA });
      const kB = P(t, 32.8, 33.4);
      if (kB > 0) {
        drawRich(ctx, '{dim:il primo buio:} sin {mink:θ} = {mink:λ}/{mink:a}', CX, 500, { size: 36, alpha: kB });
        drawRich(ctx, '{mink:θ}{dim:: angolo dalla direzione di prima}', CX, 548, { size: 28, alpha: kB });
        drawRich(ctx, '{mink:θ} ≈', 1512, 620, { size: 44, align: 'right', alpha: kB });
        fixedNum(ctx, String(Math.round(Math.asin(senPrimoBuio(aum)) / GRAD)), 1584, 620, 44, C.v, kB);
        txt(ctx, '°', 1586, 620, { size: 44, align: 'left', color: C.v, alpha: kB });
      }
      drawRich(ctx, '{v:fessura più stretta, ventaglio più largo}', CX, 718, { size: 28, local: t - 38.8 });
      ctx.restore();
    }
    // 2 · posizione e direzione
    const k2 = life(t, 43.8, 72.9, .5, .4);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      conFont(TITOLI, () => drawRich(ctx, 'posizione e direzione', CX, 165, { size: 40, weight: 600 }));
      drawRich(ctx, '{mx:Δx} = {mink:a}{dim:: incertezza sulla posizione}', CX, 226, { size: 28, local: t - 44.0 });
      drawRich(ctx, '{mv:Δp}{dim:: incertezza sulla quantità di moto}', CX, 268, { size: 28, local: t - 49.8 });
      drawRich(ctx, '{dim:di traverso}', CX, 304, { size: 28, local: t - 50.4 });
      drawRich(ctx, '{mink:p} = {mink:h}/{mink:λ} ≈ {mink:1,3·10⁻²⁷} kg·m/s', CX, 366, { size: 30, local: t - 55.4 });
      drawRich(ctx, '{dim:con} {mink:h} ≈ {mink:6,63·10⁻³⁴} J·s', CX, 408, { size: 28, local: t - 56.2 });
      drawRich(ctx, '{mv:Δp} ≈ {mink:p}·sin {mink:θ} = {mink:h}/{mink:a}', CX, 470, { size: 36, local: t - 63.2 });
      // la tabella delle tre fessure
      const kT = P(t, 67.1, 67.6);
      if (kT > 0) {
        const XC = [1345, 1530, 1715];
        drawRich(ctx, '{mx:Δx} = {mink:a}', XC[0], 540, { size: 28, alpha: kT });
        drawRich(ctx, '{mv:Δp}{dim:, kg·m/s}', XC[1], 540, { size: 28, alpha: kT });
        drawRich(ctx, '{mx:Δx}·{mv:Δp}{dim:, J·s}', XC[2], 540, { size: 28, alpha: kT });
        ctx.save(); ctx.globalAlpha *= kT; ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1262, 562); ctx.lineTo(1778, 562); ctx.stroke(); ctx.restore();
        [['4 µm', '1,7·10⁻²⁸'], ['2 µm', '3,3·10⁻²⁸'], ['1 µm', '6,6·10⁻²⁸']].forEach(([a, dp], i) => {
          const k = P(t, 67.3 + i * .5, 67.8 + i * .5), y = 598 + i * 44;
          drawRich(ctx, a, XC[0], y, { size: 30, alpha: k });
          drawRich(ctx, '{mink:' + dp + '}', XC[1], y, { size: 30, alpha: k });
          drawRich(ctx, '{mg:6,6·10⁻³⁴}', XC[2], y, { size: 30, alpha: k * P(t, 68.8, 69.3) });
        });
        drawRich(ctx, '{g:il prodotto è sempre circa} {mink:h}', CX, 740, { size: 28, alpha: P(t, 69.6, 70.1) });
      }
      ctx.restore();
    }
    // 3 · Heisenberg
    const k3 = P(t, 72.9, 73.4);
    if (k3 > 0) {
      ctx.save(); ctx.globalAlpha *= k3;
      conFont(TITOLI, () => drawRich(ctx, 'Heisenberg, 1927', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{mx:Δx}·{mv:Δp} ≥ {mink:h/(4π)}', CX, 260, { size: 60, local: t - 73.2 });
      drawRich(ctx, '{dim:mai di meno, per nessuna misura}', CX, 322, { size: 28, local: t - 74.2 });
      drawRich(ctx, '{mink:h/(4π)} ≈ {mink:5,3·10⁻³⁵} J·s', CX, 392, { size: 34, local: t - 80.0 });
      drawRich(ctx, '{dim:la fessura:} {mx:Δx}·{mv:Δp} ≈ {mink:6,6·10⁻³⁴} J·s', CX, 444, { size: 28, local: t - 81.4 });
      checkMark(ctx, 1440, 500, P(t, 82.4, 83.2), C.g, .3);
      drawRich(ctx, '{g:sta sopra}', 1548, 500, { size: 30, alpha: P(t, 82.6, 83.1) });
      const kR = P(t, 87.5, 88.0);
      if (kR > 0) {
        drawRich(ctx, '{r:se fosse colpa dello strumento,}', 1490, 566, { size: 28, alpha: kR });
        drawRich(ctx, '{r:con bordi perfetti} {mr:Δp} {r:= 0}', 1490, 604, { size: 28, alpha: kR });
        crossMark(ctx, 1745, 585, P(t, 91.5, 92.3), C.r, .4);
      }
      drawRich(ctx, '{g:il ventaglio viene dall’onda:}', CX, 680, { size: 30, local: t - 92.0 });
      drawRich(ctx, '{dim:c’è anche con bordi perfetti}', CX, 722, { size: 28, local: t - 92.8 });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Più stringi, più si allarga', W / 2, 180, { size: 118, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < T_FINE - .1) return;
    const al = 1 - P(t, 105.7, 106.7);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
      drawRich(ctx, 'Più è certa la posizione,\npiù è incerta la quantità di moto.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
    });
    const pills = [[450, '{mx:Δx}·{mv:Δp} ≥ {mink:h/(4π)}\n{dim:il principio di Heisenberg}'], [960, '{mx:Δx} = {mink:a}{dim:,} {mv:Δp} ≈ {mink:h}/{mink:a}\n{dim:la fessura}'], [1470, 'non è lo strumento:\n{dim:è l’onda}']];
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
    ['soffio', 7.5], ['pop', 8.4, .45], ['pop', 10.4, .55],                           // onde e schermo, la larghezza a
    ['tono', 18.9, 20.4, [.25, .35, .45]],                                            // a 2 µm: il ventaglio si allarga
    ['tono', 27.7, 29.2, [.45, .65, .85]],                                            // a 1 µm: ancora di più
    ['traccia', 32.7, 33.2], ['pop', 32.8, .6],                                       // il primo buio, sin θ = λ/a
    ['traccia', 38.7, 39.1], ['pop', 38.8, .45],                                      // 7°, 14°, 30°
    ['pop', 43.9, .5],                                                                // Δx = a
    ['pop', 49.9, .65], ['pop', 50.6, .45], ['pop', 51.3, .55], ['pop', 52.0, .3], ['pop', 52.7, .75], ['pop', 53.4, .41],   // i fotoni escono dove capita
    ['pop', 55.4, .5],                                                                // p = h/λ
    ['pop', 61.3, .45], ['traccia', 62.2, 62.8], ['pop', 63.2, .6],                   // p, la parte di traverso, Δp = h/a
    ['pop', 67.3, .35], ['pop', 67.8, .5], ['pop', 68.3, .65], ['ding', 69.6],        // le tre fessure: il prodotto resta h
    ['pop', 73.2, .7],                                                                // Heisenberg
    ['pop', 80.0, .45], ['pop', 81.4, .5], ['ding', 82.5],                            // la stima sta sopra
    ['pop', 87.5, .25], ['pop', 91.5, .1], ['pop', 92.0, .55],                        // non è lo strumento: è l'onda
    ['soffio', 97.2], ['pop', 99.4, .5], ['pop', 99.9, .6], ['pop', 100.4, .7],       // in una frase
  ];
  return {
    titolo: 'Più stringi, più si allarga', durata: 107.1, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 43.6, 'la fessura che si stringe'], [43.6, 72.6, 'posizione e direzione'], [72.6, T_FINE, 'il principio di Heisenberg']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSinistra(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
