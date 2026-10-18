'use strict';
/* Schiacciare un gas — la siringa tappata col manometro: a temperatura costante e con la stessa quantità di gas
   p·V resta costante (legge di Boyle): volume metà, pressione doppia; gli stati stanno su un'iperbole. Argomento: gas. */
CVIDEO.registra('gas/boyle', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const T_FINE = 76.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.6, 'pensa'], [26.4, 'sorpreso'],
  [28.8, 'neutro'], [33.2, 'felice'], [35.6, 'neutro'], [41.8, 'pensa'], [47.0, 'felice'], [49.4, 'neutro'],
  [57.0, 'felice'], [59.4, 'neutro'], [78.2, 'felice'], [81.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Che cosa succede a un gas\nquando lo schiacci?'],
  [7.9, 12.5, 'Una siringa d’aria, chiusa da un\nmanometro: segna la pressione {v:assoluta}.'],
  [12.7, 17.0, 'Il gas non può uscire: la sua\nquantità resta la stessa.'],
  [17.2, 21.4, '40 mL d’aria a 100 kPa,\ncirca la pressione atmosferica.'],
  [21.6, 26.2, 'Spingo {v:piano piano}: la temperatura\nresta 20 °C, come la stanza.'],
  [26.4, 30.8, 'Volume {x:metà}, 20 mL:\npressione {g:doppia}, 200 kPa.'],
  [33.2, 36.8, 'Ancora metà, 10 mL:\n{g:400 kPa}.'],
  [37.0, 41.6, 'Le stesse molecole in meno spazio\nurtano le pareti più spesso.'],
  [41.8, 46.6, 'Tiro fino a 80 mL, il doppio di 40:\npressione metà, {g:50 kPa}.'],
  [47.0, 51.8, 'Pressione per volume:\n{mv:p}·{mink:V} = 4000 kPa·mL, {g:sempre}.'],
  [52.0, 56.8, 'È la legge di {v:Boyle}: a temperatura\ncostante, {mv:p}·{mink:V} è costante.'],
  [57.0, 61.4, 'Sul grafico {mv:p}–{mink:V} gli stati stanno\nsu un’{y:iperbole}.'],
  [61.6, 66.2, 'Ogni posizione del pistone\nè un punto della curva.'],
  [66.4, 71.0, 'Pressione e volume sono\n{v:inversamente proporzionali}.'],
  [71.2, 75.8, 'Vale solo a temperatura costante\ne con la stessa quantità di gas.'],
  [78.2, 83.6, 'A temperatura costante, volume\nmetà vuol dire pressione doppia.'],
];

