'use strict';
/* Le montagne russe — senza attrito Ec + Ep resta costante: le barre dell'energia si travasano mentre il vagone corre
   (moto vero, integrato sul profilo); in fondo v = √(2·g·h), qualunque sia la massa. Argomento: energia. */
CVIDEO.registra('energia/conservazione', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed, fmtN } = M;

const T_FINE = 97.3;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.2, 'sorpreso'], [27.85, 'felice'],
  [32.65, 'neutro'], [37.0, 'pensa'], [41.8, 'festa'], [46.6, 'neutro'], [55.8, 'sorpreso'], [62.7, 'neutro'],
  [67.3, 'felice'], [71.65, 'neutro'], [74.3, 'pensa'], [79.1, 'neutro'], [83.7, 'felice'], [88.5, 'sorpreso'],
  [92.7, 'felice'], [T_FINE, 'neutro'], [99.6, 'felice'], [103.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.75, 'Un vagone scende da 20 m:\nquanto è veloce in fondo?'],
  [7.9, 12.4, 'Vagone di 500 kg, tenuto\nda un freno a 20 m.'],
  [12.5, 17.3, 'Immagino {g:niente attrito}\ne niente resistenza dell’aria.'],
  [17.4, 22.0, 'Ancora fermo: tutta energia\n{g:potenziale}, {mink:m·g·h} = 98 000 J.'],
  [22.1, 27.8, 'Tolgo il freno: la potenziale cala,\nla {g:cinetica} cresce.'],
  [27.85, 32.6, 'In fondo è tutta cinetica, 98 000 J,\ne la velocità è {x:massima}.'],
  [32.65, 36.9, 'Risale sul dosso di 12 m\ne rallenta.'],
  [37.0, 41.7, 'Qui: 58 800 J potenziale,\n39 200 J cinetica. Somma: {g:98 000 J}.'],
  [41.8, 46.5, 'La somma {g:non cambia mai}: è la\n{v:conservazione dell’energia meccanica}.'],
  [46.6, 51.0, 'Vale solo se lavorano solo\nforze {v:conservative}, come il peso.'],
  [51.1, 55.7, 'Riscende, poi risale fino a…'],
  [55.8, 62.6, '…20 m esatti: la stessa altezza\nda cui era partito.'],
  [62.7, 67.25, 'Ora torna indietro: ripassa\nla valle e risale sul dosso…'],
  [67.3, 71.6, '…di nuovo 12,5 m/s, come all’andata:\nstesse velocità negli stessi punti.'],
  [71.65, 74.2, 'E torna in fondo.'],
  [74.3, 79.0, 'In fondo {mink:m·g·h} è diventata\ntutta ½·{mink:m}·{mx:v}².'],
  [79.1, 83.6, 'La massa {mink:m} è da tutte e due\nle parti: {g:si semplifica}.'],
  [83.7, 88.4, 'Resta {mx:v} = √(2·{mink:g}·{mink:h}):\n√(2 · 9,8 · 20) ≈ {g:19,8 m/s}.'],
  [88.5, 92.6, 'Circa 71 km/h, che il vagone\nsia vuoto o pieno.'],
  [92.7, 97.2, 'Con 1000 kg l’energia è doppia,\nma la velocità è la stessa.'],
  [99.6, 104.6, 'Senza attrito l’energia si travasa\nda potenziale a cinetica, e ritorna.'],
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
function conPedici(ctx, s, x, y, o = {}) {   // «{mg:E}⌊c⌋» scrive E con la c piccola in basso
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
function numero(ctx, s, x, y, size, col, al = 1, align = 'right') {   // cifre a larghezza fissa, con l'unità dopo
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z°]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = align === 'center' ? x - (wu + wc) / 2 : x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
const migliaia = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
const lin = (t, keys) => {   // interpolazione lineare fra fotogrammi chiave (il tempo fisico scorre uniforme)
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};

// ---------- il profilo e il moto vero ----------
// tratti a coseno fra i punti (x, h) in metri: pendenza nulla in cima ai dossi e in fondo alle valli
const K = [[0, 20], [22, 0], [40, 12], [54, 3], [76, 26]];
const G = 9.8, MASSA = 500;
function prof(x) {   // [h, h′, h″]
  for (let i = 0; i < K.length - 1; i++) {
    const [x0, h0] = K[i], [x1, h1] = K[i + 1];
    if (x <= x1 || i === K.length - 2) {
      const L = x1 - x0, u = clamp((x - x0) / L), c = (1 - Math.cos(Math.PI * u)) / 2;
      return [h0 + (h1 - h0) * c, (h1 - h0) * Math.PI * Math.sin(Math.PI * u) / 2 / L, (h1 - h0) * Math.PI * Math.PI * Math.cos(Math.PI * u) / 2 / L / L];
    }
  }
}
// la partenza: dove il profilo è alto 20 m (sul primo tratto)
// la partenza: 0,3 m oltre la cima piatta (alta 20 m), dove la pista comincia appena a scendere
const X0 = .3;
const H0 = prof(X0)[0];   // ≈ 19,99 m
// il moto di una pallina vincolata al profilo, senza attrito: x″ = −h′·(g + h″·x′²) / (1 + h′²), integrato una volta sola (RK4)
const DT = 1 / 1000, TMAX = 15;
const XS = (() => {
  const acc = (x, v) => { const [, hp, hpp] = prof(x); return -hp * (G + hpp * v * v) / (1 + hp * hp); };
  const out = new Float64Array(Math.ceil(TMAX / DT) + 2); let x = X0, v = 0;
  for (let i = 0; i < out.length; i++) {
    out[i] = x;
    const a1 = acc(x, v), a2 = acc(x + v * DT / 2, v + a1 * DT / 2), a3 = acc(x + (v + a1 * DT / 2) * DT / 2, v + a2 * DT / 2), a4 = acc(x + (v + a2 * DT / 2) * DT, v + a3 * DT);
    x += DT * (v + 2 * (v + a1 * DT / 2) + 2 * (v + a2 * DT / 2) + (v + a3 * DT)) / 6; v += DT * (a1 + 2 * a2 + 2 * a3 + a4) / 6;
  }
  return out;
})();
const xAt = tau => { const f = clamp(tau, 0, TMAX) / DT, i = Math.floor(f); return lerp(XS[i], XS[i + 1], f - i); };
// il tempo fisico nel video: al rallentatore (1,25 s di video per 1 s vero), con le pause per i fumetti
// tempi veri (dal via): in fondo 4,466 s, sul dosso 5,855 s, fermo a 20 m 9,349 s, di nuovo sul dosso 12,843 s, in fondo 14,231 s
const TAU = [[22.2, 0], [27.7825, 4.466], [32.7, 4.466], [34.436, 5.855], [51.2, 5.855], [55.5675, 9.349], [62.8, 9.349], [67.1675, 12.843],
  [71.7, 12.843], [73.435, 14.231]];
const MOSSO = [[22.2, 27.7825], [32.7, 34.436], [51.2, 55.5675], [62.8, 67.1675], [71.7, 73.435]];
function stato(t) {
  const tau = lin(t, TAU), x = xAt(tau), [h, hp] = prof(x);
  const dx = xAt(tau + .001) - x, verso = dx >= 0 ? 1 : -1;
  const v = Math.sqrt(Math.max(0, 2 * G * (H0 - h)));   // dalla conservazione dell'energia
  return { x, h, hp, v, verso, ep: MASSA * G * h, ec: MASSA * G * (H0 - h) };
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Le montagne russe', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- la pista: 12 px per metro in tutte e due le direzioni ----------
const SC = [110, 110, 1000, 680], OX = 220, OY = 700, PXM = 11;
const sx = x => OX + x * PXM, sy = h => OY - h * PXM;
const PISTA = (() => { const p = []; for (let i = 0; i <= 380; i++) { const x = 76 * i / 380; p.push([sx(x), sy(prof(x)[0])]); } return p; })();
function vagone(ctx, s, al) {
  const ang = Math.atan2(-s.hp, 1), cx = sx(s.x), cy = sy(s.h);
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.v, C.paper, .55)); ctx.strokeStyle = css(mix(C.v, C.ink, .4)); ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.roundRect(-30, -40, 60, 30, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink);
  for (const xw of [-18, 18]) { ctx.beginPath(); ctx.arc(xw, -8, 7, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  return [cx - Math.sin(ang) * -25, cy - Math.cos(ang) * 25];   // il centro del vagone
}
function scenePista(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5), s = stato(t);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // la scala delle altezze
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(220, OY); ctx.lineTo(220, sy(26)); ctx.stroke();
  for (const h of [0, 10, 20]) {
    ctx.beginPath(); ctx.moveTo(213, sy(h)); ctx.lineTo(227, sy(h)); ctx.stroke();
  }
  txt(ctx, '20 m', 204, sy(20) + 24, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, '10 m', 204, sy(10), { size: 30, color: C.dim, align: 'right' }); txt(ctx, '0', 204, OY, { size: 30, color: C.dim, align: 'right' });
  // il livello di partenza, 20 m
  dashed(ctx, [sx(0), sy(20)], [sx(76), sy(20)], C.g, 1, .55);
  // i piloni e la pista
  ctx.strokeStyle = css(C.dim, .45); ctx.lineWidth = 3;
  for (let x = 6; x < 76; x += 4) { const h = prof(x)[0]; if (h > .8) { ctx.beginPath(); ctx.moveTo(sx(x), sy(h) + 4); ctx.lineTo(sx(x), OY); ctx.stroke(); } }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(220, OY); ctx.lineTo(1090, OY); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...PISTA[0]); PISTA.slice(1).forEach(p => ctx.lineTo(...p)); ctx.stroke();   // la cima, a 20 m, è piatta
  // la quota del dosso
  // la velocità sul dosso resta scritta: al ritorno ripassa con la stessa
  const kV = life(t, 34.5, 74.2, .4, .4);
  if (kV > 0) { ctx.save(); ctx.globalAlpha *= kV; ctx.fillStyle = C.paper; ctx.fillRect(sx(40) - 80, sy(12) - 140, 160, 40); ctx.restore(); drawRich(ctx, '{x:12,5 m/s}', sx(40), sy(12) - 120, { size: 32, alpha: kV }); }
  const kD = life(t, 32.6, 51.0, .4, .5);
  if (kD > 0) { dashed(ctx, [sx(40), sy(12)], [sx(40), OY], C.dim, 1, kD); ctx.save(); ctx.globalAlpha *= kD; ctx.fillStyle = C.paper; ctx.fillRect(sx(40) - 88, sy(3.5) - 20, 78, 40); ctx.restore(); txt(ctx, '12 m', sx(40) - 12, sy(3.5), { size: 30, color: C.dim, align: 'right', alpha: kD }); }
  // il vagone e la sua velocità (5 px per m/s), tangente alla pista
  const c = vagone(ctx, s, P(t, 8.0, 8.5));
  if (s.v > .3) {
    const L = s.v * 5, ux = s.verso / Math.sqrt(1 + s.hp * s.hp), uy = -s.verso * s.hp / Math.sqrt(1 + s.hp * s.hp);
    const nx = -s.hp / Math.sqrt(1 + s.hp * s.hp), ny = -1 / Math.sqrt(1 + s.hp * s.hp);   // la normale verso l'alto
    const a = [c[0] + nx * 44, c[1] + ny * 44];
    freccia(ctx, a, [a[0] + ux * L, a[1] + uy * L], C.x, clamp(s.v / 2), 6);
  }
  // fermo immagine / rallentatore
  const muove = MOSSO.some(([a, b]) => t >= a && t <= b), partito = t > 22.2;
  txt(ctx, muove ? 'al rallentatore' : partito ? 'fermo immagine' : '', 1090, 150, { size: 30, color: C.dim, align: 'right' });
  ctx.restore();
}

