'use strict';
/* Perché l'airbag salva — la quantità di moto p = m·v e il teorema dell'impulso F·Δt = Δp: lo stesso manichino
   (60 kg a 10 m/s) fermato dal cruscotto in 0,01 s e dall'airbag in 0,1 s; stesso Δp, forza media dieci volte più piccola.
   Il moto è quello vero: durante l'urto la forza è una mezza sinusoide e la forza media è il suo valore medio. Argomento: quantita-di-moto. */
CVIDEO.registra('quantita-di-moto/impulso', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

  // ---------- la fisica ----------
  const MASSA = 60, V0 = 10, P0 = MASSA * V0;          // 600 kg·m/s
  const DT1 = .01, DT2 = .1;                           // frenata contro il cruscotto, frenata sull'airbag
  const LENTO = 50;                                    // al rallentatore 50 volte
  const PXM = 400;                                     // px per metro
  // durante l'urto F(τ) = Fmax·sin(π·τ/Δt), con Fmax = (π/2)·F media: l'area sotto la curva è sempre 600 N·s.
  // Integrando F/m: v(Δt) = 0 e lo spazio di frenata è V0·Δt/2 (5 cm sul cruscotto, 50 cm sull'airbag)
  function frenata(tau, DT) {   // tau: tempo vero dall'inizio del contatto; x in metri dal punto di contatto
    const Fmax = Math.PI / 2 * P0 / DT, w = Math.PI / DT, k = Fmax / MASSA / w;
    if (tau <= 0) return { x: V0 * tau, v: V0, F: 0 };
    if (tau >= DT) return { x: V0 * DT / 2, v: 0, F: 0 };
    return { x: V0 * tau - k * (tau - Math.sin(w * tau) / w), v: V0 - k * (1 - Math.cos(w * tau)), F: Fmax * Math.sin(w * tau) };
  }
  const XD = 960, XA0 = XD - .55 * PXM;   // la faccia del cruscotto; la faccia dell'airbag gonfio (55 cm, x 740)
  const XF0 = 620;                         // il petto del manichino quando il film è fermo
  const R1 = 44.4, R2 = 62.0;              // le due corse ripartono qui
  // prima corsa: 0,85 m a 10 m/s fino al cruscotto (4,25 s di video), poi 0,01 s di frenata (0,5 s di video)
  const corsa1 = t => frenata((Math.max(t, R1) - R1) / LENTO - (XD - XF0) / PXM / V0, DT1);
  // seconda corsa: 0,3 m fino all'airbag (1,5 s di video), poi 0,1 s di frenata (5 s di video)
  const corsa2 = t => frenata((Math.max(t, R2) - R2) / LENTO - (XA0 - XF0) / PXM / V0, DT2);

  const POSA = { // x, y, s, sguardo
    x: [[0, 760], [6.4, 760], [7.6, 190], [93.7, 190], [95.0, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [93.7, 1050], [95.0, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [93.7, 2.2], [95.0, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [93.7, 2], [95.0, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [93.7, -1.5], [95.0, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.9, 'felice'], [21.3, 'neutro'],
    [26.0, 'pensa'], [30.5, 'neutro'], [48.6, 'sorpreso'], [53.0, 'neutro'], [57.6, 'felice'], [61.9, 'neutro'],
    [66.4, 'festa'], [70.7, 'felice'], [75.3, 'pensa'], [80.2, 'neutro'], [89.2, 'felice'], [93.6, 'neutro'],
    [96.4, 'felice'], [100.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Fermarsi in un urto è inevitabile:\nperché l’airbag salva?'],
    [7.9, 12.2, 'L’auto è già ferma: il manichino\ncorre ancora a 10 m/s.'],
    [12.3, 16.8, 'Massa per velocità: è la sua\n{x:quantità di moto}, {mx:p}.'],
    [16.9, 21.2, '{mx:p} = 60 kg · 10 m/s\n= {x:600 kg·m/s}.'],
    [21.3, 25.7, 'È un {v:vettore}: ha la direzione\ne il verso della velocità.'],
    [26.0, 30.4, '{mx:p} deve scendere da 600 a 0:\nserve una {y:forza}.'],
    [30.5, 34.9, 'Forza per tempo, {my:F}·{mink:Δt}:\nè l’{y:impulso} {my:I}.'],
    [35.0, 39.5, 'L’impulso è uguale alla {v:variazione}\ndella quantità di moto, {mx:Δp}.'],
    [39.6, 44.0, '{my:F} è la risultante: se varia,\nconta la forza {g:media}.'],
    [44.2, 48.5, 'Senza airbag, contro il cruscotto,\nal rallentatore 50 volte…'],
    [48.6, 52.9, '…si ferma in 0,01 s: forza media\n{y:60 000 N}, all’indietro!'],
    [53.0, 57.3, 'Sul grafico, l’area sotto la curva\nè l’impulso: 600 N·s.'],
    [57.6, 61.7, 'Ora con l’airbag: stesso manichino,\nstessa velocità.'],
    [61.9, 66.2, 'L’airbag si schiaccia piano:\nla frenata dura {g:0,1 s}…'],
    [66.4, 70.6, '…dieci volte di più: forza media\n{g:dieci volte} più piccola.'],
    [70.7, 75.2, '{y:6000 N} invece di {y:60 000 N}:\nstessa area, stesso {mx:Δp}.'],
    [75.3, 79.7, '{mx:Δp} non si sceglie: si sceglie\nin quanto {g:tempo} fermarsi.'],
    [80.2, 84.6, 'Dopo un salto si atterra a\n{g:ginocchia} piegate: frenata più lunga.'],
    [84.7, 89.1, 'Il portiere arretra le mani col\npallone: più {g:tempo}, meno forza.'],
    [89.2, 93.6, 'Sempre lo stesso trucco: più {mink:Δt},\nforza media più {g:piccola}.'],
    [96.4, 101.4, 'Fermarsi in più tempo vuol dire\nuna forza media più piccola.'],
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
  // che tempo si sta guardando: due barrette per il fermo immagine, un triangolo per il rallentatore
  function fermo(ctx, x, y, al, testo) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
    if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
    else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
    txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));

  // ---------- il manichino, il cruscotto, l'airbag ----------
  const YP = 740, FSC = .004, PSC = 150 / P0;   // pavimento; frecce: 0,004 px per newton, 150 px per 600 kg·m/s
  // xf: dove sarebbe il petto (il manichino si muove come un corpo solo); petto: dove si disegna (sul cruscotto si schiaccia)
  function manichino(ctx, xf, petto, al = 1) {
    if (al <= 0) return;
    const xb = xf - 110, corpo = mix(C.dim, C.paper, .55), scuro = mix(C.dim, C.ink, .25);
    ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = css(scuro); ctx.lineWidth = 16;   // la gamba sotto il cruscotto
    ctx.beginPath(); ctx.moveTo(xf + 50, 640); ctx.lineTo(xf + 62, YP - 10); ctx.lineTo(xf + 96, YP - 10); ctx.stroke();
    ctx.fillStyle = css(corpo); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(xb, 612, xf + 72 - xb, 46, 18); ctx.fill(); ctx.stroke();   // la coscia
    ctx.beginPath(); ctx.roundRect(xb, 430, petto - xb, 212, 22); ctx.fill(); ctx.stroke();    // il busto
    const hx = Math.min(xf, XD) - 52, hy = 386;
    ctx.beginPath(); ctx.arc(hx, hy, 40, 0, Math.PI * 2); ctx.fill(); ctx.stroke();            // la testa
    // il bersaglio dei manichini da crash test
    ctx.fillStyle = css(C.ink);
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.arc(hx, hy, 15, -Math.PI / 2, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.arc(hx, hy, 15, Math.PI / 2, Math.PI); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(hx, hy, 15, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = css(scuro); ctx.lineWidth = 14;   // il braccio
    ctx.beginPath(); ctx.moveTo(xb + 40, 505); ctx.lineTo(petto - 18, 600); ctx.stroke();
    txt(ctx, '60 kg', hx, 322, { size: 30, weight: 600 });
    ctx.restore();
  }
  function cruscotto(ctx) {
    ctx.save();
    ctx.fillStyle = css(mix(C.dim, C.paper, .6)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(XD, 420, 160, 180, [12, 0, 0, 12]); ctx.fill(); ctx.stroke();
    txt(ctx, 'cruscotto', XD + 80, 510, { size: 30, weight: 600 });
    ctx.restore();
  }
  function airbag(ctx, xa, al) {
    if (al <= 0) return;
    const sp = XD - xa;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = css(mix(C.paper, C.dim, .14)); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(xa, 344, sp + 14, 262, Math.min(70, sp / 2)); ctx.fill(); ctx.stroke();
    txt(ctx, 'airbag', xa + sp / 2, 470, { size: 30, color: C.dim, alpha: clamp((sp - 150) / 40) });
    ctx.restore();
  }
  // le frecce sopra il manichino: la quantità di moto (azzurra) e la forza che lo frena (arancio)
  function frecce(ctx, xf, petto, m, kp, kF) {
    const L = MASSA * m.v * PSC, xc = xf - 50;
    if (kp > 0) {
      freccia(ctx, [xc, 250], [xc + L, 250], C.x, kp, 8);
      drawRich(ctx, '{mx:p}', xc + Math.max(L, 40) / 2, 212, { size: 42, alpha: kp * clamp(L / 40) });
    }
    const LF = m.F * FSC;
    if (kF > 0 && LF > 6) {
      freccia(ctx, [petto, 540], [petto - LF, 540], C.y, kF, 8);
      drawRich(ctx, '{my:F}', petto - LF - 16, 540, { size: 42, align: 'right', alpha: kF * clamp(LF / 30) });
    }
  }
  // la forza media, tratteggiata, mentre Stilla ne dice il valore: 60 000 N → 240 px, 6000 N → 24 px
  function forzaMedia(ctx, xf, petto, DT, al) {
    if (al <= 0) return;
    const L = P0 / DT * FSC, y = 604;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.moveTo(petto, y); ctx.lineTo(petto - L + 14, y); ctx.stroke(); ctx.restore();
    arrowHead(ctx, [petto - L, y], Math.PI, C.y, Math.min(1.2, L / 22) * al);
    drawRich(ctx, '{my:F} media', Math.min(petto - L - 16, xf - 126), y, { size: 36, align: 'right', alpha: al });
  }
  function sceneManichino(ctx, t) {
    if (t < 7.5 || t > 80.4) return;
    const al = life(t, 7.6, 80.2, .6, .5);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 790, 692);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, YP); ctx.lineTo(1134, YP); ctx.stroke();
    // prima corsa: contro il cruscotto
    const k1 = 1 - P(t, 56.9, 57.4);
    if (k1 > 0) {
      const m = corsa1(t), xf = XD + m.x * PXM, petto = Math.min(xf, XD);
      manichino(ctx, xf, petto, k1);
      ctx.save(); ctx.globalAlpha *= k1;
      // la velocità, finché il film è fermo
      const kv = life(t, 8.3, 26.0, .5, .5);
      freccia(ctx, [xf + 14, 470], [xf + 14 + V0 * 12, 470], C.x, kv, 7);
      drawRich(ctx, '{mx:v} = 10 m/s', xf + 150, 470, { size: 34, align: 'left', alpha: kv });
      frecce(ctx, xf, petto, m, P(t, 21.5, 22.1), P(t, 44.4, 44.8));
      forzaMedia(ctx, xf, petto, DT1, life(t, 48.65, 52.9, .3, .4));
      ctx.restore();
    }
    // seconda corsa: sull'airbag
    const k2 = P(t, 57.5, 58.0);
    if (k2 > 0) {
      const m = corsa2(t), xf = XA0 + m.x * PXM;
      airbag(ctx, Math.max(XA0, xf), k2);
      manichino(ctx, xf, xf, k2);
      ctx.save(); ctx.globalAlpha *= k2; frecce(ctx, xf, xf, m, 1, 1); forzaMedia(ctx, xf, xf, DT2, life(t, 66.4, 70.6, .3, .4)); ctx.restore();
    }
    cruscotto(ctx);
    // che tempo si sta guardando
    const testo = t < R1 || (t > 57.4 && t < R2) ? 'fermo immagine' : 'al rallentatore, 50 volte';
    fermo(ctx, 760, 774, P(t, 8.0, 8.5) * life(t, 0, 79.9, 0, .4) * (t > 56.9 && t < 57.6 ? 0 : 1), testo);
    ctx.restore();
  }

  // ---------- la scheda a destra: p = m·v, poi l'impulso, poi il grafico della forza ----------
  const BX = 1190, BW = 650, BC = BX + BW / 2;
  function riga(ctx, sx, dx, y, al = 1, size = 40) {
    if (al <= 0) return;
    drawRich(ctx, sx, BX + 50, y, { size, align: 'left', alpha: al });
    drawRich(ctx, dx, BX + BW - 50, y, { size, align: 'right', alpha: al });
  }
  function linea(ctx, y, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(BX + 40, y); ctx.lineTo(BX + BW - 40, y); ctx.stroke(); ctx.restore();
  }
  // il grafico forza–tempo: origine (GX, GY), 4200 px per secondo, 0,004 px per newton
  const GX = 1314, GY = 590, TS = 4200, FG = .004;
  const gpt = (tau, F) => [GX + tau * TS, GY - F * FG];
  function curva(ctx, DT, tauMax, col, al, riempi) {
    if (al <= 0 || tauMax <= 0) return;
    const Fmax = Math.PI / 2 * P0 / DT, n = 60, tm = Math.min(tauMax, DT), pts = [];
    for (let i = 0; i <= n; i++) { const u = tm * i / n; pts.push(gpt(u, Fmax * Math.sin(Math.PI * u / DT))); }
    ctx.save(); ctx.globalAlpha *= al;
    if (riempi > 0) {
      ctx.fillStyle = css(col, .22 * riempi); ctx.beginPath(); ctx.moveTo(GX, GY);
      pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[n][0], GY); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    ctx.restore();
  }
  function media(ctx, DT, al) {   // il rettangolo della forza media: stessa area della curva
    if (al <= 0) return;
    const a = gpt(0, P0 / DT), b = gpt(DT, 0);
    ctx.save(); ctx.globalAlpha *= al; ctx.setLineDash([10, 8]); ctx.strokeStyle = css(C.y); ctx.lineWidth = 3;
    ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.restore();
  }
  function sceneScheda(ctx, t) {
    if (t < 12.0 || t > 80.4) return;
    const al = life(t, 12.3, 80.2, .5, .5);
    card(ctx, BX, 108, BW, 692, al);
    ctx.save(); ctx.globalAlpha *= al;
    // 1 · la quantità di moto
    const a1 = life(t, 12.3, 25.9, .4, .4);
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha *= a1;
      titoletto(ctx, 'quantità di moto', BC, 165);
      drawRich(ctx, '{mx:p}{mink: = m·}{mx:v}', BC, 262, { size: 80, local: t - 12.6, stagger: .12 });
      riga(ctx, 'massa {mink:m}', '60 kg', 370, P(t, 13.6, 14.0));
      riga(ctx, 'velocità {mx:v}', '10 m/s', 428, P(t, 14.0, 14.4));
      linea(ctx, 472, P(t, 16.9, 17.3));
      drawRich(ctx, '{mx:p} = 60 kg · 10 m/s', BC, 525, { size: 40, local: t - 17.0 });
      drawRich(ctx, '= {x:600 kg·m/s}', BC, 592, { size: 48, weight: 600, local: t - 18.0 });
      drawRich(ctx, 'un {v:vettore}: direzione e verso di {mx:v}', BC, 680, { size: 32, local: t - 21.5, stagger: .03 });
      txt(ctx, 'si misura in kg·m/s', BC, 734, { size: 30, color: C.dim, alpha: P(t, 22.4, 22.9) });
      ctx.restore();
    }
    // 2 · l'impulso e il teorema
    const a2 = life(t, 26.0, 44.3, .4, .4);
    if (a2 > 0) {
      ctx.save(); ctx.globalAlpha *= a2;
      titoletto(ctx, 'per fermarsi', BC, 165);
      drawRich(ctx, '{mx:Δp} = 0 − 600 = −600 kg·m/s', BC, 240, { size: 36, local: t - 26.6, stagger: .04 });
      linea(ctx, 290, P(t, 30.5, 30.9));
      drawRich(ctx, '{my:I}{mink: = }{my:F}{mink:·Δt}', BC, 352, { size: 64, local: t - 30.8, stagger: .12 });
      txt(ctx, 'impulso, si misura in N·s', BC, 418, { size: 30, color: C.dim, alpha: P(t, 32.0, 32.5) });
      linea(ctx, 462, P(t, 35.0, 35.4));
      drawRich(ctx, '{my:F}{mink:·Δt = }{mx:Δp}', BC, 528, { size: 64, local: t - 35.2, stagger: .12 });
      conFont(TITOLI, () => drawRich(ctx, 'teorema dell’impulso', BC, 598, { size: 34, weight: 600, alpha: P(t, 36.4, 36.9) }));
      drawRich(ctx, '{my:F}: la risultante, o la forza {g:media}', BC, 672, { size: 32, local: t - 39.8, stagger: .03 });
      txt(ctx, '1 N·s = 1 kg·m/s', BC, 732, { size: 30, color: C.dim, alpha: P(t, 37.0, 37.5) });
      ctx.restore();
    }
    // 3 · il grafico della forza nel tempo
    const a3 = P(t, 44.2, 44.7);
    if (a3 > 0) {
      ctx.save(); ctx.globalAlpha *= a3;
      titoletto(ctx, 'la forza durante l’urto', BC, 150);
      // assi
      ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(GX, GY); ctx.lineTo(GX + 500, GY); ctx.moveTo(GX, GY); ctx.lineTo(GX, 196); ctx.stroke();
      arrowHead(ctx, [GX + 506, GY], 0, C.ink); arrowHead(ctx, [GX, 190], -Math.PI / 2, C.ink);
      drawRich(ctx, "{my:F} (N)", GX - 16, 204, { size: 32, align: "right" });
      drawRich(ctx, '{mink:t} (s)', GX + 500, GY - 46, { size: 32, align: 'right' });
      for (const [u, s] of [[.05, '0,05'], [.1, '0,1']]) {
        const x = GX + u * TS;
        ctx.beginPath(); ctx.moveTo(x, GY - 8); ctx.lineTo(x, GY + 8); ctx.stroke();
        txt(ctx, s, x, GY + 34, { size: 30, color: C.dim });
      }
      txt(ctx, '0', GX - 14, GY + 26, { size: 30, color: C.dim, align: 'right' });
      // la frenata sul cruscotto: la curva si disegna mentre succede
      const tau1 = (t - R1) / LENTO - (XD - XF0) / PXM / V0, kA = P(t, 53.1, 53.6), kAB = P(t, 70.8, 71.3);
      curva(ctx, DT1, tau1, C.y, 1 - .55 * P(t, 57.5, 58.0) * (1 - kAB), Math.max(kA * (1 - P(t, 57.5, 58.0)), kAB));
      const kM1 = P(t, 48.8, 49.3);
      media(ctx, DT1, kM1);
      const yM1 = gpt(0, P0 / DT1)[1];
      txt(ctx, '60 000', GX - 8, yM1, { size: 30, color: C.y, align: 'right', alpha: kM1 });
      drawRich(ctx, 'area {y:600 N·s}', GX + 56, 300, { size: 32, align: 'left', alpha: Math.max(kA * (1 - P(t, 57.5, 58.0)), kAB) });
      // la frenata sull'airbag
      const tau2 = (t - R2) / LENTO - (XA0 - XF0) / PXM / V0, kM2 = P(t, 66.6, 67.1);
      curva(ctx, DT2, tau2, C.y, 1, kAB);
      media(ctx, DT2, kM2);
      txt(ctx, '6000', GX - 8, gpt(0, P0 / DT2)[1] - 6, { size: 30, color: C.y, align: 'right', alpha: kM2 });
      drawRich(ctx, 'area {y:600 N·s}', GX + .05 * TS, GY - 82, { size: 32, alpha: kAB });
      drawRich(ctx, '{g:stessa area}', GX + 300, 400, { size: 40, weight: 600, alpha: kAB, local: t - 70.8 });
      // la tabella
      const kT = P(t, 48.8, 49.3);
      linea(ctx, 654, kT);
      txt(ctx, 'cruscotto', 1530, 684, { size: 30, color: C.dim, alpha: kT });
      txt(ctx, 'airbag', 1735, 684, { size: 30, color: C.dim, alpha: P(t, 66.6, 67.1) });
      drawRich(ctx, '{mink:Δt}', BX + 40, 726, { size: 34, align: 'left', alpha: kT });
      drawRich(ctx, '{my:F} media', BX + 40, 770, { size: 34, align: 'left', alpha: kT });
      txt(ctx, '0,01 s', 1530, 726, { size: 36, alpha: kT });
      txt(ctx, '60 000 N', 1530, 770, { size: 36, weight: 600, color: C.y, alpha: kT });
      txt(ctx, '0,1 s', 1735, 726, { size: 36, weight: 600, color: C.g, alpha: P(t, 66.6, 67.1) });
      txt(ctx, '6000 N', 1735, 770, { size: 36, weight: 600, color: C.y, alpha: P(t, 66.8, 67.3) });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- lo stesso trucco: le ginocchia e il guanto (80–93,7) ----------
  // un grafico piccolo con due frenate di uguale area: stretta e alta (rigida), larga e bassa (morbida)
  function grafichino(ctx, x0, y0, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + 330, y0); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 - 170); ctx.stroke();
    arrowHead(ctx, [x0 + 336, y0], 0, C.ink); arrowHead(ctx, [x0, y0 - 176], -Math.PI / 2, C.ink);
    drawRich(ctx, '{my:F}', x0 - 14, y0 - 160, { size: 34, align: 'right' });
    drawRich(ctx, '{mink:t}', x0 + 330, y0 + 30, { size: 34 });
    const gobba = (larg, alt, col, f) => {
      ctx.beginPath(); ctx.moveTo(x0 + 10, y0);
      for (let i = 0; i <= 40; i++) ctx.lineTo(x0 + 10 + larg * i / 40, y0 - alt * Math.sin(Math.PI * i / 40));
      ctx.closePath(); ctx.fillStyle = css(col, f); ctx.fill(); ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.stroke();
    };
    gobba(40, 150, C.dim, .12);   // stessa area: 40 · 150 = 240 · 25
    gobba(240, 25, C.y, .25);
    txt(ctx, 'rigida', x0 + 64, y0 - 150, { size: 30, color: C.dim, align: 'left' });
    txt(ctx, 'morbida', x0 + 130, y0 - 52, { size: 30, weight: 600, color: C.y });
    ctx.restore();
  }
  function omino(ctx, x, yg, piegato, col) {
    ctx.save(); ctx.translate(x, yg); ctx.scale(.75, .75); ctx.translate(-x, -yg);
    ctx.strokeStyle = css(col); ctx.fillStyle = css(col); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const yh = piegato ? yg - 92 : yg - 130;   // le anche
    ctx.beginPath();
    if (piegato) { ctx.moveTo(x - 16, yg); ctx.lineTo(x + 26, yg - 48); ctx.lineTo(x - 6, yh); ctx.moveTo(x + 16, yg); ctx.lineTo(x + 44, yg - 46); ctx.lineTo(x + 6, yh); }
    else { ctx.moveTo(x - 16, yg); ctx.lineTo(x - 6, yh); ctx.moveTo(x + 16, yg); ctx.lineTo(x + 6, yh); }
    const ys = yh - 110, xs = piegato ? x + 22 : x;   // le spalle: piegandosi il busto va avanti
    ctx.moveTo(x, yh); ctx.lineTo(xs, ys);
    ctx.moveTo(xs, ys + 14); ctx.lineTo(xs - 46, ys - 30); ctx.moveTo(xs, ys + 14); ctx.lineTo(xs + 46, ys - 30);   // le braccia in alto
    ctx.stroke();
    ctx.beginPath(); ctx.arc(xs + (piegato ? 8 : 0), ys - 36, 26, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function guanti(ctx, xg, y) {
    ctx.save(); ctx.lineJoin = 'round';
    ctx.fillStyle = css(mix(C.dim, C.paper, .3)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    for (const dy of [-1, 1]) {
      ctx.beginPath(); ctx.roundRect(xg, y + dy * 52 - 34, 70, 68, 22); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(xg + 60, y + dy * 52 - 20, 90, 40, 14); ctx.fill(); ctx.stroke();   // i polsi
    }
    ctx.restore();
  }
  function sceneTrucco(ctx, t) {
    if (t < 79.8 || t > 94.4) return;
    const fuori = 1 - P(t, 93.6, 94.2);
    const kL = P(t, 80.0, 80.6) * fuori, kR = P(t, 84.5, 85.1) * fuori, kU = life(t, 89.2, 94.2, .5, .5);
    if (kL > 0) {
      card(ctx, 372, 108, 790, 692, kL);
      ctx.save(); ctx.globalAlpha *= kL;
      titoletto(ctx, 'atterrare da un salto', 767, 165);
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(420, 440); ctx.lineTo(1114, 440); ctx.stroke();
      omino(ctx, 570, 436, false, C.dim);
      omino(ctx, 940, 436, true, C.ink);
      txt(ctx, 'gambe tese', 570, 480, { size: 30, color: C.dim });
      txt(ctx, 'ginocchia piegate', 960, 480, { size: 30, weight: 600 });
      grafichino(ctx, 600, 700, P(t, 81.0, 81.6));
      drawRich(ctx, 'stesso {mx:Δp}: più {mink:Δt}, {my:F} più piccola', 767, 772, { size: 30, alpha: P(t, 82.0, 82.5) });
      ctx.restore();
    }
    if (kR > 0) {
      card(ctx, BX, 108, BW, 692, kR);
      ctx.save(); ctx.globalAlpha *= kR;
      titoletto(ctx, 'parare un tiro', BC, 165);
      // il pallone arriva da sinistra; le mani arretrano con lui
      guanti(ctx, 1520, 340);
      ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(1460, 340, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = css(C.ink); ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; ctx.lineTo(1460 + 20 * Math.cos(a), 340 + 20 * Math.sin(a)); }
      ctx.closePath(); ctx.fill();
      freccia(ctx, [1250, 340], [1370, 340], C.x, 1, 7);
      drawRich(ctx, '{mx:v}', 1310, 300, { size: 38 });
      freccia(ctx, [1530, 450], [1730, 450], C.dim, 1, 5);
      txt(ctx, 'le mani arretrano', 1630, 488, { size: 30, color: C.dim });
      grafichino(ctx, 1345, 700, P(t, 85.6, 86.2));
      ctx.restore();
    }
    // le due frenate morbide si accendono insieme
    if (kU > 0) {
      ctx.save(); ctx.globalAlpha *= kU;
      for (const x of [600, 1345]) drawRich(ctx, '{g:più tempo}', x + 270, 620, { size: 34, weight: 600, align: 'left' });
      ctx.restore();
    }
  }

  // ---------- titolo e riassunto ----------
  function sceneIntro(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Perché l’airbag salva', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function sceneFine(ctx, t) {
    if (t < 93.8) return;
    const al = 1 - P(t, 102.0, 103.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.0 });
      drawRich(ctx, 'Lo stesso {mx:Δp} in più tempo vuol dire\nuna forza media {g:più piccola}.', W / 2, 290, { size: 64, weight: 600, local: t - 94.4, stagger: .09 });
    });
    const pills = [[490, '{mx:p}{mink: = m·}{mx:v}\nin kg·m/s'], [960, '{my:F}{mink:·Δt = }{mx:Δp}\nteorema dell’impulso'], [1430, 'dieci volte più tempo,\nforza {g:dieci volte} minore']];
    pills.forEach(([x, s], i) => {
      const a = 96.4 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.3, .5],                                                // il manichino a 10 m/s
    ['pop', 12.6, .6], ['pop', 13.6, .4], ['pop', 14.0, .5],                          // p = m·v, massa, velocità
    ['pop', 17.0, .45], ['ding', 18.1], ['pop', 21.5, .55],                           // 600 kg·m/s, il vettore
    ['pop', 26.6, .4], ['pop', 30.8, .6], ['pop', 35.2, .65], ['pop', 39.8, .45],     // Δp, impulso, teorema, forza media
    ['pop', 44.2, .4],                                                                // il grafico della forza
    ['pop', 48.65, .1], ['tono', 48.65, 49.15, [0, .67, .94, .67, 0]],                // contro il cruscotto: forza enorme
    ['pop', 48.8, .9], ['pop', 53.1, .5],                                             // 60 000 N, l'area
    ['soffio', 57.5],                                                                 // con l'airbag
    ['pop', 63.5, .4], ['tono', 63.5, 68.5, [0, .05, .08, .1, .08, .05, 0]],          // l'airbag si schiaccia piano: forza piccola
    ['pop', 66.8, .3],                                                                // 0,1 s e 6000 N
    ['ding', 70.9],                                                                   // stessa area
    ['soffio', 80.0], ['pop', 81.0, .45], ['pop', 82.0, .5],                          // atterrare da un salto
    ['pop', 84.5, .5], ['pop', 85.6, .45], ['pop', 89.2, .65],                        // parare un tiro, più tempo
    ['soffio', 93.8], ['pop', 96.4, .5], ['pop', 96.9, .6], ['pop', 97.4, .7],        // in una frase
  ];
  return {
    titolo: 'Perché l’airbag salva', durata: 104, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.8, 'la quantità di moto'], [25.8, 57.4, 'l’impulso'], [57.4, 79.9, 'l’airbag'], [79.9, 93.7, 'lo stesso trucco']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneManichino(ctx, t); sceneScheda(ctx, t); sceneTrucco(ctx, t); sceneFine(ctx, t); },
  };
});
