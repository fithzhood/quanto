/* Quanto — Vettori (primo anno; prodotto scalare e vettoriale dal terzo). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/vettori.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'vettori',
  titolo: 'Vettori',
  introduzione: R`Alcune grandezze si dicono con un numero e la sua unità: una massa di 3 kg, una temperatura di 20 °C, un tempo di 10 s. Si chiamano **scalari**. Per altre il numero non basta. Se ti dico «cammina 5 km», non sai ancora dove arrivi. Ti serve sapere anche verso dove.

Queste grandezze si chiamano **vettori** e si disegnano con una freccia. Sono vettori lo spostamento, la velocità, l'accelerazione, la forza. Per sommarli non basta fare $3 + 4$: conta anche l'angolo fra le frecce. Due forze da 3 N e 4 N possono dare 7 N, 1 N, oppure 5 N.

Qui si impara a disegnare un vettore, a sommarlo con un altro e a scomporlo lungo due assi. Servono il teorema di Pitagora, un po' di disegno e la calcolatrice per il seno e il coseno. Le ultime due sezioni, prodotto scalare e prodotto vettoriale, sono del terzo anno: servono per il lavoro e per il momento di una forza.`,
  inBreve: [
    R`Uno **scalare** è un numero con l'unità (massa, tempo, temperatura). Un **vettore** ha **modulo**, **direzione** e **verso**, e si disegna con una freccia.`,
    R`I vettori si sommano **punta-coda**, o con la regola del **parallelogramma**. Il risultato dipende dall'angolo: sta fra la differenza e la somma dei moduli.`,
    R`Solo per due vettori **perpendicolari** il modulo della somma si trova con Pitagora: 3 e 4 danno 5.`,
    R`Un vettore si scompone lungo gli assi: $F_x = F \cdot \cos\alpha$ e $F_y = F \cdot \sin\alpha$, con $\alpha$ misurato dall'asse $x$. Per sommare i vettori si sommano le componenti.`,
    R`Dal terzo anno: il **prodotto scalare** $a \cdot b \cdot \cos\alpha$ è un numero (il lavoro); il **prodotto vettoriale** è un vettore perpendicolare, lungo $a \cdot b \cdot \sin\alpha$ (il momento).`
  ],
  sezioni: [
    {
      id: 'scalari-vettori',
      titolo: 'Scalari e vettori',
      testo: R`Due amiche partono dallo stesso punto e camminano 5 km ciascuna. Una va dritta verso est, l'altra verso nord. Hanno fatto la stessa strada, ma arrivano in due posti diversi.

[[video:vettori/spostamento]]

Per dire dove arriva una persona non basta un numero. Serve una freccia che parte dal punto di partenza. La freccia dice quanto è lungo lo spostamento, lungo quale retta avviene, e verso quale parte.

>* Un **vettore** è una grandezza descritta da tre cose. Il **modulo** è la lunghezza della freccia, e non è mai negativo. La **direzione** è la retta su cui sta. Il **verso** dice dove punta.

Nel disegno ci sono tre passeggiate da 5 km. Le frecce verso est e verso ovest hanno la stessa direzione, la retta est–ovest, ma verso opposto. La freccia verso nord ha un'altra direzione.

[[grafico:passeggiate]]

Una grandezza che si dice con un numero e l'unità si chiama **scalare**. Sono scalari la massa, il tempo, la temperatura, l'energia. Anche la **strada percorsa** è uno scalare. Sono vettori lo spostamento, la velocità, l'accelerazione e la forza.

Facciamo un giro: 1 km a nord, 4 km a est, 1 km a sud. La strada percorsa è $1 + 4 + 1 = 6\,\text{km}$. Lo spostamento invece va dritto dalla partenza all'arrivo: 4 km verso est.

[[grafico:giro]]

>! Lo spostamento non è la strada percorsa. Chi va a scuola e torna a casa ha percorso molti metri, ma il suo spostamento è zero.

?? Quale di queste grandezze è un vettore?
[ ] la massa di un sacco di farina
[ ] la temperatura di una stanza
[x] la forza con cui spingi un carrello
[ ] il tempo di una gara
=> Per una forza bisogna dire quanto spinge e in che direzione e verso. Massa, temperatura e tempo sono scalari: basta un numero con l'unità.`
    },
    {
      id: 'somma',
      titolo: 'La somma: punta-coda e parallelogramma',
      testo: R`Cammino 3 km verso est e poi 4 km verso nord. La strada percorsa è di 7 km. Ma a che distanza sono dal punto di partenza?

Lo spostamento totale va dritto dalla partenza all'arrivo. È l'ipotenusa di un triangolo rettangolo con i cateti di 3 km e 4 km. Per il teorema di Pitagora è lungo 5 km, non 7.

~ \Delta s = \sqrt{(3\,\text{km})^2 + (4\,\text{km})^2} :: i due spostamenti sono perpendicolari: vale Pitagora
~ \Delta s = \sqrt{9 + 16}\,\text{km} = \sqrt{25}\,\text{km} :: i quadrati dei cateti, sommati
~ \Delta s = \evidb{5\,\text{km}} :: lo spostamento totale, fra nord ed est

[[video:vettori/somma]]

>* **Regola punta-coda.** Per sommare due vettori $\vec{a}$ e $\vec{b}$ si mette la coda di $\vec{b}$ sulla punta di $\vec{a}$. La somma $\vec{a} + \vec{b}$ va dalla coda di $\vec{a}$ alla punta di $\vec{b}$.

La freccia sopra la lettera ricorda che si sommano due frecce, non due numeri. C'è anche un secondo modo, che dà lo stesso risultato. Si mettono le due code nello stesso punto e si chiude il **parallelogramma**. La somma è la diagonale che parte dalle code.

Nel grafico la freccia $b$ gira, e la somma cambia. Con lo stesso verso i moduli si sommano, $3 + 4 = 7$. Con versi opposti si sottraggono, $4 - 3 = 1$. Solo a 90° il risultato è 5.

[[grafico:parallelogramma]]

>* Il modulo della somma sta sempre fra la differenza e la somma dei moduli: $|a - b| \le |\vec{a} + \vec{b}| \le a + b$. Qui $a$ e $b$, senza freccia, sono i moduli.

>! Pitagora vale **solo** se i due vettori sono perpendicolari. Con un angolo qualsiasi la somma si trova con il disegno in scala, oppure con le componenti.

?? Su una cassa agiscono due forze, da 6 N e da 8 N. Quale valore **non** può avere la forza totale?
[ ] 2 N
[ ] 10 N
[ ] 14 N
[x] 16 N
=> La somma sta fra $8 - 6 = 2\,\text{N}$ e $8 + 6 = 14\,\text{N}$. Vale 10 N se le forze sono perpendicolari. 16 N non si può ottenere con nessun angolo.`
    },
    {
      id: 'differenza',
      titolo: 'Vettore opposto, differenza, multipli',
      testo: R`Un vettore si può moltiplicare per un numero. Se cammino 2 km verso est e poi raddoppio, faccio 4 km verso est: stessa direzione, stesso verso, modulo doppio.

>* Moltiplicando un vettore per un numero $k$ si ottiene un vettore con la stessa direzione. Il modulo viene moltiplicato per $k$, preso senza segno. Se $k$ è negativo, il verso si inverte.

Il vettore $-\vec{a}$ si chiama **opposto** di $\vec{a}$. Ha lo stesso modulo e la stessa direzione, ma punta dall'altra parte. Sommando un vettore e il suo opposto si ottiene il **vettore nullo**, di modulo zero.

[[grafico:multipli]]

Togliere un vettore vuol dire sommare il suo opposto: $\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$. In fisica la differenza serve soprattutto per la **variazione di velocità**, $\Delta\vec{v} = \vec{v}_2 - \vec{v}_1$.

Esempio. Un carrello va a 4 m/s verso est. Poco dopo va a 3 m/s verso nord. Quanto vale la variazione di velocità?

~ \Delta\vec{v} = \vec{v}_2 + (-\vec{v}_1) :: togliere $\vec{v}_1$ vuol dire sommare il suo opposto, verso ovest
~ \Delta v = \sqrt{(3\,\text{m/s})^2 + (4\,\text{m/s})^2} :: 3 m/s a nord e 4 m/s a ovest sono perpendicolari
~ \Delta v = \evidb{5\,\text{m/s}} :: diretto fra nord e ovest

[[grafico:differenza]]

>! La velocità può cambiare anche se il tachimetro segna sempre lo stesso numero. Basta che cambi la direzione, come in una curva. Allora $\Delta\vec{v}$ non è zero, e c'è un'accelerazione: la vedrai in «Il moto rettilineo».

?? Un'auto va a 20 m/s verso est. Poi torna indietro a 20 m/s verso ovest. Quanto vale il modulo della variazione di velocità?
[ ] zero
[ ] 20 m/s
[x] 40 m/s
[ ] 28 m/s
=> Prendo l'est come verso positivo: $\Delta v = -20 - 20 = -40\,\text{m/s}$, di modulo 40 m/s. Il modulo della velocità non è cambiato, ma il vettore sì.`
    },
    {
      id: 'componenti',
      titolo: 'Le componenti di un vettore',
      testo: R`Tiro una slitta con una corda inclinata. La forza sta lungo la corda, di sbieco. Una parte della forza tira la slitta in avanti, un'altra parte la tira verso l'alto. Quanto vale ciascuna?

Si mettono due assi: $x$ orizzontale, $y$ verticale. Poi si immagina una luce dall'alto. L'ombra della freccia sull'asse $x$ è la **componente** $x$. Con una luce da destra, l'ombra sull'asse $y$ è la componente $y$.

[[video:vettori/componenti]]

>* Le **componenti** di un vettore sono le sue proiezioni sugli assi. Se $\alpha$ è l'angolo misurato **dall'asse** $x$: $F_x = F \cdot \cos\alpha$ e $F_y = F \cdot \sin\alpha$.

Il coseno e il seno si leggono con la calcolatrice, in gradi. A 30° c'è anche un trucco, senza calcolatrice. Il triangolo con l'angolo di 30° è mezzo triangolo equilatero. Il lato opposto a 30° è quindi metà dell'ipotenusa.

~ F_y = \tfrac{1}{2} \cdot 10\,\text{N} = \evid{5\,\text{N}} :: la forza è di 10 N a 30°: mezzo triangolo equilatero
~ F_x = \sqrt{(10\,\text{N})^2 - (5\,\text{N})^2} :: l'altro cateto, con Pitagora
~ F_x = \sqrt{75}\,\text{N} \approx \evidb{8{,}7\,\text{N}} :: con la calcolatrice: $10 \cdot \cos 30° \approx 8{,}7$

Nel grafico, se l'angolo cresce, la componente $x$ cala e la componente $y$ cresce. A 60° le due componenti si scambiano: 5 N in avanti, 8,7 N in su.

[[grafico:componenti]]

>! L'angolo va misurato dall'asse $x$. Se il problema dà l'angolo dall'asse $y$, seno e coseno si scambiano. Fai sempre il disegno prima del conto.

Le componenti possono essere negative. Una freccia che punta verso sinistra ha $F_x$ negativa. Una che punta verso il basso ha $F_y$ negativa.

?? Una forza di 10 N è inclinata di 30° sull'orizzontale. Quanto vale la componente verticale?
[ ] 8,7 N
[x] 5 N
[ ] 10 N
[ ] 3 N
=> La componente verticale è $10 \cdot \sin 30° = 5\,\text{N}$. Il valore 8,7 N è la componente orizzontale, che sta vicino all'angolo.`
    },
    {
      id: 'per-componenti',
      titolo: 'Ricomporre e sommare con le componenti',
      testo: R`Si può anche fare il viaggio al contrario. Conosco le due componenti e voglio il vettore. Le componenti sono i cateti di un triangolo rettangolo, e il vettore ne è l'ipotenusa.

>* Il modulo di un vettore si trova dalle componenti con Pitagora: $F = \sqrt{F_x^2 + F_y^2}$.

Con 8,7 N e 5 N si ritrova la forza della slitta: $\sqrt{8{,}7^2 + 5^2} \approx 10\,\text{N}$. Ogni vettore è la somma delle sue componenti, messe punta-coda.

Le componenti rendono facile anche la somma, con qualunque angolo. Invece di disegnare, si fanno due somme di numeri: una per le $x$, una per le $y$.

>* Per sommare due vettori si sommano le componenti: $R_x = a_x + b_x$ e $R_y = a_y + b_y$.

Esempio. Il vettore $\vec{a}$ ha componenti $(3; 1)$ e il vettore $\vec{b}$ ha componenti $(1; 3)$, in km. Quanto è lungo $\vec{a} + \vec{b}$?

~ R_x = 3\,\text{km} + 1\,\text{km} = 4\,\text{km} :: le componenti orizzontali si sommano fra loro
~ R_y = 1\,\text{km} + 3\,\text{km} = 4\,\text{km} :: e quelle verticali fra loro
~ R = \sqrt{4^2 + 4^2}\,\text{km} = \sqrt{32}\,\text{km} \approx \evidb{5{,}7\,\text{km}} :: il modulo della somma, con Pitagora

[[grafico:somma-componenti]]

Il metodo funziona anche con tre o più vettori, e con le componenti negative. È il modo in cui si sommano le forze su un corpo nei problemi di dinamica.

>! Le componenti si sommano, i moduli no. Qui $|\vec{a}| = |\vec{b}| \approx 3{,}2\,\text{km}$: la loro somma fa 6,3 km, non 5,7 km.

?? Un vettore ha componenti $F_x = -6\,\text{N}$ e $F_y = 8\,\text{N}$. Quanto vale il suo modulo?
[ ] 2 N
[ ] 14 N
[x] 10 N
[ ] −10 N
=> $F = \sqrt{(-6)^2 + 8^2} = \sqrt{36 + 64} = 10\,\text{N}$. Il segno meno sparisce nel quadrato: il modulo non è mai negativo.`
    },
    {
      id: 'prodotto-scalare',
      titolo: 'Il prodotto scalare (terzo anno)',
      testo: R`Due vettori si possono moltiplicare in due modi diversi. Il primo dà come risultato un numero, e si chiama **prodotto scalare**.

Prendo due vettori $\vec{a}$ e $\vec{b}$, con un angolo $\alpha$ fra loro. L'ombra di $\vec{b}$ sulla retta di $\vec{a}$ è lunga $b \cdot \cos\alpha$. La moltiplico per il modulo di $\vec{a}$.

[[video:vettori/prodotto-scalare]]

>* Il **prodotto scalare** di due vettori è il numero $\vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha$. Qui $a$ e $b$, senza freccia, sono i moduli; $\alpha$ è l'angolo fra i vettori.

~ \vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha :: due vettori lunghi 4 e 3, a 60°
~ \vec{a} \cdot \vec{b} = 4 \cdot 3 \cdot \cos 60° :: il coseno di 60° vale 0,5
~ \vec{a} \cdot \vec{b} = \evidb{6} :: un numero, non una freccia

Il segno dipende dall'angolo. Con i vettori paralleli e concordi il prodotto è massimo: $4 \cdot 3 = 12$. Con i vettori perpendicolari l'ombra sparisce e il prodotto è zero. Oltre 90° l'ombra va all'indietro, e il prodotto è negativo. Oltre 90° anche il coseno è negativo: con la calcolatrice, $\cos 120° = -0{,}5$.

[[grafico:scalare]]

Il prodotto scalare è il **lavoro** di una forza: $L = \vec{F} \cdot \vec{s} = F \cdot s \cdot \cos\alpha$. Conta solo la parte della forza che sta lungo lo spostamento.

Con le componenti c'è un modo più rapido: $\vec{a} \cdot \vec{b} = a_x \cdot b_x + a_y \cdot b_y$. Con $\vec{a} = (3; 4)$ e $\vec{b} = (4; -3)$ viene $12 - 12 = 0$: i due vettori sono perpendicolari.

>! Il prodotto scalare non è un vettore, e può essere negativo. Il lavoro di una forza che frena è negativo.

?? Due vettori perpendicolari, lunghi 5 e 2. Quanto vale il loro prodotto scalare?
[ ] 10
[x] zero
[ ] 7
[ ] −10
=> L'angolo è di 90° e $\cos 90° = 0$: il prodotto scalare è zero, qualunque siano i moduli. Una forza perpendicolare allo spostamento non fa lavoro.`
    },
    {
      id: 'prodotto-vettoriale',
      titolo: 'Il prodotto vettoriale (terzo anno)',
      testo: R`Il secondo modo di moltiplicare due vettori dà come risultato un altro vettore. Si chiama **prodotto vettoriale** e si scrive $\vec{a} \wedge \vec{b}$. Su alcuni libri si trova anche $\vec{a} \times \vec{b}$.

Questa volta conta la parte di $\vec{b}$ **perpendicolare** ad $\vec{a}$, lunga $b \cdot \sin\alpha$. Moltiplicata per $a$ dà l'area del parallelogramma costruito sui due vettori.

[[video:vettori/prodotto-vettoriale]]

>* Il **prodotto vettoriale** $\vec{a} \wedge \vec{b}$ è un vettore perpendicolare al piano di $\vec{a}$ e $\vec{b}$. Il suo modulo è $a \cdot b \cdot \sin\alpha$, l'area del parallelogramma. Il verso si trova con la mano destra.

~ |\vec{a} \wedge \vec{b}| = a \cdot b \cdot \sin\alpha :: gli stessi vettori di prima, lunghi 4 e 3, a 60°
~ |\vec{a} \wedge \vec{b}| = 4 \cdot 3 \cdot \sin 60° :: il seno di 60° vale circa 0,87
~ |\vec{a} \wedge \vec{b}| \approx \evidb{10{,}4} :: il modulo; il vettore è perpendicolare al foglio e ne esce

Con i vettori paralleli l'area è zero. Con i vettori perpendicolari è massima: $4 \cdot 3 = 12$.

[[grafico:vettoriale]]

**La regola della mano destra.** Apri la mano destra con le dita lungo $\vec{a}$. Chiudile verso $\vec{b}$, per l'angolo più piccolo. Il pollice dà il verso di $\vec{a} \wedge \vec{b}$.

>! L'ordine conta: $\vec{b} \wedge \vec{a} = -(\vec{a} \wedge \vec{b})$. Scambiando i due vettori la freccia si capovolge.

Il prodotto vettoriale è il **momento** di una forza: $\vec{M} = \vec{r} \wedge \vec{F}$. Qui $\vec{r}$ va dal polo, il punto attorno a cui si ruota, al punto in cui si spinge. Per questo una chiave lunga svita meglio, e spingere lungo la chiave non serve.

?? Spingi una porta proprio verso i cardini, lungo la porta stessa. Quanto vale il momento della tua forza?
[ ] il massimo
[x] zero
[ ] la metà del massimo
[ ] dipende dal peso della porta
=> La forza è parallela a $\vec{r}$: l'angolo è zero e $\sin 0° = 0$. La porta non gira. Si spinge meglio perpendicolarmente, e lontano dai cardini.`
    }
  ],
  grafici: {
    /* le tre passeggiate del video: stessa lunghezza, direzioni e versi diversi (spostamenti: colore 1, come nel video) */
    passeggiate: {
      tipo: 'piano', x: [-6.5, 6.5], y: [-1.5, 6.5], altezza: 400, assi: false,
      elementi: [
        { tipo: 'vettore', da: [0, 0], a: [5, 0], etichetta: '5 km a est', colore: 1 },
        { tipo: 'vettore', da: [0, 0], a: [0, 5], etichetta: '5 km a nord', colore: 1 },
        { tipo: 'vettore', da: [0, 0], a: [-5, 0], etichetta: '5 km a ovest', colore: 1, posizione: 'destra' },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'testo', p: [6.2, 6], testo: 'nord ↑', ancora: 'end' }
      ],
      didascalia: 'Tre passeggiate da 5 km dal punto grigio (un quadretto = 1 km). Est e ovest: stessa direzione, versi opposti. Nord: un\'altra direzione.'
    },
    /* il giro del video: strada 6 km, spostamento 4 km */
    giro: {
      tipo: 'piano', x: [-0.5, 4.5], y: [-1.3, 1.8], altezza: 380, assi: false,
      elementi: [
        { tipo: 'somma', da: [0, 0], vettori: [[0, 1], [4, 0], [0, -1]], etichette: ['1 km', '4 km', '1 km'], colori: [1, 1, 1],
          risultante: { etichetta: 'spostamento 4 km', colore: 3 } }
      ],
      didascalia: 'Un giro: 1 km a nord, 4 km a est, 1 km a sud. La strada percorsa è 6 km; lo spostamento, in verde, è 4 km verso est.'
    },
    /* somma col parallelogramma: b gira, la diagonale cambia */
    parallelogramma: {
      tipo: 'piano', x: [-4.3, 7.3], y: [-0.9, 5.7], altezza: 400, assi: false,
      parametri: [{ nome: 'th', min: 0, max: 180, passo: 5, valore: 90, etichetta: 'angolo fra a e b (°)' }],
      elementi: [
        { tipo: 'somma', da: [0, 0], vettori: [[3, 0], { modulo: 4, angolo: 'th' }], etichette: ['a', 'b'], colori: [1, 1], parallelogramma: true,
          risultante: { etichetta: 'a + b', colore: 3, posizione: 'destra' } },
        { tipo: 'testo', p: [7.2, 5.3], testo: 'a = 3 km, b = 4 km', ancora: 'end' },
        { tipo: 'testo', p: [7.2, 4.6], testo: 'a + b ≈ {{sqrt(25 + 24*cos(th*pi/180))}} km', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Le due code nello stesso punto: la somma è la diagonale del parallelogramma. Con il cursore b gira: a 0° la somma vale 7 km, a 90° vale 5 km, a 180° vale 1 km.'
    },
    /* multipli e opposto */
    multipli: {
      tipo: 'piano', x: [-0.6, 12.6], y: [-0.9, 2.9], altezza: 360, assi: false,
      elementi: [
        { tipo: 'vettore', da: [0, 0], a: [2, 1], etichetta: 'a', colore: 1 },
        { tipo: 'vettore', da: [3, 0], a: [7, 2], etichetta: '2·a', colore: 1 },
        { tipo: 'vettore', da: [10, 1.5], a: [8, 0.5], etichetta: '−a', colore: 1, tratteggio: true },
        { tipo: 'vettore', da: [11, 0], a: [12, 0.5], etichetta: '½·a', colore: 1, posizione: 'destra' }
      ],
      didascalia: 'Il vettore a, il suo doppio, il suo opposto (tratteggiato) e la sua metà: stessa direzione, moduli diversi. L\'opposto punta dall\'altra parte.'
    },
    /* la variazione di velocità: v2 + (−v1) */
    differenza: {
      tipo: 'piano', x: [-5, 5], y: [-1, 4], altezza: 400, assi: false,
      elementi: [
        { tipo: 'vettore', da: [0, 0], a: [4, 0], etichetta: 'v_1', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 0], a: [0, 3], etichetta: 'v_2', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 3], a: [-4, 3], etichetta: '−v_1', colore: 1, tratteggio: true },
        { tipo: 'vettore', da: [0, 0], a: [-4, 3], etichetta: 'Δv', colore: 3, spessore: 3.4 }
      ],
      didascalia: 'Prima 4 m/s a est (v₁), poi 3 m/s a nord (v₂). A v₂ si somma l\'opposto di v₁, tratteggiato: Δv, in verde, è lunga 5 m/s e punta fra nord e ovest.'
    },
    /* le componenti: l'angolo cresce, Fx cala e Fy cresce */
    componenti: {
      tipo: 'piano', x: [-1.2, 11.5], y: [-1.2, 11.2], altezza: 520,
      parametri: [
        { nome: 'F', min: 2, max: 10, passo: 1, valore: 10, etichetta: 'F (N)' },
        { nome: 'al', min: 0, max: 70, passo: 5, valore: 30, etichetta: 'α (°)' }
      ],
      elementi: [
        { tipo: 'angolo', vertice: [0, 0], da: [3, 0], a: ['3*cos(al*pi/180)', '3*sin(al*pi/180)'], raggio: 1.4, etichetta: 'α', colore: 'grigio' },
        { tipo: 'vettore', da: [0, 0], modulo: 'F', angolo: 'al', etichetta: 'F', colore: 2, componenti: true, posizione: 'destra' },
        { tipo: 'testo', p: [11.3, 10.8], testo: 'F_x = F·cos α ≈ {{F*cos(al*pi/180)}} N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [11.3, 9.4], testo: 'F_y = F·sin α ≈ {{F*sin(al*pi/180)}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'La forza F e le sue ombre sugli assi (un quadretto = 1 N). L\'angolo α si misura dall\'asse x. Con i cursori si cambiano F e α.'
    },
    /* somma con le componenti: (3; 1) + (1; 3) = (4; 4) */
    'somma-componenti': {
      tipo: 'piano', x: [-0.6, 5.8], y: [-1.4, 4.6], altezza: 400, passo: [1, 1],
      elementi: [
        { tipo: 'segmento', da: [4, 4], a: [4, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [4, 4], a: [0, 4], colore: 'grigio', tratteggio: true },
        { tipo: 'somma', da: [0, 0], vettori: [[3, 1], [1, 3]], etichette: ['a', 'b'], colori: [1, 1], risultante: { etichetta: 'a + b', colore: 3 } },
        { tipo: 'testo', p: [4.15, 1.6], testo: 'R_y = 1 + 3 = 4', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [2, -1.15], testo: 'R_x = 3 + 1 = 4', colore: 3 }
      ],
      didascalia: 'a = (3; 1) e b = (1; 3), in km. Le componenti della somma sono le somme delle componenti: (4; 4). Il modulo è circa 5,7 km.'
    },
    /* il prodotto scalare come ombra di b su a (colori del video: a azzurro, b arancio) */
    scalare: {
      tipo: 'piano', x: [-3.5, 5], y: [-1.2, 3.6], altezza: 400, assi: false,
      parametri: [{ nome: 'th', min: 0, max: 180, passo: 5, valore: 60, etichetta: 'angolo α (°)' }],
      elementi: [
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(th*pi/180)', 'sin(th*pi/180)'], raggio: 0.7, etichetta: 'α', colore: 'grigio' },
        { tipo: 'segmento', da: ['3*cos(th*pi/180)', '3*sin(th*pi/180)'], a: ['3*cos(th*pi/180)', -0.3], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, -0.3], a: ['3*cos(th*pi/180)', -0.3], colore: 3 },
        { tipo: 'vettore', da: [0, 0], a: [4, 0], etichetta: 'a', colore: 1 },
        { tipo: 'vettore', da: [0, 0], modulo: 3, angolo: 'th', etichetta: 'b', colore: 2 },
        { tipo: 'testo', p: [4.9, 3.2], testo: 'ombra di b ≈ {{3*cos(th*pi/180)}}', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [4.9, 2.5], testo: 'a·b = 4 · ombra ≈ {{12*cos(th*pi/180)}}', ancora: 'end' }
      ],
      didascalia: 'a è lunga 4, b è lunga 3. L\'ombra di b sulla retta di a (in verde, sotto la freccia a) per la lunghezza di a è il prodotto scalare. Oltre 90° l\'ombra va all\'indietro: negativo.'
    },
    /* il prodotto vettoriale come area del parallelogramma (colori del video) */
    vettoriale: {
      tipo: 'piano', x: [-3.5, 7.5], y: [-0.8, 4.4], altezza: 400, assi: false,
      parametri: [{ nome: 'th', min: 0, max: 180, passo: 5, valore: 60, etichetta: 'angolo α (°)' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], [4, 0], ['4 + 3*cos(th*pi/180)', '3*sin(th*pi/180)'], ['3*cos(th*pi/180)', '3*sin(th*pi/180)']], colore: 3 },
        { tipo: 'segmento', da: ['3*cos(th*pi/180)', '3*sin(th*pi/180)'], a: ['3*cos(th*pi/180)', 0], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [0, 0], a: [4, 0], etichetta: 'a', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 0], modulo: 3, angolo: 'th', etichetta: 'b', colore: 2 },
        { tipo: 'testo', p: [7.4, 4.1], testo: 'altezza b·sin α ≈ {{3*sin(th*pi/180)}}', ancora: 'end' },
        { tipo: 'testo', p: [7.4, 3.4], testo: 'area = |a ∧ b| ≈ {{12*sin(th*pi/180)}}', ancora: 'end', colore: 3 },
        { tipo: 'uscente', p: ['(4 + 3*cos(th*pi/180))/2', 'se(sin(th*pi/180) > 0.01, 1.5*sin(th*pi/180), sqrt(-1))'], etichetta: 'a ∧ b', posizione: 'destra', colore: 3 }
      ],
      didascalia: 'L\'area del parallelogramma, base 4 per altezza b·sin α, è il modulo di a ∧ b. Il vettore a ∧ b, segnato con ⊙, è perpendicolare al foglio e ne esce, verso di te (mano destra).'
    }
  },
  esempi: [
    {
      titolo: 'Spostamento e strada percorsa',
      problema: R`Un ciclista pedala 6 km verso est e poi 8 km verso nord. Quanta strada ha percorso? Quanto è lungo il suo spostamento?`,
      passi: [
        R`Dati: $6\,\text{km}$ verso est, $8\,\text{km}$ verso nord. Cerco la strada percorsa e il modulo $\Delta s$ dello spostamento.`,
        R`La strada percorsa è uno scalare: si sommano i chilometri. $6\,\text{km} + 8\,\text{km} = 14\,\text{km}$.`,
        R`Lo spostamento è un vettore: va dritto dalla partenza all'arrivo. I due tratti sono perpendicolari, quindi lo spostamento è l'ipotenusa di un triangolo rettangolo.`,
        R`Con Pitagora: $\Delta s = \sqrt{(6\,\text{km})^2 + (8\,\text{km})^2} = \sqrt{36 + 64}\,\text{km} = \sqrt{100}\,\text{km} = 10\,\text{km}$.`,
        R`Controllo: il modulo della somma deve stare fra $8 - 6 = 2\,\text{km}$ e $8 + 6 = 14\,\text{km}$. 10 km ci sta.`
      ],
      risultato: R`Strada percorsa $14\,\text{km}$, spostamento $10\,\text{km}$ fra nord ed est.`
    },
    {
      titolo: 'Due forze sulla stessa cassa',
      problema: R`Due ragazzi tirano una cassa, uno con 30 N e l'altro con 40 N. Quanto vale la forza totale se tirano nello stesso verso? E in versi opposti? E se le corde sono perpendicolari?`,
      passi: [
        R`Dati: $F_1 = 30\,\text{N}$, $F_2 = 40\,\text{N}$, in tre disposizioni. Cerco il modulo $F$ della forza totale in ciascun caso.`,
        R`Stessa direzione e stesso verso: le frecce si allineano punta-coda e i moduli si sommano. $30\,\text{N} + 40\,\text{N} = 70\,\text{N}$.`,
        R`Versi opposti: le frecce si sovrappongono all'indietro e i moduli si sottraggono. $40\,\text{N} - 30\,\text{N} = 10\,\text{N}$, nel verso di chi tira di più.`,
        R`Corde perpendicolari: vale Pitagora. $F = \sqrt{30^2 + 40^2}\,\text{N} = \sqrt{900 + 1600}\,\text{N} = \sqrt{2500}\,\text{N} = 50\,\text{N}$.`,
        R`Controllo: 70 N è il massimo, 10 N il minimo. Ogni altro angolo dà un valore in mezzo, come i 50 N dell'angolo retto.`
      ],
      risultato: R`$70\,\text{N}$, $10\,\text{N}$ e $50\,\text{N}$: stessi moduli, risultati diversi.`
    },
    {
      titolo: 'Le componenti di una forza a 60°',
      problema: R`Una corda tira un carrello con una forza di 20 N, inclinata di 60° sull'orizzontale. Quanto valgono la componente orizzontale e quella verticale?`,
      passi: [
        R`Dati: $F = 20\,\text{N}$, $\alpha = 60°$ dall'orizzontale. Cerco $F_x$ e $F_y$.`,
        R`Disegno gli assi: $x$ orizzontale, $y$ verticale. L'angolo $\alpha = 60°$ è misurato dall'asse $x$.`,
        R`Componente orizzontale: $F_x = F \cdot \cos\alpha = 20\,\text{N} \cdot \cos 60° = 20\,\text{N} \cdot 0{,}5 = 10\,\text{N}$. Senza calcolatrice: è mezzo triangolo equilatero, e il lato vicino all'angolo di 60° è metà dell'ipotenusa.`,
        R`Componente verticale: $F_y = F \cdot \sin\alpha = 20\,\text{N} \cdot \sin 60° \approx 17{,}3\,\text{N}$. Senza calcolatrice, con Pitagora: $\sqrt{20^2 - 10^2} = \sqrt{300} \approx 17{,}3$.`,
        R`Controllo: ricompongo con Pitagora. $\sqrt{10^2 + 17{,}3^2} \approx \sqrt{100 + 299} \approx 20\,\text{N}$. Torna.`
      ],
      risultato: R`$F_x = 10\,\text{N}$ in avanti, $F_y \approx 17{,}3\,\text{N}$ verso l'alto.`
    },
    {
      titolo: 'Sommare due forze con un angolo qualsiasi',
      problema: R`Su un corpo agiscono due forze. La prima, $F_1 = 20\,\text{N}$, è lungo l'asse $x$. La seconda, $F_2 = 10\,\text{N}$, forma 60° con l'asse $x$. Quanto vale la forza totale?`,
      passi: [
        R`Dati: $F_1 = 20\,\text{N}$ lungo $x$, $F_2 = 10\,\text{N}$ a 60° da $x$. Cerco il modulo $R$ della forza totale.`,
        R`Componenti della prima: $F_{1x} = 20\,\text{N}$, $F_{1y} = 0$.`,
        R`Componenti della seconda: $F_{2x} = 10 \cdot \cos 60° = 5\,\text{N}$, $F_{2y} = 10 \cdot \sin 60° \approx 8{,}66\,\text{N}$.`,
        R`Sommo le componenti: $R_x = 20 + 5 = 25\,\text{N}$, $R_y = 0 + 8{,}66 = 8{,}66\,\text{N}$.`,
        R`Ricompongo con Pitagora: $R = \sqrt{25^2 + 8{,}66^2} = \sqrt{625 + 75}\,\text{N} = \sqrt{700}\,\text{N} \approx 26{,}5\,\text{N}$.`,
        R`Controllo: deve stare fra $20 - 10 = 10\,\text{N}$ e $20 + 10 = 30\,\text{N}$. Sta più vicino al massimo che al minimo: le due forze formano meno di 90°.`
      ],
      risultato: R`$R \approx 26{,}5\,\text{N}$`
    },
    {
      titolo: 'Il lavoro di chi tira la slitta (terzo anno)',
      problema: R`Una bambina tira una slitta per 20 m con una forza di 50 N. La corda forma 30° con il terreno. Quanto lavoro fa la forza?`,
      passi: [
        R`Dati: $F = 50\,\text{N}$, $s = 20\,\text{m}$, $\alpha = 30°$. Cerco il lavoro $L$.`,
        R`Il lavoro è il prodotto scalare fra la forza e lo spostamento: $L = F \cdot s \cdot \cos\alpha$.`,
        R`Metto i numeri: $L = 50\,\text{N} \cdot 20\,\text{m} \cdot \cos 30° \approx 50 \cdot 20 \cdot 0{,}866\,\text{J} \approx 866\,\text{J}$.`,
        R`Controllo con le componenti: la parte utile della forza è $F_x = 50 \cdot \cos 30° \approx 43{,}3\,\text{N}$. Per 20 m fa $43{,}3 \cdot 20 \approx 866\,\text{J}$. Torna.`,
        R`La componente verticale, circa 25 N, non fa lavoro: è perpendicolare allo spostamento.`
      ],
      risultato: R`$L \approx 866\,\text{J}$`
    },
    {
      titolo: 'Svitare un bullone (terzo anno)',
      problema: R`Una chiave inglese è lunga 25 cm. Si spinge la sua estremità con 40 N. Quanto vale il momento se la forza è perpendicolare alla chiave? E se forma 30° con la chiave?`,
      passi: [
        R`Dati: $r = 25\,\text{cm} = 0{,}25\,\text{m}$, $F = 40\,\text{N}$, $\alpha = 90°$ e poi $30°$. Cerco il momento $M$.`,
        R`Il momento è il prodotto vettoriale $\vec{M} = \vec{r} \wedge \vec{F}$, di modulo $M = r \cdot F \cdot \sin\alpha$.`,
        R`Forza perpendicolare: $\sin 90° = 1$, quindi $M = 0{,}25\,\text{m} \cdot 40\,\text{N} = 10\,\text{N}\cdot\text{m}$.`,
        R`Forza a 30°: $\sin 30° = 0{,}5$, quindi $M = 0{,}25 \cdot 40 \cdot 0{,}5\,\text{N}\cdot\text{m} = 5\,\text{N}\cdot\text{m}$.`,
        R`Controllo: con la forza storta il momento è la metà. Conta solo la parte della forza perpendicolare alla chiave.`
      ],
      risultato: R`$10\,\text{N}\cdot\text{m}$ con la forza perpendicolare, $5\,\text{N}\cdot\text{m}$ a 30°.`
    }
  ],
  formulario: [
    { nome: 'Vettore', formula: R`\text{modulo},\ \text{direzione},\ \text{verso}`, nota: R`Il modulo non è mai negativo. Gli scalari invece sono solo un numero con l'unità.` },
    { nome: 'Somma di vettori perpendicolari', formula: R`|\vec{a} + \vec{b}| = \sqrt{a^2 + b^2}`, nota: R`Solo se l'angolo fra i vettori è di 90°: è il teorema di Pitagora.` },
    { nome: 'Limiti della somma', formula: R`|a - b| \le |\vec{a} + \vec{b}| \le a + b`, nota: R`Massimo con lo stesso verso, minimo con versi opposti.` },
    { nome: 'Vettore opposto e differenza', formula: R`\vec{a} - \vec{b} = \vec{a} + (-\vec{b})`, nota: R`$-\vec{b}$ ha lo stesso modulo e la stessa direzione di $\vec{b}$, verso opposto.` },
    { nome: 'Variazione di velocità', formula: R`\Delta\vec{v} = \vec{v}_2 - \vec{v}_1`, nota: R`Non è zero se cambia la direzione, anche a modulo costante.` },
    { nome: 'Componenti', formula: R`F_x = F \cdot \cos\alpha \qquad F_y = F \cdot \sin\alpha`, nota: R`Con $\alpha$ misurato dall'asse $x$. A 30°: $F_y = F/2$.` },
    { nome: 'Modulo dalle componenti', formula: R`F = \sqrt{F_x^2 + F_y^2}`, nota: R`Le componenti sono i cateti, il vettore è l'ipotenusa.` },
    { nome: 'Somma con le componenti', formula: R`R_x = a_x + b_x \qquad R_y = a_y + b_y`, nota: R`Vale con qualunque angolo e con quanti vettori si vuole.` },
    { nome: 'Prodotto scalare', formula: R`\vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha`, nota: R`Terzo anno. È un numero: positivo, zero (vettori perpendicolari) o negativo.` },
    { nome: 'Prodotto scalare con le componenti', formula: R`\vec{a} \cdot \vec{b} = a_x \cdot b_x + a_y \cdot b_y`, nota: R`Se fa zero, i vettori sono perpendicolari.` },
    { nome: 'Lavoro', formula: R`L = \vec{F} \cdot \vec{s} = F \cdot s \cdot \cos\alpha`, nota: R`In joule. Una forza perpendicolare allo spostamento non fa lavoro.` },
    { nome: 'Prodotto vettoriale', formula: R`|\vec{a} \wedge \vec{b}| = a \cdot b \cdot \sin\alpha`, nota: R`Terzo anno. Vettore perpendicolare al piano di $\vec{a}$ e $\vec{b}$, verso con la mano destra; $\vec{b} \wedge \vec{a} = -(\vec{a} \wedge \vec{b})$.` },
    { nome: 'Momento di una forza', formula: R`\vec{M} = \vec{r} \wedge \vec{F} \qquad M = r \cdot F \cdot \sin\alpha`, nota: R`In $\text{N}\cdot\text{m}$. $\vec{r}$ va dal polo al punto in cui agisce la forza.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'scalari-vettori', tipo: 'definizione', fronte: R`Che cos'è una grandezza **scalare**?`, retro: R`Una grandezza descritta da un numero con la sua unità: massa, tempo, temperatura, energia, strada percorsa.` },
    { id: 'fc-02', sezione: 'scalari-vettori', tipo: 'definizione', fronte: R`Che cos'è un **vettore**?`, retro: R`Una grandezza descritta da modulo, direzione e verso. Si disegna con una freccia: spostamento, velocità, accelerazione, forza.` },
    { id: 'fc-03', sezione: 'scalari-vettori', tipo: 'concetto', fronte: R`Che differenza c'è fra **direzione** e **verso**?`, retro: R`La direzione è la retta su cui sta la freccia (per esempio est–ovest). Il verso dice da che parte punta (verso est o verso ovest).` },
    { id: 'fc-04', sezione: 'scalari-vettori', tipo: 'concetto', fronte: R`1 km a nord, 4 km a est, 1 km a sud: strada percorsa e spostamento?`, retro: R`Strada percorsa 6 km (uno scalare). Spostamento 4 km verso est (un vettore, dalla partenza all'arrivo).` },
    { id: 'fc-05', sezione: 'somma', tipo: 'procedura', fronte: R`Come si sommano due vettori con la regola **punta-coda**?`, retro: R`Si mette la coda del secondo sulla punta del primo. La somma va dalla coda del primo alla punta del secondo.` },
    { id: 'fc-06', sezione: 'somma', tipo: 'procedura', fronte: R`Come funziona la regola del **parallelogramma**?`, retro: R`Le due code nello stesso punto; si chiude il parallelogramma. La somma è la diagonale che parte dalle code.` },
    { id: 'fc-07', sezione: 'somma', tipo: 'formula', fronte: R`Fra quali valori sta il modulo della somma di due vettori lunghi $a$ e $b$?`, retro: R`Fra $|a - b|$ (versi opposti) e $a + b$ (stesso verso).` },
    { id: 'fc-08', sezione: 'somma', tipo: 'concetto', fronte: R`Quando si può usare Pitagora per sommare due vettori?`, retro: R`Solo quando sono perpendicolari: $3$ e $4$ danno $5$. Con un altro angolo no.` },
    { id: 'fc-09', sezione: 'differenza', tipo: 'definizione', fronte: R`Che cos'è il vettore **opposto** di $\vec{a}$?`, retro: R`Il vettore $-\vec{a}$: stesso modulo, stessa direzione, verso contrario. Sommato ad $\vec{a}$ dà il vettore nullo.` },
    { id: 'fc-10', sezione: 'differenza', tipo: 'procedura', fronte: R`Come si calcola $\vec{a} - \vec{b}$?`, retro: R`Si somma ad $\vec{a}$ l'opposto di $\vec{b}$: $\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$.` },
    { id: 'fc-11', sezione: 'differenza', tipo: 'concetto', fronte: R`Che cosa succede moltiplicando un vettore per $-2$?`, retro: R`Il modulo raddoppia, la direzione resta la stessa e il verso si inverte.` },
    { id: 'fc-12', sezione: 'differenza', tipo: 'concetto', fronte: R`Un'auto fa una curva a velocità di modulo costante. La sua velocità cambia?`, retro: R`Sì: cambia la direzione, quindi $\Delta\vec{v}$ non è zero. C'è un'accelerazione.` },
    { id: 'fc-13', sezione: 'componenti', tipo: 'definizione', fronte: R`Che cosa sono le **componenti** di un vettore?`, retro: R`Le sue proiezioni sugli assi $x$ e $y$: le «ombre» della freccia sugli assi.` },
    { id: 'fc-14', sezione: 'componenti', tipo: 'formula', fronte: R`Formule delle componenti di una forza $F$ a un angolo $\alpha$`, retro: R`$F_x = F \cdot \cos\alpha$, $F_y = F \cdot \sin\alpha$, con $\alpha$ misurato dall'asse $x$.` },
    { id: 'fc-15', sezione: 'componenti', tipo: 'procedura', fronte: R`Il trucco dei 30° senza calcolatrice`, retro: R`È mezzo triangolo equilatero: il lato opposto a 30° è metà dell'ipotenusa. L'altro cateto si trova con Pitagora.` },
    { id: 'fc-16', sezione: 'per-componenti', tipo: 'formula', fronte: R`Come si trova il modulo di un vettore dalle componenti?`, retro: R`Con Pitagora: $F = \sqrt{F_x^2 + F_y^2}$.` },
    { id: 'fc-17', sezione: 'per-componenti', tipo: 'procedura', fronte: R`Come si sommano due vettori con le **componenti**?`, retro: R`Si sommano le $x$ fra loro e le $y$ fra loro: $R_x = a_x + b_x$, $R_y = a_y + b_y$. Poi, se serve, il modulo con Pitagora.` },
    { id: 'fc-18', sezione: 'prodotto-scalare', tipo: 'formula', fronte: R`Il **prodotto scalare** (terzo anno)`, retro: R`$\vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha$: un numero. Massimo con i vettori paralleli, zero se perpendicolari, negativo oltre 90°.` },
    { id: 'fc-19', sezione: 'prodotto-scalare', tipo: 'concetto', fronte: R`Che cosa c'entra il prodotto scalare con il **lavoro**?`, retro: R`Il lavoro è il prodotto scalare di forza e spostamento: $L = F \cdot s \cdot \cos\alpha$.` },
    { id: 'fc-20', sezione: 'prodotto-vettoriale', tipo: 'formula', fronte: R`Il **prodotto vettoriale** (terzo anno)`, retro: R`$\vec{a} \wedge \vec{b}$ è un vettore perpendicolare al piano dei due, di modulo $a \cdot b \cdot \sin\alpha$ (l'area del parallelogramma).` },
    { id: 'fc-21', sezione: 'prodotto-vettoriale', tipo: 'procedura', fronte: R`La regola della **mano destra**`, retro: R`Dita lungo $\vec{a}$, si chiudono verso $\vec{b}$: il pollice dà il verso di $\vec{a} \wedge \vec{b}$.` },
    { id: 'fc-22', sezione: 'prodotto-vettoriale', tipo: 'concetto', fronte: R`Che cosa succede scambiando l'ordine nel prodotto vettoriale?`, retro: R`La freccia si capovolge: $\vec{b} \wedge \vec{a} = -(\vec{a} \wedge \vec{b})$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Cammini 8 km verso est e poi 15 km verso nord. Quanto è lungo il tuo spostamento?`, suggerimenti: [R`I due tratti sono perpendicolari: usa Pitagora.`], risposta: { tipo: 'numero', valore: 17, unita: 'km' }, soluzione: [R`$\Delta s = \sqrt{8^2 + 15^2}\,\text{km} = \sqrt{64 + 225}\,\text{km} = \sqrt{289}\,\text{km} = 17\,\text{km}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Cammini 8 km verso est e poi 15 km verso nord. Quanta strada hai percorso?`, suggerimenti: [R`La strada percorsa è uno scalare: basta sommare i chilometri.`], risposta: { tipo: 'numero', valore: 23, unita: 'km' }, soluzione: [R`$8\,\text{km} + 15\,\text{km} = 23\,\text{km}$. Lo spostamento invece è di 17 km.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Due forze da 12 N e da 5 N tirano un corpo nello stesso verso. Quanto vale la forza totale?`, suggerimenti: [R`Stessa direzione e stesso verso: i moduli si sommano.`], risposta: { tipo: 'numero', valore: 17, unita: 'N' }, soluzione: [R`$12\,\text{N} + 5\,\text{N} = 17\,\text{N}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Due forze da 12 N e da 5 N tirano un corpo in versi opposti. Quanto vale il modulo della forza totale?`, suggerimenti: [R`Versi opposti: i moduli si sottraggono.`], risposta: { tipo: 'numero', valore: 7, unita: 'N' }, soluzione: [R`$12\,\text{N} - 5\,\text{N} = 7\,\text{N}$, nel verso della forza più grande.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Due forze perpendicolari, da 7 N e da 24 N, agiscono sullo stesso corpo. Quanto vale il modulo della forza totale?`, suggerimenti: [R`Perpendicolari: il modulo della somma si trova con Pitagora.`], risposta: { tipo: 'numero', valore: 25, unita: 'N' }, soluzione: [R`$F = \sqrt{7^2 + 24^2}\,\text{N} = \sqrt{49 + 576}\,\text{N} = \sqrt{625}\,\text{N} = 25\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Cammini 3 km verso nord e poi torni indietro di 3 km verso sud. Quanto è lungo il tuo spostamento?`, suggerimenti: [R`Dove ti trovi alla fine, rispetto alla partenza?`], risposta: { tipo: 'numero', valore: 0, unita: 'km' }, soluzione: [R`Sei tornato al punto di partenza: lo spostamento è zero. La strada percorsa invece è di 6 km.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Due vettori hanno modulo 7 e 3. Qual è il **massimo** modulo che può avere la loro somma?`, suggerimenti: [R`Il massimo si ha con lo stesso verso.`], risposta: { tipo: 'numero', valore: 10 }, soluzione: [R`Con lo stesso verso i moduli si sommano: $7 + 3 = 10$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Due vettori hanno modulo 7 e 3. Qual è il **minimo** modulo che può avere la loro somma?`, suggerimenti: [R`Il minimo si ha con versi opposti.`], risposta: { tipo: 'numero', valore: 4 }, soluzione: [R`Con versi opposti i moduli si sottraggono: $7 - 3 = 4$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Una velocità di 6 m/s verso est viene moltiplicata per 3. Quanto vale il modulo del nuovo vettore?`, suggerimenti: [R`Moltiplicare per un numero positivo cambia solo il modulo.`], risposta: { tipo: 'numero', valore: 18, unita: 'm/s' }, soluzione: [R`$3 \cdot 6\,\text{m/s} = 18\,\text{m/s}$, sempre verso est.`] },
    { id: 'b-10', livello: 'base', difficolta: 2, testo: R`Una palla arriva contro un muro a 15 m/s e rimbalza indietro a 15 m/s. Quanto vale il modulo della variazione di velocità?`, suggerimenti: [R`Scegli un verso positivo: prima la velocità è $+15\,\text{m/s}$, poi $-15\,\text{m/s}$.`, R`$\Delta v = v_2 - v_1$.`], risposta: { tipo: 'numero', valore: 30, unita: 'm/s' }, soluzione: [R`$\Delta v = -15\,\text{m/s} - 15\,\text{m/s} = -30\,\text{m/s}$.`, R`Il modulo è $30\,\text{m/s}$, anche se la palla va sempre a 15 m/s.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Una forza di 16 N è inclinata di 30° sull'orizzontale. Quanto vale la sua componente verticale?`, suggerimenti: [R`$F_y = F \cdot \sin\alpha$, oppure il trucco del mezzo triangolo equilatero.`], risposta: { tipo: 'numero', valore: 8, unita: 'N' }, soluzione: [R`$F_y = 16\,\text{N} \cdot \sin 30° = 16\,\text{N} \cdot 0{,}5 = 8\,\text{N}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Una forza di 40 N è inclinata di 60° sull'orizzontale. Quanto vale la sua componente orizzontale?`, suggerimenti: [R`$F_x = F \cdot \cos\alpha$, e $\cos 60° = 0{,}5$.`], risposta: { tipo: 'numero', valore: 20, unita: 'N' }, soluzione: [R`$F_x = 40\,\text{N} \cdot \cos 60° = 40\,\text{N} \cdot 0{,}5 = 20\,\text{N}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Una forza di 25 N forma un angolo di 37° con l'asse $x$. Con la calcolatrice, quanto vale $F_x$? Arrotonda all'unità.`, suggerimenti: [R`$F_x = F \cdot \cos\alpha$. La calcolatrice deve essere in gradi (DEG).`], risposta: { tipo: 'numero', valore: 20, unita: 'N', tolleranza: 0.2 }, soluzione: [R`$F_x = 25\,\text{N} \cdot \cos 37° \approx 25 \cdot 0{,}799\,\text{N} \approx 20\,\text{N}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Una forza di 25 N forma un angolo di 37° con l'asse $x$. Con la calcolatrice, quanto vale $F_y$? Arrotonda all'unità.`, suggerimenti: [R`$F_y = F \cdot \sin\alpha$, con la calcolatrice in gradi.`], risposta: { tipo: 'numero', valore: 15, unita: 'N', tolleranza: 0.2 }, soluzione: [R`$F_y = 25\,\text{N} \cdot \sin 37° \approx 25 \cdot 0{,}602\,\text{N} \approx 15\,\text{N}$.`, R`Controllo: $\sqrt{20^2 + 15^2} = \sqrt{625} = 25$. Torna.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Una forza ha componenti $F_x = 9\,\text{N}$ e $F_y = 12\,\text{N}$. Quanto vale il suo modulo?`, suggerimenti: [R`$F = \sqrt{F_x^2 + F_y^2}$.`], risposta: { tipo: 'numero', valore: 15, unita: 'N' }, soluzione: [R`$F = \sqrt{81 + 144}\,\text{N} = \sqrt{225}\,\text{N} = 15\,\text{N}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Due forze hanno componenti $\vec{F}_1 = (4; 15)$ e $\vec{F}_2 = (5; 25)$, in newton. Quanto vale il modulo della loro somma?`, suggerimenti: [R`Somma prima le componenti: le $x$ fra loro, le $y$ fra loro.`, R`Poi usa Pitagora sulle componenti della somma.`], risposta: { tipo: 'numero', valore: 41, unita: 'N' }, soluzione: [R`$R_x = 4 + 5 = 9\,\text{N}$, $R_y = 15 + 25 = 40\,\text{N}$.`, R`$R = \sqrt{9^2 + 40^2}\,\text{N} = \sqrt{81 + 1600}\,\text{N} = \sqrt{1681}\,\text{N} = 41\,\text{N}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`(Terzo anno) Due vettori lunghi 6 e 5 formano un angolo di 60°. Quanto vale il loro prodotto scalare?`, suggerimenti: [R`$\vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha$, e $\cos 60° = 0{,}5$.`], risposta: { tipo: 'numero', valore: 15 }, soluzione: [R`$6 \cdot 5 \cdot 0{,}5 = 15$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`(Terzo anno) Una forza di 10 N sposta un carrello di 5 m. La forza forma 60° con lo spostamento. Quanto lavoro fa?`, suggerimenti: [R`$L = F \cdot s \cdot \cos\alpha$.`], risposta: { tipo: 'numero', valore: 25, unita: 'J' }, soluzione: [R`$L = 10\,\text{N} \cdot 5\,\text{m} \cdot 0{,}5 = 25\,\text{J}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`(Terzo anno) Due vettori perpendicolari sono lunghi 6 e 7. Quanto vale il modulo del loro prodotto vettoriale?`, suggerimenti: [R`$|\vec{a} \wedge \vec{b}| = a \cdot b \cdot \sin\alpha$, e $\sin 90° = 1$.`], risposta: { tipo: 'numero', valore: 42 }, soluzione: [R`$6 \cdot 7 \cdot 1 = 42$: l'area del rettangolo costruito sui due vettori.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`(Terzo anno) Si spinge una chiave lunga 0,4 m con una forza di 30 N, perpendicolare alla chiave. Quanto vale il momento?`, suggerimenti: [R`$M = r \cdot F \cdot \sin\alpha$, con $\alpha = 90°$.`], risposta: { tipo: 'numero', valore: 12, unita: 'N·m' }, soluzione: [R`$M = 0{,}4\,\text{m} \cdot 30\,\text{N} \cdot 1 = 12\,\text{N}\cdot\text{m}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un escursionista cammina 6 km verso est, poi 5 km verso nord, poi 18 km verso ovest. Quanto è lungo il suo spostamento totale?`, suggerimenti: [R`Lavora con le componenti: est positivo per $x$, nord positivo per $y$.`, R`$R_x = 6 - 18$, $R_y = 5$.`], risposta: { tipo: 'numero', valore: 13, unita: 'km' }, soluzione: [R`$R_x = 6 + 0 - 18 = -12\,\text{km}$ (cioè 12 km a ovest), $R_y = 5\,\text{km}$.`, R`$R = \sqrt{(-12)^2 + 5^2}\,\text{km} = \sqrt{169}\,\text{km} = 13\,\text{km}$, fra nord e ovest.`, R`La strada percorsa è $6 + 5 + 18 = 29\,\text{km}$: più del doppio dello spostamento.`] },
    { id: 'es-02', difficolta: 2, testo: R`Su una cassa ferma agiscono due forze: 20 N verso est e 21 N verso nord. Che forza bisogna aggiungere perché la forza totale sia zero? Dai il modulo.`, suggerimenti: [R`Prima trova la somma delle due forze.`, R`La terza forza deve essere l'opposto della somma.`], risposta: { tipo: 'numero', valore: 29, unita: 'N' }, soluzione: [R`Somma delle due forze: $\sqrt{20^2 + 21^2}\,\text{N} = \sqrt{400 + 441}\,\text{N} = \sqrt{841}\,\text{N} = 29\,\text{N}$, fra nord ed est.`, R`Serve l'opposto: $29\,\text{N}$ fra sud e ovest, sulla stessa retta.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un aereo vola verso nord a 200 km/h rispetto all'aria. Il vento soffia verso est a 50 km/h. Quanto vale la velocità dell'aereo rispetto al suolo? Arrotonda all'unità.`, suggerimenti: [R`Le due velocità si sommano come vettori.`, R`Sono perpendicolari: Pitagora.`], risposta: { tipo: 'numero', valore: 206, unita: 'km/h', tolleranza: 1 }, soluzione: [R`$v = \sqrt{200^2 + 50^2}\,\text{km/h} = \sqrt{42\,500}\,\text{km/h} \approx 206\,\text{km/h}$.`, R`L'aereo va un po' più veloce, ma è spostato verso est: per andare dritto a nord dovrebbe puntare un poco a ovest.`] },
    { id: 'es-04', difficolta: 3, testo: R`Due forze da 12 N agiscono sullo stesso punto. Una è lungo l'asse $x$, l'altra forma 60° con l'asse $x$. Quanto vale il modulo della forza totale?`, suggerimenti: [R`Scomponi la seconda forza: $F_x = 12 \cdot \cos 60°$, $F_y = 12 \cdot \sin 60°$.`, R`Somma le componenti, poi usa Pitagora.`], risposta: { tipo: 'numero', valore: 20.8, unita: 'N', tolleranza: 0.15 }, soluzione: [R`Seconda forza: $F_x = 6\,\text{N}$, $F_y \approx 10{,}39\,\text{N}$.`, R`Somma: $R_x = 12 + 6 = 18\,\text{N}$, $R_y \approx 10{,}39\,\text{N}$.`, R`$R = \sqrt{18^2 + 10{,}39^2} = \sqrt{324 + 108}\,\text{N} = \sqrt{432}\,\text{N} \approx 20{,}8\,\text{N}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un'auto va a 15 m/s verso est. Dopo una curva va a 15 m/s verso nord. Quanto vale il modulo della variazione di velocità?`, suggerimenti: [R`$\Delta\vec{v} = \vec{v}_2 + (-\vec{v}_1)$: 15 m/s a nord più 15 m/s a ovest.`, R`I due vettori sono perpendicolari.`], risposta: { tipo: 'numero', valore: 21.2, unita: 'm/s', tolleranza: 0.2 }, soluzione: [R`$\Delta\vec{v} = \vec{v}_2 - \vec{v}_1$: si somma a $\vec{v}_2$ (nord) l'opposto di $\vec{v}_1$ (ovest).`, R`$\Delta v = \sqrt{15^2 + 15^2}\,\text{m/s} = \sqrt{450}\,\text{m/s} \approx 21{,}2\,\text{m/s}$, a nord-ovest (qui l'angolo è proprio di 45°).`, R`Il tachimetro segna sempre 15 m/s, ma la velocità è cambiata: in curva c'è un'accelerazione.`] },
    { id: 'es-06', difficolta: 2, testo: R`(Terzo anno) Si tira una slitta per 25 m con una forza di 80 N, inclinata di 30° sul terreno. Quanto lavoro fa la forza? Arrotonda all'unità.`, suggerimenti: [R`$L = F \cdot s \cdot \cos\alpha$.`, R`$\cos 30° \approx 0{,}866$.`], risposta: { tipo: 'numero', valore: 1732, unita: 'J', tolleranza: 5 }, soluzione: [R`$L = 80\,\text{N} \cdot 25\,\text{m} \cdot \cos 30° \approx 2000 \cdot 0{,}866\,\text{J} \approx 1732\,\text{J}$.`, R`Conta solo la componente lungo il terreno, circa 69,3 N.`] },
    { id: 'es-07', difficolta: 2, testo: R`(Terzo anno) Una chiave è lunga 20 cm. Alla sua estremità si spinge con 60 N, con un angolo di 30° fra la forza e la chiave. Quanto vale il momento?`, suggerimenti: [R`Porta la lunghezza in metri.`, R`$M = r \cdot F \cdot \sin\alpha$, e $\sin 30° = 0{,}5$.`], risposta: { tipo: 'numero', valore: 6, unita: 'N·m' }, soluzione: [R`$r = 0{,}20\,\text{m}$.`, R`$M = 0{,}20\,\text{m} \cdot 60\,\text{N} \cdot 0{,}5 = 6\,\text{N}\cdot\text{m}$.`, R`Spingendo perpendicolare alla chiave si avrebbe il doppio, $12\,\text{N}\cdot\text{m}$.`] },
    { id: 'es-08', difficolta: 3, testo: R`(Terzo anno) I vettori $\vec{a} = (1; 2)$ e $\vec{b} = (3; 1)$ formano un angolo $\alpha$. Quanto vale $\alpha$, in gradi?`, suggerimenti: [R`Calcola il prodotto scalare in due modi: con le componenti e con $a \cdot b \cdot \cos\alpha$.`, R`$a = \sqrt{5}$, $b = \sqrt{10}$.`, R`$\cos\alpha = \dfrac{\vec{a} \cdot \vec{b}}{a \cdot b}$, poi il tasto $\cos^{-1}$.`], risposta: { tipo: 'numero', valore: 45, unita: '°', tolleranza: 0.3 }, soluzione: [R`Con le componenti: $\vec{a} \cdot \vec{b} = 1 \cdot 3 + 2 \cdot 1 = 5$.`, R`Moduli: $a = \sqrt{1 + 4} = \sqrt{5}$, $b = \sqrt{9 + 1} = \sqrt{10}$, e $a \cdot b = \sqrt{50} \approx 7{,}07$.`, R`$\cos\alpha = \dfrac{5}{7{,}07} \approx 0{,}707$, quindi $\alpha = 45°$.`] },
    { id: 'es-09', difficolta: 2, testo: R`Due spostamenti sono lunghi 5 m e 12 m. La loro somma è lunga esattamente 13 m. Che angolo formano, in gradi?`, suggerimenti: [R`Controlla se $5^2 + 12^2 = 13^2$.`], risposta: { tipo: 'numero', valore: 90, unita: '°' }, soluzione: [R`$5^2 + 12^2 = 25 + 144 = 169 = 13^2$: vale Pitagora.`, R`Quindi i due spostamenti sono perpendicolari, a 90°. Con un angolo più piccolo la somma sarebbe più lunga di 13 m, con uno più grande più corta.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Quale di queste grandezze è uno scalare?`, opzioni: [R`La velocità`, R`La forza`, R`La temperatura`, R`Lo spostamento`], corretta: 2, spiegazione: R`La temperatura si dice con un numero e l'unità: è uno scalare. Velocità, forza e spostamento hanno anche direzione e verso.` },
    { id: 'q-02', domanda: R`Quali sono le tre cose che descrivono un vettore?`, opzioni: [R`Modulo, direzione e verso`, R`Lunghezza, larghezza e altezza`, R`Origine, punta e unità`, R`Numero, segno e unità`], corretta: 0, spiegazione: R`Un vettore ha un modulo (quanto è lungo), una direzione (la retta) e un verso (da che parte punta). Senza tutti e tre non è determinato.` },
    { id: 'q-03', domanda: R`Due vettori di modulo 3 e 4. Quando il modulo della loro somma vale 5?`, opzioni: [R`Sempre`, R`Quando hanno lo stesso verso`, R`Quando hanno versi opposti`, R`Quando sono perpendicolari`], corretta: 3, spiegazione: R`Solo a 90° vale Pitagora: $\sqrt{9 + 16} = 5$. Con lo stesso verso la somma vale 7, con versi opposti vale 1.` },
    { id: 'q-04', domanda: R`Nella regola punta-coda, da dove a dove va il vettore somma?`, opzioni: [R`Dalla coda del primo alla punta del secondo`, R`Dalla punta del primo alla coda del secondo`, R`Dalla coda del secondo alla punta del primo`, R`Dalle due punte, unite`], corretta: 0, spiegazione: R`Si mette la coda del secondo sulla punta del primo. La somma parte dalla coda del primo e arriva alla punta del secondo.` },
    { id: 'q-05', domanda: R`Vai a scuola e torni a casa per la stessa strada, lunga 2 km. Quanto vale il tuo spostamento?`, opzioni: [R`4 km`, R`2 km`, R`zero`, R`−2 km`], corretta: 2, spiegazione: R`Sei tornato al punto di partenza: lo spostamento è zero. I 4 km sono la strada percorsa, uno scalare.` },
    { id: 'q-06', domanda: R`Il vettore $-\vec{a}$, rispetto ad $\vec{a}$, ha…`, opzioni: [R`stesso verso e modulo doppio`, R`direzione perpendicolare`, R`verso opposto`, R`modulo negativo`], corretta: 2, spiegazione: R`L'opposto ha lo stesso modulo e la stessa direzione: cambia solo il verso. Il modulo non è mai negativo, e il doppio è $2 \cdot \vec{a}$.` },
    { id: 'q-07', domanda: R`Una forza di 10 N è inclinata di 30° sull'orizzontale. La sua componente orizzontale vale circa…`, opzioni: [R`5 N`, R`8,7 N`, R`10 N`, R`15 N`], corretta: 1, spiegazione: R`$F_x = 10 \cdot \cos 30° \approx 8{,}7\,\text{N}$. I 5 N sono la componente verticale. Una componente non supera mai il modulo del vettore.` },
    { id: 'q-08', domanda: R`Una forza è inclinata sull'orizzontale. Se l'angolo cresce da 20° a 70°, la componente orizzontale…`, opzioni: [R`cresce`, R`resta uguale`, R`diventa negativa`, R`cala`], corretta: 3, spiegazione: R`Più la forza si alza, più la sua ombra sull'asse orizzontale si accorcia. Cresce invece la componente verticale.` },
    { id: 'q-09', domanda: R`Come si sommano due vettori con le componenti?`, opzioni: [R`Si sommano i moduli`, R`Si sommano le $x$ fra loro e le $y$ fra loro`, R`Si moltiplicano le componenti`, R`Si sommano la $x$ del primo e la $y$ del secondo`], corretta: 1, spiegazione: R`$R_x = a_x + b_x$ e $R_y = a_y + b_y$. Sommare i moduli funziona solo con lo stesso verso.` },
    { id: 'q-10', domanda: R`Un vettore ha $F_x = 0$ e $F_y = -5\,\text{N}$. Com'è fatto?`, opzioni: [R`È lungo 5 N e punta verso il basso`, R`È lungo −5 N`, R`È orizzontale`, R`È il vettore nullo`], corretta: 0, spiegazione: R`Niente componente orizzontale: è verticale. La componente $y$ negativa dice che punta in basso. Il modulo è 5 N, positivo.` },
    { id: 'q-11', domanda: R`Un'auto fa una curva con il tachimetro fermo su 50 km/h. La sua velocità…`, opzioni: [R`cambia, perché cambia la direzione`, R`non cambia, perché il modulo è costante`, R`è zero`, R`cambia solo se l'auto frena`], corretta: 0, spiegazione: R`La velocità è un vettore: se cambia la direzione, cambia la velocità anche a modulo costante. Quindi c'è un'accelerazione.` },
    { id: 'q-12', domanda: R`(Terzo anno) Il prodotto scalare di due vettori è…`, opzioni: [R`un vettore perpendicolare ai due`, R`sempre positivo`, R`un numero, che può essere positivo, zero o negativo`, R`la somma dei moduli`], corretta: 2, spiegazione: R`$\vec{a} \cdot \vec{b} = a \cdot b \cdot \cos\alpha$ è un numero. È negativo oltre 90°, zero a 90°. Il vettore perpendicolare è il prodotto vettoriale.` },
    { id: 'q-13', domanda: R`(Terzo anno) Due vettori sono paralleli. Quanto vale il modulo del loro prodotto vettoriale?`, opzioni: [R`Il prodotto dei moduli`, R`Zero`, R`La somma dei moduli`, R`Dipende dal verso`], corretta: 1, spiegazione: R`Con i vettori paralleli $\sin\alpha = 0$: il parallelogramma è schiacciato e ha area zero. Il massimo si ha con i vettori perpendicolari.` },
    { id: 'q-14', domanda: R`(Terzo anno) Che cosa succede a $\vec{a} \wedge \vec{b}$ se si scambia l'ordine dei due vettori?`, opzioni: [R`Non cambia nulla`, R`Il modulo raddoppia`, R`Diventa zero`, R`Cambia verso`], corretta: 3, spiegazione: R`$\vec{b} \wedge \vec{a} = -(\vec{a} \wedge \vec{b})$: stesso modulo, verso opposto. Con la mano destra le dita si chiudono dall'altra parte.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Due vettori da 3 e 4 non fanno sempre 7. Fanno 7 solo se puntano dalla stessa parte; a 90° fanno 5.` },
    { tipo: 'errore', testo: R`Pitagora si usa solo con i vettori perpendicolari. Con un angolo qualsiasi passa per le componenti.` },
    { tipo: 'errore', testo: R`Lo spostamento non è la strada percorsa: chi va e torna ha spostamento zero.` },
    { tipo: 'errore', testo: R`L'angolo delle componenti si misura dall'asse $x$. Se te lo danno dall'asse $y$, seno e coseno si scambiano.` },
    { tipo: 'trucco', testo: R`A 30° la componente opposta all'angolo è metà del vettore: è mezzo triangolo equilatero.` },
    { tipo: 'trucco', testo: R`Una componente non può mai essere più lunga del vettore. Se ti viene più grande, hai sbagliato qualcosa.` },
    { tipo: 'metodo', testo: R`Per sommare tanti vettori: scomponi ognuno, somma tutte le $x$, somma tutte le $y$, poi Pitagora.` },
    { tipo: 'metodo', testo: R`Fai sempre il disegno con le frecce in scala. Ti dice subito se il risultato ha senso.` }
  ],
  aneddoti: [
    { fisico: 'Simon Stevin', anni: '1548–1620', titolo: 'La collana di sfere sul prisma', testo: R`Simon Stevin, nato a Bruges, lavorava come ingegnere nei Paesi Bassi. Nel 1586 pubblicò un libro sull'equilibrio dei pesi. Dentro c'era un disegno famoso. Una collana chiusa di sfere tutte uguali è appoggiata su un prisma triangolare, con due pendii diversi. Se la collana scivolasse da sola, girerebbe per sempre: sarebbe un moto perpetuo, impossibile. Quindi resta ferma. Le poche sfere sul pendio ripido bilanciano le tante sfere sul pendio dolce. Da qui Stevin ricavò la regola dell'equilibrio sul piano inclinato. Era così fiero del disegno che lo mise sul frontespizio. Sotto scrisse un motto in olandese: «Una meraviglia non è una meraviglia».`, legame: R`Sul piano inclinato conta solo la componente del peso lungo il pendio: è una scomposizione di vettori.` },
    { fisico: 'William Rowan Hamilton', anni: '1805–1865', titolo: 'La formula incisa su un ponte', testo: R`Il matematico irlandese William Rowan Hamilton cercava da anni un modo di moltiplicare le terne di numeri. Ogni mattina i figli gli chiedevano: «Allora, papà, sai moltiplicare le terne?». Lui rispondeva di no: sapeva solo sommarle e sottrarle. Lo racconta lui stesso in una lettera al figlio. Il 16 ottobre 1843 camminava con la moglie lungo il Royal Canal di Dublino. Arrivato al Brougham Bridge, capì che servivano quattro numeri, non tre. Per non dimenticarlo, incise la formula nella pietra del ponte con un coltellino. L'incisione oggi non c'è più, ma sul ponte c'è una targa. In quelle ricerche Hamilton inventò anche le parole «vettore» e «scalare».`, legame: R`Sommare i vettori è facile; moltiplicarli è il problema che porta al prodotto scalare e vettoriale.` },
    { fisico: 'Hermann Grassmann', anni: '1809–1877', titolo: 'Il libro che nessuno capì', testo: R`Hermann Grassmann insegnava matematica in un liceo di Stettino. Nel 1844 pubblicò un libro con un'idea nuova: fare i conti con i segmenti orientati, cioè con le frecce. Le sommava e le moltiplicava, anche in più di tre dimensioni. Il libro era difficile e quasi nessuno lo lesse. Grassmann lo riscrisse nel 1862, ma ebbe poco successo anche la seconda volta. Non ottenne mai un posto all'università. Allora si dedicò alle lingue antiche. Studiò il sanscrito e compilò un dizionario del Rigveda, l'antica raccolta di inni indiani. Per questo lavoro ricevette una laurea ad honorem. I matematici apprezzarono davvero la sua idea solo dopo la sua morte.`, legame: R`Grassmann fu fra i primi a trattare le frecce come oggetti da sommare e moltiplicare, cioè come vettori.` },
    { fisico: 'Josiah Willard Gibbs', anni: '1839–1903', titolo: 'Gli appunti stampati per gli studenti', testo: R`Josiah Willard Gibbs insegnava fisica matematica all'Università di Yale. Per spiegare l'elettromagnetismo studiava il trattato di Maxwell, scritto in parte con i quaternioni di Hamilton. Li trovava scomodi. Così ne tenne solo le parti utili: due prodotti fra frecce, uno che dà un numero e uno che dà un'altra freccia. Fra il 1881 e il 1884 stampò a proprie spese degli appunti, *Elements of Vector Analysis*, e li diede agli studenti. I difensori dei quaternioni lo attaccarono sulla rivista *Nature*. In Inghilterra, intanto, Oliver Heaviside arrivava da solo alle stesse idee. Nel 1901 un allievo di Gibbs, Edwin Bidwell Wilson, ne fece un libro. Da lì vengono il punto e la croce che si trovano ancora su molti libri.`, legame: R`Il prodotto scalare e il prodotto vettoriale si scrivono e si usano ancora come li ha proposti Gibbs.` }
  ]
});
})();
