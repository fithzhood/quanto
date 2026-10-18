'use strict';
/* Andarsene dalla Terra — l'energia potenziale gravitazionale U = −G·M·m/r (zero all'infinito) disegnata sotto l'asse delle
   distanze, con la Terra in scala (62 px per raggio terrestre). Lanci verticali dalla superficie, senza aria, integrati con
   r″ = −G·M/r² (RK4): a 8 km/s sale a circa 6700 km (in 36 min) e ricade; a 10 km/s a circa 25 000 km (in 2 h 39 min) e ricade;
   a 11,2 km/s l'energia totale è zero e non torna più. ½·m·v² = G·M·m/R: v = √(2·G·M/R) ≈ 11,2 km/s, qualunque sia la massa.
   Tempo accelerato, una scala per lancio, scritta in alto a destra (10, 40 e 90 min al secondo): la discesa è lo specchio
   della salita e dura come lei. Argomento: gravitazione. */
CVIDEO.registra('gravitazione/fuga', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot, drawSeq, fixedNum } = M;

const T_FINE = 89.5;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [22.1, 'sorpreso'], [27.0, 'neutro'],
  [40.7, 'felice'], [45.3, 'neutro'], [57.5, 'sorpreso'], [61.5, 'pensa'], [66.2, 'festa'], [70.9, 'neutro'],
  [75.6, 'felice'], [80.1, 'festa'], [84.9, 'felice'], [T_FINE, 'neutro'], [91.9, 'felice'], [95.9, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Quanto forte va lanciato un sasso\nperché non ricada più?'],
  [7.9, 12.4, 'Ecco la Terra, e la distanza {mink:r}\ndal suo centro, verso destra.'],
  [12.5, 17.3, 'L’energia potenziale gravitazionale\nè {mg:U} = −{mink:G·M·m/r}.'],
  [17.4, 22.0, '{mink:M} è la massa della Terra,\n{mink:m} quella del sasso.'],
  [22.1, 26.9, 'È {r:negativa}: lo zero è messo\n{g:infinitamente lontano}.'],
  [27.0, 31.6, 'Più ci si avvicina alla Terra,\npiù {mg:U} scende: è una {v:buca}.'],
  [31.7, 35.9, 'Lancio verso l’alto a 8 km/s,\nsenza aria.'],
  [36.0, 40.6, 'L’energia totale, cinetica più\npotenziale, è la riga verde: {g:costante}.'],
  [40.7, 45.2, 'In cima la cinetica è finita:\nquota circa 6700 km.'],
  [45.3, 47.6, '…poi ricade.'],
  [49.1, 53.2, 'A 10 km/s sale più in alto…'],
  [53.3, 57.4, '…fino a circa 25 000 km di quota…'],
  [57.5, 61.4, '…ma poi ricade anche lui.'],
  [61.5, 66.1, 'Finché l’energia totale è\n{r:negativa}, prima o poi torna.'],
  [66.2, 70.8, 'A 11,2 km/s l’energia totale\nè {g:zero}: non torna più.'],
  [70.9, 75.5, 'Serve che la cinetica colmi la buca:\n½·{mink:m}·{mx:v}² = {mink:G·M·m/R}.'],
  [75.6, 80.0, 'La massa {mink:m} del sasso\n{g:si semplifica}.'],
  [80.1, 84.8, '{mx:v} = √(2·{mink:G·M/R}) ≈ {g:11,2 km/s},\nper un sasso come per un razzo.'],
  [84.9, 89.2, 'È la {v:velocità di fuga}\ndalla superficie, senza aria.'],
  [91.9, 96.9, 'Con energia totale zero o più\nci si allontana per sempre.'],
];

// ---------- aiutanti ----------
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }

