'use strict';
/* L'onda che si regge da sola — un campo magnetico B che cambia crea un campo elettrico E che gli gira attorno
   (Faraday-Neumann), e un campo E che cambia crea un B attorno a sé (Maxwell): i due campi si tengono in vita a vicenda.
   Nel primo capitolo i campi crescono a velocità costante (partenza e arrivo dolci) e l'anello indotto ha un'intensità
   proporzionale alla rapidità con cui cambiano: quando il campo smette di cambiare l'anello sparisce. Versi veri:
   B in su che cresce → E in senso orario visto dall'alto (Lenz), E in su che cresce → B antiorario visto dall'alto.
   Poi l'onda di un'antenna, al rallentatore: E(x, t) = sin(ω·(t − x/v)) in verticale, B in fase lungo la direzione
   verso chi guarda (disegnata in diagonale, verso il basso a sinistra), così che E, B e la direzione dell'onda siano
   una terna destra (il prodotto vettoriale di E per B ha il verso dell'onda). Sullo schermo λ = 400 px, v = 180 px/s (T ≈ 2,2 s); un fermo immagine. L'antenna si
   spegne a un istante in cui il campo è zero, e il treno d'onde prosegue da solo. Infine c = 1/√(μ₀·ε₀) ≈ 3·10⁸ m/s
   (μ₀ = 4π·10⁻⁷ T·m/A, ε₀ ≈ 8,85·10⁻¹² C²/(N·m²) → 2,9986·10⁸) ed E = c·B: con E = 300 N/C, B = 10⁻⁶ T.
   Colori: E come in elettrostatica/campo (C.ink), B come in magnetismo e induzione (C.g), cariche positive C.v,
   direzione dell'onda (velocità) C.x. Argomento: maxwell. */
CVIDEO.registra('maxwell/onde-em', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, drawSeq, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.4, 'sorpreso'], [21.25, 'neutro'],
  [27.4, 'felice'], [31.6, 'neutro'], [36.3, 'felice'], [41.1, 'neutro'], [46.0, 'felice'], [51.0, 'neutro'],
  [55.4, 'pensa'], [59.9, 'sorpreso'], [65.4, 'neutro'], [76.7, 'festa'], [81.7, 'felice'], [85.5, 'neutro'],
  [96.4, 'felice'], [100.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come fa la luce del Sole\na viaggiare nel vuoto?'],
  [7.9, 12.6, 'Un campo magnetico {mg:B} che cambia\ncrea un campo elettrico {mink:E}…'],
  [12.7, 17.3, '…che gli gira attorno: è la legge\ndi {g:Faraday-Neumann}.'],
  [17.4, 21.15, 'Quando {mg:B} smette di cambiare,\nil campo {mink:E} sparisce.'],
  [21.25, 27.3, 'Maxwell scoprì anche il viceversa:\nun {mink:E} che cambia crea {mg:B} attorno a sé.'],
  [27.4, 31.4, 'Così i due campi possono\ncrearsi {g:a vicenda}.'],
  [31.6, 36.2, 'Le cariche di un’antenna vanno\nsu e giù: il campo {mink:E} cambia…'],
  [36.3, 41.0, '…e crea {mg:B}, che crea di nuovo {mink:E}:\ncosì l’onda parte.'],
  [41.1, 45.8, 'Il campo {mink:E} va su e giù, {mg:B}\ndi traverso: sono {g:perpendicolari}.'],
  [46.0, 50.8, 'Fermo l’immagine: sono {g:in fase},\nal massimo e a zero insieme.'],
  [51.0, 55.3, 'L’onda corre perpendicolare\na tutti e due: è {g:trasversale}.'],
  [55.4, 59.8, 'Ora spengo l’antenna:\nle cariche si fermano…'],
  [59.9, 64.6, '…ma l’onda va avanti {g:da sola},\nsenza un mezzo: nel vuoto.'],
  [65.4, 71.0, 'Maxwell ne calcolò la velocità:\n{mink:c} = 1/√({mink:μ₀}·{mink:ε₀}).'],
  [71.1, 76.6, '{mink:μ₀}: permeabilità magnetica del vuoto;\n{mink:ε₀}: costante dielettrica del vuoto.'],
  [76.7, 81.6, 'Viene circa {mink:3·10⁸} m/s:\nla velocità della {g:luce}!'],
  [81.7, 85.4, 'Quindi la luce è un’onda\n{g:elettromagnetica}.'],
  [85.5, 93.6, 'In ogni punto {mink:E} = {mink:c}·{mg:B}: con 300 N/C\ndi {mink:E}, {mg:B} è appena {mink:10⁻⁶} T.'],
  [96.4, 102.4, 'Ogni campo che cambia crea l’altro:\nl’onda va da sola, anche nel vuoto.'],
];

