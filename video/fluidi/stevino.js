'use strict';
/* Più giù, più pressione — la legge di Stevino p = p₀ + d·g·h, la forma che non conta, i vasi comunicanti. Argomento: fluidi. */
CVIDEO.registra('fluidi/stevino', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, fmtN, dot, dashed, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [83.4, 190], [84.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [83.4, 1050], [84.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [83.4, 2.2], [84.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [83.4, 2], [84.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [83.4, -1.5], [84.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [30.3, 'sorpreso'], [35.1, 'neutro'],
  [38.8, 'felice'], [43.1, 'neutro'], [52.6, 'pensa'], [56.9, 'sorpreso'], [61.6, 'felice'], [66.2, 'neutro'],
  [74.2, 'felice'], [78.8, 'neutro'], [85.2, 'felice'], [89.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché in fondo alla piscina\nfanno male le orecchie?'],
  [7.9, 12.2, 'In superficie preme solo l’aria:\nla pressione {mv:p₀}, circa 1 atm.'],
  [12.4, 16.7, 'Un sensore di pressione scende:\nsopra, sempre più acqua che pesa.'],
  [16.9, 20.9, 'È la legge di {v:Stevino}:\n{mv:p} = {mv:p₀} + {mink:d·g·}{mx:h}.'],
  [21.0, 24.7, '{mx:h} è la profondità, misurata\ndalla superficie libera.'],
  [24.9, 29.3, '{mink:d} è la densità dell’acqua,\n1000 kg/m³; {mink:g} = 9,8 m/s².'],
  [29.5, 34.2, 'A 10 m: {mink:d·g·}{mx:h} ≈ 98 000 Pa,\n{g:circa un’atmosfera} in più.'],
  [35.1, 38.6, 'Il sensore scende ancora,\nfino a 20 m…'],
  [38.8, 41.6, '…circa {g:due atmosfere} in più.'],
  [43.1, 47.9, 'A 3 m, come in piscina:\n{g:29 400 Pa} in più sui timpani.'],
  [48.6, 52.4, 'Tre recipienti diversi,\nriempiti fino alla stessa altezza.'],
  [52.6, 56.7, 'Quello largo ha più acqua:\npreme di {r:più} sul fondo?'],
  [56.9, 61.4, '{r:No}: sul fondo la pressione\nè la {g:stessa} in tutti e tre.'],
  [61.6, 65.6, 'Conta solo la profondità {mx:h},\nnon la forma del recipiente.'],
  [66.2, 70.0, 'Vasi comunicanti: recipienti\ncollegati dal fondo.'],
  [70.3, 73.9, 'Apro il rubinetto: l’acqua passa…'],
  [74.2, 78.6, '…e si ferma allo {g:stesso livello}\nin tutti, qualunque forma abbiano.'],
  [78.8, 83.1, 'Sul fondo, alla stessa profondità,\nla pressione è la {g:stessa}.'],
  [85.2, 91.0, 'Sotto un liquido la pressione\ncresce con la {x:profondità}.'],
];

// ---------- aiutanti ----------
const RHO = 1000, GG = 9.8, P0 = 101325;
// migliaia separate da uno spazio (da 10 000 in su), come nel SI
const mig = n => { const s = String(Math.round(n)); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s; };
const acqua = (a = 1) => css(C.x, .2 * a);
function freccia(ctx, a, b, col, w = 6, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = w / 5.5;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
// quota: una linea verticale con le due punte e il nome accanto
function quota(ctx, x, y0, y1, nome, al, lato = -1) {
  if (al <= 0 || Math.abs(y1 - y0) < 8) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y0 + 4); ctx.lineTo(x, y1 - 4); ctx.stroke();
  arrowHead(ctx, [x, y0], -Math.PI / 2, C.x, .8); arrowHead(ctx, [x, y1], Math.PI / 2, C.x, .8);
  ctx.beginPath(); ctx.moveTo(x - 12, y0); ctx.lineTo(x + 12, y0); ctx.moveTo(x - 12, y1); ctx.lineTo(x + 12, y1); ctx.stroke();
  drawRich(ctx, nome, x + lato * 30, (y0 + y1) / 2, { size: 42 });
  ctx.restore();
}
function riga(ctx, nome, val, y, col, al, x0, x1, size = 42) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  numero(ctx, val, x1, y, size + 2, col);
  ctx.restore();
}
// numero che cambia senza ballare: cifre a larghezza fissa, spazi e virgole stretti, unità in coda
function numero(ctx, s, xr, y, size, col) {
  const i = s.search(/ [a-zA-Z]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.fillText(unita, xr, y);
  let x = xr - ctx.measureText(unita).width;
  ctx.textAlign = 'center';
  for (let k = cifre.length - 1; k >= 0; k--) {
    const ch = cifre[k], cw = ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
    x -= cw; ctx.fillText(ch, x + cw / 2, y);
  }
  ctx.restore();
}

// 0 · titolo (0–7.5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Più giù, più pressione', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · il manometro che scende (7.5–48.2)
const LAGO = [110, 110, 780, 680], TAB = [950, 110, 860, 680];
const WS = 230, PXM = 25;          // superficie libera e pixel per metro
const XM = 560;                    // dove scende il manometro
const prof = t => kf(t, [[12.8, 0], [16.4, 10], [35.4, 10], [38.4, 20], [41.8, 20], [43.0, 3]]);
function manometro(ctx, x, y, p) {
  ctx.save();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, LAGO[1] + 40); ctx.lineTo(x, y - 30); ctx.stroke();
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // la lancetta gira con la pressione: da p₀ in alto a sinistra, un giro di 270° ogni 300 000 Pa
  const a = -Math.PI * 1.25 + (p / 300000) * Math.PI * 1.5;
  ctx.strokeStyle = css(C.v); ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 22, y + Math.sin(a) * 22); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function sceneLago(ctx, t) {
  if (t < 7.5 || t > 48.6) return;
  const al = 1 - P(t, 47.8, 48.4), ka = P(t, 7.6, 8.3);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...LAGO, ka); card(ctx, ...TAB, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const x0 = LAGO[0] + 24, x1 = LAGO[0] + LAGO[2] - 24, yb = LAGO[1] + LAGO[3] - 24;
  // l'acqua: più scura in basso
  const gr = ctx.createLinearGradient(0, WS, 0, yb);
  gr.addColorStop(0, css(C.x, .12)); gr.addColorStop(1, css(C.x, .38));
  ctx.fillStyle = gr; ctx.fillRect(x0, WS, x1 - x0, yb - WS);
  ctx.strokeStyle = css(C.x, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, WS); ctx.lineTo(x1, WS); ctx.stroke();
  // il righello delle profondità
  for (let m = 0; m <= 20; m += 5) {
    const y = WS + m * PXM;
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 22, y); ctx.stroke();
    txt(ctx, m + ' m', x0 + 34, y + (m ? 0 : 26), { size: 30, color: C.dim, align: 'left' });
  }
  // l'aria che preme sulla superficie
  const kp = P(t, 8.4, 9.0);
  if (kp > 0) {
    for (let i = 0; i < 4; i++) freccia(ctx, [300 + i * 150, WS - 70], [300 + i * 150, WS - 6], C.y, 5, kp);
    txt(ctx, 'aria', 820, WS - 44, { size: 30, color: C.dim, align: 'right', alpha: kp });
  }
  ctx.restore();
  const h = prof(t), yM = WS + h * PXM;
  // la colonna d'acqua sopra il manometro
  const kc = life(t, 12.6, 47.8, .5, .4);
  if (kc > 0 && h > .05) { ctx.fillStyle = css(C.x, .3 * kc); ctx.fillRect(XM - 42, WS, 84, yM - 30 - WS); }
  const hq = Math.round(h * 10) / 10, rgh = RHO * GG * hq, p = P0 + rgh;
  manometro(ctx, XM, yM, p);
  txt(ctx, 'sensore', XM + 48, yM, { size: 30, color: C.dim, align: 'left', alpha: P(t, 12.5, 13.0) });
  quota(ctx, XM - 80, WS, yM, '{mx:h}', life(t, 21.2, 47.8, .4, .4), -1);
  // la tabella
  const xa = TAB[0] + 50, xb = TAB[0] + TAB[2] - 50;
  drawRich(ctx, '{mv:p} {mink:=} {mv:p₀} {mink:+ d·g·}{mx:h}', TAB[0] + TAB[2] / 2, 210, { size: 54, local: t - 17.1 });
  if (t < 17.1) conFont(TITOLI, () => drawRich(ctx, 'pressione', TAB[0] + TAB[2] / 2, 190, { size: 40, weight: 600, alpha: ka * (1 - P(t, 16.8, 17.1)) }));
  riga(ctx, '{mv:p₀} ≈', '101 325 Pa', 320, C.ink, P(t, 8.4, 8.9), xa, xb);
  riga(ctx, 'profondità', fmtN(hq, 1) + ' m', 390, C.x, P(t, 12.6, 13.1), xa, xb);
  riga(ctx, '{mink:d·g·}{mx:h} =', mig(rgh) + ' Pa', 460, C.g, P(t, 29.7, 30.2), xa, xb);
  ctx.save(); ctx.globalAlpha *= P(t, 12.6, 13.1); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xa, 505); ctx.lineTo(xb, 505); ctx.stroke(); ctx.restore();
  riga(ctx, 'pressione', mig(p) + ' Pa', 552, C.v, P(t, 12.6, 13.1), xa, xb, 46);
  riga(ctx, '', '≈ ' + fmtN(p / P0, 1) + ' atm', 616, C.v, P(t, 12.6, 13.1), xa, xb, 36);
  // i simboli si dicono quando compaiono
  drawRich(ctx, '{mink:d}{dim: densità}    {mink:g}{dim: = 9,8 m/s²}    {mx:h}{dim: profondità}', TAB[0] + TAB[2] / 2, 264, { size: 30, local: t - 17.6 });
  drawRich(ctx, '{mink:d} = 1000 kg/m³    {mink:g} = 9,8 m/s²', TAB[0] + TAB[2] / 2, 720, { size: 34, local: t - 25.1 });
  ctx.restore();
}

// recipiente a tronco di cono visto in sezione: fondo da a0 a b0 (y = yb), bocca da a1 a b1 (y = yt)
function recipiente(ctx, R, livello, kW = 1) {
  const { a0, b0, a1, b1, yb, yt } = R;
  const xa = y => lerp(a0, a1, (yb - y) / (yb - yt)), xb = y => lerp(b0, b1, (yb - y) / (yb - yt));
  if (livello < yb - 1 && kW > 0) {
    ctx.fillStyle = acqua(kW);
    ctx.beginPath(); ctx.moveTo(a0, yb); ctx.lineTo(xa(livello), livello); ctx.lineTo(xb(livello), livello); ctx.lineTo(b0, yb); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(C.x, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa(livello), livello); ctx.lineTo(xb(livello), livello); ctx.stroke();
  }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath();
  if (R.aperto) { ctx.moveTo(a1, yt); ctx.lineTo(a0, yb); ctx.moveTo(b0, yb); ctx.lineTo(b1, yt); }   // aperto sul fondo: comunica col tubo
  else { ctx.moveTo(a1, yt); ctx.lineTo(a0, yb); ctx.lineTo(b0, yb); ctx.lineTo(b1, yt); }
  ctx.stroke();
}

// 2 · la forma non conta (48.2–65.8)
const FB = 580, FH = 300;          // fondo e altezza dell'acqua: 300 px = 0,5 m
const FORME = [
  { a0: 300, b0: 600, a1: 300, b1: 600, yb: FB, yt: 200 },       // largo
  { a0: 900, b0: 960, a1: 900, b1: 960, yb: FB, yt: 200 },       // stretto
  { a0: 1340, b0: 1420, a1: 1200, b1: 1560, yb: FB, yt: 200 },   // a imbuto
];
function sceneForme(ctx, t) {
  if (t < 48.0 || t > 66.0) return;
  const ka = life(t, 48.2, 65.8, .6, .6);
  ctx.save(); ctx.globalAlpha *= ka;
  card(ctx, 110, 110, 1700, 680);
  const liv = FB - FH * P(t, 49.0, 52.0, E.lin);
  FORME.forEach(R => recipiente(ctx, R, liv));
  // stessa altezza per tutti
  const kq = life(t, 52.2, 65.8, .4, .4);
  if (kq > 0) { dashed(ctx, [220, liv], [1700, liv], C.x, 1, kq * .8); quota(ctx, 250, liv, FB, '{mx:h}', kq, -1); drawRich(ctx, '{mx:h} = 0,5 m', 170, FB + 160, { size: 38, align: 'left', alpha: kq }); }
  // l'idea sbagliata, in rosso, poi barrata
  const kr = life(t, 52.9, 61.6, .4, .5);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    drawRich(ctx, '{r:più acqua → più pressione?}', 450, 160, { size: 34 });
    const kx = P(t, 57.0, 57.6);
    const lw = richW(ctx, 'più acqua → più pressione?', 34) / 2;
    if (kx > 0) { ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(450 - lw, 160); ctx.lineTo(lerp(450 - lw, 450 + lw, kx), 160); ctx.stroke(); }
    ctx.restore();
  }
  // la pressione sul fondo, uguale nei tre
  const kp = P(t, 57.2, 57.8);
  if (kp > 0) FORME.forEach(R => {
    const xc = (R.a0 + R.b0) / 2;
    dot(ctx, [xc, FB - 14], C.v, kp, 11);
    drawRich(ctx, '{mv:p} = {g:' + mig(P0 + RHO * GG * .5) + ' Pa}', xc, FB + 60, { size: 38, alpha: kp });
  });
  ctx.restore();
}

// 3 · i vasi comunicanti (65.8–83.4)
const CB = 520, TOP = 170;
const VL = { a0: 260, b0: 440, a1: 260, b1: 440, yb: CB, yt: TOP, aperto: true };       // largo: 3 parti
const VS = { a0: 860, b0: 920, a1: 860, b1: 920, yb: CB, yt: TOP, aperto: true };       // stretto: 1 parte
const VI = { a0: 1300, b0: 1420, a1: 1500, b1: 1620, yb: CB, yt: TOP, aperto: true };   // inclinato: 2 parti in orizzontale
const H0 = 330, HF = H0 * 3 / (3 + 1 + 2), TAU_F = .8, T_APRE = 70.5;
// col rubinetto aperto l'acqua passa in proporzione al dislivello: i livelli si avvicinano in modo esponenziale,
// e il volume si conserva (3·hL + 3·hA resta 3·330)
function livelli(t) {
  const k = t < T_APRE ? 1 : Math.exp(-(t - T_APRE) / TAU_F);
  return [HF + (H0 - HF) * k, HF * (1 - k)];
}
function sceneVasi(ctx, t) {
  if (t < 65.6 || t > 83.6) return;
  const ka = life(t, 65.8, 83.4, .6, .6);
  ctx.save(); ctx.globalAlpha *= ka;
  card(ctx, 110, 110, 1700, 680);
  const [hL, hA] = livelli(t);
  // il tubo sul fondo, sempre pieno
  ctx.fillStyle = acqua(1); ctx.fillRect(260, CB, 1160, 40);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(260, CB); ctx.lineTo(260, CB + 40); ctx.lineTo(1420, CB + 40); ctx.lineTo(1420, CB); ctx.stroke();
  for (const [a, b] of [[440, 860], [920, 1300]]) { ctx.beginPath(); ctx.moveTo(a, CB); ctx.lineTo(b, CB); ctx.stroke(); }
  recipiente(ctx, VL, CB - hL); recipiente(ctx, VS, CB - hA); recipiente(ctx, VI, CB - hA);
  // il rubinetto: una manopola che gira
  const kv = P(t, 70.4, 70.8);
  ctx.save(); ctx.translate(650, CB + 20);
  ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.rotate(Math.PI / 2 * (1 - kv)); ctx.fillStyle = css(kv < 1 ? C.r : C.g);
  ctx.fillRect(-20, -6, 40, 12);
  ctx.restore();
  // stesso livello, e sul fondo la stessa pressione
  const kq = life(t, 74.4, 83.4, .4, .4);
  if (kq > 0) {
    const y = CB - hA;
    dashed(ctx, [200, y], [1700, y], C.x, 1, kq * .8);
    quota(ctx, 215, y, CB, '{mx:h}', kq, -1);
  }
  const kp = P(t, 79.0, 79.6);
  if (kp > 0) for (const x of [350, 890, 1360]) dot(ctx, [x, CB + 20], C.v, kp, 11);
  if (kp > 0) for (const x of [350, 890, 1360]) drawRich(ctx, '{mv:p}', x, CB + 80, { size: 40, alpha: kp });
  ctx.restore();
}

// 4 · in una frase (83.6–93.5)
function sceneFine(ctx, t) {
  if (t < 83.6) return;
  const al = 1 - P(t, 91.9, 92.7);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 83.8 });
    drawRich(ctx, 'Più giù si va, più pressione:\nconta solo la {x:profondità}.', W / 2, 290, { size: 70, weight: 600, local: t - 84.2, stagger: .09 });
  });
  const pills = [[490, '{mv:p} {mink:=} {mv:p₀} {mink:+ d·g·}{mx:h}'], [960, '10 m d’acqua:\n{g:circa 1 atm} in più'], [1430, 'vasi comunicanti:\n{g:stesso livello}']];
  pills.forEach(([x, s], i) => {
    const a = 85.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 38, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): mentre il sensore scende il tono segue la pressione che cresce con la
  // profondità (prof(), da 0 m .2 a 20 m .8); poi il livello dell'acqua nei recipienti e nei vasi comunicanti (livelli())
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.4, .6],                                                // il lago, l'aria che preme: p₀
    ['pop', 12.5, .5], ['tono', 12.8, 16.4, [.2, .219, .35, .481, .5]],               // il sensore scende a 10 m
    ['pop', 17.1, .6], ['pop', 17.6, .35],                                            // p = p₀ + d·g·h
    ['traccia', 21.2, 21.6], ['pop', 25.1, .4],                                       // la profondità h; d e g
    ['ding', 30.0],                                                                   // ≈ 98 000 Pa: circa un'atmosfera
    ['tono', 35.4, 38.4, [.5, .519, .65, .781, .8]], ['ding', 38.5],                  // fino a 20 m: due atmosfere
    ['tono', 41.8, 43.0, [.8, .768, .545, .322, .29]], ['pop', 43.1, .5],             // risale a 3 m: 29 400 Pa
    ['soffio', 48.2], ['tono', 49.0, 52.0, [.2, .6]],                                 // tre recipienti, si riempiono
    ['traccia', 52.2, 52.6], ['pop', 52.9, .3],                                       // stessa altezza; più acqua, più pressione?
    ['traccia', 57.0, 57.6], ['pop', 57.2, .5], ['ding', 57.8],                       // no: sul fondo la stessa pressione
    ['soffio', 65.8], ['pop', 70.4, .5],                                              // i vasi comunicanti, il rubinetto
    ['tono', 70.5, 73.0, [.8, .637, .563, .529, .513]],                               // il largo scende…
    ['tono', 70.5, 73.0, [.2, .363, .437, .471, .487]],                               // …gli altri salgono
    ['traccia', 74.4, 74.8], ['ding', 74.6], ['pop', 79.0, .5],                       // stesso livello; stessa pressione sul fondo
    ['soffio', 83.8], ['pop', 85.8, .5], ['pop', 86.3, .6], ['pop', 86.8, .7],        // in una frase
  ];
  return {
    titolo: 'Più giù, più pressione', durata: 93.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 48.2, 'più giù, più pressione'], [48.2, 65.8, 'la forma non conta'], [65.8, 83.2, 'vasi comunicanti']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneLago(ctx, t); sceneForme(ctx, t); sceneVasi(ctx, t); sceneFine(ctx, t); },
  };
});
