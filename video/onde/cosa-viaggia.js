'use strict';
/* Il tappo che resta lì — un'onda passa sull'acqua e il tappo gira in un piccolo cerchio senza avanzare; sulla corda (onda
   trasversale) e sulla molla (onda longitudinale) ogni punto oscilla attorno al suo posto: viaggia l'energia, non la
   materia. Moto vero: dietro al fronte y = A·sin(k·x − ω·t), davanti 0; nella molla lo stesso spostamento è lungo
   l'asse. Una sola idea (l'onda porta energia, non materia) vista in tre mezzi. Argomento: onde. */
CVIDEO.registra('onde/cosa-viaggia', M => {
  const { W, C, E, P, life, clamp, css, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

  // un'onda che parte da XS all'istante T0: spostamento A·sin(k·(x − XS) − ω·(t − T0)) dove il fronte è già passato
  function onda(XS, T0, A, LAM, PER) {
    const k = 2 * Math.PI / LAM, w = 2 * Math.PI / PER, v = LAM / PER;
    const y = (x, t) => { const tau = t - T0, dx = x - XS; return tau <= 0 || dx > v * tau ? 0 : A * Math.sin(k * dx - w * tau); };
    // la n-esima cresta (fase π/2) e la n-esima compressione (fase π, per la molla), n ≤ −1
    const fase = (ph, n, t) => XS + (ph + w * (t - T0) + 2 * Math.PI * n) / k;
    return { k, w, v, y, fase };
  }
  const CA = [140, 120, 1640, 560];                    // la scheda di tutte e tre le scene
  const XR = CA[0] + CA[2];
  // 1 · lo stagno visto di lato: λ = 480 px, T = 2 s, v = 240 px/s; l'onda entra da sinistra a 11 s
  const AP = 40;                                       // ampiezza nello stagno: k·A ≈ 0,52, creste non troppo aguzze
  const Y0 = 410, OA = onda(CA[0], 12.4, AP, 480, 2), XT = 820;   // il fronte arriva al tappo a 15,23 s
  const GH0 = 28.7;                                    // da qui il tappo «fantasma» corre con l'onda (fino al bordo, 32,5 s)
  // la goccia di superficie che a riposo sta in x₀: gira in un cerchio di raggio A (rampa sul primo periodo dopo il fronte)
  function goccia(x0, t) {
    const tau = t - 12.4, dx = x0 - CA[0];
    if (tau <= 0 || dx > OA.v * tau) return [x0, Y0];
    const ph = OA.k * dx - OA.w * tau, ramp = clamp((OA.v * tau - dx) / 480);
    return [x0 + AP * ramp * Math.cos(ph), Y0 - AP * Math.sin(ph)];
  }
  // 2 · la corda: λ = 520 px, T = 2 s; la mano in XB a 38,2 s
  const XB = 250, YB = 420, OB = onda(XB, 38.2, 70, 520, 2), PASSO_B = 37, IB = 16, XO = XB + PASSO_B * IB;
  // 3 · la molla: le spire si spostano lungo l'asse di D·sin(k·x − ω·t), D = 26 px
  const XM = 250, YM = 420, OC = onda(XM, 56.0, 26, 520, 2), PASSO_C = 32, IC = 18, XS2 = XM + PASSO_C * IC;

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [79.2, 190], [80.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [79.2, 1050], [80.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [79.2, 2.2], [80.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [79.2, 2], [80.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [79.2, -1.5], [80.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [15.4, 'sorpreso'], [19.8, 'felice'],
    [24.3, 'neutro'], [28.5, 'pensa'], [33.2, 'felice'], [37.6, 'neutro'], [50.4, 'felice'], [55.4, 'neutro'],
    [69.2, 'felice'], [74.2, 'neutro'], [81.8, 'felice'], [86.5, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Un’onda attraversa lo stagno:\nche cosa si porta dietro?'],
    [7.9, 11.6, 'Un {y:tappo} galleggia\nsull’acqua ferma.'],
    [11.8, 15.2, 'Da sinistra arriva un’onda…'],
    [15.4, 19.6, '…e il tappo, che era fermo,\nsi mette a ballare.'],
    [19.8, 24.1, 'Gira in un piccolo cerchio,\nma {g:non avanza}: resta lì.'],
    [24.3, 28.3, 'La {v:cresta}, il punto più alto,\ninvece corre verso destra.'],
    [28.5, 32.7, 'Se l’acqua viaggiasse con l’onda,\nil tappo partirebbe con lei.'],
    [33.2, 37.4, 'Invece resta qui: l’onda porta\n{g:energia}, non acqua.'],
    [37.6, 41.6, 'Ora una corda: la mano\nla scuote su e giù.'],
    [41.8, 45.8, 'Il punto {y:arancio}\nva su e giù…'],
    [46.0, 50.2, '…mentre l’onda corre\nverso destra.'],
    [50.4, 55.2, 'Oscilla {v:perpendicolare} a dove va\nl’onda: è un’onda {v:trasversale}.'],
    [55.4, 59.4, 'Ora una molla:\nla mano spinge e tira.'],
    [59.6, 64.4, 'Le spire si {v:stringono} e si allargano:\nla compressione corre avanti.'],
    [64.6, 69.0, 'La spira {y:arancio} va avanti\ne indietro, e resta lì.'],
    [69.2, 74.0, 'Oscilla {v:parallela} a dove va\nl’onda: è un’onda {v:longitudinale}.'],
    [74.2, 79.0, 'Corda o molla, la materia resta lì:\nviaggia l’{g:energia}.'],
    [81.8, 88.6, 'Un’onda è una perturbazione che viaggia:\nporta energia, non materia.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 6, doppia = false) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, ang = Math.atan2(dy, dx);
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0] + (doppia ? ux * 14 : 0), a[1] + (doppia ? uy * 14 : 0)); ctx.lineTo(b[0] - ux * 14, b[1] - uy * 14); ctx.stroke();
    arrowHead(ctx, [b[0] - ux * 4, b[1] - uy * 4], ang, col);
    if (doppia) arrowHead(ctx, [a[0] + ux * 4, a[1] + uy * 4], ang + Math.PI, col);
    ctx.restore();
  }
  function clipScheda(ctx) { ctx.beginPath(); ctx.roundRect(CA[0] + 2, CA[1] + 2, CA[2] - 4, CA[3] - 4, 20); ctx.clip(); }
  function tappo(ctx, x, y, col, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css(col); ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x - 32, y - 24, 64, 40, 12); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // triangolino che segna un punto dell'onda, con il nome sopra o sotto
  function segno(ctx, x, y, giu, nome, col, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col);
    const s = giu ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(x, y + 14 * s); ctx.lineTo(x - 14, y - 10 * s); ctx.lineTo(x + 14, y - 10 * s); ctx.closePath(); ctx.fill();
    ctx.restore();
    drawRich(ctx, nome, x, y - 42 * s, { size: 34, alpha: al });
  }

  // ---------- 1 · lo stagno (7,5–37,6) ----------
  function scenaStagno(ctx, t) {
    if (t < 7.5 || t > 37.8) return;
    const al = P(t, 7.6, 8.3) * (1 - P(t, 37.0, 37.6));
    ctx.save(); ctx.globalAlpha *= al;
    ctx.save(); clipScheda(ctx);
    // ogni goccia della superficie, che a riposo sta in x₀, gira in un cerchio di raggio A (onda di acqua profonda):
    // y = A·sin(k·x₀ − ω·t), x = x₀ + A·cos(k·x₀ − ω·t); il moto orizzontale cresce nel primo periodo dopo il fronte
    const pts = []; for (let x0 = CA[0] - 70; x0 <= XR + 70; x0 += 4) pts.push(goccia(x0, t));
    ctx.fillStyle = css(C.x, .13);
    ctx.beginPath(); ctx.moveTo(CA[0], CA[1] + CA[3]); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(XR, CA[1] + CA[3]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    // il fantasma: come sarebbe se l'acqua viaggiasse con l'onda (resta sulla stessa fase, corre a v)
    const ga = life(t, GH0, 32.9, .3, .4);
    if (ga > 0) {
      const [xg, yg] = goccia(XT + OA.v * (t - GH0), t);   // resta sulla stessa fase: corre con l'onda
      ctx.save(); ctx.setLineDash([8, 7]); tappo(ctx, xg, yg, C.r, .6 * ga); ctx.restore();
    }
    ctx.restore();
    // «resta qui»: la riga del suo posto e il cerchio che percorre
    const g = Math.max(life(t, 19.9, 24.1, .4, .4), life(t, 33.3, 37.4, .4, .3));
    if (g > 0) {
      dashed(ctx, [XT, 250], [XT, 560], C.g, 1, g);
      ctx.save(); ctx.globalAlpha *= g; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.arc(XT, Y0, AP, 0, 2 * Math.PI); ctx.stroke();
      ctx.restore();
      drawRich(ctx, '{g:resta qui}', XT, 215, { size: 36, alpha: g });
    }
    // il tappo, che sta sempre attorno a XT: si muove come la goccia che a riposo sta in XT
    const [xt, yt] = goccia(XT, t);
    tappo(ctx, xt, yt, C.y, P(t, 8.0, 8.5));
    // una cresta, segnata, che corre a v
    const ca = life(t, 24.2, 28.4, .4, .4);
    if (ca > 0) { const xc = OA.fase(Math.PI / 2, -6, t); segno(ctx, xc, Y0 - AP - 58, true, '{v:cresta}', C.v, ca); }
    // l'ipotesi sbagliata, poi smentita
    const ra = life(t, 28.8, 37.4, .4, .3);
    if (ra > 0) {
      drawRich(ctx, '{r:se fosse così…}', 1580, 190, { size: 36, alpha: ra });
      // smentita: l'ipotesi si sbarra
      const ks = P(t, 33.3, 34.0);
      if (ks > 0) { ctx.save(); ctx.globalAlpha *= ra; ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(1436, 192); ctx.lineTo(1436 + 290 * ks, 192); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  }

  // ---------- 2 · la corda (37,4–55,6) ----------
  function mano(ctx, x, y, w, h, al) {
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim, .85);
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore();
  }
  function scenaCorda(ctx, t) {
    if (t < 37.2 || t > 55.8) return;
    const al = life(t, 37.4, 55.6, .5, .5);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.save(); clipScheda(ctx);
    const pts = []; for (let x = XB; x <= XR; x += 5) pts.push([x, YB - OB.y(x, t)]);
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 5; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    for (let i = 1; XB + i * PASSO_B < XR; i++) {
      if (i === IB) continue;
      const x = XB + i * PASSO_B;
      ctx.fillStyle = css(C.ink, .7); ctx.beginPath(); ctx.arc(x, YB - OB.y(x, t), 7, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.restore();
    // la corsa del punto arancio: su e giù, sempre sulla sua verticale
    const ka = life(t, 41.9, 55.4, .4, .4);
    if (ka > 0) freccia(ctx, [XO, YB + 70 + 26], [XO, YB - 70 - 26], C.v, .6 * ka, 4, true);
    const yo = YB - OB.y(XO, t);
    ctx.save(); ctx.fillStyle = css(C.y); ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(XO, yo, 15, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
    mano(ctx, XB - 6, YB - OB.y(XB, t), 30, 76, 1);
    txt(ctx, 'mano', XB - 6, 250, { size: 32, color: C.dim });
    // dove va l'onda
    const kd = life(t, 46.1, 55.4, .4, .4);
    if (kd > 0) { freccia(ctx, [1000, 228], [1520, 228], C.x, kd); drawRich(ctx, '{x:l’onda corre}', 1260, 182, { size: 34, alpha: kd }); }
    drawRich(ctx, 'onda {v:trasversale}', 1480, 612, { size: 40, alpha: life(t, 50.6, 55.4, .4, .4), local: t - 50.6 });
    ctx.restore();
  }

  // ---------- 3 · la molla (55,2–79,4) ----------
  function scenaMolla(ctx, t) {
    if (t < 55.1 || t > 79.5) return;
    const al = life(t, 55.3, 79.3, .5, .5);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.save(); clipScheda(ctx);
    // ogni spira sta in x₀ + D·sin(k·x₀ − ω·t): si sposta lungo l'asse, attorno al suo posto x₀
    for (let i = 1; XM + i * PASSO_C < XR + 20; i++) {
      const x0 = XM + i * PASSO_C, x = x0 + OC.y(x0, t), lei = i === IC;
      ctx.strokeStyle = lei ? css(C.y) : css(C.ink, .7); ctx.lineWidth = lei ? 7 : 3.5;
      ctx.beginPath(); ctx.ellipse(x, YM, 7, 66, 0, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.restore();
    mano(ctx, XM - 18 + OC.y(XM, t), YM, 24, 170, 1);
    txt(ctx, 'mano', XM - 18, 290, { size: 32, color: C.dim });
    // una compressione, segnata, che corre a v
    const kc = life(t, 59.7, 64.5, .4, .4);
    if (kc > 0) { const xc = OC.fase(Math.PI, -2, t); segno(ctx, xc + OC.y(xc, t), YM + 66 + 30, false, '{v:compressione}', C.v, kc); }
    // la corsa della spira arancio: avanti e indietro, attorno al suo posto
    const ks = life(t, 64.7, 79.0, .4, .4);
    if (ks > 0) {
      freccia(ctx, [XS2 - 26 - 24, YM - 66 - 36], [XS2 + 26 + 24, YM - 66 - 36], C.v, .6 * ks, 4, true);
      // il suo posto a riposo
      ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(XS2, YM + 66 + 14); ctx.lineTo(XS2, YM + 66 + 40); ctx.stroke(); ctx.restore();
    }
    const kd = life(t, 69.3, 79.0, .4, .4);
    if (kd > 0) { freccia(ctx, [1000, 228], [1520, 228], C.x, kd); drawRich(ctx, '{x:l’onda corre}', 1260, 182, { size: 34, alpha: kd }); }
    drawRich(ctx, 'onda {v:longitudinale}', 1480, 612, { size: 40, alpha: life(t, 69.4, 79.0, .4, .4), local: t - 69.4 });
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il tappo che resta lì', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 79.3) return;
    const al = 1 - P(t, 89.0, 90.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 79.6 });
      drawRich(ctx, 'Un’onda porta {g:energia} da un posto\nall’altro, senza portare materia.', W / 2, 290, { size: 66, weight: 600, local: t - 80.0, stagger: .08 });
    });
    const pills = [[490, 'il {y:tappo} gira in un piccolo\ncerchio, ma non avanza'], [960, '{v:trasversale}: oscilla\nperpendicolare'], [1430, '{v:longitudinale}: oscilla\nparallela']];
    pills.forEach(([x, s], i) => {
      const a = 81.4 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // i toni seguono l'altezza del tappo, della mano e del punto arancio (la spira: la sua posizione lungo l'asse),
  // per un periodo; le fasi vengono dal moto vero (fronte al tappo a 15,23 s, al punto della corda a 40,48 s)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .5],                                                // il tappo sull'acqua ferma
    ['tono', 15.23, 17.23, [.5, .22, .1, .22, .5, .78, .9, .78, .5]],                 // arriva l'onda: il tappo balla
    ['traccia', 19.9, 20.3], ['ding', 20.0],                                          // resta qui, non avanza
    ['pop', 24.2, .8],                                                                // la cresta corre
    ['pop', 28.8, .4], ['tono', 28.7, 32.5, [.4, .5, .6, .7, .8]],                    // il tappo fantasma corre con l'onda
    ['traccia', 33.3, 34.0], ['ding', 33.5],                                          // smentita: porta energia
    ['soffio', 37.4], ['tono', 38.2, 40.2, [.5, .22, .1, .22, .5, .78, .9, .78, .5]], // la corda: la mano la scuote
    ['tono', 41.9, 43.9, [.89, .84, .6, .29, .11, .16, .4, .71, .89]],                // il punto arancio su e giù
    ['traccia', 46.1, 46.6],                                                          // l'onda corre
    ['pop', 50.6, .6],                                                                // onda trasversale
    ['soffio', 55.3], ['tono', 56.0, 58.0, [.5, .22, .1, .22, .5, .78, .9, .78, .5]], // la molla: spinge e tira
    ['pop', 59.7, .5],                                                                // la compressione
    ['tono', 64.7, 66.7, [.1, .2, .48, .77, .9, .8, .52, .23, .1]],                   // la spira arancio avanti e indietro
    ['traccia', 69.3, 69.8], ['pop', 69.4, .6],                                       // onda longitudinale
    ['soffio', 79.6], ['pop', 81.4, .5], ['pop', 81.9, .6], ['pop', 82.4, .7],        // in una frase
  ];
  return {
    titolo: 'Il tappo che resta lì', durata: 91, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 37.4, 'il tappo'], [37.4, 55.2, 'la corda'], [55.2, 79.0, 'la molla']],
    scena(ctx, t) {
      card(ctx, ...CA, P(t, 7.5, 8.2) * (1 - P(t, 79.0, 79.6)));
      scenaTitolo(ctx, t); scenaStagno(ctx, t); scenaCorda(ctx, t); scenaMolla(ctx, t); scenaFine(ctx, t);
    },
  };
});
