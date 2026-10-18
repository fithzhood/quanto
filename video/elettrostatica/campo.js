'use strict';
/* Il campo elettrico — una piccola carica di prova q positiva saggia lo spazio attorno a una carica sorgente Q:
   la forza cambia da punto a punto, ma F/q no: è il campo E = F/q, in N/C. Frecce lunghe in proporzione al modulo
   (240 px a 140 px da Q, quindi 60 px a 280 px; con 2q la forza raddoppia). La carica di prova lasciata libera scappa
   con a ∝ 1/r² (integrata). Linee di campo della carica isolata (radiali) e del dipolo: queste calcolate integrando
   il campo vero (somma dei due campi 1/r²) col metodo di Runge-Kutta. Colori fissi dell'elettrostatica: cariche
   positive C.v, negative C.x, forze C.y, campo C.ink. Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/campo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;
  const TAU = Math.PI * 2;

const T_FINE = 92.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [21.4, 'pensa'], [25.3, 'neutro'],
  [30.1, 'felice'], [34.4, 'festa'], [39.3, 'sorpreso'], [43.8, 'neutro'], [53.0, 'felice'], [57.5, 'neutro'],
  [65.3, 'sorpreso'], [68.9, 'neutro'], [78.3, 'felice'], [82.8, 'neutro'], [87.1, 'pensa'], [91.0, 'neutro'],
  [94.2, 'felice'], [98.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Che cosa c’è nello spazio\nattorno a una carica?'],
  [7.9, 12.3, 'Una carica {mink:Q} positiva, ferma:\nè la carica {g:sorgente}.'],
  [12.4, 17.0, 'Ci metto una piccola carica {mink:q}\npositiva: la {g:carica di prova}.'],
  [17.1, 21.3, 'Sente una forza {my:F}\nsulla retta che parte da {mink:Q}.'],
  [21.4, 25.2, 'A distanza doppia,\nla forza è {g:un quarto}.'],
  [25.3, 30.0, 'Con una carica di prova doppia,\n2{mink:q}, la forza {g:raddoppia}…'],
  [30.1, 34.3, '…ma il rapporto {my:F}/{mink:q}\n{g:non cambia}.'],
  [34.4, 39.2, 'È il {g:campo elettrico}: {mink:E} = {my:F}/{mink:q},\nin newton al coulomb (N/C).'],
  [39.3, 43.7, 'Lascio libera la carica di prova:\nscappa via, sempre più veloce.'],
  [43.8, 48.4, 'Ma il campo resta: è una proprietà\ndello spazio attorno a {mink:Q}.'],
  [48.5, 52.9, 'Il campo in tanti punti: frecce\npiù lunghe vicino a {mink:Q}.'],
  [53.0, 57.4, 'Disegno linee che seguono le frecce:\nsono le {g:linee di campo}.'],
  [57.5, 61.6, 'Dove sono più fitte,\nil campo è più {g:intenso}.'],
  [61.7, 65.2, 'Escono dalle cariche\n{v:positive}…'],
  [65.3, 68.8, '…ed entrano nelle {x:negative}.'],
  [68.9, 73.5, 'Un {g:dipolo}: una carica positiva\ne una negativa, uguali e vicine.'],
  [73.6, 78.2, 'Il campo è la {g:somma} dei campi\ndelle due cariche.'],
  [78.3, 82.7, 'Le linee, calcolate punto per punto,\nvanno dalla {v:positiva} alla {x:negativa}.'],
  [82.8, 87.0, 'In ogni punto il campo è\n{g:tangente} alla linea.'],
  [87.1, 91.7, 'Le linee non si incrociano mai:\nil campo ha una sola direzione.'],
  [94.2, 100.6, 'Il campo è la forza su ogni coulomb:\n{mink:E} = {my:F}/{mink:q}, punto per punto.'],
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
// una linea di campo: spezzata disegnata fino alla frazione k, con una punta a metà nel verso del campo (verso = ±1)
function lineaCampo(ctx, pts, k, al, verso = 1, w = 3) {
  if (k <= 0 || al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(mix(C.ink, C.paper, .4)); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.max(2, Math.round(pts.length * k));
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
  const im = Math.floor(pts.length * .5);
  if (n > im + 1 && Math.abs(verso) > .05) {
    const a = pts[im - 1], b = pts[im + 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + (verso < 0 ? Math.PI : 0);
    arrowHead(ctx, pts[im], ang, mix(C.ink, C.paper, .15), Math.abs(verso) * .95);
  }
  ctx.restore();
}

// ---------- la carica sorgente e la carica di prova ----------
const CARTA = [110, 110, 1000, 680];
const QC = [610, 450], RQ = 36;
const U = [Math.cos(-25 * Math.PI / 180), Math.sin(-25 * Math.PI / 180)], NU = [-U[1], U[0]];   // verso la carica di prova, e di lato
const RA = 140, RB = 280, LA = 240;            // a 140 px la forza su q è 240 px: L = LA·(RA/r)²·(q in unità di q)
const lungF = (r, nq) => LA * (RA / r) ** 2 * nq;
const T_LIBERA = 39.6;
// lasciata libera da ferma a RB: r'' = A/r², integrata (A scelto perché esca dalla scheda, a 560 px, dopo 2,4 s)
const VOLO = (() => {
  const corsa = (A, durata) => { let r = RB, v = 0, t = 0; const dt = 1 / 480, tab = [r]; while (t < durata) { for (let i = 0; i < 2; i++) { const a = A / (r * r); v += a * dt; r += v * dt; t += dt; } tab.push(r); } return tab; };
  const A1 = 1e6, prova = corsa(A1, 60), t1 = prova.findIndex(r => r >= 560) / 240;   // con A1 arriva a 560 px in t1 secondi
  const A = A1 * (t1 / 2.4) ** 2;                                                     // i tempi vanno come 1/√A
  return corsa(A, 5);   // un valore ogni 1/240 s
})();
const rLibera = tau => { const i = clamp(tau * 240, 0, VOLO.length - 1), i0 = Math.floor(i), i1 = Math.min(VOLO.length - 1, i0 + 1); return lerp(VOLO[i0], VOLO[i1], i - i0); };
function raggioProva(t) {
  if (t < T_LIBERA) return RA + (RB - RA) * P(t, 21.6, 22.6);
  return rLibera(t - T_LIBERA);
}
const nProva = t => 1 + P(t, 25.4, 25.9);
const punto = r => [QC[0] + U[0] * r, QC[1] + U[1] * r];
const lineeSole = Array.from({ length: 16 }, (_, k) => {   // linee radiali, fino al bordo della scheda
  const a = k * Math.PI / 8, pts = [];
  for (let r = RQ + 4; ; r += 4) { const x = QC[0] + r * Math.cos(a), y = QC[1] + r * Math.sin(a); if (x < 125 || x > 1095 || y < 125 || y > 775) break; pts.push([x, y]); }
  return pts;
});
// le frecce del campo su una griglia: solo dove la freccia non supera i 100 px (r ≥ 220)
const GRIGLIA = [];
for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) {
  const x = QC[0] + i * 112, y = QC[1] + j * 102, r = Math.hypot(x - QC[0], y - QC[1]);
  const L = r ? lungF(r, 1) : 0, tx = x + (x - QC[0]) / r * L, ty = y + (y - QC[1]) / r * L;   // anche la punta dentro la scheda
  if (r >= 220 && tx > 128 && tx < 1092 && ty > 128 && ty < 772) GRIGLIA.push([x, y, r]);
}

// ---------- il dipolo ----------
const PP = [430, 450], PM = [790, 450], RD = 30;
function campoDip(x, y) {
  let ex = 0, ey = 0;
  for (const [c, q] of [[PP, 1], [PM, -1]]) { const dx = x - c[0], dy = y - c[1], r2 = dx * dx + dy * dy, r = Math.sqrt(r2); ex += q * dx / (r2 * r); ey += q * dy / (r2 * r); }
  return [ex, ey];
}
const LINEE_DIP = (() => {
  const dir = (x, y) => { const [ex, ey] = campoDip(x, y), l = Math.hypot(ex, ey); return [ex / l, ey / l]; };
  const out = [];
  for (let k = 0; k < 16; k++) {
    const a = k * Math.PI / 8; let x = PP[0] + (RD + 2) * Math.cos(a), y = PP[1] + (RD + 2) * Math.sin(a);
    const pts = [[x, y]]; let esce = false;
    for (let i = 0; i < 3000; i++) {   // Runge-Kutta sul verso del campo, passo 2 px
      const h = 2, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      pts.push([x, y]);
      if (Math.hypot(x - PM[0], y - PM[1]) < RD + 2) break;
      if (x < 125 || x > 1095 || y < 125 || y > 775) { esce = true; break; }
    }
    out.push({ pts, verso: 1, k });
    // per simmetria, la linea che esce dalla scheda ha una gemella speculare che entra nella negativa (percorsa al contrario)
    if (esce) out.push({ pts: pts.map(([px, py]) => [PP[0] + PM[0] - px, py]).reverse(), verso: 1, k: -k });
  }
  return out;
})();
// il punto P: dove la linea che parte verso l'alto a destra (k = 13) passa a metà strada; e un secondo punto, sulla linea
// speculare sotto l'asse (k = 3), dove il campo è obliquo
const LINEA_P = LINEE_DIP.find(l => l.k === 13).pts;
const PUNTO_P = LINEA_P.find((p, i) => i && (LINEA_P[i - 1][0] - 610) * (p[0] - 610) <= 0);
const LINEA_P2 = LINEE_DIP.find(l => l.k === 3).pts;   // la gemella sotto l'asse, lontana da P e dalle sue etichette
const PUNTO_P2 = LINEA_P2.find((p, i) => i && (LINEA_P2[i - 1][0] - 660) * (p[0] - 660) <= 0);
const SCALA_DIP = 85 * ((PUNTO_P[0] - PP[0]) ** 2 + (PUNTO_P[1] - PP[1]) ** 2);   // il campo del + in P è lungo 85 px
function campoDipPx(p) { const [ex, ey] = campoDip(p[0], p[1]); return [ex * SCALA_DIP, ey * SCALA_DIP]; }

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il campo elettrico', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–2 · la carica sorgente, la carica di prova, il campo, le linee (7,5–68,9)
function sceneSorgente(ctx, t) {
  const al = life(t, 7.8, 69.4, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const kNeg = P(t, 65.4, 66.0);
  // le linee di campo radiali
  const kl = P(t, 53.2, 54.6), verso = lerp(1, -1, kNeg);
  if (kl > 0) lineeSole.forEach(pts => lineaCampo(ctx, pts, kl, 1, verso));
  // più fitte vicino, più rade lontano: due archi lunghi uguali (130 px), centrati sulla linea orizzontale
  const kf2 = life(t, 57.6, 61.7, .4, .4);
  if (kf2 > 0) {
    ctx.save(); ctx.globalAlpha *= kf2; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const r of [110, 400]) { const h = 65 / r; ctx.beginPath(); ctx.arc(QC[0], QC[1], r, -h, h); ctx.stroke(); }
    ctx.restore();
    fondo(ctx, QC[0] + 150, QC[1] - 112, 170, 44, kf2); drawRich(ctx, '{g:più fitte}', QC[0] + 150, QC[1] - 112, { size: 32, alpha: kf2 });
    fondo(ctx, QC[0] + 400, QC[1] - 112, 170, 44, kf2); drawRich(ctx, '{g:più rade}', QC[0] + 400, QC[1] - 112, { size: 32, alpha: kf2 });
  }
  // le distanze r e 2r
  const kd = life(t, 21.5, 25.3, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2.5; ctx.setLineDash([8, 9]);
    for (const r of [RA, RB]) { ctx.beginPath(); ctx.arc(QC[0], QC[1], r, 0, TAU); ctx.stroke(); }
    ctx.restore();
    const a = 200 * Math.PI / 180;
    for (const [r, s] of [[RA, 'r'], [RB, '2r']]) { const p = [QC[0] + r * Math.cos(a), QC[1] + r * Math.sin(a)]; fondo(ctx, p[0], p[1], 64, 44, kd); drawRich(ctx, '{mink:' + s + '}', p[0], p[1], { size: 40, alpha: kd }); }
  }
  // il campo in tanti punti
  const kg = life(t, 48.6, 53.6, .3, .6);
  if (kg > 0) GRIGLIA.forEach(([x, y, r]) => {
    const L = lungF(r, 1), k = kg * P(t, 48.6 + (r - 220) / 900, 49.2 + (r - 220) / 900);
    freccia(ctx, [x, y], [x + (x - QC[0]) / r * L, y + (y - QC[1]) / r * L], C.ink, k, 4);
  });
  // la carica sorgente
  carica(ctx, QC, 1, RQ, 1 - kNeg, P(t, 7.9, 8.5, E.back));
  if (kNeg > 0) carica(ctx, QC, -1, RQ, kNeg);
  // l'etichetta di Q: fra le linee di campo a 225° e a 247,5° (a 125 px dal centro, 24 px da ciascuna)
  const aQ = 236.25 * Math.PI / 180, pQ = [QC[0] + 125 * Math.cos(aQ), QC[1] + 125 * Math.sin(aQ)];
  fondo(ctx, pQ[0], pQ[1], 36, 38, P(t, 8.3, 8.8)); drawRich(ctx, '{mink:Q}', pQ[0], pQ[1], { size: 44, alpha: P(t, 8.3, 8.8) });
  // la carica di prova e la forza su di lei
  const kq = P(t, 12.6, 13.1, E.back) * (t < T_LIBERA + 4 ? 1 : 0);
  const r = raggioProva(t), nq = nProva(t), pq = punto(r), rq = 15 * Math.sqrt(nq);
  if (kq > 0 && r < 620) {
    const kF = P(t, 17.2, 17.7) * (1 - P(t, T_LIBERA, T_LIBERA + .3));
    if (kF > 0) {
      const L = lungF(r, nq), a = punto(r + rq + 2), b = punto(r + rq + 2 + L);
      freccia(ctx, a, b, C.y, kF, 6);
      const m = punto(r + rq + 2 + Math.max(L, 40) / 2);
      drawRich(ctx, '{my:F}', m[0] - NU[0] * 34, m[1] - NU[1] * 34, { size: 38, alpha: kF });
    }
    carica(ctx, pq, 1, rq, 1, kq);
    const kl1 = 1 - P(t, 25.4, 25.9), kl2 = P(t, 25.4, 25.9);
    const pl = [pq[0] + NU[0] * 54, pq[1] + NU[1] * 54], ka = P(t, 12.8, 13.3) * (1 - P(t, T_LIBERA + .2, T_LIBERA + .6));
    drawRich(ctx, '{mink:q}', pl[0], pl[1], { size: 40, alpha: ka * kl1 });
    drawRich(ctx, '{mink:2q}', pl[0], pl[1], { size: 40, alpha: ka * kl2 });
  }
  // il campo nel punto dove stava la carica di prova: compare quando lei se n'è andata, perché resta anche senza di lei
  const kE = P(t, 43.9, 44.4) * (1 - P(t, 48.5, 49.0));
  if (kE > 0) {
    const pB = punto(RB);
    freccia(ctx, pB, punto(RB + lungF(RB, 1)), C.ink, kE, 6);
    ctx.save(); ctx.globalAlpha *= kE; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(pB[0], pB[1], 6, 0, TAU); ctx.fill(); ctx.restore();
    const m = punto(RB + 30);
    drawRich(ctx, '{mink:E}', m[0] - NU[0] * 34, m[1] - NU[1] * 34, { size: 40, alpha: kE });
  }
  ctx.restore();
}

// 3 · il dipolo (68,9–92)
function sceneDipolo(ctx, t) {
  const al = life(t, 69.0, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // le linee calcolate; quella per P più marcata quando si parla di tangente
  const kl = P(t, 78.5, 80.3), kT = P(t, 82.9, 83.4);
  const k2T = P(t, 83.4, 83.9);
  LINEE_DIP.forEach(l => lineaCampo(ctx, l.pts, kl, 1, l.verso, l.k === 13 ? lerp(3, 5, kT) : l.k === 3 ? lerp(3, 5, k2T) : 3));
  carica(ctx, PP, 1, RD, 1, P(t, 69.1, 69.7, E.back));
  carica(ctx, PM, -1, RD, 1, P(t, 69.5, 70.1, E.back));
  // il punto P: i due campi e la loro somma
  const kP = P(t, 73.8, 74.3);
  if (kP > 0) {
    const [ex, ey] = campoDipPx(PUNTO_P);
    const dp = [PUNTO_P[0] - PP[0], PUNTO_P[1] - PP[1]], r1 = Math.hypot(...dp), e1 = [dp[0] / r1 * SCALA_DIP / r1 ** 2, dp[1] / r1 * SCALA_DIP / r1 ** 2];
    const e2 = [ex - e1[0], ey - e1[1]];
    const kParz = kP * (1 - P(t, 78.3, 78.8));
    const tip1 = [PUNTO_P[0] + e1[0], PUNTO_P[1] + e1[1]], tip2 = [PUNTO_P[0] + e2[0], PUNTO_P[1] + e2[1]], tipS = [PUNTO_P[0] + ex, PUNTO_P[1] + ey];
    if (kParz > 0) {
      freccia(ctx, PUNTO_P, tip1, mix(C.ink, C.paper, .45), kParz, 4);
      freccia(ctx, PUNTO_P, tip2, mix(C.ink, C.paper, .45), kParz, 4);
      dashed(ctx, tip1, tipS, C.dim, P(t, 74.6, 75.2), kParz * .8); dashed(ctx, tip2, tipS, C.dim, P(t, 74.6, 75.2), kParz * .8);
      txt(ctx, 'campo del +', tip1[0] - 10, tip1[1] - 30, { size: 30, color: C.dim, alpha: kParz });
      txt(ctx, 'campo del −', tip2[0] - 10, tip2[1] + 32, { size: 30, color: C.dim, alpha: kParz });
    }
    freccia(ctx, PUNTO_P, tipS, C.ink, P(t, 75.2, 75.7), 6);
    ctx.save(); ctx.globalAlpha *= kP; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(PUNTO_P[0], PUNTO_P[1], 7, 0, TAU); ctx.fill(); ctx.restore();
    fondo(ctx, PUNTO_P[0] - 40, PUNTO_P[1] - 34, 48, 46, kP); drawRich(ctx, '{mink:P}', PUNTO_P[0] - 40, PUNTO_P[1] - 34, { size: 40, alpha: kP });
    fondo(ctx, tipS[0] + 34, tipS[1] - 2, 48, 46, P(t, 75.4, 75.9)); drawRich(ctx, '{mink:E}', tipS[0] + 34, tipS[1] - 2, { size: 40, alpha: P(t, 75.4, 75.9) });
    // un secondo punto, su un'altra linea: anche lì il campo è tangente
    const k2 = P(t, 83.4, 83.9);
    if (k2 > 0) {
      const [fx, fy] = campoDipPx(PUNTO_P2);
      freccia(ctx, PUNTO_P2, [PUNTO_P2[0] + fx, PUNTO_P2[1] + fy], C.ink, k2, 6);
      ctx.save(); ctx.globalAlpha *= k2; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(PUNTO_P2[0], PUNTO_P2[1], 7, 0, TAU); ctx.fill(); ctx.restore();
    }
  }
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
function scenePannello(ctx, t) {
  const cx = 1480;
  // 1 · la carica di prova e il campo
  const s1 = life(t, 7.9, 53.4, .5, .5);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    drawRich(ctx, '{mink:Q}{dim:: carica sorgente}', cx, 180, { size: 36, local: t - 8.0 });
    drawRich(ctx, '{mink:q}{dim:: carica di prova,}', cx, 245, { size: 36, local: t - 12.6 });
    drawRich(ctx, '{dim:piccola e positiva}', cx, 292, { size: 34, local: t - 13.0 });
    separa(ctx, 340, P(t, 25.3, 25.7));
    drawRich(ctx, '{dim:carica}', 1290, 385, { size: 30, local: t - 25.4 });
    drawRich(ctx, '{dim:forza}', 1480, 385, { size: 30, local: t - 25.4 });
    drawRich(ctx, '{dim:forza / carica}', 1665, 385, { size: 30, local: t - 25.4 });
    drawRich(ctx, '{mink:q}', 1290, 440, { size: 42, local: t - 25.5 });
    drawRich(ctx, '{my:F}', 1480, 440, { size: 42, local: t - 25.5 });
    drawRich(ctx, '{mink:2q}', 1290, 500, { size: 42, local: t - 25.9 });
    drawRich(ctx, '{my:2F}', 1480, 500, { size: 42, local: t - 25.9 });
    const kr = P(t, 30.2, 30.7);
    drawRich(ctx, '{my:F}/{mink:q}', 1665, 440, { size: 42, alpha: kr });
    drawRich(ctx, '{my:2F}/{mink:2q} {g:=} {my:F}/{mink:q}', 1665, 500, { size: 36, alpha: P(t, 30.6, 31.1) });
    separa(ctx, 550, P(t, 34.4, 34.8));
    drawRich(ctx, '{mink:E} = {my:F}/{mink:q}', cx, 625, { size: 66, local: t - 34.5 });
    drawRich(ctx, '{dim:campo elettrico, in N/C}', cx, 705, { size: 34, local: t - 35.2 });
    ctx.restore();
  }
  // 2 · le linee di campo
  const s2 = life(t, 53.2, T_FINE + .1, .5, .5);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'linee di campo', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:più} {g:fitte}{dim: dove il campo}', cx, 250, { size: 34, local: t - 57.6 });
    drawRich(ctx, '{dim:è più intenso}', cx, 295, { size: 34, local: t - 57.9 });
    drawRich(ctx, '{dim:escono dalle} {v:positive}', cx, 360, { size: 34, local: t - 61.8 });
    drawRich(ctx, '{dim:entrano nelle} {x:negative}', cx, 410, { size: 34, local: t - 65.4 });
    separa(ctx, 455, P(t, 69.0, 69.4));
    drawRich(ctx, '{dim:dipolo:} {v:+}{mink:q} {dim:e} {x:−}{mink:q}{dim:, vicine}', cx, 505, { size: 34, local: t - 69.1 });
    drawRich(ctx, '{mink:E} {dim:= somma dei due campi}', cx, 565, { size: 34, local: t - 73.8 });
    drawRich(ctx, '{mink:E} {dim:è} {g:tangente} {dim:alla linea}', cx, 625, { size: 34, local: t - 82.9 });
    drawRich(ctx, '{dim:due linee} {g:non si incrociano}', cx, 685, { size: 34, local: t - 87.2 });
    ctx.restore();
  }
}

// in una frase (92–103,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 101.8, 102.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il campo elettrico è la forza\nsu ogni coulomb, punto per punto.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{mink:E} = {my:F}/{mink:q}{dim:, in N/C}\n{dim:con} {mink:q} {dim:carica di prova}'], [960, 'le linee escono dal {v:+}\ned entrano nel {x:−}'], [1470, 'più {g:fitte}\ndove il campo è più intenso']];
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
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 7.9, .6],                               // il titolo, la carica sorgente Q
    ['pop', 12.6, .5], ['pop', 17.2, .45],                                            // la carica di prova q, la forza F
    ['tono', 21.6, 22.6, [.4, .47, .55, .6]],                                         // a distanza doppia
    ['pop', 25.4, .55], ['pop', 25.9, .6],                                            // 2q, 2F
    ['pop', 30.2, .5], ['ding', 30.6],                                                // F/q non cambia
    ['pop', 34.6, .7],                                                                // E = F/q
    ['tono', 39.6, 42.0, [.6, .61, .64, .69, .75, .82, .9]],                          // libera: scappa sempre più veloce
    ['pop', 43.9, .6],                                                                // il campo resta
    ['tono', 48.6, 49.6, [.8, .6, .45, .3]],                                          // le frecce del campo, da vicino a lontano
    ['soffio', 53.2], ['traccia', 53.2, 54.6],                                        // le linee di campo
    ['pop', 57.6, .5], ['pop', 61.8, .6], ['pop', 65.4, .25],                         // più fitte; escono dal +, entrano nel −
    ['soffio', 69.0], ['pop', 69.1, .6], ['pop', 69.5, .3],                           // il dipolo
    ['pop', 73.8, .5], ['traccia', 74.6, 75.2], ['pop', 75.2, .6],                    // in P: la somma dei due campi
    ['traccia', 78.5, 80.3],                                                          // le linee calcolate
    ['pop', 82.9, .5], ['pop', 83.4, .45], ['pop', 87.2, .5],                         // tangente; non si incrociano
    ['soffio', 92.2], ['pop', 94.2, .5], ['pop', 94.7, .6], ['pop', 95.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il campo elettrico', durata: 103.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 52.9, 'la carica di prova'], [52.9, 68.8, 'le linee di campo'], [68.8, T_FINE, 'il dipolo']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneSorgente(ctx, t); sceneDipolo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
