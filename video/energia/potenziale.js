'use strict';
/* La strada non conta — salire di 3 m per la scala o per la rampa: il lavoro del peso è sempre −m·g·h; l'energia potenziale
   m·g·h rispetto a un livello scelto come zero; su un giro chiuso il peso non lavora: è una forza conservativa. Argomento: energia. */
CVIDEO.registra('energia/potenziale', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [88.0, 190], [89.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [88.0, 1050], [89.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [88.0, 2.2], [89.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [88.0, 2], [89.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [88.0, -1.5], [89.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [18.9, 'felice'], [23.7, 'neutro'],
  [29.1, 'felice'], [33.7, 'neutro'], [38.1, 'pensa'], [43.0, 'sorpreso'], [48.3, 'felice'], [53.1, 'neutro'],
  [57.6, 'pensa'], [62.7, 'neutro'], [67.3, 'felice'], [72.2, 'neutro'], [74.5, 'festa'], [77.6, 'neutro'],
  [82.5, 'pensa'], [88.0, 'neutro'], [90.0, 'felice'], [94.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.5, 'Salire di 3 m: meglio\nla scala o la rampa?'],
  [7.9, 13.2, 'Cassa di 10 kg: peso {my:P} = {mink:m·g},\ncon {mink:g} = 9,8 m/s²: 98 N.'],
  [13.3, 18.8, 'La porto su per la scala,\na velocità costante.'],
  [18.9, 23.6, 'Sui gradini in piano il peso è\nperpendicolare: lavoro {g:zero}.'],
  [23.7, 29.0, 'Ogni alzata, 0,5 m, va contro:\n98 · 0,5 · (−1) = −49 J.'],
  [29.1, 33.6, 'Sei alzate: −49 · 6 = {g:−294 J}.'],
  [33.7, 38.0, 'Ora la rampa: lunga 6 m,\ninclinata di 30°.'],
  [38.1, 42.9, 'Fra il peso e lo spostamento\nci sono 120°: {mink:cos} 120° = −0,5.'],
  [43.0, 48.2, '98 N · 6 m · (−0,5) = {g:−294 J}:\nlo stesso lavoro della scala!'],
  [48.3, 53.0, 'Il lavoro del peso dipende solo\ndal {g:dislivello}: −{mink:m·g·h}.'],
  [53.1, 57.5, 'Il lavoro fatto contro il peso resta\nimmagazzinato: {g:energia potenziale}.'],
  [57.6, 62.6, '{mink:m·g·h} = 10 · 9,8 · 3 = {g:294 J}:\n{mink:h} parte dal pavimento.'],
  [62.7, 67.2, 'Lo zero si sceglie: contano\nsolo le {g:differenze} di energia.'],
  [67.3, 72.1, 'Zero in alto: sotto −294 J, sopra 0.\nDifferenza: sempre {g:294 J}.'],
  [72.2, 77.5, 'Su per la scala, giù per la rampa:\n−294 J + 294 J = {g:0}.'],
  [77.6, 82.4, 'Forze così si chiamano\n{v:conservative}: il peso è una di queste.'],
  [82.5, 87.6, 'L’{r:attrito} no: su un giro chiuso\nil suo lavoro non torna mai a zero.'],
  [90.0, 95.0, 'Il lavoro del peso dipende solo\ndal dislivello, non dalla strada.'],
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
function conPedici(ctx, s, x, y, o = {}) {   // «{mg:E}⌊p⌋» scrive E con la p piccola in basso
  const size = o.size || 40, al = (o.alpha != null ? o.alpha : 1), align = o.align || 'left', ps = Math.max(30, Math.round(size * .7));
  if (al <= 0) return;
  const parti = s.split(/⌊([^⌋]*)⌋/);
  const ws = parti.map((p, i) => p ? richW(ctx, p, i % 2 ? ps : size) : 0);
  const tot = ws.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parti.forEach((p, i) => { if (p) drawRich(ctx, p, cx, y + (i % 2 ? size * .3 : 0), { size: i % 2 ? ps : size, align: 'left', alpha: al }); cx += ws[i]; });
}
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function riga(ctx, nome, val, y, al, col = C.g, size = 36) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1190, y, { size, align: 'left', alpha: al });
  drawRich(ctx, val, 1770, y, { size: size + 2, align: 'right', alpha: al, fill: css(col) });
}
// lungo una spezzata di punti, alla frazione k della lunghezza: [punto, indice del tratto]
function lungo(pts, k) {
  const L = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
  let d = clamp(k) * tot;
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i] || i === L.length - 1) { const u = L[i] ? Math.min(1, d / L[i]) : 0; return [[lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)], i]; }
    d -= L[i];
  }
}

