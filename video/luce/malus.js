'use strict';
/* Il terzo filtro — la legge di Malus e il paradosso dei tre filtri. La luce di una lampadina attraversa un primo
   polarizzatore (asse verticale, intensità I₀) e poi un secondo, con l'asse ruotato di θ: passa E·cos θ, cioè
   I = I₀·cos²θ (0° 1, 30° 0,75, 45° 0,50, 60° 0,25, 90° 0: filtri incrociati, buio). Poi un terzo filtro a 45° in mezzo
   ai due incrociati: ne passa I₀·cos²45°·cos²45° = ¼ I₀, cioè ⅛ della luce naturale (ricontrollato con node).
   Moto vero: lungo il banco il campo è A·sin(k·x − ω·t), con una direzione che nella luce naturale cambia a caso a ogni
   lunghezza d'onda (dove il campo è zero); ogni filtro di asse α lascia la componente lungo α, dal momento in cui la
   luce l'ha attraversato (anche mentre il filtro gira). Disegno in prospettiva. Al rallentatore. Argomento: luce. */
CVIDEO.registra('luce/malus', M => {
  const { W, C, E, P, life, kf, lerp, clamp, css, mix, shade, TITOLI, conFont, drawRich, txt, card, dashed, dot, arrowHead } = M;
  const DEG = Math.PI / 180;

  // ---------- il banco ----------
  const CB = [140, 110, 1660, 360], YB = 290;
  const XL = 230, XE = 1715, XF1 = 520, XM = 960, XF2 = 1400;   // lampadina, fine, i tre filtri
  const P1 = 600, PM = 1060, P2 = 1460;                         // i punti visti di fronte
  const LAM = 200, V = 200, K = 2 * Math.PI / LAM, A = 90;      // λ = 200 px, periodo 1 s
  const T0 = 7.6, TF2 = 22.0, TM = 59.0;                        // l'onda parte; entrano il 2° filtro e quello in mezzo
  const DX = .5, DY = -.33;
  const pr = (x, ev, ew, y0 = YB) => [x + DX * ew, y0 - ev + DY * ew];
  const rnd = j => { const s = Math.sin(j * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const fi = j => rnd(j) * Math.PI;
  // l'angolo fra gli assi: il 2° filtro gira nelle pause fra un fumetto e l'altro
  const theta = t => kf(t, [[27.1, 0], [28.0, 30], [42.0, 30], [42.9, 45], [47.4, 45], [48.3, 60], [52.8, 60], [53.7, 90]]) * DEG;
  const FILTRI = [
    { id: 'F1', x: XF1, t0: -1, asse: () => 0 },
    { id: 'FM', x: XM, t0: TM, asse: () => 45 * DEG },
    { id: 'F2', x: XF2, t0: TF2, asse: theta },
  ];
  // il campo nel punto x all'istante t: [verticale, orizzontale]; salta: un filtro da non contare
  function campo(x, t, salta) {
    const tau = t - T0, s = x - XL;
    if (tau <= 0 || s < 0 || s > V * tau) return [0, 0];
    const xi = s - V * tau, mag = A * Math.sin(K * xi), f = fi(Math.floor(xi / LAM));
    let ev = mag * Math.cos(f), ew = mag * Math.sin(f);
    for (const F of FILTRI) {
      if (F.id === salta || x <= F.x) continue;
      const tf = t - (x - F.x) / V;                              // quando questa luce ha attraversato il filtro
      if (tf < F.t0) continue;
      const a = F.asse(tf), c = ev * Math.cos(a) + ew * Math.sin(a);
      ev = c * Math.cos(a); ew = c * Math.sin(a);
    }
    return [ev, ew];
  }

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [82.0, 190], [83.3, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [82.0, 1050], [83.3, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [82.0, 2.2], [83.3, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [82.0, 2], [83.3, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [82.0, -1.5], [83.3, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [28.4, 'pensa'], [33.1, 'neutro'],
    [37.9, 'felice'], [43.3, 'neutro'], [54.1, 'sorpreso'], [58.7, 'pensa'], [63.3, 'sorpreso'], [67.9, 'neutro'],
    [72.9, 'felice'], [77.6, 'neutro'], [85.0, 'felice'], [89.0, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Due filtri incrociati: buio.\nE con un terzo filtro?'],
    [7.9, 12.4, 'Luce {v:naturale}: il {v:campo elettrico} {mink:E}\noscilla di traverso, a caso.'],
    [12.6, 17.1, 'Un {v:polarizzatore} lascia passare\nla parte di {mink:E} lungo l’{v:asse}.'],
    [17.3, 21.8, 'Ne passa metà, solo in verticale:\nla sua intensità è {mink:I₀}.'],
    [22.0, 27.0, 'Un secondo filtro: fra i due assi\nc’è un angolo {mink:θ}, ora 0°.'],
    [28.4, 32.9, 'A 30°: della freccia passa solo\nla parte lungo l’asse, {mink:E·cos θ}.'],
    [33.1, 37.7, 'L’intensità va col quadrato di {mink:E}:\n{v:legge di Malus}, {mink:I = I₀·cos²θ}.'],
    [37.9, 41.9, 'A 30°: {mink:cos²θ} = 0,75,\npassano tre quarti.'],
    [43.3, 47.3, 'A 45° passa la {g:metà}:\n{mink:cos²}45° = 0,50.'],
    [48.7, 52.7, 'A 60° solo un {g:quarto}:\n{mink:cos²}60° = 0,25.'],
    [54.1, 58.5, 'A 90° i filtri sono {v:incrociati}:\nnon passa niente, {v:buio}.'],
    [58.7, 63.1, 'Ora infilo un terzo filtro in mezzo,\ncon l’asse a 45°.'],
    [63.3, 67.7, 'Il buio sparisce: dopo l’ultimo\nfiltro torna un po’ di luce!'],
    [67.9, 72.7, 'Ogni filtro, ruotato di 45° sul\nprecedente, ne lascia metà: 1/4 di {mink:I₀}.'],
    [72.9, 77.4, 'E {mink:I₀} era già metà della luce\nnaturale: ne arriva 1/8.'],
    [77.6, 82.1, 'Il filtro in mezzo non crea luce:\nla fa oscillare {g:di sbieco}.'],
    [85.0, 90.2, 'Fra due filtri passa {mink:I₀·cos²θ}:\nconta solo l’angolo fra gli assi.'],
  ];

  // ---------- aiutanti ----------
  function chip(ctx, s, x, y, al = 1, size = 32) {
    if (al <= 0) return;
    const w = M.richW(ctx, s, size) + 22;
    ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, s, x, y, { size, alpha: al });
  }
  function freccia(ctx, a, b, col, w = 5, al = 1) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (al <= 0 || L < 1) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), k = L > 18 ? (L - 10) / L : 1;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke();
    if (L > 18) arrowHead(ctx, b, ang, col, .9);
    ctx.restore();
  }
  // un filtro visto in prospettiva, con le righe parallele al suo asse α
  function filtro(ctx, x, alfa, al, R = 120) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) { const a = i / 64 * 2 * Math.PI, p = pr(x, R * Math.cos(a), R * Math.sin(a)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    ctx.closePath(); ctx.fillStyle = css(C.dim, .16); ctx.fill(); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = css(C.dim, .75); ctx.lineWidth = 2;
    const uv = Math.cos(alfa), uw = Math.sin(alfa);
    for (let s = -.8; s <= .81; s += .2) {
      const h = Math.sqrt(1 - s * s) * R, cv = -uw * s * R, cw = uv * s * R;
      const p = pr(x, cv - uv * h, cw - uw * h), q = pr(x, cv + uv * h, cw + uw * h);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    }
    ctx.restore();
  }
  // un disco «visto di fronte»: la freccia adesso, la scia degli ultimi 2,4 s, l'asse del filtro, e (tratteggiata) la
  // freccia prima del filtro con la sua proiezione
  function disco(ctx, cx, cy, R, t, get, o = {}) {
    const sc = R * .9 / A, sp = e => [cx + sc * e[1], cy - sc * e[0]];
    ctx.save();
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = css(C.dim, .25); ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    if (o.asse != null) {
      const ux = Math.sin(o.asse), uy = -Math.cos(o.asse);
      ctx.save(); ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(cx - ux * R, cy - uy * R); ctx.lineTo(cx + ux * R, cy + uy * R); ctx.stroke(); ctx.restore();
    }
    const N = 72;
    for (let i = 1; i <= N; i++) {
      const a = sp(get(t - 2.4 * (1 - (i - 1) / N))), b = sp(get(t - 2.4 * (1 - i / N)));
      ctx.strokeStyle = css(C.v, .05 + .3 * i / N); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    if (o.prima && ((o.kPrima != null ? o.kPrima : 1)) > 0) {
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

  // ---------- il banco ----------
  // l'intensità che arriva allo schermo, in unità di I₀: cos²θ con due filtri, cos²45°·cos²(θ − 45°) con tre
  const XS = 1730;
  function lumSchermo(t) {
    const arrivo = clamp((t - T0 - (XS - XL) / V) / .5);   // prima che la luce ci arrivi è buio
    const t2 = t - (XS - XF2) / V;                          // quando la luce che arriva adesso ha passato il 2° filtro
    if (t2 < TF2) return arrivo;
    if (t - (XS - XM) / V >= TM) return arrivo * Math.cos(45 * DEG) ** 2 * Math.cos(theta(t2) - 45 * DEG) ** 2;
    return arrivo * Math.cos(theta(t2)) ** 2;
  }
  function scenaBanco(ctx, t) {
    if (t < 7.5 || t > 82.4) return;
    ctx.save(); ctx.globalAlpha *= P(t, 7.5, 8.2) * (1 - P(t, 81.7, 82.3));
    card(ctx, ...CB);
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XL, YB); ctx.lineTo(XE, YB); ctx.stroke();
    lampadina(ctx, XL - 40, YB, 1);
    // le frecce lungo il banco, e la linea delle punte (spezzata a ogni filtro presente)
    const tagli = [XL, XF1, ...(t > TM - .2 ? [XM] : []), ...(t > TF2 - .2 ? [XF2] : []), XE];
    for (let i = 1; i < tagli.length; i++) {
      const a = tagli[i - 1], b = tagli[i], punte = [];
      for (let x = a + 3; x < b - 2; x += 5) {
        const e = campo(x, t), p = pr(x, e[0], e[1]);
        punte.push(p);
        if ((x - a) % 10 < 5 && Math.hypot(e[0], e[1]) > 1) { ctx.strokeStyle = css(C.v, .45); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, YB); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
      }
      ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); punte.forEach((p, j) => j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    }
    filtro(ctx, XF1, 0, 1);
    filtro(ctx, XM, 45 * DEG, P(t, TM - .2, TM + .3));
    filtro(ctx, XF2, theta(t), P(t, TF2 - .2, TF2 + .3));
    chip(ctx, '1° filtro', XF1, 445, 1, 30);
    chip(ctx, 'filtro a 45°', XM, 445, P(t, TM - .2, TM + .3), 30);
    chip(ctx, '2° filtro', XF2 - 30, 445, P(t, TF2 - .2, TF2 + .3), 30);
    { const ke = life(t, 8.2, 12.6, .4, .4), e = campo(360, t); freccia(ctx, [360, YB], pr(360, e[0], e[1]), C.v, 7, ke); chip(ctx, '{v:campo elettrico} {mink:E}', 400, 150, ke, 32); }
    txt(ctx, 'direzione della luce →', 960, 445, { size: 30, color: C.dim, alpha: life(t, 8.4, 58.6, .5, .4) });
    chip(ctx, '{dim:al rallentatore}', 1560, 145, 1, 30);
    // lo schermo in fondo: si illumina in proporzione a I (1 → 0 coi filtri incrociati → 1/4 col filtro in mezzo)
    const I = lumSchermo(t);
    // lo schermo si colora in proporzione a I, e la parte accesa è alta in proporzione a I (si legge anche 1/4)
    ctx.save(); ctx.fillStyle = css(shade(C.y, -.85)); ctx.fillRect(XS, 170, 30, 240);
    ctx.fillStyle = css(mix(shade(C.y, -.4), shade(C.y, .35), I)); ctx.fillRect(XS, 410 - 240 * I, 30, 240 * I);
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(XS, 170, 30, 240); ctx.restore();
    drawRich(ctx, '{mink:I}', XS + 15, 145, { size: 40 });
    txt(ctx, 'schermo', XS + 10, 445, { size: 30, color: C.dim });
    [[12.6, P1], [22.0, P2], [59.0, PM]].forEach(([ta, x]) => {
      const k = P(t, ta, ta + .5); if (k <= 0) return;
      dashed(ctx, [x, 420], [x, 500], C.dim, 1, k); dot(ctx, [x, YB], C.ink, k, 7);
    });
    ctx.restore();
  }

  // ---------- le schede «di fronte» ----------
  const DY0 = 650, RD = 100, f2 = v => v.toFixed(2).replace('.', ',');
  const DT2 = (P2 - XF2) / V;                              // dal 2° filtro al punto visto di fronte: 0,3 s
  function scenaSchede(ctx, t) {
    if (t < 12.5 || t > 82.4) return;
    ctx.save(); ctx.globalAlpha *= 1 - P(t, 81.7, 82.3);
    // 1 · dopo il 1° filtro
    const k1 = P(t, 12.6, 13.1);
    card(ctx, 140, 500, 500, 290, k1);
    ctx.save(); ctx.globalAlpha *= k1;
    txt(ctx, 'dopo il 1° filtro', 160, 532, { size: 30, color: C.dim, align: 'left' });
    disco(ctx, 520, DY0, RD, t, tt => campo(P1, tt), { asse: 0, prima: tt => campo(P1, tt, 'F1'), kPrima: P(t, 13.0, 13.5) });
    drawRich(ctx, '{g:asse}', 582, DY0 - RD - 4, { size: 30 });
    const ki = P(t, 17.4, 17.9);
    txt(ctx, 'intensità', 160, 612, { size: 30, color: C.dim, align: 'left', alpha: ki });
    txt(ctx, '(quanta luce)', 160, 648, { size: 30, color: C.dim, align: 'left', alpha: ki });
    drawRich(ctx, '{mink:I₀}', 160, 712, { size: 52, align: 'left', alpha: ki });
    drawRich(ctx, '{dim:metà della naturale}', 160, 760, { size: 30, align: 'left', alpha: ki });
    ctx.restore();
    // 2 · dopo il filtro a 45° (dal 59 s)
    const km = P(t, TM, TM + .5);
    if (km > 0) {
      card(ctx, 680, 500, 500, 290, km);
      ctx.save(); ctx.globalAlpha *= km;
      txt(ctx, 'dopo il filtro a 45°', 700, 532, { size: 30, color: C.dim, align: 'left' });
      disco(ctx, 1060, DY0, RD, t, tt => campo(PM, tt), { asse: 45 * DEG, prima: tt => campo(PM, tt, 'FM'), kPrima: 1 });
      drawRich(ctx, '{mink:I} = {g:0,50}·{mink:I₀}', 700, 690, { size: 40, align: 'left', alpha: P(t, 68.0, 68.5) });
      ctx.restore();
    }
    // 3 · dopo il 2° filtro (dal 22 s)
    const k3 = P(t, TF2, TF2 + .5);
    if (k3 > 0) {
      card(ctx, 1220, 500, 580, 290, k3);
      ctx.save(); ctx.globalAlpha *= k3;
      txt(ctx, 'dopo il 2° filtro', 1240, 532, { size: 30, color: C.dim, align: 'left' });
      const kp = P(t, 28.4, 28.9);
      disco(ctx, 1690, DY0, RD, t, tt => campo(P2, tt), { asse: theta(t - DT2), prima: tt => campo(P2, tt, 'F2'), kPrima: kp });
      chip(ctx, '{mink:E}', 1660, DY0 - RD + 26, kp * (1 - P(t, 58.5, 59.0)), 30);
      // la legge di Malus, con i numeri dell'angolo di adesso
      const d = Math.round(theta(t) / DEG), c = Math.cos(d * DEG) ** 2, kmal = 1 - P(t, 58.6, 59.0), k3f = P(t, 58.9, 59.3);
      drawRich(ctx, '{mink:I = I₀·cos²θ}', 1240, 590, { size: 40, align: 'left', alpha: P(t, 33.2, 33.7) * kmal });
      drawRich(ctx, '{mink:θ} = ' + d + '°', 1240, 644, { size: 40, align: 'left', alpha: kmal });
      drawRich(ctx, '{mink:cos²θ} = ' + f2(c), 1240, 698, { size: 40, align: 'left', alpha: P(t, 33.2, 33.7) * kmal });
      drawRich(ctx, '{mink:I} = {g:' + f2(c) + '}·{mink:I₀}', 1240, 752, { size: 40, align: 'left', alpha: P(t, 33.2, 33.7) * kmal });
      // tre filtri
      drawRich(ctx, '{dim:tre filtri:}', 1240, 590, { size: 34, align: 'left', alpha: k3f });
      txt(ctx, '0° → 45° → 90°', 1240, 644, { size: 38, align: 'left', alpha: k3f });
      drawRich(ctx, '{mink:I} = {g:0,25}·{mink:I₀}', 1240, 698, { size: 40, align: 'left', alpha: P(t, 63.4, 63.9) });
      const k8 = P(t, 73.0, 73.5), w8 = M.richW(ctx, '= {g:1/8}', 44);
      drawRich(ctx, '= {g:1/8}', 1240, 752, { size: 44, align: 'left', alpha: k8 });
      drawRich(ctx, '{dim:della naturale}', 1252 + w8, 756, { size: 30, align: 'left', alpha: k8 });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il terzo filtro', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 82.0) return;
    const al = 1 - P(t, 91.5, 92.5);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 82.4 });
      drawRich(ctx, 'Fra due polarizzatori passa {mink:I₀·cos²θ}:\nconta solo l’angolo fra gli assi.', W / 2, 290, { size: 64, weight: 600, local: t - 82.8, stagger: .08 });
    });
    const pills = [[490, '0° tutto, 45° metà,\n90° {v:buio}'], [960, ['tre filtri 0°, 45°, 90°:', '{mink:I} = {g:1/4}·{mink:I₀}']], [1430, 'il filtro in mezzo\nfa oscillare {g:di sbieco}']];
    pills.forEach(([x, s], i) => {
      const a = 83.8 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      if (Array.isArray(s)) {   // una riga di testo e una di numeri, più grande
        drawRich(ctx, s[0], x, 486, { size: 33, weight: 400 });
        drawRich(ctx, s[1], x, 538, { size: 44 });
      } else drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): quando il 2° filtro gira, il tono segue cos²θ, da 0 (0) a 1 (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 7.6, 8.8, [.5, .8, .2, .8, .2, .5]],                    // il banco, l'onda parte
    ['pop', 8.3, .5],                                                                 // il campo elettrico
    ['soffio', 12.6], ['pop', 12.7, .4], ['pop', 13.1, .35],                          // dopo il 1° filtro, la freccia di prima
    ['pop', 15.1, .55],                                                               // la luce arriva allo schermo
    ['pop', 17.5, .5],                                                                // I₀
    ['soffio', 22.0], ['pop', 22.1, .45],                                             // il 2° filtro
    ['tono', 27.1, 28.0, [1, 1, .98, .86, .76, .75]], ['pop', 28.5, .4],              // a 30°, la proiezione
    ['pop', 33.3, .6], ['ding', 33.8],                                                // la legge di Malus
    ['tono', 42.0, 42.9, [.75, .74, .69, .57, .51, .5]],                              // a 45°
    ['tono', 47.4, 48.3, [.5, .49, .43, .31, .26, .25]],                              // a 60°
    ['tono', 52.8, 53.7, [.25, .24, .14, .02, 0, 0]],                                 // a 90°: buio
    ['soffio', 59.0], ['pop', 59.1, .5],                                              // il filtro a 45° in mezzo
    ['ding', 62.9],                                                                   // allo schermo torna luce
    ['pop', 63.5, .45], ['pop', 68.1, .5], ['ding', 73.2],                            // 0,25·I₀, 0,50·I₀, 1/8
    ['soffio', 82.2], ['pop', 83.8, .5], ['pop', 84.3, .6], ['pop', 84.8, .7],        // in una frase
  ];
  return {
    titolo: 'Il terzo filtro', durata: 92.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.8, 'il polarizzatore'], [21.8, 58.5, 'la legge di Malus'], [58.5, 82.1, 'tre filtri']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaBanco(ctx, t); scenaSchede(ctx, t); scenaFine(ctx, t); },
  };
});
