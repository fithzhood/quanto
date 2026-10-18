'use strict';
/* La carica che gira in tondo — un protone in un campo magnetico uniforme che entra nello schermo (⊗, definito): fermo
   non sente niente; lanciato verso destra sente la forza di Lorentz F = q·v·B (v ⊥ B), verso l'alto. Il verso con la mano
   destra aperta: pollice su v, dita su B, F esce dal palmo; la mano disegnata prima dritta (B in su, F esce: ⊙), poi
   inclinata di 90° attorno al pollice finché le dita entrano nello schermo: la proiezione delle dita va come cos θ, la forza
   come sin θ. F è sempre perpendicolare a v: il modulo della velocità non cambia, la carica gira in un cerchio percorso a
   velocità costante, φ = ω·t, al rallentatore (un giro vero dura 2π·m/(q·B) = 6,6·10⁻⁷ s, qui 5 s).
   r = m·v/(q·B): protone (m = 1,67·10⁻²⁷ kg, q = 1,6·10⁻¹⁹ C) a 1,0·10⁶ m/s in 0,10 T: r = 0,104 m (disegnato a 1300 px/m:
   136 px); a velocità doppia 0,209 m (271 px) e lo stesso tempo per giro: i due protoni tornano insieme al punto di
   partenza. Frecce lunghe in proporzione: v 80 px per 1,0·10⁶ m/s, F 66 px per q·v·B. Colori fissi del magnetismo:
   campo B C.g, carica positiva C.v, velocità C.x, forze C.y. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/lorentz', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 86.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.4, 'pensa'], [19.5, 'neutro'],
  [22.0, 'sorpreso'], [24.1, 'neutro'], [27.6, 'felice'], [29.7, 'neutro'], [41.7, 'felice'], [43.8, 'neutro'],
  [53.9, 'felice'], [56.0, 'neutro'], [64.6, 'felice'], [66.7, 'neutro'], [80.9, 'sorpreso'], [83.0, 'felice'],
  [85.1, 'neutro'], [88.2, 'felice'], [92.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.9, 'Che strada fa una carica\nin un campo magnetico?'],
  [7.9, 12.4, 'Un campo magnetico {mg:B} uniforme\nche {g:entra} nello schermo.'],
  [12.5, 17.3, 'Il cerchio con la croce: la coda\ndi una freccia che si allontana.'],
  [17.4, 21.9, 'Ci metto un protone, carica {v:positiva},\nfermo: {g:nessuna forza}.'],
  [22.0, 27.5, 'Lo lancio verso destra con velocità {mx:v}:\nsente una forza {my:F}, verso l’alto.'],
  [27.6, 33.6, 'È la {g:forza di Lorentz}: {my:F} = {mink:q}·{mx:v}·{mg:B}\n({mink:q} la carica, {mx:v} perpendicolare a {mg:B}).'],
  [33.7, 39.3, 'Il verso con la mano destra: pollice\nsu {mx:v}, dita su {mg:B}, {my:F} esce dal palmo.'],
  [39.4, 44.7, 'Giro la mano finché le dita entrano\nnello schermo: il palmo guarda in su.'],
  [44.8, 49.1, 'La forza è sempre {g:perpendicolare}\nalla velocità…'],
  [49.2, 53.8, '…quindi la curva, ma non cambia\nil modulo della velocità.'],
  [53.9, 58.7, 'Gira in un {g:cerchio}, sempre alla\nstessa velocità (al rallentatore).'],
  [58.8, 64.5, 'È la forza centripeta: {mink:q}·{mx:v}·{mg:B} = {mink:m}·{mx:v}²/{mink:r},\ncon {mink:m} la massa.'],
  [64.6, 69.1, 'Da qui il raggio:\n{mink:r} = {mink:m}·{mx:v} / ({mink:q}·{mg:B}).'],
  [69.2, 75.8, 'Un protone a un milione di m/s\nin 0,1 T: {mink:r} ≈ 10 cm.'],
  [75.9, 79.9, 'Con velocità doppia,\nil raggio è {g:doppio}.'],
  [80.0, 85.6, 'E tornano al punto di partenza\n{g:insieme}: stesso tempo per un giro.'],
  [88.2, 94.6, 'La forza è perpendicolare alla velocità:\nla curva soltanto, e la carica gira.'],
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
// ⊙ (verso = +1, esce dallo schermo: la punta della freccia) e ⊗ (verso = −1, entra: la coda)
function simbolo(ctx, p, r, verso, col, al = 1, pieno = true) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.strokeStyle = css(col); ctx.lineWidth = Math.max(2.5, r * .16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); if (pieno) ctx.fill(); ctx.stroke();
  if (verso > 0) { ctx.fillStyle = css(col); ctx.beginPath(); ctx.arc(p[0], p[1], r * .26, 0, TAU); ctx.fill(); }
  else { const a = r * .55; ctx.beginPath(); ctx.moveTo(p[0] - a, p[1] - a); ctx.lineTo(p[0] + a, p[1] + a); ctx.moveTo(p[0] + a, p[1] - a); ctx.lineTo(p[0] - a, p[1] + a); ctx.stroke(); }
  ctx.restore();
}
function carica(ctx, p, r = 22, al = 1, sc = 1) {
  if (al <= 0 || sc <= .01) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(C.v, [255, 255, 255], .4))); g.addColorStop(1, css(C.v));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0); ctx.moveTo(0, -a); ctx.lineTo(0, a); ctx.stroke();
  ctx.restore();
}
const scuro = () => parseInt(String(C.paper).slice(1, 3), 16) < 128;   // tema scuro: la pelle resta chiara
const PELLE = () => scuro() ? mix(C.y, C.ink, .5) : mix(C.y, C.paper, .62);
const BORDO_PELLE = () => scuro() ? mix(C.y, C.paper, .55) : mix(C.ink, C.paper, .2);
// la mano destra aperta, palmo verso di me, dita in su e pollice a destra (ruotata di rot nel piano), poi inclinata di th
// attorno all'asse del pollice. Fino a circa 55° si vede il palmo che si accorcia (come cos th); poi la mano di taglio:
// le dita entrano nello schermo (le loro punte sono ⊗) e il palmo è la striscia rivolta dove puntavano le dita.
function mappa(c, s, rot, th) {
  const k = Math.max(Math.cos(th), .3), cr = Math.cos(rot), sr = Math.sin(rot);
  return (x, y) => [c[0] + s * (x * cr - y * k * sr), c[1] + s * (x * sr + y * k * cr)];
}
const taglio = th => P(th, Math.PI * .3, Math.PI * .5);
function manoAperta(ctx, c, s, rot, th, al = 1) {
  if (al <= 0) return;
  const k = Math.max(Math.cos(th), .3), kT = taglio(th);
  const bordo = css(BORDO_PELLE()), pelle = css(PELLE());
  // dritta (o appena inclinata): il palmo si vede e si accorcia
  if (kT < 1) {
    ctx.save(); ctx.globalAlpha *= al * (1 - kT); ctx.translate(c[0], c[1]); ctx.rotate(rot); ctx.scale(s, s * k);
    const dito = (x, y0, y1, w) => { ctx.beginPath(); ctx.roundRect(x - w / 2, y1, w, y0 - y1, w / 2); ctx.fill(); ctx.stroke(); };
    ctx.fillStyle = pelle; ctx.strokeStyle = bordo; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-42, 40, 84, 70, 14); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(44, 22); ctx.rotate(-.18); ctx.beginPath(); ctx.roundRect(-10, -15, 92, 30, 15); ctx.fill(); ctx.stroke(); ctx.restore();
    dito(-39, -30, -110, 23); dito(-13, -30, -136, 24); dito(13, -30, -146, 24); dito(39, -30, -134, 24);
    ctx.beginPath(); ctx.roundRect(-54, -58, 108, 116, 24); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = bordo; ctx.globalAlpha *= .6; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-40, -22); ctx.quadraticCurveTo(0, -8, 38, -26); ctx.moveTo(-40, 4); ctx.quadraticCurveTo(-6, 16, 24, 2); ctx.stroke();
    ctx.restore();
  }
  // di taglio: la striscia della mano, il pollice in fuori, le punte delle dita che entrano (⊗)
  if (kT > 0) {
    ctx.save(); ctx.globalAlpha *= al * kT; ctx.translate(c[0], c[1]); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = pelle; ctx.strokeStyle = bordo; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(40, -13, 96, 26, 13); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-60, -19, 120, 38, 14); ctx.fill(); ctx.stroke();
    // il palmo: il bordo della striscia dalla parte delle dita di prima, più chiaro
    ctx.fillStyle = css(mix(PELLE(), C.paper, .45)); ctx.beginPath(); ctx.roundRect(-52, -17, 104, 8, 4); ctx.fill();
    ctx.restore();
    const m = mappa(c, s, rot, Math.PI / 2);
    for (const x of [-39, -13, 13, 39]) { const p = [c[0] + s * x * Math.cos(rot), c[1] + s * x * Math.sin(rot)]; simbolo(ctx, p, 8.5, -1, C.g, al * kT); }
  }
}
// le tre frecce della regola sulla mano: v (o I) lungo il pollice, B lungo le dita, F fuori dal palmo
// cartellino sulla mano dritta: è solo un esempio, con B nel piano
function cartellino(ctx, x, y, al) {
  if (al <= 0) return;
  fondo(ctx, x, y, 150, 44, al);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 75, y - 22, 150, 44, 10); ctx.stroke(); ctx.restore();
  txt(ctx, 'esempio', x, y + 1, { size: 30, color: C.dim, alpha: al });
}
function frecceMano(ctx, c, s, rot, th, al, nomeV, colV, nomeB, kF) {
  if (kF == null) kF = 1;
  if (al <= 0) return;
  nomeB = nomeB || '{mg:B}';
  const m = mappa(c, s, rot, th), m0 = mappa(c, s, rot, 0), kT = taglio(th);
  const u = [Math.cos(rot), Math.sin(rot)], d = [Math.sin(rot), -Math.cos(rot)];   // pollice; dove puntavano le dita
  const R = (x, y) => [c[0] + s * (x * u[0] + y * -d[0] * 1), c[1] + s * (x * u[1] + y * -d[1] * 1)];
  // v: lungo il pollice, oltre la punta
  const a = m0(150, 8), b = m0(250, 8);
  freccia(ctx, a, b, colV, al, 7);
  drawRich(ctx, nomeV, b[0] + u[0] * 36, b[1] + u[1] * 36, { size: 40, alpha: al });
  // B: accanto alle dita finché la mano è dritta; di taglio è il ⊗ a fianco della mano
  const b0 = m(-100, 40), b1 = m(-100, -150), kB = 1 - P(th, Math.PI * .2, Math.PI * .35);
  freccia(ctx, b0, b1, C.g, al * kB, 7);
  drawRich(ctx, '{mg:B}', b1[0] - u[0] * 46, b1[1] - u[1] * 46, { size: 40, alpha: al * kB });
  const pX = R(-100, 0);
  simbolo(ctx, pX, 20, -1, C.g, al * kT);
  drawRich(ctx, nomeB, pX[0] - u[0] * 52 + d[0] * 0, pX[1] - u[1] * 52, { size: 40, alpha: al * kT });
  // F: dritta esce dal palmo (⊙); di taglio parte dal palmo, verso dove puntavano le dita
  const pc = m(0, 0);
  simbolo(ctx, pc, 20, 1, C.y, al * (1 - P(th, 0, Math.PI * .25)));
  drawRich(ctx, '{my:F}', pc[0] - d[0] * 40, pc[1] - d[1] * 40, { size: 40, alpha: al * (1 - P(th, 0, Math.PI * .25)) });
  if (kT > 0) {
    const p0 = R(0, -24), LF = 150 * s;
    freccia(ctx, p0, [p0[0] + d[0] * LF, p0[1] + d[1] * LF], C.y, al * kT * kF, 8);
    drawRich(ctx, '{my:F}', p0[0] + d[0] * (LF + 30) + u[0] * 32, p0[1] + d[1] * (LF + 30) + u[1] * 32, { size: 40, alpha: al * kT * kF });
  }
}

const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
// ---------- il moto vero ----------
const MP = 1.67e-27, QP = 1.6e-19, V1 = 1.0e6, B0 = 0.10, PX_M = 1300;
const R1 = MP * V1 / (QP * B0) * PX_M;            // 0,104 m → 136 px
const OM = TAU / 5;                                // al rallentatore: un giro in 5 s (lo stesso a ogni velocità)
const T_MOTO = 46.0, T_DUE = 76.0;                 // T_DUE − T_MOTO = 6 giri: il primo protone ripassa dalla partenza
const S0 = [610, 730], LV = 80, LF = 66;
const pos = (r, f) => [S0[0] + r * Math.sin(f), S0[1] - r + r * Math.cos(f)];
const fase = (t, t0) => OM * Math.max(0, t - t0);
function arco(ctx, r, f, col, al) {
  if (al <= 0 || f <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(S0[0], S0[1] - r, r, Math.PI / 2, Math.PI / 2 - Math.min(f, TAU), true); ctx.stroke(); ctx.restore();
}
// un protone che gira: posizione, velocità (tangente) e forza (verso il centro), frecce lunghe in proporzione
function protone(ctx, r, f, nv, al, nomi, kF) {
  if (kF == null) kF = 1;
  const p = pos(r, f), tv = [Math.cos(f), -Math.sin(f)], tf = [-Math.sin(f), -Math.cos(f)];
  const a = [p[0] + tv[0] * 26, p[1] + tv[1] * 26], b = [a[0] + tv[0] * LV * nv, a[1] + tv[1] * LV * nv];
  const af = [p[0] + tf[0] * 26, p[1] + tf[1] * 26], bf = [af[0] + tf[0] * LF * nv, af[1] + tf[1] * LF * nv];
  freccia(ctx, af, bf, C.y, al * kF, 7);
  freccia(ctx, a, b, C.x, al, 7);
  carica(ctx, p, 22, Math.min(1, al * 2));
  if (nomi > 0) {
    // le etichette di fianco alle punte, su un fondino (sotto ci sono i ⊗)
    const lx = Math.min(1070, Math.max(150, b[0] + tv[0] * (nv > 1 ? 44 : 30))), ly = Math.min(765, Math.max(140, b[1] + tv[1] * 34));
    const fx = bf[0] + tf[0] * 26 + tv[0] * 26, fy = bf[1] + tf[1] * 26 + tv[1] * 26, wl = nv > 1 ? 70 : 46;
    fondo(ctx, lx, ly, wl, 46, al * nomi); drawRich(ctx, nv > 1 ? '{mx:2v}' : '{mx:v}', lx, ly, { size: 40, alpha: al * nomi });
    fondo(ctx, fx, fy, wl, 46, al * nomi * kF); drawRich(ctx, nv > 1 ? '{my:2F}' : '{my:F}', fx, fy, { size: 40, alpha: al * nomi * kF });
  }
}
function sceneCampo(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // B uniforme che entra: una griglia di ⊗, che si dirada attorno ai protoni (lì ci sono frecce ed etichette)
  const vuoti = [];
  if (t > 17.5) vuoti.push([t < T_MOTO ? S0 : pos(R1, fase(t, T_MOTO)), 150]);
  if (t >= T_DUE) vuoti.push([pos(2 * R1, fase(t, T_DUE)), 230]);
  for (let i = 0; i < 10; i++) for (let j = 0; j < 6; j++) {
    const g = [160 + 100 * i, 185 + 100 * j];
    let k = P(t, 8.0 + (i + j) * .05, 8.5 + (i + j) * .05);
    vuoti.forEach(([q, rr]) => { k *= clamp((Math.hypot(g[0] - q[0], g[1] - q[1]) - rr) / 45); });
    simbolo(ctx, g, 11, -1, mix(C.g, C.paper, .3), k * .6, false);
  }
  // le tracce
  const f1 = fase(t, T_MOTO), f2 = fase(t, T_DUE);
  arco(ctx, R1, f1, mix(C.v, C.paper, .45), 1);
  arco(ctx, 2 * R1, f2, mix(C.v, C.paper, .45), 1);
  // il raggio e il centro, quando si parla della forza centripeta e del raggio
  const kr = life(t, 58.9, 75.9, .4, .4);
  if (kr > 0) {
    const cc = [S0[0], S0[1] - R1], p = pos(R1, f1);
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([10, 9]);
    ctx.beginPath(); ctx.moveTo(cc[0], cc[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha *= kr; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(cc[0], cc[1], 7, 0, TAU); ctx.fill(); ctx.restore();
    // r a metà raggio, spostata di lato (dalla parte opposta al verso del moto)
    const mid = [(cc[0] + p[0]) / 2, (cc[1] + p[1]) / 2], tv = [Math.cos(f1), -Math.sin(f1)];
    fondo(ctx, mid[0] - tv[0] * 30, mid[1] - tv[1] * 30, 40, 44, kr); drawRich(ctx, '{mink:r}', mid[0] - tv[0] * 30, mid[1] - tv[1] * 30, { size: 40, alpha: kr });
  }
  // il primo protone: compare fermo, poi le frecce, poi parte
  const kp = P(t, 17.5, 18.0, E.back);
  if (kp > 0) {
    const kv = P(t, 22.2, 22.7), kF = P(t, 23.8, 24.3);
    const dim1 = 1 - .5 * P(t, T_DUE, T_DUE + .5);
    const nomi1 = 1 - P(t, T_DUE, T_DUE + .4);
    if (t < 22.2) carica(ctx, S0, 22, 1, kp);
    else {
      // prima che parta, v e F compaiono una alla volta
      if (t < T_MOTO) {
        const p = S0;
        freccia(ctx, [p[0], p[1] - 26], [p[0], p[1] - 26 - LF], C.y, kF, 7);
        freccia(ctx, [p[0] + 26, p[1]], [p[0] + 26 + LV, p[1]], C.x, kv, 7);
        carica(ctx, p, 22, 1);
        fondo(ctx, p[0] + 26 + LV / 2, p[1] - 34, 46, 46, kv); drawRich(ctx, '{mx:v}', p[0] + 26 + LV / 2, p[1] - 34, { size: 40, alpha: kv });
        fondo(ctx, p[0] - 36, p[1] - 26 - LF / 2, 46, 46, kF); drawRich(ctx, '{my:F}', p[0] - 36, p[1] - 26 - LF / 2, { size: 40, alpha: kF });
      } else protone(ctx, R1, f1, 1, dim1, nomi1, 1 - life(t, 58.9, 75.9, .4, .4));
    }
  }
  // fermo immagine: il protone è già lanciato, ma il tempo è fermo finché non si è detto il verso della forza
  const kFermo = P(t, 22.3, 22.7) * (1 - P(t, T_MOTO - .4, T_MOTO));
  if (kFermo > 0) {
    fondo(ctx, 935, 150, 280, 50, kFermo);
    ctx.save(); ctx.globalAlpha *= kFermo; ctx.fillStyle = css(C.ink); ctx.fillRect(812, 136, 9, 28); ctx.fillRect(827, 136, 9, 28); ctx.restore();
    txt(ctx, 'fermo immagine', 850, 151, { size: 30, color: C.ink, align: 'left', alpha: kFermo });
  }
  // il secondo protone, a velocità doppia
  if (t >= T_DUE) protone(ctx, 2 * R1, f2, 2, P(t, T_DUE - .3, T_DUE), 1);
  // tornano insieme alla partenza
  const kI = life(t, 80.8, 82.6, .2, .6);
  if (kI > 0) { ctx.save(); ctx.globalAlpha *= kI; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(S0[0], S0[1], 40 + 16 * P(t, 80.8, 81.6), 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
const HC = [1400, 500], HS = 1.4;
function scenePannello(ctx, t) {
  const cx = 1480;
  const s1 = life(t, 7.9, 33.7, .5, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    conFont(TITOLI, () => drawRich(ctx, 'campo e forza', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{mg:B} {dim:uniforme, in tesla (T)}', cx, 240, { size: 34, local: t - 8.0 });
    const kX = P(t, 12.6, 13.1);
    simbolo(ctx, [1265, 318], 24, -1, C.g, kX);
    drawRich(ctx, '{dim:entra nello schermo:}', 1310, 300, { size: 32, align: 'left', alpha: kX });
    drawRich(ctx, '{dim:la coda della freccia}', 1310, 338, { size: 32, align: 'left', alpha: kX });
    separa(ctx, 385, P(t, 17.4, 17.8));
    drawRich(ctx, '{dim:protone fermo:} {g:nessuna forza}', cx, 435, { size: 34, local: t - 17.5 });
    drawRich(ctx, '{dim:in moto con} {mx:v}{dim:: una forza} {my:F}', cx, 490, { size: 34, local: t - 22.1 });
    separa(ctx, 540, P(t, 27.6, 28.0));
    drawRich(ctx, '{my:F} = {mink:q}·{mx:v}·{mg:B}', cx, 610, { size: 60, local: t - 27.7 });
    drawRich(ctx, '{dim:con} {mx:v} {dim:perpendicolare a} {mg:B}', cx, 690, { size: 32, local: t - 29.0 });
    ctx.restore();
  }
  const s2 = life(t, 33.7, 44.8, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'mano destra', cx, 175, { size: 40, weight: 600 }));
    const th = P(t, 39.8, 41.8) * Math.PI / 2, km = P(t, 33.8, 34.4);
    manoAperta(ctx, HC, HS, 0, th, km);
    frecceMano(ctx, HC, HS, 0, th, P(t, 34.4, 34.9), '{mx:v}', C.x);
    cartellino(ctx, 1260, 250, P(t, 34.4, 34.9) * (1 - P(t, 39.6, 40.0)));
    const k1 = P(t, 35.0, 35.5) * (1 - P(t, 39.6, 40.0));
    simbolo(ctx, [1265, 735], 22, 1, C.y, k1);
    drawRich(ctx, '{dim:esce dallo schermo: la punta}', 1305, 735, { size: 30, align: 'left', alpha: k1 });
    const k2 = P(t, 41.8, 42.3);
    drawRich(ctx, '{dim:palmo in su:} {my:F} {dim:verso l’alto}', cx, 735, { size: 32, alpha: k2 });
    ctx.restore();
  }
  const s3 = life(t, 44.8, T_FINE + .1, .4, .5);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    conFont(TITOLI, () => drawRich(ctx, 'il moto', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{my:F} {dim:sempre perpendicolare a} {mx:v}', cx, 238, { size: 34, local: t - 44.9 });
    drawRich(ctx, '{dim:velocità:} 1,0·10⁶ m/s{dim:, sempre}', cx, 292, { size: 32, local: t - 49.3 });
    const kD = P(t, 76.0, 76.4), kG = P(t, 80.0, 80.4);
    drawRich(ctx, '{dim:un giro vero dura 6,6·10⁻⁷ s}', cx, 340, { size: 30, local: t - 54.0, alpha: 1 - kD });
    drawRich(ctx, '{dim:il secondo:} 2,0·10⁶ m/s{dim:,} {mink:r} = 0,209 m', cx, 340, { size: 30, alpha: kD * (1 - kG) });
    drawRich(ctx, '{dim:un giro: 6,6·10⁻⁷ s per tutti e due}', cx, 340, { size: 30, alpha: kG });
    separa(ctx, 385, P(t, 58.8, 59.2));
    drawRich(ctx, '{mink:q}·{mx:v}·{mg:B} = {mink:m}·{mx:v}²/{mink:r}', cx, 438, { size: 44, local: t - 58.9 });
    drawSeq(ctx, ['{mink:r =}', { num: '{mink:m}·{mx:v}', den: '{mink:q}·{mg:B}' }], cx, 530, 54, { local: t - 64.7 });
    separa(ctx, 600, P(t, 69.2, 69.6));
    drawRich(ctx, '{mink:m} = 1,67·10⁻²⁷ kg{dim:,} {mink:q} = 1,6·10⁻¹⁹ C', cx, 645, { size: 30, local: t - 69.3 });
    drawRich(ctx, '{mx:v} = 1,0·10⁶ m/s{dim:,} {mg:B} = 0,10 T', cx, 690, { size: 30, local: t - 69.8 });
    drawRich(ctx, '{mink:r} = {g:0,104 m ≈ 10 cm}', cx, 742, { size: 36, local: t - 70.6 });
    ctx.restore();
  }
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La carica che gira in tondo', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 95.8, 96.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La forza magnetica è perpendicolare\nalla velocità: la carica gira in tondo.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{my:F} = {mink:q}·{mx:v}·{mg:B}\n{dim:con} {mx:v} {dim:perpendicolare a} {mg:B}'], [960, '{mink:r} = {mink:m}·{mx:v} / ({mink:q}·{mg:B})'], [1470, '{dim:cambia la direzione}\n{dim:di} {mx:v}{dim:, non il modulo}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): nel cerchio il tono segue l'altezza del protone per un giro solo
  // (φ = ω·t, un giro in 5 s), più ampio per il secondo che ha il raggio doppio; quando la mano gira segue l'angolo
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .4], ['pop', 12.7, .4],                             // B uniforme, la coda della freccia
    ['pop', 17.6, .55],                                                               // il protone, fermo
    ['pop', 22.3, .5], ['pop', 22.5, .3], ['pop', 23.9, .55],                         // v, fermo immagine, F
    ['pop', 27.8, .6], ['pop', 29.1, .35],                                            // F = q·v·B
    ['pop', 34.0, .45], ['pop', 34.5, .45], ['pop', 35.1, .35],                       // la mano destra
    ['tono', 39.8, 41.8, [.2, .22, .33, .57, .68, .7]], ['pop', 41.9, .5],            // la mano gira: palmo in su
    ['traccia', 46.0, 51.0], ['tono', 46.0, 51.0, [.2, .3, .5, .6, .5, .3, .2]],      // parte: il primo giro
    ['pop', 49.4, .35], ['pop', 54.1, .3],                                            // stessa velocità; il giro vero
    ['traccia', 58.9, 59.3], ['pop', 59.0, .55],                                      // il raggio, la forza centripeta
    ['pop', 64.8, .6], ['ding', 65.1],                                                // r = m·v/(q·B)
    ['pop', 69.4, .4], ['ding', 70.8],                                                // r ≈ 10 cm
    ['pop', 76.0, .5], ['traccia', 76.0, 81.0], ['tono', 76.0, 81.0, [.2, .4, .8, 1, .8, .4, .2]],   // velocità doppia
    ['ding', 81.0],                                                                   // tornano insieme
    ['soffio', 86.0], ['pop', 88.2, .5], ['pop', 88.7, .6], ['pop', 89.2, .7],        // in una frase
  ];
  return {
    titolo: 'La carica che gira in tondo', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.6, 'la forza di Lorentz'], [33.6, 44.7, 'la mano destra'], [44.7, 64.5, 'il cerchio'], [64.5, T_FINE, 'il raggio']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCampo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