// ---------- aiutanti ----------
const COL_B = () => mix(C.g, C.paper, .12);
function freccia(ctx, a, b, col, al = 1, w = 7) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.2, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function scritta(ctx, s, x, y, size, al, align) {   // testo ricco su un fondino color carta
  if (al <= 0) return;
  const w = richW(ctx, s, size) + 20, a = align || 'center';
  const cx = a === 'left' ? x + w / 2 - 10 : a === 'right' ? x - w / 2 + 10 : x;
  fondo(ctx, cx, y, w, size * 1.35, al * .92);
  drawRich(ctx, s, x, y, { size, align: a, alpha: al });
}
// un campo che cresce a velocità costante fra a e b (partenza e arrivo dolci, s secondi):
// v = quanto è cresciuto (0→1), r = quanto in fretta cresce adesso (0→1)
function rampa(t, a, b, s) {
  const r = u => Math.min(P(u, a, a + s, E.io), 1 - P(u, b - s, b, E.io));
  const N = 240; let tot = 0, part = 0;
  for (let i = 0; i < N; i++) { const u = a + (b - a) * (i + .5) / N, q = r(u); tot += q; if (u < t) part += q; }
  return { v: part / tot, r: r(t) };
}
// un anello orizzontale visto un po' dall'alto: metà dietro o metà davanti; verso +1 = davanti va a destra
// (antiorario visto dall'alto), −1 = davanti va a sinistra (orario visto dall'alto)
function anello(ctx, cx, cy, rx, ry, col, al, verso, davanti) {
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); if (davanti) ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI); else ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
  // due punte, a lato della freccia del campo (che passa per il centro): l'angolo a cresce in senso orario sullo schermo,
  // e davanti (in basso) il verso +1 va verso destra, cioè ad a che cala
  for (const a of davanti ? [Math.PI / 2 - .75, Math.PI / 2 + .75] : [3 * Math.PI / 2 - .75, 3 * Math.PI / 2 + .75]) {
    const p = [cx + rx * Math.cos(a), cy + ry * Math.sin(a)], s = verso > 0 ? -1 : 1;
    arrowHead(ctx, p, Math.atan2(s * ry * Math.cos(a), -s * rx * Math.sin(a)), col, 1);
  }
  ctx.restore();
}

