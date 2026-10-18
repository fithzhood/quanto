/* Quanto — L'equilibrio (primo anno): punto materiale e reazioni vincolari, piano inclinato, momento di una forza,
   coppia ed equilibrio del corpo rigido, leve, carrucole e verricello, baricentro e stabilità.
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/equilibrio.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'equilibrio',
  titolo: 'L\'equilibrio',
  introduzione: R`Un ponte, una mensola, una gru, una persona in piedi: sono tutti in **equilibrio**. Restano fermi anche se su di loro agiscono tante forze. La **statica** studia quando succede, e quanto devono valere le forze per tenere fermo un corpo.

Per un corpo che si può trattare come un punto basta che le forze si annullino. Per un corpo esteso non basta: le forze possono farlo ruotare. Per questo serve una grandezza nuova, il **momento** di una forza. Con queste idee si capiscono le leve, le carrucole e il piano inclinato. E si capisce perché certi oggetti si ribaltano e altri no.

Bisogna sapere che cos'è una forza, calcolare il peso con $P = m \cdot g$ e scomporre un vettore in due componenti.`,
  inBreve: [
    R`Un punto materiale fermo resta in **equilibrio** se la risultante delle forze è zero. Le **reazioni vincolari**, come la tensione di un filo o la forza normale, si adattano per annullare le altre forze.`,
    R`Sul **piano inclinato** tira giù solo una parte del peso, $P_\parallel = P \cdot \dfrac{h}{l}$. Il piano regge l'altra parte, $P_\perp = P \cdot \dfrac{b}{l}$.`,
    R`Il **momento** $M = F \cdot b$ dice quanto una forza fa ruotare. Il **braccio** $b$ è la distanza fra il polo e la retta d'azione della forza.`,
    R`Un **corpo rigido** è in equilibrio se la risultante è zero **e** la somma dei momenti è zero. Per una leva: $F_P \cdot b_P = F_R \cdot b_R$.`,
    R`Le macchine semplici possono ridurre la forza, ma lo si paga in spostamento. Un corpo appoggiato sta in piedi se la verticale dal **baricentro** cade dentro la base d'appoggio.`
  ],
  sezioni: [
    {
      id: 'punto-materiale',
      titolo: 'L\'equilibrio del punto materiale',
      testo: R`Un lampadario appeso al soffitto non si muove. Eppure il suo peso lo tira giù. Se resta fermo, c'è un'altra forza che annulla il peso: la tensione del filo.

Quando le dimensioni di un corpo non contano, lo si tratta come un **punto materiale**: un punto che ha una massa. Su un punto le forze non possono farlo ruotare. Possono solo spostarlo.

>* Un punto materiale fermo resta in **equilibrio** se la **risultante** delle forze che agiscono su di lui è zero: $\vec{F}_{\text{tot}} = \vec{F}_1 + \vec{F}_2 + \dots = 0$.

Le frecce sopra le lettere ricordano che è una somma di vettori.

Le forze che tengono fermo un corpo vengono spesso da un **vincolo**: un filo, un piano, un gancio, un perno. Il vincolo risponde con una **reazione vincolare**, che si adatta alle altre forze finché il vincolo non si rompe. Un filo teso tira lungo la sua direzione, con la **tensione** $T$. Un piano spinge perpendicolare a sé, con la forza normale $N$.

Con due fili inclinati il conto si fa con le componenti. Un quadro da 30 N è appeso a due fili, inclinati di 30° sull'orizzontale. Le componenti orizzontali delle due tensioni sono opposte e si annullano. Le componenti verticali reggono il peso.

~ 2 \cdot T_y = P :: le due componenti verticali reggono il peso insieme
~ T_y = T \cdot \sin 30^\circ = \tfrac{1}{2} \cdot T :: a 30° la componente verticale è metà della tensione: mezzo triangolo equilatero
~ 2 \cdot \tfrac{1}{2} \cdot T = 30\,\text{N} :: metto insieme le due righe
~ T = \evidb{30\,\text{N}} :: ogni filo tira quanto tutto il peso del quadro

Più i fili si avvicinano all'orizzontale, più devono tirare. Le loro componenti verticali diventano piccole, e per reggere il peso le tensioni crescono.

[[grafico:lampada]]

>! Una fune con un peso appeso nel mezzo non si può tendere perfettamente orizzontale. Servirebbero tensioni infinite: la fune si spezza prima.

?? Un quadro da 52 N è appeso a due fili, inclinati di 30° sull'orizzontale. Quanto tira ogni filo?
[ ] 26 N
[x] 52 N
[ ] 104 N
=> Ogni filo regge 26 N in verticale, ma a 30° la componente verticale è metà della tensione: $T = 2 \cdot 26\,\text{N} = 52\,\text{N}$. Non è metà del peso.`
    },
    {
      id: 'piano-inclinato',
      titolo: 'Il piano inclinato',
      testo: R`Perché su una salita ripida si scivola di più? Su un piano inclinato il peso non preme tutto contro il piano. Una parte schiaccia il corpo sul piano, un'altra lo tira giù lungo il pendio.

[[video:equilibrio/piano-inclinato]]

Il piano inclinato è un triangolo rettangolo: **altezza** $h$, **lunghezza** $l$ del pendio e **base** $b$. Il peso $P$ si scompone in due parti. $P_\parallel$ è parallela al piano e tira il corpo verso il basso. $P_\perp$ è perpendicolare al piano e lo preme contro di esso.

Il triangolo delle forze e il triangolo del piano hanno gli stessi angoli: sono **simili**. Il peso $P$ corrisponde alla lunghezza $l$. La parte $P_\parallel$ corrisponde all'altezza $h$, la parte $P_\perp$ alla base $b$.

>* Sul piano inclinato $P_\parallel = P \cdot \dfrac{h}{l}$ e $P_\perp = P \cdot \dfrac{b}{l}$. Il piano risponde con la forza normale $N = P_\perp$.

Esempio. Un carrello da 250 N sta su una rampa lunga 2,5 m e alta 0,7 m. La base della rampa misura 2,4 m.

~ P_\parallel = P \cdot \dfrac{h}{l} = 250\,\text{N} \cdot \dfrac{0{,}7\,\text{m}}{2{,}5\,\text{m}} :: la parte del peso lungo la rampa
~ P_\parallel = \evidb{70\,\text{N}} :: i metri si semplificano: per tenerlo fermo basta una forza di 70 N
~ P_\perp = 250\,\text{N} \cdot \dfrac{2{,}4\,\text{m}}{2{,}5\,\text{m}} = 240\,\text{N} :: la parte che preme sulla rampa, e che la rampa regge con $N$

Senza attrito, per tenere fermo il corpo serve una forza uguale a $P_\parallel$, diretta su per il pendio. Più il piano è ripido, più $h/l$ è grande e più forza serve.

[[grafico:piano]]

> Con la calcolatrice: $h/l$ è il seno dell'angolo $\alpha$ fra il piano e l'orizzontale, $b/l$ il coseno. Quindi $P_\parallel = P \cdot \sin\alpha$ e $P_\perp = P \cdot \cos\alpha$.

Se c'è attrito, il corpo può restare fermo anche senza fune. L'attrito statico regge $P_\parallel$, ma al massimo vale $\mu_s \cdot N$. Il corpo scivola quando $P_\parallel$ supera questo valore.

>! Su un piano inclinato la forza normale **non** è uguale al peso. È uguale solo alla parte perpendicolare, $P_\perp$, che è sempre minore di $P$.

?? Un blocco sta fermo su un piano inclinato senza attrito, tenuto da una fune parallela al piano. Quanto tira la fune?
[ ] quanto il peso del blocco
[x] meno del peso del blocco
[ ] più del peso del blocco
=> La fune deve equilibrare solo $P_\parallel = P \cdot h/l$. L'altezza $h$ è sempre minore della lunghezza $l$, quindi serve meno forza del peso.`
    },
    {
      id: 'momento',
      titolo: 'Il momento di una forza',
      testo: R`Prova a spingere una porta vicino ai cardini: fai una gran fatica. Con la stessa forza, vicino alla maniglia, la porta si apre subito. Per far ruotare un corpo non conta solo quanto spingi, ma anche dove.

[[video:equilibrio/momento]]

Una forza può far **ruotare** un corpo attorno a un punto fisso, il **polo**: per la porta sono i cardini. L'effetto dipende dalla forza e dalla distanza della sua **retta d'azione**, la retta su cui sta la freccia.

>* Il **momento** di una forza rispetto a un polo è $M = F \cdot b$. Il **braccio** $b$ è la distanza fra il polo e la retta d'azione della forza. Il momento si misura in newton per metro, $\text{N} \cdot \text{m}$.

Esempio. Per svitare un bullone si spinge una chiave lunga 25 cm, con 50 N perpendicolari alla chiave.

~ M = F \cdot b :: il momento rispetto al bullone, che fa da polo
~ M = 50\,\text{N} \cdot 0{,}25\,\text{m} :: la forza è perpendicolare alla chiave: il braccio è tutta la chiave
~ M = \evidb{12{,}5\,\text{N} \cdot \text{m}} :: con una chiave lunga il doppio basterebbe metà forza

Il braccio non è sempre la distanza fra il polo e il punto in cui si spinge. Se la forza è di sbieco, il braccio è più corto. Si può anche scomporre la forza: fa ruotare solo la componente perpendicolare alla porta. Se la retta d'azione passa per il polo, il braccio è zero e la forza non fa ruotare.

[[grafico:porta]]

Il momento ha anche un **segno**, che dice il verso della rotazione. Di solito si prende positivo se la forza fa girare in senso antiorario, negativo se in senso orario.

> Il newton per metro del momento non si chiama joule. Il joule è l'unità del lavoro, che è un'altra grandezza.

>! Una forza grande non ha per forza un momento grande. Con il braccio zero il momento è zero: spingere la porta verso i cardini non la apre.

?? Spingi una porta a 60 cm dai cardini, perpendicolare alla porta. Poi spingi con la stessa forza a 30 cm. Come cambia il momento?
[ ] resta uguale
[x] si dimezza
[ ] raddoppia
=> Il braccio si dimezza, e con lui il momento: $M = F \cdot b$. Per aprire la porta allo stesso modo servirebbe una forza doppia.`
    },
    {
      id: 'corpo-rigido',
      titolo: 'La coppia e l\'equilibrio del corpo rigido',
      testo: R`Un punto materiale può solo spostarsi. Un corpo esteso, come una porta o una trave, può anche ruotare. Se non si deforma, lo si chiama **corpo rigido**.

Per un corpo rigido la risultante zero non basta. Pensa al volante di un'auto: le due mani tirano con forze uguali e opposte. La risultante è zero, eppure il volante gira.

Due forze uguali e opposte, su due rette d'azione diverse, formano una **coppia**. Non spostano il corpo, ma lo fanno ruotare. Il momento della coppia è $M = F \cdot b$, dove il braccio $b$ è la distanza fra le due rette d'azione.

[[grafico:coppia]]

Esempio. Due mani stanno ai due capi di un diametro del volante, lungo 36 cm. Tirano con 15 N ciascuna, tangenti al volante e in versi opposti.

~ M = F \cdot b :: il momento della coppia
~ M = 15\,\text{N} \cdot 0{,}36\,\text{m} :: la distanza fra le rette d'azione è il diametro del volante
~ M = \evidb{5{,}4\,\text{N} \cdot \text{m}} :: il momento di una coppia non dipende da dove si mette il polo

>* Un corpo rigido fermo resta in **equilibrio** se valgono due condizioni: la **risultante** delle forze è zero e la **somma dei momenti** è zero.

La prima condizione impedisce al corpo di spostarsi. La seconda gli impedisce di ruotare. Se il corpo è in equilibrio, i momenti si annullano rispetto a qualunque polo. Conviene scegliere il polo dove agisce una forza che non si conosce: il suo momento è zero, e sparisce dal conto.

>! Risultante zero non vuol dire equilibrio. Una coppia ha risultante zero, ma fa girare il corpo.

?? Su una tavola agiscono due forze di 10 N, opposte, su due rette parallele distanti 2 m. La tavola è in equilibrio?
[ ] sì, perché la risultante è zero
[x] no: le due forze la fanno ruotare
[ ] no: la tavola si sposta nel verso di una delle forze
=> È una coppia: risultante zero, ma momento $10\,\text{N} \cdot 2\,\text{m} = 20\,\text{N} \cdot \text{m}$. La tavola non si sposta, però gira.`
    },
    {
      id: 'leve',
      titolo: 'Le leve',
      testo: R`Un bambino può tenere in equilibrio un adulto sull'altalena? Sì, se si siede abbastanza lontano dal centro.

[[video:equilibrio/leve]]

Una **leva** è un'asta rigida che può ruotare attorno a un punto fisso, il **fulcro**. Sulla leva agiscono due forze. La **potenza** $F_P$ è la forza che fai tu. La **resistenza** $F_R$ è la forza da vincere: un peso, un chiodo, una noce.

Anche il fulcro spinge sulla leva, ma la sua forza passa per il fulcro. Rispetto al fulcro ha braccio zero, quindi momento zero. Restano i momenti di potenza e resistenza, che devono essere uguali.

>* **Legge della leva**: una leva è in equilibrio quando $F_P \cdot b_P = F_R \cdot b_R$. I bracci $b_P$ e $b_R$ sono le distanze delle due rette d'azione dal fulcro.

Nel video le due forze si chiamano $F_1$ e $F_2$: sono la potenza e la resistenza.

Esempio. Con un piede di porco si solleva un masso. La resistenza è di 900 N, a 5 cm dal fulcro. Si spinge a 45 cm dal fulcro.

~ F_P \cdot b_P = F_R \cdot b_R :: la legge della leva
~ F_P \cdot 45\,\text{cm} = 900\,\text{N} \cdot 5\,\text{cm} :: i bracci si possono lasciare in centimetri: si semplificano
~ F_P = \dfrac{4500}{45}\,\text{N} = \evidb{100\,\text{N}} :: braccio nove volte più lungo, forza nove volte più piccola

Una leva è **vantaggiosa** se la potenza è minore della resistenza, cioè se $b_P$ è maggiore di $b_R$. Le leve si dividono in tre generi, secondo che cosa sta in mezzo.

| genere | in mezzo c'è | esempi | vantaggiosa? |
|---|---|---|---|
| primo | il fulcro | altalena, forbici, pinze | dipende dai bracci |
| secondo | la resistenza | carriola, schiaccianoci | sempre |
| terzo | la potenza | pinzette, avambraccio | mai |

[[grafico:altalena]]

>! Una leva svantaggiosa non è inutile. Le pinzette e l'avambraccio chiedono più forza, ma muovono la punta più in fretta e con più precisione.

?? Sull'altalena un papà da 750 N siede a 1 m dal fulcro. A che distanza deve sedersi il figlio, che pesa 300 N?
[ ] 1 m
[x] 2,5 m
[ ] 3 m
=> Servono momenti uguali: $750\,\text{N} \cdot 1\,\text{m} = 300\,\text{N} \cdot b$, quindi $b = 2{,}5\,\text{m}$. Peso due volte e mezzo più piccolo, braccio due volte e mezzo più lungo.`
    },
    {
      id: 'macchine',
      titolo: 'Carrucole e macchine semplici',
      testo: R`Per tirare su una cassa pesante non basta la forza: serve un trucco. Le **macchine semplici** cambiano la forza che serve, oppure il suo verso. Sono la leva, la carrucola, il verricello, il piano inclinato, il cuneo e la vite.

[[video:equilibrio/carrucola-mobile]]

Una **carrucola fissa** è una ruota appesa a un supporto, con una fune nella gola. Con fune e carrucola ideali, senza massa e senza attrito, la mano tira con una forza uguale al peso: $F = P$. Non si risparmia forza: cambia solo il verso. Si tira verso il basso, che è più comodo.

Una **carrucola mobile** sale insieme al carico. È retta da due tratti di fune, che tirano con la stessa tensione. Ogni tratto regge metà del peso, e la mano tira con $F = \dfrac{P}{2}$.

[[grafico:carrucole]]

Il risparmio ha un prezzo. Per alzare la cassa di 1 m, la mano tira 2 m di fune. Con un **paranco**, fatto di più carrucole, il carico è retto da più tratti di fune.

>* Con fune e carrucole ideali, se il carico è retto da $n$ tratti di fune, per tenerlo serve $F = \dfrac{P}{n}$. In cambio, la fune va tirata per $n$ volte lo spostamento del carico.

Il **verricello**, o argano, è un cilindro con una manovella, come quello dei pozzi. È una leva che continua a girare. La potenza ha come braccio la manovella $R$, il peso ha come braccio il raggio $r$ del cilindro.

~ F \cdot R = P \cdot r :: la legge della leva, con i due bracci
~ F \cdot 40\,\text{cm} = 120\,\text{N} \cdot 10\,\text{cm} :: un secchio da 120 N, una manovella di 40 cm, un cilindro di 10 cm
~ F = \evidb{30\,\text{N}} :: braccio quattro volte più lungo: un quarto del peso del secchio

>! Nessuna macchina regala niente. Quello che si guadagna in forza si perde in spostamento: metà forza, doppia corda.

?? Un paranco regge una cassa con 6 tratti di fune. Per alzare la cassa di 1 m, quanta fune tiri?
[ ] 1 m
[ ] 3 m
[x] 6 m
=> Ognuno dei 6 tratti si accorcia di 1 m: in tutto la mano tira 6 m di fune. In cambio la forza è un sesto del peso.`
    },
    {
      id: 'baricentro',
      titolo: 'Il baricentro e la stabilità',
      testo: R`Una matita in piedi cade appena la sfiori. Una piramide non cade mai. Che cosa le rende così diverse?

Il peso agisce su ogni pezzetto di un corpo. Per l'equilibrio, però, tutto va come se agisse in un solo punto.

>* Il **baricentro** $G$ è il punto in cui si può pensare applicato tutto il peso del corpo.

In un corpo omogeneo e simmetrico il baricentro sta nel centro: il centro di una sfera, di un cubo, di un'asta. Per gli altri corpi c'è un modo pratico. Si appende il corpo per un punto e si segna la verticale con un filo a piombo. Si ripete da un altro punto. Il baricentro è dove le due verticali si incrociano.

[[video:equilibrio/baricentro]]

Un corpo appoggiato tocca il piano in alcuni punti. La **base d'appoggio** è la figura che li racchiude. Il corpo sta in piedi finché la verticale che scende da $G$ cade dentro la base. Quando cade fuori, il peso fa ruotare il corpo attorno allo spigolo, e il corpo si ribalta.

Un corpo inclinato poggia su uno spigolo. Allora conta da che parte dello spigolo cade la verticale da $G$. Dalla parte della base, il peso lo riporta giù. Oltre lo spigolo, lo ribalta.

[[grafico:scatola]]

La torre di Pisa pende di circa 4°, ma la verticale dal suo baricentro cade ancora dentro la base. Una base larga e un baricentro basso rendono un corpo difficile da ribaltare.

Per distinguere gli equilibri si sposta un poco il corpo.

- **Stabile**: il corpo torna da solo dov'era, come una pallina in fondo a una conca.
- **Instabile**: il corpo si allontana sempre di più, come una pallina in cima a una cupola.
- **Indifferente**: il corpo resta dove lo metti, come una pallina su un tavolo.

> Un corpo appeso a un perno è in equilibrio stabile se il perno sta sopra il baricentro. È instabile se sta sotto. Se il perno passa proprio per $G$, l'equilibrio è indifferente.

>! Il baricentro non sta per forza dentro il corpo. In un anello sta nel centro, dove non c'è materia.

?? Una scatola inclinata poggia solo su uno spigolo. Quando si ribalta?
[ ] appena smetti di tenerla
[x] quando la verticale dal baricentro passa oltre lo spigolo
[ ] quando l'angolo supera 45°
=> Finché la verticale da $G$ cade dalla parte della base, il peso la riporta giù. L'angolo limite dipende dalla forma: una scatola alta e stretta si ribalta prima.`
    },
    {
      id: 'problemi',
      titolo: 'Come si risolve un problema di equilibrio',
      testo: R`I problemi di statica si somigliano tutti. Conviene affrontarli sempre con gli stessi passi.

1. **Scegli il corpo** di cui studi l'equilibrio.
2. **Disegna tutte le forze** che agiscono su di lui, ciascuna nel suo punto. Il peso va nel baricentro; poi le reazioni dei vincoli, le tensioni, le spinte. È il **diagramma delle forze**, detto anche di corpo libero.
3. **Risultante zero**: la somma delle componenti orizzontali è zero, e così quella delle verticali.
4. **Momenti zero**: per un corpo esteso scegli un polo dove agisce una forza che non conosci. La somma dei momenti è zero.
5. **Controlla**, per esempio con i momenti rispetto a un altro polo.

>* Un corpo esteso è in equilibrio se si annullano tre somme: le componenti orizzontali, le componenti verticali e i momenti.

Esempio. Un'asse leggera, lunga 3 m, poggia su due cavalletti agli estremi A e B. A 1 m da A c'è un carico di 300 N. Con che forza spingono i cavalletti?

~ N_B \cdot 3\,\text{m} - 300\,\text{N} \cdot 1\,\text{m} = 0 :: momenti rispetto ad A: la forza $N_A$ ha braccio zero e sparisce
~ N_B = \dfrac{300\,\text{N} \cdot 1\,\text{m}}{3\,\text{m}} = \evidb{100\,\text{N}} :: il cavalletto lontano dal carico spinge poco
~ N_A + N_B = 300\,\text{N} :: risultante zero: i due cavalletti reggono il carico insieme
~ N_A = 300\,\text{N} - 100\,\text{N} = \evidb{200\,\text{N}} :: controllo con i momenti rispetto a B: $200 \cdot 3 = 300 \cdot 2$, torna

Nel disegno una persona cammina sull'asse. L'appoggio più vicino a lei spinge di più.

[[grafico:trave]]

>! Anche il peso del corpo va nel conto, applicato nel baricentro. Un'asse omogenea ha il suo peso a metà della lunghezza.

?? Un carico sta proprio a metà di un'asse leggera, appoggiata su due cavalletti. Quanto regge ciascun cavalletto?
[ ] tutto il carico
[x] metà del carico
[ ] dipende da quanto è lunga l'asse
=> Per simmetria i bracci sono uguali, quindi i due cavalletti spingono uguale. Insieme reggono tutto il carico: metà ciascuno.`
    }
  ],
  grafici: {
    /* un peso appeso a due fili inclinati: la componente verticale di ogni tensione è sempre 20 N */
    lampada: {
      tipo: 'piano', x: [-7, 7], y: [-5.2, 6.6], altezza: 520, assi: false, passo: [1, 1],
      parametri: [{ nome: 'al', min: 20, max: 75, passo: 5, valore: 30, etichetta: 'angolo dei fili α (°)' }],
      elementi: [
        { tipo: 'segmento', da: [0, 0], a: ['-6*cos(al*pi/180)', '6*sin(al*pi/180)'], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: ['6*cos(al*pi/180)', '6*sin(al*pi/180)'], colore: 'grigio' },
        { tipo: 'segmento', da: ['-6*cos(al*pi/180) - 0.7', '6*sin(al*pi/180)'], a: ['-6*cos(al*pi/180) + 0.7', '6*sin(al*pi/180)'], colore: 'grigio' },
        { tipo: 'segmento', da: ['6*cos(al*pi/180) - 0.7', '6*sin(al*pi/180)'], a: ['6*cos(al*pi/180) + 0.7', '6*sin(al*pi/180)'], colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(al*pi/180)', 'sin(al*pi/180)'], raggio: 0.8, etichetta: 'α', colore: 'grigio' },
        { tipo: 'vettore', da: [0, 0], a: ['-2*cos(al*pi/180)/sin(al*pi/180)', 2], etichetta: 'T_1', colore: 2 },
        { tipo: 'vettore', da: [0, 0], a: ['2*cos(al*pi/180)/sin(al*pi/180)', 2], etichetta: 'T_2', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 0], a: [0, -4], etichetta: 'P = 40 N', colore: 2 },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'testo', p: [6.8, -4.4], testo: 'T_1 = T_2 ≈ {{round(20/sin(al*pi/180))}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'Un peso di 40 N appeso a due fili (un quadretto = 10 N). Ogni tensione ha la componente verticale di 20 N: insieme reggono il peso. Con il cursore i fili si avvicinano all\'orizzontale, e le tensioni crescono molto.'
    },
    /* il piano inclinato del video (10 kg, cioè 98 N): P si scompone in P∥ e P⊥; N e la fune T le annullano */
    piano: {
      tipo: 'piano', x: [-3, 11], y: [-3.6, 9.6], altezza: 560, assi: false, passo: [1, 1],
      parametri: [{ nome: 'al', min: 20, max: 60, passo: 5, valore: 30, etichetta: 'angolo del piano α (°)' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], ['10*cos(al*pi/180)', 0], ['10*cos(al*pi/180)', '10*sin(al*pi/180)']], colore: 'grigio' },
        { tipo: 'poligono', punti: [
          ['5.2*cos(al*pi/180)', '5.2*sin(al*pi/180)'], ['6.8*cos(al*pi/180)', '6.8*sin(al*pi/180)'],
          ['6.8*cos(al*pi/180) - 1.6*sin(al*pi/180)', '6.8*sin(al*pi/180) + 1.6*cos(al*pi/180)'],
          ['5.2*cos(al*pi/180) - 1.6*sin(al*pi/180)', '5.2*sin(al*pi/180) + 1.6*cos(al*pi/180)']], colore: 'grigio' },
        { tipo: 'segmento', da: ['6.8*cos(al*pi/180) - 0.8*sin(al*pi/180)', '6.8*sin(al*pi/180) + 0.8*cos(al*pi/180)'], a: ['10*cos(al*pi/180) - 0.8*sin(al*pi/180)', '10*sin(al*pi/180) + 0.8*cos(al*pi/180)'], colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(al*pi/180)', 'sin(al*pi/180)'], raggio: 1.6, colore: 'grigio' },
        { tipo: 'testo', p: ['(4.1 - 0.05*al)*cos(al*pi/360)', '(4.1 - 0.05*al)*sin(al*pi/360) - 0.15'], testo: 'α' },
        { tipo: 'vettore', da: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180)'], a: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180) - 4.9'], etichetta: 'P', colore: 2, posizione: 'destra', componenti: { lungo: 'al' } },
        { tipo: 'vettore', da: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180)'], a: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180) - 4.9*sin(al*pi/180)*cos(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180) + 4.9*cos(al*pi/180)^2'], etichetta: 'N', colore: 2 },
        { tipo: 'vettore', da: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180)'], a: ['6*cos(al*pi/180) - 0.8*sin(al*pi/180) + 4.9*sin(al*pi/180)*cos(al*pi/180)', '6*sin(al*pi/180) + 0.8*cos(al*pi/180) + 4.9*sin(al*pi/180)^2'], etichetta: 'T', colore: 2 },
        { tipo: 'testo', p: [10.8, 9.0], testo: 'P = 98 N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [10.8, 8.1], testo: 'T = P_∥ ≈ {{round(98*sin(al*pi/180))}} N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [10.8, 7.2], testo: 'N = P_⊥ ≈ {{round(98*cos(al*pi/180))}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'Un blocco da 98 N tenuto da una fune su un piano senza attrito (un quadretto = 20 N). Il peso si scompone in due parti, tratteggiate: lungo il piano e contro il piano. La forza normale N annulla la seconda, la tensione T della fune la prima. Con il cursore il piano diventa più ripido.'
    },
    /* la porta vista dall'alto: il braccio è la distanza dal cardine alla retta d'azione */
    porta: {
      tipo: 'piano', x: [-0.32, 1.05], y: [-0.32, 0.72], altezza: 480, assi: false, griglia: false,
      parametri: [
        { nome: 'd', min: 0.4, max: 0.8, passo: 0.1, valore: 0.8, etichetta: 'punto di spinta (m)' },
        { nome: 'th', min: 20, max: 90, passo: 5, valore: 90, etichetta: 'angolo α (°)' }
      ],
      elementi: [
        { tipo: 'poligono', punti: [[0, -0.035], [0.9, -0.035], [0.9, -0.012], [0, -0.012]], colore: 'grigio' },
        { tipo: 'segmento', da: ['d + 0.02*cos(th*pi/180)', '-0.02*sin(th*pi/180)'], a: ['d - 1.5*cos(th*pi/180)', '1.5*sin(th*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['d*sin(th*pi/180)^2', 'd*sin(th*pi/180)*cos(th*pi/180)'], a: [0, 0], colore: 'grigio', etichetta: 'b' },
        { tipo: 'angolo', vertice: ['d', 0], da: ['d - 0.1', 0], a: ['d - 0.1*cos(th*pi/180)', '0.1*sin(th*pi/180)'], raggio: 0.09, etichetta: 'α', colore: 'grigio' },
        { tipo: 'vettore', da: ['d', 0], a: ['d - 0.3*cos(th*pi/180)', '0.3*sin(th*pi/180)'], etichetta: 'F = 20 N', colore: 2, posizione: 'destra' },
        { tipo: 'punto', p: [0, 0], etichetta: 'cardine', posizione: 'basso-sinistra', colore: 'grigio' },
        { tipo: 'testo', p: [1.03, -0.14], testo: 'b ≈ {{round(100*d*sin(th*pi/180))}} cm', ancora: 'end' },
        { tipo: 'testo', p: [1.03, -0.25], testo: 'M = F·b ≈ {{20*round(100*d*sin(th*pi/180))/100}} N·m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una porta vista dall\'alto, spinta con 20 N. Il braccio b va dal cardine alla retta d\'azione della forza (tratteggiata). Con i cursori si cambiano il punto di spinta, cioè la sua distanza dal cardine, e l\'angolo α fra la forza e la porta.'
    },
    /* la coppia sul volante: risultante zero, ma il volante gira */
    coppia: {
      tipo: 'piano', x: [-3.4, 3.4], y: [-2.6, 2.6], altezza: 380, assi: false, griglia: false,
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 1.8, colore: 'grigio' },
        { tipo: 'segmento', da: [-1.8, 0], a: [1.8, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [0, 0.3], testo: 'b' },
        { tipo: 'vettore', da: [-1.8, 0], a: [-1.8, -1.6], etichetta: 'F', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [1.8, 0], a: [1.8, 1.6], etichetta: 'F', colore: 2, posizione: 'destra' },
        { tipo: 'testo', p: [3.3, -2.3], testo: 'F_{tot} = 0, ma M = F·b', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Due mani tirano il volante con forze uguali e opposte, su rette d\'azione distanti b. La risultante è zero, ma il volante gira in senso antiorario: il momento della coppia è F·b.'
    },
    /* l'altalena del video: l'adulto fermo a 1 m, il bambino si sposta; l'asse pende dalla parte del momento più grande */
    altalena: {
      tipo: 'piano', x: [-4.6, 5.6], y: [-0.4, 4.4], altezza: 420, assi: false, griglia: false,
      parametri: [{ nome: 'b', min: 1, max: 4, passo: 0.25, valore: 2, etichetta: 'bambino dal fulcro (m)' }],
      elementi: [
        { tipo: 'segmento', da: [-4.6, 0], a: [5.6, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.5, 0], [0.5, 0], [0, 1.6]], colore: 'grigio' },
        { tipo: 'segmento', da: ['-4*cos(0.12*sign(600 - 200*b))', '1.6 - 4*sin(0.12*sign(600 - 200*b))'], a: ['4*cos(0.12*sign(600 - 200*b))', '1.6 + 4*sin(0.12*sign(600 - 200*b))'], colore: 'grigio' },
        { tipo: 'vettore', da: ['-cos(0.12*sign(600 - 200*b))', '1.6 - sin(0.12*sign(600 - 200*b))'], a: ['-cos(0.12*sign(600 - 200*b))', '0.1 - sin(0.12*sign(600 - 200*b))'], etichetta: '600 N', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: ['b*cos(0.12*sign(600 - 200*b))', '1.6 + b*sin(0.12*sign(600 - 200*b))'], a: ['b*cos(0.12*sign(600 - 200*b))', '1.1 + b*sin(0.12*sign(600 - 200*b))'], etichetta: '200 N', colore: 2 },
        { tipo: 'testo', p: [5.4, 4.0], testo: 'adulto: 600 N · 1 m = 600 N·m', ancora: 'end' },
        { tipo: 'testo', p: [5.4, 3.35], testo: 'bambino: 200 N · {{b}} m = {{200*b}} N·m', ancora: 'end' }
      ],
      didascalia: 'L\'adulto (600 N) siede a 1 m dal fulcro; con il cursore il bambino (200 N) si sposta. L\'asse pende dalla parte del momento più grande. Con i due momenti uguali resta orizzontale: succede a 3 m.'
    },
    /* carrucola fissa e carrucola mobile con la stessa cassa da 98 N (un quadretto ideale = 49 N) */
    carrucole: {
      tipo: 'piano', x: [-5, 5], y: [-0.9, 7.4], altezza: 480, assi: false, griglia: false,
      elementi: [
        { tipo: 'segmento', da: [-5, 7], a: [5, 7], colore: 'grigio' },
        { tipo: 'segmento', da: [-2.5, 7], a: [-2.5, 6], colore: 'grigio' },
        { tipo: 'cerchio', centro: [-2.5, 6], raggio: 0.5, colore: 'grigio' },
        { tipo: 'segmento', da: [-3, 6], a: [-3, 2.6], colore: 'grigio' },
        { tipo: 'segmento', da: [-2, 6], a: [-2, 3.4], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-3.6, 1.6], [-2.4, 1.6], [-2.4, 2.6], [-3.6, 2.6]], colore: 'grigio' },
        { tipo: 'vettore', da: [-3, 2.1], a: [-3, 0.1], etichetta: 'P', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [-2, 3.4], a: [-2, 1.4], etichetta: 'F = P', colore: 2 },
        { tipo: 'testo', p: [-2.5, -0.6], testo: 'carrucola fissa' },
        { tipo: 'segmento', da: [2, 7], a: [2, 3.2], colore: 'grigio' },
        { tipo: 'segmento', da: [3, 3.2], a: [3, 5.2], colore: 'grigio' },
        { tipo: 'cerchio', centro: [2.5, 3.2], raggio: 0.5, colore: 'grigio' },
        { tipo: 'segmento', da: [2.5, 3.2], a: [2.5, 2.6], colore: 'grigio' },
        { tipo: 'poligono', punti: [[1.9, 1.6], [3.1, 1.6], [3.1, 2.6], [1.9, 2.6]], colore: 'grigio' },
        { tipo: 'vettore', da: [2.5, 2.1], a: [2.5, 0.1], etichetta: 'P', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [3, 5.2], a: [3, 6.2], etichetta: 'F = P/2', colore: 2, posizione: 'destra' },
        { tipo: 'testo', p: [2.5, -0.6], testo: 'carrucola mobile' }
      ],
      didascalia: 'La stessa cassa da 98 N, con fune e carrucole ideali; le frecce sono in scala. Con la carrucola fissa la mano tira con tutto il peso. Con la carrucola mobile la cassa è retta da due tratti di fune, e la mano tira con metà del peso.'
    },
    /* la scatola che si ribalta: larga 20 cm, alta 40 cm, inclinata sullo spigolo destro */
    scatola: {
      tipo: 'piano', x: [-3, 5], y: [-0.9, 5.2], altezza: 440, assi: false, passo: [1, 1],
      parametri: [{ nome: 'th', min: 0, max: 40, passo: 1, valore: 12, etichetta: 'inclinazione (°)' }],
      elementi: [
        { tipo: 'segmento', da: [-3, 0], a: [5, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[1, 0], ['1 - 2*cos(th*pi/180)', '2*sin(th*pi/180)'], ['1 - 2*cos(th*pi/180) + 4*sin(th*pi/180)', '2*sin(th*pi/180) + 4*cos(th*pi/180)'], ['1 + 4*sin(th*pi/180)', '4*cos(th*pi/180)']], colore: 'grigio' },
        { tipo: 'segmento', da: ['1 - cos(th*pi/180) + 2*sin(th*pi/180)', 'sin(th*pi/180) + 2*cos(th*pi/180)'], a: ['1 - cos(th*pi/180) + 2*sin(th*pi/180)', 0], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: ['1 - cos(th*pi/180) + 2*sin(th*pi/180)', 'sin(th*pi/180) + 2*cos(th*pi/180)'], a: ['1 - cos(th*pi/180) + 2*sin(th*pi/180)', 'sin(th*pi/180) + 2*cos(th*pi/180) - 1.5'], etichetta: 'P', colore: 2, posizione: 'destra' },
        { tipo: 'punto', p: ['1 - cos(th*pi/180) + 2*sin(th*pi/180)', 'sin(th*pi/180) + 2*cos(th*pi/180)'], etichetta: 'G', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [1, 0], colore: 'grigio' },
        { tipo: 'testo', p: [1, -0.6], testo: 'spigolo' },
        { tipo: 'testo', p: [4.9, 4.7], testo: 'si ribalta oltre ≈ 27°', ancora: 'end' }
      ],
      didascalia: 'Una scatola larga 20 cm e alta 40 cm (un quadretto = 10 cm), inclinata sullo spigolo. Finché la verticale tratteggiata da G cade dalla parte della base, il peso la riporta giù. Oltre circa 27° la verticale passa oltre lo spigolo e la scatola si ribalta.'
    },
    /* l'asse su due appoggi: la persona cammina, le reazioni cambiano (frecce in scala fra loro) */
    trave: {
      tipo: 'piano', x: [-0.9, 4.9], y: [-2.4, 2.3], altezza: 460, assi: false, griglia: false,
      parametri: [{ nome: 'q', min: 0.5, max: 3.5, passo: 0.25, valore: 1, etichetta: 'persona da A (m)' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], [4, 0], [4, 0.15], [0, 0.15]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.3, -0.55], [0.3, -0.55], [0, 0]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[3.7, -0.55], [4.3, -0.55], [4, 0]], colore: 'grigio' },
        { tipo: 'testo', p: [-0.4, -0.4], testo: 'A', ancora: 'end' },
        { tipo: 'testo', p: [4.4, -0.4], testo: 'B', ancora: 'start' },
        { tipo: 'vettore', da: ['q', 0], a: ['q', -2], etichetta: 'P = 600 N', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [0, 0.15], a: [0, '0.15 + (4 - q)/2'], etichetta: 'N_A = {{150*(4 - q)}} N', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [4, 0.15], a: [4, '0.15 + q/2'], etichetta: 'N_B = {{150*q}} N', colore: 2 }
      ],
      didascalia: 'Un\'asse leggera lunga 4 m su due appoggi A e B; con il cursore una persona da 600 N cammina sull\'asse. Le frecce sono in scala fra loro. Le due reazioni sommate fanno sempre 600 N, e la più grande è quella vicina alla persona.'
    }
  },
  esempi: [
    {
      titolo: 'Il semaforo appeso a due cavi',
      problema: R`Un semaforo da 120 N è appeso a metà fra due cavi uguali. Ogni cavo forma un angolo di 60° con l'orizzontale. Quanto vale la tensione di ciascun cavo?`,
      passi: [
        R`Dati: $P = 120\,\text{N}$, $\alpha = 60^\circ$ sull'orizzontale. Cerco la tensione $T$ di ogni cavo.`,
        R`Il semaforo è fermo: la risultante delle forze è zero. Scompongo le due tensioni in orizzontale e in verticale.`,
        R`Le componenti orizzontali, $T \cdot \cos 60^\circ$, sono uguali e opposte: si annullano.`,
        R`Le componenti verticali reggono il peso: $2 \cdot T \cdot \sin 60^\circ = P$.`,
        R`Con la calcolatrice $\sin 60^\circ \approx 0{,}866$, quindi $T = \dfrac{120\,\text{N}}{2 \cdot 0{,}866} \approx 69{,}3\,\text{N}$.`,
        R`Controllo: $T$ è più di metà del peso, come deve essere. Con due cavi verticali ognuno tirerebbe proprio $60\,\text{N}$.`
      ],
      risultato: R`Ogni cavo tira con $T \approx 69{,}3\,\text{N}$.`
    },
    {
      titolo: 'Il carrello sulla rampa',
      problema: R`Un carrello da 600 N sta su una rampa senza attrito, lunga 4 m e alta 1 m. Con che forza, parallela alla rampa, bisogna tenerlo fermo? Quanto vale la forza normale della rampa?`,
      passi: [
        R`Dati: $P = 600\,\text{N}$, $l = 4\,\text{m}$, $h = 1\,\text{m}$. Cerco la forza $F$ che lo tiene fermo e la forza normale $N$.`,
        R`Serve anche la base. Con Pitagora: $b = \sqrt{l^2 - h^2} = \sqrt{16 - 1}\,\text{m} = \sqrt{15}\,\text{m} \approx 3{,}87\,\text{m}$.`,
        R`La forza equilibra la parte del peso lungo la rampa: $F = P_\parallel = 600\,\text{N} \cdot \dfrac{1\,\text{m}}{4\,\text{m}} = 150\,\text{N}$.`,
        R`La rampa regge la parte perpendicolare: $N = P_\perp = 600\,\text{N} \cdot \dfrac{3{,}87\,\text{m}}{4\,\text{m}} \approx 581\,\text{N}$.`,
        R`Controllo: le due parti sono perpendicolari fra loro, quindi $\sqrt{150^2 + 581^2} \approx 600$. Torna.`
      ],
      risultato: R`$F = 150\,\text{N}$ e $N \approx 581\,\text{N}$.`
    },
    {
      titolo: 'La cassa scivola o no?',
      problema: R`Una cassa da 500 N è appoggiata su un piano inclinato lungo 3 m e alto 1,8 m. Il coefficiente di attrito statico è $\mu_s = 0{,}5$. La cassa resta ferma da sola? Se no, che forza minima, parallela al piano, serve per tenerla?`,
      passi: [
        R`Dati: $P = 500\,\text{N}$, $l = 3\,\text{m}$, $h = 1{,}8\,\text{m}$, $\mu_s = 0{,}5$. Cerco se la cassa scivola e la forza minima $F$ per tenerla.`,
        R`La base del piano: $b = \sqrt{3^2 - 1{,}8^2}\,\text{m} = \sqrt{5{,}76}\,\text{m} = 2{,}4\,\text{m}$.`,
        R`Le due parti del peso: $P_\parallel = 500 \cdot \dfrac{1{,}8}{3}\,\text{N} = 300\,\text{N}$ e $P_\perp = 500 \cdot \dfrac{2{,}4}{3}\,\text{N} = 400\,\text{N}$. Quindi $N = 400\,\text{N}$.`,
        R`L'attrito statico vale al massimo $\mu_s \cdot N = 0{,}5 \cdot 400\,\text{N} = 200\,\text{N}$. È meno dei 300 N che tirano giù: da sola la cassa scivola.`,
        R`Mancano $300\,\text{N} - 200\,\text{N} = 100\,\text{N}$. La forza minima, diretta su per il piano, è $F = 100\,\text{N}$.`
      ],
      risultato: R`La cassa scivola; per tenerla servono almeno $100\,\text{N}$ lungo il piano.`
    },
    {
      titolo: 'Il bullone duro',
      problema: R`Per svitare un bullone serve un momento di $60\,\text{N} \cdot \text{m}$. Con una chiave lunga 30 cm, quanta forza serve, spingendo perpendicolare alla chiave? E se si allunga la chiave con un tubo, fino a 75 cm?`,
      passi: [
        R`Dati: $M = 60\,\text{N} \cdot \text{m}$, $b_1 = 30\,\text{cm} = 0{,}30\,\text{m}$, $b_2 = 75\,\text{cm} = 0{,}75\,\text{m}$. Cerco le forze $F_1$ e $F_2$.`,
        R`La forza è perpendicolare alla chiave: il braccio è la lunghezza della chiave. Da $M = F \cdot b$ ricavo $F = \dfrac{M}{b}$.`,
        R`Con la chiave: $F_1 = \dfrac{60\,\text{N} \cdot \text{m}}{0{,}30\,\text{m}} = 200\,\text{N}$.`,
        R`Con il tubo: $F_2 = \dfrac{60\,\text{N} \cdot \text{m}}{0{,}75\,\text{m}} = 80\,\text{N}$.`,
        R`Controllo: il braccio cresce di 2,5 volte e la forza cala di 2,5 volte: $\dfrac{200}{2{,}5} = 80$. Torna.`
      ],
      risultato: R`Servono $200\,\text{N}$ con la chiave e $80\,\text{N}$ con il tubo.`
    },
    {
      titolo: 'La carriola',
      problema: R`In una carriola il carico pesa 600 N, e il suo baricentro sta a 40 cm dall'asse della ruota. I manici sono a 1,2 m dall'asse. Con che forza verticale si sollevano i manici? Con che forza il terreno spinge sulla ruota?`,
      passi: [
        R`Dati: $F_R = 600\,\text{N}$, $b_R = 0{,}4\,\text{m}$, $b_P = 1{,}2\,\text{m}$. Cerco la potenza $F_P$ e la forza sulla ruota.`,
        R`È una leva di secondo genere: il fulcro è l'asse della ruota, la resistenza sta in mezzo.`,
        R`Legge della leva: $F_P \cdot 1{,}2\,\text{m} = 600\,\text{N} \cdot 0{,}4\,\text{m}$, quindi $F_P = \dfrac{240}{1{,}2}\,\text{N} = 200\,\text{N}$.`,
        R`Risultante zero: le mani e la ruota insieme reggono 600 N. Il terreno spinge sulla ruota con $600\,\text{N} - 200\,\text{N} = 400\,\text{N}$.`,
        R`Controllo con i momenti rispetto ai manici: la ruota dà $400 \cdot 1{,}2 = 480$, il carico $600 \cdot 0{,}8 = 480$. Torna.`
      ],
      risultato: R`$F_P = 200\,\text{N}$; la ruota regge $400\,\text{N}$.`
    },
    {
      titolo: 'L\'asse con il suo peso',
      problema: R`Un'asse omogenea lunga 4 m pesa 200 N e poggia su due appoggi agli estremi A e B. Una persona da 500 N sta in piedi a 1 m da A. Con che forza spinge ciascun appoggio?`,
      passi: [
        R`Dati: $L = 4\,\text{m}$, peso dell'asse $P_a = 200\,\text{N}$ a $2\,\text{m}$ da A, persona $P_p = 500\,\text{N}$ a $1\,\text{m}$ da A. Cerco $N_A$ e $N_B$.`,
        R`Momenti rispetto ad A, dove $N_A$ ha braccio zero: $N_B \cdot 4\,\text{m} - 200\,\text{N} \cdot 2\,\text{m} - 500\,\text{N} \cdot 1\,\text{m} = 0$.`,
        R`Quindi $N_B = \dfrac{400 + 500}{4}\,\text{N} = 225\,\text{N}$.`,
        R`Risultante zero: $N_A + N_B = 200\,\text{N} + 500\,\text{N} = 700\,\text{N}$, quindi $N_A = 700\,\text{N} - 225\,\text{N} = 475\,\text{N}$.`,
        R`Controllo con i momenti rispetto a B: $N_A \cdot 4 = 200 \cdot 2 + 500 \cdot 3 = 1900$, e $\dfrac{1900}{4} = 475$. Torna.`
      ],
      risultato: R`$N_A = 475\,\text{N}$ e $N_B = 225\,\text{N}$.`
    }
  ],
  formulario: [
    { nome: 'Equilibrio del punto materiale', formula: R`R_x = 0 \qquad R_y = 0`, nota: R`La risultante è zero: si annullano le somme delle componenti lungo i due assi.` },
    { nome: 'Peso', formula: R`P = m \cdot g`, nota: R`Sulla Terra $g = 9{,}8\,\text{N/kg}$. Il peso si applica nel baricentro.` },
    { nome: 'Piano inclinato', formula: R`P_\parallel = P \cdot \dfrac{h}{l} \qquad P_\perp = P \cdot \dfrac{b}{l}`, nota: R`$h$ altezza, $l$ lunghezza, $b$ base del piano. Senza attrito, per tenere fermo il corpo serve una forza uguale a $P_\parallel$.` },
    { nome: 'Piano inclinato con l\'angolo', formula: R`P_\parallel = P \cdot \sin\alpha \qquad P_\perp = P \cdot \cos\alpha`, nota: R`$\alpha$ è l'angolo del piano con l'orizzontale; calcolatrice in gradi.` },
    { nome: 'Forza normale sul piano inclinato', formula: R`N = P_\perp`, nota: R`Minore del peso. L'attrito statico vale al massimo $\mu_s \cdot N$.` },
    { nome: 'Momento di una forza', formula: R`M = F \cdot b`, nota: R`$b$ è la distanza fra il polo e la retta d'azione. In $\text{N} \cdot \text{m}$; positivo se fa girare in senso antiorario.` },
    { nome: 'Momento di una coppia', formula: R`M = F \cdot b`, nota: R`Il braccio $b$ è la distanza fra le due rette d'azione. Non dipende dal polo.` },
    { nome: 'Equilibrio del corpo rigido', formula: R`\vec{F}_{\text{tot}} = 0 \qquad M_{\text{tot}} = 0`, nota: R`Risultante zero e somma dei momenti zero, rispetto a un polo qualsiasi.` },
    { nome: 'Legge della leva', formula: R`F_P \cdot b_P = F_R \cdot b_R`, nota: R`Vantaggiosa se $b_P > b_R$: il secondo genere sempre, il terzo mai.` },
    { nome: 'Carrucola fissa e carrucola mobile', formula: R`F = P \qquad F = \dfrac{P}{2}`, nota: R`Con fune e carrucole ideali, senza massa e senza attrito.` },
    { nome: 'Paranco', formula: R`F = \dfrac{P}{n}`, nota: R`$n$ tratti di fune reggono il carico. La fune si tira per $n$ volte lo spostamento del carico.` },
    { nome: 'Verricello', formula: R`F \cdot R = P \cdot r`, nota: R`$R$ è la lunghezza della manovella, $r$ il raggio del cilindro.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'punto-materiale', tipo: 'definizione', fronte: R`Che cos'è un **punto materiale**?`, retro: R`Un corpo di cui si trascurano le dimensioni: un punto che ha una massa. Le forze possono spostarlo, non farlo ruotare.` },
    { id: 'fc-02', sezione: 'punto-materiale', tipo: 'concetto', fronte: R`Quando un punto materiale fermo resta in **equilibrio**?`, retro: R`Quando la risultante delle forze che agiscono su di lui è zero.` },
    { id: 'fc-03', sezione: 'punto-materiale', tipo: 'definizione', fronte: R`Che cos'è una **reazione vincolare**?`, retro: R`La forza con cui un vincolo (un filo, un piano, un perno) risponde alle altre forze. Si adatta finché il vincolo non si rompe.` },
    { id: 'fc-04', sezione: 'punto-materiale', tipo: 'concetto', fronte: R`Due fili reggono un peso. Che cosa succede alle tensioni se i fili si avvicinano all'orizzontale?`, retro: R`Crescono. Le componenti verticali diventano piccole, e per reggere il peso servono tensioni più grandi.` },
    { id: 'fc-05', sezione: 'piano-inclinato', tipo: 'formula', fronte: R`Le due parti del peso sul **piano inclinato**`, retro: R`$P_\parallel = P \cdot \dfrac{h}{l}$ lungo il piano, $P_\perp = P \cdot \dfrac{b}{l}$ contro il piano.` },
    { id: 'fc-06', sezione: 'piano-inclinato', tipo: 'concetto', fronte: R`Perché nelle formule del piano inclinato compaiono i lati del piano?`, retro: R`Il triangolo delle forze e quello del piano hanno gli stessi angoli. Sono simili, quindi i lati sono in proporzione.` },
    { id: 'fc-07', sezione: 'piano-inclinato', tipo: 'concetto', fronte: R`Sul piano inclinato la forza normale è uguale al peso?`, retro: R`No. È uguale solo alla parte perpendicolare, $P_\perp = P \cdot \dfrac{b}{l}$, che è minore del peso.` },
    { id: 'fc-08', sezione: 'piano-inclinato', tipo: 'procedura', fronte: R`Come si capisce se un corpo scivola su un piano inclinato con attrito?`, retro: R`Si confronta $P_\parallel$ con l'attrito statico massimo $\mu_s \cdot P_\perp$. Se $P_\parallel$ è più grande, il corpo scivola.` },
    { id: 'fc-09', sezione: 'momento', tipo: 'formula', fronte: R`Formula del **momento** di una forza`, retro: R`$M = F \cdot b$, in $\text{N} \cdot \text{m}$. $b$ è il braccio.` },
    { id: 'fc-10', sezione: 'momento', tipo: 'definizione', fronte: R`Che cos'è il **braccio** di una forza?`, retro: R`La distanza fra il polo e la retta d'azione della forza. Non è la distanza dal punto in cui si spinge.` },
    { id: 'fc-11', sezione: 'momento', tipo: 'concetto', fronte: R`Quando una forza ha momento zero?`, retro: R`Quando la sua retta d'azione passa per il polo: il braccio è zero.` },
    { id: 'fc-12', sezione: 'momento', tipo: 'concetto', fronte: R`Che segno ha il momento di una forza?`, retro: R`Di solito positivo se la forza fa girare in senso antiorario, negativo se in senso orario.` },
    { id: 'fc-13', sezione: 'corpo-rigido', tipo: 'definizione', fronte: R`Che cos'è una **coppia** di forze?`, retro: R`Due forze uguali e opposte, su rette d'azione diverse. Risultante zero, momento $M = F \cdot b$.` },
    { id: 'fc-14', sezione: 'corpo-rigido', tipo: 'concetto', fronte: R`Le due condizioni di equilibrio del **corpo rigido**`, retro: R`La risultante delle forze è zero, e la somma dei momenti è zero.` },
    { id: 'fc-15', sezione: 'corpo-rigido', tipo: 'procedura', fronte: R`Dove conviene mettere il polo per scrivere i momenti?`, retro: R`Dove agisce una forza che non si conosce: il suo momento è zero e sparisce dal conto.` },
    { id: 'fc-16', sezione: 'leve', tipo: 'formula', fronte: R`La **legge della leva**`, retro: R`$F_P \cdot b_P = F_R \cdot b_R$: il momento della potenza è uguale al momento della resistenza.` },
    { id: 'fc-17', sezione: 'leve', tipo: 'concetto', fronte: R`I tre **generi** di leva`, retro: R`Primo: fulcro in mezzo (altalena). Secondo: resistenza in mezzo (carriola), sempre vantaggiosa. Terzo: potenza in mezzo (pinzette), mai vantaggiosa.` },
    { id: 'fc-18', sezione: 'macchine', tipo: 'formula', fronte: R`Carrucola fissa, carrucola mobile, paranco`, retro: R`Fissa: $F = P$. Mobile: $F = \dfrac{P}{2}$. Paranco con $n$ tratti di fune: $F = \dfrac{P}{n}$.` },
    { id: 'fc-19', sezione: 'macchine', tipo: 'concetto', fronte: R`Qual è il prezzo di una carrucola mobile?`, retro: R`Per alzare il carico di 1 m bisogna tirare 2 m di fune: metà forza, doppia corda.` },
    { id: 'fc-20', sezione: 'macchine', tipo: 'formula', fronte: R`La legge del **verricello**`, retro: R`$F \cdot R = P \cdot r$, con $R$ la manovella e $r$ il raggio del cilindro.` },
    { id: 'fc-21', sezione: 'baricentro', tipo: 'definizione', fronte: R`Che cos'è il **baricentro**?`, retro: R`Il punto in cui si può pensare applicato tutto il peso del corpo.` },
    { id: 'fc-22', sezione: 'baricentro', tipo: 'concetto', fronte: R`Quando un corpo appoggiato si ribalta?`, retro: R`Quando la verticale che scende dal baricentro cade fuori dalla base d'appoggio.` },
    { id: 'fc-23', sezione: 'baricentro', tipo: 'definizione', fronte: R`Equilibrio **stabile**, **instabile**, **indifferente**`, retro: R`Stabile: spostato, il corpo torna indietro. Instabile: si allontana. Indifferente: resta dove lo metti.` },
    { id: 'fc-24', sezione: 'problemi', tipo: 'procedura', fronte: R`I passi di un problema di equilibrio`, retro: R`Scegliere il corpo, disegnare tutte le forze, risultante zero, momenti zero rispetto a un polo comodo, controllo.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un sacchetto di 3 kg è appeso a un gancio con una corda verticale. Quanto vale la tensione della corda? (Usa $g = 9{,}8\,\text{N/kg}$.)`, suggerimenti: [R`Prima calcola il peso: $P = m \cdot g$.`], risposta: { tipo: 'numero', valore: 29.4, unita: 'N' }, soluzione: [R`$P = m \cdot g = 3\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 29{,}4\,\text{N}$.`, R`La corda annulla il peso: $T = 29{,}4\,\text{N}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Su un punto agiscono due forze lungo la stessa retta: 8 N verso destra e 5 N verso sinistra. Che modulo deve avere una terza forza perché il punto sia in equilibrio?`, suggerimenti: [R`Calcola prima la risultante delle due forze.`, R`La terza forza deve essere uguale e opposta alla risultante.`], risposta: { tipo: 'numero', valore: 3, unita: 'N' }, soluzione: [R`La risultante delle due forze è $8\,\text{N} - 5\,\text{N} = 3\,\text{N}$ verso destra.`, R`Serve una terza forza di $3\,\text{N}$ verso sinistra.`] },
    { id: 'b-03', livello: 'base', difficolta: 2, testo: R`Su un punto agiscono due forze perpendicolari, di 6 N e di 8 N. Che modulo deve avere una terza forza perché il punto sia in equilibrio?`, suggerimenti: [R`La risultante di due forze perpendicolari si trova con Pitagora.`], risposta: { tipo: 'numero', valore: 10, unita: 'N' }, soluzione: [R`Risultante delle due forze: $\sqrt{6^2 + 8^2}\,\text{N} = \sqrt{100}\,\text{N} = 10\,\text{N}$.`, R`La terza forza deve annullarla: $10\,\text{N}$, in verso opposto alla risultante.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un pacco da 150 N sta su un piano inclinato senza attrito, lungo 5 m e alto 2 m. Quanto vale la parte del peso parallela al piano?`, suggerimenti: [R`$P_\parallel = P \cdot \dfrac{h}{l}$.`], risposta: { tipo: 'numero', valore: 60, unita: 'N' }, soluzione: [R`$P_\parallel = 150\,\text{N} \cdot \dfrac{2\,\text{m}}{5\,\text{m}} = 60\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un carrello da 800 N sta su una rampa senza attrito, lunga 10 m e alta 1 m. Con che forza, parallela alla rampa, lo tieni fermo?`, suggerimenti: [R`La forza deve equilibrare la parte del peso lungo la rampa.`], risposta: { tipo: 'numero', valore: 80, unita: 'N' }, soluzione: [R`$F = P_\parallel = 800\,\text{N} \cdot \dfrac{1\,\text{m}}{10\,\text{m}} = 80\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un blocco da 117 N sta su un piano inclinato lungo 13 m e alto 5 m. La base è di 12 m. Quanto vale la forza normale del piano?`, suggerimenti: [R`La forza normale è uguale a $P_\perp = P \cdot \dfrac{b}{l}$.`], risposta: { tipo: 'numero', valore: 108, unita: 'N' }, soluzione: [R`$N = P_\perp = 117\,\text{N} \cdot \dfrac{12\,\text{m}}{13\,\text{m}} = 108\,\text{N}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Un blocco da 84 N sta su un piano inclinato di 30°, senza attrito. Quanto vale la parte del peso lungo il piano? (A 30° l'altezza del piano è metà della lunghezza.)`, suggerimenti: [R`Se $h$ è metà di $l$, allora $\dfrac{h}{l} = \dfrac{1}{2}$.`], risposta: { tipo: 'numero', valore: 42, unita: 'N' }, soluzione: [R`$P_\parallel = P \cdot \dfrac{h}{l} = 84\,\text{N} \cdot \dfrac{1}{2} = 42\,\text{N}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Spingi una chiave lunga 20 cm con 45 N, perpendicolari alla chiave. Quanto vale il momento della forza rispetto al bullone?`, suggerimenti: [R`$M = F \cdot b$, con il braccio in metri.`], risposta: { tipo: 'numero', valore: 9, unita: 'N·m' }, soluzione: [R`$b = 20\,\text{cm} = 0{,}2\,\text{m}$.`, R`$M = 45\,\text{N} \cdot 0{,}2\,\text{m} = 9\,\text{N} \cdot \text{m}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Per svitare un tappo serve un momento di $18\,\text{N} \cdot \text{m}$. Con un braccio di 0,4 m, quanta forza serve?`, suggerimenti: [R`Da $M = F \cdot b$ ricava $F$.`], risposta: { tipo: 'numero', valore: 45, unita: 'N' }, soluzione: [R`$F = \dfrac{M}{b} = \dfrac{18\,\text{N} \cdot \text{m}}{0{,}4\,\text{m}} = 45\,\text{N}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una forza di 25 N ha un momento di $10\,\text{N} \cdot \text{m}$ rispetto a un perno. Quanto è lungo il braccio?`, suggerimenti: [R`Da $M = F \cdot b$ ricava $b$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'm' }, soluzione: [R`$b = \dfrac{M}{F} = \dfrac{10\,\text{N} \cdot \text{m}}{25\,\text{N}} = 0{,}4\,\text{m}$, cioè 40 cm.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Due forze di 22 N, uguali e opposte, formano una coppia. Le loro rette d'azione distano 0,5 m. Quanto vale il momento della coppia?`, suggerimenti: [R`Il momento di una coppia è $M = F \cdot b$.`], risposta: { tipo: 'numero', valore: 11, unita: 'N·m' }, soluzione: [R`$M = 22\,\text{N} \cdot 0{,}5\,\text{m} = 11\,\text{N} \cdot \text{m}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Sull'altalena una ragazza da 480 N siede a 1,2 m dal fulcro. Dall'altra parte, a 1,6 m dal fulcro, un bambino la tiene in equilibrio. Quanto pesa il bambino?`, suggerimenti: [R`I due momenti rispetto al fulcro devono essere uguali.`], risposta: { tipo: 'numero', valore: 360, unita: 'N' }, soluzione: [R`$480\,\text{N} \cdot 1{,}2\,\text{m} = P \cdot 1{,}6\,\text{m}$.`, R`$P = \dfrac{576}{1{,}6}\,\text{N} = 360\,\text{N}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Con un paio di forbici tagli un cartone che resiste con 72 N, a 2 cm dal perno. Le dita spingono a 8 cm dal perno. Con che forza spingono?`, suggerimenti: [R`Legge della leva: $F_P \cdot b_P = F_R \cdot b_R$. I centimetri vanno bene, se sono da tutte e due le parti.`], risposta: { tipo: 'numero', valore: 18, unita: 'N' }, soluzione: [R`$F_P \cdot 8\,\text{cm} = 72\,\text{N} \cdot 2\,\text{cm}$.`, R`$F_P = \dfrac{144}{8}\,\text{N} = 18\,\text{N}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`In una carriola il carico pesa 420 N e sta a 0,3 m dall'asse della ruota. I manici sono a 1,4 m dall'asse. Con che forza sollevi i manici?`, suggerimenti: [R`Il fulcro è l'asse della ruota: usa la legge della leva.`], risposta: { tipo: 'numero', valore: 90, unita: 'N' }, soluzione: [R`$F_P \cdot 1{,}4\,\text{m} = 420\,\text{N} \cdot 0{,}3\,\text{m}$.`, R`$F_P = \dfrac{126}{1{,}4}\,\text{N} = 90\,\text{N}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Una cassa da 130 N è appesa a una carrucola mobile ideale. Con che forza tiri la fune per reggerla?`, suggerimenti: [R`La carrucola mobile è retta da due tratti di fune.`], risposta: { tipo: 'numero', valore: 65, unita: 'N' }, soluzione: [R`Due tratti di fune reggono la cassa: $F = \dfrac{P}{2} = \dfrac{130\,\text{N}}{2} = 65\,\text{N}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un paranco ideale regge un carico da 640 N con 8 tratti di fune. Con che forza tiri la fune?`, suggerimenti: [R`$F = \dfrac{P}{n}$.`], risposta: { tipo: 'numero', valore: 80, unita: 'N' }, soluzione: [R`$F = \dfrac{640\,\text{N}}{8} = 80\,\text{N}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un paranco regge un carico con 3 tratti di fune. Per alzare il carico di 0,7 m, quanti metri di fune tiri?`, suggerimenti: [R`Ognuno dei tratti si accorcia di quanto sale il carico.`], risposta: { tipo: 'numero', valore: 2.1, unita: 'm' }, soluzione: [R`Ognuno dei 3 tratti si accorcia di $0{,}7\,\text{m}$: in tutto $3 \cdot 0{,}7\,\text{m} = 2{,}1\,\text{m}$ di fune.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Il verricello di un pozzo ha il cilindro di raggio 8 cm e la manovella lunga 30 cm. Che forza serve sulla manovella per reggere un secchio da 150 N?`, suggerimenti: [R`$F \cdot R = P \cdot r$.`], risposta: { tipo: 'numero', valore: 40, unita: 'N' }, soluzione: [R`$F \cdot 30\,\text{cm} = 150\,\text{N} \cdot 8\,\text{cm}$.`, R`$F = \dfrac{1200}{30}\,\text{N} = 40\,\text{N}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`Un'asse leggera lunga 2 m poggia su due cavalletti agli estremi A e B. Un carico di 180 N sta a 0,5 m da A. Con che forza spinge il cavalletto in A?`, suggerimenti: [R`Scrivi i momenti rispetto a B: così $N_B$ sparisce.`, R`Il carico sta a $1{,}5\,\text{m}$ da B.`], risposta: { tipo: 'numero', valore: 135, unita: 'N' }, soluzione: [R`Momenti rispetto a B: $N_A \cdot 2\,\text{m} = 180\,\text{N} \cdot 1{,}5\,\text{m}$.`, R`$N_A = \dfrac{270}{2}\,\text{N} = 135\,\text{N}$.`, R`Controllo: $N_B = 180 - 135 = 45\,\text{N}$, e con i momenti rispetto ad A $45 \cdot 2 = 180 \cdot 0{,}5 = 90$. Torna.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un'asta leggera lunga 50 cm porta una massa di 4 kg a un estremo e una di 1 kg all'altro. A che distanza dalla massa di 4 kg sta il baricentro?`, suggerimenti: [R`Appoggiata sul baricentro, l'asta sta in equilibrio come una leva.`, R`Se $x$ è la distanza dalla massa di 4 kg, l'altro braccio è $50\,\text{cm} - x$.`], risposta: { tipo: 'numero', valore: 10, unita: 'cm' }, soluzione: [R`Momenti uguali rispetto a $G$: $4 \cdot g \cdot x = 1 \cdot g \cdot (50\,\text{cm} - x)$, e $g$ si semplifica.`, R`$5 \cdot x = 50\,\text{cm}$, quindi $x = 10\,\text{cm}$: più vicino alla massa grande.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un'insegna da 100 N è appesa a metà fra due cavi uguali, ciascuno inclinato di 45° sull'orizzontale. Quanto vale la tensione di ogni cavo?`, suggerimenti: [R`Le componenti orizzontali si annullano; le verticali reggono il peso.`, R`$2 \cdot T \cdot \sin 45^\circ = P$, con $\sin 45^\circ \approx 0{,}707$.`], risposta: { tipo: 'numero', valore: 70.7, unita: 'N' }, soluzione: [R`Dati: $P = 100\,\text{N}$, $\alpha = 45^\circ$. Componenti verticali: $2 \cdot T \cdot \sin 45^\circ = 100\,\text{N}$.`, R`$T = \dfrac{100\,\text{N}}{2 \cdot 0{,}707} \approx 70{,}7\,\text{N}$.`] },
    { id: 'es-02', difficolta: 3, testo: R`Una cassa da 260 N sta su un piano inclinato lungo 13 m e alto 5 m. La base è di 12 m. Il coefficiente di attrito statico è $\mu_s = 0{,}3$. La cassa scivola? Che forza minima, parallela al piano, serve per tenerla ferma?`, suggerimenti: [R`Calcola $P_\parallel$ e $N = P_\perp$.`, R`L'attrito statico regge al massimo $\mu_s \cdot N$: la forza deve fornire il resto.`], risposta: { tipo: 'numero', valore: 28, unita: 'N' }, soluzione: [R`$P_\parallel = 260 \cdot \dfrac{5}{13}\,\text{N} = 100\,\text{N}$; $N = P_\perp = 260 \cdot \dfrac{12}{13}\,\text{N} = 240\,\text{N}$.`, R`Attrito statico massimo: $0{,}3 \cdot 240\,\text{N} = 72\,\text{N}$, meno di 100 N: da sola la cassa scivola.`, R`Forza minima: $100\,\text{N} - 72\,\text{N} = 28\,\text{N}$, su per il piano.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un blocco da 70 N sta su un piano inclinato di 25° sull'orizzontale, senza attrito. Con la calcolatrice, trova la forza parallela al piano che lo tiene fermo.`, suggerimenti: [R`$P_\parallel = P \cdot \sin\alpha$, con $\alpha$ fra il piano e l'orizzontale e la calcolatrice in gradi.`], risposta: { tipo: 'numero', valore: 29.6, unita: 'N' }, soluzione: [R`$F = P_\parallel = 70\,\text{N} \cdot \sin 25^\circ \approx 70 \cdot 0{,}423\,\text{N} \approx 29{,}6\,\text{N}$.`, R`La forza normale invece è $70\,\text{N} \cdot \cos 25^\circ \approx 63\,\text{N}$: gran parte del peso preme sul piano.`] },
    { id: 'es-04', difficolta: 2, testo: R`Una forza di 40 N spinge l'estremità di una chiave lunga 0,5 m. La forza forma un angolo di 60° con la chiave. Quanto vale il momento rispetto al bullone?`, suggerimenti: [R`Fa ruotare solo la componente della forza perpendicolare alla chiave.`, R`Prendi la chiave come asse $x$: la componente perpendicolare è $F \cdot \sin 60^\circ$.`], risposta: { tipo: 'numero', valore: 17.3, unita: 'N·m' }, soluzione: [R`Componente perpendicolare alla chiave: $40\,\text{N} \cdot \sin 60^\circ \approx 40 \cdot 0{,}866\,\text{N} \approx 34{,}6\,\text{N}$.`, R`$M = 34{,}6\,\text{N} \cdot 0{,}5\,\text{m} \approx 17{,}3\,\text{N} \cdot \text{m}$.`, R`Spingendo perpendicolare sarebbe stato $40 \cdot 0{,}5 = 20\,\text{N} \cdot \text{m}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un'asse omogenea lunga 6 m pesa 300 N e poggia su due appoggi agli estremi A e B. Una persona da 700 N sta a 2 m da A. Con che forza spinge l'appoggio in A?`, suggerimenti: [R`Il peso dell'asse sta a metà, a 3 m da A.`, R`Scrivi i momenti rispetto a B, così $N_B$ sparisce: la persona sta a 4 m da B.`], risposta: { tipo: 'numero', valore: 616.7, unita: 'N' }, soluzione: [R`Momenti rispetto a B: $N_A \cdot 6 = 300 \cdot 3 + 700 \cdot 4 = 900 + 2800 = 3700$, in $\text{N} \cdot \text{m}$.`, R`$N_A = \dfrac{3700}{6}\,\text{N} \approx 616{,}7\,\text{N}$.`, R`Controllo: $N_B = 1000 - 616{,}7 \approx 383{,}3\,\text{N}$; rispetto ad A, $383{,}3 \cdot 6 \approx 2300 = 300 \cdot 3 + 700 \cdot 2$. Torna.`] },
    { id: 'es-06', difficolta: 2, testo: R`Un'asta leggera lunga 1 m porta una massa di 2 kg a un estremo e una di 6 kg all'altro. A che distanza dalla massa di 2 kg si trova il baricentro?`, suggerimenti: [R`Appoggiata sul baricentro, l'asta sta in equilibrio: è una leva con il fulcro in $G$.`, R`Chiama $x$ la distanza dalla massa di 2 kg: i bracci sono $x$ e $1 - x$.`], risposta: { tipo: 'numero', valore: 0.75, unita: 'm' }, soluzione: [R`Momenti uguali rispetto a $G$: $2 \cdot g \cdot x = 6 \cdot g \cdot (1 - x)$, e $g$ si semplifica.`, R`$2 \cdot x = 6 - 6 \cdot x \Rightarrow 8 \cdot x = 6 \Rightarrow x = 0{,}75\,\text{m}$.`, R`Il baricentro sta più vicino alla massa grande: a 25 cm da quella di 6 kg.`] },
    { id: 'es-07', difficolta: 3, testo: R`Un'asta omogenea lunga 2 m, da 50 N, è appoggiata su un tavolo e sporge oltre il bordo. Sull'estremità che sporge si posa un gatto da 30 N. Quanto può sporgere al massimo l'asta senza ribaltarsi?`, suggerimenti: [R`Al limite l'asta sta per ruotare attorno al bordo del tavolo, che fa da fulcro.`, R`Se la parte che sporge è lunga $x$, il baricentro dell'asta sta a $1 - x$ dal bordo, sopra il tavolo.`], risposta: { tipo: 'numero', valore: 0.625, unita: 'm' }, soluzione: [R`Momenti rispetto al bordo: il peso dell'asta ha braccio $1 - x$, il gatto ha braccio $x$.`, R`Al limite: $50 \cdot (1 - x) = 30 \cdot x \Rightarrow 50 = 80 \cdot x \Rightarrow x = 0{,}625\,\text{m}$.`, R`L'asta può sporgere al massimo 62,5 cm. Senza il gatto potrebbe sporgere fino a 1 m: metà della sua lunghezza.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un carico da 1200 N è retto da un paranco con 4 tratti di fune. La fune libera si avvolge su un verricello: cilindro di raggio 10 cm, manovella di 50 cm. Che forza serve sulla manovella?`, suggerimenti: [R`Prima il paranco: quanto tira la fune che va al verricello?`, R`Poi il verricello: $F \cdot R = T \cdot r$.`], risposta: { tipo: 'numero', valore: 60, unita: 'N' }, soluzione: [R`Paranco: la fune tira con $T = \dfrac{1200\,\text{N}}{4} = 300\,\text{N}$.`, R`Verricello: $F \cdot 50\,\text{cm} = 300\,\text{N} \cdot 10\,\text{cm}$, quindi $F = 60\,\text{N}$.`, R`In tutto la forza è venti volte più piccola del carico.`] },
    { id: 'es-09', difficolta: 2, testo: R`Una leva di primo genere regge un peso di 720 N, appeso a 0,25 m dal fulcro. Dall'altra parte, a 1,5 m dal fulcro, si spinge verso il basso. Trascura il peso della leva. Con che forza il fulcro spinge sulla leva?`, suggerimenti: [R`Prima trova la potenza con la legge della leva.`, R`Poi risultante zero: il fulcro regge sia il peso sia la potenza, tutte e due verso il basso.`], risposta: { tipo: 'numero', valore: 840, unita: 'N' }, soluzione: [R`Potenza: $F_P \cdot 1{,}5\,\text{m} = 720\,\text{N} \cdot 0{,}25\,\text{m}$, quindi $F_P = \dfrac{180}{1{,}5}\,\text{N} = 120\,\text{N}$.`, R`Risultante zero: il fulcro spinge verso l'alto con $720\,\text{N} + 120\,\text{N} = 840\,\text{N}$.`] },
    { id: 'es-10', difficolta: 2, testo: R`L'avambraccio è orizzontale e il bicipite verticale. Il bicipite tira verso l'alto, a 4 cm dal gomito. In mano c'è un peso di 2 kg, a 32 cm dal gomito. Trascurando il peso dell'avambraccio, con che forza tira il bicipite?`, suggerimenti: [R`Il gomito è il fulcro, il muscolo sta in mezzo: leva di terzo genere.`, R`Il peso in mano è $2\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 19{,}6\,\text{N}$.`], risposta: { tipo: 'numero', valore: 156.8, unita: 'N' }, soluzione: [R`Resistenza: $P = 2\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 19{,}6\,\text{N}$.`, R`$F_P \cdot 4\,\text{cm} = 19{,}6\,\text{N} \cdot 32\,\text{cm}$, quindi $F_P = 19{,}6 \cdot 8\,\text{N} = 156{,}8\,\text{N}$.`, R`Otto volte il peso: è una leva svantaggiosa, ma la mano si muove otto volte più del muscolo.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Quando un punto materiale fermo resta in equilibrio?`, opzioni: [R`Quando non agisce nessuna forza`, R`Quando la risultante delle forze è zero`, R`Quando tutte le forze hanno lo stesso modulo`, R`Quando il suo peso è trascurabile`], corretta: 1, spiegazione: R`Non serve che non ci siano forze: basta che si annullino. Un lampadario ha peso e tensione, eppure è fermo. Forze con lo stesso modulo non bastano, se le direzioni non si compensano.` },
    { id: 'q-02', domanda: R`Un blocco sta fermo su un piano inclinato senza attrito, tenuto da una fune parallela al piano. La forza normale del piano è…`, opzioni: [R`uguale al peso`, R`maggiore del peso`, R`minore del peso`, R`zero`], corretta: 2, spiegazione: R`$N = P_\perp = P \cdot b/l$, e la base è più corta del pendio. La normale è uguale al peso solo con il piano orizzontale, ed è zero solo con il piano verticale.` },
    { id: 'q-03', domanda: R`Se un piano inclinato diventa più ripido, la forza parallela al piano che tiene fermo un blocco…`, opzioni: [R`aumenta`, R`diminuisce`, R`resta uguale`, R`diventa uguale alla forza normale`], corretta: 0, spiegazione: R`$P_\parallel = P \cdot h/l$ cresce con l'altezza del piano. La forza normale invece cala. Le due parti sono uguali solo a 45°, non in ogni caso.` },
    { id: 'q-04', domanda: R`Il braccio di una forza rispetto a un polo è…`, opzioni: [R`la lunghezza della freccia`, R`la distanza fra il polo e il punto in cui si spinge`, R`l'angolo fra la forza e l'asta`, R`la distanza fra il polo e la retta d'azione`], corretta: 3, spiegazione: R`Il braccio è la distanza dalla retta d'azione. Coincide con la distanza dal punto in cui si spinge solo se la forza è perpendicolare. La lunghezza della freccia è il modulo della forza.` },
    { id: 'q-05', domanda: R`In che unità si misura il momento di una forza?`, opzioni: [R`$\text{N}$`, R`$\text{N/m}$`, R`$\text{N} \cdot \text{m}$`, R`$\text{kg} \cdot \text{m/s}$`], corretta: 2, spiegazione: R`Il momento è forza per braccio: newton per metro. Non si dice joule: il joule è l'unità del lavoro, un'altra grandezza.` },
    { id: 'q-06', domanda: R`Spingi una porta con una forza diretta proprio verso i cardini. Che cosa succede?`, opzioni: [R`La porta si apre piano`, R`La porta non ruota`, R`La porta si apre più in fretta`, R`La porta ruota nel verso opposto`], corretta: 1, spiegazione: R`La retta d'azione passa per i cardini: il braccio è zero, e anche il momento. La forza preme sui cardini ma non fa ruotare la porta.` },
    { id: 'q-07', domanda: R`Una coppia di forze applicata a un corpo rigido…`, opzioni: [R`lo sposta senza farlo ruotare`, R`ha risultante zero e non ha alcun effetto`, R`ha momento zero rispetto al centro`, R`ha risultante zero, ma lo fa ruotare`], corretta: 3, spiegazione: R`Due forze uguali e opposte su rette diverse si annullano come vettori, ma non come momenti: $M = F \cdot b$. Il corpo non si sposta, però gira.` },
    { id: 'q-08', domanda: R`Un corpo rigido fermo resta in equilibrio se…`, opzioni: [R`la risultante delle forze è zero e la somma dei momenti è zero`, R`la risultante delle forze è zero`, R`la somma dei momenti è zero`, R`su di lui non agisce nessuna forza`], corretta: 0, spiegazione: R`Servono tutte e due le condizioni. Con la sola risultante zero il corpo può ruotare, come con una coppia. Con i soli momenti zero può spostarsi.` },
    { id: 'q-09', domanda: R`In una leva di secondo genere, che cosa sta in mezzo?`, opzioni: [R`Il fulcro`, R`La resistenza`, R`La potenza`, R`Dipende da come la si usa`], corretta: 1, spiegazione: R`Nel secondo genere la resistenza sta fra il fulcro e la potenza, come nella carriola. Il braccio della potenza è sempre più lungo: la leva è sempre vantaggiosa.` },
    { id: 'q-10', domanda: R`Quale genere di leva è sempre svantaggioso?`, opzioni: [R`Il primo`, R`Il secondo`, R`Il terzo`, R`Nessuno: dipende sempre dai bracci`], corretta: 2, spiegazione: R`Nel terzo genere la potenza sta in mezzo, quindi il suo braccio è più corto di quello della resistenza. Il primo genere dipende dai bracci, il secondo è sempre vantaggioso.` },
    { id: 'q-11', domanda: R`Una carrucola fissa ideale…`, opzioni: [R`dimezza la forza che serve`, R`raddoppia la forza che serve`, R`annulla il peso del carico`, R`non cambia l'intensità della forza, solo il suo verso`], corretta: 3, spiegazione: R`Con la carrucola fissa la mano tira con tutto il peso. Però tira verso il basso invece che verso l'alto, che è più comodo. A dimezzare la forza è la carrucola mobile.` },
    { id: 'q-12', domanda: R`Con un paranco a 4 tratti di fune basta un quarto della forza. Qual è il prezzo?`, opzioni: [R`La fune da tirare è quattro volte lo spostamento del carico`, R`Il carico sale quattro volte più in fretta`, R`Il carico diventa più pesante`, R`Nessuno: è un guadagno senza prezzo`], corretta: 0, spiegazione: R`Ognuno dei 4 tratti si accorcia di quanto sale il carico: la mano tira quattro volte tanta fune. Nessuna macchina regala niente.` },
    { id: 'q-13', domanda: R`Un corpo appoggiato su un piano si ribalta quando…`, opzioni: [R`il baricentro è più alto della base`, R`il corpo è inclinato più di 45°`, R`la verticale dal baricentro cade fuori dalla base`, R`la base è più stretta dell'altezza`], corretta: 2, spiegazione: R`Conta dove cade la verticale da $G$. Una scatola alta e stretta sta in piedi benissimo finché la verticale cade nella base. L'angolo limite cambia con la forma: non è sempre 45°.` },
    { id: 'q-14', domanda: R`Una pallina ferma in cima a una cupola liscia è in equilibrio…`, opzioni: [R`stabile`, R`indifferente`, R`non è in equilibrio`, R`instabile`], corretta: 3, spiegazione: R`Ferma lassù ci sta, quindi è in equilibrio. Ma appena la sposti si allontana sempre di più: instabile. In fondo a una conca sarebbe stabile, su un tavolo indifferente.` },
    { id: 'q-15', domanda: R`Dove si trova il baricentro di un anello omogeneo?`, opzioni: [R`In un punto qualsiasi dell'anello`, R`Nel centro, dove non c'è materia`, R`Nel punto più basso dell'anello`, R`Non ha baricentro`], corretta: 1, spiegazione: R`Per simmetria il baricentro sta nel centro. Il baricentro non deve stare per forza dentro il corpo: nell'anello cade nel buco.` },
    { id: 'q-16', domanda: R`Per scrivere i momenti in un problema di equilibrio, dove conviene mettere il polo?`, opzioni: [R`Dove agisce una forza che non si conosce`, R`Sempre nel baricentro`, R`Sempre a un estremo del corpo`, R`Dove agisce la forza più grande`], corretta: 0, spiegazione: R`Con il corpo in equilibrio il polo si può mettere dove si vuole. Messo su una forza incognita, il suo momento è zero e l'incognita sparisce dal conto.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Sul piano inclinato la forza normale non è il peso: è solo $P_\perp$, la parte perpendicolare al piano.` },
    { tipo: 'errore', testo: R`Il braccio è la distanza dalla retta d'azione, non dal punto in cui spingi. Se la forza è di sbieco, il braccio è più corto.` },
    { tipo: 'errore', testo: R`Per un corpo esteso la risultante zero non basta. Una coppia ha risultante zero, ma lo fa ruotare.` },
    { tipo: 'trucco', testo: R`A 30° il piano inclinato è mezzo triangolo equilatero: l'altezza è metà della lunghezza, e $P_\parallel$ è metà del peso.` },
    { tipo: 'trucco', testo: R`Nella legge della leva i bracci si possono lasciare in centimetri, purché tutti e due nella stessa unità.` },
    { tipo: 'metodo', testo: R`Per i momenti scegli il polo dove agisce una forza che non conosci. Il suo momento è zero, e l'incognita sparisce.` },
    { tipo: 'metodo', testo: R`Prima di ogni conto disegna tutte le forze, ciascuna nel suo punto. Il peso va nel baricentro, le reazioni nei vincoli, le tensioni lungo le funi.` },
    { tipo: 'trucco', testo: R`Se una macchina dimezza la forza, raddoppia la strada da fare. Forza per spostamento resta la stessa: è un buon controllo.` }
  ],
  aneddoti: [
    { fisico: 'Archimede', anni: 'circa 287–212 a.C.', titolo: 'La nave tirata a riva da un uomo', testo: R`Archimede studiò le leve con il rigore di un matematico. Nel libro *Sull'equilibrio dei piani* dimostrò la legge della leva e trovò il baricentro di molte figure. Plutarco, che scriveva circa tre secoli dopo, racconta una storia famosa. Archimede aveva scritto al re Gerone di Siracusa che con una forza piccola si può muovere qualunque peso. Il re volle una prova. Archimede scelse una nave da carico della flotta reale, tirata a terra a fatica da molti uomini. La fece caricare di persone e di merci. Poi, seduto lontano, la tirò verso di sé con un sistema di carrucole, senza sforzo. Anche la frase «Datemi un punto d'appoggio e solleverò il mondo» gliela attribuiscono autori di secoli dopo.`, legame: R`È la legge della leva, $F_P \cdot b_P = F_R \cdot b_R$, insieme al paranco che riduce la forza.` },
    { fisico: 'Erone di Alessandria', anni: 'I secolo d.C.', titolo: 'Le cinque macchine per sollevare i pesi', testo: R`Erone visse ad Alessandria d'Egitto nel primo secolo dopo Cristo. Insegnava matematica e costruiva congegni sorprendenti. Fra questi c'erano automi, porte di templi che si aprivano da sole e una sfera che girava spinta dal vapore. Nella sua *Meccanica* descrisse cinque macchine per muovere grandi pesi con poca forza. Erano l'argano, la leva, il paranco, il cuneo e la vite. Le spiegava tutte con la stessa idea, quella della leva. Descrisse anche il «barulco», un argano con ruote dentate. Con una forza di 5 talenti sollevava un carico di 1000 talenti. Il testo greco della *Meccanica* è andato perduto. Ci è arrivato grazie a una traduzione araba del IX secolo.`, legame: R`Le macchine semplici, come il verricello e il paranco, riducono la forza che serve per reggere un carico.` },
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Le macchine non ingannano la natura', testo: R`A Padova, verso la fine del Cinquecento, Galileo insegnava matematica all'università. Per i suoi studenti scrisse un trattato sulle macchine, *Le mecaniche*. Molti costruttori del tempo speravano di sollevare pesi enormi con forze piccolissime, senza pagare nulla in cambio. Galileo spiegò che è un'illusione: con le macchine non si inganna la natura. Con una leva o una carrucola si può usare una forza piccola. Però la mano deve percorrere una strada più lunga, e ci mette più tempo. Quello che si guadagna in forza si perde in spostamento. Il trattato girò a lungo in copie scritte a mano. Nel 1634 il francese Marin Mersenne lo tradusse e lo pubblicò a Parigi.`, legame: R`È la regola di tutte le macchine semplici: metà forza, doppia corda.` },
    { fisico: 'Evangelista Torricelli', anni: '1608–1647', titolo: 'Il baricentro che non può scendere', testo: R`Evangelista Torricelli fu allievo di Galileo negli ultimi mesi della sua vita, ad Arcetri. Dopo la morte del maestro ne prese il posto di matematico del granduca di Toscana. Oggi lo ricordiamo soprattutto per il barometro a mercurio. Nel 1644, però, nella sua *Opera geometrica*, scrisse anche un principio semplice e potente. Due corpi pesanti legati fra loro non possono muoversi da soli, se il loro baricentro comune non scende. Quindi un sistema è in equilibrio quando il suo baricentro non può abbassarsi. Per questo una pallina resta ferma in fondo a una conca. Una scatola inclinata torna giù finché, per ribaltarsi, dovrebbe ancora alzare il suo baricentro.`, legame: R`Spiega l'equilibrio stabile: un corpo torna indietro se, spostandolo, il suo baricentro si alza.` }
  ]
});
})();
