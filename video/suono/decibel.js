'use strict';
/* Più dieci decibel — le intensità udibili vanno da I₀ = 10⁻¹² W/m² (soglia di udibilità) a circa 1 W/m² (soglia del
   dolore): 10¹² volte. Su un righello lineare sussurro e conversazione stanno sullo zero; si contano i fattori dieci.
   Livello sonoro L = 10·log₁₀(I/I₀) in dB: 10 dB per ogni gradino (intensità per 10). Conversazione 10⁻⁶ W/m² → 60 dB,
   sussurro ≈ 30 dB, dolore ≈ 120 dB. Due altoparlanti da 60 dB: non 120 dB (sarebbe 10⁶ volte) ma intensità doppia,
   10·log₁₀ 2 ≈ 3,01 → 63 dB. Diviso da «Acuto, forte, timbro»: lì l'intensità, qui la sua scala. Argomento: suono. */
CVIDEO.registra('suono/decibel', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, crossMark } = M;

  // ---------- la scala a gradini: un gradino ogni fattore dieci ----------
  const XA = 470, Y0 = 740, DY = 45;                      // asse; 10⁻¹² W/m² in basso, 1 W/m² in alto
  const yL = L => Y0 - DY * L / 10;                       // L in dB → pixel
  const POT = ['10⁻¹²', '10⁻¹¹', '10⁻¹⁰', '10⁻⁹', '10⁻⁸', '10⁻⁷', '10⁻⁶', '10⁻⁵', '10⁻⁴', '10⁻³', '10⁻²', '10⁻¹', '1'];

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [78.3, 190], [79.6, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [78.3, 1050], [79.6, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [78.3, 2.2], [79.6, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [78.3, 2], [79.6, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [78.3, -1.5], [79.6, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [15.9, 'sorpreso'],
    [20.4, 'pensa'], [24.5, 'felice'], [28.7, 'neutro'], [37.7, 'felice'], [42.3, 'neutro'], [46.5, 'festa'],
    [50.9, 'neutro'], [55.2, 'felice'], [59.8, 'pensa'], [64.1, 'sorpreso'], [69.3, 'neutro'], [73.9, 'felice'],
    [78.1, 'neutro'], [80.6, 'felice'], [85.8, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Quanto è più intenso un concerto\ndi un sussurro?'],
    [7.9, 11.4, '{mink:I}, l’{v:intensità}: potenza su ogni m²,\nin W/m².'],
    [11.5, 15.8, 'La soglia di udibilità, il più\ndebole: {mink:I₀ = 10⁻¹²} W/m².'],
    [15.9, 20.3, 'Il dolore arriva a circa {r:1 W/m²}:\n{mink:10¹²} volte di più.'],
    [20.4, 24.4, 'Su questo righello, sussurro e\nconversazione stanno sullo zero.'],
    [24.5, 28.6, 'Conviene contare i {v:fattori dieci}:\nuna scala a gradini.'],
    [28.7, 33.0, 'Ogni gradino in su: l’intensità {mink:I}\ndiventa {g:dieci volte} tanto.'],
    [33.1, 37.6, 'Il {v:livello sonoro} {mink:L} conta i gradini\nsopra {mink:I₀}, in {v:decibel} (dB).'],
    [37.7, 42.2, '{mink:L = 10·log₁₀(I/I₀)}:\n10 dB per ogni gradino.'],
    [42.3, 46.4, 'Conversazione: {mink:10⁻⁶} W/m²,\nun milione di volte {mink:I₀}…'],
    [46.5, 50.8, '…sei gradini: {mink:L = 10·6} = {g:60 dB}.'],
    [50.9, 55.15, 'Sussurro 30 dB, concerto 110 dB:\n8 gradini, {g:10⁸ volte} tanto.'],
    [55.2, 59.6, 'Da 60 a 70 dB: un gradino,\nintensità {g:dieci volte} tanto.'],
    [59.8, 64.0, 'E due altoparlanti uguali,\nda 60 dB ciascuno?'],
    [64.1, 69.2, '{r:60 + 60 = 120 dB}? No: sarebbe\nun milione di volte di più!'],
    [69.3, 73.8, 'L’intensità raddoppia soltanto:\n{mink:10·log₁₀ 2} ≈ 3 dB in più.'],
    [73.9, 78.2, 'Due altoparlanti: {g:63 dB}.\n+3 dB, intensità circa doppia.'],
    [80.6, 85.6, 'I decibel contano i fattori dieci:\n+10 dB, intensità dieci volte.'],
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
  function linea(ctx, a, b, col, w = 3, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
  }
  function pallino(ctx, x, y, col, al = 1, r = 9) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function altoparlante(ctx, x, y, al = 1) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css(C.ink, .14); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x - 34, y - 26, 30, 52, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 4, y - 14); ctx.lineTo(x + 26, y - 40); ctx.lineTo(x + 26, y + 40); ctx.lineTo(x - 4, y + 14); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    for (const r of [44, 60]) { ctx.beginPath(); ctx.arc(x + 4, y, r, -.55, .55); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- 1 · un righello normale (7,5–25) ----------
  const RX0 = 200, RX1 = 1700, RY = 500;                  // 0 … 1 W/m², 1500 px per W/m²
  function scenaRighello(ctx, t) {
    if (t < 7.5 || t > 25.4) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 24.6, 25.2));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 1720, 690);
    conFont(TITOLI, () => drawRich(ctx, 'un righello normale', 960, 168, { size: 36, weight: 600 }));
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(RX0, RY); ctx.lineTo(RX1 + 30, RY); ctx.stroke();
    arrowHead(ctx, [RX1 + 36, RY], 0, C.ink);
    [[0, '0'], [.25, '0,25'], [.5, '0,5'], [.75, '0,75'], [1, '1']].forEach(([v, s]) => {
      const x = lerp(RX0, RX1, v); ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, RY - 10); ctx.lineTo(x, RY + 10); ctx.stroke();
      txt(ctx, s, x, RY + 40, { size: 30, color: C.dim });
    });
    drawRich(ctx, '{mink:I} {dim:(W/m²)}', RX1, RY + 84, { size: 30 });
    // la soglia, il sussurro, la conversazione: tutti sullo zero
    const voci = [[11.6, 300, '{v:soglia di udibilità}: {mink:10⁻¹²} W/m²'], [20.6, 360, '{x:sussurro}: circa {mink:10⁻⁹} W/m²'], [21.3, 420, '{x:conversazione}: circa {mink:10⁻⁶} W/m²']];
    for (const [a, y, s] of voci) {
      const k = P(t, a, a + .5);
      if (k <= 0) continue;
      linea(ctx, [RX0 + 34, y + 4], [RX0 + 3, RY - 12], C.dim, 2, k);
      drawRich(ctx, s, RX0 + 44, y, { size: 32, align: 'left', alpha: k });
    }
    pallino(ctx, RX0, RY, C.v, P(t, 11.6, 12.1), 10);
    // il dolore, all'altro capo
    const kd = P(t, 16.0, 16.5);
    linea(ctx, [RX1, 448], [RX1, RY - 14], C.r, 2, kd);
    drawRich(ctx, '{r:soglia del dolore}: circa 1 W/m²', RX1 + 60, 420, { size: 32, align: 'right', alpha: kd });
    pallino(ctx, RX1, RY, C.r, kd, 10);
    // mille miliardi di volte
    const km = life(t, 16.4, 20.5, .4, .4);
    if (km > 0) {
      freccia(ctx, [RX0 + 20, 610], [RX1 - 4, 610], C.v, km, 5);
      drawRich(ctx, '{v:mille miliardi di volte}: {mink:10¹²}', 960, 675, { size: 46, alpha: km, local: t - 16.3 });
    }
    drawRich(ctx, 'qui la conversazione dista {x:0,0015 px} dallo zero', 960, 660, { size: 36, alpha: life(t, 21.8, 25.2, .4, .4), local: t - 21.8 });
    ctx.restore();
  }

  // ---------- 2 · la scala a gradini (25–78) ----------
  function scenaScala(ctx, t) {
    if (t < 25.1 || t > 79.0) return;
    const al = P(t, 25.2, 25.9) * (1 - P(t, 77.9, 78.5));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 760, 690);
    drawRich(ctx, '{mink:I} {dim:(W/m²)}', 380, 152, { size: 32 });
    const kd = P(t, 33.3, 33.8);
    drawRich(ctx, '{mink:L} {dim:(dB)}', 548, 152, { size: 32, alpha: kd });
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(XA, Y0 + 22); ctx.lineTo(XA, yL(120) - 28); ctx.stroke();
    arrowHead(ctx, [XA, yL(120) - 34], -Math.PI / 2, C.ink);
    for (let k = 0; k <= 12; k++) {
      const a = 25.6 + .1 * k, kk = P(t, a, a + .3), y = yL(10 * k);
      if (kk <= 0) continue;
      ctx.save(); ctx.globalAlpha *= kk;
      ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XA - 12, y); ctx.lineTo(XA + 12, y); ctx.stroke();
      drawRich(ctx, '{mink:' + POT[k] + '}', XA - 22, y, { size: 30, align: 'right' });
      txt(ctx, String(10 * k), XA + 24, y, { size: 30, color: C.ink, align: 'left', alpha: P(t, 33.4 + .08 * k, 33.7 + .08 * k) });
      ctx.restore();
    }
    // gli esempi
    [[0, 26.5, '{v:soglia}'], [120, 26.8, '{r:dolore}'], [60, 42.4, '{x:conversazione}'], [30, 51.0, '{x:sussurro}'], [110, 51.3, '{x:concerto}']].forEach(([L, a, s]) => {
      const k = P(t, a, a + .5);
      if (k <= 0) return;
      drawRich(ctx, s, 600, yL(L), { size: 30, align: 'left', alpha: k });
      pallino(ctx, XA, yL(L), L === 0 ? C.v : L === 120 ? C.r : C.x, k, 8);
    });
    // un gradino: intensità per dieci
    const kg = Math.max(life(t, 28.8, 33.1, .4, .4), life(t, 55.3, 59.7, .4, .4));
    if (kg > 0) {
      freccia(ctx, [320, yL(60) - 2], [320, yL(70) + 2], C.g, kg, 5);
      drawRich(ctx, '{g:· 10}', 300, (yL(60) + yL(70)) / 2, { size: 34, align: 'right', alpha: kg });
    }
    // sei gradini sopra la soglia
    const k6 = life(t, 46.6, 50.9, .4, .4);
    if (k6 > 0) {
      ctx.save(); ctx.globalAlpha *= k6; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(828, yL(0)); ctx.lineTo(842, yL(0)); ctx.lineTo(842, yL(60)); ctx.lineTo(828, yL(60)); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:6 gradini}', 820, yL(30), { size: 32, align: 'right', alpha: k6 });
    }
    // l'ipotesi sbagliata: 120 dB sarebbero sei gradini in più
    const kr = life(t, 64.2, 69.3, .4, .4);
    if (kr > 0) {
      dashed(ctx, [320, yL(60) - 4], [320, yL(120) + 14], C.r, 1, kr);
      ctx.save(); ctx.globalAlpha *= kr; arrowHead(ctx, [320, yL(120) + 6], -Math.PI / 2, C.r, .9); ctx.restore();
      drawRich(ctx, '{r:· 10⁶}', 300, yL(90), { size: 34, align: 'right', alpha: kr });
    }
    // 63 dB: un terzo di gradino sopra 60
    // sussurro e concerto: otto gradini
    const k8 = life(t, 51.4, 55.2, .4, .4);
    if (k8 > 0) {
      ctx.save(); ctx.globalAlpha *= k8; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(828, yL(30)); ctx.lineTo(842, yL(30)); ctx.lineTo(842, yL(110)); ctx.lineTo(828, yL(110)); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:8 gradini}', 820, yL(70), { size: 32, align: 'right', alpha: k8 });
    }
    // 63 dB: una tacca verde un terzo di gradino sopra 60, con il numero di lato
    const k63 = life(t, 74.0, 78.3, .4, .4);
    if (k63 > 0) {
      const y63 = yL(10 * Math.log10(2e6));
      ctx.save(); ctx.globalAlpha *= k63; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(XA - 16, y63); ctx.lineTo(XA + 16, y63); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{g:63}', 548, y63 - 8, { size: 30, align: 'left', alpha: k63 });
    }
    ctx.restore();
  }

  // ---------- 3 · il pannello dei conti (25–78) ----------
  const QX = 1360;
  function scenaConti(ctx, t) {
    if (t < 25.4 || t > 79.0) return;
    const al = P(t, 25.5, 26.1) * (1 - P(t, 77.9, 78.5));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 900, 110, 920, 690);
    const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, QX, 165, { size: 36, weight: 600, alpha: a }));
    // pagina A: i gradini e la formula
    const sA = 1 - P(t, 55.0, 55.4);
    if (sA > 0) {
      ctx.save(); ctx.globalAlpha *= sA;
      tit('i gradini', 1);
      const k1 = P(t, 28.9, 29.4), k2 = P(t, 33.3, 33.8);
      drawRich(ctx, '{dim:un gradino in su}', 940, 250, { size: 32, align: 'left', alpha: k1 });
      drawRich(ctx, 'intensità {mink:· 10}', 1780, 250, { size: 38, align: 'right', alpha: k1 });
      drawRich(ctx, '{v:livello sonoro} {mink:L}', 940, 315, { size: 32, align: 'left', alpha: k2 });
      drawRich(ctx, '10 dB per gradino', 1780, 315, { size: 38, align: 'right', alpha: k2 });
      drawRich(ctx, '{mink:L = 10·log₁₀(I/I₀)}', QX, 425, { size: 66, local: t - 37.9 });
      drawRich(ctx, '{mink:I₀ = 10⁻¹²} {dim:W/m², la soglia di udibilità}', QX, 500, { size: 30, alpha: P(t, 38.4, 38.9) });
      ctx.save(); ctx.globalAlpha *= P(t, 42.3, 42.7); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(940, 550); ctx.lineTo(1780, 550); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{x:conversazione}', 940, 600, { size: 32, align: 'left', alpha: P(t, 42.4, 42.9) });
      drawRich(ctx, '{mink:I/I₀ = 10⁻⁶ / 10⁻¹² = 10⁶}', 1780, 600, { size: 40, align: 'right', local: t - 42.6 });
      drawRich(ctx, '{mink:L = 10·log₁₀ 10⁶ = 10·6} = {g:60 dB}', 1780, 680, { size: 40, align: 'right', local: t - 46.7 });
      ctx.restore();
    }
    // pagina B: più forte
    const sB = P(t, 55.3, 55.8);
    if (sB > 0) {
      ctx.save(); ctx.globalAlpha *= sB;
      tit('più forte', 1);
      drawRich(ctx, '{g:+10 dB}  →  intensità {mink:· 10}', QX, 250, { size: 44, local: t - 55.4 });
      const ks = P(t, 59.9, 60.4);
      altoparlante(ctx, 1000, 400, ks); altoparlante(ctx, 1150, 400, P(t, 60.2, 60.7));
      txt(ctx, '60 dB', 1000, 478, { size: 30, color: C.dim, alpha: ks });
      txt(ctx, '60 dB', 1150, 478, { size: 30, color: C.dim, alpha: P(t, 60.2, 60.7) });
      const kh = life(t, 64.2, 69.4, .4, .4);
      drawRich(ctx, '{r:60 + 60 = 120 dB?}', 1500, 400, { size: 46, alpha: kh });
      if (kh > 0) { ctx.save(); ctx.globalAlpha *= kh; crossMark(ctx, 1745, 400, P(t, 65.6, 66.6), C.r, .4); ctx.restore(); }
      drawRich(ctx, '{g:63 dB} in tutto', 1500, 400, { size: 46, alpha: P(t, 74.0, 74.5), local: t - 74.0 });
      drawRich(ctx, 'intensità {mink:· 2}  →  {mink:L + 10·log₁₀ 2} ≈ {mink:L} + 3 dB', QX, 545, { size: 38, local: t - 69.5 });
      // fra 60 e 70 dB: dove cade il doppio
      const km = P(t, 74.2, 74.8);
      if (km > 0) {
        ctx.save(); ctx.globalAlpha *= km;
        const xm = L => 1000 + (L - 60) / 10 * 700;
        ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xm(60), 670); ctx.lineTo(xm(70), 670); ctx.stroke();
        [[60, '60 dB', '{mink:I}', C.ink], [60 + 10 * Math.log10(2), '{g:63 dB}', '{mink:2·I}', C.g], [70, '70 dB', '{mink:10·I}', C.ink]].forEach(([L, su, giu, col]) => {
          ctx.strokeStyle = css(col, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xm(L), 658); ctx.lineTo(xm(L), 682); ctx.stroke();
          drawRich(ctx, su, xm(L), 632, { size: 30 });
          drawRich(ctx, giu, xm(L), 714, { size: 30 });
        });
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- titolo e chiusura ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Più dieci decibel', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 78.3) return;
    const al = 1 - P(t, 86.4, 87.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 78.5 });
      drawRich(ctx, 'I decibel contano i fattori dieci:\n+10 dB, intensità dieci volte tanto.', W / 2, 290, { size: 66, weight: 600, local: t - 78.9, stagger: .08 });
    });
    const pills = [[490, '{mink:L = 10·log₁₀(I/I₀)}\n{mink:I₀ = 10⁻¹²} W/m²'], [960, '{g:+10 dB}: intensità\ndieci volte'], [1430, '{g:+3 dB}: intensità\ncirca doppia']];
    pills.forEach(([x, s], i) => {
      const a = 80.5 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti; l'unico tono segue le
  // tacche della scala a gradini, dalla soglia (0) al dolore (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 11.7, .2],                                               // il righello, la soglia di udibilità
    ['pop', 16.1, .9], ['traccia', 16.4, 16.9],                                       // il dolore; mille miliardi di volte
    ['pop', 20.7, .3], ['pop', 21.4, .35],                                            // sussurro e conversazione, sullo zero
    ['soffio', 25.2], ['tono', 25.6, 26.8, [0, 1]],                                   // la scala a gradini sale
    ['pop', 29.0, .55], ['pop', 33.5, .5],                                            // un gradino: per 10; i decibel
    ['pop', 38.0, .6], ['pop', 42.5, .55], ['traccia', 46.6, 47.0],                   // la formula; conversazione: 6 gradini
    ['pop', 51.1, .3], ['pop', 51.4, .85], ['traccia', 51.4, 51.8],                   // sussurro e concerto: 8 gradini
    ['soffio', 55.3], ['pop', 55.5, .6],                                              // più forte: +10 dB
    ['pop', 60.0, .5], ['pop', 60.3, .5],                                             // due altoparlanti da 60 dB
    ['traccia', 64.2, 64.6], ['traccia', 65.6, 66.6],                                 // 120 dB? cancellato
    ['pop', 69.6, .5], ['pop', 74.1, .55], ['ding', 74.8],                            // più 3 dB: 63 dB in tutto
    ['soffio', 78.5], ['pop', 80.5, .5], ['pop', 81.0, .6], ['pop', 81.5, .7],        // in una frase
  ];
  return {
    titolo: 'Più dieci decibel', durata: 88.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 24.5, 'mille miliardi di volte'], [24.5, 55.0, 'la scala dei decibel'], [55.0, 78.2, 'più forte']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaRighello(ctx, t); scenaScala(ctx, t); scenaConti(ctx, t); scenaFine(ctx, t); },
  };
});
