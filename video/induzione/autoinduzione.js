'use strict';
/* La scintilla quando stacchi la spina — l'autoinduzione: una corrente che cambia in una bobina fa cambiare il flusso
   nella bobina stessa, e nasce una f.e.m. indotta che si oppone alla variazione (la mutua induzione sta nel video del
   trasformatore). Circuito: pila da 12 V, R = 6 Ω, bobina con L = 3 H. Chiudendo: I(t) = 2 A·(1 − e^(−t/τ)),
   τ = L/R = 0,5 s; la f.e.m. autoindotta ε = −L·dI/dt = −12 V·e^(−t/τ) (all'inizio uguale e opposta alla pila). Il tempo è
   al rallentatore, 5 volte (tempo fisico = (t − chiusura)/5), con un fermo immagine a t = τ. Aprendo: la corrente passa da
   2 A a zero in circa un millesimo di secondo, ΔI = −2 A, ΔI/Δt ≈ −2000 A/s, ε = −L·ΔI/Δt ≈ +6000 V (nel verso della
   corrente: la tiene viva), e salta la scintilla fra i contatti (mostrata in fermo immagine). Frecce della corrente C.v
   lunghe in proporzione (60 px/A), sopra il filo e sotto la bobina, accanto a quella della f.e.m. C.y (10 px/V; fuori
   scala a 6000 V, detto). Colori fissi: corrente C.v, f.e.m. e tensione C.y, flusso e campo C.g. Argomento: induzione. */
CVIDEO.registra('induzione/autoinduzione', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN } = M;
  const TAU = Math.PI * 2;

const T_FINE = 70.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.4, 'pensa'], [18.5, 'neutro'],
  [23.7, 'felice'], [28.9, 'neutro'], [45.1, 'sorpreso'], [49.5, 'neutro'], [55.4, 'sorpreso'], [59.7, 'neutro'],
  [64.9, 'felice'], [67.5, 'neutro'], [72.6, 'felice'], [76.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché salta una scintilla\nquando stacchi la spina?'],
  [7.9, 12.8, 'Pila da 12 V, resistenza e una\n{g:bobina} con un nucleo di ferro.'],
  [12.9, 18.4, 'Chiudo (al rallentatore, 5 volte):\nla corrente sale {g:piano}, non di colpo.'],
  [18.5, 23.6, 'La corrente che cresce fa crescere\nil flusso {g:nella bobina stessa}…'],
  [23.7, 28.8, '…e la f.e.m. indotta si oppone\nalla crescita: è l’{g:autoinduzione}.'],
  [28.9, 34.0, 'Il flusso è proporzionale\nalla corrente: {mg:Φ} = {mink:L}·{mv:I}.'],
  [34.1, 39.2, '{mink:L} è l’{g:induttanza}, in henry (H):\n1 H = 1 Wb/A. Qui 3 H.'],
  [39.3, 44.4, 'Così {my:ε} = −{mink:L}·Δ{mv:I}/Δ{mink:t}: conta quanto\nin fretta cambia la corrente.'],
  [44.6, 49.4, 'Ora apro: i 2 A devono sparire\nin un millesimo di secondo.'],
  [49.5, 55.3, 'La corrente cala di 2 A in un millesimo\ndi secondo: Δ{mv:I}/Δ{mink:t} ≈ −2000 A/s.'],
  [55.4, 59.6, '{my:ε} = −3 H · (−2000 A/s)\n≈ {g:+6000 V}!'],
  [59.7, 64.8, 'La f.e.m. tiene viva la corrente:\nsalta una {g:scintilla} fra i contatti.'],
  [64.9, 69.8, 'Succede staccando la spina di un\nmotore acceso: dentro ha bobine.'],
  [72.6, 78.6, 'La bobina si oppone a ogni variazione\ndella sua corrente: è l’{g:autoinduzione}.'],
];

