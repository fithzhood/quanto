'use strict';
/* Il fuoco d'artificio — il centro di massa: media delle posizioni pesata con le masse; un fuoco d'artificio di 4 kg
   lanciato a (12; 19,6) m/s esplode nel punto più alto in tre pezzi (2 kg, 1 kg, 1 kg), ognuno sulla sua parabola;
   il centro di massa calcolato dai pezzi resta sulla parabola di prima finché nessun pezzo tocca terra. Senza aria.
   Argomento: quantita-di-moto. */
CVIDEO.registra('quantita-di-moto/centro-di-massa', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, richW, txt, fmtN, card, ball, arrowHead, dashed } = M;

  // ---------- la fisica: g = 9,8 m/s², niente aria ----------
  const G = 9.8, VX = 12, VY = 19.6, TE = VY / G;   // l'esplosione nel punto più alto, dopo 2 s, in (24; 19,6) m
  const XE = VX * TE, YE = VY * TE - G * TE * TE / 2;
  // i pezzi subito dopo l'esplosione: Σ m·vx = 48 = 4 kg · 12 m/s, Σ m·vy = 0 (le forze dell'esplosione sono interne)
  const PEZZI = [{ m: 2, vx: 12, vy: 6, nome: 'A' }, { m: 1, vx: 30, vy: -6, nome: 'B' }, { m: 1, vx: -6, vy: -6, nome: 'C' }];
  const MT = PEZZI.reduce((s, q) => s + q.m, 0);
  PEZZI.forEach(q => { q.T = (q.vy + Math.sqrt(q.vy * q.vy + 2 * G * YE)) / G; });   // quando tocca terra (dopo l'esplosione)
  function pezzo(q, tau) {   // dove sta il pezzo al tempo vero tau dal lancio; a terra si ferma
    const d = Math.min(Math.max(tau - TE, 0), q.T);
    return [XE + q.vx * d, Math.max(0, YE + q.vy * d - G * d * d / 2)];
  }
  const parabola = tau => [VX * tau, VY * tau - G * tau * tau / 2];
  function centro(tau) {
    if (tau <= TE) return parabola(tau);
    let x = 0, y = 0;
    for (const q of PEZZI) { const p = pezzo(q, tau); x += q.m * p[0]; y += q.m * p[1]; }
    return [x / MT, y / MT];
  }
  // il tempo: al rallentatore 2 volte, due fermi immagine (0,02 s dopo l'esplosione e a 3,4 s, prima che i pezzi tocchino terra)
  const LENTO = 2, TL = 26.2, TF1 = TL + 2.02 * LENTO, TR1 = 43.1, TF2 = TR1 + 1.38 * LENTO, TR2 = 52.3;
  const tauF = t => t < TL ? 0 : t < TF1 ? (t - TL) / LENTO : t < TR1 ? 2.02 : t < TF2 ? 2.02 + (t - TR1) / LENTO : t < TR2 ? 3.4 : Math.min(3.4 + (t - TR2) / LENTO, 4.8);
  // lo schermo: 20 px per metro, lancio da (420; 740)
  const X0 = 420, YG = 740, S = 20;
  const sc = ([x, y]) => [X0 + x * S, YG - y * S];

  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [61.9, 190], [63.2, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [61.9, 1050], [63.2, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [61.9, 2.2], [63.2, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [61.9, 2], [63.2, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [61.9, -1.5], [63.2, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.1, 'pensa'], [17.2, 'felice'],
    [21.6, 'neutro'], [30.1, 'sorpreso'], [33.5, 'neutro'], [38.4, 'felice'], [43.1, 'festa'], [47.7, 'neutro'],
    [52.3, 'sorpreso'], [57.4, 'neutro'], [64.4, 'felice'], [68.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Un fuoco d’artificio esplode:\nche fine fa la sua parabola?'],
    [7.9, 12.0, 'Tre masse su una riga:\n2, 1 e 1 kg.'],
    [12.1, 17.1, 'Il {v:centro di massa} è la media\ndelle posizioni, pesata con le masse.'],
    [17.15, 21.4, 'Media semplice: 2,7 m. Pesata:\n{g:2 m}, verso la massa grande.'],
    [21.5, 25.8, 'Un fuoco d’artificio di 4 kg,\nsparato in obliquo. Senza aria.'],
    [25.9, 30.0, 'Sale lungo una {v:parabola},\nal rallentatore 2 volte…'],
    [30.1, 33.4, '…ed esplode in tre pezzi:\nforze {v:interne}.'],
    [33.5, 38.3, 'Nello scoppio il peso è trascurabile:\nla quantità di moto {g:non cambia}.'],
    [38.4, 43.0, 'Sommate, le loro quantità di moto\nfanno 48 kg·m/s, come prima.'],
    [43.1, 47.6, 'E il centro di massa dei pezzi\nresta {g:sulla parabola}!'],
    [47.7, 52.2, 'Come un punto con tutta la massa,\nsotto il solo peso.'],
    [52.3, 57.3, 'Poi i pezzi toccano terra: il suolo\nli ferma, ed è una forza {y:esterna}.'],
    [57.4, 61.8, 'Le forze interne non cambiano\nil moto del {v:centro di massa}.'],
    [64.4, 69.4, 'Il centro di massa segue le forze\nesterne, qualunque cosa succeda dentro.'],
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
  function fermo(ctx, x, y, al, testo) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
    if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
    else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
    txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  // testo ricco con pedici a lettere: «{mink:x}⌊cm⌋» scrive x con «cm» piccolo in basso
  function conPedici(ctx, s, x, y, o = {}) {
    const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
    if (al <= 0) return;
    const parti = s.split(/⌊([^⌋]*)⌋/);
    const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
    const tot = ws.reduce((a, b) => a + b, 0);
    let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
    parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
  }
  // il segno del centro di massa: un cerchio viola con la croce
  function segnoCM(ctx, p, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.fillStyle = css(C.paper, .85); ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p[0] - 22, p[1]); ctx.lineTo(p[0] + 22, p[1]); ctx.moveTo(p[0], p[1] - 22); ctx.lineTo(p[0], p[1] + 22); ctx.stroke();
    ctx.restore();
  }
  const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
  const RAGGIO = m => 9 + 5 * m;   // pezzi più pesanti, pallini più grandi (solo nel disegno)

  // ---------- 1 · il centro di massa di tre masse su una riga (7,5–21,5) ----------
  const RX0 = 560, RS = 140, RY = 380;   // lo zero della riga, 140 px per metro, quota della riga
  const RIGA = [{ m: 2, x: 0 }, { m: 1, x: 2 }, { m: 1, x: 6 }];
  const XCM = RIGA.reduce((s, q) => s + q.m * q.x, 0) / RIGA.reduce((s, q) => s + q.m, 0);   // 2 m
  function sceneRiga(ctx, t) {
    if (t < 7.5 || t > 21.8) return;
    const al = life(t, 7.6, 21.6, .6, .5);
    card(ctx, 372, 108, 1468, 692, al);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(RX0 - 40, RY); ctx.lineTo(RX0 + 6 * RS + 40, RY); ctx.stroke();
    for (let i = 0; i <= 6; i++) {
      const x = RX0 + i * RS;
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, RY + 6); ctx.lineTo(x, RY + 20); ctx.stroke();
      txt(ctx, String(i), x, RY + 44, { size: 30, color: C.dim });
    }
    drawRich(ctx, '{mink:x} (m)', RX0 + 6 * RS + 70, RY + 44, { size: 30, align: 'left' });
    RIGA.forEach((q, i) => {
      const k = P(t, 8.2 + i * .3, 8.7 + i * .3, E.back), r = RAGGIO(q.m) * 2;
      if (k <= 0) return;
      ball(ctx, RX0 + q.x * RS, RY - r - 3, '', mix(C.dim, C.ink, .25), { r, scale: k });
      txt(ctx, q.m + ' kg', RX0 + q.x * RS, RY - 2 * r - 30, { size: 30, weight: 600, alpha: k });
    });
    const kc = P(t, 17.3, 17.8);
    if (kc > 0) {
      const p = [RX0 + XCM * RS, RY + 100];
      ctx.save(); ctx.globalAlpha *= kc; ctx.setLineDash([8, 8]); ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p[0], RY + 8); ctx.lineTo(p[0], p[1] - 22); ctx.stroke(); ctx.restore();
      segnoCM(ctx, p, kc);
      drawRich(ctx, '{v:centro di massa}', p[0] + 34, p[1], { size: 32, align: 'left', alpha: kc });
    }
    conPedici(ctx, '{mink:x}⌊cm⌋{mink: = Σ m·x / Σ m}', 1106, 600, { size: 44, align: 'center', alpha: P(t, 12.4, 12.9) });
    txt(ctx, 'Σ vuol dire «somma»', 1106, 652, { size: 30, color: C.dim, alpha: P(t, 13.0, 13.5) });
    conPedici(ctx, '{mink:x}⌊cm⌋ = (2 · 0 + 1 · 2 + 1 · 6) / 4 = {g:2 m}', 1106, 712, { size: 40, align: 'center', alpha: P(t, 17.3, 17.8) });
    ctx.restore();
  }

  // ---------- 2 · il fuoco d'artificio (21,5–62) ----------
  function sceneFuoco(ctx, t) {
    if (t < 21.3 || t > 62.2) return;
    const al = life(t, 21.5, 62.0, .6, .5), tau = tauF(t);
    card(ctx, 372, 108, 1468, 692, al);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css(C.g, .2); ctx.fillRect(373, YG, 1466, 59);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(373, YG); ctx.lineTo(1839, YG); ctx.stroke();
    // la parabola che avrebbe fatto senza esplodere, tratteggiata
    const kp = P(t, 26.0, 26.6);
    if (kp > 0) {
      ctx.save(); ctx.globalAlpha *= .55 * kp; ctx.setLineDash([10, 10]); ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      ctx.beginPath(); for (let i = 0; i <= 80; i++) { const p = sc(parabola(4 * i / 80)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    }
    // la scia del fuoco d'artificio intero, poi quelle dei pezzi
    ctx.save(); ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 3; ctx.lineJoin = 'round';
    if (tau > 0) { ctx.beginPath(); for (let i = 0; i <= 50; i++) { const p = sc(parabola(Math.min(tau, TE) * i / 50)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
    if (tau > TE) PEZZI.forEach(q => { ctx.beginPath(); for (let i = 0; i <= 50; i++) { const p = sc(pezzo(q, TE + (tau - TE) * i / 50)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); });
    ctx.restore();
    // il lampo dell'esplosione
    // (nessun lampo: il fermo immagine arriva 0,02 s dopo lo scoppio)
    // i corpi
    const col = mix(C.dim, C.ink, .25);
    if (tau <= TE) ball(ctx, ...sc(parabola(tau)), '', col, { r: RAGGIO(4) - 6 });
    // la quantità di moto del fuoco d'artificio intero mentre sale: 4 kg · (12; 19,6 − 9,8·t), 4 px per kg·m/s; in cima 48 kg·m/s
    const ks = life(t, 25.9, TL + TE * LENTO, .4, .1);
    if (ks > 0 && tau <= TE) {
      const c = sc(parabola(tau)), px = 4 * MT * VX, py = 4 * MT * (VY - G * tau);
      freccia(ctx, c, [c[0] + px, c[1] - py], C.x, ks, 6);
      drawRich(ctx, '{x:quantità di moto} {mx:p}', c[0] + px, c[1] - py - 36, { size: 34, alpha: ks });
    }
    else PEZZI.forEach(q => ball(ctx, ...sc(pezzo(q, tau)), '', col, { r: RAGGIO(q.m) }));
    // al primo fermo immagine: le masse e le quantità di moto dei pezzi (4 px per kg·m/s)
    const km = life(t, TF1, TR1, .4, .4), kq = km;
    if (km > 0) {
      const [pa, pb, pc] = PEZZI.map(q => sc(pezzo(q, tau)));
      const tip = PEZZI.map((q, i) => { const p = [pa, pb, pc][i]; return [p[0] + 4 * q.m * q.vx, p[1] - 4 * q.m * q.vy]; });
      PEZZI.forEach((q, i) => freccia(ctx, [pa, pb, pc][i], tip[i], C.x, kq, 6));
      txt(ctx, 'A · 2 kg', tip[0][0] + 14, tip[0][1] - 18, { size: 30, weight: 600, align: 'left', alpha: km });
      txt(ctx, 'B · 1 kg', tip[1][0] + 16, tip[1][1] - 36, { size: 30, weight: 600, align: 'left', alpha: km });
      txt(ctx, 'C · 1 kg', tip[2][0] + 14, tip[2][1] + 30, { size: 30, weight: 600, align: 'left', alpha: km });
    }
    // il centro di massa calcolato dai pezzi
    const kc = P(t, 43.2, 43.7);
    if (kc > 0) {
      // la sua scia: sulla parabola finché i pezzi sono in aria, poi se ne stacca
      ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.beginPath(); for (let i = 0; i <= 80; i++) { const q = sc(centro(TE + (tau - TE) * i / 80)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.restore();
      const p = sc(centro(tau));
      segnoCM(ctx, p, kc);
      drawRich(ctx, '{v:centro di massa}', p[0] - (p[1] > 640 ? 62 : 40), p[1] + (p[1] > 640 ? -30 : 70), { size: 30, align: 'right', alpha: P(t, TF2, TF2 + .4) });
    }
    const testo = (t >= TF1 && t < TR1) || (t >= TF2 && t < TR2) ? 'fermo immagine' : 'al rallentatore, 2 volte';
    fermo(ctx, 404, 150, P(t, TL - .3, TL) * (t > 55.6 ? 1 - P(t, 55.6, 56.0) : 1), testo);
    ctx.restore();
    // la scheda in alto a destra
    sceneScheda(ctx, t, al);
  }
  function sceneScheda(ctx, t, al) {
    const k1 = life(t, 33.6, 43.0, .4, .4), k2 = P(t, 43.2, 43.7);
    if (k1 <= 0 && k2 <= 0) return;
    card(ctx, 1300, 128, 520, k1 > 0 ? 286 : 214, al * Math.max(k1, k2));
    ctx.save(); ctx.globalAlpha *= al;
    if (k1 > 0) {   // prima: il fuoco d'artificio in cima; dopo: i tre pezzi punta-coda (5 px per kg·m/s)
      ctx.save(); ctx.globalAlpha *= k1;
      titoletto(ctx, 'quantità di moto (kg·m/s)', 1560, 165);
      const X0S = 1420, YD = 320, XT = X0S + 5 * MT * VX;   // XT: dove finisce la freccia di 48 kg·m/s
      txt(ctx, 'prima', 1320, 214, { size: 30, color: C.dim, align: 'left' });
      freccia(ctx, [X0S, 214], [XT, 214], C.x, 1, 6);
      drawRich(ctx, '{x:48}', XT + 14, 214, { size: 30, align: 'left' });
      txt(ctx, 'dopo', 1320, 300, { size: 30, color: C.dim, align: 'left', alpha: P(t, 38.6, 39.0) });
      // l'ordine A, B, C tiene la freccia corta di C lontana dalle altre punte
      let p = [X0S, YD];
      [2, 0, 1].forEach((j, i) => {
        const q = PEZZI[j], k = P(t, 38.6 + .5 * i, 39.1 + .5 * i), n = [p[0] + 5 * q.m * q.vx, p[1] - 5 * q.m * q.vy];
        freccia(ctx, p, n, C.x, k, 5);
        const et = j === 0 ? [(p[0] + n[0]) / 2 - 14, (p[1] + n[1]) / 2 - 26, 'right'] : j === 1 ? [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2 - 28, 'center'] : [n[0] - 14, n[1] + 6, 'right'];
        txt(ctx, q.nome, et[0], et[1], { size: 30, weight: 600, color: C.x, align: et[2], alpha: k });
        p = n;
      });
      const ks = P(t, 40.2, 40.7);
      dashed(ctx, [XT, 232], [XT, YD - 16], C.dim, 1, ks);
      dashed(ctx, [X0S, YD], [XT - 14, YD], C.x, 1, ks); arrowHead(ctx, [XT, YD], 0, C.x, ks);   // la risultante: finisce dove finiva «prima»
      drawRich(ctx, '{x:totale: 4 kg · 12 m/s, come prima}', 1560, 390, { size: 30, alpha: ks });
      ctx.restore();
    }
    if (k2 > 0) {   // il centro di massa: dai pezzi e sulla parabola
      ctx.save(); ctx.globalAlpha *= k2;
      const tau = tauF(t), c = centro(tau), pr = parabola(Math.min(tau, 4));
      titoletto(ctx, 'centro di massa', 1560, 168);
      drawRich(ctx, '{mink:x}{dim: (m)}', 1650, 214, { size: 30 }); drawRich(ctx, '{mink:y}{dim: (m)}', 1760, 214, { size: 30 });
      txt(ctx, 'dai pezzi', 1330, 262, { size: 30, weight: 600, align: 'left' });
      txt(ctx, 'parabola', 1330, 310, { size: 30, color: C.v, align: 'left' });
      const uguali = Math.abs(c[0] - pr[0]) < .05 && Math.abs(c[1] - pr[1]) < .05;
      txt(ctx, fmtN(c[0], 1), 1680, 262, { size: 32, weight: 600, align: 'right', color: uguali ? C.g : C.ink });
      txt(ctx, fmtN(c[1], 1), 1790, 262, { size: 32, weight: 600, align: 'right', color: uguali ? C.g : C.ink });
      txt(ctx, fmtN(pr[0], 1), 1680, 310, { size: 32, align: 'right', color: C.v, alpha: pr[1] >= 0 ? 1 : .35 });
      txt(ctx, fmtN(Math.max(pr[1], 0), 1), 1790, 310, { size: 32, align: 'right', color: C.v, alpha: pr[1] >= 0 ? 1 : .35 });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- titolo e riassunto ----------
  function sceneIntro(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il fuoco d’artificio', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function sceneFine(ctx, t) {
    if (t < 62.0) return;
    const al = 1 - P(t, 70.1, 71.1);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 62.2 });
      drawRich(ctx, 'Le forze interne non cambiano il moto\ndel {v:centro di massa}.', W / 2, 290, { size: 64, weight: 600, local: t - 62.6, stagger: .09 });
    });
    const pills = [[490, 'media delle posizioni\n{g:pesata} con le masse'], [960, 'dopo l’esplosione:\nla {v:stessa parabola}'], [1430, 'finché una forza {y:esterna}\nnon lo devia']];
    pills.forEach(([x, s], i) => {
      const a = 64.4 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.2, .3], ['pop', 8.5, .55], ['pop', 8.8, .55],          // tre masse sulla riga
    ['pop', 12.4, .6], ['pop', 13.0, .4],                                             // la formula, Σ
    ['traccia', 17.3, 17.8], ['ding', 17.4],                                          // il centro di massa: 2 m
    ['soffio', 21.5],                                                                 // il fuoco d'artificio
    ['traccia', 26.0, 26.6],                                                          // la parabola tratteggiata
    ['tono', 26.2, 30.2, [.1, .28, .43, .56, .67, .75, .81, .84, .85]],               // sale lungo la parabola
    ['pop', 30.2, .2],                                                                // lo scoppio, fermo immagine
    ['pop', 33.6, .45], ['pop', 38.6, .4], ['pop', 39.1, .55], ['pop', 39.6, .7],     // le quantità di moto, punta-coda
    ['traccia', 40.2, 40.7], ['ding', 40.3],                                          // il totale: come prima
    ['pop', 43.2, .6],                                                                // il centro di massa dei pezzi
    ['tono', 43.1, 45.86, [.85, .84, .81, .76, .68, .59, .48]],                       // resta sulla parabola
    ['pop', 45.9, .45],                                                               // secondo fermo immagine
    ['tono', 52.3, 55.1, [.48, .42, .38, .33, .27, .21, .14, .1]],                    // i pezzi cadono
    ['pop', 52.46, .2], ['pop', 54.91, .15],                                          // toccano terra: forza esterna
    ['soffio', 62.0], ['pop', 64.4, .5], ['pop', 64.9, .6], ['pop', 65.4, .7],        // in una frase
  ];
  return {
    titolo: 'Il fuoco d’artificio', durata: 72, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.4, 'il centro di massa'], [21.4, 61.9, 'il fuoco d’artificio']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneRiga(ctx, t); sceneFuoco(ctx, t); sceneFine(ctx, t); },
  };
});
