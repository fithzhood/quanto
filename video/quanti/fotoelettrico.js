'use strict';
/* Il rosso non basta — l'effetto fotoelettrico. Una lastra di sodio (lavoro di estrazione W ≈ 2,3 eV, soglia
   f₀ = W/h = 5,56·10¹⁴ Hz, λ₀ ≈ 540 nm). Luce rossa a 700 nm fortissima (tanti fotoni da 1,77 eV): nessun elettrone;
   luce violetta a 400 nm debolissima (pochi fotoni da 3,10 eV): elettroni subito, con K = h·f − W = 0,80 eV.
   Einstein 1905: ogni fotone fa da solo (un fotone, un elettrone); l'intensità è il numero di fotoni al secondo.
   Il grafico finale: K contro f, retta di pendenza h (4,14·10⁻¹⁵ eV·s) che taglia l'asse in f₀; punti a 400, 450,
   500 nm (0,80 · 0,46 · 0,18 eV) e il rosso sull'asse. I fotoni viaggiano al rallentatore (700 px/s); gli elettroni
   emessi sono palline azzurre, tutte alla stessa velocità per la stessa luce. I colori della luce sono quelli veri
   (approssimazione di Bruton); il rosso del tema resta per le idee sbagliate. Argomento: quanti. */
CVIDEO.registra('quanti/fotoelettrico', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, glowStroke, dashed, dot, hole, crossMark, checkMark, richW } = M;
  const TAU = Math.PI * 2;

  // ---------- i numeri (SI) ----------
  const HP = 6.62607e-34, CL = 2.99792e8, EV = 1.602177e-19;
  const WJ = 2.3 * EV, F0 = WJ / HP;                                  // soglia del sodio: 5,56·10¹⁴ Hz
  const eFot = nm => HP * CL / (nm * 1e-9) / EV;                       // energia del fotone in eV
  const kEl = nm => eFot(nm) - 2.3;                                    // energia cinetica dell'elettrone, in eV

  const T_FINE = 95.4;
  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.8, 'felice'], [27.8, 'neutro'],
    [33.2, 'sorpreso'], [37.4, 'felice'], [42.2, 'neutro'], [49.2, 'felice'], [54.8, 'pensa'], [61.4, 'felice'],
    [68.0, 'neutro'], [75.0, 'felice'], [80.6, 'neutro'], [85.2, 'felice'], [90.2, 'festa'], [T_FINE, 'neutro'],
    [98.0, 'felice'], [102.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.8, 'Luce su un metallo: escono elettroni.\nMa non con ogni luce.'],
    [7.9, 13.0, 'Una lastra di {v:sodio}: gli elettroni\nstanno dentro, trattenuti dal metallo.'],
    [13.2, 18.6, 'Per strapparne uno serve un’energia\nminima: il {v:lavoro di estrazione}, {mink:W}.'],
    [18.8, 27.6, 'Per il sodio {mink:W} ≈ 2,3 {v:elettronvolt}:\n1 eV = 1,6·10⁻¹⁹ J.'],
    [27.8, 33.0, 'Accendo una luce rossa, fortissima.\n{r:Se l’energia si accumulasse}, basterebbe.'],
    [33.2, 37.2, 'Invece: {r:niente}. Nemmeno un elettrone,\nper quanto aspetti.'],
    [37.4, 42.0, 'Luce {v:violetta}, debolissima:\ngli elettroni escono {g:subito}.'],
    [42.2, 49.0, 'Einstein, 1905: la luce arriva a {v:fotoni},\npacchetti di energia {mink:E} = {mink:h}·{mink:f}.'],
    [49.2, 54.6, 'Ogni fotone {g:fa da solo}: colpisce un\nelettrone e gli dà tutta la sua energia.'],
    [54.8, 61.2, 'Fotone rosso: 1,8 eV, meno di 2,3.\nL’elettrone {r:resta dentro}.'],
    [61.4, 67.8, 'Fotone violetto: 3,1 eV. Basta,\ne avanzano {g:0,8 eV}.'],
    [68.0, 74.8, 'Esce con al massimo 0,8 eV di energia\ncinetica: {mink:K} = {mink:h}·{mink:f} − {mink:W}.'],
    [75.0, 80.4, 'Più intensa: più fotoni al secondo.\n{g:Più} elettroni, con la stessa energia.'],
    [80.6, 85.0, 'Energia degli elettroni contro\nfrequenza della luce, in un grafico.'],
    [85.2, 90.0, 'Sotto la {v:soglia} {mink:f₀} niente;\nsopra, una retta di pendenza {mink:h}.'],
    [90.2, 95.0, 'Soglia del sodio: nel verde. Il rosso\nsta sotto, il violetto sopra.'],
    [98.0, 103.2, 'Ogni fotone fa da solo: conta la sua\nfrequenza, non quanti sono.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al, size) {
    if (al <= 0) return;
    size = size || 32;
    const w = richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size: size, alpha: al });
  }
  function chipL(ctx, s, xs, y, al, size) {   // come chip, ma allineata a sinistra da xs
    chip(ctx, s, xs + (richW(ctx, s, size) + 22) / 2, y, al, size);
  }
  function colLuce(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
    const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
    const q = v => 255 * Math.pow(clamp(v * k), .8);
    return [q(r), q(g), q(b)];
  }
  const ROSSO = colLuce(700), VIOLA = colLuce(400);

  // ---------- l'esperimento (scheda di sinistra) ----------
  const CS = [120, 110, 1060, 690];
  const LAMP = [272, 470], PX = 880, VF = 700, VE = 240;             // lampada, lastra, velocità dei fotoni e degli elettroni (px/s, al rallentatore)
  // il copione dei fotoni: [istante di partenza, colore in nm, indice]; ognuno colpisce la lastra in un punto diverso
  const FOTONI = [];
  function serie(t0, t1, dt, nm) { for (let t = t0; t < t1 - 1e-6; t += dt) FOTONI.push({ t0: Math.round(t * 1000) / 1000, nm: nm, i: FOTONI.length }); }
  serie(28.0, 37.0, .08, 700);        // rosso fortissimo
  serie(37.6, 54.7, 1.5, 400);        // violetto debolissimo
  serie(56.2, 56.3, 1, 700);          // un solo fotone rosso (colpisce a 57,1)
  serie(63.0, 63.1, 1, 400);          // un solo fotone violetto (colpisce a 63,9)
  serie(66.0, 74.7, 2.0, 400);        // ancora pochi
  serie(75.2, 95.0, .25, 400);        // violetto più intenso
  const yHit = i => 280 + ((i * 7) % 9) * 50;
  function fotone(ctx, f, t, al) {
    const y1 = yHit(f.i), dx = PX - LAMP[0], dy = y1 - LAMP[1], L = Math.hypot(dx, dy), th = f.t0 + L / VF;
    const col = colLuce(f.nm);
    if (t < f.t0) return;
    if (t < th) {   // in volo: una pallina di luce con una codina ondulata
      const s = (t - f.t0) * VF, x = LAMP[0] + dx * s / L, y = LAMP[1] + dy * s / L, ux = dx / L, uy = dy / L;
      ctx.save(); ctx.globalAlpha *= al;
      ctx.strokeStyle = css(col, .7); ctx.lineWidth = 2.5; ctx.beginPath();
      const lam = f.nm === 700 ? 22 : 13;
      for (let k = 0; k <= 40; k += 2) { const a = 5 * Math.sin(TAU * k / lam), px = x - ux * k - uy * a, py = y - uy * k + ux * a; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
      ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
      ctx.restore();
      return;
    }
    const dt = t - th;
    if (f.nm === 700) {   // assorbito: un cerchietto che si spegne, niente altro
      if (dt < .4) { ctx.save(); ctx.globalAlpha *= al * (1 - dt / .4); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(PX, y1, 8 + 40 * dt, 0, TAU); ctx.stroke(); ctx.restore(); }
      return;
    }
    // violetto: esce un elettrone, tutti alla stessa velocità (stessa energia cinetica)
    if (dt < 2.0) {
      const a = (18 + (f.i % 3) * 14) * Math.PI / 180, ex = PX - 10 - Math.cos(a) * VE * dt, ey = y1 - Math.sin(a) * VE * dt;
      const k = al * (1 - P(dt, 1.6, 2.0)) * (dt < .15 ? 1.6 : 1);
      if (dt < .25) { ctx.save(); ctx.globalAlpha *= al * (1 - dt / .25); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(PX, y1, 8 + 40 * dt, 0, TAU); ctx.stroke(); ctx.restore(); }
      dot(ctx, [ex, ey], C.x, 1, 7 * Math.min(k, 1.3));
    }
  }
  const nmLuce = t => (t >= 28.0 && t < 37.3) || (t >= 56.0 && t < 61.3) ? 700 : t >= 37.6 ? 400 : 0;
  const etichetta = t => t < 27.9 ? '' : t < 37.3 ? 'fortissima' : t < 54.8 ? 'debolissima' : t < 75.1 ? 'un fotone alla volta' : 'più intensa';
  function scenaLastra(ctx, t) {
    if (t < 7.5 || t > T_FINE + .3) return;
    const al = P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, CS[0], CS[1], CS[2], CS[3]);
    // la lastra di sodio con gli elettroni dentro
    const kL = P(t, 7.7, 8.3);
    ctx.save(); ctx.globalAlpha *= kL;
    ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.fillRect(PX, 230, 34, 500);
    ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.strokeRect(PX, 230, 34, 500);
    for (let j = 0; j < 9; j++) dot(ctx, [PX + 17, 260 + j * 56], C.x, 1, 5);
    ctx.restore();
    chip(ctx, '{v:lastra di sodio}', PX + 17, 770, kL, 30);
    txt(ctx, 'elettroni trattenuti', PX + 17, 205, { size: 26, color: C.dim, alpha: life(t, 8.0, 27.6, .4, .4) });
    // il lavoro di estrazione: una freccia che vorrebbe uscire, e il muro
    const kW = life(t, 13.3, 27.6, .4, .4);
    if (kW > 0) {
      ctx.save(); ctx.globalAlpha *= kW;
      ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(PX - 14, 300); ctx.lineTo(PX - 14, 660); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      chip(ctx, 'per uscire: {mink:W} ≈ 2,3 eV', PX - 110, 250, kW * P(t, 18.9, 19.4), 30);
    }
    // la lampada
    const nm = nmLuce(t), kLamp = P(t, 27.8, 28.3);
    if (kLamp > 0) {
      const col = nm ? colLuce(nm) : C.dim;
      ctx.save(); ctx.globalAlpha *= kLamp;
      const g = ctx.createRadialGradient(LAMP[0], LAMP[1], 10, LAMP[0], LAMP[1], 90);
      g.addColorStop(0, css(col, .45)); g.addColorStop(1, css(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(LAMP[0], LAMP[1], 90, 0, TAU); ctx.fill();
      ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(LAMP[0], LAMP[1], 28, 0, TAU); ctx.fill();
      ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = css(C.ink, .7); ctx.fillRect(LAMP[0] - 16, LAMP[1] + 28, 32, 22);
      ctx.restore();
      txt(ctx, nm === 700 ? 'luce rossa, 700 nm' : 'luce violetta, 400 nm', LAMP[0], LAMP[1] + 84, { size: 28, color: C.dim, alpha: kLamp });
      txt(ctx, etichetta(t), LAMP[0], LAMP[1] + 120, { size: 28, color: C.ink, alpha: kLamp });
      txt(ctx, 'al rallentatore', 1100, 150, { size: 26, color: C.dim, align: 'right', alpha: kLamp });
    }
    // i fotoni e gli elettroni
    ctx.save(); ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
    for (const f of FOTONI) { if (t >= f.t0 && t < f.t0 + 4) fotone(ctx, f, t, 1); }
    ctx.restore();
    // le etichette dei due fotoni da soli
    const f1 = FOTONI.find(f => f.t0 === 56.2), f2 = FOTONI.find(f => f.t0 === 63);
    const th1 = f1.t0 + Math.hypot(PX - LAMP[0], yHit(f1.i) - LAMP[1]) / VF, th2 = f2.t0 + Math.hypot(PX - LAMP[0], yHit(f2.i) - LAMP[1]) / VF;
    // sotto il punto colpito: l'elettrone, se esce, va in alto a sinistra
    chip(ctx, '{r:1,8 eV < 2,3 eV: resta dentro}', PX - 230, yHit(f1.i) + 60, life(t, th1, 61.2, .3, .4), 30);
    chip(ctx, '{g:3,1 eV: esce con 0,8 eV}', PX - 230, yHit(f2.i) + 60, life(t, th2, 67.8, .3, .4), 30);
    ctx.restore();
  }

  // ---------- la scheda di destra ----------
  const RC = [1230, 110, 580, 690], CX = 1520;
  function scenaDestra(ctx, t) {
    if (t < 7.6 || t > T_FINE + .3) return;
    const al = P(t, 7.6, 8.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, RC[0], RC[1], RC[2], RC[3]);
    // 1 · il sodio e il lavoro di estrazione
    const k1 = 1 - P(t, 27.6, 28.1);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      conFont(TITOLI, () => drawRich(ctx, 'il sodio', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{dim:un metallo: gli elettroni}\n{dim:stanno dentro, trattenuti}', CX, 250, { size: 30, lh: 1.3, local: t - 8.0 });
      drawRich(ctx, '{v:lavoro di estrazione} {mink:W}', CX, 360, { size: 34, local: t - 13.4 });
      drawRich(ctx, '{dim:l’energia minima per strappare}\n{dim:un elettrone}', CX, 430, { size: 28, lh: 1.3, local: t - 14.0 });
      drawRich(ctx, '{mink:W} ≈ 2,3 eV', CX, 530, { size: 48, local: t - 19.0 });
      drawRich(ctx, '{v:1 eV} = {mink:1,6·10⁻¹⁹} J', CX, 620, { size: 36, local: t - 22.6 });
      drawRich(ctx, '{dim:l’elettronvolt: l’unità su misura}\n{dim:per le energie di un elettrone}', CX, 700, { size: 26, lh: 1.3, local: t - 23.2 });
      ctx.restore();
    }
    // 2 · l'esperimento
    const k2 = life(t, 27.8, 42.3, .5, .4);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      conFont(TITOLI, () => drawRich(ctx, 'che cosa succede', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, 'luce rossa, {v:fortissima}', 1280, 260, { size: 32, align: 'left', local: t - 28.0 });
      drawRich(ctx, '{r:se l’energia si accumulasse:}\n{r:prima o poi basterebbe}', 1280, 330, { size: 28, align: 'left', lh: 1.3, local: t - 29.4, alpha: 1 - P(t, 33.2, 33.6) });
      const kN = P(t, 33.3, 33.8);
      if (kN > 0) {
        drawRich(ctx, '{r:nessun elettrone}', 1280, 320, { size: 34, align: 'left', alpha: kN });
        drawRich(ctx, '{dim:per quanto si aspetti}', 1280, 365, { size: 28, align: 'left', alpha: kN });
        crossMark(ctx, 1740, 320, P(t, 33.4, 34.2), C.r, .7);
      }
      drawRich(ctx, 'luce violetta, {v:debolissima}', 1280, 470, { size: 32, align: 'left', local: t - 37.5 });
      drawRich(ctx, '{g:elettroni subito}', 1280, 530, { size: 34, align: 'left', local: t - 38.6 });
      checkMark(ctx, 1740, 530, P(t, 38.8, 39.6), C.g, .7);
      drawRich(ctx, '{dim:conta il colore, non quanta luce}', CX, 660, { size: 30, local: t - 40.0 });
      ctx.restore();
    }
    // 3 · Einstein: i fotoni
    const k3 = life(t, 42.3, 80.7, .5, .4);
    if (k3 > 0) {
      ctx.save(); ctx.globalAlpha *= k3;
      conFont(TITOLI, () => drawRich(ctx, 'Einstein, 1905', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{dim:la luce arriva a} {v:fotoni}{dim:, pacchetti}', CX, 222, { size: 28, local: t - 42.6 });
      drawRich(ctx, '{mink:E} = {mink:h}·{mink:f}', CX, 290, { size: 56, local: t - 43.4 });
      drawRich(ctx, '{dim:con} {mink:f} {dim:la frequenza}', CX, 342, { size: 28, local: t - 44.6 });
      drawRich(ctx, '{dim:e} {mink:h} ≈ {mink:6,63·10⁻³⁴} J·s', CX, 380, { size: 28, local: t - 45.2 });
      drawRich(ctx, '{g:un fotone, un elettrone}', CX, 436, { size: 34, local: t - 49.4 });
      drawRich(ctx, '{dim:rosso, 700 nm:} 1,8 eV {r:< 2,3 eV}', CX, 494, { size: 32, local: t - 55.0 });
      drawRich(ctx, '{dim:violetto, 400 nm:} 3,1 eV {g:= 2,3 + 0,8}', CX, 550, { size: 32, local: t - 61.6 });
      drawRich(ctx, '{mink:K} = {mink:h}·{mink:f} − {mink:W}', CX, 620, { size: 48, local: t - 68.2 });
      drawRich(ctx, '{dim:energia cinetica massima dell’elettrone}', CX, 670, { size: 26, local: t - 68.8 });
      drawRich(ctx, '{dim:intensità =} {v:fotoni al secondo}', CX, 740, { size: 30, local: t - 75.2 });
      ctx.restore();
    }
    // 4 · il grafico K contro f
    const k4 = P(t, 80.7, 81.2);
    if (k4 > 0) {
      ctx.save(); ctx.globalAlpha *= k4;
      conFont(TITOLI, () => drawRich(ctx, 'energia contro frequenza', CX, 165, { size: 38, weight: 600, local: t - 80.8 }));
      const OX = 1320, OY = 660, SF = 52.5 / 1e14, SK = 360;          // f da 0 a 8·10¹⁴ Hz, K da 0 a 1 eV
      const xf = f => OX + f * SF, yk = k => OY - k * SK;
      const kA = P(t, 81.0, 82.0);
      ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(lerp(OX, 1770, kA), OY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX, lerp(OY, 230, kA)); ctx.stroke();
      if (kA > .95) { arrowHead(ctx, [1772, OY], 0, C.ink, .8); arrowHead(ctx, [OX, 228], -Math.PI / 2, C.ink, .8); }
      drawRich(ctx, '{mink:f}', 1790, OY - 30, { size: 36, alpha: kA });
      drawRich(ctx, '{mink:K}', OX + 30, 240, { size: 36, alpha: kA });
      txt(ctx, 'frequenza, in 10¹⁴ Hz', 1560, OY + 74, { size: 24, color: C.dim, alpha: kA });
      for (let i = 2; i <= 8; i += 2) { const x = xf(i * 1e14); ctx.beginPath(); ctx.moveTo(x, OY - 6); ctx.lineTo(x, OY + 6); ctx.stroke(); txt(ctx, String(i), x, OY + 32, { size: 24, color: C.dim, alpha: kA }); }
      [[.5, '0,5 eV'], [1, '1 eV']].forEach(([k, s]) => { const y = yk(k); ctx.beginPath(); ctx.moveTo(OX - 6, y); ctx.lineTo(OX + 6, y); ctx.stroke(); txt(ctx, s, OX - 14, y, { size: 24, color: C.dim, align: 'right', alpha: kA }); });
      // la retta K = h·f − W, da f₀ in su
      const kR = P(t, 85.3, 86.8), fMax = 8.2e14;
      if (kR > 0) glowStroke(ctx, [[xf(F0), OY], [xf(fMax), yk((HP * fMax / EV) - 2.3)]], kR, C.g, 5);
      const kP = P(t, 86.8, 87.4);
      if (kP > 0) {
        [400, 450, 500].forEach(nm => { const f = CL / (nm * 1e-9); dot(ctx, [xf(f), yk(kEl(nm))], colLuce(nm), kP, 9); });
        hole(ctx, [xf(CL / 700e-9), OY], colLuce(700), kP, 9);
      }
      const kS = P(t, 85.3, 85.8);
      if (kS > 0) {
        // a destra dell'asse K e a sinistra della retta: f₀ in cima al tratteggio, il valore in alto
        dashed(ctx, [xf(F0), OY + 2], [xf(F0), OY - 115], C.v, 1, .8 * kS);
        chip(ctx, '{mink:f₀}', xf(F0), OY - 140, kS, 30);
        chipL(ctx, '{v:soglia} {mink:f₀} ≈ {mink:5,6·10¹⁴} Hz', 1348, 300, kS, 28);
        chip(ctx, 'pendenza {mink:h}', 1690, 222, P(t, 87.5, 88.0), 28);          // sopra la cima della retta
      }
      const kV = P(t, 90.3, 90.8);
      if (kV > 0) {
        chipL(ctx, '{mink:λ₀} ≈ 540 nm, verde', 1348, 352, kV, 28);
        chipL(ctx, '{dim:sotto:} niente', 1348, 612, kV, 28);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il rosso non basta', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < T_FINE - .1) return;
    const al = 1 - P(t, 103.6, 104.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
      drawRich(ctx, 'Ogni fotone agisce da solo: conta\nla sua frequenza, non quanti sono.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
    });
    const pills = [[450, '{mink:E} = {mink:h}·{mink:f}\n{dim:l’energia di un fotone}'], [960, '{mink:K} = {mink:h}·{mink:f} − {mink:W}\n{dim:l’elettrone che esce}'], [1470, 'intensità:\n{dim:quanti fotoni al secondo}']];
    pills.forEach(([x, s], i) => {
      const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 240, 445, 480, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 7.7, .45],                                               // la lastra di sodio
    ['traccia', 13.3, 13.7], ['pop', 18.9, .55], ['pop', 22.6, .45],                  // il muro, W ≈ 2,3 eV, l'elettronvolt
    ['pop', 27.8, .2], ['tono', 28.0, 29.0, [.2, .22, .2]],                           // luce rossa fortissima
    ['pop', 33.4, .1],                                                                // nessun elettrone
    ['pop', 37.6, .8], ['pop', 38.5, .75],                                            // luce violetta, il primo fotone
    ['tono', 38.5, 40.1, [.17, .27, .37, .47, .57]], ['ding', 38.9],                  // l'elettrone esce subito
    ['pop', 43.4, .6], ['pop', 49.4, .5],                                             // E = h·f, un fotone un elettrone
    ['pop', 57.1, .15],                                                               // il fotone rosso resta dentro
    ['pop', 63.9, .8], ['tono', 63.9, 65.5, [.75, .79, .83, .87, .92]], ['ding', 64.2],   // il violetto: esce con 0,8 eV
    ['pop', 68.2, .6],                                                                // K = h·f − W
    ['pop', 75.2, .7], ['pop', 76.1, .5], ['pop', 76.3, .6], ['pop', 76.6, .7],       // più intensa: più elettroni
    ['soffio', 80.7], ['traccia', 81.0, 82.0],                                        // il grafico
    ['pop', 85.3, .4], ['traccia', 85.3, 86.8], ['tono', 85.3, 86.8, [.1, .15, .5, .85, .9]],   // f0, la retta sale
    ['pop', 86.8, .6], ['pop', 87.5, .5],                                             // i punti, la pendenza h
    ['pop', 90.3, .45],                                                               // λ0 ≈ 540 nm
    ['soffio', 95.4], ['pop', 97.6, .5], ['pop', 98.1, .6], ['pop', 98.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il rosso non basta', durata: 105, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.6, 'il lavoro di estrazione'], [27.6, 42.0, 'rosso forte, violetto debole'], [42.0, 80.4, 'i fotoni di Einstein'], [80.4, T_FINE, 'la soglia']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaLastra(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
