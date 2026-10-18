'use strict';
/* Due lampi, due verità — il treno di Einstein. Da terra: il treno (640 px sullo schermo) corre a v = 0,6·c (c = 80 px/s,
   v = 48 px/s, al rallentatore); quando Bruno (a metà del treno) passa davanti ad Anna (a terra), due fulmini colpiscono
   la coda A e la testa B. Le luci partono a c dai due punti: Anna, a metà, le riceve insieme a τ = 320/80 = 4 s; Bruno,
   che corre incontro a B, riceve B a τ = 320/(80 + 48) = 2,5 s e A a τ = 320/(80 − 48) = 10 s. Dal treno: la luce va a c
   anche per Bruno, il treno è lungo L₀ = γ·640 = 800 px, e i due fulmini non sono simultanei: B cade a t′ = −v·L₀/(2c²) =
   −3 s e A a +3 s (trasformazioni di Lorentz); B arriva a Bruno a t′ = 2, A a t′ = 8, Anna (che va incontro ad A) riceve
   tutti e due a t′ = 5. Tutti i numeri ricontrollati con node. Il tempo si ferma (fermo immagine) a ogni arrivo e, dal
   treno, a ogni fulmine, perché il fumetto parli di quello che si vede: τ è arrotondato al millesimo, così nel fermo vale
   esattamente l'istante dell'evento, e ciò che compare all'evento sale nei 0,2 s PRIMA (P(τ, x − 0,2, x)), non dopo.
   Nessuno dei due sbaglia. Colori: A C.x, B C.y, velocità C.x, risultati C.g, la
   cosa nuova (simultaneità) C.v. Argomento: relativita. */
