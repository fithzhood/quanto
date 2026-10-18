'use strict';
/* Il letto di chiodi — la stessa forza su una superficie piccola o grande: p = F/S (scarponi e sci, chiodi, tacchi). Argomento: fluidi. */
CVIDEO.registra('fluidi/pressione', M => {
  const { W, C, E, P, life, kf, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [86.6, 190], [87.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [86.6, 1050], [87.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [86.6, 2.2], [87.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [86.6, 2], [87.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [86.6, -1.5], [87.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.8, 'sorpreso'], [20.2, 'felice'],
  [23.2, 'neutro'], [43.9, 'felice'], [48.4, 'neutro'], [60.8, 'sorpreso'], [65.0, 'neutro'], [69.2, 'felice'],
  [73.6, 'neutro'], [78.5, 'sorpreso'], [82.3, 'neutro'], [88.4, 'felice'], [92.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Un chiodo buca la pelle,\nmille chiodi no. Perché?'],
  [7.9, 12.2, 'Neve fresca: una persona\ncon gli scarponi e con gli sci.'],
  [12.3, 16.6, 'Preme con la stessa forza {my:F}:\nil suo peso, 600 N.'],
  [16.8, 19.9, 'Con gli scarponi {r:sprofonda}…'],
  [20.2, 23.0, '…con gli sci quasi niente.'],
  [23.2, 27.4, 'Cambia la {x:superficie} {mx:S}\nsu cui si appoggia la forza.'],
  [27.6, 31.6, 'La {v:pressione} è la forza\ndivisa per la superficie.'],
  [31.8, 35.4, 'La forza va presa {g:perpendicolare}\nalla superficie.'],
  [35.6, 39.4, 'Si misura in {v:pascal}:\n1 Pa = 1 N/m².'],
  [39.6, 43.7, 'Scarponi: 600 N su 0,05 m²\nfanno {v:12 000 Pa}.'],
  [43.9, 48.2, 'Sci: sei volte la superficie,\n{g:2000 Pa}, un sesto della pressione.'],
  [48.4, 52.4, 'La pressione non ha una direzione:\nè una grandezza {v:scalare}.'],
  [52.8, 56.4, 'Ora il letto di chiodi:\nsempre 600 N.'],
  [56.6, 60.6, 'Una punta sola è 1 mm²,\nun milionesimo di m².'],
  [60.8, 64.8, 'Su un chiodo solo:\n{r:600 000 000 Pa}. Buca!'],
  [65.0, 69.0, 'Su mille chiodi la superficie\nè mille volte più grande…'],
  [69.2, 73.4, '…e la pressione mille volte\npiù piccola: {g:600 000 Pa}.'],
  [73.6, 78.4, 'Il tacco a spillo: a ogni passo\ntutto il peso su 1 cm².'],
  [78.5, 82.2, '{r:6 000 000 Pa}: il parquet\nresta segnato.'],
  [82.3, 86.0, 'Il tacco largo, 50 cm²:\nsolo {g:120 000 Pa}.'],
  [88.4, 94.6, 'Più piccola è la superficie,\npiù grande è la {v:pressione}.'],
];

// ---------- aiutanti ----------
const CL = [110, 110, 820, 540], CR = [990, 110, 820, 540];   // le due schede a confronto
const G = 440;                     // il livello del suolo nelle schede
const LF = 130;                    // la freccia della forza F = 600 N: sempre lunga uguale
// freccia di una forza da a alla punta b
function freccia(ctx, a, b, col, w = 8, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = w / 5.5;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
// riga di una scheda: nome a sinistra, valore a destra
function riga(ctx, nome, val, sc, y, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, sc[0] + 70, y, { size: 42, align: 'left' });
  txt(ctx, val, sc[0] + sc[2] - 70, y, { size: 44, weight: 600, color: col, align: 'right' });
  ctx.restore();
}
function titoloScheda(ctx, s, sc, al) {
  conFont(TITOLI, () => drawRich(ctx, s, sc[0] + sc[2] / 2, 162, { size: 40, weight: 600, alpha: al }));
}
// sprofondamento nella neve: si assesta in fretta, tanto più quanto è grande la pressione
const K_NEVE = 60 / 12000;   // px per pascal: 12 000 Pa → 60 px, 2000 Pa → 10 px
const affonda = (t, t0, p) => t < t0 ? 0 : p * K_NEVE * (1 - Math.exp(-(t - t0) / .55));
// la neve, con il buco lasciato da ciò che ci preme sopra (da x0 a x1, profondo d)
function neve(ctx, sc, x0, x1, d) {
  const y1 = sc[1] + sc[3] - 140;
  ctx.save();
  ctx.fillStyle = css(mix(C.paper, C.x, .14));
  ctx.beginPath(); ctx.moveTo(sc[0] + 30, G); ctx.lineTo(x0, G); ctx.lineTo(x0, G + d); ctx.lineTo(x1, G + d); ctx.lineTo(x1, G);
  ctx.lineTo(sc[0] + sc[2] - 30, G); ctx.lineTo(sc[0] + sc[2] - 30, y1); ctx.lineTo(sc[0] + 30, y1); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(C.x, .55); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(sc[0] + 30, G); ctx.lineTo(x0, G); ctx.lineTo(x0, G + d); ctx.lineTo(x1, G + d); ctx.lineTo(x1, G); ctx.lineTo(sc[0] + sc[2] - 30, G); ctx.stroke();
  ctx.restore();
}
// una persona vista di fianco, alta 240 px; piedi = y delle suole
function persona(ctx, cx, piedi) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 13;
  ctx.beginPath(); ctx.moveTo(cx - 4, piedi - 112); ctx.lineTo(cx - 6, piedi - 16); ctx.moveTo(cx + 8, piedi - 112); ctx.lineTo(cx + 10, piedi - 16); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .25)); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - 24, piedi - 200, 50, 96, 18); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 11; ctx.strokeStyle = css(mix(C.dim, C.ink, .3));
  ctx.beginPath(); ctx.moveTo(cx + 2, piedi - 186); ctx.lineTo(cx + 18, piedi - 132); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .45)); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx + 2, piedi - 222, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.ink, .85);
  ctx.beginPath(); ctx.roundRect(cx - 20, piedi - 18, 64, 18, 5); ctx.fill();   // gli scarponi
  ctx.restore();
}

