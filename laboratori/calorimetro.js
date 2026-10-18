/* Laboratorio «Il calorimetro» — equilibrio termico e calore specifico (argomento calore).
   Si versano nel calorimetro acqua calda, acqua fredda e un blocco di metallo, scegliendo le masse (trascinando
   il livello nelle caraffe, oppure con − e +) e, quando serve, la temperatura del blocco; poi si mescola.
   La temperatura di equilibrio è quella vera, senza dispersioni: t_e = Σ m·c·t / Σ m·c (il calore ceduto è uguale
   a quello assorbito). Nel grafico ogni corpo si avvicina a t_e con lo stesso tempo caratteristico, così l'energia
   resta la stessa in ogni istante; i tempi sono indicativi. Nessun conto anticipato: il risultato compare dopo.
   Temperature arancio come nei video di calore; t in gradi Celsius, T in kelvin (livello 7).
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-calorimetro .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-calorimetro .lab-scena > svg { width: 100%; height: 100%; }
    .lab-calorimetro svg text { font-family: var(--font); }
    .lab-calorimetro svg text, .lab-calorimetro svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-calorimetro .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-calorimetro .consegna > span { display: block; }
    .lab-calorimetro .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-calorimetro .consegna:empty { display: none; }
    .lab-calorimetro .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; height: calc(4.4 * clamp(1rem, 2.4cqmin, 1.15rem)); flex: none; }
    .lab-calorimetro .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-calorimetro .formula .ignoto { color: var(--testo3); }
    .lab-calorimetro .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-calorimetro .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-calorimetro .formula .simbolo { display: none; } .lab-calorimetro .formula .nome-stretto { display: inline; } .lab-calorimetro .formula { font-size: 1rem; } }
    .lab-calorimetro .lab-messaggio { padding: 0 4px; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-calorimetro .formula { height: calc(6.4 * clamp(1rem, 2.4cqmin, 1.15rem)); } .lab-calorimetro .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-calorimetro .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-calorimetro .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-calorimetro .btn[disabled] { opacity: .38; cursor: default; }
    .lab-calorimetro .lab-parametri { max-width: 760px; }
    .lab-calorimetro .lab-parametri.uno { max-width: 520px; }
    .lab-calorimetro .lab-param[hidden], .lab-calorimetro .b-casuale[hidden], .lab-calorimetro .risposte[hidden] { display: none; }
    .lab-calorimetro .lab-param { gap: 6px; }
    .lab-calorimetro .lab-param .valore { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 0; width: 4.6em; flex: none; line-height: 1.05; }
    .lab-calorimetro .lab-param .nome { min-width: 0; font-size: .75rem; color: var(--testo2); text-align: center; white-space: nowrap; }
    .lab-calorimetro .lab-param output { min-width: 0; white-space: nowrap; }
    .lab-calorimetro .lab-param[data-p="mat"] .valore { width: 5.6em; }
    .lab-calorimetro .lab-param.fisso .btn { visibility: hidden; }
    .lab-calorimetro .lab-param.fisso output { color: var(--testo2); }
    .lab-calorimetro .lab-parametri.uno { grid-template-columns: 1fr; }
    /* sul telefono, con sette parametri (modalità libera), le righe si stringono */
    @container lab (max-width: 420px) {
      .lab-calorimetro .lab-parametri { gap: 4px 6px; }
      .lab-calorimetro .lab-parametri:not(.uno) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
      .lab-calorimetro .lab-param { gap: 3px; }
      .lab-calorimetro .lab-param .btn { min-width: 34px; padding: 0 4px; }
      .lab-calorimetro .lab-param .valore, .lab-calorimetro .lab-param[data-p="mat"] .valore { min-width: 0; width: auto; flex: 1; }
      .lab-calorimetro .lab-param output { font-size: .95rem; }
    }
    .lab-calorimetro .b-casuale { justify-self: center; }
    .lab-calorimetro .risposte { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .lab-calorimetro .risposte .btn { min-height: 44px; padding: 2px 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; gap: 1px; }
    .lab-calorimetro .risposte .btn b { font-weight: 600; font-size: .86rem; }
    .lab-calorimetro .risposte .btn small { font-size: .76rem; color: var(--testo2); font-variant-numeric: tabular-nums; }
    .lab-calorimetro .conta { position: absolute; left: 10px; top: 6px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-calorimetro .vinto { display: inline-block; animation: lab-calorimetro-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-calorimetro-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (2 righe di parametri sotto la consegna nei livelli, 4 nel Libero, dove la consegna non c'è) */
    .lab-calorimetro .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(2 * var(--riga) + 1 * 6px); --pf: calc(4 * var(--riga) + 3 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-calorimetro .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-calorimetro .lab-lato .consegna:empty { display: none; }
    .lab-calorimetro .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-calorimetro .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const C_ACQUA = 4186, ZERO_K = 273.15, TOL = 0.5;
  const METALLI = [
    { id: 'alluminio', c: 900, colore: '#b7c0c9' },
    { id: 'ferro', c: 450, colore: '#757b83' },
    { id: 'rame', c: 385, colore: '#c47a42' },
    { id: 'piombo', c: 130, colore: '#868a99' }
  ];
  const M_MAX = 800;   /* capienza di una caraffa, in grammi */

  /* i corpi che finiscono nel calorimetro: { chi, m (kg), c, t (nell'unità del livello), acqua } */
  function corpi(L, p) {
    const k = [];
    if (L.calda) k.push({ chi: 'calda', m: p.mc / 1000, c: C_ACQUA, t: p.tc, acqua: true });
    if (L.fredda) k.push({ chi: 'fredda', m: p.mf / 1000, c: C_ACQUA, t: p.tf, acqua: true });
    if (L.blocco && p.mat >= 0) k.push({ chi: 'blocco', m: p.mb / 1000, c: METALLI[p.mat].c, t: p.tb, acqua: false });
    if (L.tazza) k.push({ chi: 'tazza', m: L.tazza.m / 1000, c: METALLI[L.tazza.mat].c, t: L.tazza.t, acqua: false });
    return k.filter(x => x.m > 0);
  }
  /* la temperatura di equilibrio: calore ceduto = calore assorbito, cioè Σ m·c·(t − t_e) = 0 */
  function equilibrio(L, p) {
    const k = corpi(L, p);
    let S = 0, St = 0;
    k.forEach(x => { S += x.m * x.c; St += x.m * x.c * x.t; });
    if (S <= 0) return { vuoto: true, corpi: k };
    const te = St / S, tc = L.kelvin ? te - ZERO_K : te;   /* in gradi Celsius, per sapere se l'acqua resta liquida */
    const acqua = k.some(x => x.acqua);
    return { te, corpi: k, bolle: acqua && tc > 100, gela: acqua && tc < 0 };
  }
  /* il verdetto di un mescolamento: { ok, testo } (dice solo che cosa è successo) */
  function verdetto(L, p, e) {
    const u = L.kelvin ? ' K' : ' °C';
    if (L.totale && p.mc + p.mf !== L.totale) return { ok: false, testo: 'Equilibrio a ' + num(e.te, 1) + u + ', ma d\'acqua ce ne sono ' + (p.mc + p.mf) + '\u00a0g: ne servono ' + L.totale + '.' };
    const d = e.te - L.bersaglio;
    if (Math.abs(d) <= TOL) return { ok: true, testo: 'Equilibrio a ' + num(e.te, 1) + u + '.' };
    return { ok: false, testo: 'Equilibrio a ' + num(e.te, 1) + u + ', non a ' + L.bersaglio + u + '.' };
  }

  /* ---------------- livelli ----------------
     liberi: i parametri che si possono cambiare. Le soluzioni le conta la prova dei livelli
     (masse a passi di 10 g, temperature a passi di 1 grado): fra parentesi quelle possibili. */
  const LIVELLI = [
    { consegna: 'Hai 300&nbsp;g d\'acqua a 80&nbsp;°C. Quanta acqua a 20&nbsp;°C serve per arrivare a <b>50&nbsp;°C</b>?',
      calda: true, fredda: true, inizio: { mc: 300, tc: 80, mf: 100, tf: 20 }, liberi: ['mf'], bersaglio: 50, scala: [0, 100], formula: 'media' },   /* 300 g */
    { consegna: 'Hai 200&nbsp;g d\'acqua a 80&nbsp;°C. Aggiungi acqua a 20&nbsp;°C per arrivare a <b>35&nbsp;°C</b>.',
      calda: true, fredda: true, inizio: { mc: 200, tc: 80, mf: 200, tf: 20 }, liberi: ['mf'], bersaglio: 35, scala: [0, 100], formula: 'media' },   /* 590 o 600 g */
    { consegna: 'Fai <b>500&nbsp;g</b> d\'acqua in tutto, calda e fredda, a <b>44&nbsp;°C</b>.',
      calda: true, fredda: true, inizio: { mc: 250, tc: 80, mf: 250, tf: 20 }, liberi: ['mc', 'mf'], totale: 500, bersaglio: 44, scala: [0, 100], formula: 'media' },   /* 200 + 300 */
    { consegna: 'Rame da 500&nbsp;g a 100&nbsp;°C nell\'acqua a 20&nbsp;°C: quanta acqua, per arrivare a <b>30&nbsp;°C</b>?',
      fredda: true, blocco: true, inizio: { mf: 500, tf: 20, mat: 2, mb: 500, tb: 100 }, liberi: ['mf'], bersaglio: 30, scala: [0, 100], formula: 'bilancio' },   /* da 310 a 340 g */
    { consegna: 'Di che metallo è il pezzo a 100&nbsp;°C? Misura, poi rispondi. Riconoscine <b>due di fila</b>.',
      fredda: true, blocco: true, mistero: true, inizio: { mf: 200, tf: 20, mat: 0, mb: 250, tb: 100 }, liberi: ['mf'], scala: [0, 100], formula: 'bilancio' },
    { consegna: 'La tazza di alluminio, con l\'acqua dentro, è a 20&nbsp;°C. Quanta acqua a 80&nbsp;°C per arrivare a <b>40&nbsp;°C</b>?',
      calda: true, fredda: true, dentro: true, tazza: { mat: 0, m: 250, t: 20 }, inizio: { mc: 50, tc: 80, mf: 200, tf: 20 }, liberi: ['mc'], bersaglio: 40, scala: [0, 100], formula: 'somma' },   /* 130 g */
    { consegna: 'In kelvin: a che temperatura va scaldato l\'alluminio, per portare l\'acqua a <b>300&nbsp;K</b>?',
      fredda: true, blocco: true, kelvin: true, inizio: { mf: 300, tf: 290, mat: 0, mb: 200, tb: 330 }, liberi: ['tb'], bersaglio: 300, scala: [270, 390], formula: 'bilancio' },   /* da 366 a 373 K */
    { consegna: 'Ferro dal congelatore, a −18&nbsp;°C. Con <b>400&nbsp;g</b> d\'acqua in tutto arriva a <b>30&nbsp;°C</b>.',
      calda: true, fredda: true, blocco: true, inizio: { mc: 200, tc: 80, mf: 200, tf: 20, mat: 1, mb: 500, tb: -18 }, liberi: ['mc', 'mf'], totale: 400, bersaglio: 30, scala: [-20, 100], formula: 'somma' }   /* 110 + 290 */
  ];
  const LIBERO = { consegna: '', calda: true, fredda: true, blocco: true, libero: true, liberi: ['mc', 'tc', 'mf', 'tf', 'mat', 'mb', 'tb'], scala: [-20, 100], formula: 'libero' };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    'Masse uguali, o quasi, della stessa sostanza: la calda scende di circa 30\u00a0°C, la fredda sale di circa 30\u00a0°C. È la media.',
    'Circa il triplo d\'acqua fredda: sale di circa 15\u00a0°C mentre la calda scende di circa 45\u00a0°C. Il calore ceduto è uguale a quello preso.',
    'È una media pesata con le masse: la temperatura finale sta più vicina a quella dell\'acqua che è di più.',
    'Il rame scende di 70\u00a0°C, l\'acqua sale di 10 °C: a parità di massa l\'acqua vuole quasi undici volte più energia per grado.',
    'Il calorimetro serve proprio a questo: dalla temperatura di equilibrio si ricava il calore specifico.',
    'Anche il recipiente prende calore: nei calorimetri veri la tazza si mette nel conto.',
    'Le differenze di temperatura sono uguali in kelvin e in gradi Celsius: il conto è lo stesso.',
    'Tre corpi, ma la regola non cambia: il calore ceduto da chi scende è uguale a quello preso da chi sale.'
  ];

  const AIUTO = 'Nel calorimetro il calore non esce e non entra: quello che cede chi è più caldo lo prende chi è più freddo, finché tutti arrivano alla stessa temperatura, la temperatura di equilibrio. Per scaldare una massa m di Δt serve Q = m·c·Δt: c è il calore specifico, 4186 J/(kg·°C) per l\'acqua, 900 per l\'alluminio, 450 per il ferro, 385 per il rame, 130 per il piombo. Scegli i valori con − e + (tieni premuto per andare veloce), poi «Mescola». La formula si riempie con i tuoi numeri: il risultato compare dopo.';
  const AIUTO_CARAFFE = ' Le masse d\'acqua si scelgono anche trascinando il livello nelle caraffe.';
  const AIUTO_OBIETTIVO = ' Il livello è superato se l\'equilibrio è a meno di mezzo grado dall\'obiettivo (la tacca rossa sul termometro).';
  const AIUTI = {
    2: ' Contano due cose: la temperatura giusta e 500\u00a0g d\'acqua in tutto (la riga tratteggiata nel calorimetro).',
    3: ' Il rame ha un calore specifico piccolo: scendendo di molti gradi cede poco calore.',
    4: ' Misura: scegli quanta acqua, mescola e leggi la temperatura di equilibrio. L\'acqua ha preso Q = m·c·Δt; il pezzo ha ceduto lo stesso calore scendendo da 100\u00a0°C a t<sub>e</sub>. Da lì ricavi il suo c, e lo confronti con quelli dei pulsanti. Se sbagli, arriva un altro pezzo.',
    5: ' Qui la tazza non è ideale: è di alluminio e parte da 20\u00a0°C come l\'acqua che contiene, quindi si scalda anche lei.',
    6: ' Qui il termometro è in kelvin: T = t + 273,15. Una differenza di 10\u00a0K è una differenza di 10\u00a0°C.',
    7: ' Contano due cose: la temperatura giusta e 400\u00a0g d\'acqua in tutto. Il blocco gelato prende calore anche lui.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è un obiettivo. Scegli quanta acqua calda e fredda versare e a che temperatura, e se aggiungere un blocco di metallo (massa e temperatura), poi mescola: il grafico mostra come ogni corpo arriva alla temperatura di equilibrio. L\'acqua deve restare liquida: qui il calore latente non è nel conto. «Casuale» propone un esperimento a caso.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return (s === '-0' || /^-0[.,]0*$/.test(s) ? s.slice(1) : s).replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { let s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); if (/^-0\.?0*$/.test(s)) s = s.slice(1); return s.replace('.', '{,}'); }
  function texKg(g) { return String(+(g / 1000).toFixed(3)).replace('.', '{,}'); }   /* 320 g → 0{,}32 */
  function texT(t) { return t < 0 ? '(' + texNum(t, t % 1 ? 1 : 0)+ ')' : texNum(t, t % 1 ? 1 : 0); }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const ALONE = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };
  /* il colore dell'acqua: azzurrina se fredda, ambrata se calda (solo un aiuto all'occhio: il numero è nel termometro) */
  function coloreAcqua(tC) {
    const u = morsa(tC / 100, 0, 1), a = [96, 168, 230], b = [236, 128, 74];
    return 'rgb(' + a.map((x, i) => Math.round(x + (b[i] - x) * u)).join(',') + ')';
  }

  QUANTO.registraLab({
    id: 'calorimetro',
    fisica: { corpi, equilibrio, verdetto, LIVELLI, METALLI, TOL },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-calorimetro')) { const s = document.createElement('style'); s.id = 'stile-lab-calorimetro'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-calorimetro');
      const riga = (k, nome, aria) => `<div class="lab-param" data-p="${k}"><button type="button" class="btn piccolo" data-d="-1" aria-label="${aria} meno">−</button><span class="valore"><span class="nome">${nome}</span><output></output></span><button type="button" class="btn piccolo" data-d="1" aria-label="${aria} più">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, masse e temperature le scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${riga('mc', 'calda', 'acqua calda')}${riga('tc', 'calda', 'temperatura dell\'acqua calda')}
              ${riga('mf', 'fredda', 'acqua fredda')}${riga('tf', 'fredda', 'temperatura dell\'acqua fredda')}
              ${riga('mat', 'blocco', 'metallo')}<button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
              ${riga('mb', 'blocco', 'massa del blocco')}${riga('tb', 'blocco', 'temperatura del blocco')}
              <div class="risposte" hidden role="group" aria-label="Di che metallo è?">${METALLI.map((m, i) => `<button type="button" class="btn piccolo" data-r="${i}"><b>${m.id}</b><small>${m.c}</small></button>`).join('')}</div>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-mescola">🥄 Mescola</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri'), risposteEl = q('.risposte');
      const b = { mescola: q('.b-mescola'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const CHIAVI = ['mc', 'tc', 'mf', 'tf', 'mat', 'mb', 'tb'];
      const box = {}; CHIAVI.forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ---------------- */
      let livello = 0, p = {}, prove = 0, finito = false, animando = false, raf = 0;
      let fase = 'prima', ultimo = null;   /* fase: 'prima' (caraffe piene) o 'dopo' (mescolato); ultimo = { p, e } */
      let segni = [], detti = {}, libero = false, salvato = null;
      let mistero = null, diFila = 0, misurato = false;   /* livello 5: il pezzo da riconoscere */
      let anim = null;   /* durante l'animazione: { u (versare 0→1), tau (mescolare) } */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const U = () => liv().kelvin ? 'K' : '°C';
      const tAmb = () => liv().kelvin ? 293.15 : 20;   /* la temperatura dell'aria: il termometro la segna a calorimetro vuoto */

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Due caraffe d\'acqua, un blocco di metallo, il calorimetro con il suo termometro e il grafico delle temperature', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gGrafico = el('g'), gCose = el('g'), gTermo = el('g');
      [gGrafico, gCose, gTermo].forEach(g => svg.appendChild(g));

      let S = null;   /* geometria in pixel veri */
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(280, Math.round(r.width)), h = Math.max(220, Math.round(r.height));
        const largo = w / h > 1.9;   /* il grafico a destra solo su scene molto larghe; altrimenti sotto */
        let V, G;
        if (largo) { const xv = Math.round(w * 0.6); V = { x: 10, y: 26, w: xv - 16, h: h - 36 }; G = { x: xv + 4, y: 14, w: w - xv - 16, h: h - 28 }; }
        else { const yv = Math.round(h * 0.58); V = { x: 8, y: 24, w: w - 16, h: yv - 28 }; G = { x: 8, y: yv + 2, w: w - 16, h: h - yv - 10 }; }
        const L = liv();
        const fonti = [];
        if (L.calda) fonti.push('calda');
        if (L.fredda && !L.dentro) fonti.push('fredda');
        if (L.blocco) fonti.push('blocco');
        /* il calorimetro, poi le cose da versare a sinistra; il gruppo intero (con il termometro) sta al centro */
        const W2 = V.w - 64;
        const cw = Math.round(morsa(Math.min(W2 * 0.34, (V.h - 60) / 0.95), 90, 320)), ch = Math.round(Math.min(V.h - 60, cw * 0.95));
        const zonaMax = W2 - cw - 12, nf = Math.max(1, fonti.length);
        const jw = Math.round(Math.min(140, zonaMax / nf - 24)), jh = Math.round(Math.min(V.h - 84, jw * 1.55, ch * 0.95));
        const sw = Math.min(zonaMax / nf, jw + 50), zona = sw * nf;
        const sposta = Math.max(0, (W2 - zona - 12 - cw) / 2);
        const base = V.y + V.h - 22;
        const cal = { x: V.x + sposta + zona + 12, y: base - ch, w: cw, h: ch };
        const termo = { x: cal.x + cw + 46, y0: V.y + 30, y1: V.y + V.h - 22 };
        const pos = {};
        fonti.forEach((f, i) => { pos[f] = { cx: V.x + sposta + sw * (i + 0.5), w: jw, h: jh, base }; });
        S = { w, h, V, G, termo, cal, pos, base, largo };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      /* scala del termometro e del grafico */
      function scalaT(lo, hi, y0, y1) { return t => y1 - (t - lo) / (hi - lo) * (y1 - y0); }
      function passoTacche(lo, hi, px) { return [5, 10, 20, 25, 50, 100].find(s => px / ((hi - lo) / s) >= 22) || 100; }

      /* che cosa c'è nel calorimetro, e quanto è pieno: frazione da versare u (0 prima, 1 dopo) */
      function contenuto(u) {
        const L = liv();
        let acqua = 0; const tazzaAcqua = L.dentro ? p.mf : 0;
        if (L.calda) acqua += p.mc * u;
        if (L.fredda) acqua += L.dentro ? p.mf : p.mf * u;
        return { acqua, prima: tazzaAcqua };
      }

      function disegnaCose() {
        vuota(gCose);
        const L = liv(), u = anim ? anim.u : (fase === 'dopo' ? 1 : 0);
        const e = fase === 'dopo' || anim ? (ultimo && ultimo.e) : null;
        /* temperatura «attuale» di ogni corpo durante e dopo il mescolamento */
        const tau = anim ? anim.tau : (fase === 'dopo' ? 99 : 0);
        const tCorpo = t0 => e && !e.vuoto ? e.te + (t0 - e.te) * Math.exp(-tau) : t0;
        const tC = t => L.kelvin ? t - ZERO_K : t;
        /* le caraffe */
        ['calda', 'fredda'].forEach(f => {
          const P = S.pos[f]; if (!P) return;
          const m = f === 'calda' ? p.mc : p.mf, t = f === 'calda' ? p.tc : p.tf, k = f === 'calda' ? 'mc' : 'mf';
          const fissa = !L.libero && L.liberi.indexOf(k) < 0;
          caraffa(P, m * (1 - u), t, f, fissa, m);
        });
        /* il blocco, sul fornello o nel congelatore finché non si versa */
        if (S.pos.blocco && p.mat >= 0) blocco(S.pos.blocco, u, tC(tCorpo(p.tb)));
        else if (S.pos.blocco) {   /* libero, nessun metallo */
          const P = S.pos.blocco;
          gCose.appendChild(el('text', { x: P.cx, y: P.base - 10, 'text-anchor': 'middle', fill: 'var(--testo3)', style: 'font: 13px var(--font)' }, 'niente blocco'));
        }
        calorimetro(u, e, tCorpo, tC);
      }

      function caraffa(P, m, t, f, fissa, mPiena) {
        const x0 = P.cx - P.w / 2, x1 = P.cx + P.w / 2, yT = P.base - P.h, yB = P.base;
        const sv = 4;   /* le pareti si allargano un poco verso l'alto */
        const sagoma = `M${x0 - sv} ${yT} L${x0} ${yB - 6} Q${x0} ${yB} ${x0 + 6} ${yB} H${x1 - 6} Q${x1} ${yB} ${x1} ${yB - 6} L${x1 + sv} ${yT}`;
        const hAcqua = (P.h - 8) * morsa(m / M_MAX, 0, 1);
        if (hAcqua > 0.5) {
          const ya = yB - hAcqua, fr = (yB - ya) / P.h;
          gCose.appendChild(el('path', { d: `M${x0 - sv * (1 - fr) + 1.5} ${ya} L${x0 + 1.5} ${yB - 6} Q${x0 + 1.5} ${yB - 1.5} ${x0 + 6} ${yB - 1.5} H${x1 - 6} Q${x1 - 1.5} ${yB - 1.5} ${x1 - 1.5} ${yB - 6} L${x1 + sv * (1 - fr) - 1.5} ${ya} Z`, fill: coloreAcqua(liv().kelvin ? t - ZERO_K : t), opacity: .6 }));
        }
        /* tacche ogni 100 g */
        for (let g = 100; g < M_MAX; g += 100) {
          const y = yB - (P.h - 8) * g / M_MAX;
          gCose.appendChild(el('line', { x1: x1 - 1, y1: y, x2: x1 - (g % 500 ? 6 : 10), y2: y, stroke: 'var(--testo2)', 'stroke-width': 1, opacity: .7 }));
        }
        gCose.appendChild(el('path', { d: sagoma, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
        gCose.appendChild(el('path', { d: `M${x0 - sv} ${yT} l-7 -5`, stroke: 'var(--testo2)', 'stroke-width': 2, 'stroke-linecap': 'round' }));   /* il beccuccio */
        /* la temperatura sopra, la massa sotto */
        gCose.appendChild(el('text', Object.assign({ x: P.cx, y: yT - 26, 'text-anchor': 'middle', fill: 'var(--s2)', style: 'font: 700 14px var(--font)' }, ALONE), numT(t)));
        const tm = el('text', { x: P.cx, y: yB + 16, 'text-anchor': 'middle', fill: fissa ? 'var(--testo2)' : 'var(--testo)', style: 'font: 600 13px var(--font)' }, mPiena + '\u00a0g');
        gCose.appendChild(tm);
        gCose.appendChild(el('text', { x: P.cx, y: yT - 10, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, f));
        /* la zona che si trascina (solo se la massa si può cambiare) */
        if (!fissa && fase === 'prima' && !animando) gCose.appendChild(el('rect', { x: x0 - 10, y: yT - 4, width: P.w + 20, height: P.h + 8, fill: 'transparent', 'data-trascina': f === 'calda' ? 'mc' : 'mf', style: 'cursor: ns-resize' }));
      }

      function lato(m) { return 14 + 20 * Math.cbrt(m / 500); }   /* il blocco più pesante è più grande */
      function blocco(P, u, tCadesso) {
        const L = liv(), met = METALLI[p.mat], s = lato(p.mb);
        const caldo = (L.kelvin ? p.tb - ZERO_K : p.tb) > 40, gelido = (L.kelvin ? p.tb - ZERO_K : p.tb) < 0;
        const yP = P.base;
        /* il fornello o il congelatore */
        if (gelido) {
          gCose.appendChild(el('rect', { x: P.cx - 26, y: yP - s - 18, width: 52, height: s + 18, rx: 5, fill: 'var(--s1)', opacity: .12, stroke: 'var(--s1)', 'stroke-opacity': .4 }));
          gCose.appendChild(el('text', { x: P.cx, y: yP + 16, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'congelatore'));
        } else {
          gCose.appendChild(el('rect', { x: P.cx - 24, y: yP - 7, width: 48, height: 7, rx: 2, fill: 'var(--testo2)', opacity: .7 }));
          if (caldo) gCose.appendChild(el('path', { d: `M${P.cx - 18} ${yP - 9} h36`, stroke: 'var(--s2)', 'stroke-width': 2, 'stroke-dasharray': '4 3', opacity: .9 }));
          gCose.appendChild(el('text', { x: P.cx, y: yP + 16, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, caldo ? 'fornello' : 'tavolo'));
        }
        const yApp = gelido ? yP - 9 : yP - 7;
        /* dove sta: al suo posto, o in volo verso il calorimetro, o sul fondo del calorimetro */
        const da = [P.cx - s / 2, yApp - s];
        const a = [S.cal.x + 16, S.cal.y + S.cal.h - 9 - s];
        const k = u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
        const x = da[0] + (a[0] - da[0]) * k, y = da[1] + (a[1] - da[1]) * k - Math.sin(Math.PI * k) * 40;
        if (k < 1) {
          gCose.appendChild(el('rect', { x, y, width: s, height: s, rx: 2.5, fill: L.mistero ? '#8d929c' : met.colore, stroke: 'var(--testo)', 'stroke-width': 1.2, 'stroke-opacity': .5 }));
          if (L.mistero) gCose.appendChild(el('text', { x: x + s / 2, y: y + s / 2 + 5, 'text-anchor': 'middle', fill: '#fff', style: 'font: 700 14px var(--font)' }, '?'));
        }
        if (k === 0) {
          gCose.appendChild(el('text', Object.assign({ x: P.cx, y: yApp - s - 26, 'text-anchor': 'middle', fill: 'var(--s2)', style: 'font: 700 14px var(--font)' }, ALONE), numT(p.tb)));
          gCose.appendChild(el('text', { x: P.cx, y: yApp - s - 10, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, (L.mistero ? '?' : met.id) + ' ' + p.mb + '\u00a0g'));
        }
        S.bloccoDentro = { x: a[0], y: a[1], s, colore: L.mistero ? '#8d929c' : met.colore, visibile: k >= 1, t: tCadesso };
      }

      function calorimetro(u, e, tCorpo, tC) {
        const L = liv(), c = S.cal, inset = 7;
        const ix = c.x + inset, iy = c.y + inset, iw = c.w - 2 * inset, ih = c.h - 2 * inset;
        gCose.appendChild(el('rect', { x: c.x, y: c.y, width: c.w, height: c.h, rx: 11, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 2 }));
        /* l'acqua dentro (capienza 1000 g) */
        const cont = contenuto(u);
        const tAcqua = (() => {   /* il colore dell'acqua mescolata: la media pesata delle parti d'acqua, istante per istante */
          let s = 0, st = 0;
          if (L.calda && p.mc > 0) { s += p.mc * u; st += p.mc * u * tCorpo(p.tc); }
          if (L.fredda && p.mf > 0) { const f = L.dentro ? 1 : u; s += p.mf * f; st += p.mf * f * tCorpo(p.tf); }
          return s > 0 ? st / s : tAmb();
        })();
        const hA = (ih - 4) * morsa(cont.acqua / 1000, 0, 1);
        gCose.appendChild(el('rect', { x: ix, y: iy, width: iw, height: ih, rx: 6, fill: 'var(--sup2)', stroke: L.tazza ? METALLI[L.tazza.mat].colore : 'var(--bordo)', 'stroke-width': L.tazza ? 3.5 : 1.2, 'stroke-dasharray': L.tazza ? 'none' : '4 3' }));
        if (hA > 0.5) gCose.appendChild(el('rect', { x: ix + 2, y: iy + ih - 2 - hA, width: iw - 4, height: hA, rx: 4, fill: coloreAcqua(tC(tAcqua)), opacity: .6 }));
        /* il blocco sul fondo */
        const B = S.bloccoDentro;
        if (B && B.visibile && S.pos.blocco && p.mat >= 0) {
          gCose.appendChild(el('rect', { x: B.x, y: B.y, width: B.s, height: B.s, rx: 2.5, fill: B.colore, stroke: 'var(--testo)', 'stroke-width': 1.2, 'stroke-opacity': .5 }));
          if (L.mistero) gCose.appendChild(el('text', { x: B.x + B.s / 2, y: B.y + B.s / 2 + 5, 'text-anchor': 'middle', fill: '#fff', style: 'font: 700 14px var(--font)' }, '?'));
        }
        /* la riga dell'acqua da raggiungere (livelli 3 e 8) */
        if (L.totale) {
          const y = iy + ih - 2 - (ih - 4) * L.totale / 1000;
          gCose.appendChild(el('line', { x1: ix - 2, y1: y, x2: ix + iw + 2, y2: y, stroke: 'var(--testo)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4', opacity: .75 }));
          gCose.appendChild(el('text', Object.assign({ x: ix + iw - 4, y: y - 5, 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }, ALONE), L.totale + '\u00a0g'));
        }
        /* il coperchio, l'agitatore e la sonda del termometro */
        const yAg = anim && anim.tau > 0 ? Math.sin(anim.tau * 9) * 6 : 0;
        gCose.appendChild(el('line', { x1: c.x + c.w * 0.4, y1: c.y - 18 + yAg, x2: c.x + c.w * 0.4, y2: iy + ih - 14 + yAg, stroke: 'var(--testo2)', 'stroke-width': 2 }));
        gCose.appendChild(el('ellipse', { cx: c.x + c.w * 0.4, cy: iy + ih - 14 + yAg, rx: 12, ry: 3, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2 }));
        const xs = c.x + c.w - 22;
        gCose.appendChild(el('line', { x1: xs, y1: c.y - 10, x2: xs, y2: iy + ih - 10, stroke: 'var(--testo)', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .75 }));
        gCose.appendChild(el('path', { d: `M${xs} ${c.y - 10} C${xs} ${c.y - 34} ${S.termo.x - 30} ${S.termo.y1 + 30} ${S.termo.x - 7} ${S.termo.y1 + 6}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.6, opacity: .7 }));
        gCose.appendChild(el('rect', { x: c.x - 5, y: c.y - 7, width: c.w + 10, height: 9, rx: 3, fill: 'var(--testo2)', opacity: .85 }));
        /* sotto: che cosa c'è dentro */
        const dentro = L.tazza ? 'tazza di alluminio ' + L.tazza.m + '\u00a0g' : (cont.acqua > 0 && (fase === 'dopo' || anim) ? Math.round(cont.acqua) + '\u00a0g d\'acqua' : 'calorimetro');
        gCose.appendChild(el('text', { x: c.x + c.w / 2, y: S.base + 16, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, dentro));
        if (L.dentro && cont.prima && !(fase === 'dopo' || anim)) gCose.appendChild(el('text', Object.assign({ x: ix + iw / 2, y: iy + ih - 8, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }, ALONE), p.mf + '\u00a0g, ' + numT(p.tf)));
        disegnaTermometro(e, tAcqua);
      }

      /* il termometro del calorimetro: la colonna arancio, la tacca rossa dell'obiettivo, i segni delle prove precedenti */
      function disegnaTermometro(e, tAcqua) {
        vuota(gTermo);
        const L = liv(), T = S.termo, sc = L.scala, Y = scalaT(sc[0], sc[1], T.y0, T.y1);
        /* che cosa segna: prima l'aria (o l'acqua già nella tazza); mescolando si avvicina a t_e, con il ritmo del grafico */
        const r0 = L.dentro ? p.tf : tAmb();
        let lettura = r0;
        if ((anim || fase === 'dopo') && e && !e.vuoto) { const tau = anim ? anim.tau : 99; lettura = e.te + (r0 - e.te) * Math.exp(-tau); }
        gTermo.appendChild(el('rect', { x: T.x - 6, y: T.y0 - 6, width: 12, height: T.y1 - T.y0 + 8, rx: 6, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 1.6 }));
        gTermo.appendChild(el('circle', { cx: T.x, cy: T.y1 + 8, r: 9, fill: 'var(--s2)', stroke: 'var(--testo2)', 'stroke-width': 1.6 }));
        const yl = morsa(Y(lettura), T.y0 - 2, T.y1);
        gTermo.appendChild(el('rect', { x: T.x - 2.8, y: yl, width: 5.6, height: T.y1 + 4 - yl, fill: 'var(--s2)' }));
        /* tacche a sinistra */
        const passo = passoTacche(sc[0], sc[1], T.y1 - T.y0);
        for (let t = Math.ceil(sc[0] / passo) * passo; t <= sc[1] + 1e-9; t += passo) {
          gTermo.appendChild(el('line', { x1: T.x - 6, y1: Y(t), x2: T.x - 11, y2: Y(t), stroke: 'var(--testo2)', 'stroke-width': 1 }));
          gTermo.appendChild(el('text', { x: T.x - 14, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(t, 0)));
        }
        gTermo.appendChild(el('text', { x: T.x + 9, y: T.y0 + 4, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, U()));
        /* i segni delle prove precedenti, a destra */
        segni.forEach((s, i) => gTermo.appendChild(el('line', { x1: T.x + 7, y1: Y(s), x2: T.x + 13, y2: Y(s), stroke: 'var(--testo3)', 'stroke-width': 2, opacity: 0.4 + 0.2 * i })));
        /* l'obiettivo */
        if (L.bersaglio != null) {
          const yb = Y(L.bersaglio), h = Math.max(3, Y(L.bersaglio - TOL) - Y(L.bersaglio + TOL));
          gTermo.appendChild(el('rect', { x: T.x - 9, y: yb - h / 2, width: 18, height: h, fill: 'var(--no)', opacity: .85, rx: 1 }));
          gTermo.appendChild(el('path', { d: `M${T.x + 9} ${yb} l7 -5 v10 z`, fill: 'var(--no)' }));
        }
        /* la lettura, in alto */
        gTermo.appendChild(el('text', Object.assign({ x: T.x + 6, y: T.y0 - 14, 'text-anchor': 'end', fill: 'var(--s2)', style: 'font: 700 15px var(--font)' }, ALONE), num(lettura, 1) + ' ' + U()));
      }
      function numT(t) { return num(t, t % 1 ? 1 : 0) + ' ' + U(); }

      /* il grafico temperatura–tempo: ogni corpo da dove parte fino a t_e */
      const NOMI = { calda: 'calda', fredda: 'fredda', blocco: 'blocco', tazza: 'tazza' };
      const TRATTI = { calda: 'none', fredda: '7 5', blocco: '2 4', tazza: '10 4 2 4' };
      function disegnaGrafico() {
        vuota(gGrafico);
        const L = liv(), G = S.G, e = ultimo && (fase === 'dopo' || anim) ? ultimo.e : null;
        const k = corpi(L, p).map(x => ({ chi: x.chi, t: x.t }));
        const sx = 38, dx = 10, su = 18, giu = 20;
        const x0 = G.x + sx, x1 = G.x + G.w - dx, y0 = G.y + su, y1 = G.y + G.h - giu;
        if (x1 - x0 < 60 || y1 - y0 < 40) return;
        let lo = L.scala[0], hi = L.scala[1];
        k.forEach(x => { lo = Math.min(lo, Math.floor(x.t / 10) * 10); hi = Math.max(hi, Math.ceil(x.t / 10) * 10); });
        const Y = scalaT(lo, hi, y0, y1), TMAX = 5, X = tau => x0 + tau / TMAX * (x1 - x0);
        gGrafico.appendChild(el('rect', { x: G.x, y: G.y, width: G.w, height: G.h, rx: 10, fill: 'var(--sup)', opacity: .55 }));
        const passo = passoTacche(lo, hi, y1 - y0);
        for (let t = Math.ceil(lo / passo) * passo; t <= hi + 1e-9; t += passo) {
          gGrafico.appendChild(el('line', { x1: x0, y1: Y(t), x2: x1, y2: Y(t), stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .7 }));
          gGrafico.appendChild(el('text', { x: x0 - 5, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(t, 0)));
        }
        gGrafico.appendChild(el('line', { x1: x0, y1: y0 - 6, x2: x0, y2: y1, stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
        gGrafico.appendChild(el('line', { x1: x0, y1: y1, x2: x1, y2: y1, stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
        gGrafico.appendChild(el('text', { x: x0 + 4, y: y0 - 6, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, (L.kelvin ? 'T' : 't') + ' (' + U() + ')'));
        gGrafico.appendChild(el('text', { x: x1, y: y1 + 15, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'tempo →'));
        const tau = anim ? anim.tau : (e ? TMAX : 0);
        /* le curve: t(τ) = t_e + (t0 − t_e)·e^(−τ): tutti i corpi con lo stesso ritmo, così Σ m·c·(t − t_e) resta zero */
        k.forEach(x => {
          if (e && !e.vuoto && tau > 0) {
            let d = '';
            for (let i = 0; i <= 60; i++) { const s = tau * i / 60, t = e.te + (x.t - e.te) * Math.exp(-s); d += (i ? 'L' : 'M') + X(s).toFixed(1) + ' ' + Y(t).toFixed(1) + ' '; }
            gGrafico.appendChild(el('path', { d, fill: 'none', stroke: 'var(--s2)', 'stroke-width': x.chi === 'blocco' ? 3 : 2.4, 'stroke-dasharray': TRATTI[x.chi], 'stroke-linecap': 'round' }));
          }
          gGrafico.appendChild(el('circle', { cx: X(0), cy: Y(x.t), r: 3.5, fill: 'var(--s2)' }));
        });
        if (e && !e.vuoto && tau >= TMAX - 1e-6) {
          const ye = Y(e.te);
          gGrafico.appendChild(el('line', { x1: x0, y1: ye, x2: x1, y2: ye, stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }));
          const sopra = ye - y0 > 22;
          const lab = el('text', Object.assign({ x: x1 - 2, y: sopra ? ye - 7 : ye + 17, 'text-anchor': 'end', fill: 'var(--s3)', style: 'font: 700 13px var(--font)' }, ALONE));
          lab.appendChild(document.createTextNode(L.kelvin ? 'T' : 't'));
          lab.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, 'e'));
          lab.appendChild(el('tspan', {}, ' = ' + num(e.te, 1) + ' ' + U()));
          gGrafico.appendChild(lab);
        }
        /* le etichette all'inizio delle curve: chi parte dalla stessa temperatura ne ha una sola; dopo, quanto è cambiata */
        const gruppi = [];
        k.forEach(x => { const g = gruppi.find(z => Math.abs(z.t - x.t) < 1e-9); if (g) g.chi.push(x.chi); else gruppi.push({ t: x.t, chi: [x.chi] }); });
        gruppi.sort((a, z) => z.t - a.t);
        let ultimaY = -1e9;
        gruppi.forEach((g, i) => {
          let y = Y(g.t) + (i === gruppi.length - 1 && gruppi.length > 1 ? 16 : -7);
          if (y - ultimaY < 15) y = ultimaY + 15;
          ultimaY = y;
          let testo = g.chi.map(c => NOMI[c]).join(' e ');
          if (e && !e.vuoto && tau >= TMAX - 1e-6) { const d = e.te - g.t; testo += '  Δ' + (L.kelvin ? 'T' : 't') + ' = ' + (d >= 0 ? '+' : '−') + num(Math.abs(d), 1) + ' ' + U(); }
          gGrafico.appendChild(el('text', Object.assign({ x: X(0) + 7, y, fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }, ALONE), testo));
        });
        if (!(e && !e.vuoto && tau >= TMAX - 1e-6) && !anim) {
          gGrafico.appendChild(el('text', { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + 4, 'text-anchor': 'middle', fill: 'var(--testo3)', style: 'font: 13px var(--font)' }, 'dopo «Mescola»'));
        }
      }

      function ridisegnaTutto() { geometria(); disegnaGrafico(); disegnaCose(); }

      /* ---------------- pannello ---------------- */
      const LIM = { mc: [0, M_MAX, 10], mf: [0, M_MAX, 10], tc: [0, 100, 1], tf: [0, 100, 1], mb: [10, 1000, 10], tb: [-20, 200, 1], mat: [-1, METALLI.length - 1, 1] };
      function limiti(k) {
        if (k === 'tb' && liv().kelvin) return [253, 473, 1];
        return LIM[k];
      }
      function testoParam(k) {
        if (k === 'mat') return liv().mistero ? '?' : (p.mat < 0 ? 'nessuno' : METALLI[p.mat].id);
        if (k[0] === 'm') return p[k] + '\u00a0g';
        return numT(p[k]);
      }
      function aggiornaParametri() {
        const L = liv();
        let visibili = 0;
        CHIAVI.forEach(k => {
          const usato = L.liberi.indexOf(k) >= 0;
          box[k].hidden = !usato;
          if (usato) visibili++;
          box[k].querySelector('output').textContent = testoParam(k);
          const spento = libero && (k === 'mb' || k === 'tb') && p.mat < 0;
          box[k].classList.toggle('fisso', spento);
          const lim = limiti(k);
          box[k].querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = animando || spento || (d < 0 ? p[k] <= lim[0] : p[k] >= lim[1]); });
        });
        parametriEl.classList.toggle('uno', visibili === 1);
        b.casuale.hidden = !libero;
        risposteEl.hidden = !(L.mistero && !libero);
        risposteEl.querySelectorAll('button').forEach(bt => { bt.disabled = animando || finito || !misurato; });
        b.mescola.disabled = animando || finito || fase === 'dopo';
      }

      /* il ponte con la teoria: la formula con i numeri scelti; il risultato solo dopo aver mescolato */
      function aggiornaFormula() {
        const L = liv(), e = equilibrio(L, p);
        const fatto = fase === 'dopo' && ultimo && !e.vuoto;
        const tt = L.kelvin ? 'T' : 't', un = L.kelvin ? '\\,\\text{K}' : '\\,{}^\\circ\\text{C}';
        const pezzi = [];
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = s => fatto ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        let tipo = L.formula;
        if (tipo === 'libero') tipo = p.mat < 0 ? 'media' : 'somma';
        const k = e.corpi;
        if (e.vuoto) { formulaEl.innerHTML = '<span class="pezzo ignoto">il calorimetro è vuoto</span>'; return; }
        if (tipo === 'media' && k.length === 2) {
          const a = k[0], z = k[1];
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(tt + '_e = \\dfrac{m_1 \\cdot ' + tt + '_1 + m_2 \\cdot ' + tt + '_2}{m_1 + m_2}') + '</span>');
          pezzi.push(numerico(tt + '_e = \\dfrac{' + texKg(a.m * 1000) + ' \\cdot ' + texT(a.t) + ' + ' + texKg(z.m * 1000) + ' \\cdot ' + texT(z.t) + '}{' + texKg(a.m * 1000) + ' + ' + texKg(z.m * 1000) + '}' + un));
          pezzi.push(ris('\\approx ' + texNum(e.te, 1) + un));
        } else if (tipo === 'bilancio' && k.length === 2) {
          /* 1 il corpo caldo, 2 il freddo, come nella teoria */
          const caldo = k[0].t >= k[1].t ? k[0] : k[1], freddo = caldo === k[0] ? k[1] : k[0];
          const c1 = L.mistero && caldo.chi === 'blocco' ? 'c_1' : String(caldo.c), te = fatto ? texNum(e.te, 1) : tt + '_e';
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('m_1 \\cdot c_1 \\cdot (' + tt + '_1 - ' + tt + '_e) = m_2 \\cdot c_2 \\cdot (' + tt + '_e - ' + tt + '_2)') + '</span>');
          /* due pezzi, così sul telefono va a capo all'uguale */
          pezzi.push('<span class="pezzo">' + ctx.tex(texKg(caldo.m * 1000) + ' \\cdot ' + c1 + ' \\cdot (' + texT(caldo.t) + ' - ' + te + ')') + '</span>');
          pezzi.push('<span class="pezzo">' + ctx.tex('= ' + texKg(freddo.m * 1000) + ' \\cdot ' + freddo.c + ' \\cdot (' + te + ' - ' + texT(freddo.t) + ')') + '</span>');
          if (L.mistero) pezzi.push('<span class="pezzo ignoto">' + ctx.tex('c_1 = \\ ?') + '</span>');
          else pezzi.push(ris(tt + '_e \\approx ' + texNum(e.te, 1) + un));
        } else {
          /* più corpi (o uno solo): la media pesata con le capacità termiche m·c */
          const C = x => Math.round(x.m * x.c);
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(tt + '_e = \\dfrac{\\sum m \\cdot c \\cdot ' + tt + '}{\\sum m \\cdot c}') + '</span>');
          pezzi.push(numerico(tt + '_e = \\dfrac{' + k.map(x => C(x) + ' \\cdot ' + texT(x.t)).join(' + ') + '}{' + k.map(C).join(' + ') + '}' + un));
          pezzi.push(ris('\\approx ' + texNum(e.te, 1) + un));
        }
        formulaEl.innerHTML = pezzi.join('');
        adattaFormula();
      }
      /* se la formula con i numeri non ci sta (telefono con i caratteri grandi), si rimpicciolisce un poco */
      function adattaFormula() {
        formulaEl.style.fontSize = '';
        const base = parseFloat(getComputedStyle(formulaEl).fontSize);
        /* non sotto 14,4 px: i pedici di KaTeX sono l'85% del testo, e devono restare sopra i 12 px */
        for (let k = 0.95; base * k >= 14.4 && formulaEl.scrollWidth > formulaEl.clientWidth + 1; k -= 0.05) formulaEl.style.fontSize = (base * k).toFixed(1) + 'px';
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
      function aggiornaConta() {
        const L = liv();
        contaEl.textContent = libero ? '' : (L.mistero ? 'di fila: ' + diFila + ' di 2' : 'prove: ' + prove);
      }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaGrafico(); disegnaCose(); }

      /* ---------------- livelli ---------------- */
      function nuovoMistero() {
        const masse = [150, 200, 250, 300, 400];
        let n;
        do { n = { mat: Math.floor(Math.random() * METALLI.length), m: masse[Math.floor(Math.random() * masse.length)] }; }
        while (mistero && n.mat === mistero.mat && n.m === mistero.m);
        mistero = n; p.mat = n.mat; p.mb = n.m; misurato = false;
      }
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false; anim = null;
        libero = false; salvato = null; radice.classList.remove('in-libero');
        livello = n; const L = LIVELLI[n];
        p = Object.assign({ mc: 0, tc: 80, mf: 0, tf: 20, mat: -1, mb: 200, tb: 100 }, L.inizio);
        prove = 0; finito = false; fase = 'prima'; ultimo = null; segni = []; detti = {}; diFila = 0; mistero = null; misurato = false;
        if (L.mistero) nuovoMistero();
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- mescolare ---------------- */
      function mescola() {
        if (animando || finito || fase === 'dopo') return;
        const L = liv(), e = equilibrio(L, p);
        aiutoEl.hidden = true;
        if (e.vuoto) { msg.textContent = 'Il calorimetro è vuoto: versa qualcosa.'; msg.className = 'lab-messaggio'; return; }
        if (e.bolle || e.gela) {
          msg.textContent = e.bolle ? 'Così l\'acqua arriverebbe a bollire: una parte del calore andrebbe nel vapore, e qui il calore latente non è nel conto.' : 'Così una parte dell\'acqua gelerebbe: servirebbe il calore latente, che qui non è nel conto.';
          msg.className = 'lab-messaggio' + (libero ? '' : ' no'); if (!libero) ctx.mascotte('ops');
          return;
        }
        if (!libero) prove++;
        aggiornaConta();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        ultimo = { p: Object.assign({}, p), e };
        animando = true; anim = { u: 0, tau: 0 };
        aggiornaParametri(); aggiornaLivelli(); aggiornaFormula();
        const T_VERSA = 450, T_MESCOLA = 1300, TMAX = 5, t0 = performance.now();
        const passo = ora => {
          const dt = ora - t0;
          anim.u = Math.min(1, dt / T_VERSA);
          anim.tau = dt <= T_VERSA ? 0 : Math.min(TMAX, (dt - T_VERSA) / T_MESCOLA * TMAX);
          disegnaGrafico(); disegnaCose();
          if (anim.tau < TMAX) { raf = requestAnimationFrame(passo); return; }
          raf = 0; finisci(e);
        };
        raf = requestAnimationFrame(passo);
      }

      function finisci(e) {
        animando = false; anim = null; fase = 'dopo';
        const L = liv();
        segni.push(e.te); if (segni.length > 3) segni.shift();
        aggiorna(); aggiornaLivelli();
        if (libero) { msg.textContent = osserva(e); msg.className = 'lab-messaggio'; return; }
        if (L.mistero) {
          misurato = true; aggiornaParametri();
          msg.textContent = 'Equilibrio a ' + num(e.te, 1) + '\u00a0°C. Di che metallo è?'; msg.className = 'lab-messaggio';
          return;
        }
        const v = verdetto(L, p, e);
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, e);
      }

      function vinci(testo) {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + testo + (prove === 1 ? ' Alla prima prova.' : ' Prove: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaParametri();
        ctx.zenone(VITTORIE[livello], { espressione: prove <= 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* livello 5: la risposta sul metallo */
      function rispondi(i) {
        if (animando || finito || !misurato) return;
        const giusto = mistero.mat, nome = METALLI[giusto].id;
        if (i === giusto) {
          diFila++;
          if (diFila >= 2) { aggiornaConta(); vinci('Era ' + nome + ': due pezzi riconosciuti di fila.'); return; }
          msg.textContent = 'Giusto, era ' + nome + '. Ecco un altro pezzo.'; msg.className = 'lab-messaggio ok';
          ctx.mascotte('giusto');
        } else {
          diFila = 0;
          msg.textContent = 'Era ' + nome + ', non ' + METALLI[i].id + '. Ecco un altro pezzo.'; msg.className = 'lab-messaggio no';
          ctx.mascotte('sbagliato');
          dici('c', 'Dall\'acqua ricavi il calore, Q = m·c·Δt; dividilo per la massa del pezzo e per quanti gradi è sceso: è il suo c.');
        }
        nuovoMistero(); fase = 'prima'; ultimo = null; segni = [];
        aggiornaConta(); ridisegnaTutto(); aggiorna();
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, e) {
        const k = e.corpi, haBlocco = k.some(x => x.chi === 'blocco');
        /* «la temperatura finale è la media»: masse d'acqua uguali, ma l'obiettivo non è la media */
        if (!haBlocco && !L.tazza && L.calda && L.fredda && p.mc === p.mf && p.mc > 0) { dici('media', 'Con masse uguali viene la media. Per allontanarti dalla media serve più acqua da una parte: conta quanta ce n\'è.'); return; }
        /* stessa massa d'acqua e di metallo: «allora arrivano a metà» */
        if (haBlocco && !L.calda && p.mf === p.mb) { dici('metallo', 'Stessa massa non vuol dire stessa energia per grado: l\'acqua ne vuole molta di più di un metallo.'); return; }
        /* la tazza dimenticata: è la massa giusta se la tazza non prendesse calore */
        if (L.tazza) {
          const senza = equilibrio(Object.assign({}, L, { tazza: null }), p);
          if (Math.abs(senza.te - L.bersaglio) <= TOL) { dici('tazza', 'Senza la tazza sarebbe giusto. Ma la tazza parte da 20\u00a0°C come l\'acqua e si scalda anche lei: prende la sua parte di calore.'); return; }
        }
        /* il blocco gelato dimenticato */
        if (haBlocco && L.calda && L.totale && p.mc + p.mf === L.totale) {
          const senza = equilibrio(Object.assign({}, L, { blocco: false }), p);
          if (Math.abs(senza.te - L.bersaglio) <= TOL) { dici('gelato', 'Senza il blocco sarebbe giusto. Ma il ferro gelato prende calore dall\'acqua: va messo nel conto.'); return; }
        }
        if (L.kelvin && p.tb < 273) { dici('kelvin', 'Sotto 273\u00a0K il blocco sarebbe sotto zero gradi Celsius: T = t + 273,15.'); return; }
        if (L.totale && p.mc + p.mf !== L.totale) dici('totale', 'Contano due cose insieme: la temperatura e l\'acqua in tutto. Togli da una parte quello che aggiungi dall\'altra.');
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva(e) {   /* osservazioni neutre, mai valutazioni */
        const k = e.corpi.slice();
        let t = 'Equilibrio a ' + num(e.te, 1) + '\u00a0°C.';
        if (k.length < 2) return t + (k.length === 1 ? ' Un corpo da solo resta alla sua temperatura.' : '');
        k.sort((a, z) => z.t - a.t);
        if (Math.abs(k[0].t - k[k.length - 1].t) < 1e-9) return t + ' Partivano tutti dalla stessa temperatura.';
        /* quanto è sceso e salito ciascuno lo dice già il grafico: qui solo i casi da notare */
        if (k.length === 2 && k[0].acqua && k[1].acqua && Math.abs(k[0].m - k[1].m) < 1e-9) t += ' Masse d\'acqua uguali: è la media.';
        return t;
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), prove, finito, fase, ultimo, segni: segni.slice(), detti: Object.assign({}, detti), mistero, diFila, misurato, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        p = { mc: 200, tc: 80, mf: 300, tf: 20, mat: -1, mb: 300, tb: 100 };
        fase = 'prima'; ultimo = null; segni = []; finito = false;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {   /* si torna al livello com'era */
        if (animando) return;
        const z = salvato; libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; prove = z.prove; finito = z.finito; fase = z.fase; ultimo = z.ultimo; segni = z.segni; detti = z.detti; mistero = z.mistero; diFila = z.diFila; misurato = z.misurato;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => lo + Math.round(Math.random() * (hi - lo) / s) * s;
        for (let giro = 0; giro < 50; giro++) {
          p = { mc: r(50, 500, 10), tc: r(50, 95, 5), mf: r(50, 500, 10), tf: r(5, 30, 1), mat: Math.random() < 0.3 ? -1 : r(0, METALLI.length - 1, 1), mb: r(100, 600, 50), tb: Math.random() < 0.2 ? -18 : r(60, 180, 10) };
          const e = equilibrio(LIBERO, p); if (!e.bolle && !e.gela) break;
        }
        fase = 'prima'; msg.textContent = ''; msg.className = 'lab-messaggio';
        ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function torna() {   /* un parametro è cambiato: si riparte con le caraffe piene */
        if (fase === 'dopo') { fase = 'prima'; }
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
      }
      function cambia(k, d) {
        const L = liv();
        if (animando || finito || L.liberi.indexOf(k) < 0) return false;
        if (libero && (k === 'mb' || k === 'tb') && p.mat < 0) return false;
        const lim = limiti(k);
        const nuovo = morsa(Math.round(p[k] + d * lim[2]), lim[0], lim[1]);
        if (nuovo === p[k]) return false;
        p[k] = nuovo; torna();
        if (k === 'mat') ridisegnaTutto();
        aggiorna(); return true;
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        if (k === 'mat') return;
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(40, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const r = ev.target.closest('button[data-r]'); if (r) { rispondi(+r.dataset.r); return; }
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* trascinare il livello dell'acqua in una caraffa: l'altezza è la massa (a passi di 10 g) */
      let presa = null;
      function versaCol(ev) {
        const m = svg.getScreenCTM(); if (!m || !presa) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        const P = S.pos[presa === 'mc' ? 'calda' : 'fredda'];
        const g = morsa(Math.round((P.base - c.y) / (P.h - 8) * M_MAX / 10) * 10, 0, M_MAX);
        if (g !== p[presa]) { p[presa] = g; torna(); aggiorna(); }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        const z = ev.target.closest && ev.target.closest('[data-trascina]');
        if (!z) return;
        presa = z.getAttribute('data-trascina'); aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (er) { /* niente */ }
        versaCol(ev); ev.preventDefault();
      });
      const muovi = ev => { if (presa) { versaCol(ev); ev.preventDefault(); } };
      const molla = () => { if (presa) { presa = null; disegnaCose(); } };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.mescola.addEventListener('click', mescola);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { segni = []; fase = 'prima'; ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        { const L = LIVELLI[livello], caraffe = L.liberi.some(k => k === 'mc' || k === 'mf');
          aiutoEl.querySelector('p').innerHTML = libero ? AIUTO_LIBERO : AIUTO + (caraffe ? AIUTO_CARAFFE : '') + (L.bersaglio != null ? AIUTO_OBIETTIVO : '') + (AIUTI[livello] || ''); }   /* innerHTML: i pedici veri con <sub> */
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
      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg].filter(Boolean);
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      const ro = new ResizeObserver(() => {
        fissi.forEach(stringi);
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto(); adattaFormula();
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
