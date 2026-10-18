'use strict';
/* L'onda che gira l'angolo — onde piane (λ = 60 px) contro una parete con una fessura, viste dall'alto. Fessura di 5 λ:
   l'onda passa quasi dritta e si allarga solo ai bordi. Fessura di λ: si apre a ventaglio e arriva dietro la parete.
   Fessura di λ/2: ne passa meno, ma va in tutte le direzioni. La diffrazione è evidente quando la fessura è
   paragonabile a λ o più piccola. Moto vero: a sinistra cos(k·x − ω·t); a destra la somma di Huygens delle onde
   circolari che partono dai punti della fessura (Kirchhoff in due dimensioni, con il fattore (1 + cos θ)/2), che si
   allargano a velocità costante dall'istante in cui la fessura si apre. Al rallentatore. Dietro le
   fessure di λ e λ/2 i colori sono rinforzati 2 volte (scritto nel video), perché l'onda debole si veda.
   Argomento: onde. */
CVIDEO.registra('onde/diffrazione', M => {
  const { W, C, E, P, life, clamp, lerp, css, rgb, TITOLI, conFont, drawRich, txt, card, dashed } = M;

  const CS = [140, 110, 1640, 690], XR = CS[0] + CS[2], YB = CS[1] + CS[3];
  const LAM = 60, K = 2 * Math.PI / LAM, PER = .6, OM = 2 * Math.PI / PER, V = LAM / PER;   // v = 100 px/s
  const XW = 600, SP = 16, YS = 455;                          // la parete (spessa 16 px) e il centro della fessura
  const T_IN = 7.6;                                           // l'onda piana parte dal bordo sinistro
  // le tre fessure: larghezza, quando si apre, quando si chiude (la scena sfuma)
  const FESSURE = [
    { w: 5 * LAM, apre: 17.6, via: [30.7, 31.3], nome: '5 {mink:λ}' },
    { w: LAM, apre: 31.7, via: [49.7, 50.3], nome: '{mink:λ}' },
    { w: LAM / 2, apre: 50.5, via: [64.4, 65.0], nome: '{mink:λ/2}' },
  ];
  const fessura = w => w < 31.3 ? 0 : w < 50.3 ? 1 : 2;     // quale fessura c'è nella parete (tempo delle onde)
  // 12,3–21,3: un pezzo nuovo (creste, gole e λ); la scena aspetta. Le onde scorrono, tranne nel fermo immagine
  // 17,1–21,3 in cui si misura λ: w è il tempo delle onde (le fessure si aprono in quel tempo), u quello della scena.
  const vecchio = t => t < 12.3 ? t : t < 21.3 ? 12.3 : t - 9.0;
  const FERMO = [17.1, 21.3], onde = t => t - clamp(t - FERMO[0], 0, FERMO[1] - FERMO[0]);

  // ---------- il campo dietro la parete: ampiezza e fase di ogni cella, calcolate una volta per fessura ----------
  const CELLA = 4, NX = CS[2] / CELLA, NY = Math.ceil(CS[3] / CELLA);
  const cx = i => CS[0] + (i + .5) * CELLA, cy = j => CS[1] + (j + .5) * CELLA;
  const CAMPI = [];
  function campo(n) {
    if (CAMPI[n]) return CAMPI[n];
    const w = FESSURE[n].w, N = Math.max(3, Math.ceil(w / (LAM / 16))), d = w / N;
    const amp = new Float32Array(NX * NY), fas = new Float32Array(NX * NY), rmin = new Float32Array(NX * NY);
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const x = cx(i), y = cy(j), o = j * NX + i;
      if (x <= XW + SP / 2) continue;
      let re = 0, im = 0;
      for (let s = 0; s < N; s++) {
        const ys = YS - w / 2 + (s + .5) * d, dx = x - (XW + SP / 2), dy = y - ys, r = Math.max(Math.hypot(dx, dy), d);
        const a = d * Math.sqrt(K / (2 * Math.PI * r)) * (1 + dx / r) / 2, ph = K * r - Math.PI / 4;
        re += a * Math.cos(ph); im += a * Math.sin(ph);
      }
      amp[o] = Math.hypot(re, im); fas[o] = Math.atan2(im, re);
      const dy = Math.max(0, Math.abs(y - YS) - w / 2);
      rmin[o] = Math.hypot(x - (XW + SP / 2), dy);
    }
    return (CAMPI[n] = { amp, fas, rmin });
  }
  function altezza(i, j, t, n) {
    const x = cx(i);
    if (x < XW - SP / 2) {                                     // l'onda piana, dietro il suo fronte
      const fr = V * (t - T_IN) - (x - CS[0]);
      return fr <= 0 ? 0 : clamp(fr / (.5 * LAM)) * Math.cos(K * (x - XW) - OM * t);
    }
    if (x <= XW + SP / 2) return 0;                           // dentro la parete
    const F = FESSURE[n], c = campo(n), o = j * NX + i;
    const m = clamp((V * (t - F.apre) - c.rmin[o]) / (.6 * LAM)) * (1 - P(t, F.via[0], F.via[1]));
    return m <= 0 ? 0 : m * c.amp[o] * Math.cos(c.fas[o] - OM * t);
  }

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [69.0, 190], [70.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [69.0, 1050], [70.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [69.0, 2.2], [70.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [69.0, 2], [70.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [69.0, -1.5], [70.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.3, 'felice'], [17.1, 'neutro'], [25.7, 'felice'], [30.7, 'neutro'],
    [39.5, 'sorpreso'], [44.3, 'neutro'], [49.3, 'festa'], [54.1, 'neutro'], [58.7, 'pensa'], [63.7, 'felice'],
    [66.4, 'neutro'], [71.4, 'felice'], [75.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Un’onda può girare\nintorno a un ostacolo?'],
    [7.9, 12.1, 'Onde dritte arrivano contro\nuna parete (al rallentatore).'],
    [12.3, 16.9, 'Azzurro: {x:creste}, i punti più alti.\nArancio: {y:gole}, i più bassi.'],
    [17.1, 21.1, 'Da una cresta alla successiva:\nuna {v:lunghezza d’onda}, {mink:λ}.'],
    [21.3, 25.5, 'Apro una fessura larga\ncinque lunghezze d’onda.'],
    [25.7, 30.5, 'L’onda passa e va quasi dritta,\nfra le due righe tratteggiate.'],
    [30.7, 34.9, 'Si allarga solo un poco,\nai bordi.'],
    [35.1, 39.3, 'Ora la fessura è stretta,\nlarga quanto {mink:λ}.'],
    [39.5, 44.1, 'Dalla fessura l’onda si apre\na ventaglio, in cerchi.'],
    [44.3, 49.1, 'Arriva anche dietro la parete,\ndove dritta non andrebbe.'],
    [49.3, 53.9, 'Questa è la {v:diffrazione}:\nl’onda gira l’angolo.'],
    [54.1, 58.5, 'Ancora più stretta, mezza {mink:λ}:\nl’onda si apre ancora di più.'],
    [58.7, 63.5, 'Ne passa meno, ma va in tutte\nle direzioni, come da un punto.'],
    [63.7, 68.5, 'Si vede bene con una fessura\nparagonabile a {mink:λ}, o più piccola.'],
    [71.4, 77.0, 'Conta il rapporto fra la fessura\ne la lunghezza d’onda.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al = 1, size = 32) {
    if (al <= 0) return;
    const w = M.richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, alpha: al });
  }

  // ---------- l'acqua ----------
  // dietro le fessure strette passa poca onda: i colori lì sono rinforzati (e lo si scrive)
  const GUADAGNO = [1, 2, 2];
  let TELA = null, IMG = null;   // foglio di lavoro, riscritto tutto a ogni fotogramma
  function acqua(ctx, t, al) {
    if (!TELA) { TELA = document.createElement('canvas'); TELA.width = NX; TELA.height = NY; IMG = TELA.getContext('2d').createImageData(NX, NY); }
    const n = fessura(t), base = rgb(C.paper), cc = rgb(C.x), cg = rgb(C.y), d = IMG.data;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const h = altezza(i, j, t, n) * (cx(i) > XW ? GUADAGNO[n] : 1), k = Math.min(1, Math.abs(h)), c = h >= 0 ? cc : cg, o = 4 * (j * NX + i);
      d[o] = lerp(base[0], c[0], k); d[o + 1] = lerp(base[1], c[1], k); d[o + 2] = lerp(base[2], c[2], k); d[o + 3] = 255;
    }
    TELA.getContext('2d').putImageData(IMG, 0, 0);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.drawImage(TELA, CS[0], CS[1], NX * CELLA, NY * CELLA);
    // la parete, con la fessura che si apre
    const F = FESSURE[n], g = F.w * P(t, F.apre - .4, F.apre);
    ctx.fillStyle = css(C.ink, .85);
    ctx.fillRect(XW - SP / 2, CS[1], SP, YS - g / 2 - CS[1]);
    ctx.fillRect(XW - SP / 2, YS + g / 2, SP, YB - YS - g / 2);
    ctx.restore();
  }

  function scenaStagno(ctx, t, T) {
    const w = onde(T);
    if (t < 7.5 || t > 60.4) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 59.6, 60.2));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, ...CS);
    acqua(ctx, w, P(t, 7.6, 8.3));
    const n = fessura(w), F = FESSURE[n];
    // le righe tratteggiate: dove andrebbe un'onda che passa dritta
    const kr = [life(t, 16.8, 25.9, .5, .5), life(t, 30.6, 44.9, .5, .5), life(t, 49.8, 59.6, .5, .5)][n];
    if (kr > 0) for (const s of [-1, 1]) dashed(ctx, [XW + SP / 2 + 4, YS + s * F.w / 2], [XR - 12, YS + s * F.w / 2], C.ink, 1, .7 * kr);
    // la larghezza della fessura
    const kw = life(w, F.apre + .1, F.via[0], .4, .4);
    if (kw > 0) {
      ctx.save(); ctx.globalAlpha *= kw; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(XW - 22, YS - F.w / 2); ctx.lineTo(XW - 22, YS + F.w / 2);
      ctx.moveTo(XW - 32, YS - F.w / 2); ctx.lineTo(XW - 12, YS - F.w / 2); ctx.moveTo(XW - 32, YS + F.w / 2); ctx.lineTo(XW - 12, YS + F.w / 2); ctx.stroke();
      ctx.restore();
      chip(ctx, '{dim:fessura} ' + F.nome, XW - 145, YS, kw, 32);
    }
    // dietro la parete, fuori dalle righe
    const kd = life(t, 35.4, 40.1, .4, .4);
    chip(ctx, '{v:dritta non arriverebbe qui}', 1250, 290, kd, 32);
    chip(ctx, '{v:né qui}', 1250, 680, kd, 32);
    // legenda e scritte
    ctx.save(); ctx.globalAlpha *= .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(158, 128, 300, 96, 12); ctx.fill(); ctx.restore();
    txt(ctx, 'visto dall’alto', 178, 154, { size: 30, color: C.dim, align: 'left' });
    ctx.save(); ctx.fillStyle = css(C.x); ctx.fillRect(178, 184, 22, 22); ctx.fillStyle = css(C.y); ctx.fillRect(318, 184, 22, 22); ctx.restore();
    txt(ctx, 'cresta', 210, 196, { size: 30, align: 'left' }); txt(ctx, 'gola', 350, 196, { size: 30, align: 'left' });
    const kf = life(T, FERMO[0], FERMO[1], .2, .2);
    chip(ctx, '{dim:al rallentatore}', 1640, 150, 1 - kf, 30);
    chip(ctx, '{dim:fermo immagine}', 1640, 150, kf, 30);
    chip(ctx, '{dim:colori rinforzati 2 volte dietro la parete}', 1440, 208, life(t, 26.5, 60.0, .3, .3), 30);
    // creste e λ sulle onde dritte, nel fermo immagine: creste dove K·(x − XW) − ω·w = 2π·m
    const kl = life(T, FERMO[0], FERMO[1], .2, .2);
    if (kl > 0) {
      let xa = XW + LAM * ((w / PER) % 1) - LAM; while (xa > XW - 150) xa -= LAM;   // una cresta a sinistra della parete
      const xb = xa + LAM;
      ctx.save(); ctx.globalAlpha *= kl; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(xa, 330); ctx.lineTo(xb, 330); ctx.moveTo(xa, 312); ctx.lineTo(xa, 348); ctx.moveTo(xb, 312); ctx.lineTo(xb, 348); ctx.stroke(); ctx.restore();
      chip(ctx, '{mink:λ}', (xa + xb) / 2, 288, kl, 36);
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'L’onda che gira l’angolo', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 60.0) return;
    const al = 1 - P(t, 68.4, 69.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 60.3 });
      drawRich(ctx, 'Dietro una fessura l’onda si allarga,\ntanto più quanto è stretta rispetto a {mink:λ}.', W / 2, 290, { size: 62, weight: 600, local: t - 60.7, stagger: .08 });
    });
    const pills = [[490, 'fessura di 5 {mink:λ}:\nquasi dritta'], [960, 'fessura di {mink:λ}:\na ventaglio'], [1430, 'fessura di {mink:λ/2}:\nin tutte le direzioni']];
    pills.forEach(([x, s], i) => {
      const a = 61.9 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 7.6, 8.8, [.35, .6, .35, .6, .35]],                     // lo stagno: parte l'onda
    ['pop', 12.2, .4],                                                                // il fronte arriva alla parete
    ['traccia', 17.1, 17.5], ['pop', 17.3, .55],                                      // fermo immagine: la lambda
    ['tono', 21.4, 21.8, [.3, .7]], ['pop', 21.9, .5],                                // si apre la fessura di 5 lambda
    ['tono', 21.9, 23.4, [.3, .45, .6]],                                              // l'onda passa
    ['traccia', 25.8, 26.3],                                                          // le righe tratteggiate
    ['soffio', 35.0], ['pop', 35.5, .35],                                             // nuova fessura, colori rinforzati
    ['tono', 35.5, 35.9, [.3, .5]], ['pop', 36.0, .5],                                // fessura di una lambda
    ['tono', 36.0, 37.5, [.3, .45, .6]],                                              // il ventaglio
    ['traccia', 39.6, 40.1],                                                          // le righe tratteggiate
    ['pop', 44.4, .55], ['pop', 44.6, .45],                                           // dietro la parete arriva
    ['soffio', 54.0],                                                                 // la terza fessura
    ['tono', 54.3, 54.7, [.3, .4]], ['pop', 54.8, .45],                               // mezza lambda
    ['tono', 54.8, 56.3, [.3, .45, .6]],                                              // in tutte le direzioni
    ['traccia', 58.8, 59.3],                                                          // le righe tratteggiate
    ['soffio', 68.8], ['pop', 70.9, .5], ['pop', 71.4, .6], ['pop', 71.9, .7],        // in una frase
  ];
  return {
    titolo: 'L’onda che gira l’angolo', durata: 80, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.9, 'fessura larga'], [34.9, 53.9, 'fessura stretta'], [53.9, 68.5, 'ancora più stretta']],
    scena(ctx, t) { const u = vecchio(t); scenaTitolo(ctx, u); scenaStagno(ctx, u, t); scenaFine(ctx, u); },
  };
});