// ---------- la scheda delle energie (4 px per kJ) ----------
const BY = 690, BK = 3.6 / 1000, BW = 120;
function sceneBarre(ctx, t) {
  if (t < 7.5 || t > 74.6) return;
  const al = life(t, 8.0, 74.4, .5, .5), s = stato(t);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'energia del vagone');
  drawRich(ctx, '{mink:h} =', 1300, 215, { size: 36, align: 'right' }); numero(ctx, fmtN(s.h, 1) + ' m', 1450, 215, 36, C.ink);
  drawRich(ctx, '{mink:m} = 500 kg,   {mink:g} = 9,8 m/s²', 1480, 262, { size: 30, alpha: P(t, 8.1, 8.6) });
  drawRich(ctx, '{mx:v} =', 1560, 215, { size: 36, align: 'right' }); numero(ctx, fmtN(s.v, 1) + ' m/s', 1775, 215, 36, C.x);
  const kB = P(t, 17.5, 18.0);
  if (kB > 0) {
    ctx.save(); ctx.globalAlpha *= kB;
    const ep = Math.round(s.ep / 100) * 100, ec = 98000 - ep, colP = mix(C.g, C.paper, .5);
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1200, BY); ctx.lineTo(1760, BY); ctx.stroke();
    ctx.fillStyle = css(colP); ctx.fillRect(1300 - BW / 2, BY - ep * BK, BW, ep * BK);
    ctx.fillStyle = css(C.g); ctx.fillRect(1480 - BW / 2, BY - ec * BK, BW, ec * BK);
    // la somma: le due energie una sopra l'altra
    ctx.save(); ctx.globalAlpha *= P(t, 22.3, 22.8);   // la somma entra con il suo nome e il suo valore
    ctx.fillStyle = css(colP); ctx.fillRect(1660 - BW / 2, BY - ep * BK, BW, ep * BK);
    ctx.fillStyle = css(C.g); ctx.fillRect(1660 - BW / 2, BY - 98000 * BK, BW, ec * BK);
    ctx.restore();
    numero(ctx, migliaia(ep) + ' J', 1300, BY - ep * BK - 24, 30, C.g, 1, 'center');
    numero(ctx, migliaia(ec) + ' J', 1480, BY - ec * BK - 24, 30, C.g, 1, 'center');
    numero(ctx, '98 000 J', 1660, BY - 98000 * BK - 24, 30, C.g, P(t, 22.3, 22.8), 'center');
    conPedici(ctx, '{dim:potenziale}', 1300, BY + 36, { size: 30, align: 'center' });
    conPedici(ctx, '{dim:cinetica}', 1480, BY + 36, { size: 30, align: 'center' });
    conPedici(ctx, '{mg:E}⌊p⌋', 1300, BY + 74, { size: 34, align: 'center' });
    conPedici(ctx, '{mg:E}⌊c⌋', 1480, BY + 74, { size: 34, align: 'center' });
    conPedici(ctx, '{g:somma}', 1660, BY + 36, { size: 30, align: 'center', alpha: P(t, 22.3, 22.8) });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la velocità in fondo (72,7–95,7) ----------
