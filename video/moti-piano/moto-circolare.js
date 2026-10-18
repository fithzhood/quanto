'use strict';
/* Girare è accelerare — una pallina gira su un cerchio di raggio 2 m, un giro ogni 4 s: il modulo della velocità è fisso
   (3,14 m/s) ma la direzione cambia, quindi accelera verso il centro: a = v²/r = ω²·r ≈ 4,93 m/s². Periodo, frequenza, ω.
   Con un giro ogni 2 s la velocità raddoppia e l'accelerazione quadruplica. Argomento: moti-piano. */
CVIDEO.registra('moti-piano/moto-circolare', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, ball, dot, card, arrowHead, dashed } = M;

  // ---------- il moto vero, in tempo vero: φ(t) = ∫ω dt ----------
  const R = 2, RAD = Math.PI / 180, W1 = 2 * Math.PI / 4;           // raggio 2 m, ω = 2π/T con T = 4 s
  const O = [732, 454], PXM = 130;                                    // centro, 130 px per metro (r = 260 px)
  // tratti in cui la pallina gira: [inizio, fine, ω all'inizio, ω alla fine] (fuori di qui è ferma: fermo immagine)
  const TRATTI = [[8.0, 31.6, W1, W1], [31.9, 31.9 + 40 * RAD / W1, W1, W1], [45.2, 74.7, W1, W1], [74.7, 75.5, W1, 2 * W1], [75.5, 89.2, 2 * W1, 2 * W1]];
  const integra = t => TRATTI.reduce((s, [a, b, wa, wb]) => {
    const d = clamp(t, a, b) - a; return s + wa * d + (wb - wa) * d * d / (2 * (b - a));
  }, 0);
  const durata = t => TRATTI.reduce((s, [a, b]) => s + clamp(t, a, b) - a, 0);
  const PH0 = 70 * RAD - W1 * (31.6 - 8.0);                          // così a 31,6 s la pallina è a 70°
  const fi = t => PH0 + integra(t);
  const omega = t => t < 74.7 ? W1 : t < 75.5 ? lerp(W1, 2 * W1, (t - 74.7) / .8) : 2 * W1;
  const sulCerchio = a => [O[0] + R * PXM * Math.cos(a), O[1] - R * PXM * Math.sin(a)];
  const VS = 32, AS = 12;                                             // 32 px per m/s, 12 px per m/s²
  const F1 = 70 * RAD, F2 = 110 * RAD;                                // i due istanti vicini

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [89.0, 190], [90.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [89.0, 1050], [90.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [89.0, 2.2], [90.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [89.0, 2], [90.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [89.0, -1.5], [90.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.6, 'pensa'], [26.6, 'neutro'],
    [40.4, 'sorpreso'], [45.0, 'felice'], [50.0, 'neutro'], [69.4, 'felice'], [74.6, 'neutro'], [79.2, 'sorpreso'],
    [84.2, 'neutro'], [91.6, 'felice'], [94.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Una pallina gira sempre allo\nstesso ritmo: sta accelerando?'],
    [7.9, 13.2, 'Gira su un cerchio di raggio\n{mink:r} = 2 m, un giro ogni 4 s.'],
    [13.4, 17.8, 'Il tachimetro segna sempre\n3,14 m/s: il {g:modulo} non cambia.'],
    [18.0, 22.4, 'Ma la freccia della velocità cambia\ndirezione: è sempre {v:tangente}.'],
    [22.6, 26.4, '{r:Modulo fisso, quindi niente}\n{r:accelerazione?}'],
    [26.6, 31.2, 'No: la velocità è un {v:vettore},\ne qui il vettore {g:cambia}.'],
    [31.4, 35.4, 'Fermo la pallina in due istanti\nvicini: due frecce diverse.'],
    [35.6, 40.2, 'Le porto con la coda nello stesso\npunto: la differenza è {mv:Δv}.'],
    [40.4, 44.8, '{mv:Δv} punta verso il {v:centro}\ndel cerchio.'],
    [45.0, 49.8, 'Vale in ogni punto: l’accelerazione\nè {v:centripeta}, verso il centro.'],
    [50.0, 54.5, 'Un giro ogni 4 s: è il {mink:periodo},\n{mink:T} = 4 s.'],
    [54.6, 59.4, 'Giri al secondo: la frequenza,\n{mink:f = 1/T} = 0,25 Hz.'],
    [59.6, 64.6, 'Angolo al secondo: {mink:ω = 2π/T}\n≈ 1,57 rad/s.'],
    [64.8, 69.2, 'La velocità: {mx:v} = {mink:ω·r}\n≈ 3,14 m/s.'],
    [69.4, 74.4, 'L’accelerazione: {mv:a} = {mx:v}{mink:²/r} = {mink:ω²·r}\n≈ 4,93 m/s².'],
    [74.6, 79.0, 'Ora un giro ogni 2 s:\nvelocità doppia, 6,28 m/s.'],
    [79.2, 84.0, 'L’accelerazione diventa\n{g:quattro volte}: 19,7 m/s².'],
    [84.2, 88.8, 'Perché {mx:v} è al quadrato:\nvelocità doppia, {mv:a} quadrupla.'],
    [91.6, 96.4, 'Girare è accelerare: verso\nil centro, {mv:a} = {mx:v}{mink:²/r}.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 7) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1.3, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    if (L > 14 * s) {
      ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    }
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  // velocità tangente (verso antiorario) e accelerazione verso il centro, per la pallina all'angolo a
  const tangente = (a, len) => { const p = sulCerchio(a); return [p, [p[0] - len * Math.sin(a), p[1] - len * Math.cos(a)]]; };
  const centripeta = (a, len) => { const p = sulCerchio(a); return [p, [p[0] - len * Math.cos(a), p[1] + len * Math.sin(a)]]; };
  function vel(ctx, a, w, al, nome = '{mx:v}') {
    if (al <= 0) return;
    const [p, q] = tangente(a, w * R * VS);
    freccia(ctx, p, q, C.x, al);
    drawRich(ctx, nome, q[0] - 34 * Math.sin(a), q[1] - 34 * Math.cos(a), { size: 40, alpha: al });
  }
  function acc(ctx, a, w, al) {
    if (al <= 0) return;
    const len = w * w * R * AS, [p, q] = centripeta(a, len);
    freccia(ctx, p, q, C.v, al);
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    drawRich(ctx, '{mv:a}', m[0] + 30 * Math.sin(a), m[1] + 30 * Math.cos(a), { size: 40, alpha: al });
  }

  // ---------- il cerchio ----------
  function scenaCerchio(ctx, t) {
    if (t < 7.5 || t > 89.8) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 88.9, 89.5));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 720, 692);
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(O[0], O[1], R * PXM, 0, Math.PI * 2); ctx.stroke();
    dot(ctx, O, C.ink, 1, 7);
    // l'orologio
    // l'orologio sta nel pannello: sul cerchio la freccia v (lunga fino a 201 px) passa per tutti gli angoli
    txt(ctx, 'fermo immagine', 1060, 156, { size: 30, color: C.dim, align: 'right', alpha: life(t, 31.6, 45.2, .3, .3) * (t < 31.9 || t > 32.35 ? 1 : 0) });
    // il raggio
    const kr = life(t, 8.2, 31.2, .4, .4) + life(t, 64.8, 74.4, .4, .4);
    if (kr > 0) {
      dashed(ctx, O, [O[0] + R * PXM, O[1]], C.dim, 1, kr);
      drawRich(ctx, '{mink:r} = 2 m', O[0] + 80, O[1] + 34, { size: 36, alpha: kr });
    }
    const a = fi(t), w = omega(t);
    // 1 · la velocità: modulo fisso, direzione che cambia
    const kRampa = 1 - life(t, 74.6, 75.8, .2, .3);
    vel(ctx, a, w, life(t, 13.6, 31.4, .4, .3) + life(t, 45.2, 88.8, .4, .4) * kRampa);
    // 2 · due istanti vicini
    const k2 = life(t, 31.6, 45.2, .3, .4);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      ctx.save(); ctx.globalAlpha *= .45; ball(ctx, ...sulCerchio(F1), '', C.y, { r: 16 }); ctx.restore();
      vel(ctx, F1, W1, .55, '{mx:v₁}');
      vel(ctx, a, W1, P(t, 32.3, 32.6), '{mx:v₂}');
      const kd = P(t, 40.6, 41.2);
      if (kd > 0) {
        const pm = sulCerchio(90 * RAD), len = 2 * Math.sin(20 * RAD) * W1 * R * VS;
        dot(ctx, pm, C.v, kd, 7);
        freccia(ctx, pm, [pm[0], pm[1] + len], C.v, kd, 6);
        drawRich(ctx, '{mv:Δv}', pm[0], pm[1] + 104, { size: 36, alpha: kd });
      }
      ctx.restore();
    }
    // 3 · l'accelerazione centripeta
    acc(ctx, a, w, life(t, 45.2, 88.8, .4, .4) * kRampa);
    ball(ctx, ...sulCerchio(a), '', C.y, { r: 16, scale: P(t, 8.0, 8.4, E.back) });
    ctx.restore();
  }


  // ---------- il pannello ----------
  const PCX = 1480;
  function scenaPannello(ctx, t) {
    if (t < 13.4 || t > 89.8) return;
    const al = P(t, 13.4, 13.9) * (1 - P(t, 88.9, 89.5));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1120, 108, 720, 692);
    drawRich(ctx, '{mink:t} =', 1606, 770, { size: 32, align: 'left' });
    fixedNum(ctx, fmtN(durata(t), 2), 1772, 770, 32, C.ink); txt(ctx, 's', 1780, 770, { size: 28, color: C.dim, align: 'left' });
    const tit = s => conFont(TITOLI, () => drawRich(ctx, s, PCX, 168, { size: 36, weight: 600 }));
    // 1 · il tachimetro e la direzione
    const s1 = 1 - P(t, 31.0, 31.4);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('la velocità');
      txt(ctx, 'modulo', 1170, 250, { size: 30, color: C.dim, align: 'left' });
      txt(ctx, '3,14 m/s', 1170, 310, { size: 60, weight: 600, color: C.x, align: 'left' });
      txt(ctx, 'sempre uguale', 1170, 368, { size: 30, color: C.g, align: 'left', alpha: P(t, 14.0, 14.5) });
      const kd = P(t, 18.2, 18.7);
      if (kd > 0) {
        ctx.save(); ctx.globalAlpha *= kd;
        txt(ctx, 'direzione', 1560, 250, { size: 30, color: C.dim, align: 'left' });
        const c = [1640, 340], a = fi(t);
        ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0], c[1], 62, 0, Math.PI * 2); ctx.stroke();
        freccia(ctx, [c[0] + 50 * Math.sin(a), c[1] + 50 * Math.cos(a)], [c[0] - 50 * Math.sin(a), c[1] - 50 * Math.cos(a)], C.x, 1, 6);
        txt(ctx, 'cambia sempre', 1560, 440, { size: 30, color: C.v, align: 'left' });
        ctx.restore();
      }
      const kI = P(t, 22.8, 23.3);
      if (kI > 0) {
        drawRich(ctx, '{r:modulo fisso → niente accelerazione?}', PCX, 560, { size: 32, alpha: kI });
        const kx = P(t, 26.8, 27.4);
        if (kx > 0) {
          ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1180, 562); ctx.lineTo(lerp(1180, 1780, kx), 562); ctx.stroke(); ctx.restore();
        }
      }
      drawRich(ctx, 'la velocità è un {v:vettore}: {g:cambia}', PCX, 650, { size: 36, alpha: P(t, 27.0, 27.5), local: t - 27.0 });
      ctx.restore();
    }
    // 2 · due istanti vicini: la differenza punta al centro
    const s2 = life(t, 31.4, 50.0, .4, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('due istanti vicini');
      const Q = [1680, 390], k = P(t, 35.8, 36.6), v = W1 * R * VS * 2;     // qui le frecce sono il doppio di quelle del cerchio
      const t1 = [Q[0] - v * Math.sin(F1), Q[1] - v * Math.cos(F1)], t2 = [Q[0] - v * Math.sin(F2), Q[1] - v * Math.cos(F2)];
      ctx.save(); ctx.globalAlpha *= k;
      dot(ctx, Q, C.ink, 1, 6);
      freccia(ctx, Q, t1, C.x, .55);
      freccia(ctx, Q, t2, C.x, 1);
      drawRich(ctx, '{mx:v₁}', t1[0] - 36, t1[1] - 20, { size: 40 });
      drawRich(ctx, '{mx:v₂}', t2[0] - 36, t2[1] + 22, { size: 40 });
      const kd = P(t, 36.8, 37.4);
      freccia(ctx, t1, [t1[0], lerp(t1[1], t2[1], kd)], C.v, kd, 6);
      drawRich(ctx, '{mv:Δv}', t1[0] - 62, Q[1], { size: 40, alpha: kd });
      ctx.restore();
      txt(ctx, '(frecce lunghe il doppio)', PCX, 224, { size: 30, color: C.dim, alpha: k });
      drawRich(ctx, '{mv:Δv} = {mx:v₂} − {mx:v₁}', PCX, 590, { size: 40, alpha: P(t, 37.4, 37.9) });
      drawRich(ctx, 'punta verso il {v:centro}', PCX, 660, { size: 36, alpha: P(t, 40.6, 41.1) });
      drawRich(ctx, 'accelerazione {v:centripeta}', PCX, 728, { size: 36, alpha: P(t, 45.2, 45.7) });
      ctx.restore();
    }
    // 3 · periodo, frequenza, ω, v, a
    const s3 = P(t, 50.0, 50.4);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('il moto circolare uniforme');
      const kOut = P(t, 74.8, 75.1), k = P(t, 75.2, 75.6);   // da un giro ogni 4 s a un giro ogni 2 s: le vecchie escono prima
      const righe = [
        [50.2, 'periodo', '{mink:T} = ', '4 s', '2 s'],
        [54.8, 'frequenza', '{mink:f = 1/T} = ', '0,25 Hz', '0,5 Hz'],
        [59.8, 'velocità angolare', '{mink:ω = 2π/T} ≈ ', '1,57 rad/s', '3,14 rad/s'],
        [65.0, 'velocità', '{mx:v} = {mink:ω·r} ≈ ', '{x:3,14 m/s}', '{x:6,28 m/s}'],
        [69.6, 'accelerazione', '{mv:a} = {mx:v}{mink:²/r} ≈ ', '{v:4,93 m/s²}', '{v:19,7 m/s²}'],
      ];
      righe.forEach(([ta, nome, f, v1, v2], i) => {
        const y = 245 + 78 * i, ka = P(t, ta, ta + .5);
        txt(ctx, nome, 1150, y, { size: 30, color: C.dim, align: 'left', alpha: ka });
        drawRich(ctx, f + v1, 1805, y, { size: 34, align: 'right', alpha: ka * (1 - kOut) });
        drawRich(ctx, f + v2, 1805, y, { size: 34, align: 'right', alpha: ka * k });
      });
      drawRich(ctx, '{dim:raggio} {mink:r} = 2 m', PCX, 640, { size: 32, alpha: P(t, 65.0, 65.5) });
      drawRich(ctx, 'velocità doppia → {mv:a} {g:quattro volte}', PCX, 720, { size: 36, alpha: P(t, 79.4, 79.9), local: t - 79.4 });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Girare è accelerare', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 89.2) return;
    const al = 1 - P(t, 97.4, 98.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 89.4 });
      drawRich(ctx, 'Nel moto circolare uniforme la velocità\ncambia direzione: c’è {v:accelerazione centripeta}.', W / 2, 290, { size: 60, weight: 600, local: t - 89.8, stagger: .08 });
    });
    const pills = [[490, 'velocità {v:tangente},\nmodulo costante'], [960, '{mv:a} = {mx:v}{mink:²/r} = {mink:ω²·r}\nverso il centro'], [1430, '{mink:f = 1/T}\n{mink:ω = 2π/T},  {mx:v} = {mink:ω·r}']];
    pills.forEach(([x, s], i) => {
      const a = 91.0 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // i toni seguono l'altezza della pallina sul cerchio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.0, .9], ['traccia', 8.2, 8.6],                         // la pallina, il raggio
    ['tono', 8.0, 12.0, [.93, .72, .38, .11, .07, .28, .62, .89, .93]],               // un giro in 4 s
    ['pop', 13.6, .5], ['pop', 14.0, .55],                                            // la velocità, sempre uguale
    ['pop', 18.2, .5],                                                                // la direzione cambia
    ['pop', 22.8, .4], ['traccia', 26.8, 27.4], ['pop', 27.0, .6],                    // niente accelerazione? no: è un vettore
    ['pop', 31.6, .45], ['tono', 31.9, 32.35, [.92, .95, .92]], ['pop', 32.3, .6],    // due istanti vicini
    ['pop', 35.8, .5], ['traccia', 36.8, 37.4], ['pop', 37.4, .5],                    // le code insieme: delta v
    ['ding', 40.6],                                                                   // punta verso il centro
    ['pop', 45.2, .6], ['tono', 45.2, 49.2, [.92, .69, .35, .09, .07, .26, .6, .86, .92]],   // centripeta, in ogni punto
    ['soffio', 50.0], ['pop', 50.2, .45], ['pop', 54.8, .5], ['pop', 59.8, .55],      // periodo, frequenza, omega
    ['pop', 65.0, .6], ['ding', 69.6],                                                // v, a = v quadro su r
    ['tono', 74.7, 77.5, [.09, .07, .4, .86, .76, .27, .06, .4]], ['pop', 75.2, .7],  // un giro ogni 2 s
    ['ding', 79.4],                                                                   // quattro volte
    ['soffio', 89.4], ['pop', 91.0, .5], ['pop', 91.5, .6], ['pop', 92.0, .7],        // in una frase
  ];
  return {
    titolo: 'Girare è accelerare', durata: 99, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.2, 'la velocità cambia direzione'], [31.2, 49.8, 'verso il centro'], [49.8, 74.4, 'periodo, frequenza, ω'], [74.4, 88.8, 'più veloce']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCerchio(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
