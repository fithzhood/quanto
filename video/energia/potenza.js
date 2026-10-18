'use strict';
/* Stesse scale, più fatica — salire 3 m di corsa (4 s) o camminando (10 s): stesso lavoro m·g·h = 1764 J, potenza diversa
   (P = L/t: ≈ 176 W contro 441 W); il watt; il chilowattora è un'unità di energia (3,6·10⁶ J), non di potenza. Argomento: energia. */
CVIDEO.registra('energia/potenza', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, fmtN } = M;

const T_FINE = 91.2;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.3, 'sorpreso'], [21.6, 'neutro'],
  [27.6, 'felice'], [33.0, 'neutro'], [37.7, 'pensa'], [42.5, 'neutro'], [52.1, 'felice'], [56.9, 'neutro'],
  [61.5, 'pensa'], [66.1, 'sorpreso'], [71.1, 'neutro'], [81.5, 'festa'], [86.5, 'neutro'], [93.5, 'felice'],
  [97.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.75, 'Fai le scale di corsa o camminando:\nil lavoro cambia?'],
  [7.9, 12.4, 'Due persone di 60 kg salgono\nuna scala alta 3 m.'],
  [12.5, 17.2, 'Una sale camminando, l’altra\ndi corsa. Partono insieme…'],
  [17.3, 21.5, '…chi corre arriva in 4 s…'],
  [21.6, 27.5, '…chi cammina in 10 s.'],
  [27.6, 32.9, 'Stesso lavoro:\n{mink:m·g·h} = 60 · 9,8 · 3 = {g:1764 J}.'],
  [33.0, 37.6, 'Conta solo il dislivello,\nnon il tempo.'],
  [37.7, 42.4, 'Cambia la {v:rapidità}: è la {v:potenza},\nil lavoro diviso il tempo.'],
  [42.5, 47.2, '{mv:P}{mink: = L/t}: si misura in {v:watt},\n1 W = 1 J/s.'],
  [47.3, 52.0, 'Chi cammina: 1764 J / 10 s ≈ {v:176 W}.'],
  [52.1, 56.8, 'Chi corre: 1764 J / 4 s = {v:441 W}.'],
  [56.9, 61.4, 'Per questo correndo si fa\npiù {v:fatica}: serve più potenza.'],
  [61.5, 66.0, 'Sulla bolletta della luce\nc’è il {v:chilowattora}, kWh.'],
  [66.1, 71.0, 'Sembra una potenza, ma è un’{g:energia}:\n1000 W per un’ora.'],
  [71.1, 76.7, '1 kWh = 1000 W · 3600 s =\n3 600 000 J, cioè 3,6·{mink:10⁶} J.'],
  [76.8, 81.4, 'Un phon da 2000 W per\nmezz’ora usa {g:1 kWh}.'],
  [81.5, 86.4, 'Con 1 kWh potresti salire quella scala\ncirca {g:2000 volte}!'],
  [86.5, 91.0, 'In bolletta si paga l’{g:energia},\nnon la potenza.'],
  [93.5, 98.5, 'Stesso lavoro in meno tempo:\nla potenza è lavoro diviso tempo.'],
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
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function riga(ctx, nome, val, y, al, col = C.g, size = 36) {
  if (al <= 0) return;
  drawRich(ctx, nome, 1190, y, { size, align: 'left', alpha: al });
  drawRich(ctx, val, 1770, y, { size: size + 2, align: 'right', alpha: al, fill: css(col) });
}
function linea(ctx, y, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Stesse scale, più fatica', W / 2, 180, { size: 124, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- 1–2 · le due scale: 100 px per metro, 15 gradini da 20 cm ----------
const SC = [110, 110, 1000, 680], GY = 700, TY = GY - 300, PED = 30, ALZ = 20, T0 = 17.4;
const SCALE = [{ x0: 150, durata: 10, nome: 'camminando' }, { x0: 630, durata: 4, nome: 'di corsa' }];
function scala(ctx, x0) {
  ctx.fillStyle = css(mix(C.dim, C.paper, .84)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, GY);
  for (let i = 0; i < 15; i++) { ctx.lineTo(x0 + PED * i, GY - ALZ * (i + 1)); ctx.lineTo(x0 + PED * (i + 1), GY - ALZ * (i + 1)); }
  ctx.lineTo(x0 + 450, GY); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function omino(ctx, x, y, passo) {   // piedi in (x, y); passo: fase delle gambe
  ctx.save(); ctx.strokeStyle = css(C.v); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const a = Math.sin(passo) * 10;
  ctx.beginPath(); ctx.moveTo(x - 8 + a, y); ctx.lineTo(x, y - 30); ctx.lineTo(x + 8 - a, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.lineTo(x + 3, y - 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 12 - a * .6, y - 40); ctx.lineTo(x + 3, y - 54); ctx.lineTo(x + 16 + a * .6, y - 40); ctx.stroke();
  ctx.fillStyle = css(mix(C.v, C.paper, .6)); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x + 4, y - 76, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function sceneScale(ctx, t) {
  if (t < 7.5 || t > 61.8) return;
  const al = life(t, 7.6, 61.6, .6, .5);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(130, GY); ctx.lineTo(1090, GY); ctx.stroke();
  for (const S of SCALE) {
    scala(ctx, S.x0);
    // sale a velocità costante lungo la scala (la linea dei bordi dei gradini), in S.durata secondi veri
    // (la retta per i centri dei gradini: dal pavimento, 15 px prima del primo gradino, alla cima)
    const k = clamp((t - T0) / S.durata), x = S.x0 - 15 + 450 * k, y = GY - 300 * k;
    omino(ctx, x, y, k > 0 && k < 1 ? (t - T0) * (S.durata < 5 ? 16 : 7) : 0);
    txt(ctx, S.nome, S.x0 + 225, GY + 40, { size: 32, weight: 600, color: C.ink });
    // il cronometro
    const tc = clamp(t - T0, 0, S.durata);
    const kc = P(t, 12.6, 13.1);
    drawRich(ctx, '{mink:t} =', S.x0 + 185, 200, { size: 36, align: 'right', alpha: kc });
    numero(ctx, fmtN(tc, 1) + ' s', S.x0 + 330, 200, 40, k >= 1 ? C.g : C.ink, kc);
  }
  // l'altezza della scala
  ctx.save(); ctx.globalAlpha *= P(t, 8.2, 8.7);
  freccia(ctx, [1095, (GY + TY) / 2], [1095, TY + 2], C.ink, 1, 3); freccia(ctx, [1095, (GY + TY) / 2], [1095, GY - 2], C.ink, 1, 3);
  drawRich(ctx, '3 m', 1066, (GY + TY) / 2 + 40, { size: 32, align: 'right' });
  ctx.restore();
  ctx.restore();
}

// la scheda: lavoro e potenza (27,6–61,4)
function schedaPotenza(ctx, t) {
  if (t < 7.5 || t > 61.8) return;
  const al = life(t, 8.0, 61.6, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'lavoro e potenza');
  riga(ctx, '{dim:massa} {mink:m}', '60 kg', 235, P(t, 8.1, 8.6), C.ink);
  riga(ctx, '{dim:dislivello} {mink:h}', '3 m', 290, P(t, 8.3, 8.8), C.ink);
  riga(ctx, '{mink:L = m·g·h}', '1764 J', 355, P(t, 27.8, 28.3));
  linea(ctx, 400, P(t, 37.9, 38.4));
  drawRich(ctx, '{mv:P}{mink: = L / t}', 1480, 455, { size: 50, local: t - 38.0 });
  drawRich(ctx, '{dim:in watt: 1 W = 1 J/s}', 1480, 515, { size: 32, local: t - 42.7 });
  // le due potenze, con barre in scala (0,8 px per watt)
  for (const [nome, tt, val, w, y, ta] of [['camminando', '10 s', '≈ 176 W', 176.4, 590, 47.5], ['di corsa', '4 s', '441 W', 441, 690, 52.3]]) {
    const k = P(t, ta, ta + .5);
    if (k <= 0) continue;
    ctx.save(); ctx.globalAlpha *= k;
    drawRich(ctx, '{dim:' + nome + ', ' + tt + '}', 1190, y - 30, { size: 30, align: 'left' });
    ctx.fillStyle = css(C.v, .85); ctx.fillRect(1190, y, w * .8 * P(t, ta, ta + .8), 34);
    txt(ctx, val, 1770, y + 17, { size: 38, weight: 600, color: C.v, align: 'right' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 3 · il chilowattora (61,5–91,2): potenza nel tempo, l'area è l'energia ----------
const GO = [230, 690], GT = 600, GP = .2;   // 600 px per ora, 0,2 px per watt
const gp = (h, w) => [GO[0] + h * GT, GO[1] - w * GP];
function sceneKwh(ctx, t) {
  if (t < 61.2 || t > T_FINE + .3) return;
  const al = life(t, 61.5, T_FINE + .1, .6, .5);
  card(ctx, ...SC, al);
  ctx.save(); ctx.globalAlpha *= al;
  // il rettangolo 1000 W per 1 h, poi quello del phon 2000 W per mezz'ora: stessa area
  const k1 = life(t, 66.3, 76.9, .6, .5), k2 = P(t, 77.0, 77.6);
  const rett = (h, w, k, col, s1, s2, fuori) => {
    if (k <= 0) return;
    const a = gp(0, w), b = gp(h, 0);
    ctx.save(); ctx.globalAlpha *= k;
    ctx.fillStyle = css(col, .28); ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
    ctx.strokeStyle = css(col); ctx.lineWidth = 4; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
    const lx = fuori ? b[0] + 40 : (a[0] + b[0]) / 2, al2 = fuori ? 'left' : 'center';
    const ly = fuori ? a[1] + 40 : (a[1] + b[1]) / 2;   // le scritte del phon in alto: sotto c'è il contorno dell'altro rettangolo
    drawRich(ctx, s1, lx, ly - 24, { size: 34, align: al2 });
    drawRich(ctx, s2, lx, ly + 24, { size: 34, align: al2 });
    drawRich(ctx, '{dim:area = energia}', fuori ? lx : (a[0] + b[0]) / 2, fuori ? ly + 80 : a[1] - 30, { size: 30, align: al2 });
    ctx.restore();
  };
  rett(1, 1000, k1, C.g, '1000 W · 1 h', '= {g:1 kWh}', false);
  // il contorno di 1000 W per 1 h resta: le due aree si confrontano
  if (k2 > 0) {
    const a = gp(0, 1000), b = gp(1, 0);
    ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = css(C.g, .8); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.restore();
    txt(ctx, '1000 W · 1 h', gp(.75, 0)[0], gp(0, 500)[1], { size: 30, color: C.dim, alpha: k2 });
  }
  rett(.5, 2000, k2, C.g, '{v:phon}: 2000 W · 0,5 h', '= {g:1 kWh}', true);
  // gli assi
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(...gp(0, 0)); ctx.lineTo(...gp(1.25, 0)); ctx.moveTo(...gp(0, 0)); ctx.lineTo(...gp(0, 2250)); ctx.stroke();
  arrowHead(ctx, [gp(1.25, 0)[0] + 6, GO[1]], 0, C.ink); arrowHead(ctx, [GO[0], gp(0, 2250)[1] - 6], -Math.PI / 2, C.ink);
  for (const [h, s] of [[.5, '0,5'], [1, '1']]) txt(ctx, s, gp(h, 0)[0], GO[1] + 30, { size: 30, color: C.dim });
  for (const w of [1000, 2000]) txt(ctx, String(w), GO[0] - 14, gp(0, w)[1], { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'tempo (h)', gp(1.25, 0)[0], GO[1] + 66, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'potenza (W)', GO[0] + 20, gp(0, 2250)[1], { size: 30, color: C.dim, align: 'left' });
  // all'inizio, la scritta della bolletta
  const kB = life(t, 61.7, 66.3, .5, .5);
  if (kB > 0) conFont(TITOLI, () => drawRich(ctx, '{v:kWh}', gp(.75, 1100)[0], gp(.75, 1100)[1], { size: 120, weight: 600, alpha: kB }));
  ctx.restore();
}
function schedaKwh(ctx, t) {
  if (t < 61.2 || t > T_FINE + .3) return;
  const al = life(t, 61.7, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  titoletto(ctx, 'il chilowattora');
  drawRich(ctx, '{dim:è un’unità di} {g:energia}', 1480, 230, { size: 36, local: t - 66.3 });
  drawRich(ctx, '1 kWh = 1000 W · 3600 s', 1480, 310, { size: 40, local: t - 71.3 });
  drawRich(ctx, '= 3 600 000 J', 1480, 370, { size: 40, local: t - 72.3 });
  drawRich(ctx, '= {g:3,6·}{mg:10⁶}{g: J}', 1480, 430, { size: 44, local: t - 73.3 });
  linea(ctx, 480, P(t, 81.6, 82.1));
  drawRich(ctx, '{dim:salite di 3 m con 1 kWh:}', 1480, 530, { size: 32, local: t - 81.7 });
  drawRich(ctx, '3 600 000 J / 1764 J ≈ {g:2041}', 1480, 585, { size: 38, local: t - 82.2 });
  drawRich(ctx, '{dim:la bolletta conta i kWh:}\n{g:energia}{dim:, non potenza}', 1480, 700, { size: 32, local: t - 86.7 });
  ctx.restore();
}

// 4 · in una frase (91,2–101)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 98.9, 99.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 91.4 });
    drawRich(ctx, 'La potenza dice quanto in fretta\nsi fa un lavoro.', W / 2, 290, { size: 70, weight: 600, local: t - 91.8, stagger: .09 });
  });
  const pills = [[490, '{mv:P}{mink: = L / t}\nin watt, 1 W = 1 J/s'], [960, 'stesse scale:\nstesso {g:lavoro}'], [1430, '1 kWh = 3,6·{mink:10⁶} J:\nun’{g:energia}']];
  pills.forEach(([x, s], i) => {
    const a = 94.0 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza dell'omino sulla scala (sale a velocità costante:
  // 4 s di corsa, 10 s camminando), poi la lunghezza delle barre della potenza
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.3, .5], ['pop', 12.6, .45],                            // le scale, 3 m; i cronometri
    ['tono', 17.4, 21.4, [.1, .9]], ['ding', 21.4],                                   // chi corre: in cima in 4 s
    ['tono', 17.4, 27.4, [.1, .9]], ['ding', 27.4],                                   // chi cammina: in 10 s
    ['pop', 27.8, .6],                                                                // L = m·g·h = 1764 J
    ['traccia', 37.9, 38.4], ['pop', 38.0, .6], ['pop', 42.7, .4],                    // P = L / t, il watt
    ['pop', 47.5, .4], ['tono', 47.5, 48.3, [.1, .35]],                               // camminando: ≈ 176 W
    ['pop', 52.3, .6], ['tono', 52.3, 53.1, [.1, .8]], ['ding', 53.2],                // di corsa: 441 W
    ['soffio', 61.5], ['pop', 61.8, .7],                                              // il chilowattora
    ['pop', 66.3, .5], ['pop', 66.5, .4],                                             // 1000 W · 1 h: un'energia
    ['pop', 71.3, .45], ['pop', 72.3, .5], ['ding', 73.6],                            // 1 kWh = 3,6·10⁶ J
    ['pop', 77.0, .7],                                                                // il phon: stessa area
    ['traccia', 81.6, 82.1], ['pop', 81.7, .4], ['ding', 82.6],                       // circa 2041 salite
    ['pop', 86.7, .45],                                                               // la bolletta conta i kWh
    ['soffio', 91.4], ['pop', 94.0, .5], ['pop', 94.5, .6], ['pop', 95.0, .7],        // in una frase
  ];
  return {
    titolo: 'Stesse scale, più fatica', durata: 101, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 37.6, 'stesso lavoro'], [37.6, 61.4, 'la potenza'], [61.4, T_FINE, 'il chilowattora']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScale(ctx, t); schedaPotenza(ctx, t); sceneKwh(ctx, t); schedaKwh(ctx, t); sceneFine(ctx, t); },
  };
});
