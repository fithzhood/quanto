'use strict';
/* Dalla radio ai raggi gamma — lo spettro elettromagnetico: la stessa onda (campo E in verticale, campo B in fase verso
   chi guarda, disegnato in diagonale come in maxwell/onde-em), nel vuoto sempre a c = 3·10⁸ m/s, con λ·f = c.
   Il righello delle lunghezze d'onda è in SCALA LOGARITMICA (dichiarata): da 10³ m a 10⁻¹³ m, 92,5 px per ogni fattore
   10; sotto, alla stessa ascissa, la frequenza f = c/λ (da 3·10⁵ Hz a 3·10²¹ Hz). Confini delle bande (indicativi):
   radio λ > 1 m, microonde 1 mm–1 m, infrarosso 700 nm–1 mm, visibile 400–700 nm, ultravioletto 10–400 nm,
   raggi X 10⁻¹¹–10⁻⁸ m, gamma < 10⁻¹¹ m (X e gamma in realtà si sovrappongono: si distinguono per l'origine).
   Un esempio vero per banda, con λ·f = c controllato: radio FM 10⁸ Hz → 3 m; forno a microonde 2,45·10⁹ Hz → 0,122 m;
   infrarosso del corpo umano (picco di Wien a 310 K ≈ 9,3 μm) ≈ 10⁻⁵ m → 3·10¹³ Hz; visibile 700 nm → 4,3·10¹⁴ Hz,
   400 nm → 7,5·10¹⁴ Hz; ultravioletto che abbronza (UV-B) 300 nm → 10¹⁵ Hz; raggi X delle radiografie (≈ 40 keV)
   3·10⁻¹¹ m → 10¹⁹ Hz; gamma dei nuclei (≈ 1,2 MeV) 10⁻¹² m → 3·10²⁰ Hz. L'onda in alto è al rallentatore nel primo
   capitolo (λ = 300 px, v = 200 px/s), poi ferma, in una scala diversa per ogni banda (lo dice la scritta).
   I colori della luce visibile sono quelli veri (approssimazione di Bruton), non i colori del tema.
   Colori: E C.ink, B C.g (come in maxwell/onde-em), cursore e cose nuove C.v. Argomento: maxwell. */
CVIDEO.registra('maxwell/spettro', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 87.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.0, 'felice'], [17.8, 'neutro'],
  [27.3, 'felice'], [32.7, 'neutro'], [36.5, 'pensa'], [42.0, 'neutro'], [46.8, 'felice'], [51.5, 'neutro'],
  [56.8, 'sorpreso'], [61.7, 'felice'], [66.4, 'neutro'], [71.1, 'pensa'], [76.5, 'sorpreso'], [81.5, 'festa'],
  [89.6, 'felice'], [93.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Radio, microonde, luce, raggi X:\nche cosa hanno in comune?'],
  [7.9, 12.9, 'Sono tutte onde {g:elettromagnetiche}:\ncampo {mink:E} e campo {mg:B} che oscillano.'],
  [13.0, 17.7, 'Nel vuoto vanno tutte a\n{mink:c} ≈ {mink:3·10⁸} m/s.'],
  [17.8, 22.4, 'La lunghezza d’onda {mink:λ} va da una\ncresta alla successiva.'],
  [22.5, 27.2, 'La frequenza {mink:f} conta le oscillazioni\nin un secondo, in hertz.'],
  [27.3, 32.5, 'Per tutte vale {mink:λ}·{mink:f} = {mink:c}:\npiù {mink:λ} è corta, più {mink:f} è alta.'],
  [32.7, 36.4, 'Le metto in fila secondo\nla lunghezza d’onda.'],
  [36.5, 41.9, 'Da una tacca alla successiva, {mink:λ} è\ndieci volte più corta: scala {v:logaritmica}.'],
  [42.0, 46.7, 'Le onde della {g:radio} FM\nhanno {mink:λ} = 3 m.'],
  [46.8, 51.4, 'Le {g:microonde} del forno\nhanno {mink:λ} ≈ 12 cm.'],
  [51.5, 56.7, 'L’{g:infrarosso} lo emette il nostro\ncorpo: {mink:λ} ≈ {mink:10⁻⁵} m.'],
  [56.8, 61.6, 'Il {g:visibile} è una fettina:\nda 700 a 400 nanometri.'],
  [61.7, 66.3, 'Il rosso ha l’onda più lunga,\nil violetto la più corta.'],
  [66.4, 71.0, 'L’{g:ultravioletto} abbronza e scotta:\n{mink:λ} ≈ 300 nm.'],
  [71.1, 76.4, 'I {g:raggi X} delle radiografie:\n{mink:λ} ≈ {mink:3·10⁻¹¹} m.'],
  [76.5, 81.4, 'I {g:raggi gamma} vengono dai nuclei:\n{mink:λ} ≈ {mink:10⁻¹²} m.'],
  [81.5, 86.8, 'Da onde lunghe chilometri a onde\npiù corte di un atomo: è la stessa onda.'],
  [89.6, 95.6, 'Sono tutte onde elettromagnetiche:\ncambia solo la lunghezza d’onda.'],
];

