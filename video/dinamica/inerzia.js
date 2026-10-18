'use strict';
/* Aristotele aveva torto — il disco rallenta per l'attrito; senza attrito andrebbe dritto per sempre: il primo principio. Argomento: dinamica. */
CVIDEO.registra('dinamica/inerzia', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, richW, fmtN,
    card, arrowHead, crossMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [88.0, 190], [89.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [88.0, 1050], [89.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [88.0, 2.2], [89.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [88.0, 2], [89.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [88.0, -1.5], [89.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [12.1, 'pensa'], [16.0, 'neutro'],
  [21.5, 'sorpreso'], [24.2, 'neutro'], [28.4, 'felice'], [31.5, 'neutro'], [36.8, 'pensa'], [41.5, 'felice'],
  [45.8, 'pensa'], [49.9, 'sorpreso'], [53.9, 'felice'], [58.0, 'neutro'], [62.6, 'felice'], [66.8, 'neutro'],
  [74.2, 'felice'], [78.8, 'neutro'], [83.7, 'pensa'], [89.6, 'felice'], [94.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché un disco lanciato\nprima o poi si ferma?'],
  [7.9, 12.0, 'Aristotele pensava che senza\nuna forza ogni moto si spenga.'],
  [12.1, 15.9, 'Come se la spinta si {r:consumasse}\nstrada facendo.'],
  [16.0, 19.6, 'Mettiamolo alla {v:prova}: tre piste,\nlo stesso lancio.'],
  [19.8, 24.1, 'Sulla moquette parte a 4 m/s\ne si ferma quasi subito.'],
  [24.2, 28.0, 'Sul legno, con lo stesso lancio,\nva più lontano.'],
  [28.1, 31.4, 'Sul ghiaccio scivola\nmolto più a lungo…'],
  [31.5, 36.6, '…ma l’{y:attrito}, una forza contraria,\nlo rallenta piano piano.'],
  [36.8, 41.4, 'Il lancio era lo stesso: a cambiare\nè solo l’attrito della pista.'],
  [41.5, 45.6, 'Meno attrito, più strada:\nfino a oltre 16 metri.'],
  [45.8, 49.4, 'E se l’attrito {g:non ci fosse}\nper niente?'],
  [49.6, 53.8, 'Non rallenterebbe mai: stessa\nvelocità, sempre in linea retta.'],
  [53.9, 57.8, 'Andrebbe avanti {g:per sempre},\nsenza bisogno di nessuna spinta.'],
  [58.0, 62.3, 'Aristotele aveva {r:torto}: il moto\nnon ha bisogno di una forza.'],
  [62.6, 66.6, 'È il {v:primo principio} della\ndinamica: il principio d’inerzia.'],
  [66.8, 70.8, 'Se la {y:risultante} delle forze\nsu un corpo è {g:nulla}…'],
  [71.0, 74.0, '…se era fermo, resta {g:fermo}…'],
  [74.2, 78.6, '…se si muoveva, va {g:dritto}\na velocità costante.'],
  [78.8, 83.6, 'Vale se il sistema non accelera né gira:\ncon buona approssimazione, il suolo.'],
  [83.7, 87.95, 'La forza non serve a {r:mantenere}\nil moto: serve a {g:cambiarlo}.'],
  [89.6, 94.4, 'Una forza non tiene in moto un corpo:\nne {g:cambia} la velocità.'],
];

// ---------- aiutanti ----------
// freccia di un vettore: lunga quanto |b − a|, con la punta esattamente in b
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
// il disco da hockey visto dall'alto
const R = 24;
function disco(ctx, x, y, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css(mix(C.ink, C.paper, .45)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, R * .62, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// ---------- le piste: la legge oraria vera, decelerazione costante μ·g ----------
const G = 9.8, V0 = 4, PX = 80;            // 4 m/s; 80 px per metro
const X0 = 300, XFINE = 1800;              // partenza dei dischi, fine delle piste
const YP = [270, 420, 570, 720];           // moquette, legno, ghiaccio, senza attrito
const MU = [.4, .2, .05, 0];
const NOMI = ['moquette', 'legno', 'ghiaccio', 'senza attrito'];
const FORZA = ['attrito forte', 'attrito medio', 'attrito debole'];
const LANCIO = [20.4, 24.5, 28.4, 49.8];
const VSC = 35, FSC = 300;                 // px per m/s; px per unità di μ (stesso disco: la forza d'attrito è μ·m·g)
function stato(t, i) {   // [spazio in m, velocità in m/s, in moto?]
  const dt = t - LANCIO[i];
  if (dt <= 0) return [0, 0, false];
  if (!MU[i]) return [V0 * dt, V0, true];
  const a = MU[i] * G, ts = V0 / a;
  if (dt >= ts) return [V0 * V0 / (2 * a), 0, false];
  return [V0 * dt - a * dt * dt / 2, V0 - a * dt, true];
}
function pista(ctx, i, al) {
  if (al <= 0) return;
  const y = YP[i], x1 = i === 3 ? W + 20 : XFINE;
  ctx.save(); ctx.globalAlpha *= al;
  const base = [mix(C.y, C.paper, .8), mix(mix(C.y, C.ink, .4), C.paper, .62), mix(C.x, C.paper, .84), C.paper][i];
  ctx.fillStyle = css(base); ctx.beginPath(); ctx.roundRect(120, y - 32, x1 - 120, 64, 12); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(120, y - 32, x1 - 120, 64, 12); ctx.clip();
  if (i === 0) {   // il pelo della moquette
    ctx.fillStyle = css(mix(C.y, C.paper, .55));
    for (let k = 0; k < 120; k++) { const px = 130 + ((k * 137) % 1660), py = y - 26 + ((k * 53) % 52); ctx.fillRect(px, py, 4, 4); }
  } else if (i === 1) {   // le venature del legno
    ctx.strokeStyle = css(mix(mix(C.y, C.ink, .4), C.paper, .4)); ctx.lineWidth = 2;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(120, y - 20 + k * 13); for (let x = 120; x <= x1; x += 40) ctx.lineTo(x, y - 20 + k * 13 + Math.sin(x * .013 + k) * 3); ctx.stroke(); }
  } else if (i === 2) {   // i graffi dei pattini sul ghiaccio
    ctx.strokeStyle = css(C.paper, .9); ctx.lineWidth = 2;
    for (let k = 0; k < 9; k++) { const px = 200 + k * 180; ctx.beginPath(); ctx.moveTo(px, y - 18 + (k % 3) * 14); ctx.lineTo(px + 90, y - 22 + (k % 3) * 14); ctx.stroke(); }
  }
  ctx.restore();
  ctx.strokeStyle = i === 3 ? css(C.v, .7) : C.panelEdge; ctx.lineWidth = 2;
  if (i === 3) ctx.setLineDash([12, 10]);
  ctx.beginPath(); ctx.roundRect(120, y - 32, x1 - 120, 64, 12); ctx.stroke(); ctx.setLineDash([]);
  // la linea di partenza
  ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(X0, y - 32); ctx.lineTo(X0, y + 32); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}
function discoInPista(ctx, t, i, al) {
  if (al <= 0) return;
  const [s, v, moto] = stato(t, i), x = X0 + s * PX, y = YP[i], dt = t - LANCIO[i];
  ctx.save(); ctx.globalAlpha *= al;
  // il colpo secco della partenza
  const kc = dt > 0 ? 1 - clamp(dt / .35) : 0;
  if (kc > 0) {
    ctx.strokeStyle = css(C.dim, kc); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const d of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(X0 - 34, y + d * 16); ctx.lineTo(X0 - 34 - 26 * (1 - kc * .4), y + d * 22); ctx.stroke(); }
  }
  disco(ctx, x, y);
  if (moto) {
    // velocità in avanti, attrito all'indietro: frecce lunghe in proporzione
    const lv = v * VSC, lf = MU[i] * FSC;
    freccia(ctx, [x + R + 6, y], [x + R + 6 + lv, y], C.x);
    if (lf > 0) freccia(ctx, [x - R - 6, y], [x - R - 6 - lf, y], C.y);
    drawRich(ctx, '{x:velocità}', x + R + 6 + Math.max(lv, 96) / 2, y + 54, { size: 30, alpha: clamp((v / V0 - .3) / .2) });
    if (lf > 0) drawRich(ctx, '{y:attrito}', x - R - 6 - Math.max(lf, 40) / 2, y + 54, { size: 30 });
  } else if (dt > 0 && MU[i]) {
    // fermo: lo spazio percorso
    const kd = P(t, LANCIO[i] + V0 / (MU[i] * G), LANCIO[i] + V0 / (MU[i] * G) + .4, E.out);
    txt(ctx, fmtN(s, 1) + ' m', x, y + 56, { size: 34, weight: 600, alpha: kd });
  }
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Aristotele aveva torto', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · l'idea di Aristotele (7,5–16,3) e la smentita (58–62,4)
function sceneAristotele(ctx, t) {
  const a1 = life(t, 7.6, 16.2, .6, .5), a2 = life(t, 58.2, 62.4, .5, .5), al = Math.max(a1, a2);
  if (al <= 0) return;
  card(ctx, 460, 210, 1000, 400, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'l’idea di Aristotele', 960, 270, { size: 40, weight: 600 }));
  drawRich(ctx, '{r:«Senza una forza}\n{r:ogni moto si spegne.»}', 960, 385, { size: 58, weight: 600, local: t - 8.2 });
  // l'idea sbagliata: una spinta che si svuota strada facendo
  const kb = life(t, 12.2, 16.2, .4, .5);
  if (kb > 0 && t < 30) {
    ctx.save(); ctx.globalAlpha *= kb;
    txt(ctx, 'spinta', 700, 530, { size: 34, color: C.r, align: 'right' });
    ctx.strokeStyle = css(C.r); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(730, 510, 520, 40, 10); ctx.stroke();
    const f = 1 - P(t, 12.6, 15.4, E.lin);
    if (f > .01) { ctx.fillStyle = css(C.r, .45); ctx.beginPath(); ctx.roundRect(734, 514, 512 * f, 32, 7); ctx.fill(); }
    ctx.restore();
  }
  if (t > 58) {
    drawRich(ctx, '{g:il moto non ha bisogno di una forza}', 960, 540, { size: 40, local: t - 59.6 });
    crossMark(ctx, 1560, 400, P(t, 58.9, 59.7), C.r, .9);
  }
  ctx.restore();
}

// 2–3 · le quattro piste (16–58)
function scenePiste(ctx, t) {
  if (t < 16 || t > 58.6) return;
  const al = 1 - P(t, 57.8, 58.4);
  ctx.save(); ctx.globalAlpha *= al;
  for (let i = 0; i < 4; i++) {
    const ka = i < 3 ? P(t, 16.3 + i * .35, 16.9 + i * .35) : P(t, 45.9, 46.6);
    if (ka <= 0) continue;
    pista(ctx, i, ka);
    ctx.save(); ctx.globalAlpha *= ka;
    const nome = i < 3 ? '{dim:' + NOMI[i] + '}' : '{v:senza attrito} {dim:(pista ideale)}';
    drawRich(ctx, nome, 130, YP[i] - 56, { size: 30, align: 'left' });
    // a pista ferma: quanto attrito ha ciascuna
    if (i < 3) drawRich(ctx, '{y:·  ' + FORZA[i] + '}', 130 + richW(ctx, '{dim:' + NOMI[i] + '}', 30) + 14, YP[i] - 56, { size: 30, align: 'left', local: t - 37.2 - i * .3 });
    discoInPista(ctx, t, i, 1);
    ctx.restore();
  }
  // il disco senza attrito è uscito: e continua
  drawRich(ctx, '{g:avanti così, per sempre →}', 1800, YP[3] - 56, { size: 32, align: 'right', alpha: P(t, 55.4, 56.0) });
  ctx.restore();
}

// 4 · il primo principio (62,4–87,4)
function scenePrincipio(ctx, t) {
  if (t < 62.4 || t > 88.4) return;
  const al = life(t, 62.6, 88.3, .6, .6);
  card(ctx, 300, 115, 1320, 305, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'primo principio della dinamica', 960, 172, { size: 40, weight: 600 }));
  const kr = P(t, 66.8, 67.4);
  drawRich(ctx, 'Se la {y:risultante} delle forze su un corpo è nulla,\nil corpo resta in quiete\no si muove di moto rettilineo uniforme.', 960, 285, { size: 40, local: t - 63.2, stagger: .04 });
  drawRich(ctx, '(in un sistema di riferimento inerziale)', 960, 384, { size: 30, alpha: (1 - P(t, 78.8, 79.3)) * P(t, 64.6, 65.2), fill: css(C.dim) });
  drawRich(ctx, '{v:(in un sistema di riferimento inerziale)}', 960, 384, { size: 30, alpha: P(t, 78.8, 79.3) });
  ctx.restore();

  // i due casi
  const am = life(t, 67.2, 83.2, .5, .5);
  if (am > 0) {
    card(ctx, 300, 450, 630, 320, am * (t < 71 ? kr : 1));
    card(ctx, 990, 450, 630, 320, am * (t < 71 ? kr : 1));
    ctx.save(); ctx.globalAlpha *= am * kr;
    const kq = .5 + .5 * Math.max(life(t, 71.0, 74.0, .3, .3), P(t, 78.8, 79.3)), km = .5 + .5 * P(t, 74.2, 74.5);
    ctx.save(); ctx.globalAlpha *= kq;
    conFont(TITOLI, () => drawRich(ctx, 'in quiete', 615, 497, { size: 36, weight: 600 }));
    drawRich(ctx, '{y:risultante nulla}', 615, 545, { size: 30 });
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(360, 668); ctx.lineTo(870, 668); ctx.stroke();
    disco(ctx, 615, 640);
    drawRich(ctx, '{x:velocità} zero', 615, 725, { size: 30 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= km;
    conFont(TITOLI, () => drawRich(ctx, 'moto rettilineo uniforme', 1305, 497, { size: 36, weight: 600 }));
    drawRich(ctx, '{y:risultante nulla}', 1305, 545, { size: 30 });
    ctx.strokeStyle = css(C.dim, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1050, 668); ctx.lineTo(1560, 668); ctx.stroke();
    // il disco entra già in moto e va a 100 px/s: spazi uguali in tempi uguali (un'ombra ogni secondo)
    if (t > 74.2) {
      ctx.save(); ctx.beginPath(); ctx.rect(1000, 590, 610, 110); ctx.clip();
      const xd = t2 => 1000 - R + 100 * (t2 - 74.2);
      for (let k = 1; 74.2 + k < t; k++) disco(ctx, xd(74.2 + k), 640, .22);
      const x = xd(t);
      disco(ctx, x, 640);
      freccia(ctx, [x + R + 6, 640], [x + R + 6 + 90, 640], C.x);
      ctx.restore();
      drawRich(ctx, '{x:velocità} costante', 1305, 725, { size: 30, local: t - 74.6 });
    }
    ctx.restore();
    ctx.restore();
  }
  // la forza cambia la velocità, non la mantiene
  drawRich(ctx, 'la forza {g:cambia} la velocità,\n{r:non} la mantiene', 960, 600, { size: 54, weight: 600, local: t - 84.1, alpha: 1 - P(t, 87.7, 88.3) });
}

// 5 · riassunto (87,5–97)
function sceneFine(ctx, t) {
  if (t < 88.2) return;
  const al = 1 - P(t, 95.2, 96.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 88.4 });
    drawRich(ctx, 'Con risultante nulla la velocità\nnon cambia: una forza la {g:cambia}.', W / 2, 290, { size: 70, weight: 600, local: t - 88.8, stagger: .09 });
  });
  const pills = [[455, '{y:risultante} nulla:\nvelocità costante'], [960, 'la velocità non si consuma:\nla frena l’{y:attrito}'], [1465, 'vale nei sistemi\n{v:inerziali}']];
  pills.forEach(([x, s], i) => {
    const a = 91.3 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 235, 445, 470, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  const SUONI = [
    ['soffio', 1.6], ['soffio', 7.6], ['pop', 8.2, .4],                               // il titolo, l'idea di Aristotele
    ['tono', 12.6, 15.4, [.6, .4, .2]],                                               // la spinta che si consuma
    ['soffio', 16.3],                                                                 // tre piste
    ['pop', 20.4, .6], ['tono', 20.4, 21.42, [.7, .45, .2]], ['pop', 21.42, .3],      // moquette: 2,0 m (la velocità cala)
    ['pop', 24.5, .6], ['tono', 24.5, 26.54, [.7, .45, .2]], ['pop', 26.54, .45],     // legno: 4,1 m
    ['pop', 28.4, .6], ['tono', 28.4, 36.56, [.7, .45, .2]], ['pop', 36.56, .6],      // ghiaccio: 16,3 m
    ['pop', 37.2, .5],                                                                // quanto attrito ha ciascuna
    ['pop', 45.9, .7],                                                                // la pista senza attrito
    ['pop', 49.8, .6], ['tono', 49.8, 51.8, [.7, .7]],                                // va a velocità costante
    ['ding', 55.4],                                                                   // avanti così, per sempre
    ['soffio', 58.2], ['traccia', 58.9, 59.7], ['ding', 59.6],                        // Aristotele aveva torto
    ['soffio', 62.6], ['pop', 63.2, .5], ['pop', 66.8, .45],                          // il primo principio, i due casi
    ['pop', 71.0, .4],                                                                // in quiete
    ['pop', 74.2, .6], ['tono', 74.2, 76.2, [.6, .6]],                                // moto rettilineo uniforme
    ['pop', 78.8, .5], ['ding', 84.1],                                                // inerziale; la forza cambia la velocità
    ['soffio', 88.4], ['pop', 91.3, .5], ['pop', 91.8, .6], ['pop', 92.3, .7],        // in una frase
  ];
  return {
    titolo: 'Aristotele aveva torto', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 16.0, 'l’idea di Aristotele'], [16.0, 45.7, 'tre piste'], [45.7, 62.4, 'senza attrito'], [62.4, 88.2, 'il primo principio']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneAristotele(ctx, t); scenePiste(ctx, t); scenePrincipio(ctx, t); sceneFine(ctx, t); },
  };
});
