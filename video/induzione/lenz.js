'use strict';
/* Il magnete che cade piano — la legge di Lenz. Un tubo di rame lungo 1 m (600 px). Fuori dal tubo la calamita cade
   libera: y = ½·g·t², 1 m in √(2/9,8) ≈ 0,45 s. Dentro il tubo le correnti indotte la frenano con una forza
   proporzionale alla velocità (legge dichiarata, plausibile per correnti indotte in un conduttore): a = g − v/τ, cioè
   v = vL·(1 − e^(−t/τ)), y = vL·(t − τ·(1 − e^(−t/τ))), con τ = vL/g. La velocità limite vL ≈ 0,25 m/s è scelta perché
   il tubo si percorra in 4,00 s (1/vL + τ = 4): τ ≈ 0,026 s, cioè la raggiunge in pochi centesimi di secondo.
   (La calamita è disegnata più grande del vero; i tempi e le velocità sono quelli veri.) Poi un ingrandimento a metà
   tubo, in fermo immagine: la calamita col nord in basso, il suo campo sull'asse punta in giù sia sotto sia sopra.
   Anello sotto: il flusso in giù cresce → campo indotto in su → corrente antioraria vista dall'alto (davanti verso
   destra) → l'anello ha il nord in su e respinge. Anello sopra: il flusso cala → campo indotto in giù → corrente oraria
   (davanti verso sinistra) → nord in giù, attira il sud della calamita. Entrambe le forze sulla calamita vanno in su.
   Colori fissi del magnetismo: nord C.ink pieno, sud chiaro col bordo scuro, campo B C.g, corrente C.v, forze C.y, energia e calore C.g.
   Argomento: induzione. */
CVIDEO.registra('induzione/lenz', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, fixedNum, fmtN, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 86.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.6, 'sorpreso'], [22.5, 'neutro'],
  [42.5, 'felice'], [47.1, 'pensa'], [51.1, 'neutro'], [56.1, 'sorpreso'], [60.7, 'felice'], [65.7, 'neutro'],
  [75.5, 'pensa'], [80.7, 'felice'], [83.0, 'neutro'], [88.4, 'felice'], [92.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché una calamita cade piano\nin un tubo di rame?'],
  [7.9, 12.65, 'Un tubo di rame, lungo 1 m:\nle calamite {r:non} lo attirano.'],
  [12.7, 16.6, 'Fuori dal tubo, la calamita\ncade in 0,45 s.'],
  [16.7, 22.4, 'Dentro il tubo ci mette {g:4 s}:\nscende piano, a velocità costante!'],
  [22.5, 27.4, 'Nel grafico: dentro il tubo la velocità\nresta circa 0,25 m/s.'],
  [27.5, 32.4, 'Mentre cade, il flusso nel rame attorno\n{v:cambia}: nascono correnti indotte.'],
  [32.5, 37.4, 'Guardo un anello di rame sotto:\nil flusso verso il basso {g:cresce}.'],
  [37.5, 42.4, 'La corrente indotta crea un campo\nverso l’alto, contro la crescita.'],
  [42.5, 47.0, 'L’anello è una calamita col nord\nin su: {g:respinge} la calamita.'],
  [47.1, 51.0, 'Si oppone {r:alla calamita}?\nGuarda l’anello sopra.'],
  [51.1, 56.0, 'Lì il flusso {g:cala}: il campo indotto\nva in giù e lo sostiene.'],
  [56.1, 60.6, 'Quell’anello la {g:attira}:\nla trattiene da sopra.'],
  [60.7, 65.6, 'Non contro la calamita: contro\nla {g:variazione} del flusso.'],
  [65.7, 70.5, 'Legge di Lenz: la corrente indotta si\noppone alla variazione che la crea.'],
  [70.6, 75.4, 'È il segno meno di Faraday-Neumann:\n{my:ε} = −Δ{mg:Φ}/Δ{mink:t}, con {mg:Φ} il flusso.'],
  [75.5, 80.6, 'Se aiutasse la variazione, la calamita\naccelererebbe: energia {r:dal nulla}.'],
  [80.7, 85.6, 'Invece l’energia della caduta\ndiventa {g:calore} nel rame.'],
  [88.4, 94.6, 'La corrente indotta si oppone alla\nvariazione del flusso: per questo frena.'],
];

