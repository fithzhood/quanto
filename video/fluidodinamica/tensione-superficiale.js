'use strict';
/* L'ago che galleggia — la tensione superficiale: in superficie le molecole sono tirate solo dal basso e dai lati, la superficie
   fa da pelle tesa; γ è la forza per ogni metro di bordo (acqua a 20 °C: γ ≈ 0,073 N/m). Un ago d'acciaio (d = 7800 kg/m³,
   7,8 volte l'acqua) lungo L = 3,5 cm e spesso 0,8 mm pesa 1,34 mN: appoggiato di piatto non buca la superficie, la incurva.
   Sezione calcolata (menisco piano, lunghezza capillare √(γ/(d·g)) ≈ 2,73 mm; angolo di contatto 90°): l'equilibrio
   P = 2·γ·L·sin ψ + spinta della pressione sotto l'ago dà ψ ≈ 12,2°: la pelle tira con γ·L ≈ 2,6 mN per lato, in verticale
   insieme ≈ 1,08 mN; la pressione dell'acqua sotto l'ago ≈ 0,26 mN; somma 1,34 mN. Archimede non è violato: la spinta totale è
   il peso di tutta l'acqua spostata sotto il livello lontano, ago più conca (la componente verticale della tensione è proprio il
   peso dell'acqua che manca nella conca, γ·sin ψ = d·g·area per lato): 7,8 volte il volume dell'ago, 1,34 mN. Spinto sotto,
   l'ago sposta solo il suo volume (spinta ≈ 0,17 mN) e affonda: moto vero con la resistenza dell'acqua (coefficiente 1,2 sulla
   sezione 2·r·L) e la massa d'acqua trascinata, al rallentatore (50 volte). La viscosità è in fluidodinamica/viscosita.
   Argomento: fluidodinamica. */
