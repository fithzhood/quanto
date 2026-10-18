'use strict';
/* Il grafico posizione–tempo — un'auto su una strada dritta e la sua legge oraria s(t): la pendenza è la velocità.
   Argomento: cinematica. */
CVIDEO.registra('cinematica/legge-oraria', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, txt, drawSeq, fixedNum, fmtN,
    dot, glowStroke, dashed, card, arrowHead, crossMark } = M;

  // ---------- il moto vero: v(t) a tratti, con rallentata e ripartenza graduali; s(t) è il suo integrale ----------
  // 5 m/s fino a 9 s; frena fino a 11 s; ferma; riparte fra 18,5 e 21,5 s; poi 13 m/s. s(11) = 50 m, s(30) = 180 m.
  function vel(t) {
    if (t < 9) return 5;
    if (t < 11) return 5 - 2.5 * (t - 9);
    if (t < 18.5) return 0;
    if (t < 21.5) return 13 / 3 * (t - 18.5);
    return 13;
  }
  function pos(t) {
    if (t <= 0) return 0;
    if (t < 9) return 5 * t;
    if (t < 11) return 45 + 5 * (t - 9) - 1.25 * (t - 9) ** 2;
    if (t < 18.5) return 50;
    if (t < 21.5) return 50 + 13 / 6 * (t - 18.5) ** 2;
    return 50 + 13 * (t - 20);
  }
  // tempo del cronometro: scorre come quello vero (1 s = 1 s), fermo prima del via e dopo la fine
  const T0 = 21.4;
  const tSim = t => clamp(t - T0, 0, 30);
  const num = v => (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ',');

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [96.6, 190], [97.9, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [96.6, 1050], [97.9, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.6, 2.2], [97.9, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [96.6, 2], [97.9, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.6, -1.5], [97.9, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [36.8, 'felice'], [40.0, 'neutro'],
    [51.5, 'sorpreso'], [56.0, 'neutro'], [65.4, 'felice'], [69.8, 'neutro'], [77.8, 'felice'], [82.8, 'pensa'],
    [87.4, 'neutro'], [92.0, 'felice'], [96.6, 'neutro'], [99.2, 'felice'], [102.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.3, 'Dove si trova un\'auto,\nsecondo per secondo?'],
    [7.9, 12.2, 'La sua posizione {my:s} si misura\nin metri, dal segno 0.'],
    [12.3, 16.6, 'Il tempo {mink:t} si conta in secondi,\ndal via del cronometro.'],
    [16.7, 21.3, 'Il grafico della {v:legge oraria} {my:s}{mink:(t)}:\n{mink:t} in orizzontale, {my:s} in verticale.'],
    [21.5, 26.0, 'Va piano: 5 metri ogni secondo.\nIl grafico sale poco.'],
    [29.0, 32.3, 'Ora rallenta…'],
    [32.5, 36.6, 'È ferma: il tempo passa,\n{my:s} resta 50 m.'],
    [36.8, 39.8, 'Il grafico è {g:piatto}.'],
    [40.0, 44.4, 'Riparte veloce:\n13 metri ogni secondo.'],
    [44.6, 48.8, 'Più va veloce, più il grafico\nè {g:ripido}.'],
    [51.5, 55.8, 'Attenzione: il grafico {r:non} è\nil disegno della strada!'],
    [56.0, 60.4, 'La strada è dritta: le pieghe\nsono cambi di {x:velocità}.'],
    [60.6, 65.2, 'La {v:pendenza} del grafico è la\nvelocità: {mx:v} = {my:Δs} / {mink:Δt}.'],
    [65.4, 69.6, 'Qui: 20 m in 4 s,\n{mx:v} = 5 m/s.'],
    [69.8, 73.4, 'Qui {my:Δs} = 0:\n{mx:v} = 0, ferma.'],
    [73.6, 77.6, 'Qui 65 m in 5 s:\n{mx:v} = 13 m/s.'],
    [77.8, 82.6, 'Su tutto il viaggio: 180 m in 30 s.\nVelocità {g:media}: 6 m/s.'],
    [82.8, 87.2, 'La media non dice com\'è andata\nistante per istante.'],
    [87.4, 91.8, 'La velocità in un {g:istante}\nè la pendenza in quel punto.'],
    [92.0, 96.4, 'Sulla piega la pendenza\nè {mx:v} = 6,5 m/s.'],
    [99.2, 104.0, 'Piatto è fermo, ripido è veloce:\nla pendenza è la {x:velocità}.'],
  ];

  // ---------- aiutanti ----------
  // piano con scale diverse sui due assi (secondi e metri)
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
      drawRich(ctx, o.xlab, X1 + 34, oy - 32, { size: 34, align: 'right' });
      drawRich(ctx, o.ylab, ox + 24, Y1 - 30, { size: 34, align: 'left' });
      ctx.restore();
    };
    return p;
  }
  // un'auto vista di fianco; (x, y) = centro, a livello della strada
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
  function riga(ctx, label, val, unita, y, col, al = 1, x0 = 1270, xr = 1680) {
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

  // ---------- la strada (in alto) ----------
  const S0 = 470, PPM = 7, YS = 215;   // 0 m in x 470, 7 px per metro; asfalto da y 215
  const xStrada = s => S0 + s * PPM;
  function scenaStrada(ctx, t) {
    if (t < 7.5 || t > 97) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 96.0, 96.7));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 168);
    ctx.fillStyle = css(C.dim, .22); ctx.fillRect(400, YS, 1412, 16);
    // la strada è dritta: quando il video lo dice, si accende
    const dritta = life(t, 56.0, 60.4, .4, .4);
    if (dritta > 0) { ctx.save(); ctx.globalAlpha *= dritta; glowStroke(ctx, [[400, YS + 8], [1812, YS + 8]], 1, C.g, 6); ctx.restore(); }
    ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
    for (let s = 0; s <= 180; s += 10) { const x = xStrada(s); ctx.beginPath(); ctx.moveTo(x, YS + 16); ctx.lineTo(x, YS + (s % 20 ? 24 : 30)); ctx.stroke(); }
    const kNum = P(t, 8.0, 8.8);
    for (let s = 0; s <= 180; s += 20) txt(ctx, num(s), xStrada(s), YS + 48, { size: 26, color: s === 0 ? C.ink : C.dim, weight: s === 0 ? 600 : 500, alpha: kNum });
    txt(ctx, 'm', xStrada(180) + 46, YS + 48, { size: 26, color: C.dim, alpha: kNum });
    const s = pos(tSim(t)), x = xStrada(s);
    auto(ctx, x, YS, C.x, .78, 1, P(t, 7.8, 8.3));
    // il punto che dà la posizione, sulla strada
    dot(ctx, [x, YS + 8], C.y, P(t, 8.3, 8.7, E.back), 7);
    ctx.restore();
  }

  // ---------- il grafico s–t ----------
  const PL = piano({ ox: 490, oy: 722, ux: 20, uy: 2, x1: 30, y1: 180, xg: [5, 10, 15, 20, 25, 30], yg: [20, 40, 60, 80, 100, 120, 140, 160, 180],
    xn: [5, 10, 15, 20, 25, 30], yn: [20, 40, 60, 80, 100, 120, 140, 160, 180], xlab: '{mink:t} (s)', ylab: '{my:s} (m)' });
  const CURVA = []; for (let i = 0; i <= 600; i++) CURVA.push(i / 20);
  function tratto(t1) { const pts = []; for (const u of CURVA) { if (u > t1) break; pts.push(PL.toS(u, pos(u))); } pts.push(PL.toS(t1, pos(t1))); return pts; }
  // tangente in u, tagliata al riquadro del grafico
  function tangente(ctx, u, col, al) {
    if (al <= 0) return;
    const v = vel(u), s = pos(u), d = 3.2;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath(); ctx.rect(PL.ox, PL.oy - 190 * PL.uy, 31 * PL.ux, 190 * PL.uy); ctx.clip();
    glowStroke(ctx, [PL.toS(u - d, s - v * d), PL.toS(u + d, s + v * d)], 1, col, 5);
    ctx.restore();
  }
  function scenaGrafico(ctx, t) {
    if (t < 16.3 || t > 97) return;
    const al = 1 - P(t, 96.0, 96.7);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 292, 820, 508, P(t, 16.3, 16.9));
    PL.assi(ctx, P(t, 16.6, 17.6));
    const ts = tSim(t), kPunto = P(t, 17.6, 18.0, E.back);
    if (ts > 0) glowStroke(ctx, tratto(ts), 1, C.y, 5);
    // il punto che disegna il grafico, con le sue proiezioni sugli assi
    const pa = kPunto * (1 - P(t, 51.5, 52.0));
    if (pa > 0) {
      const p = PL.toS(ts, pos(ts));
      ctx.save(); ctx.globalAlpha *= pa;
      dashed(ctx, PL.toS(ts, 0), p, C.ink, 1, .55); dashed(ctx, PL.toS(0, pos(ts)), p, C.y, 1, .7);
      ctx.restore();
      dot(ctx, p, C.y, pa, 10);
    }
    // 3 · non è la strada: un'auto «in salita» sul grafico, barrata
    const fal = life(t, 51.6, 55.9, .4, .4);
    if (fal > 0) {
      const u = 26, p = PL.toS(u, pos(u)), ang = Math.atan2(-13 * PL.uy, PL.ux);
      ctx.save(); ctx.globalAlpha *= fal * .9;
      ctx.translate(p[0], p[1]); ctx.rotate(ang); auto(ctx, 0, -4, C.r, .62); ctx.restore();
      crossMark(ctx, 1090, 560, P(t, 52.4, 53.4), C.r, .55);
      ctx.save(); ctx.globalAlpha *= fal; drawRich(ctx, '{r:non è la strada}', 1015, 662, { size: 32, align: 'right', local: t - 52.6 }); ctx.restore();
    }
    // le pieghe: cambi di velocità
    const pie = life(t, 56.4, 60.4, .4, .4);
    if (pie > 0) {
      ctx.save(); ctx.globalAlpha *= pie; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
      for (const u of [10, 20]) { const p = PL.toS(u, pos(u)); ctx.beginPath(); ctx.arc(p[0], p[1], 34 * P(t, 56.5, 57.1, E.back), 0, TAU); ctx.stroke(); }
      ctx.restore();
    }
    // 4 · i triangoli della pendenza: prima su, poi a destra fino alla curva
    const tri = [[4, 8, 65.4, 69.6], [23, 28, 73.6, 77.6]];
    tri.forEach(([a, b, ta, tb]) => {
      const k = life(t, ta, tb, .3, .3); if (k <= 0) return;
      const sa = pos(a), sb = pos(b), A = PL.toS(a, sa), B = PL.toS(a, sb), Cc = PL.toS(b, sb);
      ctx.save(); ctx.globalAlpha *= k;
      segmento(ctx, A, B, C.y, P(t, ta + .1, ta + .6), 6);
      segmento(ctx, B, Cc, C.ink, P(t, ta + .5, ta + 1.0), 6);
      drawRich(ctx, '{my:Δs}', A[0] - 14, (A[1] + B[1]) / 2, { size: 34, align: 'right', alpha: P(t, ta + .4, ta + .8) });
      drawRich(ctx, '{mink:Δt}', (B[0] + Cc[0]) / 2, B[1] - 28, { size: 34, alpha: P(t, ta + .8, ta + 1.2) });
      dot(ctx, A, C.ink, P(t, ta, ta + .3), 7); dot(ctx, Cc, C.ink, P(t, ta + .9, ta + 1.2), 7);
      ctx.restore();
    });
    const fer = life(t, 69.8, 73.4, .3, .3);
    if (fer > 0) {
      const A = PL.toS(12, 50), B = PL.toS(17, 50);
      ctx.save(); ctx.globalAlpha *= fer;
      segmento(ctx, [A[0], A[1] + 18], [B[0], B[1] + 18], C.ink, P(t, 70.0, 70.6), 6);
      drawRich(ctx, '{mink:Δt}', (A[0] + B[0]) / 2, A[1] + 48, { size: 34, alpha: P(t, 70.4, 70.8) });
      drawRich(ctx, '{my:Δs} {mink:= 0}', (A[0] + B[0]) / 2, A[1] - 34, { size: 34, alpha: P(t, 70.6, 71.0) });
      ctx.restore();
    }
    // 5 · la velocità media: la retta dall'inizio alla fine
    const med = life(t, 77.9, 87.3, .4, .4);
    if (med > 0) {
      ctx.save(); ctx.globalAlpha *= med;
      ctx.setLineDash([14, 10]); glowStroke(ctx, [PL.toS(0, 0), PL.toS(30, 180)], P(t, 78.0, 79.0), C.g, 4); ctx.setLineDash([]);
      dot(ctx, PL.toS(0, 0), C.g, P(t, 78.0, 78.3), 8); dot(ctx, PL.toS(30, 180), C.g, P(t, 78.9, 79.2), 8);
      drawRich(ctx, '{g:media}', PL.toS(12, 0)[0] - 30, PL.toS(0, 100)[1], { size: 34, local: t - 79.0 });
      ctx.restore();
    }
    // 6 · la velocità istantanea: la pendenza in un punto
    const ist = life(t, 87.5, 96.5, .4, .4);
    if (ist > 0) {
      const u = kf(t, [[92.0, 25], [92.9, 20]]);
      tangente(ctx, u, C.x, ist);
      dot(ctx, PL.toS(u, pos(u)), C.ink, ist, 10);
    }
    ctx.restore();
  }

  // ---------- il pannello a destra: cronometro, posizione, poi le pendenze ----------
  function scenaPannello(ctx, t) {
    if (t < 7.8 || t > 97) return;
    const al = P(t, 7.8, 8.3) * (1 - P(t, 96.0, 96.7));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1220, 292, 620, 508);
    const ts = tSim(t);
    riga(ctx, '{mink:t} =', fmtN(ts, 1), 's', 370, C.ink, P(t, 12.4, 12.9));
    riga(ctx, '{my:s} =', fmtN(pos(ts), 1), 'm', 448, C.y, P(t, 8.0, 8.5));
    const kf2 = P(t, 60.7, 61.3);
    if (kf2 > 0) {
      ctx.save(); ctx.globalAlpha *= kf2;
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1260, 505); ctx.lineTo(1800, 505); ctx.stroke();
      ctx.restore();
      drawSeq(ctx, ['{mx:v} {mink:=}', { num: '{my:Δs}', den: '{mink:Δt}' }], 1530, 575, 54, { local: t - 61.0, alpha: P(t, 60.8, 61.2) * (1 - P(t, 87.0, 87.5)) });
    }
    // un conto per ogni triangolo, solo mentre il triangolo c'è
    const conti = [[65.4, 69.6, '20 m / 4 s = {x:5 m/s}', ''], [69.8, 73.4, '0 m / 5 s = {x:0 m/s}', ''],
      [73.6, 77.6, '65 m / 5 s = {x:13 m/s}', ''], [77.8, 87.2, '180 m / 30 s = {g:6 m/s}', '{g:velocità media}']];
    for (const [a, b, s, sopra] of conti) {
      const k = life(t, a + .5, b, .4, .3); if (k <= 0) continue;
      drawRich(ctx, s, 1530, 742, { size: 42, alpha: k, local: t - a - .5 });
      if (sopra) drawRich(ctx, sopra, 1530, 684, { size: 32, alpha: k });
    }
    const ist = life(t, 87.6, 96.4, .4, .3);
    if (ist > 0) {
      const u = kf(t, [[92.0, 25], [92.9, 20]]);
      ctx.save(); ctx.globalAlpha *= ist;
      drawRich(ctx, '{g:velocità istantanea}', 1530, 600, { size: 34 });
      riga(ctx, '{mx:v} =', fmtN(vel(u), 1), 'm/s', 690, C.x, 1, 1300, 1640);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- 0 · titolo ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, 'Il grafico posizione–tempo', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }

  // ---------- 7 · in una frase ----------
  function scenaFine(ctx, t) {
    if (t < 96.8) return;
    const al = 1 - P(t, 105.2, 106.2);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.0 });
      drawRich(ctx, 'La pendenza del grafico della legge\noraria è la {x:velocità}.', W / 2, 290, { size: 70, weight: 600, local: t - 97.4, stagger: .09 });
    });
    const pills = [[490, 'ferma:\nlinea {g:piatta}'], [960, 'veloce:\nlinea {g:ripida}'], [1430, 'media: {my:Δs} / {mink:Δt}\nsu un intervallo']];
    pills.forEach(([x, s], i) => {
      const a = 99.0 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la posizione s, da 0 m (.05) a 180 m (.95);
  // nei tratti lunghi a velocità costante solo l'inizio, e da ferma silenzio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 7.8, .5], ['traccia', 8.0, 8.8], ['pop', 8.3, .6],       // la strada, l'auto, il punto
    ['pop', 12.4, .5],                                                                // il cronometro
    ['soffio', 16.3], ['traccia', 16.6, 17.6], ['pop', 17.6, .3],                     // il grafico s–t
    ['tono', 21.4, 25.4, [.05, .15]],                                                 // va piano: 5 m/s
    ['tono', 30.4, 32.4, [.275, .286, .294, .298, .3]],                               // rallenta fino a 50 m
    ['tono', 39.9, 42.9, [.3, .31, .343, .4]],                                        // riparte
    ['tono', 42.9, 47.4, [.4, .69]],                                                  // 13 m/s: il grafico è ripido
    ['pop', 51.6, .5], ['traccia', 52.4, 53.4],                                       // l'auto «in salita», barrata
    ['pop', 56.0, .4], ['pop', 56.6, .6],                                             // la strada è dritta, le pieghe
    ['traccia', 60.7, 61.3], ['pop', 61.0, .6],                                       // v = Δs/Δt
    ['tono', 65.5, 66.0, [.15, .25]], ['traccia', 65.9, 66.4], ['pop', 65.9, .5],     // 20 m in 4 s
    ['traccia', 70.0, 70.6], ['pop', 70.3, .5],                                       // Δs = 0
    ['tono', 73.7, 74.2, [.495, .82]], ['traccia', 74.1, 74.6], ['pop', 74.1, .7],    // 65 m in 5 s
    ['tono', 78.0, 79.0, [.05, .95]], ['pop', 78.9, .8],                              // la retta della media
    ['pop', 87.6, .5],                                                                // la tangente
    ['tono', 92.0, 92.9, [.625, .46, .32]], ['ding', 93.0],                           // scivola sulla piega: v = 6,5 m/s
    ['soffio', 97.0], ['pop', 97.4, .6], ['pop', 99.0, .5], ['pop', 99.5, .6], ['pop', 100.0, .7],   // in una frase
  ];
  return {
    titolo: 'Il grafico posizione–tempo', durata: 107, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.3, 'posizione e tempo'], [21.3, 51.4, 'il viaggio'], [51.4, 60.5, 'non è la strada'],
      [60.5, 87.3, 'la pendenza è la velocità'], [87.3, 96.5, 'in un istante']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaStrada(ctx, t); scenaGrafico(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