// ---------- la fisica ----------
const G = 9.8, PXM = 600;                                  // px per metro
const VL = (() => { let v = .25; for (let i = 0; i < 60; i++) v = 1 / (4 - v / G); return v; })();   // 1/vL + vL/g = 4
const TAUF = VL / G;
const T_LIBERA = Math.sqrt(2 / G);                         // ≈ 0,4518 s
const caduLibera = s => s <= 0 ? 0 : Math.min(1, .5 * G * s * s);                                  // metri
const caduTubo = s => s <= 0 ? 0 : Math.min(1, VL * (s - TAUF * (1 - Math.exp(-s / TAUF))));      // metri
const velTubo = s => s <= 0 ? 0 : VL * (1 - Math.exp(-s / TAUF));
const T_TUBO = (() => { let s = 3.9; for (let i = 0; i < 60; i++) s = 1 / VL + TAUF * (1 - Math.exp(-s / TAUF)); return s; })();   // 4,00 s
const T_A = 13.6, T_B = 17.0;                              // partenze: fuori, dentro

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
// freccia tratteggiata (il campo indotto)
function frecciaTratt(ctx, a, b, col, al = 1, w = 6) {
  if (al <= 0.01) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.setLineDash([12, 9]);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - 18 * Math.cos(ang), b[1] - 18 * Math.sin(ang)); ctx.stroke();
  ctx.setLineDash([]); arrowHead(ctx, [b[0] - 4 * Math.cos(ang), b[1] - 4 * Math.sin(ang)], ang, col, 1.3);
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function separa(ctx, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); }
const RAME = () => mix(C.y, C.ink, .35);
// la calamita verticale, centrata in (cx, cy): sud in alto (azzurro), nord in basso (rosso)
function calamita(ctx, cx, cy, w, h, al = 1, lettere = true) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(10, w * .2)); ctx.save(); ctx.clip();
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.fillRect(cx - w / 2, cy - h / 2, w, h / 2);
  ctx.fillStyle = css(C.ink); ctx.fillRect(cx - w / 2, cy, w, h / 2);
  ctx.restore();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  if (lettere) {
    const fs = Math.round(Math.min(w * .6, h * .3, 56));
    txt(ctx, 'S', cx, cy - h / 4 + 2, { size: fs, weight: 600, color: C.ink, alpha: al });
    txt(ctx, 'N', cx, cy + h / 4 + 2, { size: fs, weight: 600, color: C.paper, alpha: al });
  }
}
// il tubo visto da fuori (cilindro): metà dietro prima della calamita, metà davanti (velata) dopo
function tuboDietro(ctx, x, y0, y1, r, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(RAME(), .12); ctx.fillRect(x - r, y0, 2 * r, y1 - y0);
  ctx.strokeStyle = css(RAME()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(x, y0, r, r * .28, 0, Math.PI, TAU); ctx.stroke();
  ctx.restore();
}
function tuboDavanti(ctx, x, y0, y1, r, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(RAME(), .18);
  ctx.beginPath(); ctx.moveTo(x - r, y0); ctx.ellipse(x, y0, r, r * .28, 0, Math.PI, 0, true); ctx.lineTo(x + r, y1); ctx.ellipse(x, y1, r, r * .28, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(RAME()); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x - r, y0); ctx.lineTo(x - r, y1); ctx.moveTo(x + r, y0); ctx.lineTo(x + r, y1); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y0, r, r * .28, 0, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y1, r, r * .28, 0, 0, Math.PI); ctx.stroke();
  ctx.restore();
}

