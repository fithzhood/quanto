'use strict';
/* Un metro cubo sono mille litri — equivalenze di aree e volumi: 1 m = 10 dm, quindi 1 m² = 10² dm² = 100 dm²
   e 1 m³ = 10³ dm³ = 1000 dm³; 1 dm³ = 1 L, 1 cm³ = 1 mL; un acquario da 60 litri. Argomento: misure. */
CVIDEO.registra('misure/aree-volumi', M => {
  const { W, C, E, P, life, lerp, css, TITOLI, conFont, drawRich, txt, card, crossMark } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [87.6, 190], [88.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [87.6, 1050], [88.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [87.6, 2.2], [88.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [87.6, 2], [88.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [87.6, -1.5], [88.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [15.5, 'pensa'], [19.3, 'neutro'],
  [22.9, 'felice'], [25.4, 'neutro'], [44.6, 'sorpreso'], [46.8, 'neutro'], [52.6, 'felice'], [54.8, 'neutro'],
  [59.8, 'festa'], [62.2, 'neutro'], [84.8, 'felice'], [87.6, 'neutro'], [90.0, 'felice'], [93.2, 'occhiolino'],
];
const FUMETTI = [
  [2.6, 6.5, 'Quanti litri d’acqua ci stanno\nin un metro cubo?'],
  [7.9, 11.0, 'Un metro è lungo {g:10} decimetri.'],
  [11.2, 15.3, 'Un quadretto di lato 1 dm\nè un {v:decimetro quadrato}.'],
  [15.5, 19.1, 'Un metro quadrato è fatto\nda {r:10} quadretti?'],
  [19.3, 22.7, '{r:No}: 10 quadretti fanno\nsolo una striscia.'],
  [22.9, 27.4, 'Le strisce sono 10:\n10 · 10 = {g:100} dm².'],
  [27.6, 32.5, 'Nelle aree il fattore 10\nva {v:al quadrato}: 10² = 100.'],
  [32.9, 37.3, 'Ora un metro cubo: sul fondo,\nuno strato di 100 cubetti.'],
  [37.5, 41.6, 'Ogni cubetto, di lato 1 dm,\nè un {v:decimetro cubo}.'],
  [41.8, 46.1, 'Gli strati sono 10:\n100 · 10 = {g:1000} dm³.'],
  [46.3, 52.2, 'Nei volumi il fattore va {v:al cubo}:\n10³ = 10 · 10 · 10 = 1000.'],
  [52.6, 56.5, 'In un decimetro cubo sta\nesattamente {g:1 litro} d’acqua.'],
  [56.7, 61.0, 'Riempio il metro cubo: 1000 dm³,\ncioè {g:1000 litri}!'],
  [61.2, 68.1, 'Con i centimetri: 1 dm = 10 cm,\nquindi 1 dm³ = {g:1000} cm³.'],
  [68.3, 72.8, '1 L = 1000 mL: un centimetro\ncubo è un {g:millilitro}.'],
  [73.2, 79.7, 'Un acquario: largo 50 cm,\nprofondo 40 cm, alto 30 cm.'],
  [79.9, 84.6, 'In decimetri: 5 · 4 · 3\n= {g:60} dm³.'],
  [84.8, 87.4, 'Cioè {g:60 litri} d’acqua.'],
  [90.0, 95.4, 'Aree: il fattore al quadrato.\nVolumi: al cubo. E 1 dm³ = 1 L.'],
];

// ---------- aiutanti ----------
// proiezione obliqua: i in larghezza, j in altezza, k in profondità (accorciata a metà, a 45°)
const proietta = (ox, oy, u) => { const d = u * .5 * Math.SQRT1_2; return (i, j, k) => [ox + i * u + k * d, oy - j * u - k * d]; };
function quad(ctx, pts, fill, stroke, w) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 2; ctx.stroke(); }
}
function linea(ctx, a, b, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
// un parallelepipedo da (i0, j0, k0) a (i1, j1, k1): le tre facce visibili, con la griglia a passo 1 se griglia > 0
function scatola(ctx, pr, i0, i1, j0, j1, k0, k1, col, al, griglia) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const fronte = [pr(i0, j0, k0), pr(i1, j0, k0), pr(i1, j1, k0), pr(i0, j1, k0)];
  const sopra = [pr(i0, j1, k0), pr(i1, j1, k0), pr(i1, j1, k1), pr(i0, j1, k1)];
  const lato = [pr(i1, j0, k0), pr(i1, j0, k1), pr(i1, j1, k1), pr(i1, j1, k0)];
  quad(ctx, fronte, css(col, .22)); quad(ctx, sopra, css(col, .34)); quad(ctx, lato, css(col, .14));
  if (griglia > 0) {
    const g = css(col, .55 * griglia);
    for (let i = Math.ceil(i0 + .01); i < i1; i++) { linea(ctx, pr(i, j0, k0), pr(i, j1, k0), g, 1.5); linea(ctx, pr(i, j1, k0), pr(i, j1, k1), g, 1.5); }
    for (let j = Math.ceil(j0 + .01); j < j1; j++) { linea(ctx, pr(i0, j, k0), pr(i1, j, k0), g, 1.5); linea(ctx, pr(i1, j, k0), pr(i1, j, k1), g, 1.5); }
    for (let k = Math.ceil(k0 + .01); k < k1; k++) { linea(ctx, pr(i0, j1, k), pr(i1, j1, k), g, 1.5); linea(ctx, pr(i1, j0, k), pr(i1, j1, k), g, 1.5); }
  }
  const s = css(col, .95);
  quad(ctx, fronte, null, s, 2.5); quad(ctx, sopra, null, s, 2.5); quad(ctx, lato, null, s, 2.5);
  ctx.restore();
}
// il contorno di un cubo di lato n: spigoli visibili pieni, i tre nascosti tratteggiati
function contorno(ctx, pr, n, m, l, col, al) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const c = css(col, .8);
  ctx.setLineDash([8, 8]);
  for (const [a, b] of [[[0, 0, l], [n, 0, l]], [[0, 0, l], [0, m, l]], [[0, 0, l], [0, 0, 0]]]) linea(ctx, pr(...a), pr(...b), c, 2);
  ctx.setLineDash([]);
  const S = [[[0, 0, 0], [n, 0, 0]], [[n, 0, 0], [n, m, 0]], [[n, m, 0], [0, m, 0]], [[0, m, 0], [0, 0, 0]], [[n, 0, 0], [n, 0, l]],
    [[n, m, 0], [n, m, l]], [[0, m, 0], [0, m, l]], [[n, 0, l], [n, m, l]], [[n, m, l], [0, m, l]]];
  for (const [a, b] of S) linea(ctx, pr(...a), pr(...b), c, 2.5);
  ctx.restore();
}
// una riga di testo della scheda di destra che entra quando tocca
function riga(ctx, t, ta, s, y, size, al = 1) {
  const k = P(t, ta, ta + .5, E.out) * al;
  if (k > 0) drawRich(ctx, s, 1470, y, { size: size || 42, alpha: k, local: t - ta });
}

// ---------- 0 · titolo (0–7.5) ----------
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Un metro cubo\nsono mille litri', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// le due schede, sempre al loro posto
function scenaSchede(ctx, t) {
  if (t < 7.5 || t > 88.0) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 87.3, 87.9));
  card(ctx, 372, 110, 700, 680, al);
  card(ctx, 1100, 110, 740, 680, al);
}
// ---------- 1 · le aree (7.5–32.7) ----------
const QX = 472, QY = 690, DM = 50;                 // il quadrato di 1 m: 500 px, un decimetro = 50 px
const qd = (i, j) => [QX + i * DM, QY - j * DM];   // angolo in basso a sinistra del quadretto (i, j)
function quadretto(ctx, i, j, col, a) {
  if (a <= 0) return;
  const [x, y] = qd(i, j);
  ctx.fillStyle = css(col, .3 * a); ctx.fillRect(x, y - DM, DM, DM);
  ctx.strokeStyle = css(col, .8 * a); ctx.lineWidth = 1.5; ctx.strokeRect(x, y - DM, DM, DM);
}
function scenaAree(ctx, t) {
  if (t < 7.6 || t > 33.2) return;
  const al = P(t, 7.7, 8.3) * (1 - P(t, 32.5, 33.0));
  ctx.save(); ctx.globalAlpha *= al;
  // le strisce: prima quella rossa dell'idea sbagliata, poi tutte e dieci
  const kRosso = P(t, 15.8, 16.2) * (1 - P(t, 22.9, 23.3));
  for (let i = 0; i < 10; i++) quadretto(ctx, i, 0, C.r, kRosso * P(t, 15.8 + .1 * i, 16.0 + .1 * i));
  for (let r = 0; r < 10; r++) {
    const k = P(t, 23.1 + .3 * r, 23.4 + .3 * r);
    for (let i = 0; i < 10; i++) quadretto(ctx, i, r, C.x, k);
    if (k > 0) txt(ctx, String(r + 1), QX - 18, QY - r * DM - DM / 2, { size: 30, color: C.dim, align: 'right', alpha: k });
  }
  // il primo quadretto, il decimetro quadrato
  const kq = life(t, 11.4, 15.6, .4, .3);
  quadretto(ctx, 0, 0, C.v, kq * 2);
  drawRich(ctx, '{v:1 dm²}', QX + DM + 16, QY - DM - 26, { size: 34, align: 'left', alpha: kq });
  // il quadrato di 1 m
  ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3; ctx.globalAlpha *= 1;
  ctx.save(); ctx.globalAlpha *= P(t, 7.9, 8.5); ctx.strokeRect(QX, QY - 10 * DM, 10 * DM, 10 * DM); ctx.restore();
  txt(ctx, '1 m', QX + 10 * DM + 18, QY - 5 * DM, { size: 32, color: C.dim, align: 'left', alpha: P(t, 8.0, 8.5) });
  // il lato in basso: 10 decimetri
  const kl = P(t, 8.2, 8.8);
  if (kl > 0) {
    ctx.save(); ctx.globalAlpha *= kl;
    linea(ctx, [QX, QY], [QX + 10 * DM, QY], css(C.x), 6);
    for (let i = 0; i <= 10; i++) { const k = P(t, 8.4 + .14 * i, 8.6 + .14 * i); if (k > 0) linea(ctx, [QX + i * DM, QY - 2], [QX + i * DM, QY + 14 * k], css(C.x), 3); }
    drawRich(ctx, '1 m = {g:10} dm', QX + 5 * DM, QY + 50, { size: 36, local: t - 9.2 });
    ctx.restore();
  }
  // l'idea sbagliata: 10 dm²?
  const kd = P(t, 16.1, 16.6) * (1 - P(t, 22.7, 23.1));
  if (kd > 0) {
    drawRich(ctx, '{r:10 dm²?}', QX + 5 * DM, QY - DM - 40, { size: 40, alpha: kd });
    if (t > 19.5) crossMark(ctx, QX + 5 * DM + 120, QY - DM - 40, P(t, 19.5, 20.1), C.r, .3 * kd);
  }
  ctx.restore();
}
function scenaTestoAree(ctx, t) {
  if (t < 7.6 || t > 33.2) return;
  const al = P(t, 7.9, 8.5) * (1 - P(t, 32.5, 33.0));
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'aree', 1470, 170, { size: 40, weight: 600 }));
  riga(ctx, t, 8.3, '1 m = {g:10} dm', 270, 48);
  riga(ctx, t, 16.0, '{r:1 m² = 10 dm² ?}', 370, 44);
  if (t > 19.5) crossMark(ctx, 1730, 370, P(t, 19.5, 20.1), C.r, .3);
  riga(ctx, t, 26.4, '1 m² = 10 · 10 dm² = {g:100 dm²}', 470, 42);
  riga(ctx, t, 27.9, 'il fattore 10 va {v:al quadrato}', 580, 38);
  riga(ctx, t, 28.8, '{v:10² = 100}', 655, 60);
  ctx.restore();
}
// ---------- 2 · i volumi, e il metro cubo pieno d'acqua (32.7–73.0) ----------
const PC = proietta(420, 730, 38);                 // il metro cubo: un decimetro = 38 px
const T_STRATO = [0, 42.1, 42.45, 42.8, 43.15, 43.5, 43.85, 44.2, 44.55, 44.9];   // quando si posa lo strato j+1
function scenaCubo(ctx, t) {
  if (t < 32.6 || t > 73.4) return;
  const al = P(t, 32.8, 33.4) * (1 - P(t, 72.8, 73.3));
  ctx.save(); ctx.globalAlpha *= al;
  const kCub = 1 - P(t, 56.8, 57.3);                // i cubetti lasciano il posto all'acqua
  if (kCub > 0) {
    if (t < 42.0) {
      // il primo strato si posa dal fondo in avanti
      const kd = 10 * P(t, 33.3, 35.9, E.lin);
      if (kd > 0) scatola(ctx, PC, 0, 10, 0, 1, 10 - kd, 10, C.x, kCub, 1);
    } else {
      let n = 1;
      for (let j = 1; j < 10; j++) if (t >= T_STRATO[j]) n = j + 1;
      scatola(ctx, PC, 0, 10, 0, n, 0, 10, C.x, kCub, 1);
      if (n < 10 && t > T_STRATO[n] - .3) {
        const off = 2.5 * (1 - P(t, T_STRATO[n] - .3, T_STRATO[n], E.in));
        scatola(ctx, PC, 0, 10, n + off, n + 1 + off, 0, 10, C.x, kCub * P(t, T_STRATO[n] - .3, T_STRATO[n] - .15), 1);
      }
    }
    // un cubetto: il decimetro cubo
    const ku = life(t, 37.7, 41.7, .4, .4);
    if (ku > 0) {
      scatola(ctx, PC, 9, 10, 0, 1, 0, 1, C.v, ku * 2, 0);
      drawRich(ctx, '{v:1 dm³}', PC(9.5, 0, 0)[0], 766, { size: 34, alpha: ku });
    }
  }
  // l'acqua che riempie il metro cubo
  const w = 10 * P(t, 57.0, 60.4, E.lin);
  if (w > 0) scatola(ctx, PC, 0, 10, 0, w, 0, 10, C.x, 1, 0);
  contorno(ctx, PC, 10, 10, 10, C.ink, P(t, 33.0, 33.6));
  txt(ctx, '1 m', PC(5, 0, 0)[0], 766, { size: 32, color: C.dim, alpha: P(t, 33.4, 33.9) });
  txt(ctx, '1 m', PC(10, 5, 10)[0] + 16, PC(10, 5, 10)[1], { size: 32, color: C.dim, align: 'left', alpha: P(t, 33.4, 33.9) });
  const kL = P(t, 59.9, 60.4, E.back);
  if (kL > 0) {
    const [x, y] = PC(5, 5, 0);
    ctx.save(); ctx.translate(x, y); ctx.scale(kL, kL);
    ctx.fillStyle = css(C.paper, .9); ctx.beginPath(); ctx.roundRect(-110, -40, 220, 80, 16); ctx.fill();
    drawRich(ctx, '{g:1000 L}', 0, 0, { size: 60, weight: 600 });
    ctx.restore();
  }
  ctx.restore();
}
function scenaTestoVolumi(ctx, t) {
  if (t < 32.6 || t > 52.9) return;
  const al = P(t, 33.0, 33.5) * (1 - P(t, 52.2, 52.7));
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'volumi', 1470, 170, { size: 40, weight: 600 }));
  riga(ctx, t, 33.3, '1 m = {g:10} dm', 270, 48);
  riga(ctx, t, 35.6, 'uno strato: 10 · 10 = 100 cubetti', 370, 38);
  riga(ctx, t, 45.2, '1 m³ = 100 · 10 dm³ = {g:1000 dm³}', 470, 42);
  riga(ctx, t, 46.6, 'il fattore 10 va {v:al cubo}', 580, 38);
  riga(ctx, t, 47.6, '{v:10³ = 1000}', 655, 60);
  ctx.restore();
}

