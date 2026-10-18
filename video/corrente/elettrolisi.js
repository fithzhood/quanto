'use strict';
/* La corrente nell'acqua salata — una pila, una lampadina e due elettrodi in un becher. Con acqua distillata la
   lampadina resta spenta; sciolto il sale (NaCl → Na⁺ + Cl⁻) si accende. L'ipotesi «gli elettroni attraversano il
   liquido» in rosso, smentita: gli elettroni (pallini piccoli C.x) corrono nei fili e nel metallo degli elettrodi e lì si
   fermano; nel liquido si muovono gli ioni, Na⁺ (C.v) verso l'elettrodo − e Cl⁻ (C.x) verso il +, in versi opposti: per
   la corrente (C.v, dal + al − nel liquido) è lo stesso verso. Ogni ione, appena sciolto, va a velocità costante (la
   spinta del campo è bilanciata dall'attrito del liquido): x = x₀ ± v·t; i Cl⁻ sono 7,91/5,19 ≈ 1,52 volte più veloci
   dei Na⁺ (mobilità vere in acqua). Gli ioni compaiono uno alla volta mentre il sale si scioglie (lineare, 18,4–22,4 s):
   corrente, luce della lampadina e velocità degli elettroni sono proporzionali agli ioni presenti, e la strada degli
   elettroni è l'integrale di quella velocità. Moto molto accelerato (dirlo): gli ioni veri fanno pochi µm al secondo.
   Densità degli ioni uniforme nel liquido (rientrano dall'altra parte); che cosa succede agli elettrodi lo dicono i gas:
   + : 2 Cl⁻ → Cl₂ + 2 elettroni; − : 2 H₂O + 2 elettroni → H₂ + 2 OH⁻ (il sodio non reagisce). Bollicine a velocità di salita
   costante, da quando se ne parla. Ioni su otto righe distinte (39 px), una specie per riga: non si sovrappongono mai. In coda tre cenni brevissimi: gas
   (ioni + ed elettroni in versi opposti), semiconduttori (fra isolanti e conduttori), superconduttori (R = 0 sotto
   4,2 K per il mercurio, Kamerlingh Onnes 1911). Colori fissi: positivi e corrente C.v, negativi ed elettroni C.x.
   Argomento: corrente. */
CVIDEO.registra('corrente/elettrolisi', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 83.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.0, 'pensa'], [18.1, 'neutro'],
  [23.5, 'felice'], [27.5, 'pensa'], [31.6, 'neutro'], [46.9, 'felice'], [52.4, 'neutro'], [63.5, 'felice'],
  [68.7, 'neutro'], [73.5, 'pensa'], [78.3, 'sorpreso'], [86.0, 'felice'], [90.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Nell’acqua salata passa corrente:\nma chi porta le cariche?'],
  [7.9, 12.9, 'Una pila, una lampadina e due lastre\ndi metallo nell’acqua: gli {g:elettrodi}.'],
  [13.0, 18.0, 'Con acqua distillata la lampadina resta\nspenta: quasi nessuna carica libera.'],
  [18.1, 23.4, 'Sciolgo il sale: si divide in {g:ioni},\natomi con una carica, {v:Na⁺} e {x:Cl⁻}.'],
  [23.5, 27.4, 'La lampadina si {g:accende}:\nl’acqua salata conduce.'],
  [27.5, 31.5, 'Idea diffusa: gli elettroni\n{r:attraversano} il liquido.'],
  [31.6, 37.0, '{r:No}: gli elettroni non lo attraversano;\nsi scambiano solo sugli elettrodi.'],
  [37.1, 42.1, 'Nel liquido si muovono gli {g:ioni}:\ni {v:Na⁺} verso l’elettrodo negativo…'],
  [42.2, 46.8, '…e i {x:Cl⁻} verso quello positivo:\nin {g:versi opposti}.'],
  [46.9, 52.3, 'Cariche opposte in versi opposti: per\nla corrente {mv:I} è lo {g:stesso verso}.'],
  [52.4, 58.0, 'All’elettrodo {v:+} i {x:Cl⁻} cedono un elettrone\nal filo: si libera {g:cloro}, un gas.'],
  [58.1, 63.4, 'All’elettrodo {x:−} il filo dà elettroni\nall’acqua: si libera {g:idrogeno}.'],
  [63.5, 68.6, 'È l’{g:elettrolisi}: la corrente provoca\nreazioni chimiche agli elettrodi.'],
  [68.7, 73.4, 'Un {g:gas} conduce se ha ioni ed elettroni\nliberi: così nel fulmine.'],
  [73.5, 78.2, 'I {g:semiconduttori}, come il silicio,\nstanno fra conduttori e isolanti.'],
  [78.3, 83.0, 'E i {g:superconduttori}, molto freddi,\nhanno resistenza {g:zero}.'],
  [86.0, 92.0, 'Nell’acqua salata la portano gli {g:ioni},\nin versi opposti; gli elettroni no.'],
];