// ---------- 1 · le due cadute (7,8–27,5) ----------
const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];
const XF = 330, XT = 720, YT0 = 150, YT1 = 750, RT = 44, MW = 40, MH = 64;
function sceneCadute(ctx, t) {
  const al = life(t, 7.8, 27.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il tavolo
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 4; ctx.globalAlpha *= P(t, 8.0, 8.5);
  ctx.beginPath(); ctx.moveTo(180, YT1 + MH / 2 + 2); ctx.lineTo(1040, YT1 + MH / 2 + 2); ctx.stroke(); ctx.restore();
  const kt = P(t, 8.1, 8.8);
  tuboDietro(ctx, XT, YT0 - MH / 2 + 10, YT1 + MH / 2 - 4, RT, kt);   // il tubo poggia sul tavolo
  // la calamita nel tubo: compare in cima quando parte
  const kb = P(t, 16.75, 17.0);
  calamita(ctx, XT, YT0 + PXM * caduTubo(t - T_B), MW, MH, kb);
  tuboDavanti(ctx, XT, YT0 - MH / 2 + 10, YT1 + MH / 2 - 4, RT, kt);
  // la calamita fuori dal tubo
  const ka = P(t, 12.8, 13.3);
  calamita(ctx, XF, YT0 + PXM * caduLibera(t - T_A), MW, MH, ka);
  txt(ctx, 'tubo di rame', XT + RT + 80, 300, { size: 32, color: C.dim, align: 'left', alpha: P(t, 8.6, 9.1) });
  txt(ctx, '1 m', XT + RT + 22, 450, { size: 34, weight: 600, align: 'left', alpha: P(t, 8.8, 9.3) });
  ctx.save(); ctx.globalAlpha *= P(t, 8.8, 9.3); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(XT + RT + 50, YT0 + 4); ctx.lineTo(XT + RT + 50, 410); ctx.moveTo(XT + RT + 50, 490); ctx.lineTo(XT + RT + 50, YT1 - 4); ctx.stroke(); ctx.restore();
  txt(ctx, 'senza tubo', XF + 46, 160, { size: 30, color: C.dim, align: 'left', alpha: ka });
  ctx.restore();
}
// a destra: i tempi e il grafico della velocità
const VX0 = 1240, VY0 = 735, VPX_S = 110, VPX_V = 62;   // 4,5 s → 495 px; 5 m/s → 310 px
const vx = s => VX0 + s * VPX_S, vy = v => VY0 - v * VPX_V;
function scenePannelloCadute(ctx, t) {
  const al = life(t, 12.6, 27.9, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'tempo per 1 m', 1480, 168, { size: 40, weight: 600 }));
  const sA = Math.min(Math.max(t - T_A, 0), T_LIBERA), sB = Math.min(Math.max(t - T_B, 0), T_TUBO);
  txt(ctx, 'fuori dal tubo', 1200, 232, { size: 34, align: 'left' });
  fixedNum(ctx, fmtN(sA, 2), 1690, 232, 44, C.ink); txt(ctx, 's', 1700, 232, { size: 34, align: 'left' });
  const kB = P(t, 16.7, 17.0);
  txt(ctx, 'dentro il tubo', 1200, 292, { size: 34, align: 'left', alpha: kB });
  fixedNum(ctx, fmtN(sB, 2), 1690, 292, 44, C.g, kB); txt(ctx, 's', 1700, 292, { size: 34, align: 'left', alpha: kB });
  separa(ctx, 336, 1);
  // il grafico della velocità
  ctx.save(); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(VX0 - 4, VY0); ctx.lineTo(vx(4.6), VY0); ctx.moveTo(VX0, VY0 + 4); ctx.lineTo(VX0, vy(5.2)); ctx.stroke(); ctx.restore();
  arrowHead(ctx, [vx(4.6) + 6, VY0], 0, C.ink); arrowHead(ctx, [VX0, vy(5.2) - 6], -Math.PI / 2, C.ink);
  drawRich(ctx, '{mx:v} {dim:(m/s)}', VX0 + 16, vy(5.2) - 4, { size: 30, align: 'left' });
  drawRich(ctx, '{mink:t} {dim:(s)}', vx(4.6), VY0 - 30, { size: 30, align: 'right' });
  for (let k = 1; k <= 4; k++) txt(ctx, String(k), vx(k), VY0 + 26, { size: 29, color: C.dim });
  for (const v of [2, 4]) txt(ctx, String(v), VX0 - 12, vy(v), { size: 29, color: C.dim, align: 'right' });
  // fuori: v = g·t, fino all'arrivo
  if (sA > 0) {
    ctx.save(); ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(vx(0), vy(0)); ctx.lineTo(vx(sA), vy(G * sA)); ctx.stroke(); ctx.restore();
    if (sA >= T_LIBERA - 1e-6) drawRich(ctx, '{dim:fuori}', vx(T_LIBERA) + 16, vy(G * T_LIBERA) + 6, { size: 30, align: 'left' });
  }
  // dentro: v = vL·(1 − e^(−t/τ))
  if (sB > 0) {
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); for (let i = 0; i <= 200; i++) { const s = sB * i / 200, p = [vx(s), vy(velTubo(s))]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:dentro: ≈ 0,25 m/s}', vx(2.6), vy(velTubo(sB)) - 34, { size: 30, alpha: P(t, 18.0, 18.6) });
  }
  ctx.restore();
}