// 0 · titolo (0–7.5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Il letto di chiodi', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · scarponi e sci sulla neve (7.5–52.6)
const XS = CL[0] + CL[2] / 2 - 20, XK = CR[0] + CR[2] / 2 - 10;   // dove stanno le due persone
function sceneNeve(ctx, t) {
  if (t < 7.5 || t > 52.8) return;
  const al = 1 - P(t, 52.0, 52.6);
  const ka = P(t, 7.6, 8.3);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...CL, ka); card(ctx, ...CR, ka);
  titoloScheda(ctx, 'scarponi', CL, ka); titoloScheda(ctx, 'sci', CR, ka);
  const fa = P(t, 8.0, 8.8);
  // scarponi: 600 N su 0,05 m² = 12 000 Pa; sci: 600 N su 0,3 m² = 2000 Pa
  const dS = affonda(t, 16.9, 12000), dK = affonda(t, 20.3, 2000);
  ctx.save(); ctx.globalAlpha *= fa;
  neve(ctx, CL, XS - 20, XS + 44, dS);
  neve(ctx, CR, XK - 145, XK + 155, dK);
  persona(ctx, XS, G + dS);
  // lo sci: sotto lo scarpone, con la punta rialzata
  const pk = G + dK - 9;
  ctx.fillStyle = css(C.v, .85);
  ctx.beginPath(); ctx.moveTo(XK - 145, pk); ctx.lineTo(XK + 155, pk);
  ctx.quadraticCurveTo(XK + 181, pk - 2, XK + 189, pk - 24); ctx.lineTo(XK + 181, pk - 26);
  ctx.quadraticCurveTo(XK + 173, pk + 9, XK + 155, pk + 9); ctx.lineTo(XK - 145, pk + 9); ctx.closePath(); ctx.fill();
  persona(ctx, XK, pk);
  ctx.restore();
  // la superficie d'appoggio, in azzurro
  const ks = life(t, 23.4, 31.8, .5, .5);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = css(C.x); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(XS - 20, G + dS); ctx.lineTo(XS + 44, G + dS); ctx.moveTo(XK - 145, G + dK); ctx.lineTo(XK + 155, G + dK); ctx.stroke();
    ctx.restore();
  }
  // la forza F: stessa lunghezza nelle due schede
  const lf = LF * P(t, 12.6, 13.3, E.out);
  if (lf > 4) {
    // la punta sta sulla superficie d'appoggio
    // davanti alle gambe, sulla punta dello scarpone: non copre la persona
    freccia(ctx, [XS + 36, G + dS - LF], [XS + 36, G + dS - LF + lf], C.y);
    freccia(ctx, [XK + 36, G + dK - LF], [XK + 36, G + dK - LF + lf], C.y);
    drawRich(ctx, '{my:F}', XS + 72, G + dS - 80, { size: 44, alpha: P(t, 13.0, 13.5) });
    drawRich(ctx, '{my:F}', XK + 72, G + dK - 80, { size: 44, alpha: P(t, 13.0, 13.5) });
  }
  // l'angolo retto fra la forza e la superficie, disegnato nella neve sotto l'appoggio
  const kr = life(t, 32.0, 35.6, .4, .4);
  if (kr > 0) for (const [x, y] of [[XS + 36, G + dS], [XK + 36, G + dK]]) {
    ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.g); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x, y + 34); ctx.lineTo(x + 34, y + 34); ctx.lineTo(x + 34, y); ctx.stroke();
    ctx.beginPath(); ctx.setLineDash([9, 8]); ctx.moveTo(x, y); ctx.lineTo(x, y + 62); ctx.stroke();
    ctx.restore();
  }
  riga(ctx, '{mx:S} =', '0,05 m²', CL, 562, C.x, P(t, 24.2, 24.7));
  riga(ctx, '{mx:S} =', '0,3 m²', CR, 562, C.x, P(t, 24.6, 25.1));
  riga(ctx, '{mv:p} =', '12 000 Pa', CL, 614, C.v, P(t, 40.4, 40.9));
  riga(ctx, '{mv:p} =', '2000 Pa', CR, 614, C.g, P(t, 44.6, 45.1));
  ctx.restore();
}