// ---------- la fisica ----------
const T_SALE = 18.4, T_SCIOLTO = 22.4;                       // il sale si scioglie, uno ione dopo l'altro
const kSale = t => clamp((t - T_SALE) / (T_SCIOLTO - T_SALE));   // frazione degli ioni presenti = corrente / corrente piena
// integrale di kSale: la strada fatta da chi va a velocità proporzionale alla corrente
const intSale = t => t < T_SALE ? 0 : t < T_SCIOLTO ? (t - T_SALE) * (t - T_SALE) / (2 * (T_SCIOLTO - T_SALE)) : (T_SCIOLTO - T_SALE) / 2 + (t - T_SALE - (T_SCIOLTO - T_SALE));
const VNA = 40, VCL = VNA * 7.91 / 5.19, VE = 95;             // px/s: Na⁺, Cl⁻ (mobilità vere), elettroni nei fili a corrente piena
const caso = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
const mod = (a, n) => ((a % n) + n) % n;

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
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a, x0 = 1190, x1 = 1770) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
function linea(ctx, pts, al = 1, w = 5, col = C.ink) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
}
function elettrone(ctx, p, al = 1, r = 10, anello = null) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  if (anello) { ctx.strokeStyle = css(anello); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], r + 7, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]); ctx.stroke();
  ctx.restore();
}
// uno ione: più grande di un elettrone, col suo segno
function ione(ctx, p, s, al = 1, r = 17) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(s > 0 ? C.v : C.x); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1]); ctx.lineTo(p[0] + r * .5, p[1]);
  if (s > 0) { ctx.moveTo(p[0], p[1] - r * .5); ctx.lineTo(p[0], p[1] + r * .5); }
  ctx.stroke(); ctx.restore();
}
function lampadina(ctx, c, r, luce, al = 1) {
  if (al <= 0) return;
  const caldo = mix(C.y, [255, 214, 90], .45);
  ctx.save(); ctx.globalAlpha *= al;
  if (luce > 0) {
    const g = ctx.createRadialGradient(c[0], c[1], r * .3, c[0], c[1], r * 2.4);
    g.addColorStop(0, css(caldo, .55 * luce)); g.addColorStop(1, css(caldo, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r * 2.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(caldo, luce); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) * TAU / 8; if (Math.abs(Math.sin(a)) < .3) continue;   // niente raggi sul filo orizzontale
      ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(a) * (r + 12), c[1] + Math.sin(a) * (r + 12)); ctx.lineTo(c[0] + Math.cos(a) * (r + 34), c[1] + Math.sin(a) * (r + 34)); ctx.stroke();
    }
  }
  ctx.fillStyle = luce > 0 ? css(mix(C.paper, caldo, .35 * luce)) : C.paper;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(mix(C.ink, caldo, luce)); ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(c[0] - r, c[1]); ctx.lineTo(c[0] - r * .4, c[1]);
  for (let i = 0; i <= 8; i++) ctx.lineTo(c[0] - r * .4 + i * r * .1, c[1] + (i % 2 ? 12 : -12) * (i && i < 8 ? 1 : 0));
  ctx.lineTo(c[0] + r, c[1]); ctx.stroke();
  ctx.restore();
}
function percorso(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
function puntoSu(pc, s) {
  s = clamp(s, 0, pc.L); let i = 1; while (i < pc.cum.length - 1 && pc.cum[i] < s) i++;
  const f = (s - pc.cum[i - 1]) / ((pc.cum[i] - pc.cum[i - 1]) || 1);
  return [lerp(pc.pts[i - 1][0], pc.pts[i][0], f), lerp(pc.pts[i - 1][1], pc.pts[i][1], f)];
}

// ---------- il becher ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const BX0 = 240, BX1 = 980, BTOP = 360, BBOT = 765, WTOP = 420;      // becher e pelo dell'acqua
const AX = 340, KX = 880, EW = 11, EY0 = 320, EY1 = 725;             // elettrodi: + a sinistra, − a destra
const YW = 190, XP = 458, XM = 486, LC = [720, YW], LR = 36;         // filo in alto, poli della pila, lampadina
const XL = AX + EW + 6, XR = KX - EW - 6, LW = XR - XL, YI0 = 458, YI1 = 738;   // dove stanno gli ioni
// gli elettroni: dall'elettrodo + al polo + della pila; dal polo − all'elettrodo −
const SX = percorso([[AX, 700], [AX, YW], [XP - 8, YW]]), DX = percorso([[XM + 8, YW], [KX, YW], [KX, 700]]);
const RIGHE_I = 8, PER_RIGA = 3, N_ION = RIGHE_I * PER_RIGA;
// sparsi in modo uniforme (righe diverse, ascisse col rapporto aureo): ogni specie si sposta tutta insieme, quindi
// resta uniforme per sempre; compaiono in ordine sparso mentre il sale si scioglie
const fr = v => v - Math.floor(v);
const IONI = Array.from({ length: N_ION }, (_, j) => {
  const k = Math.floor(j / PER_RIGA), i = j % PER_RIGA, cl = k % 2;
  // una riga e una colonna a testa (colonne rimescolate), più un po' di disordine dentro la casella
  return { s: cl ? -1 : 1, x0: XL + LW * fr((i + .5 + .4 * (caso(k, i + 1) - .5)) / PER_RIGA + k * .29),
    y: 462 + 39 * k, ta: T_SALE + (T_SCIOLTO - T_SALE) * fr(k * .381966 + i * .618034 + .05) };
});
function posIone(io, t) {
  // tutti gli ioni di una specie hanno lo stesso spostamento (contato da T_SALE): così restano sparsi in modo
  // uniforme; uno ione compare (a io.ta) dove si troverebbe, e da lì va a velocità costante
  const d = (io.s > 0 ? VNA : -VCL) * Math.max(0, t - T_SALE);
  return [XL + mod(io.x0 - XL + d, LW), io.y];
}
// bollicine: nascono sulla faccia dell'elettrodo e salgono a velocità costante, finché passa corrente
const VB = 110, DT_B = .32;
function bollicine(ctx, t, xFaccia, verso, col, al, T_B0) {
  if (al <= 0 || t < T_B0) return;
  const vita = (EY1 - 10 - WTOP) / VB, n1 = Math.floor((t - T_B0) / DT_B), n0 = Math.max(0, Math.floor((t - T_B0 - vita) / DT_B));
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  for (let n = n0; n <= n1; n++) {
    const tb = T_B0 + n * DT_B, y = EY1 - 10 - VB * (t - tb);
    if (y < WTOP + 6 || y > EY1) continue;
    const r = 4 + 4 * caso(n, 4 + verso), x = xFaccia + verso * (r + 3 + 16 * caso(n, 3 + verso));
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

function sceneBecher(ctx, t) {
  const al = life(t, 7.8, 68.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const kd = P(t, 8.0, 9.4, E.lin), k = kSale(t);
  // l'acqua e il becher
  ctx.save(); ctx.globalAlpha *= P(t, 8.0, 8.6); ctx.fillStyle = css(C.x, .10); ctx.fillRect(BX0 + 3, WTOP, BX1 - BX0 - 6, BBOT - WTOP - 3); ctx.restore();
  linea(ctx, [[BX0, BTOP], [BX0, BBOT], [BX1, BBOT], [BX1, BTOP]], P(t, 8.0, 8.6), 5);
  // i fili, la pila, la lampadina
  linea(ctx, [[AX, EY0], [AX, YW], [XP, YW]], kd);
  linea(ctx, [[XM, YW], [KX, YW], [KX, EY0]], kd);
  const kp = P(t, 8.3, 8.8);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp; ctx.strokeStyle = css(C.ink); ctx.lineCap = 'round';
    ctx.fillStyle = C.paper; ctx.fillRect(XP - 4, YW - 34, XM - XP + 8, 68);
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(XP, YW - 32); ctx.lineTo(XP, YW + 32); ctx.stroke();
    ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(XM, YW - 16); ctx.lineTo(XM, YW + 16); ctx.stroke();
    ctx.restore();
    txt(ctx, 'pila', (XP + XM) / 2, YW - 62, { size: 30, color: C.dim, alpha: kp });
  }
  lampadina(ctx, LC, LR, k, P(t, 8.5, 9.0));
  // gli elettrodi
  const ke = P(t, 8.6, 9.2);
  for (const [x, s, c] of [[AX, '+', C.v], [KX, '−', C.x]]) {
    ctx.save(); ctx.globalAlpha *= ke; ctx.fillStyle = css(mix(C.paper, C.ink, .3)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(x - EW, EY0, 2 * EW, EY1 - EY0, 4); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, s, x + (s === '+' ? -42 : 42), EY0 + 4, { size: 48, weight: 600, color: c, alpha: ke });
  }
  // che acqua c'è
  txt(ctx, 'acqua distillata', 610, 392, { size: 30, color: C.dim, alpha: life(t, 13.1, 18.4, .4, .4) });
  txt(ctx, 'acqua salata', 610, 392, { size: 30, color: C.dim, alpha: life(t, 18.3, 27.4, .4, .4) });
  txt(ctx, 'pallini accelerati', 1085, 140, { size: 30, color: C.dim, align: 'right', alpha: life(t, 18.6, 68.9, .5, .5) });
  // le bollicine, da quando se ne parla
  for (const [xf, v, ta] of [[AX + EW, 1, 52.4], [KX - EW, -1, 58.1]]) bollicine(ctx, t, xf, v, C.g, P(t, ta, ta + .5), ta);
  drawRich(ctx, '{g:cloro}', AX + 26, 286, { size: 34, align: 'left', alpha: P(t, 52.8, 53.3) });
  drawRich(ctx, '{g:idrogeno}', KX - 26, 286, { size: 34, align: 'right', alpha: P(t, 58.5, 59.0) });
  // gli ioni: chi è sotto i riflettori, chi no
  const kAll = 1 - .7 * life(t, 27.6, 37.2, .4, .4);
  const kNa = kAll * (1 - .7 * life(t, 42.3, 46.9, .3, .3)), kCl = kAll * (1 - .7 * life(t, 37.2, 42.2, .3, .3));
  for (const io of IONI) {
    if (t < io.ta) continue;
    const p = posIone(io, t), bordo = clamp((p[0] - XL) / 36) * clamp((XR - p[0]) / 36);
    ione(ctx, p, io.s, P(t, io.ta, io.ta + .4) * bordo * (io.s > 0 ? kNa : kCl));
  }
  // gli elettroni nei fili e nel metallo degli elettrodi: strada proporzionale alla carica passata
  const ka = P(t, 9.4, 10.0), sE = VE * intSale(t);
  for (const pc of [SX, DX]) {
    const n = Math.floor(pc.L / 52), passo = pc.L / n;
    for (let i = 0; i < n; i++) {
      const u = mod(i * passo + sE, pc.L), p = puntoSu(pc, u), bordo = clamp(u / 16) * clamp((pc.L - u) / 16);
      const asciutto = clamp((EY1 - 30 - p[1]) / (EY1 - 30 - WTOP));   // 1 sopra l'acqua, 0 in fondo
      elettrone(ctx, p, ka * bordo * asciutto, 10);
    }
  }
  // l'ipotesi sbagliata: elettroni che attraversano il liquido
  const kh = life(t, 27.6, 33.4, .4, .5);
  if (kh > 0) {
    ctx.save(); ctx.globalAlpha *= kh; ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(XR - 10, 600); ctx.lineTo(XL + 30, 600); ctx.stroke(); ctx.restore();
    arrowHead(ctx, [XL + 22, 600], Math.PI, C.r, kh);
    for (let i = 0; i < 3; i++) elettrone(ctx, [XR - 30 - mod(150 * (t - 27.6) + i * 160, 440), 600], kh, 10, C.r);
    fondo(ctx, 610, 548, 300, 50, kh);
    drawRich(ctx, '{r:elettroni nel liquido?}', 610, 548, { size: 32, alpha: kh });
    crossMark(ctx, 610, 600, P(t, 31.7, 32.4), C.r, 1);
  }
  // la corrente nel liquido: dal + al −
  const kI = life(t, 47.0, 68.9, .4, .5);
  if (kI > 0) {
    freccia(ctx, [530, 390], [700, 390], C.v, kI, 7);
    drawRich(ctx, '{mv:I}', 740, 390, { size: 40, align: 'left', alpha: kI });
  }
  ctx.restore();
}

// ---------- il pannello a destra ----------
function scenePannello(ctx, t) {
  const cx = 1480;
  const blocco = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  blocco(7.9, 27.5, () => {
    conFont(TITOLI, () => drawRich(ctx, 'l’esperimento', cx, 170, { size: 40, weight: 600, local: t - 8.0 }));
    drawRich(ctx, '{dim:acqua distillata: lampadina spenta}', cx, 240, { size: 32, local: t - 13.1 });
    drawRich(ctx, '{dim:quasi nessuna carica libera}', cx, 290, { size: 30, local: t - 14.0 });
    separa(ctx, 336, P(t, 18.1, 18.5));
    drawRich(ctx, 'sale (NaCl) → {v:Na⁺} + {x:Cl⁻}', cx, 392, { size: 42, local: t - 18.3 });
    const ki = P(t, 19.4, 19.9);
    ione(ctx, [1290, 462], 1, ki); drawRich(ctx, '{dim:ione positivo}', 1320, 462, { size: 30, align: 'left', alpha: ki });
    ione(ctx, [1290, 516], -1, ki); drawRich(ctx, '{dim:ione negativo}', 1320, 516, { size: 30, align: 'left', alpha: ki });
    elettrone(ctx, [1290, 566], P(t, 20.4, 20.9), 10); drawRich(ctx, '{dim:elettrone (nei fili)}', 1320, 566, { size: 30, align: 'left', alpha: P(t, 20.4, 20.9) });
    separa(ctx, 612, P(t, 23.5, 23.9));
    drawRich(ctx, 'lampadina {g:accesa}:', cx, 664, { size: 36, local: t - 23.6 });
    drawRich(ctx, 'l’acqua salata {g:conduce}', cx, 720, { size: 36, local: t - 24.4 });
  });
  blocco(27.5, 52.4, () => {
    conFont(TITOLI, () => drawRich(ctx, 'chi porta la corrente', cx, 170, { size: 40, weight: 600, local: t - 27.6 }));
    drawRich(ctx, '{r:ipotesi: elettroni nel liquido}', cx - 30, 238, { size: 32, local: t - 27.7 });
    crossMark(ctx, 1745, 238, P(t, 31.7, 32.4), C.r, .5);
    drawRich(ctx, '{dim:si scambiano solo sugli elettrodi}', cx - 40, 290, { size: 30, local: t - 31.9 });
    separa(ctx, 336, P(t, 37.1, 37.5));
    ione(ctx, [1250, 390], 1, P(t, 37.2, 37.7));
    drawRich(ctx, '{v:Na⁺} {dim:verso l’elettrodo} {x:−}', 1282, 390, { size: 32, align: 'left', local: t - 37.3 });
    ione(ctx, [1250, 446], -1, P(t, 42.3, 42.8));
    drawRich(ctx, '{x:Cl⁻} {dim:verso l’elettrodo} {v:+}', 1282, 446, { size: 32, align: 'left', local: t - 42.4 });
    drawRich(ctx, '{dim:(i Cl⁻ circa 1,5 volte più svelti)}', cx, 500, { size: 30, local: t - 43.6 });
    separa(ctx, 546, P(t, 46.9, 47.3));
    drawRich(ctx, '{v:+} {dim:verso destra e} {x:−} {dim:verso sinistra:}', cx, 598, { size: 32, local: t - 47.0 });
    drawRich(ctx, 'una sola corrente {mv:I}', cx, 652, { size: 38, local: t - 48.0 });
    freccia(ctx, [1400, 712], [1560, 712], C.v, P(t, 48.4, 48.9), 7);
  });
  blocco(52.4, 68.9, () => {
    conFont(TITOLI, () => drawRich(ctx, 'agli elettrodi', cx, 170, { size: 40, weight: 600, local: t - 52.5 }));
    drawRich(ctx, 'elettrodo {v:+}', cx, 232, { size: 34, local: t - 52.6 });
    drawRich(ctx, '2 {x:Cl⁻} → Cl₂ + 2 elettroni', cx, 284, { size: 36, local: t - 53.0 });
    drawRich(ctx, '{dim:cloro gassoso; gli elettroni al filo}', cx, 332, { size: 30, local: t - 54.2 });
    separa(ctx, 374, P(t, 58.1, 58.5));
    drawRich(ctx, 'elettrodo {x:−}', cx, 420, { size: 34, local: t - 58.2 });
    drawRich(ctx, '2 H₂O + 2 elettroni →', cx, 472, { size: 36, local: t - 58.6 });
    drawRich(ctx, '→ H₂ + 2 OH⁻', cx, 522, { size: 36, local: t - 59.6 });
    drawRich(ctx, '{dim:idrogeno gassoso, che viene dall’acqua}', cx, 570, { size: 30, local: t - 60.4 });
    separa(ctx, 614, P(t, 63.5, 63.9));
    conFont(TITOLI, () => drawRich(ctx, '{g:elettrolisi}', cx, 666, { size: 44, weight: 600, local: t - 63.6 }));
    drawRich(ctx, '{dim:reazioni chimiche agli elettrodi}', cx, 724, { size: 30, local: t - 64.4 });
  });
}

// ---------- tre cenni: gas, semiconduttori, superconduttori ----------
function sceneAltrove(ctx, t) {
  if (t < 68.5 || t > T_FINE + .3) return;
  const kg = life(t, 68.9, T_FINE + .1, .5, .5), ks = life(t, 73.6, T_FINE + .1, .5, .5), kz = life(t, 78.4, T_FINE + .1, .5, .5);
  // nei gas: un tubo con gli ioni + che vanno verso il − e gli elettroni, molto più svelti, verso il +
  if (kg > 0) {
    card(ctx, 110, 130, 540, 640, kg);
    ctx.save(); ctx.globalAlpha *= kg;
    conFont(TITOLI, () => drawRich(ctx, 'nei gas', 380, 195, { size: 40, weight: 600 }));
    ctx.fillStyle = css(C.v, .06); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(160, 290, 440, 150, 75); ctx.fill(); ctx.stroke();
    linea(ctx, [[195, 320], [195, 410]], 1, 8); linea(ctx, [[565, 320], [565, 410]], 1, 8);
    txt(ctx, '+', 200, 268, { size: 44, weight: 600, color: C.v }); txt(ctx, '−', 560, 268, { size: 44, weight: 600, color: C.x });
    const a = 216, b = 544;
    for (let i = 0; i < 4; i++) {   // ioni + su due righe, lenti, verso il −
      const x = a + mod((i + .3) * (b - a) / 4 + 30 * (t - 68.9), b - a), f = clamp((x - a) / 24) * clamp((b - x) / 24);
      ione(ctx, [x, i % 2 ? 330 : 400], 1, f, 16);
    }
    for (let i = 0; i < 5; i++) {   // elettroni sulla riga di mezzo, svelti, verso il +
      const x = a + mod((i + .5) * (b - a) / 5 - 130 * (t - 68.9), b - a), f = clamp((x - a) / 24) * clamp((b - x) / 24);
      elettrone(ctx, [x, 365], f, 11);
    }
    drawRich(ctx, '{dim:ioni positivi ed elettroni}', 380, 480, { size: 30 });
    drawRich(ctx, '{dim:in versi opposti}', 380, 525, { size: 30 });
    drawRich(ctx, 'il fulmine, i tubi al neon', 380, 610, { size: 32 });
    ctx.restore();
  }
  // semiconduttori e superconduttori: una riga ciascuno, in una scheda a destra (§3)
  card(ctx, 690, 250, 1120, 330, ks);
  drawRich(ctx, '{g:semiconduttori} {dim:(il silicio):} fra conduttori e isolanti', 720, 330, { size: 36, align: 'left', alpha: ks });
  drawRich(ctx, '{g:superconduttori} {dim:(molto freddi):} resistenza zero', 720, 480, { size: 36, align: 'left', alpha: kz });
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La corrente nell’acqua salata', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > 69.2) return;
  card(ctx, ...CARTA, life(t, 7.6, 68.9, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, 68.9, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 92.8, 93.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Nell’acqua salata la corrente la portano gli ioni,\nin versi opposti; gli elettroni restano nei fili.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'ioni {v:+} e {x:−}\nin {g:versi opposti}'], [960, 'gli elettroni\n{dim:non attraversano il liquido}'], [1470, 'agli elettrodi\n{g:gas} {dim:(elettrolisi)}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la luce della lampadina mentre il sale si scioglie;
  // le bollicine salgono per sempre: un tono breve all'inizio
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['traccia', 8.0, 9.4], ['pop', 8.5, .6], ['pop', 8.6, .4],       // becher, fili, lampadina, elettrodi
    ['pop', 13.1, .3],                                                                // acqua distillata: spenta
    ['pop', 18.3, .6], ['tono', 18.4, 22.4, [.2, .8]],                                // il sale si scioglie, la luce cresce
    ['pop', 19.4, .5], ['pop', 20.4, .4],                                             // ioni ed elettrone
    ['ding', 23.6],                                                                   // l'acqua salata conduce
    ['soffio', 27.5], ['pop', 27.7, .3], ['traccia', 31.7, 32.4],                     // l'ipotesi, barrata
    ['pop', 37.2, .6], ['pop', 42.3, .4], ['pop', 43.6, .5],                          // Na⁺ verso il −, Cl⁻ verso il +
    ['traccia', 47.0, 47.4], ['pop', 48.0, .6], ['ding', 48.9],                       // una sola corrente I
    ['soffio', 52.4], ['tono', 52.4, 53.0, [.4, .7]], ['pop', 52.8, .6], ['pop', 53.0, .5],   // bollicine di cloro
    ['tono', 58.1, 58.7, [.4, .7]], ['pop', 58.5, .6], ['pop', 59.6, .5],             // bollicine di idrogeno
    ['ding', 63.6],                                                                   // l'elettrolisi
    ['soffio', 68.9], ['soffio', 73.6], ['pop', 78.4, .7],                            // gas, semiconduttori, superconduttori
    ['soffio', 83.8], ['pop', 84.2, .6], ['pop', 85.8, .5], ['pop', 86.3, .6], ['pop', 86.8, .7],   // in una frase
  ];
  return {
    titolo: 'La corrente nell’acqua salata', durata: 95, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.4, 'acqua e sale'], [27.4, 52.3, 'chi porta la corrente'], [52.3, 68.6, 'agli elettrodi'], [68.6, T_FINE, 'e altrove?']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneBecher(ctx, t); scenePannello(ctx, t); sceneAltrove(ctx, t); sceneFine(ctx, t); },
  };
});
