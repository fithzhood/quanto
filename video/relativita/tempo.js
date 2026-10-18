'use strict';
/* L'orologio a luce — due specchi a distanza d e un lampo che rimbalza: un tic dura Δt₀ = 2·d/c (tempo proprio, misurato
   dall'orologio fermo rispetto a ciò che misura). Sullo schermo, al rallentatore, d = 150 px e c = 150 px/s: un tic ogni
   2 s. Visto da terra il treno corre a v = 0,6·c (90 px/s): il lampo fa un percorso a zig-zag calcolato (orizzontale v·Δt/2,
   verticale d, ipotenusa c·Δt/2) e ogni mezzo tic dura d/√(c² − v²) = 1,25 s: in 10 s di terra un orologio uguale,
   fermo a terra (a sinistra dal momento in cui il treno parte), fa 5 tic, quello sul treno 4.
   Pitagora: (c·Δt/2)² = d² + (v·Δt/2)² con d = c·Δt₀/2 → Δt = Δt₀/√(1 − v²/c²) = γ·Δt₀; γ(0,6·c) = 1/0,8 = 1,25;
   γ(0,9·c) = 2,29 ≈ 2,3; γ(0,99·c) = 7,09 ≈ 7,1 (ricontrollati con node). Il triangolo del mezzo tic è un 3-4-5
   (300, 400, 500 px). Colori: velocità C.x, la luce C.y, la cosa nuova (γ, tempo proprio) C.v, risultati C.g.
   Argomento: relativita. */
