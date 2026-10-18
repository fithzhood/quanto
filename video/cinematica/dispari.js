'use strict';
/* 1, 3, 5, 7 — una pallina cade da ferma nel vuoto, fotografata ogni 0,2 s: in tempi uguali e consecutivi gli spazi
   crescono come 1, 3, 5, 7 e le distanze dal via come 1, 4, 9, 16 (il tempo contato a passi di 0,2 s). Argomento: cinematica. */
CVIDEO.registra('cinematica/dispari', M => {
  const { W, C, E, P, life, clamp, css, TAU, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, ball, card } = M;

  // ---------- il moto vero: caduta da ferma, s = ½·g·t² ----------
  const G = 9.8;
  const caduta = t => G * t * t / 2;
  // al rallentatore: 1 s di caduta ogni 5 s di video, dal via a 17,2 s, fino a 0,8 s (una foto ogni 0,2 s = ogni secondo di video)
  const VIA = 17.2;
  const tSim = t => clamp((t - VIA) / 5, 0, 0.8);
  const tFoto = k => VIA + k;                      // istante del video della foto k (k = 0…4)

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [63.4, 190], [64.7, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [63.4, 1050], [64.7, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [63.4, 2.2], [64.7, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [63.4, 2], [64.7, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [63.4, -1.5], [64.7, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.3, 'sorpreso'], [25.8, 'neutro'],
    [30.6, 'festa'], [34.8, 'felice'], [39.4, 'neutro'], [44.6, 'pensa'], [50.1, 'neutro'], [54.6, 'felice'],
    [58.8, 'neutro'], [66.0, 'felice'], [69.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Una pallina cade da ferma:\nquanto scende in tempi uguali?'],
    [7.9, 12.3, 'Cade nel vuoto, sulla Terra:\naccelerazione {mv:g} = 9,8 m/s².'],
    [12.5, 17.0, 'Al rallentatore, una foto\nogni 0,2 s, partendo da ferma.'],
    [17.3, 21.1, 'Le foto si allontanano\nsempre di più…'],
    [21.3, 25.6, 'In tempi uguali fa spazi\nsempre più lunghi.'],
    [25.8, 30.4, 'Primo intervallo: 19,6 cm.\nPoi 58,8, poi 98, poi 137,2.'],
    [30.6, 34.6, 'In unità da 19,6 cm:\n{g:1, 3, 5, 7}!'],
    [34.8, 39.2, 'Sono i numeri {v:dispari}: Galileo\nli trovò col piano inclinato.'],
    [39.4, 44.4, 'E le distanze dal via? In unità\nda 19,6 cm: {y:1, 4, 9, 16}.'],
    [44.6, 49.9, 'Contando il tempo a passi di 0,2 s\n(1, 2, 3, 4), sono i {g:quadrati}.'],
    [50.1, 54.4, 'Perché la legge è {mink:s = ½·}{mv:g}{mink:·t²}:\ntempo doppio, spazio quadruplo.'],
    [54.6, 58.6, 'Fra un quadrato e l\'altro\nci sono {g:3, 5, 7}.'],
    [58.8, 63.2, 'Vale partendo da fermi, per\nintervalli {g:uguali} e {g:consecutivi}.'],
    [66.0, 70.6, 'Da fermi, in tempi uguali:\nspazi come {g:1, 3, 5, 7}.'],
  ];

  // ---------- aiutanti ----------
  function righello(ctx, x, y0, ppm, max, passo, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + max * ppm); ctx.stroke();
    const n = Math.round(max / passo);
    for (let i = 0; i <= n; i++) {
      const v = Math.round(i * passo * 10) / 10, y = y0 + v * ppm, lungo = Math.abs(v * 2 - Math.round(v * 2)) < 1e-6;
      ctx.beginPath(); ctx.moveTo(x - (lungo ? 12 : 6), y); ctx.lineTo(x, y); ctx.stroke();
      if (lungo) txt(ctx, fmtN(v, Number.isInteger(v) ? 0 : 1), x - 18, y, { size: 30, color: C.dim, align: 'right' });
    }
    ctx.restore();
  }

  // ---------- la scena: la colonna delle foto ----------
  const Y0 = 238, PXV = 160, X = 760, XB = 812;    // 0 m in y 238, 160 px per metro; colonna e parentesi
  const yV = s => Y0 + s * PXV;
  const yFoto = k => yV(caduta(0.2 * k));
  function scenaPalco(ctx, t) {
    if (t < 7.5 || t > 64.2) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 63.4, 64.1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 760, 692);
    const ts = tSim(t);
    conFont(TITOLI, () => drawRich(ctx, 'sulla Terra, nel vuoto', 404, 156, { size: 36, weight: 600, align: 'left' }));
    drawRich(ctx, '{mink:t} =', 900, 156, { size: 36, align: 'left' });
    fixedNum(ctx, fmtN(ts, 2), 1050, 156, 38, C.ink);
    txt(ctx, 's', 1060, 156, { size: 32, color: C.dim, align: 'left' });
    txt(ctx, 'al rallentatore', 1100, 200, { size: 30, color: C.dim, align: 'right', alpha: P(t, 12.6, 13.1) });
    const kR = P(t, 8.0, 8.6);
    righello(ctx, 480, Y0, PXV, 3.2, 0.1, kR);
    txt(ctx, 'm', 462, Y0 - 34, { size: 30, color: C.dim, alpha: kR });
    // le foto: una ogni 0,2 s, la prima al via (ferma)
    for (let k = 0; k <= 4; k++) {
      const tk = tFoto(k);
      if (t < tk) break;
      const y = yFoto(k);
      ctx.save(); ctx.globalAlpha *= .45; ball(ctx, X, y, '', C.y, { r: 12 }); ctx.restore();
      const fl = P(t, tk, tk + .5);
      if (fl < 1) { ctx.save(); ctx.globalAlpha *= 1 - fl; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, y, 12 + 30 * fl, 0, TAU); ctx.stroke(); ctx.restore(); }
      // le prime due foto sono vicine (31 px): «0 s» un po' più su, «0,2 s» un po' più giù
      txt(ctx, k ? fmtN(0.2 * k, 1) + ' s' : '0 s', X - 40, y + (k === 0 ? -12 : k === 1 ? 6 : 0), { size: 30, color: C.dim, align: 'right', alpha: P(t, tk, tk + .4) });
    }
    ball(ctx, X, yV(caduta(ts)), '', C.y, { r: 12, scale: P(t, 8.4, 8.9, E.back) });
    // gli spazi fra una foto e la successiva
    const cm = ['19,6 cm', '58,8 cm', '98 cm', '137,2 cm'], disp = ['1', '3', '5', '7'];
    const kNum = P(t, 30.8, 31.3);
    for (let i = 1; i <= 4; i++) {
      const kb = P(t, 21.5 + .3 * i, 21.9 + .3 * i); if (kb <= 0) continue;
      const a = yFoto(i - 1) + 3, b = yFoto(i) - 3;
      ctx.save(); ctx.globalAlpha *= kb; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(XB - 8, a); ctx.lineTo(XB, a); ctx.lineTo(XB, b); ctx.lineTo(XB - 8, b); ctx.stroke(); ctx.restore();
      const yl = (a + b) / 2;
      txt(ctx, cm[i - 1], XB + 18, yl, { size: 30, align: 'left', alpha: P(t, 26.0 + .7 * (i - 1), 26.4 + .7 * (i - 1)) * (1 - kNum) });
      txt(ctx, disp[i - 1], XB + 22, yl, { size: 40, weight: 600, color: C.g, align: 'left', alpha: kNum });
    }
    ctx.restore();
  }

  // ---------- il pannello: la tabella delle foto ----------
  function scenaPannello(ctx, t) {
    if (t < 12.4 || t > 64.2) return;
    const al = P(t, 12.4, 12.9) * (1 - P(t, 63.4, 64.1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1170, 108, 670, 692);
    conFont(TITOLI, () => drawRich(ctx, 'una foto ogni 0,2 s', 1505, 165, { size: 34, weight: 600 }));
    txt(ctx, 'tempo', 1265, 235, { size: 30, color: C.dim });
    txt(ctx, 'dal via', 1480, 235, { size: 30, color: C.dim });
    txt(ctx, 'nell\'intervallo', 1700, 235, { size: 30, color: C.dim });
    const via = ['1', '4', '9', '16'], intCm = ['19,6 cm', '58,8 cm', '98 cm', '137,2 cm'], disp = ['1', '3', '5', '7'];
    const kD = P(t, 30.8, 31.3), kV = P(t, 39.6, 40.1), kP = P(t, 44.8, 45.3);
    for (let k = 1; k <= 4; k++) {
      const y = 235 + 70 * k;
      txt(ctx, fmtN(0.2 * k, 1) + ' s', 1265, y, { size: 34, alpha: P(t, tFoto(k), tFoto(k) + .4) * (1 - kP) });
      txt(ctx, String(k), 1265, y, { size: 40, weight: 600, alpha: kP });
      txt(ctx, via[k - 1], 1480, y, { size: 40, weight: 600, color: C.y, alpha: kV });
      txt(ctx, intCm[k - 1], 1700, y, { size: 32, alpha: P(t, 26.0 + .7 * (k - 1), 26.4 + .7 * (k - 1)) * (1 - kD) });
      txt(ctx, disp[k - 1], 1700, y, { size: 40, weight: 600, color: C.g, alpha: kD });
    }
    txt(ctx, 'spazi in unità da 19,6 cm', 1505, 578, { size: 30, color: C.dim, alpha: P(t, 31.0, 31.5) });
    txt(ctx, 'tempo a passi di 0,2 s', 1505, 616, { size: 30, color: C.dim, alpha: P(t, 45.0, 45.5) });
    drawRich(ctx, '{mink:s = ½·}{mv:g}{mink:·t²}', 1505, 668, { size: 48, alpha: P(t, 50.3, 50.8), local: t - 50.3 });
    drawRich(ctx, '{mdim:s}{dim:: spazio dal via}', 1505, 718, { size: 30, alpha: P(t, 50.6, 51.1) });
    drawRich(ctx, '4 − 1 = {g:3}    9 − 4 = {g:5}    16 − 9 = {g:7}', 1505, 765, { size: 34, alpha: P(t, 54.8, 55.3), local: t - 54.8 });
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, '1, 3, 5, 7', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }
  function scenaFine(ctx, t) {
    if (t < 63.6) return;
    const al = 1 - P(t, 71.7, 72.7);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 63.8 });
      drawRich(ctx, 'Da fermi, in tempi uguali e consecutivi,\ngli spazi crescono come {g:1, 3, 5, 7}.', W / 2, 290, { size: 62, weight: 600, local: t - 64.2, stagger: .08 });
    });
    const pills = [[490, 'negli intervalli:\n{g:1, 3, 5, 7}, i dispari'], [960, 'dal via:\n{y:1, 4, 9, 16}, i quadrati'], [1430, '{mink:s = ½·}{mv:g}{mink:·t²}\nda fermi']];
    pills.forEach(([x, s], i) => {
      const a = 65.4 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della pallina, dal via (alto) a 3,1 m (basso)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.0, 8.6], ['pop', 8.4, .9],                         // la scheda, il righello, la pallina in cima
    ['soffio', 12.4],                                                                 // la tabella delle foto
    ['tono', 17.2, 21.2, [.9, .89, .85, .79, .7, .59, .45, .29, .1]],                 // la caduta: s = ½·g·t², sempre più svelta
    ['pop', 17.2, .9], ['pop', 18.2, .85], ['pop', 19.2, .7], ['pop', 20.2, .45], ['pop', 21.2, .1],   // le cinque foto
    ['traccia', 21.8, 23.1],                                                          // le parentesi fra una foto e l'altra
    ['pop', 26.0, .4], ['pop', 26.7, .45], ['pop', 27.4, .5], ['pop', 28.1, .55],     // 19,6 · 58,8 · 98 · 137,2 cm
    ['pop', 39.6, .6],                                                                // dal via: 1, 4, 9, 16
    ['pop', 44.8, .5],                                                                // il tempo a passi: 1, 2, 3, 4
    ['pop', 50.3, .6], ['pop', 50.6, .4],                                             // s = ½·g·t²
    ['ding', 55.0],                                                                   // 4 − 1 = 3, 9 − 4 = 5, 16 − 9 = 7
    ['soffio', 63.8], ['pop', 64.2, .6], ['pop', 65.4, .5], ['pop', 65.9, .6], ['pop', 66.4, .7],   // in una frase
  ];
  return {
    titolo: '1, 3, 5, 7', durata: 73.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.2, 'la pallina fotografata'], [21.2, 39.2, 'gli spazi: i dispari'], [39.2, 63.2, 'le distanze: i quadrati']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPalco(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