function sceneFormula(ctx, t) {
  if (t < 74.1 || t > T_FINE + .3) return;
  const al = life(t, 74.3, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'la velocità in fondo');
  drawRich(ctx, '{mink:m·g·h = ½·m·}{mx:v}{mink:²}', 1480, 250, { size: 48, local: t - 74.5 });
  drawRich(ctx, '{mink:g·h = ½·}{mx:v}{mink:²}', 1480, 330, { size: 48, local: t - 79.3 });
  drawRich(ctx, '{dim:la massa} {mink:m} {dim:si semplifica}', 1480, 380, { size: 30, local: t - 79.8 });
  drawRich(ctx, '{mx:v}{mink: = √(2·g·h)}', 1480, 450, { size: 54, local: t - 83.9 });
  drawRich(ctx, '= √(2 · 9,8 · 20) ≈ {g:19,8 m/s}', 1480, 520, { size: 38, local: t - 84.5 });
  drawRich(ctx, '{dim:≈ 71 km/h}', 1480, 566, { size: 34, local: t - 88.7 });
  ctx.save(); ctx.globalAlpha *= P(t, 92.8, 93.3);
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, 604); ctx.lineTo(1770, 604); ctx.stroke();
  ctx.restore();
  for (const [m, e, y, ta] of [['500 kg', '98 000 J', 650, 92.9], ['1000 kg', '196 000 J', 710, 93.6]]) {
    const k = P(t, ta, ta + .5);
    txt(ctx, m, 1190, y, { size: 36, align: 'left', alpha: k });
    txt(ctx, e, 1480, y, { size: 36, color: C.g, alpha: k });
    txt(ctx, '19,8 m/s', 1770, y, { size: 36, color: C.x, align: 'right', alpha: k });
  }
  ctx.restore();
}

