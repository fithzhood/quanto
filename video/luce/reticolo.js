'use strict';
/* I colori del CD — il reticolo di diffrazione: tante fenditure (o solchi) alla stessa distanza d. La diffrazione da una
   fenditura e le due fenditure si danno per note (onde/diffrazione, luce/young). Con 2 fenditure frange larghe (cos²β),
   con 10 i massimi restano agli stessi angoli ma si stringono ((sin Nβ / N sin β)², β = π·d·sin θ/λ, normalizzata al
   massimo; fenditure strette, senza l'inviluppo della fenditura singola, come in young), con migliaia restano righe sottilissime: le onde di tutte le fenditure arrivano a passo solo se
   d·sin θ = n·λ (n = ordine). CD: spirale con passo d = 1,6 μm. Verde 532 nm: n = 1 a 19,4°, n = 2 a 41,7°,
   n = 3 a 86,0°. Luce bianca: violetto 400 nm a 14,5°, rosso 700 nm a 25,9° (primo ordine); secondo ordine da 30,0° a
   61,0°; il terzo esiste solo fino a 533 nm (da 48,6° in su) e si sovrappone al secondo: lo si vede, non lo si commenta.
   Il CD fa lo stesso per riflessione (luce perpendicolare al disco); guardando a 20° si vede λ = d·sin θ ≈ 547 nm,
   a 25° ≈ 676 nm. Angoli VERI sul disegno (θ dall'asse); le righe del reticolo «a migliaia» sono disegnate larghe 0,5°
   per vederle. Colori veri della luce (approssimazione di Bruton, come in maxwell/spettro). Argomento: luce. */
CVIDEO.registra('luce/reticolo', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, dashed, dot } = M;
  const TAU = Math.PI * 2, DEG = Math.PI / 180;

const T_FINE = 85.0;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [8.0, 'neutro'], [17.6, 'pensa'], [22.6, 'neutro'],
  [27.2, 'sorpreso'], [32.0, 'felice'], [36.6, 'neutro'], [41.4, 'pensa'], [46.2, 'neutro'], [50.8, 'felice'],
  [55.6, 'neutro'], [60.2, 'festa'], [65.5, 'neutro'], [70.2, 'sorpreso'], [75.0, 'pensa'], [80.3, 'festa'], [87.5, 'felice'], [91.5, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.6, 'Perché un CD alla luce si colora\ncome un arcobaleno?'],
  [8.0, 12.8, 'Sul CD i dati stanno su una spirale:\ni giri distano 1,6 µm.'],
  [13.0, 17.4, 'Righe uguali, a distanza fissa {mink:d}:\nè un {v:reticolo}.'],
  [17.6, 22.4, 'Prima con un reticolo a fenditure\ne luce {g:verde}, di un colore solo.'],
  [22.6, 27.0, 'Con due fenditure: frange larghe\ne sfumate, come in Young.'],
  [27.2, 31.8, 'Con dieci, i massimi restano al loro\nposto ma diventano {g:sottili}.'],
  [32.0, 36.4, 'Con migliaia di righe, come sul CD,\nrestano solo linee sottilissime.'],
  [36.6, 41.2, 'Fra due fenditure vicine la differenza\ndi percorso è {mink:d·sin θ}…'],
  [41.4, 46.0, '…e tutte arrivano a passo solo se\n{mink:d·sin θ = n·λ}.'],
  [46.2, 50.6, '{mink:n} è l’{v:ordine}: 0 dritto,\npoi 1, 2, 3 di lato.'],
  [50.8, 55.4, 'Per il {g:verde} il primo\nordine va a 19,4°.'],
  [55.6, 60.0, 'Ogni colore ha la sua {mink:λ},\nquindi il suo angolo.'],
  [60.2, 65.3, 'Luce bianca: violetto a 14,5°,\nrosso a 25,9°.'],
  [65.5, 70.0, 'Nel secondo ordine lo spettro si\nallarga: da 30° a 61°.'],
  [70.2, 74.95, 'Da 49° in su si sovrappone il terzo\nordine: i colori si mescolano.'],
  [75.0, 80.1, 'Il CD fa lo stesso per {v:riflessione}:\nogni solco rimanda un po’ di luce.'],
  [80.3, 84.8, 'Da dove guardi arriva un colore\ndiverso: ecco l’{g:arcobaleno}.'],
  [87.5, 93.3, 'Il reticolo manda ogni colore al suo\nangolo: {mink:d·sin θ = n·λ}.'],
];

