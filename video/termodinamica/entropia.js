'use strict';
/* Perché non torna indietro — 40 molecole chiuse a sinistra; tolta la parete si sparpagliano (rimbalzi veri, a
   velocità costante, posizioni calcolate esattamente: niente caso, seme fisso) e restano più o meno metà e metà.
   Con 4 molecole i modi sono 2⁴ = 16 (1, 4, 6, 4, 1): tutte a sinistra ha probabilità 1/16 e ogni tanto succede;
   con 100 molecole (1/2)¹⁰⁰ ≈ 7,9·10⁻³¹. Un miliardo di occhiate al secondo per 13,8 miliardi di anni ≈ 4,4·10²⁶
   occhiate: in media ≈ 3·10⁻⁴ volte. Un litro d'aria (1 atm, 20 °C) ≈ 2,5·10²² molecole. Entropia (Boltzmann):
   S = k·ln W (W microstati); in un sistema isolato non diminuisce mai e cresce nei processi irreversibili.
   Argomento: termodinamica. */
CVIDEO.registra('termodinamica/entropia', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card } = M;

const T_FINE = 92.3;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.8, 'felice'], [20.0, 'neutro'],
  [26.9, 'pensa'], [31.3, 'neutro'], [35.9, 'felice'], [38.1, 'neutro'], [46.0, 'sorpreso'], [48.2, 'neutro'],
  [54.7, 'sorpreso'], [56.9, 'neutro'], [59.1, 'pensa'], [61.3, 'neutro'], [74.2, 'felice'], [76.4, 'neutro'],
  [83.6, 'pensa'], [87.8, 'neutro'], [94.8, 'felice'], [98.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Il profumo si sparge: perché\nnon torna nella boccetta?'],
  [7.9, 12.8, 'Una scatola divisa a metà: a sinistra\n40 molecole, a destra il vuoto.'],
  [13.0, 17.6, 'Tolgo la parete: le molecole\nrimbalzano e si sparpagliano.'],
  [17.8, 22.3, 'Presto sono metà e metà, più o meno,\ne restano così.'],
  [22.5, 26.7, 'Nessuna legge del moto vieta\nche tornino tutte a sinistra.'],
  [26.9, 31.1, 'Eppure non succede mai. Perché?'],
  [31.3, 35.7, 'Contiamo con 4 molecole: ognuna\nsta a sinistra o a destra.'],
  [35.9, 40.3, 'In tutto 2·2·2·2 = 16 modi.\nTutte a sinistra: uno solo.'],
  [40.5, 44.9, 'Metà e metà: 6 modi su 16,\nil caso più probabile.'],
  [45.1, 50.1, 'Ecco 4 molecole che rimbalzano:\nogni tanto sono tutte a sinistra.'],
  [50.3, 54.5, 'Probabilità 1/16: con 4 molecole\nsuccede spesso.'],
  [54.7, 58.9, 'Con 100 molecole tutte a sinistra:\n{mink:(1/2)¹⁰⁰ ≈ 8·10⁻³¹}.'],
  [59.1, 64.0, 'Un miliardo di occhiate al secondo\nper 13,8 miliardi di anni: quasi mai.'],
  [64.2, 68.4, 'E in un litro d’aria le molecole\nsono circa {mink:2,5·10²²}!'],
  [68.6, 74.0, 'Lo stato sparso si ottiene in moltissimi\nmodi: è di gran lunga il più probabile.'],
  [74.2, 78.7, 'Per Boltzmann l’{v:entropia} {mink:S} cresce col\nnumero {mink:W} di modi, i {v:microstati}.'],
  [78.9, 83.4, 'In un sistema isolato {mink:S} non cala mai:\n{g:cresce} nei processi irreversibili.'],
  [83.6, 87.6, 'Per questo il film al contrario\nci sembra impossibile.'],
  [87.8, 92.1, 'Si parla di «disordine» che cresce:\nè un’immagine, non la definizione.'],
  [94.8, 99.8, 'Da solo un sistema isolato va dove\nci sono più modi: l’entropia cresce.'],
];

