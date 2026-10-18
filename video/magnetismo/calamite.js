'use strict';
/* La calamita spezzata — i due poli (il nord è quello che si rivolge al nord geografico), poli uguali si respingono e
   diversi si attraggono; spezzata, ogni pezzo ha di nuovo N e S; le bussole attorno mostrano il campo magnetico B (in
   tesla), le linee di campo escono dal N, entrano nel S e proseguono dentro: sono chiuse. La Terra è una calamita con un
   polo sud magnetico vicino al polo nord geografico. Le linee sono calcolate (modello piano: la calamita come due fogli
   di correnti opposte, che dà linee chiuse anche dentro) e tracciate con Runge-Kutta; gli aghi seguono la direzione di
   quel campo. La calamita libera e gli aghi ruotano con l'equazione del pendolo smorzato (integrata).
   Colori fissi del magnetismo: polo nord C.ink pieno, polo sud chiaro col bordo scuro, campo B C.g, forze C.y. Argomento: magnetismo. */
CVIDEO.registra('magnetismo/calamite', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, crossMark } = M;
  const TAU = Math.PI * 2;

const T_FINE = 94.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.3, 'felice'], [19.5, 'neutro'],
  [27.1, 'pensa'], [31.3, 'sorpreso'], [33.5, 'felice'], [35.9, 'neutro'], [45.5, 'pensa'], [50.3, 'neutro'],
  [55.5, 'felice'], [57.6, 'neutro'], [69.5, 'sorpreso'], [71.6, 'neutro'], [74.3, 'felice'], [79.9, 'neutro'],
  [88.9, 'sorpreso'], [91.0, 'neutro'], [96.4, 'felice'], [100.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Se spezzo una calamita a metà,\nche cosa ottengo?'],
  [7.9, 12.2, 'Una calamita ha due estremità\ndove attira di più: i {g:poli}.'],
  [12.3, 17.2, 'Libera di girare, si ferma con\nun polo rivolto verso il {g:nord}.'],
  [17.3, 22.0, 'Quel polo si chiama nord (N),\nl’altro sud (S).'],
  [22.1, 27.0, 'Poli {g:diversi} si attraggono,\npoli {g:uguali} si respingono.'],
  [27.1, 31.2, 'Ora la spezzo. Ogni pezzo\nsarà un polo solo?'],
  [31.3, 35.8, 'No: ogni pezzo ha {g:di nuovo}\nun nord e un sud!'],
  [35.9, 40.2, 'La spezzo ancora: quattro\ncalamite, tutte con due poli.'],
  [40.3, 45.4, 'Dentro è fatta di calamite\n{g:piccolissime}, tutte allineate.'],
  [45.5, 50.2, 'Un nord da solo, senza un sud,\nnon l’ha mai trovato nessuno.'],
  [50.3, 55.4, 'Le bussole attorno si orientano:\nc’è un {g:campo magnetico} {mg:B}.'],
  [55.5, 60.6, '{mg:B} va dove punta il nord dell’ago.\nSi misura in {g:tesla} (T).'],
  [60.7, 65.0, 'Seguendo gli aghi disegno\nle {g:linee di campo}.'],
  [65.1, 69.4, 'Escono dal polo nord\ned entrano nel polo sud…'],
  [69.5, 74.2, '…e dentro la calamita proseguono:\nsono linee {g:chiuse}.'],
  [74.3, 79.8, 'Per questo dove la spezzi, da una\nparte escono (N), dall’altra entrano (S).'],
  [79.9, 84.4, 'Anche la Terra è una calamita:\nper questo la bussola funziona.'],
  [84.5, 88.8, 'Il nord dell’ago è attratto\nda un polo sud magnetico…'],
  [88.9, 93.8, '…quindi vicino al polo nord\ngeografico c’è un polo sud magnetico.'],
  [96.4, 102.6, 'Spezzala quanto vuoi: ogni pezzo ha\nun nord e un sud. Le linee sono chiuse.'],
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
// una sbarretta orizzontale da x0 a x1 (centro y, alta h): a sinistra di xm il colore del sud, a destra quello del nord
// (kc = 0: grigia, poli ancora senza nome); lettere: scrive S e N al centro delle due parti
function sbarra(ctx, x0, x1, y, h, xm, kc = 1, al = 1, lettere = true) {
  if (al <= 0 || x1 - x0 < 1) return;
  const grigio = mix(C.dim, C.paper, .3), cS = mix(grigio, mix(C.dim, C.paper, .55), kc), cN = mix(grigio, C.ink, kc);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.roundRect(x0, y - h / 2, x1 - x0, h, Math.min(10, h * .15)); ctx.save(); ctx.clip();
  ctx.fillStyle = css(cS); ctx.fillRect(x0, y - h / 2, Math.max(0, xm - x0), h);
  ctx.fillStyle = css(cN); ctx.fillRect(xm, y - h / 2, Math.max(0, x1 - xm), h);
  ctx.restore();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .15)); ctx.lineWidth = 3; ctx.stroke();
  if (lettere && kc > 0) {
    const fs = Math.round(Math.min(h * .55, 56));
    if (xm - x0 > fs) txt(ctx, 'S', (x0 + xm) / 2, y + 2, { size: fs, weight: 600, color: C.ink, alpha: kc });
    if (x1 - xm > fs) txt(ctx, 'N', (xm + x1) / 2, y + 2, { size: fs, weight: 600, color: C.paper, alpha: kc });
  }
  ctx.restore();
}
// la stessa sbarretta, centrata in c e ruotata di ang (l'asse punta verso il nord)
function sbarraRuotata(ctx, c, ang, L, h, kc = 1, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(ang);
  sbarra(ctx, -L / 2, L / 2, 0, h, 0, kc, al, false);
  ctx.restore();
  if (kc > 0) {   // le lettere restano dritte
    const fs = Math.round(Math.min(h * .55, 56)), ax = Math.cos(ang), ay = Math.sin(ang);
    txt(ctx, 'N', c[0] + ax * L / 4, c[1] + ay * L / 4 + 2, { size: fs, weight: 600, color: C.paper, alpha: al * kc });
    txt(ctx, 'S', c[0] - ax * L / 4, c[1] - ay * L / 4 + 2, { size: fs, weight: 600, color: C.ink, alpha: al * kc });
  }
}
// l'ago di una bussola: punta nord scura, coda sud chiara; con la cassa se r > 0
function ago(ctx, p, ang, s, al = 1, cassa = 0) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]);
  if (cassa > 0) {
    ctx.fillStyle = C.paper; ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, cassa, 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.rotate(ang);
  const w = s * .26;
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = Math.max(1.5, s * .05); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(0, 0, Math.max(2.5, s * .09), 0, TAU); ctx.fill();
  ctx.restore();
}
// rotazione libera di un ago o di una calamita su un perno: θ'' = −ω0²·sin(θ − θf) − 2γ·θ', integrata una volta sola
function oscilla(th0, thF, w0, gam, dur) {
  const n = Math.ceil(dur * 240), tab = [th0]; let th = th0, om = 0;
  const dt = 1 / 960;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 4; j++) { const a = -w0 * w0 * Math.sin(th - thF) - 2 * gam * om; om += a * dt; th += om * dt; }
    tab.push(th);
  }
  return tau => { if (tau <= 0) return th0; const i = Math.min(tab.length - 1, tau * 240), i0 = Math.floor(i), i1 = Math.min(tab.length - 1, i0 + 1); return lerp(tab[i0], tab[i1], i - i0); };
}