// ---------- 3 · litri e millilitri: il decimetro cubo (52.4–73.0) ----------
const PS = proietta(1290, 440, 20);                // il decimetro cubo: un centimetro = 20 px
function scenaLitro(ctx, t) {
  if (t < 52.3 || t > 73.4) return;
  const al = P(t, 52.6, 53.1) * (1 - P(t, 72.8, 73.3));
  ctx.save(); ctx.globalAlpha *= al;
  const w = 10 * P(t, 53.0, 54.6, E.lin);
  const kg = P(t, 61.6, 62.4);                      // la griglia dei centimetri
  if (w > 0) scatola(ctx, PS, 0, 10, 0, w, 0, 10, C.x, 1, kg);
  contorno(ctx, PS, 10, 10, 10, C.ink, 1);
  txt(ctx, '1 dm', PS(5, 0, 0)[0], 472, { size: 32, color: C.dim, alpha: 1 - kg });
  txt(ctx, '10 cm', PS(5, 0, 0)[0], 472, { size: 32, color: C.dim, alpha: kg });
  // un centimetro cubo, nell'angolo davanti
  const kc = P(t, 68.6, 69.1);
  if (kc > 0) {
    scatola(ctx, PS, 9, 10, 0, 1, 0, 1, C.v, kc * 2, 0);
    drawRich(ctx, '{v:1 cm³}', PS(10, 0, 1)[0] + 30, PS(10, 0, 1)[1] + 4, { size: 34, align: 'left', alpha: kc });
  }
  riga(ctx, t, 53.4, '1 dm³ = {g:1 L}', 540, 50);
  riga(ctx, t, 59.6, '1 m³ = 1000 dm³ = {g:1000 L}', 615, 40);
  riga(ctx, t, 61.6, '1 dm = 10 cm → 1 dm³ = {g:1000 cm³}', 685, 36);
  riga(ctx, t, 68.6, '1 L = 1000 mL → 1 cm³ = {g:1 mL}', 750, 36);
  ctx.restore();
}

