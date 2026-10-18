'use strict';
/* La centrifuga è apparente — in curva sull'autobus: da dentro sembra una spinta verso l'esterno, da fuori il passeggero va dritto per inerzia e la parete lo spinge verso il centro. Argomento: dinamica. */
CVIDEO.registra('dinamica/forze-apparenti', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [77.4, 190], [78.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [77.4, 1050], [78.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [77.4, 2.2], [78.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [77.4, 2], [78.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [77.4, -1.5], [78.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.5, 'sorpreso'], [24.6, 'neutro'],
  [28.9, 'pensa'], [33.1, 'neutro'], [41.1, 'sorpreso'], [46.0, 'neutro'], [50.5, 'felice'], [55.0, 'neutro'],
  [63.8, 'pensa'], [68.3, 'neutro'], [72.8, 'felice'], [77.2, 'neutro'], [79.6, 'felice'], [84.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'In curva ti senti spinto fuori.\nDa chi?'],
  [7.9, 12.2, 'Un autobus visto dall’alto, e un\npasseggero sui pattini, senza appigli.'],
  [12.3, 16.3, 'Finché l’autobus va dritto,\nlui resta fermo al centro.'],
  [16.4, 20.4, 'Ora curva a sinistra,\nal rallentatore…'],
  [20.5, 24.5, '…e lui scivola verso l’esterno,\nfino alla parete!'],
  [24.6, 28.85, 'Da dentro sembra che una forza\nlo spinga fuori: la {r:centrifuga}.'],
  [28.9, 32.9, 'Ma chi la eserciterebbe?\nNessun corpo lo spinge fuori.'],
  [33.1, 36.9, 'Guardiamo la stessa scena\nda fuori, dall’alto.'],
  [37.0, 41.0, 'Prima vanno dritti insieme,\na 5 m/s.'],
  [41.1, 45.9, 'L’autobus curva, ma lui va\n{g:dritto}, per inerzia.'],
  [46.0, 50.4, 'Urta la parete: da lì la parete\nlo spinge verso l’interno.'],
  [50.5, 54.7, 'È lei, la forza {y:centripeta},\na farlo curvare.'],
  [55.0, 59.2, 'Da fuori basta la {y:centripeta}:\nnessuna forza spinge fuori.'],
  [59.3, 63.7, 'Da dentro: nessuna forza vera lo\nspinge, eppure parte verso l’esterno.'],
  [63.8, 68.2, 'Il primo principio {r:non torna}:\nil sistema non è inerziale.'],
  [68.3, 72.7, 'Per spiegare quella partenza, chi sta\ndentro aggiunge la forza {r:centrifuga}.'],
  [72.8, 77.1, 'È {v:apparente}: nessun corpo\nla esercita.'],
  [79.6, 84.0, 'In curva nessuno ti spinge fuori:\ntu tendi ad andare dritto.'],
];

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 7, tratt = false) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.4, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = tratt ? 'butt' : 'round';
    if (tratt) ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    ctx.setLineDash([]);
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
function chip(ctx, x, y, al, testo) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(C.dim);
  if (testo === 'fermo immagine') { ctx.fillRect(x, y - 14, 8, 28); ctx.fillRect(x + 14, y - 14, 8, 28); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); }
  txt(ctx, testo, x + 34, y, { size: 30, color: C.dim, align: 'left' });
  ctx.restore();
}

// ---------- il moto vero, nel sistema del suolo (x avanti, y a sinistra; metri e secondi) ----------
// l'autobus va a 5 m/s e al tempo 0 entra in una curva di raggio 10 m (centro in (0; 10)); il passeggero, senza appigli
// e senza attrito, va dritto finché urta la parete esterna (0,95 m dal centro dell'autobus, al netto del suo ingombro).
// L'urto non è istantaneo: la parete cede di pochi centimetri (molla smorzata, ~0,1 s), così il passaggio è continuo;
// la parete, liscia, spinge solo perpendicolarmente a sé stessa, e dopo l'urto il passeggero può scivolarle lungo.
const V = 5, R = 10, BL = 8, BW = 2.5, PR = .3, LAT = BW / 2 - .16 - PR, TMAX = Math.PI / 3 * R / V;   // si ferma l'immagine dopo 60° di curva
const OM = V / R, DT = .0005, KM = 400, BM = 40;
// il moto nel sistema dell'autobus (u avanti, w a sinistra), integrato una volta sola: forze apparenti + spinta della parete n
const TAB = (() => {
  const out = []; let u = 0, w = 0, du = 0, dw = 0;
  for (let i = 0; i * DT <= TMAX + DT; i++) {
    const pen = -LAT - w, n = pen > 0 ? Math.max(0, KM * pen - BM * dw) : 0;
    out.push([u, w, du, dw, n]);
    du += (OM * OM * u + 2 * OM * dw) * DT; dw += (OM * OM * (w - R) - 2 * OM * du + n) * DT;
    u += du * DT; w += dw * DT;
  }
  return out;
})();
const TC = TAB.findIndex(r => r[4] > 0) * DT;   // ≈ 0,894 s: inizia l'urto
function stato(tau) {
  tau = Math.min(tau, TMAX);
  const th = tau > 0 ? OM * tau : 0;
  const B = tau > 0 ? [R * Math.sin(th), R * (1 - Math.cos(th))] : [V * tau, 0];
  const r = tau > 0 ? TAB[Math.min(TAB.length - 1, Math.round(tau / DT))] : [0, 0, 0, 0, 0];
  const c = Math.cos(th), s = Math.sin(th), rel = [r[0], r[1]];
  const Pw = [B[0] + rel[0] * c - rel[1] * s, B[1] + rel[0] * s + rel[1] * c];
  // velocità nel suolo: quella del punto dell'autobus dove sta (rotazione attorno al centro) + quella relativa
  const vP = tau <= 0 ? [V, 0] : [-OM * (Pw[1] - R) + r[2] * c - r[3] * s, OM * Pw[0] + r[2] * s + r[3] * c];
  return { th, B, P: Pw, rel, attaccato: tau > TC, vP, n: r[4] };
}
// l'autobus visto dall'alto: s px per metro, centro (cx; cy), muso verso l'angolo th (antiorario, come nel suolo)
function autobus(ctx, cx, cy, th, s, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.rotate(-th);
  const L = BL * s, Wd = BW * s, p = .16 * s;
  ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-L / 2, -Wd / 2, L, Wd, .35 * s); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .85));
  ctx.beginPath(); ctx.roundRect(-L / 2 + p, -Wd / 2 + p, L - 2 * p, Wd - 2 * p, .25 * s); ctx.fill();
  ctx.fillStyle = css(mix(C.x, C.paper, .55));   // il parabrezza
  ctx.beginPath(); ctx.roundRect(L / 2 - p - .1 * s, -Wd / 2 + 2 * p, p + .05 * s, Wd - 4 * p, 3); ctx.fill();
  ctx.restore();
}
function passeggero(ctx, x, y, s) {
  ctx.save();
  ctx.fillStyle = css(mix(C.ink, C.paper, .25)); ctx.beginPath(); ctx.arc(x, y, PR * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(mix(C.ink, C.paper, .55)); ctx.beginPath(); ctx.arc(x, y, PR * s * .55, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La centrifuga è apparente', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// la strada nel sistema del suolo: rettilineo fino a x = 0, poi curva di raggio 10 m (bordi a ±2 m)
function bordo(off, amax = Math.PI) {   // punti del bordo a distanza off (a sinistra positiva) dalla linea di mezzo
  const pts = [];
  for (let x = -40; x <= 0; x += 2) pts.push([x, off]);
  for (let k = 1; k <= 60; k++) { const a = k / 60 * amax; pts.push([(R - off) * Math.sin(a), R - (R - off) * Math.cos(a)]); }
  return pts;
}
const BORDI = [bordo(2), bordo(-2)], BORDI_G = [bordo(2, Math.PI / 2), bordo(-2, Math.PI / 2)];

// 1 · visto da dentro (7,5–33): il sistema dell'autobus, che gira
const SA = 90, XA = 960, YA = 470, T1 = 19.0, LENTO = 5;
function sceneDentro(ctx, t) {
  if (t < 7.5 || t > 33.2) return;
  const al = life(t, 7.6, 33.0, .6, .5), tau = Math.min((t - T1) / LENTO, TC + .3), S = stato(tau);   // da dentro ci si ferma poco dopo l'urto
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{dim:visto da dentro l’autobus}', 960, 140, { size: 32 });
  // il mondo fuori, riportato nel sistema dell'autobus: scorre e, in curva, ruota
  ctx.save(); ctx.beginPath(); ctx.rect(120, 175, 1680, 600); ctx.clip();
  const c = Math.cos(S.th), s = Math.sin(S.th);
  const aSchermo = q => { const dx = q[0] - S.B[0], dy = q[1] - S.B[1]; return [XA + (dx * c + dy * s) * SA, YA - (-dx * s + dy * c) * SA]; };
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 5; ctx.setLineDash([40, 30]);
  for (const B of BORDI) { ctx.beginPath(); B.forEach((q, i) => { const p = aSchermo(q); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); }
  ctx.setLineDash([]);
  ctx.restore();
  autobus(ctx, XA, YA, 0, SA);
  const px = XA + S.rel[0] * SA, py = YA - S.rel[1] * SA;
  passeggero(ctx, px, py, SA);
  // la forza che sembra spingerlo fuori
  const kc = life(t, 25.0, 33.0, .5, .4);
  freccia(ctx, [px, py + 30], [px, py + 150], C.r, kc, 7, true);
  if (kc > 0) {   // un fondino, perché la scritta cade sul bordo della strada
    ctx.save(); ctx.globalAlpha *= kc; ctx.fillStyle = css(C.bg, .92);
    ctx.beginPath(); ctx.roundRect(px + 18, py + 40, 296, 44, 10); ctx.fill(); ctx.restore();
  }
  drawRich(ctx, '{r:forza centrifuga?}', px + 30, py + 62, { size: 32, align: 'left', alpha: kc });
  // l'urto: la parete lo ferma in qualche centesimo di secondo (qualche fotogramma al rallentatore)
  drawRich(ctx, 'urto contro la parete', px, py - 62, { size: 30, alpha: life(t, T1 + (TC - .04) * LENTO, T1 + (TC + .3) * LENTO + .4, .25, .4) });
  if (t > 8.0) chip(ctx, 1500, 140, P(t, 8.0, 8.4), t < T1 + (TC + .3) * LENTO ? 'al rallentatore' : 'fermo immagine');
  ctx.restore();
}

// 2 · visto da fuori (33–55): il sistema del suolo
const SB = 45, OX = 700, OY = 640, T2 = 42.0;
const aB = q => [OX + q[0] * SB, OY - q[1] * SB];
function sceneFuori(ctx, t) {
  if (t < 32.8 || t > 55.2) return;
  const al = life(t, 33.0, 55.0, .6, .5), tau = (t - T2) / LENTO, S = stato(tau);
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, '{dim:visto da fuori, dall’alto}', 960, 140, { size: 32 });
  // la strada
  const C0 = aB([0, R]);
  ctx.strokeStyle = css(mix(C.dim, C.bg, .75)); ctx.lineWidth = 4 * SB; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(120, OY); ctx.lineTo(OX, OY); ctx.arc(C0[0], C0[1], R * SB, Math.PI / 2, 0, true); ctx.stroke();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
  for (const B of BORDI_G) { ctx.beginPath(); let primo = true; for (const q of B) { const p = aB(q); if (p[0] < 120 || p[1] < 110) continue; primo ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); primo = false; } ctx.stroke(); }
  // il centro della curva
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(C0[0] - 12, C0[1]); ctx.lineTo(C0[0] + 12, C0[1]); ctx.moveTo(C0[0], C0[1] - 12); ctx.lineTo(C0[0], C0[1] + 12); ctx.stroke();
  drawRich(ctx, '{dim:centro della curva · raggio 10 m}', C0[0] - 24, C0[1], { size: 30, align: 'right' });
  // la retta che il passeggero seguirebbe per inerzia
  const kd = P(t, 41.3, 42.0);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.x, .8); ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX + (1800 - OX) * kd, OY); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{x:dritto, per inerzia}', 1790, OY - 34, { size: 30, align: 'right', alpha: kd });
  }
  const pB = aB(S.B);
  autobus(ctx, pB[0], pB[1], S.th, SB);
  const pP = aB(S.P);
  passeggero(ctx, pP[0], pP[1], SB);
  freccia(ctx, pP, [pP[0] + S.vP[0] * 20, pP[1] - S.vP[1] * 20], C.x);
  if (!S.attaccato) drawRich(ctx, '{x:5 m/s}', pP[0] + 50, pP[1] - 30, { size: 30, alpha: 1 - P(tau, .3, .6) });
  // l'urto, e poi la spinta della parete: liscia, quindi perpendicolare alla parete (lunga in proporzione, 60 px per m/s²)
  const ku = life(tau, TC - .04, TC + .62, .05, .08);
  if (ku > 0) {
    ctx.save(); ctx.globalAlpha *= ku; ctx.fillStyle = css(C.bg, .92);
    ctx.beginPath(); ctx.roundRect(pP[0] + 30, pP[1] + 26, 312, 44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, 'urto contro la parete', pP[0] + 42, pP[1] + 48, { size: 30, align: 'left', alpha: ku });
  }
  if (tau > TC + .25) {
    const ux = -Math.sin(S.th), uy = -Math.cos(S.th), L = 16 + S.n * 60;
    const kf = P(tau, TC + .25, TC + .4);
    freccia(ctx, [pP[0] + ux * 16, pP[1] + uy * 16], [pP[0] + ux * L, pP[1] + uy * L], C.y, kf);
    const ex = pP[0] + ux * (L + 24), ey = pP[1] + uy * (L + 24) - 10, lw = M.richW(ctx, '{y:spinta della parete}', 30);
    ctx.save(); ctx.globalAlpha *= kf; ctx.fillStyle = css(C.bg, .92);
    ctx.beginPath(); ctx.roundRect(ex - lw - 12, ey - 22, lw + 24, 44, 10); ctx.fill(); ctx.restore();
    drawRich(ctx, '{y:spinta della parete}', ex, ey, { size: 30, align: 'right', alpha: kf });
  }
  if (t > 33.2) chip(ctx, 1500, 140, P(t, 33.2, 33.6), t < T2 + TMAX * LENTO ? 'al rallentatore' : 'fermo immagine');
  ctx.restore();
}

