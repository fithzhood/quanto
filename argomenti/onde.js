/* Quanto — Le onde (quarto anno): onde meccaniche, lunghezza d'onda e frequenza, velocità nel mezzo, funzione d'onda,
   interferenza, onde stazionarie e armoniche, diffrazione. Contratto in SCHEMA.md, modello cinematica.js.
   Simboli come in moti-piano (moto armonico: A, ω = 2π/T) e dinamica-applicazioni; la tensione della corda è F (T è il periodo).
   Verifica: node strumenti/verifica-argomento.js argomenti/onde.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'onde',
  titolo: 'Le onde',
  introduzione: R`Un sasso cade nello stagno e i cerchi si allargano fino alla riva. Una corda di chitarra vibra, e il suono arriva alle orecchie. La terra trema a cento chilometri dall'epicentro. Sono tutte **onde**: perturbazioni che viaggiano e portano energia da un punto all'altro, senza portare materia.

Le onde sono dappertutto: il suono, la luce, le onde radio del telefono, i terremoti, le ecografie. Qui si studiano le onde **meccaniche**, quelle che viaggiano in un mezzo: l'acqua, una corda, una molla, l'aria. Le idee però valgono per tutte le onde: lunghezza d'onda, frequenza, velocità, interferenza, diffrazione.

Serve conoscere il moto armonico, con ampiezza, periodo e pulsazione $\omega$. È il mattone di ogni onda: quando passa un'onda armonica, ogni punto del mezzo oscilla proprio così.`,
  inBreve: [
    R`Un'onda è una perturbazione che viaggia: porta **energia**, non materia. Ogni punto del mezzo oscilla attorno al suo posto.`,
    R`Nelle onde **trasversali** il mezzo oscilla perpendicolare alla direzione dell'onda, nelle **longitudinali** parallelo.`,
    R`La velocità di un'onda è $v = \lambda \cdot f$. La frequenza la decide la sorgente, la velocità la decide il mezzo: su una corda $v = \sqrt{F / \mu}$.`,
    R`Le onde si sommano dove si incontrano, poi proseguono intatte. Con due sorgenti in fase l'interferenza è costruttiva se $\Delta r = n \cdot \lambda$, distruttiva se $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$.`,
    R`Su una corda fissata ai due capi stanno solo le onde stazionarie con $\lambda_n = \dfrac{2 \cdot \ell}{n}$: le frequenze sono le armoniche $f_n = n \cdot f_1$.`,
    R`Un'onda gira intorno agli ostacoli e si allarga dopo una fessura (**diffrazione**), tanto più quanto la fessura è stretta rispetto a $\lambda$.`
  ],
  sezioni: [
    {
      id: 'cosa-e-onda',
      titolo: 'Che cos\'è un\'onda',
      testo: R`Un tappo galleggia sullo stagno. Arriva un'onda, e il tappo si mette a ballare. Ma quando l'onda è passata, il tappo è ancora lì.

[[video:onde/cosa-viaggia]]

Il tappo gira in un piccolo cerchio e torna al suo posto. La cresta invece corre lontano. Se l'acqua viaggiasse con l'onda, il tappo partirebbe con lei.

>* Un'**onda** è una perturbazione che si propaga. Trasporta energia, ma non trasporta materia: ogni punto del mezzo oscilla attorno alla sua posizione.

Il **mezzo** è la sostanza in cui l'onda viaggia: l'acqua, una corda, l'aria. Le onde che hanno bisogno di un mezzo si chiamano **onde meccaniche**. La luce e le onde radio invece viaggiano anche nel vuoto: sono onde elettromagnetiche (le vedrai in «La luce come onda»).

### Trasversali e longitudinali

Le onde sono di due famiglie. Conta come oscilla il mezzo rispetto alla direzione in cui va l'onda.

- **Trasversali**: il mezzo oscilla perpendicolare alla direzione di propagazione. È la corda scossa su e giù.
- **Longitudinali**: il mezzo oscilla parallelo alla direzione di propagazione. È la molla spinta e tirata: corrono avanti compressioni e rarefazioni.

Il suono nell'aria è un'onda longitudinale. Le onde del mare sono un caso misto: per questo il tappo gira in cerchio.

Nel grafico un impulso corre lungo una corda. Il punto P sale e scende, ma resta sempre allo stesso posto.

[[grafico:impulso]]

> Un'onda porta energia: un'onda del mare solleva una barca, il suono fa vibrare il timpano. In un'onda armonica, a parità di frequenza, l'energia cresce con il quadrato dell'ampiezza. Ampiezza doppia, energia quattro volte.

>! L'onda non è l'acqua che corre. Quello che avanza è la forma, cioè la perturbazione. Ogni pezzetto di mezzo resta vicino a casa.

?? Allo stadio il pubblico fa la «ola»: ognuno si alza e si siede, e l'onda fa il giro degli spalti. Che onda è?
[x] trasversale
[ ] longitudinale
[ ] nessuna delle due, perché le persone non si spostano
=> Ognuno si muove in verticale, perpendicolare alla direzione in cui corre la ola. Nessuno cambia posto: viaggia la perturbazione, come in ogni onda.`
    },
    {
      id: 'grandezze',
      titolo: 'Lunghezza d\'onda, periodo, frequenza',
      testo: R`Una mano scuote una corda su e giù, sempre con lo stesso ritmo. Lungo la corda corre un'onda **periodica**: la stessa forma si ripete uguale.

[[video:onde/v-lambda-f]]

Il punto più alto dell'onda è la **cresta**, il più basso la **gola**.

> Qualche libro chiama *ventre* il punto più basso di un'onda che corre. Qui si dice **gola**: il ventre è un'altra cosa, e si incontra nelle onde stazionarie.

Per descrivere l'onda servono quattro grandezze.

- L'**ampiezza** $A$: lo spostamento massimo di un punto dalla posizione di riposo.
- La **lunghezza d'onda** $\lambda$ (lambda): la distanza fra due creste vicine, in metri.
- Il **periodo** $T$: il tempo di un'oscillazione completa di un punto, su e giù.
- La **frequenza** $f = 1/T$: le oscillazioni al secondo, in hertz. $1\,\text{Hz} = 1\,\text{s}^{-1}$.

[[grafico:fotografia]]

In un periodo ogni punto fa un'oscillazione completa. Nello stesso tempo la cresta avanza esattamente di una lunghezza d'onda.

~ v = \dfrac{\Delta s}{\Delta t} = \dfrac{\lambda}{T} :: in un periodo la cresta percorre una lunghezza d'onda
~ v = \evidb{\lambda \cdot f} :: perché $1/T$ è la frequenza

>* La velocità di un'onda periodica è $v = \lambda \cdot f$: lunghezza d'onda per frequenza.

Esempio. Su una corda le creste distano 1,5 m. Un punto della corda sale e scende 4 volte al secondo.

~ T = \dfrac{1}{f} = \dfrac{1}{4\,\text{Hz}} = 0{,}25\,\text{s} :: quattro oscillazioni al secondo
~ v = \lambda \cdot f = 1{,}5\,\text{m} \cdot 4\,\text{Hz} :: l'hertz è $1/\text{s}$: restano i m/s
~ v = \evidb{6\,\text{m/s}} :: la cresta fa 1,5 m ogni quarto di secondo

>! Più frequenza **non** vuol dire onda più veloce. Sulla stessa corda la velocità resta quella. Se la mano va più in fretta, le onde diventano più corte.

?? Sulla stessa corda la mano triplica la frequenza. Che cosa succede alla lunghezza d'onda?
[ ] triplica
[x] diventa un terzo
[ ] resta uguale
=> La velocità la decide la corda e non cambia. Da $\lambda = v / f$: frequenza tripla, lunghezza d'onda un terzo.`
    },
    {
      id: 'mezzo',
      titolo: 'La velocità la decide il mezzo',
      testo: R`Una mano scuote la corda più in fretta. Le onde nuove corrono insieme alle vecchie, alla stessa velocità. La velocità di un'onda non dipende da come la si produce.

>* La **velocità di propagazione** di un'onda dipende dal mezzo, non dalla sorgente. La sorgente decide la frequenza; il mezzo decide la velocità.

Per una corda tesa contano due cose. La **tensione** $F$, la forza con cui la corda è tirata, in newton. E la **densità lineare** $\mu$, cioè la massa di un metro di corda, in kg/m.

$$v = \sqrt{\dfrac{F}{\mu}}$$

Più la corda è tesa, più l'onda corre. Più la corda è pesante, più l'onda è lenta. È la solita gara fra la forza di richiamo e l'inerzia.

~ v = \sqrt{\dfrac{F}{\mu}} = \sqrt{\dfrac{81\,\text{N}}{0{,}010\,\text{kg/m}}} :: una corda da 10 g al metro, tirata con 81 N
~ v = \sqrt{8100\,\text{m}^2/\text{s}^2} :: il newton è kg·m/s²: diviso kg/m dà m²/s²
~ v = \evidb{90\,\text{m/s}} :: la radice di 8100

Con una tensione quattro volte più grande, 324 N, la velocità raddoppia: 180 m/s.

La tabella dà alcune velocità tipiche.

| mezzo | onda | velocità |
|---|---|---|
| aria a 20 °C | suono | 343 m/s |
| acqua | suono | circa 1480 m/s |
| acciaio | suono | circa 5900 m/s |
| roccia della crosta | sismica P | circa 6 km/s |
| roccia della crosta | sismica S | circa 3,5 km/s |

> Le onde sull'acqua sono un caso speciale: la loro velocità dipende anche dalla profondità e dalla lunghezza d'onda.

> In certi mezzi la velocità cambia un poco con la frequenza: è la **dispersione**. Nel vetro la luce violetta è più lenta di quella rossa.

### Quando l'onda cambia mezzo

Un'onda può passare da un mezzo a un altro: il suono dall'aria all'acqua, un'onda da una corda sottile a una grossa. La frequenza resta la stessa. Ogni pezzo di mezzo oscilla al ritmo di quello che lo spinge. Cambia la velocità, e quindi cambia la lunghezza d'onda.

~ \lambda_\text{aria} = \dfrac{343\,\text{m/s}}{500\,\text{Hz}} \approx 0{,}69\,\text{m} :: un suono di 500 Hz nell'aria, $\lambda = v / f$
~ \lambda_\text{acqua} = \dfrac{1480\,\text{m/s}}{500\,\text{Hz}} :: stessa frequenza, ma velocità più grande
~ \lambda_\text{acqua} \approx \evidb{2{,}96\,\text{m}} :: un'onda più di quattro volte più lunga

>! In dinamica la tensione di una fune si chiamava $T$. Qui la $T$ è già il periodo: la tensione della corda si chiama $F$.

?? Un'onda passa da una corda sottile a una corda più grossa, dove va più piano. Che cosa resta uguale?
[x] la frequenza
[ ] la lunghezza d'onda
[ ] la velocità
=> Il punto di giunzione appartiene a tutte e due le corde e impone lo stesso ritmo: la frequenza non cambia. La velocità cala, e con lei la lunghezza d'onda.`
    },
    {
      id: 'funzione-onda',
      titolo: 'L\'onda armonica e la sua formula',
      testo: R`Se la mano si muove di moto armonico, ogni punto della corda oscilla di moto armonico. L'onda si chiama **armonica**, e la sua forma è una sinusoide.

Per descriverla serve una formula con due variabili: la posizione $x$ lungo la corda e il tempo $t$. Lo spostamento $y$ di un punto dipende da tutte e due.

>* La **funzione d'onda** di un'onda armonica che va nel verso positivo di $x$ è $y = A \cdot \cos(k \cdot x - \omega \cdot t)$. Qui $k = \dfrac{2\pi}{\lambda}$ e $\omega = \dfrac{2\pi}{T}$.

$\omega$ è la **pulsazione**, la stessa del moto armonico, in rad/s. $k$ è il **numero d'onda**, in rad/m. Fa per lo spazio quello che $\omega$ fa per il tempo.

La formula si legge in due modi.

- A $t$ fisso è una **fotografia**: la forma della corda in quell'istante, che si ripete ogni $\lambda$.
- A $x$ fisso è la **storia di un punto**: un moto armonico, che si ripete ogni $T$.

[[grafico:viaggia]]

Perché il segno meno fa andare l'onda verso destra? Seguiamo la cresta che all'istante zero è in $x = 0$. La cresta è dove il coseno vale 1.

~ k \cdot x - \omega \cdot t = 0 :: sulla cresta il coseno vale 1
~ x = \dfrac{\omega}{k} \cdot t :: la cresta si sposta di moto uniforme
~ v = \dfrac{\omega}{k} = \dfrac{2\pi / T}{2\pi / \lambda} = \evidb{\dfrac{\lambda}{T}} :: con la velocità dell'onda

Con il segno più, $k \cdot x + \omega \cdot t$, l'onda andrebbe verso sinistra.

Esempio. Un'onda su una corda ha funzione d'onda $y = 0{,}05 \cdot \cos(2 \cdot x - 10 \cdot t)$, con tutte le grandezze nel SI.

~ A = 0{,}05\,\text{m} = 5\,\text{cm} :: il numero davanti al coseno
~ \lambda = \dfrac{2\pi}{2\,\text{rad/m}} \approx 3{,}14\,\text{m} :: da $\lambda = 2\pi / k$, con $k = 2\,\text{rad/m}$
~ T = \dfrac{2\pi}{10\,\text{rad/s}} \approx 0{,}63\,\text{s} :: da $T = 2\pi / \omega$, con $\omega = 10\,\text{rad/s}$
~ v = \dfrac{\omega}{k} = \dfrac{10\,\text{rad/s}}{2\,\text{rad/m}} = \evidb{5\,\text{m/s}} :: i radianti si semplificano

Un punto più lontano dalla sorgente ripete il moto di uno più vicino, in ritardo. Il ritardo è il tempo che l'onda impiega ad andare dall'uno all'altro.

[[grafico:punto]]

>! Non confondere le due velocità. L'onda corre a $v = \lambda / T$, costante. Ogni punto della corda oscilla con una velocità che cambia: massima al centro, $\omega \cdot A$, nulla agli estremi.

?? Due punti della stessa corda distano esattamente una lunghezza d'onda. Come oscillano?
[x] insieme: sono sempre alla stessa altezza
[ ] in opposizione: quando uno è in cresta, l'altro è in gola
[ ] uno fermo e l'altro in moto
=> L'onda impiega un periodo a percorrere $\lambda$. Il secondo punto ripete il primo con un periodo intero di ritardo, cioè va insieme a lui: sono **in fase**. A mezza $\lambda$ sarebbero in opposizione.`
    },
    {
      id: 'interferenza',
      titolo: 'Sovrapposizione e interferenza',
      testo: R`Due palle che si scontrano rimbalzano. Due onde che si incontrano invece si attraversano. Dopo l'incontro proseguono come se l'altra non ci fosse.

[[video:onde/interferenza]]

Dove si incontrano, lo spostamento del mezzo è la somma dei due spostamenti. Cresta più cresta fa una cresta alta il doppio. Cresta più gola fa zero.

>* **Principio di sovrapposizione**: quando due onde passano nello stesso punto, lo spostamento risultante è la somma degli spostamenti delle singole onde.

Ora due punte $S_1$ e $S_2$ battono l'acqua insieme, con la stessa frequenza. Sono **in fase**: fanno partire le creste nello stesso istante. In ogni punto arrivano due onde. Il risultato dipende dalla **differenza di cammino** $\Delta r = |r_2 - r_1|$. Qui $r_1$ e $r_2$ sono le distanze del punto dalle due sorgenti.

>* Con due sorgenti in fase l'interferenza è **costruttiva** se $\Delta r = n \cdot \lambda$. È **distruttiva** se $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$. In tutte e due $n = 0, 1, 2, \dots$

Se $\Delta r$ è un numero intero di lunghezze d'onda, le onde arrivano cresta con cresta: l'acqua oscilla il doppio. Se avanza mezza lunghezza d'onda, arrivano cresta con gola e si annullano. I punti dove si annullano formano le **linee di quiete**.

[[grafico:somma]]

Esempio. Due sorgenti in fase producono onde con $\lambda = 2\,\text{cm}$. Un punto dista 10 cm dalla prima e 13 cm dalla seconda.

~ \Delta r = 13\,\text{cm} - 10\,\text{cm} = 3\,\text{cm} :: la differenza di cammino
~ \dfrac{\Delta r}{\lambda} = \dfrac{3\,\text{cm}}{2\,\text{cm}} = 1{,}5 :: quante lunghezze d'onda ci stanno
~ \Delta r = \evidb{\left(1 + \tfrac{1}{2}\right) \cdot \lambda} :: un intero e mezzo: interferenza distruttiva, l'acqua resta ferma

>! L'interferenza distruttiva non distrugge l'energia. L'energia che manca sulle linee di quiete si trova in più nelle zone costruttive.

?? Due sorgenti in fase. In un punto la differenza di cammino vale 2,5 lunghezze d'onda. Che cosa succede?
[ ] interferenza costruttiva
[x] interferenza distruttiva
[ ] dipende dall'ampiezza delle onde
=> $2{,}5 \cdot \lambda = \left(2 + \tfrac{1}{2}\right) \cdot \lambda$: avanza mezza lunghezza d'onda, e le onde arrivano cresta con gola. Con ampiezze uguali si annullano del tutto.`
    },
    {
      id: 'stazionarie',
      titolo: 'Le onde stazionarie',
      testo: R`Due onde uguali corrono sulla stessa corda in versi opposti. Per la sovrapposizione la corda fa la somma. Il risultato sorprende: un'onda che non corre più.

[[video:onde/stazionarie]]

Certi punti non si muovono mai: sono i **nodi**. A metà fra due nodi la corda oscilla al massimo: sono i **ventri**. Gli altri punti oscillano con un'ampiezza intermedia. Tutti passano per lo zero nello stesso istante.

>* Un'**onda stazionaria** nasce dalla sovrapposizione di due onde uguali che viaggiano in versi opposti. Ha nodi fermi e ventri. Due nodi vicini distano $\lambda/2$.

Fra un nodo e il ventre vicino c'è $\lambda/4$. La forma non scorre lungo la corda: pulsa sul posto, per questo si chiama stazionaria. I nodi stanno sempre fermi. L'energia non passa attraverso di loro: resta fra un nodo e l'altro.

[[grafico:stazionaria]]

Da dove viene l'onda che torna indietro? Dalla **riflessione**. Un'onda che arriva a un capo fissato rimbalza e torna capovolta: una cresta torna come gola. L'onda riflessa si somma a quella che arriva. Il capo fisso non si muove mai: è un nodo.

Esempio. Su una corda che vibra, i nodi distano 30 cm l'uno dall'altro.

~ \dfrac{\lambda}{2} = 30\,\text{cm} :: la distanza fra due nodi vicini
~ \lambda = \evidb{60\,\text{cm}} :: il doppio
~ \dfrac{\lambda}{4} = \dfrac{60\,\text{cm}}{4} = 15\,\text{cm} :: la distanza nodo–ventre: il ventre sta a metà fra due nodi

>! Un ventre non è una cresta. La cresta corre lungo la corda. Il ventre sta sempre nello stesso posto e oscilla su e giù.

> La formula, per chi la vuole. La somma di $A \cdot \sin(k \cdot x - \omega \cdot t)$ e $A \cdot \sin(k \cdot x + \omega \cdot t)$ è $2 \cdot A \cdot \sin(k \cdot x) \cdot \cos(\omega \cdot t)$. In ogni punto l'ampiezza è $2 \cdot A \cdot |\sin(k \cdot x)|$: zero nei nodi, $2 \cdot A$ nei ventri. Con il seno il punto $x = 0$ non si muove mai: è il capo fisso, come nei grafici di questa pagina.

?? In un'onda stazionaria due nodi vicini distano 25 cm. Quanto vale la lunghezza d'onda?
[ ] 25 cm
[x] 50 cm
[ ] 100 cm
=> Fra due nodi vicini c'è mezza lunghezza d'onda: $\lambda = 2 \cdot 25\,\text{cm} = 50\,\text{cm}$.`
    },
    {
      id: 'armoniche',
      titolo: 'La corda fissata: le armoniche',
      testo: R`Una corda di chitarra è fissata ai due capi. I capi non si muovono mai: sono due nodi. Allora sulla corda non sta un'onda stazionaria qualunque. Ci deve stare un numero intero di mezze lunghezze d'onda.

~ \ell = n \cdot \dfrac{\lambda}{2} :: $n$ mezze onde, con $n = 1, 2, 3, \dots$
~ \lambda_n = \dfrac{2 \cdot \ell}{n} :: le sole lunghezze d'onda possibili
~ f_n = \dfrac{v}{\lambda_n} = \evidb{n \cdot \dfrac{v}{2 \cdot \ell}} :: e le sole frequenze possibili

>* Su una corda lunga $\ell$, fissata ai due capi, stanno solo le onde con $\lambda_n = \dfrac{2 \cdot \ell}{n}$. Le loro frequenze sono le **armoniche** $f_n = n \cdot f_1$. La più bassa, $f_1 = \dfrac{v}{2 \cdot \ell}$, è la **frequenza fondamentale**.

Per la corda del la di una chitarra, lunga 0,65 m, le onde viaggiano a 143 m/s. La fondamentale ha $\lambda_1 = 1{,}3\,\text{m}$ e $f_1 = 110\,\text{Hz}$. Le armoniche successive sono 220 Hz, 330 Hz, 440 Hz e così via.

[[grafico:armoniche]]

La prima armonica ha un solo ventre. La seconda ne ha due, con un nodo nel mezzo. L'armonica $n$ ha $n$ ventri.

Una corda pizzicata vibra in molte armoniche insieme. L'orecchio sente la nota della fondamentale. Le altre armoniche danno il **timbro**, il colore del suono.

Da $f_1 = \dfrac{v}{2 \cdot \ell}$ e $v = \sqrt{F / \mu}$ si capisce come si suona una chitarra.

- Si **tende** la corda, cioè si aumenta $F$: la nota sale.
- Si **accorcia** la corda premendola su un tasto, cioè si riduce $\ell$: la nota sale.
- Le corde **grosse**, con $\mu$ più grande, danno le note basse.

>! Le armoniche sono multipli **interi** della fondamentale. Sulla corda del la non c'è un'armonica a 165 Hz.

?? La fondamentale di una corda è 196 Hz. Quanto vale la terza armonica?
[ ] 65,3 Hz
[ ] 392 Hz
[x] 588 Hz
=> Le armoniche sono multipli interi della fondamentale: $f_3 = 3 \cdot 196\,\text{Hz} = 588\,\text{Hz}$. 392 Hz è la seconda armonica.`
    },
    {
      id: 'diffrazione',
      titolo: 'La diffrazione: l\'onda gira l\'angolo',
      testo: R`Senti la voce di un amico da dietro un angolo, anche se non lo vedi. Il suono gira intorno agli ostacoli. Anche questo è un comportamento tipico delle onde.

Un **fronte d'onda** è la linea dei punti che oscillano insieme, per esempio una cresta. Un sasso nello stagno dà fronti circolari. Il mare lontano dalla riva dà fronti quasi dritti: sono le **onde piane**.

Per capire come avanza un fronte serve un'idea dell'olandese Christiaan Huygens. Ogni punto raggiunto dall'onda fa da piccola sorgente, e da lì parte un'ondina circolare. Il nuovo fronte è la linea che tocca tutte le ondine.

>* **Principio di Huygens**: ogni punto di un fronte d'onda si comporta come una sorgente di onde secondarie. Il fronte successivo è la linea che le inviluppa.

[[video:onde/diffrazione]]

Quando un'onda passa da una fessura, fanno da sorgenti solo i punti della fessura. Se la fessura è larga, al centro le ondine ricostruiscono un fronte dritto. L'onda passa quasi dritta e si incurva solo ai bordi. Se la fessura è stretta, i suoi punti sono tutti vicini e fanno quasi da sorgente unica: oltre la fessura parte un'onda circolare.

>* La **diffrazione** è il piegarsi di un'onda intorno a un ostacolo, o il suo allargarsi dopo una fessura. Si vede bene quando la larghezza $a$ della fessura è paragonabile a $\lambda$, o più piccola.

[[grafico:huygens]]

Conta il rapporto fra $a$ e $\lambda$, non la larghezza da sola. Una porta è larga circa 0,9 m. Un suono di 500 Hz ha $\lambda \approx 0{,}69\,\text{m}$. La luce visibile ha $\lambda \approx 5 \cdot 10^{-7}\,\text{m}$.

~ \dfrac{a}{\lambda_\text{suono}} = \dfrac{0{,}9\,\text{m}}{0{,}69\,\text{m}} \approx 1{,}3 :: il suono: diffrazione forte, riempie la stanza
~ \dfrac{a}{\lambda_\text{luce}} = \dfrac{0{,}9\,\text{m}}{5 \cdot 10^{-7}\,\text{m}} :: e la luce?
~ \dfrac{a}{\lambda_\text{luce}} \approx \evidb{1{,}8 \cdot 10^6} :: per la luce la porta è enorme: va dritta

Per questo dalla porta aperta senti la radio, ma non la vedi. Più $a$ è piccola rispetto a $\lambda$, più l'onda si apre: l'apertura va come $\lambda / a$. Anche la luce fa diffrazione: bastano fessure di decimi di millimetro e uno schermo lontano.

>! La diffrazione non è una riflessione. L'onda non rimbalza sui bordi della fessura: si allarga oltre, anche dietro la parete.

?? Onde con $\lambda = 2\,\text{cm}$ passano da una fessura. Con quale larghezza si allargano di più dopo la fessura?
[x] 1 cm
[ ] 5 cm
[ ] 20 cm
=> La diffrazione è più forte con una fessura paragonabile a $\lambda$ o più piccola. Con 1 cm l'onda si apre quasi a semicerchio; con 20 cm passa quasi dritta.`
    }
  ],
  grafici: {
    /* un impulso corre sulla corda a 1 m/s; il punto P va solo su e giù */
    impulso: {
      tipo: 'piano', x: [0, 10.9], y: [-6, 14], altezza: 400, proporzioni: 'libere', passo: [1, 5], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [{ nome: 't1', min: 0, max: 5, passo: 0.25, valore: 1, etichetta: 'tempo t (s)' }],
      funzioni: [{ f: '10*exp(-((x - 2.5 - t1)/0.7)^2)', colore: 1, dominio: [0, 10] }],
      elementi: [
        { tipo: 'segmento', da: [6.5, -4], a: [6.5, 12], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [6.5, '10*exp(-((6.5 - 2.5 - t1)/0.7)^2)'], etichetta: 'P', posizione: 'destra', colore: 'grigio' },
        { tipo: 'vettore', da: ['3.4 + t1', 11], a: ['4.9 + t1', 11], etichetta: 'v', colore: 1 }
      ],
      didascalia: 'Un impulso corre lungo una corda a 1 m/s. Il punto P della corda sale e scende quando l\'impulso passa, ma resta sempre in x = 6,5 m: si sposta la forma, non la corda. È un\'onda trasversale. Il cursore fa scorrere il tempo.'
    },
    /* la fotografia di un'onda: lunghezza d'onda fra due creste e ampiezza */
    fotografia: {
      tipo: 'piano', x: [0, 9.4], y: [-38, 42], altezza: 420, passo: [1, 10], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [
        { nome: 'l', min: 1, max: 4, passo: 0.5, valore: 3, etichetta: 'lunghezza d\'onda λ (m)' },
        { nome: 'A', min: 10, max: 25, passo: 5, valore: 20, etichetta: 'ampiezza A (cm)' }
      ],
      funzioni: [{ f: 'A*cos(2*pi*x/l)', colore: 1, dominio: [0, 8] }],
      elementi: [
        { tipo: 'segmento', da: ['l*round(8/l - 0.5) - l', 'A + 6'], a: ['l*round(8/l - 0.5)', 'A + 6'], colore: 'grigio' },
        { tipo: 'segmento', da: ['l*round(8/l - 0.5) - l', 'A + 3'], a: ['l*round(8/l - 0.5) - l', 'A + 9'], colore: 'grigio' },
        { tipo: 'segmento', da: ['l*round(8/l - 0.5)', 'A + 3'], a: ['l*round(8/l - 0.5)', 'A + 9'], colore: 'grigio' },
        { tipo: 'testo', p: ['l*round(8/l - 0.5) - l/2', 'A + 11'], testo: 'λ = {{l}} m' },
        { tipo: 'segmento', da: ['l*round(8/l - 0.5) - l/2', 0], a: ['l*round(8/l - 0.5) - l/2', '-A'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: ['l*round(8/l - 0.5) - l/2', '-A - 8'], testo: 'A = {{A}} cm' }
      ],
      didascalia: 'La forma di una corda in un istante, come in una fotografia. La lunghezza d\'onda è la distanza fra due creste vicine; l\'ampiezza è l\'altezza di una cresta, o la profondità di una gola, rispetto alla corda a riposo. I due cursori sono indipendenti.'
    },
    /* la funzione d'onda a t fisso: la cresta partita da x = 0 avanza di moto uniforme */
    viaggia: {
      tipo: 'piano', x: [0, 11.3], y: [-15, 22], altezza: 400, passo: [1, 5], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [{ nome: 't1', min: 0, max: 4, passo: 0.25, valore: 0.5, etichetta: 'tempo t (s)' }],
      funzioni: [
        { f: '10*cos(pi*x/2)', colore: 1, dominio: [0, 10], tratteggio: true },
        { f: '10*cos(pi*x/2 - pi*t1)', colore: 1, dominio: [0, 10] }
      ],
      elementi: [
        { tipo: 'punto', p: ['2*t1', 10], colore: 3 },
        { tipo: 'testo', p: [9.9, 18.5], testo: 'cresta in x = {{2*t1}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'onda y = 10·cos(k·x − ω·t), in centimetri, con λ = 4 m e T = 2 s. Il tratteggio è la fotografia a t = 0, la linea piena quella all\'istante scelto. La cresta (il punto verde) avanza di 2 m ogni secondo: v = λ / T.'
    },
    /* la storia di due punti della corda: lo stesso moto armonico, in ritardo */
    punto: {
      tipo: 'orario', grandezza: 'y', unita: 'cm', t: [0, 7], y: [-15, 22],
      parametri: [{ nome: 'dx', min: 0, max: 4, passo: 0.5, valore: 1, etichetta: 'distanza Δx (m)' }],
      funzioni: [
        { f: '10*cos(pi*t)', colore: 1, dominio: [0, 6] },
        { f: '10*cos(pi*dx/2 - pi*t)', colore: 1, dominio: [0, 6], tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [5.9, 18.5], testo: 'ritardo = {{dx/2}} s = {{dx/4}} T', ancora: 'end' }
      ],
      didascalia: 'La stessa onda di prima (λ = 4 m, T = 2 s, v = 2 m/s). Linea piena: il punto della corda in x = 0. Tratteggio: il punto più lontano di Δx. Fa lo stesso moto armonico, in ritardo di Δx / v. Con Δx = λ le due curve coincidono: i punti sono in fase. Con Δx = λ/2 sono in opposizione.'
    },
    /* due onde uguali sfasate di Δr: la loro somma */
    somma: {
      tipo: 'piano', x: [0, 9.4], y: [-25, 38], altezza: 420, passo: [1, 10], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [{ nome: 'dr', min: 0, max: 2, passo: 0.25, valore: 0.5, etichetta: 'Δr (in lunghezze d\'onda)' }],
      funzioni: [
        { f: '10*cos(pi*x/2)', colore: 1, dominio: [0, 8] },
        { f: '10*cos(pi*x/2 - 2*pi*dr)', colore: 1, dominio: [0, 8], tratteggio: true },
        { f: '10*cos(pi*x/2) + 10*cos(pi*x/2 - 2*pi*dr)', colore: 3, dominio: [0, 8] }
      ],
      elementi: [
        { tipo: 'testo', p: [9.3, 33], testo: 'ampiezza della somma: {{20*abs(cos(pi*dr))|1}} cm', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [9.3, 27], testo: '{{? abs(cos(pi*dr)) > 0.999 | interferenza costruttiva | }}{{? abs(cos(pi*dr)) < 0.001 | interferenza distruttiva | }}', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Due onde di ampiezza 10 cm (azzurre, una tratteggiata) arrivano con una differenza di cammino Δr. La verde è la loro somma, punto per punto. Con Δr intero cresta e cresta coincidono; con Δr = 0,5 o 1,5 la somma è piatta.'
    },
    /* due onde opposte e la loro somma: nodi fermi, ventri che pulsano */
    stazionaria: {
      tipo: 'piano', x: [0, 3.6], y: [-28, 32], altezza: 420, passo: [0.5, 10], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [{ nome: 'fa', min: 0, max: 1, passo: 0.05, valore: 0.1, etichetta: 'tempo t/T' }],
      funzioni: [
        { f: '10*sin(pi*x - 2*pi*fa)', colore: 1, dominio: [0, 3], tratteggio: true },
        { f: '10*sin(pi*x + 2*pi*fa)', colore: 1, dominio: [0, 3], tratteggio: true },
        { f: '20*sin(pi*x)*cos(2*pi*fa)', colore: 3, dominio: [0, 3] }
      ],
      elementi: [
        { tipo: 'area', f: '20*abs(sin(pi*x))', g: '-20*abs(sin(pi*x))', da: 0, a: 3, colore: 'grigio' },
        { tipo: 'punto', p: [1, 0], colore: 'grigio' },
        { tipo: 'punto', p: [2, 0], colore: 'grigio' },
        { tipo: 'punto', p: [3, 0], colore: 'grigio' },
        { tipo: 'testo', p: [1, -25], testo: 'nodo' },
        { tipo: 'testo', p: [2, -25], testo: 'nodo' },
        { tipo: 'testo', p: [1.5, 26], testo: 'ventre' },
        { tipo: 'testo', p: [2.5, 26], testo: 'ventre' }
      ],
      didascalia: 'Due onde uguali (azzurre, tratteggiate) con λ = 2 m corrono in versi opposti. La loro somma (verde) non corre: pulsa dentro la zona grigia. I nodi, distanti 1 m cioè λ/2, restano fermi. Il cursore fa scorrere il tempo lungo un periodo.'
    },
    /* le armoniche di una corda fissata ai due capi */
    armoniche: {
      tipo: 'piano', x: [0, 1.2], y: [-15, 22], altezza: 400, passo: [0.2, 5], etichette: { x: 'x (m)', y: 'y (cm)' },
      parametri: [{ nome: 'n', min: 1, max: 6, passo: 1, valore: 2, etichetta: 'armonica n' }],
      funzioni: [
        { f: '10*sin(n*pi*x)', colore: 3, dominio: [0, 1] },
        { f: '-10*sin(n*pi*x)', colore: 3, dominio: [0, 1], tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [0.99, 18], testo: 'λ = {{2/n}} m, f = {{100*n}} Hz', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una corda lunga 1 m, fissata ai due capi, su cui le onde viaggiano a 200 m/s. Le due linee sono le posizioni estreme della corda. L\'armonica n ha n ventri: λ = 2·ℓ/n e f = n·100 Hz.'
    },
    /* il principio di Huygens a una fessura: fronte dritto al centro, archi ai bordi */
    huygens: {
      tipo: 'piano', x: [-3.2, 8], y: [-5.2, 5.2], altezza: 560, assi: false, griglia: false, proporzioni: 'uguali', mirino: false,
      parametri: [{ nome: 'a', min: 0.5, max: 5, passo: 0.5, valore: 1, etichetta: 'fessura a (in lunghezze d\'onda)' }],
      funzioni: [1, 2, 3, 4, 5, 6, 7].reduce(function (lista, r) {
        const dom = [r + '*cos(asin(min(1, 1/a)))', r];   /* l'arco si apre fino all'angolo con sin θ = λ/a */
        return lista.concat([
          { f: 'a/2 + sqrt(' + r * r + ' - x^2)', dominio: dom, colore: 1 },
          { f: '-a/2 - sqrt(' + r * r + ' - x^2)', dominio: dom, colore: 1 }
        ]);
      }, []),
      elementi: [
        { tipo: 'poligono', punti: [[-0.15, 'a/2'], [0.15, 'a/2'], [0.15, 5.2], [-0.15, 5.2]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.15, '-a/2'], [0.15, '-a/2'], [0.15, -5.2], [-0.15, -5.2]], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 'a/2'], a: [8, 'a/2'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, '-a/2'], a: [8, '-a/2'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [-1, -5.2], a: [-1, 5.2], colore: 1 },
        { tipo: 'segmento', da: [-2, -5.2], a: [-2, 5.2], colore: 1 },
        { tipo: 'segmento', da: [-3, -5.2], a: [-3, 5.2], colore: 1 }
      ].concat([1, 2, 3, 4, 5, 6, 7].map(function (r) {
        return { tipo: 'segmento', da: [r, '-a/2'], a: [r, 'a/2'], colore: 1 };
      })),
      didascalia: 'Visti dall\'alto: le creste di un\'onda piana arrivano da sinistra contro una parete con una fessura, una lunghezza d\'onda fra una cresta e l\'altra. Le righe tratteggiate segnano dove arriverebbe l\'onda se andasse dritta. Fessura larga: l\'onda passa quasi dritta e si piega solo ai bordi. Fessura di λ o più stretta: si apre a semicerchio. Disegno qualitativo: ai bordi l\'onda è più debole.'
    }
  },
  esempi: [
    {
      titolo: 'La boa e le onde del mare',
      problema: R`Una boa ancorata sale e scende 15 volte in un minuto. Le creste delle onde distano 12 m l'una dall'altra. Quanto valgono la frequenza, il periodo e la velocità delle onde?`,
      passi: [
        R`Dati: 15 oscillazioni in $\Delta t = 60\,\text{s}$, $\lambda = 12\,\text{m}$. Cerco $f$, $T$ e $v$.`,
        R`La frequenza conta le oscillazioni al secondo: $f = \dfrac{15}{60\,\text{s}} = 0{,}25\,\text{Hz}$.`,
        R`Il periodo è l'inverso: $T = \dfrac{1}{f} = \dfrac{1}{0{,}25\,\text{Hz}} = 4\,\text{s}$. La boa fa un su e giù ogni 4 secondi.`,
        R`La velocità: $v = \lambda \cdot f = 12\,\text{m} \cdot 0{,}25\,\text{Hz} = 3\,\text{m/s}$, circa 11 km/h.`,
        R`Controllo con il periodo: in 4 s la cresta avanza di una lunghezza d'onda, $v = \dfrac{\lambda}{T} = \dfrac{12\,\text{m}}{4\,\text{s}} = 3\,\text{m/s}$. Torna.`
      ],
      risultato: R`$f = 0{,}25\,\text{Hz}$, $T = 4\,\text{s}$, $v = 3\,\text{m/s}$`
    },
    {
      titolo: 'Le onde dell\'ecografia',
      problema: R`Un ecografo manda nel corpo ultrasuoni di 2 MHz. Nei tessuti molli il suono viaggia a circa 1540 m/s. Quanto vale la lunghezza d'onda? Perché si usano frequenze così alte?`,
      passi: [
        R`Dati: $f = 2\,\text{MHz} = 2 \cdot 10^6\,\text{Hz}$, $v = 1540\,\text{m/s}$. Cerco $\lambda$.`,
        R`Dalla relazione $v = \lambda \cdot f$ ricavo $\lambda = \dfrac{v}{f}$.`,
        R`$\lambda = \dfrac{1540\,\text{m/s}}{2 \cdot 10^6\,\text{Hz}} = 7{,}7 \cdot 10^{-4}\,\text{m}$, cioè $0{,}77\,\text{mm}$.`,
        R`Un'onda aggira gli oggetti più piccoli della sua lunghezza d'onda (è la diffrazione), e così non li «vede». Per distinguere dettagli di un millimetro serve una $\lambda$ di quella misura, quindi una frequenza alta.`,
        R`Controllo: $0{,}00077\,\text{m} \cdot 2\,000\,000\,\text{Hz} = 1540\,\text{m/s}$. Torna.`
      ],
      risultato: R`$\lambda \approx 0{,}77\,\text{mm}$: abbastanza piccola da distinguere dettagli di un millimetro.`
    },
    {
      titolo: 'La corda tesa da un peso',
      problema: R`Una corda con densità lineare 5 g/m passa su una carrucola. All'estremo pende una massa di 10 kg, ferma. Un vibratore scuote l'altro capo a 70 Hz. Con che velocità corrono le onde? Quanto sono lunghe?`,
      passi: [
        R`Dati: $\mu = 5\,\text{g/m} = 0{,}005\,\text{kg/m}$, $m = 10\,\text{kg}$, $f = 70\,\text{Hz}$. Cerco $v$ e $\lambda$.`,
        R`La massa appesa è ferma: la tensione della corda pareggia il suo peso. $F = m \cdot g = 10\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 98\,\text{N}$.`,
        R`Velocità sulla corda: $v = \sqrt{\dfrac{F}{\mu}} = \sqrt{\dfrac{98\,\text{N}}{0{,}005\,\text{kg/m}}} = \sqrt{19\,600}\,\text{m/s} = 140\,\text{m/s}$.`,
        R`La frequenza la decide il vibratore: $\lambda = \dfrac{v}{f} = \dfrac{140\,\text{m/s}}{70\,\text{Hz}} = 2\,\text{m}$.`,
        R`Controllo delle unità: $\dfrac{\text{N}}{\text{kg/m}} = \dfrac{\text{kg} \cdot \text{m/s}^2}{\text{kg/m}} = \text{m}^2/\text{s}^2$, e la radice dà m/s. Torna.`
      ],
      risultato: R`$v = 140\,\text{m/s}$, $\lambda = 2\,\text{m}$`
    },
    {
      titolo: 'Scrivere la funzione d\'onda',
      problema: R`Un'onda armonica corre su una corda nel verso positivo dell'asse $x$. Ha ampiezza 4 cm, lunghezza d'onda 1,6 m e frequenza 2,5 Hz. Scrivi la sua funzione d'onda e calcola la velocità.`,
      passi: [
        R`Dati: $A = 4\,\text{cm} = 0{,}04\,\text{m}$, $\lambda = 1{,}6\,\text{m}$, $f = 2{,}5\,\text{Hz}$. Cerco $k$, $\omega$, la funzione $y(x, t)$ e $v$.`,
        R`Numero d'onda: $k = \dfrac{2\pi}{\lambda} = \dfrac{2\pi}{1{,}6\,\text{m}} \approx 3{,}93\,\text{rad/m}$.`,
        R`Pulsazione: $\omega = \dfrac{2\pi}{T} = 2\pi \cdot f = 2\pi \cdot 2{,}5\,\text{Hz} \approx 15{,}7\,\text{rad/s}$.`,
        R`Va nel verso positivo, quindi segno meno: $y = 0{,}04 \cdot \cos(3{,}93 \cdot x - 15{,}7 \cdot t)$, con $x$ in metri, $t$ in secondi e $y$ in metri.`,
        R`Velocità: $v = \lambda \cdot f = 1{,}6\,\text{m} \cdot 2{,}5\,\text{Hz} = 4\,\text{m/s}$. Controllo con la formula: $\dfrac{\omega}{k} = \dfrac{15{,}7}{3{,}93}\,\text{m/s} \approx 4{,}0\,\text{m/s}$. Torna.`
      ],
      risultato: R`$y = 0{,}04 \cdot \cos(3{,}93 \cdot x - 15{,}7 \cdot t)$ nel SI, $v = 4\,\text{m/s}$`
    },
    {
      titolo: 'Dove l\'acqua sta ferma',
      problema: R`In una vasca due punte in fase battono l'acqua a 5 Hz. Le onde viaggiano a 0,30 m/s. Il punto P dista 20 cm dalla prima punta e 41 cm dalla seconda. Il punto R dista 24 cm e 36 cm. Che cosa succede in P e in R?`,
      passi: [
        R`Dati: $f = 5\,\text{Hz}$, $v = 0{,}30\,\text{m/s}$; P a 20 cm e 41 cm, R a 24 cm e 36 cm. Cerco il tipo di interferenza in P e in R.`,
        R`Prima la lunghezza d'onda: $\lambda = \dfrac{v}{f} = \dfrac{0{,}30\,\text{m/s}}{5\,\text{Hz}} = 0{,}06\,\text{m} = 6\,\text{cm}$.`,
        R`In P: $\Delta r = 41\,\text{cm} - 20\,\text{cm} = 21\,\text{cm}$, e $\dfrac{21\,\text{cm}}{6\,\text{cm}} = 3{,}5$. È $\left(3 + \tfrac{1}{2}\right) \cdot \lambda$: interferenza distruttiva, l'acqua resta ferma.`,
        R`In R: $\Delta r = 36\,\text{cm} - 24\,\text{cm} = 12\,\text{cm} = 2 \cdot \lambda$. Le onde arrivano cresta con cresta: interferenza costruttiva.`,
        R`Controllo: conta solo la differenza delle distanze, non le distanze. P sta su una linea di quiete; R oscilla con ampiezza doppia.`
      ],
      risultato: R`In P interferenza distruttiva ($\Delta r = 3{,}5 \cdot \lambda$), in R costruttiva ($\Delta r = 2 \cdot \lambda$).`
    },
    {
      titolo: 'La corda del violino',
      problema: R`La corda del la di un violino vibra per una lunghezza di 0,32 m, e la sua nota fondamentale è 440 Hz. La corda ha densità lineare 0,60 g/m. Con che velocità corrono le onde? Quanto è tesa la corda? Quanto vale la terza armonica?`,
      passi: [
        R`Dati: $\ell = 0{,}32\,\text{m}$, $f_1 = 440\,\text{Hz}$, $\mu = 0{,}60\,\text{g/m} = 6{,}0 \cdot 10^{-4}\,\text{kg/m}$. Cerco $v$, la tensione $F$ e $f_3$.`,
        R`Nella fondamentale $\lambda_1 = 2 \cdot \ell = 0{,}64\,\text{m}$. Quindi $v = \lambda_1 \cdot f_1 = 0{,}64\,\text{m} \cdot 440\,\text{Hz} \approx 282\,\text{m/s}$.`,
        R`Dalla velocità alla tensione: da $v = \sqrt{F / \mu}$ viene $F = \mu \cdot v^2$.`,
        R`$F = 6{,}0 \cdot 10^{-4}\,\text{kg/m} \cdot (281{,}6\,\text{m/s})^2 \approx 47{,}6\,\text{N}$: come il peso di quasi 5 kg.`,
        R`Terza armonica: $f_3 = 3 \cdot f_1 = 1320\,\text{Hz}$. Controllo con la lunghezza d'onda: $\lambda_3 = \dfrac{2 \cdot \ell}{3} \approx 0{,}213\,\text{m}$ e $\dfrac{281{,}6\,\text{m/s}}{0{,}213\,\text{m}} \approx 1320\,\text{Hz}$. Torna.`
      ],
      risultato: R`$v \approx 282\,\text{m/s}$, $F \approx 47{,}6\,\text{N}$, $f_3 = 1320\,\text{Hz}$`
    }
  ],
  formulario: [
    { nome: 'Periodo e frequenza', formula: R`f = \dfrac{1}{T}`, nota: R`La frequenza in hertz: $1\,\text{Hz} = 1\,\text{s}^{-1}$, un'oscillazione al secondo.` },
    { nome: 'Velocità di un\'onda', formula: R`v = \lambda \cdot f \qquad v = \dfrac{\lambda}{T}`, nota: R`In un periodo la cresta avanza di una lunghezza d'onda.` },
    { nome: 'Velocità su una corda tesa', formula: R`v = \sqrt{\dfrac{F}{\mu}}`, nota: R`$F$ tensione in N, $\mu$ densità lineare in kg/m. La velocità dipende dal mezzo, non dalla sorgente.` },
    { nome: 'Funzione d\'onda armonica', formula: R`y = A \cdot \cos(k \cdot x - \omega \cdot t)`, nota: R`Onda che va nel verso positivo di $x$; con $+\omega \cdot t$ va nel verso negativo.` },
    { nome: 'Numero d\'onda e pulsazione', formula: R`k = \dfrac{2\pi}{\lambda} \qquad \omega = \dfrac{2\pi}{T}`, nota: R`$k$ in rad/m, $\omega$ in rad/s.` },
    { nome: 'Velocità dalla funzione d\'onda', formula: R`v = \dfrac{\omega}{k}`, nota: R`È di nuovo $\lambda / T$.` },
    { nome: 'Interferenza costruttiva', formula: R`\Delta r = n \cdot \lambda`, nota: R`Sorgenti in fase, $n = 0, 1, 2, \dots$: cresta con cresta, ampiezza doppia.` },
    { nome: 'Interferenza distruttiva', formula: R`\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda`, nota: R`Sorgenti in fase: cresta con gola, le linee di quiete.` },
    { nome: 'Distanza fra due nodi vicini', formula: R`\text{nodo–nodo} = \dfrac{\lambda}{2}`, nota: R`Nelle onde stazionarie; fra due nodi c'è un ventre.` },
    { nome: 'Distanza fra un nodo e il ventre vicino', formula: R`\text{nodo–ventre} = \dfrac{\lambda}{4}`, nota: R`Il ventre sta a metà fra due nodi.` },
    { nome: 'Corda fissata ai due capi', formula: R`\lambda_n = \dfrac{2 \cdot \ell}{n} \qquad f_n = n \cdot f_1`, nota: R`$n = 1, 2, 3, \dots$; l'armonica $n$ ha $n$ ventri.` },
    { nome: 'Frequenza fondamentale', formula: R`f_1 = \dfrac{v}{2 \cdot \ell}`, nota: R`Con $v = \sqrt{F / \mu}$: la nota sale tendendo o accorciando la corda.` },
    { nome: 'Diffrazione: quanto si apre l\'onda', formula: R`\theta \approx \dfrac{\lambda}{a}`, nota: R`Angolo in radianti, dopo una fessura (o un ostacolo) larga $a$. È evidente con $a$ paragonabile a $\lambda$; con la luce bastano decimi di millimetro e uno schermo lontano.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'cosa-e-onda', tipo: 'definizione', fronte: R`Che cos'è un'**onda**?`, retro: R`Una perturbazione che si propaga: trasporta energia ma non materia. Ogni punto del mezzo oscilla attorno al suo posto.` },
    { id: 'fc-02', sezione: 'cosa-e-onda', tipo: 'definizione', fronte: R`Differenza fra onda **trasversale** e **longitudinale**`, retro: R`Trasversale: il mezzo oscilla perpendicolare alla direzione dell'onda (corda). Longitudinale: parallelo (molla, suono nell'aria).` },
    { id: 'fc-03', sezione: 'cosa-e-onda', tipo: 'concetto', fronte: R`Che cosa sono le **onde meccaniche**?`, retro: R`Le onde che hanno bisogno di un mezzo materiale: acqua, corde, aria. La luce invece viaggia anche nel vuoto.` },
    { id: 'fc-04', sezione: 'grandezze', tipo: 'definizione', fronte: R`Che cos'è la **lunghezza d'onda** $\lambda$?`, retro: R`La distanza fra due creste vicine (o fra due punti vicini che oscillano insieme), in metri.` },
    { id: 'fc-05', sezione: 'grandezze', tipo: 'definizione', fronte: R`**Periodo** e **frequenza** di un'onda`, retro: R`$T$ è il tempo di un'oscillazione completa di un punto; $f = 1/T$ le oscillazioni al secondo, in hertz.` },
    { id: 'fc-06', sezione: 'grandezze', tipo: 'formula', fronte: R`Velocità di un'onda periodica`, retro: R`$v = \lambda \cdot f = \dfrac{\lambda}{T}$: in un periodo la cresta avanza di una lunghezza d'onda.` },
    { id: 'fc-07', sezione: 'grandezze', tipo: 'concetto', fronte: R`Sulla stessa corda la frequenza raddoppia. Che cosa succede?`, retro: R`La velocità resta uguale e la lunghezza d'onda si dimezza: $\lambda = v / f$.` },
    { id: 'fc-08', sezione: 'mezzo', tipo: 'concetto', fronte: R`Da che cosa dipende la velocità di un'onda?`, retro: R`Dal mezzo, non dalla sorgente, che decide la frequenza. In certi mezzi cambia un poco con la frequenza: è la dispersione.` },
    { id: 'fc-09', sezione: 'mezzo', tipo: 'formula', fronte: R`Velocità delle onde su una **corda tesa**`, retro: R`$v = \sqrt{F / \mu}$, con $F$ tensione e $\mu$ massa per metro di corda, in kg/m.` },
    { id: 'fc-10', sezione: 'mezzo', tipo: 'concetto', fronte: R`Un'onda passa in un altro mezzo. Che cosa cambia?`, retro: R`La frequenza resta la stessa; cambiano la velocità e quindi la lunghezza d'onda.` },
    { id: 'fc-11', sezione: 'funzione-onda', tipo: 'formula', fronte: R`**Funzione d'onda** di un'onda armonica verso le $x$ positive`, retro: R`$y = A \cdot \cos(k \cdot x - \omega \cdot t)$, con $k = 2\pi / \lambda$ e $\omega = 2\pi / T$.` },
    { id: 'fc-12', sezione: 'funzione-onda', tipo: 'concetto', fronte: R`Che cosa si vede fissando $t$, e che cosa fissando $x$, nella funzione d'onda?`, retro: R`A $t$ fisso la forma della corda (una fotografia, periodo $\lambda$). A $x$ fisso il moto armonico di un punto (periodo $T$).` },
    { id: 'fc-13', sezione: 'funzione-onda', tipo: 'concetto', fronte: R`Due punti di una corda distano $\lambda$. E se distano $\lambda / 2$?`, retro: R`A distanza $\lambda$ oscillano in fase, insieme. A $\lambda / 2$ in opposizione: uno in cresta, l'altro in gola.` },
    { id: 'fc-14', sezione: 'interferenza', tipo: 'definizione', fronte: R`Il **principio di sovrapposizione**`, retro: R`Dove passano due onde, lo spostamento risultante è la somma degli spostamenti. Dopo l'incontro le onde proseguono intatte.` },
    { id: 'fc-15', sezione: 'interferenza', tipo: 'formula', fronte: R`Condizioni di interferenza con due sorgenti in fase`, retro: R`Costruttiva: $\Delta r = n \cdot \lambda$. Distruttiva: $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$.` },
    { id: 'fc-16', sezione: 'interferenza', tipo: 'definizione', fronte: R`Che cosa sono le **linee di quiete**?`, retro: R`I punti in cui due onde arrivano cresta con gola e si annullano: lì il mezzo resta fermo.` },
    { id: 'fc-17', sezione: 'stazionarie', tipo: 'definizione', fronte: R`Che cos'è un'**onda stazionaria**?`, retro: R`La somma di due onde uguali che viaggiano in versi opposti: non corre, pulsa sul posto, con nodi fermi e ventri.` },
    { id: 'fc-18', sezione: 'stazionarie', tipo: 'concetto', fronte: R`Quanto distano due **nodi** vicini? E un nodo dal ventre vicino?`, retro: R`Due nodi: $\lambda / 2$. Nodo e ventre: $\lambda / 4$.` },
    { id: 'fc-19', sezione: 'stazionarie', tipo: 'concetto', fronte: R`Che cosa succede a un'onda che arriva a un capo fisso?`, retro: R`Si riflette e torna indietro capovolta: una cresta torna come gola. Il capo fisso è un nodo.` },
    { id: 'fc-20', sezione: 'armoniche', tipo: 'formula', fronte: R`Onde possibili su una corda lunga $\ell$ fissata ai due capi`, retro: R`$\lambda_n = \dfrac{2 \cdot \ell}{n}$ e $f_n = n \cdot \dfrac{v}{2 \cdot \ell}$, con $n = 1, 2, 3, \dots$` },
    { id: 'fc-21', sezione: 'armoniche', tipo: 'definizione', fronte: R`Che cosa sono la **fondamentale** e le **armoniche**?`, retro: R`La fondamentale è la frequenza più bassa, $f_1 = v / (2 \cdot \ell)$. Le armoniche sono i suoi multipli interi, $f_n = n \cdot f_1$.` },
    { id: 'fc-22', sezione: 'armoniche', tipo: 'procedura', fronte: R`Come si alza la nota di una corda?`, retro: R`Si tende di più ($F$ cresce), si accorcia ($\ell$ cala), oppure si usa una corda più sottile ($\mu$ più piccola).` },
    { id: 'fc-23', sezione: 'diffrazione', tipo: 'definizione', fronte: R`Il **principio di Huygens**`, retro: R`Ogni punto di un fronte d'onda è sorgente di onde secondarie; il nuovo fronte è la linea che le inviluppa.` },
    { id: 'fc-24', sezione: 'diffrazione', tipo: 'concetto', fronte: R`Quando la **diffrazione** è evidente?`, retro: R`Quando la fessura o l'ostacolo ha una larghezza paragonabile a $\lambda$ o più piccola. Il suono la fa con le porte, la luce solo con fessure strettissime.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un punto di una corda oscilla 5 volte al secondo. Quanto vale il periodo?`, suggerimenti: [R`Il periodo è l'inverso della frequenza.`], risposta: { tipo: 'numero', valore: 0.2, unita: 's' }, soluzione: [R`$f = 5\,\text{Hz}$, quindi $T = \dfrac{1}{f} = \dfrac{1}{5}\,\text{s} = 0{,}2\,\text{s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un'onda ha periodo 0,125 s. Quanto vale la sua frequenza?`, suggerimenti: [R`$f = 1/T$.`], risposta: { tipo: 'numero', valore: 8, unita: 'Hz' }, soluzione: [R`$f = \dfrac{1}{0{,}125\,\text{s}} = 8\,\text{Hz}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un'onda ha lunghezza d'onda 0,7 m e frequenza 5 Hz. Con che velocità si propaga?`, suggerimenti: [R`$v = \lambda \cdot f$.`], risposta: { tipo: 'numero', valore: 3.5, unita: 'm/s' }, soluzione: [R`$v = 0{,}7\,\text{m} \cdot 5\,\text{Hz} = 3{,}5\,\text{m/s}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Il suono viaggia nell'aria a 340 m/s. Quanto è lunga l'onda di un suono di 680 Hz?`, suggerimenti: [R`Ricava $\lambda$ da $v = \lambda \cdot f$.`], risposta: { tipo: 'numero', valore: 0.5, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{v}{f} = \dfrac{340\,\text{m/s}}{680\,\text{Hz}} = 0{,}5\,\text{m}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Onde sull'acqua corrono a 1,8 m/s e le creste distano 0,6 m. Quanto vale la frequenza?`, suggerimenti: [R`$f = v / \lambda$.`], risposta: { tipo: 'numero', valore: 3, unita: 'Hz' }, soluzione: [R`$f = \dfrac{1{,}8\,\text{m/s}}{0{,}6\,\text{m}} = 3\,\text{Hz}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Le onde del mare hanno lunghezza d'onda 10 m e periodo 4 s. Quanto vale la loro velocità?`, suggerimenti: [R`In un periodo la cresta avanza di una lunghezza d'onda.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'm/s' }, soluzione: [R`$v = \dfrac{\lambda}{T} = \dfrac{10\,\text{m}}{4\,\text{s}} = 2{,}5\,\text{m/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Un tappo sull'acqua fa 30 oscillazioni complete in 20 s. Quanto vale la frequenza dell'onda?`, suggerimenti: [R`Oscillazioni diviso tempo.`], risposta: { tipo: 'numero', valore: 1.5, unita: 'Hz' }, soluzione: [R`$f = \dfrac{30}{20\,\text{s}} = 1{,}5\,\text{Hz}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una corda ha densità lineare 0,04 kg/m ed è tesa con una forza di 36 N. Con che velocità corrono le onde?`, suggerimenti: [R`$v = \sqrt{F / \mu}$.`], risposta: { tipo: 'numero', valore: 30, unita: 'm/s' }, soluzione: [R`$v = \sqrt{\dfrac{36\,\text{N}}{0{,}04\,\text{kg/m}}} = \sqrt{900}\,\text{m/s} = 30\,\text{m/s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Su una corda le onde corrono a 50 m/s. La tensione diventa quattro volte più grande. Con che velocità corrono ora?`, suggerimenti: [R`La tensione sta sotto radice.`], risposta: { tipo: 'numero', valore: 100, unita: 'm/s' }, soluzione: [R`$v = \sqrt{F / \mu}$: con $F$ quattro volte più grande, $v$ si moltiplica per $\sqrt{4} = 2$.`, R`$v = 2 \cdot 50\,\text{m/s} = 100\,\text{m/s}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un'onda ha lunghezza d'onda 0,5 m. Quanto vale il suo numero d'onda $k$?`, suggerimenti: [R`$k = 2\pi / \lambda$.`], risposta: { tipo: 'numero', valore: 12.57, unita: 'rad/m' }, soluzione: [R`$k = \dfrac{2\pi}{0{,}5\,\text{m}} = 4\pi\,\text{rad/m} \approx 12{,}6\,\text{rad/m}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Un'onda ha funzione d'onda $y = 0{,}02 \cdot \cos(3 \cdot x - 24 \cdot t)$, con tutto nel SI. Con che velocità corre?`, suggerimenti: [R`Leggi $k$ e $\omega$ nella formula.`, R`$v = \omega / k$.`], risposta: { tipo: 'numero', valore: 8, unita: 'm/s' }, soluzione: [R`$k = 3\,\text{rad/m}$ e $\omega = 24\,\text{rad/s}$.`, R`$v = \dfrac{\omega}{k} = \dfrac{24}{3}\,\text{m/s} = 8\,\text{m/s}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Un'onda ha funzione d'onda $y = 0{,}01 \cdot \cos(10\pi \cdot x - 6\pi \cdot t)$, con tutto nel SI. Quanto vale la lunghezza d'onda?`, suggerimenti: [R`Il numero davanti a $x$ è $k = 2\pi / \lambda$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'm' }, soluzione: [R`$k = 10\pi\,\text{rad/m}$, quindi $\lambda = \dfrac{2\pi}{k} = \dfrac{2\pi}{10\pi}\,\text{m} = 0{,}2\,\text{m}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Due sorgenti in fase producono onde con $\lambda = 3\,\text{cm}$. Un punto dista 35 cm dalla prima e 47 cm dalla seconda. L'interferenza è costruttiva o distruttiva?`, suggerimenti: [R`Calcola $\Delta r$ e dividilo per $\lambda$.`], risposta: { tipo: 'testo', accettate: ['costruttiva', 'interferenza costruttiva'] }, soluzione: [R`$\Delta r = 47 - 35 = 12\,\text{cm}$, e $\dfrac{12}{3} = 4$: un numero intero di lunghezze d'onda.`, R`Le onde arrivano cresta con cresta: interferenza costruttiva.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Due sorgenti in fase producono onde con $\lambda = 8\,\text{cm}$. Qual è la differenza di cammino più piccola che dà interferenza distruttiva?`, suggerimenti: [R`Distruttiva: $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$, con $n = 0$.`], risposta: { tipo: 'numero', valore: 4, unita: 'cm' }, soluzione: [R`Con $n = 0$: $\Delta r = \tfrac{1}{2} \cdot 8\,\text{cm} = 4\,\text{cm}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`In un'onda stazionaria i nodi vicini distano 40 cm. Quanto vale la lunghezza d'onda?`, suggerimenti: [R`Due nodi vicini distano $\lambda / 2$.`], risposta: { tipo: 'numero', valore: 80, unita: 'cm' }, soluzione: [R`$\lambda = 2 \cdot 40\,\text{cm} = 80\,\text{cm}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un'onda stazionaria ha lunghezza d'onda 1,2 m. Quanto dista un nodo dal ventre più vicino?`, suggerimenti: [R`Fra nodo e ventre c'è un quarto di lunghezza d'onda.`], risposta: { tipo: 'numero', valore: 0.3, unita: 'm' }, soluzione: [R`$\dfrac{\lambda}{4} = \dfrac{1{,}2\,\text{m}}{4} = 0{,}3\,\text{m}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una corda lunga 0,4 m è fissata ai due capi. Le onde la percorrono a 280 m/s. Quanto vale la frequenza fondamentale?`, suggerimenti: [R`$f_1 = \dfrac{v}{2 \cdot \ell}$.`], risposta: { tipo: 'numero', valore: 350, unita: 'Hz' }, soluzione: [R`$f_1 = \dfrac{280\,\text{m/s}}{2 \cdot 0{,}4\,\text{m}} = 350\,\text{Hz}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`La fondamentale di una corda è 120 Hz. Quanto vale la quarta armonica?`, suggerimenti: [R`$f_n = n \cdot f_1$.`], risposta: { tipo: 'numero', valore: 480, unita: 'Hz' }, soluzione: [R`$f_4 = 4 \cdot 120\,\text{Hz} = 480\,\text{Hz}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Una corda lunga 1,5 m, fissata ai due capi, vibra nella quarta armonica. Quanto vale la lunghezza d'onda?`, suggerimenti: [R`$\lambda_n = \dfrac{2 \cdot \ell}{n}$.`], risposta: { tipo: 'numero', valore: 0.75, unita: 'm' }, soluzione: [R`$\lambda_4 = \dfrac{2 \cdot 1{,}5\,\text{m}}{4} = 0{,}75\,\text{m}$: quattro ventri, cioè quattro mezze onde.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un suono di 250 Hz passa dall'aria all'acqua, dove viaggia a 1500 m/s. Quanto vale la sua lunghezza d'onda nell'acqua?`, suggerimenti: [R`Cambiando mezzo la frequenza resta la stessa.`], risposta: { tipo: 'numero', valore: 6, unita: 'm' }, soluzione: [R`La frequenza resta 250 Hz. $\lambda = \dfrac{1500\,\text{m/s}}{250\,\text{Hz}} = 6\,\text{m}$.`] },

    /* ---- esercizi avanzati ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una barca all'ancora sale sulla cresta di un'onda ogni 6 s. Le creste distano 45 m. Con che velocità corrono le onde, in m/s e in km/h?`, suggerimenti: [R`Il tempo fra due creste è il periodo.`, R`$v = \lambda / T$, poi per passare ai km/h moltiplica per $3{,}6$.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'm/s' }, soluzione: [R`Dati: $T = 6\,\text{s}$, $\lambda = 45\,\text{m}$.`, R`$v = \dfrac{45\,\text{m}}{6\,\text{s}} = 7{,}5\,\text{m/s}$, cioè $v = 7{,}5 \cdot 3{,}6\,\text{km/h} = 27\,\text{km/h}$.`] },
    { id: 'es-02', difficolta: 3, testo: R`La corda del mi cantino di una chitarra, la più acuta, vibra per 0,63 m e ha fondamentale 330 Hz. La sua densità lineare è 0,40 g/m. Con che forza è tesa?`, suggerimenti: [R`Nella fondamentale $\lambda_1 = 2 \cdot \ell$: trova la velocità.`, R`Da $v = \sqrt{F / \mu}$ viene $F = \mu \cdot v^2$.`], risposta: { tipo: 'numero', valore: 69.2, unita: 'N' }, soluzione: [R`$v = 2 \cdot \ell \cdot f_1 = 2 \cdot 0{,}63\,\text{m} \cdot 330\,\text{Hz} = 415{,}8\,\text{m/s}$.`, R`$F = \mu \cdot v^2 = 0{,}0004\,\text{kg/m} \cdot (415{,}8\,\text{m/s})^2 \approx 69{,}2\,\text{N}$: come il peso di circa 7 kg.`] },
    { id: 'es-03', difficolta: 3, testo: R`Una corda dà 220 Hz e la si vuole portare a 247 Hz, senza cambiarne la lunghezza. Di quanto per cento va aumentata la tensione?`, suggerimenti: [R`La frequenza è proporzionale a $\sqrt{F}$.`, R`$\dfrac{F'}{F} = \left(\dfrac{247}{220}\right)^2$.`], risposta: { tipo: 'numero', valore: 26, unita: '%', tolleranza: 0.5 }, soluzione: [R`$f_1 = \dfrac{1}{2 \cdot \ell} \cdot \sqrt{\dfrac{F}{\mu}}$: con $\ell$ e $\mu$ fissi, $f$ è proporzionale a $\sqrt{F}$.`, R`$\dfrac{F'}{F} = \left(\dfrac{247}{220}\right)^2 \approx 1{,}26$: la tensione va aumentata del 26% circa.`] },
    { id: 'es-04', difficolta: 2, testo: R`Una corda libera lunga 64 cm dà 147 Hz. Premendo un tasto se ne accorcia la parte che vibra. Quanto deve essere lunga quella parte per dare 165 Hz?`, suggerimenti: [R`Con la stessa tensione la velocità non cambia: $f$ è inversamente proporzionale a $\ell$.`], risposta: { tipo: 'numero', valore: 57, unita: 'cm', tolleranza: 0.5 }, soluzione: [R`$f_1 = \dfrac{v}{2 \cdot \ell}$ con $v$ fissa: $f \cdot \ell$ resta costante.`, R`$\ell' = 64\,\text{cm} \cdot \dfrac{147}{165} \approx 57\,\text{cm}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un'onda su una corda ha funzione d'onda $y = 0{,}08 \cdot \cos(1{,}5 \cdot x - 6 \cdot t)$, nel SI. Quanto vale la velocità massima di un punto della corda? Confrontala con la velocità dell'onda.`, suggerimenti: [R`Ogni punto fa un moto armonico con ampiezza $A$ e pulsazione $\omega$.`, R`La velocità massima del moto armonico è $\omega \cdot A$.`], risposta: { tipo: 'numero', valore: 0.48, unita: 'm/s' }, soluzione: [R`$A = 0{,}08\,\text{m}$, $\omega = 6\,\text{rad/s}$: $v_{max} = \omega \cdot A = 6 \cdot 0{,}08\,\text{m/s} = 0{,}48\,\text{m/s}$.`, R`L'onda corre a $v = \dfrac{\omega}{k} = \dfrac{6}{1{,}5}\,\text{m/s} = 4\,\text{m/s}$: più di otto volte più veloce. Sono due velocità diverse.`] },
    { id: 'es-06', difficolta: 3, testo: R`Due altoparlanti in fase emettono lo stesso suono. Un ascoltatore sta a 3,0 m dal primo e a 3,5 m dal secondo. Il suono viaggia a 340 m/s. Qual è la frequenza più bassa per cui l'ascoltatore non sente nulla?`, suggerimenti: [R`Silenzio vuol dire interferenza distruttiva: $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$.`, R`La frequenza più bassa corrisponde alla $\lambda$ più lunga, cioè $n = 0$.`], risposta: { tipo: 'numero', valore: 340, unita: 'Hz' }, soluzione: [R`$\Delta r = 3{,}5 - 3{,}0 = 0{,}5\,\text{m}$.`, R`Con $n = 0$: $\Delta r = \dfrac{\lambda}{2}$, quindi $\lambda = 1\,\text{m}$.`, R`$f = \dfrac{v}{\lambda} = \dfrac{340\,\text{m/s}}{1\,\text{m}} = 340\,\text{Hz}$. Anche 1020 Hz, 1700 Hz… darebbero silenzio.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una corda lunga 2,4 m, fissata ai due capi, vibra a 50 Hz con quattro ventri. La sua densità lineare è 0,02 kg/m. Quanto vale la tensione?`, suggerimenti: [R`Quattro ventri: $\ell = 4 \cdot \dfrac{\lambda}{2}$.`, R`Trova $v = \lambda \cdot f$, poi $F = \mu \cdot v^2$.`], risposta: { tipo: 'numero', valore: 72, unita: 'N' }, soluzione: [R`$\lambda = \dfrac{2 \cdot 2{,}4\,\text{m}}{4} = 1{,}2\,\text{m}$.`, R`$v = 1{,}2\,\text{m} \cdot 50\,\text{Hz} = 60\,\text{m/s}$.`, R`$F = 0{,}02\,\text{kg/m} \cdot (60\,\text{m/s})^2 = 72\,\text{N}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Un pipistrello caccia con ultrasuoni di 50 kHz. Il suono viaggia nell'aria a 340 m/s. Quanto vale la lunghezza d'onda, in millimetri? Perché gli serve così corta?`, suggerimenti: [R`$\lambda = v / f$, con $f$ in hertz.`], risposta: { tipo: 'numero', valore: 6.8, unita: 'mm' }, soluzione: [R`$\lambda = \dfrac{340\,\text{m/s}}{50\,000\,\text{Hz}} = 0{,}0068\,\text{m} = 6{,}8\,\text{mm}$.`, R`Un'onda aggira gli oggetti molto più piccoli di $\lambda$ invece di rimbalzarci contro. Con 6,8 mm l'eco torna anche da un insetto.`] },
    { id: 'es-09', difficolta: 3, testo: R`Durante un terremoto le onde P corrono nella crosta a 7 km/s, le onde S a 4 km/s. Una stazione registra le onde S 15 s dopo le onde P. Quanto dista l'epicentro?`, suggerimenti: [R`Le due onde fanno la stessa distanza $D$ in tempi diversi: $\dfrac{D}{4\,\text{km/s}} - \dfrac{D}{7\,\text{km/s}} = 15\,\text{s}$.`, R`$\dfrac{1}{4} - \dfrac{1}{7} = \dfrac{3}{28}$.`], risposta: { tipo: 'numero', valore: 140, unita: 'km' }, soluzione: [R`Tempo delle P: $\dfrac{D}{7\,\text{km/s}}$; tempo delle S: $\dfrac{D}{4\,\text{km/s}}$.`, R`$\dfrac{D}{4\,\text{km/s}} - \dfrac{D}{7\,\text{km/s}} = 15\,\text{s}$, cioè $D \cdot \dfrac{3}{28}\,\text{s/km} = 15\,\text{s}$.`, R`$D = 15 \cdot \dfrac{28}{3}\,\text{km} = 140\,\text{km}$. Con tre stazioni si trova il punto esatto.`] },
    { id: 'es-10', difficolta: 2, testo: R`Un'onda di 8 Hz corre su una corda sottile a 32 m/s, poi passa su una corda più grossa dove va a 20 m/s. Quanto vale la lunghezza d'onda sulla corda grossa?`, suggerimenti: [R`Che cosa resta uguale passando da una corda all'altra?`], risposta: { tipo: 'numero', valore: 2.5, unita: 'm' }, soluzione: [R`La frequenza resta 8 Hz. Sulla corda sottile $\lambda = \dfrac{32}{8}\,\text{m} = 4\,\text{m}$.`, R`Sulla corda grossa $\lambda = \dfrac{20\,\text{m/s}}{8\,\text{Hz}} = 2{,}5\,\text{m}$: l'onda si accorcia insieme alla velocità.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa trasporta un'onda?`, opzioni: [R`La materia del mezzo, da un posto all'altro`, R`Solo la materia che sta in superficie`, R`Energia, senza trasportare materia`, R`Niente: è solo una forma che si vede`], corretta: 2, spiegazione: R`Ogni punto del mezzo oscilla e torna al suo posto, come il tappo sull'acqua: la materia resta lì. Viaggia l'energia, che può sollevare una barca o far vibrare un timpano.` },
    { id: 'q-02', domanda: R`Quando passa un suono nell'aria, come si muovono le molecole?`, opzioni: [R`Avanti e indietro, nella direzione in cui va il suono`, R`Su e giù, perpendicolari alla direzione del suono`, R`Viaggiano dalla sorgente fino all'orecchio`, R`Restano perfettamente ferme`], corretta: 0, spiegazione: R`Il suono nell'aria è un'onda longitudinale: compressioni e rarefazioni che corrono, con le molecole che oscillano parallele alla propagazione. Non viaggiano fino all'orecchio: oscillano attorno al loro posto.` },
    { id: 'q-03', domanda: R`Sulla stessa corda tesa la frequenza della mano raddoppia. La velocità dell'onda…`, opzioni: [R`raddoppia`, R`si dimezza`, R`quadruplica`, R`resta uguale`], corretta: 3, spiegazione: R`La velocità dipende dal mezzo, qui la corda, non dalla sorgente: $v = \sqrt{F / \mu}$. Con frequenza doppia si dimezza la lunghezza d'onda, non cambia la velocità.` },
    { id: 'q-04', domanda: R`Che cos'è la lunghezza d'onda?`, opzioni: [R`La distanza fra una cresta e la gola vicina`, R`La distanza fra due creste vicine`, R`L'altezza di una cresta`, R`La strada che l'onda fa in un secondo`], corretta: 1, spiegazione: R`$\lambda$ è la distanza fra due creste vicine. Fra cresta e gola c'è mezza $\lambda$; l'altezza della cresta è l'ampiezza; la strada in un secondo è la velocità.` },
    { id: 'q-05', domanda: R`La tensione di una corda diventa quattro volte più grande. La velocità delle onde…`, opzioni: [R`raddoppia`, R`quadruplica`, R`si dimezza`, R`resta uguale`], corretta: 0, spiegazione: R`$v = \sqrt{F / \mu}$: la tensione sta sotto radice, e $\sqrt{4} = 2$. Una corda più tesa è più veloce, ma non in proporzione alla tensione.` },
    { id: 'q-06', domanda: R`Un'onda passa dall'aria all'acqua. Che cosa resta uguale?`, opzioni: [R`La velocità`, R`La lunghezza d'onda`, R`La frequenza`, R`Velocità e lunghezza d'onda`], corretta: 2, spiegazione: R`Il ritmo dell'oscillazione si trasmette da un mezzo all'altro: la frequenza non cambia. La velocità dipende dal mezzo e cambia; quindi cambia anche $\lambda = v / f$.` },
    { id: 'q-07', domanda: R`Nella funzione d'onda $y = A \cdot \cos(k \cdot x - \omega \cdot t)$, che cosa dice il segno meno?`, opzioni: [R`Che l'ampiezza è negativa`, R`Che l'onda si smorza nel tempo`, R`Che l'onda è longitudinale`, R`Che l'onda va nel verso positivo dell'asse $x$`], corretta: 3, spiegazione: R`La cresta sta dove $k \cdot x - \omega \cdot t = 0$, cioè in $x = (\omega / k) \cdot t$: avanza verso le $x$ positive. Il segno non dice nulla su ampiezza, smorzamento o tipo di onda.` },
    { id: 'q-08', domanda: R`Due impulsi su una corda si vengono incontro e si attraversano. Dopo l'incontro…`, opzioni: [R`si annullano per sempre`, R`proseguono come prima, intatti`, R`si fondono in un impulso solo`, R`tornano indietro rimbalzando`], corretta: 1, spiegazione: R`Durante l'incontro gli spostamenti si sommano: è il principio di sovrapposizione. Poi ogni impulso prosegue con la sua forma, come se l'altro non ci fosse stato.` },
    { id: 'q-09', domanda: R`Due sorgenti in fase. In un punto la differenza di cammino vale $3 \cdot \lambda$. Che cosa succede?`, opzioni: [R`Interferenza distruttiva`, R`Dipende dalla frequenza`, R`Interferenza costruttiva`, R`Nessuna interferenza`], corretta: 2, spiegazione: R`Un numero intero di lunghezze d'onda: le onde arrivano cresta con cresta e si rinforzano. Per la distruttiva servirebbe una mezza lunghezza d'onda in più, come $2{,}5 \cdot \lambda$.` },
    { id: 'q-10', domanda: R`In un'onda stazionaria, quanto distano due nodi vicini?`, opzioni: [R`$\lambda / 2$`, R`$\lambda$`, R`$\lambda / 4$`, R`$2 \cdot \lambda$`], corretta: 0, spiegazione: R`Fra due nodi vicini c'è un ventre, e mezza lunghezza d'onda. $\lambda / 4$ è la distanza fra un nodo e il ventre vicino.` },
    { id: 'q-11', domanda: R`In un'onda stazionaria, che cos'è un ventre?`, opzioni: [R`Il punto più basso di un'onda`, R`Un punto della corda che resta sempre fermo`, R`Una cresta che corre lungo la corda`, R`Un punto che oscilla con l'ampiezza massima`], corretta: 3, spiegazione: R`Il ventre sta a metà fra due nodi e oscilla più di tutti, sempre nello stesso posto. I punti fermi sono i nodi; le creste che corrono sono delle onde viaggianti; il punto più basso di un'onda è la gola.` },
    { id: 'q-12', domanda: R`Una corda fissata ai due capi ha la fondamentale a 150 Hz. Quale di queste frequenze **non** può dare un'onda stazionaria su quella corda?`, opzioni: [R`300 Hz`, R`225 Hz`, R`450 Hz`, R`600 Hz`], corretta: 1, spiegazione: R`Le armoniche sono multipli interi della fondamentale: 150, 300, 450, 600 Hz… 225 Hz è 1,5 volte 150: non ci sta un numero intero di mezze onde.` },
    { id: 'q-13', domanda: R`Per abbassare la nota di una corda di chitarra si può…`, opzioni: [R`allentarla`, R`tenderla di più`, R`accorciarla premendo un tasto`, R`sostituirla con una corda più sottile`], corretta: 0, spiegazione: R`$f_1 = \dfrac{1}{2 \cdot \ell} \cdot \sqrt{F / \mu}$: con meno tensione la frequenza cala. Tendere, accorciare o usare una corda più leggera alzano la nota.` },
    { id: 'q-14', domanda: R`Perché si sente una persona che parla dietro l'angolo, ma non la si vede?`, opzioni: [R`Il suono viaggia anche nel vuoto, la luce no`, R`La luce è troppo veloce per girare l'angolo`, R`Il suono ha una lunghezza d'onda simile alle porte e fa diffrazione; la luce l'ha piccolissima`, R`Il suono rimbalza sulle nuvole`], corretta: 2, spiegazione: R`La diffrazione è forte quando l'apertura è paragonabile a $\lambda$: l'onda si apre come $\lambda / a$. Il suono ha $\lambda$ di decimetri o metri, la luce di mezzo micrometro. La velocità non c'entra.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Più frequenza non vuol dire onda più veloce. Nello stesso mezzo la velocità resta quella: cambia la lunghezza d'onda.` },
    { tipo: 'errore', testo: R`La tensione della corda è $F$, il periodo è $T$. Non mescolarli nella stessa formula.` },
    { tipo: 'errore', testo: R`Fra due nodi c'è mezza lunghezza d'onda, non una intera. Per trovare $\lambda$ si raddoppia la distanza fra i nodi.` },
    { tipo: 'trucco', testo: R`Quando un'onda cambia mezzo, chiediti che cosa resta uguale: la frequenza. Poi $\lambda = v / f$ nel nuovo mezzo.` },
    { tipo: 'trucco', testo: R`Nell'interferenza dividi la differenza di cammino per $\lambda$. Numero intero: costruttiva. Intero e mezzo: distruttiva.` },
    { tipo: 'metodo', testo: R`In una funzione d'onda leggi subito i tre numeri: $A$ davanti al coseno, $k$ davanti a $x$, $\omega$ davanti a $t$. Poi $\lambda = 2\pi / k$, $T = 2\pi / \omega$, $v = \omega / k$.` },
    { tipo: 'metodo', testo: R`Su una corda fissata ai due capi disegna i ventri: $n$ ventri sono $n$ mezze onde, quindi $\ell = n \cdot \lambda / 2$.` },
    { tipo: 'trucco', testo: R`Le unità aiutano: con $\mu$ in kg/m e $F$ in newton, $\sqrt{F / \mu}$ esce in m/s. I grammi al metro vanno prima divisi per mille.` }
  ],
  aneddoti: [
    { fisico: 'John Scott Russell', anni: '1808–1882', titolo: 'L\'onda inseguita a cavallo lungo il canale', testo: R`Nell'agosto del 1834 l'ingegnere scozzese John Scott Russell osservava una barca sull'Union Canal, vicino a Edimburgo. Due cavalli la tiravano lungo la riva. A un tratto la barca si fermò. L'acqua che la barca spingeva davanti a sé non si fermò: si raccolse in un'unica gobba e partì da sola. Era lunga circa nove metri e alta fra 30 e 45 centimetri. Russell la seguì a cavallo, a quattordici chilometri all'ora. L'onda non cambiava forma e non rallentava. La perse di vista dopo un paio di chilometri, fra le curve del canale. Per anni studiò queste onde in vasche costruite apposta. Trovò che la loro velocità dipende dalla profondità dell'acqua. Il racconto è nel suo *Report on Waves* del 1844.`, legame: R`Un'onda viaggia lontano portando energia, e la sua velocità la decide il mezzo: qui la profondità del canale.` },
    { fisico: 'Marin Mersenne', anni: '1588–1648', titolo: 'Le corde lunghe come una stanza', testo: R`Marin Mersenne era un frate dell'ordine dei Minimi, a Parigi. Scriveva lettere a tutti gli scienziati d'Europa, da Cartesio a Galileo, e faceva circolare le loro idee. Ma era anche uno sperimentatore paziente. Voleva sapere quante volte al secondo vibra una corda che suona una nota. Una corda di strumento vibra troppo in fretta per contare. Allora Mersenne tese corde lunghissime, che vibravano così piano da poter contare le oscillazioni a occhio. Poi accorciò le corde, e vide che la frequenza cresce in proporzione inversa alla lunghezza. Trovò anche come cambia con la tensione e con il peso della corda. Pubblicò tutto nell'*Harmonie universelle*, nel 1636. Fu tra i primi a dare la frequenza di una nota in numeri.`, legame: R`Sono le leggi della frequenza fondamentale, $f_1 = \dfrac{1}{2 \cdot \ell} \cdot \sqrt{F / \mu}$.` },
    { fisico: 'Joseph Sauveur', anni: '1653–1716', titolo: 'Il fondatore dell\'acustica che non sentiva', testo: R`Joseph Sauveur era nato a La Flèche, in Francia. Fino a sette anni non riuscì a parlare, e la sua voce restò sempre debole. Diventò un matematico stimato e insegnò a Parigi. Nel 1696 entrò nell'Accademia delle scienze. Si dedicò allo studio dei suoni, e inventò perfino il nome della disciplina: *acoustique*, acustica. Studiando le corde che vibrano, diede un nome ai punti che restano fermi e a quelli che oscillano di più: *nœuds* e *ventres*, nodi e ventri. Chiamò *fondamentale* il suono più basso di una corda e *armonici* gli altri. Il suo biografo Fontenelle scrisse che Sauveur non aveva «né voce né orecchio». Per giudicare i suoni, si faceva aiutare dalle orecchie dei musicisti.`, legame: R`Le parole nodo, ventre, fondamentale e armonica, che usiamo per le onde stazionarie, vengono da lui.` },
    { fisico: 'Inge Lehmann', anni: '1888–1993', titolo: 'Le onde che non dovevano arrivare', testo: R`Inge Lehmann era una sismologa danese. Studiava i terremoti lontani attraverso le onde che attraversano la Terra. Le onde P sono longitudinali, le onde S trasversali. Si sapeva già che le S non passano nel nucleo: un liquido non regge le onde trasversali. Si pensava quindi che il nucleo fosse tutto liquido. Ma studiando il grande terremoto della Nuova Zelanda del 1929, Lehmann notò una stranezza. In una zona dove non doveva arrivare nessuna onda P, arrivavano deboli onde P. Si racconta che tenesse i suoi dati su cartoncini, in scatole di fiocchi d'avena. Nel 1936 pubblicò la spiegazione in un articolo dal titolo brevissimo: «P′». Dentro il nucleo liquido c'è un nucleo interno solido. Visse fino a 104 anni.`, legame: R`Le onde trasversali e longitudinali si comportano diversamente nei mezzi: è così che si «vede» dentro la Terra.` }
  ]
});
})();
