'use strict';
/* Contare i secondi dopo il lampo — il suono è un'onda longitudinale di pressione: l'aria oscilla avanti e indietro
   attorno al suo posto, compressioni e rarefazioni viaggiano a circa 340 m/s; nel vuoto non si propaga.
   Il lampo arriva in pratica subito (3·10⁸ m/s), il tuono dopo: 1000/340 ≈ 2,9 s, circa 3 s per ogni km.
   Il tubo: 3,4 m, nota da 340 Hz (periodo ≈ 2,94 ms), al rallentatore (1 s di video = 1,25 ms veri), spostamenti
   ingranditi. Ogni pezzetto d'aria segue s = g(τ − x₀/v), con g = A·sin(ω·u) (la prima oscillazione cresce piano):
   un'onda che viaggia a v senza cambiare forma. Il temporale è in tempo vero: 5 s, 1700 m. Argomento: suono. */
CVIDEO.registra('suono/suono', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed, glowStroke, crossMark, checkMark } = M;

  // ---------- il tubo: 3,4 m in 1530 px (450 px/m), il tempo vero in ms ----------
  const X0 = 250, LT = 1530, PXM = 450, VPX = .34 * PXM;     // v = 340 m/s = 0,34 m/ms = 153 px/ms
  const TP = 1000 / 340, OM = 2 * Math.PI / TP, AMP = 34;     // periodo in ms (340 Hz); ampiezza disegnata in px
  const RUN = [[12.8, 20.8], [39.2, 65.8]], LENTO = 1.25;     // ms veri per ogni secondo di video
  const tau = t => RUN.reduce((s, [a, b]) => s + (clamp(t, a, b) - a) * LENTO, 0);
  const fermo = t => t > 12.9 && t < 66 && !RUN.some(([a, b]) => t >= a - .05 && t <= b + .05);
  const env = u => u <= 0 ? 0 : u < TP ? .5 - .5 * Math.cos(Math.PI * u / TP) : 1;
  const g = u => AMP * env(u) * Math.sin(OM * u);                                   // spostamento della sorgente
  const gp = u => u <= 0 ? 0 : AMP * ((u < TP ? Math.PI / (2 * TP) * Math.sin(Math.PI * u / TP) : 0) * Math.sin(OM * u) + env(u) * OM * Math.cos(OM * u));
  const sposta = (x0, ta) => g(ta - x0 / VPX);                                      // s(x₀, τ)
  const press = (x0, ta) => gp(ta - x0 / VPX) / (AMP * OM);                         // ∝ −∂s/∂x₀, fra −1 e 1
  // i pezzetti d'aria: colonne ogni 14 px, 7 file, con un po' di disordine fisso
  const hsh = (i, j) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); };
  const PEZ = [];
  for (let i = 0; i < 112; i++) for (let j = 0; j < 7; j++) PEZ.push([10 + i * 14 + (hsh(i, j) - .5) * 8, 218 + j * 27 + (hsh(j, i + 3) - .5) * 12]);
  const VIOLA = [540, 299];                                                         // il pezzetto osservato: 1,2 m
  // compressione e rarefazione nel fermo immagine (τ = 10 ms): dove la pressione è massima e minima
  const [XC, XR] = (() => { let a = 0, b = 0, ma = -9, mb = 9; for (let x = 300; x < 1300; x++) { const p = press(x, 10); if (p > ma) { ma = p; a = x; } if (p < mb) { mb = p; b = x; } } return [a, b]; })();
  const YB = 672, YA = 60;                                                          // la riga della pressione

  // ---------- il temporale: 0 km in x 300, 700 px per km; tempo vero ----------
  const XS = 300, YG = 560, PXK = 700, XCASA = XS + 1.7 * PXK;
  const TF = 70.6;                                                                  // il fulmine
  const tvero = t => clamp(t - 75.0, 0, 5.0);                                      // fermo immagine 70,6–75,0, appena dopo il lampo
  const raggio = t => 340 * tvero(t) * PXK / 1000;                                 // 340 m/s · τ, in px

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [95.0, 190], [96.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [95.0, 1050], [96.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [95.0, 2.2], [96.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [95.0, 2], [96.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [95.0, -1.5], [96.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [25.1, 'felice'], [30.5, 'neutro'],
    [39.0, 'felice'], [43.7, 'pensa'], [47.9, 'neutro'], [52.1, 'felice'], [56.8, 'neutro'], [61.0, 'sorpreso'],
    [66.5, 'neutro'], [70.8, 'sorpreso'], [75.0, 'neutro'], [80.2, 'felice'], [85.4, 'neutro'], [90.6, 'festa'],
    [94.8, 'neutro'], [96.8, 'felice'], [102.1, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Vedi il lampo, e il tuono\narriva dopo. Perché?'],
    [7.9, 12.5, 'Un altoparlante e un tubo d’aria:\nogni puntino è un pezzetto d’aria.'],
    [12.6, 16.9, 'La membrana va avanti e indietro,\nal rallentatore, e spinge l’aria.'],
    [17.0, 21.0, 'La spinta passa da un pezzetto\nall’altro, lungo il tubo.'],
    [21.1, 25.0, 'In 10 ms la spinta\nha percorso 3,4 m.'],
    [25.1, 30.4, '{mink:v} = 3,4 m / 0,010 s = {g:340 m/s}:\nla velocità del suono nell’aria.'],
    [30.5, 34.9, 'Dove i puntini si affollano c’è\nuna {y:compressione}: più pressione.'],
    [35.1, 38.9, 'Dove si diradano, una\n{x:rarefazione}: meno pressione.'],
    [39.0, 43.5, 'Il suono è un’{v:onda di pressione}:\ncompressioni e rarefazioni in viaggio.'],
    [43.7, 47.8, 'E l’aria? Il puntino viola\ncorre via con l’onda?'],
    [47.9, 52.0, '{r:No}: va avanti e indietro,\nsempre attorno al suo posto.'],
    [52.1, 56.6, 'Oscilla lungo la direzione\ndell’onda: è un’onda {v:longitudinale}.'],
    [56.8, 60.8, 'Ora togliamo l’aria\ndal tubo: il vuoto.'],
    [61.0, 65.6, 'Non c’è niente da spingere:\nnel vuoto il suono {r:non si propaga}.'],
    [66.5, 70.4, 'Un temporale. Pronti\ncol cronometro.'],
    [70.8, 74.8, 'La luce va a circa 3·10⁸ m/s:\nla vediamo {g:subito}.'],
    [75.0, 80.1, 'Il tuono viaggia a 340 m/s:\nuno, due, tre, quattro, cinque…'],
    [80.2, 85.3, 'Cinque secondi: il fulmine è a\n5 s · 340 m/s = {g:1700 m}.'],
    [85.4, 90.5, 'Per 1 km il suono ci mette\n1000/340 ≈ 2,9 s: circa {g:3 s}.'],
    [90.6, 94.6, 'Secondi diviso 3 = chilometri:\n5/3 ≈ {g:1,7 km}.'],
    [96.8, 102.0, 'Il suono è un’onda di pressione:\n340 m/s, circa 3 s per ogni km.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 6) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1.1, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  // graffa orizzontale con le stanghette, da xa a xb all'altezza y
  function graffa(ctx, xa, xb, y, col, al = 1, su = true) {
    if (al <= 0) return;
    const d = su ? 12 : -12;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(xa, y - d); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y - d); ctx.stroke(); ctx.restore();
  }

  // ---------- 1 · il tubo d'aria (7,5–66) ----------
  function scenaTubo(ctx, t) {
    if (t < 7.5 || t > 66.5) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 65.8, 66.4));
    const ta = tau(t), mem = X0 + g(ta), vac = P(t, 57.4, 60.2);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 1720, 420);
    // in alto: l'orologio del tempo vero e il rallentatore
    const kr = P(t, 12.6, 13.1);
    if (kr > 0) {
      ctx.save(); ctx.globalAlpha *= kr;
      txt(ctx, 'tempo vero', 140, 146, { size: 30, color: C.dim, align: 'left' });
      fixedNum(ctx, fmtN(ta, 1), 425, 146, 40, t > 21 && t < 25.1 ? C.g : C.ink);
      txt(ctx, 'ms', 440, 146, { size: 30, color: C.dim, align: 'left' });
      txt(ctx, fermo(t) ? 'fermo immagine' : 'al rallentatore, spostamenti ingranditi', 1790, 146, { size: 30, color: C.dim, align: 'right' });
      ctx.restore();
    }
    // le zone di compressione e di rarefazione, nel fermo immagine
    const kc = life(t, 30.6, 39.2, .4, .4), kra = life(t, 35.2, 39.2, .4, .4);
    for (const [xx, k, col] of [[XC, kc, C.y], [XR, kra, C.x]]) {
      if (k <= 0) continue;
      const xc = X0 + xx + sposta(xx, ta);
      ctx.save(); ctx.globalAlpha *= .2 * k; ctx.fillStyle = css(col); ctx.fillRect(xc - 62, 205, 124, 188); ctx.restore();
    }
    // il tubo
    ctx.strokeStyle = css(C.ink, .55); ctx.lineWidth = 4;
    // il tubo continua oltre la scheda: niente parete di fondo, niente riflessione
    ctx.beginPath(); ctx.moveTo(X0 - 4, 202); ctx.lineTo(1816, 202); ctx.moveTo(1816, 396); ctx.lineTo(X0 - 4, 396); ctx.stroke();
    // l'altoparlante e la sua membrana
    ctx.fillStyle = css(C.ink, .14); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(140, 248, 70, 104, 10); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(210, 270); ctx.lineTo(mem, 214); ctx.lineTo(mem, 384); ctx.lineTo(210, 330); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mem, 212); ctx.lineTo(mem, 386); ctx.stroke();
    // i pezzetti d'aria
    if (vac < 1) {
      ctx.save(); ctx.globalAlpha *= (1 - vac) * .75; ctx.fillStyle = css(C.ink); ctx.beginPath();
      for (const [x0, y] of PEZ) { const x = X0 + x0 + sposta(x0, ta); if (x < mem + 7 || x > 1811) continue; ctx.moveTo(x + 5, y); ctx.arc(x, y, 5, 0, Math.PI * 2); }
      ctx.fill(); ctx.restore();
    }
    // il pezzetto viola, il suo posto e quanto si sposta
    const kv = P(t, 43.7, 44.2) * (1 - vac);
    if (kv > 0) {
      const xr = X0 + VIOLA[0], xv = xr + sposta(VIOLA[0], ta);
      ctx.save(); ctx.globalAlpha *= kv;
      ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(xr, 396); ctx.lineTo(xr, 414); ctx.moveTo(xr, 184); ctx.lineTo(xr, 202); ctx.stroke();
      ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(xv, VIOLA[1], 10, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // l'ipotesi sbagliata: arriva in fondo?
      const ki = life(t, 43.9, 48.6, .4, .5);
      if (ki > 0) {
        ctx.save(); ctx.globalAlpha *= ki;
        dashed(ctx, [xr + 30, 180], [X0 + LT - 40, 180], C.r, 1, 1);
        arrowHead(ctx, [X0 + LT - 30, 180], 0, C.r, .8);
        txt(ctx, '?', X0 + LT - 10, 176, { size: 40, weight: 600, color: C.r, align: 'left' });
        ctx.restore();
      }
      // va avanti e indietro di ±A attorno al suo posto
      const kb = life(t, 48.0, 52.1, .4, .4);
      if (kb > 0) {
        ctx.save(); ctx.globalAlpha *= kb;
        freccia(ctx, [xr, 428], [xr - AMP - 4, 428], C.g, 1, 4); freccia(ctx, [xr, 428], [xr + AMP + 4, 428], C.g, 1, 4);
        ctx.restore();
      }
      // onda longitudinale: oscilla e corre nella stessa direzione
      const kl = life(t, 52.2, 57.0, .4, .4);
      if (kl > 0) {
        ctx.save(); ctx.globalAlpha *= kl;
        freccia(ctx, [xr, 428], [xr - 56, 428], C.v, 1, 5); freccia(ctx, [xr, 428], [xr + 56, 428], C.v, 1, 5);
        txt(ctx, 'oscilla', xr - 76, 426, { size: 30, color: C.v, align: 'right' });
        freccia(ctx, [xr + 180, 428], [xr + 520, 428], C.v, 1, 5);
        txt(ctx, 'l’onda corre', xr + 540, 426, { size: 30, color: C.v, align: 'left' });
        ctx.restore();
      }
    }
    // il vuoto
    if (vac > 0) drawRich(ctx, '{r:vuoto}', X0 + LT / 2, 299, { size: 48, weight: 600, alpha: P(t, 59.7, 60.4) });
    // il righello, in metri, e il fronte della spinta
    ctx.strokeStyle = css(t > 21 && t < 25.1 ? C.v : C.ink, .7); ctx.lineWidth = t > 21 && t < 25.1 ? 5 : 3;
    ctx.beginPath(); ctx.moveTo(X0, 455); ctx.lineTo(X0 + LT, 455); ctx.stroke();
    ctx.lineWidth = 2;
    for (const [m, s] of [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [3.4, '3,4']]) {
      const x = X0 + m * PXM; ctx.strokeStyle = css(C.ink, .7);
      ctx.beginPath(); ctx.moveTo(x, 447); ctx.lineTo(x, 463); ctx.stroke();
      txt(ctx, s, x, 490, { size: 30, color: m === 3.4 && t > 21 && t < 25.1 ? C.v : C.dim, weight: m === 3.4 && t > 21 && t < 25.1 ? 600 : 500 });
    }
    txt(ctx, 'metri', 140, 490, { size: 30, color: C.dim, align: 'left' });
    const kf = P(t, 12.8, 13.1) * (1 - P(t, 30.4, 30.8));
    if (kf > 0) {
      const xf = X0 + Math.min(VPX * ta, LT);
      ctx.save(); ctx.globalAlpha *= kf; ctx.fillStyle = css(C.v);
      ctx.beginPath(); ctx.moveTo(xf, 448); ctx.lineTo(xf - 11, 430); ctx.lineTo(xf + 11, 430); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }

  // ---------- 2 · sotto il tubo: la velocità, poi la pressione (21–66) ----------
  function scenaSotto(ctx, t) {
    if (t < 21.0 || t > 66.5) return;
    const al = P(t, 21.0, 21.5) * (1 - P(t, 65.8, 66.4));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 545, 1720, 250);
    // la velocità del suono
    const kv = 1 - P(t, 30.2, 30.6);
    if (kv > 0) {
      ctx.save(); ctx.globalAlpha *= kv;
      conFont(TITOLI, () => drawRich(ctx, 'la velocità del suono', 960, 592, { size: 36, weight: 600 }));
      drawRich(ctx, '3,4 m in 10 ms = 0,010 s', 960, 690, { size: 46, local: t - 21.3, alpha: 1 - P(t, 24.9, 25.2) });
      drawRich(ctx, '{mink:v} = 3,4 m / 0,010 s = {g:340 m/s}', 960, 690, { size: 54, local: t - 25.3 });
      ctx.restore();
    }
    // la pressione lungo il tubo
    const kp = P(t, 30.6, 31.1);
    if (kp > 0) {
      const ta = tau(t), vac = P(t, 57.4, 60.2);
      ctx.save(); ctx.globalAlpha *= kp;
      txt(ctx, 'pressione lungo il tubo', 1790, 574, { size: 30, color: C.dim, align: 'right' });
      txt(ctx, 'alta', 230, YB - YA, { size: 30, color: C.dim, align: 'right' });
      txt(ctx, 'bassa', 230, YB + YA, { size: 30, color: C.dim, align: 'right' });
      ctx.strokeStyle = css(C.ink, .35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X0, YB); ctx.lineTo(X0 + LT, YB); ctx.stroke();
      const pts = [];
      for (let i = 0; i <= 380; i++) { const x0 = LT * i / 380; pts.push([X0 + x0 + sposta(x0, ta), YB - YA * press(x0, ta)]); }
      ctx.save(); ctx.globalAlpha *= 1 - vac; ctx.beginPath(); ctx.rect(X0, 550, LT, 240); ctx.clip();
      glowStroke(ctx, pts, 1, C.v, 5); ctx.restore();
      // nel fermo immagine: dov'è la compressione, dov'è la rarefazione
      const kc = life(t, 30.8, 39.1, .4, .3), kr = life(t, 35.3, 39.1, .4, .3);
      if (kc > 0) drawRich(ctx, '{y:compressione}', X0 + XC + sposta(XC, ta), YB - YA - 30, { size: 32, weight: 600, alpha: kc });
      if (kr > 0) drawRich(ctx, '{x:rarefazione}', X0 + XR + sposta(XR, ta), YB + YA + 30, { size: 32, weight: 600, alpha: kr });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- 3 · il lampo e il tuono, in tempo vero (66–94) ----------
  const FULMINE = [[332, 262], [300, 330], [346, 382], [296, 452], [328, 506], [XS, YG]];
  function scenaTemporale(ctx, t) {
    if (t < 65.9 || t > 95.4) return;
    const al = P(t, 66.0, 66.7) * (1 - P(t, 94.6, 95.2));
    const tv = tvero(t), r = raggio(t);
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 1720, 690);
    ctx.save(); ctx.beginPath(); ctx.rect(104, 114, 1712, 682); ctx.clip();
    // il lampo illumina tutto per un attimo
    const acceso = t >= TF, lampo = acceso ? Math.exp(-tv / .25) : 0;
    if (lampo > 0) { ctx.fillStyle = css(C.y, .12 * lampo); ctx.fillRect(104, 114, 1712, YG - 114); }
    // la nuvola
    ctx.fillStyle = css(C.dim, .32); ctx.beginPath();
    for (const [x, y, rr] of [[250, 215, 55], [320, 190, 70], [400, 210, 58], [460, 232, 42], [200, 240, 40], [330, 245, 60]]) { ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, Math.PI * 2); }
    ctx.fill();
    // il fulmine: dura un attimo (nel fermo immagine resta)
    const kb = acceso ? 1 - clamp((tv - .1) / .4) : 0;
    if (kb > 0) { ctx.save(); ctx.globalAlpha *= kb; glowStroke(ctx, FULMINE, 1, C.y, 7); ctx.restore(); }
    // il fronte del tuono: un semicerchio che si allarga a 340 m/s dal punto del fulmine
    const ka = acceso ? 1 - P(t, 85.1, 85.6) : 0;
    if (ka > 0 && r > 2) {
      ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.v); ctx.lineWidth = 6;
      ctx.shadowColor = css(C.v, .6); ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(XS, YG, r, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
    // il terreno e il righello in km
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(130, YG); ctx.lineTo(1790, YG); ctx.stroke();
    ctx.lineWidth = 2;
    for (const [k, s] of [[0, '0'], [.5, '0,5'], [1, '1'], [1.5, '1,5'], [2, '2 km']]) {
      const x = XS + k * PXK; ctx.beginPath(); ctx.moveTo(x, YG); ctx.lineTo(x, YG + 14); ctx.stroke();
      txt(ctx, s, x, YG + 42, { size: 30, color: C.dim });
    }
    // la casa, con la finestra che si accende quando arriva la luce
    ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 4; ctx.fillStyle = C.paper;
    ctx.beginPath(); ctx.rect(XCASA - 42, YG - 74, 84, 74); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(XCASA - 54, YG - 74); ctx.lineTo(XCASA, YG - 120); ctx.lineTo(XCASA + 54, YG - 74); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = acceso ? css(C.y, .35 + .6 * lampo) : css(C.ink, .12);
    ctx.fillRect(XCASA - 16, YG - 56, 32, 28); ctx.strokeRect(XCASA - 16, YG - 56, 32, 28);
    // il tuono arrivato: le onde accanto alla casa
    const kt = P(t, 80.0, 80.4) * (1 - P(t, 85.1, 85.6));
    if (kt > 0) {
      ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
      for (const rr of [22, 40, 58]) { ctx.beginPath(); ctx.arc(XCASA + 40, YG - 100, rr, -.6, .6); ctx.stroke(); }
      ctx.restore();
    }
    // le distanze
    const g1 = life(t, 80.4, 85.3, .4, .4), g2 = life(t, 85.5, 90.6, .4, .4), g3 = life(t, 90.7, 95.0, .4, .4);
    graffa(ctx, XS, XCASA, 650, C.g, Math.max(g1, g3));
    drawRich(ctx, '5 s · 340 m/s = {g:1700 m} = 1,7 km', (XS + XCASA) / 2, 692, { size: 36, alpha: g1 });
    drawRich(ctx, '5 s / (3 s per km) ≈ {g:1,7 km}', (XS + XCASA) / 2, 692, { size: 36, alpha: g3 });
    graffa(ctx, XS, XS + PXK, 650, C.x, g2);
    drawRich(ctx, '1 km: 1000/340 ≈ 2,9 s, circa {g:3 s}', XS + PXK / 2 + 120, 692, { size: 36, alpha: g2 });
    // il cronometro
    const kq = P(t, 66.6, 67.1);
    card(ctx, 1180, 136, 610, 222, kq);
    ctx.save(); ctx.globalAlpha *= kq;
    txt(ctx, 'cronometro', 1215, 185, { size: 30, color: C.dim, align: 'left' });
    fixedNum(ctx, fmtN(tv, 1), 1728, 185, 56, tv >= 4.99 ? C.g : C.ink);
    txt(ctx, 's', 1742, 188, { size: 32, color: C.dim, align: 'left' });
    const kl = P(t, 70.7, 71.1), kn = P(t, 75.0, 75.4);
    txt(ctx, 'luce', 1215, 255, { size: 32, weight: 600, color: C.y, align: 'left', alpha: kl });
    drawRich(ctx, '3·10⁸ m/s', 1340, 255, { size: 30, align: 'left', alpha: kl });
    drawRich(ctx, '≈ 0,000006 s', 1765, 255, { size: 30, align: 'right', alpha: kl });
    txt(ctx, 'tuono', 1215, 315, { size: 32, weight: 600, color: C.v, align: 'left', alpha: kn });
    drawRich(ctx, '340 m/s', 1340, 315, { size: 30, align: 'left', alpha: kn });
    drawRich(ctx, '{g:5 s}', 1765, 315, { size: 30, align: 'right', alpha: P(t, 80.0, 80.4) });
    ctx.restore();
    const fi = (t >= TF && t < 75.0) || (t > 80.05 && t < 95.0);
    txt(ctx, fi ? 'fermo immagine' : 'tempo vero', 1790, 770, { size: 30, color: C.dim, align: 'right', alpha: P(t, 66.6, 67.1) });
    ctx.restore();
  }

  // ---------- titolo e chiusura ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Contare i secondi dopo il lampo', W / 2, 180, { size: 100, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 95.0) return;
    const al = 1 - P(t, 102.6, 103.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 95.2 });
      drawRich(ctx, 'Il suono è un’onda di pressione:\nnell’aria corre a circa 340 m/s.', W / 2, 290, { size: 66, weight: 600, local: t - 95.6, stagger: .08 });
    });
    const pills = [[490, 'l’aria oscilla\nma resta al suo posto'], [960, 'nel vuoto\n{r:non} si propaga'], [1430, 'circa {g:3 s}\nper ogni km']];
    pills.forEach(([x, s], i) => {
      const a = 97.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti: niente toni (si
  // confonderebbero con la nota del tubo e col tuono); nel temporale un pop leggero per ogni secondo del cronometro
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 12.7, .4], ['traccia', 12.8, 14.0],                      // il tubo; la membrana spinge
    ['pop', 21.1, .5], ['ding', 25.5],                                                // 3,4 m in 10 ms: 340 m/s
    ['soffio', 30.6], ['pop', 30.9, .7], ['pop', 35.4, .25],                          // la pressione: compressione, rarefazione
    ['pop', 43.8, .5], ['traccia', 43.9, 44.3],                                       // il puntino viola: corre via?
    ['pop', 48.1, .45], ['pop', 52.3, .5], ['traccia', 52.3, 52.7],                   // no, oscilla; l'onda corre
    ['pop', 59.8, .3],                                                                // il vuoto
    ['soffio', 66.0], ['pop', 66.7, .4],                                              // il temporale, il cronometro
    ['pop', 70.6, .9],                                                                // il lampo
    ['pop', 76.0, .35], ['pop', 77.0, .35], ['pop', 78.0, .35], ['pop', 79.0, .35],   // il tuono viaggia: un secondo alla volta
    ['ding', 80.1],                                                                   // arriva dopo 5 s
    ['traccia', 80.4, 80.8], ['traccia', 85.5, 85.9], ['traccia', 90.7, 91.1],        // 1700 m; 3 s per km; 1,7 km
    ['soffio', 95.2], ['pop', 97.2, .5], ['pop', 97.7, .6], ['pop', 98.2, .7],        // in una frase
  ];
  return {
    titolo: 'Contare i secondi dopo il lampo', durata: 105, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.0, 'la spinta che corre'], [21.0, 43.5, 'un’onda di pressione'], [43.5, 66.0, 'l’aria resta al suo posto'], [66.0, 94.6, 'il lampo e il tuono']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaTubo(ctx, t); scenaSotto(ctx, t); scenaTemporale(ctx, t); scenaFine(ctx, t); },
  };
});