// ---------- la scena: 75 px per metro; pavimento a 690, piano di arrivo 3 m più in alto ----------
const SC = [110, 110, 1000, 680], PXM = 75, GY = 690, TY = GY - 3 * PXM, ALZ = .5 * PXM, PED = 55, X0S = 175;
const RAD = Math.PI / 180, A30 = 30 * RAD, XR0 = 650, XR1 = XR0 + 3 / Math.tan(A30) * PXM;   // la rampa: da 650 a ≈ 1040
const BOX = 44, FSP = .8;   // cassa di 44 px; il peso 0,8 px per newton (98 N → 78 px)
// il profilo pieno: scala, pianerottolo, rampa
function profilo() {
  const p = [[X0S, GY]];
  for (let i = 0; i < 6; i++) { p.push([X0S + PED * i, GY - ALZ * (i + 1)]); p.push([X0S + PED * (i + 1), GY - ALZ * (i + 1)]); }
  p.push([XR0, TY]); p.push([XR1, GY]);
  return p;
}
const PROF = profilo();
// il percorso della cassa sulla scala (punto di appoggio): alza, poi sposta sul gradino
const PSCALA = (() => {
  const p = [[X0S - BOX / 2 - 1, GY]];
  for (let i = 0; i < 6; i++) { const x = X0S - BOX / 2 - 1 + PED * i, y = GY - ALZ * (i + 1); p.push([x, y]); p.push([x + PED, y]); }
  p.push([540, TY]);
  return p;
})();
const U = [-Math.cos(A30), -Math.sin(A30)], NR = [Math.sin(A30), -Math.cos(A30)];   // su per la rampa; normale verso fuori
const sulla = s => [XR1 + U[0] * s * PXM, GY + U[1] * s * PXM];                    // punto della rampa a s metri dal fondo
function cassa(ctx, c, ang, al) {   // c: punto di appoggio; ang: inclinazione
  if (al <= 0) return null;
  const n = [Math.sin(ang), -Math.cos(ang)], cc = [c[0] + n[0] * BOX / 2, c[1] + n[1] * BOX / 2];
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(...cc); ctx.rotate(ang);
  ctx.fillStyle = css(mix(C.y, C.paper, .66)); ctx.strokeStyle = css(mix(C.y, C.ink, .45)); ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.rect(-BOX / 2, -BOX / 2, BOX, BOX); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-BOX / 2 + 7, -BOX / 2 + 7); ctx.lineTo(BOX / 2 - 7, BOX / 2 - 7); ctx.stroke();
  ctx.restore();
  return cc;
}
function peso(ctx, cc, al) {
  if (!cc || al <= 0) return;
  freccia(ctx, cc, [cc[0], cc[1] + 98 * FSP], C.y, al, 6);
  M.dot(ctx, cc, C.ink, al, 6);
}
// le due casse nel tempo
function cassaScala(t) { return lungo(PSCALA, clamp((t - 13.0) / 5.6))[0]; }
function cassaRampa(t) {
  const s = 6 * clamp((t - 43.2) / 4.0);   // 6 m in 4 s, velocità costante
  if (t < 47.2) return { c: sulla(s), ang: A30 };
  return { c: [lerp(XR0, 615, clamp((t - 47.2) / .5)), TY], ang: 0 };
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La strada non conta', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1–4 · la scala e la rampa (7,5–88)
function sceneScala(ctx, t) {
  if (t < 7.5 || t > 88.3) return;
  const al = life(t, 7.6, 88.1, .6, .5);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il pavimento e il profilo pieno
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, GY); ctx.lineTo(1090, GY); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .84)); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...PROF[0]); PROF.slice(1).forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke();
  // gradini in piano (verdi) e alzate (viola), quando Stilla ne parla
  const kPiano = life(t, 19.0, 33.6, .4, .4), kAlz = life(t, 23.8, 33.6, .4, .4);
  ctx.lineCap = 'round'; ctx.lineWidth = 8;
  for (let i = 0; i < 6; i++) {
    const x = X0S + PED * i, y0 = GY - ALZ * i, y1 = GY - ALZ * (i + 1);
    if (kAlz > 0) { ctx.strokeStyle = css(C.v, kAlz); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    if (kPiano > 0) { ctx.strokeStyle = css(C.g, kPiano); ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x + PED, y1); ctx.stroke(); }
  }
  drawRich(ctx, '{g:in piano: 0 J}', 300, 380, { size: 32, alpha: kPiano });
  drawRich(ctx, '{v:ogni alzata: −49 J}', 300, 425, { size: 32, alpha: kAlz });
  // la rampa: lunghezza e angolo
  const kR = life(t, 33.9, 53.0, .5, .5);
  if (kR > 0) {
    const off = 78, a = sulla(0), b = sulla(6);
    const a2 = [a[0] + NR[0] * off, a[1] + NR[1] * off], b2 = [b[0] + NR[0] * off, b[1] + NR[1] * off];
    ctx.save(); ctx.globalAlpha *= kR;
    freccia(ctx, [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2], a2, C.dim, 1, 3); freccia(ctx, [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2], b2, C.dim, 1, 3);
    drawRich(ctx, '{mink:l} = 6 m', (a2[0] + b2[0]) / 2 + NR[0] * 54, (a2[1] + b2[1]) / 2 + NR[1] * 54, { size: 34 });
    // l'angolo della rampa sparisce prima che la cassa salga (il peso le passerebbe sopra)
    const k30 = 1 - P(t, 42.6, 43.1);
    ctx.strokeStyle = css(C.v, k30); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(XR1, GY, 74, Math.PI, Math.PI + A30); ctx.stroke();
    txt(ctx, '30°', XR1 - 112, GY - 22, { size: 32, color: C.v, alpha: k30 });
    ctx.restore();
  }
  // le casse
  const kS = P(t, 8.0, 8.5) * (1 - P(t, 72.0, 72.5));
  const cS = cassa(ctx, cassaScala(t), 0, kS);
  peso(ctx, cS, P(t, 8.2, 8.7) * (1 - P(t, 72.0, 72.5)));
  if (cS) drawRich(ctx, '{my:P}', cS[0] - 22, cS[1] + 98 * FSP - 14, { size: 34, align: 'right', alpha: life(t, 8.4, 33.6, .4, .4) });
  const kRb = P(t, 33.9, 34.4) * (1 - P(t, 72.0, 72.5));
  if (kRb > 0) {
    const r = cassaRampa(t), cR = cassa(ctx, r.c, r.ang, kRb);
    peso(ctx, cR, kRb);
  }
  // l'angolo di 120° fra il peso e lo spostamento, ingrandito sopra la rampa (stessa direzione della rampa)
  const k120 = life(t, 38.3, 53.0, .4, .5);
  if (k120 > 0) {
    const O = [930, 275], S = [O[0] + U[0] * 170, O[1] + U[1] * 170];
    ctx.save(); ctx.globalAlpha *= k120;
    freccia(ctx, O, S, C.ink, 1, 5);
    txt(ctx, 'spostamento', S[0] - 10, S[1] - 34, { size: 30, color: C.dim });
    freccia(ctx, O, [O[0], O[1] + 98 * 1.4], C.y, 1, 6);
    drawRich(ctx, '{my:P}', O[0] + 26, O[1] + 120, { size: 36, align: 'left' });
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(O[0], O[1], 52, Math.PI / 2, Math.PI + A30); ctx.stroke();
    txt(ctx, '120°', O[0] - 92, O[1] + 58, { size: 34, weight: 600, color: C.v });
    M.dot(ctx, O, C.ink, 1, 7);
    ctx.restore();
  }
  // l'altezza e il livello zero
  const kH = life(t, 53.3, 72.0, .5, .5);
  if (kH > 0) {
    ctx.save(); ctx.globalAlpha *= kH;
    freccia(ctx, [578, (GY + TY) / 2], [578, TY + 4], C.ink, 1, 3); freccia(ctx, [578, (GY + TY) / 2], [578, GY - 4], C.ink, 1, 3);
    drawRich(ctx, '{mink:h} = 3 m', 596, (GY + TY) / 2, { size: 34, align: 'left' });
    ctx.restore();
  }
  const kZ = life(t, 58.3, 72.0, .4, .5), kZ2 = life(t, 67.4, 72.0, .4, .5);
  txt(ctx, 'zero', 140, GY + 30, { size: 30, weight: 600, color: C.v, align: 'left', alpha: kZ * (1 - kZ2) });
  if (kZ2 > 0) {
    dashed(ctx, [130, TY], [1090, TY], C.v, 1, kZ2);
    txt(ctx, 'zero', 1085, TY - 26, { size: 30, weight: 600, color: C.v, align: 'right', alpha: kZ2 });
  }
  // il giro chiuso: su per la scala, giù per la rampa, indietro sul pavimento
  const kG = life(t, 72.3, 87.9, .4, .5);
  if (kG > 0) {
    const giro = [...PSCALA.slice(0, -1).map(p => [p[0] + BOX / 2 + 1, p[1]]), [XR0, TY], [XR1, GY], [X0S, GY]]
      .map(p => [p[0], p[1] - 10]);
    ctx.save(); ctx.globalAlpha *= kG;
    M.glowStroke(ctx, giro, P(t, 72.5, 76.5, E.lin), C.v, 5);
    const [pt] = lungo(giro, P(t, 72.5, 76.5, E.lin));
    M.dot(ctx, pt, C.v, 1, 10);
    ctx.restore();
  }
  ctx.restore();
}

