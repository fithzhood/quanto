/* Quanto — Lavoro ed energia (terzo anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/energia.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'energia',
  titolo: 'Lavoro ed energia',
  introduzione: R`Una molla compressa, un sasso in cima a una rupe, un'auto in autostrada. Anche una merendina. Tutti possono mettere in moto qualcosa, sollevarlo o scaldarlo. Si dice che hanno **energia**.

L'energia cambia forma di continuo, ma non si crea e non si distrugge. Per questo è la grandezza più utile della fisica. Con lei si risponde a domande concrete senza seguire il moto istante per istante. Quanto è veloce un vagone in fondo alla discesa? Quanti metri servono per fermare un'auto? Quanto costa tenere acceso un forno?

Si comincia dal **lavoro**, il modo in cui una forza dà o toglie energia a un corpo. Servono le forze, il secondo principio della dinamica e il coseno di un angolo.`,
  inBreve: [
    R`Il **lavoro** di una forza è $L = F \cdot s \cdot \cos\alpha$, in joule: conta solo la parte della forza lungo lo spostamento. Senza spostamento, niente lavoro.`,
    R`L'**energia cinetica** è $E_c = \tfrac{1}{2} \cdot m \cdot v^2$. Il lavoro della forza risultante è uguale alla sua variazione.`,
    R`L'**energia potenziale** del peso è $E_p = m \cdot g \cdot h$; quella di una molla è $\tfrac{1}{2} \cdot k \cdot x^2$. Il lavoro del peso dipende solo dal dislivello.`,
    R`Se lavorano solo forze conservative, come il peso, l'**energia meccanica** $E_c + E_p$ resta costante. Con l'attrito cala, e la parte che manca diventa energia interna.`,
    R`La **potenza** è il lavoro diviso il tempo, in watt. Il chilowattora è un'energia: $1\,\text{kWh} = 3{,}6 \cdot 10^6\,\text{J}$.`,
    R`L'energia totale si conserva sempre, ma a ogni trasformazione un po' si disperde: il **rendimento** è sempre minore di 1.`
  ],
  sezioni: [
    {
      id: 'lavoro',
      titolo: 'Il lavoro di una forza',
      testo: R`Spingi un muro per un minuto: alla fine sei stanco. Eppure il muro è rimasto dov'era. In fisica la parola **lavoro** ha un significato preciso, diverso da «fatica».

[[video:energia/lavoro]]

Una forza fa lavoro solo se il corpo si sposta. Se la forza ha la stessa direzione e lo stesso verso dello spostamento, il lavoro è forza per spostamento: $L = F \cdot s$. Se la forza è inclinata, conta solo la sua parte lungo lo spostamento, cioè $F \cdot \cos\alpha$.

>* Il **lavoro** di una forza costante $F$ su uno spostamento rettilineo $s$ è $L = F \cdot s \cdot \cos\alpha$. Qui $\alpha$ è l'angolo fra forza e spostamento. Si misura in **joule**: $1\,\text{J} = 1\,\text{N} \cdot 1\,\text{m}$.

È il prodotto scalare dei due vettori, $L = \vec{F} \cdot \vec{s}$: il risultato è un numero, non una freccia.

~ L = F \cdot s \cdot \cos\alpha :: tiri uno slittino con una corda inclinata di 30°
~ L = 60\,\text{N} \cdot 10\,\text{m} \cdot \cos 30° :: la forza è di 60 N, lo slittino fa 10 m
~ L \approx 600 \cdot 0{,}866\,\text{J} \approx \evidb{520\,\text{J}} :: newton per metro fa joule

Il segno del lavoro dipende dall'angolo:
- fra 0° e 90° il lavoro è **positivo**: la forza aiuta il moto;
- a 90° è **zero**: una forza perpendicolare allo spostamento non lavora;
- fra 90° e 180° è **negativo**: la forza ostacola il moto, come l'attrito.

[[grafico:lavoro-angolo]]

>! La fatica non è lavoro. I muscoli consumano energia anche quando tengono fermo un peso. Ma sul peso fermo il lavoro è zero.

?? Cammini in piano a velocità costante, con una valigia da 15 kg in mano. Quanto lavoro fa la forza con cui la reggi?
[ ] $15 \cdot 9{,}8\,\text{J}$ per ogni metro
[x] zero
[ ] dipende da quanto cammini veloce
=> La tua forza è verticale, lo spostamento è orizzontale: $\alpha = 90°$ e $\cos 90° = 0$. Fai fatica, ma il lavoro sulla valigia è zero.`
    },
    {
      id: 'cinetica',
      titolo: 'L\'energia cinetica',
      testo: R`Un'auto lanciata può sfondare un cancello. Una palla veloce rompe un vetro. Un corpo in moto può fare lavoro su un altro corpo: ha **energia del moto**.

Da dove viene questa energia? Dal lavoro di chi lo ha messo in moto. Prendi un carrello di massa $m$ su una rotaia senza attrito. Peso e forza normale sono perpendicolari al moto: non lavorano. Lo spinge solo la forza $F$, che è la risultante.

[[video:energia/cinetica]]

Il carrello accelera, con $F = m \cdot a$. Il conto lega il lavoro alle velocità iniziale e finale:

~ L = F \cdot s :: la forza è costante, nel verso dello spostamento
~ L = m \cdot a \cdot s :: secondo principio della dinamica
~ a \cdot s = \dfrac{v^2 - v_0^2}{2} :: dalla formula senza il tempo
~ L = \evidb{\tfrac{1}{2} \cdot m \cdot v^2 - \tfrac{1}{2} \cdot m \cdot v_0^2} :: energia del moto finale meno iniziale

>* L'**energia cinetica** di un corpo di massa $m$ e velocità $v$ è $E_c = \tfrac{1}{2} \cdot m \cdot v^2$. **Teorema dell'energia cinetica**: il lavoro della forza risultante è uguale alla variazione dell'energia cinetica, $L = \Delta E_c$.

Esempio. Un pallone da 0,4 kg calciato a 15 m/s ha $E_c = \tfrac{1}{2} \cdot 0{,}4\,\text{kg} \cdot (15\,\text{m/s})^2 = 45\,\text{J}$.

Se la risultante va contro il moto, il lavoro è negativo e l'energia cinetica cala: il corpo rallenta. Per fermarlo bisogna togliergli tutta la sua $E_c$.

[[grafico:cinetica]]

La velocità compare al quadrato. A velocità doppia l'energia cinetica è **quattro volte** tanto. Per fermare l'auto con la stessa forza serve quindi uno spazio quattro volte più lungo.

>! L'energia cinetica non è mai negativa: la massa è positiva e $v^2$ anche. È la sua *variazione* che può essere negativa.

?? Un'auto passa da 30 km/h a 60 km/h. Che cosa succede alla sua energia cinetica?
[ ] raddoppia
[ ] aumenta della metà
[x] diventa quattro volte tanto
=> $E_c$ dipende da $v^2$: velocità doppia, $2^2 = 4$ volte l'energia.`
    },
    {
      id: 'potenziale',
      titolo: 'Il lavoro del peso e l\'energia potenziale',
      testo: R`Un vaso sul davanzale non si muove, ma se cade può rompere qualcosa. Ha energia per la sua **posizione**: più è in alto, più ne ha.

Quando un corpo scende di un dislivello $h$, il peso $P = m \cdot g$ è parallelo allo spostamento verticale: fa lavoro $m \cdot g \cdot h$. Quando sale, il lavoro del peso è negativo. E se la strada non è verticale? Porti una cassa in cima a un piano: per la scala o per la rampa?

[[video:energia/potenziale]]

Sulla scala il peso lavora solo sulle alzate, che sono verticali. Sulla rampa lo spostamento è più lungo, ma il coseno abbassa il conto. Il risultato è lo stesso: il lavoro del peso dipende solo dal dislivello, non dalla strada.

[[grafico:scala-rampa]]

>* L'**energia potenziale gravitazionale** di un corpo all'altezza $h$ è $E_p = m \cdot g \cdot h$. Il lavoro del peso è l'energia potenziale persa: $L_P = -\Delta E_p = m \cdot g \cdot h_i - m \cdot g \cdot h_f$.

L'altezza si misura da un livello zero che si sceglie: il pavimento, il tavolo, il fondo valle. Cambiando lo zero cambia $E_p$, ma non le sue **differenze**. E nei conti contano solo quelle.

~ E_p = m \cdot g \cdot h :: metti una borsa da 8 kg su uno scaffale alto 2,5 m
~ E_p = 8\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 2{,}5\,\text{m} :: zero sul pavimento
~ E_p = \evidb{196\,\text{J}} :: è il lavoro che il peso farà se la borsa cade

Una forza il cui lavoro non dipende dalla strada si dice **conservativa**. Su un giro chiuso, che torna al punto di partenza, il suo lavoro è zero. Il peso e la forza elastica sono conservative. L'attrito dinamico no: va sempre contro lo strisciamento, e il suo lavoro è negativo su ogni tratto.

>! L'energia potenziale è legata alla forza peso, quindi alla Terra. Non è una cosa che il corpo possiede da solo, come la massa.

?? Una pallina scende da A a B, più in basso, per tre scivoli diversi: uno ripido, uno dolce, uno a curve. Su quale il peso fa più lavoro?
[ ] su quello ripido
[ ] su quello a curve, che è più lungo
[x] su tutti lo stesso
=> Il peso è una forza conservativa: il suo lavoro dipende solo dal dislivello fra A e B, $m \cdot g \cdot h$.`
    },
    {
      id: 'elastica',
      titolo: 'La forza elastica e l\'energia elastica',
      testo: R`Una molla compressa lancia una pallina del flipper. Anche una molla deformata ha energia potenziale: si chiama **energia elastica**.

Per comprimere una molla di $x$ serve una forza che cresce: $F = k \cdot x$, la legge di Hooke. All'inizio basta poco, alla fine serve tanto. Il lavoro non è quindi forza finale per spostamento.

[[video:energia/molla]]

Nel grafico forza–compressione il lavoro è l'**area** sotto la retta. Ogni striscia sottile è una forza per un piccolo spostamento. Insieme formano un triangolo con base $x$ e altezza $k \cdot x$.

~ L = \tfrac{1}{2} \cdot \text{base} \cdot \text{altezza} :: area del triangolo sotto la retta F = k·x
~ L = \tfrac{1}{2} \cdot x \cdot \evid{k \cdot x} :: l'altezza è la forza finale
~ L = \evidb{\tfrac{1}{2} \cdot k \cdot x^2} :: il lavoro resta nella molla

>* L'**energia elastica** di una molla di costante $k$, compressa o allungata di $x$, è $E_{\text{el}} = \tfrac{1}{2} \cdot k \cdot x^2$. Con $k$ in N/m e $x$ in metri viene in joule.

Esempio. Una molla da $400\,\text{N/m}$ compressa di 5 cm ha $E_{\text{el}} = \tfrac{1}{2} \cdot 400\,\text{N/m} \cdot (0{,}05\,\text{m})^2 = 0{,}5\,\text{J}$.

[[grafico:molla]]

La compressione compare al quadrato. Compressione doppia: forza doppia, triangolo con base e altezza doppie, energia **quattro volte** tanto. Anche la forza elastica è conservativa: la molla restituisce tutto il lavoro che ha ricevuto.

>! Il lavoro per comprimere una molla non è $k \cdot x$ per $x$: la forza $k \cdot x$ c'è solo alla fine. Ci vuole il mezzo davanti.

?? Una molla compressa di 2 cm ha 0,3 J di energia elastica. Quanta ne ha compressa di 4 cm?
[ ] 0,6 J
[x] 1,2 J
[ ] 0,8 J
=> L'energia va con $x^2$: compressione doppia, energia $2^2 = 4$ volte. $4 \cdot 0{,}3 = 1{,}2\,\text{J}$.`
    },
    {
      id: 'conservazione',
      titolo: 'La conservazione dell\'energia meccanica',
      testo: R`Sulle montagne russe il vagone sale lento e scende veloce. In cima ha tanta energia potenziale e poca cinetica. In fondo succede il contrario. La somma delle due si chiama **energia meccanica**.

Supponi che non ci siano attrito e resistenza dell'aria. Sul vagone lavora solo il peso: la forza del binario è perpendicolare al moto e non lavora. Allora:

~ L_P = \Delta E_c :: teorema dell'energia cinetica: lavora solo il peso
~ L_P = -\Delta E_p :: il lavoro del peso è l'energia potenziale persa
~ \Delta E_c + \Delta E_p = 0 :: uguaglio le due espressioni
~ \evidb{E_c + E_p = \text{costante}} :: quello che una perde, l'altra lo guadagna

[[video:energia/conservazione]]

>* **Conservazione dell'energia meccanica**: se lavorano solo forze conservative, l'energia meccanica $E_m = E_c + E_p$ resta costante. L'energia passa da una forma all'altra, ma la somma non cambia.

Da qui viene la velocità in fondo a una discesa, partendo da fermi da un'altezza $h$. Tutta $m \cdot g \cdot h$ diventa $\tfrac{1}{2} \cdot m \cdot v^2$. La massa si semplifica:

$$v = \sqrt{2 \cdot g \cdot h}$$

Esempio. Un sasso lasciato cadere da 5 m arriva a $v = \sqrt{2 \cdot 9{,}8 \cdot 5}\,\text{m/s} \approx 9{,}9\,\text{m/s}$. La forma della strada non conta, e neppure la massa: conta solo il dislivello.

[[grafico:montagne]]

Nell'energia potenziale si può mettere anche quella elastica. Una molla lancia un carrello su una rampa: elastica, poi cinetica, poi potenziale del peso. La somma resta la stessa.

>! La conservazione vale solo se non lavorano attriti, resistenza dell'aria, motori o spinte. Con l'attrito l'energia meccanica cala: lo si vede nella prossima sezione.

?? Lanci una palla verso l'alto a 7 m/s. Trascurando l'aria, fino a che altezza sale?
[x] circa 2,5 m
[ ] circa 0,7 m
[ ] circa 5 m
=> In cima la palla è ferma: tutta l'energia cinetica è diventata potenziale. $h = \dfrac{v^2}{2 \cdot g} = \dfrac{49}{19{,}6}\,\text{m} = 2{,}5\,\text{m}$.`
    },
    {
      id: 'attrito',
      titolo: 'L\'attrito e l\'energia interna',
      testo: R`Un'altalena lasciata a se stessa oscilla sempre meno, poi si ferma. Le montagne russe vere non tornano mai all'altezza di partenza. L'energia meccanica cala: dove va?

L'attrito dinamico va sempre contro lo strisciamento, la resistenza dell'aria contro il moto. Fanno un lavoro **negativo**, e l'energia meccanica diminuisce proprio di quel lavoro. L'attrito statico invece può anche spingere avanti, o non fare lavoro.

[[video:energia/attrito]]

L'energia che manca non è sparita. Ruote, binari e aria si sono un po' scaldati: le loro particelle si agitano di più. Quell'energia si chiama **energia interna**.

>* Con l'attrito e la resistenza dell'aria la variazione dell'energia meccanica è uguale al loro lavoro, che è negativo: $\Delta E_m = L_{\text{attrito}}$. L'energia meccanica persa diventa **energia interna**. L'energia totale si conserva.

Esempio. Una slitta da 20 kg parte ferma da 10 m di quota. In fondo va a 11 m/s. Quanta energia ha preso l'attrito?

~ E_{m,i} = m \cdot g \cdot h = 20 \cdot 9{,}8 \cdot 10\,\text{J} :: in cima: solo energia potenziale
~ E_{m,i} = 1960\,\text{J} :: zero della quota in fondo alla pista
~ E_{m,f} = \tfrac{1}{2} \cdot 20 \cdot 11^2\,\text{J} = 1210\,\text{J} :: in fondo: solo energia cinetica
~ \Delta E_m = 1210\,\text{J} - 1960\,\text{J} = \evidb{-750\,\text{J}} :: il lavoro dell'attrito

I 750 J non sono persi: hanno scaldato la neve e i pattini della slitta.

[[grafico:passaggi]]

Per questo, sulle montagne russe, ogni dosso è più basso del primo. Il vagone sale il primo tirato da una catena. Poi va avanti solo con l'energia che ha. Alla fine i freni trasformano il resto in energia interna.

>! «Energia persa» vuol dire persa come energia meccanica. Come energia totale non si perde nulla.

?? Una palla lasciata cadere sul pavimento rimbalza sempre più in basso. Perché?
[ ] la gravità si indebolisce a ogni rimbalzo
[x] a ogni urto una parte dell'energia diventa energia interna e suono
[ ] la massa della palla diminuisce
=> L'urto deforma la palla e il pavimento, che si scaldano un poco, e fa rumore. L'energia meccanica cala, l'energia totale resta la stessa.`
    },
    {
      id: 'potenza',
      titolo: 'La potenza',
      testo: R`Fare le scale di corsa stanca di più che farle camminando. Eppure il lavoro contro il peso è lo stesso, $m \cdot g \cdot h$. Cambia la rapidità con cui lo fai.

[[video:energia/potenza]]

>* La **potenza** è il lavoro diviso il tempo impiegato: $P = \dfrac{L}{\Delta t}$. Si misura in **watt**: $1\,\text{W} = 1\,\text{J/s}$.

~ L = m \cdot g \cdot h = 250 \cdot 9{,}8 \cdot 10\,\text{J} :: un montacarichi alza 250 kg di 10 m in 25 s, a velocità costante
~ L = 24\,500\,\text{J} :: il lavoro contro il peso
~ P = \dfrac{24\,500\,\text{J}}{25\,\text{s}} = \evidb{980\,\text{W}} :: quasi un chilowatt

Quando una forza spinge un corpo a velocità costante $v$, nella sua stessa direzione, c'è una formula comoda. In un secondo il corpo fa $v$ metri, quindi la potenza è forza per velocità: $P = F \cdot v$.

[[grafico:potenza]]

Sulla bolletta della luce c'è il **chilowattora**, kWh. Sembra una potenza, ma è un'**energia**: quella che serve a tenere accesi 1000 W per un'ora.

~ 1\,\text{kWh} = 1000\,\text{W} \cdot 3600\,\text{s} :: un'ora sono 3600 secondi
~ 1\,\text{kWh} = \evidb{3{,}6 \cdot 10^6\,\text{J}} :: tre milioni e seicentomila joule

Un forno da 2,5 kW acceso per 2 ore usa $2{,}5\,\text{kW} \cdot 2\,\text{h} = 5\,\text{kWh}$. In bolletta si paga l'energia, non la potenza.

>! Non confondere il simbolo $P$ della potenza con quello del peso. Nei problemi con tutti e due, il peso si scrive $m \cdot g$.

?? Che cosa si paga, sulla bolletta della luce?
[ ] la potenza degli elettrodomestici, in kW
[x] l'energia consumata, in kWh
[ ] la corrente, in ampere
=> Il chilowattora è una potenza per un tempo, cioè un'energia: $3{,}6 \cdot 10^6\,\text{J}$. Un apparecchio potente acceso poco può costare meno di uno debole acceso sempre.`
    },
    {
      id: 'forme',
      titolo: 'Le forme dell\'energia',
      testo: R`Un panino, una pila, il Sole. Sembrano cose diversissime, ma hanno una cosa in comune: possono fare lavoro. Hanno energia, in forme diverse.

[[video:energia/forme]]

Le forme principali sono queste:
- **cinetica**: ce l'ha chi si muove;
- **potenziale**: dipende dalla posizione, come quella del peso e della molla;
- **interna**, o termica: è l'agitazione delle particelle di un corpo;
- **chimica**: sta nei legami fra gli atomi, nel cibo, nella benzina, nelle pile;
- **elettrica**: è quella delle cariche, che viaggia nei fili;
- **nucleare**: sta nei nuclei degli atomi, e fa splendere il Sole.

>* L'energia è **una sola grandezza** che passa da una forma all'altra. Si misura sempre in joule. **Principio di conservazione dell'energia**: l'energia totale non si crea e non si distrugge, si trasforma.

Per avere un'idea dei numeri:

| che cosa | energia |
|---|---|
| una palla da tennis di 58 g servita a 50 m/s | circa 70 J |
| un'auto di 1200 kg a 50 km/h | circa 116 000 J |
| una merendina da 200 kcal | circa 840 000 J |
| 1 kWh della bolletta | 3 600 000 J |
| un litro di benzina | più di 30 000 000 J |

Il cibo si misura spesso in **chilocalorie**: $1\,\text{kcal} = 4186\,\text{J}$. Immagina che il corpo usi tutta una merendina da 200 kcal per salire. Una persona di 60 kg salirebbe di più di un chilometro. I muscoli però ne trasformano in lavoro solo circa un quarto. Il resto diventa energia interna: è per questo che, salendo, ci si scalda.

>! Il **calore** non è una forma di energia che un corpo possiede. È energia che passa da un corpo caldo a uno freddo. Quella che un corpo ha dentro è l'energia interna.

?? Una pila alimenta un motorino che solleva un peso. Che trasformazione c'è, dall'inizio alla fine?
[x] da chimica a elettrica, poi a cinetica, poi a potenziale
[ ] da elettrica a chimica, poi a potenziale
[ ] da potenziale a chimica, poi a cinetica
=> Nella pila l'energia è chimica. La corrente la porta come energia elettrica al motore, che la fa diventare cinetica. Sollevando il peso, diventa potenziale. Un po' a ogni passaggio diventa energia interna.`
    },
    {
      id: 'rendimento',
      titolo: 'Rendimento e fonti di energia',
      testo: R`Da dove viene la luce di una lampadina? Si può seguire l'energia all'indietro, passaggio dopo passaggio, fino al Sole.

[[video:energia/catena]]

In una centrale il carbone brucia e scalda il vapore. Il vapore fa girare una turbina e l'alternatore produce energia elettrica. La rete la porta a casa, e il LED la fa diventare luce.

A ogni passaggio una parte dell'energia diventa energia interna dell'ambiente: aria, acqua, fili. Non si perde, ma si **disperde** e non si può più usare. Su 100 J di carbone, solo circa 13 J diventano luce di un LED.

[[grafico:catena]]

>* Il **rendimento** di una macchina è il rapporto fra l'energia utile che fornisce e l'energia che riceve: $\eta = \dfrac{E_{\text{utile}}}{E_{\text{spesa}}}$. È un numero puro, sempre minore di 1, spesso scritto in percentuale.

In una catena di macchine, il rendimento totale è il **prodotto** dei rendimenti.

~ \eta = \eta_1 \cdot \eta_2 :: un motore elettrico al 90% muove un nastro al 70%
~ \eta = 0{,}90 \cdot 0{,}70 :: si moltiplicano i rendimenti, non si sommano
~ \eta = \evidb{0{,}63} :: cioè il 63%: meno del più basso dei due

### Le fonti di energia

L'energia che usiamo la prendiamo da **fonti** naturali: petrolio, carbone, gas, uranio, acqua, vento, Sole.

[[video:energia/fonti]]

[[grafico:fonti]]

Petrolio, carbone, gas naturale e uranio sono fonti **non rinnovabili**: si consumano molto più in fretta di quanto la natura le rifaccia. Il petrolio si forma in milioni di anni, e lo bruciamo in pochi secoli. Le fonti **rinnovabili**, come Sole, vento, acqua e biomasse, si rinnovano da sole.

> Ogni secondo il Sole manda sulla Terra circa $1{,}7 \cdot 10^{17}\,\text{J}$. In circa un'ora ci arriva l'energia che l'umanità usa in un anno intero.

>! Il rendimento non può arrivare al 100%: nessuna macchina trasforma tutta l'energia in quella utile. Una macchina con rendimento maggiore di 1 creerebbe energia dal nulla.

?? Una centrale ha rendimento 40%, la rete 90%. Che frazione dell'energia del combustibile arriva nelle case?
[ ] 130%
[x] 36%
[ ] 50%
=> In catena i rendimenti si moltiplicano: $0{,}40 \cdot 0{,}90 = 0{,}36$, cioè il 36%.`
    }
  ],
  grafici: {
    /* la forza inclinata sulla cassa: lavora solo la componente lungo lo spostamento (forze arancio, lavoro verde) */
    'lavoro-angolo': {
      tipo: 'piano', x: [-3.4, 3.8], y: [-1.9, 3.5], altezza: 420, assi: false, griglia: false,
      parametri: [{ nome: 'al', min: 0, max: 180, passo: 5, valore: 40, etichetta: 'angolo α (°)' }],
      elementi: [
        { tipo: 'segmento', da: [-3.4, 0], a: [3.8, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.6, 0], [0.6, 0], [0.6, 0.9], [-0.6, 0.9]], colore: 'grigio' },
        { tipo: 'angolo', vertice: [0.6, 0.9], da: [1.6, 0.9], a: ['0.6 + cos(al*pi/180)', '0.9 + sin(al*pi/180)'], raggio: 0.5, etichetta: 'α', colore: 'grigio' },
        { tipo: 'vettore', da: [0.6, 0.9], modulo: 3, angolo: 'al', etichetta: 'F', colore: 2, componenti: { etichette: ['F_∥', 'F_⊥'], colore: 2 } },
        { tipo: 'vettore', da: [-2.5, -0.8], a: [2.5, -0.8], etichetta: 's = 5 m', colore: 'grigio' },
        { tipo: 'testo', p: [3.7, -1.6], testo: 'L = 30 · 5 · cos α ≈ {{round(150*cos(al*pi/180))}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una forza F di 30 N tira una cassa che si sposta di 5 m (la freccia di F è lunga come 3 volte 10 N). Lavora solo la componente F∥, lungo lo spostamento. Oltre 90° la componente punta all\'indietro e il lavoro è negativo. Il cursore cambia l\'angolo.'
    },
    /* l'energia cinetica cresce con il quadrato della velocità: da 3 a 6 m/s quattro volte tanto */
    cinetica: {
      tipo: 'piano', x: [0, 8], y: [0, 200], altezza: 400, etichette: { x: 'v (m/s)', y: 'E_c (J)' },
      parametri: [{ nome: 'm', min: 1, max: 6, passo: 0.5, valore: 4, etichetta: 'massa (kg)' }],
      funzioni: [{ f: '0.5*m*x^2', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: [3, 0], a: [3, '4.5*m'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [6, 0], a: [6, '18*m'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [3, '4.5*m'], etichetta: '{{4.5*m}} J', posizione: 'basso-destra', colore: 3 },
        { tipo: 'punto', p: [6, '18*m'], etichetta: '{{18*m}} J', posizione: 'destra', colore: 3 }
      ],
      didascalia: 'L\'energia cinetica in funzione della velocità, per un corpo di massa fissata: E_c = ½·m·v², un arco di parabola. Da 3 m/s a 6 m/s la velocità raddoppia e l\'energia diventa quattro volte tanto. Il cursore cambia la massa.'
    },
    /* scala e rampa fino alla stessa altezza: il lavoro del peso è sempre −m·g·h */
    'scala-rampa': {
      tipo: 'piano', x: [-3.2, 5.2], y: [-1, 3.6], altezza: 380, assi: false, griglia: false,
      parametri: [{ nome: 'th', min: 25, max: 60, passo: 5, valore: 35, etichetta: 'inclinazione della rampa (°)' }],
      elementi: [
        { tipo: 'segmento', da: [-3.2, 0], a: [5.2, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [-2.5, 0], a: [-2.5, 0.5], colore: 'grigio' },
        { tipo: 'segmento', da: [-2.5, 0.5], a: [-2, 0.5], colore: 'grigio' },
        { tipo: 'segmento', da: [-2, 0.5], a: [-2, 1], colore: 'grigio' },
        { tipo: 'segmento', da: [-2, 1], a: [-1.5, 1], colore: 'grigio' },
        { tipo: 'segmento', da: [-1.5, 1], a: [-1.5, 1.5], colore: 'grigio' },
        { tipo: 'segmento', da: [-1.5, 1.5], a: [-1, 1.5], colore: 'grigio' },
        { tipo: 'segmento', da: [-1, 1.5], a: [-1, 2], colore: 'grigio' },
        { tipo: 'segmento', da: [-1, 2], a: [0.5, 2], colore: 'grigio' },
        { tipo: 'segmento', da: [0.5, 2], a: ['0.5 + 2*cos(th*pi/180)/sin(th*pi/180)', 0], colore: 'grigio' },
        { tipo: 'segmento', da: [0.5, 0], a: [0.5, 2], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [0.35, 0.9], testo: 'h = 2 m', ancora: 'end' },
        { tipo: 'poligono', punti: [[-0.7, 2], [0.1, 2], [0.1, 2.5], [-0.7, 2.5]], colore: 'grigio' },
        { tipo: 'angolo', vertice: ['0.5 + 2*cos(th*pi/180)/sin(th*pi/180)', 0], da: [0.5, 0], a: [0.5, 2], raggio: 0.6, etichetta: 'θ', colore: 'grigio' },
        { tipo: 'testo', p: [5.1, 3.2], testo: 'rampa lunga {{2/sin(th*pi/180)}} m', ancora: 'end' },
        { tipo: 'testo', p: [5.1, 2.6], testo: 'lavoro del peso: {{58.8*(2/sin(th*pi/180))*cos((90 + th)*pi/180)}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una cassa di 6 kg (peso 58,8 N) portata a 2 m di altezza per la scala o per la rampa. Sulla scala lavorano solo le alzate: −58,8 N · 2 m = −117,6 J. Sulla rampa lo spostamento è più lungo, ma il coseno dell\'angolo fra peso e spostamento è più piccolo: il lavoro è lo stesso. Il cursore cambia l\'inclinazione.'
    },
    /* il lavoro per comprimere la molla è l'area del triangolo sotto F = k·x */
    molla: {
      tipo: 'piano', x: [0, 12], y: [0, 66], altezza: 400, etichette: { x: 'x (cm)', y: 'F (N)' },
      parametri: [{ nome: 'xc', min: 1, max: 12, passo: 1, valore: 6, etichetta: 'compressione (cm)' }],
      funzioni: [{ f: '5*x', colore: 2 }],
      elementi: [
        { tipo: 'area', f: '5*x', da: 0, a: 'xc', colore: 3 },
        { tipo: 'segmento', da: ['xc', 0], a: ['xc', '5*xc'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['xc', '5*xc'], etichetta: '{{5*xc}} N', posizione: 'sinistra', colore: 2 },
        { tipo: 'testo', p: [11.8, 6], testo: 'E_{el} = {{0.025*xc^2}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La forza che serve a comprimere una molla di costante k = 500 N/m, con la compressione in centimetri. L\'area verde, un triangolo, è il lavoro fatto: diventa energia elastica. A compressione doppia l\'area è quattro volte tanto. Il cursore cambia la compressione.'
    },
    /* le montagne russe senza attrito: potenziale e cinetica si travasano, la somma resta (barre verdi come nel video) */
    montagne: {
      tipo: 'piano', x: [0, 100], y: [-5, 37], altezza: 420, assi: false, griglia: false, proporzioni: 'libere',
      parametri: [{ nome: 'p', min: 0, max: 60, passo: 1, valore: 12, etichetta: 'posizione del vagone' }],
      funzioni: [{ f: '30*((x - 30)/30)^2 + 14*exp(0 - ((x - 30)/5)^2)', dominio: [0, 60], colore: 'grigio' }],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [60, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['p', '30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2)'], colore: 'grigio' },
        { tipo: 'poligono', punti: [[63, 0], [71, 0], [71, '30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2)'], [63, '30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2)']], colore: 3 },
        { tipo: 'poligono', punti: [[75, 0], [83, 0], [83, '30 - (30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2))'], [75, '30 - (30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2))']], colore: 3 },
        { tipo: 'poligono', punti: [[87, 0], [95, 0], [95, 30], [87, 30]], colore: 3 },
        { tipo: 'testo', p: [67, -3.2], testo: 'E_p' },
        { tipo: 'testo', p: [79, -3.2], testo: 'E_c' },
        { tipo: 'testo', p: [91, -3.2], testo: 'totale' },
        { tipo: 'testo', p: [91, 32.2], testo: '117,6 kJ', colore: 3 },
        { tipo: 'testo', p: [30, 34], testo: 'E_p = {{3.92*(30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2))}} kJ', colore: 3 },
        { tipo: 'testo', p: [30, 29.5], testo: 'E_c = {{117.6 - 3.92*(30*((p - 30)/30)^2 + 14*exp(0 - ((p - 30)/5)^2))}} kJ', colore: 3 },
        { tipo: 'testo', p: [30, 25], testo: 'v = {{sqrt(19.6*(30 - 30*((p - 30)/30)^2 - 14*exp(0 - ((p - 30)/5)^2)))}} m/s', colore: 1 }
      ],
      didascalia: 'Un vagone di 400 kg parte fermo da 30 m di altezza, senza attrito (zero della quota sulla linea tratteggiata). Le barre sono la sua energia potenziale, la cinetica e il totale: le prime due si travasano, la somma resta 117,6 kJ. Il cursore sposta il vagone.'
    },
    /* con l'attrito, a ogni passaggio una parte della meccanica (pieno) diventa interna (vuoto); il totale resta 100% */
    passaggi: {
      tipo: 'piano', x: [0, 13], y: [-14, 116], altezza: 400, assi: false, griglia: false, proporzioni: 'libere',
      parametri: [{ nome: 'f', min: 0, max: 30, passo: 5, valore: 15, etichetta: 'energia persa (%)' }],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [10, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0.4, 0], [1.6, 0], [1.6, 100], [0.4, 100]], colore: 3 },
        { tipo: 'poligono', punti: [[2.4, 0], [3.6, 0], [3.6, '100*(1 - f/100)'], [2.4, '100*(1 - f/100)']], colore: 3 },
        { tipo: 'poligono', punti: [[2.4, '100*(1 - f/100)'], [3.6, '100*(1 - f/100)'], [3.6, 100], [2.4, 100]], colore: 3, riempi: false },
        { tipo: 'poligono', punti: [[4.4, 0], [5.6, 0], [5.6, '100*(1 - f/100)^2'], [4.4, '100*(1 - f/100)^2']], colore: 3 },
        { tipo: 'poligono', punti: [[4.4, '100*(1 - f/100)^2'], [5.6, '100*(1 - f/100)^2'], [5.6, 100], [4.4, 100]], colore: 3, riempi: false },
        { tipo: 'poligono', punti: [[6.4, 0], [7.6, 0], [7.6, '100*(1 - f/100)^3'], [6.4, '100*(1 - f/100)^3']], colore: 3 },
        { tipo: 'poligono', punti: [[6.4, '100*(1 - f/100)^3'], [7.6, '100*(1 - f/100)^3'], [7.6, 100], [6.4, 100]], colore: 3, riempi: false },
        { tipo: 'poligono', punti: [[8.4, 0], [9.6, 0], [9.6, '100*(1 - f/100)^4'], [8.4, '100*(1 - f/100)^4']], colore: 3 },
        { tipo: 'poligono', punti: [[8.4, '100*(1 - f/100)^4'], [9.6, '100*(1 - f/100)^4'], [9.6, 100], [8.4, 100]], colore: 3, riempi: false },
        { tipo: 'testo', p: [1, -8], testo: 'inizio' },
        { tipo: 'testo', p: [3, -8], testo: '1°' },
        { tipo: 'testo', p: [5, -8], testo: '2°' },
        { tipo: 'testo', p: [7, -8], testo: '3°' },
        { tipo: 'testo', p: [9, -8], testo: '4°' },
        { tipo: 'testo', p: [9.9, '50*(1 - f/100)^4'], testo: 'meccanica', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [9.9, '50 + 50*(1 - f/100)^4'], testo: 'interna', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [5, 109], testo: 'dopo 4: {{round(100*(1 - f/100)^4)}}% meccanica', colore: 3 }
      ],
      didascalia: 'L\'energia di un vagone con l\'attrito, in percentuale di quella di partenza, a ogni passaggio su un dosso. Parte piena è energia meccanica, parte vuota energia interna: il totale resta sempre 100%. Con il cursore a zero non c\'è attrito, e la meccanica si conserva.'
    },
    /* stesso lavoro, tempi diversi: la pendenza del lavoro nel tempo è la potenza */
    potenza: {
      tipo: 'orario', grandezza: 'L', unita: 'J', t: [0, 16], y: [0, 2400],
      funzioni: [
        { f: '392*t', dominio: [0, 5], colore: 3 },
        { f: '1960', dominio: [5, 16], colore: 3 },
        { f: '140*t', dominio: [0, 14], colore: 3, tratteggio: true },
        { f: '1960', dominio: [14, 16], colore: 3, tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [5.4, 2160], testo: 'di corsa', ancora: 'start' },
        { tipo: 'testo', p: [9, 760], testo: 'camminando', ancora: 'start' }
      ],
      didascalia: 'Il lavoro fatto contro il peso da due ragazze di 50 kg che salgono una scala alta 4 m: una di corsa (linea piena), l\'altra camminando (tratteggio). Alla fine il lavoro è lo stesso; la pendenza della linea, cioè quanti joule al secondo, è la potenza. Passa il dito sul grafico per leggere i valori.'
    },
    /* i 100 J del carbone lungo la catena del video, fino alla luce del LED (barre orizzontali: i nomi si leggono anche a 384 px) */
    catena: {
      tipo: 'piano', x: [-45.0, 120.0], y: [0.3, 6.7], altezza: 352, assi: false, griglia: false, proporzioni: 'libere',
      elementi: [
        { tipo: 'poligono', punti: [[0, 5.68], [100, 5.68], [100, 6.32], [0, 6.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 5.88], testo: 'carbone', ancora: 'end' },
        { tipo: 'testo', p: [103.0, 5.88], testo: '100 J', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 4.68], [90, 4.68], [90, 5.32], [0, 5.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 4.88], testo: 'vapore', ancora: 'end' },
        { tipo: 'testo', p: [93.0, 4.88], testo: '90 J', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 3.68], [36, 3.68], [36, 4.32], [0, 4.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 3.88], testo: 'turbina', ancora: 'end' },
        { tipo: 'testo', p: [39.0, 3.88], testo: '36 J', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 2.68], [35, 2.68], [35, 3.32], [0, 3.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 2.88], testo: 'elettrica', ancora: 'end' },
        { tipo: 'testo', p: [38.0, 2.88], testo: '35 J', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 1.68], [33, 1.68], [33, 2.32], [0, 2.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 1.88], testo: 'rete', ancora: 'end' },
        { tipo: 'testo', p: [36.0, 1.88], testo: '33 J', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 0.68], [13, 0.68], [13, 1.32], [0, 1.32]], colore: 3 },
        { tipo: 'testo', p: [-3.0, 0.88], testo: 'luce', ancora: 'end' },
        { tipo: 'testo', p: [16.0, 0.88], testo: '13 J', ancora: 'start', colore: 3 },
        { tipo: 'segmento', da: [0, 0.4], a: [0, 6.6], colore: 'grigio' }
      ],
      didascalia: 'Su 100 J di energia chimica del carbone, quanti ne restano utili dopo ogni passaggio: il vapore della caldaia, la turbina, l\'alternatore (energia elettrica), la rete, la luce del LED. Gli altri non spariscono: diventano energia interna di aria, fiume e fili.'
    },
    /* da dove viene l'energia primaria del mondo, in percentuale (i numeri del video) */
    fonti: {
      tipo: 'piano', x: [-14.4, 38.4], y: [0.3, 7.7], altezza: 404, assi: false, griglia: false, proporzioni: 'libere',
      elementi: [
        { tipo: 'poligono', punti: [[0, 6.68], [32, 6.68], [32, 7.32], [0, 7.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 6.88], testo: 'petrolio', ancora: 'end' },
        { tipo: 'testo', p: [32.96, 6.88], testo: '32%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 5.68], [26, 5.68], [26, 6.32], [0, 6.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 5.88], testo: 'carbone', ancora: 'end' },
        { tipo: 'testo', p: [26.96, 5.88], testo: '26%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 4.68], [23, 4.68], [23, 5.32], [0, 5.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 4.88], testo: 'gas naturale', ancora: 'end' },
        { tipo: 'testo', p: [23.96, 4.88], testo: '23%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 3.68], [4, 3.68], [4, 4.32], [0, 4.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 3.88], testo: 'nucleare', ancora: 'end' },
        { tipo: 'testo', p: [4.96, 3.88], testo: '4%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 2.68], [6, 2.68], [6, 3.32], [0, 3.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 2.88], testo: 'acqua', ancora: 'end' },
        { tipo: 'testo', p: [6.96, 2.88], testo: '6%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 1.68], [6, 1.68], [6, 2.32], [0, 2.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 1.88], testo: 'Sole e vento', ancora: 'end' },
        { tipo: 'testo', p: [6.96, 1.88], testo: '6%', ancora: 'start', colore: 3 },
        { tipo: 'poligono', punti: [[0, 0.68], [3, 0.68], [3, 1.32], [0, 1.32]], colore: 3 },
        { tipo: 'testo', p: [-0.96, 0.88], testo: 'altre', ancora: 'end' },
        { tipo: 'testo', p: [3.96, 0.88], testo: '3%', ancora: 'start', colore: 3 },
        { tipo: 'segmento', da: [0, 0.4], a: [0, 7.6], colore: 'grigio' }
      ],
      didascalia: 'Le fonti dell\'energia primaria usata nel mondo in un anno, in percentuale, con valori arrotondati. I tre combustibili fossili insieme fanno circa l\'81%. «Altre»: biomasse e calore della Terra.'
    }
  },
  esempi: [
    {
      titolo: 'Il lavoro delle forze su una slitta',
      problema: R`Una slitta viene tirata per 15 m su neve piana con una corda inclinata di 45°, con una forza di 80 N. L'attrito vale 40 N. Quanto lavoro fa ciascuna forza? Quanto vale il lavoro totale?`,
      passi: [
        R`Dati: $F = 80\,\text{N}$, $\alpha = 45°$, $s = 15\,\text{m}$, attrito $F_d = 40\,\text{N}$. Cerco il lavoro di ogni forza e il lavoro totale.`,
        R`La corda: $L_F = F \cdot s \cdot \cos 45° = 80 \cdot 15 \cdot 0{,}707\,\text{J} \approx 848{,}5\,\text{J}$. È positivo: la corda aiuta il moto.`,
        R`L'attrito va contro il moto, $\alpha = 180°$: $L_d = 40 \cdot 15 \cdot (-1)\,\text{J} = -600\,\text{J}$.`,
        R`Peso e forza normale sono verticali, perpendicolari allo spostamento: il loro lavoro è zero.`,
        R`Lavoro totale: $848{,}5\,\text{J} - 600\,\text{J} \approx 248{,}5\,\text{J}$.`,
        R`Controllo con la risultante orizzontale: $80 \cdot 0{,}707 - 40 \approx 16{,}57\,\text{N}$, e $16{,}57\,\text{N} \cdot 15\,\text{m} \approx 248{,}5\,\text{J}$. Torna.`
      ],
      risultato: R`Corda $\approx 848{,}5\,\text{J}$, attrito $-600\,\text{J}$, peso e normale $0$; totale $\approx 248{,}5\,\text{J}$.`
    },
    {
      titolo: 'Lo spazio di frenata con l\'energia',
      problema: R`Un'auto di 1200 kg viaggia a 90 km/h. Frena con una forza costante di 6000 N. Quanti metri percorre prima di fermarsi?`,
      passi: [
        R`Dati: $m = 1200\,\text{kg}$, $v_0 = 90\,\text{km/h}$, forza frenante $F = 6000\,\text{N}$, $v = 0$. Cerco lo spazio $s$.`,
        R`Prima le unità: $v_0 = \dfrac{90}{3{,}6}\,\text{m/s} = 25\,\text{m/s}$.`,
        R`Energia cinetica iniziale: $E_c = \tfrac{1}{2} \cdot 1200 \cdot 25^2\,\text{J} = 375\,000\,\text{J}$. Alla fine è zero.`,
        R`Teorema dell'energia cinetica: il lavoro della forza frenante è $-F \cdot s = 0 - 375\,000\,\text{J}$.`,
        R`Ricavo lo spazio: $s = \dfrac{375\,000\,\text{J}}{6000\,\text{N}} = 62{,}5\,\text{m}$.`,
        R`Controllo con la cinematica: $a = \dfrac{F}{m} = 5\,\text{m/s}^2$ e $s = \dfrac{v_0^2}{2 \cdot a} = \dfrac{625}{10}\,\text{m} = 62{,}5\,\text{m}$. Torna.`
      ],
      risultato: R`L'auto si ferma in $62{,}5\,\text{m}$.`
    },
    {
      titolo: 'Le montagne russe senza attrito',
      problema: R`Un carrello delle montagne russe parte da fermo da 22,5 m di altezza. Trascurando gli attriti, che velocità ha in fondo alla discesa, a quota zero? E sulla cima di un dosso alto 7,5 m?`,
      passi: [
        R`Dati: $v_0 = 0$, $h_0 = 22{,}5\,\text{m}$, quota del dosso $7{,}5\,\text{m}$. Cerco la velocità in fondo e sul dosso.`,
        R`Lavora solo il peso: l'energia meccanica si conserva. La massa si semplifica, quindi non serve conoscerla.`,
        R`In fondo tutta l'energia potenziale è diventata cinetica: $v = \sqrt{2 \cdot g \cdot h} = \sqrt{2 \cdot 9{,}8 \cdot 22{,}5}\,\text{m/s} = \sqrt{441}\,\text{m/s} = 21\,\text{m/s}$.`,
        R`Sul dosso il carrello è sceso solo di $22{,}5 - 7{,}5 = 15\,\text{m}$: $v = \sqrt{2 \cdot 9{,}8 \cdot 15}\,\text{m/s} = \sqrt{294}\,\text{m/s} \approx 17{,}1\,\text{m/s}$.`,
        R`Controllo, per ogni chilogrammo di massa: sul dosso $\tfrac{1}{2} \cdot 17{,}15^2 + 9{,}8 \cdot 7{,}5 \approx 147 + 73{,}5 = 220{,}5\,\text{J}$, come in partenza $9{,}8 \cdot 22{,}5 = 220{,}5\,\text{J}$. Torna.`
      ],
      risultato: R`In fondo $21\,\text{m/s}$; sul dosso circa $17{,}1\,\text{m/s}$.`
    },
    {
      titolo: 'Il lanciapalline a molla',
      problema: R`La molla di un lanciapalline, di costante $k = 800\,\text{N/m}$, è compressa di 6 cm. Lancia verso l'alto una pallina di 50 g. Con che velocità parte la pallina? Fino a che altezza sale sopra il punto in cui lascia la molla? Trascura l'aria, la massa della molla e i 6 cm di salita durante lo scatto.`,
      passi: [
        R`Dati: $k = 800\,\text{N/m}$, $x = 6\,\text{cm} = 0{,}06\,\text{m}$, $m = 50\,\text{g} = 0{,}05\,\text{kg}$. Cerco la velocità $v$ di lancio e l'altezza $h$.`,
        R`Energia elastica: $E_{\text{el}} = \tfrac{1}{2} \cdot 800 \cdot 0{,}06^2\,\text{J} = 400 \cdot 0{,}0036\,\text{J} = 1{,}44\,\text{J}$.`,
        R`Al lancio diventa tutta cinetica: $\tfrac{1}{2} \cdot m \cdot v^2 = 1{,}44\,\text{J}$, quindi $v = \sqrt{\dfrac{2 \cdot 1{,}44}{0{,}05}}\,\text{m/s} = \sqrt{57{,}6}\,\text{m/s} \approx 7{,}6\,\text{m/s}$.`,
        R`In cima diventa tutta potenziale: $m \cdot g \cdot h = 1{,}44\,\text{J}$, quindi $h = \dfrac{1{,}44}{0{,}05 \cdot 9{,}8}\,\text{m} \approx 2{,}94\,\text{m}$.`,
        R`Controllo con la velocità: $h = \dfrac{v^2}{2 \cdot g} = \dfrac{57{,}6}{19{,}6}\,\text{m} \approx 2{,}94\,\text{m}$. Torna.`
      ],
      risultato: R`Parte a circa $7{,}6\,\text{m/s}$ e sale di circa $2{,}94\,\text{m}$.`
    },
    {
      titolo: 'Lo slittino frenato dalla neve',
      problema: R`Uno slittino con il bambino sopra, 40 kg in tutto, parte da fermo e scende per un pendio lungo 30 m, con un dislivello di 6 m. In fondo va a 8 m/s. Quanta energia meccanica si è persa? Quanto vale, in media, la forza d'attrito?`,
      passi: [
        R`Dati: $m = 40\,\text{kg}$, $h = 6\,\text{m}$, lunghezza del pendio $30\,\text{m}$, $v = 8\,\text{m/s}$. Cerco l'energia persa e la forza d'attrito media $F_d$.`,
        R`Zero della quota in fondo. In cima: $E_m = m \cdot g \cdot h = 40 \cdot 9{,}8 \cdot 6\,\text{J} = 2352\,\text{J}$.`,
        R`In fondo: $E_m = \tfrac{1}{2} \cdot 40 \cdot 8^2\,\text{J} = 1280\,\text{J}$.`,
        R`Energia meccanica persa: $2352 - 1280 = 1072\,\text{J}$. È il lavoro dell'attrito cambiato di segno: è diventata energia interna.`,
        R`Il lavoro dell'attrito è $-F_d \cdot 30\,\text{m} = -1072\,\text{J}$, quindi $F_d = \dfrac{1072\,\text{J}}{30\,\text{m}} \approx 35{,}7\,\text{N}$.`,
        R`Controllo con le unità: joule diviso metri fa newton, una forza. E 36 N è meno di un decimo del peso, 392 N: ragionevole sulla neve.`
      ],
      risultato: R`Si perdono $1072\,\text{J}$; l'attrito medio vale circa $35{,}7\,\text{N}$.`
    },
    {
      titolo: 'La potenza di un ascensore',
      problema: R`Un ascensore con le persone a bordo ha massa 800 kg. Sale di 24 m in 32 s, a velocità costante. Che potenza sviluppa il motore? Se il rendimento è 0,8, quanta potenza elettrica assorbe? Quanti kWh consuma in 200 corse?`,
      passi: [
        R`Dati: $m = 800\,\text{kg}$, $h = 24\,\text{m}$, $\Delta t = 32\,\text{s}$, $\eta = 0{,}8$, 200 corse. Cerco la potenza utile, quella elettrica e l'energia in kWh.`,
        R`Lavoro contro il peso: $L = m \cdot g \cdot h = 800 \cdot 9{,}8 \cdot 24\,\text{J} = 188\,160\,\text{J}$.`,
        R`Potenza utile: $P = \dfrac{188\,160\,\text{J}}{32\,\text{s}} = 5880\,\text{W}$.`,
        R`Potenza elettrica: $P_{\text{el}} = \dfrac{P}{\eta} = \dfrac{5880}{0{,}8}\,\text{W} = 7350\,\text{W}$.`,
        R`Energia elettrica in 200 corse: $7350\,\text{W} \cdot 32\,\text{s} \cdot 200 = 47\,040\,000\,\text{J}$, e dividendo per $3{,}6 \cdot 10^6$ viene circa $13{,}1\,\text{kWh}$.`,
        R`Controllo con $P = F \cdot v$: la velocità è $\dfrac{24}{32} = 0{,}75\,\text{m/s}$, la forza è il peso $7840\,\text{N}$, e $7840 \cdot 0{,}75 = 5880\,\text{W}$. Torna. L'energia per 200 corse non dipende dal tempo di ogni corsa.`
      ],
      risultato: R`Potenza utile $\approx 5{,}9\,\text{kW}$, elettrica $7{,}35\,\text{kW}$; in 200 corse circa $13{,}1\,\text{kWh}$.`
    }
  ],
  formulario: [
    { nome: 'Lavoro di una forza costante', formula: R`L = F \cdot s \cdot \cos\alpha`, nota: R`In joule, $1\,\text{J} = 1\,\text{N} \cdot \text{m}$. $\alpha$ è l'angolo fra forza e spostamento.` },
    { nome: 'Lavoro come prodotto scalare', formula: R`L = \vec{F} \cdot \vec{s}`, nota: R`Positivo sotto 90°, zero a 90°, negativo fra 90° e 180°.` },
    { nome: 'Energia cinetica', formula: R`E_c = \tfrac{1}{2} \cdot m \cdot v^2`, nota: R`Mai negativa. A velocità doppia, quattro volte tanto.` },
    { nome: 'Teorema dell\'energia cinetica', formula: R`L = \Delta E_c = E_{c,f} - E_{c,i}`, nota: R`$L$ è il lavoro della forza risultante, cioè di tutte le forze insieme.` },
    { nome: 'Energia potenziale gravitazionale', formula: R`E_p = m \cdot g \cdot h`, nota: R`$h$ dal livello zero scelto; contano solo le differenze.` },
    { nome: 'Lavoro del peso', formula: R`L_P = -\Delta E_p = m \cdot g \cdot (h_i - h_f)`, nota: R`Dipende solo dal dislivello, non dalla strada: il peso è conservativo.` },
    { nome: 'Energia elastica', formula: R`E_{\text{el}} = \tfrac{1}{2} \cdot k \cdot x^2`, nota: R`$k$ in N/m, $x$ in metri. È l'area del triangolo sotto $F = k \cdot x$.` },
    { nome: 'Energia meccanica', formula: R`E_m = E_c + E_p`, nota: R`Nell'energia potenziale va anche quella elastica, se c'è una molla.` },
    { nome: 'Conservazione dell\'energia meccanica', formula: R`E_{c,i} + E_{p,i} = E_{c,f} + E_{p,f}`, nota: R`Vale se lavorano solo forze conservative (niente attrito).` },
    { nome: 'Velocità dopo una discesa da fermo', formula: R`v = \sqrt{2 \cdot g \cdot h}`, nota: R`Senza attrito; non dipende dalla massa né dalla forma della strada.` },
    { nome: 'Con l\'attrito', formula: R`\Delta E_m = L_{\text{attrito}}`, nota: R`Il lavoro dell'attrito è negativo: l'energia meccanica persa diventa energia interna.` },
    { nome: 'Potenza', formula: R`P = \dfrac{L}{\Delta t} \qquad P = F \cdot v`, nota: R`In watt, $1\,\text{W} = 1\,\text{J/s}$. La seconda a velocità costante, forza parallela al moto.` },
    { nome: 'Chilowattora', formula: R`1\,\text{kWh} = 3{,}6 \cdot 10^6\,\text{J}`, nota: R`È un'energia: 1000 W per un'ora.` },
    { nome: 'Rendimento', formula: R`\eta = \dfrac{E_{\text{utile}}}{E_{\text{spesa}}}`, nota: R`Sempre minore di 1. In una catena di macchine i rendimenti si moltiplicano.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'lavoro', tipo: 'definizione', fronte: R`Che cos'è il **lavoro** di una forza costante?`, retro: R`$L = F \cdot s \cdot \cos\alpha$: la componente della forza lungo lo spostamento per lo spostamento. In joule.` },
    { id: 'fc-02', sezione: 'lavoro', tipo: 'definizione', fronte: R`Che cos'è un **joule**?`, retro: R`Il lavoro di una forza di 1 N su uno spostamento di 1 m nella sua direzione: $1\,\text{J} = 1\,\text{N} \cdot \text{m}$.` },
    { id: 'fc-03', sezione: 'lavoro', tipo: 'concetto', fronte: R`Quando il lavoro di una forza è positivo, nullo, negativo?`, retro: R`Positivo con $\alpha < 90°$ (aiuta il moto), nullo a $90°$ o senza spostamento, negativo con $\alpha > 90°$ (ostacola il moto).` },
    { id: 'fc-04', sezione: 'lavoro', tipo: 'concetto', fronte: R`Spingi un muro che non si muove. Fai lavoro?`, retro: R`No: senza spostamento il lavoro è zero. La stanchezza viene dai muscoli, che consumano energia anche da fermi.` },
    { id: 'fc-05', sezione: 'cinetica', tipo: 'formula', fronte: R`Formula dell'**energia cinetica**`, retro: R`$E_c = \tfrac{1}{2} \cdot m \cdot v^2$, in joule con $m$ in kg e $v$ in m/s.` },
    { id: 'fc-06', sezione: 'cinetica', tipo: 'definizione', fronte: R`Il **teorema dell'energia cinetica**`, retro: R`Il lavoro della forza risultante è uguale alla variazione dell'energia cinetica: $L = \Delta E_c$.` },
    { id: 'fc-07', sezione: 'cinetica', tipo: 'concetto', fronte: R`A velocità doppia, quanto diventa l'energia cinetica? E lo spazio per fermarsi con la stessa forza?`, retro: R`Quattro volte tutti e due: $E_c$ va con $v^2$, e lo spazio di frenata è $E_c$ diviso la forza.` },
    { id: 'fc-08', sezione: 'potenziale', tipo: 'formula', fronte: R`Formula dell'**energia potenziale gravitazionale**`, retro: R`$E_p = m \cdot g \cdot h$, con $h$ misurata da un livello zero scelto.` },
    { id: 'fc-09', sezione: 'potenziale', tipo: 'concetto', fronte: R`Da che cosa dipende il lavoro del peso fra due punti?`, retro: R`Solo dal dislivello: $L_P = m \cdot g \cdot (h_i - h_f)$. Scala o rampa, il lavoro è lo stesso.` },
    { id: 'fc-10', sezione: 'potenziale', tipo: 'definizione', fronte: R`Quando una forza si dice **conservativa**?`, retro: R`Quando il suo lavoro dipende solo dai punti di partenza e di arrivo, non dalla strada; su un giro chiuso è zero. Esempi: peso, forza elastica.` },
    { id: 'fc-11', sezione: 'potenziale', tipo: 'concetto', fronte: R`Si può scegliere dove mettere lo zero dell'energia potenziale?`, retro: R`Sì: cambia il valore di $E_p$, ma non le sue differenze, che sono le sole che contano.` },
    { id: 'fc-12', sezione: 'elastica', tipo: 'formula', fronte: R`Formula dell'**energia elastica** di una molla`, retro: R`$E_{\text{el}} = \tfrac{1}{2} \cdot k \cdot x^2$, con $k$ in N/m e la deformazione $x$ in metri.` },
    { id: 'fc-13', sezione: 'elastica', tipo: 'concetto', fronte: R`Perché nell'energia elastica c'è il fattore $\tfrac{1}{2}$?`, retro: R`Perché la forza cresce da zero a $k \cdot x$: il lavoro è l'area del triangolo sotto la retta, base per altezza diviso due.` },
    { id: 'fc-14', sezione: 'conservazione', tipo: 'definizione', fronte: R`Che cosa dice la **conservazione dell'energia meccanica**?`, retro: R`Se lavorano solo forze conservative, $E_c + E_p$ resta costante: l'energia passa da una forma all'altra.` },
    { id: 'fc-15', sezione: 'conservazione', tipo: 'formula', fronte: R`Velocità in fondo a una discesa senza attrito, partendo da fermi da un'altezza $h$`, retro: R`$v = \sqrt{2 \cdot g \cdot h}$: non dipende dalla massa né dalla forma della strada.` },
    { id: 'fc-16', sezione: 'attrito', tipo: 'formula', fronte: R`Come cambia l'energia meccanica con l'attrito?`, retro: R`Cala del lavoro dell'attrito: $\Delta E_m = L_{\text{attrito}}$, che è negativo.` },
    { id: 'fc-17', sezione: 'attrito', tipo: 'concetto', fronte: R`Dove va l'energia meccanica persa per attrito?`, retro: R`Diventa energia interna: i corpi e l'aria si scaldano un poco. L'energia totale si conserva.` },
    { id: 'fc-18', sezione: 'potenza', tipo: 'definizione', fronte: R`Che cos'è la **potenza**?`, retro: R`Il lavoro diviso il tempo impiegato, $P = \dfrac{L}{\Delta t}$. Si misura in watt: $1\,\text{W} = 1\,\text{J/s}$.` },
    { id: 'fc-19', sezione: 'potenza', tipo: 'formula', fronte: R`Potenza di una forza che spinge un corpo a velocità costante`, retro: R`$P = F \cdot v$, con la forza nella direzione della velocità.` },
    { id: 'fc-20', sezione: 'potenza', tipo: 'concetto', fronte: R`Il **chilowattora** è una potenza o un'energia?`, retro: R`Un'energia: 1000 W per un'ora, $3{,}6 \cdot 10^6\,\text{J}$. In bolletta si paga l'energia.` },
    { id: 'fc-21', sezione: 'forme', tipo: 'concetto', fronte: R`Le principali **forme** di energia`, retro: R`Cinetica, potenziale (del peso, elastica), interna, chimica, elettrica, nucleare. Tutte si misurano in joule.` },
    { id: 'fc-22', sezione: 'forme', tipo: 'definizione', fronte: R`Il **principio di conservazione dell'energia**`, retro: R`L'energia totale non si crea e non si distrugge: passa da una forma all'altra.` },
    { id: 'fc-23', sezione: 'rendimento', tipo: 'formula', fronte: R`Che cos'è il **rendimento** di una macchina?`, retro: R`$\eta = \dfrac{E_{\text{utile}}}{E_{\text{spesa}}}$, sempre minore di 1. In una catena di macchine si moltiplicano.` },
    { id: 'fc-24', sezione: 'rendimento', tipo: 'concetto', fronte: R`Che differenza c'è fra fonti **rinnovabili** e **non rinnovabili**?`, retro: R`Le non rinnovabili (petrolio, carbone, gas, uranio) si consumano più in fretta di quanto si rifacciano. Le rinnovabili (Sole, vento, acqua, biomasse) si rinnovano da sole.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Spingi un carrello con una forza di 32 N, parallela al pavimento, per 10 m. Quanto lavoro fa la tua forza?`, suggerimenti: [R`Forza e spostamento hanno la stessa direzione: $L = F \cdot s$.`], risposta: { tipo: 'numero', valore: 320, unita: 'J' }, soluzione: [R`$L = 32\,\text{N} \cdot 10\,\text{m} = 320\,\text{J}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Tiri un carrello per 6 m con una corda inclinata di 60° rispetto al pavimento, con una forza di 35 N. Quanto lavoro fa la corda?`, suggerimenti: [R`$L = F \cdot s \cdot \cos\alpha$, e $\cos 60° = 0{,}5$.`], risposta: { tipo: 'numero', valore: 105, unita: 'J' }, soluzione: [R`$L = 35\,\text{N} \cdot 6\,\text{m} \cdot 0{,}5 = 105\,\text{J}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Su una cassa che scivola per 8 m agisce un attrito di 15 N. Quanto vale il lavoro dell'attrito?`, suggerimenti: [R`L'attrito va contro il moto: $\alpha = 180°$, $\cos 180° = -1$.`], risposta: { tipo: 'numero', valore: -120, unita: 'J' }, soluzione: [R`$L = 15\,\text{N} \cdot 8\,\text{m} \cdot (-1) = -120\,\text{J}$: il lavoro è negativo.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una cassa scivola per 5 m su un pavimento orizzontale. Il pavimento la regge con una forza normale di 200 N. Quanto lavoro fa la forza normale?`, suggerimenti: [R`Che angolo c'è fra la forza normale e lo spostamento?`], risposta: { tipo: 'numero', valore: 0, unita: 'J' }, soluzione: [R`La forza normale è verticale, lo spostamento orizzontale: $\alpha = 90°$, $\cos 90° = 0$, quindi $L = 0\,\text{J}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una palla di 3 kg rotola a 4 m/s. Quanto vale la sua energia cinetica?`, suggerimenti: [R`$E_c = \tfrac{1}{2} \cdot m \cdot v^2$: prima il quadrato della velocità.`], risposta: { tipo: 'numero', valore: 24, unita: 'J' }, soluzione: [R`$E_c = \tfrac{1}{2} \cdot 3\,\text{kg} \cdot (4\,\text{m/s})^2 = 1{,}5 \cdot 16\,\text{J} = 24\,\text{J}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un ciclista con la sua bici ha una massa di 90 kg e va a 4 m/s. Quanto vale la sua energia cinetica?`, suggerimenti: [R`$E_c = \tfrac{1}{2} \cdot m \cdot v^2$.`], risposta: { tipo: 'numero', valore: 720, unita: 'J' }, soluzione: [R`$E_c = \tfrac{1}{2} \cdot 90 \cdot 4^2\,\text{J} = 45 \cdot 16\,\text{J} = 720\,\text{J}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`Un corpo di 2 kg ha un'energia cinetica di 100 J. A che velocità si muove?`, suggerimenti: [R`Da $E_c = \tfrac{1}{2} \cdot m \cdot v^2$ ricava $v^2 = \dfrac{2 \cdot E_c}{m}$.`], risposta: { tipo: 'numero', valore: 10, unita: 'm/s' }, soluzione: [R`$v^2 = \dfrac{2 \cdot 100}{2} = 100\,\text{m}^2/\text{s}^2$, quindi $v = 10\,\text{m/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un carrello di 5 kg, fermo su una rotaia senza attrito, riceve dalla forza risultante un lavoro di 90 J. Che velocità raggiunge?`, suggerimenti: [R`Teorema dell'energia cinetica: tutto il lavoro diventa energia cinetica.`, R`$\tfrac{1}{2} \cdot 5 \cdot v^2 = 90$.`], risposta: { tipo: 'numero', valore: 6, unita: 'm/s' }, soluzione: [R`$\tfrac{1}{2} \cdot 5 \cdot v^2 = 90\,\text{J}$, quindi $v^2 = 36$ e $v = 6\,\text{m/s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un vaso di 7 kg sta su un balcone a 4 m dal suolo. Quanto vale la sua energia potenziale, con lo zero al suolo?`, suggerimenti: [R`$E_p = m \cdot g \cdot h$, con $g = 9{,}8\,\text{m/s}^2$.`], risposta: { tipo: 'numero', valore: 274.4, unita: 'J' }, soluzione: [R`$E_p = 7 \cdot 9{,}8 \cdot 4\,\text{J} = 274{,}4\,\text{J}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un corpo di 3 kg ha un'energia potenziale di 147 J rispetto al pavimento. A che altezza si trova?`, suggerimenti: [R`$h = \dfrac{E_p}{m \cdot g}$.`], risposta: { tipo: 'numero', valore: 5, unita: 'm' }, soluzione: [R`$h = \dfrac{147\,\text{J}}{3\,\text{kg} \cdot 9{,}8\,\text{m/s}^2} = \dfrac{147}{29{,}4}\,\text{m} = 5\,\text{m}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Una mela di 0,5 kg cade da un ramo alto 6 m. Quanto lavoro fa il peso durante la caduta?`, suggerimenti: [R`Il peso è parallelo allo spostamento: $L = m \cdot g \cdot h$, positivo.`], risposta: { tipo: 'numero', valore: 29.4, unita: 'J' }, soluzione: [R`$L = 0{,}5 \cdot 9{,}8 \cdot 6\,\text{J} = 29{,}4\,\text{J}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Una molla di costante $600\,\text{N/m}$ è compressa di 10 cm. Quanta energia elastica contiene?`, suggerimenti: [R`Prima i centimetri in metri.`, R`$E_{\text{el}} = \tfrac{1}{2} \cdot k \cdot x^2$.`], risposta: { tipo: 'numero', valore: 3, unita: 'J' }, soluzione: [R`$x = 0{,}1\,\text{m}$, quindi $E_{\text{el}} = \tfrac{1}{2} \cdot 600 \cdot 0{,}01\,\text{J} = 3\,\text{J}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un elastico che si comporta come una molla di costante $250\,\text{N/m}$ viene allungato di 20 cm. Quanta energia elastica contiene?`, suggerimenti: [R`$x = 0{,}2\,\text{m}$; poi $\tfrac{1}{2} \cdot k \cdot x^2$.`], risposta: { tipo: 'numero', valore: 5, unita: 'J' }, soluzione: [R`$E_{\text{el}} = \tfrac{1}{2} \cdot 250 \cdot 0{,}2^2\,\text{J} = 125 \cdot 0{,}04\,\text{J} = 5\,\text{J}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un sasso cade da fermo da 10 m di altezza. Trascurando l'aria, con che velocità arriva a terra?`, suggerimenti: [R`L'energia meccanica si conserva: $v = \sqrt{2 \cdot g \cdot h}$.`], risposta: { tipo: 'numero', valore: 14, unita: 'm/s' }, soluzione: [R`$v = \sqrt{2 \cdot 9{,}8 \cdot 10}\,\text{m/s} = \sqrt{196}\,\text{m/s} = 14\,\text{m/s}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Una palla viene lanciata verso l'alto a 9,8 m/s. Trascurando l'aria, di quanti metri sale?`, suggerimenti: [R`In cima la palla è ferma: tutta l'energia cinetica è diventata potenziale.`, R`$h = \dfrac{v^2}{2 \cdot g}$.`], risposta: { tipo: 'numero', valore: 4.9, unita: 'm' }, soluzione: [R`$h = \dfrac{9{,}8^2}{2 \cdot 9{,}8}\,\text{m} = \dfrac{9{,}8}{2}\,\text{m} = 4{,}9\,\text{m}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Uno skateboarder arriva in fondo a una rampa a 4,2 m/s e risale dall'altra parte. Senza attrito, fino a che altezza risale?`, suggerimenti: [R`$\tfrac{1}{2} \cdot m \cdot v^2 = m \cdot g \cdot h$: la massa si semplifica.`], risposta: { tipo: 'numero', valore: 0.9, unita: 'm' }, soluzione: [R`$h = \dfrac{v^2}{2 \cdot g} = \dfrac{17{,}64}{19{,}6}\,\text{m} = 0{,}9\,\text{m}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un motore fa un lavoro di 7200 J in 30 s. Che potenza sviluppa?`, suggerimenti: [R`$P = \dfrac{L}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 240, unita: 'W' }, soluzione: [R`$P = \dfrac{7200\,\text{J}}{30\,\text{s}} = 240\,\text{W}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Un ragazzo di 70 kg sale di corsa una scala alta 5 m in 7 s. Che potenza sviluppa contro il peso?`, suggerimenti: [R`Il lavoro contro il peso è $m \cdot g \cdot h$.`, R`Poi dividi per il tempo.`], risposta: { tipo: 'numero', valore: 490, unita: 'W' }, soluzione: [R`$L = 70 \cdot 9{,}8 \cdot 5\,\text{J} = 3430\,\text{J}$.`, R`$P = \dfrac{3430\,\text{J}}{7\,\text{s}} = 490\,\text{W}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Una stufetta elettrica da 1500 W resta accesa per 4 ore. Quanti kWh consuma?`, suggerimenti: [R`Energia = potenza per tempo: chilowatt per ore fa chilowattora.`], risposta: { tipo: 'numero', valore: 6, unita: 'kWh' }, soluzione: [R`$1500\,\text{W} = 1{,}5\,\text{kW}$, quindi $E = 1{,}5\,\text{kW} \cdot 4\,\text{h} = 6\,\text{kWh}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Uno slittino di 10 kg parte da fermo da 5 m di altezza e arriva in fondo alla pista a 6 m/s. Quanta energia meccanica ha preso l'attrito?`, suggerimenti: [R`Calcola l'energia potenziale in cima e quella cinetica in fondo.`, R`La differenza è l'energia diventata interna.`], risposta: { tipo: 'numero', valore: 310, unita: 'J' }, soluzione: [R`In cima: $10 \cdot 9{,}8 \cdot 5 = 490\,\text{J}$. In fondo: $\tfrac{1}{2} \cdot 10 \cdot 6^2 = 180\,\text{J}$.`, R`Energia meccanica persa: $490 - 180 = 310\,\text{J}$, diventati energia interna.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una cassa di 20 kg, ferma su un pavimento orizzontale, viene spinta per 5 m con una forza orizzontale di 100 N. Il coefficiente di attrito dinamico è 0,3. Che velocità ha la cassa alla fine?`, suggerimenti: [R`Attrito: $F_d = \mu_d \cdot m \cdot g$.`, R`Lavoro totale = (spinta − attrito) per lo spostamento; poi il teorema dell'energia cinetica.`], risposta: { tipo: 'numero', valore: 4.54, unita: 'm/s' }, soluzione: [R`$F_d = 0{,}3 \cdot 20 \cdot 9{,}8\,\text{N} = 58{,}8\,\text{N}$.`, R`Lavoro totale: $(100 - 58{,}8) \cdot 5\,\text{J} = 206\,\text{J}$.`, R`$\tfrac{1}{2} \cdot 20 \cdot v^2 = 206\,\text{J}$, quindi $v = \sqrt{20{,}6}\,\text{m/s} \approx 4{,}54\,\text{m/s}$.`] },
    { id: 'es-02', difficolta: 3, testo: R`Un'auto di 900 kg che viaggia a 72 km/h frena e si ferma in 25 m. Con la stessa forza frenante, in quanti metri si fermerebbe partendo da 108 km/h?`, suggerimenti: [R`Calcola la forza frenante con il teorema dell'energia cinetica: $F \cdot s = E_c$.`, R`Oppure ragiona sul quadrato: la velocità passa da 20 m/s a 30 m/s, cioè diventa 1,5 volte.`], risposta: { tipo: 'numero', valore: 56.25, unita: 'm' }, soluzione: [R`$v_1 = \dfrac{72}{3{,}6}\,\text{m/s} = 20\,\text{m/s}$: $E_c = \tfrac{1}{2} \cdot 900 \cdot 400\,\text{J} = 180\,000\,\text{J}$, quindi $F = \dfrac{180\,000\,\text{J}}{25\,\text{m}} = 7200\,\text{N}$.`, R`$v_2 = \dfrac{108}{3{,}6}\,\text{m/s} = 30\,\text{m/s}$: $E_c = \tfrac{1}{2} \cdot 900 \cdot 900\,\text{J} = 405\,000\,\text{J}$.`, R`$s = \dfrac{405\,000\,\text{J}}{7200\,\text{N}} = 56{,}25\,\text{m}$. Controllo: $1{,}5^2 \cdot 25\,\text{m} = 56{,}25\,\text{m}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un'auto passa da 90 km/h a 108 km/h. Di quanto per cento aumenta la sua energia cinetica?`, suggerimenti: [R`Non serve la massa: guarda il rapporto delle velocità.`, R`$\dfrac{108}{90} = 1{,}2$, e l'energia va con il quadrato.`], risposta: { tipo: 'numero', valore: 44, unita: '%' }, soluzione: [R`Il rapporto delle energie è il quadrato del rapporto delle velocità: $\left(\dfrac{108}{90}\right)^2 = 1{,}2^2 = 1{,}44$.`, R`L'energia cinetica aumenta del 44%, anche se la velocità cresce solo del 20%.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un pendolo ha il filo lungo 2 m. Lo si sposta finché il filo forma un angolo di 60° con la verticale, e lo si lascia andare. Trascurando l'aria, con che velocità passa nel punto più basso?`, suggerimenti: [R`Disegna il pendolo: la pallina si alza di $h = l - l \cdot \cos 60°$.`, R`Il filo è sempre perpendicolare al moto e non lavora: l'energia meccanica si conserva.`], risposta: { tipo: 'numero', valore: 4.43, unita: 'm/s' }, soluzione: [R`$h = 2\,\text{m} - 2\,\text{m} \cdot 0{,}5 = 1\,\text{m}$.`, R`$v = \sqrt{2 \cdot 9{,}8 \cdot 1}\,\text{m/s} = \sqrt{19{,}6}\,\text{m/s} \approx 4{,}43\,\text{m/s}$.`] },
    { id: 'es-05', difficolta: 2, testo: R`Una molla orizzontale di costante $900\,\text{N/m}$ è compressa di 4 cm contro un carrello di 250 g. Lasciata libera, a che velocità lancia il carrello? Niente attrito.`, suggerimenti: [R`L'energia elastica diventa tutta cinetica.`, R`Unità: metri e chilogrammi.`], risposta: { tipo: 'numero', valore: 2.4, unita: 'm/s' }, soluzione: [R`$E_{\text{el}} = \tfrac{1}{2} \cdot 900 \cdot 0{,}04^2\,\text{J} = 0{,}72\,\text{J}$.`, R`$\tfrac{1}{2} \cdot 0{,}25 \cdot v^2 = 0{,}72$, quindi $v^2 = 5{,}76$ e $v = 2{,}4\,\text{m/s}$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un blocco di 2 kg scivola senza attrito a 3 m/s e urta una molla di costante $1250\,\text{N/m}$. Di quanti centimetri si comprime al massimo la molla?`, suggerimenti: [R`Alla massima compressione il blocco è fermo: tutta l'energia cinetica è diventata elastica.`, R`$\tfrac{1}{2} \cdot m \cdot v^2 = \tfrac{1}{2} \cdot k \cdot x^2$.`], risposta: { tipo: 'numero', valore: 12, unita: 'cm' }, soluzione: [R`$E_c = \tfrac{1}{2} \cdot 2 \cdot 9\,\text{J} = 9\,\text{J}$.`, R`$\tfrac{1}{2} \cdot 1250 \cdot x^2 = 9$, quindi $x^2 = 0{,}0144\,\text{m}^2$ e $x = 0{,}12\,\text{m} = 12\,\text{cm}$.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una slitta di 60 kg parte da ferma in cima a un pendio rettilineo lungo 50 m, con un dislivello di 10 m. In fondo va a 12 m/s. Quanto vale il coefficiente di attrito dinamico fra slitta e neve?`, suggerimenti: [R`Dall'energia persa ricava la forza d'attrito media: energia persa diviso la lunghezza del pendio.`, R`Sul pendio la forza normale è $m \cdot g \cdot \cos\theta$, con $\sin\theta = \dfrac{10}{50} = 0{,}2$.`, R`$\mu_d = \dfrac{F_d}{N}$.`], risposta: { tipo: 'numero', valore: 0.054, tolleranza: 0.002 }, soluzione: [R`In cima: $60 \cdot 9{,}8 \cdot 10 = 5880\,\text{J}$. In fondo: $\tfrac{1}{2} \cdot 60 \cdot 144 = 4320\,\text{J}$. Persi $1560\,\text{J}$.`, R`$F_d = \dfrac{1560\,\text{J}}{50\,\text{m}} = 31{,}2\,\text{N}$.`, R`$\cos\theta = \sqrt{1 - 0{,}2^2} \approx 0{,}980$, quindi $N = 60 \cdot 9{,}8 \cdot 0{,}980\,\text{N} \approx 576\,\text{N}$.`, R`$\mu_d = \dfrac{31{,}2}{576} \approx 0{,}054$: una slitta che scivola bene.`] },
    { id: 'es-08', difficolta: 2, testo: R`Un'auto viaggia in autostrada a 30 m/s costanti. L'aria e il rotolamento la frenano con una forza totale di 600 N. Che potenza deve dare il motore alle ruote?`, suggerimenti: [R`A velocità costante la spinta è uguale alle forze resistenti.`, R`$P = F \cdot v$.`], risposta: { tipo: 'numero', valore: 18, unita: 'kW' }, soluzione: [R`La spinta vale 600 N, come le forze resistenti.`, R`$P = 600\,\text{N} \cdot 30\,\text{m/s} = 18\,000\,\text{W} = 18\,\text{kW}$.`] },
    { id: 'es-09', difficolta: 3, testo: R`In una centrale idroelettrica cadono 3000 kg d'acqua al secondo da un'altezza di 50 m. L'impianto ha un rendimento dell'85%. Quanti megawatt di potenza elettrica produce?`, suggerimenti: [R`Ogni secondo l'acqua perde l'energia potenziale $m \cdot g \cdot h$: è la potenza in ingresso.`, R`Moltiplica per il rendimento.`], risposta: { tipo: 'numero', valore: 1.25, unita: 'MW' }, soluzione: [R`Potenza in ingresso: $3000 \cdot 9{,}8 \cdot 50\,\text{W} = 1\,470\,000\,\text{W}$.`, R`Potenza elettrica: $0{,}85 \cdot 1\,470\,000\,\text{W} \approx 1\,250\,000\,\text{W} = 1{,}25\,\text{MW}$.`] },
    { id: 'es-10', difficolta: 2, testo: R`Un bollitore da 2200 W scalda l'acqua per un tè in 3 minuti. Quanti kWh consuma?`, suggerimenti: [R`Calcola l'energia in joule, poi dividi per $3{,}6 \cdot 10^6$.`, R`Oppure: $2{,}2\,\text{kW}$ per $\tfrac{3}{60}\,\text{h}$.`], risposta: { tipo: 'numero', valore: 0.11, unita: 'kWh' }, soluzione: [R`$E = 2200\,\text{W} \cdot 180\,\text{s} = 396\,000\,\text{J}$.`, R`$E = \dfrac{396\,000}{3{,}6 \cdot 10^6}\,\text{kWh} = 0{,}11\,\text{kWh}$. Controllo: $2{,}2\,\text{kW} \cdot 0{,}05\,\text{h} = 0{,}11\,\text{kWh}$.`] },
    { id: 'es-11', difficolta: 2, testo: R`Una centrale ha un rendimento del 35%, la rete elettrica del 92%, una lampadina LED del 45%. Che percentuale dell'energia del combustibile diventa luce?`, suggerimenti: [R`In una catena i rendimenti si moltiplicano.`], risposta: { tipo: 'numero', valore: 14.5, unita: '%' }, soluzione: [R`$\eta = 0{,}35 \cdot 0{,}92 \cdot 0{,}45 \approx 0{,}145$.`, R`Circa il 14,5%: il resto diventa energia interna lungo la strada.`] },
    { id: 'es-12', difficolta: 2, testo: R`Guarda il grafico del lavoro delle due ragazze sulla scala. Che potenza sviluppa la ragazza che sale di corsa?

[[grafico:potenza]]`, suggerimenti: [R`Leggi sul grafico il lavoro finale e il tempo in cui la linea piena smette di salire.`, R`$P = \dfrac{L}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 392, unita: 'W' }, soluzione: [R`Il lavoro finale è $50 \cdot 9{,}8 \cdot 4 = 1960\,\text{J}$, raggiunto in 5 s.`, R`$P = \dfrac{1960\,\text{J}}{5\,\text{s}} = 392\,\text{W}$. È la pendenza della linea piena.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Quando una forza **non** fa lavoro?`, opzioni: [R`Quando il corpo non si sposta, o la forza è perpendicolare allo spostamento`, R`Quando la forza è piccola`, R`Quando il corpo si muove a velocità costante`, R`Quando la forza è opposta al moto`], corretta: 0, spiegazione: R`$L = F \cdot s \cdot \cos\alpha$ è zero se $s = 0$ o se $\alpha = 90°$. Una forza opposta al moto lavora, con il segno meno; a velocità costante le forze lavorano, ma i loro lavori si compensano.` },
    { id: 'q-02', domanda: R`Qual è l'unità di misura del lavoro nel SI?`, opzioni: [R`Il watt`, R`Il newton`, R`Il joule`, R`Il newton al secondo`], corretta: 2, spiegazione: R`Il lavoro è forza per spostamento: $1\,\text{N} \cdot 1\,\text{m} = 1\,\text{J}$. Il watt è l'unità della potenza, il newton quella della forza.` },
    { id: 'q-03', domanda: R`Una cassa scivola sul pavimento. Il lavoro dell'attrito sulla cassa è…`, opzioni: [R`positivo`, R`zero`, R`negativo`, R`positivo o negativo, secondo il verso dell'asse scelto`], corretta: 2, spiegazione: R`La cassa striscia sul pavimento: l'attrito dinamico va contro lo spostamento, $\alpha = 180°$ e il lavoro è negativo. Il segno del lavoro non dipende dagli assi, perché dipende solo dall'angolo fra forza e spostamento.` },
    { id: 'q-04', domanda: R`Se la velocità di un corpo raddoppia, la sua energia cinetica…`, opzioni: [R`raddoppia`, R`diventa quattro volte tanto`, R`si dimezza`, R`resta uguale`], corretta: 1, spiegazione: R`$E_c = \tfrac{1}{2} \cdot m \cdot v^2$ dipende dal quadrato della velocità: $2^2 = 4$. Raddoppia solo se raddoppia la massa.` },
    { id: 'q-05', domanda: R`Che cosa dice il teorema dell'energia cinetica?`, opzioni: [R`Che l'energia cinetica di un corpo è sempre costante`, R`Che il lavoro di ogni forza è uguale all'energia cinetica finale`, R`Che la forza è uguale all'energia cinetica diviso il tempo`, R`Che il lavoro della forza risultante è uguale alla variazione dell'energia cinetica`], corretta: 3, spiegazione: R`$L = \Delta E_c$, dove $L$ è il lavoro di tutte le forze insieme. Non vale forza per forza, e non riguarda l'energia finale ma la sua variazione.` },
    { id: 'q-06', domanda: R`Quando una forza si dice conservativa?`, opzioni: [R`Quando il suo lavoro è sempre positivo`, R`Quando il suo lavoro dipende solo dai punti di partenza e di arrivo`, R`Quando non fa mai lavoro`, R`Quando mantiene costante la velocità del corpo`], corretta: 1, spiegazione: R`Il lavoro di una forza conservativa non dipende dalla strada, ed è zero su un giro chiuso. Il peso lavora, eppure è conservativo. Il lavoro di una forza conservativa può essere positivo o negativo: in salita il peso lavora contro il moto.` },
    { id: 'q-07', domanda: R`Quale di queste forze **non** è conservativa?`, opzioni: [R`Il peso`, R`La forza elastica di una molla`, R`L'attrazione gravitazionale fra due pianeti`, R`L'attrito dinamico`], corretta: 3, spiegazione: R`L'attrito dinamico va sempre contro lo strisciamento: su un giro chiuso il suo lavoro è negativo, non zero. Le altre tre sono conservative.` },
    { id: 'q-08', domanda: R`Due palline, una di 1 kg e una di 3 kg, scendono senza attrito lungo lo stesso scivolo, partendo da ferme. Che velocità hanno in fondo?`, opzioni: [R`Più alta quella da 3 kg`, R`La stessa`, R`Più alta quella da 1 kg`, R`Dipende dalla forma dello scivolo`], corretta: 1, spiegazione: R`$v = \sqrt{2 \cdot g \cdot h}$: la massa si semplifica e la forma della strada non conta. La pallina da 3 kg ha più energia, ma anche più massa da muovere.` },
    { id: 'q-09', domanda: R`Dove va messo lo zero dell'energia potenziale del peso?`, opzioni: [R`Dove si vuole: contano solo le differenze`, R`Sempre al livello del mare`, R`Sempre al centro della Terra`, R`Sempre sul pavimento`], corretta: 0, spiegazione: R`Cambiando lo zero cambiano tutti i valori di $E_p$ della stessa quantità: le differenze, e quindi i lavori e le velocità, restano uguali.` },
    { id: 'q-10', domanda: R`Il chilowattora (kWh) è l'unità di misura di…`, opzioni: [R`un'energia`, R`una potenza`, R`una corrente elettrica`, R`un tempo`], corretta: 0, spiegazione: R`È una potenza per un tempo: $1000\,\text{W} \cdot 3600\,\text{s} = 3{,}6 \cdot 10^6\,\text{J}$. Il nome contiene «watt», ma non è una potenza.` },
    { id: 'q-11', domanda: R`Se la compressione di una molla triplica, la sua energia elastica…`, opzioni: [R`triplica`, R`diventa sei volte tanto`, R`diventa nove volte tanto`, R`resta uguale`], corretta: 2, spiegazione: R`$E_{\text{el}} = \tfrac{1}{2} \cdot k \cdot x^2$: compressione tripla, energia $3^2 = 9$ volte. Sei volte sarebbe il doppio del triplo, un errore frequente.` },
    { id: 'q-12', domanda: R`Un pendolo lasciato oscillare nell'aria a poco a poco si ferma. Che fine fa la sua energia meccanica?`, opzioni: [R`Viene distrutta dall'attrito`, R`Si trasforma tutta in energia potenziale`, R`Si conserva: il pendolo si ferma per colpa del peso`, R`Diventa energia interna dell'aria e del perno`], corretta: 3, spiegazione: R`L'energia non si distrugge: l'attrito dell'aria e del perno la trasforma in energia interna, che scalda un poco aria e perno.` },
    { id: 'q-13', domanda: R`Una lampada riceve 100 J di energia elettrica e ne emette 30 J come luce. Qual è il suo rendimento?`, opzioni: [R`30%`, R`70%`, R`130%`, R`3,3`], corretta: 0, spiegazione: R`$\eta = \dfrac{30\,\text{J}}{100\,\text{J}} = 0{,}3$, cioè il 30%. Il 70% è la parte che diventa energia interna; un rendimento non supera mai 1.` },
    { id: 'q-14', domanda: R`Quale di queste è una fonte di energia rinnovabile?`, opzioni: [R`Il carbone`, R`Il gas naturale`, R`L'uranio`, R`Il vento`], corretta: 3, spiegazione: R`Il vento si rinnova di continuo, perché lo muove il Sole. Carbone, gas e uranio si consumano molto più in fretta di quanto si formino.` },
    { id: 'q-15', domanda: R`Due motori alzano lo stesso carico alla stessa altezza; il motore A ci mette metà del tempo del motore B. Che cosa si può dire?`, opzioni: [R`A fa più lavoro di B`, R`B ha potenza doppia di A`, R`A ha potenza doppia di B`, R`Hanno la stessa potenza`], corretta: 2, spiegazione: R`Il lavoro è lo stesso, $m \cdot g \cdot h$. La potenza è il lavoro diviso il tempo: a metà tempo, potenza doppia.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`L'angolo $\alpha$ del lavoro è quello fra la forza e lo spostamento. Se la forza va contro il moto, $\alpha = 180°$ e il lavoro è negativo.` },
    { tipo: 'errore', testo: R`Nell'energia cinetica va al quadrato solo la velocità: $\tfrac{1}{2} \cdot m \cdot v^2$. Fai prima $v^2$, poi moltiplica.` },
    { tipo: 'errore', testo: R`L'energia della molla non è $k \cdot x$ per $x$: ci vuole il mezzo, $\tfrac{1}{2} \cdot k \cdot x^2$. E $x$ va in metri, non in centimetri.` },
    { tipo: 'trucco', testo: R`Per la velocità in fondo a una discesa senza attrito non serve la massa: $v = \sqrt{2 \cdot g \cdot h}$.` },
    { tipo: 'metodo', testo: R`Nei problemi di energia scrivi l'energia all'inizio e alla fine. Se c'è attrito, la differenza è il suo lavoro.` },
    { tipo: 'metodo', testo: R`Prima di tutto scegli lo zero dell'altezza. Va bene qualunque, purché resti lo stesso per tutto il problema.` },
    { tipo: 'trucco', testo: R`$1\,\text{kWh} = 3{,}6 \cdot 10^6\,\text{J}$: dai kWh ai joule si moltiplica per 3,6 milioni.` },
    { tipo: 'trucco', testo: R`Se il problema non chiede il tempo, prova con l'energia: spesso evita tutta la cinematica.` }
  ],
  aneddoti: [
    { fisico: 'Gaspard-Gustave Coriolis', anni: '1792–1843', titolo: 'Il nome «lavoro» e il mezzo davanti', testo: R`Nel 1829 l'ingegnere francese Gaspard-Gustave Coriolis pubblicò un libro sul calcolo dell'effetto delle macchine. Voleva misurare quanto rende una ruota idraulica, una pompa, un argano. Scelse una parola semplice: *travail*, cioè lavoro. Lo definì come la forza per lo spostamento lungo la sua direzione. A quel tempo molti usavano la «forza viva», cioè la massa per il quadrato della velocità. Coriolis si accorse che con la forza viva i conti non tornavano per un fattore due. Allora la divise a metà: il lavoro diventava uguale alla variazione di $\tfrac{1}{2} \cdot m \cdot v^2$. Da allora quel mezzo non se n'è più andato. Oggi il suo nome si ricorda soprattutto per un'altra scoperta: la forza che devia i venti sulla Terra che ruota.`, legame: R`È la definizione di lavoro e l'energia cinetica $\tfrac{1}{2} \cdot m \cdot v^2$, legati dal teorema dell'energia cinetica.` },
    { fisico: 'Émilie du Châtelet', anni: '1706–1749', titolo: 'Le palle di ottone nell\'argilla', testo: R`Nel Settecento i fisici litigavano su una domanda: che cosa misura la «forza» di un corpo in moto? I seguaci di Newton dicevano la massa per la velocità. Quelli di Leibniz, la massa per la velocità al quadrato. L'olandese Willem 's Gravesande fece cadere palle di ottone su uno strato di argilla morbida. Una palla con velocità doppia lasciava un'impronta quattro volte più profonda. La marchesa francese Émilie du Châtelet, studiosa di matematica e fisica, raccontò questi esperimenti nelle sue *Istituzioni di fisica* del 1740. Ne trasse la conclusione giusta: l'effetto cresce con il quadrato della velocità. Poi tradusse in francese i *Principia* di Newton, con un lungo commento. Morì nel 1749, pochi giorni dopo un parto.`, legame: R`L'impronta nell'argilla misura l'energia cinetica, che va con il quadrato della velocità.` },
    { fisico: 'James Watt', anni: '1736–1819', titolo: 'Quanti cavalli vale una macchina a vapore', testo: R`Lo scozzese James Watt migliorò la macchina a vapore e voleva venderla ai padroni delle miniere. Lì l'acqua si toglieva con pompe mosse dai cavalli. Serviva un numero che dicesse quanti cavalli una macchina poteva sostituire. Watt stimò che un cavallo alzasse 33 000 libbre di un piede ogni minuto. Nacque così il **cavallo vapore**: circa 746 W nella versione inglese. In Italia si usa quello metrico, di circa 735 W, che si legge ancora negli annunci delle auto. Si racconta che Watt abbia preso le misure sui cavalli di un birrificio, ma è un dettaglio che non si può verificare. Più di sessant'anni dopo la sua morte, l'unità della potenza prese il suo nome.`, legame: R`Il cavallo vapore e il watt misurano la stessa cosa: la potenza, lavoro diviso tempo.` },
    { fisico: 'James Prescott Joule', anni: '1818–1889', titolo: 'Il termometro in viaggio di nozze', testo: R`James Prescott Joule, figlio di un ricco birraio di Manchester, passò anni a misurare come il lavoro si trasforma in calore. Nell'estate del 1847 sposò Amelia Grimes e partì con lei per le Alpi. Vicino a Chamonix incontrò per caso il giovane William Thomson, il futuro lord Kelvin. Joule aveva con sé un lungo termometro. Voleva vedere se l'acqua di una cascata fosse più calda in fondo che in cima. Secondo i suoi conti, cento metri di caduta dovevano scaldarla di circa due decimi di grado. Lo raccontò Thomson molti anni dopo. A quanto pare la misura non riuscì: l'acqua cadeva in spruzzi. L'idea però era giusta. Oggi l'unità di misura dell'energia porta il suo nome.`, legame: R`L'energia potenziale dell'acqua che cade diventa energia interna: è la conservazione dell'energia con l'attrito.` },
    { fisico: 'Julius Robert Mayer', anni: '1814–1878', titolo: 'Il sangue rosso dei marinai a Giava', testo: R`Nel 1840 il giovane medico tedesco Julius Robert Mayer si imbarcò su una nave olandese diretta a Giava. Ai tropici fece salassi ai marinai, come si usava allora. Si stupì: il sangue delle vene era rosso vivo, quasi come quello delle arterie. Mayer trovò una spiegazione. Al caldo il corpo deve produrre meno calore, quindi brucia meno cibo, e nel sangue resta più ossigeno. Da qui arrivò a un'idea grandiosa. Il cibo, il calore e il lavoro dei muscoli sono la stessa cosa in forme diverse, e la quantità totale non cambia. Il suo primo articolo, nel 1841, fu rifiutato. Lo pubblicò l'anno dopo, ma per molto tempo quasi nessuno gli diede credito. Il riconoscimento arrivò solo negli ultimi anni della sua vita.`, legame: R`È il principio di conservazione dell'energia: le forme cambiano, il totale resta.` }
  ]
});
})();