// ---------- 1 · un campo crea l'altro (7,5–31,4) ----------
const SX = [110, 110, 640, 680], DX_ = [1170, 110, 640, 680];
const BASE = 680, LMIN = 260, LMAX = 450, YA = 545, RX = 200, RY = 56;
// un campo che cresce al centro della scheda, e l'anello del campo che crea
function cella(ctx, cx, t, o) {
  const ra = rampa(t, o.a, o.b, .8), L = lerp(LMIN, LMAX, ra.v);
  const kA = P(t, o.a - .7, o.a - .1);                      // la freccia entra prima di crescere
  const kR = ra.r * P(t, o.a, o.a + .3);
  anello(ctx, cx, YA, RX, RY, o.colR, kR, o.verso, false);
  freccia(ctx, [cx, BASE], [cx, BASE - L], o.colF, kA, 9);
  anello(ctx, cx, YA, RX, RY, o.colR, kR, o.verso, true);
  scritta(ctx, o.nomeF, cx + 34, BASE - L + 22, 40, kA, 'left');
  scritta(ctx, o.nomeR, cx + RX + 22, YA, 40, kR, 'left');
  // sotto: se il campo cambia o no
  const kc = P(t, o.a, o.a + .4) * (1 - P(t, o.b - .2, o.b + .2)), kf = P(t, o.b - .2, o.b + .2);
  drawRich(ctx, o.nomeF + ' {dim:cresce}', cx, BASE + 50, { size: 34, alpha: kc });
  drawRich(ctx, o.nomeF + ' {dim:non cambia più}', cx, BASE + 50, { size: 34, alpha: kf });
}
function scenaCampi(ctx, t) {
  if (t < 7.5 || t > 31.6) return;
  const al = 1 - P(t, 31.0, 31.5);
  ctx.save(); ctx.globalAlpha *= al;
  // Faraday-Neumann: B in su che cresce, E in senso orario visto dall'alto
  const kS = P(t, 7.6, 8.2);
  if (kS > 0) {
    card(ctx, ...SX, kS);
    conFont(TITOLI, () => drawRich(ctx, 'Faraday-Neumann', SX[0] + SX[2] / 2, 170, { size: 40, weight: 600, alpha: P(t, 13.0, 13.5) }));
    cella(ctx, SX[0] + SX[2] / 2, t, { a: 8.6, b: 18.4, colF: COL_B(), colR: C.ink, verso: -1, nomeF: '{mg:B}', nomeR: '{mink:E}' });
  }
  // Maxwell: E in su che cresce, B in senso antiorario visto dall'alto
  const kD = P(t, 21.6, 22.1);
  if (kD > 0) {
    card(ctx, ...DX_, kD);
    conFont(TITOLI, () => drawRich(ctx, 'Maxwell', DX_[0] + DX_[2] / 2, 170, { size: 40, weight: 600, alpha: kD }));
    cella(ctx, DX_[0] + DX_[2] / 2, t, { a: 22.4, b: 26.4, colF: C.ink, colR: COL_B(), verso: 1, nomeF: '{mink:E}', nomeR: '{mg:B}' });
  }
  // a vicenda: il giro fra le due schede
  const kG = P(t, 27.5, 28.1);
  if (kG > 0) {
    const cx = 960, cy = 450, r = 112, g = .72;
    ctx.save(); ctx.globalAlpha *= kG; ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + g, Math.PI / 2 - g - .12); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI / 2 + g, 3 * Math.PI / 2 - g - .12); ctx.stroke();
    const a1 = Math.PI / 2 - g, a2 = 3 * Math.PI / 2 - g;
    arrowHead(ctx, [cx + r * Math.cos(a1), cy + r * Math.sin(a1)], a1 + Math.PI / 2 - .15, C.v, 1);
    arrowHead(ctx, [cx + r * Math.cos(a2), cy + r * Math.sin(a2)], a2 + Math.PI / 2 - .15, C.v, 1);
    ctx.restore();
    drawRich(ctx, '{mg:B} {dim:che cambia}', cx, cy - r + 10, { size: 32, alpha: kG });
    drawRich(ctx, '{mink:E} {dim:che cambia}', cx, cy + r - 10, { size: 32, alpha: kG });
    drawRich(ctx, '{v:crea}', cx + r + 14, cy, { size: 30, align: 'left', alpha: kG });
    drawRich(ctx, '{v:crea}', cx - r - 14, cy, { size: 30, align: 'right', alpha: kG });
  }
  ctx.restore();
}

