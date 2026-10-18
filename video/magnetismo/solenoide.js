'use strict';
/* La bobina diventa calamita — una spira tagliata dallo schermo (sopra la corrente esce, sotto entra) e le sue linee di
   campo; poi 20 spire in fila: il solenoide. Le linee sono calcolate davvero: campo di spire circolari nel piano che
   contiene l'asse (formule con gli integrali ellittici K ed E, calcolati con la media aritmetico-geometrica), tracciate
   con Runge-Kutta. Dentro sono parallele e fitte (campo uniforme), fuori rade, e si richiudono: come una calamita a
   sbarra, il nord è il capo da cui escono. Mano destra: dita come la corrente nelle spire, pollice = B dentro.
   B = μ₀·n·I con n = spire PER METRO: 20 spire in 20 cm, n = 100 /m, I = 2 A → B = 4π·10⁻⁷·100·2 ≈ 2,51·10⁻⁴ T; le stesse
   20 spire su 40 cm: n = 50 /m, B ≈ 1,26·10⁻⁴ T (dimezzato) — le linee dentro sono la metà, a passo doppio. Infine il
   nucleo di ferro e l'interruttore: il chiodo sale (attrazione che cresce avvicinandosi, integrata) e ricade con
   accelerazione costante quando si apre (al rallentatore). Bobina lunga 8 raggi (calcolato: al centro il campo è il 97,5 % di μ₀·n·I). Colori fissi del magnetismo: nord scuro, sud chiaro, campo B C.g,
   corrente C.v. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/solenoide', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 95.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.5, 'felice'], [20.6, 'neutro'],
  [23.3, 'felice'], [25.4, 'neutro'], [33.5, 'sorpreso'], [35.6, 'neutro'], [48.5, 'pensa'], [53.3, 'neutro'],
  [65.0, 'felice'], [69.5, 'sorpreso'], [72.0, 'neutro'], [80.4, 'sorpreso'], [82.4, 'felice'], [84.7, 'neutro'],
  [89.7, 'festa'], [92.5, 'felice'], [97.4, 'felice'], [101.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Come si accende\ne si spegne una calamita?'],
  [7.9, 13.2, 'Una spira tagliata dallo schermo: sopra\nla corrente {mv:I} esce, sotto entra.'],
  [13.3, 18.4, 'Le linee del campo {mg:B} girano attorno\nai fili; dentro vanno tutte a destra.'],
  [18.5, 23.2, 'Ne metto tante, una accanto all’altra:\nè un {g:solenoide}, una bobina.'],
  [23.3, 28.4, 'Dentro, i campi delle spire si sommano:\nlinee parallele, il campo è {g:uniforme}.'],
  [28.5, 33.4, 'Fuori il campo è debole: le linee\nsi richiudono da un capo all’altro.'],
  [33.5, 38.4, 'Come in una calamita: il polo nord\nè il capo da cui escono.'],
  [38.5, 43.6, 'Il verso con la mano destra: dita come\nla corrente, il pollice dà {mg:B}.'],
  [43.7, 48.4, 'In un solenoide lungo, dentro:\n{mg:B} = {mink:μ₀}·{mink:n}·{mv:I}, dove…'],
  [48.5, 53.2, '…{mink:n} è il numero di spire {g:per metro},\nnon il numero di spire;'],
  [53.3, 59.0, '{mink:μ₀} = 4π·10⁻⁷ T·m/A: è la\npermeabilità magnetica del vuoto.'],
  [59.1, 64.9, 'Qui 20 spire in 20 cm: {mink:n} = 100\nal metro. Con {mv:I} = 2 A…'],
  [65.0, 69.4, '…e {mg:B} ≈ {g:2,51·10⁻⁴ T}.'],
  [69.5, 75.0, 'Stesse 20 spire, su 40 cm: {mink:n} = 50\nal metro, {mg:B} si {g:dimezza}.'],
  [75.1, 80.3, 'Infilo un cilindro di ferro: con la\ncorrente, il campo è molto più intenso.'],
  [80.4, 84.6, 'Chiudo l’interruttore (al rallentatore):\nil chiodo è attirato.'],
  [84.7, 89.6, 'Apro: niente corrente, niente campo,\ne il chiodo cade.'],
  [89.7, 94.8, 'È un {g:elettromagnete}: una calamita\nche si accende e si spegne.'],
  [97.4, 103.6, 'Nel solenoide il campo è uniforme:\n{mg:B} = {mink:μ₀}·{mink:n}·{mv:I}, con {mink:n} spire al metro.'],
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
const COL_B = () => mix(C.g, C.paper, .12);
// un filo visto di taglio: cerchio; kOut = puntino (la corrente esce dallo schermo), kIn = crocetta (entra)
function filoTaglio(ctx, p, r, kOut, kIn, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = Math.min(4, r * .3);
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.stroke();
  if (kOut > 0) { ctx.save(); ctx.globalAlpha *= kOut; ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(p[0], p[1], r * (r < 12 ? .4 : .3), 0, TAU); ctx.fill(); ctx.restore(); }
  if (kIn > 0) {
    ctx.save(); ctx.globalAlpha *= kIn; ctx.strokeStyle = css(C.v); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
    const a = r * .5; ctx.beginPath(); ctx.moveTo(p[0] - a, p[1] - a); ctx.lineTo(p[0] + a, p[1] + a); ctx.moveTo(p[0] + a, p[1] - a); ctx.lineTo(p[0] - a, p[1] + a); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function tratteggio(ctx, a, b, col, al = 1, w = 3) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
// la mano destra che stringe (come in oersted.js): qui ruotata, il pollice lungo l'asse del solenoide (B) e le dita
// chiuse nel verso della corrente nelle spire. rot = π/2: pollice a destra, e nella metà davanti le dita scendono
const scuro = () => parseInt(String(C.paper).slice(1, 3), 16) < 128;   // tema scuro: la pelle resta chiara
const PELLE = () => scuro() ? mix(C.y, C.ink, .5) : mix(C.y, C.paper, .62);
const BORDO_PELLE = () => scuro() ? mix(C.y, C.paper, .55) : mix(C.ink, C.paper, .2);
function fascia(ctx, pts, w) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [col, lw] of [[BORDO_PELLE(), w + 6], [PELLE(), w]]) {
    ctx.strokeStyle = css(col); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }
  ctx.restore();
}
function manoPresa(ctx, cx, cy, s, al, rot, colGiro, colAsse) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
  ctx.save(); ctx.strokeStyle = css(colGiro); ctx.lineWidth = 4; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, Math.PI, TAU); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = css(colAsse); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 215); ctx.lineTo(0, -190); ctx.stroke();
  arrowHead(ctx, [0, -208], -Math.PI / 2, colAsse, 1.3);
  ctx.save(); ctx.strokeStyle = css(colGiro); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [6, 180], 0, colGiro, 1.1);
  ctx.save(); ctx.fillStyle = css(PELLE()); ctx.strokeStyle = css(BORDO_PELLE()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-112, -46, 82, 140, 26); ctx.fill(); ctx.stroke(); ctx.restore();
  fascia(ctx, [[-44, -34], [-26, -92], [-16, -128]], 26);
  for (let k = 0; k < 4; k++) {
    const y = -22 + k * 31;
    fascia(ctx, [[-60, y], [-20, y + 12], [20, y + 14], [46, y + 6], [56, y - 6]], 25);
  }
  ctx.restore();
}

// ---------- il campo delle spire (piano che contiene l'asse) ----------
// integrali ellittici completi K(m) ed E(m) con la media aritmetico-geometrica
function KE(m) {
  let a = 1, b = Math.sqrt(1 - m), cc = Math.sqrt(m), s = .5 * cc * cc, p = 1;
  for (let i = 0; i < 12 && Math.abs(cc) > 1e-12; i++) { const an = (a + b) / 2; cc = (a - b) / 2; b = Math.sqrt(a * b); a = an; p *= 2; s += .5 * p * cc * cc; }
  const K = Math.PI / (2 * a); return [K, K * (1 - s)];
}
// [Bz, Br] di una spira di raggio a nel punto (r ≥ 0, z), in unità di μ₀·I/π
function anello(a, r, z) {
  r = Math.max(r, 1e-6);
  const al2 = a * a + r * r + z * z - 2 * a * r, be2 = a * a + r * r + z * z + 2 * a * r, be = Math.sqrt(be2), m = 1 - al2 / be2;
  const ke = KE(m), K = ke[0], Ee = ke[1];
  return [((a * a - r * r - z * z) * Ee + al2 * K) / (2 * al2 * be), z * ((a * a + r * r + z * z) * Ee - al2 * K) / (2 * al2 * be * r)];
}
const AX = 610, AY = 450, RSP = 55;   // asse del solenoide e raggio delle spire (px)
function campoSpire(spire, x, y) {
  const r = Math.abs(AY - y), s = AY - y >= 0 ? 1 : -1; let bz = 0, br = 0;
  for (let i = 0; i < spire.length; i++) { const q = anello(RSP, r, x - spire[i]); bz += q[0]; br += q[1]; }
  return [bz, -br * s];
}
function segui(f, p0, verso) {
  const dir = (x, y) => { const b = f(x, y), l = Math.hypot(b[0], b[1]) || 1; return [verso * b[0] / l, verso * b[1] / l]; };
  const pts = [p0]; let x = p0[0], y = p0[1];
  for (let i = 0; i < 5000; i++) {
    const h = 3, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
    x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (i > 40 && Math.hypot(x - p0[0], y - p0[1]) < 4.5) { pts.push(p0); return { pts, chiusa: true }; }
    pts.push([x, y]);
    if (x < -300 || x > 1500 || y < -300 || y > 1200) break;
  }
  return { pts, chiusa: false };
}
const DENTRO = p => p[0] > 125 && p[0] < 1095 && p[1] > 125 && p[1] < 775;
// una linea per p0 (sull'asse verticale del solenoide, dentro): i0 = l'indice di p0; iFuori = il punto della linea, dentro
// la scheda, più lontano dall'asse (lì la linea torna indietro: ci va una punta)
function linea(spire, p0) {
  const f = (x, y) => campoSpire(spire, x, y);
  const a = segui(f, p0, 1);
  let pts, i0;
  if (a.chiusa) { pts = a.pts; i0 = 0; }
  else { const b = segui(f, p0, -1).pts.reverse(); pts = b.concat(a.pts.slice(1)); i0 = b.length - 1; }
  let iF = -1, dm = 150;
  pts.forEach((p, i) => { const d = Math.abs(p[1] - AY); if (DENTRO(p) && d > dm && i > 2 && i < pts.length - 2) { dm = d; iF = i; } });
  return { pts, i0, iF, iP: Math.max(i0, 3) };   // iP: la punta dentro (per una linea chiusa p0 è il primo punto)
}
const specchio = L => ({ pts: L.pts.map(p => [p[0], 2 * AY - p[1]]), i0: L.i0, iF: L.iF, iP: L.iP });
function famiglia(spire, raggi) {
  const out = [];
  raggi.forEach(r => { const L = linea(spire, [AX, AY - r]); out.push(L); if (r > 0) out.push(specchio(L)); });
  return out;
}
const fila = passo => Array.from({ length: 20 }, (_, i) => AX + (i - 9.5) * passo);
const LINEE_UNA = famiglia([AX], [0, 18, 36]);
const LINEE_20 = famiglia(fila(24), [9, 27, 45]);     // passo 18 px fra le linee, dentro; la più esterna si chiude dentro la scheda
const LINEE_40 = famiglia(fila(48), [0, 36]);         // passo 36 px: metà linee, metà campo
function disegnaLinee(ctx, linee, al, w = 3.5) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(COL_B()); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  linee.forEach(L => { ctx.beginPath(); L.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); });
  ctx.restore();
}
function punta(ctx, pts, i, al) {
  if (al <= 0 || i < 1 || i >= pts.length - 1) return;
  const a = pts[i - 1], b = pts[i + 1];
  ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, pts[i], Math.atan2(b[1] - a[1], b[0] - a[0]), COL_B(), 1); ctx.restore();
}
// una linea disegnata a partire da p0, nei due versi, fino alla frazione k
function lineaDa(ctx, L, k, al) {
  if (k <= 0 || al <= 0) return;
  const n = L.pts.length, a = Math.round(L.i0 * (1 - k)), b = Math.round(L.i0 + (n - 1 - L.i0) * k);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(COL_B()); ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = a; i <= b; i++) i > a ? ctx.lineTo(L.pts[i][0], L.pts[i][1]) : ctx.moveTo(L.pts[i][0], L.pts[i][1]); ctx.stroke();
  ctx.restore();
}

// ---------- i tempi ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const kAllunga = t => P(t, 70.0, 71.4) * (1 - P(t, 75.1, 76.1));
const passo = t => lerp(24, 48, kAllunga(t));   // 24 px per spira: 20 spire in 20 cm (lunga 8 raggi: il campo al centro è il 97 % di μ₀·n·I)
// l'interruttore della parte 3: chiuso fra 80,6 e 84,9, e di nuovo da 90,3
const kChiuso = t => P(t, 80.5, 80.7) - P(t, 84.8, 85.0) + P(t, 90.2, 90.4);
const kCorrente = t => t < 76.5 ? 1 - P(t, 75.1, 75.5) : kChiuso(t);
// il chiodo: sale con accelerazione K/(d + 30)² − g (d = distanza dal ferro, integrata), ricade con g (al rallentatore)
const D0 = 222, G_PX = 2 * D0 / .81, K_ATT = 2 * G_PX * Math.pow(D0 + 30, 2);
const SALITA = (() => { const tab = [D0]; let d = D0, v = 0; const dt = 1 / 960; while (d > 0 && tab.length < 2000) { for (let j = 0; j < 4; j++) { v += (K_ATT / Math.pow(d + 30, 2) - G_PX) * dt; d -= v * dt; } tab.push(Math.max(0, d)); } return tab; })();
const sale = tau => { const i = clamp(tau * 240, 0, SALITA.length - 1), i0 = Math.floor(i), i1 = Math.min(SALITA.length - 1, i0 + 1); return lerp(SALITA[i0], SALITA[i1], i - i0); };
function distanzaChiodo(t) {
  if (t < 80.8) return D0;
  if (t < 85.0) return sale(t - 80.8);
  if (t < 90.5) return Math.min(D0, .5 * G_PX * Math.pow(t - 85.0, 2));
  return sale(t - 90.5);
}

// ---------- la scheda grande ----------
function sceneSpire(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 6, CARTA[1] + 6, CARTA[2] - 12, CARTA[3] - 12); ctx.clip();
  // le linee di una spira sola
  const kU = P(t, 13.5, 15.3, E.lin), aU = 1 - P(t, 18.6, 19.0);
  LINEE_UNA.forEach(L => lineaDa(ctx, L, kU, aU));
  LINEE_UNA.forEach(L => punta(ctx, L.pts, L.iP, aU * P(t, 15.2, 15.6)));
  // le linee del solenoide da 20 cm: prima dentro (si allargano dal centro), poi fuori
  const a20 = 1 - P(t, 69.6, 70.0);
  const kIn = P(t, 23.6, 25.0), kOut = P(t, 28.6, 29.6);
  if (kIn > 0 && a20 > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(AX - 237 * kIn, AY - RSP + 9, 474 * kIn, 2 * RSP - 18); ctx.clip();
    disegnaLinee(ctx, LINEE_20, a20); ctx.restore();
    LINEE_20.forEach(L => punta(ctx, L.pts, L.iP, a20 * P(t, 24.8, 25.2)));
  }
  if (kOut > 0 && a20 > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1080); ctx.rect(AX - 237, AY - RSP + 9, 474, 2 * RSP - 18); ctx.clip('evenodd');
    disegnaLinee(ctx, LINEE_20, a20 * kOut); ctx.restore();
    LINEE_20.forEach(L => punta(ctx, L.pts, L.iF, a20 * P(t, 29.4, 29.8)));
  }
  // le linee del solenoide allungato: la metà
  const a40 = life(t, 71.4, 75.4, .6, .4);
  if (a40 > 0) { disegnaLinee(ctx, LINEE_40, a40); LINEE_40.forEach(L => { punta(ctx, L.pts, L.iP, a40); punta(ctx, L.pts, L.iF, a40); }); }
  // la lunghezza della bobina, dalla prima all'ultima spira
  const kq = life(t, 59.2, 75.2, .5, .4);
  if (kq > 0) {
    const half = 9.5 * passo(t), yq = 612, cm = Math.round(20 * passo(t) / 24);
    ctx.save(); ctx.globalAlpha *= kq; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(AX - half, yq); ctx.lineTo(AX + half, yq);
    for (const x of [AX - half, AX + half]) { ctx.moveTo(x, yq - 12); ctx.lineTo(x, yq + 12); }
    ctx.stroke(); ctx.restore();
    fondo(ctx, AX, yq, 130, 46, kq); txt(ctx, cm + ' cm', AX, yq, { size: 34, weight: 600, alpha: kq });
  }
  // i poli
  const kp = life(t, 33.6, 43.6, .4, .4);
  for (const [x, s] of [[AX + 274, 'N'], [AX - 274, 'S']]) {
    if (kp <= 0) break;
    ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = css(s === 'N' ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, AY, 30, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, s, x, AY + 2, { size: 36, weight: 600, color: s === 'N' ? C.paper : C.ink, alpha: kp });
  }
  // parte 3: il circuito, il nucleo, il tavolo e il chiodo
  const k3 = P(t, 75.7, 76.5);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const xs = AX - 228, xd = AX + 228, yc = 210;
    ctx.beginPath(); ctx.moveTo(xs, AY - RSP); ctx.lineTo(xs, yc); ctx.lineTo(500, yc); ctx.moveTo(532, yc); ctx.lineTo(650, yc); ctx.moveTo(732, yc); ctx.lineTo(xd, yc); ctx.lineTo(xd, AY - RSP); ctx.stroke();
    // la pila: lastra lunga (+) e corta (−)
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(502, yc - 32); ctx.lineTo(502, yc + 32); ctx.stroke();
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(528, yc - 16); ctx.lineTo(528, yc + 16); ctx.stroke();
    txt(ctx, '+', 484, yc - 40, { size: 32, weight: 600, color: C.v });
    txt(ctx, '−', 548, yc - 40, { size: 32, weight: 600, color: C.x });
    // l'interruttore
    const ang = lerp(-32, 0, kChiuso(t)) * Math.PI / 180;
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(650, yc); ctx.lineTo(650 + 80 * Math.cos(ang), yc + 80 * Math.sin(ang)); ctx.stroke();
    ctx.fillStyle = css(C.ink); for (const x of [650, 732]) { ctx.beginPath(); ctx.arc(x, yc, 7, 0, TAU); ctx.fill(); }
    ctx.restore();
    txt(ctx, 'interruttore', 691, yc + 44, { size: 30, color: C.dim, alpha: k3 });
    // il tavolo
    ctx.save(); ctx.globalAlpha *= k3; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(790, 724); ctx.lineTo(1090, 724); ctx.stroke(); ctx.restore();
  }
  // il nucleo di ferro entra da sinistra
  const kn = P(t, 76.5, 77.7);
  if (kn > 0) {
    const dx = lerp(-760, 0, kn);
    ctx.save(); ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(mix(C.ink, C.paper, .3)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(330 + dx, AY - 40, 580, 80, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, 'ferro', 375 + dx, AY + 1, { size: 30, weight: 600, color: C.ink, alpha: .8 });
  }
  // le spire: la prima è la spira sola, che si fa piccola e va al suo posto; le altre arrivano dal centro verso i bordi
  const kp1 = P(t, 18.8, 19.4), pas = passo(t), kI = kCorrente(t);
  for (let i = 0; i < 20; i++) {
    let x = AX + (i - 9.5) * pas, r = 8, a = 1, kc = kI;
    if (i === 9) { x = lerp(AX, x, kp1); r = lerp(14, 8, kp1); a = P(t, 8.0, 8.5); kc *= P(t, 9.2, 9.7); }
    else { const ta = 19.0 + (Math.abs(i - 9.5) - .5) * .27; a = P(t, ta, ta + .3, E.back); }
    if (a <= 0) continue;
    filoTaglio(ctx, [x, AY - RSP], r * a, kc, 0, 1);
    filoTaglio(ctx, [x, AY + RSP], r * a, 0, kc, 1);
  }
  // il campo nel ferro, a interruttore chiuso; il chiodo
  const kB = kChiuso(t) * (t > 78 ? 1 : 0);
  if (kB > 0) {
    freccia(ctx, [440, AY], [820, AY], COL_B(), kB, 8);
    fondo(ctx, 630, AY - 1, 50, 46, kB); drawRich(ctx, '{mg:B}', 630, AY - 1, { size: 40, alpha: kB });
  }
  if (k3 > 0) {
    const yTop = AY + 40 + distanzaChiodo(t);
    ctx.save(); ctx.globalAlpha *= k3; ctx.fillStyle = css(mix(C.dim, C.ink, .25)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(866, yTop + 1); ctx.lineTo(946, yTop + 1); ctx.lineTo(964, yTop + 6); ctx.lineTo(946, yTop + 11); ctx.lineTo(866, yTop + 11); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(856, yTop - 3, 10, 18, 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    txt(ctx, 'chiodo', 1010, 760, { size: 30, color: C.dim, alpha: k3 * (1 - P(t, 80.6, 81.0)) });
  }
  ctx.restore();
}

// ---------- il pannello ----------
function riga(ctx, nome, val, y, al) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1215, y, { size: 36, align: 'left', alpha: al });
  drawRich(ctx, val, 1745, y, { size: 36, align: 'right', alpha: al });
}
function scenePannello(ctx, t) {
  const al = life(t, 7.9, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // 1 · i simboli e la mano destra
  const k1 = 1 - P(t, 43.6, 44.1);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    const kg = P(t, 9.2, 9.7);
    filoTaglio(ctx, [1225, 170], 18, kg, 0, kg); drawRich(ctx, '{dim:la corrente esce dallo schermo}', 1260, 170, { size: 30, align: 'left', alpha: kg });
    filoTaglio(ctx, [1225, 222], 18, 0, kg, kg); drawRich(ctx, '{dim:la corrente entra nello schermo}', 1260, 222, { size: 30, align: 'left', alpha: kg });
    separa(ctx, 266, P(t, 13.4, 13.8));
    drawRich(ctx, '{mg:B}{dim:: campo magnetico, in tesla (T)}', 1480, 310, { size: 30, local: t - 13.5 });
    const km = life(t, 38.6, 60, .5, .1);
    if (km > 0) {
      separa(ctx, 356, km);
      manoPresa(ctx, 1500, 520, .8, km, Math.PI / 2, C.v, COL_B());
      // in alto le dita vengono verso chi guarda (puntino), in basso se ne vanno (crocetta): come nelle spire
      filoTaglio(ctx, [1380, 440], 13, 1, 0, km); filoTaglio(ctx, [1380, 600], 13, 0, 1, km);
      drawRich(ctx, '{mg:B}', 1700, 520, { size: 40, alpha: km });
      drawRich(ctx, '{dim:dita:} {v:la corrente nelle spire}', 1480, 700, { size: 30, alpha: km });
      drawRich(ctx, '{dim:pollice:} {mg:B} {dim:dentro al solenoide}', 1480, 746, { size: 30, alpha: km });
    }
    ctx.restore();
  }
  // 2 · la formula e i numeri
  const k2 = life(t, 43.8, 75.4, .5, .5);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    drawRich(ctx, '{mg:B} = {mink:μ₀}·{mink:n}·{mv:I}', 1480, 182, { size: 64, local: t - 43.9 });
    drawRich(ctx, '{mink:n}{dim: = spire per metro}', 1480, 262, { size: 34, local: t - 48.6 });
    drawRich(ctx, '{mink:μ₀ = 4π·10⁻⁷} T·m/A', 1480, 322, { size: 36, local: t - 53.8 });
    separa(ctx, 372, P(t, 59.1, 59.5));
    const kl = kAllunga(t), kr = P(t, 59.2, 59.7);
    riga(ctx, '{dim:spire}', '20', 425, kr);
    riga(ctx, '{dim:lunghezza}', '20 cm', 480, kr * (1 - kl));
    riga(ctx, '{dim:lunghezza}', '40 cm', 480, kr * kl);
    riga(ctx, '{mink:n}', '100 {dim:al metro}', 535, kr * (1 - kl));
    riga(ctx, '{mink:n}', '50 {dim:al metro}', 535, kr * kl);
    riga(ctx, '{mv:I}', '2 A', 590, P(t, 62.0, 62.5));
    const kb = P(t, 65.1, 65.6);
    separa(ctx, 630, kb);
    drawRich(ctx, '{mg:B} = {mink:4π·10⁻⁷·100·2} T', 1480, 672, { size: 36, alpha: kb * (1 - kl) });
    drawRich(ctx, '{mg:B} = {mink:4π·10⁻⁷·50·2} T', 1480, 672, { size: 36, alpha: kb * kl });
    drawRich(ctx, '≈ {g:2,51·10⁻⁴ T}', 1480, 735, { size: 46, alpha: kb * (1 - kl) });
    drawRich(ctx, '≈ {g:1,26·10⁻⁴ T}', 1480, 735, { size: 46, alpha: kb * kl });
    ctx.restore();
  }
  // 3 · l'elettromagnete
  const k3 = life(t, 75.7, T_FINE + .1, .5, .5);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    drawRich(ctx, '{dim:con un nucleo di} {g:ferro}{dim:,}', 1480, 185, { size: 34, local: t - 76.6 });
    drawRich(ctx, '{mg:B} {dim:è molto più intenso}', 1480, 232, { size: 34, local: t - 76.9 });
    separa(ctx, 285, P(t, 80.1, 80.5));
    const kc = kChiuso(t), ki = P(t, 80.2, 80.6);
    drawRich(ctx, '{dim:interruttore} {g:chiuso}', 1480, 340, { size: 36, alpha: ki * kc });
    drawRich(ctx, '{dim:c’è corrente, c’è} {mg:B}', 1480, 388, { size: 32, alpha: ki * kc });
    drawRich(ctx, '{dim:interruttore} aperto', 1480, 340, { size: 36, alpha: ki * (1 - kc) });
    drawRich(ctx, '{dim:niente corrente, niente} {mg:B}', 1480, 388, { size: 32, alpha: ki * (1 - kc) });
    separa(ctx, 450, P(t, 89.8, 90.2));
    conFont(TITOLI, () => drawRich(ctx, '{g:elettromagnete}', 1480, 510, { size: 44, weight: 600, local: t - 89.9 }));
    drawRich(ctx, '{dim:una calamita che c’è}', 1480, 570, { size: 32, local: t - 90.3 });
    drawRich(ctx, '{dim:solo finché passa la corrente}', 1480, 614, { size: 32, local: t - 90.5 });
    ctx.restore();
  }
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La bobina diventa calamita', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 104.4, 105.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Una bobina con corrente è una calamita:\ndentro il campo è uniforme.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mg:B} = {mink:μ₀}·{mink:n}·{mv:I}\n{dim:con} {mink:n} {dim:spire per metro}'], [960, '{dim:il verso con la}\n{dim:mano destra}'], [1470, '{dim:con il ferro, un}\n{g:elettromagnete}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): quando la bobina si allunga il tono segue B (che si dimezza); il chiodo
  // è simulato: il tono segue la sua altezza, ricavata rieseguendo SALITA (sale in 0,675 s) e la caduta con g
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .45], ['pop', 9.3, .45],                            // la spira, la corrente
    ['traccia', 13.5, 15.3], ['pop', 15.3, .4],                                       // le linee della spira
    ['pop', 18.9, .4], ['tono', 19.0, 21.7, [.3, .4, .5, .6, .7, .8]],                // tante spire: il solenoide
    ['traccia', 23.6, 25.0], ['pop', 24.9, .45],                                      // dentro: linee parallele
    ['traccia', 28.6, 29.6], ['pop', 29.5, .4],                                       // fuori si richiudono
    ['pop', 33.7, .55],                                                               // il nord e il sud
    ['pop', 38.7, .5],                                                                // la mano destra
    ['pop', 44.0, .6], ['pop', 48.7, .45], ['pop', 53.9, .4],                         // B = μ₀·n·I, n, μ₀
    ['traccia', 59.2, 59.7], ['pop', 59.4, .45], ['pop', 62.1, .4],                   // 20 spire in 20 cm, 2 A
    ['pop', 65.2, .55], ['ding', 65.6],                                               // B ≈ 2,51·10⁻⁴ T
    ['tono', 70.0, 71.4, [.8, .78, .64, .46, .41, .4]], ['ding', 71.6],               // su 40 cm: B si dimezza
    ['soffio', 75.7], ['pop', 77.7, .5],                                              // il circuito, il nucleo di ferro
    ['pop', 80.6, .5], ['tono', 80.8, 81.47, [0, .02, .1, .23, .47, 1]], ['pop', 81.5, .6],   // chiudo: il chiodo sale
    ['pop', 84.9, .4], ['tono', 85.0, 85.9, [1, .96, .84, .64, .36, 0]], ['pop', 85.9, .3],   // apro: il chiodo cade
    ['pop', 90.3, .5], ['tono', 90.5, 91.17, [0, .02, .1, .23, .47, 1]], ['pop', 91.2, .6],   // l'elettromagnete
    ['soffio', 95.0], ['pop', 97.2, .5], ['pop', 97.7, .6], ['pop', 98.2, .7],        // in una frase
  ];
  return {
    titolo: 'La bobina diventa calamita', durata: 106.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 43.6, 'il solenoide'], [43.6, 74.6, 'quanto è intenso il campo'], [74.6, T_FINE, 'l’elettromagnete']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneSpire(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});

