'use strict';
/* Misurare λ con un righello — dalle frange di Young alla lunghezza d'onda. Le frange si danno per note (luce/young):
   qui si ricava dove cadono. Il percorso dalla fenditura più lontana è più lungo di d·sin θ; frangia chiara per
   d·sin θ = n·λ; angoli piccolissimi (la prima frangia a 0,15°), quindi sin θ ≈ tan θ = y/L e yₙ = n·λ·L/d;
   da una frangia all'altra Δy = λ·L/d. Laser rosso λ = 650 nm, d = 0,25 mm, L = 2 m: Δy = 5,2 mm; dieci intervalli
   fanno 52 mm sul righello; al contrario λ = Δy·d/L = 5,2 mm · 0,25 mm / 2000 mm = 0,00065 mm = 650 nm. Laser verde
   532 nm: Δy ≈ 4,3 mm (4,256); con L = 4 m: 8,5 mm (8,512), il doppio. Ricontrollato con node.
   A sinistra lo schema visto dall'alto, NON in scala (L è 8000 volte d: lo si dice); a destra lo schermo visto di
   fronte IN SCALA, 10 px per millimetro, con l'intensità cos²(π·d·y/(λ·L)) (due fenditure strette, come in young)
   e il colore vero della luce (approssimazione di Bruton, come in maxwell/spettro). Argomento: luce. */
