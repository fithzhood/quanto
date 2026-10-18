/* Quanto — I principi della dinamica (terzo anno): inerzia, sistemi inerziali e relatività galileiana,
   F = m·a, la risultante, azione e reazione, peso apparente, sistemi non inerziali e forze apparenti.
   Contratto in SCHEMA.md, modello cinematica.js; forze e vettori con i colori e i simboli di forze.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/dinamica.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'dinamica',
  titolo: 'I principi della dinamica',
  introduzione: R`La cinematica descrive come si muove un corpo. La **dinamica** spiega *perché* si muove così: lega il moto alle forze che agiscono sul corpo. Tutto si regge su tre principi, scritti da Isaac Newton nel 1687.

I tre principi rispondono a domande di ogni giorno. Perché un disco sul ghiaccio scivola così a lungo? Perché un carrello carico è più difficile da far partire? Perché in ascensore la bilancia segna un numero diverso? Perché in curva ci si sente spinti verso l'esterno? Con le stesse leggi si progettano i freni di un'auto e si mandano le sonde nello spazio.

Bisogna conoscere le forze (peso, forza normale, attrito) e saperle sommare come vettori. Dalla cinematica servono velocità e accelerazione.`,
  inBreve: [
    R`**Primo principio**: se la risultante delle forze è zero, un corpo resta fermo o va dritto a velocità costante. La forza non serve a mantenere il moto, serve a cambiarlo.`,
    R`Il primo principio vale nei **sistemi inerziali**. Dentro un sistema in moto rettilineo uniforme nessun esperimento si accorge del moto: è la **relatività galileiana**.`,
    R`**Secondo principio**: la risultante è massa per accelerazione, $\vec{F} = m \cdot \vec{a}$. L'accelerazione punta come la risultante. $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$.`,
    R`**Terzo principio**: se A spinge B, B spinge A con una forza uguale e opposta. Le due forze agiscono su corpi diversi, e per questo non si annullano.`,
    R`In ascensore la bilancia segna il **peso apparente** $N = m \cdot (g + a)$, con $a$ positiva verso l'alto. In caduta libera segna zero.`,
    R`In un sistema che accelera chi sta dentro sente **forze apparenti**, come la centrifuga in curva. Nessun corpo le esercita: da fuori non ci sono.`
  ],
  sezioni: [
    {
      id: 'inerzia',
      titolo: 'Il primo principio: l\'inerzia',
      testo: R`Dai una spinta a un carrello della spesa e lo lasci andare. Dopo qualche metro si ferma. Viene da pensare che il moto si spenga da solo, quando nessuno spinge più.

Lo pensava anche Aristotele. Per lui un moto come una spinta aveva bisogno di una forza che lo tenesse in vita. Ci sono voluti quasi duemila anni, e Galileo, per capire che non è così.

[[video:dinamica/inerzia]]

Il carrello si ferma per colpa dell'**attrito**, una forza contraria al moto. Lo stesso vale per un disco lanciato sul pavimento: con meno attrito fa più strada. Senza attrito non rallenterebbe mai.

>* **Primo principio della dinamica**, o principio d'inerzia. Se la risultante delle forze su un corpo è zero, il corpo resta fermo o va di moto rettilineo uniforme.

L'**inerzia** è la tendenza di un corpo a conservare la sua velocità. Se è fermo resta fermo; se si muove continua dritto, alla stessa velocità.

Nel grafico quattro dischi uguali partono a 6 m/s: tre su piste vere, uno su una pista ideale, senza attrito, dove la linea resta orizzontale. Più forte è l'attrito, più in fretta cala la velocità.

[[grafico:piste]]

>! La forza non serve a mantenere il moto: serve a **cambiarlo**. Un corpo che va dritto a velocità costante può non avere nessuna forza addosso.

Velocità costante vuol dire anche **direzione** costante. Un'auto che fa una curva a 50 km/h non è in moto **rettilineo** uniforme: qualcosa la spinge di lato.

?? Una sonda viaggia lontanissima da stelle e pianeti, dove nessuna forza agisce su di lei. Spegne i motori. Che cosa fa?
[ ] rallenta piano piano fino a fermarsi
[x] continua dritta alla stessa velocità
[ ] si ferma subito
=> La risultante è zero: per il primo principio la velocità resta costante, in modulo e direzione. Non c'è niente che la freni.

?? Un libro è fermo sul tavolo. Su di lui agiscono delle forze?
[ ] no, altrimenti si muoverebbe
[x] sì, ma la loro risultante è zero
[ ] solo il peso
=> Agiscono il peso, verso il basso, e la forza normale del tavolo, verso l'alto. Si fanno equilibrio: risultante zero, e il libro resta fermo.`
    },
    {
      id: 'sistemi-inerziali',
      titolo: 'Sistemi inerziali e relatività galileiana',
      testo: R`Il primo principio non vale per tutti gli osservatori. Su un autobus che frena, una lattina sul pavimento parte in avanti da sola. Nessuna forza la spinge, eppure cambia velocità rispetto all'autobus.

>* Un **sistema di riferimento inerziale** è un sistema in cui vale il primo principio. Il suolo lo è con buona approssimazione.

Se un sistema è inerziale, lo è anche ogni sistema che si muove rispetto a lui di moto rettilineo uniforme. Un treno che corre dritto a velocità costante è inerziale quanto la stazione.

Galileo lo spiegò con una nave. Chiuso nella stiva, senza finestre, non puoi capire se la nave è ferma o va dritta a velocità costante.

[[video:dinamica/nave-di-galileo]]

>* **Principio di relatività galileiana**: le leggi della meccanica sono le stesse in tutti i sistemi inerziali. Nessun esperimento fatto all'interno distingue la quiete dal moto rettilineo uniforme.

Per passare dalla riva alla nave si usano le **trasformazioni di Galileo**. La nave va a velocità $v$ lungo l'asse x; all'istante zero le due origini coincidono.

~ x' = x - v \cdot t :: dopo un tempo $t$ l'origine della nave è avanzata di $v \cdot t$
~ y' = y \qquad t' = t :: le altezze sono le stesse, e il tempo scorre uguale per tutti
~ u' = u - v :: dividendo gli spostamenti per il tempo: le velocità si sottraggono

Esempio. Su una nave che va a 4 m/s un marinaio cammina verso prua a 1,5 m/s. Per chi sta a riva la sua velocità è $u = u' + v = 1{,}5\,\text{m/s} + 4\,\text{m/s} = 5{,}5\,\text{m/s}$.

Nel disegno un sasso cade dalla cima dell'albero della nave, alto circa 11 m. Dalla nave lo si vede cadere dritto. Da riva fa una parabola, perché parte già con la velocità della nave. Tocca il ponte ai piedi dell'albero, che intanto è avanzato.

[[grafico:albero]]

>! Il sasso non resta indietro. Era l'obiezione di chi negava il moto della Terra: un sasso lasciato dalla torre dovrebbe cadere lontano dal piede. Invece si muove insieme alla Terra, come il sasso con la nave.

?? Su un treno che va dritto a 30 m/s costanti lanci una palla verso l'alto. Dove ricade?
[ ] un po' dietro di te
[x] nella tua mano
[ ] un po' davanti a te
=> Il treno è un sistema inerziale: la palla si comporta come a treno fermo. Mentre sale e scende va avanti a 30 m/s, insieme a te.`
    },
    {
      id: 'secondo-principio',
      titolo: 'Il secondo principio: F = m·a',
      testo: R`Un carrello della spesa vuoto parte subito, con una piccola spinta. Pieno di bottiglie, con la stessa spinta, parte molto più piano. La stessa forza dà accelerazioni diverse a masse diverse.

[[video:dinamica/f-ma]]

Il video lo misura: massa doppia, accelerazione metà. E con una forza doppia sulla stessa massa l'accelerazione raddoppia.

>* **Secondo principio della dinamica**: la forza risultante su un corpo è uguale alla massa per l'accelerazione, $\vec{F} = m \cdot \vec{a}$. L'accelerazione ha la direzione e il verso della risultante.

Da qui viene l'unità di forza. Un **newton** è la forza che dà a 1 kg un'accelerazione di $1\,\text{m/s}^2$: $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$.

La massa misura l'**inerzia** del corpo, cioè quanto resiste ai cambi di velocità. Per questo si chiama anche *massa inerziale*.

Esempio. Un carrellino da 0,5 kg è tirato da un elastico con una forza di 3 N. Che accelerazione ha?

~ a = \dfrac{F}{m} :: ricavo l'accelerazione dal secondo principio
~ a = \dfrac{3\,\text{N}}{0{,}5\,\text{kg}} :: metto i dati con le loro unità
~ a = \evidb{6\,\text{m/s}^2} :: un newton diviso un chilogrammo fa proprio un $\text{m/s}^2$

Nel grafico c'è l'accelerazione in funzione della massa, con la forza fissata. È un'iperbole: con massa doppia l'accelerazione è la metà.

[[grafico:massa]]

In caduta libera l'unica forza è il peso. Allora $m \cdot a = m \cdot g$, e quindi $a = g$ per tutti i corpi. Ecco perché $9{,}8\,\text{N/kg}$ e $9{,}8\,\text{m/s}^2$ sono lo stesso numero.

>! La forza non è legata alla velocità, ma alla sua variazione. Un corpo veloce non ha bisogno di una forza grande: la forza decide quanto **cambia** la velocità.

?? A un carrello si applica una forza doppia, e intanto gli si carica sopra una massa uguale alla sua. Che cosa succede all'accelerazione?
[ ] raddoppia
[ ] si dimezza
[x] resta uguale
=> Da $a = F / m$: forza doppia e massa doppia, il rapporto non cambia.`
    },
    {
      id: 'risultante',
      titolo: 'Più forze: conta la risultante',
      testo: R`Su un corpo quasi mai agisce una forza sola. Su un'auto in moto ci sono la spinta della strada sulle ruote, l'aria che frena, il peso, la forza normale. Nel secondo principio conta la loro somma.

>* Nel secondo principio la forza è la **risultante** di tutte le forze sul corpo, che chiamiamo $\vec{F}_{\text{tot}}$: $\vec{F}_{\text{tot}} = m \cdot \vec{a}$. L'accelerazione punta dove punta la risultante, non dove va il corpo.

Il primo passo è il **diagramma di corpo libero**. Si disegna il corpo da solo, con tutte le forze che gli altri corpi esercitano su di lui. Poi si sommano come vettori.

Esempio. Un bambino trascina un pacco da 4 kg con una forza di 30 N in avanti. L'attrito del pavimento vale 18 N.

~ F_{\text{tot}} = F - F_d :: due forze sulla stessa retta, in versi opposti: si sottraggono
~ F_{\text{tot}} = 30\,\text{N} - 18\,\text{N} = 12\,\text{N} :: la risultante punta in avanti
~ a = \dfrac{F_{\text{tot}}}{m} = \dfrac{12\,\text{N}}{4\,\text{kg}} = \evidb{3\,\text{m/s}^2} :: in avanti, come la risultante

Nel disegno un carrello da 5 kg corre in avanti. Una mano lo spinge e un attrito di 20 N lo frena. Se la spinta è piccola, la risultante punta indietro. Allora il carrello rallenta, anche se va ancora avanti.

[[grafico:carrello]]

>! Il verso della velocità e quello dell'accelerazione non sono legati. Un'auto che frena va avanti, ma la sua accelerazione punta indietro.

?? Un'auto va a velocità costante in autostrada. La strada la spinge in avanti con 900 N. Quanto valgono, in tutto, le forze che la frenano?
[ ] meno di 900 N, se no l'auto non andrebbe avanti
[x] 900 N
[ ] più di 900 N
=> Velocità costante vuol dire accelerazione zero, quindi risultante zero. Le forze che frenano valgono proprio 900 N.`
    },
    {
      id: 'terzo-principio',
      titolo: 'Il terzo principio: azione e reazione',
      testo: R`Se spingi un muro, senti il muro che spinge te. Se lo fai con i pattini ai piedi, parti all'indietro. Le forze nascono sempre a coppie.

[[video:dinamica/azione-reazione]]

>* **Terzo principio della dinamica**. Se un corpo A esercita una forza su un corpo B, anche B esercita una forza su A. Le due forze hanno lo stesso modulo e la stessa direzione, ma verso opposto: $\vec{F}_{AB} = -\vec{F}_{BA}$.

Qui $\vec{F}_{AB}$ è la forza che A esercita su B, e $\vec{F}_{BA}$ quella di B su A. Il segno meno dice che hanno verso opposto.

Le due forze agiscono su **corpi diversi**, e per questo non si annullano. Si annullano solo forze che agiscono sullo stesso corpo. Ognuno dei due accelera per la forza che riceve, secondo la sua massa.

Esempio. Due pattinatori, A di 75 kg e B di 45 kg, si spingono con 90 N.

~ F_{AB} = F_{BA} = 90\,\text{N} :: ognuno riceve 90 N
~ a_A = \dfrac{90\,\text{N}}{75\,\text{kg}} = \evidb{1{,}2\,\text{m/s}^2} :: A, con più massa, accelera di meno
~ a_B = \dfrac{90\,\text{N}}{45\,\text{kg}} = \evidb{2\,\text{m/s}^2} :: B, con meno massa, accelera di più

[[grafico:pattinatori]]

Il terzo principio spiega anche come si cammina. Il piede spinge il terreno all'indietro, e il terreno spinge il piede in avanti. Su un ghiaccio liscissimo questa spinta manca, e non si parte.

>! Peso e forza normale di un libro sul tavolo sono uguali e opposti, ma **non** sono azione e reazione: agiscono tutti e due sul libro. La reazione del peso è la forza con cui il libro attira la Terra.

?? Un camion urta una piccola auto. Quale dei due riceve la forza più grande?
[ ] il camion
[ ] l'auto
[x] ricevono forze uguali
=> Per il terzo principio le due forze hanno lo stesso modulo. L'auto ha più danni perché, con meno massa, subisce un'accelerazione molto più grande.`
    },
    {
      id: 'peso-apparente',
      titolo: 'Il peso apparente: la bilancia in ascensore',
      testo: R`Quando l'ascensore parte verso l'alto, per un attimo ti senti più pesante. Quando frena salendo, ti senti più leggero. Una bilancia sotto i piedi lo conferma.

[[video:dinamica/ascensore]]

La bilancia non misura il peso. Misura quanto la premi. Per il terzo principio, è uguale alla forza normale $N$ con cui ti spinge in su. Su di te agiscono due forze: il peso $P$ verso il basso e $N$ verso l'alto.

~ N - P = m \cdot a :: secondo principio, con il verso positivo in alto
~ N = m \cdot g + m \cdot a :: il peso è $P = m \cdot g$
~ N = \evidb{m \cdot (g + a)} :: è quello che segna la bilancia

>* Il **peso apparente** è la forza con cui un corpo preme sul suo appoggio: $N = m \cdot (g + a)$, con $a$ positiva verso l'alto. Il peso vero, $P = m \cdot g$, non cambia.

Conta il verso dell'accelerazione, non quello del moto. Con l'accelerazione verso l'alto la bilancia segna di più: l'ascensore parte salendo, oppure frena scendendo. Con l'accelerazione verso il basso segna di meno.

Esempio. Un ragazzo di 60 kg sale in ascensore, che parte con $a = 1{,}5\,\text{m/s}^2$. La bilancia segna $N = 60\,\text{kg} \cdot (9{,}8 + 1{,}5)\,\text{m/s}^2 = 678\,\text{N}$, contro un peso di $588\,\text{N}$.

[[grafico:bilancia]]

Se il cavo si spezza, l'ascensore cade con $a = -g$. Allora $N = m \cdot (g - g) = 0$: la bilancia segna zero. È la stessa condizione degli astronauti in orbita, che cadono insieme alla loro stazione.

>! Peso apparente nullo non vuol dire «assenza di gravità». Alla quota della Stazione spaziale la gravità vale ancora circa il 90% di quella al suolo. Gli astronauti galleggiano perché cadono insieme alla stazione.

?? Un ascensore scende e sta frenando per fermarsi al piano terra. Rispetto al tuo peso, la bilancia segna…
[x] di più
[ ] di meno
[ ] lo stesso valore
=> Se frena mentre scende, l'accelerazione punta verso l'alto: $a > 0$, e $N = m \cdot (g + a)$ supera $m \cdot g$.`
    },
    {
      id: 'forze-apparenti',
      titolo: 'Sistemi non inerziali e forze apparenti',
      testo: R`In curva, sull'autobus, ti senti spinto verso l'esterno. Ma chi ti spinge? Da quella parte nessuno ti tocca.

[[video:dinamica/forze-apparenti]]

Visto da fuori, tu tendi ad andare dritto per inerzia. È l'autobus che curva sotto di te. Quando arrivi alla parete, è lei a spingerti verso l'interno e a farti curvare.

>* Un sistema che accelera rispetto a un sistema inerziale è **non inerziale**, e lì il primo principio non vale. Chi sta dentro, per far tornare i conti, aggiunge delle **forze apparenti**.

Una forza apparente non è esercitata da nessun corpo, e quindi non ha reazione. In un sistema che accelera con $\vec{a}_{\text{sist}}$ vale $\vec{F}_{\text{app}} = -m \cdot \vec{a}_{\text{sist}}$: punta al contrario dell'accelerazione del sistema.

Esempio. Un treno parte con $a_{\text{sist}} = 1{,}2\,\text{m/s}^2$. Su un passeggero di 70 kg, in piedi, chi sta sul treno vede una forza apparente all'indietro.

~ F_{\text{app}} = m \cdot a_{\text{sist}} :: il modulo della forza apparente
~ F_{\text{app}} = 70\,\text{kg} \cdot 1{,}2\,\text{m/s}^2 :: metto i numeri con le unità
~ F_{\text{app}} = \evidb{84\,\text{N}} :: verso la coda del treno
~ F_s = 84\,\text{N} :: per restare fermo sul treno, l'attrito delle scarpe lo spinge avanti con 84 N

Dal binario la storia è più semplice: l'attrito di 84 N è la forza vera che fa accelerare il passeggero insieme al treno.

Nel disegno, visto dall'alto, l'autobus curva e il passeggero sui pattini va dritto. La distanza fra i due cresce. Da dentro sembra una spinta verso l'esterno: la **forza centrifuga**.

[[grafico:curva]]

>! Per chi guarda da un sistema inerziale la forza centrifuga non esiste. Basta la forza **centripeta**, verso il centro, che fa curvare il corpo (la vedrai in «Applicazioni della dinamica»).

A rigore la Terra non è un sistema inerziale, perché gira su se stessa. Gli effetti però sono piccoli: per quasi tutti i problemi il suolo va bene.

?? In un'auto che frena di colpo vai in avanti contro la cintura. Visto dalla strada, che cosa succede?
[ ] una forza ti spinge in avanti
[x] tu tendi a continuare alla stessa velocità, e la cintura ti frena
[ ] la cintura ti tira in avanti
=> Dalla strada nessuna forza ti spinge avanti: per inerzia continui alla velocità di prima. La cintura esercita la forza vera, all'indietro, che ti fa rallentare con l'auto.`
    },
    {
      id: 'problemi',
      titolo: 'Come si risolve un problema di dinamica',
      testo: R`I problemi di dinamica si somigliano tutti. Conviene affrontarli sempre con gli stessi passi.

1. **Scegli il corpo** di cui studi il moto. Uno alla volta.
2. **Disegna il diagramma di corpo libero**: il corpo da solo, con tutte le forze che riceve. Peso, forza normale, attrito, spinte, tensioni di corde.
3. **Scegli gli assi**: di solito uno nel verso del moto e uno perpendicolare.
4. **Scrivi il secondo principio lungo ogni asse**: la somma delle componenti è massa per accelerazione. Dove il corpo non si muove, l'accelerazione è zero.
5. **Risolvi e controlla**: unità, segni, ordine di grandezza.

>* In ogni problema: un corpo, il suo diagramma di corpo libero, gli assi, $R_x = m \cdot a_x$ e $R_y = m \cdot a_y$, il controllo.

Esempio. Una slitta da 20 kg è tirata con una corda orizzontale, con 69 N. Il coefficiente di attrito dinamico con la neve è $\mu_d = 0{,}25$. Che accelerazione ha?

~ N = P = m \cdot g :: in verticale non accelera: la normale regge il peso
~ N = 20\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 196\,\text{N} :: con i numeri
~ F_d = \mu_d \cdot N :: l'attrito dinamico, contro il moto
~ F_d = 0{,}25 \cdot 196\,\text{N} = 49\,\text{N} :: con i numeri
~ F_{\text{tot}} = 69\,\text{N} - 49\,\text{N} = 20\,\text{N} :: in orizzontale: corda avanti, attrito indietro
~ a = \dfrac{20\,\text{N}}{20\,\text{kg}} = \evidb{1\,\text{m/s}^2} :: in avanti, nel verso della risultante

> Prima del conto, chiediti verso dove accelera il corpo. Se il risultato ha il segno opposto, ricontrolla i versi delle forze.

>! Ogni forza ha qualcuno che la esercita. «La forza del moto» o «la spinta che ha preso» non sono forze. Se non sai dire quale corpo la esercita, quella forza non c'è.`
    }
  ],
  grafici: {
    /* tre dischi lanciati a 6 m/s: l'attrito toglie velocità, più o meno in fretta; senza attrito la linea resta piatta */
    piste: {
      tipo: 'orario', grandezza: 'v', t: [0, 12], y: [0, 8],
      funzioni: [
        { f: '6', dominio: [0, 12], colore: 1, tratteggio: true },
        { f: '6 - 0.3*t', dominio: [0, 12], colore: 1 },
        { f: '6 - 0.8*t', dominio: [0, 7.5], colore: 1 },
        { f: '6 - 5*t', dominio: [0, 1.2], colore: 1 }
      ],
      elementi: [
        { tipo: 'testo', p: [11.8, 6.5], testo: 'senza attrito', ancora: 'end' },
        { tipo: 'testo', p: [11.8, 3.9], testo: 'ghiaccio', ancora: 'end' },
        { tipo: 'testo', p: [7.7, 0.6], testo: 'legno', ancora: 'start' },
        { tipo: 'punto', p: [1.2, 0], colore: 1 },
        { tipo: 'punto', p: [7.5, 0], colore: 1 },
        { tipo: 'testo', p: [1.4, 0.6], testo: 'moquette', ancora: 'start' }
      ],
      didascalia: 'La velocità di tre dischi uguali, lanciati tutti a 6 m/s, e di un quarto su una pista ideale (tratteggio). L\'attrito toglie velocità ogni secondo: tanta sulla moquette, poca sul ghiaccio. Passa il dito sul grafico per leggere i valori.'
    },
    /* il sasso dall'albero della nave, visto da riva: parabola; l'albero avanza con la nave e il sasso gli cade ai piedi */
    albero: {
      tipo: 'piano', x: [-0.5, 15], y: [-0.5, 13.5], altezza: 440, proporzioni: 'libere', etichette: { x: 'x (m)', y: 'y (m)' }, mirino: false,
      parametri: [{ nome: 'V', min: 1, max: 8, passo: 0.5, valore: 4, etichetta: 'nave (m/s)' }],
      funzioni: [{ f: '11.025 - 4.9*((x - 1)/V)^2', dominio: [1, '1 + 1.5*V'], colore: 'grigio', tratteggio: true }],
      elementi: [
        { tipo: 'segmento', da: [1, 0], a: [1, 11.025], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['1 + 1.5*V', 0], a: ['1 + 1.5*V', 11.025], colore: 'grigio' },
        { tipo: 'punto', p: [1, 11.025], colore: 'grigio' },
        { tipo: 'punto', p: ['1 + 0.5*V', 9.8], colore: 'grigio' },
        { tipo: 'punto', p: ['1 + V', 6.125], colore: 'grigio' },
        { tipo: 'punto', p: ['1 + 1.5*V', 0], colore: 'grigio' },
        { tipo: 'vettore', da: [1, 11.025], a: ['1 + 0.5*V', 11.025], etichetta: 'v', colore: 1 },
        { tipo: 'testo', p: [14.8, 12.6], testo: 'in 1,5 s la nave avanza di {{1.5*V}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Visto da riva: un sasso lasciato dalla cima dell\'albero (circa 11 m) e fotografato ogni 0,5 s. Parte con la velocità della nave, fa una parabola e cade ai piedi dell\'albero, che intanto è avanzato (linea piena). Dalla nave la caduta è dritta. Il cursore cambia la velocità della nave.'
    },
    /* a = F/m con la forza fissata: un'iperbole; massa doppia, accelerazione metà */
    massa: {
      tipo: 'piano', x: [0, 21], y: [0, 8], altezza: 400, etichette: { x: 'm (kg)', y: 'a (m/s²)' },
      parametri: [{ nome: 'F', min: 5, max: 30, passo: 1, valore: 15, etichetta: 'F (N)' }],
      funzioni: [{ f: 'F/x', dominio: ['F/8', 16], colore: 4 }],
      elementi: [
        { tipo: 'segmento', da: [5, 0], a: [5, 'F/5'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [10, 0], a: [10, 'F/10'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [5, 'F/5'], etichetta: '{{F/5}} m/s²', posizione: 'destra', colore: 4 },
        { tipo: 'punto', p: [10, 'F/10'], etichetta: '{{F/10}} m/s²', posizione: 'alto-destra', colore: 4 },
        { tipo: 'testo', p: [20.6, 7.2], testo: 'F = {{F}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'L\'accelerazione di un corpo spinto da una forza fissa, al variare della massa: a = F/m. Da 5 kg a 10 kg l\'accelerazione si dimezza. Il cursore cambia la forza. Passa il dito sul grafico per leggere i valori.'
    },
    /* il carrello spinto e frenato: forze arancio, risultante verde, accelerazione viola, velocità azzurra */
    carrello: {
      tipo: 'piano', x: [-7.5, 7.5], y: [-4.8, 5.2], altezza: 440, assi: false, passo: [1, 1],
      parametri: [{ nome: 'F', min: 0, max: 50, passo: 5, valore: 35, etichetta: 'spinta (N)' }],
      elementi: [
        { tipo: 'segmento', da: [-7.5, 0], a: [7.5, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-1.5, 0], [1.5, 0], [1.5, 2], [-1.5, 2]], colore: 'grigio' },
        { tipo: 'vettore', da: [-1.2, 2.9], a: [1.2, 2.9], etichetta: 'v', colore: 1 },
        { tipo: 'vettore', da: ['-1.5 - F/10', 1.75], a: [-1.5, 1.75], etichetta: 'F', colore: 2 },
        { tipo: 'vettore', da: [-1.5, 0.3], a: [-3.5, 0.3], etichetta: 'F_d', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 4.2], a: ['(F - 20)/5', 4.2], etichetta: 'a', colore: 4 },
        { tipo: 'vettore', da: [0, -1.6], a: ['(F - 20)/10', -1.6], etichetta: 'F_{tot}', colore: 3, spessore: 3.4 },
        { tipo: 'testo', p: [7.3, -3.3], testo: 'F_{tot} = {{F}} − 20 = {{F - 20}} N', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [7.3, -4.4], testo: 'a = F_{tot}/m = {{(F - 20)/5}} m/s²', ancora: 'end', colore: 4 }
      ],
      didascalia: 'Un carrello da 5 kg corre in avanti (freccia v). La spinta F e l\'attrito F_d = 20 N sono in arancio (un quadretto = 10 N); peso e forza normale si fanno equilibrio e non sono disegnati. La risultante F_{tot}, in verde, e l\'accelerazione a, in viola, puntano sempre dalla stessa parte. Con una spinta sotto i 20 N puntano indietro: il carrello rallenta. Nelle scritte il verso in avanti è positivo, quello indietro negativo.'
    },
    /* due pattinatori si spingono: forze uguali e opposte, su corpi diversi; accelerazioni diverse */
    pattinatori: {
      tipo: 'piano', x: [-7.5, 7.5], y: [-3.8, 4], altezza: 380, assi: false, passo: [1, 1],
      parametri: [{ nome: 'mB', min: 30, max: 90, passo: 5, valore: 45, etichetta: 'massa di B (kg)' }],
      elementi: [
        { tipo: 'segmento', da: [-7.5, 0], a: [7.5, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-2.6, 0], [-0.6, 0], [-0.6, 2.4], [-2.6, 2.4]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0.6, 0], [2.6, 0], [2.6, 2.4], [0.6, 2.4]], colore: 'grigio' },
        { tipo: 'testo', p: [-0.4, 3], testo: 'A: 75 kg', ancora: 'end' },
        { tipo: 'testo', p: [0.4, 3], testo: 'B: {{mB}} kg', ancora: 'start' },
        { tipo: 'vettore', da: [-2.6, 1.2], a: [-5.6, 1.2], etichetta: 'F_{BA}', colore: 2 },
        { tipo: 'vettore', da: [2.6, 1.2], a: [5.6, 1.2], etichetta: 'F_{AB}', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [-1.6, -1], a: [-3.4, -1], etichetta: 'a_A', colore: 4, posizione: 'destra' },
        { tipo: 'vettore', da: [1.6, -1], a: ['1.6 + 135/mB', -1], etichetta: 'a_B', colore: 4 },
        { tipo: 'testo', p: [-7.3, -3], testo: 'a_A = 1,2 m/s²', ancora: 'start', colore: 4 },
        { tipo: 'testo', p: [7.3, -3], testo: 'a_B = {{90/mB}} m/s²', ancora: 'end', colore: 4 }
      ],
      didascalia: 'A spinge B con 90 N, e B spinge A con 90 N nel verso opposto (un quadretto = 30 N; F_AB è la forza di A su B). Ogni forza agisce su un corpo diverso, quindi non si annullano. Le accelerazioni, in viola, dipendono dalla massa di ciascuno. Il cursore cambia la massa di B.'
    },
    /* la ragazza sulla bilancia in ascensore: il peso resta, la normale cambia con l'accelerazione */
    bilancia: {
      tipo: 'piano', x: [-6, 6], y: [-6.4, 9.6], altezza: 520, assi: false, passo: [1, 1],
      parametri: [{ nome: 'a', min: -9.8, max: 4, passo: 0.1, valore: 1.5, etichetta: 'a (m/s²)' }],
      elementi: [
        { tipo: 'poligono', punti: [[-1.8, -0.5], [1.8, -0.5], [1.8, 0], [-1.8, 0]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.9, 0], [0.9, 0], [0.9, 2.6], [-0.9, 2.6]], colore: 'grigio' },
        { tipo: 'vettore', da: [-0.6, 1.3], a: [-0.6, -4.58], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: [0.6, 0], a: [0.6, '0.6*(9.8 + a)'], etichetta: 'N', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [3.2, 1.3], a: [3.2, '1.3 + 0.5*a'], etichetta: 'a', colore: 4, posizione: 'destra' },
        { tipo: 'testo', p: [-5.8, -5.6], testo: 'P = 588 N', ancora: 'start', colore: 2 },
        { tipo: 'testo', p: [-5.8, 9], testo: 'la bilancia segna', ancora: 'start' },
        { tipo: 'testo', p: [-5.8, 7.9], testo: 'N = {{60*(9.8 + a)}} N', ancora: 'start', colore: 2 }
      ],
      didascalia: 'Un ragazzo di 60 kg sulla bilancia, in ascensore (un quadretto = 100 N per le forze). L\'accelerazione a è positiva verso l\'alto. Il peso P resta 588 N; la forza normale N, cioè quello che segna la bilancia, segue l\'accelerazione. Con a = −9,8 m/s² l\'ascensore cade libero e la bilancia segna zero.'
    },
    /* l'autobus curva, il passeggero sui pattini va dritto: visto da fuori nessuno lo spinge verso l'esterno */
    curva: {
      tipo: 'piano', x: [-1, 7.5], y: [-2.2, 4.4], altezza: 400, proporzioni: 'uguali', assi: false,
      parametri: [{ nome: 's', min: 0, max: 5, passo: 0.25, valore: 4, etichetta: 'metri percorsi' }],
      funzioni: [{ f: '10 - sqrt(100 - x^2)', dominio: [0, 6.6], colore: 'grigio' }],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [7.5, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['s', 0], a: ['10*sin(s/10)', '10 - 10*cos(s/10)'], colore: 3, tratteggio: true },
        { tipo: 'punto', p: ['10*sin(s/10)', '10 - 10*cos(s/10)'], etichetta: 'autobus', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'punto', p: ['s', 0], colore: 'grigio' },
        { tipo: 'testo', p: ['s', -1.3], testo: 'passeggero' },
        { tipo: 'testo', p: [7.3, 3.8], testo: 'distanza ≈ {{sqrt((s - 10*sin(s/10))^2 + (10 - 10*cos(s/10))^2)}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Visto dall\'alto, da fuori: l\'autobus fa una curva a sinistra di raggio 10 m, il passeggero sui pattini continua dritto per inerzia (tratteggio). La distanza fra loro cresce: dopo circa 5 m è di 1,2 m, e lui tocca la parete. Il cursore fa avanzare tutti e due della stessa strada.'
    }
  },
  esempi: [
    {
      titolo: 'Il carrello che parte',
      problema: R`Un carrello da 8 kg è fermo su un binario senza attrito. Lo si spinge con una forza costante di 20 N. Quanto vale l'accelerazione? Che velocità ha dopo 4 s, e quanta strada ha fatto?`,
      passi: [
        R`Dati: $m = 8\,\text{kg}$, $F = 20\,\text{N}$, $v_0 = 0$, $t = 4\,\text{s}$. Cerco l'accelerazione $a$, la velocità $v$ e lo spazio $\Delta s$.`,
        R`Senza attrito la spinta è l'unica forza orizzontale, quindi è la risultante. Dal secondo principio: $a = \dfrac{F}{m} = \dfrac{20\,\text{N}}{8\,\text{kg}} = 2{,}5\,\text{m/s}^2$.`,
        R`La forza è costante, quindi anche l'accelerazione: è un moto uniformemente accelerato. $v = a \cdot t = 2{,}5\,\text{m/s}^2 \cdot 4\,\text{s} = 10\,\text{m/s}$.`,
        R`Lo spazio, partendo da fermo: $\Delta s = \frac{1}{2} \cdot a \cdot t^2 = \frac{1}{2} \cdot 2{,}5 \cdot 16\,\text{m} = 20\,\text{m}$.`,
        R`Controllo: la velocità media è $\dfrac{0 + 10}{2} = 5\,\text{m/s}$, e in 4 s fa $5 \cdot 4 = 20\,\text{m}$. Torna.`
      ],
      risultato: R`$a = 2{,}5\,\text{m/s}^2$; dopo 4 s, $v = 10\,\text{m/s}$ e $\Delta s = 20\,\text{m}$.`
    },
    {
      titolo: 'La forza dei freni',
      problema: R`Un'auto da 900 kg viaggia a 54 km/h e si ferma in 3 s con accelerazione costante. Quanto vale la forza frenante? Quanti metri percorre frenando?`,
      passi: [
        R`Dati: $m = 900\,\text{kg}$, $v_0 = 54\,\text{km/h}$, $v = 0$, $\Delta t = 3\,\text{s}$. Cerco la forza frenante $F$ e lo spazio $\Delta s$.`,
        R`Prima le unità: $v_0 = \dfrac{54}{3{,}6}\,\text{m/s} = 15\,\text{m/s}$.`,
        R`Accelerazione, con il verso positivo nel verso del moto: $a = \dfrac{0 - 15\,\text{m/s}}{3\,\text{s}} = -5\,\text{m/s}^2$.`,
        R`Secondo principio: $F = m \cdot a = 900\,\text{kg} \cdot (-5\,\text{m/s}^2) = -4500\,\text{N}$. Il segno meno dice che la forza punta all'indietro.`,
        R`Lo spazio: la velocità media è $7{,}5\,\text{m/s}$ per 3 s, quindi $\Delta s = 22{,}5\,\text{m}$. Controllo con la formula senza tempo: $\dfrac{15^2}{2 \cdot 5} = 22{,}5\,\text{m}$. Torna.`
      ],
      risultato: R`Forza frenante di $4500\,\text{N}$, all'indietro; spazio di frenata $22{,}5\,\text{m}$.`
    },
    {
      titolo: 'Due corde ad angolo retto',
      problema: R`Un carrello da 25 kg, su un pavimento senza attrito, è tirato da due corde orizzontali perpendicolari: una con 30 N verso est, l'altra con 40 N verso nord. Quanto vale l'accelerazione, e in che direzione?`,
      passi: [
        R`Dati: $m = 25\,\text{kg}$, $F_1 = 30\,\text{N}$ verso est, $F_2 = 40\,\text{N}$ verso nord. Cerco il modulo e la direzione di $\vec{a}$.`,
        R`Peso e forza normale si fanno equilibrio. In orizzontale la risultante è la somma vettoriale delle due tensioni.`,
        R`Forze perpendicolari: $F_{\text{tot}} = \sqrt{F_1^2 + F_2^2} = \sqrt{900 + 1600}\,\text{N} = \sqrt{2500}\,\text{N} = 50\,\text{N}$.`,
        R`Secondo principio: $a = \dfrac{F_{\text{tot}}}{m} = \dfrac{50\,\text{N}}{25\,\text{kg}} = 2\,\text{m/s}^2$.`,
        R`L'accelerazione punta come la risultante. Dalla direzione est, l'angolo $\alpha$ verso nord ha $\tan\alpha = \dfrac{40}{30}$, quindi $\alpha \approx 53^\circ$.`
      ],
      risultato: R`$a = 2\,\text{m/s}^2$, a circa $53^\circ$ dalla direzione est verso nord.`
    },
    {
      titolo: 'La bilancia che segna in chilogrammi',
      problema: R`Una persona di 70 kg sta su una bilancia pesapersone in ascensore. L'ascensore parte verso il basso con un'accelerazione di $1{,}8\,\text{m/s}^2$. Quanto vale la forza normale? Che numero mostra la bilancia, che è tarata in chilogrammi?`,
      passi: [
        R`Dati: $m = 70\,\text{kg}$, $a = -1{,}8\,\text{m/s}^2$ (verso positivo in alto), $g = 9{,}8\,\text{m/s}^2$. Cerco la normale $N$ e il numero della bilancia.`,
        R`Sulla persona agiscono il peso, in giù, e la normale, in su. Secondo principio: $N - m \cdot g = m \cdot a$, quindi $N = m \cdot (g + a)$.`,
        R`$N = 70\,\text{kg} \cdot (9{,}8 - 1{,}8)\,\text{m/s}^2 = 70 \cdot 8\,\text{N} = 560\,\text{N}$. Il peso vero è $70 \cdot 9{,}8 = 686\,\text{N}$.`,
        R`Una bilancia tarata in chilogrammi divide la forza che sente per $9{,}8\,\text{N/kg}$: mostra $\dfrac{560}{9{,}8}\,\text{kg} \approx 57{,}1\,\text{kg}$.`,
        R`Controllo: l'accelerazione punta in giù, quindi la bilancia deve segnare meno di 70 kg. Torna.`
      ],
      risultato: R`$N = 560\,\text{N}$; la bilancia mostra circa $57{,}1\,\text{kg}$.`
    },
    {
      titolo: 'Due pattinatori si spingono',
      problema: R`Due pattinatori sono fermi sul ghiaccio. A ha massa 80 kg, B ha massa 50 kg. Si spingono con le mani per 0,5 s, con una forza costante di 120 N. Con che velocità si separano? Trascura l'attrito.`,
      passi: [
        R`Dati: $m_A = 80\,\text{kg}$, $m_B = 50\,\text{kg}$, $F = 120\,\text{N}$, $\Delta t = 0{,}5\,\text{s}$. Cerco le velocità $v_A$ e $v_B$.`,
        R`Per il terzo principio A spinge B con 120 N, e B spinge A con 120 N nel verso opposto. Ognuno riceve 120 N.`,
        R`Accelerazioni: $a_A = \dfrac{120\,\text{N}}{80\,\text{kg}} = 1{,}5\,\text{m/s}^2$, $a_B = \dfrac{120\,\text{N}}{50\,\text{kg}} = 2{,}4\,\text{m/s}^2$.`,
        R`Velocità dopo 0,5 s, partendo da fermi: $v_A = 1{,}5 \cdot 0{,}5 = 0{,}75\,\text{m/s}$ e $v_B = 2{,}4 \cdot 0{,}5 = 1{,}2\,\text{m/s}$, in versi opposti.`,
        R`Controllo: massa per velocità dà $80 \cdot 0{,}75 = 60$ e $50 \cdot 1{,}2 = 60$. Stesso numero per tutti e due, come deve essere con forze uguali per lo stesso tempo.`
      ],
      risultato: R`A parte a $0{,}75\,\text{m/s}$, B a $1{,}2\,\text{m/s}$ nel verso opposto.`
    },
    {
      titolo: 'La valigia sul treno che parte',
      problema: R`Una valigia da 15 kg è appoggiata sul pavimento di un treno. Il treno parte con $a_{\text{sist}} = 0{,}8\,\text{m/s}^2$ e la valigia non scivola. Spiega che cosa succede visto dal binario e visto dal treno. Quanto vale l'attrito?`,
      passi: [
        R`Dati: $m = 15\,\text{kg}$, $a_{\text{sist}} = 0{,}8\,\text{m/s}^2$. Cerco la forza d'attrito $F_s$ sulla valigia.`,
        R`Dal binario (sistema inerziale): la valigia accelera insieme al treno. L'unica forza orizzontale è l'attrito, quindi $F_s = m \cdot a_{\text{sist}} = 15\,\text{kg} \cdot 0{,}8\,\text{m/s}^2 = 12\,\text{N}$, in avanti.`,
        R`Dal treno (sistema non inerziale): la valigia è ferma. Su di lei agiscono l'attrito, 12 N in avanti, e la forza apparente $m \cdot a_{\text{sist}} = 12\,\text{N}$ all'indietro. Si fanno equilibrio.`,
        R`I due osservatori trovano lo stesso attrito. Cambia solo il racconto: per chi sta sul treno serve una forza apparente.`,
        R`Controllo: perché non scivoli, l'attrito statico massimo deve superare 12 N. Basta $\mu_s \ge \dfrac{12}{15 \cdot 9{,}8} \approx 0{,}08$, un valore piccolo.`
      ],
      risultato: R`L'attrito vale $12\,\text{N}$, in avanti, per tutti e due gli osservatori.`
    }
  ],
  formulario: [
    { nome: 'Primo principio', formula: R`\vec{F}_{\text{tot}} = \vec{0} \;\Rightarrow\; \vec{v} = \text{costante}`, nota: R`Risultante zero: il corpo resta fermo o va di moto rettilineo uniforme. Vale nei sistemi inerziali.` },
    { nome: 'Trasformazioni di Galileo', formula: R`x' = x - v \cdot t \qquad y' = y`, nota: R`Il sistema con l'apice va a velocità $v$ lungo x; il tempo è lo stesso, $t' = t$.` },
    { nome: 'Velocità in due sistemi inerziali', formula: R`u' = u - v`, nota: R`$u$ misurata da terra, $u'$ dal sistema che va a velocità $v$.` },
    { nome: 'Secondo principio', formula: R`\vec{F}_{\text{tot}} = m \cdot \vec{a} \qquad a = \dfrac{F_{\text{tot}}}{m}`, nota: R`$\vec{F}_{\text{tot}}$ è la risultante; con $F_{\text{tot}}$ in N e m in kg, a è in $\text{m/s}^2$. L'accelerazione ha la direzione e il verso della risultante.` },
    { nome: 'Il newton', formula: R`1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2`, nota: R`La forza che dà a 1 kg un'accelerazione di $1\,\text{m/s}^2$.` },
    { nome: 'Terzo principio', formula: R`\vec{F}_{AB} = -\vec{F}_{BA}`, nota: R`$\vec{F}_{AB}$ è la forza di A su B. Le due forze agiscono su corpi diversi.` },
    { nome: 'Peso', formula: R`P = m \cdot g`, nota: R`Sulla Terra $g = 9{,}8\,\text{N/kg} = 9{,}8\,\text{m/s}^2$.` },
    { nome: 'Peso apparente', formula: R`N = m \cdot (g + a)`, nota: R`$a$ positiva verso l'alto. In caduta libera $a = -g$ e $N = 0$.` },
    { nome: 'Forza apparente', formula: R`\vec{F}_{\text{app}} = -m \cdot \vec{a}_{\text{sist}}`, nota: R`Solo in un sistema che accelera con $\vec{a}_{\text{sist}}$. Nessun corpo la esercita.` },
    { nome: 'Attrito dinamico', formula: R`F_d = \mu_d \cdot N`, nota: R`Contro il moto. Su un piano orizzontale, senza altre forze verticali, $N = m \cdot g$.` },
    { nome: 'Secondo principio per componenti', formula: R`R_x = m \cdot a_x \qquad R_y = m \cdot a_y`, nota: R`Lungo un asse in cui il corpo non si muove, $a = 0$ e la somma delle forze è zero.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'inerzia', tipo: 'definizione', fronte: R`Che cosa dice il **primo principio** della dinamica?`, retro: R`Se la risultante delle forze su un corpo è zero, il corpo resta fermo o va di moto rettilineo uniforme.` },
    { id: 'fc-02', sezione: 'inerzia', tipo: 'definizione', fronte: R`Che cos'è l'**inerzia**?`, retro: R`La tendenza di un corpo a conservare la sua velocità: fermo se è fermo, dritto e a velocità costante se si muove.` },
    { id: 'fc-03', sezione: 'inerzia', tipo: 'concetto', fronte: R`Serve una forza per mantenere un corpo in moto?`, retro: R`No. La forza serve a **cambiare** la velocità. Un corpo si ferma perché l'attrito lo frena, non perché «finisce la spinta».` },
    { id: 'fc-04', sezione: 'sistemi-inerziali', tipo: 'definizione', fronte: R`Che cos'è un **sistema inerziale**?`, retro: R`Un sistema di riferimento in cui vale il primo principio. Lo è anche ogni sistema in moto rettilineo uniforme rispetto a lui.` },
    { id: 'fc-05', sezione: 'sistemi-inerziali', tipo: 'concetto', fronte: R`Che cosa dice il **principio di relatività galileiana**?`, retro: R`Le leggi della meccanica sono le stesse in tutti i sistemi inerziali: nessun esperimento interno distingue la quiete dal moto rettilineo uniforme.` },
    { id: 'fc-06', sezione: 'sistemi-inerziali', tipo: 'formula', fronte: R`Le **trasformazioni di Galileo**`, retro: R`$x' = x - v \cdot t$, $y' = y$, $t' = t$, per un sistema che va a velocità $v$ lungo l'asse x.` },
    { id: 'fc-07', sezione: 'sistemi-inerziali', tipo: 'formula', fronte: R`Come cambia una velocità passando a un sistema che va a velocità $v$?`, retro: R`Si sottrae: $u' = u - v$.` },
    { id: 'fc-08', sezione: 'secondo-principio', tipo: 'formula', fronte: R`Il **secondo principio** della dinamica`, retro: R`$\vec{F} = m \cdot \vec{a}$: la risultante è massa per accelerazione, e l'accelerazione ha il verso della risultante.` },
    { id: 'fc-09', sezione: 'secondo-principio', tipo: 'definizione', fronte: R`Che cos'è un **newton**?`, retro: R`La forza che dà a una massa di 1 kg un'accelerazione di $1\,\text{m/s}^2$: $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$.` },
    { id: 'fc-10', sezione: 'secondo-principio', tipo: 'concetto', fronte: R`Perché la massa si chiama anche **massa inerziale**?`, retro: R`Perché misura quanto un corpo resiste ai cambi di velocità: a parità di forza, più massa vuol dire meno accelerazione.` },
    { id: 'fc-11', sezione: 'secondo-principio', tipo: 'concetto', fronte: R`Perché nel vuoto tutti i corpi cadono con la stessa accelerazione?`, retro: R`L'unica forza è il peso $m \cdot g$. Da $m \cdot a = m \cdot g$ la massa si semplifica: $a = g$ per tutti.` },
    { id: 'fc-12', sezione: 'risultante', tipo: 'concetto', fronte: R`Un'auto frena andando avanti. Dove punta la sua accelerazione?`, retro: R`Indietro, come la risultante delle forze. Il verso della velocità non decide quello dell'accelerazione.` },
    { id: 'fc-13', sezione: 'risultante', tipo: 'definizione', fronte: R`Che cos'è il **diagramma di corpo libero**?`, retro: R`Il disegno di un corpo da solo, con tutte le forze che gli altri corpi esercitano su di lui.` },
    { id: 'fc-14', sezione: 'terzo-principio', tipo: 'formula', fronte: R`Il **terzo principio** della dinamica`, retro: R`$\vec{F}_{AB} = -\vec{F}_{BA}$: la forza di A su B e quella di B su A hanno stesso modulo, stessa direzione e versi opposti.` },
    { id: 'fc-15', sezione: 'terzo-principio', tipo: 'concetto', fronte: R`Perché azione e reazione non si annullano?`, retro: R`Perché agiscono su corpi diversi. Si sommano, e possono annullarsi, solo le forze che agiscono sullo stesso corpo.` },
    { id: 'fc-16', sezione: 'terzo-principio', tipo: 'concetto', fronte: R`Peso e forza normale di un libro sul tavolo sono azione e reazione?`, retro: R`No: agiscono tutti e due sul libro. La reazione del peso è la forza con cui il libro attira la Terra.` },
    { id: 'fc-17', sezione: 'peso-apparente', tipo: 'formula', fronte: R`Il **peso apparente** in ascensore`, retro: R`$N = m \cdot (g + a)$, con $a$ positiva verso l'alto. È quello che segna la bilancia.` },
    { id: 'fc-18', sezione: 'peso-apparente', tipo: 'concetto', fronte: R`Quando la bilancia in ascensore segna più del peso?`, retro: R`Quando l'accelerazione punta in su: l'ascensore parte salendo, oppure frena scendendo.` },
    { id: 'fc-19', sezione: 'peso-apparente', tipo: 'concetto', fronte: R`In caduta libera la bilancia segna zero. Il peso è sparito?`, retro: R`No: il peso è sempre $m \cdot g$. È la bilancia che non spinge più, perché cade insieme a te.` },
    { id: 'fc-20', sezione: 'forze-apparenti', tipo: 'definizione', fronte: R`Che cos'è una **forza apparente**?`, retro: R`Una forza che compare solo in un sistema non inerziale, per far tornare i conti. Nessun corpo la esercita e non ha reazione.` },
    { id: 'fc-21', sezione: 'forze-apparenti', tipo: 'formula', fronte: R`La forza apparente in un sistema che accelera con $\vec{a}_{\text{sist}}$`, retro: R`$\vec{F}_{\text{app}} = -m \cdot \vec{a}_{\text{sist}}$: punta al contrario dell'accelerazione del sistema.` },
    { id: 'fc-22', sezione: 'forze-apparenti', tipo: 'concetto', fronte: R`Perché in curva ti senti spinto verso l'esterno?`, retro: R`Per inerzia tendi ad andare dritto mentre il mezzo curva. Da dentro sembra una forza, la centrifuga; da fuori c'è solo la centripeta.` },
    { id: 'fc-23', sezione: 'problemi', tipo: 'procedura', fronte: R`I passi di un problema di dinamica`, retro: R`Scegli il corpo e disegna le forze che riceve. Scegli gli assi e scrivi $F_{\text{tot}} = m \cdot a$ lungo ciascuno. Poi risolvi e controlla.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un corpo di 7 kg ha un'accelerazione di $4\,\text{m/s}^2$. Quanto vale la forza risultante che agisce su di lui?`, suggerimenti: [R`Secondo principio: $F = m \cdot a$.`], risposta: { tipo: 'numero', valore: 28, unita: 'N' }, soluzione: [R`$F = m \cdot a = 7\,\text{kg} \cdot 4\,\text{m/s}^2 = 28\,\text{N}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una forza risultante di 35 N agisce su una cassa di 7 kg. Quanto vale l'accelerazione della cassa?`, suggerimenti: [R`Dal secondo principio: $a = \dfrac{F}{m}$.`], risposta: { tipo: 'numero', valore: 5, unita: 'm/s²' }, soluzione: [R`$a = \dfrac{35\,\text{N}}{7\,\text{kg}} = 5\,\text{m/s}^2$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Una forza risultante di 72 N dà a un corpo un'accelerazione di $9\,\text{m/s}^2$. Qual è la massa del corpo?`, suggerimenti: [R`Dal secondo principio: $m = \dfrac{F}{a}$.`], risposta: { tipo: 'numero', valore: 8, unita: 'kg' }, soluzione: [R`$m = \dfrac{72\,\text{N}}{9\,\text{m/s}^2} = 8\,\text{kg}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una moto di 250 kg, con il pilota, accelera con $2{,}4\,\text{m/s}^2$. Quanto vale la forza risultante?`, suggerimenti: [R`$F = m \cdot a$, con la massa in kg.`], risposta: { tipo: 'numero', valore: 600, unita: 'N' }, soluzione: [R`$F = 250\,\text{kg} \cdot 2{,}4\,\text{m/s}^2 = 600\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una slitta di 9 kg è tirata in avanti con 50 N. L'attrito la frena con 14 N. Quanto vale la sua accelerazione?`, suggerimenti: [R`Prima la risultante: le due forze hanno versi opposti.`, R`Poi $a = \dfrac{R}{m}$.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s²' }, soluzione: [R`$R = 50\,\text{N} - 14\,\text{N} = 36\,\text{N}$ in avanti.`, R`$a = \dfrac{36\,\text{N}}{9\,\text{kg}} = 4\,\text{m/s}^2$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Una barca procede a velocità costante. Il motore la spinge in avanti con 750 N. Quanto vale la forza con cui l'acqua la frena?`, suggerimenti: [R`Velocità costante: quanto vale l'accelerazione? E la risultante?`], risposta: { tipo: 'numero', valore: 750, unita: 'N' }, soluzione: [R`Velocità costante vuol dire $a = 0$, quindi risultante zero.`, R`L'acqua la frena con $750\,\text{N}$, uguale e opposta alla spinta.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Quanto pesa, sulla Terra, un corpo di 35 kg?`, suggerimenti: [R`$P = m \cdot g$, con $g = 9{,}8\,\text{N/kg}$.`], risposta: { tipo: 'numero', valore: 343, unita: 'N' }, soluzione: [R`$P = 35\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 343\,\text{N}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un carrello di 2 kg, fermo, è spinto da una forza risultante di 7 N per 4 s. Che velocità raggiunge?`, suggerimenti: [R`Prima l'accelerazione, con il secondo principio.`, R`Poi $v = a \cdot t$, partendo da fermo.`], risposta: { tipo: 'numero', valore: 14, unita: 'm/s' }, soluzione: [R`$a = \dfrac{7\,\text{N}}{2\,\text{kg}} = 3{,}5\,\text{m/s}^2$.`, R`$v = 3{,}5\,\text{m/s}^2 \cdot 4\,\text{s} = 14\,\text{m/s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Un motorino con il pilota ha massa 150 kg. Va a 12 m/s e si ferma in 4 s. Quanto vale, in modulo, la forza frenante?`, suggerimenti: [R`Prima l'accelerazione: quanti m/s perde ogni secondo?`, R`Poi $F = m \cdot a$.`], risposta: { tipo: 'numero', valore: 450, unita: 'N' }, soluzione: [R`$a = \dfrac{12\,\text{m/s}}{4\,\text{s}} = 3\,\text{m/s}^2$ in modulo.`, R`$F = 150\,\text{kg} \cdot 3\,\text{m/s}^2 = 450\,\text{N}$, all'indietro.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una ragazza spinge un muro con una forza di 80 N. Con che forza il muro spinge lei?`, suggerimenti: [R`Pensa al terzo principio.`], risposta: { tipo: 'numero', valore: 80, unita: 'N' }, soluzione: [R`Per il terzo principio il muro spinge la ragazza con $80\,\text{N}$, nel verso opposto.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Due pattinatori fermi si spingono. A ha massa 48 kg e parte con un'accelerazione di $0{,}5\,\text{m/s}^2$. B ha massa 40 kg. Quanto vale l'accelerazione di B?`, suggerimenti: [R`Calcola la forza che ha ricevuto A.`, R`Per il terzo principio B riceve una forza uguale.`], risposta: { tipo: 'numero', valore: 0.6, unita: 'm/s²' }, soluzione: [R`Forza su A: $48\,\text{kg} \cdot 0{,}5\,\text{m/s}^2 = 24\,\text{N}$.`, R`B riceve $24\,\text{N}$: $a_B = \dfrac{24\,\text{N}}{40\,\text{kg}} = 0{,}6\,\text{m/s}^2$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Un ragazzo di 40 kg è su una bilancia in ascensore. L'ascensore parte verso l'alto con $2{,}2\,\text{m/s}^2$. Quanti newton segna la bilancia?`, suggerimenti: [R`Peso apparente: $N = m \cdot (g + a)$, con $a$ positiva verso l'alto.`], risposta: { tipo: 'numero', valore: 480, unita: 'N' }, soluzione: [R`$N = 40\,\text{kg} \cdot (9{,}8 + 2{,}2)\,\text{m/s}^2 = 40 \cdot 12\,\text{N} = 480\,\text{N}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Una ragazza di 52 kg è su una bilancia in ascensore. L'ascensore parte verso il basso con $2{,}8\,\text{m/s}^2$. Quanti newton segna la bilancia?`, suggerimenti: [R`L'accelerazione punta in giù: con il verso positivo in alto è negativa.`, R`$N = m \cdot (g + a)$.`], risposta: { tipo: 'numero', valore: 364, unita: 'N' }, soluzione: [R`$a = -2{,}8\,\text{m/s}^2$.`, R`$N = 52\,\text{kg} \cdot (9{,}8 - 2{,}8)\,\text{m/s}^2 = 52 \cdot 7\,\text{N} = 364\,\text{N}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un uomo di 55 kg è su una bilancia in un ascensore che sale a velocità costante. Quanti newton segna la bilancia?`, suggerimenti: [R`Velocità costante: quanto vale l'accelerazione?`], risposta: { tipo: 'numero', valore: 539, unita: 'N' }, soluzione: [R`Con velocità costante $a = 0$, quindi $N = m \cdot g = 55\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 539\,\text{N}$: il suo peso.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Un pacco di 12 kg è appoggiato su una bilancia, dentro un montacarichi che cade liberamente. Quanti newton segna la bilancia?`, suggerimenti: [R`In caduta libera $a = -g$.`], risposta: { tipo: 'numero', valore: 0, unita: 'N' }, soluzione: [R`$N = m \cdot (g + a) = 12\,\text{kg} \cdot (9{,}8 - 9{,}8)\,\text{m/s}^2 = 0$.`, R`Il peso del pacco c'è ancora, circa 118 N: è la bilancia che cade con lui e non lo spinge.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una nave va a 9 m/s. Un marinaio cammina sul ponte verso poppa, cioè all'indietro, a 2 m/s. Quanto vale la sua velocità per chi lo guarda da riva?`, suggerimenti: [R`Le due velocità hanno versi opposti.`], risposta: { tipo: 'numero', valore: 7, unita: 'm/s' }, soluzione: [R`$u = v + u' = 9\,\text{m/s} + (-2\,\text{m/s}) = 7\,\text{m/s}$, nel verso della nave.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una nave va a 3 m/s lungo l'asse x della riva; all'istante zero le origini coincidono. All'istante $t = 5\,\text{s}$ un gabbiano posato sul ponte è in $x = 22\,\text{m}$ per chi sta a riva. Quanto vale la sua posizione $x'$ sulla nave?`, suggerimenti: [R`Trasformazione di Galileo: $x' = x - v \cdot t$.`], risposta: { tipo: 'numero', valore: 7, unita: 'm' }, soluzione: [R`$x' = 22\,\text{m} - 3\,\text{m/s} \cdot 5\,\text{s} = 22\,\text{m} - 15\,\text{m} = 7\,\text{m}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un autobus frena con un'accelerazione di modulo $3\,\text{m/s}^2$. Quanto vale la forza apparente su un passeggero di 65 kg, per chi sta sull'autobus?`, suggerimenti: [R`$F_{\text{app}} = m \cdot a_{\text{sist}}$ in modulo, opposta all'accelerazione dell'autobus.`], risposta: { tipo: 'numero', valore: 195, unita: 'N' }, soluzione: [R`$F_{\text{app}} = 65\,\text{kg} \cdot 3\,\text{m/s}^2 = 195\,\text{N}$.`, R`L'autobus accelera all'indietro, quindi la forza apparente punta in avanti.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`Una cassa di 10 kg è spinta sul pavimento con 47 N. L'attrito dinamico vale 15 N. Quanto vale l'accelerazione della cassa?`, suggerimenti: [R`Risultante: spinta meno attrito.`], risposta: { tipo: 'numero', valore: 3.2, unita: 'm/s²' }, soluzione: [R`$R = 47\,\text{N} - 15\,\text{N} = 32\,\text{N}$.`, R`$a = \dfrac{32\,\text{N}}{10\,\text{kg}} = 3{,}2\,\text{m/s}^2$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un disco scivola a 3 m/s su una pista ideale, senza attrito e senza aria. Quale forza orizzontale serve per tenerlo a 3 m/s?`, suggerimenti: [R`Che cosa dice il primo principio di un corpo a velocità costante?`], risposta: { tipo: 'numero', valore: 0, unita: 'N' }, soluzione: [R`Nessuna: $0\,\text{N}$. Per il primo principio, senza forze il disco continua da solo a 3 m/s.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un'auto di 1200 kg passa da ferma a 90 km/h in 12,5 s, con accelerazione costante. Quanto vale la forza risultante?`, suggerimenti: [R`Porta la velocità in m/s.`, R`Poi $a = \dfrac{\Delta v}{\Delta t}$ e $F = m \cdot a$.`], risposta: { tipo: 'numero', valore: 2400, unita: 'N' }, soluzione: [R`$v = \dfrac{90}{3{,}6}\,\text{m/s} = 25\,\text{m/s}$.`, R`$a = \dfrac{25\,\text{m/s}}{12{,}5\,\text{s}} = 2\,\text{m/s}^2$.`, R`$F = 1200\,\text{kg} \cdot 2\,\text{m/s}^2 = 2400\,\text{N}$.`] },
    { id: 'es-02', difficolta: 2, testo: R`Un ciclista con la bici ha massa 85 kg e va a 12 m/s. Frena con una forza costante di 255 N. Quanti metri percorre prima di fermarsi?`, suggerimenti: [R`Dal secondo principio trova la decelerazione.`, R`Il tempo non serve: $\Delta s = \dfrac{v_0^2}{2 \cdot a}$.`], risposta: { tipo: 'numero', valore: 24, unita: 'm' }, soluzione: [R`$a = \dfrac{255\,\text{N}}{85\,\text{kg}} = 3\,\text{m/s}^2$ in modulo.`, R`$\Delta s = \dfrac{(12\,\text{m/s})^2}{2 \cdot 3\,\text{m/s}^2} = \dfrac{144}{6}\,\text{m} = 24\,\text{m}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Su un disco di 10 kg, sul ghiaccio senza attrito, agiscono due forze orizzontali perpendicolari: 20 N e 21 N. Quanto vale l'accelerazione?`, suggerimenti: [R`La risultante di due forze perpendicolari si trova con Pitagora.`], risposta: { tipo: 'numero', valore: 2.9, unita: 'm/s²' }, soluzione: [R`$R = \sqrt{20^2 + 21^2}\,\text{N} = \sqrt{841}\,\text{N} = 29\,\text{N}$.`, R`$a = \dfrac{29\,\text{N}}{10\,\text{kg}} = 2{,}9\,\text{m/s}^2$, nella direzione della risultante.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un ragazzo di 65 kg in ascensore legge sulla bilancia 572 N. Quanto vale l'accelerazione dell'ascensore? Prendi positivo il verso in alto e scrivila con il segno.`, suggerimenti: [R`$N = m \cdot (g + a)$: ricava $a$.`, R`La bilancia segna meno del peso: aspettati un segno meno.`], risposta: { tipo: 'numero', valore: -1, unita: 'm/s²', tolleranza: 0.05 }, soluzione: [R`$g + a = \dfrac{N}{m} = \dfrac{572\,\text{N}}{65\,\text{kg}} = 8{,}8\,\text{m/s}^2$.`, R`$a = 8{,}8 - 9{,}8 = -1\,\text{m/s}^2$: punta in giù.`, R`L'ascensore parte scendendo, oppure frena mentre sale: la bilancia non distingue i due casi.`] },
    { id: 'es-05', difficolta: 3, testo: R`Due blocchi sono a contatto su un pavimento senza attrito: A di 2 kg e B di 8 kg. Una forza di 40 N spinge A, che a sua volta spinge B. Quanto vale la forza che A esercita su B?`, suggerimenti: [R`I due blocchi si muovono insieme: trova prima l'accelerazione comune, con la massa totale.`, R`Poi guarda solo B: l'unica forza orizzontale su di lui è quella di A.`], risposta: { tipo: 'numero', valore: 32, unita: 'N' }, soluzione: [R`Insieme: $a = \dfrac{40\,\text{N}}{10\,\text{kg}} = 4\,\text{m/s}^2$.`, R`Su B: $F_{AB} = m_B \cdot a = 8\,\text{kg} \cdot 4\,\text{m/s}^2 = 32\,\text{N}$.`, R`Controllo su A: riceve 40 N avanti e, per il terzo principio, 32 N indietro da B. Restano $8\,\text{N} = 2\,\text{kg} \cdot 4\,\text{m/s}^2$. Torna.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una cassa di 30 kg è trascinata su un pavimento orizzontale con una corda orizzontale. Il coefficiente di attrito dinamico è $\mu_d = 0{,}4$. Che forza serve per darle un'accelerazione di $0{,}5\,\text{m/s}^2$?`, suggerimenti: [R`Calcola la forza normale e l'attrito dinamico.`, R`Secondo principio in orizzontale: $F - F_d = m \cdot a$.`], risposta: { tipo: 'numero', valore: 132.6, unita: 'N' }, soluzione: [R`$N = m \cdot g = 30 \cdot 9{,}8\,\text{N} = 294\,\text{N}$; $F_d = 0{,}4 \cdot 294\,\text{N} = 117{,}6\,\text{N}$.`, R`$F = F_d + m \cdot a = 117{,}6\,\text{N} + 30\,\text{kg} \cdot 0{,}5\,\text{m/s}^2 = 117{,}6 + 15 = 132{,}6\,\text{N}$.`] },
    { id: 'es-07', difficolta: 3, testo: R`Allo specchietto di un'auto è appeso un pupazzetto con un filo. L'auto parte con un'accelerazione di $2{,}0\,\text{m/s}^2$ e il filo si inclina all'indietro. Di quanti gradi si inclina rispetto alla verticale?`, suggerimenti: [R`Nell'auto il pupazzetto è fermo: il peso, la forza apparente e la tensione si fanno equilibrio.`, R`Il filo si allinea con la somma del peso $m \cdot g$ e della forza apparente $m \cdot a$. Quindi $\tan\theta = \dfrac{a}{g}$.`], risposta: { tipo: 'numero', valore: 11.5, unita: '°', tolleranza: 0.2 }, soluzione: [R`Nel sistema dell'auto: peso $m \cdot g$ in giù, forza apparente $m \cdot a$ all'indietro, tensione lungo il filo.`, R`Il filo deve stare lungo la somma delle prime due: $\tan\theta = \dfrac{m \cdot a}{m \cdot g} = \dfrac{2{,}0}{9{,}8} \approx 0{,}204$.`, R`$\theta \approx 11{,}5^\circ$. Da terra: la componente orizzontale della tensione è la forza vera che fa accelerare il pupazzetto con l'auto.`] },
    { id: 'es-08', difficolta: 2, testo: R`Su un treno che va dritto a 20 m/s costanti, una pallina cade da una mensola alta 1,8 m. Per chi la guarda dai binari, di quanti metri avanza in orizzontale durante la caduta?`, suggerimenti: [R`Trova il tempo di caduta: $h = \frac{1}{2} \cdot g \cdot t^2$.`, R`In orizzontale la pallina va a 20 m/s, come il treno.`], risposta: { tipo: 'numero', valore: 12.1, unita: 'm', tolleranza: 0.15 }, soluzione: [R`$t = \sqrt{\dfrac{2 \cdot 1{,}8}{9{,}8}}\,\text{s} \approx 0{,}606\,\text{s}$.`, R`Dai binari avanza di $20\,\text{m/s} \cdot 0{,}606\,\text{s} \approx 12{,}1\,\text{m}$.`, R`Sul treno invece cade dritta, ai piedi della mensola: anche la mensola è avanzata di 12,1 m.`] },
    { id: 'es-09', difficolta: 2, testo: R`Guarda il grafico delle piste. Il disco lanciato sulla moquette ha massa 0,2 kg. Quanto vale la forza d'attrito che lo frena?

[[grafico:piste]]`, suggerimenti: [R`L'accelerazione è la pendenza del grafico velocità–tempo: quanta velocità perde, e in quanto tempo?`, R`Sulla moquette il disco passa da 6 m/s a zero in 1,2 s.`], risposta: { tipo: 'numero', valore: 1, unita: 'N' }, soluzione: [R`$a = \dfrac{0 - 6\,\text{m/s}}{1{,}2\,\text{s}} = -5\,\text{m/s}^2$.`, R`L'attrito è l'unica forza orizzontale: $F = m \cdot a$, in modulo $0{,}2\,\text{kg} \cdot 5\,\text{m/s}^2 = 1\,\text{N}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Un disco scivola a velocità costante su una pista ideale, senza attrito. Quale forza orizzontale agisce su di lui?`, opzioni: [R`Una forza nel verso del moto, che lo tiene in movimento`, R`Una forza che diminuisce piano piano`, R`Nessuna`, R`Una forza uguale alla massa per la velocità`], corretta: 2, spiegazione: R`Per il primo principio un corpo con risultante zero va dritto a velocità costante: non serve nessuna forza per mantenere il moto. Una forza che cala lo farebbe accelerare, e massa per velocità non è una forza.` },
    { id: 'q-02', domanda: R`Che cos'è un sistema di riferimento inerziale?`, opzioni: [R`Un sistema in cui vale il principio d'inerzia`, R`Un sistema che deve essere fermo`, R`Un sistema in cui non agiscono forze`, R`Un sistema che ruota a velocità costante`], corretta: 0, spiegazione: R`È un sistema in cui vale il primo principio. Può anche muoversi, purché di moto rettilineo uniforme. Le forze ci sono eccome; un sistema che ruota invece non è inerziale.` },
    { id: 'q-03', domanda: R`Sei nella stiva di una nave che va dritta a velocità costante, e lasci cadere una moneta. Dove cade?`, opzioni: [R`Un po' verso poppa, perché la nave le scappa avanti`, R`Un po' verso prua`, R`Dipende dalla velocità della nave`, R`Esattamente sotto il punto da cui l'hai lasciata`], corretta: 3, spiegazione: R`La nave è un sistema inerziale: la moneta ha già la velocità della nave e la conserva. Cade come a nave ferma, qualunque sia la velocità. È il principio di relatività galileiana.` },
    { id: 'q-04', domanda: R`Una forza di 1 N è l'unica forza su un corpo di 1 kg. Che accelerazione gli dà?`, opzioni: [R`$1\,\text{m/s}$`, R`$1\,\text{m/s}^2$`, R`$9{,}8\,\text{m/s}^2$`, R`$0{,}1\,\text{m/s}^2$`], corretta: 1, spiegazione: R`È la definizione del newton: $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$. Il m/s è una velocità, e $9{,}8\,\text{m/s}^2$ è l'accelerazione di gravità, che qui non c'entra.` },
    { id: 'q-05', domanda: R`La stessa forza agisce su due corpi; il secondo ha massa tripla. Rispetto al primo, la sua accelerazione è…`, opzioni: [R`tripla`, R`un terzo`, R`uguale`, R`nove volte più piccola`], corretta: 1, spiegazione: R`Da $a = F/m$, a parità di forza l'accelerazione è inversamente proporzionale alla massa: massa tripla, accelerazione un terzo. Non c'è nessun quadrato.` },
    { id: 'q-06', domanda: R`Un'auto va avanti e sta frenando. Dove punta la sua accelerazione?`, opzioni: [R`In avanti, come la velocità`, R`Verso il basso`, R`Da nessuna parte: rallentando non ha accelerazione`, R`Indietro, come la risultante delle forze`], corretta: 3, spiegazione: R`L'accelerazione ha il verso della risultante, che durante la frenata punta indietro. Anche rallentare è accelerare, nel verso opposto al moto. La velocità può puntare dalla parte opposta.` },
    { id: 'q-07', domanda: R`Un cavallo tira un carretto, e il carretto tira il cavallo con una forza uguale e opposta. Come fanno a partire?`, opzioni: [R`Le due forze agiscono su corpi diversi: ciascuno si muove per le forze che riceve`, R`Il cavallo tira un po' più forte di quanto il carretto tiri lui`, R`La reazione arriva un istante dopo l'azione`, R`Il terzo principio non vale per i corpi in movimento`], corretta: 0, spiegazione: R`Azione e reazione sono sempre uguali, simultanee, e valgono anche in moto. Ma una agisce sul carretto e l'altra sul cavallo. Il cavallo parte perché il terreno lo spinge avanti più di quanto il carretto lo tiri indietro.` },
    { id: 'q-08', domanda: R`Una mela è appesa al ramo. Qual è la reazione del suo peso?`, opzioni: [R`La forza del ramo che la regge verso l'alto`, R`Nessuna: il peso è una forza a distanza`, R`La forza con cui la mela attira la Terra`, R`La forza centrifuga dovuta alla rotazione della Terra`], corretta: 2, spiegazione: R`Il peso è la forza della Terra sulla mela; la reazione è la forza della mela sulla Terra. La forza del ramo agisce sulla mela, quindi non può essere la reazione del peso. Anche le forze a distanza hanno la loro reazione.` },
    { id: 'q-09', domanda: R`In un ascensore che sale a velocità costante, la bilancia segna…`, opzioni: [R`più del peso`, R`meno del peso`, R`zero`, R`il peso`], corretta: 3, spiegazione: R`Velocità costante vuol dire $a = 0$, quindi $N = m \cdot g$. Conta l'accelerazione, non il fatto che l'ascensore si muova verso l'alto.` },
    { id: 'q-10', domanda: R`Un ascensore fermo parte verso il basso. Mentre prende velocità, la bilancia segna…`, opzioni: [R`più del peso`, R`meno del peso`, R`zero`, R`il peso`], corretta: 1, spiegazione: R`Partendo verso il basso l'accelerazione punta in giù: $a < 0$ e $N = m \cdot (g + a)$ è minore del peso. Segnerebbe zero solo in caduta libera.` },
    { id: 'q-11', domanda: R`In caduta libera una bilancia sotto i piedi segna zero. Che cosa vuol dire?`, opzioni: [R`Che la bilancia non ti spinge più, ma il peso c'è ancora`, R`Che il peso è diventato zero`, R`Che lì la gravità non agisce`, R`Che la massa è diventata zero`], corretta: 0, spiegazione: R`La bilancia cade insieme a te e non ti spinge: il peso apparente è nullo. Il peso vero resta $m \cdot g$, ed è proprio lui a farti cadere. La massa non cambia mai.` },
    { id: 'q-12', domanda: R`Sulla giostra che gira ti senti spinto verso l'esterno. Chi esercita questa forza?`, opzioni: [R`Il sedile`, R`L'aria`, R`Nessuno: è una forza apparente, del sistema che gira`, R`La Terra`], corretta: 2, spiegazione: R`La centrifuga è una forza apparente: compare solo per chi gira con la giostra, e nessun corpo la esercita. Il sedile ti spinge verso il centro, non verso l'esterno. L'aria e la Terra non c'entrano.` },
    { id: 'q-13', domanda: R`Un treno frena e una valigia sul pavimento liscio scivola in avanti. Visto dal binario, perché?`, opzioni: [R`Una forza la spinge in avanti`, R`Continua alla velocità di prima, mentre il treno rallenta`, R`Il treno la tira in avanti`, R`L'aria del vagone la spinge`], corretta: 1, spiegazione: R`Dal binario, sistema inerziale, nessuna forza spinge la valigia: per inerzia conserva la sua velocità. È il treno che rallenta sotto di lei. La spinta in avanti esiste solo per chi sta sul treno, come forza apparente.` },
    { id: 'q-14', domanda: R`Nel diagramma di corpo libero di un corpo, che cosa si disegna?`, opzioni: [R`Tutte le forze in gioco, anche quelle che il corpo esercita sugli altri`, R`Solo il peso e la forza normale`, R`La velocità e l'accelerazione`, R`Solo le forze che gli altri corpi esercitano su di lui`], corretta: 3, spiegazione: R`Nel secondo principio di un corpo entrano solo le forze che **riceve**. Le forze che lui esercita agiscono su altri corpi. Peso e normale da soli non bastano quasi mai, e velocità e accelerazione non sono forze.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`La forza non serve a mantenere il moto. Se un corpo va a velocità costante, la risultante è zero, anche se si muove velocissimo.` },
    { tipo: 'errore', testo: R`Azione e reazione non si annullano mai: agiscono su corpi diversi. Prima di sommare due forze, chiediti su quale corpo agisce ciascuna.` },
    { tipo: 'errore', testo: R`L'accelerazione segue la risultante, non la velocità. Un'auto che frena va avanti, ma accelera all'indietro.` },
    { tipo: 'trucco', testo: R`In ascensore guarda solo l'accelerazione. In su: la bilancia segna di più. In giù: di meno. Velocità costante: il peso esatto.` },
    { tipo: 'trucco', testo: R`Controllo veloce delle unità: un newton diviso un chilogrammo fa un $\text{m/s}^2$. Se dividi una forza per una massa e non ottieni un'accelerazione, c'è un errore.` },
    { tipo: 'metodo', testo: R`Prima di ogni conto disegna il diagramma di corpo libero: il corpo da solo, con le forze che riceve. Per ognuna chiediti chi la esercita.` },
    { tipo: 'metodo', testo: R`Scegli un verso positivo e scrivi le forze con il segno. Dove il corpo non si muove, la somma delle forze lungo quell'asse è zero.` },
    { tipo: 'errore', testo: R`La centrifuga non va nei problemi risolti da terra. Si usa solo se scegli di stare nel sistema che gira, e allora va messa con il suo nome.` }
  ],
  aneddoti: [
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Farfalle e pesciolini sotto coperta', testo: R`Nel 1632 Galileo pubblicò a Firenze il *Dialogo sopra i due massimi sistemi del mondo*. Voleva difendere l'idea di Copernico: la Terra si muove. Gli avversari avevano un argomento forte. Se la Terra girasse, un sasso lasciato da una torre cadrebbe lontano dal piede, perché la torre scapperebbe via. Galileo rispose con un esperimento immaginario. Invitava il lettore a chiudersi con un amico nella stanza più grande sotto coperta di una nave. Lì dentro: mosche, farfalle, un vaso con dei pesciolini, un secchio che gocciola. A nave ferma si osserva tutto con cura. Poi la nave parte, veloce ma senza scosse. Le gocce cadono nello stesso punto, i pesci nuotano allo stesso modo, le farfalle volano uguali. L'anno dopo quel libro gli costò il processo e la condanna.`, legame: R`È il principio di relatività galileiana: da dentro nessun esperimento distingue la quiete dal moto rettilineo uniforme.` },
    { fisico: 'Isaac Newton', anni: '1643–1727', titolo: 'Il libro pagato dall\'amico Halley', testo: R`Nell'agosto del 1684 l'astronomo Edmond Halley andò a Cambridge a trovare Isaac Newton. Gli chiese che orbita farebbe un pianeta attirato dal Sole con una forza inversamente proporzionale al quadrato della distanza. Newton rispose subito: un'ellisse. Diceva di averlo già calcolato, ma non trovò i fogli. Promise di rifare i conti. Da quella promessa nacquero i *Philosophiae Naturalis Principia Mathematica*, usciti nel 1687. All'inizio del libro ci sono le tre leggi del moto. La stampa toccava alla Royal Society, che però aveva speso i suoi fondi per un costoso libro sui pesci. Così pagò tutto Halley, di tasca sua. Più tardi la Society gli diede, al posto dello stipendio, copie di quel libro sui pesci.`, legame: R`Nei *Principia* compaiono per la prima volta, insieme, i tre principi della dinamica.` },
    { fisico: 'Léon Foucault', anni: '1819–1868', titolo: 'Il pendolo sotto la cupola del Panthéon', testo: R`Nel 1851 il fisico francese Léon Foucault mostrò che la Terra gira, senza guardare il cielo. Sotto la cupola del Panthéon, a Parigi, appese una sfera di circa 28 kg a un filo lungo 67 metri. Il pendolo oscillava lentissimo: un'andata e ritorno in circa 16 secondi. Sotto la sfera, una punta sfiorava un anello di sabbia e lasciava un segno a ogni passaggio. Passaggio dopo passaggio, i segni si spostavano. Il piano dell'oscillazione girava di circa 11 gradi ogni ora. Nessuna forza fa girare il pendolo: è il pavimento che gli gira sotto, insieme alla Terra. A chi sta sul pavimento sembra invece che qualcosa lo devii.`, legame: R`La Terra che gira non è un sistema inerziale perfetto: il pendolo di Foucault ne mostra l'effetto.` },
    { fisico: 'Albert Einstein', anni: '1879–1955', titolo: 'Il pensiero più felice della sua vita', testo: R`Nel 1907 Albert Einstein lavorava all'ufficio brevetti di Berna. Un giorno, seduto alla scrivania, ebbe un'idea che più tardi chiamò «il pensiero più felice della mia vita». Una persona che cade liberamente da un tetto non sente il proprio peso. Se lasciasse andare un oggetto, lo vedrebbe restare fermo accanto a sé. Per qualche istante, per lei, è come se la gravità non ci fosse. Einstein ne trasse una conclusione profonda: dall'interno, cadere liberamente e stare lontano da ogni gravità non si distinguono. Da qui, dopo otto anni di lavoro, nacque la relatività generale, nel 1915. Il racconto viene da un suo scritto del 1920, rimasto a lungo inedito.`, legame: R`È la bilancia che in caduta libera segna zero: il peso apparente è nullo, anche se la gravità c'è.` }
  ]
});
})();
