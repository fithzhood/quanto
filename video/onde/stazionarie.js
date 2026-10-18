'use strict';
/* La corda di chitarra — due onde uguali in versi opposti si sommano in un'onda stazionaria: nodi fermi distanti λ/2,
   ventri a metà, l'energia non viaggia lungo la corda. Sulla chitarra la corda è fissata ai due capi (due nodi): ci
   stanno solo mezze onde intere, L = n·λ/2, cioè λ = 2L/n e f = n·v/(2L). Corda del la: L = 0,65 m, v = 143 m/s →
   110, 220, 330 Hz (λ = 1,3 m, 0,65 m, ≈ 0,43 m). Moto vero: A·sin(k·x − ω·t) + A·sin(k·x + ω·t) = 2A·sin(k·x)·cos(ω·t);
   sulla chitarra 110 Hz diventano 0,5 Hz (al rallentatore, 220 volte) e le armoniche restano nelle proporzioni giuste.
   Argomento: onde. */
CVIDEO.registra('onde/stazionarie', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot } = M;

  const CR = [140, 110, 1640, 420];
  // 1 · due onde in versi opposti su un tratto di corda: λ = 592 px, T = 2 s, nodi ogni 296 px da X0
  const X0 = 220, X1 = 1700, YC = 320, A = 50, LAM = 592, K = 2 * Math.PI / LAM, OM = Math.PI;
  const destra = (x, t) => A * Math.sin(K * (x - X0) - OM * t);
  const sinistra = (x, t) => A * Math.sin(K * (x - X0) + OM * t);
  const NODI = [0, 1, 2, 3, 4, 5].map(m => X0 + m * LAM / 2);
  // 2 · la chitarra: corda fra XA e XB (L = 0,65 m); modo n: 2A·sin(n·π·x/L)·cos(n·ω₁·t), ω₁ = π (0,5 Hz invece di 110)
  const XA = 300, XB = 1620, LC = XB - XA, W1 = Math.PI;
  const modo = (n, x, t) => 2 * A * Math.sin(n * Math.PI * (x - XA) / LC) * Math.cos(n * W1 * t);
  // quanto c'è di ogni modo (le corde «cambiano nota» in 0,6 s)
  const AMP = [null,
    t => P(t, 48.6, 49.2) * (1 - P(t, 64.1, 64.6)),
    t => P(t, 64.4, 65.0) * (1 - P(t, 69.1, 69.6)),
    t => P(t, 69.4, 70.0) * (1 - P(t, 78.2, 78.6)),
  ];

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [91.8, 190], [93.1, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [91.8, 1050], [93.1, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [91.8, 2.2], [93.1, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [91.8, 2], [93.1, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [91.8, -1.5], [93.1, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.5, 'sorpreso'], [25.9, 'neutro'],
    [30.5, 'felice'], [35.5, 'neutro'], [44.5, 'felice'], [48.3, 'neutro'], [52.5, 'felice'], [57.5, 'neutro'], [67.7, 'felice'], [73.2, 'neutro'],
    [83.2, 'pensa'], [87.4, 'felice'], [94.2, 'festa'], [98.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Perché una corda di chitarra\nsuona proprio quella nota?'],
    [7.9, 12.3, 'Due onde uguali corrono\nin versi opposti.'],
    [12.5, 17.1, 'Fermo l’immagine: fra due punti più alti\nc’è una lunghezza d’onda, {mink:λ}.'],
    [17.3, 21.3, 'Sommiamole punto per punto…'],
    [21.5, 25.7, '…e la somma {v:non} corre più:\nsta lì e pulsa.'],
    [25.9, 30.3, 'Certi punti non si muovono mai:\nsono i {v:nodi}.'],
    [30.5, 35.3, 'A metà fra due nodi la corda\noscilla di più: è un {g:ventre}.'],
    [35.5, 39.7, 'Due nodi vicini distano mezza\nlunghezza d’onda: {mink:λ/2}.'],
    [39.9, 44.3, 'I nodi restano fermi: l’energia\nnon viaggia lungo la corda.'],
    [44.5, 48.1, 'Questa è un’{v:onda stazionaria}.'],
    [48.3, 52.3, 'Ai capi fissati l’onda rimbalza\ne torna indietro capovolta.'],
    [52.5, 56.7, 'Andata e ritorno si sommano:\ni due capi fissi sono {v:nodi}.'],
    [57.5, 62.0, 'Il modo più semplice (al rallentatore):\nun solo ventre, {mink:n} = 1.'],
    [62.2, 67.5, 'Qui {mink:L = λ/2}: la corda è lunga\n0,65 m, quindi {mink:λ} = 1,3 m.'],
    [67.7, 73.0, 'Su questa corda le onde viaggiano\na 143 m/s: {mink:f = v/λ} = 110 Hz.'],
    [73.2, 78.0, 'Con {mink:n} = 2: due ventri,\n{mink:λ} = 0,65 m e 220 Hz.'],
    [78.2, 83.0, 'Con {mink:n} = 3: tre ventri,\n{mink:λ} ≈ 0,43 m e 330 Hz.'],
    [83.2, 87.2, 'In generale {mink:λ = 2L/n}\ne {mink:f = n·v/(2L)}.'],
    [87.4, 91.6, 'Sono le {v:armoniche}: multipli\ndella frequenza più bassa.'],
    [94.2, 100.0, 'Fissata ai due capi, la corda vibra\nsolo con {mink:λ = 2L/n}: le armoniche.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 5, doppia = false) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, ang = Math.atan2(dy, dx);
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0] + (doppia ? ux * 12 : 0), a[1] + (doppia ? uy * 12 : 0)); ctx.lineTo(b[0] - ux * 12, b[1] - uy * 12); ctx.stroke();
    arrowHead(ctx, [b[0] - ux * 4, b[1] - uy * 4], ang, col, .8);
    if (doppia) arrowHead(ctx, [a[0] + ux * 4, a[1] + uy * 4], ang + Math.PI, col, .8);
    ctx.restore();
  }
  function curva(ctx, xa, xb, f, col, w, al, trat) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (trat) ctx.setLineDash(trat);
    ctx.beginPath(); for (let x = xa; x <= xb + .1; x += 4) { const y = f(Math.min(x, xb)); x === xa ? ctx.moveTo(x, y) : ctx.lineTo(Math.min(x, xb), y); }
    ctx.stroke(); ctx.restore();
  }

  // ---------- 1 · due onde che si incontrano (7,5–43,4) ----------
  // due pezzi nuovi: 12,5–17,3 (fermo immagine: si misura λ) e 52,5–56,7 (andata e ritorno); intanto la scena aspetta
  const vecchio = t => t < 12.5 ? t : t < 17.3 ? 12.5 : t < 52.5 ? t - 4.8 : t < 56.7 ? 47.7 : t - 9.0;
  function scenaDue(ctx, t, T) {
    if (t < 7.5 || t > 43.6) return;
    const al = life(t, 7.5, 43.4, .6, .5);
    ctx.save(); ctx.globalAlpha *= al;
    const kw = P(t, 8.0, 8.6) * (1 - .7 * P(t, 16.8, 17.6));
    curva(ctx, X0, X1, x => YC - destra(x, t), C.x, 3.5, kw, [12, 8]);
    curva(ctx, X0, X1, x => YC - sinistra(x, t), C.y, 3.5, kw, [12, 8]);
    const kin = life(T, 12.5, 17.3, .3, .3);   // il fermo immagine in cui si misura λ
    const ka = life(t, 8.2, 16.9, .4, .5) * (1 - kin);
    if (kin > 0) {
      // due creste vicine dell'onda che va a destra: K·(x − X0) − ω·t = π/2 + 2π·m
      let xa = X0 + LAM * ((.25 + t / 2) % 1); while (xa < 400) xa += LAM;
      const xb = xa + LAM;
      for (const x of [xa, xb]) dashed(ctx, [x, 236], [x, YC - A - 8], C.x, 1, .8 * kin);
      freccia(ctx, [xa, 224], [xb, 224], C.v, kin, 4, true);
      drawRich(ctx, '{mink:λ}', (xa + xb) / 2, 188, { size: 40, alpha: kin });
      txt(ctx, 'fermo immagine', 1760, 150, { size: 30, color: C.dim, align: 'right', alpha: kin });
    }
    if (ka > 0) {
      freccia(ctx, [330, 182], [640, 182], C.x, ka); drawRich(ctx, '{x:verso destra}', 485, 146, { size: 34, alpha: ka });
      freccia(ctx, [1590, 182], [1280, 182], C.y, ka); drawRich(ctx, '{y:verso sinistra}', 1435, 146, { size: 34, alpha: ka });
    }
    // la somma: 2A·sin(k·x)·cos(ω·t)
    curva(ctx, X0, X1, x => YC - destra(x, t) - sinistra(x, t), C.v, 6, P(t, 12.7, 13.5));
    // i nodi, il ventre, λ/2
    const kn = P(t, 21.2, 21.7);
    if (kn > 0) {
      NODI.forEach(x => dot(ctx, [x, YC], C.v, kn, 10));
      drawRich(ctx, '{v:nodo}', NODI[1], YC + 2 * A + 44, { size: 34, alpha: kn });
      drawRich(ctx, '{v:nodo}', NODI[4], YC + 2 * A + 44, { size: 34, alpha: kn });
    }
    const kv = P(t, 25.8, 26.3), xv = (NODI[1] + NODI[2]) / 2;
    if (kv > 0) {
      freccia(ctx, [xv, YC + 2 * A + 16], [xv, YC - 2 * A - 16], C.g, .55 * kv, 4, true);
      drawRich(ctx, '{g:ventre}', xv, YC + 2 * A + 44, { size: 34, alpha: kv });
    }
    const kl = life(t, 30.8, 35.0, .4, .4);
    if (kl > 0) {
      for (const x of [NODI[3], NODI[4]]) dashed(ctx, [x, 196], [x, YC - 14], C.v, 1, .7 * kl);
      freccia(ctx, [NODI[3], 190], [NODI[4], 190], C.v, kl, 4, true);
      drawRich(ctx, '{mink:λ/2}', (NODI[3] + NODI[4]) / 2, 152, { size: 38, alpha: kl });
    }
    drawRich(ctx, '{v:onda stazionaria}', 1480, 150, { size: 38, alpha: life(t, 39.8, 43.4, .4, .4), local: t - 39.8 });
    ctx.restore();
  }

  // ---------- 2 · la chitarra (43,3–82,8) ----------
  function nodiDi(n) { return Array.from({ length: n + 1 }, (_, m) => XA + m * LC / n); }
  // 48,4–56,6: un impulso corre sulla corda, rimbalza capovolto ai capi fissi e torna (estensione dispari e periodica)
  function impulso(x, T) {
    const k = life(T, 48.4, 56.6, .4, .5); if (k <= 0) return 0;
    const G = s => { const w = ((s % (2 * LC)) + 3 * LC) % (2 * LC) - LC; return 45 * Math.exp(-((w / 45) ** 2)); };
    const s = 60 + 1320 * (T - 48.4), xx = x - XA;   // parte dal capo sinistro a 1320 px/s, come i modi: andata e ritorno in 2 s
    return k * (G(xx - s) - G(-xx - s));
  }
  function scenaChitarra(ctx, t, T) {
    if (t < 43.2 || t > 83.0) return;
    const al = life(t, 43.3, 82.8, .5, .5);
    ctx.save(); ctx.globalAlpha *= al;
    // la corda sola (fino a 78,6), poi le tre armoniche una sotto l'altra
    const k1 = 1 - P(t, 78.2, 78.6), k3 = P(t, 78.5, 79.1);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      ctx.fillStyle = css(C.dim, .85);
      ctx.beginPath(); ctx.roundRect(XA - 26, YC - 46, 18, 92, 6); ctx.roundRect(XB + 8, YC - 46, 18, 92, 6); ctx.fill();
      curva(ctx, XA, XB, x => YC - [1, 2, 3].reduce((s, n) => s + AMP[n](t) * modo(n, x, t), 0) - impulso(x, T), C.ink, 5, .9);
      // i nodi del modo che suona (i due capi sempre)
      [1, 2, 3].forEach(n => { const a = AMP[n](t); if (a > 0) nodiDi(n).slice(1, -1).forEach(x => dot(ctx, [x, YC], C.v, a, 9)); });
      dot(ctx, [XA, YC], C.v, P(t, 44.0, 44.5), 10); dot(ctx, [XB, YC], C.v, P(t, 44.0, 44.5), 10);
      const kc = life(t, 44.0, 53.1, .4, .4);
      drawRich(ctx, '{v:nodo}', XA, YC + 84, { size: 34, alpha: kc }); drawRich(ctx, '{v:nodo}', XB, YC + 84, { size: 34, alpha: kc });
      // la lunghezza L
      const kL = P(t, 53.3, 53.8);
      if (kL > 0) { freccia(ctx, [XA, 464], [XB, 464], C.dim, kL, 3, true); drawRich(ctx, '{mink:L} = 0,65 m', (XA + XB) / 2, 498, { size: 32, alpha: kL }); }
      txt(ctx, 'al rallentatore', 1760, 150, { size: 30, color: C.dim, align: 'right', alpha: Math.max(life(t, 48.6, 78.4, .4, .4), life(T, 48.4, 56.7, .4, .3)) });
      ctx.restore();
    }
    if (k3 > 0) {
      ctx.save(); ctx.globalAlpha *= k3;
      const XS = 1380, LS = XS - XA, FR = ['110 Hz', '220 Hz', '330 Hz'];
      [1, 2, 3].forEach(n => {
        const y0 = 185 + (n - 1) * 135;
        ctx.fillStyle = css(C.dim, .85); ctx.beginPath(); ctx.roundRect(XA - 22, y0 - 34, 14, 68, 5); ctx.roundRect(XS + 8, y0 - 34, 14, 68, 5); ctx.fill();
        // le due posizioni estreme (tratteggio tenue) e la corda in questo istante
        for (const s of [1, -1]) curva(ctx, XA, XS, x => y0 - s * 55 * Math.sin(n * Math.PI * (x - XA) / LS), C.dim, 2.5, .45, [7, 7]);
        curva(ctx, XA, XS, x => y0 - 55 * Math.sin(n * Math.PI * (x - XA) / LS) * Math.cos(n * W1 * t), C.ink, 4, .9);
        for (let m = 0; m <= n; m++) dot(ctx, [XA + m * LS / n, y0], C.v, 1, 8);
        drawRich(ctx, '{mink:n} = ' + n, 1440, y0, { size: 36, align: 'left' });
        drawRich(ctx, '{g:' + FR[n - 1] + '}', 1770, y0, { size: 36, align: 'right' });
      });
      ctx.restore();
    }
    ctx.restore();
  }
  function scenaSchede(ctx, t) {
    if (t < 53.0 || t > 83.0) return;
    const al = life(t, 53.2, 82.8, .5, .5);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1180, 560, 640, 230);
    const n = t < 64.4 ? 0 : t < 69.4 ? 1 : 2;
    const voce = (nome, val, y, a, cambia = null) => {
      if (a <= 0) return;
      drawRich(ctx, nome, 1215, y, { size: 32, align: 'left', alpha: a });
      drawRich(ctx, val, 1785, y, { size: 34, align: 'right', alpha: a });
    };
    voce('{dim:lunghezza} {mink:L}', '0,65 m', 594, 1);
    voce('{dim:velocità} {mink:v}', '143 m/s', 634, P(t, 58.8, 59.3));
    // i valori del modo: cambiano quando cambia la nota
    const MODI = [['1', '1,3 m', '110 Hz'], ['2', '0,65 m', '220 Hz'], ['3', '≈ 0,43 m', '330 Hz']];
    const kf = P(t, 58.8, 59.3);
    [0, 1, 2].forEach(i => {
      const a = i === 0 ? 1 - P(t, 64.2, 64.6) : i === 1 ? P(t, 64.4, 64.8) * (1 - P(t, 69.2, 69.6)) : P(t, 69.4, 69.8);
      if (a <= 0) return;
      voce('{mink:n}', MODI[i][0], 674, a);
      voce('{dim:lunghezza d’onda} {mink:λ}', MODI[i][1], 714, a);
      voce('{dim:frequenza} {mink:f}', MODI[i][2], 754, a * kf);
    });
    card(ctx, 380, 560, 760, 230);
    const kg = P(t, 64.2, 64.6);   // da quando si vede n = 2 vale la formula generale
    drawRich(ctx, '{mink:L = λ/2}', 760, 612, { size: 46, alpha: 1 - kg });
    drawRich(ctx, '{mink:L = n·λ/2}', 760, 612, { size: 46, alpha: kg });
    drawRich(ctx, '{mink:f = v/λ}', 760, 682, { size: 46, alpha: P(t, 58.8, 59.3) });
    drawRich(ctx, '{mink:λ = 2L/n}     {mink:f = n·v/(2L)}', 760, 750, { size: 44, alpha: P(t, 74.4, 74.9), local: t - 74.4 });
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'La corda di chitarra', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 82.9) return;
    const al = 1 - P(t, 92.0, 93.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 83.2 });
      drawRich(ctx, 'Andata e ritorno si sommano in nodi\ne ventri: sulla corda, solo {mink:λ = 2L/n}.', W / 2, 290, { size: 64, weight: 600, local: t - 83.6, stagger: .08 });
    });
    const pills = [[490, 'nodi fermi,\ndistanti {mink:λ/2}'], [960, '{mink:f = n·v/(2L)}\n110, 220, 330 Hz'], [1430, 'l’energia non viaggia\nlungo la corda']];
    pills.forEach(([x, s], i) => {
      const a = 84.8 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.5], ['tono', 8.0, 9.2, [.5, .7, .5, .3, .5]], ['traccia', 8.2, 8.6], // due onde in versi opposti
    ['traccia', 12.5, 12.8], ['pop', 12.7, .55],                                      // fermo immagine: la lambda
    ['traccia', 17.5, 18.3],                                                          // la somma
    ['tono', 18.3, 20.3, [.5, .85, 1, .85, .5, .15, 0, .15, .5]],                     // il ventre pulsa
    ['pop', 26.3, .5],                                                                // i nodi
    ['traccia', 30.6, 31.1], ['pop', 30.9, .55],                                      // il ventre
    ['traccia', 35.6, 36.0], ['pop', 35.8, .5],                                       // mezza lambda
    ['pop', 44.6, .6], ['ding', 44.9],                                                // onda stazionaria
    ['soffio', 48.1], ['pop', 49.1, .45],                                             // la chitarra, i capi fissi
    ['tono', 48.4, 50.4, [.05, .5, 1, .5, 0]],                                        // l'impulso va e torna
    ['tono', 57.6, 59.6, [.5, .37, .07, .27, .65, .95, .98, .73, .35]],               // modo n = 1
    ['traccia', 62.3, 62.8], ['pop', 62.4, .5],                                       // L e le schede
    ['pop', 68.0, .5], ['ding', 68.3],                                                // v e f: 110 Hz
    ['pop', 73.3, .45], ['pop', 73.7, .55],                                           // n = 2: formula e valori
    ['tono', 73.4, 74.4, [.5, .45, .38, .56, .88, .99, .8, .42, .1]],                 // due ventri
    ['pop', 78.6, .6],                                                                // n = 3
    ['tono', 78.4, 79.4, [.5, .48, .28, .31, .79, .99, .58, .08, .1]],                // tre ventri
    ['pop', 83.4, .6],                                                                // la formula generale
    ['soffio', 87.4], ['pop', 87.8, .5], ['ding', 88.2],                              // le tre armoniche
    ['soffio', 91.9], ['pop', 93.8, .5], ['pop', 94.3, .6], ['pop', 94.8, .7],        // in una frase
  ];
  return {
    titolo: 'La corda di chitarra', durata: 103, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 48.1, 'nodi e ventri'], [48.1, 83.0, 'la corda fissata ai capi'], [83.0, 91.6, 'le armoniche']],
    scena(ctx, t) {
      const u = vecchio(t);
      card(ctx, ...CR, P(u, 7.5, 8.2) * (1 - P(u, 82.4, 83.0)));
      scenaTitolo(ctx, u); scenaDue(ctx, u, t); scenaChitarra(ctx, u, t); scenaSchede(ctx, u); scenaFine(ctx, u);
    },
  };
});
