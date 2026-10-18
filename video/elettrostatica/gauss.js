'use strict';
/* Le linee che si diradano — le linee di campo di una carica Q bucano sfere sempre più grandi: le stesse linee su
   4π·r², quindi per ogni m² ne passano 1/r²: così cala il campo. Disegno in 3D (proiezione ortogonale): 160 direzioni
   di Fibonacci, una per linea; la finestra ha area fissa (6670 px² sulla sfera, r = 105 px) e ci passano 8, 2, 1 linee a r, 2r, 3r
   (contate dal codice; attese 7,7 · 1,9 · 0,86); con la carica doppia (sfera a 2r) 4 invece di 2. Un riquadro la mostra ingrandita e di fronte. Il flusso Φ = E·S (E perpendicolare e uniforme), il teorema di Gauss
   Φ = Q/ε₀ per ogni superficie chiusa attorno a Q (deformata: la bucano le stesse linee), e da E·4π·r² = Q/ε₀ il campo
   E = Q/(4π·ε₀·r²) = k·Q/r². Colori fissi dell'elettrostatica: positive C.v, negative C.x, forze C.y, campo C.ink.
   Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/gauss', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 93.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.5, 'felice'], [27.4, 'neutro'],
  [36.1, 'sorpreso'], [41.0, 'neutro'], [45.3, 'felice'], [49.9, 'neutro'], [59.6, 'felice'], [64.3, 'festa'],
  [69.5, 'neutro'], [74.4, 'sorpreso'], [79.1, 'neutro'], [83.7, 'festa'], [88.3, 'felice'], [92.0, 'neutro'],
  [95.4, 'felice'], [99.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché il campo di una carica\ncala come 1/{mink:r²}?'],
  [7.9, 12.4, 'Una carica {mink:Q} positiva. Attorno\nc’è il suo {g:campo elettrico} {mink:E}:'],
  [12.5, 17.25, 'la forza su ogni coulomb di una\ncarica di prova, piccola e positiva.'],
  [17.35, 22.4, 'Le {g:linee di campo} seguono {mink:E}: sono\npiù fitte dove il campo è intenso.'],
  [22.5, 27.3, 'Avvolgo la carica in una sfera\ndi raggio {mink:r}: le linee la bucano.'],
  [27.4, 31.4, 'La superficie della sfera\nè 4π{mink:r²}.'],
  [31.5, 36.0, 'Conto le linee in una finestra,\nsempre della stessa area.'],
  [36.1, 40.9, 'Raggio doppio: le stesse linee su\nuna superficie {g:4 volte} più grande.'],
  [41.0, 45.2, 'Raggio triplo:\nsuperficie {g:9 volte} più grande.'],
  [45.3, 49.8, 'Linee per m² come 1/{mink:r²}:\ncosì cala il campo {mink:E}.'],
  [49.9, 54.7, 'Il {g:flusso} Φ di {mink:E} conta le linee\nche bucano una superficie.'],
  [54.8, 59.5, 'Sulla sfera {mink:E} è perpendicolare e\nuguale ovunque: Φ = {mink:E}·4π{mink:r²}.'],
  [59.6, 64.2, 'Si disegnano tante linee quanta\nè la carica: {mink:Q} doppia, linee doppie.'],
  [64.3, 69.4, 'Teorema di {g:Gauss}: Φ = {mink:Q}/{mink:ε₀}, dove {mink:ε₀}\nè la costante dielettrica del vuoto.'],
  [69.5, 74.3, 'Vale per {g:ogni} superficie chiusa\nattorno a {mink:Q}, di qualunque forma.'],
  [74.4, 79.0, 'Deformo la superficie: la bucano\nsempre le stesse linee.'],
  [79.1, 83.6, 'Torno alla sfera:\n{mink:E}·4π{mink:r²} = {mink:Q}/{mink:ε₀}…'],
  [83.7, 88.2, '…quindi {mink:E} = {mink:Q}/(4π·{mink:ε₀}·{mink:r²}):\nil campo cala come 1/{mink:r²}.'],
  [88.3, 92.8, 'Cioè {mink:E} = {mink:k·Q/r²}, come dice Coulomb,\ncon {mink:k} = 1/(4π·{mink:ε₀}).'],
  [95.4, 101.8, 'Le stesse linee su sfere sempre più\ngrandi: per questo {mink:E} va come 1/{mink:r²}.'],
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
function carica(ctx, p, segno, r = 34, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  const col = segno > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(3, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
  if (segno > 0) { ctx.moveTo(0, -a); ctx.lineTo(0, a); }
  ctx.stroke(); ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }

// ---------- la geometria in 3D (coordinate della camera: x a destra, y in alto, z verso chi guarda) ----------
const CARTA = [110, 110, 1000, 680];
const QC = [610, 450], RQ = 30, R0 = 105;
const NTOT = 320, GA = Math.PI * (3 - Math.sqrt(5));
const ruota = ([x, y, z], a, b) => { const y1 = y * Math.cos(a) - z * Math.sin(a), z1 = y * Math.sin(a) + z * Math.cos(a); return [x * Math.cos(b) + z1 * Math.sin(b), y1, -x * Math.sin(b) + z1 * Math.cos(b)]; };
// 320 direzioni di Fibonacci: le pari sono le 160 linee di Q, le dispari si aggiungono quando la carica raddoppia
const DIR = Array.from({ length: NTOT }, (_, i) => { const z = 1 - 2 * (i + .5) / NTOT, r = Math.sqrt(1 - z * z), f = i * GA; return ruota([r * Math.cos(f), r * Math.sin(f), z], 1.1, .7); });
const UW = (() => { const v = [.83, -.12, .545], l = Math.hypot(...v); return v.map(c => c / l); })();   // il centro della finestra: a destra, lontano da Q
const A0 = 6670;                                                                                       // area della finestra, in px²
const cosFin = R => 1 - A0 / (2 * Math.PI * R * R);                                                    // calotta di area A0
const dentro = (d, R) => d[0] * UW[0] + d[1] * UW[1] + d[2] * UW[2] > cosFin(R);
const proietta = (d, s) => [QC[0] + d[0] * s, QC[1] - d[1] * s];
// la superficie deformata: raggio che dipende dalla direzione (resta «a stella» attorno a Q)
const forma = d => 1 + .24 * Math.sin(2.5 * Math.atan2(d[1], d[0]) + 1) * Math.sqrt(1 - d[2] * d[2]) + .1 * d[2] - .08 * d[1] * d[1];
const CAMPIONE = Array.from({ length: 1400 }, (_, i) => { const z = 1 - 2 * (i + .5) / 1400, r = Math.sqrt(1 - z * z), f = i * GA; return [r * Math.cos(f), r * Math.sin(f), z]; });
const E1 = (() => { const c = [UW[1], -UW[0], 0], l = Math.hypot(...c); return c.map(v => v / l); })();   // due versori perpendicolari a UW
const E2 = [UW[1] * E1[2] - UW[2] * E1[1], UW[2] * E1[0] - UW[0] * E1[2], UW[0] * E1[1] - UW[1] * E1[0]];
const contaFinestra = (R, tutte) => DIR.filter((d, i) => (tutte || i % 2 === 0) && dentro(d, R)).length;
const CONTI = [R0, 2 * R0, 3 * R0].map(R => contaFinestra(R, false));   // 8, 2, 1
// il riquadro ingrandito: la finestra vista di fronte (assi T1 orizzontale e T2 verticale sul piano tangente)
const T1 = (() => { const v = [1 - UW[0] * UW[0], -UW[0] * UW[1], -UW[0] * UW[2]], l = Math.hypot(...v); return v.map(c => c / l); })();
const T2 = [UW[1] * T1[2] - UW[2] * T1[1], UW[2] * T1[0] - UW[0] * T1[2], UW[0] * T1[1] - UW[1] * T1[0]];
const IC = [995, 232], RI = 105, RW = 78;   // centro e raggio del riquadro, raggio della finestra ingrandita

// lo stato: raggio, deformazione, carica doppia
const raggio = t => R0 * (1 + P(t, 36.3, 37.8) + P(t, 41.1, 42.6) - 2 * P(t, 49.9, 51.0));   // a 51 torna a r: con Q doppia le linee nella finestra raddoppiano
const kForma = t => P(t, 74.6, 76.0) - P(t, 79.2, 80.2);
const kDoppia = t => P(t, 59.8, 60.6) - P(t, 64.3, 64.9);
const rho = (d, R, k) => R * (k > 0 ? lerp(1, forma(d), k) : 1);

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le linee che si diradano', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// la carica, le linee, la superficie, i buchi (7,5–93)
function sceneSfera(ctx, t) {
  const al = life(t, 7.8, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const R = raggio(t), kf = kForma(t), k2 = kDoppia(t);
  const pesoLinea = i => i % 2 === 0 ? 1 : k2;
  // le linee: una per direzione, dalla carica fin fuori dalla scheda
  const kl = P(t, 17.5, 19.2);
  if (kl > 0) {
    ctx.save(); ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    DIR.forEach((d, i) => {
      const w = pesoLinea(i); if (w <= 0) return;
      ctx.globalAlpha = al * w * (d[2] > 0 ? .5 : .28);
      const a = proietta(d, RQ), b = proietta(d, RQ + (520 - RQ) * kl);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    });
    ctx.restore();
  }
  // la superficie: sfera (o superficie deformata), vista da fuori, trasparente
  const ks = P(t, 22.6, 23.4);
  if (ks > 0) {
    const Rv = R * P(t, 22.6, 23.4, E.out);
    ctx.save(); ctx.globalAlpha *= ks;
    ctx.beginPath();
    if (kf > 0) {   // il contorno della superficie deformata: per ogni angolo sullo schermo, il punto proiettato più lontano
      const BIN = 144, mx = new Array(BIN).fill(0);
      CAMPIONE.forEach(d => { const s = rho(d, Rv, kf), x = d[0] * s, y = d[1] * s, b = Math.floor(((Math.atan2(y, x) + TAU) % TAU) / TAU * BIN) % BIN; mx[b] = Math.max(mx[b], Math.hypot(x, y)); });
      const lisci = mx.map((v, i) => (mx[(i + BIN - 1) % BIN] + 2 * v + mx[(i + 1) % BIN]) / 4);
      lisci.forEach((v, i) => { const a = (i + .5) / BIN * TAU; const x = QC[0] + v * Math.cos(a), y = QC[1] - v * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.closePath();
    } else ctx.arc(QC[0], QC[1], Rv, 0, TAU);
    const g = ctx.createRadialGradient(QC[0] - Rv * .35, QC[1] - Rv * .4, Rv * .1, QC[0], QC[1], Rv * 1.1);
    g.addColorStop(0, css(C.dim, .04)); g.addColorStop(1, css(C.dim, .14));
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 3; ctx.stroke();
    // l'equatore, solo sulla sfera
    const ke = 1 - clamp(kf * 3);
    if (ke > 0) { ctx.globalAlpha *= ke; ctx.setLineDash([7, 8]); ctx.lineWidth = 2; ctx.strokeStyle = css(C.dim, .6); ctx.beginPath(); ctx.ellipse(QC[0], QC[1], Rv, Rv * .28, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
  carica(ctx, QC, 1, RQ, 1, P(t, 7.9, 8.5, E.back));
  if (ks > 0) {
    // la finestra: sempre la stessa area sulla sfera
    const kw = Math.max(life(t, 31.6, 49.8, .4, .4), life(t, 59.7, 64.3, .4, .4)) * (1 - clamp(kf * 4));
    if (kw > 0) {
      const ca = cosFin(R), sa = Math.sqrt(1 - ca * ca);
      ctx.save(); ctx.globalAlpha *= kw; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.beginPath();
      for (let j = 0; j <= 72; j++) {
        const ps = j / 72 * TAU, p = [0, 1, 2].map(c => UW[c] * ca + (E1[c] * Math.cos(ps) + E2[c] * Math.sin(ps)) * sa);
        const q = proietta(p, R); j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
      }
      ctx.stroke(); ctx.restore();
    }
    // i buchi: dove ogni linea attraversa la superficie (davanti pieni, dietro sbiaditi)
    DIR.forEach((d, i) => {
      const w = pesoLinea(i) * ks; if (w <= 0) return;
      const s = rho(d, R * P(t, 22.6, 23.4, E.out), kf), p = proietta(d, s), avanti = d[2] > 0;
      const inF = kw > 0 && avanti && dentro(d, R);
      ctx.save(); ctx.globalAlpha *= w * (avanti ? 1 : .3);
      ctx.fillStyle = css(inF ? mix(C.ink, C.g, kw) : C.ink);
      ctx.beginPath(); ctx.arc(p[0], p[1], inF ? 5.5 : avanti ? 4 : 3, 0, TAU); ctx.fill(); ctx.restore();
    });
    // il raggio
    const kr = life(t, 22.8, 49.8, .4, .4) + life(t, 54.9, 74.4, .4, .4) + life(t, 79.3, T_FINE + .1, .4, .4);
    if (kr > 0) {
      const a = Math.PI, e = [QC[0] + R * Math.cos(a), QC[1] - R * Math.sin(a)];
      ctx.save(); ctx.globalAlpha *= Math.min(1, kr); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.setLineDash([10, 7]);
      ctx.beginPath(); ctx.moveTo(QC[0] + RQ * Math.cos(a), QC[1] - RQ * Math.sin(a)); ctx.lineTo(e[0], e[1]); ctx.stroke(); ctx.restore();
      const n = R / R0, vicino = Math.abs(n - Math.round(n)) < .02, nome = t < 49.9 && Math.round(n) > 1 ? Math.round(n) + 'r' : 'r';
      const m = [QC[0] + (R + 46) * Math.cos(a), QC[1] - (R + 46) * Math.sin(a)];
      fondo(ctx, m[0], m[1], 66, 46, Math.min(1, kr) * (vicino ? 1 : 0));
      drawRich(ctx, '{mink:' + nome + '}', m[0], m[1], { size: 40, alpha: Math.min(1, kr) * (vicino ? 1 : 0) });
    }
    // il campo sulla sfera: perpendicolare e uguale ovunque (60 px per Q a questa distanza; doppio con 2Q)
    const kE = life(t, 54.9, 74.6, .4, .3) + life(t, 79.4, T_FINE + .1, .4, .4);
    if (kE > 0) for (let j = 0; j < 8; j++) {
      const a = (j + .5) / 8 * TAU, L = 60 * (1 + k2), u = [Math.cos(a), -Math.sin(a)];
      freccia(ctx, [QC[0] + u[0] * (R + 4), QC[1] + u[1] * (R + 4)], [QC[0] + u[0] * (R + 4 + L), QC[1] + u[1] * (R + 4 + L)], C.ink, Math.min(1, kE), 5);
    }
    // la finestra ingrandita, vista di fronte: i buchi si contano anche sul telefono
    const kw2 = Math.max(life(t, 31.6, 49.8, .4, .4), life(t, 59.7, 64.3, .4, .4)) * (1 - clamp(kf * 4));
    if (kw2 > 0) {
      const ca = cosFin(R), rw = R * Math.sqrt(1 - ca * ca), sc = RW / rw;   // la finestra (rw px sulla sfera) diventa larga RW
      const cw = proietta(UW, R), dx = IC[0] - cw[0], dy = IC[1] - cw[1], dl = Math.hypot(dx, dy);
      ctx.save(); ctx.globalAlpha *= kw2 * .7; ctx.strokeStyle = css(C.g); ctx.lineWidth = 2.5; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(cw[0] + dx / dl * 52, cw[1] + dy / dl * 52); ctx.lineTo(IC[0] - dx / dl * (RI + 4), IC[1] - dy / dl * (RI + 4)); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= kw2;
      ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(IC[0], IC[1], RI, 0, TAU); ctx.fill();
      ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(IC[0], IC[1], RI - 2, 0, TAU); ctx.clip();
      ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(IC[0], IC[1], RW, 0, TAU); ctx.stroke(); ctx.restore();   // il bordo sotto, i buchi sopra
      DIR.forEach((d, i) => {
        const w = pesoLinea(i); if (w <= 0 || d[0] * UW[0] + d[1] * UW[1] + d[2] * UW[2] <= 0) return;
        const q = [IC[0] + sc * R * (d[0] * T1[0] + d[1] * T1[1] + d[2] * T1[2]), IC[1] - sc * R * (d[0] * T2[0] + d[1] * T2[1] + d[2] * T2[2])];
        if (Math.hypot(q[0] - IC[0], q[1] - IC[1]) > RI + 10) return;
        const inF = dentro(d, R);
        ctx.save(); ctx.globalAlpha *= w * (inF ? 1 : .45); ctx.fillStyle = css(inF ? C.g : C.ink);
        ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, TAU); ctx.fill(); ctx.restore();
      });
      ctx.restore();
      fondo(ctx, IC[0] + 30, IC[1] + RI + 30, 160, 42, kw2); txt(ctx, 'ingrandita', IC[0] + 30, IC[1] + RI + 30, { size: 30, color: C.dim, alpha: kw2 });
    }
  }
  // l'etichetta della carica, sopra le linee e i buchi
  const kQ = P(t, 8.3, 8.8);
  fondo(ctx, QC[0] - 54, QC[1] - 52, 72, 48, kQ);
  drawRich(ctx, '{mink:Q}', QC[0] - 54, QC[1] - 52, { size: 42, alpha: kQ * (1 - k2) });
  drawRich(ctx, '{mink:2Q}', QC[0] - 54, QC[1] - 52, { size: 42, alpha: kQ * k2 });
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}
function scenePannello(ctx, t) {
  const cx = 1480;
  // 1 · il campo e le sfere
  const s1 = life(t, 7.9, 49.9, .5, .5);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    drawRich(ctx, '{mink:Q}{dim:: carica}', cx, 170, { size: 34, local: t - 8.0 });
    drawRich(ctx, '{mink:E}{dim: = forza / carica di prova}', cx, 222, { size: 34, local: t - 12.6 });
    drawRich(ctx, '{dim:superficie della sfera:} {mink:S} = 4π{mink:r²}', cx, 280, { size: 34, local: t - 27.5 });
    separa(ctx, 322, P(t, 31.6, 32.0));
    drawRich(ctx, '{dim:raggio}', 1300, 362, { size: 30, local: t - 31.7 });
    drawRich(ctx, '{dim:superficie}', 1480, 362, { size: 30, local: t - 31.7 });
    drawRich(ctx, '{dim:nella finestra}', 1665, 362, { size: 30, local: t - 31.7 });
    const righe = [[31.9, '{mink:r}', '{mink:S}', CONTI[0]], [37.9, '{mink:2r}', '{mink:4S}', CONTI[1]], [42.7, '{mink:3r}', '{mink:9S}', CONTI[2]]];
    righe.forEach(([ta, r, s, n], i) => {
      const y = 420 + 58 * i;
      drawRich(ctx, r, 1300, y, { size: 42, local: t - ta });
      drawRich(ctx, s, 1480, y, { size: 42, local: t - ta });
      const k = [1, 4, 9][i], rel = Math.abs(n - CONTI[0] / k) < 1e-9 ? ' = ' : ' ≈ ';   // il conteggio accanto al valore atteso
      drawRich(ctx, '{g:' + n + '}{dim:' + (i ? rel + CONTI[0] + '/' + k : ' linee') + '}', 1665, y, { size: 38, local: t - ta - .2 });
    });
    separa(ctx, 635, P(t, 45.3, 45.7));
    drawRich(ctx, '{dim:linee per m²:} 1, 1/4, 1/9', cx, 680, { size: 36, local: t - 45.4 });
    drawRich(ctx, '{mink:E} {dim:cala come} {g:1/}{mg:r²}', cx, 740, { size: 44, local: t - 46.0 });
    ctx.restore();
  }
  // 2 · il flusso e il teorema di Gauss
  const s2 = life(t, 50.0, T_FINE + .1, .5, .5);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'il flusso', cx, 165, { size: 40, weight: 600 }));
    drawRich(ctx, 'Φ = {mink:E}·{mink:S}', cx, 232, { size: 44, local: t - 50.1 });
    drawRich(ctx, '{dim:se} {mink:E} {dim:è perpendicolare e uniforme}', cx, 285, { size: 30, local: t - 50.5 });
    drawRich(ctx, '{dim:sfera:} Φ = {mink:E}·4π{mink:r²}', cx, 345, { size: 38, local: t - 55.0 });
    drawRich(ctx, '{mink:Q} {dim:doppia →} Φ {dim:doppio}', cx, 400, { size: 34, local: t - 59.8 });
    separa(ctx, 440, P(t, 64.3, 64.7));
    drawRich(ctx, '{g:Φ = }{mg:Q/ε₀}', cx, 498, { size: 60, local: t - 64.4 });
    drawRich(ctx, '{mink:ε₀} ≈ 8,85·10{mink:⁻¹²} C²/(N·m²)', cx, 556, { size: 34, local: t - 64.8 });
    drawRich(ctx, '{dim:Gauss: per ogni superficie chiusa}', cx, 610, { size: 30, local: t - 69.6 });
    separa(ctx, 652, P(t, 79.1, 79.5));
    const d1 = life(t, 79.2, 83.9, .4, .3), d2 = P(t, 83.8, 84.2);
    drawRich(ctx, '{mink:E}·4π{mink:r²} = {mink:Q}/{mink:ε₀}', cx, 712, { size: 44, alpha: d1 });
    drawRich(ctx, '{mg:E}{g: = }{mg:Q}{g:/(4π·}{mg:ε₀·r²}{g:)}', cx, 712, { size: 46, alpha: d2 * (1 - P(t, 88.3, 88.7)) });
    drawRich(ctx, '{mg:E}{g: = }{mg:k·Q/r²}', cx, 712, { size: 46, alpha: P(t, 88.6, 89.0) });
    drawRich(ctx, '{mink:k} = 1/(4π·{mink:ε₀}) ≈ 8,99·10{mink:⁹} N·m²/C²', cx, 762, { size: 30, local: t - 88.9 });
    ctx.restore();
  }
}

// in una frase (93,2–104,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.8, 103.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Le stesse linee su sfere più grandi:\nil campo cala come 1/r².', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'superficie della sfera\n4π{mink:r²}'], [960, 'teorema di Gauss\nΦ = {mink:Q}/{mink:ε₀}'], [1470, '{mink:E} = {mink:Q}/(4π·{mink:ε₀}·{mink:r²})\n{dim:il campo di una carica}']];
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
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 7.9, .6], ['pop', 12.6, .45],           // il titolo, la carica Q, il campo E
    ['traccia', 17.5, 19.2],                                                          // le linee di campo
    ['pop', 22.6, .5], ['pop', 27.5, .5],                                             // la sfera, S = 4πr²
    ['pop', 31.6, .6], ['pop', 32.1, .7],                                             // la finestra: 8 linee
    ['tono', 36.3, 37.8, [.4, .45, .55, .6]], ['pop', 38.1, .4],                      // raggio doppio: 2 linee
    ['tono', 41.1, 42.6, [.6, .65, .72, .75]], ['pop', 42.9, .25],                    // raggio triplo: 1 linea
    ['pop', 45.4, .45], ['ding', 46.0],                                               // E cala come 1/r²
    ['soffio', 50.0], ['tono', 49.9, 51.0, [.75, .6, .45, .4]], ['pop', 50.1, .5],    // il flusso; la sfera torna a r
    ['pop', 54.9, .6], ['pop', 59.8, .7],                                             // E sulla sfera; Q doppia, linee doppie
    ['pop', 69.6, .45],                                                               // ogni superficie chiusa
    ['tono', 74.6, 76.0, [.5, .6, .45, .55]], ['tono', 79.2, 80.2, [.55, .5]],        // la superficie si deforma, poi torna sfera
    ['pop', 79.2, .5], ['ding', 88.6],                                                // E·4πr² = Q/ε₀; E = k·Q/r²
    ['soffio', 93.4], ['pop', 95.4, .5], ['pop', 95.9, .6], ['pop', 96.4, .7],        // in una frase
  ];
  return {
    titolo: 'Le linee che si diradano', durata: 104.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 49.8, 'sfere sempre più grandi'], [49.8, T_FINE, 'il flusso e il teorema di Gauss']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneSfera(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
