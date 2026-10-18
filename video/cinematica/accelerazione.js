'use strict';
/* La velocità che cresce — un'auto parte da ferma con a = 2 m/s²: nel grafico v–t la pendenza è l'accelerazione,
   l'area sotto è lo spazio; s = ½·a·t². Argomento: cinematica. */
CVIDEO.registra('cinematica/accelerazione', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, txt, drawSeq, fixedNum, fmtN,
    dot, glowStroke, dashed, card, arrowHead } = M;

  // ---------- il moto vero: accelerazione costante da fermi ----------
  const A = 2;                                   // m/s²
  const vel = t => A * t;
  const pos = t => A * t * t / 2;
  const T0 = 11.6;                               // il cronometro parte qui e scorre come quello vero, fino a 10 s
  const tSim = t => clamp(t - T0, 0, 10);
  const num = v => (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ',');

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [81.6, 190], [82.9, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [81.6, 1050], [82.9, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [81.6, 2.2], [82.9, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [81.6, 2], [82.9, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [81.6, -1.5], [82.9, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.8, 'sorpreso'], [26.2, 'neutro'],
    [35.4, 'felice'], [40.6, 'pensa'], [44.8, 'neutro'], [59.6, 'festa'], [63.2, 'neutro'], [71.8, 'felice'],
    [77.4, 'sorpreso'], [81.6, 'neutro'], [84.3, 'felice'], [87.2, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Un\'auto parte da ferma:\ncome cresce la sua velocità?'],
    [7.9, 11.4, 'L\'auto è ferma,\ncronometro a zero.'],
    [11.7, 16.0, 'La sua velocità {mx:v} cresce\ndi {g:2 m/s} ogni secondo.'],
    [16.2, 20.4, 'Il grafico {mx:v}{mink:–t} è una\n{g:retta} che sale.'],
    [21.8, 26.0, 'Dopo 10 s va a 20 m/s,\ncioè 72 km/h.'],
    [26.2, 30.6, 'La {v:pendenza} del grafico {mx:v}{mink:–t}\nsi chiama {v:accelerazione} {mv:a}.'],
    [30.8, 35.2, 'In 3 s la velocità passa\nda 8 a 14 m/s.'],
    [35.4, 40.4, '{mv:a} = 6 m/s / 3 s = {v:2 m/s²}:\n+2 m/s ogni secondo.'],
    [40.6, 44.6, 'E lo spazio percorso?\nGuarda l\'{g:area} sotto la retta.'],
    [44.8, 49.4, 'In un intervallo breve {mx:v} cambia poco:\nspazio ≈ {mx:v}{mink:·Δt}, una striscia.'],
    [49.6, 54.4, 'Sommo le strisce, sempre più sottili:\nlo spazio è l\'{g:area} sotto la retta.'],
    [54.6, 59.4, 'Triangolo: base 10 s, altezza 20 m/s.\nArea = ½·10·20 = {g:100 m}.'],
    [59.6, 63.0, 'Torna: l\'auto ha fatto\nproprio {g:100 m}!'],
    [63.2, 67.6, 'In generale la base è {mink:t},\nl\'altezza è {mx:v}{mink: = }{mv:a}{mink:·t}.'],
    [67.8, 71.6, 'Quindi lo spazio è\n{mink:s = ½·}{mv:a}{mink:·t²}.'],
    [71.8, 77.2, 'Vale partendo {g:da fermi}:\nin 2 s fa 4 m, in 4 s 16 m.'],
    [77.4, 81.4, 'Tempo doppio,\nspazio {g:quattro volte}.'],
    [84.3, 89.0, 'Pendenza: l\'{v:accelerazione}.\nArea: lo {g:spazio} percorso.'],
  ];

  // ---------- aiutanti ----------
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
  function riga(ctx, label, val, unita, y, col, al = 1, x0 = 1270, xr = 1650) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    drawRich(ctx, label, x0, y, { size: 42, align: 'left' });
    fixedNum(ctx, val, xr, y, 46, col);
    txt(ctx, unita, xr + 16, y, { size: 36, color: C.dim, align: 'left' });
    ctx.restore();
  }
  function segmento(ctx, a, b, col, k = 1, w = 5) {
    if (k <= 0) return;
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); ctx.restore();
  }

  // ---------- la strada: 0 m in x 480, 12,6 px per metro ----------
  const S0 = 480, PPM = 12.6, YS = 215;
  const xS = s => S0 + s * PPM;
  function scenaStrada(ctx, t) {
    if (t < 7.5 || t > 82.5) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 81.4, 82.1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 168);
    ctx.fillStyle = css(C.dim, .22); ctx.fillRect(400, YS, 1412, 16);
    ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
    const kN = P(t, 8.0, 8.8);
    for (let s = 0; s <= 100; s += 10) {
      ctx.save(); ctx.globalAlpha *= kN; ctx.beginPath(); ctx.moveTo(xS(s), YS + 16); ctx.lineTo(xS(s), YS + 28); ctx.stroke(); ctx.restore();
      txt(ctx, num(s), xS(s), YS + 48, { size: 26, color: C.dim, alpha: kN });
    }
    txt(ctx, 'm', xS(100) + 44, YS + 48, { size: 26, color: C.dim, alpha: kN });
    const ts = tSim(t);
    // dove si trovava ogni secondo: 1, 4, 9, 16… metri
    const kNum = life(t, 72.0, 81.4, .4, .4);
    for (let k = 1; k <= 10; k++) {
      if (k > ts) break;
      if (kNum > 0) dot(ctx, [xS(pos(k)), YS + 8], C.y, .55 * kNum, 6);   // le posizioni secondo per secondo: solo quando servono
      if (k <= 4 && kNum > 0) txt(ctx, num(pos(k)), xS(pos(k)), YS - 26, { size: 28, weight: 600, color: C.y, alpha: kNum });
    }
    const x = xS(pos(ts));
    auto(ctx, x, YS, C.x, .78, 1, P(t, 7.8, 8.3));
    dot(ctx, [x, YS + 8], C.y, P(t, 8.3, 8.7, E.back), 7);
    // 100 m: il conto torna
    const ok = life(t, 59.6, 63.0, .3, .4);
    if (ok > 0) {
      ctx.save(); ctx.globalAlpha *= ok; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(x, YS + 8, 22 * P(t, 59.6, 60.2, E.back), 0, TAU); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il grafico v–t ----------
  const PL = piano({ ox: 490, oy: 722, ux: 56, uy: 18, x1: 10, y1: 20, xg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], yg: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    xn: [2, 4, 6, 8, 10], yn: [4, 8, 12, 16, 20], xlab: '{mink:t} (s)', ylab: '{mx:v} (m/s)' });
  function rett(ctx, x0, x1, h, fill, stroke) {
    const a = PL.toS(x0, h), b = PL.toS(x1, 0);
    ctx.fillStyle = fill; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
  }
  function scenaGrafico(ctx, t) {
    if (t < 11.6 || t > 82.5) return;
    const al = 1 - P(t, 81.4, 82.1);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 292, 820, 508, P(t, 11.6, 12.2));
    PL.assi(ctx, P(t, 11.8, 12.8));
    const ts = tSim(t);
    // l'area: tutta (9), una striscia (10), le strisce (11), di nuovo tutta (12 →)
    const kTri = life(t, 40.8, 44.9, .6, .4) + life(t, 53.6, 81.4, .5, .4);
    if (kTri > 0) {
      ctx.save(); ctx.globalAlpha *= kTri; ctx.fillStyle = css(C.g, .2);
      ctx.beginPath(); const o = PL.toS(0, 0), p = PL.toS(10, 20), q = PL.toS(10, 0);
      ctx.moveTo(o[0], o[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    const kStr = life(t, 45.0, 49.5, .4, .3);
    if (kStr > 0) {
      ctx.save(); ctx.globalAlpha *= kStr;
      rett(ctx, 6, 6.5, vel(6), css(C.g, .5), css(C.g));
      drawRich(ctx, '{mx:v}{mink:·Δt}', PL.toS(6.5, 0)[0] + 16, PL.toS(0, 6)[1], { size: 34, align: 'left', local: t - 45.4 });
      ctx.restore();
    }
    const scal = [[49.8, 51.2, 5], [51.2, 52.4, 10], [52.4, 53.8, 40]];
    for (const [a, b, n] of scal) {
      const k = Math.min(P(t, a, a + .3), 1 - P(t, b, b + .3)); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= k;
      const d = 10 / n;
      for (let i = 0; i < n; i++) rett(ctx, i * d, (i + 1) * d, vel(i * d), css(C.g, .35), n <= 10 ? css(C.g, .9) : null);
      ctx.restore();
    }
    // la retta v = a·t, disegnata dal moto
    if (ts > 0) glowStroke(ctx, [PL.toS(0, 0), PL.toS(ts, vel(ts))], 1, C.x, 5);
    dot(ctx, PL.toS(ts, vel(ts)), C.x, P(t, 12.4, 12.8, E.back), 10);
    // il triangolo della pendenza: 3 s, 6 m/s
    const kP = life(t, 30.9, 40.5, .3, .4);
    if (kP > 0) {
      const a = PL.toS(4, 8), b = PL.toS(7, 8), c = PL.toS(7, 14);
      ctx.save(); ctx.globalAlpha *= kP;
      segmento(ctx, a, b, C.ink, P(t, 31.0, 31.6), 6);
      segmento(ctx, b, c, C.x, P(t, 31.5, 32.1), 6);
      dot(ctx, a, C.ink, P(t, 30.9, 31.2), 7); dot(ctx, c, C.ink, P(t, 32.0, 32.3), 7);
      drawRich(ctx, '{mink:Δt} = 3 s', (a[0] + b[0]) / 2, a[1] + 30, { size: 32, alpha: P(t, 31.4, 31.8) });
      drawRich(ctx, '{mx:Δv} = 6 m/s', b[0] + 16, (b[1] + c[1]) / 2, { size: 32, align: 'left', alpha: P(t, 32.0, 32.4) });
      ctx.restore();
    }
    // l'area del triangolo: base 10 s, altezza 20 m/s
    const kA = life(t, 54.7, 63.1, .4, .4);
    if (kA > 0) {
      ctx.save(); ctx.globalAlpha *= kA;
      dashed(ctx, PL.toS(10, 0), PL.toS(10, 20), C.x, P(t, 54.8, 55.4), 1);
      drawRich(ctx, '20 m/s', PL.toS(10, 0)[0] + 16, PL.toS(0, 13)[1], { size: 30, align: 'left', alpha: P(t, 55.2, 55.6) });
      drawRich(ctx, '{g:area = 100 m}', PL.toS(7.2, 0)[0], PL.toS(0, 4.5)[1], { size: 34, local: t - 56.4 });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il pannello ----------
  function scenaPannello(ctx, t) {
    if (t < 7.8 || t > 82.5) return;
    const al = P(t, 7.8, 8.3) * (1 - P(t, 81.4, 82.1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1220, 292, 620, 508);
    const ts = tSim(t);
    riga(ctx, '{mink:t} =', fmtN(ts, 1), 's', 360, C.ink, P(t, 8.0, 8.5));
    riga(ctx, '{mx:v} =', fmtN(vel(ts), 1), 'm/s', 430, C.x, P(t, 11.8, 12.3));
    riga(ctx, '{mink:s} =', fmtN(pos(ts), 1), 'm', 500, C.g, P(t, 59.8, 60.3));
    drawRich(ctx, '20 m/s · 3,6 = {g:72 km/h}', 1530, 500, { size: 36, alpha: life(t, 22.4, 26.0, .4, .3) });
    ctx.save(); ctx.globalAlpha *= P(t, 26.2, 26.7);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1260, 545); ctx.lineTo(1800, 545); ctx.stroke();
    ctx.restore();
    // la pendenza
    const kA = life(t, 26.4, 40.5, .4, .3);
    if (kA > 0) {
      drawSeq(ctx, ['{mv:a} {mink:=}', { num: '{mx:Δv}', den: '{mink:Δt}' }], 1530, 630, 54, { local: t - 26.6, alpha: kA });
      drawRich(ctx, '{mx:Δv} = 6 m/s,  {mink:Δt} = 3 s', 1530, 745, { size: 36, alpha: kA * life(t, 31.0, 35.4, .4, .3) });
      drawRich(ctx, '{mv:a} = 6 m/s / 3 s = {v:2 m/s²}', 1530, 745, { size: 40, alpha: kA * P(t, 35.5, 35.9), local: t - 35.5 });
    }
    // l'area
    const kS = life(t, 40.8, 63.1, .4, .3);
    if (kS > 0) {
      ctx.save(); ctx.globalAlpha *= kS;
      drawRich(ctx, '{g:spazio} = {g:area}', 1530, 610, { size: 44, local: t - 41.0 });
      drawRich(ctx, 'una striscia: {mx:v}{mink:·Δt}', 1530, 700, { size: 36, alpha: life(t, 45.0, 49.5, .4, .3) });
      const somme = [[49.8, 51.2, '5 strisce: 80 m'], [51.2, 52.4, '10 strisce: 90 m'], [52.4, 54.5, '40 strisce: 97,5 m']];
      for (const [a, b, s] of somme) drawRich(ctx, s, 1530, 700, { size: 36, alpha: Math.min(P(t, a, a + .3), 1 - P(t, b, b + .3)) });
      drawRich(ctx, 'area = ½·10·20 = {g:100 m}', 1530, 700, { size: 38, alpha: P(t, 54.8, 55.2), local: t - 54.8 });
      ctx.restore();
    }
    // la formula
    const kF = life(t, 63.3, 71.7, .4, .3);
    if (kF > 0) {
      ctx.save(); ctx.globalAlpha *= kF;
      drawRich(ctx, 'base {mink:t},  altezza {mx:v}{mink: = }{mv:a}{mink:·t}', 1530, 610, { size: 36, local: t - 63.5 });
      drawRich(ctx, '{mink:s = ½·}{mv:a}{mink:·t²}', 1530, 710, { size: 60, local: t - 68.0 });
      ctx.restore();
    }
    // la tabella: tempo doppio, spazio quadruplo
    const kT = life(t, 71.9, 81.4, .4, .3);
    if (kT > 0) {
      ctx.save(); ctx.globalAlpha *= kT;
      drawRich(ctx, '{mink:t} (s)', 1270, 625, { size: 36, align: 'left' });
      drawRich(ctx, '{mink:s} (m)', 1270, 705, { size: 36, align: 'left' });
      [1, 2, 3, 4].forEach((k, i) => {
        const x = 1480 + i * 92, hi = (k === 2 || k === 4) ? P(t, 72.6, 73.2) : 0;
        const col = hi > 0 ? C.g : C.ink;
        txt(ctx, num(k), x, 625, { size: 44, weight: hi > 0 ? 600 : 500, color: col });
        txt(ctx, num(pos(k)), x, 705, { size: 44, weight: hi > 0 ? 600 : 500, color: col === C.ink ? C.y : col });
      });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, 'La velocità che cresce', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }
  function scenaFine(ctx, t) {
    if (t < 81.8) return;
    const al = 1 - P(t, 90.2, 91.2);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 82.0 });
      drawRich(ctx, 'Nel grafico velocità–tempo la pendenza\nè l\'{v:accelerazione}, l\'area è lo {g:spazio}.', W / 2, 290, { size: 64, weight: 600, local: t - 82.4, stagger: .08 });
    });
    const pills = [[490, '{mv:a} = {mx:Δv} / {mink:Δt}\nin m/s²'], [960, 'spazio = {g:area}\nsotto la retta'], [1430, '{mink:s = ½·}{mv:a}{mink:·t²}\npartendo da fermi']];
    pills.forEach(([x, s], i) => {
      const a = 84.0 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la velocità che cresce, cioè il punto che sale sulla retta
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.3, .5],                                                // la strada, l'auto ferma
    ['soffio', 11.6], ['traccia', 11.8, 12.8], ['pop', 12.4, .4],                     // il grafico v–t: gli assi, il punto
    ['tono', 11.6, 21.6, [.1, .9]],                                                   // parte: v cresce di 2 m/s ogni secondo
    ['ding', 21.6], ['pop', 22.4, .5],                                                // 20 m/s, cioè 72 km/h
    ['traccia', 26.2, 26.7], ['pop', 26.6, .5],                                       // a = Δv / Δt
    ['pop', 30.9, .4], ['traccia', 31.0, 32.1], ['tono', 31.5, 32.1, [.4, .7]], ['pop', 32.0, .55],   // il triangolo: Δt, poi Δv che sale
    ['pop', 35.5, .5], ['ding', 35.9],                                                // a = 2 m/s²
    ['pop', 41.0, .5], ['pop', 45.0, .4],                                             // spazio = area; una striscia
    ['pop', 49.8, .45], ['pop', 51.2, .55], ['pop', 52.4, .65],                       // 5, 10, 40 strisce: 80, 90, 97,5 m
    ['traccia', 54.8, 55.4], ['pop', 54.8, .5], ['ding', 55.1],                       // area = ½·10·20 = 100 m
    ['pop', 59.8, .5],                                                                // s = 100 m sul pannello
    ['pop', 63.3, .45], ['pop', 68.0, .6],                                            // base t, altezza a·t; s = ½·a·t²
    ['pop', 72.0, .4], ['pop', 72.6, .6],                                             // la tabella: tempo doppio, spazio quadruplo
    ['soffio', 82.0], ['pop', 82.4, .6], ['pop', 84.0, .5], ['pop', 84.5, .6], ['pop', 85.0, .7],   // in una frase
  ];
  return {
    titolo: 'La velocità che cresce', durata: 92, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.0, 'la velocità cresce'], [26.0, 40.4, 'la pendenza è l\'accelerazione'], [40.4, 63.0, 'l\'area è lo spazio'],
      [63.0, 81.4, 'la formula']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaStrada(ctx, t); scenaGrafico(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