// ---------- il campo di una calamita (modello piano: due fogli di correnti opposte lungo i lati lunghi) ----------
function calamitaModello(cx, cy, L, h, ang, n) { return { cx, cy, L, h, ax: Math.cos(ang), ay: Math.sin(ang), n }; }
function locale(m, x, y) { const dx = x - m.cx, dy = y - m.cy; return [dx * m.ax + dy * m.ay, dx * m.ay - dy * m.ax]; }   // u verso N, w verso il lato «sopra»
function campoBarra(m, x, y) {
  const [u, w] = locale(m, x, y);
  let bu = 0, bw = 0;
  for (let i = 0; i < m.n; i++) {
    const uk = -m.L / 2 + m.L * (i + .5) / m.n;
    for (let s = 1; s >= -1; s -= 2) { const du = u - uk, dw = w - s * m.h / 2, r2 = du * du + dw * dw + 4; bu -= s * dw / r2; bw += s * du / r2; }
  }
  return [bu * m.ax + bw * m.ay, bu * m.ay - bw * m.ax];
}
// una linea di campo per p0, seguita nei due versi (Runge-Kutta, passo 3 px) finché si chiude o esce dal riquadro largo
function segui(campo, p0, verso) {
  const dir = (x, y) => { const b = campo(x, y), l = Math.hypot(b[0], b[1]) || 1; return [verso * b[0] / l, verso * b[1] / l]; };
  const pts = [p0]; let x = p0[0], y = p0[1];
  for (let i = 0; i < 6000; i++) {
    const h = 3, k1 = dir(x, y), k2 = dir(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = dir(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
    x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (i > 40 && Math.hypot(x - p0[0], y - p0[1]) < 4.5) { pts.push(p0); return { pts, chiusa: true }; }
    pts.push([x, y]);
    if (x < -900 || x > 2800 || y < -1100 || y > 2200) break;
  }
  return { pts, chiusa: false };
}
function lineaPer(campo, p0) {
  const a = segui(campo, p0, 1);
  if (a.chiusa) return a.pts;
  return segui(campo, p0, -1).pts.reverse().concat(a.pts.slice(1));
}
function tracciaLinea(ctx, pts, k, col, w = 3.5) {
  if (k <= 0) return;
  const n = Math.max(2, Math.round(pts.length * k));
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke(); ctx.restore();
}
function puntaSu(ctx, pts, i, col, al, s = 1) {
  if (al <= 0 || i < 1 || i >= pts.length - 1) return;
  const a = pts[i - 1], b = pts[i + 1];
  ctx.save(); ctx.globalAlpha *= al; arrowHead(ctx, pts[i], Math.atan2(b[1] - a[1], b[0] - a[0]), col, s); ctx.restore();
}
const COL_B = () => mix(C.g, C.paper, .12);
// un polo da solo, in un tassello: N scuro con lettera chiara, S chiaro con bordo e lettera scuri
function tassello(ctx, x, y, n, al = 1, r = 26) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(n === 'N' ? C.ink : mix(C.dim, C.paper, .55)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - r, y - r, 2 * r, 2 * r, 8); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, n, x, y + 2, { size: Math.max(30, Math.round(r * 1.45)), weight: 600, color: n === 'N' ? C.paper : C.ink, alpha: al });
}

