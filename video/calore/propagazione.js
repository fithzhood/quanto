'use strict';
/* Conduzione, convezione, irraggiamento — il cucchiaio d'acciaio che si scalda e quello di legno no (diffusione vera
   lungo il manico); l'acqua che gira nella pentola (correnti convettive); il Sole che scalda attraverso il vuoto. Argomento: calore. */
CVIDEO.registra('calore/propagazione', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [82.4, 190], [83.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [82.4, 1050], [83.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [82.4, 2.2], [83.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [82.4, 2], [83.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [82.4, -1.5], [83.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.3, 'sorpreso'], [19.5, 'neutro'],
  [21.7, 'felice'], [23.9, 'neutro'], [45.1, 'sorpreso'], [47.3, 'neutro'], [54.3, 'felice'], [56.5, 'neutro'],
  [68.3, 'sorpreso'], [70.5, 'neutro'], [77.9, 'felice'], [80.1, 'neutro'], [84.9, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Come passa il calore\nda un corpo all’altro?'],
  [7.9, 12.3, 'Due cucchiai nel tè caldo:\nuno d’acciaio, uno di legno.'],
  [12.5, 17.1, 'Il manico d’acciaio si scalda\nfino in cima…'],
  [17.3, 21.5, '…quello di legno resta freddo.'],
  [21.7, 26.3, 'È la {g:conduzione}: il calore passa\nper contatto, dentro il materiale.'],
  [26.5, 31.1, 'Le particelle più calde vibrano di più\ne agitano le vicine.'],
  [31.3, 35.7, 'Ma restano al loro posto:\nla materia non si sposta.'],
  [35.9, 40.3, 'I metalli sono {g:buoni conduttori};\nlegno e aria sono {x:isolanti}.'],
  [40.5, 44.9, 'Una pentola d’acqua sul fuoco:\nseguo alcuni pezzetti d’acqua.'],
  [45.1, 49.7, 'Sul fondo l’acqua si scalda,\ndiventa {g:meno densa} e sale…'],
  [49.9, 54.1, '…in alto si raffredda, torna\npiù densa e scende ai lati.'],
  [54.3, 58.9, 'È la {g:convezione}: il calore viaggia\ncon il fluido che si sposta.'],
  [59.1, 63.5, 'Così il termosifone scalda la stanza:\nl’aria calda sale.'],
  [63.7, 68.1, 'Fra il Sole e la Terra c’è il vuoto:\nniente particelle.'],
  [68.3, 72.9, 'Eppure il Sole ci scalda: con le\n{v:onde elettromagnetiche}.'],
  [73.1, 77.7, 'È l’{g:irraggiamento}: viaggia anche\nnel vuoto, alla velocità della luce.'],
  [77.9, 82.1, 'Dal Sole a noi, circa 8 minuti.'],
  [84.9, 90.1, 'Contatto, fluido che si muove,\nonde: tre strade per il calore.'],
];

// ---------- aiutanti ----------
const h = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
const titolo = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
function erfc(x) {   // Abramowitz e Stegun 7.1.26, x ≥ 0
  const t = 1 / (1 + .3275911 * x), y = t * (.254829592 + t * (-.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return y * Math.exp(-x * x);
}
const colT = tc => mix(C.x, C.y, clamp((tc - 20) / 70));   // azzurro a 20 °C, arancio a 90 °C

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Conduzione, convezione,\nirraggiamento', W / 2, 235, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al, lh: 1.1 }));
}

// 1 · conduzione (7.5–40.4): manico lungo L, punta nel tè a 90 °C; T(s) = 20 + 70·erfc(s/ℓ), con ℓ = 2·√(α·t).
// Il legno conduce circa 40 volte più piano dell'acciaio: a parità di tempo la sua ℓ è √40 volte più corta.
const ELLE = t => 1.6 * Math.sqrt(P(t, 12.7, 21.3, E.lin));   // in lunghezze di manico; il tempo è accelerato
const tManico = (s, l) => l <= 0 ? (s <= 0 ? 90 : 20) : 20 + 70 * erfc(Math.max(0, s) / l);
function tazza(ctx, c, legno, l, t) {
  // la tazza e il tè
  ctx.fillStyle = css(mix(C.y, [110, 60, 25], .55), .5);
  ctx.beginPath(); ctx.moveTo(c - 126, 440); ctx.lineTo(c + 126, 440); ctx.lineTo(c + 100, 640); ctx.lineTo(c - 100, 640); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(c - 132, 400); ctx.lineTo(c - 100, 640); ctx.lineTo(c + 100, 640); ctx.lineTo(c + 132, 400); ctx.stroke();
  ctx.beginPath(); ctx.arc(c - 150, 500, 40, Math.PI * .5, Math.PI * 1.5); ctx.stroke();
  // il vapore del tè
  ctx.strokeStyle = css(C.dim, .45); ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) { ctx.beginPath(); const x0 = c - 70 + i * 50; for (let k = 0; k <= 10; k++) { const y = 425 - k * 7, x = x0 + Math.sin(t * 2.5 + i * 2 + k * .55) * 6; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  // il cucchiaio: la parte nel tè è a 90 °C, il manico prende la temperatura che gli arriva
  const base = legno ? MARRONE : mix(C.dim, C.paper, .15), w = legno ? 20 : 14;   // il legno resta marrone anche nel tema scuro
  const R = [c + 40, 440], T = [c + 170, 250];
  ctx.fillStyle = css(mix(base, C.y, 1)); ctx.beginPath(); ctx.ellipse(c - 34, 598, 30, 16, -.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(mix(base, C.y, 1)); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(c - 30, 590); ctx.lineTo(R[0], R[1]); ctx.stroke();
  ctx.lineCap = 'butt';
  for (let i = 0; i < 40; i++) {
    const s0 = i / 40, s1 = (i + 1) / 40, k = clamp((tManico((s0 + s1) / 2, l) - 20) / 70);
    ctx.strokeStyle = css(mix(base, C.y, k)); ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(lerp(R[0], T[0], s0), lerp(R[1], T[1], s0)); ctx.lineTo(lerp(R[0], T[0], s1) + .5, lerp(R[1], T[1], s1) - .5); ctx.stroke();
  }
  ctx.lineCap = 'round'; ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2;
}
const MARRONE = [140, 86, 48];   // il legno, uguale nei due temi
const SX = s => 1290 + s * 470, SY = c => 640 - (c - 20) * 5;
function scenaConduzione(ctx, t) {
  if (t < 7.5 || t > 40.6) return;
  const al = P(t, 7.6, 8.3) * (1 - P(t, 39.9, 40.5));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  const l = ELLE(t), lw = l / Math.sqrt(40);
  drawRich(ctx, '{dim:due tazze di tè a 90 °C}', 150, 160, { size: 30, align: 'left' });
  drawRich(ctx, '{dim:tempo accelerato}', 150, 200, { size: 30, align: 'left', alpha: life(t, 12.6, 21.6, .3, .4) });
  tazza(ctx, 360, false, l, t); tazza(ctx, 820, true, lw, t);
  txt(ctx, 'acciaio', 360, 690, { size: 34, weight: 600 }); txt(ctx, 'legno', 820, 690, { size: 34, weight: 600 });
  const kc = P(t, 36.1, 36.6);
  txt(ctx, 'buon conduttore', 360, 735, { size: 30, weight: 600, color: C.g, alpha: kc }); txt(ctx, 'isolante', 820, 735, { size: 30, weight: 600, color: C.x, alpha: kc });
  const kp = P(t, 17.5, 18.0);
  txt(ctx, 'caldo', 530, 214, { size: 32, weight: 600, color: C.y, alpha: kp }); txt(ctx, 'freddo', 990, 214, { size: 32, weight: 600, color: C.x, alpha: kp });
  // a destra: prima la temperatura lungo i manici, poi l'acciaio visto da vicino
  card(ctx, 1200, 110, 610, 680);
  const kg = 1 - P(t, 26.3, 26.8);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= kg;
    titolo(ctx, 'temperatura del manico', 1505, 165);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (const c of [40, 60, 80]) { ctx.beginPath(); ctx.moveTo(SX(0), SY(c)); ctx.lineTo(SX(1), SY(c)); ctx.stroke(); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(SX(0), SY(20)); ctx.lineTo(SX(1.04), SY(20)); ctx.moveTo(SX(0), SY(20)); ctx.lineTo(SX(0), SY(96)); ctx.stroke();
    arrowHead(ctx, [SX(1.04) + 6, SY(20)], 0, C.ink); arrowHead(ctx, [SX(0), SY(96) - 6], -Math.PI / 2, C.ink);
    for (const c of [20, 40, 60, 80]) txt(ctx, String(c), SX(0) - 12, SY(c), { size: 30, color: C.dim, align: 'right' });
    txt(ctx, '°C', SX(0) + 14, SY(96), { size: 30, color: C.dim, align: 'left' });
    txt(ctx, 'dal tè', SX(0), SY(20) + 30, { size: 30, color: C.dim, align: 'left' }); txt(ctx, 'alla cima', SX(1), SY(20) + 30, { size: 30, color: C.dim, align: 'right' });
    for (const [ll, col, nome] of [[l, C.dim, 'acciaio'], [lw, MARRONE, 'legno']]) {
      ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i <= 60; i++) { const s = i / 60, x = SX(s), y = SY(tManico(s, ll)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    // i nomi compaiono quando le due curve si sono separate
    txt(ctx, 'acciaio', SX(.62), SY(tManico(.62, l)) - 30, { size: 30, weight: 600, color: C.dim, align: 'left', alpha: P(t, 15.6, 16.1) });
    txt(ctx, 'legno', SX(.62), SY(20) - 24, { size: 30, weight: 600, color: MARRONE, align: 'left', alpha: P(t, 17.4, 17.9) });
    ctx.restore();
  }
  const kz = P(t, 26.5, 27.0);
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz;
    titolo(ctx, 'l’acciaio visto da vicino', 1505, 165);
    // ogni atomo vibra attorno al suo posto: ampiezza come √T (in kelvin), colore come la temperatura
    for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) {
      const i = r * 9 + c, tc = tManico(c / 8, l), A = 3 + 10 * (tc - 20) / 70;   // esagerata (dichiarato): fra 20 e 90 °C la vera cambia di pochi per cento
      const x = 1275 + c * 57 + A * Math.sin((10 + 4 * h(i, 1)) * t + 6.28 * h(i, 2)), y = 300 + r * 80 + A * Math.sin((11 + 4 * h(i, 3)) * t + 6.28 * h(i, 4));
      ctx.fillStyle = css(colT(tc), .9); ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
    }
    txt(ctx, 'dal tè', 1260, 640, { size: 30, color: C.y, align: 'left' }); txt(ctx, 'alla cima', 1760, 640, { size: 30, color: C.x, align: 'right' });
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1380, 640); ctx.lineTo(1582, 640); ctx.stroke(); arrowHead(ctx, [1590, 640], 0, C.dim);
    drawRich(ctx, '{dim:ogni atomo resta al suo posto}', 1505, 715, { size: 30, alpha: P(t, 31.5, 32.0) });
    drawRich(ctx, '{dim:vibrazioni esagerate}', 1505, 222, { size: 30 });
    ctx.restore();
  }
  ctx.restore();
}

// 2 · convezione (40.5–63.7): correnti stazionarie da una funzione di corrente ψ; i pezzetti d'acqua seguono le sue linee.
// Coordinate normalizzate X, Y in [0, 1] (Y verso l'alto). Le traiettorie si integrano una volta sola (Runge–Kutta).
const T0_CONV = 40.5, DT_CONV = 1 / 60, N_PASSI = Math.ceil((64.2 - T0_CONV) / DT_CONV);
function traiettorie(vel, n, seme) {
  const out = [];
  for (let i = 0; i < n; i++) {
    let X = .06 + .88 * h(i, seme), Y = .1 + .8 * h(i, seme + 1);
    const pts = new Float32Array(2 * (N_PASSI + 1));
    for (let k = 0; k <= N_PASSI; k++) {
      pts[2 * k] = X; pts[2 * k + 1] = Y;
      const a = vel(X, Y), b = vel(X + a[0] * DT_CONV / 2, Y + a[1] * DT_CONV / 2), c = vel(X + b[0] * DT_CONV / 2, Y + b[1] * DT_CONV / 2), d = vel(X + c[0] * DT_CONV, Y + c[1] * DT_CONV);
      X += DT_CONV / 6 * (a[0] + 2 * b[0] + 2 * c[0] + d[0]); Y += DT_CONV / 6 * (a[1] + 2 * b[1] + 2 * c[1] + d[1]);
    }
    out.push(pts);
  }
  return out;
}
// la pentola: due celle, l'acqua sale al centro (sopra la fiamma) e scende lungo le pareti
const vPentola = (X, Y) => [.12 * Math.PI * Math.sin(2 * Math.PI * X) * Math.cos(Math.PI * Y), -.12 * 2 * Math.PI * Math.cos(2 * Math.PI * X) * Math.sin(Math.PI * Y)];
// la stanza: una cella sola, l'aria sale sopra il termosifone (a sinistra) e scende dall'altra parte
const vStanza = (X, Y) => [-.1 * Math.PI * Math.sin(Math.PI * X) * Math.cos(Math.PI * Y), .1 * Math.PI * Math.cos(Math.PI * X) * Math.sin(Math.PI * Y)];
const TR_PENTOLA = traiettorie(vPentola, 40, 11), TR_STANZA = traiettorie(vStanza, 30, 23);
function posa(tr, t) {
  const u = clamp((t - T0_CONV) / DT_CONV, 0, N_PASSI - 1), k = Math.floor(u), f = u - k;
  return [clamp(lerp(tr[2 * k], tr[2 * k + 2], f), .03, .97), clamp(lerp(tr[2 * k + 1], tr[2 * k + 3], f), .03, .97)];   // mai sopra le pareti
}
function fiamma(ctx, cx, y, t, n, larga) {
  for (let i = 0; i < n; i++) {
    const x = cx - larga / 2 + i * larga / (n - 1), hf = 30 + 8 * Math.sin(t * 15 + i * 1.7);
    ctx.fillStyle = css(C.y, .85); ctx.beginPath(); ctx.moveTo(x, y - hf); ctx.quadraticCurveTo(x + 14, y - 4, x, y); ctx.quadraticCurveTo(x - 14, y - 4, x, y - hf); ctx.fill();
  }
}
function scenaConvezione(ctx, t) {
  if (t < 40.3 || t > 63.9) return;
  const al = life(t, 40.5, 63.7, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  // la pentola: x 200–1040, fondo a 640, pelo dell'acqua a 320
  const X0 = 200, X1 = 1040, YF = 640, YP = 320, px = X => X0 + X * (X1 - X0), py = Y => YF - Y * (YF - YP);
  ctx.fillStyle = css(C.x, .16); ctx.fillRect(X0, YP, X1 - X0, YF - YP);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(X0 - 3, 260); ctx.lineTo(X0 - 3, YF + 3); ctx.lineTo(X1 + 3, YF + 3); ctx.lineTo(X1 + 3, 260); ctx.stroke();
  ctx.fillStyle = css(C.dim); ctx.fillRect(500, 700, 240, 14);
  fiamma(ctx, 620, 694, t, 5, 160);
  // le correnti, quando Stilla le riassume
  const kk = P(t, 54.5, 55.2);
  if (kk > 0) {
    ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
    for (const cx of [px(.25), px(.75)]) { ctx.beginPath(); ctx.ellipse(cx, py(.5), 120, 105, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.setLineDash([]);
    // giù lungo le pareti, su nel mezzo
    for (const [x, a] of [[px(.25) - 120, Math.PI / 2], [px(.25) + 120, -Math.PI / 2], [px(.75) + 120, Math.PI / 2], [px(.75) - 120, -Math.PI / 2]]) arrowHead(ctx, [x, py(.5)], a, C.g, 1.3);
    ctx.restore();
  }
  // i pezzetti d'acqua: arancio mentre salgono (caldi), azzurri mentre scendono (freddi)
  TR_PENTOLA.forEach(tr => {
    const [X, Y] = posa(tr, t), v = vPentola(X, Y)[1] / (.12 * 2 * Math.PI);
    ctx.fillStyle = css(mix(C.x, C.y, clamp(.5 + .9 * v)), .9); ctx.beginPath(); ctx.arc(px(X), py(Y), 11, 0, Math.PI * 2); ctx.fill();
  });
  const kd = P(t, 45.3, 45.8), kf = P(t, 50.1, 50.6);
  txt(ctx, 'calda: sale', 620, 215, { size: 32, weight: 600, color: C.y, alpha: kd });
  txt(ctx, 'fredda: scende', 300, 215, { size: 32, weight: 600, color: C.x, alpha: kf });
  txt(ctx, 'fredda: scende', 940, 215, { size: 32, weight: 600, color: C.x, alpha: kf });
  ctx.restore();
  // perché si muove: la densità
  const kw = life(t, 45.1, 59.3, .5, .4);
  if (kw > 0) {
    ctx.save(); ctx.globalAlpha *= kw;
    card(ctx, 1200, 110, 610, 680);
    titolo(ctx, 'perché si muove', 1505, 160);
    ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(1270, 290, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1270, 360); ctx.lineTo(1270, 322); ctx.stroke(); arrowHead(ctx, [1270, 314], -Math.PI / 2, C.y, 1.1);
    drawRich(ctx, 'calda: {g:meno densa}', 1310, 290, { size: 34, align: 'left', local: t - 45.3 });
    drawRich(ctx, '{dim:sale, come un sughero}', 1310, 338, { size: 30, align: 'left', local: t - 46.0 });
    const kb = P(t, 50.1, 50.6);
    ctx.save(); ctx.globalAlpha *= kb;
    ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(1270, 450, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = css(C.x); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1270, 478); ctx.lineTo(1270, 516); ctx.stroke(); arrowHead(ctx, [1270, 524], Math.PI / 2, C.x, 1.1);
    ctx.restore();
    drawRich(ctx, 'fredda: più densa', 1310, 450, { size: 34, align: 'left', local: t - 50.3 });
    drawRich(ctx, '{dim:scende}', 1310, 498, { size: 30, align: 'left', local: t - 51.0 });
    ctx.save(); ctx.globalAlpha *= P(t, 54.5, 55.0); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1250, 585); ctx.lineTo(1760, 585); ctx.stroke(); ctx.restore();
    drawRich(ctx, 'il calore viaggia\n{g:insieme al fluido}', 1505, 665, { size: 36, local: t - 54.6, lh: 1.35 });
    ctx.restore();
  }
  // la stanza col termosifone
  const ks = life(t, 59.1, 63.7, .5, .6);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks;
    card(ctx, 1200, 110, 610, 680);
    titolo(ctx, 'una stanza', 1505, 160);
    const R0 = 1250, R1 = 1760, RF = 720, RT = 220, qx = X => R0 + X * (R1 - R0), qy = Y => RF - Y * (RF - RT);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.strokeRect(R0, RT, R1 - R0, RF - RT);
    ctx.fillStyle = css(C.y, .7); ctx.fillRect(R0 + 8, RF - 140, 34, 120);
    ctx.strokeStyle = css(C.paper); ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(R0 + 8, RF - 140 + k * 30); ctx.lineTo(R0 + 42, RF - 140 + k * 30); ctx.stroke(); }
    TR_STANZA.forEach(tr => {
      const [X, Y] = posa(tr, t), v = vStanza(X, Y)[1] / (.1 * Math.PI);
      ctx.fillStyle = css(mix(C.x, C.y, clamp(.5 + .9 * v)), .85); ctx.beginPath(); ctx.arc(qx(X), qy(Y), 9, 0, Math.PI * 2); ctx.fill();
    });
    txt(ctx, 'termosifone', R0 + 60, RF - 30, { size: 30, weight: 600, color: C.y, align: 'left' });
    ctx.restore();
  }
}

// 3 · irraggiamento (63.7–82.4): le onde partono dal Sole e attraversano il vuoto a velocità costante (tempo accelerato, onde ingrandite)
const SOLE = [300, 450], TERRA = [1580, 450], C_ONDA = 300, T_ONDA = 68.6;
function scenaIrraggiamento(ctx, t) {
  if (t < 63.5 || t > 82.6) return;
  const al = life(t, 63.7, 82.4, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 20); ctx.clip();
  ctx.fillStyle = css(mix(C.v, C.ink, .6), .12); ctx.fillRect(112, 112, 1696, 676);
  // il Sole
  const g = ctx.createRadialGradient(SOLE[0], SOLE[1], 40, SOLE[0], SOLE[1], 190);
  g.addColorStop(0, css(C.y, .45)); g.addColorStop(1, css(C.y, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(SOLE[0], SOLE[1], 190, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(C.y); ctx.beginPath(); ctx.arc(SOLE[0], SOLE[1], 105, 0, Math.PI * 2); ctx.fill();
  // le onde: tre raggi, sinusoidi che avanzano tutte insieme
  const fronte = 410 + C_ONDA * (t - T_ONDA), x1 = Math.min(fronte, TERRA[0] - 80);
  if (fronte > 410) for (const y0 of [370, 450, 530]) {
    ctx.strokeStyle = css(C.y); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
    for (let x = 410; x <= x1; x += 4) { const y = y0 + 14 * Math.sin(2 * Math.PI * (x - fronte) / 80); x === 410 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    if (fronte < TERRA[0] - 80) arrowHead(ctx, [x1 + 10, y0 + 14 * Math.sin(2 * Math.PI * (x1 - fronte) / 80)], 0, C.y, 1.1);
  }
  // la Terra, che si scalda dalla parte del Sole quando le onde arrivano
  const kT = P(t, T_ONDA + (TERRA[0] - 80 - 410) / C_ONDA, T_ONDA + (TERRA[0] - 80 - 410) / C_ONDA + 1);
  ctx.fillStyle = css(mix(C.x, C.paper, .2)); ctx.beginPath(); ctx.arc(TERRA[0], TERRA[1], 72, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.g, C.paper, .25)); ctx.beginPath(); ctx.ellipse(TERRA[0] - 14, TERRA[1] - 18, 28, 20, .5, 0, Math.PI * 2); ctx.ellipse(TERRA[0] + 22, TERRA[1] + 24, 22, 16, -.3, 0, Math.PI * 2); ctx.fill();
  // la metà lontana dal Sole resta in ombra, quella verso il Sole si illumina e si scalda quando arrivano le onde
  ctx.save(); ctx.beginPath(); ctx.arc(TERRA[0], TERRA[1], 72, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = 'rgba(10,20,45,.3)'; ctx.fillRect(TERRA[0], TERRA[1] - 72, 72, 144);
  const gl = ctx.createRadialGradient(TERRA[0] - 72, TERRA[1], 0, TERRA[0] - 72, TERRA[1], 120);
  gl.addColorStop(0, `rgba(255,214,120,${.75 * kT})`); gl.addColorStop(1, 'rgba(255,214,120,0)');
  ctx.fillStyle = gl; ctx.fillRect(TERRA[0] - 72, TERRA[1] - 72, 144, 144); ctx.restore();
  ctx.strokeStyle = css(C.y, kT); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(TERRA[0], TERRA[1], 74, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
  ctx.restore();
  txt(ctx, 'Sole', SOLE[0], 640, { size: 34, weight: 600 });
  txt(ctx, 'Terra', TERRA[0], 570, { size: 34, weight: 600 });
  drawRich(ctx, '{dim:vuoto: nessuna particella}', 960, 190, { size: 34, local: t - 64.0 });
  drawRich(ctx, '{v:onde elettromagnetiche}', 960, 300, { size: 36, alpha: P(t, 69.0, 69.5) });
  drawRich(ctx, '{dim:tempo accelerato, onde ingrandite}', 960, 620, { size: 30, alpha: P(t, 69.0, 69.5) });
  const kd = P(t, 78.1, 78.6);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2.5; ctx.beginPath();
    ctx.moveTo(SOLE[0], 692); ctx.lineTo(TERRA[0], 692); ctx.moveTo(SOLE[0], 680); ctx.lineTo(SOLE[0], 704); ctx.moveTo(TERRA[0], 680); ctx.lineTo(TERRA[0], 704); ctx.stroke();
    drawRich(ctx, '150 milioni di km: la luce ci mette {g:circa 8 minuti}', 960, 738, { size: 32 });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (82.4–93)
function scenaFine(ctx, t) {
  if (t < 82.5) return;
  const al = 1 - P(t, 90.9, 91.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 82.7 });
    drawRich(ctx, 'Il calore passa per contatto, con un fluido\nche si muove o con le onde, anche nel vuoto.', W / 2, 290, { size: 62, weight: 600, local: t - 83.1, stagger: .08 });
  });
  const pills = [[490, '{g:conduzione}:\nper contatto'], [960, '{g:convezione}:\nil fluido si sposta'], [1430, '{g:irraggiamento}:\nanche nel vuoto']];
  pills.forEach(([x, s], i) => {
    const a = 84.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue il calore che risale il manico, l'acqua che sale e scende
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // le due tazze
    ['pop', 12.6, .3], ['tono', 12.7, 21.3, [.1, .45, .6, .71, .8]],                  // tempo accelerato: il caldo risale l'acciaio (ℓ ∝ √t)
    ['pop', 15.6, .4], ['pop', 17.4, .35],                                            // acciaio caldo, legno freddo
    ['soffio', 26.5], ['pop', 31.5, .35],                                             // l'acciaio visto da vicino; ogni atomo al suo posto
    ['pop', 36.1, .5],                                                                // buon conduttore, isolante
    ['soffio', 40.5],                                                                 // la pentola
    ['pop', 45.3, .5], ['tono', 45.3, 46.5, [.3, .75]], ['pop', 46.0, .35],           // calda: meno densa, sale
    ['pop', 50.3, .45], ['tono', 50.1, 51.3, [.75, .3]],                              // fredda: più densa, scende
    ['traccia', 54.5, 55.2], ['ding', 55.2],                                          // le correnti: il calore viaggia col fluido
    ['soffio', 59.1],                                                                 // la stanza col termosifone
    ['soffio', 63.7], ['pop', 64.0, .4],                                              // il Sole, il vuoto
    ['traccia', 68.6, 72.2], ['pop', 69.0, .5], ['ding', 72.3],                       // le onde attraversano il vuoto e scaldano la Terra
    ['traccia', 78.1, 78.6], ['pop', 78.3, .5],                                       // 150 milioni di km, circa 8 minuti
    ['soffio', 82.7], ['pop', 83.1, .6], ['pop', 84.6, .5], ['pop', 85.1, .6], ['pop', 85.6, .7],   // in una frase
  ];
  return {
    titolo: 'Conduzione, convezione, irraggiamento', durata: 92.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 40.4, 'conduzione'], [40.4, 63.7, 'convezione'], [63.7, 82.4, 'irraggiamento']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaConduzione(ctx, t); scenaConvezione(ctx, t); scenaIrraggiamento(ctx, t); scenaFine(ctx, t); },
  };
});
