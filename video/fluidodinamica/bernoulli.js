'use strict';
/* Dove corre, preme meno — il tubo di Venturi con tre manometri: nella strozzatura l'acqua corre e la pressione cala;
   l'equazione di Bernoulli p + ½·d·v² = costante; i due fogli che si avvicinano soffiando. Argomento: fluidodinamica. */
CVIDEO.registra('fluidodinamica/bernoulli', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed } = M;

const T_FINE = 99.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [31.0, 'sorpreso'], [33.4, 'neutro'],
  [35.8, 'pensa'], [40.8, 'neutro'], [45.6, 'felice'], [48.0, 'neutro'], [61.0, 'felice'], [63.4, 'neutro'],
  [75.2, 'pensa'], [80.2, 'sorpreso'], [83.8, 'neutro'], [94.0, 'felice'], [96.4, 'neutro'], [101.2, 'felice'],
  [105.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Soffio fra due fogli:\nsi allontanano o si avvicinano?'],
  [7.9, 12.2, 'Un tubo orizzontale con tre tubicini\naperti in alto: sono {v:manometri}.'],
  [12.4, 17.0, 'Più l’acqua sale nel tubicino,\npiù è alta la {v:pressione} lì sotto.'],
  [17.2, 21.8, 'Tubo tutto uguale: velocità\nuguale, colonne alla stessa altezza.'],
  [22.0, 26.2, 'Ora un tubo con una {v:strozzatura}:\nil tubo di {v:Venturi}.'],
  [26.4, 30.8, 'Nella strozzatura l’acqua corre\nquattro volte più veloce.'],
  [31.0, 35.6, 'E la colonna lì sopra è più {v:bassa}:\nla pressione è {g:minore}!'],
  [35.8, 40.6, 'Per accelerare, l’acqua dev’essere\nspinta: dietro preme di più.'],
  [40.8, 45.2, 'Uscendo rallenta,\ne la pressione {g:risale}.'],
  [45.6, 50.3, 'Per un fluido {v:ideale} vale {v:Bernoulli}:\n{mv:p} + ½·{mink:d}·{mx:v}² resta costante.'],
  [50.5, 55.0, 'Ideale: incomprimibile e senza attrito.\n{mink:d} è la densità dell’acqua: 1000 kg/m³.'],
  [55.2, 60.8, 'Da 0,5 a 2 m/s, ½·{mink:d}·{mx:v}² cresce\ndi 1875 Pa: {mv:p} cala di 1875 Pa.'],
  [61.0, 65.8, 'Infatti la colonna scende di 19 cm:\n{mink:d·g·Δh} ≈ 1875 Pa.'],
  [66.0, 70.4, 'Se il tubo sale o scende, si aggiunge\nanche {mink:d·g·h}.'],
  [71.0, 75.0, 'Due fogli appesi, vicini,\ncon l’aria ferma intorno.'],
  [75.2, 80.0, 'Se soffio in mezzo, viene da pensare\nche il soffio li {r:spinga via}.'],
  [80.2, 83.6, 'Invece si {g:avvicinano}!'],
  [83.8, 88.8, 'Il soffio si porta via l’aria\nfra i fogli: ne entra altra da fuori.'],
  [89.0, 93.8, 'Parte {v:ferma}, a pressione {mv:p₀}, e accelera:\nlungo il suo percorso {mv:p} {v:cala}.'],
  [94.0, 99.0, 'Fra i fogli {mv:p} è un po’ sotto {mv:p₀}:\nl’aria di fuori li {g:avvicina}.'],
  [101.2, 106.4, 'Lungo lo stesso tubo di flusso:\nfluido più veloce, pressione più bassa.'],
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
function riga(ctx, nome, val, y, col, al, x0, x1, size = 36) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right', fill: css(col) });
  ctx.restore();
}
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
const mod = (a, n) => ((a % n) + n) % n;

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Dove corre, preme meno', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il tubo: velocità uniforme in ogni sezione, v = Q/S con S proporzionale a D² ----------
const CA = [110, 110, 1100, 680], YC = 620, XL = 112, XR = 1208;
const D1 = 160, D2 = 80, V1 = 60;                 // px, px/s al rallentatore (0,5 m/s veri)
const TX = [300, 660, 1030];                      // i tre manometri
const PXCM = 10;                                  // le colonne: 10 px per cm, misurate dall'asse del tubo
const dUnif = () => D1;
function dVent(x) {
  const tr = (a, b, da, db) => lerp(da, db, (1 - Math.cos(Math.PI * clamp((x - a) / (b - a)))) / 2);
  if (x < 460) return D1; if (x < 560) return tr(460, 560, D1, D2);
  if (x < 760) return D2; if (x < 860) return tr(760, 860, D2, D1);
  return D1;
}
const vel = (Dx, x) => V1 * (D1 / Dx(x)) ** 2;
function tabella(Dx) {
  const xs = [], ss = []; let s = 0;
  for (let x = XL; x <= XR; x += 1) { xs.push(x); ss.push(s); s += 1 / vel(Dx, x + .5); }
  return { xs, ss, T: ss[ss.length - 1], Dx };
}
const UNIF = tabella(dUnif), VENT = tabella(dVent);
function xDi(tb, s) {
  const { xs, ss } = tb; let a = 0, b = ss.length - 1;
  while (b - a > 1) { const m = (a + b) >> 1; if (ss[m] <= s) a = m; else b = m; }
  return lerp(xs[a], xs[b], clamp((s - ss[a]) / ((ss[b] - ss[a]) || 1)));
}
// nel tubo di Venturi l'acqua parte a 26,4 s e in 1 s arriva alla sua velocità (rapporto r da 0 a 1)
const rVent = t => clamp(t - 26.4);
const tVent = t => t < 26.4 ? 0 : t < 27.4 ? (t - 26.4) ** 2 / 2 : .5 + t - 27.4;
const tUnif = t => Math.max(0, t - 7.9);
// Bernoulli: con 0,5 m/s e 2 m/s la colonna in mezzo scende di 1875 / (1000·9,8) m ≈ 19,1 cm (con r: Δp va come v²)
const H0 = 40, DH = 1875 / (1000 * 9.8) * 100;
const colonne = (venturi, t) => venturi ? [H0, H0 - DH * rVent(t) ** 2, H0] : [H0, H0, H0];
function tubo(ctx, Dx, al, hs) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const su = [], giu = [];
  for (let x = XL; x <= XR; x += 4) { su.push([x, YC - Dx(x) / 2]); giu.push([x, YC + Dx(x) / 2]); }
  ctx.fillStyle = css(C.x, .13); ctx.beginPath(); su.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
  giu.slice().reverse().forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill();
  // i manometri: tubicini aperti in alto, con l'acqua fino alla sua colonna
  TX.forEach((x, i) => {
    const base = YC - Dx(x) / 2, top = YC - hs[i] * PXCM;
    ctx.fillStyle = css(C.x, .32); ctx.fillRect(x - 11, top, 22, base - top + 2);
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 11, top); ctx.lineTo(x + 11, top); ctx.stroke();
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * 13, base); ctx.lineTo(x + s * 13, 150); ctx.stroke(); }
  });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  // la parete di sopra si interrompe dove entrano i tubicini
  ctx.beginPath(); let giu2 = false;
  su.forEach(p => { const buco = TX.some(x => Math.abs(p[0] - x) < 13); if (buco) giu2 = false; else if (!giu2) { ctx.moveTo(...p); giu2 = true; } else ctx.lineTo(...p); });
  ctx.stroke();
  ctx.beginPath(); giu.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
  ctx.restore();
}
function particelle(ctx, tb, tp, al) {
  if (al <= 0) return;
  const n = Math.round(tb.T / .35), ds = tb.T / n;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.x, .85);
  for (let c = 0; c < n; c++) for (let j = 0; j < 5; j++) {
    const s = mod(c * ds + (j % 2) * ds / 2 + tp, tb.T), x = xDi(tb, s);
    const y = YC + (j - 2) / 2.5 * (tb.Dx(x) / 2 - 2);
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// 1–2 · il tubo di Venturi e l'equazione di Bernoulli (7,5–70,6)
const SV = 80;   // frecce della velocità: 80 px per m/s
function scenaVenturi(ctx, t) {
  if (t < 7.5 || t > 70.8) return;
  const ka = life(t, 7.6, 70.6, .6, .6);
  card(ctx, ...CA, ka); card(ctx, 1250, 110, 560, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const k1 = 1 - P(t, 21.8, 22.4), k2 = P(t, 21.8, 22.4), ven = t > 22.1;
  ctx.save(); ctx.beginPath(); ctx.roundRect(CA[0] + 2, CA[1] + 2, CA[2] - 4, CA[3] - 4, 20); ctx.clip();
  if (k1 > 0) { tubo(ctx, dUnif, k1, colonne(false, t)); particelle(ctx, UNIF, tUnif(t), k1); }
  if (k2 > 0) { tubo(ctx, dVent, k2, colonne(true, t)); particelle(ctx, VENT, tVent(t), k2); }
  ctx.restore();
  txt(ctx, 'al rallentatore', 480, 140, { size: 30, color: C.dim, alpha: P(t, 7.9, 8.4) * (ven && t < 26.4 ? 0 : 1) });
  const hs = colonne(ven, t);
  // le altezze delle colonne
  const kc = life(t, 12.5, 70.4, .4, .4);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    drawRich(ctx, Math.round(hs[0]) + ' cm', TX[0] - 26, YC - hs[0] * PXCM, { size: 32, align: 'right' });
    drawRich(ctx, Math.round(hs[1]) + ' cm', TX[1] - 26, YC - hs[1] * PXCM, { size: 32, align: 'right' });
    drawRich(ctx, Math.round(hs[2]) + ' cm', TX[2] + 26, YC - hs[2] * PXCM, { size: 32, align: 'left' });
    ctx.restore();
  }
  // il dislivello nella strozzatura
  const kd = life(t, 31.0, 70.4, .4, .4);
  if (kd > 0) {
    const y0 = YC - H0 * PXCM, y1 = YC - hs[1] * PXCM;
    dashed(ctx, [TX[0] + 16, y0], [TX[2] - 16, y0], C.dim, 1, kd);
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(TX[1] + 34, y0 + 6); ctx.lineTo(TX[1] + 34, y1 - 6); ctx.stroke();
    arrowHead(ctx, [TX[1] + 34, y0], -Math.PI / 2, C.v, .7); arrowHead(ctx, [TX[1] + 34, y1], Math.PI / 2, C.v, .7);
    drawRich(ctx, '{mink:Δh} ≈ 19 cm', TX[1] + 52, (y0 + y1) / 2, { size: 34, align: 'left' });
    ctx.restore();
  }
  // le velocità, frecce lunghe in proporzione
  const kv = life(t, 17.2, 22.0, .4, .4);
  if (kv > 0) { freccia(ctx, [170, 755], [170 + .5 * SV, 755], C.x, kv, 6); drawRich(ctx, '0,5 m/s', 225, 755, { size: 32, align: 'left', alpha: kv, fill: css(C.x) }); }
  const r = rVent(t), kw = life(t, 26.4, 70.4, .3, .4);
  if (kw > 0 && r > .05) {
    freccia(ctx, [170, 755], [170 + .5 * r * SV, 755], C.x, kw, 6); drawRich(ctx, '0,5 m/s', 225, 755, { size: 32, align: 'left', alpha: kw * P(r, .9, 1), fill: css(C.x) });
    freccia(ctx, [590, 755], [590 + 2 * r * SV, 755], C.x, kw, 6); drawRich(ctx, '2 m/s', 770, 755, { size: 32, align: 'left', alpha: kw * P(r, .9, 1), fill: css(C.x) });
    freccia(ctx, [950, 755], [950 + .5 * r * SV, 755], C.x, kw, 6); drawRich(ctx, '0,5 m/s', 1005, 755, { size: 32, align: 'left', alpha: kw * P(r, .9, 1), fill: css(C.x) });
  }
  // la scheda: prima le misure, poi Bernoulli
  const xa = 1290, xb = 1770, kM = life(t, 12.4, 45.6, .4, .5);
  if (kM > 0) {
    ctx.save(); ctx.globalAlpha *= kM;
    titoletto(ctx, 'nel tubo', 1530, 165);
    txt(ctx, ven ? 'tratto largo' : 'in tutto il tubo', xa, 240, { size: 30, color: C.dim, align: 'left' });
    riga(ctx, 'velocità', '0,5 m/s', 300, C.x, ven ? P(t, 26.6, 27.1) : P(t, 17.3, 17.8), xa, xb);
    riga(ctx, 'colonna', '40 cm', 360, C.v, 1, xa, xb);
    ctx.globalAlpha *= P(t, 22.2, 22.7);
    txt(ctx, 'strozzatura', xa, 450, { size: 30, color: C.dim, align: 'left' });
    riga(ctx, 'velocità', '2 m/s', 510, C.x, P(t, 26.6, 27.1), xa, xb);
    riga(ctx, 'colonna', ven && t > 28 ? '21 cm' : '40 cm', 570, C.v, 1, xa, xb);
    riga(ctx, 'dislivello', '≈ 19 cm', 670, C.g, P(t, 31.2, 31.7), xa, xb);
    ctx.restore();
  }
  const kB = life(t, 45.6, 70.4, .5, .4);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    titoletto(ctx, '{v:Bernoulli}', 1530, 165);
    drawRich(ctx, '{mv:p} + ½·{mink:d}·{mx:v}² = costante', 1530, 245, { size: 42, local: t - 45.8 });
    drawRich(ctx, '{mink:d}{dim:: densità del fluido}', 1530, 292, { size: 30, local: t - 46.0 });
    drawRich(ctx, '{dim:fluido }{v:ideale}{dim:, tubo orizzontale}', 1530, 332, { size: 30, local: t - 46.4 });
    drawRich(ctx, '{dim:(incomprimibile, senza attrito)}', 1530, 372, { size: 30, local: t - 50.7 });
    riga(ctx, '½·{mink:d}·{mx:v₁}{mink:²}', '125 Pa', 420, C.ink, P(t, 55.4, 55.9), xa, xb);
    riga(ctx, '½·{mink:d}·{mx:v₂}{mink:²}', '2000 Pa', 475, C.ink, P(t, 55.8, 56.3), xa, xb);
    riga(ctx, 'differenza', '1875 Pa', 530, C.g, P(t, 56.4, 56.9), xa, xb);
    drawRich(ctx, '{mink:d·g·Δh} = 1000 · 9,8 · 0,1913', 1530, 590, { size: 32, local: t - 61.2 });
    drawRich(ctx, '≈ {g:1875 Pa}', 1530, 640, { size: 38, local: t - 62.2 });
    drawRich(ctx, '{dim:se cambia la quota: }+ {mink:d·g·h}', 1530, 725, { size: 32, local: t - 66.2 });
    ctx.restore();
  }
  ctx.restore();
}

