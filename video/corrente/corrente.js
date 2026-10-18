'use strict';
/* La corrente non si consuma — pila, lampadina, interruttore. Gli elettroni (pallini C.x, ognuno vale 0,2 C) escono dal
   polo − ed entrano nel + a velocità costante (125 px/s, molto accelerati: lo si dice), distanziati di 50 px: ne passano
   2,5 al secondo da ogni sezione, cioè 0,5 C/s = 0,5 A, contati davvero in una finestra di 2 s (5 pallini, 1 C).
   I = Δq/Δt, ampere; verso convenzionale (frecce C.v, lunghe in proporzione a I: 240 px/A) dal + al −, opposto agli
   elettroni. L'ipotesi «si consuma» in rosso (dopo la lampadina, nel verso degli elettroni: il filo di sopra, 0,25 A),
   smentita contando di nuovo i pallini sulla sezione di sopra (5 in 2 s, 1 C: 0,5 A); mentre si parla dell'ipotesi le
   frecce della corrente convenzionale (che va nel verso opposto) si tolgono, così «prima» e «dopo» sono sempre quelli
   dei pallini. Si consuma energia: alone verde sui pallini dal polo − alla lampadina, che lo cedono attraversandola. Colori fissi della corrente: corrente convenzionale C.v, elettroni C.x, energia C.g. Argomento: corrente. */
