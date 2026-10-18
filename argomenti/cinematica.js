/* Quanto — Il moto rettilineo (cinematica, primo anno). Argomento modello: chi scrive gli altri parte da qui.
   Contratto in SCHEMA.md. Verifica: node strumenti/verifica-argomento.js argomenti/cinematica.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'cinematica',
  titolo: 'Il moto rettilineo',
  introduzione: R`La **cinematica** descrive il moto: dove si trova un corpo, quanto è veloce, come cambia la sua velocità. Non si chiede ancora *perché* si muove così: quella è la dinamica, che arriva dopo.

Qui ci occupiamo del moto **rettilineo**, lungo una retta: un'auto su un rettilineo, un treno, un sasso che cade. Basta un numero per dire dove si trova il corpo, come su un righello. Con tre grandezze, posizione, velocità e accelerazione, si risponde a domande concrete. Quando si incontrano due auto? Quanti metri servono per frenare? Da che altezza è caduto un sasso?

Serve saper usare le unità del Sistema Internazionale (metri, secondi) e leggere un grafico.`,
  inBreve: [
    R`La **velocità media** è lo spostamento diviso il tempo impiegato: $v_m = \dfrac{\Delta s}{\Delta t}$. Per passare da km/h a m/s si divide per $3{,}6$.`,
    R`Nel grafico posizione–tempo la **pendenza** è la velocità: piatto vuol dire fermo, ripido vuol dire veloce.`,
    R`L'**accelerazione** dice di quanto cambia la velocità ogni secondo: $a = \dfrac{\Delta v}{\Delta t}$, in $\text{m/s}^2$.`,
    R`Nel grafico velocità–tempo la pendenza è l'accelerazione e l'**area** sotto la linea è lo spazio percorso.`,
    R`Nel vuoto, vicino alla superficie della Terra, tutti i corpi cadono con la stessa accelerazione $g = 9{,}8\,\text{m/s}^2$, pesanti o leggeri.`
  ],
  sezioni: [
    {
      id: 'posizione',
      titolo: 'Posizione, tempo, spostamento',
      testo: R`Per dire dove si trova un corpo serve un **sistema di riferimento**. Su una retta basta scegliere un punto zero (l'origine) e un verso positivo. La **posizione** $s$ è la distanza dall'origine, con il segno: positiva da una parte, negativa dall'altra. Si misura in metri.

Il **tempo** $t$ si conta in secondi, dal via del cronometro. Un *istante* è un valore di $t$; un *intervallo* è il tempo fra due istanti.

>* La **legge oraria** dice la posizione in ogni istante: $s(t)$. Si può dare con una tabella, con un grafico o con una formula.

Lo **spostamento** è la differenza fra la posizione finale e quella iniziale:

$$\Delta s = s_2 - s_1$$

Il simbolo $\Delta$ (delta) vuol dire sempre «finale meno iniziale». Allo stesso modo $\Delta t = t_2 - t_1$ è l'intervallo di tempo.

Esempio. Un'auto passa dal cartello dei 40 m a quello dei 100 m. Lo spostamento è $\Delta s = 100\,\text{m} - 40\,\text{m} = 60\,\text{m}$. Se poi torna indietro fino ai 70 m, il nuovo spostamento è $\Delta s = 70\,\text{m} - 100\,\text{m} = -30\,\text{m}$. Il segno meno dice che è andata nel verso negativo.

>! Lo spostamento non è la strada percorsa. Chi va da 40 m a 100 m e torna a 70 m ha percorso 90 m. Però si è spostato di 30 m in tutto.

?? Un ciclista parte dalla posizione 500 m e arriva alla posizione 200 m. Quanto vale il suo spostamento?
[ ] $300\,\text{m}$
[x] $-300\,\text{m}$
[ ] $700\,\text{m}$
=> Finale meno iniziale: $200 - 500 = -300\,\text{m}$. Il segno meno dice che si è mosso verso lo zero.`
    },
    {
      id: 'velocita',
      titolo: 'La velocità e il grafico posizione–tempo',
      testo: R`Due auto fanno 100 m: una in 5 secondi, l'altra in 20. La prima è più veloce perché copre più spazio in ogni secondo.

>* La **velocità media** è lo spostamento diviso l'intervallo di tempo: $v_m = \dfrac{\Delta s}{\Delta t}$. Si misura in metri al secondo, $\text{m/s}$.

Sulla strada si usano i chilometri orari. Un'ora ha 3600 secondi e un chilometro ha 1000 metri, quindi $1\,\text{m/s} = 3{,}6\,\text{km/h}$.

~ 72\,\text{km/h} = \dfrac{72\,000\,\text{m}}{3600\,\text{s}} :: un chilometro sono mille metri, un'ora sono 3600 secondi
~ = \evidb{20\,\text{m/s}} :: in pratica si divide per $3{,}6$

Il modo migliore per vedere un moto è il **grafico posizione–tempo**: il tempo in orizzontale, la posizione in verticale. Ogni punto dice dove si trovava il corpo in quell'istante.

[[video:cinematica/legge-oraria]]

Qui sotto c'è un altro viaggio dello stesso tipo: l'auto va piano, poi si ferma, poi riparte più veloce. Dove il grafico è piatto la posizione non cambia: l'auto è ferma. Dove è ripido, in un secondo fa molti metri.

[[grafico:viaggio]]

>* La **pendenza** del grafico posizione–tempo è la velocità: $\Delta s$ in verticale diviso $\Delta t$ in orizzontale.

Se il grafico è curvo, la pendenza cambia da un punto all'altro. In un punto preciso si guarda la **retta tangente** al grafico: la sua pendenza è la **velocità istantanea**, quella che segna il tachimetro.

>! Il grafico non è il disegno della strada. Una strada dritta può dare un grafico pieno di pieghe: ogni piega è un cambio di velocità, non una curva.

Muovi i cursori: la pendenza della retta è la velocità, e il triangolo la misura.

[[grafico:pendenza]]

?? Nel grafico posizione–tempo un tratto scende verso il basso. Che cosa fa il corpo?
[ ] rallenta fino a fermarsi
[ ] va in discesa
[x] torna indietro, verso l'origine
=> La posizione diminuisce: il corpo si muove nel verso negativo, e la velocità è negativa. Il grafico non mostra salite e discese della strada.`
    },
    {
      id: 'moto-uniforme',
      titolo: 'Il moto rettilineo uniforme',
      testo: R`Un treno corre a 30 m/s per un minuto intero, senza mai rallentare. Ogni secondo fa gli stessi 30 metri.

>* Nel **moto rettilineo uniforme** la velocità è costante. La legge oraria è $s = s_0 + v \cdot t$, dove $s_0$ è la posizione all'istante zero.

Il grafico posizione–tempo è una **retta**. Parte da $s_0$ sull'asse verticale e ha pendenza $v$. Se $v$ è negativa, la retta scende: il corpo va verso l'origine.

Esempio. Un'auto parte dalla posizione $s_0 = 50\,\text{m}$ a $v = 20\,\text{m/s}$. Dove si trova dopo 4 s?

~ s = s_0 + v \cdot t :: la legge oraria del moto uniforme
~ s = 50\,\text{m} + 20\,\text{m/s} \cdot 4\,\text{s} :: metto i numeri con le unità: i secondi si semplificano
~ s = \evidb{130\,\text{m}} :: 50 m di partenza più 80 m percorsi

La legge oraria serve anche a trovare **quando e dove si incontrano** due corpi. Si scrive una legge per ciascuno, nello stesso riferimento. Poi si cerca l'istante in cui le due posizioni sono uguali.

[[video:cinematica/moto-uniforme]]

Nel grafico le due auto sono due rette. Il punto in cui si incrociano dice l'istante e il luogo dell'incontro.

[[grafico:incontro]]

>! Chi va verso l'origine ha velocità negativa. Nella legge oraria dell'auto che parte da 150 km si scrive $s = 150 - 60 \cdot t$, non $150 + 60 \cdot t$.

?? Due auto in moto uniforme. Nel grafico posizione–tempo la retta di A è più ripida di quella di B. Quale va più veloce?
[x] A
[ ] B
[ ] vanno uguali, se le rette partono dallo stesso punto
=> La pendenza è la velocità: più ripida vuol dire più veloce. Il punto di partenza dice solo dove si trovavano all'inizio.`
    },
    {
      id: 'accelerazione',
      titolo: 'L\'accelerazione e il grafico velocità–tempo',
      testo: R`Al semaforo verde un'auto parte da ferma. Dopo un secondo va a 2 m/s, dopo due secondi a 4 m/s, dopo tre a 6 m/s. La velocità cresce di 2 m/s ogni secondo.

>* L'**accelerazione** media è la variazione di velocità divisa l'intervallo di tempo: $a = \dfrac{\Delta v}{\Delta t}$. Si misura in metri al secondo quadrato, $\text{m/s}^2$.

$2\,\text{m/s}^2$ si legge così: ogni secondo la velocità aumenta di 2 m/s. Se l'auto va nel verso positivo e frena, la velocità diminuisce e l'accelerazione è **negativa**.

~ a = \dfrac{v_2 - v_1}{t_2 - t_1} :: variazione di velocità diviso tempo impiegato
~ a = \dfrac{6\,\text{m/s} - 18\,\text{m/s}}{4\,\text{s}} :: un'auto che frena da 18 a 6 m/s in 4 secondi
~ a = \evidb{-3\,\text{m/s}^2} :: ogni secondo perde 3 m/s: il segno meno vuol dire che frena

Nel **grafico velocità–tempo** la pendenza è l'accelerazione. Ma c'è di più: l'**area** sotto la linea è lo spazio percorso. Con la velocità costante l'area è un rettangolo, base per altezza: tempo per velocità.

?? Nel moto uniforme, che forma ha il grafico velocità–tempo?
[x] una retta orizzontale
[ ] una retta che sale
[ ] una parabola
=> La velocità non cambia, quindi resta alla stessa altezza in ogni istante. È il grafico posizione–tempo a essere una retta inclinata.

[[video:cinematica/accelerazione]]

Sposta il cursore: l'area colorata cresce, e il conto dice quanti metri ha fatto l'auto fino a quell'istante.

[[grafico:area]]

>! L'accelerazione non è la velocità. Nell'istante in cui un'auto parte da ferma, la velocità è zero, ma l'accelerazione è già grande. Un'auto a 130 km/h costanti su un rettilineo ha accelerazione zero.

?? Un'auto viaggia a 25 m/s costanti su un rettilineo. Quanto vale la sua accelerazione?
[ ] $25\,\text{m/s}^2$
[x] zero
[ ] $9{,}8\,\text{m/s}^2$
=> La velocità non cambia, quindi $\Delta v = 0$ e anche $a = 0$. Una velocità grande non vuol dire accelerazione grande.`
    },
    {
      id: 'moto-accelerato',
      titolo: 'Il moto uniformemente accelerato',
      testo: R`Quando l'accelerazione è costante il moto si chiama **uniformemente accelerato**. La velocità cresce, o cala, sempre dello stesso valore ogni secondo.

>* Nel moto uniformemente accelerato valgono $v = v_0 + a \cdot t$ e $s = s_0 + v_0 \cdot t + \frac{1}{2} \cdot a \cdot t^2$. Qui $v_0$ è la velocità all'istante zero.

La seconda formula viene dall'area sotto il grafico velocità–tempo. Partendo da fermi l'area è un triangolo: base $t$, altezza $v = a \cdot t$.

~ s = \dfrac{1}{2} \cdot t \cdot v :: area del triangolo: base per altezza diviso due
~ s = \dfrac{1}{2} \cdot t \cdot \evid{a \cdot t} :: al posto di $v$ metto $a \cdot t$, partendo da fermi
~ s = \evidb{\tfrac{1}{2} \cdot a \cdot t^2} :: lo spazio cresce con il quadrato del tempo

Se parte già con velocità $v_0$, sotto il grafico c'è anche un rettangolo: base $t$, altezza $v_0$. Per questo nella formula c'è in più il termine $v_0 \cdot t$.

Tempo doppio vuol dire spazio **quattro volte** più grande. Il grafico posizione–tempo è un arco di parabola.

[[grafico:parabola]]

Quando non si conosce il tempo si usa una terza formula, che lo elimina:

$$v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$$

Serve soprattutto per la **frenata**. Fino a fermarsi ($v = 0$) lo spazio è $\Delta s = \dfrac{v_0^2}{2 \cdot a}$, con $a$ preso senza segno. La velocità compare al quadrato: a velocità doppia servono quattro volte i metri.

[[video:cinematica/frenata]]

Nel grafico ci sono le due frenate con gli stessi freni. Il triangolo di 100 km/h ha il doppio della base e il doppio dell'altezza.

[[grafico:frenata]]

>! Le unità devono essere coerenti. Se l'accelerazione è in $\text{m/s}^2$, servono metri e secondi: una velocità in km/h va prima divisa per $3{,}6$.

?? A 30 km/h un'auto si ferma in 5 m. Con gli stessi freni, quanti metri servono a 60 km/h?
[ ] 10 m
[ ] 15 m
[x] 20 m
=> Lo spazio di frenata va con il quadrato della velocità: velocità doppia, spazio quattro volte. $4 \cdot 5 = 20\,\text{m}$.`
    },
    {
      id: 'caduta-libera',
      titolo: 'La caduta libera',
      testo: R`Un sasso lasciato cadere va sempre più veloce. Per secoli si è pensato che i corpi pesanti cadessero prima di quelli leggeri. Lo diceva Aristotele, e sembra confermarlo una piuma che scende piano.

[[video:cinematica/caduta-libera]]

La piuma scende piano perché l'aria la frena. Senza aria, sulla Luna o in un tubo dove si è tolta l'aria, martello e piuma arrivano insieme.

>* Nel vuoto, vicino alla Terra, tutti i corpi cadono con la stessa accelerazione costante: l'**accelerazione di gravità** $g = 9{,}8\,\text{m/s}^2$. È un moto uniformemente accelerato con $a = g$. Sulla Luna vale circa $1{,}6\,\text{m/s}^2$.

Partendo da fermo, dopo un tempo $t$ il corpo ha velocità $v = g \cdot t$ ed è sceso di $h = \frac{1}{2} \cdot g \cdot t^2$.

~ h = \tfrac{1}{2} \cdot g \cdot t^2 :: un sasso cade da fermo per 3 secondi
~ h = \tfrac{1}{2} \cdot 9{,}8\,\text{m/s}^2 \cdot (3\,\text{s})^2 :: il tempo va al quadrato con la sua unità
~ h = 4{,}9 \cdot 9\,\text{m} = \evidb{44{,}1\,\text{m}} :: e intanto ha raggiunto $v = 9{,}8 \cdot 3 = 29{,}4\,\text{m/s}$

Galileo scoprì una regola sorprendente. In tempi uguali, partendo da fermi, gli spazi percorsi crescono come i numeri dispari: 1, 3, 5, 7…

[[video:cinematica/dispari]]

Nel disegno ci sono le posizioni del sasso, una ogni secondo. Le frecce sono le velocità: ogni secondo crescono della stessa quantità, 9,8 m/s.

[[grafico:strobo]]

>! Il valore di $g$ non dipende dalla massa. Nell'aria però l'attrito conta, e conta di più per i corpi leggeri e larghi: per questo la piuma arriva dopo.

?? Nel vuoto lasci cadere insieme una biglia da 10 g e una palla da bowling da 7 kg. Che cosa succede?
[ ] arriva prima la palla da bowling, che pesa di più
[x] arrivano insieme
[ ] arriva prima la biglia, che è più piccola
=> Nel vuoto l'accelerazione è $g$ per tutti, qualunque sia la massa: stessa velocità in ogni istante, arrivo insieme.`
    },
    {
      id: 'problemi',
      titolo: 'Come si imposta un problema di moto',
      testo: R`I problemi di cinematica si somigliano tutti. Conviene affrontarli sempre con gli stessi passi.

1. **Fai un disegno.** Una retta, l'origine, il verso positivo, il corpo nella posizione di partenza.
2. **Scrivi i dati con il loro simbolo.** Per esempio $v_0 = 20\,\text{m/s}$, $a = -5\,\text{m/s}^2$, $s_0 = 0$.
3. **Rendi coerenti le unità.** Di solito metri, secondi, metri al secondo: i km/h si dividono per $3{,}6$, i minuti si moltiplicano per 60.
4. **Riconosci il moto.** Velocità costante: moto uniforme. Accelerazione costante: moto uniformemente accelerato.
5. **Scegli la formula** che contiene la grandezza cercata e solo dati che conosci. Se manca il tempo, usa $v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$.
6. **Controlla il risultato.** Ha l'unità giusta? È un numero ragionevole?

>* In ogni problema: disegno e riferimento, dati con i simboli, unità coerenti, tipo di moto, formula giusta, controllo.

> Prima di fare il conto, **stima** il risultato. Se un'auto in città ti viene a 3000 km/h, c'è un errore da qualche parte.

Esempio. Un'auto a 72 km/h frena con $a = -4\,\text{m/s}^2$. Quanti metri le servono per fermarsi?

~ v_0 = \dfrac{72}{3{,}6}\,\text{m/s} = 20\,\text{m/s} :: prima di tutto le unità: 72 km/h in m/s
~ 0 = v_0^2 + 2 \cdot a \cdot \Delta s :: alla fine è ferma, e il tempo non lo conosco
~ \Delta s = \dfrac{-v_0^2}{2 \cdot a} = \dfrac{-400}{2 \cdot (-4)}\,\text{m} :: ricavo lo spazio
~ \Delta s = \evidb{50\,\text{m}} :: positivo, e ragionevole per un'auto in frenata

>! Il segno dell'accelerazione dipende dal verso positivo scelto. Se l'auto va nel verso positivo e frena, $a$ è negativa. Se lo dimentichi, il conto dà uno spazio negativo, e allora te ne accorgi.`
    }
  ],
  grafici: {
    /* un viaggio come quello del video (con altri numeri): piano, ferma, veloce, tre tratti di retta con dominio */
    viaggio: {
      tipo: 'orario', grandezza: 's', t: [0, 14], y: [0, 80],
      funzioni: [
        { f: '5*t', dominio: [0, 6], colore: 1 },
        { f: '30', dominio: [6, 10], colore: 1 },
        { f: '30 + 10*(t - 10)', dominio: [10, 14], colore: 1 }
      ],
      elementi: [
        { tipo: 'testo', p: [2.4, 25], testo: 'piano: 5 m/s' },
        { tipo: 'testo', p: [8, 36], testo: 'ferma' },
        { tipo: 'testo', p: [9.6, 60], testo: 'veloce: 10 m/s', ancora: 'end' }
      ],
      didascalia: 'La posizione di un\'auto secondo per secondo. Piatto vuol dire fermo, ripido vuol dire veloce. Passa il dito sul grafico per leggere i valori.'
    },
    /* la pendenza come velocità: il triangolo Δs/Δt si aggiorna con i cursori */
    pendenza: {
      tipo: 'orario', grandezza: 's', t: [0, 9], y: [-25, 45],
      parametri: [
        { nome: 's0', min: 0, max: 20, passo: 1, valore: 5, etichetta: 's_0 (m)' },
        { nome: 'v', min: -5, max: 5, passo: 0.5, valore: 4, etichetta: 'v (m/s)' }
      ],
      funzioni: [{ f: 's0 + v*t', colore: 1 }],
      elementi: [
        { tipo: 'segmento', da: [2, 's0 + 2*v'], a: [6, 's0 + 2*v'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [6, 's0 + 2*v'], a: [6, 's0 + 6*v'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [4, 's0 + 2*v - 6*sign(v + 0.01)'], testo: 'Δt = 4 s' },
        { tipo: 'testo', p: [6.25, 's0 + 4*v'], testo: 'Δs = {{4*v}} m', ancora: 'start' }
      ],
      didascalia: 'La legge oraria s = s₀ + v·t. In 4 secondi la posizione cambia di Δs = 4·v metri: la pendenza della retta, Δs / Δt, è la velocità.'
    },
    /* le due auto del video «Quando si incontrano»: km e ore */
    incontro: {
      tipo: 'orario', grandezza: 's', unita: 'km', unitaTempo: 'h', t: [0, 2.5], y: [0, 160],
      funzioni: [
        { f: '90*t', dominio: [0, 1.667], colore: 1, etichetta: 'auto blu' },
        { f: '150 - 60*t', dominio: [0, 2.5], colore: 2, etichetta: 'auto arancio' }
      ],
      punti: [{ x: 1, y: 90, etichetta: 'incontro', posizione: 'destra', colore: 3 }],
      didascalia: 'La blu parte da A a 90 km/h, l\'arancio da B (150 km) a 60 km/h verso A. Le rette si incrociano a t = 1 h e s = 90 km.'
    },
    /* lo spazio è l'area sotto il grafico velocità–tempo */
    area: {
      tipo: 'orario', grandezza: 'v', t: [0, 10], y: [0, 22],
      parametri: [{ nome: 't1', min: 0, max: 10, passo: 0.5, valore: 6, etichetta: 'istante (s)' }],
      funzioni: [{ f: '2*t', colore: 1, etichetta: 'v = 2·t' }],
      elementi: [
        { tipo: 'area', f: '2*t', da: 0, a: 't1', colore: 3 },
        { tipo: 'punto', p: ['t1', '2*t1'], colore: 1 },
        { tipo: 'testo', p: [0.4, 16.5], testo: 'spazio = area = ½·{{t1}}·{{2*t1}} = {{t1*t1}} m', ancora: 'start', colore: 3 }
      ],
      didascalia: 'Un\'auto parte da ferma con a = 2 m/s². L\'area del triangolo, base per altezza diviso due, è lo spazio percorso fino a quell\'istante.'
    },
    /* lo spazio cresce con il quadrato del tempo */
    parabola: {
      tipo: 'orario', grandezza: 's', t: [0, 4], y: [0, 34],
      parametri: [{ nome: 'a', min: 0.5, max: 4, passo: 0.5, valore: 2, etichetta: 'a (m/s²)' }],
      funzioni: [{ f: '0.5*a*t^2', colore: 1 }],
      elementi: [
        { tipo: 'punto', p: [1, '0.5*a'], etichetta: '{{0.5*a}} m', posizione: 'alto-sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [2, '2*a'], etichetta: '{{2*a}} m', posizione: 'alto-sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [4, '8*a'], etichetta: '{{8*a}} m', posizione: 'sinistra', colore: 'grigio' }
      ],
      didascalia: 'Partenza da fermi: s = ½·a·t². Da 1 s a 2 s lo spazio diventa 4 volte tanto; da 2 s a 4 s ancora 4 volte.'
    },
    /* la frenata a 50 e a 100 km/h: triangoli simili, area quattro volte */
    frenata: {
      tipo: 'orario', grandezza: 'v', t: [0, 4], y: [0, 32],
      funzioni: [
        { f: '13.9 - 7.7*t', dominio: [0, 1.805], colore: 1, tratteggio: true },
        { f: '27.8 - 7.7*t', dominio: [0, 3.61], colore: 1 }
      ],
      elementi: [
        { tipo: 'area', f: '27.8 - 7.7*t', da: 0, a: 3.61, colore: 3 },
        { tipo: 'area', f: '13.9 - 7.7*t', da: 0, a: 1.805, colore: 3 },
        { tipo: 'testo', p: [3.0, 8], testo: '100 km/h', ancora: 'start' },
        { tipo: 'testo', p: [1.85, 4], testo: '50 km/h', ancora: 'start' }
      ],
      didascalia: 'Stessi freni (7,7 m/s in meno ogni secondo). Da 100 km/h (linea piena) lo spazio è circa 50 m, da 50 km/h (tratteggio) circa 12,5 m: triangolo alto il doppio e lungo il doppio, area quattro volte.'
    },
    /* la caduta fotografata ogni secondo: posizioni in scala e frecce delle velocità (vettori) */
    strobo: {
      tipo: 'piano', x: [-34, 50], y: [-102, 8], assi: false, griglia: false, altezza: 760,
      elementi: [
        { tipo: 'punto', p: [0, 0], etichetta: 't = 0 s', posizione: 'alto', colore: 'grigio' },
        { tipo: 'punto', p: [0, -4.9], etichetta: '1 s', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [0, -19.6], etichetta: '2 s', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [0, -44.1], etichetta: '3 s', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [0, -78.4], etichetta: '4 s', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [0, -78.4], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [14, -4.9], a: [14, -9.8], etichetta: '9,8 m/s', colore: 1 },
        { tipo: 'vettore', da: [14, -19.6], a: [14, -29.4], etichetta: '19,6 m/s', colore: 1 },
        { tipo: 'vettore', da: [14, -44.1], a: [14, -58.8], etichetta: '29,4 m/s', colore: 1 },
        { tipo: 'vettore', da: [14, -78.4], a: [14, -98], etichetta: '39,2 m/s', colore: 1 }
      ],
      didascalia: 'Il sasso fotografato ogni secondo, partendo da fermo: scende di 4,9 m, poi 14,7, 24,5, 34,3 (come 1, 3, 5, 7). Le frecce sono le velocità.'
    }
  },
  esempi: [
    {
      titolo: 'La velocità media di un viaggio',
      problema: R`Un treno parte da Bologna alle 10:00 e arriva a Firenze, 80 km più avanti, alle 10:40. Qual è la sua velocità media, in km/h e in m/s?`,
      passi: [
        R`Dati: $\Delta s = 80\,\text{km}$, $\Delta t = 40\,\text{min}$. Cerco $v_m$ in km/h e in m/s.`,
        R`Il tempo del viaggio è $\Delta t = 40\,\text{min}$. Per avere i km/h serve il tempo in ore: $40\,\text{min} = \frac{40}{60}\,\text{h} = \frac{2}{3}\,\text{h}$.`,
        R`Velocità media: spazio diviso tempo. $v_m = \dfrac{80\,\text{km}}{\frac{2}{3}\,\text{h}} = 80 \cdot \dfrac{3}{2}\,\text{km/h} = 120\,\text{km/h}$.`,
        R`Per passare ai m/s si divide per $3{,}6$: $v_m = \dfrac{120}{3{,}6}\,\text{m/s} \approx 33{,}3\,\text{m/s}$.`,
        R`Controllo con le unità del SI: $80\,000\,\text{m}$ in $2400\,\text{s}$ fanno $\dfrac{80\,000}{2400} \approx 33{,}3\,\text{m/s}$. Torna.`
      ],
      risultato: R`$v_m = 120\,\text{km/h} \approx 33{,}3\,\text{m/s}$`
    },
    {
      titolo: 'Due auto che si vengono incontro',
      problema: R`Due paesi distano 140 km. Dal primo parte un'auto a 80 km/h verso il secondo; nello stesso istante dal secondo parte un'auto a 60 km/h verso il primo. Quando e dove si incontrano?`,
      passi: [
        R`Dati: distanza $140\,\text{km}$, $v_1 = 80\,\text{km/h}$, $v_2 = 60\,\text{km/h}$. Cerco l'istante $t$ e la posizione $s$ dell'incontro.`,
        R`Scelgo il riferimento: origine nel primo paese, verso positivo verso il secondo. Uso km e ore, così non devo convertire.`,
        R`Prima auto: parte da 0 e va nel verso positivo, $s_1 = 80 \cdot t$. Seconda auto: parte da 140 e va verso l'origine, quindi la sua velocità è negativa: $s_2 = 140 - 60 \cdot t$.`,
        R`Si incontrano quando sono nello stesso posto: $s_1 = s_2$, cioè $80 \cdot t = 140 - 60 \cdot t$.`,
        R`Porto i termini con $t$ a sinistra: $140 \cdot t = 140$, quindi $t = 1\,\text{h}$.`,
        R`Il luogo: $s_1 = 80 \cdot 1 = 80\,\text{km}$ dal primo paese. Controllo con l'altra auto: $s_2 = 140 - 60 = 80\,\text{km}$. Torna.`
      ],
      risultato: R`Si incontrano dopo $1\,\text{h}$, a $80\,\text{km}$ dal primo paese.`
    },
    {
      titolo: 'Da 0 a 100 all\'ora',
      problema: R`Un'auto parte da ferma e raggiunge 27 m/s (circa 100 km/h) in 9 secondi, con accelerazione costante. Quanto vale l'accelerazione? Quanti metri percorre in quei 9 secondi?`,
      passi: [
        R`Dati: $v_0 = 0$, $v = 27\,\text{m/s}$, $\Delta t = 9\,\text{s}$. Cerco $a$ e lo spazio $\Delta s$.`,
        R`È un moto uniformemente accelerato con $v_0 = 0$. L'accelerazione è $a = \dfrac{\Delta v}{\Delta t} = \dfrac{27\,\text{m/s}}{9\,\text{s}} = 3\,\text{m/s}^2$.`,
        R`Lo spazio, partendo da fermi: $s = \frac{1}{2} \cdot a \cdot t^2 = \frac{1}{2} \cdot 3\,\text{m/s}^2 \cdot (9\,\text{s})^2$.`,
        R`Faccio il conto: $\frac{1}{2} \cdot 3 \cdot 81 = 121{,}5\,\text{m}$. I secondi al quadrato si semplificano e restano i metri.`,
        R`Controllo con l'area del grafico velocità–tempo: triangolo di base 9 s e altezza 27 m/s, area $\frac{9 \cdot 27}{2} = 121{,}5\,\text{m}$. Torna.`
      ],
      risultato: R`$a = 3\,\text{m/s}^2$, spazio $= 121{,}5\,\text{m}$`
    },
    {
      titolo: 'La distanza per fermarsi',
      problema: R`Un'auto viaggia a 72 km/h. Il guidatore vede un ostacolo e impiega 1 s prima di premere il freno. Poi l'auto rallenta con un'accelerazione di modulo $5\,\text{m/s}^2$. Quanti metri percorre in tutto prima di fermarsi?`,
      passi: [
        R`Dati: $v_0 = 72\,\text{km/h}$, tempo di reazione $1\,\text{s}$, accelerazione di modulo $a = 5\,\text{m/s}^2$. Cerco lo spazio totale per fermarsi.`,
        R`Prima le unità: $v_0 = \dfrac{72}{3{,}6}\,\text{m/s} = 20\,\text{m/s}$.`,
        R`Durante il tempo di reazione l'auto non rallenta: moto uniforme. In 1 s fa $s_r = 20\,\text{m/s} \cdot 1\,\text{s} = 20\,\text{m}$.`,
        R`Poi frena fino a fermarsi. Il tempo non lo conosco, quindi uso la formula senza tempo: $s_f = \dfrac{v_0^2}{2 \cdot a} = \dfrac{(20\,\text{m/s})^2}{2 \cdot 5\,\text{m/s}^2} = \dfrac{400}{10}\,\text{m} = 40\,\text{m}$.`,
        R`Spazio totale: $20\,\text{m} + 40\,\text{m} = 60\,\text{m}$. Un terzo dello spazio se ne va prima ancora di frenare.`
      ],
      risultato: R`Servono $60\,\text{m}$: $20\,\text{m}$ di reazione e $40\,\text{m}$ di frenata.`
    },
    {
      titolo: 'Il sasso dal ponte',
      problema: R`Un sasso viene lasciato cadere da un ponte e tocca l'acqua dopo 2,0 s. Trascurando l'aria, quanto è alto il ponte? Con che velocità il sasso arriva all'acqua?`,
      passi: [
        R`Dati: $v_0 = 0$, $t = 2{,}0\,\text{s}$, $g = 9{,}8\,\text{m/s}^2$. Cerco l'altezza $h$ e la velocità d'arrivo $v$.`,
        R`È una caduta libera da fermo: moto uniformemente accelerato con $a = g$.`,
        R`L'altezza è lo spazio percorso: $h = \frac{1}{2} \cdot g \cdot t^2 = \frac{1}{2} \cdot 9{,}8 \cdot 2{,}0^2\,\text{m} = 4{,}9 \cdot 4\,\text{m} = 19{,}6\,\text{m}$.`,
        R`La velocità finale: $v = g \cdot t = 9{,}8\,\text{m/s}^2 \cdot 2{,}0\,\text{s} = 19{,}6\,\text{m/s}$, cioè circa 71 km/h.`,
        R`Controllo con la formula senza tempo: $v^2 = 2 \cdot g \cdot h = 2 \cdot 9{,}8 \cdot 19{,}6 \approx 384$, e $\sqrt{384} \approx 19{,}6$. Torna.`
      ],
      risultato: R`Il ponte è alto circa $19{,}6\,\text{m}$; il sasso arriva a $19{,}6\,\text{m/s}$.`
    }
  ],
  formulario: [
    { nome: 'Spostamento e intervallo di tempo', formula: R`\Delta s = s_2 - s_1 \qquad \Delta t = t_2 - t_1`, nota: R`Sempre finale meno iniziale. Lo spostamento può essere negativo.` },
    { nome: 'Velocità media', formula: R`v_m = \dfrac{\Delta s}{\Delta t}`, nota: R`In $\text{m/s}$. È la pendenza del grafico posizione–tempo.` },
    { nome: 'Da km/h a m/s', formula: R`1\,\text{m/s} = 3{,}6\,\text{km/h}`, nota: R`Da km/h a m/s si divide per $3{,}6$; da m/s a km/h si moltiplica.` },
    { nome: 'Moto rettilineo uniforme', formula: R`s = s_0 + v \cdot t`, nota: R`Velocità costante. Grafico posizione–tempo: una retta di pendenza $v$.` },
    { nome: 'Accelerazione media', formula: R`a = \dfrac{\Delta v}{\Delta t}`, nota: R`In $\text{m/s}^2$. Negativa quando, andando nel verso positivo, si frena.` },
    { nome: 'Velocità nel moto uniformemente accelerato', formula: R`v = v_0 + a \cdot t`, nota: R`Accelerazione costante. Grafico velocità–tempo: una retta di pendenza $a$.` },
    { nome: 'Legge oraria del moto uniformemente accelerato', formula: R`s = s_0 + v_0 \cdot t + \tfrac{1}{2} \cdot a \cdot t^2`, nota: R`Da fermi e dall'origine: $s = \frac{1}{2} \cdot a \cdot t^2$.` },
    { nome: 'Formula senza il tempo', formula: R`v^2 = v_0^2 + 2 \cdot a \cdot \Delta s`, nota: R`Per la frenata fino a fermarsi: $\Delta s = \dfrac{v_0^2}{2 \cdot a}$, con $a$ in modulo.` },
    { nome: 'Spazio dal grafico velocità–tempo', formula: R`\Delta s = \text{area sotto il grafico } v\text{–}t`, nota: R`Rettangolo con la velocità costante, triangolo partendo da fermi.` },
    { nome: 'Caduta libera da fermo', formula: R`v = g \cdot t \qquad h = \tfrac{1}{2} \cdot g \cdot t^2`, nota: R`Nel vuoto, vicino alla Terra, $g = 9{,}8\,\text{m/s}^2$ per tutti i corpi.` },
    { nome: 'Velocità d\'arrivo dopo una caduta da fermo', formula: R`v = \sqrt{2 \cdot g \cdot h}`, nota: R`Viene dalla formula senza il tempo, con $v_0 = 0$ e $a = g$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'posizione', tipo: 'definizione', fronte: R`Che cos'è la **legge oraria** di un moto?`, retro: R`La posizione del corpo in ogni istante, $s(t)$: in una tabella, in un grafico o con una formula.` },
    { id: 'fc-02', sezione: 'posizione', tipo: 'concetto', fronte: R`Che differenza c'è fra **spostamento** e strada percorsa?`, retro: R`Lo spostamento è $s_2 - s_1$ e può essere negativo; la strada percorsa conta tutti i metri fatti, anche avanti e indietro.` },
    { id: 'fc-03', sezione: 'velocita', tipo: 'formula', fronte: R`Formula della **velocità media**`, retro: R`$v_m = \dfrac{\Delta s}{\Delta t}$, in $\text{m/s}$.` },
    { id: 'fc-04', sezione: 'velocita', tipo: 'procedura', fronte: R`Come si passa da km/h a m/s?`, retro: R`Si divide per $3{,}6$: $72\,\text{km/h} = 20\,\text{m/s}$. Da m/s a km/h si moltiplica per $3{,}6$.` },
    { id: 'fc-05', sezione: 'velocita', tipo: 'concetto', fronte: R`Che cosa rappresenta la **pendenza** del grafico posizione–tempo?`, retro: R`La velocità. Tratto piatto: fermo. Tratto ripido: veloce. Tratto che scende: velocità negativa.` },
    { id: 'fc-06', sezione: 'velocita', tipo: 'definizione', fronte: R`Che cos'è la **velocità istantanea**?`, retro: R`La velocità in un istante preciso, quella del tachimetro: la pendenza della retta tangente al grafico posizione–tempo in quel punto.` },
    { id: 'fc-07', sezione: 'moto-uniforme', tipo: 'definizione', fronte: R`Quando un moto si dice **rettilineo uniforme**?`, retro: R`Quando avviene su una retta con velocità costante: in tempi uguali percorre spazi uguali.` },
    { id: 'fc-08', sezione: 'moto-uniforme', tipo: 'formula', fronte: R`Legge oraria del **moto uniforme**`, retro: R`$s = s_0 + v \cdot t$, con $s_0$ posizione all'istante zero.` },
    { id: 'fc-09', sezione: 'moto-uniforme', tipo: 'procedura', fronte: R`Come si trova dove e quando si **incontrano** due corpi?`, retro: R`Si scrive la legge oraria di ciascuno nello stesso riferimento, si pone $s_1 = s_2$ e si ricava $t$; poi si calcola la posizione.` },
    { id: 'fc-10', sezione: 'accelerazione', tipo: 'formula', fronte: R`Formula dell'**accelerazione media**`, retro: R`$a = \dfrac{\Delta v}{\Delta t}$, in $\text{m/s}^2$.` },
    { id: 'fc-11', sezione: 'accelerazione', tipo: 'concetto', fronte: R`Che cosa vuol dire $a = 3\,\text{m/s}^2$?`, retro: R`Che ogni secondo la velocità aumenta di $3\,\text{m/s}$.` },
    { id: 'fc-12', sezione: 'accelerazione', tipo: 'concetto', fronte: R`Nel grafico velocità–tempo, che cosa sono la **pendenza** e l'**area**?`, retro: R`La pendenza è l'accelerazione; l'area sotto la linea è lo spazio percorso.` },
    { id: 'fc-13', sezione: 'moto-accelerato', tipo: 'formula', fronte: R`Legge oraria del moto **uniformemente accelerato**`, retro: R`$s = s_0 + v_0 \cdot t + \frac{1}{2} \cdot a \cdot t^2$, e la velocità è $v = v_0 + a \cdot t$.` },
    { id: 'fc-14', sezione: 'moto-accelerato', tipo: 'concetto', fronte: R`Partendo da fermi con accelerazione costante, che cosa succede allo spazio se il tempo raddoppia?`, retro: R`Diventa quattro volte tanto, perché $s = \frac{1}{2} \cdot a \cdot t^2$ cresce con il quadrato del tempo.` },
    { id: 'fc-15', sezione: 'moto-accelerato', tipo: 'formula', fronte: R`La formula **senza il tempo**`, retro: R`$v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$. Per frenare fino a fermarsi: $\Delta s = \dfrac{v_0^2}{2 \cdot a}$.` },
    { id: 'fc-16', sezione: 'moto-accelerato', tipo: 'concetto', fronte: R`A velocità doppia, quanto diventa lo spazio di frenata?`, retro: R`Quattro volte tanto, perché dipende dal quadrato della velocità.` },
    { id: 'fc-17', sezione: 'caduta-libera', tipo: 'definizione', fronte: R`Che cos'è la **caduta libera**?`, retro: R`Il moto di un corpo che cade soltanto per il suo peso, senza attrito dell'aria: accelerazione costante, che vicino alla Terra vale $g = 9{,}8\,\text{m/s}^2$.` },
    { id: 'fc-18', sezione: 'caduta-libera', tipo: 'concetto', fronte: R`Nel vuoto, un corpo pesante cade prima di uno leggero?`, retro: R`No: hanno la stessa accelerazione $g$ e arrivano insieme. Nell'aria il corpo leggero e largo è frenato di più.` },
    { id: 'fc-19', sezione: 'caduta-libera', tipo: 'concetto', fronte: R`La regola dei **numeri dispari** di Galileo`, retro: R`Partendo da fermi, in intervalli di tempo uguali e consecutivi gli spazi crescono come 1, 3, 5, 7…` },
    { id: 'fc-20', sezione: 'problemi', tipo: 'procedura', fronte: R`I passi per impostare un problema di moto`, retro: R`Disegno con riferimento, dati con i simboli, tutto nel SI, tipo di moto, formula giusta, controllo del risultato.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un ciclista percorre 600 m in 120 s. Qual è la sua velocità media?`, suggerimenti: [R`Velocità media: spazio diviso tempo.`], risposta: { tipo: 'numero', valore: 5, unita: 'm/s' }, soluzione: [R`$v_m = \dfrac{\Delta s}{\Delta t} = \dfrac{600\,\text{m}}{120\,\text{s}} = 5\,\text{m/s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Esprimi 54 km/h in m/s.`, suggerimenti: [R`Da km/h a m/s si divide per $3{,}6$.`], risposta: { tipo: 'numero', valore: 15, unita: 'm/s', soloUnita: true }, soluzione: [R`$v = \dfrac{54}{3{,}6}\,\text{m/s} = 15\,\text{m/s}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Esprimi 25 m/s in km/h.`, suggerimenti: [R`Da m/s a km/h si moltiplica per $3{,}6$.`], risposta: { tipo: 'numero', valore: 90, unita: 'km/h', soloUnita: true }, soluzione: [R`$v = 25 \cdot 3{,}6\,\text{km/h} = 90\,\text{km/h}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un treno viaggia a 30 m/s costanti. Quanti metri percorre in 20 s?`, suggerimenti: [R`Nel moto uniforme lo spazio è velocità per tempo.`], risposta: { tipo: 'numero', valore: 600, unita: 'm' }, soluzione: [R`$\Delta s = v \cdot \Delta t = 30\,\text{m/s} \cdot 20\,\text{s} = 600\,\text{m}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un'auto viaggia a 25 m/s costanti. Quanto tempo impiega a percorrere 1000 m?`, suggerimenti: [R`Dalla formula $v = \dfrac{\Delta s}{\Delta t}$ ricava $\Delta t$.`], risposta: { tipo: 'numero', valore: 40, unita: 's' }, soluzione: [R`$\Delta t = \dfrac{\Delta s}{v} = \dfrac{1000\,\text{m}}{25\,\text{m/s}} = 40\,\text{s}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un corpo parte dalla posizione $s_0 = 8\,\text{m}$ e si muove a $3\,\text{m/s}$ costanti nel verso positivo. Dove si trova all'istante $t = 5\,\text{s}$?`, suggerimenti: [R`Usa la legge oraria $s = s_0 + v \cdot t$.`], risposta: { tipo: 'numero', valore: 23, unita: 'm' }, soluzione: [R`$s = 8\,\text{m} + 3\,\text{m/s} \cdot 5\,\text{s} = 8\,\text{m} + 15\,\text{m} = 23\,\text{m}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Un'auto è nella posizione 30 m all'istante 2 s e nella posizione 110 m all'istante 7 s. Qual è la sua velocità media?`, suggerimenti: [R`Calcola prima $\Delta s$ e $\Delta t$, sempre finale meno iniziale.`], risposta: { tipo: 'numero', valore: 16, unita: 'm/s' }, soluzione: [R`$\Delta s = 110 - 30 = 80\,\text{m}$, $\Delta t = 7 - 2 = 5\,\text{s}$.`, R`$v_m = \dfrac{80\,\text{m}}{5\,\text{s}} = 16\,\text{m/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un carrello passa dalla posizione 30 m alla posizione 10 m. Quanto vale il suo spostamento?`, suggerimenti: [R`Finale meno iniziale, con il segno.`], risposta: { tipo: 'numero', valore: -20, unita: 'm' }, soluzione: [R`$\Delta s = s_2 - s_1 = 10\,\text{m} - 30\,\text{m} = -20\,\text{m}$: si è mosso verso l'origine.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un'auto passa da ferma a 20 m/s in 5 s. Qual è la sua accelerazione media?`, suggerimenti: [R`Accelerazione: variazione di velocità diviso tempo.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s²' }, soluzione: [R`$a = \dfrac{\Delta v}{\Delta t} = \dfrac{20\,\text{m/s} - 0}{5\,\text{s}} = 4\,\text{m/s}^2$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un motorino frena da 20 m/s a 8 m/s in 4 s. Qual è la sua accelerazione media?`, suggerimenti: [R`La velocità diminuisce: aspettati un segno meno.`, R`$\Delta v = v_2 - v_1$, finale meno iniziale.`], risposta: { tipo: 'numero', valore: -3, unita: 'm/s²' }, soluzione: [R`$a = \dfrac{8\,\text{m/s} - 20\,\text{m/s}}{4\,\text{s}} = \dfrac{-12\,\text{m/s}}{4\,\text{s}} = -3\,\text{m/s}^2$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un'auto parte da ferma con accelerazione costante $a = 2\,\text{m/s}^2$. Che velocità ha dopo 6 s?`, suggerimenti: [R`Usa $v = v_0 + a \cdot t$ con $v_0 = 0$.`], risposta: { tipo: 'numero', valore: 12, unita: 'm/s' }, soluzione: [R`$v = 0 + 2\,\text{m/s}^2 \cdot 6\,\text{s} = 12\,\text{m/s}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un'auto parte da ferma con accelerazione costante $a = 2\,\text{m/s}^2$. Quanti metri percorre nei primi 5 s?`, suggerimenti: [R`Partendo da fermi: $s = \frac{1}{2} \cdot a \cdot t^2$.`], risposta: { tipo: 'numero', valore: 25, unita: 'm' }, soluzione: [R`$s = \frac{1}{2} \cdot 2\,\text{m/s}^2 \cdot (5\,\text{s})^2 = 1 \cdot 25\,\text{m} = 25\,\text{m}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un corpo ha velocità iniziale $10\,\text{m/s}$ e accelera con $a = 3\,\text{m/s}^2$. Che velocità ha dopo 4 s?`, suggerimenti: [R`$v = v_0 + a \cdot t$.`], risposta: { tipo: 'numero', valore: 22, unita: 'm/s' }, soluzione: [R`$v = 10\,\text{m/s} + 3\,\text{m/s}^2 \cdot 4\,\text{s} = 10 + 12 = 22\,\text{m/s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Un corpo ha velocità iniziale $4\,\text{m/s}$ e accelera con $a = 2\,\text{m/s}^2$. Quanti metri percorre in 3 s?`, suggerimenti: [R`Usa $s = v_0 \cdot t + \frac{1}{2} \cdot a \cdot t^2$, partendo dall'origine.`, R`Calcola i due pezzi separatamente e poi sommali.`], risposta: { tipo: 'numero', valore: 21, unita: 'm' }, soluzione: [R`$v_0 \cdot t = 4 \cdot 3 = 12\,\text{m}$.`, R`$\frac{1}{2} \cdot a \cdot t^2 = \frac{1}{2} \cdot 2 \cdot 9 = 9\,\text{m}$.`, R`In tutto $12 + 9 = 21\,\text{m}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Nel grafico velocità–tempo di un'auto la velocità resta $8\,\text{m/s}$ per 5 s. Quanti metri percorre? Calcola l'area sotto il grafico.`, suggerimenti: [R`L'area sotto una retta orizzontale è un rettangolo: base per altezza.`], risposta: { tipo: 'numero', valore: 40, unita: 'm' }, soluzione: [R`Rettangolo di base $5\,\text{s}$ e altezza $8\,\text{m/s}$: area $= 5 \cdot 8 = 40\,\text{m}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Nel grafico velocità–tempo un'auto passa in linea retta da 0 a $10\,\text{m/s}$ in 4 s. Quanti metri percorre in quei 4 s?`, suggerimenti: [R`Lo spazio è l'area sotto il grafico.`, R`È un triangolo: base per altezza diviso due.`], risposta: { tipo: 'numero', valore: 20, unita: 'm' }, soluzione: [R`Triangolo di base $4\,\text{s}$ e altezza $10\,\text{m/s}$: area $= \dfrac{4 \cdot 10}{2} = 20\,\text{m}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un sasso cade da fermo per 2,5 s. Trascurando l'aria, che velocità raggiunge? (Usa $g = 9{,}8\,\text{m/s}^2$.)`, suggerimenti: [R`In caduta libera da fermo $v = g \cdot t$.`], risposta: { tipo: 'numero', valore: 24.5, unita: 'm/s' }, soluzione: [R`$v = 9{,}8\,\text{m/s}^2 \cdot 2{,}5\,\text{s} = 24{,}5\,\text{m/s}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un sasso cade da fermo per 4 s. Trascurando l'aria, di quanti metri è sceso?`, suggerimenti: [R`In caduta libera da fermo $h = \frac{1}{2} \cdot g \cdot t^2$.`], risposta: { tipo: 'numero', valore: 78.4, unita: 'm' }, soluzione: [R`$h = \frac{1}{2} \cdot 9{,}8 \cdot 4^2\,\text{m} = 4{,}9 \cdot 16\,\text{m} = 78{,}4\,\text{m}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un'auto a 30 m/s frena con un'accelerazione di modulo $6\,\text{m/s}^2$. Quanti secondi impiega a fermarsi?`, suggerimenti: [R`Ogni secondo perde $6\,\text{m/s}$: quanti secondi per perderne 30?`], risposta: { tipo: 'numero', valore: 5, unita: 's' }, soluzione: [R`$t = \dfrac{v_0}{a} = \dfrac{30\,\text{m/s}}{6\,\text{m/s}^2} = 5\,\text{s}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un'auto a 30 m/s frena con un'accelerazione di modulo $6\,\text{m/s}^2$. Quanti metri percorre prima di fermarsi?`, suggerimenti: [R`Il tempo non serve: usa la formula senza tempo.`, R`$\Delta s = \dfrac{v_0^2}{2 \cdot a}$.`], risposta: { tipo: 'numero', valore: 75, unita: 'm' }, soluzione: [R`$\Delta s = \dfrac{(30\,\text{m/s})^2}{2 \cdot 6\,\text{m/s}^2} = \dfrac{900}{12}\,\text{m} = 75\,\text{m}$.`, R`Controllo: in 5 s la velocità media è 15 m/s, e $15 \cdot 5 = 75\,\text{m}$. Torna.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Due ciclisti partono nello stesso istante da due paesi distanti 12 km e si vengono incontro: il primo a 15 km/h, il secondo a 9 km/h. Dopo quanti minuti si incontrano?`, suggerimenti: [R`Scrivi le due leggi orarie con l'origine nel primo paese: la velocità del secondo è negativa.`, R`$15 \cdot t = 12 - 9 \cdot t$, con $t$ in ore.`], risposta: { tipo: 'numero', valore: 30, unita: 'min' }, soluzione: [R`$s_1 = 15 \cdot t$, $s_2 = 12 - 9 \cdot t$ (km e ore).`, R`$15 \cdot t = 12 - 9 \cdot t \Rightarrow 24 \cdot t = 12 \Rightarrow t = 0{,}5\,\text{h} = 30\,\text{min}$.`, R`Si incontrano a $s_1 = 15 \cdot 0{,}5 = 7{,}5\,\text{km}$ dal primo paese.`] },
    { id: 'es-02', difficolta: 3, testo: R`Al semaforo verde un'auto parte da ferma con $a = 2\,\text{m/s}^2$. Proprio in quell'istante la supera un motorino che va a $10\,\text{m/s}$ costanti. Dopo quanti secondi l'auto raggiunge il motorino?`, suggerimenti: [R`Stessa origine (il semaforo) e stesso istante zero per tutti e due.`, R`Auto: $s = \frac{1}{2} \cdot 2 \cdot t^2 = t^2$. Motorino: $s = 10 \cdot t$.`, R`Da $t^2 = 10 \cdot t$, scarta la soluzione $t = 0$: è la partenza.`], risposta: { tipo: 'numero', valore: 10, unita: 's' }, soluzione: [R`Auto: $s_A = \frac{1}{2} \cdot 2 \cdot t^2 = t^2$. Motorino: $s_M = 10 \cdot t$.`, R`$t^2 = 10 \cdot t \Rightarrow t \cdot (t - 10) = 0$: $t = 0$ (la partenza) oppure $t = 10\,\text{s}$.`, R`Dopo 10 s, a $100\,\text{m}$ dal semaforo. In quell'istante l'auto va a $20\,\text{m/s}$, il doppio del motorino.`] },
    { id: 'es-03', difficolta: 2, testo: R`Guarda il grafico posizione–tempo del viaggio. Qual è la velocità media dell'auto nei primi 10 secondi?

[[grafico:viaggio]]`, suggerimenti: [R`Ti servono solo la posizione all'inizio e quella a $t = 10\,\text{s}$, non quello che succede in mezzo.`, R`A $t = 10\,\text{s}$ l'auto è a $30\,\text{m}$.`], risposta: { tipo: 'numero', valore: 3, unita: 'm/s' }, soluzione: [R`All'inizio $s = 0$; a $t = 10\,\text{s}$ l'auto è a $30\,\text{m}$.`, R`$v_m = \dfrac{30\,\text{m}}{10\,\text{s}} = 3\,\text{m/s}$: meno dei 5 m/s del primo tratto, perché per 4 s è stata ferma.`] },
    { id: 'es-04', difficolta: 3, testo: R`In autostrada un'auto viaggia a 90 km/h. Il guidatore ha un tempo di reazione di 1 s, poi frena con un'accelerazione di modulo $6\,\text{m/s}^2$. Qual è la distanza minima per fermarsi?`, suggerimenti: [R`Prima porta la velocità in m/s.`, R`Somma due pezzi: lo spazio di reazione (moto uniforme) e lo spazio di frenata, $\dfrac{v_0^2}{2 \cdot a}$.`], risposta: { tipo: 'numero', valore: 77.1, unita: 'm', tolleranza: 1 }, soluzione: [R`Dati: $v_0 = 90\,\text{km/h}$, reazione $1\,\text{s}$, $a = 6\,\text{m/s}^2$ in modulo. $v_0 = \dfrac{90}{3{,}6}\,\text{m/s} = 25\,\text{m/s}$.`, R`Reazione: $25\,\text{m/s} \cdot 1\,\text{s} = 25\,\text{m}$.`, R`Frenata: $\dfrac{25^2}{2 \cdot 6}\,\text{m} = \dfrac{625}{12}\,\text{m} \approx 52{,}1\,\text{m}$.`, R`In tutto circa $77\,\text{m}$.`] },
    { id: 'es-05', difficolta: 2, testo: R`Lasci cadere un sasso in un pozzo e lo senti toccare l'acqua dopo 1,5 s. Trascurando l'aria e il tempo che il suono impiega a risalire, quanto è profondo il pozzo?`, suggerimenti: [R`Caduta libera da fermo: $h = \frac{1}{2} \cdot g \cdot t^2$.`], risposta: { tipo: 'numero', valore: 11, unita: 'm', tolleranza: 0.2 }, soluzione: [R`$h = \frac{1}{2} \cdot 9{,}8 \cdot 1{,}5^2\,\text{m} = 4{,}9 \cdot 2{,}25\,\text{m} \approx 11\,\text{m}$.`, R`In realtà il suono impiega circa tre centesimi di secondo a risalire: la correzione è piccola.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una palla viene lanciata verso l'alto a $14{,}7\,\text{m/s}$. Trascurando l'aria, a che altezza arriva?`, suggerimenti: [R`Salendo, la palla rallenta di $9{,}8\,\text{m/s}$ ogni secondo, fino a fermarsi nel punto più alto.`, R`Usa $v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$ con $v = 0$ e $a = -9{,}8\,\text{m/s}^2$ (verso positivo in alto).`], risposta: { tipo: 'numero', valore: 11, unita: 'm', tolleranza: 0.2 }, soluzione: [R`Verso positivo in alto: $a = -g = -9{,}8\,\text{m/s}^2$. Nel punto più alto $v = 0$.`, R`$0 = 14{,}7^2 - 2 \cdot 9{,}8 \cdot h \Rightarrow h = \dfrac{14{,}7^2}{19{,}6} = \dfrac{216{,}09}{19{,}6} \approx 11\,\text{m}$.`, R`Ci arriva in $t = 14{,}7 : 9{,}8 = 1{,}5\,\text{s}$: è il pozzo dell'esercizio prima, percorso al contrario.`] },
    { id: 'es-07', difficolta: 2, testo: R`Da che altezza deve cadere un corpo, partendo da fermo e senza aria, per arrivare a terra a 90 km/h?`, suggerimenti: [R`90 km/h in m/s fa 25 m/s.`, R`Dalla formula senza tempo: $v^2 = 2 \cdot g \cdot h$.`], risposta: { tipo: 'numero', valore: 31.9, unita: 'm', tolleranza: 0.3 }, soluzione: [R`$v = \dfrac{90}{3{,}6}\,\text{m/s} = 25\,\text{m/s}$.`, R`$h = \dfrac{v^2}{2 \cdot g} = \dfrac{625}{19{,}6}\,\text{m} \approx 31{,}9\,\text{m}$: più o meno un palazzo di dieci piani.`] },
    { id: 'es-08', difficolta: 2, testo: R`Con certi freni, a 40 km/h un'auto si ferma in 8 m. Con gli stessi freni, quanti metri le servono a 120 km/h?`, suggerimenti: [R`Lo spazio di frenata dipende dal quadrato della velocità.`, R`Velocità tripla: spazio moltiplicato per $3^2$.`], risposta: { tipo: 'numero', valore: 72, unita: 'm' }, soluzione: [R`Da $\Delta s = \dfrac{v_0^2}{2 \cdot a}$, con la stessa $a$ lo spazio è proporzionale a $v_0^2$.`, R`$120\,\text{km/h}$ è il triplo di $40\,\text{km/h}$: spazio $3^2 = 9$ volte tanto, $9 \cdot 8 = 72\,\text{m}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa rappresenta la pendenza del grafico posizione–tempo?`, opzioni: [R`L'accelerazione`, R`La velocità`, R`Lo spazio percorso`, R`La forma della strada`], corretta: 1, spiegazione: R`La pendenza è $\Delta s / \Delta t$, cioè la velocità. L'accelerazione è la pendenza del grafico velocità–tempo, e il grafico non disegna la strada.` },
    { id: 'q-02', domanda: R`Nel grafico posizione–tempo un tratto è orizzontale. Che cosa fa il corpo in quel tratto?`, opzioni: [R`Va a velocità costante`, R`Accelera`, R`È fermo`, R`Torna indietro`], corretta: 2, spiegazione: R`Se la posizione non cambia mentre il tempo passa, il corpo è fermo. A velocità costante il grafico è una retta inclinata, non orizzontale.` },
    { id: 'q-03', domanda: R`Un'auto ha accelerazione zero. Che cosa si può dire con certezza?`, opzioni: [R`Che è ferma`, R`Che la sua velocità non cambia`, R`Che va piano`, R`Che sta frenando`], corretta: 1, spiegazione: R`Accelerazione zero vuol dire $\Delta v = 0$: la velocità resta la stessa. Può essere zero, ma anche 130 km/h.` },
    { id: 'q-04', domanda: R`Nel grafico velocità–tempo, che cosa dà lo spazio percorso?`, opzioni: [R`La pendenza della linea`, R`Il valore più alto della velocità`, R`Il punto in cui la linea taglia l'asse dei tempi`, R`L'area sotto la linea`], corretta: 3, spiegazione: R`Lo spazio è l'area sotto il grafico velocità–tempo: per una velocità costante è base per altezza, cioè $v \cdot \Delta t$. La pendenza è l'accelerazione.` },
    { id: 'q-05', domanda: R`Nel vuoto si lasciano cadere insieme una piuma e un martello. Che cosa succede?`, opzioni: [R`Arriva prima il martello, perché pesa di più`, R`Arriva prima la piuma, perché è più leggera`, R`Arrivano insieme`, R`La piuma resta sospesa`], corretta: 2, spiegazione: R`Senza aria tutti i corpi cadono con la stessa accelerazione $g$: lo ha mostrato David Scott sulla Luna nel 1971. È l'aria a frenare la piuma sulla Terra.` },
    { id: 'q-06', domanda: R`Un'auto che parte da ferma con accelerazione costante percorre 5 m nel primo secondo. Quanti metri ha percorso in tutto dopo 2 secondi?`, opzioni: [R`10 m`, R`15 m`, R`20 m`, R`25 m`], corretta: 2, spiegazione: R`Partendo da fermi lo spazio cresce con il quadrato del tempo: tempo doppio, spazio quattro volte. $4 \cdot 5 = 20\,\text{m}$. Nel secondo secondo ne fa 15: la regola dei dispari, 1 e 3.` },
    { id: 'q-07', domanda: R`Quale di queste velocità è la più grande?`, opzioni: [R`$20\,\text{m/s}$`, R`$60\,\text{km/h}$`, R`$1000\,\text{m}$ al minuto`, R`$1\,\text{km}$ in 2 minuti`], corretta: 0, spiegazione: R`In m/s: $\dfrac{60}{3{,}6} \approx 16{,}7$; $1000\,\text{m}$ al minuto $\approx 16{,}7$; $1\,\text{km}$ in $120\,\text{s} \approx 8{,}3$. Vince $20\,\text{m/s}$, cioè $72\,\text{km/h}$.` },
    { id: 'q-08', domanda: R`Un'auto frena: la sua velocità passa da 20 m/s a 10 m/s. Se va nel verso positivo, la sua accelerazione è…`, opzioni: [R`positiva`, R`negativa`, R`zero`, R`impossibile da dire`], corretta: 1, spiegazione: R`$\Delta v = 10 - 20 = -10\,\text{m/s}$: la velocità diminuisce, quindi l'accelerazione è negativa. Frenare vuol dire accelerare nel verso opposto al moto.` },
    { id: 'q-09', domanda: R`Nel moto rettilineo uniforme, che forma ha il grafico posizione–tempo?`, opzioni: [R`Una retta orizzontale`, R`Una retta inclinata`, R`Una parabola`, R`Un'iperbole`], corretta: 1, spiegazione: R`Da $s = s_0 + v \cdot t$: una retta di pendenza $v$. È orizzontale solo se il corpo è fermo. La parabola è del moto uniformemente accelerato.` },
    { id: 'q-10', domanda: R`Raddoppiando la velocità con cui si inizia a frenare, con gli stessi freni lo spazio di frenata…`, opzioni: [R`resta uguale`, R`raddoppia`, R`si dimezza`, R`diventa quattro volte tanto`], corretta: 3, spiegazione: R`$\Delta s = \dfrac{v_0^2}{2 \cdot a}$: lo spazio va con il quadrato della velocità. Per questo i limiti di velocità contano più di quanto sembri.` },
    { id: 'q-11', domanda: R`Che cosa vuol dire che un'accelerazione vale $9{,}8\,\text{m/s}^2$?`, opzioni: [R`Che il corpo percorre 9,8 m ogni secondo`, R`Che il corpo va a 9,8 m/s`, R`Che ogni secondo la velocità aumenta di 9,8 m/s`, R`Che il corpo cade da 9,8 m`], corretta: 2, spiegazione: R`L'accelerazione dice come cambia la velocità: $9{,}8\,\text{m/s}$ in più per ogni secondo. Lo spazio percorso ogni secondo non è costante: cresce.` },
    { id: 'q-12', domanda: R`Un ciclista va da casa a scuola (3 km) e torna a casa. Qual è il suo spostamento totale?`, opzioni: [R`6 km`, R`3 km`, R`−3 km`, R`zero`], corretta: 3, spiegazione: R`Lo spostamento è posizione finale meno iniziale: è tornato al punto di partenza, quindi zero. La strada percorsa invece è di 6 km.` },
    { id: 'q-13', domanda: R`In caduta libera da fermo, in intervalli di tempo uguali e consecutivi, gli spazi percorsi…`, opzioni: [R`sono tutti uguali`, R`crescono come 1, 2, 3, 4`, R`crescono come 1, 2, 4, 8`, R`crescono come 1, 3, 5, 7`], corretta: 3, spiegazione: R`È la regola dei numeri dispari di Galileo. Le distanze dal punto di partenza crescono come 1, 4, 9, 16 (i quadrati), e le loro differenze sono 1, 3, 5, 7.` },
    { id: 'q-14', domanda: R`Per calcolare lo spazio di frenata senza conoscere il tempo, quale formula conviene?`, opzioni: [R`$s = v \cdot t$`, R`$v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$`, R`$a = \dfrac{\Delta v}{\Delta t}$`, R`$s = \tfrac{1}{2} \cdot a \cdot t^2$`], corretta: 1, spiegazione: R`È l'unica che lega velocità, accelerazione e spazio senza il tempo. Le altre contengono $t$; $s = v \cdot t$ vale per di più solo con la velocità costante.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Le unità devono essere coerenti: se l'accelerazione è in $\text{m/s}^2$, una velocità in km/h va prima divisa per $3{,}6$.` },
    { tipo: 'errore', testo: R`Il grafico posizione–tempo **non** è il disegno della strada: una piega è un cambio di velocità, non una curva.` },
    { tipo: 'errore', testo: R`Spostamento non vuol dire strada percorsa: chi va e torna ha percorso dei metri ma ha spostamento zero.` },
    { tipo: 'trucco', testo: R`Per passare da km/h a m/s dividi per $3{,}6$. Due numeri da ricordare: $36\,\text{km/h} = 10\,\text{m/s}$ e $72\,\text{km/h} = 20\,\text{m/s}$.` },
    { tipo: 'trucco', testo: R`Lo spazio è sempre l'area sotto il grafico velocità–tempo. Se non ricordi una formula, disegna il grafico e calcola l'area.` },
    { tipo: 'metodo', testo: R`Prima di tutto scegli l'origine e il verso positivo. Poi scrivi i dati con il loro segno: chi va verso l'origine ha velocità negativa.` },
    { tipo: 'metodo', testo: R`Se il problema non dice il tempo e non lo chiede, usa la formula senza tempo: $v^2 = v_0^2 + 2 \cdot a \cdot \Delta s$.` },
    { tipo: 'trucco', testo: R`Controlla sempre le unità del risultato: se cercavi uno spazio e ti vengono i $\text{m/s}$, hai usato la formula sbagliata.` }
  ],
  aneddoti: [
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'La palla che rotola giù per il piano inclinato', testo: R`Una caduta dura troppo poco per misurarla a occhio. Galileo trovò il modo di rallentarla: fece rotolare una palla di bronzo lungo una scanalatura inclinata, lunga circa dodici braccia. Il tempo lo misurava con l'acqua: un secchio forato, e poi pesava l'acqua uscita. Ripeté la prova moltissime volte, cambiando la pendenza. Trovò sempre la stessa regola: gli spazi crescono come i quadrati dei tempi. Lo scrisse nei *Discorsi* del 1638. Si racconta anche che lasciasse cadere sfere dalla torre di Pisa. Lo riferisce il suo allievo Vincenzo Viviani, ma molti storici pensano che sia una leggenda.`, legame: R`È la legge $s = \frac{1}{2} \cdot a \cdot t^2$ del moto uniformemente accelerato, e la regola dei numeri dispari.` },
    { fisico: 'Nicola Oresme', anni: 'circa 1320–1382', titolo: 'Il primo grafico della velocità', testo: R`A metà del Trecento, a Parigi, il filosofo Nicola Oresme, più tardi vescovo, ebbe un'idea semplice e potentissima. Disegnò il tempo su una linea orizzontale e, sopra ogni istante, un segmento lungo quanto la velocità. Per un moto con la velocità che cresce in modo uniforme ottenne un triangolo. Osservò che quel triangolo ha la stessa area di un rettangolo alto quanto la velocità media. Quindi un corpo che accelera in modo uniforme fa lo stesso spazio di uno che va sempre alla velocità che ha a metà del tempo. Era quasi tre secoli prima di Galileo.`, legame: R`È l'idea che lo spazio sia l'area sotto il grafico velocità–tempo.` },
    { fisico: 'Giovanni Battista Riccioli', anni: '1598–1671', titolo: 'Le palle lanciate dalla torre degli Asinelli', testo: R`Negli anni Quaranta del Seicento il gesuita Giovanni Battista Riccioli volle mettere alla prova Galileo. A Bologna, con il confratello Francesco Maria Grimaldi, lasciò cadere palle dalla torre degli Asinelli, alta quasi cento metri. Per misurare i tempi usavano pendoli tarati con pazienza. I risultati confermarono che le distanze crescono come i quadrati dei tempi. Riccioli notò anche che, a parità di grandezza, le palle più pesanti arrivavano un poco prima. Era l'aria, che frena di più le palle leggere. Pubblicò tutto nel 1651, nell'*Almagestum Novum*.`, legame: R`È la verifica sperimentale della caduta libera, e dell'effetto dell'aria sui corpi leggeri.` },
    { fisico: 'David Scott', anni: 'nato nel 1932', titolo: 'Il martello e la piuma sulla Luna', testo: R`Il 2 agosto 1971, alla fine dell'ultima uscita della missione Apollo 15, l'astronauta David Scott fece un esperimento davanti alla telecamera. In una mano teneva un martello da geologo, nell'altra una penna di falco. Li lasciò andare insieme dalla stessa altezza. Sulla Luna non c'è aria che freni la piuma: i due oggetti caddero fianco a fianco e toccarono il suolo nello stesso istante. Scott commentò che Galileo aveva avuto ragione. La scena si può ancora vedere nei filmati della NASA.`, legame: R`Mostra che nel vuoto tutti i corpi cadono con la stessa accelerazione.` }
  ]
});
})();
