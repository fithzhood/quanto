/* Quanto — I moti nel piano (terzo anno). Proiettili e gittata, velocità relative, moto circolare uniforme e non,
   moto armonico. Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/moti-piano.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'moti-piano',
  titolo: 'I moti nel piano',
  introduzione: R`Finora il moto stava su una retta. Ma un pallone calciato sale e poi ricade. Una barca attraversa un fiume e la corrente la trascina. Una giostra gira in tondo. Sono **moti nel piano**: per descriverli servono due coordinate, e posizione, velocità e accelerazione diventano vettori.

L'idea che regge tutto è semplice. Un moto nel piano si divide in due moti su due rette perpendicolari. Ognuno si studia per conto suo. Così il volo di un pallone diventa un moto uniforme in orizzontale più una caduta libera in verticale. E un moto circolare, guardato di lato, diventa un avanti e indietro: il moto armonico.

Servono le leggi del moto rettilineo e i vettori con le loro componenti. Seno e coseno servono a scomporre una velocità. Gli angoli del moto circolare si misurano in radianti.`,
  inBreve: [
    R`Nel piano il moto lungo $x$ e quello lungo $y$ sono **indipendenti**: si studiano separatamente e poi si mettono insieme.`,
    R`Senza aria un proiettile va di moto uniforme in orizzontale e cade con accelerazione $g$ in verticale. La traiettoria è una **parabola**.`,
    R`La **gittata** è $R = \dfrac{v_0^2 \cdot \sin(2\alpha)}{g}$: è massima a 45°, ed è uguale per due angoli che sommati fanno 90°.`,
    R`Le velocità si sommano come vettori: la velocità della barca rispetto all'acqua più quella della corrente dà la velocità rispetto alla riva.`,
    R`Nel moto circolare uniforme la velocità cambia direzione: c'è un'**accelerazione centripeta** verso il centro, $a_c = \dfrac{v^2}{r} = \omega^2 \cdot r$.`,
    R`Il **moto armonico** è l'ombra di un moto circolare uniforme su un diametro: $x = A \cdot \cos(\omega \cdot t)$.`
  ],
  sezioni: [
    {
      id: 'vettori-moto',
      titolo: 'Posizione e velocità nel piano',
      testo: R`Un pallone calciato non resta su una retta. Sale, va avanti, poi ricade. Per dire dove si trova non basta più un numero: ne servono due.

Si sceglie un **sistema di riferimento** con due assi perpendicolari: $x$ in orizzontale, $y$ in verticale. La posizione del corpo è il punto $(x; y)$. La linea che il corpo disegna muovendosi si chiama **traiettoria**.

>* Nel piano posizione, spostamento, velocità e accelerazione sono **vettori**. Ognuno ha una componente lungo $x$ e una lungo $y$.

Lo spostamento va dalla posizione iniziale a quella finale. Le sue componenti sono $\Delta x$ e $\Delta y$. Dividendo per il tempo si ottengono le componenti della velocità media:

$$v_x = \dfrac{\Delta x}{\Delta t} \qquad v_y = \dfrac{\Delta y}{\Delta t}$$

Esempio. In 2 s un drone si sposta di 10 m verso est e sale di 24 m. Quanto è veloce?

~ v_x = \dfrac{10\,\text{m}}{2\,\text{s}} = 5\,\text{m/s} :: la componente orizzontale
~ v_y = \dfrac{24\,\text{m}}{2\,\text{s}} = 12\,\text{m/s} :: la componente verticale
~ v = \sqrt{v_x^2 + v_y^2} :: le componenti sono perpendicolari: teorema di Pitagora
~ v = \sqrt{169}\,\text{m/s} :: $25 + 144 = 169$
~ v = \evidb{13\,\text{m/s}} :: è il modulo della velocità

La velocità istantanea è sempre **tangente alla traiettoria** e punta nel verso del moto. Se la traiettoria curva, la velocità cambia direzione. Questo succede anche quando il tachimetro segna sempre lo stesso numero.

L'**accelerazione** media è $\dfrac{\Delta \vec{v}}{\Delta t}$. La freccia ricorda che $\Delta \vec{v}$ è una differenza fra vettori, non fra numeri. Per questo c'è accelerazione anche quando cambia soltanto la direzione della velocità.

>! Un vettore cambia anche se cambia solo la sua direzione. Un'auto che fa una curva a velocità costante in modulo sta accelerando.

?? Un'auto percorre una rotonda e il tachimetro segna sempre 30 km/h. Sta accelerando?
[ ] no, perché il tachimetro segna sempre lo stesso numero
[x] sì, perché la direzione della velocità cambia
[ ] solo se frena o se preme l'acceleratore
=> La velocità è un vettore: cambia anche quando cambia solo la direzione. Quindi c'è un'accelerazione, anche se il modulo resta fisso.`
    },
    {
      id: 'lancio-orizzontale',
      titolo: 'Il lancio orizzontale: due moti indipendenti',
      testo: R`Una pallina rotola sul tavolo e cade dal bordo. Nello stesso istante, dalla stessa altezza, una seconda pallina viene lasciata cadere dritta. Quale tocca terra per prima?

[[video:moti-piano/proiettile]]

Arrivano insieme. La velocità in orizzontale non cambia nulla in verticale. Tutte e due cadono con l'accelerazione $g$ verso il basso.

>* **Principio di indipendenza dei moti**: il moto orizzontale e quello verticale avvengono insieme, ma uno non disturba l'altro. Si studiano separatamente e poi si mettono insieme.

Senza aria, in orizzontale non c'è accelerazione. Il corpo conserva la velocità di partenza $v_0$: è un moto uniforme. In verticale parte da fermo e cade con accelerazione $g$: è una caduta libera. Mettiamo l'origine a terra, sotto il punto di lancio, che è alto $h$:

$$x = v_0 \cdot t \qquad y = h - \tfrac{1}{2} \cdot g \cdot t^2$$

Il corpo tocca terra quando $y = 0$. Da qui si ricava il tempo di volo:

~ 0 = h - \tfrac{1}{2} \cdot g \cdot t^2 :: a terra la quota è zero
~ t = \sqrt{\dfrac{2 \cdot h}{g}} :: ricavo il tempo: la velocità $v_0$ non compare
~ t = \sqrt{\dfrac{2 \cdot 19{,}6\,\text{m}}{9{,}8\,\text{m/s}^2}} = \evidb{2\,\text{s}} :: per esempio da un'altezza di 19,6 m
~ x = 5\,\text{m/s} \cdot 2\,\text{s} = \evidb{10\,\text{m}} :: lanciata a 5 m/s, atterra 10 m più in là

[[grafico:orizzontale]]

Se dalle due leggi orarie si toglie il tempo, la quota $y$ dipende da $x^2$. La traiettoria è un ramo di **parabola**.

All'arrivo la velocità ha due componenti. Quella orizzontale è ancora $v_0$. Quella verticale è $g \cdot t$, verso il basso. Il modulo si trova con il teorema di Pitagora.

>! La pallina lanciata più forte non resta in aria più a lungo. Va più lontano, ma tocca terra nello stesso istante di quella lasciata cadere.

?? Dalla stessa finestra lanci in orizzontale una pallina a 2 m/s e un'altra a 8 m/s. Quale tocca terra per prima?
[ ] quella a 8 m/s, perché è più veloce
[ ] quella a 2 m/s, perché è più lenta
[x] arrivano insieme
=> Il tempo di caduta dipende solo dall'altezza: $t = \sqrt{2 \cdot h / g}$. La velocità orizzontale cambia solo il punto d'arrivo: la pallina più veloce arriva quattro volte più lontano.`
    },
    {
      id: 'lancio-obliquo',
      titolo: 'Il lancio obliquo',
      testo: R`Un calciatore colpisce il pallone dal basso. Il pallone parte con velocità $v_0$, inclinato di un angolo $\alpha$ sopra il suolo. È un **lancio obliquo**.

Anche qui i due moti sono indipendenti. Prima si scompone la velocità di lancio:

$$v_{0x} = v_0 \cdot \cos\alpha \quad v_{0y} = v_0 \cdot \sin\alpha$$

In orizzontale il moto è uniforme, con velocità $v_{0x}$. In verticale è come un lancio verso l'alto con velocità $v_{0y}$. Il pallone sale rallentando, si ferma in cima, poi ricade.

Qui conviene mettere l'origine nel punto di lancio.

>* Nel lancio obliquo, senza aria e con l'origine nel punto di lancio: $x = v_{0x} \cdot t$ e $y = v_{0y} \cdot t - \tfrac{1}{2} \cdot g \cdot t^2$. La traiettoria è una parabola.

Nel punto più alto la componente verticale si annulla, all'istante $t = v_{0y} / g$. Se partenza e arrivo sono alla stessa quota, la discesa dura quanto la salita. Il **tempo di volo** $t_v$ è il doppio della salita.

L'**altezza massima** $H$ viene dalla formula senza il tempo, usata solo in verticale: in cima la velocità verticale è zero.

Esempio. Un pallone parte a 14 m/s, inclinato di 30°.

~ v_{0x} = v_0 \cdot \cos 30^\circ :: la parte di lato
~ v_{0x} \approx 12{,}1\,\text{m/s} :: con $v_0 = 14\,\text{m/s}$
~ v_{0y} = v_0 \cdot \sin 30^\circ = 7\,\text{m/s} :: la parte in su: $\sin 30^\circ = 0{,}5$
~ t_v = \dfrac{2 \cdot 7}{9{,}8}\,\text{s} \approx \evidb{1{,}43\,\text{s}} :: $t_v = 2 \cdot v_{0y} / g$: salita e discesa durano uguale
~ H = \dfrac{49}{19{,}6}\,\text{m} = \evidb{2{,}5\,\text{m}} :: $H = v_{0y}^2 / (2 \cdot g)$, da $0 = v_{0y}^2 - 2 \cdot g \cdot H$

[[grafico:obliquo]]

>! Nel punto più alto la velocità **non** è zero. Si annulla solo la componente verticale: resta $v_{0x}$, in orizzontale.

?? Un pallone in volo passa per il punto più alto della traiettoria. Quanto vale lì la sua accelerazione?
[ ] zero, perché lì si ferma
[x] $g$, verso il basso
[ ] $g$, in orizzontale come la velocità
=> Per tutto il volo l'unica accelerazione è $g$, verso il basso. In cima si annulla solo la velocità verticale, e un istante dopo il pallone comincia a scendere.`
    },
    {
      id: 'gittata',
      titolo: 'La gittata e l\'angolo di 45°',
      testo: R`La **gittata** $R$ è la distanza in orizzontale fra il punto di lancio e quello d'arrivo. Interessa a chi lancia il peso, a chi tira in porta, a chi regola un getto d'acqua.

[[video:moti-piano/gittata]]

Partenza e arrivo siano alla stessa quota. La gittata è allora la velocità orizzontale per il tempo di volo:

~ R = v_{0x} \cdot t_v :: in orizzontale il moto è uniforme
~ R = v_0 \cdot \cos\alpha \cdot \dfrac{2 \cdot v_0 \cdot \sin\alpha}{g} :: metto la componente e il tempo di volo
~ R = \dfrac{v_0^2 \cdot 2 \cdot \sin\alpha \cdot \cos\alpha}{g} :: raccolgo i fattori
~ R = \evidb{\dfrac{v_0^2 \cdot \sin(2\alpha)}{g}} :: formula di duplicazione: $2 \cdot \sin\alpha \cdot \cos\alpha = \sin(2\alpha)$

> Se in matematica non hai ancora visto questa formula, provala con la calcolatrice. Con $\alpha = 30^\circ$: $2 \cdot 0{,}5 \cdot 0{,}866 \approx 0{,}866$, che è proprio $\sin 60^\circ$.

>* Senza aria, con partenza e arrivo alla stessa quota: $R = \dfrac{v_0^2 \cdot \sin(2\alpha)}{g}$. La gittata è massima a $\alpha = 45^\circ$ e vale $v_0^2 / g$.

Il seno vale al massimo 1, quando l'angolo è 90°. Quindi la gittata è massima per $2\alpha = 90^\circ$, cioè $\alpha = 45^\circ$. Per il pallone a 14 m/s la gittata massima è $14^2 / 9{,}8 = 20\,\text{m}$.

Due angoli che sommati fanno 90° danno la stessa gittata. Per esempio 20° e 70°. Passando da 20° a 70° seno e coseno si scambiano: $\sin 70^\circ = \cos 20^\circ$ e $\cos 70^\circ = \sin 20^\circ$. Il prodotto $\sin\alpha \cdot \cos\alpha$ non cambia, e neanche la gittata. Il lancio più alto resta in aria di più, ma va più piano in orizzontale.

[[grafico:gittata]]

>! La gittata non è proporzionale alla velocità: dipende da $v_0^2$. Con la velocità doppia e lo stesso angolo, il corpo arriva quattro volte più lontano.

> Nella realtà l'aria frena, e l'angolo migliore è un po' più basso di 45°. Anche partire più in alto del punto d'arrivo abbassa l'angolo migliore: succede nel lancio del peso.

?? Un getto d'acqua inclinato di 30° arriva a 6 m. Con la stessa velocità, a quale altro angolo arriva di nuovo a 6 m?
[ ] 15°
[x] 60°
[ ] 45°
=> Due angoli che sommati fanno 90° danno la stessa gittata: $30^\circ + 60^\circ = 90^\circ$. A 45° invece il getto arriverebbe più lontano.`
    },
    {
      id: 'velocita-relative',
      titolo: 'Le velocità relative',
      testo: R`Un treno corre a 30 m/s. Un passeggero cammina verso la locomotiva a 1,5 m/s. Per chi è seduto nel vagone va a 1,5 m/s. Per chi guarda dalla banchina va a 31,5 m/s. Hanno ragione tutti e due: la velocità dipende dal **sistema di riferimento**.

>* **Composizione delle velocità**: la velocità di A rispetto a C è una somma di vettori. Si somma la velocità di A rispetto a B con quella di B rispetto a C: $\vec{v}_{AC} = \vec{v}_{AB} + \vec{v}_{BC}$.

Le frecce ricordano che la somma è fra vettori. Per il passeggero: A è il passeggero, B il treno, C la banchina. Sulla stessa retta basta sommare con i segni. Se il passeggero cammina verso la coda, rispetto alla banchina va a $(30 - 1{,}5)\,\text{m/s} = 28{,}5\,\text{m/s}$.

Se le velocità non stanno sulla stessa retta, si sommano punta-coda, come gli spostamenti. L'esempio classico è una barca che attraversa un fiume. Qui A è la barca, B l'acqua, C la riva.

[[video:moti-piano/velocita-relative]]

Una barca va a $v_b = 3\,\text{m/s}$ rispetto all'acqua e punta dritta verso l'altra riva. Il fiume è largo 48 m e la corrente va a $v_c = 1{,}2\,\text{m/s}$.

~ t = \dfrac{48\,\text{m}}{3\,\text{m/s}} = \evidb{16\,\text{s}} :: verso la riva conta solo la velocità della barca
~ \Delta x = v_c \cdot t = \evidb{19{,}2\,\text{m}} :: intanto la corrente la porta a valle: 1,2 m/s per 16 s
~ v = \sqrt{v_b^2 + v_c^2} \approx 3{,}23\,\text{m/s} :: rispetto alla riva: $\sqrt{9 + 1{,}44}$, perché le due velocità sono perpendicolari

Per arrivare proprio di fronte, la barca deve puntare un po' controcorrente. Chiamiamo $\theta$ l'angolo fra la prua e la direzione dritta. La componente della barca contro la corrente deve annullare la corrente: $v_b \cdot \sin\theta = v_c$. Qui $\sin\theta = 1{,}2 / 3 = 0{,}4$, cioè $\theta \approx 23{,}6^\circ$.

[[grafico:fiume]]

>! Puntando controcorrente si arriva dritti, ma ci si mette di più. Verso la riva resta solo la componente $v_b \cdot \cos\theta$, che è minore di $v_b$.

> Arrivare dritti si può solo se la barca è più veloce della corrente. Altrimenti $\sin\theta$ dovrebbe essere maggiore di 1.

?? Un nuotatore attraversa un fiume puntando sempre dritto verso l'altra riva. A metà strada la corrente diventa più forte. Che cosa succede al tempo di attraversamento?
[x] resta uguale
[ ] aumenta
[ ] diminuisce
=> Il tempo dipende solo dalla velocità verso la riva, che è quella del nuotatore. La corrente più forte lo porta più a valle, ma non lo rallenta nell'attraversare.`
    },
    {
      id: 'moto-circolare',
      titolo: 'Il moto circolare uniforme',
      testo: R`La punta di una lancetta, un seggiolino della ruota panoramica, la pala di un ventilatore. Girano in tondo, sempre allo stesso ritmo.

>* Nel **moto circolare uniforme** il corpo percorre una circonferenza con velocità di modulo costante. Ogni giro dura lo stesso tempo.

Il tempo di un giro è il **periodo** $T$, in secondi. Il numero di giri al secondo è la **frequenza** $f = 1/T$. Si misura in hertz: $1\,\text{Hz}$ è un giro al secondo.

In un giro il corpo percorre la circonferenza, lunga $2\pi \cdot r$, nel tempo $T$. Quindi la sua velocità ha modulo $v = \dfrac{2\pi \cdot r}{T}$.

Esempio. Una ruota panoramica ha raggio 20 m e fa un giro ogni 2 minuti.

~ T = 2\,\text{min} = 120\,\text{s} :: prima le unità
~ v = \dfrac{2\pi \cdot 20\,\text{m}}{120\,\text{s}} :: una circonferenza intera in un periodo
~ v \approx \evidb{1{,}05\,\text{m/s}} :: più o meno il passo di chi cammina piano

Per gli angoli i fisici usano i **radianti**. L'angolo in radianti è l'arco diviso il raggio. Un giro intero vale $2\pi\,\text{rad}$, cioè circa 6,28 rad.

>* La **velocità angolare** è l'angolo descritto diviso il tempo impiegato: $\omega = \dfrac{2\pi}{T}$, in rad/s. La velocità del corpo è $v = \omega \cdot r$.

Tutti i punti di una ruota rigida fanno un giro nello stesso tempo: hanno la stessa $\omega$. Quelli lontani dal centro però percorrono un cerchio più grande. Per questo sono più veloci.

[[grafico:circolare]]

>! Non confondere $\omega$ con $v$. La velocità angolare, in rad/s, dice quanto si gira. La velocità, in m/s, dice quanta strada si fa.

?? Marta e Paolo sono sulla stessa giostra: Marta sul bordo, Paolo vicino al centro. Chi ha la velocità angolare maggiore?
[ ] Marta
[ ] Paolo
[x] è uguale per tutti e due
=> Fanno un giro nello stesso tempo, quindi hanno la stessa $\omega$. Marta però ha la velocità $v = \omega \cdot r$ maggiore, perché il suo $r$ è più grande.`
    },
    {
      id: 'centripeta',
      titolo: 'L\'accelerazione centripeta',
      testo: R`Nel moto circolare uniforme il tachimetro segna sempre lo stesso numero. Eppure il corpo accelera. La velocità è un vettore, e qui cambia direzione in ogni istante.

[[video:moti-piano/moto-circolare]]

Si prendono le velocità in due istanti vicini e si mettono con la coda nello stesso punto. La loro differenza $\Delta \vec{v}$ punta verso il centro del cerchio. Succede in ogni punto della traiettoria.

>* Nel moto circolare uniforme l'**accelerazione centripeta** punta sempre verso il centro. Il suo modulo è $a_c = \dfrac{v^2}{r} = \omega^2 \cdot r$.

La seconda forma viene dalla prima:

~ a_c = \dfrac{v^2}{r} :: la formula con la velocità
~ a_c = \dfrac{(\omega \cdot r)^2}{r} :: al posto di $v$ metto $\omega \cdot r$
~ a_c = \evidb{\omega^2 \cdot r} :: un $r$ si semplifica

Esempio. Un'auto percorre una curva di raggio 100 m a 15 m/s costanti. La sua accelerazione è $a_c = \dfrac{(15\,\text{m/s})^2}{100\,\text{m}} = 2{,}25\,\text{m/s}^2$, verso il centro della curva.

La velocità compare al quadrato. A velocità doppia, sulla stessa curva, l'accelerazione diventa quattro volte tanto. Per questo prima di una curva stretta si rallenta.

[[grafico:centripeta]]

>! L'accelerazione centripeta non è una spinta verso l'esterno. Chi sta in auto si sente premere contro la portiera esterna perché il suo corpo tende ad andare dritto. Ne parla la dinamica.

?? Un'auto affronta la stessa curva prima a 40 km/h, poi a 80 km/h. Come cambia l'accelerazione centripeta?
[ ] raddoppia
[x] diventa quattro volte tanto
[ ] resta uguale, perché la curva è la stessa
=> $a_c = v^2 / r$: con la velocità doppia, $v^2$ diventa quattro volte tanto. Il raggio della curva resta lo stesso.`
    },
    {
      id: 'circolare-non-uniforme',
      titolo: 'Il moto circolare non uniforme',
      testo: R`Una giostra parte da ferma e prende velocità a poco a poco. Il seggiolino gira in tondo, ma il modulo della sua velocità cresce. Il moto è circolare, ma non uniforme.

[[video:moti-piano/giostra]]

Ora la velocità cambia in due modi. Cambia direzione, perché la traiettoria è un cerchio. E cambia modulo, perché la giostra accelera. Ogni cambiamento ha la sua accelerazione.

>* Nel moto circolare non uniforme l'accelerazione ha due componenti perpendicolari. La **tangenziale** $a_t$, lungo la velocità, cambia il modulo. La **centripeta** $a_c = v^2 / r$, verso il centro, cambia la direzione.

La tangenziale si calcola come nel moto rettilineo: $a_t = \Delta v / \Delta t$. Se il corpo rallenta, punta all'indietro. Le due componenti sono perpendicolari, quindi l'accelerazione totale si trova con il teorema di Pitagora.

Esempio. In una rotonda di raggio 32 m un'auto va a 8 m/s. La sua velocità cresce di 1,5 m/s ogni secondo: $a_t = 1{,}5\,\text{m/s}^2$.

~ a_c = \dfrac{(8\,\text{m/s})^2}{32\,\text{m}} = 2\,\text{m/s}^2 :: la parte che curva la traiettoria
~ a = \sqrt{a_t^2 + a_c^2} :: le due componenti sono perpendicolari
~ a = \sqrt{1{,}5^2 + 2^2}\,\text{m/s}^2 :: metto i numeri
~ a = \evidb{2{,}5\,\text{m/s}^2} :: punta in avanti e verso il centro

[[grafico:giostra]]

Mentre la velocità cresce, la centripeta cresce con $v^2$. La tangenziale resta uguale, se la giostra accelera sempre allo stesso modo. L'accelerazione totale gira, e punta sempre più verso il centro.

>! L'accelerazione punta verso il centro **solo** se il modulo della velocità è costante. Se il corpo accelera, punta più in avanti; se frena, più indietro.

?? Un'auto in curva frena. Dove punta la sua accelerazione?
[ ] esattamente verso il centro della curva
[ ] all'indietro, lungo la strada
[x] verso l'interno della curva, inclinata all'indietro
=> C'è la centripeta, verso il centro, e la tangenziale, all'indietro perché l'auto frena. La loro somma sta in mezzo.`
    },
    {
      id: 'moto-armonico',
      titolo: 'Il moto armonico',
      testo: R`Un'altalena va avanti e indietro. Una massa appesa a una molla sale e scende. Il pistone di un motore fa su e giù. Sono moti **periodici**: si ripetono uguali, sempre nello stesso tempo.

Il più semplice si ottiene dal moto circolare. Una pallina gira in tondo, e si guarda la sua ombra su un diametro.

[[video:moti-piano/moto-armonico]]

Mentre la pallina gira, l'ombra va avanti e indietro lungo un segmento. Al centro corre. Agli estremi rallenta fino a fermarsi, poi torna indietro.

>* Il **moto armonico** è la proiezione di un moto circolare uniforme su un diametro. La legge oraria è $x = A \cdot \cos(\omega \cdot t)$.

$A$ è l'**ampiezza**, il massimo spostamento dal centro: è il raggio del cerchio. $\omega$ è la **pulsazione**, la velocità angolare della pallina. Il periodo è quello del moto circolare: $T = 2\pi / \omega$.

[[grafico:ombra]]

La velocità dell'ombra è la componente $x$ della velocità della pallina: $v = -\omega \cdot A \cdot \sin(\omega \cdot t)$. Al centro è massima e vale $\omega \cdot A$. Agli estremi è zero.

L'accelerazione dell'ombra è la componente $x$ dell'accelerazione centripeta della pallina. Quella vale $\omega^2 \cdot A$ e punta verso il centro del cerchio. Così l'accelerazione dell'ombra fa il contrario della velocità: è zero al centro e massima agli estremi. Punta sempre verso il centro:

$$a = -\omega^2 \cdot x$$

Il segno meno dice che l'accelerazione è opposta allo spostamento: riporta sempre l'ombra verso il centro.

Esempio. Una massa su una molla oscilla con ampiezza 10 cm e periodo 0,5 s.

~ \omega = \dfrac{2\pi}{0{,}5\,\text{s}} \approx 12{,}6\,\text{rad/s} :: la pulsazione, $\omega = 2\pi / T$
~ v_{max} = \omega \cdot A \approx \evidb{1{,}26\,\text{m/s}} :: al centro: 12,6 rad/s per 0,1 m; il radiante è un numero puro, restano i m/s
~ a_{max} = \omega^2 \cdot A \approx \evidb{15{,}8\,\text{m/s}^2} :: agli estremi

Nel grafico posizione–tempo il moto armonico è una curva che si ripete, una **sinusoide**. L'altezza dei picchi è l'ampiezza. La distanza in orizzontale fra due picchi è il periodo.

[[grafico:armonico]]

>! Ampiezza e periodo sono indipendenti. Nella legge $x = A \cdot \cos(\omega \cdot t)$, cambiare $A$ allarga le oscillazioni, ma non le rende più lente.

?? Nel moto armonico, in quale punto la velocità è massima?
[x] al centro dell'oscillazione
[ ] agli estremi
[ ] è uguale dappertutto
=> Al centro l'ombra corre veloce come la pallina: $v = \omega \cdot A$. Agli estremi si ferma, per tornare indietro.`
    }
  ],
  grafici: {
    /* il lancio orizzontale fotografato ogni 0,5 s, accanto a una pallina lasciata cadere: stesse quote (come nel video, altri numeri) */
    orizzontale: {
      tipo: 'piano', x: [-1, 21], y: [-1, 21.5], altezza: 460, etichette: { x: 'x (m)', y: 'y (m)' }, mirino: false,
      parametri: [{ nome: 'v0', min: 1, max: 10, passo: 0.5, valore: 5, etichetta: 'v_0 (m/s)' }],
      funzioni: [{ f: '19.6 - 4.9*x^2/v0^2', dominio: [0, '2*v0'], colore: 'grigio', tratteggio: true }],
      elementi: [
        { tipo: 'segmento', da: [0, 18.375], a: ['0.5*v0', 18.375], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 14.7], a: ['v0', 14.7], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 8.575], a: ['1.5*v0', 8.575], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [0, 19.6], colore: 'grigio' },
        { tipo: 'punto', p: [0, 18.375], colore: 'grigio', vuoto: true },
        { tipo: 'punto', p: [0, 14.7], colore: 'grigio', vuoto: true },
        { tipo: 'punto', p: [0, 8.575], colore: 'grigio', vuoto: true },
        { tipo: 'punto', p: [0, 0], colore: 'grigio', vuoto: true },
        { tipo: 'punto', p: ['0.5*v0', 18.375], colore: 'grigio' },
        { tipo: 'punto', p: ['v0', 14.7], colore: 'grigio' },
        { tipo: 'punto', p: ['1.5*v0', 8.575], colore: 'grigio' },
        { tipo: 'punto', p: ['2*v0', 0], colore: 'grigio' },
        { tipo: 'vettore', da: ['v0', 14.7], a: ['1.6*v0', 8.82], etichetta: 'v', colore: 1, componenti: { etichette: ['v_x', 'v_y'] } },
        { tipo: 'testo', p: [21.5, 20.3], testo: 'a terra a {{2*v0}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Da 19,6 m d\'altezza: una pallina lasciata cadere (cerchi vuoti) e una lanciata in orizzontale a v₀, fotografate ogni 0,5 s. Sono sempre alla stessa quota. Con il cursore cambia v₀: cambia il punto d\'arrivo, non il tempo. La freccia è la velocità dopo 1 s, con le sue componenti.'
    },
    /* il lancio obliquo: velocità di lancio con le componenti, altezza massima e gittata che cambiano con i cursori */
    obliquo: {
      tipo: 'piano', x: [-1, 27], y: [-2, 14.5], altezza: 420, etichette: { x: 'x (m)', y: 'y (m)' }, mirino: false,
      parametri: [
        { nome: 'v0', min: 10, max: 16, passo: 1, valore: 14, etichetta: 'v_0 (m/s)' },
        { nome: 'al', min: 15, max: 75, passo: 5, valore: 45, etichetta: 'α (°)' }
      ],
      funzioni: [{ f: 'x*tan(al*pi/180) - 4.9*x^2/(v0*cos(al*pi/180))^2', dominio: [0, 'v0^2*sin(2*al*pi/180)/9.8'], colore: 'grigio', tratteggio: true }],
      elementi: [
        { tipo: 'angolo', vertice: [0, 0], da: [3, 0], a: ['3*cos(al*pi/180)', '3*sin(al*pi/180)'], raggio: 2.2, colore: 'grigio' },
        { tipo: 'vettore', da: [0, 0], modulo: '0.7*v0', angolo: 'al', etichetta: 'v_0', colore: 1, componenti: { etichette: ['', ''] } },
        { tipo: 'vettore', da: ['v0^2*sin(2*al*pi/180)/19.6', '(v0*sin(al*pi/180))^2/19.6'], a: ['v0^2*sin(2*al*pi/180)/19.6 + 0.5*v0*cos(al*pi/180)', '(v0*sin(al*pi/180))^2/19.6'], etichetta: 'v_{0x}', colore: 1 },
        { tipo: 'punto', p: ['v0^2*sin(2*al*pi/180)/19.6', '(v0*sin(al*pi/180))^2/19.6'], colore: 'grigio' },
        { tipo: 'punto', p: ['v0^2*sin(2*al*pi/180)/9.8', 0], colore: 3 },
        { tipo: 'testo', p: [26.8, 13.6], testo: 'H ≈ {{(v0*sin(al*pi/180))^2/19.6}} m', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [26.8, 12.1], testo: 'R ≈ {{v0^2*sin(2*al*pi/180)/9.8}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un lancio senza aria: la freccia v₀, inclinata di α, con le sue componenti, la parabola, il punto più alto (dove resta solo la velocità orizzontale) e il punto d\'arrivo, in verde. Con i cursori si cambiano la velocità e l\'angolo di lancio.'
    },
    /* la gittata in funzione dell'angolo: massimo a 45°, angoli complementari alla stessa quota */
    gittata: {
      tipo: 'piano', x: [0, 90], y: [0, 46], altezza: 400, proporzioni: 'libere', passo: [15, 10], etichette: { x: 'α (°)', y: 'R (m)' },
      parametri: [
        { nome: 'v0', min: 10, max: 20, passo: 1, valore: 14, etichetta: 'v_0 (m/s)' },
        { nome: 'al', min: 10, max: 30, passo: 5, valore: 20, etichetta: 'angolo basso (°)' }
      ],
      funzioni: [{ f: 'v0^2*sin(2*x*pi/180)/9.8', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: ['al', 'v0^2*sin(2*al*pi/180)/9.8'], a: ['90 - al', 'v0^2*sin(2*al*pi/180)/9.8'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['al', 'v0^2*sin(2*al*pi/180)/9.8'], etichetta: '{{al}}°', posizione: 'alto-sinistra', colore: 'grigio' },
        { tipo: 'punto', p: ['90 - al', 'v0^2*sin(2*al*pi/180)/9.8'], etichetta: '{{90 - al}}°', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [45, 'v0^2/9.8'], etichetta: 'massimo ≈ {{round(10*v0^2/9.8)/10}} m', posizione: 'alto', colore: 3 }
      ],
      didascalia: 'La gittata al variare dell\'angolo, senza aria, con partenza e arrivo alla stessa quota. È massima a 45°; due angoli che sommati fanno 90° arrivano nello stesso punto. I cursori cambiano la velocità di lancio e la coppia di angoli.'
    },
    /* la barca e la corrente, punta-coda: la prua gira controcorrente */
    fiume: {
      tipo: 'piano', x: [-3.6, 4.2], y: [-0.5, 4.3], altezza: 420, assi: false,
      parametri: [{ nome: 'th', min: 0, max: 40, passo: 0.5, valore: 10, etichetta: 'θ, prua controcorrente (°)' }],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [0, 3.6], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [0, 1], a: ['-sin(th*pi/180)', 'cos(th*pi/180)'], raggio: 1.1, etichetta: 'θ', colore: 'grigio' },
        { tipo: 'somma', da: [0, 0], vettori: [['-3*sin(th*pi/180)', '3*cos(th*pi/180)'], [1.2, 0]], etichette: ['v_b', 'v_c'], colori: [1, 1], risultante: { etichetta: 'v', colore: 3 } },
        { tipo: 'testo', p: [4.1, 4.0], testo: 'verso la riva: {{3*cos(th*pi/180)}} m/s', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [4.1, 3.55], testo: 'lungo il fiume: {{1.2 - 3*sin(th*pi/180)}} m/s', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La barca va a 3 m/s rispetto all\'acqua (v_b), la corrente a 1,2 m/s verso destra (v_c). La somma, in verde, è la velocità rispetto alla riva. Con il cursore la prua gira controcorrente: verso 23,6° la barca va dritta; oltre, il numero lungo il fiume diventa negativo: la barca risale il fiume.'
    },
    /* il moto circolare: velocità tangente e accelerazione verso il centro, angolo anche in radianti */
    circolare: {
      tipo: 'piano', x: [-4.8, 4.8], y: [-3.6, 4.8], altezza: 440, assi: false, griglia: false,
      parametri: [{ nome: 'fi', min: 0, max: 360, passo: 5, valore: 40, etichetta: 'angolo φ (°)' }],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [3, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(fi*pi/180)', 'sin(fi*pi/180)'], raggio: 0.8, etichetta: 'φ', colore: 'grigio' },
        { tipo: 'vettore', da: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], a: ['3*cos(fi*pi/180) - 1.6*sin(fi*pi/180)', '3*sin(fi*pi/180) + 1.6*cos(fi*pi/180)'], etichetta: 'v', colore: 1 },
        { tipo: 'vettore', da: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], a: ['1.8*cos(fi*pi/180)', '1.8*sin(fi*pi/180)'], etichetta: 'a_c', colore: 4, posizione: 'destra' },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'punto', p: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], colore: 'grigio', trascina: true, giro: { parametro: 'fi', centro: [0, 0], gradi: true } },
        { tipo: 'testo', p: [4.7, -3.3], testo: 'φ ≈ {{fi*pi/180}} rad', ancora: 'end' }
      ],
      didascalia: 'Una pallina su un cerchio (il punto si trascina lungo il cerchio, o si usa il cursore). La velocità, in azzurro, è sempre tangente; l\'accelerazione, in viola, punta sempre verso il centro. L\'angolo φ è scritto anche in radianti: arco diviso raggio.'
    },
    /* a_c = v²/r: velocità doppia, accelerazione quattro volte */
    centripeta: {
      tipo: 'piano', x: [0, 30], y: [0, 24], altezza: 400, proporzioni: 'libere', passo: [5, 5], etichette: { x: 'v (m/s)', y: 'a_c (m/s²)' },
      parametri: [{ nome: 'r', min: 20, max: 150, passo: 10, valore: 50, etichetta: 'raggio r (m)' }],
      funzioni: [{ f: 'x^2/r', colore: 4 }],
      elementi: [
        { tipo: 'segmento', da: [10, 0], a: [10, '100/r'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [20, 0], a: [20, '400/r'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [10, '100/r'], etichetta: '{{100/r}} m/s²', posizione: 'alto-sinistra', colore: 4 },
        { tipo: 'punto', p: [20, '400/r'], etichetta: '{{400/r}} m/s²', posizione: 'alto-sinistra', colore: 4 }
      ],
      didascalia: 'L\'accelerazione centripeta al variare della velocità, su una curva di raggio r. Da 10 m/s a 20 m/s la velocità raddoppia e l\'accelerazione diventa quattro volte tanto. Il cursore cambia il raggio: curva più larga, accelerazione più piccola.'
    },
    /* la giostra che accelera: tangenziale fissa, centripeta che cresce con v² */
    giostra: {
      tipo: 'piano', x: [-4, 7], y: [-3.4, 4.3], altezza: 460, assi: false, griglia: false,
      parametri: [{ nome: 'v', min: 1.5, max: 6, passo: 0.5, valore: 3, etichetta: 'v (m/s)' }],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'vettore', da: [0, 3.6], a: ['-0.4*v', 3.6], etichetta: 'v', colore: 1, posizione: 'destra' },
        { tipo: 'somma', da: [0, 3], vettori: [[-2.4, 0], [0, '-1.2*v^2/8']], etichette: ['a_t', 'a_c'], colori: [4, 4], risultante: { etichetta: 'a', colore: 3 } },
        { tipo: 'punto', p: [0, 3], colore: 'grigio' },
        { tipo: 'testo', p: [6.9, 4.0], testo: 'a_t = 2 m/s²', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [6.9, 3.3], testo: 'a_c = v²/r = {{v^2/8}} m/s²', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [6.9, 2.6], testo: 'a ≈ {{sqrt(4 + v^4/64)}} m/s²', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un seggiolino a 8 m dal centro (il cerchio non è in scala) gira in senso antiorario e accelera sempre di 2 m/s². Con il cursore cresce la velocità: la centripeta cresce con v², la totale, in verde, punta sempre più verso il centro.'
    },
    /* l'ombra della pallina sul diametro: il moto armonico */
    ombra: {
      tipo: 'piano', x: [-3.4, 3.4], y: [-4.3, 3.4], altezza: 460, assi: false, griglia: false,
      parametri: [{ nome: 'fi', min: 0, max: 360, passo: 5, valore: 50, etichetta: 'angolo ω·t (°)' }],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 2.5, colore: 'grigio' },
        { tipo: 'segmento', da: [-2.5, -3.1], a: [2.5, -3.1], colore: 'grigio' },
        { tipo: 'segmento', da: ['2.5*cos(fi*pi/180)', '2.5*sin(fi*pi/180)'], a: ['2.5*cos(fi*pi/180)', -3.1], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: ['2.5*cos(fi*pi/180)', '2.5*sin(fi*pi/180)'], a: ['2.5*cos(fi*pi/180) - 1.3*sin(fi*pi/180)', '2.5*sin(fi*pi/180) + 1.3*cos(fi*pi/180)'], etichetta: 'v', colore: 1 },
        { tipo: 'vettore', da: ['2.5*cos(fi*pi/180)', -3.1], a: ['2.5*cos(fi*pi/180) - 1.3*sin(fi*pi/180)', -3.1], colore: 1 },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'punto', p: ['2.5*cos(fi*pi/180)', '2.5*sin(fi*pi/180)'], colore: 'grigio', trascina: true, giro: { parametro: 'fi', centro: [0, 0], gradi: true } },
        { tipo: 'punto', p: ['2.5*cos(fi*pi/180)', -3.1], colore: 'grigio', raggio: 7 },
        { tipo: 'testo', p: [-2.5, -3.6], testo: '−A' },
        { tipo: 'testo', p: [0, -3.6], testo: '0' },
        { tipo: 'testo', p: [2.5, -3.6], testo: '+A' },
        { tipo: 'testo', p: [0, -4.15], testo: 'x = A·cos(ω·t) ≈ {{cos(fi*pi/180)}}·A' }
      ],
      didascalia: 'La pallina gira sul cerchio di raggio A; sotto, la sua ombra va avanti e indietro sul diametro. La freccia dell\'ombra è la parte orizzontale della velocità della pallina: lunga al centro, nulla agli estremi. Il punto si trascina lungo il cerchio.'
    },
    /* la legge oraria del moto armonico: ampiezza e periodo */
    armonico: {
      tipo: 'orario', grandezza: 'x', unita: 'cm', t: [0, 10], y: [-14, 13], passo: [1, 4],
      parametri: [
        { nome: 'A', min: 2, max: 10, passo: 1, valore: 6, etichetta: 'ampiezza A (cm)' },
        { nome: 'T', min: 2, max: 5, passo: 0.5, valore: 3, etichetta: 'periodo T (s)' }
      ],
      funzioni: [{ f: 'A*cos(2*pi*t/T)', colore: 1 }],
      elementi: [
        { tipo: 'orizzontale', y: 'A', colore: 'grigio', tratteggio: true },
        { tipo: 'orizzontale', y: '-A', colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['T', '-A - 1'], a: ['2*T', '-A - 1'], colore: 'grigio' },
        { tipo: 'testo', p: ['1.5*T', '-A - 2.8'], testo: 'un periodo: {{T}} s' }
      ],
      didascalia: 'x = A·cos(2π·t/T): l\'altezza dei picchi è l\'ampiezza, la distanza fra due picchi è il periodo. I due cursori sono indipendenti: cambiare l\'ampiezza non cambia il periodo.'
    }
  },
  esempi: [
    {
      titolo: 'Il sasso dalla scogliera',
      problema: R`Da una scogliera alta 44,1 m un sasso viene lanciato in orizzontale a 8 m/s. Trascurando l'aria: dopo quanto tocca l'acqua? A che distanza dalla parete? Con che velocità arriva?`,
      passi: [
        R`Dati: $h = 44{,}1\,\text{m}$, $v_0 = 8\,\text{m/s}$ in orizzontale, $g = 9{,}8\,\text{m/s}^2$. Cerco il tempo $t$, la distanza $x$ e la velocità d'arrivo $v$.`,
        R`Riferimento: origine ai piedi della scogliera, $x$ verso il mare, $y$ verso l'alto. Il sasso parte da $(0; 44{,}1\,\text{m})$.`,
        R`In verticale è una caduta libera da fermo: $t = \sqrt{\dfrac{2 \cdot h}{g}} = \sqrt{\dfrac{2 \cdot 44{,}1}{9{,}8}}\,\text{s} = \sqrt{9}\,\text{s} = 3\,\text{s}$.`,
        R`In orizzontale il moto è uniforme: $x = v_0 \cdot t = 8\,\text{m/s} \cdot 3\,\text{s} = 24\,\text{m}$.`,
        R`All'arrivo $v_x = 8\,\text{m/s}$ e $v_y = g \cdot t = 29{,}4\,\text{m/s}$, verso il basso. Il modulo: $v = \sqrt{8^2 + 29{,}4^2}\,\text{m/s} \approx 30{,}5\,\text{m/s}$.`,
        R`Controllo con la formula senza il tempo, solo in verticale: $v_y^2 = 2 \cdot g \cdot h = 2 \cdot 9{,}8 \cdot 44{,}1 \approx 864$, e $\sqrt{864} \approx 29{,}4$. Torna.`
      ],
      risultato: R`$t = 3\,\text{s}$, $x = 24\,\text{m}$, $v \approx 30{,}5\,\text{m/s}$`
    },
    {
      titolo: 'Il calcio di rinvio',
      problema: R`Un portiere calcia il pallone da terra a 25 m/s, con un angolo $\alpha$ tale che $\cos\alpha = 0{,}8$ e $\sin\alpha = 0{,}6$ (circa 37°). Senza aria: quanto dura il volo? Quanto sale il pallone? Dove ricade?`,
      passi: [
        R`Dati: $v_0 = 25\,\text{m/s}$, $\cos\alpha = 0{,}8$, $\sin\alpha = 0{,}6$, $g = 9{,}8\,\text{m/s}^2$. Cerco il tempo di volo $t_v$, l'altezza massima $H$ e la gittata $R$.`,
        R`Scompongo la velocità di lancio: $v_{0x} = 25 \cdot 0{,}8\,\text{m/s} = 20\,\text{m/s}$ e $v_{0y} = 25 \cdot 0{,}6\,\text{m/s} = 15\,\text{m/s}$.`,
        R`Tempo di volo, con partenza e arrivo a terra: $t_v = \dfrac{2 \cdot v_{0y}}{g} = \dfrac{30}{9{,}8}\,\text{s} \approx 3{,}06\,\text{s}$.`,
        R`Altezza massima, dove la velocità verticale si annulla: $H = \dfrac{v_{0y}^2}{2 \cdot g} = \dfrac{225}{19{,}6}\,\text{m} \approx 11{,}5\,\text{m}$.`,
        R`Gittata: in orizzontale il moto è uniforme, $R = v_{0x} \cdot t_v = 20 \cdot \dfrac{30}{9{,}8}\,\text{m} \approx 61{,}2\,\text{m}$.`,
        R`Controllo con la formula della gittata: $\sin(2\alpha) = 2 \cdot 0{,}6 \cdot 0{,}8 = 0{,}96$, quindi $R = \dfrac{625 \cdot 0{,}96}{9{,}8}\,\text{m} \approx 61{,}2\,\text{m}$. Torna.`
      ],
      risultato: R`$t_v \approx 3{,}06\,\text{s}$, $H \approx 11{,}5\,\text{m}$, $R \approx 61{,}2\,\text{m}$`
    },
    {
      titolo: 'L\'aereo e il vento',
      problema: R`Un aereo punta verso nord e vola a 240 km/h rispetto all'aria. Soffia un vento verso est a 70 km/h. Qual è la velocità dell'aereo rispetto al suolo? Quanta strada fa in 2 ore?`,
      passi: [
        R`Dati: aereo rispetto all'aria $240\,\text{km/h}$ verso nord, aria rispetto al suolo $70\,\text{km/h}$ verso est, $\Delta t = 2\,\text{h}$. Cerco la velocità $v$ rispetto al suolo e la strada percorsa.`,
        R`Composizione delle velocità: aereo rispetto al suolo = aereo rispetto all'aria + aria rispetto al suolo, come vettori. Uso km e ore, così non devo convertire.`,
        R`I due vettori sono perpendicolari: $v = \sqrt{240^2 + 70^2}\,\text{km/h} = \sqrt{62\,500}\,\text{km/h} = 250\,\text{km/h}$.`,
        R`La direzione: chiamo $\beta$ l'angolo con il nord. $\tan\beta = \dfrac{70}{240} \approx 0{,}29$, quindi $\beta \approx 16^\circ$ verso est.`,
        R`Strada in 2 ore: $250\,\text{km/h} \cdot 2\,\text{h} = 500\,\text{km}$.`,
        R`Controllo con le componenti: in 2 ore fa $480\,\text{km}$ verso nord e $140\,\text{km}$ verso est, e $\sqrt{480^2 + 140^2} = 500$. Torna.`
      ],
      risultato: R`$v = 250\,\text{km/h}$, circa 16° a est del nord; in 2 ore $500\,\text{km}$`
    },
    {
      titolo: 'La centrifuga della lavatrice',
      problema: R`Durante la centrifuga il cestello di una lavatrice, di raggio 25 cm, fa 1200 giri al minuto. Trova la frequenza, il periodo, la velocità angolare, la velocità di un punto del bordo e la sua accelerazione centripeta.`,
      passi: [
        R`Dati: $r = 25\,\text{cm} = 0{,}25\,\text{m}$, 1200 giri in $60\,\text{s}$. Cerco $f$, $T$, $\omega$, $v$ e $a_c$.`,
        R`Frequenza e periodo: $f = \dfrac{1200}{60\,\text{s}} = 20\,\text{Hz}$, $T = \dfrac{1}{f} = 0{,}05\,\text{s}$.`,
        R`Velocità angolare: $\omega = \dfrac{2\pi}{T} = 2\pi \cdot 20\,\text{rad/s} \approx 126\,\text{rad/s}$.`,
        R`Velocità del bordo: $v = \omega \cdot r \approx 125{,}7 \cdot 0{,}25\,\text{m/s} \approx 31{,}4\,\text{m/s}$, più di 110 km/h.`,
        R`Accelerazione centripeta: $a_c = \omega^2 \cdot r \approx 125{,}7^2 \cdot 0{,}25\,\text{m/s}^2 \approx 3950\,\text{m/s}^2$, circa 400 volte $g$.`,
        R`Controllo con l'altra formula: $a_c = \dfrac{v^2}{r} = \dfrac{31{,}4^2}{0{,}25}\,\text{m/s}^2 \approx 3940\,\text{m/s}^2$. Torna, a meno degli arrotondamenti.`
      ],
      risultato: R`$f = 20\,\text{Hz}$, $T = 0{,}05\,\text{s}$, $\omega \approx 126\,\text{rad/s}$, $v \approx 31{,}4\,\text{m/s}$, $a_c \approx 3950\,\text{m/s}^2$`
    },
    {
      titolo: 'Il treno che frena in curva',
      problema: R`Un treno percorre una curva di raggio 500 m. Quando va a 30 m/s comincia a frenare: la sua velocità cala di 1,2 m/s ogni secondo. Quanto vale la sua accelerazione in quell'istante? Dove punta?`,
      passi: [
        R`Dati: $r = 500\,\text{m}$, $v = 30\,\text{m/s}$, $a_t = 1{,}2\,\text{m/s}^2$ all'indietro. Cerco l'accelerazione totale $a$ e la sua direzione.`,
        R`La centripeta, verso il centro della curva: $a_c = \dfrac{v^2}{r} = \dfrac{900}{500}\,\text{m/s}^2 = 1{,}8\,\text{m/s}^2$.`,
        R`La tangenziale vale $1{,}2\,\text{m/s}^2$ ed è opposta alla velocità, perché il treno frena.`,
        R`Le due componenti sono perpendicolari: $a = \sqrt{1{,}2^2 + 1{,}8^2}\,\text{m/s}^2 = \sqrt{4{,}68}\,\text{m/s}^2 \approx 2{,}16\,\text{m/s}^2$.`,
        R`La direzione: verso l'interno della curva, inclinata all'indietro. Con la direzione del centro forma un angolo $\beta$ con $\tan\beta = \dfrac{1{,}2}{1{,}8} \approx 0{,}67$, cioè $\beta \approx 34^\circ$.`,
        R`Controllo: $a$ deve essere maggiore di ciascuna componente e minore della loro somma, $3\,\text{m/s}^2$. Torna.`
      ],
      risultato: R`$a \approx 2{,}16\,\text{m/s}^2$, verso l'interno della curva e circa 34° all'indietro rispetto al centro`
    },
    {
      titolo: 'Il pistone',
      problema: R`Un pistone si muove di moto armonico con ampiezza 5 cm e periodo 0,4 s. All'istante zero è all'estremo positivo. Trova la pulsazione, la velocità massima, l'accelerazione massima e la posizione dopo 0,05 s.`,
      passi: [
        R`Dati: $A = 5\,\text{cm} = 0{,}05\,\text{m}$, $T = 0{,}4\,\text{s}$, all'istante zero $x = A$. Cerco $\omega$, $v_{max}$, $a_{max}$ e $x$ a $t = 0{,}05\,\text{s}$.`,
        R`Pulsazione: $\omega = \dfrac{2\pi}{T} = \dfrac{2\pi}{0{,}4}\,\text{rad/s} \approx 15{,}7\,\text{rad/s}$.`,
        R`Velocità massima, al centro: $v_{max} = \omega \cdot A \approx 15{,}7 \cdot 0{,}05\,\text{m/s} \approx 0{,}785\,\text{m/s}$.`,
        R`Accelerazione massima, agli estremi: $a_{max} = \omega^2 \cdot A \approx 15{,}7^2 \cdot 0{,}05\,\text{m/s}^2 \approx 12{,}3\,\text{m/s}^2$.`,
        R`Posizione: $\omega \cdot t \approx 15{,}7 \cdot 0{,}05\,\text{rad} \approx 0{,}785\,\text{rad}$, cioè 45°. Quindi $x = 5\,\text{cm} \cdot \cos 45^\circ \approx 3{,}54\,\text{cm}$. La calcolatrice va in radianti, oppure si usano i gradi.`,
        R`Controllo: 0,05 s è un ottavo del periodo. In un ottavo di giro la pallina che fa l'ombra ruota di $360^\circ / 8 = 45^\circ$. Torna.`
      ],
      risultato: R`$\omega \approx 15{,}7\,\text{rad/s}$, $v_{max} \approx 0{,}785\,\text{m/s}$, $a_{max} \approx 12{,}3\,\text{m/s}^2$, $x \approx 3{,}54\,\text{cm}$`
    }
  ],
  formulario: [
    { nome: 'Componenti della velocità media', formula: R`v_x = \dfrac{\Delta x}{\Delta t} \qquad v_y = \dfrac{\Delta y}{\Delta t}`, nota: R`Il modulo è $v = \sqrt{v_x^2 + v_y^2}$. La velocità istantanea è tangente alla traiettoria.` },
    { nome: 'Lancio orizzontale', formula: R`x = v_0 \cdot t \qquad y = h - \tfrac{1}{2} \cdot g \cdot t^2`, nota: R`Origine a terra sotto il punto di lancio, asse $y$ verso l'alto. Senza aria.` },
    { nome: 'Tempo di caduta nel lancio orizzontale', formula: R`t = \sqrt{\dfrac{2 \cdot h}{g}}`, nota: R`Non dipende da $v_0$. Il punto d'arrivo è a $x = v_0 \cdot t$.` },
    { nome: 'Componenti della velocità di lancio', formula: R`v_{0x} = v_0 \cdot \cos\alpha`, nota: R`E $v_{0y} = v_0 \cdot \sin\alpha$. $\alpha$ è l'angolo sopra il suolo.` },
    { nome: 'Lancio obliquo', formula: R`y = v_{0y} \cdot t - \tfrac{1}{2} \cdot g \cdot t^2`, nota: R`In verticale è uniformemente accelerato; in orizzontale è uniforme, $x = v_{0x} \cdot t$. La traiettoria è una parabola.` },
    { nome: 'Tempo di volo e altezza massima', formula: R`t_v = \dfrac{2 \cdot v_{0y}}{g} \qquad H = \dfrac{v_{0y}^2}{2 \cdot g}`, nota: R`Con partenza e arrivo alla stessa quota.` },
    { nome: 'Gittata', formula: R`R = \dfrac{v_0^2 \cdot \sin(2\alpha)}{g}`, nota: R`Stessa quota di partenza e arrivo. Massima a 45°, dove vale $v_0^2 / g$; uguale per angoli complementari.` },
    { nome: 'Composizione delle velocità', formula: R`\vec{v}_{AC} = \vec{v}_{AB} + \vec{v}_{BC}`, nota: R`Velocità di A rispetto a C: somma di vettori. Sulla stessa retta si sommano i numeri con il segno.` },
    { nome: 'Frequenza e velocità angolare', formula: R`f = \dfrac{1}{T} \qquad \omega = \dfrac{2\pi}{T}`, nota: R`$f$ in hertz (giri al secondo), $\omega$ in rad/s. Un giro vale $2\pi\,\text{rad}$.` },
    { nome: 'Velocità nel moto circolare uniforme', formula: R`v = \dfrac{2\pi \cdot r}{T} \qquad v = \omega \cdot r`, nota: R`La velocità è tangente alla circonferenza; il modulo è costante.` },
    { nome: 'Accelerazione centripeta', formula: R`a_c = \dfrac{v^2}{r} \qquad a_c = \omega^2 \cdot r`, nota: R`Punta sempre verso il centro. In $\text{m/s}^2$.` },
    { nome: 'Moto circolare non uniforme', formula: R`a = \sqrt{a_t^2 + a_c^2}`, nota: R`La tangenziale $a_t$ cambia il modulo della velocità, la centripeta $a_c$ la direzione.` },
    { nome: 'Moto armonico', formula: R`x = A \cdot \cos(\omega \cdot t) \quad a = -\omega^2 \cdot x`, nota: R`$A$ ampiezza, $\omega$ pulsazione, $T = 2\pi / \omega$. Con $\omega$ in rad/s, la calcolatrice va in radianti.` },
    { nome: 'Velocità e accelerazione massime', formula: R`v_{max} = \omega \cdot A \qquad a_{max} = \omega^2 \cdot A`, nota: R`La velocità è massima al centro, l'accelerazione agli estremi.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'vettori-moto', tipo: 'definizione', fronte: R`Che cos'è la **traiettoria** di un corpo?`, retro: R`La linea che il corpo disegna muovendosi: una retta, una parabola, una circonferenza…` },
    { id: 'fc-02', sezione: 'vettori-moto', tipo: 'concetto', fronte: R`Che direzione ha la velocità istantanea nel moto nel piano?`, retro: R`È tangente alla traiettoria e punta nel verso del moto.` },
    { id: 'fc-03', sezione: 'vettori-moto', tipo: 'concetto', fronte: R`Un corpo può accelerare anche se il modulo della sua velocità non cambia?`, retro: R`Sì: basta che cambi la direzione della velocità, come in una curva. L'accelerazione è $\Delta \vec{v} / \Delta t$, una differenza fra vettori.` },
    { id: 'fc-04', sezione: 'lancio-orizzontale', tipo: 'definizione', fronte: R`Che cosa dice il **principio di indipendenza dei moti**?`, retro: R`Il moto orizzontale e quello verticale avvengono insieme ma non si disturbano: si studiano separatamente.` },
    { id: 'fc-05', sezione: 'lancio-orizzontale', tipo: 'formula', fronte: R`Leggi orarie del **lancio orizzontale** da un'altezza $h$`, retro: R`$x = v_0 \cdot t$ e $y = h - \frac{1}{2} \cdot g \cdot t^2$, con l'origine a terra sotto il punto di lancio.` },
    { id: 'fc-06', sezione: 'lancio-orizzontale', tipo: 'concetto', fronte: R`Nel lancio orizzontale, da che cosa dipende il tempo di caduta?`, retro: R`Solo dall'altezza: $t = \sqrt{2 \cdot h / g}$. La velocità orizzontale cambia il punto d'arrivo, non il tempo.` },
    { id: 'fc-07', sezione: 'lancio-orizzontale', tipo: 'concetto', fronte: R`Che forma ha la traiettoria di un proiettile, senza aria?`, retro: R`Una parabola: moto uniforme in orizzontale più moto uniformemente accelerato in verticale.` },
    { id: 'fc-08', sezione: 'lancio-obliquo', tipo: 'formula', fronte: R`Componenti della velocità di lancio $v_0$ inclinata di $\alpha$ sul suolo`, retro: R`$v_{0x} = v_0 \cdot \cos\alpha$ e $v_{0y} = v_0 \cdot \sin\alpha$.` },
    { id: 'fc-09', sezione: 'lancio-obliquo', tipo: 'concetto', fronte: R`Quanto vale la velocità nel punto più alto di un lancio obliquo?`, retro: R`Non è zero: resta la componente orizzontale $v_{0x}$. Si annulla solo la verticale. L'accelerazione è sempre $g$.` },
    { id: 'fc-10', sezione: 'lancio-obliquo', tipo: 'formula', fronte: R`**Tempo di volo** e **altezza massima** nel lancio obliquo`, retro: R`$t_v = \dfrac{2 \cdot v_{0y}}{g}$ e $H = \dfrac{v_{0y}^2}{2 \cdot g}$, con partenza e arrivo alla stessa quota.` },
    { id: 'fc-11', sezione: 'gittata', tipo: 'formula', fronte: R`Formula della **gittata**`, retro: R`$R = \dfrac{v_0^2 \cdot \sin(2\alpha)}{g}$, senza aria e con partenza e arrivo alla stessa quota.` },
    { id: 'fc-12', sezione: 'gittata', tipo: 'concetto', fronte: R`A che angolo la gittata è massima? Quali angoli danno la stessa gittata?`, retro: R`Massima a 45°, dove vale $v_0^2 / g$. Due angoli che sommati fanno 90° danno la stessa gittata.` },
    { id: 'fc-13', sezione: 'velocita-relative', tipo: 'definizione', fronte: R`Come si compongono le velocità fra due sistemi di riferimento?`, retro: R`Come vettori: $\vec{v}_{AC} = \vec{v}_{AB} + \vec{v}_{BC}$. Per esempio barca rispetto alla riva = barca rispetto all'acqua + acqua rispetto alla riva.` },
    { id: 'fc-14', sezione: 'velocita-relative', tipo: 'procedura', fronte: R`Dove deve puntare una barca per attraversare un fiume e arrivare proprio di fronte?`, retro: R`Controcorrente, di un angolo $\theta$ con $v_b \cdot \sin\theta = v_c$. Si può solo se la barca è più veloce della corrente.` },
    { id: 'fc-15', sezione: 'moto-circolare', tipo: 'definizione', fronte: R`Che cosa sono **periodo** e **frequenza**?`, retro: R`Il periodo $T$ è la durata di un giro, in secondi. La frequenza $f = 1/T$ è il numero di giri al secondo, in hertz.` },
    { id: 'fc-16', sezione: 'moto-circolare', tipo: 'definizione', fronte: R`Che cos'è un angolo in **radianti**?`, retro: R`L'arco diviso il raggio. Un giro intero vale $2\pi\,\text{rad}$, circa 6,28 rad.` },
    { id: 'fc-17', sezione: 'moto-circolare', tipo: 'formula', fronte: R`**Velocità angolare** e velocità nel moto circolare uniforme`, retro: R`$\omega = \dfrac{2\pi}{T}$, in rad/s, e $v = \omega \cdot r = \dfrac{2\pi \cdot r}{T}$.` },
    { id: 'fc-18', sezione: 'centripeta', tipo: 'formula', fronte: R`Formula dell'**accelerazione centripeta**`, retro: R`$a_c = \dfrac{v^2}{r} = \omega^2 \cdot r$, sempre verso il centro.` },
    { id: 'fc-19', sezione: 'centripeta', tipo: 'concetto', fronte: R`Sulla stessa curva la velocità raddoppia. Che cosa succede all'accelerazione centripeta?`, retro: R`Diventa quattro volte tanto, perché dipende da $v^2$.` },
    { id: 'fc-20', sezione: 'circolare-non-uniforme', tipo: 'concetto', fronte: R`Quali componenti ha l'accelerazione nel moto circolare non uniforme?`, retro: R`La tangenziale $a_t$, lungo la velocità, e la centripeta $a_c = v^2 / r$, verso il centro. Totale: $a = \sqrt{a_t^2 + a_c^2}$.` },
    { id: 'fc-21', sezione: 'moto-armonico', tipo: 'definizione', fronte: R`Che cos'è il **moto armonico**?`, retro: R`La proiezione di un moto circolare uniforme su un diametro: $x = A \cdot \cos(\omega \cdot t)$.` },
    { id: 'fc-22', sezione: 'moto-armonico', tipo: 'concetto', fronte: R`Nel moto armonico, dove sono massime la velocità e l'accelerazione?`, retro: R`La velocità è massima al centro ($\omega \cdot A$) e nulla agli estremi. L'accelerazione è nulla al centro e massima agli estremi ($\omega^2 \cdot A$).` },
    { id: 'fc-23', sezione: 'moto-armonico', tipo: 'formula', fronte: R`Accelerazione nel moto armonico`, retro: R`$a = -\omega^2 \cdot x$: proporzionale allo spostamento e opposta, cioè sempre verso il centro.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un sasso lanciato in orizzontale da una scogliera tocca l'acqua dopo 2,5 s. Trascurando l'aria, quanto è alta la scogliera?`, suggerimenti: [R`In verticale è una caduta libera da fermo: $h = \frac{1}{2} \cdot g \cdot t^2$.`], risposta: { tipo: 'numero', valore: 30.6, unita: 'm' }, soluzione: [R`$h = \frac{1}{2} \cdot 9{,}8\,\text{m/s}^2 \cdot (2{,}5\,\text{s})^2 = 4{,}9 \cdot 6{,}25\,\text{m} \approx 30{,}6\,\text{m}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una pallina lanciata in orizzontale a 4 m/s resta in aria 0,5 s. A che distanza, in orizzontale, tocca terra?`, suggerimenti: [R`In orizzontale il moto è uniforme: $x = v_0 \cdot t$.`], risposta: { tipo: 'numero', valore: 2, unita: 'm' }, soluzione: [R`$x = 4\,\text{m/s} \cdot 0{,}5\,\text{s} = 2\,\text{m}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Da un ponte alto 78,4 m un sasso viene lanciato in orizzontale. Dopo quanti secondi tocca l'acqua? Trascura l'aria.`, suggerimenti: [R`Il tempo dipende solo dall'altezza: $t = \sqrt{2 \cdot h / g}$.`], risposta: { tipo: 'numero', valore: 4, unita: 's' }, soluzione: [R`$t = \sqrt{\dfrac{2 \cdot 78{,}4}{9{,}8}}\,\text{s} = \sqrt{16}\,\text{s} = 4\,\text{s}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una pallina viene lanciata in orizzontale a 12 m/s. Quanto vale la componente verticale della sua velocità dopo 3 s? Trascura l'aria.`, suggerimenti: [R`In verticale parte da ferma e accelera con $g$: $v_y = g \cdot t$.`, R`La velocità orizzontale non conta.`], risposta: { tipo: 'numero', valore: 29.4, unita: 'm/s' }, soluzione: [R`$v_y = 9{,}8\,\text{m/s}^2 \cdot 3\,\text{s} = 29{,}4\,\text{m/s}$, verso il basso. I 12 m/s orizzontali non cambiano la caduta.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una palla parte a 16 m/s, inclinata di 60° sul suolo. Quanto vale la componente orizzontale della velocità?`, suggerimenti: [R`$v_{0x} = v_0 \cdot \cos\alpha$, con $\cos 60^\circ = 0{,}5$.`], risposta: { tipo: 'numero', valore: 8, unita: 'm/s' }, soluzione: [R`$v_{0x} = 16\,\text{m/s} \cdot \cos 60^\circ = 16 \cdot 0{,}5\,\text{m/s} = 8\,\text{m/s}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un proiettile parte a 50 m/s, inclinato di 30° sul suolo. Quanto vale la componente verticale della velocità di lancio?`, suggerimenti: [R`$v_{0y} = v_0 \cdot \sin\alpha$, con $\sin 30^\circ = 0{,}5$.`], risposta: { tipo: 'numero', valore: 25, unita: 'm/s' }, soluzione: [R`$v_{0y} = 50\,\text{m/s} \cdot \sin 30^\circ = 50 \cdot 0{,}5\,\text{m/s} = 25\,\text{m/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Un corpo ha una velocità con componenti $v_x = 10\,\text{m/s}$ e $v_y = 24\,\text{m/s}$. Quanto vale il modulo della velocità?`, suggerimenti: [R`Le componenti sono perpendicolari: usa il teorema di Pitagora.`], risposta: { tipo: 'numero', valore: 26, unita: 'm/s' }, soluzione: [R`$v = \sqrt{10^2 + 24^2}\,\text{m/s} = \sqrt{100 + 576}\,\text{m/s} = \sqrt{676}\,\text{m/s} = 26\,\text{m/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un pallone viene calciato con una componente verticale della velocità di 21 m/s. Senza aria, quanto sale al massimo?`, suggerimenti: [R`In cima la velocità verticale è zero.`, R`$H = \dfrac{v_{0y}^2}{2 \cdot g}$.`], risposta: { tipo: 'numero', valore: 22.5, unita: 'm' }, soluzione: [R`$H = \dfrac{(21\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = \dfrac{441}{19{,}6}\,\text{m} = 22{,}5\,\text{m}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un proiettile parte da terra con una componente verticale della velocità di 24,5 m/s e ricade a terra. Senza aria, quanto dura il volo?`, suggerimenti: [R`La salita dura $v_{0y} / g$, e la discesa altrettanto.`], risposta: { tipo: 'numero', valore: 5, unita: 's' }, soluzione: [R`Salita: $\dfrac{24{,}5}{9{,}8}\,\text{s} = 2{,}5\,\text{s}$.`, R`Tempo di volo: $t_v = 2 \cdot 2{,}5\,\text{s} = 5\,\text{s}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una pallina viene lanciata a 7 m/s con un angolo di 45°, e ricade alla stessa quota. Senza aria, quanto vale la gittata?`, suggerimenti: [R`A 45° la gittata è massima e vale $v_0^2 / g$.`], risposta: { tipo: 'numero', valore: 5, unita: 'm' }, soluzione: [R`$R = \dfrac{v_0^2 \cdot \sin 90^\circ}{g} = \dfrac{49}{9{,}8}\,\text{m} = 5\,\text{m}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Lanciata a 25° sul suolo, una palla arriva a 18 m. Con la stessa velocità e senza aria, a che distanza arriva se la lanci a 65°?`, suggerimenti: [R`Quanto fa $25^\circ + 65^\circ$?`], risposta: { tipo: 'numero', valore: 18, unita: 'm' }, soluzione: [R`$25^\circ + 65^\circ = 90^\circ$: gli angoli sono complementari e danno la stessa gittata, 18 m.`, R`Infatti $\sin 50^\circ = \sin 130^\circ$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un marciapiede mobile scorre a 0,8 m/s. Ci cammini sopra a 1,2 m/s, nello stesso verso. Quanto vale la tua velocità rispetto al pavimento della stazione?`, suggerimenti: [R`Le due velocità hanno lo stesso verso: si sommano.`], risposta: { tipo: 'numero', valore: 2, unita: 'm/s' }, soluzione: [R`$v = 1{,}2\,\text{m/s} + 0{,}8\,\text{m/s} = 2\,\text{m/s}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Una barca punta dritta verso l'altra riva a 4 m/s rispetto all'acqua. La corrente va a 3 m/s. Quanto vale la velocità della barca rispetto alla riva?`, suggerimenti: [R`Le due velocità sono perpendicolari: teorema di Pitagora.`], risposta: { tipo: 'numero', valore: 5, unita: 'm/s' }, soluzione: [R`$v = \sqrt{4^2 + 3^2}\,\text{m/s} = \sqrt{25}\,\text{m/s} = 5\,\text{m/s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un fiume è largo 72 m. Una barca punta dritta verso l'altra riva a 4 m/s rispetto all'acqua. Quanto tempo impiega ad attraversarlo?`, suggerimenti: [R`Verso la riva conta solo la velocità della barca: la corrente la sposta di lato.`], risposta: { tipo: 'numero', valore: 18, unita: 's' }, soluzione: [R`$t = \dfrac{72\,\text{m}}{4\,\text{m/s}} = 18\,\text{s}$. La corrente non cambia questo tempo.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Le lame di un frullatore fanno 50 giri al secondo. Quanto vale il periodo?`, suggerimenti: [R`Il periodo è l'inverso della frequenza: $T = 1/f$.`], risposta: { tipo: 'numero', valore: 0.02, unita: 's' }, soluzione: [R`$f = 50\,\text{Hz}$, quindi $T = \dfrac{1}{50}\,\text{s} = 0{,}02\,\text{s}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una giostra fa un giro ogni 3,14 s. Quanto vale la sua velocità angolare?`, suggerimenti: [R`$\omega = 2\pi / T$, e $\pi \approx 3{,}14$.`], risposta: { tipo: 'numero', valore: 2, unita: 'rad/s' }, soluzione: [R`$\omega = \dfrac{2\pi}{3{,}14\,\text{s}} \approx \dfrac{6{,}28}{3{,}14}\,\text{rad/s} = 2\,\text{rad/s}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un punto gira a 3 rad/s su una circonferenza di raggio 0,5 m. Quanto vale la sua velocità?`, suggerimenti: [R`$v = \omega \cdot r$.`], risposta: { tipo: 'numero', valore: 1.5, unita: 'm/s' }, soluzione: [R`$v = 3\,\text{rad/s} \cdot 0{,}5\,\text{m} = 1{,}5\,\text{m/s}$. Il radiante è un numero puro: restano i m/s.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un ciclista percorre una curva di raggio 9 m a 6 m/s costanti. Quanto vale la sua accelerazione centripeta?`, suggerimenti: [R`$a_c = v^2 / r$.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s²' }, soluzione: [R`$a_c = \dfrac{(6\,\text{m/s})^2}{9\,\text{m}} = \dfrac{36}{9}\,\text{m/s}^2 = 4\,\text{m/s}^2$, verso il centro della curva.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`In un moto circolare non uniforme l'accelerazione tangenziale vale $6\,\text{m/s}^2$ e quella centripeta $8\,\text{m/s}^2$. Quanto vale l'accelerazione totale?`, suggerimenti: [R`Le due componenti sono perpendicolari: teorema di Pitagora.`], risposta: { tipo: 'numero', valore: 10, unita: 'm/s²' }, soluzione: [R`$a = \sqrt{6^2 + 8^2}\,\text{m/s}^2 = \sqrt{100}\,\text{m/s}^2 = 10\,\text{m/s}^2$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un corpo si muove di moto armonico con ampiezza 0,3 m e pulsazione 4 rad/s. Quanto vale la sua velocità massima?`, suggerimenti: [R`La velocità è massima al centro e vale $\omega \cdot A$.`], risposta: { tipo: 'numero', valore: 1.2, unita: 'm/s' }, soluzione: [R`$v_{max} = 4\,\text{rad/s} \cdot 0{,}3\,\text{m} = 1{,}2\,\text{m/s}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una biglia rotola giù dal bordo di un tavolo alto 0,8 m e tocca terra a 1,2 m dalla base del tavolo. Con che velocità ha lasciato il tavolo? Trascura l'aria.`, suggerimenti: [R`Prima trova il tempo di caduta dall'altezza.`, R`Poi la velocità orizzontale: $v_0 = x / t$.`], risposta: { tipo: 'numero', valore: 2.97, unita: 'm/s' }, soluzione: [R`Dati: $h = 0{,}8\,\text{m}$, $x = 1{,}2\,\text{m}$. Tempo di caduta: $t = \sqrt{\dfrac{2 \cdot 0{,}8}{9{,}8}}\,\text{s} \approx 0{,}404\,\text{s}$.`, R`$v_0 = \dfrac{1{,}2\,\text{m}}{0{,}404\,\text{s}} \approx 2{,}97\,\text{m/s}$.`] },
    { id: 'es-02', difficolta: 2, testo: R`Da una terrazza alta 20 m una palla viene lanciata in orizzontale a 15 m/s. Senza aria, con che velocità (in modulo) tocca terra?`, suggerimenti: [R`La componente orizzontale resta $15\,\text{m/s}$.`, R`Quella verticale si trova con la formula senza il tempo: $v_y^2 = 2 \cdot g \cdot h$.`], risposta: { tipo: 'numero', valore: 24.8, unita: 'm/s' }, soluzione: [R`$v_x = 15\,\text{m/s}$; $v_y^2 = 2 \cdot 9{,}8 \cdot 20 = 392$, quindi $v_y \approx 19{,}8\,\text{m/s}$.`, R`$v = \sqrt{15^2 + 392}\,\text{m/s} = \sqrt{617}\,\text{m/s} \approx 24{,}8\,\text{m/s}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un proiettile parte da terra a 30 m/s, con un angolo di 50° sul suolo, e ricade a terra. Senza aria, quanto vale la gittata?`, suggerimenti: [R`Usa $R = \dfrac{v_0^2 \cdot \sin(2\alpha)}{g}$, con $2\alpha = 100^\circ$.`], risposta: { tipo: 'numero', valore: 90.4, unita: 'm' }, soluzione: [R`$R = \dfrac{900 \cdot \sin 100^\circ}{9{,}8}\,\text{m} \approx \dfrac{900 \cdot 0{,}985}{9{,}8}\,\text{m} \approx 90{,}4\,\text{m}$.`, R`Poco meno del massimo, $900 / 9{,}8 \approx 91{,}8\,\text{m}$: 50° è vicino a 45°.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un calciatore vuole servire un compagno a 21 m, con il pallone che parte e arriva a terra. Lo calcia a 15 m/s. Senza aria, qual è l'angolo più basso che funziona?`, suggerimenti: [R`Ricava $\sin(2\alpha)$ dalla formula della gittata.`, R`$\sin(2\alpha) = \dfrac{R \cdot g}{v_0^2}$; poi dividi l'angolo per due.`], risposta: { tipo: 'numero', valore: 33.1, unita: '°', tolleranza: 0.5 }, soluzione: [R`$\sin(2\alpha) = \dfrac{21 \cdot 9{,}8}{15^2} = \dfrac{205{,}8}{225} \approx 0{,}915$.`, R`$2\alpha \approx 66{,}2^\circ$, quindi $\alpha \approx 33{,}1^\circ$.`, R`Funziona anche l'angolo complementare, circa 56,9°: il pallone sale di più e arriva più tardi.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un pallone viene calciato a 18 m/s, con un angolo di 60° sul suolo. Senza aria, quanto sale al massimo?`, suggerimenti: [R`Ti serve solo la componente verticale: $v_{0y} = v_0 \cdot \sin 60^\circ$.`, R`Poi $H = \dfrac{v_{0y}^2}{2 \cdot g}$.`], risposta: { tipo: 'numero', valore: 12.4, unita: 'm' }, soluzione: [R`$v_{0y} = 18 \cdot \sin 60^\circ \approx 15{,}6\,\text{m/s}$.`, R`$H = \dfrac{15{,}59^2}{19{,}6}\,\text{m} \approx 12{,}4\,\text{m}$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un fiume è largo 80 m e la corrente va a 4 m/s. Una barca va a 5 m/s rispetto all'acqua e vuole arrivare proprio di fronte. Quanto tempo impiega ad attraversare?`, suggerimenti: [R`Per arrivare dritta deve puntare controcorrente, con $5 \cdot \sin\theta = 4$.`, R`Verso la riva le resta $\sqrt{5^2 - 4^2}\,\text{m/s}$.`], risposta: { tipo: 'numero', valore: 26.7, unita: 's' }, soluzione: [R`La componente contro la corrente deve valere 4 m/s: $\sin\theta = 0{,}8$, $\theta \approx 53^\circ$.`, R`Verso la riva: $\sqrt{25 - 16}\,\text{m/s} = 3\,\text{m/s}$.`, R`$t = \dfrac{80\,\text{m}}{3\,\text{m/s}} \approx 26{,}7\,\text{s}$. Puntando dritta ci avrebbe messo 16 s, ma sarebbe arrivata 64 m più a valle.`] },
    { id: 'es-07', difficolta: 3, testo: R`Senza vento la pioggia cade in verticale a 8 m/s. Un'auto viaggia a 6 m/s. Sul finestrino laterale le gocce lasciano righe inclinate. Di quanti gradi rispetto alla verticale?`, suggerimenti: [R`Rispetto all'auto, la goccia ha anche una velocità orizzontale di 6 m/s, all'indietro.`, R`$\tan\beta = \dfrac{6}{8}$.`], risposta: { tipo: 'numero', valore: 36.9, unita: '°', tolleranza: 0.5 }, soluzione: [R`Goccia rispetto all'auto = goccia rispetto al suolo + suolo rispetto all'auto: 8 m/s in giù più 6 m/s all'indietro.`, R`$\tan\beta = \dfrac{6}{8} = 0{,}75$, quindi $\beta \approx 36{,}9^\circ$. La goccia, vista dall'auto, va a 10 m/s.`] },
    { id: 'es-08', difficolta: 2, testo: R`Un disco di raggio 6 cm gira a 400 giri al minuto. Quanto vale la velocità di un punto del bordo?`, suggerimenti: [R`Passa ai giri al secondo, poi trova $\omega = 2\pi \cdot f$.`, R`Il raggio va in metri.`], risposta: { tipo: 'numero', valore: 2.51, unita: 'm/s' }, soluzione: [R`$f = \dfrac{400}{60}\,\text{Hz} \approx 6{,}67\,\text{Hz}$, $\omega = 2\pi \cdot 6{,}67\,\text{rad/s} \approx 41{,}9\,\text{rad/s}$.`, R`$v = \omega \cdot r \approx 41{,}9 \cdot 0{,}06\,\text{m/s} \approx 2{,}51\,\text{m/s}$.`] },
    { id: 'es-09', difficolta: 3, testo: R`La Luna gira attorno alla Terra su un'orbita quasi circolare di raggio $3{,}84 \cdot 10^8\,\text{m}$, con un periodo di 27,3 giorni. Quanto vale la sua accelerazione centripeta?`, suggerimenti: [R`Porta il periodo in secondi: un giorno ha 86 400 s.`, R`$a_c = \omega^2 \cdot r = \dfrac{4\pi^2 \cdot r}{T^2}$.`], risposta: { tipo: 'numero', valore: 0.00272, unita: 'm/s²', tolleranza: 0.00005 }, soluzione: [R`$T = 27{,}3 \cdot 86\,400\,\text{s} \approx 2{,}36 \cdot 10^6\,\text{s}$.`, R`$a_c = \dfrac{4\pi^2 \cdot 3{,}84 \cdot 10^8}{(2{,}36 \cdot 10^6)^2}\,\text{m/s}^2 \approx 2{,}72 \cdot 10^{-3}\,\text{m/s}^2$.`, R`È circa 3600 volte meno di $g$. Newton fece proprio questo conto: la Luna sta 60 raggi terrestri lontano, e $60^2 = 3600$.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un'auto entra in una curva di raggio 45 m a 15 m/s, e intanto la sua velocità cresce di 2,4 m/s ogni secondo. Quanto vale la sua accelerazione totale in quell'istante?`, suggerimenti: [R`Calcola la centripeta, $v^2 / r$.`, R`Somma le due componenti perpendicolari con Pitagora.`], risposta: { tipo: 'numero', valore: 5.55, unita: 'm/s²' }, soluzione: [R`$a_c = \dfrac{15^2}{45}\,\text{m/s}^2 = 5\,\text{m/s}^2$, verso il centro.`, R`$a = \sqrt{2{,}4^2 + 5^2}\,\text{m/s}^2 = \sqrt{30{,}76}\,\text{m/s}^2 \approx 5{,}55\,\text{m/s}^2$, in avanti e verso il centro.`] },
    { id: 'es-11', difficolta: 3, testo: R`Un corpo oscilla di moto armonico con ampiezza 8 cm e periodo 1,2 s. All'istante zero è all'estremo positivo. Dove si trova dopo 0,2 s?`, suggerimenti: [R`$x = A \cdot \cos(\omega \cdot t)$, con $\omega = 2\pi / T$.`, R`0,2 s è un sesto del periodo: la pallina che fa l'ombra ha girato di 60°.`], risposta: { tipo: 'numero', valore: 4, unita: 'cm' }, soluzione: [R`$\omega \cdot t = \dfrac{2\pi}{1{,}2} \cdot 0{,}2 = \dfrac{\pi}{3}\,\text{rad}$, cioè 60°.`, R`$x = 8\,\text{cm} \cdot \cos 60^\circ = 8 \cdot 0{,}5\,\text{cm} = 4\,\text{cm}$.`] },
    { id: 'es-12', difficolta: 2, testo: R`La punta di un ago di una macchina da cucire si muove di moto armonico con ampiezza 4 cm e frequenza 2 Hz. Quanto vale la sua accelerazione massima?`, suggerimenti: [R`$\omega = 2\pi \cdot f$.`, R`$a_{max} = \omega^2 \cdot A$, con $A$ in metri.`], risposta: { tipo: 'numero', valore: 6.32, unita: 'm/s²' }, soluzione: [R`$\omega = 2\pi \cdot 2\,\text{rad/s} \approx 12{,}57\,\text{rad/s}$.`, R`$a_{max} = 12{,}57^2 \cdot 0{,}04\,\text{m/s}^2 \approx 6{,}32\,\text{m/s}^2$, agli estremi della corsa.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Dalla stessa altezza una pallina viene lanciata in orizzontale e un'altra lasciata cadere, nello stesso istante. Senza aria, quale tocca terra per prima?`, opzioni: [R`Quella lanciata, perché ha più velocità`, R`Quella lasciata cadere, perché fa meno strada`, R`Arrivano insieme`, R`Quella con la massa maggiore`], corretta: 2, spiegazione: R`In verticale tutte e due partono da ferme e cadono con $g$: il tempo dipende solo dall'altezza. La strada più lunga della pallina lanciata è in orizzontale, e non la rallenta. La massa non conta.` },
    { id: 'q-02', domanda: R`Nel lancio obliquo, senza aria, che cosa succede alla componente orizzontale della velocità?`, opzioni: [R`Resta costante`, R`Diminuisce fino a zero nel punto più alto`, R`Cresce durante la discesa`, R`Cambia verso dopo il punto più alto`], corretta: 0, spiegazione: R`In orizzontale non c'è accelerazione: la componente $v_{0x}$ resta la stessa per tutto il volo. È la componente verticale che si annulla in cima e poi cambia verso.` },
    { id: 'q-03', domanda: R`Nel punto più alto della traiettoria di un pallone, senza aria, la velocità è…`, opzioni: [R`zero`, R`orizzontale`, R`verticale, verso il basso`, R`uguale alla velocità di lancio`], corretta: 1, spiegazione: R`In cima si annulla solo la componente verticale: resta $v_{0x}$, orizzontale. Non è zero, ed è minore della velocità di lancio, che aveva anche la parte verticale.` },
    { id: 'q-04', domanda: R`Senza aria, con partenza e arrivo alla stessa quota, a quale angolo si ottiene la gittata massima?`, opzioni: [R`90°`, R`60°`, R`30°`, R`45°`], corretta: 3, spiegazione: R`$R = v_0^2 \cdot \sin(2\alpha) / g$ è massima quando $\sin(2\alpha) = 1$, cioè $\alpha = 45^\circ$. A 90° il corpo sale e ricade nello stesso punto; 30° e 60° danno la stessa gittata, più piccola.` },
    { id: 'q-05', domanda: R`Due palle partono con la stessa velocità, una a 35° e una a 55° sul suolo. Senza aria, quale arriva più lontano?`, opzioni: [R`Quella a 35°, che va più veloce in orizzontale`, R`Quella a 55°, che resta in aria di più`, R`Arrivano nello stesso punto`, R`Dipende dalla massa delle palle`], corretta: 2, spiegazione: R`$35^\circ + 55^\circ = 90^\circ$: gli angoli complementari danno la stessa gittata. Una va più veloce in orizzontale, l'altra resta in aria più a lungo, e le due cose si compensano.` },
    { id: 'q-06', domanda: R`Con lo stesso angolo di lancio, la velocità iniziale raddoppia. Senza aria, la gittata…`, opzioni: [R`raddoppia`, R`diventa quattro volte tanto`, R`resta uguale`, R`si dimezza`], corretta: 1, spiegazione: R`La gittata dipende da $v_0^2$: velocità doppia, gittata quattro volte tanto. Raddoppia sia la velocità orizzontale sia il tempo di volo.` },
    { id: 'q-07', domanda: R`Un passeggero cammina verso la coda di un treno in corsa. Rispetto alla banchina, la sua velocità è…`, opzioni: [R`zero`, R`maggiore di quella del treno`, R`uguale a quella del treno`, R`minore di quella del treno`], corretta: 3, spiegazione: R`Le due velocità hanno verso opposto: si sottraggono. Il passeggero va un po' meno veloce del treno, ma nello stesso verso. Sarebbe fermo solo se camminasse veloce quanto il treno.` },
    { id: 'q-08', domanda: R`Per attraversare un fiume nel minor tempo possibile, dove conviene puntare la prua della barca?`, opzioni: [R`Un po' controcorrente`, R`Dritta verso l'altra riva`, R`Un po' a favore di corrente`, R`Dipende dalla velocità della corrente`], corretta: 1, spiegazione: R`Il tempo dipende solo dalla componente della velocità verso la riva, che è massima puntando dritti. Puntando controcorrente si arriva di fronte, ma più tardi.` },
    { id: 'q-09', domanda: R`In un moto circolare uniforme, dove punta l'accelerazione?`, opzioni: [R`Verso il centro`, R`Da nessuna parte: è zero, perché il modulo della velocità non cambia`, R`Lungo la tangente, come la velocità`, R`Verso l'esterno del cerchio`], corretta: 0, spiegazione: R`La velocità cambia direzione, quindi c'è accelerazione: la centripeta, verso il centro. Non è zero perché la velocità è un vettore. Verso l'esterno non punta niente: chi gira si sente spinto fuori perché tende ad andare dritto.` },
    { id: 'q-10', domanda: R`Una ruota fa 4 giri al secondo. Quanto vale il suo periodo?`, opzioni: [R`4 s`, R`2π s`, R`0,25 s`, R`8π s`], corretta: 2, spiegazione: R`La frequenza è $f = 4\,\text{Hz}$ e il periodo è il suo inverso: $T = 1/4 = 0{,}25\,\text{s}$. 4 s sarebbe il periodo con un giro ogni 4 s; $8\pi$ è la velocità angolare in rad/s, non un tempo.` },
    { id: 'q-11', domanda: R`Che cos'è un radiante?`, opzioni: [R`L'angolo che sottende un arco lungo quanto il raggio`, R`La 360ª parte di un giro`, R`L'angolo di un giro intero`, R`L'angolo retto`], corretta: 0, spiegazione: R`L'angolo in radianti è l'arco diviso il raggio: 1 rad è l'angolo con l'arco uguale al raggio, circa 57,3°. La 360ª parte di un giro è il grado; un giro intero vale $2\pi\,\text{rad}$.` },
    { id: 'q-12', domanda: R`Due auto percorrono due curve alla stessa velocità. La seconda curva ha raggio doppio. L'accelerazione centripeta della seconda auto è…`, opzioni: [R`il doppio`, R`la metà`, R`quattro volte tanto`, R`un quarto`], corretta: 1, spiegazione: R`$a_c = v^2 / r$: a parità di velocità è inversamente proporzionale al raggio. Raggio doppio, accelerazione dimezzata. Il quadrato riguarda la velocità, non il raggio.` },
    { id: 'q-13', domanda: R`Una giostra già in movimento sta prendendo velocità. Che cosa si può dire dell'accelerazione di un seggiolino?`, opzioni: [R`Punta esattamente verso il centro`, R`È tangente alla traiettoria`, R`È zero, se il raggio non cambia`, R`Ha una componente tangenziale e una centripeta`], corretta: 3, spiegazione: R`Il modulo della velocità cresce: c'è la tangenziale. La direzione cambia: c'è la centripeta. La somma non punta né solo verso il centro né solo lungo la tangente.` },
    { id: 'q-14', domanda: R`Nel moto armonico, dove è massima l'accelerazione?`, opzioni: [R`Al centro dell'oscillazione`, R`A metà strada fra il centro e un estremo`, R`Agli estremi`, R`È uguale dappertutto`], corretta: 2, spiegazione: R`$a = -\omega^2 \cdot x$: è massima dove lo spostamento è massimo, cioè agli estremi, e nulla al centro. È la velocità a essere massima al centro.` },
    { id: 'q-15', domanda: R`Il moto armonico è la proiezione su un diametro di…`, opzioni: [R`un moto uniformemente accelerato`, R`un lancio obliquo`, R`una caduta libera`, R`un moto circolare uniforme`], corretta: 3, spiegazione: R`L'ombra di una pallina che gira con velocità costante va avanti e indietro su un diametro: è il moto armonico, $x = A \cdot \cos(\omega \cdot t)$. Gli altri moti non si ripetono.` },
    { id: 'q-16', domanda: R`Nella legge $x = A \cdot \cos(\omega \cdot t)$, che cosa rappresenta $A$?`, opzioni: [R`Il massimo spostamento dal centro`, R`Il periodo`, R`La velocità massima`, R`La pulsazione`], corretta: 0, spiegazione: R`$A$ è l'ampiezza: il coseno vale al massimo 1, quindi $x$ arriva al massimo ad $A$. Il periodo è $2\pi / \omega$, la velocità massima è $\omega \cdot A$, la pulsazione è $\omega$.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nel punto più alto di un lancio la velocità **non** è zero: si annulla solo la componente verticale.` },
    { tipo: 'errore', testo: R`Nel lancio orizzontale il tempo di caduta dipende solo dall'altezza. Lanciare più forte fa arrivare più lontano, non più tardi.` },
    { tipo: 'errore', testo: R`Attento alla calcolatrice: per $\cos 30^\circ$ deve stare in gradi, per $\cos(\omega \cdot t)$ con $\omega$ in rad/s deve stare in radianti.` },
    { tipo: 'errore', testo: R`Nel moto circolare l'accelerazione punta verso il centro solo se il modulo della velocità è costante. Se il corpo accelera o frena, c'è anche la tangenziale.` },
    { tipo: 'metodo', testo: R`Nei problemi di lancio fai due colonne: in una il moto lungo $x$, uniforme; nell'altra il moto lungo $y$, accelerato. Il tempo è l'unico ponte fra le due.` },
    { tipo: 'metodo', testo: R`Con le velocità relative scrivi sempre chi si muove rispetto a chi. Gli indici si incatenano: $\vec{v}_{AC} = \vec{v}_{AB} + \vec{v}_{BC}$.` },
    { tipo: 'trucco', testo: R`Due angoli di lancio che sommati fanno 90° danno la stessa gittata: 30° e 60°, 20° e 70°.` },
    { tipo: 'trucco', testo: R`Da giri al minuto a hertz si divide per 60: 1200 giri al minuto sono 20 Hz.` }
  ],
  aneddoti: [
    { fisico: 'Niccolò Tartaglia', anni: 'circa 1499–1557', titolo: 'Il matematico balbuziente e il cannone', testo: R`Nel 1512 i francesi saccheggiarono Brescia. Niccolò Fontana era un ragazzino, e un soldato lo ferì al viso con la spada. Le ferite gli lasciarono una parlata stentata, e da allora tutti lo chiamarono Tartaglia. Diventò un grande matematico e insegnava a Verona. Nel 1531, racconta lui stesso, un bombardiere suo amico gli chiese a che inclinazione puntare il cannone per tirare più lontano. Tartaglia rispose: a 45°. Lo scrisse nella *Nova scientia*, stampata nel 1537 a Venezia, dove intanto si era trasferito. Fu uno dei primi libri sulla balistica. La forma del tiro però la sbagliava. Pensava che la palla andasse prima dritta, poi curvasse lungo un arco e infine cadesse a piombo.`, legame: R`È la gittata massima a 45°, trovata un secolo prima che si conoscesse la parabola.` },
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'La parabola dei proiettili', testo: R`Galileo ebbe un'idea nuova per capire il volo di una palla: dividerlo in due moti. In orizzontale la palla conserva la sua velocità. In verticale cade come un sasso, con spazi che crescono come i quadrati dei tempi. Mettendo insieme i due moti, ottenne una curva precisa: la parabola. Lo dimostrò nei *Discorsi e dimostrazioni matematiche intorno a due nuove scienze*, stampati a Leida nel 1638. In quegli anni Galileo era agli arresti nella sua villa di Arcetri, dopo la condanna del 1633, e stava perdendo la vista. Nello stesso libro dimostrò anche un'altra cosa. Due lanci con angoli ugualmente lontani da 45° arrivano alla stessa distanza.`, legame: R`È il principio di indipendenza dei moti, con la gittata uguale per angoli complementari.` },
    { fisico: 'James Bradley', anni: '1693–1762', titolo: 'La banderuola sulla barca del Tamigi', testo: R`Negli anni Venti del Settecento l'astronomo inglese James Bradley voleva misurare la distanza di una stella. Osservò la stella Gamma Draconis per mesi e la vide spostarsi un poco nel cielo. Ma lo spostamento non andava nel verso che si aspettava. Si racconta che la soluzione gli venne in barca, sul Tamigi. A ogni cambio di rotta la banderuola in cima all'albero cambiava direzione, anche se il vento era sempre lo stesso. Il vento visto dalla barca dipende dalla velocità della barca. Lo stesso vale per la luce delle stelle, vista dalla Terra che si muove. Bradley pubblicò la scoperta, l'*aberrazione della luce*, nel 1729. Ne ricavò anche il tempo che la luce impiega ad arrivare dal Sole: circa otto minuti.`, legame: R`È la composizione delle velocità: come la barca nel fiume, ma con la luce delle stelle.` },
    { fisico: 'Christiaan Huygens', anni: '1629–1695', titolo: 'La regola dei corpi che girano', testo: R`Christiaan Huygens era olandese: matematico, astronomo, inventore. Nel 1656 costruì il primo orologio a pendolo davvero preciso. Studiò anche i corpi che girano in tondo, come un sasso legato a un filo. Nel 1659 trovò la regola: l'effetto cresce con il quadrato della velocità e cala con il raggio del giro. Lui la chiamava «forza centrifuga», la tensione che il sasso dà al filo. Non pubblicò subito la dimostrazione. Nel 1673, in fondo al suo libro sugli orologi, l'*Horologium oscillatorium*, mise soltanto gli enunciati. Il trattato completo, il *De vi centrifuga*, uscì nel 1703, otto anni dopo la sua morte.`, legame: R`È la formula dell'accelerazione centripeta, $a_c = v^2 / r$.` }
  ]
});
})();
