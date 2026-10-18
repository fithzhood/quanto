'use strict';
/* La luce non si somma — le velocità ordinarie si sommano (treno a 20 m/s, palla a 10 m/s rispetto al treno: da terra
   30 m/s, scala 3 px/m), la luce no: un treno a v = 0,5·c col faro acceso, visto da terra la luce fa c e non 1,5·c; visto
   dal treno un lampione a terra che corre incontro a 0,5·c manda luce che arriva a c, non a 1,5·c (sullo schermo
   c = 100 px/s, v = 50 px/s, al rallentatore; il lampo «se si sommasse» in rosso). I due postulati detti per esteso.
   Un cenno a Michelson e Morley (1887): due bracci perpendicolari, uno lungo il moto della Terra (30 km/s attorno al
   Sole), nessuna differenza. Colori: velocità C.x, la luce C.y, l'idea sbagliata C.r, la cosa nuova C.v, risultati C.g.
   Argomento: relativita. */
CVIDEO.registra('relativita/postulati', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, card, arrowHead, checkMark, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.6, 'felice'], [19.0, 'neutro'],
  [28.2, 'felice'], [33.1, 'neutro'], [38.7, 'pensa'], [44.2, 'sorpreso'], [49.2, 'neutro'], [54.9, 'felice'],
  [60.2, 'neutro'], [78.6, 'pensa'], [84.3, 'felice'], [89.7, 'neutro'], [97.2, 'felice'], [101.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Le velocità si sommano.\nVale anche per la luce?'],
  [7.9, 13.5, 'Treno a {mx:v} = 20 m/s; a bordo\nlancio una palla in avanti a 10 m/s.'],
  [13.6, 18.9, 'Vista da terra va a 20 + 10 = {g:30} m/s:\nle velocità {g:si sommano}.'],
  [19.0, 23.0, 'Treno e terra sono due {v:sistemi di}\n{v:riferimento inerziali}…'],
  [23.1, 27.4, '…fermi o in moto rettilineo uniforme\nl’uno rispetto all’altro.'],
  [28.2, 33.0, 'Un treno da fantascienza a metà della\nvelocità della luce, {mx:v} = 0,5·{mink:c}.'],
  [33.1, 38.6, '{mink:c} è la velocità della luce:\ncirca {mink:3·10⁸} m/s. Al rallentatore.'],
  [38.7, 44.1, 'Accendo il faro. {r:Se si sommassero},\nda terra la luce andrebbe a 1,5·{mink:c}.'],
  [44.2, 49.1, 'Invece no: misurata da terra\nla luce fa {mg:c}. Non 1,5·{mink:c}: {mg:c}.'],
  [49.2, 54.8, 'Visto dal treno: un lampione a terra\nmi corre incontro a 0,5·{mink:c} e lampeggia…'],
  [54.9, 59.8, '…e la sua luce mi arriva a {mg:c},\nnon a 1,5·{mink:c}. Sempre {mg:c}.'],
  [60.2, 65.0, 'Einstein ne fece due {v:postulati}. Primo:\nle leggi della fisica sono le stesse…'],
  [65.1, 68.6, '…in tutti i sistemi di riferimento\ninerziali.'],
  [68.7, 73.7, 'Secondo: la luce nel vuoto ha la stessa\nvelocità in tutti i sistemi inerziali…'],
  [73.8, 78.3, '…qualunque sia il moto della sorgente\no di chi la misura.'],
  [78.6, 84.2, 'Nel 1887 Michelson e Morley confrontarono\nla luce lungo e di traverso…'],
  [84.3, 89.6, '…al moto della Terra, 30 km/s intorno\nal Sole: {g:nessuna differenza}.'],
  [89.7, 94.6, 'La luce fa {mg:c} in ogni direzione,\nanche su una Terra in corsa.'],
  [97.2, 103.0, 'Le velocità si sommano, la luce no:\nva a {mg:c} per chiunque la misuri.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al, w) {
  if (al == null) al = 1; if (w == null) w = 7;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.3, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function scritta(ctx, s, x, y, size, al, align) {   // testo ricco su un fondino color carta
  if (al <= 0) return;
  const w = richW(ctx, s, size) + 20, a = align || 'center';
  const cx = a === 'left' ? x + w / 2 - 10 : a === 'right' ? x - w / 2 + 10 : x;
  fondo(ctx, cx, y, w, size * 1.35, al * .92);
  drawRich(ctx, s, x, y, { size, align: a, alpha: al });
}
const CORPO = () => mix(C.x, C.paper, .78), BORDO = () => mix(C.ink, C.paper, .25);
// binario: due rotaie e le traversine (sfasate di off, per farle scorrere)
function binario(ctx, x0, x1, y, off, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y + 12); ctx.lineTo(x1, y + 12); ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = css(mix(C.ink, C.paper, .6));
  const o = ((off % 60) + 60) % 60;
  for (let x = x0 - 60 + o; x < x1 + 60; x += 60) { if (x < x0 || x > x1) continue; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 16); ctx.stroke(); }
  ctx.restore();
}
// un vagone lungo L con la coda in x, sulle rotaie a quota y; faro acceso (kF) in testa
function treno(ctx, x, y, L, al, kF) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(CORPO()); ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x, y - 126, L, 110, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.x, C.paper, .55)); ctx.beginPath(); ctx.roundRect(x + 12, y - 136, L - 24, 16, 7); ctx.fill();   // il tetto
  ctx.fillStyle = C.paper;
  for (let wx = x + 24; wx + 48 < x + L - 30; wx += 66) { ctx.beginPath(); ctx.roundRect(wx, y - 108, 48, 38, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = css(C.ink);
  for (const wx of [x + 36, x + 80, x + L - 80, x + L - 36]) { ctx.beginPath(); ctx.arc(wx, y - 10, 15, 0, TAU); ctx.fill(); }
  if (kF > 0) { ctx.fillStyle = css(C.y); ctx.globalAlpha *= kF; ctx.beginPath(); ctx.arc(x + L - 4, y - 50, 12, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// un lampo di luce che corre: un trattino luminoso con l'alone
function lampo(ctx, x, y, col, al, verso) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 40);
  g.addColorStop(0, css(col, .55)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 40, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(col); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 20 * verso, y); ctx.lineTo(x + 14 * verso, y); ctx.stroke();
  ctx.restore();
}
function lampione(ctx, x, y, al, acceso) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 170); ctx.lineTo(x - 30, y - 190); ctx.stroke();
  ctx.fillStyle = css(acceso > 0 ? mix(C.y, C.paper, 1 - acceso) : mix(C.ink, C.paper, .6));
  ctx.beginPath(); ctx.arc(x - 38, y - 196, 16, 0, TAU); ctx.fill();
  ctx.restore();
}

