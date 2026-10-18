/* Quanto — La relatività ristretta (quinto anno): i postulati di Einstein, la simultaneità, la dilatazione del tempo,
   la contrazione delle lunghezze, le trasformazioni di Lorentz, massa ed energia.
   Contratto in SCHEMA.md. Verifica: node strumenti/verifica-argomento.js argomenti/relativita.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'relativita',
  titolo: 'La relatività ristretta',
  introduzione: R`Nel 1905 Albert Einstein, impiegato all'ufficio brevetti di Berna, cambiò il modo di pensare lo spazio e il tempo. La **relatività ristretta** parte da una domanda semplice. La luce va sempre alla stessa velocità, chiunque la misuri? La risposta è sì, e le conseguenze sono sorprendenti. Il tempo scorre più lento per chi si muove. Le lunghezze si accorciano. Due fatti simultanei per una persona non lo sono per un'altra.

Non sono stranezze da laboratorio. I satelliti del GPS devono correggere i loro orologi per gli effetti della relatività: senza correzione, la posizione sbaglierebbe di chilometri in un giorno. I muoni dei raggi cosmici arrivano a terra solo perché il loro tempo, per noi, rallenta. E la formula $E = m \cdot c^2$ spiega da dove viene l'energia del Sole.

Servono i sistemi inerziali e le trasformazioni di Galileo, l'energia cinetica e la quantità di moto. Serve anche sapere che la luce è un'onda elettromagnetica, con la sua velocità $c$.`,
  inBreve: [
    R`I **postulati di Einstein**: le leggi della fisica sono le stesse in tutti i sistemi inerziali, e la luce nel vuoto va a $c$ per tutti, qualunque sia il moto della sorgente o di chi la misura.`,
    R`La **simultaneità è relativa**: due eventi in luoghi diversi, simultanei per un osservatore, non lo sono per un altro che si muove rispetto a lui.`,
    R`Un orologio in moto batte più lento: $\Delta t = \gamma \cdot \Delta t_0$, con $\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$. Il **tempo proprio** $\Delta t_0$ è il più breve.`,
    R`Un oggetto in moto è più corto nella direzione del moto: $L = \dfrac{L_0}{\gamma}$. La **lunghezza propria** $L_0$ è la più lunga.`,
    R`Le velocità si compongono con $u = \dfrac{u' + v}{1 + u' \cdot v / c^2}$: nessun corpo con massa raggiunge $c$.`,
    R`La massa è energia: $E_0 = m \cdot c^2$. L'energia totale è $E = \gamma \cdot m \cdot c^2$, la quantità di moto $p = \gamma \cdot m \cdot v$.`
  ],
  sezioni: [
    {
      id: 'postulati',
      titolo: 'I postulati di Einstein',
      testo: R`Sul treno lanci una palla in avanti. Per chi sta a terra la palla va più veloce: alla sua velocità si aggiunge quella del treno. È la somma delle velocità di Galileo, $u = u' + v$.

Qui $v$ è la velocità del treno rispetto a terra. La velocità della palla è $u'$ misurata sul treno, $u$ misurata da terra. Treno e terra sono due **sistemi di riferimento inerziali**: fermi o in moto rettilineo uniforme l'uno rispetto all'altro.

[[video:relativita/postulati]]

Con la luce la somma non funziona. Le equazioni di Maxwell danno la sua velocità: $c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}} \approx 3 \cdot 10^8\,\text{m/s}$. Ma rispetto a che cosa? Nell'Ottocento si pensava a un mezzo invisibile, l'**etere**. La luce si sarebbe propagata nell'etere come il suono nell'aria.

Se l'etere ci fosse, la Terra lo attraverserebbe a 30 km/s nel suo giro attorno al Sole. La luce andrebbe un po' più piano controvento e un po' più veloce a favore. Nel 1887 Albert Michelson ed Edward Morley cercarono questa differenza. Usarono un interferometro, uno strumento che confronta due fasci di luce. Non trovarono nessuna differenza.

>* **I postulati di Einstein** (1905). Primo: le leggi della fisica sono le stesse in tutti i sistemi inerziali. Secondo: la luce nel vuoto ha la stessa velocità $c$ in tutti i sistemi inerziali. Non dipende dal moto della sorgente né da quello di chi la misura.

Il primo postulato estende la relatività di Galileo a tutta la fisica, anche all'elettromagnetismo. Il secondo sembra innocuo, ma obbliga a ripensare lo spazio e il tempo. Se una velocità è uguale per tutti, devono cambiare le distanze e le durate.

>! Il secondo postulato riguarda la luce **nel vuoto**. In un vetro o nell'acqua la luce va più piano di $c$. E la somma di Galileo non sparisce: per le velocità di tutti i giorni resta un'ottima approssimazione.

?? Un'astronave va a metà della velocità della luce e accende il faro anteriore. A che velocità misura quella luce un osservatore fermo sulla Terra?
[ ] $1{,}5 \cdot c$
[ ] $0{,}5 \cdot c$
[x] $c$
=> Per il secondo postulato la luce nel vuoto va a $c$ per chiunque, qualunque sia il moto della sorgente. La somma di Galileo qui non vale.`
    },
    {
      id: 'simultaneita',
      titolo: 'La simultaneità è relativa',
      testo: R`Due fatti sono **simultanei** se accadono nello stesso istante. Sembra una proprietà assoluta: o succedono insieme, o no. Con il secondo postulato non è più così.

In fisica un fatto che accade in un luogo preciso e in un istante preciso si chiama **evento**. Lo scoppio di un lampo è un evento, il passaggio di un treno davanti a un cartello pure.

Un treno corre a $v = 0{,}6 \cdot c$. Bruno sta nel mezzo del treno, Anna è ferma a terra. Quando Bruno le passa davanti, due fulmini colpiscono la coda A e la testa B del treno.

[[video:relativita/simultaneita]]

Anna è a metà strada fra i due segni lasciati sui binari. La luce dei due lampi la raggiunge nello stesso istante: per lei i fulmini sono caduti insieme. Bruno invece corre incontro alla luce di B e scappa da quella di A. Riceve prima la luce di B, poi quella di A.

Anche per Bruno la luce va a $c$ in tutte e due le direzioni. E lui è nel mezzo del treno, alla stessa distanza dalle due estremità. Se la luce di B arriva prima, B è caduto prima. Per Bruno i fulmini non sono simultanei.

Nel grafico ci sono gli eventi come li vede Anna. In orizzontale la posizione, in verticale $c \cdot t$: la strada che la luce fa nel tempo $t$. Così la luce corre su rette inclinate di 45°.

[[grafico:simultaneita]]

>* **Relatività della simultaneità.** Due eventi lontani possono essere simultanei per un osservatore e non per un altro, che si muove rispetto a lui.

Chi ha ragione? Tutti e due. Non esiste un sistema di riferimento privilegiato che decide. La simultaneità dipende dal sistema da cui si guarda, come la velocità di un corpo.

>! La relatività non scambia mai causa ed effetto. Se un evento ne provoca un altro, la causa viene prima per tutti gli osservatori. L'ordine può cambiare solo fra eventi così lontani che neanche la luce fa in tempo ad andare dall'uno all'altro.

?? Due eventi avvengono nello stesso luogo e nello stesso istante per Anna. Per Bruno, che si muove rispetto a lei, sono simultanei?
[x] sì, per qualunque osservatore
[ ] no, per Bruno uno dei due viene prima
[ ] dipende dalla velocità di Bruno
=> La relatività della simultaneità riguarda eventi in **luoghi diversi**. Due eventi nello stesso punto e nello stesso istante sono simultanei per tutti.`
    },
    {
      id: 'dilatazione',
      titolo: 'La dilatazione del tempo',
      testo: R`L'orologio a luce è il più semplice degli orologi. Ci sono due specchi, uno sopra l'altro a distanza $d$, e un lampo che va su e giù. Ogni andata e ritorno è un tic, e dura $\Delta t_0 = \dfrac{2 \cdot d}{c}$.

L'orologio sta su un treno. Chi è a bordo lo vede fermo e misura il **tempo proprio** $\Delta t_0$.

>* Il **tempo proprio** $\Delta t_0$ è l'intervallo misurato da un orologio fermo rispetto ai due eventi: per quell'orologio, inizio e fine avvengono nello stesso punto.

[[video:relativita/tempo]]

Ora il treno corre a velocità $v$ e lo guardiamo da terra. Mentre il lampo sale, lo specchio di sopra si sposta. La luce fa un percorso a zig-zag, più lungo. Ma va sempre a $c$, per il secondo postulato. Quindi ogni tic, $\Delta t$, dura di più.

Nel triangolo di mezzo tic i cateti sono $d$ e $v \cdot \Delta t / 2$. L'ipotenusa è la strada della luce, $c \cdot \Delta t / 2$.

~ \left(\tfrac{c \cdot \Delta t}{2}\right)^2 = d^2 + \left(\tfrac{v \cdot \Delta t}{2}\right)^2 :: il teorema di Pitagora sul triangolo di mezzo tic
~ (c^2 - v^2) \cdot \Delta t^2 = 4 \cdot d^2 :: moltiplico per 4 e porto a sinistra il termine con $v$
~ (c^2 - v^2) \cdot \Delta t^2 = c^2 \cdot \Delta t_0^2 :: perché $2 \cdot d = c \cdot \Delta t_0$
~ \Delta t^2 = \dfrac{\Delta t_0^2}{1 - v^2/c^2} :: divido per $c^2 - v^2$ e semplifico $c^2$
~ \Delta t = \evidb{\gamma \cdot \Delta t_0} :: con $\gamma = 1 / \sqrt{1 - v^2/c^2}$

>* **Dilatazione del tempo**: un orologio in moto a velocità $v$ batte più lento. Un tempo proprio $\Delta t_0$, misurato da un sistema in cui l'orologio si muove, dura $\Delta t = \gamma \cdot \Delta t_0$. Il **fattore di Lorentz** è $\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$.

Per esempio, a $v = 0{,}6 \cdot c$:

~ \gamma = \dfrac{1}{\sqrt{1 - 0{,}6^2}} = \dfrac{1}{\sqrt{0{,}64}} :: con $v = 0{,}6 \cdot c$ il rapporto $v^2/c^2$ vale $0{,}36$
~ \gamma = \dfrac{1}{0{,}8} = \evidb{1{,}25} :: un tic che a bordo dura 2 s, visto da terra, dura 2,5 s

Il fattore $\gamma$ vale sempre almeno 1. Per un aereo differisce da 1 di meno di un miliardesimo. Vicino a $c$ cresce senza limite: a $0{,}9 \cdot c$ vale circa 2,3, a $0{,}99 \cdot c$ circa 7,1.

[[grafico:gamma]]

>! La dilatazione non è un difetto degli orologi. Rallenta tutto quello che succede sul treno: il cuore, le reazioni chimiche, l'invecchiamento. E per chi sta sul treno il suo orologio va benissimo. Visto da lui, è l'orologio di terra a rallentare.

> **Il paradosso dei gemelli.** Un gemello parte su un'astronave velocissima e poi torna; l'altro resta a terra. Al ritorno il viaggiatore è più giovane. Non c'è contraddizione: per tornare il viaggiatore inverte la rotta e cambia sistema inerziale. Chi resta a terra no. La situazione dei due non è simmetrica.

?? Su un'astronave veloce un astronauta cronometra il suo pranzo. Chi misura il tempo proprio del pranzo?
[x] l'astronauta
[ ] chi guarda da terra
[ ] tutti e due, perché il pranzo è lo stesso
=> Per l'astronauta il pranzo comincia e finisce nello stesso punto dell'astronave: il suo orologio misura il tempo proprio. Da terra il pranzo dura $\gamma$ volte di più.`
    },
    {
      id: 'contrazione',
      titolo: 'La contrazione delle lunghezze',
      testo: R`I **muoni** sono particelle instabili. Nascono a circa 15 km di quota, quando i raggi cosmici urtano l'atmosfera. In media un muone vive 2,2 μs, nel suo tempo, poi decade. Anche alla velocità della luce, in 2,2 μs farebbe solo 660 m. Eppure a terra ne arrivano moltissimi.

[[video:relativita/muoni]]

Per noi a terra la spiegazione è la dilatazione del tempo. Il muone va a $0{,}998 \cdot c$, quindi $\gamma \approx 15{,}8$. Per noi vive in media $15{,}8 \cdot 2{,}2\,\mu\text{s} \approx 35\,\mu\text{s}$: basta per scendere di molti chilometri.

E per il muone? Lui è fermo, e il suo orologio va benissimo. È la Terra a corrergli incontro a $0{,}998 \cdot c$. Per lui deve accorciarsi la strada.

>* **Contrazione delle lunghezze.** Un oggetto fermo è lungo $L_0$: è la sua **lunghezza propria**. Misurato da un sistema in cui si muove a velocità $v$, è lungo $L = \dfrac{L_0}{\gamma}$. Si accorcia solo nella direzione del moto.

~ L = \dfrac{L_0}{\gamma} = \dfrac{15\,000\,\text{m}}{15{,}8} :: i 15 km di atmosfera, che per il muone corrono via
~ L \approx \evidb{950\,\text{m}} :: la strada, per il muone, è lunga meno di un chilometro
~ \Delta t_0 = \dfrac{950\,\text{m}}{2{,}99 \cdot 10^8\,\text{m/s}} \approx 3{,}2\,\mu\text{s} :: la durata del viaggio sul suo orologio

In 3,2 μs passano circa 1,4 vite medie (è la vita media, non il tempo di dimezzamento): arriva a terra circa un muone su quattro. Le due spiegazioni raccontano lo stesso fatto da due punti di vista. Per noi il tempo del muone rallenta; per lui la strada si accorcia. Nel 1963 David Frisch e James Smith contarono i muoni in cima al Monte Washington e al livello del mare. Il conto tornava.

Nel disegno c'è un vagone lungo 20 m da fermo. Quando corre, chi lo vede passare lo misura più corto. L'altezza non cambia.

[[grafico:vagone]]

>! La contrazione non è un'illusione ottica, e non è uno schiacciamento. Nessuna forza comprime il vagone, e per chi viaggia a bordo resta lungo $L_0$. È la misura della lunghezza a dipendere dal sistema di riferimento.

?? Un'astronave a forma di cubo vola veloce, lungo la direzione di uno spigolo. Che forma ha per chi la vede passare?
[ ] un cubo più piccolo, accorciato in tutte le direzioni
[x] un parallelepipedo, più corto solo nella direzione del moto
[ ] un cubo più grande
=> La contrazione riguarda solo la direzione del moto. Le dimensioni perpendicolari al moto restano uguali.`
    },
    {
      id: 'lorentz',
      titolo: 'Lorentz e la somma delle velocità',
      testo: R`Le trasformazioni di Galileo, $x' = x - v \cdot t$ e $t' = t$, danno per scontato che il tempo sia uguale per tutti. Con il secondo postulato non funzionano più. Al loro posto ci sono le **trasformazioni di Lorentz**.

Il sistema con l'apice va a velocità $v$ lungo l'asse x. All'istante zero le due origini coincidono.

>* **Trasformazioni di Lorentz**: $x' = \gamma \cdot (x - v \cdot t)$ e $t' = \gamma \cdot \left(t - \dfrac{v \cdot x}{c^2}\right)$. Le coordinate perpendicolari al moto non cambiano: $y' = y$, $z' = z$.

Il tempo $t'$ dipende anche dalla posizione $x$. È la relatività della simultaneità scritta in una formula. Prendi due eventi simultanei per la terra, lontani $\Delta x$. Sul treno sono separati da $\Delta t' = -\gamma \cdot v \cdot \Delta x / c^2$, che non è zero.

Quando $v$ è molto più piccola di $c$, $\gamma$ vale quasi 1 e il termine $v \cdot x / c^2$ è trascurabile. Tornano le trasformazioni di Galileo. La relatività non butta via la fisica di Newton: la contiene, come il caso delle velocità piccole.

Dalle trasformazioni di Lorentz si ricava anche come si sommano le velocità. Un corpo va a velocità $u'$ nel sistema del treno, nello stesso verso del treno.

>* **Composizione relativistica delle velocità**: $u = \dfrac{u' + v}{1 + u' \cdot v / c^2}$, dove $u$ è la velocità del corpo misurata da terra.

Proviamo con la luce del faro del treno, cioè con $u' = c$:

~ u = \dfrac{c + v}{1 + c \cdot v / c^2} :: al posto della velocità del corpo metto quella della luce
~ u = \dfrac{c + v}{(c + v) / c} :: sotto, $1 + v/c$ è uguale a $(c + v)/c$
~ u = \evidb{c} :: qualunque sia $v$: è proprio il secondo postulato

Due velocità minori di $c$, composte così, danno sempre meno di $c$. Nessun corpo con massa raggiunge la velocità della luce, e nessun segnale la supera.

[[grafico:somma]]

>! Per le velocità di tutti i giorni la correzione è minuscola. Con $u' = 30\,\text{m/s}$ e $v = 300\,\text{m/s}$ il denominatore vale $1 + 10^{-13}$. Per questo nessuno se n'era accorto prima.

?? Due astronavi si vengono incontro, ognuna a $0{,}6 \cdot c$ rispetto alla Terra. Quanto vale la velocità dell'una vista dall'altra?
[ ] $1{,}2 \cdot c$
[x] meno di $c$
[ ] esattamente $c$
=> La somma di Galileo darebbe $1{,}2 \cdot c$, ma qui non vale. Con la formula relativistica viene $\dfrac{1{,}2}{1 + 0{,}36} \cdot c \approx 0{,}88 \cdot c$. Due velocità minori di $c$ non superano mai $c$.`
    },
    {
      id: 'massa-energia',
      titolo: 'Massa ed energia: E = m·c²',
      testo: R`Spingi un'astronave con un motore che non si spegne mai. La velocità cresce, ma sempre meno: si avvicina a $c$ senza raggiungerla. L'energia che il motore le dà non va persa. Però non si trasforma più in tanta velocità.

In relatività la quantità di moto e l'energia cambiano forma. La massa $m$ invece è quella misurata da fermi, uguale per tutti gli osservatori.

>* La **quantità di moto relativistica** è $p = \gamma \cdot m \cdot v$. L'**energia totale** è $E = \gamma \cdot m \cdot c^2$. Anche da fermo un corpo ha l'**energia a riposo** $E_0 = m \cdot c^2$.

L'energia cinetica è la differenza fra l'energia totale e quella a riposo:

$$E_c = E - E_0 = (\gamma - 1) \cdot m \cdot c^2$$

Alle velocità piccole ridà la formula di sempre, $\tfrac{1}{2} \cdot m \cdot v^2$. Vicino a $c$ cresce senza limite: per arrivare a $c$ servirebbe un'energia infinita. Energia e quantità di moto sono legate da $E^2 = (p \cdot c)^2 + (m \cdot c^2)^2$.

[[grafico:energia]]

> Alcuni libri chiamano **massa relativistica** il prodotto $\gamma \cdot m$, che cresce con la velocità. È solo un altro nome per $E / c^2$. Qui la massa è sempre quella a riposo.

[[video:relativita/massa-energia]]

La formula famosa del video, $E = m \cdot c^2$, è questa: l'energia di un corpo fermo, che qui chiamiamo $E_0$.

La formula $E_0 = m \cdot c^2$ dice che la massa è una forma di energia. Il fattore $c^2$ è enorme, quindi poca massa vale tantissima energia.

~ E_0 = m \cdot c^2 :: un grammo di materia: $m = 0{,}001\,\text{kg}$
~ E_0 = 0{,}001\,\text{kg} \cdot (3 \cdot 10^8\,\text{m/s})^2 :: la velocità della luce va al quadrato, con la sua unità
~ E_0 = 0{,}001\,\text{kg} \cdot 9 \cdot 10^{16}\,\text{m}^2/\text{s}^2 :: il quadrato di $c$; un $\text{kg} \cdot \text{m}^2/\text{s}^2$ è un joule
~ E_0 = \evidb{9 \cdot 10^{13}\,\text{J}} :: l'elettricità di una famiglia per più di 9000 anni

Vale anche al contrario. Quando un sistema cede un'energia $\Delta E$, la sua massa cala di $\Delta m = \Delta E / c^2$. Nel centro del Sole l'idrogeno si fonde in elio, e l'elio ha un po' meno massa. È la fusione nucleare, che vedrai in «Il nucleo». Per questo il Sole perde circa 4 milioni di tonnellate ogni secondo.

>! Non è vero che la massa cambia solo nelle reazioni nucleari. Anche un fuoco che brucia o una pila che si scarica perdono un po' di massa. La perdita però è meno di un miliardesimo, e nessuna bilancia la vede.

?? Un elettrone è già stato accelerato fino a $0{,}99 \cdot c$. Se gli si dà altra energia, che cosa succede?
[ ] supera la velocità della luce
[x] l'energia cresce molto, la velocità pochissimo
[ ] la velocità resta uguale e cresce la massa
=> Vicino a $c$ l'energia $E = \gamma \cdot m \cdot c^2$ cresce senza limite, mentre la velocità si avvicina a $c$ senza raggiungerla. La massa $m$ è quella a riposo, e non cambia.`
    },
    {
      id: 'problemi',
      titolo: 'Come si imposta un problema',
      testo: R`Nei problemi di relatività l'errore più comune è scambiare i due sistemi di riferimento. Conviene seguire sempre gli stessi passi.

1. **Individua i due sistemi inerziali**, per esempio la Terra e l'astronave, e la velocità $v$ dell'uno rispetto all'altro.
2. **Calcola $\gamma$.** Scrivi $v$ come frazione di $c$: con $v = 0{,}6 \cdot c$, il rapporto $v^2/c^2$ è $0{,}6^2$. Controlla che $\gamma$ sia maggiore di 1.
3. **Trova il tempo proprio.** È quello dell'orologio presente a tutti e due gli eventi.
4. **Trova la lunghezza propria.** È quella misurata da chi è fermo rispetto all'oggetto.
5. **Applica le formule** $\Delta t = \gamma \cdot \Delta t_0$ e $L = L_0 / \gamma$.
6. **Controlla il risultato.** Il tempo misurato dall'altro sistema deve venire più lungo, la lunghezza più corta.

>* Il tempo proprio è il più breve di tutti; la lunghezza propria è la più lunga.

> Con le distanze delle stelle conviene l'**anno luce**: la strada che la luce fa in un anno. Una stella a 4 anni luce, a $0{,}5 \cdot c$, si raggiunge in 8 anni, per chi resta sulla Terra.

Esempio. Un'astronave lunga 100 m da ferma passa davanti a una stazione spaziale a $0{,}6 \cdot c$, cioè a $1{,}8 \cdot 10^8\,\text{m/s}$. Quanto dura il passaggio, per la stazione e per gli astronauti?

~ L = \dfrac{L_0}{\gamma} = \dfrac{100\,\text{m}}{1{,}25} = 80\,\text{m} :: per la stazione l'astronave è in moto: è più corta
~ \Delta t_0 = \dfrac{80\,\text{m}}{1{,}8 \cdot 10^8\,\text{m/s}} \approx 0{,}444\,\mu\text{s} :: i due eventi accadono davanti alla stazione: tempo proprio
~ \Delta t = 1{,}25 \cdot 0{,}444\,\mu\text{s} \approx \evidb{0{,}56\,\mu\text{s}} :: per gli astronauti la stazione percorre tutti i 100 m

Controllo: per gli astronauti la stazione fa 100 m a $1{,}8 \cdot 10^8\,\text{m/s}$, cioè circa 0,56 μs. Torna.

>! Il tempo proprio non è sempre quello degli astronauti. Qui i due eventi (la prua e la poppa che passano) accadono nello stesso punto della stazione. Il tempo proprio è quello della stazione.`
    }
  ],
  grafici: {
    /* i due fulmini visti da Anna (diagramma spazio-tempo): la luce va a 45°; Bruno, a 0,6·c, riceve prima B e poi A.
       Unità: la distanza fra Bruno e ciascuna estremità del treno, all'istante dei fulmini */
    simultaneita: {
      tipo: 'piano', x: [-1.4, 1.9], y: [-0.2, 2.8], altezza: 545, proporzioni: 'uguali', passo: [0.5, 0.5],
      etichette: { x: 'x', y: 'c·t' }, mirino: false,
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [1.62, 2.7], colore: 'grigio' },
        { tipo: 'segmento', da: [-1, 0], a: [1.6, 2.6], colore: 1 },
        { tipo: 'segmento', da: [1, 0], a: [-0.9, 1.9], colore: 2 },
        { tipo: 'punto', p: [-1, 0], etichetta: 'A', posizione: 'alto-sinistra', colore: 1 },
        { tipo: 'punto', p: [1, 0], etichetta: 'B', posizione: 'alto-destra', colore: 2 },
        { tipo: 'punto', p: [0, 1], etichetta: 'Anna: insieme', posizione: 'sinistra', colore: 'grigio' },
        { tipo: 'punto', p: [0.375, 0.625], etichetta: 'Bruno: B', posizione: 'destra', colore: 2 },
        { tipo: 'punto', p: [1.5, 2.5], etichetta: 'Bruno: A', posizione: 'sinistra', colore: 1 },
        { tipo: 'testo', p: [1.05, 1.45], testo: 'Bruno', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [0.07, 1.85], testo: 'Anna', ancora: 'start', colore: 'grigio' }
      ],
      didascalia: 'Gli eventi visti da Anna, ferma nell\'origine (la sua linea è l\'asse verticale). Posizione in orizzontale, c·t in verticale (l\'unità è la distanza di Bruno da ciascuna estremità del treno). La retta grigia inclinata è Bruno, che corre a 0,6·c. I fulmini cadono insieme per Anna; la luce di B (arancio) raggiunge Bruno molto prima di quella di A (azzurro).'
    },
    /* il fattore di Lorentz: quasi 1 alle velocità piccole, infinito verso c */
    gamma: {
      tipo: 'piano', x: [0, 1.08], y: [0, 8], altezza: 420, passo: [0.1, 1], proporzioni: 'libere',
      etichette: { x: 'v/c', y: 'γ' },
      parametri: [{ nome: 'b', min: 0.1, max: 0.99, passo: 0.01, valore: 0.6, decimali: 2, etichetta: 'velocità v/c' }],
      funzioni: [{ f: '1/sqrt(1 - x^2)', dominio: [0, 0.992], colore: 1 }],
      elementi: [
        { tipo: 'verticale', x: 1, colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [0.97, 7.4], testo: 'v = c', ancora: 'end', colore: 'grigio' },
        { tipo: 'testo', p: [0.04, 2.5], testo: 'γ ≈ 1: vale Galileo', ancora: 'start', colore: 'grigio' },
        { tipo: 'punto', p: ['b', '1/sqrt(1 - b^2)'], etichetta: 'γ = {{1/sqrt(1 - b^2)|2}}', posizione: 'alto-sinistra', colore: 1 }
      ],
      didascalia: 'Il fattore di Lorentz γ = 1/√(1 − v²/c²) in funzione della velocità, scritta come frazione di c. Fino a circa 0,3·c resta vicino a 1; verso c cresce senza limite. Il cursore sposta il punto. Passa il dito sul grafico per leggere i valori.'
    },
    /* il vagone fermo e in moto: si accorcia solo nella direzione del moto */
    vagone: {
      tipo: 'piano', x: [-1, 23], y: [-1.5, 12], altezza: 340, assi: false, griglia: false,
      parametri: [{ nome: 'b', min: 0, max: 0.95, passo: 0.05, valore: 0.6, decimali: 2, etichetta: 'velocità v/c' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 7], [20, 7], [20, 10], [0, 10]], colore: 'grigio' },
        { tipo: 'testo', p: [0, 10.7], testo: 'fermo: L_0 = 20 m', ancora: 'start', colore: 'grigio' },
        { tipo: 'segmento', da: [20, 0.4], a: [20, 7], colore: 'grigio', tratteggio: true },
        { tipo: 'poligono', punti: [[0, 1], ['20*sqrt(1 - b^2)', 1], ['20*sqrt(1 - b^2)', 4], [0, 4]], colore: 'grigio' },
        { tipo: 'vettore', da: ['20*sqrt(1 - b^2) + 0.6', 2.5], a: ['20*sqrt(1 - b^2) + 0.6 + 7*b', 2.5], etichetta: 'v', colore: 1 },
        { tipo: 'testo', p: [0, -0.7], testo: 'in moto: L = {{20*sqrt(1 - b^2)|1}} m', ancora: 'start', colore: 'grigio' }
      ],
      didascalia: 'Un vagone lungo 20 m e alto 3 m da fermo (sopra) e lo stesso vagone visto passare a velocità v (sotto). È più corto di γ volte nella direzione del moto; l\'altezza non cambia. Il tratteggio segna la lunghezza da fermo. Il cursore cambia la velocità.'
    },
    /* la somma delle velocità: Galileo (tratteggio) supera c, Einstein (linea piena) no */
    somma: {
      tipo: 'piano', x: [0, 1], y: [0, 2], altezza: 420, passo: [0.1, 0.2], proporzioni: 'libere',
      etichette: { x: 'u\'/c', y: 'u/c' },
      parametri: [{ nome: 'b', min: 0, max: 0.95, passo: 0.05, valore: 0.5, decimali: 2, etichetta: 'astronave v/c' }],
      funzioni: [
        { f: 'x + b', dominio: [0, 1], colore: 1, tratteggio: true, etichetta: 'Galileo' },
        { f: '(x + b)/(1 + x*b)', dominio: [0, 1], colore: 1, etichetta: 'Einstein' }
      ],
      elementi: [
        { tipo: 'orizzontale', y: 1, colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [0.5, '(0.5 + b)/(1 + 0.5*b)'], etichetta: 'u = {{(0.5 + b)/(1 + 0.5*b)|2}}·c', posizione: 'basso-destra', colore: 1 }
      ],
      didascalia: 'Un\'astronave va a velocità v e lancia in avanti una sonda a u\' (misurata dall\'astronave). In verticale la velocità u della sonda per la Terra. Il tratteggio è la somma di Galileo, che supera c (la riga grigia); la linea piena è la formula relativistica, che resta sotto. Il punto è la sonda lanciata a 0,5·c. Il cursore cambia la velocità dell\'astronave.'
    },
    /* energia cinetica relativistica e classica, in unità di m·c² */
    energia: {
      tipo: 'piano', x: [0, 1.08], y: [0, 4], altezza: 420, passo: [0.1, 0.5], proporzioni: 'libere',
      etichette: { x: 'v/c', y: 'E_c (in m·c²)' },
      parametri: [{ nome: 'b', min: 0.3, max: 0.97, passo: 0.01, valore: 0.6, decimali: 2, etichetta: 'velocità v/c' }],
      funzioni: [
        { f: '1/sqrt(1 - x^2) - 1', dominio: [0, 0.97], colore: 3, etichetta: '(γ − 1)·m·c²' },
        { f: '0.5*x^2', dominio: [0, 0.95], colore: 3, tratteggio: true, etichetta: '½·m·v²' }
      ],
      elementi: [
        { tipo: 'verticale', x: 1, colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['b', '1/sqrt(1 - b^2) - 1'], etichetta: 'E_c = {{1/sqrt(1 - b^2) - 1|2}}·m·c²', posizione: 'alto-sinistra', colore: 3 }
      ],
      didascalia: 'L\'energia cinetica in funzione della velocità, misurata in multipli dell\'energia a riposo m·c². Alle velocità piccole la formula relativistica (linea piena) e ½·m·v² (tratteggio) coincidono; vicino a c la prima cresce senza limite. Il cursore sposta il punto.'
    }
  },
  esempi: [
    {
      titolo: 'Un giorno a bordo di un razzo',
      problema: R`Un razzo viaggia a $0{,}28 \cdot c$ rispetto alla Terra. Gli astronauti contano 24 ore sul loro orologio. Quanto dura quell'intervallo per chi sta sulla Terra?`,
      passi: [
        R`Dati: $v = 0{,}28 \cdot c$, $\Delta t_0 = 24\,\text{h}$. Cerco $\Delta t$, misurato dalla Terra.`,
        R`Le 24 ore cominciano e finiscono nello stesso punto del razzo: l'orologio di bordo misura il tempo proprio.`,
        R`Il fattore di Lorentz: $v^2/c^2 = 0{,}28^2 = 0{,}0784$, quindi $\gamma = \dfrac{1}{\sqrt{1 - 0{,}0784}} = \dfrac{1}{\sqrt{0{,}9216}} = \dfrac{1}{0{,}96} \approx 1{,}042$.`,
        R`Dilatazione del tempo: $\Delta t = \gamma \cdot \Delta t_0 = \dfrac{24\,\text{h}}{0{,}96} = 25\,\text{h}$.`,
        R`Controllo: il tempo misurato dalla Terra deve essere più lungo di quello proprio. Un'ora in più su 24: torna.`
      ],
      risultato: R`Per la Terra l'intervallo dura $25\,\text{h}$.`
    },
    {
      titolo: 'Quanto deve correre per accorciarsi',
      problema: R`Un'astronave è lunga 50 m quando è ferma. Mentre passa, gli strumenti di una stazione spaziale la misurano lunga 40 m. A che velocità va?`,
      passi: [
        R`Dati: $L_0 = 50\,\text{m}$, $L = 40\,\text{m}$. Cerco $v$.`,
        R`Da $L = \dfrac{L_0}{\gamma}$ ricavo $\gamma = \dfrac{L_0}{L} = \dfrac{50\,\text{m}}{40\,\text{m}} = 1{,}25$.`,
        R`Da $\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$ ricavo $1 - \dfrac{v^2}{c^2} = \dfrac{1}{\gamma^2} = \dfrac{1}{1{,}5625} = 0{,}64$.`,
        R`Quindi $\dfrac{v^2}{c^2} = 0{,}36$ e $v = 0{,}6 \cdot c = 0{,}6 \cdot 3 \cdot 10^8\,\text{m/s} = 1{,}8 \cdot 10^8\,\text{m/s}$.`,
        R`Controllo: a $0{,}6 \cdot c$ il fattore $\gamma$ vale $1{,}25$, e $50 / 1{,}25 = 40$. Torna.`
      ],
      risultato: R`$v = 0{,}6 \cdot c = 1{,}8 \cdot 10^8\,\text{m/s}$`
    },
    {
      titolo: 'Il viaggio verso una stella',
      problema: R`Una stella dista 4,8 anni luce dalla Terra. Un'astronave ci va a $0{,}96 \cdot c$. Quanto dura il viaggio per chi resta sulla Terra? E per l'equipaggio? Quanto è lunga la strada per l'equipaggio?`,
      passi: [
        R`Dati: $L_0 = 4{,}8$ anni luce, $v = 0{,}96 \cdot c$. Cerco il tempo $\Delta t$ per la Terra, il tempo $\Delta t_0$ di bordo e la distanza $L$ per l'equipaggio.`,
        R`Per la Terra è un moto uniforme. Un anno luce è la strada della luce in un anno: a $0{,}96 \cdot c$ servono $\Delta t = \dfrac{4{,}8}{0{,}96}\,\text{anni} = 5\,\text{anni}$.`,
        R`Partenza e arrivo accadono nello stesso punto dell'astronave: il tempo proprio è quello di bordo. Con $\dfrac{v^2}{c^2} = 0{,}9216$ si ha $\sqrt{1 - 0{,}9216} = 0{,}28$, quindi $\gamma = \dfrac{1}{0{,}28} \approx 3{,}57$.`,
        R`Tempo di bordo: $\Delta t_0 = \dfrac{\Delta t}{\gamma} = 5\,\text{anni} \cdot 0{,}28 = 1{,}4\,\text{anni}$.`,
        R`Per l'equipaggio è la strada a muoversi, e si accorcia: $L = \dfrac{L_0}{\gamma} = 4{,}8\,\text{anni luce} \cdot 0{,}28 \approx 1{,}34\,\text{anni luce}$.`,
        R`Controllo dal punto di vista dell'equipaggio: $\dfrac{1{,}344\,\text{anni luce}}{0{,}96 \cdot c} = 1{,}4\,\text{anni}$. Le due spiegazioni danno lo stesso tempo di bordo.`
      ],
      risultato: R`$5\,\text{anni}$ per la Terra, $1{,}4\,\text{anni}$ per l'equipaggio, che vede la strada lunga circa $1{,}34$ anni luce.`
    },
    {
      titolo: 'La sonda lanciata dall\'astronave',
      problema: R`Un'astronave si allontana dalla Terra a $0{,}5 \cdot c$. Lancia in avanti una sonda, che rispetto all'astronave va a $0{,}5 \cdot c$. A che velocità va la sonda per la Terra?`,
      passi: [
        R`Dati: $v = 0{,}5 \cdot c$ (l'astronave rispetto alla Terra), $u' = 0{,}5 \cdot c$ (la sonda rispetto all'astronave), stesso verso. Cerco $u$.`,
        R`La somma di Galileo darebbe $u = c$: impossibile per un corpo con massa. Serve la formula relativistica.`,
        R`$u = \dfrac{u' + v}{1 + u' \cdot v / c^2} = \dfrac{0{,}5 \cdot c + 0{,}5 \cdot c}{1 + 0{,}5 \cdot 0{,}5}$.`,
        R`Faccio il conto: $u = \dfrac{c}{1{,}25} = 0{,}8 \cdot c = 2{,}4 \cdot 10^8\,\text{m/s}$.`,
        R`Controllo: il risultato è più grande di ciascuna delle due velocità, ma minore di $c$. Torna.`
      ],
      risultato: R`$u = 0{,}8 \cdot c = 2{,}4 \cdot 10^8\,\text{m/s}$`
    },
    {
      titolo: 'Un anno di centrale elettrica',
      problema: R`Una grande centrale fornisce 1 GW di potenza elettrica per un anno intero ($3{,}156 \cdot 10^7\,\text{s}$). A quanta massa corrisponde l'energia elettrica prodotta?`,
      passi: [
        R`Dati: $P = 1\,\text{GW} = 10^9\,\text{W}$, $\Delta t = 3{,}156 \cdot 10^7\,\text{s}$. Cerco la massa $m$ equivalente all'energia.`,
        R`L'energia prodotta: $E = P \cdot \Delta t = 10^9\,\text{W} \cdot 3{,}156 \cdot 10^7\,\text{s} = 3{,}156 \cdot 10^{16}\,\text{J}$.`,
        R`Dalla relazione fra massa ed energia: $m = \dfrac{E}{c^2} = \dfrac{3{,}156 \cdot 10^{16}\,\text{J}}{9 \cdot 10^{16}\,\text{m}^2/\text{s}^2}$.`,
        R`Faccio il conto: $m \approx 0{,}35\,\text{kg}$. Un joule è un $\text{kg} \cdot \text{m}^2/\text{s}^2$: diviso per $\text{m}^2/\text{s}^2$ restano i chilogrammi.`,
        R`Controllo con l'ordine di grandezza: $9 \cdot 10^{16}\,\text{J}$ sarebbero 1 kg; qui c'è circa un terzo di quell'energia. Torna.`
      ],
      risultato: R`Circa $0{,}35\,\text{kg}$: l'energia elettrica di un anno ha la massa di un barattolo di marmellata.`
    },
    {
      titolo: 'Un protone molto veloce',
      problema: R`In un acceleratore un protone ($m = 1{,}67 \cdot 10^{-27}\,\text{kg}$) ha un'energia cinetica pari al doppio della sua energia a riposo. Quanto valgono $\gamma$, la velocità e la quantità di moto?`,
      passi: [
        R`Dati: $m = 1{,}67 \cdot 10^{-27}\,\text{kg}$, $E_c = 2 \cdot m \cdot c^2$. Cerco $\gamma$, $v$ e $p$.`,
        R`Da $E_c = (\gamma - 1) \cdot m \cdot c^2 = 2 \cdot m \cdot c^2$ ricavo $\gamma - 1 = 2$, cioè $\gamma = 3$.`,
        R`La velocità: $1 - \dfrac{v^2}{c^2} = \dfrac{1}{9}$, quindi $v = c \cdot \sqrt{\tfrac{8}{9}} \approx 0{,}943 \cdot c \approx 2{,}83 \cdot 10^8\,\text{m/s}$.`,
        R`La quantità di moto: $p = \gamma \cdot m \cdot v = 3 \cdot 1{,}67 \cdot 10^{-27}\,\text{kg} \cdot 2{,}83 \cdot 10^8\,\text{m/s} \approx 1{,}42 \cdot 10^{-18}\,\text{kg} \cdot \text{m/s}$.`,
        R`Controllo con $E^2 = (p \cdot c)^2 + (m \cdot c^2)^2$: con $E = 3 \cdot m \cdot c^2$ si ha $p \cdot c = \sqrt{9 - 1} \cdot m \cdot c^2 \approx 2{,}83 \cdot m \cdot c^2$.`, R`Quindi $p \approx 2{,}83 \cdot 1{,}67 \cdot 10^{-27}\,\text{kg} \cdot 3 \cdot 10^8\,\text{m/s} \approx 1{,}42 \cdot 10^{-18}\,\text{kg} \cdot \text{m/s}$. Torna. Con Newton, $m \cdot v$, verrebbe tre volte meno.`
      ],
      risultato: R`$\gamma = 3$, $v \approx 0{,}943 \cdot c$, $p \approx 1{,}42 \cdot 10^{-18}\,\text{kg} \cdot \text{m/s}$`
    }
  ],
  formulario: [
    { nome: 'Somma delle velocità di Galileo', formula: R`u = u' + v`, nota: R`Vale solo per velocità molto minori di $c$. $u'$ è misurata nel sistema che va a velocità $v$.` },
    { nome: 'Velocità della luce nel vuoto', formula: R`c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}} \approx 3 \cdot 10^8\,\text{m/s}`, nota: R`La stessa in tutti i sistemi inerziali: è il secondo postulato.` },
    { nome: 'Fattore di Lorentz', formula: R`\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}`, nota: R`Numero puro, sempre maggiore o uguale a 1. Vale 1,25 a $0{,}6 \cdot c$.` },
    { nome: 'Dilatazione del tempo', formula: R`\Delta t = \gamma \cdot \Delta t_0`, nota: R`$\Delta t_0$ è il tempo proprio, misurato dall'orologio presente ai due eventi: è il più breve.` },
    { nome: 'Contrazione delle lunghezze', formula: R`L = \dfrac{L_0}{\gamma}`, nota: R`$L_0$ è la lunghezza propria, misurata da fermi: è la più lunga. Solo lungo il moto.` },
    { nome: 'Trasformazioni di Lorentz: lo spazio', formula: R`x' = \gamma \cdot (x - v \cdot t) \qquad y' = y`, nota: R`Il sistema con l'apice va a velocità $v$ lungo x. Anche $z' = z$.` },
    { nome: 'Trasformazioni di Lorentz: il tempo', formula: R`t' = \gamma \cdot \left(t - \dfrac{v \cdot x}{c^2}\right)`, nota: R`Il tempo dipende anche dalla posizione: è la relatività della simultaneità.` },
    { nome: 'Composizione relativistica delle velocità', formula: R`u = \dfrac{u' + v}{1 + u' \cdot v / c^2}`, nota: R`Con velocità minori di $c$ il risultato resta minore di $c$; con $u' = c$ dà $c$.` },
    { nome: 'Energia a riposo', formula: R`E_0 = m \cdot c^2`, nota: R`Un grammo vale $9 \cdot 10^{13}\,\text{J}$. Una variazione di energia cambia la massa: $\Delta m = \Delta E / c^2$.` },
    { nome: 'Energia totale', formula: R`E = \gamma \cdot m \cdot c^2`, nota: R`Cresce senza limite quando $v$ si avvicina a $c$.` },
    { nome: 'Energia cinetica relativistica', formula: R`E_c = (\gamma - 1) \cdot m \cdot c^2`, nota: R`Alle velocità piccole ridà $\tfrac{1}{2} \cdot m \cdot v^2$.` },
    { nome: 'Quantità di moto relativistica', formula: R`p = \gamma \cdot m \cdot v`, nota: R`In $\text{kg} \cdot \text{m/s}$. Alle velocità piccole ridà $m \cdot v$.` },
    { nome: 'Energia e quantità di moto', formula: R`E^2 = (p \cdot c)^2 + (m \cdot c^2)^2`, nota: R`Da fermo ($p = 0$) ridà $E_0 = m \cdot c^2$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'postulati', tipo: 'definizione', fronte: R`Che cos'è un **sistema di riferimento inerziale**?`, retro: R`Un sistema in cui vale il principio d'inerzia. Due sistemi inerziali sono fermi o in moto rettilineo uniforme l'uno rispetto all'altro.` },
    { id: 'fc-02', sezione: 'postulati', tipo: 'concetto', fronte: R`Il **primo postulato** di Einstein`, retro: R`Le leggi della fisica, meccanica ed elettromagnetismo compresi, sono le stesse in tutti i sistemi inerziali.` },
    { id: 'fc-03', sezione: 'postulati', tipo: 'concetto', fronte: R`Il **secondo postulato** di Einstein`, retro: R`La luce nel vuoto ha la stessa velocità $c$ in tutti i sistemi inerziali, qualunque sia il moto della sorgente o di chi la misura.` },
    { id: 'fc-04', sezione: 'postulati', tipo: 'concetto', fronte: R`Che cosa trovarono **Michelson e Morley** nel 1887?`, retro: R`Nessuna differenza nella velocità della luce lungo direzioni diverse rispetto al moto della Terra: nessuna traccia dell'etere.` },
    { id: 'fc-05', sezione: 'simultaneita', tipo: 'definizione', fronte: R`Che cos'è un **evento**?`, retro: R`Un fatto che accade in un luogo preciso e in un istante preciso, come lo scoppio di un lampo.` },
    { id: 'fc-06', sezione: 'simultaneita', tipo: 'concetto', fronte: R`Che cosa dice la **relatività della simultaneità**?`, retro: R`Due eventi in luoghi diversi, simultanei in un sistema inerziale, non lo sono in un altro sistema in moto rispetto al primo.` },
    { id: 'fc-07', sezione: 'dilatazione', tipo: 'definizione', fronte: R`Che cos'è il **tempo proprio**?`, retro: R`L'intervallo misurato da un orologio fermo rispetto ai due eventi, cioè presente a tutti e due. È il più breve.` },
    { id: 'fc-08', sezione: 'dilatazione', tipo: 'formula', fronte: R`Formula della **dilatazione del tempo**`, retro: R`$\Delta t = \gamma \cdot \Delta t_0$, con $\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$.` },
    { id: 'fc-09', sezione: 'dilatazione', tipo: 'concetto', fronte: R`Quanto vale il **fattore di Lorentz** alle velocità di tutti i giorni? E vicino a $c$?`, retro: R`Praticamente 1: per un aereo differisce da 1 meno di un miliardesimo. Vicino a $c$ cresce senza limite.` },
    { id: 'fc-10', sezione: 'dilatazione', tipo: 'concetto', fronte: R`Perché il **paradosso dei gemelli** non è una contraddizione?`, retro: R`La situazione non è simmetrica: il gemello che viaggia inverte la rotta e cambia sistema inerziale. Al ritorno è lui il più giovane.` },
    { id: 'fc-11', sezione: 'contrazione', tipo: 'formula', fronte: R`Formula della **contrazione delle lunghezze**`, retro: R`$L = \dfrac{L_0}{\gamma}$, con $L_0$ lunghezza propria, misurata da chi è fermo rispetto all'oggetto.` },
    { id: 'fc-12', sezione: 'contrazione', tipo: 'concetto', fronte: R`In quale direzione si accorcia un corpo in moto?`, retro: R`Solo nella direzione del moto. Le dimensioni perpendicolari restano uguali.` },
    { id: 'fc-13', sezione: 'contrazione', tipo: 'concetto', fronte: R`Perché i **muoni** dei raggi cosmici arrivano a terra?`, retro: R`Per noi il loro tempo rallenta di $\gamma$ volte; per loro i 15 km di atmosfera si accorciano di $\gamma$ volte. Due punti di vista, stesso risultato.` },
    { id: 'fc-14', sezione: 'lorentz', tipo: 'formula', fronte: R`Le **trasformazioni di Lorentz**`, retro: R`$x' = \gamma \cdot (x - v \cdot t)$, $t' = \gamma \cdot (t - v \cdot x / c^2)$, $y' = y$, $z' = z$.` },
    { id: 'fc-15', sezione: 'lorentz', tipo: 'formula', fronte: R`La **composizione relativistica** delle velocità`, retro: R`$u = \dfrac{u' + v}{1 + u' \cdot v / c^2}$. Con velocità minori di $c$ dà sempre meno di $c$.` },
    { id: 'fc-16', sezione: 'lorentz', tipo: 'concetto', fronte: R`Che cosa diventano le trasformazioni di Lorentz quando $v$ è molto minore di $c$?`, retro: R`Le trasformazioni di Galileo: $\gamma \approx 1$ e il termine $v \cdot x / c^2$ è trascurabile.` },
    { id: 'fc-17', sezione: 'massa-energia', tipo: 'formula', fronte: R`L'**energia a riposo** di un corpo di massa $m$`, retro: R`$E_0 = m \cdot c^2$. Un grammo di massa vale circa $9 \cdot 10^{13}\,\text{J}$.` },
    { id: 'fc-18', sezione: 'massa-energia', tipo: 'formula', fronte: R`**Energia totale** ed **energia cinetica** relativistiche`, retro: R`$E = \gamma \cdot m \cdot c^2$ ed $E_c = (\gamma - 1) \cdot m \cdot c^2$.` },
    { id: 'fc-19', sezione: 'massa-energia', tipo: 'formula', fronte: R`La **quantità di moto relativistica**`, retro: R`$p = \gamma \cdot m \cdot v$, in $\text{kg} \cdot \text{m/s}$. Alle velocità piccole ridà $m \cdot v$.` },
    { id: 'fc-20', sezione: 'massa-energia', tipo: 'concetto', fronte: R`Perché un corpo con massa non può raggiungere la velocità della luce?`, retro: R`Perché la sua energia, $\gamma \cdot m \cdot c^2$, cresce senza limite quando $v$ si avvicina a $c$: servirebbe un'energia infinita.` },
    { id: 'fc-21', sezione: 'massa-energia', tipo: 'concetto', fronte: R`Perché il Sole perde massa?`, retro: R`Irraggia energia: la sua massa cala di $\Delta m = \Delta E / c^2$, circa 4 milioni di tonnellate al secondo.` },
    { id: 'fc-22', sezione: 'problemi', tipo: 'procedura', fronte: R`Come si riconosce il **tempo proprio** in un problema?`, retro: R`È quello dell'orologio presente a tutti e due gli eventi. Il tempo misurato da ogni altro sistema è più lungo.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una sonda si allontana dalla Terra a $0{,}4 \cdot c$. Quando è a 900 000 km dalla Terra (misurati dalla Terra) manda un segnale di luce verso casa. Dopo quanti secondi arriva il segnale?`, suggerimenti: [R`Il secondo postulato vale qualunque sia il moto della sorgente: il segnale va a $c = 300\,000\,\text{km/s}$.`], risposta: { tipo: 'numero', valore: 3, unita: 's' }, soluzione: [R`Per il secondo postulato la luce va a $c$ anche se la sonda si allontana.`, R`$\Delta t = \dfrac{900\,000\,\text{km}}{300\,000\,\text{km/s}} = 3\,\text{s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Quanto vale il fattore di Lorentz $\gamma$ per un corpo che va a $0{,}8 \cdot c$?`, suggerimenti: [R`$\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$, con $v^2/c^2 = 0{,}8^2$.`], risposta: { tipo: 'numero', valore: 1.667, tolleranza: 0.035, segnaposto: 'Un numero (es. 1,2)' }, soluzione: [R`$\dfrac{v^2}{c^2} = 0{,}64$, quindi $\sqrt{1 - 0{,}64} = \sqrt{0{,}36} = 0{,}6$.`, R`$\gamma = \dfrac{1}{0{,}6} \approx 1{,}67$: un numero puro, senza unità.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un'astronave va così veloce che $\gamma = 2$. A bordo passano 3 ore. Quanto dura quell'intervallo per chi sta sulla Terra?`, suggerimenti: [R`Le 3 ore di bordo sono il tempo proprio.`, R`$\Delta t = \gamma \cdot \Delta t_0$.`], risposta: { tipo: 'numero', valore: 6, unita: 'h' }, soluzione: [R`$\Delta t = \gamma \cdot \Delta t_0 = 2 \cdot 3\,\text{h} = 6\,\text{h}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un pione è una particella che, da ferma, vive in media 26 ns. In un fascio i pioni hanno $\gamma = 4$. Quanto vivono in media, misurati nel laboratorio?`, suggerimenti: [R`I 26 ns sono il tempo proprio: misurati da un orologio che viaggia con il pione.`], risposta: { tipo: 'numero', valore: 104, unita: 'ns' }, soluzione: [R`$\Delta t = \gamma \cdot \Delta t_0 = 4 \cdot 26\,\text{ns} = 104\,\text{ns}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un'astronave è lunga 60 m da ferma. Passa davanti alla Terra con $\gamma = 1{,}5$. Quanto è lunga per chi la misura dalla Terra?`, suggerimenti: [R`$L = \dfrac{L_0}{\gamma}$.`], risposta: { tipo: 'numero', valore: 40, unita: 'm' }, soluzione: [R`$L = \dfrac{60\,\text{m}}{1{,}5} = 40\,\text{m}$: più corta, nella direzione del moto.`] },
    { id: 'b-06', livello: 'base', difficolta: 2, testo: R`Un'asta lunga 30 m da ferma vola a $0{,}8 \cdot c$ nella direzione della sua lunghezza. Quanto è lunga per chi la vede passare?`, suggerimenti: [R`$\dfrac{L}{L_0} = \sqrt{1 - v^2/c^2}$.`, R`$\sqrt{1 - 0{,}64} = 0{,}6$.`], risposta: { tipo: 'numero', valore: 18, unita: 'm' }, soluzione: [R`$\sqrt{1 - 0{,}8^2} = \sqrt{0{,}36} = 0{,}6$.`, R`$L = L_0 \cdot \sqrt{1 - v^2/c^2} = 30\,\text{m} \cdot 0{,}6 = 18\,\text{m}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Per chi resta sulla Terra un viaggio dura 10 anni. L'astronave va con $\gamma = 5$. Quanti anni passano per l'equipaggio?`, suggerimenti: [R`Il tempo di bordo è il tempo proprio: è il più breve.`], risposta: { tipo: 'numero', valore: 2, unita: 'a' }, soluzione: [R`$\Delta t_0 = \dfrac{\Delta t}{\gamma} = \dfrac{10\,\text{anni}}{5} = 2\,\text{anni}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un'astronave va a $0{,}4 \cdot c$ e lancia in avanti una sonda a $0{,}4 \cdot c$ rispetto a sé. Quanto vale la velocità della sonda per la Terra? Scrivi il risultato come multiplo di $c$.`, suggerimenti: [R`$u = \dfrac{u' + v}{1 + u' \cdot v / c^2}$.`, R`Sopra $0{,}8 \cdot c$, sotto $1 + 0{,}16$.`], risposta: { tipo: 'numero', valore: 0.69, tolleranza: 0.011, suffisso: 'c', segnaposto: 'Un numero (es. 0,5)' }, soluzione: [R`$u = \dfrac{0{,}4 \cdot c + 0{,}4 \cdot c}{1 + 0{,}4 \cdot 0{,}4} = \dfrac{0{,}8}{1{,}16} \cdot c \approx 0{,}69 \cdot c$.`, R`Meno della somma di Galileo, $0{,}8 \cdot c$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`A quanti chilogrammi di massa corrisponde un'energia di $4{,}5 \cdot 10^{16}\,\text{J}$? (Usa $c = 3 \cdot 10^8\,\text{m/s}$.)`, suggerimenti: [R`$m = \dfrac{E}{c^2}$, con $c^2 = 9 \cdot 10^{16}\,\text{m}^2/\text{s}^2$.`], risposta: { tipo: 'numero', valore: 0.5, unita: 'kg' }, soluzione: [R`$m = \dfrac{4{,}5 \cdot 10^{16}\,\text{J}}{9 \cdot 10^{16}\,\text{m}^2/\text{s}^2} = 0{,}5\,\text{kg}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 2, testo: R`Una pila si scarica e fornisce in tutto 18 000 J di energia. Di quanto cala la sua massa?`, suggerimenti: [R`$\Delta m = \dfrac{\Delta E}{c^2}$.`], risposta: { tipo: 'numero', valore: 2e-13, unita: 'kg' }, soluzione: [R`$\Delta m = \dfrac{18\,000\,\text{J}}{9 \cdot 10^{16}\,\text{m}^2/\text{s}^2} = 2 \cdot 10^{-13}\,\text{kg}$.`, R`Due decimi di miliardesimo di grammo: nessuna bilancia lo vede.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`L'energia a riposo di un elettrone è 0,511 MeV. Quanto vale la sua energia cinetica quando $\gamma = 4$?`, suggerimenti: [R`$E_c = (\gamma - 1) \cdot m \cdot c^2$.`], risposta: { tipo: 'numero', valore: 1.533, unita: 'MeV' }, soluzione: [R`$E_c = (4 - 1) \cdot 0{,}511\,\text{MeV} = 1{,}533\,\text{MeV}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`In un orologio a luce i due specchi distano 1,5 m. Quanti nanosecondi dura un tic (andata e ritorno della luce), per chi è fermo rispetto all'orologio?`, suggerimenti: [R`$\Delta t_0 = \dfrac{2 \cdot d}{c}$.`], risposta: { tipo: 'numero', valore: 10, unita: 'ns' }, soluzione: [R`$\Delta t_0 = \dfrac{2 \cdot 1{,}5\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 10^{-8}\,\text{s} = 10\,\text{ns}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Un orologio vola a $0{,}8 \cdot c$ e segna un intervallo di 18 s. Quanto dura quell'intervallo per chi vede passare l'orologio?`, suggerimenti: [R`A $0{,}8 \cdot c$ vale $\gamma = \dfrac{1}{0{,}6}$.`], risposta: { tipo: 'numero', valore: 30, unita: 's' }, soluzione: [R`$\gamma = \dfrac{1}{\sqrt{1 - 0{,}64}} = \dfrac{1}{0{,}6}$.`, R`$\Delta t = \gamma \cdot \Delta t_0 = \dfrac{18\,\text{s}}{0{,}6} = 30\,\text{s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Sulla Terra passano 24 minuti, sull'astronave solo 8. Quanto vale $\gamma$?`, suggerimenti: [R`$\gamma = \dfrac{\Delta t}{\Delta t_0}$: il tempo proprio è quello di bordo.`], risposta: { tipo: 'numero', valore: 3, segnaposto: 'Un numero (es. 1,2)' }, soluzione: [R`$\gamma = \dfrac{24\,\text{min}}{8\,\text{min}} = 3$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Quanti chilometri percorre la luce, nel vuoto, in un millesimo di secondo?`, suggerimenti: [R`$c = 300\,000\,\text{km/s}$.`], risposta: { tipo: 'numero', valore: 300, unita: 'km' }, soluzione: [R`$\Delta s = c \cdot \Delta t = 300\,000\,\text{km/s} \cdot 0{,}001\,\text{s} = 300\,\text{km}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una stella dista 12 anni luce. Un'astronave ci va a $0{,}8 \cdot c$. Quanti anni dura il viaggio per chi resta sulla Terra?`, suggerimenti: [R`Un anno luce è la strada che la luce fa in un anno.`], risposta: { tipo: 'numero', valore: 15, unita: 'a' }, soluzione: [R`$\Delta t = \dfrac{12\,\text{anni luce}}{0{,}8 \cdot c} = \dfrac{12}{0{,}8}\,\text{anni} = 15\,\text{anni}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una stella dista 12 anni luce e un'astronave ci va a $0{,}8 \cdot c$: per la Terra il viaggio dura 15 anni. Quanti anni passano per l'equipaggio?`, suggerimenti: [R`Il tempo di bordo è il tempo proprio: $\Delta t_0 = \dfrac{\Delta t}{\gamma}$.`, R`A $0{,}8 \cdot c$ vale $\dfrac{1}{\gamma} = 0{,}6$.`], risposta: { tipo: 'numero', valore: 9, unita: 'a' }, soluzione: [R`$\Delta t_0 = 15\,\text{anni} \cdot 0{,}6 = 9\,\text{anni}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Una stella dista 12 anni luce dalla Terra. Quanto è lunga la strada per l'equipaggio di un'astronave che ci va a $0{,}8 \cdot c$?`, suggerimenti: [R`Per l'equipaggio la distanza fra Terra e stella si muove: si accorcia.`], risposta: { tipo: 'numero', valore: 7.2, unita: 'ly' }, soluzione: [R`$L = \dfrac{L_0}{\gamma} = 12\,\text{anni luce} \cdot 0{,}6 = 7{,}2\,\text{anni luce}$.`, R`Controllo: $7{,}2 / 0{,}8 = 9$ anni, come il tempo di bordo.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`L'energia a riposo di un protone è 938 MeV. Quanto vale la sua energia cinetica quando $\gamma = 1{,}5$?`, suggerimenti: [R`$E_c = (\gamma - 1) \cdot m \cdot c^2$.`], risposta: { tipo: 'numero', valore: 469, unita: 'MeV' }, soluzione: [R`$E_c = (1{,}5 - 1) \cdot 938\,\text{MeV} = 0{,}5 \cdot 938\,\text{MeV} = 469\,\text{MeV}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un elettrone (energia a riposo 0,511 MeV) ha un'energia totale di 2,555 MeV. Quanto vale $\gamma$?`, suggerimenti: [R`$E = \gamma \cdot m \cdot c^2$, quindi $\gamma = \dfrac{E}{E_0}$.`], risposta: { tipo: 'numero', valore: 5, segnaposto: 'Un numero (es. 1,2)' }, soluzione: [R`$\gamma = \dfrac{2{,}555\,\text{MeV}}{0{,}511\,\text{MeV}} = 5$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`I pioni vivono in media 26 ns da fermi. In un acceleratore vanno a $0{,}995 \cdot c$. Quanti metri percorrono in media nel laboratorio prima di decadere?`, suggerimenti: [R`Calcola $\gamma$: con $0{,}995^2 = 0{,}990$ viene circa 10.`, R`Nel laboratorio la vita media è $\gamma$ volte più lunga; poi spazio = velocità per tempo.`], risposta: { tipo: 'numero', valore: 78, unita: 'm', tolleranza: 1.5 }, soluzione: [R`$\gamma = \dfrac{1}{\sqrt{1 - 0{,}995^2}} \approx 10{,}0$.`, R`Vita media nel laboratorio: $10{,}0 \cdot 26\,\text{ns} \approx 260\,\text{ns}$.`, R`Distanza: $0{,}995 \cdot 3 \cdot 10^8\,\text{m/s} \cdot 2{,}6 \cdot 10^{-7}\,\text{s} \approx 78\,\text{m}$. Senza relatività sarebbero meno di 8 m.`] },
    { id: 'es-02', difficolta: 3, testo: R`Una stella dista 40 anni luce. L'equipaggio vuole arrivarci in 9 anni del proprio tempo. A che velocità deve andare? Scrivi il risultato come multiplo di $c$.`, suggerimenti: [R`Per l'equipaggio la distanza è $L_0 / \gamma$, e la percorre in 9 anni.`, R`Ne viene $\dfrac{v}{c} \cdot 9 = 40 \cdot \sqrt{1 - v^2/c^2}$ (anni e anni luce). Eleva al quadrato.`], risposta: { tipo: 'numero', valore: 0.976, tolleranza: 0.005, suffisso: 'c', segnaposto: 'Un numero (es. 0,5)' }, soluzione: [R`Chiamo $x = v/c$. Per l'equipaggio la strada è $40 \cdot \sqrt{1 - x^2}$ anni luce e dura 9 anni: $x \cdot 9 = 40 \cdot \sqrt{1 - x^2}$.`, R`Elevo al quadrato: $81 \cdot x^2 = 1600 \cdot (1 - x^2)$, quindi $1681 \cdot x^2 = 1600$.`, R`$x = \dfrac{40}{41} \approx 0{,}976$. Per la Terra il viaggio dura $40 / 0{,}976 = 41$ anni.`] },
    { id: 'es-03', difficolta: 2, testo: R`Due astronavi si vengono incontro, ciascuna a $0{,}75 \cdot c$ rispetto alla Terra. A che velocità si avvicina l'una, vista dall'altra? Scrivi il risultato come multiplo di $c$.`, suggerimenti: [R`Mettiti sulla prima astronave: la Terra le corre incontro a $0{,}75 \cdot c$, e la seconda astronave va a $0{,}75 \cdot c$ rispetto alla Terra.`, R`$u = \dfrac{u' + v}{1 + u' \cdot v / c^2}$ con $u' = v = 0{,}75 \cdot c$.`], risposta: { tipo: 'numero', valore: 0.96, suffisso: 'c', segnaposto: 'Un numero (es. 0,5)' }, soluzione: [R`$u = \dfrac{0{,}75 + 0{,}75}{1 + 0{,}75^2} \cdot c = \dfrac{1{,}5}{1{,}5625} \cdot c = 0{,}96 \cdot c$.`, R`Galileo avrebbe dato $1{,}5 \cdot c$: impossibile.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un elettrone (energia a riposo 0,511 MeV) parte da fermo e viene accelerato da una tensione di 1 MV, cioè acquista 1 MeV di energia cinetica. A che velocità arriva? Scrivi il risultato come multiplo di $c$.`, suggerimenti: [R`$E_c = (\gamma - 1) \cdot m \cdot c^2$: ricava $\gamma$.`, R`Poi $\dfrac{v}{c} = \sqrt{1 - 1/\gamma^2}$.`], risposta: { tipo: 'numero', valore: 0.941, tolleranza: 0.005, suffisso: 'c', segnaposto: 'Un numero (es. 0,5)' }, soluzione: [R`$\gamma = 1 + \dfrac{1\,\text{MeV}}{0{,}511\,\text{MeV}} \approx 2{,}96$.`, R`$\dfrac{v}{c} = \sqrt{1 - \dfrac{1}{2{,}96^2}} \approx \sqrt{0{,}886} \approx 0{,}941$.`, R`Con $\tfrac{1}{2} \cdot m \cdot v^2$ sarebbe venuto $v \approx 2 \cdot c$: impossibile. Qui la formula di Newton non vale più.`] },
    { id: 'es-05', difficolta: 2, testo: R`Quanto vale la quantità di moto di un protone ($m = 1{,}67 \cdot 10^{-27}\,\text{kg}$) che va a $0{,}8 \cdot c$? Poi confrontala con quella che darebbe la formula di Newton.`, suggerimenti: [R`$p = \gamma \cdot m \cdot v$, con $\gamma = \dfrac{5}{3}$ a $0{,}8 \cdot c$.`], risposta: { tipo: 'numero', valore: 6.68e-19, unita: 'kg·m/s' }, soluzione: [R`$v = 0{,}8 \cdot 3 \cdot 10^8\,\text{m/s} = 2{,}4 \cdot 10^8\,\text{m/s}$; $\gamma = \dfrac{1}{0{,}6} \approx 1{,}667$.`, R`$p = 1{,}667 \cdot 1{,}67 \cdot 10^{-27}\,\text{kg} \cdot 2{,}4 \cdot 10^8\,\text{m/s} \approx 6{,}7 \cdot 10^{-19}\,\text{kg} \cdot \text{m/s}$.`, R`Con Newton: $m \cdot v \approx 4{,}0 \cdot 10^{-19}\,\text{kg} \cdot \text{m/s}$, il 40% in meno.`] },
    { id: 'es-06', difficolta: 2, testo: R`Quando l'idrogeno si fonde in elio, circa lo 0,7% della massa diventa energia. Quanta energia libera la fusione di 1 kg di idrogeno?`, suggerimenti: [R`La massa che sparisce è lo 0,7% di 1 kg.`, R`$\Delta E = \Delta m \cdot c^2$.`], risposta: { tipo: 'numero', valore: 6.3e14, unita: 'J' }, soluzione: [R`$\Delta m = 0{,}007 \cdot 1\,\text{kg} = 0{,}007\,\text{kg}$.`, R`$\Delta E = 0{,}007\,\text{kg} \cdot 9 \cdot 10^{16}\,\text{m}^2/\text{s}^2 = 6{,}3 \cdot 10^{14}\,\text{J}$.`, R`È la stessa percentuale del Sole: su 600 milioni di tonnellate di idrogeno al secondo, ne spariscono circa 4 milioni.`] },
    { id: 'es-07', difficolta: 3, testo: R`Per chi sta a terra due lampi scoppiano nello stesso istante, a 900 m di distanza l'uno dall'altro lungo i binari. Un treno corre lungo i binari a $0{,}8 \cdot c$. Per il treno, quanto tempo separa i due lampi?`, suggerimenti: [R`Dalla trasformazione di Lorentz del tempo, con $\Delta t = 0$: $\Delta t' = -\gamma \cdot v \cdot \Delta x / c^2$.`, R`Calcola il valore assoluto, con $\gamma = \dfrac{5}{3}$.`], risposta: { tipo: 'numero', valore: 4, unita: 'μs' }, soluzione: [R`$|\Delta t'| = \gamma \cdot \dfrac{v \cdot \Delta x}{c^2} = \dfrac{5}{3} \cdot \dfrac{0{,}8 \cdot 900\,\text{m}}{3 \cdot 10^8\,\text{m/s}}$ (con $v = 0{,}8 \cdot c$ si semplifica una $c$).`, R`$|\Delta t'| = \dfrac{5}{3} \cdot 2{,}4 \cdot 10^{-6}\,\text{s} = 4 \cdot 10^{-6}\,\text{s} = 4\,\mu\text{s}$.`, R`Per il treno scoppia prima il lampo verso cui corre.`] },
    { id: 'es-08', difficolta: 3, testo: R`Due gemelli hanno 20 anni. Uno parte verso una stella a 6 anni luce, a $0{,}923 \cdot c$ (circa $\tfrac{12}{13}$ di $c$), e torna subito indietro. Al ritorno, di quanti anni è più giovane del fratello?`, suggerimenti: [R`Per la Terra andata e ritorno sono 12 anni luce a $0{,}923 \cdot c$.`, R`A $\tfrac{12}{13}$ di $c$ vale $\gamma = \tfrac{13}{5} = 2{,}6$.`], risposta: { tipo: 'numero', valore: 8, unita: 'a', tolleranza: 0.1 }, soluzione: [R`Per la Terra: $\dfrac{12}{0{,}923}\,\text{anni} \approx 13\,\text{anni}$.`, R`$\sqrt{1 - (12/13)^2} = \dfrac{5}{13}$, quindi $\gamma = 2{,}6$. Per il viaggiatore: $\dfrac{13}{2{,}6} = 5\,\text{anni}$.`, R`Il viaggiatore torna a 25 anni, il fratello ne ha 33: è più giovane di 8 anni.`] },
    { id: 'es-09', difficolta: 2, testo: R`A che velocità deve andare un'astronave perché ogni anno di bordo corrisponda a 2 anni sulla Terra? Rispondi in m/s.`, suggerimenti: [R`Serve $\gamma = 2$.`, R`$1 - \dfrac{v^2}{c^2} = \dfrac{1}{4}$.`], risposta: { tipo: 'numero', valore: 2.6e8, unita: 'm/s' }, soluzione: [R`$\gamma = 2 \Rightarrow 1 - \dfrac{v^2}{c^2} = \dfrac{1}{4} \Rightarrow \dfrac{v^2}{c^2} = 0{,}75$.`, R`$v = \sqrt{0{,}75} \cdot c \approx 0{,}866 \cdot 3 \cdot 10^8\,\text{m/s} \approx 2{,}6 \cdot 10^8\,\text{m/s}$.`] },
    { id: 'es-10', difficolta: 3, testo: R`Quanto lavoro serve per portare un protone da fermo a $0{,}8 \cdot c$? L'energia a riposo del protone è 938 MeV. Rispondi in MeV.`, suggerimenti: [R`Il lavoro è uguale all'energia cinetica finale.`, R`$E_c = (\gamma - 1) \cdot m \cdot c^2$, con $\gamma = \dfrac{5}{3}$.`], risposta: { tipo: 'numero', valore: 625, unita: 'MeV' }, soluzione: [R`$\gamma - 1 = \dfrac{5}{3} - 1 = \dfrac{2}{3}$.`, R`$L = E_c = \dfrac{2}{3} \cdot 938\,\text{MeV} \approx 625\,\text{MeV}$.`, R`Con $\tfrac{1}{2} \cdot m \cdot v^2 = 0{,}32 \cdot 938\,\text{MeV} \approx 300\,\text{MeV}$ si sbaglierebbe di più della metà.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa dice il secondo postulato di Einstein?`, opzioni: [R`Le velocità si sommano sempre`, R`Nessun corpo può stare fermo`, R`La luce nel vuoto ha la stessa velocità in tutti i sistemi inerziali`, R`La luce va più veloce se la sorgente si avvicina`], corretta: 2, spiegazione: R`La velocità della luce nel vuoto è $c$ per tutti, qualunque sia il moto della sorgente o di chi la misura. Non dipende quindi da una sorgente che si avvicina, e la somma di Galileo non vale per la luce.` },
    { id: 'q-02', domanda: R`Che cosa trovarono Michelson e Morley nel 1887?`, opzioni: [R`Nessuna differenza nella velocità della luce lungo direzioni diverse`, R`Che la luce va più veloce nel verso del moto della Terra`, R`Il primo valore della velocità della luce`, R`La prova che l'etere esiste`], corretta: 0, spiegazione: R`Cercavano l'effetto del moto della Terra nell'etere e non trovarono nessuna differenza. La velocità della luce era già stata misurata prima, e l'etere non si mostrò.` },
    { id: 'q-03', domanda: R`Che cos'è il tempo proprio?`, opzioni: [R`Il tempo segnato da un orologio fermo sulla Terra`, R`Il più lungo dei tempi misurati da osservatori diversi`, R`Il tempo misurato con un orologio atomico`, R`Il tempo misurato da un orologio presente a tutti e due gli eventi`], corretta: 3, spiegazione: R`Il tempo proprio è quello dell'orologio fermo rispetto ai due eventi: è il più breve, non il più lungo. Non conta il tipo di orologio, e non è sempre quello della Terra.` },
    { id: 'q-04', domanda: R`Quanto vale il fattore di Lorentz $\gamma$ per un'auto in autostrada?`, opzioni: [R`Quasi zero`, R`Praticamente 1`, R`Circa 2`, R`È infinito`], corretta: 1, spiegazione: R`Con $v$ molto minore di $c$ il rapporto $v^2/c^2$ è minuscolo e $\gamma$ vale 1 con moltissime cifre. Non è mai minore di 1, e diventa grande solo vicino a $c$.` },
    { id: 'q-05', domanda: R`Un orologio vola veloce rispetto alla Terra. Come batte, visto dalla Terra?`, opzioni: [R`Più veloce`, R`Allo stesso ritmo`, R`Più lento`, R`Si ferma`], corretta: 2, spiegazione: R`È la dilatazione del tempo: $\Delta t = \gamma \cdot \Delta t_0$, con $\gamma$ maggiore di 1. L'orologio rallenta ma non si ferma, perché $\gamma$ è finito per ogni velocità minore di $c$.` },
    { id: 'q-06', domanda: R`Un'astronave passa veloce davanti alla Terra. Come cambiano le sue dimensioni, misurate dalla Terra?`, opzioni: [R`Si accorcia solo nella direzione del moto`, R`Si accorcia in tutte le direzioni`, R`Si accorcia solo in altezza`, R`Non cambia: è solo un'illusione`], corretta: 0, spiegazione: R`La contrazione $L = L_0 / \gamma$ riguarda solo la direzione del moto; le dimensioni perpendicolari restano uguali. Non è un'illusione: è il risultato della misura in quel sistema.` },
    { id: 'q-07', domanda: R`Perché molti muoni nati in alta atmosfera arrivano a terra?`, opzioni: [R`Perché vanno più veloci della luce`, R`Perché i raggi cosmici continuano a spingerli`, R`Perché vivono 2,2 μs anche per noi, e sono tantissimi`, R`Perché per noi il loro tempo rallenta`], corretta: 3, spiegazione: R`Vanno a $0{,}998 \cdot c$, quindi per noi vivono circa 16 volte di più: è la dilatazione del tempo. Non superano $c$, e in 2,2 μs farebbero solo 660 m.` },
    { id: 'q-08', domanda: R`Per Anna, a terra, due fulmini sono caduti insieme. Per Bruno, sul treno, è caduto prima uno dei due. Chi ha ragione?`, opzioni: [R`Anna, perché è ferma`, R`Tutti e due: la simultaneità dipende dal sistema di riferimento`, R`Bruno, perché si muove`, R`Nessuno: per tutti uno dei fulmini cade prima`], corretta: 1, spiegazione: R`Non esiste un sistema privilegiato: anche Bruno può considerarsi fermo. Due eventi lontani possono essere simultanei in un sistema e non in un altro.` },
    { id: 'q-09', domanda: R`Un'astronave si allontana dalla Terra a $0{,}7 \cdot c$ e accende un faro rivolto verso la Terra. A che velocità arriva la luce, misurata sulla Terra?`, opzioni: [R`$c$`, R`$0{,}3 \cdot c$`, R`$1{,}7 \cdot c$`, R`$0{,}7 \cdot c$`], corretta: 0, spiegazione: R`Per il secondo postulato la luce va a $c$ qualunque sia il moto della sorgente. Sottrarre o sommare le velocità è la regola di Galileo, che per la luce non vale.` },
    { id: 'q-10', domanda: R`Quanto vale l'energia a riposo di un corpo di 1 kg?`, opzioni: [R`$9\,\text{J}$`, R`$3 \cdot 10^8\,\text{J}$`, R`$9 \cdot 10^{16}\,\text{J}$`, R`Zero, perché è fermo`], corretta: 2, spiegazione: R`$E_0 = m \cdot c^2 = 1\,\text{kg} \cdot (3 \cdot 10^8\,\text{m/s})^2 = 9 \cdot 10^{16}\,\text{J}$. Anche fermo un corpo ha energia; dimenticare il quadrato di $c$ dà $3 \cdot 10^8$.` },
    { id: 'q-11', domanda: R`Per portare un corpo con massa fino alla velocità della luce servirebbe un'energia…`, opzioni: [R`uguale a $\tfrac{1}{2} \cdot m \cdot c^2$`, R`uguale a $m \cdot c^2$`, R`che dipende solo dal motore usato`, R`infinita`], corretta: 3, spiegazione: R`L'energia è $\gamma \cdot m \cdot c^2$, e $\gamma$ cresce senza limite quando $v$ si avvicina a $c$. La formula $\tfrac{1}{2} \cdot m \cdot v^2$ vale solo alle velocità piccole, e $m \cdot c^2$ è l'energia a riposo.` },
    { id: 'q-12', domanda: R`Che cosa diventano le trasformazioni di Lorentz quando la velocità è molto minore di $c$?`, opzioni: [R`Danno risultati opposti a quelli di Galileo`, R`Diventano le trasformazioni di Galileo`, R`Smettono di valere`, R`Danno tempi infiniti`], corretta: 1, spiegazione: R`Con $v$ molto minore di $c$, $\gamma \approx 1$ e il termine $v \cdot x / c^2$ è trascurabile: restano $x' = x - v \cdot t$ e $t' = t$. Valgono sempre, e alle velocità piccole coincidono con Galileo.` },
    { id: 'q-13', domanda: R`Un gemello fa un lungo viaggio a velocità vicina a $c$ e torna. Che cosa trova?`, opzioni: [R`È più giovane del fratello rimasto a terra`, R`Hanno la stessa età, perché il moto è relativo`, R`È più vecchio del fratello`, R`Dipende da chi guarda l'orologio`], corretta: 0, spiegazione: R`Il viaggiatore cambia sistema inerziale quando inverte la rotta, il fratello no: la situazione non è simmetrica. Il viaggiatore ha vissuto un tempo più breve, e tutti lo constatano quando si ritrovano.` },
    { id: 'q-14', domanda: R`Che cos'è la lunghezza propria di un oggetto?`, opzioni: [R`La più corta fra le lunghezze misurate`, R`Quella misurata dalla Terra`, R`Quella misurata da chi è fermo rispetto all'oggetto`, R`Quella misurata alla velocità della luce`], corretta: 2, spiegazione: R`La lunghezza propria $L_0$ si misura da fermi rispetto all'oggetto, ed è la più lunga: chi lo vede muoversi misura $L_0 / \gamma$. Non c'entra la Terra, e nessuno può viaggiare alla velocità della luce.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Il tempo proprio è il più **breve**, non il più lungo. Chi vede l'orologio muoversi misura sempre un tempo più lungo: $\Delta t = \gamma \cdot \Delta t_0$.` },
    { tipo: 'errore', testo: R`Se ti viene $\gamma$ minore di 1, hai invertito la frazione: $\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$ è sempre almeno 1.` },
    { tipo: 'errore', testo: R`La contrazione delle lunghezze vale solo nella direzione del moto. Un vagone in corsa diventa più corto, non più basso.` },
    { tipo: 'trucco', testo: R`Scrivi le velocità come frazione di $c$: a $0{,}6 \cdot c$ il rapporto $v^2/c^2$ è $0{,}36$, e la $c$ sparisce dai conti.` },
    { tipo: 'trucco', testo: R`Il triangolo rettangolo 3, 4, 5 dà conti puliti: con $v = 0{,}6 \cdot c$ la radice $\sqrt{1 - v^2/c^2}$ vale proprio $0{,}8$.` },
    { tipo: 'metodo', testo: R`Per trovare il tempo proprio chiediti: c'è un orologio presente a tutti e due gli eventi? Quello misura il tempo proprio.` },
    { tipo: 'trucco', testo: R`Con le stelle usa gli anni luce: una distanza in anni luce divisa per $v/c$ dà subito il tempo in anni misurato dalla Terra.` },
    { tipo: 'metodo', testo: R`Alla fine controlla: se $v$ è molto minore di $c$, le formule devono ridare quelle di Newton e di Galileo.` }
  ],
  aneddoti: [
    { fisico: 'Albert Einstein', anni: '1879–1955', titolo: 'Il problema risolto dopo una chiacchierata con Besso', testo: R`Nella primavera del 1905 Albert Einstein aveva ventisei anni. Lavorava all'ufficio brevetti di Berna, come esperto tecnico di terza classe. Da anni lo tormentava un problema: la meccanica di Newton e la luce di Maxwell non andavano d'accordo. Un giorno ne discusse a lungo con l'amico Michele Besso, un ingegnere, senza venirne a capo. Il giorno dopo tornò da lui e gli disse: «Grazie, ho risolto completamente il problema». La chiave era il tempo: due eventi simultanei per uno possono non esserlo per un altro. Il 30 giugno la rivista *Annalen der Physik* ricevette il suo articolo. Non citava nessun altro lavoro e ringraziava una sola persona: Besso. Einstein raccontò la storia in una conferenza a Kyoto, nel 1922.`, legame: R`L'articolo del 1905 è quello che introduce i due postulati e la relatività della simultaneità.` },
    { fisico: 'George FitzGerald', anni: '1851–1901', titolo: 'La lettera che quasi nessuno lesse', testo: R`Nel 1889 l'irlandese George FitzGerald insegnava fisica al Trinity College di Dublino. Il risultato di Michelson e Morley lo lasciava perplesso. Ebbe un'idea audace: forse i corpi in moto nell'etere si accorciano un poco, nella direzione del moto. Quel tanto che basta a nascondere ogni differenza nella velocità della luce. La scrisse in una breve lettera alla rivista americana *Science*. Poi non ci pensò più, e non sapeva nemmeno se fosse uscita. Nel 1892 l'olandese Hendrik Lorentz ebbe la stessa idea, da solo. Quando seppe di FitzGerald, gli scrisse. FitzGerald rispose che a Dublino, per quell'idea, lo avevano piuttosto preso in giro. La lettera del 1889 fu ritrovata solo nel 1967.`, legame: R`È la contrazione delle lunghezze: per FitzGerald e Lorentz un effetto dell'etere, per Einstein una conseguenza dei postulati.` },
    { fisico: 'Bruno Rossi', anni: '1905–1993', titolo: 'Da Arcetri ai muoni delle montagne del Colorado', testo: R`Bruno Rossi era nato a Venezia nel 1905. Nel 1930, a Firenze, nel laboratorio di Arcetri, inventò un circuito per i raggi cosmici. Contava solo le particelle che attraversavano insieme più contatori. Nel 1938 le leggi razziali gli tolsero la cattedra di Padova, perché era ebreo. Lasciò l'Italia con la moglie Nora e, dopo Copenaghen e Manchester, arrivò negli Stati Uniti. Fra il 1939 e il 1941, sulle montagne del Colorado, contò i muoni a quote diverse. Allora li chiamavano «mesotroni». Con David Hall trovò che i muoni più veloci vivono più a lungo, proprio come vuole la dilatazione del tempo. Più tardi lavorò a Los Alamos e fu fra i padri dell'astronomia a raggi X.`, legame: R`È una delle prime prove della dilatazione del tempo con le particelle, la stessa storia dei muoni del video.` },
    { fisico: 'Joseph Hafele', anni: '1933–2014', titolo: 'Gli orologi atomici in giro per il mondo', testo: R`Nell'ottobre del 1971 il fisico Joseph Hafele e l'astronomo Richard Keating presero dei normali voli di linea. Con loro viaggiavano quattro orologi atomici al cesio. Fecero il giro del mondo due volte: prima verso est, poi verso ovest. Al ritorno confrontarono gli orologi con quelli rimasti all'Osservatorio navale degli Stati Uniti, a Washington. Verso est gli orologi in volo avevano perso circa 59 miliardesimi di secondo. Verso ovest ne avevano guadagnati circa 273. La teoria prevedeva circa −40 e +275. Contano due effetti. Uno è la velocità rispetto al centro della Terra. Verso est l'aereo si somma alla rotazione terrestre e va più veloce degli orologi a terra: rallenta più di loro. Verso ovest va più piano di loro. L'altro è la quota: lassù la gravità è più debole e il tempo corre più svelto, come dice la relatività generale. L'esperimento costò circa 8000 dollari, quasi tutti di biglietti aerei.`, legame: R`La dilatazione del tempo misurata con orologi veri, su aerei veri: miliardesimi di secondo, ma misurabili.` }
  ]
});
})();
