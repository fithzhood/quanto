'use strict';
/* Il peso dell'aria — l'esperimento di Torricelli: il mercurio si ferma a 76 cm, sopra c'è il vuoto, l'aria preme. Argomento: fluidi. */
CVIDEO.registra('fluidi/torricelli', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, richW, txt, dashed, dot, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [66.4, 190], [67.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [66.4, 1050], [67.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [66.4, 2.2], [67.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [66.4, 2], [67.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [66.4, -1.5], [67.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [19.8, 'sorpreso'], [23.0, 'neutro'],
  [30.7, 'pensa'], [34.4, 'neutro'], [53.2, 'felice'], [57.0, 'sorpreso'], [61.7, 'neutro'], [68.6, 'felice'], [72.6, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'L’aria pesa? E quanto preme\nsu di noi?'],
  [7.9, 11.9, 'Un tubo di vetro lungo un metro,\npieno di {x:mercurio}.'],
  [12.1, 16.35, 'Lo chiudo col dito, lo capovolgo\nin una bacinella di mercurio.'],
  [16.6, 19.6, 'Tolgo il dito: il mercurio scende…'],
  [19.8, 22.8, '…e si ferma a {g:76 cm}!'],
  [23.0, 26.4, 'È l’esperimento di {v:Torricelli}, nel 1644.'],
  [26.6, 30.5, 'Sopra la colonna non c’è aria:\nc’è il {v:vuoto}.'],
  [30.7, 34.2, 'Lo tiene su il vuoto,\nche lo {r:risucchia}?'],
  [34.4, 38.65, '{r:No}: il vuoto non tira. È l’{y:aria}\nche preme sulla bacinella.'],
  [38.9, 43.4, 'Alla base della colonna la pressione\nè uguale a quella dell’aria fuori.'],
  [43.6, 48.85, 'Per Stevino: {mink:d·g·}{mx:h} = 13 600 · 9,8 · 0,76\n≈ 101 300 Pa: {g:un’atmosfera}.'],
  [49.1, 53.0, 'Inclino il tubo: il mercurio\nsale lungo il tubo…'],
  [53.2, 56.6, '…ma l’altezza in verticale\nresta {g:76 cm}.'],
  [57.0, 61.5, 'Con l’acqua, più leggera,\nservirebbe un tubo di {x:oltre 10 m}!'],
  [61.7, 66.2, 'Su ogni m² l’aria preme con\nil peso di circa {y:10 tonnellate}.'],
  [68.6, 74.4, 'L’aria preme su tutto: regge 76 cm\ndi mercurio, o 10,3 m d’acqua.'],
];

// ---------- aiutanti ----------
const KM = 500;                       // 1 m = 500 px
const TX = 580, PELO = 660, FONDO_T = 685, TUBO = 500, LARGO = 36;   // il tubo: lungo 1 m, la bocca 5 cm sotto il pelo
const BAC = { x0: 330, x1: 830, y0: 600, y1: 740 };
const mercurio = () => css(mix(C.dim, C.ink, .2), .9);
function freccia(ctx, a, b, col, w = 7, al = 1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4 || al <= 0) return;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), sc = Math.min(w / 5.5, L / 26);
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - Math.cos(ang) * 12 * sc, b[1] - Math.sin(ang) * 12 * sc); ctx.stroke();
  arrowHead(ctx, b, ang, col, sc);
  ctx.restore();
}
function riga(ctx, nome, val, y, col, al, x0 = 1240, x1 = 1770, size = 38) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right' });
  ctx.restore();
}
// la colonna dopo che si toglie il dito: H'' = g·(Heq − H)/H − γ·H' (la massa che si muove è la colonna stessa,
// lo smorzamento è l'attrito nel tubo stretto). H in metri sopra il pelo della bacinella.
const T_VIA = 16.9, HEQ = .76, H0 = .95, DT = 1 / 600;
const COLONNA = (() => {
  const out = []; let h = H0, v = 0;
  for (let k = 0; k < 8 / DT; k++) { out.push(h); const a = 9.8 * (HEQ - h) / h - 3 * v; v += a * DT; h += v * DT; }
  return out;
})();
const altezza = t => { if (t <= T_VIA) return H0; const i = (t - T_VIA) / DT, k = Math.floor(i); if (k >= COLONNA.length - 1) return COLONNA[COLONNA.length - 1]; return lerp(COLONNA[k], COLONNA[k + 1], i - k); };
const inclina = t => 30 * Math.PI / 180 * P(t, 49.4, 51.4);   // piano piano: a ogni istante è in equilibrio

// il tubo disegnato nel suo sistema: origine nella bocca, asse verso l'alto (y negativa); pieno di mercurio da 0 a lm (px)
function tubo(ctx, lm) {
  const sagoma = () => { ctx.beginPath(); ctx.moveTo(-LARGO / 2, 0); ctx.lineTo(-LARGO / 2, -TUBO + LARGO / 2); ctx.arc(0, -TUBO + LARGO / 2, LARGO / 2, Math.PI, 0); ctx.lineTo(LARGO / 2, 0); };
  ctx.save(); sagoma(); ctx.closePath(); ctx.clip();
  ctx.fillStyle = mercurio(); ctx.fillRect(-LARGO / 2, -lm, LARGO, lm);
  ctx.restore();
  ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 3;
  sagoma(); ctx.stroke();
  ctx.strokeStyle = css(C.paper, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-LARGO / 2 + 8, -20); ctx.lineTo(-LARGO / 2 + 8, -TUBO + 40); ctx.stroke();
}

// 0 · titolo (0–7.5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Il peso dell’aria', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · l'esperimento (7.5–66.6)
function sceneTubo(ctx, t) {
  if (t < 7.5 || t > 66.8) return;
  const al = life(t, 7.6, 66.6, .7, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680);
  // la bacinella: compare quando serve
  const kb = P(t, 11.9, 12.5);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb;
    ctx.fillStyle = mercurio(); ctx.fillRect(BAC.x0, PELO, BAC.x1 - BAC.x0, BAC.y1 - PELO);
    ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(BAC.x0, BAC.y0); ctx.lineTo(BAC.x0, BAC.y1); ctx.lineTo(BAC.x1, BAC.y1); ctx.lineTo(BAC.x1, BAC.y0); ctx.stroke();
    ctx.restore();
  }
  // il tubo: prima diritto con la bocca in alto, poi capovolto (12,8–14,6), poi calato nella bacinella (14,8–15,8)
  const giro = Math.PI * P(t, 12.8, 14.6), cy = lerp(380, (FONDO_T + FONDO_T - TUBO) / 2, P(t, 14.8, 15.8));
  const H = altezza(t), fi = inclina(t);
  ctx.save();
  if (t < 15.9) {
    // bocca in alto ruotata di «giro»: il sistema del tubo ha la bocca nell'origine
    ctx.translate(TX, cy); ctx.rotate(giro + Math.PI); ctx.translate(0, TUBO / 2);
    tubo(ctx, TUBO);
  } else {
    ctx.translate(TX, FONDO_T); ctx.rotate(fi);
    const lm = (FONDO_T - PELO + H * KM) / Math.cos(fi);   // la colonna arriva sempre all'altezza H sopra il pelo
    tubo(ctx, Math.min(lm, TUBO));
  }
  // il dito che chiude la bocca, finché non lo tolgo
  const kd = P(t, 12.2, 12.6) * (1 - P(t, T_VIA, T_VIA + .4));
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.translate(0, 8 + 40 * (1 - kd));
    ctx.fillStyle = css(mix(C.y, C.paper, .55)); ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-26, -6, 52, 30, 12); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // il mercurio della bacinella sopra la bocca del tubo (la bocca sta sotto il pelo)
  if (t >= 15.3 && kb > 0) {
    ctx.strokeStyle = css(mix(C.dim, C.ink, .45)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(BAC.x0, PELO); ctx.lineTo(BAC.x1, PELO); ctx.stroke();
  }
  const ytop = PELO - H * KM;   // la cima della colonna (tubo diritto)
  // l'altezza della colonna: 76 cm
  const kh = life(t, 20.0, 49.2, .4, .4);
  if (kh > 0 && fi === 0) {
    ctx.save(); ctx.globalAlpha *= kh; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    const xq = TX + 70;
    ctx.beginPath(); ctx.moveTo(xq, PELO - 3); ctx.lineTo(xq, ytop + 3); ctx.moveTo(xq - 12, PELO); ctx.lineTo(xq + 12, PELO); ctx.moveTo(xq - 12, ytop); ctx.lineTo(xq + 12, ytop); ctx.stroke();
    drawRich(ctx, t > 43.8 ? '{mx:h} = {g:76 cm}' : '{g:76 cm}', xq + 24, (PELO + ytop) / 2, { size: 40, align: 'left' });
    ctx.restore();
  }
  // il vuoto sopra la colonna
  const kv = life(t, 26.8, 49.2, .4, .4);
  if (kv > 0 && fi === 0) {
    ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
    const xq = TX - 40, y0 = FONDO_T - TUBO + 4;
    ctx.beginPath(); ctx.moveTo(xq, y0); ctx.lineTo(xq, ytop); ctx.moveTo(xq - 10, y0); ctx.lineTo(xq + 4, y0); ctx.moveTo(xq - 10, ytop); ctx.lineTo(xq + 4, ytop); ctx.stroke();
    drawRich(ctx, '{v:vuoto}', xq - 16, (y0 + ytop) / 2, { size: 38, align: 'right' });
    ctx.restore();
  }
  // l'idea sbagliata: il vuoto che risucchia
  const kr = life(t, 30.9, 38.8, .4, .5);
  if (kr > 0) {
    ctx.save(); ctx.globalAlpha *= kr;
    drawRich(ctx, '{r:il vuoto lo risucchia?}', TX - 60, 150, { size: 34, align: 'right' });
    const kx = P(t, 34.6, 35.2), lw = richW(ctx, 'il vuoto lo risucchia?', 34);
    if (kx > 0) { ctx.strokeStyle = css(C.r); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(TX - 60 - lw, 152); ctx.lineTo(TX - 60 - lw + lw * kx, 152); ctx.stroke(); }
    ctx.restore();
  }
  // l'aria che preme sulla bacinella
  const ka = life(t, 34.8, 49.2, .4, .4);
  if (ka > 0) {
    for (const x of [380, 460, 700, 780]) freccia(ctx, [x, PELO - 80], [x, PELO - 4], C.y, 6, ka);
    txt(ctx, 'aria', 420, PELO - 104, { size: 30, color: C.y, alpha: ka });
  }
  // alla stessa quota, dentro e fuori, la stessa pressione
  const kp = life(t, 39.1, 49.2, .4, .4);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp;
    // alla quota del pelo libero: dentro il tubo, alla base della colonna, e fuori, dove preme l'aria
    dot(ctx, [TX, PELO], C.v, 1, 10); dot(ctx, [740, PELO], C.v, 1, 10);
    for (const x of [TX + 26, 766]) {
      ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x, PELO + 10, 36, 40, 10); ctx.fill();
      drawRich(ctx, '{mv:p}', x + 18, PELO + 28, { size: 36 });
    }
    ctx.restore();
  }
  // il tubo inclinato: in verticale sempre 76 cm
  const ki = life(t, 53.3, 66.6, .4, .6);
  if (ki > 0) {
    const y76 = PELO - HEQ * KM;
    dashed(ctx, [TX - 80, y76], [1000, y76], C.g, 1, ki);
    ctx.save(); ctx.globalAlpha *= ki; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1000, PELO - 3); ctx.lineTo(1000, y76 + 3); ctx.moveTo(988, PELO); ctx.lineTo(1012, PELO); ctx.moveTo(988, y76); ctx.lineTo(1012, y76); ctx.stroke();
    drawRich(ctx, '{g:76 cm}', 1020, (PELO + y76) / 2, { size: 40, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// la scheda a destra: i conti (43,6–56,8), mercurio contro acqua (57–61,6), un metro quadrato (61,7–66,4)
function sceneScheda(ctx, t) {
  if (t < 43.2 || t > 66.8) return;
  const al = life(t, 43.4, 66.6, .6, .6);
  card(ctx, 1200, 110, 610, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const k1 = life(t, 43.4, 56.9, .5, .4);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    conFont(TITOLI, () => drawRich(ctx, 'Torricelli, 1644', 1505, 175, { size: 40, weight: 600 }));
    const kc = P(t, 43.8, 44.3);
    riga(ctx, '{mink:d}{dim: (mercurio)}', '13 600 kg/m³', 270, C.ink, kc, 1240, 1770, 34);
    riga(ctx, '{mink:g}', '9,8 m/s²', 330, C.ink, kc);
    riga(ctx, '{mx:h}', '0,76 m', 390, C.ink, kc);
    if (kc > 0) { ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1240, 435); ctx.lineTo(1770, 435); ctx.stroke(); ctx.restore(); }
    riga(ctx, '{mink:d·g·}{mx:h}', '{g:≈ 101 300 Pa}', 485, C.g, P(t, 45.0, 45.5), 1240, 1770, 40);
    riga(ctx, '1 atm', '= 101 325 Pa', 555, C.ink, P(t, 46.6, 47.1));
    ctx.restore();
  }
  // la stessa pressione regge 76 cm di mercurio o 10,3 m d'acqua (50 px per metro)
  const k2 = life(t, 57.1, 61.7, .5, .4);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    const yb = 690, hm = .76 * 50, ha = 101325 / (1000 * 9.8) * 50 * P(t, 57.3, 59.0);
    ctx.fillStyle = mercurio(); ctx.fillRect(1360, yb - hm, 44, hm);
    ctx.fillStyle = css(C.x, .45); ctx.fillRect(1620, yb - ha, 44, ha);
    ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2; ctx.strokeRect(1360, yb - hm, 44, hm); ctx.strokeRect(1620, yb - ha, 44, ha);
    txt(ctx, 'mercurio', 1382, 728, { size: 30 }); txt(ctx, '76 cm', 1382, 764, { size: 30, weight: 600, color: C.g });
    txt(ctx, 'acqua', 1642, 728, { size: 30 }); txt(ctx, '≈ 10,3 m', 1642, 764, { size: 30, weight: 600, color: C.x });
    ctx.restore();
  }
  // su un metro quadrato
  const k3 = life(t, 61.8, 66.6, .5, .6);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    ctx.fillStyle = css(C.x, .15); ctx.strokeStyle = css(C.x); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1330, 640); ctx.lineTo(1610, 640); ctx.lineTo(1700, 560); ctx.lineTo(1420, 560); ctx.closePath(); ctx.fill(); ctx.stroke();
    txt(ctx, '1 m²', 1515, 676, { size: 32, color: C.x });
    freccia(ctx, [1515, 220], [1515, 596], C.y, 12);
    drawRich(ctx, '{y:≈ 101 000 N}', 1545, 360, { size: 40, align: 'left' });
    drawRich(ctx, '{dim:il peso di}\n{dim:≈ 10 t}', 1545, 450, { size: 30, align: 'left' });
    ctx.restore();
  }
  ctx.restore();
}

