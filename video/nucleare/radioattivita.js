'use strict';
/* Alfa, beta, gamma — tre radiazioni da una sorgente, su tre corsie, e tre schermi. Alfa (C.v, come le cariche positive):
   un nucleo di elio, 2 p + 2 n, carica +2e; il nucleo perde Z − 2 e A − 4 (²³⁸U → ²³⁴Th + ⁴He). Beta (C.x, come l'elettrone):
   un elettrone nato nel nucleo da n → p + e⁻ + antineutrino, Z + 1 e A uguale (¹⁴C → ¹⁴N); il beta più è un positrone, Z − 1.
   Gamma (C.y): un fotone, Z e A uguali. Schermi: un foglio di carta ferma le alfa (in aria fanno pochi cm), pochi mm di
   alluminio le beta, il piombo attenua i gamma senza fermarli del tutto: per i gamma da ≈ 1 MeV un centimetro circa ne
   dimezza (coefficiente ≈ 0,7–0,8 per cm), quindi 3 cm ne lasciano passare (1/2)³ = 1 su 8: nel disegno passa un fotone
   su otto, in ordine fisso. Le particelle sono funzioni del tempo (emissione periodica), niente caso. Argomento: nucleare. */
CVIDEO.registra('nucleare/radioattivita', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 81.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.4, 'felice'], [22.4, 'neutro'],
  [27.6, 'sorpreso'], [32.4, 'pensa'], [37.4, 'neutro'], [47.0, 'felice'], [51.8, 'neutro'], [56.4, 'pensa'],
  [61.5, 'neutro'], [70.9, 'sorpreso'], [75.3, 'neutro'], [83.4, 'festa'], [86.5, 'felice'], [89.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Da un nucleo instabile escono tre\nradiazioni: che cosa sono?'],
  [7.9, 12.4, 'Alcuni nuclei sono {g:instabili}: prima o poi\nsi trasformano, emettendo radiazione.'],
  [12.5, 17.3, 'Rutherford le chiamò con le lettere\ngreche: alfa, beta, gamma.'],
  [17.4, 22.3, '{v:Alfa}: un nucleo di elio, 2 protoni\ne 2 neutroni. Carica +2, pesante.'],
  [22.4, 27.5, 'Il nucleo perde quei 4 nucleoni:\n{mink:Z} cala di 2, {mink:A} di 4.'],
  [27.6, 32.3, '{x:Beta}: un elettrone uscito dal nucleo.\nMa lì non ci sono elettroni!'],
  [32.4, 37.3, 'Nasce lì: un neutrone diventa protone\ned elettrone, più un antineutrino.'],
  [37.4, 42.1, '{mink:Z} sale di 1, {mink:A} non cambia:\nil carbonio-14 diventa azoto-14.'],
  [42.2, 46.9, 'C’è anche il beta più: un positrone,\nl’antielettrone: {mink:Z} cala di 1.'],
  [47.0, 51.7, '{y:Gamma}: un fotone, luce di altissima\nenergia. Niente carica, niente massa.'],
  [51.8, 56.1, '{mink:Z} e {mink:A} non cambiano: il nucleo\nperde solo energia.'],
  [56.4, 61.4, 'Quanto penetrano? Un {g:foglio di carta}\nferma le alfa: in aria fanno pochi cm.'],
  [61.5, 66.2, 'Le beta passano la carta: le fermano\n{g:pochi millimetri di alluminio}.'],
  [66.3, 70.8, 'I gamma passano anche quello:\nservono {g:centimetri di piombo}…'],
  [70.9, 75.2, '…che {g:attenua}, non ferma del tutto:\nogni centimetro circa ne dimezza.'],
  [75.3, 80.6, 'Le alfa si fermano subito: cedono tutta\nl’energia lì. Dentro il corpo fanno danno.'],
  [83.4, 89.0, 'Tre radiazioni, tre schermi: carta,\nalluminio, piombo. Il piombo attenua.'],
];

