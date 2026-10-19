/* Laboratorio «Il cannone» — moto del proiettile (argomento moti-piano).
   Si sceglie l'angolo α e la velocità di lancio v0 (trascinando la freccia azzurra nella scena, oppure con − e +),
   poi si spara: la palla segue la legge vera, x = v0x·t e y = h + v0y·t − ½·g·t², con g = 9,8 m/s², senza aria.
   Nessuna anteprima della traiettoria: restano solo le tracce dei colpi già sparati.
   La formula della teoria si riempie con i numeri scelti; il risultato compare solo dopo il colpo.
   Primo laboratorio di Quanto: è il modello per gli altri (contratto in SCHEMA-LAB.md, stile da Compasso\laboratori\bilancia.js). */
(function () {
  const STILE = `
    .lab-cannone .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; cursor: crosshair; }
    .lab-cannone .lab-scena > svg { width: 100%; height: 100%; }
    .lab-cannone svg text { font-family: var(--font); }
    .lab-cannone svg text, .lab-cannone svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-cannone .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-cannone .consegna > span { display: block; }
    .lab-cannone .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-cannone .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; height: calc(4.2 * clamp(1rem, 2.5cqmin, 1.2rem)); flex: none; }
    .lab-cannone .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-cannone .formula .ignoto { color: var(--testo3); }
    .lab-cannone .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-cannone .lab-messaggio { padding: 0 4px; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; display: flex; align-items: center; justify-content: center; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-cannone .formula { height: calc(6.2 * clamp(1rem, 2.5cqmin, 1.2rem)); } .lab-cannone .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-cannone .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-cannone .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-cannone .btn[disabled] { opacity: .38; cursor: default; }
    .lab-cannone .lab-parametri { max-width: 520px; }
    .lab-cannone .lab-parametri .b-casuale { justify-self: center; }   /* in modalità libera sta accanto ad h, nel posto vuoto */
    .lab-cannone .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-cannone .lab-param .nome { min-width: 1.6em; }
    .lab-cannone .lab-param output { min-width: 0; width: 3.2ch; flex: none; white-space: nowrap; }
    .lab-cannone .lab-param[data-p="v"] output { width: 6.9ch; }
    .lab-cannone .lab-param[data-p="h"] output { width: 4.2ch; }
    @container lab (max-width: 520px) { .lab-cannone .lab-parametri { grid-template-columns: auto auto; justify-content: space-evenly; column-gap: 6px; } .lab-cannone .lab-param { gap: 2px; } .lab-cannone .lab-param .nome { min-width: 0; } }
    .lab-cannone .lab-param .unita { font-size: .8rem; color: var(--testo2); min-width: 2.2em; }
    .lab-cannone .lab-param.fisso .btn { visibility: hidden; }
    .lab-cannone .lab-param.fisso output { color: var(--testo2); }
    .lab-cannone .lab-param[hidden] { display: none; }
    .lab-cannone .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-cannone .vinto { display: inline-block; animation: lab-cannone-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-cannone-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    /* sul telefono la forma simbolica della formula cede il posto a quella con i numeri */
    .lab-cannone .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-cannone .formula .simbolo { display: none; } .lab-cannone .formula .nome-stretto { display: inline; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 2 nel Libero, dove la consegna non c'è) */
    .lab-cannone .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(2 * var(--riga) + 1 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-cannone .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-cannone .lab-lato .consegna:empty { display: none; }
    .lab-cannone .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-cannone .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ---------------- */
  const G = 9.8, RAD = Math.PI / 180;
  const A_MIN = 0, A_MAX = 90, V_MIN = 1, V_MAX = 20, H_MAX = 20;

  function moto(p) {   /* p = { a: gradi, v: m/s, h: quota di partenza in m } */
    const vx = p.a >= 90 ? 0 : p.v * Math.cos(p.a * RAD);
    const vy = p.a <= 0 ? 0 : p.v * Math.sin(p.a * RAD);
    const h = p.h || 0;
    return { vx, vy, h, pos: t => [vx * t, h + vy * t - G * t * t / 2], vel: t => [vx, vy - G * t] };
  }
  /* quando torna a quota zero (la radice positiva di h + vy·t − ½·g·t² = 0) */
  const tTerra = m => (m.vy + Math.sqrt(m.vy * m.vy + 2 * G * m.h)) / G;

  /* gli ostacoli del livello come rettangoli nel piano (in metri) */
  function ostacoli(L) {
    const o = [];
    if (L.muro) o.push({ tipo: 'muro', x0: L.muro.x - 0.4, x1: L.muro.x + 0.4, y0: -1, y1: L.muro.alto });
    if (L.galleria) o.push({ tipo: 'galleria', x0: L.galleria.da, x1: L.galleria.a, y0: L.galleria.y, y1: 1e4 });
    if (L.torre) o.push({ tipo: 'torre', x0: L.torre.da, x1: L.torre.a, y0: -1, y1: L.torre.alto });
    return o;
  }

  /* il volo intero: dove e quando finisce, e perché */
  function simula(p, L) {
    const m = moto(p), tF = tTerra(m), ost = ostacoli(L || {});
    let fine = { tipo: 'terra', t: tF };
    const dentro = (r, t) => { const q = m.pos(t); return q[0] >= r.x0 && q[0] <= r.x1 && q[1] >= r.y0 && q[1] <= r.y1; };
    if (ost.length && tF > 0) {
      const dt = 0.002;
      for (let t = dt; t < tF + dt && fine.tipo === 'terra'; t += dt) {
        const tt = Math.min(t, tF);
        const r = ost.find(o => dentro(o, tt));
        if (!r) continue;
        let a = tt - dt, b = tt;
        for (let k = 0; k < 40; k++) { const c = (a + b) / 2; if (dentro(r, c)) b = c; else a = c; }
        const prima = m.pos(a);
        const lato = prima[1] > r.y1 ? 'sopra' : (prima[1] < r.y0 ? 'sotto' : 'fianco');
        fine = { tipo: r.tipo, t: b, lato };
        if (r.tipo === 'torre' && lato === 'sopra') {
          const xb = m.pos(b)[0];
          fine.tipo = (xb >= L.torre.buca[0] && xb <= L.torre.buca[1]) ? 'buca' : 'bordo';
        }
      }
    }
    const q = m.pos(fine.t);
    fine.x = q[0]; fine.y = fine.tipo === 'terra' ? 0 : q[1];
    fine.m = m;
    fine.tA = m.vy / G;                                  /* istante del punto più alto */
    fine.H = m.h + m.vy * m.vy / (2 * G);                /* quota del punto più alto */
    fine.apice = fine.tA > 0.02 && fine.tA < fine.t ? m.pos(fine.tA) : null;
    return fine;
  }

  /* il verdetto di un colpo in un livello: { ok, testo } (il testo dice solo che cosa è successo) */
  const TOL = 0.5;   /* bersagli larghi 1 m: vale se la palla cade a meno di 50 cm dal centro */
  function verdetto(L, f) {
    if (f.tipo === 'muro') return { ok: false, testo: 'Fermata dal muro.' };
    if (f.tipo === 'galleria') return { ok: false, testo: 'Ha sbattuto contro il soffitto della galleria.' };
    if (f.tipo === 'torre') return { ok: false, testo: 'Contro il fianco della torre, a ' + num(f.y, 1) + '\u00a0m d\'altezza.' };
    if (f.tipo === 'bordo') return { ok: false, testo: (f.x < L.torre.buca[0] ? 'Sul bordo della torre, corta di ' + num(L.torre.buca[0] - f.x, 1) : 'Sulla torre ma oltre la buca, di ' + num(f.x - L.torre.buca[1], 1)) + '\u00a0m.' };
    if (f.tipo === 'buca') return { ok: true, testo: 'Dentro la buca.' };
    if (L.torre) return { ok: false, testo: 'A terra a ' + num(f.x, 1) + '\u00a0m: non è arrivata in cima alla torre.' };
    if (L.fosso) {
      if (f.x >= L.fosso.a) return { ok: true, testo: 'Oltre il fosso, a ' + num(f.x, 1) + '\u00a0m.' };
      if (f.x >= L.fosso.da) return { ok: false, testo: 'Nel fosso, a ' + num(f.x, 1) + '\u00a0m: mancano ' + num(L.fosso.a - f.x, 1) + '\u00a0m.' };
      return { ok: false, testo: 'Caduta a ' + num(f.x, 1) + '\u00a0m, prima del fosso.' };
    }
    const xb = L.bersaglio.x, d = f.x - xb;
    if (Math.abs(d) <= TOL) return { ok: true, testo: 'Colpito: a ' + num(f.x, 1) + '\u00a0m.' };
    return { ok: false, testo: (d > 0 ? 'Lunga di ' : 'Corta di ') + num(Math.abs(d), 1) + '\u00a0m.' };
  }

  /* ---------------- livelli ----------------
     fisso: il parametro bloccato. Le soluzioni sono state contate con la prova dei livelli
     (α a passi di 1°, v0 a passi di 0,5 m/s): fra parentesi quelle possibili. */
  const LIVELLI = [
    { consegna: 'Il cannone è puntato a <b>45°</b>. Trova la velocità per colpire il bersaglio a <b>20&nbsp;m</b>.',
      fisso: 'a', inizio: { a: 45, v: 10 }, vista: [24, 6], bersaglio: { x: 20 }, formula: 'R' },               /* v0 = 14 */
    { consegna: 'Velocità bloccata a <b>15&nbsp;m/s</b>. Trova l\'angolo per il bersaglio a <b>18&nbsp;m</b>.',
      fisso: 'v', inizio: { a: 12, v: 15 }, vista: [24, 9], bersaglio: { x: 18 }, formula: 'R' },               /* 25°, 26°, 64°, 65° */
    { consegna: 'Con <b>12&nbsp;m/s</b> scavalca il fosso: la palla deve cadere oltre la riva, a <b>14,5&nbsp;m</b>.',
      fisso: 'v', inizio: { a: 70, v: 12 }, vista: [20, 7], fosso: { da: 6, a: 14.5 }, formula: 'R' },          /* da 41° a 49° */
    { consegna: 'Con <b>14&nbsp;m/s</b> colpisci il bersaglio a <b>16&nbsp;m</b> due volte, con due angoli diversi.',
      fisso: 'v', inizio: { a: 40, v: 14 }, vista: [22, 9], bersaglio: { x: 16 }, due: true, formula: 'R' },    /* 26° o 27°, e 63° o 64° */
    { consegna: 'Con <b>16&nbsp;m/s</b> colpisci il bersaglio a <b>20&nbsp;m</b>. C\'è un muro alto <b>6&nbsp;m</b> a 14\u00a0m.',
      fisso: 'v', inizio: { a: 30, v: 16 }, vista: [24, 11], bersaglio: { x: 20 }, muro: { x: 14, alto: 6 }, formula: 'R' },   /* solo 65° */
    { consegna: 'Dentro una galleria: il soffitto è a <b>5&nbsp;m</b>. Colpisci il bersaglio a <b>30&nbsp;m</b>.',
      inizio: { a: 45, v: 12 }, vista: [33, 7], bersaglio: { x: 30 }, galleria: { da: 3, a: 27, y: 5 }, formula: 'H' },   /* α da 24° a 33° */
    { consegna: 'Sparo orizzontale da <b>19,6&nbsp;m</b> d\'altezza: colpisci la boa a <b>24&nbsp;m</b>.',
      fisso: 'a', inizio: { a: 0, v: 6 }, h: 19.6, vista: [28, 21], bersaglio: { x: 24 }, boa: true, formula: 'scogliera' },   /* v0 = 12 */
    { consegna: 'Manda la palla nella buca in cima alla torre: la buca è a <b>x = 20&nbsp;m</b>, a <b>8&nbsp;m</b> d\'altezza.',
      inizio: { a: 45, v: 12 }, vista: [24, 11], torre: { da: 18.4, a: 22, alto: 8, buca: [19.4, 20.6] }, formula: 'torre' }
  ];
  const LIBERO = { consegna: '', vista: [20, 8], formula: 'libero' };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    p => 'A 45° il seno di 2α vale 1: R = v₀² / g, e 14² / 9,8 fa proprio 20\u00a0m.',
    p => 'Colpito a ' + p.a + '°. C\'è un altro angolo con lo stesso sin(2α): si vede al livello 4.',
    p => 'Oltre il fosso a ' + p.a + '°: la gittata massima si ha a 45°, dove sin(2α) vale 1.',
    p => 'Due angoli che sommati fanno circa 90°: seno e coseno si scambiano, e la gittata non cambia.',
    p => 'Il tiro alto scavalca il muro: stessa gittata del tiro basso, ma resta in aria molto di più.',
    p => 'Sotto un soffitto conta la parte verticale di v₀: angolo basso e più velocità, e si va lontano senza salire.',
    p => 'In volo 2\u00a0s, qualunque sia v₀: il tempo lo decide l\'altezza, la velocità solo dove cade.',
    p => 'Qui R = v₀²·sin(2α)/g non valeva: la buca non è alla quota di partenza. Servono le leggi orarie.'
  ];

  const AIUTO = 'Il cannone lancia la palla con velocità v₀ (la freccia azzurra) inclinata di α sull\'orizzontale. Per puntare trascina nella scena: la direzione della freccia è l\'angolo, la sua lunghezza è la velocità. Con − e + regoli di 1° e di 0,5\u00a0m/s (tieni premuto per andare veloce). Senza aria la palla segue la parabola x = v<sub>0x</sub>·t, y = v<sub>0y</sub>·t − ½·g·t², con g = 9,8\u00a0m/s². La formula sotto si riempie con i tuoi numeri: il risultato compare dopo il colpo. I bersagli sono larghi 1\u00a0m: vale se la palla cade a meno di 50\u00a0cm dal centro.';
  const AIUTI = {
    3: ' Per il secondo colpo non basta ritoccare l\'angolo di un grado: i due angoli devono differire di almeno 10°. Guarda la formula: dentro il seno c\'è 2α.',
    4: ' Il muro sta a 14\u00a0m ed è alto 6\u00a0m: la palla deve passare sopra.',
    5: ' Il punto più alto del volo è a H = v<sub>0y</sub>² / (2·g): dipende solo dalla parte verticale della velocità. Deve restare sotto i 5\u00a0m, e la palla deve comunque arrivare a 30\u00a0m.',
    6: ' Il cannone è in cima alla scogliera, alto 19,6\u00a0m sul mare, e spara in orizzontale: in verticale la palla cade come se fosse lasciata andare.',
    7: ' La buca è larga 1,2\u00a0m, da 19,4\u00a0m a 20,6\u00a0m, e la palla deve entrarci scendendo. Partenza e arrivo non sono alla stessa quota: la formula della gittata qui non serve.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da colpire. Scegli l\'angolo α, la velocità v₀ e la quota h da cui parte la palla, poi spara: le tracce restano, così puoi confrontare i tiri (per esempio due angoli che sommati fanno 90°). «Casuale» propone un tiro a caso, «Ricomincia» cancella le tracce.';

  /* ---------------- numeri ---------------- */
  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  function texV(v) { return texNum(v, 1); }   /* v₀ a passi di 0,5 m/s: sempre un decimale, 14{,}0 oppure 14{,}5 */
  function texQuad(v) { return '(' + texNum(v, 1) + ')^2'; }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  QUANTO.registraLab({
    id: 'cannone',
    fisica: { moto, simula, verdetto, LIVELLI },   /* per la prova dei livelli (node), non serve al sito */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-cannone')) { const s = document.createElement('style'); s.id = 'stile-lab-cannone'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-cannone');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun bersaglio, angolo, velocità e quota li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="a"><span class="nome">${ctx.tex('\\alpha')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="angolo più basso">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="angolo più alto">+</button></div>
              <div class="lab-param" data-p="v"><span class="nome">${ctx.tex('v_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="velocità più bassa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="velocità più alta">+</button></div>
              <div class="lab-param" data-p="h" hidden><span class="nome">${ctx.tex('h')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="partenza più in basso">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="partenza più in alto">+</button></div>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-fuoco">💥 Fuoco</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { fuoco: q('.b-fuoco'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { a: q('[data-p="a"]'), v: q('[data-p="v"]'), h: q('[data-p="h"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, p = { a: 45, v: 10, h: 0 }, colpi = 0, finito = false, animando = false, raf = 0;
      let tracce = [], ultimo = null;          /* ultimo = { p, f } dell'ultimo colpo (per la formula e per gli errori tipici) */
      let presi = [], detti = {}, mancatiDopo = 0;   /* livello 4: angoli già andati a segno; frasi di Stilla già dette */
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un cannone, il terreno con il bersaglio e la traiettoria della palla', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gTracce = el('g'), gCannone = el('g'), gFreccia = el('g'), gVolo = el('g'), gTesti = el('g');
      [gFondo, gTracce, gCannone, gFreccia, gVolo, gTesti].forEach(g => svg.appendChild(g));
      const orologio = el('text', { x: 56, y: 20, fill: 'var(--testo2)', style: 'font: 600 14px var(--font)' });
      svg.appendChild(orologio);

      /* geometria: S = { w, h, U (px per metro), ox, oy (dove sta il punto x = 0, y = 0), K (px per m/s della freccia) } */
      let S = { w: 0, h: 0, U: 10, ox: 40, oy: 100, K: 5 };
      const PX = x => S.ox + x * S.U, PY = y => S.oy - y * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const L = vistaCorrente();
        const sx = 46, dx = 16, su = 30, giu = 28;   /* margini: a sinistra il cannone, sotto il righello */
        const U = Math.min((w - sx - dx) / L[0], (h - su - giu) / L[1]);
        const larghezzaUsata = L[0] * U;
        const ox = sx + Math.max(0, Math.min(40, (w - sx - dx - larghezzaUsata) / 2));
        S = { w, h, U, ox, oy: h - giu, K: morsa(0.3 * Math.min(w, h), 70, 190) / V_MAX };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      /* in modalità libera la vista si allarga per contenere il tiro scelto e le tracce */
      function vistaCorrente() {
        const L = liv();
        if (!libero) return L.vista;
        let xm = 15, ym = Math.max(6, p.h + 2);
        const f = simula(p, LIBERO);
        xm = Math.max(xm, f.x * 1.05 + 1); ym = Math.max(ym, f.H * 1.08 + 1);
        tracce.forEach(t => { xm = Math.max(xm, t.f.x * 1.05 + 1); ym = Math.max(ym, t.f.H * 1.08 + 1); });
        return [Math.ceil(xm / 5) * 5, Math.ceil(ym / 2) * 2];
      }

      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), xFine = (S.w - S.ox) / S.U, yFine = S.oy / S.U;
        /* passo del righello: almeno 38 px fra due tacche */
        const passo = [1, 2, 5, 10, 20].find(s => s * S.U >= 38) || 20;
        for (let x = passo; x < xFine; x += passo) gFondo.appendChild(el('line', { x1: PX(x), y1: PY(0), x2: PX(x), y2: 0, stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .55 }));
        for (let y = passo; y < yFine; y += passo) {
          gFondo.appendChild(el('line', { x1: 0, y1: PY(y), x2: S.w, y2: PY(y), stroke: 'var(--bordo)', 'stroke-width': 1, opacity: .55 }));
          if (PY(y) > 20) gFondo.appendChild(el('text', { x: 4, y: PY(y) - 4, fill: 'var(--testo2)', style: 'font: 12px var(--font)', opacity: .85 }, y + '\u00a0m'));
        }
        /* il terreno (o il mare, sotto la scogliera) */
        if (L.h) {
          gFondo.appendChild(el('rect', { x: 0, y: PY(0), width: S.w, height: S.h - PY(0), fill: 'var(--s1)', opacity: .22 }));
          gFondo.appendChild(el('path', { d: 'M0 ' + PY(0) + ' ' + Array.from({ length: Math.floor(S.w / 16) }, (_, i) => 'q4 -3 8 0 t8 0').join(' '), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 1.5, opacity: .6 }));
          gFondo.appendChild(el('path', { d: `M0 ${PY(L.h)} H${S.ox + 4} L${S.ox + 10} ${PY(L.h * 0.6)} L${S.ox + 2} ${PY(L.h * 0.3)} L${S.ox + 8} ${S.h} H0 Z`, fill: '#8a6a45', opacity: .55 }));
        } else {
          gFondo.appendChild(el('rect', { x: 0, y: PY(0), width: S.w, height: S.h - PY(0), fill: '#b5813f', opacity: .38 }));
          gFondo.appendChild(el('line', { x1: 0, y1: PY(0), x2: S.w, y2: PY(0), stroke: 'var(--testo)', 'stroke-width': 2, opacity: .55 }));
        }
        for (let x = 0; PX(x) < S.w - 26; x += passo) {   /* l'ultima tacca non deve finire sopra la «m» */
          gFondo.appendChild(el('line', { x1: PX(x), y1: PY(0), x2: PX(x), y2: PY(0) + 5, stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .6 }));
          gFondo.appendChild(el('text', { x: PX(x), y: PY(0) + 19, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 13px var(--font)' }, x === 0 ? '0' : String(x)));
        }
        gFondo.appendChild(el('text', { x: S.w - 6, y: PY(0) + 19, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)', opacity: .85 }, 'm'));
        /* lo scenario del livello */
        if (L.fosso) {
          const x0 = PX(L.fosso.da), x1 = PX(L.fosso.a);
          gFondo.appendChild(el('path', { d: `M${x0} ${PY(0)} L${x0 + 6} ${PY(0) + 18} H${x1 - 6} L${x1} ${PY(0)} Z`, fill: 'var(--sup)', opacity: 1 }));
          gFondo.appendChild(el('path', { d: `M${x0 + 3} ${PY(0) + 7} H${x1 - 3} L${x1 - 6} ${PY(0) + 18} H${x0 + 6} Z`, fill: 'var(--s1)', opacity: .45 }));
          gFondo.appendChild(el('text', { x: (x0 + x1) / 2, y: PY(0) - 8, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 13px var(--font)' }, 'fosso'));
          bandierina(L.fosso.a, num(L.fosso.a, 1) + '\u00a0m', 'var(--ok)');
        }
        if (L.muro) {
          const x0 = PX(L.muro.x - 0.4), x1 = PX(L.muro.x + 0.4), yt = PY(L.muro.alto);
          gFondo.appendChild(el('rect', { x: x0, y: yt, width: x1 - x0, height: PY(0) - yt, fill: '#b4553a', opacity: .85, rx: 2 }));
          for (let y = 0.5; y < L.muro.alto; y += 0.5) gFondo.appendChild(el('line', { x1: x0, y1: PY(y), x2: x1, y2: PY(y), stroke: 'var(--sup)', 'stroke-width': 1, opacity: .5 }));
          gFondo.appendChild(el('text', { x: (x0 + x1) / 2, y: yt - 7, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, L.muro.alto + '\u00a0m'));
        }
        if (L.galleria) {
          const x0 = PX(L.galleria.da), x1 = PX(L.galleria.a), yb = PY(L.galleria.y);
          gFondo.appendChild(el('path', { d: `M${x0} 0 V${yb} H${x1} V0 Z`, fill: 'var(--testo2)', opacity: .32 }));
          gFondo.appendChild(el('line', { x1: x0, y1: yb, x2: x1, y2: yb, stroke: 'var(--testo)', 'stroke-width': 2, opacity: .6 }));
          gFondo.appendChild(el('text', { x: x1 - 8, y: yb - 8, 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, 'soffitto a ' + L.galleria.y + '\u00a0m'));
        }
        if (L.torre) {
          const t = L.torre, x0 = PX(t.da), x1 = PX(t.a), yt = PY(t.alto), b0 = PX(t.buca[0]), b1 = PX(t.buca[1]);
          gFondo.appendChild(el('rect', { x: x0, y: yt, width: x1 - x0, height: PY(0) - yt, fill: 'var(--testo2)', opacity: .45 }));
          const fondoBuca = Math.min(26, (PY(0) - yt) * 0.4);
          gFondo.appendChild(el('rect', { x: b0, y: yt, width: b1 - b0, height: fondoBuca, fill: '#0b1416', opacity: .78 }));   /* un buco è scuro in tutti e due i temi */
          gFondo.appendChild(el('line', { x1: x0, y1: yt, x2: b0, y2: yt, stroke: 'var(--testo)', 'stroke-width': 2.5, opacity: .7 }));
          gFondo.appendChild(el('line', { x1: b1, y1: yt, x2: x1, y2: yt, stroke: 'var(--testo)', 'stroke-width': 2.5, opacity: .7 }));
          /* le coordinate della buca dentro la torre, sotto il buco: sopra c'è già l'etichetta del punto più alto */
          gFondo.appendChild(el('text', { x: (x0 + x1) / 2, y: yt + fondoBuca + 16, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 12px var(--font)' }, '(20; 8)'));
        }
        if (L.bersaglio) {
          const xb = L.bersaglio.x, x0 = PX(xb - TOL), x1 = PX(xb + TOL);
          if (L.boa) {
            const cx = PX(xb), y0 = PY(0);
            gFondo.appendChild(el('path', { d: `M${x0} ${y0 - 2} H${x1} L${x1 - 3} ${y0 + 7} H${x0 + 3} Z`, fill: 'var(--no)', opacity: .85 }));
            gFondo.appendChild(el('line', { x1: cx, y1: y0 - 2, x2: cx, y2: y0 - 26, stroke: 'var(--testo)', 'stroke-width': 2 }));
            gFondo.appendChild(el('path', { d: `M${cx} ${y0 - 26} l14 5 l-14 5 z`, fill: 'var(--no)' }));
          } else {
            gFondo.appendChild(el('rect', { x: x0, y: PY(0) - 3, width: Math.max(4, x1 - x0), height: 6, rx: 2, fill: 'var(--no)', opacity: .8 }));
            bandierina(xb, '', 'var(--no)');
          }
          gFondo.appendChild(el('text', { x: PX(xb), y: PY(0) - 34, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, num(xb, 0) + '\u00a0m'));
          if (L.due && presi.length) gFondo.appendChild(el('text', { x: PX(xb), y: PY(0) - 50, 'text-anchor': 'middle', fill: 'var(--ok)', style: 'font: 600 13px var(--font)' }, '✓ ' + presi[0] + '°'));
        }
      }
      function bandierina(x, testo, colore) {
        const cx = PX(x), y0 = PY(0);
        gFondo.appendChild(el('line', { x1: cx, y1: y0, x2: cx, y2: y0 - 26, stroke: 'var(--testo)', 'stroke-width': 2 }));
        gFondo.appendChild(el('path', { d: `M${cx} ${y0 - 26} l14 5 l-14 5 z`, fill: colore }));
        if (testo) gFondo.appendChild(el('text', { x: cx + 4, y: y0 - 32, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, testo));
      }

      /* il cannone e la freccia della velocità di lancio (azzurra: è una velocità) */
      function disegnaCannone() {
        vuota(gCannone); vuota(gFreccia);
        const L = liv(), x0 = PX(0), y0 = PY(p.h || 0);
        const canna = el('g', { transform: 'translate(' + x0 + ',' + y0 + ') rotate(' + (-p.a) + ')' });
        canna.appendChild(el('rect', { x: -6, y: -7, width: 36, height: 14, rx: 6, fill: 'var(--testo)', opacity: .85 }));
        canna.appendChild(el('rect', { x: 26, y: -8.5, width: 7, height: 17, rx: 2, fill: 'var(--testo)' }));
        gCannone.appendChild(canna);
        gCannone.appendChild(el('path', { d: `M${x0 - 16} ${y0 + 1} L${x0} ${y0 - 6} L${x0 + 16} ${y0 + 1} Z`, fill: 'var(--testo2)' }));
        gCannone.appendChild(el('circle', { cx: x0, cy: y0, r: 4.5, fill: 'var(--sup)', stroke: 'var(--testo)', 'stroke-width': 2 }));
        /* freccia v0 e componenti */
        const m = moto(p), lx = m.vx * S.K, ly = m.vy * S.K;
        if (m.vy > 0.05 && m.vx > 0.05) {
          gFreccia.appendChild(el('line', { x1: x0, y1: y0, x2: x0 + lx, y2: y0, stroke: 'var(--s1)', 'stroke-width': 1.6, 'stroke-dasharray': '5 4', opacity: .75 }));
          gFreccia.appendChild(el('line', { x1: x0 + lx, y1: y0, x2: x0 + lx, y2: y0 - ly, stroke: 'var(--s1)', 'stroke-width': 1.6, 'stroke-dasharray': '5 4', opacity: .75 }));
        }
        freccia(gFreccia, x0, y0, x0 + lx, y0 - ly, 'var(--s1)', 3.2);
        /* l'arco dell'angolo */
        if (p.a > 0 && p.a < 90) {
          const r = 26, ax = x0 + r * Math.cos(p.a * RAD), ay = y0 - r * Math.sin(p.a * RAD);
          gFreccia.appendChild(el('path', { d: `M${x0 + r} ${y0} A${r} ${r} 0 0 0 ${ax} ${ay}`, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 1.4 }));
        }
        const tx = x0 + lx + (p.a > 60 ? 10 : 6), ty = y0 - ly - 8;
        const etichetta = el('text', { x: tx, y: Math.max(16, ty), fill: 'var(--s1)', style: 'font: 700 14px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
        etichetta.appendChild(document.createTextNode('v'));
        const pedice = el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 11px' }, '0'); etichetta.appendChild(pedice);
        etichetta.appendChild(el('tspan', {}, ' ' + num(p.v, 1) + '\u00a0m/s'));
        gFreccia.appendChild(etichetta);
        gFreccia.appendChild(el('text', { x: x0 + 32, y: y0 - 6, fill: 'var(--testo2)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, p.a + '°'));
        if (L.h) gFreccia.appendChild(el('text', { x: 5, y: y0 + 20, fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, num(L.h, 1) + '\u00a0m'));
      }
      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(11, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }

      /* le tracce dei colpi già sparati: l'ultima piena, le altre sbiadite (al massimo quattro) */
      function disegnaTracce() {
        vuota(gTracce);
        tracce.forEach((t, i) => {
          const recente = i === tracce.length - 1, op = recente ? 0.9 : 0.25 + 0.12 * i;
          const passi = 70; let d = '';
          for (let k = 0; k <= passi; k++) { const pos = t.f.m.pos(t.f.t * k / passi); d += (k ? 'L' : 'M') + PX(pos[0]).toFixed(1) + ' ' + PY(pos[1]).toFixed(1) + ' '; }
          gTracce.appendChild(el('path', { d, fill: 'none', stroke: 'var(--testo2)', 'stroke-width': recente ? 2.4 : 1.6, 'stroke-dasharray': recente ? 'none' : '6 5', opacity: op }));
          gTracce.appendChild(el('circle', { cx: PX(t.f.x), cy: PY(t.f.y), r: recente ? 5 : 3.5, fill: t.f.tipo === 'terra' || t.f.tipo === 'buca' ? 'var(--s3)' : 'var(--no)', opacity: recente ? 1 : 0.6 }));
          if (recente) {
            if (t.f.apice) {
              gTracce.appendChild(el('circle', { cx: PX(t.f.apice[0]), cy: PY(t.f.apice[1]), r: 3.5, fill: 'var(--testo2)' }));
              gTracce.appendChild(el('text', { x: PX(t.f.apice[0]), y: Math.max(14, PY(t.f.apice[1]) - 9), 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'H ' + num(t.f.H, 1) + '\u00a0m'));
            }
            if (t.f.tipo === 'terra') {
              const xl = morsa(PX(t.f.x), 30, S.w - 30);
              gTracce.appendChild(el('text', { x: xl, y: PY(0) - 10, 'text-anchor': 'middle', fill: 'var(--s3)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, (PX(t.f.x) > S.w - 4 ? '→ ' : '') + num(t.f.x, 1) + '\u00a0m'));
            }
          }
        });
      }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaTracce(); disegnaCannone(); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const L = liv();
        box.a.querySelector('output').textContent = p.a + '°';
        box.v.querySelector('output').textContent = num(p.v, 1) + '\u00a0m/s';
        box.h.querySelector('output').textContent = p.h + '\u00a0m';
        box.a.classList.toggle('fisso', !libero && L.fisso === 'a');
        box.v.classList.toggle('fisso', !libero && L.fisso === 'v');
        box.h.hidden = !libero;
        const lim = { a: [A_MIN, A_MAX], v: [V_MIN, V_MAX], h: [0, H_MAX] };
        ['a', 'v', 'h'].forEach(k => box[k].querySelectorAll('button').forEach(bt => {
          const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? p[k] <= lim[k][0] : p[k] >= lim[k][1]);
        }));
        box.a.title = box.a.classList.contains('fisso') ? 'Angolo fisso in questo livello' : '';
        box.v.title = box.v.classList.contains('fisso') ? 'Velocità fissa in questo livello' : '';
      }
      /* il ponte con la teoria: la formula con i numeri scelti; il risultato solo dopo il colpo (in modalità libera subito) */
      function aggiornaFormula() {
        const L = liv(), m = moto(p);
        const fatto = libero || (ultimo && ultimo.p.a === p.a && ultimo.p.v === p.v && ultimo.p.h === p.h);
        const pezzi = [];
        /* la forma con i numeri: il nome davanti («R =») si vede solo quando la forma simbolica è nascosta (telefono) */
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = (s) => fatto ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        let tipo = L.formula;
        if (tipo === 'libero') tipo = p.h ? 'quota' : 'R';
        if (tipo === 'R') {
          const R = p.v * p.v * Math.sin(2 * p.a * RAD) / G;
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('R = \\dfrac{v_0^2 \\cdot \\sin(2\\alpha)}{g}') + '</span>');
          pezzi.push(numerico('R = \\dfrac{' + texQuad(p.v) + ' \\cdot \\sin ' + (2 * p.a) + '^\\circ}{9{,}8}\\,\\text{m}'));
          pezzi.push(ris('\\approx ' + texNum(Math.abs(R) < 0.05 ? 0 : R, 1) + '\\,\\text{m}'));
        } else if (tipo === 'H') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('H = \\dfrac{v_{0y}^2}{2 \\cdot g}') + '</span>');
          pezzi.push(numerico('H = \\dfrac{(' + texV(p.v) + ' \\cdot \\sin ' + p.a + '^\\circ)^2}{2 \\cdot 9{,}8}\\,\\text{m}'));
          pezzi.push(ris('\\approx ' + texNum(m.vy * m.vy / (2 * G), 1) + '\\,\\text{m}'));
        } else if (tipo === 'scogliera') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('x = v_0 \\cdot \\sqrt{\\dfrac{2 \\cdot h}{g}}') + '</span>');
          pezzi.push(numerico('x = ' + texV(p.v) + ' \\cdot \\sqrt{\\dfrac{2 \\cdot 19{,}6}{9{,}8}}\\,\\text{m}'));
          pezzi.push(ris('\\approx ' + texNum(p.v * Math.sqrt(2 * 19.6 / G), 1) + '\\,\\text{m}'));
        } else if (tipo === 'torre') {
          pezzi.push('<span class="pezzo">' + ctx.tex('y = v_{0y} \\cdot t - \\tfrac{1}{2} \\cdot g \\cdot t^2') + '</span>');
          pezzi.push('<span class="pezzo">con ' + ctx.tex('t = \\dfrac{x}{v_{0x}}') + '</span>');
          if (m.vx > 0.01) { const t20 = 20 / m.vx, y20 = m.pos(t20)[1]; pezzi.push(fatto ? ris('y(20\\,\\text{m}) \\approx ' + texNum(y20, 1) + '\\,\\text{m}') : '<span class="pezzo ignoto">' + ctx.tex('y(20\\,\\text{m}) = \\ ?') + '</span>'); }
        } else if (tipo === 'quota') {
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('y = h + v_{0y} \\cdot t - \\tfrac{1}{2} \\cdot g \\cdot t^2') + '</span>');
          pezzi.push(numerico('y = ' + p.h + (m.vy > 0.005 ? ' + ' + texNum(m.vy, 1) + ' \\cdot t' : '') + ' - 4{,}9 \\cdot t^2'));
          const f = simula(p, LIBERO);
          pezzi.push(ris('t_v \\approx ' + texNum(f.t, 2) + '\\,\\text{s}'));
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
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'colpi: ' + colpi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaCannone(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        p = { a: L.inizio.a, v: L.inizio.v, h: L.h || 0 };
        colpi = 0; finito = false; tracce = []; ultimo = null; presi = []; detti = {}; mancatiDopo = 0;
        vuota(gVolo); orologio.textContent = ''; aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.fuoco.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- il colpo ---------------- */
      function fuoco() {
        if (animando || finito) return;
        const L = liv(), f = simula(p, L);
        aiutoEl.hidden = true;
        if (f.t <= 1e-6) {   /* α = 0 da terra: la palla non si alza nemmeno */
          msg.textContent = 'Con α = 0° da terra la palla non si stacca: tocca subito il suolo.'; msg.className = 'lab-messaggio';
          return;
        }
        if (!libero) colpi++;
        aggiornaConta();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.fuoco.disabled = true; b.ric.disabled = true; b.casuale.disabled = true;
        aggiornaParametri(); aggiornaLivelli();
        /* tempo vero; solo i voli più lunghi di 2,4 s scorrono più in fretta (e l'orologio lo dice) */
        const fattore = Math.max(1, f.t / 2.4), t0 = performance.now();
        const pista = el('path', { fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2.4, opacity: .9 });
        vuota(gVolo); gVolo.appendChild(pista);
        const palla = el('circle', { r: 6.5, fill: 'var(--testo)', stroke: 'var(--sup)', 'stroke-width': 1.5 });
        const gV = el('g');
        gVolo.appendChild(gV); gVolo.appendChild(palla);
        let d = '';
        const passo = ora => {
          const t = Math.min(f.t, (ora - t0) / 1000 * fattore);
          const pos = f.m.pos(t), vel = f.m.vel(t);
          d += (d ? 'L' : 'M') + PX(pos[0]).toFixed(1) + ' ' + PY(pos[1]).toFixed(1) + ' ';
          pista.setAttribute('d', d);
          const cx = PX(pos[0]), cy = PY(Math.max(pos[1], f.tipo === 'terra' ? 0 : pos[1]));
          palla.setAttribute('cx', cx); palla.setAttribute('cy', cy);
          /* la velocità durante il volo: la parte orizzontale non cambia, quella verticale sì */
          vuota(gV);
          if (t < f.t) {
            gV.appendChild(el('line', { x1: cx, y1: cy, x2: cx + vel[0] * S.K, y2: cy, stroke: 'var(--s1)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: .8 }));
            gV.appendChild(el('line', { x1: cx + vel[0] * S.K, y1: cy, x2: cx + vel[0] * S.K, y2: cy - vel[1] * S.K, stroke: 'var(--s1)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: .8 }));
            freccia(gV, cx, cy, cx + vel[0] * S.K, cy - vel[1] * S.K, 'var(--s1)', 2.6);
          }
          orologio.textContent = 't = ' + num(t, 2) + '\u00a0s' + (fattore > 1.05 ? '   (×' + num(fattore, 1) + ')' : '');
          if (t < f.t) { raf = requestAnimationFrame(passo); return; }
          raf = 0; atterra(f);
        };
        raf = requestAnimationFrame(passo);
      }

      function atterra(f) {
        animando = false; b.fuoco.disabled = false; b.ric.disabled = false; b.casuale.disabled = false;
        const L = liv(), prec = ultimo;
        ultimo = { p: { a: p.a, v: p.v, h: p.h }, f };
        tracce.push({ p: ultimo.p, f }); if (tracce.length > 4) tracce.shift();
        vuota(gVolo);
        if (libero) {   /* ridisegno: la vista può essersi allargata */
          ridisegnaTutto(); aggiorna(); aggiornaLivelli();
          msg.textContent = osserva(f); msg.className = 'lab-messaggio';
          return;
        }
        disegnaTracce(); aggiorna(); aggiornaLivelli();
        const v = verdetto(L, f);
        if (L.due) { livelloDue(v, f); return; }
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, f, prec);
      }

      /* livello 4: due colpi a segno con angoli che differiscono di almeno 10° */
      function livelloDue(v, f) {
        if (v.ok && (!presi.length || Math.abs(presi[0] - p.a) >= 10)) {
          presi.push(p.a);
          if (presi.length === 2) { vinci('Colpito a ' + presi[0] + '° e a ' + presi[1] + '°.'); return; }
          msg.textContent = 'Colpito a ' + p.a + '°. Adesso colpiscilo con un angolo diverso.'; msg.className = 'lab-messaggio ok';
          ctx.mascotte('giusto'); disegnaFondo(); return;
        }
        if (v.ok) { msg.textContent = 'Colpito, ma a ' + p.a + '°: troppo vicino a ' + presi[0] + '°. Serve un angolo diverso di almeno 10°.'; msg.className = 'lab-messaggio no'; }
        else { msg.textContent = v.testo; msg.className = 'lab-messaggio no'; }
        ctx.mascotte('sbagliato');
        if (presi.length && ++mancatiDopo >= 3 && !detti.seno) { detti.seno = true; ctx.zenone('Nella gittata c\'è sin(2α): quale altro angolo dà lo stesso seno di 2·' + presi[0] + '°?', { tipo: 'suggerimento', espressione: 'pensa', durata: 7000 }); }
      }

      function vinci(testo) {
        finito = true; b.fuoco.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (colpi === 1 ? ' Al primo colpo.' : ' Colpi: ' + colpi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello](p), { espressione: colpi <= (LIVELLI[livello].due ? 2 : 1) ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, f, prec) {
        const pf = prec && prec.f;
        /* «velocità doppia, distanza doppia»: ha cambiato v0 nella stessa proporzione della distanza mancante */
        if (L.bersaglio && !L.h && pf && pf.tipo === 'terra' && prec.p.a === p.a && prec.p.v !== p.v && pf.x > 0.5) {
          const atteso = prec.p.v * L.bersaglio.x / pf.x;
          if (Math.abs(p.v - atteso) <= Math.max(0.5, 0.04 * atteso)) { dici('lineare', 'Hai cambiato v₀ in proporzione alla distanza, ma la gittata va con v₀²: velocità doppia, quattro volte più lontano.'); return; }
        }
        if (L.fosso && f.tipo === 'terra' && p.a > 50 && f.x < L.fosso.a) { dici('alto', 'Più in alto non vuol dire più lontano: oltre 45° la palla sale di più ma va più piano di lato.'); return; }
        if (f.tipo === 'muro') { dici('muro', 'Il muro ferma i tiri bassi. Con la stessa velocità c\'è un secondo angolo che arriva lì: più alto.'); return; }
        if (f.tipo === 'galleria') { dici('soffitto', 'Quanto sale la palla dipende solo dalla parte verticale di v₀: abbassa l\'angolo, e per arrivare lontano aumenta v₀.'); return; }
        if (L.h && pf && prec.p.v !== p.v) {
          msg.textContent += ' Di nuovo ' + num(f.t, 2) + '\u00a0s in volo.';
          dici('tempo', 'Più veloce non vuol dire più tempo in aria: il tempo di caduta lo decide solo l\'altezza.');
          return;
        }
        if (L.torre && f.tipo === 'torre') dici('torre', 'La palla deve arrivare a x = 20\u00a0m quando è già oltre il punto più alto, e a 8\u00a0m da terra.');
      }

      /* ---------------- modalità libera: nessun bersaglio, nessun verdetto ---------------- */
      function osserva(f) {   /* osservazioni neutre su che cosa ha fatto la palla */
        let t = 'In volo ' + num(f.t, 2) + '\u00a0s.';   /* dove ricade e quanto sale sono già scritti nella scena */
        if (!p.h && p.a === 45) t += ' A 45° la gittata è la massima per questa velocità.';
        else if (!p.h && p.a === 90) t += ' A 90° sale e ricade sul cannone.';
        else if (!p.h) {
          const gemello = tracce.slice(0, -1).find(tr => !tr.p.h && tr.p.v === p.v && tr.p.a + p.a === 90);
          if (gemello) t += ' Come il tiro a ' + gemello.p.a + '°: gli angoli sommati fanno 90°.';
        }
        return t;
      }
      function mostraLibero() {
        b.casuale.hidden = !libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), colpi, finito, tracce: tracce.slice(), ultimo, presi: presi.slice(), detti: Object.assign({}, detti), mancatiDopo, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        p = { a: 45, v: 12, h: 0 }; tracce = []; ultimo = null; finito = false;
        consegnaEl.textContent = '';   /* in modalità libera la consegna non serve: il pannello resta corto */
        msg.textContent = ''; msg.className = 'lab-messaggio'; orologio.textContent = '';
        b.fuoco.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {   /* si torna al livello com'era */
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; colpi = z.colpi; finito = z.finito; tracce = z.tracce; ultimo = z.ultimo; presi = z.presi; detti = z.detti; mancatiDopo = z.mancatiDopo;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.fuoco.disabled = finito; orologio.textContent = '';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => lo + Math.round(Math.random() * (hi - lo) / s) * s;
        p = { a: r(15, 75, 5), v: r(8, 18, 1), h: Math.random() < 0.3 ? r(2, 12, 2) : 0 };
        msg.textContent = ''; ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        const L = liv();
        if (animando || (!libero && L.fisso === k)) return false;
        const lim = { a: [A_MIN, A_MAX, 1], v: [V_MIN, V_MAX, 0.5], h: [0, H_MAX, 1] }[k];
        const nuovo = morsa(Math.round((p[k] + d * lim[2]) * 10) / 10, lim[0], lim[1]);
        if (nuovo === p[k]) return false;
        p[k] = nuovo;
        if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (libero) { msg.textContent = ''; ridisegnaTutto(); }
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
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* puntare col dito: dal perno del cannone al dito, la direzione è α e la lunghezza è v0 */
      let mira = false;
      function punta(ev) {
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        const dx = c.x - PX(0), dy = PY(p.h || 0) - c.y, L = liv();
        const fa = libero || L.fisso !== 'a', fv = libero || L.fisso !== 'v';
        let cambiato = false;
        if (fa && (dx > 2 || dy > 2)) { const a = morsa(Math.round(Math.atan2(Math.max(0, dy), Math.max(0, dx)) / RAD), A_MIN, A_MAX); if (a !== p.a) { p.a = a; cambiato = true; } }
        if (fv) {
          const lung = fa ? Math.hypot(Math.max(0, dx), Math.max(0, dy)) : Math.max(0, dx * Math.cos(p.a * RAD) + dy * Math.sin(p.a * RAD));
          const v = morsa(Math.round(lung / S.K * 2) / 2, V_MIN, V_MAX);
          if (v !== p.v) { p.v = v; cambiato = true; }
        }
        if (cambiato) {
          if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
          aggiorna();
        }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        mira = true; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        punta(ev); ev.preventDefault();
      });
      const muovi = ev => { if (mira) { punta(ev); ev.preventDefault(); } };
      const molla = () => { if (!mira) return; mira = false; if (libero) ridisegnaTutto(); };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.fuoco.addEventListener('click', fuoco);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { tracce = []; ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
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

      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg];
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      avviaLivello(livello);
      let forma = '';
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
