/* Laboratorio «Il banco ottico» — lenti sottili, convergenti e divergenti (argomento ottica, secondo anno).
   Sul banco, un righello in centimetri, stanno una candela, una lente e uno schermo (o un occhio). Si spostano i pezzi,
   poi si accende la candela: sullo schermo compare quello che la lente ci proietta, nitido o sfocato.
   Fisica: lente sottile ideale con il tracciamento dei raggi (all'attraversamento della lente la pendenza u del raggio
   diventa u − y/f), che dà esattamente 1/p + 1/q = 1/f e G = |q|/p. Lo sfocato è vero: i raggi che partono dalla punta
   della fiamma e passano per i bordi della lente (larga D = 10 cm) arrivano sullo schermo in una macchia larga b;
   l'immagine è nitida se b ≤ 5 mm, cioè con lo schermo a meno del 5% di q dall'immagine.
   Nei livelli niente raggi prima di vincere (sul banco vero non si vedono: si vede solo lo schermo), e niente anteprima:
   la candela si accende con «Accendi». In modalità libera la candela è sempre accesa e i raggi si vedono sempre.
   Colori come nella teoria: raggi arancio (2), lenti azzurre (1), immagini e fuochi viola (4), risultati verdi (3).
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). Specchi e rifrazione stanno nel laboratorio «laser». */
(function () {
  const STILE = `
    .lab-banco-ottico .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; cursor: ew-resize; }
    .lab-banco-ottico .lab-scena > svg { width: 100%; height: 100%; }
    .lab-banco-ottico svg text { font-family: var(--font); }
    .lab-banco-ottico .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-banco-ottico .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-banco-ottico .consegna:empty { display: none; }
    .lab-banco-ottico .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .5em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.6em; }
    .lab-banco-ottico .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-banco-ottico .formula .ignoto { color: var(--testo3); }
    .lab-banco-ottico .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-banco-ottico .formula .nota { color: var(--testo2); font-size: .9em; }
    .lab-banco-ottico .formula .simbolo { margin-right: .5em; }
    @container lab (max-width: 420px) { .lab-banco-ottico .formula .simbolo { display: none; } .lab-banco-ottico .formula { font-size: 1rem; gap: 2px .4em; } }
    .lab-banco-ottico .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-banco-ottico .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-banco-ottico .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-banco-ottico .lab-barra { gap: 5px; } .lab-banco-ottico .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-banco-ottico .lab-barra .btn[hidden] { display: none; }
    .lab-banco-ottico .btn[disabled] { opacity: .38; cursor: default; }
    .lab-banco-ottico .lab-parametri { max-width: 780px; }
    .lab-banco-ottico .lab-param[hidden] { display: none; }
    .lab-banco-ottico .lab-param .nome { min-width: 3.4em; font-size: .85rem; color: var(--testo2); }
    .lab-banco-ottico .lab-param output { min-width: 3.6em; white-space: nowrap; font-size: .95rem; }
    .lab-banco-ottico .lab-param.solo { grid-column: 1 / -1; }
    .lab-banco-ottico .lab-parametri .b-casuale { grid-column: 1 / -1; justify-self: center; }
    .lab-banco-ottico .lab-parametri .b-casuale[hidden] { display: none; }
    @container lab (max-width: 460px) { .lab-banco-ottico .lab-param { gap: 2px; } .lab-banco-ottico .lab-param .btn { min-width: 36px; min-height: 36px; padding: 0 4px; } .lab-banco-ottico .lab-parametri { gap: 6px 4px; } .lab-banco-ottico .lab-param .nome { min-width: 0; font-size: .75rem; letter-spacing: -.01em; } .lab-banco-ottico .lab-param output { min-width: 0; padding: 0 1px; font-size: .82rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-banco-ottico .lab-parametri { grid-template-columns: 1fr; } }   /* pannello di lato, stretto: un comando per riga */
    .lab-banco-ottico .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-banco-ottico.riquadro-dx .conta { right: auto; left: 10px; }
    .lab-banco-ottico .vinto { display: inline-block; animation: lab-banco-ottico-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-banco-ottico-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    /* layout fermo: i numeri che cambiano e i cambi di livello non spostano niente */
    .lab-banco-ottico .consegna { min-height: 4.2em; }   /* righe riservate alla consegna più lunga */
    .lab-banco-ottico .formula { height: 7.6rem; min-height: 0; overflow: hidden; align-content: center; }   /* altezza fissa: un caso troppo grande si rimpicciolisce (adattaFormula) */
    .lab-banco-ottico .lab-messaggio { min-height: 3em; }   /* due righe riservate al messaggio */
    @container lab (max-width: 420px) { .lab-banco-ottico .consegna { min-height: 6.1em; } .lab-banco-ottico .formula { height: 5rem; } }
    .lab-banco-ottico .lab-param output { width: 6.2ch; min-width: 6.2ch; text-align: center; }   /* larga quanto «−100 cm»: le cifre non spostano i pulsanti */
    .lab-banco-ottico .lab-barra .b-ric { display: inline-grid; justify-items: center; align-content: center; gap: 0; }   /* larga già quanto l'etichetta più lunga: vincere non sposta gli altri pulsanti */
    .lab-banco-ottico .lab-barra .b-ric::after { content: 'Ricomincia dal primo'; content: 'Ricomincia dal primo' / ''; height: 0; overflow: hidden; visibility: hidden; }
    /* pannello alto uguale in ogni livello e nel Libero (il caso più alto): pallini, consegna e comandi stanno in alto,
       formula, messaggio e barra in basso; dove i comandi sono meno resta spazio vuoto in mezzo, e niente salta */
    .lab-banco-ottico .lab-lato > .formula { margin-top: auto; }
    @container lab (max-aspect-ratio: 5 / 4) { .lab-banco-ottico .lab-lato { min-height: 21.7rem; } .lab-banco-ottico .lab-barra { min-height: 2.31rem; } }
    @container lab (min-aspect-ratio: 5 / 4) { .lab-banco-ottico .lab-lato { justify-content: flex-start; padding-top: max(14px, calc((100cqh - 30.7rem) / 2)); padding-bottom: max(14px, calc((100cqh - 30.7rem) / 2)); } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli) ----------------
     Coordinate in centimetri: x lungo il banco, y verso l'alto dall'asse ottico. */
  const H = 4;              /* la candela: dalla base (sull'asse) alla punta della fiamma */
  const D = 10;             /* diametro delle lenti */
  const B_MAX = 0.5;        /* nitida se ogni punto diventa una macchia di al più 5 mm */
  const ALFA = 0.04;        /* inclinazione dei raggi che arrivano dalla torre lontana (cannocchiale) */
  const MEZZO_SCHERMO = 12; /* lo schermo è alto 24 cm */
  const VERG_MAX = 0.005;   /* occhio rilassato: raggi paralleli, cioè immagine dell'oculare oltre 2 m */
  const F_LIBERO = [-30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30];

  /* un raggio che parte da (x0, y0) con pendenza u attraversa le lenti e arriva a xFine */
  function traccia(x0, y0, u, lenti, xFine) {
    const pts = [[x0, y0]]; let x = x0, y = y0;
    for (let i = 0; i < lenti.length; i++) {
      const l = lenti[i];
      if (l.x <= x) continue;
      if (l.x > xFine) break;
      y += u * (l.x - x); x = l.x; pts.push([x, y]); u -= y / l.f;
    }
    y += u * (xFine - x); pts.push([xFine, y]);
    return { pts, y, u };
  }
  /* dove si forma l'immagine: 1/q = 1/f − 1/p (Infinity con la candela nel fuoco) */
  function coniugato(pp, f) { const inv = 1 / f - 1 / pp; return Math.abs(inv) < 1e-9 ? Infinity : 1 / inv; }

  /* candela, una lente e lo schermo: che cosa compare sullo schermo */
  function schermo(p) {
    const pp = p.l - p.o, lenti = [{ x: p.l, f: p.f }];
    const y = ya => traccia(p.o, H, (ya - H) / pp, lenti, p.s).y;
    const yc = y(0), b = Math.abs(y(D / 2) - y(-D / 2));
    return { m: yc / H, b, q: coniugato(pp, p.f), pp, ss: p.s - p.l };
  }
  /* candela, una lente e l'occhio subito dietro: com'è l'immagine che l'occhio guarda */
  function occhio(p) {
    const pp = p.l - p.o, q = coniugato(pp, p.f);
    if (!isFinite(q)) return { tipo: 'infinito', q, pp };
    return { tipo: q < 0 ? 'virtuale' : 'reale', q, pp, G: Math.abs(q) / pp };
  }
  /* torre lontanissima, obiettivo, oculare, occhio: come escono i raggi dall'oculare */
  function cannocchiale(p) {
    const lenti = [{ x: p.l, f: p.f }, { x: p.l2, f: p.f2 }], a = D * 0.3, x0 = p.l - 1;
    const r = ya => traccia(x0, ya - ALFA, ALFA, lenti, p.l2);
    const r0 = r(0), r1 = r(a), dy = r1.y - r0.y;
    const verg = Math.abs(dy) < 1e-9 ? Infinity : -(r1.u - r0.u) / dy;   /* 1/q2: zero se escono paralleli */
    return { verg, q2: verg === Infinity ? 0 : (Math.abs(verg) < 1e-9 ? Infinity : 1 / verg), G: r0.u / ALFA, d: p.l2 - p.l, p2: p.l2 - p.l - p.f };
  }

  /* ---------------- livelli ----------------
     mobili: i pezzi che si spostano (o candela, l lente, s schermo, l2 oculare, f la lente da scegliere).
     Le soluzioni sono state contate con la prova dei livelli (posizioni a passi di 1 cm): fra parentesi. */
  const LIVELLI = [
    { tipo: 'nitida', inizio: { o: 0, l: 30, s: 75, f: 10 }, mobili: ['s'], vista: [-4, 100],
      consegna: 'Lente convergente con <b>f = 10&nbsp;cm</b>, candela a <b>30&nbsp;cm</b>. Sposta lo schermo dove l\'immagine è nitida.' },   /* s = 45 */
    { tipo: 'nitida', inizio: { o: 0, l: 22, s: 45, f: 10 }, mobili: ['l'], vista: [-4, 60],
      consegna: 'Lo schermo è fermo a <b>45&nbsp;cm</b> dalla candela. Sposta la lente (<b>f = 10&nbsp;cm</b>) per mettere a fuoco.' },   /* l = 15, 29, 30 */
    { tipo: 'due', inizio: { o: 0, l: 35, s: 50, f: 12 }, mobili: ['l'], vista: [-4, 64],
      consegna: 'Schermo a <b>50&nbsp;cm</b> dalla candela, lente con <b>f = 12&nbsp;cm</b>: due posizioni della lente mettono a fuoco. Trovale tutte e due.' },   /* l = 20 e 30 */
    { tipo: 'G', G: 1, inizio: { o: 0, l: 20, s: 50, f: 15 }, mobili: ['l', 's'], vista: [-4, 100],
      consegna: 'Con <b>f = 15&nbsp;cm</b> fai un\'immagine nitida <b>grande quanto la candela</b>: sposta lente e schermo.' },
    { tipo: 'G', G: 3, inizio: { o: 0, l: 40, s: 70, f: 15 }, mobili: ['l', 's'], vista: [-4, 100],
      consegna: 'Con <b>f = 15&nbsp;cm</b> fai un\'immagine nitida <b>tre volte più alta</b> della candela.' },
    { tipo: 'scegli', inizio: { o: 0, l: 30, s: 90, f: 10 }, mobili: ['f'], scelte: [-20, -10, 5, 10, 15, 20, 25, 30, 40], vista: [-4, 100],
      consegna: 'Lente a <b>30&nbsp;cm</b> dalla candela, schermo a <b>90&nbsp;cm</b> dalla candela: scegli la lente che mette a fuoco.' },   /* solo f = 20 */
    { tipo: 'lente', G: 2.5, inizio: { o: 2, l: 25, f: 10 }, mobili: ['o'], vista: [-2, 36], occhio: true,
      consegna: 'Lente d\'ingrandimento con <b>f = 10&nbsp;cm</b>: sposta la candela perché l\'occhio la veda <b>2,5 volte</b> più grande.' },   /* p = 6 */
    { tipo: 'cannocchiale', inizio: { l: 5, f: 50, l2: 40, f2: 10 }, mobili: ['l2'], vista: [-12, 80], occhio: true, lontano: true,
      consegna: 'Cannocchiale con obiettivo <b>f<sub>1</sub> = 50&nbsp;cm</b> e oculare <b>f<sub>2</sub> = 10&nbsp;cm</b>: sposta l\'oculare finché l\'occhio rilassato vede nitida la torre.' }   /* d = 60 */
  ];
  const LIBERO = { tipo: 'libero', inizio: { o: 0, l: 30, s: 60, f: 10 }, mobili: ['o', 'l', 's', 'f'], scelte: F_LIBERO, vista: [-4, 100] };
  const conSchermo = L => L.tipo !== 'lente' && L.tipo !== 'cannocchiale';
  const massimo = L => L.vista[1] - 3;

  /* il verdetto di una prova: { ok, testo, e } (il testo dice che cosa si vede, non che cosa fare) */
  function verdetto(L, p) {
    if (L.tipo === 'lente') {
      const e = occhio(p);
      if (e.tipo === 'infinito') return { ok: false, e, testo: 'Candela nel fuoco: i raggi escono paralleli e l\'immagine va all\'infinito.' };
      if (e.tipo === 'reale') return { ok: false, e, testo: 'L\'occhio vede solo una macchia: i raggi escono convergenti.' };
      if (Math.abs(e.G - L.G) <= 0.05 * L.G) return { ok: true, e, testo: 'Ingrandita ' + num(e.G, 1) + ' volte, dritta.' };
      return { ok: false, e, testo: 'Dritta e ingrandita ' + num(e.G, e.G < 10 ? 2 : 0) + ' volte.' };
    }
    if (L.tipo === 'cannocchiale') {
      const e = cannocchiale(p);
      if (Math.abs(e.verg) <= VERG_MAX) return { ok: true, e, testo: 'Nitida: i raggi escono paralleli, la torre è ' + num(Math.abs(e.G), 0) + ' volte più grande.' };
      return { ok: false, e, testo: 'Sfocata: i raggi escono ' + (e.verg > 0 ? 'convergenti' : 'divergenti') + ' dall\'oculare.' };
    }
    const e = schermo(p);
    if (e.b > B_MAX + 1e-9) {
      if (p.f < 0) return { ok: false, e, testo: 'Sullo schermo solo un chiarore: la lente divergente allarga i raggi.' };
      if (e.pp < p.f - 1e-9) return { ok: false, e, testo: 'Sullo schermo solo un chiarore largo: nessuna immagine.' };
      if (Math.abs(e.pp - p.f) < 1e-9) return { ok: false, e, testo: 'Una macchia larga quanto la lente: nessuna immagine.' };
      return { ok: false, e, testo: 'Sfocata: ogni punto diventa una macchia di ' + misura(e.b) + '.' };
    }
    const G = Math.abs(e.m);
    if (L.tipo === 'G' && Math.abs(G - L.G) > 0.1 * L.G) return { ok: false, e, aFuoco: true, testo: 'A fuoco, ma alta ' + num(G, 2) + ' volte la candela.' };
    return { ok: true, e, testo: 'A fuoco: reale, capovolta, alta ' + num(G, 2) + ' volte la candela.' };
  }

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    p => '1/q = 1/10 − 1/30 = 1/15: lo schermo va a 15\u00a0cm dalla lente, e l\'immagine è reale e capovolta.',
    p => 'Lente a ' + (p.l - p.o) + '\u00a0cm dalla candela. C\'è anche un\'altra posizione buona: al livello 3 le cercherai tutte e due.',
    p => 'Le due posizioni si scambiano p e q: una volta l\'immagine è ingrandita, l\'altra rimpicciolita.',
    p => 'Candela a 2f, immagine a 2f: p = q, e G = q/p = 1.',
    p => 'G = q/p = 3 vuol dire q = 3·p: con f = 15\u00a0cm viene p = 20\u00a0cm e q = 60\u00a0cm.',
    p => 'f = p·q/(p + q) = 30·60/90 = 20\u00a0cm. Una divergente qui non poteva funzionare.',
    p => 'Dentro la focale: q = −15\u00a0cm, virtuale, e G = 15/6 = 2,5. Nessuno schermo la raccoglie.',
    p => 'Oculare a f₁ + f₂ = 60\u00a0cm dall\'obiettivo: G = f₁/f₂ = 5, e la torre si vede capovolta.'
  ];

  const AIUTO = 'Sul banco ottico candela, lente e schermo stanno su un righello in centimetri. Trascina un pezzo nella scena oppure usa − e + (1\u00a0cm per volta). «Accendi» accende la candela: sullo schermo compare quello che la lente ci proietta. p è la distanza fra candela e lente, q quella fra lente e immagine, f la focale: 1/p + 1/q = 1/f, e G = |q|/p. L\'immagine è nitida se ogni punto della candela diventa una macchia di al più 5\u00a0mm (la lente è larga 10\u00a0cm): vuol dire lo schermo a meno del 5\u00a0% di q dall\'immagine. I raggi si vedono quando il livello è finito (nel cannocchiale già dopo «Accendi»).';
  const AIUTI = {
    1: ' La formula sotto ha già i tuoi numeri: lo schermo è a fuoco quando i due lati sono uguali.',
    2: ' Le due posizioni devono distare almeno 5\u00a0cm l\'una dall\'altra.',
    3: ' G = q/p: l\'immagine sullo schermo deve essere alta come la candela, con il 10\u00a0% di tolleranza.',
    4: ' G = q/p, con il 10\u00a0% di tolleranza. Servono tutte e due le cose: a fuoco e tre volte più alta.',
    5: ' Le lenti con f negativa sono divergenti. Con − e + passi da una lente all\'altra.',
    6: ' Qui non c\'è lo schermo: guarda l\'occhio a destra della lente. G = |q|/p deve valere 2,5 (tolleranza 5\u00a0%).',
    7: ' La torre è così lontana che i suoi raggi arrivano paralleli: l\'obiettivo ne fa un\'immagine a q₁ = f₁ = 50\u00a0cm. Quell\'immagine fa da oggetto per l\'oculare. L\'occhio rilassato vuole raggi paralleli: l\'immagine dell\'oculare deve stare oltre 2\u00a0m. Qui i raggi si vedono già dopo «Accendi».'
  };
  const AIUTO_LIBERO = 'In modalità libera la candela è sempre accesa e i raggi si vedono sempre: il raggio parallelo all\'asse, quello per il centro della lente e quello per il fuoco. Sposta candela, lente e schermo, e cambia la lente: con f negativa è divergente. L\'immagine viola è reale se i raggi si incontrano davvero, virtuale (tratteggiata) se si incontrano solo i loro prolungamenti. «Casuale» propone una situazione a caso.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  function texN(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : texNum(v, 1); }
  function misura(b) { return b < 0.95 ? Math.max(1, Math.round(b * 10)) + '\u00a0mm' : num(b, 1) + '\u00a0cm'; }
  function cm(v) { return num(v, Math.abs(v - Math.round(v)) < 1e-9 ? 0 : 1) + '\u00a0cm'; }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  QUANTO.registraLab({
    id: 'banco-ottico',
    fisica: { schermo, occhio, cannocchiale, verdetto, coniugato, LIVELLI, conSchermo, massimo },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-banco-ottico')) { const s = document.createElement('style'); s.id = 'stile-lab-banco-ottico'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-banco-ottico');
      const param = (k, nome, giu, su) => `<div class="lab-param" data-p="${k}"><span class="nome">${nome}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="${giu}">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="${su}">+</button></div>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: candela sempre accesa, raggi visibili, lente e posizioni le scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              ${param('o', 'candela', 'candela a sinistra', 'candela a destra')}
              ${param('l', 'lente', 'lente a sinistra', 'lente a destra')}
              ${param('s', 'schermo', 'schermo a sinistra', 'schermo a destra')}
              ${param('l2', 'oculare', 'oculare a sinistra', 'oculare a destra')}
              ${param('f', ctx.tex('f'), 'lente precedente', 'lente successiva')}
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-accendi">🕯️ Accendi</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { accendi: q('.b-accendi'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = {}; ['o', 'l', 's', 'l2', 'f'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ---------------- */
      let livello = 0, p = {}, prove = 0, finito = false, acceso = false, luce = 0, raf = 0;
      let ultimo = null;                 /* ultima prova: { p, v } */
      let presi = [], detti = {}, sbagli = 0;
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const stessa = (a, c) => a && c && a.o === c.o && a.l === c.l && a.s === c.s && a.f === c.f && a.l2 === c.l2;
      const raggiVisibili = () => libero || finito || (liv().lontano && acceso);

      /* ---------------- scena: SVG in pixel veri, ridisegnata quando cambia la forma dello spazio ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un banco ottico con una candela, una lente e uno schermo', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const defs = el('defs');
      const filtro = el('filter', { id: 'bo-sfoca', x: '-60%', y: '-60%', width: '220%', height: '220%' });
      const sfoca = el('feGaussianBlur', { stdDeviation: 0 }); filtro.appendChild(sfoca); defs.appendChild(filtro);
      const filtro2 = el('filter', { id: 'bo-sfoca-banco', x: '-60%', y: '-20%', width: '220%', height: '140%' });
      const sfoca2 = el('feGaussianBlur', { stdDeviation: 0 }); filtro2.appendChild(sfoca2); defs.appendChild(filtro2);
      const clip = el('clipPath', { id: 'bo-riquadro' }); const clipR = el('rect', { rx: 6 }); clip.appendChild(clipR); defs.appendChild(clip);
      svg.appendChild(defs);
      const gFondo = el('g'), gRaggi = el('g'), gPezzi = el('g'), gLuce = el('g'), gQuote = el('g'), gRiq = el('g');
      [gFondo, gRaggi, gPezzi, gLuce, gQuote, gRiq].forEach(g => svg.appendChild(g));

      /* geometria: S = { w, h, U (px per cm lungo il banco), V (px per cm in altezza: le altezze sono ingrandite,
         come nei disegni di ottica; le rette restano rette e i punti d'incontro restano quelli), ox, oy (asse), I (riquadro) } */
      let S = { w: 300, h: 200, U: 3, V: 6, x0: 0, oy: 100, I: 100, ix: 8, iy: 8, rotaia: 150 };
      const PX = x => S.ox + (x - S.x0) * S.U, PY = y => S.oy - y * S.V;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(240, Math.round(r.width)), h = Math.max(180, Math.round(r.height));
        const L = liv(), v0 = L.vista[0], v1 = L.vista[1];
        const U = (w - 16) / (v1 - v0);
        const meta = L.lontano ? 7 : (L.tipo === 'lente' ? 6.5 : 12.5);   /* mezza altezza da mostrare, in cm */
        const I = Math.round(morsa(Math.min(w, h) * 0.3, 92, 176));
        const giu = 44, su = 8;
        let alto = su + I + 8, V = (h - giu - alto) / (2 * meta);
        if (V < U * 1.1) { alto = su + 4; V = (h - giu - alto) / (2 * meta); }   /* poco spazio: il riquadro sta sopra la scena */
        V = morsa(V, U * 0.8, U * 4);
        const libera = h - giu - alto - 2 * meta * V;
        const oy = alto + meta * V + Math.max(0, libera) / 2;
        const dx = L.occhio ? w - I - 8 : 8;
        S = { w, h, U, V, x0: v0, ox: 8, oy, I, ix: dx, iy: su, rotaia: oy + meta * V + 6, meta };
        radice.classList.toggle('riquadro-dx', !!L.occhio);
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }

      const testo = (g, x, y, t, stile, a) => { const e = el('text', Object.assign({ x, y, fill: 'var(--testo2)', style: stile || 'font: 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, a || {})); if (Array.isArray(t)) t.forEach(pz => e.appendChild(typeof pz === 'string' ? document.createTextNode(pz) : el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, pz[0]))); else e.textContent = t; g.appendChild(e); return e; };

      /* il banco: la rotaia con il righello, e l'asse ottico */
      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), yR = S.rotaia, xA = PX(L.vista[0]), xB = PX(L.vista[1]);
        gFondo.appendChild(el('line', { x1: xA, y1: S.oy, x2: xB, y2: S.oy, stroke: 'var(--testo3)', 'stroke-width': 1, 'stroke-dasharray': '6 5' }));
        const xr = Math.max(0, PX(Math.max(L.vista[0], L.lontano ? -1 : -2)));
        gFondo.appendChild(el('rect', { x: xr, y: yR, width: S.w - xr, height: 9, rx: 2, fill: 'var(--testo2)', opacity: .55 }));
        const passo = [1, 2, 5, 10, 20].find(s => s * S.U >= 34) || 20;
        for (let x = 0; x <= L.vista[1]; x += passo) {
          if (x < L.vista[0]) continue;
          gFondo.appendChild(el('line', { x1: PX(x), y1: yR + 9, x2: PX(x), y2: yR + 14, stroke: 'var(--testo2)', 'stroke-width': 1.3 }));
          if (PX(x) < S.w - 20) testo(gFondo, PX(x), yR + 27, String(x), 'font: 12px var(--font)', { 'text-anchor': 'middle' });
        }
        testo(gFondo, S.w - 4, yR + 27, 'cm', 'font: 12px var(--font)', { 'text-anchor': 'end' });
      }

      /* la candela: base sull'asse (X, Y0 in pixel), k = pixel per cm in altezza (negativo: capovolta) */
      function candela(g, X, Y0, k, kx, accesa, sbiadita) {
        const largo = Math.max(7, 1.3 * kx);
        const corpo = el('rect', { x: X - largo / 2, y: Math.min(Y0, Y0 - 2.6 * k), width: largo, height: Math.abs(2.6 * k), rx: Math.min(3, largo / 3), fill: sbiadita ? 'none' : '#e9dcc0', stroke: sbiadita ? 'var(--testo3)' : '#a8906a', 'stroke-width': 1.2, 'stroke-dasharray': sbiadita ? '3 3' : 'none' });
        g.appendChild(corpo);
        g.appendChild(el('line', { x1: X, y1: Y0 - 2.6 * k, x2: X, y2: Y0 - 2.85 * k, stroke: 'var(--testo)', 'stroke-width': 1.4 }));
        const yb = Y0 - 2.75 * k, yt = Y0 - H * k, lw = Math.max(4, 0.55 * kx);
        const d = `M${X} ${yt} C${X + lw} ${yb + (yt - yb) * 0.45} ${X + lw} ${yb} ${X} ${yb} C${X - lw} ${yb} ${X - lw} ${yb + (yt - yb) * 0.45} ${X} ${yt} Z`;
        g.appendChild(el('path', { d, fill: sbiadita ? 'none' : (accesa ? '#ffb43a' : 'var(--sup)'), stroke: sbiadita ? 'var(--testo3)' : (accesa ? '#f07a1a' : 'var(--testo3)'), 'stroke-width': 1.2, 'stroke-dasharray': sbiadita ? '3 3' : 'none' }));
        if (accesa && !sbiadita) g.appendChild(el('path', { d: `M${X} ${yb + (yt - yb) * 0.5} C${X + lw * 0.45} ${yb + (yt - yb) * 0.2} ${X + lw * 0.4} ${yb} ${X} ${yb} C${X - lw * 0.4} ${yb} ${X - lw * 0.45} ${yb + (yt - yb) * 0.2} ${X} ${yb + (yt - yb) * 0.5} Z`, fill: '#fff3b0' }));
      }
      /* la lente vista di taglio: biconvessa se f > 0, biconcava se f < 0 */
      function lente(g, x, f, nome) {
        const X = PX(x), y1 = PY(D / 2), y2 = PY(-D / 2), w = Math.max(9, Math.min(16, 2 * S.U)), c = w;
        const d = f > 0
          ? `M${X} ${y1} Q${X + c} ${S.oy} ${X} ${y2} Q${X - c} ${S.oy} ${X} ${y1} Z`
          : `M${X - w / 2} ${y1} H${X + w / 2} Q${X + 1} ${S.oy} ${X + w / 2} ${y2} H${X - w / 2} Q${X - 1} ${S.oy} ${X - w / 2} ${y1} Z`;
        g.appendChild(el('line', { x1: X, y1: y2, x2: X, y2: S.rotaia, stroke: 'var(--testo2)', 'stroke-width': 3, opacity: .6 }));
        g.appendChild(el('path', { d, fill: 'var(--s1)', 'fill-opacity': .28, stroke: 'var(--s1)', 'stroke-width': 2 }));
        testo(g, X, y1 - 8, nome, 'font: 600 12px var(--font)', { 'text-anchor': 'middle', fill: 'var(--s1)' });
      }
      function fuochi(g, x, f) {   /* i due fuochi, viola */
        [-1, 1].forEach(s => {
          const X = PX(x + s * Math.abs(f));
          if (X < 4 || X > S.w - 4) return;
          g.appendChild(el('circle', { cx: X, cy: S.oy, r: 3.5, fill: 'var(--s4)' }));
          testo(g, X, S.oy + 16, 'F', 'font: 600 12px var(--font)', { 'text-anchor': 'middle', fill: 'var(--s4)' });
        });
      }
      function schermoDisegno(g, x) {
        const X = PX(x), w = Math.max(5, Math.min(9, 0.9 * S.U));
        g.appendChild(el('line', { x1: X, y1: PY(-MEZZO_SCHERMO), x2: X, y2: S.rotaia, stroke: 'var(--testo2)', 'stroke-width': 3, opacity: .6 }));
        g.appendChild(el('rect', { x: X - w / 2, y: PY(MEZZO_SCHERMO), width: w, height: 2 * MEZZO_SCHERMO * S.V, rx: 2, fill: '#efece4', stroke: 'var(--testo2)', 'stroke-width': 1.2 }));
        testo(g, X, Math.max(14, PY(MEZZO_SCHERMO) - 7), 'schermo', 'font: 600 12px var(--font)', { 'text-anchor': 'middle' });
      }
      function occhioDisegno(g, x) {   /* un occhio di profilo che guarda a sinistra */
        const X = PX(x), r = Math.max(9, Math.min(16, 2.2 * S.V));
        g.appendChild(el('path', { d: `M${X - r} ${S.oy} Q${X} ${S.oy - r * 1.1} ${X + r * 0.6} ${S.oy - r * 0.2} L${X + r * 0.6} ${S.oy + r * 0.2} Q${X} ${S.oy + r * 1.1} ${X - r} ${S.oy} Z`, fill: 'var(--sup)', stroke: 'var(--testo)', 'stroke-width': 1.5 }));
        g.appendChild(el('circle', { cx: X - r * 0.55, cy: S.oy, r: r * 0.32, fill: 'var(--testo)' }));
        testo(g, X, S.oy + r + 14, 'occhio', 'font: 600 12px var(--font)', { 'text-anchor': 'middle' });
      }
      function torre(g, X, Ybase, k, sbiadita) {   /* la torre lontana: alta 1 unità, k pixel per unità (negativo: capovolta) */
        const s = sbiadita ? { fill: 'none', stroke: 'var(--testo3)', 'stroke-dasharray': '3 3', 'stroke-width': 1 } : { fill: '#8f7f6a', stroke: '#5d5244', 'stroke-width': 1 };
        const w = Math.abs(k) * 0.32, top = Ybase - k * 0.82;
        g.appendChild(el('rect', Object.assign({ x: X - w / 2, y: Math.min(Ybase, top), width: w, height: Math.abs(k * 0.82) }, s)));
        const mer = Math.abs(k) * 0.1;
        [-1, 0, 1].forEach(i => g.appendChild(el('rect', Object.assign({ x: X + i * w * 0.36 - mer / 2, y: Math.min(top, top - k * 0.1), width: mer, height: Math.abs(k * 0.1) }, s))));
        g.appendChild(el('line', { x1: X, y1: top - k * 0.1, x2: X, y2: Ybase - k, stroke: sbiadita ? 'var(--testo3)' : 'var(--testo)', 'stroke-width': 1 }));
        if (!sbiadita) g.appendChild(el('path', { d: `M${X} ${Ybase - k} l${Math.abs(k) * 0.16} ${k * 0.05} l${-Math.abs(k) * 0.16} ${k * 0.05} z`, fill: 'var(--no)' }));
      }

      /* i pezzi sul banco, con le quote p e la distanza lente–schermo */
      function disegnaPezzi() {
        vuota(gPezzi); vuota(gQuote);
        const L = liv();
        if (L.lontano) {
          const kt = Math.min(4.8 * S.V, 70), X = Math.max(PX(L.vista[0]) + kt * 0.16 + 8, 30);
          torre(gPezzi, X, S.oy + kt / 2, kt, false);
          testo(gPezzi, X, Math.min(S.h - 4, S.oy + kt / 2 + 15), 'lontana', 'font: 12px var(--font)', { 'text-anchor': 'middle' });
          lente(gPezzi, p.l, p.f, ['f', ['1'], ' = ' + p.f + '\u00a0cm']);
          lente(gPezzi, p.l2, p.f2, ['f', ['2'], ' = ' + p.f2 + '\u00a0cm']);
          occhioDisegno(gPezzi, p.l2 + 4);
          quota(p.l, p.l2, ['d = ' + cm(p.l2 - p.l)], 0);
          return;
        }
        const Xo = PX(p.o);
        gPezzi.appendChild(el('line', { x1: Xo, y1: S.oy, x2: Xo, y2: S.rotaia, stroke: 'var(--testo2)', 'stroke-width': 3, opacity: .6 }));
        candela(gPezzi, Xo, S.oy, S.V, S.U, acceso || libero, false);
        fuochi(gPezzi, p.l, p.f);
        lente(gPezzi, p.l, p.f, ['f = ' + (p.f > 0 ? '' : '−') + Math.abs(p.f) + '\u00a0cm']);
        if (conSchermo(L)) schermoDisegno(gPezzi, p.s); else occhioDisegno(gPezzi, p.l + 3);
        quota(p.o, p.l, ['p = ' + cm(p.l - p.o)], 0);
        if (conSchermo(L)) quota(p.l, p.s, [cm(p.s - p.l)], 0);
        if (L.tipo === 'due' && presi.length && !libero) {   /* la posizione già trovata */
          const X = PX(presi[0]);
          gQuote.appendChild(el('path', { d: `M${X} ${S.rotaia + 1} l-6 -9 h12 z`, fill: 'var(--ok)' }));
          testo(gQuote, X, S.rotaia - 12, '✓ ' + (presi[0] - p.o) + '\u00a0cm', 'font: 600 12px var(--font)', { 'text-anchor': 'middle', fill: 'var(--ok)' });
        }
      }
      function quota(xa, xb, t, livelloQ) {
        const y = S.rotaia - 10 - livelloQ * 18, X1 = PX(xa), X2 = PX(xb);
        if (X2 - X1 < 6) return;
        gQuote.appendChild(el('line', { x1: X1 + 2, y1: y, x2: X2 - 2, y2: y, stroke: 'var(--testo3)', 'stroke-width': 1 }));
        [X1, X2].forEach(X => gQuote.appendChild(el('line', { x1: X, y1: y - 4, x2: X, y2: y + 4, stroke: 'var(--testo3)', 'stroke-width': 1 })));
        if (X2 - X1 > 40) testo(gQuote, (X1 + X2) / 2, y - 5, t, 'font: 600 12px var(--font)', { 'text-anchor': 'middle', fill: 'var(--testo)' });
      }
      /* i raggi (arancio) e l'immagine (viola): in modalità libera sempre, nei livelli solo a livello finito */
      /* un segmento tagliato al rettangolo della scena (Liang–Barsky): i raggi non escono dal disegno */
      function taglia(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1, pq = [[-dx, x1], [dx, S.w - x1], [-dy, y1], [dy, S.h - y1]];
        let t0 = 0, t1 = 1;
        for (let i = 0; i < 4; i++) {
          const a = pq[i][0], c = pq[i][1];
          if (Math.abs(a) < 1e-12) { if (c < 0) return null; continue; }
          const t = c / a;
          if (a < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
        }
        return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
      }
      const linea = (pts, a) => {
        let d = '', fine = null;
        for (let i = 1; i < pts.length; i++) {
          const sg = taglia(PX(pts[i - 1][0]), PY(pts[i - 1][1]), PX(pts[i][0]), PY(pts[i][1]));
          if (!sg) { fine = null; continue; }
          if (!fine || Math.abs(fine[0] - sg[0]) > 0.5 || Math.abs(fine[1] - sg[1]) > 0.5) d += 'M' + sg[0].toFixed(1) + ' ' + sg[1].toFixed(1) + ' ';
          d += 'L' + sg[2].toFixed(1) + ' ' + sg[3].toFixed(1) + ' ';
          fine = [sg[2], sg[3]];
        }
        return el('path', Object.assign({ d: d || 'M0 0', fill: 'none', stroke: 'var(--s2)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, a || {})); };
      function disegnaRaggi() {
        vuota(gRaggi);
        const L = liv();
        if (!raggiVisibili()) return;
        if (L.lontano) { raggiCannocchiale(); return; }
        const pp = p.l - p.o, f = p.f, qI = coniugato(pp, f), lenti = [{ x: p.l, f }];
        const fine = conSchermo(L) ? p.s : Math.min(L.vista[1] + 2, p.l + 9);
        const pend = [0, -H / pp];
        if (Math.abs(pp - f) > 0.4) { const u3 = -H / (pp - f); if (Math.abs(H + u3 * pp) <= D * 0.75) pend.push(u3); }   /* il raggio per il fuoco, se passa dentro la lente */
        const reale = isFinite(qI) && qI > 0, virtuale = isFinite(qI) && qI < 0;
        pend.forEach(u => {
          const tr = traccia(p.o, H, u, lenti, fine);
          gRaggi.appendChild(linea(tr.pts));
          const yl = tr.pts[1][1];
          if (reale && conSchermo(L) && qI > p.s - p.l && qI < 3000) {   /* lo schermo ferma la luce prima dell'immagine */
            const oltre = traccia(p.o, H, u, lenti, p.l + qI);
            gRaggi.appendChild(linea([[p.s, tr.y], [p.l + qI, oltre.y]], { 'stroke-dasharray': '2 5', opacity: .55, 'stroke-width': 1.6 }));
          }
          if (virtuale) gRaggi.appendChild(linea([[p.l, yl], [p.l + qI, -H * qI / pp]], { 'stroke-dasharray': '5 5', opacity: .7, 'stroke-width': 1.5 }));
        });
        if (isFinite(qI) && Math.abs(qI) < 3000) {
          const xI = p.l + qI, yI = -H * qI / pp;
          if (PX(xI) > 2 && PX(xI) < S.w - 2) frecciaImmagine(PX(xI), S.oy, morsa(PY(yI), 2, S.h - 2), virtuale);
        }
      }
      function frecciaImmagine(X, y0, y1, tratteggio) {
        const verso = y1 < y0 ? 1 : -1, pt = Math.min(9, Math.abs(y1 - y0) * 0.5);
        if (y1 <= 2 || y1 >= S.h - 2) { gRaggi.appendChild(el('line', { x1: X, y1: y0, x2: X, y2: y1, stroke: 'var(--s4)', 'stroke-width': 3, 'stroke-dasharray': tratteggio ? '5 4' : 'none' })); return; }   /* esce dalla scena: niente punta */
        if (Math.abs(y1 - y0) < 2) return;
        gRaggi.appendChild(el('line', { x1: X, y1: y0, x2: X, y2: y1 + verso * pt * 0.6, stroke: 'var(--s4)', 'stroke-width': 3, 'stroke-dasharray': tratteggio ? '5 4' : 'none' }));
        gRaggi.appendChild(el('path', { d: `M${X} ${y1} L${X - pt * 0.6} ${y1 + verso * pt} L${X + pt * 0.6} ${y1 + verso * pt} Z`, fill: tratteggio ? 'none' : 'var(--s4)', stroke: 'var(--s4)', 'stroke-width': 1.5 }));
      }
      function raggiCannocchiale() {
        const L = liv(), lenti = [{ x: p.l, f: p.f }, { x: p.l2, f: p.f2 }], xs = L.vista[0] + 3, fine = p.l2 + 9;
        [-1, 0, 1].forEach(s => {
          const ya = s * D * 0.3;
          gRaggi.appendChild(linea(traccia(xs, ya - ALFA * (p.l - xs), ALFA, lenti, fine).pts, { opacity: s ? .8 : 1 }));
        });
        const X = PX(p.l + p.f), Y = PY(ALFA * p.f);
        if (p.l + p.f < p.l2) {
          gRaggi.appendChild(el('circle', { cx: X, cy: Y, r: 3.5, fill: 'var(--s4)' }));
          testo(gRaggi, X, PY(-2.6), ['immagine'], 'font: 600 12px var(--font)', { 'text-anchor': 'middle', fill: 'var(--s4)' });
        }
      }

      /* la luce sullo schermo, vista di taglio */
      function disegnaLuce() {
        vuota(gLuce);
        const L = liv();
        if (!conSchermo(L) || !(acceso || libero)) return;
        const e = schermo(p), X = PX(p.s), w = Math.max(5, Math.min(9, 0.9 * S.U));
        const g = el('g', { opacity: (libero ? 1 : luce).toFixed(2) });
        if (e.b > 4 * MEZZO_SCHERMO) {
          g.appendChild(el('rect', { x: X - w / 2, y: PY(MEZZO_SCHERMO), width: w, height: 2 * MEZZO_SCHERMO * S.V, fill: '#ffb43a', opacity: .3, rx: 2 }));
        } else {
          sfoca2.setAttribute('stdDeviation', '0 ' + (e.b / 4 * S.V).toFixed(2));
          const y1 = morsa(e.m * H, -MEZZO_SCHERMO - 2, MEZZO_SCHERMO + 2), alto = Math.abs(y1) * S.V + e.b * S.V * 0.5;
          const yA = Math.max(PY(MEZZO_SCHERMO), Math.min(S.oy, PY(y1)) - e.b * S.V * 0.25), yB = Math.min(PY(-MEZZO_SCHERMO), Math.min(S.oy, PY(y1)) - e.b * S.V * 0.25 + alto);
          g.appendChild(el('rect', { x: X - w / 2 + 1, y: yA, width: w - 2, height: Math.max(1, yB - yA), fill: '#ff9f1c', opacity: morsa(1.1 / (1 + e.b / 3), .25, 1), filter: 'url(#bo-sfoca-banco)' }));
        }
        gLuce.appendChild(g);
      }

      /* il riquadro: che cosa si vede sullo schermo, o nell'occhio */
      function disegnaRiquadro() {
        vuota(gRiq);
        const L = liv(), I = S.I, x = S.ix, y = S.iy, ax = x + 5, ay = y + 21, aw = I - 10, ah = I - 26;
        gRiq.appendChild(el('rect', { x, y, width: I, height: I, rx: 10, fill: 'var(--sup)', stroke: 'var(--bordo)', 'stroke-width': 1 }));
        testo(gRiq, x + I / 2, y + 15, conSchermo(L) ? 'sullo schermo' : 'nell\'occhio', 'font: 600 12px var(--font)', { 'text-anchor': 'middle', stroke: 'var(--sup)' });
        clipR.setAttribute('x', ax); clipR.setAttribute('y', ay); clipR.setAttribute('width', aw); clipR.setAttribute('height', ah);
        const g = el('g', { 'clip-path': 'url(#bo-riquadro)' });
        gRiq.appendChild(g);
        g.appendChild(el('rect', { x: ax, y: ay, width: aw, height: ah, fill: conSchermo(L) ? '#e7e3d8' : (L.lontano ? '#bcd7ea' : '#d9d3c4') }));
        const cx = ax + aw / 2, cy = ay + ah / 2;
        if (!(acceso || libero)) {
          g.appendChild(el('rect', { x: ax, y: ay, width: aw, height: ah, fill: '#000', opacity: .45 }));
          g.appendChild(el('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', fill: '#f3f0e8', style: 'font: 12px var(--font)' }, 'candela spenta'));
          if (L.lontano) { g.lastChild.textContent = 'premi Accendi'; }
          return;
        }
        const img = el('g', { opacity: (libero ? 1 : luce).toFixed(2) });
        g.appendChild(img);
        if (conSchermo(L)) {
          const e = schermo(p), k = ah / (2 * MEZZO_SCHERMO);
          if (e.b > 4 * MEZZO_SCHERMO) { img.appendChild(el('rect', { x: ax, y: ay, width: aw, height: ah, fill: '#ffb43a', opacity: .3 })); return; }
          sfoca.setAttribute('stdDeviation', (e.b / 4 * k).toFixed(2));
          const gi = el('g', { filter: 'url(#bo-sfoca)', opacity: morsa(1.1 / (1 + e.b / 3), .25, 1).toFixed(2) });
          candela(gi, cx, cy, k * e.m, Math.abs(k * e.m), true, false);   /* base al centro: capovolta, scende */
          img.appendChild(gi);
          return;
        }
        if (L.lontano) {
          const e = cannocchiale(p), k0 = ah / 6.2, kk = morsa(e.G, -5.6, 5.6) * k0;
          torre(img, ax + 16, ay + ah - 6, k0, true);
          sfoca.setAttribute('stdDeviation', morsa(Math.abs(e.verg) * 300, 0, 18).toFixed(2));
          const gi = el('g', { filter: 'url(#bo-sfoca)' });
          torre(gi, cx, cy + kk / 2, kk, false);
          img.appendChild(gi);
          return;
        }
        const e = occhio(p), k0 = ah / (H * 3.3), base = ay + ah - 5;
        candela(img, ax + 12, base, k0, k0, false, true);
        if (e.tipo === 'reale') {
          sfoca.setAttribute('stdDeviation', 10);
          const gi = el('g', { filter: 'url(#bo-sfoca)' });
          gi.appendChild(el('circle', { cx, cy, r: ah * 0.35, fill: '#ffb43a', opacity: .55 }));
          img.appendChild(gi);
          return;
        }
        const G = e.tipo === 'infinito' ? 3.25 : morsa(e.G, 0.2, 3.25);
        candela(img, cx + 6, base, G * k0, G * k0, true, false);
        if (e.tipo === 'infinito') img.appendChild(el('text', { x: ax + aw - 6, y: ay + 16, 'text-anchor': 'end', fill: '#3a3226', style: 'font: 600 13px var(--font)' }, '∞'));
      }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaPezzi(); disegnaRaggi(); disegnaLuce(); disegnaRiquadro(); }
      function ridisegnaScena() { disegnaPezzi(); disegnaRaggi(); disegnaLuce(); disegnaRiquadro(); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const L = liv();
        ['o', 'l', 's', 'l2', 'f'].forEach(k => {
          const mobile = L.mobili.indexOf(k) >= 0;
          box[k].hidden = !mobile;
          if (!mobile) return;
          box[k].querySelector('output').textContent = k === 'f' ? (p.f > 0 ? '+' : '−') + Math.abs(p.f) + '\u00a0cm' : p[k] + '\u00a0cm';
          box[k].querySelectorAll('button').forEach(bt => { bt.disabled = (finito && !libero) || !lecito(k, k === 'f' ? passoF(+bt.dataset.d) : p[k] + (+bt.dataset.d)); });
        });
        const vis = L.mobili.length;
        L.mobili.forEach(k => box[k].classList.toggle('solo', vis === 1));
      }
      /* il ponte con la teoria: la formula con i numeri del banco; il risultato solo dopo la prova (in modalità libera subito) */
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
        const L = liv(), pz = [];
        const fr = n => '\\dfrac{1}{' + texN(n) + '}';
        const simb = s => pz.push('<span class="pezzo simbolo">' + ctx.tex(s) + '</span>');
        const pezzo = (s, c) => pz.push('<span class="pezzo' + (c ? ' ' + c : '') + '">' + ctx.tex(s) + '</span>');
        const provato = ultimo && stessa(ultimo.p, p);
        const ignoto = s => pezzo(s + ' = \\ ?', 'ignoto');
        if (L.lontano) {
          const e = cannocchiale(p);
          simb('p_2 = d - f_1');
          pezzo('p_2 = ' + e.d + ' - ' + p.f + ' = ' + texN(e.p2) + '\\,\\text{cm}');
          if (e.p2 === 0) pezzo('\\text{l\'immagine cade sull\'oculare}', 'nota');
          else pezzo('\\dfrac{1}{q_2} = \\dfrac{1}{' + p.f2 + '} ' + (e.p2 < 0 ? '+ ' + fr(-e.p2) : '- ' + fr(e.p2)));   /* niente doppio segno con p₂ negativo */
          if (finito) pezzo('G = \\dfrac{f_1}{f_2} = ' + texN(p.f / p.f2), 'esito');
          else if (provato && e.p2 !== 0) pezzo(isFinite(e.q2) ? 'q_2 \\approx ' + texNum(e.q2, 1) + '\\,\\text{cm}' : 'q_2 \\to \\infty', 'esito');
          else if (e.p2 !== 0) ignoto('q_2');
        } else if (libero || L.tipo === 'lente') {
          const pp = p.l - p.o, qI = coniugato(pp, p.f);
          simb('\\dfrac{1}{p} + \\dfrac{1}{q} = \\dfrac{1}{f}');
          pezzo('\\dfrac{1}{q} = ' + fr(p.f) + ' - ' + fr(pp));
          if (libero || provato || finito) {
            pezzo(isFinite(qI) ? 'q \\approx ' + texNum(qI, 1) + '\\,\\text{cm}' : 'q \\to \\infty', 'esito');
            if (isFinite(qI)) pezzo('G = \\dfrac{|q|}{p} \\approx ' + texNum(Math.abs(qI) / pp, 2), 'esito');
          } else ignoto('q');
        } else {
          const pp = p.l - p.o, ss = p.s - p.l, qI = coniugato(pp, p.f);
          simb('\\dfrac{1}{p} + \\dfrac{1}{q} = \\dfrac{1}{f}');
          pezzo(fr(pp) + ' + ' + fr(ss) + ' \\overset{?}{=} ' + fr(p.f));
          if (finito) pezzo(isFinite(qI) ? 'q \\approx ' + texNum(qI, 1) + '\\,\\text{cm}' : 'q \\to \\infty', 'esito');
          else if (provato) { const sx = 1 / pp + 1 / ss, dx = 1 / p.f; pezzo(texNum(sx, 3) + (Math.abs(sx - dx) < 5e-4 ? ' \\approx ' : ' \\neq ') + texNum(dx, 3) + '\\,\\text{cm}^{-1}', 'nota'); }
          if (L.tipo === 'G') pezzo('G = \\dfrac{q}{p} ' + (finito || provato ? '\\approx ' + texNum(Math.abs(schermo(p).m), 2) : '= \\ ?'), finito ? 'esito' : (provato ? 'nota' : 'ignoto'));
        }
        formulaEl.innerHTML = pz.join(''); adattaFormula();
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
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); ridisegnaScena(); }
      /* che cosa si può spostare e fin dove (i pezzi non si scavalcano e restano sul banco) */
      function lecito(k, v) {
        const L = liv(), max = massimo(L);
        if (v == null || !isFinite(v)) return false;
        if (k === 'f') return true;
        if (k === 'o') return v >= 0 && v <= p.l - 1;
        if (k === 'l') return v >= (L.lontano ? 0 : p.o + 1) && v <= (conSchermo(L) ? p.s - 1 : max) && v >= 0;
        if (k === 's' || k === 'l2') return v >= p.l + 1 && v <= max;
        return false;
      }
      function passoF(d) { const sc = liv().scelte || [p.f], j = sc.indexOf(p.f) + d; return j >= 0 && j < sc.length ? sc[j] : null; }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); raf = 0;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        p = Object.assign({}, L.inizio);
        prove = 0; finito = false; acceso = false; luce = 0; ultimo = null; presi = []; detti = {}; sbagli = 0;
        aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.accendi.disabled = false; b.ric.textContent = 'Ricomincia';
        svg.setAttribute('aria-label', L.lontano ? 'Un cannocchiale sul banco: obiettivo, oculare e occhio, e una torre lontana' : (conSchermo(L) ? 'Un banco ottico con una candela, una lente e uno schermo' : 'Una candela, una lente d\'ingrandimento e un occhio'));
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- la prova: si accende la candela ---------------- */
      let tempoLuce = 0;
      function animaLuce() {
        cancelAnimationFrame(raf); clearTimeout(tempoLuce);
        const t0 = performance.now(); luce = 0;
        const passo = ora => { luce = Math.min(1, (ora - t0) / 450); disegnaLuce(); disegnaRiquadro(); raf = luce < 1 ? requestAnimationFrame(passo) : 0; };
        raf = requestAnimationFrame(passo);
        tempoLuce = setTimeout(() => { if (luce < 1 && acceso) { luce = 1; disegnaLuce(); disegnaRiquadro(); } }, 700);   /* se la pagina non disegna (scheda nascosta) */
      }
      function accendi() {
        if (finito || libero) return;
        const L = liv(), v = verdetto(L, p), prec = ultimo;
        aiutoEl.hidden = true;
        prove++; aggiornaConta();
        ultimo = { p: Object.assign({}, p), v };
        acceso = true;
        if (L.tipo === 'due') { aggiorna(); animaLuce(); livelloDue(v); return; }
        if (v.ok) { vinci(v.testo); animaLuce(); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato'); sbagli++;
        aggiorna(); animaLuce();
        erroreTipico(L, v, prec);
      }
      /* livello 3: due posizioni della lente, lontane almeno 5 cm l'una dall'altra */
      function livelloDue(v) {
        if (v.ok && (!presi.length || Math.abs(presi[0] - p.l) >= 5)) {
          presi.push(p.l);
          if (presi.length === 2) { vinci('A fuoco con la lente a ' + (presi[0] - p.o) + '\u00a0cm e a ' + (presi[1] - p.o) + '\u00a0cm dalla candela.'); return; }
          msg.textContent = 'A fuoco con la lente a ' + (p.l - p.o) + '\u00a0cm. Adesso trova l\'altra posizione.'; msg.className = 'lab-messaggio ok';
          ctx.mascotte('giusto'); disegnaPezzi(); return;
        }
        msg.textContent = v.ok ? 'A fuoco, ma è la posizione di prima: l\'altra dista almeno 5\u00a0cm.' : v.testo;
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato'); sbagli++;
        if (!v.ok) erroreTipico(liv(), v, null);
        if (presi.length && sbagli >= 3) dici('scambio', 'Nella formula p e q si possono scambiare: 1/p + 1/q non cambia.');
      }
      function vinci(testo) {
        const L = liv();
        finito = true; b.accendi.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (prove === 1 ? ' Al primo colpo.' : ' Accensioni: ' + prove + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli(); aggiorna();
        ctx.zenone(VITTORIE[livello](p), { espressione: prove <= (L.tipo === 'due' ? 2 : 1) ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, t) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(t, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, v, prec) {
        const e = v.e;
        if (conSchermo(L)) {
          if (p.f < 0) { dici('divergente', 'Una lente divergente allarga sempre i raggi: da sola non fa immagini reali.'); return; }
          if (e.pp < p.f - 1e-9) { dici('dentro', 'Candela dentro la focale: i raggi escono divergenti, l\'immagine è virtuale e nessuno schermo la raccoglie.'); return; }
          if (Math.abs(e.pp - p.f) < 1e-9) { dici('fuoco', 'Candela nel fuoco: i raggi escono paralleli e l\'immagine va all\'infinito.'); return; }
          if (Math.abs(e.ss - p.f) < 1e-9) { dici('nelfuoco', 'Nel fuoco arrivano i raggi paralleli, cioè quelli da lontanissimo: l\'immagine di una candela vicina si forma più in là.'); return; }
          if (L.tipo === 'G' && v.aFuoco) { dici('G', 'G = q/p: l\'immagine è tante volte più alta quante volte q è più grande di p.'); return; }
          if (prec && prec.v && !prec.v.ok && sbagli >= 3) dici('conto', 'Invece di provare a caso, usa la formula: 1/q = 1/f − 1/p dice dove si forma l\'immagine.');
          return;
        }
        if (L.tipo === 'lente') {
          if (e.tipo === 'reale') { dici('reale', 'Oltre il fuoco l\'immagine è reale e si forma dietro l\'occhio: per ingrandire, la candela va dentro la focale.'); return; }
          if (e.tipo === 'infinito') { dici('inf', 'Con la candela nel fuoco q va all\'infinito, e G = |q|/p non dà un numero.'); return; }
          if (sbagli >= 2) dici('cresce', 'Più la candela si avvicina al fuoco, più l\'immagine virtuale si allontana e cresce.');
          return;
        }
        if (L.lontano && sbagli >= 2) dici('oculare', 'L\'immagine dell\'obiettivo fa da oggetto per l\'oculare: perché i raggi escano paralleli, deve stare nel suo fuoco.');
      }

      /* ---------------- modalità libera: nessun obiettivo, nessun verdetto ---------------- */
      function osserva() {   /* osservazioni neutre su che cosa fa la lente */
        const pp = p.l - p.o, qI = coniugato(pp, p.f);
        if (!isFinite(qI)) return 'Candela nel fuoco: i raggi escono paralleli, l\'immagine va all\'infinito.';
        const G = Math.abs(qI) / pp, quanto = G > 1.03 ? 'più grande' : (G < 0.97 ? 'più piccola' : 'grande uguale');
        if (qI < 0) return (p.f < 0 ? 'Lente divergente: ' : 'Dentro la focale: ') + 'immagine virtuale, dritta, ' + quanto + '. Lo schermo non la raccoglie.';
        const e = schermo(p);
        return 'Immagine reale, capovolta, ' + quanto + (e.b <= B_MAX ? ': lo schermo è a fuoco.' : (qI > p.s - p.l ? ', oltre lo schermo.' : ', prima dello schermo.'));
      }
      function mostraLibero() {
        b.casuale.hidden = !libero; b.accendi.hidden = libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        salvato = { livello, p: Object.assign({}, p), prove, finito, acceso, ultimo, presi: presi.slice(), detti: Object.assign({}, detti), sbagli, cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        cancelAnimationFrame(raf); raf = 0;
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        p = Object.assign({}, LIBERO.inizio); finito = false;
        consegnaEl.textContent = '';
        b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.textContent = osserva(); msg.className = 'lab-messaggio';
      }
      function esciLibero() {   /* si torna al livello com'era */
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; prove = z.prove; finito = z.finito; acceso = z.acceso; luce = 1; ultimo = z.ultimo; presi = z.presi; detti = z.detti; sbagli = z.sbagli;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.accendi.disabled = finito;
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        const r = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
        const f = F_LIBERO[r(0, F_LIBERO.length - 1)], l = r(12, 45);
        p = { o: 0, l, s: Math.min(massimo(LIBERO), l + r(10, 50)), f };
        ridisegnaScena(); aggiorna();
        msg.textContent = osserva(); msg.className = 'lab-messaggio';
      }

      /* ---------------- comandi ---------------- */
      function dopoMossa() {
        if (libero) { msg.textContent = osserva(); msg.className = 'lab-messaggio'; return; }
        acceso = false; luce = 0;
        if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
      }
      function cambia(k, d) {
        const L = liv();
        if (L.mobili.indexOf(k) < 0 || (finito && !libero)) return false;
        const v = k === 'f' ? passoF(d) : p[k] + d;
        if (!lecito(k, v)) return false;
        p[k] = v; dopoMossa(); aggiorna(); return true;
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        if (k === 'f') return;   /* le lenti si cambiano una alla volta */
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* trascinare i pezzi lungo il banco: si prende il pezzo mobile più vicino al dito */
      let preso = null;
      function puntoDa(ev) {
        const m = svg.getScreenCTM(); if (!m) return null;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse());
        return { x: S.x0 + (c.x - S.ox) / S.U, px: c.x, py: c.y };
      }
      svg.addEventListener('pointerdown', ev => {
        if (finito && !libero) return;
        const c = puntoDa(ev); if (!c) return;
        if (c.px >= S.ix && c.px <= S.ix + S.I && c.py >= S.iy && c.py <= S.iy + S.I) return;   /* il riquadro non si trascina */
        let scelto = null, dist = 36;
        liv().mobili.forEach(k => { if (k === 'f') return; const dd = Math.abs(PX(p[k]) - c.px); if (dd < dist) { dist = dd; scelto = k; } });
        if (!scelto) return;
        preso = scelto; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        ev.preventDefault();
      });
      const muovi = ev => {
        if (!preso) return;
        const c = puntoDa(ev); if (!c) return;
        ev.preventDefault();
        const v = Math.round(c.x), d = v > p[preso] ? 1 : -1;
        let nuovo = p[preso];
        while (nuovo !== v && lecito(preso, nuovo + d)) nuovo += d;   /* fino al dito, o fino al limite */
        if (nuovo !== p[preso]) { p[preso] = nuovo; dopoMossa(); aggiorna(); }
      };
      const molla = () => { preso = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.accendi.addEventListener('click', accendi);
      b.ric.addEventListener('click', () => {
        if (libero) { p = Object.assign({}, LIBERO.inizio); ridisegnaScena(); aggiorna(); msg.textContent = osserva(); return; }
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
        pl.addEventListener('click', () => avviaLivello(k));
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello);
      let forma = '';
      const ro = new ResizeObserver(() => {
        adattaFormula(); adattaMessaggio();
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); clearTimeout(tempoLuce); fermaRipeti(); ro.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