// ---------- la scena: sorgente, corsie, schermi ----------
const SX = [110, 110, 1100, 680], DX = [1250, 110, 560, 680], PX = 1530;
const XS = 230, YS = 450, X0 = 300, XMAX = 1195;                      // sorgente e inizio delle corsie
const Y_A = 300, Y_B = 450, Y_G = 600;
const X_CARTA = 560, X_AL = 800, X_PB = 1040, SP_PB = 60;             // gli schermi (il piombo è spesso 3 cm)
const T_CARTA = 56.6, T_AL = 61.7, T_PB = 66.5;
const T_A = 17.6, T_B = 27.7, T_G = 47.1;                             // da quando esce ogni radiazione
// corsie: periodo d'emissione, velocità (px/s, solo per il disegno), dove si fermano e da quando
const CORSIE = {
  a: { t0: T_A, per: .9, v: 320, y: Y_A, xs: X_CARTA - 8, ts: T_CARTA },
  b: { t0: T_B, per: .55, v: 640, y: Y_B, xs: X_AL - 10, ts: T_AL },
  g: { t0: T_G, per: .45, v: 880, y: Y_G, xs: X_PB, ts: T_PB },
};
// numeri «a caso» ma sempre gli stessi: mulberry32 con un seme fisso
function generatore(seme) {
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function nucleone(ctx, p, protone, r = 34, al = 1) {
  if (al <= 0) return;
  const col = protone ? C.v : mix(C.dim, C.paper, .25);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  if (protone && r >= 12) {
    ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(2.5, r * .17); ctx.lineCap = 'round';
    const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0); ctx.moveTo(0, -a); ctx.lineTo(0, a); ctx.stroke();
  }
  ctx.restore();
}
function nucleo(Z, N, rN, seme) {
  const A = Z + N, rnd = generatore(seme), tipi = [];
  for (let i = 0; i < A; i++) tipi.push(i < Z);
  for (let i = A - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const s = tipi[i]; tipi[i] = tipi[j]; tipi[j] = s; }
  const pts = [];
  for (let i = 0; i < A; i++) { const rr = 1.08 * rN * Math.sqrt(i + .3), a = i * 2.39996323; pts.push({ x: rr * Math.cos(a), y: rr * Math.sin(a), p: tipi[i], rr }); }
  pts.sort((a, b) => b.rr - a.rr);
  return pts;
}
function disegnaNucleo(ctx, pts, cx, cy, rN, al = 1) { if (al > 0) for (const q of pts) nucleone(ctx, [cx + q.x, cy + q.y], q.p, rN, al); }
const SORG = nucleo(14, 16, 9, 7), HE4 = nucleo(2, 2, 18, 4);
function alfa(ctx, x, y, al = 1, r = 9) {   // 2 protoni e 2 neutroni stretti
  nucleone(ctx, [x - r * .8, y - r * .8], false, r, al); nucleone(ctx, [x + r * .8, y + r * .8], false, r, al);
  nucleone(ctx, [x + r * .8, y - r * .8], true, r, al); nucleone(ctx, [x - r * .8, y + r * .8], true, r, al);
}
function elettrone(ctx, x, y, al = 1, r = 10, positivo = false) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (positivo) {   // il positrone: lo stesso elettrone «rovesciato», contorno azzurro e + azzurro (il protone è viola pieno)
    ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  } else { ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = css(positivo ? C.x : C.paper); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * .5, y); ctx.lineTo(x + r * .5, y); if (positivo) { ctx.moveTo(x, y - r * .5); ctx.lineTo(x, y + r * .5); } ctx.stroke();
  ctx.restore();
}
function fotone(ctx, x, y, al = 1, L = 64) {   // un pacchetto d'onda, con la punta
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.y); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 32; i++) { const u = i / 32, xx = x - L + u * L, yy = y + 11 * Math.sin(u * TAU * 2) * Math.sin(u * Math.PI); if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
  ctx.stroke(); arrowHead(ctx, [x + 4, y], 0, C.y, .9); ctx.restore();
}
function puff(ctx, x, y, k, col) {   // l'assorbimento: un anello che si allarga e sparisce
  if (k <= 0 || k >= 1) return;
  ctx.save(); ctx.globalAlpha *= (1 - k); ctx.strokeStyle = css(col); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x, y, 6 + 20 * k, 0, TAU); ctx.stroke(); ctx.restore();
}
// le particelle di una corsia all'istante t: emesse ogni «per» secondi, si fermano allo schermo se c'è quando arrivano
function corsia(ctx, t, c, disegna, col, passa) {
  if (t < c.t0) return;
  const iMax = Math.floor((t - c.t0) / c.per), iMin = Math.max(0, Math.floor((t - c.t0 - (XMAX - X0 + 100) / c.v) / c.per));
  for (let i = iMin; i <= iMax; i++) {
    const te = c.t0 + i * c.per, x = X0 + c.v * (t - te);
    const tArr = te + (c.xs - X0) / c.v, fermata = tArr >= c.ts && !(passa && passa(i));
    const xStop = fermata ? c.xs : XMAX;
    if (x < xStop) disegna(ctx, x, c.y, P(x, X0, X0 + 40, E.lin) * (fermata ? 1 : 1 - P(x, XMAX - 60, XMAX, E.lin)));
    else if (fermata) puff(ctx, c.xs, c.y, (t - tArr) / .4, col);
  }
}
function schermo(ctx, x, sp, k, col, al = 1) {   // uno schermo che cala dall'alto
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col);
  const h = 500 * k; ctx.beginPath(); ctx.roundRect(x - sp / 2, 200, sp, h, Math.min(6, sp / 2)); ctx.fill(); ctx.restore();
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...SX, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DX, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneCorsie(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // la sorgente: un sasso grigio con dentro un nucleo che vibra piano (il moto non è fisica: è solo il «brillare»)
  const ks = P(t, 7.9, 8.5, E.back);
  if (ks > 0) {
    ctx.save(); ctx.translate(XS, YS); ctx.scale(ks, ks);
    ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.beginPath(); ctx.ellipse(0, 0, 70, 215, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 3; ctx.stroke();
    const kb = .5 + .5 * Math.sin(t * 3);
    const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 70); g.addColorStop(0, css(C.y, .35 * kb)); g.addColorStop(1, css(C.y, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill();
    ctx.restore();
    disegnaNucleo(ctx, SORG, XS, YS, 9, ks);
    txt(ctx, 'sorgente', XS, YS + 250, { size: 30, color: C.dim, alpha: P(t, 8.4, 8.9) });
    txt(ctx, 'radioattiva', XS, YS + 284, { size: 30, color: C.dim, alpha: P(t, 8.4, 8.9) });
  }
  // le tre corsie, col nome greco
  const kl = P(t, 12.7, 13.3);
  [[Y_A, 'α', C.v], [Y_B, 'β', C.x], [Y_G, 'γ', C.y]].forEach(([y, s, col], i) => {
    const k = P(t, 12.7 + i * .3, 13.2 + i * .3);
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(C.dim, .35); ctx.lineWidth = 2; ctx.setLineDash([4, 10]);
    ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(XMAX, y); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{m' + (col === C.v ? 'v' : col === C.x ? 'x' : 'y') + ':' + s + '}', X0 + 30, y - 48, { size: 48, alpha: k });
  });
  // gli schermi
  schermo(ctx, X_CARTA, 5, P(t, T_CARTA, T_CARTA + .5, E.out), C.ink, .75);
  schermo(ctx, X_AL, 14, P(t, T_AL, T_AL + .5, E.out), C.dim, .9);
  schermo(ctx, X_PB, SP_PB, P(t, T_PB, T_PB + .6, E.out), C.ink, .85);
  txt(ctx, 'carta', X_CARTA, 740, { size: 30, color: C.dim, alpha: P(t, T_CARTA + .3, T_CARTA + .8) });
  txt(ctx, 'alluminio', X_AL, 740, { size: 30, color: C.dim, alpha: P(t, T_AL + .3, T_AL + .8) });
  txt(ctx, 'pochi mm', X_AL, 772, { size: 30, color: C.dim, alpha: P(t, T_AL + .3, T_AL + .8) });
  txt(ctx, 'piombo', X_PB, 740, { size: 30, color: C.dim, alpha: P(t, T_PB + .3, T_PB + .8) });
  txt(ctx, '3 cm', X_PB, 772, { size: 30, color: C.dim, alpha: P(t, T_PB + .3, T_PB + .8) });
  // le particelle
  corsia(ctx, t, CORSIE.a, (c, x, y, a) => alfa(c, x, y, a), C.v);
  corsia(ctx, t, CORSIE.b, (c, x, y, a) => elettrone(c, x, y, a), C.x);
  corsia(ctx, t, CORSIE.g, (c, x, y, a) => fotone(c, x, y, a), C.y, i => i % 8 === 0);   // (1/2)³: uno su otto passa
  // i fotoni assorbiti nel piombo lasciano un segno dentro lo spessore (a profondità sempre uguali, in ordine fisso)
  const kp = P(t, T_PB + .6, T_PB + 1.0);
  if (kp > 0) drawRich(ctx, '{dim:passa}\n{g:1 su 8}', 1140, Y_G - 80, { size: 30, alpha: kp * P(t, 71.0, 71.5), lh: 1.25 });
  ctx.restore();
}

// ---------- il pannello a destra ----------
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1290, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
// notazione ᴬ_Z X: restituisce la larghezza; se misura = true non disegna
function nuclide(ctx, A, Z, sym, x, y, size, al = 1, col, misura = false) {
  const sz = Math.round(size * .52), c = col || C.ink;
  ctx.save(); ctx.font = `600 ${sz}px Lexend, "Segoe UI", sans-serif`;
  const wn = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
  ctx.font = `600 ${size}px Lexend, "Segoe UI", sans-serif`; const ws = ctx.measureText(sym).width;
  ctx.restore();
  if (!misura && al > 0) {
    txt(ctx, String(A), x + wn, y - size * .3, { size: sz, color: c, align: 'right', alpha: al });
    txt(ctx, String(Z), x + wn, y + size * .32, { size: sz, color: c, align: 'right', alpha: al });
    txt(ctx, sym, x + wn + 5, y, { size, weight: 600, color: c, align: 'left', alpha: al });
  }
  return wn + 5 + ws;
}
// l'antineutrino: ν con la barra disegnata (il trattino combinante ̄ esce storto con certi font); restituisce la larghezza
function nuBar(ctx, x, y, size, al = 1, misura = false) {
  ctx.save(); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`; const w = ctx.measureText('ν').width; ctx.restore();
  if (!misura && al > 0) {
    txt(ctx, 'ν', x, y, { size, color: C.dim, align: 'left', alpha: al });
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = Math.max(2, size * .07); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + w * .12, y - size * .42); ctx.lineTo(x + w * .88, y - size * .42); ctx.stroke(); ctx.restore();
  }
  return w;
}
// una reazione in riga, centrata: pezzi = [{A, Z, s, col}], {nu: true} (antineutrino) oppure stringhe ('→', '+', 'e⁻'…)
function reazione(ctx, pezzi, cx, y, size, al = 1) {
  if (al <= 0) return;
  const gap = size * .35;
  const ws = pezzi.map(p => typeof p === 'string' ? (ctx.save(), ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`, (w => (ctx.restore(), w))(ctx.measureText(p.replace(/\{[a-z]+:|\}/g, '')).width)) : p.nu ? nuBar(ctx, 0, 0, size, 0, true) : nuclide(ctx, p.A, p.Z, p.s, 0, 0, size, 0, null, true));
  const tot = ws.reduce((s, w) => s + w, 0) + gap * (pezzi.length - 1);
  let x = cx - tot / 2;
  pezzi.forEach((p, i) => {
    if (typeof p === 'string') drawRich(ctx, p, x, y, { size, align: 'left', alpha: al });
    else if (p.nu) nuBar(ctx, x, y, size, al);
    else nuclide(ctx, p.A, p.Z, p.s, x, y, size, al, p.col);
    x += ws[i] + gap;
  });
}
function scenePannello(ctx, t) {
  // alfa (17,4–27,5)
  const a1 = life(t, 17.4, 27.6, .5, .4);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    titoletto(ctx, '{v:alfa}', PX, 170, P(t, 17.5, 18.0));
    disegnaNucleo(ctx, HE4, PX, 262, 18, P(t, 17.8, 18.3, E.back));
    drawRich(ctx, '{dim:un nucleo di} {g:elio}', PX, 340, { size: 34, local: t - 18.2 });
    drawRich(ctx, '2 {v:protoni} + 2 {dim:neutroni}', PX, 390, { size: 34, local: t - 18.8 });
    drawRich(ctx, '{dim:carica +2 (due protoni)}', PX, 440, { size: 34, local: t - 20.4 });
    separa(ctx, 486, P(t, 22.4, 22.8));
    drawRich(ctx, '{dim:il nucleo che resta:}', PX, 530, { size: 32, local: t - 22.5 });
    drawRich(ctx, '{mink:Z} − 2{dim:,} {mink:A} − 4', PX, 585, { size: 40, local: t - 23.4 });
    reazione(ctx, [{ A: 238, Z: 92, s: 'U' }, '→', { A: 234, Z: 90, s: 'Th' }, '+', { A: 4, Z: 2, s: 'He', col: C.v }], PX, 680, 40, P(t, 24.6, 25.1));
    drawRich(ctx, '{dim:uranio → torio + alfa}', PX, 745, { size: 30, local: t - 25.4 });
    ctx.restore();
  }
  // beta (27,6–47)
  const a2 = life(t, 27.6, 47.0, .5, .4);
  if (a2 > 0) {
    ctx.save(); ctx.globalAlpha *= a2;
    titoletto(ctx, '{x:beta}', PX, 170, P(t, 27.7, 28.2));
    elettrone(ctx, PX, 240, P(t, 28.0, 28.4), 16);
    drawRich(ctx, '{dim:un} {x:elettrone}{dim:, carica negativa}', PX, 300, { size: 34, local: t - 28.3 });
    separa(ctx, 342, P(t, 32.4, 32.8));
    drawRich(ctx, '{dim:nasce nel nucleo:}', PX, 384, { size: 32, local: t - 32.5 });
    // n → p + e⁻ + antineutrino
    const kn = P(t, 33.2, 33.7);
    if (kn > 0) {
      nucleone(ctx, [1340, 440], false, 18, kn); drawRich(ctx, '→', 1395, 440, { size: 36, alpha: kn });
      nucleone(ctx, [1450, 440], true, 18, kn); drawRich(ctx, '+', 1500, 440, { size: 36, alpha: kn });
      elettrone(ctx, 1550, 440, kn, 13); drawRich(ctx, '+', 1600, 440, { size: 36, alpha: kn });
      nuBar(ctx, 1638, 440, 40, kn);
      const ka = P(t, 33.6, 34.1), wn = nuBar(ctx, 0, 0, 30, 0, true);
      nuBar(ctx, PX - 120, 486, 30, ka);
      txt(ctx, '= antineutrino', PX - 120 + wn + 10, 486, { size: 30, color: C.dim, align: 'left', alpha: ka });
    }
    separa(ctx, 520, P(t, 37.4, 37.8));
    drawRich(ctx, '{mink:Z} + 1{dim:,} {mink:A} {dim:uguale}', PX, 566, { size: 40, local: t - 37.5 });
    reazione(ctx, [{ A: 14, Z: 6, s: 'C' }, '→', { A: 14, Z: 7, s: 'N' }, '+', '{x:e⁻}', '+', { nu: true }], PX, 640, 40, P(t, 38.6, 39.1));
    separa(ctx, 690, P(t, 42.2, 42.6));
    const kb = P(t, 42.3, 42.8);
    elettrone(ctx, 1330, 740, kb, 13, true);
    drawRich(ctx, '{dim:beta più: un} {x:positrone}{dim:,} {mink:Z} − 1', 1365, 740, { size: 30, align: 'left', alpha: kb });
    ctx.restore();
  }
  // gamma (47–56,3)
  const a3 = life(t, 47.0, 56.4, .5, .4);
  if (a3 > 0) {
    ctx.save(); ctx.globalAlpha *= a3;
    titoletto(ctx, '{y:gamma}', PX, 170, P(t, 47.1, 47.6));
    fotone(ctx, PX + 50, 245, P(t, 47.4, 47.8), 100);
    drawRich(ctx, '{dim:un} {y:fotone}{dim:: luce di}', PX, 320, { size: 34, local: t - 47.8 });
    drawRich(ctx, '{dim:altissima energia}', PX, 368, { size: 34, local: t - 48.3 });
    drawRich(ctx, '{dim:carica 0, massa 0}', PX, 440, { size: 34, local: t - 49.6 });
    separa(ctx, 486, P(t, 51.8, 52.2));
    drawRich(ctx, '{mink:Z} {dim:e} {mink:A} {dim:non cambiano}', PX, 540, { size: 40, local: t - 51.9 });
    drawRich(ctx, '{dim:il nucleo perde solo}\n{g:energia}', PX, 640, { size: 34, local: t - 53.2, lh: 1.35 });
    ctx.restore();
  }
  // gli schermi (56,4–81)
  const a4 = life(t, 56.4, T_FINE + .1, .5, .4);
  if (a4 > 0) {
    ctx.save(); ctx.globalAlpha *= a4;
    titoletto(ctx, 'tre schermi', PX, 170, P(t, 56.5, 57.0));
    drawRich(ctx, '{mv:α}{dim:: un foglio di} {g:carta}', PX, 250, { size: 34, local: t - 56.8 });
    drawRich(ctx, '{dim:(in aria: pochi cm)}', PX, 296, { size: 30, local: t - 59.0 });
    separa(ctx, 336, P(t, 61.5, 61.9));
    drawRich(ctx, '{mx:β}{dim:: pochi mm di} {g:alluminio}', PX, 384, { size: 34, local: t - 61.7 });
    separa(ctx, 428, P(t, 66.3, 66.7));
    drawRich(ctx, '{my:γ}{dim:: cm di} {g:piombo}', PX, 476, { size: 34, local: t - 66.5 });
    drawRich(ctx, '{dim:che} {g:attenua}{dim:, non ferma}', PX, 524, { size: 32, local: t - 71.0 });
    drawRich(ctx, '{dim:≈ 1 cm ne dimezza}', PX, 572, { size: 32, local: t - 72.4 });
    drawRich(ctx, '3 cm → (1/2)³ = {g:1 su 8}', PX, 622, { size: 34, local: t - 73.2 });
    separa(ctx, 668, P(t, 75.3, 75.7));
    drawRich(ctx, '{dim:le alfa si fermano subito:}\n{dim:tutta l’energia in un punto}', PX, 726, { size: 30, local: t - 75.5, lh: 1.3 });
    ctx.restore();
  }
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Alfa, beta, gamma', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 90.0, 91.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Alfa, beta, gamma: un nucleo di elio,\nun elettrone, un fotone.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mv:α}{dim:: la ferma la} carta\n{mink:Z} − 2, {mink:A} − 4'], [960, '{mx:β}{dim:: pochi mm di} alluminio\n{mink:Z} + 1 {dim:(o − 1)}, {mink:A} uguale'], [1470, '{my:γ}{dim:: cm di} piombo {dim:(attenua)}\n{mink:Z} {dim:e} {mink:A} uguali']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // le particelle scorrono di continuo: un tono breve sulla prima di ogni corsia (alfa in alto, gamma in basso);
  // i pop sugli schermi cadono sul primo assorbimento, calcolato da emissione, velocità e posizione dello schermo
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 7.9, .45],                                               // la sorgente
    ['traccia', 12.7, 13.8],                                                          // le tre corsie
    ['soffio', 17.5], ['pop', 17.8, .6], ['tono', 17.6, 18.6, [.7, .8]],              // alfa: il nucleo di elio parte
    ['pop', 23.4, .45], ['pop', 24.6, .5],                                            // Z meno 2, A meno 4; uranio, torio
    ['soffio', 27.6], ['pop', 28.0, .5], ['tono', 27.7, 28.7, [.45, .55]],            // beta: l'elettrone
    ['pop', 33.2, .5],                                                                // il neutrone diventa protone
    ['pop', 37.5, .55], ['pop', 38.6, .5],                                            // Z più 1; carbonio, azoto
    ['pop', 42.3, .6],                                                                // il positrone
    ['soffio', 47.1], ['pop', 47.4, .5], ['tono', 47.1, 48.1, [.2, .3]],              // gamma: il fotone
    ['pop', 51.9, .45], ['pop', 53.2, .55],                                           // Z e A uguali, solo energia
    ['soffio', 56.5], ['tono', 56.6, 57.1, [.9, .4]], ['pop', 57.09, .75],            // la carta cala e ferma le alfa
    ['tono', 61.7, 62.2, [.9, .4]], ['pop', 62.02, .5],                               // l'alluminio ferma le beta
    ['tono', 66.5, 67.1, [.9, .4]], ['pop', 66.84, .25],                              // il piombo
    ['pop', 71.0, .5], ['ding', 73.2],                                                // passa 1 su 8
    ['pop', 75.5, .4],                                                                // le alfa si fermano subito
    ['soffio', 81.2], ['pop', 83.2, .5], ['pop', 83.7, .6], ['pop', 84.2, .7],        // in una frase
  ];
  return {
    titolo: 'Alfa, beta, gamma', durata: 92, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 56.3, 'tre radiazioni'], [56.3, T_FINE, 'tre schermi']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCorsie(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
