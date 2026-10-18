# Quanto — schema di un laboratorio

> Preso da Compasso (`Compasso\SCHEMA-LAB.md`), con i nomi di Quanto. L'elenco dei laboratori approvati da Luca è in
> `LABORATORI.md`. I modelli da leggere sono quelli di Compasso: `Compasso\laboratori\bilancia.js` (e `tiro-a-segno.js`
> per un piano cartesiano). In fisica la scena segue la legge vera (`SCHEMA-VIDEO.md` §8): una palla cade con `y = ½·g·t²`,
> non con un'animazione a occhio.

Un **laboratorio** è un'esperienza manipolativa: un piccolo gioco con una metafora fisica
che contiene un concetto. I modelli a cui somigliare sono **BaloonZ** (palloncini che
alzano e zavorre che abbassano una mongolfiera: i numeri relativi si sommano *facendo*) e
**Marea** (una barra da piegare che diventa parabola, un mare da alzare fino a quota zero: la
disequazione di secondo grado si *vede*). Non un grafico con cursori: un oggetto da
maneggiare, un obiettivo, un esito che si capisce a colpo d'occhio.

## Regole di progetto (le stesse di Marea)

1. **Una metafora fisica sola**, portata fino in fondo (pesi e piatti; mare e rive; palloncini e zavorra).
2. **Un obiettivo per livello**, e livelli che crescono: dal caso ovvio a quello che richiede il concetto.
3. **Il gioco non regala la risposta**: si vince solo se si è capito. Niente calamite, niente
   "quasi giusto" che aggancia da solo. Se serve un aiuto, un pulsante «?» che spiega il *come*, non il risultato.
4. **L'esito si legge dalla scena** (il piatto scende, il personaggio è sott'acqua, il pallone
   supera la quota), e solo dopo dai numeri.
5. **Ponte con la matematica scritta**: da qualche parte compare, aggiornata in tempo reale,
   l'equazione o la formula che la scena rappresenta (KaTeX con `ctx.tex`).