// 3 · due sistemi di riferimento (55–77,4): la stessa istantanea, a 60° di curva
function sceneConfronto(ctx, t) {
  if (t < 54.8 || t > 77.6) return;
  const al = life(t, 55.0, 77.4, .6, .5), S = stato(TMAX);
  // da fuori: sistema inerziale
  const kL = P(t, 55.0, 55.6), kR = P(t, 59.3, 59.9);
  card(ctx, 120, 110, 820, 670, al * kL);
  ctx.save(); ctx.globalAlpha *= al * kL;
  conFont(TITOLI, () => drawRich(ctx, 'visto da fuori', 530, 160, { size: 36, weight: 600 }));
  drawRich(ctx, '{v:sistema inerziale}', 530, 205, { size: 30 });
  const s1 = 28, o1 = [290, 590], q1 = q => [o1[0] + q[0] * s1, o1[1] - q[1] * s1], c1 = q1([0, R]);
  ctx.strokeStyle = css(mix(C.dim, C.bg, .75)); ctx.lineWidth = 4 * s1;
  ctx.beginPath(); ctx.moveTo(150, o1[1]); ctx.lineTo(o1[0], o1[1]); ctx.arc(c1[0], c1[1], R * s1, Math.PI / 2, -Math.PI / 12, true); ctx.stroke();
  ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 3; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.moveTo(o1[0], o1[1]); ctx.lineTo(910, o1[1]); ctx.stroke(); ctx.setLineDash([]);
  const b1 = q1(S.B), p1 = q1(S.P);
  autobus(ctx, b1[0], b1[1], S.th, s1);
  passeggero(ctx, p1[0], p1[1], s1 * 1.3);
  { const ux = -Math.sin(S.th), uy = -Math.cos(S.th); freccia(ctx, [p1[0] + ux * 12, p1[1] + uy * 12], [p1[0] + ux * 100, p1[1] + uy * 100], C.y); }
  drawRich(ctx, 'solo la forza {y:centripeta}:\nla parete lo spinge verso l’interno', 530, 718, { size: 30, lh: 1.25 });
  ctx.restore();
  // da dentro: sistema che gira
  card(ctx, 980, 110, 820, 670, al * kR);
  ctx.save(); ctx.globalAlpha *= al * kR;
  conFont(TITOLI, () => drawRich(ctx, 'visto da dentro', 1390, 160, { size: 36, weight: 600 }));
  const kn = P(t, 63.9, 64.4);
  drawRich(ctx, '{v:sistema che gira}', 1390, 205, { size: 30, alpha: 1 - kn });
  drawRich(ctx, '{v:sistema che gira: non inerziale}', 1390, 205, { size: 30, alpha: kn });
  // la scivolata fino alla parete, ingrandita (150 px per metro, metà esterna dell'autobus): nessuna forza vera in orizzontale,
  // eppure si muove; le sue posizioni a 0, 1/3 e 2/3 del tempo restano segnate come cerchi (foto stroboscopica)
  const s2 = 150, x2 = 1390, y2 = 300, Sd = stato(TC - .01);
  ctx.save(); ctx.beginPath(); ctx.rect(992, 232, 796, 330); ctx.clip();
  autobus(ctx, x2 + 60, y2, 0, s2);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.setLineDash([7, 6]);
  for (const tg of [0, TC / 3, 2 * TC / 3]) { const r = stato(tg).rel; ctx.beginPath(); ctx.arc(x2 + r[0] * s2, y2 - r[1] * s2, PR * s2, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  const p2 = [x2 + Sd.rel[0] * s2, y2 - Sd.rel[1] * s2];
  passeggero(ctx, p2[0], p2[1], s2);
  freccia(ctx, [x2 + 90, y2], [p2[0] + 90, p2[1]], C.x, P(t, 59.9, 60.4));
  drawRich(ctx, '{x:spostamento}', x2 + 130, y2 + 50, { size: 30, align: 'left', alpha: P(t, 59.9, 60.4) });
  const ka = P(t, 68.4, 69.0);
  freccia(ctx, [p2[0], p2[1] + 50], [p2[0], p2[1] + 140], C.r, ka, 7, true);
  drawRich(ctx, '{r:centrifuga}', p2[0] + 26, p2[1] + 104, { size: 30, align: 'left', alpha: ka });
  drawRich(ctx, '{v:apparente}', p2[0] + 26, p2[1] + 140, { size: 30, align: 'left', alpha: P(t, 72.9, 73.4) });
  drawRich(ctx, 'nessuna forza vera in orizzontale,\neppure parte verso l’esterno', 1390, 640, { size: 30, lh: 1.25, alpha: P(t, 59.6, 60.1) });
  drawRich(ctx, 'il primo principio {r:non torna}', 1390, 718, { size: 30, alpha: P(t, 63.9, 64.4) });
  ctx.restore();
}

// 4 · riassunto (77,4–87)
function sceneFine(ctx, t) {
  if (t < 77.3) return;
  const al = 1 - P(t, 84.9, 85.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 77.5 });
    drawRich(ctx, 'La centrifuga è una forza apparente:\nda fuori c’è solo la {y:centripeta}.', W / 2, 290, { size: 66, weight: 600, local: t - 77.9, stagger: .09 });
  });
  const pills = [[490, 'senza forze\nsi va {g:dritto}'], [960, 'la parete spinge\nverso il {y:centro}'], [1430, 'la centrifuga c’è solo\nnel sistema {v:che gira}']];
  pills.forEach(([x, s], i) => {
    const a = 80.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, visto da dentro
    ['tono', 19.0, 23.06, [.5, .49, .44, .37, .27, .15]], ['pop', 23.06, .2],         // in curva scivola fuori, fino alla parete
    ['pop', 25.0, .3],                                                                // forza centrifuga?
    ['soffio', 33.0], ['traccia', 41.3, 42.0],                                        // visto da fuori, la retta dell'inerzia
    ['tono', 42.0, 52.47, [.25, .25, .25, .25, .33, .43, .56, .7, .85]],              // lui va dritto, poi la parete lo fa curvare
    ['pop', 46.06, .3], ['pop', 47.31, .6],                                           // l'urto, la spinta della parete
    ['soffio', 55.0], ['soffio', 59.3], ['pop', 59.6, .45], ['pop', 59.9, .5],        // i due sistemi, lo spostamento
    ['pop', 63.9, .4], ['pop', 68.4, .3], ['ding', 72.9],                             // non inerziale, centrifuga apparente
    ['soffio', 77.5], ['pop', 80.6, .5], ['pop', 81.1, .6], ['pop', 81.6, .7],        // in una frase
  ];
  return {
    titolo: 'La centrifuga è apparente', durata: 87, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.0, 'visto da dentro'], [33.0, 55.0, 'visto da fuori'], [55.0, 77.3, 'due sistemi di riferimento']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneDentro(ctx, t); sceneFuori(ctx, t); sceneConfronto(ctx, t); sceneFine(ctx, t); },
  };
});
