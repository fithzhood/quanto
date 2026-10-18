/* Laboratorio «La dinamo» — induzione elettromagnetica (argomento induzione).
   Si trascina una calamita a sbarra dentro e fuori da una bobina (in un livello si trascina la bobina). La bobina è
   chiusa su due led montati al contrario: il rosso conduce quando la f.e.m. è negativa, il giallo quando è positiva,
   e solo sopra la soglia di 1,8 V.
   Modello (dichiarato nel «?»): la calamita è un dipolo sull'asse della bobina. Il flusso del dipolo in una spira di
   raggio a, a distanza z, è Φ₀·(1 + z²/a²)^(−3/2) (lo stesso del video induzione/faraday); il flusso medio per spira di
   una bobina lunga ℓ si integra in forma chiusa: Φ = Φ₀·(a/ℓ)·[u/√(1+u²)] fra u₋ = (d − ℓ/2)/a e u₊ = (d + ℓ/2)/a,
   con d la distanza fra il centro della calamita e il centro della bobina. Il flusso si calcola dalla posizione a ogni
   campione (eventi del dito e fotogrammi), la f.e.m. è ℰ = −N·ΔΦ/Δt sugli ultimi 0,05 s.
   Il concetto: conta la variazione del flusso, non il campo (calamita ferma dentro = niente), e il verso della
   corrente segue Lenz. Modello del laboratorio: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-dinamo .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; cursor: grab; }
    .lab-dinamo .lab-scena:active { cursor: grabbing; }
    .lab-dinamo .lab-scena > svg { width: 100%; height: 100%; outline-offset: -3px; }
    .lab-dinamo svg text { font-family: var(--font); }
    .lab-dinamo .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-dinamo .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-dinamo .consegna:empty { display: none; }
    .lab-dinamo .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .5em; font-size: clamp(.95rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.6em; }
    .lab-dinamo .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-dinamo .formula .fi { color: var(--s3); }
    .lab-dinamo .formula .esito { color: var(--s2); font-weight: 600; }
    .lab-dinamo .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-dinamo .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-dinamo .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-dinamo .lab-barra { gap: 5px; } .lab-dinamo .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-dinamo .btn[disabled] { opacity: .38; cursor: default; }
    .lab-dinamo .lab-parametri { max-width: 520px; }
    .lab-dinamo .lab-param .nome { min-width: 1.6em; }
    .lab-dinamo .lab-param output { min-width: 3em; }
    .lab-dinamo .lab-param .unita { font-size: .8rem; color: var(--testo2); }
    .lab-dinamo .lab-parametri > .btn { justify-self: stretch; }
    .lab-dinamo .vinto { display: inline-block; animation: lab-dinamo-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-dinamo-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-dinamo .formula .simbolo { display: inline-block; }
    @container lab (max-width: 420px) { .lab-dinamo .formula .simbolo { display: none; } }
    /* layout fermo: i numeri che cambiano e i cambi di livello non spostano niente */
    .lab-dinamo .consegna { min-height: 2.9em; }   /* righe riservate alla consegna più lunga */
    .lab-dinamo .formula { height: 7.4rem; min-height: 0; overflow: hidden; align-content: center; }   /* altezza fissa: un caso troppo grande si rimpicciolisce (adattaFormula) */
    .lab-dinamo .lab-messaggio { min-height: 3em; }   /* due righe riservate al messaggio */
    @container lab (max-width: 420px) { .lab-dinamo .consegna { min-height: 4.2em; } .lab-dinamo .formula { height: 5.5rem; } }
    .lab-dinamo .lab-param output { text-align: center; }
    .lab-dinamo .lab-param[data-p="f"] output { width: 4.3em; min-width: 4.3em; }   /* larga quanto «0,8 mWb»: le cifre non spostano i pulsanti */
    .lab-dinamo .lab-barra .b-ric { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* larga già quanto l'etichetta più lunga: vincere non sposta gli altri pulsanti */
    .lab-dinamo .lab-barra .b-ric::after { content: 'Ricomincia dal primo'; content: 'Ricomincia dal primo' / ''; height: 0; overflow: hidden; visibility: hidden; }
    .lab-dinamo .lab-messaggio.ok { animation: none; }   /* i lampi contati non fanno sobbalzare il messaggio; la vittoria salta già con .vinto */
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-dinamo .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-dinamo .lab-lato { min-height: 18.6rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-dinamo .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 22.2rem) / 2)); padding-bottom: max(14px, calc((100cqh - 22.2rem) / 2)); } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const A = 0.02, LC = 0.08;          /* raggio e lunghezza della bobina, in metri */
  const SOGLIA = 1.8, W = 0.05;       /* soglia dei led (V) e finestra su cui si misura ΔΦ/Δt (s) */
  const STORIA = 4;                   /* secondi mostrati nei grafici */
  const MEZZA = 0.025, SPESSA = 0.008;  /* mezza lunghezza e mezzo spessore della calamita (m) */
  const PISTA_C = 0.12, PISTA_B = 0.10, XW = 0.148;   /* corsa della calamita, della bobina, mezza larghezza del banco */
  const LUCE = { rosso: '#e5483b', giallo: '#f2b322' };   /* luci dei led: uguali nei due temi */

  /* flusso medio per spira (mWb): d = posizione della calamita meno posizione della bobina (m), s = +1 se il nord guarda a destra */
  function flusso(d, s, phi0) {
    const up = (d + LC / 2) / A, um = (d - LC / 2) / A;
    return s * phi0 * (A / LC) * (up / Math.sqrt(1 + up * up) - um / Math.sqrt(1 + um * um));
  }

  /* il rivelatore: dai campioni (t, d, Φ) ricava ΔΦ/Δt, la f.e.m., la velocità relativa e lo stato dei led */
  function nuovoLed() { return { on: false, da: -1, spento: -9, contato: false }; }
  function Rivelatore(N) { this.N = N; this.reset(); }
  Rivelatore.prototype.reset = function () {
    this.c = []; this.e = 0; this.v = 0; this.dphi = 0; this.dt = W; this.phi = 0;
    this.led = { rosso: nuovoLed(), giallo: nuovoLed() };
  };
  Rivelatore.prototype.campione = function (t, d, phi) {
    const c = this.c;
    if (c.length && t - c[c.length - 1].t < 0.002) { const u = c[c.length - 1]; u.d = d; u.phi = phi; t = u.t; }
    else c.push({ t, d, phi, e: 0 });
    while (c.length > 2 && c[1].t < t - STORIA - 0.5) c.shift();
    /* il valore di Φ (e di d) a t − W, interpolato fra due campioni */
    const t0 = t - W; let k = c.length - 1;
    while (k > 0 && c[k - 1].t > t0) k--;
    let pa, da, ta;
    if (k === 0) { pa = c[0].phi; da = c[0].d; ta = c[0].t; }
    else { const p = c[k - 1], q = c[k], f = q.t > p.t ? (t0 - p.t) / (q.t - p.t) : 1; pa = p.phi + (q.phi - p.phi) * f; da = p.d + (q.d - p.d) * f; ta = t0; }
    const dt = t - ta;
    this.phi = phi;
    if (dt < 0.008) { this.dphi = 0; this.dt = W; this.e = 0; this.v = 0; }
    else { this.dphi = phi - pa; this.dt = dt; this.e = -this.N * this.dphi * 1e-3 / dt; this.v = (d - da) / dt; }
    c[c.length - 1].e = this.e;
    return this.leds(t);
  };
  /* un led è acceso se la f.e.m. supera la soglia nel suo verso; un lampo conta se resta acceso almeno 0,02 s
     (se si riaccende entro 0,06 s è lo stesso lampo) */
  Rivelatore.prototype.leds = function (t) {
    const nuovi = [];
    ['rosso', 'giallo'].forEach(k => {
      const L = this.led[k], acceso = k === 'rosso' ? this.e < -SOGLIA : this.e > SOGLIA;
      if (acceso) {
        if (!L.on) { L.on = true; if (t - L.spento > 0.06) { L.da = t; L.contato = false; } }
        if (!L.contato && t - L.da >= 0.02) { L.contato = true; nuovi.push(k); }
      } else if (L.on) { L.on = false; L.spento = t; }
    });
    return nuovi;
  };
  /* un passo del moto: se dall'ultimo campione la calamita ha fatto più di 4 mm (un dito veloce, eventi radi),
     la strada in mezzo si percorre a velocità costante, a campioni fitti: il flusso non salta da un punto all'altro */
  Rivelatore.prototype.avanza = function (t, d, s, phi0) {
    const c = this.c, u = c.length ? c[c.length - 1] : null;
    let nuovi = [];
    if (u && t > u.t && Math.abs(d - u.d) > 0.004) {
      const n = Math.min(200, Math.ceil(Math.abs(d - u.d) / 0.004)), t0 = u.t, d0 = u.d;
      for (let i = 1; i < n; i++) { const di = d0 + (d - d0) * i / n; nuovi = nuovi.concat(this.campione(t0 + (t - t0) * i / n, di, flusso(di, s, phi0))); }
    }
    return nuovi.concat(this.campione(t, d, flusso(d, s, phi0)));
  };
  Rivelatore.prototype.luce = function (k) {
    const L = this.led[k]; if (!L.on) return 0;
    return Math.min(1, 0.45 + (Math.abs(this.e) - SOGLIA) / 3);
  };

  /* ---------------- livelli ----------------
     cal: posizione iniziale della calamita (m), bob: della bobina, s: verso della calamita (+1 nord a destra),
     muove: che cosa si trascina. ob: l'obiettivo. Le velocità che servono sono contate dalla prova dei livelli:
     con N = 800 e Φ₀ = 0,6 mWb il led si accende sopra circa 0,31 m/s all'imbocco della bobina. */
  const N0 = 800, PHI0 = 0.6;
  const LIVELLI = [
    { consegna: 'Trascina la calamita e accendi il <b>led rosso</b>.', cal: -0.10, s: 1, ob: { tipo: 'accendi', led: 'rosso' } },
    { consegna: 'Adesso accendi il <b>led giallo</b>.', cal: -0.10, s: 1, ob: { tipo: 'accendi', led: 'giallo' } },
    { consegna: 'La calamita è ferma dentro la bobina, e i led sono spenti. Accendi il <b>rosso</b>.', cal: 0, s: 1, ob: { tipo: 'accendi', led: 'rosso' } },
    { consegna: '<b>Tre lampi</b> del rosso, senza mai accendere il giallo.', cal: -0.10, s: 1, ob: { tipo: 'lampi', led: 'rosso', n: 3, vietato: 'giallo' } },
    { consegna: 'Calamita girata, col <b>sud</b> verso la bobina. Tre lampi del <b>rosso</b>, mai il giallo.', cal: -0.10, s: -1, ob: { tipo: 'lampi', led: 'rosso', n: 3, vietato: 'giallo' } },
    { consegna: 'La calamita è fissata al tavolo: trascina la <b>bobina</b>. Due lampi del <b>giallo</b>, mai il rosso.', cal: -0.02, bob: 0.09, s: 1, muove: 'bobina', ob: { tipo: 'lampi', led: 'giallo', n: 2, vietato: 'rosso' } },
    { consegna: 'Una dinamo: <b>12 lampi</b> in 6 secondi, rossi o gialli.', cal: -0.10, s: 1, ob: { tipo: 'dinamo', n: 12, t: 6 } }
  ];

  /* il giudice: aggiorna lo stato del livello con i lampi nuovi. st = { n, tempi } */
  function giudica(ob, st, nuovi, t) {
    let ev = null;
    for (let i = 0; i < nuovi.length; i++) {
      const k = nuovi[i];
      if (ob.tipo === 'accendi') { if (k === ob.led) return { vinto: true, led: k }; ev = { tipo: 'sbagliato', led: k }; }
      else if (ob.tipo === 'lampi') {
        if (k === ob.vietato) { st.n = 0; ev = { tipo: 'azzera', led: k }; }
        else { st.n++; if (st.n >= ob.n) return { vinto: true, led: k }; ev = { tipo: 'passo', led: k }; }
      } else if (ob.tipo === 'dinamo') {
        st.tempi.push(t); st.tempi = st.tempi.filter(x => x > t - ob.t);
        if (st.tempi.length >= ob.n) return { vinto: true, led: k };
        ev = { tipo: 'passo', led: k };
      }
    }
    return { vinto: false, ev };
  }

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    'Entrando, il flusso nella bobina cresce in fretta: la f.e.m. supera 1,8\u00a0V in valore assoluto e il led si accende.',
    'Uscendo il flusso cala, e la corrente gira nell\'altro verso: è la legge di Lenz.',
    'Dal centro il flusso può solo calare: per il rosso bisogna uscire e poi rientrare in fretta.',
    'Dentro in fretta, fuori piano: conta quanto rapidamente cambia il flusso, non solo se cambia.',
    'Col sud davanti il flusso ha il verso opposto: entrata e uscita si scambiano i led.',
    'Conta il moto relativo: muovere la bobina o la calamita fa lo stesso.',
    'Rosso, giallo, rosso: la corrente cambia verso fra entrata e uscita. Una dinamo fa corrente alternata.'
  ];

  const AIUTO = 'Trascina la calamita dentro e fuori dalla bobina (si può prendere in un punto qualunque della scena; da tastiera con le frecce, più veloce con Maiusc). '
    + 'La bobina ha N spire, è lunga 8\u00a0cm e ha raggio 2\u00a0cm. Il flusso Φ in ogni spira dipende da dove sta la calamita: è massimo con la calamita al centro e quasi zero quando è lontana. '
    + 'La f.e.m. è ℰ = −N·ΔΦ/Δt, con ΔΦ misurato negli ultimi 0,05\u00a0s. I due led sono montati al contrario: il rosso si accende quando ℰ è negativa, il giallo quando è positiva, e tutti e due solo oltre 1,8\u00a0V in valore assoluto. '
    + 'Sotto la soglia il led non conduce: la f.e.m. c\'è, la corrente no. Quando passa corrente (viola), la bobina crea il suo campo, B<sub>ind</sub>, il campo indotto (verde tratteggiato). '
    + 'Un lampo conta se il led resta acceso almeno 0,02\u00a0s. In alto i grafici degli ultimi 4\u00a0s: Φ in verde, ℰ in arancio, le soglie tratteggiate. '
    + 'Il modello: la calamita è un piccolo dipolo sull\'asse; in una spira a distanza z il suo flusso è Φ₀·(1 + z²/a²)^(−3/2), con Φ₀ = 0,6 mWb e a il raggio, e Φ è la media sulle spire.';
  const AIUTI = {
    2: ' Il flusso è massimo con la calamita al centro della bobina.',
    3: ' Quale led si accende dipende da come cambia il flusso; quanto forte, da quanto in fretta.',
    4: ' Ora verso la bobina c\'è il sud: il campo della calamita nella bobina punta dall\'altra parte.',
    5: ' Si trascina la bobina, e i fili la seguono. Conta il moto della bobina rispetto alla calamita.',
    6: ' Valgono i lampi degli ultimi 6 secondi: uno più vecchio non conta più.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da accendere per forza. Scegli il numero di spire N e la calamita (Φ₀ è il flusso in una spira con la calamita al suo centro), girala o trascina la bobina invece della calamita, e guarda i grafici. ' + AIUTO;

  /* ---------------- numeri ---------------- */
  function num(v, d) { const r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); return (r === 0 ? 0 : r).toFixed(d).replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { const r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); return (r === 0 ? 0 : r).toFixed(d).replace('.', '{,}'); }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  /* testo con pedice vero: parti = [['B'], ['ind', 'sub']] */
  function testoRicco(attr, parti) {
    const t = el('text', attr);
    parti.forEach(p => {
      if (p[1] === 'sub') t.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 0.75em' }, p[0]));
      else t.appendChild(el('tspan', {}, p[0]));
    });
    return t;
  }

  QUANTO.registraLab({
    id: 'dinamo',
    fisica: { flusso, Rivelatore, giudica, LIVELLI, N0, PHI0, SOGLIA, PISTA_C, PISTA_B },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-dinamo')) { const s = document.createElement('style'); s.id = 'stile-lab-dinamo'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-dinamo');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, spire e calamita le scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri" hidden>
              <div class="lab-param" data-p="N"><span class="nome">${ctx.tex('N')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno spire">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più spire">+</button></div>
              <div class="lab-param" data-p="f"><span class="nome">${ctx.tex('\\Phi_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="calamita più debole">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="calamita più forte">+</button></div>
              <button type="button" class="btn piccolo b-gira">Gira la calamita</button>
              <button type="button" class="btn piccolo b-muovi" aria-pressed="false">Muovi la bobina</button>
            </div>
            <div class="formula"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { ric: q('.b-ric'), aiuto: q('.b-aiuto'), libero: q('.lab-libero'), gira: q('.b-gira'), muovi: q('.b-muovi') };
      const box = { N: q('[data-p="N"]'), f: q('[data-p="f"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, xc = 0, xb = 0, verso = 1, N = N0, phi0 = PHI0, muove = 'calamita';
      let finito = false, st = { n: 0, tempi: [] }, detti = {}, dettiSempre = {};
      let libero = false, salvato = null;
      let raf = 0, tPrec = 0, ultimoMoto = -99, mossoQui = false, picco = 0, piccoSegno = 0, lampoNelGesto = false, ultimaFormula = 0;
      let presa = null, tasto = null, fase = 0;
      const riv = new Rivelatore(N0);
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? null : LIVELLI[livello];
      const ora = () => performance.now() / 1000;

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', tabindex: '0', 'aria-label': 'Una calamita a sbarra e una bobina collegata a due led; in alto i grafici del flusso e della forza elettromotrice', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gGrafico = el('g'), gTracce = el('g'), gLinee = el('g'), gFili = el('g'), gBasetta = el('g'), gLed = el('g');
      const gBobDietro = el('g'), gCalamita = el('g'), gBobFronte = el('g'), gFrecce = el('g');
      [gGrafico, gTracce, gLinee, gFili, gBasetta, gLed, gBobDietro, gCalamita, gBobFronte, gFrecce].forEach(g => svg.appendChild(g));

      /* geometria in pixel veri: il banco (in metri) ha U pixel per metro, centrato in cx; l'asse della bobina è a quota yAx */
      let S = { w: 0, h: 0, U: 1000, cx: 0, yAx: 0, r: 20 };
      const PX = x => S.cx + x * S.U;
      function geometria() {
        const rc = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(rc.width)), h = Math.max(260, Math.round(rc.height));
        const pad = 10;
        const hs = morsa(h * 0.13, 44, 120);
        const gr = { x0: pad, x1: w - pad, yP0: 8, yP1: 8 + hs, yE0: 14 + hs, yE1: 14 + 2 * hs };
        const hb = morsa(h * 0.16, 62, 96), wb = morsa(w * 0.42, 160, 240);
        const by0 = gr.yE1 + morsa(h * 0.03, 8, 24);
        const bs = { x0: w / 2 - wb / 2, x1: w / 2 + wb / 2, y0: by0, y1: by0 + hb, yR: by0 + hb * 0.3, yG: by0 + hb * 0.72, ym: by0 + hb * 0.51, rl: morsa(hb * 0.14, 9, 13) };
        const b0 = bs.y1 + 8, b1 = h - 6;
        const U = Math.min(2800, (w - 2 * pad) / (2 * XW), (b1 - b0) / 0.105);
        S = { w, h, U, cx: w / 2, yAx: b0 + (b1 - b0) * 0.55, r: A * U, gr, bs, b0, b1 };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      /* ---------- disegno fisso: cornici dei grafici, basetta dei led, scala ---------- */
      const E_MAX = 4;   /* V: fondo scala del grafico di ℰ (oltre si taglia) */
      const phiMax = () => flusso(0, 1, phi0) * 1.12;
      const yPhi = v => { const g = S.gr, lo = verso > 0 ? 0 : -phiMax(), hi = verso > 0 ? phiMax() : 0; return g.yP1 - (morsa(v, lo, hi) - lo) / (hi - lo) * (g.yP1 - g.yP0); };
      const yE = v => { const g = S.gr; return (g.yE0 + g.yE1) / 2 - morsa(v, -E_MAX, E_MAX) / E_MAX * (g.yE1 - g.yE0) / 2; };
      const piccolo = (x, y, testo, attr) => el('text', Object.assign({ x, y, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, attr || {}), testo);
      function disegnaFisso() {
        vuota(gGrafico); vuota(gBasetta);
        const g = S.gr;
        [[g.yP0, g.yP1], [g.yE0, g.yE1]].forEach(([y0, y1]) => gGrafico.appendChild(el('rect', { x: g.x0, y: y0, width: g.x1 - g.x0, height: y1 - y0, rx: 6, fill: 'var(--sup)', stroke: 'var(--bordo)', opacity: .9 })));
        for (let s = 1; s < STORIA; s++) {   /* una tacca al secondo */
          const x = g.x1 - s / STORIA * (g.x1 - g.x0);
          [[g.yP0, g.yP1], [g.yE0, g.yE1]].forEach(([y0, y1]) => gGrafico.appendChild(el('line', { x1: x, y1: y0 + 1, x2: x, y2: y1 - 1, stroke: 'var(--bordo)', 'stroke-width': 1 })));
        }
        gGrafico.appendChild(el('line', { x1: g.x0, y1: yPhi(0), x2: g.x1, y2: yPhi(0), stroke: 'var(--testo3)', 'stroke-width': 1 }));
        gGrafico.appendChild(el('line', { x1: g.x0, y1: yE(0), x2: g.x1, y2: yE(0), stroke: 'var(--testo3)', 'stroke-width': 1 }));
        /* le soglie dei led, ciascuna col colore del suo led */
        [['rosso', -SOGLIA], ['giallo', SOGLIA]].forEach(([k, v]) => {
          gGrafico.appendChild(el('line', { x1: g.x0, y1: yE(v), x2: g.x1, y2: yE(v), stroke: LUCE[k], 'stroke-width': 1.6, 'stroke-dasharray': '6 5', opacity: .95 }));
          gGrafico.appendChild(piccolo(g.x1 - 6, yE(v) + (v < 0 ? 14 : -5), (v < 0 ? '−' : '+') + '1,8\u00a0V', { 'text-anchor': 'end', fill: LUCE[k], style: 'font: 600 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3 }));
        });
        const et = (y, parti, col) => { const t = testoRicco({ x: g.x0 + 7, y, fill: col, style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3 }, parti); gGrafico.appendChild(t); };
        et(g.yP0 + 16, [['Φ (mWb)']], 'var(--s3)');
        et(g.yE0 + 16, [['ℰ (V)']], 'var(--s2)');
        gGrafico.appendChild(piccolo(g.x1 - 6, g.yP0 + 15, 'ultimi 4\u00a0s', { 'text-anchor': 'end', fill: 'var(--testo3)' }));
        /* la basetta: due rami fra i nodi A e B, rosso sopra (conduce da A a B), giallo sotto (da B ad A) */
        const s = S.bs;
        gBasetta.appendChild(el('rect', { x: s.x0 - 10, y: s.y0, width: s.x1 - s.x0 + 20, height: s.y1 - s.y0, rx: 10, fill: 'var(--sup)', stroke: 'var(--bordo)' }));
        const filo = { stroke: 'var(--testo2)', 'stroke-width': 2, fill: 'none' };
        gBasetta.appendChild(el('path', Object.assign({ d: `M${s.x0} ${s.yR} V${s.yG} M${s.x1} ${s.yR} V${s.yG} M${s.x0} ${s.yR} H${s.x1} M${s.x0} ${s.yG} H${s.x1}` }, filo)));
        const mx = (s.x0 + s.x1) / 2 - 10;
        [['rosso', s.yR, 1], ['giallo', s.yG, -1]].forEach(([k, y, dir]) => {
          /* il triangolo dice in che verso il led lascia passare la corrente */
          const xt = mx - s.rl - 14;
          gBasetta.appendChild(el('path', { d: `M${xt + 6 * dir} ${y} L${xt - 5 * dir} ${y - 6} L${xt - 5 * dir} ${y + 6} Z`, fill: 'var(--testo2)' }));
          gBasetta.appendChild(piccolo(mx + s.rl + 8, y + 4.5, k, { fill: 'var(--testo)', style: 'font: 600 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 5, 'stroke-linejoin': 'round' }));
        });
        gBasetta.appendChild(el('circle', { cx: s.x0, cy: s.ym, r: 3, fill: 'var(--testo2)' }));
        gBasetta.appendChild(el('circle', { cx: s.x1, cy: s.ym, r: 3, fill: 'var(--testo2)' }));
        /* la scala: un segmento di 5 cm in basso a sinistra */
        const l5 = 0.05 * S.U, ys = S.b1 - 8;
        gBasetta.appendChild(el('path', { d: `M12 ${ys - 4} V${ys} H${12 + l5} V${ys - 4}`, stroke: 'var(--testo3)', 'stroke-width': 1.5, fill: 'none' }));
        gBasetta.appendChild(piccolo(12 + l5 + 6, ys + 1, '5\u00a0cm', { fill: 'var(--testo3)' }));
      }

      /* ---------- disegno che si muove ---------- */
      const elLed = {};
      ['rosso', 'giallo'].forEach(k => {
        elLed[k] = { alone: el('circle', { fill: LUCE[k], opacity: 0 }), corpo: el('circle', { 'stroke-width': 2 }), riflesso: el('ellipse', { fill: '#fff', opacity: .55 }), corrente: el('path', { fill: 'none', stroke: 'var(--s4)', 'stroke-width': 3.2, 'stroke-dasharray': '7 9', 'stroke-linecap': 'round', opacity: 0 }) };
      });
      function disegnaLedFissi() {   /* ricrea gli elementi dei led quando cambia la geometria */
        vuota(gLed);
        const s = S.bs, mx = (s.x0 + s.x1) / 2 - 10;
        [['rosso', s.yR], ['giallo', s.yG]].forEach(([k, y]) => {
          const e = elLed[k];
          e.alone.setAttribute('cx', mx); e.alone.setAttribute('cy', y);
          e.corpo.setAttribute('cx', mx); e.corpo.setAttribute('cy', y); e.corpo.setAttribute('r', s.rl); e.corpo.setAttribute('stroke', LUCE[k]);
          e.riflesso.setAttribute('cx', mx - s.rl * 0.3); e.riflesso.setAttribute('cy', y - s.rl * 0.35); e.riflesso.setAttribute('rx', s.rl * 0.32); e.riflesso.setAttribute('ry', s.rl * 0.2);
          gLed.appendChild(e.corrente); gLed.appendChild(e.alone); gLed.appendChild(e.corpo); gLed.appendChild(e.riflesso);
        });
      }

      /* la bobina, disegnata attorno al suo centro e spostata con translate: dietro (archi posteriori e tubo) e davanti */
      const NSPIRE_DISEGNO = 12;
      let archiFronte = [], frecciaBob = null;
      function disegnaBobina() {
        vuota(gBobDietro); vuota(gBobFronte); archiFronte = [];
        const r = S.r, l = LC * S.U, p = l / NSPIRE_DISEGNO, rx = Math.max(3, r * 0.26);
        gBobDietro.appendChild(el('rect', { x: -l / 2, y: -r, width: l, height: 2 * r, fill: 'var(--testo2)', opacity: .08 }));
        for (let i = 0; i < NSPIRE_DISEGNO; i++) {
          const x = -l / 2 + (i + 0.5) * p;
          gBobDietro.appendChild(el('path', { d: `M${x} ${-r} A${rx} ${r} 0 0 0 ${x - p * 0.5} ${r}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.6, opacity: .55 }));
          const a = el('path', { d: `M${x - p * 0.5} ${r} A${rx} ${r} 0 0 0 ${x} ${-r}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2.6, 'stroke-linecap': 'round' });
          gBobFronte.appendChild(a); archiFronte.push(a);
        }
        frecciaBob = el('path', { fill: 'var(--s4)', opacity: 0 });
        gBobFronte.appendChild(frecciaBob);
        gBobFronte.appendChild(etSpire = piccolo(0, r + 17, '', { 'text-anchor': 'middle', fill: 'var(--testo2)' }));
      }
      let etSpire = null;

      /* la calamita: due metà coi colori fissi dei poli, e qualche linea del campo del dipolo (verde, tenue) */
      function disegnaCalamita() {
        vuota(gCalamita); vuota(gLinee);
        const L = MEZZA * S.U, h = Math.max(9, SPESSA * S.U), sN = verso > 0 ? 1 : -1;
        const linee = el('g', { fill: 'none', stroke: 'var(--s3)', 'stroke-width': 1.3, opacity: .38 });
        /* le linee non escono dalla scena: la più larga arriva al massimo fino al bordo sotto e alla basetta sopra */
        const kMax = Math.max(1.3 * L, Math.min(3.6 * L, S.h - S.yAx - 3, S.yAx - S.bs.y1 + 30));
        [0.42, 0.64, 1].forEach(f => {
          const K = Math.max(1.15 * L, f * kMax), th0 = Math.asin(Math.sqrt(Math.min(1, 0.95 * L / K)));
          [1, -1].forEach(su => {
            let d = '';
            for (let i = 0; i <= 40; i++) { const th = th0 + (Math.PI - 2 * th0) * i / 40, rr = K * Math.sin(th) * Math.sin(th); d += (i ? 'L' : 'M') + (rr * Math.cos(th)).toFixed(1) + ' ' + (-su * rr * Math.sin(th)).toFixed(1) + ' '; }
            linee.appendChild(el('path', { d }));
          });
        });
        gLinee.appendChild(linee);
        const polo = (x0, nome) => {
          gCalamita.appendChild(el('rect', { x: x0, y: -h, width: L, height: 2 * h, fill: nome === 'N' ? 'var(--polo-n)' : 'var(--polo-s)' }));
          gCalamita.appendChild(el('text', { x: x0 + L / 2, y: Math.min(h, 7) * 0.62 + 1, 'text-anchor': 'middle', fill: nome === 'N' ? 'var(--polo-s)' : 'var(--polo-n)', style: 'font: 700 ' + Math.round(morsa(h * 1.3, 11, 22)) + 'px var(--font)', 'dominant-baseline': 'middle' }, nome));
        };
        polo(sN > 0 ? 0 : -L, 'N'); polo(sN > 0 ? -L : 0, 'S');
        gCalamita.appendChild(el('rect', { x: -L, y: -h, width: 2 * L, height: 2 * h, rx: 2, fill: 'none', stroke: 'var(--polo-bordo)', 'stroke-width': 1.6 }));
      }

      /* frecce: Φ (verde, dentro la bobina sotto la calamita), B indotto (verde tratteggiato, sopra), v (azzurra) */
      function freccia(g, x1, y1, x2, y2, colore, sp, tratto) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 4) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        const a = { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' };
        if (tratto) a['stroke-dasharray'] = '5 4';
        g.appendChild(el('line', a));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }
      const alone = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };

      function disegnaVivo(t) {
        const XC = PX(xc), XB = PX(xb), r = S.r, l = LC * S.U, s = S.bs;
        gCalamita.setAttribute('transform', 'translate(' + XC.toFixed(1) + ',' + S.yAx.toFixed(1) + ')');
        gLinee.setAttribute('transform', 'translate(' + XC.toFixed(1) + ',' + S.yAx.toFixed(1) + ')');
        gBobDietro.setAttribute('transform', 'translate(' + XB.toFixed(1) + ',' + S.yAx.toFixed(1) + ')');
        gBobFronte.setAttribute('transform', 'translate(' + XB.toFixed(1) + ',' + S.yAx.toFixed(1) + ')');
        etSpire.textContent = N + ' spire';
        /* i fili dai capi della bobina ai nodi della basetta */
        const lx = XB - l / 2 + 2, rx = XB + l / 2 - 2, yb = S.yAx - r;
        const filoA = `M${lx.toFixed(1)} ${yb.toFixed(1)} C${lx.toFixed(1)} ${(yb - 40).toFixed(1)} ${(s.x0 - 40).toFixed(1)} ${s.ym.toFixed(1)} ${s.x0} ${s.ym.toFixed(1)}`;
        const filoB = `M${s.x1} ${s.ym.toFixed(1)} C${(s.x1 + 40).toFixed(1)} ${s.ym.toFixed(1)} ${rx.toFixed(1)} ${(yb - 40).toFixed(1)} ${rx.toFixed(1)} ${yb.toFixed(1)}`;
        vuota(gFili);
        gFili.appendChild(el('path', { d: filoA + ' ' + filoB, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2 }));
        /* i led e la corrente (viola): passa solo nel ramo del led acceso */
        const iR = riv.luce('rosso'), iG = riv.luce('giallo'), corrente = iR > 0 ? 1 : (iG > 0 ? -1 : 0);
        [['rosso', iR, s.yR], ['giallo', iG, s.yG]].forEach(([k, lu, y]) => {
          const e = elLed[k];
          e.corpo.setAttribute('fill', lu > 0 ? LUCE[k] : 'var(--sup2)');
          e.alone.setAttribute('r', s.rl * (1.6 + 1.6 * lu)); e.alone.setAttribute('opacity', (0.45 * lu).toFixed(2));
          e.riflesso.setAttribute('opacity', lu > 0 ? .7 : .35);
          if (lu > 0) {
            e.corrente.setAttribute('d', filoA + ` V${y.toFixed(1)} H${s.x1} V${s.ym.toFixed(1)} ` + filoB.replace(/^M[^C]*/, ''));
            e.corrente.setAttribute('stroke-dashoffset', (-(k === 'rosso' ? 1 : -1) * fase).toFixed(1));
            e.corrente.setAttribute('opacity', .9);
          } else e.corrente.setAttribute('opacity', 0);
        });
        /* la bobina porta corrente: spire davanti viola e una freccia sul davanti (in su col rosso, in giù col giallo) */
        archiFronte.forEach(a => a.setAttribute('stroke', corrente ? 'var(--s4)' : 'var(--testo2)'));
        if (corrente) {
          const xf = l * 0.04, y0 = corrente > 0 ? r * 0.45 : -r * 0.45, y1 = -y0;
          frecciaBob.setAttribute('d', `M${xf - 6} ${y1 + corrente * 9} L${xf} ${y1} L${xf + 6} ${y1 + corrente * 9} Z`);
          frecciaBob.setAttribute('opacity', 1);
        } else frecciaBob.setAttribute('opacity', 0);
        /* frecce */
        vuota(gFrecce);
        const phi = riv.phi, lPhi = phi / phiMax() * 1.12 * l * 0.9, yF = S.yAx + Math.max(SPESSA * S.U + 6, r * 0.62);
        if (Math.abs(lPhi) >= 6) {
          freccia(gFrecce, XB - lPhi / 2, yF, XB + lPhi / 2, yF, 'var(--s3)', 2.6);
          gFrecce.appendChild(el('text', Object.assign({ x: XB + lPhi / 2 + (lPhi > 0 ? 5 : -5), y: yF + 4.5, 'text-anchor': lPhi > 0 ? 'start' : 'end', fill: 'var(--s3)', style: 'font: 700 13px var(--font)' }, alone), 'Φ'));
        }
        if (corrente) {   /* Lenz: col flusso che cresce (rosso) il campo indotto punta contro, col flusso che cala va nello stesso verso */
          const dir = corrente > 0 ? -1 : 1, yI = S.yAx - Math.max(SPESSA * S.U + 6, r * 0.62), lI = l * 0.7;
          freccia(gFrecce, XB - dir * lI / 2, yI, XB + dir * lI / 2, yI, 'var(--s3)', 2.2, true);
          gFrecce.appendChild(testoRicco(Object.assign({ x: XB + dir * lI / 2, y: S.yAx - r - 6, 'text-anchor': 'middle', fill: 'var(--s3)', style: 'font: 700 13px var(--font)' }, alone), [['B'], ['ind', 'sub']]));
        }
        const v = muove === 'bobina' ? -riv.v : riv.v, xo = muove === 'bobina' ? XB : XC;
        if (Math.abs(v) > 0.02) {
          const yv = S.yAx - r - 26, lv = morsa(v * 110, -150, 150);
          freccia(gFrecce, xo, yv, xo + lv, yv, 'var(--s1)', 2.6);
          gFrecce.appendChild(testoRicco(Object.assign({ x: morsa(xo + lv / 2, 70, S.w - 70), y: yv - 8, 'text-anchor': 'middle', fill: 'var(--s1)', style: 'font: 600 13px var(--font)' }, alone), [['v = ' + num(Math.abs(v), 2) + '\u00a0m/s']]));
        }
        /* i grafici degli ultimi 4 s */
        vuota(gTracce);
        const g = S.gr, c = riv.c, sx = (g.x1 - g.x0) / STORIA;
        let dP = '', dE = '';
        for (let i = 0; i < c.length; i++) {
          if (c[i].t < t - STORIA) continue;
          const x = (g.x1 - (t - c[i].t) * sx).toFixed(1);
          dP += (dP ? 'L' : 'M') + x + ' ' + yPhi(c[i].phi).toFixed(1) + ' ';
          dE += (dE ? 'L' : 'M') + x + ' ' + yE(c[i].e).toFixed(1) + ' ';
        }
        if (dP) {
          gTracce.appendChild(el('path', { d: dP, fill: 'none', stroke: 'var(--s3)', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));
          gTracce.appendChild(el('path', { d: dE, fill: 'none', stroke: 'var(--s2)', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));
        }
      }

      function ridisegnaTutto() { geometria(); disegnaFisso(); disegnaLedFissi(); disegnaBobina(); disegnaCalamita(); disegnaVivo(ora()); }

      /* ---------------- il ponte con la teoria: ℰ = −N·ΔΦ/Δt con i numeri di adesso ---------------- */
      let tenuto = null;   /* i numeri dell'istante con la f.e.m. più grande degli ultimi 0,8 s: si leggono anche dopo un lampo */
      function tieni(t) {
        if (!tenuto || Math.abs(riv.e) >= Math.abs(tenuto.e) || t - tenuto.t > 0.8) tenuto = { t, phi: riv.phi, dphi: riv.dphi, dt: riv.dt, e: riv.e };
      }
      /* la formula ha un'altezza fissa: se un caso non ci sta, si rimpicciolisce invece di spingere il resto */
      function adattaFormula() {
        formulaEl.style.fontSize = '';
        const f0 = parseFloat(getComputedStyle(formulaEl).fontSize);
        let f = f0;
        while ((formulaEl.scrollHeight > formulaEl.clientHeight + 1 || formulaEl.scrollWidth > formulaEl.clientWidth + 1) && f > f0 * 0.7) { f *= 0.93; formulaEl.style.fontSize = f.toFixed(2) + 'px'; }
      }
      function aggiornaFormula() {
        const z = tenuto || { phi: riv.phi, dphi: riv.dphi, dt: riv.dt, e: riv.e }, dphi = z.dphi, e = z.e;
        const pezzi = [];
        pezzi.push('<span class="pezzo fi">' + ctx.tex('\\Phi \\approx ' + texNum(z.phi, 3) + '\\,\\text{mWb}') + '</span>');
        pezzi.push('<span class="pezzo simbolo">' + ctx.tex('\\mathcal{E} = -N \\cdot \\dfrac{\\Delta\\Phi}{\\Delta t}') + '</span>');
        const dp = texNum(dphi, 3), dpS = /^-/.test(dp) ? '(' + dp + ')' : dp;
        pezzi.push('<span class="pezzo">' + ctx.tex('\\mathcal{E} = -' + N + ' \\cdot \\dfrac{' + dpS + '\\,\\text{mWb}}{' + texNum(z.dt, 2) + '\\,\\text{s}}') + '</span>');
        pezzi.push('<span class="pezzo esito">' + ctx.tex('\\approx ' + texNum(e, 2) + '\\,\\text{V}') + '</span>');
        formulaEl.innerHTML = pezzi.join(''); adattaFormula();
      }

      /* ---------------- il tempo: un campione a ogni evento del dito e a ogni fotogramma ---------------- */
      function campiona(t) {
        const nuovi = riv.avanza(t, xc - xb, verso, phi0);
        tieni(t);
        if (Math.abs(riv.v) > 0.01) { ultimoMoto = t; mossoQui = true; }
        if (Math.abs(riv.e) > picco) { picco = Math.abs(riv.e); piccoSegno = riv.e; }
        if (nuovi.length) { lampoNelGesto = true; ultimaFormula = t; aggiornaFormula(); esamina(nuovi, t); }
      }
      function tick(adesso) {
        raf = 0;
        const t = adesso / 1000, dt = Math.min(0.05, Math.max(0, t - tPrec)); tPrec = t;
        if (tasto) impostaMobile(posMobile() + tasto * dt);
        campiona(t);
        fase += dt * (70 + 30 * Math.max(0, Math.abs(riv.e) - SOGLIA));
        disegnaVivo(t);
        if (t - ultimaFormula > 0.1) { ultimaFormula = t; aggiornaFormula(); }
        controllaGesto(t);
        if (!libero && livello === 6 && !finito) mostraProgresso(t);
        /* si dorme quando tutto è fermo da più di 4 s (i grafici sono piatti e la formula ferma) */
        if (presa || tasto || t - ultimoMoto < STORIA + 0.4 || riv.led.rosso.on || riv.led.giallo.on) raf = requestAnimationFrame(tick);
        else aggiornaFormula();
      }
      function sveglia() { if (!raf) { tPrec = ora(); raf = requestAnimationFrame(tick); } }

      const posMobile = () => muove === 'bobina' ? xb : xc;
      function impostaMobile(x) {
        if (muove === 'bobina') xb = morsa(x, -PISTA_B, PISTA_B); else xc = morsa(x, -PISTA_C, PISTA_C);
      }

      /* ---------------- il gioco ---------------- */
      function dici(chiave, testo, sempre) {
        const reg = sempre ? dettiSempre : detti;
        if (reg[chiave]) return; reg[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function esamina(nuovi, t) {
        if (libero || finito) return;
        const L = LIVELLI[livello], ob = L.ob, g = giudica(ob, st, nuovi, t);
        if (g.vinto) { vinci(); return; }
        const ev = g.ev; if (!ev) return;
        if (ev.tipo === 'passo') {
          ctx.mascotte('passo');
          if (ob.tipo === 'lampi') { msg.textContent = 'Lampi del ' + ob.led + ': ' + st.n + ' di ' + ob.n + '.'; msg.className = 'lab-messaggio ok'; }
        } else if (ev.tipo === 'azzera') {
          msg.textContent = 'Si è acceso il ' + ev.led + ': lampi azzerati.'; msg.className = 'lab-messaggio no';
          ctx.mascotte('sbagliato');
          if (livello === 3) dici('vietato', 'Il giallo vuol dire corrente al contrario: in quale parte del gesto il flusso cala?');
          else if (livello === 4) dici('vietato', 'Col sud davanti il campo nella bobina punta dall\'altra parte: che cosa cambia?');
          else if (livello === 5) dici('vietato', 'Conta il moto relativo: avvicinare la bobina è come spingere dentro la calamita.');
        } else if (ev.tipo === 'sbagliato') {
          msg.textContent = 'Si è acceso il ' + ev.led + ', non il ' + ob.led + '.'; msg.className = 'lab-messaggio no';
          ctx.mascotte('sbagliato');
          if (livello === 2) dici('verso', 'Dal centro, da qualunque parte la sposti, il flusso cala.');
          else dici('verso', 'Si è acceso l\'altro led: la corrente gira al contrario. Il flusso stava crescendo o calando?');
        }
      }
      function mostraProgresso(t) {
        const n = st.tempi.filter(x => x > t - 6).length, testo = 'Lampi negli ultimi 6\u00a0s: ' + n + ' di 12.';
        if (msg.textContent !== testo) { msg.textContent = testo; msg.className = 'lab-messaggio'; }
      }
      /* la fine di un gesto (fermo da 0,4 s): gli errori tipici, e in modalità libera il picco */
      function controllaGesto(t) {
        if (picco > 0 && t - ultimoMoto > 0.4) {
          if (libero) { msg.textContent = 'Picco del gesto: ℰ ≈ ' + num(piccoSegno, 1) + '\u00a0V.'; msg.className = 'lab-messaggio'; }
          else if (!finito && !lampoNelGesto && picco > 0.35 && picco < SOGLIA && LIVELLI[livello].ob.tipo !== 'lampi') {
            msg.textContent = 'Il picco è stato ' + num(piccoSegno, 1) + '\u00a0V: sotto la soglia di 1,8\u00a0V.'; msg.className = 'lab-messaggio no';
            dici('piano', 'Il flusso cambia, ma piano: per superare 1,8\u00a0V deve cambiare più in fretta.', true);
          }
          picco = 0; piccoSegno = 0; lampoNelGesto = false;
        }
        /* l'idea sbagliata più comune: basta che la calamita stia dentro */
        if (mossoQui && !finito && Math.abs(xc - xb) < LC / 2 && t - ultimoMoto > 1.5 && t - ultimoMoto < 1.6) {
          if (libero) { msg.textContent = 'Ferma: Φ ≈ ' + num(riv.phi, 3) + ' mWb, ma non cambia, e ℰ = 0.'; msg.className = 'lab-messaggio'; }
          else dici('ferma', 'Ferma dentro la bobina, il flusso è grande ma non cambia: niente corrente.', true);
        }
      }
      function vinci() {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + (livello === 6 ? '12 lampi in 6 secondi.' : 'Fatto!') + ' Picco: ℰ ≈ ' + num(piccoSegno || riv.e, 1) + '&nbsp;V.</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello], { espressione: 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
        b.ric.classList.add('primario');
      }

      /* ---------------- pannello ---------------- */
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
      function aggiornaParametri() {
        box.N.querySelector('output').textContent = N;
        box.f.querySelector('output').innerHTML = num(phi0, 1) + '&nbsp;<span class="unita">mWb</span>';
        box.N.querySelector('[data-d="-1"]').disabled = N <= 200; box.N.querySelector('[data-d="1"]').disabled = N >= 1600;
        box.f.querySelector('[data-d="-1"]').disabled = phi0 <= 0.2 + 1e-9; box.f.querySelector('[data-d="1"]').disabled = phi0 >= 1.2 - 1e-9;
        b.muovi.textContent = muove === 'bobina' ? 'Muovi la calamita' : 'Muovi la bobina';
        b.muovi.setAttribute('aria-pressed', muove === 'bobina');
      }
      function azzeraMoto() {
        riv.N = N; riv.reset(); tenuto = null; picco = 0; piccoSegno = 0; lampoNelGesto = false; mossoQui = false; ultimoMoto = -99; presa = null; tasto = null;
        riv.avanza(ora(), xc - xb, verso, phi0);
      }

      function avviaLivello(n) {
        libero = false; salvato = null; parametriEl.hidden = true;
        livello = n; const L = LIVELLI[n];
        xc = L.cal; xb = L.bob || 0; verso = L.s; muove = L.muove || 'calamita'; N = N0; phi0 = PHI0;
        finito = false; st = { n: 0, tempi: [] }; detti = {};
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia'; b.ric.classList.remove('primario');
        azzeraMoto(); ridisegnaTutto(); aggiornaFormula(); aggiornaLivelli();
      }

      /* ---------------- modalità libera ---------------- */
      function entraLibero() {
        salvato = { livello, xc, xb, finito, st, detti, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent, prim: b.ric.classList.contains('primario') };
        libero = true; aiutoEl.hidden = true; parametriEl.hidden = false;
        xc = -0.10; xb = 0; verso = 1; muove = 'calamita'; N = N0; phi0 = PHI0; finito = false;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia'; b.ric.classList.remove('primario');
        azzeraMoto(); aggiornaParametri(); ridisegnaTutto(); aggiornaFormula(); aggiornaLivelli();
      }
      function esciLibero() {
        const z = salvato, L = LIVELLI[z.livello];
        libero = false; salvato = null; parametriEl.hidden = true; aiutoEl.hidden = true;
        livello = z.livello; xc = z.xc; xb = z.xb; verso = L.s; muove = L.muove || 'calamita'; N = N0; phi0 = PHI0;
        finito = z.finito; st = z.st; detti = z.detti;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.ric.classList.toggle('primario', z.prim);
        azzeraMoto(); ridisegnaTutto(); aggiornaFormula(); aggiornaLivelli();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function cambiaParametro(k, d) {
        if (k === 'N') N = morsa(N + 200 * d, 200, 1600);
        else phi0 = morsa(Math.round((phi0 + 0.2 * d) * 10) / 10, 0.2, 1.2);
        azzeraMoto(); aggiornaParametri(); ridisegnaTutto(); aggiornaFormula();
        msg.textContent = ''; msg.className = 'lab-messaggio';
      }

      /* ---------------- comandi ---------------- */
      function punto(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        return pt.matrixTransform(m.inverse());
      }
      /* si prende il pezzo mobile da un punto qualunque della scena: si sposta quanto il dito, senza salti */
      svg.addEventListener('pointerdown', ev => {
        const c = punto(ev); if (!c) return;
        aiutoEl.hidden = true;
        presa = { off: c.x - PX(posMobile()) };
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        ev.preventDefault(); sveglia();
      });
      const muovi = ev => {
        if (!presa) return;
        const c = punto(ev); if (!c) return;
        impostaMobile((c.x - presa.off - S.cx) / S.U);
        campiona(ora()); sveglia(); ev.preventDefault();
      };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);
      /* da tastiera: frecce a 0,12 m/s, con Maiusc a 0,6 m/s */
      svg.addEventListener('keydown', ev => {
        if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
        tasto = (ev.key === 'ArrowLeft' ? -1 : 1) * (ev.shiftKey ? 0.6 : 0.12);
        ev.preventDefault(); sveglia();
      });
      svg.addEventListener('keyup', ev => { if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') tasto = null; });
      svg.addEventListener('blur', () => { tasto = null; });

      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        cambiaParametro(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });
      b.gira.addEventListener('click', () => { verso = -verso; azzeraMoto(); ridisegnaTutto(); aggiornaFormula(); msg.textContent = ''; });
      b.muovi.addEventListener('click', () => { muove = muove === 'bobina' ? 'calamita' : 'bobina'; aggiornaParametri(); msg.textContent = ''; msg.className = 'lab-messaggio'; });
      b.ric.addEventListener('click', () => {
        if (libero) { xc = -0.10; xb = 0; azzeraMoto(); ridisegnaTutto(); aggiornaFormula(); msg.textContent = ''; return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').innerHTML = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');   /* testi fissi del file, con i pedici veri */
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
        cancelAnimationFrame(raf); ro.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