// ---------- aiutanti ----------
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
// numeri «a caso» ma sempre gli stessi: mulberry32 con un seme fisso
function generatore(seme) {
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const tri = s => { const u = ((s % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // va e viene fra 0 e 1: il rimbalzo elastico

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Schiacciare un gas', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la siringa: 9 px per mL; il volume lo decide la mano, piano piano (temperatura costante) ----------
const XT = 300, Y0 = 345, HB = 150, PXML = 9, R = 7;
// la seconda spinta (20 → 10 mL) avviene fra due fumetti: quando Stilla dice «400 kPa» il pistone è già fermo
const VOL = [[0, 40], [22.0, 40], [25.0, 20], [31.0, 20], [33.0, 10], [42.0, 10], [44.4, 80], [61.8, 80], [65.6, 20]];
const volume = t => kf(t, VOL);
const pressione = V => 4000 / V;                     // kPa: p·V = 100 kPa · 40 mL
// le molecole: velocità che non cambiano (la temperatura resta la stessa); rimbalzi elastici sulle pareti.
// In orizzontale lo spazio cambia col pistone: la fase avanza di v·dt / (L − 2r), sommata una volta sola in una tabella
const N = 40, DT = .005, T_MAX = 90;
let PSI = null, MOL = null;
function prepara() {
  if (PSI) return;
  PSI = new Float64Array(Math.ceil(T_MAX / DT) + 2);
  for (let i = 1; i < PSI.length; i++) PSI[i] = PSI[i - 1] + DT / (volume((i - .5) * DT) * PXML - 2 * R);
  const rnd = generatore(20261006);
  MOL = Array.from({ length: N }, () => { const v = 110 + 90 * rnd(), a = rnd() * Math.PI * 2; return { u: rnd() * 2, w: rnd() * 2, vx: v * Math.cos(a), vy: v * Math.sin(a) }; });
}
const psi = t => { const f = clamp(t, 0, T_MAX) / DT, i = Math.floor(f); return lerp(PSI[i], PSI[i + 1], f - i); };
function manometro(ctx, x, y, p) {
  ctx.save();
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x, y, 62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  for (let k = 0; k <= 9; k++) { const a = Math.PI * .75 + k / 9 * Math.PI * 1.5; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 50, y + Math.sin(a) * 50); ctx.lineTo(x + Math.cos(a) * 58, y + Math.sin(a) * 58); ctx.stroke(); }
  // la lancetta: da 0 a 450 kPa su tre quarti di giro
  const a = Math.PI * .75 + clamp(p / 450) * Math.PI * 1.5;
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 44, y + Math.sin(a) * 44); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function siringa(ctx, t, V) {
  const xp = XT + V * PXML;
  // il gas e le molecole
  ctx.fillStyle = css(C.v, .06); ctx.fillRect(XT, Y0, xp - XT, HB);
  const ps = psi(t);
  ctx.fillStyle = css(C.v, .8);
  for (const m of MOL) {
    const x = XT + R + (xp - XT - 2 * R) * tri(m.u + m.vx * ps), y = Y0 + R + (HB - 2 * R) * tri(m.w + m.vy * t / (HB - 2 * R));
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
  }
  // il cilindro con la scala in mL
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(1070, Y0 - 3); ctx.lineTo(XT, Y0 - 3); ctx.lineTo(XT, 405); ctx.lineTo(258, 405); ctx.moveTo(258, 435); ctx.lineTo(XT, 435); ctx.lineTo(XT, Y0 + HB + 3); ctx.lineTo(1070, Y0 + HB + 3); ctx.stroke();
  ctx.fillStyle = css(C.v, .06); ctx.fillRect(258, 405, XT - 258, 30);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  for (let v = 10; v <= 80; v += 10) { const x = XT + v * PXML; ctx.beginPath(); ctx.moveTo(x, Y0 - 3); ctx.lineTo(x, Y0 - (v % 20 ? 14 : 22)); ctx.stroke(); }
  for (let v = 20; v <= 80; v += 20) txt(ctx, String(v), XT + v * PXML, Y0 - 44, { size: 30, color: C.dim });
  txt(ctx, 'mL', 1150, Y0 - 44, { size: 30, color: C.dim });
  // il pistone e lo stantuffo
  ctx.fillStyle = css(mix(C.ink, C.paper, .25)); ctx.fillRect(xp, Y0, 22, HB);
  ctx.fillStyle = css(C.dim); ctx.fillRect(xp + 22, 410, 140, 20); ctx.fillRect(xp + 162, 360, 14, 120);
}

// 1–2 · la siringa e la legge di Boyle (7,5–76,2)
const COL = [500, 680, 860, 1040], T_STATI = [17.2, 26.4, 33.0, 44.4];
const STATI = [[40, 100], [20, 200], [10, 400], [80, 50]];
// il grafico p–V: 4,78 px per mL, 1,07 px per kPa
const GO = [1340, 700], GX = 430 / 90, GY = 440 / 450;
const gp = (V, p) => [GO[0] + V * GX, GO[1] - p * GY];
function scenaSiringa(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  prepara();
  const ka = life(t, 7.6, T_FINE + .1, .6, .5), V = volume(t), p = pressione(V);
  card(ctx, 110, 110, 1100, 680, ka); card(ctx, 1250, 110, 560, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  siringa(ctx, t, V);
  manometro(ctx, 195, 420, p);
  txt(ctx, Math.round(p) + ' kPa', 195, 520, { size: 36, color: C.v, alpha: P(t, 17.3, 17.8) });
  txt(ctx, 'manometro', 195, 315, { size: 30, color: C.dim, alpha: P(t, 8.0, 8.5) * (1 - P(t, 17.0, 17.3)) });
  drawRich(ctx, '{dim:temperatura} {y:20 °C}', 1180, 160, { size: 32, align: 'right', alpha: P(t, 21.7, 22.2) });
  // la tabella degli stati
  ctx.save(); ctx.globalAlpha *= P(t, 17.3, 17.8);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, 568); ctx.lineTo(1170, 568); ctx.stroke();
  drawRich(ctx, '{mink:V}', 170, 615, { size: 38, align: 'left' }); drawRich(ctx, '{mv:p}', 170, 680, { size: 38, align: 'left' });
  ctx.restore();
  drawRich(ctx, '{mv:p}{mink:·V}{dim: (kPa·mL)}', 170, 745, { size: 38, align: 'left', alpha: P(t, 47.1, 47.6) });
  STATI.forEach(([v, pr], i) => {
    const k = P(t, T_STATI[i], T_STATI[i] + .5);
    txt(ctx, v + ' mL', COL[i], 615, { size: 34, alpha: k });
    txt(ctx, pr + ' kPa', COL[i], 680, { size: 34, color: C.v, alpha: k });
    txt(ctx, '4000', COL[i], 745, { size: 34, color: C.g, alpha: P(t, 47.3 + .3 * i, 47.8 + .3 * i) });
  });
  // il grafico p–V
  ctx.save(); ctx.globalAlpha *= P(t, 17.3, 17.8);
  titoletto(ctx, 'stati del gas', 1530, 150);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let v = 20; v <= 80; v += 20) { ctx.beginPath(); ctx.moveTo(gp(v, 0)[0], GO[1]); ctx.lineTo(gp(v, 0)[0], gp(0, 450)[1]); ctx.stroke(); }
  for (let q = 100; q <= 400; q += 100) { ctx.beginPath(); ctx.moveTo(GO[0], gp(0, q)[1]); ctx.lineTo(gp(88, 0)[0], gp(0, q)[1]); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GO[0], gp(0, 470)[1]); ctx.lineTo(...GO); ctx.lineTo(gp(92, 0)[0], GO[1]); ctx.stroke();
  arrowHead(ctx, [GO[0], gp(0, 470)[1] - 6], -Math.PI / 2, C.ink); arrowHead(ctx, [gp(92, 0)[0] + 6, GO[1]], 0, C.ink);
  for (let v = 20; v <= 80; v += 20) txt(ctx, String(v), gp(v, 0)[0], GO[1] + 30, { size: 29, color: C.dim });
  for (let q = 100; q <= 400; q += 100) txt(ctx, String(q), GO[0] - 14, gp(0, q)[1], { size: 29, color: C.dim, align: 'right' });
  drawRich(ctx, '{mv:p}{dim: (kPa)}', GO[0] + 18, gp(0, 470)[1] - 4, { size: 34, align: 'left' });
  drawRich(ctx, '{mink:V}{dim: (mL)}', 1775, GO[1] + 66, { size: 34, align: 'right' });
  ctx.restore();
  // l'iperbole p = 4000 / V
  const ki = P(t, 57.2, 58.6);
  if (ki > 0) {
    const pts = []; for (let i = 0; i <= 120; i++) { const v = lerp(8.9, 88, i / 120); pts.push(gp(v, 4000 / v)); }
    M.glowStroke(ctx, pts, ki, C.y, 5);
    drawRich(ctx, '{mv:p}{mink:·V = 4000}', gp(48, 300)[0], gp(48, 300)[1], { size: 34, alpha: P(t, 58.2, 58.7) });
  }
  STATI.forEach(([v, pr], i) => M.dot(ctx, gp(v, pr), C.v, P(t, T_STATI[i], T_STATI[i] + .5, E.back), 9));
  if (t > 17.2) M.dot(ctx, gp(V, p), C.g, P(t, 17.2, 17.7), 11);
  ctx.restore();
}

// in una frase (76,2–86,6)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 84.7, 85.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 76.4 });
    drawRich(ctx, 'A temperatura costante,\n{mv:p}{mink:·V} resta {g:costante}.', W / 2, 290, { size: 70, weight: 600, local: t - 76.8, stagger: .09 });
  });
  const pills = [[490, 'volume metà,\npressione {g:doppia}'], [960, 'grafico {mv:p}–{mink:V}:\nun’{y:iperbole}'], [1430, 'stessa quantità di gas,\nstessa temperatura']];
  pills.forEach(([x, s], i) => {
    const a = 78.6 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['pop', 8.0, .35],                                               // la siringa, il manometro
    ['pop', 17.3, .4], ['pop', 21.7, .35],                                            // 40 mL a 100 kPa, 20 °C
    ['tono', 22.0, 25.0, [.25, .25, .26, .28, .33, .41, .47, .5, .5]], ['pop', 26.4, .5], ['ding', 26.9],   // volume metà: 200 kPa
    ['tono', 31.0, 33.0, [.5, .5, .52, .56, .67, .83, .94, .99, 1]], ['pop', 33.0, .6],     // ancora metà: 400 kPa
    ['tono', 42.0, 44.4, [1, .95, .7, .4, .22, .15, .13, .13, .13]], ['pop', 44.4, .3],      // tiro a 80 mL: 50 kPa
    ['pop', 47.3, .5], ['pop', 47.6, .5], ['pop', 47.9, .5], ['pop', 48.2, .5], ['ding', 48.7],   // p·V = 4000, sempre
    ['traccia', 57.2, 58.6], ['tono', 57.2, 58.6, [1, 1, .72, .39, .21, .14, .12, .11, .11]], ['pop', 58.2, .5],   // l'iperbole
    ['tono', 61.8, 65.6, [.13, .13, .13, .15, .2, .31, .42, .49, .5]], ['pop', 65.6, .45],  // il pistone scorre sulla curva
    ['soffio', 76.4], ['pop', 78.6, .5], ['pop', 79.1, .6], ['pop', 79.6, .7],        // in una frase
  ];
  return {
    titolo: 'Schiacciare un gas', durata: 86.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 46.8, 'la siringa tappata'], [46.8, T_FINE, 'la legge di Boyle']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSiringa(ctx, t); scenaFine(ctx, t); },
  };
});
