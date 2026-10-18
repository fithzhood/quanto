/* Quanto — Quantità di moto e urti (meccanica, terzo anno).
   Quantità di moto, impulso, conservazione, rinculo e razzo, urti anelastici ed elastici, urti nel piano, centro di massa.
   Contratto in SCHEMA.md. Verifica: node strumenti/verifica-argomento.js argomenti/quantita-di-moto.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'quantita-di-moto',
  titolo: 'Quantità di moto e urti',
  introduzione: R`Fermare un camion che avanza piano può essere difficile quanto fermare un'auto lanciata. Conta la massa, e conta la velocità. La grandezza che le mette insieme si chiama **quantità di moto**.

Con la quantità di moto si capiscono cose di tutti i giorni. Perché l'airbag salva la vita? Perché un fucile dà un colpo sulla spalla? Come fa un razzo ad accelerare nel vuoto, dove non c'è niente da spingere? Che cosa succede quando due auto si scontrano e restano incastrate? La risposta è sempre la stessa legge: in un sistema isolato la quantità di moto totale non cambia.

Servono i tre principi della dinamica, soprattutto il terzo, e l'energia cinetica $E_c$. Serve anche saper sommare i vettori.`,
  inBreve: [
    R`La **quantità di moto** è massa per velocità, $\vec{p} = m \cdot \vec{v}$: un vettore con il verso della velocità, in $\text{kg} \cdot \text{m/s}$.`,
    R`L'**impulso** di una forza è forza per tempo, $I = F \cdot \Delta t$, ed è uguale alla variazione della quantità di moto. Fermarsi in più tempo vuol dire una forza media più piccola.`,
    R`In un **sistema isolato** la quantità di moto totale si conserva. Le forze interne la passano da un corpo all'altro, ma il totale resta lo stesso.`,
    R`In ogni urto si conserva la quantità di moto. L'energia cinetica si conserva solo negli urti **elastici**; quando i corpi restano attaccati se ne perde il massimo.`,
    R`Il **centro di massa** è la media delle posizioni pesata con le masse. Si muove come se tutta la massa fosse lì e agissero solo le forze esterne.`
  ],
  sezioni: [
    {
      id: 'quantita-di-moto',
      titolo: 'La quantità di moto',
      testo: R`Un camion che fa manovra a passo d'uomo può schiacciare un muretto. Una pallina da ping-pong veloce, invece, rimbalza e basta. Per dire quanto è difficile fermare un corpo non basta la velocità: serve anche la massa.

>* La **quantità di moto** di un corpo è il prodotto della massa per la velocità: $\vec{p} = m \cdot \vec{v}$. È un vettore con la direzione e il verso della velocità. Si misura in $\text{kg} \cdot \text{m/s}$.

Un camion lento e un'auto veloce possono avere la stessa quantità di moto. Ecco un camion da 12 t a 2 m/s e un'auto da 1200 kg a 20 m/s:

~ p_{\text{camion}} = 12\,000\,\text{kg} \cdot 2\,\text{m/s} :: la massa in chilogrammi: 12 t sono 12 000 kg
~ p_{\text{camion}} = \evidb{24\,000\,\text{kg} \cdot \text{m/s}} :: una massa grande compensa la velocità piccola
~ p_{\text{auto}} = 1200\,\text{kg} \cdot 20\,\text{m/s} = \evidb{24\,000\,\text{kg} \cdot \text{m/s}} :: dieci volte meno massa, dieci volte più velocità

>! Quantità di moto ed energia cinetica sono due cose diverse. L'auto ha $E_c = 240\,000\,\text{J}$, il camion solo $24\,000\,\text{J}$. L'energia cinetica va con $v^2$ e non ha verso; la quantità di moto va con $v$ ed è un vettore.

Il verso conta davvero. Su una retta si sceglie un verso positivo: chi va dall'altra parte ha quantità di moto negativa. Così anche la **variazione** $\Delta \vec{p} = \vec{p}\,' - \vec{p}$ va fatta con i segni.

Pensa a una palla che rimbalza contro un muro. Prima va verso il muro, dopo torna indietro. La variazione della quantità di moto è più grande di quella di una palla che si ferma.

[[grafico:rimbalzo]]

>! Una palla che torna indietro alla stessa velocità non ha $\Delta p = 0$. La sua quantità di moto è passata da $+p$ a $-p$: la variazione vale $-2 \cdot p$.

?? Una palla da 0,2 kg arriva su un muro a 10 m/s e rimbalza indietro a 10 m/s. Quanto vale il modulo della variazione della sua quantità di moto?
[ ] zero
[ ] $2\,\text{kg} \cdot \text{m/s}$
[x] $4\,\text{kg} \cdot \text{m/s}$
=> Prima $p = +2\,\text{kg} \cdot \text{m/s}$, dopo $p\,' = -2\,\text{kg} \cdot \text{m/s}$. La differenza è $-4\,\text{kg} \cdot \text{m/s}$: il modulo è 4. La velocità ha cambiato verso, e il verso conta.`
    },
    {
      id: 'impulso',
      titolo: 'L\'impulso e il secondo principio',
      testo: R`Un uovo lanciato contro un muro si rompe. Lanciato contro un lenzuolo appeso, no. In tutti e due i casi l'uovo si ferma. Cambia il tempo che ci mette a fermarsi.

Il secondo principio si può scrivere con la quantità di moto. Basta ricordare che l'accelerazione è $\Delta v / \Delta t$:

~ F = m \cdot a :: il secondo principio, con F forza risultante
~ F = m \cdot \dfrac{\Delta v}{\Delta t} :: l'accelerazione è la variazione di velocità nel tempo
~ F \cdot \Delta t = m \cdot \Delta v :: moltiplico per il tempo tutti e due i lati
~ F \cdot \Delta t = \evidb{\Delta p} :: con la massa costante, $m \cdot \Delta v$ è la variazione di $p$

Newton stesso scrisse il secondo principio così, come cambiamento del moto prodotto da una forza.

>* L'**impulso** di una forza è $\vec{I} = \vec{F} \cdot \Delta t$, in $\text{N} \cdot \text{s}$. **Teorema dell'impulso**: l'impulso della forza risultante è uguale alla variazione della quantità di moto, $\vec{I} = \Delta \vec{p}$.

Le unità tornano: $1\,\text{N} \cdot \text{s} = 1\,\text{kg} \cdot \text{m/s}$. Se la forza cambia durante l'urto, nella formula va la **forza media**.

Esempio. Un'auto da 1000 kg parte da ferma e arriva a 20 m/s in 10 s. La quantità di moto passa da 0 a $20\,000\,\text{kg} \cdot \text{m/s}$. La forza media che la spinge è $20\,000\,\text{N} \cdot \text{s}$ diviso $10\,\text{s}$, cioè $2000\,\text{N}$.

[[video:quantita-di-moto/impulso]]

In un urto la variazione $\Delta p$ è decisa: chi corre deve fermarsi. Si può scegliere solo **in quanto tempo**. La forza media è $\Delta p / \Delta t$: più tempo, meno forza.

[[grafico:forza]]

>! L'airbag non cambia la variazione della quantità di moto: il manichino si ferma comunque. Allunga il tempo della frenata, e così abbassa la forza media.

Per lo stesso motivo si atterra a ginocchia piegate. I paraurti, i caschi e i tappeti delle palestre fanno lo stesso lavoro.

?? Un vaso cade sul pavimento e si ferma in un tempo $\Delta t$. Su un tappeto alto si ferma in un tempo tre volte più lungo, con la stessa velocità d'arrivo. Come cambia la forza media?
[ ] resta uguale
[ ] diventa tre volte più grande
[x] diventa un terzo
=> La variazione $\Delta p$ è la stessa. Con $F = \Delta p / \Delta t$, un tempo triplo dà una forza media tre volte più piccola.`
    },
    {
      id: 'conservazione',
      titolo: 'La conservazione della quantità di moto',
      testo: R`Nei principi della dinamica due pattinatori fermi si spingevano. Alla fine il prodotto massa per velocità era lo stesso per tutti e due, in versi opposti. Non era un caso.

Un **sistema** è un insieme di corpi che scegliamo di studiare. Le forze fra i corpi del sistema sono **interne**. Quelle che arrivano da fuori sono **esterne**. Il sistema è **isolato** quando la risultante delle forze esterne è zero.

Prendi due corpi A e B che si spingono, e su ciascuno le altre forze si annullano. Per il terzo principio le loro forze sono uguali e opposte, e durano lo stesso tempo:

~ \vec{F}_{AB} = -\vec{F}_{BA} :: terzo principio: $\vec{F}_{AB}$ è la forza di A su B
~ \vec{F}_{AB} \cdot \Delta t = -\vec{F}_{BA} \cdot \Delta t :: le due forze agiscono per lo stesso tempo
~ \Delta \vec{p}_B = -\Delta \vec{p}_A :: teorema dell'impulso per ciascun corpo
~ \evidb{\Delta \vec{p}_A + \Delta \vec{p}_B = 0} :: quello che guadagna uno, lo perde l'altro

>* **Conservazione della quantità di moto**: in un sistema isolato la quantità di moto totale non cambia, $\vec{p}_A + \vec{p}_B = \vec{p}_A\,' + \vec{p}_B\,'$. Gli apici indicano le grandezze dopo.

Le frecce ricordano che la somma è fra vettori. Su una retta basta stare attenti ai segni.

[[video:quantita-di-moto/conservazione]]

Il **rinculo** segue da qui. Un ragazzo di 50 kg è fermo su una barca di 150 kg, ferma anche lei. Salta verso il molo a 3 m/s. Per il breve tempo del salto l'attrito dell'acqua si trascura:

~ 0 = m_r \cdot v_r + m_b \cdot v_b :: prima tutto era fermo: il totale era zero
~ v_b = -\dfrac{m_r \cdot v_r}{m_b} = -\dfrac{50\,\text{kg} \cdot 3\,\text{m/s}}{150\,\text{kg}} :: ricavo la velocità della barca
~ v_b = \evidb{-1\,\text{m/s}} :: la barca va all'indietro, tre volte più piano

Le velocità sono opposte. Il corpo con più massa va più piano, nello stesso rapporto.

[[grafico:rinculo]]

### Il razzo

Un razzo brucia il combustibile e spinge i gas indietro a grande velocità. I gas spingono il razzo in avanti, con una forza uguale e opposta. La quantità di moto dei gas verso il basso è uguale a quella guadagnata dal razzo verso l'alto.

La **spinta** è la quantità di moto data ai gas in ogni secondo. Un motore che espelle 20 kg di gas al secondo a 3000 m/s riceve una spinta di 60 000 N.

>! Il razzo non spinge contro l'aria. Spinge i propri gas, e funziona anche meglio nel vuoto, dove l'aria non lo frena.

?? Sei fermo su un lago ghiacciato liscissimo e lanci in avanti una palla pesante. Che cosa ti succede?
[ ] resti fermo, perché il ghiaccio non ti spinge
[x] scivoli all'indietro
[ ] scivoli in avanti, dietro alla palla
=> Prima del lancio la quantità di moto totale era zero. Dopo la palla va avanti, e tu devi andare indietro perché il totale resti zero.`
    },
    {
      id: 'urti',
      titolo: 'Gli urti: che cosa si conserva',
      testo: R`Due biglie che si scontrano, una mazza che colpisce la palla, due auto in un tamponamento. Sono **urti**: forze grandissime che durano pochissimo.

Durante l'urto agiscono anche forze esterne, come il peso e l'attrito. Ma sono piccole, e in un tempo così breve danno un impulso trascurabile. Per questo, subito prima e subito dopo l'urto, la quantità di moto totale è la stessa.

>* In ogni urto, se le forze esterne sono trascurabili, si conserva la quantità di moto totale. L'energia cinetica invece **non sempre** si conserva.

Gli urti si dividono così:

| urto | quantità di moto | energia cinetica |
|---|---|---|
| elastico | si conserva | si conserva |
| anelastico | si conserva | in parte si perde |
| completamente anelastico | si conserva | si perde il massimo: i corpi restano uniti |

L'energia che manca non sparisce. Diventa energia interna: i corpi si deformano e si scaldano un poco, e l'urto fa rumore.

[[video:quantita-di-moto/urti]]

Nell'urto **completamente anelastico** i corpi ripartono insieme, con la stessa velocità $V$. Basta la conservazione della quantità di moto:

$$V = \dfrac{m_A \cdot v_A + m_B \cdot v_B}{m_A + m_B}$$

Esempio. Un vagone di 20 t a 3 m/s urta un vagone fermo di 10 t, e si agganciano:

~ V = \dfrac{20\,000\,\text{kg} \cdot 3\,\text{m/s} + 0}{30\,000\,\text{kg}} :: quantità di moto totale diviso massa totale
~ V = \evidb{2\,\text{m/s}} :: ripartono insieme, più piano
~ E_c = 90\,000\,\text{J} \;\to\; 60\,000\,\text{J} :: prima $\tfrac{1}{2} \cdot 20\,000 \cdot 3^2$, dopo $\tfrac{1}{2} \cdot 30\,000 \cdot 2^2$: se ne perde un terzo

[[grafico:anelastico]]

>! La quantità di moto non si perde negli urti anelastici. Si perde energia cinetica. Sono due conti separati: la quantità di moto torna sempre, l'energia cinetica solo se l'urto è elastico.

?? Due palline di plastilina uguali si vengono incontro alla stessa velocità, si scontrano e restano attaccate. Che cosa succede dopo l'urto?
[x] restano ferme
[ ] proseguono nel verso della più veloce
[ ] rimbalzano indietro
=> La quantità di moto totale era zero: due vettori uguali e opposti. Dopo deve essere ancora zero, quindi la pallina unita è ferma. Tutta l'energia cinetica è diventata energia interna.`
    },
    {
      id: 'urto-elastico',
      titolo: 'L\'urto elastico',
      testo: R`Due biglie d'acciaio rimbalzano quasi senza perdere energia. Sono il modello dell'**urto elastico**: si conservano la quantità di moto **e** l'energia cinetica.

>* In un **urto elastico** si conservano sia la quantità di moto totale sia l'energia cinetica totale.

Prendiamo un urto frontale: B è fermo e A lo colpisce con velocità $v_A$. Le incognite sono le due velocità dopo, $v_A'$ e $v_B'$. Le due leggi di conservazione bastano a trovarle:

~ m_A \cdot (v_A - v_A') = m_B \cdot v_B' :: quantità di moto: quello che perde A, lo prende B
~ m_A \cdot (v_A^2 - v_A'^2) = m_B \cdot v_B'^2 :: energia cinetica, moltiplicata per 2
~ v_A + v_A' = v_B' :: divido la seconda per la prima: $v_A^2 - v_A'^2 = (v_A - v_A') \cdot (v_A + v_A')$
~ \evidb{v_A' = \dfrac{m_A - m_B}{m_A + m_B} \cdot v_A} :: metto $v_B'$ nella prima e ricavo $v_A'$
~ \evidb{v_B' = \dfrac{2 \cdot m_A}{m_A + m_B} \cdot v_A} :: e poi $v_B' = v_A + v_A'$

Esempio. A, di 1 kg, va a 6 m/s contro B, di 2 kg, fermo. Le formule danno $v_A' = -\tfrac{1}{3} \cdot 6 = -2\,\text{m/s}$ e $v_B' = \tfrac{2}{3} \cdot 6 = 4\,\text{m/s}$. A rimbalza indietro. Controllo dell'energia: prima $18\,\text{J}$, dopo $2\,\text{J} + 16\,\text{J} = 18\,\text{J}$.

Il risultato dipende dal rapporto fra le masse:

- **masse uguali**: A si ferma e B parte con la velocità di A. Si scambiano le velocità, come nel biliardo e nel pendolo di Newton;
- **A molto più leggero**: A torna indietro quasi alla stessa velocità, come una pallina contro un muro;
- **A molto più pesante**: A prosegue quasi indisturbato, e B schizza via a quasi il doppio della velocità di A.

[[grafico:elastico]]

>! Le due formule valgono solo per l'urto elastico frontale con B fermo. In un urto anelastico l'energia cinetica non torna, e le formule danno numeri sbagliati.

?? Una pallina da ping-pong colpisce frontalmente una palla da bowling ferma, con un urto elastico. Che cosa fa la pallina?
[ ] si ferma
[x] torna indietro quasi alla stessa velocità
[ ] prosegue insieme alla palla da bowling
=> Con $m_A$ molto più piccola di $m_B$, la frazione $\dfrac{m_A - m_B}{m_A + m_B}$ vale quasi $-1$: la pallina rimbalza indietro con quasi tutta la sua velocità. La palla da bowling si muove appena.`
    },
    {
      id: 'urti-piano',
      titolo: 'Gli urti nel piano',
      testo: R`A un incrocio un'auto arriva da ovest e una da sud. Si scontrano e restano incastrate. In che direzione scivolano?

La quantità di moto è un vettore. La conservazione vale per il vettore intero, quindi vale per ciascuna componente: per la $x$ da sola e per la $y$ da sola.

>* Negli urti nel piano la quantità di moto totale si conserva come vettore: si conservano separatamente $p_x$ e $p_y$.

Esempio. L'auto A, di 1500 kg, va verso est a 16 m/s. L'auto B, di 1200 kg, va verso nord a 15 m/s. Restano unite. Asse $x$ verso est, asse $y$ verso nord:

~ p_x = 1500\,\text{kg} \cdot 16\,\text{m/s} = 24\,000\,\text{kg} \cdot \text{m/s} :: solo A ha componente lungo $x$
~ p_y = 1200\,\text{kg} \cdot 15\,\text{m/s} = 18\,000\,\text{kg} \cdot \text{m/s} :: solo B ha componente lungo $y$
~ p = \sqrt{24\,000^2 + 18\,000^2}\,\text{kg} \cdot \text{m/s} = 30\,000\,\text{kg} \cdot \text{m/s} :: modulo con il teorema di Pitagora
~ V = \dfrac{30\,000\,\text{kg} \cdot \text{m/s}}{2700\,\text{kg}} \approx \evidb{11{,}1\,\text{m/s}} :: quantità di moto totale diviso massa totale

La direzione è quella della somma: $\cos\alpha = 24\,000 / 30\,000 = 0{,}8$, cioè $\alpha \approx 36{,}9°$ a nord dell'est.

[[grafico:incrocio]]

> Nel biliardo succede una cosa curiosa. Una biglia colpisce di striscio un'altra uguale, ferma. Se l'urto è elastico, dopo le due biglie partono ad angolo retto.

>! Le quantità di moto si sommano come vettori, non come numeri. $24\,000 + 18\,000$ farebbe $42\,000$: un modulo sbagliato.

?? Due dischi da hockey uguali si scontrano e restano attaccati. Prima uno andava verso est e l'altro verso nord, alla stessa velocità. Verso dove vanno dopo?
[ ] verso est
[x] verso nord-est, a 45°
[ ] si fermano
=> Le due quantità di moto sono uguali e perpendicolari: la somma punta a metà, a 45° fra est e nord. Si fermerebbero solo con quantità di moto opposte.`
    },
    {
      id: 'centro-di-massa',
      titolo: 'Il centro di massa',
      testo: R`Un bilanciere ha un disco pesante da una parte e uno leggero dall'altra. Per sollevarlo in equilibrio non lo prendi a metà: lo prendi più vicino al disco pesante. Lì c'è il suo **centro di massa**.

>* Il **centro di massa** di un sistema è la media delle posizioni dei corpi, pesata con le masse: $x_{cm} = \dfrac{m_A \cdot x_A + m_B \cdot x_B + \dots}{m_A + m_B + \dots}$.

Vicino alla Terra $g$ è lo stesso in ogni punto del corpo. Lì il centro di massa coincide con il baricentro che hai visto nell'equilibrio.

Esempio. Un disco di 6 kg sta in $x = 0$, uno di 2 kg in $x = 1{,}2\,\text{m}$:

~ x_{cm} = \dfrac{6\,\text{kg} \cdot 0 + 2\,\text{kg} \cdot 1{,}2\,\text{m}}{6\,\text{kg} + 2\,\text{kg}} :: ogni posizione pesa quanto la sua massa
~ x_{cm} = \dfrac{2{,}4}{8}\,\text{m} = \evidb{0{,}3\,\text{m}} :: un quarto della distanza, vicino al disco pesante

[[grafico:baricentro]]

Lo stesso conto si fa con le velocità. La velocità del centro di massa è la quantità di moto totale divisa per la massa totale: $\vec{p}_{tot} = m_{tot} \cdot \vec{v}_{cm}$.

Ne segue una cosa importante. In un sistema isolato $\vec{p}_{tot}$ non cambia, quindi il centro di massa va a velocità costante. Le forze interne non lo spostano.

[[video:quantita-di-moto/centro-di-massa]]

>* Il centro di massa si muove come un punto con tutta la massa del sistema. Su quel punto agiscono solo le forze esterne: $m_{tot} \cdot \vec{a}_{cm} = \vec{F}_{est}$.

Prendi un fuoco d'artificio che esplode in volo, senza l'aria. Il centro di massa dei pezzi resta sulla parabola di prima, finché un pezzo non tocca terra.

>! Il centro di massa non è il punto di mezzo fra i corpi. Si sposta verso il corpo con più massa: con masse uguali sta a metà, altrimenti no.

?? Sei in piedi a poppa di una barca ferma, su un lago calmo. Cammini fino a prua. Che cosa fa la barca?
[ ] resta ferma
[ ] si muove nel tuo stesso verso
[x] si sposta nel verso opposto al tuo
=> Il sistema tu più barca è isolato in orizzontale, se l'acqua frena poco. Il centro di massa resta fermo: se tu vai avanti, la barca deve andare indietro.`
    },
    {
      id: 'problemi',
      titolo: 'Come si risolve un problema di urti',
      testo: R`I problemi di urti e di rinculo si somigliano. Conviene seguire sempre gli stessi passi.

1. **Scegli il sistema.** Di solito i corpi che si urtano. Controlla che le forze esterne siano nulle, o trascurabili perché l'urto è breve.
2. **Fissa un verso positivo.** Scrivi le velocità con il loro segno: chi va dall'altra parte ha velocità negativa.
3. **Scrivi la quantità di moto totale prima e dopo**, e mettile uguali. Nel piano, una equazione per $x$ e una per $y$.
4. **Guarda che urto è.** Se i corpi restano uniti, c'è una sola velocità finale. Se l'urto è elastico, aggiungi la conservazione di $E_c$.
5. **Controlla l'energia.** In un urto l'energia cinetica finale non può superare quella iniziale.

>* In ogni problema di urti: sistema isolato, verso positivo, quantità di moto prima uguale a quantità di moto dopo, tipo di urto, controllo dell'energia.

L'ultimo controllo smaschera i risultati impossibili. Un carrello A di 3 kg va a 4 m/s contro un carrello B di 1 kg, fermo. Qualcuno sostiene che dopo A vada a 1 m/s e B a 9 m/s. È possibile?

~ p = 3\,\text{kg} \cdot 4\,\text{m/s} = 12\,\text{kg} \cdot \text{m/s} :: prima dell'urto: solo A si muove
~ p\,' = 3 \cdot 1 + 1 \cdot 9 = 12\,\text{kg} \cdot \text{m/s} :: dopo: la quantità di moto torna
~ E_c = \tfrac{1}{2} \cdot 3 \cdot 4^2 = 24\,\text{J} :: l'energia cinetica prima
~ E_c' = \tfrac{1}{2} \cdot 3 \cdot 1^2 + \tfrac{1}{2} \cdot 1 \cdot 9^2 = \evidb{42\,\text{J}} :: dopo sarebbe di più: impossibile

> Le esplosioni sono l'eccezione: lì l'energia cinetica cresce. Arriva dall'energia chimica dell'esplosivo, non dal moto.

>! Il segno meno si mette nella velocità, non nella massa. Una massa negativa non esiste: se un corpo va indietro, è la sua velocità a essere negativa.`
    }
  ],
  grafici: {
    /* la palla che rimbalza: p prima, p' dopo, Δp = p' − p (più grande se torna indietro più veloce) */
    rimbalzo: {
      tipo: 'piano', x: [-1, 7.2], y: [-1.3, 7.6], assi: false, griglia: false,
      parametri: [{ nome: 'vr', min: 1, max: 6, passo: 0.5, valore: 5, etichetta: 'velocità di ritorno (m/s)' }],
      elementi: [
        { tipo: 'poligono', punti: [[6.3, 0], [6.9, 0], [6.9, 7.4], [6.3, 7.4]], colore: 'grigio' },
        { tipo: 'testo', p: [6.6, -0.8], testo: 'muro', colore: 'grigio' },
        { tipo: 'vettore', da: [3, 6], a: [6, 6], etichetta: 'p', colore: 1, posizione: 'destra' },
        { tipo: 'testo', p: [6, 6.8], testo: 'prima: 3 kg·m/s', ancora: 'end', colore: 1 },
        { tipo: 'vettore', da: [6, 3.6], a: ['6 - 0.5*vr', 3.6], etichetta: 'p′', colore: 1 },
        { tipo: 'testo', p: [6, 4.4], testo: 'dopo: {{0.5*vr}} kg·m/s', ancora: 'end', colore: 1 },
        { tipo: 'vettore', da: [6, 1.2], a: ['3 - 0.5*vr', 1.2], etichetta: 'Δp', colore: 1, spessore: 3.4 },
        { tipo: 'testo', p: [6, 2], testo: 'variazione: {{3 + 0.5*vr}} kg·m/s', ancora: 'end', colore: 1 }
      ],
      didascalia: 'Una palla da 0,5 kg arriva sul muro a 6 m/s e torna indietro. Le frecce sono in scala. La variazione Δp = p′ − p punta all\'indietro, nello stesso verso della forza del muro. Il cursore cambia la velocità di ritorno: se la palla rimbalza a 6 m/s, Δp vale il doppio di p.'
    },
    /* la forza durante l'urto del manichino del video: stessa area (600 N·s), durata diversa */
    forza: {
      tipo: 'orario', grandezza: 'F', unita: 'kN', t: [0, 0.25], y: [0, 64],
      parametri: [{ nome: 'dt', min: 0.02, max: 0.2, passo: 0.01, valore: 0.1, etichetta: 'durata della frenata (s)' }],
      funzioni: [
        { f: '(1.2/dt)*sin(pi*t/dt)^2', dominio: [0, 'dt'], colore: 2 },
        { f: '0.6/dt', dominio: [0, 'dt'], colore: 2, tratteggio: true }
      ],
      elementi: [
        { tipo: 'area', f: '(1.2/dt)*sin(pi*t/dt)^2', da: 0, a: 'dt', colore: 3 },
        { tipo: 'testo', p: [0.245, 57], testo: 'forza media = {{0.6/dt}} kN', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [0.245, 50], testo: 'impulso = area = 600 N·s', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Il manichino del video: 60 kg a 10 m/s, quindi Δp = 600 kg·m/s. La curva piena è la forza vera durante la frenata, il tratteggio è la forza media. L\'area resta sempre 600 N·s: se la frenata dura di più, la forza si abbassa. Di serie si vede l\'airbag, 0,1 s; contro il cruscotto, in 0,01 s, la forza media sarebbe 60 kN. Il cursore cambia la durata.'
    },
    /* il rinculo: due carrelli spinti da una molla, quantità di moto uguali e opposte */
    rinculo: {
      tipo: 'piano', x: [-6.6, 6.6], y: [-4, 4], assi: false, griglia: false,
      parametri: [{ nome: 'mB', min: 1, max: 6, passo: 0.5, valore: 4, etichetta: 'massa di B (kg)' }],
      elementi: [
        { tipo: 'segmento', da: [-6.6, 0], a: [6.6, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-1.6, 0], [-0.3, 0], [-0.3, 1.4], [-1.6, 1.4]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0.3, 0], [1.6, 0], [1.6, 1.4], [0.3, 1.4]], colore: 'grigio' },
        { tipo: 'testo', p: [-0.3, -0.9], testo: 'A · 3 kg', ancora: 'end' },
        { tipo: 'testo', p: [0.3, -0.9], testo: 'B · {{mB}} kg', ancora: 'start' },
        { tipo: 'vettore', da: [-1.6, 0.7], a: [-3.2, 0.7], colore: 1 },
        { tipo: 'vettore', da: [1.6, 0.7], a: ['1.6 + 4.8/mB', 0.7], colore: 1 },
        { tipo: 'testo', p: [-6.4, 2.6], testo: 'v_A = 2 m/s', ancora: 'start', colore: 1 },
        { tipo: 'testo', p: [6.4, 2.6], testo: 'v_B = {{6/mB}} m/s', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [-6.4, -2.2], testo: 'p_A = −6 kg·m/s', ancora: 'start', colore: 1 },
        { tipo: 'testo', p: [6.4, -2.2], testo: 'p_B = +6 kg·m/s', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [0, -3.4], testo: 'totale: 0, come prima', colore: 3 }
      ],
      didascalia: 'Due carrelli erano fermi, con una molla compressa fra loro. La molla scatta e dà a ciascuno lo stesso impulso, in versi opposti. A parte verso sinistra a 2 m/s, B verso destra con la stessa quantità di moto: più massa ha, più piano va. Le frecce delle velocità sono in scala. Il cursore cambia la massa di B.'
    },
    /* urto completamente anelastico: A (2 kg, 3 m/s) tampona B (1 m/s) a t = 2 s e restano uniti */
    anelastico: {
      tipo: 'orario', grandezza: 'v', t: [0, 5], y: [0, 3.6],
      parametri: [{ nome: 'mB', min: 0.5, max: 6, passo: 0.5, valore: 3, etichetta: 'massa di B (kg)' }],
      funzioni: [
        { f: '3', dominio: [0, 2], colore: 1 },
        { f: '1', dominio: [0, 2], colore: 1, tratteggio: true },
        { f: '(6 + mB)/(2 + mB)', dominio: [2, 5], colore: 1 }
      ],
      elementi: [
        { tipo: 'verticale', x: 2, colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [1.5, 2.65], testo: 'A', colore: 1 },
        { tipo: 'testo', p: [1, 1.3], testo: 'B', colore: 1 },
        { tipo: 'testo', p: [4.9, 3.25], testo: 'insieme: V = {{(6 + mB)/(2 + mB)}} m/s', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [4.9, 0.6], testo: 'energia persa: {{4*mB/(2 + mB)}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La velocità di due carrelli. A (2 kg, 3 m/s) raggiunge B (1 m/s, tratteggio) e a t = 2 s si agganciano. Dopo vanno insieme alla velocità V = p totale / massa totale. Il cursore cambia la massa di B: più è pesante, più energia cinetica si perde.'
    },
    /* urto elastico frontale con B fermo: le velocità dopo in funzione del rapporto fra le masse */
    elastico: {
      tipo: 'piano', x: [0, 5.6], y: [-1.2, 2.6], proporzioni: 'libere', passo: [2, 0.5], altezza: 520,
      etichette: { x: 'm_B/m_A', y: 'v′/v_A' },
      parametri: [{ nome: 'r', min: 0, max: 5, passo: 0.1, valore: 3, etichetta: 'rapporto m_B/m_A' }],
      funzioni: [
        { f: '(1 - x)/(1 + x)', colore: 1, etichetta: 'A' },
        { f: '2/(1 + x)', colore: 1, tratteggio: true, etichetta: 'B' }
      ],
      elementi: [
        { tipo: 'punto', p: ['r', '(1 - r)/(1 + r)'], colore: 1 },
        { tipo: 'punto', p: ['r', '2/(1 + r)'], colore: 1 },
        { tipo: 'testo', p: [5.5, 1.95], testo: 'v_A′ = {{(1 - r)/(1 + r)}} · v_A', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [5.5, 1.6], testo: 'v_B′ = {{2/(1 + r)}} · v_A', ancora: 'end', colore: 1 }
      ],
      didascalia: 'Urto elastico frontale, B fermo. In orizzontale il rapporto delle masse, cioè quante volte B è più pesante di A. In verticale le velocità dopo l\'urto, come frazioni della velocità iniziale di A (A linea piena, B tratteggio). Con masse uguali A si ferma e B parte con la velocità che aveva A. Con B più pesante, A torna indietro (velocità negativa).'
    },
    /* l'incrocio: le due quantità di moto si sommano come vettori */
    incrocio: {
      tipo: 'piano', x: [-2, 28], y: [-2, 21], assi: false, griglia: false,
      elementi: [
        { tipo: 'somma', da: [0, 0], vettori: [[24, 0], [0, 18]], etichette: ['p_A', 'p_B'], colori: [1, 1], risultante: { etichetta: 'p_A + p_B', colore: 3 } },
        { tipo: 'testo', p: [-1.5, 19.6], testo: 'totale: 30 000 kg·m/s', ancora: 'start', colore: 3 }
      ],
      didascalia: 'Le quantità di moto delle due auto prima dell\'urto, in scala: A verso est con 24 000 kg·m/s, B verso nord con 18 000 kg·m/s. Dopo l\'urto le auto unite hanno la quantità di moto della somma, in verde: stesso modulo e stessa direzione, a 36,9° a nord dell\'est.'
    },
    /* il centro di massa di due corpi su una riga: trascinabili, massa di B variabile */
    baricentro: {
      tipo: 'piano', x: [-0.8, 10.8], y: [-1.9, 1.9], assi: false, griglia: false, proporzioni: 'libere', altezza: 300,
      parametri: [
        { nome: 'xA', min: 0, max: 10, passo: 0.5, valore: 1, nascosto: true },
        { nome: 'xB', min: 0, max: 10, passo: 0.5, valore: 7, nascosto: true },
        { nome: 'mB', min: 1, max: 6, passo: 1, valore: 2, etichetta: 'massa di B (kg)' }
      ],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: [10, 0], colore: 'grigio' },
        { tipo: 'testo', p: [0, -1.5], testo: '0' },
        { tipo: 'testo', p: [5, -1.5], testo: '5 m' },
        { tipo: 'testo', p: [10, -1.5], testo: '10 m' },
        { tipo: 'punto', p: ['xA', 0], trascina: true, colore: 'grigio' },
        { tipo: 'punto', p: ['xB', 0], trascina: true, colore: 'grigio' },
        { tipo: 'testo', p: ['xA', 0.6], testo: 'A · 3 kg' },
        { tipo: 'testo', p: ['xB', 0.6], testo: 'B · {{mB}} kg' },
        { tipo: 'punto', p: ['(3*xA + mB*xB)/(3 + mB)', 0], raggio: 6, colore: 4 },
        { tipo: 'testo', p: ['(3*xA + mB*xB)/(3 + mB)', -0.85], testo: 'cm', colore: 4 },
        { tipo: 'testo', p: [10.6, 1.5], testo: 'x_cm = {{(3*xA + mB*xB)/(3 + mB)}} m', ancora: 'end', colore: 4 }
      ],
      didascalia: 'Due corpi su una riga: A di 3 kg e B di massa variabile. I punti A e B si trascinano. Il centro di massa (cm, in viola come nel video) sta sempre fra i due, più vicino al corpo con più massa.'
    }
  },
  esempi: [
    {
      titolo: 'La forza della racchetta',
      problema: R`Una palla da tennis di 58 g arriva sulla racchetta a 30 m/s. Riparte nel verso opposto a 40 m/s. Il contatto dura 5 millesimi di secondo. Quanto vale la forza media della racchetta sulla palla?`,
      passi: [
        R`Dati: $m = 0{,}058\,\text{kg}$, $v = 30\,\text{m/s}$ in arrivo, $v' = 40\,\text{m/s}$ in partenza, $\Delta t = 0{,}005\,\text{s}$. Cerco la forza media $F$.`,
        R`Verso positivo: quello in cui la palla riparte. Allora $v = -30\,\text{m/s}$ e $v' = +40\,\text{m/s}$.`,
        R`Variazione della quantità di moto: $\Delta p = m \cdot (v' - v) = 0{,}058\,\text{kg} \cdot (40 + 30)\,\text{m/s} = 4{,}06\,\text{kg} \cdot \text{m/s}$.`,
        R`Teorema dell'impulso: $F = \dfrac{\Delta p}{\Delta t} = \dfrac{4{,}06\,\text{N} \cdot \text{s}}{0{,}005\,\text{s}} = 812\,\text{N}$, nel verso della ripartenza.`,
        R`Controllo: il peso della palla è $0{,}058 \cdot 9{,}8 \approx 0{,}57\,\text{N}$. Più di mille volte meno: trascurarlo era giusto.`
      ],
      risultato: R`$F \approx 812\,\text{N}$, nel verso in cui la palla riparte.`
    },
    {
      titolo: 'L\'astronauta e la chiave inglese',
      problema: R`Un astronauta di 100 kg, tuta compresa, è fermo nello spazio accanto alla stazione. Lancia una chiave inglese di 2 kg a 5 m/s. Che cosa succede a lui?`,
      passi: [
        R`Dati: $m_a = 100\,\text{kg}$, $m_c = 2\,\text{kg}$, $v_c = 5\,\text{m/s}$, tutto fermo all'inizio. Cerco la velocità $v_a$ dell'astronauta.`,
        R`Nello spazio non ci sono attriti, e nel lancio le forze sono interne: il sistema astronauta più chiave è isolato.`,
        R`Prima del lancio la quantità di moto totale è zero. Dopo deve essere ancora zero: $0 = m_a \cdot v_a + m_c \cdot v_c$.`,
        R`Ricavo: $v_a = -\dfrac{2\,\text{kg} \cdot 5\,\text{m/s}}{100\,\text{kg}} = -0{,}1\,\text{m/s}$. Il segno meno dice che va nel verso opposto alla chiave.`,
        R`Controllo: $100 \cdot 0{,}1 = 10$ e $2 \cdot 5 = 10\,\text{kg} \cdot \text{m/s}$. Uguali e opposte. In un minuto l'astronauta si allontana di 6 m.`
      ],
      risultato: R`L'astronauta rincula a $0{,}1\,\text{m/s}$, nel verso opposto alla chiave.`
    },
    {
      titolo: 'Lo scontro frontale',
      problema: R`Un'auto di 1000 kg va a 15 m/s. Contro di lei arriva un furgone di 2000 kg a 6 m/s. Si scontrano frontalmente e restano incastrati. Con che velocità si muovono subito dopo? Quanta energia cinetica si perde?`,
      passi: [
        R`Dati: $m_A = 1000\,\text{kg}$, $v_A = 15\,\text{m/s}$, $m_B = 2000\,\text{kg}$, $v_B = 6\,\text{m/s}$ in verso opposto. Cerco $V$ e l'energia persa.`,
        R`Verso positivo: quello dell'auto. Allora $v_B = -6\,\text{m/s}$.`,
        R`Restano uniti: urto completamente anelastico. $V = \dfrac{1000 \cdot 15 + 2000 \cdot (-6)}{3000}\,\text{m/s} = \dfrac{3000}{3000}\,\text{m/s} = 1\,\text{m/s}$, nel verso dell'auto.`,
        R`Energia cinetica prima: $\tfrac{1}{2} \cdot 1000 \cdot 15^2 + \tfrac{1}{2} \cdot 2000 \cdot 6^2 = 112\,500 + 36\,000 = 148\,500\,\text{J}$.`,
        R`Dopo: $\tfrac{1}{2} \cdot 3000 \cdot 1^2 = 1500\,\text{J}$. Se ne perdono $147\,000\,\text{J}$, quasi tutta: va nelle lamiere accartocciate.`
      ],
      risultato: R`$V = 1\,\text{m/s}$ nel verso dell'auto; si perdono circa $147\,000\,\text{J}$.`
    },
    {
      titolo: 'Il pendolo balistico',
      problema: R`Un proiettile di 20 g si conficca in un blocco di legno di 1,98 kg, appeso a due fili. Il blocco oscilla e sale di 20 cm. Quanto andava veloce il proiettile?`,
      passi: [
        R`Dati: $m = 0{,}020\,\text{kg}$, $M = 1{,}98\,\text{kg}$, $h = 0{,}20\,\text{m}$. Cerco la velocità $v$ del proiettile.`,
        R`Ci sono due fasi. Prima l'urto, brevissimo: il proiettile resta nel blocco, urto completamente anelastico. Poi la salita, dove si conserva l'energia meccanica.`,
        R`Salita: l'energia cinetica del blocco diventa potenziale. $\tfrac{1}{2} \cdot (m + M) \cdot V^2 = (m + M) \cdot g \cdot h$, e la massa si semplifica. Quindi $V = \sqrt{2 \cdot 9{,}8 \cdot 0{,}20}\,\text{m/s} \approx 1{,}98\,\text{m/s}$.`,
        R`Urto: $m \cdot v = (m + M) \cdot V$. Quindi $v = \dfrac{2{,}00\,\text{kg} \cdot 1{,}98\,\text{m/s}}{0{,}020\,\text{kg}} \approx 198\,\text{m/s}$.`,
        R`Attenzione all'ordine: nell'urto l'energia cinetica **non** si conserva. Si usa l'energia solo dopo, nella salita.`
      ],
      risultato: R`Il proiettile andava a circa $198\,\text{m/s}$.`
    },
    {
      titolo: 'Due carrelli che rimbalzano',
      problema: R`Su una rotaia senza attrito un carrello A di 0,5 kg va a 4 m/s contro un carrello B di 1,5 kg, fermo. L'urto è elastico. Come si muovono dopo?`,
      passi: [
        R`Dati: $m_A = 0{,}5\,\text{kg}$, $v_A = 4\,\text{m/s}$, $m_B = 1{,}5\,\text{kg}$, B fermo. Cerco $v_A'$ e $v_B'$.`,
        R`Urto elastico frontale con B fermo: valgono le due formule. $v_A' = \dfrac{0{,}5 - 1{,}5}{2} \cdot 4\,\text{m/s} = -2\,\text{m/s}$.`,
        R`$v_B' = \dfrac{2 \cdot 0{,}5}{2} \cdot 4\,\text{m/s} = 2\,\text{m/s}$.`,
        R`Controllo della quantità di moto: prima $0{,}5 \cdot 4 = 2$, dopo $0{,}5 \cdot (-2) + 1{,}5 \cdot 2 = 2\,\text{kg} \cdot \text{m/s}$.`,
        R`Controllo dell'energia: prima $\tfrac{1}{2} \cdot 0{,}5 \cdot 16 = 4\,\text{J}$, dopo $1\,\text{J} + 3\,\text{J} = 4\,\text{J}$. Tornano tutte e due.`
      ],
      risultato: R`A rimbalza indietro a $2\,\text{m/s}$, B parte in avanti a $2\,\text{m/s}$.`
    },
    {
      titolo: 'La barca che arretra',
      problema: R`Una barca di 140 kg è ferma su un lago calmo. Una persona di 60 kg cammina sulla barca per 4 m, da poppa a prua. Di quanto si sposta la barca rispetto alla riva? Trascura l'attrito dell'acqua.`,
      passi: [
        R`Dati: $m_p = 60\,\text{kg}$, $m_b = 140\,\text{kg}$, spostamento della persona rispetto alla barca $4\,\text{m}$. Cerco lo spostamento $\Delta s_b$ della barca.`,
        R`Il sistema persona più barca è isolato in orizzontale e parte da fermo. Il centro di massa resta fermo: $m_p \cdot \Delta s_p + m_b \cdot \Delta s_b = 0$.`,
        R`Gli spostamenti rispetto alla riva sono legati: la persona si sposta di 4 m più della barca, quindi $\Delta s_p = \Delta s_b + 4\,\text{m}$.`,
        R`Sostituisco: $60 \cdot (\Delta s_b + 4) + 140 \cdot \Delta s_b = 0$, cioè $200 \cdot \Delta s_b = -240$, e $\Delta s_b = -1{,}2\,\text{m}$.`,
        R`La persona si sposta di $\Delta s_p = -1{,}2 + 4 = 2{,}8\,\text{m}$. Controllo: $60 \cdot 2{,}8 = 168$ e $140 \cdot 1{,}2 = 168$. Il centro di massa non si è mosso.`
      ],
      risultato: R`La barca arretra di $1{,}2\,\text{m}$; la persona avanza di $2{,}8\,\text{m}$ rispetto alla riva.`
    }
  ],
  formulario: [
    { nome: 'Quantità di moto', formula: R`\vec{p} = m \cdot \vec{v}`, nota: R`Vettore con il verso della velocità, in $\text{kg} \cdot \text{m/s}$.` },
    { nome: 'Impulso di una forza', formula: R`\vec{I} = \vec{F} \cdot \Delta t`, nota: R`In $\text{N} \cdot \text{s} = \text{kg} \cdot \text{m/s}$. Se la forza cambia, si usa la forza media; è l'area sotto il grafico forza–tempo.` },
    { nome: 'Teorema dell\'impulso', formula: R`\vec{I} = \Delta \vec{p}`, nota: R`L'impulso è quello della forza risultante. Con i segni: $\Delta p = m \cdot (v' - v)$.` },
    { nome: 'Secondo principio con la quantità di moto', formula: R`\vec{F} = \dfrac{\Delta \vec{p}}{\Delta t}`, nota: R`Con la massa costante è la stessa cosa di $\vec{F} = m \cdot \vec{a}$.` },
    { nome: 'Conservazione della quantità di moto', formula: R`\vec{p}_A + \vec{p}_B = \vec{p}_A\,' + \vec{p}_B\,'`, nota: R`In un sistema isolato: risultante delle forze esterne nulla, o trascurabile durante un urto breve.` },
    { nome: 'Rinculo da fermi', formula: R`m_A \cdot v_A' + m_B \cdot v_B' = 0`, nota: R`Velocità opposte, inversamente proporzionali alle masse.` },
    { nome: 'Urto completamente anelastico', formula: R`V = \dfrac{m_A \cdot v_A + m_B \cdot v_B}{m_A + m_B}`, nota: R`I corpi restano uniti. Velocità con il segno; l'energia cinetica cala.` },
    { nome: 'Urto elastico', formula: R`E_c = E_c'`, nota: R`Si conservano la quantità di moto **e** l'energia cinetica totale.` },
    { nome: 'Urto elastico frontale, B fermo: corpo A', formula: R`v_A' = \dfrac{m_A - m_B}{m_A + m_B} \cdot v_A`, nota: R`Negativa se A è più leggero di B: A torna indietro.` },
    { nome: 'Urto elastico frontale, B fermo: corpo B', formula: R`v_B' = \dfrac{2 \cdot m_A}{m_A + m_B} \cdot v_A`, nota: R`Con masse uguali $v_B' = v_A$ e $v_A' = 0$: si scambiano le velocità.` },
    { nome: 'Centro di massa', formula: R`x_{cm} = \dfrac{m_A \cdot x_A + m_B \cdot x_B}{m_A + m_B}`, nota: R`Media delle posizioni pesata con le masse; con più corpi si aggiungono i termini.` },
    { nome: 'Velocità del centro di massa', formula: R`\vec{p}_{tot} = m_{tot} \cdot \vec{v}_{cm}`, nota: R`La quantità di moto totale è quella di un punto con tutta la massa, che va a $\vec{v}_{cm}$.` },
    { nome: 'Moto del centro di massa', formula: R`m_{tot} \cdot \vec{a}_{cm} = \vec{F}_{est}`, nota: R`Le forze interne non cambiano il moto del centro di massa.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'quantita-di-moto', tipo: 'definizione', fronte: R`Che cos'è la **quantità di moto**?`, retro: R`Il prodotto della massa per la velocità, $\vec{p} = m \cdot \vec{v}$: un vettore con il verso della velocità, in $\text{kg} \cdot \text{m/s}$.` },
    { id: 'fc-02', sezione: 'quantita-di-moto', tipo: 'concetto', fronte: R`Che differenza c'è fra quantità di moto ed energia cinetica?`, retro: R`La quantità di moto è un vettore e va con $v$. L'energia cinetica è uno scalare, sempre positivo, e va con $v^2$.` },
    { id: 'fc-03', sezione: 'quantita-di-moto', tipo: 'concetto', fronte: R`Una palla rimbalza su un muro alla stessa velocità. Quanto vale $\Delta p$?`, retro: R`Non zero: $p$ passa da $+m \cdot v$ a $-m \cdot v$, quindi $\Delta p = -2 \cdot m \cdot v$.` },
    { id: 'fc-04', sezione: 'impulso', tipo: 'definizione', fronte: R`Che cos'è l'**impulso** di una forza?`, retro: R`Il prodotto della forza per il tempo in cui agisce, $\vec{I} = \vec{F} \cdot \Delta t$, in $\text{N} \cdot \text{s}$. È l'area sotto il grafico forza–tempo.` },
    { id: 'fc-05', sezione: 'impulso', tipo: 'formula', fronte: R`Il **teorema dell'impulso**`, retro: R`L'impulso della forza risultante è uguale alla variazione della quantità di moto: $\vec{F} \cdot \Delta t = \Delta \vec{p}$.` },
    { id: 'fc-06', sezione: 'impulso', tipo: 'concetto', fronte: R`Perché l'airbag riduce i danni?`, retro: R`La variazione $\Delta p$ è la stessa, ma la frenata dura di più. La forza media $\Delta p / \Delta t$ diventa più piccola.` },
    { id: 'fc-07', sezione: 'impulso', tipo: 'formula', fronte: R`Il secondo principio scritto con la quantità di moto`, retro: R`$\vec{F} = \dfrac{\Delta \vec{p}}{\Delta t}$: la forza risultante è la variazione della quantità di moto in ogni secondo.` },
    { id: 'fc-08', sezione: 'conservazione', tipo: 'definizione', fronte: R`Quando un sistema è **isolato**?`, retro: R`Quando la risultante delle forze esterne che agiscono sul sistema è zero.` },
    { id: 'fc-09', sezione: 'conservazione', tipo: 'formula', fronte: R`La **conservazione della quantità di moto**`, retro: R`In un sistema isolato la quantità di moto totale non cambia: $\vec{p}_A + \vec{p}_B = \vec{p}_A\,' + \vec{p}_B\,'$.` },
    { id: 'fc-10', sezione: 'conservazione', tipo: 'concetto', fronte: R`Da quale principio segue la conservazione della quantità di moto?`, retro: R`Dal terzo: le forze interne sono uguali e opposte e durano lo stesso tempo, quindi danno impulsi opposti.` },
    { id: 'fc-11', sezione: 'conservazione', tipo: 'concetto', fronte: R`Perché un fucile rincula?`, retro: R`Prima dello sparo la quantità di moto totale è zero. Il proiettile va avanti, e il fucile deve andare indietro con quantità di moto uguale e opposta.` },
    { id: 'fc-12', sezione: 'conservazione', tipo: 'concetto', fronte: R`Come fa un razzo ad accelerare nel vuoto?`, retro: R`Spinge indietro i gas di scarico, e i gas spingono il razzo in avanti. Non ha bisogno di aria su cui appoggiarsi.` },
    { id: 'fc-13', sezione: 'urti', tipo: 'concetto', fronte: R`Perché in un urto la quantità di moto si conserva anche se ci sono peso e attrito?`, retro: R`L'urto dura pochissimo: le forze esterne, piccole, danno un impulso trascurabile rispetto a quello delle forze interne.` },
    { id: 'fc-14', sezione: 'urti', tipo: 'definizione', fronte: R`Urto elastico, anelastico, completamente anelastico`, retro: R`In tutti si conserva $p$. Elastico: si conserva anche $E_c$. Anelastico: se ne perde una parte. Completamente anelastico: i corpi restano uniti.` },
    { id: 'fc-15', sezione: 'urti', tipo: 'formula', fronte: R`Velocità finale in un urto **completamente anelastico**`, retro: R`$V = \dfrac{m_A \cdot v_A + m_B \cdot v_B}{m_A + m_B}$: quantità di moto totale diviso massa totale.` },
    { id: 'fc-16', sezione: 'urti', tipo: 'concetto', fronte: R`Dove va l'energia cinetica persa in un urto anelastico?`, retro: R`Diventa energia interna: deformazione e riscaldamento dei corpi, e un poco di suono.` },
    { id: 'fc-17', sezione: 'urto-elastico', tipo: 'formula', fronte: R`Urto elastico frontale con B fermo: le velocità dopo`, retro: R`$v_A' = \dfrac{m_A - m_B}{m_A + m_B} \cdot v_A$ e $v_B' = \dfrac{2 \cdot m_A}{m_A + m_B} \cdot v_A$.` },
    { id: 'fc-18', sezione: 'urto-elastico', tipo: 'concetto', fronte: R`Urto elastico frontale fra masse uguali, una ferma: che cosa succede?`, retro: R`Si scambiano le velocità: chi arriva si ferma, chi era fermo parte con la sua velocità.` },
    { id: 'fc-19', sezione: 'urti-piano', tipo: 'procedura', fronte: R`Come si tratta un urto nel piano?`, retro: R`Si scrive la conservazione per ciascuna componente: $p_x$ prima uguale a $p_x$ dopo, e lo stesso per $p_y$.` },
    { id: 'fc-20', sezione: 'centro-di-massa', tipo: 'definizione', fronte: R`Che cos'è il **centro di massa**?`, retro: R`La media delle posizioni dei corpi pesata con le masse: $x_{cm} = \dfrac{m_A \cdot x_A + m_B \cdot x_B}{m_A + m_B}$.` },
    { id: 'fc-21', sezione: 'centro-di-massa', tipo: 'concetto', fronte: R`Come si muove il centro di massa di un sistema?`, retro: R`Come un punto con tutta la massa, spinto solo dalle forze esterne: $m_{tot} \cdot \vec{a}_{cm} = \vec{F}_{est}$. In un sistema isolato va a velocità costante.` },
    { id: 'fc-22', sezione: 'problemi', tipo: 'procedura', fronte: R`I passi per risolvere un problema di urti`, retro: R`Sistema isolato, verso positivo, quantità di moto prima uguale a dopo, tipo di urto, controllo: $E_c$ finale non più grande di quella iniziale.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un ciclista di 80 kg, bicicletta compresa, va a 5 m/s. Quanto vale la sua quantità di moto?`, suggerimenti: [R`Quantità di moto: massa per velocità.`], risposta: { tipo: 'numero', valore: 400, unita: 'kg·m/s' }, soluzione: [R`$p = m \cdot v = 80\,\text{kg} \cdot 5\,\text{m/s} = 400\,\text{kg} \cdot \text{m/s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una palla di 0,25 kg viaggia a 8 m/s. Quanto vale la sua quantità di moto?`, suggerimenti: [R`$p = m \cdot v$.`], risposta: { tipo: 'numero', valore: 2, unita: 'kg·m/s' }, soluzione: [R`$p = 0{,}25\,\text{kg} \cdot 8\,\text{m/s} = 2\,\text{kg} \cdot \text{m/s}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un corpo di 5 kg ha una quantità di moto di $35\,\text{kg} \cdot \text{m/s}$. Quanto vale la sua velocità?`, suggerimenti: [R`Da $p = m \cdot v$ ricava $v$.`], risposta: { tipo: 'numero', valore: 7, unita: 'm/s' }, soluzione: [R`$v = \dfrac{p}{m} = \dfrac{35\,\text{kg} \cdot \text{m/s}}{5\,\text{kg}} = 7\,\text{m/s}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un ragazzo che corre a 1,5 m/s ha una quantità di moto di $84\,\text{kg} \cdot \text{m/s}$. Qual è la sua massa?`, suggerimenti: [R`Da $p = m \cdot v$ ricava $m$.`], risposta: { tipo: 'numero', valore: 56, unita: 'kg' }, soluzione: [R`$m = \dfrac{p}{v} = \dfrac{84\,\text{kg} \cdot \text{m/s}}{1{,}5\,\text{m/s}} = 56\,\text{kg}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una forza di 250 N agisce su un corpo per 0,2 s. Quanto vale il suo impulso?`, suggerimenti: [R`Impulso: forza per tempo.`], risposta: { tipo: 'numero', valore: 50, unita: 'N·s' }, soluzione: [R`$I = F \cdot \Delta t = 250\,\text{N} \cdot 0{,}2\,\text{s} = 50\,\text{N} \cdot \text{s}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un carrello di 0,8 kg passa da 2 m/s a 7 m/s, sempre nello stesso verso. Di quanto cambia la sua quantità di moto?`, suggerimenti: [R`$\Delta p = m \cdot (v' - v)$.`], risposta: { tipo: 'numero', valore: 4, unita: 'kg·m/s' }, soluzione: [R`$\Delta p = 0{,}8\,\text{kg} \cdot (7 - 2)\,\text{m/s} = 0{,}8 \cdot 5 = 4\,\text{kg} \cdot \text{m/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`In un urto la quantità di moto di una palla cambia di $12\,\text{kg} \cdot \text{m/s}$ in 0,04 s. Quanto vale la forza media che ha ricevuto?`, suggerimenti: [R`Teorema dell'impulso: $F \cdot \Delta t = \Delta p$.`], risposta: { tipo: 'numero', valore: 300, unita: 'N' }, soluzione: [R`$F = \dfrac{\Delta p}{\Delta t} = \dfrac{12\,\text{kg} \cdot \text{m/s}}{0{,}04\,\text{s}} = 300\,\text{N}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una forza costante di 150 N dà a un corpo un impulso di $45\,\text{N} \cdot \text{s}$. Per quanto tempo ha agito?`, suggerimenti: [R`Da $I = F \cdot \Delta t$ ricava $\Delta t$.`], risposta: { tipo: 'numero', valore: 0.3, unita: 's' }, soluzione: [R`$\Delta t = \dfrac{I}{F} = \dfrac{45\,\text{N} \cdot \text{s}}{150\,\text{N}} = 0{,}3\,\text{s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un disco da hockey di 1,5 kg, fermo, riceve un impulso di $9\,\text{N} \cdot \text{s}$. Con che velocità parte? Trascura l'attrito.`, suggerimenti: [R`L'impulso è uguale alla variazione della quantità di moto, e all'inizio $p = 0$.`], risposta: { tipo: 'numero', valore: 6, unita: 'm/s' }, soluzione: [R`$\Delta p = I = 9\,\text{kg} \cdot \text{m/s}$, quindi $v = \dfrac{9\,\text{kg} \cdot \text{m/s}}{1{,}5\,\text{kg}} = 6\,\text{m/s}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 2, testo: R`Una palla di 0,3 kg arriva contro un muro a 5 m/s e rimbalza indietro a 5 m/s. Quanto vale il modulo della variazione della sua quantità di moto?`, suggerimenti: [R`Scegli un verso positivo: dopo il rimbalzo la velocità ha il segno opposto.`, R`$\Delta p = m \cdot (v' - v)$ con $v = +5$ e $v' = -5$.`], risposta: { tipo: 'numero', valore: 3, unita: 'kg·m/s' }, soluzione: [R`$\Delta p = 0{,}3\,\text{kg} \cdot (-5 - 5)\,\text{m/s} = -3\,\text{kg} \cdot \text{m/s}$.`, R`Il modulo è $3\,\text{kg} \cdot \text{m/s}$: il doppio di quello che servirebbe solo per fermarla.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Due carrelli fermi sono tenuti insieme da una molla compressa. Si liberano: A, di 1,5 kg, parte a 5 m/s. B ha massa 2,5 kg. Con che velocità parte B?`, suggerimenti: [R`Prima la quantità di moto totale era zero: anche dopo deve esserlo.`], risposta: { tipo: 'numero', valore: 3, unita: 'm/s' }, soluzione: [R`$m_A \cdot v_A = m_B \cdot v_B$ in modulo: $1{,}5 \cdot 5 = 7{,}5\,\text{kg} \cdot \text{m/s}$.`, R`$v_B = \dfrac{7{,}5\,\text{kg} \cdot \text{m/s}}{2{,}5\,\text{kg}} = 3\,\text{m/s}$, nel verso opposto ad A.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un fucile di 5 kg spara un proiettile di 20 g a 350 m/s. Con che velocità rincula il fucile?`, suggerimenti: [R`Porta la massa del proiettile in chilogrammi: 20 g = 0,02 kg.`, R`Le quantità di moto del fucile e del proiettile sono uguali e opposte.`], risposta: { tipo: 'numero', valore: 1.4, unita: 'm/s' }, soluzione: [R`$p = 0{,}02\,\text{kg} \cdot 350\,\text{m/s} = 7\,\text{kg} \cdot \text{m/s}$.`, R`$v = \dfrac{7\,\text{kg} \cdot \text{m/s}}{5\,\text{kg}} = 1{,}4\,\text{m/s}$, all'indietro.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un carrello di 3 kg a 8 m/s urta un carrello fermo di 1 kg. Restano agganciati. Con che velocità ripartono?`, suggerimenti: [R`Urto completamente anelastico: quantità di moto totale diviso massa totale.`], risposta: { tipo: 'numero', valore: 6, unita: 'm/s' }, soluzione: [R`$V = \dfrac{3\,\text{kg} \cdot 8\,\text{m/s}}{3\,\text{kg} + 1\,\text{kg}} = \dfrac{24}{4}\,\text{m/s} = 6\,\text{m/s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Un carrello di 2 kg a 6 m/s tampona un carrello di 2 kg che va a 2 m/s nello stesso verso. Restano agganciati. Con che velocità proseguono?`, suggerimenti: [R`Somma le due quantità di moto: vanno tutte e due nello stesso verso.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s' }, soluzione: [R`$p = 2 \cdot 6 + 2 \cdot 2 = 16\,\text{kg} \cdot \text{m/s}$.`, R`$V = \dfrac{16\,\text{kg} \cdot \text{m/s}}{4\,\text{kg}} = 4\,\text{m/s}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Un carrello A di 5 kg va a 2 m/s verso destra. Un carrello B di 1 kg va a 4 m/s verso sinistra. Si scontrano e restano uniti. Con che velocità si muovono?`, suggerimenti: [R`Verso positivo a destra: la velocità di B è negativa.`, R`$V = \dfrac{5 \cdot 2 + 1 \cdot (-4)}{6}$.`], risposta: { tipo: 'numero', valore: 1, unita: 'm/s' }, soluzione: [R`$p = 5 \cdot 2 + 1 \cdot (-4) = 6\,\text{kg} \cdot \text{m/s}$.`, R`$V = \dfrac{6\,\text{kg} \cdot \text{m/s}}{6\,\text{kg}} = 1\,\text{m/s}$, verso destra.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Un carrello di 4 kg a 5 m/s urta un carrello fermo di 1 kg, e restano uniti a 4 m/s. Quanta energia cinetica si perde nell'urto?`, suggerimenti: [R`Calcola $E_c$ prima e dopo, con $E_c = \tfrac{1}{2} \cdot m \cdot v^2$.`, R`Dopo l'urto la massa che si muove è 5 kg.`], risposta: { tipo: 'numero', valore: 10, unita: 'J' }, soluzione: [R`Prima: $\tfrac{1}{2} \cdot 4 \cdot 5^2 = 50\,\text{J}$.`, R`Dopo: $\tfrac{1}{2} \cdot 5 \cdot 4^2 = 40\,\text{J}$.`, R`Si perdono $50 - 40 = 10\,\text{J}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una biglia a 2 m/s colpisce frontalmente una biglia identica, ferma. L'urto è elastico. Con che velocità parte la seconda biglia?`, suggerimenti: [R`Masse uguali, urto elastico frontale: che cosa succede alle velocità?`], risposta: { tipo: 'numero', valore: 2, unita: 'm/s' }, soluzione: [R`Con masse uguali le biglie si scambiano le velocità: la prima si ferma, la seconda parte a $2\,\text{m/s}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Un carrello A di 3 kg a 2 m/s urta frontalmente un carrello B di 1 kg, fermo. L'urto è elastico. Con che velocità parte B?`, suggerimenti: [R`$v_B' = \dfrac{2 \cdot m_A}{m_A + m_B} \cdot v_A$.`], risposta: { tipo: 'numero', valore: 3, unita: 'm/s' }, soluzione: [R`$v_B' = \dfrac{2 \cdot 3}{3 + 1} \cdot 2\,\text{m/s} = \dfrac{6}{4} \cdot 2\,\text{m/s} = 3\,\text{m/s}$.`, R`Intanto A prosegue a $\dfrac{3 - 1}{4} \cdot 2 = 1\,\text{m/s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Su una retta un corpo di 2 kg sta in $x = 1\,\text{m}$ e uno di 3 kg sta in $x = 6\,\text{m}$. Dove si trova il centro di massa?`, suggerimenti: [R`Media delle posizioni pesata con le masse.`], risposta: { tipo: 'numero', valore: 4, unita: 'm' }, soluzione: [R`$x_{cm} = \dfrac{2 \cdot 1 + 3 \cdot 6}{2 + 3}\,\text{m} = \dfrac{20}{5}\,\text{m} = 4\,\text{m}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un carrello di 3 kg va a 6 m/s, un altro di 1 kg è fermo. Con che velocità si muove il centro di massa dei due?`, suggerimenti: [R`$v_{cm}$ è la quantità di moto totale divisa per la massa totale.`], risposta: { tipo: 'numero', valore: 4.5, unita: 'm/s' }, soluzione: [R`$v_{cm} = \dfrac{3 \cdot 6 + 1 \cdot 0}{4}\,\text{m/s} = \dfrac{18}{4}\,\text{m/s} = 4{,}5\,\text{m/s}$. Se si urtano, anche dopo il centro di massa va a 4,5 m/s.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una mazza da golf colpisce una pallina ferma di 46 g. La pallina parte a 60 m/s, e il contatto dura mezzo millesimo di secondo. Quanto vale la forza media della mazza?`, suggerimenti: [R`Masse in chilogrammi, tempi in secondi: $0{,}046\,\text{kg}$ e $0{,}0005\,\text{s}$.`, R`$F = \dfrac{\Delta p}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 5520, unita: 'N' }, soluzione: [R`$\Delta p = 0{,}046\,\text{kg} \cdot 60\,\text{m/s} = 2{,}76\,\text{kg} \cdot \text{m/s}$.`, R`$F = \dfrac{2{,}76\,\text{N} \cdot \text{s}}{0{,}0005\,\text{s}} = 5520\,\text{N}$: circa dodicimila volte il peso della pallina.`] },
    { id: 'es-02', difficolta: 3, testo: R`Una persona di 70 kg salta giù da un muretto e tocca terra a 4 m/s. Piegando le ginocchia si ferma in 0,25 s. Quanto vale la forza media del suolo sui suoi piedi?`, suggerimenti: [R`Il teorema dell'impulso dà la forza **risultante**. Sulla persona agiscono il suolo, verso l'alto, e il peso, verso il basso.`, R`Risultante $= \Delta p / \Delta t$, e forza del suolo $=$ risultante $+$ peso.`], risposta: { tipo: 'numero', valore: 1806, unita: 'N' }, soluzione: [R`Verso positivo in alto. $\Delta p = 70 \cdot (0 - (-4)) = 280\,\text{kg} \cdot \text{m/s}$.`, R`Risultante: $\dfrac{280\,\text{N} \cdot \text{s}}{0{,}25\,\text{s}} = 1120\,\text{N}$ verso l'alto.`, R`Peso: $70 \cdot 9{,}8 = 686\,\text{N}$. Il suolo spinge con $1120 + 686 = 1806\,\text{N}$, più di due volte e mezzo il peso.`] },
    { id: 'es-03', difficolta: 2, testo: R`Su una palla ferma di 0,5 kg agisce una forza che cresce in modo uniforme da 0 a 400 N in 0,05 s. Poi torna a zero, in modo uniforme, in altri 0,05 s. Con che velocità parte la palla?`, suggerimenti: [R`L'impulso è l'area sotto il grafico forza–tempo. Qui è un triangolo.`, R`Base $0{,}1\,\text{s}$, altezza $400\,\text{N}$.`], risposta: { tipo: 'numero', valore: 40, unita: 'm/s' }, soluzione: [R`Impulso: area del triangolo, $\dfrac{0{,}1\,\text{s} \cdot 400\,\text{N}}{2} = 20\,\text{N} \cdot \text{s}$.`, R`$v = \dfrac{20\,\text{kg} \cdot \text{m/s}}{0{,}5\,\text{kg}} = 40\,\text{m/s}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un cannone di 800 kg, libero di scorrere su rotaie orizzontali, spara una palla di 8 kg a 150 m/s, inclinata di 30° sopra l'orizzontale. Con che velocità rincula il cannone?`, suggerimenti: [R`In verticale le rotaie spingono il cannone: lungo $y$ il sistema non è isolato. In orizzontale sì.`, R`Conta solo la componente orizzontale della velocità della palla: $150 \cdot \cos 30°$.`], risposta: { tipo: 'numero', valore: 1.3, unita: 'm/s' }, soluzione: [R`Componente orizzontale della palla: $150 \cdot \cos 30° \approx 129{,}9\,\text{m/s}$.`, R`Lungo $x$: $0 = 8 \cdot 129{,}9 + 800 \cdot v$, quindi $v \approx -1{,}3\,\text{m/s}$.`, R`Il cannone rincula a circa $1{,}3\,\text{m/s}$. La quantità di moto verticale la assorbono le rotaie, cioè la Terra.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un proiettile di 15 g a 300 m/s si conficca in un blocco di 2,985 kg appeso a due fili. Di quanti centimetri sale il blocco?`, suggerimenti: [R`Prima l'urto (si conserva la quantità di moto), poi la salita (si conserva l'energia meccanica).`, R`Massa dopo l'urto: $3\,\text{kg}$. Nella salita $h = \dfrac{V^2}{2 \cdot g}$.`], risposta: { tipo: 'numero', valore: 11.5, unita: 'cm', tolleranza: 0.2 }, soluzione: [R`Urto: $V = \dfrac{0{,}015 \cdot 300}{3}\,\text{m/s} = 1{,}5\,\text{m/s}$.`, R`Salita: $h = \dfrac{1{,}5^2}{2 \cdot 9{,}8}\,\text{m} \approx 0{,}115\,\text{m} = 11{,}5\,\text{cm}$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Nei reattori nucleari i neutroni si rallentano facendoli urtare contro nuclei di carbonio, 12 volte più pesanti. In un urto elastico frontale con un nucleo fermo, che percentuale della sua energia cinetica perde il neutrone?`, suggerimenti: [R`Usa $v_A' = \dfrac{m_A - m_B}{m_A + m_B} \cdot v_A$ con $m_B = 12 \cdot m_A$.`, R`L'energia cinetica va con il quadrato della velocità.`], risposta: { tipo: 'numero', valore: 28.4, unita: '%', tolleranza: 0.5 }, soluzione: [R`$v_A' = \dfrac{1 - 12}{13} \cdot v_A \approx -0{,}846 \cdot v_A$: il neutrone rimbalza.`, R`Energia che gli resta: $0{,}846^2 \approx 0{,}716$, cioè il 71,6%.`, R`Ne perde circa il $28{,}4\%$, che passa al nucleo di carbonio.`] },
    { id: 'es-07', difficolta: 3, testo: R`A un incrocio un'auto di 900 kg va verso est a 20 m/s. Un furgone di 1800 kg va verso nord a 10 m/s. Si scontrano e restano incastrati. Con che velocità si muovono subito dopo?`, suggerimenti: [R`Conserva separatamente le componenti: $p_x$ viene solo dall'auto, $p_y$ solo dal furgone.`, R`Il modulo della quantità di moto totale si trova con il teorema di Pitagora.`], risposta: { tipo: 'numero', valore: 9.43, unita: 'm/s' }, soluzione: [R`$p_x = 900 \cdot 20 = 18\,000\,\text{kg} \cdot \text{m/s}$, $p_y = 1800 \cdot 10 = 18\,000\,\text{kg} \cdot \text{m/s}$.`, R`$p = \sqrt{18\,000^2 + 18\,000^2} \approx 25\,456\,\text{kg} \cdot \text{m/s}$.`, R`$V = \dfrac{25\,456}{2700}\,\text{m/s} \approx 9{,}43\,\text{m/s}$, verso nord-est, a 45°.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un oggetto di 3 kg, fermo, esplode in due pezzi. Il pezzo di 1 kg parte a 12 m/s. Quanta energia cinetica ha liberato l'esplosione?`, suggerimenti: [R`Prima trova la velocità dell'altro pezzo: la quantità di moto totale resta zero.`, R`L'altro pezzo ha massa 2 kg.`], risposta: { tipo: 'numero', valore: 108, unita: 'J' }, soluzione: [R`$1 \cdot 12 = 2 \cdot v$, quindi il pezzo di 2 kg parte a $6\,\text{m/s}$ nel verso opposto.`, R`Energia cinetica: $\tfrac{1}{2} \cdot 1 \cdot 12^2 + \tfrac{1}{2} \cdot 2 \cdot 6^2 = 72 + 36 = 108\,\text{J}$. Prima era zero: viene dall'energia chimica.`] },
    { id: 'es-09', difficolta: 2, testo: R`La Terra ha massa $5{,}97 \cdot 10^{24}\,\text{kg}$, la Luna $7{,}35 \cdot 10^{22}\,\text{kg}$. I loro centri distano $3{,}84 \cdot 10^5\,\text{km}$. A quanti chilometri dal centro della Terra si trova il centro di massa dei due?`, suggerimenti: [R`Metti l'origine nel centro della Terra: il suo termine nella media vale zero.`, R`$x_{cm} = \dfrac{m_L \cdot r}{m_T + m_L}$, con $r$ la distanza fra i centri.`], risposta: { tipo: 'numero', valore: 4670, unita: 'km' }, soluzione: [R`$x_{cm} = \dfrac{7{,}35 \cdot 10^{22} \cdot 3{,}84 \cdot 10^5}{5{,}97 \cdot 10^{24} + 7{,}35 \cdot 10^{22}}\,\text{km} \approx 4670\,\text{km}$.`, R`Il raggio della Terra è circa 6370 km: il centro di massa sta dentro la Terra. Attorno a quel punto girano tutte e due.`] },
    { id: 'es-10', difficolta: 2, testo: R`Un proiettile di 2 kg, nel punto più alto della traiettoria, va in orizzontale a 10 m/s. Lì si spezza in due metà uguali. Una metà resta per un istante ferma e poi cade in verticale. Con che velocità parte l'altra metà?`, suggerimenti: [R`Durante lo scoppio il peso conta poco: la quantità di moto orizzontale si conserva.`], risposta: { tipo: 'numero', valore: 20, unita: 'm/s' }, soluzione: [R`Prima: $p = 2 \cdot 10 = 20\,\text{kg} \cdot \text{m/s}$ in orizzontale.`, R`Dopo: $1 \cdot 0 + 1 \cdot v = 20$, quindi $v = 20\,\text{m/s}$ in orizzontale, il doppio di prima.`] },
    { id: 'es-11', difficolta: 3, testo: R`Il motore di un razzo di 5000 kg espelle 50 kg di gas al secondo, a 2000 m/s verso il basso. Il razzo parte in verticale dalla rampa. Quanto vale la sua accelerazione alla partenza?`, suggerimenti: [R`La spinta è la quantità di moto data ai gas in ogni secondo.`, R`Sul razzo agiscono la spinta, verso l'alto, e il peso, verso il basso.`], risposta: { tipo: 'numero', valore: 10.2, unita: 'm/s²' }, soluzione: [R`Spinta: $F = \dfrac{\Delta p}{\Delta t} = 50\,\text{kg/s} \cdot 2000\,\text{m/s} = 100\,000\,\text{N}$.`, R`Peso: $5000 \cdot 9{,}8 = 49\,000\,\text{N}$. Risultante: $51\,000\,\text{N}$ verso l'alto.`, R`$a = \dfrac{51\,000\,\text{N}}{5000\,\text{kg}} = 10{,}2\,\text{m/s}^2$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`In che unità si misura la quantità di moto?`, opzioni: [R`$\text{kg} \cdot \text{m/s}$`, R`$\text{kg} \cdot \text{m/s}^2$`, R`$\text{N/s}$`, R`$\text{J}$`], corretta: 0, spiegazione: R`Massa per velocità: $\text{kg} \cdot \text{m/s}$, che è anche $\text{N} \cdot \text{s}$. $\text{kg} \cdot \text{m/s}^2$ è il newton, una forza; il joule è un'energia.` },
    { id: 'q-02', domanda: R`Un camion lento e un'auto veloce hanno la stessa quantità di moto. Chi ha più energia cinetica?`, opzioni: [R`L'auto`, R`Il camion`, R`Hanno la stessa energia cinetica`, R`Dipende dal verso in cui vanno`], corretta: 0, spiegazione: R`Con $p$ uguale, $E_c = \dfrac{p^2}{2 \cdot m}$: chi ha meno massa ha più energia. L'energia cinetica non dipende dal verso.` },
    { id: 'q-03', domanda: R`In un incidente, che cosa riduce l'airbag?`, opzioni: [R`La variazione della quantità di moto del passeggero`, R`L'impulso che il passeggero riceve`, R`La velocità del passeggero prima dell'urto`, R`La forza media sul passeggero`], corretta: 3, spiegazione: R`Il passeggero si ferma comunque: $\Delta p$ e l'impulso sono gli stessi. L'airbag allunga il tempo della frenata, e la forza media $\Delta p / \Delta t$ cala.` },
    { id: 'q-04', domanda: R`Due palle uguali arrivano su un muro alla stessa velocità. Una si ferma lì, l'altra rimbalza. Quale riceve dal muro l'impulso più grande?`, opzioni: [R`Ricevono lo stesso impulso`, R`Quella che rimbalza`, R`Quella che si ferma`, R`Quella che rimbalza riceve impulso zero`], corretta: 1, spiegazione: R`L'impulso è $\Delta p$. Per fermarsi la palla perde $m \cdot v$; per rimbalzare deve anche ripartire all'indietro, e $\Delta p$ arriva fino a $2 \cdot m \cdot v$.` },
    { id: 'q-05', domanda: R`Quando un sistema di corpi si dice isolato?`, opzioni: [R`Quando i corpi non si toccano`, R`Quando su di esso non agisce nessuna forza`, R`Quando la risultante delle forze esterne è zero`, R`Quando le forze interne si annullano`], corretta: 2, spiegazione: R`Conta la risultante delle forze esterne. Le forze interne si annullano sempre a coppie, per il terzo principio. Possono agire forze esterne, purché si facciano equilibrio.` },
    { id: 'q-06', domanda: R`Come fa un razzo ad accelerare nel vuoto dello spazio?`, opzioni: [R`Spinge indietro i gas di scarico, e i gas spingono il razzo in avanti`, R`I gas spingono contro l'aria dietro il razzo`, R`Non può: nel vuoto un razzo non accelera`, R`Nello spazio la gravità lo tira in avanti`], corretta: 0, spiegazione: R`La quantità di moto dei gas verso dietro è uguale a quella guadagnata dal razzo in avanti. Non serve l'aria: anzi, nel vuoto non c'è niente che lo frena.` },
    { id: 'q-07', domanda: R`Due corpi si urtano e restano attaccati. Che cosa si conserva?`, opzioni: [R`Solo l'energia cinetica`, R`Sia la quantità di moto sia l'energia cinetica`, R`Niente`, R`Solo la quantità di moto`], corretta: 3, spiegazione: R`È un urto completamente anelastico: la quantità di moto si conserva, perché le forze sono interne. L'energia cinetica cala: una parte diventa energia interna.` },
    { id: 'q-08', domanda: R`Una biglia urta frontalmente una biglia identica, ferma. L'urto è elastico. Che cosa succede?`, opzioni: [R`La prima si ferma e la seconda parte con la sua velocità`, R`Ripartono insieme a metà velocità`, R`La prima torna indietro alla stessa velocità`, R`La seconda parte al doppio della velocità`], corretta: 0, spiegazione: R`Con masse uguali le due formule danno $v_A' = 0$ e $v_B' = v_A$: si scambiano le velocità. Ripartire insieme a metà velocità farebbe perdere metà dell'energia.` },
    { id: 'q-09', domanda: R`Nel pendolo di Newton lanci una biglia: dall'altra parte ne parte una sola. Perché non due a metà velocità?`, opzioni: [R`Perché le biglie centrali sono incollate`, R`Perché solo così tornano sia la quantità di moto sia l'energia cinetica`, R`Per l'attrito dell'aria`, R`Per caso: potrebbero partirne due`], corretta: 1, spiegazione: R`Due biglie a metà velocità avrebbero la stessa quantità di moto, ma metà energia cinetica. In un urto quasi elastico deve tornare anche l'energia: ne parte una, alla stessa velocità.` },
    { id: 'q-10', domanda: R`In un urto anelastico l'energia cinetica totale cala. Dove va a finire?`, opzioni: [R`Sparisce: in un urto l'energia non si conserva`, R`Diventa quantità di moto`, R`Diventa energia interna e suono`, R`Torna dopo, quando i corpi si fermano`], corretta: 2, spiegazione: R`L'energia totale si conserva sempre: quella cinetica persa deforma e scalda i corpi, e fa rumore. Quantità di moto ed energia sono grandezze diverse: una non si trasforma nell'altra.` },
    { id: 'q-11', domanda: R`Un fuoco d'artificio esplode in volo, senza aria. Che cosa fa il centro di massa dei pezzi, prima che tocchino terra?`, opzioni: [R`Cade in verticale dal punto dell'esplosione`, R`Si ferma nel punto dell'esplosione`, R`Continua sulla parabola di prima`, R`Sale più in alto, spinto dall'esplosione`], corretta: 2, spiegazione: R`Le forze dell'esplosione sono interne e non cambiano il moto del centro di massa. Su di esso agisce solo il peso, come prima: la parabola continua.` },
    { id: 'q-12', domanda: R`Due corpi di massa uguale si vengono incontro alla stessa velocità. Quanto valgono la quantità di moto totale e l'energia cinetica totale?`, opzioni: [R`Tutte e due zero`, R`Quantità di moto zero, energia cinetica non zero`, R`Quantità di moto doppia, energia cinetica zero`, R`Tutte e due doppie di quelle di un corpo`], corretta: 1, spiegazione: R`Le quantità di moto sono vettori opposti: la somma è zero. L'energia cinetica non ha verso ed è sempre positiva: le due energie si sommano.` },
    { id: 'q-13', domanda: R`Una forza costante agisce per un certo tempo. Se la forza raddoppia e il tempo resta lo stesso, la variazione della quantità di moto…`, opzioni: [R`resta uguale`, R`si dimezza`, R`diventa quattro volte tanto`, R`raddoppia`], corretta: 3, spiegazione: R`$\Delta p = F \cdot \Delta t$: è proporzionale alla forza. Forza doppia, stesso tempo, variazione doppia.` },
    { id: 'q-14', domanda: R`Due dischi si urtano su un tavolo da air hockey, in direzioni diverse. Che cosa si conserva?`, opzioni: [R`Solo il modulo della quantità di moto del disco più veloce`, R`La somma dei moduli delle quantità di moto`, R`Solo la componente lungo la direzione del primo disco`, R`Ogni componente della quantità di moto totale`], corretta: 3, spiegazione: R`La quantità di moto totale si conserva come vettore, quindi si conservano $p_x$ e $p_y$ separatamente. La somma dei moduli in generale cambia.` },
    { id: 'q-15', domanda: R`Due pattinatori fermi sul ghiaccio liscio, di 80 kg e di 40 kg, tirano i due capi di una corda. Dove si incontrano?`, opzioni: [R`A metà strada`, R`Più vicino a dove stava il pattinatore di 80 kg`, R`Dove stava il pattinatore di 40 kg`, R`Dipende da chi tira più forte`], corretta: 1, spiegazione: R`Le forze della corda sono interne: il centro di massa resta fermo, e i due si incontrano lì. È più vicino al più pesante, a un terzo della distanza. Chi tira più forte non conta, perché per il terzo principio le due forze sono uguali.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`La quantità di moto ha un verso. Prima di tutto scegli il verso positivo: chi va dall'altra parte ha velocità negativa.` },
    { tipo: 'errore', testo: R`Negli urti anelastici non si perde quantità di moto: si perde energia cinetica. La quantità di moto torna sempre.` },
    { tipo: 'errore', testo: R`Una palla che rimbalza alla stessa velocità non ha $\Delta p = 0$: ha $\Delta p = -2 \cdot m \cdot v$.` },
    { tipo: 'errore', testo: R`Nel pendolo balistico l'energia cinetica non si conserva nell'urto. Si usa la quantità di moto per l'urto, l'energia solo per la salita.` },
    { tipo: 'trucco', testo: R`Dopo un urto, controlla l'energia cinetica: non può essere più grande di prima. Se lo è, c'è un errore, quasi sempre un segno.` },
    { tipo: 'trucco', testo: R`Masse uguali, urto elastico frontale, una ferma: si scambiano le velocità. Non serve fare conti.` },
    { tipo: 'metodo', testo: R`Negli urti nel piano scrivi due equazioni: una per le componenti lungo $x$, una per quelle lungo $y$.` },
    { tipo: 'metodo', testo: R`Il teorema dell'impulso dà la forza risultante. Se cerchi la forza del suolo o di un muro, aggiungi o togli le altre forze, come il peso.` }
  ],
  aneddoti: [
    { fisico: 'René Descartes', anni: '1596–1650', titolo: 'La quantità di moto senza verso', testo: R`Nel 1644 René Descartes, per noi Cartesio, pubblicò i *Principia philosophiae*. Vi sosteneva che Dio, creando il mondo, ci avesse messo una certa quantità di moto. E questa quantità non sarebbe mai cambiata. La calcolava come grandezza del corpo per la sua velocità, ma senza tenere conto del verso. Da qui ricavò sette regole per gli urti. Una diceva che un corpo fermo non può essere smosso da uno più piccolo, per quanto veloce. L'esperienza la smentisce subito: una biglia piccola sposta benissimo una biglia grande. Cartesio rispondeva che le sue regole valevano per corpi ideali, nel vuoto. L'idea della conservazione era giusta. Mancava il verso.`, legame: R`La quantità di moto che si conserva è un vettore: senza il verso, i conti degli urti non tornano.` },
    { fisico: 'Christiaan Huygens', anni: '1629–1695', titolo: 'Gli urti visti da una barca', testo: R`Nel 1668 la Royal Society di Londra chiese agli studiosi d'Europa le leggi degli urti. Risposero in tre, fra la fine del 1668 e l'inizio del 1669. Il matematico John Wallis studiò i corpi che restano uniti. L'architetto Christopher Wren e l'olandese Christiaan Huygens studiarono quelli che rimbalzano, e trovarono le stesse regole. Huygens usava un'idea brillante. Immaginava l'urto osservato da un uomo su una barca che scivola lungo un canale. Per lui le regole devono essere le stesse che per chi guarda dalla riva. Trovò due grandezze che non cambiano: la somma delle quantità di moto, con il segno, e la somma delle masse per il quadrato delle velocità.`, legame: R`Sono le due leggi dell'urto elastico: si conservano la quantità di moto e l'energia cinetica.` },
    { fisico: 'Robert Goddard', anni: '1882–1945', titolo: 'La correzione arrivata con l\'Apollo 11', testo: R`Il 13 gennaio 1920 il *New York Times* prese in giro Robert Goddard, un professore del Massachusetts che studiava i razzi. Secondo il giornale, nel vuoto un razzo non poteva funzionare: non avrebbe avuto niente su cui spingere. L'articolo aggiungeva che a Goddard mancavano le nozioni insegnate al liceo. Goddard continuò a lavorare. Il 16 marzo 1926, in un campo di Auburn, lanciò il primo razzo a combustibile liquido. Volò per due secondi e mezzo e salì di circa 12 metri. Goddard morì nel 1945. Il 17 luglio 1969, il giorno dopo la partenza dell'Apollo 11, il giornale pubblicò una correzione: il razzo funziona anche nel vuoto.`, legame: R`Il razzo non spinge l'aria: spinge i propri gas, e la quantità di moto totale si conserva.` },
    { fisico: 'John Paul Stapp', anni: '1910–1999', titolo: 'L\'uomo più veloce sulla Terra', testo: R`John Paul Stapp era medico e ufficiale dell'aviazione americana. Voleva sapere quanta decelerazione può sopportare un corpo umano. Allora molti pensavano che oltre 18 volte $g$ si morisse. Per scoprirlo fece lui stesso da cavia su una slitta a razzo, lanciata su rotaie e frenata dall'acqua. Il 10 dicembre 1954, nel deserto del New Mexico, la slitta arrivò a circa 1017 km/h. Poi si fermò in 1,4 secondi. Stapp subì per un istante una decelerazione di 46 volte $g$, e sopravvisse. Ebbe gli occhi feriti e per qualche tempo vide male, ma guarì. Poi si batté perché le auto avessero le cinture di sicurezza.`, legame: R`Fermarsi in poco tempo vuol dire forze enormi: la forza media è $\Delta p / \Delta t$.` }
  ]
});
})();
