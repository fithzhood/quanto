'use strict';
/* La pattinatrice — gira su una punta a braccia aperte (I ≈ 3,6 kg·m², un giro al secondo: ω ≈ 6,28 rad/s); il ghiaccio non
   frena quasi e peso e reazione stanno sull'asse, quindi L = I·ω ≈ 22,6 kg·m²/s si conserva. Chiude le braccia: I scende a
   1,2 kg·m² (un terzo) e ω sale a 18,85 rad/s (tre giri al secondo). L'energia cinetica di rotazione ½·I·ω² passa da 71 a 213 J:
   la fornisce lei, tirando le braccia. Modello: I = 1,0 kg·m² (corpo) + 2 · 3 kg · r² (braccia, r dall'asse).
   Moto vero: ω(t) = L / I(t) e l'angolo è l'integrale di ω, calcolato una volta sola. Al rallentatore (4 s per 1 s vero).
   Argomento: rotazioni. */
CVIDEO.registra('rotazioni/momento-angolare', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed } = M;

const T_FINE = 88.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [41.6, 'felice'], [46.4, 'neutro'],
  [50.7, 'sorpreso'], [55.4, 'neutro'], [60.0, 'felice'], [64.9, 'pensa'], [69.1, 'sorpreso'], [73.7, 'neutro'],
  [83.1, 'felice'], [T_FINE, 'neutro'], [90.6, 'felice'], [94.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché la pattinatrice gira più\nveloce quando chiude le braccia?'],
  [7.9, 12.4, 'Gira su una punta, braccia aperte:\nun giro al secondo (al rallentatore).'],
  [12.5, 17.1, 'Di fronte e dall’alto, quattro\nvolte più lenta del vero.'],
  [17.2, 22.0, '{mx:ω} è la {v:velocità angolare}:\n2π rad/s ≈ 6,28 rad/s.'],
  [22.1, 27.0, 'Il {v:momento d’inerzia} {mv:I} = Σ {mink:m·r²}\ncresce con la massa lontana dall’asse.'],
  [27.1, 31.5, 'Con le braccia aperte\n{mv:I} ≈ 3,6 kg·m².'],
  [31.6, 36.6, 'Il {v:momento angolare} è {mg:L} = {mv:I}{mink:·}{mx:ω}:\n3,6 · 6,28 ≈ 22,6 kg·m²/s.'],
  [36.7, 41.5, '{mg:L} si {g:conserva} se il momento\ndelle forze esterne è nullo.'],
  [41.6, 46.2, 'Il ghiaccio frena pochissimo, e peso\ne reazione stanno sull’asse.'],
  [46.4, 50.6, 'Ora porta le braccia\nal petto…'],
  [50.7, 55.3, '…e gira {g:tre volte} più veloce:\n18,85 rad/s, tre giri al secondo.'],
  [55.4, 59.9, '{mv:I} è sceso a 1,2 kg·m²:\nun terzo di prima.'],
  [60.0, 64.8, '1,2 · 18,85 ≈ 22,6: il prodotto\n{mg:L} = {mv:I}{mink:·}{mx:ω} è rimasto {g:uguale}.'],
  [64.9, 69.0, 'E l’energia cinetica\ndi rotazione, ½·{mv:I}{mink:·}{mx:ω}²?'],
  [69.1, 73.6, 'Era 71 J, ora è 213 J:\nè {g:triplicata}!'],
  [73.7, 78.5, 'La mette lei: tirando le braccia\nverso l’asse fa {v:lavoro} con i muscoli.'],
  [78.6, 83.0, 'Se riapre le braccia,\n{mv:I} torna a 3,6 kg·m²…'],
  [83.1, 87.8, '…e {mx:ω} torna a un giro al secondo:\n{mg:L} non è mai cambiato.'],
  [90.6, 95.7, 'Senza momenti esterni {mg:L} = {mv:I}{mink:·}{mx:ω}\nresta costante: meno {mv:I}, più {mx:ω}.'],
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
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));

