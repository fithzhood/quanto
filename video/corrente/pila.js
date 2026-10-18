'use strict';
/* La pila che si stanca — l'ipotesi «la pila è un serbatoio di cariche» in rosso, smentita: gli elettroni (pallini C.x,
   accelerati: lo si dice) escono dal − ed entrano nel + allo stesso ritmo, e nello stesso istante (sono distanziati di un
   passo esatto su tutto il giro). La pila è una pompa: con le reazioni chimiche dà energia alle cariche (alone verde dal −
   alla lampadina) e tiene fra i poli la tensione. f.e.m. = 9 V, resistenza interna r = 2 Ω: a circuito aperto il
   voltmetro segna 9 V; con R = 7 Ω: I = 9/(7 + 2) = 1 A, V = 9 − 2·1 = 7 V; con R = 1 Ω: I = 3 A, V = 3 V; in corto
   circuito I = f.e.m./r = 4,5 A, V = 0 (letture e freccia mostrate solo quando il fumetto ne parla; il calore, energia, in C.g). I punti (I; V) stanno sulla retta V = 9 − 2·I. Frecce della corrente C.v lunghe
   in proporzione (120 px/A). Colori fissi della corrente: corrente C.v, tensione C.y, elettroni C.x. Argomento: corrente. */
CVIDEO.registra('corrente/pila', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fmtN, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 93.9;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'pensa'], [13.5, 'neutro'], [19.2, 'felice'],
  [24.7, 'neutro'], [35.5, 'felice'], [40.9, 'neutro'], [51.1, 'sorpreso'], [55.7, 'pensa'], [61.1, 'neutro'],
  [65.9, 'felice'], [71.5, 'neutro'], [77.4, 'pensa'], [82.7, 'sorpreso'], [88.1, 'neutro'], [96.3, 'felice'],
  [100.3, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Una pila da 9 V dà\nsempre 9 volt?'],
  [7.9, 13.4, 'Un’idea diffusa: la pila è un {r:serbatoio}\ndi cariche che si svuota.'],
  [13.5, 19.1, '{r:No}: per ogni carica che esce dal {x:−},\nnello stesso istante una entra dal {v:+}.'],
  [19.2, 24.6, 'La pila è una {g:pompa}: con le reazioni\nchimiche dà {g:energia} a ogni carica.'],
  [24.7, 30.0, 'Così tiene fra i poli una differenza\ndi potenziale, la {g:tensione}: qui 9 V.'],
  [30.1, 35.4, 'Si scarica quando sono consumate\nle sostanze chimiche, non le cariche.'],
  [35.5, 40.8, 'Il {g:voltmetro} (V) misura la tensione\nfra i poli: senza circuito, 9 V.'],
  [40.9, 46.2, 'È la {g:forza elettromotrice}, f.e.m.:\nla tensione a circuito aperto.'],
  [46.3, 51.0, 'Chiudo su una resistenza {mink:R} = 7 Ω:\npassa {mv:I} = 1 A.'],
  [51.1, 55.6, 'Ma il voltmetro ora segna\n{y:7 V}, non più 9!'],
  [55.7, 61.0, 'Dentro la pila c’è una resistenza\n{g:interna} {mink:r}: qui 2 Ω.'],
  [61.1, 65.8, 'Su {mink:r} si perdono {mink:r}·{mv:I} = 2 V…'],
  [65.9, 71.4, '…quindi {my:V} = f.e.m. − {mink:r}·{mv:I}\n= 9 V − 2 V = 7 V.'],
  [71.5, 77.3, 'Con {mink:R} = 1 Ω: {mv:I} = 3 A\ne {my:V} scende a 3 V.'],
  [77.4, 82.6, 'Più corrente chiedo, più la pila\n«si stanca»: {my:V} cala in linea retta.'],
  [82.7, 88.0, 'Poli uniti da un filo senza resistenza:\nè il {r:corto circuito}.'],
  [88.1, 93.6, '{my:V} = 0 e {mv:I} = f.e.m./{mink:r} = 4,5 A:\ntutta l’energia scalda la pila.'],
  [96.3, 102.5, 'La pila non è un serbatoio: tiene la\nf.e.m., ma perde {mink:r}·{mv:I} quando lavora.'],
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
function filo(ctx, pts, k, al = 1) {
  if (k <= 0 || al <= 0) return;
  let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let resto = tot * k;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && resto > 0; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(1, resto / l);
    ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); resto -= l;
  }
  ctx.stroke(); ctx.restore();
}
function elettrone(ctx, p, al = 1, r = 12, en = 0, anello = 0) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (en > 0.01) {
    const g = ctx.createRadialGradient(p[0], p[1], r * .6, p[0], p[1], r + 18);
    g.addColorStop(0, css(C.g, .75 * en)); g.addColorStop(1, css(C.g, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r + 18, 0, TAU); ctx.fill();
  }
  if (anello > 0.01) { ctx.strokeStyle = css(C.g, anello); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], r + 9, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]); ctx.stroke();
  ctx.restore();
}
function lampadina(ctx, c, r, luce, al = 1) {
  if (al <= 0) return;
  const caldo = mix(C.y, [255, 214, 90], .45);
  ctx.save(); ctx.globalAlpha *= al;
  if (luce > 0) {
    const g = ctx.createRadialGradient(c[0], c[1], r * .3, c[0], c[1], r * 2.4);
    g.addColorStop(0, css(caldo, .55 * luce)); g.addColorStop(1, css(caldo, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r * 2.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(caldo, luce); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) * TAU / 8; if (Math.abs(Math.cos(a)) < .3) continue;
      ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(a) * (r + 14), c[1] + Math.sin(a) * (r + 14)); ctx.lineTo(c[0] + Math.cos(a) * (r + 40), c[1] + Math.sin(a) * (r + 40)); ctx.stroke();
    }
  }
  ctx.fillStyle = luce > 0 ? css(mix(C.paper, caldo, .35 * luce)) : C.paper;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(mix(C.ink, caldo, luce)); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(c[0], c[1] + r); ctx.lineTo(c[0], c[1] + r * .4);
  for (let i = 0; i <= 8; i++) ctx.lineTo(c[0] + (i % 2 ? 14 : -14) * (i && i < 8 ? 1 : 0), c[1] + r * .4 - i * r * .1);
  ctx.lineTo(c[0], c[1] - r); ctx.stroke();
  ctx.restore();
}
function interruttore(ctx, a, b, chiuso, al) {
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - chiuso) * .55;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// resistenza a zig-zag su un filo verticale, da y0 a y1
function resistenzaV(ctx, x, y0, y1, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 26, y0 - 2, 52, y1 - y0 + 4);
  const n = 6, h = (y1 - y0) / n;
  ctx.beginPath(); ctx.moveTo(x, y0);
  for (let i = 0; i < n; i++) { ctx.lineTo(x + 20, y0 + (i + .25) * h); ctx.lineTo(x - 20, y0 + (i + .75) * h); }
  ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
}
function strumento(ctx, c, lettera, al = 1, r = 42) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, lettera, c[0], c[1] + 2, { size: 44, weight: 600, alpha: al });
}
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}
// ---------- il circuito ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const PX = 460, YT = 250, YG = 650, TOP = [PX, 280], BOT = [PX, 620], XR = 960, YC = 450, RL = 56;
const SW_A = [640, YT], SW_B = [730, YT];
// 1 · gli elettroni escono dal − ed entrano nel +, attorno alla lampadina
const CAM = percorso([BOT, [PX, YG], [XR, YG], [XR, YC + RL], [XR, YC - RL], [XR, YT], [PX, YT], TOP]);
const N_E = 29, PASSO = CAM.L / N_E, VEL = 2.5 * PASSO, S_LAMP = CAM.cum[3];
const sDi = (i, t) => ((i * PASSO + VEL * (t - 7.0)) % CAM.L + CAM.L) % CAM.L;
// 2 · la corrente nei vari momenti: R = 7 Ω, poi 1 Ω, poi il corto circuito (f.e.m. = 9 V, r = 2 Ω)
const FEM = 9, R_INT = 2;
const T_CHIUDE = 46.6, T_R1 = 71.8, T_CORTO = 83.2;
const T_LEGGE_CORTO = 88.1;   // i numeri del corto circuito si mostrano quando se ne parla (fra 83,2 e 88,1 strumenti e freccia sono nascosti)
const corrente = t => kf(t, [[T_CHIUDE, 0], [T_CHIUDE + .3, 1], [T_R1, 1], [T_R1 + .3, 3], [T_LEGGE_CORTO, 3], [T_LEGGE_CORTO + .3, 4.5]]);
const kNumeri = t => 1 - P(t, T_CORTO, T_CORTO + .3) + P(t, T_LEGGE_CORTO, T_LEGGE_CORTO + .3);
const fase = t => t < T_CHIUDE ? 0 : t < T_R1 ? 1 : t < T_CORTO ? 2 : 3;
const I_FASE = [0, 1, 3, 4.5], R_FASE = ['', '7 Ω', '1 Ω', '0'];
const numero = v => fmtN(v, v % 1 ? 1 : 0);
// il valore mostrato cambia di colpo (si legge sempre un numero vero), la freccia cresce in 0,3 s
// (le letture degli strumenti entrano nel corto circuito solo a T_LEGGE_CORTO, quando il fumetto ne parla: o.tardi)
function lettura(ctx, t, f, x, y, o) {
  const ts = [0, T_CHIUDE, T_R1, o.tardi ? T_LEGGE_CORTO : T_CORTO];
  for (let k = 0; k < 4; k++) {
    const a = k ? P(t, ts[k], ts[k] + .3) : 1, b = k < 3 ? 1 - P(t, k === 2 ? T_CORTO : ts[k + 1], (k === 2 ? T_CORTO : ts[k + 1]) + .3) : 1;
    const al = Math.min(a, b) * (o.alpha != null ? o.alpha : 1); if (al <= 0) continue;
    drawRich(ctx, f(k), x, y, Object.assign({}, o, { alpha: al }));
  }
}
function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const k1 = 1 - P(t, 35.0, 35.8), k2 = P(t, 35.6, 36.4);
  const kf2 = P(t, 8.0, 9.4, E.lin);
  // i fili: in alto (con l'interruttore nella seconda parte), a destra, in basso
  filo(ctx, [TOP, [PX, YT], SW_A], kf2);
  filo(ctx, [SW_A, SW_B], kf2, k1);
  interruttore(ctx, SW_A, SW_B, P(t, T_CHIUDE - .3, T_CHIUDE), k2);
  filo(ctx, [SW_B, [XR, YT], [XR, YC - RL]], kf2);
  filo(ctx, [[XR, YC + RL], [XR, YG], [PX, YG], BOT], kf2);
  // il carico: la lampadina, poi la resistenza, poi un filo nudo
  lampadina(ctx, [XR, YC], RL, 1, P(t, 8.4, 8.9) * k1);
  const kc = P(t, T_CORTO, T_CORTO + .5);
  if (k2 > 0) {
    filo(ctx, [[XR, YC - RL], [XR, YC + RL]], 1, k2);
    resistenzaV(ctx, XR, YC - 90, YC + 90, k2 * (1 - kc));
    lettura(ctx, t, k => k ? '{mink:R} = ' + R_FASE[k] : '{mink:R} = 7 Ω', XR - 44, YC, { size: 38, align: 'right', alpha: k2 * P(t, 46.4, 46.9) });
  }
  // gli elettroni (prima parte)
  const kHyp = life(t, 8.2, 13.6, .5, .4), kEn = life(t, 19.4, 35.6, .6, .5), kPoli = life(t, 13.6, 19.1, .4, .4);
  if (k1 > 0) for (let i = 0; i < N_E; i++) {
    const s = sDi(i, t), p = puntoSu(CAM, s), bordo = clamp(s / 14) * clamp((CAM.L - s) / 14);
    const vicino = Math.min(s, CAM.L - s), an = kPoli * clamp(1 - vicino / 40);
    elettrone(ctx, p, P(t, 8.6, 9.2) * k1 * bordo, 12, (s < S_LAMP ? 1 : 0) * kEn, an);
  }
  // la pila: corpo pieno (prima parte), poi «aperta» con dentro la f.e.m. e la resistenza interna
  const kp = P(t, 8.0, 8.5);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= kp * k1;
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.roundRect(380, 280, 160, 340, 18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.fillRect(PX - 26, 266, 52, 14);
    // l'ipotesi del serbatoio: un livello rosso che scende
    if (kHyp > 0) { const liv = kf(t, [[8.8, 1], [12.8, .22]]), h = 320 * liv; ctx.globalAlpha *= kHyp; ctx.fillStyle = css(C.r, .28); ctx.beginPath(); ctx.roundRect(390, 610 - h, 140, h, 10); ctx.fill(); }
    ctx.restore();
    txt(ctx, '+', PX, 330, { size: 44, weight: 600, color: C.v, alpha: kp * k1 });
    txt(ctx, '−', PX, 570, { size: 44, weight: 600, color: C.x, alpha: kp * k1 });
    drawRich(ctx, '{r:?}', PX, 450, { size: 60, alpha: kHyp });
    const kr = life(t, 19.4, 35.6, .5, .4);
    txt(ctx, 'reazioni', PX, 430, { size: 30, color: C.dim, alpha: kr * k1 });
    txt(ctx, 'chimiche', PX, 470, { size: 30, color: C.dim, alpha: kr * k1 });
  }
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.roundRect(380, 280, 160, 340, 18); ctx.stroke(); ctx.restore();
    filo(ctx, [TOP, [PX, 345]], 1, k2); filo(ctx, [[PX, 375], [PX, 450]], 1, k2); filo(ctx, [[PX, 550], BOT], 1, k2);
    ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(PX - 40, 345); ctx.lineTo(PX + 40, 345); ctx.stroke();
    ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(PX - 20, 375); ctx.lineTo(PX + 20, 375); ctx.stroke(); ctx.restore();
    resistenzaV(ctx, PX, 450, 550, k2);
    // calore nel corto circuito (energia: verde), sopra i componenti perché il fondo della resistenza non lo copra
    const kh = life(t, 88.2, T_FINE + .1, .6, .4);
    if (kh > 0) { ctx.save(); ctx.globalAlpha *= k2 * kh * (.75 + .25 * Math.sin(t * 5)); const g = ctx.createRadialGradient(PX, 450, 40, PX, 450, 230); g.addColorStop(0, css(C.g, .35)); g.addColorStop(1, css(C.g, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(PX, 450, 230, 0, TAU); ctx.fill(); ctx.restore(); }
    for (const [p, s, c] of [[TOP, '+', C.v], [BOT, '−', C.x]]) { ctx.save(); ctx.globalAlpha *= k2; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); ctx.restore(); txt(ctx, s, PX - 40, p[1] + (s === '+' ? 30 : -30), { size: 40, weight: 600, color: c, alpha: k2 }); }
    drawRich(ctx, '{dim:f.e.m.}', 570, 360, { size: 32, align: 'left', alpha: k2 * P(t, 41.0, 41.5) });
    const kd = P(t, 61.3, 61.8);
    drawRich(ctx, '{mink:r}', 570, 500, { size: 38, align: 'left', alpha: k2 * P(t, 55.9, 56.4) * (1 - kd) });
    if (kd > 0) lettura(ctx, t, k => '{mink:r}·{mv:I} = {y:' + numero(R_INT * I_FASE[k]) + ' V}', 570, 500, { size: 36, align: 'left', alpha: k2 * kd, tardi: true });
    // il voltmetro sui poli
    filo(ctx, [[PX, YT], [220, YT], [220, YC - 42]], 1, k2);
    filo(ctx, [[220, YC + 42], [220, YG], [PX, YG]], 1, k2);
    strumento(ctx, [220, YC], 'V', k2);
    lettura(ctx, t, k => '{y:' + numero(FEM - R_INT * I_FASE[k]) + ' V}', 274, YC, { size: 40, align: 'left', alpha: k2 * P(t, 35.8, 36.3), tardi: true });
    // la corrente, lunga in proporzione: 120 px per ampere
    const I = corrente(t), L = 120 * I;
    if (L > 3) {
      freccia(ctx, [800 - L / 2, 200], [800 + L / 2, 200], C.v, k2 * kNumeri(t), 7);
      lettura(ctx, t, k => k ? '{mv:I} = ' + numero(I_FASE[k]) + ' A' : '', 800, 152, { size: 36, alpha: k2, tardi: true });
    }
  }
  // la tensione fra i poli (prima parte)
  const kV = life(t, 24.9, 35.6, .4, .4) * k1;
  if (kV > 0) {
    ctx.save(); ctx.globalAlpha *= kV; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(340, 280); ctx.lineTo(340, 620); ctx.moveTo(330, 280); ctx.lineTo(350, 280); ctx.moveTo(330, 620); ctx.lineTo(350, 620); ctx.stroke(); ctx.restore();
    fondo(ctx, 340, 450, 84, 50, kV); drawRich(ctx, '{y:9 V}', 340, 450, { size: 38, alpha: kV });
  }
  const kn = life(t, 8.8, 35.4, .5, .4);
  if (kn > 0) txt(ctx, 'pallini accelerati', 1085, 755, { size: 30, color: C.dim, align: 'right', alpha: kn });
  ctx.restore();
}
// il grafico (I; V) della pila: la retta V = 9 − 2·I
const G0 = [1250, 700], GXA = 100, GYV = 45;
const gp = (I, V) => [G0[0] + I * GXA, G0[1] - V * GYV];
const PUNTI = [[71.9, 0, 9], [72.3, 1, 7], [72.7, 3, 3], [88.4, 4.5, 0]];
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 35.5, () => {
    conFont(TITOLI, () => drawRich(ctx, 'che cosa fa una pila', cx, 170, { size: 40, weight: 600 }));
    elettrone(ctx, [1250, 240], P(t, 8.0, 8.4), 14);
    drawRich(ctx, '{dim:elettroni: carica negativa}', 1285, 240, { size: 32, align: 'left', local: t - 8.1 });
    drawRich(ctx, '{r:ipotesi: un serbatoio}', 1440, 310, { size: 34, local: t - 8.4 });
    crossMark(ctx, 1700, 310, P(t, 13.7, 14.4), C.r, .5);
    drawRich(ctx, '{dim:esce una carica, ne entra una}', cx, 375, { size: 32, local: t - 13.8 });
    separa(ctx, 425, P(t, 19.2, 19.6));
    drawRich(ctx, '{g:una pompa}{dim:: le reazioni chimiche}', cx, 475, { size: 32, local: t - 19.3 });
    drawRich(ctx, '{dim:danno} {g:energia} {dim:alle cariche}', cx, 525, { size: 32, local: t - 20.4 });
    drawRich(ctx, '{g:tensione} {dim:fra i poli:} {y:9 V}', cx, 600, { size: 36, local: t - 24.9 });
    drawRich(ctx, '{dim:volt: 1 V = 1 J/C}', cx, 652, { size: 30, local: t - 26.6 });
    drawRich(ctx, '{dim:si consumano le sostanze,}', cx, 712, { size: 30, local: t - 30.2 });
    drawRich(ctx, '{dim:non le cariche}', cx, 752, { size: 30, local: t - 30.6 });
  });
  blocco(35.5, 71.5, () => {
    conFont(TITOLI, () => drawRich(ctx, 'forza elettromotrice', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:a circuito aperto:} {my:V} = 9 V', cx, 240, { size: 34, local: t - 35.7 });
    drawRich(ctx, '{g:f.e.m.} = 9 V', cx, 300, { size: 44, local: t - 41.0 });
    drawRich(ctx, '{dim:(non è una forza: è in volt)}', cx, 350, { size: 30, local: t - 41.8 });
    separa(ctx, 395, P(t, 46.3, 46.7));
    drawRich(ctx, '{mink:R}{dim:: resistenza, in ohm (Ω)}', cx, 440, { size: 32, local: t - 46.4 });
    drawRich(ctx, '{mv:I}{dim:: corrente, carica al secondo (A)}', cx, 488, { size: 30, local: t - 47.4 });
    separa(ctx, 532, P(t, 55.7, 56.1));
    drawRich(ctx, '{mink:r} = 2 Ω{dim:: resistenza interna}', cx, 578, { size: 32, local: t - 55.8 });
    drawRich(ctx, '{my:V} = f.e.m. − {mink:r}·{mv:I}', cx, 645, { size: 44, local: t - 66.0 });
    drawRich(ctx, '= 9 V − 2 Ω · 1 A = {y:7 V}', cx, 715, { size: 34, local: t - 67.4 });
  });
  blocco(71.5, T_FINE + .1, () => {
    drawRich(ctx, '{my:V} = f.e.m. − {mink:r}·{mv:I}', cx, 165, { size: 40 });
    const ka = P(t, 71.7, 72.5);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (let i = 1; i <= 5; i++) { const x = gp(i, 0)[0]; ctx.beginPath(); ctx.moveTo(x, G0[1]); ctx.lineTo(x, gp(0, 10)[1]); ctx.stroke(); }
    for (let v = 2; v <= 10; v += 2) { const y = gp(0, v)[1]; ctx.beginPath(); ctx.moveTo(G0[0], y); ctx.lineTo(gp(5.2, 0)[0], y); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(G0[0], G0[1]); ctx.lineTo(lerp(G0[0], 1785, ka), G0[1]); ctx.moveTo(G0[0], G0[1]); ctx.lineTo(G0[0], lerp(G0[1], 230, ka)); ctx.stroke();
    arrowHead(ctx, [lerp(G0[0], 1785, ka) + 4, G0[1]], 0, C.ink); arrowHead(ctx, [G0[0], lerp(G0[1], 230, ka) - 4], -Math.PI / 2, C.ink);
    for (let i = 1; i <= 5; i++) txt(ctx, String(i), gp(i, 0)[0], G0[1] + 34, { size: 29, color: C.dim, alpha: ka });
    for (let v = 2; v <= 10; v += 2) txt(ctx, String(v), G0[0] - 20, gp(0, v)[1], { size: 29, color: C.dim, align: 'right', alpha: ka });
    drawRich(ctx, '{mv:I} {dim:(A)}', 1775, 662, { size: 34, align: 'right', alpha: ka });
    drawRich(ctx, '{my:V} {dim:(V)}', G0[0] + 26, 232, { size: 34, align: 'left', alpha: ka });
    const kl = P(t, 77.6, 78.8);
    if (kl > 0) { ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.lineCap = 'round'; const a = gp(0, 9), b = gp(4.5 * kl, 9 - 9 * kl); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }
    PUNTI.forEach(([ta, I, V]) => {
      const k = P(t, ta, ta + .3, E.back); if (k <= 0) return;
      const p = gp(I, V); ctx.save(); ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p[0], p[1], 9 * k, 0, TAU); ctx.fill(); ctx.restore();
    });
    drawRich(ctx, '{dim:f.e.m.}', G0[0] + 22, gp(0, 9)[1] - 6, { size: 30, align: 'left', alpha: P(t, 72.0, 72.5) });
    drawRich(ctx, '{r:corto circuito}', gp(4.5, 0)[0] - 20, G0[1] + 70, { size: 30, alpha: P(t, 88.5, 89.0) });
  });
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La pila che si stanca', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 103.2, 104.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La pila tiene una tensione, ma più\ncorrente dà, più ne perde dentro di sé.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'f.e.m.: la tensione\n{dim:a circuito aperto}'], [960, '{my:V} = f.e.m. − {mink:r}·{mv:I}\n{dim:con} {mink:r} {dim:resistenza interna}'], [1470, '{r:corto circuito}:\n{mv:I} = f.e.m./{mink:r}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il serbatoio segue il livello rosso; la corrente segue I, da 0 (0) a
  // 4,5 A (1); nel grafico il tono segue la tensione, da 0 (0) a 10 V (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.0, 9.4], ['pop', 8.2, .4], ['pop', 8.7, .5],       // il circuito, la pila, la lampadina e gli elettroni
    ['tono', 8.8, 12.8, [1, .99, .95, .84, .61, .38, .27, .23, .22]],                 // l'ipotesi: il serbatoio si svuota
    ['pop', 13.8, .3],                                                                // smentita
    ['pop', 19.5, .55],                                                               // la pompa dà energia
    ['traccia', 24.9, 25.3], ['pop', 25.0, .6],                                       // 9 V fra i poli
    ['soffio', 35.5], ['pop', 36.0, .5], ['pop', 41.1, .6],                           // il voltmetro, la f.e.m.
    ['pop', 46.4, .35], ['tono', 46.6, 46.9, [0, .22]],                               // si chiude su R: passa 1 A
    ['pop', 56.0, .45], ['pop', 61.4, .5],                                            // r, poi r·I = 2 V
    ['pop', 66.1, .55], ['ding', 67.6],                                               // V = 9 V − 2 V = 7 V
    ['soffio', 71.5], ['traccia', 71.7, 72.5], ['tono', 71.8, 72.1, [.22, .67]],      // il grafico; R = 1 Ω: 3 A
    ['pop', 71.95, .9], ['pop', 72.35, .7], ['pop', 72.75, .3],                       // i punti (0; 9), (1; 7), (3; 3)
    ['traccia', 77.6, 78.8], ['tono', 77.6, 78.8, [.9, .87, .67, .23, .03, 0]],       // la retta cala
    ['pop', 83.3, .3],                                                                // il corto circuito
    ['tono', 88.1, 88.4, [.67, 1]], ['pop', 88.45, .1], ['ding', 88.8],               // 4,5 A e V = 0
    ['soffio', 94.0], ['pop', 96.1, .5], ['pop', 96.6, .6], ['pop', 97.1, .7],        // in una frase
  ];
  return {
    titolo: 'La pila che si stanca', durata: 105, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 35.4, 'che cosa fa una pila'], [35.4, 71.4, 'f.e.m. e resistenza interna'], [71.4, T_FINE, 'più corrente, meno tensione']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
