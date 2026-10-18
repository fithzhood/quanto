'use strict';
/* Il giro attorno al filo — quanto «gira» B e quanto «esce». Un filo con la corrente che esce dallo schermo: linee di B
   circolari, a raggi in progressione geometrica (62, 100, 160, 256 px: più fitte vicino, perché B = μ₀·I/(2π·r)). Un punto
   fa il giro a piccoli passi e somma B lungo il cammino per il passo (prodotto scalare, integrato numericamente sul
   percorso vero): sul cerchio B·2π·r = μ₀·I e il raggio sparisce; su un giro storto che abbraccia il filo la somma è
   ancora μ₀·I; su un giro che non lo abbraccia è zero. Con tre fili (3 A che esce e 1 A che entra dentro il giro, 2 A che
   esce fuori) la somma è μ₀·(3 − 1) A: teorema di Ampère, segno con la mano destra (giro antiorario: chi esce dallo
   schermo conta col più). A 28,6 s un fermo immagine di 5,7 s per nominare μ₀: le scene girano sul tempo «u» senza la pausa.
   Il flusso di B (Gauss) sta nel video magnetismo/flusso.
   Colori fissi del magnetismo: campo B C.g, corrente C.v. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/ampere', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fmtN } = M;
  const TAU = Math.PI * 2;

const SH = 5.7, T_INS = 28.6, T_FINE = 82.4, TF_U = T_FINE - SH;
const tempoU = t => t < T_INS ? t : t < T_INS + SH ? T_INS : t - SH;   // il tempo delle scene, senza il fermo immagine
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.1, 'felice'], [20.4, 'neutro'],
  [28.7, 'pensa'], [34.6, 'neutro'], [45.0, 'felice'], [47.2, 'neutro'], [50.0, 'sorpreso'], [52.2, 'felice'],
  [55.4, 'neutro'], [60.8, 'pensa'], [64.1, 'sorpreso'], [66.2, 'neutro'], [76.8, 'festa'], [79.2, 'felice'],
  [84.8, 'felice'], [88.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Che cosa si scopre girando\nattorno a un filo?'],
  [7.9, 13.0, 'Un filo con corrente {mv:I} che esce\ndallo schermo: è il puntino.'],
  [13.1, 18.0, 'Le linee del campo {mg:B} sono\ncerchi chiusi attorno al filo.'],
  [18.1, 23.4, 'Il verso con la mano destra: pollice\ncome la corrente, le dita danno {mg:B}.'],
  [23.5, 28.6, 'Lontano il campo è più debole:\n{mg:B} = {mink:μ₀}·{mv:I}/({mink:2π·r}), dove…'],
  [28.7, 34.5, '…{mink:μ₀} = 4π·10⁻⁷ T·m/A è la\npermeabilità magnetica del vuoto.'],
  [34.6, 39.5, 'Faccio un giro chiuso lungo il cerchio\ndi raggio {mink:r}, a piccoli passi.'],
  [39.6, 44.9, 'A ogni passo moltiplico {mg:B} lungo\nil cammino per il passo, e sommo.'],
  [45.0, 49.9, 'La somma su tutto il giro è la\n{g:circuitazione} di {mg:B}.'],
  [50.0, 55.3, 'Sul cerchio: {mg:B}·{mink:2π·r} = {mink:μ₀}·{mv:I}.\nIl raggio {g:non conta}!'],
  [55.4, 60.7, 'Un giro storto, di forma qualunque:\nla somma fa ancora {mink:μ₀}·{mv:I}.'],
  [60.8, 66.1, 'Un giro che non abbraccia il filo:\ntanto sommo, tanto tolgo. Fa {g:zero}.'],
  [66.2, 71.3, 'Due fili dentro il giro, uno fuori:\nconta la corrente {g:abbracciata}…'],
  [71.4, 76.7, '…col segno, girando in senso antiorario:\nesce dallo schermo: più; entra: meno.'],
  [76.8, 82.1, 'È il {g:teorema di Ampère}: circuitazione\ndi {mg:B} = {mink:μ₀}·corrente abbracciata.'],
  [84.8, 91.0, 'Su qualunque giro chiuso, la circuitazione\ndi {mg:B} è {mink:μ₀} per la corrente abbracciata.'],
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
// la mano destra che stringe il filo (copiata da oersted.js): il pollice lungo la corrente, le dita chiuse girano come B
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
function manoPresa(ctx, cx, cy, s, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.scale(s, s);
  const colB = COL_B();
  ctx.save(); ctx.strokeStyle = css(colB); ctx.lineWidth = 4; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, Math.PI, TAU); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 215); ctx.lineTo(0, -190); ctx.stroke();
  arrowHead(ctx, [0, -208], -Math.PI / 2, C.v, 1.3);
  ctx.save(); ctx.strokeStyle = css(colB); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 150, 100, 30, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [6, 180], 0, colB, 1.1);
  ctx.save(); ctx.fillStyle = css(PELLE()); ctx.strokeStyle = css(BORDO_PELLE()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-112, -46, 82, 140, 26); ctx.fill(); ctx.stroke(); ctx.restore();
  fascia(ctx, [[-44, -34], [-26, -92], [-16, -128]], 26);
  for (let k = 0; k < 4; k++) {
    const y = -22 + k * 31;
    fascia(ctx, [[-60, y], [-20, y + 12], [20, y + 14], [46, y + 6], [56, y - 6]], 25);
  }
  ctx.restore();
}

// ---------- il filo, i giri, le somme ----------
// coordinate «di fisica» (x a destra, y in su) con l'origine sul filo; sullo schermo O = (610, 450)
const O = [610, 450];
const S_ = p => [O[0] + p[0], O[1] - p[1]];
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const RAGGI = [62, 100, 160, 256];                    // linee di B: passo geometrico (ogni raggio è 1,6 volte il precedente), più fitte vicino al filo
const UNO = [{ p: [0, 0], I: 1 }];                     // un filo, corrente in unità di I
const TRE = [{ p: [0, 0], I: 3 }, { p: [90, -110], I: -1 }, { p: [370, 220], I: 2 }];   // in ampere; + = esce dallo schermo
// B in unità di μ₀ (per ogni ampere): I/(2π·r), tangente al cerchio, verso antiorario se la corrente esce
function campo(fili, x, y) {
  let bx = 0, by = 0;
  fili.forEach(f => { const dx = x - f.p[0], dy = y - f.p[1], r2 = dx * dx + dy * dy; bx += f.I / TAU * (-dy) / r2; by += f.I / TAU * dx / r2; });
  return [bx, by];
}
// un giro chiuso (antiorario), con la somma progressiva di B·Δl (prodotto scalare, a passi piccoli)
function giro(forma, fili, n) {
  const pts = [], som = [0];
  for (let i = 0; i <= n; i++) pts.push(forma(i / n));
  for (let i = 1; i <= n; i++) {
    const a = pts[i - 1], b = pts[i], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], B = campo(fili, m[0], m[1]);
    som.push(som[i - 1] + B[0] * (b[0] - a[0]) + B[1] * (b[1] - a[1]));
  }
  return { pts, som, n };
}
const R1 = 200;
const G_CERCHIO = giro(s => [R1 * Math.cos(TAU * s), R1 * Math.sin(TAU * s)], UNO, 720);
const formaStorta = s => { const f = TAU * s, r = 235 + 55 * Math.sin(3 * f) + 30 * Math.cos(2 * f + 1); return [r * Math.cos(f), r * Math.sin(f)]; };
const G_STORTO = giro(formaStorta, UNO, 720);
const G_FUORI = giro(s => { const f = TAU * s, r = 105 + 18 * Math.sin(2 * f + .5); return [300 + r * Math.cos(f), 150 + r * Math.sin(f)]; }, UNO, 720);
const G_TRE = giro(formaStorta, TRE, 720);
const K_PX = 70 * TAU * R1;    // B del filo da solo a 200 px → freccia di 70 px
function disegnaGiro(ctx, G, k, al) {
  if (al <= 0) return;
  const P2 = G.pts.map(S_);
  ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
  ctx.beginPath(); P2.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
  const m = Math.round(k * G.n);
  if (m > 0) {
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
    ctx.beginPath(); for (let i = 0; i <= m; i++) i ? ctx.lineTo(P2[i][0], P2[i][1]) : ctx.moveTo(P2[i][0], P2[i][1]); ctx.stroke();
    // i passi: tacche ogni 1/24 di giro
    ctx.lineWidth = 3;
    for (let j = 30; j <= m; j += 30) {
      const a = P2[Math.max(0, j - 1)], b = P2[Math.min(G.n, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      ctx.beginPath(); ctx.moveTo(P2[j][0] - dy / l * 9, P2[j][1] + dx / l * 9); ctx.lineTo(P2[j][0] + dy / l * 9, P2[j][1] - dx / l * 9); ctx.stroke();
    }
  }
  ctx.restore();
}
// il punto che cammina: il passo (nero, lungo il cammino) e il campo B in quel punto (verde)
function camminatore(ctx, G, fili, k, al, scala) {
  if (al <= 0) return;
  const i = Math.min(G.n - 1, Math.round(k * G.n)), p = G.pts[i], q = G.pts[i + 1], p2 = S_(p);
  const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, B = campo(fili, p[0], p[1]);
  freccia(ctx, p2, S_([p[0] + B[0] * K_PX * scala, p[1] + B[1] * K_PX * scala]), COL_B(), al, 6);
  freccia(ctx, p2, S_([p[0] + dx / l * 48, p[1] + dy / l * 48]), C.ink, al, 4);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(p2[0], p2[1], 8, 0, TAU); ctx.fill(); ctx.restore();
}
const somma = (G, k) => G.som[Math.min(G.n, Math.round(k * G.n))];
// ---------- i tempi dei giri ----------
const kG1 = t => P(t, 29.3, 38.8, E.lin), kG2 = t => P(t, 50.1, 54.4, E.lin), kG3 = t => P(t, 55.5, 59.8, E.lin), kG4 = t => P(t, 61.2, 65.8, E.lin);

// ---------- la scheda grande ----------
function sceneFilo(ctx, t0) {
  const t = tempoU(t0);
  const al = life(t, 7.8, TF_U + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 6, CARTA[1] + 6, CARTA[2] - 12, CARTA[3] - 12); ctx.clip();
  // le linee di B: cerchi attorno al filo (spariscono mentre ci sono tre fili)
  const aC = Math.max(life(t, 13.2, 60.9, .5, .5), P(t, 71.2, 71.8) * life(t, 0, TF_U + .1, .1, .5));
  if (aC > 0) {
    ctx.save(); ctx.globalAlpha *= aC; ctx.strokeStyle = css(COL_B()); ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    RAGGI.forEach((r, i) => {
      const k = t > 60 ? 1 : P(t, 13.3 + i * .25, 14.4 + i * .25);
      if (k <= 0) return;
      ctx.beginPath(); ctx.arc(O[0], O[1], r, 0, -TAU * k, true); ctx.stroke();
    });
    ctx.restore();
    const kp = t > 60 ? 1 : P(t, 14.9, 15.3);
    RAGGI.forEach((r, i) => {
      const f = (100 + 40 * i) * Math.PI / 180, p = S_([r * Math.cos(f), r * Math.sin(f)]);
      ctx.save(); ctx.globalAlpha *= aC * kp; arrowHead(ctx, p, Math.atan2(-Math.cos(f), -Math.sin(f)), COL_B(), 1); ctx.restore();
    });
  }
  // il raggio r e il campo a due distanze (23,5–28,8)
  const kr = life(t, 23.6, 29.3, .4, .4);
  if (kr > 0) {
    const f = 215 * Math.PI / 180, u = [Math.cos(f), Math.sin(f)];
    tratteggio(ctx, S_([u[0] * 30, u[1] * 30]), S_([u[0] * 256, u[1] * 256]), C.ink, kr);
    const m = S_([u[0] * 200, u[1] * 200]);
    fondo(ctx, m[0] + 20, m[1] - 28, 36, 42, kr); drawRich(ctx, '{mink:r}', m[0] + 20, m[1] - 28, { size: 38, alpha: kr });
    for (const r of [100, 256]) {
      const p = [u[0] * r, u[1] * r], L = K_PX / (TAU * r);
      freccia(ctx, S_(p), S_([p[0] - u[1] * L, p[1] + u[0] * L]), COL_B(), kr, 6);
    }
  }
  // i giri
  const a1 = life(t, 29.0, 49.7, .4, .5);
  disegnaGiro(ctx, G_CERCHIO, kG1(t), a1); camminatore(ctx, G_CERCHIO, UNO, kG1(t), a1 * P(t, 29.0, 29.4) * (1 - P(t, 39.3, 39.7)), 1);
  const kr2 = life(t, 44.4, 49.7, .4, .4);
  if (kr2 > 0) {
    const f = -40 * Math.PI / 180, q = S_([R1 * Math.cos(f), R1 * Math.sin(f)]);
    tratteggio(ctx, O, q, C.ink, kr2);
    const m = [(O[0] + q[0]) / 2, (O[1] + q[1]) / 2];
    fondo(ctx, m[0] - 18, m[1] + 30, 36, 42, kr2); drawRich(ctx, '{mink:r}', m[0] - 18, m[1] + 30, { size: 38, alpha: kr2 });
  }
  const a2 = life(t, 49.8, 55.1, .4, .4);
  disegnaGiro(ctx, G_STORTO, kG2(t), a2); camminatore(ctx, G_STORTO, UNO, kG2(t), a2 * (1 - P(t, 54.6, 54.9)), 1);
  const a3 = life(t, 55.2, 60.5, .4, .4);
  disegnaGiro(ctx, G_FUORI, kG3(t), a3); camminatore(ctx, G_FUORI, UNO, kG3(t), a3 * (1 - P(t, 60.0, 60.3)), 1);
  const a4 = life(t, 60.6, 71.2, .4, .5);
  disegnaGiro(ctx, G_TRE, kG4(t), a4);
  // finito il giro, il suo verso (antiorario) resta segnato
  const kv = a4 * P(t, 65.9, 66.4);
  if (kv > 0) [120, 360, 600].forEach(i => { const a = S_(G_TRE.pts[i - 2]), b = S_(G_TRE.pts[i + 2]); ctx.save(); ctx.globalAlpha *= kv; arrowHead(ctx, S_(G_TRE.pts[i]), Math.atan2(b[1] - a[1], b[0] - a[0]), C.ink, 1.3); ctx.restore(); }); camminatore(ctx, G_TRE, TRE, kG4(t), a4 * P(t, 60.8, 61.2) * (1 - P(t, 66.0, 66.4)), 1 / 3);
  // i fili
  filoTaglio(ctx, O, 26, P(t, 8.4, 8.9), 0, P(t, 8.0, 8.5));
  const kI = P(t, 8.6, 9.1), k3 = life(t, 60.7, 71.2, .4, .5);
  fondo(ctx, O[0] + 50, O[1] - 46, 40, 44, kI * (1 - k3)); drawRich(ctx, '{mv:I}', O[0] + 50, O[1] - 46, { size: 40, alpha: kI * (1 - k3) });
  if (k3 > 0) {
    const w2 = S_(TRE[1].p), w3 = S_(TRE[2].p);
    filoTaglio(ctx, w2, 22, 0, 1, k3); filoTaglio(ctx, w3, 22, 1, 0, k3);
    for (const [p, s] of [[O, '3 A'], [w2, '1 A'], [w3, '2 A']]) { fondo(ctx, p[0] + 62, p[1] - 40, 74, 42, k3); txt(ctx, s, p[0] + 62, p[1] - 40, { size: 32, weight: 600, color: C.v, alpha: k3 }); }
  }
  ctx.restore();
}

// ---------- il pannello ----------
function riga(ctx, nome, val, y, al) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1205, y, { size: 32, align: 'left', alpha: al });
  drawRich(ctx, val, 1755, y, { size: 36, align: 'right', alpha: al });
}
function scenePannello(ctx, t0) {
  const t = tempoU(t0);
  const al = life(t, 7.9, TF_U + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const cx = 1480;
  // A · il simbolo, B, la mano destra (7,9–23,5)
  const kA = 1 - P(t, 23.4, 23.8);
  if (kA > 0) {
    ctx.save(); ctx.globalAlpha *= kA;
    const kg = P(t, 8.4, 8.9);
    filoTaglio(ctx, [1225, 170], 18, kg, 0, kg); drawRich(ctx, '{dim:la corrente esce dallo schermo}', 1260, 170, { size: 30, align: 'left', alpha: kg });
    drawRich(ctx, '{mg:B}{dim:: campo magnetico, in tesla (T)}', cx, 228, { size: 30, local: t - 13.2 });
    const km = P(t, 18.2, 18.7);
    if (km > 0) {
      separa(ctx, 270, km);
      manoPresa(ctx, 1480, 462, .72, km);
      drawRich(ctx, '{dim:pollice:} {v:la corrente}', cx, 672, { size: 30, alpha: km });
      drawRich(ctx, '{dim:dita:} {g:le linee di} {mg:B}', cx, 718, { size: 30, alpha: km });
    }
    ctx.restore();
  }
  // B · C · il campo del filo, la circuitazione, i giri (23,5–71)
  const kB = life(t, 23.6, TF_U + .1, .5, .5), kAlto = 1 - P(t, 70.9, 71.3);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    ctx.save(); ctx.globalAlpha *= kAlto;
    drawRich(ctx, '{mg:B} = {mink:μ₀}·{mv:I}/({mink:2π·r})', cx, 175, { size: 50, local: t - 23.7 });
    drawRich(ctx, '{mink:μ₀ = 4π·10⁻⁷} T·m/A', cx, 237, { size: 32, local: t - 24.6 });
    separa(ctx, 280, P(t, 29.0, 29.4));
    conFont(TITOLI, () => drawRich(ctx, '{g:circuitazione}', cx, 330, { size: 40, weight: 600, local: t - 39.4 }));
    drawRich(ctx, '{dim:somma di (}{mg:B}{dim: lungo il cammino)·passo}', cx, 385, { size: 30, local: t - 34.0 });
    // la somma del giro in corso
    let s = null, unit = '';
    if (t < 49.75) s = somma(G_CERCHIO, kG1(t)); else if (t < 55.15) s = somma(G_STORTO, kG2(t)); else if (t < 60.55) s = somma(G_FUORI, kG3(t)); else { s = somma(G_TRE, kG4(t)); unit = 'A'; }
    const ks = P(t, 29.3, 29.7);
    const sq = Math.abs(s) < .005 ? 0 : s;
    drawRich(ctx, unit ? '{dim:somma =} {mink:μ₀}·' + fmtN(sq, 2) + ' A' : '{dim:somma =} ' + fmtN(sq, 2) + ' · {mink:μ₀}·{mv:I}', cx, 445, { size: 42, alpha: ks });
    ctx.restore();
    separa(ctx, 495, P(t, 39.3, 39.7));
    riga(ctx, '{dim:cerchio}', '{mg:B}·{mink:2π·r} = {mink:μ₀}·{mv:I}', 545, P(t, 44.4, 44.9));
    riga(ctx, '{dim:giro storto}', '{mink:μ₀}·{mv:I}', 600, P(t, 54.5, 54.9));
    riga(ctx, '{dim:giro fuori dal filo}', '0', 655, P(t, 59.9, 60.3));
    riga(ctx, '{dim:tre fili}', '{mink:μ₀}·(3 − 1) A', 710, P(t, 66.1, 66.5));
    ctx.restore();
  }
  // D · il teorema (71,1–87)
  const kD = life(t, 71.2, TF_U + .1, .5, .5);
  if (kD > 0) {
    ctx.save(); ctx.globalAlpha *= kD;
    conFont(TITOLI, () => drawRich(ctx, '{g:teorema di Ampère}', cx, 190, { size: 44, weight: 600, local: t - 71.3 }));
    drawRich(ctx, '{dim:circuitazione di} {mg:B}', cx, 262, { size: 34, local: t - 71.8 });
    drawRich(ctx, '= {mink:μ₀}·{mv:I}{dim: abbracciata}', cx, 318, { size: 44, local: t - 72.3 });
    drawRich(ctx, '{dim:giro antiorario: chi esce dallo schermo +}', cx, 380, { size: 30, local: t - 72.8 });
    ctx.restore();
  }
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il giro attorno al filo', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, T_FINE + 9.4, T_FINE + 10.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il giro attorno alle correnti conta\nsolo la corrente che abbraccia.', W / 2, 290, { size: 64, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, '{dim:circuitazione di} {mg:B}\n= {mink:μ₀}·{mv:I}{dim: abbracciata}'], [960, '{dim:conta solo la corrente}\n{dim:dentro il giro, col segno}'], [1470, '{dim:la forma e la grandezza}\n{dim:del giro non contano}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 240, 445, 480, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py), nel tempo vero del video (dopo il fermo immagine le scene sono
  // indietro di SH = 5,7 s): durante i giri il tono segue la somma, da 0 (0) a μ₀·I (1); nel giro fuori dal filo da
  // −0,1 (0) a +0,1 (1); coi tre fili da 0 (0) a μ₀·2 A (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .45], ['pop', 8.7, .5],                             // il filo, la corrente
    ['traccia', 13.3, 15.1], ['pop', 15.0, .4],                                       // le linee di B, il verso
    ['pop', 18.3, .5],                                                                // la mano destra
    ['pop', 23.8, .55], ['pop', 24.7, .4],                                            // B = μ₀·I/(2π·r), μ₀
    ['pop', 34.8, .45], ['tono', 35.0, 44.5, [0, .2, .4, .6, .8, 1]],                 // il giro sul cerchio
    ['pop', 39.8, .4], ['ding', 44.6], ['pop', 45.1, .5],                             // la somma; la circuitazione
    ['traccia', 50.1, 50.5], ['pop', 50.2, .55],                                      // B·2π·r = μ₀·I: il raggio non conta
    ['tono', 55.8, 60.1, [0, .17, .33, .5, .67, .83, 1]], ['ding', 60.3],             // il giro storto: ancora μ₀·I
    ['tono', 61.2, 65.5, [.5, .66, .77, .81, .76, .46, .36, .41, .5]], ['ding', 65.7],   // il giro fuori dal filo: zero
    ['pop', 66.5, .5],                                                                // tre fili
    ['tono', 66.9, 71.5, [0, 0, .12, .26, .45, .66, .81, .9, 1]], ['ding', 71.9],     // μ₀·(3 − 1) A
    ['pop', 77.0, .6], ['pop', 78.0, .45],                                            // il teorema di Ampère
    ['soffio', 82.4], ['pop', 84.6, .5], ['pop', 85.1, .6], ['pop', 85.6, .7],        // in una frase
  ];
  return {
    titolo: 'Il giro attorno al filo', durata: 93.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.5, 'il campo del filo'], [34.5, T_FINE, 'il teorema di Ampère']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneFilo(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});