// ---------- il moto vero ----------
const I_CORPO = 1.0, M_BR = 3, L_ANG = 3.6 * 2 * Math.PI;                 // L = 3,6 · 2π ≈ 22,6 kg·m²/s
const R_AP = Math.sqrt((3.6 - I_CORPO) / (2 * M_BR)), R_CH = Math.sqrt((1.2 - I_CORPO) / (2 * M_BR));   // 0,658 e 0,183 m
const SLOW = 4, T_CHIUDE = [46.6, 49.0], T_APRE = [78.8, 81.2];           // ogni movimento delle braccia: 0,6 s veri
// quanto sono chiuse le braccia (0 aperte, 1 chiuse): il ritmo dei muscoli lo sceglie lei
const chiusura = t => P(t, ...T_CHIUDE) * (1 - P(t, ...T_APRE));
const rBraccia = t => lerp(R_AP, R_CH, chiusura(t));
const inerzia = t => I_CORPO + 2 * M_BR * rBraccia(t) ** 2;
const omega = t => L_ANG / inerzia(t);
// l'angolo: φ = ∫ω dτ, con τ il tempo vero (τ = t/4); integrato una volta sola, passo fisso
const T0 = 7.0, DTV = 1 / 400;
const FI = (() => { const n = Math.ceil((100 - T0) / DTV) + 2, a = new Float64Array(n); for (let i = 1; i < n; i++) { const tm = T0 + (i - .5) * DTV; a[i] = a[i - 1] + omega(tm) * DTV / SLOW; } return a; })();
const fi = t => { const f = clamp((t - T0) / DTV, 0, FI.length - 2), i = Math.floor(f); return lerp(FI[i], FI[i + 1], f - i); };
// la mano (lato s = ±1) nelle coordinate della pattinatrice: a lungo le spalle, b in avanti è negativo (verso il petto)
const mano = (t, s) => { const k = chiusura(t); return [lerp(.85, .07, k) * s, lerp(0, -.17, k)]; };