// ---------- 4 · un acquario (73.0–87.4) ----------
const PA = proietta(508, 650, 72);                 // l'acquario: un decimetro = 72 px
function scenaAcquario(ctx, t) {
  if (t < 72.9 || t > 88.0) return;
  const al = P(t, 73.3, 73.9) * (1 - P(t, 87.3, 87.9));
  ctx.save(); ctx.globalAlpha *= al;
  const kG = P(t, 80.2, 80.9);                      // i decimetri disegnati sul vetro
  scatola(ctx, PA, 0, 5, 0, 3, 0, 4, C.dim, .55, kG);
  const w = 3 * P(t, 85.0, 87.0, E.lin);
  if (w > 0) scatola(ctx, PA, 0, 5, 0, w, 0, 4, C.x, 1, kG);
  contorno(ctx, PA, 5, 3, 4, C.ink, 1);
  const et = (s1, s2, x, y, a, ta, o) => {
    const k = P(t, ta, ta + .5);
    txt(ctx, s1, x, y, Object.assign({ size: 34, alpha: k * (1 - kG) }, o));
    txt(ctx, s2, x, y, Object.assign({ size: 34, weight: 600, color: C.x, alpha: k * kG }, o));
  };
  et('50 cm', '5 dm', PA(2.5, 0, 0)[0], 692, 1, 73.6);
  et('40 cm', '4 dm', PA(5, 0, 2)[0] + 22, PA(5, 0, 2)[1] + 12, 1, 75.4, { align: 'left' });
  et('30 cm', '3 dm', PA(0, 1.5, 0)[0] - 14, PA(0, 1.5, 0)[1], 1, 77.4, { align: 'right' });
  ctx.restore();
}
function scenaTestoAcquario(ctx, t) {
  if (t < 72.9 || t > 88.0) return;
  const al = P(t, 73.3, 73.9) * (1 - P(t, 87.3, 87.9));
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'un acquario', 1470, 170, { size: 40, weight: 600 }));
  const kd = P(t, 80.2, 80.7);
  [['largo', '50 cm', '5 dm', 73.6], ['profondo', '40 cm', '4 dm', 75.4], ['alto', '30 cm', '3 dm', 77.4]].forEach(([n, a, b, ta], i) => {
    const k = P(t, ta, ta + .5), y = 280 + 66 * i;
    txt(ctx, n, 1300, y, { size: 38, color: C.dim, align: 'right', alpha: k });
    txt(ctx, a, 1330, y, { size: 40, align: 'left', alpha: k });
    drawRich(ctx, '= {x:' + b + '}', 1470, y, { size: 40, align: 'left', alpha: k * kd });
  });
  riga(ctx, t, 81.4, 'volume = 5 · 4 · 3 dm³ = {g:60 dm³}', 540, 40);
  riga(ctx, t, 85.0, '= {g:60 L}', 630, 64);
  ctx.restore();
}

