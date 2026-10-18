/* Laboratorio «I carrelli» — urti in una dimensione (argomento quantita-di-moto).
   Due carrelli su una rotaia senza attrito; sul muso di A c'è un paraurti: velcro (restano uniti), gomma (rimbalzano
   perdendo energia), molla (rimbalzano senza perderne). Si scelgono masse e velocità, poi Via.
   Fisica vera: il centro di massa va a velocità costante; il paraurti è una forza interna di Hooke fra i due carrelli
   (s = sc − umax·sin ωt in compressione, con ω = √(k/μ)), che in espansione restituisce solo la frazione e della velocità
   relativa (e = 0 velcro, 0,5 gomma, 1 molla). Così la quantità di moto totale è la stessa in ogni istante, e
   l'energia cinetica torna tutta solo con la molla. Sotto la rotaia il centro di massa (viola), sotto ancora le barre
   prima / adesso: quantità di moto in azzurro, energia cinetica in verde.
   Contratto in SCHEMA-LAB.md; modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-carrelli .lab-scena { background: linear-gradient(180deg, var(--sup2), var(--sup)); overflow: hidden; touch-action: none; }
    .lab-carrelli .lab-scena > svg { width: 100%; height: 100%; }
    .lab-carrelli svg text { font-family: var(--font); }
    .lab-carrelli .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-carrelli .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-carrelli .consegna:empty { display: none; }
    .lab-carrelli .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .4em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; min-height: 2.4em; }
    .lab-carrelli .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-carrelli .formula .ignoto { color: var(--testo3); }
    .lab-carrelli .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-carrelli .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-carrelli .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-carrelli .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-carrelli .lab-barra .btn[hidden] { display: none; }
    .lab-carrelli .btn[disabled] { opacity: .38; cursor: default; }
    .lab-carrelli .lab-parametri { max-width: 560px; }
    .lab-carrelli .lab-parametri.uno { grid-template-columns: 1fr; }
    .lab-carrelli .lab-param[hidden] { display: none; }
    .lab-carrelli .lab-param .nome { min-width: 1.9em; }
    .lab-carrelli .lab-param output { min-width: 2.4em; }
    .lab-carrelli .lab-param .unita { font-size: .8rem; color: var(--testo2); min-width: 2.2em; }
    /* nel Libero i quattro parametri stanno due per riga anche nel pannello di lato (400 px) */
    .lab-carrelli.in-libero .lab-parametri { grid-template-columns: 1fr 1fr; }
    .lab-carrelli.in-libero .lab-param { gap: 2px; }
    .lab-carrelli.in-libero .lab-param .nome { min-width: 1.5em; }
    .lab-carrelli.in-libero .lab-param .unita { min-width: 0; }
    .lab-carrelli .paraurti { grid-column: 1 / -1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; }
    .lab-carrelli .paraurti[hidden] { display: none; }
    .lab-carrelli .paraurti .btn[aria-pressed="true"] { background: var(--accento); border-color: var(--accento); color: #fff; }
    .lab-carrelli .vinto { display: inline-block; animation: lab-carrelli-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-carrelli-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-carrelli .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-carrelli .formula .simbolo { display: none; } .lab-carrelli .formula .nome-stretto { display: inline; } }
  `;

  /* ---------------- fisica (pura: la usa anche la prova dei livelli in node) ---------------- */
  const LC = 1.4;                       /* lunghezza di un carrello, in m */
  const VISTA = [0, 11];                /* il tratto di rotaia che si vede, in m */
  const M_MIN = 0.5, M_MAX = 4, V_LIM = 6;
  /* e = frazione della velocità relativa che torna; k = rigidezza (N/m); s = spessore del paraurti a riposo (m) */
  const PARAURTI = {
    velcro: { e: 0, k: 60000, s: 0.06, nome: 'velcro' },
    gomma: { e: 0.5, k: 15000, s: 0.15, nome: 'gomma' },
    molla: { e: 1, k: 2000, s: 0.45, nome: 'molla' }
  };

  /* p = { mA, vA, xA, mB, vB, xB, tipo } → il moto intero, istante per istante */
  function urto(p) {
    const P = PARAURTI[p.tipo], M = p.mA + p.mB, mu = p.mA * p.mB / M;
    const vcm = (p.mA * p.vA + p.mB * p.vB) / M, xcm0 = (p.mA * p.xA + p.mB * p.xB) / M;
    const s0 = p.xB - p.xA, sc = LC + P.s, vrel = p.vA - p.vB;
    const tocca = vrel > 1e-9;
    const w = Math.sqrt(P.k / mu), umax = tocca ? vrel / w : 0;
    const tc = tocca ? (s0 - sc) / vrel : Infinity;          /* il paraurti tocca B */
    const t1 = Math.PI / (2 * w);                             /* durata della compressione */
    const w2 = P.e * w, t2 = P.e > 0 ? Math.PI / (2 * w2) : Infinity;   /* durata dell'espansione */
    const tSep = tocca ? (P.e > 0 ? tc + t1 + t2 : tc + t1) : 0;        /* da qui in poi le velocità non cambiano più */
    function rel(t) {   /* s = xB − xA e la sua derivata */
      if (!tocca || t <= tc) return [s0 - vrel * t, -vrel];
      const a = t - tc;
      if (a <= t1) return [sc - umax * Math.sin(w * a), -vrel * Math.cos(w * a)];
      if (P.e === 0) return [sc - umax, 0];
      const b = a - t1;
      if (b <= t2) return [sc - umax * Math.cos(w2 * b), umax * w2 * Math.sin(w2 * b)];
      return [sc + P.e * vrel * (b - t2), P.e * vrel];
    }
    function stato(t) {
      const r = rel(t), xcm = xcm0 + vcm * t;
      const st = { t, s: r[0], xA: xcm - p.mB / M * r[0], xB: xcm + p.mA / M * r[0], vA: vcm - p.mB / M * r[1], vB: vcm + p.mA / M * r[1], xcm, vcm };
      st.contatto = tocca && t > tc && (P.e === 0 || t < tSep);
      st.compr = tocca && t > tc ? Math.max(0, sc - r[0]) : 0;                   /* quanto è schiacciato il paraurti */
      st.Ec = 0.5 * p.mA * st.vA * st.vA + 0.5 * p.mB * st.vB * st.vB;
      return st;
    }
    const fin = stato(tSep + 1e-6);
    /* il primo istante in cui un carrello tocca il bordo della vista (la corsa finisce lì: niente carrelli tagliati) */
    let tBordo = Infinity;
    for (let t = 0; t <= 30; t += 0.005) {
      const st = stato(t);
      if (st.xA - LC / 2 < VISTA[0] || st.xA + LC / 2 + P.s > VISTA[1] || st.xB - LC / 2 < VISTA[0] || st.xB + LC / 2 > VISTA[1]) { tBordo = Math.max(0, t - 0.005); break; }
    }
    const vAf = tocca ? vcm - p.mB / M * P.e * vrel : p.vA, vBf = tocca ? vcm + p.mA / M * P.e * vrel : p.vB;
    return { tocca, tc, tSep, vcm, vAf, vBf, stato, fin, M, P, tBordo, esce: tocca && tBordo < tSep,
      p0: p.mA * p.vA + p.mB * p.vB, E0: 0.5 * p.mA * p.vA * p.vA + 0.5 * p.mB * p.vB * p.vB,
      Ef: 0.5 * p.mA * vAf * vAf + 0.5 * p.mB * vBf * vBf };
  }

  /* quando il centro di un carrello passa per x (dopo la fine dell'urto, a velocità costante); null se non ci passa */
  function passaggio(u, chi, x) {
    if (!u.tocca) return null;
    const st = u.stato(u.tSep), x0 = chi === 'A' ? st.xA : st.xB, v = chi === 'A' ? u.vAf : u.vBf;
    if (Math.abs(v) < 1e-9 || (x - x0) / v < 0) return null;
    return u.tSep + (x - x0) / v;
  }
  /* quanto dura la corsa (in secondi di fisica): finché le fotocellule hanno letto e ancora un po' */
  function durata(u, L) {
    if (!u.tocca || u.esce) return Math.min(3, u.tBordo);
    let fine = u.tSep + 1.2, letto = u.tSep;
    (L.fotocellule || []).forEach(f => {   /* ogni fotocellula tiene la prima lettura: conta il primo carrello che passa */
      const t = Math.min.apply(null, ['A', 'B'].map(c => { const x = passaggio(u, c, f.x); return x === null ? Infinity : x; }));
      if (t < 30) { fine = Math.max(fine, t + 0.6); letto = Math.max(letto, t); }
    });
    fine = Math.min(fine, 30);
    /* un carrello può uscire dalla rotaia (le barre continuano a contarlo), ma la corsa non finisce con un carrello tagliato a metà:
       prima si cerca l'ultimo istante buono dopo le letture, altrimenti si aspetta che il carrello esca del tutto */
    const taglio = t => {   /* quanto manca perché nessun carrello sia a cavallo del bordo (0: nessuno lo è) */
      const st = u.stato(t);
      let piu = 0;
      [[st.xA - LC / 2, st.xA + LC / 2 + u.P.s, st.vA], [st.xB - LC / 2, st.xB + LC / 2, st.vB]].forEach(c => {
        const a = (c[0] < VISTA[0] && c[1] > VISTA[0]) || (c[0] < VISTA[1] && c[1] > VISTA[1]);
        if (a) piu = Math.max(piu, Math.abs(c[2]) > 1e-9 ? (c[2] > 0 ? VISTA[1] - c[0] : c[1] - VISTA[0]) / Math.abs(c[2]) + 0.02 : 1e9);
      });
      return piu;
    };
    if (!taglio(fine)) return fine;
    for (let t = fine; t >= letto + 0.05; t -= 0.01) if (!taglio(t)) return t;
    for (let giro = 0; giro < 4; giro++) { const piu = taglio(fine); if (!piu || piu > 100) break; fine += piu; }
    return Math.min(fine, 40);
  }
  /* un carrello è tutto fuori dalla vista? (allora non si disegna) */
  const fuoriVista = (x, extra) => x + LC / 2 + (extra || 0) < VISTA[0] || x - LC / 2 > VISTA[1];

  /* ---------------- livelli ----------------
     liberi: le grandezze che si possono cambiare. Gli altri valori sono fissi e stanno scritti nella scena.
     Le soluzioni sono contate dalla prova dei livelli (masse a passi di 0,5 kg, velocità a passi di 0,5 m/s). */
  const TOL = 0.1;   /* fotocellule: vale se la lettura è entro 0,1 m/s dal valore chiesto */
  const LIVELLI = [
    { consegna: 'Velcro: i carrelli restano uniti. Fai passare la coppia dalla fotocellula a <b>2&nbsp;m/s</b>.',
      tipo: 'velcro', A: { m: 1, v: 1, x: 2 }, B: { m: 1, v: 0, x: 6 }, liberi: ['vA'], fotocellule: [{ x: 9 }], obiettivo: 'V', V: 2, formula: 'V' },        /* vA = 4 */
    { consegna: 'B viene incontro ad A. Dopo l\'urto i due carrelli uniti devono restare <b>fermi</b>.',
      tipo: 'velcro', A: { m: 2, v: 3, x: 2 }, B: { m: 3, v: -1, x: 7.5 }, liberi: ['vB'], obiettivo: 'fermi', formula: 'V' },                                /* vB = −2 */
    { consegna: 'Molla: i carrelli rimbalzano. Scegli la massa di B perché, dopo l\'urto, <b>A resti fermo</b>.',
      tipo: 'molla', A: { m: 1, v: 4, x: 2 }, B: { m: 3, v: 0, x: 6 }, liberi: ['mB'], obiettivo: 'Afermo', formula: 'vA1' },                                   /* mB = 1 */
    { consegna: 'Scegli la massa di B perché A torni indietro e passi dalla fotocellula a <b>1&nbsp;m/s</b>.',
      tipo: 'molla', A: { m: 1, v: 3, x: 2.6 }, B: { m: 0.5, v: 0, x: 6.2 }, liberi: ['mB'], fotocellule: [{ x: 0.9 }], obiettivo: 'Aindietro', V: -1, formula: 'vA1' },   /* mB = 2 */
    { consegna: 'Scegli la velocità di B perché il <b>centro di massa</b> (il triangolo viola) resti fermo.',
      tipo: 'molla', A: { m: 1, v: 3, x: 2 }, B: { m: 2, v: 0, x: 8 }, liberi: ['vB'], obiettivo: 'cm', formula: 'cm' },                                       /* vB = −1,5 */
    { consegna: 'Gomma: si perde un po\' di energia. B ripartirà a <b>3&nbsp;m/s</b>. Prevedi la velocità di A dopo l\'urto, poi Via.',
      tipo: 'gomma', A: { m: 2, v: 3, x: 2 }, B: { m: 1, v: 0, x: 6 }, liberi: ['pr'], fotocellule: [{ x: 9 }], obiettivo: 'previsione', previsione: true, formula: 'p' },   /* v_A′ = 1,5 */
    { consegna: 'Quanta massa ha B? Lancia A (1&nbsp;kg) contro B, leggi la fotocellula, poi scegli <b>m<sub>B</sub></b> e premi Pesa.',
      tipo: 'velcro', A: { m: 1, v: 2, x: 2 }, B: { m: 2.5, v: 0, x: 6 }, liberi: ['vA', 'mg'], fotocellule: [{ x: 9.2 }], obiettivo: 'massa', mistero: true, formula: 'massa' }   /* mB = 2,5 */
  ];
  const LIBERO = { consegna: '', tipo: 'molla', A: { m: 1, v: 3, x: 2 }, B: { m: 1, v: 0, x: 6.5 }, liberi: ['mA', 'vA', 'mB', 'vB'], formula: 'libero' };

  /* il verdetto di una corsa: { ok, testo } (il testo dice che cosa è successo, non come rimediare) */
  function verdetto(L, u, pr) {
    if (!u.tocca) return { ok: false, testo: 'Non si toccano: A non raggiunge B.' };
    if (u.esce) return { ok: false, testo: 'Escono dalla rotaia prima di urtarsi: A raggiunge B troppo piano.' };
    const dir = v => Math.abs(v) < 0.005 ? 'fermo' : (v > 0 ? 'verso destra' : 'verso sinistra') + ' a ' + num(Math.abs(v), 2) + '\u00a0m/s';
    if (L.obiettivo === 'V') {
      const ok = Math.abs(u.vBf - L.V) <= TOL;
      return { ok, testo: 'Uniti, ' + dir(u.vBf) + (ok ? '.' : ': la fotocellula voleva 2,00\u00a0m/s.') };
    }
    if (L.obiettivo === 'fermi') {
      if (Math.abs(u.vAf) <= 0.05) return { ok: true, testo: 'Fermi, tutti e due.' };
      return { ok: false, testo: 'Uniti, ma vanno ' + dir(u.vAf) + '.' };
    }
    if (L.obiettivo === 'Afermo') {
      const ok = Math.abs(u.vAf) <= TOL;
      return { ok, testo: ok ? 'A si ferma; B parte a ' + num(u.vBf, 2) + '\u00a0m/s.' : (u.vAf > 0 ? 'A prosegue' : 'A torna indietro') + ' a ' + num(Math.abs(u.vAf), 2) + '\u00a0m/s.' };
    }
    if (L.obiettivo === 'Aindietro') {
      const ok = Math.abs(u.vAf - L.V) <= TOL;
      if (u.vAf >= -0.005) return { ok: false, testo: Math.abs(u.vAf) < 0.005 ? 'A si ferma: non torna indietro.' : 'A prosegue a ' + num(u.vAf, 2) + '\u00a0m/s: non torna indietro.' };
      return { ok, testo: 'A torna indietro a ' + num(-u.vAf, 2) + '\u00a0m/s' + (ok ? '.' : ': la fotocellula voleva 1,00\u00a0m/s.') };
    }
    if (L.obiettivo === 'cm') {
      if (Math.abs(u.vcm) <= 0.05) return { ok: true, testo: 'Il centro di massa resta fermo.' };
      return { ok: false, testo: 'Il centro di massa va ' + dir(u.vcm) + '.' };
    }
    if (L.obiettivo === 'previsione') {
      const ok = Math.abs(pr - u.vAf) <= 0.25;
      return { ok, testo: 'A va a ' + num(u.vAf, 2) + '\u00a0m/s; avevi previsto ' + num(pr, 1) + '\u00a0m/s.' };
    }
    if (L.obiettivo === 'massa') return { ok: null, testo: 'Uniti a ' + num(u.vBf, 2) + '\u00a0m/s.' };
    return { ok: false, testo: '' };
  }

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    u => 'Massa doppia, velocità metà: 4\u00a0kg·m/s prima e dopo. L\'energia cinetica invece è scesa da 8\u00a0J a 4\u00a0J.',
    u => 'Quantità di moto totale zero prima e zero dopo. L\'energia cinetica è sparita tutta: è diventata energia interna, deformazione e riscaldamento.',
    u => 'Masse uguali con la molla: si scambiano le velocità, e si conservano sia la quantità di moto sia l\'energia.',
    u => 'B porta via 4\u00a0kg·m/s, più di quanti ne avesse A: per pareggiare il conto A torna indietro con −1\u00a0kg·m/s.',
    u => 'I carrelli rimbalzano, il centro di massa no: le forze dell\'urto sono interne e non lo spostano.',
    u => 'La quantità di moto si conserva anche quando l\'energia no: ' + num(u.E0, 2) + '\u00a0J prima, ' + num(u.Ef, 2) + '\u00a0J dopo.',
    u => 'Hai misurato la massa di un carrello con un urto: è lo stesso principio del pendolo balistico.'
  ];

  const AIUTO = 'Due carrelli su una rotaia senza attrito. Il verso positivo è verso destra: una velocità negativa va verso sinistra. Scegli i valori con − e + (le velocità anche trascinando le frecce azzurre nella scena), poi Via. Il paraurti sul muso di A decide l\'urto: con il velcro i carrelli restano uniti, con la molla rimbalzano senza perdere energia cinetica, con la gomma rimbalzano perdendone una parte. Il triangolo viola sotto la rotaia è il centro di massa. Dopo il Via le barre confrontano prima (tratteggio) e adesso: quantità di moto in azzurro, energia cinetica in verde. Le fotocellule leggono la velocità di chi passa: vale se la lettura è entro 0,1\u00a0m/s dal valore chiesto.';
  const AIUTI = {
    0: ' Ogni carrello ha 1\u00a0kg. Dopo l\'urto si muovono insieme, come un carrello solo di 2\u00a0kg.',
    1: ' A ha 2\u00a0kg e va a 3\u00a0m/s verso destra. B ha 3\u00a0kg: per venire incontro ad A la sua velocità è negativa.',
    2: ' La massa di B si cambia con − e + a passi di 0,5\u00a0kg: ogni pesetto sul carrello vale 0,5\u00a0kg.',
    3: ' La fotocellula è a sinistra, dietro ad A: A deve tornare indietro e passarci a 1\u00a0m/s.',
    4: ' Il centro di massa sta fra i due carrelli, più vicino a quello con più massa. Si muove con v<sub>cm</sub> = p<sub>tot</sub> / m<sub>tot</sub>.',
    5: ' Con la gomma non sai quanta energia cinetica si perde. Trascina la freccia tratteggiata, o usa − e +, per dire a che velocità andrà A dopo l\'urto; vale se sbagli di meno di 0,25\u00a0m/s.',
    6: ' Il velcro tiene uniti i carrelli. Puoi lanciare A tutte le volte che vuoi, con velocità diverse; poi scegli m<sub>B</sub> e premi Pesa.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da vincere. Scegli masse e velocità dei due carrelli e il paraurti, poi Via: le barre mostrano quantità di moto ed energia cinetica prima e adesso. «Casuale» propone un urto a caso.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−').replace(/^−(0,0*)$/, '$1'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}').replace(/^-(0(\{,\}0*)?)$/, '$1'); }
  const tPos = v => v % 1 ? texNum(v, 1) : String(v);
  const tFat = v => v < 0 ? '(-' + tPos(-v) + ')' : tPos(v);                 /* un fattore: i negativi fra parentesi */
  const uguale = (v, d) => Math.abs(v * Math.pow(10, d) - Math.round(v * Math.pow(10, d))) < 1e-7 ? '= ' : '\\approx ';
  const nV = v => (v % 1 ? num(v, 1) : num(v, 0));

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  QUANTO.registraLab({
    id: 'carrelli',
    fisica: { urto, durata, passaggio, verdetto, LIVELLI, PARAURTI },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-carrelli')) { const s = document.createElement('style'); s.id = 'stile-lab-carrelli'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-carrelli');
      const par = (k, nome, unita, giu, su) => `<div class="lab-param" data-p="${k}" hidden><span class="nome">${ctx.tex(nome)}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${giu}">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="${su}">+</button><span class="unita">${unita}</span></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: masse, velocità e paraurti li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${par('mA', 'm_A', 'kg', 'massa di A più piccola', 'massa di A più grande')}
              ${par('vA', 'v_A', 'm/s', 'velocità di A più verso sinistra', 'velocità di A più verso destra')}
              ${par('mB', 'm_B', 'kg', 'massa di B più piccola', 'massa di B più grande')}
              ${par('vB', 'v_B', 'm/s', 'velocità di B più verso sinistra', 'velocità di B più verso destra')}
              ${par('pr', "v_A'", 'm/s', 'previsione più verso sinistra', 'previsione più verso destra')}
              ${par('mg', 'm_B', 'kg', 'massa di B più piccola', 'massa di B più grande')}
              <div class="paraurti" role="group" aria-label="Paraurti" hidden>
                <button type="button" class="btn piccolo" data-u="velcro">velcro</button><button type="button" class="btn piccolo" data-u="gomma">gomma</button><button type="button" class="btn piccolo" data-u="molla">molla</button><button type="button" class="btn piccolo b-casuale">Casuale</button>
              </div>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">▶ Via</button>
              <button type="button" class="btn primario b-pesa" hidden>⚖ Pesa</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri'), paraurtiEl = q('.paraurti');
      const b = { via: q('.b-via'), pesa: q('.b-pesa'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const CHIAVI = ['mA', 'vA', 'mB', 'vB', 'pr', 'mg'];
      const box = {}; CHIAVI.forEach(k => { box[k] = q('[data-p="' + k + '"]'); });
      const LIM = { mA: [M_MIN, M_MAX, 0.5], mB: [M_MIN, M_MAX, 0.5], vA: [-V_LIM, V_LIM, 0.5], vB: [-V_LIM, V_LIM, 0.5], pr: [-V_LIM, V_LIM, 0.5], mg: [0.5, 6, 0.5] };

      /* ---------------- stato ---------------- */
      let livello = 0, p = {}, prove = 0, pesate = 0, finito = false, animando = false, raf = 0;
      let corsa = null;      /* l'ultima corsa: { chiave, u, st (lo stato mostrato), letture } */
      let detti = {}, sbagli = 0;
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const chiave = () => [p.mA, p.vA, p.mB, p.vB, p.tipo].join('|');
      const fatto = () => !!(corsa && corsa.chiave === chiave() && corsa.finita);
      const parametriUrto = () => { const L = liv(); return { mA: p.mA, vA: p.vA, xA: L.A.x, mB: p.mB, vB: p.vB, xB: L.B.x, tipo: p.tipo }; };

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Due carrelli su una rotaia, il centro di massa e le barre della quantità di moto e dell\'energia cinetica', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gCarrelli = el('g'), gFrecce = el('g'), gBarre = el('g'), gTesti = el('g');
      [gFondo, gBarre, gCarrelli, gFrecce, gTesti].forEach(g => svg.appendChild(g));

      /* S: misure in pixel. U px per metro; K px per m/s delle frecce; z fattore per i caratteri sugli schermi grandi */
      let S = { w: 400, h: 400, U: 30, ox: 10, K: 14, z: 1, Hc: 24, bh: 8, r: 5 };
      const PX = x => S.ox + (x - VISTA[0]) * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(260, Math.round(r.width)), h = Math.max(220, Math.round(r.height));
        const z = morsa(Math.min(w / 560, h / 430), 1, 1.35);
        const ox = 10, U = (w - 2 * ox) / (VISTA[1] - VISTA[0]);
        const Hc = morsa(0.3 * LC * U, 30, 48), bh = morsa(Hc * 0.34, 9, 15), rr = morsa(Hc * 0.2, 5, 9);
        const K = morsa(U * 0.42, 13, 34);
        const pre = liv().previsione ? 26 * z : 0;
        /* blocco della rotaia, dall'alto: riga dell'orologio, (previsione), frecce, pesetti, carrello, ruote, rotaia, masse, centro di massa */
        const alto = 32 * z + pre + 34 * z + 2 * bh + 4 + Hc + 2 * rr + 18 * z + 30 * z;
        let barre = Math.min(h - alto - 16, 250 * z);
        if (barre < 110) barre = 0;
        const avanzo = Math.max(0, h - alto - barre - (barre ? 16 : 0));
        const y0 = Math.min(avanzo / 2, 60 * z);
        const yArr = y0 + 32 * z + pre + 30 * z;
        const yBody = yArr + 10 * z + 2 * bh + 4;
        const yT = yBody + Hc + 2 * rr;
        S = { w, h, U, ox, K, z, Hc, bh, r: rr, pre, y0, yArr, yPre: y0 + 32 * z + 18 * z, yBody, yT, yMassa: yT + 16 * z, yCm: yT + 26 * z,
          barre, yBarre: yT + 18 * z + 30 * z + 8 + Math.max(0, (avanzo - 2 * y0) / 2) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const T = (x, y, testo, o) => el('text', Object.assign({ x, y, fill: 'var(--testo2)', style: 'font: ' + (o && o.peso || 600) + ' ' + Math.round((o && o.fs || 13) * S.z) + 'px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, o && o.a || {}), testo);

      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), yT = S.yT;
        /* la rotaia, con le tacche ogni metro (le posizioni contano poco: niente numeri) */
        gFondo.appendChild(el('rect', { x: 0, y: yT, width: S.w, height: 7, fill: 'var(--testo2)', opacity: .35 }));
        gFondo.appendChild(el('line', { x1: 0, y1: yT, x2: S.w, y2: yT, stroke: 'var(--testo)', 'stroke-width': 2, opacity: .6 }));
        for (let x = Math.ceil(VISTA[0]); x <= VISTA[1]; x++) gFondo.appendChild(el('line', { x1: PX(x), y1: yT + 7, x2: PX(x), y2: yT + 11, stroke: 'var(--testo2)', 'stroke-width': 1, opacity: .6 }));
        /* le fotocellule: due paletti e il raggio */
        (L.fotocellule || []).forEach(f => {
          const x = PX(f.x), top = S.yArr - 16 * S.z;
          gFondo.appendChild(el('line', { x1: x, y1: top, x2: x, y2: yT, stroke: 'var(--no)', 'stroke-width': 1.4, 'stroke-dasharray': '3 3', opacity: .7 }));
          gFondo.appendChild(el('rect', { x: x - 3, y: top - 4, width: 6, height: 8, rx: 1.5, fill: 'var(--testo2)' }));
        });
      }

      /* un carrello: corpo, ruote, pesetti (0,5 kg l'uno sopra il carrello vuoto da 0,5 kg), nome; A ha il paraurti sul muso */
      function carrello(chi, x, m, st) {
        const L = liv(), x0 = PX(x - LC / 2), lw = LC * S.U, yb = S.yBody, Hc = S.Hc;
        const g = el('g');
        [0.22, 0.78].forEach(f => g.appendChild(el('circle', { cx: x0 + lw * f, cy: S.yT - S.r, r: S.r, fill: 'var(--testo)', opacity: .8 })));
        g.appendChild(el('rect', { x: x0, y: yb, width: lw, height: Hc, rx: Math.min(8, Hc * 0.3), fill: 'var(--sup2)', stroke: 'var(--testo)', 'stroke-width': 2 }));
        const mistero = chi === 'B' && L.mistero && !libero;
        if (mistero) {
          g.appendChild(el('rect', { x: x0 + 4, y: yb - 2 * S.bh - 4, width: lw - 8, height: 2 * S.bh + 4, rx: 3, fill: '#b5813f', opacity: .85, stroke: 'var(--testo)', 'stroke-width': 1.2 }));
          g.appendChild(T(x0 + lw / 2, yb - S.bh + 1, '?', { fs: 13, peso: 700, a: { 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#3d2408', stroke: 'none' } }));
        } else {
          const n = Math.round((m - 0.5) / 0.5), bw = (lw - 10) / 4;
          for (let i = 0; i < n; i++) {
            const riga = Math.floor(i / 4), col = i % 4;
            g.appendChild(el('rect', { x: x0 + 5 + col * bw + 1, y: yb - (riga + 1) * S.bh - riga * 2 - 1, width: bw - 2, height: S.bh, rx: 2, fill: 'var(--testo2)', opacity: .8 }));
          }
        }
        g.appendChild(T(x0 + lw / 2, yb + Hc / 2 + 1, chi, { fs: 14, peso: 700, a: { 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: 'var(--testo)', stroke: 'none' } }));
        g.appendChild(T(x0 + lw / 2, S.yMassa, mistero ? '? kg' : nV(m) + '\u00a0kg', { fs: 12, a: { 'text-anchor': 'middle' } }));
        /* il paraurti sul muso di A, schiacciato di st.compr */
        if (chi === 'A') {
          const P = PARAURTI[p.tipo], xa = x0 + lw, len = Math.max(0.02, P.s - (st ? st.compr : 0)) * S.U, yc = yb + Hc / 2;
          if (p.tipo === 'molla') {
            let d = 'M' + xa + ' ' + yc;
            const giri = 5; for (let i = 1; i <= giri; i++) d += ' L' + (xa + len * (i - 0.5) / giri).toFixed(1) + ' ' + (yc + (i % 2 ? -1 : 1) * Hc * 0.28).toFixed(1);
            d += ' L' + (xa + len) + ' ' + yc;
            g.appendChild(el('path', { d, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
            g.appendChild(el('rect', { x: xa + len - 2, y: yc - Hc * 0.32, width: 4, height: Hc * 0.64, fill: 'var(--testo)' }));
          } else if (p.tipo === 'gomma') {
            g.appendChild(el('rect', { x: xa, y: yc - Hc * 0.34, width: len, height: Hc * 0.68, rx: Math.min(len / 2, 5), fill: '#3b3b3b', opacity: .9 }));
          } else {
            g.appendChild(el('rect', { x: xa, y: yb + 3, width: Math.max(2, len), height: Hc - 6, fill: 'var(--s2)', opacity: .55 }));
          }
        }
        if (chi === 'B' && p.tipo === 'velcro') g.appendChild(el('rect', { x: x0 - 1, y: yb + 3, width: 3, height: Hc - 6, fill: 'var(--s2)', opacity: .55 }));
        return g;
      }

      function freccia(g, x1, y1, x2, y2, colore, sp, tratteggio) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        const a = { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' };
        if (tratteggio) a['stroke-dasharray'] = '6 4';
        g.appendChild(el('line', a));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore, opacity: tratteggio ? 0.75 : 1 }));
      }
      /* la velocità di un carrello: freccia azzurra sopra, con il valore */
      function velocita(chi, x, v, vicino) {
        const cx = PX(x), y = S.yArr;
        if (Math.abs(v) < 0.005) gFrecce.appendChild(el('circle', { cx, cy: y, r: 3.5, fill: 'var(--s1)' }));
        else freccia(gFrecce, cx, y, morsa(cx + v * S.K, 3, S.w - 3), y, 'var(--s1)', 3.2);   /* vicino al bordo la punta resta dentro */
        const bordo = cx < 48 * S.z ? 'start' : cx > S.w - 48 * S.z ? 'end' : null;
        if (bordo) vicino = false;
        const testo = el('text', { x: bordo ? (bordo === 'start' ? 4 : S.w - 4) : cx, y: y - 9 * S.z, 'text-anchor': bordo || 'middle', fill: 'var(--s1)', style: 'font: 700 ' + Math.round(13 * S.z) + 'px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
        if (vicino) { testo.setAttribute('text-anchor', chi === 'A' ? 'end' : 'start'); testo.setAttribute('x', cx + (chi === 'A' ? 8 : -8)); }
        testo.appendChild(document.createTextNode('v'));
        testo.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: ' + Math.round(10 * S.z) + 'px' }, chi));
        testo.appendChild(el('tspan', {}, ' ' + num(v, Math.abs(v * 2 - Math.round(v * 2)) < 1e-6 ? 1 : 2).replace(',0', '') + '\u00a0m/s'));
        gFrecce.appendChild(testo);
      }

      /* lo stato mostrato: alla partenza (st = null) o un istante della corsa */
      function disegnaStato() {
        vuota(gCarrelli); vuota(gFrecce); vuota(gTesti);
        const L = liv(), st = corsa && corsa.st && corsa.chiave === chiave() ? corsa.st : null;
        const xA = st ? st.xA : L.A.x, xB = st ? st.xB : L.B.x, vA = st ? st.vA : p.vA, vB = st ? st.vB : p.vB;
        const vedoA = !fuoriVista(xA, PARAURTI[p.tipo].s), vedoB = !fuoriVista(xB);
        if (vedoB) gCarrelli.appendChild(carrello('B', xB, p.mB, st));
        if (vedoA) gCarrelli.appendChild(carrello('A', xA, p.mA, st));
        const vicino = vedoA && vedoB && Math.abs(xB - xA) * S.U < 92 * S.z;
        if (vedoA) velocita('A', xA, vA, vicino);
        if (vedoB) velocita('B', xB, vB, vicino);
        /* la previsione (livello 6): freccia tratteggiata sopra A, alla partenza; a fine corsa resta per il confronto */
        if (L.previsione && !libero) {
          const fine = st && corsa.finita, xp = fine ? st.xA : L.A.x, cx = PX(xp), y = S.yPre;
          if (Math.abs(p.pr) < 0.005) gFrecce.appendChild(el('circle', { cx, cy: y, r: 3.5, fill: 'var(--s1)', opacity: .75 }));
          else freccia(gFrecce, cx, y, cx + p.pr * S.K, y, 'var(--s1)', 2.6, true);
          gFrecce.appendChild(T(cx + (p.pr >= 0 ? -6 : 6), y + 4 * S.z, 'previsione ' + nV(p.pr) + '\u00a0m/s', { fs: 12, a: { 'text-anchor': p.pr >= 0 ? 'end' : 'start', fill: 'var(--s1)' } }));
        }
        /* il centro di massa, viola, con la sua velocità (azzurra: è una velocità) */
        const xcm = st ? st.xcm : (p.mA * L.A.x + p.mB * L.B.x) / (p.mA + p.mB);
        if (!(L.mistero && !libero) && xcm > VISTA[0] + 1 && xcm < VISTA[1] - 1) {
          const xc = PX(st ? st.xcm : (p.mA * L.A.x + p.mB * L.B.x) / (p.mA + p.mB)), y = S.yCm, vcm = (p.mA * p.vA + p.mB * p.vB) / (p.mA + p.mB);
          gFrecce.appendChild(el('path', { d: `M${xc} ${y - 7 * S.z} l${7 * S.z} ${12 * S.z} h${-14 * S.z} z`, fill: 'var(--s4)' }));
          gFrecce.appendChild(T(xc - 10 * S.z, y + 4 * S.z, 'cm', { fs: 12, a: { 'text-anchor': 'end', fill: 'var(--s4)' } }));
          if (st && Math.abs(vcm) > 0.005) freccia(gFrecce, xc + 10 * S.z, y, morsa(xc + 10 * S.z + vcm * S.K, 3, S.w - 3), y, 'var(--s1)', 1.8, true);
        }
        /* le letture delle fotocellule */
        (L.fotocellule || []).forEach((f, i) => {
          const r = corsa && corsa.chiave === chiave() && corsa.letture ? corsa.letture[i] : null;
          const testo = r ? (r.v < 0 ? '← ' : '') + num(Math.abs(r.v), 2) + '\u00a0m/s' + (r.v > 0 ? ' →' : '') : '— m/s';
          const xx = morsa(PX(f.x), 44 * S.z, S.w - 44 * S.z), y = S.yArr - 26 * S.z;
          const bw = 82 * S.z, bh = 20 * S.z;
          gTesti.appendChild(el('rect', { x: xx - bw / 2, y: y - bh / 2 - 4 * S.z, width: bw, height: bh, rx: 4, fill: '#10201d', opacity: .9 }));
          gTesti.appendChild(el('text', { x: xx, y: y + 1 * S.z, 'text-anchor': 'middle', fill: r ? '#7dffa8' : '#6d8f86', style: 'font: 700 ' + Math.round(12.5 * S.z) + 'px ui-monospace, Consolas, monospace' }, testo));
        });
        /* orologio e prove, in alto */
        gTesti.appendChild(T(8, S.y0 + 16 * S.z, st ? 't = ' + num(st.t, 2) + '\u00a0s' + (corsa.fattore > 1.05 ? '  (×' + num(corsa.fattore, 1) + ')' : '') : '', { fs: 13 }));
        if (!libero) gTesti.appendChild(T(S.w - 8, S.y0 + 16 * S.z, 'prove: ' + prove, { fs: 12, a: { 'text-anchor': 'end' } }));
        disegnaBarre(st);
      }

      /* le barre prima / adesso: quantità di moto (azzurra, con segno) ed energia cinetica (verde) */
      function disegnaBarre(st) {
        vuota(gBarre);
        if (!S.barre) return;
        const L = liv(), z = S.z, top = S.yBarre, H = S.barre, mx = 10;
        const gruppi = (L.mistero && !libero) ? ['p'] : ['p', 'E'];
        const gw = (S.w - mx * (gruppi.length + 1)) / gruppi.length;
        const u = st ? corsa.u : null, s0 = st ? corsa.u.stato(0) : null;
        const pv = s => [p.mA * s.vA, p.mB * s.vB, p.mA * s.vA + p.mB * s.vB];
        const ev = s => [0.5 * p.mA * s.vA * s.vA, 0.5 * p.mB * s.vB * s.vB, s.Ec];
        gruppi.forEach((g, i) => {
          const x0 = mx + i * (gw + mx), titolo = g === 'p' ? (gw > 230 * z ? 'quantità di moto (kg·m/s)' : 'p (kg·m/s)') : (gw > 230 * z ? 'energia cinetica (J)' : 'Ec (J)');
          gBarre.appendChild(el('rect', { x: x0, y: top, width: gw, height: H, rx: 10, fill: 'var(--sup)', opacity: .55, stroke: 'var(--bordo)' }));
          gBarre.appendChild(T(x0 + gw / 2, top + 16 * z, titolo, { fs: 12.5, a: { 'text-anchor': 'middle', fill: g === 'p' ? 'var(--s1)' : 'var(--s3)', stroke: 'none' } }));
          const zona0 = top + 24 * z + 14 * z, zona1 = top + H - 20 * z;     /* lo spazio delle barre, lasciando posto a numeri ed etichette */
          const nomi = ['A', 'B', 'tot'], slot = gw / 3;
          nomi.forEach((n, k) => gBarre.appendChild(T(x0 + slot * (k + 0.5), top + H - 6 * z, n === 'tot' ? 'totale' : n, { fs: 12, a: { 'text-anchor': 'middle' } })));
          if (!st) { gBarre.appendChild(T(x0 + gw / 2, (zona0 + zona1) / 2 + 6 * z, '?', { fs: 22, a: { 'text-anchor': 'middle', fill: 'var(--testo3)', stroke: 'none' } })); return; }
          const prima = g === 'p' ? pv(s0) : ev(s0), ora = g === 'p' ? pv(st) : ev(st);
          let scala;
          if (g === 'p') {
            const fA = p.mA * u.vAf, fB = p.mB * u.vBf;
            scala = Math.max(0.5, Math.abs(prima[0]), Math.abs(prima[1]), Math.abs(prima[2]), Math.abs(fA), Math.abs(fB));
          } else scala = Math.max(0.5, prima[2]);
          const y0 = g === 'p' ? (zona0 + zona1) / 2 : zona1, alt = g === 'p' ? (zona1 - zona0) / 2 : zona1 - zona0;
          gBarre.appendChild(el('line', { x1: x0 + 8, y1: y0, x2: x0 + gw - 8, y2: y0, stroke: 'var(--testo2)', 'stroke-width': 1, opacity: .6 }));
          const col = g === 'p' ? 'var(--s1)' : 'var(--s3)', bwid = Math.min(slot * 0.42, 34 * z);
          nomi.forEach((n, k) => {
            if (n === 'B' && L.mistero && !libero) return;
            const cx = x0 + slot * (k + 0.5), hp = prima[k] / scala * alt, ho = ora[k] / scala * alt;
            if (Math.abs(ho) > 0.3) gBarre.appendChild(el('rect', { x: cx - bwid / 2, y: Math.min(y0, y0 - ho), width: bwid, height: Math.abs(ho), rx: 2, fill: col, opacity: n === 'tot' ? 0.95 : 0.7 }));
            if (Math.abs(hp) > 0.3) gBarre.appendChild(el('rect', { x: cx - bwid / 2 - 3, y: Math.min(y0, y0 - hp), width: bwid + 6, height: Math.abs(hp), rx: 2, fill: 'none', stroke: 'var(--testo)', 'stroke-width': 1.4, 'stroke-dasharray': '4 3', opacity: .75 }));
            /* l'energia che sta nella molla mentre è schiacciata: torna tutta, perché la molla è elastica */
            if (g === 'E' && n === 'tot' && p.tipo === 'molla' && st.contatto && prima[2] - ora[2] > 0.01) {
              const hm = (prima[2] - ora[2]) / scala * alt;
              gBarre.appendChild(el('rect', { x: cx - bwid / 2, y: y0 - ho - hm, width: bwid, height: hm, fill: col, opacity: .25 }));
              gBarre.appendChild(T(cx + bwid / 2 + 3, y0 - ho - hm / 2 + 4 * z, 'molla', { fs: 12, a: { fill: 'var(--s3)' } }));
            }
            /* il valore di adesso sulla barra piena; quello di prima sul tratteggio, solo se si distingue */
            const sopra = h => h >= 0 ? y0 - h - 5 * z : y0 - h + 14 * z;
            gBarre.appendChild(T(cx, sopra(ho), num(ora[k], 1), { fs: 12, a: { 'text-anchor': 'middle', fill: n === 'tot' ? 'var(--testo)' : 'var(--testo2)' } }));
            const sporge = (hp >= 0) === (ho >= 0) || Math.abs(ho) < 0.3 ? Math.abs(hp) - Math.abs(ho) > 15 * z : Math.abs(hp) > 15 * z;
            if (sporge) gBarre.appendChild(T(cx, sopra(hp), num(prima[k], 1), { fs: 12, peso: 400, a: { 'text-anchor': 'middle', fill: 'var(--testo3)' } }));
          });
        });
      }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaStato(); }

      /* ---------------- pannello ---------------- */
      function visibili() { return libero ? LIBERO.liberi : liv().liberi; }
      function aggiornaParametri() {
        const vis = visibili();
        CHIAVI.forEach(k => {
          box[k].hidden = vis.indexOf(k) < 0;
          box[k].querySelector('output').textContent = nV(p[k]);
          box[k].querySelectorAll('button').forEach(bt => { const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? p[k] <= LIM[k][0] : p[k] >= LIM[k][1]); });
        });
        parametriEl.classList.toggle('uno', vis.length === 1 && !libero);
        paraurtiEl.hidden = !libero;
        paraurtiEl.querySelectorAll('[data-u]').forEach(bt => { bt.setAttribute('aria-pressed', bt.dataset.u === p.tipo); bt.disabled = animando; });
        b.casuale.disabled = animando;
        b.pesa.hidden = libero || !liv().mistero;
        b.pesa.disabled = animando || finito;
      }
      /* il ponte con la teoria: la formula con i numeri; il risultato dopo la corsa (in modalità libera subito) */
      function aggiornaFormula() {
        const L = liv(), u = urto(parametriUrto()), ok = libero || fatto();
        const pezzi = [];
        const simbolo = s => '<span class="pezzo simbolo">' + ctx.tex(s) + '</span>';
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = (s, vale) => (vale === undefined ? ok : vale) ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        const m = v => tPos(v), f = tFat;
        if (L.formula === 'V' || L.formula === 'cm') {
          const n = L.formula === 'V' ? 'V' : 'v_{cm}', val = L.formula === 'V' ? u.vAf : u.vcm;
          pezzi.push(simbolo(n + ' = \\dfrac{m_A \\cdot v_A + m_B \\cdot v_B}{m_A + m_B}'));
          pezzi.push(numerico(n + ' = \\dfrac{' + m(p.mA) + ' \\cdot ' + f(p.vA) + ' + ' + m(p.mB) + ' \\cdot ' + f(p.vB) + '}{' + m(p.mA) + ' + ' + m(p.mB) + '}\\,\\text{m/s}'));
          pezzi.push(ris(uguale(val, 2) + texNum(val, 2) + '\\,\\text{m/s}', L.formula === 'V' ? (ok && u.tocca) : ok));
        } else if (L.formula === 'vA1') {
          pezzi.push(simbolo("v_A' = \\dfrac{m_A - m_B}{m_A + m_B} \\cdot v_A"));
          pezzi.push(numerico("v_A' = \\dfrac{" + m(p.mA) + ' - ' + m(p.mB) + '}{' + m(p.mA) + ' + ' + m(p.mB) + '} \\cdot ' + f(p.vA) + '\\,\\text{m/s}'));
          pezzi.push(ris(uguale(u.vAf, 2) + texNum(u.vAf, 2) + '\\,\\text{m/s}'));
        } else if (L.formula === 'p') {
          pezzi.push(simbolo("m_A \\cdot v_A + m_B \\cdot v_B = m_A \\cdot v_A' + m_B \\cdot v_B'"));
          pezzi.push('<span class="pezzo">' + ctx.tex(m(p.mA) + ' \\cdot ' + f(p.vA) + ' + ' + m(p.mB) + ' \\cdot ' + f(p.vB) + " = " + m(p.mA) + " \\cdot v_A' + " + m(p.mB) + ' \\cdot 3') + '</span>');
          if (ok) pezzi.push('<span class="pezzo esito">' + ctx.tex("v_A' " + uguale(u.vAf, 2) + texNum(u.vAf, 2) + '\\,\\text{m/s}') + '</span>');
        } else if (L.formula === 'massa') {
          pezzi.push(simbolo('V = \\dfrac{m_A \\cdot v_A}{m_A + m_B}'));
          pezzi.push(numerico('V = \\dfrac{1 \\cdot ' + f(p.vA) + '}{1 + m_B}\\,\\text{m/s}'));
          pezzi.push(ris('\\approx ' + texNum(u.vAf, 2) + '\\,\\text{m/s}', ok && u.tocca));
        } else {   /* libero */
          pezzi.push(simbolo('p_{tot} = m_A \\cdot v_A + m_B \\cdot v_B'));
          pezzi.push(numerico('p_{tot} = ' + m(p.mA) + ' \\cdot ' + f(p.vA) + ' + ' + m(p.mB) + ' \\cdot ' + f(p.vB)));
          const dp = u.p0 % 1 === 0 ? 0 : (u.p0 * 2 % 1 === 0 ? 1 : 2);   /* masse e velocità a passi di 0,5: p è esatto con al più due decimali */
          pezzi.push(ris('= ' + texNum(u.p0, dp) + '\\,\\text{kg} \\cdot \\text{m/s}'));
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
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaStato(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; radice.classList.remove('in-libero');
        livello = n; const L = LIVELLI[n];
        p = { mA: L.A.m, vA: L.A.v, mB: L.B.m, vB: L.B.v, tipo: L.tipo, pr: 0, mg: 1 };
        prove = 0; pesate = 0; finito = false; corsa = null; detti = {}; sbagli = 0;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }

      /* ---------------- la corsa ---------------- */
      function via() {
        if (animando || finito) return;
        const L = liv();
        if (Math.abs(p.vA) < 0.005 && Math.abs(p.vB) < 0.005) { msg.textContent = 'Tutti e due fermi: non succede niente.'; msg.className = 'lab-messaggio'; return; }
        const u = urto(parametriUrto()), tFine = durata(u, L);
        aiutoEl.hidden = true;
        if (!libero) prove++;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.via.disabled = true; b.ric.disabled = true;
        corsa = { chiave: chiave(), mA: p.mA, vA: p.vA, u, st: u.stato(0), letture: (L.fotocellule || []).map(() => null), finita: false, fattore: Math.max(1, tFine / 4.5) };
        aggiornaParametri(); aggiornaLivelli(); aggiornaFormula();
        const t0 = performance.now(), fattore = corsa.fattore;
        let prima = corsa.st;
        const passo = ora => {
          const t = Math.min(tFine, (ora - t0) / 1000 * fattore);
          const st = u.stato(t);
          /* le fotocellule leggono la velocità di chi taglia il raggio */
          (L.fotocellule || []).forEach((f, i) => {
            [['xA', 'vA'], ['xB', 'vB']].forEach(c => { if (!corsa.letture[i] && ((prima[c[0]] - f.x) * (st[c[0]] - f.x) < 0 || (st[c[0]] === f.x && prima[c[0]] !== f.x))) corsa.letture[i] = { v: st[c[1]], t }; });
          });
          prima = st; corsa.st = st;
          disegnaStato();
          if (t < tFine) { raf = requestAnimationFrame(passo); return; }
          raf = 0; arriva(u);
        };
        raf = requestAnimationFrame(passo);
      }

      function arriva(u) {
        animando = false; b.via.disabled = false; b.ric.disabled = false;
        corsa.finita = true;
        const L = liv();
        aggiorna(); aggiornaLivelli();
        if (libero) { msg.textContent = osserva(u); msg.className = 'lab-messaggio'; return; }
        const v = verdetto(L, u, p.pr);
        if (v.ok === null) { msg.textContent = v.testo + ' Ora scegli la massa di B e premi Pesa, o lancia ancora.'; msg.className = 'lab-messaggio'; return; }
        if (v.ok) { vinci(v.testo, u); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        sbagli++;
        erroreTipico(L, u);
      }

      function pesa() {
        if (animando || finito) return;
        const L = liv();
        pesate++;
        if (Math.abs(p.mg - L.B.m) < 0.01) { vinci('Sì: B pesa ' + nV(L.B.m) + '\u00a0kg.', null); return; }
        const u = corsa && corsa.finita && corsa.u.tocca ? corsa.u : null;
        if (u) {
          const atteso = corsa.mA * corsa.vA / (corsa.mA + p.mg);   /* la velocità di A di quella corsa, anche se poi è cambiata */
          msg.textContent = 'No: con ' + nV(p.mg) + '\u00a0kg e A lanciato a ' + nV(corsa.vA) + '\u00a0m/s, i carrelli uniti andrebbero a ' + num(atteso, 2) + '\u00a0m/s, non a ' + num(u.vAf, 2) + '\u00a0m/s.';
        } else msg.textContent = 'No, non pesa ' + nV(p.mg) + '\u00a0kg. Lancia A e guarda che cosa legge la fotocellula.';
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        if (pesate >= 2) dici('massa', 'Prima dell\'urto p = 1\u00a0kg · v<sub>A</sub>; dopo, (1\u00a0kg + m<sub>B</sub>) · V. Le due quantità di moto sono uguali.');
      }

      function vinci(testo, u) {
        finito = true; b.via.disabled = true; b.pesa.disabled = true;
        const conta = LIVELLI[livello].mistero ? ' Prove: ' + prove + ', pesate: ' + pesate + '.' : (prove === 1 ? ' Alla prima prova.' : ' Prove: ' + prove + '.');
        msg.innerHTML = '<span class="vinto">' + testo + conta + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello](u || (corsa && corsa.u)), { espressione: prove <= 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(k, testo) {
        if (detti[k]) return; detti[k] = true;
        ctx.zenone(testo, { html: true, tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, u) {
        const o = L.obiettivo;
        if (!u.tocca) return;
        if (o === 'V' && p.vA === 2) { dici('meta', 'Uniti, la massa raddoppia: con la stessa quantità di moto la velocità si dimezza.'); return; }
        if (o === 'fermi' && p.vB === -3) { dici('stessa', 'Stessa velocità non vuol dire stessa quantità di moto: B pesa più di A, e conta m·v.'); return; }
        if (o === 'Afermo' && sbagli >= 2) { dici('verso', 'Se B pesa più di A, A rimbalza; se pesa meno, A prosegue.'); return; }
        if (o === 'Aindietro' && u.vAf >= 0) { dici('indietro', 'A torna indietro solo se urta un carrello più pesante di lui.'); return; }
        if (o === 'cm' && p.vB === -3) { dici('cm', 'Il centro di massa sta fermo quando la quantità di moto totale è zero: conta m·v, non solo v.'); return; }
        if (o === 'cm' && sbagli >= 2) { dici('cm2', 'Il centro di massa va a p totale diviso massa totale: per fermarlo serve p totale zero.'); return; }
        if (o === 'previsione') {
          const daEnergia = Math.sqrt(Math.max(0, (u.E0 - 0.5 * p.mB * 9) * 2 / p.mA));   /* il conto sbagliato: energia conservata */
          if (Math.abs(p.pr - daEnergia) < 0.3) { dici('energia', 'Hai conservato l\'energia? Con la gomma se ne perde una parte: quella che torna sempre è la quantità di moto.'); return; }
          if (p.pr === 3) { dici('uguale', 'A non va come B: i carrelli hanno masse diverse. Scrivi la quantità di moto prima e dopo.'); return; }
        }
      }

      /* ---------------- modalità libera ---------------- */
      function osserva(u) {
        if (!u.tocca) return 'Non si toccano: A non raggiunge B.';
        if (u.esce) return 'Escono dalla rotaia prima di urtarsi.';
        let t = 'Ec: ' + num(u.E0, 1) + '\u00a0J → ' + num(u.Ef, 1) + '\u00a0J. ';
        if (p.tipo === 'velcro') t += 'Restano uniti: si perde energia cinetica, quantità di moto no.';
        else if (p.tipo === 'molla') t += (p.mA === p.mB && Math.abs(p.vB) < 0.005) ? 'Masse uguali e B fermo: si scambiano le velocità.' : 'Con la molla l\'energia cinetica si conserva tutta.';
        else t += 'Con la gomma se ne perde una parte.';
        return t;
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), prove, pesate, finito, corsa, detti: Object.assign({}, detti), sbagli, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; radice.classList.add('in-libero'); aiutoEl.hidden = true;
        p = { mA: LIBERO.A.m, vA: LIBERO.A.v, mB: LIBERO.B.m, vB: LIBERO.B.v, tipo: LIBERO.tipo, pr: 0, mg: 1 };
        corsa = null; finito = false;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; radice.classList.remove('in-libero'); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; prove = z.prove; pesate = z.pesate; finito = z.finito; corsa = z.corsa; detti = z.detti; sbagli = z.sbagli;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.via.disabled = finito;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => lo + Math.round(Math.random() * (hi - lo) / s) * s;
        const tipi = ['velcro', 'gomma', 'molla'];
        p.mA = r(0.5, 4, 0.5); p.mB = r(0.5, 4, 0.5); p.vA = r(1, 5, 0.5); p.vB = Math.random() < 0.4 ? 0 : r(-4, 2, 0.5);
        if (p.vB >= p.vA) p.vB = 0;
        p.tipo = tipi[Math.floor(Math.random() * 3)];
        corsa = null; msg.textContent = ''; ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        if (animando || visibili().indexOf(k) < 0) return false;
        const lim = LIM[k];
        const nuovo = morsa(Math.round((p[k] + d * lim[2]) * 10) / 10, lim[0], lim[1]);
        if (nuovo === p[k]) return false;
        p[k] = nuovo;
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        aggiorna(); return true;
      }
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(60, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]');
        if (bt) { if (Date.now() - ultimoGiu >= 600) cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d); return; }
        const pu = ev.target.closest('[data-u]');
        if (pu && !animando && libero) { p.tipo = pu.dataset.u; msg.textContent = ''; aggiorna(); }
      });

      /* trascinare una freccia: la velocità è la distanza orizzontale fra il centro del carrello e il dito */
      let presa = null;
      function scegliPresa(c) {
        const L = liv(), vis = visibili(), cand = [];
        const st = corsa && corsa.st && corsa.chiave === chiave() && !corsa.finita ? corsa.st : null;
        if (st) return null;
        if (vis.indexOf('vA') >= 0) cand.push(['vA', PX(L.A.x), S.yArr]);
        if (vis.indexOf('vB') >= 0) cand.push(['vB', PX(L.B.x), S.yArr]);
        if (vis.indexOf('pr') >= 0) cand.push(['pr', PX(L.A.x), S.yPre]);
        let meglio = null, dm = Infinity;
        cand.forEach(k => { const tip = k[1] + p[k[0]] * S.K, d = Math.min(Math.hypot(c.x - tip, c.y - k[2]), Math.hypot(c.x - k[1], c.y - k[2]) + 10); if (d < dm) { dm = d; meglio = k; } });
        return dm < 70 * S.z ? meglio : null;
      }
      function punto(ev) { const m = svg.getScreenCTM(); if (!m) return null; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(m.inverse()); }
      function tira(ev) {
        const c = punto(ev); if (!c || !presa) return;
        const k = presa[0], lim = LIM[k];
        const v = morsa(Math.round((c.x - presa[1]) / S.K * 2) / 2, lim[0], lim[1]);
        if (v !== p[k]) { p[k] = v; if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; } aggiorna(); }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        const c = punto(ev); if (!c) return;
        const k = scegliPresa(c); if (!k) return;
        presa = k; aiutoEl.hidden = true;
        if (corsa && corsa.chiave === chiave()) { corsa = null; }   /* si riparte dalla posizione iniziale */
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        tira(ev); ev.preventDefault();
      });
      const muovi = ev => { if (presa) { tira(ev); ev.preventDefault(); } };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', via);
      b.pesa.addEventListener('click', pesa);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { corsa = null; msg.textContent = ''; aggiorna(); return; }
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

      avviaLivello(livello);
      let forma = '';
      const ridimensiona = () => {
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      };
      let ro = null;
      if (window.ResizeObserver) { ro = new ResizeObserver(ridimensiona); ro.observe(svg); } else window.addEventListener('resize', ridimensiona);

      return function smonta() {
        cancelAnimationFrame(raf); fermaRipeti();
        if (ro) ro.disconnect(); else window.removeEventListener('resize', ridimensiona);
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