// ---------- la pattinatrice ----------
const VESTITO = () => mix(C.v, C.paper, .35), PELLE = () => mix(C.y, C.paper, .55);
// di fronte: 230 px per metro; i piedi (la lama) a y = 735
const XF = 355, YG = 735, SF = 230;
function braccioFronte(ctx, t, lato, davanti) {
  const f = fi(t), [a, b] = mano(t, lato), prof = -a * Math.sin(f) + b * Math.cos(f);   // prof > 0: la mano è verso di noi
  if ((prof > 0) !== davanti) return;
  const ys = YG - 1.38 * SF, yh = ys + 10 + 25 * chiusura(t);
  ctx.strokeStyle = css(PELLE()); ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(XF + .16 * lato * Math.cos(f) * SF, ys); ctx.lineTo(XF + (a * Math.cos(f) + b * Math.sin(f)) * SF, yh); ctx.stroke();
}
function fronte(ctx, t) {
  const f = fi(t);
  braccioFronte(ctx, t, 1, false); braccioFronte(ctx, t, -1, false);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // la lama e le gambe, unite (trottola)
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
  const lb = .16 * SF * Math.cos(f);
  ctx.beginPath(); ctx.moveTo(XF - lb, YG); ctx.lineTo(XF + lb, YG); ctx.stroke();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .25)); ctx.lineWidth = 13;
  ctx.beginPath(); ctx.moveTo(XF - 7, YG - .92 * SF); ctx.lineTo(XF - 4, YG - 10); ctx.moveTo(XF + 7, YG - .92 * SF); ctx.lineTo(XF + 4, YG - 10); ctx.stroke();
  // il vestito e il busto (larghezza che segue la rotazione)
  const sp = .17 * SF * (.55 + .45 * Math.abs(Math.cos(f)));
  ctx.fillStyle = css(VESTITO());
  ctx.beginPath(); ctx.moveTo(XF - sp, YG - 1.40 * SF); ctx.lineTo(XF + sp, YG - 1.40 * SF); ctx.lineTo(XF + sp * .7, YG - 1.02 * SF);
  ctx.lineTo(XF + sp * 1.35, YG - .82 * SF); ctx.lineTo(XF - sp * 1.35, YG - .82 * SF); ctx.lineTo(XF - sp * .7, YG - 1.02 * SF); ctx.closePath(); ctx.fill();
  // la testa, con lo chignon che gira
  ctx.fillStyle = css(PELLE()); ctx.beginPath(); ctx.arc(XF, YG - 1.56 * SF, .11 * SF, 0, Math.PI * 2); ctx.fill();
  const cx = Math.sin(f) * .1 * SF;   // lo chignon si vede quando è voltata di spalle
  ctx.fillStyle = css(mix(C.y, C.ink, .55));
  if (Math.cos(f) > 0) { ctx.beginPath(); ctx.arc(XF + cx, YG - 1.63 * SF, .055 * SF, 0, Math.PI * 2); ctx.fill(); }
  braccioFronte(ctx, t, 1, true); braccioFronte(ctx, t, -1, true);
}
// dall'alto: 220 px per metro, centro in (865, 455); gira in senso antiorario
const XA = 865, YA = 455, SA = 220;
function alto(ctx, t) {
  const f = fi(t), u = [Math.cos(f), -Math.sin(f)], n = [Math.sin(f), Math.cos(f)];
  const p = (a, b) => [XA + (u[0] * a + n[0] * b) * SA, YA + (u[1] * a + n[1] * b) * SA];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(PELLE()); ctx.lineWidth = 16;
  for (const s of [1, -1]) { ctx.beginPath(); ctx.moveTo(...p(.16 * s, 0)); ctx.lineTo(...p(...mano(t, s))); ctx.stroke(); }
  ctx.fillStyle = css(PELLE());
  for (const s of [1, -1]) { ctx.beginPath(); ctx.arc(...p(...mano(t, s)), .045 * SA, 0, Math.PI * 2); ctx.fill(); }
  // le spalle (un'ellisse), la testa e lo chignon dietro
  ctx.save(); ctx.translate(XA, YA); ctx.rotate(-f);
  ctx.fillStyle = css(VESTITO()); ctx.beginPath(); ctx.ellipse(0, 0, .21 * SA, .11 * SA, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(PELLE()); ctx.beginPath(); ctx.arc(0, 0, .085 * SA, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.y, C.ink, .55)); ctx.beginPath(); ctx.arc(0, .075 * SA, .045 * SA, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La pattinatrice', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · le due viste
function sceneStage(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const kv = P(t, 12.6, 13.1);
  txt(ctx, 'di fronte', XF, 160, { size: 30, color: C.dim, alpha: kv });
  txt(ctx, 'dall’alto', XA, 160, { size: 30, color: C.dim, alpha: kv });
  ctx.strokeStyle = css(C.panelEdge); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(610, 140); ctx.lineTo(610, 760); ctx.stroke();
  // il ghiaccio
  ctx.strokeStyle = css(C.x, .45); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, YG + 3); ctx.lineTo(570, YG + 3); ctx.stroke();
  // l'asse di rotazione
  const kAs = life(t, 36.9, 46.2, .4, .4);
  dashed(ctx, [XF, YG + 20], [XF, YG - 1.95 * SF], C.dim, 1, .7 * kAs);
  fronte(ctx, t);
  alto(ctx, t);
  // il verso di rotazione (dall'alto): arco antiorario
  ctx.save(); ctx.globalAlpha *= P(t, 17.4, 17.9); ctx.strokeStyle = css(C.x); ctx.lineWidth = 5;
  const ra = 235, a0 = -.35, a1 = -1.25;
  ctx.beginPath(); ctx.arc(XA, YA, ra, a0, a1, true); ctx.stroke();
  arrowHead(ctx, [XA + ra * Math.cos(a1 - .06), YA + ra * Math.sin(a1 - .06)], a1 - Math.PI / 2 - .06, C.x, 1.1);
  ctx.restore();
  drawRich(ctx, '{mx:ω}', XA + 250 * Math.cos(-.8) + 30, YA + 250 * Math.sin(-.8) - 10, { size: 44, alpha: P(t, 17.4, 17.9) });
  // il momento angolare: un vettore lungo l'asse, sempre uguale (4 px per kg·m²/s)
  const kL = P(t, 31.8, 32.3);
  if (kL > 0) {
    const y0 = YG - 1.72 * SF;
    freccia(ctx, [XF, y0], [XF, y0 - L_ANG * 4], C.g, kL, 7);
    drawRich(ctx, '{mg:L}', XF + 34, y0 - L_ANG * 2, { size: 42, align: 'left', alpha: kL });
  }
  // peso e reazione del ghiaccio: stanno sull'asse, nessun momento (frecce uguali, 0,2 px per newton)
  const kF = life(t, 41.8, 46.3, .4, .4);
  if (kF > 0) {
    const yc = YG - .95 * SF, Lf = 490 * .2;
    freccia(ctx, [XF, yc], [XF, yc + Lf], C.y, kF, 6);
    freccia(ctx, [XF, YG], [XF, YG - Lf], C.y, kF, 6);
    drawRich(ctx, '{my:P}', XF - 60, yc + Lf / 2 - 10, { size: 40, alpha: kF });
    drawRich(ctx, '{my:N}', XF + 60, YG - Lf / 2 + 10, { size: 40, alpha: kF });
  }
  // il rallentatore
  ctx.save(); ctx.globalAlpha *= P(t, 7.9, 8.4); ctx.fillStyle = css(C.dim);
  ctx.beginPath(); ctx.moveTo(806, 742); ctx.lineTo(828, 756); ctx.lineTo(806, 770); ctx.closePath(); ctx.fill();
  txt(ctx, 'al rallentatore', 840, 756, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
  ctx.restore();
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 17.0 || t > T_FINE + .3) return;
  const al = life(t, 17.2, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'mentre gira');
  const w = omega(t), I = inerzia(t);
  const riga = (sim, nome, val, unita, y, col, a) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    drawRich(ctx, sim, 1190, y, { size: 44, align: 'left' });
    txt(ctx, nome, 1250, y, { size: 30, color: C.dim, align: 'left' });
    fixedNum(ctx, val, 1640, y, 44, col);
    txt(ctx, unita, 1652, y, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  };
  riga('{mx:ω}', 'velocità angolare', fmtN(w, 2), 'rad/s', 240, C.x, P(t, 17.4, 17.9));
  riga('{mv:I}', 'momento d’inerzia', fmtN(I, 1), 'kg·m²', 302, C.v, P(t, 27.3, 27.8));
  riga('{mg:L}', 'momento angolare', fmtN(I * w, 1), 'kg·m²/s', 364, C.g, P(t, 31.8, 32.3));
  // l'energia cinetica di rotazione
  const kE = P(t, 65.1, 65.6);
  if (kE > 0) {
    ctx.save(); ctx.globalAlpha *= kE;
    drawRich(ctx, '{mink:½·}{mv:I}{mink:·}{mx:ω}{mink:²}', 1190, 426, { size: 40, align: 'left' });
    txt(ctx, 'energia', 1350, 426, { size: 30, color: C.dim, align: 'left' });
    fixedNum(ctx, String(Math.round(.5 * I * w * w)), 1640, 426, 44, C.g);
    txt(ctx, 'J', 1652, 426, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  // il rettangolo: base I (120 px per kg·m²), altezza ω (15 px per rad/s); l'area è L
  const kR = P(t, 32.0, 32.6);
  if (kR > 0) {
    const X0 = 1250, Y0 = 742, bw = I * 120, bh = w * 15;
    ctx.save(); ctx.globalAlpha *= kR;
    // il rettangolo di partenza, tratteggiato, quando le braccia sono chiuse
    const kOld = life(t, 46.8, 78.8, .5, .5);
    if (kOld > 0) {
      ctx.save(); ctx.globalAlpha *= kOld * .8; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
      ctx.strokeRect(X0, Y0 - 2 * Math.PI * 15, 3.6 * 120, 2 * Math.PI * 15); ctx.restore();
    }
    ctx.fillStyle = css(mix(C.g, C.paper, .7)); ctx.fillRect(X0, Y0 - bh, bw, bh);
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.strokeRect(X0, Y0 - bh, bw, bh);
    drawRich(ctx, '{dim:area} {mg:L}', X0 + bw / 2, Y0 - bh / 2, { size: 34 });
    drawRich(ctx, '{mv:I}', X0 + bw / 2, Y0 + 26, { size: 36 });
    drawRich(ctx, '{mx:ω}', X0 - 26, Y0 - bh / 2, { size: 36 });
    ctx.restore();
  }
  drawRich(ctx, '{dim:a braccia aperte: 71 J}', 1610, 490, { size: 30, alpha: life(t, 65.3, 78.6, .4, .4) });
  drawRich(ctx, '{v:lavoro dei muscoli}', 1610, 560, { size: 32, alpha: life(t, 73.9, 78.6, .4, .4) });
  ctx.restore();
}

// in una frase (88,4–98,6)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 96.5, 97.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Se nessun momento esterno agisce,\n{mg:L} = {mv:I}{mink:·}{mx:ω} resta costante.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{mv:I} = Σ {mink:m·r²}\n{dim:massa lontana:} {mv:I} {dim:grande}'], [960, 'braccia chiuse:\n{mv:I} / 3, {mx:ω} · 3'], [1430, 'l’energia di rotazione\ncresce: la mette lei']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la velocità angolare, da 0 (0) a 20 rad/s (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 8.0, 9.0, [.31, .31]],                                  // gira a braccia aperte
    ['pop', 12.7, .4],                                                                // di fronte e dall'alto
    ['soffio', 17.3], ['pop', 17.5, .45],                                             // il pannello, ω
    ['pop', 27.4, .5],                                                                // I = 3,6 kg·m²
    ['pop', 31.9, .6], ['traccia', 32.0, 32.6],                                       // L, il rettangolo I per ω
    ['traccia', 36.9, 37.3],                                                          // l'asse
    ['pop', 41.9, .4],                                                                // peso e reazione
    ['traccia', 46.8, 47.3], ['tono', 46.6, 49.0, [.31, .32, .35, .44, .68, .86, .93, .94]],   // chiude le braccia: ω sale
    ['ding', 49.1],                                                                   // tre volte più veloce
    ['pop', 65.2, .5], ['pop', 65.4, .35],                                            // l'energia: 213 J, prima 71 J
    ['pop', 74.0, .55],                                                               // il lavoro dei muscoli
    ['tono', 78.8, 81.2, [.94, .93, .86, .68, .44, .35, .32, .31]], ['pop', 81.3, .35],   // riapre: ω torna giù
    ['soffio', 88.6], ['pop', 90.6, .5], ['pop', 91.1, .6], ['pop', 91.6, .7],        // in una frase
  ];
  return {
    titolo: 'La pattinatrice', durata: 98.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 46.2, 'il momento angolare'], [46.2, 64.8, 'chiude le braccia'], [64.8, 78.5, 'e l’energia?'], [78.5, T_FINE, 'riapre le braccia']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneStage(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
