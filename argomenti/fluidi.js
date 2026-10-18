/* Quanto — I fluidi in equilibrio (primo anno): pressione, legge di Stevino, vasi comunicanti, principio di Pascal,
   spinta di Archimede e galleggiamento, pressione atmosferica. Contratto in SCHEMA.md, modello cinematica.js.
   Colori come nei video: pressione viola (colore 4), forze arancio (2), acqua azzurra (1).
   Verifica: node strumenti/verifica-argomento.js argomenti/fluidi.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'fluidi',
  titolo: 'I fluidi in equilibrio',
  introduzione: R`Un **fluido** è una sostanza che scorre e prende la forma del recipiente: un liquido o un gas. Qui studiamo i fluidi **fermi**, in equilibrio. La grandezza chiave è la **pressione**: dice quanto una forza è concentrata su una superficie.

Con la pressione si spiegano tante cose di tutti i giorni. Perché un chiodo si pianta di punta. Perché in fondo alla piscina fanno male le orecchie. Come fa un cric a sollevare un'auto. Perché una nave d'acciaio galleggia e un sasso affonda. E perché il meteo parla di ettopascal.

Serve sapere che cos'è una forza, che il peso è $P = m \cdot g$ e che la densità è $d = \dfrac{m}{V}$.`,
  inBreve: [
    R`La **pressione** è la forza perpendicolare divisa la superficie: $p = \dfrac{F}{S}$, in pascal ($1\,\text{Pa} = 1\,\text{N/m}^2$). Stessa forza su meno superficie vuol dire più pressione.`,
    R`In un liquido fermo la pressione cresce con la profondità: $p = p_0 + d \cdot g \cdot h$ (legge di Stevino). In acqua, circa un'atmosfera in più ogni 10 m.`,
    R`Una variazione di pressione si trasmette uguale in tutto il liquido (principio di Pascal). Nel torchio idraulico le forze stanno come le superfici.`,
    R`Ogni corpo immerso riceve una spinta verso l'alto pari al peso del fluido spostato: $F_A = d \cdot V \cdot g$ (principio di Archimede). Affonda chi è più denso del liquido.`,
    R`L'aria preme su di noi con circa $101\,300\,\text{Pa}$: tanto quanto una colonna di mercurio alta 76 cm (Torricelli).`
  ],
  sezioni: [
    {
      id: 'pressione',
      titolo: 'La pressione',
      testo: R`Premi il palmo della mano su un palloncino: non succede niente. Premi con la stessa forza la punta di uno spillo, e il palloncino scoppia. La forza è la stessa. Cambia la superficie su cui si distribuisce.

[[video:fluidi/pressione]]

>* La **pressione** è il rapporto fra la forza perpendicolare a una superficie e l'area della superficie: $p = \dfrac{F}{S}$. Nel SI si misura in **pascal**: $1\,\text{Pa} = 1\,\text{N/m}^2$.

Esempio. Una cassa pesa 360 N e appoggia su una base di 0,24 m². Quanto preme sul pavimento?

~ p = \dfrac{F}{S} :: la forza che preme è il peso della cassa
~ p = \dfrac{360\,\text{N}}{0{,}24\,\text{m}^2} :: metto i numeri con le unità
~ p = \evidb{1500\,\text{Pa}} :: un newton su un metro quadrato è un pascal

A parità di forza, la pressione è **inversamente proporzionale** alla superficie. Superficie doppia, pressione metà. Per questo chiodi e spilli hanno la punta, e le lame si affilano. Per lo stesso motivo i trattori hanno ruote larghe, e sulla neve si usano gli sci.

[[grafico:pressione]]

Il pascal è una pressione piccola: un foglio di carta appoggiato sul tavolo preme meno di 1 Pa. Per questo si usano anche altre unità. Il chilopascal vale $1\,\text{kPa} = 1000\,\text{Pa}$. Nei bollettini meteo c'è l'ettopascal, $1\,\text{hPa} = 100\,\text{Pa}$. Per le gomme dell'auto si usa il bar, $1\,\text{bar} = 100\,000\,\text{Pa}$.

>! Nella formula la superficie va in metri quadrati. Un quadratino di 1 cm di lato è un decimillesimo di metro quadrato: $1\,\text{cm}^2 = 0{,}0001\,\text{m}^2$.

Conta solo la forza **perpendicolare** alla superficie. Se una forza è inclinata, la parte che scivola lungo la superficie non preme. La pressione non ha una direzione: è una grandezza **scalare**. Diventa una forza quando agisce su una superficie, e allora spinge perpendicolare a quella superficie.

?? Una persona sta in piedi, poi si alza sulla punta di un piede solo. Che cosa succede alla pressione sul pavimento?
[ ] resta uguale, perché il peso non cambia
[x] aumenta, perché la superficie è più piccola
[ ] diminuisce, perché tocca il pavimento in meno punti
=> Il peso, cioè la forza, resta lo stesso. La superficie di appoggio diventa molto più piccola, quindi $p = F / S$ cresce.`
    },
    {
      id: 'stevino',
      titolo: 'La pressione nei liquidi: la legge di Stevino',
      testo: R`Chi si tuffa in fondo a una piscina sente premere sulle orecchie. Più si scende, più la spinta cresce. Sopra di noi c'è sempre più acqua, e l'acqua pesa.

Immagina una colonna d'acqua verticale, alta $h$, con la base di area $S$. Il suo peso preme sulla base. Calcoliamo la pressione che produce.

~ m = d \cdot V = d \cdot S \cdot h :: la massa della colonna: densità per volume
~ P = m \cdot g = d \cdot S \cdot h \cdot g :: il peso della colonna
~ p = \dfrac{P}{S} = \dfrac{d \cdot S \cdot h \cdot g}{S} :: la pressione è il peso diviso la base
~ p = \evidb{d \cdot g \cdot h} :: l'area si semplifica: conta solo l'altezza

Sopra la superficie dell'acqua c'è anche l'aria, che preme con la pressione atmosferica $p_0$.

[[video:fluidi/stevino]]

>* **Legge di Stevino**: in un liquido fermo, alla profondità $h$, la pressione è $p = p_0 + d \cdot g \cdot h$. Qui $d$ è la densità del liquido, e $h$ si misura dalla superficie libera.

Esempio. In un lago, a 6 m di profondità, l'acqua aggiunge $d \cdot g \cdot h = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 6\,\text{m} = 58\,800\,\text{Pa}$. Con l'aria sopra, $p = 101\,300\,\text{Pa} + 58\,800\,\text{Pa} = 160\,100\,\text{Pa}$.

La pressione cresce in modo lineare con la profondità: nel grafico è una retta. Parte da $p_0$ e sale tanto più in fretta quanto più il liquido è denso. In acqua, ogni 10 m si aggiunge circa un'atmosfera.

[[grafico:stevino]]

In un punto del liquido la pressione è la stessa **in tutte le direzioni**: spinge in giù, in su, di lato. Su una parete spinge sempre perpendicolare. Una bottiglia bucata a varie altezze lo mostra. I getti escono di lato, e quelli in basso sono più forti.

La legge ha una conseguenza sorprendente, il **paradosso idrostatico**. La pressione sul fondo dipende solo dalla profondità. Non dipende dalla forma del recipiente, né da quanta acqua contiene. Sembra strano, perché un recipiente largo contiene molta più acqua.

>! In $p = p_0 + d \cdot g \cdot h$, $h$ è la profondità sotto la superficie libera, non l'altezza dal fondo. E $d$ è la densità del liquido, non quella del corpo immerso.

?? Una diga trattiene un lago lungo 10 km e profondo 40 m. Un'altra diga trattiene un laghetto lungo 100 m, profondo anche lui 40 m. Alla base di quale diga la pressione è più grande?
[ ] della prima, che regge più acqua
[ ] della seconda, che è più piccola
[x] è la stessa per le due
=> La pressione dipende solo dalla profondità: 40 m in tutti e due i casi. La quantità d'acqua del lago non conta.`
    },
    {
      id: 'vasi-comunicanti',
      titolo: 'I vasi comunicanti',
      testo: R`Riempi d'acqua un annaffiatoio. L'acqua nel beccuccio sale fino allo stesso livello che ha nel recipiente, né più né meno. Annaffiatoio e beccuccio sono **vasi comunicanti**: recipienti collegati dal fondo.

>* Vasi comunicanti con lo stesso liquido fermo: la superficie libera arriva **alla stessa altezza** in tutti. La forma dei vasi non conta.

Il perché viene da Stevino. Nel tubo che collega i vasi, alla stessa quota, la pressione deve essere la stessa da una parte e dall'altra. Se un livello fosse più alto, sotto di lui ci sarebbe più pressione. Il liquido allora scorrerebbe verso l'altro vaso, finché i livelli si pareggiano.

[[grafico:vasi]]

Le applicazioni sono tante. I muratori usano come **livella** un tubo trasparente pieno d'acqua. I due capi segnano due punti alla stessa altezza, anche lontani. L'acquedotto porta l'acqua in un serbatoio in alto, spesso una torre. Da lì l'acqua sale nelle case, fino quasi al livello del serbatoio.

Con due liquidi che non si mescolano, i livelli non sono più uguali. Versiamo mercurio in un tubo a U, poi acqua in un ramo. L'acqua, meno densa, sta sopra il mercurio. Si guarda la superficie di separazione fra i due liquidi. Alla sua quota, nei due rami, la pressione è la stessa. Chiamiamo 1 l'acqua ($d_1 = 1000\,\text{kg/m}^3$, colonna $h_1 = 27{,}2\,\text{cm}$) e 2 il mercurio ($d_2 = 13\,600\,\text{kg/m}^3$).

~ d_1 \cdot g \cdot h_1 = d_2 \cdot g \cdot h_2 :: stessa pressione alla quota della separazione ($p_0$ c'è da tutte e due le parti e si toglie)
~ d_1 \cdot h_1 = d_2 \cdot h_2 :: divido per $g$
~ h_2 = \dfrac{1000\,\text{kg/m}^3 \cdot 27{,}2\,\text{cm}}{13\,600\,\text{kg/m}^3} :: ricavo l'altezza del mercurio sopra la separazione
~ h_2 = \evidb{2\,\text{cm}} :: il mercurio è 13,6 volte più denso: la sua colonna è 13,6 volte più bassa

>! Le altezze $h_1$ e $h_2$ si misurano dalla superficie di separazione, non dal fondo del tubo.

?? Un annaffiatoio ha la bocca del beccuccio più in basso del bordo del recipiente. Fin dove si può riempire, senza che l'acqua esca dal beccuccio?
[ ] fino al bordo del recipiente
[x] fino all'altezza della bocca del beccuccio
[ ] fino a metà del recipiente
=> Recipiente e beccuccio sono vasi comunicanti: l'acqua ha lo stesso livello in tutti e due. Oltre la bocca del beccuccio, l'acqua esce.`
    },
    {
      id: 'pascal',
      titolo: 'Il principio di Pascal e il torchio idraulico',
      testo: R`Riempi d'acqua un palloncino e premilo con un dito. Non si gonfia solo lì vicino: si tende tutto. La spinta del dito arriva in ogni punto dell'acqua.

[[video:fluidi/pascal]]

>* **Principio di Pascal**: in un liquido fermo e chiuso, una variazione di pressione si trasmette uguale in tutti i punti del liquido.

Il **torchio idraulico** sfrutta questo principio. Due cilindri pieni d'olio sono collegati da un tubo. Ognuno è chiuso da uno stantuffo: uno piccolo, di superficie $S_1$, e uno grande, di superficie $S_2$. Si preme il piccolo con una forza $F_1$, e la pressione aumenta di $F_1 / S_1$. Lo stesso aumento arriva sotto lo stantuffo grande, che spinge in su con una forza $F_2$.

Esempio. Lo stantuffo piccolo ha $10\,\text{cm}^2$, il grande $500\,\text{cm}^2$, e si preme il piccolo con 120 N.

~ \dfrac{F_1}{S_1} = \dfrac{F_2}{S_2} :: lo stesso aumento di pressione sotto i due stantuffi
~ F_2 = F_1 \cdot \dfrac{S_2}{S_1} :: ricavo la forza sullo stantuffo grande
~ F_2 = 120\,\text{N} \cdot \dfrac{500\,\text{cm}^2}{10\,\text{cm}^2} :: le superfici restano in cm²: conta solo il loro rapporto
~ F_2 = \evidb{6000\,\text{N}} :: la forza diventa 50 volte più grande

Le forze stanno come le superfici: $\dfrac{F_2}{F_1} = \dfrac{S_2}{S_1}$. Premendo con 120 N, si reggono più di 600 kg.

[[grafico:torchio]]

Niente però si ottiene gratis. L'olio che lascia il cilindro piccolo entra in quello grande: il volume spostato è lo stesso.

$$S_1 \cdot x_1 = S_2 \cdot x_2$$

Qui $x_1$ è quanto scende lo stantuffo piccolo, $x_2$ quanto sale il grande. Con una superficie 50 volte più grande, il grande sale 50 volte meno. Si guadagna in forza quello che si perde in spostamento. Per questo un cric si pompa tante volte.

I torchi idraulici sono dappertutto: il sollevatore dell'officina, i freni dell'auto, la poltrona del dentista, il braccio di una ruspa.

>! Il torchio moltiplica la forza, non la pressione. La pressione aumenta della stessa quantità sotto i due stantuffi.

?? In un torchio lo stantuffo grande ha una superficie 8 volte quella del piccolo. Premi il piccolo con 50 N. Con che forza spinge il grande?
[ ] 50 N, perché la pressione è la stessa
[ ] 6,25 N
[x] 400 N
=> Le forze stanno come le superfici: $F_2 = 50\,\text{N} \cdot 8 = 400\,\text{N}$. È la pressione, non la forza, a essere uguale sotto i due stantuffi.`
    },
    {
      id: 'archimede',
      titolo: 'La spinta di Archimede',
      testo: R`In piscina sollevi facilmente un amico che fuori dall'acqua non riusciresti ad alzare. Un sasso tirato su dal fondo di un fiume sembra leggero, finché resta sott'acqua. L'acqua spinge verso l'alto ogni corpo immerso.

La spinta nasce dalla legge di Stevino. Pensa a un cubo immerso, con le facce di area $S$. La faccia di sotto è più in profondità di quella di sopra, quindi riceve una pressione più grande. Le spinte sulle facce laterali si annullano a coppie. Resta una forza verso l'alto. Chiamiamo la spinta $F_A$, con la A di Archimede.

~ F_A = p_2 \cdot S - p_1 \cdot S :: la spinta sulla faccia di sotto meno quella sulla faccia di sopra
~ F_A = d \cdot g \cdot (h_2 - h_1) \cdot S :: con Stevino: $p_0$ si toglie, resta la differenza di profondità
~ F_A = \evidb{d \cdot V \cdot g} :: $(h_2 - h_1) \cdot S$ è il volume $V$ del cubo

Il prodotto $d \cdot V$ è la massa del liquido che starebbe al posto del cubo. Moltiplicato per $g$, dà il suo peso. Il prodotto $d \cdot g$ è il **peso specifico** del liquido: per l'acqua, $9800\,\text{N/m}^3$. Ogni litro d'acqua spostato vale 9,8 N di spinta.

[[video:fluidi/archimede]]

>* **Principio di Archimede**: un corpo immerso in un fluido riceve una spinta verso l'alto uguale al peso del fluido spostato. La spinta è $F_A = d \cdot V \cdot g$, dove $d$ è la densità del **fluido** e $V$ il volume **immerso** del corpo.

Esempio. Un sasso di 2 dm³ tutto sott'acqua sposta 2 dm³ d'acqua, cioè 0,002 m³. La spinta è $F_A = 1000\,\text{kg/m}^3 \cdot 0{,}002\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 19{,}6\,\text{N}$.

Con un dinamometro la spinta si misura. Si appende il corpo in aria e si legge il peso $P$. Poi lo si immerge, e il dinamometro segna di meno. La differenza è la spinta. Quello che segna sott'acqua si chiama **peso apparente**: $P_{\text{app}} = P - F_A$.

Nel grafico una barretta di pietra scende piano nell'acqua, appesa al dinamometro. La spinta cresce finché la barretta, lunga 20 cm, entra tutta. Poi resta costante, anche se scende ancora.

[[grafico:spinta]]

>! La spinta non dipende dal peso del corpo, né dalla profondità a cui si trova. Dipende solo dal volume immerso e dalla densità del fluido.

?? Lo stesso sasso viene immerso tutto, prima in acqua dolce e poi in acqua di mare. Dove riceve la spinta più grande?
[ ] in acqua dolce
[x] in acqua di mare
[ ] è uguale, perché il sasso è lo stesso
=> Il volume immerso è lo stesso, ma l'acqua di mare è più densa. Il liquido spostato pesa di più, e la spinta è più grande.`
    },
    {
      id: 'galleggiamento',
      titolo: 'Galleggiare o affondare',
      testo: R`Una nave d'acciaio di migliaia di tonnellate galleggia. Un chiodo d'acciaio di pochi grammi va a fondo. Non conta quanto pesa un corpo, ma come il suo peso si confronta con la spinta.

Su un corpo tutto immerso agiscono due forze: il peso $P$ verso il basso e la spinta $F_A$ verso l'alto. Il volume $V$ è lo stesso per tutte e due. Chiamiamo $d_c$ la densità del corpo e $d_l$ quella del liquido. Allora $P = d_c \cdot V \cdot g$ e $F_A = d_l \cdot V \cdot g$: basta confrontare le densità.

>* Un corpo immerso **affonda** se è più denso del liquido ($d_c > d_l$). **Sale e galleggia** se è meno denso ($d_c < d_l$). Resta **sospeso** dove lo si lascia se le due densità sono uguali.

Un corpo meno denso sale finché una parte esce dall'acqua. La spinta allora diminuisce, perché il volume immerso $V_i$ è più piccolo. Il corpo si ferma quando la spinta è uguale al peso.

~ F_A = P :: galleggiando, il corpo è in equilibrio
~ d_l \cdot V_i \cdot g = d_c \cdot V \cdot g :: nella spinta entra solo il volume immerso $V_i$
~ \dfrac{V_i}{V} = \evidb{\dfrac{d_c}{d_l}} :: la frazione immersa è il rapporto fra le densità

Esempio. Una boa di plastica ha densità media $250\,\text{kg/m}^3$. In acqua resta sotto $\dfrac{250}{1000} = 0{,}25$, cioè il 25% del suo volume.

[[grafico:galleggia]]

La nave galleggia perché è cava. Lo scafo d'acciaio racchiude tanta aria. La sua **densità media**, cioè la massa totale divisa il volume totale, è minore di quella dell'acqua. Il sottomarino cambia la sua densità media. Riempie d'acqua le casse di zavorra per scendere, e le svuota con aria compressa per risalire.

Archimede vale anche nell'aria, che è un fluido. Una mongolfiera sale perché l'aria calda nel pallone è meno densa dell'aria fredda intorno.

>! «Galleggia chi è leggero» è sbagliato. Un tronco di mezza tonnellata galleggia, una moneta di pochi grammi affonda. Conta la densità, non il peso.

?? Una nave passa dal fiume al mare, dove l'acqua è più densa. Che cosa succede alla parte immersa dello scafo?
[ ] aumenta, e la nave affonda un po' di più
[x] diminuisce, e la nave si alza un poco
[ ] resta uguale, perché il peso della nave non cambia
=> La spinta deve uguagliare sempre lo stesso peso. In acqua più densa basta un volume immerso più piccolo, e la nave sale un poco.`
    },
    {
      id: 'atmosfera',
      titolo: 'La pressione atmosferica',
      testo: R`L'aria sembra non pesare niente. Eppure un metro cubo d'aria ha una massa di circa 1,2 kg. Sopra di noi c'è uno strato d'aria alto molti chilometri. Il suo peso preme su tutto quello che tocca: è la **pressione atmosferica**.

[[video:fluidi/torricelli]]

Nel 1644 Evangelista Torricelli, con l'allievo Vincenzo Viviani, la misurò con un tubo pieno di mercurio, capovolto in una bacinella. Il mercurio scende e si ferma a 76 cm sopra il livello della bacinella. Alla base della colonna, la pressione del mercurio è uguale a quella dell'aria che preme fuori.

~ p_0 = d \cdot g \cdot h :: sopra la colonna c'è il vuoto: preme solo il mercurio
~ p_0 = 13\,600 \cdot 9{,}8 \cdot 0{,}76\,\text{Pa} :: densità del mercurio in kg/m³, $g$ in m/s², altezza della colonna in metri
~ p_0 \approx \evidb{101\,300\,\text{Pa}} :: è la pressione dell'aria al livello del mare

>* La **pressione atmosferica** al livello del mare vale circa $101\,300\,\text{Pa}$. È un'**atmosfera**: $1\,\text{atm} = 760\,\text{mmHg} \approx 1013\,\text{hPa}$.

Lo strumento che la misura è il **barometro**. Il millimetro di mercurio, mmHg, è la pressione di una colonna di mercurio alta 1 mm. Con l'acqua, 13,6 volte meno densa, la colonna sarebbe alta più di 10 m.

Non ci accorgiamo di questa pressione perché dentro il corpo c'è una pressione uguale. E l'aria spinge da tutte le parti: sopra, sotto, di lato. Salendo in montagna resta meno aria sopra di noi, e la pressione diminuisce. A circa 5500 m di quota è già la metà.

>! Il vuoto non risucchia niente. Quando bevi con una cannuccia, abbassi la pressione nella bocca. È l'aria che preme sulla bibita a spingerla su per la cannuccia.

I manometri, come quello del gommista, segnano la pressione **relativa**: di quanto la pressione supera quella atmosferica. La pressione vera, quella **assoluta**, è la somma delle due.

~ p = p_0 + p_{\text{rel}} :: l'aria di fuori più quello che segna il manometro
~ p = 101\,300\,\text{Pa} + 220\,000\,\text{Pa} :: una gomma gonfiata a 2,2 bar, cioè $220\,000\,\text{Pa}$
~ p = \evidb{321\,300\,\text{Pa}} :: circa 3,2 bar: dentro la gomma ci sono più di tre atmosfere

?? Con una cannuccia lunga 12 m, aspirando con tutta la forza, si può bere l'acqua da un secchio a terra?
[ ] sì, se si aspira abbastanza forte
[x] no: l'aria regge al massimo circa 10 m d'acqua
[ ] sì, perché il vuoto tira il liquido senza limiti
=> Anche con il vuoto perfetto in bocca, l'aria spinge l'acqua solo finché $d \cdot g \cdot h = p_0$, cioè fino a circa 10,3 m.`
    }
  ],
  grafici: {
    /* stessa forza, superfici diverse: la pressione è inversamente proporzionale alla superficie */
    pressione: {
      tipo: 'piano', x: [0, 0.3], y: [0, 24], altezza: 440, passo: [0.05, 4],
      etichette: { x: 'S (m²)', y: 'p (kPa)' },
      parametri: [{ nome: 'F', min: 200, max: 1000, passo: 100, valore: 800, etichetta: 'F (N)' }],
      funzioni: [{ f: 'F/(1000*x)', dominio: ['F/20000', 0.3], colore: 4 }],
      elementi: [
        { tipo: 'punto', p: [0.05, 'F/50'], etichetta: '0,05 m²: {{F/50}} kPa', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [0.2, 'F/200'], etichetta: '0,2 m²: {{F/200}} kPa', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'testo', p: [0.29, 21], testo: 'F = {{F}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'La pressione prodotta dalla stessa forza F su superfici diverse: p = F / S, in chilopascal. Su una superficie quattro volte più grande la pressione è quattro volte più piccola. Passa il dito sul grafico per leggere i valori.'
    },
    /* la legge di Stevino: una retta che parte da p0, più ripida se il liquido è più denso */
    stevino: {
      tipo: 'piano', x: [0, 12], y: [0, 280], altezza: 500,
      etichette: { x: 'h (m)', y: 'p (kPa)' },
      parametri: [
        { nome: 'd', min: 600, max: 1400, passo: 50, valore: 1000, etichetta: 'd (kg/m³)' },
        { nome: 'h', min: 0, max: 12, passo: 0.5, valore: 7, etichetta: 'h (m)' }
      ],
      funzioni: [{ f: '101.3 + d*9.8*x/1000', colore: 4 }],
      elementi: [
        { tipo: 'orizzontale', y: 101.3, colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [0.4, 84], testo: 'p₀ ≈ 101,3 kPa: l\'aria', ancora: 'start' },
        { tipo: 'punto', p: ['h', '101.3 + d*9.8*h/1000'], colore: 4 },
        { tipo: 'testo', p: [0.4, 56], testo: 'd·g·h = {{d*9.8*h/1000|1}} kPa', ancora: 'start', colore: 4 },
        { tipo: 'testo', p: [0.4, 28], testo: 'p = {{101.3 + d*9.8*h/1000|1}} kPa', ancora: 'start', colore: 4 }
      ],
      didascalia: 'La pressione in un liquido in funzione della profondità h, in chilopascal: p = p₀ + d·g·h. La retta parte dalla pressione dell\'aria; un liquido più denso la rende più ripida. In acqua ogni 10 m aggiungono circa 98 kPa, quasi un\'atmosfera.'
    },
    /* tre vasi di forma diversa collegati dal fondo: l'acqua arriva allo stesso livello */
    vasi: {
      tipo: 'piano', x: [-1, 13.5], y: [-1.6, 7], assi: false, griglia: false,
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[0.5, 0], [10, 0], [10, 0.6], [11.733, 4.5], [10.733, 4.5], [9, 0.6], [5.6, 0.6], [6.467, 4.5], [3.933, 4.5], [4.8, 0.6], [2.5, 0.6], [2.5, 4.5], [0.5, 4.5]] },
        { tipo: 'segmento', da: [0.5, 0], a: [0.5, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [2.5, 0.6], a: [2.5, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [0.5, 0], a: [10, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [2.5, 0.6], a: [4.8, 0.6], colore: 'grigio' },
        { tipo: 'segmento', da: [5.6, 0.6], a: [9, 0.6], colore: 'grigio' },
        { tipo: 'segmento', da: [4.8, 0.6], a: [3.6, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [5.6, 0.6], a: [6.8, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [9, 0.6], a: [11.4, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [10, 0], a: [10, 0.6], colore: 'grigio' },
        { tipo: 'segmento', da: [10, 0.6], a: [12.4, 6], colore: 'grigio' },
        { tipo: 'segmento', da: [-0.6, 4.5], a: [13.2, 4.5], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [6.5, 6.5], testo: 'stesso livello' },
        { tipo: 'punto', p: [1.5, 0.3], colore: 4 },
        { tipo: 'punto', p: [5.2, 0.3], colore: 4 },
        { tipo: 'punto', p: [9.5, 0.3], colore: 4 },
        { tipo: 'testo', p: [5.2, -0.8], testo: 'alla stessa quota, la stessa pressione', colore: 4 }
      ],
      didascalia: 'Tre recipienti di forma diversa collegati dal fondo. L\'acqua si ferma allo stesso livello in tutti: alla stessa profondità la pressione è la stessa, e il liquido non ha motivo di spostarsi.'
    },
    /* il torchio idraulico: 30 N sullo stantuffo piccolo, forza k volte più grande sul grande (frecce in scala) */
    torchio: {
      tipo: 'piano', x: [-1.5, 10], y: [-1.4, 11.8], assi: false, griglia: false, altezza: 520,
      parametri: [{ nome: 'k', min: 1, max: 6, passo: 0.5, valore: 3, etichetta: 'S_2 / S_1' }],
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[0, 0], ['3 + k', 0], ['3 + k', 4], [3, 4], [3, 1], [1, 1], [1, 4], [0, 4]] },
        { tipo: 'poligono', colore: 'grigio', punti: [[0, 4], [1, 4], [1, 4.4], [0, 4.4]] },
        { tipo: 'poligono', colore: 'grigio', punti: [[3, 4], ['3 + k', 4], ['3 + k', 4.4], [3, 4.4]] },
        { tipo: 'segmento', da: [0, 0], a: [0, 5.6], colore: 'grigio' },
        { tipo: 'segmento', da: [1, 1], a: [1, 5.6], colore: 'grigio' },
        { tipo: 'segmento', da: [3, 1], a: [3, 5.6], colore: 'grigio' },
        { tipo: 'segmento', da: ['3 + k', 0], a: ['3 + k', 5.6], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: ['3 + k', 0], colore: 'grigio' },
        { tipo: 'segmento', da: [1, 1], a: [3, 1], colore: 'grigio' },
        { tipo: 'vettore', da: [0.5, 5.4], a: [0.5, 4.4], colore: 2 },
        { tipo: 'testo', p: [0.5, 6.1], testo: 'F_1 = 30 N', colore: 2 },
        { tipo: 'vettore', da: ['3 + k/2', 4.4], a: ['3 + k/2', '4.4 + k'], colore: 2 },
        { tipo: 'testo', p: ['3 + k/2', '5.1 + k'], testo: 'F_2 = {{30*k}} N', colore: 2 },
        { tipo: 'testo', p: [0.5, -0.8], testo: 'S_1' },
        { tipo: 'testo', p: ['3 + k/2', -0.8], testo: 'S_2 = {{k}}·S_1' }
      ],
      didascalia: 'Un torchio idraulico. Lo stantuffo piccolo è premuto con 30 N; la stessa pressione in più arriva sotto lo stantuffo grande, che spinge in su con una forza tante volte più grande quante volte è più grande la sua superficie. Nel disegno le larghezze fanno le veci delle superfici; frecce in scala.'
    },
    /* la barretta appesa al dinamometro che entra nell'acqua: la spinta cresce, poi resta costante */
    spinta: {
      tipo: 'piano', x: [0, 32], y: [0, 14], altezza: 460, passo: [5, 2],
      etichette: { x: 'discesa (cm)', y: 'F (N)' },
      funzioni: [
        { f: '0.245*min(x, 20)', colore: 2, etichetta: 'spinta' },
        { f: '12 - 0.245*min(x, 20)', colore: 2, tratteggio: true, etichetta: 'dinamometro' }
      ],
      elementi: [
        { tipo: 'segmento', da: [20, 0.8], a: [20, 14], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [19.4, 13], testo: 'tutta sott\'acqua', ancora: 'end' }
      ],
      didascalia: 'Una barretta di pietra di sezione 5 cm per 5 cm, lunga 20 cm, che pesa 12 N, scende in verticale nell\'acqua appesa a un dinamometro. In orizzontale, quanto è scesa la base della barretta sotto il pelo dell\'acqua. Linea piena: la spinta, che cresce finché la barretta entra tutta, fino a 4,9 N. Tratteggio: quello che segna il dinamometro, cioè il peso apparente. Passa il dito sul grafico per leggere i valori.'
    },
    /* un cubo che galleggia: sott'acqua la frazione d_c / d_l, peso e spinta uguali (frecce in scala) */
    galleggia: {
      tipo: 'piano', x: [-6, 6], y: [-6.8, 4], assi: false, griglia: false,
      parametri: [{ nome: 'dc', min: 100, max: 950, passo: 50, valore: 400, etichetta: 'd_c (kg/m³)' }],
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[-6, -6.4], [6, -6.4], [6, 0], [-6, 0]] },
        { tipo: 'poligono', colore: 'grigio', punti: [[-1.5, '-3*dc/1000'], [1.5, '-3*dc/1000'], [1.5, '3 - 3*dc/1000'], [-1.5, '3 - 3*dc/1000']] },
        { tipo: 'vettore', da: [-0.8, '1.5 - 3*dc/1000'], a: [-0.8, '1.5 - 3*dc/1000 - dc/200'], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: [0.8, '1.5 - 3*dc/1000'], a: [0.8, '1.5 - 3*dc/1000 + dc/200'], etichetta: 'F_A', colore: 2 },
        { tipo: 'testo', p: [5.8, 3], testo: 'sott\'acqua: {{dc/10}}%', ancora: 'end' },
        { tipo: 'testo', p: [5.8, -5.9], testo: 'acqua: 1000 kg/m³', ancora: 'end', colore: 1 }
      ],
      didascalia: 'Un cubo che galleggia nell\'acqua. Sotto il pelo dell\'acqua resta una frazione del volume pari alla densità del cubo divisa quella dell\'acqua, e la spinta è uguale al peso. Frecce in scala.'
    }
  },
  esempi: [
    {
      titolo: 'Il mattone su due facce',
      problema: R`Un mattone ha massa 2 kg e misura 20 cm × 10 cm × 5 cm. Che pressione fa sul tavolo, appoggiato sulla faccia più grande? E appoggiato sulla più piccola?`,
      passi: [
        R`Dati: $m = 2\,\text{kg}$, lati $20\,\text{cm}$, $10\,\text{cm}$, $5\,\text{cm}$. Cerco la pressione $p$ sulla faccia più grande e su quella più piccola.`,
        R`La forza che preme è il peso: $P = m \cdot g = 2\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 19{,}6\,\text{N}$.`,
        R`Le superfici vanno in metri quadrati. Faccia grande: $S = 0{,}20\,\text{m} \cdot 0{,}10\,\text{m} = 0{,}02\,\text{m}^2$. Faccia piccola: $S = 0{,}10\,\text{m} \cdot 0{,}05\,\text{m} = 0{,}005\,\text{m}^2$.`,
        R`Faccia grande: $p = \dfrac{19{,}6\,\text{N}}{0{,}02\,\text{m}^2} = 980\,\text{Pa}$. Faccia piccola: $p = \dfrac{19{,}6\,\text{N}}{0{,}005\,\text{m}^2} = 3920\,\text{Pa}$.`,
        R`Controllo: la faccia piccola ha un quarto della superficie, e la pressione è quattro volte più grande. $4 \cdot 980 = 3920$. Torna.`
      ],
      risultato: R`$980\,\text{Pa}$ sulla faccia grande, $3920\,\text{Pa}$ sulla faccia piccola.`
    },
    {
      titolo: 'Il subacqueo',
      problema: R`Un subacqueo scende in mare a 25 m di profondità. L'acqua di mare ha densità $1030\,\text{kg/m}^3$. Quanto vale la pressione intorno a lui, in pascal e in atmosfere? A che profondità la pressione è il doppio di quella in superficie?`,
      passi: [
        R`Dati: $h = 25\,\text{m}$, $d = 1030\,\text{kg/m}^3$, $p_0 = 101\,300\,\text{Pa}$, $g = 9{,}8\,\text{m/s}^2$. Cerco $p$ a 25 m, e la profondità $h_2$ in cui $p = 2 \cdot p_0$.`,
        R`La parte dovuta all'acqua: $d \cdot g \cdot h = 1030\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 25\,\text{m} = 252\,350\,\text{Pa}$. I kg/m³ per m/s² per m danno N/m², cioè Pa.`,
        R`Con l'aria sopra: $p = 101\,300\,\text{Pa} + 252\,350\,\text{Pa} = 353\,650\,\text{Pa}$. In atmosfere: $\dfrac{353\,650}{101\,300} \approx 3{,}5$, cioè circa $3{,}5\,\text{atm}$.`,
        R`Pressione doppia vuol dire che l'acqua aggiunge un altro $p_0$: $d \cdot g \cdot h_2 = p_0$. Quindi $h_2 = \dfrac{p_0}{d \cdot g} = \dfrac{101\,300}{1030 \cdot 9{,}8}\,\text{m} \approx 10\,\text{m}$.`,
        R`Controllo con la regola: circa un'atmosfera ogni 10 m. A 25 m l'acqua aggiunge 2,5 atm, e l'aria 1 atm: in tutto 3,5 atm. Torna.`
      ],
      risultato: R`$p \approx 354\,000\,\text{Pa} \approx 3{,}5\,\text{atm}$; la pressione è doppia a circa $10\,\text{m}$.`
    },
    {
      titolo: 'Olio e acqua nel tubo a U',
      problema: R`Un tubo a U contiene acqua. In un ramo si versa olio d'oliva, di densità $920\,\text{kg/m}^3$: non si mescola con l'acqua e resta sopra. La colonna d'olio è alta 15 cm sopra la superficie di separazione. Quanto sale l'acqua nell'altro ramo, sopra quella stessa quota? Di quanto differiscono i due livelli?`,
      passi: [
        R`Dati: $d_o = 920\,\text{kg/m}^3$, $h_o = 15\,\text{cm}$, $d_a = 1000\,\text{kg/m}^3$. Cerco l'altezza dell'acqua $h_a$ e il dislivello.`,
        R`Alla quota della superficie di separazione la pressione è la stessa nei due rami. Sopra c'è olio da una parte e acqua dall'altra: $d_o \cdot h_o = d_a \cdot h_a$.`,
        R`Le altezze possono restare in centimetri, perché stanno da tutte e due le parti. $h_a = \dfrac{920 \cdot 15}{1000}\,\text{cm} = 13{,}8\,\text{cm}$.`,
        R`Il livello dell'olio è più alto di $15\,\text{cm} - 13{,}8\,\text{cm} = 1{,}2\,\text{cm}$.`,
        R`Controllo: l'olio è meno denso, quindi gli serve una colonna più alta per fare la stessa pressione. Torna.`
      ],
      risultato: R`L'acqua sale di $13{,}8\,\text{cm}$; il livello dell'olio sta $1{,}2\,\text{cm}$ più in alto.`
    },
    {
      titolo: 'Il sollevatore dell\'officina',
      problema: R`In un sollevatore idraulico lo stantuffo piccolo ha superficie 4 cm², quello grande 800 cm². Sul grande c'è un'auto di 1200 kg. Con che forza bisogna premere il piccolo per reggerla? Di quanto deve scendere in tutto lo stantuffo piccolo, per alzare l'auto di 6 cm? Quante pompate da 15 cm servono?`,
      passi: [
        R`Dati: $S_1 = 4\,\text{cm}^2$, $S_2 = 800\,\text{cm}^2$, $m = 1200\,\text{kg}$, $x_2 = 6\,\text{cm}$, una pompata di $15\,\text{cm}$. Cerco $F_1$, la discesa totale $x_1$ e il numero di pompate.`,
        R`La forza sul grande è il peso dell'auto: $F_2 = m \cdot g = 1200\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 11\,760\,\text{N}$.`,
        R`Il rapporto fra le superfici è $\dfrac{S_2}{S_1} = \dfrac{800}{4} = 200$. Le forze stanno come le superfici: $F_1 = \dfrac{F_2}{200} = \dfrac{11\,760\,\text{N}}{200} = 58{,}8\,\text{N}$.`,
        R`Lo stesso volume d'olio passa da un cilindro all'altro: $S_1 \cdot x_1 = S_2 \cdot x_2$. Quindi $x_1 = 200 \cdot 6\,\text{cm} = 1200\,\text{cm} = 12\,\text{m}$.`,
        R`Con pompate da 15 cm: $\dfrac{1200\,\text{cm}}{15\,\text{cm}} = 80$ pompate. La forza è 200 volte più piccola, lo spostamento 200 volte più grande.`
      ],
      risultato: R`$F_1 = 58{,}8\,\text{N}$; lo stantuffo piccolo scende in tutto di $12\,\text{m}$, cioè 80 pompate.`
    },
    {
      titolo: 'Il peso apparente di una pietra',
      problema: R`Una pietra ha massa 3 kg e volume 1,2 L. La si appende a un dinamometro e la si immerge tutta nell'acqua. Quanto segna il dinamometro? Qual è la densità della pietra?`,
      passi: [
        R`Dati: $m = 3\,\text{kg}$, $V = 1{,}2\,\text{L} = 0{,}0012\,\text{m}^3$, $d_l = 1000\,\text{kg/m}^3$. Cerco il peso apparente $P_{\text{app}}$ e la densità $d_c$ della pietra.`,
        R`Il peso: $P = m \cdot g = 3\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 29{,}4\,\text{N}$.`,
        R`La spinta: $F_A = d_l \cdot V \cdot g = 1000\,\text{kg/m}^3 \cdot 0{,}0012\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 11{,}76\,\text{N}$.`,
        R`Il dinamometro segna il peso apparente: $P_{\text{app}} = P - F_A = 29{,}4\,\text{N} - 11{,}76\,\text{N} \approx 17{,}6\,\text{N}$.`,
        R`La densità: $d_c = \dfrac{m}{V} = \dfrac{3\,\text{kg}}{0{,}0012\,\text{m}^3} = 2500\,\text{kg/m}^3$.`,
        R`Controllo: peso e spinta stanno come le densità di pietra e acqua. $\dfrac{29{,}4}{11{,}76} = 2{,}5$ e $\dfrac{2500}{1000} = 2{,}5$. Torna.`
      ],
      risultato: R`Il dinamometro segna circa $17{,}6\,\text{N}$; la pietra ha densità $2500\,\text{kg/m}^3$.`
    },
    {
      titolo: 'La zattera di tronchi',
      problema: R`Una zattera di legno ha volume 0,4 m³ e densità $650\,\text{kg/m}^3$. Quanta parte del suo volume sta sott'acqua? Quale carico può portare, al massimo, prima di finire tutta sotto?`,
      passi: [
        R`Dati: $V = 0{,}4\,\text{m}^3$, $d_c = 650\,\text{kg/m}^3$, $d_l = 1000\,\text{kg/m}^3$. Cerco il volume immerso $V_i$ e la massa massima del carico.`,
        R`Galleggiando, la frazione immersa è il rapporto delle densità: $\dfrac{V_i}{V} = \dfrac{650}{1000} = 0{,}65$. Quindi $V_i = 0{,}65 \cdot 0{,}4\,\text{m}^3 = 0{,}26\,\text{m}^3$.`,
        R`Con la zattera tutta sott'acqua la spinta è la massima: $F_A = 1000\,\text{kg/m}^3 \cdot 0{,}4\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 3920\,\text{N}$.`,
        R`Il peso della zattera è $P = 650\,\text{kg/m}^3 \cdot 0{,}4\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 2548\,\text{N}$. Per il carico restano $3920\,\text{N} - 2548\,\text{N} = 1372\,\text{N}$.`,
        R`In massa: $m = \dfrac{1372\,\text{N}}{9{,}8\,\text{m/s}^2} = 140\,\text{kg}$. Controllo più rapido: $(1000 - 650) \cdot 0{,}4 = 140\,\text{kg}$. Torna.`
      ],
      risultato: R`Sott'acqua stanno $0{,}26\,\text{m}^3$, il 65% del volume; la zattera porta al massimo $140\,\text{kg}$.`
    }
  ],
  formulario: [
    { nome: 'Pressione', formula: R`p = \dfrac{F}{S}`, nota: R`$F$ è la forza perpendicolare alla superficie $S$. In pascal: $1\,\text{Pa} = 1\,\text{N/m}^2$.` },
    { nome: 'Unità di pressione', formula: R`1\,\text{bar} = 10^5\,\text{Pa}`, nota: R`Poi $1\,\text{kPa} = 1000\,\text{Pa}$; il meteo usa l'ettopascal, $1\,\text{hPa} = 100\,\text{Pa}$. E $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$.` },
    { nome: 'Legge di Stevino', formula: R`p = p_0 + d \cdot g \cdot h`, nota: R`$d$ densità del liquido, $h$ profondità sotto la superficie libera. In acqua, circa 1 atm in più ogni 10 m.` },
    { nome: 'Due liquidi in un tubo a U', formula: R`d_1 \cdot h_1 = d_2 \cdot h_2`, nota: R`Altezze misurate dalla superficie di separazione. Il liquido meno denso fa la colonna più alta.` },
    { nome: 'Torchio idraulico: le forze', formula: R`\dfrac{F_2}{F_1} = \dfrac{S_2}{S_1}`, nota: R`Viene da $\dfrac{F_1}{S_1} = \dfrac{F_2}{S_2}$: lo stesso aumento di pressione sotto i due stantuffi.` },
    { nome: 'Torchio idraulico: gli spostamenti', formula: R`S_1 \cdot x_1 = S_2 \cdot x_2`, nota: R`Lo stesso volume di liquido passa da un cilindro all'altro: lo stantuffo grande si sposta di meno.` },
    { nome: 'Spinta di Archimede', formula: R`F_A = d \cdot V \cdot g`, nota: R`$d$ densità del **fluido**, $V$ volume **immerso** del corpo. È il peso del fluido spostato.` },
    { nome: 'Peso apparente', formula: R`P_{\text{app}} = P - F_A`, nota: R`Quello che segna il dinamometro con il corpo immerso.` },
    { nome: 'Galleggiamento', formula: R`\dfrac{V_i}{V} = \dfrac{d_c}{d_l}`, nota: R`Vale per un corpo che galleggia ($d_c < d_l$). Se $d_c > d_l$ il corpo affonda.` },
    { nome: 'Pressione atmosferica', formula: R`p_0 \approx 101\,300\,\text{Pa}`, nota: R`Al livello del mare. È $1\,\text{atm} = 760\,\text{mmHg}$: regge 76 cm di mercurio, o circa 10,3 m d'acqua. Diminuisce salendo.` },
    { nome: 'Pressione assoluta e relativa', formula: R`p = p_0 + p_{\text{rel}}`, nota: R`Il manometro segna $p_{\text{rel}}$, quanto la pressione supera quella dell'aria.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'pressione', tipo: 'definizione', fronte: R`Che cos'è la **pressione**?`, retro: R`La forza perpendicolare a una superficie divisa l'area della superficie: $p = \dfrac{F}{S}$.` },
    { id: 'fc-02', sezione: 'pressione', tipo: 'definizione', fronte: R`Che cos'è un **pascal**?`, retro: R`L'unità SI di pressione: un newton su un metro quadrato, $1\,\text{Pa} = 1\,\text{N/m}^2$. È una pressione piccola.` },
    { id: 'fc-03', sezione: 'pressione', tipo: 'concetto', fronte: R`Perché un coltello affilato taglia meglio di uno smussato?`, retro: R`Con la stessa forza, la lama affilata tocca una superficie più piccola: la pressione è più grande.` },
    { id: 'fc-04', sezione: 'pressione', tipo: 'concetto', fronte: R`La pressione è una grandezza vettoriale?`, retro: R`No, è **scalare**. Su una superficie produce una forza, sempre perpendicolare alla superficie.` },
    { id: 'fc-05', sezione: 'stevino', tipo: 'formula', fronte: R`La **legge di Stevino**`, retro: R`$p = p_0 + d \cdot g \cdot h$: $d$ densità del liquido, $h$ profondità sotto la superficie libera.` },
    { id: 'fc-06', sezione: 'stevino', tipo: 'concetto', fronte: R`In acqua, ogni quanti metri di profondità la pressione aumenta di circa un'atmosfera?`, retro: R`Ogni 10 m circa: $1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 10\,\text{m} = 98\,000\,\text{Pa}$.` },
    { id: 'fc-07', sezione: 'stevino', tipo: 'concetto', fronte: R`Che cos'è il **paradosso idrostatico**?`, retro: R`La pressione sul fondo dipende solo dalla profondità del liquido, non dalla forma del recipiente né da quanto liquido contiene.` },
    { id: 'fc-08', sezione: 'stevino', tipo: 'concetto', fronte: R`In un punto di un liquido fermo, in che direzione spinge la pressione?`, retro: R`In tutte le direzioni, con lo stesso valore. Su una parete spinge perpendicolare alla parete.` },
    { id: 'fc-09', sezione: 'vasi-comunicanti', tipo: 'definizione', fronte: R`Che cosa dice la legge dei **vasi comunicanti**?`, retro: R`In recipienti collegati dal fondo, con lo stesso liquido fermo, la superficie libera arriva alla stessa altezza in tutti.` },
    { id: 'fc-10', sezione: 'vasi-comunicanti', tipo: 'formula', fronte: R`Due liquidi che non si mescolano in un tubo a U: quale relazione lega le altezze?`, retro: R`$d_1 \cdot h_1 = d_2 \cdot h_2$, con le altezze misurate dalla superficie di separazione.` },
    { id: 'fc-11', sezione: 'pascal', tipo: 'definizione', fronte: R`Il **principio di Pascal**`, retro: R`In un liquido fermo e chiuso, una variazione di pressione si trasmette uguale in tutti i punti.` },
    { id: 'fc-12', sezione: 'pascal', tipo: 'formula', fronte: R`Nel **torchio idraulico**, come stanno le forze?`, retro: R`Come le superfici: $\dfrac{F_2}{F_1} = \dfrac{S_2}{S_1}$. Lo stantuffo grande spinge con la forza più grande.` },
    { id: 'fc-13', sezione: 'pascal', tipo: 'concetto', fronte: R`Il torchio idraulico moltiplica la forza. Che cosa si «paga»?`, retro: R`Lo spostamento: $S_1 \cdot x_1 = S_2 \cdot x_2$. Lo stantuffo grande si sposta tante volte di meno quante volte è più grande.` },
    { id: 'fc-14', sezione: 'archimede', tipo: 'definizione', fronte: R`Il **principio di Archimede**`, retro: R`Un corpo immerso in un fluido riceve una spinta verso l'alto uguale al peso del fluido spostato.` },
    { id: 'fc-15', sezione: 'archimede', tipo: 'formula', fronte: R`Formula della **spinta di Archimede**`, retro: R`$F_A = d \cdot V \cdot g$, con $d$ densità del fluido e $V$ volume immerso del corpo.` },
    { id: 'fc-16', sezione: 'archimede', tipo: 'definizione', fronte: R`Che cos'è il **peso apparente**?`, retro: R`Il peso meno la spinta, $P_{\text{app}} = P - F_A$: quello che segna un dinamometro con il corpo immerso.` },
    { id: 'fc-17', sezione: 'archimede', tipo: 'concetto', fronte: R`Da dove nasce la spinta di Archimede?`, retro: R`Dalla legge di Stevino. La faccia di sotto di un corpo è più profonda: riceve una pressione più grande di quella di sopra.` },
    { id: 'fc-18', sezione: 'galleggiamento', tipo: 'procedura', fronte: R`Come si capisce se un corpo affonda o galleggia?`, retro: R`Si confrontano le densità: se $d_c > d_l$ affonda, se $d_c < d_l$ galleggia, se sono uguali resta sospeso.` },
    { id: 'fc-19', sezione: 'galleggiamento', tipo: 'formula', fronte: R`Che frazione del volume resta sott'acqua in un corpo che galleggia?`, retro: R`$\dfrac{V_i}{V} = \dfrac{d_c}{d_l}$, il rapporto fra la densità del corpo e quella del liquido.` },
    { id: 'fc-20', sezione: 'galleggiamento', tipo: 'concetto', fronte: R`Perché una nave d'acciaio galleggia?`, retro: R`Perché è cava: con l'aria che racchiude, la sua densità media è minore di quella dell'acqua.` },
    { id: 'fc-21', sezione: 'atmosfera', tipo: 'concetto', fronte: R`Quanto vale la **pressione atmosferica** al livello del mare?`, retro: R`Circa $101\,300\,\text{Pa}$: un'atmosfera, cioè $760\,\text{mmHg}$, circa $1013\,\text{hPa}$.` },
    { id: 'fc-22', sezione: 'atmosfera', tipo: 'concetto', fronte: R`Nel tubo di Torricelli, che cosa regge la colonna di mercurio alta 76 cm?`, retro: R`La pressione dell'aria sulla bacinella. Sopra la colonna c'è il vuoto, che non tira niente.` },
    { id: 'fc-23', sezione: 'atmosfera', tipo: 'definizione', fronte: R`Che cos'è la pressione **relativa**?`, retro: R`Di quanto una pressione supera quella atmosferica. La segnano i manometri: $p = p_0 + p_{\text{rel}}$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una forza di 180 N preme perpendicolare su una superficie di 0,3 m². Quanto vale la pressione?`, suggerimenti: [R`Pressione: forza diviso superficie.`], risposta: { tipo: 'numero', valore: 600, unita: 'Pa' }, soluzione: [R`$p = \dfrac{F}{S} = \dfrac{180\,\text{N}}{0{,}3\,\text{m}^2} = 600\,\text{Pa}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Esprimi 2,5 kPa in pascal.`, suggerimenti: [R`Un chilopascal sono mille pascal.`], risposta: { tipo: 'numero', valore: 2500, unita: 'Pa', soloUnita: true }, soluzione: [R`$2{,}5\,\text{kPa} = 2{,}5 \cdot 1000\,\text{Pa} = 2500\,\text{Pa}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Su una superficie di 0,15 m² c'è una pressione di 6000 Pa. Quanto vale la forza perpendicolare che agisce sulla superficie?`, suggerimenti: [R`Dalla formula $p = \dfrac{F}{S}$ ricava $F$.`], risposta: { tipo: 'numero', valore: 900, unita: 'N' }, soluzione: [R`$F = p \cdot S = 6000\,\text{Pa} \cdot 0{,}15\,\text{m}^2 = 900\,\text{N}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una forza di 840 N produce una pressione di 4200 Pa. Su che superficie agisce?`, suggerimenti: [R`$S = \dfrac{F}{p}$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'm²' }, soluzione: [R`$S = \dfrac{F}{p} = \dfrac{840\,\text{N}}{4200\,\text{Pa}} = 0{,}2\,\text{m}^2$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Quanto vale la pressione dovuta all'acqua, $d \cdot g \cdot h$, a 4 m di profondità? Dai la risposta in kPa.`, suggerimenti: [R`L'acqua ha densità $1000\,\text{kg/m}^3$.`, R`Il risultato esce in pascal: dividilo per 1000.`], risposta: { tipo: 'numero', valore: 39.2, unita: 'kPa' }, soluzione: [R`$d \cdot g \cdot h = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 4\,\text{m} = 39\,200\,\text{Pa}$.`, R`Cioè $39{,}2\,\text{kPa}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`A che profondità, in acqua, la pressione dovuta all'acqua vale 49 kPa?`, suggerimenti: [R`Da $d \cdot g \cdot h$ ricava $h$, con la pressione in pascal.`], risposta: { tipo: 'numero', valore: 5, unita: 'm' }, soluzione: [R`$h = \dfrac{49\,000\,\text{Pa}}{1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2} = 5\,\text{m}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`Arrotonda la pressione atmosferica a 100 kPa. Quanto vale la pressione totale a 8 m di profondità in acqua?`, suggerimenti: [R`Legge di Stevino: $p = p_0 + d \cdot g \cdot h$.`, R`La parte dovuta all'acqua è $1000 \cdot 9{,}8 \cdot 8\,\text{Pa}$.`], risposta: { tipo: 'numero', valore: 178.4, unita: 'kPa' }, soluzione: [R`$d \cdot g \cdot h = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 8\,\text{m} = 78\,400\,\text{Pa} = 78{,}4\,\text{kPa}$.`, R`$p = 100\,\text{kPa} + 78{,}4\,\text{kPa} = 178{,}4\,\text{kPa}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una cisterna è piena d'olio di densità $800\,\text{kg/m}^3$. Quanto vale la pressione dovuta all'olio a 2 m sotto la superficie? Dai la risposta in kPa.`, suggerimenti: [R`Nella legge di Stevino si usa la densità del liquido che c'è: qui l'olio.`], risposta: { tipo: 'numero', valore: 15.68, unita: 'kPa' }, soluzione: [R`$d \cdot g \cdot h = 800\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 2\,\text{m} = 15\,680\,\text{Pa} \approx 15{,}7\,\text{kPa}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`In un tubo a U con acqua si versa olio di densità $800\,\text{kg/m}^3$. La colonna d'olio è alta 20 cm sopra la superficie di separazione. Di quanto sale l'acqua nell'altro ramo, sopra quella quota?`, suggerimenti: [R`$d_1 \cdot h_1 = d_2 \cdot h_2$, con le altezze dalla superficie di separazione.`], risposta: { tipo: 'numero', valore: 16, unita: 'cm' }, soluzione: [R`$h_a = \dfrac{d_o \cdot h_o}{d_a} = \dfrac{800 \cdot 20}{1000}\,\text{cm} = 16\,\text{cm}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`In un torchio idraulico lo stantuffo piccolo ha superficie 5 cm² e quello grande 150 cm². Premi il piccolo con 35 N. Con che forza spinge il grande?`, suggerimenti: [R`Le forze stanno come le superfici.`, R`Il grande ha una superficie 30 volte più grande.`], risposta: { tipo: 'numero', valore: 1050, unita: 'N' }, soluzione: [R`$\dfrac{S_2}{S_1} = \dfrac{150}{5} = 30$.`, R`$F_2 = 35\,\text{N} \cdot 30 = 1050\,\text{N}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Lo stantuffo grande di un torchio ha una superficie 40 volte quella del piccolo. Deve reggere un peso di 2400 N. Con che forza bisogna premere il piccolo?`, suggerimenti: [R`Sul piccolo serve una forza 40 volte più piccola.`], risposta: { tipo: 'numero', valore: 60, unita: 'N' }, soluzione: [R`$F_1 = \dfrac{F_2}{40} = \dfrac{2400\,\text{N}}{40} = 60\,\text{N}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`In un torchio lo stantuffo grande ha una superficie 15 volte quella del piccolo. Il piccolo scende di 45 cm. Di quanto sale il grande?`, suggerimenti: [R`Lo stesso volume di liquido passa da un cilindro all'altro: $S_1 \cdot x_1 = S_2 \cdot x_2$.`], risposta: { tipo: 'numero', valore: 3, unita: 'cm' }, soluzione: [R`$x_2 = \dfrac{x_1}{15} = \dfrac{45\,\text{cm}}{15} = 3\,\text{cm}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un pallone da 10 L viene tenuto tutto sott'acqua. Quanto vale la spinta di Archimede?`, suggerimenti: [R`10 L sono $0{,}010\,\text{m}^3$.`, R`$F_A = d \cdot V \cdot g$, con la densità dell'acqua.`], risposta: { tipo: 'numero', valore: 98, unita: 'N' }, soluzione: [R`$V = 10\,\text{L} = 0{,}010\,\text{m}^3$.`, R`$F_A = 1000\,\text{kg/m}^3 \cdot 0{,}010\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 98\,\text{N}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un oggetto di 5 L è immerso tutto nell'olio, di densità $900\,\text{kg/m}^3$. Quanto vale la spinta?`, suggerimenti: [R`Nella spinta entra la densità del liquido, non quella dell'oggetto.`], risposta: { tipo: 'numero', valore: 44.1, unita: 'N' }, soluzione: [R`$V = 5\,\text{L} = 0{,}005\,\text{m}^3$.`, R`$F_A = 900\,\text{kg/m}^3 \cdot 0{,}005\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 44{,}1\,\text{N}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Un corpo pesa 50 N. Immerso nell'acqua riceve una spinta di 18 N. Quanto segna il dinamometro a cui è appeso?`, suggerimenti: [R`Il dinamometro segna il peso apparente: peso meno spinta.`], risposta: { tipo: 'numero', valore: 32, unita: 'N' }, soluzione: [R`$P_{\text{app}} = P - F_A = 50\,\text{N} - 18\,\text{N} = 32\,\text{N}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un dinamometro segna 40 N con un sasso appeso in aria, e 15,5 N con il sasso tutto sott'acqua. Quanto vale la spinta?`, suggerimenti: [R`La spinta è la differenza fra le due letture.`], risposta: { tipo: 'numero', valore: 24.5, unita: 'N' }, soluzione: [R`$F_A = P - P_{\text{app}} = 40\,\text{N} - 15{,}5\,\text{N} = 24{,}5\,\text{N}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Un corpo tutto immerso nell'acqua riceve una spinta di 14,7 N. Qual è il suo volume, in litri?`, suggerimenti: [R`Da $F_A = d \cdot V \cdot g$ ricava $V$.`, R`Un litro è $0{,}001\,\text{m}^3$.`], risposta: { tipo: 'numero', valore: 1.5, unita: 'L' }, soluzione: [R`$V = \dfrac{F_A}{d \cdot g} = \dfrac{14{,}7\,\text{N}}{1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2} = 0{,}0015\,\text{m}^3$.`, R`Cioè $1{,}5\,\text{L}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un tappo di sughero, di densità $240\,\text{kg/m}^3$, galleggia nell'acqua. Che percentuale del suo volume sta sott'acqua?`, suggerimenti: [R`La frazione immersa è $\dfrac{d_c}{d_l}$.`], risposta: { tipo: 'numero', valore: 24, unita: '%' }, soluzione: [R`$\dfrac{V_i}{V} = \dfrac{240}{1000} = 0{,}24$, cioè il 24%.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un cubo galleggia nell'acqua con il 45% del volume immerso. Qual è la sua densità?`, suggerimenti: [R`La frazione immersa è il rapporto fra le densità: $0{,}45 = \dfrac{d_c}{1000\,\text{kg/m}^3}$.`], risposta: { tipo: 'numero', valore: 450, unita: 'kg/m³' }, soluzione: [R`$d_c = 0{,}45 \cdot 1000\,\text{kg/m}^3 = 450\,\text{kg/m}^3$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Arrotonda la pressione atmosferica a 100 kPa. Con che forza preme l'aria su un piano di 0,25 m²? Dai la risposta in kN.`, suggerimenti: [R`$F = p \cdot S$, con la pressione in pascal.`], risposta: { tipo: 'numero', valore: 25, unita: 'kN' }, soluzione: [R`$F = 100\,000\,\text{Pa} \cdot 0{,}25\,\text{m}^2 = 25\,000\,\text{N} = 25\,\text{kN}$.`, R`Non ci schiaccia perché l'aria preme anche da sotto il piano, con la stessa pressione.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un elefante di 4500 kg sta fermo sulle quattro zampe, che toccano il suolo in tutto per 0,5 m². Una ragazza di 54 kg sta in equilibrio su un tacco a spillo che tocca il pavimento per 1,2 cm². Quante volte la pressione del tacco è più grande di quella dell'elefante?`, suggerimenti: [R`Calcola le due pressioni con $p = \dfrac{m \cdot g}{S}$, con le superfici in m².`, R`$1{,}2\,\text{cm}^2 = 0{,}00012\,\text{m}^2$.`], risposta: { tipo: 'numero', valore: 50, tolleranza: 0.5 }, soluzione: [R`Elefante: $p = \dfrac{4500 \cdot 9{,}8\,\text{N}}{0{,}5\,\text{m}^2} = 88\,200\,\text{Pa}$.`, R`Tacco: $p = \dfrac{54 \cdot 9{,}8\,\text{N}}{0{,}00012\,\text{m}^2} = 4\,410\,000\,\text{Pa}$.`, R`Rapporto: $\dfrac{4\,410\,000}{88\,200} = 50$. Il tacco preme 50 volte più dell'elefante.`] },
    { id: 'es-02', difficolta: 2, testo: R`Un serbatoio contiene acqua alta 1,8 m. Il fondo ha area 0,5 m². Con che forza l'acqua preme sul fondo? Non contare l'aria, che preme anche da sotto il serbatoio.`, suggerimenti: [R`Prima la pressione dovuta all'acqua, $d \cdot g \cdot h$.`, R`Poi la forza: $F = p \cdot S$.`], risposta: { tipo: 'numero', valore: 8820, unita: 'N' }, soluzione: [R`$p = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}8\,\text{m} = 17\,640\,\text{Pa}$.`, R`$F = 17\,640\,\text{Pa} \cdot 0{,}5\,\text{m}^2 = 8820\,\text{N}$. Se le pareti sono verticali, è proprio il peso dell'acqua, $0{,}9\,\text{m}^3$.`] },
    { id: 'es-03', difficolta: 3, testo: R`A che profondità, in mare ($d = 1025\,\text{kg/m}^3$), la pressione totale è 2,5 atm? Usa $p_0 = 101\,300\,\text{Pa}$.`, suggerimenti: [R`L'acqua deve aggiungere $1{,}5\,\text{atm}$: l'altra atmosfera la mette l'aria.`, R`$d \cdot g \cdot h = 1{,}5 \cdot 101\,300\,\text{Pa}$.`], risposta: { tipo: 'numero', valore: 15.1, unita: 'm', tolleranza: 0.2 }, soluzione: [R`L'acqua aggiunge $1{,}5 \cdot 101\,300\,\text{Pa} = 151\,950\,\text{Pa}$.`, R`$h = \dfrac{151\,950\,\text{Pa}}{1025\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2} \approx 15{,}1\,\text{m}$.`] },
    { id: 'es-04', difficolta: 2, testo: R`In un tubo a U con acqua si versa un liquido che non si mescola con l'acqua. Una colonna di 10 cm di quel liquido regge 8,5 cm d'acqua, misurati dalla superficie di separazione. Qual è la densità del liquido?`, suggerimenti: [R`$d_1 \cdot h_1 = d_2 \cdot h_2$.`], risposta: { tipo: 'numero', valore: 850, unita: 'kg/m³' }, soluzione: [R`$d \cdot 10\,\text{cm} = 1000\,\text{kg/m}^3 \cdot 8{,}5\,\text{cm}$.`, R`$d = \dfrac{1000 \cdot 8{,}5}{10}\,\text{kg/m}^3 = 850\,\text{kg/m}^3$: meno denso dell'acqua, infatti la sua colonna è più alta.`] },
    { id: 'es-05', difficolta: 3, testo: R`In un torchio idraulico gli stantuffi sono cerchi: il piccolo ha raggio 1 cm, il grande 5 cm. Premi il piccolo con 60 N. Con che forza spinge il grande?`, suggerimenti: [R`L'area di un cerchio è $\pi \cdot r^2$: raggio 5 volte più grande, area $5^2$ volte più grande.`], risposta: { tipo: 'numero', valore: 1500, unita: 'N' }, soluzione: [R`$\dfrac{S_2}{S_1} = \dfrac{\pi \cdot 5^2}{\pi \cdot 1^2} = 25$.`, R`$F_2 = 60\,\text{N} \cdot 25 = 1500\,\text{N}$. Non 300 N: le superfici crescono con il quadrato del raggio.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un oggetto di metallo pesa 15,6 N in aria e 13,6 N tutto immerso nell'acqua. Qual è la sua densità?`, suggerimenti: [R`La spinta è la differenza fra le due letture: ti dice il volume.`, R`Peso e spinta stanno come la densità del corpo e quella dell'acqua.`], risposta: { tipo: 'numero', valore: 7800, unita: 'kg/m³' }, soluzione: [R`Spinta: $F_A = 15{,}6\,\text{N} - 13{,}6\,\text{N} = 2\,\text{N}$.`, R`$\dfrac{P}{F_A} = \dfrac{d_c \cdot V \cdot g}{d_l \cdot V \cdot g} = \dfrac{d_c}{d_l}$, quindi $d_c = \dfrac{15{,}6}{2} \cdot 1000\,\text{kg/m}^3 = 7800\,\text{kg/m}^3$.`, R`È la densità del ferro.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un cubo di paraffina, di lato 20 cm e densità $900\,\text{kg/m}^3$, galleggia nell'acqua. Di quanti centimetri sporge sopra il pelo dell'acqua?`, suggerimenti: [R`La frazione immersa è $\dfrac{900}{1000}$, e per un cubo vale anche per l'altezza.`], risposta: { tipo: 'numero', valore: 2, unita: 'cm' }, soluzione: [R`Sott'acqua sta il 90% dell'altezza: $0{,}9 \cdot 20\,\text{cm} = 18\,\text{cm}$.`, R`Sporge di $20\,\text{cm} - 18\,\text{cm} = 2\,\text{cm}$.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un pontone galleggiante ha la forma di una scatola, con la base di 4 m × 2 m. Di quanti centimetri si abbassa nell'acqua, se ci si caricano 1200 kg?`, suggerimenti: [R`La spinta in più deve reggere il peso in più. Serve un volume immerso in più, pari a quello di 1200 kg d'acqua.`, R`1200 kg d'acqua occupano $1{,}2\,\text{m}^3$.`], risposta: { tipo: 'numero', valore: 15, unita: 'cm' }, soluzione: [R`Volume immerso in più: $\dfrac{1200\,\text{kg}}{1000\,\text{kg/m}^3} = 1{,}2\,\text{m}^3$.`, R`La base è $4\,\text{m} \cdot 2\,\text{m} = 8\,\text{m}^2$, quindi si abbassa di $\dfrac{1{,}2\,\text{m}^3}{8\,\text{m}^2} = 0{,}15\,\text{m} = 15\,\text{cm}$.`] },
    { id: 'es-09', difficolta: 3, testo: R`Il pallone di una mongolfiera contiene 2500 m³ d'aria calda, di densità $0{,}95\,\text{kg/m}^3$. Fuori l'aria ha densità $1{,}2\,\text{kg/m}^3$. Quale massa possono avere, al massimo, involucro, cesta e passeggeri?`, suggerimenti: [R`La spinta è il peso dell'aria fredda spostata; in più il pallone deve reggere il peso dell'aria calda che contiene.`, R`Conviene ragionare in masse: $(1{,}2 - 0{,}95) \cdot 2500$.`], risposta: { tipo: 'numero', valore: 625, unita: 'kg' }, soluzione: [R`Spinta: $1{,}2\,\text{kg/m}^3 \cdot 2500\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 29\,400\,\text{N}$. Peso dell'aria calda: $0{,}95\,\text{kg/m}^3 \cdot 2500\,\text{m}^3 \cdot 9{,}8\,\text{m/s}^2 = 23\,275\,\text{N}$.`, R`Restano $6125\,\text{N}$, cioè $\dfrac{6125}{9{,}8} = 625\,\text{kg}$ per tutto il resto.`] },
    { id: 'es-10', difficolta: 2, testo: R`Se Torricelli avesse usato olio di densità $900\,\text{kg/m}^3$ al posto del mercurio, quanto sarebbe stata alta la colonna? Usa $p_0 = 101\,300\,\text{Pa}$.`, suggerimenti: [R`Alla base della colonna, $d \cdot g \cdot h = p_0$.`], risposta: { tipo: 'numero', valore: 11.5, unita: 'm', tolleranza: 0.1 }, soluzione: [R`$h = \dfrac{p_0}{d \cdot g} = \dfrac{101\,300\,\text{Pa}}{900\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2} \approx 11{,}5\,\text{m}$.`, R`Più alta di quella d'acqua, perché l'olio è meno denso.`] },
    { id: 'es-11', difficolta: 2, testo: R`Il manometro del gommista segna 2,4 bar sulla gomma di una bicicletta. Quanto vale la pressione assoluta dentro la gomma, in bar? Usa $p_0 = 101\,300\,\text{Pa}$.`, suggerimenti: [R`Il manometro segna la pressione relativa: va aggiunta quella atmosferica.`, R`$1\,\text{bar} = 100\,000\,\text{Pa}$, quindi $p_0 \approx 1{,}013\,\text{bar}$.`], risposta: { tipo: 'numero', valore: 3.41, unita: 'bar', tolleranza: 0.03 }, soluzione: [R`$p = p_0 + p_{\text{rel}} = 1{,}013\,\text{bar} + 2{,}4\,\text{bar} \approx 3{,}41\,\text{bar}$.`] },
    { id: 'es-12', difficolta: 3, testo: R`Due mezze sfere di raggio 20 cm sono unite, e dall'interno si è tolta tutta l'aria. Con che forza preme l'aria per tenerle unite? L'aria agisce come su un cerchio di raggio 20 cm. Usa $p_0 = 101\,300\,\text{Pa}$.`, suggerimenti: [R`L'area del cerchio è $\pi \cdot r^2$, con $r$ in metri.`, R`$F = p_0 \cdot S$.`], risposta: { tipo: 'numero', valore: 12700, unita: 'N', tolleranza: 150 }, soluzione: [R`$S = \pi \cdot (0{,}20\,\text{m})^2 \approx 0{,}126\,\text{m}^2$.`, R`$F = 101\,300\,\text{Pa} \cdot 0{,}126\,\text{m}^2 \approx 12\,700\,\text{N}$: il peso di quasi 1300 kg.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cos'è un pascal?`, opzioni: [R`La pressione di un newton su un metro quadrato`, R`La pressione di un chilogrammo su un metro quadrato`, R`Un newton per un metro`, R`La pressione dell'aria al livello del mare`], corretta: 0, spiegazione: R`$1\,\text{Pa} = 1\,\text{N/m}^2$. Il chilogrammo misura una massa, non una forza; newton per metro è un'altra grandezza; la pressione dell'aria vale circa $101\,300\,\text{Pa}$.` },
    { id: 'q-02', domanda: R`Perché con gli sci si sprofonda nella neve meno che con gli scarponi?`, opzioni: [R`Perché con gli sci si pesa di meno`, R`Perché gli sci scivolano e non premono`, R`Perché lo stesso peso si distribuisce su una superficie più grande`, R`Perché la neve sotto gli sci è più dura`], corretta: 2, spiegazione: R`Il peso, cioè la forza, è lo stesso. Gli sci hanno una superficie molto più grande, quindi la pressione $p = F / S$ è più piccola. Anche fermi, gli sci premono.` },
    { id: 'q-03', domanda: R`Tre recipienti di forma diversa sono riempiti d'acqua fino alla stessa altezza. Com'è la pressione sul fondo?`, opzioni: [R`Più grande nel recipiente più largo`, R`Uguale nei tre recipienti`, R`Più grande nel recipiente più stretto`, R`Più grande in quello che contiene più acqua`], corretta: 1, spiegazione: R`Per la legge di Stevino la pressione dipende solo dalla profondità: stessa altezza d'acqua, stessa pressione. È il paradosso idrostatico.` },
    { id: 'q-04', domanda: R`In un lago, rispetto alla pressione a 10 m di profondità, quella a 20 m è…`, opzioni: [R`doppia`, R`uguale`, R`più grande, ma non doppia`, R`la metà`], corretta: 2, spiegazione: R`$p = p_0 + d \cdot g \cdot h$. A 10 m circa 2 atm (1 d'aria e 1 d'acqua), a 20 m circa 3 atm. Raddoppia solo la parte dovuta all'acqua.` },
    { id: 'q-05', domanda: R`Un torchio idraulico moltiplica la forza. Che cosa si «paga» in cambio?`, opzioni: [R`Si consuma una parte del liquido`, R`La pressione sotto lo stantuffo grande diminuisce`, R`Niente: la forza in più è gratis`, R`Lo stantuffo grande si sposta molto meno di quello piccolo`], corretta: 3, spiegazione: R`Lo stesso volume di liquido passa da un cilindro all'altro: $S_1 \cdot x_1 = S_2 \cdot x_2$. Il liquido non si consuma, e la pressione aumenta della stessa quantità sotto i due stantuffi.` },
    { id: 'q-06', domanda: R`Che cosa dice il principio di Pascal?`, opzioni: [R`Una variazione di pressione si trasmette uguale in tutti i punti di un liquido fermo`, R`La pressione cresce con la profondità`, R`Un corpo immerso riceve una spinta verso l'alto`, R`Vasi collegati dal fondo hanno lo stesso livello`], corretta: 0, spiegazione: R`È il principio del torchio idraulico. La crescita con la profondità è la legge di Stevino. La spinta è il principio di Archimede. Il livello uguale è la legge dei vasi comunicanti.` },
    { id: 'q-07', domanda: R`Da che cosa dipende la spinta di Archimede su un corpo?`, opzioni: [R`Dal peso del corpo`, R`Dal volume immerso e dalla densità del fluido`, R`Dalla profondità a cui si trova il corpo`, R`Dalla forma del corpo`], corretta: 1, spiegazione: R`$F_A = d \cdot V \cdot g$: $d$ è la densità del fluido, $V$ il volume immerso. Peso e forma del corpo non entrano; una volta tutto sott'acqua, anche la profondità non conta.` },
    { id: 'q-08', domanda: R`Due cubi della stessa grandezza, uno di ferro e uno di legno, sono tenuti tutti sott'acqua. Su quale la spinta è più grande?`, opzioni: [R`Sul cubo di ferro, che pesa di più`, R`Sul cubo di legno, che tende a salire`, R`È uguale sui due cubi`, R`Sul ferro non c'è spinta, perché affonda`], corretta: 2, spiegazione: R`Spostano lo stesso volume d'acqua, quindi ricevono la stessa spinta. Il ferro affonda perché il suo peso è più grande della spinta, non perché la spinta manchi.` },
    { id: 'q-09', domanda: R`Un cubetto di ghiaccio galleggia in un bicchiere pieno d'acqua fino all'orlo. Quando il ghiaccio fonde, l'acqua…`, opzioni: [R`trabocca`, R`scende sotto l'orlo`, R`ghiaccia anche lei`, R`resta all'orlo, senza traboccare`], corretta: 3, spiegazione: R`Galleggiando, il ghiaccio sposta un'acqua che pesa quanto lui. Quando fonde diventa proprio quella quantità d'acqua, e riempie il posto che occupava la sua parte immersa.` },
    { id: 'q-10', domanda: R`Un corpo galleggia nell'acqua con il 30% del volume fuori. Quanto vale la sua densità?`, opzioni: [R`$300\,\text{kg/m}^3$`, R`$700\,\text{kg/m}^3$`, R`$1300\,\text{kg/m}^3$`, R`$1000\,\text{kg/m}^3$`], corretta: 1, spiegazione: R`Sott'acqua c'è il 70% del volume, e la frazione immersa è $\dfrac{d_c}{d_l}$: $d_c = 0{,}7 \cdot 1000 = 700\,\text{kg/m}^3$. Il 30% è la parte fuori, non la densità.` },
    { id: 'q-11', domanda: R`Nel tubo di Torricelli il mercurio si ferma a 76 cm. Perché non scende tutto nella bacinella?`, opzioni: [R`Perché il vuoto in cima lo risucchia`, R`Perché il mercurio si attacca al vetro`, R`Perché il tubo è chiuso in alto e il mercurio non può uscire`, R`Perché l'aria preme sul mercurio della bacinella`], corretta: 3, spiegazione: R`La pressione dell'aria sulla bacinella regge la colonna: alla sua base la pressione del mercurio è uguale a quella dell'aria. Il vuoto non tira niente.` },
    { id: 'q-12', domanda: R`Salendo in montagna, la pressione atmosferica…`, opzioni: [R`diminuisce`, R`aumenta`, R`resta la stessa`, R`diminuisce solo sopra i 3000 m, più in basso resta uguale`], corretta: 0, spiegazione: R`Più in alto resta meno aria sopra di noi, e il suo peso è più piccolo. A circa 5500 m la pressione è già la metà che al livello del mare.` },
    { id: 'q-13', domanda: R`Tre vasi comunicanti di forma diversa contengono acqua ferma. Com'è il livello dell'acqua?`, opzioni: [R`Più alto nel vaso più stretto`, R`Più alto nel vaso più largo`, R`Uguale in tutti i vasi`, R`Dipende da quanta acqua c'è in ogni vaso`], corretta: 2, spiegazione: R`Alla stessa quota la pressione deve essere la stessa, altrimenti l'acqua scorrerebbe. Per questo la superficie libera arriva alla stessa altezza in tutti, qualunque sia la forma.` },
    { id: 'q-14', domanda: R`In un punto di un liquido fermo, la pressione…`, opzioni: [R`ha lo stesso valore in tutte le direzioni`, R`spinge solo verso il basso`, R`è più grande verso l'alto`, R`è zero nelle direzioni orizzontali`], corretta: 0, spiegazione: R`La pressione è uguale in tutte le direzioni. Per questo da una bottiglia bucata l'acqua esce anche di lato, e i corpi immersi ricevono spinte da ogni parte.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Le superfici vanno in metri quadrati: $1\,\text{cm}^2 = 0{,}0001\,\text{m}^2$, non $0{,}01\,\text{m}^2$.` },
    { tipo: 'errore', testo: R`Nella spinta di Archimede la densità è quella del **liquido**, non del corpo. Il volume è quello **immerso**.` },
    { tipo: 'errore', testo: R`Nella legge di Stevino $h$ è la profondità sotto la superficie libera, non l'altezza dal fondo.` },
    { tipo: 'errore', testo: R`Il vuoto non risucchia: è l'aria intorno che spinge. Vale per la cannuccia e per il tubo di Torricelli.` },
    { tipo: 'trucco', testo: R`In acqua, ogni 10 m di profondità la pressione aumenta di circa un'atmosfera.` },
    { tipo: 'trucco', testo: R`In un corpo che galleggia, la parte sott'acqua è il rapporto delle densità. Il ghiaccio ($917 / 1000$) sta sotto per circa il 92%.` },
    { tipo: 'metodo', testo: R`Galleggia o affonda? Prima di ogni conto confronta la densità del corpo con quella del liquido.` },
    { tipo: 'metodo', testo: R`Nel torchio scrivi $\dfrac{F_1}{S_1} = \dfrac{F_2}{S_2}$, poi controlla: la forza grande deve stare sullo stantuffo grande.` }
  ],
  aneddoti: [
    { fisico: 'Simon Stevin', anni: '1548–1620', titolo: 'Il fondo che regge sempre lo stesso peso', testo: R`Nel 1586 Simon Stevin pubblicò a Leida un trattato sull'equilibrio dei liquidi. Lo scrisse in olandese, non in latino: voleva che lo leggessero anche gli ingegneri delle dighe. Dentro c'era un risultato che sembrava assurdo. Stevin considerò recipienti di forme diverse, con lo stesso fondo e l'acqua alla stessa altezza. Dimostrò che il fondo riceve sempre la stessa forza. È il peso di una colonna d'acqua dritta, larga quanto il fondo e alta quanto il livello. Non conta se il recipiente si allarga verso l'alto e contiene molta più acqua. Per convincere il lettore, immaginava che una parte dell'acqua diventasse solida, senza cambiare peso: l'equilibrio del resto non cambia. Oggi lo chiamiamo paradosso idrostatico.`, legame: R`È la legge di Stevino: la pressione sul fondo dipende solo dalla profondità, non dalla forma del recipiente.` },
    { fisico: 'Evangelista Torricelli', anni: '1608–1647', titolo: 'Sul fondo di un mare d\'aria', testo: R`L'11 giugno 1644 Evangelista Torricelli scrisse da Firenze all'amico Michelangelo Ricci, a Roma. Gli raccontava un esperimento fatto con un tubo di vetro pieno di mercurio, rovesciato in una bacinella. Molti allora pensavano che il vuoto non potesse esistere: la natura ne avrebbe avuto orrore. Torricelli spiegava tutto in un altro modo. «Noi viviamo sommersi nel fondo d'un pelago d'aria», scriveva. Pelago vuol dire mare aperto. È l'aria, con il suo peso, a reggere la colonna. Nella lettera diceva anche il suo sogno. Voleva uno strumento che mostrasse quando l'aria è più «grave» e quando più «leggera»: era l'idea del barometro. Ricci fece girare la lettera, e la notizia arrivò presto in Francia.`, legame: R`È la pressione atmosferica, misurata con una colonna di mercurio: circa $101\,300\,\text{Pa}$.` },
    { fisico: 'Blaise Pascal', anni: '1623–1662', titolo: 'Il mercurio portato in cima a un vulcano', testo: R`Blaise Pascal cercava una prova decisiva che fosse il peso dell'aria a reggere il mercurio di Torricelli. Se era così, in montagna la colonna doveva accorciarsi, perché sopra resta meno aria. Pascal viveva a Parigi e aveva poca salute. Chiese allora al cognato Florin Périer, che abitava a Clermont, di salire sul Puy de Dôme, un vulcano spento. Il 19 settembre 1648 Périer partì con alcuni testimoni e due tubi di mercurio. Uno restò ai piedi del monte, sorvegliato tutto il giorno da un frate: non cambiò. L'altro salì di circa mille metri. In cima il mercurio stava più basso di oltre 8 cm. Scendendo, la colonna si allungava di nuovo. Pascal ripeté la prova su una torre di Parigi, e vide una differenza piccola ma chiara.`, legame: R`La pressione atmosferica diminuisce salendo: sopra di noi resta meno aria che pesa.` },
    { fisico: 'Otto von Guericke', anni: '1602–1686', titolo: 'I cavalli che non staccarono due mezze sfere', testo: R`Otto von Guericke era il borgomastro di Magdeburgo, in Germania, e amava gli esperimenti. Verso il 1650 costruì la prima pompa capace di togliere l'aria da un recipiente. Per mostrare la forza dell'aria preparò due mezze sfere di rame. Le accostò con un anello di cuoio e tolse l'aria dall'interno. Fuori l'aria premeva da tutte le parti, e le teneva unite. Nel 1654 mostrò i suoi esperimenti all'imperatore Ferdinando III, a Ratisbona. La prova più famosa la ripeté a Magdeburgo. Due squadre di cavalli tiravano le sfere in versi opposti, senza riuscire a staccarle. Bastava aprire una valvola e far rientrare l'aria: le due metà si separavano a mano. Un'incisione del suo libro, del 1672, mostra sedici cavalli, otto per parte.`, legame: R`Mostra quanto è grande la forza della pressione atmosferica, anche su una superficie piccola.` },
    { fisico: 'Archimede', anni: 'circa 287–212 a.C.', titolo: 'Il libro dei galleggianti sotto le preghiere', testo: R`Archimede scrisse un trattato in due libri, *Sui corpi galleggianti*. È il più antico testo di idrostatica che conosciamo. Lì c'è il suo principio: un corpo immerso sembra più leggero, e la differenza è il peso del liquido spostato. Archimede studiò anche quando un corpo che galleggia resta dritto e quando si ribalta. È un problema che interessa chi costruisce navi. Per secoli il testo greco sembrò perduto: restava una traduzione latina del 1269. Nel 1906 il filologo danese Johan Ludvig Heiberg esaminò a Costantinopoli un libro di preghiere. Era stato scritto nel 1229 sopra un manoscritto di Archimede, raschiato via. Sotto le preghiere c'era l'unica copia greca rimasta dei *Corpi galleggianti*. Il palinsesto fu venduto all'asta nel 1998, e poi letto con raggi X e luci speciali.`, legame: R`È il principio di Archimede nelle parole del suo autore: la spinta è il peso del liquido spostato.` }
  ]
});
})();
