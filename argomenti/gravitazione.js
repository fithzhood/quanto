/* Quanto — La gravitazione (terzo anno): le leggi di Keplero, la gravitazione universale, il campo gravitazionale,
   le orbite e il satellite geostazionario, l'energia potenziale e la velocità di fuga, l'universo in espansione.
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/gravitazione.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'gravitazione',
  titolo: 'La gravitazione',
  introduzione: R`Perché la Luna non cade sulla Terra? E perché i pianeti girano attorno al Sole, invece di andarsene dritti? La risposta è una sola forza: la **gravità**. È la stessa che fa cadere una mela e che ti tiene sul pavimento.

Si parte dalle tre leggi di Keplero, che descrivono come si muovono i pianeti. Poi arriva la legge di Newton, che spiega il perché. Con una sola formula si calcolano il peso su Marte, la velocità di un satellite, la massa del Sole. E si capisce quanto forte va lanciato un razzo per non tornare più.

Servono il moto circolare uniforme con l'accelerazione centripeta, i principi della dinamica e la conservazione dell'energia. Serve anche la notazione scientifica: in astronomia i numeri sono enormi.`,
  inBreve: [
    R`**Keplero**: i pianeti percorrono ellissi con il Sole in un fuoco, vanno più veloci vicino al Sole, e $T^2/a^3$ è lo stesso per tutti.`,
    R`**Newton**: due masse si attraggono con $F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}$, dove $r$ è la distanza fra i centri. Distanza doppia, forza un quarto.`,
    R`Il **campo gravitazionale** è la forza su ogni chilogrammo: $g = \dfrac{G \cdot M}{r^2}$. Al livello del mare vale circa $9{,}8\,\text{N/kg}$, e cala salendo.`,
    R`Un satellite è un corpo che cade senza mai arrivare a terra. In orbita circolare la gravità fa da forza centripeta: $v = \sqrt{\dfrac{G \cdot M}{r}}$.`,
    R`L'energia potenziale gravitazionale è $E_p = -\dfrac{G \cdot M \cdot m}{r}$, con lo zero all'infinito. Dalla Terra si scappa a $11{,}2\,\text{km/s}$.`,
    R`Le galassie lontane si allontanano con $v = H_0 \cdot d$: l'universo si espande, dal Big Bang di 13,8 miliardi di anni fa.`
  ],
  sezioni: [
    {
      id: 'keplero',
      titolo: 'Le tre leggi di Keplero',
      testo: R`Per molti secoli si è pensato che la Terra stesse ferma al centro dell'universo. Nel II secolo d.C. Tolomeo ne fece un modello preciso, il **sistema geocentrico**. Il Sole e i pianeti giravano attorno alla Terra. Ogni tanto, però, un pianeta sembra tornare indietro fra le stelle. Per spiegarlo, Tolomeo fece girare ogni pianeta su un piccolo cerchio, l'**epiciclo**. Il centro dell'epiciclo, a sua volta, girava attorno alla Terra.

Nel 1543 Niccolò Copernico mise al centro il Sole: è il **sistema eliocentrico**. La Terra diventava un pianeta come gli altri. Gira attorno al Sole in un anno, e su se stessa in un giorno. Le orbite però restavano cerchi, e servivano ancora gli epicicli. Nel 1610 Galileo puntò il cannocchiale su Giove e vide quattro lune girargli attorno. Non tutto, dunque, girava attorno alla Terra.

Restava da capire la forma vera delle orbite. All'inizio del Seicento Giovanni Keplero trovò tre regole. Le ricavò dalle misure di Tycho Brahe, le migliori del tempo. Sono leggi **empiriche**: dicono *come* si muovono i pianeti, non *perché*.

[[video:gravitazione/keplero]]

Un'ellisse è un cerchio schiacciato. Per ogni suo punto, la somma delle distanze da due punti fissi, i **fuochi**, è sempre la stessa.

>* **Prima legge**: ogni pianeta percorre un'ellisse, e il Sole sta in uno dei due fuochi.

Metà dell'asse più lungo dell'ellisse è il **semiasse maggiore** $a$. Il punto dell'orbita più vicino al Sole è il **perielio**, il più lontano l'**afelio**. Le orbite vere sono ellissi quasi rotonde: quella della Terra sembra un cerchio.

>* **Seconda legge**: il segmento che va dal Sole al pianeta spazza aree uguali in tempi uguali.

Vicino al Sole il segmento è corto. Per spazzare la stessa area, il pianeta deve correre di più. Quindi è più veloce al perielio e più lento all'afelio. In quei due punti la velocità è perpendicolare al raggio, e vale $r_p \cdot v_p = r_a \cdot v_a$.

[[grafico:orbita]]

>* **Terza legge**: il quadrato del periodo è proporzionale al cubo del semiasse maggiore, $\dfrac{T^2}{a^3} = \text{costante}$. La costante è la stessa per tutti i pianeti del Sole.

Il **periodo** $T$ è il tempo di un giro. Conviene misurare $T$ in anni e $a$ in **unità astronomiche** (UA). Una UA è la distanza media fra la Terra e il Sole, circa 150 milioni di km. Con queste unità, per la Terra $T = 1$ e $a = 1$: la costante vale 1.

~ T^2 = a^3 :: in anni e UA, per i pianeti del Sole
~ T^2 = 5{,}2^3 \approx 140{,}6 :: Giove sta a 5,2 UA dal Sole
~ T = \sqrt{140{,}6} \approx \evidb{11{,}9} :: in anni: Giove fa un giro ogni 12 anni circa

[[grafico:periodi]]

>! La terza legge confronta corpi che girano attorno allo **stesso** centro. La costante dei pianeti del Sole non vale per la Luna, che gira attorno alla Terra.

?? Un pianeta va dal perielio all'afelio. Che cosa fa la sua velocità?
[ ] resta costante, perché l'orbita è chiusa
[x] diminuisce
[ ] aumenta
=> Allontanandosi dal Sole il raggio si allunga. Per spazzare aree uguali in tempi uguali, il pianeta deve rallentare.

?? Nel sistema di Copernico, come sono le orbite dei pianeti?
[ ] ellissi, con il Sole in un fuoco
[x] cerchi attorno al Sole
[ ] cerchi attorno alla Terra
=> Copernico mise il Sole al centro, ma tenne i cerchi e gli epicicli. Le ellissi arrivano con Keplero, più di sessant'anni dopo.`
    },
    {
      id: 'gravitazione-universale',
      titolo: 'La legge di gravitazione universale',
      testo: R`Keplero aveva descritto le orbite. Isaac Newton ne trovò la causa, e la pubblicò nei *Principia* del 1687. La sua idea è audace: ogni corpo attira ogni altro corpo. Si attirano anche una penna e un quaderno.

>* **Legge di gravitazione universale**: due corpi di massa $m_1$ e $m_2$, a distanza $r$, si attraggono con una forza $F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}$. La forza è diretta lungo la retta che li unisce.

$G$ è la **costante di gravitazione universale**: $G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$. È la stessa in tutto l'universo. Per corpi sferici, come pianeti e stelle, $r$ è la distanza fra i **centri**.

Dalla formula si leggono tre proprietà.

- Massa doppia, forza doppia: $F$ è direttamente proporzionale a ciascuna massa.
- Distanza doppia, forza un quarto; distanza tripla, un nono. È una legge dell'**inversa del quadrato**.
- Le due forze sono uguali e opposte, come vuole il terzo principio. La Terra tira la Luna quanto la Luna tira la Terra.

[[grafico:coppia]]

$G$ è piccolissima. Per questo non sentiamo l'attrazione fra due persone. La prima misura in laboratorio di questa attrazione la fece Henry Cavendish, nel 1798.

~ F = \dfrac{G \cdot m_1 \cdot m_2}{r^2} :: due compagni di 60 kg e 50 kg, a 1 m fra i centri
~ F = \dfrac{6{,}67 \cdot 10^{-11} \cdot 60 \cdot 50}{1^2}\,\text{N} :: con le masse in kg e la distanza in m restano i newton
~ F \approx \evidb{2 \cdot 10^{-7}\,\text{N}} :: quanto pesa un granello di sabbia fine

Con un pianeta le cose cambiano. La sua massa è enorme, e compensa la $G$ piccola.

>! $r$ non è la distanza fra le superfici. Per una mela sul prato, $r$ è il raggio della Terra, circa 6370 km, non zero.

?? Due asteroidi si attraggono con una forza $F$. La distanza fra i loro centri diventa tripla. Quanto vale ora la forza?
[ ] $F/3$
[ ] $3 \cdot F$
[x] $F/9$
=> La forza va con l'inverso del quadrato della distanza: distanza tripla, forza divisa per $3^2 = 9$.`
    },
    {
      id: 'mela-luna',
      titolo: 'Dalla mela alla Luna',
      testo: R`Una mela cade con accelerazione $g$. La Luna invece gira attorno alla Terra, a 384 000 km da noi. Newton si chiese se fosse la stessa forza a muoverle tutte e due.

Prima la mela. Chiamiamo $M = 5{,}97 \cdot 10^{24}\,\text{kg}$ la massa della Terra e $R = 6{,}37 \cdot 10^6\,\text{m}$ il suo raggio. Il prodotto $G \cdot M$ della Terra vale $3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$: torna in tutti i conti.

~ m \cdot a = \dfrac{G \cdot M \cdot m}{R^2} :: secondo principio: la forza è l'attrazione della Terra
~ a = \dfrac{G \cdot M}{R^2} :: la massa $m$ della mela si semplifica
~ a = \dfrac{3{,}98 \cdot 10^{14}}{(6{,}37 \cdot 10^6)^2}\,\text{m/s}^2 :: G·M della Terra, e il raggio in metri
~ a \approx \evidb{9{,}8\,\text{m/s}^2} :: è proprio $g$, la stessa per tutti i corpi

Ecco perché nel vuoto un martello e una piuma cadono insieme. La forza è proporzionale alla massa, e la massa si semplifica.

[[video:gravitazione/newton]]

Ora la Luna. È a circa 60 raggi terrestri dal centro della Terra. Se la forza è la stessa, la sua accelerazione è $60^2 = 3600$ volte più piccola di $g$. Fa circa $2{,}7 \cdot 10^{-3}\,\text{m/s}^2$. Ma la Luna gira su un cerchio di raggio $r = 3{,}84 \cdot 10^8\,\text{m}$, in 27,3 giorni. Quanto vale la sua accelerazione centripeta?

~ a_c = \dfrac{4\pi^2 \cdot r}{T^2} :: l'accelerazione centripeta del moto circolare, con il periodo
~ T \approx 2{,}36 \cdot 10^6\,\text{s} :: un giro della Luna: 27,3 giorni di 86 400 s
~ a_c = \dfrac{4\pi^2 \cdot 3{,}84 \cdot 10^8\,\text{m}}{(2{,}36 \cdot 10^6\,\text{s})^2} :: metto i numeri
~ a_c \approx \evidb{2{,}7 \cdot 10^{-3}\,\text{m/s}^2} :: lo stesso valore di g/3600

Torna: la forza che regge la Luna è la stessa che fa cadere la mela.

>* La gravità è **universale**: la stessa forza fa cadere i corpi sulla Terra e tiene la Luna in orbita. Per un corpo in orbita circolare, la gravità fa da **forza centripeta**.

>! La Luna non sta lassù perché lì la gravità manca. La Terra la attira eccome: è la sua velocità di lato che la fa girare, invece di cadere dritta.

?? Nel vuoto lasci cadere una palla da 5 kg e una da 1 kg. Sulla palla grande la gravità è 5 volte più forte. Che accelerazione ha?
[ ] cinque volte quella della palla piccola
[x] la stessa della palla piccola
[ ] un quinto di quella della palla piccola
=> Forza 5 volte più grande, ma anche massa 5 volte più grande. L'accelerazione $F/m$ resta $g$ per tutte e due.`
    },
    {
      id: 'campo',
      titolo: 'Il campo gravitazionale',
      testo: R`Sulla cima dell'Everest pesi meno che al mare? Per rispondere conviene guardare lo spazio intorno alla Terra, punto per punto.

Metti un sasso di massa $m$ in un punto: la Terra lo attira con una forza $F$. Con massa doppia la forza raddoppia, ma il rapporto $F/m$ resta uguale. Quel rapporto dipende solo dal punto, non dal sasso.

[[video:gravitazione/campo]]

>* Il **campo gravitazionale** in un punto è la forza su ogni chilogrammo di massa messo lì: $\vec{g} = \dfrac{\vec{F}}{m}$. Si misura in N/kg. Vicino alla Terra punta verso il suo centro.

Le frecce sopra le lettere dicono che il campo è un vettore, come la forza. Il campo c'è anche se lì non c'è nessun sasso: è una proprietà dello spazio. Fuori da un corpo sferico di massa $M$, a distanza $r$ dal centro, vale

$$g = \dfrac{G \cdot M}{r^2}$$

Un newton al chilogrammo è uguale a un metro al secondo quadrato. Per un corpo che cade libero, il campo è la sua accelerazione.

[[grafico:campo-vettori]]

Salendo, $G$ e $M$ restano uguali: cambia solo $r$. Per confrontare due quote basta il rapporto delle distanze.

~ \dfrac{g_h}{g_0} = \dfrac{R^2}{r^2} :: $g_0$ al suolo, $g_h$ in quota: G e M si semplificano
~ r = 1{,}5 \cdot R :: a 3185 km di quota, mezzo raggio sopra il suolo
~ g_h = \dfrac{9{,}8\,\text{N/kg}}{1{,}5^2} \approx \evidb{4{,}4\,\text{N/kg}} :: meno della metà che al suolo

[[grafico:campo-quota]]

>! Pesare meno non vuol dire avere meno massa. Sull'Everest il peso cala di circa lo 0,3%. La massa resta la stessa.

In cima, a 8,85 km, $r$ passa da 6370 a 6378,85 km. Il campo diventa $\left( \dfrac{6370}{6378{,}85} \right)^2 \approx 0{,}997$ volte quello al mare: lo 0,3% in meno.

?? Un pianeta ha massa tripla della Terra e lo stesso raggio. Quanto vale il campo sulla sua superficie?
[ ] $9{,}8\,\text{N/kg}$, come sulla Terra
[x] $29{,}4\,\text{N/kg}$
[ ] $88{,}2\,\text{N/kg}$
=> Il campo è proporzionale alla massa, non al suo quadrato: $M$ tripla, $g$ triplo. Con lo stesso raggio, $3 \cdot 9{,}8 = 29{,}4\,\text{N/kg}$.`
    },
    {
      id: 'orbite',
      titolo: 'Satelliti in orbita',
      testo: R`Un satellite gira attorno alla Terra per anni, senza motori. Che cosa lo tiene lassù? Newton rispose con un esperimento immaginario: un cannone in cima a una montagna altissima.

[[video:gravitazione/orbita]]

Più forte si spara, più lontano cade la palla. A una certa velocità succede una cosa nuova. La Terra si incurva sotto la palla tanto quanto la palla scende. La palla cade sempre, ma non arriva mai a terra.

>* Un'**orbita** è una caduta continua: il satellite cade verso la Terra, ma intanto si sposta di lato quanto basta per non toccarla.

In un'orbita circolare di raggio $r$ la gravità fa da forza centripeta. Da qui si ricava la velocità.

~ \dfrac{G \cdot M \cdot m}{r^2} = m \cdot \dfrac{v^2}{r} :: la gravità è la forza centripeta
~ v^2 = \dfrac{G \cdot M}{r} :: si semplificano la massa del satellite e un $r$
~ v = \evidb{\sqrt{\dfrac{G \cdot M}{r}}} :: più è lontano, più è lento

La velocità non dipende dalla massa del satellite. Una stazione spaziale e una vite persa da un astronauta girano insieme. Rasente al suolo, con $r = R$, la formula dà circa 7,9 km/s: è la palla di cannone che non ricade.

[[grafico:velocita-orbitale]]

>! In orbita la gravità c'è eccome. A 400 km di quota vale ancora circa il 90% di quella al suolo. Gli astronauti galleggiano perché cadono insieme alla stazione.

?? Due satelliti sono sulla stessa orbita circolare: uno ha massa 100 kg, l'altro 2000 kg. Quale va più veloce?
[ ] quello da 2000 kg, attirato di più
[ ] quello da 100 kg, più leggero
[x] vanno alla stessa velocità
=> In $v = \sqrt{G \cdot M / r}$ la massa del satellite non c'è: si è semplificata. Conta solo la massa della Terra e il raggio dell'orbita.`
    },
    {
      id: 'periodo',
      titolo: 'Il periodo e il satellite geostazionario',
      testo: R`Il **periodo** di un satellite è il tempo di un giro: la circonferenza diviso la velocità, $T = \dfrac{2\pi \cdot r}{v}$. Unendo questa formula alla velocità dell'orbita, salta fuori la terza legge di Keplero.

~ T^2 = \dfrac{4\pi^2 \cdot r^2}{v^2} :: elevo al quadrato il periodo
~ T^2 = \dfrac{4\pi^2 \cdot r^2}{G \cdot M / r} :: al posto di $v^2$ metto $G \cdot M / r$
~ \dfrac{T^2}{r^3} = \evidb{\dfrac{4\pi^2}{G \cdot M}} :: la costante dipende solo dalla massa al centro

>* Per tutti i corpi in orbita attorno allo stesso corpo centrale, di massa $M$, vale $\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G \cdot M}$. Nelle orbite ellittiche, al posto di $r$ c'è il semiasse maggiore $a$.

Newton spiega così la legge di Keplero. Spiega anche perché la costante cambia da un sistema all'altro: dipende dalla massa del Sole, della Terra o di Giove.

La formula serve anche al contrario. Si misurano il periodo e il raggio di un'orbita, e si ricava la **massa** del corpo al centro. Così si conoscono le masse del Sole e dei pianeti che hanno lune.

Un satellite **geostazionario** sta sopra l'equatore e gira nello stesso verso della Terra. Fa un giro in 23 h 56 min, il tempo di una rotazione della Terra rispetto alle stelle. Da terra sembra fermo nel cielo. Per questo le parabole della TV restano puntate sempre nello stesso punto.

~ r^3 = \dfrac{G \cdot M \cdot T^2}{4\pi^2} :: dalla terza legge di Keplero, nella forma di Newton
~ r^3 = \dfrac{3{,}98 \cdot 10^{14} \cdot 86\,164^2}{4\pi^2}\,\text{m}^3 :: T = 23 h 56 min, in secondi
~ r^3 \approx 7{,}49 \cdot 10^{22}\,\text{m}^3 :: con G·M della Terra
~ r \approx \evidb{4{,}2 \cdot 10^7\,\text{m}} :: 42 000 km dal centro, circa 36 000 km di quota

>! Il geostazionario non sta fermo: corre a circa 3 km/s. Sembra fermo solo perché la Terra, sotto, gira con lo stesso periodo.

?? Un satellite passa a un'orbita circolare più alta. Che cosa succede al suo periodo?
[x] si allunga
[ ] resta uguale, perché la massa non cambia
[ ] si accorcia, perché la gravità è più debole
=> Il giro è più lungo e la velocità più bassa: tutte e due allungano il periodo. Lo dice anche $T^2 \propto r^3$.`
    },
    {
      id: 'energia-fuga',
      titolo: 'L\'energia potenziale e la velocità di fuga',
      testo: R`Lanci un sasso verso l'alto: più è veloce, più sale. Esiste una velocità per cui non ricade più? Per rispondere serve l'energia potenziale, anche lontano dalla Terra.

La formula $m \cdot g \cdot h$ vale vicino al suolo, dove $g$ è quasi costante. Lontano dalla Terra $g$ cala, e serve una formula diversa.

>* Un corpo di massa $m$ sta a distanza $r$ dal centro di un corpo di massa $M$. La sua **energia potenziale gravitazionale** è $E_p = -\dfrac{G \cdot M \cdot m}{r}$, con lo zero a distanza infinita.

Vicino al suolo, le sue variazioni tornano $m \cdot g \cdot h$: è la stessa energia, vista da vicino.

Nel video, come in molti libri, si chiama $U$. È sempre negativa, e sale verso lo zero allontanandosi. Per portare un corpo all'infinito bisogna fare lavoro contro la gravità. La Terra è come una **buca**.

[[video:gravitazione/fuga]]

Senza aria, un sasso lanciato verso l'alto conserva l'energia meccanica $E_m = E_c + E_p$. Se $E_m$ è negativa, a una certa quota la cinetica finisce e il sasso ricade. Se $E_m$ è zero o positiva, il sasso se ne va per sempre.

[[grafico:buca]]

La **velocità di fuga** è la velocità minima per arrivare all'infinito: l'energia totale deve essere zero.

~ \tfrac{1}{2} \cdot m \cdot v^2 - \dfrac{G \cdot M \cdot m}{R} = 0 :: energia totale zero, partendo dalla superficie
~ v^2 = \dfrac{2 \cdot G \cdot M}{R} :: la massa del sasso si semplifica
~ v = \sqrt{\dfrac{2 \cdot 3{,}98 \cdot 10^{14}}{6{,}37 \cdot 10^6}}\,\text{m/s} :: G·M della Terra, senza aria
~ v \approx \evidb{11{,}2\,\text{km/s}} :: circa 40 000 km/h, per un sasso come per un razzo

Anche un satellite ha energia negativa: è legato alla Terra. In orbita circolare $m \cdot v^2 = \dfrac{G \cdot M \cdot m}{r}$, quindi la cinetica è metà della potenziale, cambiata di segno. L'energia meccanica è $E_m = -\dfrac{G \cdot M \cdot m}{2 \cdot r}$.

>! Velocità di fuga e velocità orbitale sono diverse. Per girare rasente al suolo bastano 7,9 km/s. Per andarsene servono 11,2 km/s: $\sqrt{2}$ volte di più.

?? Un sasso viene lanciato verso l'alto, senza aria, con energia meccanica totale negativa. Che cosa succede?
[ ] si allontana per sempre, sempre più piano
[ ] si ferma a una certa quota e resta lì
[x] sale fino a una quota massima, poi ricade
=> Con $E_m < 0$ il sasso non può arrivare dove $E_p$ supera $E_m$. Lì la cinetica è finita: si ferma un istante e ricade.`
    },
    {
      id: 'universo',
      titolo: 'L\'universo in espansione',
      testo: R`La gravità tiene insieme pianeti, stelle e galassie. Ma guardando molto lontano c'è una sorpresa: le galassie si allontanano da noi.

Lo dice la loro luce. Arriva «stirata», spostata verso il rosso. Nel 1929 Edwin Hubble mise in fila le misure. Più una galassia è lontana, più in fretta si allontana.

[[video:gravitazione/universo]]

>* **Legge di Hubble**: la velocità con cui una galassia si allontana è proporzionale alla sua distanza, $v = H_0 \cdot d$. La **costante di Hubble** $H_0$ vale circa 70 km/s per megaparsec.

Un megaparsec (Mpc) è circa 3,26 milioni di anni luce. Dal 2018 la legge si chiama anche legge di Hubble–Lemaître.

~ v = H_0 \cdot d :: la legge di Hubble
~ v = 70\,\dfrac{\text{km/s}}{\text{Mpc}} \cdot 40\,\text{Mpc} :: una galassia a 40 megaparsec
~ v = \evidb{2800\,\text{km/s}} :: i megaparsec si semplificano

[[grafico:hubble]]

Non siamo al centro di niente. Da qualunque galassia si vedrebbero le altre allontanarsi nello stesso modo. È lo **spazio** stesso che si dilata, come la gomma di un palloncino che si gonfia.

Se si fa andare il film all'indietro, tutto torna in uno spazio piccolissimo e caldissimo: il **Big Bang**. Quanto tempo fa? A velocità costante, una galassia a distanza $d$ è partita da qui un tempo $t = d/v$ fa.

~ t = \dfrac{d}{v} = \dfrac{d}{H_0 \cdot d} = \dfrac{1}{H_0} :: la distanza si semplifica: è lo stesso tempo per tutte
~ \dfrac{1}{H_0} = \dfrac{3{,}086 \cdot 10^{19}\,\text{km}}{70\,\text{km/s}} :: un megaparsec in km
~ \dfrac{1}{H_0} \approx 4{,}4 \cdot 10^{17}\,\text{s} :: i km si semplificano, restano i secondi
~ t \approx \evidb{14\,\text{miliardi di anni}} :: diviso i secondi di un anno, $3{,}156 \cdot 10^7$

Le velocità non sono state sempre le stesse: le misure più precise danno 13,8 miliardi di anni.

>! Le galassie non volano via dentro uno spazio fermo, come schegge di un'esplosione. È lo spazio fra loro che cresce.

?? Una galassia è tre volte più lontana di un'altra. Con che velocità si allontana, rispetto all'altra?
[ ] alla stessa velocità
[x] tre volte più in fretta
[ ] nove volte più in fretta
=> La legge di Hubble è una proporzionalità diretta, $v = H_0 \cdot d$: distanza tripla, velocità tripla.`
    }
  ],
  grafici: {
    /* prima e seconda legge: ellisse con e = 0,5 (esagerata), due spicchi spazzati in un decimo di periodo (calcolati con
       l'equazione di Keplero, area uguale), velocità al perielio e all'afelio in rapporto 3 */
    orbita: {
      tipo: 'piano', x: [-6.3, 6.3], y: [-3.9, 3.9], assi: false, griglia: false,
      elementi: [
        { tipo: 'poligono', punti: [[2, 0], [3.315, -1.939], [3.592, -1.524], [3.81, -1.054], [3.951, -0.54], [4, 0], [3.951, 0.54], [3.81, 1.054], [3.592, 1.524], [3.315, 1.939]], colore: 3 },
        { tipo: 'poligono', punti: [[2, 0], [-3.912, 0.722], [-3.978, 0.362], [-4, 0], [-3.978, -0.362], [-3.912, -0.722]], colore: 3 },
        { tipo: 'ellisse', centro: [0, 0], a: 4, b: 3.464, colore: 'grigio' },
        { tipo: 'punto', p: [2, 0], raggio: 8, colore: 'grigio' },
        { tipo: 'testo', p: [1.8, -0.75], testo: 'Sole', ancora: 'end' },
        { tipo: 'vettore', da: [4, 0], a: [4, 1.5], etichetta: 'v_p', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [-4, 0], a: [-4, -0.5], etichetta: 'v_a', colore: 1, posizione: 'destra' },
        { tipo: 'testo', p: [4.15, -0.6], testo: 'perielio', ancora: 'start' },
        { tipo: 'testo', p: [-4.15, 0.8], testo: 'afelio', ancora: 'end' }
      ],
      didascalia: 'Un\'orbita molto più schiacciata di quelle vere, con il Sole in un fuoco; il pianeta gira in senso antiorario. Le due zone verdi sono spazzate nello stesso tempo, un decimo del periodo: hanno la stessa area. All\'afelio il pianeta è tre volte più lontano dal Sole che al perielio, e va tre volte più piano.'
    },
    /* terza legge: i sei pianeti noti a Keplero sulla curva T = a^1,5 (T in anni, a in UA) */
    periodi: {
      tipo: 'piano', x: [0, 10.5], y: [0, 32], altezza: 420, passo: [1, 5], etichette: { x: 'a (UA)', y: 'T (anni)' },
      funzioni: [{ f: 'x^1.5', dominio: [0, 10.5], colore: 'grigio', tratteggio: true }],
      punti: [
        { x: 0.387, y: 0.241, colore: 3 },
        { x: 0.723, y: 0.615, colore: 3 },
        { x: 1, y: 1, colore: 3 },
        { x: 1.524, y: 1.881, colore: 3 },
        { x: 5.203, y: 11.86, etichetta: 'Giove', posizione: 'alto-sinistra', colore: 3 },
        { x: 9.537, y: 29.46, etichetta: 'Saturno', posizione: 'sinistra', colore: 3 }
      ],
      elementi: [{ tipo: 'testo', p: [8.3, 15], testo: 'T² = a³', ancora: 'start' }],
      didascalia: 'I sei pianeti noti ai tempi di Keplero. Mercurio, Venere, Terra e Marte stanno vicino all\'origine. Tutti cadono sulla stessa curva, T² = a³, con T in anni e a in unità astronomiche.'
    },
    /* terzo principio: Terra e Luna si tirano con forze uguali e opposte; r da centro a centro */
    coppia: {
      tipo: 'piano', x: [-6, 6], y: [-2.3, 2.3], assi: false, griglia: false,
      elementi: [
        { tipo: 'cerchio', centro: [-3.6, 0], raggio: 1, colore: 'grigio', riempi: true },
        { tipo: 'cerchio', centro: [3.6, 0], raggio: 0.45, colore: 'grigio', riempi: true },
        { tipo: 'vettore', da: [-3.6, 0], a: [-0.6, 0], etichetta: 'F_T', colore: 2 },
        { tipo: 'vettore', da: [3.6, 0], a: [0.6, 0], etichetta: 'F_L', colore: 2, posizione: 'destra' },
        { tipo: 'punto', p: [-3.6, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'punto', p: [3.6, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'segmento', da: [-3.6, -1.75], a: [3.6, -1.75], colore: 'grigio', tratteggio: true, etichetta: 'r' },
        { tipo: 'segmento', da: [-3.6, -1.55], a: [-3.6, -1.95], colore: 'grigio' },
        { tipo: 'segmento', da: [3.6, -1.55], a: [3.6, -1.95], colore: 'grigio' },
        { tipo: 'testo', p: [-3.6, 1.35], testo: 'Terra' },
        { tipo: 'testo', p: [3.6, 0.8], testo: 'Luna' }
      ],
      didascalia: 'La Terra e la Luna, non in scala. La forza sulla Terra (la Luna che la tira) e la forza sulla Luna (la Terra che la tira) hanno lo stesso modulo, versi opposti, anche se la Terra ha molta più massa. La distanza r va da centro a centro.'
    },
    /* il campo come insieme di frecce verso il centro: a distanza doppia, lunghe un quarto */
    'campo-vettori': {
      tipo: 'piano', x: [-3.4, 3.4], y: [-3.4, 3.4], assi: false, griglia: false, altezza: 500,
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 0.4, colore: 'grigio', riempi: true },
        { tipo: 'cerchio', centro: [0, 0], raggio: 2, colore: 'grigio', tratteggio: true },
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [2, 0], a: [0.45, 0], colore: 4 },
        { tipo: 'vettore', da: [1.414, 1.414], a: [0.318, 0.318], colore: 4 },
        { tipo: 'vettore', da: [0, 2], a: [0, 0.45], etichetta: 'g', colore: 4 },
        { tipo: 'vettore', da: [-1.414, 1.414], a: [-0.318, 0.318], colore: 4 },
        { tipo: 'vettore', da: [-2, 0], a: [-0.45, 0], colore: 4 },
        { tipo: 'vettore', da: [-1.414, -1.414], a: [-0.318, -0.318], colore: 4 },
        { tipo: 'vettore', da: [0, -2], a: [0, -0.45], colore: 4 },
        { tipo: 'vettore', da: [1.414, -1.414], a: [0.318, -0.318], colore: 4 },
        { tipo: 'vettore', da: [3, 0], a: [2.311, 0], colore: 4 },
        { tipo: 'vettore', da: [2.121, 2.121], a: [1.634, 1.634], colore: 4 },
        { tipo: 'vettore', da: [0, 3], a: [0, 2.311], colore: 4 },
        { tipo: 'vettore', da: [-2.121, 2.121], a: [-1.634, 1.634], colore: 4 },
        { tipo: 'vettore', da: [-3, 0], a: [-2.311, 0], colore: 4 },
        { tipo: 'vettore', da: [-2.121, -2.121], a: [-1.634, -1.634], colore: 4 },
        { tipo: 'vettore', da: [0, -3], a: [0, -2.311], colore: 4 },
        { tipo: 'vettore', da: [2.121, -2.121], a: [1.634, -1.634], colore: 4 }
      ],
      didascalia: 'Il campo gravitazionale intorno alla Terra, il disco al centro: in ogni punto una freccia verso il centro. Le frecce interne sono a 5 raggi terrestri dal centro, quelle esterne a 7,5 raggi, una volta e mezza più lontano: sono lunghe 1/1,5², meno della metà.'
    },
    /* g in funzione della quota: g = 9,8·(R/(R + h))², con un punto che si sposta */
    'campo-quota': {
      tipo: 'piano', x: [0, 13000], y: [0, 12], altezza: 400, passo: [2000, 2], etichette: { x: 'h (km)', y: 'g (N/kg)' },
      parametri: [{ nome: 'h', min: 0, max: 10000, passo: 100, valore: 1000, etichetta: 'quota (km)' }],
      funzioni: [{ f: '9.8*(6370/(6370 + x))^2', dominio: [0, 13000], colore: 4 }],
      elementi: [
        { tipo: 'punto', p: ['h', '9.8*(6370/(6370 + h))^2'], colore: 4 },
        { tipo: 'testo', p: [12800, 10.6], testo: 'g = {{9.8*(6370/(6370 + h))^2}} N/kg', ancora: 'end', colore: 4 }
      ],
      didascalia: 'Il campo gravitazionale della Terra in funzione della quota: circa 9,8 N/kg al livello del mare, poi cala con l\'inverso del quadrato della distanza dal centro. Il cursore sposta il punto; il valore è scritto in alto a destra.'
    },
    /* velocità di un'orbita circolare in funzione della quota: v = √(G·M/(R + h)), in km/s */
    'velocita-orbitale': {
      tipo: 'piano', x: [0, 44000], y: [0, 10], altezza: 400, passo: [10000, 2], etichette: { x: 'h (km)', y: 'v (km/s)' },
      funzioni: [{ f: 'sqrt(398600/(6370 + x))', dominio: [0, 44000], colore: 1 }],
      punti: [
        { x: 400, y: 7.67, etichetta: 'Stazione spaziale', posizione: 'destra', colore: 1 },
        { x: 20200, y: 3.87, etichetta: 'GPS', posizione: 'alto-destra', colore: 1 },
        { x: 35790, y: 3.07, etichetta: 'geostazionario', posizione: 'basso', colore: 1 }
      ],
      didascalia: 'La velocità di un\'orbita circolare in funzione della quota. Più in alto si va più piano: la Stazione spaziale (400 km) a 7,7 km/s, i satelliti GPS (20 200 km) a 3,9 km/s, i geostazionari (35 790 km) a 3,1 km/s.'
    },
    /* la buca: E_p/m = −G·M/r in MJ/kg (r in raggi terrestri, G·M/R = 62,5 MJ/kg) e l'energia totale di un lancio
       dalla superficie; il punto (quota massima) sparisce quando E ≥ 0 o quando esce dal grafico */
    buca: {
      tipo: 'piano', x: [0, 8], y: [-70, 20], altezza: 420, passo: [1, 10], etichette: { x: 'r/R', y: 'E/m (MJ/kg)' },
      parametri: [{ nome: 'v', min: 0, max: 12, passo: 0.1, valore: 7, etichetta: 'velocità di lancio (km/s)' }],
      funzioni: [
        { f: '-62.5/x', dominio: [1, 8], colore: 3 },
        { f: 'v^2/2 - 62.5', dominio: [1, 8], colore: 3, tratteggio: true }
      ],
      elementi: [
        { tipo: 'segmento', da: [1, -70], a: [1, 5], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['62.5/(62.5 - v^2/2) + 0*sqrt(62.5 - v^2/2 - 0.01) + 0*sqrt(5 - 62.5/(62.5 - v^2/2))', 'v^2/2 - 62.5'], etichetta: 'quota massima', posizione: 'basso-destra', colore: 3 },
        { tipo: 'testo', p: [7.9, 14], testo: 'E/m = {{v^2/2 - 62.5}} MJ/kg', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Energia per ogni chilogrammo, con la distanza r dal centro misurata in raggi terrestri R. Linea piena: l\'energia potenziale, −G·M/r, una buca che sale verso lo zero. Tratteggio: l\'energia totale di un sasso lanciato in verticale dalla superficie (la riga grigia), senza aria. Il sasso sale finché il tratteggio sta sopra la buca: dove si incontrano si ferma, poi ricade. Sopra 11,2 km/s l\'energia totale è positiva, e non torna più. Il cursore cambia la velocità di lancio.'
    },
    /* la legge di Hubble, con la costante sul cursore */
    hubble: {
      tipo: 'piano', x: [0, 520], y: [0, 45000], altezza: 400, passo: [100, 10000], etichette: { x: 'd (Mpc)', y: 'v (km/s)' },
      parametri: [{ nome: 'H', min: 50, max: 90, passo: 1, valore: 70, etichetta: 'H_0 (km/s per Mpc)' }],
      funzioni: [{ f: 'H*x', dominio: [0, 500], colore: 1 }],
      elementi: [{ tipo: 'testo', p: [490, 9000], testo: 'v = {{H}}·d', ancora: 'end', colore: 1 }],
      didascalia: 'La velocità con cui le galassie si allontanano, in funzione della distanza: una retta per l\'origine, di pendenza H₀. Le misure di oggi danno H₀ fra 67 e 73 km/s per megaparsec. Il cursore cambia la costante.'
    }
  },
  esempi: [
    {
      titolo: 'L\'anno di Cerere',
      problema: R`Cerere, il pianeta nano più grande della fascia degli asteroidi, gira attorno al Sole su un'orbita con semiasse maggiore di 2,77 UA. Quanto dura il suo anno?`,
      passi: [
        R`Dati: $a = 2{,}77\,\text{UA}$. Cerco il periodo $T$, in anni.`,
        R`Cerere gira attorno al Sole come i pianeti, quindi vale la terza legge con la stessa costante della Terra. In anni e UA: $T^2 = a^3$.`,
        R`Il cubo del semiasse: $T^2 = 2{,}77^3 \approx 21{,}25$.`,
        R`La radice: $T = \sqrt{21{,}25} \approx 4{,}61$ anni.`,
        R`Controllo: Cerere sta fra Marte (1,52 UA, 1,9 anni) e Giove (5,2 UA, 11,9 anni). Anche il suo periodo sta in mezzo. Torna.`
      ],
      risultato: R`$T \approx 4{,}6$ anni`
    },
    {
      titolo: 'La forza fra la Terra e la Luna',
      problema: R`La Terra ha massa $5{,}97 \cdot 10^{24}\,\text{kg}$, la Luna $7{,}35 \cdot 10^{22}\,\text{kg}$. I loro centri distano in media 384 000 km. Con che forza si attraggono? Che accelerazione dà questa forza alla Luna?`,
      passi: [
        R`Dati: $M = 5{,}97 \cdot 10^{24}\,\text{kg}$, $m_L = 7{,}35 \cdot 10^{22}\,\text{kg}$, $r = 384\,000\,\text{km}$. Cerco la forza $F$ e l'accelerazione $a_L$ della Luna.`,
        R`Con $G$ servono i metri: $r = 384\,000\,\text{km} = 3{,}84 \cdot 10^8\,\text{m}$.`,
        R`Il numeratore della legge di Newton: $G \cdot M \cdot m_L = 6{,}67 \cdot 10^{-11} \cdot 5{,}97 \cdot 10^{24} \cdot 7{,}35 \cdot 10^{22} \approx 2{,}93 \cdot 10^{37}\,\text{N} \cdot \text{m}^2$.`,
        R`La forza: $F = \dfrac{2{,}93 \cdot 10^{37}\,\text{N} \cdot \text{m}^2}{(3{,}84 \cdot 10^8\,\text{m})^2} \approx 1{,}98 \cdot 10^{20}\,\text{N}$.`,
        R`Il secondo principio per la Luna: $a_L = \dfrac{F}{m_L} = \dfrac{1{,}98 \cdot 10^{20}\,\text{N}}{7{,}35 \cdot 10^{22}\,\text{kg}} \approx 2{,}7 \cdot 10^{-3}\,\text{m/s}^2$.`,
        R`Controllo: è il valore $g/3600$ della sezione «Dalla mela alla Luna». Torna. La stessa forza, sulla Terra che ha molta più massa, dà appena $3{,}3 \cdot 10^{-5}\,\text{m/s}^2$.`
      ],
      risultato: R`$F \approx 1{,}98 \cdot 10^{20}\,\text{N}$; $a_L \approx 2{,}7 \cdot 10^{-3}\,\text{m/s}^2$`
    },
    {
      titolo: 'Quanto pesi su Marte',
      problema: R`Marte ha massa $6{,}42 \cdot 10^{23}\,\text{kg}$ e raggio 3390 km. Quanto vale il campo gravitazionale sulla sua superficie? Quanto pesa lì una persona di 60 kg?`,
      passi: [
        R`Dati: $M = 6{,}42 \cdot 10^{23}\,\text{kg}$, $R = 3390\,\text{km}$, $m = 60\,\text{kg}$. Cerco il campo $g$ su Marte e il peso $P$.`,
        R`Il raggio in metri: $R = 3{,}39 \cdot 10^6\,\text{m}$.`,
        R`Prima il prodotto: $G \cdot M = 6{,}67 \cdot 10^{-11} \cdot 6{,}42 \cdot 10^{23} \approx 4{,}28 \cdot 10^{13}\,\text{m}^3/\text{s}^2$.`,
        R`Il campo sulla superficie: $g = \dfrac{G \cdot M}{R^2} = \dfrac{4{,}28 \cdot 10^{13}}{(3{,}39 \cdot 10^6)^2}\,\text{N/kg} \approx 3{,}73\,\text{N/kg}$.`,
        R`Il peso è massa per campo: $P = m \cdot g = 60\,\text{kg} \cdot 3{,}73\,\text{N/kg} \approx 224\,\text{N}$.`,
        R`Controllo: sulla Terra la stessa persona pesa $60 \cdot 9{,}8 = 588\,\text{N}$. Su Marte pesa poco più di un terzo. La massa resta 60 kg.`
      ],
      risultato: R`$g \approx 3{,}73\,\text{N/kg}$; $P \approx 224\,\text{N}$`
    },
    {
      titolo: 'Un satellite a 1000 km di quota',
      problema: R`Un satellite gira in orbita circolare a 1000 km sopra la superficie della Terra. Con che velocità? Quanto dura un giro?`,
      passi: [
        R`Dati: quota $h = 1000\,\text{km}$, $M = 5{,}97 \cdot 10^{24}\,\text{kg}$, $R = 6370\,\text{km}$. Cerco la velocità $v$ e il periodo $T$.`,
        R`Il raggio dell'orbita si misura dal centro della Terra: $r = R + h = 7370\,\text{km} = 7{,}37 \cdot 10^6\,\text{m}$.`,
        R`La gravità fa da forza centripeta, con $G \cdot M = 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$: $v = \sqrt{\dfrac{3{,}98 \cdot 10^{14}}{7{,}37 \cdot 10^6}}\,\text{m/s} \approx 7350\,\text{m/s}$.`,
        R`Il periodo è la circonferenza diviso la velocità: $T = \dfrac{2\pi \cdot 7{,}37 \cdot 10^6\,\text{m}}{7350\,\text{m/s}} \approx 6300\,\text{s}$, cioè circa 105 minuti.`,
        R`Controllo: va un po' più piano dei 7,9 km/s rasente al suolo. È giusto: più in alto si va più piano.`
      ],
      risultato: R`$v \approx 7{,}35\,\text{km/s}$; $T \approx 105\,\text{min}$`
    },
    {
      titolo: 'La massa della Terra misurata con la Luna',
      problema: R`La Luna gira attorno alla Terra in 27,3 giorni, su un'orbita quasi circolare di raggio $3{,}84 \cdot 10^8\,\text{m}$. Quanto vale la massa della Terra?`,
      passi: [
        R`Dati: $T = 27{,}3$ giorni, $r = 3{,}84 \cdot 10^8\,\text{m}$. Cerco la massa $M$ della Terra.`,
        R`Il periodo in secondi: $T = 27{,}3 \cdot 86\,400\,\text{s} \approx 2{,}36 \cdot 10^6\,\text{s}$.`,
        R`Dalla terza legge scritta da Newton, $\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G \cdot M}$, ricavo la massa: $M = \dfrac{4\pi^2 \cdot r^3}{G \cdot T^2}$.`,
        R`Le potenze: $r^3 \approx 5{,}66 \cdot 10^{25}\,\text{m}^3$ e $T^2 \approx 5{,}57 \cdot 10^{12}\,\text{s}^2$.`,
        R`Metto i numeri: $M = \dfrac{4\pi^2 \cdot 5{,}66 \cdot 10^{25}}{6{,}67 \cdot 10^{-11} \cdot 5{,}57 \cdot 10^{12}}\,\text{kg} \approx 6{,}0 \cdot 10^{24}\,\text{kg}$.`,
        R`Controllo: le tabelle danno $5{,}97 \cdot 10^{24}\,\text{kg}$. La formula, a rigore, dà la somma delle due masse, Terra più Luna. La Luna è circa l'1% della Terra: da lì viene la differenza.`
      ],
      risultato: R`$M \approx 6{,}0 \cdot 10^{24}\,\text{kg}$`
    },
    {
      titolo: 'Andarsene dalla Luna',
      problema: R`La Luna ha massa $7{,}35 \cdot 10^{22}\,\text{kg}$ e raggio 1737 km. Qual è la velocità di fuga dalla sua superficie?`,
      passi: [
        R`Dati: $M_L = 7{,}35 \cdot 10^{22}\,\text{kg}$, $R_L = 1737\,\text{km} = 1{,}737 \cdot 10^6\,\text{m}$. Cerco la velocità di fuga $v_f$.`,
        R`Alla velocità di fuga l'energia totale è zero: $\tfrac{1}{2} \cdot m \cdot v_f^2 = \dfrac{G \cdot M_L \cdot m}{R_L}$, quindi $v_f = \sqrt{\dfrac{2 \cdot G \cdot M_L}{R_L}}$.`,
        R`Prima il numeratore: $2 \cdot G \cdot M_L = 2 \cdot 6{,}67 \cdot 10^{-11} \cdot 7{,}35 \cdot 10^{22} \approx 9{,}80 \cdot 10^{12}\,\text{m}^3/\text{s}^2$.`,
        R`Poi la radice: $v_f = \sqrt{\dfrac{9{,}80 \cdot 10^{12}}{1{,}737 \cdot 10^6}}\,\text{m/s} \approx 2380\,\text{m/s}$.`,
        R`Confronto: dalla Terra servono 11,2 km/s, quasi cinque volte tanto. E sulla Luna non c'è aria che frena.`
      ],
      risultato: R`$v_f \approx 2{,}4\,\text{km/s}$`
    }
  ],
  formulario: [
    { nome: 'Terza legge di Keplero', formula: R`\dfrac{T^2}{a^3} = \text{costante}`, nota: R`Uguale per tutti i corpi che girano attorno allo stesso centro. Per il Sole, in anni e UA, vale 1.` },
    { nome: 'Seconda legge al perielio e all\'afelio', formula: R`r_p \cdot v_p = r_a \cdot v_a`, nota: R`Aree uguali in tempi uguali: più vicino al Sole, più veloce.` },
    { nome: 'Gravitazione universale', formula: R`F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}`, nota: R`Attrattiva, lungo la retta che unisce i corpi. $r$ è la distanza fra i centri.` },
    { nome: 'Costante di gravitazione', formula: R`G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2`, nota: R`La stessa in tutto l'universo. Con $G$ si usano kg, m, s.` },
    { nome: 'Massa della Terra', formula: R`M = 5{,}97 \cdot 10^{24}\,\text{kg}`, nota: R`Il prodotto $G \cdot M$ vale $3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$.` },
    { nome: 'Raggio della Terra', formula: R`R = 6370\,\text{km}`, nota: R`La Luna dista circa 60 raggi terrestri, 384 000 km.` },
    { nome: 'Campo gravitazionale', formula: R`g = \dfrac{F}{m} \qquad g = \dfrac{G \cdot M}{r^2}`, nota: R`In N/kg, cioè $\text{m/s}^2$. Verso il centro; la seconda formula vale fuori da un corpo sferico.` },
    { nome: 'Campo in quota', formula: R`g_h = g_0 \cdot \dfrac{R^2}{(R + h)^2}`, nota: R`$g_0 \approx 9{,}8\,\text{N/kg}$ al suolo, $h$ la quota.` },
    { nome: 'Velocità e periodo in orbita circolare', formula: R`v = \sqrt{\dfrac{G \cdot M}{r}} \qquad T = \dfrac{2\pi \cdot r}{v}`, nota: R`Dalla gravità uguale alla forza centripeta. Non dipendono dalla massa del satellite.` },
    { nome: 'Terza legge di Keplero secondo Newton', formula: R`\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G \cdot M}`, nota: R`$M$ è la massa del corpo al centro: si ricava da periodo e raggio di un'orbita.` },
    { nome: 'Energia potenziale gravitazionale', formula: R`E_p = -\dfrac{G \cdot M \cdot m}{r}`, nota: R`Zero all'infinito, sempre negativa. Vicino al suolo le sue variazioni valgono circa $m \cdot g \cdot h$.` },
    { nome: 'Energia meccanica in orbita circolare', formula: R`E_m = -\dfrac{G \cdot M \cdot m}{2 \cdot r}`, nota: R`Negativa: il satellite è legato. La cinetica è metà della potenziale, cambiata di segno.` },
    { nome: 'Velocità di fuga', formula: R`v_f = \sqrt{\dfrac{2 \cdot G \cdot M}{R}}`, nota: R`Senza aria. Dalla Terra $11{,}2\,\text{km/s}$, $\sqrt{2}$ volte la velocità orbitale rasente.` },
    { nome: 'Legge di Hubble', formula: R`v = H_0 \cdot d`, nota: R`$H_0 \approx 70$ km/s per megaparsec. L'età dell'universo è circa $1/H_0$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'keplero', tipo: 'definizione', fronte: R`Che cosa dice la **prima legge di Keplero**?`, retro: R`Ogni pianeta percorre un'ellisse, con il Sole in uno dei due fuochi.` },
    { id: 'fc-02', sezione: 'keplero', tipo: 'concetto', fronte: R`Che cosa dice la **seconda legge di Keplero**? Dove va più veloce un pianeta?`, retro: R`Il segmento Sole–pianeta spazza aree uguali in tempi uguali. Quindi il pianeta è più veloce al perielio, più lento all'afelio.` },
    { id: 'fc-03', sezione: 'keplero', tipo: 'formula', fronte: R`La **terza legge di Keplero**`, retro: R`$\dfrac{T^2}{a^3}$ è lo stesso per tutti i pianeti del Sole. In anni e UA, $T^2 = a^3$.` },
    { id: 'fc-04', sezione: 'keplero', tipo: 'definizione', fronte: R`Che cos'è un'**unità astronomica** (UA)?`, retro: R`La distanza media fra la Terra e il Sole, circa 150 milioni di km.` },
    { id: 'fc-05', sezione: 'gravitazione-universale', tipo: 'formula', fronte: R`La **legge di gravitazione universale**`, retro: R`$F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}$: attrattiva, lungo la retta che unisce i due corpi.` },
    { id: 'fc-06', sezione: 'gravitazione-universale', tipo: 'concetto', fronte: R`Quanto vale $G$? Perché non sentiamo l'attrazione fra due persone?`, retro: R`$G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$. È così piccola che fra masse di pochi chilogrammi la forza è minuscola.` },
    { id: 'fc-07', sezione: 'gravitazione-universale', tipo: 'concetto', fronte: R`Se la distanza fra i centri raddoppia, che cosa succede alla forza di gravità?`, retro: R`Diventa un quarto: è inversamente proporzionale al quadrato della distanza. Con distanza tripla, un nono.` },
    { id: 'fc-08', sezione: 'gravitazione-universale', tipo: 'concetto', fronte: R`La Terra attira la Luna più di quanto la Luna attiri la Terra?`, retro: R`No: per il terzo principio le due forze sono uguali e opposte. La Luna accelera di più perché ha meno massa.` },
    { id: 'fc-09', sezione: 'gravitazione-universale', tipo: 'concetto', fronte: R`Nella legge di gravitazione, che cos'è $r$ per due corpi sferici?`, retro: R`La distanza fra i centri, non fra le superfici. Per un oggetto sul suolo è il raggio della Terra.` },
    { id: 'fc-10', sezione: 'mela-luna', tipo: 'concetto', fronte: R`Perché nella formula $g = \dfrac{G \cdot M}{R^2}$ non c'è la massa del corpo che cade?`, retro: R`La forza di gravità è proporzionale alla massa, e nel secondo principio la massa si semplifica: $a = \dfrac{G \cdot M}{R^2} = g$.` },
    { id: 'fc-11', sezione: 'mela-luna', tipo: 'procedura', fronte: R`Come controllò Newton che la gravità arriva fino alla Luna?`, retro: R`La Luna è a 60 raggi terrestri: la sua accelerazione deve essere $g/60^2 \approx 2{,}7 \cdot 10^{-3}\,\text{m/s}^2$. È proprio la sua accelerazione centripeta.` },
    { id: 'fc-12', sezione: 'campo', tipo: 'definizione', fronte: R`Che cos'è il **campo gravitazionale** in un punto?`, retro: R`La forza su ogni chilogrammo di massa messo in quel punto: $\vec{g} = \vec{F}/m$, in N/kg. È una proprietà dello spazio.` },
    { id: 'fc-13', sezione: 'campo', tipo: 'formula', fronte: R`Il campo gravitazionale di un corpo sferico di massa $M$`, retro: R`$g = \dfrac{G \cdot M}{r^2}$, a distanza $r$ dal centro, verso il centro. Sulla Terra, al suolo, circa $9{,}8\,\text{N/kg}$.` },
    { id: 'fc-14', sezione: 'campo', tipo: 'concetto', fronte: R`Sull'Everest pesi meno che al mare. Hai anche meno massa?`, retro: R`No. Il campo è un po' più debole, quindi il peso cala, di circa lo 0,3%. La massa resta la stessa.` },
    { id: 'fc-15', sezione: 'orbite', tipo: 'definizione', fronte: R`Che cos'è un'**orbita**, secondo il cannone di Newton?`, retro: R`Una caduta continua: il satellite cade verso la Terra, ma si sposta di lato quanto basta per non toccarla mai.` },
    { id: 'fc-16', sezione: 'orbite', tipo: 'formula', fronte: R`La velocità di un'**orbita circolare** di raggio $r$`, retro: R`$v = \sqrt{\dfrac{G \cdot M}{r}}$, dalla gravità uguale alla forza centripeta. Non dipende dalla massa del satellite.` },
    { id: 'fc-17', sezione: 'orbite', tipo: 'concetto', fronte: R`Perché gli astronauti galleggiano nella Stazione spaziale?`, retro: R`Perché cadono insieme alla stazione. La gravità lassù c'è: a 400 km vale circa il 90% di quella al suolo.` },
    { id: 'fc-18', sezione: 'periodo', tipo: 'formula', fronte: R`La terza legge di Keplero ricavata da Newton`, retro: R`$\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G \cdot M}$: la costante dipende solo dalla massa $M$ del corpo al centro.` },
    { id: 'fc-19', sezione: 'periodo', tipo: 'definizione', fronte: R`Che cos'è un satellite **geostazionario**?`, retro: R`Un satellite sopra l'equatore che fa un giro in un giorno, come la Terra: da terra sembra fermo. Vola a circa 36 000 km di quota.` },
    { id: 'fc-20', sezione: 'energia-fuga', tipo: 'formula', fronte: R`L'**energia potenziale gravitazionale** lontano dalla Terra`, retro: R`$E_p = -\dfrac{G \cdot M \cdot m}{r}$, con lo zero a distanza infinita: è sempre negativa.` },
    { id: 'fc-21', sezione: 'energia-fuga', tipo: 'formula', fronte: R`La **velocità di fuga** da un pianeta`, retro: R`$v_f = \sqrt{\dfrac{2 \cdot G \cdot M}{R}}$, con energia totale zero. Dalla Terra, senza aria, $11{,}2\,\text{km/s}$.` },
    { id: 'fc-22', sezione: 'energia-fuga', tipo: 'concetto', fronte: R`Un corpo lanciato verso l'alto torna indietro o no?`, retro: R`Dipende dall'energia meccanica totale: se è negativa torna, se è zero o positiva se ne va per sempre.` },
    { id: 'fc-23', sezione: 'universo', tipo: 'formula', fronte: R`La **legge di Hubble**`, retro: R`$v = H_0 \cdot d$: le galassie si allontanano con velocità proporzionale alla distanza. $H_0 \approx 70$ km/s per megaparsec.` },
    { id: 'fc-24', sezione: 'universo', tipo: 'concetto', fronte: R`Quanti anni ha l'universo, e come si stima?`, retro: R`Circa 13,8 miliardi di anni. Una stima veloce è $1/H_0$, circa 14 miliardi di anni: il tempo dal Big Bang.` },
    { id: 'fc-25', sezione: 'keplero', tipo: 'concetto', fronte: R`Sistema **geocentrico** e sistema **eliocentrico**: che cosa dicono, e chi li propose?`, retro: R`Geocentrico: la Terra ferma al centro, i pianeti sugli epicicli (Tolomeo, II secolo d.C.). Eliocentrico: il Sole al centro, la Terra gli gira attorno (Copernico, 1543).` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Due masse di 2000 kg e 3000 kg hanno i centri a 2 m di distanza. Con che forza si attraggono? ($G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$)`, suggerimenti: [R`$F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}$.`, R`Il prodotto delle masse è $6 \cdot 10^6$, il quadrato della distanza è 4.`], risposta: { tipo: 'numero', valore: 0.0001, unita: 'N' }, soluzione: [R`$F = \dfrac{G \cdot m_1 \cdot m_2}{r^2}$, con $m_1 \cdot m_2 = 6 \cdot 10^6\,\text{kg}^2$ e $r^2 = 4\,\text{m}^2$.`, R`$F = \dfrac{6{,}67 \cdot 10^{-11} \cdot 6 \cdot 10^6}{4}\,\text{N} \approx 1{,}0 \cdot 10^{-4}\,\text{N}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Due corpi si attraggono con una forza di 48 N. Quanto vale la forza se la distanza fra i centri diventa quattro volte più grande?`, suggerimenti: [R`La forza va con l'inverso del quadrato della distanza.`], risposta: { tipo: 'numero', valore: 3, unita: 'N' }, soluzione: [R`Distanza quattro volte: forza divisa per $4^2 = 16$. $F = \dfrac{48\,\text{N}}{16} = 3\,\text{N}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Due corpi si attraggono con una forza di 20 N. Una delle due masse triplica, la distanza resta la stessa. Quanto vale ora la forza?`, suggerimenti: [R`La forza è direttamente proporzionale a ciascuna massa.`], risposta: { tipo: 'numero', valore: 60, unita: 'N' }, soluzione: [R`Massa tripla, forza tripla: $F = 3 \cdot 20\,\text{N} = 60\,\text{N}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Due corpi si attraggono con una forza di 25 N. La distanza fra i loro centri si dimezza. Quanto vale ora la forza?`, suggerimenti: [R`Distanza divisa per 2: la forza si moltiplica per $2^2$.`], risposta: { tipo: 'numero', valore: 100, unita: 'N' }, soluzione: [R`Con la distanza dimezzata, $r^2$ diventa un quarto e la forza quattro volte tanto: $4 \cdot 25\,\text{N} = 100\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un astronauta pesa 800 N sulla superficie della Terra. Quanto pesa a una distanza dal centro della Terra pari a 5 raggi terrestri?`, suggerimenti: [R`Sul suolo la distanza dal centro è 1 raggio. A 5 raggi la distanza è cinque volte tanto.`], risposta: { tipo: 'numero', valore: 32, unita: 'N' }, soluzione: [R`Distanza dal centro cinque volte: forza divisa per $5^2 = 25$. $P = \dfrac{800\,\text{N}}{25} = 32\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un asteroide gira attorno al Sole su un'orbita con semiasse maggiore di 4 UA. Quanti anni dura il suo giro?`, suggerimenti: [R`In anni e UA, per i corpi che girano attorno al Sole, $T^2 = a^3$.`], risposta: { tipo: 'numero', valore: 8, unita: 'a' }, soluzione: [R`$T^2 = 4^3 = 64$, quindi $T = \sqrt{64} = 8$ anni.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Una cometa gira attorno al Sole in 27 anni. Quanto vale il semiasse maggiore della sua orbita, in UA?`, suggerimenti: [R`Da $T^2 = a^3$: $a$ è la radice cubica di $T^2$.`], risposta: { tipo: 'numero', valore: 9, unita: 'UA' }, soluzione: [R`$a^3 = T^2 = 27^2 = 729$.`, R`$a = \sqrt[3]{729} = 9$ UA, perché $9 \cdot 9 \cdot 9 = 729$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Una cometa al perielio dista 0,5 UA dal Sole e va a 60 km/s. All'afelio dista 30 UA. Con che velocità va all'afelio?`, suggerimenti: [R`Al perielio e all'afelio vale $r_p \cdot v_p = r_a \cdot v_a$.`], risposta: { tipo: 'numero', valore: 1, unita: 'km/s' }, soluzione: [R`$v_a = \dfrac{r_p \cdot v_p}{r_a} = \dfrac{0{,}5 \cdot 60}{30}\,\text{km/s} = 1\,\text{km/s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Su un pianeta, un sasso di 5 kg è attirato con una forza di 44 N. Quanto vale il campo gravitazionale in quel punto?`, suggerimenti: [R`Il campo è la forza su ogni chilogrammo: $g = F/m$.`], risposta: { tipo: 'numero', valore: 8.8, unita: 'N/kg' }, soluzione: [R`$g = \dfrac{F}{m} = \dfrac{44\,\text{N}}{5\,\text{kg}} = 8{,}8\,\text{N/kg}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Al livello del mare il campo gravitazionale vale $9{,}8\,\text{N/kg}$. Quanto vale a una distanza dal centro della Terra pari a 10 raggi terrestri?`, suggerimenti: [R`Il campo va con l'inverso del quadrato della distanza dal centro.`], risposta: { tipo: 'numero', valore: 0.098, unita: 'N/kg' }, soluzione: [R`Distanza 10 volte: campo diviso per $10^2 = 100$. $g = \dfrac{9{,}8}{100}\,\text{N/kg} = 0{,}098\,\text{N/kg}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Un pianeta ha la stessa massa della Terra e metà del suo raggio. Quanto vale il campo gravitazionale sulla sua superficie? (Sulla Terra $9{,}8\,\text{N/kg}$.)`, suggerimenti: [R`$g = \dfrac{G \cdot M}{R^2}$: con $M$ uguale conta solo il raggio.`, R`Raggio metà: $R^2$ diventa un quarto.`], risposta: { tipo: 'numero', valore: 39.2, unita: 'N/kg' }, soluzione: [R`Con il raggio dimezzato, $R^2$ è un quarto e il campo quattro volte tanto: $4 \cdot 9{,}8 = 39{,}2\,\text{N/kg}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Un pianeta ha massa doppia e raggio doppio rispetto alla Terra. Quanto vale il campo gravitazionale sulla sua superficie? (Sulla Terra $9{,}8\,\text{N/kg}$.)`, suggerimenti: [R`Massa doppia: campo per 2. Raggio doppio: campo diviso per 4.`], risposta: { tipo: 'numero', valore: 4.9, unita: 'N/kg' }, soluzione: [R`$g = 9{,}8 \cdot \dfrac{2}{2^2}\,\text{N/kg} = 9{,}8 \cdot \dfrac{1}{2}\,\text{N/kg} = 4{,}9\,\text{N/kg}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un satellite gira attorno alla Terra su un'orbita circolare di raggio $1{,}6 \cdot 10^7\,\text{m}$. Con che velocità? Usa $G \cdot M = 4{,}0 \cdot 10^{14}\,\text{m}^3/\text{s}^2$.`, suggerimenti: [R`$v = \sqrt{\dfrac{G \cdot M}{r}}$.`, R`$\dfrac{4{,}0 \cdot 10^{14}}{1{,}6 \cdot 10^7} = 2{,}5 \cdot 10^7$.`], risposta: { tipo: 'numero', valore: 5000, unita: 'm/s' }, soluzione: [R`$v = \sqrt{\dfrac{4{,}0 \cdot 10^{14}}{1{,}6 \cdot 10^7}}\,\text{m/s} = \sqrt{2{,}5 \cdot 10^7}\,\text{m/s} = 5000\,\text{m/s}$, cioè 5 km/s.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un satellite percorre un'orbita circolare di raggio 7000 km a 7,5 km/s. Quanto dura un giro, in minuti?`, suggerimenti: [R`Il periodo è la circonferenza diviso la velocità: $T = \dfrac{2\pi \cdot r}{v}$.`, R`Con km e km/s il tempo esce in secondi.`], risposta: { tipo: 'numero', valore: 97.7, unita: 'min' }, soluzione: [R`$T = \dfrac{2\pi \cdot 7000\,\text{km}}{7{,}5\,\text{km/s}} \approx 5864\,\text{s}$.`, R`In minuti: $T = \dfrac{5864}{60}\,\text{min} \approx 97{,}7\,\text{min}$, poco più di un'ora e mezza.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Un satellite su un'orbita circolare di raggio $r$ fa un giro in 2 h. Quanto dura il giro di un satellite su un'orbita di raggio $4 \cdot r$ attorno alla Terra?`, suggerimenti: [R`Per la terza legge $T^2$ è proporzionale a $r^3$.`, R`Raggio 4 volte: $r^3$ diventa 64 volte, $T$ diventa $\sqrt{64} = 8$ volte.`], risposta: { tipo: 'numero', valore: 16, unita: 'h' }, soluzione: [R`$T^2$ cresce come $r^3$: con raggio quadruplo, $T^2$ diventa $4^3 = 64$ volte tanto.`, R`Il periodo diventa $\sqrt{64} = 8$ volte tanto: $T = 8 \cdot 2\,\text{h} = 16\,\text{h}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un satellite di 100 kg si trova a $8{,}0 \cdot 10^6\,\text{m}$ dal centro della Terra. Quanto vale la sua energia potenziale gravitazionale, in gigajoule, con lo zero all'infinito? Usa $G \cdot M = 4{,}0 \cdot 10^{14}\,\text{m}^3/\text{s}^2$.`, suggerimenti: [R`$E_p = -\dfrac{G \cdot M \cdot m}{r}$: non dimenticare il segno.`], risposta: { tipo: 'numero', valore: -5, unita: 'GJ' }, soluzione: [R`$E_p = -\dfrac{4{,}0 \cdot 10^{14} \cdot 100}{8{,}0 \cdot 10^6}\,\text{J} = -5{,}0 \cdot 10^9\,\text{J} = -5{,}0\,\text{GJ}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un pianeta senza aria ha $G \cdot M = 3{,}2 \cdot 10^{13}\,\text{m}^3/\text{s}^2$ e raggio $4{,}0 \cdot 10^6\,\text{m}$. Qual è la velocità di fuga dalla sua superficie?`, suggerimenti: [R`$v_f = \sqrt{\dfrac{2 \cdot G \cdot M}{R}}$.`], risposta: { tipo: 'numero', valore: 4000, unita: 'm/s' }, soluzione: [R`$v_f = \sqrt{\dfrac{2 \cdot 3{,}2 \cdot 10^{13}}{4{,}0 \cdot 10^6}}\,\text{m/s} = \sqrt{1{,}6 \cdot 10^7}\,\text{m/s} = 4000\,\text{m/s}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Su un pianeta senza aria, la velocità di un'orbita circolare rasente al suolo è 3 km/s. Quanto vale la velocità di fuga dalla superficie?`, suggerimenti: [R`Confronta $\sqrt{G \cdot M / R}$ e $\sqrt{2 \cdot G \cdot M / R}$.`], risposta: { tipo: 'numero', valore: 4.24, unita: 'km/s' }, soluzione: [R`La velocità di fuga è $\sqrt{2}$ volte la velocità orbitale rasente.`, R`$v_f = \sqrt{2} \cdot 3\,\text{km/s} \approx 4{,}24\,\text{km/s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Una galassia è a 10 Mpc da noi. Con che velocità si allontana? Usa $H_0 = 70$ km/s per megaparsec.`, suggerimenti: [R`Legge di Hubble: $v = H_0 \cdot d$.`], risposta: { tipo: 'numero', valore: 700, unita: 'km/s' }, soluzione: [R`$v = 70\,\dfrac{\text{km/s}}{\text{Mpc}} \cdot 10\,\text{Mpc} = 700\,\text{km/s}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Una galassia si allontana da noi a 3500 km/s. A che distanza si trova, in megaparsec? Usa $H_0 = 70$ km/s per megaparsec.`, suggerimenti: [R`Da $v = H_0 \cdot d$ ricava $d$.`], risposta: { tipo: 'numero', valore: 50, unita: 'Mpc' }, soluzione: [R`$d = \dfrac{v}{H_0} = \dfrac{3500}{70}\,\text{Mpc} = 50\,\text{Mpc}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`La Terra gira attorno al Sole in un anno, $3{,}156 \cdot 10^7\,\text{s}$, su un'orbita quasi circolare di raggio $1{,}496 \cdot 10^{11}\,\text{m}$. Quanto vale la massa del Sole?`, suggerimenti: [R`Usa la terza legge scritta da Newton: $\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G \cdot M}$.`, R`Ricava $M = \dfrac{4\pi^2 \cdot r^3}{G \cdot T^2}$.`], risposta: { tipo: 'numero', valore: 1.99e30, unita: 'kg' }, soluzione: [R`Le potenze: $r^3 \approx 3{,}35 \cdot 10^{33}\,\text{m}^3$ e $T^2 \approx 9{,}96 \cdot 10^{14}\,\text{s}^2$.`, R`$M = \dfrac{4\pi^2 \cdot r^3}{G \cdot T^2} = \dfrac{4\pi^2 \cdot 3{,}35 \cdot 10^{33}}{6{,}67 \cdot 10^{-11} \cdot 9{,}96 \cdot 10^{14}}\,\text{kg}$.`, R`$M \approx 1{,}99 \cdot 10^{30}\,\text{kg}$: circa 330 000 volte la massa della Terra.`] },
    { id: 'es-02', difficolta: 3, testo: R`Un satellite in orbita circolare fa un giro in 6 ore esatte. A che quota vola sopra la superficie della Terra? ($M = 5{,}97 \cdot 10^{24}\,\text{kg}$, $R = 6370\,\text{km}$)`, suggerimenti: [R`Dalla terza legge: $r^3 = \dfrac{G \cdot M \cdot T^2}{4\pi^2}$, con $T$ in secondi.`, R`Trovato $r$, la quota è $r - R$.`], risposta: { tipo: 'numero', valore: 10400, unita: 'km', tolleranza: 150 }, soluzione: [R`$T = 6 \cdot 3600\,\text{s} = 21\,600\,\text{s}$.`, R`Con $G \cdot M = 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$: $r^3 = \dfrac{3{,}98 \cdot 10^{14} \cdot 21\,600^2}{4\pi^2}\,\text{m}^3 \approx 4{,}70 \cdot 10^{21}\,\text{m}^3$.`, R`La radice cubica: $r \approx 1{,}68 \cdot 10^7\,\text{m} = 16\,760\,\text{km}$.`, R`Quota: $h = 16\,760\,\text{km} - 6370\,\text{km} \approx 10\,400\,\text{km}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`La Terra ha massa 81 volte quella della Luna, e i due centri distano 384 000 km. In un punto della retta che li unisce, una sonda è attirata con la stessa forza dalla Terra e dalla Luna. A che distanza dal centro della Terra?`, suggerimenti: [R`Chiama $x$ la distanza dalla Terra: dalla Luna la distanza è $384\,000 - x$.`, R`Uguaglia le due forze: $\dfrac{M}{x^2} = \dfrac{M/81}{(384\,000 - x)^2}$. Poi prendi le radici quadrate.`], risposta: { tipo: 'numero', valore: 345600, unita: 'km' }, soluzione: [R`$\dfrac{G \cdot M \cdot m}{x^2} = \dfrac{G \cdot (M/81) \cdot m}{(D - x)^2}$, con $D = 384\,000\,\text{km}$.`, R`Si semplificano $G$, $M$ e $m$: $(D - x)^2 = \dfrac{x^2}{81}$, cioè $D - x = \dfrac{x}{9}$.`, R`$D = \dfrac{10}{9} \cdot x$, quindi $x = 0{,}9 \cdot D = 345\,600\,\text{km}$: molto più vicino alla Luna.`] },
    { id: 'es-04', difficolta: 2, testo: R`A che quota sopra la superficie della Terra il tuo peso diventa la metà di quello al suolo? ($R = 6370\,\text{km}$)`, suggerimenti: [R`Peso metà vuol dire $r^2 = 2 \cdot R^2$.`, R`Quindi $r = \sqrt{2} \cdot R$, e la quota è $r - R$.`], risposta: { tipo: 'numero', valore: 2640, unita: 'km' }, soluzione: [R`$\dfrac{R^2}{r^2} = \dfrac{1}{2} \Rightarrow r = \sqrt{2} \cdot R \approx 1{,}414 \cdot 6370\,\text{km} \approx 9010\,\text{km}$.`, R`Quota: $h = r - R \approx 9010\,\text{km} - 6370\,\text{km} = 2640\,\text{km}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un satellite di 1000 kg viene portato dal suolo a 300 km di quota. Di quanto aumenta la sua energia potenziale gravitazionale? Usa $E_p = -G \cdot M \cdot m / r$, con $M = 5{,}97 \cdot 10^{24}\,\text{kg}$ e $R = 6370\,\text{km}$. Poi confronta con $m \cdot g \cdot h$.`, suggerimenti: [R`Calcola $E_p$ a $r = 6{,}37 \cdot 10^6\,\text{m}$ e a $r = 6{,}67 \cdot 10^6\,\text{m}$, poi fai finale meno iniziale.`], risposta: { tipo: 'numero', valore: 2.81e9, unita: 'J' }, soluzione: [R`Il numeratore: $G \cdot M \cdot m \approx 3{,}98 \cdot 10^{17}\,\text{J} \cdot \text{m}$.`, R`Al suolo: $E_p = -\dfrac{3{,}98 \cdot 10^{17}}{6{,}37 \cdot 10^6}\,\text{J} \approx -6{,}248 \cdot 10^{10}\,\text{J}$.`, R`In quota: $E_p = -\dfrac{3{,}98 \cdot 10^{17}}{6{,}67 \cdot 10^6}\,\text{J} \approx -5{,}967 \cdot 10^{10}\,\text{J}$.`, R`$\Delta E_p \approx 0{,}281 \cdot 10^{10}\,\text{J} = 2{,}81 \cdot 10^9\,\text{J}$.`, R`Con $m \cdot g \cdot h = 1000 \cdot 9{,}8 \cdot 300\,000\,\text{J} = 2{,}94 \cdot 10^9\,\text{J}$ si sbaglia di circa il 5%: salendo, $g$ cala.`] },
    { id: 'es-06', difficolta: 2, testo: R`Giove ha massa $1{,}90 \cdot 10^{27}\,\text{kg}$ e raggio 69 900 km. Qual è la velocità di fuga dalla cima delle sue nubi?`, suggerimenti: [R`$v_f = \sqrt{\dfrac{2 \cdot G \cdot M}{R}}$, con il raggio in metri.`], risposta: { tipo: 'numero', valore: 60.2, unita: 'km/s' }, soluzione: [R`$R = 6{,}99 \cdot 10^7\,\text{m}$.`, R`Il numeratore: $2 \cdot G \cdot M = 2 \cdot 6{,}67 \cdot 10^{-11} \cdot 1{,}90 \cdot 10^{27} \approx 2{,}53 \cdot 10^{17}\,\text{m}^3/\text{s}^2$.`, R`$v_f = \sqrt{\dfrac{2{,}53 \cdot 10^{17}}{6{,}99 \cdot 10^7}}\,\text{m/s} \approx 60\,200\,\text{m/s} \approx 60{,}2\,\text{km/s}$: più di cinque volte quella della Terra.`] },
    { id: 'es-07', difficolta: 2, testo: R`La cometa di Halley al perielio è a 0,586 UA dal Sole, all'afelio a 35,1 UA. Quante volte è più veloce al perielio che all'afelio?`, suggerimenti: [R`Al perielio e all'afelio $r_p \cdot v_p = r_a \cdot v_a$.`, R`Il rapporto delle velocità è il rapporto delle distanze, rovesciato.`], risposta: { tipo: 'numero', valore: 59.9, tolleranza: 0.2 }, soluzione: [R`$\dfrac{v_p}{v_a} = \dfrac{r_a}{r_p} = \dfrac{35{,}1}{0{,}586} \approx 59{,}9$: quasi 60 volte più veloce.`] },
    { id: 'es-08', difficolta: 3, testo: R`Le misure del satellite Planck danno $H_0 = 67{,}4$ km/s per megaparsec. Stima l'età dell'universo come $1/H_0$, in miliardi di anni. ($1\,\text{Mpc} = 3{,}086 \cdot 10^{19}\,\text{km}$; un anno $= 3{,}156 \cdot 10^7\,\text{s}$)`, suggerimenti: [R`$1/H_0 = \dfrac{1\,\text{Mpc}}{67{,}4\,\text{km/s}}$: scrivi il megaparsec in km e i km si semplificano.`, R`Ottieni secondi: dividi per i secondi di un anno.`], risposta: { tipo: 'numero', valore: 14.5, tolleranza: 0.15, segnaposto: 'Numero (miliardi di anni)' }, soluzione: [R`$\dfrac{1}{H_0} = \dfrac{3{,}086 \cdot 10^{19}\,\text{km}}{67{,}4\,\text{km/s}} \approx 4{,}58 \cdot 10^{17}\,\text{s}$.`, R`In anni: $\dfrac{4{,}58 \cdot 10^{17}}{3{,}156 \cdot 10^7} \approx 1{,}45 \cdot 10^{10}$, cioè circa 14,5 miliardi di anni.`, R`È una stima: l'espansione non è andata sempre alla stessa velocità. Il valore misurato è 13,8 miliardi di anni.`] },
    { id: 'es-09', difficolta: 3, testo: R`Un satellite di 1000 kg è in orbita circolare a una distanza dal centro della Terra pari a due raggi terrestri. Quanto vale la sua energia meccanica totale? ($M = 5{,}97 \cdot 10^{24}\,\text{kg}$, $R = 6370\,\text{km}$)`, suggerimenti: [R`In orbita circolare $E_m = -\dfrac{G \cdot M \cdot m}{2 \cdot r}$.`, R`$r = 2 \cdot R = 1{,}274 \cdot 10^7\,\text{m}$.`], risposta: { tipo: 'numero', valore: -1.56e10, unita: 'J' }, soluzione: [R`Con $G \cdot M \cdot m \approx 3{,}98 \cdot 10^{17}\,\text{J} \cdot \text{m}$: $E_m = -\dfrac{3{,}98 \cdot 10^{17}}{2 \cdot 1{,}274 \cdot 10^7}\,\text{J} \approx -1{,}56 \cdot 10^{10}\,\text{J}$.`, R`È negativa: il satellite è legato alla Terra. La sua cinetica vale $+1{,}56 \cdot 10^{10}\,\text{J}$, la potenziale il doppio con il segno meno.`] },
    { id: 'es-10', difficolta: 2, testo: R`Io, una luna di Giove, gira a 421 700 km dal centro del pianeta in 1,769 giorni. Europa, un'altra luna, gira a 671 000 km. Quanto dura il giro di Europa, in giorni?`, suggerimenti: [R`Le due lune girano attorno allo stesso centro: $T^2/r^3$ è uguale per tutte e due.`, R`$T_E = T_I \cdot \left( \dfrac{r_E}{r_I} \right)^{3/2}$.`], risposta: { tipo: 'numero', valore: 3.55, unita: 'd', tolleranza: 0.04 }, soluzione: [R`Rapporto dei raggi: $\dfrac{671\,000}{421\,700} \approx 1{,}591$.`, R`$T_E = 1{,}769 \cdot 1{,}591^{3/2} \approx 1{,}769 \cdot 2{,}007 \approx 3{,}55$ giorni: quasi il doppio di Io.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Secondo la prima legge di Keplero, dove si trova il Sole rispetto all'orbita di un pianeta?`, opzioni: [R`Al centro dell'ellisse`, R`Nel perielio`, R`In uno dei due fuochi dell'ellisse`, R`Fuori dall'ellisse, vicino all'afelio`], corretta: 2, spiegazione: R`Il Sole sta in un fuoco; l'altro fuoco è vuoto. Il centro dell'ellisse non coincide con il Sole, e il perielio è il punto dell'orbita più vicino al Sole.` },
    { id: 'q-02', domanda: R`In quale punto della sua orbita un pianeta va più veloce?`, opzioni: [R`Al perielio, vicino al Sole`, R`All'afelio, lontano dal Sole`, R`Va sempre alla stessa velocità`, R`A metà strada fra perielio e afelio`], corretta: 0, spiegazione: R`Aree uguali in tempi uguali: dove il raggio è corto il pianeta deve correre di più. Il massimo è al perielio, il minimo all'afelio.` },
    { id: 'q-03', domanda: R`Che cosa dice la terza legge di Keplero?`, opzioni: [R`Che tutti i pianeti hanno lo stesso periodo`, R`Che il periodo è proporzionale al semiasse maggiore`, R`Che i pianeti più lontani vanno più veloci`, R`Che $T^2/a^3$ è lo stesso per tutti i pianeti del Sole`], corretta: 3, spiegazione: R`Il quadrato del periodo è proporzionale al cubo del semiasse. Non è una proporzionalità diretta fra $T$ e $a$, e i pianeti lontani sono più lenti, non più veloci.` },
    { id: 'q-04', domanda: R`Due corpi si attraggono con una forza $F$. Se la distanza fra i centri raddoppia, la forza diventa…`, opzioni: [R`$F/2$`, R`$F/4$`, R`$2 \cdot F$`, R`$4 \cdot F$`], corretta: 1, spiegazione: R`La forza è inversamente proporzionale al quadrato della distanza: distanza doppia, forza divisa per $2^2 = 4$. $F/2$ sarebbe una proporzionalità inversa semplice.` },
    { id: 'q-05', domanda: R`La Terra attira la Luna con una forza $F$. Con che forza la Luna attira la Terra?`, opzioni: [R`Uguale a $F$, in verso opposto`, R`Molto più piccola, perché la Luna ha meno massa`, R`Nessuna: è solo la Terra ad attirare`, R`Più grande di $F$, perché la Luna accelera di più`], corretta: 0, spiegazione: R`Per il terzo principio le due forze hanno lo stesso modulo e versi opposti. La Luna accelera di più perché, con meno massa, la stessa forza le dà più accelerazione.` },
    { id: 'q-06', domanda: R`Nella legge di gravitazione, per una mela posata sul prato, quanto vale $r$?`, opzioni: [R`Zero, perché la mela tocca la Terra`, R`L'altezza della mela sul terreno`, R`Il raggio della Terra`, R`Il diametro della Terra`], corretta: 2, spiegazione: R`$r$ è la distanza fra i centri dei due corpi: dal centro della Terra al centro della mela, praticamente il raggio terrestre.` },
    { id: 'q-07', domanda: R`Perché non sentiamo l'attrazione gravitazionale fra due persone vicine?`, opzioni: [R`Perché fra persone la gravità non agisce`, R`Perché l'aria la blocca`, R`Perché la gravità della Terra la cancella`, R`Perché $G$ è piccolissima e le masse sono piccole`], corretta: 3, spiegazione: R`La forza c'è, ma con masse di decine di chilogrammi vale qualche decimilionesimo di newton. Nessun materiale fa da schermo alla gravità.` },
    { id: 'q-08', domanda: R`Il campo gravitazionale si misura in N/kg. A quale unità equivale?`, opzioni: [R`$\text{kg/m}^3$`, R`$\text{m/s}^2$`, R`$\text{N} \cdot \text{m}$`, R`$\text{J/kg}$`], corretta: 1, spiegazione: R`Un newton è $\text{kg} \cdot \text{m/s}^2$: diviso per un chilogrammo resta $\text{m/s}^2$. Per un corpo in caduta libera, il campo è la sua accelerazione.` },
    { id: 'q-09', domanda: R`Perché gli astronauti galleggiano nella Stazione spaziale, a 400 km di quota?`, opzioni: [R`Perché lassù non c'è gravità`, R`Perché sono fuori dall'atmosfera`, R`Perché cadono insieme alla stazione`, R`Perché la Luna li attira verso l'alto`], corretta: 2, spiegazione: R`A 400 km la gravità vale ancora circa il 90% di quella al suolo. Stazione e astronauti cadono insieme, in orbita: nulla li spinge l'uno contro l'altro.` },
    { id: 'q-10', domanda: R`Un satellite da 50 kg e uno da 5000 kg sono sulla stessa orbita circolare. Le loro velocità sono…`, opzioni: [R`uguali`, R`più grande per quello pesante`, R`più grande per quello leggero`, R`diverse, secondo la forma dei satelliti`], corretta: 0, spiegazione: R`Da $v = \sqrt{G \cdot M / r}$: la massa del satellite si semplifica. Contano solo la massa della Terra e il raggio dell'orbita.` },
    { id: 'q-11', domanda: R`Un satellite geostazionario…`, opzioni: [R`sta fermo nello spazio, sopra un punto della Terra`, R`gira sopra i poli ogni 12 ore`, R`vola appena fuori dall'atmosfera`, R`gira sopra l'equatore in un giorno, come la Terra`], corretta: 3, spiegazione: R`Gira con lo stesso periodo della Terra, a circa 36 000 km di quota: per questo da terra sembra fermo. Nello spazio però corre a circa 3 km/s.` },
    { id: 'q-12', domanda: R`Perché l'energia potenziale gravitazionale $-G \cdot M \cdot m / r$ è negativa?`, opzioni: [R`Perché la gravità è una forza repulsiva`, R`Perché lo zero è stato messo a distanza infinita`, R`Perché vale solo dentro la Terra`, R`Perché la massa $m$ è negativa`], corretta: 1, spiegazione: R`Con lo zero all'infinito, ogni punto più vicino ha energia più bassa: negativa. Per portare il corpo all'infinito bisogna fare lavoro contro una forza attrattiva.` },
    { id: 'q-13', domanda: R`La velocità di fuga dalla Terra è 11,2 km/s. Per un razzo più pesante, la velocità di fuga…`, opzioni: [R`è più grande`, R`è più piccola`, R`è la stessa`, R`dipende dal carburante`], corretta: 2, spiegazione: R`In $v_f = \sqrt{2 \cdot G \cdot M / R}$ la massa del razzo non c'è. Serve più energia per un razzo pesante, ma la velocità da raggiungere è la stessa.` },
    { id: 'q-14', domanda: R`Che cosa dice la legge di Hubble?`, opzioni: [R`Che le galassie si allontanano con velocità proporzionale alla distanza`, R`Che le galassie vicine si allontanano più in fretta`, R`Che le galassie si avvicinano a noi`, R`Che tutte le galassie si allontanano alla stessa velocità`], corretta: 0, spiegazione: R`$v = H_0 \cdot d$: più una galassia è lontana, più in fretta si allontana. Le vicine sono le più lente.` },
    { id: 'q-15', domanda: R`Le galassie lontane si allontanano da noi in tutte le direzioni. Vuol dire che siamo al centro dell'universo?`, opzioni: [R`Sì: siamo il punto da cui è partito tutto`, R`Sì, ma solo per la nostra galassia`, R`No: le galassie vicine si avvicinano`, R`No: da qualunque galassia si vedrebbe la stessa cosa`], corretta: 3, spiegazione: R`È lo spazio stesso che si dilata, come la gomma di un palloncino: da ogni punto gli altri si allontanano. Un centro non c'è.` },
    { id: 'q-16', domanda: R`Un satellite passa a un'orbita circolare più alta. La sua velocità…`, opzioni: [R`aumenta`, R`diminuisce`, R`resta uguale`, R`diventa zero`], corretta: 1, spiegazione: R`$v = \sqrt{G \cdot M / r}$: con $r$ più grande la velocità cala. Per esempio, la Stazione spaziale va a 7,7 km/s, un geostazionario a 3,1 km/s.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nella legge di Newton $r$ è la distanza dal **centro** della Terra: alla quota va sempre aggiunto il raggio, 6370 km.` },
    { tipo: 'errore', testo: R`Distanza doppia, forza **un quarto**, non metà: la gravità va con l'inverso del quadrato.` },
    { tipo: 'errore', testo: R`In orbita la gravità c'è: gli astronauti galleggiano perché cadono insieme alla stazione.` },
    { tipo: 'errore', testo: R`Con $G$ servono le unità del SI: i chilometri vanno trasformati in metri prima del conto.` },
    { tipo: 'trucco', testo: R`Per i corpi che girano attorno al Sole, con $T$ in anni e $a$ in UA, la terza legge diventa $T^2 = a^3$.` },
    { tipo: 'trucco', testo: R`Per confrontare due punti, fai il rapporto: $G$ e $M$ si semplificano, e il campo va come $(R/r)^2$.` },
    { tipo: 'metodo', testo: R`In un'orbita circolare scrivi «gravità = forza centripeta», $\dfrac{G \cdot M \cdot m}{r^2} = m \cdot \dfrac{v^2}{r}$, e ricava quello che cerchi.` },
    { tipo: 'metodo', testo: R`Per sapere se un corpo lanciato torna indietro, guarda il segno dell'energia totale: negativa torna, zero o positiva no.` }
  ],
  aneddoti: [
    { fisico: 'Giovanni Keplero', anni: '1571–1630', titolo: 'La legge trovata, scartata e ritrovata', testo: R`La terza legge costò a Keplero più di vent'anni. Da giovane si era convinto che le distanze dei pianeti seguissero un ordine nascosto. Per anni cercò un legame fra le orbite e i periodi. L'8 marzo 1618 gli venne in mente la regola giusta. La provò con i numeri, ma sbagliò un calcolo e la scartò. Il 15 maggio l'idea tornò. Rifece i conti, e questa volta tornavano. Lo racconta lui stesso nell'*Harmonices Mundi*, uscito nel 1619: all'inizio credette di sognare. In quel libro Keplero cercava anche una musica dei pianeti. A ognuno dava una melodia, più acuta al perielio, dove corre, e più grave all'afelio.`, legame: R`È la terza legge: $T^2/a^3$ è lo stesso per tutti i pianeti del Sole.` },
    { fisico: 'Edmond Halley', anni: '1656–1742', titolo: 'La cometa che tornò dopo la sua morte', testo: R`Edmond Halley calcolò le orbite di molte comete con il metodo di Newton. Tre comete, viste nel 1531, nel 1607 e nel 1682, avevano orbite quasi uguali. Halley ne concluse che erano la stessa cometa, che tornava ogni 75–76 anni. Nel 1705 ne previde il ritorno per il 1758. Morì nel 1742, senza poterla vedere. Intanto il matematico Alexis Clairaut rifece i conti, con Jérôme Lalande e Nicole-Reine Lepaute. Tennero conto della gravità di Giove e di Saturno, che ne ritardavano il ritorno di molti mesi. La notte di Natale del 1758 la vide per primo Johann Palitzsch, un contadino tedesco appassionato di astronomia. Da allora la cometa porta il nome di Halley.`, legame: R`La cometa percorre un'ellisse molto allungata attorno al Sole, come vogliono le leggi di Keplero e la gravitazione di Newton.` },
    { fisico: 'Henry Cavendish', anni: '1731–1810', titolo: 'Pesare la Terra chiusi in un capanno', testo: R`Henry Cavendish era ricchissimo e timidissimo: parlava pochissimo con chiunque. Fra il 1797 e il 1798 fece un esperimento delicatissimo. Lo strumento l'aveva progettato John Michell, morto prima di poterlo usare. Era una bilancia di torsione. Un'asta lunga quasi due metri pendeva da un filo sottile, con una pallina di piombo a ogni estremo. Due grosse sfere di piombo, di circa 160 kg, attiravano le palline e facevano ruotare l'asta di pochissimo. Bastavano il calore di un corpo o una corrente d'aria a rovinare tutto. Così Cavendish chiuse lo strumento in un capanno e lo osservava da fuori, con un cannocchiale. Nel 1798 pubblicò la densità media della Terra: circa 5,5 volte quella dell'acqua.`, legame: R`Fu la prima misura in laboratorio dell'attrazione fra due masse: dai suoi dati si ricava la costante $G$.` },
    { fisico: 'Urbain Le Verrier', anni: '1811–1877', titolo: 'Il pianeta scoperto con la penna', testo: R`Urano, scoperto nel 1781, non seguiva l'orbita prevista dalla gravitazione di Newton. A volte era in anticipo, a volte in ritardo. Il francese Urbain Le Verrier pensò a un pianeta sconosciuto, più lontano, che lo tirava. Con mesi di calcoli ne trovò la posizione nel cielo. La spedì per lettera a Johann Galle, dell'osservatorio di Berlino. Galle la ricevette il 23 settembre 1846 e cercò quella sera stessa. Con l'assistente Heinrich d'Arrest trovò il pianeta in meno di un'ora, a circa un grado dal punto previsto. Era Nettuno. François Arago disse che Le Verrier l'aveva visto «in punta di penna». In Inghilterra John Couch Adams aveva fatto conti simili, ma a Cambridge la ricerca andò a rilento.`, legame: R`La gravitazione universale è così precisa che da un piccolo disturbo in un'orbita si è trovato un pianeta nuovo.` },
    { fisico: 'Georges Lemaître', anni: '1894–1966', titolo: 'Il prete che arrivò prima di Hubble', testo: R`Georges Lemaître era un sacerdote belga, e un fisico. Nel 1927 pubblicò un articolo in francese, su una rivista belga poco letta. Partendo dalla relatività di Einstein, mostrava che l'universo poteva espandersi. Ne seguiva che le galassie si allontanano con velocità proporzionale alla distanza. Con i dati di allora stimò anche il rapporto, due anni prima di Hubble. Quasi nessuno se ne accorse. Nel 1931 l'articolo uscì in inglese, ma senza il passo con la stima. Qualcuno arrivò a sospettare una censura. Nel 2011 l'astrofisico Mario Livio trovò la risposta in una lettera. La traduzione l'aveva fatta Lemaître stesso, e aveva tolto lui quel passo, ormai superato. Nel 2018 l'Unione Astronomica Internazionale ha proposto il nome «legge di Hubble–Lemaître».`, legame: R`È la legge $v = H_0 \cdot d$ dell'universo in espansione.` }
  ]
});
})();
