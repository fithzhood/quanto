'use strict';
/* La pressione è fatta di urti — le molecole rimbalzano elasticamente sulle pareti: ogni urto cambia la loro quantità di
   moto e dà un colpetto alla parete; la pressione è la forza media per unità di superficie; la temperatura assoluta è
   proporzionale all'energia cinetica media di traslazione (3/2·k·T). Argomento: gas. */
CVIDEO.registra('gas/teoria-cinetica', M => {
  const { W, C, E, P, life, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, card, arrowHead, dashed, fmtN } = M;

const T_FINE = 94.4;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.2, 'sorpreso'], [19.6, 'neutro'],
  [31.2, 'sorpreso'], [33.6, 'neutro'], [50.6, 'felice'], [53.0, 'neutro'], [60.6, 'sorpreso'], [63.0, 'neutro'],
  [70.2, 'festa'], [72.6, 'neutro'], [75.0, 'pensa'], [79.6, 'neutro'], [96.4, 'felice'], [99.8, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.3, 'Un gas preme sulle pareti\ndel recipiente. Come fa?'],
  [7.9, 12.4, 'Un {v:gas} in una scatola: molecole\nlontane fra loro, al rallentatore.'],
  [12.6, 17.0, 'In un gas le molecole corrono\nin tutte le direzioni.'],
  [17.2, 21.6, 'Nell’aria a temperatura ambiente\nvanno a circa {x:500 m/s}!'],
  [21.8, 26.2, 'Rimbalzano sulle pareti senza perdere\nvelocità: urti {v:elastici}.'],
  [26.6, 31.0, 'Seguiamo una molecola sola\nche va dritta verso la parete…'],
  [31.2, 35.8, 'Rimbalza: la velocità verso la parete\ncambia verso.'],
  [36.0, 40.6, 'La quantità di moto cambia di\n2·{mink:m·}{mx:v}: la parete l’ha spinta.'],
  [40.8, 45.4, 'E la molecola spinge la parete\ncon una forza uguale e contraria.'],
  [45.8, 50.4, 'Ogni urto è un colpetto sulla parete:\neccoli nel grafico.'],
  [50.6, 55.2, 'Sono tantissimi: in media la parete\nsente una {g:forza costante}.'],
  [55.4, 60.0, 'La {v:pressione} è la forza media\ndivisa per la superficie.'],
  [60.6, 65.2, 'Ora scaldo il gas: le molecole\ncorrono più veloci.'],
  [65.4, 70.0, 'Temperatura assoluta doppia:\nvelocità circa 1,4 volte (√2).'],
  [70.2, 74.8, 'Urti più frequenti e più forti:\nla pressione {g:raddoppia}.'],
  [75.0, 79.4, 'La temperatura assoluta è proporzionale\nall’{v:energia cinetica media}…'],
  [79.6, 84.4, '…di {v:traslazione}: quella del moto da un\npunto all’altro, rotazioni escluse.'],
  [84.6, 89.4, 'In media ½·{mink:m·}{mx:v}² = 3/2·{mink:k·T},\ncon {mink:k} la costante di Boltzmann.'],
  [89.6, 94.2, '{mink:k} ≈ {mink:1,38·10⁻²³} J/K: a 300 K,\ncirca {mink:6,2·10⁻²¹} J a molecola.'],
  [96.4, 101.8, 'Pressione: dagli urti. {mink:T}: proporzionale\nall’energia cinetica media di traslazione.'],
];

