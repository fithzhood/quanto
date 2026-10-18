'use strict';
/* Perché la bolla di sapone è colorata — interferenza su una lamina sottile (acqua e sapone, n = 1,33, spessore s).
   La luce si riflette sulla faccia davanti (raggio 1) e su quella dietro (raggio 2); il raggio 2 fa in più 2·s dentro
   l'acqua, dove la lunghezza d'onda è λ/n: in lunghezze d'onda, 2·n·s/λ. In più il raggio 1, riflettendosi su un mezzo
   con n maggiore (dall'aria all'acqua), si capovolge: mezza λ in più; il raggio 2 (dall'acqua all'aria) no.
   Verde 532 nm: con s = 200 nm, 2·n·s = 532 nm = 1 λ, più ½ = 1,5 λ → cresta con gola, il verde si spegne (la lamina
   sembra viola); con s = 300 nm, 2·n·s = 798 nm = 1,5 λ, più ½ = 2 λ → cresta con cresta, il verde si rinforza.
   Spessore quasi zero: resta solo la mezza λ, ogni colore si spegne: la lamina nera prima che la bolla scoppi.
   Calcolo per luce perpendicolare (i raggi del disegno sono inclinati solo per vederli: lo si dice); le due onde
   riflesse hanno la stessa ampiezza (circa vero per acqua e aria). Onde del grafico al rallentatore (un periodo in 2 s).
   I colori della lamina sono calcolati: riflettanza ∝ sin²(2π·n·s/λ), sommata su tutto lo spettro con le funzioni
   colorimetriche CIE 1931 (approssimazione di Wyman, Sloan e Shirley) e convertita in sRGB, normalizzata sul bianco.
   La bolla a destra è più sottile in alto: spessore da 0 a 1000 nm, lineare (illustrazione). Argomento: luce. */
CVIDEO.registra('luce/bolla', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, dashed, dot } = M;
  const TAU = Math.PI * 2, DEG = Math.PI / 180;

const T_FINE = 88.7;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [21.7, 'pensa'], [26.7, 'neutro'],
  [36.3, 'sorpreso'], [41.1, 'neutro'], [50.3, 'pensa'], [55.5, 'sorpreso'], [60.3, 'felice'], [64.9, 'neutro'],
  [69.7, 'festa'], [74.3, 'neutro'], [79.3, 'sorpreso'], [83.9, 'pensa'], [91.2, 'felice'], [95.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Perché una bolla di sapone,\ntrasparente, si colora?'],
  [7.9, 12.3, 'La bolla è una {v:lamina} d’acqua\nspessa poche centinaia di nm.'],
  [12.5, 16.9, 'La luce si riflette sulla faccia\n{x:davanti}: raggio 1…'],
  [17.1, 21.5, '…e su quella {y:dietro}, dopo aver\nattraversato la lamina: raggio 2.'],
  [21.7, 26.5, 'Il raggio 2 fa un tratto in più:\ndue volte lo spessore {mink:s}.'],
  [26.7, 31.3, 'Nell’acqua {mink:λ} si accorcia: diventa {mink:λ/n},\ncon {mink:n} = 1,33.'],
  [31.5, 36.1, 'Quindi in lunghezze d’onda il tratto\nin più vale {mink:2·n·s/λ}.'],
  [36.3, 40.9, 'Un dettaglio: riflettendosi sull’acqua,\nil raggio 1 si {v:capovolge}.'],
  [41.1, 45.5, 'La cresta diventa gola: è come\nmezza {mink:λ} in più.'],
  [45.7, 50.1, 'Dentro, sulla faccia dietro, no:\nlì la luce passa all’aria.'],
  [50.3, 55.3, 'Luce verde, {mink:s} = 200 nm: il tratto\nin più è proprio 1 {mink:λ}…'],
  [55.5, 60.1, '…più la mezza {mink:λ} del capovolgimento:\ncresta con gola, verde {v:spento}.'],
  [60.3, 64.7, 'Senza verde restano rosso e blu:\nla lamina sembra {v:viola}.'],
  [64.9, 69.5, 'Con {mink:s} = 300 nm il tratto in più\nè 1,5 {mink:λ}…'],
  [69.7, 74.1, '…più la mezza fa 2 {mink:λ}:\ncresta con cresta, verde {g:forte}.'],
  [74.3, 79.1, 'La bolla è più spessa in basso: a ogni\nspessore il suo colore.'],
  [79.3, 83.7, 'In cima, prima di scoppiare, è così\nsottile che diventa {v:nera}.'],
  [83.9, 88.5, 'Spessore quasi zero: resta solo il\ncapovolgimento, e si spegne tutto.'],
  [91.2, 97.0, 'I due riflessi si sommano o si spengono:\nil colore dipende dallo spessore.'],
];

