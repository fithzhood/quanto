'use strict';
/* Anche l'elettrone è un'onda — de Broglie: λ = h/p. Numeri veri: elettrone accelerato da 100 V, v = √(2eV/m) =
   5,93·10⁶ m/s, p = m·v = 5,40·10⁻²⁴ kg·m/s, λ = h/p = 1,23·10⁻¹⁰ m = 0,12 nm (quanto le distanze fra gli atomi di un
   cristallo: Davisson e Germer, 1927); una palla da 100 g a 10 m/s: p = 1 kg·m/s, λ ≈ 6,6·10⁻³⁴ m. La pallina va a velocità costante: lo spazio è ∫ v dt.
   Poi le due fenditure con elettroni uno alla volta (Merli, Missiroli e Pozzi, Bologna 1974; Tonomura 1989): ogni
   elettrone arriva in un punto, e i punti sono estratti (seme fisso, generatore mulberry32) dalla distribuzione vera
   delle due fenditure, I(y) ∝ cos²(π·y/P)·sinc²(π·y/(4P)) (fenditure larghe un quarto della loro distanza; P = 70 px),
   con l'istogramma dei conteggi a destra (fasce di P/6 con i bordi sugli zeri) e la curva teorica scalata ai conteggi. Argomento: quanti. */
CVIDEO.registra('quanti/de-broglie', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dot, glowStroke, dashed, richW } = M;
  const TAU = Math.PI * 2;

  // ---------- i numeri ----------
  const HP = 6.62607e-34, EV = 1.602177e-19, ME = 9.10938e-31;
  const VEL = Math.sqrt(2 * EV * 100 / ME), PEL = ME * VEL, LAM = HP / PEL;   // 5,93·10⁶ m/s · 5,40·10⁻²⁴ · 1,23·10⁻¹⁰ m

  const T_FINE = 96.1;
  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [15.6, 'felice'], [20.6, 'neutro'],
    [27.8, 'felice'], [35.4, 'sorpreso'], [42.0, 'pensa'], [50.2, 'felice'], [54.8, 'neutro'], [60.2, 'pensa'],
    [64.4, 'neutro'], [67.9, 'sorpreso'], [73.1, 'neutro'], [78.3, 'felice'], [83.9, 'neutro'], [89.7, 'festa'],
    [T_FINE, 'neutro'], [98.7, 'felice'], [102.7, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.8, 'La luce, un’onda, arriva a pacchetti.\nE l’elettrone, è un’onda?'],
    [7.9, 15.4, 'De Broglie, 1924: a ogni particella con\nquantità di moto {mink:p} = {mink:m}·{mink:v} va un’onda…'],
    [15.6, 20.4, '…di lunghezza {mink:λ} = {mink:h}/{mink:p}:\n{mink:h} è la costante di Planck.'],
    [20.6, 27.6, 'Un elettrone spinto da 100 volt\nva a {mink:v} ≈ 5,9·10⁶ m/s.'],
    [27.8, 35.2, 'Allora {mink:λ} = {mink:h}/{mink:p} ≈ 1,2·10⁻¹⁰ m:\nun decimo di nanometro.'],
    [35.4, 41.8, 'Quanto lo spazio fra gli atomi di un\ncristallo: nel 1927 ci videro le frange.'],
    [42.0, 50.0, 'Una palla da 100 g a 10 m/s:\n{mink:λ} ≈ 6,6·10⁻³⁴ m: invisibile.'],
    [50.2, 54.6, 'La prova più bella: due fenditure,\ncome Young, ma con {v:elettroni}.'],
    [54.8, 60.0, 'Li sparo {g:uno alla volta}: ogni elettrone\narriva sullo schermo in un punto solo.'],
    [60.2, 64.2, 'Un puntino qui, uno là: sembra\ncasuale. Una pallina, direi.'],
    [64.4, 67.7, 'Ne mando centinaia, sempre\nuno alla volta…'],
    [67.9, 72.9, '…e i punti si addensano a {g:strisce}:\nle frange di Young, con gli elettroni.'],
    [73.1, 78.1, 'Dove le onde fanno buio nessun elettrone\narriva mai; dove fanno chiaro, tanti.'],
    [78.3, 83.7, 'La curva delle frange dice la {v:probabilità}\ndi trovare l’elettrone in ogni punto.'],
    [83.9, 89.5, 'Fatto davvero, a Bologna nel 1974:\nun elettrone alla volta.'],
    [89.7, 95.7, 'Ogni elettrone arriva in un punto, ma dove\nva lo decide un’onda: {mink:λ} = {mink:h}/{mink:p}.'],
    [98.7, 104.7, 'A ogni particella va un’onda, {mink:λ} = {mink:h}/{mink:p}:\nanche gli elettroni fanno le frange.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al, size) {
    if (al <= 0) return;
    size = size || 32;
    const w = richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size: size, alpha: al });
  }
  function linea(ctx, a, b, col, w, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
  }
  // un'onda sinusoidale da x0 a x1 (ampiezza A, lunghezza d'onda lam, fase ph)
  function onda(ctx, x0, x1, y, A, lam, ph, col, w, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let x = x0; x <= x1; x += 3) { const yy = y - A * Math.sin(TAU * (x - x0) / lam + ph); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
    ctx.stroke(); ctx.restore();
  }

  // il moto della pallina: velocità in px/s (al rallentatore) e spazio percorso, ∫ v dt sommato a passi di 0,01 s
  const vel = t => lerp(90, 160, P(t, 20.8, 21.6)) * (1 - P(t, 42.2, 43.0)) + 60 * P(t, 42.2, 43.0);
  const GIRO = 480, T_MOTO = 7.8, DTM = .01, SPAZI = [0];
  for (let i = 1; T_MOTO + i * DTM <= 51; i++) SPAZI.push(SPAZI[i - 1] + vel(T_MOTO + (i - .5) * DTM) * DTM);
  function spazio(t) {
    const u = clamp((t - T_MOTO) / DTM, 0, SPAZI.length - 1.001), i = Math.floor(u);
    return lerp(SPAZI[i], SPAZI[i + 1], u - i);
  }

  // ---------- le due fenditure: la distribuzione vera e i punti estratti con seme fisso ----------
  const CS = [120, 110, 1060, 690];
  const GUN = [230, 455], XW = 560, XS = 1040, YC = 455, DS = 44, PF = 70, YMIN = 165, YMAX = 745;
  const intensita = y => { const u = (y - YC) / PF, a = Math.PI * u / 4, s = a === 0 ? 1 : Math.sin(a) / a; return Math.pow(Math.cos(Math.PI * u), 2) * s * s; };
  const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const CDF = [], YS = []; { let acc = 0; for (let y = YMIN; y <= YMAX; y += .5) { acc += intensita(y); CDF.push(acc); YS.push(y); } for (let i = 0; i < CDF.length; i++) CDF[i] /= acc; }
  function estrai(u) { let a = 0, b = CDF.length - 1; while (a < b) { const m = (a + b) >> 1; if (CDF[m] < u) a = m + 1; else b = m; } return YS[a]; }
  const N = 1200, rnd = mulberry32(7), PUNTI = [];
  for (let k = 0; k < N; k++) PUNTI.push(estrai(rnd()));
  const SCR = 120, PX = []; for (let k = 0; k < N; k++) PX.push(rnd());   // schermo visto di fronte: il punto cade a caso nella larghezza
  // gli istanti di arrivo: i primi 19 ogni mezzo secondo da 55,0; poi a centinaia (n(t) lineare a tratti)
  const NT = [[64.4, 19], [67.7, 400], [72.9, 900], [83.0, 1200]];
  const ARRIVI = [];
  for (let k = 0; k < N; k++) {
    if (k < 19) { ARRIVI.push(55.0 + .5 * k); continue; }
    let tk = 83;
    for (let i = 0; i + 1 < NT.length; i++) if (k >= NT[i][1] && k < NT[i + 1][1]) tk = NT[i][0] + (k - NT[i][1]) * (NT[i + 1][0] - NT[i][0]) / (NT[i + 1][1] - NT[i][1]);
    ARRIVI.push(tk);
  }
  const arrivati = t => { let a = 0, b = N; while (a < b) { const m = (a + b) >> 1; if (ARRIVI[m] <= t) a = m + 1; else b = m; } return a; };
  // i conteggi per fascia di 20 px, e la scala comune (il massimo alla fine)
  // fasce di un sesto di frangia (11,7 px) con i bordi sugli zeri di cos² (y = YC ± 35 + 70·k): dove le onde fanno
  // buio non c'è nessuna fascia a metà, e la barra cala a zero
  const BIN = PF / 6, B0 = YC + PF / 2 - 5 * PF, NB = Math.ceil((YMAX - B0) / BIN);
  const bins = n => { const c = new Array(NB).fill(0); for (let k = 0; k < n; k++) c[Math.min(NB - 1, Math.floor((PUNTI[k] - B0) / BIN))]++; return c; };
  const MAXF = Math.max.apply(null, bins(N));
  let TOT = 0; for (let y = YMIN; y <= YMAX; y += .5) TOT += intensita(y) * .5;   // ∫ I dy, per scalare la curva ai conteggi

  function scenaSinistra(ctx, t) {
    if (t < 7.5 || t > T_FINE + .3) return;
    const al = P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, CS[0], CS[1], CS[2], CS[3]);
    // 1 · una particella con la sua onda (7,9–50): la pallina avanza, l'onda la accompagna
    const k1 = life(t, 7.8, 50.2, .4, .4);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
      const kE = P(t, 20.8, 21.6), kB = P(t, 42.2, 43.0);                       // elettrone (λ corta), poi la palla (λ invisibile)
      const vpx = vel(t), lam = lerp(130, 60, kE), A = 28 * (1 - kB);
      const sp = spazio(t), q = (sp % GIRO) / GIRO, x = 460 + q * GIRO, y = 330;
      const fd = clamp(q / .07) * clamp((1 - q) / .07);                        // sfuma a destra, ricompare a sinistra
      ctx.save(); ctx.globalAlpha *= fd;
      onda(ctx, x - 330, x, y, A, lam, 0, C.v, 4, 1 - kB);
      dot(ctx, [x, y], C.x, 1, lerp(11, 30, kB));
      // la velocità e la quantità di moto
      linea(ctx, [x + 14, y], [x + 14 + vpx * .9, y], C.x, 5, 1);
      arrowHead(ctx, [x + 16 + vpx * .9, y], 0, C.x, .9);
      chip(ctx, '{mx:v}', x + 20 + vpx * .9, y - 38, 1, 30);
      ctx.restore();
      const kL = P(t, 15.8, 16.4) * (1 - kB) * fd;
      if (kL > 0) {
        const xa = x - 330 + lam * .25, xb = xa + lam;
        linea(ctx, [xa, y + 50], [xb, y + 50], C.v, 3, kL); arrowHead(ctx, [xb + 2, y + 50], 0, C.v, .7 * kL); arrowHead(ctx, [xa - 2, y + 50], Math.PI, C.v, .7 * kL);
        chip(ctx, '{mink:λ} = {mink:h}/{mink:p}', (xa + xb) / 2, y + 90, kL, 32);
      }
      chip(ctx, '{dim:quantità di moto} {mink:p} = {mink:m}·{mink:v}', 640, 215, P(t, 9.4, 10.0), 30);
      chip(ctx, kB > .5 ? '{dim:palla da 100 g:} {mink:λ} ≈ {mink:6,6·10⁻³⁴} m, {dim:nessuna onda visibile}' : '{dim:più} {mink:p} {dim:è grande, più} {mink:λ} {dim:è corta}', 640, 480, P(t, 16.6, 17.2) * (kB > 0 && kB < 1 ? 0 : 1), 28);
      txt(ctx, kB > .5 ? 'la palla' : kE > .5 ? 'l’elettrone' : 'una particella', 640, 165, { size: 28, color: C.dim });
      // il cristallo: atomi a 0,25 nm, l'onda dell'elettrone a 0,12 nm (in scala fra loro)
      const kC = life(t, 35.6, 50.2, .4, .4);
      if (kC > 0) {
        ctx.save(); ctx.globalAlpha *= kC;
        const SC = 440;                                                        // px per nm
        for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) dot(ctx, [310 + i * .25 * SC, 600 + j * .25 * SC], C.dim, 1, 9);
        chip(ctx, '{dim:atomi di un cristallo, a} 0,25 nm', 420, 540, 1, 26);
        const xo = 1000 - ((t - 35.6) * 50) % 160;
        onda(ctx, 300, 980, 655, 14, LAM * 1e9 * SC, TAU * (xo / (LAM * 1e9 * SC)), C.v, 3, 1);
        chip(ctx, '{mink:λ} = 0,12 nm {dim:(elettrone da 100 V)}', 880, 540, 1, 26);
        chip(ctx, '{dim:Davisson e Germer, 1927: frange}', 640, 740, P(t, 37.4, 38.0), 26);
        ctx.restore();
      }
      ctx.restore();
    }
    // 2 · le due fenditure con gli elettroni (50,2–)
    const k2 = P(t, 50.3, 50.9);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
      // il cannone, la parete, lo schermo
      ctx.fillStyle = css(C.ink, .7); ctx.beginPath(); ctx.roundRect(GUN[0] - 70, GUN[1] - 24, 80, 48, 8); ctx.fill();
      txt(ctx, 'cannone elettronico', 262, GUN[1] + 60, { size: 22, color: C.dim });
      ctx.fillStyle = css(C.ink, .85);
      for (const [a, b] of [[YMIN - 10, YC - DS - 6], [YC - DS + 6, YC + DS - 6], [YC + DS + 6, YMAX + 10]]) ctx.fillRect(XW - 5, a, 10, b - a);
      chip(ctx, '{v:due fenditure}', XW, YMIN - 30, 1, 26);
      ctx.fillStyle = css(mix(C.ink, C.paper, .85)); ctx.fillRect(XS, YMIN - 10, SCR, YMAX - YMIN + 20);
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(XS, YMIN - 10, SCR, YMAX - YMIN + 20);
      txt(ctx, 'schermo', XS + SCR / 2, YMIN - 30, { size: 26, color: C.dim });
      txt(ctx, 'al rallentatore', 300, 780, { size: 24, color: C.dim });
      // gli elettroni arrivati: un puntino ciascuno
      const n = arrivati(t);
      ctx.fillStyle = css(C.x);
      for (let k = 0; k < n; k++) { const dt = t - ARRIVI[k], r = dt < .25 ? 3 + 5 * (1 - dt / .25) : 3; ctx.beginPath(); ctx.arc(XS + 9 + (SCR - 18) * PX[k], PUNTI[k], r, 0, TAU); ctx.fill(); }
      // i primi, lenti: in volo fino alla parete, poi un cerchio che si allarga dalle due fenditure, poi il punto
      for (let k = 0; k < 19; k++) {
        const tk = ARRIVI[k], dt = t - tk;
        if (dt < -.55 || dt >= 0) continue;
        if (dt < -.3) { const u = (dt + .55) / .25; dot(ctx, [lerp(GUN[0] + 10, XW - 10, u), GUN[1]], C.x, 1, 7); }
        else {
          const u = (dt + .3) / .3, r = u * (XS - XW);
          ctx.save(); ctx.globalAlpha *= .35 * (1 - u * .6); ctx.strokeStyle = css(C.v); ctx.lineWidth = 2.5;
          for (const ys of [YC - DS, YC + DS]) for (let m = 0; m < 4; m++) { const rr = r - m * 24; if (rr <= 0) continue; ctx.beginPath(); ctx.arc(XW, ys, rr, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
          ctx.restore();
        }
      }
      chip(ctx, '{dim:fra parete e schermo va come un’onda}', 815, 780, life(t, 55.2, 64.2, .4, .4), 24);
      // quanti sono
      chip(ctx, '{dim:elettroni arrivati:} ' + n, 300, YMIN + 20, P(t, 55.0, 55.5), 26);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- la scheda di destra: i numeri, poi l'istogramma ----------
  const RC = [1230, 110, 580, 690], CX = 1520;
  function scenaDestra(ctx, t) {
    if (t < 7.6 || t > T_FINE + .3) return;
    const al = P(t, 7.6, 8.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, RC[0], RC[1], RC[2], RC[3]);
    const k1 = 1 - P(t, 50.2, 50.7);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      conFont(TITOLI, () => drawRich(ctx, 'l’onda di de Broglie', CX, 165, { size: 42, weight: 600 }));
      drawRich(ctx, '{dim:1924: a ogni particella va un’onda}', CX, 222, { size: 28, local: t - 8.2 });
      drawRich(ctx, '{mink:λ} = {mink:h}/{mink:p}', CX, 300, { size: 64, local: t - 15.8 });
      drawRich(ctx, '{mink:h} ≈ {mink:6,63·10⁻³⁴} J·s', CX, 370, { size: 32, local: t - 17.0 });
      drawRich(ctx, '{dim:elettrone da 100 V:} {mink:v} ≈ {mink:5,9·10⁶} m/s', CX, 440, { size: 30, local: t - 20.8 });
      drawRich(ctx, '{mink:p} = {mink:m}·{mink:v} ≈ {mink:5,4·10⁻²⁴} kg·m/s', CX, 490, { size: 30, local: t - 24.0 });
      drawRich(ctx, '{mink:λ} ≈ {mink:1,2·10⁻¹⁰} m = {g:0,12 nm}', CX, 545, { size: 34, local: t - 28.0 });
      drawRich(ctx, '{dim:palla da 100 g a 10 m/s:} {mink:p} = 1 kg·m/s', CX, 630, { size: 28, local: t - 42.2 });
      drawRich(ctx, '{mink:λ} ≈ {mink:6,6·10⁻³⁴} m', CX, 685, { size: 34, local: t - 44.0 });
      drawRich(ctx, '{dim:nessuna fenditura è così stretta}', CX, 740, { size: 26, local: t - 45.4 });
      ctx.restore();
    }
    const k2 = P(t, 50.7, 51.2);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      conFont(TITOLI, () => drawRich(ctx, 'quanti ne arrivano', CX, 150, { size: 38, weight: 600 }));
      txt(ctx, 'per ogni fascia dello schermo →', CX, 198, { size: 24, color: C.dim });
      const X0 = 1300, LMAX = 440, n = arrivati(t), c = bins(n);
      ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, YMIN - 10); ctx.lineTo(X0, YMAX + 10); ctx.stroke();
      ctx.fillStyle = css(C.x, .75);
      for (let i = 0; i < NB; i++) { const L = c[i] / MAXF * LMAX; if (L > 0) ctx.fillRect(X0, B0 + i * BIN + 1, L, BIN - 2); }
      // le righe di buio (gli zeri di cos²): lì le barre arrivano a zero, da un lato e dall'altro
      const kZ = life(t, 73.2, T_FINE, .5, .4);
      if (kZ > 0) {
        for (let yz = B0 + PF; yz < YMAX; yz += PF) if (yz > YMIN + 60) dashed(ctx, [X0, yz], [X0 + LMAX, yz], C.dim, 1, .55 * kZ);
        chip(ctx, '{dim:buio}', X0 + LMAX + 30, YC + PF / 2, kZ, 26);
      }
      // la curva teorica, scalata ai conteggi: in ogni fascia ci si aspetta n·∫I/∫I_tot
      const kT = P(t, 78.5, 79.9);
      if (kT > 0) {
        const pts = []; for (let y = YMIN; y <= YMAX; y += 4) pts.push([X0 + n * intensita(y) * BIN / TOT / MAXF * LMAX, y]);
        glowStroke(ctx, pts, kT, C.v, 4);
        chip(ctx, '{v:la curva delle frange}', 1600, 720, P(t, 79.3, 79.8), 26);
        chip(ctx, '{dim:= probabilità di arrivo}', 1600, 758, P(t, 80.3, 80.8), 24);
      }
      chip(ctx, '{dim:Bologna 1974 · Giappone 1989}', 1580, 668, life(t, 84.1, 89.5, .4, .4), 26);   // dove le frange sono deboli
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Anche l’elettrone è un’onda', W / 2, 180, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < T_FINE - .1) return;
    const al = 1 - P(t, 105.0, 106.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
      drawRich(ctx, 'A ogni particella va un’onda, {mink:λ} = {mink:h}/{mink:p}:\nanche gli elettroni fanno le frange.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
    });
    const pills = [[450, '{mink:λ} = {mink:h}/{mink:p}\n{dim:l’onda di de Broglie}'], [960, 'elettrone da 100 V:\n{mink:λ} ≈ 0,12 nm'], [1470, 'uno alla volta,\n{dim:eppure fanno le frange}']];
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
    ['soffio', 7.5], ['pop', 8.0, .4], ['pop', 9.4, .5],                              // la particella, p = m·v
    ['pop', 15.8, .6], ['pop', 16.6, .45],                                            // λ = h/p
    ['tono', 20.8, 21.6, [.3, .65]], ['pop', 20.8, .5],                               // l'elettrone accelera, λ si accorcia
    ['pop', 24.0, .45], ['ding', 28.1],                                               // p, poi λ = 0,12 nm
    ['pop', 35.6, .5], ['pop', 37.4, .4],                                             // il cristallo, Davisson e Germer
    ['tono', 42.2, 43.0, [.65, .4]], ['pop', 42.6, .2],                               // la palla: lenta e pesante
    ['pop', 44.0, .55], ['pop', 45.4, .3],                                            // λ della palla, invisibile
    ['soffio', 50.2],                                                                 // le due fenditure
    ['pop', 55.0, .86], ['pop', 55.5, .75], ['pop', 56.0, .17], ['pop', 56.5, .39],  // i primi elettroni, uno alla volta
    ['tono', 64.4, 72.9, [.02, .17, .33, .53, .75]],                                  // ne arrivano centinaia
    ['traccia', 73.2, 73.7], ['pop', 73.4, .3],                                       // le righe di buio
    ['traccia', 78.5, 79.9], ['pop', 79.3, .55], ['pop', 80.3, .45],                  // la curva delle frange, la probabilità
    ['pop', 84.1, .4],                                                                // Bologna 1974
    ['soffio', 96.1], ['pop', 98.3, .5], ['pop', 98.8, .6], ['pop', 99.3, .7],        // in una frase
  ];
  return {
    titolo: 'Anche l’elettrone è un’onda', durata: 106.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 50.0, 'l’onda di de Broglie'], [50.0, 72.9, 'un elettrone alla volta'], [72.9, T_FINE, 'le frange degli elettroni']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSinistra(ctx, t); scenaDestra(ctx, t); scenaFine(ctx, t); },
  };
});
