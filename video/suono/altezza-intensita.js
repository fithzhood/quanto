'use strict';
/* Acuto, forte, timbro — il grafico pressione–tempo di un microfono: la frequenza (oscillazioni al secondo, Hz) è
   l'altezza (200 → 400 Hz: un'ottava sopra; udibile da 20 a 20 000 Hz); l'ampiezza dice quanto è forte, e
   l'intensità (W/m²) cresce col quadrato dell'ampiezza (doppia → quadrupla); la forma dell'onda è il timbro:
   diapason (sinusoide pura) e violino alla stessa nota, 200 Hz. L'onda del violino è disegnata semplificata: la
   fondamentale più tre armoniche (400, 600, 800 Hz) di ampiezza 1/2, 1/3, 1/4, come la corda strofinata (onda a dente
   di sega). La somma si ripete ogni 5 ms come la fondamentale. Argomento: suono. */
CVIDEO.registra('suono/altezza-intensita', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fmtN, card, arrowHead, glowStroke, dashed } = M;

  // ---------- il grafico: 10 ms in 1040 px ----------
  const GX = 180, GL = 1040, PMS = GL / 10, GY = 440, UA = 120;      // 104 px per ms; 120 px per unità d'ampiezza
  const YD = 290, YV = 560, UT = 60;                                   // le due strisce del timbro
  const fq = t => kf(t, [[21.7, 200], [23.1, 400], [34.2, 400], [35.4, 200]]);
  const am = t => kf(t, [[38.7, 1], [40.1, 2], [52.9, 2], [53.7, 1]]);
  const yBase = t => lerp(GY, YD, P(t, 53.0, 54.0));
  const uBase = t => lerp(UA, UT, P(t, 53.0, 54.0));
  // il violino: pesi delle armoniche 2, 3, 4 (si tolgono a 66,4 e si rimettono una alla volta)
  const peso = (n, t) => n === 1 ? 1 : t < 70 ? 1 - P(t, 66.4, 67.4) : P(t, 71.0 + (n - 2) * 1.2, 71.6 + (n - 2) * 1.2);
  const violino = (tms, t) => { let s = 0; for (let n = 1; n <= 4; n++) s += peso(n, t) * Math.sin(2 * Math.PI * n * .2 * tms) / n; return s; };   // 200 Hz = 0,2 per ms

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [84.8, 190], [86.1, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [84.8, 1050], [86.1, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [84.8, 2.2], [86.1, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [84.8, 2], [86.1, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [84.8, -1.5], [86.1, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.9, 'felice'], [21.5, 'neutro'],
    [25.9, 'felice'], [30.1, 'sorpreso'], [34.0, 'neutro'], [38.4, 'felice'], [43.0, 'neutro'], [48.1, 'sorpreso'],
    [52.8, 'neutro'], [57.2, 'pensa'], [61.5, 'felice'], [66.1, 'neutro'], [75.6, 'felice'], [80.1, 'neutro'],
    [84.6, 'neutro'], [87.0, 'felice'], [92.4, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Acuto o grave, forte o piano:\ncosa cambia nell’onda?'],
    [7.9, 12.4, 'Un microfono misura la pressione\ndell’aria: ecco il suo grafico.'],
    [12.5, 16.8, 'In 10 ms ci sono 2 oscillazioni:\n200 in un secondo.'],
    [16.9, 21.4, 'È la {v:frequenza} {mink:f} = 200 Hz:\noscillazioni al secondo, in hertz.'],
    [21.5, 25.7, 'Raddoppio la frequenza:\n400 Hz, onde fitte il doppio.'],
    [25.9, 29.9, 'Più frequenza, suono più {g:acuto}:\nl’{v:altezza} è la frequenza.'],
    [30.1, 33.9, 'L’orecchio sente\nda 20 Hz a 20 000 Hz.'],
    [34.0, 38.2, 'Torno a 200 Hz e cambio\nl’{v:ampiezza} {mink:A}: lo scostamento massimo.'],
    [38.4, 42.8, 'Ampiezza doppia:\nstessa nota, ma più {g:forte}.'],
    [43.0, 48.0, 'Quanto è forte lo dice l’{v:intensità} {mink:I}:\nla potenza su ogni m², in W/m².'],
    [48.1, 52.6, '{mink:I} cresce col {v:quadrato} dell’ampiezza:\nampiezza doppia, intensità quadrupla.'],
    [52.8, 57.1, 'Un diapason e un violino\nalla stessa nota: 200 Hz.'],
    [57.2, 61.3, 'Stessa frequenza,\nma l’onda ha un’altra {v:forma}.'],
    [61.5, 65.9, 'La forma dell’onda è il {v:timbro}:\nè così che li distinguiamo.'],
    [66.1, 70.8, 'Smontiamo l’onda del violino:\nc’è la {g:fondamentale}, 200 Hz…'],
    [70.9, 75.4, '…più le {v:armoniche}: 400, 600,\n800 Hz, multipli di 200.'],
    [75.6, 79.9, 'Tutte insieme rifanno l’onda,\nche si ripete ancora ogni 5 ms.'],
    [80.1, 84.4, 'Stessa altezza, timbro diverso:\nconta il miscuglio di armoniche.'],
    [87.0, 92.2, 'Frequenza, ampiezza e forma:\naltezza, intensità e timbro.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 5) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  function graffa(ctx, xa, xb, y, col, al = 1, giu = true) {
    if (al <= 0) return;
    const d = giu ? 12 : -12;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(xa, y + d); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y + d); ctx.stroke(); ctx.restore();
  }
  const xt = tms => GX + tms * PMS;
  const curva = (f, y0, n = 420) => Array.from({ length: n + 1 }, (_, i) => { const tms = 10 * i / n; return [xt(tms), y0(tms)]; });

  // ---------- il grafico pressione–tempo (7,5–85) ----------
  function scenaGrafico(ctx, t) {
    if (t < 7.5 || t > 85.4) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 84.6, 85.2));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 1180, 690);
    // righe del tempo, ogni ms
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(xt(i), 172); ctx.lineTo(xt(i), 728); ctx.stroke(); }
    drawRich(ctx, '{mink:t} (ms)', 122, 762, { size: 30, align: 'left' });
    for (let i = 2; i <= 10; i += 2) txt(ctx, String(i), xt(i), 762, { size: 30, color: C.dim });
    const kt = P(t, 52.9, 53.8);                                   // da qui due strisce: diapason e violino
    txt(ctx, 'pressione', GX, 146, { size: 30, color: C.dim, align: 'left', alpha: 1 - kt });
    // il diapason (o il suono di prima)
    const yb = yBase(t), ub = uBase(t), f = fq(t), A = am(t);
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(GX, yb); ctx.lineTo(GX + GL, yb); ctx.stroke();
    glowStroke(ctx, curva(f, tms => yb - ub * A * Math.sin(2 * Math.PI * f * tms / 1000)), P(t, 8.4, 10.6, E.lin), C.y, 5);
    // le due oscillazioni contate
    const k2 = life(t, 12.6, 16.9, .4, .4);
    for (let i = 0; i < 2; i++) {
      graffa(ctx, xt(5 * i) + 6, xt(5 * i + 5) - 6, 282, C.g, k2, true);
      txt(ctx, String(i + 1), xt(5 * i + 2.5), 254, { size: 36, weight: 600, color: C.g, alpha: k2 });
    }
    // l'ampiezza: dal livello normale alla cresta
    const ka = life(t, 35.5, 52.8, .4, .4);
    if (ka > 0) {
      const xa = xt(1.25), top = GY - UA * A;
      freccia(ctx, [xa, GY], [xa, top + 2], C.v, ka, 4);
      drawRich(ctx, '{mink:A}', xa - 22, GY - UA * A / 2, { size: 40, align: 'right', alpha: ka });
    }
    // il timbro: diapason e violino alla stessa nota
    if (kt > 0) {
      ctx.save(); ctx.globalAlpha *= kt;
      txt(ctx, 'diapason', GX, YD - UT - 44, { size: 32, weight: 600, color: C.y, align: 'left', alpha: P(t, 53.6, 54.1) });
      const kv = P(t, 54.4, 54.9);
      txt(ctx, 'violino', GX, YV - 1.53 * UT - 32, { size: 32, weight: 600, color: C.x, align: 'left', alpha: kv });
      ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(GX, YV); ctx.lineTo(GX + GL, YV); ctx.stroke(); ctx.restore();
      glowStroke(ctx, curva(200, tms => YV - UT * violino(tms, t)), P(t, 55.0, 56.6, E.lin), C.x, 5);
      // un periodo: 5 ms, per tutti e due
      const kp = life(t, 75.8, 84.6, .4, .4), kd = life(t, 80.2, 84.6, .4, .4);
      graffa(ctx, xt(0) + 4, xt(5) - 4, YV + 1.53 * UT + 24, C.g, kp, false);
      txt(ctx, '5 ms', xt(5) + 18, YV + 1.53 * UT + 24, { size: 32, weight: 600, color: C.g, align: 'left', alpha: kp });
      graffa(ctx, xt(0) + 4, xt(5) - 4, YD + UT + 26, C.g, kd, false);
      txt(ctx, '5 ms', xt(5) + 18, YD + UT + 26, { size: 32, weight: 600, color: C.g, align: 'left', alpha: kd });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il pannello a destra ----------
  const PX0 = 1350, PX1 = 1790, PCX = 1570;
  const xlog = f => 1360 + (Math.log10(f) - Math.log10(20)) / 3 * 380;
  function scenaPannello(ctx, t) {
    if (t < 8.4 || t > 85.4) return;
    const al = P(t, 8.4, 8.9) * (1 - P(t, 84.6, 85.2));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1320, 110, 500, 690);
    const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, PCX, 160, { size: 36, weight: 600, alpha: a }));
    const riga = (y, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX0, y); ctx.lineTo(PX1, y); ctx.stroke(); ctx.restore(); };
    // 1 · altezza e intensità
    const s1 = 1 - P(t, 52.6, 53.1);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('il suono', 1);
      const kf = P(t, 17.0, 17.5);
      drawRich(ctx, '{dim:frequenza} {mink:f}', PX0, 222, { size: 32, align: 'left', alpha: kf });
      drawRich(ctx, Math.round(fq(t)) + ' Hz', PX1, 222, { size: 40, align: 'right', alpha: kf });
      // la scala dell'udito, in scala logaritmica: ogni tacca è dieci volte la precedente
      const kb = P(t, 21.6, 22.1);
      if (kb > 0) {
        ctx.save(); ctx.globalAlpha *= kb;
        const kE = P(t, 30.2, 30.7);
        ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1360, 300); ctx.lineTo(1740, 300); ctx.stroke();
        [[20, '20'], [200, '200'], [2000, '2000'], [20000, '20 000']].forEach(([v, s], i) => {
          const x = xlog(v), fine = i === 0 || i === 3;
          ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 292); ctx.lineTo(x, 308); ctx.stroke();
          txt(ctx, s, x, 334, { size: 30, color: fine ? (kE > .5 ? C.g : C.dim) : C.dim, weight: fine && kE > .5 ? 600 : 500, align: 'center' });
        });
        txt(ctx, 'Hz', 1780, 264, { size: 30, color: C.dim, align: 'right' });
        txt(ctx, 'udibile', 1360, 264, { size: 30, color: C.g, align: 'left', alpha: kE, weight: 600 });
        const xm = xlog(fq(t));
        ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.moveTo(xm, 290); ctx.lineTo(xm - 11, 272); ctx.lineTo(xm + 11, 272); ctx.closePath(); ctx.fill();
        const kg = P(t, 26.0, 26.5);
        txt(ctx, '← grave', 1360, 370, { size: 30, color: C.dim, align: 'left', alpha: kg });
        txt(ctx, 'acuto →', 1780, 370, { size: 30, color: C.dim, align: 'right', alpha: kg });
        txt(ctx, 'ogni tacca: frequenza · 10', 1570, 408, { size: 30, color: C.dim });
        ctx.restore();
      }
      riga(440, P(t, 34.1, 34.5));
      // ampiezza e intensità, rispetto all'inizio
      const kA = P(t, 34.2, 34.7), kI = P(t, 43.1, 43.6), A = am(t);
      txt(ctx, 'rispetto all’inizio', PCX, 476, { size: 30, color: C.dim, alpha: P(t, 38.5, 39.0) });
      const barra = (x, v, col, k, lab) => {
        if (k <= 0) return;
        ctx.save(); ctx.globalAlpha *= k;
        ctx.fillStyle = css(col, .85); ctx.beginPath(); ctx.roundRect(x - 50, 700 - 40 * v, 100, 40 * v, 8); ctx.fill();
        txt(ctx, fmtN(v, 1), x, 700 - 40 * v - 26, { size: 40, weight: 600, color: col });
        drawRich(ctx, lab, x, 740, { size: 30, lh: 1.25 });
        ctx.restore();
      };
      ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3; ctx.globalAlpha *= Math.max(kA, 0);
      ctx.beginPath(); ctx.moveTo(1380, 700); ctx.lineTo(1760, 700); ctx.stroke();
      barra(1465, A, C.v, 1, '{dim:ampiezza} {mink:A}');
      barra(1675, A * A, C.g, kI / Math.max(kA, .001), '{dim:intensità} {mink:I}');
      ctx.restore();
    }
    // 2 · stessa nota, forma diversa
    const s2 = life(t, 53.0, 66.1, .5, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('stessa nota', 1);
      drawRich(ctx, '{y:diapason}', PX0, 250, { size: 34, align: 'left', alpha: P(t, 53.6, 54.1) });
      drawRich(ctx, '200 Hz', PX1, 250, { size: 40, align: 'right', alpha: P(t, 53.6, 54.1) });
      drawRich(ctx, '{x:violino}', PX0, 315, { size: 34, align: 'left', alpha: P(t, 54.4, 54.9) });
      drawRich(ctx, '200 Hz', PX1, 315, { size: 40, align: 'right', alpha: P(t, 54.4, 54.9) });
      riga(370, P(t, 57.3, 57.7));
      drawRich(ctx, '{dim:forma}', PX0, 420, { size: 32, align: 'left', alpha: P(t, 57.4, 57.9) });
      drawRich(ctx, '{v:diversa}', PX1, 420, { size: 40, align: 'right', alpha: P(t, 57.4, 57.9) });
      conFont(TITOLI, () => drawRich(ctx, 'forma = {v:timbro}', PCX, 540, { size: 52, weight: 600, local: t - 61.7 }));
      ctx.restore();
    }
    // 3 · il violino smontato
    const s3 = P(t, 66.2, 66.7);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('il violino, smontato', 1);
      const NOMI = ['{g:fondamentale}', '{v:2ª armonica}', '{v:3ª armonica}', '{v:4ª armonica}'];
      for (let n = 1; n <= 4; n++) {
        const k = n === 1 ? P(t, 66.6, 67.1) : P(t, 71.0 + (n - 2) * 1.2, 71.5 + (n - 2) * 1.2);
        if (k <= 0) continue;
        const yl = 225 + 120 * (n - 1), yc = yl + 64;
        ctx.save(); ctx.globalAlpha *= k;
        drawRich(ctx, NOMI[n - 1], PX0, yl, { size: 30, align: 'left' });
        drawRich(ctx, 200 * n + ' Hz', PX1, yl, { size: 32, align: 'right' });
        ctx.strokeStyle = css(C.ink, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX0, yc); ctx.lineTo(PX1, yc); ctx.stroke();
        const pts = Array.from({ length: 241 }, (_, i) => { const tms = 10 * i / 240; return [PX0 + 44 * tms, yc - 36 / n * Math.sin(2 * Math.PI * n * .2 * tms)]; });
        glowStroke(ctx, pts, 1, n === 1 ? C.g : C.v, 4);
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- titolo e chiusura ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Acuto, forte, timbro', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 84.8) return;
    const al = 1 - P(t, 92.8, 93.8);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.0 });
      drawRich(ctx, 'Altezza, intensità e timbro sono frequenza,\nampiezza e forma dell’onda.', W / 2, 290, { size: 64, weight: 600, local: t - 85.4, stagger: .08 });
    });
    const pills = [[490, 'più {g:frequenza}: più acuto\n(da 20 a 20 000 Hz)'], [960, 'più {g:ampiezza}: più forte\n{mink:I} in W/m², cresce come {mink:A}²'], [1430, 'la {g:forma}: il timbro\nfondamentale + armoniche']];
    pills.forEach(([x, s], i) => {
      const a = 87.0 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 225, 445, 450, 130);
      drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti: niente toni che
  // somiglino alle note di cui si parla, solo pop, tracce e ding
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.4, 10.6],                                          // il grafico del microfono
    ['pop', 12.7, .45], ['pop', 17.1, .4],                                            // due oscillazioni; f = 200 Hz
    ['pop', 21.8, .4], ['pop', 23.2, .65],                                            // la scala dell'udito; 400 Hz
    ['pop', 30.3, .5],                                                                // udibile da 20 a 20 000 Hz
    ['pop', 34.3, .4], ['traccia', 35.5, 35.9],                                       // le barre, l'ampiezza A
    ['pop', 40.2, .55], ['ding', 43.4],                                               // ampiezza doppia; intensità quadrupla
    ['soffio', 53.0], ['pop', 53.7, .4], ['pop', 54.5, .5], ['traccia', 55.0, 56.6],   // diapason e violino
    ['pop', 57.5, .5], ['pop', 61.8, .6],                                             // forma diversa; il timbro
    ['soffio', 66.2], ['pop', 66.7, .3],                                              // il violino smontato: la fondamentale
    ['pop', 71.1, .45], ['pop', 72.3, .6], ['pop', 73.5, .75],                        // 400, 600, 800 Hz
    ['traccia', 75.8, 76.2], ['ding', 76.2], ['traccia', 80.2, 80.6],                 // si ripete ogni 5 ms, come il diapason
    ['soffio', 85.0], ['pop', 87.0, .5], ['pop', 87.5, .6], ['pop', 88.0, .7],        // in una frase
  ];
  return {
    titolo: 'Acuto, forte, timbro', durata: 95, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.9, 'l’altezza'], [33.9, 52.7, 'l’intensità'], [52.7, 84.5, 'il timbro']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaGrafico(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