// ---------- 2 · l'ingrandimento, in fermo immagine (27,5–86) ----------
const AX = 610, YSU = 200, YGIU = 660, RX = 240, RY = 34, MC = [AX, 430], MW2 = 120, MH2 = 210;
// un anello del tubo: metà dietro (sopra) e metà davanti (sotto); kOn lo accende, caldo lo fa brillare
function anello(ctx, y, kOn, caldo, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const col = mix(RAME(), C.y, .3 * kOn);
  if (caldo > 0) { ctx.shadowColor = css(C.g, .9 * caldo); ctx.shadowBlur = 30 * caldo; }
  ctx.strokeStyle = css(col, .45 + .55 * kOn); ctx.lineWidth = 4 + 5 * kOn;
  ctx.beginPath(); ctx.ellipse(AX, y, RX, RY, 0, Math.PI, TAU); ctx.stroke();
  ctx.lineWidth = 5 + 6 * kOn;
  ctx.beginPath(); ctx.ellipse(AX, y, RX, RY, 0, 0, Math.PI); ctx.stroke();
  if (caldo > 0) { ctx.strokeStyle = css(C.g, .55 * caldo); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(AX, y, RX, RY, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// la corrente sull'anello: verso = +1 se davanti va verso destra (antioraria vista dall'alto)
function correnteAnello(ctx, y, verso, al, li) {
  if (al <= 0) return;
  for (const f of [Math.PI * .32, Math.PI * .68]) {
    const p = [AX + RX * Math.cos(f), y + RY * Math.sin(f)], d = [verso * RX * Math.sin(f), -verso * RY * Math.cos(f)];
    ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, p, Math.atan2(d[1], d[0]), C.v, 1.35); ctx.restore();
  }
  for (const f of [Math.PI * 1.25, Math.PI * 1.75]) {   // dietro, più chiare
    const p = [AX + RX * Math.cos(f), y + RY * Math.sin(f)], d = [verso * RX * Math.sin(f), -verso * RY * Math.cos(f)];
    ctx.save(); ctx.globalAlpha *= al * .5; arrowHead(ctx, p, Math.atan2(d[1], d[0]), C.v, 1.0); ctx.restore();
  }
  drawRich(ctx, '{mv:I}', li[0], li[1], { size: 38, alpha: al });
}
function polo(ctx, p, nome, al) {
  if (al <= 0) return;
  // un tassello come in magnetismo/calamite: N scuro con lettera chiara, S chiaro con bordo e lettera scuri
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(nome === 'N' ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(p[0] - 24, p[1] - 24, 48, 48, 8); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, nome, p[0], p[1] + 2, { size: 32, weight: 600, color: nome === 'N' ? C.paper : C.ink, alpha: al });
}
function sceneZoom(ctx, t) {
  const al = life(t, 27.6, T_FINE + .1, .6, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const caldo = P(t, 80.9, 81.8);
  // le pareti del tubo, tagliate
  ctx.save(); ctx.fillStyle = css(RAME(), .5);
  ctx.fillRect(AX - RX - 7, 130, 14, 640); ctx.fillRect(AX + RX - 7, 130, 14, 640); ctx.restore();
  txt(ctx, 'fermo immagine', 1098, 765, { size: 28, color: C.dim, align: 'right' });
  txt(ctx, 'parete del tubo', AX + RX + 22, 420, { size: 28, color: C.dim, align: 'left', alpha: P(t, 28.2, 28.7) * (1 - P(t, 32.4, 32.9)) });
  // gli anelli
  const k1 = P(t, 32.6, 33.1), k2 = P(t, 51.2, 51.7);
  anello(ctx, YGIU, k1, caldo, P(t, 28.0, 28.6));
  anello(ctx, YSU, k2, caldo, P(t, 28.0, 28.6));
  txt(ctx, 'anello sotto', 240, YGIU, { size: 30, color: C.dim, alpha: k1 });
  txt(ctx, 'anello sopra', 240, YSU, { size: 30, color: C.dim, alpha: k2 });
  // la calamita e la sua velocità
  calamita(ctx, MC[0], MC[1], MW2, MH2, P(t, 27.8, 28.4));
  const kv = P(t, 28.4, 28.9);
  freccia(ctx, [430, 370], [430, 490], C.x, kv, 6);
  drawRich(ctx, '{mx:v}', 400, 430, { size: 38, alpha: kv });
  // anello sotto: il campo della calamita (in giù, cresce), il campo indotto (in su), la corrente, i poli
  freccia(ctx, [AX - 30, 560], [AX - 30, 740], mix(C.g, C.paper, .12), k1, 7);
  drawRich(ctx, '{mg:B}', AX - 75, 598, { size: 38, alpha: k1 });
  const ki1 = P(t, 37.7, 38.2);
  frecciaTratt(ctx, [AX + 40, 740], [AX + 40, 575], C.g, ki1, 6);
  drawRich(ctx, '{dim:indotto}', AX + 70, 598, { size: 30, align: 'left', alpha: ki1 });
  correnteAnello(ctx, YGIU, 1, P(t, 38.0, 38.5), [AX + 200, YGIU + 68]);
  const kp1 = P(t, 42.7, 43.2);
  polo(ctx, [935, YGIU - 32], 'N', kp1); polo(ctx, [935, YGIU + 32], 'S', kp1);
  freccia(ctx, [525, 480], [525, 375], C.y, kp1, 7);
  drawRich(ctx, '{my:F}', 497, 420, { size: 38, alpha: kp1 });
  // anello sopra: il campo della calamita (in giù, cala), il campo indotto (in giù), la corrente, i poli
  freccia(ctx, [AX - 30, 132], [AX - 30, 300], mix(C.g, C.paper, .12), k2, 7);
  drawRich(ctx, '{mg:B}', AX - 75, 270, { size: 38, alpha: k2 });
  const ki2 = P(t, 51.8, 52.3);
  frecciaTratt(ctx, [AX + 40, 132], [AX + 40, 290], C.g, ki2, 6);
  drawRich(ctx, '{dim:indotto}', AX + 70, 270, { size: 30, align: 'left', alpha: ki2 });
  correnteAnello(ctx, YSU, -1, P(t, 52.1, 52.6), [AX - 200, YSU + 68]);
  const kp2 = P(t, 56.3, 56.8);
  polo(ctx, [935, YSU - 32], 'S', kp2); polo(ctx, [935, YSU + 32], 'N', kp2);
  freccia(ctx, [695, 480], [695, 375], C.y, kp2, 7);
  drawRich(ctx, '{my:F}', 725, 420, { size: 38, alpha: kp2 });
  ctx.restore();
}
function scenePannelloLenz(ctx, t) {
  const al = life(t, 32.5, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  const cx = 1480;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{dim:sotto:} il flusso {g:cresce}', 1200, 168, { size: 34, align: 'left', local: t - 32.6 });
  drawRich(ctx, '→ {mg:B} {dim:indotto in su}', 1230, 218, { size: 34, align: 'left', local: t - 37.6 });
  drawRich(ctx, '→ {g:respinge}', 1600, 218, { size: 34, align: 'left', local: t - 42.6 });
  drawRich(ctx, '{dim:sopra:} il flusso {g:cala}', 1200, 290, { size: 34, align: 'left', local: t - 51.2 });
  drawRich(ctx, '→ {mg:B} {dim:indotto in giù}', 1230, 340, { size: 34, align: 'left', local: t - 51.8 });
  drawRich(ctx, '→ {g:attira}', 1600, 340, { size: 34, align: 'left', local: t - 56.2 });
  separa(ctx, 388, P(t, 47.1, 47.5));
  // l'idea sbagliata, poi quella giusta
  const kNo = P(t, 47.2, 47.7);
  drawRich(ctx, 'si oppone {r:alla calamita}?', cx, 436, { size: 36, alpha: kNo * (1 - .5 * P(t, 60.8, 61.3)) });
  const kx = P(t, 60.8, 61.4);
  if (kx > 0) { ctx.save(); ctx.globalAlpha *= kx; ctx.strokeStyle = css(C.r); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1262, 438); ctx.lineTo(1262 + 418 * kx, 438); ctx.stroke(); ctx.restore(); }
  drawRich(ctx, 'si oppone alla {g:variazione} del flusso', cx, 488, { size: 34, local: t - 61.0 });
  separa(ctx, 534, P(t, 65.7, 66.1));
  conFont(TITOLI, () => drawRich(ctx, 'legge di Lenz', cx, 580, { size: 40, weight: 600, local: t - 65.8 }));
  drawRich(ctx, '{my:ε} = {g:−}Δ{mg:Φ}/Δ{mink:t}', cx, 645, { size: 48, local: t - 71.0 });
  drawRich(ctx, '{dim:il segno meno è Lenz}', cx, 696, { size: 30, local: t - 72.2 });
  // l'energia
  const kAiuta = life(t, 75.6, 80.7, .4, .3);
  drawRich(ctx, '{r:se la aiutasse: energia dal nulla}', cx, 752, { size: 32, alpha: kAiuta });
  drawRich(ctx, '{g:energia della caduta → calore}', cx, 752, { size: 32, local: t - 80.9, alpha: P(t, 80.8, 81.0) });
  ctx.restore();
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Il magnete che cade piano', W / 2, 180, { size: 115, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 12.4, T_FINE + .1, .5, .5));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 95.0, 96.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'La corrente indotta si oppone\nalla {g:variazione} del flusso.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'flusso che cresce:\n{mg:B} {dim:indotto contro}'], [960, 'flusso che cala:\n{mg:B} {dim:indotto a favore}'], [1470, 'l’energia del moto\ndiventa {g:calore}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): nelle cadute il tono segue l'altezza della calamita, dalla cima (1)
  // al tavolo (0): fuori in 0,45 s (½·g·t²), dentro in 4 s, quasi a velocità costante (caduTubo)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .5],                                                // il tubo di rame
    ['soffio', 12.4], ['pop', 12.8, .9],                                              // la scheda dei tempi, la calamita fuori
    ['tono', 13.6, 14.05, [1, .94, .75, .44, 0]], ['pop', 14.05, .15],                // cade libera: 0,45 s
    ['pop', 16.75, .9], ['tono', 17.0, 21.0, [1, .75, .5, .25, 0]], ['ding', 21.0],   // nel tubo: 4 s
    ['soffio', 27.6], ['pop', 27.8, .5], ['pop', 28.4, .4],                           // l'ingrandimento: la calamita, la velocità
    ['pop', 32.6, .3], ['pop', 37.7, .5], ['pop', 38.0, .45],                         // anello sotto: il flusso cresce, campo indotto, corrente
    ['pop', 42.7, .7],                                                                // il nord in su: respinge, F verso l'alto
    ['pop', 47.2, .4],                                                                // si oppone alla calamita?
    ['pop', 51.2, .8], ['pop', 51.8, .6], ['pop', 52.1, .65],                         // anello sopra: il flusso cala
    ['pop', 56.3, .7],                                                                // attira: F verso l'alto
    ['traccia', 60.8, 61.4], ['ding', 61.2],                                          // no: alla variazione del flusso
    ['pop', 65.8, .6], ['pop', 71.0, .55],                                            // legge di Lenz, il segno meno
    ['pop', 75.6, .3], ['pop', 80.9, .6], ['ding', 81.3],                             // energia dal nulla? no: calore nel rame
    ['soffio', 86.2], ['pop', 88.2, .5], ['pop', 88.7, .6], ['pop', 89.2, .7],        // in una frase
  ];
  return {
    titolo: 'Il magnete che cade piano', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.4, 'due cadute'], [27.4, 65.6, 'gli anelli di rame'], [65.6, T_FINE, 'la legge di Lenz']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneCadute(ctx, t); scenePannelloCadute(ctx, t); sceneZoom(ctx, t); scenePannelloLenz(ctx, t); sceneFine(ctx, t); },
  };
});
