'use strict';
/* Galileo e la palla sul piano inclinato — il metodo sperimentale: domanda, ipotesi, esperimento, legge; la legge
   prevede, e una nuova prova la conferma. La palla rotola col suo moto vero, s = ½·a·t² con a = 0,6 m/s²
   (sfera piena che rotola: a = 5/7·g·sin α, quindi α ≈ 4,9°, l'inclinazione disegnata). Argomento: misure. */
CVIDEO.registra('misure/metodo', M => {
  const { W, C, E, P, life, clamp, css, TITOLI, conFont, drawRich, txt, fixedNum, fmtN, card, dot, arrowHead, checkMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [98.6, 190], [99.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [98.6, 1050], [99.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [98.6, 2.2], [99.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [98.6, 2], [99.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [98.6, -1.5], [99.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.9, 'pensa'], [21.5, 'neutro'],
  [39.3, 'sorpreso'], [41.6, 'neutro'], [47.8, 'sorpreso'], [50.0, 'neutro'], [52.4, 'felice'], [55.0, 'neutro'],
  [59.6, 'festa'], [62.0, 'neutro'], [66.0, 'pensa'], [71.8, 'neutro'], [80.7, 'festa'], [83.2, 'neutro'],
  [86.0, 'felice'], [88.4, 'neutro'], [101.0, 'felice'], [104.0, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.7, 'Come cade un corpo? Più veloce,\nma in che modo?'],
  [7.9, 12.4, 'Lasciata cadere, una palla è\ntroppo svelta da misurare a occhio.'],
  [12.6, 16.7, 'Galileo la {v:rallenta}: la fa rotolare\nsu un piano inclinato.'],
  [16.9, 21.3, 'La {v:domanda}: come cresce col tempo\nla strada fatta dalla palla?'],
  [21.5, 25.4, 'L’{v:ipotesi} di Galileo: la velocità\ncresce come il tempo.'],
  [25.6, 30.2, 'Se è così, la strada deve crescere\ncome il {v:quadrato} del tempo.'],
  [30.6, 35.5, 'Ora l’{v:esperimento}: la palla parte\nda ferma, e segno dov’è ogni secondo.'],
  [35.7, 39.1, 'Dopo 1 s ha fatto 0,3 m.'],
  [39.3, 43.6, 'Dopo 2 s, 1,2 m:\n{g:quattro volte} tanto.'],
  [43.8, 47.6, 'Dopo 3 s, 2,7 m:\n{g:nove volte}.'],
  [47.8, 52.2, 'Dopo 4 s, 4,8 m:\n{g:sedici volte}.'],
  [52.4, 59.2, 'Strada diviso tempo al quadrato:\nsempre {g:0,3} m/s², come previsto.'],
  [59.6, 65.8, 'Ecco la {v:legge}: {mink:s} = 0,3 m/s² · {mink:t²}.'],
  [66.0, 71.6, 'Una legge serve a {v:prevedere}:\ndove sarà la palla dopo 3,5 s?'],
  [71.8, 76.7, 'La legge dice: circa {g:3,7 m}.\nSegno il punto sul piano.'],
  [76.9, 80.5, 'Rifaccio la prova: la palla\nparte da ferma…'],
  [80.7, 85.6, '…e dopo 3,5 s è proprio lì:\nla legge è {g:confermata}.'],
  [86.0, 90.4, 'Domanda, ipotesi, esperimento,\nlegge: è il {v:metodo sperimentale}.'],
  [90.6, 94.6, 'Una legge fisica è una relazione\nfra grandezze {g:misurabili}.'],
  [94.8, 98.4, 'E resta valida finché gli esperimenti\nla {g:confermano}.'],
  [101.0, 105.1, 'Un’ipotesi messa alla prova\ndalle misure diventa una {g:legge}.'],
];

// ---------- la fisica ----------
const K = 0.3;                                   // s = ½·a·t² con a = 0,6 m/s²: s = 0,3 m/s² · t²
const ALFA = Math.asin(0.6 * 7 / (5 * 9.8));     // sfera piena che rotola: a = 5/7·g·sin α → α ≈ 4,92°
const PXM = 255, S0 = [470, 205], S_FINE = 5.1, R = 16;
const S_STOP = S_FINE - (R + 10) / PXM;          // in fondo c'è un fermo: la palla si ferma lì
const T1 = 31.3, T2 = 77.2, T_PREV = 3.5;        // le due partenze; la previsione è per 3,5 s
const S_PREV = K * T_PREV * T_PREV;              // 3,675 m ≈ 3,7 m
const strada = tt => Math.min(K * tt * tt, S_STOP);
const NX = Math.sin(ALFA), NY = -Math.cos(ALFA); // la normale al piano, verso l'alto
const sp = s => [S0[0] + s * PXM * Math.cos(ALFA), S0[1] + s * PXM * Math.sin(ALFA)];
const su = (s, h) => { const p = sp(s); return [p[0] + h * NX, p[1] + h * NY]; };   // h pixel sopra il piano
// dove sta la palla: la prima corsa, poi torna in cima, poi la seconda corsa
function palla(t) {
  if (t < 66.8) return { s: strada(clamp(t - T1, 0, 99)), al: 1 - P(t, 66.4, 66.8) };
  return { s: strada(clamp(t - T2, 0, 99)), al: P(t, 66.9, 67.3) };
}
function cronometro(t) {
  if (t < 66.8) return clamp(t - T1, 0, 4);
  return clamp(t - T2, 0, T_PREV);
}

// ---------- 0 · titolo (0–7.5) ----------
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Galileo e la palla\nsul piano inclinato', W / 2, 180, { size: 110, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// ---------- 1 · la caduta libera è troppo svelta (7.5–12.9) ----------
const CADUTE = [8.6, 10.0, 11.4], T_CAD = Math.sqrt(2 / 9.8);   // 1 m in ≈ 0,45 s
function scenaCaduta(ctx, t) {
  if (t < 7.5 || t > 13.0) return;
  const al = P(t, 7.7, 8.2) * (1 - P(t, 12.3, 12.8));
  const X = 980, Y0 = 160, L = PXM;              // 1 m = 255 px, come sul piano
  ctx.save(); ctx.globalAlpha *= al;
  // il metro verticale
  ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X - 60, Y0); ctx.lineTo(X - 60, Y0 + L); ctx.stroke();
  for (let i = 0; i <= 10; i++) { const y = Y0 + i * L / 10; ctx.beginPath(); ctx.moveTo(X - 60 - (i % 5 ? 6 : 12), y); ctx.lineTo(X - 60, y); ctx.stroke(); }
  txt(ctx, '1 m', X - 84, Y0 + L / 2, { size: 30, color: C.dim, align: 'right' });
  ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(X - 40, Y0 + L + R); ctx.lineTo(X + 40, Y0 + L + R); ctx.stroke();
  // la palla: y = ½·g·t², poi resta giù un attimo e ricompare in alto
  let y = 0, a = 1;
  for (const d of CADUTE) if (t >= d) {
    const u = t - d;
    y = u < T_CAD ? .5 * 9.8 * u * u : u < T_CAD + .6 ? 1 : 0;
    if (u >= T_CAD + .6) a = P(u, T_CAD + .6, T_CAD + .9);
  }
  ctx.save(); ctx.globalAlpha *= a; dot(ctx, [X, Y0 + y * L], C.y, 1, R); ctx.restore();
  drawRich(ctx, '1 m in circa {v:0,45 s}', X + 90, Y0 + L / 2, { size: 40, align: 'left' });
  ctx.restore();
}

// ---------- il piano inclinato (12.6–98.6) ----------
const SEGNI = [1, 2, 3, 4].map(k => ({ k, s: K * k * k, t: T1 + k }));
const RIGA_EVID = [[35.7, 39.1], [39.3, 43.6], [43.8, 47.6], [47.8, 52.2]];   // quando Stilla parla di ciascun secondo
function scenaPiano(ctx, t) {
  if (t < 7.4 || t > 99.2) return;
  const al = 1 - P(t, 98.4, 99.0);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 110, 1468, 330, P(t, 7.5, 8.2));
  const kp = P(t, 12.7, 13.5);
  if (kp <= 0) { ctx.restore(); return; }
  ctx.globalAlpha *= kp;
  // il cuneo e il fermo
  const pF = sp(S_FINE);
  ctx.fillStyle = css(C.dim, .16); ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(S0[0], S0[1]); ctx.lineTo(pF[0], pF[1]); ctx.lineTo(S0[0], pF[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(S0[0], S0[1]); ctx.lineTo(pF[0], pF[1]); ctx.stroke();
  const f0 = su(S_FINE - 10 / PXM, 0), f1 = su(S_FINE - 10 / PXM, 34);
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 10; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(f0[0], f0[1]); ctx.lineTo(f1[0], f1[1]); ctx.stroke();
  // i metri lungo il piano
  for (let m = 0; m <= 5; m++) {
    const p = sp(m);
    ctx.strokeStyle = css(C.dim, .9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(p[0], pF[1]); ctx.lineTo(p[0], pF[1] + 10); ctx.stroke();
    txt(ctx, String(m), p[0], pF[1] + 34, { size: 30, color: C.dim });
  }
  txt(ctx, 'm', sp(5)[0] + 40, pF[1] + 34, { size: 30, color: C.dim, align: 'left' });
  // i segni di ogni secondo della prima corsa
  const k0 = P(t, T1, T1 + .3);
  if (k0 > 0) segno(ctx, 0, '0 s', C.dim, k0);
  SEGNI.forEach((sg, i) => {
    const k = P(t, sg.t, sg.t + .3);
    if (k <= 0) return;
    const ev = life(t, RIGA_EVID[i][0], RIGA_EVID[i][1], .3, .3);
    segno(ctx, sg.s, sg.k + ' s', ev > .5 ? C.v : C.dim, k);
  });
  // la previsione: il punto segnato a 3,7 m
  const kv = P(t, 72.4, 72.9);
  if (kv > 0) {
    ctx.save(); ctx.globalAlpha *= kv;
    const a = su(S_PREV, -10), b = su(S_PREV, 44);
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 4; ctx.setLineDash([9, 7]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    const l = su(S_PREV, 64);
    txt(ctx, 'previsto: 3,7 m', l[0], l[1], { size: 30, weight: 600, color: C.g });
    ctx.restore();
  }
  // la foto della seconda corsa a 3,5 s: resta lì, sopra il segno
  const tf = T2 + T_PREV;
  if (t >= tf) {
    const c = su(S_PREV, R), fl = P(t, tf, tf + .5);
    ctx.save(); ctx.globalAlpha *= .45; dot(ctx, c, C.y, 1, R); ctx.restore();
    if (fl < 1) { ctx.save(); ctx.globalAlpha *= 1 - fl; ctx.strokeStyle = css(C.y); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(c[0], c[1], R + 30 * fl, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  }
  // la palla, che rotola: il puntino gira di s/r
  const pb = palla(t);
  if (pb.al > 0) {
    const c = su(pb.s, R), th = pb.s * PXM / R;
    ctx.save(); ctx.globalAlpha *= pb.al;
    dot(ctx, c, C.y, P(t, 13.0, 13.5, E.back), R);
    ctx.fillStyle = css(C.ink, .6); ctx.beginPath(); ctx.arc(c[0] + Math.cos(th) * R * .55, c[1] + Math.sin(th) * R * .55, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // il cronometro
  const kc = P(t, 30.6, 31.0);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha *= kc;
    txt(ctx, 'tempo', 1560, 165, { size: 32, color: C.dim, align: 'right' });
    fixedNum(ctx, fmtN(cronometro(t), 2), 1740, 165, 46, C.ink);
    txt(ctx, 's', 1752, 165, { size: 40, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}
function segno(ctx, s, et, col, k) {
  ctx.save(); ctx.globalAlpha *= k;
  const a = su(s, -8), b = su(s, 42), l = su(s, 64);
  ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  txt(ctx, et, l[0], l[1], { size: 30, weight: 600, color: col });
  ctx.restore();
}

// ---------- la tabella delle misure (30.6–98.6) ----------
const XT = [480, 680, 930], YR = [575, 620, 665, 710], Y_PREV = 760;
function scenaTabella(ctx, t) {
  if (t < 30.4 || t > 99.2) return;
  const al = P(t, 30.6, 31.2) * (1 - P(t, 98.4, 99.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 372, 460, 700, 330);
  // le intestazioni: i simboli arrivano con la legge; le grandezze si colorano quando Stilla dice «misurabili»
  const kS = P(t, 59.9, 60.4), kM = life(t, 90.8, 94.6, .4, .4);
  const colT = kM > .5 ? C.x : C.dim;
  txt(ctx, 'tempo', XT[0] - 22 * kS, 492, { size: 30, color: colT });
  txt(ctx, 'strada', XT[1] - 16 * kS, 492, { size: 30, color: colT });
  drawRich(ctx, '{mink:t}', XT[0] + 52, 492, { size: 32, alpha: kS });
  drawRich(ctx, '{mink:s}', XT[1] + 50, 492, { size: 32, alpha: kS });
  txt(ctx, '(s)', XT[0], 528, { size: 30, color: C.dim });
  txt(ctx, '(m)', XT[1], 528, { size: 30, color: C.dim });
  const k3 = P(t, 52.6, 53.1);
  txt(ctx, 'rispetto a 1 s', XT[2], 492, { size: 30, color: C.dim, alpha: P(t, 39.3, 39.8) * (1 - k3) });
  txt(ctx, 'strada / tempo²', XT[2], 492, { size: 30, color: C.dim, alpha: k3 });
  txt(ctx, '(m/s²)', XT[2], 528, { size: 30, color: C.dim, alpha: k3 });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(400, 548); ctx.lineTo(1044, 548); ctx.stroke();
  const volte = ['1 volta', '4 volte', '9 volte', '16 volte'];
  SEGNI.forEach((sg, i) => {
    const k = P(t, sg.t, sg.t + .35, E.out);
    if (k <= 0) return;
    const y = YR[i], ev = life(t, RIGA_EVID[i][0], RIGA_EVID[i][1], .3, .3);
    if (ev > 0) { ctx.fillStyle = css(C.v, .12 * ev); ctx.beginPath(); ctx.roundRect(392, y - 21, 660, 42, 10); ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= k;
    txt(ctx, String(sg.k), XT[0], y, { size: 40 });
    txt(ctx, fmtN(sg.s, 1), XT[1], y, { size: 40 });
    ctx.restore();
    const kv = P(t, RIGA_EVID[i][0] + (i ? .4 : 0), RIGA_EVID[i][0] + (i ? .9 : .5));
    txt(ctx, volte[i], XT[2], y, { size: 34, color: C.g, alpha: kv * (1 - k3) });
    const kq = P(t, 53.0 + .4 * i, 53.4 + .4 * i);
    txt(ctx, '0,3', XT[2], y, { size: 40, weight: 600, color: C.g, alpha: kq });
  });
  // la riga della previsione
  const kp = P(t, 66.4, 66.9);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp;
    ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(400, 735); ctx.lineTo(1044, 735); ctx.stroke(); ctx.setLineDash([]);
    txt(ctx, '3,5', XT[0], Y_PREV, { size: 40 });
    const kr = P(t, 72.0, 72.5);
    txt(ctx, '?', XT[1], Y_PREV, { size: 40, weight: 600, color: C.v, alpha: 1 - kr });
    drawRich(ctx, '{g:≈ 3,7}', XT[1], Y_PREV, { size: 40, alpha: kr });
    txt(ctx, '0,3 · 3,5² ≈ 3,7', XT[2], Y_PREV, { size: 30, color: C.dim, alpha: kr * (1 - P(t, 80.7, 81.1)) });
    if (t > 80.9) checkMark(ctx, XT[2], Y_PREV, P(t, 80.9, 81.5), C.g, .32);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- i passi del metodo (16.9–98.6) ----------
const PASSI = [
  { n: 'domanda', y: 515, da: 16.9, righe: ['come cresce la strada?'] },
  { n: 'ipotesi', y: 590, da: 21.5, righe: ['velocità come il tempo', '→ strada come tempo²'], t2: 25.9 },
  { n: 'esperimento', y: 665, da: 30.6, righe: ['tempi e strade misurati'] },
  { n: 'legge', y: 740, da: 59.6, righe: [] },
];
const ATTIVO = [[[16.9, 21.3]], [[21.5, 30.2]], [[30.6, 59.2], [76.9, 85.6]], [[59.6, 76.7]]];
function scenaPassi(ctx, t) {
  if (t < 16.6 || t > 99.2) return;
  const al = P(t, 16.8, 17.3) * (1 - P(t, 98.4, 99.0));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1100, 460, 740, 330);
  const tutti = life(t, 86.0, 90.4, .4, .4);
  PASSI.forEach((ps, i) => {
    const k = P(t, ps.da, ps.da + .5, E.out);
    if (k <= 0) return;
    let ev = tutti;
    for (const [a, b] of ATTIVO[i]) ev = Math.max(ev, life(t, a, b, .3, .3));
    if (ev > 0) { ctx.fillStyle = css(C.v, .11 * ev); ctx.beginPath(); ctx.roundRect(1116, ps.y - 34, 708, 68, 14); ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 14);
    ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(1156, ps.y, 20, 0, Math.PI * 2); ctx.fill();
    txt(ctx, String(i + 1), 1156, ps.y, { size: 26, weight: 600, color: C.paper });
    txt(ctx, ps.n, 1190, ps.y, { size: 34, weight: 600, color: C.v, align: 'left' });
    if (ps.righe.length === 1) txt(ctx, ps.righe[0], 1420, ps.y, { size: 30, align: 'left' });
    if (ps.righe.length === 2) {
      const k2 = P(t, ps.t2, ps.t2 + .5);
      txt(ctx, ps.righe[0], 1420, ps.y - 17 * k2, { size: 30, align: 'left' });
      txt(ctx, ps.righe[1], 1420, ps.y + 17, { size: 30, align: 'left', alpha: k2 });
    }
    ctx.restore();
  });
  // la legge
  const kl = P(t, 59.9, 60.5);
  if (kl > 0) {
    const kM = life(t, 90.8, 94.6, .4, .4);
    if (kM > 0) { ctx.strokeStyle = css(C.g, kM); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(1408, 712, 410, 56, 12); ctx.stroke(); }
    drawRich(ctx, '{mink:s} = 0,3 m/s² · {mink:t²}', 1420, 740, { size: 38, align: 'left', local: t - 59.9 });
  }
  // dalla legge si torna all'esperimento: la freccia del giro
  const kg = P(t, 76.9, 77.6);
  if (kg > 0) {
    const gl = life(t, 94.8, 98.4, .4, .4);
    ctx.save(); ctx.globalAlpha *= kg;
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 4 + 2 * gl; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(1134, 752); ctx.bezierCurveTo(1112, 735, 1112, 690, 1128, 676); ctx.stroke();
    arrowHead(ctx, [1131, 673], -Math.PI / 3, C.g, .8);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- in una frase (98.6–107.9) ----------
function scenaFine(ctx, t) {
  if (t < 98.7) return;
  const al = 1 - P(t, 105.6, 106.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 98.9 });
    drawRich(ctx, 'Un’ipotesi diventa una {g:legge}\nquando le misure la confermano.', W / 2, 290, { size: 68, weight: 600, local: t - 99.3, stagger: .08 });
  });
  const pills = [[490, 'una {v:domanda}\ne un’{v:ipotesi}'], [960, 'un {v:esperimento}:\ntempi e strade misurati'], [1430, 'la legge, che prevede:\n{mink:s} = 0,3 m/s² · {mink:t²}']];
  pills.forEach(([x, s], i) => {
    const a = 100.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.7],                                                                  // la caduta libera: 1 m in 0,45 s
    ['tono', 8.6, 9.05, [1, .94, .75, .44, 0]], ['tono', 10.0, 10.45, [1, .94, .75, .44, 0]],
    ['tono', 11.4, 11.85, [1, .94, .75, .44, 0]],
    ['soffio', 12.7], ['pop', 13.0, .55],                                             // il piano inclinato e la palla
    ['pop', 16.9, .5], ['pop', 21.5, .5], ['pop', 25.9, .55],                         // domanda, ipotesi
    ['soffio', 30.6],                                                                 // l'esperimento: tabella e cronometro
    ['tono', 31.3, 35.38, [.85, .84, .8, .74, .66, .56, .43, .27, .1]],               // la palla rotola giù
    ['pop', 32.3, .7], ['pop', 33.3, .6], ['pop', 34.3, .5], ['pop', 35.3, .4],       // i segni di ogni secondo
    ['pop', 39.7, .5], ['pop', 44.2, .6], ['pop', 48.2, .7],                          // 4, 9, 16 volte
    ['pop', 53.0, .5], ['pop', 53.4, .5], ['pop', 53.8, .5], ['ding', 54.2],          // sempre 0,3 m/s²
    ['pop', 59.9, .6],                                                                // la legge
    ['pop', 66.9, .45],                                                               // la palla torna in cima: previsione
    ['ding', 72.0], ['traccia', 72.4, 72.9],                                          // circa 3,7 m, il segno sul piano
    ['traccia', 76.9, 77.6],                                                          // la freccia del giro
    ['tono', 77.2, 80.7, [.85, .82, .71, .54, .3]], ['pop', 80.7, .6],                // la seconda corsa: è proprio lì
    ['pop', 86.0, .5], ['pop', 90.8, .55],                                            // il metodo, le grandezze misurabili
    ['soffio', 98.9], ['pop', 100.8, .5], ['pop', 101.3, .6], ['pop', 101.8, .7],     // in una frase
  ];
  return {
    titolo: 'Galileo e la palla sul piano inclinato', durata: 107.9, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.4, 'domanda e ipotesi'], [30.4, 59.4, 'l’esperimento'], [59.4, 85.8, 'la legge prevede'], [85.8, 98.4, 'il metodo sperimentale']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPiano(ctx, t); scenaCaduta(ctx, t); scenaTabella(ctx, t); scenaPassi(ctx, t); scenaFine(ctx, t); },
  };
});
