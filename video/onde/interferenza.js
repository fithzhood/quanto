'use strict';
/* Due sassi nello stagno — principio di sovrapposizione e interferenza, visti dall'alto. Prima due sassi: le creste si
   incontrano, l'acqua sale il doppio, poi ognuna prosegue intatta. Poi due punte S₁ e S₂ (distanti 3 λ) battono
   insieme: in P (4 λ da S₁, 5 λ da S₂: differenza λ) cresta con cresta, oscilla il doppio; in Q (4,5 λ e 4 λ:
   differenza λ/2) cresta con gola, sta ferma. Costruttiva per n·λ, distruttiva per (n + ½)·λ: le linee di quiete.
   Moto vero: ogni punta manda A·sin(k·r − ω·t) dentro il cerchio r < v·t (cerchi a velocità costante), e l'acqua
   fa la somma delle due; i sassi mandano una cresta sola. Al rallentatore. Argomento: onde. */
CVIDEO.registra('onde/interferenza', M => {
  const { W, C, E, P, life, clamp, lerp, css, rgb, TITOLI, conFont, drawRich, txt, card, dashed, dot } = M;

  // ---------- lo stagno visto dall'alto ----------
  const CS = [140, 110, 1040, 690];                       // la scheda dello stagno
  const LAM = 90, S1 = [525, 230], S2 = [795, 230];       // λ = 90 px, le punte a 3 λ
  const PP = [525, 590], QQ = [723.75, 582.88];           // P: 4 λ e 5 λ; Q: 4,5 λ e 4 λ (ricontrollati con node)
  // 1 · i due sassi: una cresta sola, larga 60 px, che si allarga a 40 px/s; fermo immagine quando si toccano
  const TD = 8.8, V1 = 40, LARGA = 60, TM = TD + (S2[0] - S1[0]) / 2 / V1, FERMO1 = [TM, 16.6];
  const tau1 = t => (t - TD) - clamp(t - FERMO1[0], 0, FERMO1[1] - FERMO1[0]);
  const cresta1 = (r, ta) => { const s = r - V1 * ta; return ta <= 0 || Math.abs(s) > LARGA / 2 ? 0 : Math.cos(Math.PI * s / LARGA) ** 2; };
  // 2 · le due punte, dalle 26 s: λ = 90 px, T = 1 s (v = 90 px/s)
  const T2 = 26.0, K = 2 * Math.PI / LAM, OM = 2 * Math.PI, V2 = LAM;
  const onda2 = (r, tb) => tb <= 0 || r > V2 * tb ? 0 : Math.sin(K * r - OM * tb);
  const dist = (x, y, s) => Math.hypot(x - s[0], y - s[1]);
  function altezza(x, y, t) {
    const r1 = dist(x, y, S1), r2 = dist(x, y, S2);
    let h = 0;
    const k1 = 1 - P(t, 25.0, 25.8);
    if (k1 > 0) { const ta = tau1(t); h += k1 * (cresta1(r1, ta) + cresta1(r2, ta)); }
    if (t > T2) { const tb = t - T2; h += onda2(r1, tb) + onda2(r2, tb); }
    return h;
  }
  // le iperboli: i punti con r₂ − r₁ = Δ (Δ in lunghezze d'onda), una spezzata per ramo
  function iperbole(D) {
    const pts = [];
    for (let y = 262; y <= CS[1] + CS[3]; y += 4) {   // solo sotto le punte: sopra ci sono i loro nomi
      const f = x => (dist(x, y, S2) - dist(x, y, S1)) / LAM - D;   // decresce con x
      let a = CS[0], b = CS[0] + CS[2];
      if (f(a) < 0 || f(b) > 0) continue;
      for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (f(m) > 0) a = m; else b = m; }
      pts.push([(a + b) / 2, y]);
    }
    return pts;
  }
  const QUIETE = [-2.5, -1.5, -.5, .5, 1.5, 2.5].map(iperbole);
  const FORTI = [-2, -1, 0, 1, 2].map(iperbole);

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [81.2, 190], [82.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [81.2, 1050], [82.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [81.2, 2.2], [82.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [81.2, 2], [82.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [81.2, -1.5], [82.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.4, 'sorpreso'], [16.6, 'felice'],
    [21.0, 'neutro'], [30.2, 'felice'], [34.9, 'neutro'], [39.2, 'sorpreso'], [44.0, 'neutro'], [48.6, 'felice'], [52.8, 'neutro'], [58.0, 'pensa'],
    [62.4, 'sorpreso'], [66.6, 'neutro'], [71.8, 'felice'], [76.4, 'neutro'], [83.4, 'felice'], [87.4, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.5, 6.3, 'Che cosa succede quando\ndue onde si incontrano?'],
    [7.9, 12.2, 'Due sassi toccano l’acqua: parte\nuna {x:cresta}, un anello più alto.'],
    [12.4, 16.4, 'Dove le creste si incontrano\nl’acqua sale il {g:doppio}.'],
    [16.6, 20.8, 'Poi ognuna prosegue {g:intatta},\ncome se l’altra non ci fosse.'],
    [21.0, 25.4, 'Gli spostamenti si sommano: è il\n{v:principio di sovrapposizione}.'],
    [25.6, 30.0, 'Ora due punte, {mink:S₁} e {mink:S₂}, battono\nl’acqua insieme (al rallentatore).'],
    [30.2, 34.75, 'Azzurro: {x:cresta}, il punto più alto.\nArancio: {y:gola}, il più basso.'],
    [34.9, 38.9, 'Da una cresta alla successiva c’è\nuna {v:lunghezza d’onda}, {mink:λ}.'],
    [39.2, 43.8, 'Compaiono strisce dove l’acqua\nresta ferma: le {v:linee di quiete}.'],
    [44.0, 48.4, 'Nel punto {g:P} le due onde arrivano\ncresta con cresta…'],
    [48.6, 52.6, '…e si sommano: l’acqua\noscilla il {g:doppio}.'],
    [52.8, 57.8, '{g:P}: 4 {mink:λ} da {mink:S₁}, 5 {mink:λ} da {mink:S₂}.\nLa differenza è 1 {mink:λ}.'],
    [58.0, 62.2, 'Nel punto {v:Q} arrivano invece\ncresta con gola…'],
    [62.4, 66.4, '…e si annullano:\nl’acqua resta ferma.'],
    [66.6, 71.6, '{v:Q}: 4,5 {mink:λ} da {mink:S₁}, 4 {mink:λ} da {mink:S₂}.\nLa differenza è mezza {mink:λ}.'],
    [71.8, 76.2, 'Differenza {mink:n·λ} ({mink:n} intero):\ninterferenza {g:costruttiva}.'],
    [76.4, 81.0, 'Differenza {mink:(n + ½)·λ}: {v:distruttiva},\nsono le linee di quiete.'],
    [83.4, 89.0, 'Le onde si sommano dove si incontrano,\npoi proseguono intatte.'],
  ];

  // ---------- aiutanti ----------
  // un'etichetta su un fondino color carta: l'acqua sotto si muove
  function chip(ctx, s, x, y, al = 1, size = 34) {
    if (al <= 0) return;
    const w = M.richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, alpha: al });
  }
  function spezzata(ctx, pts, col, al, w = 3, trat = [10, 8]) {
    if (al <= 0 || pts.length < 2) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.setLineDash(trat); ctx.lineCap = 'round';
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  }

  // ---------- lo stagno: l'altezza dell'acqua punto per punto, su una griglia di 4 px ----------
  const CELLA = 4, NX = CS[2] / CELLA, NY = Math.ceil(CS[3] / CELLA);
  let TELA = null, IMG = null;   // solo un foglio di lavoro: ogni fotogramma lo riscrive tutto
  function stagno(ctx, t, al) {
    if (!TELA) { TELA = document.createElement('canvas'); TELA.width = NX; TELA.height = NY; IMG = TELA.getContext('2d').createImageData(NX, NY); }
    const base = rgb(C.paper), cx = rgb(C.x), cy = rgb(C.y), d = IMG.data;
    for (let j = 0; j < NY; j++) {
      const y = CS[1] + (j + .5) * CELLA;
      for (let i = 0; i < NX; i++) {
        const u = clamp(altezza(CS[0] + (i + .5) * CELLA, y, t) / 2, -1, 1);   // ±1 = due creste (o due gole)
        const c = u >= 0 ? cx : cy, k = Math.abs(u), o = 4 * (j * NX + i);
        d[o] = lerp(base[0], c[0], k); d[o + 1] = lerp(base[1], c[1], k); d[o + 2] = lerp(base[2], c[2], k); d[o + 3] = 255;
      }
    }
    TELA.getContext('2d').putImageData(IMG, 0, 0);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath(); ctx.roundRect(CS[0] + 2, CS[1] + 2, CS[2] - 4, CS[3] - 4, 20); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.drawImage(TELA, CS[0], CS[1], NX * CELLA, NY * CELLA);
    ctx.restore();
  }

  // 30,2–39,2: un pezzo nuovo (cresta, gola e λ); il resto della scena aspetta. Le onde invece scorrono, tranne nel
  // fermo immagine 34,9–39,1 in cui si misura λ.
  const vecchio = t => t < 30.2 ? t : t < 39.2 ? 30.2 : t - 9.0;
  const FERMO2 = [34.9, 39.1], tw = t => t - clamp(t - FERMO2[0], 0, FERMO2[1] - FERMO2[0]);
  // le linee si disegnano solo dove sono già arrivate tutte e due le onde
  const arrivate = (pts, w) => pts.filter(([x, y]) => Math.max(dist(x, y, S1), dist(x, y, S2)) < V2 * (w - T2) - 20);
  function scenaStagno(ctx, t, T) {
    if (t < 7.5 || t > 72.8) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 72.0, 72.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, ...CS);
    stagno(ctx, tw(T), P(t, 7.6, 8.3));
    // la riga della sezione (parte 1)
    const kr = life(t, 9.0, 25.4, .5, .5);
    if (kr > 0) dashed(ctx, [CS[0] + 10, S1[1]], [CS[0] + CS[2] - 10, S1[1]], C.ink, 1, .55 * kr);
    // i sassi: un tonfo nei due punti
    const ks = life(t, TD - .3, TD + 1.2, .2, .6);
    if (ks > 0) { dot(ctx, S1, C.ink, ks, 9); dot(ctx, S2, C.ink, ks, 9); }
    // le punte
    const kp = P(t, 25.7, 26.1);
    if (kp > 0) {
      dot(ctx, S1, C.ink, kp, 9); dot(ctx, S2, C.ink, kp, 9);
      chip(ctx, '{mink:S₁}', S1[0], S1[1] - 52, kp, 36); chip(ctx, '{mink:S₂}', S2[0], S2[1] - 52, kp, 36);
    }
    // le linee di quiete e quelle di massima oscillazione
    const kq = Math.max(life(t, 30.8, 34.8, .6, .5), life(t, 67.6, 72.0, .6, .5));
    QUIETE.forEach(p => spezzata(ctx, arrivate(p, tw(T)), C.v, kq, 4));
    const kf = life(t, 63.0, 67.3, .6, .5);
    FORTI.forEach(p => spezzata(ctx, arrivate(p, tw(T)), C.g, kf, 4));
    // P e Q, con i loro cammini
    const kP = life(t, 35.1, 72.0, .4, .5), kQ = life(t, 49.1, 72.0, .4, .5);
    const kcP = life(t, 43.9, 48.9, .4, .4), kcQ = life(t, 57.7, 62.7, .4, .4);
    if (kcP > 0) {
      dashed(ctx, S1, PP, C.ink, 1, kcP); dashed(ctx, S2, PP, C.ink, 1, kcP);
      chip(ctx, '4 {mink:λ}', S1[0] - 60, (S1[1] + PP[1]) / 2, kcP, 32); chip(ctx, '5 {mink:λ}', (S2[0] + PP[0]) / 2 + 56, (S2[1] + PP[1]) / 2, kcP, 32);
    }
    if (kcQ > 0) {
      dashed(ctx, S1, QQ, C.ink, 1, kcQ); dashed(ctx, S2, QQ, C.ink, 1, kcQ);
      chip(ctx, '4,5 {mink:λ}', (S1[0] + QQ[0]) / 2 - 70, (S1[1] + QQ[1]) / 2, kcQ, 32); chip(ctx, '4 {mink:λ}', S2[0] + 60, (S2[1] + QQ[1]) / 2, kcQ, 32);
    }
    if (kP > 0) { dot(ctx, PP, C.g, kP, 11); chip(ctx, '{g:P}', PP[0] - 62, PP[1] + 36, kP * (1 - Math.max(kq, kf)), 36); }
    if (kQ > 0) { dot(ctx, QQ, C.v, kQ, 11); chip(ctx, '{v:Q}', QQ[0] + 60, QQ[1] + 36, kQ * (1 - Math.max(kq, kf)), 36); }
    // legenda e scritte
    ctx.save(); ctx.globalAlpha *= .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(158, 128, 300, 96, 12); ctx.fill(); ctx.restore();
    txt(ctx, 'visto dall’alto', 178, 154, { size: 30, color: C.dim, align: 'left' });
    ctx.save(); ctx.fillStyle = css(C.x); ctx.fillRect(178, 184, 22, 22); ctx.fillStyle = css(C.y); ctx.fillRect(318, 184, 22, 22); ctx.restore();
    txt(ctx, 'cresta', 210, 196, { size: 30, align: 'left' }); txt(ctx, 'gola', 350, 196, { size: 30, align: 'left' });
    const kt = Math.max(t > FERMO1[0] + .05 && t < FERMO1[1] - .05 ? 1 : 0);
    const k2 = life(T, FERMO2[0], FERMO2[1], .2, .2);
    chip(ctx, '{dim:fermo immagine}', 1030, 150, Math.max(kt, k2), 30);
    chip(ctx, '{dim:al rallentatore}', 1030, 150, life(t, 26.0, 72.0, .4, .4) * (1 - k2), 30);
    // λ, misurata sulla riga delle punte a destra di S₂: lì le due onde vanno a passo (r₁ = r₂ + 3 λ), creste ogni λ
    if (k2 > 0) {
      const tb = tw(T) - T2;
      let r = LAM * ((.25 + tb) % 1); while (S2[0] + r < 965) r += LAM;   // creste: k·r₂ − ω·t = π/2 + 2π·m
      const xa = S2[0] + r, xb = xa + LAM;
      ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(xa, 270); ctx.lineTo(xb, 270); ctx.moveTo(xa, 252); ctx.lineTo(xa, 288); ctx.moveTo(xb, 252); ctx.lineTo(xb, 288); ctx.stroke(); ctx.restore();
      for (const x of [xa, xb]) dashed(ctx, [x, 236], [x, 252], C.v, 1, k2);
      chip(ctx, '{mink:λ}', (xa + xb) / 2, 314, k2, 36);
    }
    ctx.restore();
  }

  // ---------- la scheda di destra ----------
  const GX0 = 1262, GX1 = 1778;
  function tracciato(ctx, pts, col, w, trat) {
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; if (trat) ctx.setLineDash(trat);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  }
  // 1 · la sezione lungo la riga dei sassi: le due creste si sommano e poi passano
  function sezione(ctx, t, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => drawRich(ctx, 'lungo la riga tratteggiata', 1520, 168, { size: 34, weight: 600 }));
    const Y0 = 520, U = 80;
    const kd = t > FERMO1[0] - .1 && t < FERMO1[1] + .3 ? life(t, FERMO1[0] - .1, FERMO1[1] + .3, .3, .4) : 0;
    ctx.save(); ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.moveTo(GX0, Y0 - U); ctx.lineTo(GX1, Y0 - U); ctx.stroke();
    ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.g); ctx.beginPath(); ctx.moveTo(GX0, Y0 - 2 * U); ctx.lineTo(GX1, Y0 - 2 * U); ctx.stroke();
    ctx.restore();
    txt(ctx, 'una cresta', GX1, Y0 - U - 32, { size: 30, color: C.dim, align: 'right' });
    drawRich(ctx, '{g:due creste}', GX1, Y0 - 2 * U - 32, { size: 30, align: 'right', alpha: kd });
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX0, Y0); ctx.lineTo(GX1, Y0); ctx.stroke();
    const pts = [];
    for (let px = GX0; px <= GX1; px += 3) pts.push([px, Y0 - U * altezza(CS[0] + (px - GX0) / (GX1 - GX0) * CS[2], S1[1], t)]);
    tracciato(ctx, pts, C.x, 5);
    txt(ctx, 'altezza dell’acqua', 1520, 590, { size: 30, color: C.dim });
    ctx.restore();
  }
  // 2 · quello che fa l'acqua in un punto: le due onde (tratteggiate) e la loro somma, negli ultimi 3 s
  function grafico(ctx, T, yc, nome, r1, r2, col, al, uguali = false) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => drawRich(ctx, 'nel punto ' + nome, 1520, yc - 162, { size: 36, weight: 600 }));
    const AG = 36, tb = tw(T) - T2, N = 150;
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX0, yc); ctx.lineTo(GX1, yc); ctx.stroke();
    const a = [], b = [], s = [];
    for (let i = 0; i <= N; i++) {
      const x = lerp(GX0, GX1, i / N), tt = tb - 3 + 3 * i / N, h1 = onda2(r1, tt), h2 = onda2(r2, tt);
      a.push([x, yc - AG * h1]); b.push([x, yc - AG * h2]); s.push([x, yc - AG * (h1 + h2)]);
    }
    tracciato(ctx, a, C.dim, 3, [9, 7]); tracciato(ctx, b, C.dim, 3, [3, 7]);
    tracciato(ctx, s, col, 6);
    dot(ctx, s[N], col, 1, 9);
    drawRich(ctx, uguali ? '{dim:tratteggio: due onde uguali}' : '{dim:tratteggio: le due onde}', GX0, yc + 100, { size: 30, align: 'left' });
    drawRich(ctx, (col === C.g ? '{g:' : '{v:') + 'la somma}', GX0, yc - 114, { size: 30, align: 'left' });
    txt(ctx, 'tempo →', GX1, yc - 114, { size: 30, color: C.dim, align: 'right' });
    ctx.restore();
  }
  function scenaScheda(ctx, t, T) {
    if (t < 8.2 || t > 72.8) return;
    const al = P(t, 8.2, 8.8) * (1 - P(t, 72.0, 72.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 1220, 110, 600, 690, Math.max(1 - P(t, 25.0, 25.6), P(t, 34.6, 35.2)));   // vuota fra le due parti: sparisce
    sezione(ctx, t, life(t, 9.0, 25.4, .5, .5));
    grafico(ctx, T, 330, '{g:P}', 4 * LAM, 5 * LAM, C.g, life(t, 35.1, 72.0, .5, .5), true);
    grafico(ctx, T, 650, '{v:Q}', 4.5 * LAM, 4 * LAM, C.v, life(t, 49.1, 72.0, .5, .5));
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Due sassi nello stagno', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 72.3) return;
    const al = 1 - P(t, 81.0, 82.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 72.6 });
      drawRich(ctx, 'Le onde si sommano: cresta con cresta\nsi rinforzano, cresta con gola si annullano.', W / 2, 290, { size: 62, weight: 600, local: t - 73.0, stagger: .08 });
    });
    const pills = [[490, 'differenza {mink:n·λ}:\n{g:costruttiva}'], [960, 'differenza {mink:(n + ½)·λ}:\n{v:distruttiva}'], [1430, 'poi ogni onda\nprosegue intatta']];
    pills.forEach(([x, s], i) => {
      const a = 74.0 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.5], ['pop', 8.6, .4], ['traccia', 9.0, 9.5],                         // lo stagno, i due sassi, la riga
    ['tono', 8.8, 10.0, [.4, .5]],                                                    // partono le creste
    ['tono', 11.4, 12.18, [.5, .7, 1]], ['ding', 12.2],                               // si incontrano: il doppio
    ['tono', 16.6, 17.35, [1, .7, .5]],                                               // poi ognuna prosegue
    ['soffio', 25.2], ['pop', 25.9, .5],                                              // le due punte
    ['tono', 26.0, 27.2, [.5, .8, .5, .2, .5]],                                       // battono l'acqua
    ['traccia', 34.9, 35.1], ['pop', 35.0, .55],                                      // fermo immagine: la lambda
    ['traccia', 39.8, 40.4],                                                          // le linee di quiete
    ['soffio', 43.7], ['pop', 44.1, .5],                                              // il punto P e il suo grafico
    ['tono', 44.3, 45.5, [.5, 1, .5, 0, .5]],                                         // oscilla il doppio
    ['traccia', 52.9, 53.3],                                                          // i cammini fino a P
    ['pop', 58.1, .45], ['ding', 62.4],                                               // il punto Q: resta fermo
    ['traccia', 66.7, 67.1],                                                          // i cammini fino a Q
    ['traccia', 72.0, 72.6], ['traccia', 76.6, 77.2],                                 // linee forti, linee di quiete
    ['soffio', 81.3], ['pop', 83.0, .5], ['pop', 83.5, .6], ['pop', 84.0, .7],        // in una frase
  ];
  return {
    titolo: 'Due sassi nello stagno', durata: 92, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 25.4, 'le onde si sommano'], [25.4, 71.6, 'due punte che battono'], [71.6, 81.0, 'costruttiva e distruttiva']],
    scena(ctx, t) { const u = vecchio(t); scenaTitolo(ctx, u); scenaStagno(ctx, u, t); scenaScheda(ctx, u, t); scenaFine(ctx, u); },
  };
});

