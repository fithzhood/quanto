/* Laboratorio «Fotoelettrico» — l'effetto fotoelettrico (argomento quanti).
   Una lampada di cui si sceglie il colore (la lunghezza d'onda λ, trascinando sullo spettro o con − e +) e l'intensità
   (N, fotoni al secondo) illumina una lastra di metallo chiusa in un tubo a vuoto. Ogni fotone porta E = h·f = hc/λ,
   con hc ≈ 1240 eV·nm; se E supera il lavoro di estrazione W del metallo strappa un elettrone, che esce con energia
   cinetica fino a K_max = h·f − W. Davanti alla lastra un collettore, con una tensione frenante V: arrivano solo gli
   elettroni con K > e·V; il potenziale d'arresto è V₀ = K_max / e.
   Semplificazioni dichiarate nel «?»: ogni fotone sopra la soglia strappa un elettrone (nella realtà ne riesce uno ogni
   tanto); gli elettroni escono con energie fra un decimo di K_max e K_max, e uno su quattro esce con K_max (i più
   veloci, quelli in superficie); la scena va al rallentatore (un secondo di luce dura due secondi).
   Colori della luce dalla lunghezza d'onda (approssimazione di Bruton, come nel video quanti/fotoelettrico); ultravioletto
   e infrarosso sono invisibili: grigi e tratteggiati. Elettroni azzurri (colore 1, velocità), energie in verde (3).
   Modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-fotoelettrico .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-fotoelettrico .lab-scena > svg { width: 100%; height: 100%; }
    .lab-fotoelettrico svg text { font-family: var(--font); }
    .lab-fotoelettrico .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-fotoelettrico .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-fotoelettrico .consegna:empty { display: none; }
    .lab-fotoelettrico .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .5em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.2em; }
    .lab-fotoelettrico .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-fotoelettrico .formula .ignoto { color: var(--testo3); }
    .lab-fotoelettrico .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-fotoelettrico .formula .nulla { color: var(--testo2); font-size: .9em; }
    .lab-fotoelettrico .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-fotoelettrico .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; flex-wrap: wrap; }
    .lab-fotoelettrico .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-fotoelettrico .lab-barra { gap: 5px; } .lab-fotoelettrico .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-fotoelettrico .lab-barra .btn[hidden] { display: none; }
    .lab-fotoelettrico .btn[disabled] { opacity: .38; cursor: default; }
    .lab-fotoelettrico .lab-parametri { max-width: 520px; }
    .lab-fotoelettrico .lab-param { gap: 2px; }
    .lab-fotoelettrico .lab-param .nome { min-width: 1em; }
    .lab-fotoelettrico .lab-param output { min-width: 2.2em; white-space: nowrap; }
    .lab-fotoelettrico .lab-param[data-p="met"] .nome { display: none; }
    .lab-fotoelettrico .lab-param[data-p="met"] output { min-width: 3.3em; }
    .lab-fotoelettrico .lab-param .unita { font-size: .75rem; color: var(--testo2); font-weight: 500; }
    .lab-fotoelettrico .lab-param.fisso .btn { visibility: hidden; }
    .lab-fotoelettrico .lab-param.fisso output { color: var(--testo2); }
    .lab-fotoelettrico .lab-param[hidden] { display: none; }
    .lab-fotoelettrico .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-fotoelettrico .lab-parametri .b-casuale { justify-self: center; }
    .lab-fotoelettrico .conta { position: absolute; right: 10px; bottom: 6px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-fotoelettrico .vinto { display: inline-block; animation: lab-fotoelettrico-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-fotoelettrico-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-fotoelettrico .formula .nome-stretto { display: none; }
    .lab-fotoelettrico .b-ric .stretto { display: none; }
    .lab-fotoelettrico.con-risposta .b-ric .stretto { display: inline; }
    .lab-fotoelettrico.con-risposta .b-ric .largo { display: none; }
    @container lab (max-width: 420px) { .lab-fotoelettrico .formula .simbolo { display: none; } .lab-fotoelettrico .formula .nome-stretto { display: inline; } }
    /* layout fermo: i numeri che cambiano e i cambi di livello non spostano niente */
    .lab-fotoelettrico .consegna { min-height: 2.9em; }   /* righe riservate alla consegna più lunga */
    .lab-fotoelettrico .formula { height: 7.7rem; min-height: 0; overflow: hidden; align-content: center; }   /* altezza fissa: un caso troppo grande si rimpicciolisce (adattaFormula) */
    .lab-fotoelettrico .lab-messaggio { min-height: 3.2em; }   /* due righe riservate al messaggio */
    @container lab (max-width: 420px) { .lab-fotoelettrico .consegna { min-height: 4.5em; } .lab-fotoelettrico .formula { height: 5.4rem; } }
    .lab-fotoelettrico .lab-param output { text-align: center; }
    .lab-fotoelettrico .lab-param[data-p="lam"] output { width: 6.8ch; min-width: 6.8ch; }   /* larga quanto «1000 nm» */
    .lab-fotoelettrico .lab-param[data-p="N"] output { width: 5.4ch; min-width: 5.4ch; }   /* «50 /s» */
    .lab-fotoelettrico .lab-param[data-p="met"] output { width: 5.2em; min-width: 5.2em; }   /* «magnesio» */
    .lab-fotoelettrico .lab-param[data-p="V"] output, .lab-fotoelettrico .lab-param[data-p="Wg"] output { width: 2.7em; min-width: 2.7em; }   /* le cifre di questo carattere non sono tutte larghe uguali */
    .lab-fotoelettrico .lab-barra .b-luce { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* «⏻ Spegni» largo quanto «💡 Accendi» */
    .lab-fotoelettrico .lab-barra .b-luce::after { content: '💡 Accendi'; content: '💡 Accendi' / ''; height: 0; overflow: hidden; visibility: hidden; }
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-fotoelettrico .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-fotoelettrico .lab-lato { min-height: 23.1rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-fotoelettrico .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 25.9rem) / 2)); padding-bottom: max(14px, calc((100cqh - 25.9rem) / 2)); } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const HC = 1240;                                   /* h·c in eV·nm: E (eV) = 1240 / λ (nm) */
  const L_MIN = 200, L_MAX = 1000, VIS = [380, 750];  /* lo spettro della manopola e il visibile */
  const METALLI = [
    { nome: 'cesio', W: 2.1, del: 'del cesio' }, { nome: 'sodio', W: 2.3, del: 'del sodio' }, { nome: 'calcio', W: 2.9, del: 'del calcio' }, { nome: 'zinco', W: 4.3, del: 'dello zinco' }
  ];
  const MISTERO = { nome: 'magnesio', W: 3.7, misterioso: true };
  const LIM = { lam: [L_MIN, L_MAX, 5], N: [0, 50, 5], V: [0, 5, 0.1], met: [0, 3, 1], Wg: [1, 5, 0.1] };

  /* la frazione di K_max con cui esce l'elettrone numero i: uno su quattro esce con K_max, gli altri sparsi fra 0,1 e 1 */
  function uSeq(i) { if (i % 4 === 0) return 1; const x = i * 0.6180339887; return 0.1 + 0.9 * (x - Math.floor(x)); }

  /* un secondo di luce: p = { lam (nm), N (fotoni/s), V (volt) }, W in eV */
  function esito(p, W) {
    const E = HC / p.lam, K = E - W, n = Math.max(0, Math.round(p.N));
    const emette = K > 1e-9 && n > 0;
    const el = [];
    let arrivano = 0;
    if (emette) for (let i = 0; i < n; i++) {
      const k = K * uSeq(i), arr = k > p.V + 1e-9;
      if (arr) arrivano++;
      el.push({ k, arr });
    }
    return { E, K, n, emette, el, escono: emette ? n : 0, arrivano };
  }
  const metallo = L => L.metallo === 'mistero' ? MISTERO : METALLI.filter(m => m.nome === L.metallo)[0];

  /* ---------------- livelli ----------------
     fissi: i comandi bloccati; mostraV: c'è la tensione frenante; le soluzioni sono contate da lab-fotoelettrico-livelli.js
     (λ a passi di 5 nm, N a passi di 5, V a passi di 0,1 V) */
  const LIVELLI = [
    { consegna: 'Lastra di <b>sodio</b>. Fai uscire almeno un elettrone.',
      metallo: 'sodio', inizio: { lam: 700, N: 25, V: 0 }, scopo: 'emetti' },                                  /* λ ≤ 535 nm */
    { consegna: 'Lastra di <b>zinco</b>: fai uscire almeno un elettrone anche da qui.',
      metallo: 'zinco', inizio: { lam: 450, N: 25, V: 0 }, scopo: 'emetti' },                                  /* λ ≤ 285 nm */
    { consegna: 'Escono <b>10</b> elettroni al secondo. Falli diventare <b>30</b>, con la stessa K<sub>max</sub> di adesso.',
      metallo: 'sodio', inizio: { lam: 450, N: 10, V: 0 }, scopo: 'corrente', obiettivo: 30 },                 /* N = 30 e λ = 450 */
    { consegna: 'Trova la tensione frenante <b>V</b> più bassa che ferma tutti gli elettroni.',
      metallo: 'sodio', inizio: { lam: 380, N: 20, V: 0 }, fissi: ['lam'], mostraV: true, scopo: 'arresto' },  /* V = 1,0 V */
    { consegna: 'Lastra di <b>cesio</b>, tensione frenante <b>1,5&nbsp;V</b>: fai arrivare elettroni al collettore.',
      metallo: 'cesio', inizio: { lam: 450, N: 20, V: 1.5 }, fissi: ['V'], mostraV: true, scopo: 'arriva' },   /* λ ≤ 340 nm */
    { consegna: 'Lastra di <b>calcio</b>: i più veloci devono uscire con un\'energia fra <b>1,0</b> e <b>1,2&nbsp;eV</b>.',
      metallo: 'calcio', inizio: { lam: 400, N: 20, V: 0 }, scopo: 'kmax', da: 1.0, a: 1.2 },                   /* 305, 310, 315 nm */
    { consegna: 'Lastra misteriosa: misura il suo lavoro di estrazione <b>W</b>, poi Rispondi.',
      metallo: 'mistero', inizio: { lam: 400, N: 20, V: 0, Wg: 2.5 }, mostraV: true, scopo: 'W', tolW: 0.15 }  /* W = 3,7 eV */
  ];

  /* il verdetto di un'accensione: { ok, testo } (il testo dice solo che cosa è successo) */
  function verdetto(L, p, r) {
    const W = metallo(L).W;
    if (p.N <= 0) return { ok: false, testo: 'Intensità zero: la lampada non manda nessun fotone.' };
    if (L.scopo === 'emetti') {
      if (r.emette) return { ok: true, testo: 'Escono ' + r.escono + ' elettroni al secondo.' };
      return { ok: false, testo: 'Nessun elettrone: ' + p.N + ' fotoni al secondo da ' + num(r.E, 2) + '\u00a0eV, e la lastra chiede ' + num(W, 1) + '\u00a0eV a fotone.' };
    }
    if (L.scopo === 'corrente') {
      const K0 = HC / L.inizio.lam - W;
      if (!r.emette) return { ok: false, testo: 'Nessun elettrone: i fotoni da ' + num(r.E, 2) + '\u00a0eV non bastano.' };
      const stessa = Math.abs(r.K - K0) < 0.005;
      if (r.escono === L.obiettivo && stessa) return { ok: true, testo: '30 elettroni al secondo, con la K_max di prima.' };
      if (r.escono === L.obiettivo) return { ok: false, testo: '30 al secondo, ma ora escono con K_max = ' + num(r.K, 2) + '\u00a0eV invece di ' + num(K0, 2) + '.' };
      return { ok: false, testo: 'Escono ' + r.escono + ' elettroni al secondo' + (stessa ? '.' : ', con K_max = ' + num(r.K, 2) + '\u00a0eV.') };
    }
    if (L.scopo === 'arresto') {
      if (!r.emette) return { ok: false, testo: 'Non esce nessun elettrone.' };
      if (r.arrivano > 0) return { ok: false, testo: 'Ne arrivano ancora ' + r.arrivano + ' al secondo: i più veloci passano.' };
      if (p.V - r.K >= 0.1 - 1e-9) return { ok: false, testo: 'Fermati tutti, ma con più tensione del necessario: cerca la più bassa.' };
      return { ok: true, testo: 'Fermati tutti, e con 0,1\u00a0V in meno qualcuno passerebbe.' };
    }
    if (L.scopo === 'arriva') {
      if (r.arrivano > 0) return { ok: true, testo: 'Arrivano ' + r.arrivano + ' elettroni al secondo.' };
      if (r.emette) return { ok: false, testo: 'Escono ' + r.escono + ' elettroni al secondo, ma nessuno supera ' + num(p.V, 1) + '\u00a0V: tornano indietro.' };
      return { ok: false, testo: 'Non esce nessun elettrone.' };
    }
    if (L.scopo === 'kmax') {
      if (!r.emette) return { ok: false, testo: 'Non esce nessun elettrone.' };
      if (r.K >= L.da - 1e-9 && r.K <= L.a + 1e-9) return { ok: true, testo: 'K_max = ' + num(r.K, 2) + '\u00a0eV.' };
      return { ok: false, testo: 'K_max = ' + num(r.K, 2) + '\u00a0eV: ' + (r.K < L.da ? 'troppo poco.' : 'troppo.') };
    }
    /* la lastra misteriosa: l'accensione è solo una misura */
    if (!r.emette) return { ok: false, testo: 'Non esce nessun elettrone.', misura: true };
    return { ok: false, testo: r.arrivano > 0 ? 'Escono ' + r.escono + ' elettroni al secondo, ne arrivano ' + r.arrivano + '.' : 'Escono ' + r.escono + ' elettroni al secondo, nessuno arriva.', misura: true };
  }
  function risposta(L, Wg) { return Math.abs(Wg - metallo(L).W) <= L.tolW + 1e-9; }

  const LIBERO = { metallo: 'sodio', mostraV: true, scopo: 'libero' };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    (p, r) => 'A ' + p.lam + '\u00a0nm ogni fotone porta ' + num(r.E, 2) + '\u00a0eV, più dei 2,3 del sodio: basta un fotone, non tanta luce.',
    (p, r) => 'Lo zinco chiede 4,3\u00a0eV: nessun colore visibile basta, serve l\'ultravioletto sotto i 288\u00a0nm.',
    (p, r) => 'Tre volte i fotoni, tre volte gli elettroni: K_max resta quella, perché il colore è lo stesso.',
    (p, r) => 'K_max = ' + num(r.K, 2) + '\u00a0eV, e il potenziale d\'arresto è V₀ = K_max/e: qualunque sia l\'intensità.',
    (p, r) => 'Per superare 1,5\u00a0V serve K_max sopra 1,5\u00a0eV: E oltre 3,6\u00a0eV, cioè λ sotto i 344\u00a0nm.',
    (p, r) => 'K_max = E − W: con λ = ' + p.lam + '\u00a0nm, E = ' + num(r.E, 2) + '\u00a0eV, e tolti i 2,9 del calcio resta ' + num(r.K, 2) + '\u00a0eV.',
    (p, r) => 'Era magnesio: W = 3,7\u00a0eV = E − e·V₀; alla soglia V₀ è zero e W = E.'
  ];

  const AIUTO = 'La lampada manda fotoni del colore scelto: trascina sullo spettro in alto, o usa − e + su λ (passi di 5\u00a0nm). Ogni fotone porta E = h·f = hc/λ, con hc ≈ 1240\u00a0eV·nm. N è l\'intensità: quanti fotoni al secondo. Se E supera il lavoro di estrazione W, il fotone strappa un elettrone (azzurro), che esce con energia fino a K_max = E − W; se no, viene assorbito e basta. Premi Accendi: la lampada resta accesa un secondo (la scena va al rallentatore). Qui ogni fotone sopra la soglia strappa un elettrone; nella realtà ne riesce uno ogni tanto. Ultravioletto (sotto 380\u00a0nm) e infrarosso (oltre 750\u00a0nm) non si vedono: sono grigi e tratteggiati.';
  const AIUTI = {
    3: ' Il collettore a destra è a una tensione frenante V: un elettrone ci arriva solo se K > e·V, altrimenti si ferma e torna indietro. Gli elettroni non escono tutti con la stessa energia: i più veloci, uno su quattro qui, hanno K_max. Conta la tensione più bassa, a passi di 0,1\u00a0V, che li ferma tutti.',
    4: ' Il collettore è a 1,5\u00a0V di tensione frenante: ci arriva solo chi ha K > 1,5\u00a0eV.',
    5: ' Il risultato K_max compare dopo l\'accensione. Il livello è superato se è fra 1,0 e 1,2\u00a0eV, estremi compresi.',
    6: ' Il metallo è ignoto, quindi K_max non si può calcolare: si misura. Il potenziale d\'arresto V₀ è la tensione che ferma anche i più veloci, ed e·V₀ = K_max. Imposta la tua stima di W, poi Rispondi (prima però misura: almeno un\'accensione che fa uscire elettroni). La risposta è giusta se sbagli di 0,15\u00a0eV al massimo.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è obiettivo. Scegli colore, intensità N, metallo e tensione frenante V, e accendi: la lampada resta accesa finché non la spegni, e puoi cambiare tutto mentre è accesa. Lavori di estrazione: cesio 2,1\u00a0eV, sodio 2,3, calcio 2,9, zinco 4,3. «Casuale» propone una prova a caso.';

  /* ---------------- numeri e colori ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  /* il colore della luce di lunghezza d'onda nm (Bruton, come nel video); null fuori dal visibile */
  function colLuce(nm) {
    if (nm < VIS[0] || nm > VIS[1]) return null;
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
    const k = nm < 420 ? .3 + .7 * (nm - 380) / 40 : nm > 700 ? .3 + .7 * (780 - nm) / 80 : 1;
    const q = v => Math.round(255 * Math.pow(morsa(v * k, 0, 1), .8));
    return 'rgb(' + q(r) + ',' + q(g) + ',' + q(b) + ')';
  }
  const banda = nm => nm < VIS[0] ? 'ultravioletto' : nm > VIS[1] ? 'infrarosso' : 'visibile';

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };

  QUANTO.registraLab({
    id: 'fotoelettrico',
    fisica: { esito, verdetto, risposta, LIVELLI, METALLI, MISTERO, uSeq, colLuce },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-fotoelettrico')) { const s = document.createElement('style'); s.id = 'stile-lab-fotoelettrico'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-fotoelettrico');
      const param = (k, nome, cosa) => '<div class="lab-param" data-p="' + k + '" title="' + cosa + '"><span class="nome">' + nome + '</span>' +
        '<button type="button" class="btn piccolo" data-d="-1" aria-label="' + cosa + ': meno">−</button><output></output>' +
        '<button type="button" class="btn piccolo" data-d="1" aria-label="' + cosa + ': più">+</button></div>';
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, colore, intensità, metallo e tensione li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${param('lam', ctx.tex('\\lambda'), 'lunghezza d\'onda della luce')}
              ${param('N', ctx.tex('N'), 'intensità: fotoni al secondo')}
              ${param('V', ctx.tex('V'), 'tensione frenante')}
              ${param('met', '', 'metallo della lastra')}
              ${param('Wg', ctx.tex('W'), 'la tua stima del lavoro di estrazione')}
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-luce">💡 Accendi</button>
              <button type="button" class="btn primario b-risp" hidden>Rispondi</button>
              <button type="button" class="btn piccolo b-ric"></button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { luce: q('.b-luce'), risp: q('.b-risp'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = {}; ['lam', 'N', 'V', 'met', 'Wg'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ---------------- */
      const T_ACCESA = 2.0;    /* un secondo di luce, al rallentatore: dura 2 s */
      const TF = 0.45;         /* volo di un fotone dalla lampada alla lastra (s) */
      const T_UNO = 0.7;       /* un elettrone da 1 eV, senza tensione, attraversa il tubo in 0,7 s */
      const T_MAX_EL = 4;      /* gli elettroni lentissimi si smettono di disegnare dopo 4 s (il conto resta quello della fisica) */
      let livello = 0, p = { lam: 700, N: 25, V: 0, met: 1, Wg: 2.5 };
      let accensioni = 0, risposte = 0, finito = false, animando = false, lampada = false, raf = 0;
      let ultimo = null, detti = {}, sbagliRisp = 0, misurato = false;   /* misurato: almeno un'accensione ha fatto uscire elettroni */
      let libero = false, salvato = null;
      let fotoni = [], elettroni = [], lampi = [], colpo = null, vivi = null, ta = 0, tPrec = null, accumulo = 0, iSeq = 0;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const metCorr = () => libero ? METALLI[p.met] : metallo(LIVELLI[livello]);
      const html = t => String(t).replace(/K_max/g, 'K<sub>max</sub>').replace(/V₀/g, 'V<sub>0</sub>').replace(/(\d) (eV|V|nm)(?![a-zà-ù])/g, '$1&nbsp;$2');

      /* ---------------- scena: SVG in pixel veri, ridisegnato quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Una lampada illumina una lastra di metallo in un tubo a vuoto; davanti c\'è il collettore', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const idTr = 'fe-tratt-' + Math.random().toString(36).slice(2, 7);
      const defs = el('defs');
      const pat = el('pattern', { id: idTr, width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
      pat.appendChild(el('rect', { width: 6, height: 6, fill: 'var(--sup2)' }));
      pat.appendChild(el('line', { x1: 1, y1: 0, x2: 1, y2: 6, stroke: 'var(--testo3)', 'stroke-width': 2 }));
      defs.appendChild(pat); svg.appendChild(defs);
      const gFondo = el('g'), gSpettro = el('g'), gLampada = el('g'), gPart = el('g'), gTesti = el('g');
      [gFondo, gSpettro, gLampada, gPart, gTesti].forEach(g => svg.appendChild(g));

      let S = null;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(260, Math.round(r.width)), h = Math.max(230, Math.round(r.height));
        const m = 12, LH = morsa(h * 0.15, 44, 110), CH = morsa(h * 0.17, 54, 110);
        const yT = 66 + LH, yB = h - CH, th = yB - yT;
        const bw = Math.min(w - 2 * m, Math.max(th * 3.2, 220)), bx0 = (w - bw) / 2, bx1 = bx0 + bw;
        const xc = bx0 + 0.13 * bw, xa = bx1 - 0.1 * bw, pw = morsa(bw * 0.025, 8, 14);
        const py0 = yT + 0.22 * th, py1 = yB - 0.17 * th;
        const R = morsa(LH * 0.2, 9, 16);
        S = { w, h, m, LH, CH, yT, yB, th, bw, bx0, bx1, xc, xa, pw, py0, py1, R,
          xl: xc + 0.42 * (xa - xc), yl: 66 + LH * 0.42,
          sx0: m + 4, sx1: w - m - 4, sy0: 23, sy1: 43,
          e0: xc + pw / 2 + 4, e1: xa - 7, yW: yB + morsa(CH * 0.33, 17, 34) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const XS = nm => S.sx0 + (nm - L_MIN) / (L_MAX - L_MIN) * (S.sx1 - S.sx0);
      const NMX = x => L_MIN + (x - S.sx0) / (S.sx1 - S.sx0) * (L_MAX - L_MIN);
      const testo = (g, x, y, t, a) => { const e = el('text', Object.assign({ x, y, fill: 'var(--testo)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, a || {}), t); g.appendChild(e); return e; };

      /* lo spettro: la manopola del colore (ultravioletto e infrarosso grigi e tratteggiati: non si vedono) */
      function disegnaSpettro() {
        vuota(gSpettro);
        const y0 = S.sy0, hh = S.sy1 - S.sy0, fisso = !libero && (liv().fissi || []).indexOf('lam') >= 0;
        gSpettro.appendChild(el('rect', { x: XS(L_MIN), y: y0, width: XS(VIS[0]) - XS(L_MIN), height: hh, fill: 'url(#' + idTr + ')' }));
        gSpettro.appendChild(el('rect', { x: XS(VIS[1]), y: y0, width: XS(L_MAX) - XS(VIS[1]), height: hh, fill: 'url(#' + idTr + ')' }));
        for (let nm = VIS[0]; nm < VIS[1]; nm += 5) gSpettro.appendChild(el('rect', { x: XS(nm), y: y0, width: XS(nm + 5) - XS(nm) + 0.6, height: hh, fill: colLuce(nm + 2.5) }));
        gSpettro.appendChild(el('rect', { x: S.sx0, y: y0, width: S.sx1 - S.sx0, height: hh, fill: 'none', stroke: 'var(--bordo2)', 'stroke-width': 1, rx: 2 }));
        testo(gSpettro, (XS(L_MIN) + XS(VIS[0])) / 2, y0 + 15, 'UV', { 'text-anchor': 'middle', style: 'font: 600 12px var(--font)', fill: 'var(--testo2)' });
        testo(gSpettro, (XS(VIS[1]) + XS(L_MAX)) / 2, y0 + 15, 'IR', { 'text-anchor': 'middle', style: 'font: 600 12px var(--font)', fill: 'var(--testo2)' });
        [200, 400, 600, 800, 1000].forEach(nm => {
          gSpettro.appendChild(el('line', { x1: XS(nm), y1: S.sy1, x2: XS(nm), y2: S.sy1 + 4, stroke: 'var(--testo2)', 'stroke-width': 1 }));
          testo(gSpettro, XS(nm), S.sy1 + 16, nm === 1000 ? '1000\u00a0nm' : String(nm), { 'text-anchor': nm === 200 ? 'start' : nm === 1000 ? 'end' : 'middle', style: 'font: 12px var(--font)', fill: 'var(--testo2)', 'stroke-width': 2 });
        });
        /* il segno della λ scelta */
        const x = XS(p.lam), col = fisso ? 'var(--testo2)' : 'var(--testo)';
        gSpettro.appendChild(el('line', { x1: x, y1: y0 - 2, x2: x, y2: S.sy1 + 2, stroke: 'var(--sup)', 'stroke-width': 5 }));
        gSpettro.appendChild(el('line', { x1: x, y1: y0 - 2, x2: x, y2: S.sy1 + 2, stroke: col, 'stroke-width': 2.2 }));
        gSpettro.appendChild(el('path', { d: 'M' + x + ' ' + (y0 - 1) + ' l-6 -7 h12 z', fill: col }));
        testo(gSpettro, morsa(x, S.sx0 + 26, S.sx1 - 26), 14, p.lam + '\u00a0nm', { 'text-anchor': 'middle', style: 'font: 700 12px var(--font)', fill: col });
      }

      /* il tubo, la lastra, il collettore, il circuito (cambiano solo con la geometria, il livello e i comandi) */
      const letture = {};
      function disegnaFondo() {
        vuota(gFondo); vuota(gTesti);
        const L = liv(), mostraV = libero || !!L.mostraV, M = metCorr();
        /* il circuito sotto il tubo */
        const yW = S.yW, xB = S.xc + 0.24 * (S.xa - S.xc), xA = S.xc + 0.7 * (S.xa - S.xc), rA = 11;
        const filo = (x1, y1, x2, y2) => gFondo.appendChild(el('line', { x1, y1, x2, y2, stroke: 'var(--testo2)', 'stroke-width': 1.8 }));
        filo(S.xc, S.py1, S.xc, yW); filo(S.xa, S.py1, S.xa, yW);
        if (mostraV) {
          filo(S.xc, yW, xB - 4, yW); filo(xB + 4, yW, xA - rA, yW);
          gFondo.appendChild(el('line', { x1: xB - 4, y1: yW - 12, x2: xB - 4, y2: yW + 12, stroke: 'var(--testo)', 'stroke-width': 2 }));   /* + (lunga), verso la lastra */
          gFondo.appendChild(el('line', { x1: xB + 4, y1: yW - 6, x2: xB + 4, y2: yW + 6, stroke: 'var(--testo)', 'stroke-width': 4 }));    /* − (corta), verso il collettore */
          letture.V = testo(gTesti, xB, yW + 29, '', { 'text-anchor': 'middle' });
        } else { filo(S.xc, yW, xA - rA, yW); letture.V = null; }
        filo(xA + rA, yW, S.xa, yW);
        gFondo.appendChild(el('circle', { cx: xA, cy: yW, r: rA, fill: 'var(--sup)', stroke: 'var(--testo)', 'stroke-width': 1.8 }));
        gFondo.appendChild(el('text', { x: xA, y: yW + 4.5, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 700 12px var(--font)' }, 'A'));
        letture.arr = testo(gTesti, morsa(xA, 56, S.w - 56), yW + 29, '', { 'text-anchor': 'middle' });
        /* il tubo a vuoto */
        gFondo.appendChild(el('rect', { x: S.bx0, y: S.yT, width: S.bw, height: S.th, rx: Math.min(28, S.th * 0.25), fill: 'var(--sup)', 'fill-opacity': .6, stroke: 'var(--bordo2)', 'stroke-width': 2 }));
        /* la lastra (metallo) e il collettore */
        gFondo.appendChild(el('rect', { x: S.xc - S.pw / 2, y: S.py0, width: S.pw, height: S.py1 - S.py0, rx: 2, fill: '#9aa3ab', stroke: 'var(--testo2)', 'stroke-width': 1.2 }));
        gFondo.appendChild(el('rect', { x: S.xa - 3, y: S.py0, width: 6, height: S.py1 - S.py0, rx: 2, fill: 'var(--testo2)' }));
        testo(gTesti, S.bx0 + 8, S.py0 - 9, M.misterioso ? 'lastra misteriosa, W = ?' : M.nome + ', W = ' + num(M.W, 1) + '\u00a0eV', { 'text-anchor': 'start' });
        testo(gTesti, S.xa + 5, S.py0 - 9, 'collettore', { 'text-anchor': 'end', style: 'font: 12px var(--font)', fill: 'var(--testo2)' });
        letture.esc = testo(gTesti, S.e0 + 4, S.py1 + 17, '', { 'text-anchor': 'start', style: 'font: 600 12px var(--font)', fill: 'var(--s1)' });
        letture.conta = testo(gTesti, S.bx0 + 2, 66 + 14, '', { 'text-anchor': 'start', style: 'font: 12px var(--font)', fill: 'var(--testo2)' });
        letture.E = testo(gTesti, S.xl + S.R + 8, S.yl + 2, '', { 'text-anchor': 'start', fill: 'var(--s3)', style: 'font: 700 13px var(--font)' });
        letture.banda = testo(gTesti, S.xl + S.R + 8, S.yl + 17, '', { 'text-anchor': 'start', style: 'font: 12px var(--font)', fill: 'var(--testo2)' });
        aggiornaLetture();
      }

      /* la lampada: accesa del suo colore (grigia e tratteggiata se la luce non si vede), con il fascio verso la lastra */
      let statoLampada = '';
      function disegnaLampada(accesa) {
        const chiave = (accesa ? 1 : 0) + '|' + p.lam + '|' + S.w + 'x' + S.h;
        if (chiave === statoLampada) return; statoLampada = chiave;
        vuota(gLampada);
        const col = colLuce(p.lam), x = S.xl, y = S.yl, R = S.R;
        if (accesa) {
          gLampada.appendChild(el('path', { d: 'M' + (x - R * 0.7) + ' ' + (y + R * 0.7) + ' L' + (S.xc + S.pw / 2) + ' ' + S.py0 + ' L' + (S.xc + S.pw / 2) + ' ' + S.py1 + ' L' + (x + R * 0.7) + ' ' + (y + R * 0.7) + ' Z',
            fill: col || 'var(--testo3)', 'fill-opacity': col ? .13 : .08 }));
        }
        gLampada.appendChild(el('rect', { x: x - R * 0.55, y: y - R - 7, width: R * 1.1, height: 8, rx: 2, fill: 'var(--testo2)' }));
        gLampada.appendChild(el('circle', { cx: x, cy: y, r: R, fill: accesa ? (col || 'url(#' + idTr + ')') : 'var(--sup)', stroke: accesa && col ? col : 'var(--testo2)', 'stroke-width': 2, 'stroke-dasharray': accesa && !col ? '3 3' : 'none' }));
        if (accesa && col) gLampada.appendChild(el('circle', { cx: x, cy: y, r: R + 5, fill: 'none', stroke: col, 'stroke-width': 3, opacity: .35 }));
      }

      /* un fotone è un pacchetto d'onda: più corta la λ, più fitte le creste */
      function pacchetto(lam) {
        const per = 2.4 + lam / 110, Lp = 18, A = 3.2;
        let d = '';
        for (let s = -Lp / 2; s <= Lp / 2 + 1e-6; s += 0.75) d += (d ? ' L' : 'M') + s.toFixed(2) + ' ' + (A * Math.cos(Math.PI * s / Lp) * Math.sin(2 * Math.PI * s / per)).toFixed(2);
        return d;
      }
      const yFraz = i => { const x = 0.5 + i * 0.7548776662; return 0.06 + 0.88 * (x - Math.floor(x)); };

      function disegnaParticelle() {
        vuota(gPart);
        const x0 = S.xl, y0 = S.yl + S.R * 0.6, xf = S.xc + S.pw / 2 + 1;
        fotoni.forEach(f => {
          const s = morsa((ta - f.t0) / TF, 0, 1); if (ta < f.t0) return;
          const yf = S.py0 + f.y * (S.py1 - S.py0), x = x0 + (xf - x0) * s, y = y0 + (yf - y0) * s;
          const ang = Math.atan2(yf - y0, xf - x0) * 180 / Math.PI, col = colLuce(f.lam);
          const g = el('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')' });
          g.appendChild(el('path', { d: f.d, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 4.5, opacity: .2, 'stroke-linecap': 'round' }));
          g.appendChild(el('path', { d: f.d, fill: 'none', stroke: col || 'var(--testo2)', 'stroke-width': 2, 'stroke-dasharray': col ? 'none' : '2.5 2', 'stroke-linecap': 'round' }));
          gPart.appendChild(g);
        });
        lampi.forEach(l => {
          const s = morsa((ta - l.t0) / 0.3, 0, 1), col = colLuce(l.lam);
          gPart.appendChild(el('circle', { cx: xf, cy: S.py0 + l.y * (S.py1 - S.py0), r: 3 + 7 * s, fill: 'none', stroke: col || 'var(--testo2)', 'stroke-width': 1.6, opacity: (0.8 * (1 - s)).toFixed(2), 'stroke-dasharray': col ? 'none' : '2 2' }));
        });
        const D = S.e1 - S.e0;
        elettroni.forEach(e => {
          const t = ta - e.t0; if (t < 0) return;
          const tt = Math.min(t, e.tF), x = e.v0 * tt - e.a * tt * tt / 2;
          const sbiadito = t > T_MAX_EL - 0.5 ? morsa((T_MAX_EL - t) / 0.5, 0, 1) : 1;
          gPart.appendChild(el('circle', { cx: (S.e0 + morsa(x, 0, 1) * D).toFixed(1), cy: (S.py0 + e.y * (S.py1 - S.py0)).toFixed(1), r: 3.8, fill: 'var(--s1)', stroke: 'var(--sup)', 'stroke-width': 1, opacity: sbiadito.toFixed(2) }));
        });
      }

      function ridisegnaTutto() { geometria(); statoLampada = ''; disegnaFondo(); disegnaSpettro(); disegnaLampada(lampadaAccesa()); disegnaParticelle(); }
      const lampadaAccesa = () => libero ? lampada : !!(colpo && ta < colpo.tLuce);

      /* le scritte della scena che cambiano: energia del fotone, elettroni che escono e che arrivano, tensione, contatori */
      function aggiornaLetture() {
        if (!letture.E) return;
        const E = HC / p.lam, inv = banda(p.lam);
        letture.E.textContent = 'E = ' + num(E, 2) + '\u00a0eV';
        letture.banda.textContent = inv === 'visibile' ? '' : inv + ', invisibile';
        if (letture.V) letture.V.textContent = 'V = ' + num(p.V, 1) + '\u00a0V';
        let esc = '', arr = '';
        if (libero) {
          if (lampada) { const r = esito(p, metCorr().W); esc = r.escono + '/s'; arr = r.arrivano + '/s'; }
        } else if (colpo) { esc = String(vivi.escono); arr = String(vivi.arrivano); }
        else if (ultimo) { esc = ultimo.r.escono + '/s'; arr = ultimo.r.arrivano + '/s'; }
        letture.esc.textContent = esc ? 'escono: ' + esc : '';
        letture.arr.textContent = arr ? 'arrivano: ' + arr : 'arrivano: —';
        letture.conta.textContent = libero ? '' : 'accensioni: ' + accensioni + (liv().scopo === 'W' ? ' · risposte: ' + risposte : '');
      }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const L = liv(), fissi = libero ? [] : (L.fissi || []);
        box.lam.querySelector('output').innerHTML = p.lam + '<span class="unita">&nbsp;nm</span>';
        box.N.querySelector('output').innerHTML = p.N + '<span class="unita">&nbsp;/s</span>';
        box.V.querySelector('output').innerHTML = num(p.V, 1) + '<span class="unita">&nbsp;V</span>';
        box.met.querySelector('output').textContent = METALLI[p.met].nome;
        box.Wg.querySelector('output').innerHTML = num(p.Wg, 1) + '<span class="unita">&nbsp;eV</span>';
        box.V.hidden = !(libero || L.mostraV);
        box.met.hidden = !libero;
        box.Wg.hidden = libero || L.scopo !== 'W';
        ['lam', 'N', 'V', 'met', 'Wg'].forEach(k => {
          const fisso = fissi.indexOf(k) >= 0;
          box[k].classList.toggle('fisso', fisso);
          box[k].querySelectorAll('button').forEach(bt => {
            const d = +bt.dataset.d;
            bt.disabled = fisso || animando || (d < 0 ? p[k] <= LIM[k][0] + 1e-9 : p[k] >= LIM[k][1] - 1e-9);
          });
        });
        box.lam.title = fissi.indexOf('lam') >= 0 ? 'Colore fisso in questo livello' : 'lunghezza d\'onda della luce';
        box.V.title = fissi.indexOf('V') >= 0 ? 'Tensione fissa in questo livello' : 'tensione frenante';
      }
      /* il ponte con la teoria: E = hc/λ subito; K_max = E − W con il risultato dopo l'accensione (in modalità libera subito) */
      /* la formula ha un'altezza fissa: se un caso non ci sta, si rimpicciolisce invece di spingere il resto */
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
      function adattaFormula() {
        formulaEl.style.fontSize = '';
        const f0 = parseFloat(getComputedStyle(formulaEl).fontSize);
        let f = f0;
        while ((formulaEl.scrollHeight > formulaEl.clientHeight + 1 || formulaEl.scrollWidth > formulaEl.clientWidth + 1) && f > f0 * 0.7) { f *= 0.93; formulaEl.style.fontSize = f.toFixed(2) + 'px'; }
      }
      function aggiornaFormula() {
        const L = liv(), M = metCorr(), E = HC / p.lam, K = E - M.W;
        const fatto = libero || (ultimo && ultimo.p.lam === p.lam);
        const pezzo = (s, cls) => '<span class="pezzo' + (cls ? ' ' + cls : '') + '">' + s + '</span>';
        const numerico = s => { const i = s.indexOf(' = '); return pezzo('<span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1))); };
        const ignoto = s => pezzo(ctx.tex(s), 'ignoto');
        const pezzi = [];
        pezzi.push(pezzo(ctx.tex('E = \\dfrac{h \\cdot c}{\\lambda}'), 'simbolo'));
        pezzi.push(numerico('E = \\frac{1240}{' + p.lam + '}\\,\\text{eV} \\approx ' + texNum(E, 2) + '\\,\\text{eV}'));
        if (L.scopo === 'W') {
          pezzi.push(pezzo(ctx.tex('e \\cdot V_0 = K_{\\text{max}} = E - W')));
          pezzi.push(ignoto('W = \\ ?'));
        } else if (L.scopo === 'arresto') {
          pezzi.push(pezzo(ctx.tex('e \\cdot V_0 = K_{\\text{max}} = ' + texNum(E, 2) + ' - ' + texNum(M.W, 1))));
          pezzi.push(ignoto('= \\ ?'));
        } else {
          pezzi.push(pezzo(ctx.tex('K_{\\text{max}} = E - W'), 'simbolo'));
          pezzi.push(numerico('K_{\\text{max}} = ' + texNum(E, 2) + ' - ' + texNum(M.W, 1) + '\\,\\text{eV}'));
          if (!fatto) pezzi.push(ignoto('= \\ ?'));
          else if (K > 1e-9) pezzi.push(pezzo(ctx.tex('\\approx ' + texNum(K, 2) + '\\,\\text{eV}'), 'esito'));
          else pezzi.push(pezzo(ctx.tex('\\approx ' + texNum(K, 2) + '\\,\\text{eV}') + ' <span class="nulla">nessun elettrone</span>', 'ignoto'));
        }
        formulaEl.innerHTML = pezzi.join(''); adattaFormula();
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
      function aggiornaBottoni() {
        const L = liv();
        b.luce.textContent = libero && lampada ? '⏻ Spegni' : '💡 Accendi';
        b.luce.disabled = !libero && (animando || finito);
        b.risp.hidden = libero || L.scopo !== 'W';
        b.risp.disabled = animando || finito;
        b.ric.disabled = animando;
        b.casuale.hidden = !libero;
        radice.classList.toggle('con-risposta', !b.risp.hidden);
      }
      /* «Ricomincia» ha una forma corta (↺) quando c'è anche «Rispondi»: quattro pulsanti non stanno su una riga */
      function etichettaRic(largo, stretto) { b.ric.innerHTML = '<span class="largo">' + largo + '</span><span class="stretto">' + stretto + '</span>'; b.ric.title = largo; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); aggiornaLetture(); aggiornaBottoni(); }

      /* ---------------- livelli ---------------- */
      function fermaParticelle() { cancelAnimationFrame(raf); raf = 0; fotoni = []; elettroni = []; lampi = []; colpo = null; vivi = null; lampada = false; animando = false; }
      function avviaLivello(n) {
        fermaParticelle();
        libero = false; salvato = null; radice.classList.remove('in-libero');
        livello = n; const L = LIVELLI[n];
        p = { lam: L.inizio.lam, N: L.inizio.N, V: L.inizio.V || 0, met: 1, Wg: L.inizio.Wg || 2.5 };
        accensioni = 0; risposte = 0; finito = false; ultimo = null; detti = {}; sbagliRisp = 0; misurato = false;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        etichettaRic('Ricomincia', '↺');
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }

      /* ---------------- l'accensione ---------------- */
      function accendi() {
        aiutoEl.hidden = true;
        if (libero) {
          lampada = !lampada; accumulo = 0.999;
          if (lampada) msg.innerHTML = html(osserva()); else msg.textContent = '';
          aggiorna(); disegnaLampada(lampada); avviaLoop();
          return;
        }
        if (animando || finito) return;
        const M = metCorr(), r = esito(p, M.W), n = r.n;
        accensioni++;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; ta = 0; fotoni = []; elettroni = []; lampi = [];
        for (let i = 0; i < n; i++) fotoni.push({ t0: T_ACCESA * (i + 0.5) / n, y: yFraz(i), lam: p.lam, el: r.emette ? r.el[i] : null, V: p.V, d: pacchetto(p.lam) });
        colpo = { p: { lam: p.lam, N: p.N, V: p.V }, r, tLuce: T_ACCESA };
        vivi = { escono: 0, arrivano: 0 };
        aggiorna(); aggiornaLivelli(); avviaLoop();
      }
      function nuovoElettrone(t0, y, e, V) {
        /* in unità della distanza lastra–collettore: x = v0·t − ½·a·t², con v0² ∝ K e a ∝ V (si ferma a x = K/(e·V)) */
        const v0 = Math.sqrt(e.k) / T_UNO, a = V > 0 ? V / (2 * T_UNO * T_UNO) : 0;
        const tF = e.arr ? (a > 0 ? (v0 - Math.sqrt(Math.max(0, v0 * v0 - 2 * a))) / a : 1 / v0) : 2 * v0 / a;
        elettroni.push({ t0, y, v0, a, arr: e.arr, tF });
        if (vivi) vivi.escono++;
      }
      function avviaLoop() { if (!raf) { tPrec = null; raf = requestAnimationFrame(passo); } }
      function passo(ora) {
        const dt = tPrec == null ? 0 : Math.min(0.05, (ora - tPrec) / 1000); tPrec = ora; ta += dt;
        /* modalità libera: la lampada manda N fotoni ogni secondo di scena (2 s veri) finché è accesa */
        if (libero && lampada && p.N > 0) {
          accumulo += dt * p.N / T_ACCESA;
          const M = metCorr(), K = HC / p.lam - M.W;
          while (accumulo >= 1) {
            accumulo -= 1;
            const i = iSeq++, k = K * uSeq(i);
            fotoni.push({ t0: ta, y: yFraz(i), lam: p.lam, el: K > 1e-9 ? { k, arr: k > p.V + 1e-9 } : null, V: p.V, d: pacchetto(p.lam) });
          }
        }
        fotoni.forEach(f => {
          if (f.fatto || ta < f.t0 + TF) return;
          f.fatto = true;
          if (f.el) nuovoElettrone(f.t0 + TF, f.y, f.el, f.V); else lampi.push({ t0: f.t0 + TF, y: f.y, lam: f.lam });
        });
        fotoni = fotoni.filter(f => !f.fatto);
        lampi = lampi.filter(l => ta < l.t0 + 0.3);
        elettroni = elettroni.filter(e => {
          const t = ta - e.t0;
          if (t >= e.tF || t >= T_MAX_EL) { if (e.arr && vivi) vivi.arrivano++; return false; }
          return true;
        });
        disegnaLampada(lampadaAccesa()); disegnaParticelle();
        if (colpo) aggiornaLetture();
        if (colpo && ta >= colpo.tLuce && !fotoni.length && !elettroni.length && !lampi.length) { const c = colpo; raf = 0; fine(c); return; }
        if ((libero && lampada) || colpo || fotoni.length || elettroni.length || lampi.length) raf = requestAnimationFrame(passo);
        else raf = 0;
      }

      function fine(c) {
        colpo = null; vivi = null; animando = false;
        const L = liv(), prec = ultimo;
        ultimo = { p: c.p, r: c.r }; if (c.r.emette) misurato = true;
        disegnaLampada(false); aggiorna(); aggiornaLivelli();
        const v = verdetto(L, c.p, c.r);
        if (v.ok) { vinci(v.testo, c); return; }
        msg.innerHTML = html(v.testo); msg.className = 'lab-messaggio' + (v.misura ? '' : ' no');
        if (!v.misura) ctx.mascotte('sbagliato');
        erroreTipico(L, c.p, c.r, prec);
      }
      function vinci(testoV, c) {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + html(testoV) + (accensioni === 1 ? ' Al primo colpo.' : ' Accensioni: ' + accensioni + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaBottoni();
        const r = c ? c.r : esito(p, metCorr().W);
        ctx.zenone(html(VITTORIE[livello](p, r)), { html: true, espressione: accensioni + risposte <= 2 ? 'orgoglioso' : 'felice', durata: 7000 });
        if (livello < LIVELLI.length - 1) etichettaRic('Prossimo livello ▶', 'Avanti ▶'); else etichettaRic('Ricomincia dal primo', '↺ 1');
      }
      function rispondi() {
        const L = liv();
        if (libero || L.scopo !== 'W' || animando || finito) return;
        aiutoEl.hidden = true;
        if (!misurato) {   /* niente risposte a tentativi: prima si misura */
          msg.textContent = 'Prima misura: accendi la lampada e fai uscire qualche elettrone.'; msg.className = 'lab-messaggio no';
          return;
        }
        risposte++;
        if (risposta(L, p.Wg)) {
          msg.textContent = ''; aggiornaLetture();
          finito = true;
          msg.innerHTML = '<span class="vinto">' + html('Giusto: W = ' + num(MISTERO.W, 1) + '\u00a0eV, è magnesio.') + ' Accensioni: ' + accensioni + ', risposte: ' + risposte + '.</span>';
          msg.className = 'lab-messaggio ok';
          ctx.completato(livello); aggiornaLivelli(); aggiornaBottoni();
          ctx.zenone(html(VITTORIE[livello](p, esito(p, MISTERO.W))), { html: true, espressione: risposte === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
          etichettaRic('Ricomincia dal primo', '↺ 1');
          return;
        }
        sbagliRisp++;
        aggiornaLetture();
        msg.innerHTML = html('No, non è ' + num(p.Wg, 1) + '\u00a0eV.' + (accensioni ? '' : ' Prima misura: accendi la lampada.'));
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        /* gli errori tipici: scambiare W con E, o con K_max */
        if (ultimo && ultimo.r.emette) {
          const E = HC / ultimo.p.lam;
          if (Math.abs(p.Wg - E) < 0.15) { dici('WE', 'Quella è l\'energia del fotone. W è la parte che resta nel metallo: W = E − e·V₀.'); return; }
          if (Math.abs(p.Wg - ultimo.r.K) < 0.2 || Math.abs(p.Wg - ultimo.p.V) < 0.05) { dici('WV', 'Quello è K_max = e·V₀, l\'energia che avanza. W è quella spesa per uscire: W = E − e·V₀.'); return; }
        }
        if (sbagliRisp >= 2) dici('come', 'Cerca la tensione più bassa che ferma tutti: è V₀. Poi W = E − e·V₀.');
      }

      /* gli errori tipici che il video smonta: Stilla ne parla una volta sola per livello */
      function dici(chiave, t) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(html(t), { html: true, tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, pp, r, prec) {
        const pr = prec ? prec.p : L.inizio;   /* al primo tentativo si confronta con la partenza del livello */
        if (!r.emette && pp.N > 0) {
          if (pr && pp.N > pr.N && pp.lam === pr.lam) { dici('intensita', 'Più luce vuol dire più fotoni, ma ognuno con la stessa energia: se uno non basta, non bastano neanche mille.'); return; }
          if (pp.lam > VIS[1]) { dici('ir', 'L\'infrarosso ha fotoni ancora più deboli del rosso: oltre 750\u00a0nm l\'energia scende ancora.'); return; }
          if (L.metallo === 'zinco' && pp.lam <= 420) { dici('violetto', 'Il violetto arriva a circa 3,3\u00a0eV, e lo zinco ne chiede 4,3: bisogna uscire dal visibile.'); return; }
          if (pr && pp.lam > pr.lam) { dici('rosso', 'Verso il rosso la λ cresce e la frequenza cala: fotoni con meno energia, non di più.'); return; }
        }
        if (L.scopo === 'corrente' && pp.lam !== L.inizio.lam) { dici('colore', 'Il colore cambia l\'energia degli elettroni, non quanti sono: il numero lo decide l\'intensità.'); return; }
        if (L.scopo === 'arresto' && r.arrivano > 0 && pr && pp.N < pr.N) { dici('meno', 'Meno luce vuol dire meno elettroni, ma i più veloci hanno la stessa K_max: la tensione per fermarli non cambia.'); return; }
        if (L.scopo === 'arriva' && r.emette && !r.arrivano) {
          if (pr && pp.N > pr.N && pp.lam === pr.lam) { dici('intensita2', 'Più fotoni, più elettroni, ma i più veloci hanno sempre la stessa K_max: nessuno vince la tensione frenante di 1,5\u00a0V.'); return; }
          if (pr && pp.lam > pr.lam) dici('rosso', 'Verso il rosso i fotoni hanno meno energia, e gli elettroni escono più lenti.');
        }
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva() {
        const M = metCorr(), r = esito(p, M.W);
        if (!p.N) return 'Intensità zero: nessun fotone.';
        if (!r.emette) return 'Fotoni da ' + num(r.E, 2) + '\u00a0eV, meno dei ' + num(M.W, 1) + '\u00a0eV ' + M.del + ': nessun elettrone, a qualunque intensità.';
        let t = 'Escono ' + r.escono + ' elettroni al secondo, i più veloci con K_max = ' + num(r.K, 2) + '\u00a0eV.';
        if (p.V > 0) t += r.arrivano ? ' Ne arrivano ' + r.arrivano + '.' : ' Nessuno supera ' + num(p.V, 1) + '\u00a0V.';
        return t;
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, misurato, p: Object.assign({}, p), accensioni, risposte, finito, ultimo, detti: Object.assign({}, detti), sbagliRisp, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.innerHTML, ricT: b.ric.title };
        fermaParticelle();
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        p = { lam: 450, N: 20, V: 0, met: 1, Wg: 2.5 }; ultimo = null; finito = false; iSeq = 0;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        etichettaRic('Ricomincia', '↺');
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }
      function esciLibero() {
        const z = salvato; if (!z) return;
        fermaParticelle();
        libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; misurato = z.misurato; p = z.p; accensioni = z.accensioni; risposte = z.risposte; finito = z.finito; ultimo = z.ultimo; detti = z.detti; sbagliRisp = z.sbagliRisp;
        consegnaEl.innerHTML = z.cons; b.ric.innerHTML = z.ric; b.ric.title = z.ricT;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        const r = (lo, hi, s) => lo + Math.round(Math.random() * (hi - lo) / s) * s;
        p.lam = r(220, 800, 5); p.N = r(5, 50, 5); p.met = r(0, 3, 1); p.V = Math.random() < 0.5 ? 0 : Math.round(Math.random() * 25) / 10;
        dopoCambio(true);
      }
      function dopoCambio(fondo) {
        if (libero) { msg.innerHTML = lampada ? html(osserva()) : ''; msg.className = 'lab-messaggio'; }
        else if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (fondo) disegnaFondo();
        disegnaSpettro(); disegnaLampada(lampadaAccesa()); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        const L = liv();
        if (animando || (!libero && (L.fissi || []).indexOf(k) >= 0)) return false;
        const lim = LIM[k], nuovo = morsa(Math.round((p[k] + d * lim[2]) * 100) / 100, lim[0], lim[1]);
        if (nuovo === p[k]) return false;
        p[k] = nuovo;
        dopoCambio(k === 'met');
        return true;
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
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* il colore col dito: si trascina sullo spettro in alto */
      let mira = false;
      function punta(ev) {
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        const lam = morsa(Math.round(NMX(c.x) / 5) * 5, L_MIN, L_MAX);
        if (lam !== p.lam) { p.lam = lam; dopoCambio(false); }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || (!libero && (liv().fissi || []).indexOf('lam') >= 0)) return;
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        if (c.y > S.sy1 + 20 || c.x < S.sx0 - 10 || c.x > S.sx1 + 10) return;   /* solo sullo spettro e sulle sue tacche */
        mira = true; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        punta(ev); ev.preventDefault();
      });
      const muovi = ev => { if (mira) { punta(ev); ev.preventDefault(); } };
      const molla = () => { mira = false; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.luce.addEventListener('click', accendi);
      b.risp.addEventListener('click', rispondi);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { fermaParticelle(); p = { lam: 450, N: 20, V: 0, met: 1, Wg: 2.5 }; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').innerHTML = html(libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || ''));   /* K_max e V₀ con i pedici veri */
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
      const ridimensiona = () => {
        adattaFormula(); adattaMessaggio();
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      };
      const ro = window.ResizeObserver ? new ResizeObserver(ridimensiona) : null;
      if (ro) ro.observe(svg); else window.addEventListener('resize', ridimensiona);

      return function smonta() {
        cancelAnimationFrame(raf); raf = 0; fermaRipeti();
        if (ro) ro.disconnect(); else window.removeEventListener('resize', ridimensiona);
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