const CARTA = [110, 110, 1000, 680], DESTRA = [1150, 110, 660, 680];

// ---------- 1 · i poli (7,9–27) ----------
const CA = [610, 470], LA = 440, HA = 100;
const GIRO = oscilla(0, -Math.PI / 2, TAU / 1.9, .75, 8);   // la calamita libera: da orizzontale al nord
const T_GIRO = 12.6;
// la limatura attaccata alle estremità: trattini a ventaglio (fissi)
const LIMATURA = [];
for (const lato of [1, -1]) for (let i = 0; i < 11; i++) {
  const a = (-62 + i * 12.4) * Math.PI / 180, r = 18 + (i * 7) % 26;
  const bx = lato * (LA / 2) + lato * Math.cos(a) * r, by = Math.sin(a) * (HA / 2 + r * .8);
  LIMATURA.push([bx, by, lato > 0 ? a : Math.PI - a]);
}
function scenePoli(ctx, t) {
  const al = life(t, 7.9, 22.6, .5, .5);
  if (al > 0) {
    ctx.save(); ctx.globalAlpha *= al;
    const ang = GIRO(t - T_GIRO), kc = P(t, 17.4, 18.0);
    // la limatura resta attaccata solo agli estremi, poi la tolgo
    const kl = P(t, 8.6, 9.4) * (1 - P(t, 11.9, 12.4));
    if (kl > 0) {
      ctx.save(); ctx.globalAlpha *= kl; ctx.translate(CA[0], CA[1]); ctx.strokeStyle = css(mix(C.ink, C.paper, .35)); ctx.lineWidth = 4; ctx.lineCap = 'round';
      LIMATURA.forEach(([x, y, a]) => { ctx.beginPath(); ctx.moveTo(x - 9 * Math.cos(a), y - 9 * Math.sin(a)); ctx.lineTo(x + 9 * Math.cos(a), y + 9 * Math.sin(a)); ctx.stroke(); });
      ctx.restore();
      txt(ctx, 'limatura di ferro', CA[0], CA[1] + 130, { size: 30, color: C.dim, alpha: kl });
    }
    sbarraRuotata(ctx, CA, ang, LA, HA, kc, P(t, 7.9, 8.5));
    // il perno, e la freccia del nord geografico
    const kp = P(t, 12.1, 12.5);
    if (kp > 0) { ctx.save(); ctx.globalAlpha *= kp; ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(CA[0], CA[1], 11, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
    freccia(ctx, [1010, 430], [1010, 250], C.ink, kp, 5);
    txt(ctx, 'nord', 1010, 165, { size: 34, weight: 600, alpha: kp });
    txt(ctx, 'geografico', 1010, 207, { size: 30, color: C.dim, alpha: kp });
    ctx.restore();
  }
  // poli uguali e diversi
  const ap = life(t, 22.3, 27.4, .5, .4);
  if (ap > 0) {
    ctx.save(); ctx.globalAlpha *= ap;
    sbarra(ctx, 170, 470, 290, 90, 320);
    sbarra(ctx, 650, 950, 290, 90, 800);
    freccia(ctx, [270, 212], [390, 212], C.y, P(t, 22.9, 23.4), 6);
    freccia(ctx, [850, 212], [730, 212], C.y, P(t, 22.9, 23.4), 6);
    drawRich(ctx, '{g:si attraggono}', 560, 372, { size: 36, local: t - 23.0 });
    sbarra(ctx, 170, 470, 560, 90, 320);
    sbarraRuotata(ctx, [800, 560], Math.PI, 300, 90, 1, 1);
    freccia(ctx, [390, 482], [270, 482], C.y, P(t, 24.9, 25.4), 6);
    freccia(ctx, [730, 482], [850, 482], C.y, P(t, 24.9, 25.4), 6);
    drawRich(ctx, '{g:si respingono}', 560, 642, { size: 36, local: t - 25.0 });
    ctx.restore();
  }
}

// ---------- 2 · la calamita spezzata (27–50) ----------
const YB = 400, HB = 110;
function sceneSpezza(ctx, t) {
  const al = life(t, 27.2, 50.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g1 = 70 * P(t, 27.8, 28.6) * (1 - P(t, 40.4, 41.4));
  const g2 = 50 * P(t, 36.2, 37.0) * (1 - P(t, 40.4, 41.4));
  const k1 = P(t, 31.4, 32.2), k2 = P(t, 37.0, 37.8);
  const unisci = P(t, 40.4, 41.4);   // tornando insieme, i poli interni spariscono: resta un nord e un sud
  const mini = P(t, 41.6, 42.4);
  const vela = 1 - .72 * mini, lett = mini < .05;
  if (t < 35.9 || g2 <= 0) {
    // due pezzi (o uno solo)
    const sx = -g1 / 2, dx = g1 / 2;
    const xmL = lerp(610, 450, k1 * (1 - unisci)), xmR = lerp(610, 770, k1 * (1 - unisci));
    if (g1 < .5 && (t < 28 || unisci >= 1)) sbarra(ctx, 290, 930, YB, HB, 610, 1, vela, lett);
    else {
      sbarra(ctx, 290 + sx, 610 + sx, YB, HB, xmL + sx, 1, vela, lett);
      sbarra(ctx, 610 + dx, 930 + dx, YB, HB, xmR + dx, 1, vela);
    }
  } else {
    const o = [-g1 / 2 - g2, -g1 / 2, g1 / 2, g1 / 2 + g2];
    const base = [[290, 450], [450, 610], [610, 770], [770, 930]];
    base.forEach(([a, b], i) => {
      const nuovo = i % 2 === 0 ? lerp(b, (a + b) / 2, k2) : lerp(a, (a + b) / 2, k2);
      const xm = lerp(nuovo, i < 2 ? b : a, unisci);   // riunita: metà sinistra tutta sud, metà destra tutta nord
      sbarra(ctx, a + o[i], b + o[i], YB, HB, xm + o[i], 1, vela, lett);
    });
  }
  // l'ipotesi, in rosso, e la sua smentita
  const kh = P(t, 28.5, 29.0) * (1 - P(t, 33.4, 33.9));
  if (kh > 0) {
    fondo(ctx, 415, 300, 190, 54, kh); drawRich(ctx, '{r:solo S?}', 415, 300, { size: 40, alpha: kh });
    fondo(ctx, 805, 300, 190, 54, kh); drawRich(ctx, '{r:solo N?}', 805, 300, { size: 40, alpha: kh });
    ctx.save(); ctx.globalAlpha *= kh;
    crossMark(ctx, 540, 300, P(t, 31.6, 32.1), C.r, .5); crossMark(ctx, 930, 300, P(t, 31.8, 32.3), C.r, .5);
    ctx.restore();
  }
  // dentro: tante calamite piccolissime, tutte nello stesso verso
  if (mini > 0) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 12; c++) {
      const x = 290 + 53.33 * (c + .5), y = YB - 36 + r * 36, k = P(t, 41.6 + c * .04, 42.2 + c * .04);
      sbarra(ctx, x - 20, x + 20, y, 16, x, 1, k, false);
    }
  }
  // un polo da solo
  const km = P(t, 45.6, 46.1);
  if (km > 0) {
    ctx.save(); ctx.globalAlpha *= km;
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(400, 620, 44, 0, TAU); ctx.fill();
    txt(ctx, 'N', 400, 622, { size: 46, weight: 600, color: C.paper });
    crossMark(ctx, 500, 620, P(t, 46.4, 47.0), C.ink, .5);
    drawRich(ctx, '{dim:un polo da solo:} mai osservato', 565, 620, { size: 34, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · il campo e le linee (50–80) ----------
const MC = calamitaModello(610, 450, 380, 96, 0, 40);
const campoC = (x, y) => campoBarra(MC, x, y);
// le linee partono da dentro la calamita, a metà, a quote w diverse; solo le tre coppie che si chiudono dentro la scheda
const LINEE_C = [.2, -.2, .29, -.29, .4, -.4].map(f => {
  const p0 = [610, 450 - f * 96], pts = lineaPer(campoC, p0);
  // la punta interna, sfalsata da linea a linea (u = −110, 0, +110) perché non facciano una sbarra sola
  const uIn = [0, 110, -110][Math.round(Math.abs(f) / .11) % 3];
  let iIn = 1;
  for (let i = 1; i < pts.length; i++) { const a = locale(MC, pts[i - 1][0], pts[i - 1][1]), b = locale(MC, pts[i][0], pts[i][1]); if ((a[0] - uIn) * (b[0] - uIn) <= 0 && Math.abs(b[1]) < MC.h / 2) { iIn = i; break; } }
  // le punte di fuori: dove la linea ripassa sopra o sotto la calamita (u = 0), se è dentro la scheda;
  // altrimenti davanti ai poli (u = ±300)
  const fuori = [], poli = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = locale(MC, pts[i - 1][0], pts[i - 1][1]), b = locale(MC, pts[i][0], pts[i][1]), p = pts[i];
    const inScheda = p[0] > 150 && p[0] < 1070 && p[1] > 150 && p[1] < 750;
    if (!inScheda) continue;
    if (a[0] * b[0] <= 0 && Math.abs(b[1]) > MC.h / 2 + 2) fuori.push(i);
    for (const uu of [-300, 300]) if ((a[0] - uu) * (b[0] - uu) <= 0) poli.push(i);
  }
  return { pts, iIn, punte: fuori.length ? fuori : poli };
});
const BUSSOLE = [];
for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) {
  const x = 190 + 120 * i, y = 170 + 112 * j;
  if (x > 370 && x < 850 && y > 352 && y < 548) continue;
  const b = campoC(x, y), thF = Math.atan2(b[1], b[0]);
  let th0 = -Math.PI / 2 + .9 * Math.sin(i * 1.7 + j * 2.3);
  while (th0 - thF > Math.PI) th0 -= TAU; while (th0 - thF < -Math.PI) th0 += TAU;
  BUSSOLE.push({ p: [x, y], thF, giro: oscilla(th0, thF, TAU / 1.3, 1.5, 6) });
}
const B_SCELTA = BUSSOLE.reduce((m, b) => Math.hypot(b.p[0] - 910, b.p[1] - 394) < Math.hypot(m.p[0] - 910, m.p[1] - 394) ? b : m, BUSSOLE[0]);
function sceneCampo(ctx, t) {
  const al = life(t, 50.4, 80.3, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const kl = P(t, 60.9, 62.7), kFr = P(t, 65.2, 65.7), kIn = P(t, 69.6, 70.2);
  const colB = COL_B();
  LINEE_C.forEach(l => tracciaLinea(ctx, l.pts, kl, colB));
  LINEE_C.forEach(l => l.punte.forEach(i => puntaSu(ctx, l.pts, i, colB, kFr)));
  // la calamita; poi, dentro, le linee che proseguono
  sbarra(ctx, 420, 800, 450, 96, 610, 1, P(t, 50.4, 50.9) * (1 - .6 * kIn));
  if (kIn > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(420, 402, 380, 96); ctx.clip(); ctx.globalAlpha *= kIn;
    LINEE_C.forEach(l => { tracciaLinea(ctx, l.pts, 1, C.g, 4); });
    LINEE_C.forEach(l => puntaSu(ctx, l.pts, l.iIn, C.g, 1, .9));
    ctx.restore();
  }
  // le bussole, che si orientano; poi si fanno chiare sotto le linee
  const kb = P(t, 50.5, 51.0), sbiad = 1 - .7 * P(t, 61.0, 62.0);
  BUSSOLE.forEach(b => {
    const ang = b.giro(t - 51.0), sc = b === B_SCELTA ? lerp(1, 1.25, life(t, 55.5, 60.8, .3, .4)) : 1;
    ago(ctx, b.p, ang, 30 * sc, kb * sbiad);
  });
  const kB = life(t, 55.6, 60.8, .4, .4);
  if (kB > 0) {
    const p = B_SCELTA.p, a = B_SCELTA.thF, tip = [p[0] + 105 * Math.cos(a), p[1] + 105 * Math.sin(a)];
    freccia(ctx, [p[0] + 44 * Math.cos(a), p[1] + 44 * Math.sin(a)], tip, C.g, kB, 6);
    const mB = [p[0] + 75 * Math.cos(a), p[1] + 75 * Math.sin(a) + 52];   // sotto la freccia, fra due bussole
    fondo(ctx, mB[0], mB[1], 50, 50, kB); drawRich(ctx, '{mg:B}', mB[0], mB[1], { size: 44, alpha: kB });
  }
  // il taglio: da una parte le linee escono, dall'altra entrano
  const kt = P(t, 74.4, 74.9);
  if (kt > 0) {
    ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.moveTo(610, 386); ctx.lineTo(610, 514); ctx.stroke(); ctx.restore();
    tassello(ctx, 575, 450, 'N', kt, 20); tassello(ctx, 645, 450, 'S', kt, 20);   // sulla calamita, fra i due fasci di linee interne
  }
  ctx.restore();
}

// ---------- 4 · la Terra (80–94) ----------
const EC = [560, 450], ER = 200;
const ME = calamitaModello(EC[0], EC[1], 180, 50, Math.PI / 2 + .19, 30);   // il nord della calamita in basso: il sud in alto
const campoE = (x, y) => campoBarra(ME, x, y);
const LINEE_E = [];
for (const d of [18, 75, 160]) for (const s of [1, -1]) {
  const p0 = [EC[0] + s * (ER + d), EC[1]], pts = lineaPer(campoE, p0);
  let i0 = 1; for (let i = 0; i < pts.length; i++) if (pts[i] === p0) { i0 = Math.max(1, i); break; }
  LINEE_E.push({ pts, i0 });
}
const PB = [EC[0] + (ER + 78) * Math.cos(-.52), EC[1] + (ER + 78) * Math.sin(-.52)];
const ANG_PB = (() => { const b = campoE(PB[0], PB[1]); return Math.atan2(b[1], b[0]); })();
const S_MAG = [EC[0] - ME.ax * ME.L / 2 * .62, EC[1] - ME.ay * ME.L / 2 * .62];
function sceneTerra(ctx, t) {
  const al = life(t, 80.0, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  const kl = P(t, 80.6, 82.0), colB = COL_B();
  LINEE_E.forEach(l => { tracciaLinea(ctx, l.pts, kl, colB); puntaSu(ctx, l.pts, l.i0, colB, P(t, 81.8, 82.3)); });
  // la Terra
  const kT = P(t, 80.0, 80.6);
  ctx.save(); ctx.globalAlpha *= kT * .9; ctx.fillStyle = css(mix(C.dim, C.paper, .8)); ctx.strokeStyle = css(mix(C.dim, C.paper, .3)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(EC[0], EC[1], ER, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= kT; ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
  ctx.beginPath(); ctx.moveTo(EC[0], EC[1] - ER - 40); ctx.lineTo(EC[0], EC[1] + ER + 40); ctx.stroke(); ctx.restore();
  sbarraRuotata(ctx, EC, Math.atan2(ME.ay, ME.ax), ME.L, ME.h, 1, kT * .95);
  fondo(ctx, EC[0], EC[1] - ER - 70, 330, 46, kT); txt(ctx, 'polo nord geografico', EC[0], EC[1] - ER - 70, { size: 32, color: C.ink, alpha: kT });
  fondo(ctx, EC[0], EC[1] + ER + 70, 320, 46, kT); txt(ctx, 'polo sud geografico', EC[0], EC[1] + ER + 70, { size: 32, color: C.dim, alpha: kT });
  // il sud magnetico, vicino al nord geografico
  const ks = life(t, 84.6, T_FINE + .1, .4, .4);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(S_MAG[0], S_MAG[1], 40 + 4 * Math.sin((t - 84.6) * 5), 0, TAU); ctx.stroke(); ctx.restore();
  }
  const kn = P(t, 89.0, 89.5);
  if (kn > 0) { fondo(ctx, 448, 300, 196, 76, kn * .9); drawRich(ctx, 'polo sud\nmagnetico', 448, 300, { size: 30, alpha: kn }); }
  // la bussola: il suo nord va verso il nord geografico
  const kb = P(t, 82.2, 82.7);
  ago(ctx, PB, ANG_PB, 34, kb, 46);
  ctx.restore();
}

function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, ...DESTRA, life(t, 7.9, T_FINE + .1, .5, .5));
}
function scenePannello(ctx, t) {
  const cx = 1480;
  const s1 = life(t, 7.9, 27.0, .5, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    conFont(TITOLI, () => drawRich(ctx, 'i poli', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:dove la calamita attira di più}', cx, 245, { size: 32, local: t - 8.2 });
    drawRich(ctx, 'N {dim:nord: si rivolge}', cx, 330, { size: 36, local: t - 17.4 });
    drawRich(ctx, '{dim:verso il nord geografico}', cx, 378, { size: 32, local: t - 17.6 });
    drawRich(ctx, 'S {dim:sud: l’altro polo}', cx, 448, { size: 36, local: t - 18.4 });
    separa(ctx, 505, P(t, 22.1, 22.5));
    drawRich(ctx, '{dim:diversi:} {g:si attraggono}', cx, 565, { size: 36, local: t - 22.3 });
    drawRich(ctx, '{dim:uguali:} {g:si respingono}', cx, 630, { size: 36, local: t - 24.6 });
    ctx.restore();
  }
  const s2 = life(t, 27.1, 50.4, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    conFont(TITOLI, () => drawRich(ctx, 'spezzata', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:ogni pezzo ha}', cx, 260, { size: 34, local: t - 31.5 });
    drawRich(ctx, '{dim:un} nord {dim:e un} sud', cx, 310, { size: 36, local: t - 31.7 });
    separa(ctx, 370, P(t, 40.3, 40.7));
    drawRich(ctx, '{dim:dentro: calamite}', cx, 430, { size: 34, local: t - 40.5 });
    drawRich(ctx, '{dim:piccolissime, allineate}', cx, 478, { size: 34, local: t - 40.7 });
    separa(ctx, 540, P(t, 45.5, 45.9));
    drawRich(ctx, '{dim:un polo da solo:}', cx, 600, { size: 34, local: t - 45.7 });
    drawRich(ctx, 'mai osservato', cx, 650, { size: 36, local: t - 45.9 });
    ctx.restore();
  }
  const s3 = life(t, 50.3, 80.0, .4, .4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    conFont(TITOLI, () => drawRich(ctx, 'campo magnetico', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{mg:B}{dim:, in tesla (T)}', cx, 250, { size: 40, local: t - 50.6 });
    drawRich(ctx, '{dim:va dove punta il} nord {dim:dell’ago}', cx, 310, { size: 32, local: t - 55.7 });
    separa(ctx, 365, P(t, 60.7, 61.1));
    drawRich(ctx, '{g:linee di campo}', cx, 415, { size: 36, local: t - 60.9 });
    drawRich(ctx, '{dim:escono dal} N{dim:, entrano nel} S', cx, 480, { size: 34, local: t - 65.2 });
    drawRich(ctx, '{dim:dentro vanno dal} S {dim:al} N', cx, 540, { size: 34, local: t - 69.6 });
    drawRich(ctx, '{dim:sono} {g:chiuse}', cx, 600, { size: 36, local: t - 72.0 });
    drawRich(ctx, '{dim:taglio: da un lato} N{dim:, dall’altro} S', cx, 680, { size: 30, local: t - 74.5 });
    ctx.restore();
  }
  const s4 = life(t, 79.9, T_FINE + .1, .4, .5);
  if (s4 > 0) {
    ctx.save(); ctx.globalAlpha *= s4;
    conFont(TITOLI, () => drawRich(ctx, 'la Terra', cx, 175, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:è una grande calamita}', cx, 250, { size: 34, local: t - 80.1 });
    drawRich(ctx, '{dim:l’ago punta il suo} N', cx, 340, { size: 34, local: t - 82.4 });
    drawRich(ctx, '{dim:verso il nord geografico}', cx, 388, { size: 34, local: t - 82.6 });
    separa(ctx, 450, P(t, 84.5, 84.9));
    drawRich(ctx, '{dim:diversi si attraggono:}', cx, 510, { size: 34, local: t - 84.7 });
    drawRich(ctx, '{dim:vicino al nord geografico}', cx, 590, { size: 34, local: t - 89.0 });
    drawRich(ctx, '{dim:c’è un polo} sud {dim:magnetico}', cx, 638, { size: 34, local: t - 89.2 });
    ctx.restore();
  }
}

function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La calamita spezzata', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 103.8, 104.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Una calamita ha sempre due poli:\nle sue linee di campo sono chiuse.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'fuori dal N al S,\ndentro dal S al N'], [960, '{mg:B} {dim:in tesla (T)}\n{dim:dove punta il nord dell’ago}'], [1470, 'vicino al nord geografico\nun polo sud magnetico']];
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

  // effetti sonori (strumenti/suoni-sintesi.py): la calamita libera e la bussola grande sono simulate; il tono segue
  // il loro angolo, ricavato rieseguendo oscilla() (la calamita: orizzontale 0, verso il nord 0,6, con l'oscillazione)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .45], ['pop', 8.7, .4],                             // la calamita, la limatura
    ['pop', 12.2, .4],                                                                // il perno, il nord geografico
    ['tono', 12.6, 15.4, [0, .08, .27, .52, .73, .84, .84, .76, .64, .54, .49, .49, .53, .59, .63]],   // gira verso il nord
    ['pop', 17.5, .55],                                                               // N e S
    ['soffio', 22.3], ['pop', 23.0, .5], ['pop', 25.0, .5],                           // si attraggono, si respingono
    ['soffio', 27.2], ['pop', 27.9, .3], ['pop', 28.6, .4],                           // la spezzo; solo S? solo N?
    ['pop', 31.5, .55], ['ding', 32.2],                                               // di nuovo un nord e un sud
    ['pop', 36.3, .3], ['pop', 37.1, .55],                                            // spezzata ancora
    ['pop', 41.3, .4], ['tono', 41.6, 42.8, [.3, .4, .5, .6, .7]],                    // riunita; le calamite piccolissime
    ['pop', 45.7, .5], ['pop', 46.5, .3],                                             // un polo da solo: mai
    ['soffio', 50.4], ['pop', 50.6, .45], ['tono', 51.0, 52.5, [.33, .5, .74, .79, .71, .64, .64]],   // le bussole si orientano
    ['pop', 55.7, .55],                                                               // B
    ['traccia', 60.9, 62.7],                                                          // le linee di campo
    ['pop', 65.3, .45], ['pop', 69.7, .5], ['ding', 72.1],                            // escono dal N; dentro; chiuse
    ['pop', 74.5, .55],                                                               // il taglio
    ['soffio', 80.0], ['traccia', 80.6, 82.0], ['pop', 82.3, .45],                    // la Terra, le linee, la bussola
    ['pop', 84.7, .5], ['ding', 89.1],                                                // il polo sud magnetico
    ['soffio', 94.1], ['pop', 96.4, .5], ['pop', 96.9, .6], ['pop', 97.4, .7],        // in una frase
  ];
  return {
    titolo: 'La calamita spezzata', durata: 105, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.0, 'i due poli'], [27.0, 50.2, 'la calamita spezzata'], [50.2, 79.8, 'il campo magnetico'], [79.8, T_FINE, 'la Terra']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); scenePoli(ctx, t); sceneSpezza(ctx, t); sceneCampo(ctx, t); sceneTerra(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
