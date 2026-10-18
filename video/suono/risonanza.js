'use strict';
/* Il bicchiere che si rompe — la risonanza. Un'altalena lunga circa 1 m (pendolo, per piccole oscillazioni
   θ″ = −ω₀²·θ − γ·θ′ + spinta, ω₀ = π rad/s: un'oscillazione ogni 2 s, f₀ = 0,5 Hz; attrito γ = 0,3 s⁻¹), in tempo vero.
   Lasciata andare oscilla da sola; spinta a ogni ritorno (0,3 s di spinta quando è indietro e riparte) cresce fino a
   ≈ 0,44 rad; spinta ogni 1,2 s arriva a ≈ 0,2 rad: certe spinte vanno contro. Poi una forza che va e viene a frequenza f:
   l'ampiezza a regime è A(f) = F/√((ω₀² − ω²)² + (γ·ω)²), massima per f = f₀ (curva di risonanza calcolata).
   Il bicchiere spinto alla sua nota: bordo che vibra con ampiezza A·(1 − e^(−t/τ)) (al rallentatore, ingrandito),
   finché la deformazione supera il limite e il vetro si rompe. Niente ponti. Argomento: suono. */
CVIDEO.registra('suono/risonanza', M => {
  const { W, C, E, P, life, clamp, lerp, css, TITOLI, conFont, drawRich, txt, fmtN, card, arrowHead, dashed, glowStroke } = M;

  // ---------- l'altalena, integrata una volta sola (RK4, passo 1/600 s) ----------
  const W0 = Math.PI, GAM = 0.3, DT = 1 / 600, SP = 2.3, DSP = 0.3;
  function simula(theta0, durata, inizioSpinte, regola) {
    const th = [], spinte = []; let x = theta0, v = 0, fine = -1, vPrima = 0, prossima = inizioSpinte;
    for (let i = 0; i <= Math.round(durata / DT); i++) {
      const t = i * DT;
      if (t >= inizioSpinte - 1e-9) {
        if (regola === 'ritorno' ? (vPrima < 0 && v >= 0) : t >= prossima - 1e-9) {
          fine = t + DSP; spinte.push(t); if (regola !== 'ritorno') prossima += regola;
        }
      }
      th.push(x);
      const a = t < fine ? SP : 0, f = (x, v) => [v, -W0 * W0 * x - GAM * v + a];
      const k1 = f(x, v), k2 = f(x + DT / 2 * k1[0], v + DT / 2 * k1[1]), k3 = f(x + DT / 2 * k2[0], v + DT / 2 * k2[1]), k4 = f(x + DT * k3[0], v + DT * k3[1]);
      vPrima = v;
      x += DT / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += DT / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    }
    return { th, spinte, valore: s => { const i = clamp(s / DT, 0, th.length - 1), i0 = Math.floor(i); return lerp(th[i0], th[Math.min(i0 + 1, th.length - 1)], i - i0); } };
  }
  // A: lasciata andare da −0,15 rad a 7,4 s; dopo 5 oscillazioni (10 s) torna indietro e da lì la si spinge a ogni ritorno
  const SA = simula(-0.15, 23.2, 9.9, 'ritorno'), TA = 7.4, sA = t => clamp(t - TA, 0, 23.2);
  // B: da ferma, una spinta ogni 1,2 s
  const SB = simula(0, 13.4, 0, 1.2), TB = 31.0, sB = t => clamp(t - TB, 0, 13.4);
  const inPausa = t => t < TA || (t > 30.6 && t < TB);
  // la forza che va e viene: le prove, ognuna a regime
  const F0 = .5 * GAM * W0;
  const ampiezza = f => { const w = 2 * Math.PI * f; return F0 / Math.hypot(W0 * W0 - w * w, GAM * w); };
  const PROVE = [[44.8, .25], [53.7, .75], [54.65, .35], [55.6, .65], [56.7, .42], [57.5, .58], [58.3, .46], [59.1, .54], [59.9, .5]];
  const prova = t => { let i = -1; for (let k = 0; k < PROVE.length; k++) if (t >= PROVE[k][0]) i = k; return i; };
  const regime = (f, t, t0) => { const w = 2 * Math.PI * f, d = Math.atan2(GAM * w, W0 * W0 - w * w); return ampiezza(f) * Math.cos(w * (t - t0) - d); };
  // il bicchiere: al rallentatore, ingrandito
  const TG = 74.0, EG = .14, TAUG = 5, FG = 1.5, LIM = .12;
  const def = t => t < TG ? 0 : EG * (1 - Math.exp(-(t - TG) / TAUG)) * Math.sin(2 * Math.PI * FG * (t - TG));
  const TROTTO = (() => { for (let i = 0; i < 40000; i++) { const t = TG + i / 1000; if (Math.abs(def(t)) >= LIM) return t; } return 99; })();

  const POSA = {
    x: [[0, 760], [6.4, 760], [7.6, 190], [86.9, 190], [88.2, 420]],
    y: [[0, 900], [6.4, 900], [7.6, 1050], [86.9, 1050], [88.2, 1035]],
    s: [[0, 4.4], [6.4, 4.4], [7.6, 2.2], [86.9, 2.2], [88.2, 3.0]],
    lx: [[0, 0], [6.4, 0], [7.6, 2], [86.9, 2], [88.2, 1.5]],
    ly: [[0, 0], [6.4, 0], [7.6, -1.5], [86.9, -1.5], [88.2, -2]],
  };
  const FACCIA = [
    [0, 'neutro'], [1.45, 'sorpreso'], [2.0, 'felice'], [7.9, 'neutro'], [17.0, 'neutro'], [21.5, 'felice'],
    [26.1, 'festa'], [30.6, 'neutro'], [35.1, 'pensa'], [40.0, 'neutro'], [44.6, 'neutro'], [49.1, 'pensa'],
    [53.6, 'neutro'], [59.9, 'sorpreso'], [64.5, 'felice'], [69.1, 'neutro'], [73.7, 'pensa'], [78.1, 'neutro'],
    [82.7, 'sorpreso'], [86.7, 'neutro'], [89.4, 'felice'], [94.6, 'occhiolino'],
  ];
  const FUMETTI = [
    [2.6, 6.4, 'Si può rompere un bicchiere\ncon una nota?'],
    [7.9, 12.3, 'Un’altalena lunga circa 1 m,\nlasciata andare: oscilla da sola.'],
    [12.4, 16.9, 'Un’oscillazione ogni 2 s: la sua\n{v:frequenza propria} {mink:f₀} = 0,5 Hz.'],
    [17.0, 21.4, 'Ora la spingo a ogni ritorno,\nsempre nello stesso punto…'],
    [21.5, 26.0, '…ogni spinta arriva al momento giusto:\noscilla sempre di più.'],
    [26.1, 30.4, 'È la {v:risonanza}: le spinte hanno\nla frequenza propria dell’altalena.'],
    [30.6, 35.0, 'Ora spingo a un altro ritmo:\nuna volta ogni 1,2 s.'],
    [35.1, 39.9, 'Certe spinte arrivano contro:\nl’altalena oscilla {r:molto meno}.'],
    [40.0, 44.4, 'Spingere più spesso non serve:\nconta il ritmo giusto.'],
    [44.6, 49.0, 'Ora una forza che oscilla\na una frequenza {mink:f} scelta.'],
    [49.1, 53.5, 'A 0,25 Hz si muove appena:\nsegno l’{v:ampiezza} sul grafico.'],
    [53.6, 56.6, 'Lontano da {mink:f₀} oscilla poco…'],
    [56.7, 59.8, '…più vicino a {mink:f₀}, di più…'],
    [59.9, 64.4, '…a {mink:f = f₀} l’ampiezza è {g:massima}:\nil picco di risonanza.'],
    [64.5, 68.9, 'Ecco tutta la curva:\nla {v:curva di risonanza}.'],
    [69.1, 73.6, 'Anche un bicchiere ha una frequenza\npropria: il «din» se lo colpisci.'],
    [73.7, 78.0, 'Un altoparlante suona proprio\nquella nota, molto forte…'],
    [78.1, 82.6, '…il bordo vibra sempre di più:\nogni onda arriva al momento giusto.'],
    [82.7, 86.6, 'Quando si deforma troppo,\nil vetro {r:si rompe}.'],
    [89.4, 94.4, 'Alla frequenza propria ogni spinta\nsi somma: è la risonanza.'],
  ];

  // ---------- aiutanti ----------
  function freccia(ctx, a, b, col, al = 1, w = 6) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    if (al <= 0.01 || L < 2) return;
    const ux = dx / L, uy = dy / L, s = Math.min(1.1, L / 22);
    ctx.save(); ctx.globalAlpha *= al;
    ctx.strokeStyle = css(col); ctx.lineWidth = w; ctx.lineCap = 'round';
    if (L > 14 * s) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * 14 * s, b[1] - uy * 14 * s); ctx.stroke(); }
    arrowHead(ctx, [b[0] - ux * 4 * s, b[1] - uy * 4 * s], Math.atan2(dy, dx), col, s);
    ctx.restore();
  }
  const spingeOra = (spinte, s) => spinte.some(p => s >= p && s < p + DSP);

  // ---------- 1–2 · l'altalena (7,5–69) ----------
  const PV = [500, 175], LR = 380;
  const seduta = th => [PV[0] + LR * Math.sin(th), PV[1] + LR * Math.cos(th)];
  function stato(t) {                                     // angolo, spinta (−1…1 o null), e alfa
    if (t < 30.6) return { th: inPausa(t) ? -0.15 : SA.valore(sA(t)), sp: spingeOra(SA.spinte, sA(t)) ? 1 : 0, al: 1 - P(t, 30.3, 30.6) };
    if (t < 44.6) return { th: SB.valore(sB(t)), sp: t >= TB && spingeOra(SB.spinte, sB(t)) ? 1 : 0, al: P(t, 30.7, 31.0) * (1 - P(t, 44.3, 44.6)) };
    const k = Math.max(0, prova(t)), [t0, f] = PROVE[k];
    // una breve dissolvenza fra una prova e l'altra: sono prove diverse, non la stessa altalena che salta
    const tn = k + 1 < PROVE.length ? PROVE[k + 1][0] : 99, entra = k ? P(t, t0, t0 + .12) : P(t, 44.7, 45.0);
    return { th: regime(f, t, t0), sp: Math.cos(2 * Math.PI * f * (t - t0)), al: entra * (1 - P(t, tn - .12, tn)), f, t0 };
  }
  function scenaAltalena(ctx, t) {
    if (t < 7.5 || t > 69.4) return;
    const al = P(t, 7.5, 8.2) * (1 - P(t, 68.8, 69.4));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 800, 690);
    // il castello dell'altalena
    ctx.strokeStyle = css(C.ink, .7); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(150, 700); ctx.lineTo(PV[0] - 34, PV[1] - 12); ctx.moveTo(850, 700); ctx.lineTo(PV[0] + 34, PV[1] - 12);
    ctx.moveTo(PV[0] - 70, PV[1] - 12); ctx.lineTo(PV[0] + 70, PV[1] - 12); ctx.stroke();
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(140, 702); ctx.lineTo(860, 702); ctx.stroke();
    const S = stato(t);
    ctx.save(); ctx.globalAlpha *= S.al;
    // nelle prove a regime: le due posizioni estreme, sbiadite
    if (S.f) {
      const A = ampiezza(S.f);
      ctx.strokeStyle = css(C.v, .35); ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
      for (const s of [-1, 1]) { const q = seduta(s * A); ctx.beginPath(); ctx.moveTo(...PV); ctx.lineTo(...q); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    const q = seduta(S.th);
    ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...PV); ctx.lineTo(...q); ctx.stroke();
    ctx.save(); ctx.translate(...q); ctx.rotate(-S.th); ctx.fillStyle = css(C.x); ctx.beginPath(); ctx.roundRect(-44, -6, 88, 16, 6); ctx.fill(); ctx.restore();
    ctx.fillStyle = css(C.ink); ctx.beginPath(); ctx.arc(...PV, 7, 0, Math.PI * 2); ctx.fill();
    // la spinta, lungo la direzione del moto (da dietro, verso avanti)
    const tg = [Math.cos(S.th), -Math.sin(S.th)];
    if (S.f) {
      const L = 90 * S.sp;
      if (Math.abs(L) > 6) freccia(ctx, [q[0] + tg[0] * (L > 0 ? -60 - L : 60 - L), q[1] + tg[1] * (L > 0 ? -60 - L : 60 - L)], [q[0] + tg[0] * (L > 0 ? -60 : 60), q[1] + tg[1] * (L > 0 ? -60 : 60)], C.y, 1, 6);
    } else if (S.sp) freccia(ctx, [q[0] - tg[0] * 150, q[1] - tg[1] * 150], [q[0] - tg[0] * 56, q[1] - tg[1] * 56], C.y, 1, 7);
    ctx.restore();
    // le scritte in alto
    drawRich(ctx, '{mink:f₀} = 0,5 Hz', 130, 755, { size: 34, align: 'left', alpha: life(t, 12.6, 44.5, .5, .3) });
    if (S.f) drawRich(ctx, 'forza a {mink:f} = ' + fmtN(S.f, 2) + ' Hz', 130, 755, { size: 34, align: 'left', alpha: P(t, 44.8, 45.2) });
    txt(ctx, t > 44.6 ? 'ogni prova già assestata' : 'tempo vero', 870, 755, { size: 30, color: C.dim, align: 'right', alpha: P(t, 8.0, 8.5) });
    ctx.restore();
  }

  // ---------- 1 · l'angolo nel tempo (8–44,6) ----------
  const GX = 990, GSX = 33, GSY = 220;
  function striscia(ctx, sim, sNow, y0, col, nome, yl, al) {
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha *= al;
    drawRich(ctx, nome, GX - 10, yl, { size: 30, align: 'left' });
    ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX, y0); ctx.lineTo(GX + 23.2 * GSX, y0); ctx.stroke();
    const n = Math.floor(sNow * 60), pts = [];
    for (let i = 0; i <= n; i++) { const s = i / 60; pts.push([GX + s * GSX, y0 - GSY * sim.valore(s)]); }
    pts.push([GX + sNow * GSX, y0 - GSY * sim.valore(sNow)]);
    if (pts.length > 1) glowStroke(ctx, pts, 1, col, 4);
    ctx.fillStyle = css(C.y);
    for (const p of sim.spinte) if (p <= sNow) { const x = GX + p * GSX; ctx.beginPath(); ctx.moveTo(x, y0 + 104); ctx.lineTo(x - 9, y0 + 120); ctx.lineTo(x + 9, y0 + 120); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function scenaAngolo(ctx, t) {
    if (t < 8.0 || t > 45.0) return;
    const al = P(t, 8.0, 8.6) * (1 - P(t, 44.3, 44.8));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 940, 110, 880, 690);
    conFont(TITOLI, () => drawRich(ctx, 'l’angolo dell’altalena nel tempo', 1380, 152, { size: 34, weight: 600 }));
    striscia(ctx, SA, sA(t), 320, C.g, '{g:spinta a ogni ritorno}', 200, 1);
    striscia(ctx, SB, sB(t), 610, C.r, '{r:spinta ogni 1,2 s}', 490, P(t, 30.8, 31.2));
    // la scala del tempo e le spinte
    for (const s of [0, 5, 10, 15, 20]) txt(ctx, s ? String(s) : '0', GX + s * GSX, 764, { size: 30, color: C.dim });
    txt(ctx, 's', GX + 23.2 * GSX, 764, { size: 30, color: C.dim });
    drawRich(ctx, '{y:▲} {dim:una spinta}', 1790, 200, { size: 30, align: 'right', alpha: P(t, 17.4, 17.9) });
    ctx.restore();
  }

  // ---------- 2 · la curva di risonanza (44,6–69) ----------
  const fx = f => 1010 + f * 740, ay = A => 700 - A * 800;
  const CURVA = Array.from({ length: 301 }, (_, i) => { const f = .05 + .9 * i / 300; return [fx(f), ay(ampiezza(f))]; });
  function scenaCurva(ctx, t) {
    if (t < 44.4 || t > 69.4) return;
    const al = P(t, 44.6, 45.2) * (1 - P(t, 68.8, 69.4));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 940, 110, 880, 690);
    conFont(TITOLI, () => drawRich(ctx, 'l’ampiezza, una volta assestata', 1380, 152, { size: 34, weight: 600 }));
    ctx.strokeStyle = css(C.ink, .75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(fx(0), ay(0)); ctx.lineTo(fx(1.02), ay(0)); ctx.moveTo(fx(0), ay(0)); ctx.lineTo(fx(0), ay(.6)); ctx.stroke();
    arrowHead(ctx, [fx(1.02) + 6, ay(0)], 0, C.ink); arrowHead(ctx, [fx(0), ay(.6) - 6], -Math.PI / 2, C.ink);
    for (const f of [.25, .5, .75, 1]) { ctx.beginPath(); ctx.moveTo(fx(f), ay(0) - 7); ctx.lineTo(fx(f), ay(0) + 7); ctx.stroke(); txt(ctx, fmtN(f, 2).replace(/0$/, '').replace(/,0$/, ''), fx(f), ay(0) + 34, { size: 30, color: C.dim }); }
    drawRich(ctx, '{mink:f} {dim:(Hz)}', fx(1.02) - 4, ay(0) + 74, { size: 30, align: 'right' });
    txt(ctx, 'ampiezza', fx(0) + 18, ay(.6), { size: 30, color: C.dim, align: 'left' });
    dashed(ctx, [fx(.5), ay(0)], [fx(.5), ay(.56)], C.v, 1, .8);
    drawRich(ctx, '{mink:f₀}', fx(.5) + 30, ay(.56), { size: 36 });
    const kc = P(t, 64.6, 66.2, E.lin);
    if (kc > 0) glowStroke(ctx, CURVA, kc, C.v, 5);
    const ik = prova(t);
    PROVE.forEach(([t0, f], k) => {
      const ta = k ? t0 + .25 : 49.3, kk = P(t, ta, ta + .3, E.back); if (kk <= 0) return;
      ctx.save(); ctx.globalAlpha *= Math.min(1, kk); ctx.fillStyle = css(k === 8 ? C.g : C.y);
      ctx.beginPath(); ctx.arc(fx(f), ay(ampiezza(f)), (k === ik ? 13 : 9) * kk, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
    ctx.restore();
  }

  // ---------- 3 · il bicchiere (69–87) ----------
  const GCX = 620, RIMY = 400, GW = 80, ING = 3;           // deformazione disegnata 3 volte più grande
  function bicchiere(ctx, e) {
    const w = GW * (1 + ING * e);
    ctx.save(); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 4; ctx.fillStyle = css(C.x, .1);
    ctx.beginPath(); ctx.moveTo(GCX - w, RIMY); ctx.quadraticCurveTo(GCX - w, RIMY + 150, GCX - 8, RIMY + 165);
    ctx.lineTo(GCX + 8, RIMY + 165); ctx.quadraticCurveTo(GCX + w, RIMY + 150, GCX + w, RIMY); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(GCX, RIMY, w, 14, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  function stelo(ctx) {
    ctx.save(); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(GCX, RIMY + 165); ctx.lineTo(GCX, 684); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(GCX, 690, 62, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  const COCCI = [[-120, 8, 34, .3], [-60, 4, 26, -.5], [70, 6, 30, .8], [130, 9, 22, -.2], [20, 3, 18, 1.2]];
  function scenaBicchiere(ctx, t) {
    if (t < 68.9 || t > 87.6) return;
    const al = P(t, 69.0, 69.6) * (1 - P(t, 86.5, 87.1));
    ctx.save(); ctx.globalAlpha *= al;
    card(ctx, 100, 110, 800, 690);
    ctx.strokeStyle = css(C.ink, .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(140, 702); ctx.lineTo(860, 702); ctx.stroke();
    const rotto = t >= TROTTO;
    stelo(ctx);
    if (!rotto) bicchiere(ctx, def(t));
    else {
      // le crepe per un attimo, poi i cocci sul tavolo
      const kc = 1 - P(t, TROTTO + .15, TROTTO + .5);
      if (kc > 0) {
        ctx.save(); ctx.globalAlpha *= kc; bicchiere(ctx, 0);
        ctx.strokeStyle = css(C.r); ctx.lineWidth = 4;
        for (const [a, b] of [[[GCX - 60, RIMY + 10], [GCX - 10, RIMY + 90]], [[GCX - 10, RIMY + 90], [GCX + 40, RIMY + 40]], [[GCX - 10, RIMY + 90], [GCX + 10, RIMY + 150]], [[GCX + 40, RIMY + 40], [GCX + 70, RIMY + 20]]]) { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
        ctx.restore();
      }
      const ks = P(t, TROTTO + .3, TROTTO + .7);
      ctx.save(); ctx.globalAlpha *= ks; ctx.fillStyle = css(C.x, .18); ctx.strokeStyle = css(C.ink, .8); ctx.lineWidth = 3;
      for (const [dx, h, s, r] of COCCI) {
        ctx.save(); ctx.translate(GCX + dx, 700 - h); ctx.rotate(r);
        ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(s / 2, -4); ctx.lineTo(s / 6, -s * .6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      ctx.restore();
    }
    // l'altoparlante alla stessa frequenza
    const ka = P(t, 73.8, 74.2);
    ctx.save(); ctx.globalAlpha *= P(t, 69.2, 69.7);
    ctx.fillStyle = css(C.ink, .14); ctx.strokeStyle = css(C.ink, .85); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(210, 440, 44, 70, 8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(254, 455); ctx.lineTo(300, 418); ctx.lineTo(300, 532); ctx.lineTo(254, 495); ctx.closePath(); ctx.fill(); ctx.stroke();
    txt(ctx, 'altoparlante', 265, 580, { size: 30, color: C.dim });
    ctx.restore();
    if (ka > 0) {
      ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = css(C.v); ctx.lineWidth = 4;
      for (const r of [40, 70, 100, 130]) { ctx.beginPath(); ctx.arc(300, 475, r, -.5, .5); ctx.stroke(); }
      ctx.restore();
      drawRich(ctx, 'suona {mink:f = f₀}', 265, 370, { size: 32, alpha: ka });
    }
    drawRich(ctx, 'il bicchiere: {mink:f₀}', GCX, 300, { size: 32, alpha: life(t, 69.4, TROTTO + .4, .5, .4) });
    txt(ctx, 'al rallentatore, deformazione ingrandita', 130, 150, { size: 30, color: C.dim, align: 'left', alpha: P(t, 74.0, 74.5) });
    ctx.restore();
    // la deformazione del bordo nel tempo
    const kg = P(t, 69.2, 69.8) * (1 - P(t, 86.5, 87.1));
    ctx.save(); ctx.globalAlpha *= kg;
    card(ctx, 940, 110, 880, 690);
    conFont(TITOLI, () => drawRich(ctx, 'deformazione del bordo', 1380, 152, { size: 34, weight: 600 }));
    const X0 = 990, SX = 70, Y0 = 450, SY = 1800;
    ctx.strokeStyle = css(C.ink, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(X0 + 11 * SX, Y0); ctx.stroke();
    for (const s of [-1, 1]) dashed(ctx, [X0, Y0 - s * LIM * SY], [X0 + 11 * SX, Y0 - s * LIM * SY], C.r, 1, .9);
    drawRich(ctx, '{r:qui il vetro si rompe}', X0 + 11 * SX, Y0 - LIM * SY - 26, { size: 30, align: 'right' });
    txt(ctx, 'tempo →', X0 + 11 * SX, Y0 + LIM * SY + 40, { size: 30, color: C.dim, align: 'right' });
    if (t > TG) {
      const tf = Math.min(t, TROTTO), pts = [];
      for (let u = TG; u <= tf; u += 1 / 120) pts.push([X0 + (u - TG) * SX, Y0 - def(u) * SY]);
      pts.push([X0 + (tf - TG) * SX, Y0 - def(tf) * SY]);
      glowStroke(ctx, pts, 1, C.v, 4);
      if (rotto) { ctx.fillStyle = css(C.r); ctx.beginPath(); ctx.arc(X0 + (TROTTO - TG) * SX, Y0 - def(TROTTO) * SY, 10, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }

  // ---------- titolo e chiusura ----------
  function scenaTitolo(ctx, t) {
    if (t > 7.5) return;
    conFont(TITOLI, () => drawRich(ctx, 'Il bicchiere che si rompe', W / 2, 180, { size: 120, weight: 600, local: t - 1.6, stagger: .15, alpha: 1 - P(t, 6.2, 7.0) }));
  }
  function scenaFine(ctx, t) {
    if (t < 86.9) return;
    const al = 1 - P(t, 95.0, 96.0);
    ctx.save(); ctx.globalAlpha *= al;
    conFont(TITOLI, () => {
      drawRich(ctx, '{v:in una frase}', W / 2, 150, { size: 42, weight: 500, local: t - 87.1 });
      drawRich(ctx, 'Spinto alla sua frequenza propria,\nun oggetto oscilla sempre di più.', W / 2, 290, { size: 66, weight: 600, local: t - 87.5, stagger: .08 });
    });
    const pills = [[490, '{mink:f = f₀}:\nampiezza {g:massima}'], [960, 'l’altalena spinta\na ogni ritorno'], [1430, 'il bicchiere\nalla sua nota']];
    pills.forEach(([x, s], i) => {
      const a = 89.1 + i * .5, k = P(t, a, a + .5, E.back);
      if (k <= 0) return;
      ctx.save(); ctx.translate(x, 510); ctx.scale(k, k); ctx.translate(-x, -510);
      card(ctx, x - 215, 445, 430, 130);
      drawRich(ctx, s, x, 512, { size: 33, weight: 400, lh: 1.3 });
      ctx.restore();
    });
    ctx.restore();
  }

  // effetti sonori (strumenti/suoni-sintesi.py): video sul suono, quindi pochi e discreti. Il tono segue l'altalena,
  // da 0,5 rad indietro (0) a 0,5 rad avanti (1), un'oscillazione sola; i punti della curva hanno l'altezza
  // dell'ampiezza; il bordo del bicchiere che vibra resta senza tono, per non confondersi con la sua nota
  const SUONI = [
    ['soffio', 1.6],                                                                  // il titolo
    ['soffio', 7.5], ['tono', 7.4, 9.4, [.35, .39, .49, .59, .63, .59, .51, .42, .39]],   // lasciata andare: un'oscillazione
    ['pop', 12.7, .45], ['pop', 17.45, .4],                                           // f₀ = 0,5 Hz; la prima spinta
    ['tono', 28.32, 30.19, [.13, .29, .62, .88, .93, .76, .48, .22, .12]],            // a ogni ritorno: oscilla sempre di più
    ['pop', 31.0, .4], ['tono', 40.0, 42.4, [.61, .58, .49, .51, .61, .62, .53, .52, .58]],   // una spinta ogni 1,2 s: molto meno
    ['soffio', 44.7], ['pop', 49.3, .13],                                             // la forza a frequenza f; 0,25 Hz
    ['pop', 53.95, .08], ['pop', 54.9, .19], ['pop', 55.85, .14], ['pop', 56.95, .31],   // le prove, sempre più vicine a f₀
    ['pop', 57.75, .26], ['pop', 58.55, .54], ['pop', 59.35, .49], ['ding', 60.2],    // a f = f₀ il massimo
    ['traccia', 64.6, 66.2], ['tono', 64.6, 66.2, [.1, .1, .11, .14, .19, .33, 1, .28, .14, .09, .06, .05, .04]],   // la curva di risonanza
    ['soffio', 69.0], ['pop', 69.5, .5],                                              // il bicchiere e la sua f₀
    ['pop', 73.9, .5], ['traccia', 74.0, 75.5],                                       // l'altoparlante; il bordo comincia a vibrare
    ['pop', 83.83, .9], ['pop', 84.2, .25],                                           // si rompe; i cocci
    ['soffio', 87.1], ['pop', 89.1, .5], ['pop', 89.6, .6], ['pop', 90.1, .7],        // in una frase
  ];
  return {
    titolo: 'Il bicchiere che si rompe', durata: 97, copertina: 4.2, suoni: SUONI,
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },
    capitoli: [[7.5, 30.5, 'spinte a tempo'], [30.5, 44.5, 'il ritmo sbagliato'], [44.5, 69.0, 'la curva di risonanza'], [69.0, 86.8, 'il bicchiere']],
    scena(ctx, t) { scenaTitolo(ctx, t); scenaAltalena(ctx, t); scenaAngolo(ctx, t); scenaCurva(ctx, t); scenaBicchiere(ctx, t); scenaFine(ctx, t); },
  };
});