// ---------- aiutanti ----------
function rng(seed) {   // numeri «a caso» sempre uguali (mulberry32)
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let q = Math.imul(a ^ a >>> 15, 1 | a); q = (q + Math.imul(q ^ q >>> 7, 61 | q)) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; };
}
const piega = u => { u = ((u % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // avanti e indietro fra 0 e 1: il rimbalzo
const verso = u => (((u % 2) + 2) % 2) < 1 ? 1 : -1;                     // da che parte va, dopo i rimbalzi
const COL4 = () => [C.x, C.v, C.g, C.y];                                   // i colori delle 4 molecole numerate

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché non torna indietro', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
// ---------- la scatola con 40 molecole: rimbalzi esatti, la parete si toglie a T_REM ----------
const BX0 = 180, BX1 = 1080, BY0 = 200, BY1 = 600, RB = 9, T_REM = 13.6;
const MEZZA = (BX1 - BX0) / 2 - 2 * RB, TUTTA = BX1 - BX0 - 2 * RB, ALTA = BY1 - BY0 - 2 * RB, XM = (BX0 + BX1) / 2;
const MOL = (() => { const r = rng(214), m = []; for (let i = 0; i < 40; i++) m.push({ ux: r(), uy: r(), vx: (r() < .5 ? -1 : 1) * (60 + 240 * r()), vy: (r() < .5 ? -1 : 1) * (40 + 90 * r()) }); return m; })();   // seme scelto: si sparpagliano in 2–3 s, poi fra 14 e 26 per parte
function pos40(m, tau) {
  const y = BY0 + RB + piega(m.uy + m.vy * tau / ALTA) * ALTA;
  if (tau < T_REM) return [BX0 + RB + piega(m.ux + m.vx * tau / MEZZA) * MEZZA, y];
  const u = m.ux + m.vx * T_REM / MEZZA, x0 = piega(u) * MEZZA, d = verso(u);   // dove era e dove andava quando si è tolta la parete
  return [BX0 + RB + piega((x0 + m.vx * d * (tau - T_REM)) / TUTTA) * TUTTA, y];
}
const aSinistra = tau => MOL.filter(m => pos40(m, tau)[0] < XM).length;
// il film al contrario (ipotesi): il tempo della scatola torna indietro fino a prima che si togliesse la parete
const tauAlContrario = t => Math.max(T_REM - .2, T_REM + 4.3 - (t - 83.6) * 1.2);
function scenaScatola(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1040, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  const al = Math.max(life(t, 7.8, 31.1, .6, .4), life(t, 68.7, T_FINE + .1, .5, .5));
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const rv = life(t, 83.6, 87.6, .4, .4);
  txt(ctx, rv > .5 ? '' : '40 molecole', 630, 160, { size: 32, color: C.dim });
  ctx.fillStyle = css(C.x, .06); ctx.fillRect(BX0, BY0, BX1 - BX0, BY1 - BY0);
  // le molecole vere, e (nell'ipotesi) quelle del film al contrario, in rosso
  ctx.fillStyle = css(C.x, .85 * (1 - rv));
  for (const m of MOL) { const [x, y] = pos40(m, t); ctx.beginPath(); ctx.arc(x, y, RB, 0, Math.PI * 2); ctx.fill(); }
  if (rv > 0) {
    const tau = tauAlContrario(t);
    ctx.fillStyle = css(C.r, .85 * rv);
    for (const m of MOL) { const [x, y] = pos40(m, tau); ctx.beginPath(); ctx.arc(x, y, RB, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= rv; ctx.strokeStyle = css(C.r, .7); ctx.lineWidth = 4; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.roundRect(140, 130, 980, 640, 18); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{r:il film al contrario: mai visto}', 630, 160, { size: 34, alpha: rv });
  }
  // la parete divisoria, che si alza e sparisce
  const kp = 1 - P(t, 13.2, 13.9);
  if (kp > 0) { ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(C.ink); ctx.fillRect(XM - 5, BY0 - (1 - kp) * 300, 10, BY1 - BY0); ctx.restore(); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 7; ctx.strokeRect(BX0 - 4, BY0 - 4, BX1 - BX0 + 8, BY1 - BY0 + 8);
  // la metà, tratteggiata, dopo che la parete è sparita
  M.dashed(ctx, [XM, BY0], [XM, BY1], C.dim, 1, .6 * P(t, 14.0, 14.6));
  txt(ctx, 'sinistra', (BX0 + XM) / 2, BY1 + 40, { size: 30, color: C.dim }); txt(ctx, 'destra', (XM + BX1) / 2, BY1 + 40, { size: 30, color: C.dim });
  ctx.restore();
}
// le due barre: quante a sinistra, quante a destra (7,5 px per molecola)
function scenaConteggio(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 1190, 110, 620, 680, life(t, 8.0, T_FINE + .1, .6, .5));
  const al = life(t, 8.0, 31.1, .6, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'quante da che parte', 1500, 165, { size: 38, weight: 600 }));
  const n = aSinistra(t), base = 640;
  [[1360, n, 'a sinistra'], [1640, 40 - n, 'a destra']].forEach(([x, v, nome]) => {
    ctx.fillStyle = css(C.x, .55); ctx.fillRect(x - 70, base - v * 7.5, 140, v * 7.5);
    M.fixedNum(ctx, String(v), x + (v > 9 ? 28 : 14), base - 34, 44, C.ink);   // dentro la barra: la riga della metà non lo copre mai
    txt(ctx, nome, x, base + 36, { size: 30, color: C.dim });
  });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1260, base); ctx.lineTo(1740, base); ctx.stroke();
  const km = P(t, 18.0, 18.5);
  M.dashed(ctx, [1270, base - 150], [1740, base - 150], C.g, 1, .8 * km);
  txt(ctx, 'tratteggio: metà, 20', 1500, 228, { size: 30, color: C.g, alpha: km });
  ctx.restore();
}

// ---------- contare i modi: 4 molecole, 16 disposizioni ----------
const DISPOSIZIONI = (() => { const col = [[], [], [], [], []]; for (let b = 0; b < 16; b++) { let k = 0; for (let i = 0; i < 4; i++) k += b >> i & 1; col[4 - k].push(b); } return col; })();
function scenaModi(ctx, t) {
  if (t < 31.0 || t > 68.6) return;
  const al = life(t, 31.4, 68.4, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, 'molecole a sinistra', 630, 160, { size: 32, color: C.dim });
  const evid = [life(t, 37.6, 40.3, .3, .3), 0, life(t, 40.6, 44.9, .3, .3), 0, 0];
  DISPOSIZIONI.forEach((lista, c) => {
    const cx = 220 + c * 205;
    txt(ctx, String(4 - c), cx, 206, { size: 38, weight: 600 });
    lista.forEach((b, r) => {
      const k = P(t, 36.0 + c * .3 + r * .08, 36.4 + c * .3 + r * .08, E.out);
      if (k <= 0) return;
      const y = 262 + r * 64;
      ctx.save(); ctx.globalAlpha *= k;
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.strokeRect(cx - 75, y - 25, 150, 50);
      ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(cx, y - 25); ctx.lineTo(cx, y + 25); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < 4; i++) {
        const x = (b >> i & 1) ? cx - 62 + i * 14 : cx + 20 + i * 14;
        ctx.fillStyle = css(COL4()[i]); ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
    const kc = P(t, 37.2 + c * .2, 37.6 + c * .2);
    txt(ctx, lista.length === 1 ? '1 modo' : lista.length + ' modi', cx, 648, { size: 32, weight: evid[c] > .5 ? 600 : 500, color: evid[c] > .5 ? C.g : C.ink, alpha: kc });
    if (evid[c] > 0) {
      ctx.save(); ctx.globalAlpha *= evid[c]; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(cx - 90, 180, 180, 494, 16); ctx.stroke(); ctx.restore();
    }
  });
  drawRich(ctx, '{dim:in tutto: }16{dim: = 2·2·2·2}', 630, 720, { size: 34, local: t - 36.4 });
  ctx.restore();
}
// 4 molecole che rimbalzano (seme scelto perché, nel tratto mostrato, «tutte a sinistra» capiti due volte, circa 1/16 del tempo)
const X4 = 1240, Y4 = 215, R4 = 12, W4 = 520 - 2 * R4, H4 = 270 - 2 * R4, T4 = 45.1;
const MOL4 = (() => { const r = rng(361), q = rng(1361), m = []; for (let i = 0; i < 4; i++) { const sg = r() < .5 ? -1 : 1, v = 90 + 130 * r(); m.push({ ux: r(), vx: sg * v, uy: q(), vy: (q() < .5 ? -1 : 1) * (70 + 90 * q()) }); } return m; })();
const pos4 = (m, t) => { const u = Math.max(t, T4) - T4; return [X4 + R4 + piega(m.ux + m.vx * u / W4) * W4, Y4 + R4 + piega(m.uy + m.vy * u / H4) * H4]; };
const tutteSx = t => MOL4.every(m => pos4(m, t)[0] < X4 + 260);
const EPISODI = (() => { const ev = []; let dentro = false; for (let t = T4; t <= 58.9; t += .005) { const s = tutteSx(t); if (s && !dentro) ev.push(t); dentro = s; } return ev; })();
function scenaQuattro(ctx, t) {
  if (t < 31.0 || t > 68.6) return;
  const k4 = life(t, 31.4, 54.6, .5, .4);
  if (k4 > 0) {
    ctx.save(); ctx.globalAlpha *= k4;
    conFont(TITOLI, () => drawRich(ctx, 'quattro molecole', 1500, 165, { size: 38, weight: 600 }));
    const tutte = tutteSx(t) && t >= T4;
    if (tutte) { ctx.fillStyle = css(C.g, .18); ctx.fillRect(X4, Y4, 260, 270); }
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.strokeRect(X4 - 3, Y4 - 3, 526, 276);
    M.dashed(ctx, [X4 + 260, Y4], [X4 + 260, Y4 + 270], C.dim, 1, .7);
    MOL4.forEach((m, i) => { const [x, y] = pos4(m, t); ctx.fillStyle = css(COL4()[i]); ctx.beginPath(); ctx.arc(x, y, R4, 0, Math.PI * 2); ctx.fill(); });
    const n = MOL4.filter(m => pos4(m, t)[0] < X4 + 260).length;
    drawRich(ctx, '{dim:a sinistra: }' + n, 1500, 568, { size: 36 });
    const volte = EPISODI.filter(e => e <= t).length, kv = P(t, 45.3, 45.7);
    drawRich(ctx, '{dim:tutte a sinistra: }{g:' + volte + (volte === 1 ? ' volta' : ' volte') + '}', 1500, 618, { size: 36, alpha: kv });
    drawRich(ctx, '{g:tutte a sinistra!}', X4 + 130, Y4 + 300, { size: 30, alpha: tutte ? 1 : 0 });
    drawRich(ctx, '{dim:probabilità }{g:1/16}', 1500, 690, { size: 40, local: t - 50.5 });
    ctx.restore();
  }
  const kc = life(t, 54.8, 68.4, .5, .5);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, 'cento molecole', 1500, 165, { size: 38, weight: 600 }));
    drawRich(ctx, '{dim:tutte a sinistra}', 1500, 240, { size: 32 });
    drawRich(ctx, '{mink:(1/2)¹⁰⁰ ≈ 8·10⁻³¹}', 1500, 305, { size: 54, local: t - 55.0 });
    drawRich(ctx, '{dim:un miliardo di occhiate al secondo}', 1500, 395, { size: 30, local: t - 59.3 });
    drawRich(ctx, '{dim:per 13,8 miliardi di anni:}', 1500, 435, { size: 30, local: t - 59.6 });
    drawRich(ctx, '{mink:≈ 4·10²⁶}{dim: occhiate}', 1500, 488, { size: 36, local: t - 60.0 });
    drawRich(ctx, '{dim:volte attese: }{mink:≈ 3·10⁻⁴}', 1500, 540, { size: 36, local: t - 60.6 });
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.globalAlpha *= P(t, 64.3, 64.7);
    ctx.beginPath(); ctx.moveTo(1250, 590); ctx.lineTo(1750, 590); ctx.stroke();
    drawRich(ctx, '{dim:un litro d’aria:}', 1500, 640, { size: 30 });
    drawRich(ctx, '{mink:≈ 2,5·10²²}{dim: molecole}', 1500, 690, { size: 36 });
    ctx.restore();
  }
}

// ---------- l'entropia (68,6–92,6) ----------
function scenaEntropia(ctx, t) {
  if (t < 68.4 || t > T_FINE + .3) return;
  const al = life(t, 68.7, T_FINE + .1, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'entropia', 1500, 165, { size: 38, weight: 600 }));
  drawRich(ctx, '{dim:tutte a sinistra: }1{dim: modo}', 1500, 245, { size: 32, local: t - 68.9 });
  drawRich(ctx, '{dim:sparse: }{g:moltissimi modi}', 1500, 292, { size: 32, local: t - 69.5 });
  drawRich(ctx, '{mink:S = k·ln W}', 1500, 392, { size: 60, local: t - 74.4 });
  drawRich(ctx, '{mink:W}{dim: numero di modi: i }{v:microstati}', 1500, 462, { size: 30, local: t - 75.0 });
  drawRich(ctx, '{mink:k}{dim: costante di Boltzmann}', 1500, 504, { size: 30, local: t - 75.4 });
  const ks = P(t, 79.1, 79.5);
  ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1250, 548); ctx.lineTo(1750, 548); ctx.stroke(); ctx.restore();
  drawRich(ctx, '{dim:sistema isolato:}', 1500, 590, { size: 30, local: t - 79.2 });
  drawRich(ctx, '{mink:S}{g: non cala mai}', 1500, 638, { size: 44, local: t - 79.6 });
  drawRich(ctx, '{dim:se è irreversibile, }{mink:S}{g: cresce}', 1500, 688, { size: 32, local: t - 80.8 });
  drawRich(ctx, '{dim:«disordine»: solo un’immagine}', 1500, 746, { size: 30, local: t - 88.1 });
  ctx.restore();
}

