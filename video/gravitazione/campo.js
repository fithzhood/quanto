'use strict';
/* Quanto pesi sull'Everest — il campo gravitazionale g = F/m (forza su ogni chilogrammo, in N/kg) come proprietà dello
   spazio attorno alla Terra: frecce verso il centro, lunghe in proporzione a g = G·M/r² (a distanza doppia, un quarto).
   Poi g in funzione della quota (r = 6370 km + quota; G = 6,67·10⁻¹¹, M = 5,97·10²⁴ kg, Terra sferica, senza la
   rotazione): al mare 9,81 N/kg, a 400 km (Stazione spaziale) 8,69, a una quota pari al raggio 2,45 (un quarto).
   Sull'Everest (8,85 km) 9,78: r cresce dello 0,14 %, r² del doppio, g cala dello 0,28 %; una bilancia tarata al mare
   segnerebbe 69,8 kg invece di 70, ma la massa non cambia. Argomento: gravitazione. */
CVIDEO.registra('gravitazione/campo', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, dot, drawSeq } = M;

const T_FINE = 91.1;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.1, 'sorpreso'], [21.5, 'neutro'],
  [26.1, 'felice'], [30.9, 'neutro'], [40.1, 'pensa'], [44.7, 'neutro'], [54.1, 'felice'], [58.7, 'neutro'],
  [63.3, 'sorpreso'], [67.9, 'pensa'], [72.5, 'neutro'], [81.7, 'felice'], [86.3, 'occhiolino'], [T_FINE, 'neutro'],
  [93.5, 'felice'], [97.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Sulla cima dell’Everest\npesi meno che al mare?'],
  [7.9, 12.4, 'La Terra, di massa {mink:M}, e un\nsasso di massa {mink:m}.'],
  [12.5, 17.0, 'La Terra lo attira: una forza {my:F}\nverso il suo {g:centro}.'],
  [17.1, 21.4, 'Massa doppia, 2{mink:m}:\nla forza {g:raddoppia}…'],
  [21.5, 26.0, '…ma il rapporto {my:F}/{mink:m} {g:non cambia}:\nè la forza su ogni chilogrammo.'],
  [26.1, 30.8, 'È il {v:campo gravitazionale} {mv:g} = {my:F}/{mink:m},\nin newton al chilogrammo, N/kg.'],
  [30.9, 35.4, 'Tolgo il sasso: il campo resta,\nè una proprietà dello {g:spazio}.'],
  [35.5, 40.0, 'In ogni punto, una freccia\nverso il centro della Terra.'],
  [40.1, 44.6, 'Più lontano, frecce più {g:corte}:\na distanza doppia, {g:un quarto}.'],
  [44.7, 49.4, '{mv:g} = {mink:G·M/r²}, con {mink:r} dal centro\ne {mink:G} costante di gravitazione.'],
  [49.5, 54.0, 'Ecco {mv:g} in funzione della {v:quota},\nl’altezza sul livello del mare.'],
  [54.1, 58.6, 'Al mare {mv:g} ≈ 9,81 N/kg:\nil solito 9,8, più preciso.'],
  [58.7, 63.2, 'A 400 km, dove vola la Stazione\nspaziale: ancora 8,69 N/kg.'],
  [63.3, 67.8, 'A una quota pari al raggio,\ndistanza doppia: {g:un quarto}.'],
  [67.9, 72.4, 'E l’Everest? Qui non si vede:\ningrandisco i primi 10 km.'],
  [72.5, 77.0, 'In cima, a 8,85 km,\n{mv:g} ≈ 9,78 N/kg.'],
  [77.1, 81.6, '{mink:r} cresce dello 0,14 %:\n{mv:g} cala del doppio, {g:0,28 %}.'],
  [81.7, 86.2, 'Una bilancia tarata al mare\nsegnerebbe 69,8 kg invece di 70.'],
  [86.3, 90.8, 'Pesi un po’ meno, ma la tua\n{g:massa} resta la stessa.'],
  [93.5, 98.5, 'Il campo {mv:g} = {mink:G·M/r²} è la forza su\nogni kg, e cala allontanandosi.'],
];

// ---------- la fisica: g = G·M/r², r = raggio + quota ----------
const G = 6.67e-11, MT = 5.97e24, RT_M = 6.37e6;
const gDi = hKm => G * MT / Math.pow(RT_M + hKm * 1000, 2);
const fmt = (v, d) => v.toFixed(d).replace('.', ',');

