'use strict';
/* Il doppio della velocità, quattro volte la strada — due auto frenano con la stessa decelerazione: lo spazio di frenata
   cresce col quadrato della velocità (v² = 2·a·s); lo spazio di reazione solo in proporzione. Argomento: cinematica. */
CVIDEO.registra('cinematica/frenata', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, txt, fmtN,
    dot, glowStroke, dashed, card, arrowHead, crossMark } = M;

  // ---------- il moto vero: velocità costante fino alla riga, poi decelerazione costante ----------
  const A = 7.7;                                   // m/s²: la velocità cala di 7,7 m/s ogni secondo
  const V50 = 50 / 3.6, V100 = 100 / 3.6;          // 13,9 m/s e 27,8 m/s
  const tStop = v => v / A;                        // 1,80 s e 3,61 s
  const sStop = v => v * v / (2 * A);              // 12,5 m e 50,1 m
  function pos(v, t) {                             // t < 0: prima della riga, a velocità costante
    if (t <= 0) return v * t;
    const tt = Math.min(t, tStop(v));
    return v * tt - A * tt * tt / 2;
  }
  const vel = (v, t) => t <= 0 ? v : Math.max(0, v - A * t);
  // tempo vero (1 s = 1 s): ogni auto arriva già lanciata da fuori della strada (prima è tagliata dal bordo),
  // a velocità costante, e frena dalla riga: la prima tocca la riga a 17,0 s, la seconda a 26,2 s
  const t50 = t => clamp(t - 17.0, -1.2, 2.2);
  const t100 = t => clamp(t - 26.2, -0.7, 4.0);

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [98.8, 190], [100.1, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [98.8, 1050], [100.1, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [98.8, 2.2], [100.1, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [98.8, 2], [100.1, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [98.8, -1.5], [100.1, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.3, 'pensa'], [26.0, 'neutro'],
    [30.5, 'sorpreso'], [34.7, 'neutro'], [38.2, 'pensa'], [41.6, 'neutro'], [55.2, 'festa'], [58.5, 'neutro'],
    [67.2, 'felice'], [71.2, 'neutro'], [79.8, 'festa'], [83.4, 'neutro'], [93.8, 'pensa'], [98.8, 'neutro'],
    [101.5, 'felice'], [104.4, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.3, 'Velocità doppia:\nstrada di frenata doppia?'],
    [7.9, 11.8, 'Da questa riga\nsi comincia a frenare.'],
    [12.0, 16.4, 'Frenando perdono 7,7 m/s\ndi velocità ogni secondo.'],
    [16.6, 21.1, 'La prima va a 50 km/h:\nsi ferma in circa {g:12,5 m}.'],
    [21.3, 25.8, 'Se a velocità doppia servisse\nil {r:doppio} della strada: 25 m?'],
    [26.0, 30.3, 'La seconda arriva a 100 km/h\ne frena dalla stessa riga…'],
    [30.5, 34.5, 'Supera i 25 m: si ferma\na circa {g:50 m}!'],
    [34.7, 38.0, 'Velocità doppia, strada\n{g:quattro volte} più lunga.'],
    [38.2, 41.5, 'Perché? Guardiamo il grafico\n{mx:v}{mink:–t} della frenata.'],
    [41.6, 46.1, 'La velocità scende in linea retta:\n7,7 m/s in meno ogni secondo.'],
    [46.3, 50.0, 'Lo spazio è l\'{g:area} sotto\nil grafico: un triangolo.'],
    [50.2, 55.0, 'A 100 km/h il triangolo è\nalto il doppio e largo il doppio.'],
    [55.2, 58.3, 'Dentro ci stanno {g:quattro}\ntriangoli piccoli!'],
    [58.5, 62.8, '{mx:v₀} è la velocità di partenza,\n{mv:a} il modulo della decelerazione.'],
    [63.0, 67.0, 'Durata {mink:t = }{mx:v₀}{mink:/}{mv:a}; spazio =\narea = ½·{mx:v₀}{mink:·t}.'],
    [67.2, 71.0, 'Quindi {mink:s = }{mx:v₀}{mink:²/(2·}{mv:a}{mink:)},\ncioè {mx:v₀}{mink:² = 2·}{mv:a}{mink:·s}.'],
    [71.2, 74.9, 'Lo spazio di frenata cresce\ncol {g:quadrato} della velocità.'],
    [75.1, 79.6, 'Nel conto servono i m/s:\n100 km/h / 3,6 ≈ 27,8 m/s.'],
    [79.8, 83.2, '27,8² / (2·7,7) ≈ {g:50 m}.\nTorna!'],
    [83.4, 87.9, 'Prima di frenare c\'è circa 1 s\ndi {v:reazione}: l\'auto non rallenta.'],
    [88.1, 93.6, 'In quel secondo: 13,9 m a 50 km/h,\n27,8 m a 100. Solo il {g:doppio}.'],
    [93.8, 98.8, 'Per fermarsi: 26,4 m contro circa 78 m.\nLa frenata pesa sempre di più.'],
    [101.5, 106.0, 'Doppia velocità, quattro volte\nla strada per frenare.'],
  ];

  // ---------- aiutanti ----------
  const num = v => (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ',');
  function piano(o) {
    const p = Object.assign({}, o);
    p.toS = (x, y) => [o.ox + x * o.ux, o.oy - y * o.uy];
    p.assi = (ctx, k) => {
      if (k <= 0) return;
      const { ox, oy, ux, uy, x1, y1 } = o, X1 = ox + x1 * ux, Y1 = oy - y1 * uy;
      ctx.save();
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
      for (const x of o.xg) { const X = ox + x * ux; ctx.beginPath(); ctx.moveTo(X, oy); ctx.lineTo(X, lerp(oy, Y1, k)); ctx.stroke(); }
      for (const y of o.yg) { const Y = oy - y * uy; ctx.beginPath(); ctx.moveTo(ox, Y); ctx.lineTo(lerp(ox, X1, k), Y); ctx.stroke(); }
      ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox - 8, oy); ctx.lineTo(lerp(ox, X1 + 26, k), oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, oy + 8); ctx.lineTo(ox, lerp(oy, Y1 - 26, k)); ctx.stroke();
      arrowHead(ctx, [lerp(ox, X1 + 26, k) + 6, oy], 0, C.ink);
      arrowHead(ctx, [ox, lerp(oy, Y1 - 26, k) - 6], -Math.PI / 2, C.ink);
      ctx.globalAlpha *= P(k, .6, 1);
      for (const x of o.xn) txt(ctx, num(x), ox + x * ux, oy + 30, { size: 28, color: C.dim });
      for (const y of o.yn) txt(ctx, num(y), ox - 16, oy - y * uy, { size: 28, color: C.dim, align: 'right' });
      drawRich(ctx, o.xlab, X1 + 44, oy, { size: 34, align: 'left' });
      drawRich(ctx, o.ylab, ox + 24, Y1 - 30, { size: 34, align: 'left' });
      ctx.restore();
    };
    return p;
  }
  function auto(ctx, x, y, col, s = 1, verso = 1, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.scale(verso * s, s);
    ctx.fillStyle = css(col);
    ctx.beginPath(); ctx.roundRect(-50, -40, 100, 27, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-33, -38); ctx.lineTo(-21, -61); ctx.lineTo(14, -61); ctx.lineTo(33, -38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(C.paper, .85);
    ctx.beginPath(); ctx.moveTo(-26, -41); ctx.lineTo(-17, -56); ctx.lineTo(-4, -56); ctx.lineTo(-4, -41); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2, -41); ctx.lineTo(2, -56); ctx.lineTo(11, -56); ctx.lineTo(25, -41); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.roundRect(41, -35, 8, 7, 2); ctx.fill();
    for (const wx of [-28, 28]) {
      ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(wx, -13, 13, 0, TAU); ctx.fill();
      ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(wx, -13, 5, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function segmento(ctx, a, b, col, k = 1, w = 5) {
    if (k <= 0) return;
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); ctx.restore();
  }

  // ---------- la strada: la riga di frenata in x 560, 20 px per metro ----------
  const XR = 560, PPM = 20, Y1 = 212, Y2 = 262;    // le ruote delle due auto
  const xS = s => XR + s * PPM;
  function scenaStrada(ctx, t) {
    if (t < 7.5 || t > 99.4) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 98.6, 99.3));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 212);
    ctx.fillStyle = css(C.dim, .2); ctx.fillRect(400, 166, 1412, 104);
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([16, 14]);
    ctx.beginPath(); ctx.moveTo(400, 218); ctx.lineTo(1812, 218); ctx.stroke(); ctx.setLineDash([]);
    const kN = P(t, 8.4, 9.2);
    ctx.save(); ctx.globalAlpha *= kN; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
    for (let s = 0; s <= 60; s += 5) { ctx.beginPath(); ctx.moveTo(xS(s), 270); ctx.lineTo(xS(s), s % 10 ? 277 : 282); ctx.stroke(); }
    ctx.restore();
    for (let s = 0; s <= 60; s += 10) txt(ctx, num(s), xS(s), 300, { size: 30, color: C.dim, alpha: kN });
    txt(ctx, 'm', xS(60) + 32, 300, { size: 30, color: C.dim, alpha: kN, align: 'left' });
    // la riga dove si comincia a frenare
    const kR = P(t, 8.2, 8.8);
    ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(XR, 160); ctx.lineTo(XR, 272); ctx.stroke(); ctx.restore();
    txt(ctx, 'si frena da qui', XR, 138, { size: 30, color: C.v, alpha: kR });
    // l'idea sbagliata: «il doppio», 25 m
    const kI = P(t, 22.6, 23.1) * (1 - P(t, 37.4, 37.9));
    if (kI > 0) {
      ctx.save(); ctx.globalAlpha *= kI;
      dashed(ctx, [xS(25), 156], [xS(25), 270], C.r, 1, 1);
      drawRich(ctx, '{r:il doppio? 25 m}', xS(25), 138, { size: 30 });
      crossMark(ctx, xS(25) + 146, 138, P(t, 30.4, 31.2), C.r, .22);
      ctx.restore();
    }
    // le due auto, con il moto vero
    // (arrivano da fuori: il bordo sinistro della strada le taglia finché non entrano)
    const a50 = t50(t), a100 = t100(t);
    ctx.save(); ctx.beginPath(); ctx.rect(400, 120, 1412, 180); ctx.clip();
    auto(ctx, xS(pos(V50, a50)), Y1, C.x, .62, 1);
    auto(ctx, xS(pos(V100, a100)), Y2, C.y, .62, 1);
    ctx.restore();
    // dove si fermano
    const k1 = P(t, 18.8, 19.2), k2 = P(t, 29.8, 30.2);
    if (k1 > 0) drawRich(ctx, '≈ {g:12,5 m}', xS(sStop(V50)) + 44, Y1 - 20, { size: 30, align: 'left', alpha: k1 });
    if (k2 > 0) drawRich(ctx, '≈ {g:50 m}', xS(sStop(V100)) + 44, Y2 - 20, { size: 30, align: 'left', alpha: k2 });
    ctx.restore();
  }

  // ---------- il grafico v–t della frenata ----------
  // 145 px al secondo: «t (s)» resta lontano dal bordo destro della scheda
  const PL = piano({ ox: 480, oy: 742, ux: 145, uy: 12, x1: 4, y1: 30, xg: [.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], yg: [5, 10, 15, 20, 25, 30],
    xn: [1, 2, 3, 4], yn: [10, 20], xlab: '{mink:t} (s)', ylab: '{mx:v} (m/s)' });
  function tri(ctx, pts, fill, stroke) {
    ctx.beginPath(); pts.forEach((p, i) => { const q = PL.toS(p[0], p[1]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2.5; ctx.stroke(); }
  }
  function scenaGrafico(ctx, t) {
    if (t < 37.4 || t > 84.0) return;
    const al = P(t, 37.4, 38.0) * (1 - P(t, 83.2, 83.9));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 334, 820, 466);
    PL.assi(ctx, P(t, 37.6, 38.6));
    const T1 = tStop(V50), T2 = tStop(V100);
    // le aree
    const kA = P(t, 46.5, 47.2);
    if (kA > 0) {
      ctx.save(); ctx.globalAlpha *= kA;
      tri(ctx, [[0, 0], [0, V100], [T2, 0]], css(C.y, .16));
      tri(ctx, [[0, 0], [0, V50], [T1, 0]], css(C.x, .28));
      ctx.restore();
    }
    // i quattro triangoli piccoli dentro il grande
    const pezzi = [[[0, 0], [0, V50], [T1, 0]], [[0, V50], [0, V100], [T1, V50]], [[T1, 0], [T1, V50], [T2, 0]], [[0, V50], [T1, V50], [T1, 0]]];
    pezzi.forEach((pz, i) => {
      const k = life(t, 55.4 + .5 * i, 83.2, .4, .4); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      tri(ctx, pz, null, css(C.ink, .7));
      const cx = (pz[0][0] + pz[1][0] + pz[2][0]) / 3, cy = (pz[0][1] + pz[1][1] + pz[2][1]) / 3, c = PL.toS(cx, cy);
      txt(ctx, String(i + 1), c[0], c[1], { size: 34, weight: 600, color: C.g });
      ctx.restore();
    });
    // le due rette: stessa pendenza, −7,7 m/s ogni secondo
    glowStroke(ctx, [PL.toS(0, V50), PL.toS(T1, 0)], P(t, 38.4, 39.2), C.x, 5);
    glowStroke(ctx, [PL.toS(0, V100), PL.toS(T2, 0)], P(t, 38.8, 39.8), C.y, 5);
    const kv = P(t, 39.4, 39.9);
    drawRich(ctx, '13,9', PL.ox - 14, PL.toS(0, V50)[1], { size: 28, align: 'right', alpha: kv });
    drawRich(ctx, '27,8', PL.ox - 14, PL.toS(0, V100)[1], { size: 28, align: 'right', alpha: kv });
    // un secondo di frenata sulla retta dei 100 km/h
    const kS = life(t, 41.8, 46.2, .3, .3);
    if (kS > 0) {
      const a = PL.toS(1, vel(V100, 1)), b = PL.toS(2, vel(V100, 1)), c = PL.toS(2, vel(V100, 2));
      ctx.save(); ctx.globalAlpha *= kS;
      segmento(ctx, a, b, C.ink, P(t, 42.0, 42.5), 5); segmento(ctx, b, c, C.v, P(t, 42.4, 42.9), 5);
      drawRich(ctx, '1 s', (a[0] + b[0]) / 2, a[1] - 26, { size: 30, alpha: P(t, 42.4, 42.8) });
      drawRich(ctx, '{v:−7,7 m/s}', b[0] + 14, (b[1] + c[1]) / 2, { size: 30, align: 'left', alpha: P(t, 42.8, 43.2) });
      ctx.restore();
    }
    // durate della frenata: il doppio
    const kd = life(t, 50.4, 83.2, .4, .4);
    if (kd > 0) {
      txt(ctx, '1,8 s', PL.toS(T1, 0)[0] + 10, PL.oy - 24, { size: 30, weight: 600, color: C.x, alpha: kd, align: 'left' });
      txt(ctx, '3,6 s', PL.toS(T2, 0)[0] + 6, PL.oy - 24, { size: 30, weight: 600, color: C.y, alpha: kd, align: 'left' });
    }
    ctx.restore();
  }

  // ---------- 5 · la distanza per fermarsi: reazione + frenata ----------
  function scenaArresto(ctx, t) {
    if (t < 83.0 || t > 99.4) return;
    const al = P(t, 83.2, 83.9) * (1 - P(t, 98.6, 99.3));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 334, 820, 466);
    conFont(TITOLI, () => drawRich(ctx, 'per fermarsi', 782, 384, { size: 36, weight: 600 }));
    // la reazione compare quando Stilla ne dà i numeri (88,1 s), la frenata e i totali con «per fermarsi» (93,8 s);
    // i numeri della frenata sono quelli già detti: 12,5 m e 50 m; i totali di conseguenza 26,4 m e circa 78 m
    const X0 = 560, K = 6;
    const bar = (y, v, col, lab, fren, tot, kR, kF, kT) => {
      txt(ctx, lab, X0 - 18, y, { size: 30, weight: 600, color: col, align: 'right' });
      const r = v, f = sStop(v), xr = X0 + r * K;
      if (kR > 0) { ctx.fillStyle = css(C.v, .45 * kR); ctx.fillRect(X0, y - 26, r * K * kR, 52); }
      if (kF > 0) { ctx.fillStyle = css(C.g, .45 * kF); ctx.fillRect(xr, y - 26, f * K * kF, 52); }
      txt(ctx, fmtN(r, 1) + ' m', X0 + r * K / 2, y - 48, { size: 30, color: C.v, alpha: kR });
      txt(ctx, fren, xr + f * K / 2, y + 48, { size: 30, color: C.g, alpha: kF });
      txt(ctx, tot, xr + f * K + 16, y, { size: 34, weight: 600, align: 'left', alpha: kT });
    };
    bar(490, V50, C.x, '50 km/h', '12,5 m', '≈ 26,4 m', P(t, 88.3, 89.0), P(t, 94.0, 94.6), P(t, 94.6, 95.1));
    bar(640, V100, C.y, '100 km/h', '50 m', '≈ 78 m', P(t, 88.5, 89.2), P(t, 94.2, 94.8), P(t, 95.0, 95.5));
    ctx.save(); ctx.globalAlpha *= P(t, 83.6, 84.2);   // la legenda della reazione compare quando Stilla ne parla
    ctx.fillStyle = css(C.v, .45); ctx.fillRect(560, 739, 28, 22); txt(ctx, 'reazione (1 s)', 600, 750, { size: 30, align: 'left' });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= P(t, 94.0, 94.6);
    ctx.fillStyle = css(C.g, .45); ctx.fillRect(860, 739, 28, 22); txt(ctx, 'frenata', 900, 750, { size: 30, align: 'left' });
    ctx.restore();
    ctx.restore();
  }

  // ---------- il pannello ----------
  function scenaPannello(ctx, t) {
    if (t < 11.8 || t > 99.4) return;
    const al = P(t, 11.8, 12.3) * (1 - P(t, 98.6, 99.3));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1220, 334, 620, 466);
    conFont(TITOLI, () => drawRich(ctx, 'stessi freni', 1530, 384, { size: 34, weight: 600 }));
    drawRich(ctx, 'decelerazione {mv:a} = 7,7 m/s²', 1530, 444, { size: 36, alpha: P(t, 12.4, 12.9), local: t - 12.4 });
    drawRich(ctx, '{x:50 km/h}', 1262, 520, { size: 38, align: 'left', alpha: P(t, 16.7, 17.2) });
    drawRich(ctx, '≈ {g:12,5 m}', 1800, 520, { size: 38, align: 'right', alpha: P(t, 18.8, 19.2) });
    drawRich(ctx, '{y:100 km/h}', 1262, 585, { size: 38, align: 'left', alpha: P(t, 21.4, 21.9) });
    drawRich(ctx, '≈ {g:50 m}', 1800, 585, { size: 38, align: 'right', alpha: P(t, 29.8, 30.2) });
    ctx.save(); ctx.globalAlpha *= P(t, 58.5, 59.0);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1260, 632); ctx.lineTo(1800, 632); ctx.stroke(); ctx.restore();
    const righe = [
      [58.7, 62.9, '{mx:v₀}: velocità di partenza', 680, 34], [59.6, 62.9, '{mv:a}: modulo della decelerazione', 748, 34],
      [63.2, 67.1, '{mink:t = }{mx:v₀}{mink: / }{mv:a}', 680, 42], [64.2, 67.1, '{mink:s = ½·}{mx:v₀}{mink:·t}', 748, 42],
      [67.3, 75.0, '{mink:s = }{mx:v₀}{mink:² / (2·}{mv:a}{mink:)}', 680, 42], [68.6, 75.0, '{mx:v₀}{mink:² = 2·}{mv:a}{mink:·s}', 748, 50],
      [75.3, 83.3, '100 km/h / 3,6 ≈ {x:27,8 m/s}', 680, 36], [80.0, 83.3, '27,8² / (2·7,7) ≈ {g:50 m}', 748, 38],
      [88.3, 98.6, 'reazione: il {g:doppio}', 680, 36], [94.0, 98.6, 'frenata: {g:quattro volte}', 748, 36],
    ];
    for (const [a, b, s, y, size] of righe) drawRich(ctx, s, 1530, y, { size, alpha: life(t, a, b, .4, .4), local: t - a });
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, 'Il doppio della velocità,\nquattro volte la strada', W / 2, 225, { size: 100, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }
  function scenaFine(ctx, t) {
    if (t < 99.0) return;
    const al = 1 - P(t, 107.2, 108.2);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 99.2 });
      drawRich(ctx, 'Lo spazio di frenata cresce col {g:quadrato}\ndella velocità di partenza: {mx:v₀}{mink:² = 2·}{mv:a}{mink:·s}.', W / 2, 290, { size: 60, weight: 600, local: t - 99.6, stagger: .08 });
    });
    const pills = [[490, '50 km/h: ≈ {g:12,5 m}\n100 km/h: ≈ {g:50 m}'], [960, 'la {v:reazione} conta\nsolo il doppio'], [1430, 'nel conto i m/s:\nkm/h / 3,6']];
    pills.forEach(([x, s], i) => {
      const a = 101.3 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la velocità, da ferma (.1) a 100 km/h (.9)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.2, 9.2],                                           // la strada, la riga e le tacche
    ['soffio', 11.8], ['pop', 12.4, .5],                                              // stessi freni: a = 7,7 m/s²
    ['pop', 16.7, .5], ['tono', 15.8, 18.8, [.5, .5, .5, .37, .23, .1]], ['ding', 18.8],   // 50 km/h: arriva, frena, ≈ 12,5 m
    ['pop', 21.4, .7], ['traccia', 22.6, 23.1],                                       // 100 km/h, «il doppio? 25 m»
    ['tono', 25.5, 29.8, [.9, .9, .74, .58, .42, .26, .1]], ['ding', 29.8],           // 100 km/h: frena fino a ≈ 50 m
    ['traccia', 30.4, 31.2],                                                          // il 25 m si barra
    ['soffio', 37.4], ['traccia', 37.6, 38.6],                                        // il grafico v–t
    ['traccia', 38.4, 39.8], ['tono', 38.8, 39.8, [.9, .1]], ['pop', 39.4, .5],       // le due rette che scendono, 13,9 e 27,8
    ['traccia', 42.0, 42.5], ['tono', 42.4, 42.9, [.68, .46]],                        // un secondo: −7,7 m/s
    ['pop', 46.5, .4],                                                                // le aree
    ['pop', 50.4, .5],                                                                // 1,8 s e 3,6 s
    ['pop', 55.4, .4], ['pop', 55.9, .5], ['pop', 56.4, .6], ['pop', 56.9, .7],       // i quattro triangoli piccoli
    ['pop', 58.7, .4], ['pop', 63.2, .5],                                             // v₀ e a, t = v₀/a
    ['ding', 68.6],                                                                   // v₀² = 2·a·s
    ['pop', 75.3, .5],                                                                // 27,8 m/s
    ['soffio', 83.2],                                                                 // per fermarsi
    ['tono', 88.3, 89.2, [.3, .55]],                                                  // le barre della reazione crescono
    ['tono', 94.0, 94.8, [.3, .8]], ['ding', 95.0],                                   // le barre della frenata, i totali
    ['soffio', 99.2], ['pop', 99.6, .6], ['pop', 101.3, .5], ['pop', 101.8, .6], ['pop', 102.3, .7],   // in una frase
  ];
  return {
    titolo: 'Il doppio della velocità, quattro volte la strada', durata: 109, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 37.4, 'due frenate'], [37.4, 58.3, 'il grafico della frenata'], [58.3, 83.2, '{mx:v₀}{mink:² = 2·}{mv:a}{mink:·s}'],
      [83.2, 98.8, 'reazione e frenata']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaStrada(ctx, t); scenaGrafico(ctx, t); scenaArresto(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
