'use strict';
/* Perché la maniglia è lontana dai cardini — il momento M = F·b: braccio lungo, più rotazione; il braccio si misura dalla retta d'azione. Argomento: equilibrio. */
CVIDEO.registra('equilibrio/momento', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [76.6, 190], [77.9, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [76.6, 1050], [77.9, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [76.6, 2.2], [77.9, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [76.6, 2], [77.9, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [76.6, -1.5], [77.9, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.4, 'felice'], [20.6, 'neutro'],
  [24.9, 'sorpreso'], [27.9, 'neutro'], [43.0, 'felice'], [47.1, 'pensa'], [51.0, 'neutro'], [61.5, 'felice'],
  [65.6, 'pensa'], [68.7, 'neutro'], [73.3, 'sorpreso'], [78.9, 'felice'], [82.4, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché la maniglia sta lontana\ndai cardini?'],
  [7.9, 11.9, 'Una porta vista dall’alto:\nqui i {v:cardini}, lì la maniglia.'],
  [12.0, 17.3, 'La spingo con 20 N a 0,8 m dai cardini,\nper 0,8 s, al rallentatore.'],
  [17.4, 20.5, 'In quel tempo ruota di {g:54°}.'],
  [20.6, 24.8, 'Stessa forza, stesso tempo,\nma a 0,2 m dai cardini…'],
  [24.9, 27.8, '…ruota appena di {r:circa 14°}.'],
  [27.9, 31.6, 'Conta il {v:momento} della forza:\n{mv:M} = {my:F}{mink:·}{mx:b}.'],
  [31.7, 37.0, '{mx:b} è il {x:braccio}: la distanza fra il\ncardine e la {v:retta d’azione} della forza.'],
  [37.1, 42.9, '20 N · 0,8 m = {g:16 N·m};\n20 N · 0,2 m = solo {r:4 N·m}.'],
  [43.0, 47.0, 'Braccio quattro volte più corto,\nmomento quattro volte più piccolo.'],
  [47.1, 50.9, 'E se spingo di sbieco,\na 30° dalla porta?'],
  [51.0, 56.0, 'Il braccio {r:non è} 0,8 m: è la distanza\ndal cardine alla {v:retta d’azione}.'],
  [56.1, 61.4, '{mx:b} = 0,4 m, metà di 0,8 m\n(mezzo triangolo equilatero): {mv:M} = {g:8 N·m}.'],
  [61.5, 65.5, 'Spingo così: la porta ruota di 27°,\nmetà di prima.'],
  [65.6, 68.6, 'E se spingo verso il cardine?'],
  [68.7, 73.2, 'La sua retta passa per il cardine:\n{mx:b} = 0, momento zero.'],
  [73.3, 76.5, 'Spingo pure: la porta {r:non gira}.'],
  [78.9, 83.7, 'Una forza fa girare di più\nquanto più è lungo il suo braccio.'],
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
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
const DEG = 180 / Math.PI;
// la porta: 20 kg, larga 0,9 m, I = m·L²/3 = 5,4 kg·m², 600 px per metro, vista dall'alto; si apre verso il basso
const H = [330, 270], PXM = 600, LPORTA = .9, IPORTA = 20 * LPORTA * LPORTA / 3, F = 20, FS = 6, SPINTA = .8, LENTO = 3;
// le quattro prove: punto di applicazione (m), angolo della forza misurato dalla porta (150° = di sbieco, a 30° dalla porta,
// verso i cardini), inizio della spinta, intervallo in cui si vedono
const PROVE = [
  { q: .8, ang: 90, tp: 12.7, da: 12.2, a: 21.2 },
  { q: .2, ang: 90, tp: 22.0, da: 21.2, a: 47.6 },
  { q: .8, ang: 150, tp: 61.8, da: 47.6, a: 66.1 },
  { q: .8, ang: 180, tp: 73.5, da: 66.1, a: 76.8 },
];
const braccio = Pr => Math.abs(Pr.q * Math.sin(Pr.ang / DEG));   // distanza del cardine dalla retta d'azione
// momento costante per 0,8 s (al rallentatore): θ = ½·(M/I)·τ², poi fermo immagine
function angolo(Pr, t) {
  const tau = clamp((t - Pr.tp) / LENTO, 0, SPINTA);
  return .5 * (F * braccio(Pr) / IPORTA) * tau * tau;
}

// 0 · titolo (0–7,5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Perché la maniglia\nè lontana dai cardini', W / 2, 205, { size: 104, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0), lh: 1.25 }));
}

// 1 · la porta vista dall'alto (7,5–76,6)
function badge(ctx, s, al) {
  if (al <= 0) return;
  txt(ctx, s, 1110, 760, { size: 30, color: C.dim, align: 'right', alpha: al });   // in basso: in alto passano frecce ed etichette
}
function scenePorta(ctx, t) {
  if (t < 7.5 || t > 77) return;
  const al = life(t, 7.6, 76.8, .6, .5);
  card(ctx, 110, 110, 1030, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  const Lp = LPORTA * PXM;
  // il muro, con il vano della porta
  ctx.fillStyle = css(mix(C.dim, C.paper, .35));
  ctx.fillRect(150, H[1] - 15, H[0] - 16 - 150, 30); ctx.fillRect(H[0] + Lp + 14, H[1] - 15, 1100 - H[0] - Lp - 14, 30);
  // la prova in corso (con dissolvenza fra una e l'altra); prima della prima, la porta chiusa
  const prova = PROVE.find(Pr => t >= Pr.da && t < Pr.a);
  const kpr = prova ? life(t, prova.da, prova.a, .5, .5) : 0;
  const th = prova ? angolo(prova, t) : 0;
  const d = [Math.cos(th), Math.sin(th)], nn = [-Math.sin(th), Math.cos(th)];
  // fra una prova e l'altra la porta si richiude: dissolvenza dalla posizione raggiunta alla porta chiusa
  const chiude = prova && prova !== PROVE[3] ? P(t, prova.a - .6, prova.a - .1) : 0;
  const porta = (ang, alfa) => {
    if (alfa <= 0) return;
    ctx.save(); ctx.globalAlpha *= alfa; ctx.translate(H[0], H[1]); ctx.rotate(ang);
    ctx.fillStyle = css(mix(C.dim, C.paper, .62)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(0, -13, Lp, 26, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.roundRect(.85 * PXM - 30, -26, 60, 12, 5); ctx.fill();   // la maniglia
    ctx.restore();
  };
  porta(0, chiude); porta(th, 1 - chiude);
  // i cardini
  M.dot(ctx, H, C.v, 1, 13);
  const kn = life(t, 8.2, 12.1, .4, .4);
  drawRich(ctx, '{v:cardini}', H[0], H[1] - 52, { size: 32, alpha: kn });
  drawRich(ctx, 'maniglia', H[0] + .85 * PXM, H[1] - 62, { size: 32, alpha: kn });
  if (prova) {
    ctx.save(); ctx.globalAlpha *= kpr;
    const sa = Math.sin(prova.ang / DEG), ca = Math.cos(prova.ang / DEG);
    const f = [sa * nn[0] + ca * d[0], sa * nn[1] + ca * d[1]];
    const Q = add(H, d, prova.q * PXM);
    const testa = prova.ang === 180 ? Q : add(Q, f, -13 / sa);
    // la retta d'azione e il braccio, quando Stilla ne parla
    const kr = prova === PROVE[1] ? P(t, 31.9, 32.5) : prova === PROVE[2] ? P(t, 51.2, 51.8) : prova === PROVE[3] ? P(t, 68.9, 69.5) : 0;
    if (kr > 0) {
      const [Ln, Lp2] = prova.ang === 90 ? [140, 260] : prova.ang === 180 ? [130, 570] : [200, 470];
      dashed(ctx, add(Q, f, -Ln), add(Q, f, Lp2), C.v, kr, .9);
      const piede = add(Q, f, (H[0] - Q[0]) * f[0] + (H[1] - Q[1]) * f[1]);
      if (braccio(prova) > .01) {
        ctx.save(); ctx.globalAlpha *= kr; ctx.strokeStyle = css(C.x); ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(H[0], H[1]); ctx.lineTo(piede[0], piede[1]); ctx.stroke();
        // l'angolo retto fra braccio e retta d'azione
        const u = [(piede[0] - H[0]) / Math.hypot(piede[0] - H[0], piede[1] - H[1]), (piede[1] - H[1]) / Math.hypot(piede[0] - H[0], piede[1] - H[1])];
        const a1 = add(piede, u, -18), a2 = add(a1, f, 18 * Math.sign((Q[0] - piede[0]) * f[0] + (Q[1] - piede[1]) * f[1] || 1)), a3 = add(piede, f, 18 * Math.sign((Q[0] - piede[0]) * f[0] + (Q[1] - piede[1]) * f[1] || 1));
        if (prova.ang !== 90) { ctx.lineWidth = 3; ctx.strokeStyle = css(C.ink); ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.lineTo(a3[0], a3[1]); ctx.stroke(); }
        const mezzo = [(H[0] + piede[0]) / 2, (H[1] + piede[1]) / 2], fuori = [-u[1], u[0]];
        // per la spinta perpendicolare l'etichetta va a sinistra, lontana dalla retta d'azione tratteggiata
        drawRich(ctx, '{mx:b} = ' + (Math.abs(braccio(prova) - .2) < .01 ? '0,2' : '0,4') + ' m', ...(prova.ang === 90 ? add(add(mezzo, fuori, 72), d, -55) : add(mezzo, fuori, 100)), { size: 34 });
        ctx.restore();
      } else drawRich(ctx, '{mx:b} = 0', H[0] - 30, H[1] + 56, { size: 34, align: 'right', alpha: kr });
    }
    // la forza: 20 N, 6 px per newton, sempre allo stesso angolo con la porta
    freccia(ctx, add(testa, f, -F * FS), testa, C.y);
    const lato = prova.ang === 150 ? -1 : 1, perp = [lato * f[1], -lato * f[0]];
    const scost = 30 + 78 * Math.abs(perp[0]) + 18 * Math.abs(perp[1]);
    // nella prima prova l'etichetta sta oltre la coda; dove c'è la retta d'azione, di fianco alla freccia
    const posF = prova === PROVE[0] ? add(add(testa, nn, -77), d, -100) : add(add(testa, f, -F * FS / 2), perp, scost);
    // di sbieco: l'angolo di 30° fra la retta della forza e la porta, sotto la porta dalla parte dei cardini
    // la porta fino alla maniglia, 0,8 m: l'ipotenusa del mezzo triangolo equilatero (56,1–61,4)
    const k08 = prova === PROVE[2] ? life(t, 56.2, 61.4, .4, .4) : 0;
    if (k08 > 0) {
      const yq = H[1] - 34;
      ctx.save(); ctx.globalAlpha *= k08; ctx.strokeStyle = css(C.x); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(H[0], yq); ctx.lineTo(Q[0], yq); ctx.moveTo(H[0], yq - 10); ctx.lineTo(H[0], yq + 10); ctx.moveTo(Q[0], yq - 10); ctx.lineTo(Q[0], yq + 10); ctx.stroke();
      drawRich(ctx, '0,8 m', (H[0] + Q[0]) / 2 - 40, yq - 28, { size: 34, fill: css(C.x) });
      ctx.restore();
    }
    if (prova === PROVE[2]) {
      const k30 = P(t, 47.9, 48.4), a0 = Math.atan2(-d[1], -d[0]), a1 = Math.atan2(f[1], f[0]);
      ctx.save(); ctx.globalAlpha *= k30; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      dashed(ctx, Q, add(Q, f, 110), C.v, 1, .9);
      ctx.beginPath(); ctx.arc(Q[0], Q[1], 85, a1, a0); ctx.stroke(); ctx.restore();
      const am = a0 - 20 / DEG;
      drawRich(ctx, '{v:30°}', Q[0] + 130 * Math.cos(am), Q[1] + 130 * Math.sin(am), { size: 34, alpha: k30 });
    }
    drawRich(ctx, '{my:F} = 20 N', ...posF, { size: 32 });
    // l'angolo raggiunto
    const fermo = t > prova.tp + SPINTA * LENTO && prova.ang !== 180;
    if (fermo) {
      const ka = P(t, prova.tp + SPINTA * LENTO, prova.tp + SPINTA * LENTO + .4);
      ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(H[0], H[1], 150, 0, th); ctx.stroke(); ctx.restore();
      // dentro il settore se è largo, altrimenti accanto alla fine dell'arco
      const [rL, aL] = th > 40 / DEG ? [100, th / 2] : [185, th + 17 / DEG];
      drawRich(ctx, '{g:' + Math.round(th * DEG) + '°}', H[0] + rL * Math.cos(aL), H[1] + rL * Math.sin(aL), { size: 36, alpha: ka });
    }
    badge(ctx, 'al rallentatore', life(t, prova.tp, prova.tp + SPINTA * LENTO, .2, .3));
    if (prova.ang !== 180) badge(ctx, 'fermo immagine', life(t, prova.tp + SPINTA * LENTO + .1, prova.a, .2, .4));
    ctx.restore();
  }
  ctx.restore();
}

// la scheda: il momento e la tabella delle prove
const RIGHE = [
  { y: 450, b: '0,8 m', m: '16 N·m', r: '54°', tb: 17.5, tm: 37.2, tr: 17.5 },
  { y: 520, b: '0,2 m', m: '4 N·m', r: '14°', tb: 25.0, tm: 37.6, tr: 25.0 },
  { y: 590, b: '0,4 m', m: '8 N·m', r: '27°', tb: 56.3, tm: 57.6, tr: 64.3 },
  { y: 660, b: '0', m: '0', r: '0°', tb: 69.0, tm: 69.5, tr: 75.8 },
];
function sceneScheda(ctx, t) {
  if (t < 17 || t > 77) return;
  const al = life(t, 17.4, 76.8, .5, .5);
  card(ctx, 1170, 110, 640, 680, al);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => drawRich(ctx, 'momento di una forza', 1490, 165, { size: 36, weight: 600 }));
  drawRich(ctx, '{mv:M} {mink:=} {my:F}{mink:·}{mx:b}', 1490, 255, { size: 64, local: t - 28.0 });
  drawRich(ctx, '{dim:si misura in N·m}', 1490, 318, { size: 30, local: t - 28.6 });
  drawRich(ctx, '{mx:b}', 1260, 385, { size: 38 }); drawRich(ctx, '{mv:M}', 1490, 385, { size: 38, alpha: P(t, 37.2, 37.6) });
  txt(ctx, 'rotazione', 1710, 385, { size: 30, color: C.dim });
  ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1200, 415); ctx.lineTo(1780, 415); ctx.stroke();
  RIGHE.forEach(R => {
    txt(ctx, R.b, 1260, R.y, { size: 36, color: C.x, alpha: P(t, R.tb, R.tb + .4) });
    txt(ctx, R.m, 1490, R.y, { size: 36, color: C.v, alpha: P(t, R.tm, R.tm + .4) });
    txt(ctx, R.r, 1710, R.y, { size: 36, color: C.g, alpha: P(t, R.tr, R.tr + .4) });
  });
  drawRich(ctx, '{dim:spinta di 20 N per 0,8 s}', 1490, 730, { size: 30 });
  ctx.restore();
}

// 2 · in una frase (76,6–86,5)
function sceneFine(ctx, t) {
  if (t < 76.5) return;
  const al = 1 - P(t, 84.6, 85.6);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 76.8 });
    drawRich(ctx, 'La stessa forza fa girare di più\ncon un braccio più lungo.', W / 2, 290, { size: 70, weight: 600, local: t - 77.2, stagger: .09 });
  });
  const pills = [[490, '{mv:M} {mink:=} {my:F}{mink:·}{mx:b}\nin N·m'], [960, 'braccio: distanza\ndalla {v:retta d’azione}'], [1430, 'retta per il cardine:\n{r:nessuna rotazione}']];
  pills.forEach(([x, s], i) => {
    const a = 79.4 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'angolo della porta, da chiusa (.15) a 54° (.95);
  // momento costante: l'angolo cresce col quadrato del tempo (angolo()), per 2,4 s di video
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.2, .5],                                                // la porta dall'alto, cardini e maniglia
    ['pop', 12.2, .55], ['tono', 12.7, 15.1, [.15, .2, .35, .6, .95]],                // 20 N a 0,8 m: ruota
    ['traccia', 15.1, 15.5], ['pop', 15.2, .8],                                       // 54°
    ['soffio', 17.4], ['pop', 17.5, .4],                                              // la scheda, la prima riga
    ['pop', 21.5, .5], ['tono', 22.0, 24.4, [.15, .163, .2, .263, .35]],              // a 0,2 m: ruota appena
    ['traccia', 24.4, 24.8], ['pop', 25.0, .3],                                       // circa 14°
    ['pop', 28.0, .65], ['pop', 28.6, .4],                                            // M = F·b, in N·m
    ['traccia', 31.9, 32.5],                                                          // la retta d'azione e il braccio
    ['ding', 37.3], ['pop', 37.6, .3],                                                // 16 N·m contro 4 N·m
    ['pop', 47.7, .5], ['traccia', 47.9, 48.4],                                       // di sbieco, a 30°
    ['traccia', 51.2, 51.8], ['traccia', 56.2, 56.6], ['pop', 56.3, .45],             // retta d'azione; 0,8 m e b = 0,4 m
    ['ding', 57.6],                                                                   // M = 8 N·m
    ['tono', 61.8, 64.2, [.15, .175, .25, .375, .55]], ['traccia', 64.2, 64.6], ['pop', 64.3, .55],   // ruota di 27°
    ['pop', 66.3, .45], ['traccia', 68.9, 69.5], ['pop', 69.0, .2],                   // verso il cardine: b = 0
    ['tono', 73.5, 74.5, [.15, .15]], ['pop', 75.8, .15],                             // spingo: non gira, 0°
    ['soffio', 76.8], ['pop', 79.4, .5], ['pop', 79.9, .6], ['pop', 80.4, .7],        // in una frase
  ];
  return {
    titolo: 'Perché la maniglia è lontana dai cardini', durata: 86.5, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 27.8, 'due spinte uguali'], [27.8, 47.0, 'il momento'], [47.0, 65.5, 'di sbieco'], [65.5, 76.5, 'verso il cardine']],
    scena(ctx, t) { sceneIntro(ctx, t); scenePorta(ctx, t); sceneScheda(ctx, t); sceneFine(ctx, t); },
  };
});
