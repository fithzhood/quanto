'use strict';
/* v = λ·f — una corda di 8 m scossa da una mano: cresta e gola, lunghezza d'onda λ = 2 m, periodo T = 2 s,
   frequenza f = 1/T = 0,5 Hz, v = λ·f = 1 m/s. Poi la mano va al doppio (f = 1 Hz): le onde nuove corrono insieme
   alle vecchie, sempre a 1 m/s, e sono lunghe la metà (λ = 1 m). La velocità la decide il mezzo, non la mano.
   Moto vero, in tempo reale: y(x, t) = −A·sin(φ(t − x/v)), con φ la fase della mano (= A·sin(k·x − ω·t) a f fissa);
   tre fermi immagine dichiarati. Argomento: onde. */
CVIDEO.registra('onde/v-lambda-f', M => {
  const { W, C, E, P, life, clamp, css, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, crossMark } = M;

  // ---------- la corda: 8 m, 180 px per metro, v = 1 m/s ----------
  const XL = 260, PXM = 180, YC = 300, A = 60, V = 1;
  const sx = m => XL + m * PXM;
  const FERMI = [[16.2, 26.0], [38.5, 45.8], [58.8, 67.2]];         // fermi immagine (tempo del video)
  const tr = t => t - FERMI.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0);
  const fermo = t => FERMI.some(([a, b]) => t > a + .05 && t < b - .05);
  const T0 = 8.0;                                                   // la mano parte qui
  const TS = 50.6, ts = tr(TS) - T0;                                // qui la mano passa da 0,5 Hz a 1 Hz (fase continua)
  const W1 = Math.PI, W2 = 2 * Math.PI;                             // ω = 2π·f
  const fase = tau => tau <= 0 ? 0 : tau < ts ? W1 * tau : W1 * ts + W2 * (tau - ts);
  const faseInv = p => p < W1 * ts ? p / W1 : ts + (p - W1 * ts) / W2;
  const tau = t => tr(t) - T0;                                      // da quanto scuote la mano (tempo della corda)
  const y = (m, t) => { const e = tau(t) - m / V; return e <= 0 ? 0 : -A * Math.sin(fase(e)); };
  // dove sta, all'istante t, la cresta (o la gola) partita dalla mano con la n-esima oscillazione
  const cresta = (n, t) => V * (tau(t) - faseInv(1.5 * Math.PI + 2 * Math.PI * n));
  const gola = (n, t) => V * (tau(t) - faseInv(.5 * Math.PI + 2 * Math.PI * n));
  // la cresta che a un certo istante sta fra a e a + λ
  const primaDopo = (t, a, lam, f) => { for (let n = 0; n < 99; n++) { const x = f(n, t); if (x >= a && x < a + lam) return n; } return 0; };
  const N_C = primaDopo(16.2, 2.0, 2, cresta), N_G = primaDopo(16.2, 3.0, 2, gola);        // 2,7 m e 3,7 m
  const N_L = primaDopo(16.2, 4.0, 2, cresta);                                            // λ fra 4,7 e 6,7 m
  const N_8 = primaDopo(36.5, 1.0, 2, cresta);                                            // la cresta che avanza di λ in T
  const N_N = primaDopo(58.8, 4.0, 1, cresta);                                            // λ nuova fra 4,2 e 5,2 m

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [72.2, 190], [73.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [72.2, 1050], [73.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [72.2, 2.2], [73.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [72.2, 2], [73.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [72.2, -1.5], [73.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.3, 'felice'], [21.0, 'neutro'],
    [30.8, 'felice'], [36.3, 'neutro'], [40.7, 'felice'], [45.9, 'pensa'], [50.4, 'neutro'], [54.6, 'sorpreso'],
    [58.8, 'neutro'], [63.0, 'felice'], [67.2, 'neutro'], [74.8, 'felice'], [78.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Perché certe onde sono lunghe\ne altre corte?'],
    [7.9, 11.9, 'Una mano scuote una corda lunga:\nne guardiamo 8 m.'],
    [12.1, 16.1, 'L’onda corre lungo la corda\nverso destra.'],
    [16.3, 20.8, 'Il punto più alto è la {g:cresta},\nil più basso la {x:gola}.'],
    [21.0, 25.8, 'Da una cresta alla successiva c’è\nla {v:lunghezza d’onda}: {mink:λ} = 2 m.'],
    [26.0, 30.6, 'Il punto {y:arancio}: su e giù\nogni 2 s, il {v:periodo} {mink:T}.'],
    [30.8, 36.1, 'La {v:frequenza} conta i su e giù\nal secondo: {mink:f = 1/T} = 0,5 Hz.'],
    [36.3, 40.5, 'In un periodo la cresta avanza\ndi una lunghezza d’onda.'],
    [40.7, 45.7, 'Perciò {mink:v = λ/T = λ·f}:\n2 m · 0,5 Hz = 1 m/s.'],
    [45.9, 50.2, 'Se la mano va più in fretta,\nl’onda corre più veloce?'],
    [50.4, 54.4, 'Proviamo al doppio:\n{mink:f} = 1 Hz.'],
    [54.6, 58.6, 'Le onde nuove corrono insieme\nalle vecchie, a 1 m/s.'],
    [58.8, 62.8, 'Fermo l’immagine:\nora {mink:λ} = 1 m, la metà.'],
    [63.0, 67.0, 'Doppia frequenza, onde lunghe\nla metà: {mink:λ = v/f}.'],
    [67.2, 72.0, 'La velocità la decide la corda,\ncioè il {v:mezzo}, non la mano.'],
    [74.8, 80.4, 'Stessa corda, stessa velocità:\npiù frequenza, onde più corte.'],
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
  function segno(ctx, x, yy, giu, col, al) {
    if (al <= 0) return;
    const s = giu ? 1 : -1;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col);
    ctx.beginPath(); ctx.moveTo(x, yy + 13 * s); ctx.lineTo(x - 13, yy - 9 * s); ctx.lineTo(x + 13, yy - 9 * s); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // la parentesi orizzontale di una lunghezza: da a a b (in metri), all'altezza yy, con i tratteggi giù fino alle creste
  function misura(ctx, a, b, yy, etichetta, al, t) {
    if (al <= 0) return;
    for (const m of [a, b]) dashed(ctx, [sx(m), yy + 12], [sx(m), YC - y(m, t) - 12], C.v, 1, .7 * al);
    freccia(ctx, [sx(a), yy], [sx(b), yy], C.v, al, 4, true);
    drawRich(ctx, etichetta, (sx(a) + sx(b)) / 2, yy - 38, { size: 36, alpha: al });
  }

  // ---------- la corda (7,5–72,6) ----------
  const CR = [140, 110, 1640, 420], XR = CR[0] + CR[2];
  function scenaCorda(ctx, t) {
    if (t < 7.5 || t > 72.8) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 72.0, 72.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, ...CR);
    // il righello in metri
    ctx.save(); ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx(0), 470); ctx.lineTo(sx(8), 470); ctx.stroke();
    for (let m = 0; m <= 8; m++) {
      ctx.beginPath(); ctx.moveTo(sx(m), 462); ctx.lineTo(sx(m), 478); ctx.stroke();
      txt(ctx, String(m), sx(m), 500, { size: 30, color: C.dim });
    }
    txt(ctx, 'm', sx(8) + 40, 500, { size: 30, color: C.dim });
    ctx.restore();
    // la corda
    ctx.save(); ctx.beginPath(); ctx.roundRect(CR[0] + 2, CR[1] + 2, CR[2] - 4, CR[3] - 4, 20); ctx.clip();
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = XL; x <= XR; x += 4) { const yy = YC - y((x - XL) / PXM, t); x === XL ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke(); ctx.restore();
    // la mano
    ctx.save(); ctx.fillStyle = css(C.dim, .85); ctx.beginPath(); ctx.roundRect(XL - 30, YC - y(0, t) - 36, 28, 72, 10); ctx.fill(); ctx.restore();
    txt(ctx, 'mano', XL - 16, 160, { size: 30, color: C.dim });
    txt(ctx, 'fermo immagine', 1760, 150, { size: 30, color: C.dim, align: 'right', alpha: fermo(t) ? 1 : 0 });

    // cresta e gola (nel primo fermo immagine)
    const kc = life(t, 16.4, 25.8, .4, .4);
    if (kc > 0) {
      const xc = sx(cresta(N_C, t)), xg = sx(gola(N_G, t));
      segno(ctx, xc, YC - A - 34, true, C.g, kc); drawRich(ctx, '{g:cresta}', xc, YC - A - 74, { size: 34, alpha: kc });
      segno(ctx, xg, YC + A + 30, false, C.x, P(t, 17.6, 18.0) * kc); drawRich(ctx, '{x:gola}', xg, YC + A + 70, { size: 34, alpha: P(t, 17.6, 18.0) * kc });
    }
    // λ fra due creste vicine
    const kl = life(t, 21.1, 25.9, .4, .4);
    if (kl > 0) misura(ctx, cresta(N_L, t), cresta(N_L - 1, t), YC - A - 46, '{mink:λ} = 2 m', kl, t);
    // il punto arancio a 6 m: un su e giù ogni T
    const kp = life(t, 26.1, 36.1, .4, .4);
    if (kp > 0) {
      freccia(ctx, [sx(6), YC + A + 24], [sx(6), YC - A - 24], C.v, .6 * kp, 4, true);
      ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sx(6), YC - y(6, t), 14, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    // una cresta che in un periodo avanza di λ (poi fermo immagine)
    const k8 = life(t, 36.4, 45.8, .4, .4);
    if (k8 > 0) {
      const x0 = cresta(N_8, 36.5), x1 = cresta(N_8, Math.max(t, 36.5));
      ctx.save(); ctx.globalAlpha *= .45; segno(ctx, sx(x0), YC - A - 34, true, C.v, k8); ctx.restore();
      segno(ctx, sx(x1), YC - A - 34, true, C.v, k8);
      misura(ctx, x0, x0 + 2, YC - A - 60, '{mink:λ} in un tempo {mink:T}', P(t, 38.6, 39.1) * k8, t);
    }
    // l'ipotesi «più veloce?», poi smentita
    const kr = life(t, 46.0, 58.6, .4, .4);
    if (kr > 0) {
      drawRich(ctx, '{r:più veloce?}', 1580, 160, { size: 36, alpha: kr });
      ctx.save(); ctx.globalAlpha *= kr; crossMark(ctx, 1420, 160, P(t, 54.8, 55.6), C.r, .3); ctx.restore();
    }
    // il confine fra onde nuove e vecchie, che corre a v
    const xb = V * (tau(t) - ts);
    if (t > TS && xb < 8.4) {
      const kb = life(t, TS + .1, 58.7, .3, .3);
      dashed(ctx, [sx(xb), 205], [sx(xb), 445], C.v, 1, kb);   // sotto «più veloce?», che non va attraversato
      const kn = kb * clamp((xb - 1.1) / .4) * clamp((6.9 - xb) / .4);
      drawRich(ctx, '{mink:f} = 1 Hz', sx(xb) - 18, 432, { size: 32, align: 'right', alpha: kn });
      drawRich(ctx, '{mink:f} = 0,5 Hz', sx(xb) + 18, 432, { size: 32, align: 'left', alpha: kn });
    }
    // λ nuova
    const kN = life(t, 58.9, 67.1, .4, .4);
    if (kN > 0) misura(ctx, cresta(N_N, t), cresta(N_N - 1, t), YC - A - 46, '{mink:λ} = 1 m', kN, t);
    ctx.restore();
  }

  // ---------- i numeri e le formule ----------
  function scenaNumeri(ctx, t) {
    if (t < 20.8 || t > 72.8) return;
    const al = 1 - P(t, 72.0, 72.6);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1180, 560, 640, 230, P(t, 20.8, 21.3));
    const cambia = (a, b, tc, yy, col = C.ink) => {
      const k = P(t, tc, tc + .4);
      if (k < 1) txt(ctx, a, 1785, yy, { size: 36, color: col, align: 'right', alpha: 1 - k });
      if (k > 0) txt(ctx, b, 1785, yy, { size: 36, color: col, align: 'right', alpha: k });
    };
    const nome = (s, yy, a) => drawRich(ctx, s, 1215, yy, { size: 32, align: 'left', alpha: a });
    let a = P(t, 21.1, 21.6);
    if (a > 0) {
      ctx.save(); ctx.globalAlpha *= a; nome('{dim:lunghezza d’onda} {mink:λ}', 605, 1);
      if (t < 58.9) cambia('2 m', '?', TS, 605); else cambia('?', '1 m', 58.9, 605);
      ctx.restore();
    }
    a = P(t, 26.1, 26.6);
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; nome('{dim:periodo} {mink:T}', 655, 1); cambia('2 s', '1 s', TS, 655); ctx.restore(); }
    a = P(t, 30.9, 31.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; nome('{dim:frequenza} {mink:f}', 705, 1); cambia('0,5 Hz', '1 Hz', TS, 705); ctx.restore(); }
    a = P(t, 40.8, 41.3);
    if (a > 0) {
      ctx.save(); ctx.globalAlpha *= a; nome('{dim:velocità} {mink:v}', 755, 1);
      const kg = P(t, 54.7, 55.2);
      txt(ctx, '1 m/s', 1785, 755, { size: 36, color: C.ink, align: 'right', alpha: 1 - kg });
      txt(ctx, '1 m/s', 1785, 755, { size: 36, weight: 600, color: C.g, align: 'right', alpha: kg });
      ctx.restore();
    }
    // le formule
    const kf = P(t, 30.8, 31.3);
    if (kf > 0) {
      card(ctx, 380, 560, 760, 230, kf);
      drawRich(ctx, '{mink:f = 1/T}', 760, 612, { size: 48, local: t - 31.0, alpha: kf });
      drawRich(ctx, '{mink:v = λ/T = λ·f}', 760, 680, { size: 48, local: t - 40.9, alpha: kf });
      drawRich(ctx, '{mink:λ = v/f}', 760, 748, { size: 48, local: t - 63.2, alpha: kf });
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, '{mink:v = λ·f}', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 72.3) return;
    const al = 1 - P(t, 81.0, 82.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 72.6 });
      drawRich(ctx, 'La velocità la decide il mezzo:\nse cresce {mink:f}, si accorcia {mink:λ}.', W / 2, 290, { size: 66, weight: 600, local: t - 73.0, stagger: .08 });
    });
    const pills = [[490, '{mink:v = λ·f}\n{mink:f = 1/T}'], [960, '{mink:λ}: da una cresta\nalla successiva'], [1430, 'stessa corda,\nstessa {mink:v}']];
    pills.forEach(([x, s], i) => {
      const a = 74.4 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.5],                                                                  // la corda
    ['tono', 8.0, 10.0, [.5, .15, 0, .15, .5, .85, 1, .85, .5]],                      // la mano scuote: giù e su
    ['pop', 16.6, .6], ['pop', 17.8, .4],                                             // fermo immagine: cresta e gola
    ['traccia', 21.1, 21.5], ['pop', 21.4, .55],                                      // la lambda, 2 m
    ['pop', 26.3, .5],                                                                // il punto arancio
    ['tono', 26.0, 28.0, [.21, .01, .1, .42, .79, .99, .9, .58, .21]],                // su e giù in un periodo
    ['pop', 31.0, .5], ['ding', 31.5],                                                // f = 1/T = 0,5 Hz
    ['pop', 36.6, .5], ['tono', 36.5, 38.5, [.3, .5, .7]],                            // la cresta avanza
    ['traccia', 38.6, 39.1],                                                          // di una lambda in un periodo
    ['pop', 41.0, .55], ['ding', 41.4],                                               // v = 1 m/s
    ['pop', 46.2, .45],                                                               // più veloce?
    ['pop', 50.7, .5],                                                                // la mano al doppio
    ['tono', 50.6, 52.1, [1, .85, .5, .15, 0, .15, .5, .85, 1, .85, .5, .15, 0]],     // su e giù a 1 Hz
    ['traccia', 54.8, 55.6], ['ding', 55.6],                                          // no: sempre 1 m/s
    ['traccia', 58.9, 59.3], ['pop', 59.2, .6],                                       // fermo immagine: lambda 1 m
    ['pop', 63.3, .6], ['ding', 63.8],                                                // lambda = v/f
    ['soffio', 72.3], ['pop', 74.4, .5], ['pop', 74.9, .6], ['pop', 75.4, .7],        // in una frase
  ];
  return {
    titolo: 'v = λ·f', durata: 83, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.8, 'cresta e lunghezza d’onda'], [25.8, 45.7, 'periodo e frequenza'], [45.7, 72.0, 'più frequenza']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCorda(ctx, t); scenaNumeri(ctx, t); scenaFine(ctx, t); },
  };
});