// ---------- 5 · in una frase (87.6–98.2) ----------
function scenaFine(ctx, t) {
  if (t < 87.7) return;
  const al = 1 - P(t, 95.9, 96.9);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.9 });
    drawRich(ctx, 'Nelle aree il fattore va {v:al quadrato},\nnei volumi {v:al cubo}.', W / 2, 290, { size: 68, weight: 600, local: t - 88.3, stagger: .08 });
  });
  const pills = [[490, '1 m = 10 dm\n1 m² = {g:100 dm²}'], [960, '1 m³ = {g:1000 dm³}\n= {g:1000 L}'], [1430, '1 dm³ = {g:1 L}\n1 cm³ = {g:1 mL}']];
  pills.forEach(([x, s], i) => {
    const a = 89.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 34, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue quello che si conta (tacche, strisce, strati) e il
  // livello dell'acqua che sale
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 7.9, 8.5],                                           // il quadrato di 1 m
    ['tono', 8.4, 10.0, [.2, .3, .4, .5, .6, .7]],                                    // le tacche: 1 m = 10 dm
    ['pop', 11.5, .5],                                                                // 1 dm²
    ['tono', 15.8, 16.9, [.2, .3, .4, .5]], ['pop', 16.2, .4], ['pop', 19.6, .3],     // la striscia rossa: 10 dm²? No
    ['tono', 23.1, 26.1, [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1]], ['ding', 26.7],    // le 10 strisce: 100 dm²
    ['pop', 28.9, .55],                                                               // al quadrato: 10² = 100
    ['soffio', 32.8], ['traccia', 33.0, 33.6],                                        // il metro cubo
    ['tono', 33.3, 35.9, [.2, .24, .28, .32, .36, .4]], ['pop', 35.7, .45],           // il primo strato: 100 cubetti
    ['pop', 37.8, .5],                                                                // 1 dm³
    ['tono', 42.1, 44.9, [.2, .3, .4, .5, .6, .7, .8, .9, 1]], ['ding', 45.5],        // gli strati: 1000 dm³
    ['pop', 46.7, .45], ['pop', 47.7, .55],                                           // al cubo: 10³ = 1000
    ['tono', 53.0, 54.6, [.2, .32, .44, .56, .68, .8]], ['ding', 54.7],               // 1 dm³ = 1 L
    ['tono', 57.0, 60.4, [.2, .32, .44, .56, .68, .8]], ['pop', 60.0, .6],            // si riempie il metro cubo: 1000 L
    ['traccia', 61.6, 62.4], ['pop', 61.8, .45],                                      // i centimetri: 1000 cm³
    ['pop', 68.7, .5], ['ding', 69.1],                                                // 1 cm³ = 1 mL
    ['soffio', 73.3], ['pop', 73.7, .4], ['pop', 75.5, .45], ['pop', 77.5, .5],       // l'acquario: 50, 40, 30 cm
    ['traccia', 80.2, 80.9], ['pop', 81.5, .55],                                      // in decimetri: 60 dm³
    ['tono', 85.0, 87.0, [.2, .32, .44, .56, .68, .8]], ['ding', 87.1],               // l'acqua sale: 60 L
    ['soffio', 87.7], ['pop', 89.9, .5], ['pop', 90.4, .6], ['pop', 90.9, .7],        // in una frase
  ];
  return {
    titolo: 'Un metro cubo sono mille litri', durata: 98.2, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 32.7, 'le aree'], [32.7, 52.4, 'i volumi'], [52.4, 73.0, 'litri e millilitri'], [73.0, 87.4, 'un acquario']],
    scena(ctx, t) {
      scenaTitolo(ctx, t); scenaSchede(ctx, t); scenaAree(ctx, t); scenaTestoAree(ctx, t); scenaCubo(ctx, t);
      scenaTestoVolumi(ctx, t); scenaLitro(ctx, t); scenaAcquario(ctx, t); scenaTestoAcquario(ctx, t); scenaFine(ctx, t);
    },
  };
});
