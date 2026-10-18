'use strict';
/* Dall'atomo alla Terra — uno zoom continuo da 10⁻¹⁰ m a 10⁷ m: notazione scientifica a·10ⁿ e ordine di grandezza.
   Tutto è disegnato in scala vera: il riquadro è largo 10^e metri e e cambia col tempo. Argomento: misure. */
CVIDEO.registra('misure/potenze-di-dieci', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, txt, card, dot } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [85.6, 190], [86.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [85.6, 1050], [86.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [85.6, 2.2], [86.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [85.6, 2], [86.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [85.6, -1.5], [86.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [11.2, 'sorpreso'], [13.6, 'neutro'],
  [25.6, 'felice'], [27.9, 'neutro'], [39.6, 'pensa'], [43.8, 'felice'], [46.2, 'neutro'], [53.4, 'sorpreso'],
  [55.6, 'neutro'], [61.9, 'felice'], [64.2, 'neutro'], [76.0, 'sorpreso'], [78.2, 'neutro'], [80.8, 'festa'],
  [83.4, 'neutro'], [88.1, 'felice'], [91.2, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.5, 'Quanto è piccolo un atomo?\nE grande la Terra?'],
  [7.9, 11.0, 'Questo è un atomo,\ningrandito moltissimo.'],
  [11.2, 15.6, 'È largo circa 0,0000000001 m:\nun decimo di miliardesimo di metro.'],
  [15.8, 20.4, 'Troppi zeri. Si scrive {mg:10⁻¹⁰}{g: m}:\nl’1 sta al decimo posto.'],
  [20.6, 25.4, 'Mi allontano: a ogni tacca, tutto\nsembra 10 volte più piccolo.'],
  [25.6, 29.4, 'Ecco un capello: è spesso\ncirca 0,07 mm.'],
  [29.6, 34.4, 'In metri, 0,00007 m. In notazione\nscientifica: {mg:7·10⁻⁵}{g: m}.'],
  [34.6, 39.4, 'Un numero fra 1 e 10, per\nuna potenza di 10: {mink:a·10ⁿ}.'],
  [39.6, 43.6, 'L’{v:ordine di grandezza}: la potenza\ndi 10 più vicina.'],
  [43.8, 48.1, '{mink:7·10⁻⁵} sta fra {mink:1·10⁻⁵} e {mink:10·10⁻⁵}:\npiù vicino a {mg:10⁻⁴}{g: m}.'],
  [48.2, 52.6, 'Mi allontano ancora:\nil capello sta su una testa…'],
  [53.3, 57.8, '…di una persona di 1,7 m:\nordine {mg:10⁰}{g: m = 1 m}.'],
  [57.9, 61.7, 'La persona sta in cima\na una montagna…'],
  [61.9, 66.4, '…alta come l’Everest:\ncirca 8800 m = {mink:8,8·10³} m.'],
  [66.6, 70.6, '8,8 è più vicino a 10:\nordine {mg:10⁴}{g: m}.'],
  [70.8, 74.9, 'Mi allontano ancora…\nfino a vedere tutta la Terra.'],
  [76.0, 80.6, 'Il suo diametro: circa\n12 700 000 m ≈ {mg:1,3·10⁷}{g: m}.'],
  [80.8, 85.2, 'Dall’atomo alla Terra:\n{g:17} ordini di grandezza!'],
  [88.1, 93.4, 'Con le potenze di 10 si scrivono\nil piccolissimo e il grandissimo.'],
];

// ---------- aiutanti ----------
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const pot = n => '10' + String(n).split('').map(c => SUP[c]).join('');   // 10ⁿ con l'esponente in apice

// ---------- lo zoom: il riquadro è largo 10^e metri, tutto in scala vera ----------
const VW = [372, 110, 820, 680];                  // la scheda dello zoom
const AX = 782, LARGO = 800;                      // l'ancora (un punto del capello) sta sempre in x 782
const eZoom = t => kf(t, [[20.6, -9.6], [25.6, -3.6], [48.2, -3.6], [53.2, .55], [57.9, .55], [62.9, 4.2], [70.8, 4.2], [76.3, 7.4]]);
// in verticale l'ancora si sposta in pixel (non in metri): al centro per l'atomo, in alto per la persona e la Terra
const ancoraY = e => e <= -2 ? 400 : e <= 0 ? lerp(400, 230, E.io((e + 2) / 2)) : 230;
// il mondo, in metri (y verso l'alto): l'ancora è un punto del capello, 2 cm sopra la testa
const PIEDI = -1.72, H_MONTE = 8849, R_TERRA = 6.371e6;   // persona alta 1,7 m; montagna: l'Everest
// la montagna: x e quota rispetto ai piedi della persona, che sta su un pianoro di 6 m in cima;
// la sagoma è disegnata per 4800 m e si allarga e si alza in proporzione fino all'Everest
const MONTE = [[-3, 0], [-900, -700], [-1600, -1500], [-2600, -2600], [-3800, -3600], [-5200, -4800], [6000, -4800],
  [4600, -4000], [3300, -3100], [2200, -1900], [1400, -1300], [700, -500], [3, 0]].map(([x, q]) => [Math.abs(x) > 3 ? x * 1.8 : x, q * H_MONTE / 4800]);
const cl = v => clamp(v, -1e5, 1e5);              // niente coordinate enormi sulla tela
function atomo(ctx, x, y, r, col) {
  if (r < 3) { ctx.fillStyle = css(col, .5); ctx.beginPath(); ctx.arc(x, y, Math.max(r, .8), 0, Math.PI * 2); ctx.fill(); return; }
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);   // la nuvola degli elettroni, più fitta al centro
  g.addColorStop(0, css(col, .6)); g.addColorStop(.7, css(col, .3)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  if (r > 40) { ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); }
}
function scenaZoom(ctx, t) {
  if (t < 7.3 || t > 86.0) return;
  const al = P(t, 7.5, 8.2) * (1 - P(t, 85.3, 85.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, ...VW);
  ctx.save();
  ctx.beginPath(); ctx.roundRect(VW[0] + 6, VW[1] + 6, VW[2] - 12, VW[3] - 12, 18); ctx.clip();
  const e = eZoom(t), s = LARGO / Math.pow(10, e), AY = ancoraY(e);
  const X = x => cl(AX + x * s), Y = y => cl(AY - y * s), fondo = VW[1] + VW[3];
  // la Terra, sotto la montagna: da vicino è un suolo piatto, da lontano un cerchio
  if (e > 2.5) {
    const Rs = R_TERRA * s;
    ctx.fillStyle = css(C.x, .26); ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3;
    if (Rs > 2e5) {
      const ys = Y(PIEDI - H_MONTE);
      if (ys < fondo) { ctx.fillRect(VW[0], ys, VW[2], fondo - ys); ctx.beginPath(); ctx.moveTo(VW[0], ys); ctx.lineTo(VW[0] + VW[2], ys); ctx.stroke(); }
    } else { ctx.beginPath(); ctx.arc(AX, AY - (PIEDI - H_MONTE - R_TERRA) * s, Rs, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  }
  // la montagna, che da lontano diventa troppo piccola per vedersi
  if (e > -.6 && e < 7) {
    ctx.save(); ctx.globalAlpha *= 1 - P(e, 6.0, 6.8);
    ctx.fillStyle = css(C.dim, .42); ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    ctx.beginPath(); MONTE.forEach(([x, dy], i) => { const px = X(x), py = Y(PIEDI + dy); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // il capello: largo 0,07 mm, sporge dalla testa
  if (e < 1) {
    const hw = Math.min(1e5, Math.max(1.2, 3.5e-5 * s)), yT = Y(.09), yB = Y(-.03);
    ctx.fillStyle = css(C.y, .3); ctx.fillRect(AX - hw, yT, 2 * hw, yB - yT);
    if (hw < 3000) {
      ctx.strokeStyle = css(C.y, .9); ctx.lineWidth = hw > 4 ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(AX - hw, yT); ctx.lineTo(AX - hw, yB); ctx.moveTo(AX + hw, yT); ctx.lineTo(AX + hw, yB); ctx.stroke();
      const passo = 1e-5 * s;   // le squame della cuticola, circa una ogni 10 micrometri
      if (passo > 10 && hw > 20) {
        ctx.lineWidth = 2; ctx.strokeStyle = css(C.y, .5);
        const k0 = Math.floor((AY - fondo) / passo), k1 = Math.ceil((AY - VW[1]) / passo) + 1;
        for (let k = k0; k <= k1; k++) { const y = AY - k * passo; if (y < yT || y > yB) continue; ctx.beginPath(); ctx.moveTo(AX - hw, y); ctx.quadraticCurveTo(AX, y - .45 * hw, AX + hw, y - .1 * hw); ctx.stroke(); }
      }
    }
  }
  // gli atomi: il capello, visto da vicinissimo
  if (e < -8.3) {
    ctx.save(); ctx.globalAlpha *= 1 - P(e, -8.9, -8.3);
    const a = 1.25e-10 * s, r = .5e-10 * s, n = Math.ceil(430 / a) + 1;
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
      const x = AX + i * a, y = AY - j * a;
      if (y < VW[1] - r || y > fondo + r) continue;
      atomo(ctx, x, y, r, i === 0 && j === 0 ? C.v : C.x);
    }
    ctx.restore();
  }
  // la persona, alta 1,7 m: le forme sono in metri
  if (e > -2.6 && e < 3) {
    ctx.save(); ctx.globalAlpha *= 1 - P(e, 2.0, 2.8);
    ctx.translate(AX, AY); ctx.scale(s, -s);
    ctx.fillStyle = css(C.v, .5);
    ctx.beginPath(); ctx.arc(0, -.125, .105, 0, Math.PI * 2); ctx.fill();                 // testa: la cima a −0,02 m
    ctx.fillRect(-.05, -.25, .1, .05);                                                       // collo
    ctx.beginPath(); ctx.roundRect(-.2, -.82, .4, .58, .08); ctx.fill();                    // busto
    ctx.beginPath(); ctx.roundRect(-.29, -.86, .075, .6, .035); ctx.roundRect(.215, -.86, .075, .6, .035); ctx.fill();   // braccia
    ctx.beginPath(); ctx.roundRect(-.17, PIEDI, .145, .96, .03); ctx.roundRect(.025, PIEDI, .145, .96, .03); ctx.fill();  // gambe
    ctx.restore();
  }
  // la barra di scala: è lunga 10ⁿ metri (n intero); quando diventa corta passa alla potenza dopo
  const n = Math.floor(e - .05), L = LARGO * Math.pow(10, n - e);
  ctx.fillStyle = css(C.paper, .92); ctx.beginPath(); ctx.roundRect(392, 126, L + 40, 72, 12); ctx.fill();
  drawRich(ctx, '{mink:' + pot(n) + '} m', 412, 150, { size: 34, align: 'left' });
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(412, 182); ctx.lineTo(412 + L, 182); ctx.moveTo(412, 172); ctx.lineTo(412, 192); ctx.moveTo(412 + L, 172); ctx.lineTo(412 + L, 192); ctx.stroke();
  ctx.restore();
  // la lettura: lo stesso numero scritto per esteso e in notazione scientifica
  for (const [a, b, sx, segno, dx, td] of LETTURE) {
    const k = life(t, a, b, .4, .4);
    if (k <= 0) continue;
    ctx.save(); ctx.globalAlpha *= k;
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(392, 706, 780, 68, 14); ctx.fill(); ctx.stroke();
    txt(ctx, sx, AX - 22, 740, { size: 40, align: 'right' });
    const kd = P(t, td, td + .4);
    txt(ctx, segno, AX, 740, { size: 40, alpha: kd });
    drawRich(ctx, dx, AX + 24, 740, { size: 40, align: 'left', alpha: kd });
    ctx.restore();
  }
  ctx.restore();
}
const LETTURE = [ // [da, a, per esteso, segno, in notazione scientifica, quando compare]
  [11.4, 20.5, '0,0000000001 m', '=', '{mg:10⁻¹⁰}{g: m}', 16.2],
  [29.8, 48.0, '0,00007 m', '=', '{mg:7·10⁻⁵}{g: m}', 31.6],
  [53.6, 57.8, '1,7 m', '=', '{mg:1,7·10⁰}{g: m}', 54.2],
  [62.2, 70.6, '8849 m', '≈', '{mg:8,8·10³}{g: m}', 63.6],
  [76.2, 85.4, '12 700 000 m', '≈', '{mg:1,3·10⁷}{g: m}', 77.4],
];

// ---------- il righello delle potenze di dieci, da 10⁻¹⁰ a 10⁷ m ----------
const XR = 1350, YE = e => 740 - (e + 10) * 450 / 17;
const OGGETTI = [[11.2, -10, 'atomo'], [25.8, Math.log10(7e-5), 'capello'], [53.4, Math.log10(1.7), 'persona'],
  [62.0, Math.log10(8849), 'montagna'], [76.0, Math.log10(1.27e7), 'Terra']];
const lg = i => OGGETTI[i][1];
// il segno arancio segue la grandezza dell'oggetto inquadrato, con gli stessi tempi dello zoom
const mZoom = t => kf(t, [[20.6, -10], [25.6, lg(1)], [48.2, lg(1)], [53.2, lg(2)], [57.9, lg(2)], [62.9, lg(3)], [70.8, lg(3)], [76.3, lg(4)]]);
// gli ordini di grandezza, in verde accanto al nome quando Stilla li dice: [da, testo, dove]
const ORDINI = [[16.2, '{mg:10⁻¹⁰}{g: m}', 0], [43.8, '{mg:10⁻⁴}{g: m}', 1], [53.6, '{mg:10⁰}{g: m}', 2],
  [66.8, '{mg:10⁴}{g: m}', 3], [76.4, '{mg:10⁷}{g: m}', 4]];
function scenaRighello(ctx, t) {
  if (t < 7.3 || t > 86.0) return;
  const al = P(t, 7.7, 8.4) * (1 - P(t, 85.3, 85.9));
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 1220, 110, 620, 680);
  conFont(TITOLI, () => drawRich(ctx, 'quanto è grande', 1530, 160, { size: 36, weight: 600 }));
  drawRich(ctx, '{mink:a·10ⁿ}{dim:   con 1 ≤ }{mink:a}{dim: < 10}', 1530, 222, { size: 36, alpha: P(t, 35.0, 35.5), local: t - 35.0 });
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(XR, YE(-10) + 12); ctx.lineTo(XR, YE(7) - 12); ctx.stroke();
  ctx.lineWidth = 2;
  for (let n = -10; n <= 7; n++) { ctx.beginPath(); ctx.moveTo(XR - 9, YE(n)); ctx.lineTo(XR + 9, YE(n)); ctx.stroke(); }
  for (let n = -10; n <= 7; n += 2) drawRich(ctx, '{mdim:' + pot(n) + '}', XR - 22, YE(n), { size: 34, align: 'right' });
  for (const [ta, s, i] of ORDINI) drawRich(ctx, s, 1590, YE(lg(i)), { size: 32, align: 'left', alpha: P(t, ta, ta + .4) });
  // gli oggetti, quando arrivano
  for (const [ta, v, nome] of OGGETTI) {
    const k = P(t, ta, ta + .4, E.back);
    if (k <= 0) continue;
    dot(ctx, [XR, YE(v)], C.v, k, 9);
    txt(ctx, nome, XR + 30, YE(v), { size: 32, align: 'left', alpha: clamp(k) });
  }
  if (t > 11.2) dot(ctx, [XR, YE(mZoom(t))], C.y, P(t, 11.2, 11.6, E.back), 12);
  // diciassette potenze di dieci
  const k17 = P(t, 80.9, 81.5);
  if (k17 > 0) {
    ctx.save(); ctx.globalAlpha *= k17; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(1772, YE(-10)); ctx.lineTo(1792, YE(-10)); ctx.lineTo(1792, YE(7)); ctx.lineTo(1772, YE(7)); ctx.stroke();
    txt(ctx, '17', 1752, YE(-1.5), { size: 48, weight: 600, color: C.g, align: 'right' });
    ctx.restore();
  }
  ctx.restore();
}

// 0 · titolo (0–7.5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Dall’atomo alla Terra', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}
// in una frase (85.6–96.4)
function scenaFine(ctx, t) {
  if (t < 85.7) return;
  const al = 1 - P(t, 94.1, 95.1);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 85.9 });
    drawRich(ctx, 'Piccolissimo o grandissimo:\nun numero fra 1 e 10 per una {v:potenza di 10}.', W / 2, 290, { size: 64, weight: 600, local: t - 86.3, stagger: .08 });
  });
  const pills = [[490, 'atomo\n≈ {mg:10⁻¹⁰}{g: m}'], [960, 'capello: ordine\ndi grandezza {mg:10⁻⁴}{g: m}'], [1430, 'Terra\n≈ {mg:1,3·10⁷}{g: m}']];
  pills.forEach(([x, s], i) => {
    const a = 87.9 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // i toni dello zoom seguono il segno giallo sul righello delle potenze (da 10 alla meno 10 in basso a 10 alla 7 in alto)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['pop', 11.2, .2],                                               // l'atomo sul righello
    ['pop', 16.2, .6],                                                                // 10 alla meno 10 m
    ['tono', 20.6, 25.6, [0, .02, .17, .32, .34]], ['pop', 25.8, .35],                // mi allontano: il capello
    ['pop', 31.6, .6], ['pop', 35.0, .5],                                             // 7 per 10 alla meno 5, a per 10 alla n
    ['ding', 43.8],                                                                   // ordine di grandezza
    ['tono', 48.2, 53.2, [.34, .36, .47, .59, .6]], ['pop', 53.4, .6],                // ancora: la persona
    ['pop', 54.2, .6],                                                                // 1,7 m
    ['tono', 57.9, 62.9, [.6, .62, .71, .81, .82]], ['pop', 62.0, .8],                // la montagna
    ['pop', 63.6, .6], ['ding', 66.8],                                                // 8,8 per 10 alla 3: ordine 10 alla 4
    ['tono', 70.8, 76.3, [.82, .83, .91, .99, 1]], ['pop', 76.0, 1],                  // fino alla Terra
    ['pop', 77.4, .6],                                                                // 1,3 per 10 alla 7
    ['traccia', 80.9, 81.5],                                                          // 17 ordini di grandezza
    ['soffio', 85.9], ['pop', 87.9, .5], ['pop', 88.4, .6], ['pop', 88.9, .7],        // in una frase
  ];
  return {
    titolo: 'Dall’atomo alla Terra', durata: 96.4, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 20.5, 'piccolissimo'], [20.5, 39.5, 'notazione scientifica'], [39.5, 48.1, 'ordine di grandezza'], [48.1, 85.4, 'fino alla Terra']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaZoom(ctx, t); scenaRighello(ctx, t); scenaFine(ctx, t); },
  };
});