// ---------- aiutanti ----------
function chip(ctx, s, x, y, al = 1, size = 30) {
  if (al <= 0) return;
  const w = M.richW(ctx, s, size) + 22;
  ctx.save(); ctx.globalAlpha *= al * .92; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * .72, w, size * 1.44, 10); ctx.fill(); ctx.restore();
  drawRich(ctx, s, x, y, { size, alpha: al });
}
function linea(ctx, a, b, col, w, al = 1) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
// il colore vero della luce di lunghezza d'onda nm (approssimazione di Bruton, come in maxwell/spettro)
function colLuce(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
  const q = v => 255 * Math.pow(clamp(v * k), .8);
  return [q(r), q(g), q(b)];
}

// ---------- la fisica del reticolo ----------
const D_UM = 1.6, VERDE = 532;
const angolo = (nm, n) => { const s = n * nm / 1000 / D_UM; return s <= 1 ? Math.asin(s) : null; };   // rad
// intensità (normalizzata al massimo) a un angolo th per N fenditure; N = 0 vuol dire «migliaia»: righe larghe 0,5°
const LARGA = .5 * DEG;
function intensita(th, nm, N) {
  if (!N) { let I = 0; for (let n = -3; n <= 3; n++) { const a = angolo(nm, Math.abs(n)); if (a == null) continue; const z = (th - (n < 0 ? -a : a)) / LARGA; I += Math.exp(-z * z); } return Math.min(1, I); }
  const b = Math.PI * D_UM * 1000 * Math.sin(th) / nm, s = Math.sin(b);
  if (Math.abs(s) < 1e-6) return 1;
  const r = Math.sin(N * b) / (N * s);
  return r * r;
}
// la luce bianca sulle righe sottili: somma dei colori, precalcolata una volta (tabella fissa, non stato)
const BIANCA = (() => {
  const out = [];
  for (let i = 0; i <= 980; i++) {
    const th = (-8 + i * .1) * DEG; let r = 0, g = 0, b = 0;
    for (let nm = 400; nm <= 700; nm += 4) {
      // negli ordini alti i colori si allargano molto: ogni riga si allarga quanto il passo di 4 nm, con la stessa energia
      let I = 0;
      for (let n = 0; n <= 3; n++) {
        const a = angolo(nm, n); if (a == null) continue;
        const w = Math.max(LARGA, .7 * n * 4 / (D_UM * 1000 * Math.cos(a))), z = (th - a) / w;
        I += Math.exp(-z * z) * LARGA / w;
      }
      if (I < .002) continue;
      const c = colLuce(nm); r += I * c[0]; g += I * c[1]; b += I * c[2];
    }
    out.push([r, g, b].map(v => 255 * (1 - Math.exp(-v / 600))));   // compressione: il secondo ordine, più sparso, resta visibile
  }
  return out;
})();
const bianca = th => BIANCA[clamp(Math.round((th / DEG + 8) * 10), 0, BIANCA.length - 1)];
const BUIO = [18, 20, 26];                                            // lo schermo al buio (in tutti e due i temi)

