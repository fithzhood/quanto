'use strict';
/* Si attaccano o rimbalzano — urti fra due carrelli uguali (1 kg, il primo a 4 m/s, il secondo fermo):
   col velcro restano uniti a 2 m/s (p si conserva, l'energia cinetica passa da 8 J a 4 J: urto anelastico);
   con la molla il primo si ferma e il secondo parte a 4 m/s (si conservano p ed energia: urto elastico);
   il pendolo di Newton, e perché ne parte una sola. Moti veri: la molla segue la legge di Hooke, il pendolo θ0·cos(ω·t).
   Argomento: quantita-di-moto. */
CVIDEO.registra('quantita-di-moto/urti', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, ball, arrowHead, checkMark, crossMark } = M;

  // ---------- i carrelli ----------
  const MASSA = 1, V0 = 4, VF = (MASSA * V0 + MASSA * 0) / (2 * MASSA);   // 2 m/s
  const PXM = 100, LC = 150, VEL = 10, MOL = 50;   // px per metro, carrello, spessore del velcro, molla a riposo
  const XA0 = 450, XB0 = 1000;                     // il retro dei due carrelli all'inizio
  const W0 = Math.PI / .1;                         // molla: contatto di 0,1 s (mezzo periodo), compressione massima 4/ω ≈ 12,7 cm
  // 1 · velcro: il primo corre fino a toccare, poi vanno insieme a 2 m/s
  const TA = 16.4, CA = (XB0 - (XA0 + LC + 2 * VEL)) / PXM / V0, FA = TA + CA + 1.5;   // contatto dopo 0,95 s; fermo 1,5 s dopo
  function velcro(t) {
    const s = clamp(t, TA, FA) - TA;
    if (s <= CA) return { xa: XA0 + V0 * s * PXM, xb: XB0, va: V0, vb: 0 };
    const d = (s - CA) * VF * PXM;
    return { xa: XA0 + V0 * CA * PXM + d, xb: XB0 + d, va: VF, vb: VF };
  }
  // 2 · molla: durante il contatto vA = 2 + 2·cos(ωτ), vB = 2 − 2·cos(ωτ); dopo, A fermo e B a 4 m/s
  const TB = 50.0, CB = (XB0 - (XA0 + LC + MOL)) / PXM / V0, DC = .1, FB = TB + CB + 1.4;
  function molla(t) {
    const s = clamp(t, TB, FB) - TB;
    if (s <= CB) return { xa: XA0 + V0 * s * PXM, xb: XB0, va: V0, vb: 0 };
    const xa0 = XA0 + V0 * CB * PXM, u = Math.min(s - CB, DC);
    let xa = xa0 + (2 * u + 2 / W0 * Math.sin(W0 * u)) * PXM, xb = XB0 + (2 * u - 2 / W0 * Math.sin(W0 * u)) * PXM;
    let va = 2 + 2 * Math.cos(W0 * u), vb = 2 - 2 * Math.cos(W0 * u);
    if (s - CB > DC) { xb += V0 * (s - CB - DC) * PXM; va = 0; vb = V0; }
    return { xa, xb, va, vb };
  }

  // ---------- il pendolo di Newton: L = 0,25 m, θ0 = 20°, ω = √(g/L) ≈ 6,26 rad/s, T ≈ 1,00 s ----------
  const G = 9.8, LP = .25, OM = Math.sqrt(G / LP), TPER = 2 * Math.PI / OM, TH0 = 20 * Math.PI / 180;
  const LENTO = 3, TP0 = 71.2, TPF = TP0 + LENTO * 1.5 * TPER, TPR = 83.3;   // lancio; fermo con la biglia di destra in alto; ripartenza
  const sP = t => t < TP0 ? -1 : t < TPF ? (t - TP0) / LENTO : t < TPR ? 1.5 * TPER : 1.5 * TPER + (t - TPR) / LENTO;
  function angoli(s) {   // [θ della prima biglia, θ dell'ultima]; le tre in mezzo restano ferme
    if (s < 0) return [-TH0, 0];
    const u = s % TPER;
    if (u < TPER / 4) return [-TH0 * Math.cos(OM * u), 0];
    if (u < 3 * TPER / 4) return [0, TH0 * Math.sin(OM * (u - TPER / 4))];
    return [-TH0 * Math.sin(OM * (u - 3 * TPER / 4)), 0];
  }

  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [87.5, 190], [88.8, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [87.5, 1050], [88.8, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [87.5, 2.2], [88.8, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [87.5, 2], [88.8, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [87.5, -1.5], [88.8, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.1, 'sorpreso'], [19.1, 'neutro'],
    [22.7, 'felice'], [27.8, 'neutro'], [32.2, 'pensa'], [36.5, 'neutro'], [46.0, 'neutro'], [49.7, 'sorpreso'],
    [53.9, 'felice'], [59.0, 'neutro'], [67.3, 'neutro'], [71.0, 'sorpreso'], [75.8, 'pensa'], [79.4, 'neutro'],
    [83.3, 'festa'], [87.5, 'neutro'], [90.0, 'felice'], [93.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Due carrelli si scontrano:\nche cosa si conserva?'],
    [7.9, 12.2, 'Carrelli da 1 kg, attrito della rotaia\n{g:trascurabile}, velcro sul muso.'],
    [12.25, 16.0, 'Il primo va a 4 m/s,\nl’altro è fermo.'],
    [16.1, 19.0, 'Si urtano… e restano {g:attaccati}!'],
    [19.1, 22.6, 'Ripartono insieme a {x:2 m/s}:\nmetà velocità.'],
    [22.7, 27.7, 'Quantità di moto {mx:p}: 4 kg·m/s prima\ne {g:4 kg·m/s} dopo.'],
    [27.8, 32.1, 'Energia cinetica: {g:8 J} prima,\nsolo {g:4 J} dopo.'],
    [32.2, 36.4, 'La metà è diventata energia interna:\ndeformazione e calore.'],
    [36.5, 41.0, 'Urto {v:completamente anelastico}:\nsi conserva {mx:p}, non l’energia cinetica.'],
    [41.1, 45.6, 'Se restano uniti, la velocità finale\nè {mx:p} totale diviso massa totale.'],
    [46.0, 49.6, 'Ora con una molla al posto\ndel velcro.'],
    [49.7, 53.8, 'Il primo si {g:ferma}, il secondo\nparte a 4 m/s!'],
    [53.9, 58.9, 'Quantità di moto: 4 prima, 4 dopo.\nEnergia: 8 J prima, {g:8 J} dopo.'],
    [59.0, 63.0, 'È un urto {v:elastico}: si conservano\n{mx:p} e l’energia cinetica.'],
    [63.1, 66.9, 'Fra masse uguali, una ferma:\nsi {g:scambiano} le velocità.'],
    [67.3, 70.9, 'Il pendolo di Newton: cinque\nbiglie uguali appese.'],
    [71.0, 75.1, 'Ne lancio una… e ne parte\n{g:una sola}, dall’altra parte.'],
    [75.8, 79.3, '{r:E se ne partissero due,}\n{r:a metà velocità?}'],
    [79.4, 83.2, 'La quantità di moto tornerebbe,\nma l’energia sarebbe {r:metà}.'],
    [83.3, 87.4, 'Ne parte una: solo così si\nconservano {g:tutte e due}.'],
    [90.0, 95.0, 'In un sistema isolato, in ogni urto\nsi conserva la {mx:p} {g:totale}.'],
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

  // ---------- la rotaia e i carrelli ----------
  const YC = 318, YR = 380, VS = 30;   // centro dei carrelli, rotaia, 30 px per m/s
  function carrello(ctx, xb, nome) {
    ctx.save();
    ctx.fillStyle = css(C.ink);
    for (const dx of [32, 118]) { ctx.beginPath(); ctx.arc(xb + dx, YR - 14, 14, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = css(mix(C.dim, C.paper, .72)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(xb, YC - 36, LC, 72, 10); ctx.fill(); ctx.stroke();
    txt(ctx, nome, xb + LC / 2, YC + 1, { size: 30, weight: 600 });
    ctx.restore();
  }
  function strisciaVelcro(ctx, x) {   // una striscia pelosa larga VEL
    ctx.save(); ctx.fillStyle = css(mix(C.dim, C.paper, .35)); ctx.fillRect(x, YC - 26, VEL, 52);
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 1.5; ctx.beginPath();
    for (let y = YC - 24; y < YC + 26; y += 6) { ctx.moveTo(x, y); ctx.lineTo(x + VEL, y + 3); }
    ctx.stroke(); ctx.restore();
  }
  function mollaDisegno(ctx, x0, x1) {   // la molla fra x0 e x1, a zig zag
    ctx.save(); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x0, YC);
    const n = 5, L = x1 - x0 - 4;
    for (let i = 1; i <= n; i++) ctx.lineTo(x0 + 2 + L * (i - .5) / n, YC + (i % 2 ? -16 : 16));
    ctx.lineTo(x1, YC); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.fillRect(x1 - 3, YC - 18, 5, 36);
    ctx.restore();
  }
  function velocita(ctx, xb, v, al) {
    if (al <= 0 || v < .05) return;
    const x = xb + LC / 2 - v * VS / 2;
    freccia(ctx, [x, 238], [x + v * VS, 238], C.x, al, 7);
    txt(ctx, fmtV(v) + ' m/s', xb + LC / 2, 200, { size: 30, weight: 600, color: C.x, alpha: al });
  }
  const fmtV = v => String(Math.round(v * 10) / 10).replace('.', ',');
  function sceneCarrelli(ctx, t) {
    if (t < 7.5 || t > 67.4) return;
    const al = life(t, 7.6, 67.2, .6, .5);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 1468, 322);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, YR); ctx.lineTo(1812, YR); ctx.stroke();
    // 1 · col velcro
    const k1 = 1 - P(t, 45.5, 45.9);
    if (k1 > 0) {
      ctx.save(); ctx.globalAlpha *= k1;
      const s = velcro(t);
      carrello(ctx, s.xa, '1 kg'); strisciaVelcro(ctx, s.xa + LC);
      carrello(ctx, s.xb, '1 kg'); strisciaVelcro(ctx, s.xb - VEL);
      const kv = P(t, 12.1, 12.5);
      if (s.va === s.vb) velocita(ctx, (s.xa + s.xb + LC) / 2 - LC / 2, s.va, kv);   // uniti: una freccia sola
      else velocita(ctx, s.xa, s.va, kv);
      ctx.restore();
    }
    // 2 · con la molla
    const k2 = P(t, 45.9, 46.3);
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2;
      const s = molla(t);
      carrello(ctx, s.xa, '1 kg'); carrello(ctx, s.xb, '1 kg');
      mollaDisegno(ctx, s.xa + LC, Math.min(s.xa + LC + MOL, s.xb));
      const kv = P(t, 46.4, 46.8);
      velocita(ctx, s.xa, s.va, kv); velocita(ctx, s.xb, s.vb, kv);
      ctx.restore();
    }
    const testo = (t >= TA && t < FA) || (t >= TB && t < FB) ? 'tempo reale' : 'fermo immagine';
    fermo(ctx, 1500, 150, P(t, 8.0, 8.5), testo);
    ctx.restore();
  }

  // ---------- la scheda in basso: barre della quantità di moto (azzurre) e dell'energia cinetica (verdi) ----------
  const BY = 745, SP = 150 / 4, SE = 150 / 8, BW = 90;   // base delle barre; px per kg·m/s e per joule
  function barra(ctx, x, h, col, al, val, tratt = false) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    if (tratt) {
      ctx.fillStyle = css(col, .12); ctx.fillRect(x - BW / 2, BY - h, BW, h);
      ctx.setLineDash([10, 7]); ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.strokeRect(x - BW / 2, BY - h, BW, h);
    } else { ctx.fillStyle = css(col); ctx.fillRect(x - BW / 2, BY - h, BW, h); }
    ctx.restore();
    if (val) txt(ctx, val, x, BY - h - 22, { size: 32, weight: 600, color: col, alpha: al });
  }
  function gruppo(ctx, cx, titolo, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    drawRich(ctx, '{dim:' + titolo.replace(' (', '}\n{dim:(') + '}', cx, 503, { size: 30, lh: 1.15 });
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 130, BY); ctx.lineTo(cx + 130, BY); ctx.stroke();
    txt(ctx, 'prima', cx - 60, 773, { size: 30, color: C.dim }); txt(ctx, 'dopo', cx + 60, 773, { size: 30, color: C.dim });
    ctx.restore();
  }
  function sceneScheda(ctx, t) {
    if (t < 22.3 || t > 67.4) return;
    const al = life(t, 22.5, 67.2, .5, .5);
    card(ctx, 372, 455, 1468, 345, al * Math.max(1 - P(t, 45.3, 45.8), P(t, 53.7, 54.2)));
    ctx.save(); ctx.globalAlpha *= al;
    // 1 · velcro
    const a1 = 1 - P(t, 45.3, 45.8);
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha *= a1;
      const kp = P(t, 22.8, 23.3), ke = P(t, 27.9, 28.4), kl = P(t, 32.3, 32.8);
      gruppo(ctx, 560, 'quantità di moto (kg·m/s)', kp);
      barra(ctx, 500, 4 * SP, C.x, kp, '4'); barra(ctx, 620, 4 * SP, C.x, P(t, 23.6, 24.1), '4');
      gruppo(ctx, 880, 'energia cinetica (J)', ke);
      barra(ctx, 820, 8 * SE, C.g, ke, '8'); barra(ctx, 940, 4 * SE, C.g, P(t, 28.6, 29.1), '');
      txt(ctx, '4', 940, BY - 4 * SE - 22, { size: 32, weight: 600, color: C.g, alpha: P(t, 28.6, 29.1) * (1 - kl) });
      if (kl > 0) {
        ctx.save(); ctx.globalAlpha *= kl;
        ctx.setLineDash([10, 7]); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
        ctx.strokeRect(940 - BW / 2, BY - 8 * SE, BW, 4 * SE); ctx.restore();
        drawRich(ctx, '4 J diventati\nenergia interna', 1000, BY - 6 * SE, { size: 30, align: 'left', alpha: kl });
        txt(ctx, '4', 940, BY - 4 * SE + 30, { size: 32, weight: 600, color: C.paper, alpha: kl });
      }
      const kt = P(t, 36.6, 37.1);
      if (kt > 0) {
        titoletto(ctx, 'completamente anelastico', 1570, 505, kt);
        drawRich(ctx, 'conserva {mx:p}, non l’energia cinetica', 1570, 560, { size: 30, alpha: kt });
        drawSeq(ctx, ['{mx:v} finale =', { num: '{mink:m₁·}{mx:v₁}{mink: + m₂·}{mx:v₂}', den: '{mink:m₁ + m₂}' }], 1570, 652, 40, { local: t - 41.3 });
        drawRich(ctx, '= (1 · 4 + 1 · 0) / (1 + 1) = {x:2 m/s}', 1570, 745, { size: 32, local: t - 42.6, stagger: .05 });
      }
      ctx.restore();
    }
    // 2 · molla
    const a2 = P(t, 53.7, 54.2);
    if (a2 > 0) {
      ctx.save(); ctx.globalAlpha *= a2;
      gruppo(ctx, 560, 'quantità di moto (kg·m/s)', 1);
      barra(ctx, 500, 4 * SP, C.x, 1, '4'); barra(ctx, 620, 4 * SP, C.x, P(t, 54.4, 54.9), '4');
      gruppo(ctx, 880, 'energia cinetica (J)', P(t, 55.6, 56.1));
      barra(ctx, 820, 8 * SE, C.g, P(t, 55.6, 56.1), '8'); barra(ctx, 940, 8 * SE, C.g, P(t, 56.4, 56.9), '8');
      const kt = P(t, 59.1, 59.6);
      if (kt > 0) {
        titoletto(ctx, 'urto elastico', 1570, 505, kt);
        drawRich(ctx, 'si conservano {mx:p} e l’energia cinetica', 1570, 560, { size: 30, alpha: kt });
        txt(ctx, 'velocità prima: 4 e 0 m/s', 1570, 660, { size: 34, alpha: P(t, 63.2, 63.7) });
        drawRich(ctx, 'velocità dopo: {g:0 e 4 m/s}', 1570, 720, { size: 34, alpha: P(t, 63.7, 64.2) });
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- il pendolo di Newton ----------
  const PX0 = 608, PDX = 64, PY = 178, LPX = 380, RB = 32;   // primo perno, passo, quota dei perni, filo, raggio
  function biglia(ctx, i, th, al = 1, fantasma = false) {
    const px = PX0 + i * PDX, x = px + LPX * Math.sin(th), y = PY + LPX * Math.cos(th);
    ctx.save(); ctx.globalAlpha *= al;
    if (fantasma) {
      ctx.setLineDash([8, 7]); ctx.strokeStyle = css(C.r); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px, PY); ctx.lineTo(x, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, RB, 0, Math.PI * 2); ctx.fillStyle = css(C.r, .1); ctx.fill(); ctx.stroke();
    } else {
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(px, PY); ctx.lineTo(x, y); ctx.stroke();
      ball(ctx, x, y, '', mix(C.dim, C.ink, .25), { r: RB });
    }
    ctx.restore();
  }
  function scenePendolo(ctx, t) {
    if (t < 67.0 || t > 87.8) return;
    const al = life(t, 67.2, 87.6, .5, .5);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 728, 692);
    ctx.strokeStyle = css(mix(C.dim, C.ink, .3)); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(420, 660); ctx.lineTo(420, PY); ctx.lineTo(1052, PY); ctx.lineTo(1052, 660); ctx.moveTo(400, 660); ctx.lineTo(1072, 660); ctx.stroke();
    const [a, b] = angoli(sP(t)), kh = life(t, 75.9, 83.2, .4, .4);
    biglia(ctx, 0, a); biglia(ctx, 1, 0); biglia(ctx, 2, 0); biglia(ctx, 3, 0, 1 - .7 * kh); biglia(ctx, 4, b, 1 - .7 * kh);
    // l'ipotesi: due biglie a metà velocità salirebbero a metà angolo
    if (kh > 0) { biglia(ctx, 3, TH0 / 2, kh, true); biglia(ctx, 4, TH0 / 2, kh, true); txt(ctx, '?', 900, 640, { size: 48, weight: 600, color: C.r, alpha: kh }); }
    const testo = t >= TP0 && (t < TPF || t >= TPR) ? 'al rallentatore, 3 volte' : 'fermo immagine';
    fermo(ctx, 440, 740, P(t, 67.6, 68.1), testo);
    ctx.restore();
    // la scheda a destra
    const ar = life(t, 75.8, 87.6, .5, .5);
    if (ar > 0) {
      card(ctx, 1130, 108, 710, 692, ar);
      ctx.save(); ctx.globalAlpha *= ar;
      titoletto(ctx, 'perché una sola?', 1485, 165);
      drawRich(ctx, 'una biglia a {mx:v}', 1485, 250, { size: 32, weight: 600 });
      drawRich(ctx, '{mx:p}{mink: = m·}{mx:v}', 1485, 310, { size: 36 });
      drawRich(ctx, '{g:energia}{mink: = ½·m·}{mx:v}{mink:²}', 1485, 365, { size: 36 });
      ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1170, 410); ctx.lineTo(1800, 410); ctx.stroke();
      drawRich(ctx, '{r:due biglie a }{mx:v}{r:/2}', 1485, 460, { size: 32, weight: 600 });
      const kq = P(t, 79.0, 79.5), ke = P(t, 80.6, 81.1);
      drawRich(ctx, '{mx:p}{mink: = 2·m·}{mx:v}{mink:/2 = m·}{mx:v}', 1440, 525, { size: 36, alpha: kq });
      checkMark(ctx, 1745, 525, P(t, 79.6, 80.2), C.g, .35);
      drawRich(ctx, '{g:energia}{mink: = 2·½·m·(}{mx:v}{mink:/2)²}', 1440, 590, { size: 36, alpha: ke });
      drawRich(ctx, '{mink:= ¼·m·}{mx:v}{mink:²}: {r:la metà}', 1440, 645, { size: 36, alpha: P(t, 81.4, 81.9) });
      crossMark(ctx, 1745, 618, P(t, 81.9, 82.5), C.r, .35);
      drawRich(ctx, 'con {g:una sola} biglia tornano\n{g:tutte e due}', 1485, 735, { size: 34, alpha: P(t, 83.3, 83.8), lh: 1.25 });
      ctx.restore();
    }
  }

  // ---------- titolo e riassunto ----------
  function sceneIntro(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Si attaccano o rimbalzano', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function sceneFine(ctx, t) {
    if (t < 87.7) return;
    const al = 1 - P(t, 95.6, 96.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.9 });
      drawRich(ctx, 'In un sistema isolato, in ogni urto si\nconserva la quantità di moto {g:totale}.', W / 2, 290, { size: 62, weight: 600, local: t - 88.3, stagger: .08 });
    });
    const pills = [[490, '{v:anelastico}: l’energia\ncinetica non si conserva,\ndiventa energia interna'], [960, '{v:elastico}: si conserva\nanche l’energia cinetica'], [1430, 'masse uguali, una ferma:\nsi {g:scambiano} le velocità']];
    pills.forEach(([x, s], i) => {
      const a = 90.0 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 510, { size: 33, weight: 400, lh: 1.18 });
      ctx.restore();
    });
    ctx.restore();
  }

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.1, .55],                                              // i carrelli, 4 m/s
    ['tono', 16.4, 17.35, [.04, .31]], ['pop', 17.35, .3],                            // il primo corre e urta
    ['tono', 17.35, 18.85, [.31, .52]],                                               // attaccati, a metà velocità
    ['pop', 22.8, .5], ['pop', 23.6, .5], ['ding', 23.7],                             // p: 4 prima, 4 dopo
    ['pop', 27.9, .7], ['pop', 28.6, .35], ['pop', 32.3, .25],                        // energia: 8 J, 4 J, il resto interna
    ['pop', 36.6, .5], ['pop', 41.3, .6], ['ding', 42.8],                             // anelastico: v finale = 2 m/s
    ['soffio', 45.9], ['pop', 46.4, .55],                                             // con la molla
    ['tono', 50.0, 50.875, [.04, .29]], ['pop', 50.875, .4],                          // il primo urta la molla
    ['tono', 50.975, 52.275, [.43, .81]],                                             // si ferma, il secondo parte a 4 m/s
    ['pop', 54.4, .5], ['pop', 55.6, .7], ['ding', 56.5],                             // p uguale, energia 8 J e 8 J
    ['pop', 59.1, .5], ['pop', 63.7, .6],                        // elastico: si scambiano le velocità
    ['soffio', 67.2],                                                                 // il pendolo di Newton
    ['tono', 71.2, 73.46, [.8, .7, .45, .2, .1, .2, .45, .7, .8, .7, .45, .2, .1]],   // ne parte una sola
    ['pop', 71.95, .5], ['pop', 73.46, .5], ['pop', 74.96, .5],                       // i colpi
    ['pop', 75.9, .2],                                                                // e se ne partissero due?
    ['pop', 79.0, .5], ['ding', 79.7], ['pop', 80.6, .5], ['pop', 81.9, .1],                      // p torna, l'energia no
    ['pop', 84.05, .5],                                                               // riparte: sempre una sola
    ['soffio', 87.7], ['pop', 90.0, .5], ['pop', 90.5, .6], ['pop', 91.0, .7],        // in una frase
  ];
  return {
    titolo: 'Si attaccano o rimbalzano', durata: 97.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 45.8, 'si attaccano'], [45.8, 67.1, 'rimbalzano'], [67.1, 87.5, 'il pendolo di Newton']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneCarrelli(ctx, t); sceneScheda(ctx, t); scenePendolo(ctx, t); sceneFine(ctx, t); },
  };
});
