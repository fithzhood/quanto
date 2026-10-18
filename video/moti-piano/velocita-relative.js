'use strict';
/* Attraversare il fiume — una barca a 2 m/s rispetto all'acqua attraversa un fiume largo 40 m con la corrente a 1 m/s:
   puntando dritta arriva 20 m più giù in 20 s; le velocità si sommano come vettori; per arrivare dritta punta
   controcorrente di 30° (sin θ = 1/2) e ci mette 40/√3 ≈ 23,1 s. Argomento: moti-piano. */
CVIDEO.registra('moti-piano/velocita-relative', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fixedNum, fmtN, card, arrowHead, dashed } = M;

  // ---------- il moto vero, in avanti veloce 4 volte (1 s di video = 4 s di traversata) ----------
  const L = 40, VB = 2, VC = 1, PXM = 12;                 // larghezza in m, barca e corrente in m/s, 12 px per metro
  const VEL = 4;                                          // avanti veloce
  const S = [600, 700];                                   // partenza, sulla riva di sotto; l'altra riva è in y 220
  const TH = Math.asin(VC / VB);                          // 30°: sin θ = corrente / barca
  const VP = Math.sqrt(VB * VB - VC * VC);                // 1,73 m/s verso la riva
  const T1 = 13.2, T2 = 22.4, T3 = 74.0;                  // partenze delle tre traversate
  const tau = (t, t0, max) => clamp((t - t0) * VEL, 0, max);
  const posizione = (vx, vy, tt) => [S[0] + vx * tt * PXM, S[1] - vy * tt * PXM];
  const TRAV = [[T1, T1 + 20 / VEL], [T2, T2 + 20 / VEL], [T3, T3 + L / VP / VEL]];
  const tempoAcqua = t => t + (VEL - 1) * TRAV.reduce((s, [a, b]) => s + clamp(t, a, b) - a, 0);   // il tempo che vede l'acqua
  const veloce = t => Math.max(...TRAV.map(([a, b]) => life(t, a - .2, b + .3, .25, .3)));
  const theta = t => kf(t, [[60.2, 0], [63.0, TH]]);
  const VS = 70;                                          // frecce delle velocità: 70 px per m/s
  const COL_C = () => mix(C.x, C.ink, .45);               // la corrente: un azzurro più scuro

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [96.4, 190], [97.7, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [96.4, 1050], [97.7, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [96.4, 2.2], [97.7, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [96.4, 2], [97.7, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [96.4, -1.5], [97.7, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [27.5, 'sorpreso'], [31.5, 'felice'],
    [35.4, 'neutro'], [49.4, 'felice'], [55.0, 'neutro'], [59.6, 'pensa'], [63.8, 'neutro'], [73.8, 'felice'],
    [77.6, 'neutro'], [87.6, 'felice'], [91.6, 'neutro'], [99.0, 'felice'], [102.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.4, 6.4, 'Una barca attraversa un fiume:\ndove arriva, se c’è corrente?'],
    [7.9, 12.9, 'Il fiume è largo 40 m. La barca\nva a 2 m/s rispetto all’acqua.'],
    [13.0, 18.4, 'Senza corrente punta dritta\ne arriva dritta, in 20 s.'],
    [18.6, 22.1, 'Ora l’acqua scorre a 1 m/s,\nverso destra.'],
    [22.3, 27.3, 'La barca punta ancora dritta…'],
    [27.5, 31.3, '…e la corrente la porta\ngiù di {g:20 m}.'],
    [31.5, 35.2, 'Ma ci mette sempre {g:20 s}.'],
    [35.4, 39.8, 'Le velocità si sommano\ncome {v:vettori}, punta-coda.'],
    [40.0, 44.8, 'La barca rispetto all’acqua:\n2 m/s, verso l’altra riva.'],
    [45.0, 49.2, 'Più la corrente: 1 m/s,\nlungo il fiume.'],
    [49.4, 54.8, 'La somma è la velocità rispetto\nalla riva: √(2² + 1²) ≈ {g:2,24 m/s}.'],
    [55.0, 59.4, 'Ha la direzione della scia:\nla barca va {g:in diagonale}.'],
    [59.6, 63.6, 'Per arrivare {g:dritti} si punta\n{v:controcorrente}.'],
    [63.8, 67.8, 'Chiamo {mink:θ} l’angolo fra la prua\ne la direzione dritta.'],
    [68.0, 73.6, 'A {mink:θ} = 30° la barca risale\na 2·sin 30° = 1 m/s: come la corrente.'],
    [73.8, 77.4, 'Così arriva {g:dritta}…'],
    [77.6, 82.4, '…ma più piano: verso la riva\nsolo √(2² − 1²) ≈ 1,73 m/s.'],
    [82.6, 87.4, 'Ci mette di più: 40 m / 1,73 m/s\n≈ {g:23,1 s}.'],
    [87.6, 91.4, 'Il tempo dipende solo dalla\nvelocità {g:verso la riva}.'],
    [91.6, 96.2, 'Si può fare solo se la barca\nè {g:più veloce} della corrente.'],
    [99.0, 103.6, 'Velocità rispetto alla riva =\nbarca + corrente, come vettori.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 7) {
    const dx = b[0] - a[0], dy = b[1] - a[1], Ln = Math.hypot(dx, dy);
    if (al <= 0.01 || Ln < 2) return;
    const ux = dx / Ln, uy = dy / Ln, s = Math.min(1.3, Ln / 22);
    ctx.save(); ctx.globalAlpha *= al;
    if (Ln > 14 * s) {
      ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    }
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  // la barca vista dall'alto: (x, y) il centro, ang l'angolo della prua rispetto alla direzione dritta (positivo = a sinistra)
  function barca(ctx, p, ang, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.rotate(-ang);
    ctx.fillStyle = css(mix(C.y, C.dim, .35)); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(14, -18, 14, 10, 10, 24); ctx.lineTo(-10, 24); ctx.bezierCurveTo(-14, 10, -14, -18, 0, -30);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.paper, .8); ctx.fillRect(-6, 0, 12, 6);
    ctx.restore();
  }
  // un'etichetta su un fondino color carta, perché i segni della corrente non la attraversino
  function etichetta(ctx, s, x, y, col, al = 1, align = 'center') {
    if (al <= 0) return;
    const w = richW(ctx, s, 30, 600) + 16, x0 = align === 'left' ? x - 8 : align === 'right' ? x - w + 8 : x - w / 2;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.paper, .9); ctx.beginPath(); ctx.roundRect(x0, y - 21, w, 42, 10); ctx.fill(); ctx.restore();
    txt(ctx, s, x, y, { size: 30, weight: 600, color: col, align, alpha: al });
  }
  function scia(ctx, a, b, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.setLineDash([10, 10]); ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
  }

  // ---------- il fiume, visto dall'alto ----------
  const YA = 220, YB = 700;                               // le due rive
  function scenaFiume(ctx, t) {
    if (t < 7.5 || t > 97.0) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 96.2, 96.8));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 880, 692);
    ctx.fillStyle = css(C.g, .26);
    ctx.beginPath(); ctx.roundRect(373, 109, 878, YA - 109, [21, 21, 0, 0]); ctx.fill();
    ctx.beginPath(); ctx.roundRect(373, YB, 878, 99, [0, 0, 21, 21]); ctx.fill();
    ctx.fillStyle = css(C.x, .1); ctx.fillRect(373, YA, 878, YB - YA);
    // la corrente: segni che scorrono a 1 m/s (4 volte più svelti durante le traversate)
    const kc = P(t, 18.8, 19.6);
    if (kc > 0) {
      const passo = 170, sp = VC * PXM, ta = tempoAcqua(t);
      for (let r = 0; r < 6; r++) {
        const y = 262 + r * 80, off = ((ta * sp + r * 57) % passo + passo) % passo;
        for (let x = 373 - passo + off; x < 1250; x += passo) {
          const a = clamp((x - 380) / 40) * clamp((1240 - x - 34) / 40);
          if (a > 0) freccia(ctx, [x, y], [x + 34, y], COL_C(), .3 * kc * a, 3);
        }
      }
    }
    // la larghezza
    const kw = P(t, 8.2, 8.8);
    if (kw > 0) {
      ctx.save(); ctx.globalAlpha *= kw; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(400, YA); ctx.lineTo(400, YB); ctx.moveTo(392, YA); ctx.lineTo(408, YA); ctx.moveTo(392, YB); ctx.lineTo(408, YB); ctx.stroke(); ctx.restore();
      etichetta(ctx, '40 m', 414, 460, C.dim, kw, 'left');
    }
    txt(ctx, 'riva', 1230, YA - 26, { size: 30, color: C.dim, align: 'right', alpha: kw });
    txt(ctx, 'riva', 1230, YB + 34, { size: 30, color: C.dim, align: 'right', alpha: kw });
    // l'orologio della traversata
    const tc = t < 20.3 ? tau(t, T1, 20) : t < 60 ? tau(t, T2, 20) : tau(t, T3, L / VP);
    ctx.save(); ctx.globalAlpha *= P(t, 12.9, 13.4);
    drawRich(ctx, '{mink:t} =', 404, 734, { size: 36, align: 'left' });
    fixedNum(ctx, fmtN(tc, 1), 560, 734, 38, C.ink); txt(ctx, 's', 570, 734, { size: 32, color: C.dim, align: 'left' });
    txt(ctx, 'avanti veloce, 4 volte', 610, 736, { size: 30, color: C.dim, align: 'left', alpha: veloce(t) });
    ctx.restore();

    // 1 · senza corrente: dritta in 20 s
    const k1 = P(t, 8.0, 8.5) * (1 - P(t, 18.4, 18.8));
    const p1 = posizione(0, VB, tau(t, T1, 20));
    scia(ctx, S, p1, P(t, T1, T1 + .2) * (1 - P(t, 34.9, 35.4)) * .7);
    barca(ctx, p1, 0, k1);
    // 2 · con la corrente: 20 m più giù, sempre in 20 s
    const k2 = P(t, 18.8, 19.3) * (1 - P(t, 59.2, 59.6));
    const p2 = posizione(VC, VB, tau(t, T2, 20));
    scia(ctx, S, p2, P(t, T2, T2 + .2) * (1 - P(t, 59.2, 59.6)));
    barca(ctx, p2, 0, k2);
    const kd = life(t, T2 + 5, 59.4, .4, .4);
    if (kd > 0) {
      ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(S[0], YA - 12); ctx.lineTo(S[0], YA - 32); ctx.moveTo(S[0], YA - 22); ctx.lineTo(S[0] + 20 * PXM, YA - 22); ctx.moveTo(S[0] + 20 * PXM, YA - 12); ctx.lineTo(S[0] + 20 * PXM, YA - 32); ctx.stroke(); ctx.restore();
      txt(ctx, '20 m', S[0] + 10 * PXM, YA - 54, { size: 30, weight: 600, color: C.g, alpha: kd });
    }
    // 3 · controcorrente: arriva dritta, in 23,1 s
    const k3 = P(t, 59.6, 60.1), kb3 = P(t, 73.5, 73.9);   // la barca torna quando le frecce se ne vanno
    const th = theta(t), p3 = posizione(0, VP, tau(t, T3, L / VP));
    if (k3 > 0) {
      ctx.save(); ctx.globalAlpha *= k3;
      ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;   // il punto di fronte
      ctx.beginPath(); ctx.moveTo(S[0] - 12, YA - 12); ctx.lineTo(S[0] + 12, YA + 12); ctx.moveTo(S[0] + 12, YA - 12); ctx.lineTo(S[0] - 12, YA + 12); ctx.stroke();
      txt(ctx, 'di fronte', S[0] + 26, YA - 26, { size: 30, color: C.g, align: 'left' });
      ctx.restore();
      scia(ctx, S, p3, k3 * P(t, T3, T3 + .2));
      barca(ctx, p3, th, kb3);
    }

    // le velocità sommate punta-coda, disegnate alla partenza (40–74)
    const kv = life(t, 40.2, 73.9, .4, .4);
    if (kv > 0) {
      const thv = t < 59.5 ? 0 : th;
      const ab = [S[0] - VB * VS * Math.sin(thv), S[1] - VB * VS * Math.cos(thv)];   // punta della barca rispetto all'acqua
      const kcor = P(t, 45.2, 45.8), ks = P(t, 49.6, 50.3);
      const ac = [ab[0] + VC * VS * kcor, ab[1]];
      ctx.save(); ctx.globalAlpha *= kv;
      // la somma: rispetto alla riva
      freccia(ctx, S, [lerp(S[0], ac[0], ks), lerp(S[1], ac[1], ks)], C.x, ks, 10);
      freccia(ctx, S, ab, C.x, 1, 6);
      freccia(ctx, ab, ac, COL_C(), kcor, 6);
      etichetta(ctx, '2 m/s', Math.min(ab[0], S[0]) - 22, (S[1] + ab[1]) / 2, C.x, 1, 'right');
      etichetta(ctx, '1 m/s', ab[0] + 35, ab[1] - 30, COL_C(), kcor);
      etichetta(ctx, '2,24 m/s', S[0] + 62, S[1] - 34, C.x, ks * (1 - P(t, 59.6, 60.0)), 'left');
      // l'angolo θ fra la prua e la direzione dritta
      const ka = P(t, 64.0, 64.5);
      if (ka > 0) {
        ctx.save(); ctx.globalAlpha *= ka;
        dashed(ctx, S, [S[0], S[1] - 150], C.dim, 1, 1);
        ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(S[0], S[1], 64, -Math.PI / 2 - thv, -Math.PI / 2); ctx.stroke();
        drawRich(ctx, '{mink:θ}', S[0] - 22, S[1] - 82, { size: 34 });
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  }


  // ---------- il pannello ----------
  const PCX = 1560;
  function scenaPannello(ctx, t) {
    if (t < 8.4 || t > 97.0) return;
    const al = P(t, 8.4, 8.9) * (1 - P(t, 96.2, 96.8));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1280, 108, 560, 692);
    const tit = s => conFont(TITOLI, () => drawRich(ctx, s, PCX, 168, { size: 36, weight: 600 }));
    const riga = y => { ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1320, y); ctx.lineTo(1800, y); ctx.stroke(); };
    const voce = (nome, val, y, a, col = C.ink) => { txt(ctx, nome, 1320, y, { size: 30, color: C.dim, align: 'left', alpha: a }); drawRich(ctx, val, 1800, y, { size: 36, align: 'right', alpha: a, fill: col === C.ink ? undefined : css(col) }); };
    // 1 · la traversata
    const s1 = 1 - P(t, 35.0, 35.4);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('la traversata');
      voce('larghezza', '40 m', 245, 1);
      voce('barca, rispetto all’acqua', '2 m/s', 305, 1, C.x);
      voce('corrente', t < 18.8 ? '0 m/s' : '1 m/s', 365, 1, COL_C());
      ctx.save(); ctx.globalAlpha *= P(t, 18.0, 18.4); riga(420); ctx.restore();
      txt(ctx, 'senza corrente', 1320, 470, { size: 30, color: C.dim, align: 'left', alpha: P(t, 18.2, 18.6) });
      drawRich(ctx, '20 s, arriva {g:dritta}', 1320, 518, { size: 36, align: 'left', alpha: P(t, 18.3, 18.7) });
      txt(ctx, 'con la corrente', 1320, 590, { size: 30, color: C.dim, align: 'left', alpha: P(t, 27.4, 27.8) });
      drawRich(ctx, '20 s, arriva {g:20 m} più giù', 1320, 638, { size: 36, align: 'left', alpha: P(t, 27.5, 27.9) });
      drawRich(ctx, '{g:stesso tempo}', PCX, 725, { size: 40, weight: 600, alpha: P(t, 30.8, 31.3), local: t - 30.8 });
      ctx.restore();
    }
    // 2 · la somma delle velocità
    const s2 = life(t, 35.4, 59.4, .4, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('velocità che si sommano');
      txt(ctx, 'rispetto alla riva', PCX, 250, { size: 34, weight: 600, color: C.x, alpha: P(t, 35.6, 36.1) });
      drawRich(ctx, '= barca rispetto all’acqua', PCX, 305, { size: 34, alpha: P(t, 36.0, 36.5) });
      drawRich(ctx, '+ corrente', PCX, 360, { size: 34, alpha: P(t, 36.4, 36.9) });
      ctx.save(); ctx.globalAlpha *= P(t, 40.2, 40.6); riga(415); ctx.restore();
      voce('barca', '2 m/s, dritta', 465, P(t, 40.3, 40.8), C.x);
      voce('corrente', '1 m/s, di lato', 525, P(t, 45.2, 45.7), COL_C());
      voce('somma', '√(2² + 1²) ≈ 2,24 m/s', 600, P(t, 49.6, 50.1), C.x);
      txt(ctx, 'ogni secondo: 2 m avanti, 1 m giù', PCX, 690, { size: 30, color: C.dim, alpha: P(t, 55.2, 55.7) });
      ctx.restore();
    }
    // 3 · arrivare dritti
    const s3 = P(t, 59.6, 60.0);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('arrivare dritti');
      const dim = (str, y, k) => drawRich(ctx, '{dim:' + str + '}', 1320, y, { size: 30, align: 'left', alpha: k });
      drawRich(ctx, 'si punta {v:controcorrente}', PCX, 240, { size: 36, alpha: P(t, 59.8, 60.3) });
      drawRich(ctx, '{mink:θ}{dim: = angolo con la direzione dritta}', PCX, 292, { size: 30, alpha: P(t, 64.0, 64.5) });
      drawRich(ctx, '{mink:sin θ} = corrente / barca = 1/2', PCX, 350, { size: 34, alpha: P(t, 68.2, 68.7) });
      drawRich(ctx, '{mink:θ} = {g:30°}', PCX, 402, { size: 40, alpha: P(t, 69.4, 69.9) });
      ctx.save(); ctx.globalAlpha *= P(t, 77.6, 78.0); riga(448); ctx.restore();
      dim('verso la riva', 488, P(t, 77.8, 78.3));
      drawRich(ctx, '√(2² − 1²) ≈ {x:1,73 m/s}', 1320, 532, { size: 36, align: 'left', alpha: P(t, 77.9, 78.4) });
      dim('tempo', 584, P(t, 82.8, 83.3));
      drawRich(ctx, '40 m / 1,73 m/s ≈ {g:23,1 s}', 1320, 628, { size: 36, align: 'left', alpha: P(t, 82.9, 83.4) });
      ctx.save(); ctx.globalAlpha *= P(t, 91.8, 92.2); riga(672); ctx.restore();
      drawRich(ctx, '{r:barca più lenta della corrente:}', PCX, 712, { size: 32, alpha: P(t, 92.0, 92.5) });
      drawRich(ctx, '{r:non arriva mai dritta}', PCX, 756, { size: 32, alpha: P(t, 92.3, 92.8) });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Attraversare il fiume', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 96.6) return;
    const al = 1 - P(t, 104.4, 105.4);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 96.8 });
      drawRich(ctx, 'La velocità rispetto alla riva è la {v:somma}\n{v:vettoriale} di barca e corrente.', W / 2, 290, { size: 62, weight: 600, local: t - 97.2, stagger: .08 });
    });
    const pills = [[490, 'punta dritta:\nla corrente la porta giù'], [960, 'per arrivare dritti:\n{mink:sin θ} = corrente / barca'], [1430, 'il tempo lo decide\nla velocità {g:verso la riva}']];
    pills.forEach(([x, s], i) => {
      const a = 98.4 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // i toni delle traversate seguono la barca che sale verso l'altra riva
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.2, 8.8], ['pop', 8.4, .45],                        // il fiume, 40 m
    ['tono', 13.2, 18.2, [.1, .3, .5, .7, .9]], ['ding', 18.3],                       // senza corrente: dritta in 20 s
    ['pop', 18.8, .4],                                                                // la corrente
    ['tono', 22.4, 27.4, [.1, .3, .5, .7, .9]],                                       // con la corrente
    ['traccia', 27.4, 27.8], ['ding', 27.5],                                          // 20 m più giù
    ['ding', 30.8],                                                                   // stesso tempo
    ['soffio', 35.4], ['pop', 35.6, .5],                                              // le velocità si sommano
    ['pop', 40.3, .5],                                                                // barca: 2 m/s
    ['traccia', 45.2, 45.8], ['pop', 45.2, .45],                                      // più la corrente
    ['traccia', 49.6, 50.3], ['ding', 49.6],                                          // la somma: 2,24 m/s
    ['pop', 55.2, .4],                                                                // 2 m avanti, 1 m giù
    ['soffio', 59.6], ['pop', 59.8, .5],                                              // arrivare dritti
    ['tono', 60.2, 63.0, [.3, .33, .5, .67, .7]],                                     // la prua ruota controcorrente
    ['traccia', 64.0, 64.5],                                                          // l'angolo theta
    ['pop', 68.2, .5], ['ding', 69.4],                                                // sin theta = 1/2: 30 gradi
    ['tono', 74.0, 79.77, [.1, .3, .5, .7, .9]], ['pop', 77.9, .5], ['pop', 79.8, .9],   // dritta, a 1,73 m/s
    ['ding', 82.9],                                                                   // 23,1 s
    ['pop', 92.0, .3],                                                                // più lenta della corrente
    ['soffio', 96.8], ['pop', 98.4, .5], ['pop', 98.9, .6], ['pop', 99.4, .7],        // in una frase
  ];
  return {
    titolo: 'Attraversare il fiume', durata: 106, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.2, 'la corrente porta giù'], [35.2, 59.4, 'le velocità si sommano'], [59.4, 96.2, 'arrivare dritti']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaFiume(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});
