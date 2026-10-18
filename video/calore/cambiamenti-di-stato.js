'use strict';
/* Il ghiaccio che resta a 0 °C — la curva di riscaldamento di 1 kg d'acqua da −30 °C a 130 °C, disegnata in scala
   sull'energia fornita, con un fornello davvero costante: i tempi sono proporzionali all'energia (l'ebollizione dura
   quasi 7 volte la fusione); i fermi immagine sono dichiarati. Nei cambiamenti di stato la temperatura sta ferma;
   il calore latente Q = m·L. Argomento: calore. */
CVIDEO.registra('calore/cambiamenti-di-stato', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [94.4, 190], [95.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [94.4, 1050], [95.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [94.4, 2.2], [95.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [94.4, 2], [95.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [94.4, -1.5], [95.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'freddo'], [12.6, 'neutro'], [20.8, 'pensa'],
  [24.8, 'sorpreso'], [27.0, 'neutro'], [34.4, 'felice'], [36.6, 'neutro'], [43.6, 'sorpreso'], [45.8, 'neutro'],
  [52.6, 'sorpreso'], [54.8, 'neutro'], [62.6, 'felice'], [64.8, 'neutro'], [85.8, 'festa'], [88.0, 'neutro'], [96.8, 'felice'],
];
const FUMETTI = [
  [2.5, 6.4, 'Scaldo del ghiaccio.\nLa temperatura sale sempre?'],
  [7.9, 12.4, '1 kg di ghiaccio a −30 °C\nsu un fornello sempre uguale.'],
  [12.6, 16.7, 'In basso l’energia fornita,\na sinistra la temperatura.'],
  [16.9, 20.6, 'Il ghiaccio si scalda:\nla temperatura sale.'],
  [20.8, 24.6, 'A 0 °C comincia a fondere…'],
  [24.8, 29.4, '…e la temperatura sta {g:ferma},\nanche se il fornello scalda!'],
  [29.6, 34.2, 'L’energia serve a rompere i legami\nfra le particelle del ghiaccio.'],
  [34.4, 38.6, 'Tutto fuso: ora l’acqua si scalda,\nma più piano.'],
  [38.8, 43.4, 'L’acqua vuole più energia per grado:\nla salita è meno ripida.'],
  [43.6, 47.8, 'A 100 °C bolle: di nuovo\nla temperatura sta {g:ferma}.'],
  [48.0, 52.4, 'E il tratto è molto più lungo:\nevaporare costa tanta energia.'],
  [52.6, 57.0, 'Stesso fornello: bolle quasi\n7 volte il tempo della fusione.'],
  [57.2, 62.4, 'Le bolle sono vapore: l’energia\nstacca le particelle dell’acqua.'],
  [62.6, 66.8, 'Tutto vapore: ora sale ancora,\nripido come per il ghiaccio.'],
  [67.0, 71.4, 'L’energia dei tratti piatti\nè il {v:calore latente}.'],
  [71.6, 76.4, 'Vale {mg:Q}{mink: = m·}{mv:L}: {mg:Q} energia fornita,\n{mink:m} massa, {mv:L} in J/kg.'],
  [76.6, 81.0, 'Fondere 1 kg di ghiaccio:\n{mv:L} ≈ 334 000 J/kg.'],
  [81.2, 85.6, 'Far evaporare 1 kg d’acqua:\n{mv:L} ≈ 2 260 000 J/kg.'],
  [85.8, 89.4, 'Quasi sette volte tanto!'],
  [89.6, 94.0, 'Il vapore che condensa\nrestituisce la stessa energia.'],
  [96.8, 102.0, 'A pressione costante, mentre cambia\nstato la temperatura resta ferma.'],
];

// ---------- la fisica: 1 kg, a pressione atmosferica ----------
const C_GH = 2100, C_AC = 4186, C_VA = 2000, L_F = 334000, L_V = 2260000;
const E1 = C_GH * 30, E2 = E1 + L_F, E3 = E2 + C_AC * 100, E4 = E3 + L_V, E5 = E4 + C_VA * 30;   // 63 000 … 3 135 600 J
const temp = q => q < E1 ? -30 + q / C_GH : q < E2 ? 0 : q < E3 ? (q - E2) / C_AC : q < E4 ? 100 : 100 + (q - E4) / C_VA;
// il fornello dà sempre 120 000 J al secondo: ogni tratto dura in proporzione alla sua energia
// (ghiaccio 0,5 s, fusione 2,8 s in tre pezzi, acqua 3,5 s, ebollizione 18,8 s, vapore 0,5 s);
// fra un pezzo e l'altro il video si ferma (fermo immagine dichiarato) mentre Stilla parla
const R = 120000, T_ON = 17.0;
const QK = [[17.0, 0], [17.0 + E1 / R, E1], [20.9, E1], [22.3, E1 + 1.4 * R], [25.0, E1 + 1.4 * R], [25.8, E1 + 2.2 * R],
  [34.4, E1 + 2.2 * R], [34.4 + (E2 - E1 - 2.2 * R) / R, E2], [34.4 + (E3 - E1 - 2.2 * R) / R, E3],
  [43.7, E3], [43.7 + L_V / R, E4], [43.7 + (E5 - E3) / R, E5]];
const T_OFF = QK[QK.length - 1][0];   // ≈ 63,03 s: tutto vapore, il fornello si spegne
function qAt(t) {
  if (t <= QK[0][0]) return 0;
  for (let i = 1; i < QK.length; i++) if (t <= QK[i][0]) return lerp(QK[i - 1][1], QK[i][1], (t - QK[i - 1][0]) / (QK[i][0] - QK[i - 1][0]));
  return E5;
}
// l'orologio della pentola: scorre solo mentre l'energia arriva (nei fermi immagine bolle e fiamma stanno ferme)
const tPentola = t => t < T_ON ? t : t < T_OFF ? T_ON + qAt(t) / R : t - T_OFF + T_ON + E5 / R;
const fermo = t => t > T_ON && t < T_OFF && !QK.some((k, i) => i && k[1] !== QK[i - 1][1] && t > QK[i - 1][0] && t < k[0]);

// ---------- aiutanti ----------
const h = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
const milioni = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const segno = v => (v < -.5 ? '−' : '') + Math.abs(Math.round(v));
const titolo = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function graffa(ctx, x0, x1, y, su, col) {   // una parentesi graffa orizzontale
  const d = su ? -14 : 14, m = (x0 + x1) / 2;
  ctx.strokeStyle = css(col); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(x0, y + d, x0 + 12, y + d); ctx.lineTo(m - 12, y + d); ctx.quadraticCurveTo(m, y + d, m, y + 2 * d);
  ctx.quadraticCurveTo(m, y + d, m + 12, y + d); ctx.lineTo(x1 - 12, y + d); ctx.quadraticCurveTo(x1, y + d, x1, y); ctx.stroke();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Il ghiaccio che resta a 0 °C', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · la curva di riscaldamento, in scala: 1070 px per 3,2 milioni di joule, 2,56 px per grado
const GX = q => 230 + q * 1070 / 3.2e6, GY = c => 650 - (c + 30) * 410 / 160;
function scenaCurva(ctx, t) {
  if (t < 7.5 || t > 94.6) return;
  const al = P(t, 7.6, 8.3) * (1 - P(t, 93.8, 94.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1260, 650);
  titolo(ctx, 'la curva di riscaldamento', 740, 152);
  drawRich(ctx, '{dim:1 kg d’acqua, a pressione atmosferica; l’energia è in scala}', 740, 194, { size: 30 });
  // il fermo immagine si dichiara
  const kfi = fermo(t) ? 1 : 0;
  if (kfi) {
    ctx.fillStyle = css(C.dim); ctx.fillRect(1078, 240, 7, 26); ctx.fillRect(1091, 240, 7, 26);
    txt(ctx, 'fermo immagine', 1110, 254, { size: 30, weight: 600, color: C.dim, align: 'left' });
  }
  // gli assi
  const ka = P(t, 12.6, 13.2);
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let c = -20; c <= 120; c += 20) { ctx.beginPath(); ctx.moveTo(GX(0), GY(c)); ctx.lineTo(GX(3.2e6), GY(c)); ctx.stroke(); }
  for (const q of [1e6, 2e6, 3e6]) { ctx.beginPath(); ctx.moveTo(GX(q), GY(-30)); ctx.lineTo(GX(q), GY(120)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX(0), GY(-30)); ctx.lineTo(GX(3.27e6), GY(-30)); ctx.moveTo(GX(0), GY(-30)); ctx.lineTo(GX(0), GY(137)); ctx.stroke();
  arrowHead(ctx, [GX(3.27e6) + 6, GY(-30)], 0, C.ink); arrowHead(ctx, [GX(0), GY(137) - 6], -Math.PI / 2, C.ink);
  for (let c = -20; c <= 120; c += 20) {
    const forte = c === 0 || c === 100;
    txt(ctx, segno(c), GX(0) - 14, GY(c), { size: forte ? 32 : 30, weight: forte ? 600 : 500, color: forte ? C.v : C.dim, align: 'right' });
  }
  for (const q of [1e6, 2e6, 3e6]) txt(ctx, milioni(q), GX(q), GY(-30) + 30, { size: 30, color: C.dim });
  ctx.save(); ctx.globalAlpha *= ka;

  txt(ctx, 'energia fornita (J)', GX(3.27e6), GY(-30) + 66, { size: 30, weight: 600, color: C.g, align: 'right' });
  txt(ctx, 'temperatura (°C)', GX(0) + 18, 236, { size: 30, weight: 600, color: C.y, align: 'left' });
  ctx.restore();
  // la curva fin dove è arrivata l'energia
  const q = qAt(t), pts = [];
  const tappe = [0, E1, E2, E3, E4, E5].filter(v => v < q).concat([q]);
  tappe.forEach(v => pts.push([GX(v), GY(temp(v))]));
  if (t > 7.9) {
    ctx.save(); ctx.strokeStyle = css(C.y); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(GX(q), GY(temp(q)), 11, 0, Math.PI * 2); ctx.fill();
  }
  // i nomi dei tratti, quando ci si arriva
  const kl = 1 - P(t, 66.8, 67.4);
  txt(ctx, 'ghiaccio', GX(0) + 32, 600, { size: 30, color: C.x, align: 'left', alpha: P(t, 17.2, 17.7) });
  txt(ctx, 'fusione', (GX(E1) + GX(E2)) / 2 + 4, GY(0) - 30, { size: 30, weight: 600, color: C.v, alpha: P(t, 21.0, 21.5) * kl });
  txt(ctx, 'acqua', GX(E2) + 76, GY(40), { size: 30, color: C.x, align: 'left', alpha: P(t, 35.6, 36.1) });
  txt(ctx, 'ebollizione', (GX(E3) + GX(E4)) / 2, GY(100) - 30, { size: 30, weight: 600, color: C.v, alpha: P(t, 44.0, 44.5) * kl });
  txt(ctx, 'vapore', GX(E4) - 14, GY(125), { size: 30, color: C.x, align: 'right', alpha: P(t, 62.8, 63.3) });
  // il calore latente: le energie dei tratti piatti
  const kf = P(t, 76.8, 77.3);
  if (kf > 0) {
    ctx.save(); ctx.globalAlpha *= kf;
    graffa(ctx, GX(E1), GX(E2), GY(0) - 12, true, C.v);
    txt(ctx, '334 000 J', 410, 520, { size: 30, weight: 600, color: C.v, align: 'left' });   // a destra della salita dell'acqua
    ctx.restore();
  }
  const kv = P(t, 81.4, 81.9);
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv;
    graffa(ctx, GX(E3), GX(E4), GY(100) - 12, true, C.v);
    txt(ctx, '2 260 000 J', (GX(E3) + GX(E4)) / 2, GY(100) - 58, { size: 30, weight: 600, color: C.v });
    ctx.restore();
  }
  // al contrario: condensando, il vapore restituisce la stessa energia
  const kc = P(t, 89.8, 90.6);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= P(t, 89.8, 90.1);
    const xa = GX(E4) - 20, xb = lerp(xa, GX(E3) + 30, kc), y = GY(100) + 32;
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb + 10, y); ctx.stroke(); ctx.setLineDash([]);
    arrowHead(ctx, [xb, y], Math.PI, C.g, 1.2);
    txt(ctx, 'condensando, la restituisce', (GX(E3) + GX(E4)) / 2 + 40, y + 40, { size: 30, weight: 600, color: C.g, alpha: P(t, 90.4, 90.9) });
    ctx.restore();
  }
  ctx.restore();
}

// la pentola: che cosa c'è dentro, momento per momento
const PX0 = 1478, PX1 = 1742, PFONDO = 600, PALTO = 180;   // 1 kg d'acqua riempie la pentola fino a 180 px
// il fornello è acceso dall'inizio alla fine del riscaldamento (anche nei fermi immagine, dove resta fermo)
const fiammaAccesa = t => life(t, T_ON - .2, T_OFF + .3, .2, .3);
function pentola(ctx, t0, q) {
  const t = tPentola(t0);
  const fGh = q <= E1 ? 1 : q < E2 ? 1 - (q - E1) / L_F : 0;   // frazione ancora ghiaccio
  const fVa = q <= E3 ? 0 : q < E4 ? (q - E3) / L_V : 1;          // frazione già vapore
  const hw = PALTO * (1 - fGh) * (1 - fVa), ys = PFONDO - hw;
  ctx.save(); ctx.beginPath(); ctx.rect(PX0, 300, PX1 - PX0, PFONDO - 300); ctx.clip();
  if (hw > .5) {
    ctx.fillStyle = css(C.x, .3); ctx.fillRect(PX0, ys, PX1 - PX0, hw);
    // le bolle dell'ebollizione: nascono sul fondo e salgono
    if (q > E3 && q < E4) for (let i = 0; i < 16; i++) {
      const u = (t * .9 + h(i, 2)) % 1, y = PFONDO - 6 - u * (hw - 8), r = 4 + 6 * u;
      if (y < ys + r) continue;
      ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(PX0 + 20 + h(i, 1) * (PX1 - PX0 - 40), y, r, 0, Math.PI * 2); ctx.stroke();
    }
  }
  if (fGh > 0) {   // il blocco di ghiaccio, che si rimpicciolisce e galleggia
    const s = 160 * Math.sqrt(fGh), yb = Math.min(PFONDO, ys + .9 * s);
    ctx.fillStyle = css(mix(C.x, [255, 255, 255], .8)); ctx.strokeStyle = css(mix(C.x, [40, 70, 100], .3)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(1610 - s / 2, yb - s, s, s, 10); ctx.fill(); ctx.stroke();
    if (hw > .5) { ctx.fillStyle = css(C.x, .22); ctx.fillRect(1610 - s / 2, Math.max(ys, yb - s), s, yb - Math.max(ys, yb - s)); }
  }
  ctx.restore();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(PX0 - 4, 330); ctx.lineTo(PX0 - 4, PFONDO + 4); ctx.lineTo(PX1 + 4, PFONDO + 4); ctx.lineTo(PX1 + 4, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(PX0 - 40, 350); ctx.lineTo(PX0 - 4, 350); ctx.moveTo(PX1 + 4, 350); ctx.lineTo(PX1 + 40, 350); ctx.stroke();
  // il vapore che esce
  const kv = q > E3 ? (q < E4 ? 1 : 1 - P(t0, 63.6, 65.5)) : 0;
  if (kv > 0) {
    ctx.strokeStyle = css(C.dim, .6 * kv); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); const x0 = 1520 + i * 60, ph = t * 3 + i * 2; for (let k = 0; k <= 10; k++) { const y = 320 - k * 6, x = x0 + Math.sin(ph + k * .5) * 8; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  }
  // il fornello
  ctx.fillStyle = css(C.dim); ctx.fillRect(PX0 + 10, 630, PX1 - PX0 - 20, 16);
  const fi = fiammaAccesa(t0);
  if (fi > 0) for (let i = 0; i < 5; i++) {
    const cx = PX0 + 40 + i * (PX1 - PX0 - 80) / 4, hf = (20 + 5 * Math.sin(t * 17 + i * 2)) * fi;
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.moveTo(cx, 626 - hf); ctx.quadraticCurveTo(cx + 10, 622, cx, 626); ctx.quadraticCurveTo(cx - 10, 622, cx, 626 - hf); ctx.fill();
  }
}
function scenaPentola(ctx, t) {
  if (t < 7.5 || t > 67.4) return;
  const al = P(t, 7.8, 8.5) * (1 - P(t, 66.8, 67.4));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1410, 110, 400, 650);
  const q = qAt(t), tc = temp(q);
  txt(ctx, segno(tc) + ' °C', 1610, 168, { size: 52, weight: 600, color: C.y });
  const stato = q <= E1 + 1 ? ['ghiaccio', C.x] : q < E2 ? ['ghiaccio e acqua', C.v] : q <= E3 + 1 ? ['acqua', C.x] : q < E4 ? ['acqua e vapore', C.v] : ['vapore', C.dim];
  txt(ctx, stato[0], 1610, 228, { size: 34, weight: 600, color: stato[1] });
  pentola(ctx, t, q);
  txt(ctx, 'energia fornita', 1610, 676, { size: 30, color: C.dim });
  txt(ctx, milioni(q) + ' J', 1610, 718, { size: 38, weight: 600, color: C.g });
  ctx.restore();
}

// 2 · il calore latente (67–94.4)
function scenaLatente(ctx, t) {
  if (t < 66.8 || t > 94.6) return;
  const al = life(t, 67.0, 94.4, .5, .5);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1410, 110, 400, 650);
  titolo(ctx, '{v:calore latente}', 1610, 168);
  drawRich(ctx, '{mg:Q}{mink: = m·}{mv:L}', 1610, 250, { size: 60, local: t - 71.8 });
  drawRich(ctx, '{mg:Q}{dim: energia fornita (J)}', 1610, 318, { size: 30, local: t - 72.4 });
  drawRich(ctx, '{mink:m}{dim: massa (kg)}', 1610, 356, { size: 30, local: t - 73.2 });
  drawRich(ctx, '{mv:L}{dim: in J/kg}', 1610, 394, { size: 30, local: t - 74.0 });
  txt(ctx, 'fusione', 1610, 452, { size: 30, color: C.dim, alpha: P(t, 76.8, 77.3) });
  drawRich(ctx, '{mv:L} ≈ 334 000 J/kg', 1610, 494, { size: 34, local: t - 77.0 });
  txt(ctx, 'vaporizzazione', 1610, 562, { size: 30, color: C.dim, alpha: P(t, 81.4, 81.9) });
  drawRich(ctx, '{mv:L} ≈ 2 260 000 J/kg', 1610, 604, { size: 34, local: t - 81.6 });
  drawRich(ctx, '{g:quasi 7 volte tanto}', 1610, 680, { size: 34, local: t - 86.0 });
  ctx.restore();
}

// 3 · in una frase (94.4–104.8)
function scenaFine(ctx, t) {
  if (t < 94.5) return;
  const al = 1 - P(t, 102.6, 103.5);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.7 });
    drawRich(ctx, 'A pressione costante, durante un cambiamento\ndi stato la temperatura resta {g:ferma}.', W / 2, 290, { size: 62, weight: 600, local: t - 95.1, stagger: .08 });
  });
  const pills = [[490, 'fusione: 0 °C\nebollizione: 100 °C'], [960, '{mg:Q}{mink: = m·}{mv:L}'], [1430, 'l’energia serve\na rompere i {v:legami}']];
  pills.forEach(([x, s], i) => {
    const a = 96.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 44 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la temperatura, da −30 °C (0) a 130 °C (1);
  // nei tratti piatti resta fermo a 0 °C (.19) e a 100 °C (.81)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 12.6, .4],                                               // la curva e la pentola, i nomi degli assi
    ['pop', 17.0, .3], ['tono', 17.0, 17.53, [0, .19]], ['traccia', 17.0, 17.5],      // il fornello si accende, il ghiaccio sale a 0 °C
    ['tono', 20.9, 22.3, [.19, .19]], ['traccia', 20.9, 22.3], ['pop', 21.0, .45],    // fusione, primo pezzo: la temperatura sta ferma
    ['tono', 25.0, 25.8, [.19, .19]],                                                 // secondo pezzo
    ['tono', 34.4, 38.47, [.19, .19, .29, .4, .5, .61, .71, .81]], ['traccia', 34.4, 38.47],   // finisce di fondere, l'acqua sale a 100 °C
    ['tono', 43.7, 46.0, [.81, .81]], ['pop', 44.0, .6],                              // ebollizione: ferma a 100 °C
    ['tono', 62.53, 63.03, [.81, 1]], ['pop', 63.1, .7],                              // tutto vapore, il fornello si spegne
    ['soffio', 67.0],                                                                 // il calore latente
    ['pop', 71.8, .6], ['pop', 72.4, .4], ['pop', 73.2, .4], ['pop', 74.0, .45],      // Q = m·L e le sue lettere
    ['traccia', 76.8, 77.3], ['pop', 77.0, .5],                                       // la graffa della fusione, 334 000 J
    ['traccia', 81.4, 81.9], ['pop', 81.6, .55],                                      // la graffa dell'ebollizione, 2 260 000 J
    ['ding', 86.0],                                                                   // quasi 7 volte tanto
    ['traccia', 89.8, 90.6], ['pop', 90.4, .4],                                       // condensando la restituisce
    ['soffio', 94.7], ['pop', 95.1, .6], ['pop', 96.6, .5], ['pop', 97.1, .6], ['pop', 97.6, .7],   // in una frase
  ];
  return {
    titolo: 'Il ghiaccio che resta a 0 °C', durata: 104.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI,
      stati: [[7.9, 'ghiaccio'], [33.5, 'liquida'], [50.7, 'nuvola'], [93.8, 'liquida']], pioggia: [[90.0, 93.9]] },
    capitoli: [[7.5, 67.0, 'la curva di riscaldamento'], [67.0, 94.4, 'il calore latente']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCurva(ctx, t); scenaPentola(ctx, t); scenaLatente(ctx, t); scenaFine(ctx, t); },
  };
});