// 3 · i due fogli (70,6–99,2): il soffio trascina via l'aria fra i fogli; quella che entra a sostituirla parte ferma
// a p₀ e accelera, e lungo il suo percorso (lo stesso tubo di flusso) la pressione cala: fra i fogli è un po' sotto p₀
const XF = 660, GAP = 60, YT = 200, LF = 440;     // fogli appesi in alto, a 120 px l'uno dall'altro
const T_SOFFIO = 80.0;
// la flessione: si avvicinano fino a una nuova posizione di equilibrio
const flessione = t => t < T_SOFFIO + .2 ? 0 : 40 * (1 - Math.exp(-(t - T_SOFFIO - .2) / .35));
const xFoglio = (lato, y, d) => XF + lato * (GAP - d * ((y - YT) / LF) ** 2);
// il percorso dell'aria che entra fra i fogli: dall'aria ferma di fuori scavalca la molletta e scende nel soffio
function percorso(lato) {
  const P0 = [XF + lato * 225, 192], C1 = [XF + lato * 150, 122], C2 = [XF + lato * 40, 124], P3 = [XF + lato * 32, 250];
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, e = u ** 3;
    pts.push([a * P0[0] + b * C1[0] + c * C2[0] + e * P3[0], a * P0[1] + b * C1[1] + c * C2[1] + e * P3[1]]);
  }
  for (let y = 260; y <= 340; y += 10) pts.push([P3[0], y]);
  const ls = [0]; for (let i = 1; i < pts.length; i++) ls.push(ls[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, ls, L: ls[ls.length - 1] };
}
const PERCORSI = [percorso(-1), percorso(1)];
function puntoSu(pc, s) {   // punto e direzione a distanza s dall'inizio del percorso
  const { pts, ls } = pc; let i = 1;
  while (i < pts.length - 1 && ls[i] < s) i++;
  const a = pts[i - 1], b = pts[i], f = clamp((s - ls[i - 1]) / ((ls[i] - ls[i - 1]) || 1)), L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), (b[0] - a[0]) / L, (b[1] - a[1]) / L];
}
// la particella parte ferma e accelera (½·a·τ²) fino a VMAX, poi va dritta col soffio (px, al rallentatore)
const A_ENTRA = 400, VMAX_ENTRA = 380, DT_ENTRA = .15, TAU_ACC = VMAX_ENTRA / A_ENTRA;
const sEntra = tau => tau < TAU_ACC ? A_ENTRA * tau * tau / 2 : A_ENTRA * TAU_ACC * TAU_ACC / 2 + VMAX_ENTRA * (tau - TAU_ACC);
const vEntra = s => Math.min(VMAX_ENTRA, Math.sqrt(2 * A_ENTRA * s));
function scenaFogli(ctx, t) {
  if (t < 70.4 || t > T_FINE + .3) return;
  const ka = life(t, 70.6, T_FINE + .1, .6, .5), d = flessione(t);
  card(ctx, ...CA, ka); card(ctx, 1250, 110, 560, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  // l'aria del soffio: strisce che scendono veloci fra i fogli
  const ks = P(t, T_SOFFIO, T_SOFFIO + .3);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 15; i++) {
      const y = YT + 10 + mod(i * 61 + (t - T_SOFFIO) * 520, LF + 40), f = (i % 5) / 4 - .5;
      if (y > YT + LF + 20) continue;
      const x = XF + f * 1.3 * (GAP - d * ((Math.min(y, YT + LF) - YT) / LF) ** 2);
      ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.restore();
    // la cannuccia
    ctx.fillStyle = css(C.dim); ctx.fillRect(XF - 9, 122, 18, 58);
  }
  // i fogli, tenuti in alto da due mollette
  for (const lato of [-1, 1]) {
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let y = YT; y <= YT + LF; y += 8) { const x = xFoglio(lato, y, d); y === YT ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.roundRect(XF + lato * GAP - 9, YT - 26, 18, 34, 5); ctx.fill();
  }
  // l'idea sbagliata, in rosso: il soffio li spingerebbe via
  const kr = life(t, 75.4, 81.6, .4, .5);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    for (const lato of [-1, 1]) {
      ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = css(C.r); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(XF + lato * (GAP + 10), 430); ctx.lineTo(XF + lato * (GAP + 90), 430); ctx.stroke(); ctx.restore();
      arrowHead(ctx, [XF + lato * (GAP + 104), 430], lato > 0 ? 0 : Math.PI, C.r);
    }
    drawRich(ctx, '{r:il soffio li spinge via?}', XF, 720, { size: 36 });
    const kx = P(t, 80.4, 81.0), lw = richW(ctx, 'il soffio li spinge via?', 36) / 2;
    if (kx > 0) { ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(XF - lw, 720); ctx.lineTo(lerp(XF - lw, XF + lw, kx), 720); ctx.stroke(); }
    ctx.restore();
  }
  // il soffio si porta via l'aria che sta fra i fogli: esce in basso
  const kv0 = P(t, 84.0, 84.5);
  if (kv0 > 0) freccia(ctx, [XF, YT + LF + 28], [XF, YT + LF + 74], C.x, kv0, 6);
  // l'aria che entra al suo posto: parte ferma (a p₀), accelera lungo il suo percorso e si unisce al soffio
  const ke = P(t, 84.0, 84.6);
  if (ke > 0) for (const lato of [-1, 1]) {
    const pc = PERCORSI[lato > 0 ? 1 : 0];
    // il percorso, tratteggiato, e le frecce della velocità che si allungano (lunghe come la velocità)
    const kq = P(t, 89.1, 89.6);
    if (kq > 0) {
      ctx.save(); ctx.globalAlpha *= kq * .6; ctx.setLineDash([8, 9]); ctx.strokeStyle = css(C.x); ctx.lineWidth = 2.5;
      ctx.beginPath(); pc.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
      for (const s of [16, 55, 120]) {
        const [x, y, tx, ty] = puntoSu(pc, s), L = vEntra(s) * .16;
        let nx = -ty, ny = tx; if (ny < 0) { nx = -nx; ny = -ny; }   // sotto il percorso, dove c'è posto
        const a0 = [x + nx * 24 - tx * L / 2, y + ny * 24 - ty * L / 2];
        freccia(ctx, a0, [a0[0] + tx * L, a0[1] + ty * L], C.x, kq, 5);
      }
    }
    // le particelle d'aria: una ogni DT_ENTRA s, con s = ½·a·τ² finché non arriva a VMAX, poi a velocità costante
    ctx.save(); ctx.globalAlpha *= ke; ctx.fillStyle = css(C.x, .9);
    const tp = t - T_SOFFIO, kMax = Math.floor(tp / DT_ENTRA);
    for (let k = kMax; k >= 0 && k > kMax - 30; k--) {
      const s = sEntra(tp - k * DT_ENTRA);
      if (s > pc.L) break;
      const al = clamp(s / 30) * (1 - clamp((s - pc.L + 70) / 70));
      if (al <= 0) continue;
      const [x, y] = puntoSu(pc, s);
      ctx.save(); ctx.globalAlpha *= al; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
  // fuori l'aria ferma, a p₀; poi le sue spinte sui fogli
  const kp0 = P(t, 89.1, 89.6), kp = P(t, 94.1, 94.6);
  drawRich(ctx, '{mv:p₀}', XF - 300, 290, { size: 40, alpha: kp0 });
  drawRich(ctx, '{mv:p₀}', XF + 300, 290, { size: 40, alpha: kp0 });
  if (kp > 0) {
    // sul foglio: la spinta dell'aria di fuori (p₀, verso dentro) e quella, un po' più debole, dell'aria fra i fogli
    // (verso fuori, freccia più corta): la spinta netta è la differenza, verso dentro
    for (const y of [320, 440, 560]) for (const lato of [-1, 1]) {
      const yo = y - 14, yi = y + 14, xo = xFoglio(lato, yo, d) + lato * 8, xi = xFoglio(lato, yi, d) + lato * 8;
      freccia(ctx, [xo + lato * 100, yo], [xo, yo], C.y, kp, 6);
      freccia(ctx, [xi, yi], [xi + lato * 78, yi], C.y, kp * .8, 5);
    }
  }
  const kf0 = P(t, 71.2, 71.7);
  drawRich(ctx, '{dim:aria ferma}', XF - 300, 235, { size: 32, alpha: kf0 }); drawRich(ctx, '{dim:aria ferma}', XF + 300, 235, { size: 32, alpha: kf0 });
  drawRich(ctx, '{dim:fra i fogli: }{mv:p}{dim: un po’ sotto }{mv:p₀}', XF, 748, { size: 32, alpha: kp });
  // la scheda: Bernoulli lungo il percorso dell'aria che entra (non fra l'aria di fuori e il soffio)
  titoletto(ctx, 'fra i fogli', 1530, 165, P(t, 71.2, 71.7));
  const xa = 1290, xb = 1770;
  drawRich(ctx, '{dim:il soffio porta via l’aria;}', 1530, 232, { size: 30, local: t - 84.0 });
  drawRich(ctx, '{dim:ne entra altra, da fuori}', 1530, 270, { size: 30, local: t - 84.6 });
  drawRich(ctx, '{dim:lungo il suo tubo di flusso:}', 1530, 328, { size: 30, local: t - 89.2 });
  drawRich(ctx, '{mv:p} + ½·{mink:d}·{mx:v}² = {mv:p₀}', 1530, 385, { size: 40, local: t - 89.8 });
  drawRich(ctx, '{mink:d}{dim:: densità dell’aria; a queste}', 1530, 434, { size: 30, local: t - 90.0 });
  drawRich(ctx, '{dim:velocità si comprime pochissimo}', 1530, 470, { size: 30, local: t - 90.3 });
  riga(ctx, '{dim:fuori, ferma}', '{mv:p} = {mv:p₀}', 535, C.v, P(t, 90.6, 91.1), xa, xb);
  riga(ctx, '{dim:entrando accelera}', '{mv:p} cala', 592, C.v, P(t, 91.2, 91.7), xa, xb);
  riga(ctx, 'fra i fogli', '{mv:p} < {mv:p₀}', 658, C.g, P(t, 94.2, 94.7), xa, xb);
  drawRich(ctx, '{g:fuori }{mv:p₀}{g: spinge di più}', 1530, 732, { size: 32, local: t - 95.0 });
  ctx.restore();
}

// in una frase (99,2–109,4)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 107.5, 108.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 99.4 });
    drawRich(ctx, 'Lungo lo stesso tubo di flusso, dove il fluido\ncorre {x:più veloce}, la pressione è {v:più bassa}.', W / 2, 290, { size: 60, weight: 600, local: t - 99.8, stagger: .09 });
  });
  const pills = [[490, '{mv:p} + ½·{mink:d}·{mx:v}²\n{dim:resta costante}'], [960, 'tubo di {v:Venturi}:\nstretto, colonna bassa'], [1430, 'due fogli:\nsi {g:avvicinano}']];
  pills.forEach(([x, s], i) => {
    const a = 101.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): quando l'acqua parte il tono segue la colonna sopra la strozzatura, che
  // scende col quadrato della velocità (colonne(), da 40 a 21 cm); coi fogli segue i fogli che si avvicinano (flessione())
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['tono', 7.9, 8.9, [.4, .4]],                                    // il tubo coi manometri: l'acqua scorre
    ['pop', 12.5, .55], ['pop', 17.3, .45],                                           // le colonne a 40 cm; 0,5 m/s ovunque
    ['pop', 22.1, .5],                                                                // il tubo di Venturi
    ['tono', 26.4, 27.4, [.8, .782, .728, .638, .513]], ['pop', 26.6, .65],           // l'acqua parte: 2 m/s, la colonna scende
    ['traccia', 31.0, 31.4], ['ding', 31.4],                                          // Δh ≈ 19 cm: pressione minore
    ['soffio', 45.6], ['pop', 45.8, .6], ['pop', 46.0, .35], ['pop', 50.7, .35],      // Bernoulli: p + ½·d·v² costante
    ['pop', 55.4, .4], ['pop', 55.8, .6], ['ding', 56.5],                             // 125 Pa, 2000 Pa: differenza 1875 Pa
    ['pop', 61.2, .45], ['ding', 62.5], ['pop', 66.2, .4],                            // d·g·Δh ≈ 1875 Pa; + d·g·h
    ['soffio', 70.6], ['pop', 71.2, .45],                                             // due fogli nell'aria ferma
    ['pop', 75.4, .3],                                                                // li spinge via?
    ['soffio', 80.0], ['tono', 80.2, 81.4, [.55, .406, .345, .319, .308]],            // soffio in mezzo: si avvicinano
    ['traccia', 80.4, 81.0], ['ding', 81.0],
    ['pop', 84.0, .5],                                                                // l'aria fra i fogli esce, ne entra altra
    ['traccia', 89.1, 89.6], ['pop', 89.2, .55], ['pop', 89.8, .6],                   // il suo percorso, p₀; Bernoulli
    ['tono', 89.6, 90.55, [.3, .7]],                                                  // entrando accelera
    ['pop', 90.6, .5], ['pop', 91.2, .3],                                             // fuori p = p₀; entrando p cala
    ['pop', 94.1, .5], ['ding', 94.5],                                                // fra i fogli p < p₀: li avvicina
    ['soffio', 99.4], ['pop', 101.6, .5], ['pop', 102.1, .6], ['pop', 102.6, .7],     // in una frase
  ];
  return {
    titolo: 'Dove corre, preme meno', durata: 109.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 45.4, 'il tubo di Venturi'], [45.4, 70.6, 'l’equazione di Bernoulli'], [70.6, T_FINE, 'i due fogli']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaVenturi(ctx, t); scenaFogli(ctx, t); scenaFine(ctx, t); },
  };
});
