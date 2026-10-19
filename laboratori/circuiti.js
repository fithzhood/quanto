/* Laboratorio «I circuiti» — pile, lampadine e fili (argomento corrente).
   Su una basetta a griglia stanno pile e lampadine; i fili si disegnano trascinando il dito da un punto all'altro
   (un tocco su un filo lo toglie), pile e lampadine si spostano trascinandole, una pila si gira toccandola.
   Premendo Accendi il circuito si risolve davvero: analisi nodale (leggi di Kirchhoff) sulla griglia, con fili e pile
   di resistenza trascurabile (1e-6 e 1e-4 Ω, così un corto circuito dà una corrente enorme invece di un'infinità). Ogni
   lampadina è una resistenza fissa R e brilla secondo la potenza vera, P = V·I = R·I²; la luce piena (3 W) è quella
   di una lampadina da 12 Ω su 6 V. Colori come nella teoria: corrente viola, tensione arancio, potenza verde.
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-circuiti .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; }
    .lab-circuiti .lab-scena > svg { width: 100%; height: 100%; }
    .lab-circuiti svg text { font-family: var(--font); }
    .lab-circuiti .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-circuiti .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-circuiti .consegna:empty { display: none; }
    .lab-circuiti .richieste { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px 5px; }
    .lab-circuiti .richieste:empty { display: none; }
    .lab-circuiti .chip { display: inline-flex; align-items: center; gap: 4px; padding: 0 7px; border-radius: 999px; border: 1.5px solid var(--bordo2); background: var(--sup2); font-size: .82rem; line-height: 1.55; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .lab-circuiti .chip .lamp { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--testo2); flex: none; }
    .lab-circuiti .chip.ok { border-color: var(--ok); }
    .lab-circuiti .chip.no { border-color: var(--no); }
    .lab-circuiti .chip .mis { color: var(--no); font-weight: 600; }
    .lab-circuiti .chip.ok .mis { color: var(--ok); }
    .lab-circuiti .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .4em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.4em; }
    .lab-circuiti .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-circuiti .formula .ignoto { color: var(--testo3); }
    .lab-circuiti .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-circuiti .formula .avviso { color: var(--no); font-weight: 600; }
    .lab-circuiti .gI { color: var(--s4); }
    .lab-circuiti .gV { color: var(--s2); }
    .lab-circuiti .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-circuiti .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-circuiti .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-circuiti .lab-barra { gap: 5px; } .lab-circuiti .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-circuiti .btn[disabled] { opacity: .38; cursor: default; }
    .lab-circuiti .lab-parametri { max-width: 520px; gap: 6px 4px; }
    .lab-circuiti .lab-param { gap: 2px; min-width: 0; }
    .lab-circuiti .lab-param .nome { min-width: 1.2em; }
    .lab-circuiti .lab-param output { min-width: 2.5em; text-align: center; }
    .lab-circuiti .lab-param[data-p="E"] output { min-width: 4.2em; }   /* larga quanto «12,0 V» */
    .lab-circuiti .lab-param[data-p="R"] output { min-width: 3.4em; }   /* larga quanto «48 Ω» */
    .lab-circuiti .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-circuiti .vinto { display: inline-block; animation: lab-circuiti-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-circuiti-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-circuiti .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-circuiti .formula .simbolo { display: none; } .lab-circuiti .formula .nome-stretto { display: inline; } }
    /* layout fermo: i numeri che cambiano e i cambi di livello non spostano niente */
    .lab-circuiti .consegna { min-height: 2.9em; }   /* righe riservate alla consegna più lunga */
    .lab-circuiti .formula { height: 5.2rem; min-height: 0; overflow: hidden; align-content: center; }   /* altezza fissa: un caso troppo grande si rimpicciolisce (adattaFormula) */
    .lab-circuiti .lab-messaggio { min-height: 3em; }   /* due righe riservate al messaggio */
    @container lab (max-width: 420px) { .lab-circuiti .consegna { min-height: 2.8em; } .lab-circuiti .formula { height: 3.4rem; } }
    .lab-circuiti .lab-barra .b-ric { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* larga già quanto l'etichetta più lunga: vincere non sposta gli altri pulsanti */
    .lab-circuiti .lab-barra .b-ric::after { content: 'Ricomincia dal primo'; content: 'Ricomincia dal primo' / ''; height: 0; overflow: hidden; visibility: hidden; }
    .lab-circuiti .chip .mis { display: inline-block; min-width: 5.4em; text-align: center; }   /* posto fisso per «ora 1,23 W» */
    .lab-circuiti .lab-barra .b-accendi { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* «Spegni» largo quanto «⚡ Accendi» */
    .lab-circuiti .lab-barra .b-accendi::after { content: '⚡ Accendi'; content: '⚡ Accendi' / ''; height: 0; overflow: hidden; visibility: hidden; }
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-circuiti .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-circuiti .lab-lato { min-height: 21.1rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-circuiti .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 21.1rem) / 2)); padding-bottom: max(14px, calc((100cqh - 21.1rem) / 2)); } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ----------------
     Stato del circuito: { griglia: [nx, ny], comp: [...], fili: { chiave: true } }.
     Un lato della griglia è [x, y, 'h'] (da (x, y) a (x+1, y)) oppure [x, y, 'v'] (da (x, y) a (x, y+1)).
     comp: { id, tipo: 'pila' | 'lamp', e: lato, E (V, pila), piu (1: il + sta nel secondo capo), R (Ω, lampadina) } */
  const R_FILO = 1e-6, R_PILA = 1e-4, I_CORTO = 20, P_PIENA = 3, TOL = 0.05;
  const chiave = e => e[0] + ',' + e[1] + ',' + e[2];
  const daChiave = k => { const s = k.split(','); return [+s[0], +s[1], s[2]]; };
  const capi = e => [[e[0], e[1]], e[2] === 'h' ? [e[0] + 1, e[1]] : [e[0], e[1] + 1]];

  function trovaUnione(n) {
    const p = []; for (let i = 0; i < n; i++) p.push(i);
    const radice = i => { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; };
    return { radice, unisci: (a, b) => { a = radice(a); b = radice(b); if (a !== b) p[b] = a; } };
  }

  /* eliminazione di Gauss con pivot parziale (un pivot nullo lascia l'incognita a zero) */
  function gauss(A, b) {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let p = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      if (Math.abs(A[p][i]) < 1e-12) continue;
      if (p !== i) { const t = A[p]; A[p] = A[i]; A[i] = t; const u = b[p]; b[p] = b[i]; b[i] = u; }
      for (let r = i + 1; r < n; r++) {
        const f = A[r][i] / A[i][i]; if (!f) continue;
        for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
        b[r] -= f * b[i];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      if (Math.abs(A[i][i]) < 1e-12) { x[i] = 0; continue; }
      let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c];
      x[i] = s / A[i][i];
    }
    return x;
  }

  /* Ogni ramo (filo, lampadina, pila) va dal nodo a al nodo b, con conduttanza G e f.e.m. E:
     la corrente da a verso b vale I = G·(Va − Vb + E). Per la pila a è il −, b il +.
     Legge dei nodi in ogni nodo della griglia → sistema lineare nei potenziali, con un nodo a 0 V per ogni pezzo di circuito. */
  function risolvi(st) {
    const nx = st.griglia[0], ny = st.griglia[1], N = nx * ny;
    const nodo = p => p[1] * nx + p[0];
    const rami = [];
    Object.keys(st.fili).forEach(k => { const c = capi(daChiave(k)); rami.push({ tipo: 'filo', k, a: nodo(c[0]), b: nodo(c[1]), G: 1 / R_FILO, E: 0 }); });
    st.comp.forEach(c => {
      const t = capi(c.e);
      if (c.tipo === 'lamp') rami.push({ tipo: 'lamp', c, a: nodo(t[0]), b: nodo(t[1]), G: 1 / c.R, E: 0 });
      else rami.push({ tipo: 'pila', c, a: nodo(c.piu ? t[0] : t[1]), b: nodo(c.piu ? t[1] : t[0]), G: 1 / R_PILA, E: c.E });
    });
    /* i pezzi di circuito collegati: in ognuno un nodo fa da riferimento */
    const uf = trovaUnione(N), usato = new Array(N).fill(false);
    rami.forEach(r => { uf.unisci(r.a, r.b); usato[r.a] = usato[r.b] = true; });
    const terra = {}, indice = new Array(N).fill(-1);
    let n = 0;
    for (let i = 0; i < N; i++) {
      if (!usato[i]) continue;
      const rd = uf.radice(i);
      if (terra[rd] === undefined) { terra[rd] = i; continue; }
      indice[i] = n++;
    }
    const A = [], bb = [];
    for (let i = 0; i < n; i++) { A.push(new Array(n).fill(0)); bb.push(0); }
    const metti = (i, j, v) => { if (indice[i] >= 0 && indice[j] >= 0) A[indice[i]][indice[j]] += v; };
    rami.forEach(r => {
      metti(r.a, r.a, r.G); metti(r.b, r.b, r.G); metti(r.a, r.b, -r.G); metti(r.b, r.a, -r.G);
      if (r.E) { if (indice[r.a] >= 0) bb[indice[r.a]] -= r.G * r.E; if (indice[r.b] >= 0) bb[indice[r.b]] += r.G * r.E; }
    });
    const x = gauss(A, bb), V = new Array(N).fill(0);
    for (let i = 0; i < N; i++) if (indice[i] >= 0) V[i] = x[indice[i]];
    rami.forEach(r => { r.I = r.G * (V[r.a] - V[r.b] + r.E); if (!isFinite(r.I)) r.I = 0; });
    const corto = rami.some(r => r.tipo !== 'lamp' && Math.abs(r.I) > I_CORTO);
    const lampade = {}, pile = {};
    rami.forEach(r => {
      if (r.tipo === 'lamp') { const v = Math.abs(V[r.a] - V[r.b]); lampade[r.c.id] = { V: v, I: v * r.G, P: v * v * r.G, R: r.c.R }; }
      else if (r.tipo === 'pila') pile[r.c.id] = { I: r.I, V: V[r.b] - V[r.a], E: r.c.E, corto: Math.abs(r.I) > I_CORTO };
    });
    /* per gli errori tipici: lampadine coi capi uniti da un filo, e lampadine dentro un giro chiuso */
    const ufFili = trovaUnione(N);
    rami.forEach(r => { if (r.tipo === 'filo') ufFili.unisci(r.a, r.b); });
    const scavalcate = [], chiuse = [];
    rami.forEach(r => {
      if (r.tipo !== 'lamp') return;
      if (ufFili.radice(r.a) === ufFili.radice(r.b)) scavalcate.push(r.c.id);
      const u = trovaUnione(N);
      rami.forEach(s => { if (s !== r) u.unisci(s.a, s.b); });
      if (u.radice(r.a) === u.radice(r.b)) chiuse.push(r.c.id);
    });
    return { rami, V, corto, lampade, pile, scavalcate, chiuse };
  }

  /* ---------------- il verdetto di un livello ---------------- */
  const vicino = (P, t) => t === 0 ? P < 0.01 : Math.abs(P - t) <= TOL * t;
  const elenco = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
  function verdetto(L, ris) {
    if (ris.corto) return { ok: false, corto: true, testo: 'Corto circuito: la pila è chiusa su un filo senza resistenza.' };
    const gruppi = { spenta: [], poca: [], troppa: [] };
    Object.keys(L.obiettivi).forEach(id => {
      const P = ris.lampade[id].P, t = L.obiettivi[id];
      if (vicino(P, t)) return;
      gruppi[P < 0.005 ? 'spenta' : (P > t ? 'troppa' : 'poca')].push(id);
    });
    const parti = [];
    if (gruppi.troppa.length) parti.push(elenco(gruppi.troppa) + ': troppa luce.');
    if (gruppi.poca.length) parti.push(elenco(gruppi.poca) + ': poca luce.');
    if (gruppi.spenta.length) parti.push(elenco(gruppi.spenta) + (gruppi.spenta.length > 1 ? ': spente.' : ': spenta.'));
    if (!parti.length) return { ok: true, testo: Object.keys(L.obiettivi).length > 1 ? 'Tutte giuste.' : 'Luce giusta.' };
    return { ok: false, testo: parti.join(' ') };
  }

  /* ---------------- livelli ----------------
     Le soluzioni sono state disegnate e accese dalla prova dei livelli (scratchpad: lab-circuiti-livelli.js). */
  const pila = (id, e, E, piu) => ({ id, tipo: 'pila', e, E, piu: piu || 0 });
  const lamp = (id, e, R) => ({ id, tipo: 'lamp', e, R });
  const quasi = (a, b) => Math.abs(a - b) <= 0.05 * b;
  const LIVELLI = [
    { consegna: 'Collega pila e lampadina con i fili, poi accendi.', griglia: [5, 4],
      comp: [pila('P1', [1, 1, 'v'], 6), lamp('A', [3, 1, 'v'], 12)], obiettivi: { A: 3 } },
    { consegna: 'Tutte e due accese, ma con un quarto della luce piena.', griglia: [7, 6],
      comp: [pila('P1', [1, 2, 'v'], 6), lamp('A', [3, 2, 'v'], 12), lamp('B', [5, 2, 'v'], 12)], obiettivi: { A: 0.75, B: 0.75 },
      errori: [{ se: P => quasi(P.A, 3) && quasi(P.B, 3), k: 'par', testo: 'Così ognuna ha tutti i 6\u00a0V. Per un quarto della potenza serve metà corrente: P = R·I².' }] },
    { consegna: 'Le stesse lampadine: ora tutte e due con la luce piena.', griglia: [7, 6],
      comp: [pila('P1', [1, 2, 'v'], 6), lamp('A', [3, 2, 'v'], 12), lamp('B', [5, 2, 'v'], 12)], obiettivi: { A: 3, B: 3 },
      errori: [{ se: P => quasi(P.A, 0.75) && quasi(P.B, 0.75), k: 'serie', testo: 'Una dopo l\'altra si dividono i 6\u00a0V: metà corrente, un quarto della potenza. Ognuna vuole tutta la tensione.' }] },
    { consegna: 'Due lampadine diverse e una pila da 9&nbsp;V.', griglia: [7, 6],
      comp: [pila('P1', [1, 2, 'v'], 9), lamp('A', [3, 2, 'v'], 6), lamp('B', [5, 2, 'v'], 12)], obiettivi: { A: 1.5, B: 3 },
      errori: [{ se: P => P.A > P.B * 1.5, k: 'par', testo: 'Con la stessa tensione brilla di più la resistenza piccola (P = V²/R). Con la stessa corrente, invece, conta R·I².' }] },
    { consegna: 'Tre lampadine e una pila: C piena, A e B deboli.', griglia: [7, 6],
      comp: [pila('P1', [1, 2, 'v'], 6), lamp('A', [3, 1, 'v'], 12), lamp('B', [3, 3, 'v'], 12), lamp('C', [5, 2, 'v'], 12)], obiettivi: { A: 0.75, B: 0.75, C: 3 },
      errori: [{ se: P => quasi(P.A, 3) && quasi(P.B, 3), k: 'tutte', testo: 'A e B hanno tutti i 6\u00a0V. Per 0,75\u00a0W ne bastano 3: devono dividersi la tensione.' }] },
    { consegna: 'Due pile da 3&nbsp;V per una lampadina da 12&nbsp;Ω.', griglia: [7, 6],
      comp: [pila('P1', [1, 1, 'v'], 3, 1), pila('P2', [1, 3, 'v'], 3), lamp('A', [4, 2, 'v'], 12)], obiettivi: { A: 3 },
      errori: [{ se: P => quasi(P.A, 0.75), k: 'affiancate', testo: 'A ha 3\u00a0V: è la tensione di una pila sola, o di due affiancate.' }] },
    { consegna: 'Due pile, tre lampadine: A con quattro volte la luce piena.', griglia: [7, 6],
      comp: [pila('P1', [1, 1, 'v'], 6), pila('P2', [1, 3, 'v'], 6), lamp('A', [5, 2, 'v'], 12), lamp('B', [3, 1, 'v'], 12), lamp('C', [3, 3, 'v'], 12)], obiettivi: { A: 12, B: 3, C: 3 },
      errori: [{ se: P => quasi(P.A, 3), k: 'sei', testo: 'A ha 6\u00a0V. Con 12\u00a0Ω, 12\u00a0W vogliono 12\u00a0V: le tensioni delle pile si sommano solo una dopo l\'altra.' }] },
    { consegna: 'Quattro lampadine e una pila sola.', griglia: [7, 6],
      comp: [pila('P1', [1, 2, 'v'], 6), lamp('A', [5, 2, 'v'], 12), lamp('B', [3, 1, 'v'], 12), lamp('C', [3, 3, 'v'], 12), lamp('D', [4, 3, 'v'], 12)], obiettivi: { A: 3, B: 4 / 3, C: 1 / 3, D: 1 / 3 },
      errori: [{ se: P => quasi(P.B, 0.75), k: 'cd', testo: 'B ha 3\u00a0V, come se C e D insieme valessero 12\u00a0Ω. Due da 12\u00a0Ω in parallelo fanno 6\u00a0Ω.' }] }
  ];
  const LIBERO = { griglia: [7, 6], comp: [pila('P1', [1, 2, 'v'], 6), lamp('A', [3, 2, 'v'], 12), lamp('B', [5, 2, 'v'], 12)] };
  const POSTI = { pila: [[1, 2, 'v'], [1, 4, 'v'], [1, 0, 'v'], [0, 2, 'v']], lamp: [[3, 2, 'v'], [5, 2, 'v'], [3, 4, 'v'], [5, 4, 'v'], [3, 0, 'v'], [5, 0, 'v']] };
  const VALORI_E = [1.5, 3, 4.5, 6, 9, 12], VALORI_R = [3, 6, 12, 24, 48];

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    '6\u00a0V su 12\u00a0Ω fanno passare 0,5\u00a0A: P = 6\u00a0V · 0,5\u00a0A = 3\u00a0W.',
    'Brillano uguali: la corrente che esce da una lampadina entra tutta nell\'altra. Non si consuma.',
    'In parallelo ognuna ha tutti i 6\u00a0V e brilla come da sola; la pila però dà il doppio della corrente.',
    'Stessa corrente, 0,5\u00a0A: con P = R·I² brilla di più la lampadina con la resistenza più grande.',
    'C ha tutti i 6\u00a0V; A e B se li dividono, 3\u00a0V ciascuna, e hanno un quarto della potenza.',
    'Una dopo l\'altra, il + di una contro il − dell\'altra: 3\u00a0V + 3\u00a0V = 6\u00a0V.',
    'Tensione doppia, potenza quattro volte: P = V² / R.',
    'C e D insieme valgono 6\u00a0Ω: con B fanno 18\u00a0Ω, e il terzo di ampere si divide a metà fra C e D.'
  ];

  const AIUTO = 'Trascina il dito da un punto all\'altro della griglia per stendere un filo; tocca un filo per toglierlo. Pile e lampadine si spostano trascinandole, e una pila si gira toccandola. Poi premi Accendi. Fili e pile non hanno resistenza; ogni lampadina è una resistenza fissa (scritta accanto, come la tensione ℰ di ogni pila) e brilla secondo la potenza P = V·I = R·I². La luce piena, 3\u00a0W, è quella di una lampadina da 12\u00a0Ω su 6\u00a0V. Il livello è superato se ogni lampadina è entro il 5\u00a0% della potenza richiesta. I puntini viola sono la corrente, nel verso convenzionale: escono dal + della pila. Tocca una lampadina per leggerne i conti nella formula.';
  const AIUTI = {
    1: ' In serie la corrente è la stessa nelle due lampadine; in parallelo è la stessa la tensione.',
    2: ' In serie la corrente è la stessa nelle due lampadine; in parallelo è la stessa la tensione.',
    3: ' P = R·I² oppure P = V²/R: quale delle due conviene dipende da che cosa le lampadine hanno in comune.',
    4: ' Con 12\u00a0Ω, 3\u00a0W vogliono 6\u00a0V e 0,75\u00a0W ne vogliono 3.',
    5: ' Tocca una pila per girarla. Lungo un giro le tensioni delle pile si sommano, ciascuna con il suo segno.',
    6: ' Con 12\u00a0Ω, 3\u00a0W vogliono 6\u00a0V e 12\u00a0W ne vogliono 12.',
    7: ' Due lampadine da 12\u00a0Ω in parallelo equivalgono a 6\u00a0Ω. Prova a calcolare la corrente di B prima di accendere.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da indovinare: scegli quante pile e quante lampadine, la tensione ℰ delle pile e la resistenza della lampadina che hai toccato, poi collega i fili come vuoi. Da acceso il circuito si ricalcola a ogni filo. «Ricomincia» toglie tutti i fili.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  /* decimali fissi per grandezza, senza togliere gli zeri finali: R intere, ℰ a passi di 1,5 V (un decimale nel Libero),
     P con due decimali (3,00 · 0,75 · 1,33), I con tre, V con due; niente «−0» */
  function corto(v, d) { const s = num(v, d); return /^−0(,0+)?$/.test(s) ? s.slice(1) : s; }
  function texN(v, d) { return corto(v, d).replace(',', '{,}').replace('−', '-'); }

  const NS = 'http://www.w3.org/2000/svg';
  const crea = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const copia = st => ({ griglia: st.griglia.slice(), comp: st.comp.map(c => Object.assign({}, c, { e: c.e.slice() })), fili: Object.assign({}, st.fili) });

  QUANTO.registraLab({
    id: 'circuiti',
    fisica: { risolvi, verdetto, LIVELLI, chiave, capi },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-circuiti')) { const s = document.createElement('style'); s.id = 'stile-lab-circuiti'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-circuiti');
      const piu = (k, cosa) => '<button type="button" class="btn piccolo" data-d="-1" aria-label="' + cosa + ' meno">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="' + cosa + ' più">+</button>';
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: pile e lampadine le scegli tu, nessun obiettivo">Libero</button></div>
            <div class="consegna"></div>
            <div class="richieste" aria-live="polite"></div>
            <div class="lab-parametri" hidden>
              <div class="lab-param" data-p="np"><span class="nome" title="numero di pile">🔋</span>${piu('np', 'pile')}</div>
              <div class="lab-param" data-p="E"><span class="nome">${ctx.tex('\\mathcal{E}')}</span>${piu('E', 'tensione')}</div>
              <div class="lab-param" data-p="nl"><span class="nome" title="numero di lampadine">💡</span>${piu('nl', 'lampadine')}</div>
              <div class="lab-param" data-p="R"><span class="nome"></span>${piu('R', 'resistenza')}</div>
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
      const consegnaEl = q('.consegna'), richiesteEl = q('.richieste'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { accendi: q('.b-accendi'), ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };

      /* ---------------- stato ---------------- */
      let livello = 0, st = null, prove = 0, finito = false, acceso = false, ris = null, sel = null, detti = {};
      let libero = false, salvato = null, liberoSt = null, gesto = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const modificabile = () => libero || !finito;
      const luce = P => Math.min(2.2, Math.sqrt(Math.max(0, P) / P_PIENA));   /* 1 = luce piena (3 W) */

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = crea('svg', { role: 'img', 'aria-label': 'Una basetta a griglia con pile, lampadine e fili', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const defs = crea('defs'), grad = crea('radialGradient', { id: 'lab-circuiti-alone' });
      grad.appendChild(crea('stop', { offset: '0', 'stop-color': '#ffe066', 'stop-opacity': '.95' }));
      grad.appendChild(crea('stop', { offset: '.45', 'stop-color': '#ffc933', 'stop-opacity': '.42' }));
      grad.appendChild(crea('stop', { offset: '1', 'stop-color': '#ffb020', 'stop-opacity': '0' }));
      defs.appendChild(grad); svg.appendChild(defs);
      const gTavola = crea('g'), gFili = crea('g'), gFlusso = crea('g'), gComp = crea('g'), gTesti = crea('g'), gSopra = crea('g');
      [gTavola, gFili, gFlusso, gComp, gTesti, gSopra].forEach(g => svg.appendChild(g));

      /* geometria: U = px fra due punti della griglia; (ox, oy) = dove sta il punto (0, 0); sp = spessore dei fili */
      let S = { w: 300, h: 300, U: 50, ox: 25, oy: 25, sp: 4 };
      const PX = x => S.ox + x * S.U, PY = y => S.oy + y * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const nx = st.griglia[0], ny = st.griglia[1];
        const U = Math.min(120, w / (nx - 1 + 1.1), h / (ny - 1 + 1.3));
        S = { w, h, U, ox: (w - (nx - 1) * U) / 2, oy: (h - (ny - 1) * U) / 2, sp: morsa(U * 0.085, 3.5, 9) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      /* un lato della griglia in pixel: capi a e b, punto medio m, direzione d, normale n (in su per i lati orizzontali, a destra per i verticali) */
      function geoLato(e) {
        const c = capi(e), a = [PX(c[0][0]), PY(c[0][1])], bq = [PX(c[1][0]), PY(c[1][1])];
        return { a, b: bq, m: [(a[0] + bq[0]) / 2, (a[1] + bq[1]) / 2], d: e[2] === 'h' ? [1, 0] : [0, 1], n: e[2] === 'h' ? [0, -1] : [1, 0] };
      }
      const compSu = k => { for (let i = 0; i < st.comp.length; i++) if (chiave(st.comp[i].e) === k) return st.comp[i]; return null; };
      const lampada = id => { for (let i = 0; i < st.comp.length; i++) if (st.comp[i].id === id && st.comp[i].tipo === 'lamp') return st.comp[i]; return null; };
      const dentro = e => e[0] >= 0 && e[1] >= 0 && (e[2] === 'h' ? e[0] < st.griglia[0] - 1 && e[1] < st.griglia[1] : e[0] < st.griglia[0] && e[1] < st.griglia[1] - 1);
      /* da che parte del lato va la scritta: nel quadretto accanto, dove non c'è un altro componente */
      function latoScritta(e) {
        const v = e[2] === 'v', avanti = v ? [e[0] + 1, e[1], 'v'] : [e[0], e[1] - 1, 'h'], indietro = v ? [e[0] - 1, e[1], 'v'] : [e[0], e[1] + 1, 'h'];
        const okA = (v ? e[0] < st.griglia[0] - 1 : e[1] > 0) && !compSu(chiave(avanti));
        const okI = (v ? e[0] > 0 : e[1] < st.griglia[1] - 1) && !compSu(chiave(indietro));
        return okA || !okI ? 1 : -1;
      }

      function disegnaTavola() {
        vuota(gTavola);
        const nx = st.griglia[0], ny = st.griglia[1], U = S.U;
        gTavola.appendChild(crea('rect', { x: PX(0) - 0.42 * U, y: PY(0) - 0.42 * U, width: (nx - 1 + 0.84) * U, height: (ny - 1 + 0.84) * U, rx: 0.22 * U, fill: 'var(--sup)', stroke: 'var(--bordo)', 'stroke-width': 1.5 }));
        for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) gTavola.appendChild(crea('circle', { cx: PX(x), cy: PY(y), r: morsa(U * 0.055, 2.5, 5), fill: 'var(--bordo2)', 'data-n': x + ',' + y }));
      }

      /* i fili (grigi); un pallino pieno nei nodi dove si incontrano tre o più rami; rossi quelli del corto circuito */
      function disegnaFili() {
        vuota(gFili);
        const grado = {}, conta = p => { const k = p[0] + ',' + p[1]; grado[k] = (grado[k] || 0) + 1; };
        const forte = {};
        if (acceso && ris && ris.corto) ris.rami.forEach(r => { if (r.tipo === 'filo' && Math.abs(r.I) > I_CORTO) forte[r.k] = true; });
        Object.keys(st.fili).forEach(k => {
          const e = daChiave(k), L = geoLato(e), cc = capi(e);
          gFili.appendChild(crea('line', { x1: L.a[0], y1: L.a[1], x2: L.b[0], y2: L.b[1], stroke: forte[k] ? 'var(--no)' : 'var(--testo2)', 'stroke-width': S.sp, 'stroke-linecap': 'round', 'data-k': k }));
          conta(cc[0]); conta(cc[1]);
        });
        st.comp.forEach(c => { const cc = capi(c.e); conta(cc[0]); conta(cc[1]); });
        Object.keys(grado).forEach(k => {
          if (grado[k] < 3) return;
          const p = k.split(',');
          gFili.appendChild(crea('circle', { cx: PX(+p[0]), cy: PY(+p[1]), r: S.sp * 1.2, fill: 'var(--testo2)' }));
        });
        /* al primo livello, finché non c'è nessun filo, una riga sotto la basetta dice come si stende */
        if (!libero && livello === 0 && !Object.keys(st.fili).length) {
          const fs = morsa(S.U * 0.2, 12, 16);
          gFili.appendChild(crea('text', { x: S.w / 2, y: (PY(st.griglia[1] - 1) + 0.42 * S.U + fs * 1.6).toFixed(1), 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: ' + fs.toFixed(1) + 'px var(--font)' }, 'Trascina il dito da un punto all\'altro: è un filo.'));
        }
      }

      /* pile e lampadine. La lampadina è il simbolo dei circuiti (un cerchio con la croce) che si accende davvero:
         alone e colore crescono con la radice di P / 3 W. La pila: piastra lunga = +, corta = −. */
      function disegnaComp() {
        vuota(gComp); vuota(gTesti);
        st.comp.forEach(c => {
          const via = gesto && gesto.tipo === 'comp' && gesto.mosso && gesto.c === c;
          disegnaUno(c, c.e, gComp, via ? 0.25 : 1, !via);
        });
      }
      function disegnaUno(c, e, g, opac, conTesti, centro) {
        const L = geoLato(e), U = S.U, m = centro || L.m;
        const gr = crea('g', { transform: 'translate(' + m[0].toFixed(1) + ',' + m[1].toFixed(1) + ') rotate(' + (e[2] === 'v' ? 90 : 0) + ')', opacity: opac, 'data-comp': c.id });
        const tratto = (x1, x2) => gr.appendChild(crea('line', { x1, y1: 0, x2, y2: 0, stroke: 'var(--testo2)', 'stroke-width': S.sp, 'stroke-linecap': 'round' }));
        const dati = acceso && ris && conTesti ? (c.tipo === 'lamp' ? ris.lampade[c.id] : ris.pile[c.id]) : null;
        if (c.tipo === 'lamp') {
          const r = U * 0.25, s = dati ? luce(dati.P) : 0, k = r * 0.68;
          tratto(-U / 2, -r); tratto(r, U / 2);
          if (s > 0.03) gr.appendChild(crea('circle', { r: r * (1.3 + 1.5 * s), fill: 'url(#lab-circuiti-alone)', opacity: morsa(0.3 + 0.55 * s, 0, 1).toFixed(2) }));
          gr.appendChild(crea('circle', { r, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 2 }));
          if (s > 0.03) gr.appendChild(crea('circle', { r: r - 1, fill: s > 1.3 ? '#fff4c2' : '#ffd23f', opacity: morsa(s, 0.15, 1).toFixed(2) }));
          const fil = s > 0.03 ? '#c8650a' : 'var(--testo2)';
          gr.appendChild(crea('line', { x1: -k, y1: -k, x2: k, y2: k, stroke: fil, 'stroke-width': 2, 'stroke-linecap': 'round' }));
          gr.appendChild(crea('line', { x1: -k, y1: k, x2: k, y2: -k, stroke: fil, 'stroke-width': 2, 'stroke-linecap': 'round' }));
          if (sel === c.id && conTesti) gr.appendChild(crea('circle', { r: r + 5, fill: 'none', stroke: 'var(--accento)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
        } else {
          const gg = U * 0.09, sg = c.piu ? 1 : -1, caldo = dati && dati.corto;
          gr.appendChild(crea('rect', { x: -U * 0.3, y: -U * 0.3, width: U * 0.6, height: U * 0.6, rx: U * 0.1, fill: caldo ? 'var(--no)' : 'var(--sup3)', 'fill-opacity': caldo ? 0.45 : 1, stroke: 'var(--bordo2)', 'stroke-width': 1.2 }));
          tratto(-U / 2, -gg); tratto(gg, U / 2);
          gr.appendChild(crea('line', { x1: sg * gg, y1: -U * 0.23, x2: sg * gg, y2: U * 0.23, stroke: 'var(--testo)', 'stroke-width': 3 }));
          gr.appendChild(crea('line', { x1: -sg * gg, y1: -U * 0.12, x2: -sg * gg, y2: U * 0.12, stroke: 'var(--testo)', 'stroke-width': 5.5 }));
        }
        g.appendChild(gr);
        if (conTesti) scritte(c, e, dati);
      }
      /* le scritte non ruotano mai: nome e resistenza della lampadina (e la potenza, da accesa); ℰ della pila (e la sua corrente) */
      function scritte(c, e, dati) {
        const L = geoLato(e), lato = latoScritta(e), U = S.U;
        /* la scritta di una pila verticale parte subito accanto al suo riquadro; le altre stanno al centro del quadretto */
        const fianco = c.tipo === 'pila' && e[2] === 'v', anc = fianco ? (lato > 0 ? 'start' : 'end') : 'middle';
        const cx = L.m[0] + L.n[0] * lato * (fianco ? 0.35 : 0.5) * U, cy = L.m[1] + L.n[1] * lato * 0.5 * U;
        const righe = [], f1 = morsa(U * 0.24, 14, 19).toFixed(1), f2 = morsa(U * 0.2, 12, 16);   /* le scritte crescono con la griglia */
        if (c.tipo === 'lamp') {
          righe.push([[c.id, 'font: 700 ' + f1 + 'px var(--font)', 'var(--testo)'], [' ' + corto(c.R, 0) + '\u00a0Ω', 'font: ' + f2.toFixed(1) + 'px var(--font)', 'var(--testo2)']]);
          if (dati) righe.push([[corto(dati.P, 2) + '\u00a0W', 'font: 700 ' + f2.toFixed(1) + 'px var(--font)', 'var(--s3)']]);
        } else {
          righe.push([['ℰ = ' + corto(c.E, libero ? 1 : 0) + '\u00a0V', 'font: 600 ' + f2.toFixed(1) + 'px var(--font)', 'var(--s2)']]);
          if (dati) righe.push([[dati.corto ? 'corto!' : corto(Math.abs(dati.I), 3) + '\u00a0A', 'font: 700 ' + f2.toFixed(1) + 'px var(--font)', dati.corto ? 'var(--no)' : 'var(--s4)']]);
        }
        const hr = f2 * 1.25, y0 = cy - (righe.length - 1) * hr / 2 + f2 * 0.37, fatti = [];
        righe.forEach((rg, i) => {
          const t = crea('text', { x: cx.toFixed(1), y: (y0 + i * hr).toFixed(1), 'text-anchor': anc, 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
          rg.forEach(p => t.appendChild(crea('tspan', { style: p[1], fill: p[2] }, p[0])));
          gTesti.appendChild(t); fatti.push(t);
        });
        if (c.tipo === 'lamp') {   /* la scritta non tocca il cerchio della lampadina (raggio U/4): se serve, si scosta */
          let vicino = Infinity;
          fatti.forEach(t => { let bb; try { bb = t.getBBox(); } catch (er) { return; }
            const da = L.n[0] ? (lato > 0 ? bb.x - L.m[0] : L.m[0] - bb.x - bb.width) : (lato > 0 ? L.m[1] - bb.y - bb.height : bb.y - L.m[1]);
            vicino = Math.min(vicino, da); });
          const manca = U * 0.25 + 6 - vicino;
          if (manca > 0 && isFinite(manca)) fatti.forEach(t => {
            t.setAttribute('x', (+t.getAttribute('x') + L.n[0] * lato * manca).toFixed(1));
            t.setAttribute('y', (+t.getAttribute('y') + L.n[1] * lato * manca).toFixed(1));
          });
        }
        if (c.tipo === 'pila') {   /* i segni + e − dalla parte opposta alla scritta */
          const sg = c.piu ? 1 : -1, off = -lato * 0.42 * U;
          [[sg, '+'], [-sg, '−']].forEach(z => {
            const x = L.m[0] + L.d[0] * z[0] * 0.24 * U + L.n[0] * off, y = L.m[1] + L.d[1] * z[0] * 0.24 * U + L.n[1] * off;
            gTesti.appendChild(crea('text', { x: x.toFixed(1), y: (y + f2 * 0.4).toFixed(1), 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 700 ' + (f2 * 1.25).toFixed(1) + 'px var(--font)' }, z[1]));
          });
        }
      }

      /* la corrente: puntini viola che scorrono nel verso convenzionale, con velocità proporzionale a I.
         Tutti i lati sono lunghi U e i puntini distano U/2: con la stessa corrente passano da un lato all'altro senza salti. */
      let raf = 0, puntini = [], inizioFlusso = 0;
      const DURATA_FLUSSO = 12000;   /* poi i puntini si fermano dove sono: niente animazione infinita a laboratorio fermo */
      function preparaFlusso() {
        vuota(gFlusso); puntini = [];
        if (!acceso || !ris || ris.corto) return;
        const nx = st.griglia[0], r = morsa(S.U * 0.055, 2.5, 5);
        const pos = i => [PX(i % nx), PY(Math.floor(i / nx))];
        ris.rami.forEach(rm => {
          if (Math.abs(rm.I) < 2e-3) return;
          const pa = pos(rm.a), pb = pos(rm.b), p0 = rm.I > 0 ? pa : pb, p1 = rm.I > 0 ? pb : pa;
          const v = Math.min(3, 1.6 * Math.abs(rm.I)) * S.U;
          for (let k = 0; k < 2; k++) { const c = crea('circle', { r, fill: 'var(--s4)' }); gFlusso.appendChild(c); puntini.push({ c, p0, p1, v, k }); }
        });
      }
      function scorri(ora) {
        const t = ora / 1000;
        puntini.forEach(p => {
          const s = ((t * p.v + p.k * S.U / 2) % S.U) / S.U;
          p.c.setAttribute('cx', (p.p0[0] + (p.p1[0] - p.p0[0]) * s).toFixed(1));
          p.c.setAttribute('cy', (p.p0[1] + (p.p1[1] - p.p0[1]) * s).toFixed(1));
        });
        raf = ora - inizioFlusso < DURATA_FLUSSO ? requestAnimationFrame(scorri) : 0;
      }
      function fermaFlusso() { cancelAnimationFrame(raf); raf = 0; vuota(gFlusso); puntini = []; }
      function avviaFlusso() { fermaFlusso(); preparaFlusso(); if (puntini.length) { inizioFlusso = performance.now(); scorri(inizioFlusso); } }

      function ridisegna() { disegnaFili(); disegnaComp(); if (acceso) avviaFlusso(); else fermaFlusso(); }
      function ridisegnaTutto() { geometria(); disegnaTavola(); ridisegna(); }

      /* ---------------- pannello ---------------- */
      function aggiornaRichieste() {
        if (libero) { richiesteEl.innerHTML = ''; return; }
        const L = LIVELLI[livello];
        richiesteEl.innerHTML = Object.keys(L.obiettivi).map(id => {
          const t = L.obiettivi[id];
          let cls = 'chip', mis = ' <span class="mis"></span>';   /* la casella della misura c'è anche a circuito spento: accendere non allarga i gettoni */
          if (acceso && ris && !ris.corto) {
            const P = ris.lampade[id].P, ok = vicino(P, t);
            cls += ok ? ' ok' : ' no';
            mis = ok ? ' <span class="mis">✓</span>' : ' <span class="mis">ora ' + corto(P, 2) + '&nbsp;W</span>';
          }
          return '<span class="' + cls + '" data-id="' + id + '"><i class="lamp" style="background: rgba(255, 196, 30, ' + morsa(luce(t), 0.1, 1).toFixed(2) + ')"></i><b>' + id + '</b> ' + corto(t, 2) + '&nbsp;W' + mis + '</span>';
        }).join('');
      }
      /* il ponte con la teoria: P = V·I = R·I² per la lampadina toccata; i numeri solo da acceso */
      /* la formula ha un'altezza fissa: se un caso non ci sta, si rimpicciolisce invece di spingere il resto */
      function adattaFormula() {
        formulaEl.style.fontSize = '';
        const f0 = parseFloat(getComputedStyle(formulaEl).fontSize);
        let f = f0;
        while ((formulaEl.scrollHeight > formulaEl.clientHeight + 1 || formulaEl.scrollWidth > formulaEl.clientWidth + 1) && f > f0 * 0.7) { f *= 0.93; formulaEl.style.fontSize = f.toFixed(2) + 'px'; }
      }
      function aggiornaFormula() {
        const c = lampada(sel) || st.comp.filter(x => x.tipo === 'lamp')[0];
        if (!c) { formulaEl.innerHTML = ''; adattaFormula(); return; }
        sel = c.id;
        const nome = 'P_{\\mathrm{' + c.id + '}}', R = texN(c.R, 0) + '\\,\\Omega';
        const gI = s => '\\htmlClass{gI}{' + s + '}', gV = s => '\\htmlClass{gV}{' + s + '}';
        const numerico = (n, s) => '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(n) + ' </span>' + ctx.tex(s) + '</span>';
        const pezzi = ['<span class="pezzo simbolo">' + ctx.tex(nome + ' = ' + gV('V') + ' \\cdot ' + gI('I') + ' = R \\cdot ' + gI('I') + '^2') + '</span>'];
        const d = acceso && ris ? ris.lampade[c.id] : null;
        if (d && ris.corto) pezzi.push('<span class="pezzo avviso">corto circuito</span>');
        else if (d) {
          const Is = texN(d.I, 3) + '\\,\\text{A}', Vs = texN(d.V, 2) + '\\,\\text{V}';
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('= ' + gV(Vs) + ' \\cdot ' + gI(Is)) + '</span>');
          pezzi.push(numerico(nome, '= ' + R + ' \\cdot (' + gI(Is) + ')^2'));
          pezzi.push('<span class="pezzo esito">' + ctx.tex('\\approx ' + texN(d.P, 2) + '\\,\\text{W}') + '</span>');
        } else {
          pezzi.push(numerico(nome, '= ' + R + ' \\cdot ' + gI('I') + '^2'));
          pezzi.push('<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>');
        }
        formulaEl.innerHTML = pezzi.join(''); adattaFormula();
      }
      const box = { np: q('[data-p="np"]'), E: q('[data-p="E"]'), nl: q('[data-p="nl"]'), R: q('[data-p="R"]') };
      function aggiornaParametri() {
        if (!libero) return;
        const pile = st.comp.filter(c => c.tipo === 'pila'), lamp = st.comp.filter(c => c.tipo === 'lamp'), c = lampada(sel) || lamp[0];
        box.np.querySelector('output').textContent = pile.length;
        box.E.querySelector('output').textContent = corto(pile[0].E, libero ? 1 : 0) + '\u00a0V';
        box.nl.querySelector('output').textContent = lamp.length;
        box.R.querySelector('output').textContent = corto(c.R, 0) + '\u00a0Ω';
        box.R.querySelector('.nome').innerHTML = ctx.tex('R_{\\mathrm{' + c.id + '}}');
        const lim = { np: [pile.length <= 1, pile.length >= 3], nl: [lamp.length <= 1, lamp.length >= 4], E: [pile[0].E <= VALORI_E[0], pile[0].E >= VALORI_E[VALORI_E.length - 1]], R: [c.R <= VALORI_R[0], c.R >= VALORI_R[VALORI_R.length - 1]] };
        Object.keys(box).forEach(k => box[k].querySelectorAll('button').forEach(bt => { bt.disabled = lim[k][+bt.dataset.d > 0 ? 1 : 0]; }));
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = k > sblocco && k !== livello;
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
      }
      function aggiornaPannello() {
        aggiornaRichieste(); aggiornaFormula(); aggiornaParametri(); aggiornaLivelli();
        contaEl.textContent = libero ? '' : 'accensioni: ' + prove;
        b.accendi.textContent = acceso ? 'Spegni' : '⚡ Accendi';
        b.accendi.disabled = !libero && finito;
      }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        fermaFlusso(); libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        st = { griglia: L.griglia.slice(), comp: L.comp.map(c => Object.assign({}, c, { e: c.e.slice() })), fili: {} };
        prove = 0; finito = false; acceso = false; ris = null; detti = {}; gesto = null;
        sel = st.comp.filter(c => c.tipo === 'lamp')[0].id;
        aiutoEl.hidden = true; vuota(gSopra);
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiornaPannello();
      }

      /* ---------------- accendere ---------------- */
      function accendi() {
        if (gesto || (!libero && finito)) return;
        aiutoEl.hidden = true;
        if (acceso) {   /* spegnere */
          acceso = false; ris = null;
          if (libero || msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
          ridisegna(); aggiornaPannello(); return;
        }
        ris = risolvi(st); acceso = true;
        ridisegna();
        if (libero) { msg.textContent = osserva(ris); msg.className = 'lab-messaggio'; aggiornaPannello(); return; }
        prove++;
        const L = LIVELLI[livello], v = verdetto(L, ris);
        aggiornaPannello();
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L);
      }
      function vinci(testo) {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + testo + (prove === 1 ? ' Al primo colpo.' : ' Accensioni: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello);
        ctx.zenone(VITTORIE[livello], { espressione: prove === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
        aggiornaPannello();
      }
      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(k, testo) {
        if (detti[k]) return; detti[k] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L) {
        if (ris.corto) { dici('corto', 'Un filo dal + al − senza niente in mezzo è un corto circuito: la corrente passa tutta lì, enorme.'); return; }
        const P = {}; Object.keys(ris.lampade).forEach(k => { P[k] = ris.lampade[k].P; });
        const ids = Object.keys(L.obiettivi), accese = ids.filter(i => P[i] > 0.005);
        if (!accese.length) {
          if (ris.chiuse.length && st.comp.filter(c => c.tipo === 'pila').length > 1) dici('contro', 'Le pile si spingono una contro l\'altra: lungo il giro le loro tensioni si annullano.');
          else dici('aperto', 'La corrente passa solo in un giro chiuso: dal + della pila, attraverso le lampadine, fino al −.');
          return;
        }
        const sc = ids.filter(i => ris.scavalcate.indexOf(i) >= 0);
        if (sc.length) { dici('scav', 'La lampadina ' + sc[0] + ' ha i due capi uniti da un filo: la corrente passa tutta nel filo, che non ha resistenza.'); return; }
        (L.errori || []).some(e => { if (!e.se(P)) return false; dici(e.k, e.testo); return true; });
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva(r) {
        if (r.corto) return 'Corto circuito: la corrente passa tutta nel filo senza resistenza.';
        const pile = st.comp.filter(c => c.tipo === 'pila'), Is = pile.map(c => Math.abs(r.pile[c.id].I));
        if (Is.every(i => i < 1e-3)) return 'Nessuna corrente: manca un giro chiuso con una pila.';
        if (pile.length === 1) return 'La pila dà ' + corto(Is[0], 3) + '\u00a0A: il circuito equivale a ' + corto(pile[0].E / Is[0], 1) + '\u00a0Ω.';
        return 'Corrente nelle pile: ' + Is.map(i => corto(i, 3) + '\u00a0A').join(', ') + '.';
      }
      function mostraLibero() { parametriEl.hidden = !libero; radice.classList.toggle('in-libero', libero); }
      function entraLibero() {
        if (gesto) return;
        salvato = { livello, st: copia(st), prove, finito, acceso, detti: Object.assign({}, detti), sel, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        st = liberoSt ? copia(liberoSt) : { griglia: LIBERO.griglia.slice(), comp: LIBERO.comp.map(c => Object.assign({}, c, { e: c.e.slice() })), fili: {} };
        finito = false; sel = null; acceso = true; ris = risolvi(st);   /* in libero il circuito è acceso e si ricalcola a ogni filo */
        consegnaEl.textContent = '';
        msg.textContent = osserva(ris); msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiornaPannello();
      }
      function esciLibero() {   /* si torna al livello com'era */
        if (gesto) return;
        liberoSt = copia(st);
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; st = z.st; prove = z.prove; finito = z.finito; acceso = z.acceso; detti = z.detti; sel = z.sel;
        ris = acceso ? risolvi(st) : null;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiornaPannello();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function aggiungi(tipo) {
        const vuoto = e => dentro(e) && !compSu(chiave(e)) && !st.fili[chiave(e)];
        let posto = null;
        POSTI[tipo].some(e => { if (vuoto(e)) { posto = e.slice(); return true; } return false; });
        for (let y = 1; !posto && y < st.griglia[1] - 1; y++) for (let x = 1; !posto && x < st.griglia[0] - 1; x++) if (vuoto([x, y, 'v'])) posto = [x, y, 'v'];
        if (!posto) return false;
        if (tipo === 'pila') {
          let n = 1; while (st.comp.some(c => c.id === 'P' + n)) n++;
          st.comp.push(pila('P' + n, posto, st.comp.filter(c => c.tipo === 'pila')[0].E, 0));
        } else {
          const id = 'ABCD'.split('').filter(l => !lampada(l))[0];
          st.comp.push(lamp(id, posto, 12));
        }
        return true;
      }
      function cambiaParam(k, d) {
        if (!libero || gesto) return;
        const pile = st.comp.filter(c => c.tipo === 'pila'), lamp = st.comp.filter(c => c.tipo === 'lamp');
        if (k === 'np' || k === 'nl') {
          const tipo = k === 'np' ? 'pila' : 'lamp', tutti = k === 'np' ? pile : lamp, max = k === 'np' ? 3 : 4;
          if (d > 0 && tutti.length < max) { if (!aggiungi(tipo)) return; }
          else if (d < 0 && tutti.length > 1) { const via = tutti[tutti.length - 1]; st.comp.splice(st.comp.indexOf(via), 1); if (sel === via.id) sel = null; }
          else return;
        } else if (k === 'E') {
          const i = VALORI_E.indexOf(pile[0].E), j = morsa(i + d, 0, VALORI_E.length - 1);
          if (i === j) return;
          pile.forEach(c => { c.E = VALORI_E[j]; });
        } else {
          const c = lampada(sel) || lamp[0], i = VALORI_R.indexOf(c.R), j = morsa(i + d, 0, VALORI_R.length - 1);
          if (i === j) return;
          c.R = VALORI_R[j]; sel = c.id;
        }
        cambiato();
      }
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        cambiaParam(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* dopo ogni modifica del circuito: nei livelli si spegne (si riaccende con Accendi), in libero si ricalcola */
      function cambiato() {
        if (acceso) { if (libero) ris = risolvi(st); else { acceso = false; ris = null; } }
        if (libero) { msg.textContent = acceso ? osserva(ris) : ''; msg.className = 'lab-messaggio'; }
        else if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        ridisegna(); aggiornaPannello();
      }

      /* ---------------- il dito sulla basetta ----------------
         su un componente: trascinare lo sposta, toccarlo gira la pila (o sceglie la lampadina per la formula);
         su un punto della griglia: trascinare stende un filo, di punto in punto; su un filo: toccarlo lo toglie. */
      function punto(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse()); return [c.x, c.y];
      }
      function nodoVicino(c, raggio) {
        const gx = Math.round((c[0] - S.ox) / S.U), gy = Math.round((c[1] - S.oy) / S.U);
        if (gx < 0 || gy < 0 || gx >= st.griglia[0] || gy >= st.griglia[1]) return null;
        return Math.hypot(PX(gx) - c[0], PY(gy) - c[1]) <= raggio * S.U ? [gx, gy] : null;
      }
      function compSotto(c) {
        for (let i = st.comp.length - 1; i >= 0; i--) {
          const L = geoLato(st.comp[i].e), rx = c[0] - L.m[0], ry = c[1] - L.m[1];
          if (Math.abs(rx * L.d[0] + ry * L.d[1]) <= 0.33 * S.U && Math.abs(rx * L.n[0] + ry * L.n[1]) <= 0.34 * S.U) return st.comp[i];
        }
        return null;
      }
      function filoSotto(c) {
        let meglio = null, dm = 0.24 * S.U;
        Object.keys(st.fili).forEach(k => {
          const L = geoLato(daChiave(k)), t = morsa(((c[0] - L.a[0]) * L.d[0] + (c[1] - L.a[1]) * L.d[1]) / S.U, 0, 1);
          const dd = Math.hypot(c[0] - (L.a[0] + L.d[0] * t * S.U), c[1] - (L.a[1] + L.d[1] * t * S.U));
          if (dd < dm) { dm = dd; meglio = k; }
        });
        return meglio;
      }
      const latoFra = (a, bq) => [Math.min(a[0], bq[0]), Math.min(a[1], bq[1]), a[0] === bq[0] ? 'v' : 'h'];
      function segnaNodo(n) {
        vuota(gSopra);
        if (n) gSopra.appendChild(crea('circle', { cx: PX(n[0]), cy: PY(n[1]), r: S.U * 0.2, fill: 'none', stroke: 'var(--accento)', 'stroke-width': 2.5 }));
      }
      /* il filo segue il dito di punto in punto (passi orizzontali e verticali); non attraversa pile e lampadine */
      function stendi(c) {
        const n = nodoVicino(c, 0.42); if (!n) return;
        let cur = gesto.cur, giri = 0, nuovi = false;
        while ((cur[0] !== n[0] || cur[1] !== n[1]) && giri++ < 40) {
          const dx = n[0] - cur[0], dy = n[1] - cur[1];
          const passi = Math.abs(dx) >= Math.abs(dy) ? [[Math.sign(dx), 0], [0, Math.sign(dy)]] : [[0, Math.sign(dy)], [Math.sign(dx), 0]];
          let mosso = false;
          for (let i = 0; i < 2 && !mosso; i++) {
            const p = passi[i]; if (!p[0] && !p[1]) continue;
            const nn = [cur[0] + p[0], cur[1] + p[1]], k = chiave(latoFra(cur, nn));
            if (compSu(k)) continue;
            if (!st.fili[k]) { st.fili[k] = true; nuovi = true; }
            cur = nn; mosso = true;
          }
          if (!mosso) break;
        }
        gesto.cur = cur;
        if (nuovi) cambiato();
        segnaNodo(cur);
      }
      /* spostare un componente: va sul lato libero più vicino al dito (senza fili e senza altri componenti) */
      function candidato(c, comp) {
        let meglio = null, dm = 0.7 * S.U;
        const nx = st.griglia[0], ny = st.griglia[1];
        for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) ['h', 'v'].forEach(o => {
          const e = [x, y, o]; if (!dentro(e)) return;
          const k = chiave(e), altro = compSu(k);
          if ((altro && altro !== comp) || st.fili[k]) return;
          const L = geoLato(e), dd = Math.hypot(L.m[0] - c[0], L.m[1] - c[1]);
          if (dd < dm) { dm = dd; meglio = e; }
        });
        return meglio;
      }
      function trascinaComp(c) {
        gesto.cand = candidato(c, gesto.c);
        vuota(gSopra);
        if (gesto.cand) {
          const L = geoLato(gesto.cand);
          gSopra.appendChild(crea('line', { x1: L.a[0], y1: L.a[1], x2: L.b[0], y2: L.b[1], stroke: 'var(--accento)', 'stroke-width': S.sp * 2.2, 'stroke-linecap': 'round', opacity: .35 }));
          disegnaUno(gesto.c, gesto.cand, gSopra, 0.9, false);
        } else disegnaUno(gesto.c, gesto.c.e, gSopra, 0.6, false, c);
        disegnaComp();
      }

      svg.addEventListener('pointerdown', ev => {
        if (gesto) return;
        const c = punto(ev); if (!c) return;
        aiutoEl.hidden = true;
        const comp = compSotto(c);
        let g = null;
        if (comp) g = { tipo: 'comp', c: comp };
        else if (modificabile()) {
          const n = nodoVicino(c, 0.36);
          if (n) { g = { tipo: 'filo', cur: n }; segnaNodo(n); }
          else { const k = filoSotto(c); if (k) g = { tipo: 'togli', k }; }
        }
        if (!g) return;
        g.inizio = c; g.mosso = false; g.id = ev.pointerId; gesto = g;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        ev.preventDefault();
      });
      const muovi = ev => {
        if (!gesto || ev.pointerId !== gesto.id) return;
        const c = punto(ev); if (!c) return;
        if (Math.hypot(c[0] - gesto.inizio[0], c[1] - gesto.inizio[1]) > 0.18 * S.U) gesto.mosso = true;
        if (gesto.tipo === 'filo') stendi(c);
        else if (gesto.tipo === 'comp' && gesto.mosso && modificabile()) trascinaComp(c);
        ev.preventDefault();
      };
      const molla = ev => {
        if (!gesto || ev.pointerId !== gesto.id) return;
        const g = gesto; gesto = null; vuota(gSopra);
        if (g.tipo === 'comp') {
          if (!g.mosso) {
            if (g.c.tipo === 'lamp') { sel = g.c.id; disegnaComp(); aggiornaFormula(); aggiornaParametri(); }
            else if (modificabile()) { g.c.piu = g.c.piu ? 0 : 1; cambiato(); }
            return;
          }
          if (modificabile() && g.cand && chiave(g.cand) !== chiave(g.c.e)) { g.c.e = g.cand; cambiato(); }
          else disegnaComp();
          return;
        }
        if (g.tipo === 'togli' && !g.mosso) { delete st.fili[g.k]; cambiato(); }
      };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      /* ---------------- comandi ---------------- */
      b.accendi.addEventListener('click', accendi);
      b.ric.addEventListener('click', () => {
        if (gesto) return;
        if (libero) { st.fili = {}; cambiato(); return; }
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
        pl.addEventListener('click', () => { if (!gesto) avviaLivello(k); });
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello);
      let forma = '', ro = null;
      const ridimensiona = () => {
        adattaFormula();
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      };
      if (window.ResizeObserver) { ro = new ResizeObserver(ridimensiona); ro.observe(svg); }
      else window.addEventListener('resize', ridimensiona);

      return function smonta() {
        fermaFlusso();
        if (ro) ro.disconnect(); else window.removeEventListener('resize', ridimensiona);
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
