/* Laboratorio «Il lampadario» — equilibrio del punto materiale (argomento equilibrio).
   Un lampadario di peso P appeso a due funi. Si sceglie l'angolo di ogni fune sull'orizzontale (con − e +, oppure
   trascinando il lampadario nella scena): la geometria dà il punto dove le funi si incontrano e la loro lunghezza.
   «Appendi» lascia andare il lampadario: le tensioni sono quelle che annullano il peso,
     T1·cos α1 = T2·cos α2   e   T1·sin α1 + T2·sin α2 = P,
   cioè T1 = P·cos α2 / sin(α1 + α2), T2 = P·cos α1 / sin(α1 + α2) (con funi uguali T = P / (2·sin α)).
   Una fune che dovrebbe tirare più di quanto regge si spezza; il lampadario allora oscilla sull'altra fune
   (pendolo vero, con la tensione T = P·(cos θ + L·ω²/g)) e, se si spezza anche quella, cade (y = ½·g·t²).
   Le tensioni si leggono solo dopo «Appendi»; in modalità libera si vedono subito.
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-lampadario .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; cursor: grab; }
    .lab-lampadario .lab-scena > svg { width: 100%; height: 100%; }
    .lab-lampadario svg text { font-family: var(--font); }
    .lab-lampadario svg text, .lab-lampadario svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-lampadario .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-lampadario .consegna > span { display: block; }
    .lab-lampadario .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-lampadario .consegna:empty { display: none; }
    .lab-lampadario .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .5em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; height: calc(4.4 * clamp(1rem, 2.4cqmin, 1.15rem)); flex: none; }
    .lab-lampadario .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-lampadario .formula .ignoto { color: var(--testo3); }
    .lab-lampadario .formula .esito { color: var(--s2); font-weight: 600; }
    .lab-lampadario .lab-messaggio { padding: 0 4px; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-lampadario .formula { height: calc(6.4 * clamp(1rem, 2.4cqmin, 1.15rem)); } .lab-lampadario .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-lampadario .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-lampadario .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-lampadario .btn[disabled] { opacity: .38; cursor: default; }
    .lab-lampadario .lab-parametri { max-width: 520px; }
    .lab-lampadario .lab-parametri .b-casuale { justify-self: center; }
    .lab-lampadario .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-lampadario .lab-param[hidden] { display: none; }
    .lab-lampadario .lab-param .largo { display: none; }
    @container lab (max-aspect-ratio: 5 / 4) and (min-width: 600px) { .lab-lampadario .lab-param .largo { display: inline; } }
    .lab-lampadario .lab-param .nome { min-width: 1.6em; white-space: nowrap; }
    .lab-lampadario .lab-param output { min-width: 0; width: 4.9ch; flex: none; white-space: nowrap; }
    .lab-lampadario .lab-param[data-p="D"] output { width: 4.7ch; }
    .lab-lampadario .lab-param[data-p="a"] output, .lab-lampadario .lab-param[data-p="a1"] output, .lab-lampadario .lab-param[data-p="a2"] output { width: 3.2ch; }
    @container lab (max-width: 460px) { .lab-lampadario .lab-param { gap: 2px; } .lab-lampadario .lab-param .btn { min-width: 34px; padding: 0 4px; } .lab-lampadario .lab-parametri { gap: 6px 4px; } .lab-lampadario .lab-barra { gap: 6px; } .lab-lampadario .lab-barra .btn { padding-left: 12px; padding-right: 12px; } }
    .lab-lampadario .lab-param.fisso .btn { visibility: hidden; }
    .lab-lampadario .lab-param.fisso output { color: var(--testo2); }
    .lab-lampadario .conta { position: absolute; left: 8px; top: 6px; padding: 1px 6px; border-radius: 6px; background: var(--sup); margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-lampadario .conta:empty { display: none; }
    .lab-lampadario .vinto { display: inline-block; animation: lab-lampadario-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-lampadario-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-lampadario .formula .simbolo { }
    @container lab (max-width: 420px) { .lab-lampadario .formula .simbolo { display: none; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 3 nel Libero, dove la consegna non c'è) */
    .lab-lampadario .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(3 * var(--riga) + 2 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-lampadario .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-lampadario .lab-lato .consegna:empty { display: none; }
    .lab-lampadario .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-lampadario .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const G = 9.8, RAD = Math.PI / 180;
  const SOFFITTO = 0, PAVIMENTO = -3, TAVOLO_Y = -2.25;     /* metri: il soffitto è a quota 0, la stanza è alta 3 m */
  const LAMPADA_H = 0.42, LAMPADA_W = 0.5;                  /* il lampadario sotto l'anello dove si legano le funi */

  /* il punto dove le due funi si incontrano: dal gancio A la fune scende verso destra con l'angolo a1 sotto
     l'orizzontale, dal gancio B scende verso sinistra con a2. Restituisce null se non si incontrano. */
  function nodo(A, B, a1, a2) {
    const c1 = Math.cos(a1 * RAD), s1 = Math.sin(a1 * RAD), c2 = Math.cos(a2 * RAD), s2 = Math.sin(a2 * RAD);
    const det = c1 * s2 + c2 * s1;                         /* = sin(a1 + a2) */
    if (det < 1e-6) return null;
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const t1 = (dx * s2 - c2 * dy) / det, t2 = (c1 * dy + s1 * dx) / det;
    if (t1 < 0.02 || t2 < 0.02) return null;
    return { x: A[0] + t1 * c1, y: A[1] - t1 * s1, L1: t1, L2: t2, det };
  }
  /* le tensioni che annullano il peso (componenti orizzontali opposte, verticali che reggono P) */
  function tensioni(P, a1, a2) {
    const det = Math.sin((a1 + a2) * RAD);
    if (det < 1e-6) return null;
    return { T1: P * Math.cos(a2 * RAD) / det, T2: P * Math.cos(a1 * RAD) / det };
  }
  const arr1 = v => Math.round(v * 10) / 10;              /* i dinamometri leggono al decimo di newton */

  /* la configurazione completa di un livello con i valori scelti s = { a1, a2, f1, f2, P, D } */
  function configura(L, s) {
    const P = L.libero ? s.P : L.P;
    const A = L.libero ? [-s.D / 2, 0] : L.ganci[0], B = L.libero ? [s.D / 2, 0] : L.ganci[1];
    const a1 = L.a ? L.a[0] : s.a1, a2 = L.a ? L.a[1] : s.a2;
    const n = nodo(A, B, a1, a2), t = tensioni(P, a1, a2);
    const regge = L.scelte ? [L.scelte[s.f1], L.scelte[s.f2]] : (L.regge || [Infinity, Infinity]);
    return { P, A, B, a1, a2, n, T1: t ? t.T1 : Infinity, T2: t ? t.T2 : Infinity, regge };
  }
  /* il lampadario urta qualcosa? (tavolo o pavimento) */
  function urta(L, n) {
    const fondo = n.y - LAMPADA_H;
    if (L.libero) return null;
    if (L.tavolo && n.x + LAMPADA_W / 2 > L.tavolo[0] && n.x - LAMPADA_W / 2 < L.tavolo[1] && fondo < TAVOLO_Y) return 'tavolo';
    if (fondo < PAVIMENTO) return 'pavimento';
    return null;
  }
  function inZona(L, n) { const z = L.zona; return !z || (n.x >= z.x0 - 1e-9 && n.x <= z.x1 + 1e-9 && n.y >= z.y0 - 1e-9 && n.y <= z.y1 + 1e-9); }

  /* il verdetto di «Appendi»: { ok, tipo, testo, rotte: [bool, bool] } */
  function verdetto(L, c) {
    if (!c.n) return { ok: false, tipo: 'nodo', testo: 'Le due funi così non si incontrano.', rotte: [false, false] };
    const u = urta(L, c.n);
    if (u) return { ok: false, tipo: u, testo: u === 'tavolo' ? 'Così il lampadario finisce sul tavolo: va appeso più in alto.' : 'Così il lampadario tocca il pavimento.', rotte: [false, false] };
    const rotte = [arr1(c.T1) > c.regge[0], arr1(c.T2) > c.regge[1]];
    if (rotte[0] || rotte[1]) return { ok: false, tipo: 'rotta', rotte, testo: '' };
    if (!inZona(L, c.n)) return { ok: false, tipo: 'zona', rotte, testo: 'Le funi reggono, ma il lampadario è fuori dalla zona.' };
    if (L.scelte) {   /* deve essere la fune più sottile che regge, per ognuna delle due */
      const minima = (T, k) => L.scelte.filter(f => arr1(T) <= f)[0] === c.regge[k];
      if (!minima(c.T1, 0) || !minima(c.T2, 1)) return { ok: false, tipo: 'spreco', rotte, testo: 'Regge, ma bastava una fune più sottile.' };
    }
    return { ok: true, tipo: 'ok', rotte, testo: 'Regge.' };
  }

  /* ---------------- livelli ----------------
     tipo 'sim': le due funi hanno lo stesso angolo (un solo comando α); 'asim': due angoli; 'scelta': gli angoli sono
     fissi e si sceglie la fune. Le soluzioni sono contate dalla prova dei livelli (angoli a passi di 1°). */
  const LIVELLI = [
    { consegna: 'Appendi il lampadario da <b>40&nbsp;N</b>. Ogni fune regge <b>30&nbsp;N</b>.',
      tipo: 'sim', ganci: [[-0.5, 0], [0.5, 0]], P: 40, regge: [30, 30], inizio: { a1: 20, a2: 20 }, tavolo: [-0.9, 0.9], formula: 'sim' },
    { consegna: 'Appendilo nella zona, a non più di <b>50&nbsp;cm</b> dal soffitto. Funi da <b>50&nbsp;N</b>.',
      tipo: 'sim', ganci: [[-1, 0], [1, 0]], P: 40, regge: [50, 50], inizio: { a1: 55, a2: 55 }, tavolo: [-0.9, 0.9], zona: { x0: -1, x1: 1, y0: -0.5, y1: 0 }, formula: 'sim' },
    { consegna: 'Funi a <b>30°</b>, lampadario da <b>40&nbsp;N</b>: scegli la fune più sottile che regge.',
      tipo: 'scelta', ganci: [[-1, 0], [1, 0]], P: 40, a: [30, 30], scelte: [10, 25, 45, 90], uguali: true, inizio: { f1: 0, f2: 0 }, tavolo: [-0.9, 0.9], formula: 'sim' },
    { consegna: 'Portalo nella zona sopra il tavolino. Lampadario da <b>40&nbsp;N</b>, funi da <b>35&nbsp;N</b>.',
      tipo: 'asim', ganci: [[-1, 0], [1, 0]], P: 40, regge: [35, 35], inizio: { a1: 45, a2: 45 }, tavolo: [0.25, 1.15], zona: { x0: 0.3, x1: 1.1, y0: -0.9, y1: -0.4 }, formula: 'asim' },
    { consegna: 'Funi a <b>30°</b> e <b>60°</b>, lampadario da <b>60&nbsp;N</b>: per ognuna la più sottile che regge.',
      tipo: 'scelta', ganci: [[-1.2, 0], [1.2, 0]], P: 60, a: [30, 60], scelte: [20, 35, 50, 60, 90], inizio: { f1: 0, f2: 0 }, tavolo: [-0.9, 0.9], formula: 'asim' },
    { consegna: 'Una fune al soffitto e una alla parete: portalo sopra la scrivania. Funi da <b>45&nbsp;N</b>.',
      tipo: 'asim', ganci: [[-1, 0], [2.1, -1]], parete: true, P: 40, regge: [45, 45], inizio: { a1: 40, a2: 0 }, tavolo: [0.8, 2.1], zona: { x0: 0.9, x1: 1.6, y0: -1.4, y1: -0.8 }, formula: 'asim' },
    { consegna: 'Lampadario di <b>6&nbsp;kg</b>, funi da <b>80&nbsp;N</b>: al massimo <b>60&nbsp;cm</b> sotto il soffitto.',
      tipo: 'sim', ganci: [[-1.2, 0], [1.2, 0]], P: 6 * G, massa: 6, regge: [80, 80], inizio: { a1: 50, a2: 50 }, tavolo: [-0.9, 0.9], zona: { x0: -1.2, x1: 1.2, y0: -0.6, y1: 0 }, formula: 'sim' }
  ];
  const LIBERO = { libero: true, consegna: '', tipo: 'asim', formula: 'libero' };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    c => 'Più le funi sono verticali, meno tirano: a ' + c.a1 + '° ognuna tira ' + num(c.T1, 1) + '\u00a0N. Verticali, tirerebbero 20\u00a0N a testa.',
    c => 'Più la fune è orizzontale, più tira: la sua parte verticale deve restare 20\u00a0N, e a ' + c.a1 + '° serve una tensione di ' + num(c.T1, 1) + '\u00a0N.',
    c => 'A 30° la componente verticale è metà della tensione: ogni fune tira quanto tutto il peso, 40\u00a0N. Non la metà.',
    c => 'Le componenti orizzontali sono uguali: la fune più ripida è quella che regge più peso.',
    c => 'La fune a 60° tira 52\u00a0N, quella a 30° solo 30\u00a0N: la robusta va dove la fune è più verticale.',
    c => 'Una fune orizzontale tira solo di lato: per aiutare a reggere il peso, la fune alla parete deve scendere.',
    c => 'Prima il peso, P = m·g = 58,8\u00a0N; poi le funi: quasi orizzontali, tirano più del peso intero.'
  ];

  const AIUTO = 'Il lampadario è fermo: la somma delle forze è zero. Il peso P tira giù, le tensioni T₁ e T₂ tirano lungo le funi. Le parti orizzontali delle tensioni sono opposte e si annullano, le parti verticali insieme reggono il peso. Con − e + scegli l\'angolo di ogni fune sull\'orizzontale (1° per volta, tieni premuto per andare veloce), oppure trascina il lampadario. «Appendi» lo lascia andare: una fune che dovrebbe tirare più di quanto regge si spezza. Le tensioni si leggono al decimo di newton.';
  const AIUTI = {
    1: ' La zona è la fascia tratteggiata vicino al soffitto: l\'anello del lampadario deve stare lì dentro.',
    2: ' Scegli con − e + quale fune usare (tutte e due uguali). Con la formula sotto calcoli quanto deve tirare ognuna.',
    3: ' Il tavolino è a destra. Guarda quale fune diventa più ripida quando sposti il lampadario da quella parte.',
    4: ' Una fune a 30°, l\'altra a 60°. Scegli la fune 1 e la fune 2 separatamente: le due equazioni sotto danno le due tensioni.',
    5: ' La fune 2 è legata alla parete, a 1\u00a0m sotto il soffitto. Con α₂ = 0° è orizzontale.',
    6: ' Qui c\'è la massa, non il peso: P = m·g, con g = 9,8\u00a0m/s².'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da vincere e le funi non si spezzano. Scegli il peso P, la distanza D fra i ganci e gli angoli delle due funi (o trascina il lampadario): le tensioni si leggono subito. In verde la somma T₁ + T₂, che è sempre uguale e opposta al peso.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  function texV(v) { return texNum(v, 0); }   /* il peso scelto, a passi di 5 N: sempre intero (con la massa il conto è a parte) */

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const ALONE = { 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };

  QUANTO.registraLab({
    id: 'lampadario',
    fisica: { nodo, tensioni, configura, verdetto, urta, inZona, LIVELLI, LIBERO },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-lampadario')) { const st = document.createElement('style'); st.id = 'stile-lab-lampadario'; st.textContent = STILE; document.head.appendChild(st); }
      radice.classList.add('lab-lampadario');
      const bt = (k, d, etich) => '<button type="button" class="btn piccolo" data-d="' + d + '" aria-label="' + etich + '">' + (d < 0 ? '−' : '+') + '</button>';
      const riga = (k, nome, giu, su) => '<div class="lab-param" data-p="' + k + '"><span class="nome">' + nome + '</span>' + bt(k, -1, giu) + '<output></output>' + bt(k, 1, su) + '</div>';
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, peso, ganci e angoli li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${riga('P', ctx.tex('P'), 'peso minore', 'peso maggiore')}
              ${riga('D', ctx.tex('D'), 'ganci più vicini', 'ganci più lontani')}
              ${riga('a', ctx.tex('\\alpha'), 'funi più orizzontali', 'funi più verticali')}
              ${riga('a1', ctx.tex('\\alpha_1'), 'fune 1 più orizzontale', 'fune 1 più verticale')}
              ${riga('a2', ctx.tex('\\alpha_2'), 'fune 2 più orizzontale', 'fune 2 più verticale')}
              ${riga('f', 'fune', 'fune più sottile', 'fune più robusta')}
              ${riga('f1', '<span class="largo">fune </span>1', 'fune 1 più sottile', 'fune 1 più robusta')}
              ${riga('f2', '<span class="largo">fune </span>2', 'fune 2 più sottile', 'fune 2 più robusta')}
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-appendi">🪝 Appendi</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = sel => radice.querySelector(sel);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { appendi: q('.b-appendi'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = {};
      ['P', 'D', 'a', 'a1', 'a2', 'f', 'f1', 'f2'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ----------------
         fase: 'tenuto' (il lampadario è ancora in mano: si regola), 'appeso' (regge), 'rotto' (una fune si è spezzata), 'anim' */
      let livello = 0, s = {}, fase = 'tenuto', tentativi = 0, finito = false, raf = 0;
      let esito = null, caduta = null, detti = {}, prec = null;
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const conf = () => configura(liv(), s);

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un lampadario appeso al soffitto con due funi, con le forze che agiscono su di lui', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gFuni = el('g'), gLampada = el('g'), gForze = el('g'), gTesti = el('g');
      [gFondo, gFuni, gLampada, gForze, gTesti].forEach(g => svg.appendChild(g));

      /* S = { w, h, U (px per metro), ox, oy (dove sta il punto x = 0, y = 0), K (px per newton) } */
      let S = { w: 0, h: 0, U: 80, ox: 0, oy: 20, K: 1 };
      const PX = x => S.ox + x * S.U, PY = y => S.oy - y * S.U;
      function vista() {
        const L = liv();
        if (!libero) {   /* in larghezza basta ciò che serve al livello (ganci, tavolo, zona): sul telefono il disegno viene più grande */
          const xs = [L.ganci[0][0], L.ganci[1][0]].concat(L.tavolo || [], L.zona ? [L.zona.x0, L.zona.x1] : []);
          let x0 = Math.min.apply(null, xs) - 0.45, x1 = Math.max.apply(null, xs) + 0.45;
          if (L.parete) x1 = L.ganci[1][0] + 0.12;
          const manca = 2.6 - (x1 - x0); if (manca > 0) { x0 -= manca / 2; x1 += manca / 2; }
          return { x0, x1, y0: PAVIMENTO - 0.05, y1: 0.22 };
        }
        const c = conf(), mezza = Math.max(1.6, s.D / 2 + 0.5);
        const giu = c.n ? Math.min(c.n.y - LAMPADA_H - 0.75, -2.2) : -2.2;
        return { x0: -mezza, x1: mezza, y0: Math.max(giu, -120), y1: 0.28 };
      }
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const V = vista(), m = 8;
        const U = Math.min((w - 2 * m) / (V.x1 - V.x0), (h - 2 * m) / (V.y1 - V.y0));
        const ox = w / 2 - (V.x0 + V.x1) / 2 * U, oy = m + V.y1 * U;   /* il soffitto in alto: lo spazio che avanza va sotto */
        const Pref = libero ? s.P : liv().P;
        S = { w, h, U, ox, oy, K: 0.55 * U / Math.max(1, Pref) };   /* il peso è una freccia lunga 55 cm */
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      function testo(g, x, y, t, colore, extra) {
        const e = el('text', Object.assign({ x, y, fill: colore || 'var(--testo)', style: 'font: 600 13px var(--font)' }, ALONE, extra || {}), t);
        g.appendChild(e); return e;
      }
      function freccia(g, x1, y1, x2, y2, colore, sp, tratt) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(12, lung * 0.5);
        const lin = { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' };
        if (tratt) lin['stroke-dasharray'] = '6 4';
        g.appendChild(el('line', lin));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }
      /* il testo di una forza con il pedice: «T₁ 40 N» */
      function etichetta(g, x, y, nome, ped, valore, colore, anc) {
        const e = el('text', Object.assign({ x, y, fill: colore, 'text-anchor': anc || 'start', style: 'font: 700 14px var(--font)' }, ALONE));
        e.appendChild(document.createTextNode(nome));
        if (ped) e.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 11px' }, ped));
        if (valore) e.appendChild(el('tspan', { style: 'font-weight: 600' }, ' ' + valore));
        g.appendChild(e); return e;
      }

      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), c = conf();
        /* il soffitto, tratteggiato */
        const ys = PY(0);
        gFondo.appendChild(el('rect', { x: 0, y: 0, width: S.w, height: Math.max(0, ys), fill: 'var(--testo2)', opacity: .18 }));
        gFondo.appendChild(el('line', { x1: 0, y1: ys, x2: S.w, y2: ys, stroke: 'var(--testo)', 'stroke-width': 2, opacity: .6 }));
        for (let x0 = -Math.ceil(ys / 14) * 14; x0 < S.w; x0 += 14) {   /* righe a 45°, tagliate ai bordi della scena */
          const t0 = Math.max(0, -x0), t1 = Math.min(ys, S.w - x0);
          if (t1 > t0) gFondo.appendChild(el('line', { x1: x0 + t0, y1: ys - t0, x2: x0 + t1, y2: ys - t1, stroke: 'var(--testo2)', 'stroke-width': 1, opacity: .35 }));
        }
        if (!libero) {
          /* pavimento */
          const yp = PY(PAVIMENTO);
          gFondo.appendChild(el('rect', { x: 0, y: yp, width: S.w, height: S.h - yp, fill: '#b5813f', opacity: .3 }));
          gFondo.appendChild(el('line', { x1: 0, y1: yp, x2: S.w, y2: yp, stroke: 'var(--testo)', 'stroke-width': 2, opacity: .5 }));
          /* la parete con il gancio */
          if (L.parete) {
            const xw = PX(L.ganci[1][0]);
            gFondo.appendChild(el('rect', { x: xw, y: 0, width: S.w - xw, height: S.h, fill: 'var(--testo2)', opacity: .18 }));
            gFondo.appendChild(el('line', { x1: xw, y1: 0, x2: xw, y2: yp, stroke: 'var(--testo)', 'stroke-width': 2, opacity: .6 }));
          }
          /* il tavolo */
          if (L.tavolo) {
            const x0 = PX(L.tavolo[0]), x1 = PX(L.tavolo[1]), yt = PY(TAVOLO_Y), sp = Math.max(4, 0.05 * S.U);
            gFondo.appendChild(el('rect', { x: x0, y: yt, width: x1 - x0, height: sp, rx: 2, fill: '#8a6a45', opacity: .8 }));
            gFondo.appendChild(el('rect', { x: x0 + sp, y: yt + sp, width: sp * 0.8, height: yp - yt - sp, fill: '#8a6a45', opacity: .6 }));
            gFondo.appendChild(el('rect', { x: x1 - sp * 1.8, y: yt + sp, width: sp * 0.8, height: yp - yt - sp, fill: '#8a6a45', opacity: .6 }));
          }
          /* la zona dove deve stare l'anello del lampadario */
          if (L.zona) {
            const z = L.zona, x0 = PX(z.x0), x1 = PX(z.x1), y0 = PY(z.y1), y1 = PY(z.y0);
            gFondo.appendChild(el('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: 'var(--accento)', opacity: .1 }));
            gFondo.appendChild(el('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: 'none', stroke: 'var(--accento)', 'stroke-width': 1.6, 'stroke-dasharray': '6 4', opacity: .85 }));
            const etich = z.y1 >= 0 ? Math.round(-z.y0 * 100) + '\u00a0cm' : 'zona';
            testo(gFondo, x1 - 4, y1 - 5, etich, 'var(--accento-testo)', { 'text-anchor': 'end', style: 'font: 600 12px var(--font)' });
          }
        }
        /* i ganci */
        [c.A, c.B].forEach((g, i) => {
          const x = PX(g[0]), y = PY(g[1]);
          if (g[1] < 0) gFondo.appendChild(el('line', { x1: x, y1: y, x2: x - 26, y2: y, stroke: 'var(--testo2)', 'stroke-width': 1, 'stroke-dasharray': '4 3', opacity: .8 }));
          gFondo.appendChild(el('rect', { x: x - 5, y: y - 4, width: 10, height: 5, rx: 1.5, fill: 'var(--testo)' }));
          gFondo.appendChild(el('circle', { cx: x, cy: y + 2, r: 3.2, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 1.8 }));
        });
      }

      /* le funi, il lampadario e (dopo «Appendi», o sempre in modalità libera) le forze */
      function disegnaScena() {
        vuota(gFuni); vuota(gLampada); vuota(gForze); vuota(gTesti);
        const L = liv(), c = conf();
        if (!c.n) {
          testo(gTesti, S.w / 2, PY(-1), 'Le funi non si incontrano', 'var(--testo2)', { 'text-anchor': 'middle' });
          return;
        }
        let nx = c.n.x, ny = c.n.y;
        if (caduta) { nx = caduta.x; ny = caduta.y; }
        const N = [PX(nx), PY(ny)];
        /* le funi: spessore secondo quanto reggono; tratteggiate finché il lampadario è in mano */
        const lette = tensioniVisibili();
        [0, 1].forEach(i => {
          const g = i ? c.B : c.A, H = [PX(g[0]), PY(g[1])];
          const sp = c.regge[i] === Infinity ? 2.2 : 1.4 + c.regge[i] / 30;
          const rotta = caduta && caduta.rotte[i];
          if (rotta) {   /* due mozziconi: uno pende dal gancio, uno dal lampadario */
            const lr = (i ? c.n.L2 : c.n.L1) * S.U * 0.3;
            gFuni.appendChild(el('path', { d: `M${H[0]} ${H[1]} q ${i ? -6 : 6} ${lr * 0.6} 0 ${lr}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': sp, 'stroke-linecap': 'round' }));
            gFuni.appendChild(el('path', { d: `M${N[0]} ${N[1]} q ${i ? 8 : -8} ${lr * 0.5} ${i ? 2 : -2} ${lr * 0.9}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': sp, 'stroke-linecap': 'round' }));
            return;
          }
          if (caduta && caduta.libera) return;   /* il lampadario cade: la fune che non si è spezzata resta appesa al gancio */
          const a = { x1: H[0], y1: H[1], x2: N[0], y2: N[1], stroke: lette ? 'var(--testo)' : 'var(--testo2)', 'stroke-width': sp, 'stroke-linecap': 'round', opacity: lette ? .85 : .7 };
          if (!lette && !caduta) a['stroke-dasharray'] = '7 5';
          gFuni.appendChild(el('line', a));
        });
        if (caduta && caduta.libera) {
          [0, 1].forEach(i => { if (caduta.rotte[i]) return; const g = i ? c.B : c.A, H = [PX(g[0]), PY(g[1])], lr = (i ? c.n.L2 : c.n.L1) * S.U; gFuni.appendChild(el('path', { d: `M${H[0]} ${H[1]} l 0 ${lr * 0.9}`, stroke: 'var(--testo2)', 'stroke-width': 1.4 + c.regge[i] / 30, fill: 'none' })); });
        }
        disegnaLampada(N);
        if (!caduta) disegnaAngoli(c, N);
        if (caduta) return;
        /* il peso è noto da subito; le tensioni solo a lampadario appeso */
        const K = S.K, P = c.P;
        freccia(gForze, N[0], N[1], N[0], N[1] + P * K, 'var(--s2)', 3.2);
        etichetta(gForze, N[0] + 9, N[1] + P * K - 2, 'P', '', L.massa && !lette ? '' : num(P, L.massa ? 1 : 0) + '\u00a0N', 'var(--s2)');
        if (!lette) return;
        const u1 = [-(N[0] - PX(c.A[0])), -(N[1] - PY(c.A[1]))], u2 = [PX(c.B[0]) - N[0], PY(c.B[1]) - N[1]];
        const n1 = Math.hypot(u1[0], u1[1]), n2 = Math.hypot(u2[0], u2[1]);
        const v1 = [u1[0] / n1 * c.T1 * K, u1[1] / n1 * c.T1 * K], v2 = [u2[0] / n2 * c.T2 * K, u2[1] / n2 * c.T2 * K];
        /* la somma delle due tensioni col parallelogramma: verde, uguale e opposta al peso */
        const sx = v1[0] + v2[0], sy = v1[1] + v2[1];
        if (c.T1 > 0.05 && c.T2 > 0.05) {
          gForze.appendChild(el('line', { x1: N[0] + v1[0], y1: N[1] + v1[1], x2: N[0] + sx, y2: N[1] + sy, stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .8 }));
          gForze.appendChild(el('line', { x1: N[0] + v2[0], y1: N[1] + v2[1], x2: N[0] + sx, y2: N[1] + sy, stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .8 }));
        }
        freccia(gForze, N[0], N[1], N[0] + sx, N[1] + sy, 'var(--s3)', 3);
        freccia(gForze, N[0], N[1], N[0] + v1[0], N[1] + v1[1], 'var(--s2)', 3.2);
        freccia(gForze, N[0], N[1], N[0] + v2[0], N[1] + v2[1], 'var(--s2)', 3.2);
        const dentro = (x, y, larg, anc) => [anc === 'end' ? morsa(x, larg + 4, S.w - 4) : morsa(x, 4, S.w - larg - 4), morsa(y, 16, S.h - 8)];
        const p1 = dentro(N[0] + v1[0] - 6, N[1] + v1[1] + 18, 84, 'end'), p2 = dentro(N[0] + v2[0] + 6, N[1] + v2[1] + 18, 84, 'start');
        if (c.T1 > 0.05) etichetta(gForze, p1[0], p1[1], 'T', '1', num(c.T1, 1) + '\u00a0N', 'var(--s2)', 'end');
        if (c.T2 > 0.05) etichetta(gForze, p2[0], p2[1], 'T', '2', num(c.T2, 1) + '\u00a0N', 'var(--s2)', 'start');
        const ps = dentro(N[0] + sx - 27, N[1] + sy - 8, 54, 'start');
        const es = el('text', Object.assign({ x: ps[0], y: ps[1], fill: 'var(--s3)', style: 'font: 700 13px var(--font)' }, ALONE));
        es.appendChild(document.createTextNode('T')); es.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, '1'));
        es.appendChild(el('tspan', {}, ' + T')); es.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, '2'));
        gForze.appendChild(es);
      }
      /* l'angolo di ogni fune sull'orizzontale, al gancio, e il numero della fune con quanto regge */
      function disegnaAngoli(c, N) {
        const L = liv();
        [0, 1].forEach(i => {
          const g = i ? c.B : c.A, H = [PX(g[0]), PY(g[1])], a = i ? c.a2 : c.a1, verso = i ? -1 : 1;
          const r = Math.min(30, 0.35 * S.U);
          if (a > 0.5 && a < 89.5) {
            const ax = H[0] + verso * r * Math.cos(a * RAD), ay = H[1] + r * Math.sin(a * RAD);
            gTesti.appendChild(el('path', { d: `M${H[0] + verso * r} ${H[1]} A${r} ${r} 0 0 ${i ? 0 : 1} ${ax} ${ay}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
          }
          const ma = (a / 2) * RAD;
          testo(gTesti, H[0] + verso * (r + 8) * Math.cos(ma), H[1] + (r + 8) * Math.sin(ma) + 10, a + '°', 'var(--testo2)', { 'text-anchor': i ? 'end' : 'start' });
          /* a metà fune: il numero, la lunghezza e quanto regge */
          const L1 = i ? c.n.L2 : c.n.L1, mx = H[0] + (N[0] - H[0]) * 0.4, my = H[1] + (N[1] - H[1]) * 0.4;
          if (L1 * S.U < 120) return;   /* fune corta: l'etichetta coprirebbe le frecce */
          const righe = ['fune ' + (i + 1) + ' · ' + num(L1, 2) + '\u00a0m'];
          const larg = 7 * Math.max.apply(null, righe.map(r => r.length)), anc = i ? 'start' : 'end';
          const lx = i ? morsa(mx + 10, 4, S.w - larg - 4) : morsa(mx - 10, larg + 4, S.w - 4);
          const t = el('text', Object.assign({ x: lx, y: my - 4, fill: 'var(--testo2)', 'text-anchor': anc, style: 'font: 600 12px var(--font)' }, ALONE));
          righe.forEach((rg, k) => t.appendChild(el('tspan', { x: lx, dy: k ? 15 : 0 }, rg)));
          gTesti.appendChild(t);
        });
      }
      function disegnaLampada(N) {
        const u = S.U, x = N[0], y = N[1];
        const g = el('g');
        g.appendChild(el('circle', { cx: x, cy: y, r: 3.5, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 1.8 }));
        g.appendChild(el('line', { x1: x, y1: y + 3, x2: x, y2: y + 0.16 * u, stroke: 'var(--testo)', 'stroke-width': 2 }));
        const w = LAMPADA_W * u / 2, top = y + 0.16 * u, bot = y + LAMPADA_H * u;
        g.appendChild(el('ellipse', { cx: x, cy: bot, rx: w * 0.75, ry: Math.max(3, 0.05 * u), fill: '#ffe48a', opacity: (fase === 'appeso' || libero) ? .9 : .45 }));
        g.appendChild(el('path', { d: `M${x - w * 0.35} ${top} L${x + w * 0.35} ${top} L${x + w} ${bot} L${x - w} ${bot} Z`, fill: '#d9a62e', stroke: 'var(--testo)', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }));
        gLampada.appendChild(g);
      }

      /* le tensioni si leggono a lampadario appeso; nei livelli in cui si sceglie la fune, solo se la scelta è giusta */
      function tensioniVisibili() { return libero || (fase === 'appeso' && !(liv().scelte && esito && !esito.ok)); }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaScena(); }

      /* ---------------- pannello ---------------- */
      const DEF = {
        P: { min: 10, max: 100, passo: 5, f: v => v + '\u00a0N' },
        D: { min: 0.4, max: 4, passo: 0.2, f: v => num(v, 1) + '\u00a0m' },
        a: { min: 0, max: 90, passo: 1, f: v => v + '°' }, a1: { min: 0, max: 90, passo: 1, f: v => v + '°' }, a2: { min: 0, max: 90, passo: 1, f: v => v + '°' }
      };
      function visibili() {
        const L = liv();
        if (libero) return ['P', 'D', 'a1', 'a2'];
        if (L.tipo === 'sim') return ['a'];
        if (L.tipo === 'asim') return ['a1', 'a2'];
        return L.uguali ? ['a', 'f'] : ['f1', 'f2'];
      }
      function valore(k) { return k === 'a' ? s.a1 : k === 'f' ? s.f1 : s[k]; }
      function limiti(k) {
        const L = liv();
        if (k[0] === 'f') return [0, L.scelte.length - 1, 1];
        const d = DEF[k]; return [d.min, d.max, d.passo];
      }
      function fisso(k) { const L = liv(); return !libero && k === 'a' && !!L.a; }
      function aggiornaParametri() {
        const L = liv(), vis = visibili();
        Object.keys(box).forEach(k => {
          const bx = box[k]; bx.hidden = vis.indexOf(k) < 0;
          if (bx.hidden) return;
          const v = valore(k);
          bx.querySelector('output').textContent = k[0] === 'f' ? L.scelte[v] + '\u00a0N' : DEF[k].f(v);
          bx.classList.toggle('fisso', fisso(k));
          const lim = limiti(k);
          bx.querySelectorAll('button').forEach(bb => { const d = +bb.dataset.d; bb.disabled = fase === 'anim' || finito || (d < 0 ? v <= lim[0] + 1e-9 : v >= lim[1] - 1e-9); });
          bx.title = fisso(k) ? 'Angolo fisso in questo livello' : '';
        });
        b.appendi.disabled = finito || fase === 'anim' || libero;
        b.appendi.hidden = libero;
      }
      /* il ponte con la teoria: la formula con i numeri scelti; il risultato solo a lampadario appeso */
      function aggiornaFormula() {
        const L = liv(), c = conf();
        const fatto = tensioniVisibili() || (fase === 'rotto' && !L.scelte);
        const pezzi = [];
        const ris = t => fatto ? '<span class="pezzo esito">' + ctx.tex(t) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex(t.replace(/\\approx.*$/, '= \\ ?')) + '</span>';
        const Ptex = L.massa ? '(' + L.massa + ' \\cdot 9{,}8)\\,\\text{N}' : texV(c.P) + '\\,\\text{N}';
        if (!c.n || c.a1 + c.a2 <= 0) { formulaEl.innerHTML = '<span class="pezzo">' + ctx.tex('T_1 \\cdot \\sin\\alpha_1 + T_2 \\cdot \\sin\\alpha_2 = P') + '</span>'; return; }
        if (c.a1 === c.a2) {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex(L.massa ? 'T = \\dfrac{m \\cdot g}{2 \\cdot \\sin\\alpha}' : 'T = \\dfrac{P}{2 \\cdot \\sin\\alpha}') + '</span>');
          pezzi.push('<span class="pezzo">' + ctx.tex('T = \\dfrac{' + Ptex + '}{2 \\cdot \\sin ' + c.a1 + '^\\circ}') + '</span>');
          pezzi.push(ris('T \\approx ' + texNum(c.T1, 1) + '\\,\\text{N}'));
        } else {
          pezzi.push('<span class="pezzo">' + ctx.tex('T_1 \\cdot \\cos ' + c.a1 + '^\\circ = T_2 \\cdot \\cos ' + c.a2 + '^\\circ') + '</span>');
          pezzi.push('<span class="pezzo">' + ctx.tex('T_1 \\cdot \\sin ' + c.a1 + '^\\circ + T_2 \\cdot \\sin ' + c.a2 + '^\\circ = ' + Ptex) + '</span>');
          pezzi.push(fatto ? '<span class="pezzo esito">' + ctx.tex('T_1 \\approx ' + texNum(c.T1, 1) + '\\,\\text{N} \\quad T_2 \\approx ' + texNum(c.T2, 1) + '\\,\\text{N}') + '</span>'
            : '<span class="pezzo ignoto">' + ctx.tex('T_1 = \\ ? \\quad T_2 = \\ ?') + '</span>');
        }
        formulaEl.innerHTML = pezzi.join('');
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = fase === 'anim' || (k > sblocco && k !== livello);
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
        b.libero.disabled = fase === 'anim';
      }
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'tentativi: ' + tentativi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaScena(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); raf = 0;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        s = { a1: 45, a2: 45, f1: 0, f2: 0, P: 40, D: 2 };
        Object.assign(s, L.inizio || {});
        if (L.a) { s.a1 = L.a[0]; s.a2 = L.a[1]; }
        fase = 'tenuto'; tentativi = 0; finito = false; esito = null; caduta = null; detti = {}; prec = null;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- «Appendi» ---------------- */
      function appendi() {
        if (fase === 'anim' || finito || libero) return;
        const L = liv(), c = conf(), v = verdetto(L, c);
        aiutoEl.hidden = true;
        if (v.tipo === 'nodo' || v.tipo === 'tavolo' || v.tipo === 'pavimento') { msg.textContent = v.testo; msg.className = 'lab-messaggio no'; ctx.mascotte('ops'); return; }
        tentativi++; aggiornaConta();
        const p0 = prec; prec = { a1: c.a1, a2: c.a2, T1: c.T1, T2: c.T2, f1: s.f1, f2: s.f2, v };
        if (v.tipo === 'rotta') { rompi(c, v, p0); return; }
        fase = 'appeso'; esito = v;
        aggiorna(); aggiornaLivelli();
        if (v.ok) { vinci(c); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, c, v, p0);
      }

      /* una o due funi si spezzano: il lampadario oscilla sull'altra (pendolo) oppure cade */
      function rompi(c, v, p0) {
        const L = liv();
        fase = 'anim'; esito = v;
        const P = c.P, m = P / G;
        const chi = v.rotte[0] && v.rotte[1] ? 'Si sono spezzate tutte e due le funi.' : 'Si è spezzata la fune ' + (v.rotte[0] ? 1 : 2) + '.';
        const quanto = L.scelte ? '' : v.rotte[0] && v.rotte[1] ? (c.a1 === c.a2 && c.regge[0] === c.regge[1] ? ' Ognuna doveva tirare ' + num(c.T1, 1) + '\u00a0N, ne regge ' + c.regge[0] + '.' : ' Dovevano tirare ' + num(c.T1, 1) + '\u00a0N e ' + num(c.T2, 1) + '\u00a0N, ne reggono ' + (c.regge[0] === c.regge[1] ? c.regge[0] + ' ciascuna.' : c.regge[0] + ' e ' + c.regge[1] + '.')) : ' Doveva tirare ' + num(v.rotte[0] ? c.T1 : c.T2, 1) + '\u00a0N, ne regge ' + c.regge[v.rotte[0] ? 0 : 1] + '.';
        msg.textContent = chi + quanto; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        const pavimento = x => (L.tavolo && x + LAMPADA_W / 2 > L.tavolo[0] && x - LAMPADA_W / 2 < L.tavolo[1]) ? TAVOLO_Y : PAVIMENTO;
        /* stato del moto: pendolo (gancio H, lunghezza R, angolo th dalla verticale, omega) oppure caduta libera */
        let st;
        if (v.rotte[0] && v.rotte[1]) st = { libera: true, x: c.n.x, y: c.n.y, vx: 0, vy: 0 };
        else {
          const k = v.rotte[0] ? 1 : 0, H = k ? c.B : c.A, R = k ? c.n.L2 : c.n.L1;
          st = { libera: false, k, H, R, th: Math.atan2(c.n.x - H[0], H[1] - c.n.y), om: 0 };
        }
        caduta = { rotte: v.rotte.slice(), libera: st.libera, x: c.n.x, y: c.n.y };
        let tPrima = performance.now(), durata = 0;
        aggiornaParametri(); aggiornaLivelli(); aggiornaFormula();
        const passo = ora => {
          let dt = Math.min(0.05, (ora - tPrima) / 1000); tPrima = ora; durata += dt;
          const h = 0.002;
          for (let t = 0; t < dt; t += h) {
            if (!st.libera) {
              /* pendolo: th'' = −(g/R)·sin th, con un po' di attrito dell'aria; la fune tira P·(cos th + R·om²/g) */
              const acc = th => -(G / st.R) * Math.sin(th);
              const k1v = acc(st.th), k1x = st.om;
              const k2v = acc(st.th + k1x * h / 2), k2x = st.om + k1v * h / 2;
              const k3v = acc(st.th + k2x * h / 2), k3x = st.om + k2v * h / 2;
              const k4v = acc(st.th + k3x * h), k4x = st.om + k3v * h;
              st.th += (k1x + 2 * k2x + 2 * k3x + k4x) * h / 6;
              st.om += (k1v + 2 * k2v + 2 * k3v + k4v) * h / 6;
              st.om *= (1 - 0.35 * h);
              const T = m * (G * Math.cos(st.th) + st.R * st.om * st.om);
              caduta.x = st.H[0] + st.R * Math.sin(st.th); caduta.y = st.H[1] - st.R * Math.cos(st.th);
              if (arr1(T) > c.regge[st.k]) {   /* si spezza anche questa: da qui in poi è un lancio */
                caduta.rotte[st.k] = true; caduta.libera = true;
                msg.textContent += ' Nell\'oscillazione si spezza anche l\'altra.';
                st = { libera: true, x: caduta.x, y: caduta.y, vx: st.R * st.om * Math.cos(st.th), vy: st.R * st.om * Math.sin(st.th) };
              }
            } else {
              st.x += st.vx * h; st.vy -= G * h; st.y += st.vy * h;
              const fondo = pavimento(st.x) + LAMPADA_H;
              if (st.y <= fondo) { st.y = fondo; st.vx = 0; st.vy = 0; st.fermo = true; }
              caduta.x = st.x; caduta.y = st.y;
            }
          }
          disegnaScena();
          const fermo = st.libera ? st.fermo : (Math.abs(st.om) < 0.02 && Math.abs(st.th) < 0.005);
          if (!fermo && durata < 8) { raf = requestAnimationFrame(passo); return; }
          raf = 0;
          if (fase === 'anim') fineRottura();
        };
        raf = requestAnimationFrame(passo);
        /* i comandi tornano subito disponibili dopo il primo mezzo secondo: si può rifare senza aspettare che il pendolo si fermi */
        setTimeout(() => { if (fase === 'anim') fineRottura(); }, 700);
        erroreTipico(L, c, v, p0);
      }
      function fineRottura() {
        fase = 'rotto';
        aggiornaParametri(); aggiornaLivelli(); aggiornaFormula();
      }
      /* dopo una prova, qualunque ritocco rimette il lampadario «in mano» */
      function riprendi() {
        if (fase === 'tenuto') return;
        cancelAnimationFrame(raf); raf = 0;
        fase = 'tenuto'; esito = null; caduta = null;
      }

      function vinci(c) {
        finito = true;
        const t = esito.testo + (tentativi === 1 ? ' Al primo tentativo.' : ' Tentativi: ' + tentativi + '.');
        msg.innerHTML = '<span class="vinto">' + t + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiornaParametri();
        ctx.zenone(VITTORIE[livello](c), { espressione: tentativi === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici: Stilla ne parla una volta sola per livello */
      function dici(chiave, t) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(t, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, c, v, p0) {
        /* «metà peso a testa»: ha scelto una fune che reggerebbe P/2 ma non la tensione vera */
        if (L.scelte && v.tipo === 'rotta' && L.uguali && c.regge[0] >= c.P / 2) { dici('meta', 'Metà del peso a testa varrebbe con funi verticali: a 30° la parte verticale è solo metà della tensione.'); return; }
        if (L.scelte && v.tipo === 'rotta' && !L.uguali) {
          if (v.rotte[1] && c.regge[1] < c.regge[0]) dici('ripida', 'La fune più verticale regge la parte maggiore del peso: le parti orizzontali sono uguali, quelle verticali no.');
          return;
        }
        if (v.tipo === 'rotta' && !v.rotte[0] !== !v.rotte[1] && c.a1 !== c.a2) {
          const ripida = c.a1 > c.a2 ? 0 : 1;
          if (v.rotte[ripida]) { dici('ripida', 'Si è spezzata la fune più ripida: è lei che regge quasi tutto il peso.'); return; }
        }
        /* ha reso le funi più orizzontali dopo un tentativo e tirano di più */
        if (v.tipo === 'rotta' && p0 && c.a1 === c.a2 && p0.a1 === p0.a2 && c.a1 < p0.a1) { dici('piatte', 'Più la fune è orizzontale, più tira: la parte verticale deve restare metà del peso.'); return; }
        if (v.tipo === 'rotta' && Math.min(c.a1, c.a2) <= 8 && c.a1 === c.a2) { dici('orizzontale', 'Una fune tesa quasi orizzontale non regge quasi niente: per tenere il peso servirebbe una tensione enorme.'); return; }
        if (L.parete && v.tipo === 'rotta' && c.a2 <= 5) { dici('parete', 'Con la fune alla parete orizzontale, tutto il peso lo regge la fune al soffitto.'); return; }
        if (L.massa && v.tipo === 'rotta') dici('massa', '6\u00a0kg non sono 6\u00a0N: il peso è P = m·g, quasi dieci volte di più.');
      }

      /* ---------------- modalità libera: nessun obiettivo, le funi non si spezzano ---------------- */
      function osserva() {
        const c = conf();
        if (!c.n) return c.a1 + c.a2 <= 0 ? 'Due funi orizzontali non reggono niente: nessuna tensione ha una parte verticale.' : 'Le funi così non si incontrano.';
        if (c.a1 === 90 || c.a2 === 90) return 'Una fune verticale regge tutto il peso; l\'altra non tira.';
        const mx = Math.max(c.T1, c.T2);
        if (mx > c.P) return 'Qui una fune tira più dell\'intero peso: ' + num(mx, 1) + '\u00a0N contro ' + c.P + '\u00a0N.';
        if (c.a1 === c.a2) return 'Funi uguali: ognuna tira ' + num(c.T1, 1) + '\u00a0N, più di metà del peso.';
        return 'La fune più ripida tira di più: ' + num(c.a1 > c.a2 ? c.T1 : c.T2, 1) + '\u00a0N contro ' + num(c.a1 > c.a2 ? c.T2 : c.T1, 1) + '\u00a0N.';
      }
      function mostraLibero() {
        b.casuale.hidden = !libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (fase === 'anim') return;
        cancelAnimationFrame(raf); raf = 0;
        salvato = { livello, s: Object.assign({}, s), fase, tentativi, finito, esito, caduta, detti: Object.assign({}, detti), prec, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        if (fase === 'rotto') { salvato.fase = 'tenuto'; salvato.esito = null; salvato.caduta = null; }
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        s = { a1: 40, a2: 40, f1: 0, f2: 0, P: 40, D: 2 };
        fase = 'tenuto'; finito = false; esito = null; caduta = null;
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.textContent = osserva(); msg.className = 'lab-messaggio';
      }
      function esciLibero() {
        if (fase === 'anim') return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; s = z.s; fase = z.fase; tentativi = z.tentativi; finito = z.finito; esito = z.esito; caduta = z.caduta; detti = z.detti; prec = z.prec;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (!libero) return;
        const r = (lo, hi, st) => lo + Math.round(Math.random() * (hi - lo) / st) * st;
        s.P = r(20, 80, 5); s.D = Math.round(r(1, 3.2, 0.2) * 10) / 10; s.a1 = r(15, 75, 1); s.a2 = r(15, 75, 1);
        ridisegnaTutto(); aggiorna(); msg.textContent = osserva(); msg.className = 'lab-messaggio';
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        const L = liv();
        if (fase === 'anim' || finito || fisso(k)) return false;
        const lim = limiti(k), v = valore(k);
        const nuovo = morsa(Math.round((v + d * lim[2]) * 10) / 10, lim[0], lim[1]);
        if (nuovo === v) return false;
        if (k === 'a') { s.a1 = nuovo; s.a2 = nuovo; }
        else if (k === 'f') { s.f1 = nuovo; s.f2 = nuovo; }
        else s[k] = nuovo;
        dopoCambio();
        return true;
      }
      function dopoCambio() {
        riprendi();
        if (msg.classList.contains('no') || msg.classList.contains('ok')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (libero) { ridisegnaTutto(); msg.textContent = osserva(); }
        aggiorna(); aggiornaLivelli();
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bb = ev.target.closest('button[data-d]'); if (!bb || bb.disabled) return;
        ultimoGiu = Date.now();
        const k = bb.closest('.lab-param').dataset.p, d = +bb.dataset.d;
        if (!cambia(k, d)) return;
        if (k[0] === 'f') return;   /* le funi si scelgono una alla volta */
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bb = ev.target.closest('button[data-d]'); if (!bb || Date.now() - ultimoGiu < 600) return;
        cambia(bb.closest('.lab-param').dataset.p, +bb.dataset.d);
      });

      /* trascinare il lampadario: l'angolo di ogni fune è quello del dito visto dal suo gancio */
      let presa = false;
      function trascinaA(ev) {
        const L = liv();
        if (!libero && L.a) return;
        const mm = svg.getScreenCTM(); if (!mm) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const cc = pt.matrixTransform(mm.inverse());
        const fx = (cc.x - S.ox) / S.U, fy = (S.oy - cc.y) / S.U, c = conf();
        const ang = (H, verso) => { const dx = verso * (fx - H[0]), dy = H[1] - fy; return Math.round(morsa(Math.atan2(dy, dx) / RAD, 0, 90)); };
        let a1, a2;
        if (!libero && L.tipo === 'sim') {
          const mezza = (c.B[0] - c.A[0]) / 2;
          a1 = a2 = Math.round(morsa(Math.atan2(c.A[1] - fy, mezza) / RAD, 0, 90));
        } else {
          a1 = (fx - c.A[0]) <= 0 ? 90 : ang(c.A, 1); a2 = (c.B[0] - fx) <= 0 ? 90 : ang(c.B, -1);
          if (fy > c.A[1]) a1 = 0;
          if (fy > c.B[1]) a2 = 0;
        }
        if (a1 === 90 && a2 === 90) return;
        if (a1 === s.a1 && a2 === s.a2) return;
        s.a1 = a1; s.a2 = a2;
        dopoCambio();
      }
      svg.addEventListener('pointerdown', ev => {
        if (fase === 'anim' || finito) return;
        const L = liv(); if (!libero && L.a) return;
        presa = true; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        trascinaA(ev); ev.preventDefault();
      });
      const muovi = ev => { if (presa) { trascinaA(ev); ev.preventDefault(); } };
      const molla = () => { presa = false; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.appendi.addEventListener('click', appendi);
      b.ric.addEventListener('click', () => {
        if (fase === 'anim') return;
        if (libero) { s = { a1: 40, a2: 40, f1: 0, f2: 0, P: 40, D: 2 }; ridisegnaTutto(); aggiorna(); msg.textContent = osserva(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
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
        pl.addEventListener('click', () => { if (fase !== 'anim') avviaLivello(k); });
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
