'use strict';
/* I muoni che arrivano a terra — i raggi cosmici producono muoni a circa 15 km di quota; vita media (tempo proprio)
   Δt₀ = 2,2 μs, velocità v = 0,998·c ≈ 2,99·10⁸ m/s. Senza relatività in 2,2 μs fanno v·Δt₀ ≈ 659 m ≈ 660 m e per
   scendere di 15 km servono 15 km/v ≈ 50,1 μs ≈ 22,8 vite medie: a terra non ne arriverebbe quasi nessuno (e^−22,8 ≈
   10⁻¹⁰). Visto da terra il loro tempo rallenta: γ = 1/√(1 − 0,998²) ≈ 15,82, vita media per noi γ·Δt₀ ≈ 34,8 ≈ 35 μs;
   nei 50,1 μs del viaggio sul loro orologio passano 50,1/15,82 ≈ 3,17 μs ≈ 1,44 vite medie e ne arriva e^−1,44 ≈ 24 %,
   circa uno su quattro. Per il muone la strada si accorcia: L = L₀/γ = 15 km/15,82 ≈ 948 m ≈ 950 m, percorsi in
   948 m/v ≈ 3,17 μs: lo stesso tempo. Tutti i numeri ricontrollati con node.
   Il moto: 20 muoni scendono a v (al rallentatore, 1 μs ogni 0,2 s; scala 38 px/km, 11,38 px/μs); le loro vite proprie
   sono i 20 quantili della legge esponenziale di vita media 2,2 μs (t = −2,2·ln(1 − (k + ½)/20), nessun numero a caso):
   senza relatività ognuno si disintegra dopo t, visto da terra dopo γ·t; dei 20, 5 arrivano a terra (uno su quattro). Frisch e Smith
   (1963) contarono i muoni sul monte Washington (1910 m) e al livello del mare. Colori: muoni C.v, velocità C.x,
   «se il tempo fosse uguale» C.r, risultati C.g. Argomento: relativita. */
CVIDEO.registra('relativita/muoni', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fixedNum, fmtN, card, arrowHead, crossMark, checkMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 96.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.4, 'felice'], [23.9, 'neutro'],
  [28.5, 'pensa'], [32.6, 'neutro'], [37.0, 'sorpreso'], [42.0, 'neutro'], [47.7, 'felice'], [54.2, 'neutro'],
  [63.9, 'festa'], [68.8, 'neutro'], [73.7, 'pensa'], [78.6, 'neutro'], [84.4, 'felice'], [90.9, 'neutro'],
  [99.0, 'felice'], [102.8, 'occhiolino'],
];
const FUMETTI = [
  [2.4, 6.4, 'Vivono circa 2 milionesimi di secondo.\nCome arrivano a terra?'],
  [7.9, 13.0, 'I raggi cosmici, in alto, producono\n{v:muoni} a circa 15 km di quota.'],
  [13.1, 18.3, 'Il muone è instabile: in media vive\n2,2 μs, nel suo tempo.'],
  [18.4, 23.8, 'Scende quasi alla velocità della luce:\n{mx:v} = 0,998·{mink:c}.'],
  [23.9, 28.4, 'In 2,2 μs percorre circa {r:660 m}.'],
  [28.5, 32.5, 'Se il tempo fosse uguale per tutti…\nguarda, al rallentatore.'],
  [32.6, 36.9, '…decadrebbero tutti nei primi\nchilometri: a terra, {r:nessuno}.'],
  [37.0, 41.7, 'Eppure a terra ne arrivano tanti: uno\nal minuto per centimetro quadrato.'],
  [42.0, 47.6, 'Visto da terra, l’orologio del muone\nrallenta: {mink:Δt} = {mv:γ}·{mink:Δt₀}.'],
  [47.7, 53.5, 'Qui {mv:γ} ≈ 15,8: per noi vive in media\n{g:35 μs}.'],
  [54.2, 61.0, 'Rifacciamo la corsa: in 50 μs dei nostri,\nsul suo orologio ne passano {g:3,2}.'],
  [63.9, 68.7, 'Appena 1,4 vite medie: arriva a terra\n{g:circa uno su quattro}.'],
  [68.8, 73.4, 'Frisch e Smith lo verificarono,\ncontandoli su un monte e al mare.'],
  [73.7, 78.5, 'E per il muone? Lui è fermo:\nè la Terra a corrergli incontro.'],
  [78.6, 84.3, 'Chi vede una lunghezza muoversi\nla misura più corta: {mink:L} = {mink:L₀}/{mv:γ}.'],
  [84.4, 90.8, '{mink:L₀} = 15 km, misurata da fermo:\nper il muone diventa {g:950 m}.'],
  [90.9, 96.4, 'Li percorre in {g:3,2 μs}: come dice\nil suo orologio visto da terra.'],
  [99.0, 104.0, 'Per noi il suo tempo rallenta, per lui\nla strada si accorcia: e arriva.'],
];

