# I video di fisica — il contratto

Brevi lezioni animate su canvas, raccontate da **Stilla** (una goccia d'acqua) nei fumetti. Il sito non c'è ancora:
i video si fanno per primi e il sito si costruirà attorno a loro. Motore: `quanto-video.js` (lo stesso di Compasso,
con Stilla al posto di Ada; non si tocca dai file dei video). Modello da leggere per primo:
`C:\Users\lfili\OneDrive\Documenti\app\Compasso\video\derivate\derivata.js` (un video di matematica: la forma
del file, la posa d'apertura, i tempi dei fumetti, la chiusura); per le opzioni di Stilla `video/_prova/stilla.js`.
Catalogo e stato dei lavori: `VIDEO.md`. Questo contratto è quello di Compasso; ciò che è proprio della fisica sta
nel §8, **da leggere tutto**.

## 1. Che cosa è un video

- **Una sola idea.** 50–110 secondi. Se un argomento ha più idee, si fanno più video. Meglio due
  video da 70 s che uno da 140 s.
- **Chiuso.** Niente presentazione di Stilla («ciao, sono Stilla»), niente rimandi ad altri video, al sito,
  a «oggi», «ciao», «alla prossima», «ti è piaciuto». Prima frase: una domanda o un fatto
  sull'argomento. Ultima: una sintesi dell'argomento.
- **Stilla racconta**, nei fumetti in basso a sinistra. Niente didascalie in alto.
- **Ogni fumetto descrive quello che si vede in quel momento.** Due eventi = due fumetti: se Stilla dice
  «qui è piatta» e poi «qui è ripidissima», sono due fumetti, e mentre ciascuno è aperto
  l'animazione **sta ferma** sullo stato di cui si parla. Mai una frase che riassume due momenti
  diversi dell'animazione.
- **Fine senza buchi:** l'ultimo fumetto finisce al massimo 3 s prima della fine del video (negli ultimi 2 s Stilla si scioglie in una pozzanghera).
- **Fumetti corti:** al massimo due righe (`\n`), circa 38 caratteri per riga. Restano aperti
  almeno 1,5 s + 0,25 s per parola (una formula conta come una parola). Pause senza fumetto: al massimo 3 s.
- **Fisica e matematica giuste** (vedi §8): stesse notazioni in tutti i video. Coordinate
  col punto e virgola `(2; 4)`, virgola decimale `1,5`, segno meno vero `−`, `·` per il prodotto.
  Ogni numero mostrato va ricontrollato con `node`. Il prodotto si scrive sempre `·`, mai `×`; una notazione sola per tutto il video (pillole comprese).
- **Ogni simbolo nuovo si dice prima di usarlo**: se compaiono h, u, f e g, un fumetto o un'etichetta dice che cosa sono la prima volta che si vedono.
- **Etichette lontane dalle linee che si muovono**: un'etichetta di un punto non deve mai essere attraversata da una retta o da una curva durante l'animazione.
- **Testo leggibile sul telefono**: il video a schermo intero su un telefono è largo ~800 px veri,
  quindi testo ≥ 30 px, formule ≥ 40 px, numeri importanti ≥ 44 px (in coordinate 1920).

## 2. Il file

`video/<argomento>/<nome>.js`, id `<argomento>/<nome>` (nome in minuscolo-con-trattini).

```js
'use strict';
/* Titolo — una riga su che cosa mostra. Argomento: <id>. */
CVIDEO.registra('<argomento>/<nome>', M => {
  const { W, H, C, E, P, life, kf, clamp, lerp, TITOLI, conFont, drawRich, txt, drawSeq, fixedNum, fmtN,
    dot, glowStroke, dashed, makePlane, card } = M;   // solo quello che serve
  // costanti e funzioni locali (piani, curve, aiutanti propri)
  const POSA = { ... }, FACCIA = [ ... ], FUMETTI = [ ... ];
  function scenaUno(ctx, t) { ... }
  return {
    titolo: 'Titolo breve', durata: 92, copertina: 4.2,      // copertina: l'istante mostrato da fermo
    stilla: { posa: POSA, facce: FACCIA, fumetti: FUMETTI },  // entrata e uscita: di serie; stati e pioggia: §6
    capitoli: [[7.5, 30, 'nome del pezzo'], ...],            // facoltativi; numerati da soli
    scena(ctx, t) { scenaUno(ctx, t); ... },
  };
});
```

- `scena(ctx, t)` è una **funzione pura del tempo**: niente `Math.random`, niente `Date`, niente
  stato che passa da un fotogramma all'altro. Il lettore salta avanti e indietro, l'esportatore
  disegna fotogrammi in ordine qualunque.
- Il motore disegna da sé: carta a quadretti, titoletti dei capitoli, Stilla, fumetti, dissolvenza
  iniziale e finale (ultimo 1,2 s). La scena disegna solo il contenuto.
- **JavaScript che capiscono anche gli iPad vecchi** (Safari 12): niente `??`, `?.`, `||=`/`??=`, `.at()`,
  `replaceAll`, campi di classe `#x`, regex con lookbehind `(?<=…)`/`(?<!…)`. Un solo pezzo di sintassi troppo
  nuova fa fallire tutto il file, e sull'iPad il video non parte (su Compasso il sito intero restava bianco).
  Al posto di `a ?? b` si scrive `(a != null ? a : b)`, al posto di `x.at(-1)` si scrive `x[x.length - 1]`.
- **Non toccare** `quanto-video.js`, gli strumenti, né i file di altri argomenti. Un aiutante nuovo si scrive dentro
  il proprio file.

## 3. La tela e le zone

Coordinate fisse 1920×1080 (il motore scala da solo).

| zona | dove | uso |
|---|---|---|
| capitolo | x 64–900, y 30–90 | riservata al titoletto del capitolo |
| Stilla (di serie) | posa x 190, y 1050, s 2.2 → occupa x 50–330, y 800–1060 | non metterci niente |
| fumetto | da x ≈ 345, centrato su y ≈ 914; alto 115 (una riga) o 170 (due); largo fino a ~1150 | non metterci niente sotto y 800 a sinistra di x 1200 |
| contenuto | y 100–800 su tutta la larghezza; sotto y 800 solo a destra di x 1200 | grafici, schede, formule |

- **Apertura (0–7,5 s):** Stilla grande al centro (`x 760, y 900, s 4.4`), titolo in Fraunces 130 px a
  y 180, primo fumetto alla sua destra; a 6,4–7,6 s Stilla scende in basso a sinistra. Copiare `POSA`
  dal modello.
- **Chiusura (ultimi 10–14 s):** «in una frase» + frase in Fraunces + 2–3 pillole (`card`), Stilla in
  basso a sinistra o a `x 420, y 1035, s 3`; ultimo fumetto = sintesi.
- I grafici stanno in una scheda (`card`) come nel modello; i riquadri di testo pure.

## 4. Colori e testo

Sempre `C.*`, mai colori scritti a mano: il tema scuro li cambia tutti.

| colore | per |
|---|---|
| `C.ink`, `C.dim` | testo normale e secondario, assi |
| `C.x` azzurro | ingressi, la x, Δx, il lato «sinistro» |
| `C.y` arancio | uscite, la y, f(x), le curve dei grafici |
| `C.v` viola | concetti chiave, rette, la cosa nuova del video |
| `C.g` verde | risultati, «va bene», il valore a cui si arriva |
| `C.r` rosso | errori, «non esiste», «non è…» |

Testo ricco (`drawRich`): `{g:parola}` colora; `{mx:f(x)}` scrive in matematica (font di KaTeX, lettere
in corsivo) col colore x; `{mink:…}` matematica nel colore del testo. Nessun annidamento: si scrive
`{my:f(}{mx:x}{my:)}`. Apici: `x²`, `x³`, `f′`. Le lettere greche minuscole dentro la matematica (α, σ, μ, π…)
escono in corsivo come nel sito (dal 3 ottobre): non usare le lettere Unicode matematiche (𝜎, 𝜇), che dipendono dai font del telefono. Titoli in Fraunces: `conFont(TITOLI, () => drawRich(...))`.

## 5. Gli strumenti (`M`)

| strumento | uso |
|---|---|
| `P(t, a, b, E.io)` | avanzamento 0→1 fra a e b con easing (`E.lin`, `E.out`, `E.in`, `E.io`, `E.back` che rimbalza) |
| `life(t, a, b, fi, fo)` | entra ad a, esce a b (alfa) |
| `kf(t, [[t, v], …])` | valore fra fotogrammi chiave (fermo prima del primo e dopo l'ultimo) |
| `drawRich(ctx, s, x, y, { size, weight, align, alpha, local, stagger, lh })` | testo ricco; con `local = t - inizio` le parole salgono una alla volta |
| `txt(ctx, s, x, y, { size, weight, color, align, alpha })` | testo semplice |
| `drawSeq(ctx, items, cx, cy, size, { local, alpha })` | formula in riga: stringhe, `{num, den}` frazioni, `{lim: pedice}` |
| `drawLim(ctx, pedice, corpo, x, y, { size, local, alpha })` | lim col pedice sotto |
| `fixedNum(ctx, '1,50', xDestra, y, size, colore)` | numeri che cambiano senza ballare; `fmtN(v, decimali)` li formatta all'italiana |
| `makePlane({ ox, oy, u, x0, x1, y0, y1, ystep, ylab })` | piano: `.toS(x, y)` → pixel, `.axes(ctx, k)`, `.curve(f, a, b, n)` → punti |
| `glowStroke(ctx, punti, k, colore, w)` | traccia la frazione k di una spezzata (curve che si disegnano) |
| `partial(ctx, punti, k)` | come sopra con lo `strokeStyle` già scelto; restituisce [punto finale, angolo] |
| `dashed(ctx, a, b, colore, k, alfa)` | tratteggio da a verso b |
| `dot(ctx, [x, y], colore, scala, r)`, `ball(ctx, x, y, etichetta, colore, { r, scale, alpha })` | punti e palline con numero |
| `hole(ctx, p, colore, scala, r)` | cerchietto vuoto (punto escluso) |
| `traveler(ctx, piano, x, f, colore, alfa)` | punto sul grafico con le proiezioni sugli assi |
| `arrowHead(ctx, [x, y], angolo, colore, scala)` | punta di freccia |
| `card(ctx, x, y, w, h, alfa)`, `panel(…)` | schede |
| `axisLabel(ctx, p, '2', colore)` | numero colorato sopra la tacca dell'asse |
| `checkMark` / `crossMark(ctx, x, y, k, colore, scala)` | segno di spunta / croce che si disegnano |
| `machine`, `runTimes`, `drawRunIn`, `drawRunOut`, `machineFx` | la macchina delle funzioni con le palline (vedi `video/funzioni-generalita/funzione.js`) |
| `css(c, a)`, `mix(a, b, t)`, `lerp`, `clamp` | colori e numeri |

Il piano non disegna le etichette degli assi oltre `x1`/`y1`; `ystep: 2` scrive un numero sì e uno no.

## 6. Stilla

- `posa`: fotogrammi chiave per `x`, `y`, `s` (scala) e `lx`, `ly` (dove guarda), come nel modello.
- `facce`: `[t, faccia]`. Facce: `neutro`, `felice`, `occhiolino`, `pensa`, `sorpreso`, `festa`, `freddo` (batte i
  denti), `dorme`. Salto, schiacciamento e scossa partono da soli al cambio di faccia.
- `fumetti`: `[inizio, fine, 'testo\nseconda riga']`. Mentre il testo compare Stilla muove la bocca e trema un po'
  (solo con la faccia `neutro`).
- **Entrata e uscita, da sole:** cade dall'alto fra 0,6 e 1,3 s e atterra schiacciandosi; negli ultimi 2 s si scioglie
  in una pozzanghera. (`entrata: false` / `uscita: false` le tolgono; di solito non serve.)
- `stati`: `[[t, 'ghiaccio' | 'nuvola' | 'liquida'], …]` — da t si trasforma in 1,5 s in un cubetto di ghiaccio, in una
  nuvola (che fluttua più in alto) o torna goccia. `pioggia: [[a, b], …]`: fra a e b, se è nuvola, piove.
  **Solo quando c'entra** (calore, cambiamenti di stato, gas, pressione, fluidi): non come decorazione.
- Le facce accompagnano: `sorpreso` quando succede qualcosa d'inatteso, `pensa` su una domanda,
  `felice`/`festa` quando torna il conto. Non cambiare faccia più di una volta ogni 2 s. **Eccezione voluta**:
  l'entrata (`sorpreso` a 1,45 s, `felice` a 2,0 s, come nel modello) non va contata.

## 7. Collaudo (obbligatorio prima di dire «fatto»)

```
node strumenti/controlla-video.js <argomento>/<nome>                         # regole del §1: deve dare ✓
node ../Compasso/strumenti/compatibilita.js video/<argomento>/<nome>.js   # iPad vecchi (§2): deve dare «ok»
node strumenti/esporta-video.js <argomento>/<nome> --foto 4,9.5,15,…         # PNG in C:/Users/lfili/Videos/Quanto/_prove/<id>/
node strumenti/esporta-video.js <argomento>/<nome> --foto 30,60 --tema scuro
```

**Il PC si scalda**: le foto passano da un lucchetto (una sola Chrome alla volta su tutto il PC, gli altri aspettano
il turno da soli). Fotografare a gruppi di **al massimo 15 istanti per comando**, un comando alla volta; mai l'MP4.

Fotografare **ogni fumetto** (a metà della sua durata) e i momenti chiave, poi **guardare ogni
immagine** e controllare:

1. nessun testo si sovrappone a testo, a curve, frecce o oggetti importanti, a Stilla o al fumetto;
2. ogni fumetto parla di ciò che si vede in quel fotogramma;
3. il testo sta dentro le sue schede, niente esce dalla tela;
4. ogni numero, unità e formula è giusto (rifare i conti con `node`), e il moto disegnato è quello vero (§8);
5. il tema scuro è leggibile;
6. le regole del §1 (chiuso, una idea, frasi corte).

## 8. La fisica

- **Il moto disegnato è quello vero.** Ogni cosa che si muove segue la sua legge, scritta nel codice come funzione
  del tempo (`s = ½·a·t²`, `x = A·cos(ω·t)`, la parabola del proiettile, la legge di Hooke…), non un'animazione a
  occhio con l'easing. Si può rallentare il tempo (dirlo: «al rallentatore») ma senza falsare le proporzioni: un corpo
  che cade non va a velocità costante, una molla non oscilla con un periodo che dipende dall'ampiezza.
- **Numeri e unità all'italiana e nel SI:** virgola decimale, spazio fra numero e unità: `9,8 m/s²`, `72 km/h`,
  `20 m/s`, `1,5 kg`, `300 K`, `25 °C` (gradi Celsius con lo spazio), angoli `30°` attaccati. `g = 9,8 m/s²` in
  tutti i video (9,81 solo se il conto lo chiede, dicendolo). Valori arrotondati con `≈`. Prodotto `·`, frazione `/`.
- **Grandezze in corsivo matematico** (`{mv:F}`, `{mx:v}`, `{mink:t}`), unità in tondo (testo normale). Un vettore
  si disegna come freccia e nel testo si chiama per nome («la forza F», «la velocità v»): niente frecce sopra le
  lettere (il font del telefono non le garantisce). Il modulo, quando serve distinguerlo, si dice a parole.
- **Seno e coseno nel primo biennio (Luca, 6/10):** gli studenti li conoscono **solo come strumento per scomporre un
  vettore** (Fx = F·cos α, Fy = F·sin α, con la calcolatrice). Si possono usare per questo, dicendo che α si misura
  dall'asse; niente altra trigonometria (identità, grafici, leggi coi seni come Snell). Dove basta, restano bene anche
  i rapporti fra lati (P∥ = P·h/l) e il mezzo triangolo equilatero. Trigonometria piena dal terzo anno. Si scrive
  **sin** (non «sen»).
- Si scrive **chilogrammo** e **chilowattora** (forme ufficiali italiane), non «kilogrammo» / «kilowattora».
- **g** si scrive `9,8 m/s²` in tutti i video (in «massa e peso» si dice una volta che vuol dire 9,8 N per ogni kg).
- **Simboli fissi** (scelte di Luca): la **densità** si scrive `d` (mai ρ): p = p₀ + d·g·h, spinta = d·V·g; ρ resta solo
  per la resistività (R = ρ·L/S). Se nello stesso video servono anche una distanza o un diametro, non chiamarli d.
- **Colori delle grandezze**, gli stessi in tutti i video: **velocità** `C.x` (azzurro), **forze** `C.y` (arancio),
  **accelerazione** `C.v` (viola), **energia e risultati** `C.g` (verde), **idee sbagliate** `C.r` (rosso). Dove queste
  grandezze non ci sono vale la tabella del §4.
- **Frecce dei vettori lunghe in proporzione al modulo** (doppia forza, freccia doppia), con la punta di
  `arrowHead`; l'etichetta accanto alla freccia, mai sopra la punta, mai attraversata da altre frecce.
- **Le idee sbagliate si mostrano e si smontano**: se il video ne smonta una («i corpi pesanti cadono prima»), prima la
  si fa vedere in rosso come ipotesi («se fosse così…»), poi l'esperimento la smentisce. Mai lasciarla in piedi.
- **Definizioni da libro di liceo**, senza semplificazioni false: peso ≠ massa, calore ≠ temperatura, lavoro con il
  coseno, la corrente non si consuma, la forza non serve a mantenere il moto. Nel dubbio, una frase in meno.
- **Esperimenti veri e riconoscibili** quando esistono (il martello e la piuma dell'Apollo 15, il pendolo di
  Galileo, il tubo di Torricelli, le fenditure di Young): citarli con il nome, senza date sbagliate.
