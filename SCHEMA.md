# Quanto — schema di un argomento

Il contratto per chi scrive un argomento (un agente per argomento, 32 in tutto). È lo schema di Compasso
portato alla fisica: stessa struttura, più le unità di misura, i vettori, i grafici orari e i video.
**Il modello da copiare è `argomenti/cinematica.js`**: leggilo tutto prima di cominciare.

Ogni argomento è **un solo file JS** in `argomenti/<id>.js`, che si registra così:

```js
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'cinematica',                      // = nome del file senza .js, = id in quanto-indice.js
  titolo: 'Il moto rettilineo',
  introduzione: R`...markdown...`,
  inBreve: [R`...`, R`...`, R`...`],     // 3–6 frasi da portarsi via
  sezioni: [ { id: 'velocita', titolo: '...', testo: R`...markdown...` }, ... ],
  grafici: { viaggio: { tipo: 'orario', grandezza: 's', t: [0, 14], y: [0, 80], funzioni: [...] } },
  esempi: [ { titolo: '...', problema: R`...`, passi: [R`...`, R`...`], risultato: R`...` } ],
  formulario: [ { nome: '...', formula: R`v_m = \dfrac{\Delta s}{\Delta t}`, nota: R`...` } ],
  flashcards: [ { id: 'fc-01', sezione: 'velocita', tipo: 'formula', fronte: R`...`, retro: R`...` } ],
  esercizi: [ { id: 'b-01', livello: 'base', difficolta: 1, testo: R`...`, suggerimenti: [R`...`],
                risposta: { tipo: 'numero', valore: 5, unita: 'm/s' }, soluzione: [R`...`] } ],
  quiz: [ { id: 'q-01', domanda: R`...`, opzioni: [R`...`, R`...`, R`...`, R`...`], corretta: 2, spiegazione: R`...` } ],
  suggerimenti: [ { tipo: 'errore', testo: R`...` }, { tipo: 'trucco', testo: R`...` } ],
  aneddoti: [ { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: '...', testo: R`...`, legame: R`...` } ]
});
})();
```

**Tutti i testi vanno in `R\`...\`` (String.raw)**, così le barre rovesciate di LaTeX restano intatte (`\frac`,
`\text`...). Dentro un `R\`...\`` **non** si possono usare il backtick e la sequenza `${`. Le stringhe brevi senza
LaTeX (titoli, nomi) possono stare fra apici normali.

Verifica del file, da eseguire finché non dice `OK` (anche gli avvisi vanno letti e, di norma, tolti):

```
node strumenti/verifica-argomento.js argomenti/<id>.js
node strumenti/leggibilita.js argomenti/<id>.js --frasi
```

---

## 1. Notazioni di fisica (scelte di Luca, uguali nei video: `SCHEMA-VIDEO.md` §8)

- **Unità del SI, all'italiana.** Virgola decimale; spazio fra numero e unità; unità in tondo, grandezze in corsivo.
  - Nel **testo** si scrive normale: «a 72 km/h», «9,8 m/s²», «1,5 kg», «25 °C» (gradi Celsius con lo spazio),
    angoli attaccati «30°». Le unità con l'apice (m/s², cm³) nel testo vanno bene. Lo spazio fra il numero e l'unità
    il sito lo rende **non separabile** da solo (niente «20» a fine riga e «m/s» a capo): basta scrivere lo spazio normale.
  - Nella **matematica** il numero si scrive `2{,}5` (con le graffe: senza, KaTeX mette uno spazio dopo la virgola)
    e l'unità con `\,\text{...}`: `$20\,\text{m/s}$`, `$9{,}8\,\text{m/s}^2$`, `$4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$`.
    I gradi Celsius sono `{}^\circ\text{C}`; solo subito dopo il `$` si scrive `$^\circ\text{C}^{-1}$`, perché dentro
    `R\`...\`` la sequenza `${` non si può usare.
    Il prodotto è **sempre** `\cdot`, mai `\times` né lo spazio `\,` fra simboli: `2 \cdot a`, `\dfrac{v_0^2}{2 \cdot a}`,
    `\sqrt{2 \cdot g \cdot h}`; la notazione scientifica `$3 \cdot 10^8\,\text{m/s}$`.
  - **Le conversioni si scrivono come uguaglianze vere**: `$v = \dfrac{72}{3{,}6}\,\text{m/s} = 20\,\text{m/s}$`.
    Mai «$72\,\text{km/h} : 3{,}6 = 20\,\text{m/s}$» (72 km/h diviso 3,6 fa 20 km/h, non 20 m/s).
  - «Unità coerenti», non «tutto nel SI»: con l'accelerazione in m/s² servono metri e secondi, ma un problema di auto
    si può fare benissimo in km e ore.
  - Valori arrotondati con `\approx`. `g = 9{,}8\,\text{m/s}^2` sempre (9,81 solo se il conto lo chiede, dicendolo).