// ---------- aiutanti (dagli altri video di relatività) ----------
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
function scritta(ctx, s, x, y, size, al, align) {
  if (al <= 0) return;
  const w = richW(ctx, s, size) + 20, a = align || 'center';
  const cx = a === 'left' ? x + w / 2 - 10 : a === 'right' ? x - w / 2 + 10 : x;
  fondo(ctx, cx, y, w, size * 1.35, al * .92);
  drawRich(ctx, s, x, y, { size, align: a, alpha: al });
}
const BORDO = () => mix(C.ink, C.paper, .25);
function terreno(ctx, x0, x1, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = css(mix(C.ink, C.paper, .6));
  for (let x = x0 + 14; x < x1; x += 24) { ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x - 12, y + 16); ctx.stroke(); }
  ctx.restore();
}
function badgeFermo(ctx, x, y, al) {
  if (al <= 0) return;
  fondo(ctx, x + 128, y, 290, 50, al);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.ink); ctx.fillRect(x, y - 14, 9, 28); ctx.fillRect(x + 15, y - 14, 9, 28); ctx.restore();
  txt(ctx, 'fermo immagine', x + 38, y + 1, { size: 30, color: C.ink, align: 'left', alpha: al });
}
// l'aria: un rettangolo che sfuma verso il basso, fra yTop (in cima) e yG (a terra)
function aria(ctx, x0, x1, yTop, yG, al) {
  if (al <= 0 || yG - yTop < 1) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createLinearGradient(0, yTop, 0, yG);
  g.addColorStop(0, css(mix(C.x, C.paper, .94))); g.addColorStop(1, css(mix(C.x, C.paper, .74)));
  ctx.fillStyle = g; ctx.fillRect(x0, yTop, x1 - x0, yG - yTop);
  ctx.restore();
}
// un muone: un pallino viola con l'alone, e la scia se si muove
function muone(ctx, x, y, al, scia) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (scia > 0) {
    const g = ctx.createLinearGradient(0, y - scia, 0, y);
    g.addColorStop(0, css(C.v, 0)); g.addColorStop(1, css(C.v, .55));
    ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - scia); ctx.lineTo(x, y); ctx.stroke();
  }
  const h = ctx.createRadialGradient(x, y, 0, x, y, 13);
  h.addColorStop(0, css(C.v, .45)); h.addColorStop(1, css(C.v, 0));
  ctx.fillStyle = h; ctx.beginPath(); ctx.arc(x, y, 13, 0, TAU); ctx.fill();
  ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
  ctx.restore();
}
// dove un muone si è disintegrato: una crocetta tenue (e, appena successo, un anello che si allarga)
function resto(ctx, x, y, col, al, kAnello) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.globalAlpha *= .55;
  ctx.beginPath(); ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5); ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5); ctx.stroke();
  ctx.restore();
  if (kAnello > 0 && kAnello < 1) {
    ctx.save(); ctx.globalAlpha *= al * (1 - kAnello); ctx.strokeStyle = css(col); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 8 + 22 * kAnello, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ---------- i numeri veri ----------
const TAU0 = 2.2, BETA = 0.998, G = 1 / Math.sqrt(1 - BETA * BETA);   // vita media propria (μs); γ ≈ 15,82
const V_KMUS = BETA * 0.3;                          // c = 3·10⁵ km/s = 0,3 km/μs → v ≈ 0,2994 km/μs
const H_KM = 15, T_VIAGGIO = H_KM / V_KMUS;         // 50,1 μs da 15 km a terra
const RAL = 0.2;                                    // al rallentatore: 1 μs ogni 0,2 s
const N = 20, VITE = [];                            // le vite proprie dei 20 muoni: i quantili dell'esponenziale
const ORDINE = [11, 3, 17, 7, 0, 14, 9, 19, 5, 12, 2, 16, 8, 1, 18, 6, 13, 4, 15, 10];   // i quantili, mescolati a mano
for (let i = 0; i < N; i++) VITE.push(-TAU0 * Math.log(1 - (ORDINE[i] + .5) / N));
const COL = [420, 110, 560, 680], PAN = [1020, 110, 790, 680];
const Y_TOP = 170, Y_G = 740, PXKM = (Y_G - Y_TOP) / H_KM, PXUS = PXKM * V_KMUS;   // 38 px/km, 11,38 px/μs
const X_ARIA0 = 440, X_ARIA1 = 790, X_RIG = 806;
const xMuone = i => 463 + 16.4 * i;
const T_RUN1 = 28.9, T_RUN2 = 53.8;                 // le due corse: senza relatività, visto da terra

// i conti della corsa (senza disegnare): μs trascorsi per noi, quanti in volo, quanti a terra
function conta(t, tRun, g) {
  const us = clamp((t - tRun) / RAL, 0, T_VIAGGIO);
  let inVolo = 0, aTerra = 0;
  for (let i = 0; i < N; i++) {
    const tf = g * VITE[i];
    if (us >= T_VIAGGIO && tf > T_VIAGGIO) aTerra++; else if (us < tf) inVolo++;
  }
  return { us, inVolo, aTerra };
}
// la corsa disegnata: ogni muone scende a v finché non arriva la sua ora (g·vita propria)
function corsa(ctx, t, tRun, g, colResto, al, kComp) {
  if (al <= 0) return;
  const us = clamp((t - tRun) / RAL, 0, T_VIAGGIO);
  for (let i = 0; i < N; i++) {
    const x = xMuone(i), tf = g * VITE[i];
    if (us >= T_VIAGGIO && tf > T_VIAGGIO) {                    // arrivato a terra
      ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, Y_G - 10, 13, 0, TAU); ctx.stroke(); ctx.restore();
      muone(ctx, x, Y_G - 10, al, 0);
    } else if (us < tf) {                                        // in volo
      const y = Math.min(Y_TOP + PXUS * us, Y_G - 10);           // gli ultimi 10 px: si posa sul terreno
      muone(ctx, x, y, al * kComp, us > 0 && us < T_VIAGGIO ? Math.min(46, PXUS * us) : 0);
    } else {                                                     // disintegrato
      resto(ctx, x, Y_TOP + PXUS * tf, colResto, al, (t - (tRun + RAL * tf)) / .5);
    }
  }
}
function contatore(ctx, r, x, y, al) {
  if (al <= 0) return;
  drawRich(ctx, '{dim:in volo:} ' + r.inVolo + '   {dim:a terra:} ' + (r.aTerra ? '{g:' + r.aTerra + '}' : '0') + ' {dim:su 20}', x, y, { size: 34, alpha: al });
}

