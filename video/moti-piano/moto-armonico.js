'use strict';
/* L'ombra del moto circolare — una pallina gira su un cerchio di raggio 2 m in 4 s; la sua ombra su un diametro va avanti
   e indietro: x = A·cos(ω·t), con A = 2 m e ω = 2π/T ≈ 1,57 rad/s. Veloce al centro (ω·A ≈ 3,14 m/s), ferma agli estremi;
   accelerazione a = −ω²·x, massima agli estremi (≈ 4,93 m/s²) e sempre verso il centro. Argomento: moti-piano. */
CVIDEO.registra('moti-piano/moto-armonico', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, ball, dot, card, arrowHead, dashed, glowStroke } = M;

  // ---------- il moto vero, in tempo vero: φ = ω·t, x = A·cos φ ----------
  const A = 2, WW = 2 * Math.PI / 4, RAD = Math.PI / 180;            // ampiezza 2 m, ω = 2π/T con T = 4 s
  const O = [742, 372], PXM = 100, YR = 690;                         // centro del cerchio, 100 px per metro, la riga dell'ombra
  // tratti in cui il moto scorre (fuori di qui: fermo immagine)
  const TRATTI = [[8.0, 49.4], [54.4, 55.4], [60.0, 65.0], [68.6, 69.6], [79.0, 87.0]];   // in tempo vero
  // fra 27,4 e 35,4 s si spiegano A e ω: la pallina continua a girare (due giri), il resto della scena aspetta
  const INS = [27.4, 35.4];
  const vecchio = t => t < INS[0] ? t : t < INS[1] ? INS[0] : t - (INS[1] - INS[0]);
  let TR = 0;                                                      // il tempo vero del fotogramma
  const corsa = t => TRATTI.reduce((s, [a, b]) => s + clamp(t, a, b) - a, 0);
  const PH0 = 90 * RAD - WW * (49.4 - 8.0);                         // a 49,4 s la pallina è in cima (φ = 90°)
  const fi = t => PH0 + WW * corsa(t);
  const xOmbra = t => A * Math.cos(fi(t));
  const pallina = f => [O[0] + A * PXM * Math.cos(f), O[1] - A * PXM * Math.sin(f)];
  const ombra = f => [O[0] + A * PXM * Math.cos(f), YR];
  const FOTO = 28.4;                                                // da qui una foto ogni 0,25 s per mezzo giro (φ da 0° a 180°)
  const VS = 50, AS = 40;                                           // 50 px per m/s, 40 px per m/s²
  const T5 = 79.0;                                                  // l'orologio della legge oraria parte da qui (φ = 0)
  const fermo = t => t > 8.2 && !TRATTI.some(([a, b]) => t >= a - .05 && t <= b + .05);

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [93.2, 190], [94.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [93.2, 1050], [94.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [93.2, 2.2], [94.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [93.2, 2], [94.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [93.2, -1.5], [94.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.6, 'sorpreso'], [22.2, 'felice'],
    [27.4, 'neutro'], [35.4, 'neutro'], [40.2, 'felice'], [44.8, 'neutro'], [49.4, 'felice'], [55.4, 'neutro'], [60.0, 'pensa'],
    [65.0, 'neutro'], [69.6, 'felice'], [74.2, 'neutro'], [83.4, 'felice'], [88.4, 'neutro'], [95.8, 'felice'], [98.8, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Una pallina gira in tondo:\ne la sua ombra?'],
    [7.9, 12.7, 'Moto circolare uniforme: raggio\n2 m, un giro ogni {mink:T} = 4 s.'],
    [12.8, 17.4, 'Luce dall’alto: l’ombra cade su una\nriga lunga quanto il diametro.'],
    [17.6, 22.0, '{mink:x}, la posizione dell’ombra,\nva da −2 m a +2 m.'],
    [22.2, 27.2, 'È un {v:moto armonico}: la proiezione\ndi un moto circolare uniforme.'],
    [27.4, 31.2, '{mink:A} = 2 m è l’{v:ampiezza}:\nil massimo spostamento.'],
    [31.4, 35.2, '{mink:ω = 2π/T} ≈ 1,57 rad/s:\nla {v:pulsazione}.'],
    [35.4, 40.0, 'Una foto dell’ombra ogni 0,25 s,\nper mezzo giro.'],
    [40.2, 44.6, 'Al centro le foto sono {g:lontane}:\nl’ombra va veloce.'],
    [44.8, 49.2, 'Agli estremi sono {g:fitte}:\nrallenta fino a fermarsi.'],
    [49.4, 54.2, 'Fermo l’ombra al centro: velocità\n{g:massima}, {mink:ω·A} ≈ 3,14 m/s.'],
    [55.4, 59.9, 'Agli estremi la velocità è {g:zero}:\nl’ombra si ferma e torna indietro.'],
    [60.0, 64.8, 'L’accelerazione punta sempre\nverso il {v:centro} del diametro.'],
    [65.0, 68.4, 'Al centro è {g:zero}.'],
    [69.6, 74.0, 'Agli estremi è {g:massima}:\n{mink:ω²·A} ≈ 4,93 m/s².'],
    [74.2, 78.8, 'In formula {mv:a} = −{mink:ω²·x}:\nil meno la riporta al centro.'],
    [79.2, 83.2, 'La legge oraria è\n{mink:x = A·cos(ω·t)}.'],
    [83.4, 88.2, 'Sul grafico l’ampiezza {mink:A}\nè l’altezza delle onde…'],
    [88.4, 93.0, '…e un’onda intera dura\nun periodo, {mink:T} = 4 s.'],
    [95.8, 100.6, 'Il moto armonico è l’ombra\ndi un moto circolare uniforme.'],
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

  // ---------- il cerchio e la sua ombra ----------
  function scenaPalco(ctx, t) {
    if (t < 7.5 || t > 85.8) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 85.0, 85.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 740, 692);
    const f = fi(TR), pb = pallina(f), po = ombra(f);
    // il cerchio, che sbiadisce quando si guarda solo l'ombra
    const kc = 1 - .6 * life(t, 51.8, 85.0, .6, .6);
    ctx.save(); ctx.globalAlpha *= kc;
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O[0], O[1], A * PXM, 0, Math.PI * 2); ctx.stroke();
    dot(ctx, O, C.ink, 1, 6);
    ctx.restore();
    // la luce dall'alto
    const kl = P(t, 13.0, 13.6);
    if (kl > 0) {
      for (let i = 0; i < 5; i++) freccia(ctx, [580 + 80 * i, 114], [580 + 80 * i, 140], C.dim, .5 * kl, 3);
      dashed(ctx, [pb[0], pb[1] + 18], [po[0], YR - 14], C.dim, 1, .6 * kl * kc);
    }
    // la riga dell'ombra, in metri
    const kr = P(t, 12.9, 13.5);
    if (kr > 0) {
      ctx.save(); ctx.globalAlpha *= kr;
      ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(O[0] - 230, YR); ctx.lineTo(O[0] + 236, YR); ctx.stroke();
      ctx.lineWidth = 2;
      for (let m = -2; m <= 2; m++) {
        const x = O[0] + m * PXM;
        ctx.beginPath(); ctx.moveTo(x, YR - 8); ctx.lineTo(x, YR + 8); ctx.stroke();
        txt(ctx, m < 0 ? '−' + (-m) : m > 0 ? '+' + m : '0', x, YR + 70, { size: 30, color: C.dim });
      }
      txt(ctx, 'm', O[0] + 270, YR + 70, { size: 30, color: C.dim });
      arrowHead(ctx, [O[0] + 240, YR], 0, C.ink, .8);
      drawRich(ctx, '{mink:x}', O[0] + 262, YR - 4, { size: 40, alpha: P(t, 17.8, 18.3) });
      ctx.restore();
    }
    // le foto ogni 0,25 s
    const kf = 1 - P(t, 40.8, 41.3);
    if (t > FOTO && kf > 0) {
      ctx.save(); ctx.globalAlpha *= kf;
      for (let k = 0; k <= 8; k++) {
        if (t < FOTO + .25 * k) break;
        const fk = k * 22.5 * RAD;
        ctx.save(); ctx.globalAlpha *= .4; ball(ctx, ...pallina(fk), '', C.y, { r: 11 }); ctx.restore();
        ctx.save(); ctx.globalAlpha *= .5; ball(ctx, ...ombra(fk), '', C.y, { r: 11 }); ctx.restore();
      }
      // gli intervalli lunghi al centro, corti agli estremi
      const tratto = (k, kk) => {
        const a = ombra(k * 22.5 * RAD)[0], b = ombra((k + 1) * 22.5 * RAD)[0];
        ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(a, YR - 22); ctx.lineTo(a, YR - 32); ctx.lineTo(b, YR - 32); ctx.lineTo(b, YR - 22); ctx.stroke(); ctx.restore();
      };
      const k1 = life(t, 32.4, 36.7, .4, .3), k2 = life(t, 37.0, 41.2, .4, .3);
      if (k1 > 0) { tratto(3, k1); tratto(4, k1); }
      if (k2 > 0) { tratto(0, k2); tratto(7, k2); }
      ctx.restore();
    }
    // la velocità: della pallina (tangente) e dell'ombra (la sua parte orizzontale)
    const kv = life(t, 41.5, 52.0, .4, .4);
    if (kv > 0) {
      const vx = -WW * A * Math.sin(f), vy = WW * A * Math.cos(f);
      const pv = [pb[0] + 16 * Math.cos(f), pb[1] - 16 * Math.sin(f)];   // un poco verso l'esterno: non copre il tratteggio della proiezione
      freccia(ctx, pv, [pv[0] + vx * VS, pv[1] - vy * VS], C.x, .55 * kv * kc, 6);
      freccia(ctx, [po[0], YR - 34], [po[0] + vx * VS, YR - 34], C.x, kv);
      drawRich(ctx, '{mx:v}', po[0] + vx * VS + (vx < 0 ? -30 : 30), YR - 40, { size: 40, alpha: kv * clamp(Math.abs(vx) / .5) });
    }
    // l'accelerazione dell'ombra: a = −ω²·x
    const ka = life(t, 52.1, 71.0, .4, .4);
    if (ka > 0) {
      const ax = -WW * WW * xOmbra(TR);
      freccia(ctx, [po[0], YR + 30], [po[0] + ax * AS, YR + 30], C.v, ka);
      if (Math.abs(ax) > .4) drawRich(ctx, '{mv:a}', po[0] + ax * AS + (ax < 0 ? -30 : 30), YR + 30, { size: 40, alpha: ka });
    }
    ball(ctx, ...pb, '', C.y, { r: 16, scale: P(t, 8.0, 8.4, E.back), alpha: kc });
    ball(ctx, ...po, '', C.y, { r: 14, scale: P(t, 13.0, 13.4, E.back) });
    txt(ctx, 'fermo immagine', 1090, 162, { size: 30, color: C.dim, align: 'right', alpha: fermo(TR) && TR < 79 ? 1 : 0 });
    ctx.restore();
  }

  // ---------- il pannello ----------
  const PCX = 1490;
  function scenaPannello(ctx, t) {
    if (t < 8.4 || t > 85.8) return;
    const al = P(t, 8.4, 8.9) * (1 - P(t, 85.0, 85.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1140, 108, 700, 692);
    const tit = s => conFont(TITOLI, () => drawRich(ctx, s, PCX, 168, { size: 36, weight: 600 }));
    const riga = y => { ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, y); ctx.lineTo(1800, y); ctx.stroke(); };
    const voce = (nome, val, y, a) => { drawRich(ctx, nome.includes('{') ? nome : '{dim:' + nome + '}', 1180, y, { size: 30, align: 'left', alpha: a }); drawRich(ctx, val, 1800, y, { size: 36, align: 'right', alpha: a }); };
    // 1 · l'ombra e le foto
    const s1 = 1 - P(t, 41.0, 41.4);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('la pallina e la sua ombra');
      const kA = P(TR, 27.5, 28.0);   // il raggio diventa l'ampiezza (nel tempo vero: qui la scena aspetta)
      voce('raggio', '2 m', 240, 1 - kA);
      voce('ampiezza', '{mink:A} = 2 m', 240, kA);
      voce('periodo', '{mink:T} = 4 s', 295, 1);
      voce('pulsazione', '{mink:ω = 2π/T} ≈ 1,57 rad/s', 350, P(TR, 31.5, 32.0));
      ctx.save(); ctx.globalAlpha *= P(t, 17.6, 18.0); riga(392); ctx.restore();
      voce('{mink:x}{dim:, posizione dell’ombra}', '−2 m … +2 m', 435, P(t, 17.8, 18.3));
      drawRich(ctx, '{v:moto armonico}', PCX, 495, { size: 44, weight: 600, alpha: P(t, 22.4, 22.9), local: t - 22.4 });
      txt(ctx, 'proiezione di un moto circolare uniforme', PCX, 540, { size: 30, color: C.dim, alpha: P(t, 23.0, 23.5) });
      ctx.save(); ctx.globalAlpha *= P(t, 27.6, 28.0); riga(578); ctx.restore();
      txt(ctx, 'una foto ogni 0,25 s', PCX, 615, { size: 30, color: C.dim, alpha: P(t, 27.6, 28.1) });
      voce('al centro', '{g:veloce}', 672, P(t, 32.4, 32.9));
      voce('agli estremi', '{g:lenta, poi ferma}', 730, P(t, 37.0, 37.5));
      ctx.restore();
    }
    // 2 · velocità e accelerazione
    const s2 = life(t, 41.4, 71.0, .4, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('velocità e accelerazione');
      txt(ctx, 'velocità', 1180, 235, { size: 32, weight: 600, color: C.x, align: 'left' });
      voce('al centro', 'massima, {mink:ω·A} ≈ 3,14 m/s', 290, P(t, 41.6, 42.1));
      voce('agli estremi', '0 m/s', 345, P(t, 47.6, 48.1));
      ctx.save(); ctx.globalAlpha *= P(t, 52.0, 52.4); riga(395); ctx.restore();
      txt(ctx, 'accelerazione', 1180, 440, { size: 32, weight: 600, color: C.v, align: 'left', alpha: P(t, 52.1, 52.6) });
      txt(ctx, 'sempre verso il centro', 1800, 440, { size: 30, color: C.dim, align: 'right', alpha: P(t, 52.3, 52.8) });
      voce('al centro', '0 m/s²', 495, P(t, 57.2, 57.7));
      voce('agli estremi', 'massima', 550, P(t, 61.8, 62.3));
      drawRich(ctx, '{mink:ω²·A} ≈ 4,93 m/s²', 1800, 602, { size: 36, align: 'right', alpha: P(t, 62.0, 62.5) });
      drawRich(ctx, '{mv:a} = −{mink:ω²·x}', PCX, 675, { size: 52, alpha: P(t, 66.4, 66.9), local: t - 66.4 });
      txt(ctx, 'il segno meno: verso il centro', PCX, 745, { size: 30, color: C.dim, alpha: P(t, 67.2, 67.7) });
      ctx.restore();
    }
    // 3 · la legge oraria, disegnata nel tempo
    const s3 = P(t, 71.0, 71.4);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('la legge oraria');
      drawRich(ctx, '{mink:x = A·cos(ω·t)}', PCX, 250, { size: 52, local: t - 71.2 });
      const GX = 1215, GY = 470, TU = 66, XU = 52;                  // t: 66 px per s; x: 52 px per m
      const gS = (tt, x) => [GX + tt * TU, GY - x * XU];
      ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(GX, GY - 125); ctx.lineTo(GX, GY + 125); ctx.moveTo(GX, GY); ctx.lineTo(GX + 8.6 * TU, GY); ctx.stroke();
      arrowHead(ctx, [GX + 8.6 * TU + 6, GY], 0, C.ink); arrowHead(ctx, [GX, GY - 131], -Math.PI / 2, C.ink);
      ctx.lineWidth = 2;
      for (let s = 1; s <= 8; s++) { ctx.beginPath(); ctx.moveTo(gS(s, 0)[0], GY - 7); ctx.lineTo(gS(s, 0)[0], GY + 7); ctx.stroke(); }
      for (const s of [2, 4, 6, 8]) txt(ctx, String(s), gS(s, 0)[0], GY + 32, { size: 30, color: C.dim });
      for (const m of [2, -2]) { ctx.beginPath(); ctx.moveTo(GX - 8, gS(0, m)[1]); ctx.lineTo(GX, gS(0, m)[1]); ctx.stroke(); txt(ctx, m > 0 ? '2' : '−2', GX - 14, gS(0, m)[1], { size: 30, color: C.dim, align: 'right' }); }
      drawRich(ctx, '{mink:t} (s)', GX + 8.6 * TU - 10, GY - 34, { size: 30 });
      drawRich(ctx, '{mink:x} (m)', GX + 16, GY - 150, { size: 30, align: 'left' });
      const tt = clamp(corsa(TR) - corsa(T5), 0, 8);
      const pts = Array.from({ length: 161 }, (_, i) => gS(tt * i / 160, A * Math.cos(WW * tt * i / 160)));
      glowStroke(ctx, pts, 1, C.y, 4);
      ball(ctx, ...gS(tt, A * Math.cos(WW * tt)), '', C.y, { r: 10 });
      // ampiezza e periodo sul grafico
      const kAmp = P(t, 75.6, 76.1);
      if (kAmp > 0) {
        ctx.save(); ctx.globalAlpha *= kAmp; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gS(4, 0)[0], GY); ctx.lineTo(gS(4, 0)[0], gS(0, 1.85)[1]); ctx.stroke();
        arrowHead(ctx, [gS(4, 0)[0], gS(0, 2)[1] + 2], -Math.PI / 2, C.v, .8);
        ctx.restore();
        const [lx, ly] = [gS(4, 0)[0] + 26, gS(0, .55)[1]];   // l'etichetta su un fondino: la curva le passa vicino
        ctx.save(); ctx.globalAlpha *= kAmp; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(lx - 16, ly - 20, 32, 40, 8); ctx.fill(); ctx.restore();
        drawRich(ctx, '{mink:A}', lx, ly, { size: 36, alpha: kAmp });
      }
      const kT = P(t, 80.6, 81.1);
      if (kT > 0) {
        const y = gS(0, -2)[1] - 2;
        ctx.save(); ctx.globalAlpha *= kT; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gS(0, 0)[0] + 6, y + 28); ctx.lineTo(gS(4, 0)[0] - 6, y + 28); ctx.stroke();
        arrowHead(ctx, [gS(4, 0)[0], y + 28], 0, C.v, .7); arrowHead(ctx, [gS(0, 0)[0], y + 28], Math.PI, C.v, .7);
        ctx.restore();
        drawRich(ctx, '{mink:T} = 4 s', gS(2, 0)[0], y + 58, { size: 32, alpha: kT });
      }
      voce('ampiezza', '{mink:A} = 2 m', 690, P(t, 75.6, 76.1));
      voce('periodo', '{mink:T = 2π/ω} = 4 s', 745, P(t, 80.6, 81.1));
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'L’ombra del moto circolare', W / 2, 180, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 85.4) return;
    const al = 1 - P(t, 93.4, 94.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.6 });
      drawRich(ctx, 'Il moto armonico è la proiezione\ndi un moto circolare uniforme.', W / 2, 290, { size: 66, weight: 600, local: t - 86.0, stagger: .08 });
    });
    const pills = [[490, '{mink:x = A·cos(ω·t)}\n{mink:T = 2π/ω}'], [960, 'veloce al centro,\nferma agli estremi'], [1430, '{mv:a} = −{mink:ω²·x}\nsempre verso il centro']];
    pills.forEach(([x, s], i) => {
      const a = 87.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti nel tempo vero del video (la scena aspetta fra 27,4 e 35,4 s); i toni seguono la posizione x dell'ombra
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 8.0, .5],                                                // la pallina sul cerchio
    ['traccia', 12.9, 13.5], ['pop', 13.0, .4],                                       // la riga e l'ombra
    ['tono', 13.0, 17.0, [.76, .43, .14, .06, .24, .57, .86, .94, .76]],              // un giro: l'ombra va e torna
    ['pop', 17.8, .5], ['pop', 22.4, .6],                                             // x, moto armonico
    ['pop', 27.5, .5], ['pop', 31.5, .55],                                            // ampiezza, pulsazione
    ['pop', 36.4, .95], ['pop', 36.9, .82], ['pop', 37.4, .5], ['pop', 37.9, .18], ['pop', 38.4, .05],   // le foto ogni 0,25 s
    ['traccia', 40.4, 40.8], ['traccia', 45.0, 45.4],                                 // lontane al centro, fitte agli estremi
    ['ding', 49.6],                                                                   // al centro velocità massima
    ['tono', 54.4, 55.4, [.5, .33, .18, .09, .05]], ['pop', 55.6, .3],                // fino all'estremo: velocità zero
    ['pop', 60.1, .5],                                                                // l'accelerazione verso il centro
    ['tono', 60.0, 65.0, [.05, .18, .5, .82, .95, .82, .5, .18, .05, .18, .5]],       // l'ombra va e viene
    ['pop', 65.2, .3],                                                                // al centro è zero
    ['tono', 68.6, 69.6, [.5, .67, .82, .91, .95]], ['ding', 70.0],                   // all'estremo è massima
    ['pop', 74.4, .6],                                                                // a = meno omega quadro per x
    ['soffio', 79.0], ['pop', 79.2, .55],                                             // la legge oraria
    ['tono', 79.0, 83.0, [.95, .82, .5, .18, .05, .18, .5, .82, .95]],                // la curva si disegna: un periodo
    ['traccia', 83.6, 84.1], ['traccia', 88.6, 89.1],                                 // l'ampiezza, il periodo
    ['soffio', 93.6], ['pop', 95.2, .5], ['pop', 95.7, .6], ['pop', 96.2, .7],        // in una frase
  ];
  return {
    titolo: 'L’ombra del moto circolare', durata: 103, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.2, 'la pallina e la sua ombra'], [35.2, 49.2, 'veloce al centro'], [49.2, 59.8, 'la velocità'], [59.8, 78.8, 'l’accelerazione'], [78.8, 93.0, 'la legge oraria']],
    scena(ctx, t) { TR = t; const u = vecchio(t); scenaTitolo(ctx, u); scenaPalco(ctx, u); scenaPannello(ctx, u); scenaFine(ctx, u); },
  };
});
