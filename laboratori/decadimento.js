/* Laboratorio «Il decadimento» — il tempo di dimezzamento (argomento nucleare).
   Una scatola di nuclei instabili, un orologio, il grafico N(t) che si disegna mentre il tempo scorre.
   Fisica vera: ogni nucleo riceve un istante di decadimento estratto da un'esponenziale di vita media T/ln 2
   (così in ogni istante ha la stessa probabilità di decadere, e dopo T ne resta in media metà), con un generatore
   a seme (mulberry32, come il video nucleare/dimezzamento): i collaudi rivedono sempre le stesse scatole.
   Nei livelli si giudica la previsione (il tempo, il numero, il T), non l'esito della scatola, che il caso sposta:
   la scatola mostra quanto la legge N = N₀·(½)^(t/T) regga con 400 nuclei, e quanto no con pochi.
   Colori come nel video: nuclei da decadere e conteggio azzurri (s1), decaduti grigi, la legge verde (s3).
   Ultimo dei 20 laboratori di Quanto; modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-decadimento .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-decadimento .lab-scena > svg { width: 100%; height: 100%; }
    .lab-decadimento svg text { font-family: var(--font); }
    .lab-decadimento .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-decadimento .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-decadimento .consegna:empty { display: none; }
    .lab-decadimento .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .45em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; min-height: 2.3em; }
    .lab-decadimento .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-decadimento .formula .ignoto { color: var(--testo3); }
    .lab-decadimento .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-decadimento .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-decadimento .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; flex-wrap: wrap; }
    .lab-decadimento .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-decadimento .lab-barra { gap: 5px; } .lab-decadimento .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-decadimento .lab-barra .btn[hidden] { display: none; }
    .lab-decadimento .btn[disabled] { opacity: .38; cursor: default; }
    .lab-decadimento .lab-parametri { max-width: 520px; }
    .lab-decadimento .lab-parametri.uno { grid-template-columns: 1fr; }
    .lab-decadimento .lab-param .nome { min-width: 1.6em; }
    .lab-decadimento .lab-param output { min-width: 3.4em; }
    .lab-decadimento .lab-param .unita { font-size: .8rem; color: var(--testo2); min-width: 2.2em; }
    .lab-decadimento .lab-param[hidden] { display: none; }
    .lab-decadimento .conta { position: absolute; right: 10px; top: 6px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-decadimento .vinto { display: inline-block; animation: lab-decadimento-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-decadimento-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-decadimento .formula .nome-stretto { display: none; }
    @container lab (max-width: 520px) { .lab-decadimento .conta { display: none; } }
    @container lab (max-width: 420px) { .lab-decadimento .formula .simbolo.cede { display: none; } .lab-decadimento .formula .nome-stretto { display: inline; } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const VEL = 1.6;          /* secondi veri per ogni tempo di dimezzamento, quando l'orologio corre */
  const DURATA_MAX = 9;     /* nessuna corsa dura più di 9 s veri */

  /* numeri «a caso» ma ripetibili: mulberry32 con un seme */
  function generatore(seme) {
    let a = seme >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  /* una scatola: l'istante di decadimento di ciascuno degli N0 nuclei. Probabilità costante nel tempo → esponenziale,
     con vita media T/ln 2: la probabilità di essere ancora lì dopo T è e^(−ln 2) = ½ */
  function campione(N0, T, seme) {
    const r = generatore(seme), tau = [];
    for (let i = 0; i < N0; i++) tau.push(-Math.log(1 - r()) * T / Math.LN2);
    const ord = tau.slice().sort((a, b) => a - b);
    return { N0, T, seme, tau, ord };
  }
  /* quanti sono decaduti entro l'istante t (ricerca binaria negli istanti ordinati) */
  function decaduti(c, t) { let a = 0, b = c.ord.length; while (a < b) { const m = (a + b) >> 1; if (c.ord[m] <= t) a = m + 1; else b = m; } return a; }
  const rimasti = (c, t) => c.N0 - decaduti(c, t);
  const legge = (N0, T, t) => N0 * Math.pow(0.5, t / T);
  const contaIn = (c, a, b) => decaduti(c, b) - decaduti(c, a);   /* decadimenti fra a (escluso) e b (incluso) */

  /* ---------------- livelli ----------------
     tipo 'tempo': si regola la sveglia t, l'orologio corre fino a lì; vale se |t − risp| ≤ tol.
     tipo 'numero': si prevede N all'istante tDom; vale se |N − legge| ≤ tol (nel 5: metà dei sopravvissuti veri).
     tipo 'misura': l'orologio è libero, si scrive T; vale se l'errore è sotto tolRel·T.
     Ogni Avvia usa una scatola nuova (seme + 7919·tentativo); nella misura la scatola resta la stessa. */
  const C14 = 5730;
  const LIVELLI = [
    { tipo: 'tempo', T: 10, N0: 400, u: 's', vista: 30, bers: 0.5, risp: 10, tol: 0.5, passo: 0.5, lim: [0, 60], ini: 4, seme: 120,
      consegna: 'Questo isotopo ha <b>T = 10&nbsp;s</b> e la scatola parte con 400 nuclei. Regola la sveglia: quando ne restano <b>200</b>?' },
    { tipo: 'tempo', T: 6, N0: 400, u: 's', vista: 24, bers: 0.25, risp: 12, tol: 0.5, passo: 0.5, lim: [0, 60], ini: 4, seme: 202,
      consegna: 'Qui <b>T = 6&nbsp;s</b>. Quando ne resta <b>un quarto</b>?' },
    { tipo: 'misura', T: 7, N0: 400, u: 's', vista: 35, passo: 0.5, lim: [0.5, 30], ini: 3, tolRel: 0.1, seme: 128,
      consegna: 'Un isotopo sconosciuto. Fai correre l\'orologio e misura il suo <b>T</b>.' },
    { tipo: 'numero', T: 5, N0: 400, u: 's', vista: 25, tDa: 0, tDom: 15, passo: 5, lim: [0, 400], ini: 400, tol: 10, seme: 404,
      consegna: '<b>T = 5&nbsp;s</b>, 400 nuclei. Quanti ne restano dopo <b>15&nbsp;s</b>? Prevedi, poi Avvia.' },
    { tipo: 'numero', T: 8, N0: 400, u: 's', vista: 40, tDa: 24, tDom: 32, passo: 1, ini: 0, sopravv: true, seme: 505,
      consegna: 'Dopo tre dimezzamenti (<b>T = 8&nbsp;s</b>): quanti dei rimasti restano fra altri <b>8&nbsp;s</b>?' },
    { tipo: 'misura', T: 12, N0: 4000, u: 's', vista: 48, passo: 0.5, lim: [0.5, 40], ini: 4, tolRel: 0.12, seme: 118, coperto: true,
      consegna: 'Il campione è chiuso in una scatola opaca: si sente solo il contatore. Dall\'<b>attività</b> ricava <b>T</b>.' },
    { tipo: 'tempo', T: C14, N0: 400, u: 'anni', vista: 20000, bers: 0.25, risp: 2 * C14, tol: 400, passo: 100, lim: [0, 40000], ini: 3000, seme: 103, c14: 'osso',
      consegna: 'Un osso ha <b>un quarto</b> del carbonio-14 di uno vivo (<b>T = 5730\u00a0anni</b>). Quanti anni ha?' },
    { tipo: 'tempo', T: C14, N0: 400, u: 'anni', vista: 20000, bers: 0.3, risp: C14 * Math.log(1 / 0.3) / Math.LN2, tol: 300, passo: 100, lim: [0, 40000], ini: 3000, seme: 107, c14: 'legno',
      consegna: 'Un legno antico ha il <b>30&nbsp;%</b> del carbonio-14 di un legno vivo. Quanti anni ha?' }
  ];
  const tolNumero = (L, S) => L.sopravv ? Math.max(3, Math.round(0.12 * S)) : L.tol;
  const rispNumero = (L, S) => L.sopravv ? S / 2 : legge(L.N0, L.T, L.tDom);
  /* il verdetto su una previsione: S = sopravvissuti all'inizio (solo nel livello 5) */
  function verdetto(L, x, S) {
    if (L.tipo === 'tempo') return Math.abs(x - L.risp) <= L.tol + 1e-9;
    if (L.tipo === 'numero') return Math.abs(x - rispNumero(L, S)) <= tolNumero(L, S) + 1e-9;
    return Math.abs(x - L.T) <= L.tolRel * L.T + 1e-9;
  }
  const N0_LIBERI = [1, 4, 16, 64, 100, 400, 900];

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    () => 'Dopo un tempo T ne resta metà: quale nucleo decade non si sa, quanti sì.',
    () => 'Un quarto è metà della metà: due dimezzamenti, 12\u00a0s. Non si toglie metà e poi l\'altra metà.',
    x => 'T ≈ ' + num(x, x % 1 ? 1 : 0) + ' s: in ogni tratto lungo T il numero si dimezza, da qualunque istante parti.',
    () => 'Tre dimezzamenti: 400, 200, 100, 50. Resta un ottavo, non zero.',
    () => 'Un nucleo non invecchia: chi è sopravvissuto ha la stessa probabilità di prima, e ne decade metà.',
    () => 'L\'attività è proporzionale ai nuclei rimasti: si dimezza con lo stesso T.',
    () => 'Un quarto: due dimezzamenti, 2 · 5730 = 11 460\u00a0anni.',
    () => 'Il 30\u00a0% non è una potenza di ½: t = T · log(N₀/N) / log 2 ≈ 9950\u00a0anni.'
  ];

  const AIUTO = 'Nella scatola ogni pallino azzurro è un nucleo instabile. In ogni istante ognuno ha la stessa probabilità di decadere: quando decade diventa grigio. Quale decade non si può sapere; quanti, sì: dopo un tempo di dimezzamento T ne resta circa metà. L\'orologio corre più veloce del vero (accanto c\'è di quanto). Il grafico disegna N(t), i nuclei rimasti; la curva verde tratteggiata, quando compare, è la legge N = N₀·(½)^(t/T). Con − e + regoli il valore (tieni premuto per andare veloce), oppure trascina nel grafico.';
  const AIUTI = [
    ' Regola la sveglia (la linea verticale nel grafico) e premi Avvia: l\'orologio si ferma lì. Il livello è superato se sbagli di 0,5\u00a0s al massimo.',
    ' Ogni Avvia apre una scatola nuova: il conteggio cambia un poco, la legge no. Il livello è superato se sbagli di 0,5\u00a0s al massimo.',
    ' Avvia l\'orologio (puoi fermarlo e farlo ripartire) e guarda il grafico: tocca la curva per leggere tempo e numero. Poi regola T con − e + e premi Verifica: risponde solo dopo che l\'orologio ha corso. Il livello è superato se sbagli di meno del 10\u00a0%.',
    ' Trascina la previsione nel grafico (o usa − e +), poi Avvia. Il livello è superato se sbagli di 10 nuclei al massimo: la scatola ne sposta qualcuno a caso, la legge no.',
    ' Ogni scatola è nuova, e i sopravvissuti cambiano. Il livello è superato se sbagli di 3 nuclei al massimo, o del 12\u00a0% dei sopravvissuti se sono più di 25.',
    ' Il contatore Geiger conta i decadimenti di ogni secondo: è l\'attività, in becquerel (1 Bq = un decadimento al secondo). Ogni barra del grafico è il conteggio di un secondo. Tocca il grafico per leggere una barra, poi Verifica (dopo aver fatto correre l\'orologio). Il livello è superato se sbagli di meno del 12\u00a0%.',
    ' La scatola è il carbonio-14 di un osso quando l\'animale è morto; l\'orologio conta gli anni da allora. Il grafico dice quanto ne resta, in percentuale. Il livello è superato se sbagli di 400\u00a0anni al massimo.',
    ' Il 30\u00a0% non è metà né un quarto. Da N = N₀·(½)^(t/T) si ricava t = T·log(N₀/N)/log 2; oppure si legge il grafico. Una scatola di 400 nuclei però sbaglia di qualche centinaio di anni. Il livello è superato se sbagli di 300\u00a0anni al massimo.'
  ];
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da indovinare. Scegli il tempo di dimezzamento T e quanti nuclei mettere nella scatola, poi Avvia: la curva verde è la legge, quella azzurra la scatola. Con molti nuclei la scatola segue la legge; con pochi il caso si vede, e con un nucleo solo non si sa proprio quando decadrà. Tocca il grafico per leggere i valori; «Ricomincia» apre una scatola nuova.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  const gruppi = (s, sep) => s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;   /* 5730, ma 11 460 */
  function intero(n) { n = Math.round(n); return (n < 0 ? '−' : '') + gruppi(String(Math.abs(n)), ' '); }
  function texInt(n) { return gruppi(String(Math.round(n)), '\\,'); }
  const texT = v => v % 1 ? texNum(v, 1) : String(v);

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const ALONE = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };
  const testo = (a, s) => el('text', Object.assign({}, ALONE, a), s);
  /* un testo con un pedice vero (N₀, A₀): parti = ['N', ['0'], ' = 400'] */
  function testoPedici(a, parti) {
    const t = el('text', Object.assign({}, ALONE, a));
    parti.forEach(p => {
      if (Array.isArray(p)) { t.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 75%' }, p[0])); t.appendChild(el('tspan', {}, ' ')); }
      else t.appendChild(document.createTextNode(p));
    });
    return t;
  }

  QUANTO.registraLab({
    id: 'decadimento',
    fisica: { campione, rimasti, decaduti, legge, verdetto, rispNumero, tolNumero, LIVELLI },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-decadimento')) { const s = document.createElement('style'); s.id = 'stile-lab-decadimento'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-decadimento');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: tempo di dimezzamento e numero di nuclei li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri uno">
              <div class="lab-param" data-p="x"><span class="nome"></span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più">+</button><span class="unita"></span></div>
              <div class="lab-param" data-p="n0" hidden><span class="nome">${ctx.tex('N_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno nuclei">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più nuclei">+</button><span class="unita"></span></div>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">▶ Avvia</button>
              <button type="button" class="btn primario b-verifica" hidden>Verifica</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), verifica: q('.b-verifica'), ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { x: q('[data-p="x"]'), n0: q('[data-p="n0"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, libero = false, salvato = null;
      let x = 0;                          /* il valore che si regola: la sveglia t, il numero previsto N, il T stimato (in libero: T) */
      const lib = { T: 10, iN0: 5 };      /* modalità libera: T in secondi e l'indice in N0_LIBERI */
      let camp = null, tNow = 0;          /* la scatola e l'istante segnato dall'orologio */
      let corso = false;                  /* nei livelli di misura: l'orologio ha corso almeno una volta (prima, Verifica non risponde) */
      let animando = false, raf = 0;
      let tracce = [];                    /* le corse delle scatole precedenti: { c, t1 } */
      let tentativi = 0, finito = false, detti = {}, ultimo = null;   /* ultimo = { x, N, S } dell'ultima corsa giudicata */
      let S = 0, daRifare = false;        /* livello 5: i sopravvissuti alla partenza; dopo una corsa serve una scatola nuova */
      let lettura = null;                 /* l'istante letto toccando il grafico */
      let mostraLegge = false, hist = [];
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const LIBERO = () => ({ tipo: 'libero', T: lib.T, N0: N0_LIBERI[lib.iN0], u: 's', vista: 5 * lib.T, passo: 1, lim: [1, 30], seme: 909 });
      const liv = () => libero ? LIBERO() : LIVELLI[livello];

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Una scatola di nuclei radioattivi, un orologio e il grafico dei nuclei rimasti nel tempo', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gScatola = el('g'), gOro = el('g'), gInfo = el('g'), gAssi = el('g'), gGuide = el('g'), gTracce = el('g'), gCorsa = el('g'), gMarca = el('g');
      [gScatola, gOro, gInfo, gAssi, gGuide, gTracce, gCorsa, gMarca].forEach(g => svg.appendChild(g));
      /* le curve restano dentro il riquadro del grafico (al livello 5 l'asse N è ingrandito) */
      const idClip = 'clip-decad-' + Math.random().toString(36).slice(2, 8);
      const defs = el('defs'), clip = el('clipPath', { id: idClip }), clipRect = el('rect');
      clip.appendChild(clipRect); defs.appendChild(clip); svg.insertBefore(defs, svg.firstChild);
      [gGuide, gTracce, gCorsa].forEach(g => g.setAttribute('clip-path', 'url(#' + idClip + ')'));

      /* G = { w, h, B: scatola { x, y, s }, O: orologio { cx, cy, r }, I: testi { x, y }, P: grafico { x, y, w, h } } */
      let G = { w: 400, h: 300, B: { x: 12, y: 12, s: 150 }, O: { cx: 200, cy: 40, r: 22 }, I: { x: 240, y: 30 }, P: { x: 46, y: 190, w: 330, h: 80 } };
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(r.width)), h = Math.max(200, Math.round(r.height)), m = 12;
        if (w >= h * 1.05 && w >= 600) {   /* fianco a fianco: scatola e orologio a sinistra, grafico a destra */
          const s = Math.round(Math.min(w * 0.36, h - 2 * m - 74));
          const y0 = Math.max(m, (h - s - 74) / 2);
          G = { w, h, B: { x: m, y: y0, s }, O: { cx: m + 26, cy: y0 + s + 40, r: 24 }, I: { x: m + 62, y: y0 + s + 26 } };
          const gx = m + s + 52;
          G.P = { x: gx, y: m + 24, w: w - gx - 20, h: h - m - 24 - 34 };
        } else {               /* uno sopra l'altro: in alto scatola e orologio, sotto il grafico */
          const s = Math.round(Math.min(w * 0.55, (h - 3 * m) * 0.47));
          const col = m + s + 14;   /* la colonna accanto alla scatola */
          G = { w, h, B: { x: m, y: m, s }, O: { cx: col + 24, cy: m + 30, r: 22 }, I: { x: col, y: m + 80 } };
          const gy = m + s + 26;
          G.P = { x: 46, y: gy, w: w - 46 - 20, h: h - gy - 32 };
        }
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        const P = G.P; clipRect.setAttribute('x', P.x - 6); clipRect.setAttribute('y', P.y - 4); clipRect.setAttribute('width', P.w + 12); clipRect.setAttribute('height', P.h + 10);
      }

      /* ---------------- la scatola ---------------- */
      let pallini = [], statoP = [], rP = 4, led = null;
      function costruisciScatola() {
        vuota(gScatola); pallini = []; statoP = []; led = null;
        const B = G.B, L = liv();
        gScatola.appendChild(el('rect', { x: B.x, y: B.y, width: B.s, height: B.s, rx: 10, fill: 'var(--sup)', stroke: 'var(--bordo2)', 'stroke-width': 1.5 }));
        if (L.coperto) {   /* il contenitore di piombo, e la spia del contatore Geiger */
          const p = B.s * 0.14;
          gScatola.appendChild(el('rect', { x: B.x + p, y: B.y + p, width: B.s - 2 * p, height: B.s - 2 * p, rx: 8, fill: '#6f7682', opacity: .75 }));
          gScatola.appendChild(el('text', { x: B.x + B.s / 2, y: B.y + B.s / 2 + B.s * 0.07, 'text-anchor': 'middle', fill: '#e8ebef', style: 'font: 700 ' + Math.round(B.s * 0.2) + 'px var(--font)' }, 'Pb'));
          gScatola.appendChild(el('text', { x: B.x + B.s / 2, y: B.y + B.s - p * 0.35, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'piombo'));
          led = el('circle', { cx: B.x + B.s - p * 0.5, cy: B.y + p * 0.5, r: Math.max(5, p * 0.28), fill: 'var(--bordo)' });
          gScatola.appendChild(led);
          return;
        }
        const n = camp.N0, col = Math.ceil(Math.sqrt(n)), righe = Math.ceil(n / col), pad = B.s * 0.06, passo = (B.s - 2 * pad) / col;
        rP = Math.max(1.2, passo * (n === 1 ? 0.28 : 0.36));
        const oy = B.y + pad + (B.s - 2 * pad - righe * passo) / 2;
        for (let i = 0; i < n; i++) {
          const c = el('circle', { cx: (B.x + pad + (i % col + 0.5) * passo).toFixed(1), cy: (oy + (Math.floor(i / col) + 0.5) * passo).toFixed(1), r: rP.toFixed(2) });
          gScatola.appendChild(c); pallini.push(c); statoP.push(-1);
        }
      }
      /* stato di ogni nucleo all'istante t: 0 ancora lì, 1 appena decaduto (lampo giallo), 2 decaduto */
      function aggiornaScatola(t) {
        if (!pallini.length) return;
        const lampo = camp.T * 0.07;
        for (let i = 0; i < pallini.length; i++) {
          const d = t - camp.tau[i], s = d < 0 ? 0 : (animando && d < lampo ? 1 : 2);
          if (s === statoP[i]) continue;
          statoP[i] = s; const c = pallini[i];
          if (s === 0) { c.setAttribute('fill', 'var(--s1)'); c.setAttribute('stroke', 'none'); c.setAttribute('r', rP.toFixed(2)); }
          else if (s === 1) { c.setAttribute('fill', '#f2b632'); c.setAttribute('stroke', 'none'); c.setAttribute('r', (rP * 1.3).toFixed(2)); }
          else { c.setAttribute('fill', 'none'); c.setAttribute('stroke', 'var(--testo3)'); c.setAttribute('stroke-width', Math.max(0.8, rP * 0.3).toFixed(2)); c.setAttribute('r', (rP * 0.55).toFixed(2)); }
        }
      }

      /* ---------------- orologio e conteggio ---------------- */
      let lancetta = null, infoN = null, infoSotto = null, infoT = null, infoVel = null;
      const giro = () => liv().u === 'anni' ? 10000 : 60;
      function costruisciOrologio() {
        vuota(gOro); vuota(gInfo);
        const O = G.O;
        gOro.appendChild(el('circle', { cx: O.cx, cy: O.cy, r: O.r, fill: 'var(--sup)', stroke: 'var(--testo2)', 'stroke-width': 2 }));
        for (let k = 0; k < 12; k++) {
          const a = k * Math.PI / 6, r1 = O.r * (k % 3 ? 0.8 : 0.7);
          gOro.appendChild(el('line', { x1: O.cx + r1 * Math.sin(a), y1: O.cy - r1 * Math.cos(a), x2: O.cx + O.r * 0.92 * Math.sin(a), y2: O.cy - O.r * 0.92 * Math.cos(a), stroke: 'var(--testo2)', 'stroke-width': k % 3 ? 1 : 1.8 }));
        }
        gOro.appendChild(el('rect', { x: O.cx - 4, y: O.cy - O.r - 6, width: 8, height: 5, rx: 1.5, fill: 'var(--testo2)' }));   /* il pulsante del cronometro */
        lancetta = el('line', { x1: O.cx, y1: O.cy, x2: O.cx, y2: O.cy - O.r * 0.78, stroke: 'var(--no)', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
        gOro.appendChild(lancetta);
        gOro.appendChild(el('circle', { cx: O.cx, cy: O.cy, r: 2.6, fill: 'var(--testo)' }));
        /* accanto all'orologio il tempo; sotto il conteggio */
        const lato = G.w >= G.h * 1.05 && G.w >= 600, tx = lato ? G.O.cx + G.O.r + 10 : G.O.cx + G.O.r + 10;
        infoT = testo({ x: tx, y: G.O.cy - 2, fill: 'var(--testo)', style: 'font: 600 15px var(--font)' }, '');
        infoVel = testo({ x: tx, y: G.O.cy + 15, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, '');
        const iy = lato ? G.O.cy + G.O.r + 26 : G.I.y;
        infoN = el('text', { x: lato ? G.B.x : G.I.x, y: iy, fill: 'var(--s1)', style: 'font: 700 17px var(--font)' });
        infoSotto = testo({ x: lato ? G.B.x : G.I.x, y: iy + 18, fill: 'var(--testo2)', style: 'font: 13px var(--font)' }, '');
        [infoT, infoVel, infoN, infoSotto].forEach(e => gInfo.appendChild(e));
        if (lato) {   /* fianco a fianco: tempo a destra dell'orologio, conteggio a destra del tempo se c'è posto */
          const nx = Math.max(G.B.x + G.B.s * 0.52, tx + 128);
          infoN.setAttribute('x', nx); infoN.setAttribute('y', G.O.cy - 2);
          infoSotto.setAttribute('x', nx); infoSotto.setAttribute('y', G.O.cy + 16);
        }
      }
      function velocita() {   /* unità di tempo simulato per ogni secondo vero, quando l'orologio corre */
        const L = liv(); return L.T / VEL;
      }
      function aggiornaInfo() {
        const L = liv();
        if (lancetta) {
          const a = 360 * ((tNow / giro()) % 1);
          lancetta.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' ' + G.O.cx + ' ' + G.O.cy + ')');
        }
        infoT.textContent = 't = ' + (L.u === 'anni' ? intero(Math.round(tNow / 10) * 10) + '\u00a0anni' : num(tNow, 1) + '\u00a0s');
        const v = velocita();
        infoVel.textContent = L.u === 'anni' ? '1\u00a0s vero ≈ ' + intero(Math.round(v / 100) * 100) + '\u00a0anni' : 'veloce ×' + num(v, v < 10 ? 1 : 0);
        vuota(infoN);
        if (L.coperto) {
          const k = Math.floor(tNow), A = k >= 1 ? contaIn(camp, k - 1, k) : null;
          infoN.appendChild(document.createTextNode('A = ' + (A === null ? '…' : A + '\u00a0Bq')));
          infoSotto.textContent = A === null ? 'il contatore conta' : 'nell\'ultimo secondo';
        } else {
          const n = rimasti(camp, tNow);
          infoN.appendChild(document.createTextNode('N = ' + n));
          if (L.c14) infoSotto.textContent = num(100 * n / camp.N0, 0) + '\u00a0% del C-14 iniziale';
          else infoSotto.textContent = camp.N0 === 1 ? 'un nucleo solo' : 'su ' + camp.N0 + ' nuclei';
        }
      }

      /* ---------------- grafico ---------------- */
      const modo = () => { const L = liv(); return L.coperto ? 'A' : (L.c14 ? '%' : 'N'); };
      function passoBello(campo, px, minPx, base) {
        base = base || [1, 2, 5];
        for (let e = -1; e < 7; e++) for (let i = 0; i < base.length; i++) { const s = base[i] * Math.pow(10, e); if (s * px / campo >= minPx) return s; }
        return campo;
      }
      function vista() {
        const L = liv();
        if (vistaBloccata !== null) return vistaBloccata;
        if (L.tipo === 'tempo') { const v = Math.max(L.vista, x * 1.12); const s = L.u === 'anni' ? 5000 : 10; return Math.ceil(v / s) * s; }
        return L.vista;
      }
      function ymax() {
        const m = modo();
        if (m === '%') return 100;
        if (liv().sopravv) return Math.max(20, Math.ceil(S * 1.4 / 10) * 10);   /* livello 5: il grafico ingrandisce i sopravvissuti */
        if (m === 'A') { let mx = 0; for (let k = 0; k < 4; k++) mx = Math.max(mx, hist[k] || 0); return Math.ceil(mx * 1.15 / 50) * 50; }
        return camp.N0;
      }
      const PX = t => G.P.x + t / vista() * G.P.w;
      const PY = n => G.P.y + G.P.h - n / ymax() * G.P.h;
      const yDi = n => modo() === '%' ? 100 * n / camp.N0 : n;   /* da numero di nuclei a ordinata del grafico */
      function disegnaAssi() {
        vuota(gAssi);
        const P = G.P, L = liv(), V = vista(), Y = ymax();
        gAssi.appendChild(el('rect', { x: P.x, y: P.y, width: P.w, height: P.h, fill: 'var(--sup)', opacity: .55 }));
        const sy = passoBello(Y, P.h, 30, modo() === '%' ? [1, 2.5, 5] : null);
        for (let y = 0; y <= Y + 1e-9; y += sy) {
          gAssi.appendChild(el('line', { x1: P.x, y1: PY(y), x2: P.x + P.w, y2: PY(y), stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .7 }));
          gAssi.appendChild(el('text', { x: P.x - 5, y: PY(y) + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, modo() === '%' ? y + ' %' : String(Math.round(y))));
        }
        const sx = passoBello(V, P.w, L.u === 'anni' ? 56 : 36);
        for (let t = 0; t <= V + 1e-9; t += sx) {
          if (t > 0) gAssi.appendChild(el('line', { x1: PX(t), y1: P.y, x2: PX(t), y2: P.y + P.h, stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .45 }));
          if (PX(t) < P.x + P.w - (L.u === 'anni' ? 44 : 24)) gAssi.appendChild(el('text', { x: PX(t), y: P.y + P.h + 16, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, L.u === 'anni' ? intero(t) : num(t, sx % 1 ? 1 : 0)));
        }
        gAssi.appendChild(el('line', { x1: P.x, y1: P.y + P.h, x2: P.x + P.w + 6, y2: P.y + P.h, stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .7 }));
        gAssi.appendChild(el('line', { x1: P.x, y1: P.y + P.h, x2: P.x, y2: P.y - 6, stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .7 }));
        gAssi.appendChild(el('text', { x: P.x + P.w + 8, y: P.y + P.h + 16, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: italic 13px var(--font)' }, L.u === 'anni' ? 'anni' : 't (s)'));
        const ty = modo() === 'A' ? 'A (Bq)' : (modo() === '%' ? 'C-14 rimasto' : 'N');
        gAssi.appendChild(el('text', { x: P.x + 6, y: P.y - 8, fill: 'var(--testo2)', style: 'font: italic 13px var(--font)' }, ty));
      }
      /* la linea del bersaglio (metà, un quarto, l'osso…), la verticale dell'istante chiesto, e la legge */
      function disegnaGuide() {
        vuota(gGuide);
        const L = liv(), P = G.P;
        if (L.tipo === 'tempo') {
          const yb = PY(modo() === '%' ? 100 * L.bers : L.bers * L.N0);
          gGuide.appendChild(el('line', { x1: P.x, y1: yb, x2: P.x + P.w, y2: yb, stroke: 'var(--testo2)', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' }));
          const nome = L.c14 ? (L.c14 === 'osso' ? 'l\'osso: 25\u00a0%' : 'il legno: 30\u00a0%') : (L.bers === 0.5 ? 'metà' : 'un quarto');
          gGuide.appendChild(testo({ x: P.x + P.w - 4, y: yb - 6, 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, nome));
        }
        if (L.tipo === 'numero') {
          gGuide.appendChild(el('line', { x1: PX(L.tDom), y1: P.y, x2: PX(L.tDom), y2: P.y + P.h, stroke: 'var(--testo2)', 'stroke-width': 1.4, 'stroke-dasharray': '3 4' }));
        }
        if (mostraLegge) {
          const T = L.T, V = vista(); let d = '';
          for (let k = 0; k <= 120; k++) {
            const t = V * k / 120;
            const y = modo() === 'A' ? (t < 0.5 ? null : L.N0 * (Math.pow(0.5, (t - 0.5) / T) - Math.pow(0.5, (t + 0.5) / T))) : yDi(legge(camp.N0, T, t));
            if (y === null) continue;
            d += (d ? 'L' : 'M') + PX(t).toFixed(1) + ' ' + Math.max(G.P.y - 3, PY(y)).toFixed(1) + ' ';
          }
          gGuide.appendChild(el('path', { d, fill: 'none', stroke: 'var(--s3)', 'stroke-width': 2.4, 'stroke-dasharray': '7 5', opacity: .95 }));
        }
      }
      /* la curva a gradini di una scatola, da 0 a t1 */
      function scala(c, t1) {
        const y = n => Math.max(G.P.y - 3, PY(modo() === '%' ? 100 * n / c.N0 : n)).toFixed(1);   /* sopra il riquadro resta sul bordo (livello 5) */
        let n = c.N0, d = 'M' + PX(0).toFixed(1) + ' ' + y(n);
        for (let i = 0; i < c.ord.length && c.ord[i] <= t1; i++) { d += 'H' + PX(c.ord[i]).toFixed(1) + 'V' + y(--n); }
        return d + 'H' + PX(t1).toFixed(1);
      }
      function barre(c, t1, g) {   /* l'attività: un rettangolo per ogni secondo, alto quanto i decadimenti contati */
        const lw = Math.max(1, PX(1) - PX(0) - 1.5);
        for (let k = 0; k < t1 && k < vista(); k++) {
          const n = contaIn(c, k, Math.min(k + 1, t1)), y = PY(n);
          g.appendChild(el('rect', { x: (PX(k) + 0.75).toFixed(1), y: y.toFixed(1), width: lw.toFixed(1), height: Math.max(0, G.P.y + G.P.h - y).toFixed(1), fill: 'var(--s1)', opacity: k + 1 <= t1 ? .8 : .45 }));
        }
      }
      function disegnaTracce() {
        vuota(gTracce);
        tracce.forEach((tr, i) => {
          gTracce.appendChild(el('path', { d: scala(tr.c, tr.t1), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 1.5, opacity: 0.22 + 0.1 * i }));
        });
      }
      function disegnaCorsa() {
        vuota(gCorsa);
        if (modo() === 'A') { barre(camp, tNow, gCorsa); return; }
        gCorsa.appendChild(el('path', { d: scala(camp, tNow), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }));
        gCorsa.appendChild(el('circle', { cx: PX(tNow), cy: PY(yDi(rimasti(camp, tNow))), r: 4, fill: 'var(--s1)' }));
      }
      /* la sveglia (livelli a tempo), la previsione (livelli a numero), il cursore di lettura */
      function disegnaMarca() {
        vuota(gMarca);
        const L = liv(), P = G.P;
        if (L.tipo === 'tempo') {
          const xs = PX(x);
          gMarca.appendChild(el('line', { x1: xs, y1: P.y, x2: xs, y2: P.y + P.h, stroke: 'var(--accento)', 'stroke-width': 2, 'stroke-dasharray': '5 4' }));
          gMarca.appendChild(el('circle', { cx: xs, cy: P.y + P.h, r: 8, fill: 'var(--accento)', stroke: 'var(--sup)', 'stroke-width': 2 }));
          const dx = xs > P.x + P.w - 70 ? -6 : 6;
          gMarca.appendChild(testo({ x: xs + dx, y: P.y + 14, 'text-anchor': dx < 0 ? 'end' : 'start', fill: 'var(--accento-testo)', style: 'font: 600 13px var(--font)' }, '⏰ ' + valore(x)));
        }
        if (L.tipo === 'numero') {
          const xs = PX(L.tDom), ys = PY(x);
          gMarca.appendChild(el('path', { d: `M${xs} ${ys - 8} l8 8 l-8 8 l-8 -8 z`, fill: 'var(--accento)', stroke: 'var(--sup)', 'stroke-width': 1.5 }));
          const sotto = ys < P.y + 24;
          gMarca.appendChild(testo({ x: xs - 12, y: sotto ? ys + 20 : ys - 10, 'text-anchor': 'end', fill: 'var(--accento-testo)', style: 'font: 600 13px var(--font)' }, 'previsione ' + x));
          gMarca.appendChild(testo({ x: xs + 4, y: P.y + 13, 'text-anchor': 'start', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, num(L.tDom, 0) + '\u00a0s'));
        }
        if (lettura !== null) {
          const t = Math.min(lettura, tNow), xs = PX(t);
          gMarca.appendChild(el('line', { x1: xs, y1: P.y, x2: xs, y2: P.y + P.h, stroke: 'var(--testo2)', 'stroke-width': 1.2 }));
          let s;
          if (modo() === 'A') { const k = Math.min(Math.floor(t), Math.ceil(tNow) - 1); s = k >= 0 && k + 1 <= tNow ? 'fra ' + k + ' e ' + (k + 1) + '\u00a0s: ' + contaIn(camp, k, k + 1) + '\u00a0Bq' : 'nessun conteggio'; }
          else {
            const n = rimasti(camp, t);
            gMarca.appendChild(el('circle', { cx: xs, cy: PY(yDi(n)), r: 4.5, fill: 'var(--sup)', stroke: 'var(--testo)', 'stroke-width': 2 }));
            s = (L.u === 'anni' ? intero(t) + '\u00a0anni' : 't = ' + num(t, 1) + '\u00a0s') + ' · N = ' + n;
          }
          const dx = xs > P.x + P.w * 0.55 ? -6 : 6;
          gMarca.appendChild(testo({ x: xs + dx, y: P.y + 30, 'text-anchor': dx < 0 ? 'end' : 'start', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, s));
        }
      }
      function disegnaIstante() { aggiornaScatola(tNow); aggiornaInfo(); disegnaCorsa(); disegnaMarca(); aggiornaConta(); }
      function ridisegnaTutto() {
        geometria(); costruisciScatola(); statoP = statoP.map(() => -1); costruisciOrologio();
        disegnaAssi(); disegnaGuide(); disegnaTracce(); disegnaIstante();
      }

      /* ---------------- pannello ---------------- */
      function valore(v) {
        const L = liv();
        if (L.tipo === 'numero') return String(v);
        return L.u === 'anni' ? intero(v) + '\u00a0anni' : num(v, v % 1 ? 1 : 0) + '\u00a0s';
      }
      const limiti = L => L.sopravv ? [0, S] : L.lim;
      function impostaNome() {
        const L = liv();
        const nome = L.tipo === 'tempo' ? 't' : (L.tipo === 'numero' ? 'N' : 'T');
        box.x.querySelector('.nome').innerHTML = ctx.tex(nome);
        box.x.querySelector('.unita').textContent = L.tipo === 'numero' ? 'nuclei' : L.u;
        box.x.title = L.tipo === 'tempo' ? 'La sveglia: l\'orologio si ferma qui' : (L.tipo === 'numero' ? 'La tua previsione' : 'Il tempo di dimezzamento');
        box.n0.querySelector('.unita').textContent = 'nuclei';
      }
      function aggiornaParametri() {
        const L = liv();
        box.x.querySelector('output').textContent = L.tipo === 'numero' ? String(x) : (L.u === 'anni' ? intero(x) : num(x, x % 1 ? 1 : 0));
        box.n0.hidden = !libero; parametriEl.classList.toggle('uno', !libero);
        box.n0.querySelector('output').textContent = String(N0_LIBERI[lib.iN0]);
        const lim = limiti(L), blocca = (animando && L.tipo !== 'misura') || finito || (L.sopravv && daRifare);
        box.x.querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = blocca || (d < 0 ? x <= lim[0] : x >= lim[1]); });
        box.n0.querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? lib.iN0 <= 0 : lib.iN0 >= N0_LIBERI.length - 1); });
      }
      /* il ponte con la teoria: la legge con i numeri; il risultato solo dopo la corsa */
      let ultimaFormula = 0;
      function aggiornaFormula() {
        const L = liv(), pezzi = [], mezzo = '\\left(\\tfrac{1}{2}\\right)';
        const P = (s, cls) => '<span class="pezzo ' + (cls || '') + '">' + ctx.tex(s) + '</span>';
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = v => (Math.abs(v - Math.round(v)) < 1e-9 ? '= ' + texInt(v) : '\\approx ' + texNum(v, v < 10 ? 1 : 0));
        if (L.tipo === 'tempo') {
          const fatto = ultimo && ultimo.x === x;
          if (L.c14) {
            pezzi.push(P('\\dfrac{N}{N_0} = ' + mezzo + '^{t/T}', 'simbolo cede'));
            pezzi.push(numerico('\\dfrac{N}{N_0} = ' + mezzo + '^{' + texInt(x) + '/' + L.T + '}'));
            pezzi.push(fatto ? P('\\approx ' + texNum(100 * Math.pow(0.5, x / L.T), 1) + '\\,\\%', 'esito') : P('= \\ ?', 'ignoto'));
          } else {
            pezzi.push(P('N = N_0 \\cdot ' + mezzo + '^{t/T}', 'simbolo cede'));
            pezzi.push(numerico('N = ' + L.N0 + ' \\cdot ' + mezzo + '^{' + texT(x) + '/' + L.T + '}'));
            pezzi.push(fatto ? P(ris(legge(L.N0, L.T, x)), 'esito') : P('= \\ ?', 'ignoto'));
          }
        } else if (L.tipo === 'numero') {
          pezzi.push(P('N = N_0 \\cdot ' + mezzo + '^{t/T}', ultimo ? 'simbolo cede' : ''));
          if (ultimo) {
            const n0 = L.sopravv ? ultimo.S : L.N0, dt = L.tDom - L.tDa;
            pezzi.push(numerico('N = ' + n0 + ' \\cdot ' + mezzo + '^{' + dt + '/' + L.T + '}'));
            pezzi.push(P(ris(n0 * Math.pow(0.5, dt / L.T)), 'esito'));
          }
        } else if (L.tipo === 'misura') {
          const A = L.coperto ? 'A' : 'N', A0 = L.coperto ? 'A_0' : String(L.N0);
          pezzi.push(P(A + ' = ' + (L.coperto ? 'A_0' : 'N_0') + ' \\cdot ' + mezzo + '^{t/T}', 'simbolo cede'));
          pezzi.push(numerico(A + ' = ' + A0 + ' \\cdot ' + mezzo + '^{t/' + texT(x) + '}'));
          if (finito) pezzi.push(P('T \\approx ' + texT(x) + '\\,\\text{s}', 'esito'));
        } else {   /* libero: la legge all'istante dell'orologio */
          pezzi.push(P('N = N_0 \\cdot ' + mezzo + '^{t/T}', 'simbolo cede'));
          pezzi.push(numerico('N = ' + L.N0 + ' \\cdot ' + mezzo + '^{' + texNum(tNow, 1) + '/' + L.T + '}'));
          pezzi.push(P('\\approx ' + texNum(legge(L.N0, L.T, tNow), L.N0 < 100 ? 1 : 0), 'esito'));
        }
        formulaEl.innerHTML = pezzi.join('');
        ultimaFormula = performance.now();
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = (k > sblocco && k !== livello);
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
      }
      let prove = 0;
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'tentativi: ' + prove; }
      function aggiornaComandi() {
        const L = liv(), libera = L.tipo === 'misura' || L.tipo === 'libero';
        b.verifica.hidden = L.tipo !== 'misura';
        b.verifica.disabled = finito;
        if (libera) b.via.textContent = animando ? '⏸ Ferma' : (tNow <= 0 ? '▶ Avvia' : (tNow >= vista() - 1e-9 ? '▶ Da capo' : '▶ Riprendi'));
        else b.via.textContent = L.sopravv && daRifare ? '▶ Nuova scatola' : '▶ Avvia';
        b.via.disabled = !libera && (animando || finito);
        b.ric.disabled = animando && !libera;
        aggiornaParametri();
      }
      function aggiorna() { aggiornaComandi(); aggiornaFormula(); disegnaMarca(); }

      /* ---------------- livelli ---------------- */
      function nuovaScatola() {
        const L = liv();
        camp = campione(L.N0, L.T, L.seme + 7919 * tentativi);
        hist = [];
        if (L.coperto) for (let k = 0; k < 8; k++) hist.push(contaIn(camp, k, k + 1));
        tNow = L.tDa || 0; S = rimasti(camp, tNow); lettura = null;
      }
      function avviaLivello(n) {
        cancelAnimationFrame(raf); raf = 0; animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        tentativi = 0; prove = 0; finito = false; detti = {}; ultimo = null; tracce = []; mostraLegge = false; daRifare = false; corso = false;
        nuovaScatola();
        x = L.sopravv ? S : L.ini;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio'; aiutoEl.hidden = true;
        b.ric.textContent = 'Ricomincia';
        impostaNome(); ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }

      /* ---------------- l'orologio che corre ---------------- */
      let vistaBloccata = null;
      function corri(t1, alFine) {
        cancelAnimationFrame(raf);
        const L = liv(), da = tNow;
        const durata = Math.min(DURATA_MAX, (t1 - da) / L.T * VEL);
        const ritmo = durata > 0 ? (t1 - da) / durata : 1;
        animando = true; aggiorna();
        let prec = performance.now();
        const passo = ora => {
          const dt = Math.min(0.1, Math.max(0, (ora - prec) / 1000)); prec = ora;
          const prima = tNow; tNow = Math.min(t1, tNow + dt * ritmo);
          if (led) led.setAttribute('fill', contaIn(camp, prima, tNow) > 0 ? '#f2b632' : 'var(--bordo)');
          disegnaIstante();
          if (libero && performance.now() - ultimaFormula > 180) aggiornaFormula();
          if (tNow < t1) { raf = requestAnimationFrame(passo); return; }
          raf = 0; animando = false;
          if (led) led.setAttribute('fill', 'var(--bordo)');
          disegnaIstante(); aggiorna();
          if (alFine) alFine();
        };
        raf = requestAnimationFrame(passo);
      }
      function ferma() {
        cancelAnimationFrame(raf); raf = 0; animando = false;
        if (led) led.setAttribute('fill', 'var(--bordo)');
        disegnaIstante(); aggiorna();
      }

      function via() {
        const L = liv();
        aiutoEl.hidden = true;
        if (L.tipo === 'misura' || L.tipo === 'libero') {
          if (animando) { ferma(); return; }
          if (tNow >= vista() - 1e-9) { tNow = 0; lettura = null; statoP = statoP.map(() => -1); }
          if (L.tipo === 'libero') { msg.textContent = ''; msg.className = 'lab-messaggio'; } else corso = true;
          corri(vista(), L.tipo === 'libero' ? osserva : null);
          return;
        }
        if (animando || finito) return;
        if (L.sopravv && daRifare) {   /* livello 5: si riparte da una scatola nuova, ferma a tre dimezzamenti */
          tracce.push({ c: camp, t1: tNow }); if (tracce.length > 3) tracce.shift();
          tentativi++; nuovaScatola(); x = S; daRifare = false; ultimo = null;
          msg.textContent = 'Scatola nuova: a ' + num(L.tDa, 0) + '\u00a0s ne restano ' + S + '.'; msg.className = 'lab-messaggio';
          ridisegnaTutto(); aggiorna();
          return;
        }
        if (ultimo) {   /* ogni corsa usa una scatola nuova: la vecchia resta come traccia */
          tracce.push({ c: camp, t1: tNow }); if (tracce.length > 3) tracce.shift();
          tentativi++; nuovaScatola(); costruisciScatola(); disegnaTracce(); disegnaCorsa();
        }
        const t1 = L.tipo === 'tempo' ? x : L.tDom;
        if (t1 <= tNow) { msg.textContent = 'Con la sveglia a zero l\'orologio non parte: nessun nucleo ha avuto il tempo di decadere.'; msg.className = 'lab-messaggio'; return; }
        msg.textContent = ''; msg.className = 'lab-messaggio'; lettura = null;
        const xa = x;
        corri(t1, () => giudica(xa));
      }

      /* ---------------- il verdetto ---------------- */
      function giudica(xa) {
        const L = liv(), n = rimasti(camp, tNow);
        ultimo = { x: xa, N: n, S };
        prove++; aggiornaConta();
        const ok = verdetto(L, xa, S);
        let t;
        if (L.tipo === 'tempo') {
          t = L.c14 ? 'A ' + intero(xa) + '\u00a0anni nella scatola resta il ' + num(100 * n / camp.N0, 0) + '\u00a0% del carbonio-14.'
            : 'A ' + valore(xa) + ' ne restano ' + n + ' su ' + camp.N0 + '.';
          if (!ok) t += xa < L.risp ? ' Troppo presto.' : ' Troppo tardi.';
          else t = t.slice(0, -1) + (L.c14 ? ': la legge dice ' + num(100 * legge(1, L.T, xa), 0) + ' %.' : ': la legge dice ' + num(legge(L.N0, L.T, xa), 0) + '.');
        } else {
          const r = rispNumero(L, S);
          t = ok ? 'Previsione giusta: la legge dice ' + num(r, r % 1 ? 1 : 0) + ', nella scatola ne restano ' + n + '.'
            : 'Nella scatola ne restano ' + n + (L.sopravv ? ' dei ' + S : '') + '; tu ne avevi previsti ' + xa + '.';
          if (L.sopravv) daRifare = !ok;
        }
        aggiorna();
        if (ok) { vinci(t); return; }
        msg.textContent = t; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, xa);
      }
      function verifica() {
        const L = liv();
        if (finito || L.tipo !== 'misura') return;
        aiutoEl.hidden = true;
        if (!corso) { msg.textContent = 'Prima misura: fai correre l\'orologio e guarda il grafico.'; msg.className = 'lab-messaggio no'; return; }
        prove++; aggiornaConta();
        if (verdetto(L, x, S)) { if (animando) ferma(); vinci('Giusto: T = ' + valore(L.T) + '.'); return; }
        const cosa = L.coperto ? 'l\'attività' : 'il numero dei nuclei';
        /* niente «troppo alto» o «troppo basso»: si troverebbe T per bisezione, senza misurare */
        msg.textContent = 'T non è ' + valore(x) + '. Cerca nel grafico quando ' + cosa + ' arriva a metà del valore iniziale.';
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, x);
      }
      function vinci(t) {
        finito = true; mostraLegge = true;
        disegnaGuide(); aggiorna();
        msg.innerHTML = '<span class="vinto">' + t + (prove === 1 ? ' Al primo tentativo.' : ' Tentativi: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello](x), { espressione: prove === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, frase) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(frase, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, v) {
        const vicino = (a, b, tol) => Math.abs(a - b) <= tol + 1e-9;
        if (L.tipo === 'tempo' && L.bers === 0.25) {
          const tol = Math.max(L.tol, L.passo);
          if (vicino(v, 1.5 * L.T, tol)) { dici('lineare', 'Non si toglie metà e poi l\'altra metà: nel secondo T decade metà di quello che è rimasto.'); return; }
          if (vicino(v, 4 * L.T, tol)) { dici('quattro', 'Un quarto è metà della metà: due dimezzamenti, non quattro.'); return; }
          if (vicino(v, L.T, tol)) { dici('una', 'Dopo un solo T ne resta metà. Per un quarto deve dimezzarsi ancora.'); return; }
        }
        if (L.c14 === 'legno') {
          if (vicino(v, 1.8 * L.T, 150)) { dici('retta', 'Fra T e 2·T la curva non è una retta: per il 30\u00a0% serve l\'esponente, t = T·log(N₀/N)/log 2.'); return; }
          if (v < L.T) { dici('poco', 'Il 30\u00a0% è meno di metà: sono passati più di 5730\u00a0anni.'); return; }
        }
        if (L.tipo === 'numero' && !L.sopravv) {
          if (v <= 5) { dici('zero', 'Dopo tre dimezzamenti non è finito: ogni volta si dimezza quel che resta.'); return; }
          if (vicino(v, L.N0 / 4, 10)) { dici('due', 'Un quarto è dopo due dimezzamenti; in 15\u00a0s ne stanno tre.'); return; }
          if (vicino(v, L.N0 * 5 / 8, 15)) { dici('meno', 'Non decade sempre lo stesso numero: ogni 5\u00a0s se ne va metà di quelli che ci sono.'); return; }
        }
        if (L.sopravv) {
          if (v < 0.25 * S) { dici('vecchi', 'Un nucleo non invecchia: aver superato tre dimezzamenti non lo avvicina alla fine.'); return; }
          if (v > 0.75 * S) { dici('forti', 'I sopravvissuti non sono più resistenti: hanno avuto fortuna. Ne decade metà, come sempre.'); return; }
        }
        if (L.tipo === 'misura') {
          if (vicino(v, 2 * L.T, 0.15 * 2 * L.T)) { dici('quarto', (L.coperto ? 'A quel tempo l\'attività è un quarto' : 'A quel tempo ne resta un quarto') + ': T è il tempo della metà.'); return; }
          if (v >= 3.5 * L.T) { dici('fine', 'Non si aspetta che decadano tutti: T è quando ne resta metà.'); return; }
        }
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva() {
        const L = liv(), n = camp.N0;
        let t;
        if (n === 1) t = rimasti(camp, tNow) ? 'Il nucleo è ancora lì: quando decadrà non lo sa nessuno.' : 'Il nucleo è decaduto a ' + num(camp.tau[0], 1) + '\u00a0s. Un altro nucleo uguale avrebbe scelto un altro istante.';
        else {
          t = 'A t = T ne restavano ' + rimasti(camp, L.T) + ' su ' + n + '; la legge ne dice ' + num(n / 2, n % 2 ? 1 : 0) + '.';
          if (n <= 16) t += ' Con pochi nuclei il caso pesa di più.';
        }
        msg.textContent = t; msg.className = 'lab-messaggio';
        aggiornaFormula();
      }
      function mostraLibero() { radice.classList.toggle('in-libero', libero); }
      function rinnovaLibero() {   /* T o N₀ cambiati: scatola nuova, orologio a zero */
        cancelAnimationFrame(raf); raf = 0; animando = false;
        x = lib.T; tracce = []; nuovaScatola();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        ridisegnaTutto(); aggiorna();
      }
      function entraLibero() {
        cancelAnimationFrame(raf); raf = 0; animando = false;
        salvato = { livello, corso, x, camp, tNow, tracce: tracce.slice(), tentativi, prove, finito, detti: Object.assign({}, detti), ultimo, S, daRifare, mostraLegge, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        finito = false; ultimo = null; mostraLegge = true; daRifare = false; tentativi = 0;
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        impostaNome(); rinnovaLibero(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {   /* si torna al livello com'era */
        cancelAnimationFrame(raf); raf = 0; animando = false;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; corso = z.corso; x = z.x; camp = z.camp; tNow = z.tNow; tracce = z.tracce; tentativi = z.tentativi; prove = z.prove; finito = z.finito;
        detti = z.detti; ultimo = z.ultimo; S = z.S; daRifare = z.daRifare; mostraLegge = z.mostraLegge; lettura = null;
        hist = []; if (LIVELLI[livello].coperto) for (let k = 0; k < 8; k++) hist.push(contaIn(camp, k, k + 1));
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        impostaNome(); ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        const L = liv();
        if (animando && L.tipo !== 'misura') return false;
        if (k === 'n0') {
          if (!libero) return false;
          const i = morsa(lib.iN0 + d, 0, N0_LIBERI.length - 1);
          if (i === lib.iN0) return false;
          lib.iN0 = i; rinnovaLibero(); return true;
        }
        if (finito || (L.sopravv && daRifare)) return false;
        const lim = limiti(L);
        const nuovo = morsa(Math.round((x + d * L.passo) * 100) / 100, lim[0], lim[1]);
        if (nuovo === x) return false;
        x = nuovo;
        if (libero) { lib.T = x; rinnovaLibero(); return true; }
        if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (L.tipo === 'tempo') { disegnaAssi(); disegnaGuide(); disegnaTracce(); disegnaCorsa(); }
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
        if (k === 'n0') return;   /* le scatole non si ripetono a raffica */
        let attesa = 380;
        const giro2 = () => { if (cambia(k, d)) { attesa = Math.max(40, attesa * 0.75); ripeti = setTimeout(giro2, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro2, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* il dito sul grafico: sposta la sveglia o la previsione, oppure legge la curva */
      let presa = null;
      function puntoSvg(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        return pt.matrixTransform(m.inverse());
      }
      function tocco(c) {
        const L = liv(), P = G.P;
        if (presa === 'x') {
          const lim = limiti(L);
          if (L.tipo === 'tempo') {
            const t = (c.x - P.x) / P.w * vista();
            x = morsa(Math.round(t / L.passo) * L.passo, lim[0], Math.min(lim[1], vista()));
          } else {
            const n = (P.y + P.h - c.y) / P.h * ymax();
            x = morsa(Math.round(n / L.passo) * L.passo, lim[0], lim[1]);
          }
          if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
          aggiorna();
        } else if (presa === 'lettura') {
          lettura = morsa((c.x - P.x) / P.w * vista(), 0, vista());
          disegnaMarca();
        }
      }
      svg.addEventListener('pointerdown', ev => {
        const c = puntoSvg(ev); if (!c) return;
        const P = G.P;
        if (c.x < P.x - 16 || c.x > P.x + P.w + 16 || c.y < P.y - 16 || c.y > P.y + P.h + 26) return;
        const L = liv();
        const sposta = (L.tipo === 'tempo' || L.tipo === 'numero') && !animando && !finito && !(L.sopravv && daRifare);
        presa = sposta ? 'x' : 'lettura';
        if (presa === 'x' && L.tipo === 'tempo') vistaBloccata = vista();
        aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        tocco(c); ev.preventDefault();
      });
      const muovi = ev => { if (!presa) return; const c = puntoSvg(ev); if (c) tocco(c); ev.preventDefault(); };
      const molla = () => {
        if (!presa) return;
        const eraX = presa === 'x'; presa = null;
        if (eraX && vistaBloccata !== null) { vistaBloccata = null; disegnaAssi(); disegnaGuide(); disegnaTracce(); disegnaCorsa(); disegnaMarca(); }
      };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', via);
      b.verifica.addEventListener('click', verifica);
      b.ric.addEventListener('click', () => {
        const L = liv();
        if (animando && L.tipo !== 'misura' && !libero) return;
        if (libero) { tentativi++; rinnovaLibero(); return; }
        if (finito) { avviaLivello((livello + 1) % LIVELLI.length); return; }
        if (L.tipo === 'misura') { ferma(); tNow = 0; lettura = null; msg.textContent = ''; msg.className = 'lab-messaggio'; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(livello);
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
        pl.addEventListener('click', () => avviaLivello(k));
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
