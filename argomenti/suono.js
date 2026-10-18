/* Quanto — Il suono (quarto anno): onda di pressione, velocità ed eco, altezza e timbro, intensità, decibel,
   effetto Doppler, risonanza e canne, battimenti. Contratto in SCHEMA.md, modello cinematica.js.
   Simboli come in onde.js (λ, f, T, v = λ·f, A) e nei video: I intensità, I_0 soglia, L livello, u velocità della
   sorgente, f′ frequenza ricevuta, f_0 frequenza propria, f_1 e f_2 nei battimenti. Il suono nell'aria a 340 m/s
   come nei video (343 m/s a 20 °C, come la tabella di onde.js).
   Verifica: node strumenti/verifica-argomento.js argomenti/suono.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'suono',
  titolo: 'Il suono',
  introduzione: R`Un tuono, una voce, una nota di chitarra: tutto quello che senti arriva all'orecchio come un'onda. Il **suono** è un'onda meccanica. Viaggia nell'aria, ma anche nell'acqua e nei solidi. Fa vibrare il timpano, e il cervello trasforma quella vibrazione in una sensazione.

Con le idee delle onde si spiegano molte esperienze di tutti i giorni. Perché il tuono arriva dopo il lampo? Che differenza c'è fra una nota acuta e una grave? Perché la sirena dell'ambulanza cambia nota quando passa? Le stesse idee servono a medici e ingegneri: l'ecografia, il sonar delle navi, le sale da concerto, le misure del rumore.

Serve conoscere le onde: lunghezza d'onda, frequenza, la relazione $v = \lambda \cdot f$, le onde stazionarie. Per i decibel serve anche il logaritmo in base 10.`,
  inBreve: [
    R`Il suono è un'onda **longitudinale** di pressione: compressioni e rarefazioni che viaggiano. Nel vuoto non si propaga.`,
    R`Nell'aria il suono va a circa $340\,\text{m/s}$, nei liquidi e nei solidi più veloce. Dal lampo al tuono: circa 3 secondi per ogni chilometro.`,
    R`L'**altezza** è la frequenza, l'**intensità** cresce con il quadrato dell'ampiezza, il **timbro** dipende dalla forma dell'onda, cioè dalle armoniche.`,
    R`Il **livello sonoro** è $L = 10 \cdot \log_{10} \dfrac{I}{I_0}$, in decibel. Ogni 10 dB in più l'intensità è dieci volte tanta; 3 dB in più vuol dire circa il doppio.`,
    R`**Effetto Doppler**: una sorgente che si avvicina si sente più acuta, una che si allontana più grave. Cambia la frequenza ricevuta, non quella emessa.`,
    R`**Risonanza**: spinto alla sua frequenza propria, un oggetto oscilla sempre di più. Due note vicine danno $f_2 - f_1$ **battimenti** al secondo.`
  ],
  sezioni: [
    {
      id: 'onda-pressione',
      titolo: 'Il suono, un\'onda di pressione',
      testo: R`Appoggia la mano su una cassa che suona forte: la senti vibrare. Ogni suono nasce da qualcosa che vibra. Può essere una corda, la membrana di un altoparlante, le corde vocali.

La membrana va avanti e spinge l'aria che ha davanti. Quell'aria si comprime e spinge a sua volta l'aria vicina. Poi la membrana torna indietro, e lì l'aria si dirada. La spinta passa da uno strato d'aria all'altro, e così viaggia.

[[video:suono/suono]]

Dove l'aria è più fitta c'è una **compressione**: la pressione è un po' più alta del normale. Dove è più rada c'è una **rarefazione**: la pressione è un po' più bassa. Compressioni e rarefazioni corrono lungo il tubo, alla stessa distanza l'una dall'altra.

[[grafico:tubo]]

>* Il **suono** è un'onda meccanica **longitudinale**: compressioni e rarefazioni del mezzo che si propagano. Ogni strato d'aria oscilla avanti e indietro, lungo la direzione dell'onda, attorno al suo posto.

La distanza fra due compressioni vicine è la lunghezza d'onda $\lambda$. Le variazioni di pressione sono piccolissime. L'aria è a circa $100\,000\,\text{Pa}$, e una voce normale la fa oscillare di qualche centesimo di pascal.

Il suono ha bisogno di un mezzo. Nel vuoto non c'è niente da comprimere, e il suono non passa. Per questo nello spazio un'esplosione non si sente. La luce invece viaggia anche nel vuoto: è un'onda di un altro tipo.

>! L'aria non viaggia con il suono. Quando parli non soffi l'aria fino all'orecchio di chi ascolta: viaggia la perturbazione. Ogni strato d'aria resta vicino a casa.

?? Due astronauti fluttuano fuori dalla stazione spaziale, a pochi metri l'uno dall'altro, senza radio. Uno grida. L'altro lo sente?
[ ] sì, perché sono vicini
[x] no, perché fra loro non c'è aria
[ ] sì, ma più debole che sulla Terra
=> Il suono ha bisogno di un mezzo che si comprima e si diradi. Nel vuoto non c'è. Se però i due caschi si toccano, il suono passa attraverso i caschi.`
    },
    {
      id: 'velocita',
      titolo: 'La velocità del suono e l\'eco',
      testo: R`Durante un temporale vedi il lampo e senti il tuono qualche secondo dopo. Eppure nascono insieme, nello stesso fulmine. La luce va a circa $3 \cdot 10^8\,\text{m/s}$ e arriva quasi subito. Il suono è circa un milione di volte più lento.

>* Nell'aria il suono viaggia a circa $340\,\text{m/s}$. La velocità dipende dal mezzo e dalla sua temperatura. Non dipende dalla frequenza né dal volume.

Nell'aria la velocità cresce di circa 0,6 m/s per ogni grado in più:

$$v \approx (331 + 0{,}6 \cdot t_C)\,\text{m/s}$$

Qui $t_C$ è la temperatura in gradi Celsius, scritta senza unità. A 0 °C il suono va a 331 m/s, a 20 °C a 343 m/s. Nei problemi, se non è detto altro, si usa $340\,\text{m/s}$. Nell'acqua il suono è circa quattro volte più veloce, nell'acciaio più di quindici volte.

Dal ritardo del tuono si ricava la distanza del fulmine. Il suono viaggia a velocità costante: è un moto uniforme.

~ d = v \cdot t :: moto uniforme del suono
~ d = 340\,\text{m/s} \cdot 6\,\text{s} :: fra lampo e tuono contiamo 6 secondi
~ d = \evidb{2040\,\text{m}} \approx 2\,\text{km} :: il tempo della luce, pochi milionesimi di secondo, si trascura

> Una regola pratica: il suono fa un chilometro in circa 3 secondi. I secondi fra lampo e tuono, divisi per 3, danno i chilometri.

### L'eco

Il suono rimbalza sugli ostacoli grandi: una parete di roccia, un palazzo. L'onda riflessa torna indietro, ed è l'**eco**. Il suono fa la strada due volte, all'andata e al ritorno.

~ 2 \cdot d = v \cdot t :: andata e ritorno: il suono percorre il doppio della distanza
~ d = \dfrac{v \cdot t}{2} = \dfrac{340\,\text{m/s} \cdot 0{,}5\,\text{s}}{2} :: l'eco torna dopo mezzo secondo
~ d = \evidb{85\,\text{m}} :: la parete è a 85 metri

L'orecchio separa due suoni se arrivano a più di un decimo di secondo l'uno dall'altro. Davanti a una parete più vicina di 17 m circa, l'eco si mescola alla voce. Si sente un rimbombo, non una ripetizione. Con l'eco funzionano anche il **sonar** delle navi e l'ecoscandaglio dei pescatori.

>! Con l'eco il tempo misurato è di andata e ritorno. La distanza è metà di $v \cdot t$: dimenticarlo è l'errore più comune.

?? Una nota acuta e una grave partono insieme dal palco. Quale arriva prima in fondo alla sala?
[ ] l'acuta, perché ha la frequenza più alta
[ ] la grave, perché ha le onde più lunghe
[x] arrivano insieme
=> Nell'aria tutti i suoni hanno la stessa velocità, qualunque sia la frequenza. Se no, le note di un accordo arriverebbero sfasate in fondo alla sala.`
    },
    {
      id: 'altezza-timbro',
      titolo: 'Altezza e timbro',
      testo: R`Il fischio di un arbitro è acuto, il rombo di un camion è grave. In fisica questa qualità si chiama **altezza**. Non ha niente a che fare con il volume.

Un microfono misura la pressione dell'aria istante per istante. Per un suono puro, come quello di un diapason, il grafico della pressione è una sinusoide. Contando le oscillazioni in un secondo si trova la frequenza.

[[video:suono/altezza-intensita]]

>* L'**altezza** di un suono è la sua frequenza $f$: più oscillazioni al secondo, suono più acuto. L'orecchio umano sente circa da $20\,\text{Hz}$ a $20\,000\,\text{Hz}$.

[[grafico:microfono]]

Sotto i 20 Hz ci sono gli **infrasuoni**: li producono i terremoti, e li usano gli elefanti per chiamarsi. Sopra i 20 000 Hz ci sono gli **ultrasuoni**: li usano i pipistrelli per orientarsi e i medici nell'ecografia. Con l'età il limite alto scende.

Dalla frequenza si ricava la lunghezza d'onda nell'aria:

~ \lambda = \dfrac{v}{f} :: la relazione delle onde, $v = \lambda \cdot f$, girata
~ \lambda = \dfrac{340\,\text{m/s}}{20\,\text{Hz}} = \evidb{17\,\text{m}} :: il suono più grave che si sente
~ \lambda = \dfrac{340\,\text{m/s}}{20\,000\,\text{Hz}} = \evidb{1{,}7\,\text{cm}} :: il più acuto

### Il timbro

Un flauto e un violino suonano la stessa nota, e li distingui lo stesso a occhi chiusi. La frequenza è la stessa, ma l'onda ha un'altra forma.

Uno strumento non vibra a una sola frequenza. La **fondamentale** $f_1$ è la prima armonica. Insieme a lei suonano le **armoniche** successive, a $2 \cdot f_1$, $3 \cdot f_1$ e così via. La forma dell'onda dipende da quanto pesa ciascuna armonica. L'onda però si ripete sempre con il periodo della fondamentale: per questo la nota resta quella.

>* Il **timbro** distingue due suoni con la stessa altezza e la stessa intensità. Dipende dalla forma dell'onda, cioè dal miscuglio di armoniche.

[[grafico:timbro]]

>! Altezza e volume sono due cose diverse. Un suono può essere acuto e debolissimo, come una zanzara. Può essere grave e fortissimo, come un tuono.

?? Una nota passa da 220 Hz a 440 Hz, con la stessa ampiezza. Che cosa cambia?
[x] diventa più acuta, e la lunghezza d'onda si dimezza
[ ] diventa più forte
[ ] va più veloce
=> La frequenza è l'altezza: frequenza doppia, nota più acuta. La velocità resta quella dell'aria, quindi $\lambda = v/f$ si dimezza. Il volume dipende dall'ampiezza, che non è cambiata.`
    },
    {
      id: 'intensita',
      titolo: 'L\'intensità del suono',
      testo: R`Una persona può sussurrare o gridare la stessa nota. Cambia quanto l'aria si comprime e si dirada, cioè l'**ampiezza** dell'onda. Un'onda più ampia porta più energia ogni secondo.

>* L'**intensità** $I$ di un suono è la potenza che l'onda porta su ogni metro quadrato: $I = \dfrac{P}{S}$, in $\text{W/m}^2$. La superficie $S$ è perpendicolare alla direzione dell'onda. Qui $P$ è la potenza in watt, non quella di una lente.

A parità di frequenza, l'intensità cresce con il **quadrato dell'ampiezza**. Ampiezza doppia, intensità quattro volte. Ampiezza tripla, intensità nove volte.

Una sorgente piccola manda il suono in tutte le direzioni. A distanza $r$ la sua potenza si stende sulla superficie di una sfera, $4\pi \cdot r^2$:

$$I = \dfrac{P}{4\pi \cdot r^2}$$

È la legge dell'inversa del quadrato della distanza, come per la luce di una lampadina. Distanza doppia, intensità un quarto. Vale all'aperto, lontano da pareti che riflettono il suono.

~ I = \dfrac{P}{4\pi \cdot r^2} :: la potenza si stende su una sfera di raggio r
~ I = \dfrac{0{,}5\,\text{W}}{4\pi \cdot (10\,\text{m})^2} :: un altoparlante che emette 0,5 W di suono, ascoltato a 10 m
~ I = \dfrac{0{,}5\,\text{W}}{1257\,\text{m}^2} \approx \evidb{4 \cdot 10^{-4}\,\text{W/m}^2} :: la sfera ha circa 1257 m² di superficie

[[grafico:distanza]]

> La potenza del suono è piccola. Una persona che parla emette circa $10^{-5}\,\text{W}$. Per arrivare ai 10 W di una lampadina servirebbe un milione di persone che parlano insieme.

>! Potenza e intensità non sono la stessa cosa. La potenza è della sorgente e non cambia. L'intensità dipende da dove ti trovi: cala allontanandoti.

?? Ti allontani da un altoparlante: la distanza passa da 3 m a 6 m. L'intensità del suono che ti arriva…
[ ] si dimezza
[x] diventa un quarto
[ ] resta uguale, perché l'altoparlante è lo stesso
=> La potenza si stende su una sfera di raggio doppio, con superficie quattro volte più grande. Ogni metro quadrato ne riceve un quarto.`
    },
    {
      id: 'decibel',
      titolo: 'Il livello sonoro e i decibel',
      testo: R`L'orecchio è uno strumento straordinario. Sente un suono di appena $10^{-12}\,\text{W/m}^2$. Sopporta, con dolore, circa $1\,\text{W/m}^2$. Fra il più debole e il più forte c'è un fattore di mille miliardi.

[[video:suono/decibel]]

Con numeri così diversi conviene contare i **fattori dieci**. Il suono più debole che si sente è la **soglia di udibilità**, $I_0 = 10^{-12}\,\text{W/m}^2$. Ogni volta che l'intensità si moltiplica per 10, si sale di un gradino. Ogni gradino vale 10 decibel.

>* Il **livello sonoro** di un suono di intensità $I$ è $L = 10 \cdot \log_{10} \dfrac{I}{I_0}$, con $I_0 = 10^{-12}\,\text{W/m}^2$. Si misura in **decibel** (dB).

~ \dfrac{I}{I_0} = \dfrac{10^{-4}\,\text{W/m}^2}{10^{-12}\,\text{W/m}^2} = 10^{8} :: una strada molto trafficata
~ L = 10 \cdot \log_{10} 10^{8}\,\text{dB} :: il logaritmo in base 10 conta i fattori dieci: vale 8
~ L = \evidb{80\,\text{dB}} :: otto gradini sopra la soglia

[[grafico:scala]]

Per tornare dal livello all'intensità si fa il conto al contrario: $I = I_0 \cdot 10^{L/10}$.

### Due sorgenti uguali

Due altoparlanti uguali suonano insieme. Ognuno, da solo, dà 70 dB. Le intensità si sommano, i decibel no.

~ I_\text{tot} = 2 \cdot I :: due sorgenti uguali: intensità doppia
~ L_\text{tot} = 10 \cdot \log_{10} \dfrac{2 \cdot I}{I_0} = 10 \cdot \log_{10} 2 + L :: il logaritmo di un prodotto è la somma dei logaritmi
~ L_\text{tot} \approx 3\,\text{dB} + 70\,\text{dB} = \evidb{73\,\text{dB}} :: perché $\log_{10} 2 \approx 0{,}30$

[[grafico:sorgenti]]

>! I decibel non si sommano. Due sorgenti da 70 dB non fanno 140 dB, ma 73 dB. Ne servono dieci uguali per salire di 10 dB.

> Sopra gli 85 dB, ascoltati per ore, i suoni danneggiano l'orecchio. Le cuffie al massimo del volume possono superare i 100 dB.

?? Il livello sonoro passa da 50 dB a 70 dB. Di quanto è cresciuta l'intensità?
[ ] è diventata doppia
[ ] è diventata 20 volte tanto
[x] è diventata 100 volte tanto
=> 20 dB sono due gradini da 10 dB. L'intensità si moltiplica per 10 due volte: $10 \cdot 10 = 100$.`
    },
    {
      id: 'doppler',
      titolo: 'L\'effetto Doppler',
      testo: R`Un'ambulanza ti passa accanto a sirena accesa. Mentre arriva la nota è più acuta. Appena ti supera, di colpo, diventa più grave. Eppure la sirena suona sempre la stessa nota.

[[video:suono/doppler]]

La sirena manda una cresta, cioè una compressione, ogni periodo $T$. Se è ferma, le creste sono cerchi con lo stesso centro, distanti $\lambda$. Se si muove verso di te a velocità $u$, fra una cresta e l'altra avanza di $u \cdot T$. Davanti le creste si ammucchiano, dietro si allargano.

[[grafico:creste]]

~ \lambda' = \lambda - u \cdot T = (v - u) \cdot T :: davanti, ogni cresta parte più vicina alla precedente
~ f' = \dfrac{v}{\lambda'} = \dfrac{v}{(v - u) \cdot T} :: le creste viaggiano comunque a velocità v
~ f' = \evidb{f \cdot \dfrac{v}{v - u}} :: perché $1/T = f$

>* **Effetto Doppler**: se sorgente e ascoltatore si avvicinano, la frequenza ricevuta $f'$ è più alta di quella emessa $f$; se si allontanano, è più bassa. Sorgente a velocità $u$, ascoltatore fermo: $f' = f \cdot \dfrac{v}{v - u}$ se si avvicina, $f' = f \cdot \dfrac{v}{v + u}$ se si allontana.

Esempio. Un treno a 40 m/s, cioè 144 km/h, suona una tromba a 480 Hz. Chi aspetta sul binario sente:

~ f' = 480\,\text{Hz} \cdot \dfrac{340}{340 - 40} = \evidb{544\,\text{Hz}} :: mentre il treno arriva; v e u in m/s, le unità si semplificano
~ f' = 480\,\text{Hz} \cdot \dfrac{340}{340 + 40} \approx \evidb{429\,\text{Hz}} :: dopo che è passato

> Se si muove l'ascoltatore, e la sorgente è ferma, le creste non si ammucchiano. È chi ascolta che ne incontra di più ogni secondo: $f' = f \cdot \dfrac{v + u}{v}$ andando verso la sorgente, $f' = f \cdot \dfrac{v - u}{v}$ allontanandosi.

L'effetto Doppler vale per tutte le onde. Gli autovelox radar lo usano per misurare la velocità delle auto. L'ecografia Doppler misura la velocità del sangue nei vasi sanguigni.

>! La sorgente emette sempre la stessa frequenza: cambia quella che arriva. E cambia l'altezza, non il volume. Il suono è più forte solo perché la sirena è più vicina.

?? Un'auto si allontana da te in linea retta, a velocità costante, suonando il clacson. Che cosa senti?
[ ] una nota più acuta di quella del clacson
[x] una nota più grave, che resta la stessa
[ ] una nota che si abbassa sempre di più
=> Allontanandosi la sorgente allarga le creste: $f' = f \cdot \dfrac{v}{v + u}$, più bassa. Con $u$ costante anche $f'$ è costante. Il calo è brusco solo nell'attimo in cui l'auto ti passa accanto.`
    },
    {
      id: 'risonanza',
      titolo: 'La risonanza',
      testo: R`Su un'altalena, per salire in alto non serve spingere forte. Serve spingere al momento giusto, una volta a ogni oscillazione.

Ogni oggetto che può oscillare ha una frequenza preferita. Se lo lasci libero dopo un colpo, oscilla proprio a quella: è la **frequenza propria** $f_0$. Un bicchiere colpito fa «din» alla sua frequenza propria.

[[video:suono/risonanza]]

>* **Risonanza**: una forza periodica spinge un oggetto alla sua frequenza propria $f_0$. Allora l'ampiezza delle oscillazioni è la più grande possibile.

Lontano da $f_0$ molte spinte arrivano nel momento sbagliato e frenano. Con $f = f_0$ ogni spinta arriva in fase con il moto e aggiunge energia. L'ampiezza cresce finché l'attrito non porta via tutta l'energia che entra a ogni oscillazione. Qui attrito vuol dire tutto quello che smorza l'oscillazione.

~ f_0 = \dfrac{1}{T_0} = \dfrac{1}{2{,}5\,\text{s}} :: un'altalena che fa un'oscillazione ogni 2,5 s
~ f_0 = \evidb{0{,}4\,\text{Hz}} :: per la risonanza, una spinta ogni 2,5 s

[[grafico:curva]]

Con poco attrito il picco è alto e stretto. Con molto attrito è basso e largo. Un bicchiere di cristallo sottile ha pochissimo attrito: una nota fortissima, proprio alla sua frequenza, lo può rompere.

### Le canne degli strumenti a fiato

Anche l'aria in un tubo ha le sue frequenze proprie. Dentro si formano onde stazionarie, come su una corda. A un'estremità chiusa l'aria non si può muovere: c'è un nodo dello spostamento. Lì, invece, la pressione oscilla al massimo. A un'estremità aperta l'aria si muove al massimo: c'è un ventre dello spostamento.

>* In una canna **aperta** ai due capi, lunga $\ell$, la fondamentale ha $\lambda_1 = 2 \cdot \ell$. Le armoniche sono $f_n = n \cdot \dfrac{v}{2 \cdot \ell}$. In una canna **chiusa** a un capo $\lambda_1 = 4 \cdot \ell$, e ci sono solo le armoniche dispari: $f_1$, $3 \cdot f_1$, $5 \cdot f_1$…

~ \lambda_1 = 4 \cdot \ell = 4 \cdot 0{,}25\,\text{m} = 1\,\text{m} :: una provetta lunga 25 cm: dal fondo chiuso alla bocca c'è un quarto d'onda
~ f_1 = \dfrac{v}{\lambda_1} = \dfrac{340\,\text{m/s}}{1\,\text{m}} = \evidb{340\,\text{Hz}} :: soffiando sulla bocca si sente questa nota

>! Per la risonanza non serve una forza grande: serve la frequenza giusta.

> Il ponte di Tacoma, crollato nel 1940, è spesso citato come esempio di risonanza. Ma quel giorno il vento soffiava costante, senza un ritmo da seguire. Era il ponte stesso, torcendosi, a cambiare la spinta del vento. A ogni oscillazione ne riceveva un po' di energia in più. È un fenomeno diverso dalla risonanza: si chiama *flutter*, o instabilità aeroelastica.

?? Un oggetto ha frequenza propria 50 Hz. Una forza periodica lo spinge. Con quale frequenza della forza oscilla di più?
[ ] 100 Hz
[x] 50 Hz
[ ] 25 Hz
=> L'ampiezza è massima quando la forza ha la frequenza propria. A 100 Hz o a 25 Hz molte spinte arrivano contro il moto.`
    },
    {
      id: 'battimenti',
      titolo: 'I battimenti',
      testo: R`Due chitarristi suonano la stessa corda, ma una è un poco scordata. Insieme si sente un suono che va e viene: «uaa, uaa, uaa». Sono i **battimenti**.

[[video:suono/battimenti]]

Per il principio di sovrapposizione le due pressioni si sommano. In certi istanti le creste coincidono, e il suono è forte. Poco dopo un'onda è avanti di mezza oscillazione: cresta contro gola, il suono quasi sparisce. Poi le creste tornano a coincidere.

>* Due suoni di frequenze vicine $f_1$ e $f_2$ danno **battimenti**: il volume va e viene $f_2 - f_1$ volte al secondo, con $f_2$ la più alta. Si sente una nota alla frequenza media.

[[grafico:battimenti]]

Perché proprio la differenza? Ogni secondo l'onda più acuta fa $f_2 - f_1$ oscillazioni in più dell'altra. Ogni volta che ne guadagna una intera, le creste tornano a coincidere.

~ f_b = f_2 - f_1 = 265\,\text{Hz} - 262\,\text{Hz} :: due note quasi uguali
~ f_b = \evidb{3\,\text{Hz}} :: tre massimi di volume ogni secondo
~ T_b = \dfrac{1}{f_b} \approx 0{,}33\,\text{s} :: fra un massimo e l'altro passa un terzo di secondo

Con i battimenti si accordano gli strumenti. Si suona la nota insieme a un diapason e si tende la corda finché i battimenti rallentano. Quando spariscono, le due frequenze sono uguali. Se la differenza supera una quindicina di hertz, non si sentono più battimenti ma due note.

>! I battimenti non dicono quale nota è più alta. 3 battimenti al secondo vogliono dire solo che le frequenze differiscono di 3 Hz.

?? Un diapason da 392 Hz e una corda, suonati insieme, danno 3 battimenti al secondo. Quanto vale la frequenza della corda?
[ ] 395 Hz
[ ] 389 Hz
[x] può essere 389 Hz o 395 Hz
=> I battimenti danno solo la differenza, $|f_2 - f_1| = 3\,\text{Hz}$. Per sapere da che parte sta la corda, la si tende un poco: se i battimenti rallentano, era più bassa.`
    }
  ],
  grafici: {
    /* l'aria nel tubo: tre file di puntini spostati di s = 0,11·sin(π·x − 2π·t/T); la pressione va come −cos(π·x − 2π·t/T) */
    tubo: {
      tipo: 'piano', x: [-0.1, 6.1], y: [-2, 2.1], assi: false, griglia: false, mirino: false,
      parametri: [{ nome: 'fa', min: 0, max: 1, passo: 0.05, valore: 0, etichetta: 'tempo t/T' }],
      funzioni: [{ f: '-0.9 - 0.5*cos(pi*x - 2*pi*fa)', colore: 4 }],
      elementi: [0.9, 1.2, 1.5].reduce(function (lista, y) {
        for (let i = 0; i <= 24; i++) {
          const x0 = i * 0.25;
          lista.push({ tipo: 'punto', p: [x0 + ' + 0.11*sin(pi*' + x0 + ' - 2*pi*fa)', y], colore: (y === 1.2 && i === 10) ? 4 : 'grigio' });
        }
        return lista;
      }, []).concat([
        { tipo: 'segmento', da: [0, -0.9], a: [6, -0.9], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: ['1 + 2*fa', 1.85], testo: 'compressione' },
        { tipo: 'testo', p: ['2 + 2*fa', 0.5], testo: 'rarefazione' },
        { tipo: 'segmento', da: ['1 + 2*fa', -0.18], a: ['3 + 2*fa', -0.18], colore: 'grigio' },
        { tipo: 'segmento', da: ['1 + 2*fa', -0.28], a: ['1 + 2*fa', -0.08], colore: 'grigio' },
        { tipo: 'segmento', da: ['3 + 2*fa', -0.28], a: ['3 + 2*fa', -0.08], colore: 'grigio' },
        { tipo: 'testo', p: ['2 + 2*fa', 0.0], testo: 'λ' }
      ]),
      didascalia: 'In alto l\'aria in un tubo: ogni puntino è un pezzetto d\'aria, con gli spostamenti ingranditi. In basso la pressione lungo il tubo; il tratteggio è la pressione normale. Il cursore fa scorrere il tempo lungo un periodo: compressioni e rarefazioni avanzano verso destra, mentre il puntino viola va solo avanti e indietro.'
    },
    /* la pressione misurata da un microfono in 10 ms: frequenza e ampiezza indipendenti */
    microfono: {
      tipo: 'piano', x: [0, 10], y: [-0.05, 0.065], altezza: 420, passo: [1, 0.01], etichette: { x: 't (ms)', y: 'Δp (Pa)' },
      parametri: [
        { nome: 'f', min: 100, max: 800, passo: 50, valore: 250, etichetta: 'frequenza f (Hz)' },
        { nome: 'A', min: 0.01, max: 0.04, passo: 0.01, valore: 0.02, etichetta: 'ampiezza A (Pa)', decimali: 2 }
      ],
      funzioni: [{ f: 'A*sin(2*pi*f*x/1000)', colore: 4 }],
      elementi: [
        { tipo: 'testo', p: [9.9, 0.056], testo: 'f = {{f}} Hz, T = {{1000/f}} ms', ancora: 'end', colore: 4 }
      ],
      didascalia: 'La pressione dell\'aria misurata da un microfono, per 10 millesimi di secondo, con un suono puro. La frequenza decide l\'altezza: onde più fitte, suono più acuto. L\'ampiezza decide quanto è forte. I due cursori sono indipendenti.'
    },
    /* il timbro: fondamentale da 250 Hz più la seconda e la terza armonica */
    timbro: {
      tipo: 'piano', x: [0, 12], y: [-2.6, 3.3], altezza: 420, passo: [1, 1], etichette: { x: 't (ms)', y: 'Δp' },
      parametri: [
        { nome: 'a2', min: 0, max: 1, passo: 0.1, valore: 0.5, etichetta: 'peso della 2ª armonica', decimali: 1 },
        { nome: 'a3', min: 0, max: 1, passo: 0.1, valore: 0.3, etichetta: 'peso della 3ª armonica', decimali: 1 }
      ],
      funzioni: [
        { f: 'sin(pi*x/2)', colore: 4, tratteggio: true },
        { f: 'sin(pi*x/2) + a2*sin(pi*x) + a3*sin(3*pi*x/2)', colore: 4 }
      ],
      elementi: [
        { tipo: 'segmento', da: [4, 2.95], a: [8, 2.95], colore: 'grigio' },
        { tipo: 'segmento', da: [4, 2.8], a: [4, 3.1], colore: 'grigio' },
        { tipo: 'segmento', da: [8, 2.8], a: [8, 3.1], colore: 'grigio' },
        { tipo: 'testo', p: [10.2, 2.85], testo: 'T = 4 ms' }
      ],
      didascalia: 'Una nota da 250 Hz. Tratteggio: la fondamentale da sola. Linea piena: il suono vero, con la seconda armonica (500 Hz) e la terza (750 Hz). Cambiando i pesi delle armoniche la forma cambia, cioè il timbro, ma l\'onda si ripete sempre ogni 4 ms: la nota resta la stessa.'
    },
    /* inversa del quadrato: l'intensità di una sorgente piccola in funzione della distanza */
    distanza: {
      tipo: 'piano', x: [0, 10], y: [0, 40], altezza: 420, passo: [1, 5], proporzioni: 'libere', etichette: { x: 'r (m)', y: 'I (mW/m²)' },
      parametri: [{ nome: 'P', min: 0.2, max: 1, passo: 0.1, valore: 0.5, etichetta: 'potenza P (W)', decimali: 1 }],
      funzioni: [{ f: '1000*P/(4*pi*x^2)', dominio: [1.6, 10], colore: 3 }],
      elementi: [
        { tipo: 'punto', p: [2, '1000*P/(16*pi)'], etichetta: '{{1000*P/(16*pi)|1}}', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [4, '1000*P/(64*pi)'], etichetta: '{{1000*P/(64*pi)|1}}', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [8, '1000*P/(256*pi)'], etichetta: '{{1000*P/(256*pi)|2}}', posizione: 'alto-sinistra', colore: 'grigio' },
        { tipo: 'testo', p: [9.8, 34], testo: 'r doppia: I un quarto', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'intensità del suono di una sorgente piccola, all\'aperto, in milliwatt al metro quadrato. A 2 m, 4 m e 8 m: ogni volta che la distanza raddoppia, l\'intensità diventa un quarto. Il cursore cambia la potenza della sorgente.'
    },
    /* la scala dei decibel */
    scala: {
      tipo: 'barre', categorie: ['soglia', 'foglie', 'sussurro', 'dialogo', 'traffico', 'concerto', 'dolore'],
      valori: [0, 10, 30, 60, 80, 110, 120], etichettaY: 'L (dB)',
      didascalia: 'Livelli sonori tipici. Da una barra all\'altra conta la differenza: 10 dB in più vogliono dire intensità dieci volte tanta. Dal sussurro al concerto ci sono 80 dB, cioè un fattore 10⁸.'
    },
    /* n sorgenti uguali: il livello sale di 10·log10(n) */
    sorgenti: {
      tipo: 'piano', x: [0, 10.6], y: [0, 12], altezza: 400, passo: [1, 2], proporzioni: 'libere', etichette: { x: 'numero di sorgenti n', y: 'ΔL (dB)' },
      funzioni: [{ f: '10*log10(x)', dominio: [1, 10], colore: 3 }],
      punti: [
        { x: 1, y: 0, colore: 'grigio' },
        { x: 2, y: 3.01, etichetta: '+3 dB', posizione: 'basso-destra', colore: 'grigio' },
        { x: 3, y: 4.77, colore: 'grigio' }, { x: 4, y: 6.02, etichetta: '+6 dB', posizione: 'basso-destra', colore: 'grigio' },
        { x: 5, y: 6.99, colore: 'grigio' }, { x: 6, y: 7.78, colore: 'grigio' }, { x: 7, y: 8.45, colore: 'grigio' },
        { x: 8, y: 9.03, colore: 'grigio' }, { x: 9, y: 9.54, colore: 'grigio' },
        { x: 10, y: 10, etichetta: '+10 dB', posizione: 'basso', colore: 'grigio' }
      ],
      didascalia: 'Quanti decibel in più danno n sorgenti uguali che suonano insieme, rispetto a una sola: ΔL = 10·log₁₀ n. Due sorgenti: +3 dB. Quattro: +6 dB. Ne servono dieci per +10 dB.'
    },
    /* l'effetto Doppler: le creste emesse negli ultimi 5 periodi da una sorgente che va verso destra */
    creste: {
      tipo: 'piano', x: [-9.3, 6.9], y: [-6.7, 5.5], assi: false, griglia: false, mirino: false, altezza: 560,
      parametri: [{ nome: 'm', min: 0, max: 0.8, passo: 0.1, valore: 0.3, etichetta: 'u / v', decimali: 1 }],
      elementi: [1, 2, 3, 4, 5].map(function (k) {
        return { tipo: 'cerchio', centro: ['-' + k + '*m', 0], raggio: k, colore: 4 };
      }).concat([
        { tipo: 'vettore', da: [0, 0], a: ['4*m', 0], etichetta: 'u', colore: 1, posizione: 'destra' },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'punto', p: [6.2, 0], colore: 'grigio' },
        { tipo: 'testo', p: [6.2, -1.1], testo: 'tu' },
        { tipo: 'testo', p: [6.8, -6.3], testo: 'davanti: f′ = {{1/(1-m)|2}} · f', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [-9.2, -6.3], testo: 'dietro: f′ = {{1/(1+m)|2}} · f', ancora: 'start', colore: 4 }
      ]),
      didascalia: 'Le creste emesse negli ultimi cinque periodi da una sirena che va verso destra a velocità u. Ogni cerchio ha il centro dove stava la sirena quando l\'ha emesso. Davanti la distanza fra le creste è (1 − u/v)·λ, dietro (1 + u/v)·λ. Con u = 0 i cerchi hanno tutti lo stesso centro.'
    },
    /* la curva di risonanza: ampiezza in funzione della frequenza della forza, f0 = 2 Hz */
    curva: {
      tipo: 'piano', x: [0, 4], y: [0, 12.5], altezza: 420, passo: [0.5, 2], proporzioni: 'libere', etichette: { x: 'f (Hz)', y: 'A (cm)' },
      parametri: [{ nome: 'g', min: 0.2, max: 0.8, passo: 0.1, valore: 0.4, etichetta: 'attrito', decimali: 1 }],
      funzioni: [{ f: '4/sqrt((4 - x^2)^2 + (g*x)^2)', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: [2, 0], a: [2, 12.5], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [3.95, 11.8], testo: 'a f = f_0: A = {{2/g|1}} cm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'ampiezza delle oscillazioni di un oggetto con frequenza propria 2 Hz, spinto da una forza periodica di frequenza f. Il picco sta a f₀. Il cursore cambia l\'attrito: meno attrito, picco più alto e più stretto.'
    },
    /* i battimenti: due oscillazioni lente, 20 Hz e 20 + Δf Hz, e la loro somma in un secondo */
    battimenti: {
      tipo: 'piano', x: [0, 1], y: [-2.6, 3.4], altezza: 420, passo: [0.1, 1], proporzioni: 'libere', etichette: { x: 't (s)', y: 'Δp' },
      parametri: [{ nome: 'df', min: 1, max: 4, passo: 1, valore: 2, etichetta: 'differenza f_2 − f_1 (Hz)' }],
      funzioni: [
        { f: 'cos(40*pi*x) + cos(2*pi*(20 + df)*x)', colore: 4 },
        { f: '2*abs(cos(pi*df*x))', colore: 'grigio', tratteggio: true },
        { f: '-2*abs(cos(pi*df*x))', colore: 'grigio', tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [0.99, 2.9], testo: '{{df}} battimenti al secondo', ancora: 'end', colore: 4 }
      ],
      didascalia: 'La somma di due oscillazioni da 20 Hz e da 20 + Δf Hz, molto più lente di un suono vero per poterle disegnare. Il tratteggio è l\'inviluppo: il volume che va e viene. In un secondo ci sono tanti massimi quanti hertz di differenza.'
    }
  },
  esempi: [
    {
      titolo: 'Il sonar del peschereccio',
      problema: R`Il sonar di un peschereccio manda verso il fondo un impulso di ultrasuoni a 50 kHz. L'eco torna dopo 0,08 s. Nell'acqua di mare il suono va a 1500 m/s. Quanto è profondo il mare in quel punto? Quanto è lunga l'onda dell'impulso?`,
      passi: [
        R`Dati: $f = 50\,\text{kHz} = 50\,000\,\text{Hz}$, $t = 0{,}08\,\text{s}$, $v = 1500\,\text{m/s}$. Cerco la profondità $d$ e la lunghezza d'onda $\lambda$.`,
        R`In $0{,}08\,\text{s}$ l'impulso scende fino al fondo e torna: percorre $2 \cdot d$. Quindi $2 \cdot d = v \cdot t$.`,
        R`$d = \dfrac{v \cdot t}{2} = \dfrac{1500\,\text{m/s} \cdot 0{,}08\,\text{s}}{2} = \dfrac{120\,\text{m}}{2} = 60\,\text{m}$.`,
        R`La lunghezza d'onda: $\lambda = \dfrac{v}{f} = \dfrac{1500\,\text{m/s}}{50\,000\,\text{Hz}} = 0{,}03\,\text{m} = 3\,\text{cm}$.`,
        R`Controllo: in $0{,}08\,\text{s}$ l'impulso percorre $2 \cdot 60 = 120\,\text{m}$, e $\dfrac{120\,\text{m}}{0{,}08\,\text{s}} = 1500\,\text{m/s}$. Torna.`
      ],
      risultato: R`Il fondo è a $60\,\text{m}$; l'onda è lunga $3\,\text{cm}$.`
    },
    {
      titolo: 'Il tosaerba del vicino',
      problema: R`A 2 m da un tosaerba il livello sonoro è 90 dB. Che intensità ha il suono in quel punto? A che distanza bisogna allontanarsi, in un prato aperto, per scendere a 70 dB?`,
      passi: [
        R`Dati: $L_1 = 90\,\text{dB}$ a $r_1 = 2\,\text{m}$, $L_2 = 70\,\text{dB}$, $I_0 = 10^{-12}\,\text{W/m}^2$. Cerco l'intensità $I_1$ e la distanza $r_2$.`,
        R`Dal livello all'intensità: $I_1 = I_0 \cdot 10^{L/10} = 10^{-12} \cdot 10^{9}\,\text{W/m}^2 = 10^{-3}\,\text{W/m}^2$.`,
        R`Da 90 dB a 70 dB si scende di 20 dB, cioè di due gradini. L'intensità si divide per $10 \cdot 10 = 100$.`,
        R`All'aperto l'intensità va con l'inversa del quadrato della distanza. Per dividerla per 100 la distanza si moltiplica per $\sqrt{100} = 10$.`,
        R`Quindi $r_2 = 10 \cdot 2\,\text{m} = 20\,\text{m}$. Controllo: a 20 m l'intensità è $\dfrac{10^{-3}}{100} = 10^{-5}\,\text{W/m}^2$, e $10 \cdot \log_{10} 10^{7} = 70\,\text{dB}$. Torna.`
      ],
      risultato: R`$I_1 = 10^{-3}\,\text{W/m}^2$; per sentire 70 dB bisogna stare a $20\,\text{m}$.`
    },
    {
      titolo: 'L\'ambulanza che arriva',
      problema: R`La sirena di un'ambulanza suona a 640 Hz. Una persona ferma sul marciapiede, mentre l'ambulanza si avvicina, sente 680 Hz. A che velocità va l'ambulanza? Che nota sentirà la persona dopo che l'ambulanza è passata?`,
      passi: [
        R`Dati: $f = 640\,\text{Hz}$, $f' = 680\,\text{Hz}$ in avvicinamento, $v = 340\,\text{m/s}$, ascoltatore fermo. Cerco la velocità $u$ e la frequenza in allontanamento.`,
        R`Sorgente che si avvicina: $f' = f \cdot \dfrac{v}{v - u}$, quindi $v - u = \dfrac{f \cdot v}{f'} = \dfrac{640 \cdot 340}{680}\,\text{m/s} = 320\,\text{m/s}$.`,
        R`$u = 340\,\text{m/s} - 320\,\text{m/s} = 20\,\text{m/s}$, cioè $u = 20 \cdot 3{,}6\,\text{km/h} = 72\,\text{km/h}$.`,
        R`Dopo il passaggio la sorgente si allontana: $f' = f \cdot \dfrac{v}{v + u} = 640\,\text{Hz} \cdot \dfrac{340}{360} \approx 604\,\text{Hz}$.`,
        R`Controllo: la nota sale sopra 640 Hz mentre arriva e scende sotto 640 Hz mentre se ne va. Il salto è di circa 76 Hz.`
      ],
      risultato: R`L'ambulanza va a $20\,\text{m/s} = 72\,\text{km/h}$; dopo il passaggio si sente circa $604\,\text{Hz}$.`
    },
    {
      titolo: 'Una canna d\'organo',
      problema: R`Una canna d'organo aperta ai due capi è lunga 2,0 m. Quali sono la sua fondamentale e le due armoniche successive? Che fondamentale avrebbe se fosse chiusa a un capo?`,
      passi: [
        R`Dati: $\ell = 2{,}0\,\text{m}$, $v = 340\,\text{m/s}$. Cerco $f_1$, $f_2$, $f_3$ della canna aperta e $f_1$ della canna chiusa.`,
        R`Canna aperta: due ventri ai capi, e nella fondamentale mezza onda in mezzo. $\lambda_1 = 2 \cdot \ell = 4{,}0\,\text{m}$.`,
        R`$f_1 = \dfrac{v}{\lambda_1} = \dfrac{340\,\text{m/s}}{4{,}0\,\text{m}} = 85\,\text{Hz}$. Le armoniche successive sono i multipli: $f_2 = 170\,\text{Hz}$, $f_3 = 255\,\text{Hz}$.`,
        R`Canna chiusa: nodo al fondo, ventre alla bocca, un quarto d'onda in mezzo. $\lambda_1 = 4 \cdot \ell = 8{,}0\,\text{m}$ e $f_1 = \dfrac{340}{8{,}0}\,\text{Hz} = 42{,}5\,\text{Hz}$.`,
        R`Controllo: chiudendo un capo la nota scende di un'ottava, cioè la frequenza si dimezza. Le armoniche della canna chiusa sono solo dispari: 42,5 Hz, 127,5 Hz, 212,5 Hz.`
      ],
      risultato: R`Aperta: $85\,\text{Hz}$, $170\,\text{Hz}$, $255\,\text{Hz}$. Chiusa a un capo: $42{,}5\,\text{Hz}$.`
    },
    {
      titolo: 'Accordare una chitarra con il diapason',
      problema: R`Una chitarrista suona il mi cantino insieme a un diapason da 330 Hz. Sente 5 battimenti in 2 secondi. Tende un poco la corda, e i battimenti diventano 4 in 2 secondi. Che frequenza aveva la corda all'inizio? E dopo?`,
      passi: [
        R`Dati: $f_\text{diap} = 330\,\text{Hz}$; prima 5 battimenti in $2\,\text{s}$, dopo 4 in $2\,\text{s}$. Cerco la frequenza della corda prima e dopo.`,
        R`Frequenza dei battimenti: $f_b = \dfrac{5}{2\,\text{s}} = 2{,}5\,\text{Hz}$. La corda è a $330 - 2{,}5 = 327{,}5\,\text{Hz}$ oppure a $330 + 2{,}5 = 332{,}5\,\text{Hz}$.`,
        R`Tendendo la corda la sua frequenza sale. I battimenti sono diminuiti: la corda si è avvicinata a 330 Hz. Quindi stava sotto: $327{,}5\,\text{Hz}$.`,
        R`Dopo: $f_b = \dfrac{4}{2\,\text{s}} = 2\,\text{Hz}$, sempre sotto il diapason. La corda è a $330 - 2 = 328\,\text{Hz}$.`,
        R`Controllo: se la corda fosse stata a 332,5 Hz, tendendola sarebbe salita ancora, e i battimenti sarebbero aumentati.`
      ],
      risultato: R`Prima $327{,}5\,\text{Hz}$, dopo $328\,\text{Hz}$: deve tendere ancora un poco.`
    },
    {
      titolo: 'Il tonfo nel pozzo',
      problema: R`Lasci cadere un sasso, da fermo, in un pozzo profondo 20 m. Dopo quanto tempo senti il tonfo nell'acqua? Trascura l'aria.`,
      passi: [
        R`Dati: $h = 20\,\text{m}$, $v_0 = 0$, $g = 9{,}8\,\text{m/s}^2$, $v = 340\,\text{m/s}$. Cerco il tempo totale $t$, dal lancio al tonfo.`,
        R`Il tempo ha due pezzi: il sasso che cade e il suono che risale. Prima la caduta: $h = \frac{1}{2} \cdot g \cdot t_1^2$, quindi $t_1 = \sqrt{\dfrac{2 \cdot h}{g}} = \sqrt{\dfrac{40}{9{,}8}}\,\text{s} \approx 2{,}02\,\text{s}$.`,
        R`Poi il suono risale di moto uniforme: $t_2 = \dfrac{h}{v} = \dfrac{20\,\text{m}}{340\,\text{m/s}} \approx 0{,}06\,\text{s}$.`,
        R`In tutto $t = t_1 + t_2 \approx 2{,}02\,\text{s} + 0{,}06\,\text{s} = 2{,}08\,\text{s}$.`,
        R`Controllo: il suono pesa appena il 3% del tempo. Per questo, nei pozzi poco profondi, lo si può trascurare.`
      ],
      risultato: R`Il tonfo si sente dopo circa $2{,}08\,\text{s}$: $2{,}02\,\text{s}$ di caduta e $0{,}06\,\text{s}$ di suono.`
    }
  ],
  formulario: [
    { nome: 'Velocità del suono', formula: R`v = \lambda \cdot f`, nota: R`Nell'aria $v \approx 340\,\text{m/s}$; nell'acqua circa $1500\,\text{m/s}$ (1480 in quella dolce). Non dipende dalla frequenza.` },
    { nome: 'Velocità nell\'aria e temperatura', formula: R`v \approx (331 + 0{,}6 \cdot t_C)\,\text{m/s}`, nota: R`$t_C$ in gradi Celsius, scritta senza unità. A 20 °C: $343\,\text{m/s}$.` },
    { nome: 'Distanza di un fulmine, o con l\'eco', formula: R`d = v \cdot t \qquad d = \dfrac{v \cdot t}{2}`, nota: R`Con l'eco il suono va e torna: la distanza è metà. Il fulmine: circa 3 s per ogni km.` },
    { nome: 'Frequenze udibili', formula: R`20\,\text{Hz} \le f \le 20\,000\,\text{Hz}`, nota: R`Sotto: infrasuoni. Sopra: ultrasuoni.` },
    { nome: 'Intensità', formula: R`I = \dfrac{P}{S} \qquad I = \dfrac{P}{4\pi \cdot r^2}`, nota: R`In $\text{W/m}^2$. La seconda per una sorgente piccola, all'aperto. Cresce con il quadrato dell'ampiezza.` },
    { nome: 'Livello sonoro', formula: R`L = 10 \cdot \log_{10} \dfrac{I}{I_0}`, nota: R`In decibel, con $I_0 = 10^{-12}\,\text{W/m}^2$. +10 dB: intensità per 10; +3 dB: circa per 2.` },
    { nome: 'Dal livello all\'intensità', formula: R`I = I_0 \cdot 10^{L/10}`, nota: R`Per esempio $60\,\text{dB}$ danno $10^{-6}\,\text{W/m}^2$.` },
    { nome: 'Doppler, sorgente in moto', formula: R`f' = f \cdot \dfrac{v}{v - u} \qquad f' = f \cdot \dfrac{v}{v + u}`, nota: R`Ascoltatore fermo. $v - u$ se la sorgente si avvicina, $v + u$ se si allontana.` },
    { nome: 'Doppler, ascoltatore in moto', formula: R`f' = f \cdot \dfrac{v + u}{v} \qquad f' = f \cdot \dfrac{v - u}{v}`, nota: R`Sorgente ferma. $v + u$ se l'ascoltatore va verso la sorgente, $v - u$ se se ne allontana.` },
    { nome: 'Frequenza propria e periodo', formula: R`f_0 = \dfrac{1}{T_0}`, nota: R`Risonanza: la forza periodica ha frequenza $f = f_0$, e l'ampiezza è massima.` },
    { nome: 'Canna aperta ai due capi', formula: R`f_n = n \cdot \dfrac{v}{2 \cdot \ell}`, nota: R`$n = 1, 2, 3, \dots$: tutte le armoniche. Fondamentale con $\lambda_1 = 2 \cdot \ell$.` },
    { nome: 'Canna chiusa a un capo', formula: R`f_1 = \dfrac{v}{4 \cdot \ell}`, nota: R`$\lambda_1 = 4 \cdot \ell$. Solo armoniche dispari: $f_1$, $3 \cdot f_1$, $5 \cdot f_1$…` },
    { nome: 'Battimenti', formula: R`f_b = f_2 - f_1`, nota: R`Con $f_2$ la frequenza più alta. Si sente la nota media, con il volume che va e viene.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'onda-pressione', tipo: 'definizione', fronte: R`Che cos'è il **suono**?`, retro: R`Un'onda meccanica longitudinale: compressioni e rarefazioni del mezzo che si propagano.` },
    { id: 'fc-02', sezione: 'onda-pressione', tipo: 'concetto', fronte: R`Perché il suono non si propaga nel vuoto?`, retro: R`Perché è un'onda meccanica: ha bisogno di un mezzo che si comprima e si diradi. Nel vuoto non c'è.` },
    { id: 'fc-03', sezione: 'onda-pressione', tipo: 'definizione', fronte: R`**Compressione** e **rarefazione**`, retro: R`Compressione: zona dove l'aria è più fitta, pressione più alta. Rarefazione: zona più rada, pressione più bassa.` },
    { id: 'fc-04', sezione: 'velocita', tipo: 'formula', fronte: R`Quanto vale la velocità del suono nell'aria?`, retro: R`Circa $340\,\text{m/s}$. Più precisamente $v \approx (331 + 0{,}6 \cdot t_C)\,\text{m/s}$, con $t_C$ in gradi Celsius.` },
    { id: 'fc-05', sezione: 'velocita', tipo: 'procedura', fronte: R`Come si stima la distanza di un fulmine?`, retro: R`Si contano i secondi fra lampo e tuono e si moltiplicano per $340\,\text{m/s}$. A occhio: secondi diviso 3 fa i chilometri.` },
    { id: 'fc-06', sezione: 'velocita', tipo: 'procedura', fronte: R`Come si ricava la distanza di una parete dall'**eco**?`, retro: R`$d = \dfrac{v \cdot t}{2}$: il tempo misurato è di andata e ritorno.` },
    { id: 'fc-07', sezione: 'velocita', tipo: 'concetto', fronte: R`La velocità del suono dipende dalla frequenza?`, retro: R`No. Dipende dal mezzo e dalla temperatura. Note acute e gravi viaggiano insieme.` },
    { id: 'fc-08', sezione: 'altezza-timbro', tipo: 'definizione', fronte: R`Che cos'è l'**altezza** di un suono?`, retro: R`La sua frequenza: più alta la frequenza, più acuto il suono. Non c'entra il volume.` },
    { id: 'fc-09', sezione: 'altezza-timbro', tipo: 'definizione', fronte: R`**Infrasuoni** e **ultrasuoni**`, retro: R`Suoni sotto i 20 Hz e sopra i 20 000 Hz: l'orecchio umano non li sente.` },
    { id: 'fc-10', sezione: 'altezza-timbro', tipo: 'definizione', fronte: R`Che cos'è il **timbro**?`, retro: R`La qualità che distingue due suoni con stessa altezza e stessa intensità. Dipende dalla forma dell'onda, cioè dalle armoniche.` },
    { id: 'fc-11', sezione: 'intensita', tipo: 'formula', fronte: R`Formula dell'**intensità** di un suono`, retro: R`$I = \dfrac{P}{S}$, in $\text{W/m}^2$. Per una sorgente piccola, all'aperto: $I = \dfrac{P}{4\pi \cdot r^2}$.` },
    { id: 'fc-12', sezione: 'intensita', tipo: 'concetto', fronte: R`Se l'ampiezza dell'onda raddoppia, che cosa succede all'intensità?`, retro: R`Diventa quattro volte tanto: l'intensità cresce con il quadrato dell'ampiezza.` },
    { id: 'fc-13', sezione: 'decibel', tipo: 'formula', fronte: R`Formula del **livello sonoro**`, retro: R`$L = 10 \cdot \log_{10} \dfrac{I}{I_0}$, in decibel, con $I_0 = 10^{-12}\,\text{W/m}^2$, la soglia di udibilità.` },
    { id: 'fc-14', sezione: 'decibel', tipo: 'concetto', fronte: R`Che cosa vuol dire salire di 10 dB? E di 3 dB?`, retro: R`+10 dB: intensità dieci volte tanta. +3 dB: intensità circa doppia.` },
    { id: 'fc-15', sezione: 'decibel', tipo: 'concetto', fronte: R`Due sorgenti uguali da 60 dB suonano insieme. Quanti decibel?`, retro: R`Circa 63 dB, non 120: si sommano le intensità, e intensità doppia vuol dire +3 dB.` },
    { id: 'fc-16', sezione: 'doppler', tipo: 'definizione', fronte: R`Che cos'è l'**effetto Doppler**?`, retro: R`La frequenza ricevuta cambia se sorgente e ascoltatore si muovono l'uno rispetto all'altro: più alta se si avvicinano, più bassa se si allontanano.` },
    { id: 'fc-17', sezione: 'doppler', tipo: 'formula', fronte: R`Doppler con la sorgente in moto e l'ascoltatore fermo`, retro: R`$f' = f \cdot \dfrac{v}{v - u}$ se si avvicina, $f' = f \cdot \dfrac{v}{v + u}$ se si allontana.` },
    { id: 'fc-18', sezione: 'doppler', tipo: 'concetto', fronte: R`Con l'effetto Doppler cambia la frequenza emessa dalla sorgente?`, retro: R`No: la sorgente emette sempre la stessa. Cambia la frequenza che arriva all'ascoltatore.` },
    { id: 'fc-19', sezione: 'risonanza', tipo: 'definizione', fronte: R`Che cos'è la **risonanza**?`, retro: R`Una forza periodica con la frequenza propria $f_0$ di un oggetto lo fa oscillare con l'ampiezza più grande possibile.` },
    { id: 'fc-20', sezione: 'risonanza', tipo: 'formula', fronte: R`Fondamentale di una canna aperta e di una chiusa a un capo`, retro: R`Aperta: $f_1 = \dfrac{v}{2 \cdot \ell}$. Chiusa: $f_1 = \dfrac{v}{4 \cdot \ell}$, con solo le armoniche dispari.` },
    { id: 'fc-21', sezione: 'battimenti', tipo: 'definizione', fronte: R`Che cosa sono i **battimenti**?`, retro: R`Il volume che va e viene quando suonano insieme due note di frequenze vicine. Avvengono $f_2 - f_1$ volte al secondo.` },
    { id: 'fc-22', sezione: 'battimenti', tipo: 'procedura', fronte: R`Come si accorda una corda con un diapason?`, retro: R`Si suonano insieme e si cambia la tensione della corda finché i battimenti rallentano e spariscono: allora le frequenze sono uguali.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Fra il lampo e il tuono passano 2 s. A che distanza è caduto il fulmine? (Usa $v = 340\,\text{m/s}$.)`, suggerimenti: [R`Il suono va a velocità costante: distanza uguale a velocità per tempo.`], risposta: { tipo: 'numero', valore: 680, unita: 'm' }, soluzione: [R`$d = v \cdot t = 340\,\text{m/s} \cdot 2\,\text{s} = 680\,\text{m}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Quanto tempo impiega il suono ad attraversare un campo da calcio lungo 102 m?`, suggerimenti: [R`$t = \dfrac{d}{v}$, con $v = 340\,\text{m/s}$.`], risposta: { tipo: 'numero', valore: 0.3, unita: 's' }, soluzione: [R`$t = \dfrac{102\,\text{m}}{340\,\text{m/s}} = 0{,}3\,\text{s}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Gridi davanti a una parete di roccia lontana 68 m. Dopo quanto tempo senti l'eco?`, suggerimenti: [R`Il suono va fino alla parete e torna indietro.`, R`La strada è $2 \cdot 68\,\text{m}$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 's' }, soluzione: [R`Il suono percorre $2 \cdot 68 = 136\,\text{m}$.`, R`$t = \dfrac{136\,\text{m}}{340\,\text{m/s}} = 0{,}4\,\text{s}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`In una valle batti le mani e senti l'eco dopo 1,2 s. Quanto è lontana la parete che riflette il suono?`, suggerimenti: [R`Il tempo è di andata e ritorno: $d = \dfrac{v \cdot t}{2}$.`], risposta: { tipo: 'numero', valore: 204, unita: 'm' }, soluzione: [R`$d = \dfrac{340\,\text{m/s} \cdot 1{,}2\,\text{s}}{2} = \dfrac{408\,\text{m}}{2} = 204\,\text{m}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un suono ha frequenza 136 Hz. Quanto è lunga la sua onda nell'aria?`, suggerimenti: [R`$\lambda = \dfrac{v}{f}$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{340\,\text{m/s}}{136\,\text{Hz}} = 2{,}5\,\text{m}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un'altalena lasciata libera fa un'oscillazione completa ogni 5 s. Con che frequenza bisogna spingerla per la risonanza?`, suggerimenti: [R`Serve la frequenza propria, $f_0 = \dfrac{1}{T_0}$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'Hz' }, soluzione: [R`$f_0 = \dfrac{1}{5\,\text{s}} = 0{,}2\,\text{Hz}$: una spinta ogni 5 secondi.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Quanto vale la velocità del suono nell'aria a 30 °C?`, suggerimenti: [R`$v \approx (331 + 0{,}6 \cdot t_C)\,\text{m/s}$, con $t_C$ in gradi Celsius.`], risposta: { tipo: 'numero', valore: 349, unita: 'm/s' }, soluzione: [R`$v \approx (331 + 0{,}6 \cdot 30)\,\text{m/s} = (331 + 18)\,\text{m/s} = 349\,\text{m/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un diapason vibra a 125 Hz. Quanto dura un'oscillazione? Rispondi in millisecondi.`, suggerimenti: [R`Il periodo è $T = \dfrac{1}{f}$.`], risposta: { tipo: 'numero', valore: 8, unita: 'ms' }, soluzione: [R`$T = \dfrac{1}{125\,\text{Hz}} = 0{,}008\,\text{s} = 8\,\text{ms}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un terremoto produce un infrasuono di 10 Hz. Quanto è lunga l'onda nell'aria?`, suggerimenti: [R`$\lambda = \dfrac{v}{f}$.`], risposta: { tipo: 'numero', valore: 34, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{340\,\text{m/s}}{10\,\text{Hz}} = 34\,\text{m}$: più lunga di un campo da basket.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Da una finestra aperta di $0{,}5\,\text{m}^2$ entra una potenza sonora di $0{,}02\,\text{W}$, distribuita in modo uniforme. Quanto vale l'intensità del suono?`, suggerimenti: [R`L'intensità è potenza diviso superficie.`], risposta: { tipo: 'numero', valore: 0.04, unita: 'W/m²' }, soluzione: [R`$I = \dfrac{P}{S} = \dfrac{0{,}02\,\text{W}}{0{,}5\,\text{m}^2} = 0{,}04\,\text{W/m}^2$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`L'ampiezza di un'onda sonora si dimezza, con la stessa frequenza. Per quanto si moltiplica la sua intensità?`, suggerimenti: [R`L'intensità cresce con il quadrato dell'ampiezza.`], risposta: { tipo: 'numero', valore: 0.25 }, soluzione: [R`$\left(\tfrac{1}{2}\right)^2 = \tfrac{1}{4} = 0{,}25$: l'intensità diventa un quarto.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`All'aperto ti allontani da una sorgente sonora: la distanza passa da 5 m a 15 m. Quante volte più debole è l'intensità?`, suggerimenti: [R`L'intensità va con l'inverso del quadrato della distanza.`], risposta: { tipo: 'numero', valore: 9 }, soluzione: [R`La distanza triplica: l'intensità si divide per $3^2 = 9$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un suono ha intensità $10^{-7}\,\text{W/m}^2$. Quanti decibel è il suo livello sonoro?`, suggerimenti: [R`$L = 10 \cdot \log_{10} \dfrac{I}{I_0}$, con $I_0 = 10^{-12}\,\text{W/m}^2$.`], risposta: { tipo: 'numero', valore: 50, segnaposto: 'Numero (in dB)' }, soluzione: [R`$\dfrac{I}{I_0} = \dfrac{10^{-7}}{10^{-12}} = 10^5$.`, R`$L = 10 \cdot 5 = 50\,\text{dB}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un martello pneumatico, da vicino, produce un'intensità di $10^{-2}\,\text{W/m}^2$. Quanti decibel?`, suggerimenti: [R`Conta di quanti fattori dieci $I$ supera $I_0 = 10^{-12}\,\text{W/m}^2$.`], risposta: { tipo: 'numero', valore: 100, segnaposto: 'Numero (in dB)' }, soluzione: [R`$\dfrac{10^{-2}}{10^{-12}} = 10^{10}$: dieci gradini.`, R`$L = 10 \cdot 10 = 100\,\text{dB}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`In una biblioteca il livello sonoro è 40 dB. Quanto vale l'intensità del suono?`, suggerimenti: [R`$I = I_0 \cdot 10^{L/10}$.`], risposta: { tipo: 'numero', valore: 1e-8, unita: 'W/m²' }, soluzione: [R`$I = 10^{-12} \cdot 10^{40/10}\,\text{W/m}^2 = 10^{-12} \cdot 10^{4}\,\text{W/m}^2 = 10^{-8}\,\text{W/m}^2$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Il livello sonoro passa da 45 dB a 75 dB. Quante volte più grande è diventata l'intensità?`, suggerimenti: [R`Ogni 10 dB l'intensità si moltiplica per 10.`], risposta: { tipo: 'numero', valore: 1000 }, soluzione: [R`$75 - 45 = 30\,\text{dB}$: tre gradini.`, R`$10 \cdot 10 \cdot 10 = 1000$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Due stampanti uguali, accese insieme, si sentono in un punto. Ognuna da sola, lì, dà 64 dB. Quanti decibel danno insieme?`, suggerimenti: [R`Le intensità si sommano: intensità doppia.`, R`Intensità doppia vuol dire circa +3 dB.`], risposta: { tipo: 'numero', valore: 67, tolleranza: 0.2, segnaposto: 'Numero (in dB)' }, soluzione: [R`$L = 64\,\text{dB} + 10 \cdot \log_{10} 2\,\text{dB} \approx 64\,\text{dB} + 3\,\text{dB} = 67\,\text{dB}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Un'auto si avvicina a 25 m/s e suona il clacson a 315 Hz. Che frequenza senti, fermo a bordo strada?`, suggerimenti: [R`Sorgente che si avvicina: $f' = f \cdot \dfrac{v}{v - u}$.`], risposta: { tipo: 'numero', valore: 340, unita: 'Hz' }, soluzione: [R`$f' = 315\,\text{Hz} \cdot \dfrac{340}{340 - 25} = 315\,\text{Hz} \cdot \dfrac{340}{315} = 340\,\text{Hz}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Due diapason, da 256 Hz e da 261 Hz, suonano insieme. Quanti battimenti si sentono in un secondo?`, suggerimenti: [R`$f_b = f_2 - f_1$.`], risposta: { tipo: 'numero', valore: 5, unita: 'Hz' }, soluzione: [R`$f_b = 261\,\text{Hz} - 256\,\text{Hz} = 5\,\text{Hz}$: cinque battimenti al secondo.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un tubo lungo 0,85 m è chiuso a un capo. Qual è la sua frequenza fondamentale?`, suggerimenti: [R`Canna chiusa: $\lambda_1 = 4 \cdot \ell$.`, R`Poi $f_1 = \dfrac{v}{\lambda_1}$.`], risposta: { tipo: 'numero', valore: 100, unita: 'Hz' }, soluzione: [R`$\lambda_1 = 4 \cdot 0{,}85\,\text{m} = 3{,}4\,\text{m}$.`, R`$f_1 = \dfrac{340\,\text{m/s}}{3{,}4\,\text{m}} = 100\,\text{Hz}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`In una sera d'autunno, a 10 °C, fra il lampo e il tuono passano 7 s. A che distanza è il fulmine? Rispondi in chilometri.`, suggerimenti: [R`Prima la velocità del suono a 10 °C: $v \approx (331 + 0{,}6 \cdot t_C)\,\text{m/s}$.`, R`Poi $d = v \cdot t$.`], risposta: { tipo: 'numero', valore: 2.36, unita: 'km', tolleranza: 0.015 }, soluzione: [R`$v \approx (331 + 0{,}6 \cdot 10)\,\text{m/s} = 337\,\text{m/s}$.`, R`$d = 337\,\text{m/s} \cdot 7\,\text{s} = 2359\,\text{m} \approx 2{,}36\,\text{km}$.`, R`Con la regola dei 3 secondi: $7 / 3 \approx 2{,}3\,\text{km}$. Torna.`] },
    { id: 'es-02', difficolta: 2, testo: R`Davanti a una scogliera batti le mani e senti l'eco dopo 0,6 s. Poi ti allontani di altri 34 m dalla scogliera. Dopo quanto senti l'eco adesso?`, suggerimenti: [R`Prima trova la distanza della scogliera: $d = \dfrac{v \cdot t}{2}$.`, R`Aggiungi 34 m, poi calcola il tempo di andata e ritorno.`], risposta: { tipo: 'numero', valore: 0.8, unita: 's' }, soluzione: [R`All'inizio: $d = \dfrac{340 \cdot 0{,}6}{2}\,\text{m} = 102\,\text{m}$.`, R`Dopo: $d' = 102 + 34 = 136\,\text{m}$.`, R`$t' = \dfrac{2 \cdot 136\,\text{m}}{340\,\text{m/s}} = 0{,}8\,\text{s}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un'auto della polizia si allontana da te con la sirena accesa. La sirena suona a 800 Hz, tu senti 760 Hz. A che velocità va l'auto?`, suggerimenti: [R`Sorgente che si allontana: $f' = f \cdot \dfrac{v}{v + u}$.`, R`Ricava $v + u = \dfrac{f \cdot v}{f'}$.`], risposta: { tipo: 'numero', valore: 17.9, unita: 'm/s', tolleranza: 0.3 }, soluzione: [R`$v + u = \dfrac{800 \cdot 340}{760}\,\text{m/s} \approx 357{,}9\,\text{m/s}$.`, R`$u \approx 357{,}9 - 340 = 17{,}9\,\text{m/s}$, circa 64 km/h.`] },
    { id: 'es-04', difficolta: 2, testo: R`La sirena di una fabbrica suona a 476 Hz. Un ciclista pedala verso la fabbrica a 10 m/s. Che frequenza sente?`, suggerimenti: [R`Qui si muove l'ascoltatore, non la sorgente.`, R`Ascoltatore che va verso la sorgente: $f' = f \cdot \dfrac{v + u}{v}$.`], risposta: { tipo: 'numero', valore: 490, unita: 'Hz', tolleranza: 0.2 }, soluzione: [R`$f' = 476\,\text{Hz} \cdot \dfrac{340 + 10}{340} = 476\,\text{Hz} \cdot \dfrac{350}{340} = 490\,\text{Hz}$.`, R`Il ciclista incontra più creste ogni secondo di chi sta fermo.`] },
    { id: 'es-05', difficolta: 3, testo: R`In un'aula 30 studenti parlano tutti insieme. In un certo punto ognuno, da solo, darebbe 50 dB. Che livello sonoro c'è in quel punto con tutti e 30?`, suggerimenti: [R`Le intensità si sommano: 30 volte quella di uno.`, R`$L = 50\,\text{dB} + 10 \cdot \log_{10} 30$.`], risposta: { tipo: 'numero', valore: 64.8, tolleranza: 0.3, segnaposto: 'Numero (in dB)' }, soluzione: [R`L'intensità totale è $30 \cdot I$.`, R`$L = 10 \cdot \log_{10} \dfrac{30 \cdot I}{I_0} = 10 \cdot \log_{10} 30 + 50\,\text{dB}$.`, R`$10 \cdot \log_{10} 30 \approx 14{,}8$, quindi $L \approx 64{,}8\,\text{dB}$. Meno di 15 dB in più, con trenta voci.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un altoparlante, all'aperto, emette 0,4 W di potenza sonora in tutte le direzioni. Che livello sonoro si misura a 5 m?`, suggerimenti: [R`Prima l'intensità: $I = \dfrac{P}{4\pi \cdot r^2}$.`, R`Poi $L = 10 \cdot \log_{10} \dfrac{I}{I_0}$.`], risposta: { tipo: 'numero', valore: 91, tolleranza: 0.5, segnaposto: 'Numero (in dB)' }, soluzione: [R`$I = \dfrac{0{,}4\,\text{W}}{4\pi \cdot (5\,\text{m})^2} = \dfrac{0{,}4}{314}\,\text{W/m}^2 \approx 1{,}27 \cdot 10^{-3}\,\text{W/m}^2$.`, R`$\dfrac{I}{I_0} \approx 1{,}27 \cdot 10^{9}$, e $10 \cdot \log_{10}(1{,}27 \cdot 10^{9}) \approx 10 \cdot 9{,}1 = 91\,\text{dB}$.`] },
    { id: 'es-07', difficolta: 2, testo: R`Due corde di pianoforte devono dare la stessa nota. Una è a 523 Hz; insieme danno 6 battimenti in 3 s. L'accordatore allenta un poco la seconda corda, e i battimenti diventano più fitti. Che frequenza aveva la seconda corda?`, suggerimenti: [R`Prima la frequenza dei battimenti: battimenti diviso tempo.`, R`Allentando una corda la sua frequenza scende. Se i battimenti aumentano, si sta allontanando da 523 Hz.`], risposta: { tipo: 'numero', valore: 521, unita: 'Hz' }, soluzione: [R`$f_b = \dfrac{6}{3\,\text{s}} = 2\,\text{Hz}$: la seconda corda è a 521 Hz oppure a 525 Hz.`, R`Allentandola la frequenza scende, e i battimenti aumentano: si allontana da 523 Hz scendendo. Quindi era già sotto: $521\,\text{Hz}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Una canna d'organo aperta ai due capi ha la fondamentale a 425 Hz. Quanto è lunga?`, suggerimenti: [R`Canna aperta: $f_1 = \dfrac{v}{2 \cdot \ell}$.`, R`$\ell = \dfrac{v}{2 \cdot f_1}$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'm' }, soluzione: [R`$\ell = \dfrac{340\,\text{m/s}}{2 \cdot 425\,\text{Hz}} = \dfrac{340}{850}\,\text{m} = 0{,}4\,\text{m}$: 40 cm.`] },
    { id: 'es-09', difficolta: 2, testo: R`Un bicchiere di cristallo, colpito con un cucchiaino, suona a 880 Hz. Quanto è lunga, nell'aria, l'onda della nota che lo fa risuonare?`, suggerimenti: [R`La nota giusta ha la frequenza propria del bicchiere.`, R`$\lambda = \dfrac{v}{f}$.`], risposta: { tipo: 'numero', valore: 0.386, unita: 'm', tolleranza: 0.005 }, soluzione: [R`Per la risonanza serve proprio $f = f_0 = 880\,\text{Hz}$.`, R`$\lambda = \dfrac{340\,\text{m/s}}{880\,\text{Hz}} \approx 0{,}386\,\text{m}$, cioè circa 39 cm.`] },
    { id: 'es-10', difficolta: 3, testo: R`Lasci cadere un sasso, da fermo, in un pozzo. Senti il tonfo nell'acqua dopo 2,5 s. Quanto è profondo il pozzo? Trascura l'aria.`, suggerimenti: [R`I 2,5 s sono la caduta più il ritorno del suono. Prima stima: trascura il suono, $h = \frac{1}{2} \cdot g \cdot t^2$.`, R`Con quella profondità calcola il tempo del suono, toglilo dai 2,5 s e ricalcola $h$. Ripeti una volta.`], risposta: { tipo: 'numero', valore: 28.6, unita: 'm', tolleranza: 0.5 }, soluzione: [R`Prima stima, senza suono: $h = 4{,}9 \cdot 2{,}5^2\,\text{m} \approx 30{,}6\,\text{m}$.`, R`Il suono risale in $\dfrac{30{,}6}{340}\,\text{s} \approx 0{,}09\,\text{s}$. La caduta dura allora $2{,}41\,\text{s}$, e $h = 4{,}9 \cdot 2{,}41^2\,\text{m} \approx 28{,}5\,\text{m}$.`, R`Un altro giro: suono $\dfrac{28{,}5}{340} \approx 0{,}084\,\text{s}$, caduta $2{,}416\,\text{s}$, $h \approx 28{,}6\,\text{m}$. Le stime non cambiano più.`, R`Si può anche risolvere l'equazione $\sqrt{\dfrac{2 \cdot h}{g}} + \dfrac{h}{v} = 2{,}5\,\text{s}$, di secondo grado in $\sqrt{h}$: viene lo stesso.`] },
    { id: 'es-11', difficolta: 3, testo: R`Il livello sonoro di un suono sale di 6 dB, con la stessa frequenza. Per quanto si è moltiplicata l'ampiezza dell'onda?`, suggerimenti: [R`Prima trova di quanto si è moltiplicata l'intensità: $10^{6/10}$.`, R`L'intensità va con il quadrato dell'ampiezza.`], risposta: { tipo: 'numero', valore: 2, tolleranza: 0.05 }, soluzione: [R`L'intensità si moltiplica per $10^{0{,}6} \approx 3{,}98$, cioè circa 4.`, R`L'intensità va con il quadrato dell'ampiezza: l'ampiezza si moltiplica per $\sqrt{4} = 2$.`] },
    { id: 'es-12', difficolta: 3, testo: R`Un pipistrello vola a 10 m/s verso una parete ed emette ultrasuoni a 40 kHz. Che frequenza ha l'eco che gli torna dalla parete? Rispondi in kHz.`, suggerimenti: [R`Due passi. Prima la parete fa da ascoltatore fermo, con la sorgente che le si avvicina.`, R`Poi la parete rimanda il suono come una sorgente ferma, e il pipistrello è un ascoltatore che le va incontro.`], risposta: { tipo: 'numero', valore: 42.4, unita: 'kHz', tolleranza: 0.2 }, soluzione: [R`Alla parete arriva $f_1 = f \cdot \dfrac{v}{v - u} = 40\,\text{kHz} \cdot \dfrac{340}{330} \approx 41{,}2\,\text{kHz}$.`, R`Il pipistrello va incontro all'eco: $f_2 = f_1 \cdot \dfrac{v + u}{v} = 41{,}2\,\text{kHz} \cdot \dfrac{350}{340} \approx 42{,}4\,\text{kHz}$.`, R`In una formula sola: $f_2 = f \cdot \dfrac{v + u}{v - u}$. Dallo spostamento della nota il pipistrello capisce quanto in fretta si avvicina all'ostacolo.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che tipo di onda è il suono nell'aria?`, opzioni: [R`Trasversale, come un'onda su una corda`, R`Longitudinale: l'aria oscilla lungo la direzione dell'onda`, R`Elettromagnetica, come la luce`, R`Un flusso d'aria che corre dalla sorgente all'orecchio`], corretta: 1, spiegazione: R`Nell'aria il suono è fatto di compressioni e rarefazioni: ogni strato oscilla avanti e indietro lungo la direzione dell'onda. Non è elettromagnetico, perché nel vuoto non passa. L'aria non viaggia con l'onda.` },
    { id: 'q-02', domanda: R`Perché nello spazio non si sentono le esplosioni?`, opzioni: [R`Perché fa troppo freddo`, R`Perché le esplosioni nello spazio sono silenziose all'origine`, R`Perché non c'è un mezzo in cui il suono possa propagarsi`, R`Perché il suono va troppo veloce per essere sentito`], corretta: 2, spiegazione: R`Il suono è un'onda meccanica: senza aria non c'è niente da comprimere. Il freddo cambierebbe solo la velocità. L'esplosione fa vibrare i gas vicini, ma l'onda si spegne nel vuoto.` },
    { id: 'q-03', domanda: R`Da che cosa dipende la velocità del suono nell'aria?`, opzioni: [R`Dalla temperatura dell'aria`, R`Dalla frequenza del suono`, R`Dal volume del suono`, R`Dalla potenza della sorgente`], corretta: 0, spiegazione: R`La velocità la decide il mezzo: nell'aria cresce di circa 0,6 m/s per ogni grado. Frequenza, volume e potenza della sorgente non la cambiano: note acute e gravi, forti e deboli, viaggiano insieme.` },
    { id: 'q-04', domanda: R`Due suoni hanno la stessa ampiezza; uno ha frequenza doppia dell'altro. Quello a frequenza doppia è…`, opzioni: [R`più forte`, R`più veloce`, R`più grave`, R`più acuto`], corretta: 3, spiegazione: R`L'altezza è la frequenza: più frequenza, suono più acuto. Il volume dipende dall'ampiezza, che è la stessa. La velocità nell'aria non dipende dalla frequenza.` },
    { id: 'q-05', domanda: R`Un flauto e un oboe suonano la stessa nota, con lo stesso volume. Che cosa li distingue?`, opzioni: [R`La frequenza fondamentale`, R`Il timbro, cioè il miscuglio di armoniche`, R`La velocità del loro suono`, R`L'ampiezza dell'onda`], corretta: 1, spiegazione: R`Stessa nota vuol dire stessa fondamentale, stesso volume vuol dire intensità uguale. Resta la forma dell'onda, che dipende dalle armoniche: è il timbro. La velocità nell'aria è la stessa per tutti.` },
    { id: 'q-06', domanda: R`L'ampiezza di un suono triplica, con la stessa frequenza. L'intensità…`, opzioni: [R`triplica`, R`resta la stessa`, R`diventa nove volte tanta`, R`diventa sei volte tanta`], corretta: 2, spiegazione: R`L'intensità cresce con il quadrato dell'ampiezza: $3^2 = 9$. Triplicherebbe se fosse proporzionale all'ampiezza, e non lo è.` },
    { id: 'q-07', domanda: R`Un suono sale da 60 dB a 70 dB. La sua intensità…`, opzioni: [R`diventa dieci volte tanta`, R`aumenta di circa il 17%`, R`raddoppia`, R`aumenta di $10\,\text{W/m}^2$`], corretta: 0, spiegazione: R`I decibel contano i fattori dieci: +10 dB vuol dire intensità per 10. Il 17% verrebbe confrontando 70 e 60 come numeri qualsiasi. Il raddoppio dell'intensità vale solo 3 dB.` },
    { id: 'q-08', domanda: R`Due altoparlanti uguali, ognuno da 80 dB, suonano insieme. Che livello si misura?`, opzioni: [R`160 dB`, R`80 dB`, R`circa 83 dB`, R`90 dB`], corretta: 2, spiegazione: R`Si sommano le intensità: intensità doppia, cioè $10 \cdot \log_{10} 2 \approx 3\,\text{dB}$ in più. I decibel non si sommano. Per 90 dB servirebbero dieci altoparlanti.` },
    { id: 'q-09', domanda: R`Quanto vale l'intensità alla soglia di udibilità, cioè a 0 dB?`, opzioni: [R`zero: a 0 dB non c'è suono`, R`$1\,\text{W/m}^2$`, R`$10^{-6}\,\text{W/m}^2$`, R`$10^{-12}\,\text{W/m}^2$`], corretta: 3, spiegazione: R`0 dB vuol dire $I = I_0 = 10^{-12}\,\text{W/m}^2$: il suono più debole che si sente, non l'assenza di suono. $1\,\text{W/m}^2$ è circa la soglia del dolore, $10^{-6}\,\text{W/m}^2$ una conversazione.` },
    { id: 'q-10', domanda: R`Un'ambulanza si avvicina a sirena accesa. Rispetto alla nota della sirena, chi è fermo sente…`, opzioni: [R`la stessa nota, ma più forte`, R`una nota più acuta`, R`una nota più grave`, R`una nota che sale sempre di più`], corretta: 1, spiegazione: R`Davanti alla sorgente le creste si ammucchiano: arrivano più spesso, e la frequenza ricevuta è più alta. Con velocità costante la nota resta costante, più alta di quella emessa. Più grave si sente quando l'ambulanza si allontana.` },
    { id: 'q-11', domanda: R`Nell'effetto Doppler, che cosa cambia?`, opzioni: [R`La frequenza emessa dalla sorgente`, R`La velocità del suono nell'aria`, R`Il timbro della sorgente`, R`La frequenza ricevuta dall'ascoltatore`], corretta: 3, spiegazione: R`La sorgente emette sempre la stessa frequenza, e il suono viaggia nell'aria sempre alla stessa velocità. Cambia la frequenza con cui le creste arrivano all'ascoltatore.` },
    { id: 'q-12', domanda: R`Per far oscillare il più possibile un'altalena con poche spinte leggere, bisogna…`, opzioni: [R`spingere con la sua frequenza propria`, R`spingere il più spesso possibile`, R`spingere con il doppio della sua frequenza propria`, R`spingere sempre più forte`], corretta: 0, spiegazione: R`È la risonanza: le spinte alla frequenza propria arrivano sempre in fase con il moto, e ognuna aggiunge energia. Spingendo più spesso, o al doppio della frequenza, molte spinte arrivano contro il moto.` },
    { id: 'q-13', domanda: R`Due diapason suonano insieme e si sentono 4 battimenti al secondo. Che cosa si può dire?`, opzioni: [R`Le due frequenze sono 4 Hz e 8 Hz`, R`Le due frequenze differiscono di 4 Hz`, R`Uno dei diapason è a 4 Hz`, R`Le due frequenze sono una quattro volte l'altra`], corretta: 1, spiegazione: R`I battimenti al secondo sono la differenza delle frequenze, $f_2 - f_1$. Non dicono quanto valgono le due frequenze, né quale è più alta. Un diapason a 4 Hz non si sentirebbe: è un infrasuono.` },
    { id: 'q-14', domanda: R`Una canna è chiusa a un capo. Rispetto alla stessa canna aperta ai due capi, la sua fondamentale è…`, opzioni: [R`il doppio`, R`la stessa`, R`la metà`, R`un quarto`], corretta: 2, spiegazione: R`Aperta: $\lambda_1 = 2 \cdot \ell$. Chiusa: $\lambda_1 = 4 \cdot \ell$, il doppio. Con $f = v/\lambda$, lunghezza d'onda doppia vuol dire frequenza metà.` },
    { id: 'q-15', domanda: R`Senti l'eco di un grido dopo 1 s. A che distanza è la parete?`, opzioni: [R`340 m`, R`680 m`, R`85 m`, R`170 m`], corretta: 3, spiegazione: R`In 1 s il suono fa 340 m, ma è andata e ritorno: la parete è a metà, $170\,\text{m}$. 340 m è l'errore di chi dimentica il ritorno, 680 m quello di chi raddoppia invece di dimezzare.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Con l'eco il suono va **e torna**: la distanza della parete è $\dfrac{v \cdot t}{2}$, non $v \cdot t$.` },
    { tipo: 'errore', testo: R`I decibel non si sommano. Due sorgenti uguali danno solo 3 dB in più: si sommano le intensità.` },
    { tipo: 'errore', testo: R`Altezza non vuol dire volume. L'altezza è la frequenza; il volume dipende dall'ampiezza, cioè dall'intensità.` },
    { tipo: 'errore', testo: R`Nell'effetto Doppler la sorgente non cambia nota: cambia la frequenza che arriva a chi ascolta.` },
    { tipo: 'trucco', testo: R`Fulmini: conta i secondi fra lampo e tuono e dividi per 3. Ottieni la distanza in chilometri.` },
    { tipo: 'trucco', testo: R`Decibel a gradini: +10 dB intensità per 10, +20 dB per 100, +3 dB circa per 2.` },
    { tipo: 'trucco', testo: R`Doppler, per non sbagliare il segno: se si avvicinano, $f'$ deve venire più grande di $f$. Scegli il segno che fa tornare così.` },
    { tipo: 'metodo', testo: R`Per i battimenti fai sempre la differenza fra la frequenza più alta e la più bassa. Poi chiediti da che parte sta la nota sconosciuta.` },
    { tipo: 'metodo', testo: R`Nelle canne disegna nodi e ventri: chiuso vuol dire nodo, aperto vuol dire ventre. Poi conta quante mezze onde, o quarti d'onda, ci stanno.` }
  ],
  aneddoti: [
    { fisico: 'Robert Boyle', anni: '1627–1691', titolo: 'L\'orologio appeso dentro la campana di vetro', testo: R`Verso il 1659 Robert Boyle si fece costruire una pompa per togliere l'aria. Gliela realizzò il giovane Robert Hooke, il suo assistente. Il cuore era una grande campana di vetro, che si poteva svuotare un poco alla volta. Boyle vi appese dentro un orologio da tasca, legato a un filo perché non toccasse il vetro. Con l'aria, il ticchettio si sentiva bene. Mentre la pompa lavorava, il suono si faceva sempre più debole, fino quasi a sparire. Appena l'aria rientrava, il ticchettio tornava. La pompa non faceva un vuoto perfetto, ma il risultato era chiaro. Boyle lo pubblicò nel 1660, nei *New Experiments Physico-Mechanicall*.`, legame: R`Mostra che il suono ha bisogno di un mezzo: nel vuoto non si propaga.` },
    { fisico: 'Jean-Daniel Colladon', anni: '1802–1893', titolo: 'La campana suonata sotto il lago di Ginevra', testo: R`Nel novembre 1826 il giovane ginevrino Jean-Daniel Colladon e l'amico matematico Charles Sturm misurarono la velocità del suono nell'acqua. Lavorarono sul lago di Ginevra, fra Rolle e Thonon, a circa 13 km di distanza. Da una barca calarono nel lago una campana. Una leva batteva la campana e, nello stesso istante, accendeva un po' di polvere da sparo. Sull'altra barca Colladon guardava il lampo e ascoltava con un cornetto acustico immerso nell'acqua. Il suono arrivava dopo poco più di nove secondi. Ne ricavarono circa 1435 metri al secondo, più di quattro volte la velocità nell'aria. È lo stesso metodo del lampo e del tuono.`, legame: R`È il metodo del fulmine, il ritardo fra luce e suono, usato per misurare la velocità del suono nell'acqua.` },
    { fisico: 'Christophorus Buys Ballot', anni: '1817–1890', titolo: 'I trombettieri sul treno di Utrecht', testo: R`Nel 1842, a Praga, l'austriaco Christian Doppler aveva previsto che il moto della sorgente cambia la frequenza ricevuta. Pensava soprattutto al colore delle stelle doppie. Nel giugno 1845 l'olandese Christophorus Buys Ballot decise di metterlo alla prova con il suono. Sulla nuova ferrovia fra Utrecht e Maarssen fece salire alcuni suonatori di corno su un vagone aperto. Suonavano una nota fissa mentre la locomotiva andava avanti e indietro. Lungo i binari aspettavano musicisti con l'orecchio assoluto, che annotavano le note sentite. Quando il treno si avvicinava la nota era più alta, quando si allontanava più bassa. Doppler aveva ragione, almeno per il suono.`, legame: R`È la prima verifica sperimentale dell'effetto Doppler per le onde sonore.` },
    { fisico: 'Wallace Sabine', anni: '1868–1919', titolo: 'I cuscini presi in prestito di notte', testo: R`Nel 1895 l'Università di Harvard aveva un'aula nuova, nel Fogg Art Museum, ma nessuno capiva le lezioni. Ogni parola rimbombava per secondi. Il problema fu affidato a un giovane fisico, Wallace Sabine. Sabine lavorò di notte, quando c'era silenzio. Suonava una canna d'organo, la fermava e misurava con un cronometro quanto durava il suono prima di sparire. Poi portava nell'aula i cuscini delle sedie di un teatro vicino, il Sanders Theatre, e ripeteva la misura. Più cuscini c'erano, più breve era il rimbombo. Prima dell'alba riportava tutto a posto. Dai suoi numeri nacque una formula per prevedere il rimbombo di una sala. La usò per progettare la Symphony Hall di Boston, inaugurata nel 1900.`, legame: R`Il rimbombo è il suono che rimbalza sulle pareti, come l'eco, finché le superfici non ne assorbono l'energia.` }
  ]
});
})();