// ---------- aiutanti ----------
function chip(ctx, s, x, y, al = 1, size = 30) {
  if (al <= 0) return;
  const w = M.richW(ctx, s, size) + 22;
  ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
  drawRich(ctx, s, x, y, { size, alpha: al });
}
function linea(ctx, a, b, col, w, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function raggio(ctx, a, b, col, al = 1) {   // un tratto di raggio con la punta a metà
  if (al <= 0) return;
  linea(ctx, a, b, col, 5, al);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  arrowHead(ctx, [lerp(a[0], b[0], .55), lerp(a[1], b[1], .55)], ang, col, al);
}

// ---------- i colori della lamina, calcolati dallo spettro (CIE 1931, approssimazione di Wyman, Sloan e Shirley) ----------
const gg = (x, m, s1, s2) => { const t = (x - m) / (x < m ? s1 : s2); return Math.exp(-.5 * t * t); };
const xb = l => 1.056 * gg(l, 599.8, 37.9, 31) + .362 * gg(l, 442, 16, 26.7) - .065 * gg(l, 501.1, 20.4, 26.2);
const yb = l => .821 * gg(l, 568.8, 46.9, 40.5) + .286 * gg(l, 530.9, 16.3, 31.1);
const zb = l => 1.217 * gg(l, 437, 11.8, 36) + .681 * gg(l, 459, 26, 13.8);
const gamma = v => { v = Math.max(0, v); return v <= .0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - .055; };
function rgbSpettro(R) {
  let X = 0, Y = 0, Z = 0;
  for (let l = 380; l <= 730; l += 5) { const r = R(l); X += r * xb(l); Y += r * yb(l); Z += r * zb(l); }
  return [3.2406 * X - 1.5372 * Y - .4986 * Z, -.9689 * X + 1.8758 * Y + .0415 * Z, .0557 * X - .2040 * Y + 1.0570 * Z];
}
const N_ACQUA = 1.33, BIANCO = rgbSpettro(() => 1);
const riflessa = (s, l) => Math.pow(Math.sin(2 * Math.PI * N_ACQUA * s / l), 2);   // ∝ 1 − cos(4π·n·s/λ): due onde, una capovolta
const COLORI = (() => { const out = []; for (let s = 0; s <= 1000; s += 2) { const c = rgbSpettro(l => riflessa(s, l)); out.push(c.map((v, i) => 255 * Math.min(1, gamma(1.15 * v / BIANCO[i])))); } return out; })();
const colLamina = s => COLORI[clamp(Math.round(s / 2), 0, COLORI.length - 1)];

// ---------- lo spessore e lo sfasamento ----------
const LAM = 532;                                                      // verde, nm
const sp = t => kf(t, [[50.3, 200], [64.9, 200], [65.7, 300], [79.3, 300], [80.3, 10]]);   // nm
const ritardo = s => 2 * N_ACQUA * s / LAM;                           // il tratto in più, in lunghezze d'onda

// ---------- la lamina in sezione (spessore molto ingrandito) ----------
const FT = 470, AX = 300, TI = 20 * DEG, TR = Math.asin(Math.sin(TI) / N_ACQUA), YTOP = 190;
function geometria(t) {
  const h = 120 * sp(t) / 200, A = [AX, FT], B = [AX + h * Math.tan(TR), FT + h], Cc = [AX + 2 * h * Math.tan(TR), FT];
  const L = (FT - YTOP) * Math.tan(TI);
  return { h, A, B, Cc, I0: [AX - L, YTOP], R1: [AX + L, YTOP], R2: [Cc[0] + L, YTOP] };
}
function onda(ctx, x0, x1, y, lam, amp, col, w = 4, fase = 0) {
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let x = x0; x <= x1; x += 2) { const v = y - amp * Math.sin(TAU * (x - x0) / lam - fase); x === x0 ? ctx.moveTo(x, v) : ctx.lineTo(x, v); }
  ctx.stroke(); ctx.restore();
}
function scenaSezione(ctx, t) {
  const al = life(t, 7.6, T_FINE, .6, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const G = geometria(t);
  // la lamina
  ctx.save(); ctx.fillStyle = css(C.x, .18); ctx.fillRect(140, FT, 520, G.h); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(140, FT); ctx.lineTo(660, FT); ctx.moveTo(140, FT + G.h); ctx.lineTo(660, FT + G.h); ctx.stroke(); ctx.restore();
  txt(ctx, 'aria', 620, 250, { size: 30, color: C.dim });
  txt(ctx, 'aria', 230, FT + G.h + 60, { size: 30, color: C.dim });
  txt(ctx, 'acqua e sapone', 650, FT + G.h - 24, { size: 30, color: C.x, align: 'right', alpha: clamp((G.h - 70) / 30) });
  chip(ctx, '{dim:spessore ingrandito moltissimo}', 400, 760, P(t, 8.2, 8.8), 30);
  // lo spessore s
  const ks = P(t, 21.9, 22.4);
  if (ks > 0 && G.h > 8) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(180, FT); ctx.lineTo(180, FT + G.h); ctx.moveTo(170, FT); ctx.lineTo(190, FT); ctx.moveTo(170, FT + G.h); ctx.lineTo(190, FT + G.h); ctx.stroke(); ctx.restore();
  }
  if (ks > 0) drawRich(ctx, '{mink:s}', 156, FT + Math.max(G.h, 30) / 2, { size: 38, alpha: ks });
  // i raggi: la luce che arriva, il raggio 1 riflesso davanti, il raggio 2 riflesso dietro
  raggio(ctx, G.I0, G.A, C.ink, P(t, 8.3, 8.9));
  chip(ctx, 'luce', G.I0[0], YTOP - 26, P(t, 8.3, 8.9), 30);
  raggio(ctx, G.A, G.R1, C.x, P(t, 12.7, 13.3));
  chip(ctx, '{x:1}', G.R1[0], YTOP - 26, P(t, 12.9, 13.4), 32);
  const k2 = P(t, 17.3, 17.9);
  if (k2 > 0) {
    linea(ctx, G.A, G.B, C.y, 4, k2); linea(ctx, G.B, G.Cc, C.y, 4, k2);
    raggio(ctx, G.Cc, G.R2, C.y, k2);
    chip(ctx, '{y:2}', Math.max(G.R2[0] + 6, G.R1[0] + 46), YTOP - 26, k2, 32);
  }
  // il tratto in più
  const kt = life(t, 21.9, 31.3, .4, .4);
  if (kt > 0) { linea(ctx, G.A, G.B, C.v, 9, kt); linea(ctx, G.B, G.Cc, C.v, 9, kt); chip(ctx, '{v:circa 2}{mink:s}', G.B[0] + 70, G.B[1] + 34, kt, 32); }
  // λ fuori e λ/n dentro (solo illustrazione)
  const kl = life(t, 26.9, 36.1, .4, .4);
  if (kl > 0) {
    ctx.save(); ctx.globalAlpha *= kl;
    onda(ctx, 470, 630, 400, 53, 12, C.g, 3); drawRich(ctx, '{mink:λ}', 450, 400, { size: 34, align: 'right' });
    onda(ctx, 470, 630, FT + 40, 40, 12, C.g, 3); drawRich(ctx, '{mink:λ/n}', 450, FT + 40, { size: 34, align: 'right' });
    ctx.restore();
  }
  // il capovolgimento: sulla faccia davanti sì, su quella dietro no
  const kc = life(t, 36.5, 50.1, .4, .4);
  if (kc > 0) { ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(AX, FT, 16, 0, TAU); ctx.stroke(); ctx.restore(); }
  chip(ctx, '{v:si capovolge}', 505, FT - 40, kc, 30);
  // il capovolgimento in piccolo: la cresta che arriva torna indietro come gola
  const km = life(t, 41.2, 45.6, .4, .4);
  if (km > 0) { ctx.save(); ctx.globalAlpha *= km; onda(ctx, 440, 500, FT - 100, 40, 13, C.ink, 3); arrowHead(ctx, [522, FT - 100], 0, C.v, .8); onda(ctx, 535, 595, FT - 100, 40, -13, C.x, 3); ctx.restore(); chip(ctx, '{dim:cresta} → {x:gola}', 518, FT - 150, km, 30); }
  chip(ctx, '{dim:non si capovolge}', G.B[0] + 150, G.B[1] + 36, life(t, 45.9, 50.1, .4, .4), 30);
  ctx.restore();
}