// ---------- 2 · l'onda dell'antenna (31,4–65,3), al rallentatore ----------
const ONDA = [110, 110, 1700, 680];
const X0 = 290, XE = 1770, Y0 = 460, AE = 140, AB = 150, LAM = 400, V = 180, OM = TAU * V / LAM;   // T = 2,22 s
const BX = -.37, BY = .3;                         // B verso chi guarda: in diagonale, in basso a sinistra
const FERMO = [45.9, 50.9];
const tm = t => t - Math.max(0, Math.min(t, FERMO[1]) - FERMO[0]);
const TE = 32.0, T_OFF = 20;                       // l'antenna parte a 32,0 e si spegne dopo 20 s di moto (9 periodi: campo zero)
const tau = t => tm(t) - TE;
const campo = (x, t) => { const s = tau(t) - (x - X0) / V; return (s <= 0 || s >= T_OFF) ? 0 : Math.sin(OM * s); };
// nel fermo immagine: il massimo più vicino a x = 1100 e lo zero più vicino a x = 800
const S_F = tau(FERMO[0]), xFase = ph => X0 + V * (S_F - ph / OM);
const XC = xFase(Math.PI / 2 + TAU * Math.round((OM * (S_F - (1100 - X0) / V) - Math.PI / 2) / TAU));
const XZ = xFase(Math.PI * Math.round(OM * (S_F - (800 - X0) / V) / Math.PI));
const pE = (x, e) => [x, Y0 - AE * e], pB = (x, e) => [x + BX * AB * e, Y0 + BY * AB * e];
function curva(ctx, pts, col, w, al) {
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
}
function scenaOnda(ctx, t) {
  if (t < 31.2 || t > 65.8) return;
  const al = P(t, 31.3, 31.9) * (1 - P(t, 65.2, 65.7));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...ONDA);
  // la direzione dell'onda, tratteggiata
  ctx.save(); ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(XE, Y0); ctx.stroke(); ctx.restore();
  // i campi: righe sottili ogni 20 px e le due curve
  const kE = P(t, 31.8, 32.3), kB = P(t, 36.4, 37.0);
  ctx.save(); ctx.beginPath(); ctx.rect(ONDA[0] + 4, ONDA[1] + 4, ONDA[2] - 8, ONDA[3] - 8); ctx.clip();
  const cE = [], cB = [];
  // solo dove l'onda c'è: prima del fronte e dopo la coda non c'è niente da disegnare (nessuna «corda»)
  const sA = tau(t) - T_OFF, sB = tau(t);                          // l'onda occupa (x − X0)/V fra sA e sB
  const xa = Math.max(X0, X0 + V * sA), xb = Math.min(XE, X0 + V * sB);
  for (let i = 0; i <= 400 && xb > xa; i++) { const x = lerp(xa, xb, i / 400), e = campo(x, t); cE.push(pE(x, e)); cB.push(pB(x, e)); }
  ctx.lineWidth = 2.5;
  for (let x = X0 + 10; x <= XE; x += 20) {
    const e = campo(x, t); if (Math.abs(e) < .02) continue;
    const b = pB(x, e), a = pE(x, e);
    ctx.strokeStyle = css(COL_B(), .45 * kB * .9); ctx.beginPath(); ctx.moveTo(x, Y0); ctx.lineTo(b[0], b[1]); ctx.stroke();
    ctx.strokeStyle = css(C.ink, .4 * kE); ctx.beginPath(); ctx.moveTo(x, Y0); ctx.lineTo(a[0], a[1]); ctx.stroke();
  }
  curva(ctx, cB, COL_B(), 5, kB);
  curva(ctx, cE, C.ink, 5, kE);
  ctx.restore();
  // l'antenna e la sua carica
  ctx.save(); ctx.fillStyle = css(C.dim, .55); ctx.beginPath(); ctx.roundRect(X0 - 9, Y0 - 160, 18, 320, 9); ctx.fill(); ctx.restore();
  const ta = tau(t), yq = (ta > 0 && ta < T_OFF) ? Y0 - 110 * Math.sin(OM * ta) : Y0;
  ctx.save(); ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(X0, yq, 19, 0, TAU); ctx.fill(); ctx.restore();
  txt(ctx, '+', X0, yq + 1, { size: 34, weight: 700, color: C.paper });
  txt(ctx, 'antenna', X0, Y0 + 200, { size: 30, color: C.dim });
  // la legenda
  drawRich(ctx, '{mink:E}  {dim:campo elettrico}', 160, 165, { size: 34, align: 'left', alpha: kE });
  drawRich(ctx, '{mg:B}  {dim:campo magnetico}', 160, 212, { size: 34, align: 'left', alpha: kB });
  const fermo = t > FERMO[0] + .05 && t < FERMO[1] - .05;
  if (t > 32.0) txt(ctx, fermo ? 'fermo immagine' : 'al rallentatore', 1785, 160, { size: 30, color: C.dim, align: 'right' });
  // nel fermo immagine: un massimo e uno zero, tutti e due insieme
  const kF = life(t, 46.1, 50.9, .3, .3);
  if (kF > 0) {
    // a t = 45,9 la fase OM·s vale π/2 in XC (massimo) e un multiplo di π in XZ (zero): calcolati qui sotto
    const xc = XC, xz = XZ;
    const ec = campo(xc, FERMO[0]);
    freccia(ctx, [xc, Y0], pB(xc, ec), COL_B(), kF, 7);
    freccia(ctx, [xc, Y0], pE(xc, ec), C.ink, kF, 7);
    scritta(ctx, '{mink:E} {dim:e} {mg:B} {dim:al massimo}', xc, Y0 - AE - 42, 32, kF);
    ctx.save(); ctx.globalAlpha *= kF; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(xz, Y0, 10, 0, TAU); ctx.fill(); ctx.restore();
    scritta(ctx, '{dim:tutti e due} {g:zero}', xz, Y0 + AE + 40, 32, kF);
  }
  // la terna: E, B e la direzione dell'onda
  const kT = life(t, 41.3, 65.2, .4, .4), kV = P(t, 51.2, 51.7);
  if (kT > 0) {
    const O = [1590, 728];
    freccia(ctx, O, [O[0], O[1] - 85], C.ink, kT, 6);
    freccia(ctx, O, [O[0] + BX * 160, O[1] + BY * 160], COL_B(), kT, 6);
    drawRich(ctx, '{mink:E}', O[0] + 20, O[1] - 72, { size: 34, align: 'left', alpha: kT });
    drawRich(ctx, '{mg:B}', O[0] + BX * 160 - 16, O[1] + BY * 160, { size: 34, align: 'right', alpha: kT });
    freccia(ctx, O, [O[0] + 150, O[1]], C.x, kT * kV, 6);
    drawRich(ctx, '{x:direzione}', O[0] + 150, O[1] + 34, { size: 30, align: 'right', alpha: kT * kV });
  }
  // l'antenna spenta: l'onda va avanti da sola, nel vuoto
  const kS = life(t, 60.1, 65.2, .4, .4);
  if (kS > 0) drawRich(ctx, '{dim:nel} {g:vuoto}{dim:: niente aria, niente corda}', 960, 212, { size: 34, alpha: kS });
  ctx.restore();
}

