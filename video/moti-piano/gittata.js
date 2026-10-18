'use strict';
/* Quarantacinque gradi — lanci a 20 m/s con angoli di 15°, 30°, 45°, 60°, 75°, senza aria: la gittata cresce fino a 45°
   e poi cala; angoli complementari (30° e 60°) arrivano nello stesso punto. R = v₀²·sin(2α)/g. Argomento: moti-piano. */
CVIDEO.registra('moti-piano/gittata', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, TITOLI, conFont, drawRich, txt, drawSeq, fmtN, ball, card, arrowHead, glowStroke, dashed } = M;

  // ---------- il moto vero: x = v₀·cos α·t, y = v₀·sin α·t − ½·g·t² (tempo vero) ----------
  const G = 9.8, V0 = 20, RAD = Math.PI / 180;
  const volo = a => 2 * V0 * Math.sin(a * RAD) / G;                    // tempo di volo
  const gittata = a => V0 * V0 * Math.sin(2 * a * RAD) / G;            // R = v₀²·sin(2α)/g
  const punto = (a, t) => [V0 * Math.cos(a * RAD) * t, V0 * Math.sin(a * RAD) * t - G * t * t / 2];
  const O = [410, 720], U = 21;                                        // origine del lancio, 21 px per metro
  const S = (x, y) => [O[0] + x * U, O[1] - y * U];
  const ANGOLI = [15, 30, 45, 60, 75];
  const LANCIO = { 15: 17.2, 30: 22.9, 45: 28.4, 60: 35.6, 75: 43.6 };
  const RILANCIO = 70.6;                                               // 30° e 60° rilanciati insieme
  const alfa = t => kf(t, [[22.4, 15], [22.8, 30], [28.0, 30], [28.3, 45], [35.1, 45], [35.5, 60], [43.1, 60], [43.5, 75]]);
  const VS = 6;                                                        // freccia di v₀: 6 px per m/s
  const traccia = (a, k = 1) => Array.from({ length: 61 }, (_, i) => S(...punto(a, volo(a) * k * i / 60)));

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [99.2, 190], [100.5, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [99.2, 1050], [100.5, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [99.2, 2.2], [100.5, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [99.2, 2], [100.5, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [99.2, -1.5], [100.5, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [31.6, 'felice'], [35.1, 'neutro'],
    [39.4, 'sorpreso'], [43.1, 'neutro'], [50.8, 'felice'], [55.4, 'pensa'], [60.9, 'neutro'], [74.6, 'felice'],
    [80.2, 'neutro'], [88.7, 'pensa'], [93.7, 'felice'], [101.8, 'felice'], [104.8, 'occhiolino'],
  ];
  // un fumetto mentre la pallina vola, e i metri solo dopo che è atterrata
  const FUMETTI = [
    [2.4, 6.4, 'A che angolo si lancia\nper arrivare più lontano?'],
    [7.9, 12.4, 'Lancio sempre a 20 m/s: è la\nvelocità di lancio, {mx:v₀}.'],
    [12.6, 16.7, 'Senza aria. Cambio solo\nl’angolo {mink:α} sopra il suolo.'],
    [16.9, 19.2, 'Lancio a 15°…'],
    [19.4, 22.2, '…e arriva a 20,4 m.'],
    [22.4, 25.1, 'Alzo a 30°…'],
    [25.3, 27.8, '…più lontano: 35,3 m.'],
    [28.0, 31.4, 'Alzo a 45°…'],
    [31.6, 34.9, '…il più lontano di tutti:\n{g:40,8 m}.'],
    [35.1, 39.2, 'A 60° sale molto più in alto…'],
    [39.4, 42.9, '…e atterra a 35,3 m,\n{g:come a 30°}!'],
    [43.1, 47.6, 'E a 75°…'],
    [47.8, 50.6, '…20,4 m, {g:come a 15°}.'],
    [50.8, 55.2, 'Angoli che sommati fanno 90°\narrivano nello {g:stesso punto}.'],
    [55.4, 60.7, 'Perché? Divido la velocità di lancio\nin una parte di lato e una in su.'],
    [60.9, 65.4, 'A 30°: di lato 17,3 m/s,\nin su 10 m/s.'],
    [65.6, 70.2, 'A 60° il contrario: di lato\n10 m/s, in su 17,3 m/s.'],
    [70.4, 74.4, 'Li rilancio insieme: a 60°\nresta in aria di più…'],
    [74.6, 79.9, '…3,53 s contro 2,04 s, ma va più piano\ndi lato: {g:stessa strada}, 35,3 m.'],
    [80.2, 84.7, 'Partenza e arrivo alla stessa\naltezza, senza aria: la gittata {mink:R}.'],
    [84.9, 88.5, '{mv:g} = 9,8 m/s² è l’accelerazione\ndi gravità.'],
    [88.7, 93.5, '{mink:sin(2α)} vale al massimo 1:\nquando {mink:2α} = 90°, cioè {mink:α} = 45°.'],
    [93.7, 99.0, 'A 30° e 60°, {mink:2α} vale 60° e 120°:\n{g:sin 60° = sin 120°}.'],
    [101.8, 107.1, 'Senza aria si va più lontano a 45°;\n30° e 60° arrivano allo stesso punto.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 7) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1.3, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    if (L > 14 * s) {
      ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke();
    }
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  // colore e alfa di una traiettoria già lanciata, a seconda del momento
  function stile(a, t) {
    const col = a === 45 ? C.g : C.y;
    let al = .4;
    if (t > 50.8 && t < 55.4) al = a === 45 ? .25 : 1;                 // le coppie che arrivano insieme
    else if (t >= 55.4 && t < 80.0) al = a === 30 || a === 60 ? 1 : .18;   // il confronto 30°–60°
    else if (t >= 80.0) al = a === 45 ? 1 : .4;
    return [col, al];
  }

  // ---------- il campo di lancio ----------
  function scenaPalco(ctx, t) {
    if (t < 7.5 || t > 99.8) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 99.0, 99.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 372, 108, 930, 692);
    ctx.fillStyle = css(C.g, .26); ctx.beginPath(); ctx.roundRect(373, O[1], 928, 79, [0, 0, 21, 21]); ctx.fill();
    // la scala in metri sul suolo
    ctx.save(); ctx.globalAlpha *= P(t, 8.0, 8.6);
    ctx.strokeStyle = css(C.ink, .6); ctx.lineWidth = 2;
    for (let k = 0; k <= 4; k++) {
      const x = S(10 * k, 0)[0];
      ctx.beginPath(); ctx.moveTo(x, O[1]); ctx.lineTo(x, O[1] + 12); ctx.stroke();
      txt(ctx, k === 4 ? '40 m' : String(10 * k), x, O[1] + 42, { size: 30, color: C.dim });
    }
    ctx.restore();
    drawRich(ctx, '{mx:v₀} = 20 m/s, senza aria', 404, 160, { size: 36, align: 'left', alpha: P(t, 8.0, 8.6) });
    const a = alfa(t);
    drawRich(ctx, `{mink:α} = ${Math.round(a)}°`, 1270, 160, { size: 40, align: 'right', alpha: life(t, 12.8, 54.9, .5, .5) });

    // le traiettorie: quella in volo piena, quelle finite più chiare
    for (const an of ANGOLI) {
      const L = LANCIO[an]; if (t < L) continue;
      const k = clamp((t - L) / volo(an));
      const [col, a2] = stile(an, t);
      if (k < 1) glowStroke(ctx, traccia(an, k), 1, C.y, 5);
      else { ctx.save(); ctx.globalAlpha *= a2; glowStroke(ctx, traccia(an), 1, col, 4); ctx.restore(); }
      // il segno dove atterra
      const xr = S(gittata(an), 0)[0], km = P(t, L + volo(an), L + volo(an) + .3);
      if (km > 0) {
        ctx.save(); ctx.globalAlpha *= km * Math.max(.5, a2); ctx.fillStyle = css(col);
        ctx.beginPath(); ctx.moveTo(xr, O[1] + 2); ctx.lineTo(xr - 9, O[1] + 18); ctx.lineTo(xr + 9, O[1] + 18); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    // le palline in volo (anche nel rilancio di 30° e 60°)
    const voli = ANGOLI.map(an => [an, LANCIO[an]]).concat([[30, RILANCIO], [60, RILANCIO]]);
    for (const [an, L] of voli) {
      const tv = t - L, T = volo(an);
      if (tv < 0 || tv > T + .5) continue;
      ball(ctx, ...S(...punto(an, Math.min(tv, T))), '', C.y, { r: 12, alpha: 1 - P(tv, T + .1, T + .5) });
    }
    // il lanciatore, con v₀ e l'angolo
    const ka = life(t, 8.4, 54.9, .5, .5);
    ctx.save(); ctx.translate(...O);
    ctx.fillStyle = css(C.dim); ctx.beginPath(); ctx.arc(0, 0, 20, Math.PI, 0); ctx.fill();
    ctx.rotate(-a * RAD); ctx.fillStyle = css(C.dim, .8); ctx.beginPath(); ctx.roundRect(-6, -11, 52, 22, 8); ctx.fill();
    ctx.restore();
    const d = [Math.cos(a * RAD), -Math.sin(a * RAD)];
    freccia(ctx, O, [O[0] + d[0] * V0 * VS, O[1] + d[1] * V0 * VS], C.x, ka);
    drawRich(ctx, '{mx:v₀}', O[0] + d[0] * 96 + d[1] * 40, O[1] + d[1] * 96 - d[0] * 40, { size: 40, alpha: ka });
    const kAng = life(t, 12.8, 22.3, .5, .5);
    if (kAng > 0) {
      ctx.save(); ctx.globalAlpha *= kAng; ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(O[0], O[1], 64, -a * RAD, 0); ctx.stroke(); ctx.restore();
      drawRich(ctx, '{mink:α}', O[0] + 84, O[1] + 30, { size: 36, alpha: kAng });   // fuori dall'angolo, dove non passano né la traiettoria né v₀
    }
    ctx.restore();
  }

  // ---------- il pannello ----------
  const PX0 = 1325, PCX = 1582;
  function scenaPannello(ctx, t) {
    if (t < 12.6 || t > 99.8) return;
    const al = P(t, 12.6, 13.1) * (1 - P(t, 99.0, 99.6));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, PX0, 108, 515, 692);
    const tit = s => conFont(TITOLI, () => drawRich(ctx, s, PCX, 168, { size: 36, weight: 600 }));
    // 1 · la tabella dei cinque lanci
    const s1 = 1 - P(t, 55.0, 55.5);
    if (s1 > 0) {
      ctx.save(); ctx.globalAlpha *= s1;
      tit('cinque lanci');
      txt(ctx, 'angolo', 1370, 232, { size: 30, color: C.dim, align: 'left' });
      txt(ctx, 'in aria', 1560, 232, { size: 30, color: C.dim });
      txt(ctx, 'gittata', 1795, 232, { size: 30, color: C.dim, align: 'right' });
      ANGOLI.forEach((an, i) => {
        const y = 300 + 64 * i, L = LANCIO[an], fin = L + volo(an), k = P(t, fin, fin + .35);
        const col = an === 45 ? C.g : C.ink;
        txt(ctx, an + '°', 1370, y, { size: 40, align: 'left', alpha: P(t, L - .5, L - .1) });
        txt(ctx, fmtN(volo(an), 2) + ' s', 1560, y, { size: 36, alpha: k });
        txt(ctx, fmtN(gittata(an), 1) + ' m', 1795, y, { size: 38, weight: an === 45 ? 600 : 500, color: col, align: 'right', alpha: k });
      });
      // le coppie che arrivano nello stesso punto
      const kc = P(t, 51.0, 51.5);
      if (kc > 0) {
        ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
        for (const [x, i, j] of [[1812, 1, 3], [1826, 0, 4]]) {
          const ya = 300 + 64 * i, yb = 300 + 64 * j;
          ctx.beginPath(); ctx.moveTo(x - 8, ya); ctx.lineTo(x, ya); ctx.lineTo(x, yb); ctx.lineTo(x - 8, yb); ctx.stroke();
        }
        ctx.restore();
        drawRich(ctx, '15° + 75° = {g:90°}', PCX, 650, { size: 36, alpha: kc });
        drawRich(ctx, '30° + 60° = {g:90°}', PCX, 710, { size: 36, alpha: P(t, 51.3, 51.8) });
      }
      ctx.restore();
    }
    // 2 · perché: 30° e 60° a confronto
    const s2 = life(t, 55.4, 80.0, .4, .4);
    if (s2 > 0) {
      ctx.save(); ctx.globalAlpha *= s2;
      tit('perché?');
      const cols = [[30, 1600, 1545], [60, 1752, 1712]];
      for (const [an, cx, ox] of cols) {
        txt(ctx, an + '°', cx, 232, { size: 40, weight: 600 });
        const vx = V0 * Math.cos(an * RAD), vy = V0 * Math.sin(an * RAD), oy = 440, k5 = 5;
        const kd = P(t, 55.8, 56.4), kc = P(t, 57.0, 57.6);   // le componenti appena si dice «divido»; i numeri dopo
        freccia(ctx, [ox, oy], [ox + vx * k5 * kc, oy], C.x, .5 * kc, 5);
        freccia(ctx, [ox, oy], [ox, oy - vy * k5 * kc], C.x, .5 * kc, 5);
        dashed(ctx, [ox + vx * k5, oy - vy * k5], [ox + vx * k5, oy], C.dim, 1, .7 * kc);
        dashed(ctx, [ox + vx * k5, oy - vy * k5], [ox, oy - vy * k5], C.dim, 1, .7 * kc);
        freccia(ctx, [ox, oy], [ox + vx * k5, oy - vy * k5], C.x, kd, 6);
        const k1 = P(t, an === 30 ? 61.1 : 65.8, an === 30 ? 61.6 : 66.3);
        txt(ctx, fmtN(vx, vx > 15 ? 1 : 0) + ' m/s', cx, 500, { size: 30, color: C.x, alpha: k1 });
        txt(ctx, fmtN(vy, vy > 15 ? 1 : 0) + ' m/s', cx, 560, { size: 30, color: C.x, alpha: k1 });
        const fin = RILANCIO + volo(an);
        txt(ctx, fmtN(volo(an), 2) + ' s', cx, 625, { size: 32, alpha: P(t, fin, fin + .35) });
        txt(ctx, '35,3 m', cx, 690, { size: 34, weight: 600, color: C.g, alpha: P(t, 75.4, 75.9) });
      }
      txt(ctx, 'di lato', 1365, 500, { size: 30, color: C.dim, align: 'left', alpha: P(t, 61.1, 61.6) });
      txt(ctx, 'in su', 1365, 560, { size: 30, color: C.dim, align: 'left', alpha: P(t, 61.1, 61.6) });
      txt(ctx, 'in aria', 1365, 625, { size: 30, color: C.dim, align: 'left', alpha: P(t, 70.6, 71.1) });
      txt(ctx, 'strada', 1365, 690, { size: 30, color: C.dim, align: 'left', alpha: P(t, 75.4, 75.9) });
      txt(ctx, '17,3 · 2,04 ≈ 10 · 3,53', PCX, 752, { size: 30, color: C.dim, alpha: P(t, 76.0, 76.5) });
      ctx.restore();
    }
    // 3 · la formula e il grafico della gittata
    const s3 = P(t, 80.2, 80.6);
    if (s3 > 0) {
      ctx.save(); ctx.globalAlpha *= s3;
      tit('la gittata');
      drawSeq(ctx, ['{mink:R =}', { num: '{mx:v₀²}{mink:·sin(2α)}', den: '{mv:g}' }], PCX, 262, 48, { local: t - 80.4 });
      drawRich(ctx, '{mv:g} = 9,8 m/s² (gravità)', PCX, 350, { size: 30, alpha: P(t, 80.8, 81.3) });
      const kg = P(t, 88.8, 89.5);
      if (kg > 0) {
        const GX = 1400, GY = 625, AX = 4.3, RY = 4.6;
        const gS = (an, r) => [GX + an * AX, GY - r * RY];
        ctx.save(); ctx.globalAlpha *= kg;
        ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(GX, GY - 212); ctx.lineTo(GX, GY); ctx.lineTo(GX + 400, GY); ctx.stroke();
        arrowHead(ctx, [GX + 406, GY], 0, C.ink); arrowHead(ctx, [GX, GY - 218], -Math.PI / 2, C.ink);
        ctx.lineWidth = 2;
        for (let an = 15; an <= 90; an += 15) { ctx.beginPath(); ctx.moveTo(gS(an, 0)[0], GY); ctx.lineTo(gS(an, 0)[0], GY + 10); ctx.stroke(); }
        for (const an of [15, 45, 75]) txt(ctx, an + '°', gS(an, 0)[0], GY + 32, { size: 30, color: C.dim });
        for (const r of [20, 40]) { ctx.beginPath(); ctx.moveTo(GX - 10, gS(0, r)[1]); ctx.lineTo(GX, gS(0, r)[1]); ctx.stroke(); txt(ctx, String(r), GX - 16, gS(0, r)[1], { size: 30, color: C.dim, align: 'right' }); }
        drawRich(ctx, '{mink:R} (m)', GX + 18, GY - 216, { size: 32, align: 'left' });
        drawRich(ctx, '{mink:α}', GX + 400, GY - 34, { size: 36 });
        glowStroke(ctx, Array.from({ length: 91 }, (_, i) => gS(i, gittata(i))), P(t, 89.0, 90.3), C.y, 4);
        dashed(ctx, gS(30, gittata(30)), gS(60, gittata(60)), C.g, P(t, 93.9, 94.5), 1);
        for (const an of ANGOLI) ball(ctx, ...gS(an, gittata(an)), '', an === 45 ? C.g : C.y, { r: 9, scale: P(t, 89.5 + an / 60, 89.9 + an / 60, E.back) });
        txt(ctx, '40,8', gS(45, 0)[0], gS(45, gittata(45))[1] - 34, { size: 30, weight: 600, color: C.g, alpha: P(t, 90.5, 90.9) });
        ctx.restore();
      }
      drawRich(ctx, 'a 45°: 20²/9,8 ≈ {g:40,8 m}', PCX, 705, { size: 34, alpha: P(t, 90.9, 91.4) });
      drawRich(ctx, '{mink:2α}: sin 60° = sin 120° ≈ 0,87', PCX, 756, { size: 32, alpha: P(t, 93.9, 94.4) });
      ctx.restore();
    }
    ctx.restore();
  }

  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Quarantacinque gradi', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 99.4) return;
    const al = 1 - P(t, 107.6, 108.6);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 99.6 });
      drawRich(ctx, 'Senza aria la gittata è massima a {g:45°};\n30° e 60° arrivano nello stesso punto.', W / 2, 290, { size: 62, weight: 600, local: t - 100.0, stagger: .08 });
    });
    const pills = [[490, '{mink:R =} {mx:v₀²}{mink:·sin(2α)/}{mv:g}'], [960, '45°: il massimo,\n40,8 m a 20 m/s'], [1430, '30° e 60°:\n{g:stesso punto}']];
    pills.forEach(([x, s], i) => {
      const a = 101.2 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // i toni dei lanci seguono l'altezza della pallina (rieseguito il moto con node: 0 al suolo, 1 a circa 20 m)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['traccia', 8.0, 8.6],                                           // il campo, v0
    ['tono', 17.2, 18.26, [.05, .09, .11, .11, .11, .09, .05]], ['pop', 18.26, .4],   // 15 gradi: 20,4 m
    ['tono', 22.9, 24.94, [.05, .18, .26, .29, .26, .18, .05]], ['pop', 24.94, .45],  // 30 gradi: 35,3 m
    ['tono', 28.4, 31.29, [.05, .32, .48, .53, .48, .32, .05]], ['ding', 31.29],      // 45 gradi: il più lontano
    ['tono', 35.6, 39.13, [.05, .45, .69, .77, .69, .45, .05]], ['ding', 39.13],      // 60 gradi: come a 30
    ['tono', 43.6, 47.54, [.05, .55, .85, .95, .85, .55, .05]], ['ding', 47.54],      // 75 gradi: come a 15
    ['traccia', 51.0, 51.5], ['pop', 51.0, .55],                                      // le coppie: 90 gradi
    ['soffio', 55.4], ['pop', 55.8, .5], ['traccia', 57.0, 57.6],                     // perché: le componenti
    ['pop', 61.1, .5], ['pop', 65.8, .6],                                             // di lato e in su
    ['tono', 70.6, 72.64, [.05, .18, .26, .29, .26, .18, .05]],                       // rilanciati insieme: 30 gradi
    ['tono', 70.6, 74.13, [.05, .45, .69, .77, .69, .45, .05]],                       // e 60 gradi
    ['ding', 75.4],                                                                   // stessa strada, 35,3 m
    ['soffio', 80.2], ['pop', 80.4, .6],                                              // la formula della gittata
    ['traccia', 88.8, 89.5], ['tono', 89.0, 90.3, [.05, .1, .45, .95, .45, .1, .05]], // il grafico di R: sale e scende
    ['pop', 89.75, .5], ['pop', 90.0, .65], ['pop', 90.25, .7], ['pop', 90.5, .65], ['pop', 90.75, .5],   // i cinque lanci
    ['ding', 90.9],                                                                   // a 45 gradi: 40,8 m
    ['traccia', 93.9, 94.5], ['pop', 93.9, .6],                                       // sin 60 = sin 120
    ['soffio', 99.6], ['pop', 101.2, .5], ['pop', 101.7, .6], ['pop', 102.2, .7],     // in una frase
  ];
  return {
    titolo: 'Quarantacinque gradi', durata: 109.7, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 55.2, 'cinque angoli'], [55.2, 80.0, '30° e 60°'], [80.0, 99.0, 'la formula della gittata']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaPalco(ctx, t); scenaPannello(ctx, t); scenaFine(ctx, t); },
  };
});