// la formula, sotto le schede (27.8–86.6)
function sceneFormula(ctx, t) {
  const a = life(t, 27.8, 86.6, .6, .6);
  if (a <= 0) return;
  card(ctx, 560, 664, 800, 132, a);
  ctx.save(); ctx.globalAlpha *= a;
  drawSeq(ctx, ['{mv:p} {mink:=}', { num: '{my:F}', den: '{mx:S}' }], 760, 730, 44, { local: t - 28.1 });
  drawRich(ctx, '1 Pa = 1 N/m²', 1130, 714, { size: 40, local: t - 35.9 });
  drawRich(ctx, '{dim:grandezza scalare}', 1130, 766, { size: 30, local: t - 48.7 });
  ctx.restore();
}

// 2 · il letto di chiodi (52.6–73.6)
const PUNTE = 420;   // y delle punte dei chiodi
function letto(ctx, sc, xs) {
  ctx.save();
  ctx.fillStyle = css(mix(C.y, C.dim, .55)); ctx.beginPath(); ctx.roundRect(sc[0] + 60, PUNTE + 50, sc[2] - 120, 30, 6); ctx.fill();
  ctx.fillStyle = css(C.dim);
  for (const x of xs) { ctx.beginPath(); ctx.moveTo(x - 3.5, PUNTE + 50); ctx.lineTo(x + 3.5, PUNTE + 50); ctx.lineTo(x + 3.5, PUNTE + 14); ctx.lineTo(x, PUNTE); ctx.lineTo(x - 3.5, PUNTE + 14); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
// una persona sdraiata, appoggiata sulle punte
function sdraiata(ctx, xc) {
  ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = css(C.ink, .8);
  ctx.fillStyle = css(mix(C.dim, C.paper, .25));
  ctx.beginPath(); ctx.roundRect(xc - 230, PUNTE - 70, 470, 70, 35); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.dim, C.paper, .45));
  ctx.beginPath(); ctx.arc(xc - 272, PUNTE - 40, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const XC1 = CL[0] + CL[2] / 2 + 30, XC2 = CR[0] + CR[2] / 2 + 30;
const CHIODI = Array.from({ length: 31 }, (_, i) => CR[0] + 110 + i * 20);
function sceneChiodi(ctx, t) {
  if (t < 52.4 || t > 73.8) return;
  const ka = life(t, 52.6, 73.6, .6, .6);
  ctx.save(); ctx.globalAlpha *= ka;
  card(ctx, ...CL); card(ctx, ...CR);
  titoloScheda(ctx, 'un chiodo', CL, 1); titoloScheda(ctx, 'mille chiodi', CR, 1);
  letto(ctx, CL, [XC1]); letto(ctx, CR, CHIODI);
  sdraiata(ctx, XC1); sdraiata(ctx, XC2);
  // la punta che buca: tutta la forza su 1 mm²
  const kb = P(t, 61.0, 61.6);
  if (kb > 0) {
    const g = ctx.createRadialGradient(XC1, PUNTE, 2, XC1, PUNTE, 46);
    g.addColorStop(0, css(C.r, .75 * kb)); g.addColorStop(1, css(C.r, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(XC1, PUNTE, 46, 0, Math.PI * 2); ctx.fill();
  }
  // le punte che reggono: la superficie d'appoggio, in azzurro
  ctx.fillStyle = css(C.x);
  const k1 = P(t, 56.9, 57.4), k2 = P(t, 65.3, 65.8);
  if (k1 > 0) { ctx.beginPath(); ctx.arc(XC1, PUNTE, 6 * k1, 0, Math.PI * 2); ctx.fill(); }
  if (k2 > 0) for (const x of CHIODI) { ctx.beginPath(); ctx.arc(x, PUNTE, 6 * k2, 0, Math.PI * 2); ctx.fill(); }
  // la stessa forza F nelle due schede
  const lf = LF * P(t, 53.4, 54.1, E.out);
  if (lf > 4) {
    freccia(ctx, [XC1, PUNTE - LF], [XC1, PUNTE - LF + lf], C.y);
    freccia(ctx, [XC2, PUNTE - LF], [XC2, PUNTE - LF + lf], C.y);
    drawRich(ctx, '{my:F}', XC1 - 44, PUNTE - LF + 8, { size: 44, alpha: P(t, 53.8, 54.3) });
    drawRich(ctx, '{my:F}', XC2 - 44, PUNTE - LF + 8, { size: 44, alpha: P(t, 53.8, 54.3) });
  }
  riga(ctx, '{mx:S} =', '1 mm²', CL, 562, C.x, P(t, 57.0, 57.5));
  riga(ctx, '{mv:p} =', '600 000 000 Pa', CL, 614, C.r, P(t, 61.2, 61.7));
  riga(ctx, '{mx:S} =', '1000 mm²', CR, 562, C.x, P(t, 65.4, 65.9));
  riga(ctx, '{mv:p} =', '600 000 Pa', CR, 614, C.g, P(t, 69.6, 70.1));
  ctx.restore();
}

// 3 · i tacchi (73.6–86.6)
// una scarpa col tacco vista di fianco: xc = punta della scarpa + 160; largo = larghezza del tacco in basso
function scarpa(ctx, xc, largo) {
  ctx.save(); ctx.lineJoin = 'round';
  // la gamba
  ctx.fillStyle = css(mix(C.dim, C.paper, .4)); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(xc + 40, G - 205, 48, 75, 20); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.ink, C.paper, .2));
  ctx.beginPath(); ctx.moveTo(xc - 160, G); ctx.lineTo(xc - 40, G);
  ctx.quadraticCurveTo(xc + 30, G - 10, xc + 92, G - 95); ctx.lineTo(xc + 94, G - 150); ctx.lineTo(xc + 36, G - 150);
  ctx.quadraticCurveTo(xc - 10, G - 64, xc - 110, G - 44); ctx.quadraticCurveTo(xc - 162, G - 36, xc - 160, G); ctx.closePath(); ctx.fill();
  // il tacco
  const hx = xc + 92 - largo / 2 - 4;
  ctx.beginPath(); ctx.moveTo(xc + 40 + (largo > 20 ? 0 : 30), G - 95); ctx.lineTo(xc + 94, G - 95);
  ctx.lineTo(hx + largo / 2, G); ctx.lineTo(hx - largo / 2, G); ctx.closePath(); ctx.fill();
  ctx.restore();
  return hx;
}
function pavimento(ctx, sc, xb, buco) {
  ctx.save();
  const x0 = sc[0] + 30, x1 = sc[0] + sc[2] - 30, y1 = G + 60;
  ctx.fillStyle = css(mix(C.y, C.paper, .62));
  ctx.beginPath(); ctx.moveTo(x0, G); ctx.lineTo(xb - 12, G); ctx.lineTo(xb - 5, G + buco); ctx.lineTo(xb + 5, G + buco); ctx.lineTo(xb + 12, G); ctx.lineTo(x1, G); ctx.lineTo(x1, y1); ctx.lineTo(x0, y1); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(mix(C.y, C.ink, .45), .6); ctx.lineWidth = 2;
  for (let x = x0 + 120; x < x1; x += 160) { ctx.beginPath(); ctx.moveTo(x, G + 4); ctx.lineTo(x, y1); ctx.stroke(); }
  ctx.restore();
}
const XT1 = CL[0] + CL[2] / 2 - 10, XT2 = CR[0] + CR[2] / 2 - 10;
function sceneTacchi(ctx, t) {
  if (t < 73.4 || t > 86.8) return;
  const ka = life(t, 73.6, 86.6, .6, .6);
  ctx.save(); ctx.globalAlpha *= ka;
  card(ctx, ...CL); card(ctx, ...CR);
  titoloScheda(ctx, 'tacco a spillo', CL, 1); titoloScheda(ctx, 'tacco largo', CR, 1);
  const buco = 14 * P(t, 78.6, 79.4, E.out);
  const h1 = XT1 + 92 - 3 - 4, h2 = XT2 + 92 - 25 - 4;
  pavimento(ctx, CL, h1, buco); pavimento(ctx, CR, h2, 0);
  // a ogni passo il tacco si alza: resta il segno nel parquet (e la forza non c'è più)
  const su = 36 * P(t, 79.6, 80.4);
  ctx.save(); ctx.translate(0, -su); scarpa(ctx, XT1, 6); ctx.restore();
  scarpa(ctx, XT2, 50);
  const lf = LF * P(t, 74.4, 75.1, E.out);
  if (lf > 4) {
    freccia(ctx, [h1, G - LF], [h1, G - LF + lf], C.y, 8, 1 - P(t, 79.6, 80.0));
    freccia(ctx, [h2, G - LF], [h2, G - LF + lf], C.y);
    drawRich(ctx, '{my:F}', h1 + 48, G - 70, { size: 44, alpha: P(t, 74.8, 75.3) * (1 - P(t, 79.6, 80.0)) });
    drawRich(ctx, '{my:F}', h2 + 70, G - 70, { size: 44, alpha: P(t, 74.8, 75.3) });
  }
  riga(ctx, '{mx:S} =', '1 cm²', CL, 562, C.x, P(t, 75.6, 76.1));
  riga(ctx, '{mv:p} =', '6 000 000 Pa', CL, 614, C.r, P(t, 78.8, 79.3));
  riga(ctx, '{mx:S} =', '50 cm²', CR, 562, C.x, P(t, 82.6, 83.1));
  riga(ctx, '{mv:p} =', '120 000 Pa', CR, 614, C.g, P(t, 83.6, 84.1));
  ctx.restore();
}

// 4 · in una frase (86.8–97)
function sceneFine(ctx, t) {
  if (t < 86.8) return;
  const al = 1 - P(t, 95.4, 96.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.0 });
    drawRich(ctx, 'Stessa forza su meno superficie:\npiù {v:pressione}.', W / 2, 290, { size: 70, weight: 600, local: t - 87.4, stagger: .09 });
  });
  const pills = [[490, '{mv:p} {mink:=} {my:F} {mink:/} {mx:S}'], [960, 'si misura in {v:pascal}:\n1 Pa = 1 N/m²'], [1430, 'sci, chiodi, tacchi:\nconta la {x:superficie}']];
  pills.forEach(([x, s], i) => {
    const a = 89.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 44, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): nella neve il tono segue la quota dell'appoggio che sprofonda
  // (affonda(): si assesta in fretta, 60 px gli scarponi, 10 px gli sci); poi il tacco che si alza dal parquet
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .5], ['pop', 12.6, .6],                             // scarponi e sci; la stessa forza F
    ['tono', 16.9, 18.6, [.6, .385, .285, .239, .218]],                               // gli scarponi sprofondano
    ['tono', 20.3, 22.0, [.6, .564, .548, .54, .536]],                                // gli sci quasi niente
    ['traccia', 23.4, 23.9], ['pop', 24.2, .4], ['pop', 24.6, .55],                   // le superfici: 0,05 m² e 0,3 m²
    ['soffio', 27.8], ['pop', 28.1, .6],                                              // p = F/S
    ['traccia', 32.0, 32.4], ['pop', 35.9, .45],                                      // perpendicolare; 1 Pa = 1 N/m²
    ['pop', 40.4, .8], ['ding', 44.7], ['pop', 48.7, .4],                             // 12 000 Pa, 2000 Pa; scalare
    ['soffio', 52.6], ['pop', 53.4, .6],                                              // il letto di chiodi, F = 600 N
    ['pop', 56.9, .35], ['pop', 61.0, .95],                                           // una punta: 600 000 000 Pa
    ['pop', 65.3, .45], ['ding', 69.7],                                               // mille punte: 600 000 Pa
    ['soffio', 73.6], ['pop', 74.4, .6], ['pop', 75.6, .4],                           // i tacchi, F; 1 cm²
    ['pop', 78.6, .9], ['tono', 79.6, 80.4, [.3, .5]],                                // il segno nel parquet; il tacco si alza
    ['pop', 82.6, .45], ['ding', 83.7],                                               // 50 cm²: 120 000 Pa
    ['soffio', 87.0], ['pop', 89.0, .5], ['pop', 89.5, .6], ['pop', 90.0, .7],        // in una frase
  ];
  return {
    titolo: 'Il letto di chiodi', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 52.4, 'scarponi e sci'], [52.4, 73.4, 'il letto di chiodi'], [73.4, 86.2, 'i tacchi']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneNeve(ctx, t); sceneChiodi(ctx, t); sceneTacchi(ctx, t); sceneFormula(ctx, t); sceneFine(ctx, t); },
  };
});