// la scheda a destra
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore();
}
function sceneScheda(ctx, t) {
  if (t < 7.5 || t > 88.3) return;
  const al = life(t, 8.0, 88.1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  // 1–2 · il lavoro del peso: scala e rampa
  const a1 = 1 - P(t, 52.9, 53.4);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    titoletto(ctx, 'il lavoro del peso');
    riga(ctx, '{my:P} = {mink:m·g}', '98 N', 235, P(t, 8.1, 8.6), C.y);
    linea(ctx, 275, P(t, 12.9, 13.4));
    riga(ctx, '{v:per la scala}', '', 310, P(t, 12.9, 13.4));
    riga(ctx, '{dim:gradini in piano}', '0 J', 365, P(t, 19.1, 19.6));
    riga(ctx, '{dim:ogni alzata}', '−49 J', 420, P(t, 23.9, 24.4));
    riga(ctx, '{dim:sei alzate}', '−294 J', 475, P(t, 29.3, 29.8));
    linea(ctx, 515, P(t, 33.9, 34.4));
    riga(ctx, '{v:per la rampa}', '', 550, P(t, 33.9, 34.4));
    riga(ctx, '{mink:L = }{my:P}{mink:·l·cos} 120°', '', 605, P(t, 38.3, 38.8));
    riga(ctx, '{dim:= 98 · 6 · (−0,5)}', '−294 J', 660, P(t, 43.2, 43.7));
    drawRich(ctx, '{dim:in tutti e due i casi} {mink:L = −m·g·h}', 1480, 735, { size: 34, alpha: P(t, 48.5, 49.0) });
    ctx.restore();
  }
  // 3 · l'energia potenziale e lo zero
  const a3 = life(t, 53.3, 72.1, .5, .5);
  if (a3 > 0) {
    ctx.save(); ctx.globalAlpha *= a3;
    titoletto(ctx, 'energia potenziale');
    conPedici(ctx, '{mg:E}⌊p⌋{mink: = m·g·h}', 1480, 255, { size: 54, align: 'center' });
    drawRich(ctx, '= 10 · 9,8 · 3 = {g:294 J}', 1480, 335, { size: 40, local: t - 53.6 });
    linea(ctx, 385, P(t, 58.3, 58.8));
    const k1 = P(t, 58.3, 58.8), k2 = P(t, 67.4, 67.9);
    txt(ctx, 'zero', 1190, 430, { size: 30, color: C.dim, align: 'left', alpha: k1 });
    txt(ctx, 'sotto', 1560, 430, { size: 30, color: C.dim, alpha: k1 });
    txt(ctx, 'sopra', 1700, 430, { size: 30, color: C.dim, alpha: k1 });
    drawRich(ctx, '{v:sul pavimento}', 1190, 490, { size: 34, align: 'left', alpha: k1 });
    txt(ctx, '0 J', 1560, 490, { size: 38, color: C.g, alpha: k1 }); txt(ctx, '294 J', 1700, 490, { size: 38, color: C.g, alpha: k1 });
    drawRich(ctx, '{v:in alto}', 1190, 555, { size: 34, align: 'left', alpha: k2 });
    txt(ctx, '−294 J', 1560, 555, { size: 38, color: C.g, alpha: k2 }); txt(ctx, '0 J', 1700, 555, { size: 38, color: C.g, alpha: k2 });
    drawRich(ctx, '{dim:differenza:} {g:294 J}{dim: in tutti e due i casi}', 1480, 650, { size: 34, alpha: P(t, 69.0, 69.5) });
    ctx.restore();
  }
  // 4 · il giro chiuso
  const a4 = P(t, 72.2, 72.7);
  if (a4 > 0) {
    ctx.save(); ctx.globalAlpha *= a4;
    titoletto(ctx, 'il giro chiuso');
    riga(ctx, '{dim:su per la scala}', '−294 J', 250, P(t, 72.5, 73.0));
    riga(ctx, '{dim:giù per la rampa}', '+294 J', 310, P(t, 74.5, 75.0));
    linea(ctx, 350, P(t, 75.6, 76.1));
    riga(ctx, '{dim:in tutto}', '0 J', 395, P(t, 75.6, 76.1), C.g, 40);
    drawRich(ctx, '{dim:il peso è una forza}\n{v:conservativa}', 1480, 520, { size: 38, alpha: P(t, 77.8, 78.3) });
    drawRich(ctx, '{r:attrito}{dim: su un giro chiuso:}\n{dim:lavoro sempre negativo}', 1480, 680, { size: 34, alpha: P(t, 82.7, 83.2) });
    ctx.restore();
  }
  ctx.restore();
}

