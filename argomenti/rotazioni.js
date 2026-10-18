/* Quanto — Il moto rotatorio (rotazioni, terzo anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/rotazioni.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'rotazioni',
  titolo: 'Il moto rotatorio',
  introduzione: R`Una porta che si apre, la ruota di una bici, una trottola, la Terra che gira su se stessa. Fin qui i corpi erano punti che si spostano. Un corpo esteso invece può anche **ruotare** attorno a un asse. Qui si studia come.

Per le rotazioni ci sono grandezze gemelle di quelle del moto rettilineo. Al posto della posizione c'è un angolo, al posto della massa il momento d'inerzia, al posto della forza il momento. Con queste si capisce perché una porta blindata è dura da aprire. E perché un cilindro pieno vince la gara in discesa. E perché una pattinatrice che chiude le braccia gira più in fretta.

Serve conoscere il momento di una forza, il moto circolare con i radianti, l'energia cinetica e la quantità di moto.`,
  inBreve: [
    R`In un corpo rigido che ruota tutti i punti girano dello stesso angolo: $\omega = \dfrac{\Delta\theta}{\Delta t}$ in rad/s, $\alpha = \dfrac{\Delta\omega}{\Delta t}$ in rad/s². Un punto a distanza $r$ dall'asse va a $v = \omega \cdot r$.`,
    R`Il **momento d'inerzia** $I = \Sigma\, m \cdot r^2$ dice quanto è difficile far girare un corpo. Conta la massa, ma soprattutto quanto è lontana dall'asse.`,
    R`Il **secondo principio per le rotazioni** è $M = I \cdot \alpha$: il momento fa accelerare la rotazione, come la forza fa accelerare la traslazione.`,
    R`Un corpo che gira ha **energia cinetica di rotazione** $\tfrac{1}{2} \cdot I \cdot \omega^2$. Chi rotola ha anche quella di traslazione, $\tfrac{1}{2} \cdot m \cdot v^2$.`,
    R`Il **momento angolare** è $L = I \cdot \omega$. Senza momenti esterni resta costante: se $I$ diminuisce, $\omega$ aumenta.`
  ],
  sezioni: [
    {
      id: 'angoli',
      titolo: 'Angolo e velocità angolare',
      testo: R`Le lancette di un orologio, la ruota di una bici, un disco in vinile. Girano attorno a un asse, e ogni loro punto descrive una circonferenza. Sono **corpi rigidi**: mentre girano non si deformano.

In un corpo rigido che ruota, tutti i punti girano dello stesso angolo nello stesso tempo. Per descrivere il moto basta allora un numero: l'angolo di cui il corpo ha girato. È la **posizione angolare** $\theta$ (si legge «theta»).

Gli angoli si misurano in **radianti**. L'angolo in radianti è l'arco diviso il raggio: $\theta = s / r$. Un giro intero vale $2\pi\,\text{rad}$, cioè 360°. Un radiante è circa 57,3°.

>* La **velocità angolare** è l'angolo descritto diviso il tempo impiegato: $\omega = \dfrac{\Delta\theta}{\Delta t}$. Si misura in radianti al secondo, rad/s.

Se il corpo fa $f$ giri al secondo, in un secondo descrive $f$ volte $2\pi$ radianti. Quindi $\omega = 2\pi \cdot f$.

Esempio. Un disco in vinile gira a 33 giri e un terzo al minuto. Quanto vale $\omega$? E quanto è veloce un punto del bordo, a 15 cm dal centro?

~ \omega = \dfrac{33{,}3 \cdot 2\pi\,\text{rad}}{60\,\text{s}} :: ogni giro vale $2\pi$ radianti, un minuto 60 secondi
~ \omega \approx \evidb{3{,}49\,\text{rad/s}} :: la stessa per tutti i punti del disco
~ v = \omega \cdot r = 3{,}49\,\text{rad/s} \cdot 0{,}15\,\text{m} :: la velocità di un punto a distanza $r$ dall'asse
~ v \approx \evidb{0{,}52\,\text{m/s}} :: il radiante è un numero puro: resta m/s

Un punto a 7,5 cm dal centro descrive lo stesso angolo nello stesso tempo. Però fa un cerchio lungo la metà, e va a metà velocità: circa 0,26 m/s.

[[grafico:disco]]

>! I giri al minuto non sono radianti al secondo. Per passare ai rad/s si moltiplica per $2\pi$ e si divide per 60.

?? Una ruota fa 120 giri al minuto. Quanto vale la sua velocità angolare?
[ ] $120\,\text{rad/s}$
[x] circa $12{,}6\,\text{rad/s}$
[ ] $2\,\text{rad/s}$
[ ] circa $754\,\text{rad/s}$
=> 120 giri al minuto sono 2 giri al secondo. Ogni giro vale $2\pi$: $\omega = 2 \cdot 2\pi \approx 12{,}6\,\text{rad/s}$. Con 754 si è dimenticato di dividere per 60; con 2 si è dimenticato il $2\pi$.`
    },
    {
      id: 'accelerazione-angolare',
      titolo: 'L\'accelerazione angolare',
      testo: R`Si accende un ventilatore. Le pale partono da ferme e girano sempre più in fretta. Quando lo si spegne, rallentano fino a fermarsi. La velocità angolare cambia.

>* L'**accelerazione angolare** è la variazione di velocità angolare divisa il tempo: $\alpha = \dfrac{\Delta\omega}{\Delta t}$. Si misura in rad/s².

Le grandezze della rotazione sono gemelle di quelle del moto rettilineo. Le formule hanno la stessa forma: cambiano solo le lettere.

| moto rettilineo | rotazione |
|---|---|
| posizione $s$, in m | angolo $\theta$, in rad |
| velocità $v$, in m/s | velocità angolare $\omega$, in rad/s |
| accelerazione $a$, in m/s² | accelerazione angolare $\alpha$, in rad/s² |
| $v = v_0 + a \cdot t$ | $\omega = \omega_0 + \alpha \cdot t$ |

Con $\alpha$ costante il moto si dice **rotatorio uniformemente accelerato**. La legge oraria e la formula senza il tempo si copiano dal moto rettilineo:

$$\theta = \theta_0 + \omega_0 \cdot t + \tfrac{1}{2} \cdot \alpha \cdot t^2$$

$$\omega^2 = \omega_0^2 + 2 \cdot \alpha \cdot \Delta\theta$$

Esempio. Le pale di un ventilatore partono da ferme con $\alpha = 5\,\text{rad/s}^2$, per 4 secondi.

~ \omega = \alpha \cdot t = 20\,\text{rad/s} :: partono da ferme, quindi $\omega_0 = 0$; e $5 \cdot 4 = 20$
~ \Delta\theta = \tfrac{1}{2} \cdot \alpha \cdot t^2 :: l'angolo descritto, partendo da fermi
~ \Delta\theta = \tfrac{1}{2} \cdot 5 \cdot 4^2\,\text{rad} = 40\,\text{rad} :: con $\alpha = 5\,\text{rad/s}^2$ e $t = 4\,\text{s}$
~ \text{giri} = \dfrac{40}{2\pi} \approx \evidb{6{,}4} :: ogni giro vale $2\pi$ radianti

Anche il grafico funziona allo stesso modo. Nel grafico velocità angolare–tempo la pendenza è $\alpha$. L'area sotto la linea è l'angolo descritto.

[[grafico:omega]]

Ogni punto della pala accelera lungo la sua circonferenza. La sua **accelerazione tangenziale** è $a_t = \alpha \cdot r$, come $v = \omega \cdot r$. Sulla punta della pala, a 20 cm dall'asse, vale $a_t = 5 \cdot 0{,}2 = 1\,\text{m/s}^2$.

>! L'accelerazione angolare non è l'accelerazione centripeta. Anche con $\omega$ costante ogni punto ha $a_c = \omega^2 \cdot r$ verso l'asse. Finita l'accelerazione, le pale girano a 20 rad/s costanti: $\alpha$ è zero, ma la punta ha ancora $a_c = 20^2 \cdot 0{,}2\,\text{m/s}^2 = 80\,\text{m/s}^2$.

?? Un disco frena da 12 rad/s a 4 rad/s in 2 secondi. Quanto vale la sua accelerazione angolare?
[x] $-4\,\text{rad/s}^2$
[ ] $4\,\text{rad/s}^2$
[ ] $-16\,\text{rad/s}^2$
[ ] $6\,\text{rad/s}^2$
=> $\alpha = \dfrac{4 - 12}{2} = -4\,\text{rad/s}^2$: il segno meno dice che la rotazione rallenta. Con 6 si è diviso la velocità iniziale per il tempo, senza fare la differenza.`
    },
    {
      id: 'seconda-legge',
      titolo: 'Il momento fa accelerare la rotazione',
      testo: R`Una ruota ferma non si mette a girare da sola. Per mettere in moto un corpo fermo serve una forza; per metterlo in rotazione serve un **momento**. Nell'equilibrio si è visto il momento di una forza, $M = F \cdot b$, con $b$ il braccio.

Se la somma dei momenti è zero, la rotazione non cambia. Il corpo resta fermo, oppure continua a girare con la stessa $\omega$. Se la somma non è zero, la velocità angolare cambia: c'è un'accelerazione angolare.

[[video:rotazioni/porta]]

Il video lo mostra con una porta. La stessa spinta, data a metà distanza dai cardini, ha metà momento: l'accelerazione angolare si dimezza. Una porta blindata, uguale ma con il triplo della massa, con la stessa spinta accelera tre volte meno. Conta il momento, e conta come è fatto il corpo.

> Nel video la larghezza della porta si chiama $L$. Qui una lunghezza si scrive $\ell$, perché la lettera $L$ servirà per il momento angolare.

Si vede bene con un corpo piccolo, di massa $m$, attaccato a un'asta leggera. Gira su una circonferenza di raggio $r$, spinto da una forza $F$ lungo la tangente.

~ F = m \cdot a_t :: il secondo principio della dinamica, lungo la tangente
~ F = m \cdot \alpha \cdot r :: l'accelerazione tangenziale è $a_t = \alpha \cdot r$
~ F \cdot r = m \cdot r^2 \cdot \alpha :: moltiplico per $r$: a sinistra c'è il momento della forza
~ M = \evidb{I \cdot \alpha} :: con $I = m \cdot r^2$, il **momento d'inerzia** del corpo

>* **Secondo principio della dinamica per le rotazioni**: $M = I \cdot \alpha$. Il momento totale delle forze esterne è uguale al momento d'inerzia per l'accelerazione angolare.

Il momento d'inerzia fa per la rotazione quello che la massa fa per la traslazione. Misura quanto il corpo resiste a cambiare il suo moto di rotazione. Si misura in kg·m².

Esempio. Una ruota di bici capovolta ha $I = 0{,}15\,\text{kg} \cdot \text{m}^2$. La spingi sulla gomma, a 0,35 m dall'asse, con 6 N tangenti.

~ M = F \cdot b = 6\,\text{N} \cdot 0{,}35\,\text{m} :: la forza è tangente: il braccio è il raggio
~ M = 2{,}1\,\text{N} \cdot \text{m} :: il momento della spinta
~ \alpha = \dfrac{M}{I} = \dfrac{2{,}1\,\text{N} \cdot \text{m}}{0{,}15\,\text{kg} \cdot \text{m}^2} :: dal secondo principio per le rotazioni
~ \alpha = \evidb{14\,\text{rad/s}^2} :: N·m diviso kg·m² dà 1/s², cioè rad/s²

>! Nel conto entra il momento **totale**. Se il perno fa attrito, il suo momento frena: va sottratto a quello della spinta.

?? Due ruote ricevono lo stesso momento. La seconda ha il momento d'inerzia doppio della prima. Come è la sua accelerazione angolare?
[ ] doppia
[ ] uguale, perché il momento è lo stesso
[x] la metà
[ ] un quarto
=> Da $\alpha = M / I$: con lo stesso $M$ e $I$ doppio, $\alpha$ si dimezza. È come spingere con la stessa forza una massa doppia.`
    },
    {
      id: 'momento-inerzia',
      titolo: 'Il momento d\'inerzia',
      testo: R`Prendi un bastone e fallo girare tenendolo nel mezzo. Poi prova tenendolo per un'estremità: costa molta più fatica. La massa è la stessa. È cambiato dove sta la massa rispetto all'asse.

Un corpo esteso si pensa diviso in tanti pezzetti. Ognuno ha la sua massa $m$ e sta a una distanza $r$ dall'asse di rotazione.

>* Il **momento d'inerzia** di un corpo rispetto a un asse è $I = \Sigma\, m \cdot r^2$. È la somma, su tutti i pezzetti, della massa per il quadrato della distanza dall'asse. Si misura in kg·m².

Qui $I$ è il momento d'inerzia, non l'impulso.

Esempio. Due palline da 0,2 kg stanno alle estremità di un'asticella leggera lunga 40 cm. L'asticella gira attorno al suo centro.

~ I = 2 \cdot m \cdot r^2 :: due pezzetti uguali, ognuno con $m \cdot r^2$
~ I = 2 \cdot 0{,}2\,\text{kg} \cdot (0{,}2\,\text{m})^2 :: ogni pallina è a 20 cm dal centro
~ I = \evidb{0{,}016\,\text{kg} \cdot \text{m}^2} :: l'asticella è leggera: la sua massa non conta

Se le palline si spostano a 10 cm dal centro, $I$ diventa quattro volte più piccolo. La distanza va al quadrato: la massa lontana dall'asse pesa molto di più.

[[grafico:manubrio]]

?? Un anello e un disco pieno hanno la stessa massa e lo stesso raggio. Quale ha il momento d'inerzia più grande, attorno al loro asse?
[x] l'anello
[ ] il disco pieno
[ ] è uguale, perché massa e raggio sono uguali
=> Nell'anello tutta la massa sta sul bordo, alla distanza massima. Nel disco molta massa è vicina all'asse e conta poco.

Per le figure semplici la somma è già fatta. Nell'anello tutti i pezzetti stanno alla stessa distanza $R$, quindi $I = (\Sigma\, m) \cdot R^2 = m \cdot R^2$. Per gli altri corpi servono conti più lunghi: ecco i risultati.

| corpo | asse | $I$ |
|---|---|---|
| anello, tubo sottile | il suo asse | $m \cdot R^2$ |
| disco, cilindro pieno | il suo asse | $\tfrac{1}{2} \cdot m \cdot R^2$ |
| sfera piena | un diametro | $\tfrac{2}{5} \cdot m \cdot R^2$ |
| sfera cava sottile | un diametro | $\tfrac{2}{3} \cdot m \cdot R^2$ |
| asta lunga $\ell$ | per il centro | $\tfrac{1}{12} \cdot m \cdot \ell^2$ |
| asta o porta, larga $\ell$ | per un estremo | $\tfrac{1}{3} \cdot m \cdot \ell^2$ |

[[grafico:forme]]

>! Il momento d'inerzia non è fisso come la massa. Lo stesso corpo ha momenti d'inerzia diversi attorno ad assi diversi. Bisogna sempre dire qual è l'asse.

> I due casi dell'asta sono legati dal **teorema degli assi paralleli**, o di Huygens-Steiner: $I = I_G + m \cdot r_G^2$. Qui $I_G$ è il momento d'inerzia per un asse parallelo che passa per il centro di massa. La distanza del centro di massa dall'asse è $r_G$. Per l'asta: $\tfrac{1}{12} \cdot m \cdot \ell^2 + m \cdot (\ell/2)^2 = \tfrac{1}{3} \cdot m \cdot \ell^2$.`
    },
    {
      id: 'energia-rotazione',
      titolo: 'L\'energia cinetica di rotazione',
      testo: R`Una ruota che gira sul suo perno non va da nessuna parte. Eppure ha energia: per fermarla bisogna frenarla, cioè fare un lavoro. Ogni suo pezzetto si muove, e ha la sua energia cinetica.

~ E_c = \Sigma\, \tfrac{1}{2} \cdot m \cdot v^2 :: sommo l'energia cinetica di tutti i pezzetti
~ E_c = \Sigma\, \tfrac{1}{2} \cdot m \cdot (\omega \cdot r)^2 :: ogni pezzetto va a $v = \omega \cdot r$, con la stessa $\omega$
~ E_c = \tfrac{1}{2} \cdot (\Sigma\, m \cdot r^2) \cdot \omega^2 :: porto fuori quello che è uguale per tutti
~ E_c = \evidb{\tfrac{1}{2} \cdot I \cdot \omega^2} :: la somma fra parentesi è il momento d'inerzia

>* L'**energia cinetica di rotazione** di un corpo rigido è $E_c = \tfrac{1}{2} \cdot I \cdot \omega^2$. Al posto della massa c'è $I$, al posto della velocità c'è $\omega$.

Esempio. Il tornio di un vasaio ha $I = 0{,}8\,\text{kg} \cdot \text{m}^2$ e gira a 10 rad/s. La sua energia è $E_c = \tfrac{1}{2} \cdot 0{,}8 \cdot 10^2\,\text{J} = 40\,\text{J}$.

Anche il lavoro ha la sua versione rotatoria. Un momento costante $M$ fa girare il corpo di un angolo $\Delta\theta$. Il suo lavoro è $L = M \cdot \Delta\theta$, con l'angolo in radianti. È il gemello di $L = F \cdot s$.

> Il lavoro si chiama $L$, come nel capitolo sull'energia. Più avanti la stessa lettera indicherà il momento angolare: sono due grandezze diverse.

Il teorema dell'energia cinetica vale anche qui. Il lavoro dei momenti è uguale alla variazione di $\tfrac{1}{2} \cdot I \cdot \omega^2$. E la potenza di un motore che gira è $P = M \cdot \omega$, come $P = F \cdot v$.

Sulle rotazioni si può anche mettere da parte energia. I **volani** sono dischi pesanti che, girando in fretta, accumulano energia cinetica. Poi la restituiscono quando serve.

>! L'energia di rotazione va con il quadrato di $\omega$. A velocità angolare doppia l'energia diventa quattro volte tanto. Per fermare il corpo serve allora un lavoro quattro volte più grande.

?? Due volani hanno la stessa energia cinetica. Il primo ha il momento d'inerzia quattro volte più grande del secondo. Come gira il primo?
[ ] quattro volte più piano
[x] a metà della velocità angolare
[ ] alla stessa velocità angolare
=> $E_c = \tfrac{1}{2} \cdot I \cdot \omega^2$: con $I$ quattro volte più grande, $\omega^2$ deve essere quattro volte più piccolo. Quindi $\omega$ è la metà.`
    },
    {
      id: 'rotolamento',
      titolo: 'Il rotolamento',
      testo: R`La ruota di una bici in corsa fa due cose insieme. Il suo centro avanza lungo la strada. E la ruota gira attorno al centro. Se la gomma non slitta sull'asfalto, si dice che la ruota **rotola**.

In un giro la ruota appoggia a terra tutta la sua circonferenza, lunga $2\pi \cdot R$. Nello stesso tempo il centro avanza di $2\pi \cdot R$.

>* Nel **rotolamento senza strisciare** la velocità del centro e la velocità angolare sono legate: $v = \omega \cdot R$.

Una bici va a 7 m/s con ruote di raggio 0,35 m. Le ruote girano a $\omega = \dfrac{7}{0{,}35}\,\text{rad/s} = 20\,\text{rad/s}$.

Il punto della ruota che tocca terra, in quell'istante, è fermo: per questo non striscia. Il punto più in alto va al doppio della velocità del centro.

[[grafico:ruota]]

Chi rotola ha due energie cinetiche. Quella di **traslazione**, perché il centro avanza, e quella di **rotazione**, perché gira:

$$E_c = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$$

[[video:rotazioni/rotolare]]

> Nel video $\alpha$ è l'angolo del piano inclinato, come nella dinamica. Qui, nelle rotazioni, $\alpha$ è l'accelerazione angolare: sono due cose diverse.

Si può capire chi vince la gara in discesa. Un corpo parte da fermo e rotola giù da un'altezza $h$. L'energia potenziale persa diventa cinetica, dei due tipi:

$$m \cdot g \cdot h = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$$

Il momento d'inerzia si scrive $I = k \cdot m \cdot R^2$: $k$ vale 1 per l'anello, $\tfrac{1}{2}$ per il cilindro pieno, $\tfrac{2}{5}$ per la sfera piena.

~ \tfrac{1}{2} \cdot I \cdot \omega^2 = \tfrac{1}{2} \cdot k \cdot m \cdot v^2 :: metto $I = k \cdot m \cdot R^2$ e $\omega = v / R$: il raggio se ne va
~ m \cdot g \cdot h = \tfrac{1}{2} \cdot (1 + k) \cdot m \cdot v^2 :: le due energie cinetiche insieme
~ v = \evidb{\sqrt{\dfrac{2 \cdot g \cdot h}{1 + k}}} :: la massa si semplifica: più piccolo è $k$, più veloce arriva

Vince chi ha il $k$ più piccolo: la massa più vicina all'asse. Prima la sfera piena, poi il cilindro pieno, ultimo l'anello. Anche l'accelerazione lungo il piano segue questa regola. Per il cilindro pieno è i 2/3 di quella che avrebbe scivolando senza attrito. Per l'anello, o il tubo sottile del video, è la metà.

[[grafico:ripartizione]]

>! Per rotolare serve l'attrito: su un piano di ghiaccio perfetto il corpo scivolerebbe senza girare. Però questo attrito non consuma energia. Il punto di contatto è fermo, quindi la forza non compie lavoro.

?? Una sfera piena e un cilindro pieno partono insieme e rotolano giù per lo stesso piano. Chi arriva prima?
[ ] il cilindro, perché tocca il piano su una linea intera
[x] la sfera
[ ] arrivano insieme, se hanno la stessa massa
=> Per la sfera $k = \tfrac{2}{5}$, per il cilindro $k = \tfrac{1}{2}$. La sfera mette meno energia nel girare e più nel correre. Massa e raggio non contano.`
    },
    {
      id: 'momento-angolare',
      titolo: 'Il momento angolare',
      testo: R`Un corpo che trasla ha una quantità di moto $p = m \cdot v$: più è grande, più è difficile fermarlo. Una ruota pesante che gira veloce è difficile da fermare allo stesso modo. Per le rotazioni c'è una grandezza gemella.

>* Il **momento angolare** di un corpo rigido che ruota attorno a un asse fisso è $L = I \cdot \omega$. Si misura in kg·m²/s.

Prendiamo un corpo piccolo di massa $m$, su una circonferenza di raggio $r$. Per lui la formula è più semplice:

~ L = I \cdot \omega :: la definizione
~ L = m \cdot r^2 \cdot \dfrac{v}{r} :: un corpo piccolo ha $I = m \cdot r^2$, e $\omega = v / r$
~ L = \evidb{m \cdot v \cdot r} :: la quantità di moto per la distanza dall'asse

Il momento angolare è un vettore. Per un corpo piccolo è $\vec{L} = \vec{r} \wedge \vec{p}$, come il momento di una forza è $\vec{M} = \vec{r} \wedge \vec{F}$. Qui $\vec{r}$ va dal centro della circonferenza al corpo, e $\vec{p}$ è la sua quantità di moto. Prendiamo un corpo rigido che gira attorno a un suo asse di simmetria, come una ruota. Il suo $\vec{L}$ sta lungo l'asse. Il verso si trova con la mano destra: le dita seguono la rotazione, il pollice indica $\vec{L}$.

Il secondo principio si può scrivere anche così: $M = \dfrac{\Delta L}{\Delta t}$. Il momento delle forze esterne è la variazione del momento angolare al secondo. È il gemello di $F = \dfrac{\Delta p}{\Delta t}$.

Esempio. Una ruota di bici da 1,2 kg ha quasi tutta la massa sul cerchione, a 0,35 m dall'asse. Gira a 20 rad/s. Che momento serve per fermarla in 3 secondi?

~ I = 1{,}2 \cdot 0{,}35^2\,\text{kg} \cdot \text{m}^2 :: la tratto come un anello: $I = m \cdot R^2$
~ I = 0{,}147\,\text{kg} \cdot \text{m}^2 :: tutta la massa a 35 cm dall'asse
~ L = I \cdot \omega \approx 2{,}94\,\text{kg} \cdot \text{m}^2\text{/s} :: il momento angolare iniziale, con $\omega = 20\,\text{rad/s}$
~ M = \dfrac{\Delta L}{\Delta t} = \dfrac{2{,}94}{3}\,\text{N} \cdot \text{m} :: alla fine $L = 0$: tutto il momento angolare va tolto
~ M \approx \evidb{0{,}98\,\text{N} \cdot \text{m}} :: in 3 secondi

>! Momento di una forza e momento angolare sono grandezze diverse, con unità diverse: N·m il primo, kg·m²/s il secondo. Il primo fa cambiare il secondo, come la forza fa cambiare la quantità di moto.

?? Una pallina legata a un filo gira su un cerchio. Con la stessa velocità, il raggio del cerchio raddoppia. Come cambia il suo momento angolare?
[ ] resta uguale
[x] raddoppia
[ ] diventa quattro volte tanto
[ ] si dimezza
=> $L = m \cdot v \cdot r$: con $m$ e $v$ uguali, $L$ è proporzionale a $r$. Il quadrato c'è in $I = m \cdot r^2$, ma poi $\omega = v / r$ si dimezza.`
    },
    {
      id: 'conservazione',
      titolo: 'La conservazione del momento angolare',
      testo: R`Una ruota che gira su un perno senza attrito continua a girare per sempre. Nessun momento la frena, e il suo momento angolare resta lo stesso. È la versione rotatoria del principio d'inerzia.

>* **Conservazione del momento angolare**: se il momento totale delle forze esterne è zero, il momento angolare resta costante. Per un corpo che cambia forma: $I_1 \cdot \omega_1 = I_2 \cdot \omega_2$.

La novità è questa: un corpo può cambiare da solo il suo momento d'inerzia, spostando le sue parti. Se $L$ non cambia e $I$ diminuisce, $\omega$ deve aumentare.

[[video:rotazioni/momento-angolare]]

Esempio. Uno studente siede su uno sgabello girevole, con due manubri a braccia tese. Con lo sgabello ha $I_1 = 4\,\text{kg} \cdot \text{m}^2$ e gira a 2 rad/s. Poi porta i manubri al petto, e $I$ scende a 1,6 kg·m².

~ I_1 \cdot \omega_1 = I_2 \cdot \omega_2 :: l'attrito del perno è piccolo: $L$ si conserva
~ \omega_2 = \dfrac{I_1 \cdot \omega_1}{I_2} = \dfrac{4 \cdot 2}{1{,}6}\,\text{rad/s} :: ricavo la nuova velocità angolare
~ \omega_2 = \evidb{5\,\text{rad/s}} :: $I$ è sceso di 2,5 volte, $\omega$ è salito di 2,5 volte

L'energia invece non si conserva. Prima era $\tfrac{1}{2} \cdot 4 \cdot 2^2 = 8\,\text{J}$, dopo $\tfrac{1}{2} \cdot 1{,}6 \cdot 5^2 = 20\,\text{J}$. I 12 J in più li mettono le braccia, che tirano i manubri verso l'asse.

[[grafico:iperbole]]

La stessa legge spiega i tuffatori, che si raggruppano per fare le capriole. E spiega le **pulsar**: stelle che, collassando, si stringono fino a una decina di chilometri di raggio. Il loro $I$ crolla. Così fanno da un giro ogni pochi secondi fino a centinaia di giri al secondo.

Si conserva anche la direzione di $\vec{L}$. Un frisbee lanciato girando non si ribalta in volo. I giroscopi tengono il loro asse fermo nello spazio: per questo aiutano a guidare aerei, navi e satelliti.

>! Si conserva il momento angolare, non l'energia cinetica. Quando il corpo stringe le braccia, $\omega$ cresce e anche $\tfrac{1}{2} \cdot I \cdot \omega^2$ cresce: il lavoro lo fanno i muscoli.

?? Una stella che gira collassa: il suo raggio si dimezza, la massa resta la stessa. Supponi che resti una sfera uniforme. Come cambia la sua velocità angolare?
[ ] raddoppia
[ ] resta uguale
[ ] si dimezza
[x] diventa quattro volte tanto
=> $I = \tfrac{2}{5} \cdot m \cdot R^2$: con il raggio dimezzato $I$ diventa un quarto. $L = I \cdot \omega$ si conserva, quindi $\omega$ diventa quattro volte tanto.`
    }
  ],
  grafici: {
    /* un disco visto dall'alto: due punti sullo stesso raggio, stessa ω, velocità proporzionali a r */
    disco: {
      tipo: 'piano', x: [-4.4, 4.4], y: [-4.1, 4.4], altezza: 460, assi: false, griglia: false,
      parametri: [{ nome: 'fi', min: 10, max: 350, passo: 5, valore: 35, etichetta: 'angolo θ (°)' }],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [3, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(fi*pi/180)', 'sin(fi*pi/180)'], raggio: 0.7, etichetta: 'θ', colore: 'grigio', verso: 'antiorario' },
        { tipo: 'vettore', da: ['1.5*cos(fi*pi/180)', '1.5*sin(fi*pi/180)'], a: ['1.5*cos(fi*pi/180) - 1.1*sin(fi*pi/180)', '1.5*sin(fi*pi/180) + 1.1*cos(fi*pi/180)'], etichetta: 'v_A', colore: 1 },
        { tipo: 'vettore', da: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], a: ['3*cos(fi*pi/180) - 2.2*sin(fi*pi/180)', '3*sin(fi*pi/180) + 2.2*cos(fi*pi/180)'], etichetta: 'v_B', colore: 1 },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'punto', p: ['1.5*cos(fi*pi/180)', '1.5*sin(fi*pi/180)'], etichetta: 'A', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'punto', p: ['3*cos(fi*pi/180)', '3*sin(fi*pi/180)'], etichetta: 'B', posizione: 'basso-destra', colore: 'grigio', trascina: true, giro: { parametro: 'fi', centro: [0, 0], gradi: true } },
        { tipo: 'testo', p: [4.3, -3.8], testo: 'θ ≈ {{fi*pi/180}} rad', ancora: 'end' },
        { tipo: 'testo', p: [-4.3, -3.8], testo: 'v_B = 2·v_A', ancora: 'start', colore: 1 }
      ],
      didascalia: 'Un disco che gira in senso antiorario, visto dall\'alto (il punto B si trascina lungo il bordo, o si usa il cursore). A e B girano sempre dello stesso angolo θ: hanno la stessa ω. B è lontano dall\'asse il doppio di A, e va al doppio della velocità: v = ω·r.'
    },
    /* ω–t con α costante: la pendenza è α, l'area è l'angolo descritto */
    omega: {
      tipo: 'orario', grandezza: 'ω', unita: 'rad/s', t: [0, 6], y: [0, 20],
      parametri: [{ nome: 't1', min: 0, max: 6, passo: 0.5, valore: 4, etichetta: 'istante (s)' }],
      funzioni: [{ f: '3*t', colore: 1, etichetta: 'ω = 3·t' }],
      elementi: [
        { tipo: 'area', f: '3*t', da: 0, a: 't1', colore: 3 },
        { tipo: 'punto', p: ['t1', '3*t1'], colore: 1 },
        { tipo: 'testo', p: [5.9, 4.6], testo: 'angolo = area = {{1.5*t1*t1}} rad', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [5.9, 2.8], testo: 'cioè circa {{round(10*1.5*t1*t1/(2*pi))/10}} giri', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una ruota parte da ferma con α = 3 rad/s². L\'area del triangolo, base per altezza diviso due, è l\'angolo descritto fino a quell\'istante; diviso 2π dà i giri.'
    },
    /* due masse uguali su un'asticella leggera: I = 2·m·r² cresce con il quadrato della distanza */
    manubrio: {
      tipo: 'piano', x: [-0.8, 0.8], y: [-0.36, 0.3], altezza: 340, assi: false, griglia: false,
      parametri: [{ nome: 'r', min: 0.1, max: 0.6, passo: 0.05, valore: 0.3, etichetta: 'distanza r (m)' }],
      elementi: [
        { tipo: 'segmento', da: [-0.7, 0], a: [0.7, 0], colore: 'grigio' },
        { tipo: 'punto', p: ['-r', 0], raggio: 10, colore: 'grigio' },
        { tipo: 'punto', p: ['r', 0], raggio: 10, colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0.1], a: ['r', 0.1], colore: 'grigio', tratteggio: true, etichetta: 'r' },
        { tipo: 'punto', p: [0, 0], etichetta: 'asse', posizione: 'basso', colore: 'grigio' },
        { tipo: 'testo', p: [0.78, -0.3], testo: 'I = 2·m·r² ≈ {{2*r*r}} kg·m²', ancora: 'end', colore: 4 }
      ],
      didascalia: 'Due masse da 1 kg su un\'asticella leggera, che gira attorno al centro (l\'asse esce dal foglio). Il cursore sposta le masse: a distanza doppia il momento d\'inerzia diventa quattro volte tanto.'
    },
    /* il momento d'inerzia delle figure semplici, a parità di massa e raggio */
    forme: {
      tipo: 'barre', altezza: 300,
      categorie: ['anello', 'guscio', 'cilindro', 'sfera'],
      serie: [{ nome: 'I', valori: [1, 0.667, 0.5, 0.4], colore: 4 }], etichettaY: 'I (in m·R²)',
      max: 1.2,
      didascalia: 'Il momento d\'inerzia in unità di m·R²: anello, sfera cava sottile (guscio), cilindro pieno, sfera piena. Stessa massa, stesso raggio. Il momento d\'inerzia è più grande dove la massa sta lontana dall\'asse: tutta sul bordo nell\'anello, molta vicino al centro nella sfera piena.'
    },
    /* la ruota che rotola: il punto di contatto è fermo, il centro va a v, la cima a 2v */
    ruota: {
      tipo: 'piano', x: [-3.4, 4.6], y: [-0.7, 4.7], altezza: 420, assi: false, griglia: false,
      elementi: [
        { tipo: 'segmento', da: [-3.4, 0], a: [4.6, 0], colore: 'grigio' },
        { tipo: 'cerchio', centro: [0, 2], raggio: 2, colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [0, 4], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: [2, 2], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [0, 2], a: [1.2, 2], etichetta: 'v', colore: 1 },
        { tipo: 'vettore', da: [0, 4], a: [2.4, 4], etichetta: '2·v', colore: 1 },
        { tipo: 'vettore', da: [2, 2], a: [3.2, 0.8], etichetta: '1,4·v', colore: 1 },
        { tipo: 'punto', p: [0, 2], colore: 'grigio' },
        { tipo: 'punto', p: [0, 4], colore: 'grigio' },
        { tipo: 'punto', p: [2, 2], colore: 'grigio' },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'testo', p: [-0.25, 0.3], testo: 'fermo', ancora: 'end' }
      ],
      didascalia: 'Una ruota che rotola verso destra senza strisciare. In ogni istante gira attorno al punto che tocca terra, che è fermo: la velocità di un punto è proporzionale alla sua distanza da lì. Il centro va a v, la cima a 2·v, il punto davanti a circa 1,4·v (√2·v), perpendicolare al tratteggio.'
    },
    /* quanta energia va nel correre, per chi rotola giù senza strisciare */
    ripartizione: {
      tipo: 'barre', altezza: 300,
      categorie: ['scivola', 'sfera', 'cilindro', 'guscio', 'anello'],
      serie: [{ nome: 'traslazione', valori: [100, 71.4, 66.7, 60, 50], colore: 3 }], etichettaY: 'energia nel correre (%)',
      max: 110,
      didascalia: 'La percentuale dell\'energia che va nel correre, per chi scende da un piano inclinato: sfera piena, cilindro pieno, sfera cava sottile (guscio), anello. Chi scivola senza attrito mette tutta l\'energia nella traslazione; chi rotola ne mette una parte nel girare, tanto più quanto più grande è k. Il resto, fino a 100, è energia di rotazione. Più energia nel correre vuol dire arrivare prima.'
    },
    /* L = I·ω costante: se I scende, ω sale */
    iperbole: {
      tipo: 'piano', x: [0, 6.6], y: [0, 32], altezza: 400, proporzioni: 'libere', passo: [1, 4], etichette: { x: 'I (kg·m²)', y: 'ω (rad/s)' },
      parametri: [{ nome: 'L', min: 8, max: 26, passo: 1, valore: 18, etichetta: 'L (kg·m²/s)' }],
      funzioni: [{ f: 'L/x', colore: 1, dominio: [1, 6] }],
      elementi: [
        { tipo: 'segmento', da: [4, 0], a: [4, 'L/4'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [1, 0], a: [1, 'L/1'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [4, 'L/4'], colore: 1 },
        { tipo: 'testo', p: [4, 'L/4 + 3'], testo: 'braccia aperte' },
        { tipo: 'punto', p: [1, 'L/1'], etichetta: 'braccia chiuse', posizione: 'destra', colore: 1 },
        { tipo: 'testo', p: [6.5, 29], testo: 'I·ω = {{L}} kg·m²/s', ancora: 'end' }
      ],
      didascalia: 'Con il momento angolare L fissato, ω = L / I: un ramo di iperbole. Da I = 4 a I = 1 kg·m² il momento d\'inerzia diventa un quarto e la velocità angolare quattro volte tanto. Il cursore cambia L.'
    }
  },
  esempi: [
    {
      titolo: 'La mola che si ferma',
      problema: R`La mola di un arrotino gira a 1200 giri al minuto. Spento il motore, si ferma in 20 s, con accelerazione angolare costante. Quanto vale l'accelerazione angolare? Quanti giri fa prima di fermarsi?`,
      passi: [
        R`Dati: $\omega_0 = 1200$ giri al minuto, $\omega = 0$, $\Delta t = 20\,\text{s}$. Cerco $\alpha$ e il numero di giri.`,
        R`Prima le unità: $\omega_0 = \dfrac{1200 \cdot 2\pi}{60}\,\text{rad/s} = 40\pi\,\text{rad/s} \approx 125{,}7\,\text{rad/s}$.`,
        R`Accelerazione angolare: $\alpha = \dfrac{\Delta\omega}{\Delta t} = \dfrac{0 - 125{,}7\,\text{rad/s}}{20\,\text{s}} \approx -6{,}28\,\text{rad/s}^2$. Il segno meno dice che la mola rallenta.`,
        R`L'angolo descritto: con $\alpha$ costante la velocità angolare media è la media fra iniziale e finale. $\Delta\theta = \dfrac{\omega_0 + \omega}{2} \cdot \Delta t = \dfrac{125{,}7}{2} \cdot 20\,\text{rad} \approx 1257\,\text{rad}$.`,
        R`In giri: $\dfrac{1257}{2\pi} \approx 200$ giri.`,
        R`Controllo con i giri al minuto: in media 600 giri al minuto, per un terzo di minuto, fanno $600 \cdot \tfrac{1}{3} = 200$ giri. Torna.`
      ],
      risultato: R`$\alpha \approx -6{,}28\,\text{rad/s}^2$; prima di fermarsi la mola fa 200 giri.`
    },
    {
      titolo: 'La giostrina del parco',
      problema: R`Una giostrina è un disco pieno di 120 kg, con raggio 1,5 m. Un ragazzo la spinge sul bordo, lungo la tangente, con una forza di 90 N per 3 s. Trascura l'attrito. Che velocità angolare raggiunge la giostrina? Quanto va veloce il bordo?`,
      passi: [
        R`Dati: $m = 120\,\text{kg}$, $R = 1{,}5\,\text{m}$, $F = 90\,\text{N}$ tangente, $\Delta t = 3\,\text{s}$, $\omega_0 = 0$. Cerco $\omega$ e la velocità $v$ del bordo.`,
        R`Momento d'inerzia del disco: $I = \tfrac{1}{2} \cdot m \cdot R^2 = \tfrac{1}{2} \cdot 120 \cdot 1{,}5^2\,\text{kg} \cdot \text{m}^2 = 135\,\text{kg} \cdot \text{m}^2$.`,
        R`Momento della spinta: la forza è tangente, quindi il braccio è il raggio. $M = 90\,\text{N} \cdot 1{,}5\,\text{m} = 135\,\text{N} \cdot \text{m}$.`,
        R`Secondo principio per le rotazioni: $\alpha = \dfrac{M}{I} = \dfrac{135}{135}\,\text{rad/s}^2 = 1\,\text{rad/s}^2$.`,
        R`Dopo 3 s: $\omega = \alpha \cdot t = 3\,\text{rad/s}$. Il bordo va a $v = \omega \cdot R = 3 \cdot 1{,}5\,\text{m/s} = 4{,}5\,\text{m/s}$.`,
        R`Controllo con l'energia. La giostrina gira di $\Delta\theta = \tfrac{1}{2} \cdot 1 \cdot 3^2 = 4{,}5\,\text{rad}$, e il momento compie il lavoro $135 \cdot 4{,}5 = 607{,}5\,\text{J}$. L'energia di rotazione finale è $\tfrac{1}{2} \cdot 135 \cdot 3^2 = 607{,}5\,\text{J}$. Torna.`
      ],
      risultato: R`$\omega = 3\,\text{rad/s}$; il bordo va a $4{,}5\,\text{m/s}$.`
    },
    {
      titolo: 'L\'asta con due pesi',
      problema: R`Un'asta di 2 kg, lunga 1,2 m, porta alle estremità due pesi piccoli da 0,5 kg. Gira attorno a un asse perpendicolare che passa per il suo centro. Quanto vale il momento d'inerzia? Che momento costante la porta da ferma a 3 rad/s in 2 s?`,
      passi: [
        R`Dati: asta $m_a = 2\,\text{kg}$, $\ell = 1{,}2\,\text{m}$; due pesi da $m = 0{,}5\,\text{kg}$ a $r = 0{,}6\,\text{m}$; $\omega = 3\,\text{rad/s}$ in $\Delta t = 2\,\text{s}$. Cerco $I$ e il momento $M$.`,
        R`I momenti d'inerzia si sommano, pezzo per pezzo. Asta per il centro: $\tfrac{1}{12} \cdot 2 \cdot 1{,}2^2\,\text{kg} \cdot \text{m}^2 = 0{,}24\,\text{kg} \cdot \text{m}^2$.`,
        R`I due pesi, a 0,6 m dall'asse: $2 \cdot 0{,}5 \cdot 0{,}6^2\,\text{kg} \cdot \text{m}^2 = 0{,}36\,\text{kg} \cdot \text{m}^2$.`,
        R`Totale: $I = 0{,}24 + 0{,}36 = 0{,}6\,\text{kg} \cdot \text{m}^2$. I pesi hanno metà della massa dell'asta, ma contano di più: stanno tutti lontano dall'asse.`,
        R`Accelerazione angolare: $\alpha = \dfrac{3\,\text{rad/s}}{2\,\text{s}} = 1{,}5\,\text{rad/s}^2$. Momento: $M = I \cdot \alpha = 0{,}6 \cdot 1{,}5\,\text{N} \cdot \text{m} = 0{,}9\,\text{N} \cdot \text{m}$.`,
        R`Controllo con le unità: $\text{kg} \cdot \text{m}^2 \cdot \text{rad/s}^2$ dà $\text{kg} \cdot \text{m/s}^2 \cdot \text{m}$, cioè newton per metro. Torna.`
      ],
      risultato: R`$I = 0{,}6\,\text{kg} \cdot \text{m}^2$; serve un momento $M = 0{,}9\,\text{N} \cdot \text{m}$.`
    },
    {
      titolo: 'L\'energia di un volano',
      problema: R`Un volano è un disco pieno di acciaio da 50 kg, con raggio 0,4 m. Gira a 300 rad/s. Quanta energia ha accumulato, in joule e in chilowattora?`,
      passi: [
        R`Dati: $m = 50\,\text{kg}$, $R = 0{,}4\,\text{m}$, $\omega = 300\,\text{rad/s}$. Cerco l'energia cinetica $E_c$.`,
        R`Momento d'inerzia del disco: $I = \tfrac{1}{2} \cdot 50 \cdot 0{,}4^2\,\text{kg} \cdot \text{m}^2 = 4\,\text{kg} \cdot \text{m}^2$.`,
        R`Energia di rotazione: $E_c = \tfrac{1}{2} \cdot I \cdot \omega^2 = \tfrac{1}{2} \cdot 4 \cdot 300^2\,\text{J} = 180\,000\,\text{J} = 180\,\text{kJ}$.`,
        R`Un chilowattora vale $3{,}6 \cdot 10^6\,\text{J}$: $E_c = \dfrac{180\,000}{3{,}6 \cdot 10^6}\,\text{kWh} = 0{,}05\,\text{kWh}$. Basta per tenere accesa una lampadina da 10 W per 5 ore.`,
        R`Controllo: il bordo va a $v = 300 \cdot 0{,}4 = 120\,\text{m/s}$. Con tutta la massa sul bordo l'energia sarebbe $\tfrac{1}{2} \cdot 50 \cdot 120^2\,\text{J} = 360\,\text{kJ}$. Il disco pieno ne ha la metà, come dice $I = \tfrac{1}{2} \cdot m \cdot R^2$. Torna.`
      ],
      risultato: R`$E_c = 180\,\text{kJ} = 0{,}05\,\text{kWh}$.`
    },
    {
      titolo: 'La palla da bowling sulla rampa',
      problema: R`Una palla da bowling è una sfera piena. Parte da ferma e rotola senza strisciare giù da una rampa alta 0,7 m. Con che velocità arriva in fondo? E se scivolasse senza attrito, senza girare?`,
      passi: [
        R`Dati: sfera piena, $I = \tfrac{2}{5} \cdot m \cdot R^2$, quindi $k = \tfrac{2}{5}$; $h = 0{,}7\,\text{m}$; parte da ferma. Cerco la velocità $v$ in fondo.`,
        R`Conservazione dell'energia: $m \cdot g \cdot h = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$, con $\omega = v / R$. L'attrito che la fa rotolare non compie lavoro.`,
        R`Massa e raggio si semplificano: $v = \sqrt{\dfrac{2 \cdot g \cdot h}{1 + k}}$.`,
        R`Con i numeri: $v = \sqrt{\dfrac{2 \cdot 9{,}8 \cdot 0{,}7}{1{,}4}}\,\text{m/s} = \sqrt{9{,}8}\,\text{m/s}$, cioè circa $3{,}13\,\text{m/s}$.`,
        R`Scivolando senza girare tutta l'energia andrebbe nel correre: $v = \sqrt{2 \cdot g \cdot h} = \sqrt{13{,}72}\,\text{m/s} \approx 3{,}70\,\text{m/s}$.`,
        R`Controllo: il rapporto fra i quadrati delle due velocità è $\dfrac{9{,}8}{13{,}72} \approx 0{,}714$, cioè $\tfrac{5}{7}$. Rotolando, i 5/7 dell'energia vanno nel correre e i 2/7 nel girare. Torna con $\dfrac{1}{1 + k} = \dfrac{5}{7}$.`
      ],
      risultato: R`Rotolando arriva a circa $3{,}13\,\text{m/s}$; scivolando arriverebbe a $3{,}70\,\text{m/s}$.`
    },
    {
      titolo: 'Il tuffatore che si raggruppa',
      problema: R`Un tuffatore lascia il trampolino in posizione tesa, con $I = 14\,\text{kg} \cdot \text{m}^2$ e $\omega = 1{,}5\,\text{rad/s}$. In volo si raggruppa, e il suo momento d'inerzia scende a 3,5 kg·m². Quanto vale la nuova velocità angolare? Che cosa succede alla sua energia cinetica di rotazione?`,
      passi: [
        R`Dati: $I_1 = 14\,\text{kg} \cdot \text{m}^2$, $\omega_1 = 1{,}5\,\text{rad/s}$, $I_2 = 3{,}5\,\text{kg} \cdot \text{m}^2$. Cerco $\omega_2$ e le due energie.`,
        R`In aria agisce solo il peso, applicato nel baricentro. Rispetto al baricentro il suo momento è zero: il momento angolare si conserva.`,
        R`$L = I_1 \cdot \omega_1 = 14 \cdot 1{,}5\,\text{kg} \cdot \text{m}^2\text{/s} = 21\,\text{kg} \cdot \text{m}^2\text{/s}$, quindi $\omega_2 = \dfrac{L}{I_2} = \dfrac{21}{3{,}5}\,\text{rad/s} = 6\,\text{rad/s}$.`,
        R`Energia prima: $\tfrac{1}{2} \cdot 14 \cdot 1{,}5^2\,\text{J} = 15{,}75\,\text{J}$. Energia dopo: $\tfrac{1}{2} \cdot 3{,}5 \cdot 6^2\,\text{J} = 63\,\text{J}$.`,
        R`L'energia è quadruplicata: ce l'ha messa lui, tirando gambe e braccia verso il corpo. Controllo: $\tfrac{1}{2} \cdot I \cdot \omega^2 = \tfrac{1}{2} \cdot L \cdot \omega$, e con $L$ fisso cresce come $\omega$, cioè quattro volte. Torna.`
      ],
      risultato: R`$\omega_2 = 6\,\text{rad/s}$, quasi un giro al secondo; l'energia di rotazione passa da 15,75 J a 63 J.`
    }
  ],
  formulario: [
    { nome: 'Angolo in radianti', formula: R`\theta = \dfrac{s}{r}`, nota: R`Arco diviso raggio. Un giro vale $2\pi\,\text{rad}$, cioè 360°; un radiante è circa 57,3°.` },
    { nome: 'Velocità e accelerazione angolare', formula: R`\omega = \dfrac{\Delta\theta}{\Delta t} \qquad \alpha = \dfrac{\Delta\omega}{\Delta t}`, nota: R`In rad/s e rad/s². Con $f$ giri al secondo, $\omega = 2\pi \cdot f$.` },
    { nome: 'Un punto a distanza r dall\'asse', formula: R`v = \omega \cdot r \qquad a_t = \alpha \cdot r`, nota: R`Stessa $\omega$ per tutti i punti, velocità diverse. In più c'è la centripeta $a_c = \omega^2 \cdot r$.` },
    { nome: 'Velocità angolare con α costante', formula: R`\omega = \omega_0 + \alpha \cdot t`, nota: R`Come $v = v_0 + a \cdot t$. Nel grafico $\omega$–$t$ la pendenza è $\alpha$, l'area è l'angolo.` },
    { nome: 'Legge oraria del moto rotatorio', formula: R`\theta = \theta_0 + \omega_0 \cdot t + \tfrac{1}{2} \cdot \alpha \cdot t^2`, nota: R`Con accelerazione angolare costante. L'angolo in radianti; i giri sono $\Delta\theta / 2\pi$.` },
    { nome: 'Formula senza il tempo', formula: R`\omega^2 = \omega_0^2 + 2 \cdot \alpha \cdot \Delta\theta`, nota: R`Utile quando si conosce l'angolo (o i giri) ma non il tempo.` },
    { nome: 'Momento d\'inerzia', formula: R`I = \Sigma\, m \cdot r^2`, nota: R`In $\text{kg} \cdot \text{m}^2$. Dipende dall'asse. Assi paralleli: $I = I_G + m \cdot r_G^2$.` },
    { nome: 'Anello e cilindro pieno', formula: R`I = m \cdot R^2 \qquad I = \tfrac{1}{2} \cdot m \cdot R^2`, nota: R`Attorno al loro asse. Il tubo sottile ha lo stesso $I$ dell'anello.` },
    { nome: 'Sfera piena e asta per un estremo', formula: R`I = \tfrac{2}{5} \cdot m \cdot R^2 \qquad I = \tfrac{1}{3} \cdot m \cdot \ell^2`, nota: R`Sfera cava: $\tfrac{2}{3} \cdot m \cdot R^2$. Asta lunga $\ell$, per il centro: $\tfrac{1}{12} \cdot m \cdot \ell^2$.` },
    { nome: 'Secondo principio per le rotazioni', formula: R`M = I \cdot \alpha`, nota: R`$M$ è il momento totale delle forze esterne, in $\text{N} \cdot \text{m}$. Come $F = m \cdot a$.` },
    { nome: 'Energia di rotazione e lavoro', formula: R`E_c = \tfrac{1}{2} \cdot I \cdot \omega^2 \qquad L = M \cdot \Delta\theta`, nota: R`Qui $L$ è il lavoro, come nell'energia; $\Delta\theta$ in radianti. La potenza è $P = M \cdot \omega$.` },
    { nome: 'Rotolamento senza strisciare', formula: R`v = \omega \cdot R`, nota: R`Energia cinetica: $\tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$. Da fermo giù da $h$: $v = \sqrt{2 \cdot g \cdot h / (1 + k)}$, con $I = k \cdot m \cdot R^2$.` },
    { nome: 'Momento angolare', formula: R`L = I \cdot \omega \qquad L = m \cdot v \cdot r`, nota: R`In $\text{kg} \cdot \text{m}^2\text{/s}$. La seconda per un corpo piccolo. Il momento lo fa cambiare: $M = \Delta L / \Delta t$.` },
    { nome: 'Conservazione del momento angolare', formula: R`I_1 \cdot \omega_1 = I_2 \cdot \omega_2`, nota: R`Se il momento delle forze esterne è zero. L'energia cinetica invece può cambiare.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'angoli', tipo: 'definizione', fronte: R`Che cos'è un angolo di un **radiante**?`, retro: R`L'angolo che sottende un arco lungo quanto il raggio: $\theta = s / r$. Un giro vale $2\pi\,\text{rad}$.` },
    { id: 'fc-02', sezione: 'angoli', tipo: 'definizione', fronte: R`Che cos'è la **velocità angolare**?`, retro: R`L'angolo descritto diviso il tempo: $\omega = \dfrac{\Delta\theta}{\Delta t}$, in rad/s.` },
    { id: 'fc-03', sezione: 'angoli', tipo: 'procedura', fronte: R`Come si passa dai giri al minuto ai rad/s?`, retro: R`Si moltiplica per $2\pi$ (radianti in un giro) e si divide per 60 (secondi in un minuto).` },
    { id: 'fc-04', sezione: 'angoli', tipo: 'concetto', fronte: R`In un disco che gira, i punti del bordo e quelli vicini al centro hanno la stessa velocità?`, retro: R`Hanno la stessa velocità angolare $\omega$, ma non la stessa velocità: $v = \omega \cdot r$ cresce con la distanza dall'asse.` },
    { id: 'fc-05', sezione: 'accelerazione-angolare', tipo: 'definizione', fronte: R`Che cos'è l'**accelerazione angolare**?`, retro: R`La variazione di velocità angolare divisa il tempo: $\alpha = \dfrac{\Delta\omega}{\Delta t}$, in rad/s².` },
    { id: 'fc-06', sezione: 'accelerazione-angolare', tipo: 'formula', fronte: R`Le leggi del moto rotatorio uniformemente accelerato`, retro: R`$\omega = \omega_0 + \alpha \cdot t$ e $\theta = \theta_0 + \omega_0 \cdot t + \tfrac{1}{2} \cdot \alpha \cdot t^2$: le stesse del moto rettilineo, con altre lettere.` },
    { id: 'fc-07', sezione: 'accelerazione-angolare', tipo: 'concetto', fronte: R`Che differenza c'è fra **accelerazione tangenziale** e centripeta di un punto che gira?`, retro: R`La tangenziale $a_t = \alpha \cdot r$ cambia il modulo della velocità. La centripeta $a_c = \omega^2 \cdot r$ cambia la direzione, e c'è anche con $\omega$ costante.` },
    { id: 'fc-08', sezione: 'seconda-legge', tipo: 'formula', fronte: R`Il **secondo principio della dinamica per le rotazioni**`, retro: R`$M = I \cdot \alpha$: il momento totale delle forze esterne è il momento d'inerzia per l'accelerazione angolare.` },
    { id: 'fc-09', sezione: 'seconda-legge', tipo: 'concetto', fronte: R`Se la somma dei momenti su un corpo rigido è zero, il corpo è per forza fermo?`, retro: R`No: la sua velocità angolare non cambia. Può essere fermo, oppure girare con $\omega$ costante.` },
    { id: 'fc-10', sezione: 'momento-inerzia', tipo: 'definizione', fronte: R`Che cos'è il **momento d'inerzia**?`, retro: R`$I = \Sigma\, m \cdot r^2$: la somma delle masse dei pezzetti per il quadrato della loro distanza dall'asse. In $\text{kg} \cdot \text{m}^2$.` },
    { id: 'fc-11', sezione: 'momento-inerzia', tipo: 'formula', fronte: R`Momento d'inerzia di anello, cilindro pieno e sfera piena`, retro: R`Anello $m \cdot R^2$, cilindro pieno $\tfrac{1}{2} \cdot m \cdot R^2$, sfera piena $\tfrac{2}{5} \cdot m \cdot R^2$.` },
    { id: 'fc-12', sezione: 'momento-inerzia', tipo: 'concetto', fronte: R`Un corpo ha un solo momento d'inerzia, come ha una sola massa?`, retro: R`No: dipende dall'asse. Un'asta lunga $\ell$ ha $\tfrac{1}{12} \cdot m \cdot \ell^2$ attorno al centro e $\tfrac{1}{3} \cdot m \cdot \ell^2$ attorno a un estremo.` },
    { id: 'fc-13', sezione: 'energia-rotazione', tipo: 'formula', fronte: R`L'**energia cinetica di rotazione**`, retro: R`$E_c = \tfrac{1}{2} \cdot I \cdot \omega^2$, con $\omega$ in rad/s: viene dalla somma di $\tfrac{1}{2} \cdot m \cdot v^2$ su tutti i pezzetti.` },
    { id: 'fc-14', sezione: 'energia-rotazione', tipo: 'formula', fronte: R`Lavoro e potenza di un momento costante`, retro: R`Il lavoro è $L = M \cdot \Delta\theta$, con l'angolo in radianti; la potenza è $P = M \cdot \omega$. Gemelli di $F \cdot s$ e $F \cdot v$.` },
    { id: 'fc-15', sezione: 'rotolamento', tipo: 'concetto', fronte: R`Una ruota rotola senza strisciare. Quanto va veloce il punto che tocca terra?`, retro: R`In quell'istante è fermo. Il centro va a $v = \omega \cdot R$, il punto più alto a $2 \cdot v$.` },
    { id: 'fc-16', sezione: 'rotolamento', tipo: 'formula', fronte: R`L'energia cinetica di un corpo che **rotola**`, retro: R`$E_c = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$: traslazione del centro più rotazione attorno al centro.` },
    { id: 'fc-17', sezione: 'rotolamento', tipo: 'concetto', fronte: R`Corpi diversi rotolano giù dallo stesso piano. Chi arriva prima?`, retro: R`Chi ha la massa più vicina all'asse, cioè $k$ più piccolo in $I = k \cdot m \cdot R^2$: sfera piena, poi cilindro pieno, poi anello. Massa e raggio non contano.` },
    { id: 'fc-18', sezione: 'momento-angolare', tipo: 'definizione', fronte: R`Che cos'è il **momento angolare**?`, retro: R`$L = I \cdot \omega$ per un corpo rigido, $L = m \cdot v \cdot r$ per un corpo piccolo su una circonferenza. In $\text{kg} \cdot \text{m}^2\text{/s}$.` },
    { id: 'fc-19', sezione: 'momento-angolare', tipo: 'formula', fronte: R`Che legame c'è fra momento di una forza e momento angolare?`, retro: R`$M = \dfrac{\Delta L}{\Delta t}$: il momento delle forze esterne è la variazione del momento angolare al secondo.` },
    { id: 'fc-20', sezione: 'conservazione', tipo: 'definizione', fronte: R`Quando si conserva il momento angolare?`, retro: R`Quando il momento totale delle forze esterne è zero. Allora $I_1 \cdot \omega_1 = I_2 \cdot \omega_2$.` },
    { id: 'fc-21', sezione: 'conservazione', tipo: 'concetto', fronte: R`Una pattinatrice chiude le braccia e gira più in fretta. La sua energia cinetica resta uguale?`, retro: R`No, aumenta: $L$ resta uguale, ma $\tfrac{1}{2} \cdot I \cdot \omega^2 = \tfrac{1}{2} \cdot L \cdot \omega$ cresce. Il lavoro lo fanno i muscoli delle braccia.` },
    { id: 'fc-22', sezione: 'conservazione', tipo: 'concetto', fronte: R`Perché un giroscopio tiene il suo asse fermo nello spazio?`, retro: R`Il momento angolare è un vettore: senza momenti esterni non cambia, né in modulo né in direzione.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Quanti radianti sono 3 giri completi?`, suggerimenti: [R`Un giro vale $2\pi\,\text{rad}$.`], risposta: { tipo: 'numero', valore: 18.85, unita: 'rad' }, soluzione: [R`$\theta = 3 \cdot 2\pi\,\text{rad} = 6\pi\,\text{rad} \approx 18{,}8\,\text{rad}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una ruota gira a velocità angolare costante e descrive 45 rad in 5 s. Quanto vale la sua velocità angolare?`, suggerimenti: [R`Angolo diviso tempo.`], risposta: { tipo: 'numero', valore: 9, unita: 'rad/s' }, soluzione: [R`$\omega = \dfrac{\Delta\theta}{\Delta t} = \dfrac{45\,\text{rad}}{5\,\text{s}} = 9\,\text{rad/s}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un punto sta a 0,4 m dall'asse di una ruota. La ruota gira di 5 rad. Quanto è lungo l'arco percorso dal punto?`, suggerimenti: [R`Da $\theta = s / r$ ricava $s$.`], risposta: { tipo: 'numero', valore: 2, unita: 'm' }, soluzione: [R`$s = \theta \cdot r = 5 \cdot 0{,}4\,\text{m} = 2\,\text{m}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una ruota gira a 8 rad/s. Quanto va veloce un punto a 0,75 m dall'asse?`, suggerimenti: [R`$v = \omega \cdot r$.`], risposta: { tipo: 'numero', valore: 6, unita: 'm/s' }, soluzione: [R`$v = 8\,\text{rad/s} \cdot 0{,}75\,\text{m} = 6\,\text{m/s}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un frullatore fa 10 giri al secondo. Quanto vale la sua velocità angolare in rad/s?`, suggerimenti: [R`$\omega = 2\pi \cdot f$.`], risposta: { tipo: 'numero', valore: 62.8, unita: 'rad/s' }, soluzione: [R`$\omega = 2\pi \cdot 10\,\text{rad/s} = 20\pi\,\text{rad/s} \approx 62{,}8\,\text{rad/s}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Una ruota passa da ferma a 33 rad/s in 3 s. Quanto vale la sua accelerazione angolare media?`, suggerimenti: [R`Variazione di velocità angolare diviso tempo.`], risposta: { tipo: 'numero', valore: 11, unita: 'rad/s²' }, soluzione: [R`$\alpha = \dfrac{33\,\text{rad/s} - 0}{3\,\text{s}} = 11\,\text{rad/s}^2$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Una ruota gira a 12 rad/s e accelera con $\alpha = 2\,\text{rad/s}^2$. Che velocità angolare ha dopo 5 s?`, suggerimenti: [R`$\omega = \omega_0 + \alpha \cdot t$.`], risposta: { tipo: 'numero', valore: 22, unita: 'rad/s' }, soluzione: [R`$\omega = 12\,\text{rad/s} + 2\,\text{rad/s}^2 \cdot 5\,\text{s} = 12 + 10 = 22\,\text{rad/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un disco parte da fermo con $\alpha = 6\,\text{rad/s}^2$. Di quanti radianti gira nei primi 3 s?`, suggerimenti: [R`Da fermo: $\Delta\theta = \tfrac{1}{2} \cdot \alpha \cdot t^2$.`], risposta: { tipo: 'numero', valore: 27, unita: 'rad' }, soluzione: [R`$\Delta\theta = \tfrac{1}{2} \cdot 6\,\text{rad/s}^2 \cdot (3\,\text{s})^2 = 3 \cdot 9\,\text{rad} = 27\,\text{rad}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Una ruota che gira a 56 rad/s si ferma in 8 s, rallentando in modo uniforme. Quanto vale la sua accelerazione angolare?`, suggerimenti: [R`Rallenta: aspettati un segno meno.`, R`$\alpha = \dfrac{\omega - \omega_0}{\Delta t}$.`], risposta: { tipo: 'numero', valore: -7, unita: 'rad/s²' }, soluzione: [R`$\alpha = \dfrac{0 - 56\,\text{rad/s}}{8\,\text{s}} = -7\,\text{rad/s}^2$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una ruota ha accelerazione angolare $8\,\text{rad/s}^2$. Quanto vale l'accelerazione tangenziale di un punto a 0,5 m dall'asse?`, suggerimenti: [R`$a_t = \alpha \cdot r$.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s²' }, soluzione: [R`$a_t = 8\,\text{rad/s}^2 \cdot 0{,}5\,\text{m} = 4\,\text{m/s}^2$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un sasso di 3 kg, legato a una corda leggera, gira a 2 m dall'asse. Quanto vale il suo momento d'inerzia?`, suggerimenti: [R`Per un corpo piccolo $I = m \cdot r^2$.`], risposta: { tipo: 'numero', valore: 12, unita: 'kg·m²' }, soluzione: [R`$I = 3\,\text{kg} \cdot (2\,\text{m})^2 = 12\,\text{kg} \cdot \text{m}^2$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un anello di 4 kg ha raggio 0,5 m. Quanto vale il suo momento d'inerzia attorno al suo asse?`, suggerimenti: [R`Nell'anello tutta la massa sta a distanza $R$: $I = m \cdot R^2$.`], risposta: { tipo: 'numero', valore: 1, unita: 'kg·m²' }, soluzione: [R`$I = 4\,\text{kg} \cdot (0{,}5\,\text{m})^2 = 4 \cdot 0{,}25\,\text{kg} \cdot \text{m}^2 = 1\,\text{kg} \cdot \text{m}^2$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un disco pieno di 10 kg ha raggio 0,3 m. Quanto vale il suo momento d'inerzia attorno al suo asse?`, suggerimenti: [R`Per il disco pieno $I = \tfrac{1}{2} \cdot m \cdot R^2$.`], risposta: { tipo: 'numero', valore: 0.45, unita: 'kg·m²' }, soluzione: [R`$I = \tfrac{1}{2} \cdot 10\,\text{kg} \cdot (0{,}3\,\text{m})^2 = 5 \cdot 0{,}09\,\text{kg} \cdot \text{m}^2 = 0{,}45\,\text{kg} \cdot \text{m}^2$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Una sfera piena di 5 kg ha raggio 0,1 m. Quanto vale il suo momento d'inerzia attorno a un diametro?`, suggerimenti: [R`Per la sfera piena $I = \tfrac{2}{5} \cdot m \cdot R^2$.`], risposta: { tipo: 'numero', valore: 0.02, unita: 'kg·m²' }, soluzione: [R`$I = \tfrac{2}{5} \cdot 5\,\text{kg} \cdot (0{,}1\,\text{m})^2 = 2 \cdot 0{,}01\,\text{kg} \cdot \text{m}^2 = 0{,}02\,\text{kg} \cdot \text{m}^2$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Su una ruota con $I = 2\,\text{kg} \cdot \text{m}^2$ agisce un momento totale di $16\,\text{N} \cdot \text{m}$. Quanto vale la sua accelerazione angolare?`, suggerimenti: [R`$M = I \cdot \alpha$: ricava $\alpha$.`], risposta: { tipo: 'numero', valore: 8, unita: 'rad/s²' }, soluzione: [R`$\alpha = \dfrac{M}{I} = \dfrac{16\,\text{N} \cdot \text{m}}{2\,\text{kg} \cdot \text{m}^2} = 8\,\text{rad/s}^2$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Una forza di 24 N spinge una ruota sul bordo, lungo la tangente, a 0,5 m dall'asse. La ruota ha $I = 1{,}2\,\text{kg} \cdot \text{m}^2$. Quanto vale la sua accelerazione angolare?`, suggerimenti: [R`Calcola prima il momento: la forza è tangente, quindi il braccio è 0,5 m.`, R`Poi $\alpha = M / I$.`], risposta: { tipo: 'numero', valore: 10, unita: 'rad/s²' }, soluzione: [R`$M = 24\,\text{N} \cdot 0{,}5\,\text{m} = 12\,\text{N} \cdot \text{m}$.`, R`$\alpha = \dfrac{12}{1{,}2}\,\text{rad/s}^2 = 10\,\text{rad/s}^2$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una ruota con $I = 3\,\text{kg} \cdot \text{m}^2$ gira a 8 rad/s. Quanta energia cinetica di rotazione ha?`, suggerimenti: [R`$E_c = \tfrac{1}{2} \cdot I \cdot \omega^2$.`], risposta: { tipo: 'numero', valore: 96, unita: 'J' }, soluzione: [R`$E_c = \tfrac{1}{2} \cdot 3 \cdot 8^2\,\text{J} = 1{,}5 \cdot 64\,\text{J} = 96\,\text{J}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Le ruote di un carrello hanno raggio 0,3 m e rotolano senza strisciare. Il carrello va a 9 m/s. Quanto vale la velocità angolare delle ruote?`, suggerimenti: [R`Nel rotolamento $v = \omega \cdot R$.`], risposta: { tipo: 'numero', valore: 30, unita: 'rad/s' }, soluzione: [R`$\omega = \dfrac{v}{R} = \dfrac{9\,\text{m/s}}{0{,}3\,\text{m}} = 30\,\text{rad/s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un disco con $I = 0{,}4\,\text{kg} \cdot \text{m}^2$ gira a 15 rad/s. Quanto vale il suo momento angolare?`, suggerimenti: [R`$L = I \cdot \omega$.`], risposta: { tipo: 'numero', valore: 6, unita: 'kg·m²/s' }, soluzione: [R`$L = 0{,}4\,\text{kg} \cdot \text{m}^2 \cdot 15\,\text{rad/s} = 6\,\text{kg} \cdot \text{m}^2\text{/s}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un corpo che gira libero ha $I = 8\,\text{kg} \cdot \text{m}^2$ e $\omega = 3\,\text{rad/s}$. Cambia forma e il suo momento d'inerzia scende a $2\,\text{kg} \cdot \text{m}^2$. Che velocità angolare ha ora?`, suggerimenti: [R`Nessun momento esterno: il momento angolare si conserva.`, R`$I_1 \cdot \omega_1 = I_2 \cdot \omega_2$.`], risposta: { tipo: 'numero', valore: 12, unita: 'rad/s' }, soluzione: [R`$L = 8 \cdot 3 = 24\,\text{kg} \cdot \text{m}^2\text{/s}$.`, R`$\omega_2 = \dfrac{24}{2}\,\text{rad/s} = 12\,\text{rad/s}$: $I$ è diventato un quarto, $\omega$ quattro volte tanto.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Il motore di un trapano passa da fermo a 3000 giri al minuto in 2 s, con accelerazione angolare costante. Quanti giri fa in quei 2 s?`, suggerimenti: [R`Porta la velocità finale in rad/s, oppure ragiona con la velocità media.`, R`Con $\alpha$ costante, partendo da fermi, la velocità media è metà di quella finale.`], risposta: { tipo: 'numero', valore: 50 }, segnaposto: 'Numero di giri', soluzione: [R`$\omega = \dfrac{3000 \cdot 2\pi}{60}\,\text{rad/s} = 100\pi\,\text{rad/s} \approx 314\,\text{rad/s}$, quindi $\alpha = \dfrac{314}{2} \approx 157\,\text{rad/s}^2$.`, R`$\Delta\theta = \tfrac{1}{2} \cdot \alpha \cdot t^2 = \tfrac{1}{2} \cdot 157 \cdot 4\,\text{rad} \approx 314\,\text{rad}$.`, R`Giri: $\dfrac{314}{2\pi} = 50$. Controllo: in media 1500 giri al minuto, cioè 25 al secondo, per 2 s fanno 50 giri.`] },
    { id: 'es-02', difficolta: 3, testo: R`Un secchio da 2 kg è appeso a una corda avvolta su un verricello: un cilindro pieno di 10 kg e raggio 0,2 m, che gira senza attrito. Si lascia andare il secchio. Con che accelerazione scende?`, suggerimenti: [R`Scrivi il secondo principio per il secchio: $m \cdot g - T = m \cdot a$. Per il cilindro usa quello delle rotazioni: $T \cdot R = I \cdot \alpha$.`, R`La corda non slitta: $a = \alpha \cdot R$. Quindi $T = \dfrac{I}{R^2} \cdot a$.`], risposta: { tipo: 'numero', valore: 2.8, unita: 'm/s²' }, soluzione: [R`$I = \tfrac{1}{2} \cdot 10 \cdot 0{,}2^2\,\text{kg} \cdot \text{m}^2 = 0{,}2\,\text{kg} \cdot \text{m}^2$, quindi $\dfrac{I}{R^2} = \dfrac{0{,}2}{0{,}04}\,\text{kg} = 5\,\text{kg}$.`, R`Cilindro: $T = 5 \cdot a$. Secchio: $2 \cdot 9{,}8 - 5 \cdot a = 2 \cdot a$.`, R`$19{,}6 = 7 \cdot a \Rightarrow a = 2{,}8\,\text{m/s}^2$, meno di $g$: parte dell'energia va nel far girare il verricello. La tensione è $T = 14\,\text{N}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Una mola con $I = 2\,\text{kg} \cdot \text{m}^2$ gira a 40 rad/s. Spento il motore, l'attrito la ferma dopo 10 giri. Quanto vale il momento della forza d'attrito, supposto costante?`, suggerimenti: [R`Usa l'energia: il lavoro del momento d'attrito toglie tutta l'energia di rotazione.`, R`Il lavoro del momento è $L = M \cdot \Delta\theta$, con $\Delta\theta$ in radianti: 10 giri sono $20\pi\,\text{rad}$.`], risposta: { tipo: 'numero', valore: 25.5, unita: 'N·m', tolleranza: 0.3 }, soluzione: [R`Energia iniziale: $\tfrac{1}{2} \cdot 2 \cdot 40^2\,\text{J} = 1600\,\text{J}$.`, R`Angolo: $\Delta\theta = 10 \cdot 2\pi \approx 62{,}8\,\text{rad}$.`, R`$M = \dfrac{1600\,\text{J}}{62{,}8\,\text{rad}} \approx 25{,}5\,\text{N} \cdot \text{m}$. Controllo con la formula senza tempo: $\alpha = \dfrac{40^2}{2 \cdot 62{,}8} \approx 12{,}7\,\text{rad/s}^2$, e $I \cdot \alpha \approx 25{,}5\,\text{N} \cdot \text{m}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un'asta omogenea di 3 kg, lunga 1 m, è incernierata a un'estremità. La si tiene orizzontale e poi la si lascia. Quanto vale la sua accelerazione angolare nel primo istante?`, suggerimenti: [R`Il peso agisce nel baricentro, a metà asta: il braccio è 0,5 m.`, R`Attorno a un estremo $I = \tfrac{1}{3} \cdot m \cdot \ell^2$.`], risposta: { tipo: 'numero', valore: 14.7, unita: 'rad/s²' }, soluzione: [R`Momento del peso rispetto alla cerniera: $M = 3 \cdot 9{,}8 \cdot 0{,}5\,\text{N} \cdot \text{m} = 14{,}7\,\text{N} \cdot \text{m}$.`, R`$I = \tfrac{1}{3} \cdot 3 \cdot 1^2\,\text{kg} \cdot \text{m}^2 = 1\,\text{kg} \cdot \text{m}^2$, quindi $\alpha = 14{,}7\,\text{rad/s}^2$.`, R`Curiosità: l'estremo libero parte con $a_t = \alpha \cdot \ell = 14{,}7\,\text{m/s}^2$, più di $g$. Un sassolino appoggiato lì resterebbe indietro.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un cilindro pieno parte da fermo e rotola senza strisciare giù da un piano inclinato. Scende di 1,5 m in altezza. Con che velocità arriva in fondo?`, suggerimenti: [R`Conservazione dell'energia con le due energie cinetiche.`, R`Per il cilindro pieno $k = \tfrac{1}{2}$: $v = \sqrt{\dfrac{2 \cdot g \cdot h}{1 + k}}$.`], risposta: { tipo: 'numero', valore: 4.43, unita: 'm/s' }, soluzione: [R`$m \cdot g \cdot h = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot \tfrac{1}{2} \cdot m \cdot R^2 \cdot \dfrac{v^2}{R^2} = \tfrac{3}{4} \cdot m \cdot v^2$.`, R`$v = \sqrt{\tfrac{4}{3} \cdot 9{,}8 \cdot 1{,}5}\,\text{m/s} = \sqrt{19{,}6}\,\text{m/s} \approx 4{,}43\,\text{m/s}$.`, R`Scivolando senza attrito arriverebbe a $\sqrt{29{,}4} \approx 5{,}42\,\text{m/s}$.`] },
    { id: 'es-06', difficolta: 2, testo: R`Una ruota di bici da 1,5 kg ha quasi tutta la massa sul cerchione: trattala come un anello. Rotola senza strisciare a 6 m/s. Quanta energia cinetica ha in tutto?`, suggerimenti: [R`Somma traslazione e rotazione.`, R`Per l'anello $I = m \cdot R^2$ e $\omega = v / R$: il raggio si semplifica.`], risposta: { tipo: 'numero', valore: 54, unita: 'J' }, soluzione: [R`Traslazione: $\tfrac{1}{2} \cdot 1{,}5 \cdot 6^2\,\text{J} = 27\,\text{J}$.`, R`Rotazione: $\tfrac{1}{2} \cdot m \cdot R^2 \cdot \dfrac{v^2}{R^2} = \tfrac{1}{2} \cdot m \cdot v^2 = 27\,\text{J}$.`, R`In tutto $54\,\text{J}$, cioè $m \cdot v^2$: per un anello che rotola, metà e metà.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una stella grande come il Sole (raggio $7 \cdot 10^5\,\text{km}$) fa un giro su se stessa ogni 25 giorni. Collassa fino a un raggio di 10 km, senza perdere massa. Supponi che resti una sfera uniforme. Quanto dura un suo giro dopo il collasso?`, suggerimenti: [R`Per una sfera $I = \tfrac{2}{5} \cdot m \cdot R^2$: con la stessa massa, $I$ va come $R^2$.`, R`$I_1 \cdot \omega_1 = I_2 \cdot \omega_2$ e $\omega = 2\pi / T$: quindi $T_2 = T_1 \cdot (R_2 / R_1)^2$.`], risposta: { tipo: 'numero', valore: 4.41e-4, unita: 's', tolleranza: 0.05e-4 }, soluzione: [R`$T_1 = 25 \cdot 86\,400\,\text{s} = 2{,}16 \cdot 10^6\,\text{s}$.`, R`$\dfrac{R_2}{R_1} = \dfrac{10}{7 \cdot 10^5} \approx 1{,}43 \cdot 10^{-5}$, e il suo quadrato è circa $2{,}04 \cdot 10^{-10}$.`, R`$T_2 = 2{,}16 \cdot 10^6 \cdot 2{,}04 \cdot 10^{-10}\,\text{s} \approx 4{,}4 \cdot 10^{-4}\,\text{s}$: oltre duemila giri al secondo. Le pulsar vere girano più piano, perché il collasso perde massa e momento angolare.`] },
    { id: 'es-08', difficolta: 2, testo: R`Una giostra con $I = 240\,\text{kg} \cdot \text{m}^2$ gira libera a 2,5 rad/s. Un ragazzo di 60 kg corre verso il centro e salta sul bordo, a 2 m dall'asse. Che velocità angolare ha poi la giostra?`, suggerimenti: [R`Il ragazzo corre verso il centro: prima del salto il suo momento angolare rispetto all'asse è zero.`, R`Dopo, il ragazzo fa parte del corpo che gira: aggiungi $m \cdot r^2$ al momento d'inerzia.`], risposta: { tipo: 'numero', valore: 1.25, unita: 'rad/s' }, soluzione: [R`$L = 240 \cdot 2{,}5 = 600\,\text{kg} \cdot \text{m}^2\text{/s}$.`, R`Dopo: $I_2 = 240 + 60 \cdot 2^2 = 480\,\text{kg} \cdot \text{m}^2$.`, R`$\omega_2 = \dfrac{600}{480}\,\text{rad/s} = 1{,}25\,\text{rad/s}$: la giostra rallenta.`] },
    { id: 'es-09', difficolta: 2, testo: R`Il motore di un'auto dà un momento di $200\,\text{N} \cdot \text{m}$ quando gira a 4000 giri al minuto. Quanto vale la sua potenza, in kW?`, suggerimenti: [R`$P = M \cdot \omega$, con $\omega$ in rad/s.`], risposta: { tipo: 'numero', valore: 83.8, unita: 'kW' }, soluzione: [R`$\omega = \dfrac{4000 \cdot 2\pi}{60}\,\text{rad/s} \approx 419\,\text{rad/s}$.`, R`$P = 200 \cdot 419\,\text{W} \approx 83\,800\,\text{W} \approx 83{,}8\,\text{kW}$, circa 114 cavalli.`] },
    { id: 'es-10', difficolta: 3, testo: R`Una pallina da 0,25 kg scivola senza attrito su un tavolo. È legata a un filo che passa per un foro al centro. Gira su un cerchio di raggio 0,8 m a 5 m/s. Da sotto il tavolo si tira il filo, finché il raggio diventa 0,4 m. Che velocità ha ora la pallina?`, suggerimenti: [R`La forza del filo punta sempre verso il foro: rispetto al foro il suo momento è zero.`, R`Si conserva $L = m \cdot v \cdot r$.`], risposta: { tipo: 'numero', valore: 10, unita: 'm/s' }, soluzione: [R`$L = 0{,}25 \cdot 5 \cdot 0{,}8 = 1\,\text{kg} \cdot \text{m}^2\text{/s}$.`, R`$v_2 = \dfrac{L}{m \cdot r_2} = \dfrac{1}{0{,}25 \cdot 0{,}4}\,\text{m/s} = 10\,\text{m/s}$.`, R`Raggio dimezzato, velocità doppia. L'energia cinetica diventa quattro volte tanto: il lavoro lo fa la mano che tira il filo.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`In che unità si misura la velocità angolare?`, opzioni: [R`m/s`, R`rad/s`, R`rad/s²`, R`kg·m²/s`], corretta: 1, spiegazione: R`È un angolo diviso un tempo: radianti al secondo. I m/s sono della velocità di un punto, i rad/s² dell'accelerazione angolare, i kg·m²/s del momento angolare.` },
    { id: 'q-02', domanda: R`Su un disco che gira, il punto A sta sul bordo e il punto B a metà raggio. Quale ha la velocità angolare maggiore?`, opzioni: [R`A, perché è più lontano dall'asse`, R`B, perché fa un cerchio più piccolo`, R`Dipende dall'accelerazione angolare`, R`Hanno la stessa velocità angolare`], corretta: 3, spiegazione: R`Il disco è rigido: tutti i punti girano dello stesso angolo nello stesso tempo. È la velocità $v = \omega \cdot r$ a essere doppia per A.` },
    { id: 'q-03', domanda: R`Da che cosa dipende il momento d'inerzia di un corpo?`, opzioni: [R`Dalla massa, da come è distribuita e dall'asse`, R`Solo dalla massa`, R`Solo dalla forma`, R`Dalla velocità con cui gira`], corretta: 0, spiegazione: R`$I = \Sigma\, m \cdot r^2$: contano le masse e le loro distanze dall'asse, quindi anche la scelta dell'asse. Non dipende da quanto in fretta il corpo gira.` },
    { id: 'q-04', domanda: R`Una ruota gira a velocità angolare costante, senza attriti. Quanto vale il momento totale delle forze su di lei?`, opzioni: [R`Dipende da quanto gira veloce`, R`È uguale a $I \cdot \omega$`, R`È zero`, R`È uguale al peso per il raggio`], corretta: 2, spiegazione: R`Con $\omega$ costante $\alpha = 0$, e $M = I \cdot \alpha = 0$. Per continuare a girare non serve un momento, come per andare dritti non serve una forza. $I \cdot \omega$ è il momento angolare.` },
    { id: 'q-05', domanda: R`Un cilindro pieno rotola giù da un piano inclinato. Un blocco di ghiaccio con la stessa massa scivola senza attrito sullo stesso piano. Chi arriva prima?`, opzioni: [R`Il cilindro, perché rotolare è più facile che strisciare`, R`Arrivano insieme`, R`Dipende da quanto pesano`, R`Il blocco di ghiaccio`], corretta: 3, spiegazione: R`Il blocco mette tutta l'energia potenziale nel correre. Il cilindro ne usa un terzo per girare, e corre più piano. La massa si semplifica.` },
    { id: 'q-06', domanda: R`Una pattinatrice che gira su se stessa chiude le braccia. Che cosa succede alla sua energia cinetica di rotazione?`, opzioni: [R`Resta uguale, come il momento angolare`, R`Aumenta`, R`Diminuisce, perché $I$ diminuisce`, R`Diventa zero`], corretta: 1, spiegazione: R`$L$ resta uguale, $\omega$ cresce, e $\tfrac{1}{2} \cdot I \cdot \omega^2 = \tfrac{1}{2} \cdot L \cdot \omega$ cresce con lei. L'energia in più viene dal lavoro dei muscoli.` },
    { id: 'q-07', domanda: R`Quale grandezza fa, per le rotazioni, la parte della massa?`, opzioni: [R`Il momento d'inerzia`, R`Il momento della forza`, R`La velocità angolare`, R`Il momento angolare`], corretta: 0, spiegazione: R`In $M = I \cdot \alpha$ il momento d'inerzia sta al posto della massa di $F = m \cdot a$. Il momento della forza fa la parte della forza, il momento angolare quella della quantità di moto.` },
    { id: 'q-08', domanda: R`Una ruota rotola senza strisciare con il centro a velocità $v$. Quanto va veloce il punto che in quell'istante tocca terra?`, opzioni: [R`$v$`, R`$2 \cdot v$`, R`Zero`, R`$v / 2$`], corretta: 2, spiegazione: R`Se non striscia, il punto di contatto è fermo rispetto al terreno. Il centro va a $v$ e la cima a $2 \cdot v$.` },
    { id: 'q-09', domanda: R`La velocità angolare di un volano raddoppia. La sua energia cinetica…`, opzioni: [R`raddoppia`, R`diventa quattro volte tanto`, R`resta uguale`, R`si dimezza`], corretta: 1, spiegazione: R`$E_c = \tfrac{1}{2} \cdot I \cdot \omega^2$: $\omega$ va al quadrato. Raddoppia invece il momento angolare $L = I \cdot \omega$.` },
    { id: 'q-10', domanda: R`Quando si conserva il momento angolare di un corpo?`, opzioni: [R`Sempre`, R`Quando si conserva la sua energia meccanica`, R`Solo quando sul corpo non agisce nessuna forza`, R`Quando il momento totale delle forze esterne è zero`], corretta: 3, spiegazione: R`Le forze possono esserci, purché il loro momento totale sia zero. Sulla pattinatrice agiscono il peso e la forza normale del ghiaccio, ma stanno sull'asse. E l'energia può cambiare anche se $L$ resta uguale.` },
    { id: 'q-11', domanda: R`Un'asta gira prima attorno al suo centro, poi attorno a un'estremità. Come cambia il momento d'inerzia?`, opzioni: [R`Diventa quattro volte tanto`, R`Resta uguale: la massa è la stessa`, R`Si dimezza`, R`Raddoppia`], corretta: 0, spiegazione: R`Si passa da $\tfrac{1}{12} \cdot m \cdot \ell^2$ a $\tfrac{1}{3} \cdot m \cdot \ell^2$, cioè quattro volte tanto. La massa è la stessa, ma ora molta massa sta più lontano dall'asse.` },
    { id: 'q-12', domanda: R`Qual è l'unità di misura del momento angolare?`, opzioni: [R`$\text{N} \cdot \text{m}$`, R`$\text{kg} \cdot \text{m}^2$`, R`$\text{kg} \cdot \text{m}^2\text{/s}$`, R`$\text{kg} \cdot \text{m/s}$`], corretta: 2, spiegazione: R`$L = I \cdot \omega$: kg·m² per rad/s. N·m è il momento di una forza, kg·m² il momento d'inerzia, kg·m/s la quantità di moto.` },
    { id: 'q-13', domanda: R`Perché un tuffatore che si raggruppa in volo gira più in fretta?`, opzioni: [R`Perché il trampolino gli dà una spinta in più`, R`Perché l'aria lo fa girare`, R`Perché il peso lo fa accelerare`, R`Perché il suo momento d'inerzia diminuisce e il momento angolare si conserva`], corretta: 3, spiegazione: R`In volo il peso agisce nel baricentro e non ha momento: $L = I \cdot \omega$ resta uguale. Stringendosi diminuisce $I$, quindi cresce $\omega$. La spinta del trampolino c'è solo prima di staccarsi.` },
    { id: 'q-14', domanda: R`Una forza tangente spinge una ruota sul bordo. Se la stessa forza si applica a metà raggio, l'accelerazione angolare…`, opzioni: [R`raddoppia`, R`si dimezza`, R`resta uguale: la forza è la stessa`, R`diventa un quarto`], corretta: 1, spiegazione: R`Il braccio si dimezza, quindi anche il momento $M = F \cdot b$. Con lo stesso $I$, da $\alpha = M / I$ anche $\alpha$ si dimezza. Conta il momento, non la forza da sola.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`I giri al minuto non sono rad/s: moltiplica per $2\pi$ e dividi per 60. Nelle formule l'angolo va sempre in radianti.` },
    { tipo: 'errore', testo: R`Il momento d'inerzia dipende dall'asse. Prima di usare la tabella, guarda attorno a che cosa gira il corpo.` },
    { tipo: 'errore', testo: R`Quando una pattinatrice chiude le braccia si conserva il momento angolare, non l'energia: l'energia cinetica aumenta.` },
    { tipo: 'trucco', testo: R`Le rotazioni sono il moto rettilineo con altre lettere: $s \to \theta$, $v \to \omega$, $a \to \alpha$, $m \to I$, $F \to M$, $p \to L$. Le formule si copiano.` },
    { tipo: 'trucco', testo: R`Il radiante è un numero puro: $\text{rad} \cdot \text{m}$ fa metri. Per questo $v = \omega \cdot r$ dà m/s.` },
    { tipo: 'metodo', testo: R`Per chi rotola giù da un piano, usa l'energia: $m \cdot g \cdot h = \tfrac{1}{2} \cdot m \cdot v^2 + \tfrac{1}{2} \cdot I \cdot \omega^2$, con $\omega = v / R$.` },
    { tipo: 'metodo', testo: R`Prima di usare la conservazione del momento angolare, controlla i momenti esterni. Le forze che passano per l'asse non contano.` },
    { tipo: 'trucco', testo: R`Più la massa è lontana dall'asse, più è grande $I$. Anello, sfera cava, cilindro pieno, sfera piena: in quest'ordine $I$ cala.` }
  ],
  aneddoti: [
    { fisico: 'Leonhard Euler', anni: '1707–1783', titolo: 'Il nome del momento d\'inerzia', testo: R`Leonhard Euler era svizzero, di Basilea, ma lavorò quasi sempre a San Pietroburgo e a Berlino. Scrisse di tutto: numeri, curve, navi, musica, luce. Nel 1765 pubblicò un libro sul moto dei corpi rigidi, la *Theoria motus corporum solidorum seu rigidorum*. Lì studiò come gira un corpo esteso, non più un punto. Gli serviva una grandezza nuova: la somma delle masse per il quadrato delle distanze dall'asse. La chiamò *momentum inertiae*, momento d'inerzia. Mostrò anche che ogni corpo rigido ha tre assi speciali, gli assi principali. Negli anni seguenti perse quasi del tutto la vista. Continuò a lavorare a memoria, dettando i calcoli ai figli e agli assistenti. Una buona parte delle sue opere nacque proprio allora.`, legame: R`È la grandezza $I = \Sigma\, m \cdot r^2$, che porta ancora il nome scelto da Euler.` },
    { fisico: 'Léon Foucault', anni: '1819–1868', titolo: 'Lo strumento per vedere la rotazione', testo: R`Nel 1851 Léon Foucault aveva mostrato la rotazione della Terra con un pendolo. L'anno dopo cercò una prova diversa. Fece costruire un disco di metallo pesante, montato dentro anelli che lo lasciavano orientare in ogni direzione. Una manovella con ingranaggi lo metteva in rotazione molto in fretta. Poi il disco veniva staccato e lasciato girare da solo. Girava solo per pochi minuti, ma bastavano. Il suo asse restava fermo rispetto alle stelle, mentre la Terra gli girava sotto. A chi guardava, l'asse sembrava spostarsi piano. Foucault chiamò lo strumento *giroscopio*, dal greco: «osservare la rotazione». Mezzo secolo dopo, con un motore elettrico a tenerlo in moto, il giroscopio divenne la bussola delle navi.`, legame: R`Senza momenti esterni il momento angolare non cambia, neanche in direzione: l'asse del giroscopio resta fermo nello spazio.` },
    { fisico: 'Jocelyn Bell Burnell', anni: 'nata nel 1943', titolo: 'Gli omini verdi che erano stelle', testo: R`Nel 1967 Jocelyn Bell era una dottoranda a Cambridge. Aveva aiutato a costruire un radiotelescopio fatto di pali e chilometri di fili, in un campo. Ogni giorno esaminava a mano metri di carta dei registratori. A un certo punto notò una piccola traccia strana, che lei chiamò «un po' di sporco». Era un segnale che si ripeteva, preciso, ogni 1,33 secondi. Lei e il suo relatore, Antony Hewish, pensarono per scherzo a un'altra civiltà. La sorgente fu chiamata LGM-1, da *little green men*, omini verdi. Poi lei ne trovò una seconda, in un'altra parte del cielo. Erano **pulsar**: stelle di neutroni che girano su se stesse e spazzano lo spazio con un fascio di onde radio. Nel 1974 il Nobel andò a Hewish e a Martin Ryle, non a lei.`, legame: R`Le pulsar girano così in fretta perché, collassando, la stella ha ridotto moltissimo $I$ conservando il momento angolare.` },
    { fisico: 'Emmy Noether', anni: '1882–1935', titolo: 'Le simmetrie che fanno conservare', testo: R`Emmy Noether era una matematica tedesca, nata a Erlangen. Nel 1915 David Hilbert e Felix Klein la chiamarono a Gottinga, allora il centro della matematica mondiale. Molti professori si opposero: una donna non poteva insegnare all'università. Si racconta che Hilbert rispondesse che la facoltà non era uno stabilimento balneare. Per anni Noether tenne lezioni annunciate a nome di Hilbert. Nel 1918 dimostrò il teorema che oggi porta il suo nome. Ogni simmetria delle leggi fisiche porta con sé una grandezza che si conserva. Se le leggi non cambiano nel tempo, si conserva l'energia. Se non cambiano spostandosi, la quantità di moto. Se non cambiano ruotando, il momento angolare. Nel 1933 i nazisti la cacciarono, e lei emigrò negli Stati Uniti.`, legame: R`La conservazione del momento angolare nasce dal fatto che le leggi della fisica sono le stesse in tutte le direzioni.` }
  ]
});
})();