// 2 · in una frase (66.6–77)
function sceneFine(ctx, t) {
  if (t < 66.6) return;
  const al = 1 - P(t, 75.4, 76.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 66.8 });
    drawRich(ctx, 'L’aria pesa: la sua pressione\nregge {g:76 cm} di mercurio.', W / 2, 290, { size: 70, weight: 600, local: t - 67.2, stagger: .09 });
  });
  const pills = [[490, '1 atm = 101 325 Pa'], [960, 'sopra la colonna:\nil {v:vuoto}, non aria'], [1430, 'con l’acqua:\n{x:≈ 10,3 m}']];
  pills.forEach(([x, s], i) => {
    const a = 68.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza della colonna di mercurio (moto vero da altezza():
  // scende da 95 cm, oscilla e si ferma a 76 cm), poi la colonna che si allunga nel tubo inclinato e quella d'acqua
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 7.9, .5],                                                // il tubo pieno di mercurio
    ['pop', 11.9, .4], ['pop', 12.2, .55],                                            // la bacinella, il dito
    ['tono', 14.8, 15.8, [.6, .3]], ['pop', 15.3, .25],                               // capovolto, lo calo nella bacinella
    ['pop', 16.9, .45], ['tono', 16.9, 18.9, [.725, .655, .525, .422, .384, .397, .427, .448, .454]],   // tolgo il dito: scende
    ['traccia', 20.0, 20.4], ['ding', 20.2],                                          // si ferma a 76 cm
    ['traccia', 26.8, 27.2], ['pop', 26.9, .75],                                      // sopra c'è il vuoto
    ['pop', 30.9, .3], ['traccia', 34.6, 35.2], ['pop', 34.8, .6],                    // il vuoto risucchia? no: preme l'aria
    ['pop', 39.1, .45],                                                               // stessa quota, stessa pressione
    ['soffio', 43.4], ['pop', 43.8, .5], ['ding', 45.2], ['pop', 46.6, .45],          // d·g·h ≈ 101 300 Pa = 1 atm
    ['tono', 49.4, 51.4, [.4, .405, .47, .54, .55]],                                  // inclino: sale lungo il tubo
    ['traccia', 53.3, 53.8], ['ding', 53.5],                                          // in verticale resta 76 cm
    ['pop', 57.1, .4], ['tono', 57.3, 59.0, [.15, .2, .55, .9, .95]], ['pop', 59.0, .9],   // con l'acqua: oltre 10 m
    ['pop', 61.8, .7],                                                                // su 1 m²: ≈ 101 000 N, circa 10 t
    ['soffio', 66.8], ['pop', 68.8, .5], ['pop', 69.3, .6], ['pop', 69.8, .7],        // in una frase
  ];
  return {
    titolo: 'Il peso dell’aria', durata: 77, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.4, 'il tubo di Torricelli'], [26.4, 48.9, 'chi tiene su il mercurio'], [48.9, 66.4, '76 cm, sempre']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneTubo(ctx, t); sceneScheda(ctx, t); sceneFine(ctx, t); },
  };
});