// in una frase (95,7–105,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 105.0, 106.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 97.5 });
    drawRich(ctx, 'Senza attrito, energia potenziale\npiù cinetica resta costante.', W / 2, 290, { size: 70, weight: 600, local: t - 97.9, stagger: .09 });
  });
  const pills = [[490, ''], [960, 'vale solo con\nforze {v:conservative}'], [1430, '']];
  pills.forEach(([x, s], i) => {
    const a = 100.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    if (i === 0) conPedici(ctx, '{mg:E}⌊c⌋{mink: + }{mg:E}⌊p⌋{mink: = }{g:costante}', x, 505, { size: 38, align: 'center' });
    else if (i === 1) drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    else drawRich(ctx, '{mx:v}{mink: = √(2·g·h)}\n{dim:qualunque sia la massa}', x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza del vagone, da 0 m (0) a 20 m (1),
  // campionata dal moto vero (stato(t)) nei tratti al rallentatore
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .9],                                                // la pista, il vagone fermo a 20 m
    ['pop', 17.5, .8], ['pop', 22.3, .7],                                             // la barra della potenziale, la somma
    ['tono', 22.2, 27.78, [1, .999, .997, .987, .949, .84, .623, .296, 0]],           // tolto il freno: scende fino in fondo
    ['pop', 27.8, .3],                                                                // tutta cinetica
    ['traccia', 32.6, 33.1], ['tono', 32.7, 34.44, [0, .047, .144, .251, .355, .448, .525, .579, .6]],   // il dosso di 12 m
    ['pop', 34.5, .6],                                                                // 12,5 m/s sul dosso
    ['tono', 51.2, 55.57, [.6, .471, .233, .209, .472, .704, .87, .968, 1]], ['ding', 55.6],   // riscende e risale a 20 m esatti
    ['tono', 62.8, 67.17, [1, .968, .87, .704, .472, .209, .233, .472, .6]], ['ding', 67.2],   // indietro: di nuovo 12,5 m/s
    ['tono', 71.7, 73.44, [.6, .579, .525, .447, .354, .251, .144, .047, 0]],          // e torna in fondo
    ['soffio', 74.3], ['pop', 74.5, .5],                                              // la velocità in fondo: m·g·h = ½·m·v²
    ['pop', 79.3, .5], ['pop', 79.8, .35],                                            // g·h = ½·v², la massa si semplifica
    ['pop', 83.9, .6], ['ding', 84.95], ['pop', 88.7, .4],                            // v = √(2·g·h) ≈ 19,8 m/s, 71 km/h
    ['traccia', 92.8, 93.3], ['pop', 92.9, .45], ['pop', 93.6, .6],                   // 500 kg e 1000 kg: stessa velocità
    ['soffio', 97.5], ['pop', 100.0, .5], ['pop', 100.5, .6], ['pop', 101.0, .7],     // in una frase
  ];
  return {
    titolo: 'Le montagne russe', durata: 107.1, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 41.7, 'l’energia si travasa'], [41.7, 74.2, 'la somma non cambia'], [74.2, T_FINE, 'la velocità in fondo']],
    scena(ctx, t) { sceneIntro(ctx, t); scenePista(ctx, t); sceneBarre(ctx, t); sceneFormula(ctx, t); sceneFine(ctx, t); },
  };
});
