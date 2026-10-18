/* Quanto — L'ottica geometrica (secondo anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/ottica.js
   Scelte: al secondo anno niente seni (SCHEMA-VIDEO §8): la legge di Snell si scrive con il cerchio, n1·a1 = n2·a2,
   dove a1 e a2 sono le distanze dalla normale dei punti in cui i raggi tagliano lo stesso cerchio; gli angoli si leggono
   sul disegno. Colori dei grafici come nei video: raggi arancio (2), specchi e lenti azzurri (1), immagini e fuochi
   viola (4), le distanze a1 e a2 verdi (3), oggetti e guide grigi. La natura della luce (onde, colori come lunghezze
   d'onda) è nell'argomento «luce». */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'ottica',
  titolo: 'L\'ottica geometrica',
  introduzione: R`L'**ottica geometrica** studia il cammino della luce con un'idea semplice: la luce viaggia lungo linee dritte, i **raggi**. Con i raggi si spiega perché ci vediamo allo specchio e perché una cannuccia nell'acqua sembra spezzata. Si capisce anche come funzionano gli occhiali, la lente d'ingrandimento, il microscopio e il cannocchiale.

Qui non ci chiediamo che cosa sia la luce, se un'onda o un flusso di particelle: quella domanda ha un argomento tutto suo, «La luce come onda». Ci basta sapere tre cose. La luce parte da una sorgente e va dritta. Quando incontra una superficie può tornare indietro, la **riflessione**. Quando entra in un altro materiale trasparente cambia direzione, la **rifrazione**.

Serve saper usare il goniometro, le frazioni e la notazione scientifica, e passare dai centimetri ai metri.`,
  inBreve: [
    R`La luce va **in linea retta** e non arriva in un istante: nel vuoto viaggia a $c \approx 3 \cdot 10^8\,\text{m/s}$.`,
    R`Nella **riflessione** l'angolo di riflessione è uguale all'angolo di incidenza, tutti e due misurati dalla normale. Lo specchio piano dà un'immagine virtuale, dritta, simmetrica.`,
    R`Per specchi curvi e lenti vale $\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$: con $q$ positiva l'immagine è reale, con $q$ negativa è virtuale.`,
    R`La luce si **rifrange** perché cambia velocità: $n = \dfrac{c}{v}$. Verso un mezzo con $n$ più grande si avvicina alla normale.`,
    R`Andando verso un mezzo con $n$ più piccolo, oltre l'**angolo limite** la luce si riflette tutta: è il principio delle fibre ottiche.`,
    R`Il miope si corregge con una lente divergente, l'ipermetrope con una convergente. La potenza è $P = \dfrac{1}{f}$, in diottrie, con $f$ in metri.`
  ],
  sezioni: [
    {
      id: 'propagazione',
      titolo: 'La luce va dritta, e molto veloce',
      testo: R`Accendi una torcia in una stanza con un po' di polvere: il fascio di luce è dritto. Per lo stesso motivo le ombre hanno contorni netti. Con gli oggetti di tutti i giorni la luce non gira attorno agli ostacoli. Lo fa solo con fessure sottilissime: lo vedrai in «La luce come onda».

>* In un mezzo uniforme, come l'aria, l'acqua o il vetro, la luce si propaga **in linea retta**. Un **raggio** è la linea che indica la direzione in cui viaggia.

Un corpo che lascia passare la luce è **trasparente**, come il vetro. Uno che la ferma è **opaco**, come il legno. Dietro un corpo opaco c'è l'**ombra**: la zona dove i raggi della sorgente non arrivano.

La luce è veloce, ma non arriva in un istante. Nel 1676 l'astronomo danese Ole Rømer se ne accorse guardando Io, una luna di Giove.

[[video:ottica/velocita-luce]]

Quando la Terra è lontana da Giove, la luce deve fare un tratto in più. Il ritardo delle eclissi è il tempo per percorrere quel tratto. Con i valori di oggi, il diametro dell'orbita della Terra è circa $3 \cdot 10^{11}$ m. Il ritardo è circa 1000 s.

~ c = \dfrac{\Delta s}{\Delta t} :: velocità uguale distanza diviso tempo
~ c = \dfrac{3 \cdot 10^{11}\,\text{m}}{1000\,\text{s}} :: il diametro dell'orbita, percorso in circa 16,7 minuti
~ c = \evidb{3 \cdot 10^{8}\,\text{m/s}} :: cioè 300 000 km al secondo

>* Nel vuoto la luce viaggia a $c \approx 3 \cdot 10^8\,\text{m/s}$, circa 300 000 km/s. Nell'aria va quasi alla stessa velocità.

Nel 1849 il francese Hippolyte Fizeau misurò $c$ sulla Terra, con una ruota dentata che girava veloce. Trovò un valore vicino. In un secondo la luce farebbe sette giri e mezzo attorno alla Terra.

>! Le cose lontane le vediamo come erano quando la loro luce è partita. Sulla Terra il ritardo è minuscolo, ma con il Sole e le stelle no.

?? La luce del Sole percorre circa $1{,}5 \cdot 10^{11}$ m per arrivare sulla Terra. Quanto tempo impiega?
[ ] zero secondi: la luce arriva subito
[ ] circa 8 secondi
[x] circa 500 secondi
=> $t = \dfrac{1{,}5 \cdot 10^{11}\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 500\,\text{s}$, cioè 8 minuti e 20 secondi.`
    },
    {
      id: 'riflessione',
      titolo: 'La riflessione e lo specchio piano',
      testo: R`Una palla lanciata contro il muro, senza effetto, rimbalza con la stessa inclinazione. La luce su uno specchio fa lo stesso.

Per misurare gli angoli si traccia la **normale**: la retta perpendicolare allo specchio nel punto in cui arriva il raggio. L'**angolo di incidenza** $i$ è quello fra il raggio incidente e la normale. L'**angolo di riflessione** $r$ è quello fra il raggio riflesso e la normale.

[[video:ottica/riflessione]]

>* **Leggi della riflessione.** Il raggio incidente, la normale e il raggio riflesso stanno nello stesso piano. L'angolo di riflessione è uguale all'angolo di incidenza: $r = i$.

[[grafico:riflessione]]

>! Gli angoli si misurano dalla normale, non dallo specchio. Un raggio che forma 30° con lo specchio ha un angolo di incidenza di 60°.

Un foglio di carta sembra liscio, ma visto da vicino è pieno di rilievi. Ogni pezzetto riflette con $r = i$, però i pezzetti sono inclinati in tutti i modi. Così la luce torna indietro in tutte le direzioni: è la **riflessione diffusa**. Per questo vediamo gli oggetti da ogni lato. Uno specchio invece è liscio, e i raggi paralleli restano paralleli.

Dalla fiamma di una candela partono raggi in tutte le direzioni. Alcuni si riflettono sullo specchio e arrivano all'occhio. L'occhio non sa che sono stati deviati: li prolunga dritti, dietro lo specchio. I prolungamenti si incontrano in un punto, e lì vediamo la fiamma.

>* Lo specchio piano dà un'immagine **virtuale**, **dritta** e **grande quanto l'oggetto**. È simmetrica rispetto allo specchio: sta dietro, alla stessa distanza dell'oggetto.

Esempio. Sei a 1,5 m dallo specchio. La tua immagine è 1,5 m dietro lo specchio: fra te e lei ci sono 3 m.

>! Virtuale non vuol dire finta: l'immagine si vede davvero. Però dietro lo specchio la luce non arriva, e un foglio messo lì resterebbe buio.

?? Ti allontani di 1 m dallo specchio. Di quanto cresce la distanza fra te e la tua immagine?
[ ] 1 m
[x] 2 m
[ ] 0,5 m
=> Anche l'immagine si allontana di 1 m, dall'altra parte dello specchio. In tutto la distanza cresce di 2 m.`
    },
    {
      id: 'specchi-curvi',
      titolo: 'Gli specchi curvi',
      testo: R`Guarda dentro un cucchiaio lucido: ti vedi piccolo e a testa in giù. L'interno del cucchiaio è uno **specchio concavo**.

Uno specchio concavo è un pezzo di sfera, lucido all'interno. Il centro della sfera è $C$, il raggio è $R$. La retta che passa per $C$ e per il centro dello specchio è l'**asse**.

>* Uno specchio concavo raccoglie i raggi paralleli all'asse, e vicini a esso, in un punto: il **fuoco** $F$. Il fuoco sta a metà fra lo specchio e $C$: la **distanza focale** è $f = \dfrac{R}{2}$.

[[video:ottica/specchio-concavo]]

Per trovare l'immagine di un oggetto bastano due di questi raggi, che partono dalla sua punta:

1. il raggio parallelo all'asse si riflette passando per il fuoco;
2. il raggio che passa per il fuoco si riflette parallelo all'asse;
3. il raggio che passa per $C$ torna indietro su se stesso.

Dove i raggi riflessi si incontrano c'è la punta dell'immagine. Si chiama $p$ la distanza dell'oggetto dallo specchio, $q$ quella dell'immagine.

>* **Equazione dei punti coniugati**: $\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$. Se $q$ è positiva l'immagine è **reale**, davanti allo specchio. Se $q$ è negativa l'immagine è **virtuale**, dietro lo specchio.

Il conto del video, con l'oggetto a 60 cm e la focale di 20 cm:

~ \dfrac{1}{q} = \dfrac{1}{f} - \dfrac{1}{p} :: ricavo $1/q$ dall'equazione
~ \dfrac{1}{q} = \dfrac{1}{20\,\text{cm}} - \dfrac{1}{60\,\text{cm}} :: metto i numeri
~ \dfrac{1}{q} = \dfrac{3 - 1}{60\,\text{cm}} = \dfrac{1}{30\,\text{cm}} :: denominatore comune 60 cm
~ q = \evidb{30\,\text{cm}} :: positiva: immagine reale, davanti allo specchio

L'**ingrandimento** è il rapporto fra l'altezza dell'immagine e quella dell'oggetto: $G = \dfrac{h'}{h} = \dfrac{|q|}{p}$. Qui $G = 30 / 60 = 0{,}5$: l'immagine è alta la metà, e capovolta.

[[grafico:specchio]]

Se l'oggetto sta fra il fuoco e lo specchio, i raggi riflessi si allargano. Si incontrano i loro prolungamenti, dietro lo specchio. L'immagine è virtuale, dritta e più grande: è lo specchio per truccarsi.

Uno specchio **convesso**, come il dorso del cucchiaio, allarga sempre i raggi. Dà immagini virtuali, dritte e più piccole, ma fa vedere un campo largo. Si usa negli specchietti delle auto e agli incroci. Nella formula la sua focale è negativa.

>! Una $q$ negativa non è un errore di conto. Vuol dire che l'immagine è virtuale, dall'altra parte dello specchio rispetto all'oggetto.

?? Uno specchio concavo ha raggio $R = 50\,\text{cm}$. A che distanza dallo specchio sta il fuoco?
[ ] 50 cm
[x] 25 cm
[ ] 100 cm
=> La focale è metà del raggio: $f = R/2 = 25\,\text{cm}$.`
    },
    {
      id: 'rifrazione',
      titolo: 'La rifrazione',
      testo: R`Metti una cannuccia in un bicchiere d'acqua. Sotto il pelo dell'acqua sembra piegata, eppure è dritta. Il trucco lo fa la luce, che passando dall'aria all'acqua cambia direzione.

>* La **rifrazione** è il cambio di direzione della luce quando passa da un mezzo trasparente a un altro.

La causa è la velocità: nell'acqua la luce va più piano che nell'aria.

>* L'**indice di rifrazione** di un mezzo è $n = \dfrac{c}{v}$, dove $v$ è la velocità della luce nel mezzo. Dice quante volte la luce è più lenta che nel vuoto. È un numero puro: aria circa 1, acqua circa 1,33, vetro circa 1,5.

~ v = \dfrac{c}{n} :: ricavo la velocità dalla definizione di $n$
~ v = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}33} :: nell'acqua
~ v \approx \evidb{2{,}26 \cdot 10^8\,\text{m/s}} :: circa 226 000 km/s

[[video:ottica/rifrazione]]

Gli angoli si misurano dalla normale: $\theta_1$ nel primo mezzo, $\theta_2$ nel secondo. Entrando in un mezzo con $n$ più grande, il raggio si **avvicina** alla normale. Uscendo verso un mezzo con $n$ più piccolo, si **allontana**. Un raggio perpendicolare alla superficie passa senza deviare.

### La legge di Snell, con un cerchio
Per sapere di quanto si piega la luce, si disegna un cerchio. Il centro sta nel punto in cui la luce entra. Il raggio del cerchio lo chiamiamo $\ell$, per non confonderlo con i raggi di luce. Il raggio incidente taglia il cerchio in un punto, a distanza $a_1$ dalla normale. Il raggio rifratto lo taglia in un altro punto, a distanza $a_2$.

>* **Legge di Snell**: $n_1 \cdot a_1 = n_2 \cdot a_2$. Le distanze $a_1$ e $a_2$ dalla normale si misurano sullo stesso cerchio.

Perché proprio queste distanze? Perché stanno fra loro come le velocità: $\dfrac{a_1}{a_2} = \dfrac{v_1}{v_2}$. Dove la luce è più lenta, il punto è più vicino alla normale.

Esempio: il raggio a 45° del video, su un cerchio con $\ell = 10$ cm. A 45° il triangolo è mezzo quadrato: $a_1 = \dfrac{10}{\sqrt{2}} \approx 7{,}1$ cm.

~ a_2 = \dfrac{n_1 \cdot a_1}{n_2} :: ricavo $a_2$ dalla legge di Snell
~ a_2 = \dfrac{1 \cdot 7{,}1\,\text{cm}}{1{,}33} \approx \evidb{5{,}3\,\text{cm}} :: in acqua il punto è più vicino alla normale
~ \theta_2 \approx 32^\circ :: l'angolo si misura sul disegno, con il goniometro

[[grafico:rifrazione]]

Torniamo alla cannuccia. I raggi che salgono dalla punta escono nell'aria e si allontanano dalla normale: l'occhio li prolunga dritti e vede la punta più in alto.

> Un bagnino corre sulla sabbia a 6 m/s e nuota a 2 m/s. Per raggiungere chi chiede aiuto corre di più sulla sabbia, dove è veloce, e nuota di meno. Anche la luce, fra due punti, segue il cammino che richiede meno tempo: è il **principio di Fermat**.

>! La luce non si piega perché «urta» la superficie, ma perché cambia velocità.

?? Un raggio passa dall'acqua all'aria, a 30° dalla normale. Nell'aria l'angolo con la normale è…
[ ] minore di 30°
[ ] uguale a 30°
[x] maggiore di 30°
=> Va verso un mezzo con $n$ più piccolo, quindi si allontana dalla normale: l'angolo cresce.`
    },
    {
      id: 'riflessione-totale',
      titolo: 'La riflessione totale',
      testo: R`Una lampada sul fondo di una piscina manda luce verso la superficie. Uscendo nell'aria il raggio si allontana dalla normale: l'angolo in aria è più grande di quello in acqua. Una piccola parte della luce, intanto, si riflette e torna giù. Se si inclina il raggio, a un certo punto quello uscito rade la superficie, a 90° dalla normale.

>* L'**angolo limite** $\theta_L$ è l'angolo di incidenza per cui il raggio rifratto esce a 90°. Oltre l'angolo limite la luce non esce più: si riflette tutta. È la **riflessione totale**.

[[video:ottica/riflessione-totale]]

L'angolo limite si trova con la legge di Snell e il cerchio. Quando il raggio esce radente, il suo punto sul cerchio dista dalla normale proprio $\ell$. Prendiamo l'acqua, $n_1 = 1{,}33$, verso l'aria, $n_2 = 1$, e un cerchio con $\ell = 10$ cm.

~ n_1 \cdot a_1 = n_2 \cdot a_2 :: la legge di Snell
~ 1{,}33 \cdot a_1 = 1 \cdot 10\,\text{cm} :: raggio radente: $a_2 = \ell = 10\,\text{cm}$
~ a_1 = \dfrac{10\,\text{cm}}{1{,}33} \approx \evidb{7{,}5\,\text{cm}} :: sul disegno corrisponde a $\theta_L \approx 49^\circ$

Se il raggio è più inclinato, $a_1$ supera 7,5 cm. La legge darebbe allora $a_2 = 1{,}33 \cdot a_1$, più di 10 cm. Ma nessun punto del cerchio dista dalla normale più di $\ell$. Il raggio rifratto non esiste, e la luce torna tutta indietro.

Dal vetro all'aria l'angolo limite è più piccolo, circa 42°. Nel diamante è circa 24°: per questo un diamante tagliato bene trattiene la luce e brilla.

[[grafico:totale]]

>! La riflessione totale succede solo andando verso un mezzo con $n$ **più piccolo**: dall'acqua all'aria, dal vetro all'aria. Dall'aria all'acqua il raggio si avvicina alla normale ed entra sempre.

Una **fibra ottica** è un filo di vetro sottile come un capello. La luce entra da un capo e batte sulla parete oltre l'angolo limite. Di rimbalzo in rimbalzo resta dentro, anche dove la fibra si piega, ed esce dall'altro capo. Così viaggiano internet e le telefonate, come lampi di luce. Le sonde con cui i medici guardano dentro lo stomaco usano la stessa idea.

?? Un raggio va dall'acqua verso l'aria con un angolo di 60° dalla normale. Che cosa succede?
[ ] esce, avvicinandosi alla normale
[ ] esce radente alla superficie
[x] si riflette tutto nell'acqua
=> 60° è oltre l'angolo limite dell'acqua, che è circa 49°: la luce non esce e torna tutta indietro.`
    },
    {
      id: 'dispersione',
      titolo: 'I colori: il prisma e l\'arcobaleno',
      testo: R`Un raggio di luce bianca entra in un prisma di vetro ed esce aperto a ventaglio: rosso, arancio, giallo, verde, azzurro, violetto. La luce bianca è un miscuglio di tutti questi colori, e il prisma li separa.

Il motivo è che l'indice di rifrazione cambia un poco con il colore. In un vetro comune il rosso ha $n \approx 1{,}51$, il violetto $n \approx 1{,}53$. Il violetto è un po' più lento, e si piega di più.

>* La **dispersione** è la separazione dei colori per rifrazione. Succede perché l'indice di rifrazione dipende dal colore: il violetto si piega più del rosso.

[[video:ottica/arcobaleno]]

In una goccia di pioggia succede la stessa cosa. La luce del Sole entra e si piega, si riflette sul fondo della goccia ed esce piegandosi di nuovo. Torna indietro verso il lato del Sole, con i colori separati. Il rosso esce a circa 42° dalla direzione opposta al Sole, il violetto a circa 40°.

>* L'arcobaleno si vede con il **Sole alle spalle**. Il rosso arriva dalle gocce a circa 42° dal punto opposto al Sole, il violetto da quelle a circa 40°. Per questo il rosso sta fuori e il violetto dentro.

Tutte le gocce che stanno a 42° da quel punto formano un cerchio. Il terreno ne nasconde una parte, e resta l'arco. Da un aereo, a volte, l'arcobaleno si vede intero, come un cerchio.

Se il Sole è più alto di 42°, l'arco resta tutto sotto l'orizzonte. Per questo l'arcobaleno si vede soprattutto al mattino e nel tardo pomeriggio.

>! Dentro la goccia la riflessione non è totale: gran parte della luce esce dal fondo e si perde. All'occhio arriva solo la parte riflessa, ma basta per vedere l'arco.

?? È pomeriggio, il Sole è basso a ovest e piove. Da che parte cerchi l'arcobaleno?
[x] verso est
[ ] verso ovest, vicino al Sole
[ ] proprio sopra la testa
=> L'arcobaleno sta dalla parte opposta al Sole: con il Sole a ovest, si guarda verso est.`
    },
    {
      id: 'lenti',
      titolo: 'Le lenti',
      testo: R`Una **lente** è un pezzo di vetro o di plastica trasparente, con le facce curve. La luce la attraversa e si rifrange due volte: entrando e uscendo.

Le lenti **convergenti** sono più spesse al centro che ai bordi. I raggi paralleli all'asse, e vicini a esso, dopo la lente passano tutti per un punto: il **fuoco** $F$. La sua distanza dalla lente è la **distanza focale** $f$. C'è un fuoco per parte, alla stessa distanza.

Le lenti **divergenti** sono più sottili al centro. Allargano i raggi paralleli, che dopo la lente sembrano venire da un fuoco dalla parte da cui arrivano.

>* Una lente convergente raccoglie i raggi paralleli nel fuoco: la sua focale è positiva. Una lente divergente li allarga: la sua focale è negativa.

[[video:ottica/lenti]]

Per costruire l'immagine si usano tre raggi dalla punta dell'oggetto:

1. il raggio parallelo all'asse esce passando per il fuoco dall'altra parte;
2. il raggio che passa per il centro della lente non devia;
3. il raggio che passa per il fuoco dalla parte dell'oggetto esce parallelo all'asse.

>* Per le lenti sottili vale la stessa equazione degli specchi: $\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$, con l'ingrandimento $G = \dfrac{|q|}{p}$. Con $q$ positiva l'immagine è reale, dall'altra parte della lente. Con $q$ negativa è virtuale, dalla parte dell'oggetto.

L'ultimo caso del video: focale 10 cm, oggetto a 6 cm, cioè dentro la focale.

~ \dfrac{1}{q} = \dfrac{1}{f} - \dfrac{1}{p} :: ricavo $1/q$ dall'equazione
~ \dfrac{1}{q} = \dfrac{1}{10\,\text{cm}} - \dfrac{1}{6\,\text{cm}} :: metto i numeri
~ \dfrac{1}{q} = \dfrac{3 - 5}{30\,\text{cm}} = -\dfrac{1}{15\,\text{cm}} :: denominatore comune 30 cm
~ q = \evidb{-15\,\text{cm}} :: negativa: immagine virtuale, dalla parte dell'oggetto
~ G = \dfrac{15\,\text{cm}}{6\,\text{cm}} = \evidb{2{,}5} :: dritta e ingrandita: è la lente d'ingrandimento

Dove va l'immagine dipende da dove sta l'oggetto. Per una lente convergente:

| oggetto | immagine |
|---|---|
| oltre $2f$ | reale, capovolta, più piccola |
| a $2f$ | reale, capovolta, grande uguale |
| fra $f$ e $2f$ | reale, capovolta, più grande |
| dentro $f$ | virtuale, dritta, più grande |

[[grafico:lente]]

>! Se copri metà lente, l'immagine non perde metà del disegno: resta intera, ma più scura. Ogni pezzo della lente riceve raggi da tutto l'oggetto.

?? Una lente convergente ha focale 5 cm. Un oggetto sta a 3 cm dalla lente. Com'è l'immagine?
[ ] reale e capovolta
[x] virtuale e dritta
[ ] non si forma nessuna immagine
=> L'oggetto è dentro la focale: i raggi escono divergenti, e l'immagine è virtuale, dritta e ingrandita.`
    },
    {
      id: 'occhio',
      titolo: 'L\'occhio e gli occhiali',
      testo: R`L'occhio funziona come una macchina fotografica. La cornea e il cristallino fanno da lente convergente. In fondo c'è la **retina**, dove deve formarsi l'immagine. Sulla retina l'immagine è reale e capovolta: è il cervello a raddrizzarla.

Per vedere nitido sia da vicino sia da lontano, l'occhio cambia la forma del cristallino. È l'**accomodazione**. Quando guarda lontano, l'occhio sano è rilassato.

[[video:ottica/occhio]]

>* Nell'occhio **miope** i raggi delle cose lontane si incontrano prima della retina, e da lontano vede sfocato. Si corregge con una lente **divergente**. Nell'occhio **ipermetrope** a riposo si incontrerebbero dietro la retina. Accomodando ci arriva, ma si stanca, e da vicino vede male. Si corregge con una lente **convergente**.

Sulla ricetta dell'oculista non c'è scritta la focale, ma la potenza.

>* La **potenza** di una lente è $P = \dfrac{1}{f}$, con $f$ in metri. Si misura in **diottrie** (D): $1\,\text{D} = 1\,\text{m}^{-1}$. Le lenti convergenti hanno diottrie positive, le divergenti negative.

~ f = -20\,\text{cm} = -0{,}20\,\text{m} :: la lente divergente del video, con la focale in metri
~ P = \dfrac{1}{-0{,}20\,\text{m}} :: la potenza è l'inverso della focale
~ P = \evidb{-5\,\text{D}} :: sulla ricetta: −5 diottrie, una miopia piuttosto forte

Più diottrie, in valore assoluto, vuol dire focale più corta, cioè una lente che piega di più i raggi.

>! Il miope vede bene da vicino e sfocato da lontano, non il contrario. È l'ipermetrope a faticare da vicino. Con l'età arriva anche la **presbiopia**: il cristallino si irrigidisce e non accomoda più bene. Allora per leggere servono lenti convergenti.

?? Sulla ricetta c'è scritto +4 diottrie. Che lente è?
[ ] divergente, con focale 4 m
[x] convergente, con focale 25 cm
[ ] convergente, con focale 4 cm
=> Il segno più dice convergente. $f = \dfrac{1}{P} = \dfrac{1}{4}\,\text{m} = 0{,}25\,\text{m} = 25\,\text{cm}$.`
    },
    {
      id: 'strumenti',
      titolo: 'Microscopio e cannocchiale',
      testo: R`La lente d'ingrandimento è una lente convergente con l'oggetto dentro la focale. Dà un'immagine virtuale, dritta e più grande, ma ingrandisce poco: di solito da 2 a 10 volte. Per ingrandire di più si mettono due lenti in fila.

>* In uno strumento con due lenti, l'immagine fatta dalla prima lente fa da **oggetto** per la seconda. Gli ingrandimenti si **moltiplicano**: $G = G_1 \cdot G_2$.

[[video:ottica/strumenti]]

Il **microscopio** ha due lenti convergenti. L'**obiettivo**, vicino all'oggetto, ha una focale corta. L'oggetto sta appena oltre il suo fuoco, e l'obiettivo ne fa un'immagine reale, capovolta e più grande. L'**oculare**, vicino all'occhio, guarda quell'immagine come una lente d'ingrandimento.

Il conto del video: obiettivo con $f_1 = 2\,\text{cm}$, oggetto a 3 cm. L'oculare ha $f_2 = 4\,\text{cm}$, e l'immagine dell'obiettivo gli sta a 3 cm, dentro il suo fuoco.

~ \dfrac{1}{q_1} = \dfrac{1}{2\,\text{cm}} - \dfrac{1}{3\,\text{cm}} = \dfrac{1}{6\,\text{cm}} :: l'obiettivo fa l'immagine a 6 cm
~ G_1 = \dfrac{6\,\text{cm}}{3\,\text{cm}} = 2 :: reale, capovolta, alta il doppio
~ \dfrac{1}{q_2} = \dfrac{1}{4\,\text{cm}} - \dfrac{1}{3\,\text{cm}} :: l'oculare: $f_2 = 4\,\text{cm}$, oggetto a 3 cm
~ \dfrac{1}{q_2} = -\dfrac{1}{12\,\text{cm}} :: immagine virtuale, a 12 cm
~ G_2 = \dfrac{12\,\text{cm}}{3\,\text{cm}} = 4 :: e la ingrandisce ancora
~ G = G_1 \cdot G_2 = \evidb{8} :: gli ingrandimenti si moltiplicano

Sui microscopi è scritto l'ingrandimento di ogni lente: un obiettivo 40× con un oculare 10× ingrandisce 400 volte.

Il **cannocchiale** serve a guardare cose lontanissime. L'obiettivo ha una focale lunga e raccoglie i raggi quasi paralleli in una piccola immagine reale, nel suo fuoco. Lì c'è anche il fuoco dell'oculare, che ha una focale corta e fa da lente d'ingrandimento. I raggi escono di nuovo paralleli, ma più inclinati: l'oggetto si vede sotto un angolo più grande. Con due lenti convergenti l'immagine resta capovolta, ma per guardare le stelle non importa.

>* Nel cannocchiale l'ingrandimento è $G = \dfrac{f_1}{f_2}$: la focale dell'obiettivo divisa per quella dell'oculare. Nel video l'obiettivo ha $f_1 = 12$ cm e l'oculare $f_2 = 3$ cm: $G = 12/3 = 4$.

>! Il cannocchiale non porta l'oggetto più vicino: lo fa vedere sotto un angolo più grande. E con l'obiettivo largo raccoglie molta più luce della pupilla. Per questo mostra stelle che a occhio nudo non si vedono.

?? Un cannocchiale ha l'obiettivo con focale 1 m e l'oculare con focale 2 cm. Quanto ingrandisce?
[ ] 2 volte
[ ] 0,5 volte
[x] 50 volte
=> Con le focali nella stessa unità: $G = \dfrac{f_1}{f_2} = \dfrac{100\,\text{cm}}{2\,\text{cm}} = 50$.`
    }
  ],
  grafici: {
    /* le leggi della riflessione: il raggio riflesso è il simmetrico dell'incidente rispetto alla normale */
    riflessione: {
      tipo: 'piano', x: [-1.25, 1.25], y: [-0.32, 1.25], assi: false, griglia: false,
      parametri: [{ nome: 'th', min: 10, max: 80, passo: 5, valore: 40, etichetta: 'i (gradi)' }],
      elementi: [
        { tipo: 'poligono', punti: [[-1.2, 0], [1.2, 0], [1.2, -0.07], [-1.2, -0.07]], colore: 1 },
        { tipo: 'segmento', da: [0, 0], a: [0, 1.15], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [0, 1], a: ['-sin(th*pi/180)', 'cos(th*pi/180)'], raggio: 0.3, colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [0, 1], a: ['sin(th*pi/180)', 'cos(th*pi/180)'], raggio: 0.3, colore: 'grigio' },
        { tipo: 'segmento', da: ['-sin(th*pi/180)', 'cos(th*pi/180)'], a: [0, 0], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 0], a: ['sin(th*pi/180)', 'cos(th*pi/180)'], colore: 2, freccia: true },
        { tipo: 'testo', p: [0.04, 1.19], testo: 'normale', ancora: 'start' },
        { tipo: 'testo', p: [-0.55, -0.24], testo: 'i = {{th}}°', colore: 2 },
        { tipo: 'testo', p: [0.55, -0.24], testo: 'r = {{th}}°', colore: 2 }
      ],
      didascalia: 'Un raggio arriva sullo specchio e si riflette. Cambiando l\'angolo di incidenza i, l\'angolo di riflessione r resta sempre uguale. Tutti e due si misurano dalla normale tratteggiata.'
    },
    /* specchio concavo con f = 15 cm (C a 30 cm), oggetto alto 5 cm a distanza p: q = 15·p/(p − 15).
       p va a passi di 2 da 4 cm, quindi non vale mai 15 (immagine all'infinito). I tratti con sqrt(se(…, 0, −1))
       valgono NaN quando la condizione è falsa, e il motore non li disegna: un pezzo per l'immagine reale, uno per quella virtuale. */
    specchio: {
      tipo: 'piano', x: [-65, 35], y: [-16, 16], assi: false, griglia: false, proporzioni: 'libere', altezza: 600,
      parametri: [{ nome: 'p', min: 4, max: 40, passo: 2, valore: 40, etichetta: 'p (cm)' }],
      elementi: [
        { tipo: 'segmento', da: [-65, 0], a: [35, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [0, -11], a: [0, 11], colore: 1 },
        { tipo: 'segmento', da: [0, 11], a: [-1.8, 12.8], colore: 1 },
        { tipo: 'segmento', da: [0, -11], a: [-1.8, -12.8], colore: 1 },
        { tipo: 'segmento', da: ['-p', 0], a: ['-p', 5], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: ['-p', 5], a: [0, 5], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 5], a: [-60, -15], colore: 2, freccia: true },
        { tipo: 'segmento', da: ['-p', 5], a: [0, '-75/(p - 15)'], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, '-75/(p - 15)'], a: [-64, '-75/(p - 15)'], colore: 2, freccia: true },
        { tipo: 'segmento', da: ['se(p < 15, 0, 1000)', 5], a: ['se(p < 15, -15*p/(p - 15), 1000)', '-75/(p - 15)'], colore: 2, tratteggio: true },
        { tipo: 'segmento', da: ['se(p < 15, 0, 1000)', '-75/(p - 15)'], a: ['se(p < 15, -15*p/(p - 15), 1000)', '-75/(p - 15)'], colore: 2, tratteggio: true },
        { tipo: 'segmento', da: ['-15*p/(p - 15) + sqrt(se(p > 15, 0, -1))', 0], a: ['-15*p/(p - 15)', '-75/(p - 15)'], colore: 4, freccia: true },
        { tipo: 'segmento', da: ['-15*p/(p - 15) + sqrt(se(p < 15, 0, -1))', 0], a: ['-15*p/(p - 15)', '-75/(p - 15)'], colore: 4, tratteggio: true, freccia: true },
        { tipo: 'testo', p: [34, -14.5], testo: 'q = {{15*p/(p - 15)|0}} cm', ancora: 'end', colore: 4 }
      ],
      punti: [
        { x: -15, y: 0, etichetta: 'F', posizione: 'basso', colore: 4 },
        { x: -30, y: 0, etichetta: 'C', posizione: 'basso', colore: 'grigio' }
      ],
      didascalia: 'Specchio concavo con focale 15 cm; l\'oggetto grigio è alto 5 cm. Il raggio parallelo all\'asse torna passando per F, quello che passa per F torna parallelo. Oltre il fuoco l\'immagine (viola) è reale e capovolta; dentro il fuoco è virtuale, dritta e dietro lo specchio, e si incontrano i prolungamenti tratteggiati. Vicino al fuoco l\'immagine è lontanissima ed enorme, ed esce dal disegno.'
    },
    /* la legge di Snell con il cerchio: il cerchio vale 10 cm, a1 e a2 sono le distanze dalla normale;
       a2 = a1/n (dall'aria). Gli angoli sono calcolati dal motore, ma sullo schermo restano solo i segmenti */
    rifrazione: {
      tipo: 'piano', x: [-1.3, 1.3], y: [-1.32, 1.3], assi: false, griglia: false,
      parametri: [
        { nome: 'th', min: 0, max: 85, passo: 5, valore: 45, etichetta: 'θ_1 (gradi)' },
        { nome: 'n', min: 1, max: 2, passo: 0.01, valore: 1.33, decimali: 2, etichetta: 'n_2' }
      ],
      elementi: [
        { tipo: 'poligono', punti: [[-1.3, 0], [1.3, 0], [1.3, -1.32], [-1.3, -1.32]], colore: 1 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 1, colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, -1.2], a: [0, 1.2], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [0, 1], a: ['-sin(th*pi/180)', 'cos(th*pi/180)'], raggio: 0.28, colore: 'grigio', etichetta: 'θ_1' },
        { tipo: 'angolo', vertice: [0, 0], da: [0, -1], a: ['sin(th*pi/180)/n', '-sqrt(1 - (sin(th*pi/180)/n)^2)'], raggio: 0.28, colore: 'grigio', etichetta: 'θ_2' },
        { tipo: 'segmento', da: ['-sin(th*pi/180)', 'cos(th*pi/180)'], a: [0, 'cos(th*pi/180)'], colore: 3 },
        { tipo: 'segmento', da: [0, '-sqrt(1 - (sin(th*pi/180)/n)^2)'], a: ['sin(th*pi/180)/n', '-sqrt(1 - (sin(th*pi/180)/n)^2)'], colore: 3 },
        { tipo: 'segmento', da: ['-sin(th*pi/180)', 'cos(th*pi/180)'], a: [0, 0], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 0], a: ['sin(th*pi/180)/n', '-sqrt(1 - (sin(th*pi/180)/n)^2)'], colore: 2, freccia: true },
        { tipo: 'testo', p: [-1.25, 1.22], testo: 'a_1 = {{10*sin(th*pi/180)|1}} cm', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [1.25, -1.27], testo: 'a_2 = {{10*sin(th*pi/180)/n|1}} cm', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [1.25, 1.04], testo: 'aria, n_1 = 1', ancora: 'end' },
        { tipo: 'testo', p: [-1.25, -1.09], testo: 'n_2 = {{n|2}}', ancora: 'start' }
      ],
      didascalia: 'Il cerchio tratteggiato ha raggio ℓ = 10 cm. I segmenti verdi sono le distanze dalla normale: a₂ = a₁ / n₂, cioè n₁·a₁ = n₂·a₂. Con n₂ = 1,33 sotto c\'è acqua, con 1,5 vetro: più n₂ è grande, più il raggio si avvicina alla normale.'
    },
    /* dall'acqua (n = 1,33) all'aria: il raggio esce finché 1,33·a1 < 1 (cerchio di raggio 1), poi riflessione totale.
       Riflesso tratteggiato quando è solo una piccola parte della luce, pieno quando è tutta */
    totale: {
      tipo: 'piano', x: [-1.3, 1.3], y: [-1.32, 1.3], assi: false, griglia: false,
      parametri: [{ nome: 'th', min: 0, max: 80, passo: 1, valore: 35, etichetta: 'θ_1 (gradi)' }],
      elementi: [
        { tipo: 'poligono', punti: [[-1.3, 0], [1.3, 0], [1.3, -1.32], [-1.3, -1.32]], colore: 1 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 1, colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, -1.2], a: [0, 1.2], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [0, -1], a: ['-sin(th*pi/180)', '-cos(th*pi/180)'], raggio: 0.28, colore: 'grigio', etichetta: 'θ_1' },
        { tipo: 'segmento', da: ['-sin(th*pi/180)', '-cos(th*pi/180)'], a: [0, '-cos(th*pi/180)'], colore: 3 },
        { tipo: 'segmento', da: [0, 'se(1.33*sin(th*pi/180) < 1, sqrt(max(0, 1 - (1.33*sin(th*pi/180))^2)), 50)'], a: ['se(1.33*sin(th*pi/180) < 1, 1.33*sin(th*pi/180), 0)', 'se(1.33*sin(th*pi/180) < 1, sqrt(max(0, 1 - (1.33*sin(th*pi/180))^2)), 50)'], colore: 3 },
        { tipo: 'segmento', da: ['-sin(th*pi/180)', '-cos(th*pi/180)'], a: [0, 0], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 0], a: ['1.33*sin(th*pi/180)', 'sqrt(1 - (1.33*sin(th*pi/180))^2)'], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 0], a: ['sin(th*pi/180) + sqrt(se(1.33*sin(th*pi/180) < 1, 0, -1))', '-cos(th*pi/180)'], colore: 2, tratteggio: true, freccia: true },
        { tipo: 'segmento', da: [0, 0], a: ['sin(th*pi/180) + sqrt(se(1.33*sin(th*pi/180) >= 1, 0, -1))', '-cos(th*pi/180)'], colore: 2, freccia: true },
        { tipo: 'testo', p: [1.25, 1.22], testo: '{{? 1.33*sin(th*pi/180) < 1 | la luce esce | riflessione totale}}', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [1.25, 1.04], testo: 'aria, n = 1', ancora: 'end' },
        { tipo: 'testo', p: [-1.25, -1.22], testo: 'acqua, n = 1,33', ancora: 'start' },
        { tipo: 'testo', p: [1.25, -1.22], testo: 'a_1 = {{10*sin(th*pi/180)|1}} cm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una lampada sott\'acqua manda un raggio verso la superficie. Finché il raggio esce, una piccola parte si riflette (tratteggio). Oltre l\'angolo limite, circa 49°, la luce non esce più e si riflette tutta: con a₁ oltre 7,5 cm, a₂ = 1,33·a₁ dovrebbe superare il raggio del cerchio (10 cm), e il raggio rifratto non c\'è.'
    },
    /* lente convergente con f = 10 cm, oggetto alto 4 cm a distanza p (dispari: mai 10): q = 10·p/(p − 10).
       Raggio 1 parallelo e poi per F (y = 4 − 0,4·x), raggio 2 per il centro; immagine reale o virtuale con il trucco NaN */
    lente: {
      tipo: 'piano', x: [-42, 45], y: [-14, 14], assi: false, griglia: false, proporzioni: 'libere', altezza: 600,
      parametri: [{ nome: 'p', min: 5, max: 39, passo: 2, valore: 25, etichetta: 'p (cm)' }],
      elementi: [
        { tipo: 'segmento', da: [-42, 0], a: [45, 0], colore: 'grigio' },
        { tipo: 'ellisse', centro: [0, 0], a: 1.2, b: 11, colore: 1 },
        { tipo: 'segmento', da: ['-p', 0], a: ['-p', 4], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: ['-p', 4], a: [0, 4], colore: 2, freccia: true },
        { tipo: 'segmento', da: [0, 4], a: [40, -12], colore: 2, freccia: true },
        { tipo: 'segmento', da: ['-p', 4], a: ['min(40, 3.25*p)', '-4*min(40, 3.25*p)/p'], colore: 2, freccia: true },
        { tipo: 'segmento', da: ['se(p < 10, 0, 1000)', 4], a: ['se(p < 10, 10*p/(p - 10), 1000)', '-40/(p - 10)'], colore: 2, tratteggio: true },
        { tipo: 'segmento', da: ['se(p < 10, -p, 1000)', 4], a: ['se(p < 10, 10*p/(p - 10), 1000)', '-40/(p - 10)'], colore: 2, tratteggio: true },
        { tipo: 'segmento', da: ['10*p/(p - 10) + sqrt(se(p > 10, 0, -1))', 0], a: ['10*p/(p - 10)', '-40/(p - 10)'], colore: 4, freccia: true },
        { tipo: 'segmento', da: ['10*p/(p - 10) + sqrt(se(p < 10, 0, -1))', 0], a: ['10*p/(p - 10)', '-40/(p - 10)'], colore: 4, tratteggio: true, freccia: true },
        { tipo: 'testo', p: [-41, -12.5], testo: 'q = {{10*p/(p - 10)|1}} cm', ancora: 'start', colore: 4 }
      ],
      punti: [
        { x: -10, y: 0, etichetta: 'F', posizione: 'basso', colore: 4 },
        { x: 10, y: 0, etichetta: 'F', posizione: 'basso', colore: 4 },
        { x: -20, y: 0, etichetta: '2F', posizione: 'alto', colore: 'grigio' },
        { x: 20, y: 0, etichetta: '2F', posizione: 'alto', colore: 'grigio' }
      ],
      didascalia: 'Lente convergente con focale 10 cm; l\'oggetto grigio è alto 4 cm. Il raggio parallelo all\'asse esce passando per F, quello per il centro non devia. Oltre F l\'immagine è reale e capovolta, dall\'altra parte; dentro F è virtuale e dritta, dove si incontrano i prolungamenti tratteggiati. Vicino al fuoco l\'immagine è lontanissima ed enorme, ed esce dal disegno.'
    }
  },
  esempi: [
    {
      titolo: 'La distanza della Luna con un laser',
      problema: R`Nel 1969 gli astronauti dell'Apollo 11 lasciarono sulla Luna un pannello di catarifrangenti, prismi che rimandano la luce indietro da dove arriva. Da Terra si manda un impulso laser verso il pannello e si aspetta il ritorno: arriva dopo circa 2,56 s. Quanto dista la Luna?`,
      passi: [
        R`Dati: tempo di andata e ritorno $\Delta t = 2{,}56\,\text{s}$, $c = 3 \cdot 10^8\,\text{m/s}$. Cerco la distanza $D$ fra Terra e Luna.`,
        R`La luce va e torna: in 2,56 s percorre due volte la distanza. Lo spazio fatto in tutto è $c \cdot \Delta t$.`,
        R`$2 \cdot D = c \cdot \Delta t = 3 \cdot 10^8\,\text{m/s} \cdot 2{,}56\,\text{s} = 7{,}68 \cdot 10^8\,\text{m}$.`,
        R`$D = \dfrac{7{,}68 \cdot 10^8\,\text{m}}{2} = 3{,}84 \cdot 10^8\,\text{m}$, cioè circa 384 000 km.`,
        R`Controllo: è la distanza media della Luna che si trova sui libri. Torna.`
      ],
      risultato: R`$D \approx 3{,}84 \cdot 10^8\,\text{m}$, circa 384 000 km.`
    },
    {
      titolo: 'Lo specchio per vedersi interi',
      problema: R`Marta è alta 1,60 m e i suoi occhi sono a 1,50 m da terra. Vuole vedersi tutta, dai piedi alla testa, in uno specchio appeso alla parete. Quanto deve essere alto, come minimo, lo specchio? A che altezza da terra va il suo bordo inferiore?`,
      passi: [
        R`Dati: altezza di Marta $h = 1{,}60\,\text{m}$, occhi a $h_o = 1{,}50\,\text{m}$ da terra. Cerco l'altezza minima $L$ dello specchio e l'altezza $y$ del suo bordo inferiore.`,
        R`Il raggio che parte dai piedi deve arrivare agli occhi dopo la riflessione. Con $r = i$ si riflette a metà altezza fra i piedi e gli occhi: $1{,}50 / 2 = 0{,}75\,\text{m}$ da terra. Lì va il bordo inferiore.`,
        R`Il raggio che parte dalla cima della testa si riflette a metà fra la testa e gli occhi: $(1{,}60 + 1{,}50) / 2 = 1{,}55\,\text{m}$ da terra. Lì va il bordo superiore.`,
        R`Altezza dello specchio: $1{,}55\,\text{m} - 0{,}75\,\text{m} = 0{,}80\,\text{m}$, cioè metà dell'altezza di Marta.`,
        R`Controllo: la distanza dallo specchio non è mai entrata nel conto. Marta si vede intera da vicino e da lontano.`
      ],
      risultato: R`Specchio alto $0{,}80\,\text{m}$, con il bordo inferiore a $0{,}75\,\text{m}$ da terra.`
    },
    {
      titolo: 'Lo specchio per truccarsi',
      problema: R`Uno specchio concavo ha raggio di curvatura 60 cm. Giulia avvicina il viso a 20 cm dallo specchio. Dove si forma l'immagine? Quante volte è ingrandita?`,
      passi: [
        R`Dati: $R = 60\,\text{cm}$, $p = 20\,\text{cm}$. Cerco la posizione $q$ dell'immagine e l'ingrandimento $G$.`,
        R`La focale è metà del raggio: $f = 30\,\text{cm}$. Il viso sta dentro la focale: mi aspetto un'immagine virtuale.`,
        R`$\dfrac{1}{q} = \dfrac{1}{30\,\text{cm}} - \dfrac{1}{20\,\text{cm}} = \dfrac{2 - 3}{60\,\text{cm}} = -\dfrac{1}{60\,\text{cm}}$, quindi $q = -60\,\text{cm}$.`,
        R`$q$ è negativa: l'immagine è virtuale e dritta, 60 cm dietro lo specchio.`,
        R`$G = \dfrac{|q|}{p} = \dfrac{60\,\text{cm}}{20\,\text{cm}} = 3$: il viso appare tre volte più grande.`,
        R`Controllo con l'equazione: $\dfrac{1}{20} - \dfrac{1}{60} = \dfrac{3 - 1}{60} = \dfrac{1}{30}$. Torna.`
      ],
      risultato: R`$q = -60\,\text{cm}$ (virtuale, dietro lo specchio), $G = 3$.`
    },
    {
      titolo: 'Dall\'aria al vetro',
      problema: R`Un raggio di luce passa dall'aria a un blocco di vetro con $n = 1{,}50$. Si disegna un cerchio di raggio 10 cm con il centro nel punto d'ingresso: il raggio in aria lo taglia a 6,0 cm dalla normale. A che distanza dalla normale passa il raggio nel vetro? Quanto è veloce la luce nel vetro?`,
      passi: [
        R`Dati: $n_1 = 1$ (aria), $n_2 = 1{,}50$, $a_1 = 6{,}0\,\text{cm}$. Cerco $a_2$ e la velocità $v$ della luce nel vetro.`,
        R`Legge di Snell: $n_1 \cdot a_1 = n_2 \cdot a_2$, quindi $a_2 = \dfrac{n_1 \cdot a_1}{n_2}$.`,
        R`$a_2 = \dfrac{1 \cdot 6{,}0\,\text{cm}}{1{,}50} = 4{,}0\,\text{cm}$. Il raggio si avvicina alla normale, come deve: sul disegno gli angoli sono circa 37° e 24°.`,
        R`Velocità: $v = \dfrac{c}{n} = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}50} = 2 \cdot 10^8\,\text{m/s}$.`,
        R`Controllo: la luce è 1,50 volte più lenta e la distanza dalla normale 1,50 volte più piccola: $6{,}0 / 4{,}0 = 1{,}50$. Torna.`
      ],
      risultato: R`$a_2 = 4{,}0\,\text{cm}$, $v = 2 \cdot 10^8\,\text{m/s}$.`
    },
    {
      titolo: 'Il proiettore di diapositive',
      problema: R`In un proiettore una lente convergente di focale 5,0 cm sta a 5,2 cm da una diapositiva alta 2,4 cm. A che distanza dalla lente va messo lo schermo? Quanto è alta l'immagine sullo schermo?`,
      passi: [
        R`Dati: $f = 5{,}0\,\text{cm}$, $p = 5{,}2\,\text{cm}$, $h = 2{,}4\,\text{cm}$. Cerco $q$ e l'altezza $h'$ dell'immagine.`,
        R`La diapositiva è appena oltre il fuoco, fra $f$ e $2f$: mi aspetto un'immagine reale, capovolta e molto più grande.`,
        R`$\dfrac{1}{q} = \dfrac{1}{5{,}0\,\text{cm}} - \dfrac{1}{5{,}2\,\text{cm}} = \dfrac{5{,}2 - 5{,}0}{5{,}0 \cdot 5{,}2}\,\text{cm}^{-1} = \dfrac{0{,}2}{26}\,\text{cm}^{-1} = \dfrac{1}{130\,\text{cm}}$.`,
        R`Quindi $q = 130\,\text{cm}$: lo schermo va a 1,3 m dalla lente.`,
        R`$G = \dfrac{130\,\text{cm}}{5{,}2\,\text{cm}} = 25$, e $h' = 25 \cdot 2{,}4\,\text{cm} = 60\,\text{cm}$. L'immagine è capovolta: per questo la diapositiva si infila a testa in giù.`,
        R`Controllo: $\dfrac{1}{5{,}2} + \dfrac{1}{130} = \dfrac{25 + 1}{130} = \dfrac{26}{130} = \dfrac{1}{5}$. Torna.`
      ],
      risultato: R`Schermo a $130\,\text{cm}$ dalla lente; immagine alta $60\,\text{cm}$, capovolta.`
    },
    {
      titolo: 'Gli occhiali del miope',
      problema: R`Un ragazzo miope vede nitido solo fino a 50 cm dagli occhi: più lontano vede sfocato. Che lente gli serve per vedere bene le cose lontane? Di quante diottrie? (Trascura la distanza fra la lente e l'occhio.)`,
      passi: [
        R`Dati: punto più lontano visto nitido a $d = 50\,\text{cm}$. Cerco la focale $f$ della lente e la sua potenza $P$.`,
        R`Da un oggetto lontanissimo arrivano raggi paralleli. La lente deve farne un'immagine virtuale a 50 cm, dove l'occhio vede ancora nitido.`,
        R`I raggi paralleli vanno nel fuoco. Serve allora un fuoco a 50 cm, dalla parte da cui arriva la luce: è una lente divergente con $f = -50\,\text{cm}$.`,
        R`In metri $f = -0{,}50\,\text{m}$, e $P = \dfrac{1}{f} = \dfrac{1}{-0{,}50\,\text{m}} = -2\,\text{D}$.`,
        R`Controllo con l'equazione: per un oggetto lontanissimo $\dfrac{1}{p}$ è quasi zero, quindi $\dfrac{1}{q} = \dfrac{1}{f}$ e $q = -50\,\text{cm}$. Torna.`
      ],
      risultato: R`Una lente divergente da $-2$ diottrie ($f = -50\,\text{cm}$).`
    }
  ],
  formulario: [
    { nome: 'Velocità della luce nel vuoto', formula: R`c \approx 3 \cdot 10^8\,\text{m/s}`, nota: R`Circa 300 000 km/s. Nell'aria è quasi la stessa.` },
    { nome: 'Legge della riflessione', formula: R`r = i`, nota: R`Angoli misurati dalla normale. Raggio incidente, normale e raggio riflesso stanno nello stesso piano.` },
    { nome: 'Fuoco di uno specchio sferico', formula: R`f = \dfrac{R}{2}`, nota: R`Specchio concavo: $f$ positiva. Specchio convesso: $f$ negativa.` },
    { nome: 'Equazione dei punti coniugati', formula: R`\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}`, nota: R`Per specchi curvi e lenti sottili. $q > 0$: immagine reale; $q < 0$: immagine virtuale.` },
    { nome: 'Ingrandimento', formula: R`G = \dfrac{h'}{h} = \dfrac{|q|}{p}`, nota: R`Altezza dell'immagine diviso altezza dell'oggetto. È un numero puro.` },
    { nome: 'Indice di rifrazione', formula: R`n = \dfrac{c}{v}`, nota: R`Numero puro, maggiore di 1. Aria circa 1, acqua circa 1,33, vetro circa 1,5.` },
    { nome: 'Legge di Snell, con il cerchio', formula: R`n_1 \cdot a_1 = n_2 \cdot a_2`, nota: R`$a_1$ e $a_2$: distanze dalla normale dei punti in cui i due raggi tagliano lo stesso cerchio.` },
    { nome: 'Angolo limite', formula: R`a_1 = \dfrac{n_2}{n_1} \cdot \ell`, nota: R`$a_1$ è la distanza dalla normale del raggio incidente all'angolo limite; $\ell$ è il raggio del cerchio. L'angolo si legge sul disegno. Vale solo verso un mezzo con $n$ più piccolo.` },
    { nome: 'Potenza di una lente', formula: R`P = \dfrac{1}{f}`, nota: R`Con $f$ in metri, in diottrie (D). Convergente: positiva; divergente: negativa.` },
    { nome: 'Microscopio', formula: R`G = G_1 \cdot G_2`, nota: R`Ingrandimento dell'obiettivo per ingrandimento dell'oculare.` },
    { nome: 'Cannocchiale', formula: R`G = \dfrac{f_1}{f_2}`, nota: R`Focale dell'obiettivo diviso focale dell'oculare, nella stessa unità.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'propagazione', tipo: 'definizione', fronte: R`Che cos'è un **raggio** di luce?`, retro: R`La linea che indica la direzione in cui la luce viaggia. In un mezzo uniforme è una retta.` },
    { id: 'fc-02', sezione: 'propagazione', tipo: 'formula', fronte: R`Quanto vale la **velocità della luce** nel vuoto?`, retro: R`$c \approx 3 \cdot 10^8\,\text{m/s}$, circa 300 000 km/s.` },
    { id: 'fc-03', sezione: 'propagazione', tipo: 'concetto', fronte: R`Come capì Rømer che la luce non arriva in un istante?`, retro: R`Le eclissi di Io, una luna di Giove, arrivavano in ritardo quando la Terra era lontana da Giove: la luce doveva fare un tratto in più.` },
    { id: 'fc-04', sezione: 'riflessione', tipo: 'definizione', fronte: R`Che cos'è la **normale** in un punto di uno specchio?`, retro: R`La retta perpendicolare alla superficie in quel punto. Da lì si misurano gli angoli.` },
    { id: 'fc-05', sezione: 'riflessione', tipo: 'formula', fronte: R`Le **leggi della riflessione**`, retro: R`Incidente, normale e riflesso stanno nello stesso piano; l'angolo di riflessione è uguale a quello di incidenza: $r = i$.` },
    { id: 'fc-06', sezione: 'riflessione', tipo: 'concetto', fronte: R`Perché vediamo un foglio da tutti i lati, ma non ci specchiamo?`, retro: R`La superficie è ruvida: ogni pezzetto riflette con $r = i$, ma in direzioni diverse. È la riflessione diffusa.` },
    { id: 'fc-07', sezione: 'riflessione', tipo: 'concetto', fronte: R`Com'è l'immagine in uno **specchio piano**?`, retro: R`Virtuale, dritta, grande quanto l'oggetto, simmetrica: dietro lo specchio, alla stessa distanza.` },
    { id: 'fc-08', sezione: 'specchi-curvi', tipo: 'definizione', fronte: R`Differenza fra immagine **reale** e **virtuale**`, retro: R`Reale: i raggi passano davvero di lì, e si può raccogliere su uno schermo. Virtuale: si incontrano solo i prolungamenti dei raggi.` },
    { id: 'fc-09', sezione: 'specchi-curvi', tipo: 'formula', fronte: R`Distanza focale di uno **specchio concavo** di raggio $R$`, retro: R`$f = \dfrac{R}{2}$: il fuoco sta a metà fra lo specchio e il centro $C$.` },
    { id: 'fc-10', sezione: 'specchi-curvi', tipo: 'formula', fronte: R`L'**equazione dei punti coniugati**`, retro: R`$\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$. Con $q$ negativa l'immagine è virtuale.` },
    { id: 'fc-11', sezione: 'specchi-curvi', tipo: 'procedura', fronte: R`Quali raggi si usano per trovare l'immagine in uno specchio concavo?`, retro: R`Il parallelo all'asse, che torna per il fuoco; quello per il fuoco, che torna parallelo; quello per il centro $C$, che torna su se stesso.` },
    { id: 'fc-12', sezione: 'specchi-curvi', tipo: 'concetto', fronte: R`Perché negli incroci si mettono **specchi convessi**?`, retro: R`Danno immagini virtuali, dritte e più piccole, ma con un campo molto largo.` },
    { id: 'fc-13', sezione: 'rifrazione', tipo: 'definizione', fronte: R`Che cos'è l'**indice di rifrazione**?`, retro: R`$n = \dfrac{c}{v}$: quante volte la luce nel mezzo è più lenta che nel vuoto. Acqua circa 1,33, vetro circa 1,5.` },
    { id: 'fc-14', sezione: 'rifrazione', tipo: 'concetto', fronte: R`Da che parte si piega un raggio che entra nell'acqua dall'aria?`, retro: R`Si avvicina alla normale, perché va verso un mezzo con $n$ più grande. Uscendo dall'acqua si allontana.` },
    { id: 'fc-15', sezione: 'rifrazione', tipo: 'formula', fronte: R`La **legge di Snell** scritta con il cerchio`, retro: R`$n_1 \cdot a_1 = n_2 \cdot a_2$, con $a_1$ e $a_2$ distanze dalla normale sullo stesso cerchio.` },
    { id: 'fc-16', sezione: 'riflessione-totale', tipo: 'definizione', fronte: R`Che cos'è l'**angolo limite**?`, retro: R`L'angolo di incidenza per cui il raggio rifratto esce a 90°. Per l'acqua è circa 49°, per il vetro circa 42°.` },
    { id: 'fc-17', sezione: 'riflessione-totale', tipo: 'concetto', fronte: R`Quando avviene la **riflessione totale**?`, retro: R`Quando la luce va verso un mezzo con $n$ più piccolo, con un angolo di incidenza oltre l'angolo limite.` },
    { id: 'fc-18', sezione: 'dispersione', tipo: 'definizione', fronte: R`Che cos'è la **dispersione** della luce?`, retro: R`La separazione dei colori per rifrazione: l'indice di rifrazione dipende dal colore, e il violetto si piega più del rosso.` },
    { id: 'fc-19', sezione: 'dispersione', tipo: 'concetto', fronte: R`Dove bisogna guardare per vedere l'**arcobaleno**?`, retro: R`Dalla parte opposta al Sole, con il Sole alle spalle: il rosso a circa 42° dal punto opposto al Sole, il violetto a circa 40°.` },
    { id: 'fc-20', sezione: 'lenti', tipo: 'procedura', fronte: R`I tre raggi per costruire l'immagine di una **lente convergente**`, retro: R`Parallelo all'asse, poi per il fuoco; per il centro, senza deviare; per il fuoco, poi parallelo all'asse.` },
    { id: 'fc-21', sezione: 'lenti', tipo: 'concetto', fronte: R`Com'è l'immagine se l'oggetto sta **dentro la focale** di una lente convergente?`, retro: R`Virtuale, dritta e più grande, dalla parte dell'oggetto: è la lente d'ingrandimento.` },
    { id: 'fc-22', sezione: 'occhio', tipo: 'concetto', fronte: R`Che lente serve a un **miope**? E a un **ipermetrope**?`, retro: R`Al miope una lente divergente (diottrie negative); all'ipermetrope una convergente (diottrie positive).` },
    { id: 'fc-23', sezione: 'occhio', tipo: 'formula', fronte: R`La **potenza** di una lente, in diottrie`, retro: R`$P = \dfrac{1}{f}$, con $f$ in metri. Una lente con $f = 0{,}5\,\text{m}$ ha $2$ diottrie.` },
    { id: 'fc-24', sezione: 'strumenti', tipo: 'formula', fronte: R`Ingrandimento del **microscopio** e del **cannocchiale**`, retro: R`Microscopio: $G = G_1 \cdot G_2$. Cannocchiale: $G = \dfrac{f_1}{f_2}$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Quanto tempo impiega la luce a percorrere 900 000 km? Usa $c = 3 \cdot 10^8\,\text{m/s}$.`, suggerimenti: [R`Porta i chilometri in metri: $900\,000\,\text{km} = 9 \cdot 10^8\,\text{m}$.`, R`Tempo uguale distanza diviso velocità.`], risposta: { tipo: 'numero', valore: 3, unita: 's' }, soluzione: [R`$t = \dfrac{9 \cdot 10^8\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 3\,\text{s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Quanti chilometri percorre la luce in un centesimo di secondo?`, suggerimenti: [R`Spazio uguale velocità per tempo, con $c = 3 \cdot 10^8\,\text{m/s}$ e $t = 0{,}01\,\text{s}$.`], risposta: { tipo: 'numero', valore: 3000, unita: 'km' }, soluzione: [R`$s = 3 \cdot 10^8\,\text{m/s} \cdot 0{,}01\,\text{s} = 3 \cdot 10^6\,\text{m} = 3000\,\text{km}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un raggio di luce forma un angolo di 25° con la superficie di uno specchio. Quanto vale l'angolo di riflessione?`, suggerimenti: [R`Gli angoli si misurano dalla normale, che è perpendicolare allo specchio.`, R`Angolo di incidenza: $90^\circ - 25^\circ$.`], risposta: { tipo: 'numero', valore: 65, unita: '°' }, soluzione: [R`L'angolo di incidenza, dalla normale, è $90^\circ - 25^\circ = 65^\circ$.`, R`L'angolo di riflessione è uguale: $r = 65^\circ$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un raggio arriva su uno specchio con un angolo di incidenza di 20°. Quanto vale l'angolo fra il raggio incidente e il raggio riflesso?`, suggerimenti: [R`Tutti e due i raggi formano 20° con la normale, da parti opposte.`], risposta: { tipo: 'numero', valore: 40, unita: '°' }, soluzione: [R`$r = i = 20^\circ$, dalle due parti della normale: fra i due raggi ci sono $20^\circ + 20^\circ = 40^\circ$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un vaso sta a 2,5 m da uno specchio piano. Quanto dista il vaso dalla sua immagine?`, suggerimenti: [R`L'immagine sta dietro lo specchio, alla stessa distanza dell'oggetto.`], risposta: { tipo: 'numero', valore: 5, unita: 'm' }, soluzione: [R`L'immagine è 2,5 m dietro lo specchio: in tutto $2{,}5\,\text{m} + 2{,}5\,\text{m} = 5\,\text{m}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 2, testo: R`Cammini verso uno specchio piano a 0,5 m/s. A che velocità ti avvicini alla tua immagine?`, suggerimenti: [R`Anche l'immagine si avvicina allo specchio, alla stessa velocità, dall'altra parte.`], risposta: { tipo: 'numero', valore: 1, unita: 'm/s' }, soluzione: [R`Ogni secondo tu ti avvicini di 0,5 m allo specchio, e l'immagine anche.`, R`La distanza fra voi cala di $0{,}5 + 0{,}5 = 1\,\text{m}$ al secondo: $1\,\text{m/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Uno specchio concavo ha raggio di curvatura 36 cm. Quanto vale la sua distanza focale?`, suggerimenti: [R`La focale è metà del raggio.`], risposta: { tipo: 'numero', valore: 18, unita: 'cm' }, soluzione: [R`$f = \dfrac{R}{2} = \dfrac{36\,\text{cm}}{2} = 18\,\text{cm}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Uno specchio concavo ha focale 8 cm. Un oggetto sta a 24 cm dallo specchio. A che distanza si forma l'immagine?`, suggerimenti: [R`Ricava $\dfrac{1}{q} = \dfrac{1}{f} - \dfrac{1}{p}$.`, R`Denominatore comune 24.`], risposta: { tipo: 'numero', valore: 12, unita: 'cm' }, soluzione: [R`$\dfrac{1}{q} = \dfrac{1}{8\,\text{cm}} - \dfrac{1}{24\,\text{cm}} = \dfrac{3 - 1}{24\,\text{cm}} = \dfrac{1}{12\,\text{cm}}$.`, R`$q = 12\,\text{cm}$: positiva, immagine reale davanti allo specchio.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un oggetto alto 6 cm sta a 40 cm da uno specchio concavo, e l'immagine si forma a 10 cm dallo specchio. Quanto è alta l'immagine?`, suggerimenti: [R`L'ingrandimento è $G = \dfrac{|q|}{p}$.`, R`Altezza dell'immagine: $G$ per l'altezza dell'oggetto.`], risposta: { tipo: 'numero', valore: 1.5, unita: 'cm' }, soluzione: [R`$G = \dfrac{10\,\text{cm}}{40\,\text{cm}} = 0{,}25$.`, R`$h' = 0{,}25 \cdot 6\,\text{cm} = 1{,}5\,\text{cm}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`In un certo materiale la luce viaggia a $2{,}4 \cdot 10^8\,\text{m/s}$. Quanto vale il suo indice di rifrazione?`, suggerimenti: [R`$n = \dfrac{c}{v}$, con $c = 3 \cdot 10^8\,\text{m/s}$.`], risposta: { tipo: 'numero', valore: 1.25 }, segnaposto: 'Un numero puro', soluzione: [R`$n = \dfrac{3 \cdot 10^8\,\text{m/s}}{2{,}4 \cdot 10^8\,\text{m/s}} = 1{,}25$. Le unità si semplificano: $n$ è un numero puro.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Nel tempo in cui la luce percorre 4 m nel vuoto, quanti metri percorre nell'acqua ($n = 1{,}33$)?`, suggerimenti: [R`Nell'acqua la luce è $n$ volte più lenta: nello stesso tempo fa $n$ volte meno strada.`], risposta: { tipo: 'numero', valore: 3, unita: 'm' }, soluzione: [R`$v = \dfrac{c}{n}$: nello stesso tempo lo spazio è diviso per $n$.`, R`$s = \dfrac{4\,\text{m}}{1{,}33} \approx 3\,\text{m}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Un raggio passa dall'aria ($n = 1$) a una plastica con $n = 1{,}25$. Sul cerchio della legge di Snell il raggio in aria dista 7,5 cm dalla normale. Quanto dista il raggio nella plastica?`, suggerimenti: [R`$n_1 \cdot a_1 = n_2 \cdot a_2$.`], risposta: { tipo: 'numero', valore: 6, unita: 'cm' }, soluzione: [R`$a_2 = \dfrac{1 \cdot 7{,}5\,\text{cm}}{1{,}25} = 6\,\text{cm}$: più vicino alla normale.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Un raggio esce da un vetro con $n = 1{,}5$ nell'aria. Sul cerchio della legge di Snell il raggio nel vetro dista 3 cm dalla normale. Quanto dista il raggio nell'aria?`, suggerimenti: [R`$n_1 \cdot a_1 = n_2 \cdot a_2$, con $n_1 = 1{,}5$ e $n_2 = 1$.`], risposta: { tipo: 'numero', valore: 4.5, unita: 'cm' }, soluzione: [R`$a_2 = \dfrac{1{,}5 \cdot 3\,\text{cm}}{1} = 4{,}5\,\text{cm}$: uscendo, il raggio si allontana dalla normale.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Un materiale ha $n = 2$. Per trovare l'angolo limite verso l'aria si disegna un cerchio di raggio 8 cm. A che distanza dalla normale passa il raggio incidente all'angolo limite?`, suggerimenti: [R`All'angolo limite il raggio esce radente: nell'aria $a_2$ è tutto il raggio del cerchio.`, R`$2 \cdot a_1 = 1 \cdot 8\,\text{cm}$.`], risposta: { tipo: 'numero', valore: 4, unita: 'cm' }, soluzione: [R`$n_1 \cdot a_1 = n_2 \cdot \ell$: $2 \cdot a_1 = 1 \cdot 8\,\text{cm}$.`, R`$a_1 = 4\,\text{cm}$, metà del raggio del cerchio.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Una lente convergente ha focale 20 cm. Un oggetto sta a 25 cm dalla lente. A che distanza dalla lente si forma l'immagine?`, suggerimenti: [R`$\dfrac{1}{q} = \dfrac{1}{f} - \dfrac{1}{p}$, denominatore comune 100.`], risposta: { tipo: 'numero', valore: 100, unita: 'cm' }, soluzione: [R`$\dfrac{1}{q} = \dfrac{1}{20\,\text{cm}} - \dfrac{1}{25\,\text{cm}} = \dfrac{5 - 4}{100\,\text{cm}} = \dfrac{1}{100\,\text{cm}}$.`, R`$q = 100\,\text{cm}$: immagine reale dall'altra parte della lente, lontana perché l'oggetto è vicino al fuoco.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Una lente convergente ha focale 12 cm. Un francobollo sta a 4 cm dalla lente. Dove si forma l'immagine? Scrivi $q$ con il suo segno.`, suggerimenti: [R`Il francobollo è dentro la focale: aspettati $q$ negativa.`, R`Denominatore comune 12.`], risposta: { tipo: 'numero', valore: -6, unita: 'cm' }, soluzione: [R`$\dfrac{1}{q} = \dfrac{1}{12\,\text{cm}} - \dfrac{1}{4\,\text{cm}} = \dfrac{1 - 3}{12\,\text{cm}} = -\dfrac{1}{6\,\text{cm}}$.`, R`$q = -6\,\text{cm}$: immagine virtuale, dalla parte del francobollo.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una lente forma l'immagine di un oggetto a 35 cm dalla lente; l'oggetto è a 10 cm. Quanto vale l'ingrandimento?`, suggerimenti: [R`$G = \dfrac{|q|}{p}$.`], risposta: { tipo: 'numero', valore: 3.5 }, segnaposto: 'Un numero puro', soluzione: [R`$G = \dfrac{35\,\text{cm}}{10\,\text{cm}} = 3{,}5$: l'immagine è alta tre volte e mezzo l'oggetto.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Una lente convergente ha focale 12,5 cm. Quante diottrie ha?`, suggerimenti: [R`Porta la focale in metri: $12{,}5\,\text{cm} = 0{,}125\,\text{m}$.`, R`$P = \dfrac{1}{f}$.`], risposta: { tipo: 'numero', valore: 8 }, segnaposto: 'Numero (in diottrie)', soluzione: [R`$P = \dfrac{1}{0{,}125\,\text{m}} = 8\,\text{D}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`Una lente per occhiali ha potenza $-2{,}5$ diottrie. Quanto vale la sua focale, in centimetri?`, suggerimenti: [R`$f = \dfrac{1}{P}$ dà la focale in metri.`, R`Il segno meno resta: è una lente divergente.`], risposta: { tipo: 'numero', valore: -40, unita: 'cm' }, soluzione: [R`$f = \dfrac{1}{-2{,}5}\,\text{m} = -0{,}4\,\text{m} = -40\,\text{cm}$: lente divergente, per un miope.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un microscopio ha un obiettivo che ingrandisce 25 volte e un oculare che ingrandisce 12 volte. Quanto ingrandisce in tutto?`, suggerimenti: [R`Gli ingrandimenti delle due lenti si moltiplicano.`], risposta: { tipo: 'numero', valore: 300 }, segnaposto: 'Un numero puro', soluzione: [R`$G = G_1 \cdot G_2 = 25 \cdot 12 = 300$.`] },

    /* ---- esercizi avanzati ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una sonda su Marte si trova a $2{,}25 \cdot 10^{11}\,\text{m}$ dalla Terra. Quanti minuti impiega un suo messaggio radio ad arrivare? (Le onde radio viaggiano alla velocità della luce.)`, suggerimenti: [R`$t = \dfrac{d}{c}$, poi dividi per 60.`], risposta: { tipo: 'numero', valore: 12.5, unita: 'min' }, soluzione: [R`$t = \dfrac{2{,}25 \cdot 10^{11}\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 750\,\text{s}$.`, R`$\dfrac{750}{60}\,\text{min} = 12{,}5\,\text{min}$: per questo un robot su Marte non si guida con il joystick.`] },
    { id: 'es-02', difficolta: 3, testo: R`Due specchi piani formano un angolo retto, come l'angolo di una stanza. Un raggio colpisce il primo specchio con un angolo di incidenza di 35°, si riflette e va a colpire il secondo. Con che angolo di incidenza arriva sul secondo specchio?`, suggerimenti: [R`Disegna i due specchi e il triangolo che il raggio riflesso forma con loro.`, R`Il raggio riflesso forma $90^\circ - 35^\circ = 55^\circ$ con il primo specchio.`, R`Nel triangolo rettangolo formato dai due specchi e dal raggio, gli angoli acuti sommano $90^\circ$.`], risposta: { tipo: 'numero', valore: 55, unita: '°' }, soluzione: [R`Il raggio riflesso forma $90^\circ - 35^\circ = 55^\circ$ con la superficie del primo specchio.`, R`Con i due specchi forma un triangolo rettangolo: con il secondo specchio fa $90^\circ - 55^\circ = 35^\circ$.`, R`Dalla normale del secondo specchio: $90^\circ - 35^\circ = 55^\circ$. Dopo le due riflessioni il raggio torna indietro parallelo a quello di partenza.`] },
    { id: 'es-03', difficolta: 2, testo: R`Con uno specchio concavo si vuole proiettare su uno schermo, a 72 cm dallo specchio, l'immagine di una candela posta a 36 cm. Quanto deve valere il raggio di curvatura dello specchio?`, suggerimenti: [R`Un'immagine su uno schermo è reale: $q = 72\,\text{cm}$ positiva.`, R`Trova $f$ con l'equazione, poi $R = 2 \cdot f$.`], risposta: { tipo: 'numero', valore: 48, unita: 'cm' }, soluzione: [R`$\dfrac{1}{f} = \dfrac{1}{36\,\text{cm}} + \dfrac{1}{72\,\text{cm}} = \dfrac{2 + 1}{72\,\text{cm}} = \dfrac{1}{24\,\text{cm}}$, quindi $f = 24\,\text{cm}$.`, R`$R = 2 \cdot f = 48\,\text{cm}$.`] },
    { id: 'es-04', difficolta: 2, testo: R`Uno specchietto convesso ha focale $-40\,\text{cm}$. Un'auto sta a 60 cm dallo specchietto (è un modellino). Dove si forma l'immagine? Scrivi $q$ con il suo segno.`, suggerimenti: [R`Nell'equazione la focale entra con il segno meno.`, R`$\dfrac{1}{q} = -\dfrac{1}{40} - \dfrac{1}{60}$, denominatore comune 120.`], risposta: { tipo: 'numero', valore: -24, unita: 'cm' }, soluzione: [R`$\dfrac{1}{q} = -\dfrac{1}{40\,\text{cm}} - \dfrac{1}{60\,\text{cm}} = -\dfrac{3 + 2}{120\,\text{cm}} = -\dfrac{1}{24\,\text{cm}}$.`, R`$q = -24\,\text{cm}$: immagine virtuale, dietro lo specchietto. $G = 24/60 = 0{,}4$: più piccola, come sempre con uno specchio convesso.`] },
    { id: 'es-05', difficolta: 3, testo: R`In una fibra ottica il filo centrale di vetro ha $n_1 = 1{,}48$ ed è avvolto da un vetro con $n_2 = 1{,}40$. Su un cerchio di raggio 10 cm, a che distanza dalla normale passa il raggio incidente all'angolo limite?`, suggerimenti: [R`La luce va dal vetro con $n$ più grande a quello con $n$ più piccolo: la riflessione totale è possibile.`, R`All'angolo limite $a_2$ è tutto il raggio del cerchio: $1{,}48 \cdot a_1 = 1{,}40 \cdot 10\,\text{cm}$.`], risposta: { tipo: 'numero', valore: 9.46, unita: 'cm' }, soluzione: [R`$a_1 = \dfrac{n_2}{n_1} \cdot \ell = \dfrac{1{,}40}{1{,}48} \cdot 10\,\text{cm} \approx 9{,}46\,\text{cm}$.`, R`Sul disegno è un angolo di circa 71°: la luce resta dentro solo se batte sulla parete molto inclinata, quasi radente.`] },
    { id: 'es-06', difficolta: 2, testo: R`Quanto tempo impiega la luce ad attraversare 3 m d'acqua ($n = 1{,}33$)? Esprimi il risultato in nanosecondi ($1\,\text{ns} = 10^{-9}\,\text{s}$).`, suggerimenti: [R`Prima la velocità nell'acqua: $v = \dfrac{c}{n}$.`, R`Poi $t = \dfrac{d}{v}$.`], risposta: { tipo: 'numero', valore: 13.3, unita: 'ns' }, soluzione: [R`$v = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}33} \approx 2{,}26 \cdot 10^8\,\text{m/s}$.`, R`$t = \dfrac{3\,\text{m}}{2{,}26 \cdot 10^8\,\text{m/s}} \approx 1{,}33 \cdot 10^{-8}\,\text{s} = 13{,}3\,\text{ns}$. Nell'aria ne basterebbero 10.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una lente convergente ha focale 12 cm. A che distanza dalla lente va messo un oggetto per avere un'immagine reale tre volte più grande?`, suggerimenti: [R`Immagine reale tre volte più grande: $q = 3 \cdot p$.`, R`$\dfrac{1}{p} + \dfrac{1}{3 \cdot p} = \dfrac{4}{3 \cdot p} = \dfrac{1}{12\,\text{cm}}$.`], risposta: { tipo: 'numero', valore: 16, unita: 'cm' }, soluzione: [R`Con $q = 3 \cdot p$: $\dfrac{1}{p} + \dfrac{1}{3 \cdot p} = \dfrac{3 + 1}{3 \cdot p} = \dfrac{4}{3 \cdot p}$.`, R`$\dfrac{4}{3 \cdot p} = \dfrac{1}{12\,\text{cm}}$, quindi $3 \cdot p = 48\,\text{cm}$ e $p = 16\,\text{cm}$.`, R`Controllo: $q = 48\,\text{cm}$, e $\dfrac{1}{16} + \dfrac{1}{48} = \dfrac{4}{48} = \dfrac{1}{12}$. Torna.`] },
    { id: 'es-08', difficolta: 3, testo: R`Una lente convergente proietta su uno schermo l'immagine di una lampadina, grande uguale alla lampadina. Lampadina e schermo distano 80 cm. Quanto vale la focale della lente?`, suggerimenti: [R`Immagine reale grande uguale: $q = p$, cioè oggetto a $2f$.`, R`$p + q = 80\,\text{cm}$.`], risposta: { tipo: 'numero', valore: 20, unita: 'cm' }, soluzione: [R`Grande uguale e reale vuol dire $q = p$; e $p + q = 80\,\text{cm}$, quindi $p = q = 40\,\text{cm}$.`, R`$\dfrac{1}{f} = \dfrac{1}{40\,\text{cm}} + \dfrac{1}{40\,\text{cm}} = \dfrac{1}{20\,\text{cm}}$: $f = 20\,\text{cm}$. L'oggetto sta a $2f$, come dice la tabella.`] },
    { id: 'es-09', difficolta: 2, testo: R`Una lente divergente ha focale $-15\,\text{cm}$. Un oggetto sta a 30 cm dalla lente. Dove si forma l'immagine? Scrivi $q$ con il suo segno.`, suggerimenti: [R`La focale entra con il segno meno: $\dfrac{1}{q} = -\dfrac{1}{15} - \dfrac{1}{30}$.`], risposta: { tipo: 'numero', valore: -10, unita: 'cm' }, soluzione: [R`$\dfrac{1}{q} = -\dfrac{1}{15\,\text{cm}} - \dfrac{1}{30\,\text{cm}} = -\dfrac{2 + 1}{30\,\text{cm}} = -\dfrac{1}{10\,\text{cm}}$.`, R`$q = -10\,\text{cm}$: virtuale, dalla parte dell'oggetto, e più piccola ($G = 10/30 \approx 0{,}33$).`] },
    { id: 'es-10', difficolta: 3, testo: R`Un presbite vede nitido solo da 1 m in poi. Per leggere, vuole tenere il libro a 25 cm. La lente deve formare un'immagine virtuale del libro a 1 m. Di quante diottrie è la lente? (Trascura la distanza fra lente e occhio.)`, suggerimenti: [R`Oggetto $p = 25\,\text{cm}$, immagine virtuale $q = -100\,\text{cm}$.`, R`Trova $\dfrac{1}{f}$ in $\text{cm}^{-1}$, poi passa ai metri.`], risposta: { tipo: 'numero', valore: 3 }, segnaposto: 'Numero (in diottrie)', soluzione: [R`$\dfrac{1}{f} = \dfrac{1}{25\,\text{cm}} - \dfrac{1}{100\,\text{cm}} = \dfrac{4 - 1}{100\,\text{cm}} = \dfrac{3}{100\,\text{cm}}$.`, R`$100\,\text{cm} = 1\,\text{m}$, quindi $P = \dfrac{1}{f} = 3\,\text{m}^{-1} = 3\,\text{D}$: una lente convergente da $+3$ diottrie.`] },
    { id: 'es-11', difficolta: 2, testo: R`Un cannocchiale ha un obiettivo con focale 90 cm e un oculare con focale 2,5 cm. Quanto ingrandisce? Quanto è lungo, più o meno, il tubo?`, suggerimenti: [R`$G = \dfrac{f_1}{f_2}$.`, R`I due fuochi coincidono: le lenti distano $f_1 + f_2$.`], risposta: { tipo: 'numero', valore: 36 }, segnaposto: 'L\'ingrandimento (numero puro)', soluzione: [R`$G = \dfrac{90\,\text{cm}}{2{,}5\,\text{cm}} = 36$.`, R`Il tubo è lungo circa $90 + 2{,}5 = 92{,}5\,\text{cm}$: per ingrandire tanto serve un obiettivo con una focale lunga.`] },
    { id: 'es-12', difficolta: 3, testo: R`L'obiettivo di un microscopio ha focale 1,0 cm, e il vetrino sta a 1,1 cm dall'obiettivo. L'oculare ingrandisce 5 volte. Quanto ingrandisce il microscopio?`, suggerimenti: [R`Prima trova dove l'obiettivo forma l'immagine: $\dfrac{1}{q_1} = \dfrac{1}{1{,}0} - \dfrac{1}{1{,}1}$.`, R`Poi $G_1 = \dfrac{|q_1|}{p_1}$ e $G = G_1 \cdot G_2$.`], risposta: { tipo: 'numero', valore: 50 }, segnaposto: 'Un numero puro', soluzione: [R`$\dfrac{1}{q_1} = \dfrac{1}{1{,}0\,\text{cm}} - \dfrac{1}{1{,}1\,\text{cm}} = \dfrac{1{,}1 - 1{,}0}{1{,}1}\,\text{cm}^{-1} = \dfrac{1}{11\,\text{cm}}$, quindi $q_1 = 11\,\text{cm}$.`, R`$G_1 = \dfrac{11\,\text{cm}}{1{,}1\,\text{cm}} = 10$.`, R`$G = 10 \cdot 5 = 50$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Da dove si misura l'angolo di incidenza su uno specchio?`, opzioni: [R`Dalla superficie dello specchio`, R`Dalla normale allo specchio`, R`Dal raggio riflesso`, R`Dalla linea dell'orizzonte`], corretta: 1, spiegazione: R`In ottica gli angoli si misurano sempre dalla normale, la perpendicolare alla superficie. Misurarli dallo specchio è l'errore più comune: dà il complementare.` },
    { id: 'q-02', domanda: R`Com'è l'immagine che dà uno specchio piano?`, opzioni: [R`Reale e capovolta`, R`Virtuale e capovolta`, R`Reale e dritta`, R`Virtuale e dritta`], corretta: 3, spiegazione: R`Dietro lo specchio la luce non arriva: l'immagine è virtuale. È dritta, uguale all'oggetto e simmetrica rispetto allo specchio. Le immagini reali e capovolte le danno gli specchi concavi e le lenti convergenti.` },
    { id: 'q-03', domanda: R`In quale di questi mezzi la luce viaggia più veloce?`, opzioni: [R`Nel vuoto`, R`Nell'acqua`, R`Nel vetro`, R`Nel diamante`], corretta: 0, spiegazione: R`Nel vuoto la luce va a $c$, la velocità più alta. In ogni materiale va più piano, $v = c/n$: tanto più piano quanto più $n$ è grande, e il diamante ha $n$ circa 2,4.` },
    { id: 'q-04', domanda: R`Un raggio passa dall'aria all'acqua, non perpendicolare alla superficie. Che cosa fa?`, opzioni: [R`Si allontana dalla normale`, R`Prosegue dritto`, R`Si avvicina alla normale`, R`Si riflette tutto`], corretta: 2, spiegazione: R`Nell'acqua la luce è più lenta ($n$ più grande): il raggio si avvicina alla normale. Si allontanerebbe uscendo dall'acqua. Prosegue dritto solo se arriva perpendicolare.` },
    { id: 'q-05', domanda: R`Quando può avvenire la riflessione totale?`, opzioni: [R`Quando la luce passa dall'aria all'acqua`, R`Quando la luce passa dall'acqua all'aria, oltre l'angolo limite`, R`Sempre, su qualunque superficie trasparente`, R`Solo sugli specchi di metallo`], corretta: 1, spiegazione: R`Serve andare verso un mezzo con $n$ più piccolo, e con un angolo oltre l'angolo limite. Dall'aria all'acqua il raggio si avvicina alla normale ed entra sempre. Lo specchio di metallo riflette, ma non è riflessione totale.` },
    { id: 'q-06', domanda: R`Quale frase vale per una lente divergente?`, opzioni: [R`È più spessa al centro che ai bordi`, R`Dà sempre immagini reali`, R`Corregge l'ipermetropia`, R`Ha la distanza focale negativa`], corretta: 3, spiegazione: R`La lente divergente è più sottile al centro, allarga i raggi e ha la focale negativa. Dà immagini virtuali e si usa per il miope. Per l'ipermetrope serve una convergente.` },
    { id: 'q-07', domanda: R`Un oggetto sta dentro la focale di una lente convergente. Com'è l'immagine?`, opzioni: [R`Virtuale, dritta e più grande`, R`Reale, capovolta e più grande`, R`Reale, dritta e più piccola`, R`Non si forma nessuna immagine`], corretta: 0, spiegazione: R`Dentro la focale i raggi escono divergenti: si incontrano solo i loro prolungamenti, dalla parte dell'oggetto. È la lente d'ingrandimento. Le immagini reali si hanno con l'oggetto oltre il fuoco.` },
    { id: 'q-08', domanda: R`Nell'equazione $\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$ viene $q = -12\,\text{cm}$. Che cosa vuol dire?`, opzioni: [R`Che c'è un errore nei conti`, R`Che l'immagine è capovolta`, R`Che l'immagine è virtuale`, R`Che l'oggetto sta dietro la lente`], corretta: 2, spiegazione: R`Una $q$ negativa vuol dire immagine virtuale: dalla parte dell'oggetto per una lente, dietro lo specchio per uno specchio. Le immagini capovolte sono quelle reali, con $q$ positiva.` },
    { id: 'q-09', domanda: R`Un ragazzo vede bene da vicino ma sfocato da lontano. Che lente gli serve?`, opzioni: [R`Una lente convergente`, R`Una lente divergente`, R`Un prisma`, R`Nessuna: è presbiopia`], corretta: 1, spiegazione: R`È miope: i raggi delle cose lontane si incontrano prima della retina. Una lente divergente li allarga, e il punto d'incontro torna sulla retina. La presbiopia invece rende difficile vedere da vicino.` },
    { id: 'q-10', domanda: R`Dove deve stare il Sole perché tu veda l'arcobaleno?`, opzioni: [R`Alle tue spalle`, R`Davanti a te, dietro la pioggia`, R`Proprio sopra la tua testa`, R`Coperto dalle nuvole`], corretta: 0, spiegazione: R`Le gocce rimandano la luce indietro, verso il lato del Sole, a circa 42° dal punto opposto al Sole. Per questo bisogna avere il Sole alle spalle. Con il Sole troppo alto l'arco resta sotto l'orizzonte.` },
    { id: 'q-11', domanda: R`Perché un prisma separa la luce bianca nei colori?`, opzioni: [R`Perché il vetro colora la luce che lo attraversa`, R`Per la riflessione totale sulle sue facce`, R`Perché nel vuoto la luce rossa è più veloce della violetta`, R`Perché l'indice di rifrazione del vetro dipende dal colore`], corretta: 3, spiegazione: R`È la dispersione: nel vetro ogni colore ha un $n$ un po' diverso, e il violetto si piega più del rosso. Il vetro non aggiunge colori, li separa. Nel vuoto tutti i colori vanno alla stessa velocità $c$.` },
    { id: 'q-12', domanda: R`Copri con un cartoncino la metà superiore di una lente che proietta un'immagine su uno schermo. Che cosa succede?`, opzioni: [R`Sparisce la metà superiore dell'immagine`, R`Sparisce la metà inferiore dell'immagine`, R`L'immagine resta intera, ma più scura`, R`L'immagine si capovolge`], corretta: 2, spiegazione: R`Ogni punto dell'oggetto manda raggi su tutta la lente: anche la metà libera basta a formare l'immagine intera. Arriva però meno luce, e l'immagine è più scura.` },
    { id: 'q-13', domanda: R`Uno specchio concavo ha raggio di curvatura 40 cm. Dove sta il fuoco?`, opzioni: [R`A 40 cm dallo specchio`, R`A 20 cm dallo specchio`, R`A 80 cm dallo specchio`, R`A 10 cm dallo specchio`], corretta: 1, spiegazione: R`Il fuoco sta a metà fra lo specchio e il centro della sfera: $f = R/2 = 20\,\text{cm}$. A 40 cm c'è il centro $C$.` },
    { id: 'q-14', domanda: R`Come fece Rømer, nel 1676, a capire che la luce ha una velocità finita?`, opzioni: [R`Dal ritardo delle eclissi di una luna di Giove`, R`Con una ruota dentata che girava veloce`, R`Con due lanterne su due colline lontane`, R`Con uno specchio che ruotava`], corretta: 0, spiegazione: R`Le eclissi di Io arrivavano in ritardo quando la Terra era lontana da Giove. La ruota dentata è di Fizeau (1849). Le lanterne le propose Galileo, senza riuscire a misurare niente. Lo specchio rotante è di Foucault.` },
    { id: 'q-15', domanda: R`Un microscopio ha un obiettivo 20× e un oculare 10×. Quanto ingrandisce?`, opzioni: [R`30 volte`, R`2 volte`, R`10 volte`, R`200 volte`], corretta: 3, spiegazione: R`L'oculare ingrandisce l'immagine già ingrandita dall'obiettivo: gli ingrandimenti si moltiplicano, $20 \cdot 10 = 200$. Non si sommano.` },
    { id: 'q-16', domanda: R`Sulla ricetta di un paio di occhiali c'è +3 diottrie. Che lente è?`, opzioni: [R`Divergente, con focale 3 m`, R`Convergente, con focale 3 cm`, R`Convergente, con focale di circa 33 cm`, R`Divergente, con focale di circa 33 cm`], corretta: 2, spiegazione: R`Il segno più dice convergente. La focale è $f = 1/P = 1/3\,\text{m} \approx 0{,}33\,\text{m}$, cioè circa 33 cm. Le divergenti hanno diottrie negative.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`In ottica gli angoli si misurano sempre dalla **normale**, mai dalla superficie. Se il testo dà l'angolo con lo specchio, fai prima $90^\circ$ meno quell'angolo.` },
    { tipo: 'errore', testo: R`Una $q$ negativa non è un errore di conto: vuol dire che l'immagine è **virtuale**.` },
    { tipo: 'errore', testo: R`Le diottrie vogliono la focale **in metri**: $20\,\text{cm}$ diventano $0{,}20\,\text{m}$, e la potenza è $5\,\text{D}$, non $0{,}05$.` },
    { tipo: 'trucco', testo: R`Dove la luce è più lenta il raggio sta più vicino alla normale. Verso $n$ più grande si avvicina, verso $n$ più piccolo si allontana.` },
    { tipo: 'trucco', testo: R`Lente convergente o specchio concavo: oggetto oltre il fuoco, immagine reale e capovolta; oggetto dentro il fuoco, immagine virtuale, dritta e più grande.` },
    { tipo: 'metodo', testo: R`Con $\dfrac{1}{p} + \dfrac{1}{q} = \dfrac{1}{f}$: ricava $\dfrac{1}{q}$, fai il denominatore comune, poi capovolgi la frazione. Alla fine guarda il segno.` },
    { tipo: 'metodo', testo: R`Prima del conto fai il disegno con due raggi. Ti dice subito se l'immagine è reale o virtuale, e ti permette di controllare il risultato.` },
    { tipo: 'trucco', testo: R`La riflessione totale ha due condizioni: verso un mezzo con $n$ più piccolo, e oltre l'angolo limite. Se ne manca una, la luce esce.` }
  ],
  aneddoti: [
    { fisico: 'Ibn al-Haytham', anni: 'circa 965–1040', titolo: 'Il libro di ottica scritto da recluso', testo: R`Ibn al-Haytham nacque a Bassora, in Iraq, e lavorò al Cairo. I suoi biografi, vissuti due secoli dopo, raccontano una storia difficile da verificare. Il califfo al-Hakim gli avrebbe chiesto di regolare le piene del Nilo. Capito che era impossibile, Ibn al-Haytham si sarebbe finto pazzo per evitare la punizione. Sarebbe rimasto chiuso in casa fino alla morte del califfo, nel 1021. Di sicuro scrisse un grande *Libro dell'ottica*. Prima di lui molti pensavano che fosse l'occhio a mandare raggi verso le cose. Lui sostenne il contrario: la luce parte dagli oggetti ed entra nell'occhio. Lo mostrò con esperimenti, anche con la camera oscura. Tradotto in latino verso il 1200, il libro fu studiato in Europa per secoli.`, legame: R`È l'idea che usiamo per gli specchi: l'occhio raccoglie i raggi che gli arrivano e li prolunga dritti.` },
    { fisico: 'Willebrord Snell', anni: '1580–1626', titolo: 'La legge che nessuno pubblicò in tempo', testo: R`Willebrord Snell insegnava matematica all'Università di Leida, in Olanda. Verso il 1621 trovò la regola che dice di quanto si piega la luce passando dall'aria all'acqua. La scrisse in un manoscritto, ma morì nel 1626 senza pubblicarla. Nel 1637 la stessa legge comparve nella *Diottrica* di Cartesio, che non citava Snell. Anni dopo Christiaan Huygens lesse il manoscritto e sospettò che Cartesio lo avesse visto: un'accusa mai dimostrata. Per questo in Francia la legge porta anche il nome di Cartesio. E la storia ha un'altra sorpresa. Nel 1990 lo storico Roshdi Rashed scoprì che il matematico persiano Ibn Sahl l'aveva già descritta verso il 984, in un libro sugli specchi e le lenti ustorie.`, legame: R`È la legge di Snell, $n_1 \cdot a_1 = n_2 \cdot a_2$, che qui si scrive con il cerchio.` },
    { fisico: 'Pierre de Fermat', anni: 'circa 1607–1665', titolo: 'La luce che sceglie il tempo più breve', testo: R`Pierre de Fermat era un magistrato di Tolosa, e faceva matematica nel tempo libero. Nel 1662 affrontò la rifrazione con un'idea nuova: la luce va da un punto all'altro nel tempo più breve possibile. Supponeva che nell'acqua andasse più piano che nell'aria. Fece i conti e ritrovò proprio la legge già nota. Cartesio, morto nel 1650, l'aveva ottenuta supponendo il contrario: la luce più veloce nell'acqua. I suoi seguaci protestarono. Claude Clerselier scrisse a Fermat che la natura non può «scegliere» una strada, perché non ha intenzioni. Fermat rispose che non voleva litigare: gli bastava che i conti tornassero. Chi avesse ragione sulla velocità si seppe solo nel 1850. Léon Foucault misurò che nell'acqua la luce è più lenta.`, legame: R`È il principio di Fermat del bagnino: la luce si piega perché nei due mezzi va a velocità diverse.` },
    { fisico: 'Jean-Daniel Colladon', anni: '1802–1893', titolo: 'La luce che segue un getto d\'acqua', testo: R`Nel 1841 Jean-Daniel Colladon insegnava fisica a Ginevra. Voleva mostrare agli studenti come esce l'acqua da un foro in un recipiente. In un'aula grande, però, i getti si vedevano male. Allora mandò un fascio di luce dentro il recipiente, dalla parte opposta al foro. La luce uscì insieme all'acqua e restò dentro il getto, anche dove questo si curvava verso il basso. Dove il getto si rompeva in gocce, la luce sfuggiva e lo faceva brillare. Colladon descrisse l'esperimento nel 1842, in una nota per l'Accademia delle scienze di Parigi. Le «fontane luminose» divennero uno spettacolo delle grandi esposizioni dell'Ottocento. Dentro quel getto succedeva quello che succede oggi in una fibra ottica.`, legame: R`È la riflessione totale: la luce batte sulla superficie dell'acqua oltre l'angolo limite, e non esce.` },
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Il cannocchiale sul campanile di San Marco', testo: R`Nel 1609 Galileo, professore a Padova, seppe che in Olanda si vendevano tubi con due lenti che facevano sembrare vicine le cose lontane. Ne costruì uno da solo, molando le lenti con le sue mani, e lo migliorò. In agosto salì sul campanile di San Marco, a Venezia, con alcuni senatori. Con il cannocchiale si vedevano le navi in arrivo molto prima che a occhio nudo. Il Senato gli portò lo stipendio quasi al doppio. Galileo però puntò lo strumento verso il cielo. Nel gennaio 1610 vide quattro lune che giravano attorno a Giove. A marzo pubblicò le sue scoperte nel *Sidereus Nuncius*. Il suo cannocchiale aveva come oculare una lente divergente: per questo mostrava le immagini dritte.`, legame: R`È il cannocchiale, due lenti in fila. E una di quelle lune, Io, servì poi a Rømer per misurare la velocità della luce.` }
  ]
});
})();
