/* Laboratorio «Il laser» — riflessione, rifrazione e riflessione totale (argomento ottica, secondo anno).
   Un tavolo ottico visto dall'alto in sezione: un laser, specchi da ruotare, una lastra di vetro, una vasca d'acqua,
   una fibra. Il raggio segue le leggi vere: riflessione con r = i; rifrazione con la legge di Snell; riflessione
   totale quando il raggio rifratto non esiste. Il calcolo interno usa i seni (n1·sin θ1 = n2·sin θ2), ma sullo
   schermo la legge si scrive come nella teoria, con il cerchio: n1·a1 = n2·a2, dove a1 e a2 sono le distanze dalla
   normale dei punti in cui i raggi tagliano un cerchio di raggio ℓ = 10 cm (a = ℓ·sin θ: è la stessa legge).
   Nei livelli il laser si accende con «Accendi»: niente anteprima del raggio, restano solo le tracce dei tentativi.
   In modalità libera il laser è sempre acceso. Colori come nella teoria: raggi arancio (2), specchi azzurri (1),
   distanze a1 e a2 verdi (3). Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md).
   Le lenti non sono qui: stanno nel laboratorio «banco-ottico». */
(function () {
  const STILE = `
    .lab-laser .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; cursor: crosshair; }
    .lab-laser .lab-scena > svg { width: 100%; height: 100%; }
    .lab-laser svg text { font-family: var(--font); }
    .lab-laser .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-laser .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-laser .consegna:empty { display: none; }
    .lab-laser .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .45em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.4em; }
    .lab-laser .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-laser .formula .ignoto { color: var(--testo3); }
    .lab-laser .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-laser .formula .nota { font-size: .85em; color: var(--testo2); }
    .lab-laser .formula .simbolo { margin-right: .7em; }
    .lab-laser .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-laser .formula .simbolo { display: none; } .lab-laser .formula .nome-stretto { display: inline; } .lab-laser .formula { font-size: 1rem; } }
    .lab-laser .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-laser .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-laser .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-laser .lab-barra { gap: 5px; } .lab-laser .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-laser .lab-barra .btn[hidden] { display: none; }
    .lab-laser .btn[disabled] { opacity: .38; cursor: default; }
    .lab-laser .lab-parametri { max-width: 520px; }
    .lab-laser .lab-param[hidden] { display: none; }
    .lab-laser .lab-param .nome { min-width: 1.3em; }
    .lab-laser .lab-param output { min-width: 2.8em; white-space: nowrap; }
    .lab-laser .lab-param output.parola { font-size: .88rem; min-width: 5.6em; }
    .lab-laser .lab-param[data-p="forma"] .nome { display: none; }
    .lab-laser .lab-param.solo { grid-column: 1 / -1; }
    @container lab (max-width: 460px) { .lab-laser .lab-param { gap: 2px; } .lab-laser .lab-param .btn { min-width: 36px; padding: 0 4px; } .lab-laser .lab-parametri { gap: 6px 4px; } .lab-laser .lab-param output.parola { min-width: 0; font-size: .76rem; } .lab-laser .lab-param output { min-width: 2.4em; } }
    .lab-laser .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-laser .vinto { display: inline-block; animation: lab-laser-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-laser-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ----------------
     Coordinate in centimetri, x verso destra e y verso l'alto. Gli angoli dei comandi sono in gradi interi. */
  const RAD = Math.PI / 180, ELLE = 10;          /* ℓ: il raggio del cerchio della legge di Snell, 10 cm come nella teoria */
  const ACQUA = 1.33, VETRO = 1.5, DIAMANTE = 2.42;
  const MATERIALI = [{ n: ACQUA, nome: 'acqua' }, { n: VETRO, nome: 'vetro' }, { n: DIAMANTE, nome: 'diamante' }];
  const FORME = ['lastra', 'prisma', 'semicerchio'];

  const somma = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const meno = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const per = (a, k) => [a[0] * k, a[1] * k];
  const sc = (a, b) => a[0] * b[0] + a[1] * b[1];
  const vers = g => [Math.cos(g * RAD), Math.sin(g * RAD)];
  const ruota = (p, c, g) => { const s = Math.sin(g * RAD), k = Math.cos(g * RAD), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * k - y * s, c[1] + x * s + y * k]; };

  /* la fibra: una striscia larga w, dritta e poi piegata di «piega» gradi (poligono con gli spigoli in squadra) */
  function striscia(p0, lung1, piega, lung2, w) {
    const h = w / 2, u2 = vers(piega), n2 = [-u2[1], u2[0]];
    const p1 = [p0[0] + lung1, p0[1]], p2 = somma(p1, per(u2, lung2));
    const giunto = s => {   /* incrocio della parete dritta (y = p0y + s·h) con quella piegata */
      const a = somma(p1, per(n2, s * h));   /* un punto della parete piegata */
      const t = (p0[1] + s * h - a[1]) / u2[1];
      return somma(a, per(u2, t));
    };
    return { pti: [[p0[0], p0[1] + h], giunto(1), somma(p2, per(n2, h)), somma(p2, per(n2, -h)), giunto(-1), [p0[0], p0[1] - h]], fine: p2, u2 };
  }

  /* forme del blocco libero, in coordinate locali (centro in 0, 0) */
  function formaLibera(f) {
    if (f === 'prisma') return { pti: [[-12, -10], [12, -10], [-12, 14]] };
    if (f === 'semicerchio') return { semi: { R: 14 } };
    return { pti: [[-8, -16], [8, -16], [8, 16], [-8, 16]] };
  }

  /* ---------------- livelli ----------------
     laser: posizione e direzione (gradi da +x, in senso antiorario); comandi: che cosa si ruota.
     laser.rif dice da dove si misura l'angolo del comando: 'giu' (dalla verticale, verso il basso), 'su' (dalla
     verticale, verso l'alto), 'oriz' (dall'orizzontale). Le soluzioni le conta la prova dei livelli (lab-laser-livelli.js). */
  const LIVELLI = [
    { consegna: 'Ruota lo specchio <b>A</b> per mandare il raggio sul sensore.',
      vista: [80, 60], laser: { x: 9, y: 16, dir: 0 }, specchi: [{ x: 50, y: 16, L: 12 }], bersaglio: { x: 50, y: 52, r: 2.5 },
      comandi: [{ k: 's0', inizio: 20 }], formula: 'riflessione' },
    { consegna: 'Il sensore è in alto a sinistra. Ruota lo specchio <b>A</b>.',
      vista: [80, 60], laser: { x: 9, y: 12, dir: 0 }, specchi: [{ x: 62, y: 12, L: 12 }], bersaglio: { x: 42, y: 46.6, r: 2.5 },
      comandi: [{ k: 's0', inizio: 30 }], formula: 'riflessione' },
    { consegna: 'Il muro copre il sensore: usa i due specchi <b>A</b> e <b>B</b>.',
      vista: [100, 64], laser: { x: 9, y: 10, dir: 0 }, specchi: [{ x: 30, y: 10, L: 12 }, { x: 60, y: 52, L: 14 }],
      muri: [{ x0: 73, x1: 77, y0: 0, y1: 28 }], bersaglio: { x: 92, y: 20, r: 2.5 },
      comandi: [{ k: 's0', inizio: 45 }, { k: 's1', inizio: 150 }], formula: 'riflessione' },
    { consegna: 'Punta il laser sul sensore in fondo alla vasca.',
      vista: [100, 64], laser: { x: 8, y: 58, rif: 'giu' }, blocchi: [{ n: ACQUA, pti: [[30, 0], [96, 0], [96, 30], [30, 30]], nome: 'acqua' }],
      muri: [{ x0: 28.6, x1: 30, y0: 0, y1: 33, nome: 'la parete della vasca' }, { x0: 96, x1: 97.4, y0: 0, y1: 33, nome: 'la parete della vasca' }],
      bersaglio: { x: 72, y: 2.4, r: 2.4 }, comandi: [{ k: 'laser', inizio: 45, min: 0, max: 80 }], formula: 'snell' },
    { consegna: 'Il raggio passa sopra il sensore. Inclina la lastra di vetro, senza toccare il laser.',
      vista: [100, 64], laser: { x: 9, y: 34, dir: 0 }, blocchi: [{ n: VETRO, centro: [42, 34], loc: [[-10, -22], [10, -22], [10, 22], [-10, 22]], nome: 'vetro' }],
      bersaglio: { x: 90, y: 26, r: 1.2 }, comandi: [{ k: 'blocco', inizio: 0, min: -65, max: 65 }], formula: 'snell' },
    { consegna: 'Il laser è sott\'acqua: accendi il sensore lontano, appena sopra l\'acqua.',
      vista: [100, 64], laser: { x: 8, y: 6, rif: 'su' }, blocchi: [{ n: ACQUA, pti: [[0, 0], [100, 0], [100, 30], [0, 30]], nome: 'acqua' }],
      bersaglio: { x: 93, y: 41, r: 3.2 }, comandi: [{ k: 'laser', inizio: 30, min: 0, max: 85 }], formula: 'snell' },
    { consegna: 'Lo scoglio copre il sensore. Arrivaci senza specchi, restando sott\'acqua.',
      vista: [100, 64], laser: { x: 8, y: 8, rif: 'su' }, blocchi: [{ n: ACQUA, pti: [[0, 0], [100, 0], [100, 30], [0, 30]], nome: 'acqua' }],
      muri: [{ x0: 44, x1: 52, y0: 0, y1: 22, nome: 'lo scoglio' }], bersaglio: { x: 90, y: 6, r: 2.5 },
      comandi: [{ k: 'laser', inizio: 35, min: 0, max: 85 }], formula: 'snell' },
    { consegna: 'Porta la luce fino in fondo alla fibra di vetro, anche dove si piega.',
      vista: [100, 64], laser: { x: 8, y: 20, rif: 'oriz' }, fibra: { p0: [19, 20], lung1: 34, piega: 50, lung2: 40, w: 8 },
      comandi: [{ k: 'laser', inizio: 0, min: -30, max: 30 }], formula: 'fibra' }
  ];
  /* la fibra: il poligono e il sensore che chiude l'altro capo */
  LIVELLI.forEach(L => {
    if (!L.fibra) return;
    const f = L.fibra, s = striscia(f.p0, f.lung1, f.piega, f.lung2, f.w);
    L.blocchi = [{ n: VETRO, pti: s.pti, nome: 'vetro', fibra: true }];
    const c = somma(s.fine, per(s.u2, 3));   /* il sensore copre il capo della fibra: la luce che arriva in fondo lo accende */
    L.bersaglio = { x: c[0], y: c[1], r: 5 };
    /* lo schermo davanti al laser: la luce entra solo dalla faccia della fibra */
    L.muri = [{ x0: f.p0[0] - 1.4, x1: f.p0[0], y0: 0, y1: f.p0[1] - f.w / 2, nome: 'lo schermo' }, { x0: f.p0[0] - 1.4, x1: f.p0[0], y0: f.p0[1] + f.w / 2, y1: 1000, nome: 'lo schermo' }];
  });
  const LIBERO = { vista: [100, 64], laser: { x: 9, y: 40, rif: 'oriz' }, specchi: [{ x: 84, y: 18, L: 14 }], formula: 'libero' };

  /* la scena del livello con i comandi scelti: laser (punto e direzione), specchi, blocchi, muri, sensore */
  function componi(L, p) {
    const S = { laser: null, specchi: [], blocchi: [], muri: L.muri || [], bersaglio: L.bersaglio || null, vista: L.vista };
    const lz = L.laser, y = p.ly != null ? p.ly : lz.y;
    let dir = lz.dir || 0;
    if (lz.rif === 'giu') dir = -90 + p.laser; else if (lz.rif === 'su') dir = 90 - p.laser; else if (lz.rif === 'oriz') dir = p.laser;
    S.laser = { o: [lz.x, y], dir };
    (L.specchi || []).forEach((s, i) => {
      const g = p['s' + i] != null ? p['s' + i] : (s.ang || 0), u = per(vers(g), s.L / 2), c = [s.x, s.y];
      S.specchi.push({ c, a: meno(c, u), b: somma(c, u), ang: g, L: s.L, nome: 'AB'[i] });
    });
    (L.blocchi || []).forEach(b => {
      if (b.pti) { S.blocchi.push({ n: b.n, pti: b.pti, nome: b.nome, fibra: b.fibra }); return; }
      const g = p.blocco || 0;
      S.blocchi.push({ n: b.n, pti: b.loc.map(q => ruota(somma(q, b.centro), b.centro, g)), nome: b.nome, centro: b.centro });
    });
    if (L === LIBERO) {   /* il blocco libero: forma, materiale e rotazione li sceglie lo studente */
      const fm = formaLibera(FORME[p.forma]), c = [p.bx, p.by], mat = MATERIALI[p.mat];
      if (fm.pti) S.blocchi.push({ n: mat.n, nome: mat.nome, centro: c, pti: fm.pti.map(q => ruota(somma(q, c), c, p.blocco)) });
      else S.blocchi.push({ n: mat.n, nome: mat.nome, centro: c, semi: { c, R: fm.semi.R, g: p.blocco } });
    }
    return S;
  }

  /* i bordi su cui il raggio può finire: { tipo, a, b } segmenti; { tipo: 'arco', c, R, g } mezzo cerchio; il sensore è un cerchio */
  function bordi(S) {
    /* la cornice per prima: dove un bordo coincide con la cornice (il fondo della vasca), vince la cornice e la luce si ferma */
    const W = S.vista[0], H = S.vista[1], cornice = [[0, 0], [W, 0], [W, H], [0, H]], B = [];
    cornice.forEach((q, j) => B.push({ tipo: 'bordo', a: q, b: cornice[(j + 1) % 4] }));
    S.specchi.forEach((s, i) => B.push({ tipo: 'specchio', a: s.a, b: s.b, i }));
    S.blocchi.forEach((bl, k) => {
      if (bl.pti) bl.pti.forEach((q, j) => B.push({ tipo: 'blocco', a: q, b: bl.pti[(j + 1) % bl.pti.length], k }));
      else {   /* semicerchio: il diametro e l'arco (dalla parte di +y locale) */
        const s = bl.semi, u = vers(s.g);
        B.push({ tipo: 'blocco', a: meno(s.c, per(u, s.R)), b: somma(s.c, per(u, s.R)), k });
        B.push({ tipo: 'arco', c: s.c, R: s.R, g: s.g, k });
      }
    });
    S.muri.forEach(m => { const v = [[m.x0, m.y0], [m.x1, m.y0], [m.x1, m.y1], [m.x0, m.y1]]; v.forEach((q, j) => B.push({ tipo: 'muro', a: q, b: v[(j + 1) % 4], nome: m.nome })); });
    return B;
  }
  /* dentro un blocco? (per sapere in che mezzo parte il raggio) */
  function dentro(bl, q) {
    if (bl.semi) {
      const s = bl.semi, d = meno(q, s.c), u = vers(s.g + 90);
      return Math.hypot(d[0], d[1]) < s.R && sc(d, u) > 0;
    }
    let ok = false; const P = bl.pti;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      if ((P[i][1] > q[1]) !== (P[j][1] > q[1]) && q[0] < (P[j][0] - P[i][0]) * (q[1] - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) ok = !ok;
    }
    return ok;
  }

  const EPS = 1e-7;
  /* il primo incontro del raggio o + t·d (t > EPS) con un bordo: { t, bordo, nrm } (nrm: normale del bordo, non orientata) */
  function incontro(B, S, o, d) {
    let best = null;
    const prendi = (t, bordo, nrm) => { if (t > EPS && (!best || t < best.t - 1e-9)) best = { t, bordo, nrm }; };
    B.forEach(b => {
      if (b.tipo === 'arco') {
        const f = meno(o, b.c), bb = sc(f, d), cc = sc(f, f) - b.R * b.R, disc = bb * bb - cc;
        if (disc < 0) return;
        const r = Math.sqrt(disc), u = vers(b.g + 90);
        [-bb - r, -bb + r].forEach(t => {
          if (t <= EPS) return;
          const q = somma(o, per(d, t)), rr = meno(q, b.c);
          if (sc(rr, u) >= -1e-9) prendi(t, b, per(rr, 1 / b.R));
        });
        return;
      }
      const e = meno(b.b, b.a), den = d[0] * e[1] - d[1] * e[0];
      if (Math.abs(den) < 1e-12) return;
      const w = meno(b.a, o), t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den;
      if (s < -1e-9 || s > 1 + 1e-9) return;
      const le = Math.hypot(e[0], e[1]);
      prendi(t, b, [-e[1] / le, e[0] / le]);
    });
    if (S.bersaglio) {   /* il sensore: un cerchio che ferma il raggio */
      const T = S.bersaglio, f = meno(o, [T.x, T.y]), bb = sc(f, d), cc = sc(f, f) - T.r * T.r, disc = bb * bb - cc;
      if (disc >= 0) { const t = -bb - Math.sqrt(disc); if (t > EPS && (!best || t < best.t)) best = { t, bordo: { tipo: 'bersaglio' }, nrm: null }; }
    }
    return best;
  }

  /* il cammino del raggio: tratti (con l'indice del mezzo), eventi (riflessioni, rifrazioni, riflessioni totali),
     i piccoli riflessi parziali (solo da disegnare), e come finisce */
  function traccia(S) {
    const B = bordi(S);
    let o = S.laser.o.slice(), d = vers(S.laser.dir);
    let mezzo = -1;   /* -1 aria, altrimenti l'indice del blocco */
    S.blocchi.forEach((bl, k) => { if (dentro(bl, o)) mezzo = k; });
    const tratti = [], eventi = [], riflessi = [];
    const nDi = m => m < 0 ? 1 : S.blocchi[m].n;
    let fine = { tipo: 'troppi' };
    for (let passo = 0; passo < 60; passo++) {
      const h = incontro(B, S, o, d);
      if (!h) { fine = { tipo: 'perso' }; break; }
      const q = somma(o, per(d, h.t));
      tratti.push({ a: o, b: q, n: nDi(mezzo) });
      const tb = h.bordo.tipo;
      if (tb === 'bersaglio' || tb === 'muro' || tb === 'bordo') { fine = { tipo: tb, p: q, muro: h.bordo }; break; }
      let nrm = h.nrm; if (sc(nrm, d) > 0) nrm = per(nrm, -1);   /* la normale contro il raggio */
      const ci = Math.min(1, -sc(d, nrm)), si = Math.sqrt(Math.max(0, 1 - ci * ci));
      const riflesso = somma(d, per(nrm, 2 * ci));
      if (tb === 'specchio') {
        eventi.push({ tipo: 'riflesso', p: q, nrm, i: Math.acos(ci) / RAD, din: d, dout: riflesso, specchio: h.bordo.i });
        o = q; d = riflesso; continue;
      }
      /* bordo di un blocco: si entra o si esce */
      const k = h.bordo.k, verso = mezzo === k ? -1 : k, n1 = nDi(mezzo), n2 = nDi(verso), eta = n1 / n2;
      const kk = 1 - eta * eta * (1 - ci * ci);
      const ev = { p: q, nrm, i: Math.acos(ci) / RAD, n1, n2, a1: ELLE * si, din: d, blocco: k, entra: verso >= 0 };
      if (kk <= 1e-12) {   /* il rifratto non esiste: la luce torna tutta indietro */
        ev.tipo = 'totale'; ev.a2 = ELLE * eta * si; ev.dout = riflesso;
        eventi.push(ev); o = q; d = riflesso; continue;
      }
      const dr = somma(per(d, eta), per(nrm, eta * ci - Math.sqrt(kk)));
      const lr = Math.hypot(dr[0], dr[1]);
      ev.tipo = 'rifratto'; ev.dout = per(dr, 1 / lr); ev.r = Math.asin(Math.min(1, eta * si)) / RAD; ev.a2 = ELLE * eta * si;
      eventi.push(ev); riflessi.push({ p: q, d: riflesso });
      o = q; d = ev.dout; mezzo = verso;
    }
    return { tratti, eventi, riflessi, fine, S };
  }

  /* quanto il raggio passa lontano dal sensore (cm, dal bordo del sensore; 0 se lo prende) */
  function distanza(tr) {
    const T = tr.S.bersaglio; if (!T) return 0;
    if (tr.fine.tipo === 'bersaglio') return 0;
    let m = Infinity;
    tr.tratti.forEach(s => {
      const e = meno(s.b, s.a), l2 = sc(e, e), c = [T.x, T.y];
      const t = l2 ? Math.max(0, Math.min(1, sc(meno(c, s.a), e) / l2)) : 0, pr = somma(s.a, per(e, t));
      m = Math.min(m, Math.hypot(c[0] - pr[0], c[1] - pr[1]));
    });
    return Math.max(0, m - T.r);
  }

  /* il verdetto di un'accensione: { ok, testo } (il testo dice solo che cosa ha fatto la luce) */
  function verdetto(L, tr) {
    if (tr.fine.tipo === 'bersaglio') return { ok: true, testo: 'Sensore acceso.' };
    const tot = tr.eventi.filter(e => e.tipo === 'totale').length;
    const usciti = tr.eventi.filter(e => e.tipo === 'rifratto' && !e.entra).length;
    const dist = distanza(tr), quanto = ' Passa a ' + num(dist, 1) + '&nbsp;cm dal sensore.';
    let t;
    if (tr.fine.tipo === 'muro') t = 'Il raggio finisce contro ' + (tr.fine.muro.nome || 'il muro') + '.';
    else if (L.fibra && usciti) t = 'La luce è scappata dalla parete della fibra.';
    else if (L.formula === 'snell' && L.laser.rif === 'su' && usciti && !tot) t = 'La luce è uscita dall\'acqua.';
    else if (L.formula === 'snell' && L.laser.rif === 'su' && tot) t = 'Riflessione totale: la luce è rimasta nell\'acqua.';
    else if (tr.eventi.length === 0 && L.specchi) t = 'Il raggio non tocca lo specchio.';
    else t = 'Il raggio non arriva al sensore.';
    return { ok: false, testo: t + (isFinite(dist) ? quanto : '') };
  }

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  const texN = n => String(n).replace('.', '{,}');   /* gli indici sono numeri esatti: 1, 1,33, 1,5, 2,42 */

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    'Specchio a 45°: il raggio arriva a 45° dalla normale e riparte a 45° dall\'altra parte, r = i.',
    'Lo specchio a 60° fa girare il raggio di 120°: se lo specchio ruota di un angolo, il riflesso ruota del doppio.',
    'Due specchi, due volte r = i: così la luce gira intorno agli ostacoli.',
    'Entrando nell\'acqua il raggio si avvicina alla normale: per prendere il sensore bisogna mirare più lontano.',
    'La lastra non gira il raggio, lo sposta: entrando si avvicina alla normale, uscendo se ne allontana di altrettanto.',
    'Il raggio esce quasi radente: poco oltre, verso i 49°, la luce resterebbe in acqua.',
    'Oltre l\'angolo limite la superficie dell\'acqua fa da specchio: riflessione totale, e vale ancora r = i.',
    'La luce resta nella fibra perché batte sempre oltre l\'angolo limite: così viaggiano internet e le telefonate.'
  ];
  const AIUTO = 'Il laser manda un raggio sottile. Con − e + (oppure trascinando nella scena) ruoti quello che il livello ti lascia muovere, poi premi «Accendi»: il raggio parte e resta disegnato. Gli angoli i e r si misurano dalla normale, la retta perpendicolare alla superficie; il numero accanto ad A e B è invece l\'inclinazione dello specchio. Sullo specchio vale r = i. Passando dall\'aria all\'acqua o al vetro la luce si piega secondo la legge di Snell, scritta con il cerchio: n₁·a₁ = n₂·a₂, dove a₁ e a₂ sono le distanze dalla normale dei punti in cui i due raggi tagliano un cerchio di raggio ℓ = 10\u00a0cm. Se a₂ dovesse superare ℓ, il raggio rifratto non esiste: è la riflessione totale. Il sensore si accende solo con il raggio pieno: i riflessi deboli, tratteggiati, non bastano.';
  const AIUTI = [
    ' Lo specchio A gira attorno al suo centro, e il sensore è proprio sopra lo specchio.',
    ' Il raggio arriva da sinistra, in orizzontale; il sensore è in alto, dalla parte del laser.',
    ' Prima manda il raggio da A a B, poi ruota B verso il sensore.',
    ' θ₁ è l\'angolo del laser con la verticale, cioè con la normale alla superficie dell\'acqua (n = 1,33).',
    ' φ è l\'inclinazione della lastra di vetro (n = 1,5). Il laser resta fermo, e il sensore è 8\u00a0cm sotto il raggio.',
    ' Il laser è sott\'acqua; θ₁ è il suo angolo con la verticale. Uscendo nell\'aria il raggio si allontana dalla normale.',
    ' Sott\'acqua non c\'è nessuno specchio, ma la superficie, vista da sotto, può rimandare giù tutta la luce.',
    ' α è l\'inclinazione del laser sull\'asse della fibra. La fibra è di vetro (n = 1,5), fuori c\'è aria.'
  ];
  const AIUTO_LIBERO = 'In modalità libera il laser è sempre acceso e non c\'è niente da colpire. Trascina il laser per alzarlo o abbassarlo, il blocco per spostarlo, lo specchio per ruotarlo; trascinando altrove nella scena punti il laser. Sotto scegli l\'angolo α del laser, la rotazione φ del blocco, il materiale (l\'indice n) e la forma. La formula riguarda il primo punto in cui il raggio passa da un mezzo all\'altro.';

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  /* un testo con i pedici veri: «a_1 7,4 cm» → a con 1 in pedice */
  function scritta(g, x, y, testo, stile, attr) {
    const t = el('text', Object.assign({ x, y, style: stile, 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, attr || {}));
    testo.split(/(_\w)/).forEach(pz => {
      if (!pz) return;
      if (pz[0] === '_') { t.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 75%' }, pz.slice(1))); t.appendChild(el('tspan', {}, ' ')); }
      else t.appendChild(el('tspan', {}, pz));
    });
    g.appendChild(t); return t;
  }

  QUANTO.registraLab({
    id: 'laser',
    fisica: { componi, traccia, verdetto, distanza, LIVELLI, LIBERO, MATERIALI, FORME },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-laser')) { const s = document.createElement('style'); s.id = 'stile-lab-laser'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-laser');
      const param = (k, nome, giu, su) => `<div class="lab-param" data-p="${k}"><span class="nome">${nome}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${giu}">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="${su}">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: niente sensore, laser sempre acceso, blocco e materiale li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${param('laser', '', 'laser in senso orario', 'laser in senso antiorario')}
              ${param('s0', 'A', 'specchio A in senso orario', 'specchio A in senso antiorario')}
              ${param('s1', 'B', 'specchio B in senso orario', 'specchio B in senso antiorario')}
              ${param('blocco', ctx.tex('\\varphi'), 'blocco in senso orario', 'blocco in senso antiorario')}
              ${param('mat', ctx.tex('n'), 'indice più piccolo', 'indice più grande')}
              ${param('forma', '', 'forma precedente', 'forma seguente')}
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-accendi">⚡ Accendi</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { accendi: q('.b-accendi'), ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = {}; ['laser', 's0', 's1', 'blocco', 'mat', 'forma'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });
      box.forma.querySelector('output').classList.add('parola');
      const NOME_LASER = { giu: ctx.tex('\\theta_1'), su: ctx.tex('\\theta_1'), oriz: ctx.tex('\\alpha') };

      /* ---------------- stato ---------------- */
      let livello = 0, p = {}, colpi = 0, finito = false, animando = false, raf = 0;
      let tracce = [], ultimo = null, detti = {}, mancati = 0;   /* ultimo = { p, tr } dell'ultima accensione */
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const stessi = (a, c) => a && c && ['laser', 's0', 's1', 'blocco', 'mat', 'forma', 'bx', 'by', 'ly'].every(k => a[k] === c[k]);
      const comandi = () => libero ? ['laser', 'blocco', 'mat', 'forma'] : liv().comandi.map(c => c.k);
      const comando = k => libero ? null : liv().comandi.filter(c => c.k === k)[0];

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un tavolo ottico visto di lato: il laser, gli specchi, i blocchi trasparenti e il sensore', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gTracce = el('g'), gOggetti = el('g'), gRaggio = el('g'), gSegni = el('g');
      [gFondo, gTracce, gOggetti, gRaggio, gSegni].forEach(g => svg.appendChild(g));
      const clip = el('clipPath', { id: 'lab-laser-tavolo' }), clipRett = el('rect');
      clip.appendChild(clipRett); svg.insertBefore(el('defs'), svg.firstChild).appendChild(clip);
      [gTracce, gOggetti, gRaggio].forEach(g => g.setAttribute('clip-path', 'url(#lab-laser-tavolo)'));

      /* geometria: S = { w, h, U (px per cm), ox, oy (dove sta il punto x = 0, y = 0 in pixel) } */
      let G = { w: 0, h: 0, U: 4, ox: 0, oy: 0 };
      const PX = x => G.ox + x * G.U, PY = y => G.oy - y * G.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        /* se lo spazio è più alto del tavolo, il tavolo si allunga verso l'alto (sopra non c'è niente che cambi il gioco) */
        const V = liv().vista, U = Math.min((w - 12) / V[0], (h - 12) / V[1]);
        const H = Math.max(V[1], Math.min(1.7 * V[1], (h - 12) / U));
        G = { w, h, U, H, ox: (w - V[0] * U) / 2, oy: (h + H * U) / 2 };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      /* la scena del momento, con il tavolo lungo quanto è disegnato */
      function scenaUI() { const S = componi(liv(), p); S.vista = [S.vista[0], G.H]; return S; }
      const pt = a => PX(a[0]).toFixed(1) + ' ' + PY(a[1]).toFixed(1);
      const fs = k => Math.round(morsa(G.U * 3.2, 12, 15) * (k || 1));   /* corpo dei testi della scena, mai sotto i 12 px */

      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), V = [L.vista[0], G.H];
        gFondo.appendChild(el('rect', { x: PX(0), y: PY(V[1]), width: V[0] * G.U, height: V[1] * G.U, rx: 6, fill: 'var(--sup)', stroke: 'var(--bordo)', 'stroke-width': 1.5 }));
        /* il raggio non esce dal tavolo */
        ['x', 'y', 'width', 'height'].forEach((a, i) => clipRett.setAttribute(a, [PX(0), PY(V[1]), V[0] * G.U, V[1] * G.U][i]));
        /* i fori del tavolo ottico, ogni 10 cm */
        for (let x = 10; x < V[0]; x += 10) for (let y = 10; y < V[1]; y += 10) gFondo.appendChild(el('circle', { cx: PX(x), cy: PY(y), r: 1.6, fill: 'var(--testo3)', opacity: .45 }));
        /* la scala: 10 cm */
        const xs = PX(V[0]) - 10 - 10 * G.U, ys = PY(V[1]) + 34;   /* sotto il contatore delle accensioni */
        gFondo.appendChild(el('path', { d: `M${xs} ${ys - 4} V${ys} H${xs + 10 * G.U} V${ys - 4}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
        gFondo.appendChild(el('text', { x: xs + 5 * G.U, y: ys + fs(.95), 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: ' + fs(.9) + 'px var(--font)' }, '10\u00a0cm'));
        /* muri, scoglio, schermo, pareti della vasca */
        (L.muri || []).forEach(m => {
          const y1 = Math.min(m.y1, G.H), x0 = PX(m.x0), y0 = PY(y1), w = (m.x1 - m.x0) * G.U, h = (y1 - m.y0) * G.U;
          const scoglio = /scoglio/.test(m.nome || '');
          gFondo.appendChild(el('rect', { x: x0, y: y0, width: w, height: h, rx: scoglio ? 6 : 1.5, fill: scoglio ? '#7d6a55' : 'var(--testo2)', opacity: scoglio ? .85 : .7 }));
        });
        disegnaSensore();
      }
      let acceso = false;
      function disegnaSensore() {
        const vecchio = gFondo.querySelector('.sensore'); if (vecchio) gFondo.removeChild(vecchio);
        const T = liv().bersaglio; if (!T || libero) return;
        const g = el('g', { class: 'sensore', 'clip-path': 'url(#lab-laser-tavolo)' }), cx = PX(T.x), cy = PY(T.y), r = T.r * G.U;
        if (acceso) g.appendChild(el('circle', { cx, cy, r: r * 1.9, fill: 'var(--ok)', opacity: .25 }));
        g.appendChild(el('circle', { cx, cy, r, fill: acceso ? 'var(--ok)' : 'var(--sup)', stroke: acceso ? 'var(--ok)' : 'var(--no)', 'stroke-width': 2.5 }));
        g.appendChild(el('circle', { cx, cy, r: r * 0.38, fill: acceso ? 'var(--sup)' : 'var(--no)', opacity: .9 }));
        gFondo.appendChild(g);
      }

      /* blocchi (acqua, vetro, fibra), specchi e laser: cambiano con i comandi */
      function disegnaOggetti() {
        vuota(gOggetti);
        const L = liv(), S = scenaUI();
        S.blocchi.forEach(bl => {
          let d, bb;
          if (bl.pti) { d = 'M' + bl.pti.map(pt).join(' L') + ' Z'; bb = bl.pti; }
          else {
            const s = bl.semi, u = vers(s.g), a0 = meno(s.c, per(u, s.R)), a1 = somma(s.c, per(u, s.R)), R = s.R * G.U;
            d = 'M' + pt(a0) + ' A' + R + ' ' + R + ' 0 0 1 ' + pt(a1) + ' Z';   /* l'arco dalla parte di +y locale: da a0 ad a1 in senso orario */
            bb = [a0, a1, somma(s.c, per(vers(s.g + 90), s.R))];
          }
          const acqua = bl.n === ACQUA && !bl.centro;
          gOggetti.appendChild(el('path', { d, fill: 'var(--s1)', 'fill-opacity': acqua ? .2 : (bl.n > 2 ? .3 : .16), stroke: 'var(--s1)', 'stroke-width': acqua ? 1.4 : 2, 'stroke-opacity': .7, 'stroke-linejoin': 'round' }));
          /* il nome e l'indice: dentro in alto se è grande (la vasca), sotto se è piccolo */
          const xs = bb.map(v => v[0]), ys = bb.map(v => v[1]);
          const x0 = Math.max(0, Math.min.apply(null, xs)), x1 = Math.min(L.vista[0], Math.max.apply(null, xs)), y0 = Math.max(0, Math.min.apply(null, ys)), y1 = Math.max.apply(null, ys);
          const testo = bl.nome + ', n = ' + String(bl.n).replace('.', ',');
          if (acqua) scritta(gOggetti, PX(x1) - 6, PY(Math.min(y1, L.vista[1])) + fs(1.25), testo, 'font: 600 ' + fs(.95) + 'px var(--font); fill: var(--s1)', { 'text-anchor': 'end' });
          else if (bl.fibra) scritta(gOggetti, PX(x0 + 16), PY(y0) + fs(1.4), testo, 'font: 600 ' + fs(.95) + 'px var(--font); fill: var(--s1)', { 'text-anchor': 'middle' });
          else scritta(gOggetti, PX((x0 + x1) / 2), Math.min(PY(y0) + fs(1.4), PY(0) - 4), testo, 'font: 600 ' + fs(.95) + 'px var(--font); fill: var(--s1)', { 'text-anchor': 'middle' });
        });
        S.specchi.forEach((s, i) => {
          gOggetti.appendChild(el('line', { x1: PX(s.a[0]), y1: PY(s.a[1]), x2: PX(s.b[0]), y2: PY(s.b[1]), stroke: 'var(--s1)', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
          gOggetti.appendChild(el('circle', { cx: PX(s.c[0]), cy: PY(s.c[1]), r: 3, fill: 'var(--sup)', stroke: 'var(--s1)', 'stroke-width': 1.6 }));
          if (!libero) {   /* la lettera, oltre l'estremo destro dello specchio (lontano dagli angoli segnati) */
            const u = vers(s.ang), dx = u[0] >= 0 ? 1 : -1, qq = somma(s.c, per(u, dx * (s.L / 2 + 3.2)));
            scritta(gOggetti, PX(qq[0]), PY(qq[1]) + 5, s.nome, 'font: 700 ' + fs(1.05) + 'px var(--font); fill: var(--s1)', { 'text-anchor': 'middle' });
          }
        });
        disegnaLaser(S);
      }
      function disegnaLaser(S) {
        const L = liv(), o = S.laser.o, u = vers(S.laser.dir), nx = [-u[1], u[0]];
        const dietro = somma(o, per(u, -6.5)), lw = 1.8;
        const corpo = [somma(dietro, per(nx, lw)), somma(o, per(nx, lw)), somma(o, per(nx, -lw)), somma(dietro, per(nx, -lw))];
        gOggetti.appendChild(el('path', { d: 'M' + corpo.map(pt).join(' L') + ' Z', fill: 'var(--testo)', opacity: .85, stroke: 'var(--testo)', 'stroke-width': 1, 'stroke-linejoin': 'round' }));
        gOggetti.appendChild(el('circle', { cx: PX(o[0]), cy: PY(o[1]), r: 2.6, fill: 'var(--s2)' }));
        /* l'angolo del comando: dalla verticale (θ1) o dall'orizzontale (α) */
        const rif = L.laser.rif; if (!rif) return;
        const g0 = rif === 'giu' ? -90 : (rif === 'su' ? 90 : 0), val = p.laser;
        const R = morsa(9 * G.U, 34, 60), cx = PX(o[0]), cy = PY(o[1]);
        const r0 = vers(g0);
        gOggetti.appendChild(el('line', { x1: cx, y1: cy, x2: cx + r0[0] * R * 1.25, y2: cy - r0[1] * R * 1.25, stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }));
        if (Math.abs(val) >= 1) {
          const a1 = vers(S.laser.dir), sweep = (S.laser.dir - g0) > 0 ? 0 : 1;
          gOggetti.appendChild(el('path', { d: `M${cx + r0[0] * R} ${cy - r0[1] * R} A${R} ${R} 0 0 ${sweep} ${cx + a1[0] * R} ${cy - a1[1] * R}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
        }
        const mezzo = vers((g0 + S.laser.dir) / 2), lr = R + 14;
        scritta(gOggetti, cx + mezzo[0] * lr, cy - mezzo[1] * lr + 5, (rif === 'oriz' ? 'α ' : 'θ_1 ') + num(val, 0) + '°', 'font: 600 ' + fs() + 'px var(--font); fill: var(--testo)', { 'text-anchor': mezzo[0] < -0.3 ? 'end' : (mezzo[0] > 0.3 ? 'start' : 'middle') });
      }
      /* ---------------- il raggio ---------------- */
      const lungo = s => Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
      const lunghezza = tr => tr.tratti.reduce((a, s) => a + lungo(s), 0);
      const uni = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
      /* il cammino in pixel, fino a una certa lunghezza (per l'animazione dell'accensione) */
      function percorso(tr, fino) {
        let d = '', resto = fino;
        for (let i = 0; i < tr.tratti.length; i++) {
          const s = tr.tratti[i], l = lungo(s);
          if (!d) d = 'M' + pt(s.a);
          if (resto >= l) { d += ' L' + pt(s.b); resto -= l; continue; }
          d += ' L' + pt(somma(s.a, per(meno(s.b, s.a), resto / l)));
          break;
        }
        return d;
      }
      function raggio(g, tr, op, debole, fino) {
        const d = percorso(tr, fino == null ? Infinity : fino);
        if (!d) return;
        if (!debole) g.appendChild(el('path', { d, fill: 'none', stroke: 'var(--s2)', 'stroke-width': 8, opacity: .2 * op, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d, fill: 'none', stroke: 'var(--s2)', 'stroke-width': debole ? 1.6 : 2.6, opacity: op, 'stroke-dasharray': debole ? '6 5' : 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        if (debole || fino != null) return;
        /* i riflessi deboli dove la luce passa da un mezzo all'altro: solo un accenno tratteggiato */
        tr.riflessi.forEach(r => {
          const f = somma(r.p, per(r.d, 7));
          g.appendChild(el('line', { x1: PX(r.p[0]), y1: PY(r.p[1]), x2: PX(f[0]), y2: PY(f[1]), stroke: 'var(--s2)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4', opacity: .6 }));
        });
      }
      /* il punto in cui si legge la legge di Snell: il primo cambio di mezzo; nella fibra, la parete più a rischio */
      function chiave(L, tr) {
        const ev = tr.eventi.filter(e => e.tipo !== 'riflesso');
        if (L.formula === 'fibra') {
          const pareti = ev.slice(1), esce = pareti.filter(e => e.tipo === 'rifratto' && !e.entra)[0];
          if (esce) return esce;
          let m = null; pareti.forEach(e => { if (e.tipo === 'totale' && (!m || e.i < m.i)) m = e; });
          return m;
        }
        return ev[0] || null;
      }
      /* le misure sul disegno: normale e angoli sugli specchi; cerchio, a1 e a2 dove la luce cambia mezzo */
      function segni(tr) {
        const L = liv(), st = 'font: 600 ' + fs(.92) + 'px var(--font)';
        const tratteggio = (a, c) => gSegni.appendChild(el('line', { x1: PX(a[0]), y1: PY(a[1]), x2: PX(c[0]), y2: PY(c[1]), stroke: 'var(--testo2)', 'stroke-width': 1.3, 'stroke-dasharray': '4 4' }));
        const etichetta = (q, testo, colore) => scritta(gSegni, PX(q[0]), PY(q[1]) + fs(.35), testo, st + '; fill: ' + (colore || 'var(--testo)'), { 'text-anchor': 'middle' });
        tr.eventi.filter(e => e.tipo === 'riflesso').slice(0, 3).forEach(e => {
          tratteggio(e.p, somma(e.p, per(e.nrm, 9)));
          const gi = Math.round(e.i) + '°', dd = morsa(3.6 / Math.max(0.05, Math.sin(e.i / 2 * RAD)), 6.5, 13);   /* le due scritte non si toccano */
          etichetta(somma(e.p, per(uni(somma(e.nrm, per(e.din, -1))), dd)), gi);
          etichetta(somma(e.p, per(uni(somma(e.nrm, e.dout)), dd)), gi);
        });
        const e = chiave(L, tr); if (!e) return;
        const c = e.p, R = ELLE * G.U;
        gSegni.appendChild(el('circle', { cx: PX(c[0]), cy: PY(c[1]), r: R, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' }));
        tratteggio(somma(c, per(e.nrm, 13)), somma(c, per(e.nrm, -13)));
        const pezzo = (P, nome) => {   /* la distanza di P dalla normale, in verde */
          const F = somma(c, per(e.nrm, sc(meno(P, c), e.nrm)));
          gSegni.appendChild(el('line', { x1: PX(P[0]), y1: PY(P[1]), x2: PX(F[0]), y2: PY(F[1]), stroke: 'var(--s3)', 'stroke-width': 3, 'stroke-linecap': 'round' }));
          const fuori = uni(meno(P, F)), qq = somma(somma(P, F), [0, 0]);
          const m = [qq[0] / 2, qq[1] / 2];
          const lab = somma(m, per(uni(meno(m, c)), 3.2));
          scritta(gSegni, PX(lab[0]), PY(lab[1]) + fs(.35), nome, 'font: 700 ' + fs(.95) + 'px var(--font); fill: var(--s3)', { 'text-anchor': fuori[0] > 0.3 ? 'start' : (fuori[0] < -0.3 ? 'end' : 'middle') });
        };
        const P1 = somma(c, per(e.din, -ELLE));
        if (e.a1 > 0.3) pezzo(P1, 'a_1');
        etichetta(somma(c, per(uni(somma(e.nrm, per(e.din, -1))), ELLE * 0.55)), Math.round(e.i) + '°');
        if (e.tipo === 'rifratto') {
          const P2 = somma(c, per(e.dout, ELLE));
          if (e.a2 > 0.3) pezzo(P2, 'a_2');
          etichetta(somma(c, per(uni(somma(per(e.nrm, -1), e.dout)), ELLE * 0.55)), Math.round(e.r) + '°');
        } else {
          const qq = somma(c, per(e.nrm, -(ELLE + 3.5)));
          etichetta(qq, 'a_2 > ℓ: niente rifratto', 'var(--s3)');
        }
      }
      function disegnaRaggi() {
        vuota(gTracce); vuota(gRaggio); vuota(gSegni);
        if (libero) { const tr = traccia(scenaUI()); raggio(gRaggio, tr, 1); segni(tr); return tr; }
        tracce.forEach(t => {
          if (t === ultimo && stessi(t.p, p)) { raggio(gRaggio, t.tr, 1); segni(t.tr); }
          else raggio(gTracce, t.tr, t === ultimo ? .5 : .25, true);
        });
        return null;
      }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaOggetti(); disegnaRaggi(); }

      /* ---------------- pannello ---------------- */
      function lim(k) {
        const c = comando(k);
        if (k === 's0' || k === 's1') return { min: 0, max: 179, passo: 1, giro: 180 };
        if (k === 'laser') return libero ? { min: -80, max: 80, passo: 1 } : { min: c.min, max: c.max, passo: 1 };
        if (k === 'blocco') return libero ? { min: -180, max: 180, passo: 5, giro: 360 } : { min: c.min, max: c.max, passo: 1 };
        if (k === 'forma') return { min: 0, max: 2, passo: 1, giro: 3 };
        return { min: 0, max: 2, passo: 1 };
      }
      function aggiornaParametri() {
        const ks = comandi(), L = liv();
        Object.keys(box).forEach(k => { box[k].hidden = ks.indexOf(k) < 0; box[k].classList.toggle('solo', ks.length === 1); });
        box.laser.querySelector('.nome').innerHTML = NOME_LASER[L.laser.rif || 'oriz'];
        const out = (k, t) => { box[k].querySelector('output').textContent = t; };
        out('laser', num(p.laser || 0, 0) + '°'); out('s0', (p.s0 || 0) + '°'); out('s1', (p.s1 || 0) + '°');
        out('blocco', num(p.blocco || 0, 0) + '°');
        if (libero) { out('mat', String(MATERIALI[p.mat].n).replace('.', ',')); out('forma', FORME[p.forma]); box.mat.title = MATERIALI[p.mat].nome; }
        ks.forEach(k => {
          const m = lim(k);
          box[k].querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = animando || (!m.giro && (d < 0 ? p[k] <= m.min : p[k] >= m.max)); });
        });
      }
      /* il ponte con la teoria: la formula con i numeri scelti; il risultato dopo l'accensione (in modalità libera subito) */
      function aggiornaFormula(trLibero) {
        const L = liv(), tipo = L.formula;
        const fatto = libero || (ultimo && stessi(ultimo.p, p));
        const tr = libero ? trLibero : (fatto ? ultimo.tr : traccia(scenaUI()));
        const pezzi = [], P = (cl, s) => '<span class="pezzo ' + cl + '">' + ctx.tex(s) + '</span>';
        const ignoto = s => P('ignoto', s + ' = \\ ?');
        if (tipo === 'riflessione') {
          pezzi.push(P('', 'r = i'));
          if (fatto) {
            const ev = tr.eventi.filter(e => e.tipo === 'riflesso');
            if (!ev.length) pezzi.push('<span class="pezzo nota">il raggio non tocca gli specchi</span>');
            ev.slice(0, 2).forEach(e => pezzi.push(P('esito', (L.specchi.length > 1 ? '\\text{' + 'AB'[e.specchio] + '}\\!:\\ ' : '') + 'i = r \\approx ' + Math.round(e.i) + '^\\circ')));
          } else pezzi.push(ignoto('i'));
        } else {
          pezzi.push(P('simbolo', 'n_1 \\cdot a_1 = n_2 \\cdot a_2'));
          const e = chiave(L, tr);
          if (tipo === 'fibra' && !fatto) { pezzi.push(P('nota', '\\ell = 10\\,\\text{cm}')); pezzi.push(ignoto('a_2')); }
          else if (!e) pezzi.push(libero || fatto ? '<span class="pezzo nota">' + (libero ? 'il raggio non attraversa il blocco' : 'il raggio non cambia mezzo') + '</span>' : ignoto('a_2'));   /* prima di accendere non si anticipa dove va il raggio */
          else {
            pezzi.push(P('', texN(e.n1) + ' \\cdot ' + texNum(e.a1, 1) + '\\,\\text{cm} = ' + texN(e.n2) + ' \\cdot a_2'));
            if (!fatto) pezzi.push(ignoto('a_2'));
            else if (e.tipo === 'totale') { pezzi.push(P('esito', 'a_2 \\approx ' + texNum(e.a2, 1) + '\\,\\text{cm} > \\ell')); pezzi.push('<span class="pezzo nota">riflessione totale</span>'); }
            else pezzi.push(P('esito', 'a_2 \\approx ' + texNum(e.a2, 1) + '\\,\\text{cm}'));
          }
        }
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
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'accensioni: ' + colpi; }
      function aggiorna() {
        aggiornaParametri(); disegnaOggetti();
        const tr = disegnaRaggi(); aggiornaFormula(tr);
        if (libero) { msg.textContent = osserva(tr); msg.className = 'lab-messaggio'; }
      }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        p = {}; L.comandi.forEach(c => { p[c.k] = c.inizio; });
        colpi = 0; finito = false; tracce = []; ultimo = null; detti = {}; mancati = 0; acceso = false;
        aiutoEl.hidden = true; consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.accendi.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- l'accensione ---------------- */
      function accendi() {
        if (animando || finito || libero) return;
        const L = liv(), tr = traccia(scenaUI());
        colpi++; aggiornaConta(); aiutoEl.hidden = true;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.accendi.disabled = true; b.ric.disabled = true;
        acceso = false; disegnaSensore(); aggiornaParametri(); aggiornaLivelli();
        vuota(gRaggio); vuota(gSegni); vuota(gTracce);
        tracce.forEach(t => raggio(gTracce, t.tr, .25, true));
        const tot = lunghezza(tr), durata = morsa(220 + tot * 2.2, 300, 580), t0 = performance.now();
        const passo = ora => {
          const f = Math.min(1, (ora - t0) / durata);
          vuota(gRaggio); raggio(gRaggio, tr, 1, false, tot * f);
          if (f < 1) { raf = requestAnimationFrame(passo); return; }
          raf = 0; spento(tr);
        };
        raf = requestAnimationFrame(passo);
      }
      function spento(tr) {
        animando = false; b.accendi.disabled = false; b.ric.disabled = false;
        const L = liv(), prec = ultimo;
        ultimo = { p: Object.assign({}, p), tr };
        tracce.push(ultimo); if (tracce.length > 3) tracce.shift();
        const v = verdetto(L, tr);
        acceso = v.ok; disegnaSensore();
        aggiorna(); aggiornaLivelli();
        if (v.ok) { vinci(v.testo); return; }
        mancati++;
        msg.innerHTML = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, tr, prec);
      }
      function vinci(testo) {
        finito = true; b.accendi.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (colpi === 1 ? ' Al primo colpo.' : ' Accensioni: ' + colpi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello], { espressione: colpi <= 2 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiaveFrase, testo) {
        if (detti[chiaveFrase]) return; detti[chiaveFrase] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      const norm = (g, giro) => { let v = ((g % giro) + giro) % giro; if (v > giro / 2) v -= giro; return v; };
      function erroreTipico(L, tr, prec) {
        const tot = tr.eventi.some(e => e.tipo === 'totale'), esce = tr.eventi.some(e => e.tipo === 'rifratto' && !e.entra);
        /* «lo specchio gira di 20°, il raggio di 20°»: ha girato lo specchio quanto mancava al raggio, e il raggio è girato del doppio */
        if (L.formula === 'riflessione' && prec) {
          const k = L.specchi.length === 1 ? 's0' : (prec.p.s0 === p.s0 ? 's1' : null);
          const ep = k && prec.tr.eventi.filter(e => e.tipo === 'riflesso' && e.specchio === +k[1])[0];
          if (ep) {
            const T = L.bersaglio, dirT = Math.atan2(T.y - ep.p[1], T.x - ep.p[0]) / RAD, dirB = Math.atan2(ep.dout[1], ep.dout[0]) / RAD;
            const manca = norm(dirT - dirB, 360), girato = norm(p[k] - prec.p[k], 180);
            if (Math.abs(manca) >= 8 && Math.abs(girato - manca) <= Math.max(3, 0.15 * Math.abs(manca))) {
              dici('doppio', 'Hai girato lo specchio di ' + Math.abs(girato) + '°, ma il raggio riflesso gira del doppio: ' + 2 * Math.abs(girato) + '°.');
              return;
            }
          }
        }
        if (livello === 3) {   /* ha mirato dritto al sensore, come se l'acqua non ci fosse */
          const T = L.bersaglio, o = L.laser, dritto = Math.atan2(T.x - o.x, o.y - T.y) / RAD;
          if (Math.abs(p.laser - dritto) <= 2.5) { dici('dritto', 'Hai mirato dritto al sensore, ma in acqua il raggio si avvicina alla normale e cade prima: mira più in là.'); return; }
        }
        if (livello === 4 && mancati >= 2) dici('lastra', 'La lastra non gira il raggio: lo sposta di lato, e di più quanto più è inclinata.');
        if (livello === 5 && tot) dici('limite', 'Oltre l\'angolo limite, circa 49° per l\'acqua, la luce non esce più: torna tutta giù.');
        if (livello === 6 && esce && !tot) dici('esce', 'Sotto l\'angolo limite, circa 49°, la luce esce dall\'acqua: la superficie fa da specchio solo oltre.');
        if (livello === 7 && esce) dici('piega', 'Dove batte sulla parete sotto l\'angolo limite del vetro (circa 42°), la luce scappa.');
      }

      /* ---------------- modalità libera: laser sempre acceso, nessun verdetto ---------------- */
      const LIBERO_INIZIO = { laser: -6, ly: 40, blocco: 20, mat: 1, forma: 0, bx: 44, by: 30, s0: 60 };
      function osserva(tr) {   /* osservazioni neutre su che cosa ha fatto la luce */
        const e = tr && chiave(LIBERO, tr); if (!e) return '';
        const nome = MATERIALI[p.mat].nome, nel = nome === 'acqua' ? 'nell\'acqua' : 'nel ' + nome, dal = nome === 'acqua' ? 'dall\'acqua' : 'dal ' + nome;
        if (e.tipo === 'totale') return 'Riflessione totale: uscendo ' + dal + ' a₂ dovrebbe superare ℓ, e il raggio rifratto non c\'è.';
        if (e.entra) return e.i < 0.5 ? 'Il raggio entra perpendicolare: non devia.' : 'Entrando ' + nel + ' il raggio si avvicina alla normale.';
        return 'Uscendo ' + dal + ' il raggio si allontana dalla normale.';
      }
      function mostraLibero() {
        b.accendi.hidden = libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), colpi, finito, tracce: tracce.slice(), ultimo, detti: Object.assign({}, detti), mancati, acceso, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        p = Object.assign({}, LIBERO_INIZIO); tracce = []; ultimo = null; finito = false; acceso = false;
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {   /* si torna al livello com'era */
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; colpi = z.colpi; finito = z.finito; tracce = z.tracce; ultimo = z.ultimo; detti = z.detti; mancati = z.mancati; acceso = z.acceso;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.accendi.disabled = finito;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }

      /* ---------------- comandi ---------------- */
      function dopoCambio() {
        if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        aggiorna();
      }
      function cambia(k, d) {
        if (animando || (finito && !libero) || comandi().indexOf(k) < 0) return false;
        const m = lim(k);
        let v = (p[k] || 0) + d * m.passo;
        if (m.giro) v = m.giro === 3 ? (v + 3) % 3 : (m.giro === 180 ? ((v % 180) + 180) % 180 : norm(v, 360));
        else v = morsa(v, m.min, m.max);
        if (v === p[k]) return false;
        p[k] = v; dopoCambio(); return true;
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        if (k === 'forma' || k === 'mat') return;   /* le scelte non si ripetono da sole */
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* il dito nella scena: ruota il laser (la direzione dal laser al dito), uno specchio o la lastra;
         in modalità libera sposta anche il laser e il blocco */
      let presa = null;
      function mondo(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const P = svg.createSVGPoint(); P.x = ev.clientX; P.y = ev.clientY;
        const c = P.matrixTransform(m.inverse());
        return [(c.x - G.ox) / G.U, (G.oy - c.y) / G.U];
      }
      const dist = (a, c) => Math.hypot(a[0] - c[0], a[1] - c[1]);
      function distSeg(c, a, e) { const v = meno(e, a), l2 = sc(v, v), t = morsa(sc(meno(c, a), v) / l2, 0, 1); return dist(c, somma(a, per(v, t))); }
      const angolo = (c, o) => Math.atan2(c[1] - o[1], c[0] - o[0]) / RAD;
      function scegli(c) {
        const S = scenaUI();
        if (libero) {
          if (dist(c, S.laser.o) < 7) return { k: 'ly' };
          if (dentro(S.blocchi[0], c)) return { k: 'muovi', da: c, bx: p.bx, by: p.by };
          if (distSeg(c, S.specchi[0].a, S.specchi[0].b) < 5) return { k: 's0' };
          return { k: 'laser' };
        }
        let best = null, bd = Infinity;
        comandi().forEach(k => {
          const piv = k === 'laser' ? S.laser.o : (k === 'blocco' ? S.blocchi[0].centro : S.specchi[+k[1]].c), d = dist(c, piv);
          if (d < bd) { bd = d; best = k; }
        });
        if (best === 'blocco') return { k: 'blocco', g0: angolo(c, S.blocchi[0].centro), v0: p.blocco };
        return best ? { k: best } : null;
      }
      function muoviPresa(c) {
        const L = liv(), S = scenaUI(), nuovo = Object.assign({}, p), k = presa.k;
        if (k === 'laser') {
          const o = S.laser.o; if (dist(c, o) < 2) return;
          const g = angolo(c, o), rif = L.laser.rif || 'oriz', m = lim('laser');
          nuovo.laser = morsa(Math.round(rif === 'giu' ? 90 + g : (rif === 'su' ? 90 - g : g)), m.min, m.max);
        } else if (k === 's0' || k === 's1') {
          const s = S.specchi[+k[1]]; if (dist(c, s.c) < 2) return;
          nuovo[k] = ((Math.round(angolo(c, s.c)) % 180) + 180) % 180;
        } else if (k === 'blocco') {
          const cc = S.blocchi[0].centro; if (dist(c, cc) < 2) return;
          const m = lim('blocco');
          nuovo.blocco = morsa(Math.round(presa.v0 + norm(angolo(c, cc) - presa.g0, 360)), m.min, m.max);
        } else if (k === 'ly') nuovo.ly = morsa(Math.round(c[1]), 4, L.vista[1] - 4);
        else if (k === 'muovi') {
          nuovo.bx = morsa(Math.round(presa.bx + c[0] - presa.da[0]), 18, L.vista[0] - 16);
          nuovo.by = morsa(Math.round(presa.by + c[1] - presa.da[1]), 14, L.vista[1] - 14);
        }
        if (!stessi(nuovo, p)) { p = nuovo; dopoCambio(); }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || (finito && !libero)) return;
        const c = mondo(ev); if (!c) return;
        presa = scegli(c); if (!presa) return;
        aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        if (presa.k !== 'muovi' && presa.k !== 'blocco') muoviPresa(c);
        ev.preventDefault();
      });
      const muovi = ev => { if (!presa) return; const c = mondo(ev); if (c) muoviPresa(c); ev.preventDefault(); };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.accendi.addEventListener('click', accendi);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { p = Object.assign({}, LIBERO_INIZIO); ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').textContent = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      LIVELLI.forEach((_, k) => {
        const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'lab-pallino';
        pl.setAttribute('aria-label', 'Livello ' + (k + 1)); pl.innerHTML = '<span>' + (k + 1) + '</span>';
        pl.addEventListener('click', () => { if (!animando) avviaLivello(k); });
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello);
      let forma = '';
      const ro = new ResizeObserver(() => {
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); fermaRipeti(); ro.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