// ---------- la fisica ----------
const V0 = 12, RES = 6, LL = 3, TAUL = LL / RES, I0 = V0 / RES;   // 0,5 s, 2 A
const RALL = 5;
const T_CH1 = 13.3, T_APRE = 45.0, T_FINE_SC = 64.9;
// fermo immagine a t = τ (0,5 s: I = 1,26 A, ε = −4,4 V) mentre Stilla spiega, poi la salita riprende
const T_FERMO1 = T_CH1 + .5 * RALL, T_RIPRESA = 28.9;
const tf1 = t => t < T_FERMO1 ? Math.max(0, (t - T_CH1) / RALL) : t < T_RIPRESA ? .5 : .5 + (t - T_RIPRESA) / RALL;
const corr = s => I0 * (1 - Math.exp(-s / TAUL));                 // A
const femL = s => -V0 * Math.exp(-s / TAUL);                      // V: −L·dI/dt
function corrente(t) {   // la corrente nella bobina adesso (A)
  if (t < T_CH1) return 0;
  if (t < T_FINE_SC) return corr(tf1(t));        // nel fermo immagine della scintilla la corrente passa ancora nell'arco
  return 0;
}
const femAuto = t => (t < T_CH1 || t >= T_APRE) ? 0 : femL(tf1(t));
const chiuso = t => P(t, T_CH1 - .2, T_CH1) - P(t, T_APRE - .2, T_APRE);
const scintilla = t => t >= T_APRE && t < T_FINE_SC;

// ---------- aiutanti (gli stessi disegni dei video sulla corrente) ----------
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
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function filo(ctx, pts, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function pila(ctx, x, yc, al) {   // su un ramo verticale: il polo + (lungo e sottile) in alto
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
  ctx.fillStyle = C.paper; ctx.fillRect(x - 44, yc - 22, 88, 44);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, yc - 15); ctx.lineTo(x + 40, yc - 15); ctx.stroke();
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 20, yc + 15); ctx.lineTo(x + 20, yc + 15); ctx.stroke();
  ctx.restore();
  txt(ctx, '+', x + 62, yc - 32, { size: 40, weight: 600, color: C.v, alpha: al });
  txt(ctx, '−', x + 62, yc + 34, { size: 40, weight: 600, color: C.x, alpha: al });
}
function resistenza(ctx, a, b, al = 1) {
  if (al <= 0) return;
  const L = b[0] - a[0];
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const n = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
  for (let i = 0; i < n; i++) for (const [f, s] of [[.25, 1], [.75, -1]]) ctx.lineTo(a[0] + (i + f) * L / n, a[1] - 20 * s);
  ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function interruttore(ctx, a, b, k, al) {   // perno in a, contatto in b; k = 1 chiuso
  if (al <= 0) return;
  const L = b[0] - a[0], ang = -(1 - k) * .55;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink); ctx.fillStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L); ctx.stroke();
  for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// una bobina orizzontale da x0 a x1 sul nucleo (y): le spire dietro, poi (fuori) il nucleo, poi le spire davanti
function spireDietro(ctx, x0, x1, y, n, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(C.y, C.ink, .35), .55); ctx.lineWidth = 4;
  for (let i = 0; i < n; i++) { const x = x0 + (i + .5) * (x1 - x0) / n; ctx.beginPath(); ctx.ellipse(x, y, 12, 44, 0, Math.PI / 2, 3 * Math.PI / 2); ctx.stroke(); }
  ctx.restore();
}
function spireDavanti(ctx, x0, x1, y, n, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(mix(C.y, C.ink, .35)); ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const x = x0 + (i + .5) * (x1 - x0) / n; ctx.beginPath(); ctx.ellipse(x, y, 12, 44, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
  ctx.restore();
}
function nucleo(ctx, x0, x1, y, al) {
  if (al <= 0 || x1 <= x0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x0, y - 16, x1 - x0, 32, 6); ctx.fill(); ctx.stroke(); ctx.restore();
}
// la scintilla: una spezzata fissa a zig-zag fra a e b, con un alone
function lampo(ctx, a, b, al) {
  if (al <= 0) return;
  const pts = [a];
  for (let i = 1; i < 6; i++) { const f = i / 6; pts.push([lerp(a[0], b[0], f) + (i % 2 ? 7 : -7), lerp(a[1], b[1], f) + (i % 2 ? -11 : 11)]); }
  pts.push(b);
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], g = ctx.createRadialGradient(c[0], c[1], 4, c[0], c[1], 70);
  g.addColorStop(0, css(C.y, .55)); g.addColorStop(1, css(C.y, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], 70, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.y); ctx.lineWidth = 8; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}

