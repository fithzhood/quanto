/* Quanto — Grandezze e misure (misure, primo anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/misure.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'misure',
  titolo: 'Grandezze e misure',
  introduzione: R`La fisica studia i fenomeni della natura con i **numeri**. Per avere dei numeri bisogna misurare: lunghezze, masse, tempi. Ma che cosa vuol dire misurare, e come si scrive una misura?

Le misure si incontrano ogni giorno. Il cartello stradale dice 50 km/h, la bottiglia contiene 1,5 L, il pacco di pasta 500 g. Ogni volta ci sono un numero e un'unità di misura. Impareremo a passare da un'unità all'altra e a scrivere numeri piccolissimi e grandissimi. Poi useremo tutto questo per la densità, che dice quanta massa sta in un certo volume.

Non serve sapere già della fisica. Bastano le quattro operazioni, le frazioni e le potenze. È l'argomento da cui partono tutti gli altri.`,
  inBreve: [
    R`Una **misura** è un numero seguito da un'unità: dice quante volte l'unità sta nella grandezza. Un numero senza unità non è una misura.`,
    R`Nel **Sistema Internazionale** le grandezze di base sono sette. Le prime tre sono lunghezza, massa e tempo: metro, chilogrammo e secondo.`,
    R`In **notazione scientifica** un numero si scrive $a \cdot 10^n$, con $1 \le a < 10$. L'**ordine di grandezza** è la potenza di 10 più vicina.`,
    R`Per cambiare unità si moltiplica per **fattori che valgono 1**. Nelle aree il fattore va al quadrato, nei volumi al cubo, e $1\,\text{L} = 1\,\text{dm}^3$.`,
    R`La **densità** è $d = \dfrac{m}{V}$. L'acqua ha $1000\,\text{kg/m}^3$, cioè $1\,\text{g/cm}^3$: un litro ha massa 1 kg.`,
    R`Il **metodo sperimentale** ha quattro passi: domanda, ipotesi, esperimento, legge.`
  ],
  sezioni: [
    {
      id: 'misurare',
      titolo: 'Misurare è confrontare',
      testo: R`Quanto è lungo il banco? Si può rispondere «quattro spanne» oppure «un metro e venti». In tutti e due i casi si fa la stessa cosa. Si confronta il banco con una lunghezza scelta prima.

Una **grandezza fisica** è una proprietà che si può misurare: la lunghezza, la massa, il tempo, la temperatura. La bellezza di un quadro non è una grandezza fisica. Non esiste uno strumento che la misuri.

[[video:misure/misurare]]

Per misurare si sceglie un **campione**, cioè un oggetto di riferimento. Poi si conta quante volte il campione sta nella grandezza. Se una matita sta 10 volte nel tavolo, il tavolo è lungo 10 matite.

Con una matita più corta il numero cambia: 16 invece di 10. Il tavolo è lo stesso, ma il risultato dipende dal campione. Per capirsi serve un campione uguale per tutti: l'**unità di misura**. Per le lunghezze è il metro.

>* **Misurare** una grandezza vuol dire confrontarla con l'unità di misura e dire quante volte la contiene. La **misura** è un numero seguito dall'unità: $2\,\text{m}$, $1{,}5\,\text{kg}$, $30\,\text{s}$.

>! Un numero senza unità non è una misura. «Il tavolo è lungo 2» non dice niente: 2 metri, 2 matite o 2 spanne? Nei conti di fisica l'unità si scrive sempre, accanto al numero.

Lo **strumento** di misura fa il confronto al posto nostro. Il righello porta già segnati i centimetri e i millimetri. La bilancia confronta una massa con delle masse campione. Il cronometro conta i secondi.

?? Marco misura il corridoio e trova 12 passi. Anna lo misura e trova 15 passi. Chi ha sbagliato?
[ ] Marco, perché il suo numero è più piccolo
[ ] Anna, perché il suo numero è più grande
[x] forse nessuno: i loro passi sono campioni diversi
=> Il passo di Anna è più corto, quindi ci sta più volte. Il campione cambia da persona a persona: per questo si usa il metro, uguale per tutti.`
    },
    {
      id: 'si',
      titolo: 'Il Sistema Internazionale',
      testo: R`Fino al Settecento ogni città aveva le sue unità: braccia, piedi, libbre, once. Il braccio di Firenze era diverso da quello di Milano. Commerciare e confrontare le misure era un problema continuo.

Durante la Rivoluzione francese nacque il **sistema metrico decimale**, con il metro e il chilogrammo. Nel 1960 è diventato il **Sistema Internazionale di unità**, in breve SI. Oggi lo usano quasi tutti i paesi del mondo.

>* Nel SI ci sono sette **grandezze fondamentali**, ognuna con la sua unità. Tutte le altre grandezze si ricavano da queste: sono le **grandezze derivate**.

| grandezza | unità (simbolo) |
|---|---|
| lunghezza | metro (m) |
| massa | chilogrammo (kg) |
| tempo | secondo (s) |
| intensità di corrente | ampere (A) |
| temperatura | kelvin (K) |
| quantità di sostanza | mole (mol) |
| intensità luminosa | candela (cd) |

Nel primo anno servono soprattutto le prime tre: metro, chilogrammo e secondo.

Le unità derivate nascono da quelle di base. Una velocità è una lunghezza divisa per un tempo: si misura in $\text{m/s}$. Un'area è una lunghezza per una lunghezza: $\text{m}^2$. Una forza si misura in newton, e $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$.

Oggi le unità sono legate a fenomeni che non cambiano mai. Il secondo si conta con gli orologi atomici. Il metro è la strada che la luce fa nel vuoto in una piccolissima frazione di secondo. Dal 2019 anche il chilogrammo dipende da una costante della natura.

>! I simboli delle unità hanno maiuscole e minuscole precise, e non vogliono il punto. Si scrive kg, non Kg o kgr. Si scrive s, non sec. Si scrive m, non mt.

Il simbolo va dopo il numero, con uno spazio in mezzo: 5 kg, 20 m/s. Il nome dell'unità invece si scrive in lettere: cinque chilogrammi.

?? Quale di queste è una grandezza fondamentale del SI?
[ ] la velocità
[ ] l'area
[x] il tempo
[ ] la forza
=> Il tempo, in secondi, è una delle sette grandezze di base. Velocità, area e forza si ricavano da lunghezza, massa e tempo: sono derivate.`
    },
    {
      id: 'notazione',
      titolo: 'Notazione scientifica e prefissi',
      testo: R`Un atomo è largo circa 0,0000000001 m. La Terra ha un diametro di circa 12 700 000 m. Con tanti zeri è facile sbagliare a contarli. Per questo in fisica si usano le **potenze di 10**.

Ricordiamo che $10^3 = 1000$: un 1 seguito da tre zeri. Con l'esponente negativo si va sotto l'unità: $10^{-3} = 0{,}001$, cioè un millesimo.

[[video:misure/potenze-di-dieci]]

>* Un numero è in **notazione scientifica** quando è scritto come $a \cdot 10^n$. Il numero $a$ ha una sola cifra prima della virgola, diversa da zero: $1 \le a < 10$. L'esponente $n$ è un numero intero.

Per scriverlo si sposta la virgola fino ad avere una sola cifra davanti. Ogni posto verso sinistra aggiunge 1 all'esponente. Ogni posto verso destra toglie 1.

~ 0{,}00007\,\text{m} :: lo spessore di un capello, come nel video
~ = 7 \cdot \evid{0{,}00001}\,\text{m} :: 0,00007 è 7 volte un centomillesimo
~ = \evidb{7 \cdot 10^{-5}\,\text{m}} :: un centomillesimo è $10^{-5}$: la virgola va di 5 posti verso destra

Allo stesso modo $12\,700\,000\,\text{m} = 1{,}27 \cdot 10^7\,\text{m}$: qui la virgola va di 7 posti verso sinistra, e l'esponente è $+7$.

Con le potenze di 10 i conti diventano facili. Nel prodotto gli esponenti si sommano: $10^3 \cdot 10^4 = 10^7$. Nel quoziente si sottraggono: $10^8 : 10^2 = 10^6$.

Alcune potenze di 10 hanno un nome: sono i **prefissi** delle unità.

| prefisso | simbolo | vale |
|---|---|---|
| giga | G | $10^9$ |
| mega | M | $10^6$ |
| chilo | k | $10^3$ |
| etto | h | $10^2$ |
| deca | da | $10^1$ |
| deci | d | $10^{-1}$ |
| centi | c | $10^{-2}$ |
| milli | m | $10^{-3}$ |
| micro | μ | $10^{-6}$ |
| nano | n | $10^{-9}$ |

Così $3\,\text{km} = 3 \cdot 10^3\,\text{m}$ e $5\,\text{mg} = 5 \cdot 10^{-3}\,\text{g}$. L'etto del salumiere è un ettogrammo: 100 g.

>! $25 \cdot 10^4$ non è in notazione scientifica, perché davanti ci sono due cifre. Si scrive $2{,}5 \cdot 10^5$.

>! Attenzione alle maiuscole. La m minuscola è milli, la M maiuscola è mega: fra le due c'è un fattore un miliardo.

?? Come si scrive 0,0045 m in notazione scientifica?
[ ] $45 \cdot 10^{-4}\,\text{m}$
[x] $4{,}5 \cdot 10^{-3}\,\text{m}$
[ ] $4{,}5 \cdot 10^{3}\,\text{m}$
=> La virgola si sposta di 3 posti verso destra, quindi l'esponente è $-3$. Con 45 davanti ci sono due cifre. Con l'esponente $+3$ il numero sarebbe 4500 m.`
    },
    {
      id: 'ordine-grandezza',
      titolo: 'Ordini di grandezza e stime',
      testo: R`A volte non serve il valore preciso. Basta sapere se una cosa è grande come un dito, come una casa o come una montagna. Per questo si usa l'**ordine di grandezza**.

>* L'**ordine di grandezza** di un numero è la potenza di 10 più vicina a quel numero.

Per non sbagliare si usa una **regola pratica**. Si scrive il numero in notazione scientifica, $a \cdot 10^n$, e si guarda $a$. Se $a$ è minore di 5, l'ordine di grandezza è $10^n$. Se $a$ è 5 o più, si sale alla potenza dopo: $10^{n+1}$.

~ 8800\,\text{m} = 8{,}8 \cdot 10^3\,\text{m} :: l'altezza dell'Everest, in notazione scientifica
~ 8{,}8 \ge 5 :: il numero davanti è più vicino a 10 che a 1
~ \text{ordine di grandezza: } \evidb{10^4\,\text{m}} :: si sale alla potenza successiva

Una persona alta 1,7 m ha ordine di grandezza $10^0\,\text{m} = 1\,\text{m}$, perché 1,7 è minore di 5. Un capello, spesso $7 \cdot 10^{-5}\,\text{m}$, ha ordine $10^{-4}\,\text{m}$.

[[grafico:scala]]

Fra l'atomo e la Terra ci sono 17 ordini di grandezza: la Terra è circa $10^{17}$ volte più grande. Ogni ordine di grandezza in più vuol dire dieci volte di più.

Gli ordini di grandezza servono a fare **stime**. Una stima è un conto veloce, con numeri arrotondati, per sapere più o meno quanto vale una cosa. Quanti secondi ci sono in un anno?

~ 365 \cdot 24 \cdot 3600\,\text{s} :: giorni, per ore in un giorno, per secondi in un'ora
~ \approx 3{,}2 \cdot 10^7\,\text{s} :: il conto preciso dà 31 536 000 s
~ \text{ordine di grandezza: } \evidb{10^7\,\text{s}} :: perché 3,2 è minore di 5

>! Due numeri con lo stesso ordine di grandezza possono essere molto diversi. 2000 m e 4000 m hanno tutti e due ordine $10^3\,\text{m}$, ma uno è il doppio dell'altro. L'ordine dice solo la «taglia».

> Prima di ogni conto, fai una stima. Se il risultato è lontano dalla stima di molti ordini di grandezza, c'è un errore.

?? Qual è l'ordine di grandezza di 0,006 m?
[ ] $10^{-3}\,\text{m}$
[x] $10^{-2}\,\text{m}$
[ ] $10^{3}\,\text{m}$
=> In notazione scientifica è $6 \cdot 10^{-3}\,\text{m}$. Il 6 è maggiore di 5, quindi si sale a $10^{-2}\,\text{m}$: un centimetro.`
    },
    {
      id: 'equivalenze',
      titolo: 'Le equivalenze: cambiare unità',
      testo: R`Un'auto va a 72 km/h. Quanti metri fa in un secondo? Per rispondere bisogna cambiare unità di misura: bisogna fare un'**equivalenza**.

Il trucco è uno solo. 1 km e 1000 m sono la stessa lunghezza, scritta in due modi. Quindi la frazione $\dfrac{1000\,\text{m}}{1\,\text{km}}$ vale esattamente 1. Moltiplicare per 1 non cambia una grandezza: cambia solo il modo di scriverla.

>* Per cambiare unità si moltiplica per **fattori di conversione**. Sono frazioni che valgono 1, come $\dfrac{1000\,\text{m}}{1\,\text{km}}$ o $\dfrac{1\,\text{h}}{3600\,\text{s}}$. Le unità si semplificano come lettere.

[[video:misure/equivalenze]]

~ 72\,\dfrac{\text{km}}{\text{h}} :: 72 chilometri in un'ora
~ = 72\,\dfrac{\text{km}}{\text{h}} \cdot \dfrac{1000\,\text{m}}{1\,\text{km}} \cdot \dfrac{1\,\text{h}}{3600\,\text{s}} :: due fattori che valgono 1: i km e le h si semplificano
~ = \dfrac{72 \cdot 1000}{3600}\,\dfrac{\text{m}}{\text{s}} :: restano i metri sopra e i secondi sotto
~ = \evidb{20\,\text{m/s}} :: in ogni secondo l'auto fa 20 metri

Moltiplicare per 1000 e dividere per 3600 è come dividere per 3,6. Quindi da km/h a m/s si divide per 3,6. Da m/s a km/h si moltiplica per 3,6.

L'unità da eliminare va scritta nel fattore dalla parte opposta. Se i km stanno sopra, nel fattore i km devono stare sotto.

Per il tempo bisogna stare attenti, perché non è decimale. Un'ora ha 60 minuti e un minuto ha 60 secondi.

>! 1,5 h non è 1 ora e 50 minuti. È un'ora e mezza: $1{,}5\,\text{h} = 1{,}5 \cdot 60\,\text{min} = 90\,\text{min}$, cioè 1 h e 30 min.

> Nel 1999 la sonda Mars Climate Orbiter andò perduta vicino a Marte. Un programma dava i numeri in unità inglesi. Un altro li leggeva come se fossero unità del SI. Un'equivalenza mancata costò l'intera missione.

?? Per trasformare 5 h in secondi, per quale fattore moltiplichi?
[ ] $\dfrac{1\,\text{h}}{3600\,\text{s}}$
[x] $\dfrac{3600\,\text{s}}{1\,\text{h}}$
[ ] $\dfrac{60\,\text{s}}{1\,\text{h}}$
=> Le ore stanno sopra, quindi nel fattore devono stare sotto. In un'ora ci sono 3600 s, non 60. Così $5\,\text{h} = 5 \cdot 3600\,\text{s} = 18\,000\,\text{s}$.`
    },
    {
      id: 'aree-volumi',
      titolo: 'Aree, volumi e litri',
      testo: R`Quanti decimetri quadrati ci sono in un metro quadrato? Viene da rispondere 10, perché un metro è lungo 10 decimetri. È sbagliato, e il disegno lo mostra.

Un quadretto di lato 1 dm è un **decimetro quadrato**, 1 dm². Dieci quadretti in fila fanno solo una striscia, lunga un metro e alta un decimetro. Per coprire tutto il metro quadrato servono 10 strisce.

[[grafico:quadretti]]

$$1\,\text{m}^2 = 10 \cdot 10\,\text{dm}^2 = 100\,\text{dm}^2$$

Con i volumi succede la stessa cosa, ma le dimensioni sono tre. Un cubetto di lato 1 dm è un **decimetro cubo**. Sul fondo di un metro cubo stanno 100 cubetti, e gli strati sono 10.

$$1\,\text{m}^3 = 1000\,\text{dm}^3$$

[[video:misure/aree-volumi]]

>* Nelle aree il fattore di conversione delle lunghezze va **al quadrato**, nei volumi va **al cubo**. Da m a dm si moltiplica per 10. Da m² a dm² per $10^2 = 100$, da m³ a dm³ per $10^3 = 1000$.

Per i liquidi si usa il **litro**, che è proprio un decimetro cubo. Un millilitro è un centimetro cubo.

$$1\,\text{L} = 1\,\text{dm}^3 \qquad 1\,\text{mL} = 1\,\text{cm}^3$$

$$1\,\text{m}^3 = 1000\,\text{dm}^3 = 1000\,\text{L}$$

Esempio. Un acquario è largo 50 cm, profondo 40 cm e alto 30 cm. Quanti litri contiene?

~ 50\,\text{cm} = 5\,\text{dm} :: conviene passare ai decimetri: lo stesso per 40 cm = 4 dm e 30 cm = 3 dm
~ V = 5\,\text{dm} \cdot 4\,\text{dm} \cdot 3\,\text{dm} = 60\,\text{dm}^3 :: il volume del parallelepipedo
~ V = \evidb{60\,\text{L}} :: un decimetro cubo è un litro

>! Un metro quadrato non sono 10 dm², e un metro cubo non sono 10 dm³. Prima di convertire chiediti: quante dimensioni ha questa grandezza?

?? Quanti centimetri quadrati ci sono in un metro quadrato?
[ ] 100
[ ] 1000
[x] 10 000
=> Un metro è lungo 100 cm. Nelle aree il fattore va al quadrato: $100^2 = 10\,000$. Quindi $1\,\text{m}^2 = 10\,000\,\text{cm}^2$.`
    },
    {
      id: 'densita',
      titolo: 'La densità',
      testo: R`Pesa di più un chilo di piume o un chilo di ferro? È un trabocchetto: un chilo è un chilo. Sulla bilancia a due piatti stanno in equilibrio, perché hanno la stessa massa.

Però occupano spazi diversissimi. Il ferro sta in un cubetto di circa 5 cm di lato. Le piume riempiono una cassa di circa 74 cm di lato. Il ferro è molto più **denso**: nello stesso volume c'è molta più massa.

[[video:misure/densita]]

>* La **densità** di una sostanza è il rapporto fra la massa e il volume: $d = \dfrac{m}{V}$. Nel SI si misura in $\text{kg/m}^3$, cioè chilogrammi per ogni metro cubo.

Un litro d'acqua ha massa 1 kg. Un litro è un millesimo di metro cubo, quindi:

~ d = \dfrac{m}{V} :: la definizione
~ d = \dfrac{1\,\text{kg}}{0{,}001\,\text{m}^3} :: un litro d'acqua: 1 kg in un decimetro cubo
~ d = \evidb{1000\,\text{kg/m}^3} :: mille chilogrammi in ogni metro cubo

In laboratorio si usa anche il $\text{g/cm}^3$. L'acqua ha $1\,\text{g/cm}^3$, e $1\,\text{g/cm}^3 = 1000\,\text{kg/m}^3$.

| sostanza | densità ($\text{kg/m}^3$) |
|---|---|
| aria | 1,2 |
| ghiaccio | 917 |
| acqua | 1000 |
| alluminio | 2700 |
| ferro | 7870 |
| oro | 19 300 |

La densità dipende dalla **sostanza**, non dalla grandezza dell'oggetto. Un chiodo e una trave di ferro hanno la stessa densità. Dalla formula si ricavano anche le altre due grandezze: $m = d \cdot V$ e $V = \dfrac{m}{d}$.

Nel grafico massa–volume ogni sostanza è una retta che parte dall'origine. Più la retta è ripida, più la sostanza è densa.

[[grafico:massa-volume]]

Un corpo meno denso dell'acqua galleggia. Quando l'acqua gela, la massa resta la stessa ma il volume cresce di circa il 9%. Per questo il ghiaccio è meno denso dell'acqua, e galleggia.

>! «Il ferro pesa più del legno», detto così, è sbagliato: un tronco pesa molto più di un chiodo. Si deve dire che il ferro è più denso. A parità di volume ha più massa.

?? Si taglia a metà un cubo di alluminio. Che cosa succede alla densità di ogni metà?
[ ] si dimezza
[x] resta uguale
[ ] raddoppia
=> Si dimezzano sia la massa sia il volume, e il loro rapporto non cambia. La densità è una proprietà della sostanza, non del pezzo.`
    },
    {
      id: 'metodo',
      titolo: 'Il metodo sperimentale',
      testo: R`La fisica non si accontenta di dire che una palla, cadendo, va «sempre più veloce». Vuole sapere *come*, con i numeri. Galileo Galilei fu tra i primi a lavorare così.

Una palla lasciata cadere è troppo svelta per misurarla a occhio. Galileo la rallentò: la fece rotolare lungo un piano poco inclinato. Così il moto durava di più, e si poteva misurare.

[[video:misure/metodo]]

Il suo lavoro segue quattro passi. Ancora oggi sono il cuore della fisica.

1. **Domanda.** Come cresce con il tempo la strada percorsa dalla palla?
2. **Ipotesi.** La velocità cresce come il tempo. Se è così, la strada deve crescere come il quadrato del tempo.
3. **Esperimento.** Si misura dove si trova la palla dopo 1, 2, 3, 4 secondi. Galileo misurava i tempi con un orologio ad acqua: pesava l'acqua uscita da un recipiente.
4. **Legge.** Se le misure confermano l'ipotesi, si scrive la legge con una formula.

Nel video la palla fa 0,3 m nel primo secondo, 1,2 m in due secondi, 2,7 m in tre. Tempo doppio, strada quattro volte. Tempo triplo, strada nove volte. La strada divisa per il tempo al quadrato dà sempre lo stesso numero: 0,3 m/s². La legge è $s = 0{,}3\,\text{m/s}^2 \cdot t^2$.

[[grafico:galileo]]

Una legge serve a **prevedere**. Dove sarà la palla dopo 3,5 s?

~ s = 0{,}3\,\text{m/s}^2 \cdot t^2 :: la legge trovata con le misure
~ s = 0{,}3\,\text{m/s}^2 \cdot (3{,}5\,\text{s})^2 :: i secondi al quadrato si semplificano
~ s = 0{,}3 \cdot 12{,}25\,\text{m} \approx \evidb{3{,}7\,\text{m}} :: si rifà la prova, e la palla passa proprio lì

>* Il **metodo sperimentale** è fatto di domanda, ipotesi, esperimento e legge. Una **legge fisica** è una relazione fra grandezze misurabili. Resta valida finché gli esperimenti la confermano.

>! Una legge non è vera «per sempre». Se un esperimento nuovo e ben fatto la smentisce, la legge va corretta o cambiata.

?? Galileo ipotizza che la strada cresca come il quadrato del tempo. Qual è il passo successivo del metodo?
[ ] scrivere subito la legge
[x] fare un esperimento e misurare
[ ] chiedere il parere dei filosofi
=> Un'ipotesi diventa legge solo dopo che le misure l'hanno confermata. Il parere di un'autorità, da solo, non basta: decide l'esperimento.`
    }
  ],
  grafici: {
    /* la scala delle potenze di 10, come lo zoom del video: la posizione di ogni cosa è log10 della sua misura in metri */
    scala: {
      tipo: 'piano', x: [0, 10], y: [-11, 8.6], assi: false, griglia: false, proporzioni: 'libere', altezza: 720,
      elementi: [
        { tipo: 'segmento', da: [4.2, -10.8], a: [4.2, 8.3], freccia: true, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -10], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -9], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -8], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -7], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -6], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -5], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -4], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -3], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -2], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -1], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 0], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 1], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 2], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 3], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 4], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 5], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 6], raggio: 2.5, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 7], raggio: 2.5, colore: 'grigio' },
        { tipo: 'testo', p: [3.8, -9.3], testo: '10⁻⁹ m = 1 nm', ancora: 'end' },
        { tipo: 'testo', p: [3.8, -6.3], testo: '10⁻⁶ m = 1 μm', ancora: 'end' },
        { tipo: 'testo', p: [3.8, -3.3], testo: '10⁻³ m = 1 mm', ancora: 'end' },
        { tipo: 'testo', p: [3.8, -0.3], testo: '10⁰ m = 1 m', ancora: 'end' },
        { tipo: 'testo', p: [3.8, 2.7], testo: '10³ m = 1 km', ancora: 'end' },
        { tipo: 'testo', p: [3.8, 5.7], testo: '10⁶ m = 1000 km', ancora: 'end' },
        { tipo: 'punto', p: [4.2, -10], raggio: 6, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, -4.15], raggio: 6, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 0.23], raggio: 6, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 3.94], raggio: 6, colore: 'grigio' },
        { tipo: 'punto', p: [4.2, 7.1], raggio: 6, colore: 'grigio' },
        { tipo: 'testo', p: [4.65, -10.3], testo: 'atomo 10⁻¹⁰ m', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [4.65, -4.45], testo: 'capello 7·10⁻⁵ m', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [4.65, -0.07], testo: 'persona 1,7 m', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [4.65, 3.64], testo: 'Everest 8,8·10³ m', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [4.65, 6.8], testo: 'Terra 1,3·10⁷ m', ancora: 'start', colore: 'grigio' }
      ],
      didascalia: 'La scala delle potenze di 10, come lo zoom del video: ogni tacca vale 10 volte quella sotto. Dall\'atomo alla Terra ci sono 17 tacche, cioè 17 ordini di grandezza.'
    },
    /* il metro quadrato fatto di 100 decimetri quadrati: le strisce si aggiungono col cursore */
    quadretti: {
      tipo: 'piano', x: [0, 10], y: [0, 10], passo: [1, 1], assi: false, proporzioni: 'libere', altezza: 590, mirino: false,
      parametri: [{ nome: 'n', min: 1, max: 10, passo: 1, valore: 3, etichetta: 'strisce' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], [10, 0], [10, 'n'], [0, 'n']], colore: 3 },
        { tipo: 'segmento', da: [1, 0], a: [1, 'n'], colore: 3 },
        { tipo: 'segmento', da: [2, 0], a: [2, 'n'], colore: 3 },
        { tipo: 'segmento', da: [3, 0], a: [3, 'n'], colore: 3 },
        { tipo: 'segmento', da: [4, 0], a: [4, 'n'], colore: 3 },
        { tipo: 'segmento', da: [5, 0], a: [5, 'n'], colore: 3 },
        { tipo: 'segmento', da: [6, 0], a: [6, 'n'], colore: 3 },
        { tipo: 'segmento', da: [7, 0], a: [7, 'n'], colore: 3 },
        { tipo: 'segmento', da: [8, 0], a: [8, 'n'], colore: 3 },
        { tipo: 'segmento', da: [9, 0], a: [9, 'n'], colore: 3 },
        { tipo: 'segmento', da: [0, 1], a: ['se(n > 1.5, 10, 0)', 1], colore: 3 },
        { tipo: 'segmento', da: [0, 2], a: ['se(n > 2.5, 10, 0)', 2], colore: 3 },
        { tipo: 'segmento', da: [0, 3], a: ['se(n > 3.5, 10, 0)', 3], colore: 3 },
        { tipo: 'segmento', da: [0, 4], a: ['se(n > 4.5, 10, 0)', 4], colore: 3 },
        { tipo: 'segmento', da: [0, 5], a: ['se(n > 5.5, 10, 0)', 5], colore: 3 },
        { tipo: 'segmento', da: [0, 6], a: ['se(n > 6.5, 10, 0)', 6], colore: 3 },
        { tipo: 'segmento', da: [0, 7], a: ['se(n > 7.5, 10, 0)', 7], colore: 3 },
        { tipo: 'segmento', da: [0, 8], a: ['se(n > 8.5, 10, 0)', 8], colore: 3 },
        { tipo: 'segmento', da: [0, 9], a: ['se(n > 9.5, 10, 0)', 9], colore: 3 },
        { tipo: 'poligono', punti: [[0, 0], [1, 0], [1, 1], [0, 1]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0, 0], [10, 0], [10, 10], [0, 10]], colore: 'grigio', riempi: false },
        { tipo: 'testo', p: [5, 'n - 0.62'], testo: '{{n}} strisce · 10 = {{10*n}} dm²', colore: 3 }
      ],
      didascalia: 'Un metro quadrato con la griglia dei decimetri. Il quadretto grigio in basso a sinistra è 1 dm²; una striscia ne contiene 10. Con tutte e 10 le strisce: 100 dm².'
    },
    /* massa e volume di tre sostanze: rette per l'origine, la pendenza è la densità */
    'massa-volume': {
      tipo: 'piano', x: [0, 50], y: [0, 600], etichette: { x: 'V (cm³)', y: 'm (g)' }, altezza: 420,
      parametri: [{ nome: 'V', min: 0, max: 40, passo: 5, valore: 20, etichetta: 'volume (cm³)' }],
      funzioni: [
        { f: '7.9*x', colore: 2, dominio: [0, 40] },
        { f: '2.7*x', colore: 3, dominio: [0, 40] },
        { f: 'x', colore: 1, dominio: [0, 40] }
      ],
      elementi: [
        { tipo: 'punto', p: ['V', '7.9*V'], colore: 2 },
        { tipo: 'punto', p: ['V', '2.7*V'], colore: 3 },
        { tipo: 'punto', p: ['V', 'V'], colore: 1 },
        { tipo: 'testo', p: [29, 562], testo: 'ferro: {{7.9*V}} g', ancora: 'start', colore: 2 },
        { tipo: 'testo', p: [29, 512], testo: 'alluminio: {{2.7*V}} g', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [29, 462], testo: 'acqua: {{V}} g', ancora: 'start', colore: 1 }
      ],
      didascalia: 'Stesso volume, masse diverse. Ferro (arancio) 7,9 g/cm³, alluminio (verde) 2,7 g/cm³, acqua (azzurro) 1 g/cm³: la retta più ripida è la sostanza più densa. Muovi il cursore del volume.'
    },
    /* le misure di Galileo nel video: s = 0,3 m/s²·t², e la previsione a 3,5 s */
    galileo: {
      tipo: 'orario', grandezza: 's', t: [0, 4.6], y: [0, 6.4],
      funzioni: [{ f: '0.3*t^2', colore: 1, etichetta: 's = 0,3·t²' }],
      punti: [
        { x: 1, y: 0.3, etichetta: '0,3 m', posizione: 'alto-sinistra', colore: 'grigio' },
        { x: 2, y: 1.2, etichetta: '1,2 m', posizione: 'alto-sinistra', colore: 'grigio' },
        { x: 3, y: 2.7, etichetta: '2,7 m', posizione: 'alto-sinistra', colore: 'grigio' },
        { x: 4, y: 4.8, etichetta: '4,8 m', posizione: 'alto-sinistra', colore: 'grigio' },
        { x: 3.5, y: 3.675, etichetta: 'previsione 3,7 m', posizione: 'alto-sinistra', colore: 3 }
      ],
      didascalia: 'I punti grigi sono le misure: 0,3 m, 1,2 m, 2,7 m, 4,8 m, come 1, 4, 9, 16. La curva è la legge s = 0,3 m/s²·t². Il punto verde è la previsione a 3,5 s.'
    }
  },
  esempi: [
    {
      titolo: 'Da km/h a m/s con i fattori di conversione',
      problema: R`Un treno regionale viaggia a 108 km/h. Quanto vale la sua velocità in m/s?`,
      passi: [
        R`Dati: $v = 108\,\text{km/h}$. Cerco $v$ in m/s.`,
        R`Scrivo la velocità come frazione: $108\,\dfrac{\text{km}}{\text{h}}$. Voglio i metri al posto dei km e i secondi al posto delle ore.`,
        R`Moltiplico per due fattori che valgono 1: $108\,\dfrac{\text{km}}{\text{h}} \cdot \dfrac{1000\,\text{m}}{1\,\text{km}} \cdot \dfrac{1\,\text{h}}{3600\,\text{s}}$. I km e le h si semplificano.`,
        R`Faccio il conto: $\dfrac{108 \cdot 1000}{3600}\,\text{m/s} = \dfrac{108\,000}{3600}\,\text{m/s} = 30\,\text{m/s}$.`,
        R`Controllo con la scorciatoia: da km/h a m/s si divide per $3{,}6$, e $108 : 3{,}6 = 30$. Torna.`
      ],
      risultato: R`$108\,\text{km/h} = 30\,\text{m/s}$`
    },
    {
      titolo: 'Quanto ci mette la luce del Sole',
      problema: R`Il Sole dista dalla Terra circa 150 milioni di chilometri. La luce viaggia a $3 \cdot 10^8\,\text{m/s}$. Quanto tempo impiega la luce del Sole ad arrivare fino a noi?`,
      passi: [
        R`Dati: distanza $150\,000\,000\,\text{km}$, velocità della luce $c = 3 \cdot 10^8\,\text{m/s}$. Cerco il tempo $t$.`,
        R`Scrivo la distanza in notazione scientifica: $150\,000\,000\,\text{km} = 1{,}5 \cdot 10^8\,\text{km}$.`,
        R`La porto in metri. Un chilometro è $10^3\,\text{m}$, quindi $1{,}5 \cdot 10^8 \cdot 10^3\,\text{m} = 1{,}5 \cdot 10^{11}\,\text{m}$: gli esponenti si sommano.`,
        R`Il tempo è la distanza divisa per la velocità: $t = \dfrac{1{,}5 \cdot 10^{11}\,\text{m}}{3 \cdot 10^8\,\text{m/s}}$. I metri si semplificano e restano i secondi.`,
        R`Divido i numeri e le potenze separatamente: $\dfrac{1{,}5}{3} = 0{,}5$ e $\dfrac{10^{11}}{10^8} = 10^3$. Quindi $t = 0{,}5 \cdot 10^3\,\text{s} = 500\,\text{s}$.`,
        R`In minuti: $t = \dfrac{500}{60}\,\text{min} \approx 8{,}3\,\text{min}$. Sono 8 minuti e 20 secondi: la luce che vediamo è partita dal Sole più di otto minuti fa.`
      ],
      risultato: R`$t = 500\,\text{s}$, cioè 8 minuti e 20 secondi.`
    },
    {
      titolo: 'Quanta acqua sta nella vasca',
      problema: R`Una vasca ha la forma di un parallelepipedo lungo 80 cm, largo 40 cm e alto 50 cm. Quanti litri d'acqua contiene, piena? Quanta massa ha quell'acqua?`,
      passi: [
        R`Dati: $80\,\text{cm}$, $40\,\text{cm}$, $50\,\text{cm}$, $d = 1000\,\text{kg/m}^3$. Cerco $V$ in litri e la massa $m$.`,
        R`Conviene lavorare in decimetri, perché $1\,\text{dm}^3 = 1\,\text{L}$. Le misure diventano $8\,\text{dm}$, $4\,\text{dm}$ e $5\,\text{dm}$.`,
        R`Il volume è il prodotto delle tre dimensioni: $V = 8 \cdot 4 \cdot 5\,\text{dm}^3 = 160\,\text{dm}^3 = 160\,\text{L}$.`,
        R`La massa: $m = d \cdot V$. Con $d = 1000\,\text{kg/m}^3$ e $V = 0{,}160\,\text{m}^3$ viene $m = 1000 \cdot 0{,}160\,\text{kg} = 160\,\text{kg}$. Un litro d'acqua, un chilogrammo.`,
        R`Controllo in centimetri cubi: $80 \cdot 40 \cdot 50 = 160\,000\,\text{cm}^3$. Un decimetro cubo ha $1000\,\text{cm}^3$, quindi sono $160\,\text{dm}^3$. Torna.`
      ],
      risultato: R`$V = 160\,\text{L}$, e l'acqua ha massa $160\,\text{kg}$.`
    },
    {
      titolo: 'Di che metallo è fatto il cubetto?',
      problema: R`Un cubetto di metallo ha il lato di 2,0 cm e massa 21,6 g. Quanto vale la sua densità in $\text{g/cm}^3$ e in $\text{kg/m}^3$? Di che metallo può essere fatto?`,
      passi: [
        R`Dati: lato $2{,}0\,\text{cm}$, $m = 21{,}6\,\text{g}$. Cerco $d$ in g/cm³ e in kg/m³.`,
        R`Il volume di un cubo è il lato al cubo: $V = (2{,}0\,\text{cm})^3 = 8{,}0\,\text{cm}^3$.`,
        R`La densità è massa diviso volume: $d = \dfrac{21{,}6\,\text{g}}{8{,}0\,\text{cm}^3} = 2{,}7\,\text{g/cm}^3$.`,
        R`Passo ai kg/m³ con i fattori: $1\,\text{g} = 10^{-3}\,\text{kg}$ e $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$. Quindi $1\,\text{g/cm}^3 = \dfrac{10^{-3}}{10^{-6}}\,\text{kg/m}^3 = 10^3\,\text{kg/m}^3$.`,
        R`Allora $d = 2{,}7 \cdot 1000\,\text{kg/m}^3 = 2700\,\text{kg/m}^3$. Nella tabella delle densità è il valore dell'alluminio.`
      ],
      risultato: R`$d = 2{,}7\,\text{g/cm}^3 = 2700\,\text{kg/m}^3$: è alluminio.`
    },
    {
      titolo: 'Quanta aria c\'è in un\'aula',
      problema: R`Un'aula è lunga 8 m, larga 6 m e alta 3 m. L'aria ha densità $1{,}2\,\text{kg/m}^3$. Quanta massa ha l'aria dell'aula?`,
      passi: [
        R`Dati: $8\,\text{m}$, $6\,\text{m}$, $3\,\text{m}$, $d = 1{,}2\,\text{kg/m}^3$. Cerco la massa $m$.`,
        R`Il volume dell'aula: $V = 8\,\text{m} \cdot 6\,\text{m} \cdot 3\,\text{m} = 144\,\text{m}^3$.`,
        R`Dalla definizione di densità ricavo la massa: $m = d \cdot V = 1{,}2\,\text{kg/m}^3 \cdot 144\,\text{m}^3$. I metri cubi si semplificano.`,
        R`Il conto: $1{,}2 \cdot 144 = 172{,}8$, quindi $m \approx 173\,\text{kg}$.`,
        R`Controllo con una stima: circa $1\,\text{kg}$ per ogni metro cubo, e circa $150\,\text{m}^3$, fanno circa $150\,\text{kg}$. Stesso ordine di grandezza, $10^2\,\text{kg}$. L'aria dell'aula ha più massa di due persone adulte.`
      ],
      risultato: R`$m \approx 173\,\text{kg}$`
    },
    {
      titolo: 'Quanti battiti in una vita',
      problema: R`Il cuore di una persona a riposo batte circa 70 volte al minuto. Stima quante volte batte in una vita di 80 anni e trova l'ordine di grandezza.`,
      passi: [
        R`Dati: 70 battiti al minuto, 80 anni. Cerco il numero di battiti e il suo ordine di grandezza.`,
        R`In un'ora: $70 \cdot 60 = 4200$ battiti. In un giorno: $4200 \cdot 24 = 100\,800$, cioè circa $10^5$.`,
        R`In un anno: $100\,800 \cdot 365 \approx 3{,}68 \cdot 10^7$ battiti.`,
        R`In 80 anni: $3{,}68 \cdot 10^7 \cdot 80 \approx 2{,}9 \cdot 10^9$ battiti, quasi tre miliardi.`,
        R`L'ordine di grandezza: il numero davanti è 2,9, minore di 5. Quindi l'ordine è $10^9$.`
      ],
      risultato: R`Circa $3 \cdot 10^9$ battiti: ordine di grandezza $10^9$.`
    }
  ],
  formulario: [
    { nome: 'Le sette unità di base del SI', formula: R`\text{m} \quad \text{kg} \quad \text{s} \quad \text{A} \quad \text{K} \quad \text{mol} \quad \text{cd}`, nota: R`Lunghezza, massa, tempo, corrente, temperatura, quantità di sostanza, intensità luminosa.` },
    { nome: 'Notazione scientifica', formula: R`a \cdot 10^n \qquad 1 \le a < 10`, nota: R`Esempi: $0{,}00007 = 7 \cdot 10^{-5}$ e $12\,700\,000 = 1{,}27 \cdot 10^7$.` },
    { nome: 'Prodotto di potenze di 10', formula: R`10^m \cdot 10^n = 10^{m+n}`, nota: R`Nel quoziente gli esponenti si sottraggono: $10^m : 10^n = 10^{m-n}$. I numeri davanti si trattano a parte.` },
    { nome: 'Prefissi dei multipli', formula: R`\text{M} = 10^6 \qquad \text{k} = 10^3`, nota: R`Mega e chilo. Anche G (giga) $= 10^9$, h (etto) $= 10^2$, da (deca) $= 10$.` },
    { nome: 'Prefissi dei sottomultipli', formula: R`\text{c} = 10^{-2} \qquad \text{m} = 10^{-3}`, nota: R`Centi e milli. Anche d (deci) $= 10^{-1}$, μ (micro) $= 10^{-6}$, n (nano) $= 10^{-9}$.` },
    { nome: 'Ordine di grandezza', formula: R`a \cdot 10^n \;\rightarrow\; \begin{cases} 10^n & \text{se } a < 5 \\ 10^{n+1} & \text{se } a \ge 5 \end{cases}`, nota: R`La potenza di 10 più vicina, con la regola pratica del 5. L'Everest, $8{,}8 \cdot 10^3\,\text{m}$, ha ordine $10^4\,\text{m}$.` },
    { nome: 'Fattori di conversione', formula: R`\dfrac{1000\,\text{m}}{1\,\text{km}} = 1 \qquad \dfrac{3600\,\text{s}}{1\,\text{h}} = 1`, nota: R`L'unità da eliminare va dalla parte opposta della frazione.` },
    { nome: 'Da km/h a m/s', formula: R`1\,\text{m/s} = 3{,}6\,\text{km/h}`, nota: R`Da km/h a m/s si divide per $3{,}6$; da m/s a km/h si moltiplica.` },
    { nome: 'Unità di tempo', formula: R`1\,\text{h} = 60\,\text{min} = 3600\,\text{s}`, nota: R`Il tempo non è decimale: $1{,}5\,\text{h} = 90\,\text{min}$.` },
    { nome: 'Aree', formula: R`1\,\text{m}^2 = 100\,\text{dm}^2 = 10^4\,\text{cm}^2`, nota: R`Il fattore delle lunghezze va al quadrato.` },
    { nome: 'Volumi', formula: R`1\,\text{m}^3 = 1000\,\text{dm}^3 = 10^6\,\text{cm}^3`, nota: R`Il fattore delle lunghezze va al cubo.` },
    { nome: 'Il litro', formula: R`1\,\text{L} = 1\,\text{dm}^3 \qquad 1\,\text{mL} = 1\,\text{cm}^3`, nota: R`E $1\,\text{m}^3 = 1000\,\text{L}$. Un litro d'acqua ha massa $1\,\text{kg}$.` },
    { nome: 'Densità', formula: R`d = \dfrac{m}{V}`, nota: R`In $\text{kg/m}^3$. Vale $1\,\text{g/cm}^3 = 1000\,\text{kg/m}^3$; l'acqua ha $1000\,\text{kg/m}^3$.` },
    { nome: 'Massa e volume dalla densità', formula: R`m = d \cdot V \qquad V = \dfrac{m}{d}`, nota: R`Le formule inverse di $d = m/V$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'misurare', tipo: 'definizione', fronte: R`Che cosa vuol dire **misurare** una grandezza?`, retro: R`Confrontarla con l'unità di misura e dire quante volte la contiene.` },
    { id: 'fc-02', sezione: 'misurare', tipo: 'definizione', fronte: R`Che cos'è una **grandezza fisica**?`, retro: R`Una proprietà che si può misurare con uno strumento: lunghezza, massa, tempo, temperatura…` },
    { id: 'fc-03', sezione: 'misurare', tipo: 'concetto', fronte: R`Perché «il tavolo è lungo 2» non è una misura?`, retro: R`Manca l'unità: 2 metri, 2 matite o 2 spanne? Una misura è un numero seguito dall'unità.` },
    { id: 'fc-04', sezione: 'si', tipo: 'definizione', fronte: R`Le sette grandezze fondamentali del **SI**`, retro: R`Lunghezza (m), massa (kg), tempo (s), intensità di corrente (A), temperatura (K), quantità di sostanza (mol), intensità luminosa (cd).` },
    { id: 'fc-05', sezione: 'si', tipo: 'concetto', fronte: R`Che cos'è un'unità **derivata**? Fai un esempio.`, retro: R`Un'unità ottenuta da quelle di base: $\text{m/s}$ per la velocità, $\text{m}^2$ per l'area, $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$ per la forza.` },
    { id: 'fc-06', sezione: 'si', tipo: 'concetto', fronte: R`Come si scrive il simbolo del chilogrammo? E quello del metro?`, retro: R`kg e m, minuscoli e senza punto. Sono sbagliati Kg, kgr e mt.` },
    { id: 'fc-07', sezione: 'notazione', tipo: 'definizione', fronte: R`Quando un numero è in **notazione scientifica**?`, retro: R`Quando è scritto $a \cdot 10^n$, con $1 \le a < 10$ e $n$ intero.` },
    { id: 'fc-08', sezione: 'notazione', tipo: 'procedura', fronte: R`Come si scrive $0{,}00052$ in notazione scientifica?`, retro: R`La virgola va di 4 posti verso destra, quindi l'esponente è $-4$: $5{,}2 \cdot 10^{-4}$.` },
    { id: 'fc-09', sezione: 'notazione', tipo: 'formula', fronte: R`Prodotto e quoziente di **potenze di 10**`, retro: R`$10^m \cdot 10^n = 10^{m+n}$ e $10^m : 10^n = 10^{m-n}$.` },
    { id: 'fc-10', sezione: 'notazione', tipo: 'definizione', fronte: R`Quanto valgono i prefissi k, M, m, μ?`, retro: R`k (chilo) $= 10^3$, M (mega) $= 10^6$, m (milli) $= 10^{-3}$, μ (micro) $= 10^{-6}$.` },
    { id: 'fc-11', sezione: 'ordine-grandezza', tipo: 'definizione', fronte: R`Che cos'è l'**ordine di grandezza** di un numero?`, retro: R`La potenza di 10 più vicina. Regola pratica: con $a \cdot 10^n$ è $10^n$ se $a < 5$, $10^{n+1}$ se $a \ge 5$.` },
    { id: 'fc-12', sezione: 'ordine-grandezza', tipo: 'procedura', fronte: R`Qual è l'ordine di grandezza dell'altezza dell'Everest, 8800 m?`, retro: R`$8800\,\text{m} = 8{,}8 \cdot 10^3\,\text{m}$. Siccome $8{,}8 \ge 5$, l'ordine è $10^4\,\text{m}$.` },
    { id: 'fc-13', sezione: 'equivalenze', tipo: 'definizione', fronte: R`Che cos'è un **fattore di conversione**?`, retro: R`Una frazione che vale 1, come $\dfrac{1000\,\text{m}}{1\,\text{km}}$. Moltiplicando cambia l'unità, non la grandezza.` },
    { id: 'fc-14', sezione: 'equivalenze', tipo: 'procedura', fronte: R`Come si passa da km/h a m/s, e viceversa?`, retro: R`Da km/h a m/s si divide per $3{,}6$: $72\,\text{km/h} = 20\,\text{m/s}$. Da m/s a km/h si moltiplica per $3{,}6$.` },
    { id: 'fc-15', sezione: 'equivalenze', tipo: 'concetto', fronte: R`Quanti minuti sono 2,5 h?`, retro: R`150 minuti: due ore e mezza. Non 2 h e 50 min: il tempo non è decimale.` },
    { id: 'fc-16', sezione: 'aree-volumi', tipo: 'formula', fronte: R`Quanti dm² in un m²? Quanti dm³ in un m³?`, retro: R`$1\,\text{m}^2 = 100\,\text{dm}^2$ e $1\,\text{m}^3 = 1000\,\text{dm}^3$: il fattore 10 va al quadrato e al cubo.` },
    { id: 'fc-17', sezione: 'aree-volumi', tipo: 'definizione', fronte: R`Quanto vale un **litro**?`, retro: R`$1\,\text{L} = 1\,\text{dm}^3$. Inoltre $1\,\text{mL} = 1\,\text{cm}^3$ e $1\,\text{m}^3 = 1000\,\text{L}$.` },
    { id: 'fc-18', sezione: 'densita', tipo: 'formula', fronte: R`La formula della **densità** e le sue inverse`, retro: R`$d = \dfrac{m}{V}$, in $\text{kg/m}^3$. Inverse: $m = d \cdot V$ e $V = \dfrac{m}{d}$.` },
    { id: 'fc-19', sezione: 'densita', tipo: 'concetto', fronte: R`Quanto vale la densità dell'acqua?`, retro: R`$1000\,\text{kg/m}^3$, cioè $1\,\text{g/cm}^3$: un litro d'acqua ha massa 1 kg.` },
    { id: 'fc-20', sezione: 'densita', tipo: 'concetto', fronte: R`Perché il ghiaccio galleggia sull'acqua?`, retro: R`Gelando, l'acqua mantiene la massa ma aumenta di volume. Il ghiaccio ($917\,\text{kg/m}^3$) è meno denso dell'acqua.` },
    { id: 'fc-21', sezione: 'densita', tipo: 'concetto', fronte: R`Se si taglia a metà un oggetto, la sua densità cambia?`, retro: R`No. Massa e volume si dimezzano insieme: la densità dipende dalla sostanza, non dal pezzo.` },
    { id: 'fc-22', sezione: 'metodo', tipo: 'procedura', fronte: R`I quattro passi del **metodo sperimentale**`, retro: R`Domanda, ipotesi, esperimento, legge. L'ipotesi diventa legge solo se le misure la confermano.` },
    { id: 'fc-23', sezione: 'metodo', tipo: 'definizione', fronte: R`Che cos'è una **legge fisica**?`, retro: R`Una relazione fra grandezze misurabili, confermata dagli esperimenti. Serve a prevedere.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Esprimi 3,5 km in metri.`, suggerimenti: [R`Un chilometro sono 1000 metri.`], risposta: { tipo: 'numero', valore: 3500, unita: 'm', soloUnita: true }, soluzione: [R`$3{,}5\,\text{km} = 3{,}5 \cdot 1000\,\text{m} = 3500\,\text{m}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Esprimi 250 cm in metri.`, suggerimenti: [R`In un metro ci sono 100 cm: si divide per 100.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'm', soloUnita: true }, soluzione: [R`$250\,\text{cm} = \dfrac{250}{100}\,\text{m} = 2{,}5\,\text{m}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Scrivi senza potenze di 10 la lunghezza $6{,}2 \cdot 10^3\,\text{m}$.`, suggerimenti: [R`$10^3 = 1000$: la virgola si sposta di 3 posti verso destra.`], risposta: { tipo: 'numero', valore: 6200, unita: 'm' }, soluzione: [R`$6{,}2 \cdot 10^3\,\text{m} = 6{,}2 \cdot 1000\,\text{m} = 6200\,\text{m}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Quanto fa $10^5 \cdot 10^{-2}$? Scrivi il risultato come numero normale.`, suggerimenti: [R`Nel prodotto di potenze di 10 gli esponenti si sommano.`], risposta: { tipo: 'numero', valore: 1000 }, soluzione: [R`$10^5 \cdot 10^{-2} = 10^{5 - 2} = 10^3 = 1000$.`] },
    { id: 'b-05', livello: 'base', difficolta: 2, testo: R`Quanto fa $(3 \cdot 10^4) : (6 \cdot 10^2)$?`, suggerimenti: [R`Dividi i numeri davanti e, a parte, le potenze.`, R`$3 : 6 = 0{,}5$ e $10^4 : 10^2 = 10^2$.`], risposta: { tipo: 'numero', valore: 50 }, soluzione: [R`$3 : 6 = 0{,}5$ e $10^4 : 10^2 = 10^2$.`, R`Quindi il risultato è $0{,}5 \cdot 10^2 = 50$.`] },
    { id: 'b-06', livello: 'base', difficolta: 2, testo: R`Un foglio di carta è spesso 0,09 mm. Quanto vale il suo spessore in metri? Scrivilo in notazione scientifica.`, suggerimenti: [R`Prima passa ai metri: $1\,\text{mm} = 0{,}001\,\text{m}$.`, R`$0{,}09\,\text{mm} = 0{,}00009\,\text{m}$: ora sposta la virgola.`], risposta: { tipo: 'numero', valore: 9e-5, unita: 'm', soloUnita: true }, soluzione: [R`$0{,}09\,\text{mm} = 0{,}09 \cdot 10^{-3}\,\text{m} = 0{,}00009\,\text{m}$.`, R`La virgola va di 5 posti verso destra: $9 \cdot 10^{-5}\,\text{m}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Qual è l'ordine di grandezza di 2600 m? Scrivilo come potenza di 10, per esempio 10^5 m.`, suggerimenti: [R`In notazione scientifica: $2{,}6 \cdot 10^3\,\text{m}$.`, R`Il numero davanti è minore di 5?`], risposta: { tipo: 'numero', valore: 1000, unita: 'm', segnaposto: 'una potenza di 10 (es. 10^5 m)' }, soluzione: [R`$2600\,\text{m} = 2{,}6 \cdot 10^3\,\text{m}$.`, R`$2{,}6 < 5$, quindi l'ordine di grandezza è $10^3\,\text{m}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Qual è l'ordine di grandezza di 0,0071 m? Scrivilo come potenza di 10.`, suggerimenti: [R`In notazione scientifica: $7{,}1 \cdot 10^{-3}\,\text{m}$.`, R`$7{,}1 \ge 5$: si sale alla potenza successiva.`], risposta: { tipo: 'numero', valore: 0.01, unita: 'm', segnaposto: 'una potenza di 10 (es. 10^5 m)' }, soluzione: [R`$0{,}0071\,\text{m} = 7{,}1 \cdot 10^{-3}\,\text{m}$.`, R`$7{,}1 \ge 5$, quindi si sale da $10^{-3}$ a $10^{-2}\,\text{m}$, cioè $0{,}01\,\text{m}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Esprimi 90 km/h in m/s.`, suggerimenti: [R`Da km/h a m/s si divide per $3{,}6$.`], risposta: { tipo: 'numero', valore: 25, unita: 'm/s', soloUnita: true }, soluzione: [R`$90\,\text{km/h} = \dfrac{90}{3{,}6}\,\text{m/s} = 25\,\text{m/s}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Esprimi 15 m/s in km/h.`, suggerimenti: [R`Da m/s a km/h si moltiplica per $3{,}6$.`], risposta: { tipo: 'numero', valore: 54, unita: 'km/h', soloUnita: true }, soluzione: [R`$15\,\text{m/s} = 15 \cdot 3{,}6\,\text{km/h} = 54\,\text{km/h}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Quanti secondi ci sono in un quarto d'ora?`, suggerimenti: [R`Un quarto d'ora sono 15 minuti, e ogni minuto ha 60 secondi.`], risposta: { tipo: 'numero', valore: 900, unita: 's', soloUnita: true }, soluzione: [R`$15\,\text{min} \cdot 60\,\dfrac{\text{s}}{\text{min}} = 900\,\text{s}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Esprimi 2,25 h in minuti.`, suggerimenti: [R`Un'ora ha 60 minuti, e 0,25 h è un quarto d'ora.`, R`Attenzione: 2,25 h non è 2 h e 25 min.`], risposta: { tipo: 'numero', valore: 135, unita: 'min', soloUnita: true }, soluzione: [R`$2{,}25\,\text{h} = 2{,}25 \cdot 60\,\text{min} = 135\,\text{min}$: due ore e un quarto.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Esprimi 3 m² in dm².`, suggerimenti: [R`Nelle aree il fattore va al quadrato: $1\,\text{m}^2 = 100\,\text{dm}^2$.`], risposta: { tipo: 'numero', valore: 300, unita: 'dm²', soloUnita: true }, soluzione: [R`$3\,\text{m}^2 = 3 \cdot 100\,\text{dm}^2 = 300\,\text{dm}^2$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Esprimi 2,5 m³ in litri.`, suggerimenti: [R`$1\,\text{m}^3 = 1000\,\text{dm}^3 = 1000\,\text{L}$.`], risposta: { tipo: 'numero', valore: 2500, unita: 'L', soloUnita: true }, soluzione: [R`$2{,}5\,\text{m}^3 = 2{,}5 \cdot 1000\,\text{L} = 2500\,\text{L}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Esprimi 750 mL in litri.`, suggerimenti: [R`Un litro sono 1000 mL: si divide per 1000.`], risposta: { tipo: 'numero', valore: 0.75, unita: 'L', soloUnita: true }, soluzione: [R`$750\,\text{mL} = \dfrac{750}{1000}\,\text{L} = 0{,}75\,\text{L}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Una scatola è lunga 20 cm, larga 10 cm e alta 5 cm. Quanti litri contiene?`, suggerimenti: [R`Calcola il volume in cm³, poi ricorda che $1\,\text{L} = 1000\,\text{cm}^3$.`, R`Oppure passa subito ai decimetri: 2 dm, 1 dm, 0,5 dm.`], risposta: { tipo: 'numero', valore: 1, unita: 'L' }, soluzione: [R`$V = 20 \cdot 10 \cdot 5\,\text{cm}^3 = 1000\,\text{cm}^3$.`, R`$1000\,\text{cm}^3 = 1\,\text{dm}^3 = 1\,\text{L}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un pezzo di metallo ha massa 356 g e volume 40 cm³. Quanto vale la sua densità in g/cm³?`, suggerimenti: [R`Densità: massa diviso volume.`], risposta: { tipo: 'numero', valore: 8.9, unita: 'g/cm³' }, soluzione: [R`$d = \dfrac{m}{V} = \dfrac{356\,\text{g}}{40\,\text{cm}^3} = 8{,}9\,\text{g/cm}^3$. È la densità del rame.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Quanta massa hanno 3 m³ d'acqua? La densità dell'acqua è $1000\,\text{kg/m}^3$.`, suggerimenti: [R`Dalla densità: $m = d \cdot V$.`], risposta: { tipo: 'numero', valore: 3000, unita: 'kg' }, soluzione: [R`$m = d \cdot V = 1000\,\text{kg/m}^3 \cdot 3\,\text{m}^3 = 3000\,\text{kg}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un pezzo di ferro ha massa 790 g. La densità del ferro è circa $7{,}9\,\text{g/cm}^3$. Quanto vale il suo volume?`, suggerimenti: [R`Dalla densità: $V = \dfrac{m}{d}$.`], risposta: { tipo: 'numero', valore: 100, unita: 'cm³' }, soluzione: [R`$V = \dfrac{m}{d} = \dfrac{790\,\text{g}}{7{,}9\,\text{g/cm}^3} = 100\,\text{cm}^3$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`La palla di Galileo segue la legge $s = 0{,}3\,\text{m/s}^2 \cdot t^2$. Dove si trova dopo 5 s?`, suggerimenti: [R`Metti $t = 5\,\text{s}$ nella legge: il tempo va al quadrato.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'm' }, soluzione: [R`$s = 0{,}3\,\text{m/s}^2 \cdot (5\,\text{s})^2 = 0{,}3 \cdot 25\,\text{m} = 7{,}5\,\text{m}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`La Luna dista dalla Terra circa $3{,}84 \cdot 10^5\,\text{km}$. Un segnale radio viaggia alla velocità della luce, $3 \cdot 10^8\,\text{m/s}$. Quanti secondi impiega un segnale per arrivare sulla Luna?`, suggerimenti: [R`Porta la distanza in metri: $1\,\text{km} = 10^3\,\text{m}$.`, R`Tempo = distanza diviso velocità. Dividi i numeri e le potenze separatamente.`], risposta: { tipo: 'numero', valore: 1.28, unita: 's' }, soluzione: [R`$3{,}84 \cdot 10^5\,\text{km} = 3{,}84 \cdot 10^8\,\text{m}$.`, R`$t = \dfrac{3{,}84 \cdot 10^8\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 1{,}28\,\text{s}$. Le potenze si semplificano.`] },
    { id: 'es-02', difficolta: 2, testo: R`Una palestra è lunga 10 m, larga 8 m e alta 3 m. L'aria ha densità $1{,}2\,\text{kg/m}^3$. Quanta massa ha l'aria della palestra?`, suggerimenti: [R`Calcola prima il volume.`, R`Poi $m = d \cdot V$.`], risposta: { tipo: 'numero', valore: 288, unita: 'kg' }, soluzione: [R`$V = 10 \cdot 8 \cdot 3\,\text{m}^3 = 240\,\text{m}^3$.`, R`$m = 1{,}2\,\text{kg/m}^3 \cdot 240\,\text{m}^3 = 288\,\text{kg}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Stima quanti secondi dura una vita di 80 anni. Qual è l'ordine di grandezza? Scrivilo come potenza di 10.`, suggerimenti: [R`Un anno ha circa $3{,}2 \cdot 10^7\,\text{s}$.`, R`Moltiplica per 80 e guarda il numero davanti.`], risposta: { tipo: 'numero', valore: 1e9, unita: 's', segnaposto: 'una potenza di 10 (es. 10^5 s)' }, soluzione: [R`Un anno: $365 \cdot 24 \cdot 3600\,\text{s} \approx 3{,}2 \cdot 10^7\,\text{s}$.`, R`80 anni: $80 \cdot 3{,}2 \cdot 10^7\,\text{s} \approx 2{,}6 \cdot 10^9\,\text{s}$.`, R`$2{,}6 < 5$, quindi l'ordine di grandezza è $10^9\,\text{s}$: due miliardi e mezzo di secondi, più o meno.`] },
    { id: 'es-04', difficolta: 2, testo: R`Un lingotto d'oro ha massa 1,00 kg. La densità dell'oro è $19\,300\,\text{kg/m}^3$. Quanti centimetri cubi occupa?`, suggerimenti: [R`$V = \dfrac{m}{d}$ dà il volume in m³.`, R`$1\,\text{m}^3 = 10^6\,\text{cm}^3$.`], risposta: { tipo: 'numero', valore: 51.8, unita: 'cm³' }, soluzione: [R`$V = \dfrac{1{,}00\,\text{kg}}{19\,300\,\text{kg/m}^3} \approx 5{,}18 \cdot 10^{-5}\,\text{m}^3$.`, R`In centimetri cubi: $5{,}18 \cdot 10^{-5} \cdot 10^6\,\text{cm}^3 \approx 51{,}8\,\text{cm}^3$. È poco più di un cubetto di 3,7 cm di lato.`] },
    { id: 'es-05', difficolta: 2, testo: R`La densità del piombo è circa $11{,}3\,\text{g/cm}^3$. Esprimila in $\text{kg/m}^3$.`, suggerimenti: [R`$1\,\text{g} = 10^{-3}\,\text{kg}$ e $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$.`, R`Quindi $1\,\text{g/cm}^3 = 1000\,\text{kg/m}^3$.`], risposta: { tipo: 'numero', valore: 11300, unita: 'kg/m³', soloUnita: true }, soluzione: [R`$1\,\text{g/cm}^3 = \dfrac{10^{-3}\,\text{kg}}{10^{-6}\,\text{m}^3} = 10^3\,\text{kg/m}^3$.`, R`$11{,}3\,\text{g/cm}^3 = 11{,}3 \cdot 1000\,\text{kg/m}^3 = 11\,300\,\text{kg/m}^3$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una piscina è lunga 25 m, larga 12 m e profonda 1,8 m. Si riempie con un tubo che porta 20 litri al minuto. Quante ore servono per riempirla?`, suggerimenti: [R`Calcola il volume in m³ e poi in litri.`, R`Dividi per 20 L/min per avere i minuti, poi passa alle ore.`], risposta: { tipo: 'numero', valore: 450, unita: 'h' }, soluzione: [R`$V = 25 \cdot 12 \cdot 1{,}8\,\text{m}^3 = 540\,\text{m}^3 = 540\,000\,\text{L}$.`, R`Minuti: $t = \dfrac{540\,000\,\text{L}}{20\,\text{L/min}} = 27\,000\,\text{min}$.`, R`Ore: $t = \dfrac{27\,000}{60}\,\text{h} = 450\,\text{h}$, quasi 19 giorni senza sosta.`] },
    { id: 'es-07', difficolta: 2, testo: R`Una cellula è larga circa $2 \cdot 10^{-5}\,\text{m}$, un atomo circa $10^{-10}\,\text{m}$. Quanti atomi stanno in fila lungo la cellula?`, suggerimenti: [R`Fai il rapporto fra le due misure: i metri si semplificano.`, R`$\dfrac{10^{-5}}{10^{-10}} = 10^{-5 - (-10)}$.`], risposta: { tipo: 'numero', valore: 2e5 }, soluzione: [R`$\dfrac{2 \cdot 10^{-5}\,\text{m}}{10^{-10}\,\text{m}} = 2 \cdot 10^{-5 + 10} = 2 \cdot 10^5$.`, R`Circa duecentomila atomi: la cellula è 5 ordini di grandezza più grande.`] },
    { id: 'es-08', difficolta: 3, testo: R`Una bottiglia contiene 1,5 L d'acqua (massa 1,5 kg) e viene messa nel congelatore. La densità del ghiaccio è $917\,\text{kg/m}^3$. Quanti litri occupa il ghiaccio?`, suggerimenti: [R`Gelando, la massa resta 1,5 kg.`, R`$V = \dfrac{m}{d}$, poi da m³ a litri.`], risposta: { tipo: 'numero', valore: 1.64, unita: 'L' }, soluzione: [R`La massa non cambia: $m = 1{,}5\,\text{kg}$.`, R`$V = \dfrac{1{,}5\,\text{kg}}{917\,\text{kg/m}^3} \approx 0{,}00164\,\text{m}^3 = 1{,}64\,\text{L}$.`, R`Il ghiaccio non ci sta più nella bottiglia: per questo una bottiglia piena d'acqua, nel congelatore, si può rompere.`] },
    { id: 'es-09', difficolta: 2, testo: R`Un bicchiere vuoto ha massa 150 g. Pieno d'olio ha massa 330 g. Il bicchiere contiene 200 cm³. Quanto vale la densità dell'olio in g/cm³?`, suggerimenti: [R`La massa dell'olio è la differenza fra le due pesate.`], risposta: { tipo: 'numero', valore: 0.9, unita: 'g/cm³' }, soluzione: [R`Massa dell'olio: $330\,\text{g} - 150\,\text{g} = 180\,\text{g}$.`, R`$d = \dfrac{180\,\text{g}}{200\,\text{cm}^3} = 0{,}9\,\text{g/cm}^3$. È meno dell'acqua: l'olio le galleggia sopra.`] },
    { id: 'es-10', difficolta: 3, testo: R`La palla di Galileo segue la legge $s = 0{,}3\,\text{m/s}^2 \cdot t^2$. Dopo quanti secondi ha percorso 10,8 m?`, suggerimenti: [R`Ricava $t^2$ dividendo $s$ per $0{,}3\,\text{m/s}^2$.`, R`Poi fai la radice quadrata.`], risposta: { tipo: 'numero', valore: 6, unita: 's' }, soluzione: [R`$t^2 = \dfrac{10{,}8\,\text{m}}{0{,}3\,\text{m/s}^2} = 36\,\text{s}^2$.`, R`$t = \sqrt{36\,\text{s}^2} = 6\,\text{s}$.`] },
    { id: 'es-11', difficolta: 2, testo: R`Una risma di 500 fogli di carta è alta 5 cm. Quanto è spesso un foglio, in millimetri?`, suggerimenti: [R`Porta l'altezza in millimetri: $1\,\text{cm} = 10\,\text{mm}$.`, R`Poi dividi per il numero di fogli.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'mm' }, soluzione: [R`$5\,\text{cm} = 50\,\text{mm}$.`, R`Spessore di un foglio: $\dfrac{50\,\text{mm}}{500} = 0{,}1\,\text{mm} = 10^{-4}\,\text{m}$.`] },
    { id: 'es-12', difficolta: 2, testo: R`Un ciclista percorre 18 km in 45 minuti. Qual è la sua velocità in m/s?`, suggerimenti: [R`Porta i km in metri e i minuti in secondi.`, R`Poi dividi lo spazio per il tempo.`], risposta: { tipo: 'numero', valore: 6.67, unita: 'm/s' }, soluzione: [R`$18\,\text{km} = 18\,000\,\text{m}$ e $45\,\text{min} = 2700\,\text{s}$.`, R`$v = \dfrac{18\,000\,\text{m}}{2700\,\text{s}} \approx 6{,}67\,\text{m/s}$, cioè $24\,\text{km/h}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa vuol dire misurare una grandezza?`, opzioni: [R`Confrontarla con l'unità di misura e dire quante volte la contiene`, R`Usare un righello o una bilancia`, R`Stimarla a occhio`, R`Scriverla in notazione scientifica`], corretta: 0, spiegazione: R`Misurare è un confronto con l'unità. Lo strumento aiuta a farlo, la stima è solo approssimata, e la notazione scientifica è un modo di scrivere il numero.` },
    { id: 'q-02', domanda: R`Quale di queste **non** è una grandezza fondamentale del SI?`, opzioni: [R`La lunghezza`, R`La massa`, R`La velocità`, R`La temperatura`], corretta: 2, spiegazione: R`La velocità è derivata: è una lunghezza divisa per un tempo, in $\text{m/s}$. Lunghezza, massa e temperatura sono fra le sette grandezze di base.` },
    { id: 'q-03', domanda: R`Qual è il modo corretto di scrivere cinque chilogrammi?`, opzioni: [R`5 Kg`, R`5 kgr`, R`5 KG`, R`5 kg`], corretta: 3, spiegazione: R`Il simbolo è kg: tutto minuscolo, senza punto, dopo il numero con uno spazio. Le altre forme sono errori comuni.` },
    { id: 'q-04', domanda: R`Quale di questi numeri è scritto in notazione scientifica?`, opzioni: [R`$32 \cdot 10^4$`, R`$3{,}2 \cdot 10^5$`, R`$0{,}32 \cdot 10^6$`, R`$3{,}2 \cdot 10^{5{,}5}$`], corretta: 1, spiegazione: R`Serve $a \cdot 10^n$ con $1 \le a < 10$, e l'esponente deve essere intero. Il 32 ha due cifre davanti, 0,32 è minore di 1, e 5,5 non è un intero. $32 \cdot 10^4$, $3{,}2 \cdot 10^5$ e $0{,}32 \cdot 10^6$ valgono tutti 320 000.` },
    { id: 'q-05', domanda: R`Una lunghezza di $10^{-3}\,\text{m}$ è…`, opzioni: [R`un chilometro`, R`un centimetro`, R`un millimetro`, R`mille metri`], corretta: 2, spiegazione: R`$10^{-3} = 0{,}001$: un millesimo di metro, cioè un millimetro. Il chilometro è $10^3\,\text{m}$, il centimetro $10^{-2}\,\text{m}$.` },
    { id: 'q-06', domanda: R`Qual è l'ordine di grandezza di 2400 m?`, opzioni: [R`$10^3\,\text{m}$`, R`$10^4\,\text{m}$`, R`$2 \cdot 10^3\,\text{m}$`, R`$10^2\,\text{m}$`], corretta: 0, spiegazione: R`$2400\,\text{m} = 2{,}4 \cdot 10^3\,\text{m}$, e 2,4 è minore di 5: ordine $10^3\,\text{m}$. Un ordine di grandezza è sempre una potenza di 10, quindi $2 \cdot 10^3$ non va.` },
    { id: 'q-07', domanda: R`Per passare da km/h a m/s, che cosa si fa?`, opzioni: [R`Si moltiplica per 3,6`, R`Si divide per 3,6`, R`Si divide per 1000`, R`Si moltiplica per 60`], corretta: 1, spiegazione: R`Si moltiplica per 1000 (i metri) e si divide per 3600 (i secondi): in tutto si divide per 3,6. Per esempio $72\,\text{km/h} = 20\,\text{m/s}$.` },
    { id: 'q-08', domanda: R`Quanti decimetri quadrati ci sono in un metro quadrato?`, opzioni: [R`10`, R`1000`, R`10 000`, R`100`], corretta: 3, spiegazione: R`Dieci quadretti fanno una sola striscia; le strisce sono 10. Nelle aree il fattore va al quadrato: $10^2 = 100$.` },
    { id: 'q-09', domanda: R`Un litro è uguale a…`, opzioni: [R`un metro cubo`, R`un decimetro cubo`, R`un centimetro cubo`, R`dieci centimetri cubi`], corretta: 1, spiegazione: R`$1\,\text{L} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$. Un metro cubo contiene 1000 litri, un centimetro cubo è un millilitro.` },
    { id: 'q-10', domanda: R`Un chilo di piume e un chilo di ferro: che cosa è vero?`, opzioni: [R`Il ferro ha più massa`, R`Le piume hanno più massa, perché occupano più spazio`, R`Hanno la stessa massa, ma il ferro occupa meno volume`, R`Hanno la stessa densità`], corretta: 2, spiegazione: R`La massa è la stessa, 1 kg. Il ferro occupa un volume molto più piccolo, quindi ha una densità molto maggiore.` },
    { id: 'q-11', domanda: R`Una barra di ferro viene tagliata in due pezzi uguali. La densità di ciascun pezzo…`, opzioni: [R`si dimezza`, R`raddoppia`, R`dipende da come si taglia`, R`resta la stessa`], corretta: 3, spiegazione: R`Massa e volume si dimezzano insieme, quindi il rapporto $m/V$ non cambia. La densità è una proprietà della sostanza.` },
    { id: 'q-12', domanda: R`Perché il ghiaccio galleggia sull'acqua?`, opzioni: [R`Perché ha densità minore dell'acqua`, R`Perché ha massa minore dell'acqua da cui si è formato`, R`Perché è solido`, R`Perché è più freddo`], corretta: 0, spiegazione: R`Gelando, l'acqua conserva la massa ma aumenta di volume: la densità scende da 1000 a circa $917\,\text{kg/m}^3$. Essere solido non basta: un cubetto di ferro va a fondo.` },
    { id: 'q-13', domanda: R`Nel grafico massa–volume di tre sostanze, che cosa indica la retta più ripida?`, opzioni: [R`La sostanza con più volume`, R`La sostanza più densa`, R`La sostanza più leggera`, R`La sostanza che galleggia`], corretta: 1, spiegazione: R`La pendenza è $m/V$, cioè la densità: la retta più ripida ha più massa per ogni centimetro cubo.` },
    { id: 'q-14', domanda: R`Nel metodo sperimentale, quando un'ipotesi diventa una legge?`, opzioni: [R`Quando la propone uno scienziato famoso`, R`Quando si scrive con una formula`, R`Quando gli esperimenti la confermano`, R`Mai: le ipotesi restano ipotesi`], corretta: 2, spiegazione: R`Decide l'esperimento. Una formula può essere sbagliata, e l'autorità di chi la propone non basta. Una legge resta valida finché le misure la confermano.` },
    { id: 'q-15', domanda: R`1,5 h corrispondono a…`, opzioni: [R`1 h e 50 min`, R`150 min`, R`105 min`, R`90 min`], corretta: 3, spiegazione: R`Il tempo non è decimale: $1{,}5\,\text{h} = 1{,}5 \cdot 60\,\text{min} = 90\,\text{min}$, cioè un'ora e mezza.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Il simbolo del chilogrammo è kg, tutto minuscolo: Kg e kgr sono sbagliati. E il metro è m, non mt.` },
    { tipo: 'errore', testo: R`Un metro quadrato non sono 10 dm², ma 100. Un metro cubo non sono 10 dm³, ma 1000: nelle aree il fattore va al quadrato, nei volumi al cubo.` },
    { tipo: 'errore', testo: R`Le ore non sono decimali: 1,5 h è un'ora e mezza, cioè 90 minuti, non un'ora e cinquanta.` },
    { tipo: 'trucco', testo: R`Un litro è un decimetro cubo, e un litro d'acqua ha massa 1 kg. Con questi due fatti si risolvono metà degli esercizi.` },
    { tipo: 'trucco', testo: R`Scrivi il fattore di conversione come frazione: l'unità da eliminare va dalla parte opposta, così si semplifica.` },
    { tipo: 'trucco', testo: R`Da g/cm³ a kg/m³ si moltiplica per 1000: l'acqua ha $1\,\text{g/cm}^3$, cioè $1000\,\text{kg/m}^3$.` },
    { tipo: 'metodo', testo: R`Prima del conto, stima l'ordine di grandezza del risultato. Se poi esce lontano di molti zeri, cerca l'errore.` },
    { tipo: 'metodo', testo: R`Nei conti scrivi sempre l'unità accanto al numero: si semplifica come una lettera e ti dice se hai usato la formula giusta.` }
  ],
  aneddoti: [
    { fisico: 'Archimede', anni: 'circa 287–212 a.C.', titolo: 'La corona del re e la vasca da bagno', testo: R`La storia la racconta Vitruvio, un architetto romano vissuto quasi due secoli dopo. Gerone, re di Siracusa, aveva dato dell'oro a un orafo per farne una corona. Sospettava che l'orafo ne avesse tenuto una parte, mescolando argento. Chiese ad Archimede di scoprirlo senza rovinare la corona. Si racconta che la soluzione gli venne entrando nella vasca da bagno, mentre l'acqua saliva. Sarebbe corso per strada gridando «Eureka!», cioè «ho trovato». Immerse in acqua la corona e un blocco d'oro della stessa massa. La corona spostava più acqua: aveva più volume, quindi non era d'oro puro. Molti storici pensano che sia una leggenda. Già Galileo, nel 1586, propose un metodo più preciso, con una bilancia immersa nell'acqua.`, legame: R`Stessa massa e volume maggiore vuol dire densità minore: è il confronto fra densità.` },
    { fisico: 'Pierre Méchain', anni: '1744–1804', titolo: 'Il meridiano che fece nascere il metro', testo: R`Nel 1791 in Francia si decise che il metro sarebbe stato la decimilionesima parte della distanza fra il polo Nord e l'equatore. Bisognava misurare un tratto di meridiano, da Dunkerque a Barcellona. Il lavoro toccò a due astronomi: Jean-Baptiste Delambre al nord, Pierre Méchain al sud. Ci vollero più di sei anni, fra guerre e arresti. A Barcellona Méchain trovò due misure di latitudine che non andavano d'accordo. Non lo disse a nessuno, e il dubbio lo tormentò per anni. Morì nel 1804 di febbre gialla, in Spagna, mentre cercava di rifare le misure. Fu Delambre a scoprire il segreto nei suoi quaderni. Oggi sappiamo che quel metro è più corto del previsto di circa due decimi di millimetro.`, legame: R`È la nascita del metro, il campione di lunghezza da cui è partito il Sistema Internazionale.` },
    { fisico: 'Enrico Fermi', anni: '1901–1954', titolo: 'I pezzetti di carta e la bomba', testo: R`Il 16 luglio 1945, nel deserto del New Mexico, esplose la prima bomba atomica: il test Trinity. Enrico Fermi la osservò da circa 16 km di distanza. In mano aveva dei pezzetti di carta. Quando arrivò l'onda d'urto, li lasciò cadere da circa un metro e ottanta. L'aria li spinse di circa due metri e mezzo. Da quello spostamento Fermi stimò l'energia dell'esplosione: come diecimila tonnellate di tritolo. Gli strumenti diedero poi un valore circa doppio, ma l'ordine di grandezza era giusto. Fermi era famoso per queste stime veloci. Si racconta che ai suoi studenti chiedesse quanti accordatori di pianoforte ci fossero a Chicago.`, legame: R`Una stima ben fatta azzecca l'ordine di grandezza anche con dati approssimati.` },
    { fisico: 'Bryan Kibble', anni: '1938–2016', titolo: 'La bilancia che mandò in pensione il chilogrammo', testo: R`Dal 1889 il chilogrammo era un oggetto: un cilindretto di platino e iridio alto 39 mm. Lo custodiscono a Sèvres, vicino a Parigi, sotto tre campane di vetro. Lo chiamano «le Grand K». Le sue copie sparse nel mondo, confrontate dopo un secolo, non avevano più tutte la stessa massa. Le differenze erano di qualche decina di microgrammi. Non si poteva sapere se fosse cambiato il campione o le copie. Nel 1975 il fisico inglese Bryan Kibble, al National Physical Laboratory, propose una bilancia speciale. Confronta il peso di una massa con una forza elettrica e magnetica, misurata con enorme precisione. Grazie a bilance come la sua, dal 20 maggio 2019 il chilogrammo è definito da una costante della natura. Oggi quella bilancia porta il suo nome.`, legame: R`Racconta l'ultimo campione materiale del SI, e come le unità sono diventate uguali per tutti, ovunque.` },
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Il libro scritto in lingua matematica', testo: R`Nel 1623 Galileo pubblicò *Il Saggiatore*. Era una risposta polemica al gesuita Orazio Grassi, che aveva scritto sulle comete. Fra quelle pagine c'è un passo rimasto famoso. Galileo dice che l'universo è come un grandissimo libro, sempre aperto davanti ai nostri occhi. Però non si capisce se prima non si impara la lingua in cui è scritto. Quella lingua è la matematica: triangoli, cerchi e altre figure geometriche. Senza di essa, scrive, si gira a vuoto «per un oscuro laberinto». Per Galileo la natura si capisce con le misure e con i numeri, non con l'autorità degli antichi. È l'idea su cui si regge ancora oggi la fisica.`, legame: R`È il cuore del metodo sperimentale: le leggi fisiche sono relazioni fra grandezze misurabili.` }
  ]
});
})();
