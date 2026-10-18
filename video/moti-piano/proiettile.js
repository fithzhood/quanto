'use strict';
/* Cadono insieme — da 4,9 m una pallina lasciata cadere e una lanciata in orizzontale toccano terra insieme, dopo 1 s:
   il moto orizzontale (uniforme) e quello verticale (accelerato con g) sono indipendenti. Senza aria. Argomento: moti-piano. */
CVIDEO.registra('moti-piano/proiettile', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, ball, card, arrowHead, glowStroke, crossMark } = M;

  // ---------- il moto vero: x = vₓ·t, caduta = ½·g·t² ----------
  const G = 9.8, H = 4.9;                       // m/s², altezza di partenza in m: tempo di caduta √(2·4,9/9,8) = 1 s
  const PX = 90, YG = 730, YL = YG - H * PX;    // 90 px per metro, suolo, quota di partenza (y 289)
  const XA = 525, XB = 575, RX = 440;           // A cade lungo x 525, B parte da x 575; righello in x 440
  const caduta = tau => G * tau * tau / 2;
  // tre lanci, tutti al rallentatore 4 volte (1 s di volo = 4 s di video)
  const L1 = 21.6, L2 = 51.6, FERMO = [54.0, 68.6], L3 = 77.8;
  const tau1 = t => clamp((t - L1) / 4);
  // il secondo lancio si ferma a 0,6 s (fermo immagine) e poi riparte
  const tau2 = t => t < FERMO[0] ? clamp((t - L2) / 4) : t < FERMO[1] ? .6 : clamp(.6 + (t - FERMO[1]) / 4);
  const tau3 = t => clamp((t - L3) / 4);
  const pos = (vx, tau, x0) => [x0 + vx * tau * PX, YL + caduta(tau) * PX];
  const VS = 20;                                // frecce delle velocità: 20 px per m/s
  const AS = 7.5;                               // freccia dell'accelerazione: 7,5 px per m/s²

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [91.6, 190], [92.9, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [91.6, 1050], [92.9, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [91.6, 2.2], [92.9, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [91.6, 2], [92.9, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [91.6, -1.5], [92.9, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.2, 'pensa'], [21.6, 'neutro'],
    [25.8, 'festa'], [29.0, 'neutro'], [43.2, 'felice'], [47.6, 'neutro'], [64.3, 'pensa'], [68.6, 'felice'],
    [72.3, 'neutro'], [82.3, 'sorpreso'], [86.5, 'neutro'], [94.2, 'felice'], [97.4, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Una pallina cade, l’altra parte\nin orizzontale: chi arriva prima?'],
    [7.9, 12.3, 'Partono dalla stessa altezza,\n{mink:h} = 4,9 m. Senza aria.'],
    [12.5, 17.0, '{mink:A} la lascio cadere, {mink:B} la lancio\nin orizzontale a 3 m/s.'],
    [17.2, 21.4, '{mr:B}{r: ha più velocità: resterà}\n{r:in aria più a lungo?}'],
    [21.6, 25.6, 'Partono insieme, al rallentatore\n(4 volte più lento)…'],
    [25.8, 28.8, '…e toccano terra {g:insieme}!'],
    [29.0, 33.8, 'Una foto ogni 0,2 s: {mink:A} e {mink:B} sono\nsempre {g:alla stessa altezza}.'],
    [34.0, 38.4, 'In verticale, passi sempre più\nlunghi: {g:uguali} per {mink:A} e {mink:B}.'],
    [38.6, 43.0, 'In orizzontale {mink:B} fa passi {g:uguali}:\n60 cm ogni 0,2 s.'],
    [43.2, 47.4, 'I due moti sono {v:indipendenti}:\nuno non disturba l’altro.'],
    [47.6, 51.0, 'La traiettoria di {mink:B}\nè una {v:parabola}.'],
    [51.2, 54.7, 'Rilancio, con le frecce\ndelle {x:velocità}.'],
    [54.8, 59.6, 'Fermo a 0,6 s: in giù tutte e due\nvanno a {x:5,9 m/s}.'],
    [59.8, 64.1, '{mink:B} ha in più 3 m/s di lato:\nquelli della partenza.'],
    [64.3, 68.4, 'Su tutte e due, la stessa\naccelerazione {mv:g}, in giù.'],
    [68.6, 72.1, 'Ripartono: a terra\nancora {g:insieme}, dopo 1 s.'],
    [72.3, 77.4, 'Partendo in orizzontale, conta solo {mink:h}:\n{mink:t = √(2h/}{mv:g}{mink:)} = 1 s.'],
    [77.6, 82.1, 'Lancio {mink:B} più forte, a 6 m/s:\narriva {g:due volte} più lontano…'],
    [82.3, 86.3, '…ma tocca terra {g:ancora dopo 1 s},\ninsieme ad {mink:A}.'],
    [86.5, 91.5, 'Distanza: velocità di lato\nper tempo, 3 m e 6 m.'],
    [94.2, 99.0, 'Il moto di lato non cambia\nla caduta: arrivano {g:insieme}.'],
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
  // la pallina col suo nome sopra
  function pallina(ctx, p, nome, al, kn = 1) {
    if (al <= 0) return;
    ball(ctx, p[0], p[1], '', C.y, { r: 16, alpha: al });
    drawRich(ctx, `{mink:${nome}}`, p[0] + (nome === 'B' ? 24 : 0), p[1] - 42, { size: 40, alpha: al * kn });
  }
  function righello(ctx, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(RX, YG); ctx.lineTo(RX, YL); ctx.stroke();
    for (let i = 0; i <= 10; i++) {
      const v = Math.min(H, i * .5), y = YG - v * PX, lungo = i % 2 === 0 || v === H;
      ctx.beginPath(); ctx.moveTo(RX - (lungo ? 12 : 6), y); ctx.lineTo(RX, y); ctx.stroke();
      if (lungo) txt(ctx, v === H ? '4,9' : String(i / 2), RX - 18, y, { size: 30, color: C.dim, align: 'right' });
    }
    txt(ctx, 'm', RX, YL - 40, { size: 30, color: C.dim });
    ctx.restore();
  }
  // il lancio attivo e il suo tempo (per l'orologio)
  const tauAttivo = t => t < 51.2 ? tau1(t) : t < 77.0 ? tau2(t) : tau3(t);
  const inMoto = t => life(t, L1 - .2, L1 + 4.2, .3, .4) + life(t, L2 - .2, FERMO[0] + .2, .3, .3) + life(t, FERMO[1] - .2, FERMO[1] + 1.8, .3, .4) + life(t, L3 - .2, L3 + 4.2, .3, .4);

  // ---------- il palco ----------
  function scenaPalco(ctx, t) {
    if (t < 7.5 || t > 92.2) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 91.4, 92.0));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 810, 692);
    ctx.fillStyle = css(C.g, .26); ctx.beginPath(); ctx.roundRect(373, YG, 808, 69, [0, 0, 21, 21]); ctx.fill();
    righello(ctx, P(t, 8.0, 8.6));
    ctx.save(); ctx.globalAlpha *= P(t, 8.0, 8.6); ctx.setLineDash([10, 10]); ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(480, YL); ctx.lineTo(1165, YL); ctx.stroke(); ctx.restore();
    conFont(TITOLI, () => drawRich(ctx, 'senza aria', 404, 156, { size: 36, weight: 600, align: 'left', alpha: P(t, 8.0, 8.6) }));
    drawRich(ctx, '{mink:t} =', 900, 156, { size: 36, align: 'left' });
    fixedNum(ctx, fmtN(tauAttivo(t), 2), 1062, 156, 38, C.ink);
    txt(ctx, 's', 1072, 156, { size: 32, color: C.dim, align: 'left' });
    txt(ctx, 'al rallentatore, 4 volte', 1160, 204, { size: 30, color: C.dim, align: 'right', alpha: clamp(inMoto(t)) });

    // 1 · il primo lancio, con le foto ogni 0,2 s (8–51)
    const a1 = P(t, 8.2, 8.7) * (1 - P(t, 50.6, 51.1));
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha *= a1;
      const ta = tau1(t);
      // la traiettoria di B
      glowStroke(ctx, Array.from({ length: 41 }, (_, i) => pos(3, i / 40, XB)), P(t, 47.8, 49.0), C.v, 4);
      // le foto: una ogni 0,2 s di volo
      const kLin = P(t, 29.2, 29.8), kBr = P(t, 34.2, 34.7), kTk = P(t, 38.8, 39.3);
      for (let k = 0; k <= 5; k++) {
        const tf = L1 + .8 * k; if (t < tf) break;
        const pa = pos(0, .2 * k, XA), pb = pos(3, .2 * k, XB);
        ctx.save(); ctx.globalAlpha *= .4; ball(ctx, pa[0], pa[1], '', C.y, { r: 16 }); ball(ctx, pb[0], pb[1], '', C.y, { r: 16 }); ctx.restore();
        if (kLin > 0 && k) {   // stessa altezza: la linea fra le due foto
          ctx.save(); ctx.globalAlpha *= kLin; ctx.setLineDash([8, 8]); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(pa[0] + 20, pa[1]); ctx.lineTo(lerp(pa[0] + 20, pb[0] - 20, P(t, 29.2 + .1 * k, 29.6 + .1 * k)), pb[1]); ctx.stroke(); ctx.restore();
        }
        if (kTk > 0) {   // i passi di B, uguali: le tacche sul suolo
          ctx.save(); ctx.globalAlpha *= kTk; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(pb[0], YG + 6); ctx.lineTo(pb[0], YG + 30); ctx.stroke(); ctx.restore();
        }
        if (kBr > 0 && k) {   // i passi in verticale: le parentesi accanto ad A
          const ya = pos(0, .2 * (k - 1), XA)[1] + 3, yb = pa[1] - 3;
          ctx.save(); ctx.globalAlpha *= kBr; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(XA - 20, ya); ctx.lineTo(XA - 30, ya); ctx.lineTo(XA - 30, yb); ctx.lineTo(XA - 20, yb); ctx.stroke(); ctx.restore();
        }
      }
      if (kTk > 0) {
        ctx.save(); ctx.globalAlpha *= kTk; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(XB, YG + 18); ctx.lineTo(XB + 270, YG + 18); ctx.stroke(); ctx.restore();
      }
      // la velocità di B prima del lancio
      const kv = life(t, 12.9, L1 + .1, .4, .3);
      if (kv > 0) {
        freccia(ctx, [XB + 18, YL], [XB + 18 + 3 * VS, YL], C.x, kv);
        txt(ctx, '3 m/s', XB + 3 * VS + 34, YL - 26, { size: 30, color: C.x, align: 'left', alpha: kv });
      }
      const kn = 1 - life(t, L1, L1 + 4.3, .25, .3);   // i nomi spariscono durante il volo, per non coprire le foto
      pallina(ctx, pos(0, ta, XA), 'A', 1, kn);
      pallina(ctx, pos(3, ta, XB), 'B', 1, kn);
      ctx.restore();
    }

    // 2 · il secondo lancio, con le frecce (51–77)
    const a2 = P(t, 51.1, 51.5) * (1 - P(t, 76.4, 76.9));
    if (a2 > 0) {
      ctx.save(); ctx.globalAlpha *= a2;
      const ta = tau2(t), vy = G * ta, pa = pos(0, ta, XA), pb = pos(3, ta, XB);
      const kv = life(t, 51.4, 68.4, .3, .4), kl = life(t, 54.9, 64.5, .4, .3), kh = life(t, 59.9, 64.5, .4, .3), kg = life(t, 64.4, 68.4, .4, .4);
      // le velocità: in giù per tutte e due, di lato solo per B
      freccia(ctx, pa, [pa[0], pa[1] + vy * VS], C.x, kv);
      freccia(ctx, pb, [pb[0], pb[1] + vy * VS], C.x, kv);
      freccia(ctx, pb, [pb[0] + 3 * VS, pb[1]], C.x, kv, 7);
      txt(ctx, '5,9 m/s', pa[0] + 16, pa[1] + 64, { size: 30, color: C.x, align: 'left', alpha: kv * kl });
      txt(ctx, '5,9 m/s', pb[0] + 16, pb[1] + 64, { size: 30, color: C.x, align: 'left', alpha: kv * kl });
      txt(ctx, '3 m/s', pb[0] + 3 * VS + 16, pb[1], { size: 30, color: C.x, align: 'left', alpha: kv * kh });
      // l'accelerazione g, la stessa per tutte e due
      for (const p of [pa, pb]) {
        freccia(ctx, [p[0] - 36, p[1] + 4], [p[0] - 36, p[1] + 4 + G * AS], C.v, kg, 6);
        drawRich(ctx, '{mv:g}', p[0] - 60, p[1] + 44, { size: 40, alpha: kg });
      }
      pallina(ctx, pa, 'A', 1);
      pallina(ctx, pb, 'B', 1);
      ctx.restore();
    }

    // 3 · il terzo lancio, a 6 m/s (77–91)
    const a3 = P(t, 77.0, 77.5);
    if (a3 > 0) {
      ctx.save(); ctx.globalAlpha *= a3;
      const ta = tau3(t);
      // la parabola a 3 m/s, per confronto, e quella a 6 m/s che si disegna mentre B vola
      ctx.save(); ctx.globalAlpha *= .45; glowStroke(ctx, Array.from({ length: 41 }, (_, i) => pos(3, i / 40, XB)), 1, C.dim, 3); ctx.restore();
      if (ta > 0) glowStroke(ctx, Array.from({ length: 41 }, (_, i) => pos(6, ta * i / 40, XB)), 1, C.v, 4);
      const kv = life(t, 77.3, L3 + .1, .4, .3);
      if (kv > 0) {
        freccia(ctx, [XB + 18, YL], [XB + 18 + 6 * VS, YL], C.x, kv);
        txt(ctx, '6 m/s', XB + 6 * VS + 34, YL - 26, { size: 30, color: C.x, align: 'left', alpha: kv });
      }
      const kd = P(t, 86.7, 87.2);
      txt(ctx, '3 m', XB + 3 * PX, YG + 40, { size: 30, color: C.dim, alpha: kd });
      txt(ctx, '6 m', XB + 6 * PX, YG + 40, { size: 30, weight: 600, color: C.g, alpha: P(t, 88.4, 88.9) });
      pallina(ctx, pos(0, ta, XA), 'A', 1);
      pallina(ctx, pos(6, ta, XB), 'B', 1);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il pannello a destra ----------
  const PX0 = 1210, PCX = 1525;
  function scenaPannello(ctx, t) {
    if (t < 12.6 || t > 92.2) return;
    const al = P(t, 12.6, 13.1) * (1 - P(t, 91.4, 92.0));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, PX0, 108, 630, 692);
    const tit = (s, a) => conFont(TITOLI, () => drawRich(ctx, s, PCX, 168, { size: 36, weight: 600, alpha: a }));
    const riga = (y) => { ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1250, y); ctx.lineTo(1800, y); ctx.stroke(); };
    // 1 · chi arriva prima
    const s1 = 1 - P(t, 50.6, 51.1);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('chi tocca terra prima?', 1);
      const kT = P(t, L1 + 4, L1 + 4.4);
      drawRich(ctx, '{mink:A}', 1260, 250, { size: 40, align: 'left' });
      drawRich(ctx, '{mink:B}', 1260, 312, { size: 40, align: 'left' });
      txt(ctx, 'lasciata cadere', 1320, 250, { size: 30, color: C.dim, align: 'left' });
      txt(ctx, 'lanciata a 3 m/s', 1320, 312, { size: 30, color: C.dim, align: 'left' });
      txt(ctx, '1,00 s', 1800, 250, { size: 38, weight: 600, color: C.g, align: 'right', alpha: kT });
      txt(ctx, '1,00 s', 1800, 312, { size: 38, weight: 600, color: C.g, align: 'right', alpha: kT });
      const kI = P(t, 17.4, 17.9);
      if (kI > 0) {
        drawRich(ctx, '{mr:B}{r: arriva dopo?}', PCX, 385, { size: 36, alpha: kI });
        const kx = P(t, 26.0, 26.6);
        if (kx > 0) {
          ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1385, 387); ctx.lineTo(lerp(1385, 1665, kx), 387); ctx.stroke(); ctx.restore();
          crossMark(ctx, 1745, 385, P(t, 26.2, 27.0), C.r, .32);
        }
      }
      ctx.save(); ctx.globalAlpha *= P(t, 34.0, 34.5); riga(435); ctx.restore();
      txt(ctx, 'in verticale', 1250, 480, { size: 30, color: C.dim, align: 'left', alpha: P(t, 34.2, 34.7) });
      drawRich(ctx, 'caduta libera, {mv:g} = 9,8 m/s²', 1250, 528, { size: 36, align: 'left', alpha: P(t, 34.4, 34.9) });
      txt(ctx, 'in orizzontale', 1250, 595, { size: 30, color: C.dim, align: 'left', alpha: P(t, 38.8, 39.3) });
      drawRich(ctx, 'uniforme, 3 m/s', 1250, 643, { size: 36, align: 'left', alpha: P(t, 39.0, 39.5) });
      drawRich(ctx, 'moti {v:indipendenti}', PCX, 732, { size: 42, weight: 600, alpha: P(t, 43.4, 43.9), local: t - 43.4 });
      ctx.restore();
    }
    // 2 · le velocità del secondo lancio
    const s2 = life(t, 51.1, 72.0, .4, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('le velocità', 1);
      const vy = G * tau2(t);
      drawRich(ctx, '{mink:A}', 1600, 240, { size: 40 }); drawRich(ctx, '{mink:B}', 1740, 240, { size: 40 });
      txt(ctx, 'in giù (m/s)', 1250, 310, { size: 32, color: C.dim, align: 'left' });
      fixedNum(ctx, fmtN(vy, 1), 1630, 310, 42, C.x); fixedNum(ctx, fmtN(vy, 1), 1770, 310, 42, C.x);
      txt(ctx, 'di lato (m/s)', 1250, 380, { size: 32, color: C.dim, align: 'left', alpha: P(t, 59.9, 60.4) });
      fixedNum(ctx, fmtN(0, 1), 1630, 380, 42, C.x, P(t, 59.9, 60.4)); fixedNum(ctx, fmtN(3, 1), 1770, 380, 42, C.x, P(t, 59.9, 60.4));
      ctx.save(); ctx.globalAlpha *= P(t, 64.4, 64.9); riga(435); ctx.restore();
      txt(ctx, 'accelerazione', 1250, 490, { size: 32, color: C.dim, align: 'left', alpha: P(t, 64.5, 65.0) });
      drawRich(ctx, '{mv:g}', 1600, 490, { size: 42, alpha: P(t, 64.5, 65.0) }); drawRich(ctx, '{mv:g}', 1740, 490, { size: 42, alpha: P(t, 64.5, 65.0) });
      drawRich(ctx, '{mv:g} = 9,8 m/s², verso il basso', PCX, 570, { size: 34, alpha: P(t, 64.8, 65.3) });
      txt(ctx, 'cresce solo la velocità in giù', PCX, 650, { size: 30, color: C.dim, alpha: P(t, 68.8, 69.3) });
      ctx.restore();
    }
    // 3 · il tempo di caduta e la distanza
    const s3 = P(t, 72.0, 72.5);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('tempo di caduta', 1);
      drawRich(ctx, '{mink:t = √(2h/}{mv:g}{mink:)}', PCX, 262, { size: 56, local: t - 72.4 });
      drawRich(ctx, '= √(2·4,9/9,8) = {g:1 s}', PCX, 345, { size: 42, local: t - 73.6 });
      txt(ctx, 'non dipende dalla velocità di lato', PCX, 412, { size: 30, color: C.dim, alpha: P(t, 74.6, 75.1) });
      ctx.save(); ctx.globalAlpha *= P(t, 77.6, 78.1); riga(455); ctx.restore();
      const kh = P(t, 77.7, 78.2);
      txt(ctx, 'di lato', 1320, 505, { size: 30, color: C.dim, alpha: kh });
      txt(ctx, 'tempo', 1525, 505, { size: 30, color: C.dim, alpha: kh });
      txt(ctx, 'distanza', 1730, 505, { size: 30, color: C.dim, alpha: kh });
      txt(ctx, '3 m/s', 1320, 570, { size: 38, color: C.x, alpha: kh });
      txt(ctx, '1 s', 1525, 570, { size: 38, alpha: kh });
      txt(ctx, '3 m', 1730, 570, { size: 38, alpha: P(t, 86.7, 87.2) });
      txt(ctx, '6 m/s', 1320, 640, { size: 38, color: C.x, alpha: P(t, 77.9, 78.4) });
      txt(ctx, '1 s', 1525, 640, { size: 38, weight: 600, color: C.g, alpha: P(t, L3 + 4, L3 + 4.4) });
      txt(ctx, '6 m', 1730, 640, { size: 38, weight: 600, color: C.g, alpha: P(t, 88.4, 88.9) });
      drawRich(ctx, '{dim:distanza = velocità di lato · tempo}', PCX, 725, { size: 30, alpha: P(t, 86.8, 87.3) });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Cadono insieme', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 91.8) return;
    const al = 1 - P(t, 99.6, 100.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.0 });
      drawRich(ctx, 'Di lato moto uniforme, in giù caduta libera:\ni due moti sono {v:indipendenti}.', W / 2, 290, { size: 62, weight: 600, local: t - 92.4, stagger: .08 });
    });
    const pills = [[490, 'lasciata o lanciata:\na terra {g:insieme}'], [960, '{mink:t = √(2h/}{mv:g}{mink:)}\ndipende solo da {mink:h}'], [1430, 'di lato la velocità\nresta {g:costante}']];
    pills.forEach(([x, s], i) => {
      const a = 93.6 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // i toni seguono l'altezza delle palline (caduta ½·g·t², al rallentatore 4 volte)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.0, 8.6],                                           // il righello, h = 4,9 m
    ['pop', 12.9, .5], ['pop', 17.4, .4],                                             // B a 3 m/s; arriva dopo?
    ['tono', 21.6, 25.6, [.9, .85, .7, .45, .1]], ['pop', 25.6, .3],                  // il primo lancio: a terra insieme
    ['traccia', 26.0, 26.6],                                                          // l'ipotesi cancellata
    ['traccia', 29.2, 29.8],                                                          // sempre alla stessa altezza
    ['traccia', 34.2, 34.7], ['pop', 34.4, .5],                                       // in verticale: caduta libera
    ['traccia', 38.8, 39.3], ['pop', 39.0, .5],                                       // in orizzontale: passi uguali
    ['pop', 43.4, .6],                                                                // moti indipendenti
    ['traccia', 47.8, 49.0],                                                          // la parabola
    ['soffio', 51.1], ['tono', 51.6, 54.0, [.9, .88, .83, .74, .61]],                 // il rilancio, fino al fermo a 0,6 s
    ['pop', 54.9, .5], ['pop', 59.9, .55], ['pop', 64.4, .6],                         // 5,9 m/s, 3 m/s di lato, g
    ['tono', 68.6, 70.2, [.61, .51, .39, .25, .1]], ['ding', 70.2],                   // ripartono: a terra insieme
    ['soffio', 72.0], ['pop', 72.4, .6], ['ding', 73.6],                              // t = radice di 2h/g = 1 s
    ['pop', 77.9, .6],                                                                // B a 6 m/s
    ['tono', 77.8, 81.8, [.9, .85, .7, .45, .1]], ['traccia', 77.8, 81.8], ['ding', 81.8],   // due volte più lontano, ancora 1 s
    ['pop', 86.7, .45], ['ding', 88.4],                                               // 3 m e 6 m
    ['soffio', 92.0], ['pop', 93.6, .5], ['pop', 94.1, .6], ['pop', 94.6, .7],        // in una frase
  ];
  return {
    titolo: 'Cadono insieme', durata: 101.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 28.8, 'chi arriva prima'], [28.8, 51.0, 'due moti indipendenti'], [51.0, 72.1, 'le velocità'], [72.1, 91.5, 'il tempo di caduta']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPalco(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
