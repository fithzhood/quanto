'use strict';
/* Il motore elettrico — una spira rettangolare fra i poli di due calamite (campo B uniforme), vista lungo l'asse: sui due
   lati lunghi le forze F = I·L·B sono verticali e opposte (verso dato dal prodotto vettoriale di I·L e B: il lato con la corrente che esce dallo
   schermo è spinto in su, con B da sinistra a destra). Il momento è F·b, con il braccio b = distanza orizzontale dall'asse:
   in tutto M = k·cos θ (θ = angolo del lato «A» dall'orizzontale). La rotazione è integrata (J·θ'' = M − c·θ',
   J = 0,365, c = 0,2432 con k = 1: smorzamento 0,2, al rallentatore). Senza commutatore la spira supera la verticale per
   lo slancio, torna indietro, oscilla e si ferma in verticale. Con il commutatore la corrente si inverte quando la spira è
   verticale: M = k·|cos θ|, la spira accelera e poi gira a velocità quasi costante (un giro ogni 2,4 s circa).
   Colori fissi del magnetismo: polo nord pieno scuro (C.ink), polo sud chiaro col bordo, campo B C.g, forze C.y, corrente C.v. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/motore', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 87.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.7, 'felice'], [25.0, 'neutro'],
  [38.3, 'felice'], [42.9, 'pensa'], [48.1, 'sorpreso'], [52.7, 'neutro'], [57.5, 'felice'], [62.5, 'neutro'],
  [71.1, 'sorpreso'], [76.5, 'festa'], [79.0, 'felice'], [81.7, 'neutro'], [89.6, 'felice'], [93.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come fa la corrente\na far girare un motore?'],
  [7.9, 12.6, 'Fra i poli di due calamite il campo\nmagnetico {mg:B} è {g:uniforme}.'],
  [12.7, 17.6, 'Ci metto una spira rettangolare,\nlibera di girare attorno a un asse.'],
  [17.7, 22.6, 'La guardo lungo l’asse, di taglio:\nvedo solo i due lati lunghi.'],
  [22.7, 27.8, 'Accendo la corrente {mv:I}: il puntino\nesce dallo schermo, la crocetta entra.'],
  [27.9, 33.0, 'Il campo spinge ogni lato, lungo {mink:L},\ncon una forza {my:F} = {mv:I}·{mink:L}·{mg:B}.'],
  [33.1, 38.2, 'Ogni forza ha momento {my:F}·{mink:b}:\n{mink:b} è il braccio, segnato sotto.'],
  [38.3, 42.8, 'Lascio andare (al rallentatore):\ngira, e il braccio si {g:accorcia}.'],
  [42.9, 48.0, 'In verticale il braccio è zero:\nle forze tirano, ma non fanno girare.'],
  [48.1, 52.6, 'Per lo slancio va oltre, ma ora\nle forze la spingono {y:indietro}.'],
  [52.7, 57.4, 'Oscilla attorno alla verticale\ne si ferma: così {r:non} è un motore.'],
  [57.5, 62.4, 'Serve il {g:commutatore}: un anello\ntagliato in due metà, sull’asse.'],
  [62.5, 67.2, 'Due spazzole ferme strisciano\nsulle metà e portano la corrente.'],
  [67.3, 71.0, 'Lascio andare: gira\nfino alla verticale…'],
  [71.1, 76.4, '…e lì le spazzole cambiano metà:\nla corrente nella spira si {g:inverte}.'],
  [76.5, 81.6, 'A destra la spinta è sempre in su:\ngira {g:sempre} nello stesso verso.'],
  [81.7, 86.6, 'Accelera, finché l’attrito\nfrena quanto spinge il campo.'],
  [89.6, 95.8, 'La forza del campo fa girare la spira;\nogni mezzo giro la corrente si inverte.'],
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
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
const COL_B = () => mix(C.g, C.paper, .12);
// un filo visto di taglio: cerchio; kOut = puntino (la corrente esce dallo schermo), kIn = crocetta (entra)
function filoTaglio(ctx, p, r, kOut, kIn, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  if (kOut > 0) { ctx.globalAlpha *= 1; ctx.save(); ctx.globalAlpha *= kOut; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(p[0], p[1], r * .3, 0, TAU); ctx.fill(); ctx.restore(); }
  if (kIn > 0) {
    ctx.save(); ctx.globalAlpha *= kIn; ctx.strokeStyle = css(C.v); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
    const a = r * .5; ctx.beginPath(); ctx.moveTo(p[0] - a, p[1] - a); ctx.lineTo(p[0] + a, p[1] + a); ctx.moveTo(p[0] + a, p[1] - a); ctx.lineTo(p[0] - a, p[1] + a); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function tratteggio(ctx, a, b, col, al = 1, w = 3) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}

// ---------- la rotazione, integrata una volta sola ----------
// J·θ'' = k·cos θ − c·θ' (senza commutatore), J·θ'' = k·|cos θ| − c·θ' (con il commutatore); un valore ogni 1/240 s
const KM = 1, JM = .365, CM = .2432;
function integra(comm, dur) {
  const tab = [0]; let th = 0, om = 0; const dt = 1 / 1920;
  for (let i = 0; i < dur * 240; i++) {
    for (let j = 0; j < 8; j++) { const mo = KM * (comm ? Math.abs(Math.cos(th)) : Math.cos(th)); om += (mo - CM * om) / JM * dt; th += om * dt; }
    tab.push(th);
  }
  return tab;
}
const SIM_A = integra(false, 14), SIM_B = integra(true, 14);
const leggi = (tab, s) => { const i = clamp(s * 240, 0, tab.length - 1), i0 = Math.floor(i), i1 = Math.min(tab.length - 1, i0 + 1); return lerp(tab[i0], tab[i1], i - i0); };
// l'istante (del moto) in cui la spira arriva in verticale: uguale nei due casi, perché fino a 90° cos θ = |cos θ|
const T90 = (() => { for (let i = 1; i < SIM_A.length; i++) if (SIM_A[i] >= Math.PI / 2) { const f = (Math.PI / 2 - SIM_A[i - 1]) / (SIM_A[i] - SIM_A[i - 1]); return (i - 1 + f) / 240; } return 1.3; })();
// il tempo del moto: parte a t0, si ferma (fermo immagine) in verticale, riparte a tr
const tempoMoto = (t, t0, tr) => t < t0 ? 0 : t < t0 + T90 ? t - t0 : t < tr ? T90 : T90 + t - tr;
const TA0 = 39.6, TAR = 48.2, TB0 = 67.9, TBR = 76.6;
const thetaA = t => leggi(SIM_A, tempoMoto(t, TA0, TAR));
const thetaB = t => leggi(SIM_B, tempoMoto(t, TB0, TBR));
const CON_COMM = t => t >= 57.5;
const theta = t => CON_COMM(t) ? thetaB(t) : thetaA(t);
// il segno della corrente nel lato A (+1 = esce dallo schermo); con il commutatore si inverte in verticale.
// kSwap: durante il fermo immagine in verticale lo scambio si vede (prima del fermo A esce, dopo entra)
function correnteA(t) {
  if (!CON_COMM(t)) return { out: 1, inn: 0 };
  if (t >= TB0 + T90 && t < TBR) { const k = P(t, 72.6, 73.2); return { out: 1 - k, inn: k }; }
  return Math.cos(thetaB(t)) >= 0 ? { out: 1, inn: 0 } : { out: 0, inn: 1 };
}

// ---------- la vista di taglio ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const O = [610, 450], RS = 180, RF = 28, LF = 105, RC = 30;
const YL = [170, 250, 330, 410, 490, 570, 650, 730];   // le linee di B: nessuna passa per l'asse
const lato = (th, s) => [O[0] + s * RS * Math.cos(th), O[1] - s * RS * Math.sin(th)];
function sceneCampo(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kp = P(t, 7.9, 8.5);
  for (const [x0, nome] of [[140, 'N'], [930, 'S']]) {
    ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(nome === 'N' ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x0, 150, 150, 600, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, nome, x0 + 75, 452, { size: 72, weight: 600, color: nome === 'N' ? C.paper : C.ink, alpha: kp });
  }
  const kl = P(t, 8.4, 9.8, E.lin);
  ctx.save(); ctx.strokeStyle = css(COL_B()); ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  YL.forEach((y, i) => { const k = clamp(kl * 1.6 - i * .08); if (k <= 0) return; ctx.beginPath(); ctx.moveTo(290, y); ctx.lineTo(lerp(290, 930, k), y); ctx.stroke(); });
  ctx.restore();
  const kf = P(t, 9.6, 10.1);
  if (kf > 0) YL.forEach(y => { for (const x of [345, 885]) { ctx.save(); ctx.globalAlpha *= kf; arrowHead(ctx, [x, y], 0, COL_B(), .9); ctx.restore(); } });
  // il nome del campo, fra due linee, a sinistra della spira
  fondo(ctx, 333, 290, 50, 46, P(t, 10.0, 10.5)); drawRich(ctx, '{mg:B}', 333, 290, { size: 44, alpha: P(t, 10.0, 10.5) });
  ctx.restore();
}
function commutatore(ctx, th, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'butt';
  const g = 9 * Math.PI / 180;   // le due fessure
  [[th, mix(C.y, C.paper, .25)], [th + Math.PI, mix(C.y, C.ink, .3)]].forEach(([c, col]) => {
    ctx.strokeStyle = css(col); ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(O[0], O[1], RC, -(c + Math.PI / 2 - g), -(c - Math.PI / 2 + g)); ctx.stroke();
  });
  ctx.restore();
}
function spazzole(ctx, al) {
  if (al <= 0) return;
  // la corrente entra dalla spazzola di sinistra (+) ed esce da quella di destra (−)
  for (const s of [-1, 1]) {
    const x = s > 0 ? O[0] + RC + 7 : O[0] - RC - 7 - 56;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(s > 0 ? C.x : C.v); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(x, O[1] - 17, 56, 34, 6); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, s > 0 ? '−' : '+', x + 28, O[1] + 1, { size: 34, weight: 700, color: C.paper, alpha: al });
  }
}
function spira(ctx, t, th, al, kI, kF, comm) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const A = lato(th, 1), B = lato(th, -1);
  // il lato corto davanti, visto di taglio: una riga che passa per l'asse (con il commutatore si ferma sull'anello)
  ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 8; ctx.lineCap = 'round';
  if (comm > 0) {
    for (const s of [1, -1]) { const p = lato(th, s), q = [O[0] + s * (RC + 4) * Math.cos(th), O[1] - s * (RC + 4) * Math.sin(th)]; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  } else { ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
  if (comm <= 0) { ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(O[0], O[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
  commutatore(ctx, th, al * comm);
  spazzole(ctx, al * P(t, 62.7, 63.2) * (comm > 0 ? 1 : 0));
  const c = correnteA(t);
  // le forze: verticali, sempre lunghe uguali (F = I·L·B non cambia); verso dal segno della corrente
  if (kF > 0) {
    for (const [p, out, inn] of [[A, c.out, c.inn], [B, c.inn, c.out]]) {
      // esce dallo schermo → spinta in su; entra → in giù
      freccia(ctx, [p[0], p[1] - RF - 4], [p[0], p[1] - RF - 4 - LF], C.y, al * kF * out, 6);
      freccia(ctx, [p[0], p[1] + RF + 4], [p[0], p[1] + RF + 4 + LF], C.y, al * kF * inn, 6);
      const dx = p[0] >= O[0] ? 40 : -40;
      for (const [k, sy] of [[out, -1], [inn, 1]]) {
        if (k <= 0) continue;
        const ly = p[1] + sy * (RF + 4 + LF * .55);
        fondo(ctx, p[0] + dx, ly, 44, 46, al * kF * k); drawRich(ctx, '{my:F}', p[0] + dx, ly, { size: 40, alpha: al * kF * k });
      }
    }
  }
  filoTaglio(ctx, A, RF, kI * c.out, kI * c.inn, al);
  filoTaglio(ctx, B, RF, kI * c.inn, kI * c.out, al);
}
function sceneSpira(ctx, t) {
  // senza commutatore (17,8–57,9)
  const aA = life(t, 17.8, 57.9, .5, .5);
  if (aA > 0) {
    const th = thetaA(t), A = lato(th, 1), B = lato(th, -1);
    // il braccio: la distanza (orizzontale) fra l'asse e la retta su cui agisce ciascuna forza
    const kb = life(t, 33.4, 57.4, .4, .5);
    if (kb > 0) {
      ctx.save(); ctx.globalAlpha *= aA;
      // la quota sotto la spira (y 690, fra le linee di campo 650 e 730, sotto la spira che gira): dall'asse alla retta verticale di ciascuna forza
      const YQ = 690;
      tratteggio(ctx, [O[0], O[1] + 10], [O[0], YQ + 14], C.dim, kb * .8);
      for (const p of [A, B]) {
        tratteggio(ctx, [p[0], p[1]], [p[0], YQ + 14], C.dim, kb * .8);
        const kl = kb * clamp((Math.abs(p[0] - O[0]) - 50) / 40);
        ctx.save(); ctx.globalAlpha *= kb * clamp(Math.abs(p[0] - O[0]) / 12); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(O[0], YQ); ctx.lineTo(p[0], YQ); ctx.moveTo(p[0], YQ - 10); ctx.lineTo(p[0], YQ + 10); ctx.moveTo(O[0], YQ - 10); ctx.lineTo(O[0], YQ + 10); ctx.stroke(); ctx.restore();
        const lx = (O[0] + p[0]) / 2;
        fondo(ctx, lx, YQ, 40, 44, kl); drawRich(ctx, '{mink:b}', lx, YQ, { size: 40, alpha: kl });
      }
      ctx.restore();
    }
    spira(ctx, t, th, aA, P(t, 23.0, 23.5), P(t, 28.5, 29.0), 0);
  }
  // con il commutatore (57,7–fine)
  const aB = life(t, 57.7, T_FINE + .1, .6, .5);
  if (aB > 0) spira(ctx, t, thetaB(t), aB, P(t, 63.6, 64.1), P(t, 64.2, 64.7), P(t, 58.2, 58.8));
}

// ---------- lo schizzo in prospettiva (in alto a destra) ----------
// x verso il polo sud, y in su, z lungo l'asse verso chi guarda (disegnato in basso a sinistra)
const C3 = [1480, 292], S3 = 105;
const pr = (x, y, z) => [C3[0] + S3 * (x - .5 * z), C3[1] - S3 * (y - .35 * z)];
function poligono(ctx, pts, fill, stroke, w = 2.5) {
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }
}
function sceneSchizzo(ctx, t) {
  const al = life(t, 12.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const th = theta(t), r = .8, zl = 1.15;
  const piastra = (x, col, a) => { ctx.save(); ctx.globalAlpha *= a; poligono(ctx, [pr(x, -.8, -1.3), pr(x, .8, -1.3), pr(x, .8, 1.3), pr(x, -.8, 1.3)], css(col), css(mix(C.ink, C.paper, .25))); ctx.restore(); };
  piastra(-1.55, C.ink, 1);
  txt(ctx, 'N', pr(-1.55, 0, 0)[0], pr(-1.55, 0, 0)[1], { size: 44, weight: 600, color: C.paper });
  // l'asse
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  let a = pr(0, 0, -1.6), b = pr(0, 0, 1.75); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  // la spira: quattro lati
  const P1 = [r * Math.cos(th), r * Math.sin(th)];
  const v = [[P1[0], P1[1], -zl], [P1[0], P1[1], zl], [-P1[0], -P1[1], zl], [-P1[0], -P1[1], -zl]].map(q => pr(q[0], q[1], q[2]));
  ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  poligono(ctx, v, null, css(mix(C.ink, C.paper, .15)), 6);
  // la corrente: frecce a metà dei lati lunghi (nel lato A verso chi guarda, se esce dallo schermo)
  const kI = P(t, 23.0, 23.5) * (CON_COMM(t) ? P(t, 63.6, 64.1) : 1), c = correnteA(t);
  if (kI > 0) {
    const angZ = Math.atan2(.35, -.5);   // la direzione di +z sullo schermo
    for (const [s, out, inn] of [[1, c.out, c.inn], [-1, c.inn, c.out]]) {
      const m = pr(s * P1[0], s * P1[1], 0);
      if (out > 0) { ctx.save(); ctx.globalAlpha *= kI * out; arrowHead(ctx, m, angZ, C.v, 1.7); ctx.restore(); }
      if (inn > 0) { ctx.save(); ctx.globalAlpha *= kI * inn; arrowHead(ctx, m, angZ + Math.PI, C.v, 1.7); ctx.restore(); }
    }
  }
  // il commutatore sull'asse, davanti
  const kc = P(t, 58.2, 58.8);
  if (kc > 0) {
    const q = pr(0, 0, 1.4);
    ctx.save(); ctx.globalAlpha *= kc; ctx.lineWidth = 9; ctx.lineCap = 'butt';
    ctx.strokeStyle = css(mix(C.y, C.paper, .25)); ctx.beginPath(); ctx.arc(q[0], q[1], 13, -th - Math.PI / 2 + .15, -th + Math.PI / 2 - .15); ctx.stroke();
    ctx.strokeStyle = css(mix(C.y, C.ink, .3)); ctx.beginPath(); ctx.arc(q[0], q[1], 13, -th + Math.PI / 2 + .15, -th + 3 * Math.PI / 2 - .15); ctx.stroke();
    ctx.restore();
  }
  piastra(1.55, mix(C.dim, C.paper, .55), .82);
  txt(ctx, 'S', pr(1.55, 0, 0)[0], pr(1.55, 0, 0)[1], { size: 44, weight: 600, color: C.ink });
  // il campo, sopra
  const kB = P(t, 13.2, 13.7);
  freccia(ctx, pr(-.5, 1.25, 0), pr(.7, 1.25, 0), COL_B(), kB, 5);
  drawRich(ctx, '{mg:B}', pr(.7, 1.25, 0)[0] + 22, pr(.7, 1.25, 0)[1], { size: 38, align: 'left', alpha: kB });
  // L: il lato lungo
  const kL = P(t, 28.4, 28.9) * (1 - P(t, 38.0, 38.5));
  const mL = pr(r, 0, .6);
  fondo(ctx, mL[0] + 20, mL[1] + 36, 40, 44, kL); drawRich(ctx, '{mink:L}', mL[0] + 20, mL[1] + 36, { size: 38, alpha: kL });
  // l'occhio: guarda lungo l'asse
  const ke = P(t, 17.9, 18.4);
  if (ke > 0) {
    const e = pr(0, 0, 2.45), ang = Math.atan2(-.35, .5);
    ctx.save(); ctx.globalAlpha *= ke; ctx.translate(e[0], e[1]); ctx.rotate(ang);
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(0, -22, 26, 0); ctx.quadraticCurveTo(0, 22, -26, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(8, 0, 8, 0, TAU); ctx.fill();
    ctx.restore();
    txt(ctx, 'guardo da qui', e[0] + 40, e[1] + 64, { size: 30, color: C.dim, alpha: ke * (1 - P(t, 27.6, 28.2)) });
  }
  ctx.restore();
}

// ---------- il pannello (sotto lo schizzo) ----------
function scenePannello(ctx, t) {
  const al = life(t, 12.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  separa(ctx, 462, P(t, 22.8, 23.2));
  const kg = P(t, 23.0, 23.5);
  filoTaglio(ctx, [1235, 505], 18, kg, 0, kg); drawRich(ctx, '{dim:la corrente esce dallo schermo}', 1270, 505, { size: 30, align: 'left', alpha: kg });
  filoTaglio(ctx, [1235, 557], 18, 0, kg, kg); drawRich(ctx, '{dim:la corrente entra nello schermo}', 1270, 557, { size: 30, align: 'left', alpha: kg });
  separa(ctx, 600, P(t, 28.4, 28.8));
  drawRich(ctx, '{my:F} = {mv:I}·{mink:L}·{mg:B}', 1480, 652, { size: 50, local: t - 28.5 });
  const km = P(t, 33.4, 33.9) * (1 - P(t, 57.5, 58.0));
  drawRich(ctx, '{dim:momento di ogni forza:} {my:F}·{mink:b}', 1480, 730, { size: 34, alpha: km });
  const kc = P(t, 58.2, 58.7);
  drawRich(ctx, '{g:commutatore}{dim:: la corrente}', 1480, 712, { size: 32, alpha: kc });
  drawRich(ctx, '{dim:si inverte ogni mezzo giro}', 1480, 752, { size: 32, alpha: kc });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il motore elettrico', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.6, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 96.6, 97.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due forze opposte fanno girare la spira;\nil commutatore la tiene in moto.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:F} = {mv:I}·{mink:L}·{mg:B}\n{dim:su un lato, giù sull’altro}'], [960, '{dim:momento} {my:F}·{mink:b}\n{dim:zero con la spira in verticale}'], [1470, 'il {g:commutatore} inverte la\ncorrente ogni mezzo giro']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 30, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): rotazioni rieseguite con integra(); il tono segue l'angolo del lato A,
  // da 0° (0) a 180° (1), con il fermo immagine in verticale; con il commutatore, quando gira di continuo, un tono
  // breve che segue l'altezza del lato A
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .45], ['traccia', 8.4, 9.8],                        // i poli, le linee di B
    ['pop', 9.7, .35], ['pop', 10.1, .4],                                             // il verso, B
    ['soffio', 12.6], ['pop', 13.3, .4],                                              // lo schizzo
    ['pop', 17.9, .45], ['pop', 18.0, .35],                                           // la spira di taglio, l'occhio
    ['pop', 23.1, .5],                                                                // la corrente
    ['pop', 28.6, .55], ['pop', 28.9, .6],                                            // le forze, F = I·L·B
    ['traccia', 33.4, 33.8], ['pop', 33.6, .45],                                      // il braccio b
    ['tono', 39.6, 40.9, [0, .03, .11, .22, .36, .5]],                                // lascio andare: fino alla verticale
    ['tono', 48.2, 53.0, [.5, .66, .73, .7, .61, .5, .42, .38, .4, .45, .51, .55, .56]],   // va oltre e oscilla
    ['pop', 58.3, .5], ['pop', 62.8, .45], ['pop', 63.7, .45], ['pop', 64.3, .5],     // commutatore, spazzole, corrente, forze
    ['tono', 67.9, 69.2, [0, .03, .11, .22, .36, .5]],                                // fino alla verticale
    ['pop', 72.7, .55], ['ding', 73.1],                                               // la corrente si inverte
    ['tono', 76.6, 79.4, [1, .96, .83, .61, .32, .07, 0, .12, .38, .72, .96]],        // gira sempre nello stesso verso
    ['soffio', 87.2], ['pop', 89.4, .5], ['pop', 89.9, .6], ['pop', 90.4, .7],        // in una frase
  ];
  return {
    titolo: 'Il motore elettrico', durata: 98.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 38.2, 'le forze sulla spira'], [38.2, 57.4, 'senza commutatore'], [57.4, T_FINE, 'il commutatore']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCampo(ctx, t); sceneSpira(ctx, t); sceneSchizzo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
