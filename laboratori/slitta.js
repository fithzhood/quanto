/* Laboratorio «La slitta» — i principi della dinamica (argomento dinamica).
   Una slitta sul ghiaccio, senza attrito. Sotto la pista c'è il programma delle spinte: una casella per ogni
   secondo, con la forza F (in su avanti, in giù indietro, a passi di 10 N). Con «Via» la slitta segue la legge
   vera: in ogni secondo a = R / m, e dove R = 0 la velocità non cambia (inerzia). Finite le spinte nessuna forza
   la frena: se va ancora, va per sempre. Si vince se si ferma sul traguardo.
   Nessuna anteprima del moto: il grafico della velocità si disegna solo durante la corsa.
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-slitta .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-slitta .lab-scena > svg { width: 100%; height: 100%; }
    .lab-slitta svg text { font-family: var(--font); }
    .lab-slitta svg text, .lab-slitta svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-slitta .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-slitta .consegna > span { display: block; }
    .lab-slitta .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-slitta .consegna:empty { display: none; }
    .lab-slitta .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; height: calc(4.4 * clamp(1rem, 2.5cqmin, 1.2rem)); flex: none; }
    .lab-slitta .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-slitta .formula .ignoto { color: var(--testo3); }
    .lab-slitta .formula .esito { color: var(--s4); font-weight: 600; }
    .lab-slitta .lab-messaggio { padding: 0 4px; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-slitta .formula { height: calc(6.4 * clamp(1rem, 2.5cqmin, 1.2rem)); } .lab-slitta .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-slitta .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-slitta .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-slitta .btn[disabled] { opacity: .38; cursor: default; }
    .lab-slitta .lab-parametri { max-width: 520px; }
    .lab-slitta .lab-parametri { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .lab-slitta .lab-param .nome { min-width: 1.4em; }
    .lab-slitta .lab-param output { min-width: 0; width: 5.3ch; flex: none; white-space: nowrap; }
    .lab-slitta .lab-param[data-p="m"] output { width: 4.9ch; }
    .lab-slitta .lab-param[data-p="v0"] output { width: 6.2ch; }
    .lab-slitta .lab-param[data-p="mu"] output { width: 3.7ch; }
    .lab-slitta .lab-param output .u { font-size: .78em; font-weight: 400; margin-left: .15em; color: var(--testo2); }
    .lab-slitta .lab-param[data-p="k"] output { width: 8.3ch; white-space: nowrap; }
    @container lab (max-width: 420px) { .lab-slitta .lab-parametri { column-gap: 4px; } .lab-slitta .lab-param { gap: 2px; } .lab-slitta .lab-param .btn { min-width: 34px; padding: 0 4px; } .lab-slitta .lab-param .nome { min-width: 0; } .lab-slitta .lab-param output { font-size: .94em; } .lab-slitta .lab-param output .u { font-size: .83em; } }
    .lab-slitta .lab-param[hidden] { display: none; }
    .lab-slitta .lab-parametri .b-casuale { justify-self: center; }
    .lab-slitta .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-slitta .conta { position: absolute; right: 10px; top: 6px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-slitta .vinto { display: inline-block; animation: lab-slitta-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-slitta-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-slitta .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-slitta .formula .simbolo { display: none; } .lab-slitta .formula .nome-stretto { display: inline; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 3 nel Libero, dove la consegna non c'è) */
    .lab-slitta .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(3 * var(--riga) + 2 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-slitta .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-slitta .lab-lato .consegna:empty { display: none; }
    .lab-slitta .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-slitta .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const G = 9.8, TAU = 1, DT = 0.005, TOL = 0.5, PASSO_F = 10;
  const MU_S = 1.5;                    /* attrito statico = 1,5 volte quello dinamico (sulla neve) */
  const MASSE_IGNOTE = [20, 25, 40, 50];

  /* coefficiente d'attrito dinamico nel punto s: sul ghiaccio zero, sulla neve quello del livello */
  function muIn(L, s) { if (L.neve) return s >= L.neve.da ? L.neve.mu : 0; return L.mu || 0; }

  /* il moto intero, a passi di 5 ms con accelerazione costante in ogni passo (esatto sul ghiaccio);
     quando la velocità passa per zero il passo si spezza lì e si ricontrolla l'attrito statico */
  function simula(L, piano) {
    const m = L.m, N = piano.length, TP = N * TAU, T_MAX = TP + 40;
    let s = L.s0 || 0, v = L.v0 || 0, t = 0, giri = 0, fine = null;
    const camp = [{ t: 0, s: s, v: v, F: N ? piano[0] : 0, Fd: 0 }], vBordi = [v];
    while (t < T_MAX - 1e-9 && giri++ < 100000) {
      const k = Math.floor(t / TAU + 1e-9), F = k < N ? piano[k] : 0;
      const tLim = k < N ? (k + 1) * TAU : T_MAX;
      let h = Math.min(DT, tLim - t);
      const mu = muIn(L, s), Fd = mu * m * G, Fs = MU_S * Fd;
      let a, attr;
      if (v === 0) {
        if (Math.abs(F) <= Fs + 1e-9) { a = 0; attr = -F; }            /* l'attrito statico la tiene ferma */
        else { attr = -Math.sign(F) * Fd; a = (F + attr) / m; }
      } else { attr = -Math.sign(v) * Fd; a = (F + attr) / m; }
      let zero = false;
      if (v !== 0 && a !== 0 && (a > 0) !== (v > 0)) { const tz = -v / a; if (tz <= h) { h = tz; zero = true; } }
      s += v * h + a * h * h / 2;
      v = zero ? 0 : v + a * h;
      t += h;
      if (Math.abs(t - Math.round(t / TAU) * TAU) < 1e-9) { t = Math.round(t / TAU) * TAU; if (Math.abs(v) < 1e-7) v = 0; }
      camp.push({ t: t, s: s, v: v, F: F, Fd: attr });
      if (k < N && Math.abs(t - (k + 1) * TAU) < 1e-9) vBordi.push(v);
      if (t >= TP - 1e-9) {
        if (v === 0) { fine = { t: t, s: s, v: 0, fermo: true }; break; }
        if (!frenoAvanti(L, s, v)) { fine = { t: t, s: s, v: v, fermo: false, scappa: true }; break; }
      }
    }
    if (!fine) fine = { t: t, s: s, v: v, fermo: v === 0 };
    return { camp: camp, vBordi: vBordi, fine: fine, TP: TP, m: m };
  }
  /* finite le spinte, c'è ancora qualcosa che può fermarla? (la neve davanti, o attrito dappertutto) */
  function frenoAvanti(L, s, v) {
    if (L.neve) return v > 0 || s >= L.neve.da;
    return (L.mu || 0) > 0;
  }
  /* dove sta la slitta all'istante t (per l'animazione: interpolazione fra i campioni) */
  function statoA(sim, t) {
    const c = sim.camp;
    if (t <= 0) return c[0];
    let lo = 0, hi = c.length - 1;
    if (t >= c[hi].t) return c[hi];
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (c[mid].t <= t) lo = mid; else hi = mid; }
    const A = c[lo], B = c[hi], u = (t - A.t) / Math.max(1e-9, B.t - A.t);
    return { t: t, s: A.s + (B.s - A.s) * u, v: A.v + (B.v - A.v) * u, F: B.F, Fd: B.Fd };
  }

  /* il verdetto di una corsa in un livello: { ok, testo } (il testo dice solo che cosa è successo) */
  function verdetto(L, sim) {
    const f = sim.fine;
    if (!f.fermo) return { ok: false, testo: 'Finite le spinte va ancora a ' + num(Math.abs(f.v), 2) + '\u00a0m/s' + (f.v < 0 ? ' all\'indietro' : '') + ': non si ferma più.' };
    const d = f.s - L.traguardo;
    if (Math.abs(d) <= TOL + 1e-9) return { ok: true, testo: 'Ferma sul traguardo, a ' + num(f.s, 2) + '\u00a0m.' };
    const passato = (L.traguardo >= (L.s0 || 0)) ? d > 0 : d < 0;
    return { ok: false, testo: 'Ferma a ' + num(f.s, 2) + '\u00a0m: ' + (passato ? 'oltre' : 'corta') + ' di ' + num(Math.abs(d), 2) + '\u00a0m.' };
  }

  /* ---------------- livelli ----------------
     m in kg, v0 in m/s, traguardo in m, N secondi di programma, Fmax in N, vista = tratto di pista visibile.
     Le soluzioni sono contate con la prova dei livelli (lab-slitta-livelli.js). */
  const LIVELLI = [
    { consegna: 'La slitta arriva a <b>2&nbsp;m/s</b>. Fermala sul traguardo, a <b>4&nbsp;m</b>.',
      m: 20, v0: 2, traguardo: 4, N: 4, Fmax: 40, vista: [-1, 9], vMax: 3 },
    { consegna: 'La slitta è ferma. Portala sul traguardo a <b>6&nbsp;m</b> e lasciala lì, ferma.',
      m: 20, v0: 0, traguardo: 6, N: 6, Fmax: 40, vista: [-1, 10], vMax: 3 },
    { consegna: 'Sulla slitta c\'è una cassa: in tutto <b>40&nbsp;kg</b>. Il programma è quello che bastava con 20\u00a0kg. Correggilo.',
      m: 40, cassa: 20, v0: 0, traguardo: 6, N: 6, Fmax: 60, vista: [-1, 10], vMax: 3, piano: [20, 20, 0, -20, -20, 0] },
    { consegna: 'Al massimo <b>20&nbsp;N</b>. Porta la slitta sul traguardo, lontano, a <b>12&nbsp;m</b>, e fermala lì.',
      m: 20, v0: 0, traguardo: 12, N: 8, Fmax: 20, vista: [-1, 15], vMax: 3 },
    { consegna: 'La slitta va avanti a <b>2&nbsp;m/s</b>, ma il traguardo è <b>dietro</b>, a −3\u00a0m. Fermala lì.',
      m: 20, v0: 2, traguardo: -3, N: 6, Fmax: 40, vista: [-6, 4], vMax: 3 },
    { consegna: 'Da 6&nbsp;m in poi c\'è la neve (μ<sub>d</sub> = 0,1). Fermala sul traguardo a <b>9&nbsp;m</b>.',
      m: 20, v0: 0, traguardo: 9, N: 4, Fmax: 40, vista: [-1, 12], vMax: 3, neve: { da: 6, mu: 0.1 } },
    { consegna: 'Cassa di massa ignota. Hai <b>due corse</b>: misura la massa, poi fermala a <b>8&nbsp;m</b>.',
      m: 0, ignota: true, v0: 0, traguardo: 8, N: 8, Fmax: 50, vista: [-1, 12], vMax: 3 }
  ];
  const LIBERO = { m: 20, v0: 0, mu: 0, N: 8, Fmax: 100, libero: true };

  const VITTORIE = [
    () => 'Per fermarla serve una forza contro il moto: la spinta indietro le ha tolto velocità.',
    () => 'Spinte avanti e indietro uguali: la velocità torna zero. Senza spinta andava a velocità costante.',
    () => 'Massa doppia, accelerazione metà: per gli stessi cambi di velocità serve una forza doppia.',
    () => 'Nei secondi senza spinta la slitta non ha rallentato: è l\'inerzia. La forza serve a farla partire e a fermarla.',
    () => 'Andava avanti ma accelerava indietro: l\'accelerazione segue la forza, non la velocità.',
    () => 'L\'ha fermata l\'attrito della neve: F<sub>d</sub> = μ<sub>d</sub>·m·g è una forza vera, e punta contro il moto.',
    m => 'Erano ' + m + '\u00a0kg: la massa si misura anche così, con la forza e l\'accelerazione che produce.'
  ];

  const AIUTO = 'Sotto la pista c\'è il programma delle spinte: una casella per ogni secondo. Tocca o trascina in una casella per scegliere la forza F (la barra arancio): in su spinge avanti, in giù indietro, a passi di 10\u00a0N; con − e + regoli la casella scelta. «dopo» è il tempo che viene dopo il programma: lì nessuno spinge. Poi «Via»: in ogni secondo la slitta accelera con a = F / m, e nella riga sotto si disegna la sua velocità v. Sul ghiaccio non c\'è attrito. Vale se la slitta si ferma con la tacca (il suo centro) a meno di 50\u00a0cm dal traguardo.';
  const AIUTI = {
    2: ' La cassa raddoppia la massa: con la stessa forza l\'accelerazione è metà.',
    3: ' Con 20\u00a0N su 20\u00a0kg la velocità cambia di 1\u00a0m/s ogni secondo. Nei secondi a zero la slitta va avanti a velocità costante.',
    4: ' Prima va fermata, poi riportata indietro, poi fermata di nuovo: la forza indietro deve agire più a lungo di quella avanti.',
    5: ' Sulla neve l\'attrito dinamico vale F<sub>d</sub> = μ<sub>d</sub>·m·g e punta contro il moto. Da fermo la neve la tiene finché la spinta non supera 1,5·F<sub>d</sub>.',
    6: ' La massa della cassa non la conosci. Fai una corsa di prova e leggi dal grafico di quanto cambia v in un secondo: allora m = F / a. Dopo due corse sbagliate arriva un\'altra cassa.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è traguardo. Scegli la massa m, la velocità iniziale v₀, l\'attrito μ<sub>d</sub> (zero è il ghiaccio) e il programma delle spinte, poi «Via». Con l\'attrito la formula diventa a = (F − F<sub>d</sub>) / m, con F<sub>d</sub> = μ<sub>d</sub>·m·g contro il moto. Il grafico della corsa precedente resta tratteggiato, per confrontare. «Casuale» propone un programma a caso, «Ricomincia» lo cancella.';

  /* ---------------- numeri ---------------- */
  /* decimali fissi: gli zeri finali restano (0,50, mai 0,5) e il «meno zero» diventa zero */
  function num(v, d) {
    let s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    if (/^-0(\.0+)?$/.test(s)) s = s.slice(1);
    return s.replace('.', ',').replace('-', '−');
  }
  /* quanti decimali servono a scrivere esatto x (al più max): per l'accelerazione F/m con F a passi di 10 N */
  function decimali(x, max) { for (let d = 0; d < max; d++) if (Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-9) return d; return max; }
  function texNum(v, d) { return num(v, d).replace(',', '{,}').replace('−', '-'); }
  const segno = F => F > 0 ? '+' + F : (F < 0 ? '−' + (-F) : '0');

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const ALONE = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' };
  const conAlone = a => Object.assign({}, ALONE, a);

  QUANTO.registraLab({
    id: 'slitta',
    fisica: { simula, verdetto, LIVELLI, MASSE_IGNOTE, TOL },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-slitta')) { const st = document.createElement('style'); st.id = 'stile-lab-slitta'; st.textContent = STILE; document.head.appendChild(st); }
      radice.classList.add('lab-slitta');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun traguardo, massa, velocità iniziale e attrito li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="F"><span class="nome"></span><button type="button" class="btn piccolo" data-d="-1" aria-label="forza più indietro">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="forza più avanti">+</button></div>
              <div class="lab-param" data-p="k"><button type="button" class="btn piccolo" data-d="-1" aria-label="secondo prima">‹</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="secondo dopo">›</button></div>
              <div class="lab-param" data-p="m" hidden><span class="nome">${ctx.tex('m')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="massa minore">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="massa maggiore">+</button></div>
              <div class="lab-param" data-p="v0" hidden><span class="nome">${ctx.tex('v_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="velocità iniziale minore">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="velocità iniziale maggiore">+</button></div>
              <div class="lab-param" data-p="mu" hidden><span class="nome">${ctx.tex('\\mu_d')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno attrito">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più attrito">+</button></div>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">▶ Via</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { F: q('[data-p="F"]'), k: q('[data-p="k"]'), m: q('[data-p="m"]'), v0: q('[data-p="v0"]'), mu: q('[data-p="mu"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, piano = [], sel = 0, corse = 0, finito = false, animando = false, raf = 0;
      let ultima = null, prima = null;           /* la corsa appena fatta e quella prima (grafico tratteggiato) */
      let pianoCorsa = null;                     /* il programma con cui è stata fatta l'ultima corsa */
      let detti = {}, massaIgnota = 0, corseCassa = 0;
      let libero = false, salvato = null, Lib = Object.assign({}, LIBERO);
      let tCursore = -1, statoVisto = null;      /* durante l'animazione: istante e stato mostrati */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      /* il livello corrente, con la massa vera (al livello 7 è quella della cassa estratta) */
      const liv = () => {
        if (libero) return Lib;
        const L = LIVELLI[livello];
        return L.ignota ? Object.assign({}, L, { m: massaIgnota }) : L;
      };

      /* ---------------- scena: SVG in pixel veri, ridisegnato quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Una slitta su una pista di ghiaccio con il traguardo; sotto, il programma delle spinte secondo per secondo e il grafico della velocità', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gPista = el('g'), gSlitta = el('g'), gCorsie = el('g'), gBarre = el('g'), gVel = el('g'), gCursore = el('g');
      [gPista, gSlitta, gCorsie, gBarre, gVel, gCursore].forEach(g => svg.appendChild(g));
      const orologio = el('text', conAlone({ x: 10, y: 18, fill: 'var(--testo2)', style: 'font: 600 14px var(--font)' }));
      svg.appendChild(orologio);

      /* geometria. Pista: U px per metro, sx0 = pixel di s = vista[0], yG = quota del ghiaccio.
         Corsie: colonne larghe cw a partire da x0c (N secondi + «dopo»); corsia F centrata in yF0 (fpx px per N),
         corsia v centrata in yV0 (vpx px per m/s). */
      let S = { w: 0, h: 0 };
      function vista() {
        const L = liv();
        if (!libero) return L.vista;
        /* in modalità libera la pista si allarga per contenere le corse fatte */
        let a = -1, z = 10;
        [ultima, prima].forEach(c => { if (!c) return; c.camp.forEach(p => { a = Math.min(a, p.s - 1); z = Math.max(z, p.s + 1); }); });
        a = Math.max(a, -40); z = Math.min(z, 80);
        return [Math.floor(a), Math.ceil(z)];
      }
      function vScala() {
        const L = liv();
        let vm = Math.max(L.vMax || 2, Math.abs(L.v0 || 0));
        [ultima, prima].forEach(c => { if (c) c.camp.forEach(p => { vm = Math.max(vm, Math.abs(p.v)); }); });
        return [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50].find(x => x >= vm - 1e-9) || Math.ceil(vm);
      }
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(260, Math.round(r.width)), h = Math.max(260, Math.round(r.height));
        const L = liv(), V = vista(), N = L.N;
        const hP = Math.round(morsa(Math.min(h * 0.38, w * 0.32), 112, 300));         /* altezza della pista */
        const yG = hP - 30;                                         /* il ghiaccio (sotto c'è il righello) */
        const U = (w - 24) / (V[1] - V[0]);
        const x0c = 46, cw = (w - x0c - 10) / (N + 1);
        const top = hP + 6, basso = h - 22, alto = basso - top;
        const hF = Math.round(alto * 0.56), hV = alto - hF - 8;
        const yF0 = top + hF / 2, yV0 = top + hF + 8 + hV / 2;
        const fpx = (hF / 2 - 10) / L.Fmax, vS = vScala(), vpx = (hV / 2 - 8) / vS;
        S = { w, h, hP, yG, U, V, sc: morsa(U / 45, 1, 1.8), x0c, cw, N, top, hF, hV, yF0, yV0, fpx, vS, vpx, basso, K: morsa(w * 0.05, 18, 40) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const PX = s => 12 + (s - S.V[0]) * S.U;
      const CX = k => S.x0c + k * S.cw;                             /* bordo sinistro della colonna k (k = N: «dopo») */
      const TX = t => S.x0c + t / TAU * S.cw;                       /* istante t sull'asse dei tempi */
      const FY = F => S.yF0 - F * S.fpx;
      const VY = v => S.yV0 - v * S.vpx;

      /* --- la pista: ghiaccio, neve, righello, partenza, traguardo --- */
      function disegnaPista() {
        vuota(gPista);
        const L = liv(), yG = S.yG;
        /* sullo sfondo, montagne lontane: solo decorazione, sbiadite perché non distraggano */
        if (yG > 90) {
          const hm = (yG - 30) * 0.62, picchi = [0, .55, .2, .9, .45, .75, .3, 1, .5, .65, .25, .85];
          let d = 'M0 ' + yG;
          for (let i = 0; i < picchi.length; i++) d += ' L' + (i * S.w / (picchi.length - 1)).toFixed(1) + ' ' + (yG - 8 - hm * (0.35 + 0.65 * picchi[i])).toFixed(1);
          d += ' L' + S.w + ' ' + yG + ' Z';
          gPista.appendChild(el('path', { d: d, fill: 'var(--testo3)', opacity: .12 }));
        }
        gPista.appendChild(el('rect', { x: 0, y: yG, width: S.w, height: 30, fill: 'var(--s1)', opacity: .13 }));
        gPista.appendChild(el('line', { x1: 0, y1: yG, x2: S.w, y2: yG, stroke: 'var(--s1)', 'stroke-width': 2, opacity: .55 }));
        const neve = L.neve ? L.neve : (libero && Lib.mu > 0 ? { da: S.V[0] - 5, mu: Lib.mu } : null);
        if (neve) {
          const x0 = Math.max(0, PX(neve.da));
          gPista.appendChild(el('rect', { x: x0, y: yG - 3, width: S.w - x0, height: 33, fill: 'var(--testo2)', opacity: .16 }));
          gPista.appendChild(el('path', { d: 'M' + x0 + ' ' + yG + ' ' + Array.from({ length: Math.floor((S.w - x0 - 2) / 12) }, () => 'q3 -4 6 0 t6 0').join(' '), fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4, opacity: .6 }));
          for (let x = x0 + 7; x < S.w; x += 13) gPista.appendChild(el('circle', { cx: x, cy: yG + 6 + ((x * 7) % 17), r: 1.6, fill: 'var(--testo2)', opacity: .45 }));
          const scritta = L.neve ? ['neve da ' + num(neve.da, 0) + '\u00a0m, μ', 'd', ' = ' + num(neve.mu, 2)] : ['μ', 'd', ' = ' + num(neve.mu, 2) + ': F', 'd', ' = μ', 'd', '·m·g = ' + num(neve.mu * Lib.m * G, 1) + '\u00a0N'];
          const tScritta = el('text', conAlone({ x: S.w - 8, y: Math.max(34, yG - 78), 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }));
          scritta.forEach((pz, i) => tScritta.appendChild(i % 2 ? el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 9.5px' }, pz) : document.createTextNode(pz)));   /* i pezzi dispari sono pedici */
          gPista.appendChild(tScritta);
        }
        /* righello: almeno 34 px fra due tacche */
        const passo = [1, 2, 5, 10, 20].find(p => p * S.U >= 34) || 20;
        for (let s = Math.ceil(S.V[0] / passo) * passo; s <= S.V[1]; s += passo) {
          const x = PX(s); if (x < 4 || x > S.w - 4) continue;
          gPista.appendChild(el('line', { x1: x, y1: yG + 22, x2: x, y2: yG + 30, stroke: 'var(--testo2)', 'stroke-width': 1.3 }));
          if (x < S.w - 22) gPista.appendChild(el('text', { x: x, y: yG + 20, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, s === 0 ? '0' : num(s, 0)));
        }
        gPista.appendChild(el('text', { x: S.w - 6, y: yG + 20, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'm'));
        if (libero || L.traguardo == null) return;
        /* il traguardo: la linea a scacchi e la fascia di ±50 cm */
        const xt = PX(L.traguardo), xa = PX(L.traguardo - TOL), xb = PX(L.traguardo + TOL);
        const hb = Math.round(48 * S.sc);
        gPista.appendChild(el('rect', { x: xa, y: yG - hb - 2, width: xb - xa, height: hb + 2, fill: 'var(--ok)', opacity: .14 }));
        for (let i = 0; i < 8; i++) gPista.appendChild(el('rect', { x: xt - 3 + (i % 2) * 3, y: yG - hb + i * hb / 8, width: 3, height: hb / 8, fill: 'var(--testo)', opacity: .8 }));
        gPista.appendChild(el('rect', { x: xt - 3, y: yG - hb, width: 6, height: hb, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 1, opacity: .6 }));
        /* l'etichetta del traguardo la scrive disegnaSlitta: se la slitta è lì sotto, sale sopra di lei */
      }

      /* --- la slitta nel punto s, con la freccia della velocità (azzurra) e delle forze (arancio) --- */
      function disegnaSlitta(st) {
        vuota(gSlitta);
        const L = liv(), yG = S.yG;
        const xs = PX(st.s), fuori = xs < 6 ? -1 : (xs > S.w - 6 ? 1 : 0);
        if (fuori) {   /* fuori dalla pista visibile: una freccia sul bordo con la posizione */
          const xb = fuori > 0 ? S.w - 8 : 8;
          freccia(gSlitta, xb - fuori * 22, yG - 18, xb, yG - 18, 'var(--testo)', 3);
          gSlitta.appendChild(el('text', conAlone({ x: xb - fuori * 26, y: yG - 30, 'text-anchor': fuori > 0 ? 'end' : 'start', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }), num(st.s, 1) + '\u00a0m'));
          etichettaTraguardo(null, 0);
          return;
        }
        const lw = 54, lh = 18, x0 = xs - lw / 2, yb = yG - 4;
        const sc = S.sc, g = el('g', { transform: 'translate(' + (xs * (1 - sc)).toFixed(1) + ' ' + (yG * (1 - sc)).toFixed(1) + ') scale(' + sc + ')' });   /* ingrandita intorno al punto d'appoggio */
        /* pattini */
        g.appendChild(el('path', { d: `M${x0 - 2} ${yb} H${x0 + lw - 4} q8 0 9 -9`, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
        g.appendChild(el('line', { x1: x0 + 10, y1: yb, x2: x0 + 10, y2: yb - 7, stroke: 'var(--testo)', 'stroke-width': 2 }));
        g.appendChild(el('line', { x1: x0 + lw - 12, y1: yb, x2: x0 + lw - 12, y2: yb - 7, stroke: 'var(--testo)', 'stroke-width': 2 }));
        /* pianale di legno */
        g.appendChild(el('rect', { x: x0, y: yb - 7 - lh * 0.55, width: lw, height: lh * 0.55, rx: 3, fill: '#b5813f', stroke: '#7a4b1d', 'stroke-width': 1.4 }));
        let alto = yb - 7 - lh * 0.55;
        if (L.cassa || L.ignota) {
          const cw = 30, ch = 24;
          g.appendChild(el('rect', { x: xs - cw / 2, y: alto - ch, width: cw, height: ch, rx: 2, fill: '#c98a4b', stroke: '#7a4b1d', 'stroke-width': 1.6 }));
          g.appendChild(el('path', { d: `M${xs - cw / 2} ${alto - ch} L${xs + cw / 2} ${alto} M${xs + cw / 2} ${alto - ch} L${xs - cw / 2} ${alto}`, stroke: '#7a4b1d', 'stroke-width': 1, opacity: .55 }));
          g.appendChild(el('text', { x: xs, y: alto - ch / 2 + 4, 'text-anchor': 'middle', fill: '#3d2408', style: 'font: 700 11px var(--font)' }, L.ignota ? '?' : L.cassa + ''));
          alto -= ch;
        }
        /* la tacca del centro sul righello */
        g.appendChild(el('path', { d: `M${xs} ${yG + 2} l-5 8 h10 z`, fill: 'var(--testo)' }));
        gSlitta.appendChild(g);
        alto = yG + (alto - yG) * sc;
        gSlitta.appendChild(el('text', conAlone({ x: xs, y: alto - 6, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)' }), L.ignota ? 'm = ?' : num(L.m, 0) + '\u00a0kg'));
        alto -= 18;
        const X0 = xs - lw * sc / 2, LW = lw * sc, YB = yG - 4 * sc;
        /* velocità: freccia azzurra sopra la slitta */
        const yv = alto - 8;
        if (Math.abs(st.v) > 0.004) {
          const lv = st.v * S.K;
          freccia(gSlitta, xs, yv, xs + lv, yv, 'var(--s1)', 3);
          const testo = num(Math.abs(st.v), 2) + '\u00a0m/s', largo = 8 * (testo.length + 2);
          let tx = lv > 0 ? xs + lv + 4 : xs + lv - 4, ancora = lv > 0 ? 'start' : 'end';
          /* vicino al bordo l'etichetta passa dall'altra parte, sopra la slitta */
          if (lv > 0 && tx + largo > S.w - 4) { tx = Math.min(xs, S.w - 4) - 6; ancora = 'end'; }
          if (lv < 0 && tx - largo < 4) { tx = Math.max(xs, 4) + 6; ancora = 'start'; }
          gSlitta.appendChild(etichetta(tx, yv + 5, ancora, 'var(--s1)', 'v', testo));
        } else {
          gSlitta.appendChild(etichetta(xs + 16, yv + 5, 'start', 'var(--s1)', 'v', '0'));
        }
        /* forze: la spinta del programma e l'attrito, arancio, all'altezza del pianale */
        const yf = YB - 12;
        if (st.F) {
          const lf = morsa(st.F * S.fpx * 0.55, -70, 70);
          const xA = st.F > 0 ? X0 - 4 - lf : X0 + LW + 4 - lf, xB = st.F > 0 ? X0 - 4 : X0 + LW + 4;
          freccia(gSlitta, xA, yf, xB, yf, 'var(--s2)', 3.2);
          gSlitta.appendChild(etichetta(st.F > 0 ? xA - 3 : xA + 3, yf - 8, st.F > 0 ? 'end' : 'start', 'var(--s2)', 'F', num(Math.abs(st.F), 0) + '\u00a0N'));
        }
        if (Math.abs(st.Fd) > 0.01 && (st.v !== 0 || !st.F)) {
          const ld = st.Fd * S.fpx * 0.55, xa = st.Fd > 0 ? X0 + 6 : X0 + LW - 6;
          freccia(gSlitta, xa, YB + 1, xa + ld, YB + 1, 'var(--s2)', 2.4, true);
        }
        etichettaTraguardo(xs, yv - 14);
      }
      function etichettaTraguardo(xs, yCima) {
        const L = liv(); if (libero || L.traguardo == null) return;
        const xt = PX(L.traguardo), hb = Math.round(48 * S.sc);
        const y = (xs != null && Math.abs(xs - xt) < 34 * S.sc + 26) ? Math.min(yG0() - hb - 8, yCima - 6) : yG0() - hb - 8;
        gSlitta.appendChild(el('text', conAlone({ x: xt, y: y, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }), num(L.traguardo, 0) + '\u00a0m'));
      }
      const yG0 = () => S.yG;
      function etichetta(x, y, ancora, colore, simbolo, valore) {
        const t = el('text', conAlone({ x: x, y: y, 'text-anchor': ancora, fill: colore, style: 'font: 700 13px var(--font)' }));
        t.appendChild(document.createTextNode(simbolo + ' '));
        t.appendChild(el('tspan', {}, valore));
        return t;
      }
      function freccia(g, x1, y1, x2, y2, colore, sp, tratteggio) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        const a = { x1: x1, y1: y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' };
        if (tratteggio) a['stroke-dasharray'] = '4 3';
        g.appendChild(el('line', a));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }

      /* --- le due corsie: il programma delle forze (arancio) e la velocità (azzurra) sullo stesso asse dei tempi --- */
      function disegnaCorsie() {
        vuota(gCorsie);
        const L = liv(), N = S.N, xF = CX(N + 1);
        /* sfondo delle colonne: la scelta in evidenza, «dopo» grigia */
        for (let k = 0; k <= N; k++) {
          const dopo = k === N;
          gCorsie.appendChild(el('rect', { x: CX(k) + 1, y: S.top, width: S.cw - 2, height: S.hF, rx: 5, fill: dopo ? 'var(--testo3)' : (k === sel && !animando ? 'var(--accento)' : 'var(--sup)'), opacity: dopo ? .12 : (k === sel && !animando ? .16 : .8), stroke: k === sel && !animando && !dopo ? 'var(--accento)' : 'var(--bordo)', 'stroke-width': k === sel && !animando && !dopo ? 2 : 1 }));
        }
        gCorsie.appendChild(el('text', { x: CX(N) + S.cw / 2, y: S.top + 15, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)' }, 'dopo'));
        gCorsie.appendChild(el('rect', { x: CX(0), y: S.top + S.hF + 8, width: xF - CX(0), height: S.hV, rx: 5, fill: 'var(--sup)', opacity: .8, stroke: 'var(--bordo)', 'stroke-width': 1 }));
        /* assi zero */
        gCorsie.appendChild(el('line', { x1: CX(0), y1: S.yF0, x2: xF, y2: S.yF0, stroke: 'var(--testo2)', 'stroke-width': 1.2, opacity: .7 }));
        gCorsie.appendChild(el('line', { x1: CX(0), y1: S.yV0, x2: xF, y2: S.yV0, stroke: 'var(--testo2)', 'stroke-width': 1.2, opacity: .7 }));
        /* griglia della velocità: una riga per metro al secondo (o per passo leggibile) */
        const pv = [0.5, 1, 2, 5, 10].find(p => p * S.vpx >= 14) || 10;
        for (let v = pv; v <= S.vS + 1e-9; v += pv) [v, -v].forEach(vv => gCorsie.appendChild(el('line', { x1: CX(0), y1: VY(vv), x2: xF, y2: VY(vv), stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .8 })));
        for (let k = 1; k <= N; k++) gCorsie.appendChild(el('line', { x1: CX(k), y1: S.top + S.hF + 8, x2: CX(k), y2: S.top + S.hF + 8 + S.hV, stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .9 }));
        /* etichette a sinistra */
        const lab = (y, testo, colore, peso) => gCorsie.appendChild(el('text', { x: S.x0c - 6, y: y, 'text-anchor': 'end', fill: colore, style: 'font: ' + (peso || 400) + ' 12px var(--font)' }, testo));
        /* il nome della grandezza a metà corsia, con l'unità sotto; il fondo scala in alto e in basso */
        const nome = (y, lettera, unita, colore) => {
          const t = el('text', { x: 3, y: y + 5, fill: colore, style: 'font: italic 700 16px var(--font)' }, lettera);
          t.appendChild(el('tspan', { fill: 'var(--testo2)', style: 'font: normal 400 12px var(--font)', dx: 2 }, unita));
          gCorsie.appendChild(t);
        };
        nome(S.yF0, 'F', 'N', 'var(--s2)');
        lab(FY(L.Fmax) + 4, segno(L.Fmax), 'var(--testo2)'); lab(FY(-L.Fmax) + 4, segno(-L.Fmax), 'var(--testo2)');
        nome(S.yV0, 'v', 'm/s', 'var(--s1)');
        lab(VY(S.vS) + 8, segno(S.vS), 'var(--testo2)'); lab(VY(-S.vS), segno(-S.vS), 'var(--testo2)');
        /* asse dei tempi */
        for (let k = 0; k <= N; k++) gCorsie.appendChild(el('text', { x: CX(k), y: S.basso + 15, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, String(k)));
        gCorsie.appendChild(el('text', { x: xF - 2, y: S.basso + 15, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 's'));
      }
      /* le barre delle forze del programma */
      function disegnaBarre() {
        vuota(gBarre);
        const N = S.N, bw = Math.min(S.cw * 0.56, 34);
        for (let k = 0; k < N; k++) {
          const F = piano[k], cx = CX(k) + S.cw / 2;
          if (F) {
            const y1 = FY(F);
            gBarre.appendChild(el('rect', { x: cx - bw / 2, y: Math.min(y1, S.yF0), width: bw, height: Math.abs(y1 - S.yF0), rx: 3, fill: 'var(--s2)', opacity: .9 }));
            gBarre.appendChild(el('text', conAlone({ x: cx, y: F > 0 ? y1 - 5 : y1 + 15, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }), segno(F)));
          } else gBarre.appendChild(el('text', { x: cx, y: S.yF0 - 5, 'text-anchor': 'middle', fill: 'var(--testo3)', style: 'font: 12px var(--font)' }, '0'));
        }
      }
      /* il grafico della velocità: la corsa precedente tratteggiata, quella in corso (o l'ultima) piena fino all'istante mostrato */
      function disegnaVel() {
        vuota(gVel);
        const tFine = (S.N + 1) * TAU;
        const traccia = (c, fino, tratteggio) => {
          let d = '', n = 0;
          for (let i = 0; i < c.camp.length; i += 4) {
            const p = c.camp[i]; if (p.t > fino || p.t > tFine) break;
            d += (n++ ? 'L' : 'M') + TX(p.t).toFixed(1) + ' ' + VY(p.v).toFixed(1) + ' ';
          }
          const ult = statoA(c, Math.min(fino, tFine, c.camp[c.camp.length - 1].t));
          d += (n ? 'L' : 'M') + TX(ult.t).toFixed(1) + ' ' + VY(ult.v).toFixed(1);
          if (c.fine.scappa && fino >= c.fine.t) d += ' L' + TX(Math.min(fino, tFine)).toFixed(1) + ' ' + VY(c.fine.v).toFixed(1);
          const a = { d: d, fill: 'none', stroke: 'var(--s1)', 'stroke-width': tratteggio ? 1.6 : 2.6, 'stroke-linejoin': 'round', opacity: tratteggio ? .5 : 1 };
          if (tratteggio) a['stroke-dasharray'] = '5 4';
          gVel.appendChild(el('path', a));
        };
        if (prima) traccia(prima, 1e9, true);
        if (ultima) {
          const fino = animando ? tCursore : 1e9;
          traccia(ultima, fino, false);
          /* i valori di v alla fine di ogni secondo (per leggere di quanto è cambiata) */
          /* solo dove la velocità cambia (e alla fine): nei tratti piatti il numero è lo stesso */
          if (!animando && S.cw >= 30) {
            const vb = ultima.vBordi, ult = vb.length - 1;
            let prec = -9, lato = 1;
            vb.forEach((v, k) => {
              const scritto = k === 0 ? v !== 0 : (v !== vb[k - 1] || (k < ult && v !== vb[k + 1]) || k === ult);
              gVel.appendChild(el('circle', { cx: TX(k * TAU), cy: VY(v), r: 2.6, fill: 'var(--s1)' }));
              if (!scritto) return;
              /* due numeri in colonne vicine: uno sopra e uno sotto la linea, per non sovrapporli */
              lato = (k - prec === 1 && S.cw < 46) ? -lato : (VY(v) - S.yV0 > -14 ? 1 : -1);
              prec = k;
              const y = VY(v);
              gVel.appendChild(el('text', conAlone({ x: TX(k * TAU), y: lato > 0 ? y - 6 : y + 15, 'text-anchor': k === 0 ? 'start' : 'middle', fill: 'var(--s1)', style: 'font: 600 12px var(--font)' }), num(v, 2)));
            });
          }
        }
      }
      function disegnaCursore() {
        vuota(gCursore);
        if (!animando || tCursore < 0) return;
        const x = TX(Math.min(tCursore, (S.N + 1) * TAU));
        gCursore.appendChild(el('line', { x1: x, y1: S.top, x2: x, y2: S.top + S.hF + 8 + S.hV, stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .55 }));
      }

      function statoFermo() { const L = liv(); return { s: L.s0 || 0, v: L.v0 || 0, F: 0, Fd: 0 }; }
      function ridisegnaTutto() {
        geometria(); disegnaPista(); disegnaCorsie(); disegnaBarre(); disegnaVel(); disegnaCursore();
        disegnaSlitta(statoVisto || statoFermo());
      }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const L = liv();
        box.F.querySelector('.nome').innerHTML = ctx.tex('F_{' + (sel + 1) + '}');
        const conUnita = (v, u) => v + '<span class="u">' + u + '</span>';
        box.F.querySelector('output').innerHTML = conUnita(segno(piano[sel]), 'N');
        box.k.querySelector('output').textContent = 'secondo ' + (sel + 1);
        box.m.querySelector('output').innerHTML = conUnita(Lib.m, 'kg');
        box.v0.querySelector('output').innerHTML = conUnita(num(Lib.v0, 1), 'm/s');
        box.mu.querySelector('output').textContent = num(Lib.mu, 2);
        box.m.hidden = box.v0.hidden = box.mu.hidden = !libero;
        b.casuale.hidden = !libero;
        const lim = { F: [-L.Fmax, L.Fmax, piano[sel]], k: [0, L.N - 1, sel], m: [10, 100, Lib.m], v0: [-3, 3, Lib.v0], mu: [0, 0.3, Lib.mu] };
        Object.keys(box).forEach(k => box[k].querySelectorAll('button').forEach(bt => {
          const d = +bt.dataset.d, l = lim[k]; bt.disabled = animando || (d < 0 ? l[2] <= l[0] + 1e-9 : l[2] >= l[1] - 1e-9);
        }));
      }
      /* il ponte con la teoria: a = R / m per il secondo scelto, con i numeri */
      function aggiornaFormula() {
        const L = liv(), F = piano[sel], pezzi = [];
        const numerico = (nome, s) => '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(nome) + ' </span>' + ctx.tex('= ' + s) + '</span>';
        const esito = s => '<span class="pezzo esito">' + ctx.tex(s) + '</span>';
        if (!libero && L.ignota) {
          pezzi.push('<span class="pezzo">' + ctx.tex('m = \\dfrac{F}{a}') + '</span>');
          pezzi.push('<span class="pezzo">con ' + ctx.tex('a = \\dfrac{\\Delta v}{\\Delta t}') + '</span>');
          pezzi.push('<span class="pezzo ignoto">' + ctx.tex('m = \\ ?') + '</span>');
        } else if (!libero && L.neve) {
          const Fd = L.neve.mu * L.m * G;
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('a_{\\text{neve}} = \\dfrac{F_d}{m} = \\dfrac{\\mu_d \\cdot m \\cdot g}{m}') + '</span>');
          pezzi.push(numerico('a_{\\text{neve}}', '\\dfrac{' + texNum(Fd, 1) + '\\,\\text{N}}{' + L.m + '\\,\\text{kg}}'));
          pezzi.push(esito('= ' + texNum(Fd / L.m, 2) + '\\,\\text{m/s}^2'));
        } else if (libero && Lib.mu > 0) {
          const nome = 'a_{' + (sel + 1) + '}', Fd = Lib.mu * Lib.m * G;
          const vm = statoA(simula(Lib, piano), sel + 0.5).v, segnoD = vm < 0 || (vm === 0 && F < 0) ? '+' : '-';   /* F_d contro il moto */
          if (vm === 0 && Math.abs(F) <= MU_S * Fd + 1e-9) {   /* ferma: l'attrito statico pareggia la spinta */
            pezzi.push('<span class="pezzo">ferma: ' + ctx.tex('|F_{' + (sel + 1) + '}| \\le ' + texNum(MU_S * Fd, 1) + '\\,\\text{N}') + '</span>');
            pezzi.push(esito(nome + ' = ' + texNum(0, 3)));
          } else {
            pezzi.push('<span class="pezzo simbolo">' + ctx.tex(nome + ' = \\dfrac{F_{' + (sel + 1) + '} ' + segnoD + ' F_d}{m}') + '</span>');
            const a = (F + (segnoD === '+' ? Fd : -Fd)) / Lib.m;
            pezzi.push(numerico(nome, '\\dfrac{' + texNum(F, 0) + '\\,\\text{N} ' + segnoD + ' ' + texNum(Fd, 1) + '\\,\\text{N}}{' + Lib.m + '\\,\\text{kg}}'));
            pezzi.push(esito('= ' + texNum(a, 3) + '\\,\\text{m/s}^2'));
          }
        } else {
          const nome = 'a_{' + (sel + 1) + '}';
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(nome + ' = \\dfrac{F_{' + (sel + 1) + '}}{m}') + '</span>');
          pezzi.push(numerico(nome, '\\dfrac{' + texNum(F, 0) + '\\,\\text{N}}{' + L.m + '\\,\\text{kg}}'));
          pezzi.push(esito('= ' + texNum(F / L.m, libero ? 3 : decimali(PASSO_F / L.m, 3)) + '\\,\\text{m/s}^2'));   /* nel livello la massa è fissa: i decimali li decide il passo di 10 N */
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
      function aggiornaConta() {
        const L = liv();
        contaEl.textContent = libero ? '' : (L.ignota ? 'corse rimaste: ' + Math.max(0, 2 - corseCassa) : 'corse: ' + corse);
      }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaCorsie(); disegnaBarre(); }

      /* ---------------- livelli ---------------- */
      function nuovaCassa() {
        const altre = MASSE_IGNOTE.filter(m => m !== massaIgnota);
        massaIgnota = altre[Math.floor(Math.random() * altre.length)];
        corseCassa = 0;
      }
      function avviaLivello(n, tieniCassa) {   /* tieniCassa: «Ricomincia» non cambia la cassa di massa ignota */
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; radice.classList.remove('in-libero');
        const stessa = tieniCassa && n === livello;
        livello = n; const L = LIVELLI[n];
        if (L.ignota && !stessa) nuovaCassa();
        piano = L.piano ? L.piano.slice() : new Array(L.N).fill(0);
        sel = 0; corse = 0; finito = false; ultima = prima = null; pianoCorsa = null; if (!stessa) detti = {};
        tCursore = -1; statoVisto = null; orologio.textContent = ''; aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- la corsa ---------------- */
      function via() {
        if (animando || finito) return;
        const L = liv();
        const sim = simula(L, piano);
        aiutoEl.hidden = true;
        if (!libero) { corse++; if (L.ignota) corseCassa++; }
        aggiornaConta();
        prima = ultima; ultima = sim; pianoCorsa = piano.slice();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.via.disabled = true; b.ric.disabled = true; b.casuale.disabled = true;
        /* finché la slitta resta in vista; se scappa, ancora un po' dopo il programma */
        const tVisto = sim.fine.scappa ? Math.min(sim.fine.t + 2.5, sim.fine.t + tempoFuori(sim)) : sim.fine.t;
        const T = Math.max(0.6, tVisto), fattore = Math.max(1, T / 6), t0 = performance.now();
        statoVisto = null; geometria(); disegnaCorsie(); disegnaBarre(); aggiornaParametri(); aggiornaLivelli();
        const passo = ora => {
          const t = Math.min(T, (ora - t0) / 1000 * fattore);
          tCursore = t;
          let st = statoA(sim, t);
          if (t > sim.fine.t) st = { t: t, s: sim.fine.s + sim.fine.v * (t - sim.fine.t), v: sim.fine.v, F: 0, Fd: 0 };
          statoVisto = st;
          disegnaSlitta(st); disegnaVel(); disegnaCursore();
          orologio.textContent = 't = ' + num(t, 1) + '\u00a0s' + (fattore > 1.05 ? '   (×' + num(fattore, 1) + ')' : '');
          if (t < T) { raf = requestAnimationFrame(passo); return; }
          raf = 0; arriva(sim, st);
        };
        raf = requestAnimationFrame(passo);
      }
      /* quanto ci mette, dopo la fine, a uscire dalla pista visibile */
      function tempoFuori(sim) {
        const f = sim.fine, V = vista();
        if (!f.v) return 0;
        const bordo = f.v > 0 ? V[1] + 1 : V[0] - 1;
        return Math.max(0.3, (bordo - f.s) / f.v);
      }

      function arriva(sim, st) {
        animando = false; b.via.disabled = false; b.ric.disabled = false; b.casuale.disabled = false;
        tCursore = -1;
        statoVisto = st.t >= sim.TP - 1e-9 ? { t: st.t, s: st.s, v: st.v, F: 0, Fd: 0 } : st;   /* finito il programma nessuno spinge */
        const L = liv();
        if (libero) { ridisegnaTutto(); aggiorna(); aggiornaLivelli(); msg.textContent = osserva(sim); msg.className = 'lab-messaggio'; return; }
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
        const v = verdetto(L, sim);
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        if (L.ignota && corseCassa >= 2) {   /* due corse sbagliate: arriva un'altra cassa */
          nuovaCassa(); ultima = prima = null; statoVisto = null;
          msg.textContent = v.testo + ' Arriva un\'altra cassa, con un\'altra massa: di nuovo due corse.';
          ridisegnaTutto(); aggiornaConta();
          dici('misura', 'Dal grafico leggi di quanto cambia v in un secondo: è a. Poi m = F / a.');
          return;
        }
        erroreTipico(L, sim);
      }

      function vinci(testo) {
        finito = true; b.via.disabled = true;
        const L = LIVELLI[livello];
        msg.innerHTML = '<span class="vinto">' + testo + (corse === 1 ? ' Alla prima corsa.' : ' Corse: ' + corse + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello](massaIgnota), { html: true, espressione: corse <= (L.ignota ? 2 : 1) ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { html: true, tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, sim) {
        const f = sim.fine, somma = pianoCorsa.reduce((x, y) => x + y, 0);
        const versoMoto = (L.v0 || 0) !== 0 ? Math.sign(L.v0) : Math.sign(pianoCorsa.find(F => F) || 0);
        const tutteConcordi = pianoCorsa.every(F => !F || Math.sign(F) === versoMoto);
        if (f.scappa && tutteConcordi && versoMoto) {
          if ((L.v0 || 0) && somma * L.v0 > 0) { dici('verso', 'Per rallentare la forza deve puntare contro la velocità: spingendo avanti va più veloce.'); return; }
          dici('inerzia', 'Smesso di spingere, la slitta non rallenta: sul ghiaccio nessuna forza la frena.');
          return;
        }
        if (L.cassa && L.piano && pianoCorsa.join() === L.piano.join()) { dici('massa', 'Stessa spinta su massa doppia: accelerazione metà, e la slitta fa metà strada.'); return; }
        if (L.traguardo < 0 && f.fermo && f.s > L.traguardo) { dici('indietro', 'Per tornare indietro la forza indietro deve agire più a lungo: prima la ferma, poi la riporta.'); return; }
        if (L.neve && f.fermo) { dici('neve', 'Sulla neve la frena l\'attrito: a = μ<sub>d</sub>·g, circa 0,98\u00a0m/s², qualunque sia la massa.'); return; }
        if (L.ignota) { dici('misura', 'Dal grafico leggi di quanto cambia v in un secondo: è a. Poi m = F / a.'); return; }
        if (f.scappa && !detti.inerzia) dici('inerzia', (L.v0 || 0) ? 'Finite le spinte la velocità resta quella: per fermarla, le spinte indietro devono togliere tutta la velocità che aveva.' : 'Finite le spinte la velocità resta quella: per fermarla servono spinte indietro uguali a quelle avanti.');
      }

      /* ---------------- modalità libera: nessun traguardo, nessun verdetto ---------------- */
      function osserva(sim) {
        const f = sim.fine;
        if (f.scappa) return 'Finite le spinte va a ' + num(Math.abs(f.v), 2) + '\u00a0m/s' + (Lib.mu ? '' : ': senza attrito, per sempre') + '.';
        if (f.fermo) {   /* l'istante in cui si è fermata davvero, non la fine del programma */
          let tf = 0; sim.camp.forEach(c => { if (c.v !== 0) tf = c.t; });
          return tf ? 'Ferma a ' + num(f.s, 2) + '\u00a0m, dopo ' + num(tf, 1) + '\u00a0s.' : 'Non si è mossa: ferma a ' + num(f.s, 2) + '\u00a0m.';
        }
        return 'Dopo ' + num(f.t, 0) + '\u00a0s va ancora a ' + num(f.v, 2) + '\u00a0m/s.';
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, piano: piano.slice(), sel, corse, finito, ultima, prima, pianoCorsa, detti: Object.assign({}, detti), massaIgnota, corseCassa, statoVisto, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        piano = new Array(Lib.N).fill(0); piano[0] = 20; piano[2] = -20; sel = 0;
        ultima = prima = null; finito = false; statoVisto = null;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio'; orologio.textContent = '';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; piano = z.piano; sel = z.sel; corse = z.corse; finito = z.finito; ultima = z.ultima; prima = z.prima;
        pianoCorsa = z.pianoCorsa; detti = z.detti; massaIgnota = z.massaIgnota; corseCassa = z.corseCassa; statoVisto = z.statoVisto;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.via.disabled = finito; orologio.textContent = '';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => lo + Math.round(Math.random() * (hi - lo) / s) * s;
        Lib.m = r(10, 60, 10); Lib.v0 = Math.random() < 0.4 ? r(-2, 2, 0.5) : 0;
        piano = piano.map(() => Math.random() < 0.45 ? 0 : r(-60, 60, 10));
        msg.textContent = ''; statoVisto = null; ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function tocco() {   /* ogni modifica del programma: via il messaggio di errore e la slitta torna alla partenza */
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (statoVisto) { statoVisto = null; disegnaSlitta(statoFermo()); }
      }
      function cambia(k, d) {
        const L = liv();
        if (animando || (finito && k !== 'k')) return false;
        if (k === 'k') { const n = morsa(sel + d, 0, L.N - 1); if (n === sel) return false; sel = n; aggiorna(); return true; }
        if (k === 'F') {
          const n = morsa(piano[sel] + d * PASSO_F, -L.Fmax, L.Fmax); if (n === piano[sel]) return false;
          piano[sel] = n; tocco(); aggiorna(); return true;
        }
        if (!libero) return false;
        const lim = { m: [10, 100, 10], v0: [-3, 3, 0.5], mu: [0, 0.3, 0.05] }[k];
        const n = morsa(Math.round((Lib[k] + d * lim[2]) * 100) / 100, lim[0], lim[1]);
        if (n === Lib[k]) return false;
        Lib[k] = n; tocco(); ridisegnaTutto(); aggiorna(); return true;
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        let attesa = 420;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(70, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* il dito nella corsia delle forze: sceglie la colonna e, in quella colonna, la forza (a passi di 10 N) */
      let preso = -1;
      function puntoSvg(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        return pt.matrixTransform(m.inverse());
      }
      function imposta(c, k) {
        const L = liv();
        const F = morsa(Math.round((S.yF0 - c.y) / S.fpx / PASSO_F) * PASSO_F, -L.Fmax, L.Fmax);
        let cambiato = sel !== k; sel = k;
        if (piano[k] !== F) { piano[k] = F; cambiato = true; tocco(); }
        if (cambiato) aggiorna();
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        const c = puntoSvg(ev); if (!c) return;
        const k = Math.floor((c.x - S.x0c) / S.cw);
        if (k < 0 || k >= S.N || c.y < S.top - 4 || c.y > S.top + S.hF + 4) return;
        preso = k; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        imposta(c, k); ev.preventDefault();
      });
      const muovi = ev => { if (preso < 0) return; const c = puntoSvg(ev); if (c) imposta(c, preso); ev.preventDefault(); };
      const molla = () => { preso = -1; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', via);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { piano = piano.map(() => 0); ultima = prima = null; statoVisto = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        if (finito) { avviaLivello((livello + 1) % LIVELLI.length); return; }
        avviaLivello(livello, true);
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
        forma = nuova; ridisegnaTutto();
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