// ---------- il circuito (sinistra) ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XB = 200, YT = 180, YB = 560, XR = 620, YP = 370, SW_A = [300, YT], SW_B = [390, YT];
const B1 = [300, 540];
function sceneCircuito(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kw = P(t, 8.0, 8.8);
  filo(ctx, [[XB, YP - 15], [XB, YT], SW_A], kw);
  filo(ctx, [SW_B, [440, YT]], kw);
  filo(ctx, [[580, YT], [XR, YT], [XR, YB], [B1[1], YB]], kw);
  filo(ctx, [[B1[0], YB], [XB, YB], [XB, YP + 15]], kw);
  resistenza(ctx, [440, YT], [580, YT], kw);
  pila(ctx, XB, YP, kw);
  // la scintilla, dietro alla lama aperta
  if (scintilla(t)) {
    const ang = -.55, tip = [SW_A[0] + Math.cos(ang) * 90, SW_A[1] + Math.sin(ang) * 90];
    lampo(ctx, tip, SW_B, P(t, T_APRE - .05, T_APRE + .1) * (1 - P(t, T_FINE_SC - .4, T_FINE_SC)));
  }
  interruttore(ctx, SW_A, SW_B, chiuso(t), kw);
  // la bobina e il nucleo
  const kb = P(t, 8.4, 9.2);
  spireDietro(ctx, B1[0], B1[1], YB, 11, kb);
  nucleo(ctx, 280, 560, YB, kb);
  spireDavanti(ctx, B1[0], B1[1], YB, 11, kb);
  // le scritte
  drawRich(ctx, '{y:12 V}', XB - 62, YP, { size: 36, align: 'right', alpha: kw });
  drawRich(ctx, '{mink:R} = 6 Ω', 510, 234, { size: 32, alpha: kw });
  txt(ctx, 'bobina', 420, 486, { size: 30, color: C.dim, alpha: kb * (1 - P(t, 34.1, 34.5)) });
  drawRich(ctx, '{mink:L} = 3 H', 420, 486, { size: 32, alpha: P(t, 34.3, 34.8) });
  txt(ctx, 'ferro', 610 + 0, YB + 56, { size: 28, color: C.dim, alpha: kb * (1 - P(t, 12.8, 13.2)) });
  const stato = scintilla(t) || (t >= T_FERMO1 && t < T_RIPRESA) ? 'fermo immagine' : t > T_CH1 && t < T_APRE ? 'al rallentatore (5 volte)' : '';
  if (stato) txt(ctx, stato, 1090, 142, { size: 28, color: C.dim, align: 'right' });
  // la corrente: freccia sopra il filo alto, lunga in proporzione
  const I = corrente(t), LI = 60 * I;
  freccia(ctx, [520 - LI / 2, 128], [520 + LI / 2, 128], C.v, I > .02 ? 1 : 0);
  if (I > .02) drawRich(ctx, '{mv:I}', 520 + LI / 2 + 14, 128, { size: 36, align: 'left' });
  // la stessa corrente sotto la bobina (dentro la bobina va verso sinistra), accanto alla f.e.m.
  freccia(ctx, [420 + LI / 2, 632], [420 - LI / 2, 632], C.v, I > .02 ? P(t, 23.8, 24.3) : 0, 6);
  if (I > .02) drawRich(ctx, '{mv:I}', 420 - LI / 2 - 14, 632, { size: 34, align: 'right', alpha: P(t, 23.8, 24.3) });
  // la f.e.m. autoindotta, sotto la bobina: contro la corrente mentre cresce, con la corrente alla scintilla
  if (scintilla(t)) {
    const ks = P(t, T_APRE, T_APRE + .3) * (1 - P(t, T_FINE_SC - .4, T_FINE_SC));
    freccia(ctx, [540, 682], [300, 682], C.y, ks, 7);
    drawRich(ctx, '{my:ε}', 270, 682, { size: 38, align: 'right', alpha: ks });
    txt(ctx, '≈ +6000 V (fuori scala)', 420, 728, { size: 30, alpha: ks * P(t, 55.1, 55.6) });
  } else {
    const e = femAuto(t), Le = 10 * Math.abs(e);
    if (Le > 3) {
      freccia(ctx, [420 - Le / 2, 682], [420 + Le / 2, 682], C.y, P(t, 23.8, 24.3), 7);
      drawRich(ctx, '{my:ε} {dim:indotta}', 420 + Math.max(Le / 2, 40) + 16, 682, { size: 32, align: 'left', alpha: P(t, 23.8, 24.3) });
    }
  }
  ctx.restore();
}