// ---------- 3 · la velocità (65,3–90,2) ----------
const SV = [110, 110, 1000, 680], SC = [1150, 110, 660, 680];
function scenaVelocita(ctx, t) {
  if (t < 65.2 || t > T_FINE + .3) return;
  const al = 1 - P(t, T_FINE - .4, T_FINE + .1);
  ctx.save(); ctx.globalAlpha *= al;
  const kS = P(t, 65.4, 66.0);
  card(ctx, ...SV, kS);
  const cx = SV[0] + SV[2] / 2;
  conFont(TITOLI, () => drawRich(ctx, 'la velocità dell’onda', cx, 170, { size: 40, weight: 600, alpha: kS }));
  drawSeq(ctx, ['{mink:c =}', { num: '{mink:1}', den: '√({mink:μ₀}·{mink:ε₀})' }], cx, 290, 60, { local: t - 65.9 });
  drawRich(ctx, '{mink:μ₀ = 4π·10⁻⁷} T·m/A', cx, 420, { size: 38, local: t - 71.3 });
  drawRich(ctx, '{dim:permeabilità magnetica del vuoto}', cx, 464, { size: 30, local: t - 71.5 });
  drawRich(ctx, '{mink:ε₀ ≈ 8,85·10⁻¹²} C²/(N·m²)', cx, 530, { size: 38, local: t - 72.4 });
  drawRich(ctx, '{dim:costante dielettrica del vuoto}', cx, 574, { size: 30, local: t - 72.6 });
  drawRich(ctx, '{mink:c} ≈ {mg:3·10⁸} m/s', cx, 660, { size: 52, local: t - 76.8 });
  drawRich(ctx, 'la velocità della {g:luce}', cx, 728, { size: 34, local: t - 77.4, alpha: 1 - P(t, 81.7, 82.1) });
  drawRich(ctx, 'la luce è un’onda {g:elettromagnetica}', cx, 728, { size: 34, local: t - 82.0 });
  // E = c·B
  const kC = P(t, 85.5, 86.0);
  if (kC > 0) {
    card(ctx, ...SC, kC);
    const dx = SC[0] + SC[2] / 2;
    ctx.save(); ctx.globalAlpha *= kC;
    conFont(TITOLI, () => drawRich(ctx, 'i due campi', dx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{mink:E} = {mink:c}·{mg:B}', dx, 290, { size: 64, local: t - 85.8 });
    drawRich(ctx, '{mink:E} = 300 N/C', dx, 430, { size: 38, local: t - 86.6 });
    drawRich(ctx, '{mg:B} = {mink:E}/{mink:c} = {mink:300/(3·10⁸)}', dx, 500, { size: 38, local: t - 87.4 });
    drawRich(ctx, '{mg:B} = {mg:10⁻⁶} T', dx, 590, { size: 52, local: t - 88.2 });
    drawRich(ctx, '{dim:un milionesimo di tesla}', dx, 660, { size: 30, local: t - 88.8 });
    ctx.restore();
  }
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’onda che si regge da sola', W / 2, 180, { size: 112, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 103.0, 104.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due campi che si creano a vicenda:\nun’onda che corre anche nel {g:vuoto}.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, '{mink:E} e {mg:B} perpendicolari\ne {g:in fase}'], [960, '{mink:c} = 1/√({mink:μ₀}·{mink:ε₀})\n≈ {mink:3·10⁸} m/s'], [1470, 'nessun mezzo:\nva anche nel {g:vuoto}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): mentre un campo cresce il tono segue la sua lunghezza (rampa());
  // l'antenna ha un tono breve, un periodo solo della carica che va su e giù
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4],                                                // Faraday-Neumann: B
    ['tono', 8.6, 18.4, [.2, .3, .43, .57, .7, .8]], ['pop', 8.7, .45],               // B cresce, nasce l'anello di E
    ['pop', 13.1, .4], ['pop', 18.3, .3],                                             // il nome; B non cambia più
    ['soffio', 21.6], ['pop', 21.8, .4],                                              // Maxwell: E
    ['tono', 22.4, 26.4, [.2, .27, .42, .57, .73, .8]], ['pop', 22.5, .45],           // E cresce, nasce l'anello di B
    ['traccia', 27.5, 28.1], ['pop', 27.8, .55],                                      // a vicenda
    ['soffio', 31.3], ['pop', 31.9, .45],                                             // l'antenna, E
    ['tono', 32.0, 34.22, [.5, .85, .85, .5, .15, .15, .5]],                          // la carica va su e giù: l'onda parte
    ['pop', 36.5, .5], ['pop', 41.4, .45],                                            // B; E, B perpendicolari
    ['pop', 45.95, .3], ['pop', 46.2, .55], ['ding', 46.5],                           // fermo immagine: in fase
    ['pop', 51.3, .5],                                                                // la direzione dell'onda
    ['pop', 57.0, .3], ['pop', 60.2, .5],                                             // l'antenna si spegne; nel vuoto
    ['soffio', 65.4], ['pop', 66.0, .6],                                              // c = 1/√(μ₀·ε₀)
    ['pop', 71.4, .4], ['pop', 72.5, .4],                                             // μ₀, ε₀
    ['pop', 76.9, .6], ['pop', 77.5, .45], ['pop', 82.1, .5],                         // 3·10⁸ m/s: la luce
    ['soffio', 85.5], ['pop', 85.9, .6], ['pop', 86.7, .4], ['pop', 87.5, .4],        // E = c·B
    ['ding', 88.4],                                                                   // B = 10⁻⁶ T
    ['soffio', 94.0], ['pop', 96.2, .5], ['pop', 96.7, .6], ['pop', 97.2, .7],        // in una frase
  ];
  return {
    titolo: 'L’onda che si regge da sola', durata: 105.0, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.4, 'un campo crea l’altro'], [31.4, 65.3, 'l’onda elettromagnetica'], [65.3, T_FINE, 'la velocità della luce']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCampi(ctx, t); scenaOnda(ctx, t); scenaVelocita(ctx, t); scenaFine(ctx, t); },
  };
});
