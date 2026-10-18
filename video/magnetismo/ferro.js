'use strict';
/* Perché la calamita prende il ferro e non il rame — l'esperimento di Faraday (1845), visto dall'alto: sbarrette appese a
   un filo fra due poli appuntiti, partono a 45°. Acceso il campo, il ferro si allinea di scatto, l'alluminio si allinea
   piano, il rame si mette di traverso (le sue estremità vanno dove il campo è più debole). Rotazioni integrate:
   θ'' = −(ω₀²/2)·sin 2(θ − θ_eq) − 2ζω₀·θ'. Il rapporto fra i tempi di alluminio e rame viene da χ/densità
   (alluminio 2,2·10⁻⁵ / 2700, rame 9,6·10⁻⁶ / 8960: rapporto 7,6, tempi in rapporto √7,6 ≈ 2,76). Poi dentro la materia:
   gli elettroni come piccole correnti; nel rame si compensano e il campo ne induce uno piccolo opposto (diamagnetismo, in
   tutti i materiali); nell'alluminio gli atomi sono calamite orientate a caso, il campo le allinea poco (paramagnetismo;
   l'allineamento disegnato è ingrandito); nel ferro i domini di Weiss, che col campo crescono (pareti che si spostano) e
   poi ruotano. Permeabilità relativa: rame 0,99999, alluminio 1,00002, ferro da centinaia a migliaia. Il rame non è
   «non magnetico»: è debolmente diamagnetico. Colori fissi del magnetismo: nord pieno scuro, sud chiaro col bordo, campo B C.g.
   Argomento: magnetismo. */
