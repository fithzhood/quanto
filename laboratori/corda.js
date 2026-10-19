/* Laboratorio «La corda» — onde stazionarie e armoniche (argomento onde).
   L'apparato di Melde: un vibratore scuote un capo della corda con frequenza f, l'altro capo passa su una
   carrucola e regge un peso che dà la tensione F. Fra vibratore e carrucola la corda è lunga L.
   Fisica vera: corda smorzata forzata a un capo, fissa all'altro. Con k = 2π·f / v e v = √(F/μ), il profilo è
   Y(x) = a · sin(k̃·(L − x)) / sin(k̃·L), con k̃ = k·(1 − i·γ/ω) (attrito viscoso costante γ). Lontano dalle armoniche
   la corda trema appena; vicino a f_n = n·v/(2·L) nasce l'onda stazionaria con n ventri. La forma è esatta;
   l'ampiezza disegnata è una scala che cresce con quella vera, rispetto al picco che quella corda raggiunge su un'armonica
   (a mezzo hertz dall'armonica la corda arriva a metà: si vede che è quasi, non che è giusto).
   Si sceglie, poi si accende: cambiando un numero il vibratore si spegne (niente scansione gratis).
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-corda .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-corda .lab-scena > svg { width: 100%; height: 100%; }
    .lab-corda svg text { font-family: var(--font); }
    .lab-corda .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-corda .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-corda .consegna:empty { display: none; }
    .lab-corda .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .5em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.4em; }
    .lab-corda .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-corda .formula .ignoto { color: var(--testo3); }
    .lab-corda .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-corda .formula .nota { font-size: .8em; color: var(--testo2); }
    .lab-corda .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-corda .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-corda .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-corda .lab-barra { gap: 5px; } .lab-corda .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-corda .btn[disabled] { opacity: .38; cursor: default; }
    .lab-corda .lab-parametri { max-width: 520px; }
    .lab-corda .lab-parametri.uno { grid-template-columns: 1fr; }
    .lab-corda .lab-param[hidden] { display: none; }
    .lab-corda .lab-param .nome { min-width: 1.4em; }
    .lab-corda .lab-param output { min-width: 4.6em; white-space: nowrap; }
    .lab-corda .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-corda .vinto { display: inline-block; animation: lab-corda-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-corda-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-corda .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-corda .formula .simbolo { display: none; } .lab-corda .formula .nome-stretto { display: inline; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-corda .lab-parametri { grid-template-columns: 1fr; } }
    @container lab (max-width: 420px) {
      .lab-corda .lab-param { gap: 2px; }
      .lab-corda .lab-param .nome { min-width: 1.1em; }
      .lab-corda .lab-param .btn { min-width: 36px; padding: 0 6px; }
      .lab-corda .lab-param output { min-width: 3.3em; font-size: .92em; }
      .lab-corda .lab-parametri { gap: 4px 6px; }
    }
    /* layout fermo: i numeri che cambiano e i cambi di livello non spostano niente */
    .lab-corda .consegna { min-height: 4.2em; }   /* righe riservate alla consegna più lunga */
    .lab-corda .formula { height: 8rem; min-height: 0; overflow: hidden; align-content: center; }   /* altezza fissa: un caso troppo grande si rimpicciolisce (adattaFormula) */
    .lab-corda .lab-messaggio { min-height: 3.2em; }   /* due righe riservate al messaggio */
    @container lab (max-width: 420px) { .lab-corda .consegna { min-height: 4.2em; } .lab-corda .formula { height: 5.6rem; } .lab-corda.in-libero .lab-messaggio { min-height: 3.2em; } }
    .lab-corda .lab-param output { width: 6.8ch; min-width: 6.8ch; text-align: center; }   /* larga quanto «149,5 Hz»: le cifre non spostano i pulsanti */
    /* in verticale i quattro comandi del Libero stanno su due colonne (sul tablet la griglia ne faceva quattro, e uscivano dal pannello) */
    @container lab (max-aspect-ratio: 5 / 4) { .lab-corda .lab-parametri:not(.uno) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    /* sul telefono, nel Libero i quattro comandi stanno su due colonne: pulsanti e caselle un po' più stretti, così il «+» di destra non esce dal bordo */
    @container lab (max-width: 420px) {
      .lab-corda .lab-parametri { column-gap: 4px; }
      .lab-corda .lab-param .nome { min-width: 1em; }
      .lab-corda .lab-param .btn { min-width: 32px; padding: 0 4px; }
      .lab-corda .lab-param output { width: 6.7ch; min-width: 6.7ch; font-size: .9em; }   /* ci sta «150,0 Hz» */
    }
    .lab-corda .lab-barra .b-ric { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* larga già quanto l'etichetta più lunga: vincere non sposta gli altri pulsanti */
    .lab-corda .lab-barra .b-ric::after { content: 'Ricomincia dal primo'; content: 'Ricomincia dal primo' / ''; height: 0; overflow: hidden; visibility: hidden; }
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-corda .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-corda .lab-lato { min-height: 20.8rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-corda .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 28.5rem) / 2)); padding-bottom: max(14px, calc((100cqh - 28.5rem) / 2)); } }
  `;

  /* ---------------- fisica (pura: la usa anche la prova dei livelli in node) ---------------- */
  const TOL = 0.5;                                   /* l'onda «nasce» se f dista al più 0,5 Hz da un'armonica */
  const GAMMA = 2 * Math.PI * TOL / Math.sqrt(3);    /* smorzamento: a 0,5 Hz dall'armonica l'ampiezza è metà del picco */
  const A_MM = 1;                                    /* ampiezza del vibratore, in mm */
  const LIM = { f: [1, 150, 0.5], F: [1, 100, 1], L: [0.3, 2, 0.05] };
  const MU = [1, 2, 4, 5, 10, 16, 20, 25];           /* corde disponibili in modalità libera (g/m) */

  /* le grandezze della corda: p = { f (Hz), F (N), L (m), mu (g/m) } */
  function corda(p) {
    const v = Math.sqrt(p.F / (p.mu / 1000)), f1 = v / (2 * p.L), lam = v / p.f;
    const mezze = p.f / f1, n = Math.round(mezze);
    const scarto = n >= 1 ? Math.abs(p.f - n * f1) : Infinity;
    return { v, f1, lam, mezze, n, scarto, risonanza: n >= 1 && scarto <= TOL + 1e-9 };
  }
  /* il profilo complesso Y(x) in N+1 punti da x = 0 (vibratore) a x = L (carrucola), in mm */
  function profilo(p, N) {
    const c = corda(p), k = 2 * Math.PI * p.f / c.v, eta = GAMMA / (2 * Math.PI * p.f);
    const csin = (a, b) => [Math.sin(a) * Math.cosh(b), -Math.cos(a) * Math.sinh(b)];   /* sin(a − i·b) */
    const den = csin(k * p.L, eta * k * p.L), d2 = den[0] * den[0] + den[1] * den[1];
    const re = [], im = []; let M = 0;
    for (let i = 0; i <= N; i++) {
      const s = p.L * (1 - i / N), nu = csin(k * s, eta * k * s);
      const r = A_MM * (nu[0] * den[0] + nu[1] * den[1]) / d2, m = A_MM * (nu[1] * den[0] - nu[0] * den[1]) / d2;
      re.push(r); im.push(m); M = Math.max(M, Math.hypot(r, m));
    }
    /* il picco che questa corda raggiunge su un'armonica: serve alla scala del disegno */
    const Mpk = A_MM / Math.sinh(GAMMA / (2 * c.f1));
    return { re, im, M, Mpk };
  }
  /* i nodi veri: da x = L indietro di λ/2 alla volta */
  function nodi(p) { const c = corda(p), out = []; for (let x = p.L; x > -1e-9 && out.length < 60; x -= c.lam / 2) out.push(Math.max(0, x)); return out; }
  /* un punto è fermo se in quel punto la forma dell'onda stazionaria passa per zero */
  function fermo(p, x) { const c = corda(p); return Math.abs(Math.sin(2 * Math.PI * (p.L - x) / c.lam)) < 0.15; }

  /* il verdetto di un'accensione: { ok, testo, c } */
  function verdetto(L, p) {
    const c = corda(p);
    if (!c.risonanza) return { ok: false, c, testo: 'La corda trema appena: nessuna onda stazionaria.' };
    const vv = c.n === 1 ? 'un ventre' : c.n + ' ventri';
    if (L.scopo.fermo != null) {
      const sta = fermo(p, L.scopo.fermo);
      if (!sta) return { ok: false, c, testo: 'Onda stazionaria con ' + vv + ', ma il punto rosso si muove.' };
      const piuBassa = [1, 2, 3, 4, 5, 6].find(m => fermo(Object.assign({}, p, { f: m * c.f1 }), L.scopo.fermo));
      if (piuBassa < c.n) return { ok: false, c, testo: 'Punto rosso fermo, con ' + vv + ': c\'è una frequenza più bassa che lo ferma.' };
      return { ok: true, c, testo: 'Onda con ' + vv + ': il punto rosso è su un nodo.' };
    }
    if (c.n === L.scopo.ventri) return { ok: true, c, testo: 'Onda stazionaria con ' + vv + '.' };
    return { ok: false, c, testo: 'Onda stazionaria con ' + vv + ': ' + (L.scopo.ventri === 1 ? 'ne serve uno solo.' : 'ne servono ' + L.scopo.ventri + '.') };
  }

  /* ---------------- livelli ----------------
     regola: il numero che si cambia (gli altri sono fissi). Soluzioni contate con la prova dei livelli
     (f a passi di 0,5 Hz, F di 1 N, L di 5 cm): fra parentesi. */
  const LIVELLI = [
    { consegna: 'Onde a <b>40&nbsp;m/s</b> su una corda lunga <b>1&nbsp;m</b>: trova la frequenza che dà <b>un ventre</b>.',
      regola: 'f', p: { f: 8, F: 16, L: 1, mu: 10 }, vista: 1, scopo: { ventri: 1 }, formula: 'mezze', v: 'nota' },            /* 19,5 – 20,5 Hz */
    { consegna: 'Stessa corda: adesso deve vibrare con <b>tre ventri</b>.',
      regola: 'f', p: { f: 20, F: 16, L: 1, mu: 10 }, vista: 1, scopo: { ventri: 3 }, formula: 'mezze', v: 'nota' },           /* 59,5 – 60,5 Hz */
    { consegna: 'Corda di <b>1,2&nbsp;m</b>, tesa con <b>36&nbsp;N</b>, μ&nbsp;=&nbsp;<b>10&nbsp;g/m</b>: trova la frequenza dei <b>due ventri</b>.',
      regola: 'f', p: { f: 20, F: 36, L: 1.2, mu: 10 }, vista: 1.2, scopo: { ventri: 2 }, formula: 'mezze', v: 'dopo' },       /* 49,5 – 50,5 Hz */
    { consegna: 'Corda misteriosa: a <b>50&nbsp;Hz</b> vibra con due ventri (prova). Trova la frequenza dei <b>tre ventri</b>.',
      regola: 'f', p: { f: 50, F: 25, L: 1, mu: 10 }, vista: 1, scopo: { ventri: 3 }, nascondi: ['F', 'mu'], formula: 'armoniche' },   /* 74,5 – 75,5 Hz */
    { consegna: 'Vibratore fisso a <b>60&nbsp;Hz</b>. Sposta la carrucola: la corda deve vibrare con <b>tre ventri</b>.',
      regola: 'L', p: { f: 60, F: 16, L: 1.5, mu: 10 }, vista: 2, scopo: { ventri: 3 }, formula: 'mezze', v: 'sempre' },       /* L = 1,00 m */
    { consegna: 'Vibratore fisso a <b>50&nbsp;Hz</b>, corda di <b>1&nbsp;m</b> con μ&nbsp;=&nbsp;<b>10&nbsp;g/m</b>: trova la tensione dei <b>due ventri</b>.',
      regola: 'F', p: { f: 50, F: 9, L: 1, mu: 10 }, vista: 1, scopo: { ventri: 2 }, formula: 'mezze', v: 'dopo' },           /* F = 25 N */
    { consegna: 'Fai nascere l\'onda che tiene <b>fermo</b> il punto rosso, a 40&nbsp;cm, con la frequenza <b>più bassa</b>.',
      regola: 'f', p: { f: 25, F: 36, L: 1.2, mu: 10 }, vista: 1.2, scopo: { fermo: 0.4 }, formula: 'mezze', v: 'sempre' },    /* 74,5 – 75,5 Hz */
    { consegna: 'A <b>16&nbsp;N</b> questa corda ha la fondamentale a <b>20&nbsp;Hz</b>. Col vibratore a <b>40&nbsp;Hz</b>, trova la tensione di <b>un ventre</b>.',
      regola: 'F', p: { f: 40, F: 16, L: 1, mu: 10 }, vista: 1, scopo: { ventri: 1 }, nascondi: ['mu'], formula: 'rapporto' }  /* 63 – 65 N */
  ];
  const LIBERO = { consegna: '', regola: 'tutto', p: { f: 20, F: 16, L: 1, mu: 10 }, vista: 2, scopo: {}, formula: 'libero', v: 'sempre' };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    'Un ventre: sulla corda sta mezza lunghezza d\'onda, λ = 2\u00a0m, e 40 / 2 fa 20\u00a0Hz.',
    'Tre ventri a tre volte la fondamentale: le armoniche sono multipli interi di f₁.',
    'v = √(36 / 0,010) = 60\u00a0m/s; due ventri vogliono λ = L = 1,2\u00a0m, e 60 / 1,2 fa 50\u00a0Hz.',
    'Due ventri a 50\u00a0Hz vogliono dire f₁ = 25\u00a0Hz: la terza armonica è 3 · 25 = 75\u00a0Hz.',
    'La λ la decidono vibratore e corda: con L = 1\u00a0m ci stanno proprio tre mezze onde.',
    'A 25\u00a0N l\'onda corre a 50\u00a0m/s: λ = 1\u00a0m, e su un metro stanno due mezze onde.',
    'Con tre ventri i nodi stanno ogni 40\u00a0cm: il punto rosso cade su un nodo.',
    'Quattro volte la tensione, velocità doppia: la fondamentale sale da 20 a 40\u00a0Hz.'
  ];

  const AIUTO = 'Il vibratore a sinistra scuote la corda con la frequenza f; a destra la corda passa sulla carrucola e regge un peso: la tensione F. Fra i due la corda è lunga L, e ha densità lineare μ (la massa di un metro). Le onde corrono a v = √(F/μ), con μ in kg/m. Scegli il numero con − e + (o trascinando nella scena il vibratore, il peso o la carrucola), poi premi «Accendi»: se cambi un numero il vibratore si spegne. L\'onda stazionaria nasce solo se sulla corda stanno mezze onde intere: vale se f dista al più 0,5\u00a0Hz da un\'armonica <i>f</i><sub><i>n</i></sub> = <i>n</i> · <i>v</i> / (2 · <i>L</i>). Il moto è al rallentatore.';
  const AIUTI = {
    1: ' Le armoniche sono i multipli interi della fondamentale.',
    2: ' Prima la velocità: 10\u00a0g/m sono 0,010\u00a0kg/m.',
    3: ' Con due ventri a 50\u00a0Hz, quanto vale la fondamentale?',
    4: ' La frequenza è fissa, quindi è fissa anche λ = v / f. Cambiando L cambia quante mezze onde ci stanno.',
    5: ' Due ventri vogliono dire λ = L. Che velocità serve, a 50\u00a0Hz? E quale tensione la dà?',
    6: ' I nodi stanno ogni λ/2 a partire dai capi: 40\u00a0cm deve essere un multiplo di λ/2.',
    7: ' μ non la conosci, ma non serve: v va con la radice di F.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è obiettivo: scegli la frequenza f, la tensione F, la lunghezza L e la corda (μ). Il vibratore resta acceso e la corda risponde subito: cerca le armoniche, guarda dove cadono i nodi, e prova a prevedere che cosa succede se raddoppi F o dimezzi L.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  /* decimali fissi per grandezza, dal passo del comando: f a 0,5 Hz (un decimale), F a 1 N e μ in g/m (interi), L a 5 cm (due decimali) */
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  const texMu = mu => texNum(mu / 1000, 3);   /* μ intera in g/m: in kg/m sempre tre decimali, 10 g/m → 0{,}010 */
  const NB = ' ';

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  QUANTO.registraLab({
    id: 'corda',
    fisica: { corda, profilo, nodi, fermo, verdetto, LIVELLI, LIM, TOL },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-corda')) { const s = document.createElement('style'); s.id = 'stile-lab-corda'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-corda');
      const riga = (k, nome, giu, su) => `<div class="lab-param" data-p="${k}"><span class="nome">${ctx.tex(nome)}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${giu}">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="${su}">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, frequenza, tensione, lunghezza e corda le scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${riga('f', 'f', 'frequenza più bassa', 'frequenza più alta')}
              ${riga('F', 'F', 'meno tensione', 'più tensione')}
              ${riga('L', 'L', 'corda più corta', 'corda più lunga')}
              ${riga('mu', '\\mu', 'corda più leggera', 'corda più pesante')}
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">〰 Accendi</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { f: q('[data-p="f"]'), F: q('[data-p="F"]'), L: q('[data-p="L"]'), mu: q('[data-p="mu"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, p = { f: 20, F: 16, L: 1, mu: 10 }, prove = 0, finito = false;
      let acceso = false, env = 0, tAcceso = 0, ultimo = null, detti = {}, verdettoTimer = 0;
      let libero = false, salvato = null, raf = 0, tPrec = 0, fase = 0;
      let prof = null;                       /* il profilo della corda per i numeri attuali */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const nascosto = k => !libero && (liv().nascondi || []).indexOf(k) >= 0;
      const mobile = k => !finito && (libero || liv().regola === k);

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Una corda tesa fra un vibratore e una carrucola con un peso appeso', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gInv = el('g'), gCorda = el('g'), gPezzi = el('g'), gSegni = el('g'), gTesti = el('g');
      [gFondo, gInv, gCorda, gPezzi, gSegni, gTesti].forEach(g => svg.appendChild(g));
      const filo = el('path', { fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const asta = el('line', { stroke: 'var(--testo2)', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const puntoRosso = el('circle', { r: 6, fill: 'var(--no)', stroke: 'var(--sup)', 'stroke-width': 1.5 });
      gCorda.appendChild(asta); gCorda.appendChild(filo);
      const rallenta = el('text', { x: 10, y: 20, fill: 'var(--testo2)', style: 'font: 600 13px var(--font)' });
      gTesti.appendChild(rallenta);

      /* geometria: S = { w, h, U (px per metro), ox (x = 0), yc (corda a riposo), H (ampiezza massima disegnata), yr (righello) } */
      let S = { w: 400, h: 300, U: 200, ox: 70, yc: 120, H: 80, yr: 260 };
      const PX = x => S.ox + x * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(r.width)), h = Math.max(200, Math.round(r.height));
        const sx = 74, dx = 70;
        const U = (w - sx - dx) / liv().vista;
        const yr = h - 30;
        /* in alto 44 px per le scritte, sotto la corda il posto per il peso appeso e per la riga di L e μ */
        const H = morsa(Math.min((yr - 74) / 2 - 4, yr - 140), 24, 150);
        const yc = Math.round(Math.min(yr - 96, 44 + H + Math.max(0, (yr - 30) - (44 + 2 * H)) * 0.3));
        S = { w, h, U, ox: sx, yc, H, yr };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const RP = 10;   /* raggio della carrucola, px */
      const lato = () => 16 + 2.6 * Math.sqrt(p.F);   /* il peso: un blocco che cresce con F */
      const yPeso = () => S.yc + RP + 20;

      /* il fondo: righello, vibratore, carrucola e peso (cambiano solo con i numeri) */
      function disegnaFondo() {
        vuota(gFondo); vuota(gPezzi);
        const L = liv(), x0 = PX(0), xL = PX(p.L), yc = S.yc, yr = S.yr;
        /* il righello sotto la corda */
        gFondo.appendChild(el('rect', { x: x0 - 4, y: yr - 4, width: PX(L.vista) - x0 + 8, height: 8, rx: 2, fill: '#c9a46a', opacity: .55 }));
        const passo = [0.1, 0.2, 0.25, 0.5].find(s => s * S.U >= 34) || 0.5;
        for (let k = 0; k <= Math.round(L.vista * 20); k++) {
          const x = k / 20, X = PX(x), lungo = Math.abs(x / passo - Math.round(x / passo)) < 1e-6;
          if (k % 2 && S.U * 0.05 < 7) continue;
          gFondo.appendChild(el('line', { x1: X, y1: yr - 4, x2: X, y2: yr + (lungo ? 5 : 1), stroke: 'var(--testo)', 'stroke-width': lungo ? 1.4 : 1, opacity: .55 }));
          if (lungo && X < S.w - 30) gFondo.appendChild(el('text', { x: X, y: yr + 19, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(x, passo === 0.25 ? 2 : 1)));
        }
        gFondo.appendChild(el('text', { x: S.w - 6, y: yr + 19, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'm'));
        if (L.scopo.fermo != null) gFondo.appendChild(el('line', { x1: PX(L.scopo.fermo), y1: yr - 6, x2: PX(L.scopo.fermo), y2: yr + 6, stroke: 'var(--no)', 'stroke-width': 3 }));
        /* L e μ, scritti sopra il righello a metà corda */
        const t = el('text', { x: (x0 + xL) / 2, y: yr - 12, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 4, 'stroke-linejoin': 'round' });
        t.appendChild(el('tspan', { 'font-style': 'italic' }, 'L')); t.appendChild(el('tspan', {}, ' = ' + num(p.L, 2) + NB + 'm' + NB + NB + NB + NB));
        t.appendChild(el('tspan', { 'font-style': 'italic' }, 'μ')); t.appendChild(el('tspan', {}, ' = ' + (nascosto('mu') ? '?' : num(p.mu, 0) + NB + 'g/m')));
        gFondo.appendChild(t);
        /* il vibratore: una scatola sul suo piede, con il display della frequenza */
        const bx = x0 - 64, bw = 54, bh = 60;
        gFondo.appendChild(el('rect', { x: bx + bw / 2 - 5, y: yc + bh / 2, width: 10, height: yr - 4 - yc - bh / 2, fill: 'var(--testo2)', opacity: .55 }));
        gPezzi.appendChild(el('rect', { x: bx, y: yc - bh / 2, width: bw, height: bh, rx: 8, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 2, class: 'presa-f' }));
        gPezzi.appendChild(el('rect', { x: bx + 5, y: yc - 12, width: bw - 10, height: 24, rx: 4, fill: '#10221f' }));
        gPezzi.appendChild(el('text', { x: bx + bw / 2, y: yc + 5, 'text-anchor': 'middle', fill: '#7fe3c4', style: 'font: 700 13px var(--font)' }, num(p.f, 1)));
        gPezzi.appendChild(el('text', { x: bx + bw / 2, y: yc + bh / 2 - 6, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)' }, 'Hz'));
        gPezzi.appendChild(el('circle', { cx: bx + bw - 9, cy: yc - bh / 2 + 9, r: 4, fill: acceso ? 'var(--ok)' : 'var(--bordo2)' }));
        /* la carrucola, il filo che scende e il peso */
        gFondo.appendChild(el('line', { x1: xL, y1: yc + RP, x2: xL, y2: yr - 4, stroke: 'var(--testo2)', 'stroke-width': 4, opacity: .7 }));
        const yp = yPeso(), s = lato();
        gPezzi.appendChild(el('path', { d: `M${xL} ${yc} A${RP} ${RP} 0 0 1 ${xL + RP} ${yc + RP} V${yp}`, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2.4 }));
        gPezzi.appendChild(el('circle', { cx: xL, cy: yc + RP, r: RP, fill: 'var(--sup2)', stroke: 'var(--testo2)', 'stroke-width': 2, class: 'presa-L' }));
        gPezzi.appendChild(el('circle', { cx: xL, cy: yc + RP, r: 2.5, fill: 'var(--testo2)' }));
        gPezzi.appendChild(el('rect', { x: xL + RP - s / 2, y: yp, width: s, height: s, rx: 3, fill: 'var(--testo2)', opacity: .85, class: 'presa-F' }));
        const tf = el('text', { x: xL + RP - s / 2 - 6, y: yp + s / 2 + 5, 'text-anchor': 'end', fill: 'var(--s2)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 4, 'stroke-linejoin': 'round' });
        tf.appendChild(el('tspan', { 'font-style': 'italic' }, 'F')); tf.appendChild(el('tspan', {}, ' = ' + (nascosto('F') ? '?' : num(p.F, 0) + NB + 'N')));
        gPezzi.appendChild(tf);
        if (L.scopo.fermo != null) gCorda.appendChild(puntoRosso); else if (puntoRosso.parentNode) puntoRosso.parentNode.removeChild(puntoRosso);
      }

      /* la corda in un istante: y = env · (Re Y · cos φ − Im Y · sin φ), con la scala dell'ampiezza disegnata */
      /* punti del disegno: almeno 12 per mezza onda, perché anche 90 ventri restino ventri */
      const nuovoProfilo = () => profilo(p, Math.max(120, Math.min(1500, Math.ceil(corda(p).mezze) * 12 + 24)));
      let NP = 120;
      function scala() {   /* px per mm: cresce con l'ampiezza vera M (rispetto al picco di questa corda), satura a S.H */
        const M = prof.M * Math.max(env, 1e-6), r = Math.min(1.2, M / prof.Mpk), D = S.H * 1.125 * r * r * r / (r * r * r + 0.125);
        return M > 1e-9 ? D / M : 0;
      }
      function disegnaCorda() {
        if (!prof) prof = nuovoProfilo();
        NP = prof.re.length - 1;
        const G = scala() * env, c = Math.cos(fase), s = Math.sin(fase);
        let d = '';
        for (let i = 0; i <= NP; i++) {
          const y = prof.re[i] * c - prof.im[i] * s;
          d += (i ? 'L' : 'M') + PX(p.L * i / NP).toFixed(1) + ' ' + (S.yc - G * y).toFixed(1) + ' ';
        }
        filo.setAttribute('d', d);
        const y0 = S.yc - G * (prof.re[0] * c - prof.im[0] * s);
        asta.setAttribute('x1', PX(0) - 10); asta.setAttribute('x2', PX(0)); asta.setAttribute('y1', y0); asta.setAttribute('y2', y0);
        const L = liv();
        if (L.scopo.fermo != null) {
          const i = Math.round(L.scopo.fermo / p.L * NP);
          puntoRosso.setAttribute('cx', PX(p.L * i / NP)); puntoRosso.setAttribute('cy', S.yc - G * (prof.re[i] * c - prof.im[i] * s));
        }
      }
      /* l'inviluppo (la zona che la corda spazza) e i nodi, quando l'onda si è assestata */
      let segniFatti = false;
      function disegnaSegni() {
        vuota(gInv); vuota(gSegni);
        if (!prof || env < 0.9) return;
        NP = prof.re.length - 1;
        const G = scala() * env;
        if (G * prof.M < 6) return;
        let su = '', giu = '';
        for (let i = 0; i <= NP; i++) {
          const a = G * Math.hypot(prof.re[i], prof.im[i]), X = PX(p.L * i / NP).toFixed(1);
          su += (i ? 'L' : 'M') + X + ' ' + (S.yc - a).toFixed(1) + ' ';
          giu = 'L' + X + ' ' + (S.yc + a).toFixed(1) + ' ' + giu;
        }
        gInv.appendChild(el('path', { d: su + giu + 'Z', fill: 'var(--s3)', opacity: .13 }));
        const c = corda(p);
        if (!c.risonanza) return;
        const nn = nodi(p), et = (x, y, testo) => gSegni.appendChild(el('text', { x, y, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, testo));
        nn.forEach(x => gSegni.appendChild(el('circle', { cx: PX(x), cy: S.yc, r: 3.5, fill: 'var(--testo2)' })));
        /* una sola etichetta per tipo, vicino al centro, se c'è spazio */
        if (c.lam / 2 * S.U >= 46) {
          const interni = nn.filter(x => x > 0.02 && x < p.L - 0.02);
          const xn = interni.length ? interni.reduce((m, x) => Math.abs(x - p.L / 2) < Math.abs(m - p.L / 2) ? x : m, interni[0]) : p.L;
          if (interni.length) et(PX(xn), S.yc + 18, 'nodo');
          const xv = xn - c.lam / 4 > 0 ? xn - c.lam / 4 : xn + c.lam / 4;
          et(PX(xv), Math.max(14, S.yc - G * prof.M - 8), 'ventre');
        }
      }
      function rallentatore() { const c = corda(p); let R = Math.max(1, c.f1 / 0.7); if (p.f / R > 3) R = p.f / 3; return R; }
      function scriviRallenta() {
        if (!acceso && env < 0.01) { rallenta.textContent = ''; return; }
        const R = rallentatore();
        rallenta.textContent = R > 1.5 ? 'al rallentatore: ' + Math.round(R) + ' volte' : '';
      }

      /* il ciclo dell'animazione: gira solo mentre la corda si muove */
      function ciclo(ora) {
        const dt = Math.min(0.05, (ora - tPrec) / 1000); tPrec = ora;
        if (acceso) env += (1 - env) * (1 - Math.exp(-dt / 0.14)); else env *= Math.exp(-dt / 0.12);
        fase += 2 * Math.PI * (p.f / rallentatore()) * dt;
        disegnaCorda();
        if (acceso && env > 0.9 && !segniFatti) { segniFatti = true; disegnaSegni(); }
        if (!acceso && env < 0.004) { env = 0; disegnaCorda(); scriviRallenta(); raf = 0; return; }
        raf = requestAnimationFrame(ciclo);
      }
      function avvia() { if (!raf) { tPrec = performance.now(); raf = requestAnimationFrame(ciclo); } }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaCorda(); disegnaSegni(); scriviRallenta(); }

      /* ---------------- pannello ---------------- */
      const testoParam = { f: () => num(p.f, 1) + NB + 'Hz', F: () => nascosto('F') ? '?' : num(p.F, 0) + NB + 'N', L: () => num(p.L, 2) + NB + 'm', mu: () => nascosto('mu') ? '?' : num(p.mu, 0) + NB + 'g/m' };
      function limiti(k) { return k === 'mu' ? [MU[0], MU[MU.length - 1]] : LIM[k]; }
      function aggiornaParametri() {
        const L = liv();
        ['f', 'F', 'L', 'mu'].forEach(k => {
          box[k].querySelector('output').textContent = testoParam[k]();
          box[k].hidden = !libero && L.regola !== k;
          const lim = limiti(k);
          box[k].querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = finito || (d < 0 ? p[k] <= lim[0] + 1e-9 : p[k] >= lim[1] - 1e-9); });
        });
        parametriEl.classList.toggle('uno', !libero);
      }
      /* il ponte con la teoria: i numeri scelti nella formula; il risultato solo dopo l'accensione (in modalità libera subito) */
      /* la formula ha un'altezza fissa: se un caso non ci sta, si rimpicciolisce invece di spingere il resto */
      function adattaFormula() {
        formulaEl.style.fontSize = '';
        const f0 = parseFloat(getComputedStyle(formulaEl).fontSize);
        let f = f0;
        while ((formulaEl.scrollHeight > formulaEl.clientHeight + 1 || formulaEl.scrollWidth > formulaEl.clientWidth + 1) && f > f0 * 0.7) { f *= 0.93; formulaEl.style.fontSize = f.toFixed(2) + 'px'; }
      }
      function aggiornaFormula() {
        const L = liv(), c = corda(p);
        const fatto = libero || (ultimo && ultimo.f === p.f && ultimo.F === p.F && ultimo.L === p.L && ultimo.mu === p.mu);
        const ris = s => fatto ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        const pezzi = [];
        if (L.formula === 'mezze' || L.formula === 'libero') {
          /* una riga per formula, ognuna tutta intera (col risultato dentro): sul telefono la forma simbolica sparisce */
          const vista = L.v === 'nota' || L.v === 'sempre' || fatto;
          const vNum = texNum(c.v, 1);
          const fine = (vis, s) => vis ? ' <span class="esito">' + ctx.tex(s) + '</span>' : ' <span class="ignoto">' + ctx.tex('= \\ ?') + '</span>';
          const riga = (nome, simbolo, numeri, vis, esito) => '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(nome + ' =') + ' </span><span class="simbolo">' + ctx.tex(nome + ' = ' + simbolo + ' =') + ' </span>' + ctx.tex(numeri) + fine(vis, esito) + '</span>';
          if (L.v !== 'nota') pezzi.push(riga('v', '\\sqrt{\\dfrac{F}{\\mu}}', '\\sqrt{\\dfrac{' + texNum(p.F, 0) + '}{' + texMu(p.mu) + '}}\\,\\text{m/s}', vista, '= ' + vNum + '\\,\\text{m/s}'));
          pezzi.push(riga('\\dfrac{L}{\\lambda/2}', '\\dfrac{2 \\cdot L \\cdot f}{v}', '\\dfrac{2 \\cdot ' + texNum(p.L, 2) + ' \\cdot ' + texNum(p.f, 1) + '}{' + (vista ? vNum : 'v') + '}', fatto, '\\approx ' + texNum(c.mezze, 2)));
        } else if (L.formula === 'armoniche') {
          pezzi.push('<span class="pezzo">' + ctx.tex('f_n = n \\cdot f_1') + '</span>');
          pezzi.push(finito ? '<span class="pezzo esito">' + ctx.tex('f_1 = ' + texNum(c.f1, 1) + '\\,\\text{Hz}') + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('f_1 = \\ ?') + '</span>');
        } else if (L.formula === 'rapporto') {
          const r = Math.sqrt(p.F / 16);
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('v = \\sqrt{\\dfrac{F}{\\mu}}') + '</span>');
          pezzi.push('<span class="pezzo">' + ctx.tex('\\dfrac{f_1}{20\\,\\text{Hz}} = \\sqrt{\\dfrac{F}{16\\,\\text{N}}} = \\sqrt{\\dfrac{' + texNum(p.F, 0) + '}{16}}') + '</span>');
          pezzi.push(ris('\\approx ' + texNum(r, 2) + ',\\ \\ f_1 \\approx ' + texNum(20 * r, 1) + '\\,\\text{Hz}'));
        }
        formulaEl.innerHTML = pezzi.join(''); adattaFormula();
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
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'accensioni: ' + prove; }
      function aggiornaVia() {
        if (libero) { b.via.textContent = acceso ? '■ Spegni' : '〰 Accendi'; b.via.disabled = false; return; }
        b.via.textContent = '〰 Accendi'; b.via.disabled = finito || acceso;
      }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); aggiornaVia(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        clearTimeout(verdettoTimer);
        libero = false; salvato = null; radice.classList.remove('in-libero');
        livello = n; const L = LIVELLI[n];
        p = Object.assign({}, L.p); prof = null;
        prove = 0; finito = false; ultimo = null; detti = {}; acceso = false; env = 0; segniFatti = false;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta(); avvia();
      }

      /* accendere il vibratore: la corda va a regime in mezzo secondo, poi si legge l'esito */
      function accendi() {
        if (libero) { acceso = !acceso; disegnaFondo(); aggiornaVia(); scriviRallenta(); osserva(); if (acceso) { vuota(gInv); vuota(gSegni); segniFatti = false; } avvia(); return; }
        if (acceso || finito) return;
        aiutoEl.hidden = true;
        acceso = true; prove++; aggiornaConta();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        vuota(gInv); vuota(gSegni); segniFatti = false;
        disegnaFondo(); aggiornaVia(); scriviRallenta(); avvia();
        const fissati = Object.assign({}, p);
        clearTimeout(verdettoTimer);
        verdettoTimer = setTimeout(() => valuta(fissati), 700);
      }
      function valuta(fissati) {
        const L = liv();
        if (libero || !acceso || fissati.f !== p.f || fissati.F !== p.F || fissati.L !== p.L) return;
        const prec = ultimo;
        ultimo = Object.assign({}, p);
        disegnaSegni(); aggiornaFormula();
        const v = verdetto(L, p);
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, v.c, prec);
      }
      function vinci(testo) {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + testo + (prove === 1 ? ' Al primo colpo.' : ' Accensioni: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiorna();
        ctx.zenone(VITTORIE[livello], { espressione: prove <= 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, c, prec) {
        if (livello === 2 && p.f < 4) { dici('gm', 'μ va in kg/m: 10\u00a0g/m sono 0,010\u00a0kg/m, e sotto la radice fa una bella differenza.'); return; }
        if (livello === 5 && p.F > 25) { dici('tesa', 'Più tensione, onda più veloce e λ più lunga: i ventri diminuiscono, non aumentano.'); return; }
        if (livello === 7 && Math.abs(p.F - 32) <= 1) { dici('radice', 'Hai raddoppiato F, ma v va con la radice di F: per raddoppiare v serve F quattro volte.'); return; }
        if (livello === 3 && c.risonanza && c.n === 4) { dici('passi', 'Da due a tre ventri non si raddoppia la frequenza: si aggiunge una fondamentale.'); return; }
        if (livello === 6 && c.risonanza && !fermo(p, L.scopo.fermo)) { dici('nodi', 'I nodi stanno ogni λ/2 a partire dai capi: 40\u00a0cm deve essere un multiplo di λ/2.'); return; }
        if (!c.risonanza && c.mezze > 0.8 && Math.abs(c.mezze - Math.floor(c.mezze) - 0.5) < 0.06) dici('intere', 'Con ' + num(c.mezze, 1) + ' mezze onde i due capi non possono stare fermi tutti e due: le armoniche sono multipli interi.');
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva() {
        if (!acceso) { msg.textContent = 'Vibratore spento.'; msg.className = 'lab-messaggio'; return; }
        const c = corda(p), f1 = num(c.f1, 1) + '&nbsp;Hz', F1 = '<i>f</i><sub>1</sub>';
        if (!c.risonanza) { msg.innerHTML = F1 + ' = ' + f1 + ': <i>f</i> non ne è un multiplo, la corda trema appena.'; msg.className = 'lab-messaggio'; return; }
        msg.innerHTML = (c.n === 1 ? 'Un ventre' : c.n + ' ventri') + ', <i>f</i> = ' + c.n + ' · ' + F1 + ' = ' + c.n + ' · ' + f1 + '.';
        msg.className = 'lab-messaggio';
      }
      function entraLibero() {
        clearTimeout(verdettoTimer);
        salvato = { livello, p: Object.assign({}, p), prove, finito, ultimo, detti: Object.assign({}, detti), acceso, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        p = Object.assign({}, LIBERO.p); prof = null; finito = false; ultimo = null; acceso = true; env = 1;
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta(); osserva(); avvia();
      }
      function esciLibero() {
        const z = salvato; libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; prof = null; prove = z.prove; finito = z.finito; ultimo = z.ultimo; detti = z.detti; acceso = z.acceso;
        if (!acceso) env = 0;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta(); avvia();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }

      /* ---------------- comandi ---------------- */
      function imposta(k, valore) {
        if (!mobile(k)) return false;
        let nuovo;
        if (k === 'mu') nuovo = valore;
        else { const lim = LIM[k]; nuovo = morsa(Math.round(valore / lim[2]) * lim[2], lim[0], lim[1]); nuovo = Math.round(nuovo * 1000) / 1000; }
        if (nuovo === p[k]) return false;
        p[k] = nuovo; prof = nuovoProfilo();
        vuota(gInv); vuota(gSegni); segniFatti = libero;
        if (libero) { disegnaFondo(); disegnaCorda(); scriviRallenta(); osserva(); setTimeout(() => { if (libero) disegnaSegni(); }, 0); }
        else {
          clearTimeout(verdettoTimer);
          if (acceso) { acceso = false; avvia(); }   /* cambiato un numero: il vibratore si spegne */
          disegnaFondo(); scriviRallenta();
          if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        }
        aggiorna(); return true;
      }
      function cambia(k, d) {
        if (k === 'mu') { const i = MU.indexOf(p.mu); return imposta('mu', MU[morsa(i + d, 0, MU.length - 1)]); }
        return imposta(k, p[k] + d * LIM[k][2]);
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
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(35, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* trascinare nella scena: la carrucola (L, in orizzontale), il peso (F, in giù tira di più), il vibratore (f, in su più alta) */
      let presa = null;
      function punto(ev) { const m = svg.getScreenCTM(); if (!m) return null; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(m.inverse()); }
      svg.addEventListener('pointerdown', ev => {
        const c = punto(ev); if (!c) return;
        const xL = PX(p.L), yp = yPeso(), s = lato();
        let k = null;
        if (Math.abs(c.x - xL) < 26 && c.y > S.yc - 30 && c.y < S.yr && !(c.x > xL + RP - s / 2 - 6 && c.y > yp - 4)) k = 'L';
        else if (c.x > xL + RP - s / 2 - 12 && c.x < xL + RP + s / 2 + 12 && c.y > yp - 10 && c.y < yp + s + 24) k = 'F';
        else if (c.x < PX(0) + 4 && c.x > PX(0) - 74 && Math.abs(c.y - S.yc) < 50) k = 'f';
        if (!k || !mobile(k)) return;
        presa = { k, y0: c.y, v0: p[k] }; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        ev.preventDefault();
      });
      const muovi = ev => {
        if (!presa) return;
        const c = punto(ev); if (!c) return;
        if (presa.k === 'L') imposta('L', (c.x - S.ox) / S.U);
        else if (presa.k === 'F') imposta('F', presa.v0 + Math.round((c.y - presa.y0) / 4));
        else imposta('f', presa.v0 + Math.round((presa.y0 - c.y) / 3) * 0.5);
        ev.preventDefault();
      };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', accendi);
      b.ric.addEventListener('click', () => {
        if (libero) { p = Object.assign({}, LIBERO.p); prof = null; acceso = true; ridisegnaTutto(); aggiorna(); osserva(); avvia(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').innerHTML = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      LIVELLI.forEach((_, k) => {
        const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'lab-pallino';
        pl.setAttribute('aria-label', 'Livello ' + (k + 1)); pl.innerHTML = '<span>' + (k + 1) + '</span>';
        pl.addEventListener('click', () => avviaLivello(k));
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello);
      let forma = '';
      const ro = new ResizeObserver(() => {
        adattaFormula();
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); raf = 0; fermaRipeti(); ro.disconnect(); clearTimeout(verdettoTimer);
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
