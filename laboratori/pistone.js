/* Laboratorio «Il pistone» — l'equazione di stato vista con le molecole (argomento gas).
   Un cilindro chiuso da un pistone, con dentro n moli di gas (un pallino ogni 0,05 mol) a temperatura T, tenuta dal
   bagno sotto il cilindro. Le molecole corrono con velocità proporzionali a √T (v_qm = √(3·R·T/M), azoto), rimbalzano
   in modo elastico sulle pareti, e ogni urto sul pistone lampeggia. Il manometro (viola) fa la media degli urti sul
   pistone: è tarato una volta per tutte, e la media lunga vale proprio p = n·R·T / V.
   Pistone bloccato (si sceglie V) oppure libero sotto un carico (la pressione è fissa e V = n·R·T / p).
   Nei livelli il manometro è chiuso finché non si preme «Prova»: niente lettura in anteprima.
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-pistone .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-pistone .lab-scena > svg { width: 100%; height: 100%; }
    .lab-pistone svg text { font-family: var(--font); }
    .lab-pistone .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-pistone .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-pistone .consegna { min-height: 4.2em; }   /* tre righe riservate: cambiare livello non sposta il resto */
    .lab-pistone .consegna:empty { display: none; }
    .lab-pistone .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 7.2em; }   /* l'altezza del caso più alto (la radice del livello 5) */
    .lab-pistone .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-pistone .formula .ignoto { color: var(--testo3); display: inline-grid; justify-items: center; align-items: center; }
    .lab-pistone .formula .ignoto > * { grid-area: 1 / 1; }
    .lab-pistone .formula .ignoto .fantasma { visibility: hidden; font-weight: 600; }   /* il risultato nascosto tiene già il suo posto: la prova non manda a capo */
    .lab-pistone .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-pistone .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-pistone .formula .simbolo { display: none; } .lab-pistone .formula .nome-stretto { display: inline; } .lab-pistone .formula { font-size: 1rem; min-height: 5.6em; } }
    .lab-pistone .lab-messaggio { padding: 0 4px; min-height: 2.9em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-pistone .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-pistone .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-pistone .lab-barra { gap: 5px; } .lab-pistone .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-pistone .btn[disabled] { opacity: .38; cursor: default; }
    .lab-pistone .lab-barra .btn[hidden], .lab-pistone .lab-param[hidden], .lab-pistone .b-pistone[hidden] { display: none; }
    .lab-pistone .lab-parametri { max-width: 640px; }
    .lab-pistone .lab-param { gap: 4px; min-width: 0; }
    .lab-pistone .lab-param .nome { min-width: 1.1em; }
    .lab-pistone .lab-param .valore { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-width: 0; max-width: 5.2em; line-height: 1.05; }
    .lab-pistone .lab-param output { min-width: 0; white-space: nowrap; }
    .lab-pistone .lab-param small { font-size: .75rem; color: var(--testo2); white-space: nowrap; }
    .lab-pistone .lab-param small:empty { display: none; }
    .lab-pistone .lab-param.fisso .btn { visibility: hidden; }
    .lab-pistone .lab-param.fisso output { color: var(--testo2); }
    @container lab (max-width: 600px) { .lab-pistone .lab-param.fisso { display: none; } }
    .lab-pistone .b-pistone, .lab-pistone .lab-parametri .b-casuale { justify-self: center; min-height: 38px; }
    .lab-pistone .lab-parametri .b-casuale[hidden] { display: none; }
    @container lab (max-width: 420px) {
      .lab-pistone .lab-parametri { gap: 4px 6px; }
      .lab-pistone .lab-param { gap: 3px; }
      .lab-pistone .lab-param .btn { min-width: 36px; padding: 0 4px; }
      .lab-pistone .lab-param .valore { min-width: 0; flex: 1; }
      .lab-pistone .lab-param output { font-size: .95rem; }
    }
    .lab-pistone .conta { position: absolute; left: 10px; top: 6px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-pistone .vinto { display: inline-block; animation: lab-pistone-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-pistone-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-pistone .lab-barra .b-ric { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* larga già quanto l'etichetta più lunga: vincere non sposta gli altri pulsanti */
    .lab-pistone .lab-barra .b-ric::after { content: 'Ricomincia dal primo'; content: 'Ricomincia dal primo' / ''; height: 0; overflow: hidden; visibility: hidden; }
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-pistone .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-pistone .lab-lato { min-height: 20.8rem; } .lab-pistone .lab-barra { min-height: 2.31rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-pistone .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 27.3rem) / 2)); padding-bottom: max(14px, calc((100cqh - 27.3rem) / 2)); } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const R = 8.31, M = 0.028;                     /* J/(mol·K); massa molare dell'azoto in kg/mol */
  const LIM = { n: [0.1, 3, 0.1], T: [80, 700, 5],   /* sotto i 77 K l'azoto è liquido */ V: [2, 40, 0.5], c: [50, 500, 10] };   /* min, max, passo */
  const V_VISTA = 40;                            /* litri: tutto il cilindro */
  const MOL_PALLINO = 0.05;                      /* ogni pallino è 0,05 mol */

  const vqm = T => Math.sqrt(3 * R * T / M);     /* m/s */
  /* lo stato del gas: p in kPa, V in litri, v_qm in m/s. Pistone libero: V = n·R·T / p, fra i due fermi */
  function stato(L, q) {
    const nRT = q.n * R * q.T;                   /* joule */
    let V = q.V, fermo = '';
    if (L.pistone === 'libero') {
      V = nRT / (q.c * 1000) * 1000;
      if (V > LIM.V[1]) { V = LIM.V[1]; fermo = 'alto'; } else if (V < LIM.V[0]) { V = LIM.V[0]; fermo = 'basso'; }
    }
    return { V, p: nRT / (V / 1000) / 1000, v: vqm(q.T), fermo };
  }

  /* ---------------- livelli ----------------
     ctrl: le grandezze che si possono cambiare; obiettivo: le grandezze da raggiungere, con la tolleranza relativa.
     I valori obiettivo sono calcolati (fattore × valore iniziale, oppure un valore dato).
     Fra parentesi le soluzioni sulla griglia dei comandi, contate con la prova dei livelli. */
  const LIVELLI = [
    { consegna: 'A <b>25&nbsp;L</b> il gas è a circa <b>100&nbsp;kPa</b>. Spingi il pistone finché la pressione raddoppia.',
      ctrl: ['V'], inizio: { n: 1, T: 300, V: 25 }, obiettivo: [{ q: 'p', fattore: 2, tol: 0.03 }], scala: 300, formula: 'p' },       /* 12,5 L */
    { consegna: 'Volume e temperatura bloccati. Aggiungi gas finché il manometro arriva a <b>500&nbsp;kPa</b>.',
      ctrl: ['n'], inizio: { n: 0.5, T: 300, V: 10 }, obiettivo: [{ q: 'p', val: 500, tol: 0.03 }], scala: 600, formula: 'p' },       /* 2,0 mol */
    { consegna: 'Pistone bloccato, gas a <b>27&nbsp;°C</b>. Scaldalo finché la pressione raddoppia.',
      ctrl: ['T'], inizio: { n: 1, T: 300, V: 20 }, obiettivo: [{ q: 'p', fattore: 2, tol: 0.02 }], scala: 300, formula: 'p' },       /* da 590 a 610 K */
    { consegna: 'Pistone libero sotto i pesi: la pressione resta <b>100&nbsp;kPa</b>. Scalda il gas perché il pistone salga alla tacca.',
      ctrl: ['T'], pistone: 'libero', inizio: { n: 1, T: 300, c: 100 }, obiettivo: [{ q: 'V', fattore: 1.5, tol: 0.02 }], scala: 200, formula: 'V' },   /* 445, 450, 455 K */
    { consegna: 'Le molecole corrono a <b>365&nbsp;m/s</b> (velocità quadratica media). Scalda il gas finché corrono il doppio.',
      ctrl: ['T'], inizio: { n: 1, T: 150, V: 20 }, obiettivo: [{ q: 'v', fattore: 2, tol: 0.01 }], scala: 300, formula: 'v' },       /* da 590 a 610 K */
    { consegna: 'Il pistone è stato spinto a metà, <b>12,5&nbsp;L</b>: la pressione è raddoppiata. Raffredda il gas finché torna a <b>100&nbsp;kPa</b>.',
      ctrl: ['T'], inizio: { n: 1, T: 300, V: 12.5 }, obiettivo: [{ q: 'p', val: 1 * R * 300 / 25, tol: 0.02 }], scala: 300, formula: 'p' },   /* 150 K */
    { consegna: 'Pistone libero, carico di <b>100&nbsp;kPa</b>. Fermalo alla tacca dei <b>30&nbsp;L</b>, con le molecole a <b>517&nbsp;m/s</b>.',
      ctrl: ['n', 'T'], pistone: 'libero', inizio: { n: 0.6, T: 150, c: 100 }, obiettivo: [{ q: 'V', val: 30, tol: 0.02 }, { q: 'v', val: vqm(300), tol: 0.01 }], scala: 200, formula: 'Vv' }   /* 1,2 mol e 295–305 K */
  ];
  LIVELLI.forEach(L => {
    L.inizio = Object.assign({ V: 25, c: 100 }, L.inizio);
    const s0 = stato(L, L.inizio);
    L.obiettivo.forEach(o => { if (o.val == null) o.val = o.fattore * s0[o.q]; });
  });
  const LIBERO = { ctrl: ['n', 'T', 'V', 'c'], formula: 'p', libero: true };

  /* il verdetto di una prova: { ok, testo, manca } (il testo dice solo che cosa è successo) */
  function verdetto(L, s) {
    const pezzi = [], manca = [];
    L.obiettivo.forEach(o => {
      const x = s[o.q], d = (x - o.val) / o.val, ok = Math.abs(d) <= o.tol + 1e-9;
      if (!ok) manca.push(o.q);
      if (o.q === 'p') pezzi.push('Manometro: ' + numP(x) + '\u00a0kPa' + (ok ? '' : ', ' + (d > 0 ? 'troppo' : 'poco') + ' (serve ' + numVal(o.val, 1) + ')'));
      else if (o.q === 'V') pezzi.push(s.fermo === 'alto' ? 'Il pistone sbatte contro il fermo in cima' : s.fermo === 'basso' ? 'Il pistone scende fino ai fermi'
        : ok ? 'Pistone alla tacca: ' + num(x, 1) + '\u00a0L' : 'Pistone a ' + num(x, 1) + '\u00a0L: ' + num(Math.abs(x - o.val), 1) + '\u00a0L ' + (d > 0 ? 'sopra' : 'sotto') + ' la tacca');
      else pezzi.push('Molecole a ' + num(x, 0) + '\u00a0m/s' + (ok ? '' : ', ' + (d > 0 ? 'troppo' : 'poco') + ' (servono ' + num(o.val, 0) + ')'));
    });
    return { ok: !manca.length, testo: pezzi.map((t, i) => i ? t.charAt(0).toLowerCase() + t.slice(1) : t).join('; ') + '.', manca };
  }

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    q => 'Volume metà, pressione doppia: a temperatura costante p·V non cambia. È la legge di Boyle.',
    q => 'Quattro volte le molecole, quattro volte gli urti sul pistone: la pressione va come n.',
    q => '27 °C sono 300 K: la pressione raddoppia a 600 K, cioè a 327 °C, non a 54 °C.',
    q => 'A pressione costante V va come T in kelvin: da 300 K a ' + q.T + ' K il volume cresce di circa 1,5 volte.',
    q => 'Velocità doppia vuol dire temperatura quadrupla: T va col quadrato di v<sub>qm</sub>.',
    q => 'Volume metà e temperatura metà, in kelvin: p·V / T resta lo stesso, e la pressione torna quella di prima.',
    q => 'Prima T dalla velocità, poi n da p·V = n·R·T: ' + num(q.n, 1) + ' mol a ' + q.T + ' K.'
  ];

  const AIUTO = 'Nel cilindro c\'è del gas: ogni pallino vale 0,05\u00a0mol. Le molecole corrono più veloci quanto più è alta la temperatura (v<sub>qm</sub> = √(3·R·T/M), per l\'azoto M = 0,028&nbsp;kg/mol) e rimbalzano sulle pareti senza perdere energia. Ogni urto sul pistone lampeggia di viola: il manometro fa la media di questi colpetti, e la media su un tempo lungo vale p = n·R·T / V. La temperatura la tiene il bagno sotto il cilindro. Scegli i valori con − e + (tieni premuto per andare veloce; il pistone bloccato si può anche trascinare), poi premi Prova: si apre la valvola del manometro e si vede che cosa succede.';
  const AIUTI = {
    0: ' Temperatura e quantità di gas non cambiano.',
    1: ' Il gas entra dalla valvola in basso; il volume e la temperatura restano quelli.',
    2: ' Il termostato segna i kelvin e, sotto, i gradi Celsius: T = t + 273.',
    3: ' Il pistone è trattenuto da un fermo: Prova lo toglie, e il pistone si sposta finché la pressione del gas uguaglia quella dei pesi.',
    4: ' Qui conta la velocità delle molecole, non la pressione: v<sub>qm</sub> compare dopo la prova.',
    5: ' Il volume resta 12,5&nbsp;L: puoi cambiare solo la temperatura.',
    6: ' Servono due cose insieme: la velocità delle molecole dipende solo da T; il volume, a pressione fissa, da n e da T.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è obiettivo e il manometro è sempre aperto. Scegli n, T e V; con «Pistone» passi dal pistone bloccato a quello libero sotto un carico: allora scegli la pressione del carico, e il volume lo decide il gas. «Casuale» propone uno stato a caso.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  function texM3(litri) { let s = (litri / 1000).toFixed(5).replace(/0+$/, ''); if (/\.$/.test(s)) s += '0'; return s.replace('.', '{,}'); }   /* 12,5 L → 0{,}0125 */
  function texMigliaia(v) { const s = String(Math.round(v)); return s.length > 4 ? s.replace(/\B(?=(\d{3})+$)/g, '\\,') : s; }               /* 100000 → 100\,000 */
  const numP = p => p >= 1000 ? num(p, 0) : num(p, 1);
  const numVal = (v, d) => Math.abs(v - Math.round(v)) < 1e-9 ? num(v, 0) : num(v, d);   /* 500 kPa, ma 199,4 kPa */

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  /* un testo SVG con un pedice vero: testoPedice('v', 'qm', ' ≈ 517 m/s') */
  function testoPedice(attr, base, ped, resto) {
    const t = el('text', attr); t.appendChild(document.createTextNode(base));
    t.appendChild(el('tspan', { dy: 4, style: 'font-size: 11px' }, ped));
    if (resto) t.appendChild(el('tspan', { dy: -4 }, resto));
    return t;
  }

  QUANTO.registraLab({
    id: 'pistone',
    fisica: { stato, verdetto, vqm, LIVELLI, LIM },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-pistone')) { const s = document.createElement('style'); s.id = 'stile-lab-pistone'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-pistone');
      const riga = (k, nome, giu, su) => `<div class="lab-param" data-p="${k}"><span class="nome">${ctx.tex(nome)}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${giu}">−</button><span class="valore"><output></output><small></small></span><button type="button" class="btn piccolo" data-d="1" aria-label="${su}">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, scegli tu n, T e V">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${riga('n', 'n', 'meno gas', 'più gas')}
              ${riga('T', 'T', 'temperatura più bassa', 'temperatura più alta')}
              ${riga('V', 'V', 'volume più piccolo', 'volume più grande')}
              ${riga('c', 'p', 'carico più leggero', 'carico più pesante')}
              <button type="button" class="btn piccolo b-pistone" hidden>Pistone: bloccato</button>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-prova">▶ Prova</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q$ = s => radice.querySelector(s);
      const scena = q$('.lab-scena'), aiutoEl = q$('.lab-aiuto'), contaEl = q$('.conta');
      const consegnaEl = q$('.consegna'), formulaEl = q$('.formula'), msg = q$('.lab-messaggio');
      const livelliEl = q$('.lab-livelli'), parametriEl = q$('.lab-parametri');
      const b = { prova: q$('.b-prova'), ric: q$('.b-ric'), casuale: q$('.b-casuale'), aiuto: q$('.b-aiuto'), libero: q$('.lab-libero'), pistone: q$('.b-pistone') };
      const box = { n: q$('[data-p="n"]'), T: q$('[data-p="T"]'), V: q$('[data-p="V"]'), c: q$('[data-p="c"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, q = { n: 1, T: 300, V: 25, c: 100 }, colpi = 0, finito = false, animando = false, raf = 0;
      let aperto = false;            /* valvola del manometro aperta (nei livelli: solo dopo Prova) */
      let fase = '', faseT0 = 0, Vda = 0, Va = 0;   /* fase della prova: 'rilascio' (pistone libero che si sposta), 'misura' */
      let Vshow = 25;                /* il volume disegnato (il pistone si muove con continuità) */
      let ultimo = null, detti = {}, mancati = 0;
      let libero = false, salvato = null, pistoneLibero = false;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? Object.assign({}, LIBERO, { pistone: pistoneLibero ? 'libero' : 'fermo' }) : LIVELLI[livello];
      const libPistone = () => liv().pistone === 'libero';
      const puo = k => liv().ctrl.indexOf(k) >= 0;
      const Vlatch = () => stato(LIVELLI[livello], LIVELLI[livello].inizio).V;   /* dove il fermo trattiene il pistone libero, prima della prova */
      function Vmeta() {   /* dove deve andare il pistone */
        if (!libPistone()) return q.V;
        if (libero || aperto) return stato(liv(), q).V;
        return Vlatch();
      }
      const nascondiV = () => !libero && !aperto && liv().obiettivo.some(o => o.q === 'v');

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un cilindro con un pistone, pieno di molecole di gas che rimbalzano, e un manometro', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gGas = el('g'), gLampi = el('g'), gPistone = el('g'), gMano = el('g'), gAgo = el('g'), gLetture = el('g');
      [gFondo, gGas, gLampi, gPistone, gMano, gAgo, gLetture].forEach(g => svg.appendChild(g));

      /* S: geometria in pixel veri. x0..x1 l'interno del cilindro, yF il fondo, pxL i pixel per litro; gx, gy, gr il manometro */
      let S = { w: 300, h: 200, x0: 80, x1: 180, yF: 170, pxL: 3, gx: 250, gy: 70, gr: 50, VPX: 180, K: 1 };
      const PYV = V => S.yF - V * S.pxL;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(260, Math.round(r.width)), h = Math.max(200, Math.round(r.height));
        const sx = Math.round(Math.min(w * 0.56, Math.max(w * 0.5, w - 330)));     /* larghezza della parte del cilindro */
        const Wint = morsa(Math.round(w * 0.26), 76, 150);
        const gruppo = 44 + 34 + Wint + 6;                                        /* termometro, righello, cilindro */
        const x0 = Math.round(Math.max(78, (sx - gruppo) / 2 + 78));
        const yF = h - 34, pxL = (yF - 50) / V_VISTA;
        const gr = Math.round(Math.max(44, Math.min(((w - sx) / 2 - 10) / 1.16, h * 0.26, 128)));   /* 1,16: il segno dell'obiettivo sporge dal quadrante */
        const VPX = Math.max(120, 1.9 * Wint);
        /* taratura del manometro: la media lunga degli urti, Σ v_y² / (W·H) in unità della scena, diventa p = n·R·T / V */
        const K = R * Wint * pxL * 600 / (20 * VPX * VPX);
        S = { w, h, x0, x1: x0 + Wint, yF, pxL, gx: Math.round(sx + (w - sx) / 2), gy: Math.round(14 + gr + 8), gr, VPX, K };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      /* le molecole: posizione relativa all'interno (0..1) e velocità in unità di v_qm, con Σu_x² = Σu_y² = N/2 */
      let mol = [];
      const gauss = () => { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      function normalizza() {
        const N = mol.length; if (!N) return;
        let sx = 0, sy = 0; mol.forEach(m => { sx += m.ux * m.ux; sy += m.uy * m.uy; });
        const fx = sx > 1e-9 ? Math.sqrt(N / 2 / sx) : 1, fy = sy > 1e-9 ? Math.sqrt(N / 2 / sy) : 1;
        mol.forEach(m => { m.ux *= fx; m.uy *= fy; });
      }
      function contaMolecole() {   /* un pallino ogni 0,05 mol */
        const N = Math.round(q.n / MOL_PALLINO);
        let cambiato = false;
        while (mol.length < N) {
          const e = el('circle', { r: 3, fill: 'var(--testo2)' });
          mol.push({ x: 0.1 + 0.8 * Math.random(), y: 0.05 + 0.5 * Math.random(), ux: gauss(), uy: gauss() || 0.3, el: e });
          gGas.appendChild(e); cambiato = true;
        }
        while (mol.length > N) { const m = mol.pop(); if (m.el.parentNode) m.el.parentNode.removeChild(m.el); cambiato = true; }
        if (cambiato) { normalizza(); mol.forEach((m, i) => m.el.setAttribute('fill', i === 0 ? 'var(--s1)' : 'var(--testo2)')); }
      }
      const vpx = () => S.VPX * Math.sqrt(q.T / 300);      /* v_qm in pixel al secondo: cresce con √T */

      /* la misura del manometro: la media degli urti sul pistone dall'apertura della valvola.
         Ogni molecola rimbalza fra fondo e pistone con |v_y| costante: gli urti sul pistone si contano esattamente
         su un tempo di gas 16 volte più lungo di quello mostrato (il manometro media in fretta). */
      const ACC = 16, T_MISURA = 2.2;
      let misura = null, pAgo = 0, pLettura = null;
      function avviaMisura(ora) {
        const H = Math.max(1, (Vshow) * S.pxL), W = S.x1 - S.x0, v = vpx();
        misura = { t0: ora, H, W, m: mol.map(m => { const vy = Math.abs(m.uy) * v; return { vy, f0: m.uy > 0 ? 2 * H - (1 - m.y) * H : (1 - m.y) * H }; }) };
      }
      function leggiMisura(ora) {
        const e = (ora - misura.t0) / 1000, tau = Math.max(1e-3, e * ACC);
        let somma = 0;
        misura.m.forEach(m => { somma += 2 * m.vy * Math.floor((m.f0 + m.vy * tau) / (2 * misura.H)); });
        return { e, p: S.K * somma / (misura.W * tau) };
      }

      function disegnaFondo() {
        vuota(gFondo); vuota(gMano);
        const L = liv(), x0 = S.x0, x1 = S.x1, yT = PYV(V_VISTA) - 6, yF = S.yF;
        /* il bagno che tiene la temperatura: più acceso quando è più caldo */
        const caldo = morsa((q.T - 50) / 650, 0, 1);
        gFondo.appendChild(el('rect', { x: x0 - 10, y: yF + 2, width: x1 - x0 + 20, height: 14, rx: 4, fill: 'var(--s2)', opacity: (0.12 + 0.6 * caldo).toFixed(2) }));
        /* il vetro e le pareti */
        gFondo.appendChild(el('rect', { x: x0, y: yT, width: x1 - x0, height: yF - yT, fill: 'var(--sup)', opacity: .55 }));
        gFondo.appendChild(el('path', { d: `M${x0 - 2} ${yT} V${yF + 2} H${x1 + 2} V${yT}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }));
        /* il righello in litri, a sinistra */
        const passo = S.pxL * 5 >= 22 ? 5 : 10;
        for (let V = 0; V <= V_VISTA; V += passo) {
          const y = PYV(V);
          gFondo.appendChild(el('line', { x1: x0 - 9, y1: y, x2: x0 - 2, y2: y, stroke: 'var(--testo2)', 'stroke-width': 1.5 }));
          if (V) gFondo.appendChild(el('text', { x: x0 - 12, y: y + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, V + '\u00a0L'));
        }
        /* la tacca da raggiungere (livelli con il volume come obiettivo) */
        const oV = !L.libero && L.obiettivo.filter(o => o.q === 'V')[0];
        if (oV) {
          const y = PYV(oV.val);
          gFondo.appendChild(el('line', { x1: x0 - 10, y1: y, x2: x1 + 4, y2: y, stroke: 'var(--no)', 'stroke-width': 2, 'stroke-dasharray': '6 4' }));
          gFondo.appendChild(el('path', { d: `M${x1 + 4} ${y} l9 -5 v10 z`, fill: 'var(--no)' }));
          gFondo.appendChild(el('text', { x: x1 - 4, y: y - 5, 'text-anchor': 'end', fill: 'var(--no)', style: 'font: 700 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'tacca ' + num(oV.val, oV.val % 1 ? 1 : 0) + '\u00a0L'));
        }
        /* il termometro del bagno, a sinistra del righello: kelvin e, sotto, gradi Celsius */
        const tx = Math.max(24, x0 - 58), tAlto = yF - (yF - 50) * 0.62, tBasso = yF + 6;
        gFondo.appendChild(el('rect', { x: tx - 5, y: tAlto, width: 10, height: tBasso - tAlto, rx: 5, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 1.5 }));
        gFondo.appendChild(el('circle', { cx: tx, cy: tBasso + 4, r: 8, fill: 'var(--s2)', stroke: 'var(--testo2)', 'stroke-width': 1.5 }));
        const col = (tBasso - tAlto - 4) * morsa(q.T / LIM.T[1], 0, 1);
        gFondo.appendChild(el('rect', { x: tx - 2.5, y: tBasso - col, width: 5, height: col + 4, fill: 'var(--s2)' }));
        gFondo.appendChild(el('text', { x: tx, y: tAlto - 8, 'text-anchor': 'middle', fill: 'var(--s2)', style: 'font: 700 13px var(--font)' }, q.T + '\u00a0K'));
        gFondo.appendChild(el('text', { x: tx, y: tBasso + 25, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(q.T - 273, 0) + '\u00a0°C'));
        gFondo.appendChild(el('text', { x: (x0 + x1) / 2, y: yF + 30, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'n = ' + num(q.n, 1) + '\u00a0mol  (● = 0,05\u00a0mol)'));
        /* il tubo e la valvola verso il manometro */
        const gx = S.gx, gy = S.gy, gr = S.gr, yt = yF - 10, xv = (x1 + gx - gr - 10) / 2;
        const xg = gx - gr - 10;
        gMano.appendChild(el('path', { d: `M${x1 + 2} ${yt} H${xg} V${gy} H${gx - gr}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 4, opacity: .6, 'stroke-linejoin': 'round' }));
        gMano.appendChild(el('circle', { cx: xv, cy: yt, r: 8, fill: 'var(--sup)', stroke: aperto ? 'var(--s4)' : 'var(--testo2)', 'stroke-width': 2 }));
        gMano.appendChild(el('line', aperto ? { x1: xv - 6, y1: yt, x2: xv + 6, y2: yt, stroke: 'var(--s4)', 'stroke-width': 3 } : { x1: xv, y1: yt - 6, x2: xv, y2: yt + 6, stroke: 'var(--testo2)', 'stroke-width': 3 }));
        /* il quadrante */
        const pmax = scalaMano();
        gMano.appendChild(el('circle', { cx: gx, cy: gy, r: gr, fill: 'var(--sup)', stroke: 'var(--bordo2)', 'stroke-width': 2.5 }));
        const ang = x => (225 - 270 * x / pmax) * Math.PI / 180;
        const passoP = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000].find(s => pmax / s <= 6);
        for (let x = 0; x <= pmax + 1e-6; x += passoP / 2) {
          const a = ang(x), lunga = Math.abs(x / passoP - Math.round(x / passoP)) < 1e-6;
          gMano.appendChild(el('line', { x1: gx + Math.cos(a) * gr * (lunga ? 0.8 : 0.87), y1: gy - Math.sin(a) * gr * (lunga ? 0.8 : 0.87), x2: gx + Math.cos(a) * gr * 0.95, y2: gy - Math.sin(a) * gr * 0.95, stroke: 'var(--testo2)', 'stroke-width': lunga ? 2 : 1.2 }));
          if (lunga) gMano.appendChild(el('text', { x: gx + Math.cos(a) * gr * 0.62, y: gy - Math.sin(a) * gr * 0.62 + 4, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, String(x)));
        }
        gMano.appendChild(el('text', { x: gx, y: gy + gr * 0.45, 'text-anchor': 'middle', fill: 'var(--s4)', style: 'font: 600 12px var(--font)' }, 'kPa'));
        const oP = !L.libero && L.obiettivo.filter(o => o.q === 'p')[0];
        if (oP && oP.val <= pmax) {
          const a = ang(oP.val), c = Math.cos(a), s = Math.sin(a);
          gMano.appendChild(el('path', { d: `M${gx + c * gr * 0.97} ${gy - s * gr * 0.97} L${gx + c * gr * 1.16 - s * 6} ${gy - s * gr * 1.16 - c * 6} L${gx + c * gr * 1.16 + s * 6} ${gy - s * gr * 1.16 + c * 6} Z`, fill: 'var(--no)' }));
        }
      }
      function scalaMano() {
        const L = liv();
        if (!L.libero) return L.scala;
        const p = stato(L, q).p;
        return [50, 100, 200, 300, 500, 1000, 2000, 5000, 10000].find(s => s >= p * 1.08) || 10000;
      }

      /* il pistone: bloccato (perno e maniglia) oppure libero sotto i pesi; prima della prova il fermo lo trattiene */
      function disegnaPistone() {
        vuota(gPistone);
        const x0 = S.x0, x1 = S.x1, y = PYV(Vshow), cx = (x0 + x1) / 2, W = x1 - x0;
        gPistone.appendChild(el('rect', { x: x0 + 1, y: y - 13, width: W - 2, height: 13, rx: 2, fill: 'var(--testo2)' }));
        gPistone.appendChild(el('line', { x1: x0 + 3, y1: y - 1, x2: x1 - 3, y2: y - 1, stroke: 'var(--s4)', 'stroke-width': 1.5, opacity: .5 }));
        const fermo = !libPistone() || (!libero && !aperto);
        if (fermo) [x0 - 8, x1 + 1].forEach(xp => gPistone.appendChild(el('rect', { x: xp, y: y - 22, width: 7, height: 7, rx: 1.5, fill: 'var(--testo)' })));
        if (!libPistone()) {
          gPistone.appendChild(el('rect', { x: cx - 3, y: y - 36, width: 6, height: 23, fill: 'var(--testo2)' }));
          gPistone.appendChild(el('rect', { x: cx - 19, y: y - 44, width: 38, height: 9, rx: 4.5, fill: puo('V') && !finito ? 'var(--accento)' : 'var(--testo2)' }));
          if (puo('V') && !finito) gPistone.appendChild(el('path', { d: `M${cx + 28} ${y - 46} l5 7 h-10 z M${cx + 28} ${y - 26} l5 -7 h-10 z`, fill: 'var(--accento)' }));
        } else {
          const wp = W * 0.7;
          for (let k = 0; k < 2; k++) gPistone.appendChild(el('rect', { x: cx - wp / 2 + k * 4, y: y - 13 - 10 * (k + 1), width: wp - k * 8, height: 9, rx: 2, fill: 'var(--testo)', opacity: .8 }));
          gPistone.appendChild(el('text', { x: cx, y: y - 38, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'carico ' + q.c + '\u00a0kPa'));
        }
      }

      /* lancetta e letture (ogni fotogramma) */
      function disegnaAgo() {
        vuota(gAgo);
        const pmax = scalaMano(), x = morsa(pAgo, 0, pmax * 1.03), a = (225 - 270 * x / pmax) * Math.PI / 180;
        const op = aperto ? 1 : 0.35;
        gAgo.appendChild(el('line', { x1: S.gx, y1: S.gy, x2: S.gx + Math.cos(a) * S.gr * 0.82, y2: S.gy - Math.sin(a) * S.gr * 0.82, stroke: 'var(--s4)', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: op }));
        gAgo.appendChild(el('circle', { cx: S.gx, cy: S.gy, r: 5, fill: 'var(--s4)', opacity: op }));
      }
      let letturaPrima = '';
      function disegnaLetture() {
        const f = morsa(Math.round(S.gr / 5), 15, 22), y1 = S.gy + S.gr + f + 9, stile = 'font: 700 ' + f + 'px var(--font)';
        const testoP = pLettura == null ? '?' : numP(pLettura) + '\u00a0kPa';
        const testoV = nascondiV() ? '?' : num(vqm(q.T), 0) + '\u00a0m/s';
        const nota = !aperto ? 'valvola chiusa' : (misura && fase !== 'rilascio' && (performance.now() - misura.t0) / 1000 < T_MISURA ? 'media degli urti…' : (fase === 'rilascio' ? 'il pistone si sposta…' : 'media degli urti'));
        const chiave = testoP + '|' + testoV + '|' + nota + '|' + S.w + 'x' + S.h;
        if (chiave === letturaPrima) return; letturaPrima = chiave;
        vuota(gLetture);
        gLetture.appendChild(el('text', { x: S.gx, y: y1, 'text-anchor': 'middle', fill: pLettura == null ? 'var(--testo3)' : 'var(--s4)', style: stile }, 'p = ' + testoP));
        gLetture.appendChild(testoPedice({ x: S.gx, y: y1 + f + 6, 'text-anchor': 'middle', fill: nascondiV() ? 'var(--testo3)' : 'var(--s1)', style: 'font: 700 ' + (f - 1) + 'px var(--font)' }, 'v', 'qm', (nascondiV() ? ' = ' : ' ≈ ') + testoV));
        gLetture.appendChild(el('text', { x: S.gx, y: y1 + 2 * f + 22, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: ' + Math.max(12, f - 4) + 'px var(--font)' }, nota));
      }

      /* lampi degli urti sul pistone */
      const lampi = [];
      function lampo(x, ora) {
        let l = lampi.filter(z => ora - z.t > 260)[0];
        if (!l) { if (lampi.length >= 14) return; l = { e: el('line', { stroke: 'var(--s4)', 'stroke-width': 3, 'stroke-linecap': 'round' }), t: 0 }; lampi.push(l); gLampi.appendChild(l.e); }
        l.t = ora; l.x = x;
      }
      function disegnaLampi(ora) {
        const y = PYV(Vshow);
        lampi.forEach(l => {
          const k = (ora - l.t) / 260;
          if (k >= 1) { l.e.setAttribute('opacity', 0); return; }
          l.e.setAttribute('x1', l.x - 5); l.e.setAttribute('x2', l.x + 5); l.e.setAttribute('y1', y + 1.5); l.e.setAttribute('y2', y + 1.5);
          l.e.setAttribute('opacity', (1 - k).toFixed(2));
        });
      }

      /* ---------------- il motore: molecole, pistone, misura ---------------- */
      let tPrec = 0, frecciaEl = null;
      function fotogramma(ora) {
        const dt = tPrec ? Math.min(0.05, (ora - tPrec) / 1000) : 0; tPrec = ora;
        /* il pistone */
        const Vprima = Vshow;
        if (fase === 'rilascio') {
          const k = Math.min(1, (ora - faseT0) / 700), e = 1 - Math.pow(1 - k, 3);
          Vshow = Vda + (Va - Vda) * e;
          if (k >= 1) { fase = 'misura'; avviaMisura(ora); }
        } else {
          const meta = Vmeta();
          Vshow += (meta - Vshow) * (1 - Math.exp(-dt / 0.12));
          if (Math.abs(meta - Vshow) < 0.01) Vshow = meta;
        }
        const muove = Math.abs(Vshow - Vprima) > 1e-4;
        /* le molecole (coordinate relative: se il pistone si sposta, il gas si allunga con lui) */
        const W = S.x1 - S.x0, H = Math.max(4, Vshow * S.pxL), v = vpx();
        const rr = morsa(W / 34, 2.6, 4.2), mx = rr / W, my = Math.min(0.45, rr / H);
        mol.forEach(m => {
          m.x += m.ux * v * dt / W; m.y += m.uy * v * dt / H;
          if (m.x < mx) { m.x = 2 * mx - m.x; m.ux = Math.abs(m.ux); } else if (m.x > 1 - mx) { m.x = 2 * (1 - mx) - m.x; m.ux = -Math.abs(m.ux); }
          if (m.y < my) { m.y = 2 * my - m.y; m.uy = Math.abs(m.uy); }
          else if (m.y > 1 - my) { m.y = 2 * (1 - my) - m.y; m.uy = -Math.abs(m.uy); lampo(S.x0 + m.x * W, ora); }
          m.x = morsa(m.x, mx, 1 - mx); m.y = morsa(m.y, my, 1 - my);
          m.el.setAttribute('cx', (S.x0 + m.x * W).toFixed(1)); m.el.setAttribute('cy', (S.yF - m.y * H).toFixed(1)); m.el.setAttribute('r', rr);
        });
        /* la velocità di una molecola (azzurra): più caldo, freccia più lunga */
        if (mol.length) {
          const m0 = mol[0], cx = S.x0 + m0.x * W, cy = S.yF - m0.y * H, k = 0.13;
          if (!frecciaEl) { frecciaEl = el('line', { stroke: 'var(--s1)', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: .85 }); gGas.appendChild(frecciaEl); }
          frecciaEl.setAttribute('x1', cx.toFixed(1)); frecciaEl.setAttribute('y1', cy.toFixed(1));
          frecciaEl.setAttribute('x2', (cx + m0.ux * v * k).toFixed(1)); frecciaEl.setAttribute('y2', (cy - m0.uy * v * k).toFixed(1));
        }
        if (muove || fase === 'rilascio') disegnaPistone();
        disegnaLampi(ora);
        /* la misura */
        let pMeta = 0;
        if (aperto && fase !== 'rilascio') {
          if (!misura || (libero && muove)) avviaMisura(ora);
          const r = leggiMisura(ora), p = stato(liv(), Object.assign({}, q, { V: libPistone() ? Vshow : q.V })).p;
          if (r.e >= T_MISURA) { pMeta = p; pLettura = libero && muove ? null : p; if (fase === 'misura') { fase = ''; fineProva(); } }
          else if (r.e > 0.3) { pMeta = r.p; pLettura = r.p; }
          else pMeta = pAgo;
        } else if (!aperto) { pLettura = null; pMeta = 0; }
        else pMeta = pAgo;
        pAgo += (pMeta - pAgo) * (1 - Math.exp(-dt / 0.15));
        disegnaAgo(); disegnaLetture();
        raf = requestAnimationFrame(fotogramma);
      }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaPistone(); letturaPrima = ''; misura = null; disegnaAgo(); disegnaLetture(); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const L = liv(), lp = libPistone();
        box.n.querySelector('output').textContent = num(q.n, 1) + '\u00a0mol';
        box.T.querySelector('output').textContent = q.T + '\u00a0K';
        box.T.querySelector('small').textContent = num(q.T - 273, 0) + '\u00a0°C';
        box.V.querySelector('output').textContent = num(q.V, 1) + '\u00a0L';
        box.c.querySelector('output').textContent = q.c + '\u00a0kPa';
        box.V.hidden = lp; box.c.hidden = !lp;
        ['n', 'T', 'V', 'c'].forEach(k => {
          box[k].classList.toggle('fisso', !puo(k));
          box[k].title = puo(k) ? '' : 'Fisso in questo livello';
          box[k].querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = animando || finito || (d < 0 ? q[k] <= LIM[k][0] + 1e-9 : q[k] >= LIM[k][1] - 1e-9); });
        });
        b.pistone.hidden = !libero;
        b.pistone.textContent = 'Pistone: ' + (pistoneLibero ? 'libero' : 'bloccato');
      }
      /* il ponte con la teoria: p·V = n·R·T con i numeri scelti; il risultato solo dopo la prova (in modalità libera subito) */
      /* il messaggio ha due righe fisse: se un testo è più lungo, si rimpicciolisce invece di spingere il resto */
      function adattaMessaggio() {
        msg.style.fontSize = ''; msg.style.height = ''; msg.style.minHeight = '';
        const cs = getComputedStyle(msg), f0 = parseFloat(cs.fontSize), riga = parseFloat(cs.lineHeight) || f0 * 1.45;
        const alto = Math.max(parseFloat(cs.minHeight) || 0, 2 * riga + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom));
        msg.style.height = alto.toFixed(1) + 'px'; msg.style.minHeight = '0';
        let f = f0;
        while (msg.scrollHeight > msg.clientHeight + 1 && f > f0 * 0.7) { f *= 0.93; msg.style.fontSize = f.toFixed(2) + 'px'; }
      }
      new MutationObserver(adattaMessaggio).observe(msg, { childList: true, characterData: true, subtree: true });
      function aggiornaFormula() {
        const L = liv(), s = stato(L, q);
        const fatto = libero || (!animando && ultimo && ultimo.q.n === q.n && ultimo.q.T === q.T && ultimo.q.V === q.V && ultimo.q.c === q.c);
        const pezzi = [];
        const numerico = t => { const i = t.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(t.slice(0, i)) + ' </span>' + ctx.tex(t.slice(i + 1)) + '</span>'; };
        const ignoto = (t, chiesto) => '<span class="pezzo ignoto"><span class="fantasma">' + ctx.tex(t) + '</span><span>' + ctx.tex(chiesto) + '</span></span>';
        const ris = t => fatto ? '<span class="pezzo esito">' + ctx.tex(t) + '</span>' : ignoto(t, '\\approx\\ ?');
        const nRT = texNum(q.n, 1) + ' \\cdot 8{,}31 \\cdot ' + q.T;
        let tipo = L.formula;
        if (L.libero) tipo = libPistone() ? 'V' : 'p';
        if (tipo === 'p') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('p \\cdot V = n \\cdot R \\cdot T') + '</span>');
          pezzi.push(numerico('p = \\dfrac{' + nRT + '}{' + texM3(q.V) + '}\\,\\text{Pa}'));
          pezzi.push(ris('\\approx ' + (s.p >= 1000 ? texNum(s.p, 0) : texNum(s.p, 1)) + '\\,\\text{kPa}'));
        } else if (tipo === 'V' || tipo === 'Vv') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('p \\cdot V = n \\cdot R \\cdot T') + '</span>');
          pezzi.push(numerico('V = \\dfrac{' + nRT + '}{' + texMigliaia(q.c * 1000) + '}\\,\\text{m}^3'));
          pezzi.push(ris('\\approx ' + texNum(s.V, 1) + '\\,\\text{L}' + (s.fermo ? '\\ (\\text{fermo})' : '')));
          if (tipo === 'Vv') pezzi.push(fatto ? '<span class="pezzo esito">' + ctx.tex('v_{qm} \\approx ' + texNum(s.v, 0) + '\\,\\text{m/s}') + '</span>' : ignoto('v_{qm} \\approx ' + texNum(s.v, 0) + '\\,\\text{m/s}', 'v_{qm} \\approx\\ ?'));
        } else if (tipo === 'v') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('v_{qm} = \\sqrt{\\dfrac{3 \\cdot R \\cdot T}{M}}') + '</span>');
          pezzi.push(numerico('v_{qm} = \\sqrt{\\dfrac{3 \\cdot 8{,}31 \\cdot ' + q.T + '}{0{,}028}}\\,\\text{m/s}'));
          pezzi.push(ris('\\approx ' + texNum(s.v, 0) + '\\,\\text{m/s}'));
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
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'prove: ' + colpi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        fase = ''; animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        q = Object.assign({}, L.inizio);
        colpi = 0; finito = false; ultimo = null; detti = {}; mancati = 0; aperto = false; misura = null; pAgo = 0;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.prova.disabled = false; b.ric.textContent = 'Ricomincia';
        contaMolecole(); Vshow = Vmeta();
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- la prova: si apre la valvola (e si toglie il fermo al pistone libero) ---------------- */
      function prova() {
        if (animando || finito || libero) return;
        colpi++; aggiornaConta();
        aiutoEl.hidden = true; msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; aperto = true; misura = null; pAgo = 0;
        b.prova.disabled = true; b.ric.disabled = true;
        if (libPistone()) { fase = 'rilascio'; faseT0 = performance.now(); Vda = Vshow; Va = stato(liv(), q).V; }
        else fase = 'misura';
        disegnaFondo(); disegnaPistone(); aggiorna(); aggiornaLivelli();
      }
      function fineProva() {
        animando = false; b.prova.disabled = false; b.ric.disabled = false;
        const L = liv(), s = stato(L, q);
        ultimo = { q: Object.assign({}, q), s };
        aggiorna(); aggiornaLivelli(); disegnaPistone();
        const v = verdetto(L, s);
        if (v.ok) { vinci(v.testo); return; }
        mancati++;
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, s, v);
      }
      function vinci(testo) {
        finito = true; b.prova.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (colpi === 1 ? ' Alla prima prova.' : ' Prove: ' + colpi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaParametri(); disegnaPistone();
        ctx.zenone(VITTORIE[livello](q), { html: true, espressione: colpi <= 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { html: true, tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, s, v) {
        const i = livello, t0 = L.inizio.T - 273, vicino = x => Math.abs(q.T - x) <= 7;
        if (i === 0 && q.V > L.inizio.V) { dici('largo', 'Allargando il cilindro gli urti sul pistone si diradano: la pressione scende, non sale.'); return; }
        if (i === 1 && q.n < L.inizio.n) { dici('meno', 'Togliendo gas gli urti diminuiscono: per più pressione servono più molecole.'); return; }
        if (i === 2 && vicino(2 * t0 + 273)) { dici('celsius', 'Hai raddoppiato i gradi Celsius: nelle leggi dei gas T va in kelvin, e 27\u00a0°C sono 300\u00a0K.'); return; }
        if (i === 3 && vicino(1.5 * t0 + 273)) { dici('celsius', 'Hai preso 1,5 volte i gradi Celsius: il volume va come T in kelvin, e 27\u00a0°C sono 300\u00a0K.'); return; }
        if (i === 4 && vicino(2 * L.inizio.T)) { dici('radice', 'Temperatura doppia, velocità solo √2 ≈ 1,4 volte: T va col quadrato di v<sub>qm</sub>.'); return; }
        if (i === 5 && q.T > L.inizio.T) { dici('caldo', 'Scaldando la pressione sale ancora: per riportarla giù serve freddo.'); return; }
        if (i === 5 && vicino(t0 / 2 + 273)) { dici('celsius', 'Metà dei gradi Celsius non è metà della temperatura: in kelvin 27\u00a0°C sono 300\u00a0K.'); return; }
        if (i === 6 && v.manca.length === 1 && v.manca[0] === 'V') { dici('moli', 'La velocità è giusta. A pressione e temperatura fisse il volume va come n: più gas, più volume.'); return; }
        if (i === 6 && v.manca.length === 1 && v.manca[0] === 'v') { dici('vel', 'Il volume torna, ma la velocità no: v<sub>qm</sub> dipende solo da T. Prima la temperatura, poi il gas.'); return; }
        if (mancati >= 3) {
          if (L.formula === 'p') dici('prop', 'Guarda la formula: p = n·R·T / V. Di quante volte deve cambiare la grandezza che puoi toccare?');
          else if (L.formula === 'V') dici('prop', 'A pressione costante V / T non cambia, con T in kelvin.');
        }
      }

      /* ---------------- modalità libera: nessun obiettivo, manometro sempre aperto ---------------- */
      function osserva() {
        const s = stato(liv(), q);
        const pV = s.p * s.V;   /* kPa·L = J */
        return 'p·V ≈ ' + num(pV, 0) + '\u00a0J, come n·R·T.' + (s.fermo === 'alto' ? ' Il pistone è contro il fermo in cima.' : s.fermo === 'basso' ? ' Il pistone è sui fermi in basso.' : '');
      }
      function mostraLibero() {
        b.casuale.hidden = !libero; b.prova.hidden = libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, q: Object.assign({}, q), colpi, finito, ultimo, detti: Object.assign({}, detti), mancati, aperto, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        q = { n: 1, T: 300, V: 25, c: 100 }; pistoneLibero = false; finito = false; aperto = true; misura = null;
        consegnaEl.textContent = '';
        msg.textContent = osserva(); msg.className = 'lab-messaggio';
        contaMolecole(); ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; q = z.q; colpi = z.colpi; finito = z.finito; ultimo = z.ultimo; detti = z.detti; mancati = z.mancati; aperto = z.aperto; misura = null;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.prova.disabled = finito;
        contaMolecole(); ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => Math.round((lo + Math.round(Math.random() * (hi - lo) / s) * s) * 10) / 10;
        q = { n: r(0.3, 2.5, 0.1), T: r(150, 600, 10), V: r(6, 36, 1), c: r(60, 300, 10) };
        cambiato();
      }

      /* ---------------- comandi ---------------- */
      function cambiato() {   /* dopo ogni cambio: valvola chiusa (nei livelli), disegno e formula nuovi */
        if (!libero) aperto = false;
        misura = null;
        if (msg.classList.contains('no') || libero) { msg.className = 'lab-messaggio'; msg.textContent = libero ? osserva() : ''; }
        contaMolecole(); disegnaFondo(); disegnaPistone(); aggiorna();
      }
      function cambia(k, d) {
        if (animando || finito || !puo(k)) return false;
        const lim = LIM[k], nuovo = morsa(Math.round((q[k] + d * lim[2]) * 10) / 10, lim[0], lim[1]);
        if (nuovo === q[k]) return false;
        q[k] = nuovo; cambiato(); return true;
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
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(40, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* trascinare il pistone bloccato: l'altezza è il volume (a passi di 0,5 L) */
      let presa = false;
      function tira(ev) {
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        const V = morsa(Math.round((S.yF - c.y) / S.pxL * 2) / 2, LIM.V[0], LIM.V[1]);
        if (V !== q.V) { q.V = V; cambiato(); }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito || !puo('V') || libPistone()) return;
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        if (c.x < S.x0 - 30 || c.x > S.x1 + 40) return;
        presa = true; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        tira(ev); ev.preventDefault();
      });
      const muovi = ev => { if (presa) { tira(ev); ev.preventDefault(); } };
      const molla = () => { presa = false; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.prova.addEventListener('click', prova);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { q = { n: 1, T: 300, V: 25, c: 100 }; cambiato(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.pistone.addEventListener('click', () => { if (!libero) return; pistoneLibero = !pistoneLibero; if (!pistoneLibero) q.V = Math.round(Vshow * 2) / 2; cambiato(); });
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        let t = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');
        if (!libero) t += ' Il livello è superato se ' + LIVELLI[livello].obiettivo.map(o => ({ p: 'la pressione', V: 'il volume', v: 'la velocità delle molecole' })[o.q] + ' è entro il ' + num(o.tol * 100, 0) + '&nbsp;% del valore giusto').join(' e ') + '.';
        aiutoEl.querySelector('p').innerHTML = t;   /* testi fissi del file, con i pedici veri */
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
      raf = requestAnimationFrame(fotogramma);
      let forma = '';
      const ro = new ResizeObserver(() => {
        adattaMessaggio();
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