CVIDEO.registra('relativita/simultaneita', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fixedNum, fmtN, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 97.6;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [13.1, 'sorpreso'], [17.8, 'neutro'],
  [23.0, 'felice'], [27.2, 'neutro'], [33.7, 'felice'], [39.5, 'neutro'], [45.5, 'sorpreso'], [50.1, 'pensa'],
  [54.2, 'neutro'], [59.9, 'sorpreso'], [65.2, 'neutro'], [70.3, 'pensa'], [76.0, 'neutro'], [80.8, 'felice'],
  [88.4, 'neutro'], [93.0, 'festa'], [100.0, 'felice'], [103.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Due lampi, un treno in corsa:\nsono scoppiati insieme?'],
  [7.9, 13.0, 'Un treno lungo corre a {mx:v} = 0,6·{mink:c}.\nBruno sta nel mezzo del treno.'],
  [13.1, 17.7, 'Anna è a terra. Quando Bruno le passa\ndavanti, due fulmini colpiscono…'],
  [17.8, 22.9, '…la coda {mx:A} e la testa {my:B} del treno,\ne segnano i binari.'],
  [23.0, 27.1, 'La luce dei lampi parte a {mink:c}.\nAl rallentatore: guardiamola.'],
  [27.2, 32.0, 'Bruno corre incontro al lampo {my:B}:\nla sua luce lo raggiunge {g:per prima}.'],
  [33.7, 39.3, 'Anna riceve {mx:A} e {my:B} nello stesso istante:\nper lei sono scoppiati {g:insieme}.'],
  [39.5, 45.3, 'Bruno invece si allontana dal lampo {mx:A}:\nla sua luce deve rincorrerlo…'],
  [45.5, 50.0, '…e lo raggiunge solo ora. Per Bruno:\nprima {my:B}, poi {mx:A}.'],
  [50.1, 54.0, 'Anna dice «insieme», Bruno «prima {my:B}».\nChi ha ragione?'],
  [54.2, 59.7, 'Ora guardo dal treno: Bruno è fermo\ne la luce va a {mink:c} anche per lui.'],
  [59.9, 64.7, 'Per Bruno {my:B} cade per primo,\nprima che Anna gli passi davanti.'],
  [65.2, 70.2, 'Sta a metà: la luce di {my:B}\ngli arriva {g:per prima}.'],
  [70.3, 74.8, 'Per Bruno il fulmine {mx:A} non è ancora\ncaduto: cadrà {g:dopo}.'],
  [76.0, 78.6, 'Ecco {mx:A}, dopo {my:B}.'],
  [80.8, 85.4, 'Anna, che corre incontro ad {mx:A},\nriceve i due lampi {g:insieme}.'],
  [88.4, 92.9, 'Solo ora {mx:A} raggiunge Bruno.\nTutto torna: nessuno dei due sbaglia.'],
  [93.0, 97.4, '«Insieme» per Anna, «prima {my:B}» per Bruno:\nla {v:simultaneità} è relativa.'],
  [100.0, 105.0, 'Simultanei per Anna, non per Bruno:\ndipende dal sistema di riferimento.'],
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
function binario(ctx, x0, x1, y, off, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y + 12); ctx.lineTo(x1, y + 12); ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = css(mix(C.ink, C.paper, .6));
  const o = ((off % 60) + 60) % 60;
  for (let x = x0 - 60 + o; x < x1 + 60; x += 60) { if (x < x0 || x > x1) continue; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 16); ctx.stroke(); }
  ctx.restore();
}
// un treno lungo L con la coda in x; dentro, a metà, Bruno
function treno(ctx, x, y, L, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(CORPO()); ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x, y - 126, L, 110, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(mix(C.x, C.paper, .55)); ctx.beginPath(); ctx.roundRect(x + 12, y - 136, L - 24, 16, 7); ctx.fill();
  ctx.fillStyle = C.paper;
  for (let wx = x + 24; wx + 48 < x + L - 20; wx += 66) { if (Math.abs(wx + 24 - x - L / 2) < 60) continue; ctx.beginPath(); ctx.roundRect(wx, y - 108, 48, 38, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = css(C.ink);
  for (const wx of [x + 36, x + 80, x + L / 2 - 22, x + L / 2 + 22, x + L - 80, x + L - 36]) { ctx.beginPath(); ctx.arc(wx, y - 10, 15, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// una figurina: testa, corpo; col = il colore del corpo
function figura(ctx, x, y, col, al, sc) {
  if (al <= 0) return;
  if (sc == null) sc = 1;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.roundRect(-16, -46, 32, 50, 10); ctx.fill();
  ctx.fillStyle = css(mix(C.y, C.paper, .62)); ctx.strokeStyle = css(BORDO()); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(0, -62, 15, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// il fulmine: una spezzata dal cielo al punto p
function fulmine(ctx, p, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(C.y); ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.shadowColor = css(C.y, .8); ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(p[0] + 30, p[1] - 400); ctx.lineTo(p[0] - 10, p[1] - 260); ctx.lineTo(p[0] + 22, p[1] - 240); ctx.lineTo(p[0] - 14, p[1] - 120); ctx.lineTo(p[0] + 12, p[1] - 110); ctx.lineTo(p[0], p[1]); ctx.stroke();
  ctx.restore();
}
// il fronte della luce: un cerchio che cresce dal punto p (tagliato dalla scheda)
function fronte(ctx, p, r, col, al) {
  if (al <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 5; ctx.shadowColor = css(col, .6); ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.stroke(); ctx.restore();
}
// il tempo con i fermi immagine: fra a e b il tempo della scena non avanza
function congelato(t, fermi) {
  let s = t;
  for (let i = 0; i < fermi.length; i++) s -= clamp(t - fermi[i][0], 0, fermi[i][1] - fermi[i][0]);
  return s;
}
const inFermo = (t, fermi) => fermi.some(f => t > f[0] + .05 && t < f[1] - .05);

const SC = [110, 110, 1700, 540], PAN = [110, 680, 1700, 110];
const Y_ROT = 540, CPX = 80, VPX = 48, L_TERRA = 640, L0 = 800, XM = 960;
// ---------- 1 · visto da terra (7,5–54,2) ----------
const T_L = 15.6;                                                          // i fulmini
const FERMI1 = [[15.6, 23.2], [25.7, 32.1], [33.6, 39.4], [45.4, 1e9]];     // fermi immagine: i fulmini, B a Bruno, Anna, A a Bruno
const arrot = x => Math.round(x * 1000) / 1000;                            // nel fermo τ vale esattamente l'istante dell'evento
const tauTerra = t => arrot(congelato(t, FERMI1) - T_L);                   // tempo della scena (s), 0 ai fulmini
function scenaTerra(ctx, t) {
  if (t < 7.5 || t > 54.6) return;
  const al = P(t, 7.6, 8.2) * (1 - P(t, 54.1, 54.5));
  const tau = tauTerra(t);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, SC[0], SC[1], SC[2], SC[3]);
  const xA = XM - L_TERRA / 2 + VPX * tau, xB = xA + L_TERRA, xBruno = xA + L_TERRA / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(SC[0] + 4, SC[1] + 4, SC[2] - 8, SC[3] - 8); ctx.clip();
  binario(ctx, SC[0], SC[0] + SC[2], Y_ROT, 0, 1);
  // i segni sui binari, dove sono caduti i fulmini
  const kSegni = tau >= 0 ? P(t, T_L + .2, T_L + .8) : 0;
  for (const [x, col, nome] of [[XM - L_TERRA / 2, C.x, '{mx:A}'], [XM + L_TERRA / 2, C.y, '{my:B}']]) {
    ctx.save(); ctx.globalAlpha *= kSegni; ctx.strokeStyle = css(col); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, Y_ROT + 22); ctx.lineTo(x, Y_ROT + 46); ctx.stroke(); ctx.restore();
    drawRich(ctx, nome, x, Y_ROT + 76, { size: 36, alpha: kSegni });
  }
  // i fronti di luce (dietro al treno), poi il treno con Bruno, Anna a terra, poi i fulmini
  if (tau >= 0) {
    fronte(ctx, [XM - L_TERRA / 2, Y_ROT], CPX * tau, C.x, 1);
    fronte(ctx, [XM + L_TERRA / 2, Y_ROT], CPX * tau, C.y, 1);
  }
  treno(ctx, xA, Y_ROT, L_TERRA, 1);
  if (tau >= 0) { const kF = 1 - P(tau, .15, .5); fulmine(ctx, [XM - L_TERRA / 2, Y_ROT - 126], kF); fulmine(ctx, [XM + L_TERRA / 2, Y_ROT - 126], kF); }
  figura(ctx, xBruno, Y_ROT - 30, C.v, 1, .9);
  scritta(ctx, 'Bruno', xBruno, Y_ROT - 168, 30, P(t, 10.2, 10.7));
  figura(ctx, XM, Y_ROT + 120, C.g, P(t, 13.2, 13.6), 1);
  scritta(ctx, 'Anna', XM + 70, Y_ROT + 90, 30, P(t, 13.3, 13.8), 'left');
  const kv = P(t, 8.6, 9.2);
  freccia(ctx, [xB - 160, Y_ROT - 180], [xB - 40, Y_ROT - 180], C.x, kv, 7);
  scritta(ctx, '{mx:v} = 0,6·{mink:c}', xB - 100, Y_ROT - 222, 32, kv);
  // gli arrivi: un cerchietto che resta acceso attorno a chi ha ricevuto la luce
  if (tau >= 0) {
    const aB = P(tau, 2.3, 2.5), aAnna = P(tau, 3.8, 4), aA = P(tau, 9.8, 10);
    ctx.save(); ctx.lineWidth = 5;
    ctx.strokeStyle = css(C.y); ctx.globalAlpha *= aB; ctx.beginPath(); ctx.arc(xBruno, Y_ROT - 70, 44, 0, TAU); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = css(C.x); ctx.globalAlpha *= aA; ctx.beginPath(); ctx.arc(xBruno, Y_ROT - 70, 56, 0, TAU); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = css(C.g); ctx.globalAlpha *= aAnna; ctx.beginPath(); ctx.arc(XM, Y_ROT + 80, 50, 0, TAU); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  scritta(ctx, '{dim:visto da terra · al rallentatore}', SC[0] + 30, 150, 30, 1, 'left');
  // fermo immagine
  const kFermo = inFermo(t, FERMI1) ? 1 : 0;
  fondo(ctx, 1640, 150, 290, 50, kFermo);
  ctx.save(); ctx.globalAlpha *= kFermo; ctx.fillStyle = css(C.ink); ctx.fillRect(1512, 136, 9, 28); ctx.fillRect(1527, 136, 9, 28); ctx.restore();
  txt(ctx, 'fermo immagine', 1550, 151, { size: 30, color: C.ink, align: 'left', alpha: kFermo });
  // il pannello: l'orologio della scena e chi ha ricevuto che cosa
  const kP = P(t, 23.0, 23.5);
  card(ctx, PAN[0], PAN[1], PAN[2], PAN[3], kP);
  ctx.save(); ctx.globalAlpha *= kP;
  drawRich(ctx, '{dim:dai fulmini:}', 260, 735, { size: 32, align: 'left' });
  fixedNum(ctx, fmtN(Math.max(0, tau), 1) + ' s', 660, 735, 44, C.ink);
  drawRich(ctx, '{dim:Anna:} {mx:A} {dim:e} {my:B} {g:insieme} {dim:a} 4 s', 1000, 735, { size: 34, alpha: P(tau, 3.8, 4) });
  const sBruno = '{dim:Bruno:} {my:B} {dim:a} 2,5 s', xBr = 1290;
  drawRich(ctx, sBruno, xBr, 735, { size: 34, align: 'left', alpha: P(tau, 2.3, 2.5) });
  drawRich(ctx, '{dim:,} {mx:A} {dim:a} 10 s', xBr + richW(ctx, sBruno, 34) - 1, 735, { size: 34, align: 'left', alpha: P(tau, 9.8, 10) });
  ctx.restore();
  ctx.restore();
}

// ---------- 2 · visto dal treno (54,3–97,6) ----------
const T2 = 62.8;                                                           // t′ = 0 quando Anna passa davanti a Bruno
// fermi immagine: cade B (t′ = −3), B a Bruno (2), cade A (3), Anna riceve i due lampi (5), A a Bruno (8)
const FERMI2 = [[59.8, 64.8], [69.8, 74.9], [75.9, 78.7], [80.7, 85.3], [88.3, 1e9]];
const tauTreno = t => arrot(congelato(t, FERMI2) - T2);
const TB = -3, TA = 3;                                                     // quando cadono i fulmini, nel tempo del treno
function scenaTreno(ctx, t) {
  if (t < 54.3 || t > T_FINE + .3) return;
  const al = P(t, 54.4, 55.0) * (1 - P(t, T_FINE - .4, T_FINE + .1));
  const tau = tauTreno(t);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, SC[0], SC[1], SC[2], SC[3]);
  const xA = XM - L0 / 2, xB = XM + L0 / 2, xAnna = XM - VPX * tau;
  ctx.save(); ctx.beginPath(); ctx.rect(SC[0] + 4, SC[1] + 4, SC[2] - 8, SC[3] - 8); ctx.clip();
  binario(ctx, SC[0], SC[0] + SC[2], Y_ROT, -VPX * tau, 1);
  // i segni sui binari viaggiano con la terra (restano dove i fulmini hanno colpito la rotaia)
  for (const [x0, tf, col, nome] of [[xA, TA, C.x, '{mx:A}'], [xB, TB, C.y, '{my:B}']]) {
    if (tau < tf) continue;
    const x = x0 - VPX * (tau - tf);
    ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, Y_ROT + 22); ctx.lineTo(x, Y_ROT + 46); ctx.stroke(); ctx.restore();
    drawRich(ctx, nome, x, Y_ROT + 76, { size: 36 });
  }
  for (const [x0, tf, col] of [[xB, TB, C.y], [xA, TA, C.x]]) { const d = tau - tf; if (d >= 0) fronte(ctx, [x0, Y_ROT], CPX * d, col, 1); }
  treno(ctx, xA, Y_ROT, L0, 1);
  figura(ctx, XM, Y_ROT - 30, C.v, 1, .9);
  scritta(ctx, 'Bruno', XM, Y_ROT - 168, 30, 1);
  figura(ctx, xAnna, Y_ROT + 120, C.g, 1, 1);
  scritta(ctx, 'Anna', xAnna + 70, Y_ROT + 90, 30, 1, 'left');
  // i fulmini, uno alla volta
  for (const [x0, tf] of [[xB, TB], [xA, TA]]) { const d = tau - tf; if (d >= 0) fulmine(ctx, [x0, Y_ROT - 126], 1 - P(d, .15, .5)); }
  const aB = P(tau, 1.8, 2), aAnna = P(tau, 4.8, 5), aA = P(tau, 7.8, 8);
  ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = css(C.y); ctx.globalAlpha *= aB; ctx.beginPath(); ctx.arc(XM, Y_ROT - 70, 44, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = css(C.x); ctx.globalAlpha *= aA; ctx.beginPath(); ctx.arc(XM, Y_ROT - 70, 56, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = css(C.g); ctx.globalAlpha *= aAnna; ctx.beginPath(); ctx.arc(xAnna, Y_ROT + 80, 50, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.restore();
  // la terra (e Anna) corre all'indietro: freccia fissa in alto a destra, fuori dal ritaglio
  const kv = P(t, 55.2, 55.8);
  freccia(ctx, [1560, 360], [1440, 360], C.x, kv, 7);
  scritta(ctx, '{dim:la terra:} {mx:v} = 0,6·{mink:c}', 1500, 318, 30, kv);
  scritta(ctx, '{dim:visto dal treno · al rallentatore}', SC[0] + 30, 150, 30, 1, 'left');
  const kFermo = inFermo(t, FERMI2) ? 1 : 0;
  fondo(ctx, 1640, 150, 290, 50, kFermo);
  ctx.save(); ctx.globalAlpha *= kFermo; ctx.fillStyle = css(C.ink); ctx.fillRect(1512, 136, 9, 28); ctx.fillRect(1527, 136, 9, 28); ctx.restore();
  txt(ctx, 'fermo immagine', 1550, 151, { size: 30, color: C.ink, align: 'left', alpha: kFermo });
  // il pannello
  card(ctx, PAN[0], PAN[1], PAN[2], PAN[3]);
  drawRich(ctx, '{dim:orologio del treno:}', 150, 735, { size: 32, align: 'left' });
  fixedNum(ctx, fmtN(tau, 1) + ' s', 640, 735, 44, C.ink);
  const sFB = '{dim:fulmine} {my:B} {dim:a} −3 s';
  drawRich(ctx, sFB, 760, 735, { size: 34, align: 'left', alpha: P(tau, TB - .2, TB) });
  drawRich(ctx, '{dim:,} {mx:A} {dim:a} +3 s', 760 + richW(ctx, sFB, 34) - 1, 735, { size: 34, align: 'left', alpha: P(tau, TA - .2, TA) });
  drawRich(ctx, '{dim:prima} {my:B}{dim:, poi} {mx:A}{dim::} {g:non insieme}', 1500, 735, { size: 34, alpha: P(tau, TA - .2, TA) });
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Due lampi, due verità', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 106.5, 107.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Due eventi simultanei per uno non lo sono\nper chi si muove: nessuno dei due sbaglia.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[450, 'la luce parte a {mink:c}\n{dim:per tutti e due}'], [960, 'Anna: {mx:A} e {my:B} {g:insieme}\nBruno: prima {my:B}, poi {mx:A}'], [1470, 'la {v:simultaneità}\nè relativa']];
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

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.6, .5], ['pop', 10.2, .55], ['pop', 13.2, .45],        // il treno, Bruno, Anna
    ['pop', 15.6, .9],                                                                // i due fulmini, fermo immagine
    ['pop', 23.0, .4], ['tono', 23.2, 25.7, [.05, .25]], ['pop', 25.7, .7],           // la luce parte: B arriva a Bruno
    ['tono', 32.1, 33.6, [.25, .4]], ['ding', 33.7],                                  // Anna li riceve insieme
    ['tono', 39.4, 45.4, [.4, 1]], ['pop', 45.4, .3],                                 // A rincorre Bruno e lo raggiunge
    ['soffio', 54.4], ['pop', 55.2, .5],                                              // visto dal treno: la terra corre indietro
    ['pop', 59.8, .7],                                                                // cade B
    ['tono', 64.8, 69.8, [.05, .5]], ['pop', 69.8, .7],                               // la luce di B arriva a Bruno
    ['pop', 75.9, .3],                                                                // cade A, dopo
    ['tono', 78.7, 80.7, [0, .2]], ['ding', 80.8],                                    // Anna riceve i due lampi insieme
    ['tono', 85.3, 88.3, [.2, .5]], ['pop', 88.3, .3],                                // A raggiunge Bruno
    ['soffio', 97.6], ['pop', 99.8, .5], ['pop', 100.3, .6], ['pop', 100.8, .7],      // in una frase
  ];
  return {
    titolo: 'Due lampi, due verità', durata: 108, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 54.2, 'visto da terra'], [54.2, T_FINE, 'visto dal treno']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaTerra(ctx, t); scenaTreno(ctx, t); scenaFine(ctx, t); },
  };
});