6. Funziona con **il dito** (pointer events, `touch-action: none` sull'area interattiva),
   su 384 px di larghezza in verticale e su schermo largo; niente hover indispensabile.
7. **Niente audio.** Animazioni brevi (< 600 ms) e pilotate da `requestAnimationFrame`, da fermare in `smonta`.
8. Testi in italiano, brevi, senza «Ciao!». Colori dai token del sito (`var(--s1)`…`var(--s4)`,
   `--ok`, `--no`, `--testo`, `--testo2`, `--sup`, `--sup2`, `--bordo`, `--accento`), così regge il tema scuro.

## Il contratto

File `laboratori/<id>.js`:

```js
(function () {
  const STILE = `
    .lab-<id> .lab-scena { aspect-ratio: 3 / 2; background: var(--sup2); }
    @media (max-width: 600px) { .lab-<id> .lab-scena { aspect-ratio: 4 / 5; } }
    ...`;
  QUANTO.registraLab({
    id: '<id>',
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-<id>')) { const s = document.createElement('style'); s.id = 'stile-lab-<id>'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-<id>');
      radice.innerHTML = `<div class="lab-scena">…</div><div class="lab-messaggio"></div><div class="lab-barra">…</div>`;
      /* … gioco … */
      return function smonta() { /* cancelAnimationFrame, removeEventListener su window/document */ };
    }
  });
})();
```

- `radice`: un `<div class="lab-stage">` vuoto, largo quanto la pagina (min 320 px). Il laboratorio
  decide l'altezza: di solito una `.lab-scena` con `aspect-ratio` e sotto una `.lab-barra` con i
  pulsanti (classi già pronte: `.lab-scena`, `.lab-barra`, `.lab-messaggio`, `.lab-livello`, `.btn`, `.btn.primario`, `.btn.piccolo`).
- `ctx.zenone(testo, { tipo: 'commento'|'suggerimento'|'errore', espressione: 'felice'|'pensa'|'sorpreso'|'triste'|'orgoglioso', durata: ms })`
  — la mascotte parla. Usala per i commenti di fine livello e per gli errori tipici, non a ogni tocco.
- `ctx.completato(livello)` — segna il livello (numero) come completato; `ctx.stato().livelli` è l'elenco.
- `ctx.tex(latex, display)` → HTML KaTeX; `ctx.md(markdown)` → HTML con matematica `$…$`.
- `ctx.tema()` → `'chiaro'` | `'scuro'`; `ctx.CGRAF` → il motore dei grafici (`render(spec, contenitore)`), se serve un piano cartesiano vero.
- Il ritorno di `monta` è la funzione di pulizia: viene chiamata a ogni cambio di pagina o scheda.
- Le immagini stanno in `laboratori/immagini/` (da creare al primo laboratorio che ne ha bisogno).
- Il file va registrato in `quanto-indice.js` → `laboratori`: `{ id, argomento, titolo, icona (emoji), sotto (una riga), intro (la frase di Stilla all'apertura) }`.

## Verifica

- `node --check laboratori/<id>.js` (sintassi), poi il laboratorio va provato nel browser:
  `#/argomento/<argomento>/lab/<id>`. Deve reggere a 384 px di larghezza e a schermo intero.
- Il modello da leggere prima di scrivere: `Compasso\laboratori\bilancia.js`.

## Una schermata sola (dal 27 settembre 2026)

Ogni laboratorio si apre in una **pagina tutta sua** (`#/argomento/<arg>/lab/<id>`): in alto una
barra sottile (indietro, titolo, schermo intero, e a destra la mascotte Stilla), sotto la
`radice` (`.lab-stage`), che ha **altezza e larghezza definite** (tutta la finestra meno la
barra) ed è un contenitore di nome `lab` (`container: lab / size`). **La pagina non scorre**, e
il laboratorio non deve mai uscire dalla `radice` né scorrere al suo interno. Deve stare bene su
telefono (384 × 686 di spazio), tablet verticale (820 × 1126), tablet orizzontale (1180 × 766),
portatile (1366 × 714) e schermo largo (1920 × 1026), riempiendo lo spazio senza buchi.

Impaginazione consigliata (classi già pronte in `quanto.css`):
```html
<div class="lab-layout">
  <div class="lab-scena">  <!-- la scena: svg con viewBox, riempie lo spazio che resta -->  </div>
  <div class="lab-lato">   <!-- consegna breve, formula, messaggio, pulsanti, livelli, «?» --> </div>
</div>
```
- In verticale la scena sta sopra e prende tutto lo spazio che resta; il pannello sta sotto,
  alto quanto il suo contenuto. In orizzontale (contenitore più largo di 5:4) la scena va a
  sinistra e il pannello a destra, largo `clamp(260px, 32cqw, 400px)`.
- La scena è un SVG con `viewBox` e `width/height: 100%` (si adatta con `preserveAspectRatio`,
  di norma `xMidYMid meet`). Se la scena vuole proporzioni diverse in verticale e in orizzontale,
  il laboratorio può scegliere il `viewBox` misurando la scena (`ResizeObserver`) e ridisegnare.
- Per le misure usa le unità del contenitore (`cqw`, `cqh`, `cqmin`) e `clamp()`: testo mai sotto
  i 12 px, pulsanti alti almeno 40 px (36 nei casi stretti).
- Il pannello deve essere **corto**: consegna in una o due righe, formula su una riga se si può,
  pulsanti su una o due righe. Le spiegazioni lunghe vanno nel «?» (un riquadro che si apre **sopra**
  la scena, non sotto il pannello), non nel pannello.
- Se un elemento ha davvero bisogno di scorrere (un elenco molto lungo) va marcato con
  `data-scorre`, ma prima si prova a farlo stare.
- Niente `aspect-ratio` fisso sulla scena, niente altezze in `vh` (usa il contenitore).
- La mascotte in laboratorio sta nella barra in alto: i messaggi di fine livello vanno bene lì;
  quello che serve per giocare resta nel pannello (`.lab-messaggio`).
- `ctx.mascotte(evento, testo?)` fa reagire Stilla senza parlare: `'giusto'`, `'sbagliato'`,
  `'passo'`, `'livello'`, `'ops'`, `'pensa'` (ctx.completato fa già festa da solo).

Collaudo: `node strumenti/prova-lab.js <argomento> <id> --foto <cartella>` misura i cinque schermi
e dice cosa non va (pagina che scorre, elementi fuori, contenuto tagliato, bersagli bassi, testo
piccolo, scena troppo piccola, vuoto sotto). Con `--js script.js` porta prima il laboratorio a un
livello avanzato (lo script usa gli aiuti del banco), perché i livelli alti hanno spesso più roba.

## Modalità libera (richiesta di Luca del 27/9/2026)

Ogni laboratorio ha, oltre ai livelli, una **modalità libera**: un pulsante «Libero» accanto ai
pallini dei livelli (sempre disponibile, non serve aver finito i livelli). In modalità libera:
- **non c'è obiettivo né verdetto**: niente bersaglio, niente «livello superato», niente festa;
- lo studente **sceglie lui i parametri** della scena con controlli chiari: cursori con il valore
  scritto accanto, oppure pulsanti − / + per i numeri interi (per esempio: nella bilancia i
  coefficienti dell'equazione $ax + b = cx + d$; nel regolo, nessun livello da risolvere e i due
  numeri liberi; nella ruota la funzione (seno o coseno) e la quota $k$; nella giostra $z$ e $w$;
  nel giardiniere spago e picchetti, ellisse o iperbole);
- tutto quello che nei livelli si manipola resta manipolabile, e la formula scritta si aggiorna;
- un pulsante «Casuale» (facoltativo, se ha senso) propone parametri a caso sensati;
- i controlli dei parametri stanno nel pannello `.lab-lato` e devono stare anche loro nella
  schermata singola (in verticale possono stare in una riga che si apre con un tocco, «Parametri»);
- i messaggi di Stilla qui sono solo osservazioni neutre («Con $a$ negativo la parabola si apre in
  giù»), facoltative, mai valutazioni;
- uscire dalla modalità libera riporta al livello in cui si era.
Il livello libero non si salva fra i completati.

### Pezzi comuni già pronti (in `quanto.css`, dentro `.lab-stage`)
Presi dalla bilancia, il modello da copiare (`Compasso\laboratori\bilancia.js`, e `tiro-a-segno.js` per un
piano cartesiano): `.lab-livelli` con i `.lab-pallino` (un `<button>` con dentro uno `<span>`
numerato; classi `fatto`, `attivo`) e il pulsante `.btn.lab-libero` (`aria-pressed`);
`.lab-aiuto` (il riquadro del «?», sopra la scena, `hidden` per chiuderlo); `.lab-parametri` con
dentro i `.lab-param` (`.nome`, pulsanti − / +, `output` col valore, oppure un `input[type=range]`).
Non ricopiarli nel tuo `STILE`: usa le classi, e aggiungi solo le differenze.

Ricetta della bilancia (resoconto del 27/9): coordinate del dito con `svg.getScreenCTM().inverse()`
(mai con `getBoundingClientRect`, che con `meet` sbaglia); scena molto larga → `ResizeObserver` che
sceglie il `viewBox` e ridisegna allungando la scena invece di lasciare vuoti; in orizzontale, se
il pannello resta vuoto, ci si sposta un blocco della scena (equazione e passi); contatori piccoli
in un angolo della scena; modalità libera = flag `libero` + copia dello stato presa entrando e
ripristinata uscendo, `if (libero)` in testa alla funzione che valuta; `.btn.piccolo` fuori da
`.lab-barra` è basso: nel laboratorio è già portato a 38 px.

### Le frasi di Stilla nei laboratori (27/9)
I fumetti di Stilla sono compatti: quando parla da sola mostra solo la prima frase (circa 120
caratteri) e si chiude dopo pochi secondi; il resto resta dietro un «Dimmi di più». Quindi
`ctx.zenone(testo)` va usato con **una frase breve** (fine livello, errore tipico): la cosa
importante all'inizio. Le spiegazioni lunghe stanno nel «?» del laboratorio, non in Stilla.