// ---------- aiutanti ----------
const titoletto = (ctx, s, x, y, al = 1) => conFont(TITOLI, () => drawRich(ctx, s, x, y, { size: 38, weight: 600, alpha: al }));
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
function riga(ctx, nome, val, y, col, al, x0, x1, size = 34) {
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  drawRich(ctx, nome, x0, y, { size, align: 'left' });
  drawRich(ctx, val, x1, y, { size: size + 2, align: 'right', fill: css(col) });
  ctx.restore();
}
function generatore(seme) {   // mulberry32: numeri «a caso» ma sempre gli stessi
  let a = seme >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const tri = s => { const u = ((s % 2) + 2) % 2; return u < 1 ? u : 2 - u; };   // il rimbalzo elastico fra due pareti

// 0 · titolo (0–7,5)
function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'La pressione è fatta di urti', W / 2, 180, { size: 116, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}

// ---------- il gas nella scatola: rimbalzi elastici, velocità che vanno come √T ----------
const BX = [300, 1040], BY = [190, 730], R = 8, N = 40, LX = BX[1] - BX[0] - 2 * R, LY = BY[1] - BY[0] - 2 * R;
const temperatura = t => 300 + 300 * P(t, 60.8, 63.2);          // da 300 K a 600 K (il fornellino sotto)
const DT = .005, TM = 108;
let FASE = null, MOL = null;
function prepara() {
  if (FASE) return;
  FASE = new Float64Array(Math.ceil(TM / DT) + 2);   // ∫ √(T/300) dt: il «tempo» delle molecole
  for (let i = 1; i < FASE.length; i++) FASE[i] = FASE[i - 1] + DT * Math.sqrt(temperatura((i - .5) * DT) / 300);
  const rnd = generatore(1380649);
  // velocità al rallentatore: moduli distribuiti come in un gas in due dimensioni (Rayleigh), direzioni a caso
  MOL = Array.from({ length: N }, () => {
    const v = clamp(160 * Math.sqrt(-2 * Math.log(1 - rnd() * .995)), 40, 420), a = rnd() * Math.PI * 2;
    return { u: rnd() * 2, w: rnd() * 2, vx: v * Math.cos(a), vy: v * Math.sin(a) };
  });
}
const fase = t => { const f = clamp(t, 0, TM) / DT, i = Math.floor(f); return lerp(FASE[i], FASE[i + 1], f - i); };
function tempoDiFase(F) {   // l'inverso: quando le molecole hanno «vissuto» F
  let a = 0, b = FASE.length - 1;
  while (b - a > 1) { const m = (a + b) >> 1; if (FASE[m] <= F) a = m; else b = m; }
  return (a + clamp((F - FASE[a]) / ((FASE[b] - FASE[a]) || 1))) * DT;
}
// il fermo immagine (31,4–45,6) ferma anche le molecole di sfondo: la loro fase resta quella di 31,4 e dopo riparte
// da lì (fino a 60,8 T è costante: niente salti). Anche il grafico degli urti, che parte a 45,8, usa questa fase.
const FERMO = [31.4, 45.6];
const salto = t => t <= FERMO[0] ? 0 : fase(Math.min(t, FERMO[1])) - fase(FERMO[0]);
const faseV = t => fase(t) - salto(t);
const posizione = (m, F) => [BX[0] + R + LX * tri(m.u + m.vx * F / LX), BY[0] + R + LY * tri(m.w + m.vy * F / LY)];
// gli urti sulla parete di destra fra ta e tb: la fase orizzontale passa per un numero dispari
function urti(ta, tb) {
  const Fa = faseV(ta), Fb = faseV(tb), S = salto(FERMO[1]), out = [];   // (ta è sempre dopo il fermo immagine)
  for (const m of MOL) {
    const sa = m.u + m.vx * Fa / LX, sb = m.u + m.vx * Fb / LX, lo = Math.min(sa, sb), hi = Math.max(sa, sb);
    for (let k = Math.ceil((lo - 1) / 2); 2 * k + 1 <= hi; k++) {
      const th = tempoDiFase((2 * k + 1 - m.u) * LX / m.vx + S);
      out.push({ t: th, v: Math.abs(m.vx) * Math.sqrt(temperatura(th) / 300) });
    }
  }
  return out;
}

// 1 · le molecole (7,5–26,4) e 2 · un urto (26,4–45,6)
const YS = 460, VS = 115, T_URTO = 31.4, T_FERMO = T_URTO;
// la molecola seguita: va dritta verso la parete a velocità costante; tocca la parete a 31,4 s e lì c'è il fermo
// immagine, al contatto: la velocità cambia verso e le due forze dell'urto agiscono mentre si toccano
const xSola = t => { const xw = BX[1] - 14; return t < T_URTO ? xw - VS * (T_URTO - t) : xw; };
function scatola(ctx, t, kGas) {
  const F = faseV(t), T = temperatura(t);
  ctx.fillStyle = css(mix(C.v, C.y, (T - 300) / 300), .05); ctx.fillRect(BX[0], BY[0], BX[1] - BX[0], BY[1] - BY[0]);
  ctx.fillStyle = css(C.v, .8 * kGas);
  if (kGas > 0) for (const m of MOL) { const [x, y] = posizione(m, F); ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = css(C.ink); ctx.lineWidth = 6; ctx.strokeRect(BX[0] - 3, BY[0] - 3, BX[1] - BX[0] + 6, BY[1] - BY[0] + 6);
  // il fornellino
  const kf = P(t, 60.6, 61.0) * (T > 300 || t > 60.8 ? 1 : 0);
  if (kf > 0) { ctx.fillStyle = css(C.y, kf); ctx.fillRect(BX[0] + 40, BY[1] + 14, BX[1] - BX[0] - 80, 12); }
}
function scenaScatola(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  prepara();
  const ka = life(t, 7.6, T_FINE + .1, .6, .5);
  card(ctx, 110, 110, 1000, 680, ka); card(ctx, 1150, 110, 660, 680, ka);
  ctx.save(); ctx.globalAlpha *= ka;
  const fermo = t >= T_FERMO && t < 45.6;
  txt(ctx, fermo ? 'fermo immagine' : 'al rallentatore', 130, 140, { size: 30, color: C.dim, align: 'left' });
  const kSola = life(t, 26.6, 45.6, .5, .5);
  scatola(ctx, t, 1 - .8 * kSola);
  // la parete osservata
  const kp = P(t, 26.8, 27.3);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha *= kp; ctx.strokeStyle = css(C.v); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(BX[1] + 2, BY[0] - 3); ctx.lineTo(BX[1] + 2, BY[1] + 3); ctx.stroke();
    txt(ctx, 'parete', BX[1] + 2, BY[0] - 32, { size: 30, color: C.v });
    ctx.restore();
  }
  // la molecola seguita
  if (kSola > 0) {
    ctx.save(); ctx.globalAlpha *= kSola;
    const x = xSola(t);
    dashed(ctx, [BX[0] + 60, YS], [BX[1] - 14, YS], C.dim, 1, .5);
    ctx.fillStyle = css(C.v); ctx.beginPath(); ctx.arc(x, YS, 14, 0, Math.PI * 2); ctx.fill();
    // la velocità, sopra la molecola e tutta di qua dalla parete: prima verso la parete, poi via
    const L = VS * .8, xa = x + 10, xb = xa - L;
    if (t < T_URTO) freccia(ctx, [xb, YS - 44], [xa, YS - 44], C.x, 1, 6); else freccia(ctx, [xa, YS - 44], [xb, YS - 44], C.x, 1, 6);
    drawRich(ctx, '{mx:v}', (xa + xb) / 2, YS - 82, { size: 36 });
    const kF = P(t, 40.9, 41.4);
    if (kF > 0) {   // le due forze dell'urto: sulla parete verso fuori, sulla molecola verso dentro
      freccia(ctx, [BX[1] + 10, YS], [BX[1] + 64, YS], C.y, kF, 7);
      freccia(ctx, [x - 18, YS], [x - 72, YS], C.y, kF, 7);
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------- la scheda di destra ----------
// il grafico degli urti: ogni urto è un picco alto quanto la velocità contro la parete (l'impulso è 2·m·v),
// largo W_PICCO secondi; la forza media è la somma degli impulsi per il numero di urti al secondo
const GXA = 1190, GXB = 1770, GYB = 470, FIN = 4, W_PICCO = .12, KAPPA = .4, T_GRAF = 45.8;
const gx = (th, t) => GXB - (t - th) / FIN * (GXB - GXA);
function forzaMedia(t) {
  const s2 = temperatura(t) / 300;
  return MOL.reduce((a, m) => a + (KAPPA * Math.abs(m.vx) * W_PICCO / 2) * (Math.abs(m.vx) / (2 * LX)), 0) * s2;
}
function grafico(ctx, t) {
  ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GXA, 225); ctx.lineTo(GXA, GYB); ctx.lineTo(GXB + 10, GYB); ctx.stroke();
  arrowHead(ctx, [GXA, 219], -Math.PI / 2, C.ink); arrowHead(ctx, [GXB + 16, GYB], 0, C.ink);
  txt(ctx, 'forza', GXA + 16, 232, { size: 30, color: C.dim, align: 'left' });
  txt(ctx, 'tempo', GXB, GYB + 30, { size: 30, color: C.dim, align: 'right' });
  ctx.save(); ctx.beginPath(); ctx.rect(GXA + 2, 200, GXB - GXA, GYB - 200); ctx.clip();
  ctx.fillStyle = css(C.y, .85);
  for (const u of urti(Math.max(T_GRAF, t - FIN - W_PICCO), t)) {
    const x = gx(u.t, t), h = Math.min(240, KAPPA * u.v), mw = W_PICCO / 2 / FIN * (GXB - GXA);
    ctx.beginPath(); ctx.moveTo(x - mw, GYB); ctx.lineTo(x, GYB - h); ctx.lineTo(x + mw, GYB); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const km = P(t, 50.7, 51.2);
  if (km > 0) {
    const y = GYB - forzaMedia(t);
    ctx.save(); ctx.globalAlpha *= km; ctx.strokeStyle = css(C.g); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(GXA, y); ctx.lineTo(GXB, y); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{g:forza media}', GXA + 20, GYB + 30, { size: 30, align: 'left', alpha: km });
  }
}
function scenaScheda(ctx, t) {
  if (t < 7.5 || t > T_FINE + .3) return;
  prepara();
  const ka = life(t, 7.6, T_FINE + .1, .6, .5);
  ctx.save(); ctx.globalAlpha *= ka;
  const xa = 1200, xb = 1770;
  // 1 · il gas
  const k1 = life(t, 7.9, 26.4, .4, .4);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha *= k1;
    titoletto(ctx, 'le molecole', 1480, 165);
    drawRich(ctx, 'direzioni: {g:tutte}', 1480, 270, { size: 36, local: t - 12.8 });
    drawRich(ctx, 'velocità media ≈ {x:500 m/s}', 1480, 370, { size: 36, local: t - 17.4 });
    drawRich(ctx, '{dim:aria a 300 K}', 1480, 420, { size: 30, local: t - 17.8 });
    drawRich(ctx, 'urti {v:elastici}:', 1480, 520, { size: 36, local: t - 22.0 });
    drawRich(ctx, '{dim:stessa velocità prima e dopo}', 1480, 570, { size: 30, local: t - 22.4 });
    ctx.restore();
  }
  // 2 · un urto: la quantità di moto prima e dopo
  const k2 = life(t, 26.6, 45.6, .4, .4);
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha *= k2;
    titoletto(ctx, 'un urto', 1480, 165);
    const kp = P(t, 31.5, 32.0), kv = P(t, 36.1, 36.6);
    drawRich(ctx, '{mink:m}{dim:: massa della molecola}', 1480, 214, { size: 30, alpha: kp });
    txt(ctx, 'prima', xa, 270, { size: 34, align: 'left', alpha: kp }); freccia(ctx, [1520, 270], [1600, 270], C.x, kp, 6); drawRich(ctx, '{mink:m·}{mx:v}', 1630, 270, { size: 36, align: 'left', alpha: kp });
    txt(ctx, 'dopo', xa, 350, { size: 34, align: 'left', alpha: kp }); freccia(ctx, [1600, 350], [1520, 350], C.x, kp, 6); drawRich(ctx, '{mink:m·}{mx:v}', 1630, 350, { size: 36, align: 'left', alpha: kp });
    txt(ctx, 'variazione', xa, 430, { size: 34, align: 'left', alpha: kv }); freccia(ctx, [1600, 430], [1440, 430], C.v, kv, 6); drawRich(ctx, '2·{mink:m·}{mx:v}', 1630, 430, { size: 36, align: 'left', alpha: kv });
    drawRich(ctx, '{dim:la parete spinge la molecola,}\n{dim:la molecola spinge la parete:}', 1480, 560, { size: 30, local: t - 41.0 });
    drawRich(ctx, '{y:forze uguali e contrarie}', 1480, 650, { size: 36, local: t - 41.8 });
    ctx.restore();
  }
  // 3–4 · tanti urti, la pressione, la temperatura
  const k3 = P(t, 45.8, 46.3);
  if (k3 > 0) {
    ctx.save(); ctx.globalAlpha *= k3;
    titoletto(ctx, 'urti sulla parete', 1480, 165);
    grafico(ctx, t);
    const kr = 1 - P(t, 74.8, 75.3);
    if (kr > 0) {
      ctx.save(); ctx.globalAlpha *= kr;
      drawRich(ctx, '{mv:p}{dim: = forza media / superficie}', 1480, 560, { size: 32, local: t - 55.6 });
      riga(ctx, 'temperatura', Math.round(temperatura(t)) + ' K', 625, C.ink, P(t, 60.7, 61.2), xa, xb);
      riga(ctx, 'velocità', '1,4 volte', 680, C.x, P(t, 65.6, 66.1), xa, xb);
      riga(ctx, 'pressione', '2 volte', 735, C.g, P(t, 70.4, 70.9), xa, xb);
      ctx.restore();
    }
    drawRich(ctx, '{v:energia cinetica media}', 1480, 548, { size: 34, local: t - 75.2 });
    drawRich(ctx, '{dim:di traslazione (rotazioni escluse)}', 1480, 588, { size: 30, local: t - 79.8 });
    drawRich(ctx, '½·{mink:m·}{mx:v}²{dim: medio} = 3/2·{mink:k·T}', 1480, 638, { size: 38, local: t - 84.8 });
    drawRich(ctx, '{mink:T}{dim:: temperatura assoluta}', 1480, 682, { size: 30, local: t - 85.2 });
    drawRich(ctx, '{mink:k} ≈ {mink:1,38·10⁻²³} J/K', 1480, 722, { size: 30, local: t - 89.8 });
    drawRich(ctx, '300 K: ≈ {mg:6,2·10⁻²¹}{g: J}', 1480, 762, { size: 30, local: t - 90.4 });
    ctx.restore();
  }
  ctx.restore();
}

// in una frase (94,4–104,8)
function scenaFine(ctx, t) {
  if (t < T_FINE - .1) return;
  const al = 1 - P(t, 102.9, 103.8);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 94.6 });
    drawRich(ctx, 'La pressione nasce dagli {y:urti}; {mink:T} è proporzionale\nall’energia cinetica media di traslazione.', W / 2, 290, { size: 58, weight: 600, local: t - 95.0, stagger: .09 });
  });
  const pills = [[490, 'ogni urto:\n2·{mink:m·}{mx:v} alla parete'], [960, '{mv:p} = forza media\ndivisa per la superficie'], [1430, '½·{mink:m·}{mx:v}²{dim: medio}\n= 3/2·{mink:k·T}']];
  pills.forEach(([x, s], i) => {
    const a = 96.8 + i * .5, k = P(t, a, a + .5, E.back);
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
    ['soffio', 7.6], ['tono', 8.0, 9.0, [.5, .5]],                                    // il gas nella scatola
    ['pop', 12.8, .4], ['pop', 17.4, .55], ['pop', 22.0, .45],                        // tutte le direzioni, 500 m/s, urti elastici
    ['soffio', 26.6], ['pop', 26.8, .4],                                              // un urto: la parete
    ['tono', 27.0, 31.4, [.3, .7]], ['pop', 31.4, .7],                                // la molecola va dritta e rimbalza
    ['pop', 31.5, .45], ['pop', 36.1, .55],                                           // prima e dopo, variazione 2·m·v
    ['pop', 40.9, .5], ['pop', 41.8, .45],                                            // forze uguali e contrarie
    ['soffio', 45.8],                                                                 // il grafico degli urti
    ['pop', 46.34, .55], ['pop', 46.97, .57], ['pop', 47.08, .32], ['pop', 47.51, .67],   // i primi colpetti sulla parete
    ['traccia', 50.7, 51.2], ['ding', 51.2],                                          // la forza media, costante
    ['pop', 55.6, .5],                                                                // p = forza media / superficie
    ['pop', 60.6, .4], ['tono', 60.8, 63.2, [.3, .3, .32, .36, .45, .54, .58, .6, .6]],   // il fornellino: da 300 K a 600 K
    ['pop', 64.09, .95], ['pop', 64.22, .8],                                          // urti più forti
    ['pop', 65.6, .5], ['pop', 70.5, .6],                                             // velocità 1,4 volte, pressione 2 volte
    ['pop', 75.2, .5], ['pop', 79.8, .35],                                            // energia cinetica media di traslazione
    ['pop', 84.8, .55], ['pop', 89.8, .4], ['ding', 91.0],                            // 3/2·k·T, k, 6,2·10⁻²¹ J
    ['soffio', 94.6], ['pop', 96.8, .5], ['pop', 97.3, .6], ['pop', 97.8, .7],        // in una frase
  ];
  return {
    titolo: 'La pressione è fatta di urti', durata: 104.8, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 26.4, 'molecole che corrono'], [26.4, 45.6, 'un urto'], [45.6, 60.4, 'tanti urti'], [60.4, T_FINE, 'la temperatura']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaScatola(ctx, t); scenaScheda(ctx, t); scenaFine(ctx, t); },
  };
});