// in una frase (92,3–102,4); tre pillole (ΔS = Q/T tolta il 7/10: non compariva nel corpo del video)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.3, 101.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.5 });
    drawRich(ctx, 'Da solo un sistema isolato va dove\nci sono più modi: l’{v:entropia} cresce.', W / 2, 290, { size: 66, weight: 600, local: t - 92.9, stagger: .09 });
  });
  const pills = [[480, 'tutte a sinistra:\n{mink:(1/2)ⁿ} con {mink:n} molecole'], [960, '{mink:S = k·ln W}\n{mink:W}: i microstati'],
    [1440, '«disordine»:\nsolo un’immagine']];
  pills.forEach(([x, s], i) => {
    const a = 95.0 + i * .45, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 200, 445, 400, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 36 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}
  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue quante molecole stanno a sinistra, da 0 (0) a 40 (1);
  // i pop dei modi hanno l'altezza del loro numero, da 1 a 6
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .9],                                                // 40 molecole a sinistra
    ['traccia', 13.2, 13.9], ['tono', 13.6, 16.6, [1, .97, .97, .93, .88, .8, .63, .55, .5]],   // tolgo la parete: si sparpagliano
    ['pop', 18.1, .5],                                                                // la metà, 20
    ['soffio', 31.4], ['traccia', 36.0, 37.2],                                        // quattro molecole: le 16 disposizioni
    ['pop', 37.3, .17], ['pop', 37.5, .67], ['pop', 37.7, 1], ['pop', 37.9, .67], ['pop', 38.1, .17],   // 1, 4, 6, 4, 1 modi
    ['pop', 40.7, .7],                                                                // metà e metà: 6 modi su 16
    ['pop', 45.95, .85], ['pop', 50.6, .45], ['pop', 51.67, .85],                     // tutte a sinistra, ogni tanto: 1/16
    ['pop', 55.1, .55], ['pop', 59.4, .4], ['pop', 60.1, .5], ['pop', 60.7, .3],       // cento molecole: quasi mai
    ['pop', 64.4, .6],                                                                // un litro d'aria
    ['soffio', 68.7], ['pop', 69.0, .2], ['pop', 69.6, .85],                          // 1 modo contro moltissimi
    ['pop', 74.5, .6], ['ding', 79.8],                                                // S = k·ln W; S non cala mai
    ['tono', 83.6, 87.4, [.38, .42, .45, .55, .72, .88, .95, .97, 1]],                // il film al contrario
    ['pop', 88.2, .4],                                                                // il disordine: solo un'immagine
    ['soffio', 92.5], ['pop', 95.0, .5], ['pop', 95.45, .6], ['pop', 95.9, .7],       // in una frase
  ];
  return {
    titolo: 'Perché non torna indietro', durata: 102.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.2, 'il gas si allarga'], [31.2, 68.5, 'contare i modi'], [68.5, T_FINE, 'l’entropia']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaScatola(ctx, t); scenaConteggio(ctx, t); scenaModi(ctx, t); scenaQuattro(ctx, t); scenaEntropia(ctx, t); scenaFine(ctx, t); },
  };
});
