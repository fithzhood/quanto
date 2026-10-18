/* Laboratorio «Il corridore» — il grafico posizione–tempo (argomento cinematica).
   In alto un grafico s–t da rifare; in basso una pista dritta con un corridore da trascinare.
   Si preme «Via», dopo il conto alla rovescia il tempo scorre davvero (1 s = 1 s) e la corsa disegna la sua linea.
   Il corridore insegue il dito correndo (al massimo VMAX), non si teletrasporta: la sua posizione è continua.
   Vale se la linea resta nella fascia (± TOL) per almeno SOGLIA del tempo. Sulla pista nessun fantasma: il
   grafico va tradotto in movimento. A corsa finita si tocca il grafico per rivedere la corsa istante per istante.
   Contratto in SCHEMA-LAB.md; modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-corridore { -webkit-user-select: none; user-select: none; }
    .lab-corridore .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-corridore .lab-scena > svg { width: 100%; height: 100%; outline: none; }
    .lab-corridore svg text { font-family: var(--font); }
    .lab-corridore .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-corridore .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-corridore .consegna:empty { display: none; }
    .lab-corridore .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .4em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; min-height: 2.5em; }
    .lab-corridore .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-corridore .formula .ignoto { color: var(--testo3); }
    .lab-corridore .formula .esito { color: var(--s1); font-weight: 600; }
    .lab-corridore .formula .quando { color: var(--testo2); font-size: .9em; }
    .lab-corridore .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-corridore.in-libero .lab-messaggio { color: var(--testo2); }
    .lab-corridore .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-corridore .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-corridore .btn[disabled] { opacity: .38; cursor: default; }
    .lab-corridore .lab-parametri { max-width: 520px; }
    .lab-corridore .lab-parametri[hidden] { display: none; }
    .lab-corridore .lab-param .nome { min-width: 0; font-size: .92rem; }
    .lab-corridore .lab-param output { min-width: 2.2em; white-space: nowrap; }
    @container lab (max-width: 420px) { .lab-corridore .lab-param { gap: 2px; } .lab-corridore .lab-parametri { column-gap: 4px; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
    .lab-corridore .vinto { display: inline-block; animation: lab-corridore-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-corridore-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-corridore .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-corridore .formula .simbolo { display: none; } .lab-corridore .formula .nome-stretto { display: inline; } }
  `;

  /* ---------------- fisica e regole (pure: le usa anche la prova dei livelli in node) ---------------- */
  const VMAX = 8;       /* m/s: più veloce di così il corridore non va (insegue il dito, non salta) */
  const TOL = 0.7;      /* m: mezza larghezza della fascia */
  const SOGLIA = 0.8;   /* frazione del tempo da passare nella fascia (e al via si deve essere dentro) */
  const CONTO = 3;      /* s di conto alla rovescia, per mettersi in posizione */
  const PASSO = 0.05;   /* s: passo con cui si confrontano le due linee */

  /* i tratti del grafico: { fino, s } = in linea retta fino alla posizione s all'istante fino;
     { fino, acc, v0 } = moto uniformemente accelerato con accelerazione acc, partendo a velocità v0 */
  function pezzi(L) {
    const out = []; let t = 0, s = L.s0, v = 0;
    L.tratti.forEach(tr => {
      const d = tr.fino - t;
      if (tr.acc != null) {
        const v0 = tr.v0 != null ? tr.v0 : v;
        out.push({ t0: t, t1: tr.fino, s0: s, v0, a: tr.acc });
        s = s + v0 * d + tr.acc * d * d / 2; v = v0 + tr.acc * d;
      } else {
        const v0 = (tr.s - s) / d;
        out.push({ t0: t, t1: tr.fino, s0: s, v0, a: 0 });
        s = tr.s; v = v0;
      }
      t = tr.fino;
    });
    return out;
  }
  const durata = L => L.tratti[L.tratti.length - 1].fino;
  function legge(P, t) {   /* s(t) del grafico da rifare */
    let p = P[P.length - 1];
    for (let i = 0; i < P.length; i++) if (t <= P[i].t1) { p = P[i]; break; }
    const d = Math.min(Math.max(t - p.t0, 0), p.t1 - p.t0);
    return p.s0 + p.v0 * d + p.a * d * d / 2;
  }
  /* la posizione registrata all'istante t (interpolata fra i campioni [t, s]) */
  function interp(c, t) {
    if (!c.length) return 0;
    if (t <= c[0][0]) return c[0][1];
    const n = c.length - 1;
    if (t >= c[n][0]) return c[n][1];
    let a = 0, b = n;
    while (b - a > 1) { const m = (a + b) >> 1; if (c[m][0] <= t) a = m; else b = m; }
    const ta = c[a][0], tb = c[b][0];
    return tb > ta ? c[a][1] + (c[b][1] - c[a][1]) * (t - ta) / (tb - ta) : c[b][1];
  }
  /* quanto tempo la corsa è rimasta nella fascia */
  function valuta(L, c) {
    const P = pezzi(L), T = durata(L), n = Math.round(T / PASSO);
    let dentro = 0;
    for (let i = 0; i <= n; i++) { const t = i * T / n; if (Math.abs(interp(c, t) - legge(P, t)) <= TOL + 1e-9) dentro++; }
    const quota = dentro / (n + 1), alVia = Math.abs(interp(c, 0) - P[0].s0) <= TOL + 1e-9;
    return { quota, alVia, ok: alVia && quota >= SOGLIA };
  }
  /* che cosa è andato storto, nel tratto peggiore: { chiave, dove } (le frasi le scrive il laboratorio) */
  function diagnosi(L, c) {
    const P = pezzi(L);
    const s0u = interp(c, 0);
    if (Math.abs(s0u - P[0].s0) > TOL) return { chiave: 'partenza', s0u };
    /* ogni tratto ha il suo errore medio e il suo tipo di sbaglio; vince lo sbaglio di concetto più grave
       fra i tratti che hanno davvero portato fuori dalla fascia (prima la direzione, poi la forma, poi la pendenza) */
    const ORDINE = ['strada', 'scende', 'sale', 'piatto', 'fermo', 'curva', 'frena', 'pendenza', 'quota', 'tempi'];
    let scelto = null;
    P.forEach(p => {
      let somma = 0, k = 0;
      for (let t = p.t0; t <= p.t1 + 1e-9; t += PASSO) { somma += Math.abs(interp(c, t) - legge(P, t)); k++; }
      const e = somma / k, d = p.t1 - p.t0;
      const vu = (interp(c, p.t1) - interp(c, p.t0)) / d, vt = (legge(P, p.t1) - legge(P, p.t0)) / d;
      const r = { t0: p.t0, t1: p.t1, vu, e };
      if (Math.abs(vt) < 1e-9 && !p.a) r.chiave = Math.abs(vu) > 0.25 ? 'piatto' : 'quota';
      else if (vt < 0 && vu > 0.15) r.chiave = L.strada ? 'strada' : 'scende';
      else if (vt > 0 && vu < -0.15) r.chiave = 'sale';
      else if (Math.abs(vu) <= 0.15) {   /* quasi fermo in media: davvero fermo, o avanti e indietro? */
        let strada = 0, prec = interp(c, p.t0);
        for (let t = p.t0 + PASSO; t <= p.t1 + 1e-9; t += PASSO) { const v = interp(c, t); strada += Math.abs(v - prec); prec = v; }
        if (strada < 0.5) r.chiave = 'fermo'; else { r.chiave = 'pendenza'; r.piano = true; r.indietro = vt < 0; }
      }
      else if (p.a && !(p.a > 0 ? (interp(c, p.t1) - interp(c, p.t0 + d / 2)) > 1.4 * (interp(c, p.t0 + d / 2) - interp(c, p.t0)) + 0.1 * d
                                 : (interp(c, p.t0 + d / 2) - interp(c, p.t0)) > 1.4 * (interp(c, p.t1) - interp(c, p.t0 + d / 2)) + 0.1 * d)) r.chiave = p.a > 0 ? 'curva' : 'frena';
      else if (Math.abs(vu - vt) > Math.max(0.3, 0.25 * Math.abs(vt))) { r.chiave = 'pendenza'; r.piano = Math.abs(vu) < Math.abs(vt); }
      else r.chiave = 'tempi';
      if (e < TOL * 0.5) return;   /* questo tratto non ha colpa */
      if (!scelto || ORDINE.indexOf(r.chiave) < ORDINE.indexOf(scelto.chiave) || (r.chiave === scelto.chiave && e > scelto.e)) scelto = r;
    });
    if (scelto) return scelto;
    return { chiave: 'tempi', t0: 0, t1: durata(L), vu: 0 };
  }
  /* il riassunto di una corsa (modalità libera): spostamento, strada percorsa, velocità massima */
  function riassunto(c) {
    let strada = 0, vmax = 0;
    for (let i = 1; i < c.length; i++) strada += Math.abs(c[i][1] - c[i - 1][1]);
    const T = c.length ? c[c.length - 1][0] : 0;
    for (let t = 0.25; t <= T - 0.25 + 1e-9; t += PASSO) vmax = Math.max(vmax, Math.abs(interp(c, t + 0.25) - interp(c, t - 0.25)) / 0.5);
    return { sposta: c.length ? c[c.length - 1][1] - c[0][1] : 0, strada, vmax };
  }

  /* ---------------- livelli (pista di 10 m) ----------------
     s0: dove parte il grafico; inizio: dove sta il corridore quando si apre il livello; cieco: la propria linea
     si vede solo a corsa finita. I livelli sono stati provati con la prova dei livelli (corsa giusta, giusta in
     ritardo di 0,2 s, e le corse sbagliate tipiche). */
  const LIVELLI = [
    { consegna: 'Trascina il corridore: la sua linea deve restare nella <b>fascia grigia</b>.',
      s0: 1, inizio: 1, tratti: [{ fino: 6, s: 7 }] },                                           /* 1 m/s */
    { consegna: 'Una linea <b>piatta</b>. Che cosa deve fare il corridore?',
      s0: 6, inizio: 2, tratti: [{ fino: 6, s: 6 }] },
    { consegna: 'Due tratti con <b>pendenze diverse</b>.',
      s0: 1, inizio: 5, tratti: [{ fino: 4, s: 3 }, { fino: 7, s: 9 }] },                       /* 0,5 m/s poi 2 m/s */
    { consegna: 'Questa volta la linea <b>scende</b>.',
      s0: 9, inizio: 2, tratti: [{ fino: 4, s: 5 }, { fino: 6, s: 5 }, { fino: 8, s: 1 }] },    /* −1, 0, −2 m/s */
    { consegna: 'La linea sale e poi scende, ma la pista è <b>piana</b>.',
      s0: 2, inizio: 5, strada: true, tratti: [{ fino: 4, s: 8 }, { fino: 8, s: 2 }] },          /* 1,5 m/s e −1,5 m/s */
    { consegna: 'Una linea <b>curva</b>: la pendenza cambia di continuo.',
      s0: 0.5, inizio: 4, tratti: [{ fino: 6, acc: 0.5, v0: 0 }] },                             /* da 0 a 3 m/s */
    { consegna: 'Curva anche questa, ma <b>al contrario</b>.',
      s0: 0.5, inizio: 6, tratti: [{ fino: 6, acc: -0.5, v0: 3 }, { fino: 8, s: 9.5 }] },       /* da 3 m/s a fermo */
    { consegna: '<b>A occhi chiusi</b>: la tua linea compare solo alla fine.',
      s0: 3, inizio: 7, cieco: true, tratti: [{ fino: 2, s: 3 }, { fino: 4, s: 7 }, { fino: 8, s: 1 }] }   /* 0, 2, −1,5 m/s */
  ];
  const PISTA_LIV = 10;
  const DURATE = { min: 4, max: 20 }, PISTE = [5, 10, 20, 50];

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase); i numeri vengono dal livello */
  const VITTORIE = [
    L => { const p = pezzi(L)[0]; return 'Una retta che sale: velocità costante. ' + num(p.v0 * (p.t1 - p.t0), 0) + '\u00a0m in ' + num(p.t1 - p.t0, 0) + '\u00a0s fanno ' + num(p.v0, 0) + '\u00a0m/s.'; },
    () => 'Il tempo passa e la posizione no: linea piatta, velocità zero.',
    L => { const P = pezzi(L); const v = x => num(x, 1).replace(/,0$/, ''); return 'Il tratto più ripido è il più veloce: prima ' + v(P[0].v0) + '\u00a0m/s, poi ' + v(P[1].v0) + '\u00a0m/s.'; },
    () => 'La linea scende: la posizione diminuisce e la velocità è negativa. Il tratto piatto era la sosta.',
    () => 'Sulla punta ti sei girato e sei tornato indietro: il grafico non è il disegno della strada.',
    L => { const p = pezzi(L)[0]; return 'Pendenza che cresce, velocità che cresce: alla fine andavi a ' + num(p.v0 + p.a * (p.t1 - p.t0), 0) + '\u00a0m/s.'; },
    () => 'Pendenza che cala fino a zero: è una frenata, e il tratto piatto è il corridore fermo.',
    () => 'Senza vedere la tua linea: hai letto le pendenze come velocità, avanti, fermo e indietro.'
  ];
  const STILLA = {
    partenza: 'Il punto da cui parte la linea, sull\'asse s, è la posizione del corridore al via.',
    piatto: 'Linea piatta: il tempo passa ma la posizione resta la stessa. Il corridore sta fermo.',
    scende: 'Dove la linea scende la posizione diminuisce: il corridore torna verso lo zero.',
    strada: 'Il grafico non è il disegno della strada: la punta è l\'istante in cui il corridore si gira e torna indietro.',
    sale: 'Dove la linea sale la posizione aumenta: il corridore si allontana dallo zero.',
    fermo: 'Una linea inclinata vuol dire che la posizione cambia: lì il corridore deve muoversi.',
    pendenza: 'Più la linea è ripida, più il corridore va veloce: la pendenza Δs/Δt è la velocità.',
    curva: 'La linea si incurva verso l\'alto: è sempre più ripida, quindi il corridore deve accelerare.',
    frena: 'La linea si appiattisce: la pendenza cala, quindi il corridore rallenta fino a fermarsi.'
  };

  const AIUTO = 'Il grafico in alto è la legge oraria s(t): in orizzontale il tempo t, in verticale la posizione s del corridore sulla pista, misurata dal segno 0. Premi «Via»: dopo il conto alla rovescia il tempo scorre davvero, e la tua corsa disegna la sua linea. Trascina il corridore lungo la pista (puoi toccare la pista dove vuoi: lui ti raggiunge correndo, al massimo a 8\u00a0m/s). Vale se al via sei nella fascia grigia (larga ' + num(TOL, 1) + '\u00a0m sopra e sotto la linea) e ci resti per almeno l\'' + Math.round(SOGLIA * 100) + '% del tempo. A corsa finita tocca il grafico: rivedi dove era il corridore in quell\'istante, e la formula dà la sua velocità.';
  const AIUTO_LIBERO = 'In modalità libera non c\'è un grafico da rifare. Scegli quanto dura la corsa (durata) e quanto è lunga la pista, premi «Via» e corri come vuoi: guarda che linea viene. A corsa finita tocca il grafico per rivedere la corsa istante per istante.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { let r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); if (r === 0) r = 0; return r.toFixed(d).replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { let r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); if (r === 0) r = 0; return r.toFixed(d).replace('.', '{,}'); }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const ALONE = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };

  QUANTO.registraLab({
    id: 'corridore',
    fisica: { pezzi, legge, durata, interp, valuta, diagnosi, riassunto, LIVELLI, TOL, SOGLIA, VMAX },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-corridore')) { const st = document.createElement('style'); st.id = 'stile-lab-corridore'; st.textContent = STILE; document.head.appendChild(st); }
      radice.classList.add('lab-corridore');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun grafico da rifare, corri come vuoi">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri" hidden>
              <div class="lab-param" data-p="T"><span class="nome" title="durata della corsa">durata</span><button type="button" class="btn piccolo" data-d="-1" aria-label="corsa più corta">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="corsa più lunga">+</button></div>
              <div class="lab-param" data-p="P"><span class="nome">pista</span><button type="button" class="btn piccolo" data-d="-1" aria-label="pista più corta">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="pista più lunga">+</button></div>
            </div>
            <div class="formula" aria-live="off"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">▶ Via</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = sel => radice.querySelector(sel);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { T: q('[data-p="T"]'), P: q('[data-p="P"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, libero = false, salvato = null;
      let fase = 'pronto';                 /* pronto | conto | corsa | finito */
      let s = 1, dito = null, mira = false;   /* posizione del corridore (m) e dove lo chiama il dito */
      let campioni = [], prove = 0, vinto = false, detti = {}, esito = null;
      let tConto = 0, t0 = 0, tCorsa = 0;   /* istanti (ms) dell'inizio del conto e della corsa; tCorsa = t della corsa */
      let scrub = null;                      /* istante rivisto toccando il grafico a corsa finita */
      let storia = [];                       /* [secondi, s] degli ultimi istanti: la velocità dal vivo */
      let passo = 0, ampiezza = 0, verso = 1, vVivo = 0;   /* il disegno del corridore */
      let parT = 10, parP = 10;              /* modalità libera */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const L = () => libero ? null : LIVELLI[livello];
      const pista = () => libero ? parP : PISTA_LIV;
      const T = () => libero ? parT : durata(LIVELLI[livello]);
      let P = pezzi(LIVELLI[livello]);

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', tabindex: '0', 'aria-label': 'In alto il grafico posizione–tempo da rifare, in basso la pista con il corridore da trascinare', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gTraccia = el('g'), gCursore = el('g'), gPista = el('g'), gOmino = el('g'), gTesti = el('g');
      [gFondo, gTraccia, gCursore, gPista, gOmino, gTesti].forEach(g => svg.appendChild(g));

      /* geometria: grafico (t in orizzontale, s in verticale) sopra, pista (s in orizzontale) sotto */
      let G = {};
      const XT = t => G.gx0 + t / T() * (G.gx1 - G.gx0);
      const YS = v => G.gy1 - v / pista() * (G.gy1 - G.gy0);
      const XS = v => G.px0 + v / pista() * (G.px1 - G.px0);
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(r.width)), h = Math.max(220, Math.round(r.height));
        const zona = morsa(Math.round(h * 0.3), 100, 160);   /* la fascia della pista */
        const gx0 = 46, gx1 = w - 20, gy0 = 26, gy1 = h - zona - 26;
        const om = morsa((zona - 58) / 1.03, 40, 84);   /* altezza del corridore: la testa resta sotto la riga delle letture */
        G = { w, h, zona, gx0, gx1, gy0, gy1, px0: gx0, px1: gx1, ty: h - 26, om };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.dataset.pista = JSON.stringify({ x0: G.px0, x1: G.px1, y: G.ty - om / 2, L: pista() });   /* per il banco di prova */
      }
      const passoGriglia = (unita, pxPer, minimo) => [0.5, 1, 2, 5, 10, 20].find(st => st * pxPer >= minimo && st >= unita) || 20;

      function disegnaFondo() {
        vuota(gFondo); vuota(gPista);
        const pl = pista(), Tt = T();
        /* griglia del grafico */
        const ps = passoGriglia(pl <= 5 ? 0.5 : 1, (G.gy1 - G.gy0) / pl, 26), pt = passoGriglia(1, (G.gx1 - G.gx0) / Tt, 30);
        gFondo.appendChild(el('rect', { x: G.gx0, y: G.gy0, width: G.gx1 - G.gx0, height: G.gy1 - G.gy0, fill: 'var(--sup)', opacity: .55, rx: 4 }));
        for (let v = ps; v <= pl + 1e-9; v += ps) {
          gFondo.appendChild(el('line', { x1: G.gx0, y1: YS(v), x2: G.gx1, y2: YS(v), stroke: 'var(--bordo)', 'stroke-width': 1 }));
          gFondo.appendChild(el('text', { x: G.gx0 - 6, y: YS(v) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(v, v % 1 ? 1 : 0)));
        }
        for (let t = pt; t <= Tt + 1e-9; t += pt) {
          gFondo.appendChild(el('line', { x1: XT(t), y1: G.gy0, x2: XT(t), y2: G.gy1, stroke: 'var(--bordo)', 'stroke-width': 1 }));
          if (XT(t) < G.gx1 - 14 || t === Tt) gFondo.appendChild(el('text', { x: XT(t), y: G.gy1 + 16, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, String(t)));
        }
        gFondo.appendChild(el('text', { x: G.gx0 - 6, y: G.gy1 + 16, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, '0'));
        /* assi */
        gFondo.appendChild(el('line', { x1: G.gx0, y1: G.gy1, x2: G.gx1 + 8, y2: G.gy1, stroke: 'var(--testo)', 'stroke-width': 1.6, opacity: .75 }));
        gFondo.appendChild(el('line', { x1: G.gx0, y1: G.gy1, x2: G.gx0, y2: G.gy0 - 10, stroke: 'var(--testo)', 'stroke-width': 1.6, opacity: .75 }));
        const asseS = el('text', { x: G.gx0 + 6, y: G.gy0 - 10, fill: 'var(--testo)', style: 'font: 600 13px var(--font)' });
        asseS.appendChild(el('tspan', { 'font-style': 'italic' }, 's')); asseS.appendChild(el('tspan', {}, ' (m)'));
        gFondo.appendChild(asseS);
        const asseT = el('text', { x: G.gx1 + 6, y: G.gy1 - 7, 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' });
        asseT.appendChild(el('tspan', { 'font-style': 'italic' }, 't')); asseT.appendChild(el('tspan', {}, ' (s)'));
        gFondo.appendChild(asseT);
        /* il grafico da rifare: la fascia e la linea al centro */
        if (!libero) {
          const n = Math.max(2, Math.round(Tt / 0.05));
          let su = '', giu = '', centro = '';
          for (let i = 0; i <= n; i++) {
            const t = i * Tt / n, v = legge(P, t);
            su += (i ? 'L' : 'M') + XT(t).toFixed(1) + ' ' + YS(Math.min(pl, v + TOL)).toFixed(1) + ' ';
            centro += (i ? 'L' : 'M') + XT(t).toFixed(1) + ' ' + YS(v).toFixed(1) + ' ';
          }
          for (let i = n; i >= 0; i--) { const t = i * Tt / n; giu += 'L' + XT(t).toFixed(1) + ' ' + YS(Math.max(0, legge(P, t) - TOL)).toFixed(1) + ' '; }
          gFondo.appendChild(el('path', { d: su + giu + 'Z', fill: 'var(--testo2)', opacity: .2 }));
          gFondo.appendChild(el('path', { d: centro, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', opacity: .9 }));
        }
        /* la pista: dritta, con il righello delle posizioni */
        const y = G.ty, pp = passoGriglia(pl <= 5 ? 0.5 : 1, (G.px1 - G.px0) / pl, 30);
        gPista.appendChild(el('rect', { x: G.px0 - 12, y: y - 6, width: G.px1 - G.px0 + 24, height: 10, rx: 5, fill: '#b5813f', opacity: .45 }));
        gPista.appendChild(el('line', { x1: G.px0 - 12, y1: y - 6, x2: G.px1 + 12, y2: y - 6, stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .5 }));
        for (let v = 0; v <= pl + 1e-9; v += pp) {
          gPista.appendChild(el('line', { x1: XS(v), y1: y - 6, x2: XS(v), y2: y + 4, stroke: 'var(--testo)', 'stroke-width': v === 0 ? 2.4 : 1.3, opacity: .65 }));
          gPista.appendChild(el('text', { x: XS(v), y: y + 18, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(v, v % 1 ? 1 : 0)));
        }
        gPista.appendChild(el('text', { x: G.px0 - 16, y: y + 18, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'm'));
      }

      /* la linea della corsa: piena mentre si corre; a corsa finita, rossa dove esce dalla fascia */
      let dCorsa = '';
      function disegnaTraccia(finale) {
        vuota(gTraccia);
        if (campioni.length < 1) return;
        if (!finale) {
          if (L() && L().cieco && fase === 'corsa') return;
          gTraccia.appendChild(el('path', { d: dCorsa, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
          return;
        }
        const Tt = campioni[campioni.length - 1][0], n = Math.max(2, Math.round(Tt / 0.025));
        let d = '', dentroPrima = null, pezzo = '';
        const chiudi = dentro => { if (pezzo) gTraccia.appendChild(el('path', { d: pezzo, fill: 'none', stroke: dentro || libero ? 'var(--testo)' : 'var(--no)', 'stroke-width': 2.8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })); };
        for (let i = 0; i <= n; i++) {
          const t = i * Tt / n, v = interp(campioni, t), pt = XT(t).toFixed(1) + ' ' + YS(v).toFixed(1);
          const dentro = libero ? true : Math.abs(v - legge(P, t)) <= TOL + 1e-9;
          if (dentroPrima === null) pezzo = 'M' + pt;
          else if (dentro !== dentroPrima) { pezzo += ' L' + pt; chiudi(dentroPrima); pezzo = 'M' + pt; }
          else pezzo += ' L' + pt;
          dentroPrima = dentro; d += pt;
        }
        chiudi(dentroPrima);
      }

      /* cursore del tempo, punto della corsa, conto alla rovescia, segno della posizione sull'asse s */
      function disegnaCursore() {
        vuota(gCursore);
        const cieco = L() && L().cieco && fase === 'corsa';
        let tc = null;
        if (fase === 'corsa') tc = tCorsa; else if (fase === 'finito' && scrub != null) tc = scrub;
        if (tc != null) {
          gCursore.appendChild(el('line', { x1: XT(tc), y1: G.gy0 - 4, x2: XT(tc), y2: G.gy1, stroke: 'var(--accento)', 'stroke-width': 1.6, opacity: .8 }));
          const etich = el('text', Object.assign({ x: morsa(XT(tc), G.gx0 + 26, G.gx1 - 26), y: G.gy0 - 8, 'text-anchor': 'middle', fill: 'var(--accento-testo)', style: 'font: 600 13px var(--font)' }, ALONE));
          etich.appendChild(el('tspan', { 'font-style': 'italic' }, 't')); etich.appendChild(el('tspan', {}, ' = ' + num(tc, 1) + '\u00a0s'));
          gCursore.appendChild(etich);
        }
        if (!cieco) {
          const sv = fase === 'finito' && scrub != null ? interp(campioni, scrub) : s;
          /* il segno della posizione sull'asse s (è la stessa s della pista, messa in verticale) */
          gCursore.appendChild(el('path', { d: `M${G.gx0 + 1} ${YS(sv)} l9 -5.5 v11 z`, fill: 'var(--testo)' }));
          if (tc != null) {
            gCursore.appendChild(el('line', { x1: G.gx0, y1: YS(sv), x2: XT(tc), y2: YS(sv), stroke: 'var(--testo2)', 'stroke-width': 1, 'stroke-dasharray': '3 4', opacity: .8 }));
            gCursore.appendChild(el('circle', { cx: XT(tc), cy: YS(sv), r: 5, fill: 'var(--testo)', stroke: 'var(--sup)', 'stroke-width': 1.5 }));
          }
        } else {
          gCursore.appendChild(el('text', Object.assign({ x: G.gx1 - 6, y: G.gy0 + 16, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: italic 600 13px var(--font)' }, ALONE), 'linea nascosta'));
        }
        if (fase === 'conto') {
          const resta = Math.ceil(CONTO - (performance.now() - tConto) / 1000);
          gCursore.appendChild(el('text', Object.assign({ x: (G.gx0 + G.gx1) / 2, y: (G.gy0 + G.gy1) / 2 + 22, 'text-anchor': 'middle', fill: 'var(--accento-testo)', style: 'font: 700 ' + Math.round(morsa((G.gy1 - G.gy0) * 0.35, 40, 110)) + 'px var(--font)' }, ALONE, { 'stroke-width': 6 }), String(Math.max(1, resta))));
          gCursore.appendChild(el('text', Object.assign({ x: (G.gx0 + G.gx1) / 2, y: (G.gy0 + G.gy1) / 2 + 52, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 13px var(--font)' }, ALONE), 'mettiti in posizione'));
        }
      }

      /* il corridore, con la freccia della velocità (azzurra) */
      function disegnaOmino() {
        vuota(gOmino); vuota(gTesti);
        const sv = fase === 'finito' && scrub != null ? interp(campioni, scrub) : s;
        const x = XS(sv), y = G.ty - 6, H = G.om, a = ampiezza;
        const fa = Math.sin(passo) * 0.75 * a, dir = verso;
        const anca = [x, y - H * 0.47], spalla = [x + dir * H * 0.08 * a, y - H * 0.8], testa = [x + dir * H * 0.1 * a, y - H * 0.93];
        const gamba = (ang, segno) => {
          const lc = H * 0.25, ginocchio = [anca[0] + Math.sin(ang) * lc, anca[1] + Math.cos(ang) * lc];
          const piega = Math.max(0, -segno * Math.sin(passo)) * 0.9 * a;
          const piede = [ginocchio[0] + Math.sin(ang - dir * piega) * lc, ginocchio[1] + Math.cos(ang - dir * piega) * lc];
          return `M${anca[0]} ${anca[1]} L${ginocchio[0]} ${ginocchio[1]} L${piede[0]} ${Math.min(y, piede[1])}`;
        };
        const braccio = ang => { const lb = H * 0.2, gomito = [spalla[0] + Math.sin(ang) * lb, spalla[1] + Math.cos(ang) * lb]; return `M${spalla[0]} ${spalla[1]} L${gomito[0]} ${gomito[1]} L${gomito[0] + dir * lb * 0.8 * (0.3 + a * 0.5)} ${gomito[1] - lb * 0.4 * a}`; };
        const tratto = { fill: 'none', stroke: 'var(--testo)', 'stroke-width': Math.max(3, H * 0.075), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
        gOmino.appendChild(el('ellipse', { cx: x, cy: y + 1, rx: H * 0.22, ry: 3, fill: 'var(--testo)', opacity: .15 }));
        gOmino.appendChild(el('path', Object.assign({ d: gamba(-fa, 1), opacity: .55 }, tratto)));
        gOmino.appendChild(el('path', Object.assign({ d: braccio(fa * 0.9), opacity: .55 }, tratto)));
        gOmino.appendChild(el('path', Object.assign({ d: `M${anca[0]} ${anca[1]} L${spalla[0]} ${spalla[1]}` }, tratto, { stroke: 'var(--accento)', 'stroke-width': Math.max(5, H * 0.13) })));
        gOmino.appendChild(el('path', Object.assign({ d: gamba(fa, -1) }, tratto)));
        gOmino.appendChild(el('path', Object.assign({ d: braccio(-fa * 0.9) }, tratto)));
        gOmino.appendChild(el('circle', { cx: testa[0], cy: testa[1], r: H * 0.1, fill: 'var(--testo)' }));
        /* la velocità: freccia azzurra sopra la testa, lunga in proporzione */
        const v = fase === 'finito' && scrub != null ? velocitaIn(scrub, 0.5).v : vVivo;
        const K = (G.px1 - G.px0) / pista() * 0.5;   /* 1 m/s = mezzo metro di pista */
        const yv = y - H * 0.62;   /* la freccia parte dal corridore, all'altezza del petto */
        if (Math.abs(v) * K > 3) freccia(gOmino, x, yv, x + morsa(v * K, -0.45 * G.w, 0.45 * G.w), yv, 'var(--s1)', 3);
        /* le letture: posizione e velocità, in alto a sinistra della pista */
        const ly = G.gy1 + 42;
        const ts = el('text', Object.assign({ x: 8, y: ly, fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, ALONE));
        ts.appendChild(el('tspan', { 'font-style': 'italic' }, 's')); ts.appendChild(el('tspan', {}, ' = ' + num(sv, 1) + '\u00a0m'));
        gTesti.appendChild(ts);
        const tv = el('text', Object.assign({ x: 96, y: ly, fill: 'var(--s1)', style: 'font: 600 13px var(--font)' }, ALONE));
        tv.appendChild(el('tspan', { 'font-style': 'italic' }, 'v')); tv.appendChild(el('tspan', {}, ' = ' + num(Math.abs(v) < 0.05 ? 0 : v, 1) + '\u00a0m/s'));
        gTesti.appendChild(tv);
        if (!libero) gTesti.appendChild(el('text', { x: G.w - 8, y: ly, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 13px var(--font)' }, 'prove: ' + prove));
      }
      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }

      function ridisegnaTutto() { geometria(); ricostruisciCorsa(); disegnaFondo(); disegnaTraccia(fase === 'finito'); disegnaCursore(); disegnaOmino(); }
      function ricostruisciCorsa() { dCorsa = campioni.map((c, i) => (i ? 'L' : 'M') + XT(c[0]).toFixed(1) + ' ' + YS(c[1]).toFixed(1)).join(' '); }

      /* ---------------- velocità: Δs/Δt su una finestra di tempo ---------------- */
      function velocitaIn(t, finestra) {   /* sulla corsa registrata, centrata in t */
        const Tt = campioni.length ? campioni[campioni.length - 1][0] : 0;
        const a = Math.max(0, t - finestra / 2), z = Math.min(Tt, t + finestra / 2);
        if (z - a < 0.05) return { ds: 0, dt: 0, v: 0 };
        const ds = interp(campioni, z) - interp(campioni, a);
        return { ds, dt: z - a, v: ds / (z - a) };
      }
      function velocitaViva(finestra) {    /* sugli ultimi istanti (anche prima del via) */
        if (storia.length < 2) return { ds: 0, dt: finestra, v: 0 };
        const ora = storia[storia.length - 1][0];
        const a = Math.max(storia[0][0], ora - finestra);
        if (ora - a < 0.1) return { ds: 0, dt: finestra, v: 0 };
        const ds = interp(storia, ora) - interp(storia, a);
        return { ds, dt: ora - a, v: ds / (ora - a) };
      }

      /* ---------------- pannello ---------------- */
      let ultimaFormula = 0;
      function aggiornaFormula(forza) {
        const ora = performance.now();
        if (!forza && ora - ultimaFormula < 160) return;
        ultimaFormula = ora;
        const pezzi = [];
        const frazione = (nome, m) => {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(nome + ' = \\dfrac{\\Delta s}{\\Delta t}') + '</span>');
          const ds = Math.abs(m.ds) < 0.005 ? 0 : m.ds, v = Math.abs(m.v) < 0.05 ? 0 : m.v;
          pezzi.push('<span class="pezzo"><span class="nome-stretto">' + ctx.tex(nome) + ' </span>' + ctx.tex('= \\dfrac{' + texNum(ds, 2) + '\\,\\text{m}}{' + texNum(m.dt, m.dt % 1 > 0.04 && m.dt % 1 < 0.96 ? 1 : 0) + '\\,\\text{s}}') + '</span>');
          pezzi.push('<span class="pezzo esito">' + ctx.tex('\\approx ' + texNum(v, 1) + '\\,\\text{m/s}') + '</span>');
        };
        if (fase === 'finito' && scrub != null) frazione('v', velocitaIn(scrub, 1));
        else if (fase === 'finito' && campioni.length > 1) {
          const Tt = campioni[campioni.length - 1][0];
          frazione('v_m', { ds: campioni[campioni.length - 1][1] - campioni[0][1], dt: Tt, v: (campioni[campioni.length - 1][1] - campioni[0][1]) / Tt });
        } else frazione('v', velocitaViva(0.5));
        formulaEl.innerHTML = pezzi.join('');
      }
      function aggiornaParametri() {
        box.T.querySelector('output').textContent = parT + '\u00a0s';
        box.P.querySelector('output').textContent = parP + '\u00a0m';
        const occupato = fase === 'conto' || fase === 'corsa';
        box.T.querySelector('[data-d="-1"]').disabled = occupato || parT <= DURATE.min;
        box.T.querySelector('[data-d="1"]').disabled = occupato || parT >= DURATE.max;
        box.P.querySelector('[data-d="-1"]').disabled = occupato || parP <= PISTE[0];
        box.P.querySelector('[data-d="1"]').disabled = occupato || parP >= PISTE[PISTE.length - 1];
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        const occupato = fase === 'conto' || fase === 'corsa';
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = occupato || (k > sblocco && k !== livello);
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
        b.libero.disabled = occupato;
      }
      function aggiornaBottoni() {
        const occupato = fase === 'conto' || fase === 'corsa';
        b.via.textContent = occupato ? '■ Ferma' : '▶ Via';
        b.via.disabled = !occupato && vinto && !libero;
        b.ric.disabled = occupato;
        radice.dataset.fase = fase;
      }
      function aggiornaConta() { disegnaOmino(); }   /* il contatore delle prove sta nella scena, accanto alle letture */

      /* ---------------- il ciclo: il corridore insegue il dito, il tempo della corsa scorre ---------------- */
      let raf = 0, tPrec = 0;
      function avviaCiclo() { if (!raf) { tPrec = performance.now(); raf = requestAnimationFrame(ciclo); } }
      function ciclo(ora) {
        raf = 0;
        const dt = Math.min(0.1, Math.max(0, (ora - tPrec) / 1000)); tPrec = ora;
        if (fase === 'conto' && (ora - tConto) / 1000 >= CONTO) iniziaCorsa(tConto + CONTO * 1000);
        const prima = s;
        if (dito != null) {
          const d = dito - s, max = VMAX * dt;
          s = Math.abs(d) <= max ? dito : s + Math.sign(d) * max;
          if (s === dito && !mira) dito = null;
        }
        const mosso = s - prima;
        if (Math.abs(mosso) > 1e-4) verso = mosso > 0 ? 1 : -1;
        passo += Math.abs(mosso) * (G.px1 - G.px0) / pista() / (G.om * 0.32);   /* un passo ogni tanto di pista, in proporzione al corridore */
        storia.push([ora / 1000, s]);
        while (storia.length > 2 && storia[0][0] < ora / 1000 - 1.2) storia.shift();
        vVivo = velocitaViva(0.3).v;
        ampiezza += (morsa(Math.abs(vVivo) / 1.8, 0, 1) - ampiezza) * Math.min(1, dt * 10);
        if (fase === 'corsa') {
          tCorsa = (ora - t0) / 1000;
          const Tt = T();
          if (tCorsa >= Tt) { tCorsa = Tt; aggiungi(Tt, s); fineCorsa(); }
          else aggiungi(tCorsa, s);
        }
        if (fase !== 'finito' || scrub == null) aggiornaFormula(false);
        disegnaTraccia(fase === 'finito'); disegnaCursore(); disegnaOmino();
        if (fase === 'conto' || fase === 'corsa' || mira || dito != null || ampiezza > 0.01 || Math.abs(vVivo) > 0.01) raf = requestAnimationFrame(ciclo);
        else aggiornaFormula(true);
      }
      function aggiungi(t, v) {
        if (campioni.length && t <= campioni[campioni.length - 1][0]) return;
        campioni.push([t, v]);
        dCorsa += (dCorsa ? ' L' : 'M') + XT(t).toFixed(1) + ' ' + YS(v).toFixed(1);
      }

      /* ---------------- la corsa ---------------- */
      function via() {
        if (fase === 'conto' || fase === 'corsa') { ferma(); return; }
        if (vinto && !libero) return;
        aiutoEl.hidden = true; scrub = null; campioni = []; dCorsa = ''; esito = null;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        fase = 'conto'; tConto = performance.now();
        vuota(gTraccia);
        aggiornaBottoni(); aggiornaLivelli(); aggiornaParametri();
        avviaCiclo();
      }
      function iniziaCorsa(quando) {
        fase = 'corsa'; t0 = quando; tCorsa = 0; campioni = []; dCorsa = '';
        aggiungi(0, s);
        if (!libero) { prove++; aggiornaConta(); }
        radice.dataset.t0 = String(t0);
        aggiornaBottoni();
      }
      function ferma() {   /* corsa interrotta: nessun verdetto */
        fase = campioni.length > 1 ? 'finito' : 'pronto';
        if (fase === 'finito' && !libero) { campioni = []; dCorsa = ''; fase = 'pronto'; }
        msg.textContent = 'Corsa interrotta.'; msg.className = 'lab-messaggio';
        aggiornaBottoni(); aggiornaLivelli(); aggiornaParametri(); disegnaTraccia(fase === 'finito'); disegnaCursore(); aggiornaFormula(true);
      }
      function fineCorsa() {
        fase = 'finito'; scrub = null;
        aggiornaBottoni(); aggiornaLivelli(); aggiornaParametri();
        disegnaTraccia(true);
        if (libero) {
          const r = riassunto(campioni);
          msg.textContent = 'Spostamento ' + num(r.sposta, 1) + '\u00a0m, strada percorsa ' + num(r.strada, 1) + '\u00a0m. Velocità massima ' + num(r.vmax, 1) + '\u00a0m/s.';
          msg.className = 'lab-messaggio';
          aggiornaFormula(true);
          return;
        }
        const Lv = L(), r = valuta(Lv, campioni), perc = Math.round(r.quota * 100);
        esito = r;
        if (r.ok) { vinci(perc); aggiornaFormula(true); return; }
        const dg = diagnosi(Lv, campioni);
        msg.textContent = (r.alVia ? 'Nella fascia il ' + perc + '% del tempo (serve l\'' + Math.round(SOGLIA * 100) + '%). ' : '') + spiega(dg);
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        if (STILLA[dg.chiave] && !detti[dg.chiave]) { detti[dg.chiave] = true; ctx.zenone(STILLA[dg.chiave], { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 }); }
        aggiornaFormula(true);
      }
      function spiega(dg) {
        const fra = 'Fra ' + num(dg.t0, 0) + '\u00a0s e ' + num(dg.t1, 0) + '\u00a0s ';
        switch (dg.chiave) {
          case 'partenza': return 'Al via eri a ' + num(dg.s0u, 1) + '\u00a0m: guarda da dove parte la linea.';
          case 'piatto': return fra + 'ti sei mosso, a ' + num(Math.abs(dg.vu), 1) + '\u00a0m/s in media.';
          case 'quota': return fra + 'eri fermo, ma nel posto sbagliato.';
          case 'scende': case 'strada': return fra + 'sei andato avanti invece che indietro.';
          case 'sale': return fra + 'sei andato indietro invece che avanti.';
          case 'fermo': return fra + 'sei rimasto quasi fermo.';
          case 'pendenza': if (Math.abs(dg.vu) < 0.15) return fra + 'sei andato ' + (dg.indietro ? 'indietro' : 'avanti') + ' tardi e troppo piano.';
          return fra + (dg.piano ? 'sei andato troppo piano' : 'sei andato troppo veloce') + (Math.abs(dg.vu) >= 0.15 ? ': ' + num(Math.abs(dg.vu), 1) + '\u00a0m/s in media.' : '');
          case 'curva': return fra + 'sei andato a velocità quasi costante.';
          case 'frena': return fra + 'non hai rallentato.';
          default: return fra + 'sei uscito dalla fascia: attento a quando cambia la pendenza.';
        }
      }
      function vinci(perc) {
        vinto = true;
        msg.innerHTML = '<span class="vinto">Nella fascia il ' + perc + '% del tempo.' + (prove === 1 ? ' Alla prima prova.' : ' Prove: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaBottoni();
        ctx.zenone(VITTORIE[livello](LIVELLI[livello]), { espressione: prove <= 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* ---------------- livelli e modalità libera ---------------- */
      function azzera() {
        cancelAnimationFrame(raf); raf = 0;
        fase = 'pronto'; campioni = []; dCorsa = ''; scrub = null; esito = null; dito = null; mira = false;
        storia = []; vVivo = 0; ampiezza = 0; aiutoEl.hidden = true;
        msg.textContent = ''; msg.className = 'lab-messaggio';
      }
      function avviaLivello(n) {
        azzera(); libero = false; salvato = null; mostraLibero();
        livello = n; P = pezzi(LIVELLI[n]); s = LIVELLI[n].inizio;
        prove = 0; vinto = false; detti = {};
        consegnaEl.innerHTML = LIVELLI[n].consegna;
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiornaBottoni(); aggiornaLivelli(); aggiornaConta(); aggiornaFormula(true);
      }
      function mostraLibero() {
        parametriEl.hidden = !libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (fase === 'conto' || fase === 'corsa') return;
        salvato = { livello, s, prove, vinto, detti: Object.assign({}, detti), campioni: campioni.slice(), fase, esito, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        azzera(); libero = true; mostraLibero();
        s = morsa(s, 0, parP);
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiornaBottoni(); aggiornaLivelli(); aggiornaConta(); aggiornaParametri(); aggiornaFormula(true);
      }
      function esciLibero() {
        if (fase === 'conto' || fase === 'corsa') return;
        const z = salvato; azzera(); libero = false; salvato = null; mostraLibero();
        livello = z.livello; P = pezzi(LIVELLI[livello]); s = morsa(z.s, 0, PISTA_LIV); prove = z.prove; vinto = z.vinto; detti = z.detti;
        campioni = z.campioni; fase = z.fase; esito = z.esito;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiornaBottoni(); aggiornaLivelli(); aggiornaConta(); aggiornaFormula(true);
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function cambiaParametro(k, d) {
        if (!libero || fase === 'conto' || fase === 'corsa') return;
        if (k === 'T') parT = morsa(parT + d, DURATE.min, DURATE.max);
        else { const i = morsa(PISTE.indexOf(parP) + d, 0, PISTE.length - 1); parP = PISTE[i]; s = morsa(s, 0, parP); }
        fase = 'pronto'; campioni = []; dCorsa = ''; scrub = null; msg.textContent = '';
        ridisegnaTutto(); aggiornaParametri(); aggiornaBottoni(); aggiornaFormula(true);
      }

      /* ---------------- il dito ---------------- */
      function inSvg(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        return pt.matrixTransform(m.inverse());
      }
      let presa = null;   /* 'pista' | 'grafico' */
      function muoviDito(c) {
        if (presa === 'pista') { dito = morsa((c.x - G.px0) / (G.px1 - G.px0) * pista(), 0, pista()); if (fase === 'finito') { scrub = null; } avviaCiclo(); }
        else if (presa === 'grafico') {
          const Tt = campioni[campioni.length - 1][0];
          scrub = morsa((c.x - G.gx0) / (G.gx1 - G.gx0) * T(), 0, Tt);
          s = interp(campioni, scrub);
          disegnaCursore(); disegnaOmino(); aggiornaFormula(true);
        }
      }
      svg.addEventListener('pointerdown', ev => {
        const c = inSvg(ev); if (!c) return;
        aiutoEl.hidden = true;
        if (fase === 'conto' || fase === 'corsa') presa = 'pista';
        else if (c.y > G.gy1 + 20) presa = 'pista';
        else if (fase === 'finito' && campioni.length > 1) presa = 'grafico';
        else return;
        mira = presa === 'pista';
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        if (presa === 'pista' && msg.classList.contains('no') && fase !== 'finito') { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        muoviDito(c); ev.preventDefault();
      });
      const muovi = ev => { if (!presa) return; const c = inSvg(ev); if (c) muoviDito(c); ev.preventDefault(); };
      const molla = () => { if (!presa) return; presa = null; mira = false; avviaCiclo(); };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);
      /* da tastiera: frecce a destra e a sinistra */
      svg.addEventListener('keydown', ev => {
        if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
        if (fase === 'finito') scrub = null;
        dito = morsa((dito != null ? dito : s) + (ev.key === 'ArrowRight' ? 0.5 : -0.5), 0, pista());
        avviaCiclo(); ev.preventDefault();
      });

      /* ---------------- comandi ---------------- */
      b.via.addEventListener('click', via);
      b.ric.addEventListener('click', () => {
        if (fase === 'conto' || fase === 'corsa') return;
        if (libero) { azzera(); ridisegnaTutto(); aggiornaBottoni(); aggiornaParametri(); aggiornaFormula(true); return; }
        avviaLivello(vinto ? (livello + 1) % LIVELLI.length : livello);
      });
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').textContent = libero ? AIUTO_LIBERO : AIUTO;
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      parametriEl.addEventListener('click', ev => { const bt = ev.target.closest('button[data-d]'); if (bt && !bt.disabled) cambiaParametro(bt.closest('.lab-param').dataset.p, +bt.dataset.d); });
      LIVELLI.forEach((_, k) => {
        const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'lab-pallino';
        pl.setAttribute('aria-label', 'Livello ' + (k + 1)); pl.innerHTML = '<span>' + (k + 1) + '</span>';
        pl.addEventListener('click', () => { if (fase !== 'conto' && fase !== 'corsa') avviaLivello(k); });
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
        cancelAnimationFrame(raf); raf = 0; ro.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