CVIDEO.registra('relativita/tempo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, drawSeq, fixedNum, card, arrowHead, glowStroke } = M;
  const TAU = Math.PI * 2;

const T_FINE = 99.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.6, 'felice'], [19.5, 'neutro'],
  [29.4, 'felice'], [34.5, 'sorpreso'], [39.8, 'neutro'], [45.2, 'pensa'], [49.7, 'sorpreso'], [55.5, 'neutro'],
  [60.8, 'felice'], [65.4, 'neutro'], [79.8, 'felice'], [85.8, 'neutro'], [91.4, 'sorpreso'], [101.8, 'felice'],
  [105.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Un orologio fatto di luce.\nIn corsa, rallenta?'],
  [7.9, 13.5, 'Due specchi a distanza {mink:d}, uno sopra\nl’altro, e un lampo che va su e giù.'],
  [13.6, 19.4, 'Un tic: su e giù, {mink:Δt₀} = 2·{mink:d}/{mink:c}.\nAl rallentatore: un tic ogni 2 s.'],
  [19.5, 25.0, 'Sta sul treno: chi è a bordo lo vede\nfermo, e misura il {v:tempo proprio} {mink:Δt₀}.'],
  [25.1, 29.2, 'Tempo proprio: quello dell’orologio\nfermo rispetto a ciò che misura.'],
  [29.4, 34.4, 'Ora il treno corre a {mx:v} = 0,6·{mink:c}\ne io lo guardo da terra.'],
  [34.5, 39.3, 'Mentre il lampo sale, lo specchio\nsi sposta: la luce va a {g:zig-zag}.'],
  [39.8, 45.1, 'Il percorso è {g:più lungo}, ma la luce\nva sempre a {mink:c}: il secondo postulato.'],
  [45.2, 49.6, 'Ogni tic, {mink:Δt}, dura {g:di più}:\nvisto da terra, l’orologio {v:rallenta}.'],
  [49.7, 55.3, 'In 10 s di terra l’orologio fermo fa\n{v:5} tic, quello sul treno {g:4}.'],
  [55.5, 60.7, 'Guardo il triangolo di mezzo tic:\nverticale {mink:d}, orizzontale {mx:v}·{mink:Δt}/2…'],
  [60.8, 65.3, '…e la luce percorre l’ipotenusa,\n{mink:c}·{mink:Δt}/2. Pitagora!'],
  [65.4, 71.9, '({mink:c}·{mink:Δt}/2)² = {mink:d}² + ({mx:v}·{mink:Δt}/2)²,\ncon {mink:d} = {mink:c}·{mink:Δt₀}/2.'],
  [72.0, 79.7, 'Risolvo per {mink:Δt}:\n{mink:Δt} = {mink:Δt₀} / √(1 − {mx:v}²/{mink:c}²) = {mv:γ}{mink:·Δt₀}.'],
  [79.8, 85.7, 'Con {mx:v} = 0,6·{mink:c}: {mv:γ} = 1/√(1 − 0,36)\n= 1/0,8 = {g:1,25}.'],
  [85.8, 91.3, 'Un tic da 2 s, da terra, dura 2,5 s:\n5 tic contro 4, come prima.'],
  [91.4, 99.2, 'Più si va forte, più {mv:γ} cresce:\na 0,9·{mink:c} vale 2,3, a 0,99·{mink:c} vale 7,1.'],
  [101.8, 107.6, 'Un orologio in moto batte più lento:\n{mink:Δt} = {mv:γ}{mink:·Δt₀}.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al, w) {
  if (al == null) al = 1; if (w == null) w = 7;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.3, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function fondo(ctx, x, y, w, h, al) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function scritta(ctx, s, x, y, size, al, align) {
  if (al <= 0) return;
  const w = richW(ctx, s, size) + 20, a = align || 'center';
  const cx = a === 'left' ? x + w / 2 - 10 : a === 'right' ? x - w / 2 + 10 : x;
  fondo(ctx, cx, y, w, size * 1.35, al * .92);
  drawRich(ctx, s, x, y, { size, align: a, alpha: al });
}
const CORPO = () => mix(C.x, C.paper, .78), BORDO = () => mix(C.ink, C.paper, .25);
function binario(ctx, x0, x1, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y + 12); ctx.lineTo(x1, y + 12); ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = css(mix(C.ink, C.paper, .6));
  for (let x = x0 + 30; x < x1; x += 60) { ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 16); ctx.stroke(); }
  ctx.restore();
}
// una cabina alta, con la coda in x, sulle rotaie a quota y; dentro l'orologio. kTerra: al posto delle ruote uno zoccolo
// (la cabina uguale, ferma a terra)
function cabina(ctx, x, y, al, kTerra) {
  if (al <= 0) return;
  if (kTerra == null) kTerra = 0;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(CORPO()); ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x, y - 330, 150, 314, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.x, C.paper, .55)); ctx.beginPath(); ctx.roundRect(x + 12, y - 340, 126, 16, 7); ctx.fill();
  ctx.save(); ctx.globalAlpha *= 1 - kTerra; ctx.fillStyle = css(C.ink);
  for (const wx of [x + 36, x + 114]) { ctx.beginPath(); ctx.arc(wx, y - 10, 15, 0, TAU); ctx.fill(); }
  ctx.restore();
  if (kTerra > 0) {
    ctx.save(); ctx.globalAlpha *= kTerra; ctx.fillStyle = css(mix(C.ink, C.paper, .45));
    ctx.beginPath(); ctx.roundRect(x - 14, y - 18, 178, 22, 5); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
// il terreno: una linea con il tratteggio obliquo sotto
function terreno(ctx, x0, x1, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = css(mix(C.ink, C.paper, .6));
  for (let x = x0 + 10; x < x1; x += 24) { ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x - 14, y + 18); ctx.stroke(); }
  ctx.restore();
}
function specchio(ctx, x, y, al, dim) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(dim ? mix(C.ink, C.paper, .6) : C.ink); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 36, y); ctx.lineTo(x + 36, y); ctx.stroke(); ctx.restore();
}
function lampo(ctx, x, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 34);
  g.addColorStop(0, css(C.y, .5)); g.addColorStop(1, css(C.y, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fill();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill();
  ctx.restore();
}
const frac = x => ((x % 1) + 1) % 1;              // parte frazionaria, anche per x < 0
const tri = p => p < .5 ? 2 * p : 2 - 2 * p;        // su e giù: 0 → 1 → 0

// ---------- l'orologio: numeri veri ----------
const D = 150, CPX = 150, VPX = 90;                 // d = 150 px, c = 150 px/s, v = 0,6·c
const TIC0 = 2 * D / CPX;                           // 2 s: il tic proprio
const TIC1 = TIC0 / Math.sqrt(1 - (VPX / CPX) * (VPX / CPX));   // 2,5 s: il tic visto da terra (γ = 1,25)
const T0 = 29.7, T_MOTO = 10;                       // il treno parte a 29,7 e il fermo immagine scatta 10 s dopo (5 tic contro 4)
const tau = t => clamp(t - T0, 0, T_MOTO);
const CA = [110, 110, 560, 680], CB = [720, 110, 1090, 680];
const Y_ROT = 560, Y_BASSO = Y_ROT - 110, Y_ALTO = Y_BASSO - D;   // gli specchi, dentro la cabina
const XA = CA[0] + CA[2] / 2;                       // l'orologio a bordo
const XB0 = CB[0] + 40 + 75;                        // la cabina da terra parte qui e si sposta di v·τ
const xCab = tt => XB0 + VPX * tt;

// ---------- 1 + 2 · a bordo e da terra (7,5–54,7) ----------
function scenaOrologi(ctx, t) {
  if (t < 7.5 || t > 55.8) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 55.1, 55.6));
  ctx.save(); ctx.globalAlpha *= al;
  // a bordo
  card(ctx, CA[0], CA[1], CA[2], CA[3]);
  // fino a 29,4 è l'orologio sul treno visto da bordo; poi, quando il treno parte, un orologio uguale fermo a terra
  const kT = P(t, 29.4, 30.0), kBordo = 1 - P(t, 29.2, 29.5);
  txt(ctx, 'visto da bordo', CA[0] + 30, 150, { size: 30, color: C.dim, align: 'left', alpha: kBordo });
  txt(ctx, 'al rallentatore', CA[0] + 30, 190, { size: 26, color: C.dim, align: 'left', alpha: P(t, 13.7, 14.2) * kBordo });
  drawRich(ctx, 'un orologio {v:uguale},', CA[0] + 30, 150, { size: 30, align: 'left', alpha: kT });
  drawRich(ctx, '{v:fermo a terra}', CA[0] + 30, 192, { size: 30, align: 'left', alpha: kT });
  binario(ctx, CA[0] + 20, CA[0] + CA[2] - 20, Y_ROT, 1 - kT);
  terreno(ctx, CA[0] + 20, CA[0] + CA[2] - 20, Y_ROT + 4, kT);
  cabina(ctx, XA - 75, Y_ROT, 1, kT);
  const kS = P(t, 8.3, 8.9);
  specchio(ctx, XA, Y_ALTO, kS, false); specchio(ctx, XA, Y_BASSO, kS, false);
  // d, a lato
  const kd = life(t, 9.0, 29.3, .4, .4);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(XA + 52, Y_ALTO); ctx.lineTo(XA + 52, Y_BASSO); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:d}', XA + 78, (Y_ALTO + Y_BASSO) / 2, { size: 40, alpha: kd });
  }
  // il lampo: su e giù, con il tic proprio
  const kL = P(t, 9.8, 10.2);
  const ph = frac((Math.min(t, T0 + T_MOTO) - T0) / TIC0);
  lampo(ctx, XA, Y_BASSO - D * tri(ph), kL);
  // il conteggio dei tic (parte quando parte il treno)
  const kc = P(t, T0 - .2, T0 + .2);
  if (kc > 0) {
    drawRich(ctx, '{dim:tic dell’orologio fermo}', XA, 660, { size: 32, alpha: kc });
    fixedNum(ctx, String(Math.floor(tau(t) / TIC0 + 1e-9)), XA + 30, 730, 72, C.v, kc);
  }
  // il pannello delle definizioni (1) oppure la scena da terra (2)
  const kP = life(t, 13.6, 29.4, .4, .3);
  if (kP > 0) {
    card(ctx, CB[0], CB[1], CB[2], CB[3], kP);
    const cx = CB[0] + CB[2] / 2;
    ctx.save(); ctx.globalAlpha *= kP;
    conFont(TITOLI, () => drawRich(ctx, 'un tic', cx, 180, { size: 42, weight: 600 }));
    drawRich(ctx, '{dim:la luce fa} {mink:d} {dim:in salita e} {mink:d} {dim:in discesa:}', cx, 260, { size: 36, local: t - 13.8 });
    drawRich(ctx, '{mink:Δt₀} = 2·{mink:d}/{mink:c}', cx, 335, { size: 60, local: t - 14.6 });
    drawRich(ctx, '{dim:sullo schermo:} {mink:d} = 150 px{dim:, un tic ogni} 2 s', cx, 415, { size: 32, local: t - 16.4 });
    ctx.save(); ctx.globalAlpha *= P(t, 19.6, 20.0); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 460, 465); ctx.lineTo(cx + 460, 465); ctx.stroke(); ctx.restore();
    conFont(TITOLI, () => drawRich(ctx, '{v:tempo proprio} {mink:Δt₀}', cx, 530, { size: 42, weight: 600, local: t - 19.7 }));
    drawRich(ctx, 'misurato da un orologio {g:fermo}', cx, 610, { size: 36, local: t - 25.2 });
    drawRich(ctx, 'rispetto a ciò che misura', cx, 662, { size: 36, local: t - 26.0 });
    drawRich(ctx, '{dim:(qui: chi sta a bordo con l’orologio)}', cx, 720, { size: 30, local: t - 26.8 });
    ctx.restore();
  }
  const kB = P(t, 29.4, 30.0);
  if (kB > 0) {
    card(ctx, CB[0], CB[1], CB[2], CB[3], kB);
    ctx.save(); ctx.globalAlpha *= kB;
    txt(ctx, 'visto da terra', CB[0] + 30, 150, { size: 30, color: C.dim, align: 'left' });
    txt(ctx, 'al rallentatore', CB[0] + 30, 190, { size: 26, color: C.dim, align: 'left' });
    const tt = tau(t), xc = xCab(tt);
    ctx.save(); ctx.beginPath(); ctx.rect(CB[0] + 4, CB[1] + 4, CB[2] - 8, CB[3] - 8); ctx.clip();
    binario(ctx, CB[0] + 20, CB[0] + CB[2] - 20, Y_ROT, 1);
    // la traccia a zig-zag lasciata dal lampo (in coordinate di terra)
    const pts = [];
    for (let i = 0; i <= 400; i++) { const u = tt * i / 400; pts.push([xCab(u), Y_BASSO - D * tri(frac(u / TIC1))]); }
    if (tt > .05) glowStroke(ctx, pts, 1, C.y, 4);
    cabina(ctx, xc - 75, Y_ROT, 1);
    specchio(ctx, xc, Y_ALTO, 1, false); specchio(ctx, xc, Y_BASSO, 1, false);
    lampo(ctx, xc, Y_BASSO - D * tri(frac(tt / TIC1)), 1);
    // la velocità del treno
    const kv = P(t, 29.8, 30.4) * (1 - P(tt, 6, 7));   // la freccia segue la cabina finché non arriva in fondo
    freccia(ctx, [xc + 40, Y_ROT - 380], [xc + 40 + 120, Y_ROT - 380], C.x, kv, 7);
    scritta(ctx, '{mx:v} = 0,6·{mink:c}', xc + 100, Y_ROT - 422, 34, kv);
    ctx.restore();
    // conteggio e fermo immagine
    drawRich(ctx, '{dim:tic dell’orologio sul treno}', CB[0] + 250, 660, { size: 32 });
    fixedNum(ctx, String(Math.floor(tt / TIC1 + 1e-9)), CB[0] + 280, 730, 72, C.g);
    const kF = P(t, T0 + T_MOTO, T0 + T_MOTO + .4);
    if (kF > 0) {
      fondo(ctx, 1640, 150, 290, 50, kF);
      ctx.save(); ctx.globalAlpha *= kF; ctx.fillStyle = css(C.ink); ctx.fillRect(1512, 136, 9, 28); ctx.fillRect(1527, 136, 9, 28); ctx.restore();
      txt(ctx, 'fermo immagine', 1550, 151, { size: 30, color: C.ink, align: 'left', alpha: kF });
    }
    // «più lungo» e «stessa c»: etichette sulla traccia
    const k8 = life(t, 40.0, 45.1, .4, .3);
    if (k8 > 0) {
      scritta(ctx, '{dim:percorso} {g:più lungo}{dim:, stessa} {mink:c}', CB[0] + 460, 740, 34, k8, 'left');
    }
    const k9 = life(t, 45.2, 49.6, .3, .3);
    if (k9 > 0) scritta(ctx, '{dim:un tic visto da terra:} {mink:Δt} > {mink:Δt₀}', CB[0] + 460, 740, 34, k9, 'left');
    const k10 = life(t, 49.8, 55.0, .3, .3);
    if (k10 > 0) scritta(ctx, '{dim:in 10 s: fermo} {v:5}{dim:, sul treno} {g:4}', CB[0] + 460, 740, 34, k10, 'left');
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · Pitagora e γ (54,7–99,4) ----------
const TRI = [110, 110, 760, 680], FORM = [910, 110, 900, 680];
const XT = 250, YT = 640, AX = 300, AY = 400;        // il triangolo 3-4-5: 300, 400, 500 px
function scenaPitagora(ctx, t) {
  if (t < 55.3 || t > T_FINE + .3) return;
  const al = P(t, 55.4, 56.0) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, TRI[0], TRI[1], TRI[2], TRI[3]);
  txt(ctx, 'mezzo tic, visto da terra', TRI[0] + 30, 150, { size: 30, color: C.dim, align: 'left' });
  const A = [XT, YT], Cc = [XT + AX, YT], B = [XT + AX, YT - AY];
  // gli specchi: all'inizio (chiari) e alla fine del mezzo tic
  specchio(ctx, XT, YT - AY, 1, true); specchio(ctx, XT, YT, 1, true);
  specchio(ctx, XT + AX, YT - AY, 1, false); specchio(ctx, XT + AX, YT, 1, false);
  txt(ctx, 'inizio', XT, YT + 36, { size: 26, color: C.dim });
  txt(ctx, 'fine', XT + AX, YT + 36, { size: 26, color: C.dim });
  freccia(ctx, [XT + 60, YT - AY - 50], [XT + AX - 60, YT - AY - 50], C.x, P(t, 55.7, 56.3), 5);
  // i cateti, poi l'ipotenusa
  const k1 = P(t, 55.9, 56.7), k2 = P(t, 57.7, 58.5), k3 = P(t, 61.0, 62.0);
  glowStroke(ctx, [A, Cc], k1, C.x, 6);
  glowStroke(ctx, [Cc, B], k2, C.ink, 6);
  glowStroke(ctx, [A, B], k3, C.y, 6);
  lampo(ctx, lerp(A[0], B[0], k3), lerp(A[1], B[1], k3), P(t, 60.9, 61.2));
  lampo(ctx, A[0], A[1], 1 - P(t, 60.9, 61.2));
  // il nome dei lati
  scritta(ctx, '{mx:v}·{mink:Δt}/2', XT + AX / 2, YT + 80, 38, P(t, 56.7, 57.2));
  scritta(ctx, '{mink:d} = {mink:c}·{mink:Δt₀}/2', XT + AX + 50, YT - AY / 2, 38, P(t, 58.6, 59.1), 'left');
  scritta(ctx, '{my:c}·{mink:Δt}/2', XT + AX / 2 - 60, YT - AY / 2 - 40, 38, P(t, 62.1, 62.6));
  drawRich(ctx, '{dim:la luce:}  {my:c}·{mink:Δt}/2', XT + AX + 60, YT - AY + 70, { size: 32, align: 'left', alpha: P(t, 62.6, 63.1) });
  // il pannello delle formule
  card(ctx, FORM[0], FORM[1], FORM[2], FORM[3], P(t, 65.3, 65.8));
  const cx = FORM[0] + FORM[2] / 2;
  ctx.save(); ctx.globalAlpha *= P(t, 65.3, 65.8);
  conFont(TITOLI, () => drawRich(ctx, 'Pitagora sul mezzo tic', cx, 172, { size: 40, weight: 600 }));
  drawRich(ctx, '({my:c}·{mink:Δt}/2)² = {mink:d}² + ({mx:v}·{mink:Δt}/2)²', cx, 248, { size: 40, local: t - 65.7 });
  drawRich(ctx, '{dim:con} {mink:d} = {mink:c}·{mink:Δt₀}/2', cx, 306, { size: 36, local: t - 68.7 });
  drawSeq(ctx, ['{mink:Δt =}', { num: '{mink:Δt₀}', den: '√(1 − {mx:v}²/{mink:c}²)' }, '{mink:= }{mv:γ}{mink:·Δt₀}'], cx, 410, 46, { local: t - 72.4 });
  drawRich(ctx, '{mv:γ}{dim:: il fattore gamma,} {mv:γ} = 1/√(1 − {mx:v}²/{mink:c}²){dim:, sempre ≥ 1}', cx, 500, { size: 30, local: t - 72.6 });
  drawRich(ctx, '{mx:v} = 0,6·{mink:c}{dim::} {mv:γ} = 1/√(1 − 0,36) = 1/0,8 = {g:1,25}', cx, 570, { size: 36, local: t - 80.1 });
  drawRich(ctx, '{dim:un tic:} 2 s {dim:a bordo,} 2 s·1,25 = {g:2,5 s} {dim:da terra}', cx, 630, { size: 34, local: t - 86.1 });
  drawRich(ctx, '{mx:v} = 0,9·{mink:c}{dim::} {mv:γ} ≈ {g:2,3}  {dim:·}  {mx:v} = 0,99·{mink:c}{dim::} {mv:γ} ≈ {g:7,1}', cx, 710, { size: 34, local: t - 91.6 });
  ctx.restore();
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'L’orologio a luce', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 108.5, 109.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Un orologio in moto batte più lento:\n{mink:Δt} = {mv:γ}{mink:·Δt₀}, con {mv:γ} {dim:≥} 1.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, 'tempo proprio {mink:Δt₀}:\nl’orologio {v:fermo}'], [960, '{mv:γ} = 1/√(1 − {mx:v}²/{mink:c}²)\n{dim:percorso a zig-zag, stessa} {mink:c}'], [1470, 'a 0,6·{mink:c}: {mv:γ} = {g:1,25}\na 0,99·{mink:c}: {mv:γ} ≈ {g:7,1}']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue il lampo, da specchio basso (0) a specchio alto (1);
  // nel moto a terra un pop per ogni tic: grave l'orologio fermo, acuto quello sul treno
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.5, .4],                                               // gli specchi
    ['pop', 9.9, .5], ['tono', 9.7, 11.7, [0, .5, 1, .5, 0]],                         // il lampo: un tic su e giù
    ['soffio', 13.6], ['pop', 14.7, .55], ['pop', 19.8, .5],                          // un tic, il tempo proprio
    ['soffio', 29.4], ['tono', 29.7, 32.2, [0, .5, 1, .5, 0]],                            // il treno parte: il lampo a zig-zag
    ['pop', 31.7, .35], ['pop', 32.2, .65], ['pop', 33.7, .35], ['pop', 34.7, .65],   // i tic: fermo ogni 2 s, treno ogni 2,5 s
    ['pop', 35.7, .35], ['pop', 37.2, .65], ['pop', 37.7, .35],
    ['pop', 39.7, .5],                                                                // fermo immagine: 5 contro 4
    ['pop', 40.1, .5], ['pop', 45.3, .55], ['ding', 50.0],                            // percorso più lungo, tic più lungo, 5 e 4
    ['soffio', 55.4], ['traccia', 55.9, 56.7], ['pop', 56.8, .4],                     // il triangolo: v·Δt/2
    ['traccia', 57.7, 58.5], ['pop', 58.7, .5],                                       // d
    ['traccia', 61.0, 62.0], ['tono', 61.0, 62.0, [0, .06, .5, .94, 1]], ['pop', 62.2, .6],   // la luce sull'ipotenusa
    ['soffio', 65.4], ['pop', 65.9, .5],                                             // Pitagora sul mezzo tic
    ['pop', 72.5, .6], ['ding', 80.7],                                                // Δt = γ·Δt₀, γ = 1,25
    ['pop', 86.3, .5], ['pop', 92.2, .75],                                           // 2,5 s; γ cresce: 2,3 e 7,1
    ['soffio', 99.6], ['pop', 101.6, .5], ['pop', 102.1, .6], ['pop', 102.6, .7],     // in una frase
  ];
  return {
    titolo: 'L’orologio a luce', durata: 110, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 29.3, 'l’orologio a luce'], [29.3, 55.3, 'visto da terra'], [55.3, T_FINE, 'quanto rallenta']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaOrologi(ctx, t); scenaPitagora(ctx, t); scenaFine(ctx, t); },
  };
});