// ---------- aiutanti ----------
const COL_B = () => mix(C.g, C.paper, .12);
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 8); ctx.fill(); ctx.restore(); }
function linea(ctx, a, b, col, w, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
// il colore vero della luce di lunghezza d'onda nm (approssimazione di Bruton, con l'attenuazione ai bordi)
function colLuce(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
  const q = v => 255 * Math.pow(clamp(v * k), .8);
  return [q(r), q(g), q(b)];
}

// ---------- le bande: un esempio vero per ciascuna (λ·f = c, vedi in testa) ----------
const lg = Math.log10;
const BANDE = [
  { t: 42.0, nome: 'onde radio', uso: '{dim:la radio FM}', lam: '{mink:λ} = 3 m', f: '{mink:f} = {mink:10⁸} Hz', L: lg(3) },
  { t: 46.8, nome: 'microonde', uso: '{dim:il forno a microonde}', lam: '{mink:λ} ≈ 0,12 m = 12 cm', f: '{mink:f} = {mink:2,45·10⁹} Hz', L: lg(3e8 / 2.45e9) },
  { t: 51.5, nome: 'infrarosso', uso: '{dim:lo emette il corpo umano}', lam: '{mink:λ} ≈ {mink:10⁻⁵} m', f: '{mink:f} ≈ {mink:3·10¹³} Hz', L: -5 },
  { t: 56.8, nome: 'visibile', uso: '{dim:la luce che vediamo (1 nm =} {mink:10⁻⁹} {dim:m)}', lam: '{mink:λ}: da 700 a 400 nm', f: '{mink:f}: da {mink:4,3·10¹⁴} a {mink:7,5·10¹⁴} Hz', L: lg(550e-9) },
  { t: 66.4, nome: 'ultravioletto', uso: '{dim:abbronza e scotta}', lam: '{mink:λ} ≈ 300 nm', f: '{mink:f} ≈ {mink:10¹⁵} Hz', L: lg(3e-7) },
  { t: 71.1, nome: 'raggi X', uso: '{dim:le radiografie}', lam: '{mink:λ} ≈ {mink:3·10⁻¹¹} m', f: '{mink:f} ≈ {mink:10¹⁹} Hz', L: lg(3e-11) },
  { t: 76.5, nome: 'raggi gamma', uso: '{dim:dai nuclei degli atomi}', lam: '{mink:λ} ≈ {mink:10⁻¹²} m', f: '{mink:f} ≈ {mink:3·10²⁰} Hz', L: -12 },
];
const T_TUTTO = 81.5;                              // da qui: tutto lo spettro insieme
const iBanda = t => { let k = -1; BANDE.forEach((b, i) => { if (t >= b.t) k = i; }); return t >= T_TUTTO ? -1 : k; };

// ---------- in alto: l'onda (sinistra) e la scheda della banda (destra) ----------
const ZOOM = [110, 110, 1700, 320];
const WX0 = 170, WX1 = 1110, YW = 285, AE = 80, AB = 110, LAM = 300, V = 200, K = TAU / LAM;   // T = 1,5 s
const BX = -.37, BY = .3;                          // B verso chi guarda: in diagonale, in basso a sinistra
const MOTO = [[7.5, 17.8], [22.5, 32.7]];          // l'onda corre solo qui; fuori è un fermo immagine
const tw = t => MOTO.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0);
const campo = (x, t) => Math.sin(K * (x - WX0 - V * tw(t)));
const muove = t => MOTO.some(([a, b]) => t > a && t < b);
// le creste (fase π/2) all'istante t, da sinistra
const creste = t => { const x0 = WX0 + ((V * tw(t) + LAM / 4) % LAM); const r = []; for (let x = x0; x <= WX1; x += LAM) r.push(x); return r; };
function curva(ctx, pts, col, w, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function onda(ctx, t, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(ZOOM[0] + 4, ZOOM[1] + 4, 1006, ZOOM[3] - 8); ctx.clip();
  ctx.save(); ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(WX0, YW); ctx.lineTo(WX1, YW); ctx.stroke(); ctx.restore();
  const cE = [], cB = [];
  for (let x = WX0; x <= WX1; x += 4) { const e = campo(x, t); cE.push([x, YW - AE * e]); cB.push([x + BX * AB * e, YW + BY * AB * e]); }
  ctx.lineWidth = 2.5;
  for (let x = WX0 + 10; x <= WX1; x += 20) {
    const e = campo(x, t);
    ctx.strokeStyle = css(COL_B(), .4); ctx.beginPath(); ctx.moveTo(x, YW); ctx.lineTo(x + BX * AB * e, YW + BY * AB * e); ctx.stroke();
    ctx.strokeStyle = css(C.ink, .4); ctx.beginPath(); ctx.moveTo(x, YW); ctx.lineTo(x, YW - AE * e); ctx.stroke();
  }
  curva(ctx, cB, COL_B(), 4.5, 1);
  curva(ctx, cE, C.ink, 4.5, 1);
  ctx.restore();
}
// la lunghezza d'onda fra due creste vicine, con la doppia freccia sopra
function misuraLam(ctx, t, al) {
  if (al <= 0) return;
  const cr = creste(t).filter(x => x > 260); if (cr.length < 2) return;
  const a = cr[0], b = cr[1], y = 160;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.v, .75); ctx.lineWidth = 2.5; ctx.setLineDash([6, 6]);
  for (const x of [a, b]) { ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, YW - AE - 10); ctx.stroke(); }
  ctx.setLineDash([]); ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(a + 10, y); ctx.lineTo(b - 10, y); ctx.stroke();
  arrowHead(ctx, [b - 2, y], 0, C.v, .8); arrowHead(ctx, [a + 2, y], Math.PI, C.v, .8);
  ctx.restore();
  fondo(ctx, (a + b) / 2, y, 50, 40, al);
  drawRich(ctx, '{mink:λ}', (a + b) / 2, y, { size: 38, alpha: al });
}
// la striscia dei colori visibili, da 700 nm (sinistra) a 400 nm (destra), come sul righello
const SX0 = 220, SX1 = 1060, SY = 230, SH = 90;
const sxNm = nm => lerp(SX0, SX1, (700 - nm) / 300);
function striscia(ctx, t, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  for (let x = SX0; x < SX1; x += 2) { const nm = 700 - 300 * (x - SX0) / (SX1 - SX0); ctx.fillStyle = css(colLuce(nm)); ctx.fillRect(x, SY, 2.6, SH); }
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.strokeRect(SX0, SY, SX1 - SX0, SH);
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2;
  for (const nm of [700, 600, 500, 400]) {
    const x = sxNm(nm); ctx.beginPath(); ctx.moveTo(x, SY + SH); ctx.lineTo(x, SY + SH + 12); ctx.stroke();
    txt(ctx, nm + ' nm', x, SY + SH + 36, { size: 30, color: C.dim });
  }
  ctx.restore();
  const kc = life(t, 61.8, 66.3, .4, .4) * al;
  txt(ctx, 'rosso: onda più lunga', SX0, SY - 34, { size: 30, align: 'left', alpha: kc });
  txt(ctx, 'violetto: più corta', SX1, SY - 34, { size: 30, align: 'right', alpha: kc });
}
function scenaZoom(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = P(t, 7.5, 8.1) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...ZOOM);
  linea(ctx, [1140, 130], [1140, 410], C.panelEdge, 2, 1);
  // a sinistra: l'onda, o (nel visibile) i colori
  const kS = life(t, 56.9, 66.4, .4, .4);
  onda(ctx, t, 1 - kS);
  striscia(ctx, t, kS);
  misuraLam(ctx, t, life(t, 18.0, 22.4, .4, .3) + life(t, 42.1, 56.9, .4, .3) + life(t, 66.5, T_FINE, .3, .4));
  if (t > 22.5 && t < 27.3) {                      // un punto del campo che va su e giù
    const x = 950, k = life(t, 22.6, 27.2, .3, .3);
    ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(x, YW - AE * campo(x, t), 11, 0, TAU); ctx.fill(); ctx.restore();
  }
  const scritta = t < 32.7 ? (muove(t) ? 'al rallentatore' : 'fermo immagine') : 'fermo immagine, in una scala diversa per ogni banda';
  if (kS < 1) txt(ctx, scritta, 140, 405, { size: 28, color: C.dim, align: 'left', alpha: 1 - kS });
  // a destra: che onda è
  const cx = 1465, kI = 1 - P(t, 32.7, 33.1);
  if (kI > 0) {
    ctx.save(); ctx.globalAlpha *= kI;
    conFont(TITOLI, () => drawRich(ctx, 'onda elettromagnetica', cx, 165, { size: 38, weight: 600 }));
    drawRich(ctx, '{mink:E}  {dim:campo elettrico}', 1200, 240, { size: 32, align: 'left' });
    drawRich(ctx, '{mg:B}  {dim:campo magnetico}', 1200, 290, { size: 32, align: 'left' });
    drawRich(ctx, '{mink:λ}  {dim:lunghezza d’onda}', 1200, 340, { size: 32, align: 'left', alpha: P(t, 18.0, 18.5) });
    drawRich(ctx, '{mink:f}  {dim:frequenza, in Hz}', 1200, 390, { size: 32, align: 'left', alpha: P(t, 22.7, 23.2) });
    ctx.restore();
  }
  BANDE.forEach((b, i) => {
    const fine = i < BANDE.length - 1 ? BANDE[i + 1].t : T_TUTTO;
    const k = life(t, b.t + .1, fine + .1, .4, .3);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    conFont(TITOLI, () => drawRich(ctx, b.nome, cx, 165, { size: 44, weight: 600 }));
    drawRich(ctx, b.uso, cx, 220, { size: 30 });
    drawRich(ctx, b.lam, cx, 290, { size: 38 });
    drawRich(ctx, b.f, cx, 355, { size: 38 });
    ctx.restore();
  });
  const kR = life(t, 33.0, BANDE[0].t + .1, .4, .3);   // mentre compare il righello
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR;
    conFont(TITOLI, () => drawRich(ctx, 'lo spettro', cx, 165, { size: 44, weight: 600 }));
    txt(ctx, 'le onde in fila per lunghezza d’onda:', cx, 240, { size: 30, color: C.dim });
    txt(ctx, 'a sinistra le più lunghe,', cx, 295, { size: 30, color: C.dim });
    txt(ctx, 'a destra le più corte', cx, 345, { size: 30, color: C.dim });
    ctx.restore();
  }
  const kT = P(t, T_TUTTO + .1, T_TUTTO + .5);
  if (kT > 0) {
    ctx.save(); ctx.globalAlpha *= kT;
    conFont(TITOLI, () => drawRich(ctx, 'tutto lo spettro', cx, 165, { size: 44, weight: 600 }));
    txt(ctx, 'la stessa onda', cx, 220, { size: 30, color: C.dim });
    drawRich(ctx, '{mink:λ}{dim::} da chilometri a {mink:10⁻¹²} m', cx, 290, { size: 36 });
    drawRich(ctx, '{mink:λ}·{mink:f} = {mink:c} {dim:per tutte}', cx, 355, { size: 38 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- in basso, primo capitolo: c, f e λ·f = c ----------
function scenaFormule(ctx, t) {
  if (t < 12.6 || t > 33.0) return;
  const al = P(t, 12.8, 13.3) * (1 - P(t, 32.4, 32.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 460, 470, 1000, 300);
  drawRich(ctx, '{dim:nel vuoto, per tutte:} {mink:c} ≈ {mink:3·10⁸} m/s', 960, 535, { size: 42, local: t - 13.0 });
  drawRich(ctx, '{mink:f}{dim:: oscillazioni in un secondo, in hertz (Hz)}', 960, 615, { size: 34, local: t - 22.8 });
  drawRich(ctx, '{mink:λ}·{mink:f} = {mink:c}', 960, 700, { size: 60, local: t - 27.5 });
  ctx.restore();
}

// ---------- in basso, dal secondo capitolo: il righello in scala logaritmica ----------
const RIG = [110, 460, 1700, 330];
const XL = 260, PXD = 92.5, L0 = 3, L1 = -13;      // da 10³ m (sinistra) a 10⁻¹³ m (destra): 92,5 px ogni fattore 10
const lx = L => XL + (L0 - L) * PXD;
const YL = 528, YB0 = 584, YB1 = 616, YF = 672;
const CONFINI = [L0, 0, -3, lg(7e-7), lg(4e-7), -8, -11, L1];    // radio | microonde | infrarosso | visibile | UV | X | gamma
const NOMI = ['radio', 'microonde', 'infrarosso', 'visibile', 'ultravioletto', 'raggi X', 'gamma'];
const ESP = { '3': '³', '0': '', '-3': '⁻³', '-6': '⁻⁶', '-9': '⁻⁹', '-12': '⁻¹²' };
const ESPF = { '3': '⁵', '0': '⁸', '-3': '¹¹', '-6': '¹⁴', '-9': '¹⁷', '-12': '²⁰' };   // f = c/λ = 3·10⁸/10^L
function scenaRighello(ctx, t) {
  if (t < 32.5 || t > T_FINE + .3) return;
  const al = P(t, 32.7, 33.2) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...RIG);
  const kA = P(t, 32.9, 33.9), kN = P(t, 33.5, 34.1), kF = P(t, 35.5, 36.1);
  const kD = life(t, 36.6, 41.9, .3, .4);          // le tacche, mentre si dice della scala logaritmica
  // asse delle lunghezze d'onda
  linea(ctx, [XL, YL], [lerp(XL, lx(L1), kA), YL], C.ink, 3, .8);
  drawRich(ctx, '{mink:λ}', 180, YL, { size: 40, alpha: kA });
  for (let L = L0; L >= L1; L--) {
    const x = lx(L), lungo = L % 3 === 0;
    if (x > lerp(XL, lx(L1), kA) + 1) break;
    const h = (lungo ? 12 : 7) + 5 * kD;
    linea(ctx, [x, YL - h], [x, YL + h], kD > 0 ? mix(C.ink, C.v, kD) : C.ink, lungo ? 3 : 2, .8);
    if (lungo && L >= -12) drawRich(ctx, L === 0 ? '1 m' : '{mink:10' + ESP[String(L)] + '} m', x, YL - 32, { size: 30, alpha: kN });
  }
  // le bande, da sinistra a destra
  const ib = iBanda(t), tutto = t >= T_TUTTO;
  for (let i = 0; i < 7; i++) {
    const k = P(t, 33.9 + .22 * i, 34.3 + .22 * i);
    if (k <= 0) continue;
    const xa = lx(CONFINI[i]), xb = lx(CONFINI[i + 1]), att = i === ib || tutto;
    ctx.save(); ctx.globalAlpha *= k;
    if (i === 3) {                                  // il visibile: i colori veri, da 700 a 400 nm
      for (let x = xa; x < xb; x += 1) { const nm = 1e9 * Math.pow(10, L0 - (x - XL) / PXD); ctx.fillStyle = css(colLuce(nm)); ctx.fillRect(x, YB0, 1.6, YB1 - YB0); }
    } else {
      ctx.fillStyle = css(att ? mix(C.v, C.paper, .62) : mix(C.dim, C.paper, i % 2 ? .62 : .74));
      ctx.fillRect(xa, YB0, xb - xa, YB1 - YB0);
    }
    if (att && !tutto) { ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.strokeRect(xa - 1.5, YB0 - 1.5, xb - xa + 3, YB1 - YB0 + 3); }
    ctx.restore();
    const colN = att ? C.v : C.ink;
    if (i === 3) {
      linea(ctx, [(xa + xb) / 2, YB1 + 4], [(xa + xb) / 2, YB1 + 14], C.ink, 2, k * .7);
      txt(ctx, NOMI[i], (xa + xb) / 2, YB1 + 30, { size: 28, color: colN, weight: att ? 600 : 500, alpha: k });
    } else txt(ctx, NOMI[i], (xa + xb) / 2 + (i === 0 ? -20 : 0), YB0 - 22, { size: 28, color: colN, weight: att ? 600 : 500, alpha: k });
  }
  // asse delle frequenze, alla stessa ascissa: f = c/λ
  linea(ctx, [XL, YF], [lerp(XL, lx(L1), kF), YF], C.ink, 3, .8);
  if (kF > 0) arrowHead(ctx, [lx(L1) + 10, YF], 0, C.ink, .8 * kF);
  drawRich(ctx, '{mink:f}', 180, YF, { size: 40, alpha: kF });
  for (let L = L0; L >= -12; L -= 3) {
    linea(ctx, [lx(L), YF - 9], [lx(L), YF + 9], C.ink, 2, .8 * kF);
    drawRich(ctx, '{mink:3·10' + ESPF[String(L)] + '} Hz', lx(L), YF + 32, { size: 28, alpha: kF });
  }
  drawRich(ctx, '{v:scala logaritmica}{dim:: da una tacca alla successiva,} {mink:λ} {dim:diventa dieci volte più corta}', 960, 756, { size: 28, local: t - 36.7 });
  // il cursore sull'esempio della banda
  if (ib >= 0) {
    const b = BANDE[ib], prima = ib ? BANDE[ib - 1].L : b.L;
    const x = lx(lerp(prima, b.L, P(t, b.t, b.t + .7, E.io)));
    ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 2.5; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(x, YL); ctx.lineTo(x, YL + 14); ctx.moveTo(x, YB0);
    if (ib === 3) { ctx.lineTo(x, YB1); ctx.moveTo(x, YB1 + 48); }   // non attraversa la scritta «visibile»
    ctx.lineTo(x, YF); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.fillStyle = css(C.v);
    for (const y of [YL, YF]) { ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Dalla radio ai raggi gamma', W / 2, 180, { size: 115, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 96.2, 97.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Radio, luce, raggi X e gamma:\nla stessa onda, con {mink:λ} diverse.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:λ}·{mink:f} = {mink:c}\n{dim:per tutte le bande}'], [960, 'visibile:\n{dim:da 700 a 400 nm}'], [1470, '{mink:λ} più corta,\n{mink:f} più alta']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): l'onda ha un tono breve; il punto viola segue il campo per un periodo;
  // quando il cursore passa da una banda all'altra il tono segue la sua posizione sul righello, da 10³ m (0) a 10⁻¹³ m (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 7.5, 8.7, [.1, .25, .63, .89, .79, .42]],               // l'onda elettromagnetica
    ['pop', 13.1, .55],                                                               // c ≈ 3·10⁸ m/s
    ['traccia', 18.0, 18.4], ['pop', 18.2, .5],                                       // la lunghezza d'onda
    ['pop', 22.8, .45], ['tono', 22.6, 24.1, [.15, .5, .85, .85, .5, .15, .15]],      // la frequenza: il punto su e giù
    ['pop', 27.6, .6], ['ding', 27.9],                                                // λ·f = c
    ['soffio', 32.7], ['traccia', 32.9, 33.9], ['pop', 33.6, .4],                     // il righello delle λ
    ['tono', 33.9, 35.6, [.2, .3, .4, .5, .6, .7, .8]], ['traccia', 35.5, 36.1],      // le bande una dopo l'altra; le f
    ['pop', 36.7, .45],                                                               // scala logaritmica
    ['pop', 42.1, .45],                                                               // la radio FM
    ['tono', 46.8, 47.5, [.16, .16, .18, .22, .24, .25]], ['pop', 46.9, .45],         // le microonde
    ['tono', 51.5, 52.2, [.25, .25, .31, .44, .49, .5]], ['pop', 51.6, .45],          // l'infrarosso
    ['tono', 56.8, 57.5, [.5, .5, .52, .56, .58, .58]], ['pop', 57.0, .5],            // il visibile: i colori
    ['pop', 61.9, .4],                                                                // rosso lungo, violetto corto
    ['tono', 66.4, 67.1, [.58, .58, .58, .59, .6, .6]], ['pop', 66.5, .45],           // l'ultravioletto
    ['tono', 71.1, 71.8, [.6, .6, .66, .78, .84, .85]], ['pop', 71.2, .45],           // i raggi X
    ['tono', 76.5, 77.2, [.85, .85, .87, .91, .94, .94]], ['pop', 76.6, .45],         // i raggi gamma
    ['pop', 81.7, .55],                                                               // tutto lo spettro
    ['soffio', 87.2], ['pop', 89.4, .5], ['pop', 89.9, .6], ['pop', 90.4, .7],        // in una frase
  ];
  return {
    titolo: 'Dalla radio ai raggi gamma', durata: 98.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 32.5, 'la stessa onda'], [32.5, 56.7, 'il righello delle onde'], [56.7, T_FINE, 'dalla luce ai gamma']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaZoom(ctx, t); scenaFormule(ctx, t); scenaRighello(ctx, t); scenaFine(ctx, t); },
  };
});
