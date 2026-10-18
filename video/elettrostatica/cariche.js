'use strict';
/* Strofinare, toccare, avvicinare — la carica elettrica (elettroni −e, protoni +e, e ≈ 1,6·10⁻¹⁹ C, quantizzata,
   corpo neutro) e tre modi di agire su un corpo: strofinio e contatto lo caricano, l'induzione (senza messa a terra) ne separa
   soltanto le cariche e lo lascia neutro. Strofinio: passano elettroni dalla lana alla plastica, i nuclei
   restano fermi; la carica si conserva (−3 + 3 = 0, ogni segno sta per miliardi di elettroni). Contatto: la bacchetta
   cede elettroni alla pallina appesa, che viene respinta; la lana, positiva, la attrae: il pendolo è integrato
   (θ'' = (−g·sin θ + forza elettrica tangente)/L − γ·θ', L = 0,3 m in tempo vero, forze ∝ q₁·q₂/d²). Induzione: gli
   elettroni liberi della sfera vanno dalla parte lontana; attrazione sulle positive vicine più forte della repulsione
   sulle negative lontane (∝ 1/d²). La carta, isolante, si polarizza e salta sulla bacchetta: y'' = A/d³ − g, integrata,
   al rallentatore (10 volte). Colori fissi dell'elettrostatica: positive C.v, negative C.x, forze C.y, campo C.ink.
   Argomento: elettrostatica. */
CVIDEO.registra('elettrostatica/cariche', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead } = M;
  const TAU = Math.PI * 2;