CVIDEO.registra('fluidodinamica/tensione-superficiale', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;
  const TAU = Math.PI * 2;

const T_FINE = 90.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [16.1, 'sorpreso'], [20.5, 'neutro'],
  [29.5, 'felice'], [34.1, 'neutro'], [47.8, 'pensa'], [52.4, 'neutro'], [56.2, 'festa'], [60.7, 'pensa'],
  [63.6, 'felice'], [67.8, 'neutro'], [72.4, 'sorpreso'], [76.8, 'felice'], [81.2, 'neutro'], [85.4, 'sorpreso'],
  [91.9, 'felice'], [95.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Un ago d’acciaio può stare\na galla sull’acqua?'],
  [7.9, 12.3, 'L’acciaio è 7,8 volte più denso\ndell’acqua: dovrebbe affondare.'],
  [12.5, 15.9, 'Lo appoggio piano, di piatto…'],
  [16.1, 20.3, '…e resta su! La superficie\nsi {v:incurva} sotto di lui.'],
  [20.5, 24.7, 'Dentro, ogni molecola è tirata\ndalle vicine da ogni parte.'],
  [24.9, 29.3, 'In superficie nessuno tira da sopra:\nl’acqua fa da {v:pelle tesa}.'],
  [29.5, 33.9, 'La {v:tensione superficiale} {mink:γ}:\nforza per ogni metro di bordo.'],
  [34.1, 38.3, 'Per l’acqua {mink:γ} ≈ 0,073 N/m.'],
  [38.6, 42.8, 'L’ago è lungo 3,5 cm\ne pesa 1,34 mN.'],
  [43.0, 47.6, 'La pelle lo tira da ogni lato:\n{mink:γ·L} ≈ 2,6 mN.'],
  [47.8, 52.2, 'Le due forze salgono di 12°:\nin verticale fanno 1,08 mN.'],
  [52.4, 56.0, 'Sotto, l’acqua lo spinge\ncon 0,26 mN.'],
  [56.2, 60.4, 'La somma è 1,34 mN:\nproprio il peso. {g:Equilibrio}.'],
  [60.7, 63.4, 'Archimede, allora, {r:non vale}?'],
  [63.6, 67.6, '{g:Vale}: la spinta è il peso\ndell’acqua {v:spostata}.'],
  [67.8, 72.2, 'Qui però si sposta molta più acqua:\nanche quella della {v:conca}.'],
  [72.4, 76.6, 'Ago più conca: quell’acqua pesa\nproprio 1,34 mN, quanto l’ago.'],
  [76.8, 81.0, 'La pelle porta sull’ago\nla spinta di tutta la conca.'],
  [81.2, 85.2, 'Se lo spingo sotto, la pelle\nsi richiude sopra…'],
  [85.4, 90.15, '…e va a fondo: ora l’acqua preme\nanche sopra. Spinta: solo 0,17 mN.'],
  [91.9, 97.5, 'La pelle dell’acqua regge l’ago:\n{mink:γ} ≈ 0,073 N per ogni metro di bordo.'],
];

// ---------- la fisica (SI) ----------
const G = 9.8, D_ACQ = 1000, D_ACC = 7800, GAM = 0.073, R = 4e-4, L = 0.035;
const V_AGO = Math.PI * R * R * L, M_AGO = D_ACC * V_AGO, PESO = M_AGO * G, S_VOL = D_ACQ * V_AGO * G;   // 1,34 mN; 0,17 mN
const LC = Math.sqrt(GAM / (D_ACQ * G));                                       // lunghezza capillare ≈ 2,73 mm
const h0Di = psi => 2 * LC * Math.sin(psi / 2);                                // profondità del bordo della conca
function areaSotto(psi) {   // sezione d'acqua che manca fra il livello lontano e la parte bagnata dell'ago (contatto a 90°)
  const dd = R * Math.sin(psi), c = R * Math.cos(psi);
  const cap = R * R * Math.acos(dd / R) - dd * Math.sqrt(R * R - dd * dd);
  return 2 * c * h0Di(psi) + Math.PI * R * R - cap;
}
const sostegno = psi => D_ACQ * G * L * areaSotto(psi) + 2 * GAM * L * Math.sin(psi);
function psiPer(peso) { let a = 0, b = Math.PI / 2; for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (sostegno(m) < peso) a = m; else b = m; } return a; }
const PSI = psiPer(PESO);                                                      // ≈ 12,2°
const T_LATO = GAM * L, T_VERT = 2 * T_LATO * Math.sin(PSI), S_SOTTO = D_ACQ * G * L * areaSotto(PSI);
const A_LATO = LC * LC * Math.sin(PSI);                                        // l'acqua che manca nella conca, per lato
const RAPPORTO = (areaSotto(PSI) + 2 * A_LATO) / (Math.PI * R * R);           // ≈ 7,8
// ψ mentre lo appoggio: la pelle regge una parte crescente del peso (quasi statico)
const PSI_TAB = []; for (let i = 0; i <= 50; i++) PSI_TAB.push(psiPer(PESO * i / 50));
const psiFrazione = f => { const k = clamp(f) * 50, i = Math.min(49, Math.floor(k)); return lerp(PSI_TAB[i], PSI_TAB[i + 1], k - i); };
// l'ago che affonda: m_eff·a = P − S − ½·d·Cd·(2·r·L)·v², un valore ogni 0,1 ms per 0,08 s
const AFF = (() => {
  const me = M_AGO + D_ACQ * V_AGO, out = [0]; let v = 0, s = 0;
  for (let i = 1; i <= 800; i++) for (let j = 0; j < 20; j++) {
    const a = (PESO - S_VOL - .5 * D_ACQ * 1.2 * 2 * R * L * v * v) / me; v += a * 5e-6; s += v * 5e-6; if (j === 19) out.push(s);
  }
  return out;
})();
const scesa = tau => { if (tau <= 0) return 0; const k = Math.min(800, tau * 1e4), i = Math.min(799, Math.floor(k)); return lerp(AFF[i], AFF[i + 1], k - i); };
const RALL = 50;                                                               // al rallentatore
const mN = v => (v * 1000).toFixed(2).replace('.', ',');

