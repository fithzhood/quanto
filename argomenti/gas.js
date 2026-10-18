/* Quanto — I gas (fluidi e calore, terzo anno).
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/gas.js
   Simboli come nei video: T temperatura assoluta (K), t temperatura in gradi Celsius; pressione viola (colore 4),
   volume che si dilata verde (colore 3, come le dilatazioni di calore), velocità azzurre, forze arancio. */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'gas',
  titolo: 'I gas',
  introduzione: R`Una bombola da sub, un pallone da calcio, l'aria chiusa in una siringa, una mongolfiera che sale. In tutti c'è un gas. Un gas non ha forma e non ha un volume proprio: riempie tutto il recipiente che lo contiene. E si lascia schiacciare molto più di un liquido.

Lo stato di un gas si descrive con quattro grandezze: pressione, volume, temperatura e quantità di gas. Le **leggi dei gas** dicono come cambiano insieme. Spiegano perché una bombola al sole è pericolosa. Dicono quanta aria c'è in un'aula, e perché d'inverno le gomme dell'auto sembrano sgonfie. Alla fine si guarda dentro il gas: la pressione nasce dagli urti delle molecole, e la temperatura dice quanto corrono.

Servono la pressione e le sue unità, dai fluidi, e la scala Kelvin, dal calore. Dalla meccanica servono la quantità di moto, il terzo principio e l'energia cinetica.`,
  inBreve: [
    R`Lo stato di un gas si descrive con pressione $p$, volume $V$, temperatura assoluta $T$ e quantità di gas. Nelle leggi dei gas la temperatura va **sempre in kelvin** e la pressione è quella **assoluta**.`,
    R`A temperatura costante $p \cdot V$ resta costante: è la **legge di Boyle**. Volume metà, pressione doppia.`,
    R`A pressione costante $V/T$ è costante; a volume costante è costante $p/T$. Sono le due **leggi di Gay-Lussac**, e le loro rette puntano tutte allo **zero assoluto**, −273,15 °C.`,
    R`Le tre leggi stanno in una sola, l'**equazione di stato**: $p \cdot V = n \cdot R \cdot T$, con $R \approx 8{,}31\,\text{J/(mol}\cdot\text{K)}$ e $n$ il numero di moli.`,
    R`La pressione nasce dagli **urti** delle molecole sulle pareti. La temperatura assoluta è proporzionale all'**energia cinetica media di traslazione** delle molecole: $\tfrac{1}{2} \cdot m \cdot v_{qm}^2 = \tfrac{3}{2} \cdot k \cdot T$.`
  ],
  sezioni: [
    {
      id: 'stato',
      titolo: 'Lo stato di un gas',
      testo: R`Apri una boccetta di profumo in un angolo della stanza. Dopo poco l'odore arriva dappertutto. Le molecole del profumo si sono sparse in tutto lo spazio che avevano.

In un gas le molecole sono lontane fra loro e corrono in tutte le direzioni. Per questo un gas non ha forma né volume propri: riempie il recipiente. E si comprime facilmente, perché fra una molecola e l'altra c'è molto spazio vuoto.

>* Lo **stato** di un gas è descritto da pressione $p$, volume $V$ e temperatura $T$. Con la quantità di gas, sono le **variabili di stato**.

Le unità di misura da tenere sotto mano:

- la **pressione** in pascal, $1\,\text{Pa} = 1\,\text{N/m}^2$. Si usano anche il chilopascal, il bar ($1\,\text{bar} = 100\,\text{kPa}$) e l'atmosfera ($1\,\text{atm} \approx 101{,}3\,\text{kPa}$);
- il **volume** in metri cubi, oppure in litri: $1\,\text{L} = 1\,\text{dm}^3 = 10^{-3}\,\text{m}^3$, e $1\,\text{mL} = 1\,\text{cm}^3$;
- la **temperatura** in kelvin. In questo argomento $T$ è sempre la temperatura in kelvin e $t$ quella in gradi Celsius: $T = t + 273{,}15$. Nel calore anche i gradi Celsius si chiamavano $T$; qui no: come nei video, $T$ è solo in kelvin.

Nelle leggi dei gas la pressione è sempre quella **assoluta**: tutta la pressione del gas, compresa la parte dovuta all'aria. Il manometro del gommista invece segna di quanto la gomma supera l'aria di fuori. È la pressione **relativa**. Se segna 2,2 bar, nella gomma ci sono circa $2{,}2\,\text{bar} + 1\,\text{bar} = 3{,}2\,\text{bar}$.

>! Una pressione relativa non va bene nelle leggi dei gas. Prima si aggiunge la pressione atmosferica.

Le leggi che vedremo valgono per un modello, il **gas perfetto**. I gas veri lo seguono bene a pressioni basse, e lontano dalla temperatura in cui diventano liquidi. L'aria di tutti i giorni si comporta quasi come un gas perfetto.

?? Quanto vale un volume di 3 L in metri cubi?
[ ] $3\,\text{m}^3$
[ ] $0{,}03\,\text{m}^3$
[x] $0{,}003\,\text{m}^3$
=> Un litro è un decimetro cubo, cioè un millesimo di metro cubo: $3\,\text{L} = 3 \cdot 10^{-3}\,\text{m}^3 = 0{,}003\,\text{m}^3$.`
    },
    {
      id: 'boyle',
      titolo: 'La legge di Boyle: temperatura costante',
      testo: R`Tappa con un dito la punta di una siringa e spingi lo stantuffo. L'aria dentro si lascia schiacciare, ma spinge sempre più forte contro il dito. Quando lasci, lo stantuffo torna indietro.

Il gas non esce. Se si spinge piano, la temperatura resta quella della stanza. Cambiano solo il volume e la pressione. Nel 1662 Robert Boyle trovò la regola che li lega.

[[video:gas/boyle]]

>* **Legge di Boyle.** Per una quantità fissa di gas a temperatura costante, la pressione è inversamente proporzionale al volume: $p \cdot V = \text{costante}$, cioè $p_1 \cdot V_1 = p_2 \cdot V_2$.

Una trasformazione a temperatura costante si chiama **isoterma**. Se il volume si dimezza, la pressione raddoppia. Se il volume diventa un terzo, la pressione diventa il triplo.

Esempio. Una pompa da bicicletta con il foro tappato contiene 0,6 L d'aria a 100 kPa. Si spinge piano il pistone fino a 0,2 L.

~ p_1 \cdot V_1 = p_2 \cdot V_2 :: temperatura e quantità di gas non cambiano
~ p_2 = \dfrac{p_1 \cdot V_1}{V_2} :: ricavo la pressione finale
~ p_2 = \dfrac{100\,\text{kPa} \cdot 0{,}6\,\text{L}}{0{,}2\,\text{L}} :: i litri si semplificano: non serve passare ai metri cubi
~ p_2 = \evidb{300\,\text{kPa}} :: volume un terzo, pressione tripla

Nel grafico pressione–volume gli stati di un'isoterma stanno su un ramo di **iperbole**. Il rettangolo sotto ogni punto ha area $p \cdot V$: è sempre la stessa.

[[grafico:boyle]]

>! La legge di Boyle vale solo se la temperatura non cambia e il gas non esce. E la pressione va presa assoluta: con quella del manometro del gommista il prodotto non resta costante.

?? A temperatura costante, il volume di un gas diventa il triplo. La pressione…
[ ] diventa il triplo
[ ] resta la stessa
[x] diventa un terzo
=> Il prodotto $p \cdot V$ non cambia: se $V$ si moltiplica per 3, $p$ si divide per 3.`
    },
    {
      id: 'isobara',
      titolo: 'Pressione costante: la prima legge di Gay-Lussac',
      testo: R`Una mongolfiera sale perché l'aria nel pallone è calda. Scaldandosi, l'aria si dilata e una parte esce dal fondo aperto. Nel pallone resta meno aria: è meno densa dell'aria fredda che ha intorno.

Per studiare questa dilatazione si chiude un gas in un cilindro, sotto un pistone libero di scorrere. Il pistone tiene la pressione costante. Si scalda il gas e si misura il volume.

>* **Prima legge di Gay-Lussac.** Per una quantità fissa di gas a pressione costante, il volume cresce in modo lineare con la temperatura: $V = V_{0\,{}^\circ\text{C}} \cdot \left(1 + \dfrac{t}{273{,}15}\right)$, dove $V_{0\,{}^\circ\text{C}}$ è il volume a 0 °C.

A ogni grado in più il gas cresce di $\frac{1}{273{,}15}$ del volume che aveva a 0 °C. Questo numero è lo stesso per tutti i gas. Nei solidi e nei liquidi invece ogni materiale si dilata a modo suo.

Con la temperatura in kelvin la legge diventa più semplice: il volume è **direttamente proporzionale** a $T$.

$$\dfrac{V}{T} = \text{costante} \qquad \dfrac{V_1}{T_1} = \dfrac{V_2}{T_2}$$

Una trasformazione a pressione costante si chiama **isobara**.

Esempio. Un cilindro con un pistone libero contiene 2,0 L di gas a 27 °C. Lo si scalda fino a 87 °C.

~ T_1 = (27 + 273)\,\text{K} = 300\,\text{K} :: le temperature in kelvin, arrotondando 273,15 a 273
~ T_2 = (87 + 273)\,\text{K} = 360\,\text{K} :: la stessa cosa per la temperatura finale
~ V_2 = V_1 \cdot \dfrac{T_2}{T_1} :: dalla legge $V_1 / T_1 = V_2 / T_2$
~ V_2 = 2{,}0\,\text{L} \cdot \dfrac{360\,\text{K}}{300\,\text{K}} :: i kelvin si semplificano
~ V_2 = \evidb{2{,}4\,\text{L}} :: temperatura assoluta 1,2 volte, volume 1,2 volte

[[grafico:isobara]]

>! La temperatura va in kelvin. Da 20 °C a 40 °C il volume non raddoppia: la temperatura assoluta passa da 293 K a 313 K, solo il 7% in più.

?? A pressione costante un gas passa da 200 K a 400 K. Il suo volume…
[x] raddoppia
[ ] diventa quattro volte tanto
[ ] resta lo stesso
=> In kelvin il volume è proporzionale alla temperatura: $T$ doppia, $V$ doppio.`
    },
    {
      id: 'isocora',
      titolo: 'Volume costante e zero assoluto',
      testo: R`Sulle bombolette spray c'è scritto di non scaldarle e di non gettarle nel fuoco. Dentro c'è un gas chiuso in un recipiente rigido. Il volume non può cambiare. Scaldando cresce la pressione, fino a far scoppiare la bomboletta.

>* **Seconda legge di Gay-Lussac.** Per una quantità fissa di gas a volume costante, la pressione cresce in modo lineare con la temperatura: $p = p_{0\,{}^\circ\text{C}} \cdot \left(1 + \dfrac{t}{273{,}15}\right)$, dove $p_{0\,{}^\circ\text{C}}$ è la pressione a 0 °C (non quella atmosferica).

Una trasformazione a volume costante si chiama **isocora**. Nel grafico pressione–temperatura i punti stanno su una retta. Che cosa succede se la si prolunga verso il freddo?

[[video:gas/zero-assoluto]]

Tutte le rette arrivano a pressione zero nello stesso punto, −273,15 °C. Vale per qualunque gas e qualunque quantità. È lo **zero assoluto**, la temperatura più bassa che si possa pensare. Da lì parte la scala Kelvin.

[[grafico:isocora]]

>* Con la temperatura in kelvin la pressione è direttamente proporzionale a $T$: $\dfrac{p}{T} = \text{costante}$, cioè $\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$.

Esempio. Un recipiente rigido contiene gas a 150 kPa e 7 °C. Lo si scalda fino a 147 °C.

~ T_1 = (7 + 273)\,\text{K} = 280\,\text{K} :: le temperature in kelvin
~ T_2 = (147 + 273)\,\text{K} = 420\,\text{K} :: la stessa cosa per la temperatura finale
~ p_2 = p_1 \cdot \dfrac{T_2}{T_1} :: dalla legge $p_1 / T_1 = p_2 / T_2$
~ p_2 = 150\,\text{kPa} \cdot \dfrac{420\,\text{K}}{280\,\text{K}} :: i kelvin si semplificano
~ p_2 = \evidb{225\,\text{kPa}} :: temperatura assoluta 1,5 volte, pressione 1,5 volte

>! Con i gradi Celsius il rapporto sarebbe $147 / 7 = 21$: una pressione ventuno volte più grande. È assurdo, ed è l'errore più comune.

Lo zero assoluto non si raggiunge mai: ci si può solo avvicinare. Nei laboratori si arriva a meno di un milionesimo di kelvin. E prima di arrivarci ogni gas vero diventa liquido. Per questo nel grafico le rette sono tratteggiate verso il freddo: lì sono solo un prolungamento.

?? Un gas perfetto, a volume costante, viene raffreddato fino a 0 K. Che pressione avrebbe?
[ ] la stessa che ha a 0 °C
[x] zero
[ ] una pressione negativa
=> In kelvin $p$ è proporzionale a $T$: con $T = 0$ anche $p = 0$. È il punto in cui tutte le rette tagliano l'asse delle temperature.`
    },
    {
      id: 'legge-generale',
      titolo: 'Tre leggi in una',
      testo: R`Nelle tre leggi viste finora una variabile resta ferma e le altre due cambiano. Ma un pallone sonda che sale nel cielo trova insieme meno pressione e più freddo. Cambiano tutte e tre le variabili.

Le tre leggi si possono riunire in una sola.

>* **Equazione generale dei gas.** Per una quantità fissa di gas $\dfrac{p \cdot V}{T} = \text{costante}$, cioè $\dfrac{p_1 \cdot V_1}{T_1} = \dfrac{p_2 \cdot V_2}{T_2}$, con $T$ in kelvin.

Se una variabile resta ferma, si semplifica, e torna una delle tre leggi.

| trasformazione | legge |
|---|---|
| isoterma ($T$ fissa) | $p \cdot V$ costante |
| isobara ($p$ fissa) | $V/T$ costante |
| isocora ($V$ fisso) | $p/T$ costante |

Esempio. Un pallone sonda parte da terra con 3,0 m³ di elio, a 100 kPa e 15 °C. In quota la pressione è 40 kPa e la temperatura −33 °C. Il gas non esce: quanto diventa il volume?

~ T_1 = (15 + 273)\,\text{K} = 288\,\text{K} :: la temperatura a terra in kelvin
~ T_2 = (-33 + 273)\,\text{K} :: e quella in quota
~ T_2 = 240\,\text{K} :: −33 °C sono 240 kelvin
~ V_2 = V_1 \cdot \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1} :: ricavo $V_2$ dall'equazione generale
~ \dfrac{p_1}{p_2} = \dfrac{100\,\text{kPa}}{40\,\text{kPa}} = 2{,}5 :: il rapporto delle pressioni: i chilopascal si semplificano
~ \dfrac{T_2}{T_1} = \dfrac{240\,\text{K}}{288\,\text{K}} = \dfrac{5}{6} :: il rapporto delle temperature: i kelvin si semplificano
~ V_2 = 3{,}0\,\text{m}^3 \cdot 2{,}5 \cdot \dfrac{5}{6} :: metto i due rapporti
~ V_2 = \evidb{6{,}25\,\text{m}^3} :: la pressione più bassa lo gonfia, il freddo lo sgonfia un po'

>! Pressioni e volumi possono restare nelle unità che si vogliono, purché siano le stesse nei due stati. La temperatura no: va sempre in kelvin.

?? Per una quantità fissa di gas raddoppiano sia la pressione sia la temperatura assoluta. Il volume…
[ ] raddoppia
[x] resta lo stesso
[ ] diventa quattro volte tanto
=> Il volume è proporzionale a $T / p$: il 2 sopra e il 2 sotto si semplificano.`
    },
    {
      id: 'equazione-stato',
      titolo: 'Le moli e l\'equazione di stato',
      testo: R`Nella costante dell'equazione generale c'è nascosta la quantità di gas. Con il doppio del gas, alla stessa pressione e temperatura, serve il doppio del volume. Per contare il gas si usa la mole.

>* Una **mole** contiene $N_A \approx 6{,}02 \cdot 10^{23}$ particelle: è il **numero di Avogadro**. Il numero di moli è $n = \dfrac{N}{N_A}$, oppure $n = \dfrac{m}{M}$, dove $M$ è la massa molare.

La **massa molare** è la massa di una mole. Per l'azoto dell'aria, $\text{N}_2$, vale circa 28 g/mol; per l'ossigeno, $\text{O}_2$, 32 g/mol; per l'elio 4 g/mol.

Vale poi la **legge di Avogadro**. Volumi uguali di gas diversi, alla stessa pressione e temperatura, contengono lo stesso numero di molecole. Quindi la costante dell'equazione generale dipende solo dal numero di moli, non dal tipo di gas.

[[video:gas/gas-perfetto]]

>* **Equazione di stato dei gas perfetti.** $p \cdot V = n \cdot R \cdot T$, dove $R \approx 8{,}31\,\text{J/(mol}\cdot\text{K)}$ è la **costante dei gas**, uguale per tutti i gas.

Con questo valore di $R$, la pressione va in pascal, il volume in metri cubi, la temperatura in kelvin. Esempio: mezza mole di gas in 10 L, a 47 °C.

~ T = (47 + 273)\,\text{K} = 320\,\text{K} :: la temperatura in kelvin
~ V = 10\,\text{L} = 0{,}010\,\text{m}^3 :: il volume in metri cubi, come vuole R
~ R \cdot T = 8{,}31\,\tfrac{\text{J}}{\text{mol}\cdot\text{K}} \cdot 320\,\text{K} :: in $p = n \cdot R \cdot T / V$ comincio da $R \cdot T$: i kelvin si semplificano
~ R \cdot T \approx 2659\,\tfrac{\text{J}}{\text{mol}} :: l'energia per ogni mole
~ n \cdot R \cdot T \approx 0{,}50 \cdot 2659\,\text{J} :: $0{,}50\,\text{mol}$ per $2659\,\text{J/mol}$: le moli si semplificano
~ n \cdot R \cdot T \approx 1330\,\text{J} :: restano i joule
~ p \approx \dfrac{1330\,\text{J}}{0{,}010\,\text{m}^3} = 133\,000\,\text{Pa} :: un joule al metro cubo è un pascal
~ p \approx \evidb{133\,\text{kPa}} :: poco più di un'atmosfera

A 0 °C e 1 atm una mole di qualunque gas occupa circa 22,4 L. È il **volume molare**: $V = \dfrac{1 \cdot 8{,}31 \cdot 273{,}15}{101\,300}\,\text{m}^3 \approx 0{,}0224\,\text{m}^3$.

>! In $p \cdot V = n \cdot R \cdot T$ non si mettono i gradi Celsius. E non si mescolano pascal e litri: il risultato viene sbagliato di mille volte.

?? Quante moli ci sono in 96 g di ossigeno, $\text{O}_2$, che ha massa molare 32 g/mol?
[ ] 32 mol
[x] 3 mol
[ ] 0,33 mol
=> Il numero di moli è la massa divisa per la massa molare: $n = \dfrac{96\,\text{g}}{32\,\text{g/mol}} = 3\,\text{mol}$.`
    },
    {
      id: 'pressione-urti',
      titolo: 'La pressione vista dalle molecole',
      testo: R`Le leggi dei gas dicono che cosa si misura: pressione, volume, temperatura. Non dicono perché il gas si comporta così. Per capirlo bisogna guardare le molecole. È la **teoria cinetica** dei gas.

>* Nel **modello del gas perfetto** le molecole sono piccolissime rispetto alle distanze fra loro. Si muovono in modo disordinato, in tutte le direzioni. Non si attirano e non si respingono, tranne quando si urtano. Gli urti, fra loro e con le pareti, sono **elastici**: non fanno perdere energia cinetica.

[[video:gas/teoria-cinetica]]

Quando una molecola urta una parete, rimbalza. La componente della velocità perpendicolare alla parete cambia verso. Quella parallela resta com'è.

[[grafico:urto]]

La quantità di moto della molecola cambia, in modulo, di $2 \cdot m \cdot v_x$. È la parete che la spinge indietro. Per il terzo principio, la molecola spinge la parete con una forza uguale e contraria. Gli urti sono un numero enorme ogni secondo: la parete sente una forza media costante. Divisa per la superficie, è la pressione.

Con un conto si trova quanto vale. Una molecola di massa $m$ rimbalza fra due pareti opposte di un cubo di lato $a$:

~ \Delta(m \cdot v) = 2 \cdot m \cdot v_x :: in modulo, a ogni urto: $v_x$ diventa $-v_x$
~ \Delta t = \dfrac{2 \cdot a}{v_x} :: il tempo per arrivare all'altra parete e tornare
~ F = \dfrac{2 \cdot m \cdot v_x}{\Delta t} = \dfrac{m \cdot v_x^2}{a} :: la forza media sulla parete
~ p = \dfrac{F}{a^2} = \dfrac{m \cdot v_x^2}{V} :: forza diviso superficie, con $V = a^3$
~ p \cdot V = \evidb{\tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2} :: con $N$ molecole che vanno in tutte e tre le direzioni

Qui $v_{qm}$ è la **velocità quadratica media**: il suo quadrato è la media dei quadrati delle velocità. In media $v_x^2$ vale un terzo di $v^2$, perché le direzioni sono tre e nessuna è privilegiata.

La pressione cresce se ci sono più molecole nello stesso volume, o se corrono più veloci. Ecco la legge di Boyle vista da vicino: in metà volume, ogni centimetro quadrato di parete riceve il doppio degli urti.

>! In un recipiente chiuso la pressione non è il peso del gas. Il gas preme sul soffitto quanto sul pavimento: gli urti arrivano da tutte le direzioni. Nell'atmosfera, invece, il peso dell'aria sopra rende più fitti gli urti in basso.

?? Una molecola arriva perpendicolare alla parete a 400 m/s e rimbalza in modo elastico. Di quanto cambia la sua velocità?
[ ] di zero, perché resta 400 m/s
[x] di 800 m/s
[ ] di 400 m/s
=> La velocità passa da +400 m/s a −400 m/s: la variazione è $-400 - 400 = -800\,\text{m/s}$. Il modulo non cambia, ma il verso sì.`
    },
    {
      id: 'temperatura-energia',
      titolo: 'La temperatura e la velocità delle molecole',
      testo: R`Ora abbiamo due formule per la stessa cosa, il prodotto $p \cdot V$. Una viene dagli esperimenti, l'altra dalle molecole.

$$p \cdot V = n \cdot R \cdot T$$

$$p \cdot V = \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2$$

Per confrontarle conviene la **costante di Boltzmann**, $k = \dfrac{R}{N_A} \approx 1{,}38 \cdot 10^{-23}\,\text{J/K}$ (qui $k$ non è la conducibilità termica). È la costante dei gas per una molecola sola.

~ \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2 = n \cdot R \cdot T :: le due espressioni di $p \cdot V$
~ \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2 = N \cdot k \cdot T :: perché $n \cdot R = \dfrac{N}{N_A} \cdot R = N \cdot k$
~ \tfrac{1}{3} \cdot m \cdot v_{qm}^2 = k \cdot T :: divido tutto per $N$
~ \evidb{\tfrac{1}{2} \cdot m \cdot v_{qm}^2 = \tfrac{3}{2} \cdot k \cdot T} :: moltiplico per $\tfrac{3}{2}$: a sinistra c'è l'energia cinetica media

>* La temperatura assoluta è **proporzionale all'energia cinetica media di traslazione** delle molecole: in media una molecola ha energia cinetica $\tfrac{1}{2} \cdot m \cdot v_{qm}^2 = \tfrac{3}{2} \cdot k \cdot T$.

«Di traslazione» vuol dire del moto da un punto all'altro. Le molecole di due o più atomi possono anche ruotare, ma quell'energia qui non entra.

Dalla formula si ricava la velocità: $v_{qm} = \sqrt{\dfrac{3 \cdot R \cdot T}{M}}$, con la massa molare $M$ in kg/mol. Per l'azoto a 20 °C:

~ v_{qm} = \sqrt{\dfrac{3 \cdot R \cdot T}{M}} :: si ottiene da $3 \cdot k \cdot T / m$, moltiplicando sopra e sotto per $N_A$
~ T = (20 + 273)\,\text{K} = 293\,\text{K} :: la temperatura in kelvin
~ M = 28\,\tfrac{\text{g}}{\text{mol}} = 0{,}028\,\tfrac{\text{kg}}{\text{mol}} :: la massa molare in chilogrammi
~ v_{qm} = \sqrt{\dfrac{3 \cdot 8{,}31 \cdot 293}{0{,}028}}\,\text{m/s} :: J/kg sotto la radice: escono i m/s
~ v_{qm} \approx \evidb{511\,\text{m/s}} :: più di 1800 km/h: è la velocità tipica delle molecole dell'aria

Alla stessa temperatura tutte le molecole hanno in media la stessa energia cinetica. Quelle leggere, quindi, corrono di più. Le molecole di elio vanno più di due volte e mezzo più veloci di quelle di azoto.

[[grafico:velocita]]

>! La temperatura non è proporzionale alla velocità, ma al suo quadrato. Con la temperatura assoluta doppia la velocità diventa $\sqrt{2} \approx 1{,}4$ volte, non il doppio.

> Le molecole di un gas non vanno tutte alla stessa velocità: alcune sono lente, altre velocissime. La velocità quadratica media è un valore tipico. Come si distribuiscono le velocità lo calcolò James Clerk Maxwell nel 1860.

?? A 100 K le molecole di un gas hanno una certa velocità quadratica media. A che temperatura diventa doppia?
[ ] 200 K
[ ] 141 K
[x] 400 K
=> La temperatura va con il quadrato della velocità: velocità doppia, temperatura $2^2 = 4$ volte, cioè 400 K.`
    }
  ],
  grafici: {
    /* la legge di Boyle: un'isoterma con p·V = 120 kPa·L; il rettangolo sotto il punto ha sempre la stessa area */
    boyle: {
      tipo: 'piano', x: [0, 6.5], y: [0, 260], altezza: 500, passo: [1, 40], proporzioni: 'libere',
      etichette: { x: 'V (L)', y: 'p (kPa)' },
      parametri: [{ nome: 'V', min: 1, max: 5.5, passo: 0.5, valore: 2, decimali: 1, etichetta: 'V (L)' }],
      funzioni: [{ f: '120/x', dominio: [0.46, 5.9], colore: 4 }],
      elementi: [
        { tipo: 'poligono', colore: 3, punti: [[0, 0], ['V', 0], ['V', '120/V'], [0, '120/V']] },
        { tipo: 'punto', p: ['V', '120/V'], etichetta: '{{120/V|0}} kPa', posizione: 'alto-destra', colore: 4 },
        { tipo: 'testo', p: [6.3, 222], testo: 'area = p·V = 120 kPa·L', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un\'isoterma: la stessa aria, alla stessa temperatura, con volumi diversi. La pressione segue un ramo di iperbole, p = 120 / V. Il rettangolo verde ha base V e altezza p: la sua area, p·V, non cambia. Sposta il cursore per cambiare il volume.'
    },
    /* la prima legge di Gay-Lussac in kelvin: una retta per l'origine, tratteggiata dove il gas sarebbe già liquido */
    isobara: {
      tipo: 'piano', x: [0, 500], y: [0, 6], altezza: 420, passo: [100, 1], proporzioni: 'libere',
      etichette: { x: 'T (K)', y: 'V (L)' },
      parametri: [{ nome: 'T', min: 150, max: 500, passo: 10, valore: 300, etichetta: 'T (K)' }],
      funzioni: [
        { f: 'x/100', dominio: [0, 150], colore: 3, tratteggio: true },
        { f: 'x/100', dominio: [150, 500], colore: 3 }
      ],
      elementi: [
        { tipo: 'punto', p: ['T', 'T/100'], etichetta: '{{T/100|1}} L', posizione: 'alto-sinistra', colore: 3 },
        { tipo: 'testo', p: [490, 1.3], testo: 'V / T = 0,01 L/K', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un gas a pressione costante: 3 L a 300 K. In kelvin il volume è proporzionale alla temperatura, e la retta passa per l\'origine. Il tratto tratteggiato è solo un prolungamento: a quelle temperature il gas sarebbe già liquido. Sposta il cursore per scaldare il gas.'
    },
    /* la seconda legge di Gay-Lussac in gradi Celsius: ogni retta, prolungata, arriva a p = 0 a −273,15 °C */
    isocora: {
      tipo: 'piano', x: [-300, 150], y: [0, 320], altezza: 480, passo: [100, 40], proporzioni: 'libere',
      etichette: { x: 't (°C)', y: 'p (kPa)' },
      parametri: [{ nome: 'p0', min: 50, max: 200, passo: 10, valore: 90, etichetta: 'p_{0 °C} (kPa)' }],
      funzioni: [
        { f: 'p0*(1 + x/273.15)', dominio: [-273.15, -100], colore: 4, tratteggio: true },
        { f: 'p0*(1 + x/273.15)', dominio: [-100, 150], colore: 4 }
      ],
      elementi: [
        { tipo: 'verticale', x: -273.15, colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [-273.15, 0], colore: 'grigio' },
        { tipo: 'testo', p: [-266, 170], testo: 'zero assoluto', ancora: 'start' },
        { tipo: 'testo', p: [-266, 146], testo: '−273,15 °C', ancora: 'start' },
        { tipo: 'punto', p: [0, 'p0'], etichetta: 'p_{0 °C} = {{p0}} kPa', posizione: 'basso-destra', colore: 4 }
      ],
      didascalia: 'La pressione di un gas chiuso in un recipiente rigido, in funzione della temperatura in gradi Celsius. p_{0 °C} è la pressione a 0 °C. Qualunque valore abbia, la retta prolungata arriva a pressione zero a −273,15 °C. Sposta il cursore per cambiare la quantità di gas.'
    },
    /* il rimbalzo elastico su una parete: la componente perpendicolare cambia verso, quella parallela resta */
    urto: {
      tipo: 'piano', x: [0.6, 9.4], y: [-0.4, 6.4], assi: false, griglia: false, altezza: 460,
      elementi: [
        { tipo: 'poligono', colore: 'grigio', punti: [[6.5, -0.3], [7, -0.3], [7, 6.3], [6.5, 6.3]] },
        { tipo: 'testo', p: [7.15, 5.9], testo: 'parete', ancora: 'start' },
        { tipo: 'segmento', da: [5.5, 2.5], a: [6.5, 3], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [6.5, 3], a: [5.5, 3.5], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [6.5, 3], colore: 'grigio' },
        { tipo: 'vettore', da: [2.5, 0.5], a: [5.5, 2.5], etichetta: 'v', colore: 1, componenti: { etichette: ['v_x', 'v_y'], colore: 1 } },
        { tipo: 'vettore', da: [5.5, 3.5], a: [2.5, 5.5], etichetta: 'v′', posizione: 'destra', colore: 1, componenti: { etichette: ['v_x', 'v_y'], colore: 1 } },
        { tipo: 'vettore', da: [7, 3], a: [8.8, 3], etichetta: 'F', colore: 2 }
      ],
      didascalia: 'Una molecola prima (v, in basso) e dopo (v′, in alto) il rimbalzo. La componente perpendicolare alla parete cambia verso; quella parallela resta uguale. La molecola spinge la parete con una forza F.'
    },
    /* la velocità quadratica media cresce con la radice della temperatura; le molecole leggere corrono di più */
    velocita: {
      tipo: 'piano', x: [0, 600], y: [0, 2200], altezza: 440, passo: [100, 400], proporzioni: 'libere',
      etichette: { x: 'T (K)', y: 'v_{qm} (m/s)' },
      parametri: [{ nome: 'T', min: 50, max: 500, passo: 10, valore: 300, etichetta: 'T (K)' }],
      funzioni: [
        { f: 'sqrt(3*8.31*x/0.004)', colore: 1, etichetta: 'elio' },
        { f: 'sqrt(3*8.31*x/0.028)', colore: 1, tratteggio: true, etichetta: 'azoto' }
      ],
      elementi: [
        { tipo: 'verticale', x: 'T', colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['T', 'sqrt(3*8.31*T/0.004)'], etichetta: '{{sqrt(3*8.31*T/0.004)|0}} m/s', posizione: 'alto-sinistra', colore: 1 },
        { tipo: 'punto', p: ['T', 'sqrt(3*8.31*T/0.028)'], etichetta: '{{sqrt(3*8.31*T/0.028)|0}} m/s', posizione: 'alto-sinistra', colore: 1 }
      ],
      didascalia: 'La velocità quadratica media delle molecole di elio (linea piena) e di azoto (tratteggio) in funzione della temperatura assoluta. Alla stessa temperatura l\'elio, sette volte più leggero, corre circa 2,6 volte più veloce. Sposta il cursore per cambiare la temperatura.'
    }
  },
  esempi: [
    {
      titolo: 'La bolla del subacqueo',
      problema: R`Un subacqueo, a 15 m di profondità in un lago, lascia uscire una bolla d'aria di 2,0 cm³. La temperatura dell'acqua è la stessa dal fondo alla superficie. Che volume ha la bolla quando arriva in superficie? Usa $p_0 = 100\,\text{kPa}$ per la pressione dell'aria.`,
      passi: [
        R`Dati: $V_1 = 2{,}0\,\text{cm}^3$, $h = 15\,\text{m}$, $d = 1000\,\text{kg/m}^3$, $p_0 = 100\,\text{kPa}$. Cerco il volume $V_2$ in superficie.`,
        R`La pressione a 15 m viene dalla legge di Stevino: $p_1 = p_0 + d \cdot g \cdot h = 100\,000\,\text{Pa} + 1000 \cdot 9{,}8 \cdot 15\,\text{Pa} = 247\,000\,\text{Pa}$, cioè $247\,\text{kPa}$.`,
        R`In superficie la pressione è $p_2 = p_0 = 100\,\text{kPa}$. La temperatura non cambia e l'aria resta nella bolla: vale la legge di Boyle.`,
        R`$V_2 = V_1 \cdot \dfrac{p_1}{p_2} = 2{,}0\,\text{cm}^3 \cdot \dfrac{247\,\text{kPa}}{100\,\text{kPa}} \approx 4{,}9\,\text{cm}^3$.`,
        R`Controllo: $p_1 \cdot V_1 = 247 \cdot 2{,}0 = 494$ e $p_2 \cdot V_2 = 100 \cdot 4{,}94 = 494$, in kPa·cm³. Il prodotto è lo stesso. Per questo i sub risalgono piano e senza trattenere il fiato: l'aria nei polmoni si dilata allo stesso modo.`
      ],
      risultato: R`In superficie la bolla misura circa $4{,}9\,\text{cm}^3$.`
    },
    {
      titolo: 'Le gomme d\'inverno',
      problema: R`In un garage a 22 °C il manometro segna 2,0 bar su una gomma dell'auto. Di notte, fuori, la temperatura scende a −8 °C. Che cosa segna ora il manometro? Considera costante il volume della gomma e usa $p_0 = 1{,}0\,\text{bar}$.`,
      passi: [
        R`Dati: $p_{rel} = 2{,}0\,\text{bar}$, $t_1 = 22\,{}^\circ\text{C}$, $t_2 = -8\,{}^\circ\text{C}$, $p_0 = 1{,}0\,\text{bar}$, volume costante. Cerco la nuova pressione relativa $p_{rel,2}$.`,
        R`Il manometro segna la pressione relativa, ma nelle leggi dei gas serve quella assoluta: $p_1 = 2{,}0\,\text{bar} + 1{,}0\,\text{bar} = 3{,}0\,\text{bar}$.`,
        R`Le temperature in kelvin: $T_1 = (22 + 273)\,\text{K} = 295\,\text{K}$ e $T_2 = (-8 + 273)\,\text{K} = 265\,\text{K}$.`,
        R`A volume costante vale la seconda legge di Gay-Lussac: $p_2 = p_1 \cdot \dfrac{T_2}{T_1} = 3{,}0\,\text{bar} \cdot \dfrac{265\,\text{K}}{295\,\text{K}} \approx 2{,}7\,\text{bar}$.`,
        R`Il manometro segna la differenza con l'aria: $2{,}7\,\text{bar} - 1{,}0\,\text{bar} = 1{,}7\,\text{bar}$. Usando per errore la pressione relativa si troverebbe $2{,}0 \cdot \frac{265}{295} \approx 1{,}8\,\text{bar}$: lo sbaglio è piccolo, ma c'è.`
      ],
      risultato: R`Il manometro segna circa $1{,}7\,\text{bar}$: le gomme vanno ricontrollate quando arriva il freddo.`
    },
    {
      titolo: 'Quanta aria c\'è in un\'aula',
      problema: R`Un'aula è lunga 8 m, larga 6 m e alta 3 m. L'aria è a 100 kPa e 20 °C. Quante moli d'aria contiene? Che massa ha quell'aria, se la massa molare media dell'aria è 29 g/mol?`,
      passi: [
        R`Dati: $V = 8 \cdot 6 \cdot 3\,\text{m}^3 = 144\,\text{m}^3$, $p = 100\,\text{kPa}$, $t = 20\,{}^\circ\text{C}$, $M = 29\,\text{g/mol}$. Cerco $n$ e la massa $m$.`,
        R`Unità adatte a $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$: $p = 100\,000\,\text{Pa}$ e $T = (20 + 273)\,\text{K} = 293\,\text{K}$.`,
        R`Dall'equazione di stato: $n = \dfrac{p \cdot V}{R \cdot T} = \dfrac{100\,000 \cdot 144}{8{,}31 \cdot 293}\,\text{mol} \approx 5900\,\text{mol}$.`,
        R`La massa: $m = n \cdot M \approx 5900 \cdot 29\,\text{g} \approx 171\,000\,\text{g}$, cioè circa $171\,\text{kg}$.`,
        R`Controllo con la densità dell'aria, circa $1{,}2\,\text{kg/m}^3$: $1{,}2 \cdot 144 \approx 173\,\text{kg}$. Torna, a meno degli arrotondamenti.`
      ],
      risultato: R`Circa $5900$ moli, cioè circa $171\,\text{kg}$ d'aria: più di due persone adulte.`
    },
    {
      titolo: 'Quanti palloncini con una bombola',
      problema: R`Una bombola da 10 L contiene elio a 15 MPa. Con l'elio si gonfiano palloncini da 5,0 L, ognuno a 100 kPa, alla stessa temperatura della bombola. Quanti palloncini si riescono a gonfiare? Trascura la spinta in più della gomma dei palloncini.`,
      passi: [
        R`Dati: $V_1 = 10\,\text{L}$, $p_1 = 15\,\text{MPa} = 15\,000\,\text{kPa}$, palloncini da $5{,}0\,\text{L}$ a $p_2 = 100\,\text{kPa}$. Cerco il numero di palloncini.`,
        R`La temperatura non cambia: legge di Boyle. Tutto l'elio, portato a 100 kPa, occuperebbe $V_2 = V_1 \cdot \dfrac{p_1}{p_2} = 10\,\text{L} \cdot \dfrac{15\,000\,\text{kPa}}{100\,\text{kPa}} = 1500\,\text{L}$.`,
        R`La bombola però non si svuota del tutto. Quando dentro la pressione scende a 100 kPa, l'elio smette di uscire. Nella bombola restano 10 L di elio a 100 kPa.`,
        R`Nei palloncini vanno quindi $1500\,\text{L} - 10\,\text{L} = 1490\,\text{L}$ di elio a 100 kPa.`,
        R`Numero di palloncini: $\dfrac{1490\,\text{L}}{5{,}0\,\text{L}} = 298$.`
      ],
      risultato: R`Si gonfiano $298$ palloncini.`
    },
    {
      titolo: 'Quanto corrono le molecole di ossigeno',
      problema: R`Calcola la velocità quadratica media delle molecole di ossigeno, $\text{O}_2$, a −23 °C. La massa molare è 32 g/mol. Quanto vale l'energia cinetica media di una molecola?`,
      passi: [
        R`Dati: $M = 32\,\text{g/mol} = 0{,}032\,\text{kg/mol}$, $T = (-23 + 273)\,\text{K} = 250\,\text{K}$. Cerco $v_{qm}$ e l'energia cinetica media.`,
        R`La velocità: $v_{qm} = \sqrt{\dfrac{3 \cdot R \cdot T}{M}} = \sqrt{\dfrac{3 \cdot 8{,}31 \cdot 250}{0{,}032}}\,\text{m/s} \approx 441\,\text{m/s}$. Le unità: $\text{J/kg} = \text{m}^2/\text{s}^2$, e la radice dà i m/s.`,
        R`L'energia cinetica media: $\tfrac{3}{2} \cdot k \cdot T = 1{,}5 \cdot 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot 250\,\text{K} \approx 5{,}2 \cdot 10^{-21}\,\text{J}$.`,
        R`Controllo con la massa di una molecola: $m = \dfrac{M}{N_A} = \dfrac{0{,}032}{6{,}02 \cdot 10^{23}}\,\text{kg} \approx 5{,}3 \cdot 10^{-26}\,\text{kg}$. Allora $\tfrac{1}{2} \cdot m \cdot v_{qm}^2 \approx 0{,}5 \cdot 5{,}3 \cdot 10^{-26} \cdot 441^2\,\text{J} \approx 5{,}2 \cdot 10^{-21}\,\text{J}$. Torna.`
      ],
      risultato: R`$v_{qm} \approx 441\,\text{m/s}$; energia cinetica media $\approx 5{,}2 \cdot 10^{-21}\,\text{J}$ a molecola.`
    }
  ],
  formulario: [
    { nome: 'Bar', formula: R`1\,\text{bar} = 100\,\text{kPa}`, nota: R`Nelle leggi dei gas la pressione è quella assoluta: alla relativa del manometro si aggiunge quella dell'aria.` },
    { nome: 'Atmosfera', formula: R`1\,\text{atm} \approx 101{,}3\,\text{kPa}`, nota: R`La pressione dell'aria al livello del mare.` },
    { nome: 'Unità di volume', formula: R`1\,\text{L} = 10^{-3}\,\text{m}^3 \qquad 1\,\text{mL} = 1\,\text{cm}^3`, nota: R`Un litro è un decimetro cubo.` },
    { nome: 'Temperatura assoluta', formula: R`T = t + 273{,}15`, nota: R`$T$ in kelvin, $t$ in gradi Celsius. Lo zero assoluto è $0\,\text{K} = -273{,}15\,{}^\circ\text{C}$.` },
    { nome: 'Legge di Boyle (isoterma)', formula: R`p \cdot V = \text{cost.} \qquad p_1 \cdot V_1 = p_2 \cdot V_2`, nota: R`Temperatura e quantità di gas costanti. Grafico $p$–$V$: un ramo di iperbole.` },
    { nome: 'Prima legge di Gay-Lussac (isobara)', formula: R`\dfrac{V_1}{T_1} = \dfrac{V_2}{T_2}`, nota: R`Pressione e quantità di gas costanti, $T$ in kelvin. In gradi Celsius: $V = V_{0\,{}^\circ\text{C}} \cdot (1 + t / 273{,}15)$.` },
    { nome: 'Seconda legge di Gay-Lussac (isocora)', formula: R`\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}`, nota: R`Volume e quantità di gas costanti, $T$ in kelvin. In gradi Celsius: $p = p_{0\,{}^\circ\text{C}} \cdot (1 + t / 273{,}15)$.` },
    { nome: 'Equazione generale dei gas', formula: R`\dfrac{p_1 \cdot V_1}{T_1} = \dfrac{p_2 \cdot V_2}{T_2}`, nota: R`Quantità di gas costante. $p$ e $V$ in unità a scelta, uguali nei due stati; $T$ in kelvin.` },
    { nome: 'Numero di moli', formula: R`n = \dfrac{N}{N_A} \qquad n = \dfrac{m}{M}`, nota: R`$N_A \approx 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$; $M$ è la massa molare.` },
    { nome: 'Equazione di stato dei gas perfetti', formula: R`p \cdot V = n \cdot R \cdot T`, nota: R`$R \approx 8{,}31\,\text{J/(mol}\cdot\text{K)}$, con $p$ in pascal, $V$ in m³, $T$ in kelvin. Una mole a 0 °C e 1 atm occupa circa 22,4 L.` },
    { nome: 'Pressione dagli urti', formula: R`p \cdot V = \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2`, nota: R`$N$ molecole di massa $m$; $v_{qm}$ è la velocità quadratica media.` },
    { nome: 'Temperatura ed energia cinetica', formula: R`\tfrac{1}{2} \cdot m \cdot v_{qm}^2 = \tfrac{3}{2} \cdot k \cdot T`, nota: R`Energia cinetica media di traslazione di una molecola. $k = R / N_A \approx 1{,}38 \cdot 10^{-23}\,\text{J/K}$.` },
    { nome: 'Velocità quadratica media', formula: R`v_{qm} = \sqrt{\dfrac{3 \cdot R \cdot T}{M}}`, nota: R`Massa molare $M$ in kg/mol. $v_{qm}$ cresce con la radice di $T$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'stato', tipo: 'definizione', fronte: R`Quali sono le **variabili di stato** di un gas?`, retro: R`Pressione $p$, volume $V$, temperatura $T$, insieme alla quantità di gas.` },
    { id: 'fc-02', sezione: 'stato', tipo: 'concetto', fronte: R`Che differenza c'è fra pressione **assoluta** e pressione **relativa**?`, retro: R`L'assoluta è tutta la pressione del gas; la relativa, quella del manometro del gommista, è quanto supera l'aria di fuori. Nelle leggi dei gas serve l'assoluta.` },
    { id: 'fc-03', sezione: 'stato', tipo: 'procedura', fronte: R`Come si passa dai litri ai metri cubi?`, retro: R`Si divide per 1000: $1\,\text{L} = 1\,\text{dm}^3 = 10^{-3}\,\text{m}^3$.` },
    { id: 'fc-04', sezione: 'boyle', tipo: 'formula', fronte: R`La **legge di Boyle**`, retro: R`A temperatura costante, per una quantità fissa di gas: $p \cdot V = \text{costante}$, cioè $p_1 \cdot V_1 = p_2 \cdot V_2$.` },
    { id: 'fc-05', sezione: 'boyle', tipo: 'concetto', fronte: R`Che forma ha il grafico $p$–$V$ di un'**isoterma**?`, retro: R`Un ramo di iperbole: pressione e volume sono inversamente proporzionali.` },
    { id: 'fc-06', sezione: 'boyle', tipo: 'concetto', fronte: R`Quando **non** vale la legge di Boyle?`, retro: R`Se la temperatura cambia, se il gas esce o entra, o se si usa la pressione relativa al posto dell'assoluta.` },
    { id: 'fc-07', sezione: 'isobara', tipo: 'formula', fronte: R`La **prima legge di Gay-Lussac**`, retro: R`A pressione costante: $\dfrac{V}{T} = \text{costante}$, con $T$ in kelvin. In gradi Celsius: $V = V_{0\,{}^\circ\text{C}} \cdot (1 + t / 273{,}15)$.` },
    { id: 'fc-08', sezione: 'isobara', tipo: 'concetto', fronte: R`Che cosa hanno di speciale i gas rispetto alla dilatazione dei solidi e dei liquidi?`, retro: R`Si dilatano tutti allo stesso modo: $\frac{1}{273{,}15}$ del volume a 0 °C per ogni grado, a pressione costante.` },
    { id: 'fc-09', sezione: 'isocora', tipo: 'formula', fronte: R`La **seconda legge di Gay-Lussac**`, retro: R`A volume costante: $\dfrac{p}{T} = \text{costante}$, con $T$ in kelvin. In gradi Celsius: $p = p_{0\,{}^\circ\text{C}} \cdot (1 + t / 273{,}15)$.` },
    { id: 'fc-10', sezione: 'isocora', tipo: 'definizione', fronte: R`Che cos'è lo **zero assoluto**?`, retro: R`La temperatura più bassa possibile, $0\,\text{K} = -273{,}15\,{}^\circ\text{C}$. Lì le rette pressione–temperatura dei gas, prolungate, arrivano a pressione zero.` },
    { id: 'fc-11', sezione: 'isocora', tipo: 'concetto', fronte: R`Perché nelle leggi dei gas la temperatura va in kelvin?`, retro: R`Perché solo partendo dallo zero assoluto volume e pressione sono **proporzionali** alla temperatura. Con i gradi Celsius i rapporti vengono sbagliati.` },
    { id: 'fc-12', sezione: 'legge-generale', tipo: 'formula', fronte: R`L'**equazione generale** dei gas`, retro: R`Per una quantità fissa di gas: $\dfrac{p_1 \cdot V_1}{T_1} = \dfrac{p_2 \cdot V_2}{T_2}$.` },
    { id: 'fc-13', sezione: 'legge-generale', tipo: 'definizione', fronte: R`Che cosa resta costante in un'isoterma, in un'isobara, in un'isocora?`, retro: R`Isoterma: la temperatura. Isobara: la pressione. Isocora: il volume.` },
    { id: 'fc-14', sezione: 'equazione-stato', tipo: 'definizione', fronte: R`Che cos'è una **mole**?`, retro: R`La quantità che contiene $N_A \approx 6{,}02 \cdot 10^{23}$ particelle. Le moli si contano con $n = N / N_A$ oppure $n = m / M$.` },
    { id: 'fc-15', sezione: 'equazione-stato', tipo: 'concetto', fronte: R`Che cosa dice la **legge di Avogadro**?`, retro: R`Volumi uguali di gas diversi, alla stessa pressione e temperatura, contengono lo stesso numero di molecole.` },
    { id: 'fc-16', sezione: 'equazione-stato', tipo: 'formula', fronte: R`L'**equazione di stato** dei gas perfetti`, retro: R`$p \cdot V = n \cdot R \cdot T$, con $R \approx 8{,}31\,\text{J/(mol}\cdot\text{K)}$: pascal, metri cubi, kelvin.` },
    { id: 'fc-17', sezione: 'equazione-stato', tipo: 'concetto', fronte: R`Quanto spazio occupa una mole di gas a 0 °C e 1 atm?`, retro: R`Circa 22,4 L, qualunque sia il gas: è il volume molare.` },
    { id: 'fc-18', sezione: 'pressione-urti', tipo: 'definizione', fronte: R`Le ipotesi del **modello del gas perfetto**`, retro: R`Molecole piccolissime rispetto alle distanze, moto disordinato, nessuna forza tranne negli urti, urti elastici.` },
    { id: 'fc-19', sezione: 'pressione-urti', tipo: 'concetto', fronte: R`Da dove viene la **pressione** di un gas, secondo la teoria cinetica?`, retro: R`Dagli urti delle molecole contro le pareti: ognuno è un colpetto, e tutti insieme danno una forza media costante.` },
    { id: 'fc-20', sezione: 'pressione-urti', tipo: 'formula', fronte: R`La pressione in funzione delle molecole`, retro: R`$p \cdot V = \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2$: $N$ molecole di massa $m$, velocità quadratica media $v_{qm}$.` },
    { id: 'fc-21', sezione: 'temperatura-energia', tipo: 'formula', fronte: R`Il legame fra **temperatura** ed **energia cinetica** delle molecole`, retro: R`$\tfrac{1}{2} \cdot m \cdot v_{qm}^2 = \tfrac{3}{2} \cdot k \cdot T$: la temperatura assoluta è proporzionale all'energia cinetica media di traslazione.` },
    { id: 'fc-22', sezione: 'temperatura-energia', tipo: 'definizione', fronte: R`Che cos'è la **costante di Boltzmann**?`, retro: R`La costante dei gas per una sola molecola: $k = R / N_A \approx 1{,}38 \cdot 10^{-23}\,\text{J/K}$.` },
    { id: 'fc-23', sezione: 'temperatura-energia', tipo: 'concetto', fronte: R`Alla stessa temperatura, chi corre di più fra le molecole di elio e quelle di azoto?`, retro: R`L'elio: l'energia cinetica media è la stessa, e con una massa minore serve una velocità maggiore.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Esprimi 2,5 L in metri cubi.`, suggerimenti: [R`$1\,\text{L} = 10^{-3}\,\text{m}^3$.`], risposta: { tipo: 'numero', valore: 0.0025, unita: 'm³', soloUnita: true }, soluzione: [R`$V = 2{,}5 \cdot 10^{-3}\,\text{m}^3 = 0{,}0025\,\text{m}^3$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Esprimi 250 kPa in bar.`, suggerimenti: [R`$1\,\text{bar} = 100\,\text{kPa}$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'bar', soloUnita: true }, soluzione: [R`$p = \dfrac{250}{100}\,\text{bar} = 2{,}5\,\text{bar}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un gas è a −73 °C. Quanto vale la sua temperatura assoluta? Arrotonda 273,15 a 273.`, suggerimenti: [R`$T = t + 273$, con l'arrotondamento.`], risposta: { tipo: 'numero', valore: 200, unita: 'K' }, soluzione: [R`$T = (-73 + 273)\,\text{K} = 200\,\text{K}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un gas occupa 4 L a 180 kPa. A temperatura costante lo si comprime fino a 3 L. Che pressione raggiunge?`, suggerimenti: [R`Legge di Boyle: $p_1 \cdot V_1 = p_2 \cdot V_2$.`], risposta: { tipo: 'numero', valore: 240, unita: 'kPa' }, soluzione: [R`$p_2 = \dfrac{p_1 \cdot V_1}{V_2} = \dfrac{180\,\text{kPa} \cdot 4\,\text{L}}{3\,\text{L}} = 240\,\text{kPa}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un gas occupa 6 L a 70 kPa. A temperatura costante la sua pressione viene portata a 210 kPa. Quanto diventa il volume?`, suggerimenti: [R`Pressione tre volte più grande: e il volume?`], risposta: { tipo: 'numero', valore: 2, unita: 'L' }, soluzione: [R`$V_2 = \dfrac{p_1 \cdot V_1}{p_2} = \dfrac{70\,\text{kPa} \cdot 6\,\text{L}}{210\,\text{kPa}} = 2\,\text{L}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Una siringa tappata contiene 30 mL d'aria a 110 kPa. Tirando piano lo stantuffo, il volume arriva a 75 mL. Che pressione ha ora l'aria?`, suggerimenti: [R`La temperatura non cambia: legge di Boyle. I millilitri si semplificano.`], risposta: { tipo: 'numero', valore: 44, unita: 'kPa' }, soluzione: [R`$p_2 = \dfrac{110\,\text{kPa} \cdot 30\,\text{mL}}{75\,\text{mL}} = 44\,\text{kPa}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`A pressione costante 5 L di gas vengono scaldati da 250 K a 400 K. Quanto diventa il volume?`, suggerimenti: [R`Prima legge di Gay-Lussac: $\dfrac{V_1}{T_1} = \dfrac{V_2}{T_2}$.`], risposta: { tipo: 'numero', valore: 8, unita: 'L' }, soluzione: [R`$V_2 = V_1 \cdot \dfrac{T_2}{T_1} = 5\,\text{L} \cdot \dfrac{400\,\text{K}}{250\,\text{K}} = 8\,\text{L}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un gas a 600 K occupa 9 L. A pressione costante lo si raffredda fino a 200 K. Quanto diventa il volume?`, suggerimenti: [R`La temperatura assoluta diventa un terzo.`], risposta: { tipo: 'numero', valore: 3, unita: 'L' }, soluzione: [R`$V_2 = 9\,\text{L} \cdot \dfrac{200\,\text{K}}{600\,\text{K}} = 3\,\text{L}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`A 0 °C un gas occupa 2,73 L. A pressione costante lo si scalda fino a 273 °C. Quanto diventa il volume?`, suggerimenti: [R`Porta le temperature in kelvin.`, R`$T_1 = 273{,}15\,\text{K}$, $T_2 = 546{,}15\,\text{K}$.`], risposta: { tipo: 'numero', valore: 5.46, unita: 'L' }, soluzione: [R`$T_1 = 273{,}15\,\text{K}$, $T_2 = 546{,}15\,\text{K}$.`, R`$V_2 = 2{,}73\,\text{L} \cdot \dfrac{546{,}15}{273{,}15} \approx 5{,}46\,\text{L}$: la temperatura assoluta raddoppia, e il volume pure.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`In un recipiente rigido un gas è a 200 kPa e 250 K. Lo si scalda fino a 350 K. Che pressione raggiunge?`, suggerimenti: [R`Volume costante: $\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$.`], risposta: { tipo: 'numero', valore: 280, unita: 'kPa' }, soluzione: [R`$p_2 = p_1 \cdot \dfrac{T_2}{T_1} = 200\,\text{kPa} \cdot \dfrac{350\,\text{K}}{250\,\text{K}} = 280\,\text{kPa}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`In un recipiente rigido un gas ha pressione 60 kPa a 240 K. A che temperatura la pressione arriva a 80 kPa?`, suggerimenti: [R`Ricava $T_2$ da $\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$.`], risposta: { tipo: 'numero', valore: 320, unita: 'K' }, soluzione: [R`$T_2 = T_1 \cdot \dfrac{p_2}{p_1} = 240\,\text{K} \cdot \dfrac{80\,\text{kPa}}{60\,\text{kPa}} = 320\,\text{K}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`In un recipiente rigido un gas è a 160 kPa e 500 K. Lo si raffredda fino a 250 K. Che pressione ha ora?`, suggerimenti: [R`La temperatura assoluta si dimezza.`], risposta: { tipo: 'numero', valore: 80, unita: 'kPa' }, soluzione: [R`$p_2 = 160\,\text{kPa} \cdot \dfrac{250\,\text{K}}{500\,\text{K}} = 80\,\text{kPa}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Un gas occupa 12 L a 100 kPa e 200 K. Lo si porta a 150 kPa e 250 K, senza farlo uscire. Quanto diventa il volume?`, suggerimenti: [R`Equazione generale: $\dfrac{p_1 \cdot V_1}{T_1} = \dfrac{p_2 \cdot V_2}{T_2}$.`, R`$V_2 = V_1 \cdot \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1}$.`], risposta: { tipo: 'numero', valore: 10, unita: 'L' }, soluzione: [R`$V_2 = 12\,\text{L} \cdot \dfrac{100}{150} \cdot \dfrac{250}{200} = 12 \cdot \dfrac{2}{3} \cdot \dfrac{5}{4}\,\text{L} = 10\,\text{L}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Quante moli sono $1{,}204 \cdot 10^{24}$ molecole?`, suggerimenti: [R`$n = \dfrac{N}{N_A}$, con $N_A \approx 6{,}02 \cdot 10^{23}$.`], risposta: { tipo: 'numero', valore: 2, unita: 'mol' }, soluzione: [R`$n = \dfrac{1{,}204 \cdot 10^{24}}{6{,}02 \cdot 10^{23}}\,\text{mol} = 2\,\text{mol}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Quante moli sono 14 g di azoto, $\text{N}_2$? La massa molare è 28 g/mol.`, suggerimenti: [R`$n = \dfrac{m}{M}$.`], risposta: { tipo: 'numero', valore: 0.5, unita: 'mol' }, soluzione: [R`$n = \dfrac{14\,\text{g}}{28\,\text{g/mol}} = 0{,}5\,\text{mol}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Due moli di gas sono chiuse in $0{,}0831\,\text{m}^3$ a 500 K. Che pressione hanno? Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.`, suggerimenti: [R`$p = \dfrac{n \cdot R \cdot T}{V}$, in pascal.`], risposta: { tipo: 'numero', valore: 100, unita: 'kPa' }, soluzione: [R`$p = \dfrac{2 \cdot 8{,}31 \cdot 500}{0{,}0831}\,\text{Pa} = 100\,000\,\text{Pa} = 100\,\text{kPa}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Che volume occupano 4 mol di gas a 250 K e 83,1 kPa? Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.`, suggerimenti: [R`$V = \dfrac{n \cdot R \cdot T}{p}$, con la pressione in pascal.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'm³' }, soluzione: [R`$V = \dfrac{4 \cdot 8{,}31 \cdot 250}{83\,100}\,\text{m}^3 = 0{,}1\,\text{m}^3$, cioè 100 L.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Un gas a 200 kPa e 400 K occupa $0{,}0831\,\text{m}^3$. Quante moli sono? Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.`, suggerimenti: [R`$n = \dfrac{p \cdot V}{R \cdot T}$, con la pressione in pascal.`], risposta: { tipo: 'numero', valore: 5, unita: 'mol' }, soluzione: [R`$n = \dfrac{200\,000 \cdot 0{,}0831}{8{,}31 \cdot 400}\,\text{mol} = 5\,\text{mol}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Quanto vale l'energia cinetica media di traslazione di una molecola di gas a 400 K? Usa $k = 1{,}38 \cdot 10^{-23}\,\text{J/K}$.`, suggerimenti: [R`$\tfrac{3}{2} \cdot k \cdot T$.`], risposta: { tipo: 'numero', valore: 8.28e-21, unita: 'J' }, soluzione: [R`$\tfrac{3}{2} \cdot 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot 400\,\text{K} = 8{,}28 \cdot 10^{-21}\,\text{J}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Le molecole di un gas passano da 200 K a 1800 K. Quante volte diventa più grande la loro velocità quadratica media?`, suggerimenti: [R`$v_{qm}$ è proporzionale alla radice di $T$.`], risposta: { tipo: 'numero', valore: 3 }, soluzione: [R`La temperatura diventa 9 volte tanto; la velocità $\sqrt{9} = 3$ volte.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un recipiente chiuso da un pistone contiene aria. Il manometro, che segna la pressione relativa, indica 1,0 bar. A temperatura costante il volume si dimezza. Che cosa segna adesso il manometro? Usa $p_0 = 1{,}0\,\text{bar}$.`, suggerimenti: [R`La legge di Boyle vale per la pressione assoluta.`, R`All'inizio la pressione assoluta è 2,0 bar.`], risposta: { tipo: 'numero', valore: 3, unita: 'bar' }, soluzione: [R`Pressione assoluta iniziale: $1{,}0 + 1{,}0 = 2{,}0\,\text{bar}$.`, R`Volume metà: pressione assoluta doppia, $4{,}0\,\text{bar}$.`, R`Il manometro segna $4{,}0 - 1{,}0 = 3{,}0\,\text{bar}$, non 2,0 bar.`] },
    { id: 'es-02', difficolta: 2, testo: R`Calcola la densità dell'aria a 0 °C e 101,3 kPa. La massa molare media dell'aria è 29 g/mol.`, suggerimenti: [R`La densità è massa diviso volume, e la massa è $n \cdot M$.`, R`Da $p \cdot V = n \cdot R \cdot T$ si ottiene $d = \dfrac{p \cdot M}{R \cdot T}$.`], risposta: { tipo: 'numero', valore: 1.29, unita: 'kg/m³', tolleranza: 0.01 }, soluzione: [R`$d = \dfrac{m}{V} = \dfrac{n \cdot M}{V} = \dfrac{p \cdot M}{R \cdot T}$.`, R`$d = \dfrac{101\,300 \cdot 0{,}029}{8{,}31 \cdot 273{,}15}\,\text{kg/m}^3 \approx 1{,}29\,\text{kg/m}^3$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Il pallone di una mongolfiera ha un volume di 1800 m³. È aperto in basso: dentro la pressione è la stessa di fuori. Fuori l'aria è a 10 °C, con densità $1{,}23\,\text{kg/m}^3$. Dentro viene scaldata fino a 100 °C. Quale massa possono avere, al massimo, involucro, cesta e passeggeri?`, suggerimenti: [R`A pressione costante la densità di un gas è inversamente proporzionale alla temperatura assoluta.`, R`$d_{dentro} = 1{,}23 \cdot \dfrac{283}{373}\,\text{kg/m}^3$.`, R`La spinta regge l'aria calda e il carico: la massa massima è $(d_{fuori} - d_{dentro}) \cdot V$.`], risposta: { tipo: 'numero', valore: 534, unita: 'kg', tolleranza: 6 }, soluzione: [R`A pressione costante $d$ è proporzionale a $\dfrac{1}{T}$: $d_{dentro} = 1{,}23 \cdot \dfrac{283}{373}\,\text{kg/m}^3 \approx 0{,}933\,\text{kg/m}^3$.`, R`La spinta è il peso dell'aria fredda spostata; una parte serve a reggere l'aria calda nel pallone.`, R`Massa massima: $(1{,}23 - 0{,}933) \cdot 1800\,\text{kg} \approx 534\,\text{kg}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Sul fondo di un lago, a 30 m di profondità, l'acqua è a 4 °C. Una bolla d'aria di 1,0 cm³ sale fino alla superficie, dove l'acqua è a 24 °C. Che volume ha in superficie? Usa $p_0 = 100\,\text{kPa}$.`, suggerimenti: [R`Sul fondo $p_1 = p_0 + d \cdot g \cdot h$.`, R`Cambiano pressione e temperatura: equazione generale, con $T$ in kelvin.`], risposta: { tipo: 'numero', valore: 4.22, unita: 'cm³', tolleranza: 0.05 }, soluzione: [R`$p_1 = 100\,\text{kPa} + \dfrac{1000 \cdot 9{,}8 \cdot 30}{1000}\,\text{kPa} = 394\,\text{kPa}$; $p_2 = 100\,\text{kPa}$.`, R`$T_1 = 277\,\text{K}$, $T_2 = 297\,\text{K}$.`, R`$V_2 = 1{,}0\,\text{cm}^3 \cdot \dfrac{394}{100} \cdot \dfrac{297}{277} \approx 4{,}22\,\text{cm}^3$.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un palloncino contiene 12 L di elio a 105 kPa e 20 °C. La massa molare dell'elio è 4,0 g/mol. Che massa di elio contiene?`, suggerimenti: [R`Trova le moli con $n = \dfrac{p \cdot V}{R \cdot T}$, nel SI.`, R`Poi $m = n \cdot M$.`], risposta: { tipo: 'numero', valore: 2.07, unita: 'g', tolleranza: 0.03 }, soluzione: [R`$n = \dfrac{105\,000 \cdot 0{,}012}{8{,}31 \cdot 293}\,\text{mol} \approx 0{,}517\,\text{mol}$.`, R`$m = 0{,}517\,\text{mol} \cdot 4{,}0\,\text{g/mol} \approx 2{,}07\,\text{g}$: un palloncino da 12 L contiene appena due grammi di elio.`] },
    { id: 'es-06', difficolta: 2, testo: R`A che temperatura le molecole di idrogeno, $\text{H}_2$ ($M = 2{,}0\,\text{g/mol}$), hanno una velocità quadratica media di 2000 m/s?`, suggerimenti: [R`Da $v_{qm} = \sqrt{\dfrac{3 \cdot R \cdot T}{M}}$ ricava $T$.`, R`$T = \dfrac{v_{qm}^2 \cdot M}{3 \cdot R}$, con $M$ in kg/mol.`], risposta: { tipo: 'numero', valore: 321, unita: 'K', tolleranza: 3 }, soluzione: [R`$T = \dfrac{v_{qm}^2 \cdot M}{3 \cdot R} = \dfrac{2000^2 \cdot 0{,}0020}{3 \cdot 8{,}31}\,\text{K} \approx 321\,\text{K}$, circa 48 °C.`] },
    { id: 'es-07', difficolta: 2, testo: R`L'idrogeno, $\text{H}_2$, ha massa molare 2 g/mol; l'ossigeno, $\text{O}_2$, 32 g/mol. Alla stessa temperatura, quante volte sono più veloci le molecole di idrogeno? Confronta le velocità quadratiche medie.`, suggerimenti: [R`$v_{qm}$ è proporzionale a $\dfrac{1}{\sqrt{M}}$.`], risposta: { tipo: 'numero', valore: 4 }, soluzione: [R`$\dfrac{v_{H_2}}{v_{O_2}} = \sqrt{\dfrac{32}{2}} = \sqrt{16} = 4$.`, R`Stessa temperatura vuol dire stessa energia cinetica media. Con una massa 16 volte più piccola serve una velocità 4 volte più grande.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un barattolo di marmellata viene chiuso ancora caldo, con aria a 90 °C e 100 kPa sotto il coperchio. Poi si raffredda fino a 20 °C. Il coperchio ha una superficie di 40 cm², e fuori l'aria è a 100 kPa. Con che forza netta l'aria schiaccia il coperchio? Considera costante il volume dell'aria nel barattolo e trascura il vapore acqueo.`, suggerimenti: [R`Volume costante: $p_2 = p_1 \cdot \dfrac{T_2}{T_1}$.`, R`La forza netta è la differenza di pressione per la superficie, in m².`], risposta: { tipo: 'numero', valore: 77, unita: 'N', tolleranza: 2 }, soluzione: [R`$p_2 = 100\,\text{kPa} \cdot \dfrac{293}{363} \approx 80{,}7\,\text{kPa}$.`, R`Differenza di pressione: $100 - 80{,}7 = 19{,}3\,\text{kPa} = 19\,300\,\text{Pa}$; $40\,\text{cm}^2 = 0{,}0040\,\text{m}^2$.`, R`$F = 19\,300\,\text{Pa} \cdot 0{,}0040\,\text{m}^2 \approx 77\,\text{N}$: come un peso di quasi 8 kg sul coperchio. Ecco perché si apre a fatica.`] },
    { id: 'es-09', difficolta: 3, testo: R`Quante molecole ci sono in 1 cm³ d'aria a 0 °C e 101,3 kPa? Usa $k = 1{,}38 \cdot 10^{-23}\,\text{J/K}$.`, suggerimenti: [R`Con le molecole al posto delle moli: $p \cdot V = N \cdot k \cdot T$.`, R`$1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$.`], risposta: { tipo: 'numero', valore: 2.69e19, tolleranza: 5e17 }, soluzione: [R`$N = \dfrac{p \cdot V}{k \cdot T} = \dfrac{101\,300 \cdot 10^{-6}}{1{,}38 \cdot 10^{-23} \cdot 273{,}15} \approx 2{,}69 \cdot 10^{19}$.`, R`Quasi trenta miliardi di miliardi di molecole in un centimetro cubo.`] },
    { id: 'es-10', difficolta: 2, testo: R`Un sacchetto di patatine viene sigillato al livello del mare con 0,40 L d'aria a 101 kPa e 25 °C. In aereo la pressione in cabina è 78 kPa e la temperatura 20 °C. Quanto diventa il volume dell'aria nel sacchetto, se la plastica è abbastanza morbida?`, suggerimenti: [R`Cambiano pressione e temperatura: equazione generale.`, R`$V_2 = V_1 \cdot \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1}$, con $T$ in kelvin.`], risposta: { tipo: 'numero', valore: 0.509, unita: 'L' }, soluzione: [R`$T_1 = 298\,\text{K}$, $T_2 = 293\,\text{K}$.`, R`$V_2 = 0{,}40\,\text{L} \cdot \dfrac{101}{78} \cdot \dfrac{293}{298} \approx 0{,}51\,\text{L}$: il sacchetto si gonfia come un cuscino.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`A temperatura costante si dimezza il volume di un gas. La pressione…`, opzioni: [R`si dimezza`, R`resta la stessa`, R`raddoppia`, R`diventa quattro volte tanto`], corretta: 2, spiegazione: R`Per la legge di Boyle $p \cdot V$ resta costante: se $V$ si dimezza, $p$ raddoppia. Diventerebbe quattro volte solo con un volume ridotto a un quarto.` },
    { id: 'q-02', domanda: R`In una trasformazione isocora che cosa resta costante?`, opzioni: [R`Il volume`, R`La pressione`, R`La temperatura`, R`Il prodotto $p \cdot V$`], corretta: 0, spiegazione: R`Isocora vuol dire a volume costante. A pressione costante è un'isobara; a temperatura costante, e con $p \cdot V$ costante, è un'isoterma.` },
    { id: 'q-03', domanda: R`Perché nelle leggi dei gas la temperatura si scrive in kelvin?`, opzioni: [R`Perché il kelvin è più grande del grado Celsius`, R`Perché in gradi Celsius i conti vengono troppo lunghi`, R`Perché il termometro dei gas segna i kelvin`, R`Perché solo partendo dallo zero assoluto volume e pressione sono proporzionali alla temperatura`], corretta: 3, spiegazione: R`Le rette dei gas passano per lo zero assoluto: solo misurando da lì $V/T$ e $p/T$ restano costanti. Kelvin e grado Celsius sono grandi uguali; cambia solo lo zero.` },
    { id: 'q-04', domanda: R`Che forma ha il grafico pressione–volume di un'isoterma?`, opzioni: [R`Una retta per l'origine`, R`Un ramo di iperbole`, R`Una retta orizzontale`, R`Una parabola`], corretta: 1, spiegazione: R`Con $p \cdot V$ costante, $p$ è inversamente proporzionale a $V$: il grafico è un ramo di iperbole. La retta per l'origine è quella di $V$ in funzione di $T$ in un'isobara.` },
    { id: 'q-05', domanda: R`A volume costante si prolungano verso il freddo le rette pressione–temperatura di gas diversi. Dove arrivano a pressione zero?`, opzioni: [R`Tutte a −273,15 °C`, R`Tutte a 0 °C`, R`Ognuna in un punto diverso, secondo il gas`, R`Non arrivano mai a pressione zero`], corretta: 0, spiegazione: R`Qualunque gas e qualunque quantità: le rette puntano tutte a −273,15 °C, lo zero assoluto. Il gas vero, però, diventa liquido prima di arrivarci.` },
    { id: 'q-06', domanda: R`Alla stessa pressione e alla stessa temperatura, una mole di elio e una mole di anidride carbonica…`, opzioni: [R`occupano volumi diversi: l'anidride carbonica, più pesante, ne occupa di più`, R`occupano volumi diversi: l'elio, più veloce, ne occupa di più`, R`occupano lo stesso volume`, R`non si possono confrontare, perché sono gas diversi`], corretta: 2, spiegazione: R`Da $p \cdot V = n \cdot R \cdot T$, con $R$ uguale per tutti i gas, stesse $n$, $p$ e $T$ danno lo stesso $V$. È la legge di Avogadro: la massa delle molecole non conta.` },
    { id: 'q-07', domanda: R`Se la temperatura assoluta di un gas raddoppia, l'energia cinetica media di traslazione delle sue molecole…`, opzioni: [R`resta la stessa`, R`diventa $\sqrt{2}$ volte`, R`aumenta di 273 J`, R`raddoppia`], corretta: 3, spiegazione: R`L'energia cinetica media è $\tfrac{3}{2} \cdot k \cdot T$, proporzionale a $T$. È la velocità quadratica media a crescere di $\sqrt{2}$ volte.` },
    { id: 'q-08', domanda: R`Secondo la teoria cinetica, che cosa produce la pressione di un gas?`, opzioni: [R`Il peso delle molecole`, R`Gli urti delle molecole contro le pareti`, R`Le forze di attrazione fra le molecole`, R`Il calore delle pareti`], corretta: 1, spiegazione: R`Ogni molecola che rimbalza dà un colpetto alla parete; miliardi di miliardi di colpetti fanno una forza media costante. Non è il peso: il gas preme anche sul soffitto del recipiente.` },
    { id: 'q-09', domanda: R`Elio e azoto sono alla stessa temperatura. Le molecole di elio…`, opzioni: [R`hanno un'energia cinetica media più grande`, R`sono più lente, perché sono più piccole`, R`hanno la stessa energia cinetica media, ma sono più veloci`, R`hanno la stessa velocità media`], corretta: 2, spiegazione: R`Stessa temperatura, stessa energia cinetica media $\tfrac{3}{2} \cdot k \cdot T$. Le molecole di elio hanno massa minore, quindi devono correre di più.` },
    { id: 'q-10', domanda: R`Il manometro del gommista segna 2 bar. Che cosa misura?`, opzioni: [R`Quanto la pressione nella gomma supera quella dell'aria`, R`Tutta la pressione dell'aria nella gomma`, R`La forza dell'aria sulla gomma`, R`La pressione dell'aria di fuori`], corretta: 0, spiegazione: R`Segna la pressione relativa: la differenza fra dentro e fuori. La pressione assoluta nella gomma è circa 3 bar, ed è quella che va nelle leggi dei gas.` },
    { id: 'q-11', domanda: R`Che cosa si può dire dello zero assoluto?`, opzioni: [R`Si raggiunge facilmente con l'azoto liquido`, R`È la temperatura a cui gela l'acqua salata`, R`Vale −100 °C`, R`Non si può raggiungere: ci si può solo avvicinare`], corretta: 3, spiegazione: R`Lo zero assoluto, $0\,\text{K} = -273{,}15\,{}^\circ\text{C}$, è un limite. I laboratori arrivano a meno di un milionesimo di kelvin, ma mai a zero. L'azoto liquido è a circa 77 K, cioè −196 °C.` },
    { id: 'q-12', domanda: R`Per una quantità fissa di gas la pressione si dimezza e la temperatura assoluta raddoppia. Il volume…`, opzioni: [R`raddoppia`, R`diventa quattro volte tanto`, R`resta lo stesso`, R`si dimezza`], corretta: 1, spiegazione: R`$V$ è proporzionale a $T / p$: la temperatura doppia dà un fattore 2, la pressione metà un altro fattore 2. In tutto quattro volte.` },
    { id: 'q-13', domanda: R`Quale di questi numeri è la costante dei gas $R$?`, opzioni: [R`$8{,}31\,\text{J/(mol}\cdot\text{K)}$`, R`$6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$`, R`$1{,}38 \cdot 10^{-23}\,\text{J/K}$`, R`$22{,}4\,\text{L}$`], corretta: 0, spiegazione: R`$R \approx 8{,}31\,\text{J/(mol}\cdot\text{K)}$. $6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$ è il numero di Avogadro. $1{,}38 \cdot 10^{-23}\,\text{J/K}$ è la costante di Boltzmann, $k = R / N_A$. 22,4 L è il volume di una mole a 0 °C e 1 atm.` },
    { id: 'q-14', domanda: R`A pressione costante un gas passa da 10 °C a 20 °C. Il suo volume…`, opzioni: [R`raddoppia`, R`si dimezza`, R`aumenta di circa il 3,5%`, R`resta lo stesso`], corretta: 2, spiegazione: R`In kelvin si passa da 283 K a 293 K: il rapporto è circa 1,035. Il volume non raddoppia, perché 20 °C non è il doppio di 10 °C come temperatura assoluta.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nelle leggi dei gas la temperatura va **in kelvin**. 40 °C non è il doppio di 20 °C: è 313 K contro 293 K.` },
    { tipo: 'errore', testo: R`Il manometro del gommista segna la pressione relativa. Prima di usare una legge dei gas, aggiungi la pressione dell'aria.` },
    { tipo: 'errore', testo: R`In $p \cdot V = n \cdot R \cdot T$, con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, servono pascal, metri cubi e kelvin.` },
    { tipo: 'trucco', testo: R`Un chilopascal per un litro fa un joule. Quindi in $p \cdot V = n \cdot R \cdot T$ puoi usare anche kPa e litri insieme, senza convertire.` },
    { tipo: 'trucco', testo: R`Quando confronti due stati dello stesso gas, le unità di $p$ e $V$ si semplificano. Basta che siano le stesse prima e dopo.` },
    { tipo: 'metodo', testo: R`Prima dei conti chiediti che cosa resta costante: la temperatura (Boyle), la pressione o il volume (Gay-Lussac). Se non resta costante niente, usa l'equazione generale.` },
    { tipo: 'metodo', testo: R`Nella teoria cinetica la massa molare va in kg/mol: 28 g/mol sono 0,028 kg/mol. Altrimenti la velocità viene sbagliata di trenta volte.` },
    { tipo: 'trucco', testo: R`Una mole di gas, a 0 °C e 1 atm, occupa circa 22,4 L: un cubo di 28 cm di lato. Ti serve per controllare a occhio i risultati.` }
  ],
  aneddoti: [
    { fisico: 'Guillaume Amontons', anni: '1663–1705', titolo: 'Il freddo più grande calcolato con un termometro', testo: R`Guillaume Amontons era un fisico francese, sordo fin da ragazzo. Costruiva strumenti e li presentava all'Accademia delle scienze di Parigi. Nel 1702 descrisse un termometro ad aria. L'aria era chiusa in un bulbo e il suo volume restava fisso. La temperatura si leggeva dall'altezza di una colonna di mercurio, che misurava la pressione dell'aria. Amontons notò che a uguali aumenti di temperatura corrispondevano uguali aumenti di pressione. Allora si chiese che cosa sarebbe successo raffreddando sempre di più. A un certo punto l'aria non avrebbe più avuto pressione. Quello, pensò, doveva essere il freddo più grande possibile. Con le sue misure, quel limite cadeva intorno a −240 °C della nostra scala. È considerata la prima idea di uno zero assoluto.`, legame: R`È la seconda legge di Gay-Lussac, prolungata fino a pressione zero: lo zero assoluto.` },
    { fisico: 'Jacques Charles', anni: '1746–1823', titolo: 'Il pallone a idrogeno e la legge mai pubblicata', testo: R`Jacques Charles insegnava fisica a Parigi, con esperimenti che attiravano folle di curiosi. Nel 1783 costruì, con i fratelli Robert, il primo pallone gonfiato a idrogeno. Il 1° dicembre partì dal giardino delle Tuileries insieme a Nicolas-Louis Robert, davanti a una folla enorme. Atterrarono dopo circa due ore, a circa 35 chilometri da Parigi. Poi Charles ripartì da solo e salì a circa tremila metri. Sentì un freddo intenso e un forte dolore alle orecchie. Non volò mai più. Qualche anno dopo misurò come si dilatano i gas scaldati, e vide che gas diversi crescono tutti allo stesso modo. Non pubblicò niente. Lo sappiamo perché nel 1802 Gay-Lussac, presentando la stessa legge, scrisse che Charles l'aveva già notata quindici anni prima.`, legame: R`In molti libri la prima legge di Gay-Lussac si chiama anche legge di Charles.` },
    { fisico: 'Amedeo Avogadro', anni: '1776–1856', titolo: 'L\'ipotesi rimasta in ombra per cinquant\'anni', testo: R`Amedeo Avogadro era un nobile torinese. Si laureò in legge, poi passò alla fisica e insegnò all'Università di Torino. Nel 1811 pubblicò un'ipotesi audace. Volumi uguali di gas diversi, alla stessa pressione e temperatura, contengono lo stesso numero di molecole. L'idea spiegava gli esperimenti di Gay-Lussac sulle reazioni fra gas. Ma quasi nessuno la accettò, e Avogadro morì nel 1856 senza vederla affermata. Nel 1860 i chimici si riunirono a Karlsruhe, in Germania, per mettersi d'accordo sulle masse degli atomi. Il palermitano Stanislao Cannizzaro fece distribuire un suo opuscolo, costruito proprio sull'ipotesi di Avogadro. Il chimico tedesco Lothar Meyer lo lesse durante il viaggio di ritorno. Raccontò poi che, leggendolo, gli era sembrato di vedere chiaro all'improvviso.`, legame: R`Dalla legge di Avogadro viene la costante $R$, uguale per tutti i gas, e l'equazione $p \cdot V = n \cdot R \cdot T$.` },
    { fisico: 'Daniel Bernoulli', anni: '1700–1782', titolo: 'Il gas fatto di particelle, un secolo prima', testo: R`Nel 1738 il matematico svizzero Daniel Bernoulli pubblicò a Strasburgo il libro *Hydrodynamica*. Quasi tutto il libro parla di liquidi in movimento. Nel decimo capitolo però c'è un'idea nuova. Bernoulli immagina un gas chiuso in un cilindro, sotto un pistone caricato con un peso. Il gas è fatto di particelle piccolissime che corrono in tutte le direzioni. Il pistone resta su perché le particelle lo colpiscono di continuo. Se si schiaccia il gas, gli urti diventano più frequenti e la pressione cresce. Così Bernoulli ritrova la legge di Boyle. E aggiunge che, scaldando il gas, le particelle vanno più veloci. Era la teoria cinetica, con un secolo di anticipo. Rimase quasi ignorata fino all'Ottocento, quando Joule, Clausius e Maxwell la ripresero.`, legame: R`È l'idea della pressione fatta di urti, da cui viene $p \cdot V = \tfrac{1}{3} \cdot N \cdot m \cdot v_{qm}^2$.` },
    { fisico: 'James Clerk Maxwell', anni: '1831–1879', titolo: 'La viscosità dell\'aria misurata in soffitta', testo: R`Nel 1860 James Clerk Maxwell usò la teoria cinetica per prevedere l'attrito interno di un gas, la sua viscosità. Il risultato era strano. La viscosità non doveva dipendere dalla pressione: un gas rarefatto avrebbe frenato un oggetto quanto un gas denso. Maxwell stesso lo trovò inatteso. Qualche anno dopo decise di metterlo alla prova. Nella soffitta della sua casa di Londra montò dei dischi di vetro che oscillavano dentro un recipiente chiuso. Lo aiutava la moglie Katherine. Toglievano aria, cambiavano la pressione e misuravano quanto in fretta le oscillazioni si spegnevano. Al variare della pressione la viscosità restava la stessa, come diceva la teoria. Per cambiare la temperatura scaldavano la stanza con il fuoco: col caldo la viscosità cresceva, e più in fretta del previsto. Maxwell presentò i risultati alla Royal Society nel 1866.`, legame: R`Fu una delle prime conferme sperimentali della teoria cinetica dei gas.` }
  ]
});
})();
