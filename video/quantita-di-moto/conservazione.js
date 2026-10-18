'use strict';
/* Il rinculo — conservazione della quantità di moto in un sistema isolato: cannone (200 kg) e palla (10 kg) fermi,
   lo sparo (forze interne, 12 000 N per 0,05 s) dà alla palla 60 m/s avanti e al cannone 3 m/s indietro, 600 kg·m/s
   ciascuno e totale zero; il razzo che spinge i gas indietro, anche nel vuoto. Moti veri, calcolati. Argomento: quantita-di-moto. */
CVIDEO.registra('quantita-di-moto/conservazione', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, card, ball, arrowHead, crossMark } = M;

  // ---------- il cannone: la fisica ----------
  const M1 = 200, M2 = 10, FG = 12000, T = .05;        // cannone, palla; forza dei gas e durata dello sparo
  const A1 = FG / M1, A2 = FG / M2;                    // 60 m/s² e 1200 m/s²
  const V1 = A1 * T, V2 = A2 * T;                      // 3 m/s (indietro) e 60 m/s (avanti)
  const PXM = 150;                                     // px per metro
  // spostamenti in metri (cannone verso sinistra, palla verso destra); alla fine dello sparo la palla ha fatto
  // 1,5 m e il cannone 7,5 cm: 1,575 m relativi, la lunghezza della canna
  const sC = tau => tau <= T ? A1 * tau * tau / 2 : A1 * T * T / 2 + V1 * (tau - T);
  const sP = tau => tau <= T ? A2 * tau * tau / 2 : A2 * T * T / 2 + V2 * (tau - T);
  const LENTO = 25, TS = 30.9, TF1 = TS + .03 * LENTO, TR1 = 37.1, TF2 = TR1 + .105 * LENTO;   // fermo a 0,03 s e a 0,135 s
  const tauC = t => t < TS ? 0 : t < TF1 ? (t - TS) / LENTO : t < TR1 ? .03 : t < TF2 ? .03 + (t - TR1) / LENTO : .135;

  // ---------- il razzo: sbuffi di 2 kg spinti indietro a 30 m/s rispetto al razzo, uno ogni 0,6 s ----------
  // conservazione a ogni sbuffo: M·v = (M − 2)·v′ + 2·(v′ − 30)  →  v′ = v + 2·30/M
  const MR0 = 60, DM = 2, U = 30, DTP = .6, NP = 10, PXR = 6;
  const SBUFFI = [];
  { let m = MR0, v = 0, x = 0, t0 = 0;
    for (let k = 0; k < NP; k++) {
      const tk = k * DTP; x += v * (tk - t0); t0 = tk;
      const vn = v + DM * U / m; m -= DM;
      SBUFFI.push({ tau: tk, x, v: vn, m, vg: vn - U });   // x: dove sta la coda quando parte lo sbuffo
      v = vn;
    } }
  function razzo(tau) {   // stato del razzo al tempo vero tau dall'accensione
    let x = 0, v = 0, m = MR0, pg = 0, last = 0;
    for (const s of SBUFFI) { if (s.tau > tau) break; x = s.x; last = s.tau; v = s.v; m = s.m; pg += DM * s.vg; }
    return { x: x + v * (tau - last), v, m, pg };
  }
  const TE = 63.8, TFR = TE + 3.5, TRR = 74.5;   // accensione, fermo immagine, ripartenza
  const tauR = t => t < TE ? -1 : t < TFR ? t - TE : t < TRR ? 3.5 : 3.5 + (t - TRR);

  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [83.2, 190], [84.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [83.2, 1050], [84.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [83.2, 2.2], [84.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [83.2, 2], [84.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [83.2, -1.5], [84.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.7, 'pensa'], [24.7, 'felice'],
    [29.3, 'sorpreso'], [32.2, 'neutro'], [50.8, 'festa'], [54.7, 'neutro'], [58.7, 'felice'], [63.3, 'neutro'],
    [71.5, 'pensa'], [74.4, 'sorpreso'], [78.7, 'felice'], [83.2, 'neutro'], [85.8, 'felice'], [89.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Il cannone spara la palla avanti:\nperché lui va indietro?'],
    [7.9, 11.6, 'Cannone: 200 kg, su ruote.\nPalla: 10 kg.'],
    [11.7, 15.9, 'Tutto è fermo: la quantità di moto\ntotale è {x:zero}.'],
    [16.0, 20.6, 'Peso e spinta del suolo si annullano;\nl’attrito delle ruote è trascurabile.'],
    [20.7, 24.6, 'Forze esterne a risultante nulla:\nil sistema è {v:isolato}.'],
    [24.7, 29.1, 'In un sistema isolato la quantità\ndi moto totale {g:si conserva}.'],
    [29.3, 32.1, 'Sparo, al rallentatore 25 volte…'],
    [32.2, 37.0, 'Sono forze {v:interne}: i gas spingono\nla palla avanti e il cannone indietro.'],
    [37.1, 41.9, 'La palla esce a 60 m/s,\nil cannone rincula a 3 m/s.'],
    [42.2, 46.5, 'Palla: 10 kg · 60 m/s = {x:600 kg·m/s}\nin avanti.'],
    [46.6, 50.7, 'Cannone: 200 kg · 3 m/s = {x:600 kg·m/s}\nall’indietro.'],
    [50.8, 54.6, 'Opposte e uguali: il totale\nresta {g:zero}, come prima.'],
    [54.7, 58.6, 'Le velocità sono opposte e\n{g:inversamente proporzionali} alle masse.'],
    [58.7, 62.9, 'Massa 20 volte più grande,\nvelocità 20 volte più piccola.'],
    [63.3, 67.5, 'Il razzo fa lo stesso: spinge\ni gas {g:indietro}…'],
    [67.6, 71.4, '…e i gas spingono il razzo {g:avanti}.'],
    [71.5, 74.3, '{r:Spinge contro l’aria?}'],
    [74.4, 78.6, 'No: nel {g:vuoto} non c’è aria,\neppure il razzo accelera.'],
    [78.7, 82.9, 'Gas indietro, razzo avanti:\nil totale resta {g:zero}.'],
    [85.8, 90.8, 'Con sole forze interne, la quantità\ndi moto totale non cambia.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 7) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1.4, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    if (L > 14 * s) {
      ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    }
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  function fermo(ctx, x, y, al, testo) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
    if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
    else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
    txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));

  // ---------- il cannone ----------
  // 150 px per metro: la canna (1,575 m) è lunga 236 px; il disegno del cannone è in scala con lei
  const XB0 = 560, YG = 450, YC = 360, LB = 1.575 * PXM, RP = 20, PS = .3;   // culatta, suolo, asse della canna; 0,3 px per kg·m/s
  function cannone(ctx, xb) {
    ctx.save(); ctx.lineJoin = 'round';
    const scuro = mix(C.dim, C.ink, .35), chiaro = mix(C.dim, C.paper, .55);
    ctx.fillStyle = css(chiaro); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(xb - 34, 384); ctx.lineTo(xb + 214, 384); ctx.lineTo(xb + 190, 428); ctx.lineTo(xb - 14, 428); ctx.closePath(); ctx.fill(); ctx.stroke();   // l'affusto
    ctx.fillStyle = css(mix(C.dim, C.paper, .3));
    ctx.beginPath(); ctx.roundRect(xb - 26, YC - 34, LB + 26, 68, [34, 8, 8, 34]); ctx.fill(); ctx.stroke();   // la canna
    ctx.beginPath(); ctx.roundRect(xb + LB - 12, YC - 40, 22, 80, 5); ctx.fill(); ctx.stroke();                // la bocca
    for (const dx of [10, 170]) {   // le ruote
      ctx.fillStyle = css(C.paper); ctx.lineWidth = 7; ctx.strokeStyle = css(scuro);
      ctx.beginPath(); ctx.arc(xb + dx, YG - 30, 27, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = css(scuro); ctx.beginPath(); ctx.arc(xb + dx, YG - 30, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // il sistema: cannone e palla (la massa dei gas è trascurabile)
  function sceneCannone(ctx, t) {
    if (t < 7.5 || t > 63.2) return;
    const al = life(t, 7.6, 63.0, .6, .5);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 400);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, YG); ctx.lineTo(1812, YG); ctx.stroke();
    const tau = tauC(t), xb = XB0 - sC(tau) * PXM, xp = XB0 + RP + sP(tau) * PXM, xm = xb + 100;   // xm: metà del cannone
    cannone(ctx, xb);
    txt(ctx, 'massa dei gas trascurabile', 404, 150, { size: 30, color: C.dim, align: 'left', alpha: life(t, 29.4, 62.8, .4, .4) });
    ball(ctx, xp, YC, '', mix(C.ink, C.dim, .3), { r: RP });
    txt(ctx, 'cannone 200 kg', xm, 482, { size: 30, weight: 600 });
    txt(ctx, 'palla 10 kg', XB0 + RP, 290, { size: 30, weight: 600, alpha: life(t, 8.2, 29.2, .4, .4) * (1 - P(t, 16.0, 16.4)) });
    // le forze esterne: peso e spinta del suolo, uguali e opposte (210 kg · 9,8 m/s² ≈ 2058 N; 0,04 px per newton)
    const kE = life(t, 16.1, 29.2, .4, .4);
    if (kE > 0) {
      freccia(ctx, [xm - 30, 350], [xm - 30, 350 + 82], C.y, kE);
      freccia(ctx, [xm + 30, YG], [xm + 30, YG - 82], C.y, kE);
      drawRich(ctx, '{y:peso}\n{y:2058 N}', xm - 50, 268, { size: 30, align: 'right', alpha: kE });
      drawRich(ctx, '{y:spinta del suolo}\n{y:2058 N}', xm + 50, 268, { size: 30, align: 'left', alpha: kE });
    }
    // le forze interne durante lo sparo: 12 000 N sulla palla e 12 000 N sul cannone (0,01 px per newton)
    const kI = tau > 0 && tau < T ? P(t, TS, TS + .2) : 0;
    if (kI > 0) {
      freccia(ctx, [xp, YC], [xp + 120, YC], C.y, kI, 8);
      freccia(ctx, [xb - 30, YC], [xb - 150, YC], C.y, kI, 8);
      const kL = life(t, TF1, TR1, .3, .2);
      drawRich(ctx, '{y:sulla palla}\n{y:12 000 N}', xp + 90, 262, { size: 30, alpha: kL });
      drawRich(ctx, '{y:sul cannone}\n{y:12 000 N}', xb - 90, 262, { size: 30, alpha: kL });
    }
    // le velocità dopo lo sparo
    const kV = tau >= T ? P(t, TR1 + .65, TR1 + 1.0) : 0;
    if (kV > 0) {
      txt(ctx, '60 m/s', xp, 414, { size: 30, weight: 600, color: C.x, alpha: kV });
      txt(ctx, '3 m/s', xm, 290, { size: 30, weight: 600, color: C.x, alpha: kV });
    }
    // le quantità di moto, a film fermo
    const kP = P(t, 42.4, 42.9), kQ = P(t, 46.8, 47.3);
    if (kP > 0) {
      freccia(ctx, [xp + 28, YC], [xp + 28 + 600 * PS, YC], C.x, kP, 8);
      drawRich(ctx, '{x:600 kg·m/s}', xp + 28 + 300 * PS, 314, { size: 32, alpha: kP });
    }
    if (kQ > 0) {
      freccia(ctx, [xm, 230], [xm - 600 * PS, 230], C.x, kQ, 8);
      drawRich(ctx, '{x:600 kg·m/s}', xm - 300 * PS, 190, { size: 32, alpha: kQ });
    }
    // che tempo si sta guardando
    if (t > TS - .3) {
      const testo = (t >= TF1 && t < TR1) || t >= TF2 ? 'fermo immagine' : 'al rallentatore, 25 volte';
      fermo(ctx, 1420, 150, P(t, TS - .3, TS), testo);
    }
    ctx.restore();
  }

  // ---------- il razzo nel vuoto ----------
  const XR0 = 650, YR = 300, PR = .5;   // coda all'accensione, asse del razzo, 0,5 px per kg·m/s
  const STELLE = Array.from({ length: 46 }, (_, i) => [400 + (i * 397) % 1410, 196 + (i * 211) % 290, 1.5 + (i % 3)]);
  function disegnaRazzo(ctx, xt, fiamma) {
    ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    if (fiamma > 0) {
      ctx.fillStyle = css(C.y, .8 * fiamma);
      ctx.beginPath(); ctx.moveTo(xt, YR - 18); ctx.lineTo(xt - 60 * fiamma, YR); ctx.lineTo(xt, YR + 18); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css(mix(C.dim, C.paper, .45));
    ctx.beginPath(); ctx.moveTo(xt + 10, YR - 28); ctx.lineTo(xt - 20, YR - 58); ctx.lineTo(xt + 40, YR - 28); ctx.closePath(); ctx.fill(); ctx.stroke();   // alette
    ctx.beginPath(); ctx.moveTo(xt + 10, YR + 28); ctx.lineTo(xt - 20, YR + 58); ctx.lineTo(xt + 40, YR + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(mix(C.dim, C.paper, .7));
    ctx.beginPath(); ctx.moveTo(xt, YR - 28); ctx.lineTo(xt + 170, YR - 28); ctx.quadraticCurveTo(xt + 220, YR - 20, xt + 240, YR);
    ctx.quadraticCurveTo(xt + 220, YR + 20, xt + 170, YR + 28); ctx.lineTo(xt, YR + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.x, .5); ctx.beginPath(); ctx.arc(xt + 150, YR, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // l'oblò
    ctx.restore();
  }
  function sceneRazzo(ctx, t) {
    if (t < 62.8 || t > 83.8) return;
    const al = life(t, 63.0, 83.6, .5, .6);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 400);
    ctx.save(); ctx.beginPath(); ctx.roundRect(374, 110, 1464, 396, 20); ctx.clip();
    for (const [x, y, r] of STELLE) { ctx.fillStyle = css(C.dim, .45); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    txt(ctx, 'nello spazio, niente aria · sbuffi di gas di 2 kg a 30 m/s', 404, 150, { size: 30, color: C.dim, align: 'left' });
    const tau = tauR(t), R = razzo(Math.max(tau, 0)), xt = XR0 + R.x * PXR;
    // gli sbuffi di gas: ognuno va per conto suo, alla sua velocità
    for (const s of SBUFFI) {
      if (tau < s.tau) break;
      const d = tau - s.tau, x = XR0 + (s.x + s.vg * d) * PXR;
      ctx.fillStyle = css(C.dim, .5 * (1 - clamp(d / 4) * .6));
      ctx.beginPath(); ctx.arc(x - 16, YR, 14 + 16 * clamp(d / .8), 0, Math.PI * 2); ctx.fill();
    }
    let fiamma = 0;
    for (const s of SBUFFI) { const d = tau - s.tau; if (d >= 0 && d < .2) fiamma = 1 - d / .2; }
    disegnaRazzo(ctx, xt, fiamma);
    // le quantità di moto: del razzo in avanti, di tutti i gas indietro
    const kP = P(t, 67.7, 68.2), pr = R.m * R.v, xc = xt + 110;
    if (kP > 0 && pr > 1) {
      freccia(ctx, [xc, 400], [xc + pr * PR, 400], C.x, kP, 8);
      freccia(ctx, [xt - 10, 400], [xt - 10 + R.pg * PR, 400], C.x, kP, 8);
      drawRich(ctx, '{x:razzo}', xc + pr * PR / 2, 442, { size: 30, alpha: kP });
      drawRich(ctx, '{x:gas}', xt - 10 + R.pg * PR / 2, 442, { size: 30, alpha: kP });
    }
    ctx.restore();
    if (t > TE - .3) fermo(ctx, 1420, 150, P(t, TE - .3, TE), t >= TFR && t < TRR ? 'fermo immagine' : 'tempo reale');
    ctx.restore();
  }

  // ---------- la scheda in basso ----------
  const PY = 530, PH = 270, PC = 1106;
  function riga(ctx, nome, a, b, c, y, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    txt(ctx, nome, 420, y, { size: 34, weight: 600, align: 'left' });
    drawRich(ctx, a, 800, y, { size: 36 }); drawRich(ctx, b, 1110, y, { size: 36 }); drawRich(ctx, c, 1560, y, { size: 36 });
    ctx.restore();
  }
  function sceneScheda(ctx, t) {
    if (t < 11.5 || t > 83.8) return;
    const al = life(t, 11.7, 83.6, .5, .6);
    card(ctx, 372, PY, 1468, PH, al);
    ctx.save(); ctx.globalAlpha *= al;
    // 1 · prima dello sparo
    const a1 = life(t, 11.7, 29.3, .4, .4);
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha *= a1;
      drawRich(ctx, 'quantità di moto totale: {x:0 kg·m/s}', PC, 590, { size: 40, local: t - 12.0, stagger: .04 });
      drawRich(ctx, '{y:forze esterne}: risultante nulla → sistema {v:isolato}', PC, 665, { size: 36, local: t - 20.8, stagger: .04 });
      drawRich(ctx, '{mx:p} totale prima = {mx:p} totale dopo', PC, 742, { size: 44, weight: 600, local: t - 24.8, stagger: .06 });
      ctx.restore();
    }
    // 2 · dopo lo sparo
    const a2 = life(t, 42.2, 63.0, .4, .5);
    if (a2 > 0) {
      ctx.save(); ctx.globalAlpha *= a2;
      for (const [x, s] of [[800, 'massa'], [1110, 'velocità'], [1560, 'quantità di moto']]) txt(ctx, s, x, 568, { size: 30, color: C.dim });
      riga(ctx, 'palla', '{mink:m₂} = 10 kg', '{mx:v₂} = 60 m/s', '{mink:m₂·}{mx:v₂} = 600 kg·m/s', 620, P(t, 42.4, 42.9));
      riga(ctx, 'cannone', '{mink:m₁} = 200 kg', '{mx:v₁} = −3 m/s', '{mink:m₁·}{mx:v₁} = −600 kg·m/s', 674, P(t, 46.8, 47.3));
      const kL = P(t, 50.9, 51.3);
      ctx.save(); ctx.globalAlpha *= kL; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(410, 710); ctx.lineTo(1800, 710); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{mink:m₁·}{mx:v₁}{mink: + m₂·}{mx:v₂}{mink: = 0}', 760, 756, { size: 44, local: t - 51.0, stagger: .1 });
      drawRich(ctx, '{mx:v₁}{mink: / }{mx:v₂}{mink: = −m₂ / m₁ = −1/20}', 1450, 756, { size: 40, local: t - 54.9, stagger: .1 });
      ctx.restore();
    }
    // 3 · il razzo
    const a3 = life(t, 67.7, 83.6, .4, .6);
    if (a3 > 0) {
      ctx.save(); ctx.globalAlpha *= a3;
      const R = razzo(Math.max(tauR(t), 0)), pr = R.m * R.v;
      const val = (nome, v, y, col) => {
        txt(ctx, nome, 420, y, { size: 34, weight: 600, align: 'left' });
        txt(ctx, (Math.abs(v) < .5 ? '0' : fmtN(v, 0)) + ' kg·m/s', 1010, y, { size: 36, weight: 600, color: col, align: 'right' });
      };
      txt(ctx, 'quantità di moto', 1010, 568, { size: 30, color: C.dim, align: 'right' });
      val('razzo', pr, 620, C.x);
      val('gas', R.pg, 674, C.x);
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(410, 710); ctx.lineTo(1030, 710); ctx.stroke();
      val('totale', pr + R.pg, 754, C.g);
      // l'idea sbagliata
      const kR = P(t, 71.6, 72.1);
      if (kR > 0) {
        drawRich(ctx, '{r:«Il razzo spinge contro l’aria?»}', 1450, 610, { size: 38, alpha: kR });
        const kx = P(t, 74.5, 75.0);
        if (kx > 0) {
          ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(1170, 612); ctx.lineTo(1170 + 560 * kx, 612); ctx.stroke(); ctx.restore();
        }
        drawRich(ctx, 'nel {g:vuoto} accelera lo stesso:', 1450, 690, { size: 36, alpha: P(t, 75.0, 75.5) });
        drawRich(ctx, 'spinge i gas, non l’aria', 1450, 742, { size: 36, alpha: P(t, 75.4, 75.9) });
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- titolo e riassunto ----------
  function sceneIntro(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il rinculo', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function sceneFine(ctx, t) {
    if (t < 83.4) return;
    const al = 1 - P(t, 91.6, 92.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 83.6 });
      drawRich(ctx, 'In un sistema isolato la quantità\ndi moto totale {g:si conserva}.', W / 2, 290, { size: 66, weight: 600, local: t - 84.0, stagger: .09 });
    });
    const pills = [[490, 'cannone indietro,\npalla avanti: totale {g:zero}'], [960, '{mink:m₁·}{mx:v₁}{mink: + m₂·}{mx:v₂}{mink: = 0}\npartendo da fermi'], [1430, 'il razzo spinge i gas:\nfunziona {g:nel vuoto}']];
    pills.forEach(([x, s], i) => {
      const a = 86.0 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.2, .6],                                                // cannone e palla
    ['soffio', 11.7], ['pop', 12.0, .4],                                              // la scheda: totale zero
    ['pop', 16.1, .45], ['pop', 20.8, .5], ['pop', 24.8, .65],                        // forze esterne, isolato, si conserva
    ['pop', 30.9, .15], ['tono', 30.9, 31.65, [.1, .12, .17]],                        // lo sparo: la palla parte
    ['tono', 37.1, 39.7, [.17, .35, .53, .72, .9]], ['pop', 37.75, .5],               // la palla esce, il cannone rincula
    ['pop', 42.4, .7], ['pop', 46.8, .3],                                             // 600 avanti, 600 indietro
    ['traccia', 50.9, 51.3],                                                          // la somma: zero
    ['pop', 54.9, .55],                                                               // v1/v2 = −1/20
    ['soffio', 63.0],                                                                 // il razzo nel vuoto
    ['pop', 63.8, .4], ['tono', 63.8, 66.8, [.08, .17, .26, .35, .45, .55]],          // uno sbuffo dopo l'altro, il razzo accelera
    ['pop', 67.7, .55],                                                               // razzo avanti, gas indietro
    ['pop', 71.6, .2], ['traccia', 74.5, 75.0], ['pop', 75.0, .55], ['pop', 75.4, .65],   // contro l'aria? no: nel vuoto
    ['tono', 74.6, 76.4, [.55, .65, .76, .88, .99]],                                  // riparte e accelera ancora
    ['soffio', 83.4], ['pop', 86.0, .5], ['pop', 86.5, .6], ['pop', 87.0, .7],        // in una frase
  ];
  return {
    titolo: 'Il rinculo', durata: 93.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 29.2, 'un sistema isolato'], [29.2, 63.0, 'lo sparo'], [63.0, 83.2, 'il razzo']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneCannone(ctx, t); sceneRazzo(ctx, t); sceneScheda(ctx, t); sceneFine(ctx, t); },
  };
});
