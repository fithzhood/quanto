'use strict';
/* Sollevare un'auto con un dito — principio di Pascal e torchio idraulico: F₂/F₁ = S₂/S₁, e il lavoro si conserva. Argomento: fluidi. */
CVIDEO.registra('fluidi/pascal', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, fmtN, dashed, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [94.2, 190], [95.5, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [94.2, 1050], [95.5, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [94.2, 2.2], [95.5, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [94.2, 2], [95.5, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [94.2, -1.5], [95.5, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [20.2, 'sorpreso'], [25.0, 'neutro'],
  [30.0, 'felice'], [34.2, 'neutro'], [48.1, 'sorpreso'], [53.3, 'felice'], [57.8, 'neutro'], [67.8, 'felice'],
  [73.2, 'neutro'], [77.0, 'festa'], [81.5, 'neutro'], [85.7, 'sorpreso'], [90.4, 'neutro'], [96.4, 'felice'], [100.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Come fa un dito a sollevare\nun’automobile?'],
  [7.9, 12.2, 'Un recipiente chiuso, pieno d’acqua,\ncon tre manometri e uno stantuffo.'],
  [12.4, 16.4, 'In basso segnano di più:\nsopra c’è più acqua.'],
  [16.6, 20.0, 'Spingo lo stantuffo con una forza {my:F}…'],
  [20.2, 24.95,'…e tutti e tre salgono\ndi {g:20 000 Pa}: lo stesso aumento {mv:Δp}.'],
  [25.05, 29.85,'È il principio di {v:Pascal}: in un liquido\nfermo, una variazione di pressione…'],
  [30.0, 33.4, '…arriva {g:uguale} in tutti i punti.'],
  [34.2, 38.2, 'Il torchio idraulico: due stantuffi,\nuno piccolo e uno grande.'],
  [38.4, 42.9, 'Quello grande ha una superficie\n{x:4 volte} più ampia: {mx:S₂} = 4·{mx:S₁}.'],
  [43.1, 47.9, 'Premo il piccolo con {my:F₁} = 20 N:\nla pressione sale di {mv:Δp}…'],
  [48.1, 53.1, '…e su una superficie 4 volte più grande\nspinge con {my:F₂} = 80 N!'],
  [53.3, 57.6, 'La forza si moltiplica:\n{my:F₂} / {my:F₁} = {mx:S₂} / {mx:S₁}.'],
  [57.8, 62.4, 'Spingo giù di 8 cm: il grande\nsale di {r:2 cm} soltanto.'],
  [62.6, 67.6, 'Stesso volume d’acqua: 4 volte\nla superficie, un quarto della corsa.'],
  [67.8, 72.6, 'E il {g:lavoro} è lo stesso:\n1,6 J da una parte e dall’altra.'],
  [73.2, 76.8, 'Ora un’auto da 1000 kg:\npesa 9800 N.'],
  [77.0, 81.3, 'Stantuffo grande {x:mille volte}\nil piccolo: basta {g:9,8 N}, un dito!'],
  [81.5, 85.5, 'Spingo giù di 10 cm:\nl’auto sale di {r:0,1 mm}.'],
  [85.7, 90.2, 'Per alzarla di 10 cm il dito\ndovrebbe scendere di {r:100 m}!'],
  [90.4, 94.15,'Per questo il cric idraulico\nsi pompa tante volte.'],
  [96.4, 102.0, 'La pressione si trasmette uguale:\nstantuffo grande, forza grande.'],
];

// ---------- aiutanti ----------
const P0 = 101325;
const mig = n => { const s = String(Math.round(n)); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s; };
function freccia(ctx, a, b, col, w = 7, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = w / 5.5;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
// numero che cambia senza ballare: cifre a larghezza fissa, unità in coda; align 'left' o 'right'
function numero(ctx, s, x, y, size, col, align = 'right', al = 1) {
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = align === 'right' ? x - wu - wc : x;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
// un manometro: quadrante con la lancetta che gira con la pressione
function manometro(ctx, x, y, p, r = 30) {
  ctx.save();
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const a = -Math.PI * 1.25 + ((p - 95000) / 40000) * Math.PI * 1.5;
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
const acqua = () => css(C.x, .22);
function riga(ctx, nome, val, y, col, al, x0 = 1310, x1 = 1770, size = 42) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  numero(ctx, val, x1, y, size + 2, col);
  ctx.restore();
}

// 0 · titolo (0–7.5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Sollevare un’auto con un dito', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · il principio di Pascal (7.5–33.8)
const VA = { x0: 360, x1: 820, y0: 300, y1: 640 }, COLLO = { x0: 440, x1: 520 }, PIST = 220;   // 1 px = 1 mm
// i tre manometri: dove toccano il liquido, dove sta il quadrante, dove si scrive
const MANO = [
  { a: [700, 300], g: [700, 230], s: [750, 230], d: [750, 272] },
  { a: [820, 490], g: [895, 490], s: [945, 490], d: [945, 532] },
  { a: [590, 640], g: [590, 706], s: [640, 706], d: [640, 748] },   // il +20 000 Pa sotto la sua lettura, come gli altri
];
const sceneDp = t => 20000 * P(t, 17.2, 18.4);
function sceneRecipiente(ctx, t) {
  if (t < 7.5 || t > 34.0) return;
  const al = 1 - P(t, 33.2, 33.8), ka = P(t, 7.6, 8.4);
  ctx.save(); ctx.globalAlpha *= al * ka;
  // il liquido: il recipiente e il collo dello stantuffo
  ctx.fillStyle = acqua();
  ctx.fillRect(VA.x0, VA.y0, VA.x1 - VA.x0, VA.y1 - VA.y0); ctx.fillRect(COLLO.x0, PIST, COLLO.x1 - COLLO.x0, VA.y0 - PIST);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(COLLO.x0, 180); ctx.lineTo(COLLO.x0, VA.y0); ctx.lineTo(VA.x0, VA.y0); ctx.lineTo(VA.x0, VA.y1); ctx.lineTo(VA.x1, VA.y1);
  ctx.lineTo(VA.x1, VA.y0); ctx.lineTo(COLLO.x1, VA.y0); ctx.lineTo(COLLO.x1, 180); ctx.stroke();
  // lo stantuffo
  ctx.fillStyle = css(C.dim); ctx.fillRect(COLLO.x0 + 4, PIST - 18, COLLO.x1 - COLLO.x0 - 8, 18);
  // i manometri, con le loro letture
  const dp = sceneDp(t);
  MANO.forEach((m, i) => {
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(m.a[0], m.a[1]); ctx.lineTo(m.g[0], m.g[1]); ctx.stroke();
    const p0 = P0 + 9800 * (m.a[1] - PIST) / 1000, p = Math.round((p0 + dp) / 10) * 10;
    manometro(ctx, m.g[0], m.g[1], p);
    numero(ctx, mig(p) + ' Pa', m.s[0], m.s[1], 38, C.v, 'left');
    const ki = P(t, 20.4 + i * .3, 20.9 + i * .3);
    if (ki > 0) drawRich(ctx, '{g:+20 000 Pa}', m.d[0], m.d[1], { size: 32, align: 'left', alpha: ki });
  });
  // la forza sullo stantuffo
  const kf2 = P(t, 16.8, 17.3, E.out);
  if (kf2 > 0) {
    freccia(ctx, [(COLLO.x0 + COLLO.x1) / 2, 110], [(COLLO.x0 + COLLO.x1) / 2, 110 + 36 + 54 * kf2], C.y);
    drawRich(ctx, '{my:F}', COLLO.x0 - 40, 150, { size: 44, alpha: kf2 });
  }
  ctx.restore();
  // il principio, in una scheda
  const kc = life(t, 25.2, 33.8, .5, .6);
  if (kc > 0) {
    card(ctx, 1240, 220, 570, 400, kc);
    ctx.save(); ctx.globalAlpha *= kc;
    conFont(TITOLI, () => drawRich(ctx, 'principio di Pascal', 1525, 290, { size: 42, weight: 600 }));
    drawRich(ctx, 'in un liquido fermo,\nuna variazione di pressione\n{mv:Δp} arriva {g:uguale}\nin tutti i punti', 1525, 455, { size: 36, lh: 1.4, local: t - 25.6 });
    ctx.restore();
  }
}

// 2 · il torchio idraulico (33.6–94.4)
// due cilindri collegati dal fondo; il liquido è incompressibile: S₁·(discesa) = S₂·(salita)
function torchio(ctx, L, R, yL, yR, fondo, tubo) {
  ctx.fillStyle = acqua();
  ctx.fillRect(L.x0, yL, L.x1 - L.x0, fondo - yL); ctx.fillRect(R.x0, yR, R.x1 - R.x0, fondo - yR);
  ctx.fillRect(L.x0, fondo, R.x1 - L.x0, tubo);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(L.x0, L.top); ctx.lineTo(L.x0, fondo + tubo); ctx.lineTo(R.x1, fondo + tubo); ctx.lineTo(R.x1, R.top); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(L.x1, L.top); ctx.lineTo(L.x1, fondo); ctx.lineTo(R.x0, fondo); ctx.lineTo(R.x0, R.top); ctx.stroke();
  // gli stantuffi, appoggiati sul liquido
  ctx.fillStyle = css(C.dim);
  ctx.fillRect(L.x0 + 4, yL - 16, L.x1 - L.x0 - 8, 16); ctx.fillRect(R.x0 + 4, yR - 16, R.x1 - R.x0 - 8, 16);
}
const L1 = { x0: 400, x1: 470, top: 180 }, R1 = { x0: 800, x1: 940, top: 180 };   // diametri 1 : 2, superfici 1 : 4
const L2 = { x0: 400, x1: 414, top: 380 }, R2 = { x0: 700, x1: 1143, top: 330 };   // diametri 1 : √1000, superfici 1 : 1000
const corsa1 = t => P(t, 58.0, 61.0, E.lin), corsa2 = t => P(t, 81.8, 84.2, E.lin);   // spinta lenta, a velocità costante
function automobile(ctx, xc, yb) {
  ctx.save(); ctx.fillStyle = css(C.v, .85);
  ctx.beginPath(); ctx.roundRect(xc - 190, yb - 92, 380, 58, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(xc - 110, yb - 90); ctx.lineTo(xc - 70, yb - 146); ctx.lineTo(xc + 70, yb - 146); ctx.lineTo(xc + 120, yb - 90); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.paper, .8);
  ctx.beginPath(); ctx.moveTo(xc - 86, yb - 96); ctx.lineTo(xc - 60, yb - 134); ctx.lineTo(xc - 6, yb - 134); ctx.lineTo(xc - 6, yb - 96); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(xc + 6, yb - 96); ctx.lineTo(xc + 6, yb - 134); ctx.lineTo(xc + 62, yb - 134); ctx.lineTo(xc + 94, yb - 96); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css(C.ink);
  for (const x of [xc - 115, xc + 115]) { ctx.beginPath(); ctx.arc(x, yb - 30, 30, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(C.dim);
  for (const x of [xc - 115, xc + 115]) { ctx.beginPath(); ctx.arc(x, yb - 30, 12, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function sceneTorchio(ctx, t) {
  if (t < 33.4 || t > 94.6) return;
  const al = life(t, 33.6, 94.4, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1110, 680); card(ctx, 1260, 110, 550, 680);
  // fase 1: superfici 1 : 4, F₁ = 20 N regge F₂ = 80 N; il piccolo scende di 8 cm (160 px), il grande sale di 2 cm (40 px)
  const k1 = 1 - P(t, 72.6, 73.2), k2 = P(t, 73.2, 73.8);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    const s = corsa1(t), yL = 400 + 160 * s, yR = 400 - 40 * s;
    torchio(ctx, L1, R1, yL, yR, 600, 60);
    // il peso sul grande
    ctx.fillStyle = css(mix(C.dim, C.ink, .3)); ctx.beginPath(); ctx.roundRect(R1.x0 + 15, yR - 16 - 70, 110, 70, 8); ctx.fill();
    txt(ctx, '80 N', (R1.x0 + R1.x1) / 2, yR - 16 - 35, { size: 30, weight: 600, color: C.paper });
    // le forze: 2 px per newton
    const kf1 = P(t, 43.3, 43.8, E.out), kf2 = P(t, 48.4, 48.9, E.out);
    // le forze sugli stantuffi: F₁ preme sul piccolo, F₂ (il liquido) spinge su il grande
    const xL = (L1.x0 + L1.x1) / 2, xR = (R1.x0 + R1.x1) / 2;
    if (kf1 > 0) { freccia(ctx, [xL, yL - 16 - 40 * kf1], [xL, yL - 16], C.y); drawRich(ctx, '{my:F₁}', L1.x0 - 40, yL - 40, { size: 42, alpha: kf1 }); }
    if (kf2 > 0) { freccia(ctx, [xR, yR + 160], [xR, yR + 160 - 160 * kf2], C.y); drawRich(ctx, '{my:F₂}', R1.x1 + 44, yR + 80, { size: 42, alpha: kf2 }); }   // dal liquido, sotto lo stantuffo
    // le due superfici
    const ks = life(t, 38.6, 47.8, .4, .4);
    if (ks > 0) {
      ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.x); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(L1.x0 + 4, yL); ctx.lineTo(L1.x1 - 4, yL); ctx.moveTo(R1.x0 + 4, yR); ctx.lineTo(R1.x1 - 4, yR); ctx.stroke();
      drawRich(ctx, '{mx:S₁}', 435, yL + 44, { size: 40 }); drawRich(ctx, '{mx:S₂}', 870, yR + 44, { size: 40 });
      ctx.restore();
    }
    // le corse: dove partivano
    const kc = life(t, 58.0, 72.6, .4, .5);
    if (kc > 0) {
      dashed(ctx, [L1.x0 - 20, 384], [L1.x1 + 60, 384], C.dim, 1, kc);
      dashed(ctx, [R1.x0 - 20, 384], [R1.x1 + 20, 384], C.dim, 1, kc);
    }
    // la scheda
    conFont(TITOLI, () => drawRich(ctx, 'torchio idraulico', 1535, 170, { size: 40, weight: 600, alpha: P(t, 34.4, 35.0) }));
    riga(ctx, '{mx:S₂} = 4·{mx:S₁}', '', 250, C.x, P(t, 38.6, 39.1));
    riga(ctx, '{my:F₁} =', '20 N', 320, C.y, P(t, 43.4, 43.9));
    riga(ctx, '{my:F₂} =', '80 N', 385, C.y, P(t, 48.6, 49.1));
    drawSeq(ctx, [{ num: '{my:F₂}', den: '{my:F₁}' }, '{mink:=}', { num: '{mx:S₂}', den: '{mx:S₁}' }], 1535, 482, 44, { local: t - 53.5 });
    riga(ctx, 'corsa piccolo', fmtN1(8 * s) + ' cm', 585, C.ink, P(t, 58.0, 58.5), 1310, 1770, 36);
    riga(ctx, 'corsa grande', fmtN1(2 * s) + ' cm', 645, C.r, P(t, 58.0, 58.5), 1310, 1770, 36);
    drawRich(ctx, '20 N · 0,08 m = {g:1,6 J}', 1535, 712, { size: 32, local: t - 68.0 });
    drawRich(ctx, '80 N · 0,02 m = {g:1,6 J}', 1535, 756, { size: 32, local: t - 68.5 });
    ctx.restore();
  }
  // fase 2: l'automobile, superfici 1 : 1000
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    const s = corsa2(t), yL = 420 + 100 * s, yR = 420 - .1 * s;   // 10 cm giù → 0,1 mm su (1 px = 1 mm)
    torchio(ctx, L2, R2, yL, yR, 600, 40);
    automobile(ctx, (R2.x0 + R2.x1) / 2, yR - 16);
    // il dito sul piccolo
    ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
    // l'asta dello stantuffo piccolo, col bottone su cui preme il dito
    const xm = (L2.x0 + L2.x1) / 2, yb = yL - 16 - 150;
    ctx.save(); ctx.fillStyle = css(C.dim); ctx.fillRect(xm - 3, yb, 6, 150); ctx.beginPath(); ctx.roundRect(xm - 20, yb - 10, 40, 10, 3); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.roundRect(xm - 17, yb - 10 - 100, 34, 100, [17, 17, 8, 8]); ctx.fill(); ctx.stroke();
    if (s > 0) dashed(ctx, [L2.x0 - 50, 244], [L2.x1 + 50, 244], C.dim, 1, life(t, 81.8, 94.4, .3, .4));
    conFont(TITOLI, () => drawRich(ctx, 'un’automobile', 1535, 170, { size: 40, weight: 600 }));
    riga(ctx, '{mx:S₂} = 1000·{mx:S₁}', '', 250, C.x, P(t, 77.2, 77.7));
    riga(ctx, '{my:F₁} =', '9,8 N', 320, C.g, P(t, 77.6, 78.1));
    riga(ctx, '{my:F₂} =', '9800 N', 385, C.y, P(t, 73.6, 74.1));
    drawSeq(ctx, [{ num: '{my:F₂}', den: '{my:F₁}' }, '{mink:=}', { num: '{mx:S₂}', den: '{mx:S₁}' }, '{mink:= 1000}'], 1535, 482, 44, { local: t - 77.4 });
    riga(ctx, 'corsa piccolo', fmtN1(10 * s) + ' cm', 585, C.ink, P(t, 81.8, 82.3), 1310, 1770, 36);
    riga(ctx, 'corsa grande', fmtN(.1 * s, 2) + ' mm', 645, C.r, P(t, 81.8, 82.3), 1310, 1770, 36);
    drawRich(ctx, 'per alzarla di 10 cm:', 1310, 712, { size: 32, align: 'left', local: t - 86.0 });
    drawRich(ctx, 'il dito fa {r:100 m}', 1310, 756, { size: 32, align: 'left', local: t - 86.6 });
    ctx.restore();
  }
  ctx.restore();
}
const fmtN1 = v => fmtN(v, 1);

// 3 · in una frase (94.4–104.5)
function sceneFine(ctx, t) {
  if (t < 94.4) return;
  const al = 1 - P(t, 102.9, 103.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.6 });
    drawRich(ctx, 'La pressione si trasmette {g:uguale}:\nil torchio moltiplica la forza.', W / 2, 290, { size: 70, weight: 600, local: t - 95.0, stagger: .09 });
  });
  const pills = [[490, '{mv:Δp} uguale\nin tutto il liquido'], [960, '{my:F₂} / {my:F₁} = {mx:S₂} / {mx:S₁}'], [1430, 'più forza, meno corsa:\nil {g:lavoro} non cambia']];
  pills.forEach(([x, s], i) => {
    const a = 96.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 38 : 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue la pressione che sale (con l'easing di sceneDp), poi gli
  // stantuffi a velocità costante: il piccolo scende di tanto, il grande sale di poco (due toni insieme)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .5],                                                // il recipiente con tre manometri
    ['pop', 16.8, .6], ['tono', 17.2, 18.4, [.4, .419, .55, .681, .7]],               // spingo lo stantuffo: la pressione sale
    ['pop', 20.4, .7], ['pop', 20.7, .55], ['ding', 21.0],                            // +20 000 Pa, uguale per tutti e tre
    ['soffio', 25.2], ['pop', 25.6, .5],                                              // il principio di Pascal
    ['soffio', 33.6], ['pop', 34.4, .5],                                              // il torchio idraulico
    ['traccia', 38.6, 39.0], ['pop', 38.7, .45],                                      // S₂ = 4·S₁
    ['pop', 43.3, .5], ['pop', 48.4, .7], ['ding', 48.8],                             // F₁ = 20 N, F₂ = 80 N
    ['pop', 53.5, .55],                                                               // F₂ / F₁ = S₂ / S₁
    ['tono', 58.0, 61.0, [.6, .2]], ['tono', 58.0, 61.0, [.4, .5]],                   // il piccolo giù di 8 cm, il grande su di 2
    ['pop', 68.0, .5], ['ding', 68.9],                                                // 1,6 J e 1,6 J
    ['soffio', 73.2], ['pop', 73.6, .7],                                              // l'automobile: 9800 N
    ['pop', 77.2, .45], ['pop', 77.6, .3],                                            // S₂ = 1000·S₁, basta 9,8 N
    ['tono', 81.8, 84.2, [.6, .2]], ['tono', 81.8, 84.2, [.4, .405]],                 // il dito giù di 10 cm, l'auto su di 0,1 mm
    ['pop', 86.0, .45], ['pop', 86.7, .9],                                            // per 10 cm: il dito fa 100 m
    ['soffio', 94.6], ['pop', 96.6, .5], ['pop', 97.1, .6], ['pop', 97.6, .7],        // in una frase
  ];
  return {
    titolo: 'Sollevare un’auto con un dito', durata: 104.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.6, 'il principio di Pascal'], [33.6, 72.8, 'il torchio idraulico'], [72.8, 94.2, 'un’auto con un dito']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneRecipiente(ctx, t); sceneTorchio(ctx, t); sceneFine(ctx, t); },
  };
});