CVIDEO.registra('luce/frange', M => {
  const { W, C, E, P, life, kf, clamp, lerp, css, mix, TITOLI, conFont, drawRich, txt, drawSeq, card, arrowHead, dashed, dot } = M;
  const TAU = Math.PI * 2, DEG = Math.PI / 180;

const T_FINE = 83.8;
const POSA = { // x, y, s, sguardo
  x: [[0, 760], [6.4, 760], [7.6, 190], [T_FINE, 190], [T_FINE + 1.3, 420]],
  y: [[0, 900], [6.4, 900], [7.6, 1050], [T_FINE, 1050], [T_FINE + 1.3, 1035]],
  s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [T_FINE, 2.2], [T_FINE + 1.3, 3.0]],
  lx: [[0, 0], [6.4, 0], [7.6, 2], [T_FINE, 2], [T_FINE + 1.3, 1.5]],
  ly: [[0, 0], [6.4, 0], [7.6, -1.5], [T_FINE, -1.5], [T_FINE + 1.3, -2]],
};
const FACCIA = [
  [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'pensa'], [7.9, 'neutro'], [17.3, 'sorpreso'], [22.0, 'neutro'],
  [36.4, 'pensa'], [41.4, 'neutro'], [50.8, 'felice'], [55.6, 'neutro'], [69.4, 'festa'], [74.2, 'neutro'],
  [79.2, 'sorpreso'], [86.3, 'felice'], [90.3, 'occhiolino'],
];
const FUMETTI = [
  [2.5, 6.4, 'Si può misurare la lunghezza d’onda\ncon un righello?'],
  [7.9, 12.3, 'Un laser {v:rosso} illumina due fenditure:\nsullo schermo, le {g:frange}.'],
  [12.5, 17.1, 'Fenditure a {mink:d} = 0,25 mm,\nschermo a {mink:L} = 2 m.'],
  [17.3, 21.8, 'Il disegno {r:non è in scala}: {mink:L}\nè ottomila volte {mink:d}.'],
  [22.0, 26.4, 'Al centro, frangia {g:chiara}: i due\npercorsi sono uguali.'],
  [26.6, 31.45, 'Salgo fino a {mink:P}, ad altezza {mink:y}:\nlo vedo sotto un angolo {mink:θ}.'],
  [31.6, 36.2, 'Il percorso dalla fenditura in basso\nè più lungo di {mink:d·sin θ}.'],
  [36.4, 41.2, 'Frangia chiara se è un numero\nintero di {mink:λ}: {mink:d·sin θ = n·λ}.'],
  [41.4, 46.0, 'Angoli piccolissimi:\n{mink:sin θ ≈ y/L}.'],
  [46.2, 50.6, 'Quindi la frangia {mink:n} sta\na {mink:yₙ = n·λ·L/d}.'],
  [50.8, 55.4, 'E da una frangia alla successiva:\n{mink:Δy = λ·L/d}.'],
  [55.6, 60.0, 'Ora misuro col righello: dieci\nintervalli fanno 52 mm.'],
  [60.2, 64.6, 'Un intervallo: {mink:Δy} = 5,2 mm.'],
  [64.8, 69.2, 'Giro la formula:\n{mink:λ = Δy·d/L}.'],
  [69.4, 74.0, 'Viene {mink:λ} = 650 nm, il rosso del\nlaser. Con un {g:righello}!'],
  [74.2, 79.0, 'Con un laser {g:verde} le frange\nsi stringono: 4,3 mm.'],
  [79.2, 83.6, 'Allontano lo schermo a 4 m:\nfrange larghe il {g:doppio}.'],
  [86.3, 92.1, 'Le frange distano {mink:λ·L/d}: misurandole\nsi trova la lunghezza d’onda.'],
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
function staffa(ctx, a, b, nome, col, al, dx = 0, dy = 0) {   // quota fra due punti, col nome su un fondino
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = css(col); ctx.lineWidth = 3;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * 10, ny = Math.cos(ang) * 10;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
  ctx.moveTo(a[0] - nx, a[1] - ny); ctx.lineTo(a[0] + nx, a[1] + ny); ctx.moveTo(b[0] - nx, b[1] - ny); ctx.lineTo(b[0] + nx, b[1] + ny); ctx.stroke();
  ctx.restore();
  chip(ctx, nome, (a[0] + b[0]) / 2 + dx, (a[1] + b[1]) / 2 + dy, al, 36);
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

// ---------- i numeri ----------
const D_F = .25e-3;                                                   // distanza fra le fenditure, m
const lam = t => kf(t, [[74.4, 650], [75.6, 532]]);                   // nm
const elle = t => kf(t, [[79.4, 2], [80.6, 4]]);                      // m
const dyMm = t => lam(t) * 1e-9 * elle(t) / D_F * 1e3;               // Δy = λ·L/d, in mm

// ---------- lo schema, visto dall'alto (non in scala) ----------
const CS = [110, 110, 900, 690];
const WX = 330, XS = 930, YC = 455, S1 = [WX, 365], S2 = [WX, 545], O = [WX, YC];
const TH = 15 * DEG, YP = YC - (XS - WX) * Math.tan(TH);
const yP = t => kf(t, [[26.8, YC], [28.6, YP]]);
function scenaSchema(ctx, t) {
  const al = life(t, 7.6, T_FINE, .6, .5) * (1 - life(t, 31.4, 41.4, .4, .4));
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  // il laser, il suo fascio, la parete con le fenditure, lo schermo
  const rosso = colLuce(lam(t));
  ctx.save(); ctx.fillStyle = css(rosso, .22); ctx.beginPath(); ctx.moveTo(200, YC - 12); ctx.lineTo(WX, S1[1] - 20); ctx.lineTo(WX, S2[1] + 20); ctx.lineTo(200, YC + 12); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.save(); ctx.fillStyle = css(C.ink, .85); ctx.beginPath(); ctx.roundRect(128, YC - 24, 72, 48, 8); ctx.fill(); ctx.restore();
  txt(ctx, 'laser', 164, YC - 50, { size: 30, color: C.dim });
  ctx.save(); ctx.fillStyle = css(C.ink, .85);
  for (const [a, b] of [[150, S1[1] - 7], [S1[1] + 7, S2[1] - 7], [S2[1] + 7, 760]]) ctx.fillRect(WX - 6, a, 12, b - a);
  ctx.restore();
  linea(ctx, [XS, 150], [XS, 700], C.ink, 6, .85);
  txt(ctx, 'schermo', XS, 724, { size: 30, color: C.dim });
  chip(ctx, '{dim:visto dall’alto ·} {r:non in scala}', 620, 150, P(t, 8.0, 8.6), 30);
  // d e L
  const kq = P(t, 12.7, 13.2);
  staffa(ctx, [WX - 34, S1[1]], [WX - 34, S2[1]], '{mink:d}', C.ink, kq, -26, 0);
  staffa(ctx, [WX, 768], [XS, 768], '{mink:L}', C.ink, kq);
  // al centro: due percorsi uguali
  const kc = life(t, 22.2, 26.6, .4, .3);
  if (kc > 0) { linea(ctx, S1, [XS, YC], C.g, 4, kc); linea(ctx, S2, [XS, YC], C.g, 4, kc); dot(ctx, [XS, YC], C.g, kc, 9); chip(ctx, '{g:uguali}', 700, YC, kc, 30); }
  dashed(ctx, O, [XS, YC], C.dim, P(t, 22.2, 22.8), .7);
  // il punto P, l'angolo θ, l'altezza y
  const kP = P(t, 26.7, 27.0);
  if (kP > 0) {
    const Pp = [XS, yP(t)], th = Math.atan2(YC - Pp[1], XS - WX);
    linea(ctx, S1, Pp, C.x, 4, kP); linea(ctx, S2, Pp, C.x, 4, kP);
    dashed(ctx, O, Pp, C.v, 1, kP);
    dot(ctx, Pp, C.x, kP, 9);
    drawRich(ctx, '{mink:P}', XS - 36, Pp[1] - 28, { size: 38, alpha: kP });
    const kt = P(t, 28.6, 29.0);
    if (kt > 0 && th > .02) {
      ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(WX, YC, 120, -th, 0); ctx.stroke(); ctx.restore();
      chip(ctx, '{mink:θ}', WX + 158 * Math.cos(th / 2), YC - 158 * Math.sin(th / 2), kt, 36);
      staffa(ctx, [XS + 32, YC], [XS + 32, Pp[1]], '{mink:y}', C.ink, kt, 22, 0);
    }
  }
  ctx.restore();
}

// ---------- vicino alle fenditure, ingrandito: i due raggi verso P sono quasi paralleli ----------
const Z1 = [300, 340], Z2 = [300, 570], ZU = [Math.cos(TH), -Math.sin(TH)];
const ZD = (Z1[1] - Z2[1]) * ZU[1];                                   // d·sin θ, in px (≈ 59,5)
const ZF = [Z2[0] + ZU[0] * ZD, Z2[1] + ZU[1] * ZD];                  // il piede della perpendicolare da Z1
function scenaZoom(ctx, t) {
  const al = life(t, 31.6, 41.2, .4, .4);
  if (al <= 0) return;
  ctx.save(); ctx.globalAlpha *= al;
  chip(ctx, '{dim:vicino alle fenditure, ingrandito}', 470, 150, 1, 30);
  chip(ctx, '{x:raggi quasi paralleli}', 640, 372, P(t, 32.0, 32.5), 30);
  ctx.save(); ctx.fillStyle = css(C.ink, .85);
  for (const [a, b] of [[190, Z1[1] - 9], [Z1[1] + 9, Z2[1] - 9], [Z2[1] + 9, 720]]) ctx.fillRect(Z1[0] - 7, a, 14, b - a);
  ctx.restore();
  const L1 = 640;
  linea(ctx, Z1, [Z1[0] + ZU[0] * L1, Z1[1] + ZU[1] * L1], C.x, 4, P(t, 31.8, 32.4));
  linea(ctx, Z2, [Z2[0] + ZU[0] * L1, Z2[1] + ZU[1] * L1], C.x, 4, P(t, 31.8, 32.4));
  arrowHead(ctx, [Z1[0] + ZU[0] * (L1 + 8), Z1[1] + ZU[1] * (L1 + 8)], -TH, C.x, 1.1);
  arrowHead(ctx, [Z2[0] + ZU[0] * (L1 + 8), Z2[1] + ZU[1] * (L1 + 8)], -TH, C.x, 1.1);
  txt(ctx, 'verso P', Z1[0] + ZU[0] * L1 - 70, Z1[1] + ZU[1] * L1 + 48, { size: 30, color: C.x });
  staffa(ctx, [Z1[0] - 40, Z1[1]], [Z1[0] - 40, Z2[1]], '{mink:d}', C.ink, 1, -26, 0);
  // l'angolo θ in basso, il tratto in più in viola
  const kt = P(t, 32.2, 32.8);
  dashed(ctx, Z2, [Z2[0] + 180, Z2[1]], C.dim, 1, kt);
  if (kt > 0) {
    ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = css(C.v); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(Z2[0], Z2[1], 150, -TH, 0); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{mink:θ}', Z2[0] + 176, Z2[1] - 22, { size: 36, alpha: kt });
  }
  const kd = P(t, 33.0, 33.8);
  dashed(ctx, Z1, ZF, C.dim, kd, 1);
  if (kd > 0) {
    ctx.save(); ctx.globalAlpha *= kd; ctx.strokeStyle = css(C.dim); ctx.lineWidth = 2;   // l'angolo retto
    const v = [Z1[0] - ZF[0], Z1[1] - ZF[1]], lv = Math.hypot(v[0], v[1]), w = [v[0] / lv * 16, v[1] / lv * 16];
    ctx.beginPath(); ctx.moveTo(ZF[0] + w[0], ZF[1] + w[1]); ctx.lineTo(ZF[0] + w[0] - ZU[0] * 16, ZF[1] + w[1] - ZU[1] * 16); ctx.lineTo(ZF[0] - ZU[0] * 16, ZF[1] - ZU[1] * 16); ctx.stroke(); ctx.restore();
  }
  const kv = P(t, 33.6, 34.2);
  if (kv > 0) { linea(ctx, Z2, ZF, C.v, 10, kv); chip(ctx, '{mink:d·sin θ}', ZF[0] + 30, Z2[1] + 52, kv, 36); }
  chip(ctx, 'chiara: {mink:d·sin θ = n·λ}', 760, 680, P(t, 36.6, 37.1), 38);
  ctx.restore();
}

// ---------- lo schermo di fronte, in scala (10 px per mm), col righello; e i conti ----------
const RC = [1040, 110, 770, 690];
const PX0 = 1070, PX1 = 1190, PYC = 460, MM = 10, YMAX = 28;          // da −28 a +28 mm
function scenaSchermo(ctx, t) {
  if (t < 7.6 || t > T_FINE + .3) return;
  const al = life(t, 7.8, T_FINE, .5, .5);
  card(ctx, ...RC, al);
  ctx.save(); ctx.globalAlpha *= al;
  txt(ctx, 'lo schermo, di fronte', 1180, 148, { size: 30, color: C.dim });
  // le frange: intensità cos²(π·d·y/(λ·L)), col colore vero della luce
  const kF = P(t, 8.4, 9.4), col = colLuce(lam(t)), buio = mix(col, [0, 0, 0], .93), L = elle(t), l = lam(t) * 1e-9;
  ctx.save(); ctx.fillStyle = css(buio); ctx.fillRect(PX0, PYC - YMAX * MM, PX1 - PX0, 2 * YMAX * MM); ctx.restore();
  if (kF > 0) {
    ctx.save(); ctx.globalAlpha *= kF;
    for (let py = -YMAX * MM; py < YMAX * MM; py += 2) {
      const y = (py + 1) / MM * 1e-3, I = Math.pow(Math.cos(Math.PI * D_F * y / (l * L)), 2);
      ctx.fillStyle = css(mix(buio, col, I)); ctx.fillRect(PX0, PYC + py, PX1 - PX0, 2.4);
    }
    ctx.restore();
  }
  // il righello, in millimetri
  const kR = P(t, 55.7, 56.3);
  if (kR > 0) {
    ctx.save(); ctx.globalAlpha *= kR; ctx.strokeStyle = css(C.ink); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(PX1 + 14, PYC - YMAX * MM); ctx.lineTo(PX1 + 14, PYC + YMAX * MM); ctx.stroke();
    for (let m = -YMAX; m <= YMAX; m++) {
      const L2 = m % 10 === 0 ? 26 : m % 5 === 0 ? 17 : 9, y = PYC - m * MM;
      ctx.beginPath(); ctx.moveTo(PX1 + 14, y); ctx.lineTo(PX1 + 14 + L2, y); ctx.stroke();
      if (m % 10 === 0) txt(ctx, (m < 0 ? '−' : '') + Math.abs(m), PX1 + 48, y, { size: 30, color: C.ink, align: 'left' });
    }
    txt(ctx, 'mm', PX1 + 48, PYC + YMAX * MM + 4, { size: 30, color: C.dim, align: 'left' });
    ctx.restore();
  }
  // dieci intervalli, dalla frangia −5 alla +5
  const kB = life(t, 56.0, 74.2, .5, .4);
  if (kB > 0) {
    const ya = PYC - 26 * MM, yb = PYC + 26 * MM, xb = 1305;
    ctx.save(); ctx.globalAlpha *= kB; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(xb - 14, ya); ctx.lineTo(xb, ya); ctx.lineTo(xb, yb); ctx.lineTo(xb - 14, yb); ctx.stroke();
    ctx.setLineDash([5, 7]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PX1, ya); ctx.lineTo(xb - 16, ya); ctx.moveTo(PX1, yb); ctx.lineTo(xb - 16, yb); ctx.stroke(); ctx.restore();
    drawRich(ctx, '{v:52 mm}', xb + 14, PYC, { size: 34, align: 'left', alpha: kB });
  }
  // i conti, nella colonna di destra
  const cx = 1635;
  const r = (s, y, a, size = 36) => { if (a > 0) drawRich(ctx, s, cx, y, { size, alpha: a }); };
  const kN = P(t, 12.7, 13.2);
  r('{mink:d} = 0,25 mm', 200, kN);
  r('{mink:L} = ' + (L > 2.01 ? (L > 3.99 ? '{g:4 m}' : '…') : '2 m'), 252, kN);
  const lamTxt = t < 69.6 ? '?' : t < 74.4 ? '{g:650 nm}' : t > 75.6 ? '{g:532 nm}' : '…';
  if (lamTxt === '?') r('{mink:λ} {dim:(lunghezza d’onda)} = ?', 304, kN, 32); else r('{mink:λ} = ' + lamTxt, 304, kN);
  // la derivazione (36–55), poi la misura (55–74), poi verde e schermo più lontano
  const kD = 1 - P(t, 55.4, 55.8);
  if (kD > 0) {
    r('{mink:d·sin θ = n·λ}', 395, P(t, 36.6, 37.1) * kD, 38);
    r('{mink:sin θ ≈ y/L}', 452, P(t, 41.6, 42.1) * kD, 38);
    r('{dim:(prima frangia: 0,15°)}', 492, P(t, 42.4, 42.9) * kD * (1 - P(t, 46.2, 46.5)), 30);
    if (t > 46.3) drawSeq(ctx, ['{mink:yₙ =}', { num: '{mink:n·λ·L}', den: '{mink:d}' }], cx, 550, 40, { local: t - 46.4, alpha: kD });
  }
  const kDy = P(t, 51.0, 51.5) * (1 - P(t, 64.8, 65.2));
  if (kDy > 0) {
    ctx.save(); ctx.globalAlpha *= kDy;
    ctx.strokeStyle = css(C.g); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(cx - 170, 615, 340, 120, 16); ctx.stroke();
    drawSeq(ctx, ['{mink:Δy =}', { num: '{mink:λ·L}', den: '{mink:d}' }], cx, 675, 46, { local: t - 51.0 });
    ctx.restore();
  }
  const kM = P(t, 55.8, 56.3) * (1 - P(t, 74.0, 74.4));
  if (kM > 0) {
    r('10 intervalli: {v:52 mm}', 395, kM, 32);
    r('{mink:Δy} = {g:5,2 mm}', 450, kM * P(t, 60.4, 60.9), 38);
  }
  const kL = P(t, 65.0, 65.5) * (1 - P(t, 74.0, 74.4));
  if (kL > 0) {
    drawSeq(ctx, ['{mink:λ =}', { num: '{mink:Δy·d}', den: '{mink:L}' }], cx, 528, 42, { local: t - 65.0, alpha: kL });
    drawSeq(ctx, ['=', { num: '5,2 mm · 0,25 mm', den: '2000 mm' }], cx, 628, 32, { local: t - 69.5, alpha: kL });
    r('= 0,00065 mm', 708, kL * P(t, 70.2, 70.7), 32);
    r('= {g:650 nm}', 760, kL * P(t, 70.5, 71.0), 36);
  }
  const kV = P(t, 74.5, 75.0);
  if (kV > 0) {
    drawSeq(ctx, ['{mink:Δy =}', { num: '{mink:λ·L}', den: '{mink:d}' }], cx, 450, 42, { alpha: kV });
    const dy = dyMm(t);
    r('{mink:Δy} ≈ {g:' + (t < 75.7 || (t > 79.3 && t < 80.7) ? '…' : dy.toFixed(1).replace('.', ',')) + ' mm}', 560, kV, 40);
    r('{dim:il doppio di prima}', 630, P(t, 80.8, 81.3), 32);
  }
  ctx.restore();
}

function scenaTitolo(ctx, t) {
  if (t > 7.5) return;
  conFont(TITOLI, () => drawRich(ctx, 'Misurare λ con un righello', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
}
function scenaCarta(ctx, t) {
  if (t < 7.4 || t > T_FINE + .3) return;
  card(ctx, ...CS, life(t, 7.6, T_FINE, .6, .5));
}
function scenaFine(ctx, t) {
  if (t < T_FINE) return;
  const al = 1 - P(t, 93.6, 94.4);
  ctx.save(); ctx.globalAlpha *= al;
  conFont(TITOLI, () => {
    drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - T_FINE - .2 });
    drawRich(ctx, 'Dalla distanza fra le frange\nsi ricava la lunghezza d’onda.', W / 2, 290, { size: 66, weight: 600, local: t - T_FINE - .6, stagger: .08 });
  });
  const pills = [[490, 'chiara se\n{mink:d·sin θ = n·λ}'], [960, '{mink:Δy = λ·L/d}\n{dim:(angoli piccoli)}'], [1430, '{mink:λ = Δy·d/L}:\nbasta un {g:righello}']];
  pills.forEach(([x, s], i) => {
    const a = T_FINE + 1.6 + i * .5, k = P(t, a, a + .5, E.back);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
    card(ctx, x - 215, 445, 430, 130);
    drawRich(ctx, s, x, 512, { size: 34, weight: 400, lh: 1.3 });
    ctx.restore();
  });
  ctx.restore();
}

  // verifica (node)
  const verifica = {
    dyRossoMm: +(650e-9 * 2 / D_F * 1e3).toFixed(4), dieciIntervalliMm: +(10 * 650e-9 * 2 / D_F * 1e3).toFixed(3),
    lambdaDallaMisuraNm: +(5.2e-3 * D_F / 2 * 1e9).toFixed(3), primaFrangiaGradi: +(Math.asin(650e-9 / D_F) / DEG).toFixed(4),
    dyVerdeMm: +(532e-9 * 2 / D_F * 1e3).toFixed(4), dyVerde4mMm: +(532e-9 * 4 / D_F * 1e3).toFixed(4), Lsud: 2 / D_F,
    tratto: +ZD.toFixed(2), trattoAtteso: +(230 * Math.sin(TH)).toFixed(2),
  };
  // effetti sonori (strumenti/suoni-sintesi.py): il punto P che sale segue la sua altezza; quando cambia il laser il
  // tono segue λ, da 400 nm (0) a 800 nm (1); quando si allontana lo schermo segue L, da 0 (0) a 4 m (1)
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.6], ['pop', 8.4, .6], ['pop', 12.7, .5],                             // le frange sullo schermo; d e L
    ['pop', 22.2, .5],                                                                // al centro: percorsi uguali
    ['pop', 26.7, .3], ['tono', 26.8, 28.6, [.3, .33, .5, .67, .7]], ['pop', 28.6, .5],   // P sale fino all'altezza y; θ e y
    ['soffio', 31.6], ['traccia', 31.8, 32.4], ['pop', 32.2, .45],                    // vicino alle fenditure: raggi quasi paralleli, θ
    ['traccia', 33.0, 33.8], ['pop', 33.6, .6], ['pop', 36.6, .55],                   // il tratto in più d·sin θ; chiara se = n·λ
    ['soffio', 41.4], ['pop', 41.6, .45], ['pop', 46.4, .55], ['ding', 51.2],         // sin θ ≈ y/L, yₙ = n·λ·L/d, Δy = λ·L/d
    ['traccia', 55.7, 56.3], ['pop', 56.0, .6], ['pop', 60.4, .55],                   // il righello: 52 mm, Δy = 5,2 mm
    ['pop', 65.0, .5], ['pop', 69.5, .45], ['pop', 70.2, .4], ['ding', 70.6],         // λ = Δy·d/L = 650 nm
    ['tono', 74.4, 75.6, [.63, .61, .48, .35, .33]], ['pop', 74.5, .45], ['pop', 75.7, .4],   // laser verde: le frange si stringono, 4,3 mm
    ['tono', 79.4, 80.6, [.5, .53, .75, .97, 1]], ['ding', 81.0],                     // schermo a 4 m: il doppio
    ['soffio', 84.0], ['pop', 85.4, .5], ['pop', 85.9, .6], ['pop', 86.4, .7],        // in una frase
  ];
  return {
    titolo: 'Misurare λ con un righello', durata: 94.6, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 22.0, 'l’esperimento'], [22.0, 55.4, 'dove cadono le frange'], [55.4, 74.0, 'la misura'], [74.0, 83.6, 'cambiando λ e L']],
    verifica,
    scena(ctx, t) { scenaTitolo(ctx, t); scenaCarta(ctx, t); scenaSchema(ctx, t); scenaZoom(ctx, t); scenaSchermo(ctx, t); scenaFine(ctx, t); },
  };
});