// ---------- il moto vero: r″ = −G·M/r², in raggi terrestri e in unità di √(R³/(G·M)) ≈ 805 s ----------
const TU = 805.46, VU = 7909.79;   // unità di tempo (s) e di velocità (m/s) per la Terra
function salita(u, rMax) {   // r(τ) dal lancio fino all'apice (o fino a rMax), passo fisso
  const h = .0005, rr = [1]; let r = 1, v = u;
  const a = q => -1 / (q * q);
  while (rr.length < 200000) {
    const k1r = v, k1v = a(r), k2r = v + h / 2 * k1v, k2v = a(r + h / 2 * k1r), k3r = v + h / 2 * k2v, k3v = a(r + h / 2 * k2r), k4r = v + h * k3v, k4v = a(r + h * k3r);
    const vn = v + h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v); r += h / 6 * (k1r + 2 * k2r + 2 * k3r + k4r);
    rr.push(r);
    if (vn <= 0 || r > rMax) break;
    v = vn;
  }
  return { rr, tau: (rr.length - 1) * h, h };
}
const rDi = (S, tau) => { const f = clamp(tau / S.h, 0, S.rr.length - 1), i = Math.min(Math.floor(f), S.rr.length - 2); return lerp(S.rr[i], S.rr[i + 1], f - i); };
// ogni lancio ha il suo tempo accelerato (secondi veri per secondo di video), scritto in alto a destra; la discesa dura
// quanto la salita: il moto vero è simmetrico. su = [partenza, cima], giu = [inizio della discesa, arrivo]
const LANCI = [
  { v: '8', u: 8000 / VU, parte: 32.0, scende: 45.4, scala: 600, scritta: '10 min', quota: '≈ 6700 km', da: 31.7, a: 49.1 },
  { v: '10', u: 10000 / VU, parte: 49.3, scende: 57.5, scala: 2400, scritta: '40 min', quota: '≈ 25 000 km', da: 49.1, a: 66.2 },
  { v: '11,2', u: Math.SQRT2, parte: 66.3, scende: null, scala: 5400, scritta: '90 min', quota: '', da: 66.2, a: 200 },   // esce dal disegno a 69,9 s
].map(L => {
  const S = salita(L.u, 14), d = S.tau * TU / L.scala;
  return { ...L, E: L.u * L.u / 2 - 1, S, su: [L.parte, L.parte + d], giu: L.scende === null ? null : [L.scende, L.scende + d] };
});
// dove sta il sasso (in raggi terrestri) e quanto tempo vero è passato (in s)
function stato(L, t) {
  const S = L.S, T = S.tau;
  if (t <= L.su[0]) return { r: 1, tv: 0 };
  if (t <= L.su[1]) { const tau = (t - L.su[0]) / (L.su[1] - L.su[0]) * T; return { r: rDi(S, tau), tv: tau * TU }; }
  if (!L.giu || t <= L.giu[0]) return { r: rDi(S, T), tv: T * TU };
  const s = clamp((t - L.giu[0]) / (L.giu[1] - L.giu[0])) * T;
  return { r: rDi(S, T - s), tv: (T + s) * TU };
}
const corrente = t => LANCI.find(L => t >= L.da && t < L.a) || null;
const orario = s => { const m = Math.round(s / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min'; };

// ---------- la scena: l'asse delle distanze con la Terra in scala, e sotto il grafico di U ----------
const TC = [230, 300], RP = 62, Y0 = 425, SU = 290;                 // 62 px per raggio terrestre; 290 px per G·M·m/R
const xr = r => TC[0] + r * RP, yU = U => Y0 - U * SU;
const R_MAX = (1085 - TC[0]) / RP;
const CURVA = Array.from({ length: 241 }, (_, i) => { const r = lerp(1, R_MAX, (i / 240) ** 1.6); return [xr(r), yU(-1 / r)]; });

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Andarsene dalla Terra', W / 2, 180, { size: 126, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  const al = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1000, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(110, 110, 1000, 680); ctx.clip();
  // l'asse delle distanze, dal centro della Terra
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(TC[0], TC[1]); ctx.lineTo(1080, TC[1]); ctx.stroke();
  arrowHead(ctx, [1086, TC[1]], 0, C.ink);
  drawRich(ctx, '{mink:r}', 1080, TC[1] - 34, { size: 42 });
  for (const n of [5, 10]) { ctx.beginPath(); ctx.moveTo(xr(n), TC[1] - 8); ctx.lineTo(xr(n), TC[1] + 8); ctx.stroke(); drawRich(ctx, n + '{mink:R}', xr(n), TC[1] + 34, { size: 30 }); }
  // la Terra, in scala con l'asse
  const g = ctx.createRadialGradient(TC[0] - 20, TC[1] - 22, 6, TC[0], TC[1], RP);
  g.addColorStop(0, css(mix(mix(C.x, C.g, .35), [255, 255, 255], .4))); g.addColorStop(1, css(mix(C.x, C.g, .35)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(TC[0], TC[1], RP, 0, Math.PI * 2); ctx.fill();
  dot(ctx, TC, C.ink, 1, 6);
  drawRich(ctx, '{mink:R}', xr(1) + 18, TC[1] + 34, { size: 30, alpha: P(t, 71.0, 71.5) });
  txt(ctx, 'Terra in scala', TC[0], TC[1] - RP - 28, { size: 30, color: C.dim });
  // il grafico di U: lo zero, all'infinito
  const kU = P(t, 12.6, 13.4), kZ = P(t, 22.2, 22.7);
  if (kZ > 0) {
    dashed(ctx, [xr(1), Y0], [1080, Y0], C.dim, 1, kZ);   // grigia: la riga verde è quella dell'energia totale
    fondo(ctx, 960, Y0 - 28, 220, 40, kZ); drawRich(ctx, '{mg:U} = 0 {dim:all’infinito}', 960, Y0 - 28, { size: 30, alpha: kZ });
  }
  if (kU > 0) {
    ctx.save(); ctx.strokeStyle = css(C.g); ctx.lineWidth = 5; ctx.lineJoin = 'round';
    ctx.beginPath(); const n = Math.max(2, Math.round(CURVA.length * kU)); for (let i = 0; i < n; i++) i ? ctx.lineTo(...CURVA[i]) : ctx.moveTo(...CURVA[i]); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mg:U}', xr(1) - 30, yU(-1), { size: 40, alpha: kU });
    drawRich(ctx, '{dim:più in basso: più negativa}', xr(1) + 150, yU(-1) + 40, { size: 30, align: 'left', alpha: P(t, 27.2, 27.7) });
  }
  // la «buca»: la parete vicino alla Terra
  const kB = life(t, 27.1, 31.7, .4, .4);
  if (kB > 0) drawRich(ctx, '{v:buca}', xr(1.45) + 40, yU(-1 / 1.45) + 30, { size: 36, align: 'left', alpha: kB });
  // il lancio in corso: il sasso sull'asse, la riga dell'energia totale, la cinetica
  const L = corrente(t);
  if (L) {
    const kL = P(t, L.da, L.da + .4), st = stato(L, t), x = xr(Math.min(st.r, R_MAX + .5)), yE = yU(L.E);
    // le energie dei lanci precedenti, quando Stilla le confronta
    const kP = life(t, 61.5, 66.2, .3, .3);
    if (kP > 0) LANCI.slice(0, 2).forEach((Q, i) => { dashed(ctx, [xr(1), yU(Q.E)], [1080, yU(Q.E)], C.r, 1, kP); drawRich(ctx, '{r:' + Q.v + ' km/s}', i ? xr(1) + 12 : 1075, yU(Q.E) - 22, { size: 30, align: i ? 'left' : 'right', alpha: kP }); });
    const atterrato = L.giu ? P(t, L.giu[1], L.giu[1] + .3) : 0;   // tornato a terra: si ferma, niente più riga né barra
    ctx.save(); ctx.globalAlpha *= kL * P(t, L.su[0] - .1, L.su[0] + .3) * (1 - atterrato);
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.setLineDash([12, 8]);
    ctx.beginPath(); ctx.moveTo(xr(1), yE); ctx.lineTo(1080, yE); ctx.stroke(); ctx.setLineDash([]);
    // la cinetica: dalla curva fino alla riga, sotto il sasso
    if (x < 1080) {
      const yC = yU(-1 / st.r);
      ctx.fillStyle = css(C.g, .3); ctx.fillRect(x - 9, Math.min(yE, yC), 18, Math.abs(yC - yE));
      // il filo dal sasso al grafico salta le etichette «5R», «10R» (sotto l'asse) e «U = 0» (x 840–1080, y 372–420)
      const yb = Math.min(yE, yC), y0 = [5, 10].some(n => Math.abs(x - xr(n)) < 36) ? TC[1] + 56 : TC[1] + 14;
      if (x > 840 && yb > 420) { dashed(ctx, [x, y0], [x, 368], C.dim, 1, .6); dashed(ctx, [x, 424], [x, yb], C.dim, 1, .6); }
      else dashed(ctx, [x, y0], [x, yb], C.dim, 1, .6);
      dot(ctx, [x, yC], C.g, 1, 7);
    }
    ctx.restore();
    drawRich(ctx, '{g:energia totale}', 1075, yE - 24, { size: 30, align: 'right', alpha: life(t, 36.1, 45.3, .4, .4) });
        if (st.r < R_MAX) dot(ctx, [x, TC[1]], C.y, kL, 10);
  }
  ctx.restore();
  txt(ctx, 'senza aria', 1085, 192, { size: 30, color: C.dim, align: 'right', alpha: P(t, 31.8, 32.2) * al });
  // il tempo: accelerato mentre il sasso si muove (con la scala del lancio), fermo immagine in cima
  if (L) {
    const vola = t > L.su[0] && t < L.su[1] || (L.giu && t > L.giu[0] && t < L.giu[1]), fermo = L.giu && t >= L.su[1] && t <= L.giu[0];
    const s = vola ? 'tempo accelerato: ' + L.scritta + ' al secondo' : fermo ? 'fermo immagine' : '';
    if (s) txt(ctx, s, 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: al });
  }
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 12.3 || t > T_FINE + .3) return;
  const al = life(t, 12.5, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  // 1 · l'energia potenziale
  const s1 = life(t, 12.5, 31.7, .4, .4);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    titoletto(ctx, 'energia potenziale');
    drawSeq(ctx, ['{mg:U}{mink: = −}', { num: '{mink:G·M·m}', den: '{mink:r}' }], 1480, 275, 58, { local: t - 12.7 });
    drawRich(ctx, '{mink:M}{dim:: massa della Terra}', 1480, 380, { size: 34, local: t - 17.5 });
    drawRich(ctx, '{mink:m}{dim:: massa del sasso}', 1480, 425, { size: 34, local: t - 18.0 });
    drawRich(ctx, '{mink:r}{dim:: distanza dal centro}', 1480, 470, { size: 34, local: t - 18.4 });
    drawRich(ctx, '{mink:G} ≈ 6,67·10{mink:⁻¹¹} N·m²/kg²', 1480, 515, { size: 30, local: t - 18.8 });
    riga(558, P(t, 22.2, 22.6));
    drawRich(ctx, '{mg:U} = 0 {dim:infinitamente lontano}', 1480, 605, { size: 34, local: t - 22.3 });
    drawRich(ctx, '{dim:più vicino:} {mg:U} {r:negativa}', 1480, 655, { size: 34, local: t - 22.9 });
    ctx.restore();
  }
  // 2 · i lanci
  const s2 = life(t, 31.7, 70.9, .4, .4);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    titoletto(ctx, 'lanci verso l’alto');
    txt(ctx, 'velocità', 1270, 230, { size: 30, color: C.dim }); txt(ctx, 'quota massima', 1600, 230, { size: 30, color: C.dim });
    LANCI.forEach((L, i) => {
      const k = P(t, L.da, L.da + .4), y = 290 + 62 * i;
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      txt(ctx, L.v + ' km/s', 1330, y, { size: 36, weight: 600, align: 'right' });
      const tq = i === 0 ? 40.8 : i === 1 ? 53.3 : 66.4;   // la quota compare quando il sasso è in cima (lancio 10: 53,27)
      drawRich(ctx, i < 2 ? L.quota + ', {r:ricade}' : '{g:non torna più}', 1600, y, { size: 32, alpha: P(t, tq, tq + .4) });
      ctx.restore();
    });
    // come si legge il grafico: la barra della cinetica si nomina mentre il sasso sale (in cima è zero); restano fino all'arrivo
    const kLg = life(t, 36.1, 49.0, .4, .4), kBa = life(t, 32.3, 49.0, .4, .4);
    drawRich(ctx, '{dim:curva:} {g:potenziale}', 1480, 355, { size: 30, alpha: kLg });
    drawRich(ctx, '{dim:riga tratteggiata:} {g:energia totale}', 1480, 400, { size: 30, alpha: kLg });
    drawRich(ctx, '{dim:barra fra le due:} {g:cinetica}', 1480, 445, { size: 30, alpha: kBa });
    riga(480, P(t, 32.0, 32.4));
    const L = corrente(t);
    if (L && t > L.su[0] && (L.giu || t < L.su[1])) {   // a 11,2 km/s, uscito dal disegno, l'orologio sparisce
      txt(ctx, 'tempo vero dal lancio', 1480, 530, { size: 30, color: C.dim });
      txt(ctx, orario(stato(L, t).tv), 1480, 590, { size: 44, weight: 600 });
    }
    drawRich(ctx, '{dim:energia totale} {r:< 0}{dim:: ricade}', 1480, 680, { size: 34, alpha: life(t, 61.6, 70.9, .4, .4) });
    drawRich(ctx, '{dim:energia totale} {g:= 0}{dim:: se ne va}', 1480, 735, { size: 34, alpha: life(t, 66.4, 70.9, .4, .4) });
    ctx.restore();
  }
  // 3 · la velocità di fuga
  const s3 = P(t, 71.0, 71.4);
  if (s3 > 0) {
    ctx.save(); ctx.globalAlpha *= s3;
    titoletto(ctx, 'velocità di fuga');
    drawRich(ctx, '{mink:½·m·}{mx:v}{mink:² = G·M·m/R}', 1480, 255, { size: 46, local: t - 71.1 });
    drawRich(ctx, '{mink:R} ≈ 6370 km{dim:: raggio della Terra}', 1480, 320, { size: 32, local: t - 71.6 });
    drawRich(ctx, '{dim:la massa} {mink:m} {g:si semplifica}', 1480, 395, { size: 34, local: t - 75.7 });
    drawRich(ctx, '{mx:v}{mink: = √(2·G·M/R)}', 1480, 480, { size: 52, local: t - 80.2 });
    drawRich(ctx, '{g:≈ 11,2 km/s}', 1480, 570, { size: 60, local: t - 80.8 });
    drawRich(ctx, '{dim:dalla superficie, senza aria,}', 1480, 660, { size: 30, local: t - 85.0 });
    drawRich(ctx, '{dim:qualunque sia la massa}', 1480, 705, { size: 30, local: t - 85.4 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (89,5–99,8)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 98.3, 99.3);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Per non tornare più serve tanta energia\ncinetica da colmare la buca: 11,2 km/s.', W / 2, 290, { size: 62, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{mg:U} = −{mink:G·M·m/r}\n{dim:zero all’infinito}'], [960, 'energia totale {r:< 0}:\nprima o poi ricade'], [1430, '{mx:v} = √(2·{mink:G·M/R})\n{dim:non dipende da} {mink:m}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 2.2 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6],                                                                  // la Terra e l'asse delle distanze
    ['traccia', 12.6, 13.4], ['pop', 12.7, .55],                                      // la curva di U, U = −G·M·m/r
    ['pop', 17.5, .35],                                                               // M, m, r, G
    ['traccia', 22.2, 22.7], ['pop', 22.3, .5], ['pop', 22.9, .3],                    // U = 0 all'infinito, più vicino negativa
    ['pop', 27.1, .4],                                                                // la buca
    ['soffio', 31.7], ['pop', 31.8, .4],                                              // i lanci: 8 km/s
    ['pop', 32.0, .5], ['tono', 32.0, 35.61, [.15, .23, .28, .32, .34, .36, .37, .38, .38]],   // sale
    ['pop', 36.1, .45], ['pop', 40.8, .45],                                           // l'energia totale, quota 6700 km
    ['tono', 45.4, 49.01, [.38, .38, .37, .36, .34, .32, .28, .23, .15]], ['pop', 49.01, .2],   // ricade
    ['pop', 49.3, .55], ['tono', 49.3, 53.27, [.15, .42, .52, .58, .62, .64, .66, .67, .67]],  // 10 km/s: sale più in alto
    ['pop', 53.3, .6],                                                                // quota 25 000 km
    ['tono', 57.5, 61.47, [.67, .67, .66, .64, .62, .58, .52, .42, .15]], ['pop', 61.47, .2],  // ricade anche lui
    ['pop', 61.6, .35],                                                               // energia totale negativa
    ['pop', 66.4, .7], ['tono', 66.3, 69.91, [.15, .58, .72, .8, .86, .91, .94, .98, 1]],      // 11,2 km/s: non torna più
    ['soffio', 71.0], ['pop', 71.1, .55],                                             // la velocità di fuga: ½·m·v² = G·M·m/R
    ['pop', 75.7, .45], ['pop', 80.2, .6], ['pop', 80.8, .8],                         // m si semplifica, v = √(2·G·M/R) ≈ 11,2 km/s
    ['pop', 85.0, .35],                                                               // dalla superficie, senza aria
    ['soffio', 89.7], ['pop', 91.7, .5], ['pop', 92.2, .6], ['pop', 92.7, .7],        // in una frase
  ];
  return {
    titolo: 'Andarsene dalla Terra', durata: 99.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 31.6, 'l’energia potenziale'], [31.6, 70.8, 'i lanci'], [70.8, T_FINE, 'la velocità di fuga']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
