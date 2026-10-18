'use strict';
/* Metà ogni volta — 256 nuclei radioattivi decadono a caso uno per uno (istanti di decadimento estratti da un'esponenziale
   di media T/ln 2 con un seme fisso: 5730) e la legge N = N₀·(1/2)^(t/T) emerge dal conteggio: con questo seme a T restano
   126, a 2T 61, a 3T 31, a 4T 16 (la legge dice 128, 64, 32, 16). Il tempo fisico scorre a 1 T ogni 4 s e si ferma nei fermi
   immagine. Poi il carbonio-14: T = 5730 anni, un osso con un quarto del carbonio-14 di uno vivo ha 2·5730 = 11 460 anni.
   Colori: nuclei da decadere C.v, decaduti C.dim, conteggio C.v, legge (il risultato) C.g. Argomento: nucleare. */
CVIDEO.registra('nucleare/dimezzamento', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.5, 'pensa'], [17.4, 'sorpreso'],
  [22.0, 'felice'], [26.9, 'neutro'], [40.0, 'felice'], [43.6, 'neutro'], [47.7, 'felice'], [52.3, 'neutro'],
  [57.3, 'festa'], [63.4, 'neutro'], [71.1, 'pensa'], [77.8, 'neutro'], [82.7, 'sorpreso'], [87.5, 'felice'],
  [96.5, 'festa'], [99.6, 'occhiolino'],
];
const FUMETTI = [
  [2.3, 6.8, 'Quando decade un nucleo instabile?\nNon si sa. Ma la legge c’è.'],
  [7.9, 12.4, '256 nuclei radioattivi, tutti uguali.\nOgnuno può decadere in ogni istante.'],
  [12.5, 17.3, 'Un nucleo non invecchia: la probabilità\ndi decadere adesso è sempre la stessa.'],
  [17.4, 21.9, 'Guarda: decadono {v:a caso}, uno per uno.\nQuale, non si può prevedere.'],
  [22.0, 26.8, 'Dopo un tempo {mink:T} ne è rimasta circa\nla {g:metà}: 126 su 256.'],
  [26.9, 31.7, '{mink:T} si chiama {g:tempo di dimezzamento}.\nUn altro {mink:T}: di nuovo la metà…'],
  [31.8, 35.8, '…di quel che resta: circa un quarto,\n61 su 256.'],
  [35.9, 39.9, 'Un altro {mink:T}: di nuovo si dimezza…'],
  [40.0, 43.5, '…un {g:ottavo}: 31 su 256.'],
  [43.6, 47.6, 'E ancora un {mink:T}: la curva\nscende sempre più piano…'],
  [47.7, 52.2, '…un sedicesimo, 16. Questa curva\nè un’{g:esponenziale}.'],
  [52.3, 57.2, 'Ogni nucleo è a caso, ma in 256\nseguono una legge precisa: eccola.'],
  [57.3, 63.3, '{mink:N}, i rimasti dopo un tempo {mink:t}:\n{mink:N} = {mink:N₀} · (1/2) elevato a {mink:t}/{mink:T}.'],
  [63.4, 71.0, 'Ogni isotopo ha il suo {mink:T}: uranio-238\n4,5 miliardi di anni, iodio-131 8 giorni.'],
  [71.1, 77.7, 'Il {g:carbonio-14}: {mink:T} = 5730 anni.\nSi forma nell’aria dai raggi cosmici.'],
  [77.8, 82.6, 'Un vivente lo assorbe finché vive;\nda morto, il suo carbonio-14 solo cala.'],
  [82.7, 87.4, 'Un osso ha un {g:quarto} del carbonio-14\ndi uno vivo: due dimezzamenti.'],
  [87.5, 93.7, '2 · 5730 = {g:11 460 anni}:\nè la datazione al radiocarbonio.'],
  [96.5, 102.1, 'Ogni {mink:T} ne resta la metà: non si sa\nquali, ma si sa quanti.'],
];