const SCENA = [110, 110, 1700, 380], PAN = [110, 520, 1700, 270];
const Y_ROT = 450;                      // le rotaie
// ---------- 1 · la palla sul treno (7,5–28) ----------
const V1 = 20, U1 = 10, PXM = 3, T_T = 8.0, T_PALLA = 10.5, L1 = 220;
const xTreno1 = t => 150 + V1 * PXM * Math.max(0, t - T_T);
function scenaPalla(ctx, t) {
  if (t < 7.5 || t > 28.0) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 27.5, 27.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, SCENA[0], SCENA[1], SCENA[2], SCENA[3]);
  ctx.save(); ctx.beginPath(); ctx.rect(SCENA[0] + 4, SCENA[1] + 4, SCENA[2] - 8, SCENA[3] - 8); ctx.clip();
  binario(ctx, SCENA[0], SCENA[0] + SCENA[2], Y_ROT, 0, 1);
  const x = xTreno1(t);
  treno(ctx, x, Y_ROT, L1, 1, 0);
  // la palla dentro il vagone: parte dalla coda a 10 m/s rispetto al treno, si ferma in testa
  const kB = P(t, T_PALLA - .3, T_PALLA, E.back);
  if (kB > 0) {
    const s = Math.min(L1 - 48, U1 * PXM * Math.max(0, t - T_PALLA)), bx = x + 24 + s;
    ctx.save(); ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(bx, Y_ROT - 36, 13 * kB, 0, TAU); ctx.fill(); ctx.restore();
  }
  // la velocità del treno, sopra la testa
  const kv = P(t, 8.6, 9.2);
  freccia(ctx, [x + L1 - 60, Y_ROT - 165], [x + L1 - 60 + V1 * 6, Y_ROT - 165], C.x, kv, 7);
  scritta(ctx, '{mx:v} = 20 m/s', x + L1 - 60 + V1 * 3, Y_ROT - 207, 34, kv);
  ctx.restore();
  txt(ctx, 'visto da terra', 150, 150, { size: 30, color: C.dim, align: 'left' });
  // il pannello: le due velocità della palla, poi i sistemi di riferimento
  card(ctx, PAN[0], PAN[1], PAN[2], PAN[3]);
  const k1 = life(t, 10.3, 18.8, .4, .3);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    drawRich(ctx, '{dim:dal treno:}', 190, 600, { size: 36, align: 'left' });
    ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(420, 600, 11, 0, TAU); ctx.fill();
    freccia(ctx, [445, 600], [445 + U1 * 6, 600], C.x, 1, 7);
    drawRich(ctx, '{mx:u} = 10 m/s', 540, 600, { size: 40, align: 'left' });
    const k2 = P(t, 13.7, 14.2);
    ctx.globalAlpha *= k2;
    drawRich(ctx, '{dim:da terra:}', 190, 705, { size: 36, align: 'left' });
    ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(420, 705, 11, 0, TAU); ctx.fill();
    freccia(ctx, [445, 705], [445 + (V1 + U1) * 6, 705], C.g, 1, 7);
    drawRich(ctx, '{mx:v} + {mx:u} = 20 + 10 = {g:30} m/s', 660, 705, { size: 40, align: 'left' });
    ctx.restore();
  }
  const k3 = life(t, 18.9, 27.8, .4, .3);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    conFont(TITOLI, () => drawRich(ctx, 'sistema di riferimento {v:inerziale}', 960, 580, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:la terra:} ferma {dim:(con buona approssimazione) · il treno:} moto rettilineo uniforme', 960, 650, { size: 36, alpha: P(t, 19.4, 19.9) });
    drawRich(ctx, 'tutti e due inerziali: {g:nessuna accelerazione}', 960, 720, { size: 36, alpha: P(t, 23.3, 23.8) });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · la luce dal treno e dal lampione (28,2–56,2), al rallentatore ----------
const CPX = 100, V2 = 50, T_T2 = 28.5, T_FARO = 38.8, L2 = 200;
const xTreno2 = t => 150 + V2 * Math.max(0, t - T_T2);
const T_TR = 49.4, T_LAMP = 50.1, X_TR = 300, X_L0 = 1400;      // dal treno: il lampione parte da 1400 e va a sinistra
function scenaLuce(ctx, t) {
  if (t < 28.0 || t > 60.5) return;
  const al = P(t, 28.1, 28.7) * (1 - P(t, 60.0, 60.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, SCENA[0], SCENA[1], SCENA[2], SCENA[3]);
  card(ctx, PAN[0], PAN[1], PAN[2], PAN[3]);
  const daTerra = 1 - P(t, 49.1, 49.5), dalTreno = P(t, 49.3, 49.7);
  ctx.save(); ctx.beginPath(); ctx.rect(SCENA[0] + 4, SCENA[1] + 4, SCENA[2] - 8, SCENA[3] - 8); ctx.clip();
  if (daTerra > 0) {
    ctx.save(); ctx.globalAlpha *= daTerra;
    binario(ctx, SCENA[0], SCENA[0] + SCENA[2], Y_ROT, 0, 1);
    const x = xTreno2(t), kF = P(t, T_FARO - .2, T_FARO);
    treno(ctx, x, Y_ROT, L2, 1, kF);
    const kv = P(t, 28.9, 29.5);
    freccia(ctx, [x + L2 - 60, Y_ROT - 165], [x + L2 - 60 + 120, Y_ROT - 165], C.x, kv, 7);
    scritta(ctx, '{mx:v} = 0,5·{mink:c}', x + L2, Y_ROT - 207, 34, kv);
    // il lampo del faro: quello vero a c, quello «se si sommasse» a 1,5·c (in rosso), finché non si parla del vero
    const dt = t - T_FARO;
    if (dt > 0) {
      const x0 = x - V2 * dt + L2;        // dov'era il faro quando ha lampeggiato
      const kR = 1 - P(t, 44.2, 44.7);
      lampo(ctx, x0 + 1.5 * CPX * dt, Y_ROT - 50, C.r, kR, 1);
      scritta(ctx, '{mr:1,5·c} {r:?}', x0 + 1.5 * CPX * dt, Y_ROT - 100, 32, kR * P(dt, .3, .6));
      lampo(ctx, x0 + CPX * dt, Y_ROT - 50, C.y, 1, 1);
      scritta(ctx, '{mg:c}', x0 + CPX * dt, Y_ROT - 100, 34, P(dt, .3, .6) * P(t, 44.2, 44.7));
    }
    ctx.restore();
  }
  if (dalTreno > 0) {
    ctx.save(); ctx.globalAlpha *= dalTreno;
    binario(ctx, SCENA[0], SCENA[0] + SCENA[2], Y_ROT, -V2 * (t - T_TR), 1);
    treno(ctx, X_TR, Y_ROT, L2, 1, 0);
    const xl = X_L0 - V2 * Math.max(0, t - T_TR), kl = P(t, T_LAMP - .15, T_LAMP + .15) * (1 - P(t, T_LAMP + .4, T_LAMP + .9));
    lampione(ctx, xl, Y_ROT, 1, kl);
    const kv = P(t, 50.0, 50.6);
    freccia(ctx, [xl + 20, Y_ROT - 250], [xl + 20 - 120, Y_ROT - 250], C.x, kv, 7);
    scritta(ctx, '{dim:la terra:} {mx:v} = 0,5·{mink:c}', xl - 40, Y_ROT - 292, 32, kv);
    const dt = t - T_LAMP;
    if (dt > 0) {
      const x0 = X_L0 - V2 * (T_LAMP - T_TR) - 38;
      const kR = 1 - P(t, 54.9, 55.4);
      const xr = x0 - 1.5 * CPX * dt, xv = Math.max(X_TR + L2 + 2, x0 - CPX * dt);
      if (xr > X_TR + L2) { lampo(ctx, xr, Y_ROT - 196, C.r, kR, -1); scritta(ctx, '{mr:1,5·c} {r:?}', xr, Y_ROT - 246, 32, kR * P(dt, .3, .6)); }
      lampo(ctx, xv, Y_ROT - 196, C.y, 1, -1);
      scritta(ctx, '{mg:c}', xv, Y_ROT - 246, 34, P(dt, .3, .6) * P(t, 54.9, 55.4));
    }
    ctx.restore();
  }
  ctx.restore();
  txt(ctx, daTerra > .5 ? 'visto da terra · al rallentatore' : 'visto dal treno · al rallentatore', 150, 150, { size: 30, color: C.dim, align: 'left', alpha: Math.max(daTerra, dalTreno) });
  // il pannello delle velocità
  const cx = 960;
  const kc = life(t, 33.2, 49.2, .4, .3);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    drawRich(ctx, '{mink:c} {dim:≈} 3·10⁸ m/s {dim:— la velocità della luce}', cx, 578, { size: 38 });
    const kS = P(t, 38.9, 39.4), kN = P(t, 44.3, 44.8);
    drawRich(ctx, '{dim:da terra, se si sommasse:} {mr:c} + 0,5·{mr:c} = {mr:1,5·c}', cx - 40, 660, { size: 36, alpha: kS });
    crossMark(ctx, cx + 470, 660, P(t, 44.3, 44.8), C.r, .4);
    drawRich(ctx, '{dim:da terra, misurata:} {mg:c}', cx - 40, 735, { size: 40, alpha: kN });
    checkMark(ctx, cx + 470, 735, P(t, 44.8, 45.4), C.g, .4);
    ctx.restore();
  }
  const kd = life(t, 49.4, 60.1, .4, .3);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    const kS = P(t, 50.6, 51.1), kN = P(t, 55.1, 55.6);
    drawRich(ctx, '{dim:dal treno, se si sommasse:} {mr:c} + 0,5·{mr:c} = {mr:1,5·c}', cx - 40, 600, { size: 36, alpha: kS });
    crossMark(ctx, cx + 470, 600, P(t, 55.0, 55.5), C.r, .4);
    drawRich(ctx, '{dim:dal treno, misurata:} {mg:c}', cx - 40, 690, { size: 40, alpha: kN });
    checkMark(ctx, cx + 470, 690, P(t, 55.6, 56.2), C.g, .4);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · i due postulati (56,5–76,5) ----------
function scenaPostulati(ctx, t) {
  if (t < 60.1 || t > 78.9) return;
  const al = P(t, 60.2, 60.8) * (1 - P(t, 78.4, 78.8));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 230, 120, 1460, 660);
  conFont(TITOLI, () => drawRich(ctx, 'i due postulati {dim:(Einstein, 1905)}', 960, 190, { size: 44, weight: 600 }));
  drawRich(ctx, '{v:1.} Le leggi della fisica sono le stesse', 960, 300, { size: 40, local: t - 61.1 });
  drawRich(ctx, 'in tutti i sistemi di riferimento {v:inerziali}.', 960, 356, { size: 40, local: t - 65.2 });
  ctx.save(); ctx.globalAlpha *= P(t, 68.6, 69.0); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(300, 430); ctx.lineTo(1620, 430); ctx.stroke(); ctx.restore();
  drawRich(ctx, '{v:2.} La velocità della luce nel vuoto, {mink:c} ≈ 3·10⁸ m/s,', 960, 510, { size: 40, local: t - 68.9 });
  drawRich(ctx, 'è la stessa in tutti i sistemi di riferimento {v:inerziali},', 960, 566, { size: 40, local: t - 70.6 });
  drawRich(ctx, 'qualunque sia il moto della {g:sorgente} o di chi la {g:misura}.', 960, 650, { size: 40, local: t - 74.0 });
  ctx.restore();
}

// ---------- 4 · Michelson e Morley (76,8–90,4) ----------
const MM = { cx: 620, cy: 470, br: 300, vl: 150, t0: 79.6 };   // i due lampi partono dal separatore a 79,6: 2 s all'andata, 2 al ritorno
function scenaMM(ctx, t) {
  if (t < 78.5 || t > T_FINE + .3) return;
  const al = P(t, 78.6, 79.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  conFont(TITOLI, () => drawRich(ctx, 'Michelson e Morley, 1887', 1450, 185, { size: 42, weight: 600 }));
  const { cx, cy, br, vl, t0 } = MM;
  // i due bracci, gli specchi, il separatore
  ctx.save(); ctx.strokeStyle = css(mix(C.ink, C.paper, .55)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + br, cy); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - br); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx + br + 10, cy - 36); ctx.lineTo(cx + br + 10, cy + 36); ctx.moveTo(cx - 36, cy - br - 10); ctx.lineTo(cx + 36, cy - br - 10); ctx.stroke();
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 26, cy + 26); ctx.lineTo(cx + 26, cy - 26); ctx.stroke();
  ctx.restore();
  txt(ctx, 'specchio', cx + br + 36, cy, { size: 28, color: C.dim, align: 'left' });
  txt(ctx, 'specchio', cx, cy - br - 40, { size: 28, color: C.dim });
  txt(ctx, 'lungo il moto', cx + br / 2, cy + 42, { size: 28, color: C.dim });
  txt(ctx, 'di traverso', cx - 24, cy - br / 2, { size: 28, color: C.dim, align: 'right' });
  // la sorgente a sinistra
  ctx.save(); ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(cx - 150, cy, 16, 0, TAU); ctx.fill(); ctx.restore();
  txt(ctx, 'sorgente', cx - 150, cy + 44, { size: 28, color: C.dim });
  // i due lampi: andata e ritorno nello stesso tempo
  const dt = t - t0, T1 = br / vl;
  if (dt > 0) {
    const s = dt < T1 ? vl * dt : dt < 2 * T1 ? br - vl * (dt - T1) : 0;
    const k = dt < 2 * T1 ? 1 : 1 - P(dt, 2 * T1, 2 * T1 + .4);
    lampo(ctx, cx + s, cy, C.y, k, dt < T1 ? 1 : -1);
    ctx.save(); ctx.translate(cx, cy - s); ctx.rotate(-Math.PI / 2); lampo(ctx, 0, 0, C.y, k, dt < T1 ? 1 : -1); ctx.restore();
  }
  // la Terra che corre: freccia sotto
  const kT = P(t, 84.4, 85.0);
  freccia(ctx, [cx - 100, cy + 150], [cx + 200, cy + 150], C.x, kT, 8);
  drawRich(ctx, '{dim:la Terra intorno al Sole:} {x:30 km/s}', cx + 50, cy + 200, { size: 34, alpha: kT });
  // il verdetto, a destra
  drawRich(ctx, '{dim:andata e ritorno nei due bracci:}', 1450, 320, { size: 34, local: t - 79.8 });
  drawRich(ctx, 'tempi {g:uguali}', 1450, 400, { size: 54, weight: 600, local: t - 84.5 });
  drawRich(ctx, '{g:nessuna differenza}', 1450, 480, { size: 40, local: t - 85.9 });
  drawRich(ctx, 'la luce fa {mg:c} in ogni direzione', 1450, 600, { size: 40, local: t - 89.8 });
  drawRich(ctx, '{dim:il moto della Terra non si somma}', 1450, 656, { size: 32, local: t - 90.8 });
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La luce non si somma', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.3, 105.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Le velocità si sommano, la luce no:\nva a {mg:c} per chiunque la misuri.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, 'velocità ordinarie:\nsi {x:sommano}'], [960, 'la luce: {mg:c} per tutti,\n≈ 3·10⁸ m/s'], [1470, 'due {v:postulati}\n(Einstein, 1905)']];
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

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.6, .5],                                                // il treno a 20 m/s
    ['pop', 10.2, .6], ['tono', 10.5, 12.5, [.3, .55]],                               // la palla corre in avanti
    ['pop', 13.7, .5], ['ding', 14.3],                                                // da terra: 30 m/s
    ['pop', 18.9, .5], ['pop', 23.3, .45],                                            // sistemi inerziali
    ['soffio', 28.1], ['pop', 28.9, .5], ['pop', 33.2, .55],                          // il treno a 0,5·c, la velocità della luce
    ['pop', 38.8, .8], ['pop', 38.9, .2],                                             // il faro: c o 1,5·c?
    ['pop', 44.3, .1], ['ding', 44.9],                                                // misurata: c
    ['pop', 49.4, .45],                                                               // visto dal treno
    ['pop', 50.1, .8], ['pop', 50.6, .2],                                             // il lampione lampeggia
    ['pop', 55.0, .1], ['ding', 55.7],                                                // ancora c
    ['soffio', 60.2], ['pop', 61.1, .5], ['pop', 65.2, .45],                          // primo postulato
    ['traccia', 68.6, 69.0], ['pop', 68.9, .6], ['pop', 70.6, .5], ['pop', 74.0, .65],   // secondo postulato
    ['soffio', 78.6],                                                                 // Michelson e Morley
    ['tono', 79.6, 83.6, [.2, .8, .2]], ['pop', 83.6, .6],                            // i due lampi, andata e ritorno insieme
    ['pop', 84.4, .4], ['ding', 84.6], ['pop', 85.9, .5], ['pop', 89.8, .6],          // la Terra corre: nessuna differenza
    ['soffio', 94.8], ['pop', 97.0, .5], ['pop', 97.5, .6], ['pop', 98.0, .7],        // in una frase
  ];
  return {
    titolo: 'La luce non si somma', durata: 105.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.8, 'le velocità si sommano'], [27.8, 60.1, 'e la luce?'], [60.1, 78.5, 'i due postulati'], [78.5, T_FINE, 'Michelson e Morley']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPalla(ctx, t); scenaLuce(ctx, t); scenaPostulati(ctx, t); scenaMM(ctx, t); scenaFine(ctx, t); },
  };
});
