/* Laboratorio «Le montagne russe» — conservazione dell'energia e attrito (argomento energia).
   Si disegna il profilo della pista trascinando i dossi (il dito passa sopra la pista e i dossi lo seguono; − e + per la
   precisione), poi si lascia andare il carrello. Il moto è quello vero: la velocità in ogni punto viene dal bilancio
   dell'energia, ½·v² = ½·v0² + g·(h0 − y) − (F_d / m)·ℓ, con ℓ il binario percorso; il tempo da dt = ds / v.
   L'attrito è una forza costante F_d contraria al moto (come nel video energia/attrito): toglie F_d·ℓ di energia meccanica.
   Il carrello è agganciato al binario, come quelli veri: non si stacca sulle cime.
   Contratto in SCHEMA-LAB.md; modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-montagne-russe .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; cursor: crosshair; }
    .lab-montagne-russe .lab-scena > svg { width: 100%; height: 100%; }
    .lab-montagne-russe svg text { font-family: var(--font); }
    .lab-montagne-russe svg text, .lab-montagne-russe svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-montagne-russe .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-montagne-russe .consegna > span { display: block; }
    .lab-montagne-russe .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-montagne-russe .consegna:empty { display: none; }
    .lab-montagne-russe .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1.05rem, 2.5cqmin, 1.2rem); line-height: 1.2; height: calc(4.4 * clamp(1.05rem, 2.5cqmin, 1.2rem)); flex: none; }
    .lab-montagne-russe .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-montagne-russe .formula .ignoto { color: var(--testo3); }
    .lab-montagne-russe .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-montagne-russe .formula .esito.no { color: var(--no); }
    .lab-montagne-russe .formula .dove { color: var(--testo2); font-size: .9em; }
    .lab-montagne-russe .lab-messaggio { padding: 0 4px; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-montagne-russe .formula { height: calc(6.4 * clamp(1.05rem, 2.5cqmin, 1.2rem)); } .lab-montagne-russe .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-montagne-russe .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-montagne-russe .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-montagne-russe .btn[disabled] { opacity: .38; cursor: default; }
    .lab-montagne-russe .lab-parametri { max-width: 520px; }
    .lab-montagne-russe .lab-parametri .b-casuale { justify-self: center; }
    .lab-montagne-russe .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-montagne-russe .lab-param[hidden] { display: none; }
    .lab-montagne-russe .lab-param .nome { min-width: 1.8em; }
    .lab-montagne-russe .lab-param[data-p="h"] .nome { min-width: 0; width: 1.8em; flex: none; }   /* h, h₀, h₁…: cambia col punto scelto */
    .lab-montagne-russe .lab-param output { min-width: 0; width: 5.6ch; flex: none; white-space: nowrap; }
    .lab-montagne-russe .lab-param[data-p="v0"] output { width: 6.6ch; }
    .lab-montagne-russe .lab-param[data-p="m"] output { width: 6.6ch; }
    .lab-montagne-russe .lab-param output .unita { font-size: .8em; font-weight: 500; color: var(--testo2); }
    .lab-montagne-russe.in-libero .lab-param { gap: 2px; }
    .lab-montagne-russe.in-libero .lab-param .nome { min-width: 1.3em; }
        .lab-montagne-russe.in-libero .lab-parametri { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 6px; }
    @container lab (max-width: 420px) { .lab-montagne-russe.in-libero .lab-param .btn { min-width: 32px; padding: 0 4px; } }
    .lab-montagne-russe.in-libero .lab-param[data-p="h"] .nome { width: 1.5em; }
    .lab-montagne-russe.in-libero .lab-param[data-p="h"] output { width: 5.1ch; }
    .lab-montagne-russe.in-libero .lab-param[data-p="v0"] output, .lab-montagne-russe.in-libero .lab-param[data-p="m"] output { width: 5.9ch; }
    .lab-montagne-russe.in-libero .lab-param[data-p="fd"] output { width: 4.6ch; }
    .lab-montagne-russe .lab-parametri.uno { grid-template-columns: 1fr; }
    .lab-montagne-russe .vinto { display: inline-block; animation: lab-mr-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-mr-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-montagne-russe .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-montagne-russe .formula .simbolo, .lab-montagne-russe .formula .dove { display: none; } .lab-montagne-russe .formula .nome-stretto { display: inline; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 3 nel Libero, dove la consegna non c'è) */
    .lab-montagne-russe .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(3 * var(--riga) + 2 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-montagne-russe .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-montagne-russe .lab-lato .consegna:empty { display: none; }
    .lab-montagne-russe .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-montagne-russe .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli in node) ---------------- */
  const G = 9.8, PASSO = 0.5, H_MAX = 25, CODA = 4, DX = 0.05;

  /* la pista campionata: fra due punti di controllo una mezza onda di coseno (pendenza zero nei punti, quindi le cime
     e le valli stanno proprio nei punti); il primo tratto, se la partenza è «in caduta», è un quarto di seno:
     ripido alla partenza (il carrello fermo si mette in moto) e piatto in fondo. Dopo la stazione, 4 m di piano. */
  function campiona(pista) {
    const P = pista.punti, xs = [P[0].x], ys = [P[0].y], idx = [0];
    for (let k = 0; k < P.length - 1; k++) {
      const a = P[k], b = P[k + 1], n = Math.max(2, Math.ceil((b.x - a.x) / DX));
      for (let j = 1; j <= n; j++) {
        const t = j / n;
        const f = (k === 0 && pista.caduta) ? Math.sin(Math.PI * t / 2) : (1 - Math.cos(Math.PI * t)) / 2;
        xs.push(a.x + (b.x - a.x) * t); ys.push(a.y + (b.y - a.y) * f);
      }
      idx.push(xs.length - 1);
    }
    const iSt = xs.length - 1, st = P[P.length - 1], nc = Math.ceil(CODA / DX);
    for (let j = 1; j <= nc; j++) { xs.push(st.x + CODA * j / nc); ys.push(st.y); }
    const s = [0];
    for (let i = 1; i < xs.length; i++) s.push(s[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
    return { xs, ys, s, idx, iSt };
  }
  /* dove sta il carrello quando ha percorso sv metri di binario: x, y e la pendenza */
  function punto(C, sv) {
    const s = C.s; let a = 0, b = s.length - 1;
    if (sv <= 0) a = b = 0; else if (sv >= s[b]) a = b - 1;
    else while (b - a > 1) { const m = (a + b) >> 1; if (s[m] <= sv) a = m; else b = m; }
    if (a === b) b = Math.min(s.length - 1, a + 1);
    const ds = s[b] - s[a] || 1, f = Math.max(0, Math.min(1, (sv - s[a]) / ds));
    return { x: C.xs[a] + (C.xs[b] - C.xs[a]) * f, y: C.ys[a] + (C.ys[b] - C.ys[a]) * f, ang: Math.atan2(C.ys[b] - C.ys[a], C.xs[b] - C.xs[a]) };
  }

  /* il viaggio: par = { v0 (m/s), mu = F_d / (m·g) }.
     Avanti finché l'energia cinetica resta positiva: e = ½·v² = ½·v0² + g·(y0 − y) − mu·g·s.
     Se si annulla prima della stazione il carrello si ferma, e se la pendenza lì vince l'attrito torna indietro e
     oscilla finché l'attrito non lo tiene. In stazione lo fermano i freni (decelerazione costante).
     Restituisce la linea del tempo (T, S, V), le velocità nei punti di controllo, e com'è finita. */
  function simula(pista, par, C) {
    C = C || campiona(pista);
    const xs = C.xs, ys = C.ys, s = C.s, iSt = C.iSt, mu = par.mu || 0, v0 = par.v0 || 0, y0 = ys[0];
    const T = [0], S = [0], V = [v0];
    const e = i => v0 * v0 / 2 + G * (y0 - ys[i]) - mu * G * s[i];
    let i = 1, t = 0, vPrec = v0;
    for (; i <= iSt; i++) {
      const ei = e(i);
      if (ei <= 0) break;
      const v = Math.sqrt(2 * ei);
      t += 2 * (s[i] - s[i - 1]) / (vPrec + v);   /* esatto se l'accelerazione nel tratto è costante */
      T.push(t); S.push(s[i]); V.push(v); vPrec = v;
    }
    const r = { C, T, S, V, vPunti: C.idx.map((ix, k) => k === 0 ? v0 : (ix < i ? Math.sqrt(Math.max(0, 2 * e(ix))) : null)) };
    if (i > iSt) {
      r.arriva = true; r.vSt = vPrec; r.tSt = t;
      const Lc = s[s.length - 1] - s[iSt], a = vPrec * vPrec / (2 * Lc), tf = vPrec / a;
      for (let k = 1; k <= 24; k++) { const tt = tf * k / 24; T.push(t + tt); S.push(s[iSt] + vPrec * tt - a * tt * tt / 2); V.push(Math.max(0, vPrec - a * tt)); }
      r.sFine = s[s.length - 1];
      return r;
    }
    r.arriva = false;
    const ea = Math.max(0, e(i - 1)), eb = e(i);
    if (i === 1 && ea <= 1e-12) { r.nonParte = true; r.sStop = 0; r.yStop = y0; r.xStop = xs[0]; r.sFine = 0; return r; }
    const f = ea / (ea - eb), sStop = s[i - 1] + f * (s[i] - s[i - 1]);
    t += 2 * (sStop - s[i - 1]) / (vPrec || 1e-9);
    T.push(t); S.push(sStop); V.push(0);
    const pS = punto(C, sStop);
    r.sStop = sStop; r.xStop = pS.x; r.yStop = pS.y; r.iStop = i - 1;
    r.tPrimo = t;
    /* poi oscilla: a ogni punto di inversione resta fermo se la pendenza non vince l'attrito (|sin θ| ≤ mu),
       altrimenti torna giù dall'altra parte, con l'energia che l'attrito gli ha lasciato. Senza attrito torna
       fino alla partenza e lì la scena si ferma (oscillerebbe per sempre). Al massimo 40 mezze oscillazioni. */
    let sT = sStop, yT = pS.y, fine = sStop, seg = [i - 1, i];
    for (let giro = 0; giro < 40; giro++) {
      const sen = (ys[seg[1]] - ys[seg[0]]) / (s[seg[1]] - s[seg[0]]);
      if (Math.abs(sen) <= mu) { if (giro === 0) r.resta = true; break; }
      r.ritorno = true;
      const dir = sen > 0 ? -1 : 1;
      let j = dir < 0 ? seg[1] : seg[0];
      while (j >= 0 && j <= iSt && (dir < 0 ? s[j] >= sT - 1e-9 : s[j] <= sT + 1e-9)) j += dir;   /* il primo campione oltre il punto di inversione */
      let eP = 0, sP = sT, vP = 0, fermato = false;
      for (; j >= 0 && j <= iSt; j += dir) {
        const ej = G * (yT - ys[j]) - mu * G * Math.abs(sT - s[j]);
        if (ej <= 0) {
          const g = eP / (eP - ej), s2 = sP + g * (s[j] - sP);
          t += 2 * Math.abs(s2 - sP) / (vP || 1e-9); T.push(t); S.push(s2); V.push(0);
          seg = dir < 0 ? [j, j + 1] : [j - 1, j]; sT = s2; yT = punto(C, s2).y; fine = s2; fermato = true;
          break;
        }
        const v = Math.sqrt(2 * ej);
        t += 2 * Math.abs(s[j] - sP) / (vP + v); T.push(t); S.push(s[j]); V.push(v);
        eP = ej; sP = s[j]; vP = v; fine = s[j];
      }
      if (!fermato) { r.allaPartenza = dir < 0; break; }   /* è tornato al respingente della partenza */
      if (!mu) break;   /* senza attrito oscillerebbe per sempre fra la partenza e il dosso: basta un ritorno */
    }
    r.sFine = fine;
    return r;
  }
  /* lunghezza del binario dalla partenza al punto di controllo k */
  const lunghezza = (C, k) => C.s[C.idx[k]];

  /* ---------------- livelli ----------------
     punti: { x, y, tipo, libero, nome } (nome in TeX per il pannello). m in kg, Fd in N. Le soglie che dipendono dal
     profilo (dosso più alto possibile, partenza più bassa possibile, somma più alta) non sono scritte qui: le calcola
     la fisica all'inizio del livello (soglie()). Tolleranze: 1 m sotto il massimo per i dossi, mezzo metro sopra il
     minimo per la catena, 1,5 m sotto la somma massima per i tre dossi. */
  const P = (tipo, x, y, libero, nome) => ({ tipo, x, y, libero: !!libero, nome: nome || '' });
  const LIVELLI = [
    { tipo: 'dosso', caduta: true, m: 500, Fd: 0, v0: 0, formula: 'cima',
      punti: [P('partenza', 0, 20), P('valle', 9, 2), P('dosso', 20, 23, true, 'h'), P('valle', 31, 2), P('stazione', 40, 3)] },
    { tipo: 'vcima', caduta: true, m: 500, Fd: 0, v0: 0, vMin: 9.5, vMax: 10.5, formula: 'cima',
      punti: [P('partenza', 0, 20), P('valle', 9, 2), P('dosso', 20, 6, true, 'h'), P('valle', 31, 2), P('stazione', 40, 3)] },
    { tipo: 'varrivo', caduta: true, m: 200, masse: [200, 800], Fd: 0, v0: 0, vMin: 13.5, vMax: 14.5, formula: 'cima', fPunto: 4,
      punti: [P('partenza', 0, 17, true, 'h_0'), P('valle', 9, 1), P('dosso', 20, 5), P('valle', 31, 1), P('stazione', 40, 0)] },
    { tipo: 'dosso', caduta: false, m: 500, Fd: 0, v0: 12, formula: 'cima',
      punti: [P('partenza', 0, 4), P('piano', 5, 4), P('valle', 11, 1), P('dosso', 21, 3, true, 'h'), P('valle', 31, 1), P('stazione', 40, 2)] },
    { tipo: 'dosso', caduta: true, m: 500, Fd: 245, v0: 0, formula: 'attrito',
      punti: [P('partenza', 0, 20), P('valle', 9, 2), P('dosso', 20, 19.5, true, 'h'), P('valle', 31, 2), P('stazione', 40, 3)] },
    { tipo: 'varrivo', caduta: true, m: 500, Fd: 245, v0: 0, vMin: 2, vMax: 5, formula: 'attrito', fPunto: 4,
      punti: [P('partenza', 0, 12, true, 'h_0'), P('valle', 9, 1), P('dosso', 20, 6.5), P('valle', 29, 1), P('stazione', 38, 6)] },
    { tipo: 'somma', caduta: true, m: 500, Fd: 147, v0: 0, formula: 'attrito',
      punti: [P('partenza', 0, 20), P('valle', 6, 1), P('dosso', 13, 8, true, 'h_1'), P('valle', 19, 1), P('dosso', 26, 8, true, 'h_2'), P('valle', 32, 1), P('dosso', 39, 8, true, 'h_3'), P('valle', 45, 1), P('stazione', 51, 2)] },
    { tipo: 'catena', caduta: true, m: 500, Fd: 245, v0: 0, formula: 'attrito', fPunto: 2,
      punti: [P('partenza', 0, 22, true, 'h_0'), P('valle', 7, 1), P('dosso', 16, 12), P('valle', 24, 1), P('dosso', 32, 11), P('valle', 40, 1), P('stazione', 47, 3)] }
  ];
  const LIBERO = { tipo: 'libero', caduta: true, m: 500, Fd: 0, v0: 0, formula: 'libero',
    punti: [P('partenza', 0, 18, true, 'h_0'), P('valle', 8, 2, true, 'h_1'), P('dosso', 18, 14, true, 'h_2'), P('valle', 28, 3, true, 'h_3'), P('dosso', 38, 10, true, 'h_4'), P('valle', 46, 1, true, 'h_5'), P('stazione', 54, 2, true, 'h_6')] };

  const copiaPunti = L => L.punti.map(p => Object.assign({}, p));
  const muDi = (Fd, m) => Fd / (m * G);
  const arrivaCon = (L, punti, m) => simula({ punti, caduta: L.caduta }, { v0: L.v0, mu: muDi(L.Fd, m || L.m) }).arriva;

  /* le soglie calcolate del livello (per la prova in node e per il gioco) */
  function soglie(L) {
    const pt = copiaPunti(L), liberi = pt.map((p, k) => p.libero ? k : -1).filter(k => k >= 0);
    if (L.tipo === 'dosso') {
      const k = liberi[0];
      for (let h = H_MAX; h >= 0; h -= PASSO) { pt[k].y = h; if (arrivaCon(L, pt)) return { max: h, min: h - 1 }; }
      return { max: 0, min: -1 };
    }
    if (L.tipo === 'catena') {
      const k = liberi[0];
      for (let h = 0; h <= H_MAX; h += PASSO) { pt[k].y = h; if (arrivaCon(L, pt)) return { min: h, max: h + PASSO }; }
      return { min: H_MAX, max: H_MAX };
    }
    if (L.tipo === 'somma') {   /* uno alla volta, il più alto possibile dato quelli prima (quelli dopo bassi) */
      liberi.forEach(k => { pt[k].y = 0; });
      let somma = 0;
      liberi.forEach(k => {
        let best = 0;
        for (let h = H_MAX; h >= 0; h -= PASSO) { pt[k].y = h; if (arrivaCon(L, pt)) { best = h; break; } }
        pt[k].y = best; somma += best;
      });
      return { max: somma, min: somma - 1.5, greedy: liberi.map(k => pt[k].y) };
    }
    return {};
  }

  /* il verdetto di una corsa: { ok, testo, tappa? } (il testo dice che cosa è successo, non come rimediare) */
  function verdetto(L, punti, r, sg, m) {
    const fermo = () => {
      if (r.nonParte) return 'Il carrello non parte: davanti a lui la pista sale.';
      const prossimo = punti.findIndex((p, k) => k > 0 && r.C.idx[k] > r.iStop);
      const dove = prossimo > 0 && punti[prossimo].tipo === 'dosso' ? ' sulla salita del dosso di ' + numV(punti[prossimo].y) + '\u00a0m' : '';
      return 'Si ferma a ' + num(r.yStop, 1) + '\u00a0m' + dove + (r.ritorno ? ', e torna indietro.' : '.');
    };
    if (!r.arriva) return { ok: false, testo: fermo() };
    const lib = punti.map((p, k) => p.libero ? k : -1).filter(k => k >= 0);
    if (L.tipo === 'dosso') {
      const h = punti[lib[0]].y;
      if (h >= sg.min - 1e-9) return { ok: true, testo: 'Passa il dosso di ' + num(h, 1) + '\u00a0m e arriva in stazione.' };
      return { ok: false, testo: 'Arriva in stazione, ma il dosso di ' + numV(h) + '\u00a0m può essere più alto.', basso: true };
    }
    if (L.tipo === 'vcima') {
      const k = lib[0], v = Math.round(r.vPunti[k] * 10) / 10;   /* si giudica il valore che si legge (al decimo) */
      if (v >= L.vMin - 1e-9 && v <= L.vMax + 1e-9) return { ok: true, testo: 'In cima al dosso a ' + num(v, 1) + '\u00a0m/s.' };
      return { ok: false, testo: 'In cima al dosso a ' + num(v, 1) + '\u00a0m/s: ' + (v > L.vMax ? 'troppo veloce.' : 'troppo piano.'), v };
    }
    if (L.tipo === 'varrivo') {
      const v = Math.round(r.vSt * 10) / 10;
      if (v >= L.vMin - 1e-9 && v <= L.vMax + 1e-9) return { ok: true, testo: 'In stazione a ' + num(v, 1) + '\u00a0m/s.' };
      return { ok: false, testo: 'In stazione a ' + num(v, 1) + '\u00a0m/s: ' + (v > L.vMax ? 'troppo veloce.' : 'troppo piano.'), v };
    }
    if (L.tipo === 'somma') {
      const somma = lib.reduce((a, k) => a + punti[k].y, 0);
      if (somma >= sg.min - 1e-9) return { ok: true, testo: 'Arriva in stazione con tre dossi che fanno ' + num(somma, 1) + '\u00a0m in tutto.' };
      return { ok: false, testo: 'Arriva in stazione, ma i tre dossi fanno solo ' + num(somma, 1) + '\u00a0m: si può salire di più.', basso: true };
    }
    if (L.tipo === 'catena') {
      const h = punti[lib[0]].y;
      if (h <= sg.max + 1e-9) return { ok: true, testo: 'Arriva in stazione partendo da ' + num(h, 1) + '\u00a0m.' };
      return { ok: false, testo: 'Arriva in stazione, ma si può partire più in basso di ' + numV(h) + '\u00a0m.', alto: true };
    }
    return { ok: false, testo: '' };
  }

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function numV(v) { return v % 1 ? num(v, 1) : String(v); }               /* 20 oppure 18,5 */
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  function texV(v) { return Math.abs(v % 1) > 1e-9 ? texNum(v, 1) : String(Math.round(v)); }
  function texJ(v) {   /* joule interi, con lo spazio fine delle migliaia: 98\,000 */
    const n = Math.round(Math.abs(v)), s = String(n), parti = [];
    for (let i = s.length; i > 0; i -= 3) parti.unshift(s.slice(Math.max(0, i - 3), i));
    return (v < 0 && n ? '-' : '') + (n >= 10000 ? parti.join('\\,') : s);
  }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- testi ---------------- */
  const CONSEGNE = [
    () => 'Senza attrito, da <b>20&nbsp;m</b>: il dosso <b>più alto possibile</b> che il carrello passa.',
    () => 'Senza attrito, da <b>20&nbsp;m</b>: in cima al dosso deve andare a <b>10&nbsp;m/s</b> (±0,5&nbsp;m/s).',
    f => f ? 'Ora è pieno, <b>800&nbsp;kg</b>: da dove parte per arrivare ancora a <b>14&nbsp;m/s</b>?'
           : 'Vuoto, <b>200&nbsp;kg</b>: da dove parte per arrivare in stazione a <b>14&nbsp;m/s</b> (±0,5&nbsp;m/s)?',
    () => 'Una molla lo lancia a <b>12&nbsp;m/s</b> da <b>4&nbsp;m</b>: il dosso <b>più alto possibile</b> che passa.',
    () => 'Con l\'attrito, <b>245&nbsp;N</b>. Da <b>20&nbsp;m</b>: il dosso <b>più alto possibile</b> che passa.',
    () => 'Attrito <b>245&nbsp;N</b>: scegli la partenza per arrivare in stazione fra <b>2</b> e <b>5&nbsp;m/s</b>.',
    () => 'Attrito <b>147&nbsp;N</b>: tre dossi, la <b>somma più alta possibile</b> che il carrello passa.',
    () => 'Attrito <b>245&nbsp;N</b>: la <b>partenza più bassa</b> con cui arriva in stazione.'
  ];
  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    () => 'Senza attrito risale fin quasi ai 20\u00a0m: la potenziale diventa cinetica, poi torna potenziale.',
    pt => 'In cima conta solo il dislivello: ' + numV(20 - pt[2].y) + '\u00a0m sotto la partenza, e v = √(2·g·Δh) fa circa 10\u00a0m/s.',
    () => 'La massa si semplifica: vuoto o pieno, dalla stessa altezza arriva alla stessa velocità.',
    () => 'La molla gli ha dato energia cinetica: senza attrito sale più in alto della partenza.',
    () => 'Con l\'attrito l\'energia meccanica cala: il carrello non risale più fino ai 20\u00a0m della partenza.',
    () => 'In stazione arriva con quello che resta: m·g·(h₀ − h) meno F<sub>d</sub>·ℓ, l\'energia che l\'attrito trasforma in energia interna.',
    () => 'Ogni dosso più basso del precedente: per questo sulle montagne russe vere il primo è il più alto.',
    () => 'Non bastava passare il dosso più alto: il secondo è più basso, ma l\'attrito ha avuto più binario per frenare.'
  ];
  const AIUTO = 'Passa il dito sopra la pista: i punti azzurri (un dosso, o la partenza) seguono il dito a passi di mezzo metro; con − e + ritocchi quello scelto (tieni premuto per andare veloce). «Via» lascia andare il carrello. La sua velocità in ogni punto viene dal bilancio dell\'energia: senza attrito ½·m·v² + m·g·h resta quella della partenza. L\'attrito è una forza costante F<sub>d</sub> contraria al moto: toglie F<sub>d</sub>·ℓ di energia meccanica, dove ℓ è il binario percorso, e la fa diventare energia interna. Il carrello è agganciato al binario, come quelli veri, e in stazione lo fermano i freni. Tocca un dosso, una valle o la stazione: la formula parla di quel punto, e il risultato compare dopo la corsa.';
  const AIUTI = [
    ' Vale se il dosso è al massimo 1\u00a0m sotto il più alto che il carrello riesce a passare.',
    ' Vale se in cima va fra 9,5 e 10,5\u00a0m/s.',
    ' Vale se in stazione va fra 13,5 e 14,5\u00a0m/s, prima con il carrello vuoto e poi con quello pieno.',
    ' La molla lo lancia a 12\u00a0m/s sul piano della partenza. Vale se il dosso è al massimo 1\u00a0m sotto il più alto possibile.',
    ' L\'attrito vale 245\u00a0N lungo tutta la pista. Vale se il dosso è al massimo 1\u00a0m sotto il più alto possibile.',
    ' Vale se in stazione va fra 2 e 5\u00a0m/s.',
    ' Vale se la somma dei tre dossi è al massimo 1,5\u00a0m sotto la più alta possibile.',
    ' La salita con la catena costa energia, m·g·h₀: conviene partire il più in basso possibile. Vale se parti al massimo mezzo metro sopra la partenza più bassa possibile.'
  ];
  const AIUTO_LIBERO = 'In modalità libera non c\'è un obiettivo. Disegna la pista passando il dito sopra i punti (si muovono tutti, anche le valli e la stazione) e scegli la velocità di partenza v₀, la forza d\'attrito F<sub>d</sub> e la massa m. Con l\'attrito la massa conta: la stessa F<sub>d</sub> frena meno un carrello più pesante. «Casuale» propone una pista a caso, «Ricomincia» rimette quella di partenza.';
  const NOMI_PUNTO = { partenza: 'alla partenza', valle: 'in fondo alla valle', dosso: 'in cima al dosso', stazione: 'in stazione', piano: 'sul piano' };

  QUANTO.registraLab({
    id: 'montagne-russe',
    fisica: { campiona, simula, soglie, verdetto, LIVELLI, LIBERO, lunghezza, copiaPunti, muDi, punto },   /* per la prova in node */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-montagne-russe')) { const s = document.createElement('style'); s.id = 'stile-lab-montagne-russe'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-montagne-russe');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, la pista e i numeri li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="h"><span class="nome"></span><button type="button" class="btn piccolo" data-d="-1" aria-label="punto più in basso">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="punto più in alto">+</button></div>
              <div class="lab-param" data-p="v0" hidden><span class="nome">${ctx.tex('v_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="velocità di partenza più bassa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="velocità di partenza più alta">+</button></div>
              <div class="lab-param" data-p="fd" hidden><span class="nome">${ctx.tex('F_d')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno attrito">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più attrito">+</button></div>
              <div class="lab-param" data-p="m" hidden><span class="nome">${ctx.tex('m')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="massa più piccola">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="massa più grande">+</button></div>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">🎢 Via</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { h: q('[data-p="h"]'), v0: q('[data-p="v0"]'), fd: q('[data-p="fd"]'), m: q('[data-p="m"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, L = LIVELLI[0], punti = copiaPunti(L), m = L.m, Fd = L.Fd, v0 = L.v0, fase = 0, sg = {};
      let corse = 0, finito = false, animando = false, raf = 0, ultimo = null, scelto = 2, fPunto = 2, detti = {}, prima = null, vintoFase0 = null;
      let libero = false, salvato = null, inCorsa = null;   /* inCorsa = { r, s, v } durante l'animazione */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;

      const pista = () => ({ punti, caduta: L.caduta });
      const chiave = () => punti.map(p => p.y).join(',') + '|' + v0 + '|' + Fd + '|' + m;
      let cache = { k: '', C: null };
      const geom = () => { const k = punti.map(p => p.x + ':' + p.y).join(',') + L.caduta; if (cache.k !== k) cache = { k, C: campiona(pista()) }; return cache.C; };
      const E0 = () => m * G * punti[0].y + m * v0 * v0 / 2;

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Il profilo delle montagne russe, il carrello e le barre della sua energia', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gPista = el('g'), gEsito = el('g'), gPunti = el('g'), gCarro = el('g'), gBarre = el('g');
      [gFondo, gPista, gEsito, gPunti, gCarro, gBarre].forEach(g => svg.appendChild(g));

      /* S = { w, h, U (px per metro), ox, oy (dove sta x = 0, y = 0), banda (altezza della fascia delle barre) } */
      let S = { w: 300, h: 200, U: 6, Uy: 6, ox: 30, oy: 180, banda: 62 };
      const PX = x => S.ox + x * S.U, PY = y => S.oy - y * S.Uy;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(r.width)), h = Math.max(200, Math.round(r.height));
        const X = punti[punti.length - 1].x + CODA + 1, Y = H_MAX + 2.2;
        const sx = 36, dx = 10, giu = 16, bandaMin = 64;
        const U = Math.min((w - sx - dx) / X, (h - giu - bandaMin - 6) / Y);
        /* in verticale avanzerebbe cielo vuoto: le quote si allungano, al massimo di una volta e mezza (l'asse delle quote lo dice) */
        const Uy = Math.max(U, Math.min(1.5 * U, (h - giu - 76 - 6) / Y));
        const ox = sx + Math.max(0, (w - sx - dx - X * U) / 2);
        S = { w, h, U, Uy, ox, oy: h - giu, banda: Math.min(110, Math.max(bandaMin, h - giu - Y * Uy - 6)) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      function disegnaFondo() {
        vuota(gFondo);
        for (let y = 5; y <= H_MAX; y += 5) {
          gFondo.appendChild(el('line', { x1: S.ox - 4, y1: PY(y), x2: S.w, y2: PY(y), stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .6 }));
          gFondo.appendChild(el('text', { x: S.ox - 7, y: PY(y) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, y + '\u00a0m'));
        }
        gFondo.appendChild(el('rect', { x: 0, y: PY(0), width: S.w, height: S.h - PY(0), fill: '#b5813f', opacity: .38 }));
        gFondo.appendChild(el('line', { x1: 0, y1: PY(0), x2: S.w, y2: PY(0), stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .5 }));
        gFondo.appendChild(el('text', { x: S.ox - 7, y: PY(0) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, '0'));
      }

      function disegnaPista() {
        vuota(gPista);
        const C = geom(), xs = C.xs, ys = C.ys;
        /* i pali di sostegno, uno ogni 2 m */
        let j = 0;
        for (let x = 1; x < xs[xs.length - 1]; x += 2) {
          while (j < xs.length - 1 && xs[j] < x) j++;
          if (ys[j] > 0.3) gPista.appendChild(el('line', { x1: PX(xs[j]), y1: PY(0), x2: PX(xs[j]), y2: PY(ys[j]), stroke: 'var(--testo2)', 'stroke-width': 1.2, opacity: .45 }));
        }
        /* la torre della partenza */
        const h0 = punti[0].y;
        if (h0 > 0.2) {
          gPista.appendChild(el('path', { d: `M${PX(0) - 7} ${PY(0)} L${PX(0) - 3} ${PY(h0)} M${PX(0) + 5} ${PY(0)} L${PX(0) + 1} ${PY(h0)}`, stroke: 'var(--testo2)', 'stroke-width': 2, opacity: .7, fill: 'none' }));
          for (let y = 2; y < h0; y += 3) gPista.appendChild(el('line', { x1: PX(0) - 6, y1: PY(y), x2: PX(0) + 4, y2: PY(y), stroke: 'var(--testo2)', 'stroke-width': 1, opacity: .5 }));
        }
        gPista.appendChild(el('line', { x1: PX(0) - 4, y1: PY(h0) - 11, x2: PX(0) - 4, y2: PY(h0) + 3, stroke: 'var(--testo)', 'stroke-width': 3, 'stroke-linecap': 'round' }));   /* il respingente */
        /* il binario */
        let d = '';
        for (let i = 0; i < xs.length; i += 2) d += (i ? 'L' : 'M') + PX(xs[i]).toFixed(1) + ' ' + PY(ys[i]).toFixed(1);
        d += 'L' + PX(xs[xs.length - 1]).toFixed(1) + ' ' + PY(ys[ys.length - 1]).toFixed(1);
        gPista.appendChild(el('path', { d, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 7, opacity: .35, 'stroke-linejoin': 'round' }));
        gPista.appendChild(el('path', { d, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }));
        /* la stazione */
        const st = punti[punti.length - 1], x0 = PX(st.x), x1 = PX(st.x + CODA), yb = PY(st.y), tetto = Math.max(28, 3.2 * S.Uy);
        gPista.appendChild(el('path', { d: `M${x0 - 3} ${yb - tetto} L${(x0 + x1) / 2} ${yb - tetto - 12} L${x1 + 3} ${yb - tetto} Z`, fill: 'var(--testo2)', opacity: .55 }));
        gPista.appendChild(el('line', { x1: x0 + 1, y1: yb - tetto, x2: x0 + 1, y2: yb, stroke: 'var(--testo2)', 'stroke-width': 2, opacity: .6 }));
        gPista.appendChild(el('line', { x1: x1 - 1, y1: yb - tetto, x2: x1 - 1, y2: yb, stroke: 'var(--testo2)', 'stroke-width': 2, opacity: .6 }));
        if (st.y > 0.3) gPista.appendChild(el('rect', { x: x0, y: yb + 2, width: x1 - x0, height: PY(0) - yb - 2, fill: 'var(--testo2)', opacity: .25 }));
      }

      /* i punti della pista: quelli liberi sono maniglie azzurre (accento); il punto della formula ha la sua quota tratteggiata */
      function disegnaPunti() {
        vuota(gPunti);
        const fp = punti[fPunto];
        if (fp) gPunti.appendChild(el('line', { x1: PX(fp.x), y1: PY(0), x2: PX(fp.x), y2: PY(fp.y), stroke: 'var(--testo2)', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }));
        punti.forEach((p, k) => {
          if (p.tipo === 'piano') return;
          const cx = PX(p.x), cy = PY(p.y);
          if (p.libero) {
            if (k === scelto) gPunti.appendChild(el('circle', { cx, cy, r: 15, fill: 'none', stroke: 'var(--accento)', 'stroke-width': 2, opacity: .55 }));
            gPunti.appendChild(el('circle', { cx, cy, r: 9, fill: 'var(--accento)', stroke: 'var(--sup)', 'stroke-width': 2 }));
          } else if (k === fPunto && p.tipo !== 'partenza') gPunti.appendChild(el('circle', { cx, cy, r: 4.5, fill: 'var(--testo2)' }));
          const conEtichetta = p.libero || p.tipo === 'dosso' || p.tipo === 'partenza' || p.tipo === 'stazione';
          if (!conEtichetta) return;
          const ye = p.tipo === 'stazione' ? cy - Math.max(28, 3.2 * S.Uy) - 16 : p.tipo === 'partenza' ? cy - Math.max(p.libero ? 17 : 10, 20 * morsa(S.U / 14, 1, 2) + 8) : cy - (p.libero ? 17 : 10);   /* la partenza sta sopra il carrello */
          gPunti.appendChild(el('text', { x: p.tipo === 'partenza' ? cx + 4 : cx, y: Math.max(S.banda + 12, ye), 'text-anchor': p.tipo === 'partenza' ? 'start' : 'middle', fill: p.libero ? 'var(--testo)' : 'var(--testo2)', style: 'font: ' + (p.libero ? 700 : 600) + ' 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, numV(p.y) + '\u00a0m'));
        });
      }

      /* dopo la corsa: le velocità sulle cime e in stazione (azzurre: velocità), e dove si è fermato */
      function disegnaEsito() {
        vuota(gEsito);
        if (!ultimo || ultimo.chiave !== chiave()) return;
        const r = ultimo.r;
        punti.forEach((p, k) => {
          const v = k === punti.length - 1 ? (r.arriva ? r.vSt : null) : r.vPunti[k];
          if (v == null || k === 0 || (p.tipo !== 'dosso' && p.tipo !== 'stazione' && k !== fPunto)) return;
          const y = p.tipo === 'stazione' ? PY(p.y) - Math.max(28, 3.2 * S.Uy) - 32 : PY(p.y) - (p.libero ? 33 : 26);
          gEsito.appendChild(el('text', { x: morsa(PX(p.x), 30, S.w - 30), y: Math.max(S.banda + 26, y), 'text-anchor': 'middle', fill: 'var(--s1)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, num(v, 1) + '\u00a0m/s'));
        });
        if (!r.arriva && !r.nonParte) {
          const cx = PX(r.xStop), cy = PY(r.yStop);
          gEsito.appendChild(el('circle', { cx, cy, r: 5, fill: 'var(--no)' }));
        }
      }

      /* il carrello, appoggiato al binario, e la sua velocità (freccia azzurra lungo la pista) */
      function disegnaCarro(sv, v, verso) {
        vuota(gCarro);
        const C = geom(), p0 = punto(C, sv), cx = PX(p0.x), cy = PY(p0.y);
        const p = { ang: Math.atan2(Math.sin(p0.ang) * S.Uy, Math.cos(p0.ang) * S.U) }, a = -p.ang * 180 / Math.PI;   /* la pendenza come si vede */
        const sc = morsa(S.U / 14, 1, 2);   /* sugli schermi grandi il carrello cresce con la scena */
        const g = el('g', { transform: 'translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ') rotate(' + a.toFixed(1) + ') scale(' + sc.toFixed(2) + ')' });
        g.appendChild(el('rect', { x: -12, y: -15, width: 24, height: 11, rx: 3.5, fill: 'var(--accento)', stroke: 'var(--testo)', 'stroke-width': 1.5 }));
        g.appendChild(el('rect', { x: -7, y: -20, width: 9, height: 6, rx: 2, fill: 'var(--testo2)' }));
        g.appendChild(el('circle', { cx: -7, cy: -3, r: 3, fill: 'var(--testo)' }));
        g.appendChild(el('circle', { cx: 7, cy: -3, r: 3, fill: 'var(--testo)' }));
        gCarro.appendChild(g);
        if (v > 0.05) {
          const K = morsa(S.U * 0.45, 2.6, 6), L = v * K, ux = Math.cos(p.ang) * verso, uy = -Math.sin(p.ang) * verso;
          const nx = -Math.sin(p.ang), ny = -Math.cos(p.ang);   /* un po' sopra il binario */
          const x1 = cx + nx * 26 * sc, y1 = cy + ny * 26 * sc, x2 = x1 + ux * L, y2 = y1 + uy * L;
          freccia(gCarro, x1, y1, x2, y2, 'var(--s1)', 2.8);
          gCarro.appendChild(el('text', { x: morsa(x2 + (ux >= 0 ? 6 : -6), 30, S.w - 30), y: Math.max(S.banda + 12, y2 - 6), 'text-anchor': ux >= 0 ? 'start' : 'end', fill: 'var(--s1)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, num(v, 1) + '\u00a0m/s'));
        }
      }
      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 3) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }

      /* le barre dell'energia (verdi, come nella teoria): potenziale, cinetica, interna; la somma è sempre l'energia di partenza */
      function etichetta(g, x, y, base, pedice, attr) {
        const t = el('text', Object.assign({ x, y, fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, attr || {}));
        t.appendChild(document.createTextNode(base));
        if (pedice) t.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, pedice));
        g.appendChild(t); return t;
      }
      function disegnaBarre(y, v, tempo, rapido) {
        vuota(gBarre);
        const Et = E0(), Ep = m * G * y, Ec = m * v * v / 2, Ei = Math.max(0, Et - Ep - Ec);
        const riga = Math.min(24, (S.banda - 8) / 3), x0 = 8, xb = 62, Wb = Math.max(60, Math.min(S.w * 0.4, 260)), alto = Math.min(14, riga - 6);
        const voci = [['E', 'p', Ep, .85, true], ['E', 'c', Ec, .45, true], ['interna', '', Ei, 1, false]];
        voci.forEach((vc, i) => {
          const yr = 6 + i * riga, lw = Et > 0 ? Math.max(0, Math.min(1, vc[2] / Et)) * Wb : 0;
          etichetta(gBarre, x0, yr + alto - 2, vc[0], vc[1], vc[0] === 'interna' ? { style: 'font: 600 12px var(--font)' } : null);
          gBarre.appendChild(el('rect', { x: xb, y: yr, width: Wb, height: alto, rx: 3, fill: 'none', stroke: 'var(--bordo)', 'stroke-width': 1 }));
          if (lw > 0.5) gBarre.appendChild(el('rect', { x: xb, y: yr, width: lw, height: alto, rx: 3, fill: vc[4] ? 'var(--s3)' : 'none', 'fill-opacity': vc[3], stroke: 'var(--s3)', 'stroke-width': vc[4] ? 0 : 1.6 }));
          gBarre.appendChild(el('text', { x: xb + Wb + 6, y: yr + alto - 2, fill: 'var(--s3)', style: 'font: 600 12px var(--font)' }, num(vc[2] / 1000, 1) + '\u00a0kJ'));
        });
        /* a destra: i dati del carrello */
        const info = ['m = ' + m + '\u00a0kg', Fd ? 'attrito ' + Fd + '\u00a0N' : 'senza attrito'];
        if (v0) info.push('v₀ = ' + numV(v0) + '\u00a0m/s');
        if (tempo != null) info.push('t = ' + num(tempo, 1) + '\u00a0s' + (rapido > 1.05 ? ' (×' + num(rapido, 1) + ')' : ''));
        else if (!libero) info.push('corse: ' + corse);
        info.forEach((t, i) => gBarre.appendChild(el('text', { x: S.w - 8, y: 6 + i * Math.min(17, (S.banda - 4) / info.length) + 11, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)' }, t)));
      }
      function statico() {   /* carrello e barre fermi: alla partenza, o dove è finita l'ultima corsa */
        if (ultimo && ultimo.chiave === chiave()) {
          const r = ultimo.r, n = r.S.length - 1, p = punto(geom(), r.S[n]);
          disegnaCarro(r.S[n], 0, 1); disegnaBarre(p.y, r.V[n]);
        } else { disegnaCarro(0, v0, 1); disegnaBarre(punti[0].y, v0); }
      }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaPista(); disegnaPunti(); disegnaEsito(); statico(); }
      function ridisegnaPista() { disegnaPista(); disegnaPunti(); disegnaEsito(); statico(); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const p = punti[scelto];
        box.h.querySelector('.nome').innerHTML = p ? ctx.tex(p.nome || 'h') : '';
        const u = t => '<span class="unita"> ' + t + '</span>';
        box.h.querySelector('output').innerHTML = p ? numV(p.y) + u('m') : '';
        box.v0.querySelector('output').innerHTML = numV(v0) + u('m/s');
        box.fd.querySelector('output').innerHTML = Fd + u('N');
        box.m.querySelector('output').innerHTML = m + u('kg');
        box.v0.hidden = box.fd.hidden = box.m.hidden = !libero;
        parametriEl.classList.toggle('uno', !libero);
        const lim = LIMITI(), val = { h: p ? p.y : 0, v0, fd: Fd, m };
        ['h', 'v0', 'fd', 'm'].forEach(k => box[k].querySelectorAll('button').forEach(bt => {
          const d = +bt.dataset.d; bt.disabled = animando || finito || (d < 0 ? val[k] <= lim[k][0] : val[k] >= lim[k][1]);
        }));
      }
      const LIMITI = () => ({ h: [0, H_MAX, PASSO], v0: [0, 15, 0.5], fd: [0, 600, 25], m: [100, 1000, 50] });

      /* il ponte con la teoria: il bilancio dell'energia nel punto scelto, con i numeri; il risultato solo dopo la corsa */
      function aggiornaFormula() {
        const k = fPunto, p = punti[k];
        if (!p) { formulaEl.innerHTML = ''; return; }
        const h0 = punti[0].y, C = geom(), ell = lunghezza(C, k);
        const fatto = libero || (ultimo && ultimo.chiave === chiave());
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = (s, male) => fatto ? '<span class="pezzo esito' + (male ? ' no' : '') + '">' + s + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        let tipo = L.formula === 'libero' || L.formula === 'cima' ? (Fd ? 'attrito' : 'cima') : L.formula;
        const pezzi = [];
        const pedici = n => n.replace(/_(\d)/g, (_, c) => '₀₁₂₃₄₅₆₇₈₉'.charAt(+c));   /* h_3 → h₃ (in KaTeX il pedice qui sarebbe troppo piccolo) */
        const dove = NOMI_PUNTO[p.tipo] + (punti.filter(z => z.tipo === p.tipo).length > 1 && p.nome ? ' ' + pedici(p.nome) : '');
        let arriva = null;   /* il carrello è passato davvero di lì? (la formula dice solo che cosa succederebbe) */
        if (fatto && ultimo && ultimo.chiave === chiave()) arriva = k === punti.length - 1 ? ultimo.r.arriva : ultimo.r.vPunti[k] != null;
        if (tipo === 'cima') {
          const R = v0 * v0 + 2 * G * (h0 - p.y);
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(v0 ? 'v = \\sqrt{v_0^2 + 2 \\cdot g \\cdot (h_0 - h)}' : 'v = \\sqrt{2 \\cdot g \\cdot (h_0 - h)}') + '</span>');
          pezzi.push(numerico('v = \\sqrt{' + (v0 ? texV(v0) + '^2 + ' : '') + '2 \\cdot 9{,}8 \\cdot (' + texV(h0) + ' - ' + texV(p.y) + ')}\\,\\text{m/s}'));
          if (R >= 0) pezzi.push(ris(ctx.tex('\\approx ' + texNum(Math.sqrt(R), 1) + '\\,\\text{m/s}') + (arriva === false ? ' <span class="dove">(se ci arrivasse)</span>' : '')));
          else pezzi.push(ris('radice di un numero negativo: lì non arriva', true));
        } else {
          const Ec = m * v0 * v0 / 2 + m * G * (h0 - p.y) - Fd * ell;
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('E_c = ' + (v0 ? '\\tfrac{1}{2} \\cdot m \\cdot v_0^2 + ' : '') + 'm \\cdot g \\cdot (h_0 - h) - F_d \\cdot \\ell') + '</span>');
          pezzi.push(numerico('E_c = ' + (v0 ? '\\tfrac{1}{2} \\cdot ' + m + ' \\cdot ' + texV(v0) + '^2 + ' : '') + m + ' \\cdot 9{,}8 \\cdot (' + texV(h0) + ' - ' + texV(p.y) + ')' + (Fd ? '' : '\\,\\text{J}')));
          if (Fd) pezzi.push('<span class="pezzo">' + ctx.tex('-\\,' + Fd + ' \\cdot ' + texNum(ell, 1) + '\\,\\text{J}') + '</span>');   /* a parte: sul telefono va a capo qui */
          if (Ec >= 0) pezzi.push(ris(ctx.tex('\\approx ' + texJ(Ec) + '\\,\\text{J}') + (arriva === false ? ' <span class="dove">(se ci arrivasse)</span>' : '')));
          else pezzi.push(ris(ctx.tex('< 0') + ': lì non arriva', true));
        }
        pezzi.push('<span class="pezzo dove">' + dove + (tipo === 'attrito' ? ', ' + ctx.tex('\\ell \\approx ' + texNum(ell, 1) + '\\,\\text{m}') : '') + '</span>');
        formulaEl.innerHTML = pezzi.join('');
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = animando || (k > sblocco && k !== livello);
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
        b.libero.disabled = animando;
      }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); }

      /* ---------------- livelli ---------------- */
      function primoLibero() { const k = punti.findIndex(p => p.libero); return k < 0 ? 0 : k; }
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false; inCorsa = null;
        libero = false; salvato = null; mostraLibero();
        livello = n; L = LIVELLI[n]; punti = copiaPunti(L);
        m = L.m; Fd = L.Fd; v0 = L.v0; fase = 0; vintoFase0 = null;
        sg = soglie(L);
        corse = 0; finito = false; ultimo = null; detti = {}; prima = null;
        scelto = primoLibero(); fPunto = L.fPunto != null ? L.fPunto : scelto;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + CONSEGNE[n](fase) + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }

      /* ---------------- la corsa ---------------- */
      function via() {
        if (animando || finito) return;
        const r = simula(pista(), { v0, mu: muDi(Fd, m) }, geom());
        aiutoEl.hidden = true;
        if (r.nonParte) {
          msg.textContent = Fd && punti[1].y < punti[0].y ? 'Il carrello non parte: la discesa è troppo dolce e l\'attrito lo tiene fermo.' : 'Il carrello non parte: davanti a lui la pista sale.';
          msg.className = 'lab-messaggio'; return;
        }
        if (!libero) corse++;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.via.disabled = true; b.ric.disabled = true; b.casuale.disabled = true;
        vuota(gEsito); aggiornaParametri(); aggiornaLivelli();
        const T = r.T, tTot = T[T.length - 1], tA = r.arriva ? tTot : (r.tPrimo || tTot), t0 = performance.now();
        const f1 = Math.max(1, tA / 6), f2 = Math.max(f1, (tTot - tA) / 4);   /* tempo vero fino al primo arresto (più in fretta oltre 6 s); le oscillazioni in 4 s al massimo */
        let k = 0;
        const passo = ora => {
          const tr = (ora - t0) / 1000, t = Math.min(tTot, tr * f1 <= tA ? tr * f1 : tA + (tr - tA / f1) * f2);
          while (k < T.length - 2 && T[k + 1] < t) k++;
          const f = T[k + 1] > T[k] ? (t - T[k]) / (T[k + 1] - T[k]) : 1;
          const sv = r.S[k] + (r.S[k + 1] - r.S[k]) * f, v = r.V[k] + (r.V[k + 1] - r.V[k]) * f, verso = r.S[k + 1] >= r.S[k] ? 1 : -1;
          const p = punto(r.C, sv);
          disegnaCarro(sv, v, verso);
          disegnaBarre(p.y, v, t, t > tA ? f2 : f1);
          if (t < tTot) { raf = requestAnimationFrame(passo); return; }
          raf = 0; fine(r);
        };
        raf = requestAnimationFrame(passo);
      }

      function fine(r) {
        animando = false; b.via.disabled = false; b.ric.disabled = false; b.casuale.disabled = false;
        const prec = ultimo;
        ultimo = { chiave: chiave(), r, punti: copiaPunti({ punti }) };
        disegnaPunti(); disegnaEsito(); statico(); aggiorna(); aggiornaLivelli();
        if (libero) { msg.textContent = osserva(r); msg.className = 'lab-messaggio'; return; }
        const v = verdetto(L, punti, r, sg, m);
        if (v.ok && L.masse && fase === 0) {   /* livello 3: prima vuoto, poi pieno */
          fase = 1; vintoFase0 = punti[0].y; m = L.masse[1];
          consegnaEl.innerHTML = '<span>' + CONSEGNE[livello](fase) + '</span>';
          msg.textContent = v.testo + ' Ora il carrello è pieno: 800\u00a0kg.'; msg.className = 'lab-messaggio ok';
          ultimo = null; ctx.mascotte('giusto'); disegnaEsito(); statico(); aggiorna();
          return;
        }
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(r, v, prec);
        prima = { y: punti.map(p => p.y), r, v };
      }

      function vinci(testo) {
        finito = true; b.via.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (corse === 1 ? ' Alla prima corsa.' : ' Corse: ' + corse + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaParametri();
        ctx.zenone(VITTORIE[livello](punti), { html: true, espressione: corse <= (L.masse ? 2 : 1) ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(c, testo) {
        if (detti[c]) return; detti[c] = true;
        ctx.zenone(testo, { html: true, tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(r, v) {
        const h0 = punti[0].y, lib = punti.map((p, k) => p.libero ? k : -1).filter(k => k >= 0);
        if (livello === 0 && !r.arriva) {
          const h = punti[lib[0]].y;
          if (h === h0) dici('pari', 'A 20\u00a0m in cima tutta l\'energia sarebbe di nuovo potenziale: avrebbe v = 0, e da lì non va avanti.');
          else if (h > h0) dici('sopra', 'Più in alto della partenza non sale: in cima gli servirebbe più energia di quella che ha.');
          return;
        }
        if (livello === 1 && r.arriva && prima && prima.r.arriva) {   /* «velocità doppia, dislivello doppio» */
          const d1 = h0 - prima.y[2], v1 = prima.r.vPunti[2], d2 = h0 - punti[2].y;
          if (d1 > 0.4 && v1 > 0.5 && Math.abs(d2 - d1 * 10 / v1) <= Math.max(0.5, 0.06 * d1 * 10 / v1)) dici('lineare', 'La velocità va con la radice del dislivello: per metà velocità basta un quarto del dislivello.');
          return;
        }
        if (livello === 2 && fase === 1 && vintoFase0 != null && punti[0].y !== vintoFase0) {
          dici('massa', 'Pieno ha quattro volte l\'energia, ma anche quattro volte la massa da muovere: la massa si semplifica.');
          return;
        }
        if (livello === 3 && v.basso && punti[lib[0]].y <= h0) { dici('molla', 'Parte già a 12\u00a0m/s: con quell\'energia cinetica può salire sopra i 4\u00a0m della partenza.'); return; }
        if (livello === 4 && !r.arriva && punti[lib[0]].y >= 18.5) { dici('attrito', 'Senza attrito bastava restare sotto i 20\u00a0m; ora l\'attrito si prende F<sub>d</sub>·ℓ, e l\'energia meccanica cala.'); return; }
        if (livello === 5 && !r.arriva && h0 <= 6 + 25 / (2 * G) + 0.5) {
          dici('dislivello', 'Hai contato il dislivello ma non l\'attrito: lungo ' + num(lunghezza(geom(), 4), 0) + '\u00a0m di binario si prende F<sub>d</sub>·ℓ.'); return;
        }
        if (livello === 6 && !r.arriva) {
          const k = punti.findIndex((p, j) => j > 0 && r.C.idx[j] > r.iStop);
          const prec = lib.filter(j => j < k).pop();
          if (k > 0 && prec != null && punti[k].tipo === 'dosso' && punti[k].y >= punti[prec].y) dici('uguali', 'Ogni metro di binario costa energia: ogni dosso deve essere più basso di quello prima.');
          return;
        }
        if (livello === 7 && !r.arriva && r.vPunti[2] != null) dici('lontano', 'Il dosso da 12\u00a0m l\'ha passato: lo ferma il secondo, più basso ma più lontano.');
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva(r) {
        if (r.arriva) {
          let t = 'In stazione a ' + num(r.vSt, 1) + '\u00a0m/s, dopo ' + num(r.tSt, 1) + '\u00a0s.';
          if (Fd) t += ' L\'attrito ha preso ' + num(Fd * lunghezza(r.C, punti.length - 1) / 1000, 1) + '\u00a0kJ.';
          return t;
        }
        let t = 'Si ferma a ' + num(r.yStop, 1) + '\u00a0m di quota.';
        if (!Fd && !v0) t += ' Senza attrito risale fino all\'altezza della partenza.';
        else if (!Fd) t += ' Senza attrito arriva fino a h₀ + v₀²/(2·g).';
        return t;
      }
      function mostraLibero() { b.casuale.hidden = !libero; radice.classList.toggle('in-libero', libero); }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, L, punti, m, Fd, v0, fase, vintoFase0, sg, corse, finito, ultimo, scelto, fPunto, detti, prima, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        L = LIBERO; punti = copiaPunti(L); m = L.m; Fd = L.Fd; v0 = L.v0; ultimo = null; finito = false;
        scelto = 2; fPunto = punti.length - 1;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; L = z.L; punti = z.punti; m = z.m; Fd = z.Fd; v0 = z.v0; fase = z.fase; vintoFase0 = z.vintoFase0; sg = z.sg;
        corse = z.corse; finito = z.finito; ultimo = z.ultimo; scelto = z.scelto; fPunto = z.fPunto; detti = z.detti; prima = z.prima;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.via.disabled = finito;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi) => lo + Math.round(Math.random() * (hi - lo) / PASSO) * PASSO;
        punti.forEach(p => {
          p.y = p.tipo === 'partenza' ? r(12, 24) : p.tipo === 'valle' ? r(0, 4) : p.tipo === 'dosso' ? r(4, 20) : r(0, 5);
        });
        v0 = Math.random() < 0.7 ? 0 : r(3, 10);
        Fd = [0, 0, 100, 150, 250][Math.floor(Math.random() * 5)];
        m = 200 + 50 * Math.floor(Math.random() * 13);
        msg.textContent = ''; ultimo = null; ridisegnaPista(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function tocco() {   /* dopo ogni modifica: si cancella l'esito vecchio */
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        ridisegnaPista(); aggiorna();
      }
      function cambia(k, d) {
        if (animando || finito) return false;
        const lim = LIMITI()[k];
        if (k === 'h') {
          const p = punti[scelto]; if (!p || !p.libero) return false;
          const nuovo = morsa(Math.round((p.y + d * lim[2]) * 10) / 10, lim[0], lim[1]);
          if (nuovo === p.y) return false;
          p.y = nuovo;
        } else {
          const vecchio = k === 'v0' ? v0 : k === 'fd' ? Fd : m;
          const nuovo = morsa(Math.round((vecchio + d * lim[2]) * 10) / 10, lim[0], lim[1]);
          if (nuovo === vecchio) return false;
          if (k === 'v0') v0 = nuovo; else if (k === 'fd') Fd = nuovo; else m = nuovo;
        }
        tocco(); return true;
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* disegnare col dito: il punto della pista nella cui striscia verticale sta il dito prende la quota del dito */
      let disegna = false;
      function inMetri(ev) {
        const mt = svg.getScreenCTM(); if (!mt) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(mt.inverse());
        return { px: c.x, py: c.y, x: (c.x - S.ox) / S.U, y: (S.oy - c.y) / S.Uy };
      }
      function zona(x) {   /* l'indice del punto più vicino in orizzontale (il piano della molla non conta) */
        let best = -1, d = 1e9;
        punti.forEach((p, k) => { if (p.tipo === 'piano') return; const dd = Math.abs(p.x - x); if (dd < d) { d = dd; best = k; } });
        return best;
      }
      function prendi(k, c, subito) {
        const p = punti[k];
        if (k > 0) fPunto = k;
        if (!p.libero) { disegnaPunti(); aggiornaFormula(); return; }
        scelto = k;
        const vicino = Math.hypot(c.px - PX(p.x), c.py - PY(p.y)) < 24;
        if (subito && vicino) { disegnaPunti(); aggiorna(); return; }   /* un tocco sulla maniglia la sceglie e basta */
        const y = morsa(Math.round(c.y / PASSO) * PASSO, 0, H_MAX);
        if (y !== p.y) { p.y = y; tocco(); } else { disegnaPunti(); aggiorna(); }
      }
      function giu(p, ev) {   /* p: l'evento, o il tocco (Safari 12 non ha i pointer events) */
        if (animando || finito) return;
        const c = inMetri(p); if (!c) return;
        disegna = true; aiutoEl.hidden = true;
        if (ev.pointerId != null) { try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ } }
        const k = zona(c.x); if (k >= 0) prendi(k, c, true);
        ev.preventDefault();
      }
      function trascinaDito(p, ev) {
        if (!disegna) return;
        const c = inMetri(p); if (!c) return;
        const k = zona(c.x); if (k >= 0) prendi(k, c, false);
        ev.preventDefault();
      }
      svg.addEventListener('pointerdown', ev => giu(ev, ev));
      const muovi = ev => trascinaDito(ev, ev);
      const molla = () => { disegna = false; };
      if (!window.PointerEvent) {
        svg.addEventListener('touchstart', ev => { if (ev.touches.length) giu(ev.touches[0], ev); }, { passive: false });
        svg.addEventListener('touchmove', ev => { if (ev.touches.length) trascinaDito(ev.touches[0], ev); }, { passive: false });
        svg.addEventListener('touchend', molla);
      }
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', via);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { punti = copiaPunti(LIBERO); v0 = LIBERO.v0; Fd = LIBERO.Fd; m = LIBERO.m; ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').innerHTML = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');   /* innerHTML: i pedici veri con <sub> */
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      LIVELLI.forEach((_, k) => {
        const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'lab-pallino';
        pl.setAttribute('aria-label', 'Livello ' + (k + 1)); pl.innerHTML = '<span>' + (k + 1) + '</span>';
        pl.addEventListener('click', () => { if (!animando) avviaLivello(k); });
        livelliEl.insertBefore(pl, b.libero);
      });

      radice.mrPunti = () => punti; radice.mrS = () => S;   /* per il banco di prova */
      avviaLivello(livello);
      let forma = '';
      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg].filter(Boolean);
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      const ro = new ResizeObserver(() => {
        fissi.forEach(stringi);
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; if (!animando) ridisegnaTutto(); else { geometria(); disegnaFondo(); disegnaPista(); disegnaPunti(); }
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); fermaRipeti(); ro.disconnect(); mo.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
