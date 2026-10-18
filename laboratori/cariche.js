/* Laboratorio «Le cariche»: incorpora l'app Campo Elettrico (cariche fisse e cariche di prova che tracciano
   le linee di campo; sorgente in Documenti\app\CampoElettrico, pubblicata su Pages). Come Marea in Compasso:
   l'iframe è la scena e riempie tutto lo spazio; sotto, una riga sottile con gli spunti di Stilla e il
   collegamento all'app intera. Niente livelli né modalità libera: l'app è già tutta libera.
   L'app arriva dalla rete: prima di montare l'iframe si bussa all'indirizzo, e se la rete non risponde
   la scena lo dice (con «Riprova», e un nuovo tentativo da solo quando il browser torna in linea). */
(function () {
  const URL_APP = 'https://fithzhood.github.io/campo-elettrico/campo-elettrico.html';
  const STILE = `
    /* niente pannello a destra in orizzontale: l'app porta già tutto dentro di sé, fuori restano spunti e collegamento */
    @container lab (min-aspect-ratio: 5 / 4) {
      .lab-cariche .lab-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; }
      .lab-cariche .lab-layout > .lab-lato { border-left: 0; border-top: 1px solid var(--bordo); padding: 6px 12px; }
    }
    .lab-cariche .lab-scena { background: #0a0f1e; position: relative; }
    .lab-cariche .lab-scena > .lab-iframe { width: 100%; height: 100%; border: 0; display: block; }
    .lab-cariche .lab-scena > .lab-iframe[hidden] { display: none; }
    .lab-cariche .lab-lato { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px 14px; padding: 6px 12px; }
    .lab-cariche .lab-lato > * { width: auto; margin: 0; }
    .lab-cariche .lab-lato .btn { min-height: 38px; }
    .lab-cariche .stato { position: absolute; left: 0; top: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 20px; text-align: center; color: #c9d3f0; font-size: 1rem; line-height: 1.45; }
    .lab-cariche .stato[hidden] { display: none; }
    .lab-cariche .stato p { margin: 0; max-width: 30em; }
    .lab-cariche .lab-scena.senza-rete { background: var(--sup2); }
    .lab-cariche .senza-rete .stato { color: var(--testo); }
    .lab-cariche .senza-rete .stato .icona { font-size: 2.2rem; line-height: 1; }
    .lab-cariche .stato .icona { display: none; }
    .lab-cariche .senza-rete .stato .icona { display: block; }
    .lab-cariche .stato .btn[hidden], .lab-cariche .lab-lato .btn[hidden] { display: none; }
  `;
  /* spunti di Stilla: uno per tocco, a giro (prima frase corta: il fumetto mostra solo quella) */
  const SPUNTI = [
    'Scegli «Prova» e tocca vicino alla carica positiva: la traccia è una linea di campo. Dove va a finire? Provane altre partendo da punti diversi.',
    'Tocca una carica e falla +2, poi premi «Campo completo»: da lei escono il doppio delle linee. Dove sono più fitte, il campo è più intenso.',
    'Nel menu ⋯ scegli «Con inerzia»: ora la carica di prova ha massa. Dove le linee curvano la traiettoria se ne stacca: la linea di campo non è la strada che fa la carica.'
  ];
  QUANTO.registraLab({
    id: 'cariche',
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-cariche')) { const s = document.createElement('style'); s.id = 'stile-lab-cariche'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-cariche');
      radice.innerHTML = '<div class="lab-layout">' +
        '<div class="lab-scena"><iframe class="lab-iframe" title="Campo Elettrico" allow="fullscreen" hidden></iframe>' +
        '<div class="stato"><span class="icona" aria-hidden="true">📡</span><p>Carico Campo Elettrico…</p>' +
        '<button type="button" class="btn primario b-riprova" hidden>Riprova</button></div></div>' +
        '<div class="lab-lato"><button type="button" class="btn piccolo b-spunto">💡 Cosa provare</button>' +
        '<a class="btn piccolo" target="_blank" rel="noopener" href="' + URL_APP + '">Apri l\'app intera</a></div>' +
        '</div>';
      const scena = radice.querySelector('.lab-scena'), iframe = radice.querySelector('iframe');
      const statoEl = radice.querySelector('.stato'), statoTesto = statoEl.querySelector('p'), riprova = radice.querySelector('.b-riprova'), spunto = radice.querySelector('.b-spunto');
      let vivo = true, montato = false, tentativo = 0, nSpunto = 0;

      function senzaRete() {
        if (!vivo || montato) return;
        scena.classList.add('senza-rete');
        statoTesto.textContent = 'Campo Elettrico arriva dalla rete, e adesso la rete non risponde. Quando torna la connessione, premi Riprova.';
        riprova.hidden = false; statoEl.hidden = false;
        spunto.hidden = true;   /* senza l'app gli spunti non servono */
      }
      function carica() {
        if (!vivo || montato) return;
        const mio = ++tentativo;
        scena.classList.remove('senza-rete');
        statoTesto.textContent = 'Carico Campo Elettrico…';
        riprova.hidden = true; statoEl.hidden = false; spunto.hidden = false;
        if (navigator.onLine === false) { senzaRete(); return; }
        /* si bussa all'indirizzo: con no-cors la risposta è opaca, ma arriva solo se la rete c'è */
        let finito = false;
        const scade = setTimeout(() => { if (!finito && mio === tentativo) { finito = true; senzaRete(); } }, 10000);
        fetch(URL_APP, { mode: 'no-cors', cache: 'no-store' }).then(() => {
          if (finito || mio !== tentativo || !vivo) return;
          finito = true; clearTimeout(scade);
          montato = true;
          iframe.addEventListener('load', () => { if (vivo) statoEl.hidden = true; });
          iframe.src = URL_APP; iframe.hidden = false;
        }, () => {
          if (finito || mio !== tentativo) return;
          finito = true; clearTimeout(scade); senzaRete();
        });
      }
      const inLinea = () => carica();
      riprova.addEventListener('click', carica);
      window.addEventListener('online', inLinea);
      spunto.addEventListener('click', () => {
        ctx.zenone(SPUNTI[nSpunto], { tipo: 'suggerimento', espressione: 'pensa', durata: 9000 });
        nSpunto = (nSpunto + 1) % SPUNTI.length;
      });
      carica();
      return () => {
        vivo = false;
        window.removeEventListener('online', inLinea);
        iframe.src = 'about:blank';
      };
    }
  });
})();
