'use strict';
/* Il dito sulla canna — la portata Q = S·v resta costante lungo il tubo: dove si stringe l'acqua accelera
   (S₁·v₁ = S₂·v₂); il dito sulla canna riduce l'uscita e il getto va quattro volte più lontano. Argomento: fluidodinamica. */
CVIDEO.registra('fluidodinamica/continuita', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const T_FINE = 94.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [24.9, 'felice'], [27.2, 'neutro'],
  [41.6, 'sorpreso'], [44.0, 'neutro'], [55.6, 'pensa'], [60.4, 'neutro'], [65.2, 'felice'], [67.6, 'neutro'],
  [79.6, 'pensa'], [84.4, 'neutro'], [89.6, 'festa'], [92.0, 'felice'], [T_FINE, 'neutro'], [96.0, 'felice'],
  [100.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché col dito sulla canna\nl’acqua schizza più lontano?'],
  [7.9, 11.7, 'Acqua che scorre in un tubo,\nvista al rallentatore.'],
  [11.9, 15.4, 'La pensiamo {v:ideale}: incomprimibile\ne senza viscosità.'],
  [15.6, 19.9, 'Il moto è {v:stazionario}: in ogni punto\nla velocità non cambia.'],
  [20.1, 24.7, 'La {g:portata} {mink:Q}: volume d’acqua\nche passa da una sezione al secondo.'],
  [24.9, 29.8, 'Passa un cilindro di base {mink:S}\ne lungo {mx:v}{mink:·}1 s: {mink:Q = S·}{mx:v}.'],
  [30.0, 35.0, '{mink:S} = 2 cm², {mx:v} = 2 m/s:\n{mink:Q} = 0,0004 m³/s (0,4 L/s).'],
  [37.0, 41.4, 'Ora il tubo si stringe: diametro\nmetà, sezione un {v:quarto}.'],
  [41.6, 46.0, 'Nel tratto stretto l’acqua\n{x:accelera}…'],
  [46.2, 50.4, '…e dove si riallarga, {x:rallenta}.'],
  [50.6, 55.4, 'Fermo immagine: tre volumi d’acqua\n{v:uguali}, colorati.'],
  [55.6, 60.2, 'Nello stretto il volume è lungo\ne sottile: per passare, corre.'],
  [60.4, 65.0, 'Quanta acqua entra ogni secondo,\ntanta ne esce: {mink:Q} è la stessa.'],
  [65.2, 69.8, '{mink:S₁·}{mx:v₁}{mink: = S₂·}{mx:v₂}: sezione un quarto,\nvelocità {g:quattro volte}, 8 m/s.'],
  [70.6, 75.2, 'Canna aperta, a 1 m da terra:\nl’acqua esce a 2 m/s.'],
  [75.4, 79.4, 'Il getto tocca terra\na circa 0,9 m.'],
  [79.6, 84.2, 'Ora col dito chiudo tre quarti\ndell’uscita: la sezione sarà un {v:quarto}.'],
  [84.4, 89.4, 'Se il rubinetto spinge abbastanza, {mink:Q}\nresta quasi uguale: esce a circa {g:8 m/s}…'],
  [89.6, 93.8, '…e arriva a circa 3,6 m:\n{g:quattro volte} più lontano.'],
  [96.0, 101.4, 'Dove la sezione si stringe,\nl’acqua corre più veloce.'],
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
function riga(ctx, nome, val, y, col, al, x0, x1, size = 38) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right', fill: css(col) });
  ctx.restore();
}
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il dito sulla canna', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il tubo: velocità uniforme in ogni sezione (fluido ideale), v = Q/S con S proporzionale a D² ----------
const CT = [110, 110, 1700, 380], YC = 290, XL = 112, XR = 1808;
const D1 = 160, D2 = 80, V1 = 70;           // diametri disegnati (px) e velocità nel tratto largo (px/s, al rallentatore)
const dUnif = () => D1;
function dVent(x) {                           // largo, strozzatura (diametro metà), di nuovo largo
  const tr = (a, b, da, db) => lerp(da, db, (1 - Math.cos(Math.PI * clamp((x - a) / (b - a)))) / 2);
  if (x < 640) return D1; if (x < 760) return tr(640, 760, D1, D2);
  if (x < 1180) return D2; if (x < 1300) return tr(1180, 1300, D2, D1);
  return D1;
}
const vel = (Dx, x) => V1 * (D1 / Dx(x)) ** 2;   // portata costante: S·v uguale ovunque
function tabella(Dx) {                        // tempo di volo dall'imbocco: σ(x) = ∫ dx / v(x)
  const xs = [], ss = []; let s = 0;
  for (let x = XL; x <= XR; x += 1) { xs.push(x); ss.push(s); s += 1 / vel(Dx, x + .5); }
  return { xs, ss, T: ss[ss.length - 1], Dx };
}
const UNIF = tabella(dUnif), VENT = tabella(dVent);
function xDi(tb, s) {                         // l'inverso: dove si trova chi è entrato da s secondi
  const { xs, ss } = tb; let a = 0, b = ss.length - 1;
  while (b - a > 1) { const m = (a + b) >> 1; if (ss[m] <= s) a = m; else b = m; }
  return lerp(xs[a], xs[b], clamp((s - ss[a]) / ((ss[b] - ss[a]) || 1)));
}
const sDi = (tb, x) => tb.ss[clamp(Math.round(x - XL), 0, tb.ss.length - 1)];
const mod = (a, n) => ((a % n) + n) % n;
// il tempo del tubo largo e del tubo di Venturi; il secondo si ferma fra 50,5 e 60,3 (fermo immagine)
const tUnif = t => Math.max(0, t - 7.9);
const FA = 50.5, FB = 60.3, TPF = FA - 36.8;
const tVent = t => t < FA ? t - 36.8 : t < FB ? TPF : t - 36.8 - (FB - FA);
// i volumi colorati: al fermo immagine uno sta al centro della strozzatura, gli altri ogni 6 s di tubo (se ne vedono tre)
const S_MID = sDi(VENT, 970), BANDA = .6;
const inBanda = s => Math.abs(mod(mod(s + TPF, VENT.T) - S_MID + 3, 6) - 3) < BANDA;
function tubo(ctx, Dx, al) {
  ctx.save(); ctx.globalAlpha *= al;
  const su = [], giu = [];
  for (let x = XL; x <= XR; x += 4) { su.push([x, YC - Dx(x) / 2]); giu.push([x, YC + Dx(x) / 2]); }
  ctx.fillStyle = css(C.x, .13); ctx.beginPath(); su.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
  giu.slice().reverse().forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  for (const lato of [su, giu]) { ctx.beginPath(); lato.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); }
  ctx.restore();
}
function particelle(ctx, tb, tp, al, kBanda = 0) {
  if (al <= 0) return;
  const n = Math.round(tb.T / .3), ds = tb.T / n;
  ctx.save(); ctx.globalAlpha *= al;
  // i volumi colorati: l'acqua fra due sezioni che si muovono con lei
  if (kBanda > 0) for (let k = -3; k <= 3; k++) {
    if (S_MID + 6 * k < 0 || S_MID + 6 * k >= VENT.T) continue;
    const c = mod(S_MID + 6 * k - TPF + tp, VENT.T), a = c - BANDA, b = c + BANDA;
    if (a < 0 || b > tb.T) continue;
    const xa = xDi(tb, a), xb = xDi(tb, b), pts = [];
    for (let x = xa; x <= xb; x += 3) pts.push([x, YC - tb.Dx(x) / 2 + 3]);
    for (let x = xb; x >= xa; x -= 3) pts.push([x, YC + tb.Dx(x) / 2 - 3]);
    ctx.fillStyle = css(C.v, .2 * kBanda); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
  }
  for (let c = 0; c < n; c++) for (let j = 0; j < 5; j++) {
    const s0 = c * ds + (j % 2) * ds / 2, s = mod(s0 + tp, tb.T), x = xDi(tb, s);
    const y = YC + (j - 2) / 2.5 * (tb.Dx(x) / 2 - 2);
    const viola = kBanda > 0 && inBanda(s0);
    ctx.fillStyle = css(viola ? mix(C.x, C.v, kBanda) : C.x, .85);
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// 1–2 · il tubo uniforme e il tubo che si stringe (7,5–70,2)
const SV = 20;   // frecce della velocità: 20 px per m/s
function scenaTubi(ctx, t) {
  if (t < 7.5 || t > 70.4) return;
  const ka = life(t, 7.6, 70.2, .6, .6);
  card(ctx, ...CT, ka); card(ctx, 110, 520, 1700, 270, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  ctx.save(); ctx.beginPath(); ctx.roundRect(CT[0] + 2, CT[1] + 2, CT[2] - 4, CT[3] - 4, 20); ctx.clip();
  const k1 = 1 - P(t, 36.2, 36.8), k2 = P(t, 36.6, 37.2);
  if (k1 > 0) { tubo(ctx, dUnif, k1); particelle(ctx, UNIF, tUnif(t), k1); }
  if (k2 > 0) { tubo(ctx, dVent, k2); particelle(ctx, VENT, tVent(t), k2, life(t, 48.0, 62.4, .8, .8)); }
  ctx.restore();
  const fermo = t >= FA && t <= FB;
  txt(ctx, fermo ? 'fermo immagine' : 'al rallentatore', 1780, 140, { size: 30, color: C.dim, align: 'right', alpha: P(t, 7.9, 8.4) });
  // 1 · la sezione e la velocità
  const kS = life(t, 20.1, 36.4, .4, .4);
  if (kS > 0) { dashed(ctx, [960, YC - 100], [960, YC + 100], C.v, 1, kS); drawRich(ctx, 'sezione {mink:S}', 960, YC - 125, { size: 34, alpha: kS }); }
  const kV = life(t, 30.0, 36.4, .4, .4);
  if (kV > 0) { freccia(ctx, [300, 440], [300 + 2 * SV, 440], C.x, kV, 6); drawRich(ctx, '{mx:v} = 2 m/s', 360, 440, { size: 34, align: 'left', alpha: kV }); }
  // 2 · le velocità nel tubo di Venturi, lunghe in proporzione
  const kv1 = life(t, 41.6, 70.0, .4, .4), kv3 = life(t, 46.2, 70.0, .4, .4);
  if (kv1 > 0) {
    freccia(ctx, [250, 440], [250 + 2 * SV, 440], C.x, kv1, 6); drawRich(ctx, '{mx:v₁} = 2 m/s', 310, 440, { size: 34, align: 'left', alpha: kv1 });
    freccia(ctx, [810, 440], [810 + 8 * SV, 440], C.x, kv1, 6); drawRich(ctx, '{mx:v₂} = 8 m/s', 990, 440, { size: 34, align: 'left', alpha: kv1 });
  }
  if (kv3 > 0) { freccia(ctx, [1440, 440], [1440 + 2 * SV, 440], C.x, kv3, 6); drawRich(ctx, '{mx:v₁} = 2 m/s', 1500, 440, { size: 34, align: 'left', alpha: kv3 }); }
  // la scheda in basso, tubo uniforme
  const kP = life(t, 20.1, 36.4, .5, .4);
  if (kP > 0) {
    ctx.save(); ctx.globalAlpha *= kP;
    titoletto(ctx, '{g:portata}', 360, 565);
    drawRich(ctx, '{mink:Q = S·}{mx:v}', 360, 648, { size: 60, local: t - 25.1 });
    drawRich(ctx, '{dim:volume al secondo, in m³/s}', 360, 728, { size: 30, local: t - 20.4 });
    // il cilindro che passa in un secondo
    const kc = P(t, 25.0, 25.6);
    if (kc > 0) {
      ctx.globalAlpha *= kc;
      const xa = 720, xb = 1020, yc = 690, ry = 46, rx = 18;
      ctx.fillStyle = css(C.v, .16); ctx.fillRect(xa, yc - ry, xb - xa, 2 * ry);
      ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(xa, yc - ry); ctx.lineTo(xb, yc - ry); ctx.moveTo(xa, yc + ry); ctx.lineTo(xb, yc + ry); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(xb, yc, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = css(C.v, .25); ctx.beginPath(); ctx.ellipse(xa, yc, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawRich(ctx, '{mink:S}', xa - 42, yc, { size: 38 });
      ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa + 4, 612); ctx.lineTo(xb - 4, 612); ctx.stroke();
      arrowHead(ctx, [xa, 612], Math.PI, C.x, .7); arrowHead(ctx, [xb, 612], 0, C.x, .7);
      drawRich(ctx, 'lungo {mx:v}{mink:·}1 s', 870, 570, { size: 32 });
    }
    riga(ctx, '{mink:S} =', '2 cm² = 0,0002 m²', 590, C.ink, P(t, 30.1, 30.6), 1150, 1760);
    riga(ctx, '{mx:v} =', '2 m/s', 655, C.x, P(t, 30.3, 30.8), 1150, 1760);
    riga(ctx, '{mink:Q} =', '0,0004 m³/s', 725, C.g, P(t, 30.6, 31.1), 1150, 1760);
    ctx.restore();
  }
  // la scheda in basso, tubo di Venturi: le due sezioni, le due velocità, la stessa portata
  const kT = life(t, 37.0, 70.0, .5, .4);
  if (kT > 0) {
    ctx.save(); ctx.globalAlpha *= kT;
    txt(ctx, 'tratto largo', 760, 562, { size: 30, color: C.dim }); txt(ctx, 'tratto stretto', 1160, 562, { size: 30, color: C.dim });
    for (const [s, y] of [['sezione', 625], ['velocità', 688], ['portata', 751]]) txt(ctx, s, 190, y, { size: 36, align: 'left', alpha: y === 751 ? P(t, 60.5, 61.0) : y === 688 ? P(t, 41.7, 42.2) : 1 });
    drawRich(ctx, '{mink:S₁} = 2 cm²', 760, 625, { size: 38 }); drawRich(ctx, '{mink:S₂} = 0,5 cm²', 1160, 625, { size: 38 });
    drawRich(ctx, '{mx:v₁} = 2 m/s', 760, 688, { size: 38, alpha: P(t, 41.7, 42.2) });
    drawRich(ctx, '{mx:v₂} = {x:8 m/s}', 1160, 688, { size: 38, alpha: P(t, 41.7, 42.2) });
    drawRich(ctx, '{g:0,0004 m³/s}', 760, 751, { size: 38, alpha: P(t, 60.6, 61.1) });
    drawRich(ctx, '{g:0,0004 m³/s}', 1160, 751, { size: 38, alpha: P(t, 61.0, 61.5) });
    drawRich(ctx, '{mink:S₁·}{mx:v₁}{mink: = S₂·}{mx:v₂}', 1560, 655, { size: 50, local: t - 65.4 });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · il dito sulla canna (70,2–94): il getto è una parabola vera, x = v·t, y = ½·g·t², al rallentatore 5 volte
const G = 9.8, SC = 280, NX = 330, NY = 460, TERRA = NY + SC, LENTO = 5, T0J = 60;
const T_VOLO = Math.sqrt(2 * 1 / G);                     // 1 m di caduta: circa 0,45 s
const T_DITO = 84.4;                                     // il dito chiude: da qui l'acqua esce a 8 m/s
const kDito = te => T0J + te * LENTO >= T_DITO ? 1 : 0;  // l'acqua uscita dopo che il dito ha chiuso va a 8 m/s (quella di prima resta a 2 m/s)
const T_ARRIVO = T_DITO + T_VOLO * LENTO;                // quando la prima acqua a 8 m/s tocca terra: ≈ 86,7 s
const vUscita = te => lerp(2, 8, kDito(te));
const largo = te => lerp(22, 11, kDito(te));             // diametro metà, sezione un quarto
function getto(ctx, tau, al) {
  const n = 140, d = T_VOLO / n;
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round';
  let prec = null;
  for (let i = 0; i <= n; i++) {
    const dt = i * d, te = tau - dt, v = vUscita(te);
    const p = [NX + v * dt * SC, NY + .5 * G * dt * dt * SC];
    // il getto si assottiglia mentre accelera cadendo (anche lui a portata costante)
    const w = largo(te) * Math.sqrt(v / Math.hypot(v, G * dt));
    if (prec && kDito(te) === kDito(te + d)) { ctx.strokeStyle = css(mix(C.x, C.paper, .3)); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...prec); ctx.lineTo(...p); ctx.stroke(); }
    prec = p;
  }
  // gocce che si muovono con l'acqua
  ctx.fillStyle = css(C.paper, .9);
  for (let k = Math.ceil((tau - T_VOLO) / .03); k * .03 <= tau; k++) {
    const te = k * .03, dt = tau - te, v = vUscita(te);
    ctx.beginPath(); ctx.arc(NX + v * dt * SC, NY + .5 * G * dt * dt * SC, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function scenaCanna(ctx, t) {
  if (t < 70.0 || t > T_FINE + .3) return;
  const ka = life(t, 70.2, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1700, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  txt(ctx, 'al rallentatore', 1780, 140, { size: 30, color: C.dim, align: 'right' });
  // il pavimento con i metri, contati dalla bocca della canna
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, TERRA); ctx.lineTo(1790, TERRA); ctx.stroke();
  for (let m = 0; m <= 5; m++) {
    const x = NX + m * SC;
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, TERRA); ctx.lineTo(x, TERRA + 12); ctx.stroke();
    txt(ctx, m ? m + ' m' : '0', x, TERRA + 32, { size: 28, color: C.dim });
  }
  // la quota: 1 m
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(290, NY + 24); ctx.lineTo(290, TERRA - 4); ctx.stroke();
  arrowHead(ctx, [290, NY + 20], -Math.PI / 2, C.dim, .7); arrowHead(ctx, [290, TERRA], Math.PI / 2, C.dim, .7);
  txt(ctx, '1 m', 270, (NY + TERRA) / 2, { size: 30, color: C.dim, align: 'right' });
  // la traiettoria di prima, quando il dito ha chiuso
  const kVec = P(t, T_DITO + .2, T_DITO + 1.0);
  if (kVec > 0) {
    const pts = []; for (let i = 0; i <= 40; i++) { const dt = T_VOLO * i / 40; pts.push([NX + 2 * dt * SC, NY + .5 * G * dt * dt * SC]); }
    ctx.save(); ctx.globalAlpha *= kVec * .7; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); ctx.restore();
  }
  getto(ctx, (t - T0J) / LENTO, 1);
  // la canna e il dito
  ctx.fillStyle = css(mix(C.dim, C.paper, .3)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.rect(108, NY - 17, NX - 108, 34); ctx.fill(); ctx.stroke();
  const kd = P(t, T_DITO - .6, T_DITO), ad = life(t, 79.4, T_FINE + .1, .5, .4);   // il dito scende e chiude proprio a T_DITO
  if (ad > 0) {
    ctx.save(); ctx.globalAlpha *= ad;
    const giu = lerp(NY - 40, NY + 2, kd);
    ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(NX - 20, giu - 90, 40, 90, 18); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // la velocità d'uscita, freccia lunga in proporzione
  const v = lerp(2, 8, P(t, T_DITO, T_DITO + .5)), kv = P(t, 70.8, 71.3);
  freccia(ctx, [NX + 25, NY - 70], [NX + 25 + v * SV, NY - 70], C.x, kv, 6);
  drawRich(ctx, v > 7.9 ? '{mx:v} ≈ 8 m/s' : '{mx:v} = 2 m/s', NX + 45 + v * SV, NY - 70, { size: 36, align: 'left', alpha: kv * (v > 2.05 && v < 7.9 ? 0 : 1) });
  // dove tocca terra
  // (il punto a 3,6 m compare quando l'acqua ci arriva davvero; la misura quando Stilla la dice)
  const k1 = P(t, 75.5, 76.0), k2 = P(t, T_ARRIVO, T_ARRIVO + .25), k2s = P(t, 89.7, 90.2);
  const x1 = NX + 2 * T_VOLO * SC, x2 = NX + 8 * T_VOLO * SC;
  if (k1 > 0) { ctx.save(); ctx.globalAlpha *= k1; ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(x1, TERRA, 9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); drawRich(ctx, '≈ 0,9 m', x1 + 22, TERRA - 40, { size: 34, align: 'left', alpha: k1, fill: css(C.g) }); }
  if (k2 > 0) { ctx.save(); ctx.globalAlpha *= k2; ctx.fillStyle = css(C.g); ctx.beginPath(); ctx.arc(x2, TERRA, 9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); drawRich(ctx, '≈ 3,6 m', x2 + 22, TERRA - 40, { size: 34, align: 'left', alpha: k2s, fill: css(C.g) }); }
  ctx.restore();
}

// in una frase (94–104,4)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.5, 103.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.2 });
    drawRich(ctx, 'Dove il tubo si stringe,\nl’acqua corre {x:più veloce}.', W / 2, 290, { size: 70, weight: 600, local: t - 94.6, stagger: .09 });
  });
  const pills = [[490, '{mink:Q = S·}{mx:v}\n{dim:volume al secondo}'], [960, '{mink:S₁·}{mx:v₁}{mink: = S₂·}{mx:v₂}\n{dim:lungo tutto il tubo}'], [1430, 'sezione un quarto,\nvelocità {g:quattro volte}']];
  pills.forEach(([x, s], i) => {
    const a = 96.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 7.9, 9.4, [.4, .4]],                                    // il tubo, l'acqua che scorre
    ['pop', 20.1, .4],                                                                // la sezione S
    ['pop', 25.0, .5], ['pop', 25.1, .55],                                            // il cilindro, Q = S·v
    ['pop', 30.0, .4], ['pop', 30.1, .4], ['pop', 30.3, .45], ['ding', 30.6],         // S, v, Q = 0,0004 m³/s
    ['soffio', 36.6],                                                                 // il tubo si stringe
    ['pop', 41.7, .35], ['pop', 41.9, .8],                                            // v₁ = 2 m/s, v₂ = 8 m/s
    ['pop', 46.2, .35],                                                               // dove si riallarga rallenta
    ['pop', 48.4, .5],                                                                // i volumi colorati
    ['tono', 49.9, 50.5, [.45, .2]], ['pop', 50.5, .3], ['pop', 60.3, .3],            // fermo immagine, poi riparte
    ['pop', 60.6, .4], ['pop', 61.0, .4], ['ding', 61.3],                             // la stessa portata
    ['pop', 65.4, .6],                                                                // S₁·v₁ = S₂·v₂
    ['soffio', 70.2], ['pop', 70.8, .4],                                              // la canna, v = 2 m/s
    ['pop', 75.5, .45],                                                               // tocca terra a 0,9 m
    ['tono', 83.8, 84.4, [1, .6]],                                                    // il dito scende
    ['tono', 84.4, 84.9, [.25, 1]], ['traccia', 84.6, 85.4],                          // esce a 8 m/s, la traiettoria di prima
    ['tono', 84.4, 86.66, [1, .98, .94, .86, .75, .61, .44, .23, 0]], ['pop', 86.66, .6],   // il getto veloce cade e tocca terra a 3,6 m
    ['soffio', 94.2], ['pop', 96.4, .5], ['pop', 96.9, .6], ['pop', 97.4, .7],        // in una frase
  ];
  return {
    titolo: 'Il dito sulla canna', durata: 104.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 36.6, 'la portata'], [36.6, 70.2, 'il tubo si stringe'], [70.2, T_FINE, 'il dito sulla canna']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaTubi(ctx, t); scenaCanna(ctx, t); scenaFine(ctx, t); },
  };
});
