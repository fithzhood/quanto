'use strict';
/* Gli occhiali polarizzati — la luce è un'onda trasversale: il campo elettrico oscilla di traverso rispetto a dove va.
   La luce naturale cambia direzione di continuo (non polarizzata); un polarizzatore lascia passare solo la parte lungo
   il suo asse (della luce naturale, in media, la metà). Il suono, longitudinale, non si polarizza (la legge di Malus
   sta in luce/malus). La luce riflessa dall'acqua oscilla soprattutto in orizzontale:
   le lenti con l'asse verticale ne lasciano passare poca.
   Moto vero: lungo il banco il campo è A·sin(k·x − ω·t), con una direzione che per la luce naturale cambia a caso a
   ogni lunghezza d'onda (i cambi cadono dove il campo è zero); dopo un filtro di asse α resta la componente
   E·cos(φ − α) lungo α, a partire dal momento in cui la luce l'ha attraversato. Disegno in prospettiva: la direzione
   orizzontale di traverso va in diagonale. Al rallentatore. Argomento: luce. */
CVIDEO.registra('luce/polarizzazione', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, dashed, dot, arrowHead } = M;
  const DEG = Math.PI / 180;

  // ---------- il banco ----------
  const CB = [140, 110, 1660, 360], YB = 290;              // la scheda del banco, l'asse della luce
  const XL = 230, XE = 1780, XF1 = 850;                    // sorgente, fine, il filtro
  const PX = [470, 1010];                                  // i punti visti di fronte
  const LAM = 200, V = 200, K = 2 * Math.PI / LAM, A = 90; // λ = 200 px, periodo 1 s
  const T0 = 8.0, TSW = 22.0, TF1 = 31.0;                  // l'onda parte, diventa naturale, il filtro entra
  const DX = .5, DY = -.33;                                // prospettiva: la direzione di traverso orizzontale
  const pr = (x, ev, ew, y0 = YB) => [x + DX * ew, y0 - ev + DY * ew];
  // a caso ma sempre uguale: la direzione della j-esima lunghezza d'onda della luce naturale
  const rnd = j => { const s = Math.sin(j * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const fi = j => rnd(j) * Math.PI;
  // il campo nel punto x del banco all'istante t: [verticale, orizzontale]
  function campo(x, t, nf = 1) {   // nf: 0 = senza il filtro
    const tau = t - T0, s = x - XL;
    if (tau <= 0 || s < 0 || s > V * tau) return [0, 0];
    const xi = s - V * tau, mag = A * Math.sin(K * xi);          // sin(k·s − ω·t)
    const nat = -xi / V >= TSW - T0;                              // partita dalla lampadina dopo TSW
    const f = nat ? fi(Math.floor(xi / LAM)) : 0;
    let ev = mag * Math.cos(f), ew = mag * Math.sin(f);
    if (nf >= 1 && x > XF1 && t - (x - XF1) / V >= TF1) ew = 0;             // 1° filtro: asse verticale
    return [ev, ew];
  }
  // la luce riflessa dall'acqua, in un punto: soprattutto orizzontale
  const VERT_RIFL = .2;   // con Fresnel a 47° viene ≈ 0,18
  function riflessa(t, dopoLente) {
    const xi = -V * t, mag = A * Math.sin(K * xi), f = fi(Math.floor(2 * xi / LAM) + 500);   // la direzione cambia a ogni mezza λ (dove il campo è zero)
    return [VERT_RIFL * mag * Math.cos(f), dopoLente ? 0 : mag * Math.sin(f)];
  }

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [72.4, 190], [73.7, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [72.4, 1050], [73.7, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [72.4, 2.2], [73.7, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [72.4, 2], [73.7, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [72.4, -1.5], [73.7, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.6, 'felice'], [17.1, 'neutro'],
    [21.6, 'sorpreso'], [26.2, 'neutro'], [44.8, 'felice'], [49.5, 'neutro'], [54.3, 'felice'], [59.3, 'neutro'],
    [68.3, 'festa'], [72.7, 'neutro'], [75.4, 'felice'], [79.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Perché gli occhiali polarizzati\ntagliano i riflessi sull’acqua?'],
    [7.9, 12.4, 'La luce è un’onda: oscilla questa\nfreccia, il {v:campo elettrico} {mink:E}.'],
    [12.6, 16.9, 'Oscilla di traverso rispetto a\ndove va: è un’onda {g:trasversale}.'],
    [17.1, 21.4, 'Di fronte la vediamo così:\nla freccia va su e giù.'],
    [21.6, 26.0, 'La luce di una lampadina cambia\ndirezione di continuo…'],
    [26.2, 30.6, '…in tutte le direzioni: è luce\n{v:naturale}, {v:non polarizzata}.'],
    [30.8, 35.2, 'Un {v:polarizzatore} è un filtro con\nuna direzione speciale, l’{v:asse}.'],
    [35.4, 39.8, 'Della freccia lascia passare\nsolo la parte {g:lungo l’asse}.'],
    [40.0, 44.6, 'Dopo il filtro la luce oscilla in\nuna direzione sola: è {g:polarizzata}.'],
    [44.8, 49.1, 'Della luce naturale passa in media\nla {g:metà}, qualunque sia l’asse.'],
    [49.5, 54.1, 'Il suono oscilla lungo la direzione\nin cui va: è {v:longitudinale}.'],
    [54.3, 59.1, 'Nessun polarizzatore lo spegne:\nla luce sì, perché è {g:trasversale}.'],
    [59.3, 63.7, 'La luce riflessa dall’acqua oscilla\nsoprattutto in {x:orizzontale}.'],
    [63.9, 68.1, 'Le lenti polarizzate hanno\nl’asse {g:verticale}…'],
    [68.3, 72.5, '…e del riflesso passa\nsolo una piccola parte.'],
    [75.4, 80.6, 'La luce oscilla di traverso: un filtro\nne fa passare una direzione sola.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al = 1, size = 32) {
    if (al <= 0) return;
    const w = M.richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, alpha: al });
  }
  function freccia(ctx, a, b, col, w = 5, al = 1, punta = true) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (al <= 0 || L < 1) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), k = punta && L > 18 ? (L - 10) / L : 1;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke();
    if (punta && L > 18) arrowHead(ctx, b, ang, col, .9);
    ctx.restore();
  }
  // un filtro visto in prospettiva: un cerchio di traverso, con le righe parallele al suo asse α
  function filtro(ctx, x, alfa, al, y0 = YB, R = 120) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) { const a = i / 64 * 2 * Math.PI, p = pr(x, R * Math.cos(a), R * Math.sin(a), y0); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    ctx.closePath(); ctx.fillStyle = css(C.dim, .16); ctx.fill(); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = css(C.dim, .75); ctx.lineWidth = 2;
    const uv = Math.cos(alfa), uw = Math.sin(alfa);
    for (let s = -.8; s <= .81; s += .2) {
      const h = Math.sqrt(1 - s * s) * R, cv = -uw * s * R, cw = uv * s * R;   // la corda a distanza s·R dal centro
      const p = pr(x, cv - uv * h, cw - uw * h, y0), q = pr(x, cv + uv * h, cw + uw * h, y0);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    }
    ctx.restore();
  }
  // un disco «visto di fronte»: la freccia del campo adesso, e la sua scia negli ultimi 2,4 s
  // get(t) → [verticale, orizzontale]; asse: l'asse del filtro (o null); prima: il campo prima del filtro (o null)
  function disco(ctx, cx, cy, R, t, get, o = {}) {
    const al = (o.al != null ? o.al : 1); if (al <= 0) return;
    const sc = R * .9 / A, sp = e => [cx + sc * e[1], cy - sc * e[0]];
    ctx.save(); ctx.globalAlpha *= al;
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(C.dim, .25); ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    if (o.ellisse) {   // dove arriva la punta: tutta la larghezza in orizzontale, solo una parte in verticale
      ctx.save(); ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
      ctx.beginPath(); ctx.ellipse(cx, cy, R * .9, R * .9 * o.ellisse, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    }
    if (o.asse != null) {
      const ka = (o.kAsse != null ? o.kAsse : 1), ux = Math.sin(o.asse), uy = -Math.cos(o.asse);
      ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(cx - ux * R, cy - uy * R); ctx.lineTo(cx + ux * R, cy + uy * R); ctx.stroke(); ctx.restore();
    }
    const N = 72;
    for (let i = 1; i <= N; i++) {
      const a = sp(get(t - 2.4 * (1 - (i - 1) / N))), b = sp(get(t - 2.4 * (1 - i / N)));
      ctx.strokeStyle = css(C.v, .05 + .3 * i / N); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    if (o.prima) {
      const e0 = sp(o.prima(t)), e1 = sp(get(t));
      ctx.save(); ctx.globalAlpha *= (o.kPrima != null ? o.kPrima : 1);
      ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(e0[0], e0[1]); ctx.stroke();
      ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.moveTo(e0[0], e0[1]); ctx.lineTo(e1[0], e1[1]); ctx.stroke();
      ctx.restore();
    }
    freccia(ctx, [cx, cy], sp(get(t)), C.v, 5);
    dot(ctx, [cx, cy], C.ink, 1, 5);
    ctx.restore();
  }
  function lampadina(ctx, x, y, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.y); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + 34 * Math.cos(a), y + 34 * Math.sin(a)); ctx.lineTo(x + 48 * Math.cos(a), y + 48 * Math.sin(a)); ctx.stroke(); }
    ctx.restore();
    dot(ctx, [x, y], C.y, al, 24);
  }

  // ---------- 1–3 · il banco: la luce, i filtri ----------
  function scenaBanco(ctx, t) {
    if (t < 7.5 || t > 59.6) return;
    ctx.save(); ctx.globalAlpha *= P(t, 7.5, 8.2) * (1 - P(t, 58.9, 59.5));
    card(ctx, ...CB);
    const kl = 1 - P(t, 49.3, 49.8);                        // la luce lascia il posto al suono
    if (kl > 0) {
      ctx.save(); ctx.globalAlpha *= kl;
      ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XL, YB); ctx.lineTo(XE, YB); ctx.stroke();
      lampadina(ctx, XL - 40, YB, P(t, 21.6, 22.1));
      // le frecce del campo lungo il banco, e la linea che ne unisce le punte (spezzata a ogni filtro)
      const tagli = [XL, ...(t > TF1 - .2 ? [XF1] : []), XE], tratti = tagli.slice(1).map((b, i) => [tagli[i], b]);
      for (const [a, b] of tratti) {
        const punte = [];
        for (let x = a + 3; x < b - 2; x += 5) {
          const e = campo(x, t), p = pr(x, e[0], e[1]);
          punte.push(p);
          if ((x - a) % 10 < 5 && Math.hypot(e[0], e[1]) > 1) { ctx.strokeStyle = css(C.v, .45); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, YB); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
        }
        ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); punte.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      }
      filtro(ctx, XF1, 0, P(t, TF1 - .2, TF1 + .3));
      chip(ctx, 'polarizzatore', XF1, 445, P(t, TF1 - .2, TF1 + .3), 30);
      { const ke = life(t, 8.3, 17.0, .4, .4), e = campo(330, t); freccia(ctx, [330, YB], pr(330, e[0], e[1]), C.v, 7, ke); chip(ctx, '{v:campo elettrico} {mink:E}', 400, 150, ke, 32); }
      txt(ctx, 'direzione della luce →', 1200, 445, { size: 30, color: C.dim, alpha: life(t, 12.6, 49.3, .5, .4) });
      chip(ctx, '{dim:al rallentatore}', 1640, 145, life(t, 8.2, 49.3, .5, .4), 30);
      // i punti visti di fronte, con il filo che li lega alla loro scheda
      [[17.1, PX[0]], [30.8, PX[1]]].forEach(([ta, x]) => {
        const k = P(t, ta, ta + .5); if (k <= 0) return;
        dashed(ctx, [x, 420], [x, 500], C.dim, 1, k); dot(ctx, [x, YB], C.ink, k, 7);
      });
      ctx.restore();
    }
    // il suono: molecole che vanno avanti e indietro lungo la direzione dell'onda; il filtro gira, e non cambia niente
    const ks = life(t, 49.6, 59.4, .6, .5);
    if (ks > 0) {
      ctx.save(); ctx.globalAlpha *= ks;
      const KS = 2 * Math.PI / 240, OS = KS * 240, ts = t - 49.6;
      ctx.fillStyle = css(C.x);
      for (let r = -3; r <= 3; r++) for (let x0 = 240; x0 <= 1760; x0 += 16) {
        const x = x0 + 11 * Math.sin(KS * x0 - OS * ts);   // spostamento lungo la direzione dell'onda
        ctx.beginPath(); ctx.arc(x, YB + 28 * r, 4.5, 0, 2 * Math.PI); ctx.fill();
      }
      filtro(ctx, 1000, Math.max(0, t - 54.3) * 40 * DEG, P(t, 54.3, 54.8));   // entra col fumetto che lo nomina
      chip(ctx, '{x:suono}', 260, 150, 1, 34);
      chip(ctx, '{dim:le molecole vanno avanti e indietro, lungo la direzione dell’onda}', 960, 445, 1, 30);
      ctx.restore();
    }
    ctx.restore();
  }

  // le due schede «di fronte»
  const D1 = [140, 500, 500, 290], D2 = [680, 500, 500, 290], DY0 = 650, RD = 100;
  function scenaDischi(ctx, t) {
    if (t < 17.0 || t > 49.9) return;
    const fine = 1 - P(t, 49.3, 49.8);
    ctx.save(); ctx.globalAlpha *= fine;
    // 1 · prima del filtro
    const k1 = P(t, 17.1, 17.6);
    if (k1 > 0) {
      card(ctx, ...D1, k1);
      ctx.save(); ctx.globalAlpha *= k1;
      const kt = P(t, 30.8, 31.3);
      txt(ctx, 'vista di fronte', 160, 532, { size: 30, color: C.dim, align: 'left', alpha: 1 - kt });
      txt(ctx, 'prima del filtro', 160, 532, { size: 30, color: C.dim, align: 'left', alpha: kt });
      disco(ctx, PX[0], DY0, RD, t, tt => campo(PX[0], tt));
      const ki = P(t, 44.8, 45.3);
      txt(ctx, 'intensità', 160, 612, { size: 30, color: C.dim, align: 'left', alpha: ki });
      txt(ctx, '(quanta luce)', 160, 648, { size: 30, color: C.dim, align: 'left', alpha: ki });
      txt(ctx, '100%', 160, 712, { size: 48, weight: 600, align: 'left', alpha: ki });
      ctx.restore();
    }
    // 2 · dopo il 1° filtro
    const k2 = P(t, 30.8, 31.3);
    if (k2 > 0) {
      card(ctx, ...D2, k2);
      ctx.save(); ctx.globalAlpha *= k2;
      txt(ctx, 'dopo il filtro', 700, 532, { size: 30, color: C.dim, align: 'left' });
      disco(ctx, PX[1], DY0, RD, t, tt => campo(PX[1], tt), { asse: 0, prima: tt => campo(PX[1], tt, 0), kPrima: P(t, 35.4, 35.9) });
      drawRich(ctx, '{g:asse}', PX[1] + 62, DY0 - RD - 4, { size: 30 });
      const ki = P(t, 44.8, 45.3);
      txt(ctx, 'intensità', 700, 612, { size: 30, color: C.dim, align: 'left', alpha: ki });
      txt(ctx, '50%', 700, 672, { size: 48, weight: 600, color: C.g, align: 'left', alpha: ki });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- 4 · il riflesso sull'acqua ----------
  const CG = [140, 110, 1000, 690], YACQ = 600, SOLE = [300, 300], RR = [620, YACQ];
  const LENTE = [892, 345], OCCHIO = [962, 279];           // sulla retta del raggio riflesso (simmetrico a quello del Sole)
  const R1 = [1180, 110, 620, 330], R2 = [1180, 470, 620, 330];
  function scenaRiflesso(ctx, t) {
    if (t < 59.0 || t > 73.0) return;
    ctx.save(); ctx.globalAlpha *= P(t, 59.2, 59.8) * (1 - P(t, 72.3, 72.9));
    card(ctx, ...CG);
    // l'acqua
    ctx.save(); ctx.beginPath(); ctx.roundRect(CG[0] + 2, CG[1] + 2, CG[2] - 4, CG[3] - 4, 20); ctx.clip();
    ctx.fillStyle = css(C.x, .18); ctx.fillRect(CG[0], YACQ, CG[2], CG[1] + CG[3] - YACQ);
    ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 3; ctx.beginPath();
    for (let x = CG[0]; x <= CG[0] + CG[2]; x += 6) { const y = YACQ + 4 * Math.sin(x / 28 + t * 1.5); x === CG[0] ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke(); ctx.restore();
    txt(ctx, 'acqua', 300, 720, { size: 32, color: C.x });
    // il Sole e i raggi
    dot(ctx, SOLE, C.y, 1, 40);
    const raggio = (a, b, al) => { ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); };
    raggio([lerp(SOLE[0], RR[0], .1), lerp(SOLE[1], RR[1], .1)], RR, 1);
    const kl = P(t, 63.9, 64.5);                            // la lente
    raggio(RR, LENTE, 1);
    raggio(LENTE, OCCHIO, 1 - .8 * P(t, 68.3, 69.3));      // dopo la lente passa poca luce
    arrowHead(ctx, [lerp(SOLE[0], RR[0], .55), lerp(SOLE[1], RR[1], .55)], Math.atan2(RR[1] - SOLE[1], RR[0] - SOLE[0]), C.y, 1.2);
    arrowHead(ctx, [lerp(RR[0], LENTE[0], .55), lerp(RR[1], LENTE[1], .55)], Math.atan2(LENTE[1] - RR[1], LENTE[0] - RR[0]), C.y, 1.2);
    ctx.save(); ctx.globalAlpha *= .5 + .5 * (1 - P(t, 68.3, 69.3));
    const g = ctx.createRadialGradient(RR[0], RR[1], 2, RR[0], RR[1], 60); g.addColorStop(0, css(C.y, .9)); g.addColorStop(1, css(C.y, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(RR[0], RR[1], 70, 22, 0, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
    chip(ctx, '{y:riflesso}', RR[0], YACQ + 62, 1, 32);
    // l'occhio
    ctx.save(); ctx.translate(OCCHIO[0], OCCHIO[1]); ctx.rotate(Math.atan2(OCCHIO[1] - LENTE[1], OCCHIO[0] - LENTE[0]) + Math.PI / 2);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.quadraticCurveTo(0, 30, 34, 0); ctx.quadraticCurveTo(0, -30, -34, 0); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(0, 9, 10, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
    // la lente, con l'asse verticale
    if (kl > 0) {
      ctx.save(); ctx.globalAlpha *= kl;
      ctx.beginPath(); ctx.ellipse(LENTE[0], LENTE[1], 30, 62, 0, 0, 2 * Math.PI); ctx.fillStyle = css(C.dim, .2); ctx.fill(); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.clip(); ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 2;
      for (let x = LENTE[0] - 24; x <= LENTE[0] + 24; x += 12) { ctx.beginPath(); ctx.moveTo(x, LENTE[1] - 62); ctx.lineTo(x, LENTE[1] + 62); ctx.stroke(); }
      ctx.restore(); ctx.restore();
      chip(ctx, '{g:lente}', LENTE[0] - 6, LENTE[1] + 96, kl, 30);
    }
    chip(ctx, '{dim:al rallentatore}', 1000, 145, 1, 30);
    // la luce riflessa e quella dopo la lente, viste di fronte
    card(ctx, ...R1);
    txt(ctx, 'luce riflessa', 1200, 145, { size: 30, color: C.dim, align: 'left' });
    disco(ctx, 1640, 275, RD, t, tt => riflessa(tt, false), { ellisse: VERT_RIFL });
    txt(ctx, 'oscilla soprattutto', 1200, 255, { size: 30, align: 'left' });
    drawRich(ctx, 'in {x:orizzontale}', 1200, 295, { size: 30, align: 'left' });
    const k2 = P(t, 63.9, 64.4);
    if (k2 > 0) {
      card(ctx, ...R2, k2);
      ctx.save(); ctx.globalAlpha *= k2;
      txt(ctx, 'dopo la lente', 1200, 505, { size: 30, color: C.dim, align: 'left' });
      disco(ctx, 1640, 635, RD, t, tt => riflessa(tt, true), { asse: 0, prima: tt => riflessa(tt, false), kPrima: P(t, 64.4, 64.9) });
      drawRich(ctx, 'asse {g:verticale}', 1200, 615, { size: 30, align: 'left' });
      drawRich(ctx, 'passa {g:poca} luce', 1200, 660, { size: 30, align: 'left', alpha: P(t, 68.5, 69.0) });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Gli occhiali polarizzati', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 72.4) return;
    const al = 1 - P(t, 81.0, 82.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 72.8 });
      drawRich(ctx, 'Un polarizzatore lascia passare solo\nla parte della luce lungo il suo asse.', W / 2, 290, { size: 64, weight: 600, local: t - 73.2, stagger: .08 });
    });
    const pills = [[490, 'luce naturale:\nne passa la {g:metà}'], [960, 'il suono non si polarizza:\nla luce è {g:trasversale}'], [1430, 'riflessi orizzontali,\nlenti ad asse {g:verticale}']];
    pills.forEach(([x, s], i) => {
      const a = 74.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): le onde hanno un tono breve che va su e giù; il filtro del suono che
  // gira sale con l'angolo; dopo la lente il tono segue la luce che passa
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 8.0, 9.2, [.5, .8, .2, .8, .2, .5]],                    // il banco, l'onda parte
    ['pop', 8.4, .5],                                                                 // il campo elettrico
    ['soffio', 17.1], ['pop', 17.2, .4],                                              // la vista di fronte
    ['pop', 21.7, .45],                                                               // la lampadina: luce naturale
    ['soffio', 30.8], ['pop', 30.9, .5],                                              // il polarizzatore
    ['pop', 35.5, .4],                                                                // la parte lungo l'asse
    ['pop', 44.9, .45], ['ding', 45.2],                                               // 100% → 50%
    ['soffio', 49.4], ['tono', 49.6, 50.8, [.4, .6, .4, .6, .4, .6]],                 // il suono: avanti e indietro
    ['pop', 54.4, .5], ['tono', 54.4, 55.4, [.3, .4, .5, .6, .7, .8]],                // il filtro gira, e non cambia niente
    ['soffio', 59.2],                                                                 // il riflesso sull'acqua
    ['pop', 64.0, .5], ['pop', 64.5, .4],                                             // la lente, dopo la lente
    ['tono', 68.3, 69.3, [1, .97, .8, .4, .23, .2]], ['pop', 68.6, .35],              // passa poca luce
    ['soffio', 72.6], ['pop', 74.2, .5], ['pop', 74.7, .6], ['pop', 75.2, .7],        // in una frase
  ];
  return {
    titolo: 'Gli occhiali polarizzati', durata: 83, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.6, 'un’onda trasversale'], [30.6, 49.3, 'il polarizzatore'], [49.3, 59.1, 'e il suono?'], [59.1, 72.5, 'i riflessi']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBanco(ctx, t); scenaDischi(ctx, t); scenaRiflesso(ctx, t); scenaFine(ctx, t); },
  };
});