// ---------- la fisica: tutto viene da qui ----------
const N0 = 256;
// numeri «a caso» ma sempre gli stessi: mulberry32 con un seme fisso
function generatore(seme) {
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// l'istante di decadimento di ogni nucleo (in unità di T): esponenziale di media T/ln 2, così a T ne resta circa metà
const T_DEC = (() => { const rnd = generatore(5730), v = []; for (let i = 0; i < N0; i++) v.push(-Math.log(1 - rnd()) / Math.LN2); return v; })();
const rimasti = s => { let n = 0; for (let i = 0; i < N0; i++) if (T_DEC[i] > s) n++; return n; };
const legge = s => N0 * Math.pow(.5, s);
// il tempo fisico in unità di T: 1 T ogni 4 s, fermo nei fermi immagine
const tf = t => t < 17.5 ? 0 : t < 21.5 ? (t - 17.5) / 4 : t < 27.0 ? 1 : t < 31.0 ? 1 + (t - 27.0) / 4 : t < 36.0 ? 2 : t < 40.0 ? 2 + (t - 36.0) / 4 : t < 43.6 ? 3 : t < 47.6 ? 3 + (t - 43.6) / 4 : 4;
const fermo = t => t < 17.5 || (t >= 21.5 && t < 27.0) || (t >= 31.0 && t < 36.0) || (t >= 40.0 && t < 43.6) || t >= 47.6;

// ---------- la griglia dei nuclei (sinistra) ----------
const SX = [110, 110, 760, 680], DX = [910, 110, 900, 680];
const GX0 = 238, GY0 = 200, PASSO = 36;
function sceneNuclei(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = tf(t), ke = P(t, 7.9, 9.4, E.lin);
  txt(ctx, '256 nuclei', 490, 150, { size: 32, color: C.dim, alpha: P(t, 8.0, 8.5) });
  for (let i = 0; i < N0; i++) {
    const x = GX0 + (i % 16) * PASSO, y = GY0 + Math.floor(i / 16) * PASSO;
    const k = P(ke, i / N0 * .94, i / N0 * .94 + .06, E.back);   // compaiono uno dopo l'altro
    if (k <= 0) continue;
    const td = T_DEC[i], vivo = td > s;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    if (vivo) {
      const g = ctx.createRadialGradient(-4, -4, 1, 0, 0, 12);
      g.addColorStop(0, css(mix(C.v, [255, 255, 255], .4))); g.addColorStop(1, css(C.v));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
    } else {
      // decaduto: un cerchietto vuoto; appena decaduto, un lampo che si allarga (sul tempo fisico, non nei fermi)
      ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.stroke();
      const da = (s - td) * 4;   // secondi di video dal decadimento (solo mentre il tempo scorre)
      if (!fermo(t) && da < .5) { ctx.globalAlpha *= 1 - da / .5; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 10 + 24 * da / .5, 0, TAU); ctx.stroke(); }
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------- il grafico (destra) ----------
const PX = 1360, X_T0 = 1012, PX_T = 176, Y_N0 = 700, PX_N = 400 / N0;
const gx = s => X_T0 + s * PX_T, gy = n => Y_N0 - n * PX_N;
function assi(ctx, al, anni, kT) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(X_T0 - 4, Y_N0); ctx.lineTo(1775, Y_N0); ctx.moveTo(X_T0, Y_N0 + 4); ctx.lineTo(X_T0, 268); ctx.stroke();
  arrowHead(ctx, [1781, Y_N0], 0, C.ink); arrowHead(ctx, [X_T0, 262], -Math.PI / 2, C.ink);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(gx(k), Y_N0 - 2); ctx.lineTo(gx(k), 280); ctx.stroke(); }
  for (const n of [32, 64, 128, 256]) { ctx.beginPath(); ctx.moveTo(X_T0 + 2, gy(n)); ctx.lineTo(1765, gy(n)); ctx.stroke(); }
  // le etichette: in unità di T e in nuclei, oppure in anni e in percentuale (il carbonio-14)
  const ANNI = ['5730', '11 460', '17 190', '22 920'], PERC = { 256: '100%', 128: '50%', 64: '25%', 32: '12,5%' };
  for (let k = 1; k <= 4; k++) {
    drawRich(ctx, '{mink:' + (k > 1 ? k : '') + 'T}', gx(k), Y_N0 + 28, { size: 30, alpha: (1 - anni) * kT });
    txt(ctx, ANNI[k - 1], gx(k), Y_N0 + 28, { size: 30, color: C.dim, alpha: anni });
  }
  for (const n of [32, 64, 128, 256]) {
    txt(ctx, String(n), X_T0 - 12, gy(n), { size: 30, color: C.dim, align: 'right', alpha: 1 - anni });
    txt(ctx, PERC[n], X_T0 - 12, gy(n), { size: 30, color: C.dim, align: 'right', alpha: anni });
  }
  drawRich(ctx, '{dim:tempo} {mink:t}', 1790, Y_N0 + 64, { size: 30, align: 'right', alpha: 1 - anni });
  txt(ctx, 'anni', 1790, Y_N0 + 64, { size: 30, color: C.dim, align: 'right', alpha: anni });
  drawRich(ctx, '{mink:N} {dim:rimasti}', X_T0 + 16, 262, { size: 30, align: 'left' });
  ctx.restore();
}
function curva(ctx, f, s1, col, w, tratt) {
  if (s1 <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (tratt) ctx.setLineDash([10, 8]);
  ctx.beginPath(); for (let i = 0; i <= 200; i++) { const s = s1 * i / 200, p = [gx(s), gy(f(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
}
function esponente(ctx, prima, esp, x, y, size, al = 1) {   // «prima» + esponente piccolo e alzato
  if (al <= 0) return;
  const se = Math.round(size * .6);
  drawRich(ctx, prima, x, y, { size, align: 'right', alpha: al });
  drawRich(ctx, esp, x + 4, y - size * .42, { size: se, align: 'left', alpha: al });
}
function sceneGrafico(ctx, t) {
  const al = life(t, 17.3, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = tf(t), n = rimasti(s), anni = P(t, 71.2, 71.9), kT = P(t, 22.0, 22.5);   // kT: T e la lettura del tempo, da quando Stilla nomina T
  // le letture
  drawRich(ctx, '{mink:t} =', 980, 165, { size: 36, align: 'left', alpha: (1 - anni) * kT });
  fixedNum(ctx, fmtN(s, 2), 1170, 165, 38, C.ink, (1 - anni) * kT); drawRich(ctx, '{mink:T}', 1185, 165, { size: 36, align: 'left', alpha: (1 - anni) * kT });
  drawRich(ctx, '{dim:rimasti:}', 1280, 165, { size: 36, align: 'left', alpha: 1 - anni });
  fixedNum(ctx, String(n), 1500, 165, 38, C.v, 1 - anni); drawRich(ctx, '{dim:su 256}', 1515, 165, { size: 32, align: 'left', alpha: 1 - anni });
  txt(ctx, fermo(t) ? 'fermo immagine' : 'il tempo scorre', 1790, 215, { size: 30, color: C.dim, align: 'right', alpha: (1 - anni) * P(t, 17.4, 17.9) });
  // il carbonio-14 prende il posto delle letture
  drawRich(ctx, '{g:carbonio-14}{dim::} {mink:T} = 5730 anni', PX, 165, { size: 38, alpha: anni });
  drawRich(ctx, '{dim:si forma nell’aria dai raggi cosmici}', PX, 215, { size: 30, alpha: P(t, 73.5, 74.1) });
  assi(ctx, P(t, 17.4, 18.2), anni, kT);
  ctx.save(); ctx.beginPath(); ctx.rect(X_T0, 262, 790, 442); ctx.clip();
  // il conteggio vero: una scala (a gradini) che si disegna col tempo fisico
  if (s > 0) {
    ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(gx(0), gy(N0));
    const ord = T_DEC.slice().sort((a, b) => a - b); let k = N0;
    for (const td of ord) { if (td > s) break; ctx.lineTo(gx(td), gy(k)); k--; ctx.lineTo(gx(td), gy(k)); }
    ctx.lineTo(gx(s), gy(k)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(gx(s), gy(n), 8, 0, TAU); ctx.fill(); ctx.restore();
  }
  // la legge, quando Stilla la nomina: si disegna da 0 a 4,3 T
  const kl = P(t, 53.0, 55.0);
  if (kl > 0) curva(ctx, legge, 4.3 * kl, C.g, 5, false);
  ctx.restore();
  drawRich(ctx, '{g:legge}', gx(2.7), gy(legge(2.7)) - 40, { size: 30, alpha: P(t, 54.0, 54.5) * (1 - anni) });
  drawRich(ctx, '{v:conteggio}', gx(1.3) - 22, gy(rimasti(1.3)) + 40, { size: 30, align: 'right', alpha: P(t, 54.0, 54.5) * (1 - anni) });
  // la metà a T, il quarto a 2T: segni sul grafico, solo mentre se ne parla
  const k1 = life(t, 21.9, 31.8, .4, .5);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(gx(1), Y_N0); ctx.lineTo(gx(1), gy(128)); ctx.lineTo(X_T0, gy(128)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:metà}', gx(1) + 20, gy(128) - 30, { size: 32, align: 'left', alpha: k1 });
  }
  const k2 = life(t, 31.8, 36.0, .4, .5);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(gx(2), Y_N0); ctx.lineTo(gx(2), gy(64)); ctx.lineTo(X_T0, gy(64)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:un quarto}', gx(2) + 20, gy(64) - 30, { size: 32, align: 'left', alpha: k2 });
  }
  const k3 = life(t, 40.0, 43.6, .4, .5);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(gx(3), Y_N0); ctx.lineTo(gx(3), gy(32)); ctx.lineTo(X_T0, gy(32)); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:un ottavo}', gx(3) + 20, gy(32) - 34, { size: 32, align: 'left', alpha: k3 });
  }
  // la formula e gli esempi, in alto a destra nel grafico
  const kf = life(t, 57.3, 71.1, .5, .5);
  if (kf > 0) {
    esponente(ctx, '{mink:N} = {mink:N₀} · (1/2)', '{mink:t}/{mink:T}', 1600, 330, 44, kf);
    drawRich(ctx, '{dim:con} {mink:N₀} = 256', 1540, 395, { size: 30, alpha: kf * P(t, 58.3, 58.8) });
  }
  const ke = life(t, 63.4, 71.1, .5, .5);
  if (ke > 0) {
    drawRich(ctx, '{dim:uranio-238:} {mink:T} ≈ 4,5 miliardi di anni', 1540, 460, { size: 30, alpha: ke * P(t, 64.0, 64.5) });
    drawRich(ctx, '{dim:iodio-131:} {mink:T} ≈ 8 giorni', 1540, 508, { size: 30, alpha: ke * P(t, 67.2, 67.7) });
  }
  // il reperto: un quarto del carbonio-14 → 2T → 11 460 anni
  const kr = P(t, 82.9, 83.5);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.moveTo(X_T0, gy(64)); ctx.lineTo(gx(2), gy(64)); ctx.stroke();
    const kv = P(t, 87.6, 88.3);
    if (kv > 0) { ctx.beginPath(); ctx.moveTo(gx(2), gy(64)); ctx.lineTo(gx(2), lerp(gy(64), Y_N0, kv)); ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(gx(2), gy(64), 9, 0, TAU); ctx.fill(); ctx.restore();
    drawRich(ctx, '{dim:l’osso:} {g:un quarto}', gx(2) + 24, gy(64) - 34, { size: 32, align: 'left', alpha: kr });
    drawRich(ctx, '{dim:(un vivente: 100%)}', 1480, 320, { size: 30, alpha: P(t, 83.7, 84.2) });
    drawRich(ctx, '{dim:due dimezzamenti}', 1480, 400, { size: 30, alpha: P(t, 85.1, 85.6) });
    drawRich(ctx, '2 · 5730 = {g:11 460 anni}', 1480, 460, { size: 38, alpha: P(t, 87.7, 88.2) });
  }
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...SX, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DX, life(t, 17.2, T_FINE + .1, .5, .5));
}
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Metà ogni volta', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 103.1, 104.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Ogni tempo {mink:T} ne resta la metà:\nnon si sa quali, ma si sa quanti.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:N} = {mink:N₀} · (1/2) {dim:elevato a} {mink:t}/{mink:T}\n{dim:dopo 2}{mink:T}{dim: ne resta un quarto}'], [960, 'ogni nucleo decade {v:a caso}\n{dim:la legge vale per} {g:tanti} {dim:nuclei}'], [1470, 'carbonio-14: {mink:T} = 5730 anni\n{dim:un quarto →} {g:11 460 anni}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 31, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // i toni del decadimento seguono i nuclei rimasti (contati rieseguendo il seme 5730 con node)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 7.9, 9.4, [.1, .5, .9]],                                // compaiono i 256 nuclei
    ['soffio', 17.3], ['traccia', 17.4, 18.2],                                        // il grafico
    ['tono', 17.5, 21.5, [.95, .8, .71, .6, .49]],                                    // decadono a caso: primo T
    ['traccia', 21.9, 22.3], ['ding', 22.0],                                          // la metà: 126
    ['tono', 27.0, 31.0, [.49, .42, .35, .3, .26]],                                   // secondo T
    ['traccia', 31.8, 32.2], ['ding', 31.8],                                          // un quarto: 61
    ['tono', 36.0, 40.0, [.26, .24, .22, .19, .16]],                                  // terzo T
    ['traccia', 40.0, 40.4], ['ding', 40.0],                                          // un ottavo: 31
    ['tono', 43.6, 47.6, [.16, .14, .13, .12, .11]], ['ding', 47.7],                  // quarto T: 16
    ['traccia', 53.0, 55.0], ['tono', 53.0, 55.0, [.95, .8, .25, .1, .1]],            // la legge si disegna
    ['pop', 54.0, .5],                                                                // legge e conteggio
    ['pop', 58.3, .5],                                                                // N0 = 256
    ['pop', 64.0, .4], ['pop', 67.2, .6],                                             // uranio-238, iodio-131
    ['soffio', 71.2], ['pop', 73.5, .5],                                              // il carbonio-14
    ['traccia', 82.9, 83.5], ['pop', 82.9, .45],                                      // l'osso: un quarto
    ['pop', 83.7, .5], ['pop', 85.1, .5],                                             // un vivente, due dimezzamenti
    ['traccia', 87.6, 88.3], ['ding', 87.7],                                          // 11 460 anni
    ['soffio', 94.3], ['pop', 96.3, .5], ['pop', 96.8, .6], ['pop', 97.3, .7],        // in una frase
  ];
  return {
    titolo: 'Metà ogni volta', durata: 105.1, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 71.1, 'il tempo di dimezzamento'], [71.1, T_FINE, 'il carbonio-14']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneNuclei(ctx, t); sceneGrafico(ctx, t); sceneFine(ctx, t); },
  };
});