const T_FINE = 93.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.5, 'pensa'], [22.1, 'felice'],
  [26.4, 'neutro'], [35.8, 'sorpreso'], [40.8, 'felice'], [45.6, 'neutro'], [50.3, 'sorpreso'], [55.2, 'felice'],
  [59.5, 'neutro'], [69.2, 'sorpreso'], [73.9, 'neutro'], [78.7, 'felice'], [83.5, 'neutro'], [88.4, 'festa'],
  [91.5, 'neutro'], [95.6, 'felice'], [99.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché una penna strofinata\nattira i pezzetti di carta?'],
  [7.9, 12.2, 'Nella materia: {x:elettroni} negativi\ne {v:protoni} positivi, chiusi nei nuclei.'],
  [12.3, 17.4, 'Elettrone −{mink:e}, protone +{mink:e}: {mink:e} ≈ 1,6·10{mink:⁻¹⁹} C\nè la più piccola carica libera.'],
  [17.5, 22.0, 'Ogni carica è un multiplo di {mink:e}:\nla carica è {g:quantizzata}.'],
  [22.1, 26.3, 'Tanti elettroni quanti protoni:\nil corpo è {g:neutro}.'],
  [26.4, 30.8, 'Strofino una bacchetta di plastica\ncon un panno di lana.'],
  [30.9, 35.7, 'Passano {x:elettroni} dalla lana alla\nplastica: i nuclei restano fermi.'],
  [35.8, 40.7, 'La plastica ha elettroni in più: è\n{x:negativa}. Alla lana ne mancano: {v:positiva}.'],
  [40.8, 45.5, 'Nessuna carica si crea: la carica\ntotale {g:si conserva}.'],
  [45.6, 50.2, 'Tocco con la bacchetta una pallina\ndi metallo appesa a un filo.'],
  [50.3, 55.1, 'Passano {x:elettroni} alla pallina:\nora è {x:negativa}, e viene {g:respinta}.'],
  [55.2, 59.4, 'Cariche dello stesso segno\nsi {g:respingono}.'],
  [59.5, 64.4, 'Avvicino la lana, {v:positiva}: segni\nopposti si {g:attraggono}.'],
  [64.5, 69.1, 'Ricarico la bacchetta e la avvicino\na una sfera di metallo neutra.'],
  [69.2, 73.8, 'Gli elettroni liberi della sfera sono\nrespinti dall’altra parte.'],
  [73.9, 78.6, 'Vicino restano cariche {v:positive},\npiù vicine: la sfera è {g:attratta}.'],
  [78.7, 83.4, 'È l’{g:induzione}: la sfera resta neutra,\nma le sue cariche si separano.'],
  [83.5, 88.3, 'Nella carta, isolante, ogni molecola\nsi {g:polarizza} e viene attratta.'],
  [88.4, 93.0, 'Ecco perché la penna strofinata\nattira i pezzetti di carta!'],
  [95.6, 101.8, 'Strofinio e contatto caricano un corpo;\nl’induzione ne separa le cariche.'],
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
function carica(ctx, p, segno, r = 34, al = 1, sc = 1) {
  if (al <= 0 || sc <= 0.01) return;
  const col = segno > 0 ? C.v : C.x;
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
  const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .4))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.paper); ctx.lineWidth = Math.max(2.2, r * .17); ctx.lineCap = 'round';
  const a = r * .46; ctx.beginPath(); ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
  if (segno > 0) { ctx.moveTo(0, -a); ctx.lineTo(0, a); }
  ctx.stroke(); ctx.restore();
}
const piu = (ctx, p, al = 1, r = 12) => carica(ctx, p, 1, r, al);
const meno = (ctx, p, al = 1, r = 9) => carica(ctx, p, -1, r, al);
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function blocco(ctx, x, y, w, h, col, al = 1, r = 12) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke(); ctx.restore(); }
const PLASTICA = () => mix(C.dim, C.paper, .62), LANA = () => mix(C.ink, C.paper, .84), METALLO = () => mix(C.dim, C.paper, .45);
function lanaTrama(ctx, x, y, w, h, al) {   // il panno: un rettangolo morbido con qualche filo
  blocco(ctx, x, y, w, h, LANA(), al, 18);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al * .5; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 1.5;
  for (let i = 1; i < 5; i++) { ctx.beginPath(); for (let k = 0; k <= 20; k++) { const xx = x + 8 + (w - 16) * k / 20, yy = y + h * i / 5 + 3 * Math.sin(k * 1.3 + i); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.restore();
}
const CARTA = [110, 110, 1000, 680];

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Strofinare, toccare, avvicinare', W / 2, 180, { size: 104, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function sceneSchede(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, ...CARTA, life(t, 7.6, T_FINE + .1, .6, .5));
  card(ctx, 1150, 110, 660, 680, life(t, 7.9, T_FINE + .1, .5, .5));
}

// 1 · la carica (7,5–26,4): 15 atomi schematici, un protone e un elettrone ciascuno
function sceneAtomi(ctx, t) {
  const al = life(t, 7.8, 26.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
    const c = [250 + i * 150, 255 + j * 160], k = P(t, 8.0 + (i + j) * .08, 8.5 + (i + j) * .08, E.back);
    const a = i * 1.7 + j * 2.3 + t * .9, e = [c[0] + 42 * Math.cos(a), c[1] + 42 * Math.sin(a)];
    ctx.save(); ctx.globalAlpha *= .35 * k; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.arc(c[0], c[1], 42, 0, TAU); ctx.stroke(); ctx.restore();
    carica(ctx, c, 1, 18, 1, k);
    carica(ctx, e, -1, 11, 1, k);
  }
  // la legenda
  const kl = P(t, 8.4, 9.0);
  carica(ctx, [300, 735], 1, 16, kl); txt(ctx, 'protone, nel nucleo', 330, 735, { size: 30, color: C.dim, align: 'left', alpha: kl });
  carica(ctx, [700, 735], -1, 11, kl); txt(ctx, 'elettrone', 725, 735, { size: 30, color: C.dim, align: 'left', alpha: kl });
  txt(ctx, 'schema: un protone e un elettrone per atomo', 610, 150, { size: 30, color: C.dim, alpha: P(t, 8.4, 9.0) });
  ctx.restore();
}

// 2 · lo strofinio (26,4–45,6)
const ROD2 = [200, 430, 600, 52], YR2 = 456;   // bacchetta: x, y, larghezza, altezza; riga delle cariche
const COPPIE_ROD = Array.from({ length: 6 }, (_, k) => 260 + k * 100);   // + in x, − in x + 30
const PASSAGGI = [[31.3, 1, 425], [32.5, 3, 525], [33.7, 5, 625]];        // [quando, quale elettrone della lana, dove va]
const strofina = t => 110 * Math.sin(TAU * (t - 26.8) / 1.6) * P(t, 26.8, 27.3) * (1 - P(t, 35.0, 35.6));
const alzaLana = t => -150 * P(t, 35.8, 36.6);
const lanaX = t => 330 + strofina(t), lanaY = t => 362 + alzaLana(t);   // angolo in alto a sinistra del panno (340 per 60 px)
const elettroneLana = (k, t) => [lanaX(t) + 30 + k * 56 + 24, lanaY(t) + 30];
function sceneStrofinio(ctx, t) {
  const al = life(t, 26.5, 45.7, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // la bacchetta, con le sue coppie
  blocco(ctx, ...ROD2, PLASTICA());
  COPPIE_ROD.forEach(x => { piu(ctx, [x, YR2]); meno(ctx, [x + 30, YR2]); });
  txt(ctx, 'plastica', ROD2[0] + ROD2[2] + 20, YR2, { size: 32, color: C.dim, align: 'left' });
  // il panno, con le sue coppie (gli elettroni 1, 3, 5 passano alla plastica)
  const lx = lanaX(t), ly = lanaY(t);
  lanaTrama(ctx, lx, ly, 340, 60, 1);
  for (let k = 0; k < 6; k++) {
    piu(ctx, [lx + 30 + k * 56, ly + 30], 1, 10);
    const pass = PASSAGGI.find(q => q[1] === k);
    if (!pass) { meno(ctx, elettroneLana(k, t), 1, 8); continue; }
    const [tp, , xd] = pass, s = P(t, tp, tp + .5);
    if (s <= 0) meno(ctx, elettroneLana(k, t), 1, 8);
    else { const a = elettroneLana(k, tp), b = [xd, YR2]; meno(ctx, [lerp(a[0], b[0], s), lerp(a[1], b[1], s)], 1, lerp(8, 9, s)); }
  }
  txt(ctx, 'lana', lx - 20, ly + 30, { size: 32, color: C.dim, align: 'right', alpha: P(t, 26.6, 27.0) });
  // i bilanci, sotto
  const kb = P(t, 36.0, 36.5);
  if (kb > 0) {
    fondo(ctx, 500, 560, 620, 50, kb); drawRich(ctx, '{dim:plastica:} 3 {dim:segni} {x:−} {dim:in più →} {x:negativa}', 500, 560, { size: 32, alpha: kb });
    fondo(ctx, 500, 172, 620, 50, kb); drawRich(ctx, '{dim:lana:} 3 {dim:segni} {x:−} {dim:in meno →} {v:positiva}', 500, 172, { size: 32, alpha: kb });
  }
  ctx.restore();
}

// 3 · il contatto (45,6–64,5): la pallina appesa, integrata (pendolo di 0,3 m, in tempo vero)
const PV = [600, 150], LF = 330, RBALL = 30, YB = PV[1] + LF;
const c01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const smooth = (t, a, b) => { const x = c01((t - a) / (b - a)); return x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2; };
const punta3 = t => lerp(150, PV[0] - RBALL, smooth(t, 45.9, 47.4)) - (PV[0] - RBALL - 150) * smooth(t, 59.6, 60.8);
const lana3 = t => lerp(1250, 900, smooth(t, 60.4, 62.4));
const qPallina = t => -2 * smooth(t, 50.6, 51.5), qBacchetta = t => -3 + 2 * smooth(t, 50.6, 51.5);
const T0_PEND = 45.0, T1_PEND = 65.0;
const PENDOLO = (() => {
  const G = 9.8 * LF / 0.3, GAM = 1.6, KC = 1e8, dt = 1 / 1200, out = [];
  let th = 0, w = 0;
  for (let k = 0; T0_PEND + k * dt <= T1_PEND + .01; k++) {
    const t = T0_PEND + k * dt;
    if (k % 10 === 0) out.push(th);                       // un valore ogni 1/120 s
    const p = [PV[0] + LF * Math.sin(th), PV[1] + LF * Math.cos(th)];
    let ax = 0, ay = 0;
    for (const [src, q] of [[[punta3(t) - 22, YB], qBacchetta(t)], [[lana3(t) + 30, YB], 3]]) {   // forze ∝ q·q'/d², lungo la congiungente
      const dx = p[0] - src[0], dy = p[1] - src[1], d = Math.hypot(dx, dy), f = KC * qPallina(t) * q / (d * d * d);
      ax += f * dx; ay += f * dy;
    }
    w += ((-G * Math.sin(th) + ax * Math.cos(th) - ay * Math.sin(th)) / LF - GAM * w) * dt; th += w * dt;
    const xmin = punta3(t) + RBALL;   // la pallina non entra nella bacchetta
    if (PV[0] + LF * Math.sin(th) < xmin) { th = Math.asin(clamp((xmin - PV[0]) / LF, -1, 1)); if (w < 0) w = 0; }
  }
  return out;
})();
function angoloPendolo(t) { const u = clamp((t - T0_PEND) * 120, 0, PENDOLO.length - 1), i = Math.floor(u), j = Math.min(PENDOLO.length - 1, i + 1); return lerp(PENDOLO[i], PENDOLO[j], u - i); }
function bacchetta(ctx, tip, y, extra, al = 1, lung = 520) {   // bacchetta orizzontale con la punta a destra; extra = elettroni in più vicino alla punta
  blocco(ctx, tip - lung, y - 22, lung, 44, PLASTICA(), al);
  for (let x = tip - 160; x > tip - lung; x -= 100) { piu(ctx, [x, y], al, 10); meno(ctx, [x + 26, y], al, 8); }
  extra.forEach(([x, a]) => meno(ctx, [tip - x, y], al * a, 8));
}
function sceneContatto(ctx, t) {
  const al = life(t, 45.7, 64.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // il sostegno e il filo
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(PV[0] - 110, PV[1]); ctx.lineTo(PV[0] + 110, PV[1]); ctx.stroke(); ctx.restore();
  const th = angoloPendolo(t), pb = [PV[0] + LF * Math.sin(th), PV[1] + LF * Math.cos(th)];
  ctx.save(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PV[0], PV[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke(); ctx.restore();
  // la bacchetta: tre elettroni in più vicino alla punta; due passano alla pallina
  const tip = punta3(t), s = P(t, 50.6, 51.5);
  bacchetta(ctx, tip, YB, [[20, 1 - s], [52, 1 - s], [84, 1]]);
  // la pallina di metallo, e i due elettroni che arrivano e si dispongono in superficie
  ctx.save(); const g = ctx.createRadialGradient(pb[0] - 9, pb[1] - 10, 3, pb[0], pb[1], RBALL);
  g.addColorStop(0, css(mix(METALLO(), C.paper, .55))); g.addColorStop(1, css(METALLO()));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pb[0], pb[1], RBALL, 0, TAU); ctx.fill(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  if (s > 0) [[20, -50], [52, 50]].forEach(([x, ang]) => {
    const a = [tip - x, YB], b = [pb[0] + 17 * Math.cos(ang * Math.PI / 180), pb[1] + 17 * Math.sin(ang * Math.PI / 180)];
    meno(ctx, [lerp(a[0], b[0], s), lerp(a[1], b[1], s)], 1, 8);
  });
  // la lana, positiva: tre elettroni in meno
  const xl = lana3(t);
  if (xl < 1110) {
    lanaTrama(ctx, xl, YB - 40, 150, 80, 1);
    for (let k = 0; k < 3; k++) { piu(ctx, [xl + 26 + k * 45, YB - 15], 1, 10); meno(ctx, [xl + 48 + k * 45, YB - 15], 1, 8); }   // tre coppie
    for (let k = 0; k < 3; k++) piu(ctx, [xl + 26 + k * 45, YB + 18], 1, 10);                                                    // tre positive scoperte
  }
  ctx.restore();
}

// 4 · l'induzione (64,5–83,5) e la carta (83,5–93)
const SC = [650, 420], RS = 125, YR4 = 420;
const punta4 = t => lerp(140, SC[0] - RS - 75, smooth(t, 64.8, 66.4));
const ANG_P = Array.from({ length: 8 }, (_, k) => (k * 45 + 22.5) * Math.PI / 180);
// gli elettroni liberi: da accanto ai loro nuclei a tutti sulla metà lontana dalla bacchetta
const DA = ANG_P, A_FIN = [12, 56, 78, 34, 326, 282, 304, 348].map(g => g * Math.PI / 180);   // stesso ordine di ANG_P
const indotta = t => smooth(t, 69.4, 71.0);
function sceneInduzione(ctx, t) {
  const al = life(t, 64.6, 83.6, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // il sostegno isolante
  blocco(ctx, SC[0] - 12, SC[1] + RS - 4, 24, 700 - SC[1] - RS + 4, LANA(), 1, 4);
  blocco(ctx, SC[0] - 80, 700, 160, 22, LANA(), 1, 8);
  txt(ctx, 'sostegno isolante', SC[0] + 30, 650, { size: 30, color: C.dim, align: 'left' });
  // la sfera di metallo
  ctx.save(); const g = ctx.createRadialGradient(SC[0] - RS * .35, SC[1] - RS * .4, RS * .1, SC[0], SC[1], RS);
  g.addColorStop(0, css(mix(METALLO(), C.paper, .6))); g.addColorStop(1, css(METALLO()));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(SC[0], SC[1], RS, 0, TAU); ctx.fill(); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  const s = indotta(t);
  ANG_P.forEach((a, k) => {
    piu(ctx, [SC[0] + 62 * Math.cos(a), SC[1] + 62 * Math.sin(a)], 1, 11);
    const a1 = lerp(DA[k], A_FIN[k], s), r1 = lerp(92, 104, s);
    meno(ctx, [SC[0] + r1 * Math.cos(a1), SC[1] + r1 * Math.sin(a1)], 1, 9);
  });
  if (t > 69.2 && t < 71.4) { fondo(ctx, 980, 150, 230, 44, life(t, 69.2, 71.4, .2, .3)); txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, 69.2, 71.4, .2, .3) }); }
  // la bacchetta, ricaricata
  const tip = punta4(t);
  bacchetta(ctx, tip, YR4, [[20, 1], [52, 1], [84, 1]]);
  // le due forze sulla sfera, ∝ 1/d² dalla carica in più della bacchetta: le positive vicine attirano più di quanto le negative lontane respingono
  const kF = life(t, 74.1, 83.5, .4, .4);
  if (kF > 0) {
    const src = tip - 52, xv = SC[0] + 62 * Math.cos(ANG_P[3]), xl = SC[0] + 104 * Math.cos(A_FIN[0]);   // baricentri: positive scoperte a sinistra, negative a destra
    const L1 = 120, L2 = L1 * ((xv - src) / (xl - src)) ** 2;
    freccia(ctx, [SC[0] - 30, SC[1] - RS - 34], [SC[0] - 30 - L1, SC[1] - RS - 34], C.y, kF, 6);
    freccia(ctx, [SC[0] + 30, SC[1] - RS - 34], [SC[0] + 30 + L2, SC[1] - RS - 34], C.y, kF, 6);
    txt(ctx, 'attrazione', SC[0] - 30 - L1 / 2, SC[1] - RS - 72, { size: 30, color: C.y, alpha: kF });
    txt(ctx, 'repulsione', SC[0] + 30 + Math.max(L2, 60) / 2 + 40, SC[1] - RS - 72, { size: 30, color: C.y, alpha: kF });
  }
  ctx.restore();
}

// la carta: polarizzata, salta sulla bacchetta (y'' = A/d³ − g, tempo vero 0,2 s mostrato in 2 s)
const T_CARTA = 88.6, LENTO = 10, PXM = 15000, GC = 9.8 * PXM, Y_TAV = 650, HB = 6;
const fondoBac = tau => 300 + 80 * smooth(tau, 0, .1);           // il fondo della bacchetta scende da 300 a 380 px
const PEZZI = [[420, .9], [540, 1.12], [660, 1]].map(([x, k]) => {
  const A = k * GC * 300 ** 3, ys = [];
  let y = Y_TAV, v = 0, su = false;
  for (let i = 0; i <= 2000; i++) {
    const tau = i * 1e-4;
    if (i % 10 === 0) ys.push(y);                                   // un valore ogni millesimo di secondo
    const d = y - HB - fondoBac(tau);
    if (d <= 0) { y = fondoBac(tau) + HB; v = 0; continue; }         // attaccato alla bacchetta
    const a = A / d ** 3 - GC;
    if (!su && a <= 0) continue;                                    // fermo sul tavolo finché la forza non vince il peso
    su = true; v += a * 1e-4; y -= v * 1e-4;
  }
  return { x, ys };
});
function yPezzo(p, t) { const u = clamp((t - T_CARTA) / LENTO * 1000, 0, p.ys.length - 1), i = Math.floor(u), j = Math.min(p.ys.length - 1, i + 1); return lerp(p.ys[i], p.ys[j], u - i); }
function sceneCarta(ctx, t) {
  const al = life(t, 83.5, T_FINE + .1, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.beginPath(); ctx.rect(CARTA[0] + 4, CARTA[1] + 4, CARTA[2] - 8, CARTA[3] - 8); ctx.clip();
  // il tavolo
  ctx.fillStyle = css(mix(C.y, C.paper, .8)); ctx.fillRect(110, Y_TAV + HB, 1000, 140);
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(110, Y_TAV + HB); ctx.lineTo(1110, Y_TAV + HB); ctx.stroke();
  // la bacchetta (la penna) scende da sopra
  const yb = (t < T_CARTA ? lerp(130, 300, smooth(t, 83.7, 84.7)) : fondoBac((t - T_CARTA) / LENTO)) - 22;
  ctx.save(); ctx.translate(0, 0);
  blocco(ctx, 200, yb - 22, 600, 44, PLASTICA());
  for (let x = 240; x < 780; x += 100) { piu(ctx, [x, yb], 1, 10); meno(ctx, [x + 26, yb], 1, 8); }
  [340, 540, 740].forEach(x => meno(ctx, [x - 37, yb], 1, 8));   // i tre elettroni in più, fra una coppia e l'altra
  ctx.restore();
  // i pezzetti: ogni molecola si polarizza, il + verso la bacchetta negativa
  const kp = P(t, 84.4, 85.2);
  PEZZI.forEach(p => {
    const y = yPezzo(p, t);
    blocco(ctx, p.x - 40, y - HB, 80, 2 * HB, C.paper, 1, 3);
    if (kp > 0) for (let i = 0; i < 4; i++) {
      const x = p.x - 30 + i * 20;
      ctx.save(); ctx.globalAlpha *= kp; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.strokeStyle = css(C.v); ctx.beginPath(); ctx.moveTo(x - 4, y - HB - 7); ctx.lineTo(x + 4, y - HB - 7); ctx.moveTo(x, y - HB - 11); ctx.lineTo(x, y - HB - 3); ctx.stroke();
      ctx.strokeStyle = css(C.x); ctx.beginPath(); ctx.moveTo(x - 4, y + HB + 7); ctx.lineTo(x + 4, y + HB + 7); ctx.stroke();
      ctx.restore();
    }
  });
  txt(ctx, 'pezzetti di carta', 540, Y_TAV + 60, { size: 30, color: C.dim, alpha: P(t, 83.8, 84.3) });
  if (t > T_CARTA - .2 && t < T_CARTA + 2.4) { fondo(ctx, 980, 150, 230, 44, life(t, T_CARTA - .2, T_CARTA + 2.4, .2, .3)); txt(ctx, 'al rallentatore', 1085, 150, { size: 30, color: C.dim, align: 'right', alpha: life(t, T_CARTA - .2, T_CARTA + 2.4, .2, .3) }); }
  ctx.restore();
}

function scenePannello(ctx, t) {
  const cx = 1480;
  const parte = (a, b, fn) => { const k = life(t, a, b, .5, .5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; fn(); ctx.restore(); };
  parte(7.9, 26.6, () => {
    conFont(TITOLI, () => drawRich(ctx, 'la carica elettrica', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{v:protone:} +{mink:e}   {x:elettrone:} −{mink:e}', cx, 240, { size: 36, local: t - 8.1 });
    drawRich(ctx, '{mink:e} ≈ 1,6·10{mink:⁻¹⁹} C', cx, 320, { size: 46, local: t - 12.4 });
    drawRich(ctx, '{dim:C: coulomb, unità di carica}', cx, 375, { size: 30, local: t - 12.8 });
    drawRich(ctx, '{dim:ogni carica è} {mink:n}·{mink:e}{dim:,} {mink:n} {dim:intero}', cx, 460, { size: 34, local: t - 17.6 });
    drawRich(ctx, '{dim:mai mezza} {mink:e}', cx, 508, { size: 30, local: t - 17.9 });
    drawRich(ctx, '{dim:15 protoni e 15 elettroni:}', cx, 595, { size: 34, local: t - 22.2 });
    drawRich(ctx, '{dim:carica} 15{mink:e} − 15{mink:e} = {g:0}{dim:, neutro}', cx, 645, { size: 34, local: t - 22.4 });
  });
  parte(26.5, 45.7, () => {
    conFont(TITOLI, () => drawRich(ctx, 'strofinio', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:passano solo} {x:elettroni}', cx, 240, { size: 36, local: t - 31.0 });
    drawRich(ctx, '{dim:i nuclei restano fermi}', cx, 288, { size: 32, local: t - 31.3 });
    drawRich(ctx, '{dim:plastica:} −3 {dim:→} {x:negativa}', cx, 375, { size: 36, local: t - 35.9 });
    drawRich(ctx, '{dim:lana:} +3 {dim:→} {v:positiva}', cx, 428, { size: 36, local: t - 36.2 });
    drawRich(ctx, '{dim:totale:} −3 + 3 = {g:0}', cx, 515, { size: 40, local: t - 40.9 });
    drawRich(ctx, '{g:la carica si conserva}', cx, 568, { size: 36, local: t - 41.2 });
    drawRich(ctx, '{dim:ogni segno: miliardi di elettroni}', cx, 720, { size: 30, local: t - 31.0 });
  });
  parte(45.7, 64.6, () => {
    conFont(TITOLI, () => drawRich(ctx, 'contatto', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:la bacchetta carica cede}', cx, 240, { size: 34, local: t - 50.4 });
    drawRich(ctx, '{dim:una parte dei suoi elettroni}', cx, 285, { size: 34, local: t - 50.6 });
    drawRich(ctx, '{dim:stesso segno:} {g:si respingono}', cx, 375, { size: 36, local: t - 55.3 });
    drawRich(ctx, '{dim:segni opposti:} {g:si attraggono}', cx, 430, { size: 36, local: t - 59.6 });
    drawRich(ctx, '{dim:ogni segno: miliardi di elettroni}', cx, 720, { size: 30, local: t - 45.9 });
  });
  parte(64.6, T_FINE + .1, () => {
    conFont(TITOLI, () => drawRich(ctx, 'induzione', cx, 170, { size: 40, weight: 600 }));
    drawRich(ctx, '{dim:senza toccare}', cx, 235, { size: 34, local: t - 64.6 });
    drawRich(ctx, '{x:−} {dim:liberi, respinti lontano}', cx, 300, { size: 34, local: t - 69.3 });
    drawRich(ctx, '{v:+} {dim:vicine: attrazione più forte}', cx, 352, { size: 34, local: t - 74.0 });
    drawRich(ctx, '{dim:la sfera resta neutra}', cx, 404, { size: 34, local: t - 78.8 });
    drawRich(ctx, '{dim:isolante: si} {g:polarizza}', cx, 500, { size: 36, local: t - 83.6 });
    drawRich(ctx, '{dim:in ogni molecola} {v:+} {dim:verso la bacchetta}', cx, 550, { size: 30, local: t - 84.0 });
    drawRich(ctx, '{g:e la carta salta su}', cx, 630, { size: 36, local: t - 88.6 });
    drawRich(ctx, '{dim:ogni segno: miliardi di elettroni}', cx, 720, { size: 30, local: t - 64.8 });
  });
}

// in una frase (93,4–104,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.8, 103.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Strofinando o toccando si carica un corpo;\navvicinando, le sue cariche si separano.', W / 2, 290, { size: 70, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[450, 'strofinio:\npassano {x:elettroni}'], [960, 'contatto:\nsi cede carica'], [1470, 'induzione: le cariche\nsi separano, resta {g:neutro}']];
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
    ['soffio', 1.6], ['soffio', 7.6],                                                 // il titolo, le schede
    ['pop', 8.0, .4], ['pop', 8.3, .55], ['pop', 8.6, .7],                            // gli atomi
    ['pop', 12.4, .6], ['pop', 17.6, .5], ['ding', 22.4],                             // e ≈ 1,6·10⁻¹⁹ C, n·e, neutro
    ['soffio', 26.5], ['tono', 27.3, 28.9, [.5, .75, .5, .25, .5]],                   // lo strofinio (un passaggio del panno)
    ['tono', 31.3, 31.8, [.6, .35]], ['tono', 32.5, 33.0, [.6, .35]], ['tono', 33.7, 34.2, [.6, .35]],   // tre elettroni alla plastica
    ['pop', 36.0, .5], ['ding', 40.9],                                                // i bilanci; −3 + 3 = 0
    ['soffio', 45.7], ['tono', 45.9, 47.4, [.3, .33, .5, .67, .7]],                   // il contatto: arriva la bacchetta
    ['pop', 50.6, .3],                                                                // passano due elettroni
    ['tono', 50.75, 53.0, [.31, .58, .79, .63, .58, .71, .66, .6, .67, .66]],         // la pallina viene respinta
    ['pop', 55.3, .5],                                                                // stesso segno: si respingono
    ['tono', 59.75, 62.5, [.64, .62, .52, .39, .37, .45, .5, .53, .71, .75, .8, .71]],   // via la bacchetta, arriva la lana
    ['pop', 62.4, .6],                                                                // segni opposti: si attraggono
    ['soffio', 64.6], ['tono', 64.8, 66.4, [.3, .33, .5, .67, .7]],                   // l'induzione: arriva la bacchetta
    ['tono', 69.4, 71.0, [.4, .45, .55, .6]],                                         // gli elettroni scappano lontano
    ['pop', 74.1, .5], ['ding', 78.8],                                                // attrazione più forte; resta neutra
    ['soffio', 83.5], ['tono', 83.7, 84.7, [.8, .77, .6, .43, .4]], ['pop', 84.4, .6],   // la penna sulla carta, si polarizza
    ['tono', 89.2, 89.8, [.2, .25, .45, .8]], ['pop', 89.75, .8],                     // la carta salta su
    ['soffio', 93.6], ['pop', 95.6, .5], ['pop', 96.1, .6], ['pop', 96.6, .7],        // in una frase
  ];
  return {
    titolo: 'Strofinare, toccare, avvicinare', durata: 104.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.3, 'la carica elettrica'], [26.3, 45.5, 'strofinio'], [45.5, 64.4, 'contatto'], [64.4, T_FINE, 'induzione']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneSchede(ctx, t); sceneAtomi(ctx, t); sceneStrofinio(ctx, t); sceneContatto(ctx, t); sceneInduzione(ctx, t); sceneCarta(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
