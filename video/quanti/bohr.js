'use strict';
/* Le righe dell'idrogeno — il modello di Bohr. La luce di una lampada a idrogeno, scomposta, dà solo quattro righe nel
   visibile (serie di Balmer: 656, 486, 434, 410 nm). Bohr 1913: l'elettrone sta solo su orbite permesse n = 1, 2, 3…
   (raggi in scala, r ∝ n², a₀ = 6 px) con energia Eₙ = −13,6 eV/n²; saltando da n a 2 emette un fotone con
   h·f = Eₙ − E₂: 3→2 1,89 eV → 656,4 nm; 4→2 2,55 eV → 486,2 nm; 5→2 2,86 eV → 434,1 nm; 6→2 3,02 eV → 410,2 nm
   (λ = h·c/E calcolata nel codice con h = 6,626·10⁻³⁴ J·s, c = 2,998·10⁸ m/s, 1 eV = 1,602·10⁻¹⁹ J).
   L'elettrone gira con ω ∝ 1/n³ come nel modello (periodo 2 s su n = 3, al rallentatore); fra un salto e l'altro la
   scarica elettrica lo rimanda su (detto nella scheda). Si dice che è un modello: i livelli e le righe sono veri.
   Colori delle righe: quelli veri (approssimazione di Bruton). Argomento: quanti. */
