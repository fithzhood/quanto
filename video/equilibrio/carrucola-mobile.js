'use strict';
/* Metà forza, doppia corda — cassa di 10 kg (P = 98 N), fune e carrucole ideali, sollevata piano a velocità costante:
   con la carrucola fissa la mano tira 98 N e 1 m di fune per 1 m di salita; con la carrucola mobile la cassa è retta da
   due tratti, 2·T = 98 N → T = 49 N, ma i due tratti si accorciano di 1 m ciascuno: 2 m di fune; cenno al paranco a 4
   tratti: 24,5 N, 2 m di fune per 50 cm. Argomento: equilibrio. */
CVIDEO.registra('equilibrio/carrucola-mobile', M => {
  const { W, C, E, P, life, clamp, css, mix, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [92.6, 190], [93.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [92.6, 1050], [93.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [92.6, 2.2], [93.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [92.6, 2], [93.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [92.6, -1.5], [93.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [30.4, 'pensa'], [35.0, 'neutro'],
  [44.4, 'felice'], [48.9, 'neutro'], [54.1, 'festa'], [57.7, 'pensa'], [62.0, 'sorpreso'], [65.7, 'neutro'],
  [70.7, 'felice'], [74.4, 'neutro'], [79.3, 'felice'], [83.1, 'neutro'], [88.7, 'occhiolino'],
  [94.4, 'felice'], [99.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Come si solleva una cassa\ncon metà della forza?'],
  [7.9, 12.4, 'Una cassa di 10 kg: pesa\n{my:P} = {mink:m·g} = 98 N.'],
  [12.5, 16.6, 'Fune e carrucole {g:ideali}:\nsenza massa e senza attrito.'],
  [16.7, 21.2, 'Una carrucola {v:fissa}: la fune\npassa sopra e scende alla mano.'],
  [21.3, 25.6, 'Per reggerla, la mano tira\ncon {y:98 N}: tutto il peso.'],
  [25.7, 30.3, 'Tiro piano: la cassa sale 1 m,\nla mano scende 1 m.'],
  [30.4, 34.6, 'La carrucola fissa cambia solo\nil {v:verso} della forza.'],
  [35.0, 39.6, 'Ora la cassa è appesa a una\ncarrucola {v:mobile}: sale con lei.'],
  [39.7, 44.3, 'La fune le passa sotto e finisce\nlegata in alto, al soffitto.'],
  [44.4, 48.8, 'La carrucola mobile è retta\nda {g:due tratti} di fune.'],
  [48.9, 54.0, 'Ogni tratto tira con {my:T}: {mink:2·}{my:T} = 98 N,\nquindi {my:T} = {g:49 N}.'],
  [54.1, 57.6, 'La mano tira 49 N:\n{g:metà} della forza!'],
  [57.7, 61.9, 'Ma c’è un prezzo: alzo\nla cassa di 1 m…'],
  [62.0, 65.6, '…e la mano tira {v:2 m} di fune!'],
  [65.7, 70.6, 'Ognuno dei due tratti si accorcia\ndi 1 m: in tutto 2 m.'],
  [70.7, 74.0, 'Metà forza, {v:doppia} corda.'],
  [74.4, 79.2, 'Con più carrucole, un {v:paranco}:\nqui la cassa è retta da 4 tratti.'],
  [79.3, 83.0, 'Basta un quarto della forza:\n24,5 N.'],
  [83.1, 88.6, 'Ma per alzarla di 50 cm,\nla mano tira 2 m di fune.'],
  [88.7, 92.4, 'Un quarto della forza,\n{v:quattro volte} la corda.'],
  [94.4, 99.4, 'Più tratti reggono la cassa:\nmeno forza, ma più corda da tirare.'],
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
const G = 9.8, MASSA = 10, PESO = MASSA * G;          // 98 N
const PXM = 120, FS = 1.2;                             // 120 px per metro, 1,2 px per newton
const lin = (t, a, b) => clamp((t - a) / (b - a));     // salita a velocità costante (equilibrio): niente easing
// quanto è salita la cassa (metri) in ogni scena
const salitaFissa = t => 1 * lin(t, 26.0, 29.0);       // 1 m in 3 s
const salitaMobile = t => 1 * lin(t, 58.0, 61.0);      // 1 m in 3 s, la mano 2 m
const salitaParanco = t => .5 * lin(t, 83.4, 86.4);    // 50 cm in 3 s, la mano 2 m
const YB = 136;                                        // il soffitto (trave)

function trave(ctx, x0, x1) {
  ctx.fillStyle = css(C.dim); ctx.fillRect(x0, YB - 12, x1 - x0, 14);
  ctx.strokeStyle = css(C.dim, .7); ctx.lineWidth = 2;
  for (let x = x0 + 10; x < x1; x += 22) { ctx.beginPath(); ctx.moveTo(x, YB - 12); ctx.lineTo(x + 12, YB - 24); ctx.stroke(); }
}
function ruota(ctx, cx, cy, r, staffa) {
  if (staffa) { ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, YB); ctx.lineTo(cx, cy); ctx.stroke(); }
  ctx.fillStyle = css(mix(C.dim, C.paper, .7)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r - 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
}
function cassa(ctx, cx, ytop, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(mix(C.dim, C.paper, .78)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - 55, ytop, 110, 80, 8); ctx.fill(); ctx.stroke();
  txt(ctx, '10 kg', cx, ytop + 41, { size: 30, weight: 600 });
  ctx.restore();
}
// la mano che tiene la fune: y è il punto dove la fune entra nel pugno
function mano(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = css(mix(C.y, C.paper, .62)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - 24, y, 48, 54, 14); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 24, y + i * 13.5); ctx.lineTo(x + 6, y + i * 13.5); ctx.stroke(); }
  ctx.restore();
}
// misura verticale con le stanghette e l'etichetta a lato
function misura(ctx, x, y0, y1, testo, col, al, lato = 1) {
  if (al <= 0 || Math.abs(y1 - y0) < 4) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - 9, y0); ctx.lineTo(x + 9, y0); ctx.moveTo(x - 9, y1); ctx.lineTo(x + 9, y1); ctx.stroke();
  drawRich(ctx, testo, x + lato * 18, (y0 + y1) / 2, { size: 32, align: lato > 0 ? 'left' : 'right' });
  ctx.restore();
}
// tratto di fune verticale, evidenziato o no
function tratto(ctx, x, y0, y1, k) {
  ctx.save(); ctx.lineCap = 'round';
  if (k > 0) { ctx.strokeStyle = css(C.g, .35 * k); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Metà forza, doppia corda', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · la carrucola fissa (7,5–35,4)
const PF = [742, 200], RF = 70;
function sceneFissa(ctx, t) {
  const al = life(t, 7.6, 35.4, .6, .8);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = salitaFissa(t), yc = 450 - s * PXM, yh = 330 + s * PXM;
  trave(ctx, 650, 840);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(PF[0] + RF, yc); ctx.lineTo(PF[0] + RF, PF[1]); ctx.arc(PF[0], PF[1], RF, 0, Math.PI, true); ctx.lineTo(PF[0] - RF, yh); ctx.stroke();
  ruota(ctx, PF[0], PF[1], RF, true);
  drawRich(ctx, '{v:fissa}', PF[0] - RF - 40, PF[1], { size: 34, align: 'right', alpha: life(t, 16.9, 34.6, .4, .4) });
  cassa(ctx, PF[0] + RF, yc);
  mano(ctx, PF[0] - RF, yh);
  // le forze: il peso della cassa e la mano che tira (1,2 px per newton)
  const kP = P(t, 8.3, 8.8), kM = P(t, 21.5, 22.0);
  freccia(ctx, [PF[0] + RF, yc + 80], [PF[0] + RF, yc + 80 + PESO * FS], C.y, kP);
  drawRich(ctx, '{my:P}', PF[0] + RF + 22, yc + 80 + PESO * FS / 2, { size: 36, align: 'left', alpha: kP });
  freccia(ctx, [PF[0] - RF, yh + 58], [PF[0] - RF, yh + 58 + PESO * FS], C.y, kM);
  drawRich(ctx, '{y:98 N}', PF[0] - RF - 26, yh + 58 + PESO * FS / 2, { size: 34, align: 'right', alpha: kM });
  // quanto è salita la cassa e quanto è scesa la mano
  const km = life(t, 26.0, 34.6, .3, .4), kl = P(t, 29.0, 29.4);
  misura(ctx, PF[0] + RF + 90, 450, yc, kl > 0 ? '{dim:1 m}' : '', C.dim, km);
  misura(ctx, PF[0] - RF - 80, 330, yh, kl > 0 ? '{dim:1 m}' : '', C.dim, km, -1);
  ctx.restore();
}

// 2 · la carrucola mobile (34,8–74,6): la fune scende dalla fissa, passa sotto la mobile e risale al soffitto
const XM = 862, RM = 50, XA = 912;
function sceneMobile(ctx, t) {
  const al = life(t, 34.8, 74.6, .8, .6);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = salitaMobile(t), yp = 520 - s * PXM, yh = 330 + 2 * s * PXM;
  trave(ctx, 650, 950);
  // il fantasma della posizione di partenza, mentre si misura
  const kg = life(t, 62.0, 70.6, .4, .4);
  if (kg > 0) {
    ctx.save(); ctx.globalAlpha *= .35 * kg; ctx.setLineDash([8, 8]); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(XM, 520, RM - 4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(XM - 55, 580, 110, 80, 8); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(PF[0] - RF - 24, 330, 48, 54, 14); ctx.stroke();
    ctx.restore();
  }
  // la fune: mano → sopra la fissa → giù fino alla mobile → sotto → su fino al soffitto
  const kt = life(t, 44.5, 54.0, .4, .5);
  tratto(ctx, PF[0] - RF, PF[1], yh, 0);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(PF[0], PF[1], RF, Math.PI, 0); ctx.stroke();
  tratto(ctx, PF[0] + RF, PF[1], yp, kt);
  ctx.beginPath(); ctx.arc(XM, yp, RM, Math.PI, 0, true); ctx.stroke();
  tratto(ctx, XA, YB, yp, kt);
  ruota(ctx, PF[0], PF[1], RF, true);
  // la mobile, col gancio e la cassa
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(XM, yp); ctx.lineTo(XM, yp + 60); ctx.stroke();
  ruota(ctx, XM, yp, RM, false);
  cassa(ctx, XM, yp + 60);
  mano(ctx, PF[0] - RF, yh);
  drawRich(ctx, '{v:mobile}', XM + RM + 36, yp, { size: 34, align: 'left', alpha: life(t, 35.4, 44.3, .4, .4) });
  // il capo legato al soffitto
  const kc = life(t, 39.9, 44.3, .4, .4);
  if (kc > 0) {
    M.dot(ctx, [XA, YB + 4], C.v, kc, 11);
    drawRich(ctx, '{v:legata qui}', XA + 26, YB + 40, { size: 30, align: 'left', alpha: kc });
  }
  // le forze: due tratti con T ciascuno, il peso, la mano
  const kT = P(t, 49.1, 49.6), kP = P(t, 35.6, 36.1), kM = P(t, 54.3, 54.8), TT = PESO / 2 * FS;
  freccia(ctx, [PF[0] + RF, yp], [PF[0] + RF, yp - TT], C.y, kT);
  freccia(ctx, [XA, yp], [XA, yp - TT], C.y, kT);
  drawRich(ctx, '{my:T}', PF[0] + RF - 22, yp - TT / 2 - 8, { size: 36, align: 'right', alpha: kT });
  drawRich(ctx, '{my:T}', XA + 22, yp - TT / 2 - 8, { size: 36, align: 'left', alpha: kT });
  freccia(ctx, [XM, yp + 140], [XM, yp + 140 + PESO * FS], C.y, kP);
  drawRich(ctx, '{my:P}', XM + 22, yp + 140 + PESO * FS / 2, { size: 36, align: 'left', alpha: kP });
  freccia(ctx, [PF[0] - RF, yh + 58], [PF[0] - RF, yh + 58 + TT], C.y, kM);
  drawRich(ctx, '{y:49 N}', PF[0] - RF - 26, yh + 58 + TT / 2, { size: 34, align: 'right', alpha: kM });
  // le misure: la cassa sale di 1 m, ognuno dei due tratti si accorcia di 1 m, la mano tira 2 m
  const km = life(t, 58.0, 74.0, .3, .4), kl = P(t, 61.0, 61.4), kr = life(t, 65.8, 70.6, .4, .4);
  misura(ctx, PF[0] - RF - 70, 330, yh, kl > 0 ? '{v:2 m}' : '', C.v, km, -1);
  misura(ctx, PF[0] + RF - 26, yp, 520, '{v:1 m}', C.v, kr, -1);
  misura(ctx, XA + 26, yp, 520, '{v:1 m}', C.v, kr, 1);
  ctx.restore();
}

// 3 · il paranco (74,2–92,6): due carrucole fisse in alto, due mobili in basso, quattro tratti reggono la cassa
const RP = 36, XT1 = 640, XT2 = 784, XB1 = 712, XB2 = 856, XH3 = XT1 - RP;
function sceneParanco(ctx, t) {
  const al = life(t, 74.2, 92.6, .8, .6);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const s = salitaParanco(t), yb = 500 - s * PXM, yh = 330 + 4 * s * PXM;
  trave(ctx, 580, 930);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(XH3, yh); ctx.lineTo(XH3, PF[1]);
  ctx.arc(XT1, PF[1], RP, Math.PI, 0); ctx.lineTo(XB1 - RP, yb);
  ctx.arc(XB1, yb, RP, Math.PI, 0, true); ctx.lineTo(XT2 - RP, PF[1]);
  ctx.arc(XT2, PF[1], RP, Math.PI, 0); ctx.lineTo(XB2 - RP, yb);
  ctx.arc(XB2, yb, RP, Math.PI, 0, true); ctx.lineTo(XB2 + RP, YB);
  ctx.stroke();
  ruota(ctx, XT1, PF[1], RP, true); ruota(ctx, XT2, PF[1], RP, true);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(XB1, yb); ctx.lineTo(XB2, yb); ctx.moveTo((XB1 + XB2) / 2, yb); ctx.lineTo((XB1 + XB2) / 2, yb + 50); ctx.stroke();
  ruota(ctx, XB1, yb, RP, false); ruota(ctx, XB2, yb, RP, false);
  cassa(ctx, (XB1 + XB2) / 2, yb + 50);
  mano(ctx, XH3, yh);
  // i quattro tratti che reggono la cassa, numerati
  const kn = P(t, 74.9, 75.4);
  if (kn > 0) [XB1 - RP, XB1 + RP, XB2 - RP, XB2 + RP].forEach((x, i) => {
    const y = (PF[1] + yb) / 2 + (i % 2 ? 30 : -30);
    ctx.save(); ctx.globalAlpha *= kn;
    ctx.fillStyle = css(C.paper); ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    txt(ctx, String(i + 1), x, y + 1, { size: 26, weight: 600, color: C.g });
    ctx.restore();
  });
  const kP = P(t, 74.8, 75.3), kM = P(t, 79.5, 80.0), yc = yb + 130;
  freccia(ctx, [(XB1 + XB2) / 2, yc], [(XB1 + XB2) / 2, yc + PESO * FS], C.y, kP);
  drawRich(ctx, '{my:P}', (XB1 + XB2) / 2 + 22, yc + PESO * FS / 2, { size: 36, align: 'left', alpha: kP });
  freccia(ctx, [XH3, yh + 58], [XH3, yh + 58 + PESO / 4 * FS + 4], C.y, kM);
  drawRich(ctx, '{y:24,5 N}', XH3 - 26, yh + 70, { size: 34, align: 'right', alpha: kM });
  const km = life(t, 83.4, 92.4, .3, .4), kl = P(t, 86.4, 86.8);
  misura(ctx, XB2 + RP + 50, 500 + 50, yb + 50, kl > 0 ? '{dim:50 cm}' : '', C.dim, km);
  misura(ctx, XH3 - 60, 330, yh, kl > 0 ? '{v:2 m}' : '', C.v, km, -1);
  ctx.restore();
}

// la scheda della macchina
function sceneMacchina(ctx, t) {
  if (t < 7.5 || t > 92.8) return;
  card(ctx, 372, 108, 740, 692, life(t, 7.5, 92.7, .6, .6));
}

// ---------- il pannello ----------
const PCX = 1490;
function riga(ctx, nome, forza, corda, y, kn, kf, kc) {
  drawRich(ctx, nome, 1180, y, { size: 34, align: 'left', alpha: kn });
  drawRich(ctx, forza, 1585, y, { size: 38, align: 'right', alpha: kf });
  drawRich(ctx, corda, 1795, y, { size: 38, align: 'right', alpha: kc });
}
function scenePannello(ctx, t) {
  if (t < 8.0 || t > 92.8) return;
  const al = life(t, 8.1, 92.7, .5, .6);
  card(ctx, 1140, 108, 700, 692, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'quanto tira la mano', PCX, 165, { size: 38, weight: 600 }));
  drawRich(ctx, '{dim:peso della cassa}  {my:P} = {mink:m·g}', 1180, 240, { size: 32, align: 'left', alpha: P(t, 8.4, 8.9) });
  drawRich(ctx, '98 N', 1795, 240, { size: 38, align: 'right', fill: css(C.y), alpha: P(t, 8.4, 8.9) });
  drawRich(ctx, '{dim:10 kg · 9,8 m/s²}', 1180, 288, { size: 30, align: 'left', alpha: P(t, 8.4, 8.9) });
  const kh = P(t, 21.4, 21.9);
  ctx.save(); ctx.globalAlpha *= kh;
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 330); ctx.lineTo(1800, 330); ctx.stroke();
  txt(ctx, 'forza', 1585, 372, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'fune per 1 m', 1795, 372, { size: 30, color: C.dim, align: 'right' });
  ctx.restore();
  riga(ctx, '{v:fissa}', '{y:98 N}', '1 m', 435, kh, kh, P(t, 29.0, 29.5));
  riga(ctx, '{v:mobile}', '{y:49 N}', '{v:2 m}', 505, P(t, 35.2, 35.7), P(t, 54.2, 54.7), P(t, 62.0, 62.5));
  riga(ctx, '{v:paranco}', '{y:24,5 N}', '{v:4 m}', 575, P(t, 74.6, 75.1), P(t, 79.4, 79.9), P(t, 86.6, 87.1));
  // i contatori: quanto sale la cassa, quanta fune tira la mano
  const kc = life(t, 25.8, 34.4, .3, .4) + life(t, 57.8, 73.8, .3, .4) + life(t, 83.2, 92.4, .3, .4);
  if (kc > 0) {
    const sc = t < 40 ? salitaFissa(t) : t < 76 ? salitaMobile(t) : salitaParanco(t);
    const sm = sc * (t < 40 ? 1 : t < 76 ? 2 : 4);
    ctx.save(); ctx.globalAlpha *= kc;
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 625); ctx.lineTo(1800, 625); ctx.stroke();
    txt(ctx, 'la cassa sale', 1180, 675, { size: 32, color: C.dim, align: 'left' });
    fixedNum(ctx, fmtN(sc, 2), 1740, 675, 42, C.ink); txt(ctx, 'm', 1752, 675, { size: 34, align: 'left' });
    txt(ctx, 'la mano tira', 1180, 740, { size: 32, color: C.dim, align: 'left' });
    fixedNum(ctx, fmtN(sm, 2), 1740, 740, 42, sm > sc + .01 ? C.v : C.ink); txt(ctx, 'm', 1752, 740, { size: 34, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// 4 · in una frase (92,6–102)
function sceneFine(ctx, t) {
  if (t < 92.5) return;
  const al = 1 - P(t, 100.0, 101.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 92.8 });
    drawRich(ctx, 'Ogni tratto di fune che regge la cassa\nporta una parte del suo peso.', W / 2, 290, { size: 64, weight: 600, local: t - 93.2, stagger: .09 });
  });
  const pills = [[490, 'fissa: cambia\nsolo il {v:verso}'], [960, 'mobile: {g:metà} forza,\n{v:doppia} corda'], [1430, 'paranco a 4 tratti:\n{g:un quarto} della forza']];
  pills.forEach(([x, s], i) => {
    const a = 95.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): mentre si tira (velocità costante) un tono segue la cassa che sale e,
  // con la mobile e col paranco, un secondo tono la fune tirata dalla mano (2 m): più fune, più in alto arriva
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.3, .55],                                               // la carrucola fissa, il peso: 98 N
    ['pop', 16.9, .4], ['traccia', 21.4, 21.9], ['pop', 21.5, .6],                    // «fissa»; la mano tira 98 N
    ['tono', 26.0, 29.0, [.2, .45]], ['pop', 29.1, .45],                              // cassa e fune: 1 m tutte e due (un tono solo)
    ['soffio', 34.8], ['pop', 35.4, .45], ['pop', 35.6, .55],                         // la carrucola mobile, il peso
    ['pop', 39.9, .7], ['pop', 44.5, .5],                                             // legata al soffitto; i due tratti
    ['pop', 49.1, .6], ['pop', 54.3, .4],                                             // T e T; la mano tira 49 N
    ['tono', 58.0, 61.0, [.2, .45]], ['tono', 58.0, 61.0, [.2, .7]], ['pop', 61.1, .6],   // 1 m di cassa, 2 m di fune
    ['ding', 62.2], ['traccia', 65.8, 66.2], ['pop', 65.9, .5],                       // 2 m!; ogni tratto si accorcia di 1 m
    ['soffio', 74.2], ['pop', 74.9, .55], ['ding', 79.6],                             // il paranco a 4 tratti: 24,5 N
    ['tono', 83.4, 86.4, [.2, .325]], ['tono', 83.4, 86.4, [.2, .7]], ['pop', 86.5, .6],   // 50 cm di cassa, 2 m di fune
    ['ding', 86.8],                                                                   // quattro volte la corda
    ['soffio', 92.8], ['pop', 95.0, .5], ['pop', 95.5, .6], ['pop', 96.0, .7],        // in una frase
  ];
  return {
    titolo: 'Metà forza, doppia corda', durata: 102, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 34.6, 'la carrucola fissa'], [34.6, 74.0, 'la carrucola mobile'], [74.0, 92.4, 'il paranco']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneMacchina(ctx, t); sceneFissa(ctx, t); sceneMobile(ctx, t); sceneParanco(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