CVIDEO.registra('magnetismo/ferro', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 92.3;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.1, 'sorpreso'], [20.3, 'neutro'],
  [28.1, 'sorpreso'], [30.4, 'neutro'], [33.5, 'felice'], [35.8, 'neutro'], [49.1, 'sorpreso'], [51.4, 'neutro'],
  [54.5, 'pensa'], [59.7, 'neutro'], [70.5, 'felice'], [72.8, 'neutro'], [81.1, 'festa'], [83.6, 'felice'],
  [86.5, 'neutro'], [94.7, 'felice'], [98.7, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché la calamita attira il ferro\ne non il rame?'],
  [7.9, 14.2, 'Come Faraday nel 1845: sbarrette appese\na un filo fra due poli, viste dall’alto.'],
  [14.3, 18.0, '{g:Ferro}, alluminio e rame.\nAccendo il campo {mg:B}…'],
  [18.1, 22.8, '…il ferro si gira di scatto\nlungo le linee del campo.'],
  [22.9, 28.0, 'Anche l’alluminio si allinea, ma piano:\nè attirato {g:debolmente}.'],
  [28.1, 33.4, 'Il rame invece si mette {g:di traverso}:\nil campo lo respinge, appena appena.'],
  [33.5, 38.6, 'Tre comportamenti: {g:ferromagnetico},\n{g:paramagnetico}, {g:diamagnetico}.'],
  [38.7, 43.8, 'Negli atomi gli elettroni sono\npiccole correnti: piccole calamite.'],
  [43.9, 49.0, 'Nel rame metallico si compensano:\nsenza campo, l’atomo non è una calamita.'],
  [49.1, 54.4, 'Il campo {mg:B} cambia un po’ quelle correnti:\nnasce un campo piccolo, {g:opposto}.'],
  [54.5, 59.6, 'È il {g:diamagnetismo}: c’è in tutti\ni materiali, ma è debolissimo.'],
  [59.7, 65.0, 'Nell’alluminio ogni atomo è una piccola\ncalamita, orientata {g:a caso}.'],
  [65.1, 70.4, 'Il campo le allinea un po’, l’agitazione\ntermica le rimescola: {g:paramagnetismo}.'],
  [70.5, 75.8, 'Nel ferro gli atomi vicini si allineano\nda soli, a gruppi: i {g:domini di Weiss}.'],
  [75.9, 81.0, 'Senza campo i domini puntano in versi\ndiversi: in tutto, niente calamita.'],
  [81.1, 86.4, 'Con il campo crescono i domini allineati\na {mg:B}: il ferro diventa una calamita.'],
  [86.5, 91.8, 'La {g:permeabilità relativa} dice quante\nvolte il materiale moltiplica {mg:B}.'],
  [94.7, 100.9, 'Il rame risponde appena, e al contrario;\nil ferro, con i suoi domini, tantissimo.'],
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
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const CX = [285, 610, 935];
// numeri pseudo-casuali fissi (la scena è una funzione del tempo: un generatore con un seme fisso)
let seme = 7;
const caso = () => { seme = (seme * 16807) % 2147483647; return (seme - 1) / 2147483646; };

// ---------- 1 · l'esperimento di Faraday, visto dall'alto ----------
const YS = 390, T_ON = 16.4;
// θ'' = −(ω₀²/2)·sin 2(θ − θeq) − 2ζω₀·θ' (θ dall'asse dei poli, antiorario), da 45° e ferma; un valore ogni 1/240 s
function oscilla(th0, thEq, w0, z, dur) {
  const tab = [th0]; let th = th0, om = 0; const dt = 1 / 1920;
  for (let i = 0; i < dur * 240; i++) { for (let j = 0; j < 8; j++) { om += (-w0 * w0 / 2 * Math.sin(2 * (th - thEq)) - 2 * z * w0 * om) * dt; th += om * dt; } tab.push(th); }
  return tab;
}
const T_AL = 5, T_CU = T_AL * Math.sqrt(7.6);      // periodi delle piccole oscillazioni: rapporto √(7,6)
const MAT = [
  { nome: 'ferro', tipo: 'ferromagnetico', fa: 'attirato con forza', col: () => mix(C.dim, C.ink, .25), tab: oscilla(Math.PI / 4, 0, TAU / .6, .3, 30) },
  { nome: 'alluminio', tipo: 'paramagnetico', fa: 'attirato debolmente', col: () => mix(C.dim, C.paper, .5), tab: oscilla(Math.PI / 4, 0, TAU / T_AL, .2, 30) },
  { nome: 'rame', tipo: 'diamagnetico', fa: 'respinto debolmente', col: () => C.y, tab: oscilla(Math.PI / 4, Math.PI / 2, TAU / T_CU, .17, 30) },
];
const angolo = (m, t) => { const s = t - T_ON; if (s <= 0) return Math.PI / 4; const i = Math.min(m.tab.length - 1, s * 240), i0 = Math.floor(i), i1 = Math.min(m.tab.length - 1, i0 + 1); return lerp(m.tab[i0], m.tab[i1], i - i0); };
function poli(ctx, c, al) {
  for (const s of [-1, 1]) {
    const pts = [[150, -60], [110, -60], [75, -10], [75, 10], [110, 60], [150, 60]].map(([x, y]) => [c + s * x, YS + y]);
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(s < 0 ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3;
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, s < 0 ? 'N' : 'S', c + s * 128, YS + 2, { size: 40, weight: 600, color: s < 0 ? C.paper : C.ink, alpha: al });
  }
}
function lineePoli(ctx, c, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(COL_B()); ctx.lineWidth = 3; ctx.lineCap = 'round';
  [[0, 0], [9, 50], [-9, -50], [20, 100], [-20, -100]].forEach(([o1, o2]) => {
    ctx.beginPath(); ctx.moveTo(c - 75, YS + o1); ctx.quadraticCurveTo(c, YS + o2, c + 75, YS + o1); ctx.stroke();
  });
  ctx.restore();
  [[9, 50], [-9, -50], [20, 100], [-20, -100]].forEach(([o1, o2]) => { ctx.save(); ctx.globalAlpha *= k; arrowHead(ctx, [c + 4, YS + .5 * (o1 + o2)], 0, COL_B(), .8); ctx.restore(); });
}
function sbarretta(ctx, c, th, col, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(c, YS); ctx.rotate(-th);
  ctx.fillStyle = css(col); ctx.strokeStyle = css(mix(C.ink, C.paper, .2)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-56, -9, 112, 18, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.fill();
  ctx.restore();
}
function sceneFaraday(ctx, t) {
  const al = life(t, 7.8, 38.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kB = P(t, T_ON - .2, T_ON + .4);
  MAT.forEach((m, i) => {
    const c = CX[i], ka = P(t, 8.2 + i * .3, 8.7 + i * .3);
    poli(ctx, c, ka);
    lineePoli(ctx, c, kB);
    sbarretta(ctx, c, angolo(m, t), m.col(), ka);
    conFont(TITOLI, () => drawRich(ctx, m.nome, c, 525, { size: 36, weight: 600, alpha: P(t, 14.4 + i * .4, 14.9 + i * .4) }));
    drawRich(ctx, '{g:' + m.tipo + '}', c, 572, { size: 30, alpha: P(t, 33.7 + i * .5, 34.2 + i * .5) });
  });
  // la stessa cosa vista di lato: il filo, la sbarretta, i due poli
  const kL = P(t, 8.0, 8.6);
  if (kL > 0) {
    const yl = 236;
    ctx.save(); ctx.globalAlpha *= kL; ctx.lineCap = 'round';
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(560, 140); ctx.lineTo(660, 140); ctx.stroke();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(610, 140); ctx.lineTo(610, yl - 7); ctx.stroke();
    ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3;
    ctx.fillStyle = css(C.ink); ctx.fillRect(460, yl - 30, 75, 60); ctx.strokeRect(460, yl - 30, 75, 60);
    ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.fillRect(685, yl - 30, 75, 60); ctx.strokeRect(685, yl - 30, 75, 60);
    ctx.fillStyle = css(mix(C.dim, C.paper, .4)); ctx.strokeStyle = css(mix(C.ink, C.paper, .2)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(554, yl - 7, 112, 14, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
    txt(ctx, 'N', 497, yl + 1, { size: 32, weight: 600, color: C.paper, alpha: kL });
    txt(ctx, 'S', 722, yl + 1, { size: 32, weight: 600, color: C.ink, alpha: kL });
    drawRich(ctx, '{dim:di lato}', 420, yl, { size: 30, align: 'right', alpha: kL });
    drawRich(ctx, '{dim:dall’alto}', 160, 290, { size: 30, align: 'left', alpha: kL });
  }
  // il campo acceso
  freccia(ctx, [460, 690], [760, 690], COL_B(), kB, 6);
  drawRich(ctx, '{mg:B}', 790, 690, { size: 40, align: 'left', alpha: kB });
  ctx.restore();
}

// ---------- 2 · dentro la materia ----------
const T_BD = 49.4, T_BP = 65.3, T_BF = 81.3;     // quando si accende il campo in ciascuna colonna
const ATOMI = [];
for (let r = 0; r < 7; r++) for (let q = 0; q < 5; q++) ATOMI.push({ x: (q - 2) * 56, y: 236 + r * 58, f: (caso() * 2 - 1) * Math.PI, a: caso() * TAU, b: caso() * TAU });
// il ferro: celle in una griglia di 8 colonne e 12 righe, divise in domini (diagramma di Voronoi con pesi: il dominio allineato a B cresce)
// quattro domini scelti in modo che, senza campo, le frecce si compensino esattamente (somma zero)
const SEMI = [{ p: [-60, 280], d: 0 }, { p: [65, 270], d: Math.PI / 2 }, { p: [-55, 520], d: Math.PI }, { p: [60, 530], d: -Math.PI / 2 }];
const CELLE = [];
for (let r = 0; r < 12; r++) for (let q = 0; q < 8; q++) CELLE.push({ x: (q - 3.5) * 34, y: 228 + r * 34, q, r });
function dominio(cel, kG) {
  let best = 0, bv = 1e18;
  SEMI.forEach((s, i) => { const w = s.d === 0 ? 70000 * kG : s.d === Math.PI ? -30000 * kG : 0; const v = Math.pow(cel.x - s.p[0], 2) + Math.pow(cel.y - s.p[1], 2) - w; if (v < bv) { bv = v; best = i; } });
  return best;
}
function atomo(ctx, p, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(p[0], p[1], 17, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function frecciaAtomo(ctx, p, ang, L, col, al, w = 4) {
  if (al <= 0 || L < 2) return;
  const u = [Math.cos(ang), -Math.sin(ang)];
  freccia(ctx, [p[0] - u[0] * L / 2, p[1] - u[1] * L / 2], [p[0] + u[0] * L / 2, p[1] + u[1] * L / 2], col, al, w);
}
function campoColonna(ctx, c, kOn, kVis) {
  if (kVis <= 0) return;
  freccia(ctx, [c - 100, 690], [c + 90, 690], COL_B(), kVis * kOn, 6);
  drawRich(ctx, '{mg:B}', c + 112, 690, { size: 38, align: 'left', alpha: kVis * kOn });
  txt(ctx, 'campo spento', c, 690, { size: 30, color: C.dim, alpha: kVis * (1 - kOn) });
}
function sceneMateria(ctx, t) {
  const al = life(t, 38.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ['rame', 'alluminio', 'ferro'].forEach((n, i) => {
    const c = CX[i];
    ctx.save(); ctx.strokeStyle = css(C.panelEdge); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(c - 150, 195, 300, 450, 16); ctx.stroke(); ctx.restore();
    conFont(TITOLI, () => drawRich(ctx, n, c, 158, { size: 36, weight: 600 }));
  });
  // rame: atomi senza campo proprio; col campo un piccolo campo opposto
  const kD = P(t, 44.0, 44.6), kBd = P(t, T_BD, T_BD + .8);
  ATOMI.forEach(a => { const p = [CX[0] + a.x, a.y]; atomo(ctx, p, kD); frecciaAtomo(ctx, p, Math.PI, 20 * kBd, C.ink, kD * kBd, 3.5); });
  campoColonna(ctx, CX[0], kBd, kD);
  // alluminio: calamite a caso che si agitano; col campo si allineano un po' (ingrandito)
  const kP = P(t, 59.8, 60.4), kBp = P(t, T_BP, T_BP + 1.2);
  ATOMI.forEach((a, i) => {
    const p = [CX[1] + a.x, a.y];
    let f = a.f + .45 * Math.sin(2.1 * t + a.a) + .3 * Math.sin(3.3 * t + a.b);
    f = Math.atan2(Math.sin(f), Math.cos(f)) * (1 - .5 * kBp);
    atomo(ctx, p, kP); frecciaAtomo(ctx, p, f, 26, C.ink, kP, 3.5);
  });
  campoColonna(ctx, CX[1], kBp, kP);
  txt(ctx, 'allineamento ingrandito', CX[1], 740, { size: 30, color: C.dim, alpha: kP * kBp });
  // ferro: i domini di Weiss; col campo cresce quello allineato, poi gli altri ruotano
  const kF = P(t, 70.6, 71.2), kG = P(t, T_BF + .2, T_BF + 2.4), kR = P(t, T_BF + 2.4, T_BF + 3.8);
  if (kF > 0) {
    const dom = CELLE.map(cel => dominio(cel, kG)), at = (q, r) => (q < 0 || q > 7 || r < 0 || r > 11) ? -1 : dom[r * 8 + q];
    ctx.save(); ctx.globalAlpha *= kF;
    CELLE.forEach((cel, i) => {
      const p = [CX[2] + cel.x, cel.y], d = SEMI[dom[i]].d;
      if (d === 0) { ctx.fillStyle = css(C.g, .14); ctx.fillRect(p[0] - 17, p[1] - 17, 34, 34); }
    });
    // le pareti fra domini (spariscono quando tutto è allineato)
    ctx.globalAlpha *= 1 - .8 * kR;
    ctx.strokeStyle = css(mix(C.ink, C.paper, .3)); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
    CELLE.forEach((cel, i) => {
      const p = [CX[2] + cel.x, cel.y];
      if (at(cel.q + 1, cel.r) >= 0 && at(cel.q + 1, cel.r) !== dom[i]) { ctx.moveTo(p[0] + 17, p[1] - 17); ctx.lineTo(p[0] + 17, p[1] + 17); }
      if (at(cel.q, cel.r + 1) >= 0 && at(cel.q, cel.r + 1) !== dom[i]) { ctx.moveTo(p[0] - 17, p[1] + 17); ctx.lineTo(p[0] + 17, p[1] + 17); }
    });
    ctx.stroke(); ctx.restore();
    CELLE.forEach((cel, i) => {
      let d = SEMI[dom[i]].d;
      if (d !== 0) d = d * (1 - .85 * kR);      // poi i domini rimasti ruotano verso B
      frecciaAtomo(ctx, [CX[2] + cel.x, cel.y], d, 24, C.ink, kF, 3);
    });
  }
  campoColonna(ctx, CX[2], P(t, T_BF, T_BF + .5), kF);
  ctx.restore();
}

// ---------- il pannello ----------
function riga(ctx, nome, val, y, al) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1215, y, { size: 34, align: 'left', alpha: al });
  drawRich(ctx, val, 1745, y, { size: 34, align: 'right', alpha: al });
}
function scenePannello(ctx, t) {
  const al = life(t, 7.9, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const cx = 1480;
  // 1 · l'esperimento
  const k1 = life(t, 8.0, 38.9, .5, .5);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    conFont(TITOLI, () => drawRich(ctx, 'l’esperimento di Faraday', cx, 180, { size: 38, weight: 600, local: t - 8.1 }));
    drawRich(ctx, '{dim:sbarrette appese a un filo,}', cx, 238, { size: 30, local: t - 8.6 });
    drawRich(ctx, '{dim:viste dall’alto}', cx, 278, { size: 30, local: t - 8.9 });
    separa(ctx, 322, P(t, 18.2, 18.6));
    [[18.4, 0, 375], [23.2, 1, 485], [28.4, 2, 595]].forEach(([a, i, y]) => {
      const m = MAT[i];
      drawRich(ctx, '{dim:' + m.nome + ':} ' + m.fa, cx, y, { size: 32, local: t - a });
      drawRich(ctx, '{g:' + m.tipo + '}', cx, y + 44, { size: 32, local: t - 33.7 - i * .5 });
    });
    ctx.restore();
  }
  // 2 · dentro la materia
  const k2 = life(t, 38.8, 86.6, .5, .5);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    conFont(TITOLI, () => drawRich(ctx, 'dentro la materia', cx, 175, { size: 38, weight: 600, local: t - 38.9 }));
    drawRich(ctx, '{dim:elettroni: piccole correnti}', cx, 230, { size: 30, local: t - 39.2 });
    separa(ctx, 272, P(t, 49.2, 49.6));
    drawRich(ctx, '{g:diamagnetico}{dim: (rame)}', cx, 318, { size: 34, local: t - 49.3 });
    drawRich(ctx, '{dim:campo indotto} {g:opposto} {dim:a} {mg:B}', cx, 360, { size: 30, local: t - 49.6 });
    drawRich(ctx, '{dim:in tutti i materiali, debolissimo}', cx, 400, { size: 30, local: t - 54.6 });
    separa(ctx, 442, P(t, 65.2, 65.6));
    drawRich(ctx, '{g:paramagnetico}{dim: (alluminio)}', cx, 488, { size: 34, local: t - 65.3 });
    drawRich(ctx, '{dim:si allineano poco: l’agitazione}', cx, 530, { size: 30, local: t - 65.6 });
    drawRich(ctx, '{dim:termica le rimescola}', cx, 568, { size: 30, local: t - 65.9 });
    separa(ctx, 610, P(t, 70.6, 71.0));
    drawRich(ctx, '{g:ferromagnetico}{dim: (ferro)}', cx, 656, { size: 34, local: t - 70.7 });
    drawRich(ctx, '{dim:domini di Weiss: col campo}', cx, 698, { size: 30, local: t - 81.3 });
    drawRich(ctx, '{dim:crescono quelli allineati a} {mg:B}', cx, 736, { size: 30, local: t - 81.6 });
    ctx.restore();
  }
  // 3 · la permeabilità relativa
  const k3 = life(t, 86.6, T_FINE + .1, .5, .5);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    conFont(TITOLI, () => drawRich(ctx, 'permeabilità relativa', cx, 185, { size: 38, weight: 600, local: t - 86.7 }));
    drawRich(ctx, '{dim:quante volte il materiale}', cx, 240, { size: 30, local: t - 87.0 });
    drawRich(ctx, '{dim:moltiplica} {mg:B}', cx, 280, { size: 30, local: t - 87.2 });
    separa(ctx, 325, P(t, 87.3, 87.7));
    riga(ctx, '{dim:rame}', '0,99999', 380, P(t, 87.6, 88.0));
    riga(ctx, '{dim:alluminio}', '1,00002', 438, P(t, 88.0, 88.4));
    riga(ctx, '{dim:ferro}', '{g:centinaia o migliaia}', 496, P(t, 88.4, 88.8));
    separa(ctx, 548, P(t, 88.9, 89.3));
    drawRich(ctx, '{dim:meno di 1:} {g:diamagnetico}', cx, 598, { size: 30, local: t - 89.0 });
    drawRich(ctx, '{dim:poco più di 1:} {g:paramagnetico}', cx, 642, { size: 30, local: t - 89.3 });
    drawRich(ctx, '{dim:molto più di 1:} {g:ferromagnetico}', cx, 686, { size: 30, local: t - 89.6 });
    ctx.restore();
  }
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché la calamita prende\nil ferro e non il rame', W / 2, 205, { size: 104, weight: 600, local: t - 1.6, stagger: .12, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 101.7, 102.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Tutta la materia risponde al campo:\nil ferro con i suoi domini, tantissimo.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{g:diamagnetico}{dim:: respinto}\n{dim:appena (rame)}'], [960, '{g:paramagnetico}{dim:: attirato}\n{dim:appena (alluminio)}'], [1470, '{g:ferromagnetico}{dim:: domini}\n{dim:di Weiss (ferro)}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): le sbarrette girano insieme da 16,4 s (rotazioni rieseguite con
  // oscilla()); il tono segue l'angolo di quella che si muove di più in quel momento, da −30° (0) a 120° (1): prima il
  // ferro, poi l'alluminio, poi il rame che si mette di traverso. Nel ferro di dentro segue i domini che si allineano
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .4],                                                // di lato
    ['pop', 8.3, .4], ['pop', 8.6, .45], ['pop', 8.9, .5],                            // le tre sbarrette fra i poli
    ['pop', 14.5, .4],                                                                // ferro, alluminio, rame
    ['pop', 16.3, .55],                                                               // accendo il campo
    ['tono', 16.4, 17.4, [.5, .24, .11, .22, .21, .19]],                              // il ferro, di scatto
    ['tono', 17.4, 19.6, [.37, .27, .16, .09, .06, .07]],                             // l'alluminio, piano
    ['tono', 19.6, 24.4, [.67, .74, .82, .88, .92, .95, .96]],                        // il rame, di traverso
    ['pop', 18.5, .4], ['pop', 23.3, .4], ['pop', 28.5, .4],                          // le tre risposte
    ['pop', 33.8, .45], ['pop', 34.3, .5], ['pop', 34.8, .55],                        // ferro-, para-, diamagnetico
    ['soffio', 38.8], ['pop', 39.3, .4],                                              // dentro la materia
    ['pop', 44.1, .45], ['pop', 49.5, .5],                                            // il rame; col campo, un campo opposto
    ['pop', 59.9, .45], ['tono', 65.3, 66.5, [.3, .32, .45, .58, .6]],                // l'alluminio: si allinea un po'
    ['pop', 70.7, .5],                                                                // i domini di Weiss
    ['pop', 81.4, .5], ['tono', 81.5, 85.1, [.3, .34, .58, .74, .75, .92, 1]],        // col campo crescono, poi ruotano
    ['pop', 86.8, .5],                                                                // la permeabilità relativa
    ['pop', 87.7, .4], ['pop', 88.1, .45], ['pop', 88.5, .6], ['ding', 88.9],         // rame, alluminio, ferro
    ['soffio', 92.3], ['pop', 94.5, .5], ['pop', 95.0, .6], ['pop', 95.5, .7],        // in una frase
  ];
  return {
    titolo: 'Perché la calamita prende il ferro e non il rame', durata: 103.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 38.6, 'l’esperimento di Faraday'], [38.6, 86.4, 'dentro la materia'], [86.4, T_FINE, 'la permeabilità relativa']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneFaraday(ctx, t); sceneMateria(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});