CVIDEO.registra('corrente/corrente', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, drawSeq, txt, card, arrowHead, fixedNum, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 84.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.6, 'sorpreso'], [20.4, 'neutro'],
  [33.7, 'felice'], [38.9, 'neutro'], [48.1, 'pensa'], [53.4, 'neutro'], [55.6, 'sorpreso'], [58.5, 'felice'], [63.5, 'pensa'],
  [68.0, 'neutro'], [73.5, 'felice'], [78.7, 'neutro'], [86.4, 'felice'], [90.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Una lampadina accesa «consuma»\nla corrente?'],
  [7.9, 12.6, 'Pila, lampadina, due fili e un\n{g:interruttore}, che apre il giro.'],
  [12.7, 17.5, 'Nei fili di metallo ci sono {x:elettroni}\nliberi di muoversi, con carica negativa.'],
  [17.6, 22.9, 'Chiudo: il giro è un {g:circuito}. La pila\nspinge gli elettroni fuori dal polo {x:−}.'],
  [23.0, 28.1, 'Ogni pallino porta 0,2 coulomb (C):\nconto quanti passano qui in 2 s.'],
  [28.2, 33.6, 'L’{g:intensità di corrente} {mv:I} è la carica\nche passa al secondo: Δ{mink:q}/Δ{mink:t}.'],
  [33.7, 38.8, 'In {g:ampere} (A): 1 A è un coulomb\nal secondo. Qui 0,5 A.'],
  [38.9, 43.6, 'Per convenzione, la corrente va come\nandrebbero cariche {v:positive}:'],
  [43.7, 48.0, 'dal polo {v:+} al polo {x:−}, al contrario\ndegli elettroni.'],
  [48.1, 53.3, 'Se la corrente si consumasse, dalla\nlampadina uscirebbero {r:meno} pallini.'],
  [53.4, 58.4, 'Dopo la lampadina, in 2 s, ne passano\nancora {x:5}: tanti quanti prima.'],
  [58.5, 63.4, 'Le cariche non spariscono: la corrente\nè la {g:stessa} in tutto il giro.'],
  [63.5, 67.9, 'Che cosa si consuma, allora?\nL’{g:energia}.'],
  [68.0, 73.4, 'Gli elettroni escono dal polo {x:−} con\n{g:energia} potenziale elettrica…'],
  [73.5, 78.6, '…e nella lampadina la cedono:\ndiventa {y:luce} e calore.'],
  [78.7, 83.8, 'Tornano alla pila con meno energia,\nma {g:tutti}: la pila gliela ridà.'],
  [86.4, 92.6, 'La stessa corrente entra ed esce:\nla lampadina trasforma {g:energia}.'],
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
// un filo (spezzata) disegnato fino alla frazione k della sua lunghezza
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
// la pila su un ramo verticale: il polo + (lungo e sottile) in alto
function pila(ctx, x, yc, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 44, yc - 22, 88, 44);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, yc - 15); ctx.lineTo(x + 40, yc - 15); ctx.stroke();
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 20, yc + 15); ctx.lineTo(x + 20, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 62, yc - 32, { size: 40, weight: 600, color: C.v, alpha: al });
  txt(ctx, '−', x + 62, yc + 34, { size: 40, weight: 600, color: C.x, alpha: al });
}
// un elettrone: pallino azzurro col segno meno; alone verde se porta energia, anello verde se è appena stato contato
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
// la lampadina su un ramo verticale: vetro, filamento, e quando è accesa alone e raggi
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
      const a = (i + .5) * TAU / 8; if (Math.abs(Math.cos(a)) < .3) continue;   // niente raggi sul filo, sopra e sotto
      ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(a) * (r + 14), c[1] + Math.sin(a) * (r + 14)); ctx.lineTo(c[0] + Math.cos(a) * (r + 40), c[1] + Math.sin(a) * (r + 40)); ctx.stroke();
    }
  }
  ctx.fillStyle = luce > 0 ? css(mix(C.paper, caldo, .35 * luce)) : C.paper;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  // il filamento: due reofori e una spirale in mezzo
  ctx.strokeStyle = css(mix(C.ink, caldo, luce)); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(c[0], c[1] + r); ctx.lineTo(c[0], c[1] + r * .4);
  for (let i = 0; i <= 8; i++) ctx.lineTo(c[0] + (i % 2 ? 14 : -14) * (i && i < 8 ? 1 : 0), c[1] + r * .4 - i * r * .1);
  ctx.lineTo(c[0], c[1] - r); ctx.stroke();
  ctx.restore();
}
function interruttore(ctx, a, b, chiuso, al) {   // su un filo orizzontale: perno in a, contatto in b
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - chiuso) * .55;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}
// ---------- il circuito ----------
const CARTA = [110, 110, 1000, 680];
const XB = 260, XL = 960, YT = 230, YG = 670, YC = 450, RL = 56;
const SW_A = [380, YT], SW_B = [470, YT];      // l'interruttore sul filo in alto
const T_ON = 18.0;                              // si chiude l'interruttore
// il cammino degli elettroni: dal polo − (in basso) giù, a destra, su attraverso la lampadina, a sinistra, nel polo +
const CAM = percorso([[XB, YC + 15], [XB, YG], [XL, YG], [XL, YC + RL], [XL, YC - RL], [XL, YT], [XB, YT], [XB, YC - 15]]);
const N_E = 45, PASSO = CAM.L / N_E;             // 2250 px, un pallino ogni 50 px
const RITMO = 2.5, VEL = RITMO * PASSO;          // 2,5 pallini al secondo (0,5 C/s = 0,5 A) → 125 px/s
const Q_PALLINO = 0.2;                           // coulomb per pallino
const S_LAMP_IN = CAM.cum[3], S_LAMP_OUT = CAM.cum[4];
const X_SEZ = 610, S_SEZ_GIU = CAM.cum[1] + (X_SEZ - XB), S_SEZ_SU = CAM.cum[5] + (XL - X_SEZ);
const T_CONTA = [23.2, 25.2];                    // la finestra di 2 s in cui si contano i pallini (sezione di sotto)
const T_CONTA2 = [53.4, 55.4];                   // di nuovo, dopo la lampadina (sezione di sopra)
const avanzato = t => VEL * Math.max(0, t - T_ON);
const sDi = (i, t) => ((i * PASSO + avanzato(t)) % CAM.L + CAM.L) % CAM.L;
// quanti pallini hanno attraversato la sezione s0 nella finestra w fino a t (passaggi a u = s0 − i·PASSO, modulo L)
function passati(s0, w, t) {
  const u0 = avanzato(w[0]), u1 = avanzato(Math.min(t, w[1]));
  if (u1 <= u0) return 0;
  const f = u => Math.floor((u - (s0 % PASSO)) / PASSO);
  return f(u1) - f(u0);
}
const LA = 240;                                  // le frecce della corrente: 240 px per ampere
const I_VERA = RITMO * Q_PALLINO;                // 0,5 A
// la prova contro «si consuma»: l'ipotesi in rosso fino alla fine del secondo conteggio, poi la lettura vera
const kIpotesi = t => P(t, 48.4, 49.0) * (1 - P(t, 55.4, 55.9));
const kSmentita = t => P(t, 55.5, 56.0);
// le frecce della corrente convenzionale: sopra a destra, giù prima e dopo la lampadina, sotto a sinistra
// (tolte mentre si parla dell'ipotesi, che si ragiona nel verso dei pallini)
function frecceCorrente(ctx, t) {
  const L = LA * I_VERA;
  const k = i => life(t, 38.9 + i * .25, 48.4, .5, .4) + life(t, 58.6, T_FINE + .1, .5, .4);
  freccia(ctx, [610 - L / 2, YT - 42], [610 + L / 2, YT - 42], C.v, k(0), 7);
  freccia(ctx, [XL + 70, 262], [XL + 70, 262 + L], C.v, k(1), 7);
  freccia(ctx, [XL + 70, 518], [XL + 70, 518 + L], C.v, k(2), 7);
  freccia(ctx, [610 + L / 2, YG + 42], [610 + L / 2 - L, YG + 42], C.v, k(3), 7);
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La corrente non si consuma', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kf = P(t, 8.1, 9.6, E.lin);
  filo(ctx, [[XB, YC - 15], [XB, YT], SW_A], kf);
  filo(ctx, [SW_B, [XL, YT], [XL, YC - RL]], kf);
  filo(ctx, [[XB, YC + 15], [XB, YG], [XL, YG], [XL, YC + RL]], kf);
  const luce = P(t, T_ON, T_ON + .15);
  lampadina(ctx, [XL, YC], RL, luce, P(t, 8.6, 9.1));
  interruttore(ctx, SW_A, SW_B, P(t, T_ON - .3, T_ON), P(t, 9.2, 9.7));
  // le sezioni dove si contano i pallini
  const kSg = life(t, 22.9, 63.5, .4, .4), kSs = life(t, 48.2, 63.5, .4, .4);
  for (const [y, k] of [[YG, kSg], [YT, kSs]]) {
    if (k <= 0) continue;
    const w = y === YG ? T_CONTA : T_CONTA2, vivo = life(t, w[0], w[1] + .4, .2, .3);
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = css(mix(C.dim, C.g, vivo)); ctx.lineWidth = 4; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(X_SEZ, y - 32); ctx.lineTo(X_SEZ, y + 32); ctx.stroke(); ctx.restore();
  }
  // gli elettroni
  const ke = P(t, 12.9, 13.6), kEn = life(t, 68.0, T_FINE + .1, .6, .4);
  if (ke > 0) for (let i = 0; i < N_E; i++) {
    const s = sDi(i, t), p = puntoSu(CAM, s);
    const bordo = clamp(s / 16) * clamp((CAM.L - s) / 16);
    const en = s < S_LAMP_IN ? 1 : s > S_LAMP_OUT ? 0 : 1 - (s - S_LAMP_IN) / (S_LAMP_OUT - S_LAMP_IN);
    let an = 0;   // appena passato dalla sezione in cui si conta, durante il conteggio
    for (const [w, s0] of [[T_CONTA, S_SEZ_GIU], [T_CONTA2, S_SEZ_SU]]) {
      if (t < w[0] || t > w[1] + .35) continue;
      const d = s - s0;
      if (d >= 0 && d < VEL * .35 && t - d / VEL >= w[0] && t - d / VEL < w[1]) an = Math.max(an, 1 - d / (VEL * .35));
    }
    elettrone(ctx, p, ke * bordo, 12, en * kEn, an);
  }
  pila(ctx, XB, YC, P(t, 8.1, 8.6));
  frecceCorrente(ctx, t);
  // le letture alle due sezioni: prima della lampadina (sotto) e dopo (sopra), nel verso dei pallini
  const kL = life(t, 48.2, 63.5, .4, .4), kH = kIpotesi(t), kOk = kSmentita(t);
  if (kL > 0) {
    drawRich(ctx, '{v:0,5 A}', X_SEZ, YG - 56, { size: 40, alpha: kL });
    drawRich(ctx, '{r:0,25 A?}', X_SEZ, YT + 56, { size: 40, alpha: kL * kH });
    drawRich(ctx, '{v:0,5 A}', X_SEZ, YT + 56, { size: 40, alpha: kL * kOk });
    txt(ctx, 'escono', XL - 30, 322, { size: 30, color: C.x, align: 'right', alpha: kL });
    txt(ctx, 'entrano', XL - 30, 578, { size: 30, color: C.x, align: 'right', alpha: kL });
  }
  const kn = life(t, T_ON + .2, T_FINE + .1, .5, .4);
  if (kn > 0) txt(ctx, 'pallini accelerati: in realtà vanno pianissimo', 1085, 755, { size: 30, color: C.dim, align: 'right', alpha: kn });
  ctx.restore();
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 22.9, () => {
    conFont(TITOLI, () => drawRich(ctx, 'il circuito', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:pila, lampadina, fili}', cx, 245, { size: 34, local: t - 8.0 });
    drawRich(ctx, '{dim:e un} {g:interruttore}', cx, 295, { size: 34, local: t - 8.5 });
    separa(ctx, 345, P(t, 12.7, 13.1));
    elettrone(ctx, [1255, 405], P(t, 12.9, 13.3), 14);
    drawRich(ctx, '{x:elettrone}{dim:: carica negativa}', 1290, 405, { size: 34, align: 'left', local: t - 13.0 });
    drawRich(ctx, '{dim:libero di muoversi nel metallo}', cx, 460, { size: 32, local: t - 13.6 });
    separa(ctx, 510, P(t, 17.6, 18.0));
    drawRich(ctx, '{g:circuito}{dim:: un giro chiuso}', cx, 565, { size: 36, local: t - 17.7 });
    drawRich(ctx, '{dim:gli elettroni escono dal} {x:−}', cx, 630, { size: 32, local: t - 19.6 });
    drawRich(ctx, '{dim:ed entrano nel} {v:+}', cx, 680, { size: 32, local: t - 20.0 });
  });
  blocco(23.0, 48.0, () => {
    conFont(TITOLI, () => drawRich(ctx, 'intensità di corrente', cx, 170, { size: 40, weight: 600 }));
    elettrone(ctx, [1290, 240], P(t, 23.1, 23.5), 14);
    drawRich(ctx, '{dim:ogni pallino:} 0,2 C', 1325, 240, { size: 34, align: 'left', local: t - 23.2 });
    // il conteggio, fotogramma per fotogramma
    const kc = P(t, 23.1, 23.5);
    const dt = clamp(t - T_CONTA[0], 0, 2), n = passati(S_SEZ_GIU, T_CONTA, t);
    drawRich(ctx, 'Δ{mink:t} =', 1230, 310, { size: 40, align: 'left', alpha: kc });
    fixedNum(ctx, dt.toFixed(1).replace('.', ','), 1690, 310, 40, C.ink, kc);
    txt(ctx, 's', 1704, 310, { size: 40, align: 'left', alpha: kc });
    drawRich(ctx, '{dim:pallini passati} =', 1230, 365, { size: 34, align: 'left', alpha: kc });
    fixedNum(ctx, String(n), 1690, 365, 40, C.x, kc);
    drawRich(ctx, 'Δ{mink:q} =', 1230, 420, { size: 40, align: 'left', alpha: kc });
    fixedNum(ctx, (n * Q_PALLINO).toFixed(1).replace('.', ','), 1690, 420, 40, C.ink, kc);
    txt(ctx, 'C', 1704, 420, { size: 40, align: 'left', alpha: kc });
    separa(ctx, 465, P(t, 28.2, 28.6));
    drawSeq(ctx, ['{mv:I} =', { num: 'Δ{mink:q}', den: 'Δ{mink:t}' }, '= 1 C / 2 s'], cx, 545, 48, { local: t - 28.4 });
    drawRich(ctx, '{mv:I} = {v:0,5 A}', cx, 635, { size: 46, local: t - 36.5 });
    drawRich(ctx, '{dim:ampere: 1 A = 1 C/s}', cx, 690, { size: 32, local: t - 33.9 });
    drawRich(ctx, '{dim:verso convenzionale: dal} {v:+} {dim:al} {x:−}', cx, 745, { size: 32, local: t - 43.8 });
  });
  blocco(48.1, 63.5, () => {
    conFont(TITOLI, () => drawRich(ctx, 'prima e dopo la lampadina', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:pallini che} {x:entrano}{dim::}', 1230, 245, { size: 34, align: 'left', local: t - 48.3 });
    drawRich(ctx, '{v:0,5 A}', 1740, 245, { size: 40, align: 'right', alpha: P(t, 48.5, 48.9) });
    drawRich(ctx, '{dim:pallini che} {x:escono}{dim::}', 1230, 300, { size: 34, align: 'left', local: t - 48.7 });
    drawRich(ctx, '{r:0,25 A?}', 1740, 300, { size: 40, align: 'right', alpha: kIpotesi(t) });
    drawRich(ctx, '{v:0,5 A}', 1740, 300, { size: 40, align: 'right', alpha: kSmentita(t) });
    drawRich(ctx, '{r:ipotesi: si consuma}', 1440, 360, { size: 34, local: t - 49.4 });
    crossMark(ctx, 1695, 362, P(t, 55.6, 56.4), C.r, .45);
    // il secondo conteggio, sulla sezione di sopra
    separa(ctx, 405, P(t, 53.4, 53.8));
    const kc = P(t, 53.4, 53.8), dt = clamp(t - T_CONTA2[0], 0, 2), n = passati(S_SEZ_SU, T_CONTA2, t);
    drawRich(ctx, 'Δ{mink:t} =', 1230, 450, { size: 40, align: 'left', alpha: kc });
    fixedNum(ctx, dt.toFixed(1).replace('.', ','), 1690, 450, 40, C.ink, kc);
    txt(ctx, 's', 1704, 450, { size: 40, align: 'left', alpha: kc });
    drawRich(ctx, '{dim:pallini passati} =', 1230, 500, { size: 34, align: 'left', alpha: kc });
    fixedNum(ctx, String(n), 1690, 500, 40, C.x, kc);
    drawRich(ctx, 'Δ{mink:q} =', 1230, 550, { size: 40, align: 'left', alpha: kc });
    fixedNum(ctx, (n * Q_PALLINO).toFixed(1).replace('.', ','), 1690, 550, 40, C.ink, kc);
    txt(ctx, 'C', 1704, 550, { size: 40, align: 'left', alpha: kc });
    separa(ctx, 595, P(t, 58.5, 58.9));
    drawRich(ctx, '{dim:le cariche non spariscono}', cx, 640, { size: 32, local: t - 58.6 });
    drawRich(ctx, '{g:la stessa corrente in tutto il giro}', cx, 695, { size: 32, local: t - 60.0 });
  });
  blocco(63.5, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'che cosa si consuma', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{g:l’energia}', cx, 250, { size: 50, local: t - 66.6 });
    drawRich(ctx, '{dim:dal polo} {x:−} {dim:alla lampadina:}', cx, 335, { size: 32, local: t - 68.2 });
    drawRich(ctx, '{dim:elettroni} {g:carichi di energia}', cx, 385, { size: 32, local: t - 68.6 });
    drawRich(ctx, '{dim:nella lampadina diventa}', cx, 460, { size: 32, local: t - 73.7 });
    drawRich(ctx, '{y:luce} {dim:e calore}', cx, 510, { size: 36, local: t - 74.6 });
    separa(ctx, 565, P(t, 78.7, 79.1));
    drawRich(ctx, '{dim:tornano} {g:tutti}{dim:, con meno energia:}', cx, 620, { size: 32, local: t - 78.8 });
    drawRich(ctx, '{dim:la pila gliela ridà}', cx, 670, { size: 32, local: t - 80.6 });
  });
}

