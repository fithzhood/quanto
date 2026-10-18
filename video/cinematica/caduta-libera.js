'use strict';
/* Il martello e la piuma — sulla Terra la piuma è frenata dall'aria; sulla Luna, senza aria, cadono insieme
   (Apollo 15, David Scott, 1971): nel vuoto tutti i corpi hanno la stessa accelerazione. Argomento: cinematica.
   (La sequenza 1, 3, 5, 7 della caduta da fermi sta nel video cinematica/dispari.) */
CVIDEO.registra('cinematica/caduta-libera', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TAU, TITOLI, conFont, drawRich, txt, fixedNum, fmtN,
    card, crossMark } = M;

  // ---------- il moto vero ----------
  const G = 9.8, G_LUNA = 1.62, H = 1.5;          // m/s², m/s², altezza di partenza in m
  const caduta = (g, t) => g * t * t / 2;          // s = ½·g·t², da fermi
  // la piuma nell'aria: frenata dall'aria fino a una velocità limite di circa 0,5 m/s (attrito proporzionale alla velocità)
  const VL = 0.5, TAUP = VL / G;
  const piumaAria = t => VL * (t - TAUP * (1 - Math.exp(-t / TAUP)));
  // sulla Terra, nell'aria: tempo vero (1 s = 1 s) dal lancio a 12,2 s
  const tTerra = t => clamp(t - 12.2, 0, 3.4);
  const T_PIUMA = 3.0515;                         // la piuma tocca terra (calcolato: piumaAria = 1,5 m)
  // sulla Luna: tempo vero dal lancio a 28,6 s; toccano terra dopo √(2·1,5/1,62) ≈ 1,36 s, cioè a 29,96 s
  const T_LUNA = Math.sqrt(2 * H / G_LUNA);
  const LANCIO_LUNA = 28.6;
  const tLuna = t => clamp(t - LANCIO_LUNA, 0, T_LUNA);

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [53.4, 190], [54.7, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [53.4, 1050], [54.7, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [53.4, 2.2], [54.7, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [53.4, 2], [54.7, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [53.4, -1.5], [54.7, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [15.8, 'pensa'], [21.0, 'neutro'],
    [30.0, 'festa'], [34.0, 'neutro'], [43.8, 'felice'], [48.8, 'neutro'], [56.0, 'felice'], [59.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Un martello e una piuma cadono\ninsieme: chi arriva prima?'],
    [7.9, 12.0, 'Sulla Terra, nell\'aria:\nli lascio cadere insieme.'],
    [12.9, 15.6, 'Il martello arriva {g:prima}.'],
    [15.8, 20.6, '{r:Cade prima perché pesa di più?}\nÈ un\'idea da mettere alla prova.'],
    [21.0, 25.6, 'Sulla Luna non c\'è aria.\nApollo 15, 1971: David Scott ci prova.'],
    [25.8, 28.4, 'Li lascia andare insieme…'],
    [30.0, 33.8, '…e toccano terra {g:insieme}!'],
    [34.0, 39.0, 'Non conta quanto pesano: sulla Terra\nla piuma è {g:frenata dall\'aria}.'],
    [39.2, 43.6, '{g:Nel vuoto} tutti i corpi cadono\ncon la stessa accelerazione.'],
    [43.8, 48.6, 'Sulla Luna è circa 1,6 m/s².\nSulla Terra è {mv:g} = 9,8 m/s².'],
    [48.8, 53.2, 'Galileo l\'aveva capito: senza aria\ncadrebbero insieme.'],
    [56.0, 60.4, 'Non vince il più pesante:\nnel vuoto cadono {g:insieme}.'],
  ];

  // ---------- figure ----------
  // il martello di traverso, come lo teneva Scott; (x, yb) = centro in basso della testa
  function martello(ctx, x, yb, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, yb);
    ctx.fillStyle = css(mix(C.y, C.dim, .45)); ctx.beginPath(); ctx.roundRect(-96, -28, 92, 13, 6); ctx.fill();
    ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.roundRect(-14, -46, 30, 46, 6); ctx.fill();
    ctx.restore();
  }
  // la piuma; (x, yb) = la punta in basso
  function piuma(ctx, x, yb, ang, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, yb); ctx.rotate(ang);
    ctx.fillStyle = css(C.dim, .45);
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.bezierCurveTo(-28, -40, -26, -98, 4, -116); ctx.bezierCurveTo(26, -94, 24, -40, 0, -10); ctx.fill();
    ctx.strokeStyle = css(C.paper, .7); ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { const y = -26 - i * 14; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-15, y - 10); ctx.moveTo(1, y); ctx.lineTo(15, y - 10); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-2, -60, 4, -116); ctx.stroke();
    ctx.restore();
  }
  function intestazione(ctx, titolo, tc, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => drawRich(ctx, titolo, 404, 156, { size: 36, weight: 600, align: 'left' }));
    drawRich(ctx, '{mink:t} =', 900, 156, { size: 36, align: 'left' });
    fixedNum(ctx, fmtN(tc, 2), 1050, 156, 38, C.ink);
    txt(ctx, 's', 1060, 156, { size: 32, color: C.dim, align: 'left' });
    ctx.restore();
  }
  function righello(ctx, x, y0, ppm, max, passo, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + max * ppm); ctx.stroke();
    const n = Math.round(max / passo);
    for (let i = 0; i <= n; i++) {
      const v = Math.round(i * passo * 10) / 10, y = y0 + v * ppm, lungo = Math.abs(v * 2 - Math.round(v * 2)) < 1e-6;
      ctx.beginPath(); ctx.moveTo(x - (lungo ? 12 : 6), y); ctx.lineTo(x, y); ctx.stroke();
      if (lungo) txt(ctx, fmtN(v, Number.isInteger(v) ? 0 : 1), x - 18, y, { size: 30, color: C.dim, align: 'right' });
    }
    ctx.restore();
  }

  // ---------- la scena: Terra nell'aria, poi Luna ----------
  // partenza più in basso dell'intestazione: la piuma (alta 116 px) non arriva mai a coprire «t =»
  const YG = 730, PX = 280, YREL = YG - H * PX;   // suolo, 280 px per metro, punto di partenza (1,5 m) in y 310
  const yAlt = s => YREL + s * PX;                 // s = metri già percorsi in caduta
  function scenaPalco(ctx, t) {
    if (t < 7.5 || t > 54) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 53.2, 53.9));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 760, 692);
    const kT = 1 - P(t, 20.6, 21.2), kL = P(t, 20.8, 21.4);
    // il suolo
    if (kT > 0) { ctx.fillStyle = css(C.g, .26 * kT); ctx.beginPath(); ctx.roundRect(373, YG, 758, 69, [0, 0, 21, 21]); ctx.fill(); }
    if (kL > 0) {
      ctx.save(); ctx.globalAlpha *= kL;
      ctx.fillStyle = css(C.dim, .3); ctx.beginPath(); ctx.roundRect(373, YG, 758, 69, [0, 0, 21, 21]); ctx.fill();
      ctx.fillStyle = css(C.dim, .35);
      for (const [cx, cy, rx] of [[470, 752, 30], [760, 770, 44], [1010, 750, 26], [600, 782, 18]]) { ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * .3, 0, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // righello di 1,5 m e la linea di partenza
    const kRig = P(t, 8.0, 8.6);
    righello(ctx, 470, YREL, PX, H, 0.1, kRig);
    if (kRig > 0) { ctx.save(); ctx.globalAlpha *= kRig; ctx.setLineDash([10, 10]); ctx.strokeStyle = css(C.dim, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(500, YREL); ctx.lineTo(1100, YREL); ctx.stroke(); ctx.restore(); txt(ctx, 'm', 452, YREL - 34, { size: 30, color: C.dim, alpha: kRig }); }
    const tb = tTerra(t), tp = Math.min(tb, T_PIUMA);
    intestazione(ctx, 'sulla Terra, nell\'aria', Math.min(tb, T_PIUMA), P(t, 8.0, 8.6) * kT);
    if (kT > 0) {
      martello(ctx, 680, yAlt(Math.min(H, caduta(G, tb))), kT * P(t, 8.3, 8.8));
      piuma(ctx, 920 + 16 * Math.sin(2.3 * tp), yAlt(Math.min(H, piumaAria(tb))), .3 * Math.sin(2.3 * tp + .5), kT * P(t, 8.5, 9.0));
    }
    const tl = tLuna(t);
    intestazione(ctx, 'sulla Luna, senza aria', tl, kL);
    if (kL > 0) {
      const y = yAlt(caduta(G_LUNA, tl));
      martello(ctx, 680, y, kL * P(t, 21.2, 21.7));
      piuma(ctx, 920, y, .12, kL * P(t, 21.4, 21.9));   // senza aria non ondeggia: scende dritta
    }
    ctx.restore();
  }

  // ---------- il pannello a destra ----------
  function scenaPannello(ctx, t) {
    if (t < 12.6 || t > 54) return;
    const al = P(t, 12.6, 13.1) * (1 - P(t, 53.2, 53.9));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1170, 108, 670, 692);
    const tLand = LANCIO_LUNA + T_LUNA;
    conFont(TITOLI, () => drawRich(ctx, 'tempo di caduta da 1,5 m', 1505, 165, { size: 34, weight: 600 }));
    txt(ctx, 'martello', 1580, 228, { size: 30, color: C.dim });
    txt(ctx, 'piuma', 1750, 228, { size: 30, color: C.dim });
    txt(ctx, 'Terra, aria', 1200, 292, { size: 32, align: 'left' });
    txt(ctx, '0,55 s', 1580, 292, { size: 36, weight: 600, alpha: P(t, 12.76, 13.1) });
    txt(ctx, '≈ 3 s', 1750, 292, { size: 36, weight: 600, alpha: P(t, 15.25, 15.6) });
    txt(ctx, 'Luna', 1200, 356, { size: 32, align: 'left', alpha: P(t, 21.0, 21.5) });
    txt(ctx, '1,36 s', 1580, 356, { size: 36, weight: 600, color: C.g, alpha: P(t, tLand, tLand + .35) });
    txt(ctx, '1,36 s', 1750, 356, { size: 36, weight: 600, color: C.g, alpha: P(t, tLand, tLand + .35) });
    // l'idea sbagliata, in rosso, poi smentita
    const kI = P(t, 15.9, 16.4);
    if (kI > 0) {
      drawRich(ctx, '{r:più pesante → cade prima?}', 1480, 440, { size: 36, alpha: kI });
      const kx = P(t, 34.1, 34.7);
      if (kx > 0) {
        ctx.save(); ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1265, 442); ctx.lineTo(lerp(1265, 1695, kx), 442); ctx.stroke(); ctx.restore();
        crossMark(ctx, 1782, 440, P(t, 34.3, 35.1), C.r, .4);
      }
    }
    ctx.save(); ctx.globalAlpha *= P(t, 39.2, 39.7);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1210, 505); ctx.lineTo(1800, 505); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:nel vuoto}: stessa accelerazione', 1505, 565, { size: 34, alpha: P(t, 39.4, 39.9), local: t - 39.4 });
    txt(ctx, 'Luna', 1200, 640, { size: 32, align: 'left', alpha: P(t, 44.0, 44.4) });
    drawRich(ctx, '≈ 1,6 m/s²', 1790, 640, { size: 38, align: 'right', alpha: P(t, 44.1, 44.5) });
    txt(ctx, 'Terra', 1200, 705, { size: 32, align: 'left', alpha: P(t, 45.8, 46.2) });
    drawRich(ctx, '{mv:g} = 9,8 m/s²', 1790, 705, { size: 38, align: 'right', alpha: P(t, 45.9, 46.3) });
    txt(ctx, 'Galileo: senza aria, insieme', 1505, 765, { size: 30, color: C.dim, alpha: P(t, 49.0, 49.5) });
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    const al = 1 - P(t, 6.2, 7.0);
    conFont(TITOLI, () => drawRich(ctx, 'Il martello e la piuma', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
  }
  function scenaFine(ctx, t) {
    if (t < 53.6) return;
    const al = 1 - P(t, 61.6, 62.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 53.8 });
      drawRich(ctx, 'Nel vuoto tutti i corpi cadono insieme:\nnell\'aria la piuma è {g:frenata}.', W / 2, 290, { size: 64, weight: 600, local: t - 54.2, stagger: .08 });
    });
    const pills = [[490, 'il più pesante\n{r:non} cade prima'], [960, 'sulla Luna, senza aria:\ninsieme in 1,36 s'], [1430, 'nel vuoto, sulla Terra:\n{mv:g} = 9,8 m/s²']];
    pills.forEach(([x, s], i) => {
      const a = 55.4 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza di ciò che cade (s = ½·g·t², la piuma a velocità costante)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.0, 8.6], ['pop', 8.3, .4], ['pop', 8.5, .6],       // la Terra: il righello, il martello, la piuma
    ['tono', 12.2, 12.75, [.8, .76, .63, .41, .1]], ['pop', 12.76, .3],               // il martello cade e tocca terra: 0,55 s
    ['tono', 12.2, 15.25, [.8, .1]], ['pop', 15.25, .35],                             // la piuma scende piano, frenata: ≈ 3 s
    ['pop', 15.9, .3],                                                                // l'idea sbagliata
    ['soffio', 20.8], ['pop', 21.3, .5],                                              // sulla Luna
    ['tono', 28.6, 29.96, [.8, .76, .63, .41, .1]], ['pop', 29.96, .3],               // cadono insieme: 1,36 s (il ding lo dà «festa»)
    ['traccia', 34.1, 35.1],                                                          // l'idea sbagliata si cancella
    ['traccia', 39.2, 39.7], ['ding', 39.6],                                          // nel vuoto: stessa accelerazione
    ['pop', 44.0, .3], ['pop', 45.8, .7], ['pop', 49.0, .4],                          // Luna 1,6 m/s², Terra 9,8 m/s², Galileo
    ['soffio', 53.8], ['pop', 54.2, .6], ['pop', 55.4, .5], ['pop', 55.9, .6], ['pop', 56.4, .7],   // in una frase
  ];
  return {
    titolo: 'Il martello e la piuma', durata: 63.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 20.7, 'chi cade prima'], [20.7, 39.0, 'Apollo 15'], [39.0, 53.2, 'la stessa accelerazione']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPalco(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