// ---------- 1 · il CD e i suoi solchi (8–17,4) ----------
const CD = [400, 455], RCD = 260;
function scenaCD(ctx, t) {
  const al = life(t, 7.8, 17.6, .5, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il disco argentato, con due ventagli di colori dove la luce lo prende di sbieco (solo illustrazione)
  ctx.fillStyle = css(mix(C.dim, C.paper, .55)); ctx.beginPath(); ctx.arc(CD[0], CD[1], RCD, 0, TAU); ctx.fill();
  for (let i = 0; i < 40; i++) {
    const nm = 400 + i * 7.5, a0 = -1.05 + i * .022;
    ctx.fillStyle = css(colLuce(nm), .55);
    for (const s of [0, Math.PI]) { ctx.beginPath(); ctx.moveTo(CD[0], CD[1]); ctx.arc(CD[0], CD[1], RCD - 6, a0 + s, a0 + .024 + s); ctx.closePath(); ctx.fill(); }
  }
  ctx.strokeStyle = css(C.paper, .35); ctx.lineWidth = 1;
  for (let r = 70; r < RCD; r += 9) { ctx.beginPath(); ctx.arc(CD[0], CD[1], r, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(CD[0], CD[1], 38, 0, TAU); ctx.fill();
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(CD[0], CD[1], RCD, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(CD[0], CD[1], 38, 0, TAU); ctx.stroke();
  // l'ingrandimento di un pezzetto
  const kz = P(t, 9.0, 9.8), Q = [CD[0] + 180, CD[1] - 60], ZC = [960, 455], ZR = 230;
  if (kz > 0) {
    ctx.save(); ctx.globalAlpha *= kz;
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(Q[0], Q[1], 22, 0, TAU); ctx.stroke();
    ctx.setLineDash([6, 8]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(Q[0] + 8, Q[1] - 20); ctx.lineTo(ZC[0] - 60, ZC[1] - ZR + 8); ctx.moveTo(Q[0] + 8, Q[1] + 20); ctx.lineTo(ZC[0] - 60, ZC[1] + ZR - 8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = css(mix(C.dim, C.paper, .5)); ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR, 0, TAU); ctx.clip();
    ctx.fillStyle = css(C.ink, .55);
    for (let x = ZC[0] - ZR; x < ZC[0] + ZR; x += 64) ctx.fillRect(x + 22, ZC[1] - ZR, 20, 2 * ZR);
    ctx.restore();
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ZC[0], ZC[1], ZR, 0, TAU); ctx.stroke();
    // il passo fra due solchi
    const xa = ZC[0] - ZR + 64 * 3 + 32, xb = xa + 64, y = ZC[1] + 40;
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke();
    arrowHead(ctx, [xa - 2, y], Math.PI, C.v, .8); arrowHead(ctx, [xb + 2, y], 0, C.v, .8);
    chip(ctx, '{v:1,6 µm}', (xa + xb) / 2, y + 44, P(t, 10.4, 10.9), 34);
    chip(ctx, '{mink:d}', (xa + xb) / 2, y - 44, P(t, 13.2, 13.7), 36);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 2 · il reticolo e lo schermo ad arco (17,6–80) ----------
const G = [220, 700], RA = 560, A0 = -8 * DEG, A1 = 89 * DEG;
const Nfend = t => t < 27.2 ? 2 : t < 32.0 ? 10 : 0;                  // 0 = migliaia
const pA = (th, r) => [G[0] + r * Math.cos(th), G[1] - r * Math.sin(th)];
// il colore dello schermo all'angolo th, all'istante t
function colore(th, t) {
  if (t < 55.7) {   // luce verde: 2, 10, migliaia di fenditure (con dissolvenza fra un caso e l'altro)
    const k1 = P(t, 27.2, 27.8), k2 = P(t, 32.0, 32.6);
    const I = lerp(lerp(intensita(th, VERDE, 2), intensita(th, VERDE, 10), k1), intensita(th, VERDE, 0), k2);
    return mix(BUIO, colLuce(VERDE), I * P(t, 22.7, 23.4));
  }
  // tre colori (violetto, verde, rosso), poi la luce bianca
  const tre = [400, VERDE, 700].reduce((c, nm) => { const I = intensita(th, nm, 0), q = colLuce(nm); return [c[0] + I * q[0], c[1] + I * q[1], c[2] + I * q[2]]; }, [0, 0, 0]);
  const k3 = P(t, 55.8, 56.6), kb = P(t, 60.3, 61.1);
  const c3 = mix(colLuce(VERDE).map((v, i) => v * intensita(th, VERDE, 0)), tre.map(v => Math.min(255, v)), k3);
  const c = mix(c3, bianca(th), kb);
  return [Math.max(BUIO[0], c[0]), Math.max(BUIO[1], c[1]), Math.max(BUIO[2], c[2])];
}
function scenaReticolo(ctx, t) {
  const al = life(t, 17.4, T_FINE, .5, .5);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  const rifl = P(t, 75.1, 75.8);
  // lo schermo ad arco, angolo per angolo
  ctx.lineWidth = 30;
  for (let a = A0; a < A1; a += .25 * DEG) {
    ctx.strokeStyle = css(colore(a + .125 * DEG, t));
    ctx.beginPath(); ctx.arc(G[0], G[1], RA, -(a + .32 * DEG), -a); ctx.stroke();
  }
  ctx.strokeStyle = css(C.dim, .8); ctx.lineWidth = 2;   // il bordo dello schermo: la riga bianca al centro si vede anche sulla carta
  for (const r of [RA - 15, RA + 15]) { ctx.beginPath(); ctx.arc(G[0], G[1], r, -A1, -A0); ctx.stroke(); }
  // le direzioni in cui va la luce, con le righe sottili del verde
  const kD = life(t, 32.4, 55.6, .5, .4);
  if (kD > 0) [0, 1, 2, 3].forEach(n => { const a = angolo(VERDE, n); dashed(ctx, G, pA(a, RA - 18), colLuce(VERDE), 1, kD * .8); });
  // la luce che arriva: da sinistra attraverso le fenditure, poi (CD) da destra, riflessa
  const verde = colLuce(VERDE), kIn = P(t, 22.7, 23.2) * (1 - rifl);
  if (kIn > 0) {
    const cIn = t < 55.7 ? verde : mix(verde, [255, 255, 255], P(t, 60.3, 61.1));
    ctx.save(); ctx.globalAlpha *= kIn * .8; ctx.fillStyle = css(cIn, .35); ctx.fillRect(126, G[1] - 70, G[0] - 132, 140); ctx.restore();
    for (const dy of [-45, 0, 45]) arrowHead(ctx, [G[0] - 22, G[1] + dy], 0, cIn, kIn);
  }
  if (rifl > 0) {
    ctx.save(); ctx.globalAlpha *= rifl;
    for (const dy of [-40, 40]) { linea(ctx, [G[0] + RA - 70, G[1] + dy], [G[0] + 40, G[1] + dy], C.dim, 3, 1); arrowHead(ctx, [G[0] + 34, G[1] + dy], Math.PI, C.dim, 1); }
    chip(ctx, '{dim:luce bianca}', G[0] + 260, G[1], 1, 30);
    ctx.restore();
  }
  // il reticolo: fenditure (2, 10, migliaia) oppure, per il CD, una superficie a solchi che riflette
  ctx.save(); ctx.fillStyle = css(C.ink, .85 * (1 - rifl));
  const N = Nfend(t), y0 = G[1] - 100, y1 = G[1] + 96;
  if (t < 22.6) ctx.fillRect(G[0] - 5, y0, 10, y1 - y0);
  else if (N) { const passo = N === 2 ? 60 : 16, ys = []; for (let i = 0; i < N; i++) ys.push(G[1] + (i - (N - 1) / 2) * passo); let y = y0; ys.forEach(s => { ctx.fillRect(G[0] - 5, y, 10, s - 3 - y); y = s + 3; }); ctx.fillRect(G[0] - 5, y, 10, y1 - y); }
  else for (let y = y0; y < y1; y += 4) ctx.fillRect(G[0] - 5, y, 10, 2.6);
  ctx.restore();
  if (rifl > 0) {
    ctx.save(); ctx.globalAlpha *= rifl; ctx.fillStyle = css(mix(C.dim, C.paper, .3)); ctx.fillRect(G[0] - 14, y0, 14, y1 - y0);
    ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2; for (let y = y0 + 6; y < y1; y += 14) { ctx.beginPath(); ctx.moveTo(G[0] - 14, y); ctx.lineTo(G[0] - 26, y + 10); ctx.stroke(); }
    ctx.restore();
  }
  chip(ctx, (N === 2 ? '{v:2 fenditure}' : N === 10 ? '{v:10 fenditure}' : rifl > .5 ? '{v:CD: solchi che riflettono}' : '{v:migliaia di righe}'), 410, 776, P(t, 22.7, 23.2), 30);
  chip(ctx, '{dim:angoli veri}', 1100, 160, P(t, 18.0, 18.6), 30);
  // gli ordini, per la luce verde
  const kO = life(t, 46.3, 55.6, .4, .4);
  if (kO > 0) [[0, 615], [1, 615], [2, 615], [3, 505]].forEach(([n, r]) => { const a = angolo(VERDE, n); chip(ctx, '{mink:n} = ' + n, ...pA(a, r), kO, 32); });
  // il primo ordine del verde: 19,4°
  const kA = life(t, 51.0, 55.6, .4, .4), a1 = angolo(VERDE, 1);
  if (kA > 0) {
    dashed(ctx, G, pA(0, RA - 20), C.dim, 1, kA); dashed(ctx, G, pA(a1, RA - 20), C.g, 1, kA);
    ctx.save(); ctx.globalAlpha *= kA; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(G[0], G[1], 200, -a1, 0); ctx.stroke(); ctx.restore();
    chip(ctx, '{g:19,4°}', ...pA(a1 / 2, 250), kA, 34);
  }
  // luce bianca: gli estremi del primo e del secondo ordine
  const kB = life(t, 60.4, 74.9, .4, .4), kB2 = life(t, 65.6, 74.9, .4, .4);
  if (kB > 0) [[400, 1, '14,5°', 470], [700, 1, '25,9°', 470]].forEach(([nm, n, s, r]) => chip(ctx, s, ...pA(angolo(nm, n), r), kB, 30));
  if (kB2 > 0) [[400, 2, '30°', 630], [700, 2, '61°', 630]].forEach(([nm, n, s, r]) => chip(ctx, s, ...pA(angolo(nm, n), r), kB2, 30));
  const k3 = life(t, 70.3, 74.9, .4, .4);   // il terzo ordine (solo fino a 533 nm) si sovrappone al secondo da 48,6° in su
  if (k3 > 0) { ctx.save(); ctx.globalAlpha *= k3; ctx.strokeStyle = css(C.v); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(G[0], G[1], RA + 26, -A1, -angolo(400, 3)); ctx.stroke(); ctx.restore(); chip(ctx, '{v:secondo e terzo ordine insieme}', ...pA(62 * DEG, 400), k3, 30); }
  // l'occhio che guarda il CD da angoli diversi
  const kE = life(t, 80.4, T_FINE, .4, .4);
  if (kE > 0) {
    const fi = kf(t, [[80.8, 20 * DEG], [83.4, 25 * DEG]]), E0 = pA(fi, RA + 64);
    dashed(ctx, G, pA(fi, RA - 18), C.ink, 1, kE * .7);
    occhietto(ctx, E0, fi, kE);
  }
  ctx.restore();
}
function occhietto(ctx, p, fi, al) {   // un occhio stilizzato che guarda verso il CD
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(p[0], p[1]); ctx.rotate(-fi + Math.PI);
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(0, -22, 26, 0); ctx.quadraticCurveTo(0, 22, -26, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.arc(10, 0, 9, 0, TAU); ctx.fill();
  ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(12, 0, 4, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------- la scheda di destra ----------
const RC = [1320, 110, 490, 690], CX = 1565;
function iVerde(th, t) {
  const k1 = P(t, 27.2, 27.8), k2 = P(t, 32.0, 32.6);
  return lerp(lerp(intensita(th, VERDE, 2), intensita(th, VERDE, 10), k1), intensita(th, VERDE, 0), k2);
}
function grafico(ctx, t, al) {   // l'intensità del verde contro l'angolo, da 0° a 90°
  if (al <= 0) return;
  const x0 = 1370, x1 = 1770, yb = 470, h = 170, X = a => x0 + (x1 - x0) * a / 90;
  ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1 + 8, yb); ctx.moveTo(x0, yb); ctx.lineTo(x0, yb - h - 20); ctx.stroke();
  [0, 30, 60, 90].forEach(a => txt(ctx, a + '°', X(a), yb + 30, { size: 30, color: C.dim }));
  txt(ctx, 'quanta luce', x0 + 8, yb - h - 34, { size: 30, color: C.dim, align: 'left' });
  ctx.strokeStyle = css(colLuce(VERDE)); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i <= 900; i++) { const a = i * .1, y = yb - h * iVerde(a * DEG, t); i ? ctx.lineTo(X(a), y) : ctx.moveTo(X(a), y); }
  ctx.stroke(); ctx.restore();
}
function scenaScheda(ctx, t) {
  if (t < 7.8 || t > T_FINE + .3) return;
  const al = life(t, 8.0, T_FINE, .5, .5);
  card(ctx, ...RC, al);
  ctx.save(); ctx.globalAlpha *= al;
  const r = (s, y, a, size = 34) => { if (a > 0) drawRich(ctx, s, CX, y, { size, alpha: a }); };
  // il CD
  const kC = life(t, 8.0, 17.5, .4, .4);
  r('1 µm = un millesimo\ndi millimetro', 240, kC * P(t, 10.4, 10.9), 32);
  r('{mink:d} = {v:1,6 µm}', 380, kC * P(t, 13.2, 13.7), 40);
  r('{dim:il} {v:passo} {dim:del reticolo}', 440, kC * P(t, 13.4, 13.9), 30);
  // quante fenditure, e il grafico
  const kN = life(t, 22.6, 36.5, .4, .4), N = Nfend(t);
  r('fenditure: {v:' + (N ? N : 'migliaia') + '}', 190, kN, 38);
  grafico(ctx, t, life(t, 22.8, 36.5, .5, .4));
  // la differenza di percorso fra due fenditure vicine
  const kZ = life(t, 36.6, 46.1, .4, .4);
  if (kZ > 0) {
    ctx.save(); ctx.globalAlpha *= kZ;
    const th = 19.4 * DEG, u = [Math.cos(th), -Math.sin(th)], A = [1400, 260], B = [1400, 400], Lr = 330;
    ctx.fillStyle = css(C.ink, .85); [[160, A[1] - 7], [A[1] + 7, B[1] - 7], [B[1] + 7, 470]].forEach(([a, b]) => ctx.fillRect(A[0] - 6, a, 12, b - a));
    linea(ctx, A, [A[0] + u[0] * Lr, A[1] + u[1] * Lr], C.x, 4); linea(ctx, B, [B[0] + u[0] * Lr, B[1] + u[1] * Lr], C.x, 4);
    const dd = (A[1] - B[1]) * u[1], F = [B[0] + u[0] * dd, B[1] + u[1] * dd];
    dashed(ctx, A, F, C.dim, 1, 1); linea(ctx, B, F, C.v, 9);
    chip(ctx, '{mink:d·sin θ}', F[0] + 70, B[1] + 34, 1, 32);
    chip(ctx, '{mink:d}', A[0] - 34, (A[1] + B[1]) / 2, 1, 34);
    txt(ctx, 'due fenditure vicine', CX, 520, { size: 30, color: C.dim });
    dashed(ctx, B, [B[0] + 190, B[1]], C.dim, 1, 1);
    ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(B[0], B[1], 130, -th, 0); ctx.stroke();
    drawRich(ctx, '{mink:θ}', B[0] + 165 * Math.cos(th / 2), B[1] - 165 * Math.sin(th / 2), { size: 36 });
    drawRich(ctx, '{mink:θ}: l’angolo dalla direzione dritta', CX, 575, { size: 30 });
    ctx.restore();
  }
  r('{mink:d·sin θ = n·λ}', 640, life(t, 41.6, 60.1, .4, .4), 46);
  r('{mink:λ}: la lunghezza d’onda', 695, life(t, 41.8, 60.1, .4, .4), 30);
  // il conto per il verde
  const kV = life(t, 51.0, 55.6, .4, .4);
  if (kV > 0) {
    drawSeq(ctx, ['{mink:sin θ =}', { num: '532 nm', den: '1600 nm' }, '= 0,33'], CX, 290, 36, { alpha: kV, local: t - 51.0 });
    r('{mink:θ} ≈ {g:19,4°}', 400, kV * P(t, 52.2, 52.7), 42);
  }
  // luce bianca
  const kB = life(t, 55.8, 74.9, .4, .4);
  if (kB > 0) {
    r('{dim:primo ordine,} {mink:n} = 1', 190, kB, 32);
    [[400, 'violetto 400 nm', '14,5°', 250], [VERDE, 'verde 532 nm', '19,4°', 305], [700, 'rosso 700 nm', '25,9°', 360]].forEach(([nm, s, g, y]) => {
      ctx.save(); ctx.globalAlpha *= kB; ctx.fillStyle = css(colLuce(nm)); ctx.beginPath(); ctx.arc(1370, y, 11, 0, TAU); ctx.fill(); ctx.restore();
      drawRich(ctx, s, 1395, y, { size: 32, align: 'left', alpha: kB }); txt(ctx, g, 1775, y, { size: 34, weight: 600, align: 'right', alpha: kB });
    });
    const k2 = P(t, 65.6, 66.1);
    r('{dim:secondo ordine,} {mink:n} = 2', 450, kB * k2, 32);
    if (k2 > 0) [[400, 'violetto', '30,0°', 505], [700, 'rosso', '61,0°', 560]].forEach(([nm, s, g, y]) => {
      ctx.save(); ctx.globalAlpha *= kB * k2; ctx.fillStyle = css(colLuce(nm)); ctx.beginPath(); ctx.arc(1370, y, 11, 0, TAU); ctx.fill(); ctx.restore();
      drawRich(ctx, s, 1395, y, { size: 32, align: 'left', alpha: kB * k2 }); txt(ctx, g, 1775, y, { size: 34, weight: 600, align: 'right', alpha: kB * k2 });
    });
  }
  // il CD, per riflessione: che colore vede l'occhio
  const kR = life(t, 75.1, T_FINE, .4, .4);
  if (kR > 0) {
    r('{v:per riflessione}', 190, kR, 36);
    r('stessa regola:\n{mink:d·sin θ = n·λ}', 285, kR, 36);
    const kE = P(t, 80.5, 81.0);
    if (kE > 0) {
      const fi = Math.round(kf(t, [[80.8, 20], [83.4, 25]])), nm = D_UM * 1000 * Math.sin(fi * DEG);   // λ dal θ mostrato
      r('l’occhio a {mink:θ} = ' + fi + '°', 430, kR * kE, 34);
      r('vede {mink:λ} = {mink:d·sin θ}', 490, kR * kE, 34);
      ctx.save(); ctx.globalAlpha *= kR * kE; ctx.fillStyle = css(colLuce(nm)); ctx.beginPath(); ctx.roundRect(1420, 545, 290, 90, 18); ctx.fill(); ctx.restore();
      txt(ctx, '≈ ' + (Math.round(nm / 10) * 10) + ' nm', CX, 680, { size: 40, weight: 600, alpha: kR * kE });
    }
  }
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'I colori del CD', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaCarta(ctx, t) {
  if (t < 7.4 || t > T_FINE + .3) return;
  card(ctx, 110, 110, 1180, 690, life(t, 7.6, T_FINE, .6, .5));
}
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 94.4, 95.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Un reticolo manda ogni colore\nin una direzione diversa.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'tante righe: massimi\n{g:sottili}'], [960, '{mink:d·sin θ = n·λ}'], [1430, 'CD: {mink:d} = 1,6 µm,\nil rosso devia di più']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i === 1 ? 40 : 32, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node): gli angoli in gradi
  const g = (nm, n) => { const a = angolo(nm, n); return a == null ? null : +(a / DEG).toFixed(2); };
  const verifica = { verde: [1, 2, 3].map(n => g(VERDE, n)), violetto: [1, 2, 3].map(n => g(400, n)), rosso: [1, 2, 3].map(n => g(700, n)),
    terzoFinoA: +(D_UM * 1000 / 3).toFixed(1), occhio20: +(1600 * Math.sin(20 * DEG)).toFixed(1), occhio25: +(1600 * Math.sin(25 * DEG)).toFixed(1) };
  // effetti sonori (strumenti/suoni-sintesi.py): alla fine il tono segue l'occhio che sale da 20° a 25°
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.0, .4], ['pop', 9.2, .45],                             // il CD, l'ingrandimento
    ['pop', 10.5, .45], ['pop', 13.3, .55],                                           // 1,6 µm, il passo d
    ['soffio', 17.4],                                                                 // il reticolo e lo schermo ad arco
    ['pop', 22.8, .45],                                                               // luce verde, due fenditure
    ['pop', 27.3, .55], ['pop', 32.1, .65],                                           // dieci fenditure, migliaia
    ['traccia', 32.4, 32.9],                                                          // le direzioni della luce
    ['traccia', 36.6, 37.0], ['pop', 36.8, .45],                                      // la differenza di percorso
    ['pop', 41.7, .6], ['ding', 42.0],                                                // d·sin θ = n·λ
    ['pop', 46.4, .5],                                                                // gli ordini
    ['traccia', 51.0, 51.4], ['pop', 51.2, .45], ['ding', 52.3],                      // il verde: 19,4°
    ['pop', 55.9, .45],                                                               // violetto, verde, rosso
    ['pop', 60.4, .6],                                                                // luce bianca
    ['pop', 65.7, .5],                                                                // il secondo ordine
    ['traccia', 70.3, 70.8], ['pop', 70.5, .45],                                      // il terzo ordine si sovrappone
    ['soffio', 75.1], ['pop', 75.3, .45],                                             // il CD per riflessione
    ['pop', 80.5, .45], ['tono', 80.8, 83.4, [.4, .41, .45, .55, .59, .6]],           // l'occhio sale da 20° a 25°
    ['soffio', 85.0], ['pop', 86.6, .5], ['pop', 87.1, .6], ['pop', 87.6, .7],        // in una frase
  ];
  return {
    titolo: 'I colori del CD', durata: 95.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 17.4, 'il CD'], [17.4, 36.4, 'tante fenditure'], [36.4, 55.4, 'la regola'], [55.4, 74.8, 'i colori'], [74.8, 84.8, 'il CD per riflessione']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCarta(ctx, t); scenaCD(ctx, t); scenaReticolo(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