// in una frase
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 93.3, 94.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La corrente non si consuma:\nsi trasforma l’energia.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mv:I} = Δ{mink:q}/Δ{mink:t}\n{dim:in ampere: 1 A = 1 C/s}'], [960, 'verso convenzionale:\ndal {v:+} al {x:−}'], [1470, 'stessa corrente prima\ne dopo la lampadina']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): un pop per ogni pallino che passa dalla sezione mentre si conta,
  // sempre più alto come il contatore (istanti dal moto vero: 125 px/s dal via a 18 s)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.1, 9.6], ['pop', 8.6, .6], ['pop', 9.2, .4],       // i fili, la lampadina, l'interruttore
    ['pop', 12.9, .5],                                                                // gli elettroni
    ['pop', 18.0, .7], ['tono', 18.0, 19.0, [.3, .5]],                                // chiudo: si accende, i pallini partono
    ['soffio', 23.0],                                                                 // l'intensità di corrente
    ['pop', 23.24, .3], ['pop', 23.64, .4], ['pop', 24.04, .5], ['pop', 24.44, .6], ['pop', 24.84, .7],   // 5 pallini in 2 s
    ['pop', 28.4, .6],                                                                // I = Δq/Δt
    ['ding', 36.5],                                                                   // I = 0,5 A
    ['traccia', 38.9, 40.1], ['pop', 43.8, .4],                                       // le frecce del verso convenzionale
    ['soffio', 48.1], ['pop', 48.4, .3],                                              // prima e dopo: «0,25 A?»
    ['pop', 53.56, .3], ['pop', 53.96, .4], ['pop', 54.36, .5], ['pop', 54.76, .6], ['pop', 55.16, .7],   // dopo la lampadina: ancora 5
    ['ding', 55.5], ['traccia', 55.6, 56.4],                                          // 0,5 A: l'ipotesi si barra
    ['traccia', 58.6, 59.6], ['pop', 60.0, .6],                                       // tornano le frecce: la stessa corrente
    ['soffio', 63.5], ['pop', 66.6, .7],                                              // che cosa si consuma: l'energia
    ['pop', 68.2, .6], ['pop', 74.6, .7], ['pop', 78.8, .4],                          // carichi di energia, luce, tornano tutti
    ['soffio', 84.2], ['pop', 84.6, .6], ['pop', 86.2, .5], ['pop', 86.7, .6], ['pop', 87.2, .7],   // in una frase
  ];
  return {
    titolo: 'La corrente non si consuma', durata: 95, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.9, 'il circuito'], [22.9, 48.0, 'l’intensità di corrente'], [48.0, 63.4, 'entra ed esce'], [63.4, T_FINE, 'che cosa si consuma']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