- **Simboli fissi.** La **densità** è `d` (mai ρ): `p = p_0 + d \cdot g \cdot h`, spinta `d \cdot V \cdot g`; ρ resta solo
  per la resistività (`R = \rho \cdot L / S`, nella corrente). Se servono anche una distanza o un diametro, non chiamarli d.
  La posizione sulla retta è `s` (come nei video), lo spostamento `\Delta s`. Si scrive **sin** (`\sin`), mai «sen».
  Si scrive **chilogrammo** e **chilowattora**, non «kilo…».
  Altri simboli decisi nel giro di coerenza (18/10): la **risultante** è `\vec{F}_{\text{tot}}` / `F_{\text{tot}}`, mai R
  (R è raggio, gittata, resistenza); la spinta di un appoggio è `N` (`N_A`, `N_B`); il braccio, anche di una coppia, è `b`.
  Le **lunghezze** di fili, sbarre, solenoidi, pendoli, corde e canne sono `\ell`; `L` resta per induttanza, lavoro e
  livello sonoro (e per `R = \rho \cdot L / S`). Tempo di dimezzamento `T_{1/2}`; energia immagazzinata `U` (condensatore
  e bobina); flusso `\Phi` senza pedice, con l'angolo `\alpha`, fino a `maxwell`, dove servono `\Phi_E` e `\Phi_B`;
  circuitazione `\Gamma_B = \mu_0 \cdot I_c`; calore latente `L_f`, `L_v`. Dove un simbolo ha già un altro significato in un
  argomento vicino (`Q` portata, `\eta` viscosità, `k` di Boltzmann, `I` momento d'inerzia, `M` mutua induttanza), una riga lo dice.
- **Vettori.** Un vettore si chiama per nome a parole («la forza F», «la velocità v»), come nei video; niente frecce sopra
  le lettere nel testo corrente. `\vec{F}` si usa solo nelle formule in cui la differenza fra vettore e modulo è il punto
  (somma di vettori, prodotto scalare e vettoriale, campi), e lì si dice a parole che cosa indica.
- **Seno e coseno nel primo biennio** solo come strumento per scomporre un vettore: `F_x = F \cdot \cos\alpha`,
  `F_y = F \cdot \sin\alpha`, con la calcolatrice, dicendo da dove si misura α. Niente altra trigonometria prima del terzo
  anno (dove bastano, vanno bene i rapporti fra i lati: `P_\parallel = P \cdot h / l`).
- **Colori delle grandezze**, gli stessi dei video, nei grafici (`colore` 1–4): **1 velocità** (azzurro), **2 forze**
  (arancio), **3 energia e risultati** (verde, anche le aree che sono uno spazio percorso), **4 accelerazione** (viola),
  `'grigio'` per le cose neutre (posizioni dei corpi, triangoli e guide tratteggiate, punti di lettura).
  **Due serie della stessa grandezza hanno lo stesso colore** e si distinguono con `tratteggio: true` o con l'etichetta:
  due velocità sono tutte e due azzurre, mai una azzurra e una arancio (l'arancio direbbe «forza»). Unica eccezione: due
  corpi che nel video hanno già un colore (l'auto blu e l'auto arancio di `moto-uniforme`).
  La quantità di moto e la sua variazione Δp sono azzurre come la velocità; il centro di massa è viola come nel video
  `centro-di-massa`; la pressione è viola come nei video di `fluidi` (gli unici usi del viola fuori dall'accelerazione). Le curve di
  temperatura sono arancio come nei video di `calore` (lì non ci sono forze da confondere), le dilatazioni verdi. Cariche elettriche: positive viola, negative azzurre (come nei video di `elettrostatica`), campo `'grigio'`.
  Magnetismo: campo B verde, corrente viola; **poli delle calamite mai rosso e azzurro**, ma `colore: 'polo-n'` (nord scuro) e `'polo-s'` (sud chiaro), fissi e uguali nei due temi come nei video, con `pieno: true` (§4).
- **Definizioni da libro di liceo**, senza semplificazioni false: peso ≠ massa, calore ≠ temperatura, lavoro con il coseno,
  la corrente non si consuma, la forza non serve a mantenere il moto. Le **idee sbagliate** si mostrano (in un `>!` o in un
  «Prova tu») e si smontano subito: mai lasciarle in piedi.
- **Esperimenti veri** con il loro nome (il piano inclinato di Galileo, il tubo di Torricelli, Apollo 15, le fenditure di
  Young), senza date sbagliate.

## 2. Il mini-markdown dei testi

Vale per: `introduzione`, `inBreve`, `sezioni[].testo`, `esempi[].problema/passi/risultato`, `formulario[].nota`,
`flashcards[].fronte/retro`, `esercizi[].testo/suggerimenti/soluzione`, `quiz[].domanda/opzioni/spiegazione`,
`suggerimenti[].testo`, `aneddoti[].testo/legame`.

- Paragrafi separati da una riga vuota. `**grassetto**`, `*corsivo*`. Elenchi: righe con `- ` o `1. `.
- `### Titoletto` dentro una sezione (con parsimonia).
- Riquadri: riga che inizia con `> ` → **nota** (un consiglio, un'osservazione, una stima); `>! ` → **attenzione**
  (errore comune); `>* ` → **idea chiave**: **solo** la definizione o la cosa da ricordare (una legge, una regola), mai un
  consiglio di metodo.
- Tabelle markdown (`| a | b |` con la riga `|---|---|`).
- Un grafico: `[[grafico:nome]]` **da solo su una riga**; il nome deve esistere in `grafici`.
- **Un video: `[[video:<argomento>/<nome>]]` da solo su una riga** (vedi §3).
- Matematica: `$...$` in linea, `$$...$$` in mostra (su righe proprie). Funzionano `\frac`, `\dfrac`, `\tfrac`, `\sqrt`,
  `\cdot`, `\approx`, `\le \ge \ne`, `\Delta`, `\text{...}`, `\vec{}`, `\parallel`, `\perp`, `\circ`, lettere greche,
  `\sin \cos \tan \log`, `\left( \right)`, `\begin{cases}`. **Non** usare `\( \)`, `\[ \]`, `\begin{align}`,
  `\textbf`, comandi che KaTeX non conosce.
- Il testo normale non usa potenze in Unicode per i conti: `$t^2$`, non t².

**Derivazione passo per passo** (il calcolo che nel libro è una colonna): righe consecutive che iniziano con `~ `,
la formula **senza `$`**, poi ` :: ` e un commento breve che dice **perché** si fa il passo. `\evid{…}` evidenzia la
parte che cambia, `\evidb{…}` il risultato. Da 3 a 8 righe. Nei conti di fisica **le unità viaggiano con i numeri**:
```
~ s = s_0 + v \cdot t :: la legge oraria del moto uniforme
~ s = 50\,\text{m} + 20\,\text{m/s} \cdot 4\,\text{s} :: metto i numeri con le unità: i secondi si semplificano
~ s = \evidb{130\,\text{m}} :: 50 m di partenza più 80 m percorsi
```

**Prova tu**, una domanda veloce in mezzo alla teoria (una o due per sezione, dove c'è un errore tipico da far emergere):
```
?? Un'auto viaggia a 25 m/s costanti. Quanto vale la sua accelerazione?
[ ] $25\,\text{m/s}^2$
[x] zero
[ ] $9{,}8\,\text{m/s}^2$
=> La velocità non cambia, quindi $\Delta v = 0$ e anche $a = 0$.
```
Esattamente una `[x]`; senza opzioni la risposta si svela toccando. Il blocco finisce alla prima riga vuota.
Le spiegazioni non dicono «la prima opzione»: le opzioni si rimescolano.

## 3. I campi

### `introduzione` (2–3 paragrafi) e `inBreve` (3–6 frasi)
Che cos'è l'argomento, **a che cosa serve e dove si incontra** (un esempio concreto), che cosa bisogna già sapere. Tono
da insegnante che spiega a voce, niente saluti, niente «in questo modulo», **niente istruzioni d'interfaccia** («sui
grafici si passa il dito»): quelle stanno nelle didascalie dei grafici. `inBreve`: le cose da portarsi via, scritte
come le direbbe l'insegnante a fine lezione.

### `sezioni` (5–9) — la teoria, con i video dentro
Ogni sezione copre **un** concetto: definizione in un `>*`, almeno un esempio svolto nel testo (meglio una derivazione
`~`), gli errori tipici in `>!`, un grafico dove aiuta davvero. `id` in kebab-case, unico; le flashcard lo citano.

**I video.** Tutti i video dell'argomento (i file `video/<id>/*.js`, catalogo in `VIDEO.md`) vanno citati **nella
teoria**, **una volta ciascuno**, **nel punto giusto**: dentro la sezione dell'idea che il video mostra, di solito dopo il
paragrafo che la introduce e prima della definizione `>*` o dell'esempio. Il video non sostituisce il testo: la
sezione deve reggersi anche senza guardarlo. Per sapere che cosa dice un video senza aprirlo:
`node strumenti/eventi-video.js <argomento>/<nome>` (i fumetti con i tempi). Il validatore dà errore se un video
dell'argomento manca. Il lettore è quello di Compasso: copertina, voce di Stilla (se c'è `voce/<id>.json`), schermo intero.

**Leggibilità** (come in Compasso dopo il secondo giro, per chi ha difficoltà di lettura): **niente frasi oltre 20
parole**, 150–400 parole per sezione, Gulpease sopra 60 (`node strumenti/leggibilita.js argomenti/<id>.js --frasi`).
Una frase, un'idea. Le parole del libro sì, i giri di parole no.

### `grafici` (oggetto: nome → specifica)
Vedi §4. Ogni grafico va citato almeno una volta con `[[grafico:nome]]` (anche dentro un esercizio).

### `esempi` (4–6) — esercizi svolti
`problema`, `passi` (un passaggio per elemento, ognuno con il **perché**), `risultato` (una riga, con l'unità). Dal facile
al difficile. **Il primo passo è sempre «Dati: … Cerco …»**, con i simboli e le unità:
`R\`Dati: $v_0 = 0$, $v = 27\,\text{m/s}$, $\Delta t = 9\,\text{s}$. Cerco $a$ e lo spazio $\Delta s$.\``; poi il
riferimento (se serve) e le unità rese coerenti. L'ultimo passo, quando si può, è un **controllo** (con un'altra formula,
con l'area del grafico, con le unità).

### `formulario` (6–14)
`nome`, `formula` (**solo LaTeX, senza `$`**), `nota` (quando vale, le unità). **Al massimo due formule corte per voce**
(separate da `\qquad`): tre formule in fila escono dallo schermo del telefono. Se sono di più, si fanno due voci.

### `flashcards` (16–26)
`fronte` domanda o termine, `retro` risposta **breve e precisa** (1–3 righe). `sezione` = id della sezione;
`tipo` ∈ `definizione | formula | procedura | concetto`; `id` = `fc-01`, `fc-02`… Ogni carta si regge da sola.

### `esercizi` — 20 di base (l'allenamento) + 6–12 avanzati
- `livello: 'base'`: **20 esercizi**, solo sull'argomento, **numeri semplici** (risultati da 1 a 3 cifre, conti che si
  fanno quasi a mente), uno alla volta in cima alla scheda. Ognuno **deve** avere la `risposta`. Ids `b-01`… `b-20`.
- gli altri (ids `es-01`…) sono gli avanzati: più passaggi, un'idea in più, argomenti già visti che si mescolano.
- **Gli esercizi non riusano i numeri della teoria, degli esempi, delle «Prova tu» e dei grafici** (neanche il valore che
  un grafico mostra di serie): lo studente ritroverebbe il risultato già scritto. E la risposta non deve potersi leggere
  da un'etichetta del grafico citato nel testo.
- `difficolta` 1–3; `suggerimenti` 1–3, progressivi; `soluzione` sempre, a passi, con le unità.
- `risposta`:
  - `{ tipo: 'numero', valore: 12, unita: 'm/s' }` — **la forma normale in fisica.** La casella accetta `12`, `12 m/s`,
    `12,0 m/s`, `12 m·s⁻¹`, `12 m s^-1`, `43,2 km/h` (le unità equivalenti si convertono), la notazione scientifica in
    tutte le forme (`1,2·10^3`, `1.2e3`, `1,2 × 10³`), i prefissi (`1,2 kJ`, `4,7 μF`, `150 nm`). L'unità si può non
    scrivere; se la si scrive deve essere giusta: con il numero giusto e l'unità sbagliata lo studente legge «Il numero va,
    l'unità no», con un'unità che il sito non conosce gli si chiede di riscriverla. Tolleranza di serie con l'unità:
    **1% del valore** (i risultati di fisica sono arrotondati); `tolleranza: 0.2` per cambiarla (in unità del valore).
  - `soloUnita: true` — negli esercizi di **equivalenze** («esprimi 72 km/h in m/s»): niente conversione automatica,
    altrimenti «72 km/h» varrebbe come risposta giusta.
  - `altreUnita: ['K']` — unità accettate con lo stesso numero senza conversione (per esempio una differenza di
    temperatura chiesta in °C: 20 K e 20 °C vanno bene tutte e due). °C e K non si convertono da soli.
  - `suffisso: 'c'` — in una risposta senza unità, toglie un simbolo scritto in fondo: le velocità come frazione di
    c (`valore: 0.8, suffisso: 'c'`) accettano «0,8», «0,8c», «0,8 c» e «0,8·c». Prefissi ammessi fino a P (peta) e T (tera).
  - Unità ammesse: m, g, s, A, K, mol, N, J, W, Pa, Hz, C, V, Ω, F, T, Wb, H, L, eV, Wh, cal, bar, h, min, atm, mmHg,
    u, °, rad, %, °C, °F, d (giorni), a (anni), UA, pc (anche kpc, Mpc), ly (anni luce), lx (lux), lm, Bq, dB, con i prefissi (da P a f, femto: fm)
    G M k h d c m μ n p e i composti (`m/s²`, `kg/m³`, `J/(kg·°C)`, `N·m`, `C²/(N·m²)`, `km/(s·Mpc)`). A parole: «anni»,
    «giorni», «anni luce», «unità astronomiche», «lux», «gradi Fahrenheit». °F, come °C, non si converte da solo.
  - Grandezze diverse con le stesse dimensioni: dove si chiede un **momento** (`unita: 'N·m'`) «15 J» **non** passa (il
    numero va, l'unità no); dove si chiede un lavoro in J, «15 N·m» passa. Il radiante è un numero puro: per `rad/s`
    valgono anche `s⁻¹` e `s^-1`, ma non `Hz` (ω non è una frequenza).
  - Con `unita: '%'` vanno bene sia «5 %» sia «0,05».
  - `{ tipo: 'numero', valore: 2.5 }` — numero puro (un rapporto, un rendimento senza %, un indice di rifrazione).
  - `{ tipo: 'numeri', valori: [...], ordinati: true }`, `{ tipo: 'testo', accettate: [...] }` come in Compasso (senza unità).
  - `segnaposto` (facoltativo) cambia il testo grigio; di serie è «Numero e unità (es. 2,5 m/s)», e se svela la risposta il
    sito lo cambia da solo. `simboli` (facoltativo) cambia la fila di tasti; di serie, con l'unità: `·10^ ² ³ / ° Ω μ −`.
  - Il validatore **prova ogni risposta giusta** scritta come la scriverebbe uno studente (`5`, `5 m/s`): se non passa, è
    un errore. Non vede però i conti sbagliati: quelli si ricontrollano con `node`.

### `quiz` (12–18) — domande di teoria
Definizioni, proprietà, «che cosa succede se», grafici da leggere, idee sbagliate da riconoscere. Niente conti lunghi.
Esattamente **4 opzioni**, distrattori presi dagli errori tipici e diversi fra loro (non due forme della stessa idea),
`spiegazione` obbligatoria: perché è giusta e perché le altre no, **senza citarle per posizione** («la terza», «la b»: il sito le rimescola). **`corretta` varia su tutte e quattro le posizioni**,
più o meno alla pari (il sito rimescola, ma chi copia impara dal file): conta quante volte usi 0, 1, 2 e 3.

### `suggerimenti` (6–10) — le pillole di Stilla
`tipo` ∈ `errore | trucco | metodo`, 1–3 frasi. Stilla le dice da sola entrando nell'argomento, o quando la si tocca.

### `aneddoti` (3–5) — storie di fisici
`fisico` (nome come sui libri; una persona per aneddoto, o una coppia «Marie e Pierre Curie»), `anni` (`1564–1642`,
`circa 1320–1382`, `384–322 a.C.`, `nato nel 1932` per i viventi), `titolo` (5–8 parole), `testo` (80–160 parole, una
storia vera raccontata bene, frasi corte), `legame` (una frase: che cosa c'entra con **questo** argomento).
**Accuratezza prima di tutto**: date, luoghi e nomi dei fisici veri, ricontrollati; se una storia è leggenda, dirlo
(«si racconta che»: la mela di Newton, la torre di Pisa). Le persone finiscono nella galleria `#/fisici`, raggruppate per
cognome: scrivi il nome sempre nello stesso modo in tutti gli argomenti («Galileo Galilei», «Isaac Newton»).

## 4. I grafici

Tutti i numeri possono essere **espressioni** in stringa (`'s0 + v*t'`) con i `parametri` dichiarati (cursori sotto il
grafico). Sintassi: `x^2`, `2*t`, `3(t+1)`, `sin`, `cos`, `sqrt`, `abs`, `exp`, `ln`, `log10`, `sign`, `pi`,
`min(a, b)`, `max(a, b)`, `round(x)` e `round(x, 1)` (arrotonda a un decimale), e il **«se»**: `se(condizione, a, b)`
vale `a` se la condizione è vera, `b` altrimenti; le condizioni usano `<`, `>`, `<=`, `>=`, `==`, `!=`
(`se(v > 0, 1, -1)`, `max(0, 5 - 2*t)` per una velocità che si ferma a zero).
**Attenzione alla moltiplicazione implicita:** `vt` è un nome solo; si scrive `v*t`.

Le etichette dentro l'SVG sono testo (niente KaTeX): Unicode per i simboli (`α`, `Δ`, `²`, `≈`). I **pedici** si
scrivono con il trattino basso, dappertutto: etichette, testi, **nomi degli assi** (`etichette: { y: 'E_c (J)' }`),
`etichettaY` delle barre, **etichette dei cursori** (`etichetta: 'μ_d'`). Forme: lettere e cifre attaccate (`F_x`,
`v_0`, `a_c`), un simbolo solo senza graffe (`P_∥`, `F_⊥`, `v_∞`), oppure qualunque cosa fra graffe (`F_{12}`,
`v_{max}`). I nomi di grandezza (`F`, `v_0`, `P_∥`, `a + b`) escono in corsivo, i valori con l'unità (`9,8 m/s`) in tondo.
I numeri del motore (tacche, valori) usano il **meno vero** (−2,5), non il trattino.

**Valori e testi che cambiano con i cursori**, in ogni etichetta e testo (anche delle funzioni e della retta reale):
- `{{espressione}}` scrive il valore con al massimo due decimali (`{{4*v}}` → 16, 2,5, 0,33);
- `{{espressione|1}}` con i decimali **fissi** scelti (`{{9.8*sin(al*pi/180)|1}}` → 4,9; `{{m*g|0}}` → 196);
- `{{? condizione | testo se vera | testo se falsa }}` per un testo che cambia (`'{{? v > 0 | avanti | indietro}}'`).
Il valore accanto a un cursore usa `decimali: 1` del parametro, se c'è. Il validatore controlla che le variabili dentro
`{{…}}` siano parametri dichiarati.

### `tipo: 'orario'` — grafici posizione–tempo, velocità–tempo, … (nuovo in Quanto)
Un piano con il tempo in orizzontale e una grandezza in verticale, con le **unità sugli assi** e nel mirino
(«t = 2,5 s, v = 7,5 m/s»). **La variabile delle funzioni è `t`.**
```js
{ tipo: 'orario', grandezza: 'v', t: [0, 10], y: [0, 22],      // grandezza: 's' | 'x' (m), 'v' (m/s), 'a' (m/s²)
  // oppure una grandezza qualunque con la sua unità: grandezza: 'T', unita: '°C'; unitaTempo: 'h' per le ore
  altezza: 480,                                               // facoltativa: di serie 420 (unità SVG, larghezza 600)
  parametri: [{ nome: 't1', min: 0, max: 10, passo: 0.5, valore: 6, etichetta: 'istante (s)' }],
  funzioni: [{ f: '2*t', colore: 1, etichetta: 'v = 2·t', dominio: [0, 10] }],   // tratti diversi: più funzioni con dominio
  elementi: [{ tipo: 'area', f: '2*t', da: 0, a: 't1', colore: 3 },            // lo spazio come area
             { tipo: 'punto', p: ['t1', '2*t1'], colore: 1 },
             { tipo: 'testo', p: [0.4, 16.5], testo: 'spazio = {{t1*t1}} m', ancora: 'start', colore: 3 }],
  didascalia: '...' }
```
Il nome del tempo sta sotto l'asse, a destra; quello della grandezza in alto, accanto all'asse. Con le posizioni negative
l'asse dei tempi passa per lo zero. **Di serie un grafico orario è alto 420** (sul telefono la larghezza si dimezza:
più basso, le scritte non si leggono); `altezza` solo per alzarlo ancora. Le etichette vanno messe dove non le
attraversa nessuna linea, anche muovendo i cursori fino agli estremi (provalo a 384 px). **L'angolo in alto a sinistra è
dell'asse** (il nome della grandezza e le sue tacche): le etichette non ci vanno; se non c'è un posto libero,
la frase va nella didascalia.

### `tipo: 'piano'` — piano cartesiano, figure e vettori
Tutto quello di Compasso (funzioni in `x`, `punti`, `elementi`: `punto`, `segmento`, `retta`, `verticale`, `orizzontale`,
`poligono`, `cerchio`, `ellisse`, `angolo`, `area`, `tangente`, `testo`, punti trascinabili con `trascina: true` e
`giro`), più i **vettori**. Un `poligono` con `pieno: true` è riempito del tutto (di serie al 15%), con un bordo che segue il
tema: serve per i poli delle calamite (`colore: 'polo-n'` o `'polo-s'`, vedi §1); le lettere dei poli sono un `testo` con
`classe: 'cg-polo-n'` (chiara, da mettere sul nord) o `'cg-polo-s'` (scura, sul sud). Esempio in `magnetismo.js` (`sbarra()`, `ago()`).
```js
{ tipo: 'vettore', da: [0, 0], a: [3, 2], etichetta: 'F', colore: 2 }           // da… a…
{ tipo: 'vettore', modulo: 4, angolo: 35, etichetta: 'F', colore: 2,           // oppure modulo e angolo (gradi dall'asse x)
  componenti: true }                     // componenti tratteggiate dalla coda lungo gli assi, con F_x e F_y
// componenti: { etichette: ['F_x', 'F_y'], colore: 4 } per scegliere nomi e colore
// componenti: { lungo: 30 } lungo assi inclinati (il piano inclinato a 30°, anche un'espressione: lungo: 'al'):
//   la componente parallela al piano e quella perpendicolare, con P_∥ e P_⊥ di serie e le etichette dalla parte giusta
// un vettore lungo zero (un parametro a 0) non si disegna, e non lascia l'etichetta da sola
// posizione: 'destra' sposta l'etichetta dall'altra parte dell'asta (di serie a sinistra di chi cammina sul vettore)
{ tipo: 'somma', da: [0, 0], vettori: [[4, 0], [0, 3]], etichette: ['a', 'b'],  // punta-coda
  colori: [1, 2], risultante: { etichetta: 'a + b', colore: 4 } }
{ tipo: 'somma', vettori: [[4, 1], [1, 3]], etichette: ['u', 'w'], parallelogramma: true }   // con il parallelogramma
// ogni vettore della somma può essere anche { modulo, angolo }; risultante: false la toglie;
// risultante: { etichetta: 'R', posizione: 'destra' | 'sinistra' } sceglie il lato dell'etichetta
{ tipo: 'uscente', p: [2, 3], etichetta: 'B', colore: 4 }       // ⊙ un vettore che esce dal foglio (campo, corrente)
{ tipo: 'entrante', da: [-2, -2], a: [4, 2], passo: 1, colore: 2 }   // ⊗ a griglia su un rettangolo: un campo che entra
{ tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: [0, -1], ampiezza: 270 }   // oltre 180°: ampiezza in gradi da «da»
                                                                     // (negativa = orario), oppure verso: 'antiorario'
{ tipo: 'testo', p: [3, 1], testo: 'piano', rotazione: 30 }      // testo ruotato (gradi, antiorario; anche espressione)
```
Le frecce sono lunghe **in proporzione al modulo**, con la punta piena che non sporge oltre la cima; l'etichetta sta di
fianco all'asta, mai sulla punta. Con vettori, cerchi, angoli o poligoni il piano usa **la stessa scala sui due assi**
(altrimenti gli angoli mentono); `proporzioni: 'libere'` per toglierla. Per un disegno di forze senza assi:
`assi: false, griglia: false` (vedi `strobo` in `cinematica.js`). Un `testo` può avere `colore` (1–4 o `'grigio'`):
il colore ora si vede davvero (prima del 17/10 il CSS lo copriva). Le etichette dei punti hanno un alone largo: una
linea che passa sotto non le attraversa, ma conviene comunque scegliere la `posizione` lontana dalla curva.
Le curve che finiscono perché la funzione smette di esistere (`sqrt(49 - 19.6*t)`) arrivano fino al bordo, a zero.

### `tipo: 'retta-reale'`, `'barre'`, `'circonferenza-goniometrica'`, `'svg'`
Come in Compasso (`Compasso\SCHEMA.md` §3). `'svg'` solo se davvero necessario, con `currentColor` e `var(--s1)`…`var(--s4)`.
Le **barre** con tante categorie (6–7) o nomi lunghi non si sovrappongono più: il motore mette i nomi su due righe, o
inclinati se non bastano; l'`etichettaY` (anche con i pedici) sta sopra l'asse, lontana dalla tacca più alta. La
**retta reale** è più alta e con le scritte più grandi sul telefono; le sue etichette accettano `{{…}}` e i pedici.

### Animazioni
In Quanto non ci sono animazioni pronte: in fisica le cose che si muovono stanno nei **video**. Se serve un'animazione
corta dentro la teoria, si aggiunge in `quanto-animazioni.js` (`ANIM.<nome> = { W, H, durata, fasi, disegna(svg, t) }`,
con gli attrezzi di `CANIM.attrezzi`) e si cita con `[[animazione:<nome>]]`. Prima chiedere al coordinatore.

### Il margine e le tacche
Il margine sinistro si allarga da solo sulla tacca più lunga dell'asse y (`160`, `−20`, `0,5`): non serve fare niente.

## 5. Regole di qualità

- **Tutto corretto.** Ogni numero di esempi, esercizi, quiz e grafici va **rifatto con `node`** prima di scriverlo, con le
  unità. Ogni data degli aneddoti va ricontrollata. Un errore in un sito di ripasso è peggio di un argomento in meno.
- Livello: liceo scientifico, linguaggio dei libri italiani (Amaldi, Walker, Cutnell). L'anno dell'argomento è in
  `quanto-indice.js`: al primo anno niente trigonometria (salvo le componenti), niente derivate.
- Niente riempitivi: ogni frase porta un'informazione. Ogni sezione si legge da sola.
- Gli id (`fc-01`, `b-01`, `es-01`, `q-01`, sezioni) unici nel file.
- Compatibilità iPad vecchi (Safari 12): niente `??`, `?.`, `.at()`, lookbehind nelle regex. Controllo:
  `node strumenti/compatibilita.js argomenti/<id>.js`.

## 6. Come si lavora (per i costruttori)

1. Leggi `argomenti/cinematica.js`, questo schema, `SCHEMA-VIDEO.md` §8 e le righe del tuo argomento in `VIDEO.md`.
2. Guarda che cosa dicono i tuoi video: `node strumenti/eventi-video.js <argomento>/<nome>` (fumetti e tempi).
3. Scrivi il file in **tre parti** (una risposta da 50 KB in un colpo si blocca): `Write` con introduzione e sezioni e i
   segnaposto `/*__CONTINUA_GRAFICI__*/` e `/*__CONTINUA__*/`, poi due `Edit` (grafici; il resto).
4. `node strumenti/verifica-argomento.js argomenti/<id>.js` finché non dice `OK`; `node strumenti/leggibilita.js … --frasi`.
5. Ricontrolla i conti con `node`, uno per uno.
6. Guarda la pagina con il banco (una Chrome per volta, poche foto, il PC si scalda):
   ```
   node strumenti/banco.js argomento/<id>/teoria --w 384 --h 800 --font 130 --shot foto.png
   node strumenti/banco.js argomento/<id>/esercizi --js prova.js --w 384 --h 800
   node strumenti/banco.js argomento/<id>/teoria --js strumenti/prova-trascina.js     # i punti trascinabili si muovono?
   ```
   Senza `#/` davanti (Git Bash lo trasformerebbe in un percorso). Guarda davvero le foto: etichette che si toccano,
   testi tagliati a 384 px, grafici troppo bassi.
