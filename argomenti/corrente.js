/* Quanto — La corrente elettrica (corrente, quarto anno): l'intensità di corrente e il verso convenzionale, la
   velocità di deriva, le due leggi di Ohm, i generatori con la resistenza interna, serie e parallelo, le leggi di
   Kirchhoff, la potenza e l'effetto Joule, il circuito RC, la corrente nei liquidi e nei gas.
   Colori come nei video: corrente viola (4), tensione arancio (2), energia, calore e carica che arriva verde (3),
   elettroni azzurri (1), fili e componenti grigi. Tensione V (è la ΔV di potenziale), f.e.m. ℰ, ρ resistività.
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/corrente.js */
(function () {
const R = String.raw;

/* pezzi di circuito per i disegni (piano senza assi): fili, resistori e pile */
function filo(a, b) { return { tipo: 'segmento', da: a, a: b, colore: 'grigio' }; }
/* resistore: rettangolo centrato in c, lungo l, largo w; verticale o orizzontale */
function resistore(c, verticale, l, w) {
  const x = c[0], y = c[1], h = (l || 1.3) / 2, k = (w || 0.5) / 2;
  const p = verticale ? [[x - k, y - h], [x + k, y - h], [x + k, y + h], [x - k, y + h]] : [[x - h, y - k], [x + h, y - k], [x + h, y + k], [x - h, y + k]];
  return { tipo: 'poligono', punti: p, colore: 'grigio' };
}
/* pila su un filo verticale: piastra lunga (+) sopra, corta (−) sotto, centrate in c; i segni dal lato «lato» (+1 / −1) */
function pilaVerticale(c, lato) {
  const x = c[0], y = c[1], k = lato || 1;
  return [
    { tipo: 'testo', p: [x + k * 0.75, y + 0.3], testo: '+' },
    { tipo: 'testo', p: [x + k * 0.75, y - 0.55], testo: '−' },
    { tipo: 'segmento', da: [x - 0.55, y + 0.17], a: [x + 0.55, y + 0.17], colore: 'grigio' },
    { tipo: 'segmento', da: [x - 0.27, y - 0.17], a: [x + 0.27, y - 0.17], colore: 'grigio' },
    { tipo: 'segmento', da: [x - 0.27, y - 0.12], a: [x + 0.27, y - 0.12], colore: 'grigio' }
  ];
}

/* il circuito a due maglie: l1, l2, l3 = lunghezze delle frecce di I₁, I₂, I₃ */
function circuitoKirchhoff(l1, l2, l3) {
  return [
    filo([-4, 3], [4, 3]), filo([-4, -3], [4, -3]),
    filo([-4, 3], [-4, 1.37]), filo([-4, 1.03], [-4, -0.55]), resistore([-4, -1.2], true), filo([-4, -1.85], [-4, -3]),
    filo([4, 3], [4, 1.37]), filo([4, 1.03], [4, -0.55]), resistore([4, -1.2], true), filo([4, -1.85], [4, -3]),
    filo([0, 3], [0, 0.65]), resistore([0, 0], true), filo([0, -0.65], [0, -3])
  ].concat(pilaVerticale([-4, 1.2], 1), pilaVerticale([4, 1.2], -1), [
    { tipo: 'punto', p: [0, 3], colore: 'grigio' },
    { tipo: 'punto', p: [0, -3], colore: 'grigio' },
    { tipo: 'testo', p: [0, 3.4], testo: 'A' },
    { tipo: 'testo', p: [0, -3.55], testo: 'B' },
    { tipo: 'testo', p: [-4.7, 1.25], testo: 'ℰ_1', ancora: 'end' },
    { tipo: 'testo', p: [-4.5, -1.15], testo: 'R_1', ancora: 'end' },
    { tipo: 'testo', p: [4.7, 1.25], testo: 'ℰ_2', ancora: 'start' },
    { tipo: 'testo', p: [4.5, -1.15], testo: 'R_2', ancora: 'start' },
    { tipo: 'testo', p: [0.5, -0.05], testo: 'R_3', ancora: 'start' },
    { tipo: 'vettore', da: [-3.3, 3], a: [-3.3 + l1, 3], etichetta: 'I_1', colore: 4 },
    { tipo: 'vettore', da: [3.3, 3], a: [3.3 - l2, 3], etichetta: 'I_2', posizione: 'destra', colore: 4 },
    { tipo: 'vettore', da: [0, 2.85], a: [0, 2.85 - l3], etichetta: 'I_3', colore: 4 }
  ]);
}

QUANTO.registra({
  id: 'corrente',
  titolo: 'La corrente elettrica',
  introduzione: R`Premi l'interruttore e la lampada si accende. Il telefono si carica, il forno scalda, il treno parte. Dietro tutto questo c'è la **corrente elettrica**: cariche che si muovono in un circuito, spinte da un generatore.

Si parte da che cosa vuol dire «intensità di corrente» e da quanto vanno piano gli elettroni in un filo. Poi le leggi di Ohm legano tensione, corrente e resistenza. Con queste si risolvono i circuiti: pile vere, resistenze in serie e in parallelo, circuiti con più generatori. Si capisce perché la corrente scalda e perché l'energia elettrica viaggia ad alta tensione. E perché un condensatore non si carica in un istante.

Servono la carica elettrica e la differenza di potenziale, viste nei due argomenti prima. Aiuta ricordare la potenza e il chilowattora.`,
  inBreve: [
    R`L'**intensità di corrente** è la carica che passa al secondo: $I = \dfrac{\Delta q}{\Delta t}$, in ampere. La corrente non si consuma: si consuma energia.`,
    R`**Prima legge di Ohm**: nei conduttori ohmici $V = R \cdot I$. **Seconda legge**: un filo ha resistenza $R = \rho \cdot \dfrac{L}{S}$.`,
    R`Un generatore vero ha una resistenza interna: ai suoi poli c'è $V = \mathcal{E} - r \cdot I$, meno della forza elettromotrice quando eroga corrente.`,
    R`**In serie** stessa corrente e $R = R_1 + R_2$; **in parallelo** stessa tensione e $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$.`,
    R`**Kirchhoff**: nei nodi quel che entra esce, lungo una maglia le tensioni sommano a zero. La potenza è $P = V \cdot I$, e in una resistenza diventa calore.`,
    R`Un condensatore si carica attraverso una resistenza con la **costante di tempo** $\tau = R \cdot C$: dopo un tempo $\tau$ è al 63%.`
  ],
  sezioni: [
    {
      id: 'intensita',
      titolo: 'L\'intensità di corrente',
      testo: R`Una lampadina collegata a una pila si accende solo se il giro di fili è chiuso. Il giro chiuso si chiama **circuito**. Basta aprirlo in un punto, con un interruttore, e la lampadina si spegne.

Nei metalli ci sono **elettroni liberi**, che si spostano da un atomo all'altro. La pila li spinge lungo il circuito: questo moto ordinato di cariche è la **corrente elettrica**. Per misurarla si conta quanta carica passa da una sezione del filo in un certo tempo.

[[video:corrente/corrente]]

>* L'**intensità di corrente** è la carica che attraversa una sezione del conduttore divisa per il tempo: $I = \dfrac{\Delta q}{\Delta t}$. Si misura in **ampere** (A): $1\,\text{A} = 1\,\text{C/s}$.

Esempio. Da un filo passano 1200 C in 10 minuti. Quanto vale la corrente?

~ I = \dfrac{\Delta q}{\Delta t} :: carica divisa tempo
~ I = \dfrac{1200\,\text{C}}{600\,\text{s}} :: dieci minuti sono 600 secondi
~ I = \evidb{2\,\text{A}} :: due coulomb ogni secondo

Le correnti piccole si danno in milliampere: $1\,\text{mA} = 10^{-3}\,\text{A}$.

Se la corrente è costante, la carica passata cresce in modo uniforme con il tempo. Il grafico carica–tempo è una retta, e la sua pendenza è l'intensità di corrente.

[[grafico:carica]]

Per **convenzione** la corrente ha il verso in cui si muoverebbero cariche positive. Esce dal polo positivo del generatore, gira nel circuito e rientra dal negativo. Gli elettroni vanno al contrario. La convenzione è più vecchia della scoperta dell'elettrone, nel 1897.

>! La corrente non si consuma nella lampadina. Ogni secondo ne escono tanti elettroni quanti ne entrano. Si consuma l'**energia** che gli elettroni hanno ricevuto dalla pila: nel filamento diventa luce e calore.

?? Nel filo che porta alla lampadina passano 0,25 A. Quanta corrente passa nel filo che esce dalla lampadina?
[ ] meno di 0,25 A, perché la lampadina ne consuma un po'
[x] 0,25 A
[ ] zero, perché la lampadina la consuma tutta
=> Le cariche non spariscono: in un circuito senza diramazioni la corrente è la stessa in ogni punto. La lampadina trasforma energia, non cariche.`
    },
    {
      id: 'deriva',
      titolo: 'Elettroni lenti, luce subito',
      testo: R`Premi l'interruttore e la luce si accende subito. Viene da pensare che gli elettroni corrano velocissimi lungo il filo. Il conto dice il contrario.

In un filo di rame con sezione di 1 mm² passa 1 A. Ogni secondo devono passare $6{,}25 \cdot 10^{18}$ elettroni, cioè un coulomb. Ma il rame è pieno di elettroni liberi: circa $8{,}5 \cdot 10^{28}$ in ogni metro cubo. Ne basta una fetta sottilissima per fare un coulomb.

[[video:corrente/deriva]]

>* La **velocità di deriva** $v_d$ è la velocità media con cui gli elettroni avanzano lungo il filo. Vale $v_d = \dfrac{I}{n \cdot e \cdot S}$, con $n$ il numero di elettroni liberi per metro cubo e $S$ la sezione.

La formula viene dal conto del video. In un secondo passano gli elettroni di un tratto di filo lungo $v_d$: il loro numero è $n \cdot S \cdot v_d$, e ognuno porta la carica $e$.

~ v_d = \dfrac{I}{n \cdot e \cdot S} :: la formula della velocità di deriva
~ n \cdot e \approx 1{,}36 \cdot 10^{10}\,\text{C/m}^3 :: $8{,}5 \cdot 10^{28}$ elettroni al m³, ognuno con $1{,}60 \cdot 10^{-19}$ C
~ n \cdot e \cdot S \approx 1{,}36 \cdot 10^{4}\,\text{C/m} :: per la sezione: 1 mm² è un milionesimo di m²
~ v_d = \dfrac{1\,\text{A}}{1{,}36 \cdot 10^{4}\,\text{C/m}} :: la corrente divisa per la carica libera in un metro di filo
~ v_d \approx \evidb{7{,}4 \cdot 10^{-5}\,\text{m/s}} :: meno di un decimo di millimetro al secondo

Per fare un metro un elettrone impiega quasi quattro ore. Intanto si agita a caso, a più di mille chilometri al secondo, ma senza andare da nessuna parte.

Allora perché la luce si accende subito? Perché il filo è già pieno di elettroni, anche dentro la lampadina. Quando si chiude il circuito, la spinta del **campo elettrico** corre lungo i fili quasi alla velocità della luce. Tutti gli elettroni del giro si mettono in moto quasi insieme.

> Succede lo stesso con un tubo pieno d'acqua: apri il rubinetto e l'acqua esce subito. Però è quella che era già nel tubo.

>! Gli elettroni che accendono la lampadina non arrivano dall'interruttore. Sono quelli che erano già nel filamento.

?? Nello stesso filo la corrente raddoppia. Che cosa succede alla velocità di deriva?
[x] raddoppia
[ ] resta uguale
[ ] diventa quattro volte tanto
=> Da $v_d = \dfrac{I}{n \cdot e \cdot S}$: con lo stesso filo $n$ ed $S$ non cambiano, quindi $v_d$ è proporzionale a $I$.`
    },
    {
      id: 'ohm',
      titolo: 'Le leggi di Ohm',
      testo: R`La pila tiene fra i suoi poli una **tensione**: è la differenza di potenziale $\Delta V$ fra due punti, vista nell'argomento sul potenziale. Dice quanta energia guadagna o perde ogni coulomb fra quei due punti. Nei circuiti si scrive semplicemente $V$ e si misura in volt: $1\,\text{V} = 1\,\text{J/C}$.

Si collega un filo di metallo a un generatore regolabile. Un **amperometro** misura la corrente, un **voltmetro** la tensione. Si raddoppia la tensione, e la corrente raddoppia.

[[video:corrente/ohm]]

>* **Prima legge di Ohm**: nei conduttori ohmici la corrente è direttamente proporzionale alla tensione, $V = R \cdot I$. La costante $R$ è la **resistenza**, in **ohm** (Ω): $1\,\Omega = 1\,\text{V/A}$.

~ I = \dfrac{V}{R} :: ricavo la corrente dalla prima legge
~ I = \dfrac{4{,}5\,\text{V}}{15\,\Omega} :: una resistenza da 15 Ω su una pila da 4,5 V
~ I = \evidb{0{,}3\,\text{A}} :: volt diviso ohm fa ampere

Il grafico tensione–corrente di un conduttore ohmico è una retta che passa per l'origine. La sua pendenza è la resistenza.

[[grafico:caratteristica]]

>! Non tutti i conduttori sono ohmici. Il filamento di una lampadina si scalda e la sua resistenza cresce: il grafico si piega. Il rapporto $V/I$ si può sempre calcolare, ma non è costante.

Nei metalli la resistività cresce con la temperatura: gli atomi vibrano di più e ostacolano gli elettroni. Per piccole variazioni si scrive $\rho = \rho_0 \cdot (1 + \alpha \cdot \Delta T)$. Qui $\rho_0$ è la resistività a 20 °C e $\Delta T$ la differenza da 20 °C. Per il rame $\alpha \approx 4 \cdot 10^{-3}\,{}^\circ\text{C}^{-1}$.

La resistenza di un filo dipende da come è fatto. Lungo il doppio, ha resistenza doppia. Con sezione doppia, ha resistenza dimezzata. E conta il materiale.

>* **Seconda legge di Ohm**: $R = \rho \cdot \dfrac{L}{S}$, con $L$ la lunghezza, $S$ l'area della sezione e $\rho$ la **resistività** del materiale, in Ω·m.

| materiale | resistività (Ω·m) |
|---|---|
| argento | $1{,}6 \cdot 10^{-8}$ |
| rame | $1{,}7 \cdot 10^{-8}$ |
| alluminio | $2{,}7 \cdot 10^{-8}$ |
| ferro | $1{,}0 \cdot 10^{-7}$ |
| costantana | $5 \cdot 10^{-7}$ |
| vetro | da $10^{10}$ a $10^{14}$ |

>! Le sezioni si danno in mm², ma $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$, non $10^{-3}$: un millimetro quadrato è un quadratino di un millesimo di metro per lato.

?? Un filo viene sostituito con uno dello stesso metallo, lungo il triplo e con sezione tripla. La resistenza…
[ ] triplica
[ ] diventa nove volte tanto
[x] resta uguale
=> $L$ triplo moltiplica per 3, $S$ tripla divide per 3: $R = \rho \cdot L / S$ non cambia.`
    },
    {
      id: 'generatori',
      titolo: 'Generatori e resistenza interna',
      testo: R`Un'idea diffusa: la pila è un serbatoio di cariche che piano piano si svuota. Non è così. Per ogni carica che esce dal polo negativo, nello stesso istante una ne entra dal positivo.

La pila è una **pompa di energia**. Con le reazioni chimiche dà energia a ogni carica che la attraversa. Si scarica quando sono finite le sostanze che reagiscono, non le cariche.

[[video:corrente/pila]]

>* La **forza elettromotrice** $\mathcal{E}$ (f.e.m.) di un generatore è la tensione fra i suoi poli a circuito aperto. È l'energia che il generatore dà a ogni coulomb. Si misura in volt.

Nel video la f.e.m. è scritta per esteso: $V = \text{f.e.m.} - r \cdot I$ è la stessa formula che trovi qui sotto. Nonostante il nome, non è una forza: è una tensione. Quando il generatore eroga corrente, ai suoi poli c'è meno della f.e.m. Dentro la pila c'è una **resistenza interna** $r$, e su di essa si perde la tensione $r \cdot I$.

>* Ai poli di un generatore che eroga la corrente $I$ c'è la tensione $V = \mathcal{E} - r \cdot I$. Con una resistenza esterna $R$ la corrente è $I = \dfrac{\mathcal{E}}{R + r}$.

Esempio. Una pila con $\mathcal{E} = 4{,}5\,\text{V}$ e $r = 0{,}5\,\Omega$ alimenta una resistenza da $4\,\Omega$.

~ I = \dfrac{\mathcal{E}}{R + r} :: la corrente attraversa tutte e due le resistenze
~ I = \dfrac{4{,}5\,\text{V}}{4\,\Omega + 0{,}5\,\Omega} = 1\,\text{A} :: in tutto 4,5 Ω
~ r \cdot I = 0{,}5\,\Omega \cdot 1\,\text{A} = 0{,}5\,\text{V} :: la tensione persa dentro la pila
~ V = 4{,}5\,\text{V} - 0{,}5\,\text{V} = \evidb{4\,\text{V}} :: ai poli resta la f.e.m. meno $r \cdot I$

Più corrente si chiede, più la tensione ai poli cala, in linea retta. La pila «si stanca».

[[grafico:pila]]

Se si uniscono i poli con un filo senza resistenza si ha un **corto circuito**: $V = 0$ e $I = \mathcal{E}/r$. Una batteria d'auto da 12 V con $r = 0{,}02\,\Omega$ darebbe 600 A, e tutta l'energia scalderebbe la batteria e il filo.

?? A circuito aperto il voltmetro sui poli di una pila segna 1,5 V. Collegata una lampadina, segna 1,3 V. Perché?
[x] la pila ha una resistenza interna
[ ] la pila ha perso delle cariche
[ ] la lampadina consuma 0,2 V di corrente
=> Con la corrente, sulla resistenza interna si perde $r \cdot I$: qui 0,2 V. Le cariche non si perdono, e i volt misurano una tensione, non una corrente.`
    },
    {
      id: 'serie-parallelo',
      titolo: 'Resistenze in serie e in parallelo',
      testo: R`Nelle vecchie luci dell'albero di Natale, se una lampadina si bruciava, si spegneva tutta la fila. In casa invece, se si brucia una lampadina, le altre restano accese. Sono due modi diversi di collegare.

[[video:corrente/serie-parallelo]]

Due resistenze sono **in serie** quando stanno una dopo l'altra sullo stesso filo. La carica non ha altre strade: la corrente è la stessa in tutte e due. Le tensioni si sommano.

[[grafico:serie]]

Due resistenze sono **in parallelo** quando stanno su due rami fra gli stessi due **nodi**. Un nodo è un punto in cui il filo si divide. Ogni ramo ha la stessa tensione, e le correnti dei rami si sommano.

[[grafico:parallelo]]

>* **In serie**: $R = R_1 + R_2$. **In parallelo**: $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$. $R$ è la **resistenza equivalente**: quella che, da sola, farebbe passare la stessa corrente.

La formula del parallelo viene dalla legge di Ohm, ramo per ramo:

~ I = I_1 + I_2 :: nel nodo la corrente si divide fra i due rami
~ \dfrac{V}{R} = \dfrac{V}{R_1} + \dfrac{V}{R_2} :: ogni ramo ha la stessa tensione V
~ \evidb{\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}} :: divido tutto per V

Esempio: $6\,\Omega$ e $3\,\Omega$ in parallelo danno $\dfrac{1}{R} = \dfrac{1}{6} + \dfrac{2}{6} = \dfrac{1}{2}$, cioè $R = 2\,\Omega$. In serie darebbero $9\,\Omega$.

>! In parallelo la resistenza equivalente è **minore** della più piccola: ogni ramo in più è una strada in più per la corrente. E attenzione all'ultimo passo: $\dfrac{1}{R}$ va capovolto.

Gli strumenti si collegano in due modi diversi. L'**amperometro** va in serie, perché deve essere attraversato dalla corrente: ha una resistenza piccolissima. Il **voltmetro** va in parallelo, fra i due punti: ha una resistenza grandissima, così non ruba corrente.

?? A una presa multipla ci sono già due lampade accese. Se ne accendi una terza, in parallelo, la corrente che esce dalla presa…
[x] aumenta
[ ] diminuisce
[ ] resta uguale
=> Ogni lampada ha la sua corrente, alla stessa tensione: le correnti dei rami si sommano. Con un ramo in più la resistenza equivalente cala e la corrente totale cresce.`
    },
    {
      id: 'kirchhoff',
      titolo: 'Le leggi di Kirchhoff',
      testo: R`Con due pile in rami diversi, le resistenze non sono né in serie né in parallelo. Per trovare le correnti servono due leggi, che portano il nome di Gustav Kirchhoff.

Prima, tre parole. Un **nodo** è un punto in cui si incontrano tre o più fili. Un **ramo** è un tratto di circuito fra due nodi: in ogni ramo passa una sola corrente. Una **maglia** è un giro chiuso fatto di rami.

[[video:corrente/kirchhoff]]

>* **Legge dei nodi**: la corrente che entra in un nodo è uguale a quella che esce. **Legge delle maglie**: percorrendo una maglia, la somma delle tensioni, ciascuna con il suo segno, è zero.

La prima legge dice che la carica si conserva. La seconda dice che l'energia si conserva: una carica che fa il giro torna allo stesso potenziale. Per i segni, si sceglie un verso per ogni corrente e un verso in cui percorrere la maglia.

- Attraversando un generatore dal polo − al polo + si sale di $\mathcal{E}$.
- Attraversando una resistenza nel verso della corrente si scende di $R \cdot I$.
- Al contrario: da + a − si scende di $\mathcal{E}$, contro il verso della corrente si sale di $R \cdot I$.

[[grafico:kirchhoff]]

Nel circuito del video $\mathcal{E}_1 = 18\,\text{V}$, $\mathcal{E}_2 = 9\,\text{V}$, $R_1 = 6\,\Omega$, $R_2 = 3\,\Omega$, $R_3 = 2\,\Omega$:

~ I_1 + I_2 = I_3 :: legge dei nodi in A
~ 18\,\text{V} = 6\,\Omega \cdot I_1 + 2\,\Omega \cdot I_3 :: maglia di sinistra: la salita su $\mathcal{E}_1$ è uguale alle discese su $R_1$ e $R_3$
~ 9\,\text{V} = 3\,\Omega \cdot I_2 + 2\,\Omega \cdot I_3 :: maglia di destra, con $\mathcal{E}_2$, $R_2$ e $R_3$
~ I_1 = 3\,\text{A} - \tfrac{1}{3} \cdot I_3 :: dalla prima maglia, divido per 6 Ω
~ I_2 = 3\,\text{A} - \tfrac{2}{3} \cdot I_3 :: dalla seconda, divido per 3 Ω
~ 6\,\text{A} - I_3 = I_3 :: le metto nella legge dei nodi
~ \evidb{I_3 = 3\,\text{A}} :: poi $I_1 = 2$ A e $I_2 = 1$ A; nel nodo 2 A + 1 A = 3 A

>! Il verso delle correnti si sceglie all'inizio, anche a caso. Se una corrente viene negativa, il conto non è sbagliato: va nel verso opposto a quello scelto.

?? In un nodo arrivano due fili con 5 A e 2 A. Da un terzo filo escono 4 A. Che cosa fa il quarto filo?
[ ] porta 11 A in uscita
[ ] porta 3 A in entrata
[x] porta 3 A in uscita
=> Entrano 7 A, e ne escono già 4: per la legge dei nodi gli altri 3 A devono uscire dal quarto filo.`
    },
    {
      id: 'joule',
      titolo: 'Potenza ed effetto Joule',
      testo: R`Il ferro da stiro, il fornello elettrico, l'asciugacapelli: in tutti la corrente scalda un filo. Gli elettroni urtano gli atomi del metallo e li fanno vibrare di più. È l'**effetto Joule**.

Quanta energia al secondo? La tensione è energia per coulomb, la corrente è coulomb al secondo. Il prodotto è energia al secondo, cioè una potenza.

>* La **potenza elettrica** è $P = V \cdot I$, in watt. In una resistenza, con $V = R \cdot I$, diventa $P = R \cdot I^2 = \dfrac{V^2}{R}$: tutta questa energia si trasforma in calore.

~ P = V \cdot I :: un asciugacapelli alla presa di casa
~ P = 230\,\text{V} \cdot 8\,\text{A} = \evidb{1840\,\text{W}} :: joule per coulomb per coulomb al secondo
~ E = 1{,}84\,\text{kW} \cdot 0{,}25\,\text{h} :: l'energia è potenza per tempo: acceso un quarto d'ora
~ E = 0{,}46\,\text{kWh} :: è l'energia che si paga in bolletta

L'effetto Joule non scalda solo gli elettrodomestici. Scalda anche i fili che portano la corrente dalla centrale alle città.

[[video:corrente/joule]]

Una centrale manda una certa potenza $P = V \cdot I$. Se la tensione è più alta, la corrente è più bassa. E il calore perso nei fili va con il **quadrato** della corrente: $R \cdot I^2$. Corrente dieci volte minore vuol dire perdite cento volte minori.

[[grafico:perdite]]

>! Le perdite nei fili non si calcolano con $V^2/R$ e la tensione della linea. Quella tensione non cade sui fili, ma sugli utenti in fondo. Prima la corrente, $I = P/V$; poi le perdite, $R \cdot I^2$, con la resistenza dei fili.

Per questo l'energia viaggia ad alta tensione, fino a centinaia di migliaia di volt. Vicino alle case i trasformatori la abbassano a 230 V. Trasformatori e tensione alternata li vedrai in «L'induzione elettromagnetica».

Anche nel corpo umano la corrente scalda e fa contrarre i muscoli, cuore compreso. Il danno lo fa la **corrente**, non la tensione da sola. La corrente dipende dalla tensione e dalla resistenza del corpo: $I = V/R$. La pelle asciutta resiste molto, quella bagnata molto meno. Poche decine di milliampere attraverso il torace sono già pericolose.

Per questo il salvavita di casa stacca la corrente quando ne sfuggono 30 mA. Gli elettrodomestici con l'involucro di metallo hanno anche la **messa a terra**. Se c'è un guasto, un filo porta la corrente a terra, invece che attraverso chi tocca.

La stessa fisica serve alla medicina. L'elettrocardiogramma misura le differenze di potenziale che il cuore crea sulla pelle, di circa un millivolt. Il defibrillatore, al contrario, manda una scossa breve e forte attraverso il torace. Serve a far ripartire il ritmo giusto del cuore.

?? Un uccello posato su un filo dell'alta tensione non si fa niente. Una persona che tocca lo stesso filo stando a terra rischia la vita. Perché?
[ ] l'uccello ha la pelle più isolante
[x] fra le zampe dell'uccello la differenza di potenziale è quasi zero
[ ] la persona pesa di più
[ ] l'uccello tocca il filo per poco tempo
=> Le due zampe stanno sullo stesso filo, quasi allo stesso potenziale: nell'uccello la corrente non passa. La persona, invece, chiude il circuito fra il filo e la terra.

?? A parità di potenza trasmessa, la tensione della linea triplica. Le perdite nei fili…
[ ] si riducono a un terzo
[x] si riducono a un nono
[ ] triplicano
=> La corrente diventa un terzo, e le perdite $R \cdot I^2$ vanno con il quadrato: $\left(\tfrac{1}{3}\right)^2 = \tfrac{1}{9}$.`
    },
    {
      id: 'rc',
      titolo: 'Il circuito RC',
      testo: R`Un condensatore accumula carica: $q = C \cdot V$, con $C$ la capacità in farad, come si è visto nell'argomento sul potenziale. Se lo si collega a una pila attraverso una resistenza, non si carica in un istante.

All'inizio il condensatore è scarico e la corrente vale $I_0 = \mathcal{E}/R$, come se lui non ci fosse. Poi la carica sulle armature respinge quella nuova. La tensione del condensatore sale, sulla resistenza resta meno tensione, e la corrente cala.

[[video:corrente/rc]]

>* Nella carica di un condensatore attraverso una resistenza $q = Q \cdot \left(1 - e^{-t/\tau}\right)$, con $Q = C \cdot \mathcal{E}$ la carica finale. La **costante di tempo** è $\tau = R \cdot C$.

Qui $e \approx 2{,}718$ è il numero di Nepero, la base degli esponenziali: non la carica dell'elettrone.

Dopo un tempo $\tau$ la carica è al 63% di $Q$. Dopo $2 \cdot \tau$ è all'86%, dopo $5 \cdot \tau$ al 99%: in pratica è carico.

[[grafico:rc-carica]]

Anche la corrente cala in modo esponenziale: $I = I_0 \cdot e^{-t/\tau}$. Dopo ogni intervallo $\tau$ si riduce al 37% di quanto valeva prima.

[[grafico:rc-corrente]]

Ohm per farad fa secondi:

$$\Omega \cdot \text{F} = \dfrac{\text{V}}{\text{A}} \cdot \dfrac{\text{C}}{\text{V}} = \dfrac{\text{C}}{\text{A}} = \text{s}$$

~ \tau = R \cdot C :: una resistenza da 10 kΩ e un condensatore da 220 μF
~ \tau = 10^4\,\Omega \cdot 2{,}2 \cdot 10^{-4}\,\text{F} :: chilo vuol dire mille, micro un milionesimo
~ \tau = \evidb{2{,}2\,\text{s}} :: in circa 11 s è carico

La scarica funziona allo stesso modo, al contrario: $q = Q \cdot e^{-t/\tau}$. Il flash di una macchina fotografica carica piano un condensatore e poi lo scarica di colpo nella lampada.

>! Il condensatore non arriva mai «esattamente» a $Q$: si avvicina sempre più piano. Dire che è carico dopo $5 \cdot \tau$ è un'approssimazione, al 99%.

?? Con la stessa pila e lo stesso condensatore si raddoppia la resistenza. Che cosa cambia?
[ ] la carica finale raddoppia
[ ] non cambia niente
[x] la carica arriva più lentamente: $\tau$ raddoppia
=> La carica finale $Q = C \cdot \mathcal{E}$ non dipende da $R$. La resistenza frena la corrente: $\tau = R \cdot C$ raddoppia e serve il doppio del tempo.`
    },
    {
      id: 'conduzione',
      titolo: 'Liquidi, gas e superconduttori',
      testo: R`Nell'acqua distillata la corrente quasi non passa. Basta sciogliere un po' di sale, e una lampadina collegata al circuito si accende. Chi porta le cariche nel liquido?

Il sale si scioglie in **ioni**: atomi con una carica, $\text{Na}^+$ e $\text{Cl}^-$. Le due lastre di metallo immerse nel liquido si chiamano **elettrodi**.

[[video:corrente/elettrolisi]]

Nel liquido gli elettroni non passano. Si muovono gli ioni: i positivi verso l'elettrodo negativo, i negativi verso il positivo. Cariche opposte in versi opposti danno una corrente nello stesso verso.

>* Nell'**elettrolisi** la corrente in un liquido è portata dagli ioni, e sugli elettrodi provoca reazioni chimiche. Con acqua molto salata, all'elettrodo positivo si libera cloro, a quello negativo idrogeno.

L'elettrolisi serve a produrre l'alluminio e il cloro. Serve anche a ricoprire un oggetto di metallo con un velo d'oro o di cromo.

Anche un **gas** può condurre, se ha ioni ed elettroni liberi. Succede nel fulmine, nelle lampade al neon, nella scintilla della candela di un motore.

>! Nell'acqua salata gli elettroni non attraversano il liquido: si scambiano solo sugli elettrodi. Nel liquido viaggiano gli ioni.

Fra i conduttori e gli isolanti ci sono i **semiconduttori**, come il silicio dei transistor. Al contrario dei metalli, scaldandosi conducono meglio. Infine i **superconduttori**: raffreddati sotto una temperatura critica, hanno resistenza esattamente zero. Il mercurio lo diventa sotto 4,2 K.

?? Si scioglie del sale nell'acqua e la lampadina si accende. Chi porta la corrente nel liquido?
[ ] gli elettroni che attraversano l'acqua
[x] gli ioni positivi e negativi, in versi opposti
[ ] solo gli ioni positivi
=> Nel liquido si muovono gli ioni $\text{Na}^+$ e $\text{Cl}^-$, in versi opposti; per la corrente è lo stesso verso. Gli elettroni restano nei fili e negli elettrodi.`
    }
  ],
  grafici: {
    /* la carica passata cresce come I·t: la pendenza del grafico carica–tempo è la corrente */
    carica: {
      tipo: 'orario', grandezza: 'q', unita: 'C', t: [0, 10], y: [0, 32],
      parametri: [{ nome: 'I', min: 1, max: 3, passo: 0.5, valore: 1.5, decimali: 1, etichetta: 'I (A)' }],
      funzioni: [{ f: 'I*t', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: [3, '3*I'], a: [7, '3*I'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [7, '3*I'], a: [7, '7*I'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [5, '3*I - 2.4'], testo: 'Δt = 4 s' },
        { tipo: 'testo', p: [7.25, '5*I'], testo: 'Δq = {{4*I}} C', ancora: 'start', colore: 3 }
      ],
      didascalia: 'La carica passata da una sezione del filo, con la corrente costante. In 4 s passano Δq = 4·I coulomb: la pendenza della retta, Δq / Δt, è l\'intensità di corrente I. Sposta il cursore per cambiare la corrente.'
    },
    /* la caratteristica tensione–corrente: retta per il filo ohmico, curva che si piega per la lampadina */
    caratteristica: {
      tipo: 'piano', x: [0, 0.6], y: [0, 16], altezza: 440, passo: [0.1, 2], proporzioni: 'libere',
      etichette: { x: 'I (A)', y: 'V (V)' },
      parametri: [{ nome: 'R', min: 10, max: 40, passo: 5, valore: 20, etichetta: 'R del filo (Ω)' }],
      funzioni: [
        { f: 'R*x', dominio: [0, 0.6], colore: 2, etichetta: 'filo' },
        { f: 'x*(5 + 76*x^2)', dominio: [0, 0.5], colore: 2, tratteggio: true, etichetta: 'lampadina' }
      ],
      elementi: [
        { tipo: 'punto', p: [0.25, '0.25*R'], etichetta: 'V / I = {{R}} Ω', posizione: 'sinistra', colore: 2 },
        { tipo: 'punto', p: [0.2, 1.608], etichetta: '8 Ω', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'punto', p: [0.4, 6.864], etichetta: '17 Ω', posizione: 'basso-destra', colore: 'grigio' }
      ],
      didascalia: 'La tensione in funzione della corrente. Il filo ohmico (linea piena) dà una retta per l\'origine: il rapporto V / I è sempre lo stesso, la resistenza. La lampadina (tratteggio) si piega verso l\'alto: scaldandosi, il rapporto V / I passa da circa 8 Ω a 0,2 A a circa 17 Ω a 0,4 A. Sposta il cursore per cambiare il filo.'
    },
    /* la pila reale: V = ℰ − r·I con ℰ = 9 V e r = 2 Ω, come nel video; il punto di lavoro dipende da R */
    pila: {
      tipo: 'piano', x: [0, 5.8], y: [0, 11], altezza: 420, passo: [1, 2], proporzioni: 'libere',
      etichette: { x: 'I (A)', y: 'V (V)' },
      parametri: [{ nome: 'R', min: 0.5, max: 20, passo: 0.5, valore: 4, decimali: 1, etichetta: 'R esterna (Ω)' }],
      funzioni: [{ f: '9 - 2*x', dominio: [0, 4.5], colore: 2 }],
      elementi: [
        { tipo: 'orizzontale', y: 9, colore: 'grigio', tratteggio: true, etichetta: 'ℰ = 9 V' },
        { tipo: 'segmento', da: ['9/(R+2)', '9*R/(R+2)'], a: ['9/(R+2)', 9], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['9/(R+2)', '9*R/(R+2)'], colore: 4 },
        { tipo: 'punto', p: [4.5, 0], colore: 'grigio' },
        { tipo: 'testo', p: [0.12, 2.3], testo: 'I = {{9/(R+2)|2}} A', ancora: 'start', colore: 4 },
        { tipo: 'testo', p: [0.12, 1.0], testo: 'V = {{9*R/(R+2)|1}} V', ancora: 'start', colore: 2 }
      ],
      didascalia: 'Una pila con ℰ = 9 V e r = 2 Ω. Più corrente eroga, più cala la tensione ai poli: V = 9 − 2·I. Il tratteggio verticale è la tensione r·I persa dentro la pila. Dove la retta tocca l\'asse c\'è il corto circuito: 4,5 A e V = 0. Sposta il cursore per cambiare la resistenza esterna.'
    },
    /* due resistenze in serie: la stessa corrente, le tensioni che si sommano */
    serie: {
      tipo: 'piano', x: [-3.9, 3.6], y: [-2.6, 2.9], assi: false, griglia: false, altezza: 440,
      elementi: [
        filo([-3, -2], [-3, -0.17]), filo([-3, 0.17], [-3, 2]),
      ].concat(pilaVerticale([-3, 0]), [
        filo([-3, 2], [-1.65, 2]), resistore([-1, 2], false), filo([-0.35, 2], [0.85, 2]), resistore([1.5, 2], false), filo([2.15, 2], [3, 2]),
        filo([3, 2], [3, -2]), filo([3, -2], [-3, -2]),
        { tipo: 'testo', p: [-1, 2.5], testo: 'R_1' },
        { tipo: 'testo', p: [1.5, 2.5], testo: 'R_2' },
        { tipo: 'testo', p: [-1, 1.25], testo: 'V_1', colore: 2 },
        { tipo: 'testo', p: [1.5, 1.25], testo: 'V_2', colore: 2 },
        { tipo: 'testo', p: [-3.35, 0.05], testo: 'ℰ', ancora: 'end' },
        { tipo: 'vettore', da: [3, 0.7], a: [3, -0.7], etichetta: 'I', colore: 4 },
        { tipo: 'vettore', da: [0.7, -2], a: [-0.7, -2], etichetta: 'I', posizione: 'destra', colore: 4 }
      ]),
      didascalia: 'In serie: R₁ e R₂ una dopo l\'altra sullo stesso filo. La corrente I è la stessa dappertutto; le tensioni si sommano, V₁ + V₂ = ℰ. Il polo + della pila è la piastra lunga.'
    },
    /* due resistenze in parallelo fra gli stessi due nodi: la stessa tensione, le correnti che si sommano */
    parallelo: {
      tipo: 'piano', x: [-3.9, 3.7], y: [-2.4, 2.6], assi: false, griglia: false, altezza: 400,
      elementi: [
        filo([-3, -2], [-3, -0.17]), filo([-3, 0.17], [-3, 2]),
      ].concat(pilaVerticale([-3, 0]), [
        filo([-3, 2], [2.5, 2]), filo([2.5, -2], [-3, -2]),
        filo([0.5, 2], [0.5, 0.65]), resistore([0.5, 0], true), filo([0.5, -0.65], [0.5, -2]),
        filo([2.5, 2], [2.5, 0.65]), resistore([2.5, 0], true), filo([2.5, -0.65], [2.5, -2]),
        { tipo: 'punto', p: [0.5, 2], colore: 'grigio' },
        { tipo: 'punto', p: [0.5, -2], colore: 'grigio' },
        { tipo: 'testo', p: [0.95, 0.05], testo: 'R_1', ancora: 'start' },
        { tipo: 'testo', p: [2.95, 0.05], testo: 'R_2', ancora: 'start' },
        { tipo: 'testo', p: [-3.35, 0.05], testo: 'ℰ', ancora: 'end' },
        { tipo: 'testo', p: [1.5, -1.3], testo: 'stessa V', colore: 2 },
        { tipo: 'vettore', da: [-2.3, 2], a: [-0.9, 2], etichetta: 'I', colore: 4 },
        { tipo: 'vettore', da: [0.5, 1.75], a: [0.5, 1.05], etichetta: 'I_1', colore: 4 },
        { tipo: 'vettore', da: [2.5, 1.75], a: [2.5, 1.05], etichetta: 'I_2', colore: 4 }
      ]),
      didascalia: 'In parallelo: R₁ e R₂ su due rami fra gli stessi due nodi (i pallini). Su ogni ramo c\'è la stessa tensione; nel nodo la corrente si divide, I = I₁ + I₂.'
    },
    /* il circuito a due maglie del video: correnti lunghe in proporzione (I₁ = 2 A, I₂ = 1 A, I₃ = 3 A) */
    kirchhoff: {
      tipo: 'piano', x: [-5.6, 5.6], y: [-3.7, 3.7], assi: false, griglia: false, altezza: 460,
      elementi: circuitoKirchhoff(1.4, 0.7, 2.1),
      didascalia: 'Due pile e tre resistenze: non è né serie né parallelo. A e B sono i nodi, i rami sono tre, le maglie sono il giro di sinistra e quello di destra. Con i valori del video le frecce sono lunghe in proporzione: I₁ = 2 A, I₂ = 1 A, I₃ = 3 A.'
    },
    /* lo stesso circuito per i problemi: le frecce sono solo i versi scelti */
    'kirchhoff-versi': {
      tipo: 'piano', x: [-5.6, 5.6], y: [-3.7, 3.7], assi: false, griglia: false, altezza: 460,
      elementi: circuitoKirchhoff(1.1, 1.1, 1.1),
      didascalia: 'Le frecce sono i versi scelti per le correnti. Se una corrente viene negativa, va al contrario della freccia. La piastra lunga di ogni pila è il polo +.'
    },
    /* le perdite nei fili di una linea: 10 MW, fili da 5 Ω; in percentuale, 5000 / V² con V in kV */
    perdite: {
      tipo: 'piano', x: [0, 110], y: [0, 65], altezza: 420, passo: [20, 10], proporzioni: 'libere',
      etichette: { x: 'V (kV)', y: 'perdite (%)' },
      parametri: [{ nome: 'V', min: 10, max: 100, passo: 5, valore: 30, etichetta: 'V della linea (kV)' }],
      funzioni: [{ f: '50*(10/x)^2', dominio: [10, 110], colore: 3 }],
      elementi: [
        { tipo: 'punto', p: ['V', '50*(10/V)^2'], colore: 3 },
        { tipo: 'testo', p: [106, 54], testo: 'I = {{10000/V|0}} A', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [106, 46], testo: 'perdite: {{50*(10/V)^2|1}}%', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una centrale manda 10 MW lungo fili che hanno in tutto 5 Ω. La corrente è I = P / V; il calore perso nei fili, R·I², in percentuale della potenza mandata. Tensione doppia, perdite quattro volte minori. Sposta il cursore per cambiare la tensione.'
    },
    /* la carica del condensatore del video (12 V, 100 μF): Q = 1,2 mC, τ = R·C */
    'rc-carica': {
      tipo: 'orario', grandezza: 'q', unita: 'mC', t: [0, 30], y: [0, 1.4],
      parametri: [{ nome: 'R', min: 20, max: 100, passo: 10, valore: 50, etichetta: 'R (kΩ)' }],
      funzioni: [{ f: '1.2*(1 - exp(-t/(0.1*R)))', colore: 3 }],
      elementi: [
        { tipo: 'orizzontale', y: 1.2, colore: 'grigio', tratteggio: true, etichetta: 'Q = 1,2 mC' },
        { tipo: 'segmento', da: ['0.1*R', 0], a: ['0.1*R', 0.7585], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['0.1*R', 0.7585], etichetta: '63%', posizione: 'destra', colore: 3 },
        { tipo: 'testo', p: ['0.1*R + 0.5', 0.12], testo: 'τ = {{0.1*R}} s', ancora: 'start' }
      ],
      didascalia: 'La carica di un condensatore da 100 μF collegato a una pila da 12 V attraverso la resistenza R. Dopo un tempo τ = R·C la carica è al 63% di Q. Con R doppia la curva è due volte più lenta. Sposta il cursore per cambiare la resistenza.'
    },
    /* la corrente nello stesso circuito: parte da 12 V / R e cala del 63% ogni τ */
    'rc-corrente': {
      tipo: 'orario', grandezza: 'I', unita: 'mA', t: [0, 30], y: [0, 0.7],
      parametri: [{ nome: 'R', min: 20, max: 100, passo: 10, valore: 50, etichetta: 'R (kΩ)' }],
      funzioni: [{ f: '12/R*exp(-t/(0.1*R))', colore: 4 }],
      elementi: [
        { tipo: 'segmento', da: ['0.1*R', 0], a: ['0.1*R', '12/R*0.3679'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['0.1*R', '12/R*0.3679'], etichetta: '37%', posizione: 'alto-destra', colore: 4 },
        { tipo: 'testo', p: [29, 0.6], testo: 'I_0 = 12 V / R = {{12/R}} mA', ancora: 'end', colore: 4 }
      ],
      didascalia: 'La corrente nello stesso circuito. All\'inizio vale I₀ = 12 V / R, come se il condensatore non ci fosse; poi cala, e dopo ogni τ si riduce al 37%. Sposta il cursore per cambiare la resistenza.'
    }
  },
  esempi: [
    {
      titolo: 'Quanto ci mette a caricarsi il telefono',
      problema: R`La batteria di un telefono ha una capacità di 4000 mAh. Il caricatore le manda una corrente costante di 2 A. Quanta carica contiene la batteria piena, in coulomb? Quanto tempo serve per caricarla da vuota?`,
      passi: [
        R`Dati: carica della batteria $Q = 4000\,\text{mAh}$, $I = 2\,\text{A}$. Cerco la carica $Q$ in coulomb e il tempo $\Delta t$.`,
        R`Il milliampereora è una carica: una corrente per un tempo. $4000\,\text{mAh} = 4\,\text{A} \cdot \text{h}$, e un'ora sono 3600 s.`,
        R`$Q = 4\,\text{A} \cdot 3600\,\text{s} = 14\,400\,\text{C}$.`,
        R`Dalla definizione di corrente: $\Delta t = \dfrac{Q}{I} = \dfrac{14\,400\,\text{C}}{2\,\text{A}} = 7200\,\text{s}$, cioè 2 ore.`,
        R`Controllo senza passare dai coulomb: $\dfrac{4\,\text{A} \cdot \text{h}}{2\,\text{A}} = 2\,\text{h}$. Torna. Nella realtà serve un po' di più: verso la fine il caricatore rallenta.`
      ],
      risultato: R`$Q = 14\,400\,\text{C}$; servono $7200\,\text{s} = 2\,\text{h}$.`
    },
    {
      titolo: 'La prolunga che si scalda',
      problema: R`Una prolunga è lunga 25 m e ha due fili di rame (andata e ritorno), ciascuno con sezione di 1 mm². Ci si collega una stufetta che assorbe 10 A. Quanto vale la resistenza dei fili? Quanta tensione si perde lungo la prolunga, e quanta potenza diventa calore nei fili?`,
      passi: [
        R`Dati: $L = 2 \cdot 25\,\text{m} = 50\,\text{m}$ (andata e ritorno), $S = 1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$, $\rho = 1{,}7 \cdot 10^{-8}\,\Omega \cdot \text{m}$, $I = 10\,\text{A}$. Cerco $R$, la tensione persa $V$ e la potenza $P$.`,
        R`Seconda legge di Ohm: $R = \rho \cdot \dfrac{L}{S} = 1{,}7 \cdot 10^{-8}\,\Omega \cdot \text{m} \cdot \dfrac{50\,\text{m}}{10^{-6}\,\text{m}^2} = 0{,}85\,\Omega$.`,
        R`Prima legge: lungo i fili si perde $V = R \cdot I = 0{,}85\,\Omega \cdot 10\,\text{A} = 8{,}5\,\text{V}$.`,
        R`Calore nei fili: $P = R \cdot I^2 = 0{,}85\,\Omega \cdot (10\,\text{A})^2 = 85\,\text{W}$.`,
        R`Controllo con l'altra formula: $P = V \cdot I = 8{,}5\,\text{V} \cdot 10\,\text{A} = 85\,\text{W}$. Torna. Per questo una prolunga avvolta sul rocchetto, con tanta corrente, può surriscaldarsi.`
      ],
      risultato: R`$R = 0{,}85\,\Omega$; si perdono $8{,}5\,\text{V}$ e $85\,\text{W}$ di calore.`
    },
    {
      titolo: 'I fari che calano all\'avviamento',
      problema: R`La batteria di un'auto ha $\mathcal{E} = 12{,}6\,\text{V}$ e resistenza interna $r = 0{,}02\,\Omega$. All'avviamento il motorino assorbe 150 A. Quanto vale la tensione ai poli? Qual è la resistenza del motorino?`,
      passi: [
        R`Dati: $\mathcal{E} = 12{,}6\,\text{V}$, $r = 0{,}02\,\Omega$, $I = 150\,\text{A}$. Cerco la tensione ai poli $V$ e la resistenza $R$ del motorino.`,
        R`Sulla resistenza interna si perde $r \cdot I = 0{,}02\,\Omega \cdot 150\,\text{A} = 3\,\text{V}$.`,
        R`Ai poli resta $V = \mathcal{E} - r \cdot I = 12{,}6\,\text{V} - 3\,\text{V} = 9{,}6\,\text{V}$. Per questo, mentre si avvia il motore, i fari si abbassano.`,
        R`Il motorino ha ai capi $9{,}6\,\text{V}$ e ci passano 150 A: $R = \dfrac{V}{I} = \dfrac{9{,}6\,\text{V}}{150\,\text{A}} = 0{,}064\,\Omega$.`,
        R`Controllo: $I = \dfrac{\mathcal{E}}{R + r} = \dfrac{12{,}6\,\text{V}}{0{,}084\,\Omega} = 150\,\text{A}$. Torna.`
      ],
      risultato: R`$V = 9{,}6\,\text{V}$ ai poli; il motorino ha $R = 0{,}064\,\Omega$.`
    },
    {
      titolo: 'Un circuito con serie e parallelo',
      problema: R`Una pila da 9 V, di resistenza interna trascurabile, alimenta una resistenza $R_1 = 2\,\Omega$. In serie con questa ci sono due resistenze in parallelo, $R_2 = 12\,\Omega$ e $R_3 = 6\,\Omega$. Quanta corrente esce dalla pila? Quanta ne passa in ciascuna resistenza del parallelo?`,
      passi: [
        R`Dati: $\mathcal{E} = 9\,\text{V}$, $R_1 = 2\,\Omega$, $R_2 = 12\,\Omega$, $R_3 = 6\,\Omega$. Cerco la corrente $I$ della pila e le correnti $I_2$ e $I_3$.`,
        R`Prima il parallelo: $\dfrac{1}{R_p} = \dfrac{1}{12} + \dfrac{2}{12} = \dfrac{3}{12}$, quindi $R_p = 4\,\Omega$.`,
        R`Il parallelo è in serie con $R_1$: $R = 2\,\Omega + 4\,\Omega = 6\,\Omega$. La corrente della pila è $I = \dfrac{9\,\text{V}}{6\,\Omega} = 1{,}5\,\text{A}$.`,
        R`Sul parallelo c'è la tensione $V_p = R_p \cdot I = 4\,\Omega \cdot 1{,}5\,\text{A} = 6\,\text{V}$, uguale sui due rami.`,
        R`$I_2 = \dfrac{6\,\text{V}}{12\,\Omega} = 0{,}5\,\text{A}$ e $I_3 = \dfrac{6\,\text{V}}{6\,\Omega} = 1\,\text{A}$.`,
        R`Controlli: nel nodo $0{,}5\,\text{A} + 1\,\text{A} = 1{,}5\,\text{A}$; su $R_1$ cadono $3\,\text{V}$, e $3\,\text{V} + 6\,\text{V} = 9\,\text{V}$. Tornano tutti e due.`
      ],
      risultato: R`$I = 1{,}5\,\text{A}$; $I_2 = 0{,}5\,\text{A}$ nella resistenza da 12 Ω, $I_3 = 1\,\text{A}$ in quella da 6 Ω.`
    },
    {
      titolo: 'Kirchhoff, con una corrente negativa',
      problema: R`Nel circuito del disegno $\mathcal{E}_1 = 12\,\text{V}$, $R_1 = 2\,\Omega$, $\mathcal{E}_2 = 3\,\text{V}$, $R_2 = 3\,\Omega$, $R_3 = 3\,\Omega$. I versi delle correnti sono quelli delle frecce. Quanto valgono le tre correnti?

[[grafico:kirchhoff-versi]]`,
      passi: [
        R`Dati: $\mathcal{E}_1 = 12\,\text{V}$, $\mathcal{E}_2 = 3\,\text{V}$, $R_1 = 2\,\Omega$, $R_2 = 3\,\Omega$, $R_3 = 3\,\Omega$. Cerco $I_1$, $I_2$, $I_3$, con i versi del disegno.`,
        R`Nodo A: $I_1 + I_2 = I_3$.`,
        R`Maglia di sinistra: $12\,\text{V} - 2\,\Omega \cdot I_1 - 3\,\Omega \cdot I_3 = 0$, quindi $I_1 = 6\,\text{A} - 1{,}5 \cdot I_3$.`,
        R`Maglia di destra: $3\,\text{V} - 3\,\Omega \cdot I_2 - 3\,\Omega \cdot I_3 = 0$, quindi $I_2 = 1\,\text{A} - I_3$.`,
        R`Nel nodo: $6\,\text{A} - 1{,}5 \cdot I_3 + 1\,\text{A} - I_3 = I_3$, cioè $7\,\text{A} = 3{,}5 \cdot I_3$: $I_3 = 2\,\text{A}$. Poi $I_1 = 3\,\text{A}$ e $I_2 = -1\,\text{A}$.`,
        R`$I_2$ è negativa: nel ramo di destra la corrente scende, ed entra nella pila dal polo +. La pila da 3 V si sta ricaricando.`,
        R`Controllo nella maglia di destra: $3\,\text{V} - 3\,\Omega \cdot (-1\,\text{A}) - 3\,\Omega \cdot 2\,\text{A} = 0$. E nel nodo $3\,\text{A} - 1\,\text{A} = 2\,\text{A}$. Torna.`
      ],
      risultato: R`$I_1 = 3\,\text{A}$, $I_2 = -1\,\text{A}$ (va nel verso opposto alla freccia), $I_3 = 2\,\text{A}$.`
    },
    {
      titolo: 'Il bollitore elettrico',
      problema: R`Un bollitore da 2300 W funziona alla presa di casa, a 230 V. Quanta corrente assorbe e quanto vale la sua resistenza? Quanto tempo impiega a portare 1,5 L d'acqua da 20 °C a 100 °C, se tutta l'energia va all'acqua? Quanti kWh consuma?`,
      passi: [
        R`Dati: $P = 2300\,\text{W}$, $V = 230\,\text{V}$, $m = 1{,}5\,\text{kg}$ (1,5 L d'acqua), $\Delta T = 80\,{}^\circ\text{C}$, $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Cerco $I$, $R$, il tempo $\Delta t$ e l'energia in kWh.`,
        R`Corrente: $I = \dfrac{P}{V} = \dfrac{2300\,\text{W}}{230\,\text{V}} = 10\,\text{A}$. Resistenza: $R = \dfrac{V}{I} = \dfrac{230\,\text{V}}{10\,\text{A}} = 23\,\Omega$.`,
        R`Calore per l'acqua: $Q = m \cdot c \cdot \Delta T = 1{,}5 \cdot 4186 \cdot 80\,\text{J} = 502\,320\,\text{J}$.`,
        R`Tempo: $\Delta t = \dfrac{Q}{P} = \dfrac{502\,320\,\text{J}}{2300\,\text{W}} \approx 218\,\text{s}$, circa 3 minuti e mezzo.`,
        R`Energia in kWh: $\dfrac{502\,320}{3{,}6 \cdot 10^6}\,\text{kWh} \approx 0{,}14\,\text{kWh}$.`,
        R`Controllo con l'altra formula della potenza: $P = \dfrac{V^2}{R} = \dfrac{230^2}{23}\,\text{W} = 2300\,\text{W}$. Torna.`
      ],
      risultato: R`$I = 10\,\text{A}$, $R = 23\,\Omega$; circa $218\,\text{s}$ e $0{,}14\,\text{kWh}$.`
    }
  ],
  formulario: [
    { nome: 'Intensità di corrente', formula: R`I = \dfrac{\Delta q}{\Delta t}`, nota: R`In ampere: $1\,\text{A} = 1\,\text{C/s}$. Verso convenzionale: dal polo + al polo −, fuori dal generatore.` },
    { nome: 'Velocità di deriva', formula: R`v_d = \dfrac{I}{n \cdot e \cdot S}`, nota: R`$n$ elettroni liberi per m³ (rame: $8{,}5 \cdot 10^{28}$), $S$ sezione in m². Frazioni di mm/s.` },
    { nome: 'Prima legge di Ohm', formula: R`V = R \cdot I`, nota: R`Solo per i conduttori ohmici. $1\,\Omega = 1\,\text{V/A}$.` },
    { nome: 'Seconda legge di Ohm', formula: R`R = \rho \cdot \dfrac{L}{S}`, nota: R`$\rho$ resistività in $\Omega \cdot \text{m}$; $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$.` },
    { nome: 'Resistività e temperatura', formula: R`\rho = \rho_0 \cdot (1 + \alpha \cdot \Delta T)`, nota: R`Nei metalli $\alpha > 0$: scaldandosi conducono peggio. Rame: $\alpha \approx 4 \cdot 10^{-3}\,{}^\circ\text{C}^{-1}$.` },
    { nome: 'Generatore reale', formula: R`V = \mathcal{E} - r \cdot I \qquad I = \dfrac{\mathcal{E}}{R + r}`, nota: R`$\mathcal{E}$ forza elettromotrice, $r$ resistenza interna. Corto circuito: $I = \mathcal{E}/r$.` },
    { nome: 'Resistenze in serie', formula: R`R = R_1 + R_2`, nota: R`Stessa corrente; le tensioni si sommano.` },
    { nome: 'Resistenze in parallelo', formula: R`\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}`, nota: R`Stessa tensione; le correnti si sommano. $R$ è minore della più piccola.` },
    { nome: 'Legge dei nodi', formula: R`\textstyle\sum I_{\text{entrano}} = \sum I_{\text{escono}}`, nota: R`Si conserva la carica.` },
    { nome: 'Legge delle maglie', formula: R`\textstyle\sum V = 0`, nota: R`Le tensioni lungo un giro chiuso, ognuna con il suo segno: si conserva l'energia.` },
    { nome: 'Potenza elettrica', formula: R`P = V \cdot I \qquad P = R \cdot I^2`, nota: R`In una resistenza anche $P = \dfrac{V^2}{R}$, tutta in calore (effetto Joule).` },
    { nome: 'Energia elettrica', formula: R`E = P \cdot \Delta t`, nota: R`$1\,\text{kWh} = 3{,}6 \cdot 10^6\,\text{J}$.` },
    { nome: 'Circuito RC', formula: R`\tau = R \cdot C \qquad Q = C \cdot \mathcal{E}`, nota: R`$\tau$ in secondi: $\Omega \cdot \text{F} = \text{s}$. $Q$ è la carica finale.` },
    { nome: 'Carica del condensatore', formula: R`q = Q \cdot \left(1 - e^{-t/\tau}\right)`, nota: R`Dopo $\tau$ il 63%, dopo $2 \cdot \tau$ l'86%, dopo $5 \cdot \tau$ il 99%. La corrente cala: $I = I_0 \cdot e^{-t/\tau}$, con $I_0 = \mathcal{E}/R$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'intensita', tipo: 'definizione', fronte: R`Che cos'è l'**intensità di corrente**?`, retro: R`La carica che attraversa una sezione del conduttore divisa per il tempo: $I = \dfrac{\Delta q}{\Delta t}$, in ampere ($1\,\text{A} = 1\,\text{C/s}$).` },
    { id: 'fc-02', sezione: 'intensita', tipo: 'concetto', fronte: R`Qual è il **verso convenzionale** della corrente?`, retro: R`Quello in cui si muoverebbero cariche positive: fuori dal generatore, dal polo + al polo −. Gli elettroni vanno al contrario.` },
    { id: 'fc-03', sezione: 'intensita', tipo: 'concetto', fronte: R`Una lampadina **consuma** la corrente?`, retro: R`No: la corrente che esce è uguale a quella che entra. La lampadina trasforma l'energia delle cariche in luce e calore.` },
    { id: 'fc-04', sezione: 'deriva', tipo: 'definizione', fronte: R`Che cos'è la **velocità di deriva**?`, retro: R`La velocità media con cui gli elettroni avanzano nel filo: $v_d = \dfrac{I}{n \cdot e \cdot S}$. Nei fili di casa, frazioni di millimetro al secondo.` },
    { id: 'fc-05', sezione: 'deriva', tipo: 'concetto', fronte: R`Se gli elettroni sono così lenti, perché la luce si accende subito?`, retro: R`Il filo è già pieno di elettroni; la spinta del campo elettrico corre quasi alla velocità della luce e li mette in moto quasi tutti insieme.` },
    { id: 'fc-06', sezione: 'ohm', tipo: 'definizione', fronte: R`Che cos'è la **tensione** fra due punti di un circuito?`, retro: R`La loro differenza di potenziale: l'energia che ogni coulomb guadagna o perde fra i due punti. In volt: $1\,\text{V} = 1\,\text{J/C}$.` },
    { id: 'fc-07', sezione: 'ohm', tipo: 'formula', fronte: R`**Prima legge di Ohm**`, retro: R`$V = R \cdot I$: nei conduttori ohmici la corrente è proporzionale alla tensione. $R$ è la resistenza, in ohm.` },
    { id: 'fc-08', sezione: 'ohm', tipo: 'formula', fronte: R`**Seconda legge di Ohm**`, retro: R`$R = \rho \cdot \dfrac{L}{S}$: la resistenza cresce con la lunghezza, cala con la sezione e dipende dalla resistività $\rho$ del materiale.` },
    { id: 'fc-09', sezione: 'ohm', tipo: 'concetto', fronte: R`Una lampadina a filamento è un conduttore **ohmico**?`, retro: R`No: scaldandosi la sua resistenza cresce, e il grafico tensione–corrente si piega invece di essere una retta.` },
    { id: 'fc-10', sezione: 'generatori', tipo: 'definizione', fronte: R`Che cos'è la **forza elettromotrice** di un generatore?`, retro: R`La tensione fra i poli a circuito aperto: l'energia data a ogni coulomb. Si misura in volt; non è una forza.` },
    { id: 'fc-11', sezione: 'generatori', tipo: 'formula', fronte: R`Tensione ai poli di un generatore che eroga la corrente $I$`, retro: R`$V = \mathcal{E} - r \cdot I$, con $r$ la resistenza interna. Con una resistenza esterna $R$: $I = \dfrac{\mathcal{E}}{R + r}$.` },
    { id: 'fc-12', sezione: 'generatori', tipo: 'concetto', fronte: R`Che cosa succede in un **corto circuito**?`, retro: R`I poli sono uniti senza resistenza: $V = 0$ e $I = \mathcal{E}/r$, grandissima. Tutta l'energia scalda il generatore e i fili.` },
    { id: 'fc-13', sezione: 'serie-parallelo', tipo: 'formula', fronte: R`Resistenza equivalente **in serie** e **in parallelo**`, retro: R`Serie: $R = R_1 + R_2$. Parallelo: $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$.` },
    { id: 'fc-14', sezione: 'serie-parallelo', tipo: 'concetto', fronte: R`Che cosa è uguale in serie, e che cosa in parallelo?`, retro: R`In serie la corrente, e le tensioni si sommano. In parallelo la tensione, e le correnti si sommano.` },
    { id: 'fc-15', sezione: 'serie-parallelo', tipo: 'procedura', fronte: R`Come si collegano **amperometro** e **voltmetro**?`, retro: R`L'amperometro in serie, con resistenza piccolissima; il voltmetro in parallelo, con resistenza grandissima.` },
    { id: 'fc-16', sezione: 'kirchhoff', tipo: 'formula', fronte: R`Le due **leggi di Kirchhoff**`, retro: R`Nodi: la corrente che entra è uguale a quella che esce. Maglie: lungo un giro chiuso la somma delle tensioni, con il segno, è zero.` },
    { id: 'fc-17', sezione: 'kirchhoff', tipo: 'procedura', fronte: R`Risolvendo un circuito con Kirchhoff, una corrente viene negativa. Che cosa vuol dire?`, retro: R`Che va nel verso opposto a quello scelto all'inizio. Il valore è giusto, si cambia solo il verso.` },
    { id: 'fc-18', sezione: 'joule', tipo: 'formula', fronte: R`**Potenza elettrica**`, retro: R`$P = V \cdot I$, in watt. In una resistenza anche $P = R \cdot I^2 = \dfrac{V^2}{R}$.` },
    { id: 'fc-19', sezione: 'joule', tipo: 'definizione', fronte: R`Che cos'è l'**effetto Joule**?`, retro: R`Il riscaldamento di un conduttore percorso da corrente: gli elettroni urtano gli atomi e li fanno vibrare. Potenza dissipata $R \cdot I^2$.` },
    { id: 'fc-20', sezione: 'joule', tipo: 'concetto', fronte: R`Perché l'energia elettrica viaggia ad **alta tensione**?`, retro: R`A parità di potenza la corrente è minore, e le perdite nei fili, $R \cdot I^2$, calano con il quadrato della corrente.` },
    { id: 'fc-21', sezione: 'rc', tipo: 'formula', fronte: R`Carica di un condensatore attraverso una resistenza`, retro: R`$q = Q \cdot \left(1 - e^{-t/\tau}\right)$, con $Q = C \cdot \mathcal{E}$ e la costante di tempo $\tau = R \cdot C$.` },
    { id: 'fc-22', sezione: 'rc', tipo: 'concetto', fronte: R`A che punto è la carica dopo un tempo $\tau = R \cdot C$? E dopo $5 \cdot \tau$?`, retro: R`Dopo $\tau$ al 63% della carica finale; dopo $5 \cdot \tau$ al 99%, in pratica carico.` },
    { id: 'fc-23', sezione: 'conduzione', tipo: 'definizione', fronte: R`Che cos'è l'**elettrolisi**?`, retro: R`La conduzione in un liquido, portata dagli ioni, che provoca reazioni chimiche sugli elettrodi.` },
    { id: 'fc-24', sezione: 'conduzione', tipo: 'concetto', fronte: R`Che cos'è un **superconduttore**?`, retro: R`Un materiale che sotto una temperatura critica ha resistenza esattamente zero. Il mercurio lo diventa sotto 4,2 K.` },
    { id: 'fc-25', sezione: 'joule', tipo: 'concetto', fronte: R`Che cosa rende pericolosa una scossa: la tensione o la corrente?`, retro: R`La corrente che attraversa il corpo: poche decine di milliampere nel torace sono già pericolose. La tensione conta perché, con la resistenza del corpo, decide la corrente.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Da una sezione di un filo passano 45 C in 15 s. Quanto vale l'intensità di corrente?`, suggerimenti: [R`Carica divisa tempo.`], risposta: { tipo: 'numero', valore: 3, unita: 'A' }, soluzione: [R`$I = \dfrac{\Delta q}{\Delta t} = \dfrac{45\,\text{C}}{15\,\text{s}} = 3\,\text{A}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`In un filo passa una corrente di 0,8 A per 50 s. Quanta carica lo attraversa?`, suggerimenti: [R`Da $I = \dfrac{\Delta q}{\Delta t}$ ricava $\Delta q$.`], risposta: { tipo: 'numero', valore: 40, unita: 'C' }, soluzione: [R`$\Delta q = I \cdot \Delta t = 0{,}8\,\text{A} \cdot 50\,\text{s} = 40\,\text{C}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Esprimi 350 mA in ampere.`, suggerimenti: [R`Un milliampere è un millesimo di ampere.`], risposta: { tipo: 'numero', valore: 0.35, unita: 'A', soloUnita: true }, soluzione: [R`$350\,\text{mA} = 350 \cdot 10^{-3}\,\text{A} = 0{,}35\,\text{A}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una resistenza da 25 Ω è collegata a una tensione di 10 V. Quanta corrente la attraversa?`, suggerimenti: [R`Dalla prima legge di Ohm: $I = \dfrac{V}{R}$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'A' }, soluzione: [R`$I = \dfrac{10\,\text{V}}{25\,\Omega} = 0{,}4\,\text{A}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`In una resistenza da 35 Ω passa una corrente di 0,6 A. Quanto vale la tensione ai suoi capi?`, suggerimenti: [R`$V = R \cdot I$.`], risposta: { tipo: 'numero', valore: 21, unita: 'V' }, soluzione: [R`$V = 35\,\Omega \cdot 0{,}6\,\text{A} = 21\,\text{V}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Con una tensione di 36 V, in un conduttore ohmico passa una corrente di 1,2 A. Quanto vale la sua resistenza?`, suggerimenti: [R`$R = \dfrac{V}{I}$.`], risposta: { tipo: 'numero', valore: 30, unita: 'Ω' }, soluzione: [R`$R = \dfrac{36\,\text{V}}{1{,}2\,\text{A}} = 30\,\Omega$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`In un conduttore ohmico, con 5 V passano 0,1 A. Quanta corrente passa con 17 V?`, suggerimenti: [R`La resistenza non cambia: calcolala con la prima coppia di valori.`, R`Oppure: la corrente è proporzionale alla tensione.`], risposta: { tipo: 'numero', valore: 0.34, unita: 'A' }, soluzione: [R`$R = \dfrac{5\,\text{V}}{0{,}1\,\text{A}} = 50\,\Omega$.`, R`$I = \dfrac{17\,\text{V}}{50\,\Omega} = 0{,}34\,\text{A}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un filo di ferro ($\rho = 1{,}0 \cdot 10^{-7}\,\Omega \cdot \text{m}$) è lungo 20 m e ha sezione di 0,5 mm². Quanto vale la sua resistenza?`, suggerimenti: [R`Porta la sezione in m²: $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$.`, R`$R = \rho \cdot \dfrac{L}{S}$.`], risposta: { tipo: 'numero', valore: 4, unita: 'Ω' }, soluzione: [R`$S = 0{,}5\,\text{mm}^2 = 5 \cdot 10^{-7}\,\text{m}^2$.`, R`$R = 1{,}0 \cdot 10^{-7}\,\Omega \cdot \text{m} \cdot \dfrac{20\,\text{m}}{5 \cdot 10^{-7}\,\text{m}^2} = 4\,\Omega$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un filo ha resistenza 7 Ω. Quanto vale la resistenza di un filo dello stesso materiale e della stessa sezione, ma lungo il doppio?`, suggerimenti: [R`$R$ è proporzionale alla lunghezza.`], risposta: { tipo: 'numero', valore: 14, unita: 'Ω' }, soluzione: [R`Lunghezza doppia, resistenza doppia: $2 \cdot 7\,\Omega = 14\,\Omega$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un filo ha resistenza 8 Ω. Un filo dello stesso materiale e della stessa lunghezza ha sezione quattro volte più grande. Quanto vale la sua resistenza?`, suggerimenti: [R`$R$ è inversamente proporzionale alla sezione.`], risposta: { tipo: 'numero', valore: 2, unita: 'Ω' }, soluzione: [R`Sezione quattro volte più grande, resistenza quattro volte più piccola: $\dfrac{8\,\Omega}{4} = 2\,\Omega$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un generatore con $\mathcal{E} = 15\,\text{V}$ e resistenza interna $r = 1\,\Omega$ alimenta una resistenza da $5\,\Omega$. Quanta corrente circola?`, suggerimenti: [R`La corrente attraversa sia $R$ sia $r$: $I = \dfrac{\mathcal{E}}{R + r}$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'A' }, soluzione: [R`$I = \dfrac{15\,\text{V}}{5\,\Omega + 1\,\Omega} = 2{,}5\,\text{A}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Una batteria ha $\mathcal{E} = 24\,\text{V}$ e resistenza interna $0{,}4\,\Omega$. Quando eroga 5 A, che tensione c'è ai suoi poli?`, suggerimenti: [R`$V = \mathcal{E} - r \cdot I$.`], risposta: { tipo: 'numero', valore: 22, unita: 'V' }, soluzione: [R`$V = 24\,\text{V} - 0{,}4\,\Omega \cdot 5\,\text{A} = 24\,\text{V} - 2\,\text{V} = 22\,\text{V}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Una pila da 1,5 V ha resistenza interna $0{,}25\,\Omega$. Quanta corrente darebbe in corto circuito?`, suggerimenti: [R`In corto circuito l'unica resistenza è quella interna.`], risposta: { tipo: 'numero', valore: 6, unita: 'A' }, soluzione: [R`$I = \dfrac{\mathcal{E}}{r} = \dfrac{1{,}5\,\text{V}}{0{,}25\,\Omega} = 6\,\text{A}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Due resistenze da 15 Ω e 25 Ω sono collegate in serie. Quanto vale la resistenza equivalente?`, suggerimenti: [R`In serie le resistenze si sommano.`], risposta: { tipo: 'numero', valore: 40, unita: 'Ω' }, soluzione: [R`$R = 15\,\Omega + 25\,\Omega = 40\,\Omega$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Due resistenze da 20 Ω e 30 Ω sono collegate in parallelo. Quanto vale la resistenza equivalente?`, suggerimenti: [R`$\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$, con denominatore comune 60.`, R`Alla fine capovolgi.`], risposta: { tipo: 'numero', valore: 12, unita: 'Ω' }, soluzione: [R`$\dfrac{1}{R} = \dfrac{3}{60} + \dfrac{2}{60} = \dfrac{5}{60} = \dfrac{1}{12}$.`, R`$R = 12\,\Omega$: minore di 20 Ω, come deve essere.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`In un nodo arrivano due fili con correnti di 1,2 A e 0,7 A. Ne esce un solo filo. Quanta corrente porta?`, suggerimenti: [R`Legge dei nodi: quel che entra esce.`], risposta: { tipo: 'numero', valore: 1.9, unita: 'A' }, soluzione: [R`$I = 1{,}2\,\text{A} + 0{,}7\,\text{A} = 1{,}9\,\text{A}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una lampada dell'auto funziona a 12 V e assorbe 3 A. Quanto vale la sua potenza?`, suggerimenti: [R`$P = V \cdot I$.`], risposta: { tipo: 'numero', valore: 36, unita: 'W' }, soluzione: [R`$P = 12\,\text{V} \cdot 3\,\text{A} = 36\,\text{W}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`In una resistenza da 5 Ω passa una corrente di 4 A. Quanta potenza diventa calore?`, suggerimenti: [R`Effetto Joule: $P = R \cdot I^2$.`], risposta: { tipo: 'numero', valore: 80, unita: 'W' }, soluzione: [R`$P = 5\,\Omega \cdot (4\,\text{A})^2 = 5 \cdot 16\,\text{W} = 80\,\text{W}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un condizionatore da 2500 W resta acceso per 3 ore. Quanti kWh consuma?`, suggerimenti: [R`Energia = potenza per tempo, in kW e ore.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'kWh' }, soluzione: [R`$E = 2{,}5\,\text{kW} \cdot 3\,\text{h} = 7{,}5\,\text{kWh}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un condensatore da 500 μF si carica attraverso una resistenza da 2 kΩ. Quanto vale la costante di tempo?`, suggerimenti: [R`$\tau = R \cdot C$, in ohm e farad.`, R`$2\,\text{k}\Omega = 2000\,\Omega$, $500\,\mu\text{F} = 5 \cdot 10^{-4}\,\text{F}$.`], risposta: { tipo: 'numero', valore: 1, unita: 's' }, soluzione: [R`$\tau = 2000\,\Omega \cdot 5 \cdot 10^{-4}\,\text{F} = 1\,\text{s}$.`] },
    { id: 'b-21', livello: 'base', difficolta: 1, testo: R`Con le mani bagnate, la resistenza del corpo da una mano all'altra scende a circa 1000 Ω. Quanta corrente passa se una persona tocca con le due mani i due poli di una presa da 230 V? Rispondi in milliampere.`, suggerimenti: [R`$I = V / R$, poi passa da ampere a milliampere.`], risposta: { tipo: 'numero', valore: 230, unita: 'mA' }, soluzione: [R`Dati: $V = 230\,\text{V}$, $R = 1000\,\Omega$. Cerco $I$.`, R`$I = \dfrac{230\,\text{V}}{1000\,\Omega} = 0{,}23\,\text{A} = 230\,\text{mA}$.`, R`È quasi otto volte la soglia del salvavita, 30 mA: una corrente che può fermare il cuore.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un cavo di rame con sezione di 2,5 mm² porta 10 A. Gli elettroni liberi del rame sono $8{,}5 \cdot 10^{28}$ per metro cubo. Quanto vale la velocità di deriva, in mm/s?`, suggerimenti: [R`$v_d = \dfrac{I}{n \cdot e \cdot S}$, con $S$ in m².`, R`$2{,}5\,\text{mm}^2 = 2{,}5 \cdot 10^{-6}\,\text{m}^2$; alla fine passa ai millimetri.`], risposta: { tipo: 'numero', valore: 0.29, unita: 'mm/s', tolleranza: 0.01 }, soluzione: [R`Carica libera in un metro di cavo: $n \cdot e \cdot S = 8{,}5 \cdot 10^{28} \cdot 1{,}60 \cdot 10^{-19} \cdot 2{,}5 \cdot 10^{-6}\,\text{C/m} = 3{,}4 \cdot 10^4\,\text{C/m}$.`, R`$v_d = \dfrac{10\,\text{A}}{3{,}4 \cdot 10^4\,\text{C/m}} \approx 2{,}9 \cdot 10^{-4}\,\text{m/s}$.`, R`Cioè circa $0{,}29\,\text{mm/s}$: per un metro servono quasi un'ora.`] },
    { id: 'es-02', difficolta: 2, testo: R`Si vuole costruire una resistenza da 50 Ω con un filo di costantana ($\rho = 5 \cdot 10^{-7}\,\Omega \cdot \text{m}$) di sezione 0,2 mm². Quanto deve essere lungo il filo?`, suggerimenti: [R`Ricava $L$ dalla seconda legge di Ohm: $L = \dfrac{R \cdot S}{\rho}$.`], risposta: { tipo: 'numero', valore: 20, unita: 'm' }, soluzione: [R`$S = 0{,}2\,\text{mm}^2 = 2 \cdot 10^{-7}\,\text{m}^2$.`, R`$L = \dfrac{50\,\Omega \cdot 2 \cdot 10^{-7}\,\text{m}^2}{5 \cdot 10^{-7}\,\Omega \cdot \text{m}} = 20\,\text{m}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`A circuito aperto un voltmetro sui poli di una batteria segna 6 V. Collegata una resistenza da 4 Ω, segna 5 V. Quanto vale la resistenza interna della batteria?`, suggerimenti: [R`A circuito aperto il voltmetro legge la f.e.m.`, R`Con la resistenza collegata: $I = \dfrac{5\,\text{V}}{4\,\Omega}$; poi $r \cdot I = 1\,\text{V}$.`], risposta: { tipo: 'numero', valore: 0.8, unita: 'Ω' }, soluzione: [R`$\mathcal{E} = 6\,\text{V}$. Sulla resistenza esterna ci sono 5 V: $I = \dfrac{5\,\text{V}}{4\,\Omega} = 1{,}25\,\text{A}$.`, R`Dentro la batteria si perde 1 V: $r = \dfrac{1\,\text{V}}{1{,}25\,\text{A}} = 0{,}8\,\Omega$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Una pila ideale da 20 V alimenta una resistenza da 4 Ω, in serie con due resistenze in parallelo da 10 Ω e 15 Ω. Quanta corrente passa nella resistenza da 15 Ω?`, suggerimenti: [R`Prima il parallelo: $\dfrac{1}{R_p} = \dfrac{1}{10} + \dfrac{1}{15}$.`, R`Poi la corrente della pila, poi la tensione sul parallelo.`], risposta: { tipo: 'numero', valore: 0.8, unita: 'A' }, soluzione: [R`$\dfrac{1}{R_p} = \dfrac{3}{30} + \dfrac{2}{30} = \dfrac{1}{6}$: $R_p = 6\,\Omega$. In tutto $10\,\Omega$.`, R`$I = \dfrac{20\,\text{V}}{10\,\Omega} = 2\,\text{A}$; sul parallelo $V_p = 6\,\Omega \cdot 2\,\text{A} = 12\,\text{V}$.`, R`Nella resistenza da 15 Ω: $\dfrac{12\,\text{V}}{15\,\Omega} = 0{,}8\,\text{A}$ (e 1,2 A in quella da 10 Ω).`] },
    { id: 'es-05', difficolta: 3, testo: R`Nel circuito del disegno $\mathcal{E}_1 = 24\,\text{V}$, $R_1 = 2\,\Omega$, $\mathcal{E}_2 = 4\,\text{V}$, $R_2 = 1\,\Omega$, $R_3 = 2\,\Omega$. Con i versi delle frecce, quanto vale $I_2$?

[[grafico:kirchhoff-versi]]`, suggerimenti: [R`Nodo A: $I_1 + I_2 = I_3$.`, R`Maglie: $24\,\text{V} - 2\,\Omega \cdot I_1 - 2\,\Omega \cdot I_3 = 0$ e $4\,\text{V} - 1\,\Omega \cdot I_2 - 2\,\Omega \cdot I_3 = 0$.`, R`Ricava $I_1$ e $I_2$ in funzione di $I_3$ e sostituisci nel nodo.`], risposta: { tipo: 'numero', valore: -4, unita: 'A' }, soluzione: [R`Dalle maglie: $I_1 = 12\,\text{A} - I_3$ e $I_2 = 4\,\text{A} - 2 \cdot I_3$.`, R`Nel nodo: $16\,\text{A} - 3 \cdot I_3 = I_3$, quindi $I_3 = 4\,\text{A}$.`, R`$I_1 = 8\,\text{A}$, $I_2 = -4\,\text{A}$: nel ramo di destra la corrente va al contrario della freccia, e la pila da 4 V si ricarica.`] },
    { id: 'es-06', difficolta: 2, testo: R`Una stufetta da 1150 W funziona a 230 V. Quanto vale la resistenza del suo filo caldo?`, suggerimenti: [R`Usa $P = \dfrac{V^2}{R}$, oppure trova prima la corrente.`], risposta: { tipo: 'numero', valore: 46, unita: 'Ω' }, soluzione: [R`$I = \dfrac{P}{V} = \dfrac{1150\,\text{W}}{230\,\text{V}} = 5\,\text{A}$.`, R`$R = \dfrac{230\,\text{V}}{5\,\text{A}} = 46\,\Omega$. Controllo: $\dfrac{230^2}{46} = 1150\,\text{W}$.`] },
    { id: 'es-07', difficolta: 2, testo: R`Una linea porta 20 MW a 200 kV. I suoi fili hanno in tutto una resistenza di 4 Ω. Quanta potenza si perde nei fili, in kW?`, suggerimenti: [R`Prima la corrente: $I = P/V$.`, R`Poi le perdite: $R \cdot I^2$.`], risposta: { tipo: 'numero', valore: 40, unita: 'kW' }, soluzione: [R`$I = \dfrac{2 \cdot 10^7\,\text{W}}{2 \cdot 10^5\,\text{V}} = 100\,\text{A}$.`, R`Perdite: $4\,\Omega \cdot (100\,\text{A})^2 = 40\,000\,\text{W} = 40\,\text{kW}$, lo 0,2% della potenza.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un condensatore da 150 μF, scarico, si carica con una pila da 10 V attraverso una resistenza da 20 kΩ. Quanta carica ha dopo 3 s, in mC?`, suggerimenti: [R`Calcola $\tau = R \cdot C$: viene proprio 3 s.`, R`Dopo un tempo $\tau$ la carica è il 63% di $Q = C \cdot \mathcal{E}$.`], risposta: { tipo: 'numero', valore: 0.95, unita: 'mC', tolleranza: 0.02 }, soluzione: [R`$\tau = 2 \cdot 10^4\,\Omega \cdot 1{,}5 \cdot 10^{-4}\,\text{F} = 3\,\text{s}$.`, R`$Q = 1{,}5 \cdot 10^{-4}\,\text{F} \cdot 10\,\text{V} = 1{,}5\,\text{mC}$.`, R`$q = Q \cdot (1 - e^{-1}) \approx 0{,}632 \cdot 1{,}5\,\text{mC} \approx 0{,}95\,\text{mC}$.`] },
    { id: 'es-09', difficolta: 2, testo: R`In casa, a 230 V, sono accesi insieme un forno da 2000 W, un asciugacapelli da 1200 W e una lampada da 100 W. Quanta corrente esce dal contatore?`, suggerimenti: [R`Gli apparecchi di casa sono in parallelo: le correnti, e quindi le potenze, si sommano.`], risposta: { tipo: 'numero', valore: 14.3, unita: 'A', tolleranza: 0.1 }, soluzione: [R`Potenza totale: $2000 + 1200 + 100 = 3300\,\text{W}$.`, R`$I = \dfrac{3300\,\text{W}}{230\,\text{V}} \approx 14{,}3\,\text{A}$. È più dei 3 kW di un contratto normale.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un motorino elettrico funziona a 12 V e assorbe 5 A. I suoi avvolgimenti hanno resistenza $0{,}4\,\Omega$. Quanta potenza meccanica fornisce, se l'unica perdita è l'effetto Joule?`, suggerimenti: [R`Potenza assorbita: $V \cdot I$.`, R`Si perde in calore $R \cdot I^2$; il resto diventa lavoro.`], risposta: { tipo: 'numero', valore: 50, unita: 'W' }, soluzione: [R`Assorbe $12\,\text{V} \cdot 5\,\text{A} = 60\,\text{W}$.`, R`In calore: $0{,}4\,\Omega \cdot (5\,\text{A})^2 = 10\,\text{W}$.`, R`Potenza meccanica: $60 - 10 = 50\,\text{W}$, con un rendimento di circa l'83%.`] },
    { id: 'es-11', difficolta: 2, testo: R`Un avvolgimento di rame ha resistenza 2 Ω a 20 °C. Quanto vale a 70 °C? (Per il rame $\alpha = 4 \cdot 10^{-3}\,{}^\circ\text{C}^{-1}$.)`, suggerimenti: [R`La resistenza cambia come la resistività: $R = R_0 \cdot (1 + \alpha \cdot \Delta T)$.`], risposta: { tipo: 'numero', valore: 2.4, unita: 'Ω' }, soluzione: [R`$\Delta T = 50\,{}^\circ\text{C}$.`, R`$R = 2\,\Omega \cdot (1 + 4 \cdot 10^{-3} \cdot 50) = 2\,\Omega \cdot 1{,}2 = 2{,}4\,\Omega$.`] },
    { id: 'es-12', difficolta: 2, testo: R`Due resistenze da 30 Ω e 60 Ω sono in serie su un generatore ideale da 45 V. Un voltmetro ideale è collegato ai capi della resistenza da 60 Ω. Che cosa segna?`, suggerimenti: [R`Trova la corrente con la resistenza equivalente.`, R`Il voltmetro legge $R \cdot I$ sulla sua resistenza.`], risposta: { tipo: 'numero', valore: 30, unita: 'V' }, soluzione: [R`$R = 90\,\Omega$, $I = \dfrac{45\,\text{V}}{90\,\Omega} = 0{,}5\,\text{A}$.`, R`Sulla resistenza da 60 Ω: $60\,\Omega \cdot 0{,}5\,\text{A} = 30\,\text{V}$; sull'altra i restanti 15 V.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`A che cosa equivale un ampere?`, opzioni: [R`Un joule per coulomb`, R`Un coulomb al secondo`, R`Un watt per secondo`, R`Un ohm per volt`], corretta: 1, spiegazione: R`La corrente è carica divisa tempo: $1\,\text{A} = 1\,\text{C/s}$. Il joule per coulomb è il volt; l'ohm per volt è l'inverso di un ampere.` },
    { id: 'q-02', domanda: R`Nel circuito esterno a una pila, che verso ha la corrente convenzionale?`, opzioni: [R`Dal polo + al polo −`, R`Dal polo − al polo +`, R`Lo stesso degli elettroni`, R`Cambia verso di continuo`], corretta: 0, spiegazione: R`Per convenzione la corrente va come andrebbero cariche positive: esce dal +, gira e rientra dal −. Gli elettroni vanno al contrario. Una pila dà corrente continua, che non cambia verso.` },
    { id: 'q-03', domanda: R`Che cosa «consuma» una lampadina accesa?`, opzioni: [R`La corrente: dopo la lampadina ce n'è meno`, R`Le cariche: prima o poi la pila le esaurisce`, R`La tensione: dopo la lampadina la corrente si ferma`, R`L'energia: le cariche la cedono al filamento`], corretta: 3, spiegazione: R`La corrente che esce è uguale a quella che entra e le cariche non spariscono. Le cariche cedono al filamento l'energia ricevuta dalla pila, che diventa luce e calore.` },
    { id: 'q-04', domanda: R`In un filo di rame di casa, quanto vale più o meno la velocità di deriva degli elettroni?`, opzioni: [R`Circa 300 000 km/s`, R`Circa 340 m/s`, R`Frazioni di millimetro al secondo`, R`Circa 1 m/s`], corretta: 2, spiegazione: R`Il rame ha moltissimi elettroni liberi: per fare la corrente basta che avanzino di meno di un millimetro al secondo. Alla velocità della luce corre la spinta del campo, non gli elettroni; 340 m/s è il suono.` },
    { id: 'q-05', domanda: R`Perché la lampadina si accende subito quando chiudi l'interruttore?`, opzioni: [R`Perché gli elettroni corrono quasi alla velocità della luce`, R`Il filo è già pieno di elettroni: parte subito la spinta del campo`, R`Perché la lampadina ha una sua riserva di cariche, pronta a partire`, R`Perché l'interruttore lancia gli elettroni con molta energia verso la lampadina`], corretta: 1, spiegazione: R`Gli elettroni sono lentissimi, ma il circuito ne è già pieno. Il campo elettrico si propaga quasi alla velocità della luce e li mette in moto quasi tutti insieme, anche quelli del filamento.` },
    { id: 'q-06', domanda: R`Che forma ha il grafico tensione–corrente di un conduttore ohmico?`, opzioni: [R`Una parabola`, R`Una retta orizzontale`, R`Una curva che si piega verso l'alto`, R`Una retta che passa per l'origine`], corretta: 3, spiegazione: R`Da $V = R \cdot I$ con $R$ costante: proporzionalità diretta, una retta per l'origine. La curva che si piega è quella di una lampadina, che non è ohmica.` },
    { id: 'q-07', domanda: R`Si sostituisce un filo con uno dello stesso metallo e della stessa lunghezza, ma di diametro doppio. La resistenza…`, opzioni: [R`si dimezza`, R`resta uguale`, R`diventa un quarto`, R`raddoppia`], corretta: 2, spiegazione: R`Con il diametro doppio l'area della sezione diventa quattro volte più grande. Da $R = \rho \cdot L / S$ la resistenza diventa un quarto, non la metà.` },
    { id: 'q-08', domanda: R`Che cos'è la forza elettromotrice di una pila?`, opzioni: [R`La tensione fra i poli a circuito aperto`, R`La forza, in newton, che spinge gli elettroni`, R`La corrente massima che può dare`, R`La carica che contiene quando è nuova`], corretta: 0, spiegazione: R`È l'energia data a ogni coulomb, e si misura in volt: non è una forza. La corrente massima è quella di corto circuito, $\mathcal{E}/r$. E la pila non è un serbatoio di cariche.` },
    { id: 'q-09', domanda: R`Due lampadine sono in serie su una pila. Una si brucia. Che cosa fa l'altra?`, opzioni: [R`Brilla di più`, R`Resta uguale`, R`Si spegne`, R`Brilla meno`], corretta: 2, spiegazione: R`In serie c'è una sola strada: se un filamento si interrompe, il circuito è aperto e la corrente si ferma ovunque. In parallelo l'altra resterebbe accesa come prima.` },
    { id: 'q-10', domanda: R`Una resistenza da 10 Ω e una da 1000 Ω sono collegate in parallelo. La resistenza equivalente è…`, opzioni: [R`circa 505 Ω`, R`1010 Ω`, R`poco più di 10 Ω`, R`poco meno di 10 Ω`], corretta: 3, spiegazione: R`In parallelo la resistenza equivalente è minore della più piccola: $\dfrac{1}{R} = 0{,}1 + 0{,}001$, $R \approx 9{,}9\,\Omega$. 1010 Ω è la serie; la media non c'entra.` },
    { id: 'q-11', domanda: R`Come si collega un amperometro, e come deve essere la sua resistenza?`, opzioni: [R`In parallelo, con resistenza piccolissima`, R`In serie, con resistenza piccolissima`, R`In serie, con resistenza grandissima`, R`In parallelo, con resistenza grandissima`], corretta: 1, spiegazione: R`Deve essere attraversato dalla corrente da misurare, quindi va in serie; e non deve frenarla, quindi la sua resistenza è piccolissima. In parallelo con resistenza grandissima va il voltmetro.` },
    { id: 'q-12', domanda: R`Quale principio esprime la legge delle maglie di Kirchhoff?`, opzioni: [R`La conservazione dell'energia`, R`La conservazione della carica`, R`La conservazione della quantità di moto`, R`La proporzionalità fra tensione e corrente`], corretta: 0, spiegazione: R`Una carica che fa il giro di una maglia torna allo stesso potenziale: l'energia guadagnata nei generatori è uguale a quella persa nelle resistenze. La conservazione della carica è la legge dei nodi; la proporzionalità è la legge di Ohm.` },
    { id: 'q-13', domanda: R`Perché l'energia elettrica viaggia sulle linee ad alta tensione?`, opzioni: [R`Perché così l'energia arriva più in fretta alle città lontane`, R`Perché gli elettroni vanno più veloci e si perdono meno per strada`, R`Perché l'alta tensione non si disperde nell'aria intorno ai fili`, R`Perché a parità di potenza la corrente è minore`], corretta: 3, spiegazione: R`Con $P = V \cdot I$ fissata, tensione alta vuol dire corrente bassa. Le perdite $R \cdot I^2$ calano con il quadrato della corrente. La velocità dell'energia o degli elettroni non c'entra.` },
    { id: 'q-14', domanda: R`Nella stessa resistenza la corrente raddoppia. La potenza dissipata…`, opzioni: [R`raddoppia`, R`resta uguale`, R`diventa quattro volte tanto`, R`si dimezza`], corretta: 2, spiegazione: R`$P = R \cdot I^2$: con $R$ fissa la potenza va con il quadrato della corrente. Raddoppia anche la tensione, e $V \cdot I$ diventa quattro volte tanto.` },
    { id: 'q-15', domanda: R`Un condensatore si carica attraverso una resistenza. Dopo un tempo $\tau = R \cdot C$, a che punto è?`, opzioni: [R`Al 50% della carica finale`, R`Al 63% della carica finale`, R`Al 100%: è carico`, R`Al 37% della carica finale`], corretta: 1, spiegazione: R`$q = Q \cdot (1 - e^{-1}) \approx 0{,}63 \cdot Q$. Il 37% è quello che manca, ed è anche la frazione di corrente rimasta. Il condensatore non arriva mai del tutto a $Q$.` },
    { id: 'q-16', domanda: R`In una soluzione di acqua e sale, chi porta la corrente?`, opzioni: [R`Gli ioni positivi e negativi, in versi opposti`, R`Gli elettroni, che attraversano il liquido`, R`Solo gli ioni positivi`, R`Le molecole d'acqua`], corretta: 0, spiegazione: R`Gli ioni $\text{Na}^+$ vanno verso l'elettrodo negativo, i $\text{Cl}^-$ verso il positivo: per la corrente è lo stesso verso. Gli elettroni si scambiano solo sugli elettrodi, e l'acqua pura quasi non conduce.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`La corrente non si consuma: quella che esce da una lampadina è uguale a quella che entra. Si consuma energia.` },
    { tipo: 'errore', testo: R`Le sezioni dei fili sono in mm², ma nella seconda legge di Ohm vanno in m²: $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$.` },
    { tipo: 'errore', testo: R`Nel parallelo, dopo aver sommato gli inversi, ricordati di capovolgere: hai trovato $1/R$, non $R$.` },
    { tipo: 'trucco', testo: R`Due resistenze uguali in parallelo valgono la metà di una. E il parallelo è sempre minore della resistenza più piccola: usalo come controllo.` },
    { tipo: 'trucco', testo: R`Per la potenza scegli la formula con i dati che hai: $V \cdot I$, $R \cdot I^2$ oppure $V^2/R$. Nelle perdite di una linea usa sempre $R \cdot I^2$.` },
    { tipo: 'metodo', testo: R`Nei circuiti misti si parte dal pezzo più interno: prima i paralleli, poi le serie, poi la corrente della pila. Poi si torna indietro ramo per ramo.` },
    { tipo: 'metodo', testo: R`Con Kirchhoff scegli i versi delle correnti all'inizio e non cambiarli più. Una corrente negativa va solo al contrario della freccia.` },
    { tipo: 'trucco', testo: R`Nel circuito RC ricorda tre numeri: 63% dopo $\tau$, 86% dopo $2 \cdot \tau$, 99% dopo $5 \cdot \tau$.` }
  ],
  aneddoti: [
    { fisico: 'Alessandro Volta', anni: '1745–1827', titolo: 'La lettera spedita in due parti', testo: R`Il 20 marzo 1800 Alessandro Volta, professore a Pavia, scrisse da Como a Joseph Banks, presidente della Royal Society di Londra. Descriveva un apparecchio nuovo: dischi di zinco e d'argento impilati, separati da cartoni bagnati in acqua salata. Lo chiamava «organo elettrico artificiale»: dava corrente senza strofinare niente. In Europa c'era la guerra, e Volta spedì la lettera in due parti. In attesa della seconda, Banks fece vedere la prima al chirurgo Anthony Carlisle. Con l'amico William Nicholson, Carlisle costruì subito una pila. Ai primi di maggio i due immersero i fili nell'acqua e videro salire bollicine di gas: l'acqua si scomponeva. La lettera di Volta fu letta alla Royal Society solo il 26 giugno.`, legame: R`È la nascita del generatore di corrente continua, e della prima elettrolisi.` },
    { fisico: 'Georg Simon Ohm', anni: '1789–1854', titolo: 'La legge che in Germania non piacque', testo: R`Georg Simon Ohm insegnava matematica e fisica al ginnasio di Colonia. Nel tempo libero misurava la corrente in fili di lunghezze diverse. Le pile del tempo però davano correnti che calavano in pochi minuti, e i conti non tornavano. Su consiglio del fisico Johann Christian Poggendorff provò una termocoppia: due metalli saldati, con una giunzione nell'acqua bollente e l'altra nel ghiaccio. La sua tensione restava stabile. Nel 1827 Ohm pubblicò la legge in un libro sul circuito galvanico trattato con la matematica. In Germania fu accolto con freddezza. Ohm lasciò Colonia e per alcuni anni insegnò in una scuola militare a Berlino. Il riconoscimento arrivò da Londra: nel 1841 la Royal Society gli assegnò la medaglia Copley.`, legame: R`È la prima legge di Ohm, $V = R \cdot I$, e la dipendenza della resistenza dalla lunghezza del filo.` },
    { fisico: 'Gustav Kirchhoff', anni: '1824–1887', titolo: 'Le leggi scritte da uno studente', testo: R`Nel 1845 Gustav Kirchhoff aveva ventun anni ed era studente all'Università di Königsberg, in Prussia. Frequentava il seminario di fisica di Franz Neumann. Studiando come la corrente si distribuisce in una lastra di metallo, trovò le due regole per i circuiti con più rami: quella dei nodi e quella delle maglie. Le pubblicò lo stesso anno negli *Annalen der Physik*. Da allora qualunque circuito si può risolvere con un sistema di equazioni. Kirchhoff però non si fermò ai circuiti. Quindici anni dopo, a Heidelberg, lavorò con il chimico Robert Bunsen sulla luce delle fiamme. Scomponendola con un prisma, i due scoprirono due elementi nuovi: il cesio nel 1860 e il rubidio l'anno dopo.`, legame: R`Sono le leggi dei nodi e delle maglie, con cui si risolve ogni circuito.` },
    { fisico: 'Humphry Davy', anni: '1778–1829', titolo: 'Le palline di metallo che prendevano fuoco', testo: R`Nell'ottobre del 1807, alla Royal Institution di Londra, Humphry Davy collegò una grande pila a un pezzetto di potassa. Era una sostanza che nessuno era mai riuscito a scomporre. La potassa era appena inumidita, perché conducesse. Dove toccava il filo negativo comparvero palline lucide come il mercurio. Alcune prendevano fuoco con una fiammella viva. Era un metallo mai visto: il potassio. Pochi giorni dopo, partendo dalla soda, ottenne il sodio. Il cugino Edmund, che lo aiutava, raccontò che Davy si mise a saltare per la stanza dalla gioia. Con lo stesso metodo, l'anno dopo, ottenne anche il calcio, il bario, lo stronzio e il magnesio.`, legame: R`È l'elettrolisi: la corrente che, sugli elettrodi, separa una sostanza nei suoi elementi.` },
    { fisico: 'Heike Kamerlingh Onnes', anni: '1853–1926', titolo: '«Mercurio praticamente zero» nel quaderno di Leida', testo: R`Nel 1908, a Leida, Heike Kamerlingh Onnes riuscì per primo a liquefare l'elio, a circa 4 K. Con quel freddo poteva studiare i metalli come nessuno prima. Che cosa fa la resistenza vicino allo zero assoluto? Alcuni pensavano che si annullasse, altri che risalisse. Onnes scelse il mercurio, che si purifica bene distillandolo. L'8 aprile 1911, a circa 3 K, la resistenza del filo di mercurio non si misurava più. Nel quaderno annotò in olandese «Kwik nagenoeg nul»: mercurio praticamente zero. Nei mesi dopo, con il giovane Gilles Holst e i tecnici del laboratorio, vide che spariva di colpo, poco sotto 4,2 K. Era la superconduttività. Nel 1913 Onnes ricevette il premio Nobel.`, legame: R`I superconduttori hanno resistenza zero: nella seconda legge di Ohm, una resistività che si annulla.` }
  ]
});
})();
