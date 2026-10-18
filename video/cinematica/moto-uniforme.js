'use strict';
/* Quando si incontrano — due auto in moto uniforme da due città: s = s₀ + v·t, e l'incrocio delle rette è l'incontro.
   Argomento: cinematica. */
CVIDEO.registra('cinematica/moto-uniforme', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TAU, TITOLI, conFont, drawRich, txt, fixedNum, fmtN,
    dot, glowStroke, dashed, card, arrowHead } = M;

  // ---------- il moto vero: due leggi orarie del moto uniforme (km e ore) ----------
  const sBlu = t => Math.min(150, 90 * t);        // da A verso B a 90 km/h (a B arriva dopo 1 h 40 min)
  const sAra = t => 150 - 60 * t;                 // da B verso A: v = −60 km/h
  // il cronometro: 1 h ogni 8 s di video (tempo accelerato, lo dice il pannello); lineare, niente easing
  const TV = [[46.4, 0], [54.4, 1], [80.0, 1], [84.0, 1.5]];
  function tSim(t) {
    if (t <= TV[0][0]) return TV[0][1];
    for (let i = 1; i < TV.length; i++) if (t <= TV[i][0]) { const [a, va] = TV[i - 1], [b, vb] = TV[i]; return va + (vb - va) * (t - a) / (b - a); }
    return TV[TV.length - 1][1];
  }
  const num = v => (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ',');

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [84.2, 190], [85.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [84.2, 1050], [85.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [84.2, 2.2], [85.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [84.2, 2], [85.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [84.2, -1.5], [85.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [36.0, 'pensa'], [40.6, 'neutro'],
    [54.6, 'festa'], [58.2, 'felice'], [63.2, 'neutro'], [71.2, 'felice'], [76.0, 'occhiolino'], [80.0, 'neutro'],
    [86.6, 'felice'], [89.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Due auto si vengono incontro:\ndove e quando si incrociano?'],
    [7.9, 12.9, 'A e B distano 150 km.\nLa posizione {mink:s} si misura da A.'],
    [13.1, 17.3, 'L\'auto {x:blu} parte da A\na 90 km/h, verso B.'],
    [17.5, 21.6, 'L\'auto {y:arancio} parte da B\na 60 km/h, verso A.'],
    [21.8, 26.8, 'Moto uniforme: {mink:s = s₀ + }{mx:v}{mink:·t};\n{mink:s₀} è la posizione iniziale.'],
    [27.0, 31.3, '{mx:v} è la velocità, costante:\nper questo il moto è {v:uniforme}.'],
    [31.5, 35.8, 'Per la {x:blu}: {mink:s = 90·t}.\nParte da 0 e {g:sale}.'],
    [36.0, 40.5, 'L\'{y:arancio} va verso lo 0: la sua\nvelocità è {x:negativa}, −60 km/h.'],
    [40.7, 45.2, 'Per l\'{y:arancio}: {mink:s = 150 − 60·t}.\nParte da 150 e {g:scende}.'],
    [45.4, 48.6, 'Via! Il tempo scorre accelerato.'],
    [48.8, 52.4, 'Ogni auto disegna una {g:retta}:\nvelocità costante.'],
    [54.6, 58.0, 'Si incontrano dove\nle rette si {g:incrociano}!'],
    [58.2, 63.0, 'Lì {mink:t} = 1 h, {mink:s} = 90 km:\nstesso posto, stesso istante.'],
    [63.2, 66.8, 'Il conto: le due {mink:s}\ndevono essere uguali.'],
    [67.0, 71.0, '{mink:90·t + 60·t = 150},\ncioè {mink:150·t = 150}.'],
    [71.2, 75.8, 'Quindi {mink:t} = {g:1 h},\ne {mink:s} = 90·1 = {g:90 km}.'],
    [76.0, 79.8, 'Il conto e il grafico\ndicono la {g:stessa cosa}.'],
    [80.0, 83.8, 'Si incrociano e proseguono,\nognuna per la sua strada.'],
    [86.6, 91.0, 'Due rette, un incrocio:\nlì le auto si incontrano.'],
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
      drawRich(ctx, o.xlab, X1 + 34, oy - 32, { size: 34, align: 'right' });
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

  // ---------- la strada fra A e B ----------
  const XA = 520, PPK = 8;                        // 0 km in x 520, 8 px per km: B in x 1720
  const xS = s => XA + s * PPK;
  const Y_BLU = 214, Y_ARA = 246;                 // due corsie: la blu sopra, l'arancio sotto
  function scenaStrada(ctx, t) {
    if (t < 7.5 || t > 85) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 84.0, 84.7));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 184);
    ctx.fillStyle = css(C.dim, .2); ctx.fillRect(xS(0) - 20, 188, xS(150) - xS(0) + 40, 60);
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([16, 14]);
    ctx.beginPath(); ctx.moveTo(xS(0) - 20, 218); ctx.lineTo(xS(150) + 20, 218); ctx.stroke(); ctx.setLineDash([]);
    conFont(TITOLI, () => {
      drawRich(ctx, 'A', xS(0) - 40, 218, { size: 48, weight: 600, align: 'right', alpha: P(t, 8.0, 8.6) });
      drawRich(ctx, 'B', xS(150) + 40, 218, { size: 48, weight: 600, align: 'left', alpha: P(t, 8.2, 8.8) });
    });
    ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;
    const kN = P(t, 8.4, 9.2);
    for (let s = 0; s <= 150; s += 30) {
      ctx.save(); ctx.globalAlpha *= kN; ctx.beginPath(); ctx.moveTo(xS(s), 248); ctx.lineTo(xS(s), 258); ctx.stroke(); ctx.restore();
      txt(ctx, num(s), xS(s), 274, { size: 26, color: C.dim, alpha: kN });
    }
    txt(ctx, 'km', xS(150) + 40, 274, { size: 26, color: C.dim, alpha: kN, align: 'left' });
    // l'incontro: un segno verde a 90 km
    const inc = life(t, 54.6, 79.8, .4, .5);
    if (inc > 0) {
      ctx.save(); ctx.globalAlpha *= inc;
      ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(xS(90), 180); ctx.lineTo(xS(90), 252); ctx.stroke();
      ctx.restore();
    }
    const ts = tSim(t);
    auto(ctx, xS(sBlu(ts)), Y_BLU, C.x, .62, 1, P(t, 13.2, 13.7));
    auto(ctx, xS(sAra(ts)), Y_ARA, C.y, .62, -1, P(t, 17.6, 18.1));
    ctx.restore();
  }

  // ---------- il grafico s–t ----------
  const PL = piano({ ox: 500, oy: 722, ux: 300, uy: 2.4, x1: 2, y1: 150, xg: [.5, 1, 1.5, 2], yg: [30, 60, 90, 120, 150],
    xn: [.5, 1, 1.5, 2], yn: [30, 60, 90, 120, 150], xlab: '{mink:t} (h)', ylab: '{mink:s} (km)' });
  function scenaGrafico(ctx, t) {
    if (t < 21.6 || t > 85) return;
    const al = 1 - P(t, 84.0, 84.7);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 300, 820, 500, P(t, 21.7, 22.3));
    PL.assi(ctx, P(t, 22.0, 23.0));
    const ts = tSim(t);
    // le due rette, disegnate dalle auto mentre il tempo scorre
    const tb = Math.min(ts, 150 / 90);
    if (ts > 0) {
      glowStroke(ctx, [PL.toS(0, 0), PL.toS(tb, sBlu(tb))], 1, C.x, 5);
      glowStroke(ctx, [PL.toS(0, 150), PL.toS(ts, sAra(ts))], 1, C.y, 5);
    }
    // i punti di partenza: s₀ di ciascuna
    dot(ctx, PL.toS(0, 0), C.x, P(t, 31.6, 32.0, E.back), 10);
    dot(ctx, PL.toS(0, 150), C.y, P(t, 40.8, 41.2, E.back), 10);
    if (ts > 0) { dot(ctx, PL.toS(tb, sBlu(tb)), C.x, 1, 10); dot(ctx, PL.toS(ts, sAra(ts)), C.y, 1, 10); }
    // l'incrocio
    const inc = life(t, 54.6, 79.8, .4, .5);
    if (inc > 0) {
      const p = PL.toS(1, 90);
      ctx.save(); ctx.globalAlpha *= inc;
      dashed(ctx, p, PL.toS(1, 0), C.g, P(t, 58.3, 58.9), 1); dashed(ctx, p, PL.toS(0, 90), C.g, P(t, 58.5, 59.1), 1);
      ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p[0], p[1], 26 * P(t, 54.6, 55.2, E.back), 0, TAU); ctx.stroke();
      drawRich(ctx, '{g:incontro}', p[0], PL.toS(0, 130)[1], { size: 34, local: t - 55.0 });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il pannello: i dati, le leggi, il cronometro, il conto ----------
  function scenaPannello(ctx, t) {
    if (t < 13.0 || t > 85) return;
    const al = P(t, 13.0, 13.5) * (1 - P(t, 84.0, 84.7));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1220, 300, 620, 500);
    // la tabella: s₀ e v delle due auto
    drawRich(ctx, '{mink:s₀}', 1550, 345, { size: 40, alpha: P(t, 23.4, 23.9) });
    drawRich(ctx, '{mx:v}', 1720, 345, { size: 40, alpha: P(t, 27.6, 28.1) });
    const kB = P(t, 13.4, 13.9), kA = P(t, 17.8, 18.3);
    drawRich(ctx, '{x:blu}', 1260, 405, { size: 38, align: 'left', alpha: kB });
    txt(ctx, '0 km', 1550, 405, { size: 36, alpha: kB });
    txt(ctx, '90 km/h', 1720, 405, { size: 36, color: C.x, alpha: kB });
    drawRich(ctx, '{y:arancio}', 1260, 465, { size: 38, align: 'left', alpha: kA });
    txt(ctx, '150 km', 1550, 465, { size: 36, alpha: kA });
    // verso lo 0: la velocità diventa negativa quando Stilla lo dice
    const kNeg = P(t, 36.6, 37.2);
    txt(ctx, '60 km/h', 1720, 465, { size: 36, color: C.y, alpha: kA * (1 - kNeg) });
    txt(ctx, '−60 km/h', 1720, 465, { size: 36, weight: 600, color: C.x, alpha: kA * kNeg });
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.save(); ctx.globalAlpha *= P(t, 21.9, 22.4); ctx.beginPath(); ctx.moveTo(1260, 505); ctx.lineTo(1800, 505); ctx.stroke(); ctx.restore();
    // le leggi (fino al conto)
    const kL = 1 - P(t, 63.2, 63.7) + P(t, 80.0, 80.5);
    drawRich(ctx, '{mink:s = s₀ + }{mx:v}{mink:·t}', 1530, 555, { size: 46, alpha: kL * P(t, 22.6, 23.1), local: t - 22.6 });
    drawRich(ctx, '{x:blu}', 1260, 625, { size: 36, align: 'left', alpha: kL * P(t, 31.6, 32.1) });
    drawRich(ctx, '{mink:s = 90·t}', 1440, 625, { size: 42, align: 'left', alpha: kL * P(t, 31.8, 32.3), local: t - 31.8 });
    drawRich(ctx, '{y:arancio}', 1260, 685, { size: 36, align: 'left', alpha: kL * P(t, 40.8, 41.3) });
    drawRich(ctx, '{mink:s = 150 − 60·t}', 1440, 685, { size: 42, align: 'left', alpha: kL * P(t, 41.0, 41.5), local: t - 41.0 });
    // il cronometro (sparisce durante il conto, quando il tempo è fermo)
    const kC = life(t, 45.5, 63.4, .4, .3) + life(t, 80.1, 90, .4, .3);
    if (kC > 0) {
      ctx.save(); ctx.globalAlpha *= kC;
      drawRich(ctx, '{mink:t} =', 1260, 752, { size: 40, align: 'left' });
      fixedNum(ctx, fmtN(tSim(t), 2), 1440, 752, 44, C.ink);
      txt(ctx, 'h', 1452, 752, { size: 36, color: C.dim, align: 'left' });
      txt(ctx, 'tempo accelerato', 1800, 754, { size: 30, color: C.dim, align: 'right' });
      ctx.restore();
    }
    // il conto
    const kK = life(t, 63.4, 79.9, .4, .4);
    if (kK > 0) {
      ctx.save(); ctx.globalAlpha *= kK;
      drawRich(ctx, '{mink:90·t = 150 − 60·t}', 1530, 545, { size: 42, local: t - 63.6 });
      drawRich(ctx, '{mink:90·t + 60·t = 150}', 1530, 600, { size: 42, local: t - 67.2 });
      drawRich(ctx, '{mink:150·t = 150}', 1530, 655, { size: 42, local: t - 68.6 });
      drawRich(ctx, '{mink:t} = {g:1 h}', 1530, 710, { size: 42, local: t - 71.4 });
      drawRich(ctx, '{mink:s} = 90·1 = {g:90 km}', 1530, 765, { size: 42, local: t - 72.6 });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, 'Quando si incontrano', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }
  function scenaFine(ctx, t) {
    if (t < 84.4) return;
    const al = 1 - P(t, 92.2, 93.2);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 84.6 });
      drawRich(ctx, 'Si incontrano dove le rette\ndel grafico si {g:incrociano}.', W / 2, 290, { size: 70, weight: 600, local: t - 85.0, stagger: .09 });
    });
    const pills = [[490, 'moto uniforme:\n{mink:s = s₀ + }{mx:v}{mink:·t}'], [960, 'verso lo 0:\nvelocità {x:negativa}'], [1430, 'incontro: stessa {mink:s},\nstesso {mink:t}']];
    pills.forEach(([x, s], i) => {
      const a = 86.4 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la posizione s di ciascuna auto, da A (.05) a B (.95):
  // le due note si vengono incontro e si toccano all'incrocio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.0, .4], ['pop', 8.2, .6], ['traccia', 8.4, 9.2],       // la strada, A e B, i km
    ['soffio', 13.0], ['pop', 13.2, .3], ['pop', 17.6, .8],                           // l'auto blu, l'auto arancio
    ['soffio', 21.7], ['traccia', 22.0, 23.0], ['pop', 22.6, .6],                     // il grafico, s = s₀ + v·t
    ['pop', 23.4, .4], ['pop', 27.6, .5],                                             // le colonne s₀ e v
    ['pop', 31.6, .1],                                                                // la blu parte da 0
    ['pop', 36.6, .3],                                                                // −60 km/h
    ['pop', 40.8, .9],                                                                // l'arancio parte da 150
    ['pop', 45.5, .5],                                                                // il cronometro
    ['tono', 46.4, 54.4, [.05, .59]], ['tono', 46.4, 54.4, [.95, .59]],               // via: le due rette fino all'incontro
    ['traccia', 58.3, 59.1],                                                          // t = 1 h, s = 90 km
    ['pop', 63.6, .5], ['pop', 67.2, .5], ['pop', 68.6, .5],                          // il conto
    ['ding', 71.4], ['pop', 72.6, .6],                                                // t = 1 h, s = 90 km
    ['tono', 80.0, 84.0, [.59, .86]], ['tono', 80.0, 84.0, [.59, .41]],               // si incrociano e proseguono
    ['soffio', 84.6], ['pop', 85.0, .6], ['pop', 86.4, .5], ['pop', 86.9, .6], ['pop', 87.4, .7],   // in una frase
  ];
  return {
    titolo: 'Quando si incontrano', durata: 94, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.6, 'due città, due auto'], [21.6, 45.2, 'la legge del moto uniforme'], [45.2, 63.0, 'l\'incontro sul grafico'],
      [63.0, 84.0, 'l\'incontro col conto']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaStrada(ctx, t); scenaGrafico(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