// ---------- la sezione: 80 px per millimetro ----------
const SC = 80000, XC = 700, YS = 360, CARD = [110, 110, 1180, 680];
// il profilo della conca a destra del contatto: s(z) = lc·[acosh(2lc/z) − √(4 − z²/lc²)] − (lo stesso al bordo)
function profilo(psi) {
  const h0 = h0Di(psi), xc = R * Math.cos(psi), pts = [];
  if (h0 < 1e-7) return { h0: 0, xc: R, pts: [[R, 0], [.008, 0]] };
  const f = z => LC * (Math.acosh(2 * LC / z) - Math.sqrt(4 - z * z / (LC * LC)));
  const s0 = f(h0);
  for (let z = h0; z > 1e-6; z *= .9) { const x = xc + f(z) - s0; pts.push([x, z]); if (x > .0085) break; }
  pts.push([.0085, 0]);
  return { h0, xc, pts };
}
const px = (x, z) => [XC + x * SC, YS + z * SC];                              // z: profondità sotto il livello lontano

// lo stato dell'ago nel tempo: { psi, pelle (la superficie regge l'ago?), z (profondità del centro, m), pinza (0–1) }
const Z_SOTTO = .0026;
function stato(t) {
  if (t < 14.8) return { psi: 0, pelle: false, z: lerp(-.0027, 0, P(t, 12.6, 14.8, E.io)), pinza: P(t, 12.4, 12.7) };
  if (t < 81.4) { const f = P(t, 14.8, 16.4, E.io); return { psi: psiFrazione(f), pelle: true, z: null, pinza: 1 - P(t, 16.4, 17.0) + P(t, 80.9, 81.3) }; }
  if (t < 82.6) return { psi: lerp(PSI, .87, P(t, 81.4, 82.6, E.in)), pelle: true, z: null, pinza: 1 };
  const zz = Z_SOTTO + scesa((t - 85.5) / RALL);
  return { psi: 0, pelle: false, z: zz, pinza: 1 - P(t, 85.0, 85.5) };
}
const centro = s => s.pelle ? h0Di(s.psi) + R * Math.sin(s.psi) : s.z;

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, w = 6, al = 1) {
  const Lp = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (Lp < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, Lp / 26);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
function chip(ctx, s, x, y, al = 1, size = 30, align = 'center', bordo = null) {
  if (al <= 0) return;
  const righe = s.split('\n'), h = size * (1.4 + 1.3 * (righe.length - 1));
  const w = Math.max(...righe.map(r => M.richW(ctx, r, size))) + 22, x0 = align === 'left' ? x - 11 : align === 'right' ? x - w + 11 : x - w / 2;
  ctx.save(); ctx.globalAlpha *= al * .94; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x0, y - h / 2, w, h, 10); ctx.fill();
  if (bordo) { ctx.strokeStyle = css(bordo); ctx.lineWidth = 3; ctx.stroke(); }
  ctx.restore();
  drawRich(ctx, s, x, y, { size, align, alpha: al });
}

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’ago che galleggia', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la sezione dell'ago e dell'acqua ----------
function superficie(s) {   // il bordo dell'acqua, da sinistra a destra (in pixel), e i pezzi del menisco
  if (!s.pelle || s.psi < 1e-4) return { flat: true };
  const pr = profilo(s.psi), dx = pr.pts.map(p => px(p[0], p[1])), sx = pr.pts.map(p => px(-p[0], p[1]));
  return { flat: false, pr, destra: dx, sinistra: sx };
}
function scenaSezione(ctx, t) {
  if (t < 7.5 || t > T_FINE + .2) return;
  const al = life(t, 7.6, T_FINE, .6, .5);
  card(ctx, ...CARD, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(CARD[0] + 2, CARD[1] + 2, CARD[2] - 4, CARD[3] - 4, 22); ctx.clip();
  const s = stato(t), sup = superficie(s), zc = centro(s), NC = px(0, zc), RP = R * SC;
  const X0 = CARD[0], X1 = CARD[0] + CARD[2], YB = CARD[1] + CARD[3];
  // l'acqua
  ctx.beginPath();
  if (sup.flat) { ctx.moveTo(X0, YS); ctx.lineTo(X1, YS); }
  else {
    ctx.moveTo(X0, YS); for (let i = sup.sinistra.length - 1; i >= 0; i--) ctx.lineTo(...sup.sinistra[i]);
    ctx.arc(NC[0], NC[1], RP, Math.PI + s.psi, -s.psi, true);
    sup.destra.forEach(p => ctx.lineTo(...p)); ctx.lineTo(X1, YS);
  }
  ctx.lineTo(X1, YB); ctx.lineTo(X0, YB); ctx.closePath();
  ctx.fillStyle = css(C.x, .16); ctx.fill();
  // il pelo dell'acqua: la «pelle», che si accende quando se ne parla
  const kPelle = life(t, 25.1, 38.3, .5, .6);
  ctx.save(); ctx.strokeStyle = css(mix(C.x, C.v, kPelle)); ctx.lineWidth = 3 + 3 * kPelle; ctx.lineJoin = 'round';
  if (sup.flat) { ctx.beginPath(); ctx.moveTo(X0, YS); ctx.lineTo(X1, YS); ctx.stroke(); }
  else {
    ctx.beginPath(); ctx.moveTo(X0, YS); for (let i = sup.sinistra.length - 1; i >= 0; i--) ctx.lineTo(...sup.sinistra[i]); ctx.stroke();
    ctx.beginPath(); sup.destra.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.lineTo(X1, YS); ctx.stroke();
  }
  ctx.restore();
  // l'acqua spostata: ago più conca, sotto il livello lontano
  const kSp = life(t, 67.9, 81.2, .6, .4);
  if (kSp > 0 && !sup.flat) {
    ctx.save(); ctx.globalAlpha *= kSp;
    ctx.beginPath(); ctx.moveTo(X0, YS); ctx.lineTo(X1, YS);
    for (let i = sup.destra.length - 1; i >= 0; i--) ctx.lineTo(...sup.destra[i]);
    ctx.arc(NC[0], NC[1], RP, -s.psi, Math.PI + s.psi, false);
    sup.sinistra.forEach(p => ctx.lineTo(...p)); ctx.closePath();
    ctx.fillStyle = css(C.v, .3); ctx.fill();
    ctx.restore();
    dashed(ctx, [X0, YS], [X1, YS], C.v, 1, kSp);
    chip(ctx, '{dim:livello lontano dall’ago}', 145, YS - 32, kSp * (1 - P(t, 76.5, 76.9)), 30, 'left');
    chip(ctx, '{v:acqua spostata: ago + conca}', XC, YS + 175, kSp * P(t, 68.4, 68.9), 32);
  }
  // l'ago, in sezione, e la pinzetta che lo tiene (arrivano insieme)
  ctx.save(); ctx.globalAlpha *= P(t, 12.3, 12.7);
  ctx.save(); ctx.fillStyle = css(mix(C.dim, C.paper, .35)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(NC[0], NC[1], RP, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  if (s.pinza > 0) {
    ctx.save(); ctx.globalAlpha *= s.pinza; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 7; ctx.lineCap = 'round';
    const top = NC[1] - RP, su = 140 * (1 - s.pinza);
    ctx.beginPath(); ctx.moveTo(NC[0] - 60, CARD[1] - 10 - su); ctx.lineTo(NC[0] - 12, top - 4 - su); ctx.moveTo(NC[0] + 60, CARD[1] - 10 - su); ctx.lineTo(NC[0] + 12, top - 4 - su); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  chip(ctx, '{dim:l’ago in sezione, ingrandito}', 145, 150, P(t, 8.0, 8.5) * (1 - P(t, 67.6, 68.0)), 30, 'left');
  txt(ctx, 'acqua', X1 - 90, YB - 40, { size: 30, color: C.x, alpha: P(t, 8.0, 8.5) });
  // le forze sull'ago in equilibrio (39–60,6) e, più tenui, quando si parla della conca (76,8–81)
  const kForze = life(t, 38.8, 60.6, .4, .5), kPelle2 = life(t, 76.9, 81.1, .4, .3) * .9;
  if (s.pelle && (kForze > 0 || kPelle2 > 0)) forze(ctx, t, s, NC, RP, kForze, kPelle2);
  // Archimede: prima la domanda, poi la risposta
  chip(ctx, '{r:Archimede non vale?}', XC, 235, life(t, 60.8, 63.6, .3, .3), 40, 'center', C.r);
  chip(ctx, '{g:Archimede vale}', XC, 235, life(t, 63.6, 67.7, .3, .3), 40, 'center', C.g);
  chip(ctx, '{dim:al rallentatore, 50 volte}', 145, 150, life(t, 85.5, T_FINE, .3, .3), 30, 'left');
  ctx.restore();
}
const FS = 120000;   // px per newton: 120 px per millinewton
function forze(ctx, t, s, NC, RP, kF, kP) {
  const psi = s.psi, h0 = h0Di(psi), cr = px(R * Math.cos(psi), h0), cl = px(-R * Math.cos(psi), h0);
  const LT = T_LATO * FS, ux = Math.cos(psi), uy = -Math.sin(psi);
  // la pelle: due forze lungo la superficie
  const kT = Math.max(kF * P(t, 43.2, 43.8), kP);
  freccia(ctx, cr, [cr[0] + ux * LT, cr[1] + uy * LT], C.y, 6, kT);
  freccia(ctx, cl, [cl[0] - ux * LT, cl[1] + uy * LT], C.y, 6, kT);
  drawRich(ctx, '{my:T}', cr[0] + ux * LT + 10, cr[1] + uy * LT - 34, { size: 40, alpha: kT });
  drawRich(ctx, '{my:T}', cl[0] - ux * LT - 10, cl[1] + uy * LT - 34, { size: 40, alpha: kT });
  if (kF <= 0) return;
  // il peso e la spinta dell'acqua sotto
  const kPeso = kF * P(t, 38.9, 39.4), kS = kF * P(t, 52.6, 53.1);
  freccia(ctx, NC, [NC[0], NC[1] + PESO * FS], C.y, 6, kPeso);
  drawRich(ctx, '{my:P}{dim: peso}', NC[0] + 22, NC[1] + PESO * FS - 30, { size: 36, align: 'left', alpha: kPeso });
  const yb = NC[1] + RP;
  [-22, 22].forEach(dx => freccia(ctx, [NC[0] + dx, yb + 6 + S_SOTTO / 2 * FS + 16], [NC[0] + dx, yb + 4], C.y, 4, kS));
  drawRich(ctx, '{my:S}{dim: pressione}', NC[0] - 40, yb + 40, { size: 36, align: 'right', alpha: kS });
  // l'angolo e le parti verticali
  const kA = kF * P(t, 48.0, 48.6);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    dashed(ctx, cr, [cr[0] + 200, cr[1]], C.dim, 1, 1);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cr[0], cr[1], 150, -psi, 0); ctx.stroke();
    ctx.restore();
    drawRich(ctx, '12°', cr[0] + 140, cr[1] + 28, { size: 34, align: 'left', alpha: kA });
    const v = T_LATO * Math.sin(psi) * FS;
    const xr = cr[0] + ux * LT, yr = cr[1] + uy * LT, xl = cl[0] - ux * LT;
    freccia(ctx, [xr, cr[1]], [xr, cr[1] - v], C.y, 4, kA * .8); freccia(ctx, [xl, cl[1]], [xl, cl[1] - v], C.y, 4, kA * .8);
  }
}

// ---------- la scheda a destra ----------
const RX0 = 1355, RX1 = 1780, RXC = 1565;
function riga(ctx, nome, val, y, al, size = 32) {
  if (al <= 0.01) return;
  drawRich(ctx, nome, RX0, y, { size, align: 'left', alpha: al });
  if (val) drawRich(ctx, val, RX1, y, { size: size + 2, weight: 600, align: 'right', alpha: al });
}
function titoletto(ctx, s, y, al) { if (al > 0) conFont(TITOLI, () => drawRich(ctx, s, RXC, y, { size: 38, weight: 600, alpha: al })); }
function scenaScheda(ctx, t) {
  if (t < 7.6 || t > T_FINE + .2) return;
  card(ctx, 1320, 110, 490, 680, life(t, 7.8, T_FINE, .5, .5));
  ctx.save(); ctx.globalAlpha *= 1 - P(t, T_FINE - .4, T_FINE);
  // A · le densità
  const aA = life(t, 7.9, 20.4, .4, .4);
  if (aA > 0) {
    ctx.save(); ctx.globalAlpha *= aA;
    titoletto(ctx, 'densità', 165, 1);
    riga(ctx, 'acciaio', '7800 kg/m³', 250, P(t, 8.1, 8.5));
    riga(ctx, 'acqua', '1000 kg/m³', 310, P(t, 8.4, 8.8));
    drawRich(ctx, '7800 / 1000 = {g:7,8}', RXC, 395, { size: 40, alpha: P(t, 9.2, 9.7) });
    drawRich(ctx, '{dim:più denso dell’acqua:}\n{dim:dovrebbe affondare}', RXC, 490, { size: 30, alpha: P(t, 10.2, 10.7), lh: 1.35 });
    drawRich(ctx, '{g:eppure resta su}', RXC, 600, { size: 40, alpha: P(t, 16.3, 16.8) });
    ctx.restore();
  }
  // B · le molecole
  const aB = life(t, 20.5, 29.4, .4, .4);
  if (aB > 0) {
    ctx.save(); ctx.globalAlpha *= aB;
    const yS = 220, sx = 80;
    ctx.fillStyle = css(C.x, .14); ctx.fillRect(1345, yS, 440, 380);
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1345, yS); ctx.lineTo(1785, yS); ctx.stroke();
    txt(ctx, 'aria', RXC, yS - 40, { size: 30, color: C.dim });
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
      const x = 1405 + i * sx, y = yS + 42 + j * sx, w = Math.sin(t * 6 + i * 2.1 + j * 1.3) * 2;
      ctx.fillStyle = css(mix(C.x, C.paper, .3)); ctx.strokeStyle = css(C.x); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + w, y - w, 17, 0, TAU); ctx.fill(); ctx.stroke();
    }
    // dentro: tirata da tutte le parti
    const kD = P(t, 20.7, 21.2), cd = [1565, yS + 42 + 2 * sx];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => freccia(ctx, [cd[0] + a * 20, cd[1] + b * 20], [cd[0] + a * 62, cd[1] + b * 62], C.y, 5, kD));
    // in superficie: niente da sopra, resta tirata verso il basso
    const kS = P(t, 25.1, 25.6), cs = [1645, yS + 42];
    [[1, 0], [-1, 0], [0, 1]].forEach(([a, b]) => freccia(ctx, [cs[0] + a * 20, cs[1] + b * 20], [cs[0] + a * 62, cs[1] + b * 62], C.y, 5, kS));
    drawRich(ctx, '{dim:dentro: le forze}\n{dim:si annullano}', RXC, 655, { size: 30, alpha: kD * (1 - kS), lh: 1.3 });
    drawRich(ctx, '{dim:in superficie: tirata}\n{dim:verso il basso, la superficie}\n{dim:resta tesa}', RXC, 680, { size: 30, alpha: kS, lh: 1.3 });
    ctx.restore();
  }
  // C · la forza per ogni metro di bordo
  const aC = life(t, 29.6, 38.5, .4, .4);
  if (aC > 0) {
    ctx.save(); ctx.globalAlpha *= aC;
    titoletto(ctx, 'vista dall’alto', 165, 1);
    ctx.fillStyle = css(C.x, .14); ctx.fillRect(1355, 200, 420, 260);
    ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(RXC, 225); ctx.lineTo(RXC, 435); ctx.stroke(); ctx.restore();
    [260, 330, 400].forEach(y => { freccia(ctx, [RXC - 10, y], [RXC - 95, y], C.y, 5, 1); freccia(ctx, [RXC + 10, y], [RXC + 95, y], C.y, 5, 1); });
    drawRich(ctx, '{v:un bordo}', RXC, 490, { size: 30 });
    drawRich(ctx, '{mink:γ} = forza / lunghezza del bordo', RXC, 565, { size: 32, alpha: P(t, 29.8, 30.3) });
    const k8 = P(t, 34.3, 34.8);
    drawRich(ctx, '{dim:acqua a 20 °C:}', RXC, 645, { size: 30, alpha: k8 });
    drawRich(ctx, '{mink:γ} ≈ {g:0,073 N/m}', RXC, 710, { size: 44, alpha: k8 });
    ctx.restore();
  }
  // D · le forze sull'ago
  const aD = life(t, 38.6, 60.6, .4, .4);
  if (aD > 0) {
    ctx.save(); ctx.globalAlpha *= aD;
    drawRich(ctx, '{mink:L} = 3,5 cm {dim:(vista dall’alto)}', RXC, 148, { size: 32 });
    ctx.fillStyle = css(mix(C.dim, C.paper, .35)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(1365, 222, 400, 12, 6); ctx.fill(); ctx.stroke();
    const kT = P(t, 43.2, 43.7);
    for (let i = 0; i < 6; i++) { const x = 1395 + i * 68; freccia(ctx, [x, 217], [x, 183], C.y, 4, kT); freccia(ctx, [x, 239], [x, 273], C.y, 4, kT); }
    drawRich(ctx, '{dim:spessore 0,8 mm}', RXC, 308, { size: 30 });
    riga(ctx, '{my:P}{dim: peso}', mN(PESO) + ' mN', 368, P(t, 38.9, 39.4));
    riga(ctx, '{my:T} = {mink:γ·L}', '≈ 2,6 mN', 428, kT);
    drawRich(ctx, '{dim:0,073 N/m · 0,035 m, per lato}', RXC, 470, { size: 30, alpha: kT });
    riga(ctx, '2·{my:T}·sin 12°', '≈ ' + mN(T_VERT) + ' mN', 532, P(t, 48.0, 48.5));
    riga(ctx, '{my:S}{dim: pressione sotto}', mN(S_SOTTO) + ' mN', 592, P(t, 52.6, 53.1));
    const kE = P(t, 56.4, 56.9);
    if (kE > 0) {
      ctx.save(); ctx.globalAlpha *= kE; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(RX0, 635); ctx.lineTo(RX1, 635); ctx.stroke(); ctx.restore();
      riga(ctx, mN(T_VERT) + ' + ' + mN(S_SOTTO), '= {g:' + mN(PESO) + ' mN}', 690, kE);
    }
    ctx.restore();
  }
  // E · Archimede
  const aE = life(t, 60.7, 81.2, .4, .4);
  if (aE > 0) {
    ctx.save(); ctx.globalAlpha *= aE;
    titoletto(ctx, 'e Archimede?', 165, 1);
    drawRich(ctx, 'spinta = peso\ndell’acqua {v:spostata}', RXC, 260, { size: 34, alpha: P(t, 63.8, 64.3), lh: 1.3 });
    drawRich(ctx, '{dim:spostata da} ago + {v:conca}:', RXC, 365, { size: 32, alpha: P(t, 68.0, 68.5) });
    drawRich(ctx, '≈ 7,8 volte il volume dell’ago', RXC, 415, { size: 32, alpha: P(t, 68.6, 69.1) });
    const kW = P(t, 72.6, 73.1);
    drawRich(ctx, '{dim:quell’acqua pesa}', RXC, 490, { size: 30, alpha: kW });
    drawRich(ctx, '{g:' + mN(PESO) + ' mN}', RXC, 545, { size: 48, alpha: kW });
    drawRich(ctx, '{dim:proprio il peso dell’ago}', RXC, 600, { size: 30, alpha: kW });
    drawRich(ctx, 'la pelle porta sull’ago\nla spinta della conca', RXC, 690, { size: 32, alpha: P(t, 77.0, 77.5), lh: 1.3 });
    ctx.restore();
  }
  // F · sott'acqua
  const aF = life(t, 81.3, T_FINE, .4, .4);
  if (aF > 0) {
    ctx.save(); ctx.globalAlpha *= aF;
    titoletto(ctx, 'sott’acqua', 165, 1);
    drawRich(ctx, '{dim:la pelle si richiude:}\n{dim:l’acqua preme anche da sopra}', RXC, 265, { size: 30, lh: 1.35 });
    const k2 = P(t, 85.6, 86.1);
    riga(ctx, '{my:S} = {mink:d·V·g}', '≈ ' + mN(S_VOL) + ' mN', 380, k2);
    drawRich(ctx, '{mink:d}{dim: densità dell’acqua,} {mink:V}{dim: volume}', RXC, 425, { size: 30, alpha: k2 });
    riga(ctx, '{my:P}{dim: peso}', mN(PESO) + ' mN', 490, k2);
    drawRich(ctx, '{my:P} > {my:S}: {v:va a fondo}', RXC, 580, { size: 40, alpha: P(t, 86.8, 87.3) });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 98.4, 99.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La superficie dell’acqua è una pelle tesa:\nregge l’ago senza smentire Archimede.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, '{mink:γ} ≈ 0,073 N/m\n{dim:forza per metro di bordo}'], [960, 'ago: {my:P} = 2·{my:T}·sin 12° + {my:S}'], [1430, 'spinta = peso di\nago + {v:conca} spostati']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 30 : 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const verifica = {
    pesoMN: PESO * 1e3, spintaVolumeMN: S_VOL * 1e3, lcMM: LC * 1e3, psiGradi: PSI * 180 / Math.PI, tLatoMN: T_LATO * 1e3,
    tVertMN: T_VERT * 1e3, sSottoMN: S_SOTTO * 1e3, somma: (T_VERT + S_SOTTO) * 1e3, rapporto: RAPPORTO,
    pesoConca: D_ACQ * G * L * (areaSotto(PSI) + 2 * A_LATO) * 1e3, h0MM: h0Di(PSI) * 1e3, conRotondi: 2 * 2.6 * Math.sin(12 * Math.PI / 180),
    affondaMs: (() => { let i = 0; while (AFF[i] < .0028 && i < 800) i++; return i / 10; })(),
  };
  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza del centro dell'ago nella sezione, dal fondo
  // della scheda (0) a 2,7 mm sopra il pelo dell'acqua (1); i moti sono quelli di stato(t)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .4], ['pop', 8.4, .45], ['pop', 9.2, .6], ['pop', 10.2, .3],   // le densità: 7,8 volte, dovrebbe affondare
    ['pop', 12.4, .7], ['tono', 12.6, 14.8, [1, .98, .83, .69, .67]],                 // l'ago nella pinzetta scende piano
    ['tono', 14.8, 16.4, [.67, .66, .6, .58]], ['ding', 16.3],                        // la superficie si incurva: resta su
    ['soffio', 20.5], ['pop', 20.7, .5], ['pop', 25.1, .4],                           // le molecole: dentro, in superficie
    ['soffio', 29.6], ['pop', 29.8, .5], ['pop', 34.3, .6],                           // γ, forza per metro di bordo; 0,073 N/m
    ['soffio', 38.6], ['pop', 38.9, .3], ['pop', 43.2, .6],                           // il peso, le due forze della pelle
    ['pop', 48.0, .5], ['pop', 52.6, .4],                                             // 12° e le parti verticali, la pressione sotto
    ['pop', 60.8, .3], ['ding', 63.6],                                                // Archimede non vale? Vale
    ['pop', 68.0, .4], ['pop', 68.6, .5], ['ding', 72.6],                             // l'acqua della conca: pesa 1,34 mN
    ['pop', 77.0, .5],                                                                // la pelle porta la spinta della conca
    ['soffio', 81.3], ['tono', 81.4, 82.6, [.58, .58, .51, .35]], ['pop', 82.6, .3],  // lo spingo sotto, la pelle si richiude
    ['pop', 85.6, .45], ['tono', 85.5, 87.0, [.35, .32, .24, .12, 0]], ['pop', 86.8, .25],   // va a fondo, al rallentatore
    ['soffio', 90.4], ['pop', 91.8, .5], ['pop', 92.3, .6], ['pop', 92.8, .7],        // in una frase
  ];
  return {
    titolo: 'L’ago che galleggia', durata: 100, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 38.5, 'la pelle dell’acqua'], [38.5, 60.6, 'le forze sull’ago'], [60.6, T_FINE, 'e Archimede?']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaSezione(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