// ---------- aiutanti ----------
function freccia(ctx, a, b, col, al = 1, w = 6) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (al <= 0.01 || L < 2) return;
  const ux = dx / L, uy = dy / L, s = Math.min(1.2, L / 22);
  ctx.save(); ctx.globalAlpha *= al;
  if (L > 14 * s) {
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
  }
  arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
  ctx.restore();
}
const titoletto = (ctx, s, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, 1480, 165, { size: 38, weight: 600, alpha: al }));
function fondo(ctx, x, y, w, h, al = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 10); ctx.fill(); ctx.restore(); }
function sfera(ctx, p, r, col, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const g = ctx.createRadialGradient(p[0] - r * .35, p[1] - r * .4, r * .1, p[0], p[1], r);
  g.addColorStop(0, css(mix(col, [255, 255, 255], .45))); g.addColorStop(1, css(col));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Quanto pesi sull’Everest', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// 1 · il campo attorno alla Terra (7,5–49,6): la Terra non in scala con le frecce; ogni freccia è centrata sul suo punto,
//     lunga in proporzione a g: 120 px a 2 raggi, 60 a 2,83 (√8), 30 a 4. Tre giri di 12 frecce, sfalsati di 15°.
const TC = [430, 450], RT = 70, SP = [TC[0] + RT * Math.sqrt(8), TC[1]];
const GIRI = [{ k: 2, L: 120, a0: 15, t0: 36.0 }, { k: Math.sqrt(8), L: 60, a0: 0, t0: 35.6 }, { k: 4, L: 30, a0: 15, t0: 36.4 }];
const A_EVID = -15;   // il raggio evidenziato a «distanza doppia»
function frecciaCampo(ctx, k, L, aGradi, al, w) {
  const a = aGradi * Math.PI / 180, u = [Math.cos(a), Math.sin(a)], r = k * RT;
  const p = [TC[0] + r * u[0], TC[1] + r * u[1]];
  freccia(ctx, [p[0] + u[0] * L / 2, p[1] + u[1] * L / 2], [p[0] - u[0] * L / 2, p[1] - u[1] * L / 2], C.v, al, w);
  dot(ctx, p, C.v, al, 6);
}
function sceneCampo(ctx, t) {
  const al = life(t, 7.6, 49.8, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  sfera(ctx, TC, RT, mix(C.x, C.g, .35));
  drawRich(ctx, '{mink:M}', TC[0], TC[1], { size: 40 });
  // il sasso e la forza che lo tira verso il centro (50 px per m, 100 per 2m)
  const sa = life(t, 8.4, 31.6, .4, .5);
  if (sa > 0) {
    const k2 = P(t, 17.3, 17.9), rs = lerp(14, 19, k2);
    sfera(ctx, SP, rs, mix(C.dim, C.y, .2), sa);
    drawRich(ctx, '{mink:m}', SP[0], SP[1] + 50, { size: 40, alpha: sa * (1 - k2) });
    drawRich(ctx, '2{mink:m}', SP[0], SP[1] + 50, { size: 40, alpha: sa * k2 });
    const kF = P(t, 12.6, 13.1) * sa, L = lerp(50, 100, k2), x0 = SP[0] - rs - 3;
    freccia(ctx, [x0, SP[1]], [x0 - L, SP[1]], C.y, kF, 7);
    drawRich(ctx, '{my:F}', x0 - L / 2, SP[1] - 36, { size: 40, alpha: kF * (1 - k2) });
    drawRich(ctx, '2{my:F}', x0 - L / 2, SP[1] - 36, { size: 40, alpha: kF * k2 });
  }
  // il campo: prima nel punto del sasso, poi dappertutto
  const kE = P(t, 40.2, 40.8) * (1 - P(t, 44.6, 45.2));        // gli altri si attenuano mentre si confrontano due frecce
  GIRI.forEach((Gi, gi) => {
    for (let i = 0; i < 12; i++) {
      const ang = Gi.a0 + 30 * i, solo = gi === 1 && i === 0;
      let k = P(t, Gi.t0 + i * .06, Gi.t0 + i * .06 + .4);
      if (solo) k = Math.max(k, P(t, 31.0, 31.5));
      const evid = gi !== 1 && Math.abs(((ang - A_EVID) % 360 + 360) % 360) < .1;
      if (k > 0) frecciaCampo(ctx, Gi.k, Gi.L, ang, k * (evid ? 1 : 1 - .7 * kE), Gi.L > 40 ? 6 : 5);
    }
  });
  drawRich(ctx, '{mv:g}', SP[0] + 64, SP[1], { size: 40, alpha: P(t, 31.2, 31.7) * (1 - P(t, 40.0, 40.4)) });
  if (kE > 0) {
    const a = A_EVID * Math.PI / 180, u = [Math.cos(a), Math.sin(a)];
    drawRich(ctx, '{mv:g}', TC[0] + 238 * u[0], TC[1] + 238 * u[1], { size: 40, alpha: kE });
    drawRich(ctx, '{mv:g}/4', TC[0] + 350 * u[0], TC[1] + 350 * u[1], { size: 40, alpha: kE });
  }
  ctx.restore();
  txt(ctx, 'Terra e frecce non in scala fra loro', 1085, 760, { size: 30, color: C.dim, align: 'right', alpha: al });
}

// 2 · g in funzione della quota (49,6–91,1): 0–13 000 km in 840 px, 50 px per N/kg
const GO = [230, 690], KX = 840 / 13000, KY = 50;
const gx = hKm => GO[0] + hKm * KX, gy = gv => GO[1] - gv * KY;
const CURVA_G = Array.from({ length: 261 }, (_, i) => { const h = 13000 * i / 260; return [gx(h), gy(gDi(h))]; });
// l'ingrandimento: 0–10 km in 260 px, da 9,77 a 9,82 N/kg in 250 px
const IX = h => 770 + h * 26, IY = gv => 420 - (gv - 9.77) * 5000;
const CURVA_I = Array.from({ length: 41 }, (_, i) => { const h = 10 * i / 40; return [IX(h), IY(gDi(h))]; });
function linea(ctx, pts, k, col, w) {
  const n = Math.max(2, Math.round(pts.length * clamp(k)));
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.restore();
}
function sceneQuota(ctx, t) {
  const al = life(t, 49.6, T_FINE + .1, .6, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // gli assi
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
  for (let v = 2; v <= 10; v += 2) { ctx.beginPath(); ctx.moveTo(GO[0], gy(v)); ctx.lineTo(gx(13000), gy(v)); ctx.stroke(); }
  for (let h = 4000; h <= 12000; h += 4000) { ctx.beginPath(); ctx.moveTo(gx(h), GO[1]); ctx.lineTo(gx(h), gy(10.4)); ctx.stroke(); }
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(gx(13300), GO[1]); ctx.stroke(); arrowHead(ctx, [gx(13300) + 6, GO[1]], 0, C.ink);
  ctx.beginPath(); ctx.moveTo(GO[0], GO[1]); ctx.lineTo(GO[0], gy(10.9)); ctx.stroke(); arrowHead(ctx, [GO[0], gy(10.9) - 6], -Math.PI / 2, C.ink);
  for (let v = 0; v <= 10; v += 2) txt(ctx, String(v), GO[0] - 18, gy(v), { size: 30, color: C.dim, align: 'right' });
  for (let h = 0; h <= 12000; h += 4000) txt(ctx, h ? String(h / 1000) + ' 000' : '0', gx(h), GO[1] + 32, { size: 30, color: C.dim });
  drawRich(ctx, '{mv:g} {dim:(N/kg)}', GO[0] + 20, gy(10.9) - 4, { size: 32, align: 'left' });
  txt(ctx, 'quota (km)', 1085, 760, { size: 30, color: C.dim, align: 'right' });
  txt(ctx, 'Terra sferica, senza la rotazione', 140, 760, { size: 30, color: C.dim, align: 'left' });
  linea(ctx, CURVA_G, P(t, 50.0, 52.0, E.lin), C.v, 5);
  // i punti
  const kM = P(t, 54.2, 54.6), kS = P(t, 58.8, 59.2), kR = P(t, 63.4, 63.8);
  dot(ctx, [gx(0), gy(gDi(0))], C.v, kM, 10);
  txt(ctx, 'mare', gx(0) + 22, gy(gDi(0)) + 2, { size: 30, color: C.ink, align: 'left', alpha: kM });
  dot(ctx, [gx(400), gy(gDi(400))], C.v, kS, 10);
  txt(ctx, 'Stazione spaziale', gx(400) + 26, gy(gDi(400)) + 8, { size: 30, color: C.ink, align: 'left', alpha: kS });
  dot(ctx, [gx(6370), gy(gDi(6370))], C.v, kR, 10);
  drawRich(ctx, 'quota pari al raggio:\n9,81/4 ≈ 2,45', gx(6370) + 22, gy(gDi(6370)) - 60, { size: 30, align: 'left', alpha: kR });
  // l'ingrandimento dei primi 10 km
  const kI = P(t, 68.0, 68.6);
  if (kI > 0) {
    ctx.save(); ctx.globalAlpha *= kI;
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.strokeRect(gx(0) - 9, gy(gDi(0)) - 9, 18, 18);
    card(ctx, 670, 140, 410, 320);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
    for (const v of [9.78, 9.8, 9.82]) { ctx.beginPath(); ctx.moveTo(IX(0), IY(v)); ctx.lineTo(IX(10), IY(v)); ctx.stroke(); txt(ctx, fmt(v, 2), IX(0) - 12, IY(v), { size: 30, color: C.dim, align: 'right' }); }
    ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(IX(0), IY(9.77)); ctx.lineTo(IX(10), IY(9.77)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(IX(0), IY(9.77)); ctx.lineTo(IX(0), IY(9.825)); ctx.stroke();
    [0, 5, 10].forEach(h => txt(ctx, h + (h === 10 ? ' km' : ''), IX(h) + (h === 10 ? 4 : 0), 444, { size: 30, color: C.dim }));
    linea(ctx, CURVA_I, P(t, 68.4, 69.4, E.lin), C.v, 5);
    dot(ctx, [IX(0), IY(gDi(0))], C.v, 1, 9);
    txt(ctx, 'mare', IX(0) + 18, IY(gDi(0)) - 26, { size: 30, color: C.ink, align: 'left' });
    const kV = P(t, 72.6, 73.0);
    dot(ctx, [IX(8.85), IY(gDi(8.85))], C.v, kV, 9);
    txt(ctx, 'Everest', 1060, 386, { size: 30, color: C.ink, align: 'right', alpha: kV });
    ctx.restore();
  }
  ctx.restore();
}

function sceneScena(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1000, 680, life(t, 7.6, T_FINE + .1, .6, .5));
  sceneCampo(ctx, t); sceneQuota(ctx, t);
}

// ---------- il pannello ----------
function scenePannello(ctx, t) {
  if (t < 12.3 || t > T_FINE + .3) return;
  const al = life(t, 12.5, T_FINE + .1, .5, .5);
  card(ctx, 1150, 110, 660, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const riga = (y, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1190, y); ctx.lineTo(1770, y); ctx.stroke(); ctx.restore(); };
  titoletto(ctx, 'campo gravitazionale');
  // 1 · forza su ogni chilogrammo
  const s1 = 1 - P(t, 44.6, 45.0);
  if (s1 > 0) {
    ctx.save(); ctx.globalAlpha *= s1;
    const r1 = P(t, 12.6, 13.0), r2 = P(t, 17.3, 17.7);
    drawRich(ctx, '{dim:massa} {mink:m}', 1440, 245, { size: 36, align: 'right', alpha: r1 });
    drawRich(ctx, '{dim:→ forza} {my:F}', 1500, 245, { size: 36, align: 'left', alpha: r1 });
    drawRich(ctx, '{dim:massa} 2{mink:m}', 1440, 300, { size: 36, align: 'right', alpha: r2 });
    drawRich(ctx, '{dim:→ forza} 2{my:F}', 1500, 300, { size: 36, align: 'left', alpha: r2 });
    drawRich(ctx, '{my:F}/{mink:m} {g:non cambia}', 1480, 365, { size: 38, local: t - 21.6 });
    riga(410, P(t, 26.1, 26.5));
    drawRich(ctx, '{mv:g} = {my:F}/{mink:m}', 1480, 475, { size: 60, local: t - 26.2 });
    drawRich(ctx, '{dim:in} N/kg {dim:(come i m/s²)}', 1480, 545, { size: 32, local: t - 27.0 });
    riga(595, P(t, 40.2, 40.6));
    const d1 = P(t, 40.3, 40.7), d2 = P(t, 41.0, 41.4);
    drawRich(ctx, '{dim:distanza} {mink:r}', 1440, 645, { size: 36, align: 'right', alpha: d1 });
    drawRich(ctx, '{dim:→ campo} {mv:g}', 1500, 645, { size: 36, align: 'left', alpha: d1 });
    drawRich(ctx, '{dim:distanza} 2{mink:r}', 1440, 700, { size: 36, align: 'right', alpha: d2 });
    drawRich(ctx, '{dim:→ campo} {mv:g}/4', 1500, 700, { size: 36, align: 'left', alpha: d2 });
    ctx.restore();
  }
  // 2 · la legge, e la tabella delle quote
  const s2 = P(t, 44.8, 45.2);
  if (s2 > 0) {
    ctx.save(); ctx.globalAlpha *= s2;
    drawSeq(ctx, ['{mv:g}{mink: = }', { num: '{mink:G·M}', den: '{mink:r²}' }], 1480, 262, 56, { local: t - 44.9 });
    const kq = P(t, 49.6, 50.0);
    drawRich(ctx, '{mink:r}{dim:: distanza dal centro}', 1480, 350, { size: 32, alpha: 1 - kq });
    drawRich(ctx, '{mink:r} = 6370 km + quota', 1480, 350, { size: 32, alpha: kq });
    drawRich(ctx, '{mink:G} ≈ 6,67·10{mink:⁻¹¹} N·m²/kg²', 1480, 395, { size: 30, local: t - 46.6 });
    drawRich(ctx, '{mink:M} ≈ 5,97·10{mink:²⁴} kg', 1480, 435, { size: 30, local: t - 47.0 });
    riga(470, kq);
    txt(ctx, 'quota', 1300, 505, { size: 30, color: C.dim, alpha: kq });
    drawRich(ctx, '{mv:g} {dim:(N/kg)}', 1540, 505, { size: 30, alpha: kq });
    const RIGHE = [[54.2, '0 km', 0], [58.8, '400 km', 400], [63.4, '6370 km', 6370], [72.6, '8,85 km', 8.85]];
    RIGHE.forEach(([ta, q, h], i) => {
      const k = P(t, ta, ta + .4), y = 555 + 48 * i;
      if (k <= 0) return;
      txt(ctx, q, 1300, y, { size: 36, alpha: k, weight: i === 3 ? 600 : 500 });
      txt(ctx, fmt(gDi(h), 2), 1540, y, { size: 36, alpha: k, weight: i === 3 ? 600 : 500 });
    });
    drawRich(ctx, '{g:−0,28 %}', 1630, 555 + 48 * 3, { size: 30, align: 'left', alpha: P(t, 77.2, 77.6) });
    drawRich(ctx, '{dim:bilancia:} 70 kg → 69,8 kg', 1480, 752, { size: 32, alpha: P(t, 81.8, 82.2) });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (91,1–101,5)
function sceneFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 100.0, 101.0);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Il campo gravitazionale è la forza\nsu ogni chilogrammo, e cala salendo.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .09 });
  });
  const pills = [[490, '{mv:g} = {my:F}/{mink:m}\n{dim:in N/kg}'], [960, '{mv:g} = {mink:G·M/r²}\n{dim:cala come 1/}{mink:r²}'], [1430, 'Everest: {g:−0,28 %}\n{dim:la massa non cambia}']];
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
    ['soffio', 7.6], ['pop', 8.4, .4],                                                // la Terra, il sasso
    ['pop', 12.6, .45],                                                               // la forza F verso il centro
    ['tono', 17.3, 17.9, [.4, .7]],                                                   // massa doppia: la forza raddoppia
    ['pop', 21.6, .5],                                                                // F/m non cambia
    ['pop', 26.2, .6], ['pop', 27.0, .35],                                            // g = F/m, in N/kg
    ['pop', 31.0, .5],                                                                // tolgo il sasso: resta g
    ['pop', 35.6, .5], ['pop', 36.0, .7], ['pop', 36.4, .3],                          // le frecce del campo, tre giri
    ['pop', 40.3, .5], ['pop', 41.0, .3],                                             // distanza doppia: g/4
    ['pop', 44.9, .6], ['pop', 46.6, .35], ['pop', 47.0, .35],                        // g = G·M/r², G e M
    ['soffio', 49.6],                                                                 // g in funzione della quota
    ['traccia', 50.0, 52.0], ['tono', 50.0, 52.0, [.98, .62, .43, .32, .24, .19, .15, .13, .11]],   // la curva
    ['pop', 54.2, .9], ['pop', 58.8, .8], ['pop', 63.4, .3], ['ding', 63.9],          // mare, Stazione spaziale, un quarto
    ['pop', 68.0, .5], ['traccia', 68.4, 69.4],                                       // l'ingrandimento dei primi 10 km
    ['pop', 72.6, .55], ['ding', 73.1],                                               // l'Everest: 9,78 N/kg
    ['pop', 77.2, .5], ['pop', 81.8, .45],                                            // −0,28 %, la bilancia
    ['soffio', 91.3], ['pop', 93.3, .5], ['pop', 93.8, .6], ['pop', 94.3, .7],        // in una frase
  ];
  return {
    titolo: 'Quanto pesi sull’Everest', durata: 101.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 49.4, 'il campo gravitazionale'], [49.4, 67.8, 'il campo e la quota'], [67.8, T_FINE, 'sull’Everest']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneScena(ctx, t); scenePannello(ctx, t); sceneFine(ctx, t); },
  };
});
