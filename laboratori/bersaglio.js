/* Laboratorio «Il bersaglio» — precisione e accuratezza, errori casuali e sistematici (argomento incertezza).
   Ogni freccetta è una misura, il centro del bersaglio è il valore vero. Uno strumento ha un errore sistematico
   (tutte le freccette spostate dalla stessa parte) e un tremolio (errori casuali, a volte in più a volte in meno):
   posizione = mirino + errore sistematico + tremolio · (numero a caso con distribuzione normale), letta al millimetro.
   Si sposta il mirino (la taratura) trascinandolo nella scena o con − e +; si lancia; la scena mostra la media
   delle freccette (croce verde) e il rettangolo che le contiene tutte (metà della larghezza = semidispersione).
   Il caso viene da un seme: ogni livello ha i suoi semi, scelti con la prova dei livelli perché la mossa giusta
   vinca e quella sbagliata no (lab-bersaglio-semi.js). Modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-bersaglio .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; cursor: grab; }
    .lab-bersaglio .lab-scena > svg { width: 100%; height: 100%; }
    .lab-bersaglio svg text { font-family: var(--font); }
    .lab-bersaglio svg text, .lab-bersaglio svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-bersaglio .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-bersaglio .consegna > span { display: block; }
    .lab-bersaglio .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-bersaglio .consegna:empty { display: none; }
    .lab-bersaglio .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .7em; font-size: clamp(1rem, 2.3cqmin, 1.15rem); line-height: 1.25; height: calc(4.6 * clamp(1rem, 2.3cqmin, 1.15rem)); flex: none; }
    .lab-bersaglio .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-bersaglio .formula .ignoto { color: var(--testo3); }
    .lab-bersaglio .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-bersaglio .lab-messaggio { padding: 0 4px; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-bersaglio .formula { height: calc(6.6 * clamp(1rem, 2.3cqmin, 1.15rem)); } .lab-bersaglio .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-bersaglio .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-bersaglio .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 460px) { .lab-bersaglio .lab-barra { gap: 4px; flex-wrap: nowrap; } .lab-bersaglio .lab-barra .btn { padding-left: 9px; padding-right: 9px; } .lab-bersaglio .lab-barra .b-aiuto { min-width: 38px; } }   /* quattro pulsanti in una riga: il secondo pulsante di alcuni livelli non manda la barra a capo */
    .lab-bersaglio .btn[disabled] { opacity: .38; cursor: default; }
    .lab-bersaglio .lab-barra .btn[hidden] { display: none; }
    .lab-bersaglio .lab-parametri { max-width: 520px; }
    .lab-bersaglio.in-libero .lab-parametri { grid-template-columns: 1fr 1fr; }   /* i quattro parametri del Libero non stanno in una riga */
    .lab-bersaglio .lab-param[hidden], .lab-bersaglio .b-casuale[hidden] { display: none; }
    .lab-bersaglio .lab-parametri .b-casuale { justify-self: center; }
    .lab-bersaglio .lab-param .nome { min-width: 1.5em; white-space: nowrap; }
    .lab-bersaglio .lab-param output { min-width: 0; width: 3.5ch; flex: none; white-space: nowrap; }
    .lab-bersaglio .lab-param[data-p="n"] output { width: 2.1ch; }
    .lab-bersaglio .lab-param[data-p="sig"] output { width: 2.6ch; }
    .lab-bersaglio .lab-param .unita { font-size: .85rem; color: var(--testo2); margin-left: -2px; }
    /* il pannello stretto (telefono, o pannello di lato) stringe i parametri: è un contenitore a sé */
    .lab-bersaglio .lab-lato { container: lato / inline-size; }
    @container lato (max-width: 420px) {
      .lab-bersaglio .lab-parametri { column-gap: 6px; }
      .lab-bersaglio .lab-param { gap: 2px; }
      .lab-bersaglio .lab-param .nome { font-size: .8rem; min-width: 0; }
      .lab-bersaglio .lab-param .btn { min-width: 34px; padding: 0 4px; }
      .lab-bersaglio .lab-param output { font-size: .92rem; }
    }
    @container lab (max-width: 420px) { .lab-bersaglio .formula { font-size: 1rem; gap: 0 .6em; } }
    .lab-bersaglio .lab-param .scelta[aria-pressed="true"] { background: var(--accento); border-color: var(--accento); color: #fff; }
    .lab-bersaglio .lab-param .scelta { min-width: 46px; font-weight: 600; }
    .lab-bersaglio .vinto { display: inline-block; animation: lab-bersaglio-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-bersaglio-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-bersaglio .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .85rem; white-space: nowrap; pointer-events: none; background: var(--sup2); padding: 0 4px; border-radius: 6px; }
    .lab-bersaglio .formula .stretto { display: none; }
    @container lab (max-width: 420px) { .lab-bersaglio .formula .largo { display: none; } .lab-bersaglio .formula .stretto { display: inline-block; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (2 righe di parametri sotto la consegna nei livelli, 3 nel Libero, dove la consegna non c'è) */
    .lab-bersaglio .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(2 * var(--riga) + 1 * 6px); --pf: calc(3 * var(--riga) + 2 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-bersaglio .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-bersaglio .lab-lato .consegna:empty { display: none; }
    .lab-bersaglio .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-bersaglio .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- il caso (puro, senza disegno: lo usa anche la prova dei livelli) ---------------- */
  /* generatore a seme (mulberry32) e coppie di numeri normali (Box–Muller) */
  function rng(seme) {
    let a = seme >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normali(r) {
    let u = r(); if (u < 1e-12) u = 1e-12;
    const v = r(), m = Math.sqrt(-2 * Math.log(u));
    return [m * Math.cos(2 * Math.PI * v), m * Math.sin(2 * Math.PI * v)];
  }
  /* un flusso di tremolii per ogni strumento e per ogni uso: la freccetta k di uno strumento è sempre la stessa */
  const CANALE = { prova: 1, colpo: 2, verifica: 3 };
  const flusso = (seme, strumento, uso) => { const r = rng(seme * 7919 + strumento * 104729 + CANALE[uso] * 15485863); return () => normali(r); };
  const mm = v => Math.round(v * 10) / 10;   /* le freccette si leggono al millimetro: sensibilità 0,1 cm */
  /* dove cade una freccetta: mirino (taratura) + errore sistematico + tremolio */
  const freccetta = (S, tar, g) => [mm(tar[0] + S.sist[0] + S.sigma * g[0]), mm(tar[1] + S.sist[1] + S.sigma * g[1])];

  /* media e semidispersione di un elenco di freccette, asse per asse */
  function statistica(f) {
    const n = f.length;
    if (!n) return null;
    let sx = 0, sy = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    f.forEach(p => { sx += p[0]; sy += p[1]; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    return { n, somma: [sx, sy], media: [sx / n, sy / n], min: [x0, y0], max: [x1, y1], ea: [(x1 - x0) / 2, (y1 - y0) / 2] };
  }
  const distanza = (a, b) => Math.hypot(a[0] - (b ? b[0] : 0), a[1] - (b ? b[1] : 0));

  /* ---------------- livelli ----------------
     strumenti: sist = errore sistematico (cm), sigma = tremolio (cm). Le grandezze a caso vengono dal seme;
     i semi sono scelti dalla prova dei livelli (lab-bersaglio-semi.js), che controlla per ognuno che:
     L3 la media di 8 freccette o meno sia fuori di 0,75 cm, quella di 25-80 dentro 0,4 cm;
     L2/L4 il colpo dello strumento preciso cada a meno di 0,5 cm dal suo punto, quello del tremolante a più di 1,6 cm;
     L5 la media di 6 freccette o meno sia a più di 1 cm dal centro, quella di 20-80 a meno di 0,4 cm;
     L6 la media di 6 freccette o meno sbagli l'errore sistematico di più di 0,85 cm, quella di 20-80 di meno di 0,3 cm,
     e la media delle 100 freccette della verifica stia a meno di 0,1 cm dal suo valore atteso. */
  const dir = (r, m0, m1) => { const a = r() * 2 * Math.PI, m = m0 + (m1 - m0) * r(); return [Math.round(m * Math.cos(a) * 10) / 10, Math.round(m * Math.sin(a) * 10) / 10]; };
  const LIVELLI = [
    { consegna: 'Lo strumento tira sempre <b>da una parte</b>. Sposta il mirino e porta la media delle freccette entro <b>1&nbsp;cm</b> dal centro.',
      semi: [1, 2, 3, 4], tar: 'x', n: 5, tol: 1, obiettivo: 'media',
      caso: r => ({ strumenti: [{ nome: 'A', sist: [(r() < 0.5 ? -1 : 1) * Math.round((2.5 + r()) * 10) / 10, 0], sigma: 0.25 }] }) },
    { consegna: 'Una sola serie di prova, poi <b>un colpo solo</b>: deve finire entro <b>1&nbsp;cm</b> dal centro.',
      semi: [1001, 1005, 1006, 1007], tar: 'xy', n: 5, tol: 1, obiettivo: 'colpo', prove: 1,
      caso: r => ({ strumenti: [{ nome: 'A', sist: dir(r, 2.5, 3.5), sigma: 0.25 }] }) },
    { consegna: 'Questo strumento <b>tremola</b>. Porta la media delle freccette entro <b>0,5&nbsp;cm</b> dal centro.',
      semi: [2013, 2024, 2038, 2063], tar: 'xy', n: 5, scegliN: true, tol: 0.5, obiettivo: 'media',
      caso: () => ({ strumenti: [{ nome: 'B', sist: [0, 0], sigma: 1.8 }] }) },
    { consegna: 'Due strumenti, <b>A</b> e <b>B</b>. Prova quanto vuoi, poi <b>un colpo solo</b> entro <b>1&nbsp;cm</b> dal centro.',
      semi: [3003, 3004, 3005, 3006], tar: 'xy', n: 5, tol: 1, obiettivo: 'colpo', due: true,
      caso: r => { const pre = { sist: dir(r, 2.5, 3.5), sigma: 0.25 }, tre = { sist: [0, 0], sigma: 1.8 };
        return r() < 0.5 ? { strumenti: [Object.assign({ nome: 'A' }, pre), Object.assign({ nome: 'B' }, tre)], preciso: 0 } : { strumenti: [Object.assign({ nome: 'A' }, tre), Object.assign({ nome: 'B' }, pre)], preciso: 1 }; } },
    { consegna: 'Il centro è <b>nascosto</b>. Lancia, poi metti la bandierina sul centro: entro <b>0,6&nbsp;cm</b>.',
      semi: [4053, 4074, 4162, 4202], tar: '', n: 5, scegliN: true, tol: 0.6, obiettivo: 'nascosto',
      caso: r => { const c = dir(r, 1, 2.5); return { centro: c, strumenti: [{ nome: 'C', sist: c, sigma: 1.4 }] }; } },
    { consegna: 'Strumento <b>starato e tremolante</b>. Taralo: alla verifica, media entro <b>0,5&nbsp;cm</b>.',
      semi: [5090, 5211, 5237, 5304], tar: 'xy', n: 5, scegliN: true, tol: 0.5, obiettivo: 'verifica',
      caso: r => ({ strumenti: [{ nome: 'D', sist: dir(r, 1.5, 2.5), sigma: 1.2 }] }) }
  ];
  const caso = (L, seme) => { const c = L.caso(rng(seme)); c.seme = seme; return c; };
  const N_VERIFICA = 100, T_MAX = 5, VISTA = 8.2, RAGGIO = 6;

  /* il verdetto, puro: lo usano il gioco e la prova dei livelli */
  function verdettoMedia(L, st) { return !!st && distanza(st.media) < L.tol; }
  function verdettoColpo(L, p) { return distanza(p) < L.tol; }

  /* ---------------- testi ---------------- */
  const VITTORIE = [
    'Errore sistematico corretto: il mirino va spostato al contrario dell\'errore, e tutte le freccette lo seguono.',
    'Uno strumento preciso, una volta tarato, fa centro anche con un colpo solo.',
    'Gli errori casuali si compensano facendo la media di tante freccette. La semidispersione invece resta: è il tremolio.',
    'Il preciso, tarato, fa centro anche con un colpo solo; il tremolante no. Il tremolio non si tara: lo riduce solo la media di molti colpi.',
    'Senza vedere il centro, la stima migliore è la media di tante misure: è così che si misura davvero.',
    'Prima la media di tante freccette per trovare l\'errore sistematico, poi la taratura: ora lo strumento è accurato.'
  ];
  const AIUTO = 'Ogni freccetta è una misura, il centro del bersaglio è il valore vero. Le coordinate sono in centimetri dal centro, lette al millimetro. La croce verde è la media delle freccette della serie; il rettangolo tratteggiato le contiene tutte: metà della sua larghezza è la semidispersione eₐ in orizzontale, metà dell\'altezza quella in verticale. Il mirino (il cerchietto con la croce) è la taratura: trascinalo nella scena o regolalo con − e + (tieni premuto per andare veloce). Tutte le freccette che lanci dopo si spostano insieme a lui. Quando sposti il mirino comincia una serie nuova: quelle di prima restano sbiadite. Una misura con pochi errori casuali è precisa; senza errori sistematici è accurata.';
  const AIUTI = {
    1: ' Qui hai una sola serie di prova: guarda di quanto è spostata la media, in orizzontale e in verticale.',
    2: ' Un tremolio grande sposta ogni freccetta a caso, ma la media di molte freccette sta vicina al punto a cui lo strumento mira davvero. Con n scegli quante freccette lanciare ogni volta.',
    3: ' Con A e B tiri serie di prova quante ne vuoi; ognuno ha il suo mirino. Il colpo vale una volta sola, con lo strumento scelto.',
    4: ' Lo strumento non ha errore sistematico, ma tremola. Trascina nella scena per mettere la bandierina; «Scopri» mostra il centro.',
    5: ' «Verifica» lancia 100 freccette con il mirino com\'è: vale una volta sola. Prima di verificare, scopri di quanto e in che verso lo strumento sbaglia.'
  };
  const AIUTO_LIBERO = 'In modalità libera lo strumento lo costruisci tu: il tremolio (gli errori casuali, in cm) e l\'errore sistematico in orizzontale e in verticale. Con n scegli quante freccette lanciare ogni volta. Il mirino si trascina come nei livelli. Cambiando lo strumento o il mirino comincia una serie nuova. «Casuale» propone uno strumento a caso, «Ricomincia» toglie le freccette.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  const numS = (v, d) => (Math.round(v * Math.pow(10, d)) > 0 ? '+' : '') + num(v, d);   /* con il segno: +2,9 oppure −1,3 */
  function texNum(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); return s === '-0' || /^-0(\{,\}0+)?$/.test(s) ? s.slice(1) : s; }
  const texS = (v, d) => (Math.round(v * Math.pow(10, d)) > 0 ? '+' : '') + texNum(v, d);

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  QUANTO.registraLab({
    id: 'bersaglio',
    fisica: { rng, normali, flusso, freccetta, statistica, distanza, caso, LIVELLI, verdettoMedia, verdettoColpo, mm, N_VERIFICA },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-bersaglio')) { const s = document.createElement('style'); s.id = 'stile-lab-bersaglio'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-bersaglio');
      const parametro = (p, nome, etichetta) => `<div class="lab-param" data-p="${p}"><span class="nome">${nome}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${etichetta} meno">−</button><output></output>${p === 'n' ? '' : '<span class="unita">cm</span>'}<button type="button" class="btn piccolo" data-d="1" aria-label="${etichetta} più">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, lo strumento lo costruisci tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="s"><span class="nome">strum.</span><button type="button" class="btn piccolo scelta" data-s="0">A</button><button type="button" class="btn piccolo scelta" data-s="1">B</button></div>
              ${parametro('tx', '↔', 'mirino a destra')}
              ${parametro('ty', '↕', 'mirino in alto')}
              ${parametro('n', ctx.tex('n'), 'freccette per lancio')}
              ${parametro('sig', 'trem.', 'tremolio')}
              ${parametro('ex', 'err↔', 'errore sistematico orizzontale')}
              ${parametro('ey', 'err↕', 'errore sistematico verticale')}
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-lancia">Lancia</button>
              <button type="button" class="btn primario b-azione" hidden>Colpo</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { lancia: q('.b-lancia'), azione: q('.b-azione'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = {}; ['s', 'tx', 'ty', 'n', 'sig', 'ex', 'ey'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ---------------- */
      let livello = 0, tentativo = 0, C = null, sel = 0, nLancio = 5, prove = 0;
      let tar = [], gen = [], serie = [], vecchie = [];        /* per strumento: mirino, flusso di prova, serie attuale { chiave, f }, serie passate */
      let colpo = null, bandierina = null, scoperto = false, verificaF = null;
      let finito = false, perso = false, animando = false, raf = 0, detti = {};
      let libero = false, salvato = null, LS = null;          /* LS: lo strumento della modalità libera */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? { tar: 'xy', scegliN: true, obiettivo: 'libero' } : LIVELLI[livello];
      const strumento = i => libero ? LS : C.strumenti[i];
      const chiave = i => tar[i].join(';') + (libero ? '|' + LS.sist.join(';') + '|' + LS.sigma : '');
      const stAttuale = () => statistica(serie[sel] ? serie[sel].f : []);

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un bersaglio con le freccette lanciate, la loro media e il mirino', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gFrecce = el('g'), gStat = el('g'), gMirino = el('g'), gVolo = el('g');
      [gFondo, gFrecce, gStat, gMirino, gVolo].forEach(g => svg.appendChild(g));
      let S = { w: 300, h: 300, U: 15, cx: 150, cy: 150 };
      const PX = x => S.cx + x * S.U, PY = y => S.cy - y * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const U = Math.min(w, h) / (2 * VISTA);
        S = { w, h, U, cx: w / 2, cy: h / 2 };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const testo = (x, y, s, opz) => el('text', Object.assign({ x, y, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, opz || {}), s);
      const alone = { 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' };

      function anelli(g, c, conTolleranza) {
        for (let k = RAGGIO; k >= 1; k--) g.appendChild(el('circle', { cx: PX(c[0]), cy: PY(c[1]), r: k * S.U, fill: k % 2 ? 'var(--sup)' : 'var(--sup2)', stroke: 'var(--bordo2)', 'stroke-width': 1 }));
        g.appendChild(el('circle', { cx: PX(c[0]), cy: PY(c[1]), r: 0.5 * S.U, fill: 'var(--no)', opacity: .75 }));
        if (conTolleranza) g.appendChild(el('circle', { cx: PX(c[0]), cy: PY(c[1]), r: conTolleranza * S.U, fill: 'none', stroke: 'var(--ok)', 'stroke-width': 2.2, 'stroke-dasharray': '5 4' }));
      }
      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), xm = (S.w / 2) / S.U, ym = (S.h / 2) / S.U;
        /* la quadrettatura al centimetro, e i numeri ogni 2 cm sui bordi */
        for (let x = -Math.floor(xm); x <= xm; x++) gFondo.appendChild(el('line', { x1: PX(x), y1: 0, x2: PX(x), y2: S.h, stroke: 'var(--bordo)', 'stroke-width': x ? 1 : 1.6, opacity: x ? .45 : .8 }));
        for (let y = -Math.floor(ym); y <= ym; y++) gFondo.appendChild(el('line', { x1: 0, y1: PY(y), x2: S.w, y2: PY(y), stroke: 'var(--bordo)', 'stroke-width': y ? 1 : 1.6, opacity: y ? .45 : .8 }));
        if (L.obiettivo === 'nascosto' && !scoperto) {
          gFondo.appendChild(el('circle', { cx: PX(0), cy: PY(0), r: RAGGIO * S.U, fill: 'var(--sup)', opacity: .55, stroke: 'var(--bordo2)', 'stroke-width': 1.5 }));
          gFondo.appendChild(testo(PX(0), PY(-RAGGIO) - 8, 'centro nascosto', { 'text-anchor': 'middle', style: 'font: 600 13px var(--font)' }));
        } else if (L.obiettivo === 'nascosto') {
          anelli(gFondo, C.centro, L.tol);
        } else anelli(gFondo, [0, 0], libero ? 0 : L.tol);
        const pn = S.U >= 15 ? 2 : (S.U >= 7 ? 4 : 5);
        for (let x = -pn * Math.floor(xm / pn); x <= xm; x += pn) if (PX(x) > 30 && PX(x) < S.w - 34) gFondo.appendChild(testo(PX(x), S.h - 6, x ? numS(x, 0) : '0', Object.assign({ 'text-anchor': 'middle' }, alone)));
        for (let y = -pn * Math.floor(ym / pn); y <= ym; y += pn) if (y && PY(y) > 26 && PY(y) < S.h - 22) gFondo.appendChild(testo(4, PY(y) + 4, numS(y, 0), alone));
        gFondo.appendChild(testo(S.w - 6, S.h - 6, 'cm', Object.assign({ 'text-anchor': 'end' }, alone)));
      }

      /* una freccetta: un pallino (strumento A, o unico) o un rombo (strumento B) */
      function punta(g, p, forma, opz) {
        const x = PX(p[0]), y = PY(p[1]), r = (opz.r || 1) * morsa(0.14 * S.U, 3.2, 6.5);
        const a = { fill: opz.fill || 'var(--testo)', stroke: 'var(--sup)', 'stroke-width': 1.2, opacity: opz.op == null ? 1 : opz.op };
        if (forma === 1) g.appendChild(el('path', Object.assign({ d: `M${x} ${y - r * 1.3} L${x + r * 1.3} ${y} L${x} ${y + r * 1.3} L${x - r * 1.3} ${y} Z` }, a)));
        else g.appendChild(el('circle', Object.assign({ cx: x, cy: y, r }, a)));
      }
      const forma = i => (!libero && LIVELLI[livello].due) ? i : 0;
      function disegnaFreccette() {
        vuota(gFrecce);
        const n = libero ? 1 : C.strumenti.length;
        for (let i = 0; i < n; i++) {
          const altro = i !== sel;
          vecchie[i].forEach(s => s.f.forEach(p => punta(gFrecce, p, forma(i), { op: altro ? 0.12 : 0.22 })));
          serie[i].f.forEach(p => punta(gFrecce, p, forma(i), { op: altro ? 0.25 : 0.95 }));
        }
        if (verificaF) verificaF.forEach(p => punta(gFrecce, p, 0, { op: 0.4, r: 0.7, fill: 'var(--testo2)' }));
        if (colpo) {
          punta(gFrecce, colpo.p, forma(colpo.i), { r: 1.5, fill: colpo.ok ? 'var(--ok)' : 'var(--no)' });
          gFrecce.appendChild(el('circle', { cx: PX(colpo.p[0]), cy: PY(colpo.p[1]), r: morsa(0.14 * S.U, 3.2, 6.5) * 2.8, fill: 'none', stroke: colpo.ok ? 'var(--ok)' : 'var(--no)', 'stroke-width': 2 }));
        }
        disegnaStat();
      }
      /* la media (croce verde) e il rettangolo da x_min a x_max e da y_min a y_max (metà lati = semidispersione) */
      function disegnaStat() {
        vuota(gStat);
        const st = verificaF ? statistica(verificaF) : stAttuale();
        if (!st) return;
        if (st.n > 1 && (st.ea[0] > 0 || st.ea[1] > 0)) {
          const x0 = PX(st.min[0]) - 4, x1 = PX(st.max[0]) + 4, y0 = PY(st.max[1]) - 4, y1 = PY(st.min[1]) + 4;
          gStat.appendChild(el('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4', opacity: .85, rx: 3 }));
        }
        const mx = PX(st.media[0]), my = PY(st.media[1]), k = morsa(0.3 * S.U, 6, 10);
        gStat.appendChild(el('path', { d: `M${mx - k} ${my - k} L${mx + k} ${my + k} M${mx - k} ${my + k} L${mx + k} ${my - k}`, stroke: 'var(--sup)', 'stroke-width': 5.5, 'stroke-linecap': 'round', opacity: .8 }));
        gStat.appendChild(el('path', { d: `M${mx - k} ${my - k} L${mx + k} ${my + k} M${mx - k} ${my + k} L${mx + k} ${my - k}`, stroke: 'var(--s3)', 'stroke-width': 2.8, 'stroke-linecap': 'round' }));
        gStat.appendChild(testo(mx + k + 4, my - k + 2, 'media', Object.assign({ fill: 'var(--s3)', style: 'font: 700 13px var(--font)' }, alone)));
      }
      /* il mirino (la taratura dello strumento scelto) e, nel livello del centro nascosto, la bandierina */
      function disegnaMirino() {
        vuota(gMirino);
        const L = liv();
        if (L.tar) {
          const t = tar[sel], x = PX(t[0]), y = PY(t[1]), r = morsa(0.55 * S.U, 10, 15);
          gMirino.appendChild(el('circle', { cx: x, cy: y, r, fill: 'none', stroke: 'var(--sup)', 'stroke-width': 5 }));
          gMirino.appendChild(el('circle', { cx: x, cy: y, r, fill: 'none', stroke: 'var(--accento)', 'stroke-width': 2.2 }));
          gMirino.appendChild(el('path', { d: `M${x - r - 6} ${y} H${x - 3} M${x + 3} ${y} H${x + r + 6} M${x} ${y - r - 6} V${y - 3} M${x} ${y + 3} V${y + r + 6}`, stroke: 'var(--accento)', 'stroke-width': 1.8 }));
          gMirino.appendChild(testo(x, y + r + 19, 'mirino', Object.assign({ 'text-anchor': 'middle', fill: 'var(--accento-testo)', style: 'font: 600 12px var(--font)' }, alone)));
        }
        if (L.obiettivo === 'nascosto' && bandierina) {
          const x = PX(bandierina[0]), y = PY(bandierina[1]);
          if (scoperto) {
            gMirino.appendChild(el('line', { x1: x, y1: y, x2: PX(C.centro[0]), y2: PY(C.centro[1]), stroke: 'var(--testo)', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }));
            gMirino.appendChild(testo((x + PX(C.centro[0])) / 2 + 6, (y + PY(C.centro[1])) / 2 - 6, num(distanza(bandierina, C.centro), 1) + '\u00a0cm', Object.assign({ fill: 'var(--testo)', style: 'font: 700 13px var(--font)' }, alone)));
          }
          gMirino.appendChild(el('line', { x1: x, y1: y, x2: x, y2: y - 30, stroke: 'var(--testo)', 'stroke-width': 2 }));
          gMirino.appendChild(el('path', { d: `M${x} ${y - 30} l16 6 l-16 6 z`, fill: 'var(--accento)' }));
          gMirino.appendChild(el('circle', { cx: x, cy: y, r: 3, fill: 'var(--testo)' }));
          const sx = x > S.w - 110 ? x - 8 : x + 20;
          gMirino.appendChild(testo(sx, y - 14, '(' + numS(bandierina[0], 1) + '; ' + numS(bandierina[1], 1) + ')', Object.assign({ 'text-anchor': sx < x ? 'end' : 'start', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, alone)));
        }
      }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaFreccette(); disegnaMirino(); }

      /* ---------------- pannello ---------------- */
      const LIM = { tx: [-T_MAX, T_MAX, 0.1], ty: [-T_MAX, T_MAX, 0.1], n: [1, 20, 1], sig: [0, 3, 0.1], ex: [-4, 4, 0.1], ey: [-4, 4, 0.1] };
      function valore(k) {
        if (k === 'tx') return tar[sel][0]; if (k === 'ty') return tar[sel][1]; if (k === 'n') return nLancio;
        if (k === 'sig') return LS.sigma; if (k === 'ex') return LS.sist[0]; return LS.sist[1];
      }
      function aggiornaParametri() {
        const L = liv(), fermo = animando || finito;
        box.s.hidden = libero || !L.due;
        box.tx.hidden = !L.tar || libero; box.ty.hidden = L.tar !== 'xy' || libero;
        box.n.hidden = !L.scegliN;
        box.sig.hidden = box.ex.hidden = box.ey.hidden = !libero;
        b.casuale.hidden = !libero;
        ['tx', 'ty', 'n', 'sig', 'ex', 'ey'].forEach(k => {
          if (box[k].hidden) return;
          const v = valore(k), d = k === 'n' ? 0 : 1;
          box[k].querySelector('output').textContent = k === 'n' ? String(v) : (k === 'sig' ? num(v, 1) : numS(v, d));
          box[k].querySelectorAll('button').forEach(bt => { const s = +bt.dataset.d; bt.disabled = fermo || (s < 0 ? v <= LIM[k][0] + 1e-9 : v >= LIM[k][1] - 1e-9); });
        });
        box.s.querySelectorAll('.scelta').forEach(bt => { bt.setAttribute('aria-pressed', String(+bt.dataset.s === sel)); bt.disabled = fermo; });
      }
      /* il ponte con la teoria: media e semidispersione della serie, con i numeri */
      function aggiornaFormula() {
        const st = verificaF ? statistica(verificaF) : stAttuale(), pezzi = [];
        const cm = '\\,\\text{cm}';
        if (!st) {
          pezzi.push('<span class="pezzo largo">' + ctx.tex('\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}') + '</span>');
          pezzi.push('<span class="pezzo largo">' + ctx.tex('e_a = \\dfrac{x_{\\max} - x_{\\min}}{2}') + '</span>');
          pezzi.push('<span class="pezzo ignoto">' + ctx.tex('\\bar{x} = \\ ?') + '</span>');
        } else {
          /* sul telefono la semidispersione resta senza frazione (una riga sola); la media la tiene sempre */
          const minX = st.min[0] < 0 ? '(' + texNum(st.min[0], 1) + ')' : texNum(st.min[0], 1);
          pezzi.push('<span class="pezzo">' + ctx.tex('\\bar{x} = \\dfrac{' + texNum(st.somma[0], 1) + '}{' + st.n + '}' + cm + ' \\approx') + '<span class="esito">' + ctx.tex(texS(st.media[0], 2) + cm) + '</span></span>');
          pezzi.push('<span class="pezzo">' + ctx.tex('\\bar{y} \\approx ') + '<span class="esito">' + ctx.tex(texS(st.media[1], 2) + cm) + '</span></span>');
          pezzi.push('<span class="pezzo largo">' + ctx.tex('e_a = \\dfrac{' + texNum(st.max[0], 1) + ' - ' + minX + '}{2}' + cm + ' = ' + texNum(st.ea[0], 2) + cm) + '</span>');
          pezzi.push('<span class="pezzo largo">' + ctx.tex('\\text{in verticale } ' + texNum(st.ea[1], 2) + cm) + '</span>');
          pezzi.push('<span class="pezzo stretto">' + ctx.tex('e_a = ' + texNum(st.ea[0], 2) + cm + '\\ (x),\\ ' + texNum(st.ea[1], 2) + cm + '\\ (y)') + '</span>');
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
        b.libero.setAttribute('aria-pressed', String(libero));
        b.libero.disabled = animando;
      }
      function aggiornaBarra() {
        const L = liv();
        const azione = { colpo: 'Colpo', nascosto: 'Scopri', verifica: 'Verifica' }[L.obiettivo];
        b.azione.hidden = !azione || finito; if (azione) b.azione.textContent = azione;
        b.lancia.hidden = finito;   /* a livello chiuso resta solo «Prossimo livello» o «Riprova» */
        b.lancia.disabled = animando || finito || (L.prove && prove >= L.prove);
        b.azione.disabled = animando || finito || (L.obiettivo === 'nascosto' && !bandierina) || (L.obiettivo === 'colpo' && L.prove && prove < L.prove);
        b.ric.disabled = animando; b.casuale.disabled = animando;
      }
      function aggiornaConta() {
        if (verificaF) { contaEl.textContent = 'verifica: ' + verificaF.length + ' freccette'; return; }
        if (!libero && LIVELLI[livello].due) { contaEl.textContent = C.strumenti.map((s, i) => s.nome + ': ' + serie[i].f.length).join(' · '); return; }
        const n = serie[sel] ? serie[sel].f.length : 0;
        contaEl.textContent = 'freccette: ' + n + (!libero && LIVELLI[livello].prove ? ' (prova: ' + prove + ' di ' + LIVELLI[livello].prove + ')' : '');
      }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); aggiornaBarra(); aggiornaConta(); disegnaMirino(); }
      const scrivi = (t, cls) => { msg.textContent = t; msg.className = 'lab-messaggio' + (cls ? ' ' + cls : ''); };

      /* ---------------- livelli ---------------- */
      function preparaStrumenti(n) {
        tar = []; gen = []; serie = []; vecchie = [];
        for (let i = 0; i < n; i++) { tar.push([0, 0]); gen.push(flusso(libero ? LS.seme : C.seme, i, 'prova')); serie.push({ chiave: null, f: [] }); vecchie.push([]); }
      }
      function avviaLivello(n, t) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; radice.classList.remove('in-libero');
        livello = n; tentativo = t || 0;
        const L = LIVELLI[n];
        C = caso(L, L.semi[tentativo % L.semi.length]);
        preparaStrumenti(C.strumenti.length);
        sel = 0; nLancio = L.n; prove = 0; colpo = null; bandierina = null; scoperto = false; verificaF = null;
        finito = false; perso = false; detti = {};
        vuota(gVolo); aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        scrivi('');
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }

      /* ---------------- i lanci (animazione breve: le freccette arrivano una dopo l'altra in meno di 0,6 s) ---------------- */
      function anima(lista, forme, fine) {
        animando = true; aggiorna(); aggiornaLivelli();
        const passo = Math.min(80, 400 / lista.length), dur = 170, t0 = performance.now();
        const giro = ora => {
          const t = ora - t0; vuota(gVolo);
          let tutte = true;
          lista.forEach((p, j) => {
            const u = (t - j * passo) / dur; if (u < 1) tutte = false; if (u <= 0) return;
            const v = Math.min(1, u);
            punta(gVolo, p, forme, { r: (lista.length > 30 ? 0.7 : 1) * (1 + 2.2 * (1 - v)), op: 0.3 + 0.7 * v, fill: lista.length > 30 ? 'var(--testo2)' : null });
          });
          if (!tutte) { raf = requestAnimationFrame(giro); return; }
          raf = 0; vuota(gVolo); animando = false; fine();
        };
        raf = requestAnimationFrame(giro);
      }
      function lancia() {
        const L = liv();
        if (animando || finito || (L.prove && prove >= L.prove)) return;
        aiutoEl.hidden = true;
        const i = sel, S0 = strumento(i), k = L.scegliN ? nLancio : L.n;
        let nuova = false, prima = null;
        if (serie[i].chiave !== chiave(i)) {
          if (serie[i].f.length) { prima = statistica(serie[i].f); vecchie[i].push(serie[i]); if (vecchie[i].length > 3) vecchie[i].shift(); nuova = true; }
          serie[i] = { chiave: chiave(i), f: [] };
        }
        const arrivo = [];
        for (let j = 0; j < k; j++) arrivo.push(freccetta(S0, tar[i], gen[i]()));
        if (nuova) disegnaFreccette();
        anima(arrivo, forma(i), () => {
          const ripetuta = serie[i].f.length > 0;
          serie[i].f = serie[i].f.concat(arrivo); prove++;
          disegnaFreccette(); aggiorna(); aggiornaLivelli();
          dopoLancio(i, nuova, prima, ripetuta);
        });
      }

      /* ---------------- il verdetto e gli errori tipici ---------------- */
      function dici(chiaveFrase, testoFrase) {
        if (detti[chiaveFrase]) return; detti[chiaveFrase] = true;
        ctx.zenone(testoFrase, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function dopoLancio(i, nuova, prima, ripetuta) {
        const L = liv(), st = statistica(serie[i].f), d = distanza(st.media);
        if (libero) { scrivi(osserva(st)); return; }
        if (L.obiettivo === 'media') {
          if (verdettoMedia(L, st)) { vinci('Media a ' + num(d, 2) + '\u00a0cm dal centro, con ' + st.n + ' freccette.'); return; }
          scrivi('Media di ' + st.n + ' a ' + num(d, 2) + '\u00a0cm dal centro.', 'no');
          ctx.mascotte('sbagliato');
          if (nuova && prima && d > distanza(prima.media) + 0.5) { dici('verso', 'Il mirino va spostato al contrario dell\'errore: se le freccette cadono a destra, lo sposti a sinistra.'); return; }
          if (livello === 0 && ripetuta && !nuova) { dici('ripeti', 'Ripetere non toglie un errore sistematico: le freccette tornano sempre lì. Sposta il mirino.'); return; }
          if (livello === 2 && nuova) { dici('insegui', 'Freccette sparse da tutte e due le parti: sono errori casuali. Il mirino non li toglie: serve la media di tante.'); return; }
          if (livello === 2 && st.n >= 20 && !detti.ea) { detti.ea = true; msg.textContent += ' La semidispersione non cala: è il tremolio. La media invece si avvicina.'; }
          return;
        }
        if (L.obiettivo === 'colpo') {
          if (L.prove) scrivi('Serie di prova: media a ' + num(d, 2) + '\u00a0cm dal centro. Ora il colpo.');
          else scrivi('Strumento ' + C.strumenti[i].nome + ': media di ' + st.n + ' a ' + num(d, 2) + '\u00a0cm dal centro.');
          return;
        }
        if (L.obiettivo === 'nascosto') { scrivi('Media di ' + st.n + ': (' + numS(st.media[0], 2) + '; ' + numS(st.media[1], 2) + ') cm.' + (bandierina ? '' : ' Tocca la scena per la bandierina.')); return; }
        if (L.obiettivo === 'verifica') {
          scrivi('Media di ' + st.n + ' a ' + num(d, 2) + '\u00a0cm dal centro.');
          if (nuova && prima && d > distanza(prima.media) + 0.5) dici('verso', 'Il mirino va spostato al contrario dell\'errore: di quanto è spostata la media, ma dall\'altra parte.');
        }
      }
      function tiraColpo() {
        const L = liv();
        if (animando || finito || L.obiettivo !== 'colpo') return;
        aiutoEl.hidden = true;
        const i = sel, S0 = strumento(i), p = freccetta(S0, tar[i], flusso(C.seme, i, 'colpo')());
        anima([p], forma(i), () => {
          const ok = verdettoColpo(L, p), d = distanza(p);
          colpo = { p, i, ok };
          disegnaFreccette();
          if (ok) { vinci('Colpo a ' + num(d, 1) + '\u00a0cm dal centro.'); return; }
          perdi('Colpo a ' + num(d, 1) + '\u00a0cm dal centro.');
          const resto = distanza([S0.sist[0] + tar[i][0], S0.sist[1] + tar[i][1]]);
          if (S0.sigma > 1) dici('tremola', 'Lo strumento ' + S0.nome + ' tremola: un colpo solo cade dove capita nella sua nuvola, anche se la media è giusta.');
          else if (!tar[i][0] && !tar[i][1]) dici('starato', 'Questo strumento è preciso ma starato: prima del colpo va spostato il mirino.');
          else if (resto > L.tol) dici('verso', 'Il mirino va spostato di quanto è spostata la media, ma dall\'altra parte.');
        });
      }
      function scopri() {
        const L = liv();
        if (animando || finito || !bandierina) return;
        scoperto = true; aiutoEl.hidden = true;
        const d = distanza(bandierina, C.centro), st = stAttuale();
        disegnaFondo(); disegnaMirino();
        if (d < L.tol) { vinci('Bandierina a ' + num(d, 1) + '\u00a0cm dal centro.'); return; }
        perdi('Bandierina a ' + num(d, 1) + '\u00a0cm dal centro.');
        if (!st || st.n < 15) dici('poche', 'Con poche freccette la media trema ancora: più misure fai, più la media si avvicina al valore vero.');
        else {
          const mezzo = [(st.min[0] + st.max[0]) / 2, (st.min[1] + st.max[1]) / 2];
          if (distanza(bandierina, mezzo) < distanza(bandierina, st.media)) dici('mezzo', 'Il punto di mezzo fra le freccette più lontane non è la media: la stima migliore è la croce verde.');
          else if (distanza(bandierina, st.media) > 0.5) dici('media', 'La stima migliore del centro è la media delle freccette: la croce verde.');
        }
      }
      function verifica() {
        const L = liv();
        if (animando || finito || L.obiettivo !== 'verifica') return;
        aiutoEl.hidden = true;
        const S0 = strumento(0), g = flusso(C.seme, 0, 'verifica'), f = [];
        for (let j = 0; j < N_VERIFICA; j++) f.push(freccetta(S0, tar[0], g()));
        anima(f, 0, () => {
          verificaF = f;
          const st = statistica(f), d = distanza(st.media);
          disegnaFreccette(); aggiorna();
          if (d < L.tol) { vinci('Verifica: la media di 100 freccette è a ' + num(d, 2) + '\u00a0cm dal centro.'); return; }
          perdi('Verifica: la media di 100 freccette è a ' + num(d, 2) + '\u00a0cm dal centro.');
          const base = serie[0].chiave === chiave(0) ? vecchie[0][vecchie[0].length - 1] : serie[0];
          if (!tar[0][0] && !tar[0][1]) dici('starato', 'Il mirino è ancora al centro: l\'errore sistematico è rimasto tutto.');
          else if (!base || base.f.length < 15) dici('poche', 'Con poche freccette la media trema ancora: l\'errore sistematico va stimato con la media di tante.');
          else dici('verso', 'Il mirino va spostato di quanto è spostata la media, ma dall\'altra parte.');
        });
      }
      function vinci(t) {
        finito = true;
        msg.innerHTML = '<span class="vinto">' + t + '</span>'; msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiorna(); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello], { espressione: 'orgoglioso', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }
      function perdi(t) {
        finito = true; perso = true;
        scrivi(t + ' Riprova con un caso nuovo.', 'no'); ctx.mascotte('sbagliato');
        aggiorna(); aggiornaLivelli();
        b.ric.textContent = 'Riprova';
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva(st) {   /* solo osservazioni neutre */
        let t = 'Media a ' + num(distanza(st.media), 2) + '\u00a0cm dal centro; semidispersione ' + num(st.ea[0], 2) + '\u00a0cm e ' + num(st.ea[1], 2) + '\u00a0cm.';
        if (LS.sigma === 0) t += ' Senza tremolio cadono tutte nello stesso punto.';
        else if (!LS.sist[0] && !LS.sist[1] && !tar[0][0] && !tar[0][1] && st.n >= 30) t += ' Senza errore sistematico, con tante freccette la media sta vicino al centro.';
        return t;
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, tentativo, C, sel, nLancio, prove, tar, gen, serie, vecchie, colpo, bandierina, scoperto, verificaF, finito, perso, detti, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        LS = { nome: '', sist: [2, 1], sigma: 0.5, seme: 1 + Math.floor(Math.random() * 1e6) };
        preparaStrumenti(1);
        sel = 0; nLancio = 5; colpo = null; bandierina = null; scoperto = false; verificaF = null; finito = false; perso = false;
        consegnaEl.textContent = ''; scrivi(''); b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }
      function esciLibero() {   /* si torna al livello com'era */
        if (animando) return;
        const z = salvato; libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; tentativo = z.tentativo; C = z.C; sel = z.sel; nLancio = z.nLancio; prove = z.prove; tar = z.tar; gen = z.gen; serie = z.serie; vecchie = z.vecchie;
        colpo = z.colpo; bandierina = z.bandierina; scoperto = z.scoperto; verificaF = z.verificaF; finito = z.finito; perso = z.perso; detti = z.detti;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi) => Math.round((lo + Math.random() * (hi - lo)) * 10) / 10;
        LS.sigma = r(0, 2.5); LS.sist = [r(-3, 3), r(-3, 3)]; tar[0] = [0, 0];
        scrivi(''); disegnaFreccette(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        if (animando || finito) return false;
        const lim = LIM[k], v = valore(k), nuovo = morsa(Math.round((v + d * lim[2]) * 10) / 10, lim[0], lim[1]);
        if (Math.abs(nuovo - v) < 1e-9) return false;
        if (k === 'tx') tar[sel] = [nuovo, tar[sel][1]]; else if (k === 'ty') tar[sel] = [tar[sel][0], nuovo];
        else if (k === 'n') nLancio = nuovo; else if (k === 'sig') LS.sigma = nuovo; else if (k === 'ex') LS.sist = [nuovo, LS.sist[1]]; else LS.sist = [LS.sist[0], nuovo];
        if (msg.classList.contains('no') || libero) scrivi('');
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
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const sc = ev.target.closest('.scelta');
        if (sc) { if (!animando && !finito) { sel = +sc.dataset.s; scrivi(''); disegnaFreccette(); aggiorna(); } return; }
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* il dito nella scena: trascina il mirino (di quanto si muove il dito), oppure mette la bandierina dove tocca */
      let presa = null;
      function inCm(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        return [(c.x - S.cx) / S.U, (S.cy - c.y) / S.U];
      }
      function muoviDito(ev) {
        const c = inCm(ev); if (!c || !presa) return;
        const L = liv();
        if (presa.tipo === 'bandierina') {
          bandierina = [mm(morsa(c[0], -VISTA + 0.6, VISTA - 0.6)), mm(morsa(c[1], -VISTA + 0.6, VISTA - 0.6))];
        } else {
          const nx = mm(morsa(presa.tar[0] + c[0] - presa.da[0], -T_MAX, T_MAX));
          const ny = L.tar === 'xy' ? mm(morsa(presa.tar[1] + c[1] - presa.da[1], -T_MAX, T_MAX)) : tar[sel][1];
          if (nx === tar[sel][0] && ny === tar[sel][1]) return;
          tar[sel] = [nx, ny];
          if (msg.classList.contains('no') || libero) scrivi('');
        }
        aggiorna();
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        const L = liv(), c = inCm(ev); if (!c) return;
        if (L.obiettivo === 'nascosto') presa = { tipo: 'bandierina' };
        else if (L.tar) presa = { tipo: 'mirino', da: c, tar: tar[sel].slice() };
        else return;
        aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        muoviDito(ev); ev.preventDefault();
      });
      const muovi = ev => { if (presa) { muoviDito(ev); ev.preventDefault(); } };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.lancia.addEventListener('click', lancia);
      b.azione.addEventListener('click', () => { const o = liv().obiettivo; if (o === 'colpo') tiraColpo(); else if (o === 'nascosto') scopri(); else if (o === 'verifica') verifica(); });
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { preparaStrumenti(1); scrivi(''); disegnaFreccette(); aggiorna(); return; }
        if (finito && !perso) avviaLivello((livello + 1) % LIVELLI.length, 0);
        else avviaLivello(livello, tentativo + 1);
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
        pl.addEventListener('click', () => { if (!animando) avviaLivello(k, 0); });
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello, 0);
      let formaScena = '';
      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg].filter(Boolean);
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      const ro = new ResizeObserver(() => {
        fissi.forEach(stringi);
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === formaScena || r.width < 10) return;
        formaScena = nuova; ridisegnaTutto();
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
