'use strict';
/* Luce più luce fa buio — l'esperimento delle due fenditure di Young. Prima l'onda di luce da sola (cresta, gola, λ),
   poi una parete con due fenditure: da ognuna riparte un'onda circolare, le due vanno a passo perché vengono dalla stessa
   luce, e sullo schermo compaiono le frange. In A (differenza di percorso 1 λ) cresta con cresta, in B (½ λ) cresta con
   gola. Chiare per n·λ, scure per (n + ½)·λ; la luce tolta alle scure va nelle chiare (media uguale): la luce è un'onda.
   Moto vero: l'onda piana A·sin(k·x − ω·t) dentro il suo fronte, poi da ogni fenditura sin(k·(xb + r) − ω·t) dentro il
   cerchio r < v·t, e la somma delle due punto per punto; sullo schermo l'intensità è cos²(π·Δ/λ) con Δ = r₂ − r₁
   calcolata con le distanze del disegno. λ = 50 px (ingrandita), al rallentatore. Argomento: luce. */
CVIDEO.registra('luce/young', M => {
  const { W, C, E, P, life, clamp, lerp, css, rgb, mix, shade, TITOLI, conFont, drawRich, txt, card, dashed, dot, crossMark } = M;

  // ---------- la geometria (in pixel del disegno) ----------
  const CS = [140, 110, 1060, 690];                        // la scheda «visto di lato»
  const LAM = 50, V = 60, K = 2 * Math.PI / LAM, OM = K * V;   // λ = 50 px, periodo 0,83 s
  const X0 = CS[0], XB = 400, YC = 455, DD = 240, XS = 1130;   // parete delle fenditure, schermo
  const S1 = [XB, YC - DD / 2], S2 = [XB, YC + DD / 2];
  const dist = (x, y, s) => Math.hypot(x - s[0], y - s[1]);
  const delta = y => (dist(XS, y, S2) - dist(XS, y, S1)) / LAM;   // differenza di percorso, in λ
  function cerca(D0) { let a = CS[1], b = YC; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (delta(m) > D0) a = m; else b = m; } return (a + b) / 2; }
  const YA = cerca(1), YB = cerca(.5);                     // A: 1 λ (y ≈ 297,5); B: ½ λ (y ≈ 377,5)
  const AA = [XS, YA], BB = [XS, YB];

  // 1 · l'onda da sola: parte a 8,2 s, fermo immagine mentre si misura λ
  const TA0 = 8.2, FERMO = [16.6, 20.9];
  const tauA = t => (t - TA0) - clamp(t - FERMO[0], 0, FERMO[1] - FERMO[0]);
  // 2 · le fenditure: l'onda riparte da sinistra a 30,6 s
  const TB0 = 30.6, TBAR = (XB - X0) / V;                 // arriva alla parete dopo 4,33 s
  const piana = (x, tau) => tau <= 0 || x - X0 > V * tau ? 0 : Math.sin(K * (x - X0) - OM * tau);
  const tonda = (r, tau) => { const tb = tau - TBAR; return tb <= 0 || r > V * tb ? 0 : Math.sin(K * (XB - X0 + r) - OM * tau); };
  function altezza(x, y, t) {
    if (t < 30.3) return t < TA0 ? 0 : piana(x, tauA(t)) * (1 - P(t, 29.6, 30.2));
    const tau = t - TB0;
    if (x < XB) return piana(x, tau);
    if (x > XS) return 0;
    return tonda(dist(x, y, S1), tau) + tonda(dist(x, y, S2), tau);
  }
  // l'intensità sullo schermo: cos²(π·Δ/λ), da quando ci sono arrivate tutte e due le onde
  function luce(y, t) {
    const tb = t - TB0 - TBAR, rmax = Math.max(dist(XS, y, S1), dist(XS, y, S2));
    const k = clamp((V * tb - rmax) / (V * .8));
    return k * Math.cos(Math.PI * delta(y)) ** 2;
  }
  const BUIO = () => shade(C.g, -.86), CHIARO = () => shade(C.g, .4);
  const colLuce = I => mix(BUIO(), CHIARO(), I);

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [93.4, 190], [94.7, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [93.4, 1050], [94.7, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [93.4, 2.2], [94.7, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [93.4, 2], [94.7, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [93.4, -1.5], [94.7, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.0, 'sorpreso'], [26.3, 'occhiolino'],
    [30.3, 'neutro'], [39.5, 'felice'], [43.9, 'pensa'], [48.1, 'sorpreso'], [52.7, 'neutro'], [57.5, 'felice'],
    [62.1, 'neutro'], [66.5, 'sorpreso'], [70.9, 'neutro'], [79.5, 'pensa'], [84.3, 'felice'], [89.6, 'festa'],
    [93.8, 'neutro'], [96.4, 'felice'], [100.5, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.3, 'Si può aggiungere luce\ne ottenere il {v:buio}?'],
    [7.9, 12.0, 'Da sinistra arriva una luce\ndi {v:un colore solo}.'],
    [12.2, 16.4, 'La disegno come un’onda: {x:cresta}\nil massimo, {y:gola} il minimo.'],
    [16.6, 20.8, 'Da una cresta alla successiva c’è\nuna {v:lunghezza d’onda}, {mink:λ}.'],
    [21.0, 26.1, 'Nella luce vera {mink:λ} è minuscola:\nfra 400 e 700 nm, miliardesimi di metro.'],
    [26.3, 30.1, 'Qui è {g:ingrandita} moltissimo,\ne va tutto al {v:rallentatore}.'],
    [30.3, 34.9, 'Esperimento di {v:Young}: una parete con\ndue {v:fenditure}, due tagli sottili.'],
    [35.1, 39.3, 'Da ogni fenditura riparte\nun’onda che si allarga in cerchi.'],
    [39.5, 43.7, 'Vengono dalla stessa luce: partono\nsempre {g:cresta con cresta}.'],
    [43.9, 47.9, 'Luce più luce: ci aspetteremmo\nuno schermo {r:tutto chiaro}.'],
    [48.1, 52.5, 'Invece compaiono strisce chiare\ne scure: le {g:frange}.'],
    [52.7, 57.3, 'Fino ad {g:A}, un percorso è più\nlungo dell’altro di 1 {mink:λ}…'],
    [57.5, 61.9, '…così le onde arrivano cresta con\ncresta: si sommano, luce {g:forte}.'],
    [62.1, 66.3, 'Fino a {v:B} invece la differenza\nè di mezza {mink:λ}…'],
    [66.5, 70.7, '…e arrivano cresta con gola:\nsi annullano, {v:buio}.'],
    [70.9, 75.1, 'Differenza {mink:n·λ}, con {mink:n} intero:\nfrangia {g:chiara}.'],
    [75.3, 79.3, 'Differenza {mink:(n + ½)·λ}:\nfrangia {v:scura}.'],
    [79.5, 84.1, 'Al buio la luce non sparisce:\nva a rinforzare le frange {g:chiare}.'],
    [84.3, 89.4, 'Rispetto a «tutto chiaro»: il {g:doppio}\nnelle chiare, zero nelle scure.'],
    [89.6, 93.6, 'Due luci che fanno buio: solo\nle {g:onde} fanno così.'],
    [96.4, 101.4, 'Luce più luce può fare buio,\nperché la luce è un’{g:onda}.'],
  ];

  // ---------- aiutanti ----------
  // un'etichetta su un fondino color carta: l'onda sotto si muove
  function chip(ctx, s, x, y, al = 1, size = 34) {
    if (al <= 0) return;
    const w = M.richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, alpha: al });
  }
  function tracciato(ctx, pts, col, w, trat) {
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; if (trat) ctx.setLineDash(trat);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  }

  // ---------- il campo, punto per punto, su una griglia di 4 px ----------
  const CELLA = 4, NX = CS[2] / CELLA, NY = Math.ceil(CS[3] / CELLA);
  let TELA = null, IMG = null;   // solo un foglio di lavoro: ogni fotogramma lo riscrive tutto
  function campo(ctx, t, al) {
    if (!TELA) { TELA = document.createElement('canvas'); TELA.width = NX; TELA.height = NY; IMG = TELA.getContext('2d').createImageData(NX, NY); }
    const base = rgb(C.paper), cx = rgb(C.x), cy = rgb(C.y), d = IMG.data;
    for (let j = 0; j < NY; j++) {
      const y = CS[1] + (j + .5) * CELLA;
      for (let i = 0; i < NX; i++) {
        const u = clamp(altezza(CS[0] + (i + .5) * CELLA, y, t) / 1.6, -1, 1);   // un'onda sola ≈ 0,6; due creste: pieno
        const c = u >= 0 ? cx : cy, k = Math.abs(u), o = 4 * (j * NX + i);
        d[o] = lerp(base[0], c[0], k); d[o + 1] = lerp(base[1], c[1], k); d[o + 2] = lerp(base[2], c[2], k); d[o + 3] = 255;
      }
    }
    TELA.getContext('2d').putImageData(IMG, 0, 0);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.drawImage(TELA, CS[0], CS[1], NX * CELLA, NY * CELLA);
    ctx.restore();
  }
  // una colonna di luce: le righe dello schermo con la loro intensità
  function colonna(ctx, x0, x1, y0, y1, t, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    for (let y = y0; y < y1; y += 2) { ctx.fillStyle = css(colLuce(luce(y + 1, t))); ctx.fillRect(x0, y, x1 - x0, 2.6); }
    ctx.restore();
  }

  // ---------- la scheda di sinistra: visto di lato ----------
  const Y_LAM = 455;
  function scenaLato(ctx, t) {
    if (t < 7.5 || t > 93.7) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 93.0, 93.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, ...CS);
    campo(ctx, t, P(t, 7.6, 8.3));
    // la parete con le due fenditure e lo schermo
    const kB = P(t, 30.0, 30.6);
    if (kB > 0) {
      ctx.save(); ctx.globalAlpha *= kB; ctx.fillStyle = css(C.ink, .85);
      const y0 = CS[1] + 3, y3 = CS[1] + CS[3] - 3;
      for (const [a, b] of [[y0, S1[1] - 7], [S1[1] + 7, S2[1] - 7], [S2[1] + 7, y3]]) ctx.fillRect(XB - 6, a, 12, b - a);
      ctx.restore();
      colonna(ctx, XS, XS + 30, CS[1] + 3, CS[1] + CS[3] - 3, t, kB);
      chip(ctx, 'parete', XB, 775, kB, 30); chip(ctx, 'schermo', 1062, 775, kB, 30);
      const kf = life(t, 30.6, 39.3, .4, .5);
      if (kf > 0) { dot(ctx, S1, C.v, kf, 8); dot(ctx, S2, C.v, kf, 8); chip(ctx, '{v:fenditure}', XB - 110, YC, kf, 32); }
      chip(ctx, '{dim:Young, inizio Ottocento}', 765, 150, life(t, 30.3, 47.9, .4, .5), 30);
    }
    // legenda
    ctx.save(); ctx.globalAlpha *= .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(156, 126, 226, 132, 12); ctx.fill(); ctx.restore();
    txt(ctx, 'visto di lato', 174, 154, { size: 30, color: C.dim, align: 'left' });
    const kl = P(t, 8.3, 8.9);
    if (kl > 0) {
      ctx.save(); ctx.globalAlpha *= kl; ctx.fillStyle = css(C.x); ctx.fillRect(176, 183, 24, 24); ctx.fillStyle = css(C.y); ctx.fillRect(176, 223, 24, 24); ctx.restore();
      txt(ctx, 'cresta', 212, 195, { size: 30, align: 'left', alpha: kl }); txt(ctx, 'gola', 212, 235, { size: 30, align: 'left', alpha: kl });
    }
    // λ, misurata fra due creste dell'onda ferma
    const kL = life(t, FERMO[0], FERMO[1], .25, .25);
    if (kL > 0) {
      const fr = X0 + V * tauA(t);                                    // il fronte
      let xa = X0 + LAM / 4 + V * tauA(t) - LAM; while (xa > 520) xa -= LAM;   // creste: k·(x − x₀) − ω·t = π/2 + 2π·m
      const xb = xa + LAM;
      if (xb < fr) {
        ctx.save(); ctx.globalAlpha *= kL; ctx.strokeStyle = css(C.v); ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(xa, Y_LAM); ctx.lineTo(xb, Y_LAM); ctx.moveTo(xa, Y_LAM - 34); ctx.lineTo(xa, Y_LAM + 34); ctx.moveTo(xb, Y_LAM - 34); ctx.lineTo(xb, Y_LAM + 34); ctx.stroke(); ctx.restore();
        chip(ctx, '{mink:λ}', (xa + xb) / 2, Y_LAM - 76, kL, 44);
      }
      chip(ctx, '{dim:fermo immagine}', 765, 775, kL, 30);
    }
    chip(ctx, '{mink:λ} {dim:della luce visibile: 400–700 nm}', 640, 640, life(t, 21.2, 30.0, .4, .4), 32);
    chip(ctx, '{mink:λ} {dim:ingrandita · al rallentatore}', 765, 775, life(t, 26.4, 93.6, .4, .4), 30);
    // A e B, con i due percorsi
    const kcA = life(t, 52.9, 61.9, .4, .4), kcB = life(t, 62.3, 70.7, .4, .4);
    if (kcA > 0) { dashed(ctx, S1, AA, C.ink, 1, kcA); dashed(ctx, S2, AA, C.ink, 1, kcA); }
    if (kcB > 0) { dashed(ctx, S1, BB, C.ink, 1, kcB); dashed(ctx, S2, BB, C.ink, 1, kcB); }
    const kA = life(t, 52.7, 70.7, .4, .4), kBB = life(t, 62.1, 70.7, .4, .4);
    if (kA > 0) { dot(ctx, AA, C.g, kA, 10); chip(ctx, '{g:A}', XS - 50, YA - 42, kA, 36); }
    if (kBB > 0) { dot(ctx, BB, C.v, kBB, 10); chip(ctx, '{v:B}', XS - 50, YB + 56, kBB, 36); }
    // le differenze di percorso sulle frange
    const kn = life(t, 71.0, 79.3, .4, .4), ks = life(t, 75.4, 79.3, .4, .4);
    [[YC, '{g:0}'], [YA, '{g:1} {mink:λ}'], [2 * YC - YA, '{g:1} {mink:λ}']].forEach(([y, s]) => chip(ctx, s, XS - 62, y, kn, 32));
    const Y15 = cerca(1.5);
    [[YB, '½'], [2 * YC - YB, '½'], [Y15, '1,5'], [2 * YC - Y15, '1,5']].forEach(([y, s]) => chip(ctx, '{v:' + s + '} {mink:λ}', XS - 62, y, ks, 32));
    ctx.restore();
  }

  // ---------- la scheda di destra ----------
  const RC = [1230, 110, 580, 690], FX0 = 1280, FX1 = 1490, IX0 = 1560, IX1 = 1750, FY0 = 190, FY1 = 740;
  const GX0 = 1272, GX1 = 1768, TPER = 2 * Math.PI / OM;
  // quello che fa la luce in un punto: le due onde (tratteggiate) e la loro somma, negli ultimi 3 periodi
  function grafico(ctx, t, yc, titolo, r1, r2, col, al, uguali) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => drawRich(ctx, titolo, 1520, yc - 162, { size: 34, weight: 600 }));
    const AG = 36, tau = t - TB0, N = 150;
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX0, yc); ctx.lineTo(GX1, yc); ctx.stroke();
    const a = [], b = [], s = [];
    for (let i = 0; i <= N; i++) {
      const x = lerp(GX0, GX1, i / N), tt = tau - 3 * TPER * (1 - i / N), h1 = tonda(r1, tt), h2 = tonda(r2, tt);
      a.push([x, yc - AG * h1]); b.push([x, yc - AG * h2]); s.push([x, yc - AG * (h1 + h2)]);
    }
    tracciato(ctx, a, C.dim, 3, [9, 7]); tracciato(ctx, b, C.dim, 3, [3, 7]);
    tracciato(ctx, s, col, 6);
    dot(ctx, s[N], col, 1, 9);
    drawRich(ctx, uguali ? '{dim:tratteggio: due onde uguali}' : '{dim:tratteggio: le due onde}', GX0, yc + 100, { size: 30, align: 'left' });
    drawRich(ctx, (col === C.g ? '{g:' : '{v:') + 'la somma}', GX0, yc - 112, { size: 30, align: 'left' });
    txt(ctx, 'tempo →', GX1, yc - 112, { size: 30, color: C.dim, align: 'right' });
    ctx.restore();
  }
  function scenaDestra(ctx, t) {
    if (t < 43.7 || t > 93.7) return;
    const al = P(t, 43.7, 44.3) * (1 - P(t, 93.0, 93.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, ...RC);
    // lo schermo visto di fronte: le stesse righe dello schermo di lato
    const kS = 1 - life(t, 52.5, 70.9, .4, .4);
    if (kS > 0) {
      ctx.save(); ctx.globalAlpha *= kS;
      txt(ctx, 'schermo di fronte', (FX0 + FX1) / 2, 152, { size: 30, color: C.dim });
      colonna(ctx, FX0, FX1, FY0, FY1, t, 1);
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(FX0, FY0, FX1 - FX0, FY1 - FY0);
      ctx.restore();
    }
    // l'ipotesi «tutto chiaro», smentita
    const kI = life(t, 43.9, 52.5, .4, .4);
    if (kI > 0) {
      ctx.save(); ctx.globalAlpha *= kI;
      ctx.fillStyle = css(colLuce(.5)); ctx.fillRect(IX0, FY0, IX1 - IX0, FY1 - FY0);
      ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.strokeRect(IX0, FY0, IX1 - IX0, FY1 - FY0); ctx.setLineDash([]);
      drawRich(ctx, '{r:se fosse così}', (IX0 + IX1) / 2, 770, { size: 30 });
      crossMark(ctx, (IX0 + IX1) / 2, (FY0 + FY1) / 2, P(t, 48.3, 49.1), C.r, .9);
      ctx.restore();
    }
    // quanta luce, riga per riga: il doppio della media nelle chiare, zero nelle scure
    const kG = life(t, 79.5, 93.6, .5, .4);
    if (kG > 0) {
      ctx.save(); ctx.globalAlpha *= kG;
      txt(ctx, 'quanta luce →', (IX0 + IX1) / 2, 152, { size: 30, color: C.dim });
      ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(IX0, FY0); ctx.lineTo(IX0, FY1); ctx.stroke();
      const xm = (IX0 + IX1) / 2;
      ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(xm, FY0); ctx.lineTo(xm, FY1); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{r:«tutto chiaro»}', xm, 770, { size: 30 });
      const pts = []; for (let y = FY0; y <= FY1; y += 2) pts.push([IX0 + (IX1 - IX0) * luce(y, t), y]);
      tracciato(ctx, pts, C.g, 5);
      ctx.restore();
    }
    grafico(ctx, t, 335, 'nel punto {g:A}: differenza 1 {mink:λ}', dist(XS, YA, S1), dist(XS, YA, S2), C.g, life(t, 52.7, 70.7, .5, .4), true);
    grafico(ctx, t, 655, 'nel punto {v:B}: differenza ½ {mink:λ}', dist(XS, YB, S1), dist(XS, YB, S2), C.v, life(t, 62.1, 70.7, .5, .4), false);
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Luce più luce fa buio', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 93.4) return;
    const al = 1 - P(t, 102.0, 103.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 93.8 });
      drawRich(ctx, 'Due onde di luce si sommano:\ncresta con gola fanno buio.', W / 2, 290, { size: 66, weight: 600, local: t - 94.2, stagger: .08 });
    });
    const pills = [[490, 'differenza {mink:n·λ}:\nfrangia {g:chiara}'], [960, 'differenza {mink:(n + ½)·λ}:\nfrangia {v:scura}'], [1430, 'la luce\nè un’{g:onda}']];
    pills.forEach(([x, s], i) => {
      const a = 95.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): le onde hanno un tono breve che va su e giù, come cresta e gola
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 8.2, 9.4, [.5, .8, .2, .8, .2, .5]], ['pop', 8.4, .4],  // l'onda parte; cresta e gola
    ['traccia', 16.6, 16.85], ['pop', 16.8, .5],                                      // fermo immagine: λ
    ['pop', 21.3, .4], ['pop', 26.5, .35],                                            // 400–700 nm; ingrandita
    ['pop', 30.2, .5], ['pop', 30.7, .45],                                            // la parete, le fenditure
    ['tono', 30.6, 31.8, [.5, .8, .2, .8, .2, .5]],                                   // l'onda riparte
    ['pop', 35.0, .55],                                                               // da ogni fenditura, un cerchio
    ['soffio', 43.7], ['pop', 44.0, .45],                                             // l'ipotesi «tutto chiaro»
    ['pop', 47.2, .55], ['ding', 48.0], ['pop', 48.4, .3],                            // le frange; smentita
    ['pop', 52.8, .5], ['traccia', 52.9, 53.3],                                       // A: differenza 1 λ
    ['pop', 62.2, .45], ['traccia', 62.3, 62.7],                                      // B: differenza ½ λ
    ['pop', 71.1, .55], ['pop', 75.5, .45],                                           // n·λ chiara, (n + ½)·λ scura
    ['traccia', 79.5, 80.0], ['pop', 79.7, .5],                                       // quanta luce, riga per riga
    ['soffio', 93.4], ['pop', 95.2, .5], ['pop', 95.7, .6], ['pop', 96.2, .7],        // in una frase
  ];
  return {
    titolo: 'Luce più luce fa buio', durata: 104, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.1, 'un’onda di luce'], [30.1, 52.5, 'le due fenditure'], [52.5, 79.3, 'chiare e scure'], [79.3, 93.6, 'dove va la luce']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaLato(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