// ---------- a destra nella stessa scheda: i conti, poi le due onde riflesse ----------
const GX0 = 870, GX1 = 1250, LG = 127, AG = 36;                     // il grafico: tre lunghezze d'onda
function scenaConti(ctx, t) {
  const al = life(t, 21.7, T_FINE, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const cx = 985, r = (s, y, a, size = 34) => { if (a > 0) drawRich(ctx, s, cx, y, { size, alpha: a }); };
  // le idee, una alla volta (21,7–50,1)
  const kI = 1 - P(t, 50.1, 50.5);
  if (kI > 0) {
    r('{v:tratto in più}: {mink:2·s}', 200, P(t, 21.9, 22.4) * kI);
    r('{dim:(conti per luce perpendicolare)}', 250, P(t, 22.4, 22.9) * kI, 30);
    r('nell’acqua {mink:λ} diventa {mink:λ/n}', 330, P(t, 26.9, 27.4) * kI);
    r('{mink:n} = 1,33: indice di rifrazione dell’acqua', 377, P(t, 27.4, 27.9) * kI, 30);
    if (t > 31.6) drawSeq(ctx, ['in lunghezze d’onda:', { num: '{mink:2·s}', den: '{mink:λ/n}' }, '{mink:= 2·n·s/λ}'], cx, 450, 34, { local: t - 31.7, alpha: kI });
    r('raggio {x:1}: {v:capovolto}, + ½ {mink:λ}', 545, P(t, 41.3, 41.8) * kI);
    r('raggio {y:2}: {dim:niente}', 610, P(t, 45.9, 46.4) * kI);
  }
  // le due onde riflesse e la loro somma (50,3–88,7)
  const kG = P(t, 50.4, 51.0);
  if (kG > 0) {
    ctx.save(); ctx.globalAlpha *= kG;
    const s = sp(t), d = ritardo(s), fase = TAU * t / 2;   // un periodo ogni 2 s, al rallentatore
    const tot = d + .5;
    const riga1 = s > 150 ? '{mink:s} = ' + Math.round(s) + ' nm' : '{mink:s} ≈ 10 nm';
    r(riga1 + '{dim:, verde} {mink:λ} = 532 nm', 175, 1, 32);
    const sTxt = t < 64.9 ? '{mink:2·n·s} = 532 nm = 1 {mink:λ}' : t < 65.7 ? '…' : t < 79.3 ? '{mink:2·n·s} = 798 nm = 1,5 {mink:λ}' : t < 80.3 ? '…' : '{mink:2·n·s} ≈ 0';
    r(sTxt, 225, 1, 32);
    const esito = t < 64.9 ? '+ ½ = 1,5 {mink:λ}: {v:spento}' : t < 65.7 ? '' : t < 79.3 ? '+ ½ = 2 {mink:λ}: {g:forte}' : t < 80.3 ? '' : 'resta ½ {mink:λ}: {v:buio} per ogni colore';
    const kE = t < 64.9 ? P(t, 55.7, 56.2) : t < 79.3 ? P(t, 69.9, 70.4) : P(t, 84.1, 84.6);
    if (esito) r(esito, 275, kE, 32);
    // le righe del grafico
    const righe = [[355, '{x:raggio 1}', C.x, x => -Math.sin(TAU * (x - GX0) / LG - fase)],
      [465, '{y:raggio 2}', C.y, x => Math.sin(TAU * (x - GX0) / LG - fase - TAU * d)],
      [610, '{g:somma}', C.g, x => -Math.sin(TAU * (x - GX0) / LG - fase) + Math.sin(TAU * (x - GX0) / LG - fase - TAU * d)]];
    righe.forEach(([y, nome, col, f], i) => {
      ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX0, y); ctx.lineTo(GX1, y); ctx.stroke();
      drawRich(ctx, nome, GX0 - 20, y, { size: 30, align: 'right' });
      ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = i === 2 ? 6 : 4; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let x = GX0; x <= GX1; x += 2) { const v = y - AG * f(x); x === GX0 ? ctx.moveTo(x, v) : ctx.lineTo(x, v); }
      ctx.stroke(); ctx.restore();
    });
    txt(ctx, 'al rallentatore', GX1, 745, { size: 30, color: C.dim, align: 'right' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la lamina di sapone, verticale: più sottile in alto ----------
const BX = 1525, BY = 480, BRX = 165, BRY = 270, BY0 = BY - BRY, BY1 = BY + BRY;
const spBolla = y => clamp((y - BY0) / (BY1 - BY0)) * 1000;          // nm, da 0 in cima a 1000 in fondo
const yBolla = s => BY0 + s / 1000 * (BY1 - BY0);
function scenaBolla(ctx, t) {
  if (t < 7.6 || t > T_FINE + .3) return;
  const al = life(t, 7.8, T_FINE, .5, .5);
  card(ctx, 1320, 110, 490, 690, al);
  ctx.save(); ctx.globalAlpha *= al;
  const kb = P(t, 8.2, 9.2);
  ctx.save(); ctx.globalAlpha *= kb;
  ctx.beginPath(); ctx.ellipse(BX, BY, BRX, BRY, 0, 0, TAU); ctx.save(); ctx.clip();
  for (let y = BY0; y < BY1; y += 2) { ctx.fillStyle = css(colLamina(spBolla(y + 1))); ctx.fillRect(BX - BRX, y, 2 * BRX, 2.4); }
  ctx.restore();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 7; ctx.stroke();   // il bordo
  ctx.restore();
  // la scala degli spessori
  const kS = P(t, 74.5, 75.0);
  if (kS > 0) {
    ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    for (let s = 0; s <= 1000; s += 200) { const y = yBolla(s); ctx.beginPath(); ctx.moveTo(1700, y); ctx.lineTo(1716, y); ctx.stroke(); txt(ctx, String(s), 1724, y, { size: 30, align: 'left' }); }
    txt(ctx, 'nm', 1724, BY0 - 36, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  // le strisce di cui si parla: 200 nm (verde spento), 300 nm (verde forte), la cima nera
  const fascia = (s, col, a, nome) => {
    if (a <= 0) return; const y = yBolla(s), half = Math.sqrt(1 - Math.pow((y - BY) / BRY, 2)) * BRX;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.strokeRect(BX - half - 6, y - 9, 2 * half + 12, 18); ctx.restore();
    chip(ctx, nome, BX, y + 40, a, 30);
  };
  fascia(200, C.v, life(t, 60.4, 64.8, .4, .4), '{v:200 nm: viola}');
  fascia(300, C.g, life(t, 69.9, 74.2, .4, .4), '{g:300 nm: verde}');
  chip(ctx, '{v:qui è nera}', BX, BY0 - 26, life(t, 79.5, T_FINE, .4, .4), 30);
  txt(ctx, 'la bolla', BX, 136, { size: 30, color: C.dim, alpha: kb });
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché la bolla è colorata', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaCarta(ctx, t) {
  if (t < 7.4 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1180, 690, life(t, 7.6, T_FINE, .6, .5));
}
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 98.1, 98.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due riflessi che si sommano o si spengono:\nil colore dice lo spessore.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'tratto in più:\n{mink:2·n·s/λ}'], [960, 'faccia davanti:\n{v:capovolto}, + ½ {mink:λ}'], [1430, 'spessore quasi zero:\nlamina {v:nera}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node)
  const verifica = {
    s200: { tratto: ritardo(200), totale: ritardo(200) + .5, verdeRiflesso: +riflessa(200, LAM).toFixed(4) },
    s300: { tratto2ns: 2 * N_ACQUA * 300, tratto: +ritardo(300).toFixed(4), totale: +(ritardo(300) + .5).toFixed(4), verdeRiflesso: +riflessa(300, LAM).toFixed(4) },
    s10: { tratto: +ritardo(10).toFixed(4), verdeRiflesso: +riflessa(10, LAM).toFixed(4) },
    angoloDentro: +(TR / DEG).toFixed(2),
    colori: [0, 100, 200, 300, 400].map(s => colLamina(s).map(Math.round).join(',')),
  };
  // effetti sonori (strumenti/suoni-sintesi.py): quando la lamina cambia spessore (sp(t)) il tono lo segue, da 0 (0)
  // a 300 nm (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .6], ['pop', 8.3, .5],                              // la lamina e la bolla, la luce
    ['pop', 12.7, .55], ['pop', 17.3, .45],                                           // raggio 1 davanti, raggio 2 dietro
    ['pop', 21.9, .5], ['pop', 26.9, .5], ['pop', 31.7, .55],                         // il tratto in più, λ/n, 2·n·s/λ
    ['pop', 36.5, .5], ['pop', 41.2, .3], ['pop', 45.9, .4],                          // si capovolge: cresta → gola; dietro no
    ['soffio', 50.4], ['ding', 55.9],                                                 // le due onde riflesse: verde spento
    ['pop', 60.4, .5],                                                                // 200 nm: viola
    ['tono', 64.9, 65.7, [.67, .69, .83, .98, 1]],                                    // lo spessore sale a 300 nm
    ['pop', 74.5, .5],                                                                // la scala degli spessori
    ['tono', 79.3, 80.3, [1, .94, .52, .09, .03]], ['pop', 79.5, .2], ['ding', 84.3], // quasi zero: la cima è nera
    ['soffio', 88.9], ['pop', 90.3, .5], ['pop', 90.8, .6], ['pop', 91.3, .7],        // in una frase
  ];
  return {
    titolo: 'Perché la bolla è colorata', durata: 99.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 21.5, 'due riflessi'], [21.5, 50.1, 'il tratto in più e il capovolgimento'], [50.1, 74.1, 'spento o rinforzato'], [74.1, 88.5, 'i colori della bolla']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCarta(ctx, t); scenaSezione(ctx, t); scenaConti(ctx, t); scenaBolla(ctx, t); scenaFine(ctx, t); },
  };
});