// 5 · in una frase (88–97,5)
function sceneFine(ctx, t) {
  if (t < 87.9) return;
  const al = 1 - P(t, 95.4, 96.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 88.2 });
    drawRich(ctx, 'Il lavoro del peso dipende\nsolo dal dislivello.', W / 2, 290, { size: 70, weight: 600, local: t - 88.6, stagger: .09 });
  });
  const pills = [[490, ''], [960, 'lo zero si sceglie:\ncontano le {g:differenze}'], [1430, 'giro chiuso:\nlavoro del peso {g:zero}']];
  pills.forEach(([x, s], i) => {
    const a = 90.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    if (i === 0) conPedici(ctx, '{mg:E}⌊p⌋{mink: = m·g·h}', x, 505, { size: 44, align: 'center' });
    else drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della cassa (o del punto del giro chiuso),
  // dal pavimento (.1) al piano 3 m più su (.9), campionata da cassaScala(), cassaRampa() e lungo(giro)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.1, .5],                                                // la scala e la rampa, la cassa col peso
    ['traccia', 12.9, 13.4],                                                          // «per la scala»
    ['tono', 13.0, 18.6, [.1, .233, .268, .367, .435, .5, .603, .633, .767, .767, .9, .9, .9]],   // su per i gradini
    ['pop', 19.0, .35], ['pop', 23.8, .5], ['ding', 29.3],                            // in piano 0 J, ogni alzata −49 J; −294 J
    ['pop', 33.9, .5], ['traccia', 33.9, 34.4],                                       // la rampa: 6 m, 30°
    ['pop', 38.3, .45], ['traccia', 38.4, 38.9],                                      // l'angolo di 120°
    ['ding', 43.5], ['tono', 43.2, 47.2, [.1, .9]],                                   // −294 J, la cassa sale la rampa
    ['pop', 48.5, .5],                                                                // L = −m·g·h
    ['soffio', 53.3], ['pop', 53.4, .55], ['ding', 54.0],                             // energia potenziale: h = 3 m, 294 J
    ['traccia', 58.3, 58.8], ['pop', 58.4, .2],                                       // lo zero sul pavimento
    ['pop', 67.4, .85], ['ding', 69.1],                                               // lo zero in alto: differenza sempre 294 J
    ['soffio', 72.2], ['traccia', 72.5, 76.5],                                        // il giro chiuso
    ['tono', 72.5, 76.5, [.1, .367, .633, .9, .9, .652, .354, .1, .1, .1, .1, .1, .1]],
    ['pop', 72.6, .5], ['pop', 74.6, .5], ['ding', 75.8],                             // −294 J, +294 J: in tutto 0 J
    ['pop', 77.8, .6], ['pop', 82.7, .3],                                             // conservativa; l'attrito no
    ['soffio', 88.2], ['pop', 90.6, .5], ['pop', 91.1, .6], ['pop', 91.6, .7],        // in una frase
  ];
  return {
    titolo: 'La strada non conta', durata: 97.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 33.6, 'per la scala'], [33.6, 53.0, 'per la rampa'], [53.0, 72.1, 'l’energia potenziale'], [72.1, 87.9, 'forze conservative']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScala(ctx, t); sceneScheda(ctx, t); sceneFine(ctx, t); },
  };
});
