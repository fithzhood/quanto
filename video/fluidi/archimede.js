'use strict';
/* Galleggiare o affondare — la spinta di Archimede è il peso del liquido spostato; chi è più denso affonda; l'iceberg. Argomento: fluidi. */
CVIDEO.registra('fluidi/archimede', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, fmtN, dashed, arrowHead, card } = M;

const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [82.4, 190], [83.7, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [82.4, 1050], [83.7, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [82.4, 2.2], [83.7, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [82.4, 2], [83.7, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [82.4, -1.5], [83.7, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [16.8, 'sorpreso'], [21.0, 'neutro'],
  [25.9, 'festa'], [30.4, 'neutro'], [51.8, 'sorpreso'], [56.3, 'felice'], [60.6, 'neutro'], [69.6, 'freddo'],
  [74.3, 'neutro'], [78.5, 'felice'], [84.6, 'neutro'], [89.0, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Perché il ghiaccio galleggia\ne il sasso affonda?'],
  [7.9, 11.9, 'Appendo un blocco di alluminio\nal dinamometro: segna 26,5 N.'],
  [12.1, 16.6, 'Lo immergo nell’acqua: il dinamometro\nsegna {g:sempre meno}…'],
  [16.8, 20.8, '…l’acqua lo spinge verso l’alto:\nè la {y:spinta} di Archimede.'],
  [21.0, 25.75, 'Tutto sott’acqua: 16,7 N.\nLa spinta vale 26,5 − 16,7 = {y:9,8 N}.'],
  [25.9, 30.2, 'Intanto dal vaso è uscito\n1 litro d’acqua: pesa {y:9,8 N}!'],
  [30.4, 34.9, 'Il principio di {v:Archimede}: la spinta\nè il {g:peso del liquido spostato}.'],
  [35.1, 40.1, 'Spinta = {mink:d·}{mx:V}{mink:·g}, con {mink:d} densità\ndel liquido e {mx:V} volume immerso.'],
  [40.6, 44.6, 'Tre blocchi dello stesso volume,\ntenuti fermi sott’acqua da un’asta.'],
  [44.8, 48.8, 'Sott’acqua ricevono la {y:stessa spinta}:\nspostano la stessa acqua.'],
  [49.0, 51.75, 'Ma il {y:peso} è diverso.'],
  [51.8, 56.1, 'Lascio il sasso: è {r:più denso}\ndell’acqua, e va a fondo.'],
  [56.3, 60.4, 'Lascio legno e ghiaccio:\n{g:meno densi}, salgono e galleggiano.'],
  [60.6, 65.1, 'Il legno ha sott’acqua il {g:60%}\ndel volume, il ghiaccio il {g:92%}.'],
  [65.3, 69.55, 'Va sotto quanto basta a spostare\nun’acqua che pesa quanto lui.'],
  [69.6, 74.1, 'Un iceberg nel mare: ghiaccio\nda 917 kg/m³ in acqua da 1025.'],
  [74.3, 78.8, 'Sott’acqua resta 917 / 1025 ≈ {g:89%}\ndel volume: circa il 90%.'],
  [78.95, 82.45, 'Quello che vediamo è solo\nla {g:punta dell’iceberg}.'],
  [84.6, 90.2, 'Affonda chi è più denso del liquido,\ngalleggia chi lo è meno.'],
];

// ---------- aiutanti ----------
const G = 9.8;
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
function numero(ctx, s, x, y, size, col, al = 1) {
  if (al <= 0) return;
  const i = s.search(/ [a-zA-Z]/), cifre = i < 0 ? s : s.slice(0, i), unita = i < 0 ? '' : s.slice(i);
  ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = css(col); ctx.font = `500 ${size}px Lexend, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  const lw = ch => ch === ' ' ? size * .26 : ch === ',' ? size * .3 : /\d/.test(ch) ? size * .62 : ctx.measureText(ch).width + size * .1;
  const wc = Array.from(cifre).reduce((s2, ch) => s2 + lw(ch), 0), wu = ctx.measureText(unita).width;
  let xx = x - wu - wc;
  ctx.textAlign = 'center';
  for (const ch of cifre) { const cw = lw(ch); ctx.fillText(ch, xx + cw / 2, y); xx += cw; }
  ctx.textAlign = 'left'; ctx.fillText(unita, xx, y);
  ctx.restore();
}
function riga(ctx, nome, val, y, col, al, x0 = 1240, x1 = 1760, size = 40) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  numero(ctx, val, x1, y, size + 2, col);
  ctx.restore();
}
const acqua = (a = 1) => css(C.x, .22 * a);

// 0 · titolo (0–7.5)
function sceneIntro(ctx, t) {
  if (t > 7.5) return;
  const al = 1 - P(t, 6.2, 7.0);
  conFont(TITOLI, () => drawRich(ctx, 'Galleggiare o affondare', W / 2, 180, { size: 130, weight: 600, local: t - 1.6, stagger: .15, alpha: al }));
}

// 1 · il dinamometro e il vaso di trabocco (7.5–40.4); 12 px = 1 cm
const XB = 450, LATO = 120, PELO = 480;          // il blocco è un cubo di 10 cm; il pelo dell'acqua sta al beccuccio
const VASO = { x0: 300, x1: 630, y0: 420, y1: 740 }, BICCH = { x0: 710, x1: 830, y0: 560, y1: 740 };   // il bicchiere: 10 cm per 10 cm
const giu = t => 170 * P(t, 12.3, 16.6, E.lin);   // lo calo piano, a velocità costante
const immerso = t => clamp((330 + LATO + giu(t) - PELO) / LATO);   // frazione del blocco sott'acqua
const PESO_AL = 2700 * .001 * G;                  // 26,46 N
function sceneArchimede(ctx, t) {
  if (t < 7.5 || t > 40.6) return;
  const al = 1 - P(t, 39.8, 40.4), ka = P(t, 7.6, 8.4);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680, ka); card(ctx, 1200, 110, 610, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const dy = giu(t), f = immerso(t);
  // il vaso di trabocco: sempre pieno fino al beccuccio
  ctx.fillStyle = acqua(); ctx.fillRect(VASO.x0, PELO, VASO.x1 - VASO.x0, VASO.y1 - PELO);
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(VASO.x0, VASO.y0); ctx.lineTo(VASO.x0, VASO.y1); ctx.lineTo(VASO.x1, VASO.y1); ctx.lineTo(VASO.x1, VASO.y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(VASO.x1, PELO - 2); ctx.lineTo(VASO.x1 + 50, PELO + 10); ctx.moveTo(VASO.x1, PELO + 12); ctx.lineTo(VASO.x1 + 46, PELO + 22); ctx.stroke();
  // il bicchiere che raccoglie: il suo livello sale quanto il blocco affonda (stessa sezione)
  const hb = LATO * f;
  ctx.fillStyle = acqua(); ctx.fillRect(BICCH.x0, BICCH.y1 - hb, BICCH.x1 - BICCH.x0, hb);
  ctx.beginPath(); ctx.moveTo(BICCH.x0, BICCH.y0); ctx.lineTo(BICCH.x0, BICCH.y1); ctx.lineTo(BICCH.x1, BICCH.y1); ctx.lineTo(BICCH.x1, BICCH.y0); ctx.stroke();
  // la bilancia sotto il bicchiere
  ctx.fillStyle = css(C.dim); ctx.fillRect(BICCH.x0 - 20, BICCH.y1 + 4, BICCH.x1 - BICCH.x0 + 40, 14);
  // il getto che esce dal beccuccio mentre il blocco entra (cade come un proiettile)
  if (f > 0 && f < 1) {   // finisce quando il blocco è tutto sott'acqua
    ctx.strokeStyle = css(C.x, .7); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
    const x0 = VASO.x1 + 48, y0 = PELO + 16, yf = BICCH.y1 - hb;
    // esce a 0,3 m/s in orizzontale e cade con g = 9,8 m/s² (1 m = 1200 px)
    for (let i = 0; i <= 30; i++) { const u = i / 30 * .3, x = x0 + 360 * u, y = y0 + .5 * 11760 * u * u; if (y > yf) { ctx.lineTo(x, yf); break; } i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  // il supporto, il dinamometro e il blocco, che scendono insieme
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(250, 130); ctx.lineTo(560, 130); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XB, 130); ctx.lineTo(XB, 140 + dy); ctx.stroke();
  const lettura = PESO_AL - 9.8 * f;
  ctx.fillStyle = C.paper; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(XB - 26, 140 + dy, 52, 130, 10); ctx.fill(); ctx.stroke();
  // la molla e l'indice: si allunga di 3 px per newton
  const yi = 160 + dy + 3 * lettura;
  ctx.strokeStyle = css(C.dim); ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 16; i++) { const y = lerp(150 + dy, yi, i / 16); i ? ctx.lineTo(XB + (i % 2 ? 9 : -9), y) : ctx.moveTo(XB, y); }
  ctx.stroke();
  ctx.strokeStyle = css(C.y); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(XB - 18, yi); ctx.lineTo(XB + 18, yi); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XB, yi); ctx.lineTo(XB, 330 + dy); ctx.stroke();
  // il blocco di alluminio
  const yb = 330 + dy;
  ctx.fillStyle = css(mix(C.dim, C.paper, .35)); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(XB - LATO / 2, yb, LATO, LATO); ctx.fill(); ctx.stroke();
  // l'acqua davanti al blocco: la parte immersa si vede sott'acqua
  if (f > 0) { ctx.fillStyle = acqua(); ctx.fillRect(XB - LATO / 2, Math.max(yb, PELO), LATO, yb + LATO - Math.max(yb, PELO)); }
  ctx.strokeStyle = css(C.x, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(VASO.x0, PELO); ctx.lineTo(VASO.x1, PELO); ctx.stroke();
  // le forze sul blocco, 4 px per newton: il peso giù, il filo e la spinta su (filo + spinta = peso)
  const kp = P(t, 8.6, 9.2, E.out), cy = yb + LATO / 2;
  if (kp > 0) {
    freccia(ctx, [XB - 28, cy], [XB - 28, cy + 4 * PESO_AL * kp], C.y);
    txt(ctx, 'peso', XB - 70, cy + 50, { size: 30, color: C.y, align: 'right', alpha: kp });
    freccia(ctx, [XB, cy], [XB, cy - 4 * lettura * kp], C.y, 6);
    txt(ctx, 'filo', XB + 12, yb - 40, { size: 30, color: C.y, align: 'left', alpha: kp });
  }
  if (f > .02) freccia(ctx, [XB + 28, cy], [XB + 28, cy - 4 * 9.8 * f], C.y);
  if (t > 16.8) txt(ctx, 'spinta', XB + 72, cy - 20, { size: 30, color: C.y, align: 'left', alpha: P(t, 16.8, 17.3) });
  txt(ctx, 'dinamometro', XB + 40, 200 + dy, { size: 30, color: C.dim, align: 'left', alpha: P(t, 8.4, 9.0) });
  txt(ctx, 'vaso di trabocco', (VASO.x0 + VASO.x1) / 2, 765, { size: 30, color: C.dim, alpha: P(t, 12.2, 12.8) });
  ctx.restore();
  // la scheda delle letture
  const lq = Math.round(lettura * 10) / 10, sq = Math.round(9.8 * f * 10) / 10;
  conFont(TITOLI, () => drawRich(ctx, 'le misure', 1505, 170, { size: 40, weight: 600, alpha: ka }));
  riga(ctx, 'peso del blocco', '26,5 N', 245, C.y, P(t, 8.4, 8.9));
  riga(ctx, 'dinamometro', fmtN(lq, 1) + ' N', 305, C.ink, P(t, 8.4, 8.9));
  riga(ctx, 'spinta', fmtN(sq, 1) + ' N', 365, C.y, P(t, 16.9, 17.4));
  ctx.save(); ctx.globalAlpha *= P(t, 13.0, 13.5); ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1240, 410); ctx.lineTo(1760, 410); ctx.stroke(); ctx.restore();
  riga(ctx, 'acqua uscita', fmtN(f, 2) + ' L', 455, C.x, P(t, 13.0, 13.5));
  riga(ctx, 'il suo peso', fmtN(sq, 1) + ' N', 515, C.y, P(t, 26.1, 26.6));
  const kf2 = P(t, 35.3, 35.8);
  if (kf2 > 0) {
    ctx.save(); ctx.globalAlpha *= kf2; ctx.strokeStyle = C.panelEdge; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1240, 565); ctx.lineTo(1760, 565); ctx.stroke(); ctx.restore();
    drawRich(ctx, 'spinta = {mink:d·}{mx:V}{mink:·g}', 1505, 630, { size: 48, local: t - 35.4 });
    drawRich(ctx, '{mink:d}{dim: densità del liquido}\n{mx:V}{dim: volume immerso,  }{mink:g}{dim: = 9,8 m/s²}', 1505, 712, { size: 30, local: t - 36.6 });
  }
  ctx.restore();
}

// 2 · tre blocchi: legno, ghiaccio, sasso (40.4–69.4)
// cubi di 10 cm in acqua dolce; il moto si integra davvero: peso, spinta (d·g·volume immerso), attrito dell'acqua
// (quadratico più un poco lineare) e la massa d'acqua trascinata. z = profondità della faccia di sotto, in metri.
const A = .1, RHO_L = 1000, FONDO = .4, Z0 = .2, DT = 1 / 600;
function traiettoria(rho, tLascia, tFine) {
  const m = rho * A * A * A, mEff = m + .5 * RHO_L * A * A * A, out = [];
  let z = Z0, v = 0;
  for (let tt = tLascia; tt <= tFine + DT; tt += DT) {
    out.push(z);
    const s = clamp(z, 0, A);
    const F = m * G - RHO_L * G * A * A * s - 5.25 * v * Math.abs(v) - 8 * v;   // verso il basso è positivo
    v += F / mEff * DT; z += v * DT;
    if (z >= FONDO) { z = FONDO; v = 0; }
  }
  return { t0: tLascia, dati: out };
}
const zAt = (T, t) => { if (t <= T.t0) return Z0; const i = (t - T.t0) / DT, k = Math.floor(i), a = T.dati[Math.min(k, T.dati.length - 1)], b = T.dati[Math.min(k + 1, T.dati.length - 1)]; return lerp(a, b, i - k); };
const BLOCCHI = [
  { nome: 'legno', rho: 600, x: 330, T: traiettoria(600, 56.6, 70) },
  { nome: 'ghiaccio', rho: 917, x: 630, T: traiettoria(917, 56.6, 70) },
  { nome: 'sasso', rho: 2600, x: 930, T: traiettoria(2600, 52.3, 70) },
];
const VASCA = { x0: 170, x1: 1100, pelo: 250, fondo: 250 + FONDO * 1200 };   // 1 m = 1200 px
function sceneBlocchi(ctx, t) {
  if (t < 40.2 || t > 69.6) return;
  const al = life(t, 40.4, 69.4, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1050, 680); card(ctx, 1200, 110, 610, 680);
  const { x0, x1, pelo, fondo } = VASCA;
  ctx.fillStyle = acqua(); ctx.fillRect(x0, pelo, x1 - x0, fondo - pelo);
  BLOCCHI.forEach((B, i) => {
    const z = zAt(B.T, t), yb = pelo + z * 1200, s = clamp(z, 0, A);
    const col = i === 0 ? mix(C.y, C.paper, .45) : i === 1 ? mix(C.x, C.paper, .7) : mix(C.dim, C.ink, .25);
    ctx.fillStyle = css(col); ctx.strokeStyle = css(C.ink); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(B.x - 60, yb - 120, 120, 120); ctx.fill(); ctx.stroke();
    if (s > 0) { ctx.fillStyle = acqua(.8); ctx.fillRect(B.x - 60, yb - s * 1200, 120, s * 1200); }
    txt(ctx, B.nome, B.x, VASCA.fondo + 32, { size: 30, weight: 600, color: C.ink });   // il nome sotto la vasca, in colonna
    // le forze, 6 px per newton: la spinta è d·g·(volume immerso), il peso d_corpo·g·V
    // finché l'asta li tiene, asta + spinta + peso fanno zero; il sasso che cade perde le frecce prima di toccare il fondo
    const spinta = RHO_L * G * A * A * s, peso = B.rho * G * A * A * A, cy = yb - 60;
    const kz = i === 2 ? clamp((VASCA.fondo - 8 - (cy + 6 * peso)) / 40) : 1, ks = P(t, 45.0, 45.6, E.out) * kz, kp = P(t, 49.0, 49.6, E.out) * kz;   // i pesi quando Stilla ne parla
    const via = B.T.t0, kA = P(t, 49.0, 49.6) * (1 - P(t, via, via + .2)), kR = 1 - P(t, via, via + .5);
    if (kR > 0) {   // l'asta che tiene il blocco, e che lo lascia andando su
      ctx.save(); ctx.globalAlpha *= kR; ctx.fillStyle = css(C.dim);
      // la punta resta alla quota di rilascio e risale mentre l'asta sparisce: non segue il blocco
      const punta = pelo + Z0 * 1200 - 120 - 200 * (1 - kR);
      if (punta > 150) ctx.fillRect(B.x - 4, 150, 8, punta - 150);
      ctx.restore();
    }
    const fAsta = spinta - peso;   // positiva: l'asta spinge giù (legno, ghiaccio); negativa: tira su (sasso)
    if (kA > 0) freccia(ctx, [B.x, yb - 120 - (fAsta > 0 ? 6 * fAsta : 0)], [B.x, yb - 120 - (fAsta > 0 ? 0 : -6 * fAsta)], C.y, 7, kA);
    if (ks > 0) freccia(ctx, [B.x + 25, cy], [B.x + 25, cy - 6 * spinta * ks], C.y, 7);
    if (kp > 0) freccia(ctx, [B.x - 25, cy], [B.x - 25, cy + 6 * peso * kp], C.y, 7);
    // quanto sta sotto chi galleggia
    const kq = life(t, 60.8, 69.2, .4, .5);
    if (kq > 0 && i < 2) {
      const yt = yb - 120;
      ctx.save(); ctx.globalAlpha *= kq; ctx.strokeStyle = css(C.g); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(B.x + 76, pelo); ctx.lineTo(B.x + 76, yb); ctx.moveTo(B.x + 68, yb); ctx.lineTo(B.x + 84, yb); ctx.moveTo(B.x + 68, pelo); ctx.lineTo(B.x + 84, pelo); ctx.stroke();
      txt(ctx, Math.round(B.rho / 10) + '%', B.x + 94, (pelo + yb) / 2, { size: 44, weight: 600, color: C.g, align: 'left' });
      ctx.restore();
    }
  });
  ctx.strokeStyle = css(C.x, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, pelo); ctx.lineTo(x1, pelo); ctx.stroke();
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, pelo - 60); ctx.lineTo(x0, fondo); ctx.lineTo(x1, fondo); ctx.lineTo(x1, pelo - 60); ctx.stroke();
  const kl = P(t, 45.0, 45.5);
  if (kl > 0) {
    txt(ctx, 'spinta', BLOCCHI[0].x + 72, pelo + Z0 * 1200 - 60 - 40, { size: 30, color: C.y, align: 'left', alpha: kl * (1 - P(t, 56.4, 56.8)) });
    const kw = P(t, 49.0, 49.5) * (1 - P(t, 56.4, 56.8));
    txt(ctx, 'peso', BLOCCHI[0].x - 72, pelo + Z0 * 1200 - 60 + 30, { size: 30, color: C.y, align: 'right', alpha: kw });
    // «asta» accanto alla sua freccia; sul ghiaccio la freccia è minuscola (0,8 N): si scrive il valore
    txt(ctx, 'asta', BLOCCHI[0].x + 14, pelo + Z0 * 1200 - 120 - 34, { size: 30, color: C.y, align: 'left', alpha: kw });
    txt(ctx, 'asta 0,8 N', BLOCCHI[1].x + 14, pelo + Z0 * 1200 - 120 - 34, { size: 30, color: C.y, align: 'left', alpha: kw });
  }
  // la scheda delle densità
  conFont(TITOLI, () => drawRich(ctx, 'densità', 1505, 170, { size: 40, weight: 600 }));
  txt(ctx, 'kg/m³', 1505, 215, { size: 30, color: C.dim });
  riga(ctx, '{x:acqua}', '1000', 290, C.x, P(t, 41.0, 41.5));
  const kd = P(t, 41.6, 42.1);
  riga(ctx, 'legno', '600', 370, t > 56.6 ? C.g : C.ink, kd);
  riga(ctx, 'ghiaccio', '917', 435, t > 56.6 ? C.g : C.ink, kd);
  riga(ctx, 'sasso', '2600', 500, t > 52.3 ? C.r : C.ink, kd);
  drawRich(ctx, '{r:più denso}{dim: dell’acqua: affonda}', 1505, 610, { size: 30, local: t - 53.4 });
  drawRich(ctx, '{g:meno denso}{dim: dell’acqua: galleggia}', 1505, 665, { size: 30, local: t - 57.4 });
  ctx.restore();
}

// 3 · l'iceberg (69.4–82.6): la sezione (pensata uguale in profondità) si mette dove la parte immersa è 917/1025
const MARE = 300, RHO_G = 917, RHO_M = 1025;
const BERG0 = [[690, 230], [730, 196], [770, 214], [800, 186], [842, 232], [880, 262], [930, 300], [1000, 362], [1040, 452], [1022, 560],
  [962, 650], [880, 716], [760, 742], [640, 718], [560, 640], [520, 540], [540, 440], [590, 352], [640, 290], [662, 250]];
const area = pts => { let s = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; }); return Math.abs(s) / 2; };
// la parte del poligono sotto la retta y = Y (taglio di Sutherland–Hodgman)
function sotto(pts, Y) {
  const out = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length], pIn = p[1] >= Y, qIn = q[1] >= Y;
    if (pIn) out.push(p);
    if (pIn !== qIn) { const k = (Y - p[1]) / (q[1] - p[1]); out.push([p[0] + k * (q[0] - p[0]), Y]); }
  });
  return out;
}
const FRAZ = RHO_G / RHO_M;
const SPOSTA = (() => {   // di quanto abbassare il disegno perché la parte sotto il mare sia FRAZ del totale
  const tot = area(BERG0); let a = -400, b = 400;
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2, f = area(sotto(BERG0.map(([x, y]) => [x, y + m]), MARE)) / tot; if (f < FRAZ) a = m; else b = m; }
  return (a + b) / 2;
})();
const BERG = BERG0.map(([x, y]) => [x, y + SPOSTA]);
const SOPRA_Y = Math.min(...BERG.map(p => p[1])), SOTTO_Y = Math.max(...BERG.map(p => p[1]));
function poligono(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
function sceneIceberg(ctx, t) {
  if (t < 69.2 || t > 82.8) return;
  const al = life(t, 69.4, 82.6, .6, .6);
  ctx.save(); ctx.globalAlpha *= al;
  card(ctx, 110, 110, 1700, 680);
  ctx.save(); ctx.beginPath(); ctx.roundRect(112, 112, 1696, 676, 22); ctx.clip();
  // il mare, più scuro in fondo
  const gr = ctx.createLinearGradient(0, MARE, 0, 790);
  gr.addColorStop(0, css(C.x, .2)); gr.addColorStop(1, css(C.x, .42));
  ctx.fillStyle = gr; ctx.fillRect(112, MARE, 1696, 790 - MARE);
  // l'iceberg: bianco sopra, velato dall'acqua sotto
  ctx.fillStyle = css(mix(C.x, [255, 255, 255], .88)); ctx.strokeStyle = css(mix(C.x, [30, 60, 90], .35)); ctx.lineWidth = 3;   // bianco azzurrino in entrambi i temi
  poligono(ctx, BERG); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(C.x, .28); poligono(ctx, sotto(BERG, MARE)); ctx.fill();
  ctx.strokeStyle = css(C.x, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, MARE); ctx.lineTo(1808, MARE); ctx.stroke();
  ctx.restore();
  // il 9 a 1 è del volume (qui: dell'area della sezione), non dell'altezza: si scrive sulle due parti
  const kq = P(t, 74.5, 75.1);
  if (kq > 0) {
    ctx.save(); ctx.globalAlpha *= kq;
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.roundRect(780 - 215, 510 - 36, 430, 72, 14); ctx.fill();
    drawRich(ctx, '{g:≈ 89% del volume}', 780, 512, { size: 44 });
    drawRich(ctx, '≈ 11%', 790, 262, { size: 44, fill: css(mix(C.x, [20, 40, 70], .7)) });   // scuro su ghiaccio chiaro, in entrambi i temi
    ctx.restore();
  }
  drawRich(ctx, '{dim:iceberg disegnato come un prisma, visto in sezione}', 1390, 160, { size: 30, alpha: P(t, 70.0, 70.6) });
  const kd = P(t, 70.0, 70.6);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd;
    riga(ctx, 'ghiaccio', '917 kg/m³', 660, C.ink, 1, 1290, 1770, 34);
    riga(ctx, 'acqua di mare', '1025 kg/m³', 714, C.ink, 1, 1290, 1770, 34);
    ctx.restore();
  }
  const kp = P(t, 79.0, 79.6);
  if (kp > 0) txt(ctx, 'la punta', 650, SOPRA_Y + 4, { size: 32, weight: 600, color: C.ink, align: 'right', alpha: kp });
  ctx.restore();
}

// 4 · in una frase (82.6–93)
function sceneFine(ctx, t) {
  if (t < 82.6) return;
  const al = 1 - P(t, 91.4, 92.2);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 82.8 });
    drawRich(ctx, 'La spinta è il {g:peso del liquido}\nche il corpo sposta.', W / 2, 290, { size: 70, weight: 600, local: t - 83.2, stagger: .09 });
  });
  const pills = [[490, 'spinta = {mink:d·}{mx:V}{mink:·g}'], [960, 'più denso del liquido:\n{r:affonda}'], [1430, 'iceberg:\n{g:circa il 90%} sotto']];
  pills.forEach(([x, s], i) => {
    const a = 84.8 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: i ? 33 : 40, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // effetti sonori (strumenti/suoni-sintesi.py): il tono segue l'altezza di ciò che si muove: il blocco calato a velocità
  // costante, l'acqua che sale nel bicchiere, poi i tre blocchi lasciati andare (moto vero, da zAt(): pelo .8, fondo .2)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.4, .5], ['pop', 8.6, .4],                              // dinamometro e misure; peso e filo
    ['tono', 12.3, 16.6, [.75, .35]],                                                 // lo calo nell'acqua
    ['traccia', 13.0, 13.5], ['tono', 13.06, 16.09, [.15, .45]],                      // l'acqua uscita riempie il bicchiere
    ['pop', 16.9, .6],                                                                // la spinta
    ['pop', 26.1, .5],                                                                // il peso dell'acqua uscita: 9,8 N
    ['traccia', 35.3, 35.8], ['pop', 35.4, .65], ['pop', 36.6, .35],                  // spinta = d·V·g
    ['soffio', 40.4], ['pop', 41.0, .5], ['pop', 41.6, .45],                          // tre blocchi, le densità
    ['pop', 45.0, .6], ['pop', 49.0, .4],                                             // stessa spinta, peso diverso
    ['tono', 52.3, 52.64, [.5, .493, .474, .445, .407, .362, .311, .255, .2]], ['pop', 52.64, .1],   // il sasso va a fondo
    ['pop', 53.4, .3],                                                                // più denso: affonda
    ['tono', 56.6, 57.6, [.5, .593, .717, .719, .705]],                               // il legno sale e galleggia
    ['tono', 56.6, 58.1, [.5, .518, .55, .585, .621, .656, .67]], ['pop', 57.4, .6],  // il ghiaccio; meno denso: galleggia
    ['ding', 61.0],                                                                   // 60% e 92% sott'acqua
    ['soffio', 69.4], ['pop', 70.0, .45],                                             // l'iceberg, le due densità
    ['ding', 74.8], ['pop', 79.0, .8],                                                // ≈ 89% del volume; la punta
    ['soffio', 82.8], ['pop', 84.8, .5], ['pop', 85.3, .6], ['pop', 85.8, .7],        // in una frase
  ];
  return {
    titolo: 'Galleggiare o affondare', durata: 93, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI, stati: [[69.6, 'ghiaccio'], [82.4, 'liquida']] },
    capitoli: [[7.5, 40.4, 'la spinta di Archimede'], [40.4, 69.4, 'affonda o galleggia'], [69.4, 82.4, 'l’iceberg']],
    scena(ctx, t) { sceneIntro(ctx, t); sceneArchimede(ctx, t); sceneBlocchi(ctx, t); sceneIceberg(ctx, t); sceneFine(ctx, t); },
  };
});