// ---------- a destra ----------
const GX0 = 1240, GPX = 220;                       // 2,2 s → 484 px
const gx = s => GX0 + Math.min(s, 2.2) * GPX;
function assi(ctx, y0, ytop, ybot, al, nome, unita) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX0 - 4, y0); ctx.lineTo(gx(2.2) + 20, y0); ctx.moveTo(GX0, ybot); ctx.lineTo(GX0, ytop); ctx.stroke();
  arrowHead(ctx, [gx(2.2) + 26, y0], 0, C.ink); arrowHead(ctx, [GX0, ytop - 6], -Math.PI / 2, C.ink);
  ctx.restore();
  drawRich(ctx, nome + ' {dim:(' + unita + ')}', GX0 + 16, ytop - 4, { size: 30, align: 'left', alpha: al });
  drawRich(ctx, '{mink:t} {dim:(s)}', gx(2.2) + 44, y0 + (ybot > y0 + 10 ? 32 : -30), { size: 30, align: 'right', alpha: al });
  for (const s of [1, 2]) txt(ctx, String(s), gx(s), y0 + (ybot > y0 + 10 ? -24 : 26), { size: 29, color: C.dim, alpha: al });
}
function curva(ctx, f, s1, y, col) {
  if (s1 <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i <= 160; i++) { const s = Math.min(s1, 2.2) * i / 160, p = [gx(s), y(f(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
}
function scenePannello1(ctx, t) {
  const al = life(t, 12.9, 44.7, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'la corrente nella bobina', 1480, 158, { size: 38, weight: 600 }));
  const gy = i => 455 - 115 * i;
  assi(ctx, 455, 210, 459, 1, '{mv:I}', 'A');
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(GX0, gy(2)); ctx.lineTo(gx(2.2), gy(2)); ctx.stroke(); ctx.restore();
  txt(ctx, '2', GX0 - 12, gy(2), { size: 29, color: C.dim, align: 'right' });
  const s = Math.min(tf1(t), 2.2);
  curva(ctx, corr, s, gy, C.v);
  if (t > T_CH1) { ctx.save(); ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(gx(s), gy(corr(s)), 8, 0, TAU); ctx.fill(); ctx.restore(); }
  const I = corrente(t), e = femAuto(t);
  drawRich(ctx, '{mv:I} =', 1250, 522, { size: 38, align: 'left' });
  fixedNum(ctx, fmtN(I, 2), 1480, 522, 42, C.v); txt(ctx, 'A', 1492, 522, { size: 36, align: 'left' });
  drawRich(ctx, '{my:ε} =', 1250, 574, { size: 38, align: 'left', alpha: P(t, 23.8, 24.3) });
  fixedNum(ctx, fmtN(e, 1), 1480, 574, 42, C.y, P(t, 23.8, 24.3)); txt(ctx, 'V', 1492, 574, { size: 36, align: 'left', alpha: P(t, 23.8, 24.3) });
  separa(ctx, 616, P(t, 28.9, 29.3));
  drawRich(ctx, '{mg:Φ} = {mink:L}·{mv:I}', 1340, 662, { size: 42, local: t - 29.0 });
  drawRich(ctx, '{mink:L} = 3 H', 1640, 662, { size: 42, local: t - 34.2 });
  drawRich(ctx, '{dim:henry:} 1 H = 1 Wb/A', 1480, 710, { size: 32, local: t - 34.8 });
  drawRich(ctx, '{my:ε} = −{mink:L}·Δ{mv:I}/Δ{mink:t}', 1480, 760, { size: 42, local: t - 39.4 });
  ctx.restore();
}
function scenePannello2(ctx, t) {
  const al = life(t, 44.6, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  const cx = 1480;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'apro l’interruttore', cx, 168, { size: 40, weight: 600, local: t - 44.7 }));
  drawRich(ctx, 'Δ{mv:I} = −2 A {dim:in} Δ{mink:t} ≈ 0,001 s', cx, 245, { size: 38, local: t - 45.0 });
  drawRich(ctx, 'Δ{mv:I}/Δ{mink:t} ≈ −2000 A/s', cx, 320, { size: 44, local: t - 49.6 });
  separa(ctx, 376, P(t, 55.0, 55.4));
  drawRich(ctx, '{my:ε} = −3 H · (−2000 A/s)', cx, 432, { size: 42, local: t - 55.1 });
  drawRich(ctx, '≈ {g:+6000 V}', cx, 512, { size: 72, local: t - 56.0 });
  drawRich(ctx, '{dim:positiva: nel verso della corrente}', cx, 580, { size: 30, local: t - 57.0 });
  separa(ctx, 628, P(t, 59.7, 60.1));
  drawRich(ctx, 'la corrente salta nell’aria:\nuna {g:scintilla}', cx, 690, { size: 34, lh: 1.35, local: t - 59.8 });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La scintilla quando\nstacchi la spina', W / 2, 200, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.1 }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.7, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 79.0, 80.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La bobina si oppone a ogni\nvariazione della sua corrente.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'autoinduzione\n{my:ε} = −{mink:L}·Δ{mv:I}/Δ{mink:t}'], [960, '{mink:L} {dim:in henry}\n1 H = 1 Wb/A'], [1470, 'corrente staccata di colpo:\n{g:scintilla}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la corrente, da 0 (0) a 2 A (1), con il tempo di tf1
  // (fermo immagine a t = τ fra 15,8 e 28,9 s)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.4, .4],                                                // il circuito, la bobina col ferro
    ['soffio', 12.7], ['pop', 13.3, .5],                                              // la scheda; chiudo l'interruttore
    ['traccia', 13.3, 15.8], ['tono', 13.3, 15.8, [0, .22, .39, .53, .63]],           // la corrente sale piano
    ['pop', 23.8, .3],                                                                // la f.e.m. indotta, contro la corrente
    ['pop', 29.0, .5], ['traccia', 28.9, 31.4], ['tono', 28.9, 31.4, [.63, .71, .78, .83, .86]],   // Φ = L·I; la salita riprende
    ['pop', 34.2, .5], ['pop', 34.8, .45], ['pop', 39.4, .55],                        // L = 3 H, l'henry, ε = −L·ΔI/Δt
    ['soffio', 44.6], ['pop', 45.0, .9],                                              // apro: la scintilla
    ['pop', 45.1, .4], ['pop', 49.6, .45],                                            // ΔI = −2 A in 0,001 s, −2000 A/s
    ['pop', 55.1, .5], ['ding', 56.0],                                                // ε ≈ +6000 V
    ['pop', 57.0, .4], ['pop', 59.8, .6],                                             // nel verso della corrente: la scintilla
    ['soffio', 70.4], ['pop', 72.4, .5], ['pop', 72.9, .6], ['pop', 73.4, .7],        // in una frase
  ];
  return {
    titolo: 'La scintilla quando stacchi la spina', durata: 81, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 44.4, 'autoinduzione'], [44.4, T_FINE, 'la scintilla']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCircuito(ctx, t); scenePannello1(ctx, t); scenePannello2(ctx, t); sceneFine(ctx, t); },
  };
});
