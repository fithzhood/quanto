/* Quanto — Relazioni fra grandezze (primo anno): proporzionalità diretta, dipendenza lineare, proporzionalità inversa,
   quadratica e inversa del quadrato; come si riconoscono da una tabella. Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/relazioni.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'relazioni',
  titolo: 'Relazioni fra grandezze',
  introduzione: R`Quanto si allunga una molla se raddoppi il peso? Quanto tempo risparmi se vai più veloce? Quanti metri servono per frenare a velocità doppia? Sono tutte domande sulla **relazione** fra due grandezze: come cambia una quando cambia l'altra.

In fisica poche relazioni tornano di continuo. La **proporzionalità diretta**, come la forza e l'allungamento di una molla. La **proporzionalità inversa**, come la velocità e il tempo di un viaggio. La **proporzionalità quadratica**, come il lato e l'area di un quadrato. C'è poi la **dipendenza lineare**, una retta che non parte dall'origine. E c'è l'**inversa del quadrato**, come la luce di una lampadina che cala con la distanza. Ognuna ha la sua formula, il suo grafico e una regola per riconoscerla da una tabella di dati.

Serve saper usare le unità di misura e fare i conti con le frazioni. Queste relazioni torneranno in tutti gli argomenti di fisica: conviene conoscerle bene subito.`,
  inBreve: [
    R`Due grandezze sono **direttamente proporzionali** se il loro rapporto è costante: $y = k \cdot x$. Il grafico è una retta per l'origine: $x$ doppio, $y$ doppio.`,
    R`Una retta che non passa per l'origine è una **dipendenza lineare**, $y = m \cdot x + q$: raddoppiando $x$, $y$ non raddoppia.`,
    R`Due grandezze sono **inversamente proporzionali** se il loro prodotto è costante: $y = \dfrac{k}{x}$. Il grafico è un ramo di iperbole: $x$ doppio, $y$ metà.`,
    R`Nella **proporzionalità quadratica** $y = k \cdot x^2$: $x$ doppio, $y$ quattro volte. Così crescono l'area di un quadrato e lo spazio di frenata.`,
    R`Nell'**inversa del quadrato** $y = \dfrac{k}{x^2}$: $x$ doppio, $y$ un quarto. Così cala la luce allontanandosi dalla sorgente.`,
    R`Per riconoscere una relazione da una tabella si cerca che cosa resta **costante**: il rapporto, il prodotto o il rapporto con il quadrato. Con le misure vere, a meno degli errori.`
  ],
  sezioni: [
    {
      id: 'dipendenza',
      titolo: 'Grandezze che dipendono l\'una dall\'altra',
      testo: R`Più benzina metti, più paghi. Più veloce vai, meno tempo impieghi. In fisica succede di continuo: una grandezza cambia, e un'altra cambia con lei. Studiare una **relazione** vuol dire capire come cambia l'una quando cambia l'altra.

In un esperimento c'è una grandezza che scegli tu e una che misuri. Quella che scegli si chiama **variabile indipendente**, e spesso si indica con $x$. Quella che misuri è la **variabile dipendente**, spesso $y$.

>* Una relazione fra due grandezze si può dare in tre modi: con una **tabella** di valori, con un **grafico** o con una **formula**.

Esempio. Un rubinetto riempie un secchio. Ogni 10 secondi leggiamo quanti litri d'acqua ci sono:

| tempo $t$ (s) | 0 | 10 | 20 | 30 |
|---|---|---|---|---|
| volume $V$ (L) | 0 | 2 | 4 | 6 |

Per fare il grafico, di solito la variabile indipendente va in orizzontale e quella dipendente in verticale. Su ogni asse si scrivono il nome della grandezza e la sua unità. Poi si sceglie una scala comoda e si segna un punto per ogni colonna della tabella.

[[grafico:secchio]]

I punti stanno in fila su una retta. La formula riassume tutta la tabella in una riga: $V = 0{,}2\,\text{L/s} \cdot t$. Con la formula si trova anche un valore che nella tabella non c'è. Dopo 25 secondi, per esempio:

~ V = 0{,}2\,\text{L/s} \cdot t :: ogni secondo entrano 0,2 litri
~ V = 0{,}2\,\text{L/s} \cdot 25\,\text{s} :: metto il tempo con la sua unità: i secondi si semplificano
~ V = \evidb{5\,\text{L}} :: un valore a metà fra 4 L e 6 L, come ci si aspetta

>! Un grafico senza unità sugli assi non dice niente. «6» può voler dire 6 litri, 6 secondi o 6 metri.

?? Una pentola d'acqua è sul fuoco. Ogni minuto si legge la temperatura con un termometro. Qual è la variabile indipendente?
[x] il tempo, che si sceglie in anticipo: un minuto, due minuti…
[ ] la temperatura, che si legge sul termometro
[ ] la quantità d'acqua nella pentola
=> Chi fa l'esperimento decide quando leggere: il tempo è la variabile indipendente. La temperatura dipende dal tempo passato sul fuoco.`
    },
    {
      id: 'diretta',
      titolo: 'La proporzionalità diretta',
      testo: R`Appendi a una molla un peso da 1 newton (N): si allunga di 4 cm. Con 2 N si allunga di 8 cm, con 3 N di 12 cm. Forza doppia, allungamento doppio. Forza tripla, allungamento triplo.

[[video:relazioni/diretta-inversa]]

Se dividi la forza per l'allungamento, viene sempre lo stesso numero:

$$\dfrac{1\,\text{N}}{4\,\text{cm}} = \dfrac{2\,\text{N}}{8\,\text{cm}} = \dfrac{3\,\text{N}}{12\,\text{cm}}$$

Il rapporto vale sempre $0{,}25\,\text{N/cm}$.

>* Due grandezze sono **direttamente proporzionali** se il loro rapporto è costante: $\dfrac{y}{x} = k$, cioè $y = k \cdot x$. Il numero $k$ si chiama **costante di proporzionalità**.

La costante ha la sua unità di misura: qui $k = 0{,}25\,\text{N/cm}$. Vuol dire che ogni centimetro di allungamento richiede 0,25 N. Con la costante si risponde a ogni domanda. Quanto si allunga la molla con 5 N?

~ F = k \cdot x :: la forza è proporzionale all'allungamento
~ x = \dfrac{F}{k} :: divido per $k$ da tutte e due le parti
~ x = \dfrac{5\,\text{N}}{0{,}25\,\text{N/cm}} = \evidb{20\,\text{cm}} :: i newton si semplificano, restano i centimetri

Nel grafico i punti stanno su una **retta che passa per l'origine**: con forza zero l'allungamento è zero. La pendenza della retta è proprio $k$. Una molla più dura ha una $k$ più grande, e la sua retta è più ripida.

[[grafico:molla]]

> Nell'argomento sulle forze questa $k$ si chiama **costante elastica**, e di solito si scrive in N/m: $0{,}25\,\text{N/cm} = \dfrac{0{,}25\,\text{N}}{0{,}01\,\text{m}} = 25\,\text{N/m}$.

>! Non basta che le due grandezze crescano insieme. Ci vuole lo stesso fattore: se $x$ raddoppia, $y$ deve raddoppiare esattamente.

?? Una grandezza passa da 3 a 6. Intanto un'altra passa da 5 a 15. Sono direttamente proporzionali?
[ ] sì, perché crescono tutte e due
[x] no: la prima raddoppia, la seconda triplica
[ ] sì, perché il loro rapporto cresce
=> I rapporti sono $\frac{5}{3} \approx 1{,}7$ e $\frac{15}{6} = 2{,}5$: non sono uguali. Nella proporzionalità diretta il rapporto resta costante.`
    },
    {
      id: 'lineare',
      titolo: 'La dipendenza lineare',
      testo: R`Torniamo a una molla. Scarica è lunga 10 cm, e ogni newton la allunga di 4 cm. Con 1 N è lunga 14 cm, con 2 N è lunga 18 cm. La lunghezza cresce, ma non raddoppia quando raddoppia la forza: 18 cm non è il doppio di 14 cm.

L'**allungamento** è proporzionale alla forza; la **lunghezza** totale no. La lunghezza è l'allungamento più i 10 cm iniziali:

$$L = 10\,\text{cm} + 4\,\text{cm/N} \cdot F$$

>* Due grandezze hanno una **dipendenza lineare** se $y = m \cdot x + q$, con $m$ e $q$ costanti. Il grafico è una retta che taglia l'asse verticale in $q$. Se $q = 0$ è una proporzionalità diretta.

Il numero $m$ è la **pendenza**: dice di quanto cresce $y$ quando $x$ cresce di 1. Il numero $q$ è il valore di $y$ quando $x = 0$. Quanto è lunga la molla con 3 N?

~ L = 10\,\text{cm} + 4\,\text{cm/N} \cdot F :: la legge della lunghezza
~ L = 10\,\text{cm} + 4\,\text{cm/N} \cdot 3\,\text{N} :: metto la forza: i newton si semplificano
~ L = 10\,\text{cm} + 12\,\text{cm} = \evidb{22\,\text{cm}} :: lunghezza da scarica più allungamento

Nel grafico le due rette sono parallele, perché hanno la stessa pendenza. Quella della lunghezza è solo alzata di 10 cm.

[[grafico:lunghezza]]

In una dipendenza lineare il rapporto $\dfrac{y}{x}$ cambia: $\frac{14}{1} = 14$, ma $\frac{18}{2} = 9$. Resta costante un'altra cosa: l'aumento di $y$ per ogni passo uguale di $x$. Ogni newton in più, 4 cm in più.

>! Retta non vuol dire proporzionalità diretta. Se la retta non passa per l'origine, raddoppiando $x$ la $y$ non raddoppia.

?? Un taxi costa 3 euro alla partenza, più 1 euro per ogni chilometro. Il prezzo è direttamente proporzionale ai chilometri?
[x] no: è una dipendenza lineare, con 3 euro fissi
[ ] sì, perché più strada fai e più paghi
[ ] no: è una proporzionalità inversa
=> Per 2 km paghi 5 euro, per 4 km 7 euro: chilometri doppi, prezzo non doppio. Il grafico è una retta che parte da 3 euro, non dall'origine.`
    },
    {
      id: 'inversa',
      titolo: 'La proporzionalità inversa',
      testo: R`Devi fare un viaggio di 120 km. A 60 km/h ci metti 2 ore. A 30 km/h, metà velocità, ci metti 4 ore: il doppio. Più vai veloce, meno tempo ci metti.

Qui il rapporto non resta costante. Resta costante il **prodotto**: velocità per tempo dà sempre la strada da fare.

| $v$ (km/h) | $t$ (h) | $v \cdot t$ (km) |
|---|---|---|
| 20 | 6 | 120 |
| 30 | 4 | 120 |
| 40 | 3 | 120 |
| 60 | 2 | 120 |
| 120 | 1 | 120 |

>* Due grandezze sono **inversamente proporzionali** se il loro prodotto è costante: $x \cdot y = k$, cioè $y = \dfrac{k}{x}$. Se $x$ raddoppia, $y$ si dimezza; se $x$ triplica, $y$ diventa un terzo.

È lo stesso viaggio della seconda metà del video «Retta o iperbole», qui sopra. La costante è $k = 120\,\text{km}$. Quanto ci metti a 80 km/h?

~ v \cdot t = 120\,\text{km} :: il prodotto è la strada, sempre la stessa
~ t = \dfrac{120\,\text{km}}{v} :: divido per la velocità
~ t = \dfrac{120\,\text{km}}{80\,\text{km/h}} = \evidb{1{,}5\,\text{h}} :: i chilometri si semplificano: un'ora e mezza

Il grafico è un ramo di **iperbole**. Andando piano piano, il tempo diventa enorme. Andando velocissimi diventa piccolissimo, ma mai zero. La curva si avvicina agli assi senza toccarli.

[[grafico:viaggio]]

Il rettangolo sotto il punto ha per base $v$ e per altezza $t$. La sua area è quindi $v \cdot t$. Cambiando la velocità il rettangolo cambia forma, ma la sua area resta 120 km.

>! Non basta che una grandezza cali mentre l'altra cresce. Ci vuole lo stesso fattore: velocità doppia, tempo esattamente metà. Una candela accesa si accorcia col tempo, ma la sua altezza non è inversamente proporzionale al tempo.

?? Una vasca si riempie in 6 ore con una pompa. Con due pompe uguali, quanto ci vuole?
[ ] 12 ore
[x] 3 ore
[ ] 4 ore
=> Pompe doppie, tempo metà. Il prodotto pompe per ore resta lo stesso: $1 \cdot 6 = 2 \cdot 3$.`
    },
    {
      id: 'quadratica',
      titolo: 'La proporzionalità quadratica',
      testo: R`Un quadrato di lato 1 cm ha l'area di 1 cm². Se raddoppi il lato, l'area raddoppia? No: in un quadrato di lato 2 cm ci stanno 4 quadretti da 1 cm². Con il lato di 3 cm ce ne stanno 9.

[[video:relazioni/quadratica]]

Il rapporto $\dfrac{A}{l}$ cambia: vale 1, poi 2, poi 3. Quindi non è una proporzionalità diretta. Resta costante invece il rapporto con il **quadrato** del lato:

$$\dfrac{1}{1^2} = \dfrac{4}{2^2} = \dfrac{9}{3^2} = 1$$

>* Una grandezza è **proporzionale al quadrato** di un'altra se $\dfrac{y}{x^2} = k$, cioè $y = k \cdot x^2$. Se $x$ raddoppia, $y$ diventa quattro volte tanto; se $x$ triplica, nove volte.

Il grafico è un arco di **parabola**. Parte dall'origine e sale sempre più ripido. A ogni centimetro di lato in più, l'area cresce di più: prima di 3, poi di 5, poi di 7.

[[grafico:quadrato]]

Anche lo **spazio di frenata** è proporzionale al quadrato della velocità. Un'auto che perde 7,7 m/s ogni secondo, da 50 km/h si ferma in circa 12,5 m. Da 100 km/h ne servono circa 50, quattro volte tanti. E da 150 km/h?

~ \dfrac{150\,\text{km/h}}{100\,\text{km/h}} = 1{,}5 :: la velocità diventa una volta e mezza
~ 1{,}5^2 = 2{,}25 :: lo spazio va con il quadrato: diventa 2,25 volte
~ \Delta s = 2{,}25 \cdot 50\,\text{m} \approx \evidb{113\,\text{m}} :: 112,5 m, circa 113: più del doppio, con solo metà velocità in più

[[grafico:frenata]]

>! Raddoppiare la velocità non raddoppia lo spazio di frenata: lo moltiplica per quattro. È uno dei motivi dei limiti di velocità.

?? Il lato di un quadrato passa da 5 cm a 10 cm. Che cosa succede all'area?
[ ] raddoppia
[ ] aumenta di 5 cm²
[x] diventa quattro volte tanto
=> L'area è proporzionale al quadrato del lato: lato doppio, area $2^2 = 4$ volte. Passa da 25 cm² a 100 cm².`
    },
    {
      id: 'inversa-quadrato',
      titolo: 'L\'inversa del quadrato',
      testo: R`Una lampadina illumina meno una pagina lontana. Ma di quanto meno? La regola vale per una sorgente piccola rispetto alla distanza: una lampadina vista da qualche metro, o il Sole visto dai pianeti. La luce parte in tutte le direzioni e si stende su sfere sempre più grandi. A distanza doppia la sfera ha una superficie quattro volte più grande. La stessa luce si divide su un'area quadrupla, e ogni pezzetto ne riceve un quarto.

>* Una grandezza è **inversamente proporzionale al quadrato** di un'altra se $x^2 \cdot y = k$, cioè $y = \dfrac{k}{x^2}$. Se $x$ raddoppia, $y$ diventa un quarto; se $x$ triplica, un nono.

Il Sole ne è un esempio. Alla distanza della Terra, fuori dall'atmosfera, arrivano circa 1361 watt per ogni metro quadrato, fra luce e calore. È l'**intensità** della radiazione del Sole, in W/m². Marte è 1,52 volte più lontano dal Sole. Quanta luce gli arriva?

~ I_M = \dfrac{I_T}{1{,}52^2} :: distanza 1,52 volte, intensità divisa per il quadrato
~ I_M = \dfrac{1361\,\text{W/m}^2}{2{,}31} :: perché $1{,}52^2 \approx 2{,}31$
~ I_M \approx \evidb{589\,\text{W/m}^2} :: meno della metà della luce che arriva sulla Terra

Nel grafico le distanze sono in **unità astronomiche** (UA). Una unità astronomica è la distanza fra la Terra e il Sole, circa 150 milioni di km.

[[grafico:luce]]

> I luxmetri, e il sensore di luce del telefono, misurano in **lux**: un'unità che tiene conto di come vede l'occhio. Cambia l'unità, non la legge: anche i lux calano con il quadrato della distanza.

La curva scende come un'iperbole, ma più in fretta. Giove sta a 5,2 UA dal Sole. Riceve circa 27 volte meno luce della Terra, non 5,2 volte meno.

Con la stessa legge diminuiscono anche la forza di gravità e la forza fra due cariche elettriche. Le incontrerai negli anni prossimi.

>! Non confonderla con la proporzionalità inversa. Con $y = \dfrac{k}{x}$, a distanza doppia arriva metà; con $y = \dfrac{k}{x^2}$ arriva un quarto.

?? Ti allontani da una lampadina: la distanza passa da 1 m a 3 m. Quanta luce arriva adesso sul tuo libro?
[ ] un terzo di prima
[ ] sei volte meno di prima
[x] un nono di prima
=> Distanza tripla: l'intensità si divide per $3^2 = 9$.`
    },
    {
      id: 'riconoscere',
      titolo: 'Come si riconosce una relazione',
      testo: R`Davanti a una tabella di dati, come si capisce che relazione c'è? Si fanno alcune prove sui numeri, sempre nello stesso ordine.

1. **Rapporto** $\dfrac{y}{x}$ costante: proporzionalità diretta.
2. **Prodotto** $x \cdot y$ costante: proporzionalità inversa.
3. **Rapporto con il quadrato** $\dfrac{y}{x^2}$ costante: proporzionalità quadratica.
4. **Prodotto con il quadrato** $x^2 \cdot y$ costante: inversa del quadrato.
5. Aumenti di $y$ uguali per passi uguali di $x$: dipendenza lineare.

C'è anche una prova veloce: si guarda che cosa succede a $y$ quando $x$ raddoppia.

| relazione | se $x$ raddoppia |
|---|---|
| diretta | $y$ raddoppia |
| lineare | $y$ non raddoppia |
| inversa | $y$ si dimezza |
| quadratica | $y$ diventa 4 volte |
| inversa del quadrato | $y$ diventa un quarto |

Aiuta anche la forma del grafico. La diretta è una retta per l'origine, la lineare una retta fuori dall'origine. L'inversa è un ramo di iperbole, la quadratica un arco di parabola.

>* Per riconoscere una relazione si cerca che cosa resta **costante**: il rapporto, il prodotto, il rapporto con il quadrato o il prodotto con il quadrato.

Le misure vere però hanno sempre un'incertezza. I punti non stanno mai esattamente su una curva. Ecco la massa di un po' d'acqua versata in un cilindro graduato:

| $V$ (cm³) | 50 | 100 | 150 | 200 |
|---|---|---|---|---|
| $m$ (g) | 51 | 99 | 152 | 198 |

I rapporti $\dfrac{m}{V}$ valgono 1,02, poi 0,99, 1,01 e 0,99 g/cm³. Non sono identici, ma sono tutti vicini a 1. Le differenze sono piccole quanto gli errori di misura. Quindi massa e volume sono direttamente proporzionali. La costante è la **densità** dell'acqua, $d \approx 1\,\text{g/cm}^3$.

[[grafico:dati]]

Sul grafico si traccia la retta che passa **in mezzo** ai punti, non quella che li tocca uno per uno.

>! Non unire i punti con una spezzata. I piccoli zig-zag sono errori di misura, non una legge della natura.

?? In una tabella $x$ vale 2, 4, 8 e $y$ vale 40, 20, 10. Che relazione è?
[ ] diretta
[x] inversa
[ ] quadratica
=> I prodotti sono tutti uguali: $2 \cdot 40 = 4 \cdot 20 = 8 \cdot 10 = 80$. Prodotto costante, proporzionalità inversa.`
    }
  ],
  grafici: {
    /* il secchio che si riempie: dalla tabella ai punti, e la retta che li unisce */
    secchio: {
      tipo: 'orario', grandezza: 'V', unita: 'L', t: [0, 40], y: [0, 9],
      funzioni: [{ f: '0.2*t', colore: 3, tratteggio: true, etichetta: 'V = 0,2·t' }],
      punti: [{ x: 0, y: 0, colore: 3 }, { x: 10, y: 2, colore: 3 }, { x: 20, y: 4, colore: 3 }, { x: 30, y: 6, colore: 3 }],
      didascalia: 'I litri nel secchio, letti ogni 10 secondi: un punto per ogni colonna della tabella. Stanno su una retta, V = 0,2·t (t in secondi, V in litri).'
    },
    /* la molla del video: misure fisse, retta F = k·x con k mobile; il triangolo misura la pendenza */
    molla: {
      tipo: 'orario', grandezza: 'F', unita: 'N', etichette: { x: 'x (cm)' }, t: [0, 16], y: [0, 4.5],
      parametri: [{ nome: 'k', min: 0.2, max: 0.35, passo: 0.05, valore: 0.25, etichetta: 'k (N/cm)' }],
      funzioni: [{ f: 'k*x', colore: 2, etichetta: 'F = k·x' }],
      punti: [{ x: 4, y: 1, colore: 2 }, { x: 8, y: 2, colore: 2 }, { x: 12, y: 3, colore: 2 }],
      elementi: [
        { tipo: 'segmento', da: [4, '4*k'], a: [12, '4*k'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [12, '4*k'], a: [12, '12*k'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [8, '4*k - 0.32'], testo: 'Δx = 8 cm' },
        { tipo: 'testo', p: [12.3, '8*k - 0.1'], testo: 'ΔF = {{8*k}} N', ancora: 'start' }
      ],
      didascalia: 'I punti sono le misure della molla del video: 1 N, 2 N, 3 N. Muovi k: solo con k = 0,25 N/cm la retta passa per tutti i punti. La pendenza ΔF/Δx è k.'
    },
    /* lunghezza e allungamento: due rette parallele, una sola passa per l'origine */
    lunghezza: {
      tipo: 'orario', grandezza: 'L', unita: 'cm', etichette: { x: 'F (N)' }, t: [0, 5], y: [0, 34],
      funzioni: [
        { f: '10 + 4*x', colore: 'grigio', etichetta: 'lunghezza' },
        { f: '4*x', colore: 'grigio', tratteggio: true, etichetta: 'allungamento' }
      ],
      punti: [{ x: 0, y: 10, etichetta: '10 cm', posizione: 'basso-destra', colore: 'grigio' }],
      didascalia: 'Linea piena: la lunghezza della molla, L = 10 cm + 4 cm/N · F. Tratteggio: l\'allungamento, 4 cm/N · F. Stessa pendenza, ma solo l\'allungamento parte dall\'origine.'
    },
    /* il viaggio di 120 km: ramo di iperbole, e il rettangolo v·t che ha sempre la stessa area */
    viaggio: {
      tipo: 'orario', grandezza: 't', unita: 'h', etichette: { x: 'v (km/h)' }, t: [0, 130], y: [0, 13],
      parametri: [{ nome: 'v', min: 20, max: 120, passo: 10, valore: 50, etichetta: 'v (km/h)' }],
      funzioni: [{ f: '120/x', colore: 3, dominio: [11, 130] }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], ['v', 0], ['v', '120/v'], [0, '120/v']], colore: 3 },
        { tipo: 'punto', p: ['v', '120/v'], colore: 3 },
        { tipo: 'testo', p: [126, 11.2], testo: 'area = v·t = 120 km', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [126, 9.6], testo: 't = {{120/v}} h', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Il tempo per fare 120 km, al variare della velocità. Muovi v: il rettangolo cambia forma, ma la sua area v·t resta sempre 120 km.'
    },
    /* lato e area del quadrato: la parabola e gli aumenti 3, 5, 7 */
    quadrato: {
      tipo: 'orario', grandezza: 'A', unita: 'cm²', etichette: { x: 'l (cm)' }, t: [0, 4.5], y: [0, 18],
      funzioni: [{ f: 'x^2', colore: 3 }],
      punti: [{ x: 1, y: 1, colore: 3 }, { x: 2, y: 4, colore: 3 }, { x: 3, y: 9, colore: 3 }, { x: 4, y: 16, colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: [1, 1], a: [2, 1], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [2, 1], a: [2, 4], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [2, 4], a: [3, 4], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [3, 4], a: [3, 9], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [3, 9], a: [4, 9], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [4, 9], a: [4, 16], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [2.1, 2.2], testo: '+3', ancora: 'start' },
        { tipo: 'testo', p: [3.1, 6.2], testo: '+5', ancora: 'start' },
        { tipo: 'testo', p: [4.1, 12.2], testo: '+7', ancora: 'start' }
      ],
      didascalia: 'L\'area del quadrato al crescere del lato: A = l². Ogni centimetro di lato in più aggiunge più area del precedente: 3, poi 5, poi 7 cm².'
    },
    /* lo spazio di frenata del video: stessi freni, 7,7 m/s in meno ogni secondo */
    frenata: {
      tipo: 'orario', grandezza: 'Δs', unita: 'm', etichette: { x: 'v (km/h)' }, t: [0, 185], y: [0, 130],
      funzioni: [{ f: '(x/3.6)^2/15.4', colore: 3 }],
      punti: [
        { x: 50, y: 12.5, etichetta: '12,5 m', posizione: 'alto-sinistra', colore: 3 },
        { x: 100, y: 50.1, etichetta: '50 m', posizione: 'alto-sinistra', colore: 3 },
        { x: 150, y: 112.7, etichetta: '113 m', posizione: 'sinistra', colore: 3 }
      ],
      didascalia: 'Lo spazio di frenata con gli stessi freni (7,7 m/s in meno ogni secondo). Velocità 1, 2, 3 volte: spazio 1, 4, 9 volte.'
    },
    /* la luce del Sole sui pianeti: inversa del quadrato della distanza */
    luce: {
      tipo: 'orario', grandezza: 'I', unita: 'W/m²', etichette: { x: 'r (UA)' }, t: [0, 6.5], y: [0, 1800],
      funzioni: [{ f: '1361/x^2', colore: 3, dominio: [0.87, 6.5] }],
      punti: [
        { x: 1, y: 1361, etichetta: 'Terra', posizione: 'destra', colore: 3 },
        { x: 1.52, y: 589, etichetta: 'Marte', posizione: 'alto-destra', colore: 3 },
        { x: 5.2, y: 50.3, etichetta: 'Giove', posizione: 'alto', colore: 3 }
      ],
      didascalia: 'L\'intensità della luce del Sole alla distanza della Terra (1 UA), di Marte (1,52 UA) e di Giove (5,2 UA). Distanza doppia, un quarto della luce.'
    },
    /* misure vere di massa e volume d'acqua: i punti non sono allineati alla perfezione */
    dati: {
      tipo: 'orario', grandezza: 'm', unita: 'g', etichette: { x: 'V (cm³)' }, t: [0, 250], y: [0, 260],
      funzioni: [{ f: 'x', colore: 'grigio', tratteggio: true, etichetta: 'm = 1 g/cm³ · V' }],
      punti: [{ x: 50, y: 51, colore: 3 }, { x: 100, y: 99, colore: 3 }, { x: 150, y: 152, colore: 3 }, { x: 200, y: 198, colore: 3 }],
      didascalia: 'Le quattro misure di massa e volume d\'acqua. La retta tratteggiata passa in mezzo ai punti e per l\'origine: la sua pendenza è la densità, circa 1 g/cm³.'
    }
  },
  esempi: [
    {
      titolo: 'La costante di una molla',
      problema: R`Una molla si allunga di 5 cm quando le si appende un peso di 2 N. Forza e allungamento sono direttamente proporzionali. Quanto vale la costante $k$? Quanto si allunga la molla con 6 N? Che forza serve per allungarla di 10 cm?`,
      passi: [
        R`Dati: $F_1 = 2\,\text{N}$, $x_1 = 5\,\text{cm}$, $F_2 = 6\,\text{N}$, $x_3 = 10\,\text{cm}$. Cerco la costante $k$, l'allungamento $x_2$ e la forza $F_3$.`,
        R`La costante è il rapporto fra forza e allungamento: $k = \dfrac{F_1}{x_1} = \dfrac{2\,\text{N}}{5\,\text{cm}} = 0{,}4\,\text{N/cm}$.`,
        R`Con 6 N ricavo l'allungamento da $F = k \cdot x$: $x_2 = \dfrac{F_2}{k} = \dfrac{6\,\text{N}}{0{,}4\,\text{N/cm}} = 15\,\text{cm}$.`,
        R`Per 10 cm: $F_3 = k \cdot x_3 = 0{,}4\,\text{N/cm} \cdot 10\,\text{cm} = 4\,\text{N}$. I centimetri si semplificano e restano i newton.`,
        R`Controllo con i fattori: da 2 N a 6 N la forza triplica, e l'allungamento passa da 5 cm a 15 cm, anche lui triplo. Torna.`
      ],
      risultato: R`$k = 0{,}4\,\text{N/cm}$; con 6 N si allunga di $15\,\text{cm}$; per 10 cm servono $4\,\text{N}$.`
    },
    {
      titolo: 'La candela che si accorcia',
      problema: R`Una candela è alta 24 cm. Accesa, si accorcia di 2 cm ogni ora. Scrivi la formula dell'altezza in funzione del tempo. Dopo quante ore la candela è alta 10 cm? L'altezza è inversamente proporzionale al tempo?`,
      passi: [
        R`Dati: $h_0 = 24\,\text{cm}$, la candela cala di $2\,\text{cm/h}$, altezza finale $h = 10\,\text{cm}$. Cerco la formula $h(t)$, il tempo $t$ e il tipo di relazione.`,
        R`Ogni ora l'altezza cala sempre degli stessi 2 cm: è una dipendenza lineare, con pendenza negativa. La formula è $h = 24\,\text{cm} - 2\,\text{cm/h} \cdot t$.`,
        R`Quando $h = 10\,\text{cm}$ la candela ha perso $24\,\text{cm} - 10\,\text{cm} = 14\,\text{cm}$. Il tempo è $t = \dfrac{14\,\text{cm}}{2\,\text{cm/h}} = 7\,\text{h}$.`,
        R`È inversa? Dopo 3 h la candela è alta 18 cm, dopo 6 h è alta 12 cm. Il tempo raddoppia, ma l'altezza non si dimezza: 12 non è la metà di 18.`,
        R`Anche il prodotto cambia: $3 \cdot 18 = 54$, ma $6 \cdot 12 = 72$. L'altezza cala, ma in modo lineare: non è una proporzionalità inversa.`
      ],
      risultato: R`$h = 24\,\text{cm} - 2\,\text{cm/h} \cdot t$; la candela è alta 10 cm dopo $7\,\text{h}$; la relazione è lineare, non inversa.`
    },
    {
      titolo: 'Le pompe della piscina',
      problema: R`Quattro pompe uguali svuotano una piscina in 15 ore. Quanto tempo ci mettono sei pompe? Quante pompe servono per svuotarla in 5 ore?`,
      passi: [
        R`Dati: $n_1 = 4$ pompe, $t_1 = 15\,\text{h}$, $n_2 = 6$ pompe, $t_3 = 5\,\text{h}$. Cerco il tempo $t_2$ e il numero di pompe $n_3$.`,
        R`Più pompe, meno tempo, con lo stesso fattore: pompe e tempo sono inversamente proporzionali. Il prodotto è costante: $k = n_1 \cdot t_1 = 4 \cdot 15\,\text{h} = 60\,\text{h}$.`,
        R`Con sei pompe: $t_2 = \dfrac{k}{n_2} = \dfrac{60\,\text{h}}{6} = 10\,\text{h}$.`,
        R`Per 5 ore: $n_3 = \dfrac{k}{t_3} = \dfrac{60\,\text{h}}{5\,\text{h}} = 12$ pompe. Le ore si semplificano: il numero di pompe è un numero puro.`,
        R`Controllo con i fattori: da 4 a 12 pompe è il triplo, e il tempo passa da 15 h a 5 h, un terzo. Torna.`
      ],
      risultato: R`Sei pompe impiegano $10\,\text{h}$; per svuotarla in 5 ore servono 12 pompe.`
    },
    {
      titolo: 'Frenare a 90 all\'ora',
      problema: R`Con certi freni, un'auto a 60 km/h si ferma in 20 m. Con gli stessi freni, quanti metri le servono per fermarsi a 90 km/h?`,
      passi: [
        R`Dati: $v_1 = 60\,\text{km/h}$, $\Delta s_1 = 20\,\text{m}$, $v_2 = 90\,\text{km/h}$. Cerco lo spazio di frenata $\Delta s_2$.`,
        R`Con gli stessi freni lo spazio di frenata è proporzionale al quadrato della velocità: $\Delta s = k \cdot v^2$.`,
        R`Il fattore della velocità è $\dfrac{v_2}{v_1} = \dfrac{90\,\text{km/h}}{60\,\text{km/h}} = 1{,}5$. Le unità si semplificano: il rapporto fra due velocità è un numero puro, e non serve passare ai m/s.`,
        R`Lo spazio cresce con il quadrato del fattore: $1{,}5^2 = 2{,}25$. Quindi $\Delta s_2 = 2{,}25 \cdot 20\,\text{m} = 45\,\text{m}$.`,
        R`Controllo con la costante, in metri e km/h: $\dfrac{20}{60^2} = \dfrac{20}{3600} \approx 0{,}0056$ e $\dfrac{45}{90^2} = \dfrac{45}{8100} \approx 0{,}0056$. Torna.`
      ],
      risultato: R`Servono $45\,\text{m}$: velocità una volta e mezza, spazio 2,25 volte.`
    },
    {
      titolo: 'Il pendolo: che relazione è?',
      problema: R`Si misurano la lunghezza $L$ e il periodo $T$ (il tempo di un'oscillazione completa) di tre pendoli:

| $L$ (cm) | 25 | 100 | 225 |
|---|---|---|---|
| $T$ (s) | 1,0 | 2,0 | 3,0 |

Che relazione lega $L$ e $T$? Quanto deve essere lungo un pendolo per avere un periodo di 4,0 s?`,
      passi: [
        R`Dati: le tre coppie della tabella e il nuovo periodo $T_4 = 4{,}0\,\text{s}$. Cerco la relazione fra $L$ e $T$ e la lunghezza $L_4$.`,
        R`Prova del rapporto: $\frac{25}{1} = 25$, ma $\frac{100}{2} = 50$. Cambia: non è una proporzionalità diretta.`,
        R`Prova del prodotto: $25 \cdot 1 = 25$, ma $100 \cdot 2 = 200$. Cambia: non è una proporzionalità inversa.`,
        R`Prova del quadrato: $\frac{25}{1^2} = \frac{100}{2^2} = \frac{225}{3^2} = 25$. È costante: la lunghezza è proporzionale al quadrato del periodo, $L = k \cdot T^2$ con $k = 25\,\text{cm/s}^2$.`,
        R`Con 4,0 s: $L_4 = 25\,\text{cm/s}^2 \cdot (4{,}0\,\text{s})^2 = 25 \cdot 16\,\text{cm} = 400\,\text{cm} = 4\,\text{m}$.`,
        R`Controllo con i fattori: da 2 s a 4 s il periodo raddoppia, e la lunghezza passa da 100 cm a 400 cm, quattro volte. Torna.`
      ],
      risultato: R`$L$ è proporzionale a $T^2$, con $k = 25\,\text{cm/s}^2$; per un periodo di 4,0 s serve un pendolo lungo $4\,\text{m}$.`
    },
    {
      titolo: 'Il sensore di luce',
      problema: R`Un sensore a 2 m da una lampadina misura un'intensità di 0,8 W/m². L'intensità è inversamente proporzionale al quadrato della distanza. Quanto misura il sensore a 4 m? A che distanza misura 3,2 W/m²?`,
      passi: [
        R`Dati: $r_1 = 2\,\text{m}$, $I_1 = 0{,}8\,\text{W/m}^2$, $r_2 = 4\,\text{m}$, $I_3 = 3{,}2\,\text{W/m}^2$. Cerco l'intensità $I_2$ e la distanza $r_3$.`,
        R`Da 2 m a 4 m la distanza raddoppia: l'intensità si divide per $2^2 = 4$. Quindi $I_2 = \dfrac{0{,}8}{4}\,\text{W/m}^2 = 0{,}2\,\text{W/m}^2$.`,
        R`L'intensità $3{,}2\,\text{W/m}^2$ è 4 volte $0{,}8\,\text{W/m}^2$: il sensore deve avvicinarsi. Il quadrato del fattore della distanza deve fare 4, quindi il fattore è 2.`,
        R`La distanza si dimezza: $r_3 = \dfrac{2\,\text{m}}{2} = 1\,\text{m}$.`,
        R`Controllo con la costante: $r^2 \cdot I$ deve restare uguale. $2^2 \cdot 0{,}8 = 3{,}2$, poi $4^2 \cdot 0{,}2 = 3{,}2$ e $1^2 \cdot 3{,}2 = 3{,}2$. Torna.`
      ],
      risultato: R`A 4 m il sensore misura $0{,}2\,\text{W/m}^2$; misura $3{,}2\,\text{W/m}^2$ a $1\,\text{m}$ dalla lampadina.`
    }
  ],
  formulario: [
    { nome: 'Proporzionalità diretta', formula: R`y = k \cdot x \qquad \dfrac{y}{x} = k`, nota: R`Rapporto costante. Grafico: retta per l'origine, con pendenza $k$. Se $x$ raddoppia, $y$ raddoppia.` },
    { nome: 'Molla: forza e allungamento', formula: R`F = k \cdot x`, nota: R`$x$ è l'allungamento, non la lunghezza della molla. L'unità di $k$ è quella della forza divisa quella dell'allungamento: nel video $k = 0{,}25\,\text{N/cm}$.` },
    { nome: 'Dipendenza lineare', formula: R`y = m \cdot x + q`, nota: R`Retta che taglia l'asse verticale in $q$. Se $q = 0$ è una proporzionalità diretta; se no, raddoppiando $x$ la $y$ non raddoppia.` },
    { nome: 'Pendenza di una retta', formula: R`m = \dfrac{\Delta y}{\Delta x}`, nota: R`Di quanto cresce $y$ quando $x$ cresce di 1. Nella proporzionalità diretta la pendenza è $k$.` },
    { nome: 'Proporzionalità inversa', formula: R`y = \dfrac{k}{x} \qquad x \cdot y = k`, nota: R`Prodotto costante. Grafico: ramo di iperbole, che si avvicina agli assi senza toccarli. Se $x$ raddoppia, $y$ si dimezza.` },
    { nome: 'Velocità e tempo di un viaggio', formula: R`v \cdot t = \Delta s \qquad t = \dfrac{\Delta s}{v}`, nota: R`A percorso fissato, velocità e tempo sono inversamente proporzionali. La costante è lo spazio percorso $\Delta s$.` },
    { nome: 'Proporzionalità quadratica', formula: R`y = k \cdot x^2 \qquad \dfrac{y}{x^2} = k`, nota: R`Grafico: arco di parabola che parte dall'origine. Se $x$ raddoppia, $y$ diventa 4 volte; se triplica, 9 volte.` },
    { nome: 'Area del quadrato', formula: R`A = l^2`, nota: R`Una proporzionalità quadratica con $k = 1$: lato doppio, area quattro volte.` },
    { nome: 'Fattore nella quadratica', formula: R`\dfrac{y_2}{y_1} = \left(\dfrac{x_2}{x_1}\right)^2`, nota: R`Per lo spazio di frenata: velocità 1,5 volte, spazio $1{,}5^2 = 2{,}25$ volte. Non serve conoscere $k$.` },
    { nome: 'Inversa del quadrato', formula: R`y = \dfrac{k}{x^2} \qquad x^2 \cdot y = k`, nota: R`Se $x$ raddoppia, $y$ diventa un quarto; se triplica, un nono. Così cala la luce allontanandosi dalla sorgente.` },
    { nome: 'Massa e volume', formula: R`m = d \cdot V`, nota: R`Per una sostanza, massa e volume sono direttamente proporzionali. La costante è la densità $d$: per l'acqua circa $1\,\text{g/cm}^3$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'dipendenza', tipo: 'definizione', fronte: R`Che cosa sono la variabile **indipendente** e la variabile **dipendente**?`, retro: R`L'indipendente è quella che si sceglie, di solito in orizzontale. La dipendente è quella che si misura e cambia con l'altra, di solito in verticale.` },
    { id: 'fc-02', sezione: 'dipendenza', tipo: 'concetto', fronte: R`In quali tre modi si può dare una relazione fra due grandezze?`, retro: R`Con una tabella di valori, con un grafico (con le unità sugli assi) o con una formula.` },
    { id: 'fc-03', sezione: 'diretta', tipo: 'definizione', fronte: R`Quando due grandezze sono **direttamente proporzionali**?`, retro: R`Quando il loro rapporto è costante: $\dfrac{y}{x} = k$, cioè $y = k \cdot x$.` },
    { id: 'fc-04', sezione: 'diretta', tipo: 'concetto', fronte: R`Che grafico ha una proporzionalità diretta?`, retro: R`Una retta che passa per l'origine. La sua pendenza è la costante $k$.` },
    { id: 'fc-05', sezione: 'diretta', tipo: 'concetto', fronte: R`Proporzionalità diretta: se $x$ triplica, che cosa fa $y$?`, retro: R`Triplica anche lei: $y$ cambia sempre dello stesso fattore di $x$.` },
    { id: 'fc-06', sezione: 'diretta', tipo: 'procedura', fronte: R`Come si trova la costante $k$ di una proporzionalità diretta, e che unità ha?`, retro: R`Si divide $y$ per $x$ in una coppia di valori. L'unità è quella di $y$ divisa quella di $x$: $\frac{1\,\text{N}}{4\,\text{cm}} = 0{,}25\,\text{N/cm}$.` },
    { id: 'fc-07', sezione: 'lineare', tipo: 'formula', fronte: R`La formula della **dipendenza lineare**, e che cosa sono $m$ e $q$`, retro: R`$y = m \cdot x + q$. $m$ è la pendenza, $q$ è il valore di $y$ quando $x = 0$.` },
    { id: 'fc-08', sezione: 'lineare', tipo: 'concetto', fronte: R`Un grafico è una retta. Le due grandezze sono sempre direttamente proporzionali?`, retro: R`No: solo se la retta passa per l'origine. Altrimenti è una dipendenza lineare, e raddoppiando $x$ la $y$ non raddoppia.` },
    { id: 'fc-09', sezione: 'lineare', tipo: 'concetto', fronte: R`Nella dipendenza lineare il rapporto $\frac{y}{x}$ cambia. Che cosa resta costante?`, retro: R`L'aumento di $y$ per ogni passo uguale di $x$: la pendenza $m = \dfrac{\Delta y}{\Delta x}$.` },
    { id: 'fc-10', sezione: 'inversa', tipo: 'definizione', fronte: R`Quando due grandezze sono **inversamente proporzionali**?`, retro: R`Quando il loro prodotto è costante: $x \cdot y = k$, cioè $y = \dfrac{k}{x}$.` },
    { id: 'fc-11', sezione: 'inversa', tipo: 'concetto', fronte: R`Che grafico ha una proporzionalità inversa?`, retro: R`Un ramo di iperbole. Si avvicina sempre di più ai due assi, ma non li tocca mai.` },
    { id: 'fc-12', sezione: 'inversa', tipo: 'concetto', fronte: R`Per fare 120 km, che cosa succede al tempo se la velocità raddoppia?`, retro: R`Si dimezza: velocità e tempo sono inversamente proporzionali, e $v \cdot t = 120\,\text{km}$ resta costante.` },
    { id: 'fc-13', sezione: 'quadratica', tipo: 'definizione', fronte: R`Quando una grandezza è **proporzionale al quadrato** di un'altra?`, retro: R`Quando $\dfrac{y}{x^2}$ è costante, cioè $y = k \cdot x^2$.` },
    { id: 'fc-14', sezione: 'quadratica', tipo: 'concetto', fronte: R`Proporzionalità quadratica: se $x$ raddoppia, e se triplica?`, retro: R`Con $x$ doppio, $y$ diventa 4 volte tanto. Con $x$ triplo, 9 volte tanto.` },
    { id: 'fc-15', sezione: 'quadratica', tipo: 'concetto', fronte: R`Che grafico ha una proporzionalità quadratica?`, retro: R`Un arco di parabola che parte dall'origine e sale sempre più ripido.` },
    { id: 'fc-16', sezione: 'quadratica', tipo: 'concetto', fronte: R`Con gli stessi freni, come cambia lo spazio di frenata se la velocità raddoppia?`, retro: R`Diventa quattro volte tanto: è proporzionale al quadrato della velocità.` },
    { id: 'fc-17', sezione: 'inversa-quadrato', tipo: 'definizione', fronte: R`Che cos'è la proporzionalità **inversa del quadrato**?`, retro: R`$y = \dfrac{k}{x^2}$, cioè $x^2 \cdot y$ costante. Se $x$ raddoppia, $y$ diventa un quarto.` },
    { id: 'fc-18', sezione: 'inversa-quadrato', tipo: 'concetto', fronte: R`Perché la luce di una lampadina cala con il quadrato della distanza?`, retro: R`Si stende su sfere sempre più grandi. A distanza doppia la superficie è quattro volte più grande, e ogni pezzetto riceve un quarto della luce.` },
    { id: 'fc-19', sezione: 'riconoscere', tipo: 'procedura', fronte: R`Come si riconosce una relazione da una tabella?`, retro: R`Si prova che cosa resta costante: rapporto $\frac{y}{x}$ (diretta), prodotto $x \cdot y$ (inversa), rapporto $\frac{y}{x^2}$ (quadratica), prodotto $x^2 \cdot y$ (inversa del quadrato).` },
    { id: 'fc-20', sezione: 'riconoscere', tipo: 'concetto', fronte: R`Se $x$ raddoppia: che cosa fa $y$ nelle relazioni diretta, inversa, quadratica, inversa del quadrato?`, retro: R`Raddoppia; si dimezza; diventa 4 volte; diventa un quarto.` },
    { id: 'fc-21', sezione: 'riconoscere', tipo: 'procedura', fronte: R`I punti misurati non stanno esattamente su una retta. Come si traccia il grafico?`, retro: R`Si traccia la retta che passa in mezzo ai punti. Non si uniscono i punti con una spezzata: gli zig-zag sono errori di misura.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Con un peso di 3 N una molla si allunga di 2 cm. Forza e allungamento sono direttamente proporzionali. Di quanto si allunga con 21 N?`, suggerimenti: [R`La forza diventa 7 volte tanto: anche l'allungamento.`], risposta: { tipo: 'numero', valore: 14, unita: 'cm' }, soluzione: [R`$\dfrac{21\,\text{N}}{3\,\text{N}} = 7$: la forza è 7 volte tanto.`, R`L'allungamento è 7 volte tanto: $7 \cdot 2\,\text{cm} = 14\,\text{cm}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una molla si allunga di 3 cm con una forza di 6 N. Quanto vale la sua costante $k = \dfrac{F}{x}$?`, suggerimenti: [R`Dividi la forza per l'allungamento, con le unità.`], risposta: { tipo: 'numero', valore: 2, unita: 'N/cm' }, soluzione: [R`$k = \dfrac{F}{x} = \dfrac{6\,\text{N}}{3\,\text{cm}} = 2\,\text{N/cm}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un'auto a velocità costante percorre 150 km in 2 ore. Quanti chilometri percorre in 5 ore, alla stessa velocità?`, suggerimenti: [R`A velocità costante lo spazio è direttamente proporzionale al tempo.`, R`Quanti chilometri fa in un'ora?`], risposta: { tipo: 'numero', valore: 375, unita: 'km' }, soluzione: [R`In un'ora fa $\dfrac{150\,\text{km}}{2} = 75\,\text{km}$.`, R`In 5 ore: $5 \cdot 75\,\text{km} = 375\,\text{km}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Due grandezze sono legate da $y = k \cdot x$ con $k = 7$. Quanto vale $y$ quando $x = 6$?`, suggerimenti: [R`Sostituisci i valori nella formula.`], risposta: { tipo: 'numero', valore: 42 }, soluzione: [R`$y = 7 \cdot 6 = 42$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`A 75 km/h un viaggio dura 4 ore. Quanto dura lo stesso viaggio a 100 km/h?`, suggerimenti: [R`A strada fissata, velocità e tempo sono inversamente proporzionali: il prodotto $v \cdot t$ resta uguale.`], risposta: { tipo: 'numero', valore: 3, unita: 'h' }, soluzione: [R`La strada è $v \cdot t = 75\,\text{km/h} \cdot 4\,\text{h} = 300\,\text{km}$.`, R`A 100 km/h: $t = \dfrac{300\,\text{km}}{100\,\text{km/h}} = 3\,\text{h}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Due grandezze sono inversamente proporzionali e $x \cdot y = 36$. Quanto vale $y$ quando $x = 9$?`, suggerimenti: [R`$y = \dfrac{36}{x}$.`], risposta: { tipo: 'numero', valore: 4 }, soluzione: [R`$y = \dfrac{36}{9} = 4$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Due grandezze sono legate da $y = 2 \cdot x^2$. Quanto vale $y$ quando $x = 5$?`, suggerimenti: [R`Prima il quadrato, poi la moltiplicazione.`], risposta: { tipo: 'numero', valore: 50 }, soluzione: [R`$x^2 = 25$, quindi $y = 2 \cdot 25 = 50$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Il lato di un quadrato diventa 6 volte più lungo. Quante volte più grande diventa la sua area?`, suggerimenti: [R`L'area è proporzionale al quadrato del lato.`], risposta: { tipo: 'numero', valore: 36 }, soluzione: [R`Lato 6 volte, area $6^2 = 36$ volte.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Con certi freni, a 30 km/h un'auto si ferma in 5 m. Con gli stessi freni, quanti metri le servono a 90 km/h?`, suggerimenti: [R`Lo spazio di frenata è proporzionale al quadrato della velocità.`, R`La velocità triplica: lo spazio va moltiplicato per $3^2$.`], risposta: { tipo: 'numero', valore: 45, unita: 'm' }, soluzione: [R`$\dfrac{90\,\text{km/h}}{30\,\text{km/h}} = 3$: la velocità triplica.`, R`Lo spazio diventa $3^2 = 9$ volte: $9 \cdot 5\,\text{m} = 45\,\text{m}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un viaggio dura 12 ore. Quanto dura se si va a velocità quadrupla?`, suggerimenti: [R`Velocità e tempo sono inversamente proporzionali: velocità quadrupla, tempo un quarto.`], risposta: { tipo: 'numero', valore: 3, unita: 'h' }, soluzione: [R`$t = \dfrac{12\,\text{h}}{4} = 3\,\text{h}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Una molla scarica è lunga 15 cm. Ogni newton la allunga di 2 cm. Quanto è lunga se le si appende un peso di 4 N?`, suggerimenti: [R`Lunghezza = lunghezza da scarica + allungamento.`], risposta: { tipo: 'numero', valore: 23, unita: 'cm' }, soluzione: [R`Allungamento: $2\,\text{cm/N} \cdot 4\,\text{N} = 8\,\text{cm}$.`, R`Lunghezza: $L = 15\,\text{cm} + 8\,\text{cm} = 23\,\text{cm}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Una candela alta 20 cm si accorcia di 1,5 cm ogni ora. Quanto è alta dopo 6 ore?`, suggerimenti: [R`In 6 ore si accorcia di $6 \cdot 1{,}5\,\text{cm}$.`], risposta: { tipo: 'numero', valore: 11, unita: 'cm' }, soluzione: [R`Accorciamento: $1{,}5\,\text{cm/h} \cdot 6\,\text{h} = 9\,\text{cm}$.`, R`Altezza: $h = 20\,\text{cm} - 9\,\text{cm} = 11\,\text{cm}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`In una tabella, quando $x$ vale 2 e 5, $y$ vale 6 e 15. Le due grandezze sono direttamente proporzionali. Quanto vale $y$ quando $x = 8$?`, suggerimenti: [R`Trova il rapporto $\frac{y}{x}$: è sempre lo stesso.`], risposta: { tipo: 'numero', valore: 24 }, soluzione: [R`$k = \dfrac{6}{2} = \dfrac{15}{5} = 3$.`, R`$y = 3 \cdot 8 = 24$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`In una tabella, quando $x$ vale 3 e 5, $y$ vale 30 e 18. Le due grandezze sono inversamente proporzionali. Quanto vale $y$ quando $x = 15$?`, suggerimenti: [R`Trova il prodotto $x \cdot y$: è sempre lo stesso.`], risposta: { tipo: 'numero', valore: 6 }, soluzione: [R`$k = 3 \cdot 30 = 5 \cdot 18 = 90$.`, R`$y = \dfrac{90}{15} = 6$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`In una tabella, quando $x$ vale 1 e 2, $y$ vale 3 e 12. $y$ è proporzionale al quadrato di $x$. Quanto vale $y$ quando $x = 3$?`, suggerimenti: [R`Trova $k = \dfrac{y}{x^2}$.`], risposta: { tipo: 'numero', valore: 27 }, soluzione: [R`$k = \dfrac{3}{1^2} = \dfrac{12}{2^2} = 3$.`, R`$y = 3 \cdot 3^2 = 3 \cdot 9 = 27$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Ti allontani da una lampadina: la distanza passa da 0,5 m a 5 m. Quante volte meno luce arriva sul foglio che tieni in mano?`, suggerimenti: [R`L'intensità della luce è inversamente proporzionale al quadrato della distanza.`, R`Di quante volte è cresciuta la distanza?`], risposta: { tipo: 'numero', valore: 100 }, soluzione: [R`$\dfrac{5\,\text{m}}{0{,}5\,\text{m}} = 10$: la distanza è 10 volte tanto.`, R`La luce si divide per $10^2 = 100$: arriva 100 volte meno luce.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un treno impiega 2 ore a 90 km/h. Velocità e tempo, per quel percorso, sono inversamente proporzionali. Quanto vale la costante $k = v \cdot t$?`, suggerimenti: [R`Moltiplica velocità e tempo, con le unità: le ore si semplificano.`], risposta: { tipo: 'numero', valore: 180, unita: 'km' }, soluzione: [R`$k = v \cdot t = 90\,\text{km/h} \cdot 2\,\text{h} = 180\,\text{km}$: è la lunghezza del percorso.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un cubetto di ferro da 1 cm³ ha una massa di 7,9 g. Massa e volume sono direttamente proporzionali. Qual è la massa di 10 cm³ di ferro?`, suggerimenti: [R`Volume 10 volte, massa 10 volte.`], risposta: { tipo: 'numero', valore: 79, unita: 'g' }, soluzione: [R`$m = 7{,}9\,\text{g/cm}^3 \cdot 10\,\text{cm}^3 = 79\,\text{g}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Due grandezze sono legate da $y = k \cdot x^2$. Quando $x = 4$, $y$ vale 48. Quanto vale $k$?`, suggerimenti: [R`$k = \dfrac{y}{x^2}$.`], risposta: { tipo: 'numero', valore: 3 }, soluzione: [R`$k = \dfrac{48}{4^2} = \dfrac{48}{16} = 3$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Nel grafico forza–allungamento di una molla la retta passa per l'origine e per il punto $x = 4\,\text{cm}$, $F = 10\,\text{N}$. Quanto vale la costante $k$?`, suggerimenti: [R`La pendenza della retta è $\dfrac{F}{x}$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'N/cm' }, soluzione: [R`$k = \dfrac{10\,\text{N}}{4\,\text{cm}} = 2{,}5\,\text{N/cm}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una molla è lunga 12 cm con un peso di 2 N e 18 cm con un peso di 5 N. Quanto è lunga da scarica?`, suggerimenti: [R`La lunghezza ha una dipendenza lineare dalla forza: $L = L_0 + m \cdot F$.`, R`Da 2 N a 5 N la lunghezza cresce di 6 cm: quanti centimetri per ogni newton?`], risposta: { tipo: 'numero', valore: 8, unita: 'cm' }, soluzione: [R`Pendenza: $m = \dfrac{18\,\text{cm} - 12\,\text{cm}}{5\,\text{N} - 2\,\text{N}} = \dfrac{6\,\text{cm}}{3\,\text{N}} = 2\,\text{cm/N}$.`, R`Con 2 N l'allungamento è $2\,\text{cm/N} \cdot 2\,\text{N} = 4\,\text{cm}$.`, R`Da scarica: $L_0 = 12\,\text{cm} - 4\,\text{cm} = 8\,\text{cm}$. Controllo: $8\,\text{cm} + 2\,\text{cm/N} \cdot 5\,\text{N} = 18\,\text{cm}$. Torna.`] },
    { id: 'es-02', difficolta: 2, testo: R`La lunghezza di un pendolo è proporzionale al quadrato del suo periodo. Un pendolo lungo 56 cm ha un periodo di 1,5 s. Quanto deve diventare lungo per avere un periodo doppio?`, suggerimenti: [R`$L = k \cdot T^2$: periodo doppio, lunghezza moltiplicata per $2^2$.`], risposta: { tipo: 'numero', valore: 224, unita: 'cm' }, soluzione: [R`Periodo doppio: la lunghezza si moltiplica per $2^2 = 4$.`, R`$L = 4 \cdot 56\,\text{cm} = 224\,\text{cm}$, cioè circa 2,2 m.`] },
    { id: 'es-03', difficolta: 2, testo: R`Con certi freni, a 90 km/h un'auto si ferma in 40 m. Con gli stessi freni, quanti metri le servono a 130 km/h?`, suggerimenti: [R`Calcola il fattore della velocità, $\dfrac{130}{90}$.`, R`Lo spazio va moltiplicato per il quadrato del fattore.`], risposta: { tipo: 'numero', valore: 83.5, unita: 'm', tolleranza: 1 }, soluzione: [R`Fattore della velocità: $\dfrac{130\,\text{km/h}}{90\,\text{km/h}} \approx 1{,}444$.`, R`Fattore dello spazio: $1{,}444^2 \approx 2{,}086$.`, R`$\Delta s \approx 2{,}086 \cdot 40\,\text{m} \approx 83{,}5\,\text{m}$: più del doppio, con il 44% di velocità in più.`] },
    { id: 'es-04', difficolta: 2, testo: R`Alla distanza della Terra, a 1 UA dal Sole, la radiazione del Sole, fra luce e calore, ha un'intensità di 1361 W/m². Saturno sta a 9,5 UA dal Sole. Che intensità ha lì?`, suggerimenti: [R`L'intensità è inversamente proporzionale al quadrato della distanza.`, R`Dividi 1361 per $9{,}5^2$.`], risposta: { tipo: 'numero', valore: 15.1, unita: 'W/m²', tolleranza: 0.3 }, soluzione: [R`La distanza è 9,5 volte quella della Terra: l'intensità si divide per $9{,}5^2 = 90{,}25$.`, R`$I = \dfrac{1361\,\text{W/m}^2}{90{,}25} \approx 15{,}1\,\text{W/m}^2$: circa novanta volte meno che sulla Terra.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un rubinetto riempie una vasca in 12 ore. Quanti rubinetti uguali servono per riempirla in un'ora e mezza?`, suggerimenti: [R`Numero di rubinetti e tempo sono inversamente proporzionali.`, R`Il prodotto rubinetti per ore vale $1 \cdot 12\,\text{h} = 12\,\text{h}$.`], risposta: { tipo: 'numero', valore: 8 }, soluzione: [R`$k = 1 \cdot 12\,\text{h} = 12\,\text{h}$.`, R`$n = \dfrac{12\,\text{h}}{1{,}5\,\text{h}} = 8$ rubinetti.`, R`Controllo: con 8 rubinetti il tempo è $\dfrac{12}{8} = 1{,}5\,\text{h}$. Torna.`] },
    { id: 'es-06', difficolta: 3, testo: R`Nei Paesi anglosassoni la temperatura si misura in gradi Fahrenheit: $T_F = 1{,}8 \cdot T_C + 32$, con $T_C$ in gradi Celsius. A 25 °C corrispondono 77 °F. Un turista pensa: «154 °F è il doppio di 77 °F, quindi è il doppio di 25 °C, cioè 50 °C». Quanti gradi Celsius sono davvero 154 °F?`, suggerimenti: [R`Ricava $T_C$ dalla formula: prima togli 32, poi dividi per 1,8.`, R`Il turista ha ragionato come se fosse una proporzionalità diretta. Lo è?`], risposta: { tipo: 'numero', valore: 67.8, unita: '°C' }, soluzione: [R`$T_C = \dfrac{T_F - 32}{1{,}8} = \dfrac{154 - 32}{1{,}8} = \dfrac{122}{1{,}8} \approx 67{,}8$, cioè circa 67,8 °C.`, R`Non è 50 °C: la relazione è lineare, con $q = 32$. Raddoppiare i gradi Fahrenheit non raddoppia i gradi Celsius.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una pallina parte da ferma e rotola giù per un piano inclinato. In 1 s percorre 0,3 m, in 2 s percorre 1,2 m, in 3 s percorre 2,7 m (sempre dalla partenza). Che relazione c'è fra spazio e tempo? Quanti metri avrà percorso dopo 5 s?`, suggerimenti: [R`Prova il rapporto, il prodotto e il rapporto con il quadrato del tempo.`, R`$\frac{0{,}3}{1^2} = \frac{1{,}2}{2^2} = \frac{2{,}7}{3^2}$.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'm' }, soluzione: [R`Rapporto: $\frac{0{,}3}{1} = 0{,}3$ e $\frac{1{,}2}{2} = 0{,}6$, cambia. Rapporto con il quadrato: $\frac{0{,}3}{1} = \frac{1{,}2}{4} = \frac{2{,}7}{9} = 0{,}3$, costante: $k = 0{,}3\,\text{m/s}^2$.`, R`Lo spazio è proporzionale al quadrato del tempo: $s = 0{,}3\,\text{m/s}^2 \cdot t^2$.`, R`Dopo 5 s: $s = 0{,}3\,\text{m/s}^2 \cdot (5\,\text{s})^2 = 0{,}3 \cdot 25\,\text{m} = 7{,}5\,\text{m}$. È la legge che Galileo trovò con il piano inclinato.`] },
    { id: 'es-08', difficolta: 2, testo: R`La densità dell'alluminio è 2,7 g/cm³. Che volume ha un pezzo di alluminio di 540 g?`, suggerimenti: [R`$m = d \cdot V$: massa e volume sono direttamente proporzionali.`, R`Ricava $V = \dfrac{m}{d}$.`], risposta: { tipo: 'numero', valore: 200, unita: 'cm³' }, soluzione: [R`$V = \dfrac{m}{d} = \dfrac{540\,\text{g}}{2{,}7\,\text{g/cm}^3} = 200\,\text{cm}^3$.`] },
    { id: 'es-09', difficolta: 3, testo: R`La forza di gravità della Terra è inversamente proporzionale al quadrato della distanza dal centro della Terra. Sulla superficie un astronauta pesa 720 N. Quanto pesa a una distanza dal centro doppia, cioè a 6370 km di quota?`, suggerimenti: [R`Distanza dal centro doppia: la forza si divide per $2^2$.`], risposta: { tipo: 'numero', valore: 180, unita: 'N' }, soluzione: [R`Sulla superficie la distanza dal centro è il raggio della Terra, circa 6370 km. A 6370 km di quota è il doppio.`, R`Il peso si divide per $2^2 = 4$: $\dfrac{720\,\text{N}}{4} = 180\,\text{N}$. La massa invece resta la stessa.`] },
    { id: 'es-10', difficolta: 2, testo: R`Una pizza tonda ha il diametro di 30 cm, un'altra di 40 cm. L'area di un cerchio è proporzionale al quadrato del diametro. Quante volte più grande è la seconda pizza? (Un numero puro, con due decimali.)`, suggerimenti: [R`Fattore del diametro: $\dfrac{40}{30}$.`, R`L'area va con il quadrato del fattore.`], risposta: { tipo: 'numero', valore: 1.78, tolleranza: 0.02 }, soluzione: [R`Fattore del diametro: $\dfrac{40\,\text{cm}}{30\,\text{cm}} = \dfrac{4}{3}$.`, R`Fattore dell'area: $\left(\dfrac{4}{3}\right)^2 = \dfrac{16}{9} \approx 1{,}78$.`, R`Con un diametro di un terzo più grande, si mangia quasi l'80% di pizza in più.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Due grandezze sono direttamente proporzionali quando…`, opzioni: [R`il loro rapporto è costante`, R`il loro prodotto è costante`, R`crescono tutte e due`, R`la loro differenza è costante`], corretta: 0, spiegazione: R`Proporzionalità diretta vuol dire $\frac{y}{x} = k$. Il prodotto costante è la proporzionalità inversa. Crescere insieme non basta: serve lo stesso fattore. La differenza costante vuol dire $y = x + q$, una dipendenza lineare.` },
    { id: 'q-02', domanda: R`Che forma ha il grafico di una proporzionalità diretta?`, opzioni: [R`Un ramo di iperbole`, R`Un arco di parabola`, R`Una retta che passa per l'origine`, R`Una retta che taglia l'asse verticale sopra lo zero`], corretta: 2, spiegazione: R`Da $y = k \cdot x$: per $x = 0$ anche $y = 0$, e la pendenza è $k$. Una retta fuori dall'origine è una dipendenza lineare; iperbole e parabola sono la proporzionalità inversa e quella quadratica.` },
    { id: 'q-03', domanda: R`La lunghezza di una molla è $L = 10\,\text{cm} + 4\,\text{cm/N} \cdot F$. Lunghezza e forza sono…`, opzioni: [R`direttamente proporzionali`, R`inversamente proporzionali`, R`proporzionali al quadrato`, R`legate da una dipendenza lineare`], corretta: 3, spiegazione: R`È una retta che non passa per l'origine: con 1 N la molla è lunga 14 cm, con 2 N 18 cm, non il doppio. Proporzionale alla forza è l'allungamento, non la lunghezza totale.` },
    { id: 'q-04', domanda: R`Per un percorso fisso, la velocità triplica. Il tempo di viaggio…`, opzioni: [R`triplica`, R`diventa un terzo`, R`diventa un nono`, R`resta uguale`], corretta: 1, spiegazione: R`A strada fissata $v \cdot t$ è costante: velocità e tempo sono inversamente proporzionali. Velocità tripla, tempo un terzo. «Un nono» sarebbe l'inversa del quadrato.` },
    { id: 'q-05', domanda: R`Nel grafico di $y = \dfrac{k}{x}$, che cosa succede quando $x$ diventa molto grande?`, opzioni: [R`La curva taglia l'asse orizzontale`, R`La curva torna a salire`, R`La curva si avvicina all'asse orizzontale senza toccarlo`, R`La curva diventa una retta orizzontale sopra l'asse`], corretta: 2, spiegazione: R`$y = \frac{k}{x}$ diventa sempre più piccolo, ma non vale mai zero: un viaggio a velocità enorme dura pochissimo, ma non zero. Il ramo di iperbole si avvicina all'asse senza toccarlo.` },
    { id: 'q-06', domanda: R`Il lato di un quadrato triplica. La sua area…`, opzioni: [R`triplica`, R`diventa sei volte tanto`, R`diventa ventisette volte tanto`, R`diventa nove volte tanto`], corretta: 3, spiegazione: R`L'area è proporzionale al quadrato del lato: $3^2 = 9$. «Ventisette» sarebbe il volume di un cubo, che va con il cubo del lato.` },
    { id: 'q-07', domanda: R`In una tabella $x$ vale 1, 2, 4 e $y$ vale 12, 6, 3. Che relazione c'è?`, opzioni: [R`Proporzionalità diretta`, R`Proporzionalità inversa`, R`Proporzionalità quadratica`, R`Dipendenza lineare crescente`], corretta: 1, spiegazione: R`I prodotti sono tutti 12: $1 \cdot 12 = 2 \cdot 6 = 4 \cdot 3$. Quando $x$ raddoppia, $y$ si dimezza. Le altre relazioni hanno $y$ che cresce con $x$.` },
    { id: 'q-08', domanda: R`In una tabella $x$ vale 1, 2, 3 e $y$ vale 4, 16, 36. Che relazione c'è?`, opzioni: [R`Proporzionalità quadratica`, R`Proporzionalità diretta`, R`Proporzionalità inversa`, R`Inversa del quadrato`], corretta: 0, spiegazione: R`$\frac{y}{x^2}$ vale sempre 4: $y = 4 \cdot x^2$. Il rapporto $\frac{y}{x}$ invece cambia (4, 8, 12), e $y$ cresce, quindi non è nessuna delle due inverse.` },
    { id: 'q-09', domanda: R`Per una molla $F = k \cdot x$, con la forza in newton e l'allungamento in centimetri. Che unità ha $k$?`, opzioni: [R`$\text{N}$`, R`$\text{cm}$`, R`$\text{N/cm}$`, R`$\text{N} \cdot \text{cm}$`], corretta: 2, spiegazione: R`$k = \frac{F}{x}$: l'unità è quella della forza divisa quella dell'allungamento. $\text{N} \cdot \text{cm}$ verrebbe da un prodotto, non da un rapporto.` },
    { id: 'q-10', domanda: R`Ti allontani da una lampadina fino a una distanza doppia. La luce che arriva sul tuo libro…`, opzioni: [R`si dimezza`, R`diventa un quarto`, R`raddoppia`, R`resta uguale`], corretta: 1, spiegazione: R`La luce si stende su una sfera con superficie quattro volte più grande: l'intensità va come l'inversa del quadrato della distanza. «Si dimezza» sarebbe la proporzionalità inversa semplice.` },
    { id: 'q-11', domanda: R`Con gli stessi freni, un'auto frena da una velocità tripla. Lo spazio di frenata…`, opzioni: [R`resta uguale`, R`triplica`, R`diventa sei volte tanto`, R`diventa nove volte tanto`], corretta: 3, spiegazione: R`Lo spazio di frenata è proporzionale al quadrato della velocità: $3^2 = 9$. Nel video, da 50 km/h circa 12,5 m, da 150 km/h circa 113 m.` },
    { id: 'q-12', domanda: R`In una proporzionalità inversa, che cosa resta costante?`, opzioni: [R`Il rapporto $\frac{y}{x}$`, R`Il prodotto $x \cdot y$`, R`La somma $x + y$`, R`Il rapporto $\frac{y}{x^2}$`], corretta: 1, spiegazione: R`$y = \frac{k}{x}$ vuol dire $x \cdot y = k$. Il rapporto costante è la proporzionalità diretta; $\frac{y}{x^2}$ costante è la quadratica.` },
    { id: 'q-13', domanda: R`I punti misurati di un esperimento sono quasi allineati, ma non del tutto. Come si traccia il grafico?`, opzioni: [R`Con la retta che passa in mezzo ai punti`, R`Unendo i punti uno per uno con una spezzata`, R`Scartando i punti che non stanno sulla retta`, R`Con una curva che passa esattamente per tutti i punti`], corretta: 0, spiegazione: R`Ogni misura ha un'incertezza: i piccoli scarti sono errori di misura. Si traccia la retta che passa in mezzo ai punti. Scartare i punti scomodi, o inseguirli con una spezzata, vuol dire scambiare gli errori per una legge.` },
    { id: 'q-14', domanda: R`Quale di queste coppie di grandezze è direttamente proporzionale?`, opzioni: [R`Il lato e l'area di un quadrato`, R`La velocità e il tempo per fare 120 km`, R`La massa e il volume di un po' d'acqua`, R`L'altezza di una candela accesa e il tempo`], corretta: 2, spiegazione: R`$m = d \cdot V$: il rapporto è la densità, costante. Lato e area sono legati dal quadrato; velocità e tempo sono inversi; l'altezza della candela cala in modo lineare.` },
    { id: 'q-15', domanda: R`Due grandezze sono legate da $y = 3 \cdot x + 2$. Se $x$ raddoppia, $y$…`, opzioni: [R`raddoppia`, R`si dimezza`, R`diventa quattro volte tanto`, R`aumenta, ma non raddoppia`], corretta: 3, spiegazione: R`È una dipendenza lineare con $q = 2$. Con $x = 1$, $y = 5$; con $x = 2$, $y = 8$: non è il doppio. Raddoppierebbe solo se fosse $q = 0$.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Retta non vuol dire proporzionalità diretta: la retta deve passare per l'origine. Se no, è una dipendenza lineare.` },
    { tipo: 'errore', testo: R`«Una cresce e l'altra cala» non basta per dire che sono inversamente proporzionali. Deve restare costante il prodotto.` },
    { tipo: 'errore', testo: R`Nella proporzionalità quadratica, raddoppiando $x$ la $y$ si moltiplica per 4, non per 2. Vale anche per lo spazio di frenata.` },
    { tipo: 'errore', testo: R`Nell'inversa del quadrato, a distanza doppia arriva un quarto, non metà.` },
    { tipo: 'trucco', testo: R`Ragiona con i fattori. Se $x$ triplica: nella diretta $y$ triplica, nell'inversa diventa un terzo, nella quadratica nove volte.` },
    { tipo: 'trucco', testo: R`Per riconoscere una tabella prova quattro conti: il rapporto $\frac{y}{x}$, il prodotto $x \cdot y$, il rapporto $\frac{y}{x^2}$, il prodotto $x^2 \cdot y$. Quello che resta costante ti dice la relazione.` },
    { tipo: 'metodo', testo: R`La costante ha sempre un'unità di misura. Nella diretta è l'unità di $y$ divisa quella di $x$; nell'inversa, l'unità di $y$ per quella di $x$.` },
    { tipo: 'metodo', testo: R`Con le misure vere i rapporti non sono mai identici. Guarda se sono uguali a meno degli errori di misura.` }
  ],
  aneddoti: [
    { fisico: 'Robert Hooke', anni: '1635–1703', titolo: 'La legge della molla nascosta in un anagramma', testo: R`Nel 1676 Robert Hooke pubblicò un libretto sugli strumenti per osservare il Sole. In fondo aggiunse una riga misteriosa: «ceiiinosssttuv». Era un anagramma, un modo dell'epoca per rivendicare una scoperta senza svelarla. Chi l'avesse trovata dopo, avrebbe dovuto riconoscere che Hooke ci era arrivato prima. Nel 1678 diede la soluzione, in latino: *ut tensio, sic vis*. Vuol dire «come l'allungamento, così la forza». Hooke aveva fatto prove con molle a spirale e con lunghi fili di metallo carichi di pesi. Peso doppio, allungamento doppio. Oggi la chiamiamo legge di Hooke. Vale finché la molla non si tira troppo: oltre un certo limite resta deformata per sempre.`, legame: R`È la proporzionalità diretta fra forza e allungamento della molla del video.` },
    { fisico: 'Robert Boyle', anni: '1627–1691', titolo: 'L\'aria schiacciata nel tubo a forma di J', testo: R`Robert Boyle era figlio di un conte irlandese e lavorava a Oxford. Il suo assistente era un giovane di talento, Robert Hooke, che gli costruì una pompa per togliere l'aria. Boyle voleva misurare quanto è «elastica» l'aria. Prese un tubo di vetro a forma di J, chiuso in cima al ramo corto. Versò mercurio dal ramo lungo, e un po' d'aria restò intrappolata nel ramo chiuso. Più mercurio aggiungeva, più l'aria veniva schiacciata. Con una pressione doppia, l'aria occupava metà del volume. Pubblicò le misure nel 1662, e riconobbe che l'idea della regola veniva da Richard Towneley. In Francia Edme Mariotte la trovò da solo nel 1676. Per questo in Italia si chiama spesso legge di Boyle-Mariotte.`, legame: R`A temperatura costante, pressione e volume di un gas sono inversamente proporzionali: il prodotto resta costante.` },
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Perché non esistono i giganti', testo: R`Nel 1638 uscì a Leida l'ultimo libro di Galileo, i *Discorsi e dimostrazioni matematiche intorno a due nuove scienze*. Galileo era agli arresti in casa, ad Arcetri, dopo il processo del 1633. In una pagina si chiede perché in natura non esistano animali enormi con le stesse forme di quelli piccoli. La risposta sta nelle relazioni fra grandezze. Se un animale diventa due volte più grande in ogni direzione, il suo peso cresce otto volte. La sezione delle sue ossa, che deve reggerlo, cresce solo quattro volte. Un gigante con le proporzioni di un uomo si spezzerebbe le ossa. Galileo disegnò un osso normale e un osso tre volte più lungo: per reggere, il secondo deve essere molto più grosso. È anche il motivo per cui l'elefante ha zampe così massicce.`, legame: R`L'area cresce con il quadrato delle dimensioni, il volume con il cubo: due relazioni diverse, e il risultato cambia tutto.` },
    { fisico: 'Giovanni Keplero', anni: '1571–1630', titolo: 'La luce che si stende su sfere', testo: R`Nel 1604 Giovanni Keplero era il matematico dell'imperatore, a Praga. Quell'anno pubblicò un libro di ottica, noto come *Astronomiae pars optica*. Voleva capire la luce e la vista, per misurare meglio il cielo. In quelle pagine fece un ragionamento semplice. La luce di una sorgente si allarga in tutte le direzioni, su sfere sempre più grandi. La quantità di luce resta la stessa, ma si stende su una superficie che cresce come il quadrato del raggio. Quindi, a distanza doppia, ogni pezzetto di superficie riceve un quarto della luce. Keplero fu tra i primi a scrivere una legge dell'inversa del quadrato. Molti anni dopo una legge della stessa forma descriverà la gravità di Newton.`, legame: R`È la legge dell'inversa del quadrato: l'intensità della luce cala con il quadrato della distanza.` }
  ]
});
})();
