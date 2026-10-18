'use strict';
/* La goccia d'olio che non cade — l'esperimento di Millikan (1909). Una goccia d'olio di raggio 1 µm (densità 886 kg/m³):
   m = 4/3·π·r³·densità ≈ 3,71·10⁻¹⁵ kg, peso m·g ≈ 3,64·10⁻¹⁴ N. Nell'aria (viscosità 1,8·10⁻⁵ Pa·s) l'attrito vale
   6·π·η·r·v e raggiunge il peso in 10 µs: a piatti scarichi scende a velocità costante, 0,107 mm/s; dalla velocità si
   ricava la massa. La goccia ha carica −3e. Col campo E verso il basso la forza elettrica |q|·E è verso l'alto: con
   E = 3,78·10⁴ N/C (metà) scende a 0,054 mm/s; a E = 1,50·10⁵ N/C sale a 0,105 mm/s; abbassando E (in modo lineare, 3,1 s) la velocità cala in modo lineare fino a zero a
   E = m·g/|q| ≈ 7,57·10⁴ N/C: ferma, |q| = m·g/E ≈ 4,81·10⁻¹⁹ C. Il moto disegnato è quello vero, in tempo vero,
   ingrandito 150 volte (0,1 mm = 15 px). Poi 40 cariche simulate (seme fisso, scarto dell'1,5 %): cadono su multipli di
   e = 1,60·10⁻¹⁹ C. Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/millikan', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot } = M;

const T_FINE = 90.7;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.5, 'felice'], [17.1, 'neutro'],
  [26.3, 'pensa'], [31.4, 'neutro'], [41.2, 'sorpreso'], [45.8, 'neutro'], [49.1, 'felice'], [53.2, 'neutro'],
  [57.8, 'felice'], [62.9, 'neutro'], [67.5, 'sorpreso'], [72.1, 'felice'], [76.7, 'neutro'], [81.3, 'felice'],
  [85.9, 'festa'], [T_FINE, 'neutro'], [93.1, 'felice'], [97.1, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'La carica elettrica si divide\nin pezzi piccoli a piacere?'],
  [7.9, 12.4, 'L’esperimento di Millikan (1909):\ngoccioline d’olio fra due piatti.'],
  [12.5, 17.0, 'Spruzzandole, alcune si {g:caricano}.\nCon un microscopio ne seguo una.'],
  [17.1, 21.6, 'Senza tensione la goccia cade:\nla tira giù il peso {my:m·g}.'],
  [21.7, 26.2, 'L’aria la frena e pareggia il peso:\nscende costante, a 0,11 mm/s.'],
  [26.3, 31.3, 'Da quella velocità si ricava\nla {g:massa}: {mink:m} ≈ 3,7·10{mink:⁻¹⁵} kg.'],
  [31.4, 36.2, 'Do tensione: fra i piatti c’è un\n{v:campo elettrico} {mink:E}, verso il basso.'],
  [36.3, 41.1, 'La goccia ha carica {mink:q} {x:negativa}:\nil campo la spinge su con {my:q·E}.'],
  [41.2, 45.7, 'Campo forte: la spinta vince il peso,\ne la goccia {g:sale}.'],
  [45.8, 49.0, 'Abbasso il campo piano piano…'],
  [49.1, 53.1, '…finché la goccia resta {g:ferma},\nsospesa a mezz’aria.'],
  [53.2, 57.7, 'Ferma: forza elettrica e peso\nsi equilibrano, {my:q·E} = {my:m·g}.'],
  [57.8, 62.8, '{mink:q} = {mink:m·g}/{mink:E}:\ncirca 4,8·10{mink:⁻¹⁹} C.'],
  [62.9, 67.4, 'Con tante gocce diverse: ecco 40\ncariche, una per goccia.'],
  [67.5, 72.0, 'Cadono solo su certi valori,\ne {r:mai} nel mezzo.'],
  [72.1, 76.6, 'Sono tutti multipli di\n{mink:e} ≈ 1,6·10{mink:⁻¹⁹} C.'],
  [76.7, 81.2, 'È la {v:carica elementare}: quella\ndell’elettrone, col segno meno.'],
  [81.3, 85.8, 'La nostra goccia: 3{mink:e},\ntre elettroni in più.'],
  [85.9, 90.4, 'La carica è {g:quantizzata}: viene\nsolo a pacchetti di {mink:e}.'],
  [93.1, 98.1, 'Dalla goccia ferma, {mink:q} = {mink:m·g}/{mink:E}:\nsempre un multiplo intero di {mink:e}.'],
];

// ---------- la fisica della goccia ----------
const EL = 1.602e-19, R_G = 1e-6, DENS = 886, ETA = 1.8e-5, G0 = 9.8;
const MASSA = 4 / 3 * Math.PI * Math.pow(R_G, 3) * DENS, PESO = MASSA * G0, KA = 6 * Math.PI * ETA * R_G;   // attrito = KA·v
const Q = 3 * EL, E1 = 1.5e5, E_EQ = PESO / Q;
const T_SU = 13.5, T_ON = 31.5, T_F0 = 41.3, T_F1 = 41.8, T_R0 = 45.9, T_R1 = 49.0, E_DEB = E_EQ / 2;
// il campo: debole da 31,5 (metà di quello che la ferma), forte da 41,3, poi abbassato piano fino all'equilibrio
const campo = t => t < T_ON ? 0 : t < T_F0 ? E_DEB : t < T_F1 ? lerp(E_DEB, E1, (t - T_F0) / (T_F1 - T_F0)) : t < T_R0 ? E1 : t < T_R1 ? lerp(E1, E_EQ, (t - T_R0) / (T_R1 - T_R0)) : E_EQ;
const vel = t => t < T_SU ? 0 : (PESO - Q * campo(t)) / KA;                 // m/s, positiva verso il basso
const V0 = PESO / KA;
// quanto è scesa (in mm) dall'istante T_SU: l'integrale della velocità, tabulato una volta ogni 0,01 s
const PASSO = .01, TAB = (() => { const a = [0]; let y = 0; for (let t = T_SU; t < 60; t += PASSO) { y += (vel(t) + vel(t + PASSO)) / 2 * PASSO * 1000; a.push(y); } return a; })();
function yMm(t) {
  if (t <= T_SU) return 0;
  const f = Math.min((t - T_SU) / PASSO, TAB.length - 1.001), i = Math.floor(f);
  return lerp(TAB[i], TAB[i + 1], f - i);
}
const fmt = (v, d) => v.toFixed(d).replace('.', ',');
function sci(v, d) {   // 75677 → '7,57·10{mink:⁴}'
  const ex = Math.floor(Math.log10(v)), m = v / Math.pow(10, ex), SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  return fmt(m, d) + '·10{mink:' + String(ex).split('').map(c => SUP[c]).join('') + '}';
}

// ---------- le cariche di 40 gocce: dati simulati, seme fisso, scarto dell'1,5 % ----------
const NS = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6];
const DATI = (() => {
  let s = 20261014;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const conta = {};
  return NS.map((n, i) => {
    const u1 = rnd() || 1e-9, u2 = rnd(), z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const q = i === 17 ? 3 * 1.602 : n * 1.602 * (1 + .015 * z);              // la n. 17 è la nostra goccia
    if (i !== 17) conta[n] = (conta[n] || 0) + 1;
    return { q, n, piano: i === 17 ? -1 : conta[n] - 1, nostra: i === 17 };
  }).map((d, i, tutti) => d.nostra ? Object.assign(d, { piano: tutti.filter(x => x.n === 3).length - 1 }) : d);   // la nostra in cima
})();
// l'ordine in cui compaiono: mescolato, sempre lo stesso
const ORDINE = DATI.map((d, i) => i).sort((a, b) => ((a * 17 + 5) % 41) - ((b * 17 + 5) % 41));

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 6) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.2, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La goccia d’olio che non cade', W / 2, 180, { size: 108, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · i piatti e il microscopio (7,5–63,2): 200 px per mm dentro il cerchio del microscopio
// la goccia è 150 px sopra il centro quando si comincia a parlare della caduta (17,2 s)
const MC = [610, 456], RC = 250, PXMM = 150, KF = 50;   // KF: px per un peso
const Y0 = MC[1] - 150 - PXMM * V0 * 1000 * (17.2 - T_SU);
const yGoccia = t => Y0 + PXMM * yMm(t);
function sceneApparato(ctx, t) {
  const al = life(t, 7.6, 63.2, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kOn = P(t, T_ON, T_ON + .4);
  // i piatti, col foro in alto da cui entrano le gocce
  const colSu = mix(C.dim, C.v, kOn), colGiu = mix(C.dim, C.x, kOn);
  ctx.fillStyle = css(colSu); ctx.fillRect(170, 168, 425, 20); ctx.fillRect(625, 168, 435, 20);
  ctx.fillStyle = css(colGiu); ctx.fillRect(170, 712, 890, 20);
  drawRich(ctx, '{v:+}', 140, 178, { size: 44, alpha: kOn }); drawRich(ctx, '{x:−}', 140, 722, { size: 44, alpha: kOn });
  // lo spruzzo d'olio sopra il foro
  const kS = life(t, 8.2, 17.0, .5, .6);
  if (kS > 0) for (let i = 0; i < 14; i++) {
    const x = 610 + ((i * 47) % 130) - 65, y = 128 + ((i * 29) % 36);
    dot(ctx, [x, y], mix(C.y, C.dim, .3), kS, 4);
  }
  // il campo fra i piatti, verso il basso
  if (kOn > 0) [170, 230, 1022, 1058].forEach(x => freccia(ctx, [x, 205], [x, 700], C.ink, .55 * kOn, 3));
  if (kOn > 0) { fondo(ctx, 200, 456, 56, 44, kOn); drawRich(ctx, '{mink:E}', 200, 456, { size: 40, alpha: kOn }); }
  // il microscopio: cerchio con il reticolo, una riga ogni 0,1 mm
  const kM = P(t, 12.8, 13.4);
  if (kM > 0) {
    ctx.save(); ctx.globalAlpha *= kM;
    ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(MC[0], MC[1], RC, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(MC[0], MC[1], RC - 2, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = C.grid; ctx.lineWidth = 2;
    for (let y = MC[1] - RC + 10; y <= MC[1] + RC; y += 15) { ctx.beginPath(); ctx.moveTo(MC[0] - RC, y); ctx.lineTo(MC[0] + RC, y); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(870, 449); ctx.lineTo(882, 449); ctx.moveTo(876, 449); ctx.lineTo(876, 464); ctx.moveTo(870, 464); ctx.lineTo(882, 464); ctx.stroke();
    txt(ctx, '0,1 mm', 888, 456, { size: 30, color: C.ink, align: 'left' });
    ctx.restore();
    txt(ctx, 'al microscopio: tempo vero, ingrandito 150 volte', 1085, 760, { size: 30, color: C.dim, align: 'right', alpha: kM });
  }
  // la goccia e le sue forze (50 px per un peso)
  const kG = P(t, 13.0, 13.5);
  if (kG > 0) {
    const y = yGoccia(t), x = MC[0], v = vel(t);
    ctx.save(); ctx.globalAlpha *= kG;
    ctx.fillStyle = css(mix(C.y, C.paper, .3)); ctx.strokeStyle = css(mix(C.y, C.ink, .4)); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawRich(ctx, '{x:−}', x, y - 30, { size: 34, alpha: P(t, 36.4, 36.8) });
    ctx.restore();
    const kP = P(t, 17.2, 17.6), kA = P(t, 17.2, 17.6), kAt = P(t, 21.8, 22.2), kE = P(t, T_ON, T_ON + .3);
    freccia(ctx, [x, y + 16], [x, y + 16 + KF], C.y, kP, 6);
    drawRich(ctx, '{my:m·g}', x + 24, y + 52, { size: 34, align: 'left', alpha: kP });
    const Lq = KF * Q * campo(t) / PESO;
    if (Lq > 1) { freccia(ctx, [x + 34, y - 4], [x + 34, y - 4 - Lq], C.y, kE, 6); drawRich(ctx, '{my:q·E}', x + 52, y - 4 - Lq / 2, { size: 34, align: 'left', alpha: P(t, 36.4, 36.8) }); }
    const La = KF * Math.abs(v) / V0, su = v > 0;          // l'attrito dell'aria: contro la velocità
    if (La > 2) {
      const y0 = su ? y - 4 : y + 4;
      freccia(ctx, [x - 34, y0], [x - 34, su ? y0 - La : y0 + La], C.y, kA, 6);
      txt(ctx, 'aria', x - 52, su ? y0 - La / 2 : y0 + La / 2, { size: 30, color: C.y, align: 'right', alpha: kAt });
    }
  }
  ctx.restore();
}

// 2 · le cariche di 40 gocce (62,9–90,7): 84 px per 10⁻¹⁹ C
const QX = q => 200 + 84 * q, BASE = 660;
const yDato = d => BASE - 18 - d.piano * 26;
function sceneDati(ctx, t) {
  const al = life(t, 62.9, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, 'dati simulati, come quelli di Millikan', 140, 150, { size: 30, color: C.dim, align: 'left' });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(QX(0), BASE); ctx.lineTo(QX(10.3), BASE); ctx.stroke(); arrowHead(ctx, [QX(10.3) + 6, BASE], 0, C.ink);
  for (let q = 0; q <= 10; q++) { ctx.beginPath(); ctx.moveTo(QX(q), BASE - 6); ctx.lineTo(QX(q), BASE + 6); ctx.stroke(); txt(ctx, String(q), QX(q), BASE + 32, { size: 30, color: C.dim }); }
  drawRich(ctx, '{dim:carica, in} 10{mink:⁻¹⁹} C', 1085, BASE + 78, { size: 30, align: 'right' });
  // «mai nel mezzo»
  const kB = life(t, 67.6, 76.7, .4, .4);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB; ctx.fillStyle = css(C.r, .1); ctx.fillRect(QX(1.95), 400, QX(2.85) - QX(1.95), BASE - 404); ctx.restore();
    drawRich(ctx, '{r:mai qui}', QX(2.4), 370, { size: 34, alpha: kB });
  }
  // i multipli di e
  const kM = P(t, 72.2, 72.8);
  if (kM > 0) for (let n = 1; n <= 6; n++) {
    const k = P(t, 72.2 + n * .15, 72.6 + n * .15);
    dashed(ctx, [QX(n * 1.602), BASE - 8], [QX(n * 1.602), 335], C.g, 1, .8 * k);
    drawRich(ctx, (n > 1 ? n : '') + '{mink:e}', QX(n * 1.602), 305, { size: 34, alpha: k });
  }
  ORDINE.forEach((i, j) => {
    const d = DATI[i], k = P(t, 63.1 + j * .085, 63.4 + j * .085, E.back);
    if (k > 0) dot(ctx, [QX(d.q), yDato(d)], C.x, k, 10);
  });
  // la nostra goccia
  const kN = P(t, 81.4, 81.8);
  if (kN > 0) {
    const d = DATI[17], p = [QX(d.q), yDato(d)];
    ctx.save(); ctx.globalAlpha *= kN; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(p[0], p[1], 19, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    fondo(ctx, p[0], p[1] - 44, 150, 42, kN);
    drawRich(ctx, '{g:la nostra}', p[0], p[1] - 44, { size: 32, alpha: kN });
  }
  ctx.restore();
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  sceneApparato(ctx, t); sceneDati(ctx, t);
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 21.6 || t > T_FINE + .3) return;
  const al = life(t, 21.8, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · la goccia
  const s1 = life(t, 21.8, 63.0, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'la goccia d’olio');
    drawRich(ctx, '{dim:a piatti scarichi:} 0,11 mm/s', 1480, 235, { size: 32, local: t - 21.9 });
    drawRich(ctx, '{mink:m} ≈ 3,71·10{mink:⁻¹⁵} kg', 1480, 290, { size: 36, local: t - 26.5 });
    drawRich(ctx, '{my:m·g} ≈ 3,64·10{mink:⁻¹⁴} N', 1480, 345, { size: 36, local: t - 27.2 });
    riga(390, P(t, 31.4, 31.8));
    const kE = P(t, 31.5, 31.9);
    if (kE > 0) {
      ctx.save(); ctx.globalAlpha *= kE;
      const Ev = campo(t), v = vel(t) * 1000;
      drawRich(ctx, '{dim:campo} {mink:E}', 1200, 440, { size: 34, align: 'left' });
      drawRich(ctx, Ev > 0 ? sci(Ev, 2) + ' N/C' : '0', 1770, 440, { size: 36, align: 'right' });
      drawRich(ctx, '{dim:velocità}', 1200, 495, { size: 34, align: 'left' });
      const ferma = Math.abs(v) < .005;
      drawRich(ctx, ferma ? '{g:ferma}' : fmt(Math.abs(v), 2) + ' mm/s ' + (v > 0 ? '↓' : '↑'), 1770, 495, { size: 36, align: 'right' });
      ctx.restore();
    }
    riga(540, P(t, 53.2, 53.6));
    drawRich(ctx, '{my:q·E} = {my:m·g}', 1480, 590, { size: 44, local: t - 53.3 });
    drawRich(ctx, '{mink:q} = {mink:m·g}/{mink:E}', 1480, 655, { size: 44, local: t - 57.9 });
    drawRich(ctx, '{g:≈ 4,81·10}{mg:⁻¹⁹}{g: C} {dim:(in modulo)}', 1480, 725, { size: 38, local: t - 58.6 });
    ctx.restore();
  }
  // 2 · tante gocce
  const s2 = P(t, 63.0, 63.4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'tante gocce');
    drawRich(ctx, '{dim:le cariche cadono su}', 1480, 240, { size: 32, local: t - 67.6 });
    drawRich(ctx, '1,6;  3,2;  4,8;  6,4;  8,0;  9,6', 1480, 295, { size: 38, local: t - 68.0 });
    drawRich(ctx, '{dim:(in 10}{mink:⁻¹⁹}{dim: C)}', 1480, 345, { size: 30, local: t - 68.4 });
    riga(390, P(t, 72.2, 72.6));
    drawRich(ctx, '{mink:e} ≈ 1,60·10{mink:⁻¹⁹} C', 1480, 445, { size: 46, local: t - 72.3 });
    drawRich(ctx, '{dim:la} {v:carica elementare}', 1480, 510, { size: 34, local: t - 76.8 });
    drawRich(ctx, '{dim:elettrone:} −{mink:e}', 1480, 560, { size: 34, local: t - 77.4 });
    riga(605, P(t, 81.3, 81.7));
    drawRich(ctx, '{dim:la nostra goccia:} 3{mink:e} = 4,81·10{mink:⁻¹⁹} C', 1480, 655, { size: 32, local: t - 81.4 });
    drawRich(ctx, '{g:la carica è quantizzata}', 1480, 725, { size: 38, local: t - 86.0 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (90,7–101,1)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 99.6, 100.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La carica elettrica viene a pacchetti:\nsempre un multiplo di {mink:e}.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{my:q·E} = {my:m·g}\n{dim:la goccia ferma}'], [960, '{mink:e} ≈ 1,6·10{mink:⁻¹⁹} C\n{dim:carica elementare}'], [1430, '{mink:q} = 1, 2, 3… {dim:volte} {mink:e}\n{dim:mai a metà}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della goccia nel microscopio, dal fondo (0)
  // alla cima (1) del cerchio; il moto è quello simulato da yGoccia
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .6],                                                // i piatti, lo spruzzo d'olio
    ['pop', 12.8, .45], ['pop', 13.0, .9], ['tono', 13.5, 15.0, [.92, .87]],          // il microscopio, la goccia comincia a scendere
    ['pop', 17.2, .4],                                                                // il peso e l'aria
    ['soffio', 21.8], ['tono', 21.8, 23.3, [.65, .6]],                                // il pannello; scende costante
    ['pop', 26.5, .45], ['pop', 27.2, .5],                                            // m e m·g
    ['pop', 31.5, .6], ['tono', 31.5, 33.0, [.34, .32]],                              // il campo acceso: scende più piano
    ['pop', 36.4, .5],                                                                // la carica negativa, q·E
    ['tono', 41.3, 45.9, [.18, .21, .24, .28, .32]],                                  // campo forte: la goccia sale
    ['tono', 45.9, 49.0, [.32, .34, .36, .36]], ['ding', 49.0],                       // il campo cala: rallenta e si ferma
    ['pop', 53.3, .5], ['pop', 57.9, .55], ['ding', 58.6],                            // q·E = m·g, q = m·g/E, 4,81·10⁻¹⁹ C
    ['soffio', 62.9], ['tono', 63.1, 66.8, [.1, .9]],                                 // le cariche di 40 gocce, una dopo l'altra
    ['pop', 67.6, .3], ['pop', 68.0, .5],                                             // «mai qui», i valori
    ['pop', 72.3, .45],                                                               // e ≈ 1,6·10⁻¹⁹ C
    ['pop', 72.55, .3], ['pop', 72.7, .4], ['pop', 72.85, .5], ['pop', 73.0, .6], ['pop', 73.15, .7], ['pop', 73.3, .8],   // e, 2e … 6e
    ['pop', 76.8, .5], ['pop', 81.4, .6],                                             // la carica elementare, la nostra goccia
    ['soffio', 90.9], ['pop', 92.9, .5], ['pop', 93.4, .6], ['pop', 93.9, .7],        // in una frase
  ];
  return {
    titolo: 'La goccia d’olio che non cade', durata: 101.1, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.3, 'la goccia che cade'], [31.3, 62.8, 'la goccia ferma'], [62.8, T_FINE, 'tante gocce']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