CVIDEO.registra('quanti/bohr', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dot, dashed, richW } = M;
  const TAU = Math.PI * 2;

  // ---------- i numeri ----------
  const HP = 6.62607e-34, CL = 2.99792e8, EV = 1.602177e-19;
  const En = n => -13.6 / (n * n);                                     // eV
  const dE = n => En(n) - En(2);                                       // eV del fotone n → 2
  const lamNm = n => HP * CL / (dE(n) * EV) * 1e9;                     // 656,4 · 486,2 · 434,1 · 410,2
  const RIGHE = [3, 4, 5, 6].map(n => ({ n: n, nm: lamNm(n), eV: dE(n) }));

  const T_FINE = 94.0;
  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.2, 'sorpreso'], [17.6, 'pensa'],
    [22.4, 'neutro'], [28.2, 'felice'], [34.2, 'neutro'], [41.8, 'pensa'], [48.8, 'neutro'], [53.2, 'felice'],
    [58.2, 'neutro'], [65.4, 'festa'], [71.6, 'felice'], [78.2, 'neutro'], [82.8, 'festa'], [88.4, 'neutro'],
    [96.6, 'felice'], [100.4, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.8, 'Una lampada a {v:idrogeno} fa luce\ndi quattro colori soli. Perché?'],
    [7.9, 13.0, 'Scompongo la sua luce: non è un\narcobaleno continuo come quello del Sole.'],
    [13.2, 17.4, 'Solo quattro {g:righe}: una rossa, una\nazzurra e due violette.'],
    [17.6, 22.2, 'Sono le righe di {v:Balmer}, misurate\nnell’Ottocento. Da dove vengono?'],
    [22.4, 28.0, 'Bohr, 1913: un {v:modello}. L’elettrone\ngira attorno al protone, ma…'],
    [28.2, 34.0, '…non su qualunque orbita: solo su\ncerte orbite {v:permesse}, {mink:n} = 1, 2, 3…'],
    [34.2, 41.6, 'Su ogni orbita l’energia è fissa:\n{mink:Eₙ} = −13,6 eV / {mink:n}².'],
    [41.8, 48.6, 'Negativa: l’elettrone è {v:legato},\nci vuole energia per staccarlo.'],
    [48.8, 53.0, 'A destra i {g:livelli} di energia:\nsempre più vicini salendo.'],
    [53.2, 58.0, 'Finché sta su un’orbita non emette\nniente. Ma può {v:saltare} giù.'],
    [58.2, 65.2, 'Da 3 a 2 perde 1,9 eV: li emette tutti\nin un {g:fotone} di energia {mink:h}·{mink:f}.'],
    [65.4, 71.4, 'Dall’energia viene {mink:f}, da {mink:f} la {mink:λ}:\n656 nm, la riga rossa!'],
    [71.6, 78.0, 'Da 4 a 2: 2,6 eV, la riga {g:azzurra}\na 486 nm.'],
    [78.2, 82.6, 'Da 5 e da 6 a 2:\nle due righe violette.'],
    [82.8, 88.2, 'Quattro salti che finiscono su {mink:n} = 2:\nle righe di Balmer, {g:tutte giuste}.'],
    [88.4, 93.7, 'Orbite e palline sono un {v:modello}:\nma i livelli e le righe sono quelli veri.'],
    [96.6, 101.8, 'L’elettrone sta solo su certi livelli:\nogni salto in giù è una riga di colore.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al, size) {
    if (al <= 0) return;
    size = size || 32;
    const w = richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size: size, alpha: al });
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
  const fmt1 = v => (Math.round(v * 10 + 1e-9) / 10).toFixed(1).replace('.', ',');   // 2,55 → 2,6; 3,02 → 3,0
  const fmt2 = v => v.toFixed(2).replace('.', ',');

  // ---------- il copione dell'elettrone: orbite e salti ----------
  // [istante, orbita]: sale (la scarica lo rimanda su) o scende (salto con fotone, segnato con giù: true)
  const SALTI = [
    { t: 60.0, da: 3, a: 2 }, { t: 73.0, da: 4, a: 2 }, { t: 78.9, da: 5, a: 2 }, { t: 80.6, da: 6, a: 2 },
  ];
  const SU = [[72.0, 4], [78.4, 5], [80.1, 6]];                      // la scarica lo rimanda su (compare sull'orbita)
  const T0 = 22.4, A0 = 6, CXA = 640, CYA = 390, DJ = .5;             // raggio di Bohr in px; centro dell'atomo; durata del salto
  const rN = n => A0 * n * n;
  const ORB_R = { 3: 75, 4: 123, 5: 183, 6: 236 };                     // dove stanno le etichette delle orbite (px dal centro)
  const OM3 = Math.PI, omega = n => OM3 * 27 / (n * n * n);           // periodo 2 s su n = 3, ω ∝ 1/n³
  // segmenti [inizio, orbita] in ordine di tempo
  const SEG = [[T0, 3]];
  SU.forEach(([t, n]) => SEG.push([t, n]));
  SALTI.forEach(s => SEG.push([s.t, s.a]));
  SEG.sort((a, b) => a[0] - b[0]);
  function orbita(t) { let n = 3; for (const [ts, nn] of SEG) if (t >= ts) n = nn; return n; }
  function angolo(t) {
    let th = 1.1;
    for (let i = 0; i < SEG.length; i++) {
      const a = SEG[i][0], b = i + 1 < SEG.length ? SEG[i + 1][0] : 1e9;
      if (t <= a) break;
      th += omega(SEG[i][1]) * (Math.min(t, b) - a);
    }
    return th;
  }
  function raggio(t) {
    for (const s of SALTI) if (t >= s.t && t < s.t + DJ) return lerp(rN(s.da), rN(s.a), P(t, s.t, s.t + DJ, E.io));
    for (const [ts, n] of SU) if (t >= ts && t < ts + .4) return lerp(rN(2), rN(n), P(t, ts, ts + .4, E.io));   // la scarica lo rimanda su
    return rN(orbita(t));
  }
  const elettroneAlpha = t => P(t, T0 + .2, T0 + .7);

  // ---------- la scheda di sinistra: la lampada, lo spettro, l'atomo ----------
  const CS = [120, 110, 1060, 690];
  const SX0 = 300, SX1 = 1080, SY0 = 670, SY1 = 730;                 // la striscia dell'idrogeno: 400 nm a sinistra, 700 a destra
  const sx = nm => lerp(SX0, SX1, (nm - 400) / 300);
  function striscia(ctx, y0, y1, al, continua) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    if (continua) { for (let x = SX0; x < SX1; x += 2) { const nm = 400 + 300 * (x - SX0) / (SX1 - SX0); ctx.fillStyle = css(colLuce(nm)); ctx.fillRect(x, y0, 2.6, y1 - y0); } }
    else { ctx.fillStyle = css([20, 22, 30]); ctx.fillRect(SX0, y0, SX1 - SX0, y1 - y0); }
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(SX0, y0, SX1 - SX0, y1 - y0);
    ctx.restore();
  }
  function riga(ctx, nm, y0, y1, al, forza) {
    if (al <= 0) return;
    const col = colLuce(nm), x = sx(nm), w = 3 + 5 * forza;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.shadowColor = css(col); ctx.shadowBlur = 10 + 24 * forza;
    ctx.fillStyle = css(col); ctx.fillRect(x - w / 2, y0 + 2, w, y1 - y0 - 4);
    ctx.restore();
  }
  function fotoneOut(ctx, s, t) {
    const dt = t - s.t;
    if (dt < 0 || dt > 1.3) return;
    const th = angolo(s.t), r0 = rN(s.da), col = colLuce(lamNm(s.da));
    const x = CXA + Math.cos(th) * (r0 + 330 * dt), y = CYA + Math.sin(th) * (r0 + 330 * dt), ux = Math.cos(th), uy = Math.sin(th);
    ctx.save(); ctx.globalAlpha *= 1 - P(dt, 1.0, 1.3);
    ctx.strokeStyle = css(col, .75); ctx.lineWidth = 2.5; ctx.beginPath();
    for (let k = 0; k <= 40; k += 2) { const a = 5 * Math.sin(TAU * k / 14), px = x - ux * k - uy * a, py = y - uy * k + ux * a; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.stroke();
    ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function scenaSinistra(ctx, t) {
    if (t < 7.5 || t > T_FINE + .3) return;
    const al = P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, CS[0], CS[1], CS[2], CS[3]);
    // 1 · la lampada e il confronto col Sole (solo nel primo capitolo)
    const k1 = life(t, 7.7, 22.4, .5, .5);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      const g = ctx.createLinearGradient(0, 170, 0, 230);
      g.addColorStop(0, css([255, 190, 205])); g.addColorStop(.5, css([255, 120, 150])); g.addColorStop(1, css([255, 190, 205]));
      ctx.shadowColor = css([255, 120, 150]); ctx.shadowBlur = 30;
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(420, 170, 440, 60, 30); ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.strokeStyle = css(C.ink, .4); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = css(C.ink, .6); ctx.fillRect(380, 186, 40, 28); ctx.fillRect(860, 186, 40, 28);
      ctx.restore();
      txt(ctx, 'lampada a idrogeno', 640, 275, { size: 28, color: C.dim, alpha: k1 });
      const kS = life(t, 8.0, 22.4, .5, .4);
      txt(ctx, 'la luce del Sole, per confronto: tutti i colori', 640, 400, { size: 28, color: C.dim, alpha: kS });
      striscia(ctx, 430, 490, kS, true);
      ctx.save(); ctx.globalAlpha *= kS;
      for (const nm of [400, 500, 600, 700]) txt(ctx, nm + ' nm', sx(nm), 520, { size: 24, color: C.dim });
      ctx.restore();
    }
    // la striscia dell'idrogeno: sempre, con le quattro righe
    const kI = P(t, 8.4, 9.0);
    txt(ctx, 'idrogeno', 262, 700, { size: 26, color: C.v, align: 'right', alpha: kI });
    striscia(ctx, SY0, SY1, kI, false);
    RIGHE.forEach((r, i) => {
      const k = P(t, 13.4 + i * .45, 13.8 + i * .45);
      let forza = 0;
      for (const s of SALTI) if (s.da === r.n) forza = Math.max(forza, life(t, s.t + .9, s.t + 2.4, .2, .6));
      riga(ctx, r.nm, SY0, SY1, k, forza);
      txt(ctx, String(Math.round(r.nm)), sx(r.nm), 758, { size: 24, color: C.dim, alpha: k });
      // quando il salto emette il suo fotone, sopra la riga compare la sua energia (le due violette sfalsate)
      const s = SALTI[i];
      chip(ctx, fmt1(r.eV) + ' eV', sx(r.nm), r.n === 6 ? 612 : 642, P(t, s.t + .9, s.t + 1.3), 22);
    });
    txt(ctx, 'nm', 1100, 758, { size: 24, color: C.dim, align: 'left', alpha: P(t, 13.4, 13.8) });
    chip(ctx, '{v:righe di Balmer, 1885}', 860, 630, life(t, 17.7, 22.4, .4, .4), 28);
    // 2 · l'atomo di Bohr
    const kA = P(t, 22.5, 23.1);
    if (kA > 0) {
      ctx.save(); ctx.globalAlpha *= kA;
      // le orbite permesse, dalla più piccola
      for (let n = 1; n <= 6; n++) {
        const k = n === 3 ? P(t, 22.6, 23.2) : P(t, 28.3 + n * .22, 28.7 + n * .22);
        if (k <= 0) continue;
        ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.dim, .75); ctx.lineWidth = 2; ctx.setLineDash([6, 7]);
        ctx.beginPath(); ctx.arc(CXA, CYA, rN(n), 0, TAU); ctx.stroke(); ctx.restore();
        // 3…6 sulla verticale verso l'alto, nello spazio fra un'orbita e la successiva (lì non passa nessun salto:
        // i salti e i fotoni partono a 351°, 157°, 217°, 237°); il 2 non ci sta fra 2 e 3: a 40° (in basso a destra) con una lineetta
        const ka = k * P(t, 29.2, 29.8);
        if (n >= 3) chip(ctx, '{dim:' + n + '}', CXA, CYA - ORB_R[n], ka, n === 3 ? 24 : 26);
        if (n === 2 && ka > 0) {
          const ph = 40 * Math.PI / 180, c = Math.cos(ph), sn = Math.sin(ph);
          ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(CXA + c * 27, CYA + sn * 27); ctx.lineTo(CXA + c * 62, CYA + sn * 62); ctx.stroke(); ctx.restore();
          chip(ctx, '{dim:2}', CXA + c * 76, CYA + sn * 76, ka, 24);
        }
      }
      drawRich(ctx, '{mink:n}{dim:: numero dell’orbita}', 880, 410, { size: 28, align: 'left', alpha: P(t, 29.4, 30.0) });
      drawRich(ctx, '{dim:raggio} {mink:r} ∝ {mink:n}²', 880, 456, { size: 28, align: 'left', alpha: P(t, 30.2, 30.8) });
      // il protone
      dot(ctx, [CXA, CYA], C.v, 1, 10);
      txt(ctx, '+', CXA, CYA + 1, { size: 20, weight: 600, color: C.paper });
      // l'elettrone
      const th = angolo(t), r = raggio(t), ea = elettroneAlpha(t);
      if (ea > 0) dot(ctx, [CXA + Math.cos(th) * r, CYA + Math.sin(th) * r], C.x, ea, 8);
      chip(ctx, '{x:elettrone}', CXA - 150, CYA + 230, life(t, 22.8, 28.0, .4, .4), 28);
      // a sinistra dell'atomo, fuori dalle orbite e dalla strada dei fotoni
      drawRich(ctx, '{dim:la scarica elettrica}\n{dim:lo rimanda su}', 272, 372, { size: 28, lh: 1.3, alpha: SU.reduce((m, [ts]) => Math.max(m, life(t, ts, ts + 1.6, .2, .4)), 0) });
      // i fotoni che escono
      SALTI.forEach(s => fotoneOut(ctx, s, t));
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- la scheda di destra: il modello, poi i livelli ----------
  const RC = [1230, 110, 580, 690], CX = 1520;
  const yE = e => 215 + (-e) * 135;                                   // da 0 (y 215) a −3,4 (y 674); n = 1 sotto l'asse spezzato
  const Y1 = 740, AX = 1362, LX0 = 1384, LX1 = 1620;                 // AX: l'asse; le etichette n a sinistra
  function scenaDestra(ctx, t) {
    if (t < 22.3 || t > T_FINE + .3) return;
    const al = P(t, 22.3, 22.9) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, RC[0], RC[1], RC[2], RC[3]);
    const k1 = 1 - P(t, 48.6, 49.1);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      conFont(TITOLI, () => drawRich(ctx, 'il modello di Bohr', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{dim:1913: un} {v:modello} {dim:dell’atomo}', CX, 222, { size: 28, local: t - 22.6 });
      drawRich(ctx, '{dim:l’elettrone gira attorno al protone}', CX, 268, { size: 28, local: t - 23.4 });
      drawRich(ctx, '{dim:solo su} orbite permesse{dim:,}', CX, 340, { size: 32, local: t - 28.4 });
      drawRich(ctx, '{mink:n} = 1, 2, 3…', CX, 390, { size: 40, local: t - 29.2 });
      drawRich(ctx, '{dim:con energia}', CX, 455, { size: 28, local: t - 34.4 });
      drawRich(ctx, '{mink:Eₙ} = −13,6 eV / {mink:n}²', CX, 515, { size: 46, local: t - 34.8 });
      drawRich(ctx, '1 eV = {mink:1,6·10⁻¹⁹} J', CX, 585, { size: 34, local: t - 35.8 });
      drawRich(ctx, '{dim:(l’elettronvolt)}', CX, 628, { size: 28, local: t - 36.4 });
      drawRich(ctx, '{dim:negativa:} {v:legato} {dim:al protone}', CX, 705, { size: 30, local: t - 42.0 });
      ctx.restore();
    }
    const k2 = P(t, 49.1, 49.6);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      conFont(TITOLI, () => drawRich(ctx, 'i livelli: {mink:Eₙ} = −13,6 eV / {mink:n}²', CX, 160, { size: 34, weight: 600 }));
      // l'asse delle energie, spezzato prima di n = 1
      const kL = P(t, 49.2, 50.4);
      ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(AX, yE(0) - 10); ctx.lineTo(AX, lerp(yE(0) - 10, 700, kL)); ctx.stroke();
      if (kL > .9) {
        ctx.beginPath(); ctx.moveTo(AX - 8, 700); ctx.lineTo(AX + 8, 712); ctx.moveTo(AX - 8, 712); ctx.lineTo(AX + 8, 724); ctx.stroke();   // la spezzatura
        ctx.beginPath(); ctx.moveTo(AX, 724); ctx.lineTo(AX, Y1 + 10); ctx.stroke();
      }
      txt(ctx, '0 eV', AX - 12, yE(0), { size: 28, color: C.dim, align: 'right', alpha: kL });
      // i livelli (6 e 5 sono vicini: le loro scritte si allargano un po' in su e in giù)
      const LIV = [[6, -14], [5, 10], [4, 4], [3, 0], [2, 0]];
      LIV.forEach(([n, dy], i) => {
        const k = P(t, 49.4 + i * .18, 49.9 + i * .18), y = yE(En(n));
        if (k <= 0) return;
        ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(LX0, y); ctx.lineTo(lerp(LX0, LX1, k), y); ctx.stroke(); ctx.restore();
        drawRich(ctx, '{mink:n} = ' + n, AX - 12, y + dy, { size: 28, align: 'right', alpha: k });
        txt(ctx, fmt2(En(n)).replace(/0$/, '').replace('-', '−') + ' eV', LX1 + 12, y + dy, { size: 28, color: C.dim, align: 'left', alpha: k });
      });
      const kU = P(t, 50.4, 50.9);
      if (kU > 0) {
        ctx.save(); ctx.globalAlpha *= kU; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(LX0, Y1); ctx.lineTo(LX1, Y1); ctx.stroke(); ctx.restore();
        drawRich(ctx, '{mink:n} = 1', AX - 12, Y1, { size: 28, align: 'right', alpha: kU });
        txt(ctx, '−13,6 eV', LX1 + 12, Y1, { size: 28, color: C.dim, align: 'left', alpha: kU });
        drawRich(ctx, '{dim:verso} {mink:n} {dim:= 1: ultravioletto, non si vede}', CX, 778, { size: 26, alpha: kU });
      }
      // i salti, come frecce colorate dal livello n al livello 2
      SALTI.forEach((s, i) => {
        const k = P(t, s.t, s.t + DJ);
        if (k <= 0) return;
        const x = 1420 + i * 58, ya = yE(En(s.da)), yb = yE(En(2)), col = colLuce(lamNm(s.da));
        ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, lerp(ya, yb - 6, k)); ctx.stroke();
        if (k >= 1) arrowHead(ctx, [x, yb - 4], Math.PI / 2, col, .8);
        ctx.restore();
        chip(ctx, fmt1(dE(s.da)) + ' eV', x, 600 - i * 50, P(t, s.t + .5, s.t + .9), 26);   // 1,9 · 2,6 · 2,9 · 3,0 (i nm stanno sopra la striscia)
      });
      // il conto del primo salto: da E a f a λ
      const kD = life(t, 58.5, 71.6, .4, .4), kC = life(t, 65.6, 71.6, .4, .4), XS = 1484;
      if (kD > 0) {
        drawRich(ctx, '{mink:f}{dim:: la frequenza}', XS, 456, { size: 28, align: 'left', alpha: kD });
        drawRich(ctx, '{mink:h}{dim:: costante di Planck}', XS, 496, { size: 28, align: 'left', alpha: kD });
      }
      if (kC > 0) {
        drawRich(ctx, '{mink:f} = {mink:E}/{mink:h} ≈ {mink:4,6·10¹⁴} Hz', XS, 552, { size: 28, align: 'left', alpha: kC });
        drawRich(ctx, '{mink:λ} = {mink:c}/{mink:f} ≈ 656 nm', XS, 594, { size: 28, align: 'left', alpha: kC });
        drawRich(ctx, '{mink:c}{dim:: velocità della luce}', XS, 634, { size: 28, align: 'left', alpha: kC });
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Le righe dell’idrogeno', W / 2, 180, { size: 125, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < T_FINE - .1) return;
    const al = 1 - P(t, 102.4, 103.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
      drawRich(ctx, 'L’elettrone sta solo su certi livelli:\nogni salto in giù è una riga di colore.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
    });
    const pills = [[450, '{mink:Eₙ} = −13,6 eV / {mink:n}²\n{dim:i livelli dell’idrogeno}'], [960, '{mink:h}·{mink:f} = {mink:Eₙ} − {mink:E₂}\n{dim:il fotone del salto}'], [1470, '656 · 486 · 434 · 410 nm\n{dim:le righe di Balmer}']];
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
    ['soffio', 7.5], ['pop', 8.4, .5],                                                // la lampada, la striscia dell'idrogeno
    ['pop', 13.4, .3], ['pop', 13.85, .5], ['pop', 14.3, .65], ['pop', 14.75, .7],   // le quattro righe, dal rosso al violetto
    ['pop', 17.7, .45],                                                               // Balmer, 1885
    ['soffio', 22.3], ['traccia', 22.6, 23.2], ['pop', 22.6, .4],                     // l'atomo: orbita 3 ed elettrone
    ['tono', 22.7, 24.7, [.32, .44, .59, .69, .68, .56, .41, .31, .32]],              // un giro dell'elettrone
    ['traccia', 28.5, 30.0], ['pop', 29.2, .5],                                       // le orbite permesse
    ['pop', 34.8, .6], ['pop', 35.8, .4],                                             // En = −13,6 eV / n²
    ['pop', 42.0, .35],                                                               // legato
    ['traccia', 49.2, 50.4], ['tono', 49.4, 50.9, [.9, .86, .78, .61, .13, 0]],       // i livelli, dall'alto in giù
    ['pop', 58.5, .45],                                                               // f e h
    ['tono', 60.0, 60.5, [.61, .13]], ['pop', 60.1, .3], ['pop', 60.9, .3],           // salto da 3 a 2: fotone, riga rossa
    ['pop', 65.6, .55],                                                               // da E a f a λ
    ['tono', 72.0, 72.4, [.13, .78]], ['tono', 73.0, 73.5, [.78, .13]], ['pop', 73.9, .5],   // su a 4, giù a 2: azzurra
    ['tono', 78.4, 78.8, [.13, .86]], ['tono', 78.9, 79.4, [.86, .13]], ['pop', 79.8, .65],  // da 5: violetta
    ['tono', 80.1, 80.5, [.13, .9]], ['tono', 80.6, 81.1, [.9, .13]], ['pop', 81.5, .7],     // da 6: violetta
    ['soffio', 94.0], ['pop', 96.2, .5], ['pop', 96.7, .6], ['pop', 97.2, .7],        // in una frase
  ];
  return {
    titolo: 'Le righe dell’idrogeno', durata: 104, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.2, 'le righe di Balmer'], [22.2, 48.6, 'il modello di Bohr'], [48.6, T_FINE, 'i salti e le righe']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSinistra(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