// ---------- 1 + 2 · la colonna d'aria (7,5–73,5) ----------
function scenaColonna(ctx, t) {
  if (t < 7.5 || t > 73.7) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 73.2, 73.6));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, COL[0], COL[1], COL[2], COL[3]);
  aria(ctx, X_ARIA0, X_ARIA1, 150, Y_G, 1);
  terreno(ctx, COL[0] + 20, COL[0] + COL[2] - 20, Y_G + 2, 1);
  // il righello delle quote
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X_RIG, Y_TOP); ctx.lineTo(X_RIG, Y_G); ctx.stroke();
  for (const km of [0, 5, 10, 15]) { const y = Y_G - km * PXKM; ctx.beginPath(); ctx.moveTo(X_RIG - 8, y); ctx.lineTo(X_RIG + 8, y); ctx.stroke(); }
  ctx.restore();
  for (const km of [5, 10]) txt(ctx, km + ' km', X_RIG + 18, Y_G - km * PXKM, { size: 28, color: C.dim, align: 'left' });
  txt(ctx, '15 km', X_RIG + 18, Y_TOP - 8, { size: 28, color: C.dim, align: 'left' });
  txt(ctx, '0 km', X_RIG + 18, Y_G - 14, { size: 28, color: C.dim, align: 'left' });
  // 660 m: dove arriverebbe in una vita media, senza relatività
  const k660 = life(t, 24.0, 41.6, .4, .4);
  if (k660 > 0) {
    const y = Y_TOP + V_KMUS * TAU0 * PXKM;
    ctx.save(); ctx.globalAlpha *= k660; ctx.strokeStyle = css(C.r); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(X_ARIA0 + 6, y); ctx.lineTo(X_ARIA1 + 4, y); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{r:660 m}', X_RIG + 18, y + 18, { size: 28, align: 'left', alpha: k660 });
  }
  // il raggio cosmico che arriva dall'alto e, a 15 km, i muoni
  const kR = life(t, 9.0, 13.0, .2, .4);
  if (kR > 0) {
    const y = lerp(116, Y_TOP - 12, P(t, 9.2, 10.0, E.lin));
    if (t < 10.05) { ctx.save(); ctx.globalAlpha *= kR; ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(606, y, 8, 0, TAU); ctx.fill(); ctx.restore(); }
    scritta(ctx, '{dim:raggio cosmico}', 618, 134, 26, kR, 'left');
  }
  const kLampo = life(t, 9.95, 10.8, .05, .7);
  if (kLampo > 0) {
    ctx.save(); ctx.globalAlpha *= kLampo;
    const g = ctx.createRadialGradient(606, Y_TOP, 0, 606, Y_TOP, 90);
    g.addColorStop(0, css(C.y, .7)); g.addColorStop(1, css(C.y, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(606, Y_TOP, 90, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.save(); ctx.beginPath(); ctx.rect(COL[0] + 4, COL[1] + 4, COL[2] - 8, COL[3] - 8); ctx.clip();
  if (t < 42.3) corsa(ctx, t, T_RUN1, 1, C.r, 1 - P(t, 41.6, 42.2), P(t, 9.95, 10.3));
  if (t > 53.3) corsa(ctx, t, T_RUN2, G, C.dim, 1, P(t, 53.4, 53.7));
  ctx.restore();
  ctx.restore();
}

// ---------- il pannello a destra (7,5–73,5) ----------
function orologio(ctx, nome, us, y, al, col) {
  if (al <= 0) return;
  drawRich(ctx, nome, PAN[0] + 50, y, { size: 32, align: 'left', alpha: al });
  fixedNum(ctx, fmtN(us, 1) + ' μs', PAN[0] + PAN[2] - 50, y, 42, col, al);
}
function scenaPannello(ctx, t) {
  if (t < 7.5 || t > 73.7) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 73.2, 73.6));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, PAN[0], PAN[1], PAN[2], PAN[3]);
  const cx = PAN[0] + PAN[2] / 2;
  badgeFermo(ctx, 1512, 150, t > 10.2 && t < T_RUN1 ? 1 : 0);
  // A · il muone (13,1–28,4)
  const kA = life(t, 13.1, 28.4, .3, .4);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    conFont(TITOLI, () => drawRich(ctx, 'il muone', PAN[0] + 50, 180, { size: 40, weight: 600, align: 'left' }));
    drawRich(ctx, '{v:vita media} {mink:Δt₀} = 2,2 μs', cx, 265, { size: 44, local: t - 13.4 });
    drawRich(ctx, '{dim:nel suo tempo proprio}', cx, 320, { size: 30, local: t - 14.6 });
    drawRich(ctx, '{dim:1 μs = 10⁻⁶ s: un milionesimo di secondo}', cx, 365, { size: 28, local: t - 15.4 });
    drawRich(ctx, '{mx:v} = 0,998·{mink:c} ≈ 2,99·10⁸ m/s', cx, 455, { size: 38, local: t - 18.6 });
    drawRich(ctx, '{mx:v}·{mink:Δt₀} ≈ 2,99·10⁸ m/s · 2,2·10⁻⁶ s', cx, 545, { size: 34, local: t - 24.1 });
    drawRich(ctx, '≈ {r:660 m}', cx, 615, { size: 48, local: t - 25.4 });
    ctx.restore();
  }
  // B · senza relatività (28,9–41,8)
  const kB = P(t, 28.9, 29.3) * (1 - P(t, 41.6, 42.0));
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    drawRich(ctx, '{r:se il tempo fosse uguale per tutti}', cx, 190, { size: 34 });
    drawRich(ctx, '{dim:al rallentatore: 1 μs ogni 0,2 s}', cx, 245, { size: 30 });
    const r = conta(t, T_RUN1, 1);
    orologio(ctx, '{dim:tempo trascorso:}', r.us, 325, 1, C.ink);
    contatore(ctx, r, cx, 400, 1);
    crossMark(ctx, PAN[0] + PAN[2] - 50, 400, P(t, 37.2, 37.8), C.r, .4);
    drawRich(ctx, '15 km / {mx:v} ≈ {r:50 μs}', cx, 490, { size: 40, local: t - 33.4 });
    drawRich(ctx, '50 μs / 2,2 μs ≈ {r:23 vite medie}', cx, 552, { size: 36, local: t - 34.4 });
    drawRich(ctx, '{g:eppure a terra ne arrivano tanti:}', cx, 645, { size: 36, local: t - 37.2 });
    drawRich(ctx, '{dim:circa 1 al minuto per ogni cm²}', cx, 700, { size: 30, local: t - 38.4 });
    ctx.restore();
  }
  // C · visto da terra (42,0–73,4)
  const kC = P(t, 42.0, 42.4);
  if (kC > 0) {
    ctx.save(); ctx.globalAlpha *= kC;
    conFont(TITOLI, () => drawRich(ctx, 'visto da terra', PAN[0] + 50, 180, { size: 40, weight: 600, align: 'left' }));
    drawRich(ctx, '{mink:Δt} = {mv:γ}·{mink:Δt₀}', cx, 250, { size: 48, local: t - 42.3 });
    drawRich(ctx, '{mv:γ} = 1/√(1 − 0,998²)', cx + 95, 315, { size: 36, align: 'right', local: t - 42.6 });
    drawRich(ctx, '≈ {v:15,8}', cx + 108, 315, { size: 36, align: 'left', local: t - 47.9 });
    drawRich(ctx, '{mink:Δt}{dim:: vita media per noi}', cx + 20, 370, { size: 34, align: 'right', local: t - 43.0 });
    drawRich(ctx, '= 2,2 μs·15,8 ≈ {g:35 μs}', cx + 32, 370, { size: 34, align: 'left', local: t - 49.4 });
    const r = conta(t, T_RUN2, G), kR = P(t, 53.4, 53.8);
    orologio(ctx, '{dim:tempo per noi:}', r.us, 435, kR, C.ink);
    orologio(ctx, '{dim:sull’orologio del muone:}', r.us / G, 485, kR, C.v);
    contatore(ctx, r, cx, 548, kR);
    drawRich(ctx, '50 μs / 15,8 ≈ {g:3,2 μs} ≈ {g:1,4 vite medie}', cx, 615, { size: 34, local: t - 57.5 });
    drawRich(ctx, '{dim:Frisch e Smith, 1963: muoni contati}', cx, 692, { size: 28, local: t - 69.0 });
    drawRich(ctx, '{dim:in cima a un monte e al livello del mare}', cx, 734, { size: 28, local: t - 69.6 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · visto dal muone (73,5–96,6) ----------
const RAL3 = 1;                                     // qui il rallentatore è più forte: 1 μs ogni 1 s
const L_KM = H_KM / G, T_RUN3 = 91.3, T_STRADA = L_KM / V_KMUS;   // 0,948 km in 3,17 μs
const XA = 270, XB = 600;
const Y3T = 205, Y3G = 740, PX3K = (Y3G - Y3T) / H_KM, PX3U = PX3K * V_KMUS;   // qui 35,7 px/km, la stessa per le due colonne
function scenaMuone(ctx, t) {
  if (t < 73.3 || t > T_FINE + .3) return;
  const al = P(t, 73.5, 74.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  // visto da terra: 15 km d'aria, il percorso del muone, il muone a terra
  txt(ctx, 'visto da terra', XA, 146, { size: 28, color: C.dim });
  aria(ctx, XA - 100, XA + 100, Y3T, Y3G, 1);
  terreno(ctx, XA - 120, XA + 120, Y3G + 2, 1);
  ctx.save(); ctx.strokeStyle = css(C.v, .7); ctx.lineWidth = 3; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.moveTo(XA, Y3T); ctx.lineTo(XA, Y3G - 10); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(XA, Y3G - 10, 13, 0, TAU); ctx.stroke(); ctx.restore();
  muone(ctx, XA, Y3G - 10, 1, 0);
  quota(ctx, XA + 116, Y3T, Y3G, '15 km', 1);
  // visto dal muone: lui è fermo; l'aria (accorciata) e la Terra gli salgono incontro
  txt(ctx, 'visto dal muone', XB, 146, { size: 28, color: C.dim });
  const h = lerp(Y3G - Y3T, L_KM * PX3K, P(t, 79.2, 81.2, E.io));
  const us3 = clamp((t - T_RUN3) / RAL3, 0, T_STRADA);
  const yT = Y3T - PX3U * us3, yB = yT + h;
  aria(ctx, XB - 100, XB + 100, yT, yB, 1);
  terreno(ctx, XB - 120, XB + 120, yB + 2, 1);
  const arrivato = us3 >= T_STRADA - 1e-9;
  if (arrivato) { ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(XB, Y3T, 13, 0, TAU); ctx.stroke(); ctx.restore(); }
  muone(ctx, XB, Y3T, 1, 0);
  const kQ15 = 1 - P(t, 79.1, 79.5), kQ950 = P(t, 81.2, 81.6);
  quota(ctx, XB + 116, yT, yB, '15 km', kQ15);
  if (kQ950 > 0) drawRich(ctx, '{g:950 m}', XB + 128, yT + 18, { size: 30, align: 'left', alpha: kQ950 });
  // la Terra che sale
  const kv = P(t, 74.0, 74.6) * (1 - P(t, T_RUN3, T_RUN3 + .4));
  freccia(ctx, [XB, 650], [XB, 520], C.x, kv, 7);
  scritta(ctx, '{dim:la Terra:} {mx:v} = 0,998·{mink:c}', XB, 700, 28, kv);
  // l'orologio del muone, durante la corsa
  const kO = P(t, 90.9, 91.2);
  if (kO > 0) {
    drawRich(ctx, '{dim:orologio del muone}', XB, 300, { size: 28, alpha: kO });
    fixedNum(ctx, fmtN(us3, 1) + ' μs', XB + 95, 350, 44, C.v, kO);
    drawRich(ctx, '{dim:al rallentatore: 1 μs ogni 1 s}', XB, 398, { size: 26, alpha: kO });
  }
  // i conti, a destra
  const cx = 1290;
  drawRich(ctx, '{dim:il muone è fermo: la Terra sale a} 0,998·{mink:c}', cx, 180, { size: 32, local: t - 73.9 });
  conFont(TITOLI, () => drawRich(ctx, '{v:contrazione delle lunghezze}', cx, 280, { size: 42, weight: 600, local: t - 78.7 }));
  drawRich(ctx, '{mink:L} = {mink:L₀}/{mv:γ}', cx, 365, { size: 58, local: t - 79.2 });
  drawRich(ctx, '{mink:L₀}{dim:: lunghezza propria, misurata da fermo}', cx, 440, { size: 30, local: t - 79.6 });
  drawRich(ctx, '{mink:L} = 15 km / 15,8 ≈ {g:950 m}', cx, 530, { size: 44, local: t - 85.6 });
  drawRich(ctx, '950 m / (0,998·{mink:c}) ≈ {g:3,2 μs}', cx, 620, { size: 42, local: t - 91.1 });
  drawRich(ctx, '{dim:come l’orologio del muone visto da terra}', cx, 700, { size: 30, local: t - 93.0 });
  ctx.restore();
}
// una quota: linea verticale con le stanghette, e il valore accanto
function quota(ctx, x, y0, y1, s, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - 7, y0); ctx.lineTo(x + 7, y0); ctx.moveTo(x - 7, y1); ctx.lineTo(x + 7, y1); ctx.stroke();
  ctx.restore();
  txt(ctx, s, x + 12, (y0 + y1) / 2, { size: 30, color: C.ink, align: 'left', alpha: al });
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'I muoni che arrivano a terra', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .12, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.9, 105.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Per noi il tempo del muone rallenta,\nper il muone la strada si accorcia.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, 'vita media {mink:Δt₀} = 2,2 μs\n{dim:da sola:} {r:660 m}'], [960, 'per noi: {mv:γ}·{mink:Δt₀} ≈ {g:35 μs}\n{dim:con} {mv:γ} ≈ 15,8'], [1470, 'per il muone:\n15 km → {g:950 m}']];
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
    ['soffio', 7.6], ['tono', 9.2, 10.0, [.98, .9]], ['pop', 10.0, .85],              // il raggio cosmico scende, nascono i muoni
    ['pop', 13.4, .55], ['pop', 18.6, .6],                                            // vita media 2,2 μs, v = 0,998·c
    ['traccia', 24.0, 24.4], ['pop', 25.4, .3],                                       // 660 m
    ['tono', 28.9, 30.55, [.9, .6, .36, .23, .14, .09, .05, .05, 0]],                 // senza relatività: si disintegrano tutti
    ['pop', 33.4, .4], ['pop', 34.4, .35],                                            // 50 μs, 23 vite medie
    ['pop', 37.2, .1], ['pop', 37.3, .7],                                             // nessuno, eppure ne arrivano
    ['pop', 42.3, .55], ['pop', 47.9, .6], ['ding', 49.5],                            // Δt = γ·Δt0, γ ≈ 15,8, 35 μs
    ['tono', 53.8, 63.8, [.95, .5, .05]],                                             // visto da terra: scendono
    ['pop', 57.5, .55], ['pop', 63.82, .7],                                           // 3,2 μs, a terra uno su quattro
    ['pop', 69.0, .4],                                                                // Frisch e Smith
    ['soffio', 73.5], ['pop', 74.0, .5],                                              // visto dal muone: la Terra sale
    ['pop', 79.2, .6], ['tono', 79.2, 81.2, [1, .94, .53, .12, .06]],                 // L = L0/γ: l'aria si accorcia
    ['pop', 81.2, .45], ['ding', 85.7],                                               // 950 m
    ['pop', 91.1, .5], ['tono', 91.3, 94.47, [.1, .6]], ['ding', 94.5],               // l'orologio del muone: 3,2 μs
    ['soffio', 96.6], ['pop', 98.8, .5], ['pop', 99.3, .6], ['pop', 99.8, .7],        // in una frase
  ];
  return {
    titolo: 'I muoni che arrivano a terra', durata: 106.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.8, 'il problema'], [41.8, 73.5, 'per noi, il loro tempo rallenta'], [73.5, T_FINE, 'per loro, la strada si accorcia']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaColonna(ctx, t); scenaPannello(ctx, t); scenaMuone(ctx, t); scenaFine(ctx, t); },
  };
});
