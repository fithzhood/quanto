/* Quanto — L'incertezza della misura (primo anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/incertezza.js
   Simboli (come nell'Amaldi): errore assoluto e_a, errore relativo e_r, percentuale e_%, valore medio x̄.
   Niente Δx per l'errore: in cinematica Δ vuol dire sempre «finale meno iniziale». */
(function () {
const R = String.raw;

/* le tacche dei due righelli del grafico «righello»: generate qui, sono decine di segmenti uguali */
function tacche(y, conMillimetri) {
  const el = [{ tipo: 'segmento', da: [9.5, y], a: [16.5, y], colore: 'grigio' }];
  for (let k = 100; k <= 160; k++) {
    const x = k / 10, cm = k % 10 === 0;
    if (!cm && !conMillimetri) continue;
    const l = cm ? 0.42 : (k % 5 === 0 ? 0.3 : 0.18);
    el.push({ tipo: 'segmento', da: [x, y], a: [x, y - l], colore: 'grigio' });
    if (cm) el.push({ tipo: 'testo', p: [x, y - 0.95], testo: String(k / 10) });
  }
  return el;
}

QUANTO.registra({
  id: 'incertezza',
  titolo: 'L\'incertezza della misura',
  introduzione: R`Nessuna misura è perfetta. Misura due volte la lunghezza del banco, o il tempo di caduta di una pallina: difficilmente troverai lo stesso numero. Lo strumento ha dei limiti, la mano esita, l'occhio legge un po' di traverso.

L'**incertezza** dice quanto ci si può fidare di una misura. Il termometro segna 37,4 °C: è febbre o no? Un perno largo 25,0 mm entra in un foro da 25,1 mm? Il valore da solo non basta. Bisogna sapere anche di quanto potrebbe sbagliare. Per questo in fisica una misura si scrive sempre con il suo errore, per esempio $(2{,}4 \pm 0{,}1)\,\text{s}$.

Serve conoscere le unità del Sistema Internazionale e saper calcolare una media e una percentuale.`,
  inBreve: [
    R`Ogni misura ha un'incertezza. Con una sola misura l'**errore assoluto** è la sensibilità dello strumento.`,
    R`Gli errori **casuali** si riducono ripetendo la misura e facendo la media. Quelli **sistematici** no: vanno trovati e corretti.`,
    R`Con tante misure si calcolano il **valore medio** $\bar{x}$ e la **semidispersione** $e_a = \dfrac{x_{\text{max}} - x_{\text{min}}}{2}$. Il risultato si scrive $x = \bar{x} \pm e_a$, con l'unità.`,
    R`L'**errore relativo** $e_r = \dfrac{e_a}{\bar{x}}$ dice quanto è buona una misura: più è piccolo, meglio è.`,
    R`Somme e differenze: si sommano gli errori **assoluti**. Prodotti e quozienti: si sommano gli errori **relativi**.`,
    R`L'errore si scrive con una sola cifra significativa, e il valore si ferma alla stessa cifra decimale.`
  ],
  sezioni: [
    {
      id: 'strumenti',
      titolo: 'Gli strumenti di misura',
      testo: R`Prima di misurare bisogna conoscere lo strumento. Una bilancia da cucina, un righello, un cronometro: ognuno ha i suoi limiti. Tre caratteristiche li descrivono.

[[video:incertezza/strumenti]]

>* La **portata** è il valore più grande che lo strumento può misurare. La **sensibilità** è la variazione più piccola che riesce a leggere. La **prontezza** dice quanto in fretta lo strumento dà la misura.

Un righello scolastico ha una portata di 30 cm. Le tacche sono a ogni millimetro, quindi la sensibilità è 1 mm. Un termometro da febbre ha una portata piccola, poco più di 40 °C. In compenso legge i decimi di grado: sensibilità 0,1 °C.

La prontezza conta quando la grandezza cambia. Un termometro digitale dà la temperatura in pochi secondi. Uno a liquido ci mette qualche minuto: se leggi troppo presto, la misura è sbagliata.

Con una sola misura, l'incertezza è la sensibilità dello strumento. Si chiama **errore assoluto** e si scrive dopo il valore, con il segno $\pm$ (più o meno).

Esempio. Misuro un astuccio con il righello e leggo 18,7 cm. Il righello legge i millimetri, cioè $0{,}1\,\text{cm}$. Scrivo:

$$L = (18{,}7 \pm 0{,}1)\,\text{cm}$$

Le parentesi dicono che i centimetri valgono per tutti e due i numeri.

> Alcuni libri prendono come errore metà della sensibilità. Qui usiamo la sensibilità intera, la scelta più prudente.

>! In fisica «errore» non vuol dire sbaglio. Vuol dire incertezza: anche la misura fatta meglio ne ha una.

>! Oltre la portata lo strumento non misura. Segna «errore», o peggio dà un numero falso. Una bilancia da cucina non pesa una persona.

?? Un cronometro mostra i centesimi di secondo. Qual è la sua sensibilità?
[ ] $1\,\text{s}$
[x] $0{,}01\,\text{s}$
[ ] $0{,}1\,\text{s}$
=> La variazione più piccola che legge è un centesimo di secondo. Attenzione però: la mano che preme il pulsante è molto meno precisa del cronometro.`
    },
    {
      id: 'casuali-sistematici',
      titolo: 'Errori casuali ed errori sistematici',
      testo: R`Misura dieci volte, con il cronometro, il tempo di caduta di una pallina. Otterrai numeri un po' diversi. A volte premi il pulsante troppo presto, a volte troppo tardi.

>* Gli **errori casuali** spostano la misura a volte in più, a volte in meno, senza una regola. Gli **errori sistematici** la spostano sempre nello stesso verso.

Errori casuali sono i riflessi della mano, una tacca letta un po' a occhio, una corrente d'aria. Non si possono evitare. Però si riducono ripetendo la misura e facendo la media: quelli in più e quelli in meno si compensano.

Errori sistematici sono una bilancia che a vuoto segna già qualcosa, un orologio che va avanti, un righello consumato all'inizio. Anche guardare la scala sempre di traverso, dallo stesso lato, dà un errore sistematico: si chiama **errore di parallasse**. Ripetere non serve, perché ogni misura ha lo stesso errore. Bisogna trovare la causa e correggerla.

Esempio. Una bilancia a vuoto segna 15 g. Con un sacchetto di mele segna 840 g.

~ m_{\text{letta}} = 840\,\text{g} :: la bilancia con le mele sopra
~ m = 840\,\text{g} - 15\,\text{g} :: tolgo quello che segna a vuoto: è l'errore sistematico
~ m = \evidb{825\,\text{g}} :: la massa vera delle mele

Sulle bilance digitali c'è un tasto apposta, la **tara**: rimette lo zero dove deve stare.

Pensa alle misure come a frecce tirate su un bersaglio. Il centro è il valore vero.

[[grafico:bersaglio]]

Una misura con pochi errori casuali si dice **precisa**. Una misura senza errori sistematici si dice **accurata**. Servono tutte e due le cose.

>! Ripetere una misura cento volte non toglie un errore sistematico. La media di cento pesate con 15 g di troppo ha ancora 15 g di troppo.

?? Un orologio va avanti di due minuti al giorno. Che errore dà sulle misure di tempo?
[x] un errore sistematico
[ ] un errore casuale
[ ] nessun errore, se si ripete la misura molte volte
=> Sbaglia sempre nello stesso verso, cioè segna sempre più tempo del vero. È un errore sistematico: ripetere la misura non lo toglie.`
    },
    {
      id: 'valore-medio',
      titolo: 'Il valore medio e la semidispersione',
      testo: R`Hai ripetuto la stessa misura molte volte e hai tanti numeri un po' diversi. Quale scrivere? E quanto è grande l'incertezza?

[[video:incertezza/misure-ripetute]]

Gli errori casuali vanno a volte in più e a volte in meno. Facendo la media, in buona parte si compensano. Per questo il valore più attendibile è la media delle misure.

>* Il **valore medio** è la somma delle misure divisa per il loro numero: $\bar{x} = \dfrac{x_1 + x_2 + \ldots + x_n}{n}$. La **semidispersione** è metà della differenza fra la misura più grande e la più piccola: $e_a = \dfrac{x_{\text{max}} - x_{\text{min}}}{2}$.

$\bar{x}$ si legge «x medio». La semidispersione fa da errore assoluto. È una scelta prudente: dice l'errore massimo che ci si può aspettare.

Esempio. Una macchinina scende da una rampa. Misuro otto volte il tempo della discesa, in secondi: 1,52; 1,48; 1,55; 1,50; 1,47; 1,53; 1,50; 1,51.

~ \bar{t} = \dfrac{12{,}06\,\text{s}}{8} = 1{,}5075\,\text{s} :: la somma delle otto misure, divisa per 8
~ e_a = \dfrac{1{,}55 - 1{,}47}{2}\,\text{s} = 0{,}04\,\text{s} :: la misura più grande meno la più piccola, diviso due
~ t = \evidb{(1{,}51 \pm 0{,}04)\,\text{s}} :: il valore medio si ferma ai centesimi, come l'errore

Nel grafico ogni punto è una misura. Si vede che le misure si addensano intorno alla media.

[[grafico:dispersione]]

>! Se tutte le misure sono uguali, la semidispersione viene zero. Ma l'errore non è zero: lo strumento ha sempre la sua sensibilità. Se la semidispersione è più piccola della sensibilità, come errore si prende la sensibilità.

?? Tre misure di un tempo: 4,2 s, 4,4 s e 4,6 s. Quanto vale il valore medio?
[ ] $13{,}2\,\text{s}$
[x] $4{,}4\,\text{s}$
[ ] $4{,}6\,\text{s}$
=> La somma è $13{,}2\,\text{s}$, e va divisa per il numero di misure: $\dfrac{13{,}2\,\text{s}}{3} = 4{,}4\,\text{s}$.`
    },
    {
      id: 'risultato',
      titolo: 'Come si scrive il risultato',
      testo: R`Una misura scritta bene dice due cose: quanto vale la grandezza e quanto ci si può fidare di quel valore.

>* Il risultato di una misura si scrive $x = \bar{x} \pm e_a$, con l'unità di misura. Il valore vero, quasi certamente, sta fra $\bar{x} - e_a$ e $\bar{x} + e_a$.

Il pendolo del video sulle misure ripetute ha periodo $T = (2{,}4 \pm 0{,}1)\,\text{s}$. Il periodo vero sta fra 2,3 s e 2,5 s. Questo tratto si chiama **intervallo di incertezza**.

### Gli arrotondamenti

La calcolatrice dà tante cifre, ma quasi tutte sono rumore. Ci sono due regole.

1. L'errore si arrotonda a **una cifra significativa**, cioè alla prima cifra diversa da zero.
2. Il valore medio si arrotonda **alla stessa cifra decimale** dell'errore.

~ \bar{x} = 7{,}4628\,\text{cm} :: il valore medio, come esce dalla calcolatrice
~ e_a = 0{,}0371\,\text{cm} :: la semidispersione, anche lei con troppe cifre
~ e_a \approx 0{,}04\,\text{cm} :: la prima cifra diversa da zero è il 3; dopo c'è un 7, quindi sale a 4
~ \bar{x} \approx 7{,}46\,\text{cm} :: anche il valore si ferma ai centesimi
~ x = \evidb{(7{,}46 \pm 0{,}04)\,\text{cm}} :: il risultato scritto bene

>! Scrivere $(7{,}4628 \pm 0{,}04)\,\text{cm}$ non ha senso. Se l'incertezza è di qualche centesimo, i millesimi e i decimillesimi sono inventati.

### Misure compatibili

Anna e Luca misurano lo stesso pendolo e trovano valori diversi. Uno dei due ha sbagliato? Non per forza. Due misure della stessa grandezza si dicono **compatibili** se i loro intervalli di incertezza si toccano o si sovrappongono.

[[grafico:compatibili]]

Se gli intervalli sono staccati, la differenza è più grande dell'incertezza. Allora c'è qualcosa da capire: un errore sistematico, oppure le grandezze misurate non sono proprio le stesse.

?? Due misure della stessa lunghezza: $(12{,}0 \pm 0{,}5)\,\text{cm}$ e $(12{,}8 \pm 0{,}2)\,\text{cm}$. Sono compatibili?
[ ] sì, perché la differenza è piccola
[x] no, perché gli intervalli non si toccano
[ ] sì, perché tutte e due sono vicine a 12 cm
=> Il primo intervallo va da 11,5 a 12,5 cm, il secondo da 12,6 a 13,0 cm. Fra 12,5 e 12,6 c'è un buco: non sono compatibili.`
    },
    {
      id: 'errore-relativo',
      titolo: 'L\'errore relativo',
      testo: R`Sbagliare di un millimetro è tanto o poco? Dipende da che cosa misuri.

[[video:incertezza/errore-relativo]]

Sul lato di un foglio A4, lungo 297 mm, un millimetro quasi non si vede. Sullo spessore di un capello, circa 0,07 mm, sarebbe un disastro. L'errore assoluto da solo non basta per giudicare una misura. Conta il rapporto fra l'errore e il valore.

>* L'**errore relativo** è l'errore assoluto diviso il valore misurato: $e_r = \dfrac{e_a}{\bar{x}}$. È un numero puro, senza unità. Moltiplicato per 100 dà l'**errore percentuale** $e_\%$.

Esempio. La lunghezza di un'aula, misurata con un metro a nastro, è $(6{,}25 \pm 0{,}01)\,\text{m}$.

~ e_r = \dfrac{e_a}{\bar{x}} = \dfrac{0{,}01\,\text{m}}{6{,}25\,\text{m}} :: errore assoluto diviso il valore
~ e_r = 0{,}0016 :: i metri si semplificano: resta un numero puro
~ e_\% = \evidb{0{,}16\%} :: per 100, in percentuale: meno di due parti su mille

Più l'errore relativo è piccolo, migliore è la misura. Così si possono confrontare anche misure di grandezze diverse, per esempio una lunghezza e una massa.

Nel grafico l'errore assoluto resta sempre 1 mm: più lunga è la misura, più piccolo è l'errore relativo.

[[grafico:relativo]]

>! L'errore relativo non ha unità di misura: metri diviso metri dà un numero. Se nel risultato ti restano dei metri, hai dimenticato di dividere per il valore.

?? Quale di queste due misure è migliore: $(50 \pm 1)\,\text{g}$ oppure $(500 \pm 2)\,\text{g}$?
[x] $(500 \pm 2)\,\text{g}$
[ ] $(50 \pm 1)\,\text{g}$, perché ha l'errore più piccolo
[ ] sono buone uguali
=> Contano gli errori relativi: $1 : 50 = 2\%$ e $2 : 500 = 0{,}4\%$. La seconda ha l'errore assoluto più grande, ma è cinque volte migliore.`
    },
    {
      id: 'propagazione',
      titolo: 'La propagazione degli errori',
      testo: R`Spesso una grandezza non si misura direttamente: si calcola. L'area di un rettangolo viene da due lati, la densità dalla massa e dal volume. Se i dati hanno un errore, ce l'ha anche il risultato.

[[video:incertezza/propagazione]]

### Somme e differenze

I lati di un rettangolo sono $a = (20{,}0 \pm 0{,}1)\,\text{cm}$ e $b = (10{,}0 \pm 0{,}1)\,\text{cm}$. Messi in fila fanno 30,0 cm. Nel caso peggiore sono tutti e due più lunghi: 30,2 cm. Oppure tutti e due più corti: 29,8 cm. L'errore della somma è 0,2 cm, cioè la somma dei due errori.

>! Anche nella differenza gli errori si sommano, non si sottraggono. La differenza $a - b$ vale al massimo $(20{,}1 - 9{,}9)\,\text{cm} = 10{,}2\,\text{cm}$ e al minimo $(19{,}9 - 10{,}1)\,\text{cm} = 9{,}8\,\text{cm}$.

### Prodotti e quozienti

L'area vale $20{,}0 \cdot 10{,}0 = 200\,\text{cm}^2$. Il rettangolo più grande ha area 203,01 cm², il più piccolo 197,01 cm². L'errore è circa 3 cm². Si arriva allo stesso numero con gli errori relativi: $0{,}5\% + 1\% = 1{,}5\%$, e l'1,5% di 200 cm² è 3 cm².

[[grafico:rettangolo]]

>* Nelle **somme e differenze** si sommano gli errori **assoluti**. Nei **prodotti e quozienti** si sommano gli errori **relativi**.

Esempio. Un ciclista percorre $\Delta s = (100{,}0 \pm 0{,}5)\,\text{m}$ in $t = (12{,}5 \pm 0{,}1)\,\text{s}$.

~ v = \dfrac{100{,}0\,\text{m}}{12{,}5\,\text{s}} = 8{,}0\,\text{m/s} :: la velocità è spazio percorso diviso tempo: un quoziente
~ e_r(\Delta s) = \dfrac{0{,}5}{100{,}0} = 0{,}5\% :: l'errore relativo dello spazio percorso
~ e_r(t) = \dfrac{0{,}1}{12{,}5} = 0{,}8\% :: l'errore relativo del tempo
~ e_r(v) = 1{,}3\% :: in un quoziente si sommano: $0{,}5\% + 0{,}8\%$
~ e_a(v) = 0{,}013 \cdot 8{,}0\,\text{m/s} :: torno all'errore assoluto: l'1,3% è 0,013
~ v = \evidb{(8{,}0 \pm 0{,}1)\,\text{m/s}} :: l'errore, circa 0,104 m/s, con una cifra diventa 0,1

Il quadrato è un prodotto: $a^2 = a \cdot a$. Quindi l'errore relativo raddoppia; nel cubo triplica.

> Moltiplicare per un numero esatto moltiplica anche l'errore. Il periodo di un pendolo è il tempo di dieci oscillazioni diviso 10: anche l'errore si divide per 10.

?? Una differenza di masse: $(50 \pm 2)\,\text{g} - (30 \pm 1)\,\text{g}$. Quanto vale l'errore del risultato?
[ ] $1\,\text{g}$
[ ] $2\,\text{g}$
[x] $3\,\text{g}$
=> Nella differenza gli errori assoluti si sommano: $2\,\text{g} + 1\,\text{g} = 3\,\text{g}$. Il risultato è $(20 \pm 3)\,\text{g}$.`
    },
    {
      id: 'cifre-significative',
      titolo: 'Le cifre significative',
      testo: R`Scrivere 12 cm o 12,0 cm non è la stessa cosa. Lo zero finale dice che hai letto anche i millimetri.

[[video:incertezza/cifre-significative]]

>* Le **cifre significative** di una misura sono le cifre certe più la prima cifra incerta.

Con un righello che ha solo i centimetri si legge 12 cm: due cifre, e la seconda è già incerta. Con i millimetri si legge 12,0 cm: tre cifre.

Ci sono tre regole per contarle.

- Gli zeri **davanti** non contano: dicono solo dove sta la virgola. $0{,}120\,\text{m}$ ha tre cifre, come $12{,}0\,\text{cm}$.
- Gli zeri **in fondo** contano: sono cifre misurate.
- Gli zeri **in mezzo** contano sempre: $3{,}04$ ha tre cifre.

[[grafico:righello]]

Un numero come 1500 m è ambiguo: gli zeri sono misurati o servono solo a riempire? La notazione scientifica toglie il dubbio. $1{,}5 \cdot 10^3\,\text{m}$ ha due cifre, $1{,}500 \cdot 10^3\,\text{m}$ ne ha quattro.

### Nei calcoli

In un prodotto o in un quoziente il risultato ha tante cifre quante il dato che ne ha meno.

~ A = 12{,}3\,\text{cm} \cdot 4{,}5\,\text{cm} :: l'area del rettangolo del video
~ A = 55{,}35\,\text{cm}^2 :: quello che dà la calcolatrice
~ 4{,}5\ \text{ha due cifre significative} :: è il dato meno preciso
~ A \approx \evidb{55\,\text{cm}^2} :: due cifre; dopo c'è un 3, quindi si arrotonda in giù

In una somma o in una differenza conta la posizione. Si tengono tanti decimali quanti il dato che ne ha meno: $12{,}5\,\text{cm} + 3{,}27\,\text{cm} = 15{,}77\,\text{cm} \approx 15{,}8\,\text{cm}$.

Quando la misura ha il suo errore, decide l'errore: l'ultima cifra del valore sta nella stessa posizione dell'errore.

> Negli esercizi i dati come $g = 9{,}8\,\text{m/s}^2$ si trattano come esatti: la regola delle cifre vale per le misure.

>! Come si arrotonda: se la prima cifra tolta è 5 o più, l'ultima cifra tenuta sale di uno. Così 57,6 diventa 58, ma 55,35 diventa 55.

?? Quante cifre significative ha $0{,}0300\,\text{kg}$?
[ ] una
[x] tre
[ ] cinque
=> Gli zeri davanti non contano. Contano il 3 e i due zeri finali, che sono cifre misurate.`
    }
  ],
  grafici: {
    /* il bersaglio: misure sparse ma centrate (errori casuali), misure strette ma spostate (errore sistematico) */
    bersaglio: {
      tipo: 'piano', x: [-7, 7], y: [-4.7, 3.4], assi: false, griglia: false,
      elementi: [
        { tipo: 'cerchio', centro: [-3.6, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'cerchio', centro: [-3.6, 0], raggio: 2, colore: 'grigio' },
        { tipo: 'cerchio', centro: [-3.6, 0], raggio: 1, colore: 'grigio' },
        { tipo: 'cerchio', centro: [3.6, 0], raggio: 3, colore: 'grigio' },
        { tipo: 'cerchio', centro: [3.6, 0], raggio: 2, colore: 'grigio' },
        { tipo: 'cerchio', centro: [3.6, 0], raggio: 1, colore: 'grigio' },
        { tipo: 'punto', p: [-4.5, 0.8], colore: 'grigio' }, { tipo: 'punto', p: [-2.8, 1.3], colore: 'grigio' },
        { tipo: 'punto', p: [-2.4, -0.6], colore: 'grigio' }, { tipo: 'punto', p: [-4, -1.5], colore: 'grigio' },
        { tipo: 'punto', p: [-5.1, -0.3], colore: 'grigio' }, { tipo: 'punto', p: [-3.3, 0.3], colore: 'grigio' },
        { tipo: 'punto', p: [-3.8, 1.9], colore: 'grigio' }, { tipo: 'punto', p: [-3, -1.4], colore: 'grigio' },
        { tipo: 'punto', p: [4.8, 1.5], colore: 'grigio' }, { tipo: 'punto', p: [5.2, 1.2], colore: 'grigio' },
        { tipo: 'punto', p: [5, 0.95], colore: 'grigio' }, { tipo: 'punto', p: [4.6, 1.15], colore: 'grigio' },
        { tipo: 'punto', p: [5.35, 1.6], colore: 'grigio' }, { tipo: 'punto', p: [4.95, 1.75], colore: 'grigio' },
        { tipo: 'punto', p: [5.45, 1.05], colore: 'grigio' }, { tipo: 'punto', p: [4.7, 1.85], colore: 'grigio' },
        { tipo: 'testo', p: [-3.6, -4.1], testo: 'errori casuali' },
        { tipo: 'testo', p: [3.6, -4.1], testo: 'errore sistematico' }
      ],
      didascalia: 'Il centro è il valore vero, ogni punto una misura. A sinistra le misure sono sparse, ma intorno al centro: la media è buona. A destra sono vicine fra loro, ma tutte spostate dalla stessa parte: c\'è un errore sistematico.'
    },
    /* le otto misure della macchinina sulla rampa, in fila su una scala dei tempi; le due da 1,50 s una sopra l'altra */
    dispersione: {
      tipo: 'piano', x: [1.435, 1.585], y: [-1.5, 3.7], assi: false, griglia: false, proporzioni: 'libere', altezza: 320, mirino: false,
      elementi: [
        { tipo: 'segmento', da: [1.44, 0], a: [1.58, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [1.45, 0], a: [1.45, -0.3], colore: 'grigio' },
        { tipo: 'segmento', da: [1.50, 0], a: [1.50, -0.3], colore: 'grigio' },
        { tipo: 'segmento', da: [1.55, 0], a: [1.55, -0.3], colore: 'grigio' },
        { tipo: 'testo', p: [1.45, -0.95], testo: '1,45' },
        { tipo: 'testo', p: [1.50, -0.95], testo: '1,50' },
        { tipo: 'testo', p: [1.55, -0.95], testo: '1,55' },
        { tipo: 'testo', p: [1.583, -0.95], testo: 't (s)', ancora: 'end' },
        { tipo: 'segmento', da: [1.5075, 0], a: [1.5075, 2.9], colore: 3, tratteggio: true },
        { tipo: 'testo', p: [1.5075, 3.25], testo: 'valore medio ≈ 1,51 s', colore: 3 },
        { tipo: 'segmento', da: [1.47, 1.95], a: [1.55, 1.95], colore: 'grigio' },
        { tipo: 'segmento', da: [1.47, 1.75], a: [1.47, 2.15], colore: 'grigio' },
        { tipo: 'segmento', da: [1.55, 1.75], a: [1.55, 2.15], colore: 'grigio' },
        { tipo: 'testo', p: [1.583, 2.45], testo: 'max − min = 0,08 s', ancora: 'end' },
        { tipo: 'punto', p: [1.47, 0.5], colore: 'grigio' }, { tipo: 'punto', p: [1.48, 0.5], colore: 'grigio' },
        { tipo: 'punto', p: [1.50, 0.5], colore: 'grigio' }, { tipo: 'punto', p: [1.50, 1.15], colore: 'grigio' },
        { tipo: 'punto', p: [1.51, 0.5], colore: 'grigio' }, { tipo: 'punto', p: [1.52, 0.5], colore: 'grigio' },
        { tipo: 'punto', p: [1.53, 0.5], colore: 'grigio' }, { tipo: 'punto', p: [1.55, 0.5], colore: 'grigio' }
      ],
      didascalia: 'Le otto discese della macchinina, una per punto: due sono uguali, 1,50 s. La linea tratteggiata è il valore medio. La semidispersione è metà del tratto fra la misura più piccola e la più grande: 0,08 s diviso 2, cioè 0,04 s.'
    },
    /* due misure dello stesso pendolo: Anna ferma, Luca con il cursore; compatibili se gli intervalli si toccano */
    compatibili: {
      tipo: 'retta-reale', x: [2, 3], passo: 0.2,
      parametri: [{ nome: 'b', min: 2.3, max: 2.9, passo: 0.05, valore: 2.7, etichetta: 'misura di Luca (s)' }],
      intervalli: [
        { da: 2.3, a: 2.5, chiusoDa: true, chiusoA: true, colore: 3, etichetta: 'Anna: 2,4 s', riga: 0 },
        { da: 'b - 0.1', a: 'b + 0.1', chiusoDa: true, chiusoA: true, colore: 3, etichetta: 'Luca: {{b}} s', riga: 1 }
      ],
      didascalia: 'Anna misura (2,4 ± 0,1) s. Luca trova un altro valore, con lo stesso errore: scegli il suo valore con il cursore. Se i due intervalli si toccano o si sovrappongono, le misure sono compatibili.'
    },
    /* errore assoluto fisso (1 mm): l'errore relativo scende come 1 / misura */
    relativo: {
      tipo: 'piano', x: [0, 280], y: [0, 20], passo: [100, 5], altezza: 380, proporzioni: 'libere',
      etichette: { x: 'misura (mm)', y: 'errore relativo (%)' },
      parametri: [{ nome: 'L', min: 20, max: 230, passo: 5, valore: 40, etichetta: 'misura (mm)' }],
      funzioni: [{ f: '100/x', dominio: [5, 230], colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: ['L', 0], a: ['L', '100/L'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['L', '100/L'], colore: 3 },
        { tipo: 'testo', p: [272, 17.6], testo: '1 mm su {{L}} mm = {{100/L}} %', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'errore assoluto resta 1 mm, come con il righello. L\'errore relativo è 1 mm diviso la misura: più la misura è lunga, più è piccolo.'
    },
    /* il rettangolo del video: la cornice degli errori, disegnata 10 volte più grande; l'area vera sta fra i due rettangoli */
    rettangolo: {
      tipo: 'piano', x: [-4, 24], y: [-8.6, 13.6], assi: false, griglia: false,
      parametri: [
        { nome: 'ea', min: 0, max: 0.3, passo: 0.05, valore: 0.1, etichetta: 'errore su a (cm)' },
        { nome: 'eb', min: 0, max: 0.3, passo: 0.05, valore: 0.1, etichetta: 'errore su b (cm)' }
      ],
      elementi: [
        { tipo: 'poligono', punti: [['-10*ea', '-10*eb'], ['20 + 10*ea', '-10*eb'], ['20 + 10*ea', '10 + 10*eb'], ['-10*ea', '10 + 10*eb']], colore: 'grigio' },
        { tipo: 'poligono', punti: [['10*ea', '10*eb'], ['20 - 10*ea', '10*eb'], ['20 - 10*ea', '10 - 10*eb'], ['10*ea', '10 - 10*eb']], colore: 3 },
        { tipo: 'segmento', da: [0, 0], a: [20, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [20, 0], a: [20, 10], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [20, 10], a: [0, 10], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 10], a: [0, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [10, 6.2], testo: 'a = (20,0 ± {{ea}}) cm' },
        { tipo: 'testo', p: [10, 3.6], testo: 'b = (10,0 ± {{eb}}) cm' },
        { tipo: 'testo', p: [10, -4.6], testo: 'area più grande: {{(20 + ea)*(10 + eb)}} cm²' },
        { tipo: 'testo', p: [10, -6.1], testo: 'area più piccola: {{(20 - ea)*(10 - eb)}} cm²' },
        { tipo: 'testo', p: [10, -7.6], testo: 'errore dell\'area ≈ {{((20 + ea)*(10 + eb) - (20 - ea)*(10 - eb))/2}} cm²', colore: 3 }
      ],
      didascalia: 'Il rettangolo del video: a orizzontale, b verticale. La cornice grigia mostra gli errori, disegnati 10 volte più grandi. L\'area vera sta fra il rettangolo interno e quello esterno.'
    },
    /* la stessa matita con due righelli: solo centimetri (13 cm, due cifre) e millimetri (13,4 cm, tre cifre) */
    righello: {
      tipo: 'piano', x: [9.2, 17.2], y: [-2.7, 3.7], assi: false, griglia: false,
      elementi: [
        { tipo: 'testo', p: [9.4, 3.3], testo: 'righello con i soli centimetri', ancora: 'start' },
        { tipo: 'poligono', punti: [[8.5, 2.25], [13.0, 2.25], [13.4, 2.45], [13.0, 2.65], [8.5, 2.65]], colore: 'grigio' },
        { tipo: 'testo', p: [13.65, 2.33], testo: 'si legge 13 cm', ancora: 'start', colore: 3 }
      ].concat(tacche(2.0, false)).concat([
        { tipo: 'testo', p: [9.4, 0.25], testo: 'righello con i millimetri', ancora: 'start' },
        { tipo: 'poligono', punti: [[8.5, -0.55], [13.0, -0.55], [13.4, -0.35], [13.0, -0.15], [8.5, -0.15]], colore: 'grigio' },
        { tipo: 'testo', p: [13.65, -0.47], testo: 'si legge 13,4 cm', ancora: 'start', colore: 3 }
      ]).concat(tacche(-0.8, true)),
      didascalia: 'La stessa matita con due righelli. Con i soli centimetri si scrive 13 cm: due cifre significative, e il 3 è già incerto. Con i millimetri si legge 13,4 cm: tre cifre.'
    }
  },
  esempi: [
    {
      titolo: 'Cinque misure del tempo di caduta',
      problema: R`Una pallina cade dal banco. Con il cronometro misuri cinque volte il tempo di caduta: 0,42 s; 0,46 s; 0,41 s; 0,44 s; 0,47 s. Scrivi il risultato con il suo errore.`,
      passi: [
        R`Dati: $t_1 = 0{,}42\,\text{s}$, $t_2 = 0{,}46\,\text{s}$, $t_3 = 0{,}41\,\text{s}$, $t_4 = 0{,}44\,\text{s}$, $t_5 = 0{,}47\,\text{s}$. Cerco il valore medio $\bar{t}$, l'errore assoluto $e_a$ e il risultato scritto bene.`,
        R`Valore medio: sommo le misure e divido per 5. $\bar{t} = \dfrac{2{,}20\,\text{s}}{5} = 0{,}44\,\text{s}$.`,
        R`Semidispersione: la più grande è 0,47 s, la più piccola 0,41 s. $e_a = \dfrac{0{,}47\,\text{s} - 0{,}41\,\text{s}}{2} = 0{,}03\,\text{s}$.`,
        R`L'errore ha già una sola cifra significativa, e il valore medio è già ai centesimi. Il risultato è $t = (0{,}44 \pm 0{,}03)\,\text{s}$.`,
        R`Controllo: l'intervallo va da 0,41 s a 0,47 s, e tutte le misure ci stanno dentro.`
      ],
      risultato: R`$t = (0{,}44 \pm 0{,}03)\,\text{s}$`
    },
    {
      titolo: 'Una lunghezza e una massa a confronto',
      problema: R`La lunghezza di un banco è $(120 \pm 1)\,\text{cm}$. La massa di una moneta è $(2{,}3 \pm 0{,}1)\,\text{g}$. Quale delle due misure è migliore?`,
      passi: [
        R`Dati: $L = (120 \pm 1)\,\text{cm}$, $m = (2{,}3 \pm 0{,}1)\,\text{g}$. Cerco l'errore relativo di ciascuna misura.`,
        R`Gli errori assoluti non si possono confrontare: uno è in centimetri, l'altro in grammi. Servono gli errori relativi, che sono numeri puri.`,
        R`Banco: $e_r = \dfrac{1\,\text{cm}}{120\,\text{cm}} \approx 0{,}008$, cioè circa lo $0{,}8\%$.`,
        R`Moneta: $e_r = \dfrac{0{,}1\,\text{g}}{2{,}3\,\text{g}} \approx 0{,}04$, cioè circa il $4\%$.`,
        R`L'errore relativo del banco è circa cinque volte più piccolo: la misura del banco è migliore.`
      ],
      risultato: R`È migliore la misura del banco: circa $0{,}8\%$ contro circa $4\%$.`
    },
    {
      titolo: 'La massa di un liquido',
      problema: R`Un becher pieno d'acqua pesa $(250 \pm 1)\,\text{g}$. Vuoto pesa $(110 \pm 1)\,\text{g}$. Quanta acqua contiene, e con che errore?`,
      passi: [
        R`Dati: $m_{\text{pieno}} = (250 \pm 1)\,\text{g}$, $m_{\text{vuoto}} = (110 \pm 1)\,\text{g}$. Cerco la massa dell'acqua con il suo errore.`,
        R`La massa dell'acqua è una differenza: $m = 250\,\text{g} - 110\,\text{g} = 140\,\text{g}$.`,
        R`In una differenza gli errori assoluti si sommano: $e_a = 1\,\text{g} + 1\,\text{g} = 2\,\text{g}$.`,
        R`Controllo con i casi estremi: al massimo $(251 - 109)\,\text{g} = 142\,\text{g}$, al minimo $(249 - 111)\,\text{g} = 138\,\text{g}$. Sono proprio $140 \pm 2$.`
      ],
      risultato: R`$m = (140 \pm 2)\,\text{g}$`
    },
    {
      titolo: 'La densità di un sasso',
      problema: R`Un sasso ha massa $m = (54{,}0 \pm 0{,}5)\,\text{g}$. Immerso in un cilindro graduato, fa salire l'acqua di $V = (20{,}0 \pm 0{,}5)\,\text{cm}^3$. Quanto vale la densità, con il suo errore?`,
      passi: [
        R`Dati: $m = (54{,}0 \pm 0{,}5)\,\text{g}$, $V = (20{,}0 \pm 0{,}5)\,\text{cm}^3$. Cerco la densità $d$ e il suo errore assoluto.`,
        R`Densità: $d = \dfrac{m}{V} = \dfrac{54{,}0\,\text{g}}{20{,}0\,\text{cm}^3} = 2{,}70\,\text{g/cm}^3$.`,
        R`È un quoziente, quindi servono gli errori relativi. $e_r(m) = \dfrac{0{,}5}{54{,}0} \approx 0{,}9\%$ e $e_r(V) = \dfrac{0{,}5}{20{,}0} = 2{,}5\%$.`,
        R`Si sommano: $e_r(d) \approx 0{,}9\% + 2{,}5\% = 3{,}4\%$.`,
        R`Errore assoluto: $e_a = 3{,}4\% \cdot 2{,}70\,\text{g/cm}^3 \approx 0{,}09\,\text{g/cm}^3$. Il volume, che ha l'errore relativo più grande, pesa di più sul risultato.`,
        R`Controllo: $2{,}70\,\text{g/cm}^3$ è la densità dell'alluminio, e anche quella di molte rocce. Il numero è ragionevole.`
      ],
      risultato: R`$d = (2{,}70 \pm 0{,}09)\,\text{g/cm}^3$`
    },
    {
      titolo: 'Il periodo da dieci oscillazioni',
      problema: R`Ogni volta che premi il pulsante del cronometro sbagli di circa un decimo di secondo. Per misurare il periodo di un pendolo cronometri dieci oscillazioni di fila: $t = (24{,}0 \pm 0{,}2)\,\text{s}$. Quanto vale il periodo, con il suo errore?`,
      passi: [
        R`Dati: $t = (24{,}0 \pm 0{,}2)\,\text{s}$ per 10 oscillazioni. Cerco il periodo $T$, cioè la durata di una oscillazione, e il suo errore.`,
        R`Il periodo è il tempo diviso 10: $T = \dfrac{24{,}0\,\text{s}}{10} = 2{,}40\,\text{s}$.`,
        R`Dividere per un numero esatto divide anche l'errore: $e_a = \dfrac{0{,}2\,\text{s}}{10} = 0{,}02\,\text{s}$.`,
        R`Il risultato è $T = (2{,}40 \pm 0{,}02)\,\text{s}$. Cronometrando una sola oscillazione, l'errore sarebbe stato lo stesso, $0{,}2\,\text{s}$: dieci volte di più.`,
        R`Controllo con gli errori relativi: $\dfrac{0{,}2}{24{,}0} \approx 0{,}8\%$ e $\dfrac{0{,}02}{2{,}40} \approx 0{,}8\%$. Dividere per 10 non cambia l'errore relativo.`
      ],
      risultato: R`$T = (2{,}40 \pm 0{,}02)\,\text{s}$`
    },
    {
      titolo: 'Il volume di un cubetto',
      problema: R`Lo spigolo di un cubetto di legno misura $l = (3{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale il volume, con il suo errore?`,
      passi: [
        R`Dati: $l = (3{,}0 \pm 0{,}1)\,\text{cm}$. Cerco il volume $V = l^3$ e il suo errore assoluto.`,
        R`Volume: $V = (3{,}0\,\text{cm})^3 = 27\,\text{cm}^3$.`,
        R`Errore relativo dello spigolo: $e_r(l) = \dfrac{0{,}1}{3{,}0} \approx 3{,}3\%$.`,
        R`Il cubo è un prodotto di tre fattori uguali, $l \cdot l \cdot l$: gli errori relativi si sommano tre volte. $e_r(V) = 3 \cdot 3{,}3\% \approx 10\%$.`,
        R`Errore assoluto: il $10\%$ di $27\,\text{cm}^3$ è $2{,}7\,\text{cm}^3$, che con una cifra diventa $3\,\text{cm}^3$.`,
        R`Controllo con i casi estremi: $3{,}1^3 \approx 29{,}8$ e $2{,}9^3 \approx 24{,}4$. L'intervallo è largo circa $5{,}4\,\text{cm}^3$: metà fa $2{,}7$. Torna.`
      ],
      risultato: R`$V = (27 \pm 3)\,\text{cm}^3$`
    }
  ],
  formulario: [
    { nome: 'Errore di una sola misura', formula: R`e_a = \text{sensibilità dello strumento}`, nota: R`Con una misura sola l'incertezza è la variazione più piccola che lo strumento legge.` },
    { nome: 'Valore medio', formula: R`\bar{x} = \dfrac{x_1 + x_2 + \ldots + x_n}{n}`, nota: R`La somma delle $n$ misure divisa per $n$. È il valore più attendibile.` },
    { nome: 'Semidispersione', formula: R`e_a = \dfrac{x_{\text{max}} - x_{\text{min}}}{2}`, nota: R`Fa da errore assoluto con misure ripetute. Se è minore della sensibilità, si prende la sensibilità.` },
    { nome: 'Il risultato di una misura', formula: R`x = \bar{x} \pm e_a`, nota: R`Errore con una cifra significativa, valore arrotondato alla stessa cifra decimale. Per esempio $(2{,}4 \pm 0{,}1)\,\text{s}$.` },
    { nome: 'Errore relativo e percentuale', formula: R`e_r = \dfrac{e_a}{\bar{x}} \qquad e_\% = e_r \cdot 100\%`, nota: R`Numeri puri, senza unità. Più sono piccoli, migliore è la misura.` },
    { nome: 'Dall\'errore relativo all\'errore assoluto', formula: R`e_a = e_r \cdot \bar{x}`, nota: R`Serve alla fine dei calcoli con prodotti e quozienti.` },
    { nome: 'Somma e differenza', formula: R`e_a(a \pm b) = e_a(a) + e_a(b)`, nota: R`Si sommano gli errori assoluti, anche nella differenza.` },
    { nome: 'Prodotto e quoziente', formula: R`e_r(a \cdot b) = e_r(a) + e_r(b)`, nota: R`Si sommano gli errori relativi. Vale anche per il quoziente $\dfrac{a}{b}$.` },
    { nome: 'Potenze', formula: R`e_r(a^n) = n \cdot e_r(a)`, nota: R`Il quadrato è $a \cdot a$ ($n = 2$), il cubo $a \cdot a \cdot a$ ($n = 3$): l'errore relativo si somma $n$ volte.` },
    { nome: 'Per un numero esatto', formula: R`e_a(k \cdot a) = k \cdot e_a(a)`, nota: R`Per esempio il periodo da dieci oscillazioni: tempo diviso 10, errore diviso 10.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'strumenti', tipo: 'definizione', fronte: R`Che cos'è la **portata** di uno strumento?`, retro: R`Il valore più grande che lo strumento può misurare. Una bilancia da cucina con «max 5 kg» ha portata 5 kg.` },
    { id: 'fc-02', sezione: 'strumenti', tipo: 'definizione', fronte: R`Che cos'è la **sensibilità** di uno strumento?`, retro: R`La variazione più piccola che lo strumento riesce a leggere. Un righello millimetrato ha sensibilità 1 mm.` },
    { id: 'fc-03', sezione: 'strumenti', tipo: 'definizione', fronte: R`Che cos'è la **prontezza** di uno strumento?`, retro: R`Quanto in fretta lo strumento dà la misura. Un termometro digitale è più pronto di uno a liquido.` },
    { id: 'fc-04', sezione: 'strumenti', tipo: 'concetto', fronte: R`Con **una sola misura**, quanto vale l'errore assoluto?`, retro: R`La sensibilità dello strumento. Con un righello millimetrato: $(18{,}7 \pm 0{,}1)\,\text{cm}$.` },
    { id: 'fc-05', sezione: 'casuali-sistematici', tipo: 'definizione', fronte: R`Che cosa sono gli **errori casuali**?`, retro: R`Errori che spostano la misura a volte in più e a volte in meno, senza regola. Si riducono ripetendo la misura e facendo la media.` },
    { id: 'fc-06', sezione: 'casuali-sistematici', tipo: 'definizione', fronte: R`Che cosa sono gli **errori sistematici**?`, retro: R`Errori che spostano la misura sempre nello stesso verso, come lo zero sbagliato di una bilancia. Ripetere non serve: si trova la causa e si corregge.` },
    { id: 'fc-07', sezione: 'casuali-sistematici', tipo: 'concetto', fronte: R`Che differenza c'è fra una misura **precisa** e una **accurata**?`, retro: R`Precisa: pochi errori casuali, misure vicine fra loro. Accurata: senza errori sistematici, misure centrate sul valore vero.` },
    { id: 'fc-08', sezione: 'valore-medio', tipo: 'formula', fronte: R`Formula del **valore medio**`, retro: R`$\bar{x} = \dfrac{x_1 + x_2 + \ldots + x_n}{n}$: la somma delle misure diviso il loro numero.` },
    { id: 'fc-09', sezione: 'valore-medio', tipo: 'formula', fronte: R`Formula della **semidispersione**`, retro: R`$e_a = \dfrac{x_{\text{max}} - x_{\text{min}}}{2}$: metà della differenza fra la misura più grande e la più piccola.` },
    { id: 'fc-10', sezione: 'valore-medio', tipo: 'procedura', fronte: R`Le misure ripetute sono tutte uguali. Che errore scrivi?`, retro: R`La sensibilità dello strumento. Si fa così ogni volta che la semidispersione è più piccola della sensibilità.` },
    { id: 'fc-11', sezione: 'risultato', tipo: 'procedura', fronte: R`Come si scrive il **risultato** di una misura?`, retro: R`$x = \bar{x} \pm e_a$, con l'unità: per esempio $(2{,}4 \pm 0{,}1)\,\text{s}$. Il valore vero sta quasi certamente fra $\bar{x} - e_a$ e $\bar{x} + e_a$.` },
    { id: 'fc-12', sezione: 'risultato', tipo: 'procedura', fronte: R`Come si arrotondano errore e valore medio?`, retro: R`L'errore a una cifra significativa; il valore alla stessa cifra decimale dell'errore. $7{,}4628 \pm 0{,}0371$ diventa $7{,}46 \pm 0{,}04$.` },
    { id: 'fc-13', sezione: 'risultato', tipo: 'definizione', fronte: R`Quando due misure si dicono **compatibili**?`, retro: R`Quando i loro intervalli di incertezza si toccano o si sovrappongono.` },
    { id: 'fc-14', sezione: 'errore-relativo', tipo: 'formula', fronte: R`Formula dell'**errore relativo**`, retro: R`$e_r = \dfrac{e_a}{\bar{x}}$: errore assoluto diviso il valore misurato. È un numero puro.` },
    { id: 'fc-15', sezione: 'errore-relativo', tipo: 'concetto', fronte: R`A che cosa serve l'errore relativo?`, retro: R`A giudicare quanto è buona una misura, e a confrontare misure diverse, anche di grandezze diverse. Più è piccolo, meglio è.` },
    { id: 'fc-16', sezione: 'errore-relativo', tipo: 'procedura', fronte: R`Come si passa dall'errore relativo all'**errore percentuale**?`, retro: R`Si moltiplica per 100: $e_r = 0{,}003$ diventa $e_\% = 0{,}3\%$.` },
    { id: 'fc-17', sezione: 'propagazione', tipo: 'formula', fronte: R`Errore di una **somma** o di una **differenza**`, retro: R`Si sommano gli errori assoluti: $e_a(a \pm b) = e_a(a) + e_a(b)$. Anche nella differenza.` },
    { id: 'fc-18', sezione: 'propagazione', tipo: 'formula', fronte: R`Errore di un **prodotto** o di un **quoziente**`, retro: R`Si sommano gli errori relativi: $e_r(a \cdot b) = e_r(a) + e_r(b)$, e lo stesso per $\dfrac{a}{b}$.` },
    { id: 'fc-19', sezione: 'propagazione', tipo: 'concetto', fronte: R`Perché conviene cronometrare dieci oscillazioni invece di una?`, retro: R`L'errore della mano è lo stesso, ma il periodo è il tempo diviso 10: anche l'errore si divide per 10.` },
    { id: 'fc-20', sezione: 'propagazione', tipo: 'concetto', fronte: R`Il lato di un quadrato ha errore relativo $e_r$. Quanto vale l'errore relativo dell'area?`, retro: R`$2 \cdot e_r$, perché l'area è $l \cdot l$. Per il volume di un cubo, $3 \cdot e_r$.` },
    { id: 'fc-21', sezione: 'cifre-significative', tipo: 'definizione', fronte: R`Che cosa sono le **cifre significative**?`, retro: R`Le cifre certe di una misura più la prima cifra incerta. $12{,}0\,\text{cm}$ ne ha tre, $12\,\text{cm}$ due.` },
    { id: 'fc-22', sezione: 'cifre-significative', tipo: 'concetto', fronte: R`Gli **zeri** sono cifre significative?`, retro: R`Quelli davanti no: $0{,}0120$ ha tre cifre. Quelli in mezzo e in fondo sì: sono cifre misurate.` },
    { id: 'fc-23', sezione: 'cifre-significative', tipo: 'procedura', fronte: R`Quante cifre si tengono nel risultato di un **prodotto** o di un **quoziente**?`, retro: R`Tante quante il dato che ne ha meno: $12{,}3 \cdot 4{,}5 = 55{,}35 \approx 55$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un termometro da cucina mostra la temperatura a scatti di 0,5 °C. Fai una sola misura e leggi 63,5 °C. Quanto vale l'errore assoluto?`, suggerimenti: [R`Con una sola misura l'errore è la sensibilità dello strumento.`], risposta: { tipo: 'numero', valore: 0.5, unita: '°C', altreUnita: ['K'] }, soluzione: [R`La variazione più piccola che il termometro legge è $0{,}5\,{}^\circ\text{C}$: è la sua sensibilità.`, R`Il risultato si scrive $(63{,}5 \pm 0{,}5)\,{}^\circ\text{C}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un metro da sarta è lungo 150 cm e ha le tacche ogni 0,5 cm. Qual è la sua portata?`, suggerimenti: [R`La portata è il valore più grande che lo strumento può misurare.`], risposta: { tipo: 'numero', valore: 150, unita: 'cm' }, soluzione: [R`La portata è $150\,\text{cm}$, cioè $1{,}5\,\text{m}$. La sensibilità invece è $0{,}5\,\text{cm}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Una bilancia a vuoto segna 45 g. Con un pacco sopra segna 365 g. Qual è la massa vera del pacco?`, suggerimenti: [R`Lo zero è sbagliato di 45 g: è un errore sistematico, sempre nello stesso verso.`], risposta: { tipo: 'numero', valore: 320, unita: 'g' }, soluzione: [R`Ogni pesata ha 45 g di troppo. $m = 365\,\text{g} - 45\,\text{g} = 320\,\text{g}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Tre misure dello stesso tempo: 8,1 s, 8,3 s e 8,2 s. Quanto vale il valore medio?`, suggerimenti: [R`Somma le tre misure e dividi per 3.`], risposta: { tipo: 'numero', valore: 8.2, unita: 's' }, soluzione: [R`$\bar{t} = \dfrac{8{,}1 + 8{,}3 + 8{,}2}{3}\,\text{s} = \dfrac{24{,}6}{3}\,\text{s} = 8{,}2\,\text{s}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Quattro misure della stessa lunghezza: 35 cm, 37 cm, 36 cm, 36 cm. Quanto vale il valore medio?`, suggerimenti: [R`Somma le quattro misure e dividi per 4.`], risposta: { tipo: 'numero', valore: 36, unita: 'cm' }, soluzione: [R`$\bar{x} = \dfrac{35 + 37 + 36 + 36}{4}\,\text{cm} = \dfrac{144}{4}\,\text{cm} = 36\,\text{cm}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`In una serie di misure di un tempo, la più piccola è 12,4 s e la più grande 13,0 s. Quanto vale la semidispersione?`, suggerimenti: [R`Semidispersione: la più grande meno la più piccola, diviso 2.`], risposta: { tipo: 'numero', valore: 0.3, unita: 's' }, soluzione: [R`$e_a = \dfrac{13{,}0\,\text{s} - 12{,}4\,\text{s}}{2} = \dfrac{0{,}6\,\text{s}}{2} = 0{,}3\,\text{s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Cinque pesate dello stesso oggetto: 46 g, 50 g, 48 g, 47 g, 49 g. Quanto vale la semidispersione?`, suggerimenti: [R`Trova la misura più grande e la più piccola.`, R`$e_a = \dfrac{x_{\text{max}} - x_{\text{min}}}{2}$.`], risposta: { tipo: 'numero', valore: 2, unita: 'g' }, soluzione: [R`La più grande è 50 g, la più piccola 46 g.`, R`$e_a = \dfrac{50\,\text{g} - 46\,\text{g}}{2} = 2\,\text{g}$. Il valore medio è 48 g: il risultato è $(48 \pm 2)\,\text{g}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una misura è $(15{,}3 \pm 0{,}2)\,\text{cm}$. Qual è il valore più grande che la lunghezza vera può avere?`, suggerimenti: [R`Il valore vero sta fra $\bar{x} - e_a$ e $\bar{x} + e_a$.`], risposta: { tipo: 'numero', valore: 15.5, unita: 'cm' }, soluzione: [R`$15{,}3\,\text{cm} + 0{,}2\,\text{cm} = 15{,}5\,\text{cm}$. L'intervallo va da 15,1 cm a 15,5 cm.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Una lunghezza misura $(40 \pm 2)\,\text{cm}$. Qual è l'errore percentuale?`, suggerimenti: [R`Errore assoluto diviso il valore, poi per 100.`], risposta: { tipo: 'numero', valore: 5, unita: '%' }, soluzione: [R`$e_r = \dfrac{2\,\text{cm}}{40\,\text{cm}} = 0{,}05$.`, R`$e_\% = 0{,}05 \cdot 100\% = 5\%$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una massa misura $(200 \pm 8)\,\text{g}$. Qual è l'errore percentuale?`, suggerimenti: [R`$e_r = \dfrac{e_a}{\bar{x}}$, poi moltiplica per 100.`], risposta: { tipo: 'numero', valore: 4, unita: '%' }, soluzione: [R`$e_r = \dfrac{8\,\text{g}}{200\,\text{g}} = 0{,}04$, cioè il $4\%$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Una lunghezza misura $(50 \pm 3)\,\text{mm}$. Quanto vale l'errore relativo, scritto come numero puro?`, suggerimenti: [R`Errore assoluto diviso il valore misurato. I millimetri si semplificano.`], risposta: { tipo: 'numero', valore: 0.06 }, soluzione: [R`$e_r = \dfrac{3\,\text{mm}}{50\,\text{mm}} = 0{,}06$, cioè il $6\%$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Una distanza di 60 m è misurata con un errore del 3%. Quanto vale l'errore assoluto?`, suggerimenti: [R`$e_a = e_r \cdot \bar{x}$. Il 3% è $0{,}03$.`], risposta: { tipo: 'numero', valore: 1.8, unita: 'm' }, soluzione: [R`$e_a = 0{,}03 \cdot 60\,\text{m} = 1{,}8\,\text{m}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Metti in fila due scatole lunghe $(32 \pm 2)\,\text{cm}$ e $(45 \pm 3)\,\text{cm}$. Quanto vale l'errore assoluto della lunghezza totale?`, suggerimenti: [R`In una somma si sommano gli errori assoluti.`], risposta: { tipo: 'numero', valore: 5, unita: 'cm' }, soluzione: [R`$e_a = 2\,\text{cm} + 3\,\text{cm} = 5\,\text{cm}$. La lunghezza totale è $(77 \pm 5)\,\text{cm}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`L'acqua in una pentola passa da $(18{,}5 \pm 0{,}5)\,{}^\circ\text{C}$ a $(42{,}0 \pm 0{,}5)\,{}^\circ\text{C}$. Quanto vale l'errore assoluto della variazione di temperatura?`, suggerimenti: [R`La variazione è una differenza.`, R`Nella differenza gli errori assoluti si sommano, non si sottraggono.`], risposta: { tipo: 'numero', valore: 1, unita: '°C', altreUnita: ['K'] }, soluzione: [R`La variazione è $(42{,}0 - 18{,}5)\,{}^\circ\text{C} = 23{,}5\,{}^\circ\text{C}$.`, R`L'errore è $(0{,}5 + 0{,}5)\,{}^\circ\text{C} = 1\,{}^\circ\text{C}$: la variazione è $(23{,}5 \pm 1)\,{}^\circ\text{C}$, che si arrotonda a $(24 \pm 1)\,{}^\circ\text{C}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Da una serie di misure ottieni il valore medio 3,4726 s e la semidispersione 0,0381 s. Arrotonda bene: quanto vale il valore medio da scrivere nel risultato?`, suggerimenti: [R`Prima arrotonda l'errore a una cifra significativa.`, R`Poi ferma il valore medio alla stessa cifra decimale dell'errore.`], risposta: { tipo: 'numero', valore: 3.47, unita: 's', tolleranza: 0.001 }, soluzione: [R`L'errore $0{,}0381\,\text{s}$ con una cifra diventa $0{,}04\,\text{s}$: si ferma ai centesimi.`, R`Anche il valore medio si ferma ai centesimi: $3{,}4726 \approx 3{,}47$. Il risultato è $(3{,}47 \pm 0{,}04)\,\text{s}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`I lati di un rettangolo hanno errori relativi del 3% e del 4%. Qual è l'errore percentuale dell'area?`, suggerimenti: [R`L'area è un prodotto: si sommano gli errori relativi.`], risposta: { tipo: 'numero', valore: 7, unita: '%' }, soluzione: [R`$e_\% = 3\% + 4\% = 7\%$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una velocità di 10 m/s è calcolata dividendo uno spazio, con errore relativo dell'1%, per un tempo, con errore relativo del 2%. Quanto vale l'errore assoluto della velocità?`, suggerimenti: [R`In un quoziente si sommano gli errori relativi.`, R`Poi $e_a = e_r \cdot v$.`], risposta: { tipo: 'numero', valore: 0.3, unita: 'm/s' }, soluzione: [R`$e_r(v) = 1\% + 2\% = 3\%$.`, R`$e_a = 0{,}03 \cdot 10\,\text{m/s} = 0{,}3\,\text{m/s}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Cronometri 20 oscillazioni di un pendolo: $t = (36{,}0 \pm 0{,}2)\,\text{s}$. Quanto vale l'errore assoluto del periodo, cioè di una sola oscillazione?`, suggerimenti: [R`Il periodo è il tempo diviso 20.`, R`Dividere per un numero esatto divide anche l'errore.`], risposta: { tipo: 'numero', valore: 0.01, unita: 's' }, soluzione: [R`$T = \dfrac{36{,}0\,\text{s}}{20} = 1{,}80\,\text{s}$.`, R`$e_a = \dfrac{0{,}2\,\text{s}}{20} = 0{,}01\,\text{s}$. Il periodo è $(1{,}80 \pm 0{,}01)\,\text{s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Quante cifre significative ha la misura $0{,}0450\,\text{m}$?`, suggerimenti: [R`Gli zeri davanti non contano; quelli in fondo sì.`], risposta: { tipo: 'numero', valore: 3, segnaposto: 'Un numero (es. 2)' }, soluzione: [R`Gli zeri prima del 4 dicono solo dove sta la virgola. Contano il 4, il 5 e lo zero finale: tre cifre.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un rettangolo ha lati di 12,6 cm e 3,1 cm. Scrivi l'area con il giusto numero di cifre significative.`, suggerimenti: [R`La calcolatrice dà 39,06 cm².`, R`In un prodotto si tengono tante cifre quante il dato che ne ha meno.`], risposta: { tipo: 'numero', valore: 39, unita: 'cm²', tolleranza: 0.01 }, soluzione: [R`$12{,}6 \cdot 3{,}1 = 39{,}06\,\text{cm}^2$.`, R`$3{,}1$ ha due cifre significative: anche l'area ne tiene due. Dopo il 9 c'è uno 0, quindi $A \approx 39\,\text{cm}^2$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Sei misure del periodo di un'altalena, in secondi: 1,33; 1,28; 1,36; 1,30; 1,29; 1,34. Scrivi il risultato con il suo errore e calcola l'errore percentuale.`, suggerimenti: [R`Valore medio: somma diviso 6. Semidispersione: massima meno minima, diviso 2.`, R`Arrotonda l'errore a una cifra e il valore medio alla stessa cifra decimale.`, R`Poi $e_\% = \dfrac{e_a}{\bar{x}} \cdot 100\%$.`], risposta: { tipo: 'numero', valore: 3, unita: '%', tolleranza: 0.1 }, soluzione: [R`Somma $7{,}90\,\text{s}$; $\bar{T} = \dfrac{7{,}90}{6}\,\text{s} \approx 1{,}3167\,\text{s}$.`, R`$e_a = \dfrac{1{,}36 - 1{,}28}{2}\,\text{s} = 0{,}04\,\text{s}$. Risultato: $T = (1{,}32 \pm 0{,}04)\,\text{s}$.`, R`$e_r = \dfrac{0{,}04}{1{,}32} \approx 0{,}03$, cioè circa il $3\%$.`] },
    { id: 'es-02', difficolta: 2, testo: R`Con un cronometro che legge i decimi di secondo misuri tre volte lo stesso tempo: 4,3 s; 4,3 s; 4,4 s. Quanto vale l'errore assoluto da scrivere nel risultato?`, suggerimenti: [R`Calcola prima la semidispersione.`, R`Confrontala con la sensibilità del cronometro: si prende la più grande delle due.`], risposta: { tipo: 'numero', valore: 0.1, unita: 's' }, soluzione: [R`Semidispersione: $\dfrac{4{,}4 - 4{,}3}{2}\,\text{s} = 0{,}05\,\text{s}$.`, R`È più piccola della sensibilità, $0{,}1\,\text{s}$: lo strumento non può garantire di più. L'errore è $0{,}1\,\text{s}$.`, R`Il valore medio è circa 4,33 s; il risultato è $(4{,}3 \pm 0{,}1)\,\text{s}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Due gruppi misurano l'accelerazione di gravità. Il primo trova $(9{,}77 \pm 0{,}03)\,\text{m/s}^2$, il secondo $9{,}85\,\text{m/s}^2$. Quanto deve valere almeno l'errore del secondo gruppo perché le due misure siano compatibili?`, suggerimenti: [R`Il primo intervallo arriva fino a $9{,}80\,\text{m/s}^2$.`, R`Il secondo intervallo deve scendere almeno fino a lì: $9{,}85 - e_a \le 9{,}80$.`], risposta: { tipo: 'numero', valore: 0.05, unita: 'm/s²' }, soluzione: [R`Il primo intervallo va da $9{,}74$ a $9{,}80\,\text{m/s}^2$.`, R`Il secondo comincia da $9{,}85 - e_a$. Per toccare il primo serve $9{,}85 - e_a \le 9{,}80$, cioè $e_a \ge 0{,}05\,\text{m/s}^2$.`, R`Con un errore più piccolo, la differenza fra le due misure sarebbe più grande della loro incertezza.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un cilindretto di metallo ha massa $(78{,}0 \pm 0{,}5)\,\text{g}$ e volume $(10{,}0 \pm 0{,}2)\,\text{cm}^3$. Quanto vale l'errore assoluto della sua densità?`, suggerimenti: [R`$d = \dfrac{m}{V}$ è un quoziente: si sommano gli errori relativi.`, R`$e_r(m) = \dfrac{0{,}5}{78{,}0}$ e $e_r(V) = \dfrac{0{,}2}{10{,}0}$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'g/cm³', tolleranza: 0.02 }, soluzione: [R`$d = \dfrac{78{,}0\,\text{g}}{10{,}0\,\text{cm}^3} = 7{,}80\,\text{g/cm}^3$.`, R`$e_r(m) \approx 0{,}6\%$, $e_r(V) = 2\%$; in tutto circa $2{,}6\%$.`, R`$e_a \approx 0{,}026 \cdot 7{,}80\,\text{g/cm}^3 \approx 0{,}2\,\text{g/cm}^3$. Risultato: $d = (7{,}8 \pm 0{,}2)\,\text{g/cm}^3$, quella del ferro.`] },
    { id: 'es-05', difficolta: 3, testo: R`Il raggio di un disco misura $(6{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale l'errore assoluto dell'area del disco? ($A = \pi \cdot r^2$, e $\pi$ è un numero esatto.)`, suggerimenti: [R`$r^2$ è un prodotto $r \cdot r$: l'errore relativo raddoppia.`, R`Moltiplicare per $\pi$ non cambia l'errore relativo.`], risposta: { tipo: 'numero', valore: 4, unita: 'cm²', tolleranza: 0.25 }, soluzione: [R`$A = \pi \cdot (6{,}0\,\text{cm})^2 \approx 113\,\text{cm}^2$.`, R`$e_r(r) = \dfrac{0{,}1}{6{,}0} \approx 1{,}7\%$, quindi $e_r(A) = 2 \cdot 1{,}7\% \approx 3{,}3\%$.`, R`$e_a \approx 0{,}033 \cdot 113\,\text{cm}^2 \approx 3{,}8\,\text{cm}^2$, che con una cifra fa $4\,\text{cm}^2$. Risultato: $A = (113 \pm 4)\,\text{cm}^2$.`] },
    { id: 'es-06', difficolta: 2, testo: R`Un velocista corre $(60{,}0 \pm 0{,}3)\,\text{m}$ in $(8{,}0 \pm 0{,}2)\,\text{s}$. Quanto vale l'errore assoluto della sua velocità media?`, suggerimenti: [R`$v = \dfrac{s}{t}$: si sommano gli errori relativi.`, R`$e_r(s) = 0{,}5\%$, $e_r(t) = 2{,}5\%$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'm/s', tolleranza: 0.03 }, soluzione: [R`$v = \dfrac{60{,}0\,\text{m}}{8{,}0\,\text{s}} = 7{,}5\,\text{m/s}$.`, R`$e_r(v) = 0{,}5\% + 2{,}5\% = 3\%$.`, R`$e_a = 0{,}03 \cdot 7{,}5\,\text{m/s} \approx 0{,}2\,\text{m/s}$. Risultato: $v = (7{,}5 \pm 0{,}2)\,\text{m/s}$. Pesa di più il tempo.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un foglio di carta è troppo sottile per il righello. Una risma di 500 fogli invece è spessa $(5{,}0 \pm 0{,}1)\,\text{cm}$. Quanto vale l'errore assoluto sullo spessore di un foglio, in millimetri?`, suggerimenti: [R`Lo spessore di un foglio è lo spessore della risma diviso 500.`, R`Anche l'errore si divide per 500. Passa ai millimetri: $0{,}1\,\text{cm} = 1\,\text{mm}$.`], risposta: { tipo: 'numero', valore: 0.002, unita: 'mm' }, soluzione: [R`In millimetri la risma è $(50 \pm 1)\,\text{mm}$.`, R`Un foglio: $\dfrac{50\,\text{mm}}{500} = 0{,}100\,\text{mm}$, con errore $\dfrac{1\,\text{mm}}{500} = 0{,}002\,\text{mm}$.`, R`Risultato: $(0{,}100 \pm 0{,}002)\,\text{mm}$. Con il righello, su un foglio solo, non avresti potuto dire niente.`] },
    { id: 'es-08', difficolta: 2, testo: R`In un becher che pesa 250,4 g versi 12,37 g di sale. Scrivi la massa totale con il giusto numero di cifre.`, suggerimenti: [R`In una somma conta la posizione dei decimali.`, R`Si tengono tanti decimali quanti il dato che ne ha meno: qui uno.`], risposta: { tipo: 'numero', valore: 262.8, unita: 'g', tolleranza: 0.01 }, soluzione: [R`$250{,}4\,\text{g} + 12{,}37\,\text{g} = 262{,}77\,\text{g}$.`, R`Il becher è noto solo fino ai decimi: anche la somma si ferma ai decimi. Dopo il 7 c'è un 7, quindi $262{,}8\,\text{g}$.`] },
    { id: 'es-09', difficolta: 3, testo: R`Il tempo che misuri con il cronometro ha sempre un errore di 0,3 s. Vuoi il periodo di un pendolo con un errore di 0,02 s al massimo. Quante oscillazioni di fila devi cronometrare, come minimo?`, suggerimenti: [R`Con $n$ oscillazioni l'errore sul periodo è $\dfrac{0{,}3\,\text{s}}{n}$.`, R`Deve essere $\dfrac{0{,}3}{n} \le 0{,}02$.`], risposta: { tipo: 'numero', valore: 15, segnaposto: 'Un numero (es. 8)' }, soluzione: [R`Il periodo è il tempo diviso $n$, e anche l'errore si divide per $n$: $e_a = \dfrac{0{,}3\,\text{s}}{n}$.`, R`$\dfrac{0{,}3}{n} \le 0{,}02 \Rightarrow n \ge \dfrac{0{,}3}{0{,}02} = 15$.`, R`Servono almeno 15 oscillazioni. Mentre le oscillazioni si smorzano il periodo resta quasi lo stesso, quindi contarne qualcuna in più non guasta.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cos'è la sensibilità di uno strumento?`, opzioni: [R`Il valore più grande che può misurare`, R`La variazione più piccola che riesce a leggere`, R`Il tempo che impiega a dare la misura`, R`L'errore sistematico dello strumento`], corretta: 1, spiegazione: R`La sensibilità è la variazione più piccola che lo strumento legge: 1 mm per un righello millimetrato. Il valore più grande è la portata, il tempo è la prontezza.` },
    { id: 'q-02', domanda: R`Che cosa succede se si misura una grandezza più grande della portata dello strumento?`, opzioni: [R`Lo strumento segna la sua portata, e quella è la misura`, R`La misura ha un errore doppio`, R`Lo strumento misura lo stesso, ma più lentamente`, R`Lo strumento non la può misurare`], corretta: 3, spiegazione: R`La portata è il valore più grande che lo strumento misura. Oltre, segna errore o dà un numero falso, e il numero che segna non è la misura. Non è una questione di errore più grande o di lentezza.` },
    { id: 'q-03', domanda: R`Quali errori si riducono ripetendo la misura e facendo la media?`, opzioni: [R`Gli errori casuali`, R`Gli errori sistematici`, R`Tutti e due`, R`Nessuno dei due`], corretta: 0, spiegazione: R`Gli errori casuali vanno a volte in più e a volte in meno, e nella media si compensano. Gli errori sistematici vanno sempre nello stesso verso: la media se li porta dietro.` },
    { id: 'q-04', domanda: R`Una bilancia a vuoto segna 10 g. Che errore dà sulle pesate?`, opzioni: [R`Un errore casuale`, R`Nessuno, se si usa sempre la stessa bilancia`, R`Un errore sistematico`, R`Un errore che si toglie facendo la media`], corretta: 2, spiegazione: R`Ogni pesata ha 10 g di troppo, sempre nello stesso verso: è un errore sistematico. Non si toglie con la media, ma con la tara.` },
    { id: 'q-05', domanda: R`Le misure di uno studente sono molto vicine fra loro, ma tutte spostate rispetto al valore vero. Come sono le sue misure?`, opzioni: [R`Accurate ma poco precise`, R`Né precise né accurate, perché sono poche`, R`Con molti errori casuali`, R`Precise ma poco accurate`], corretta: 3, spiegazione: R`Misure vicine fra loro vuol dire pochi errori casuali: sono precise. Spostate tutte dalla stessa parte vuol dire un errore sistematico: non sono accurate.` },
    { id: 'q-06', domanda: R`In una serie di misure la più piccola è 5,1 s e la più grande 5,9 s. Quanto vale la semidispersione?`, opzioni: [R`$0{,}8\,\text{s}$`, R`$5{,}5\,\text{s}$`, R`$0{,}4\,\text{s}$`, R`$0{,}2\,\text{s}$`], corretta: 2, spiegazione: R`Semidispersione: $\dfrac{5{,}9 - 5{,}1}{2} = 0{,}4\,\text{s}$. $0{,}8\,\text{s}$ è la differenza intera; $5{,}5\,\text{s}$ è il punto di mezzo, non un errore.` },
    { id: 'q-07', domanda: R`Con un righello millimetrato misuri cinque volte la stessa matita e trovi sempre 7,3 cm. Quanto vale l'errore?`, opzioni: [R`$0{,}1\,\text{cm}$, la sensibilità del righello`, R`Zero, perché le misure sono tutte uguali`, R`$7{,}3\,\text{cm}$`, R`$0{,}5\,\text{cm}$`], corretta: 0, spiegazione: R`La semidispersione viene zero, ma il righello non legge sotto il millimetro. Quando la semidispersione è più piccola della sensibilità, l'errore è la sensibilità: $(7{,}3 \pm 0{,}1)\,\text{cm}$.` },
    { id: 'q-08', domanda: R`Quale di questi risultati è scritto correttamente?`, opzioni: [R`$(4{,}573 \pm 0{,}02)\,\text{m}$`, R`$(4{,}6 \pm 0{,}02)\,\text{m}$`, R`$(4{,}57 \pm 0{,}021)\,\text{m}$`, R`$(4{,}57 \pm 0{,}02)\,\text{m}$`], corretta: 3, spiegazione: R`L'errore ha una cifra significativa e il valore si ferma alla stessa cifra decimale, i centesimi. Negli altri il valore ha troppe cifre o troppo poche, oppure l'errore ne ha due.` },
    { id: 'q-09', domanda: R`Due misure dello stesso tempo: $(5{,}2 \pm 0{,}1)\,\text{s}$ e $(5{,}5 \pm 0{,}1)\,\text{s}$. Sono compatibili?`, opzioni: [R`Sì, perché la differenza è di soli 0,3 s`, R`No, perché i due intervalli sono staccati`, R`Sì, perché hanno lo stesso errore`, R`Non si può dire senza conoscere il valore vero`], corretta: 1, spiegazione: R`Gli intervalli vanno da 5,1 a 5,3 s e da 5,4 a 5,6 s: non si toccano. Per giudicare non serve il valore vero, e avere lo stesso errore non basta.` },
    { id: 'q-10', domanda: R`Che unità di misura ha l'errore relativo?`, opzioni: [R`La stessa della grandezza misurata`, R`Sempre i metri`, R`Nessuna: è un numero puro, spesso scritto in percentuale`, R`L'unità della grandezza al quadrato`], corretta: 2, spiegazione: R`È un rapporto fra due grandezze con la stessa unità, che si semplifica: metri diviso metri, grammi diviso grammi. Per questo si possono confrontare misure di grandezze diverse.` },
    { id: 'q-11', domanda: R`Misura A: $(10{,}0 \pm 0{,}1)\,\text{cm}$. Misura B: $(100{,}0 \pm 0{,}5)\,\text{cm}$. Quale è migliore?`, opzioni: [R`A, perché ha l'errore assoluto più piccolo`, R`B, perché ha l'errore relativo più piccolo`, R`Sono buone uguali`, R`Non si possono confrontare`], corretta: 1, spiegazione: R`A ha errore relativo $0{,}1 : 10{,}0 = 1\%$, B ha $0{,}5 : 100{,}0 = 0{,}5\%$. La qualità di una misura la dice l'errore relativo, non quello assoluto.` },
    { id: 'q-12', domanda: R`Come si trova l'errore assoluto della differenza fra due misure?`, opzioni: [R`Si sommano gli errori assoluti`, R`Si sottraggono gli errori assoluti`, R`Si sommano gli errori relativi`, R`Si prende l'errore più grande dei due`], corretta: 0, spiegazione: R`Nel caso peggiore il primo dato è più grande e il secondo più piccolo: gli errori si sommano. Gli errori relativi si sommano nei prodotti e nei quozienti.` },
    { id: 'q-13', domanda: R`Come si trova l'errore del prodotto di due misure?`, opzioni: [R`Si sommano gli errori assoluti`, R`Si moltiplicano gli errori assoluti`, R`Si moltiplicano gli errori relativi`, R`Si sommano gli errori relativi`], corretta: 3, spiegazione: R`Nei prodotti e nei quozienti si sommano gli errori relativi; poi, se serve, si torna all'assoluto con $e_a = e_r \cdot \bar{x}$. Gli assoluti si sommano nelle somme e nelle differenze.` },
    { id: 'q-14', domanda: R`Il lato di un quadrato ha un errore relativo del 2%. Quanto vale l'errore relativo dell'area?`, opzioni: [R`$2\%$`, R`$4\%$`, R`$1\%$`, R`$8\%$`], corretta: 1, spiegazione: R`L'area è $l \cdot l$: in un prodotto si sommano gli errori relativi, $2\% + 2\% = 4\%$. Gli errori relativi si sommano: non si moltiplicano e non restano uguali.` },
    { id: 'q-15', domanda: R`Quante cifre significative ha $0{,}0507$?`, opzioni: [R`Tre`, R`Quattro`, R`Cinque`, R`Due`], corretta: 0, spiegazione: R`Gli zeri davanti non contano: dicono solo dov'è la virgola. Contano il 5, lo zero in mezzo e il 7.` },
    { id: 'q-16', domanda: R`La calcolatrice dà $18{,}2 \cdot 3{,}7 = 67{,}34$. I due fattori sono misure. Come si scrive il prodotto?`, opzioni: [R`$67{,}34$`, R`$67{,}3$`, R`$67$`, R`$70$`], corretta: 2, spiegazione: R`$3{,}7$ ha due cifre significative: anche il prodotto ne tiene due. Dopo il 7 c'è un 3, quindi si arrotonda in giù: 67. Il 70 ne avrebbe una sola.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nella differenza gli errori **non** si sottraggono: si sommano sempre, come nella somma.` },
    { tipo: 'errore', testo: R`Ripetere la misura non toglie un errore sistematico. Se la bilancia a vuoto segna 15 g, anche la media ha 15 g di troppo: serve la tara.` },
    { tipo: 'errore', testo: R`Non copiare tutte le cifre della calcolatrice. L'errore va con una cifra significativa, e il valore si ferma alla stessa cifra decimale.` },
    { tipo: 'errore', testo: R`L'errore relativo non ha unità: metri diviso metri fa un numero puro. Se ti restano dei metri, hai dimenticato di dividere.` },
    { tipo: 'trucco', testo: R`Per misurare una cosa piccola o veloce, misurane tante insieme: dieci oscillazioni, cento fogli. Poi dividi: l'errore si divide per lo stesso numero.` },
    { tipo: 'trucco', testo: R`Somme e differenze: errori assoluti. Prodotti e quozienti: errori relativi. Per le potenze, l'errore relativo si moltiplica per l'esponente.` },
    { tipo: 'metodo', testo: R`Con misure ripetute: prima il valore medio, poi la semidispersione, poi gli arrotondamenti. Infine scrivi $(\bar{x} \pm e_a)$ con l'unità fra parentesi.` },
    { tipo: 'metodo', testo: R`Per confrontare due misure, disegna i loro intervalli su una retta. Se si toccano, le misure sono compatibili.` }
  ],
  aneddoti: [
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Il lampadario del duomo di Pisa', testo: R`Il racconto viene da Vincenzo Viviani, l'ultimo allievo di Galileo. Nel 1583 Galileo studiava medicina a Pisa. Un giorno, in duomo, notò una lampada che oscillava appesa al soffitto. Le oscillazioni diventavano sempre più piccole, eppure gli sembrava che durassero sempre lo stesso tempo. Non aveva un orologio: le contò con i battiti del polso. Un cronometro così ha un'incertezza enorme. La lampada che oggi i turisti chiamano «di Galileo», però, fu fatta qualche anno dopo. Il racconto forse è abbellito. Nel 1602, in una lettera, Galileo descrisse una prova migliore: due pendoli uguali, lasciati andare con ampiezze diverse, contando molte oscillazioni. Oggi sappiamo che la regola vale bene per le oscillazioni piccole.`, legame: R`Contare molte oscillazioni e dividere riduce l'errore sul periodo: è la propagazione per un numero esatto.` },
    { fisico: 'Giovanni Keplero', anni: '1571–1630', titolo: 'Otto primi d\'arco che cambiarono l\'astronomia', testo: R`L'astronomo danese Tycho Brahe misurò per più di vent'anni le posizioni dei pianeti. Non aveva il telescopio, ma i suoi strumenti erano i migliori del tempo. I suoi errori erano di un paio di primi d'arco, cioè circa un trentesimo di grado. Quando morì, nel 1601, i suoi dati passarono al suo assistente, Giovanni Keplero. Keplero cercò un'orbita circolare per Marte. La migliore che trovò, in certi punti, sbagliava di otto primi. È poco: circa un quarto della Luna piena vista dalla Terra. Un altro avrebbe dato la colpa alle misure. Keplero no: sapeva che Tycho non poteva sbagliare così tanto. Abbandonò il cerchio e trovò l'ellisse. Nell'*Astronomia nova*, del 1609, scrisse che quegli otto primi avevano aperto la strada alla riforma di tutta l'astronomia.`, legame: R`Una differenza più grande dell'incertezza non è un errore di misura: vuol dire che la teoria va cambiata.` },
    { fisico: 'Carl Friedrich Gauss', anni: '1777–1855', titolo: 'Il pianeta perso e ritrovato con i conti', testo: R`La notte del primo gennaio 1801, a Palermo, l'astronomo Giuseppe Piazzi vide un puntino che si spostava fra le stelle. Era Cerere, che oggi chiamiamo pianeta nano. Piazzi la seguì per circa sei settimane, poi Cerere si perse nella luce del Sole. Le misure erano poche, e ognuna aveva il suo errore. Nessuno sapeva più dove cercarla. Un matematico tedesco di 24 anni, Carl Friedrich Gauss, ne calcolò l'orbita. Fra la fine del 1801 e l'inizio del 1802 gli astronomi la ritrovarono quasi dove lui aveva previsto. Gauss raccontò poi di aver usato un suo metodo, i minimi quadrati, per mettere d'accordo misure con errori casuali. Lo pubblicò nel 1809. Il francese Adrien-Marie Legendre lo aveva già pubblicato nel 1805, e fra i due nacque una lite.`, legame: R`Mettere insieme tante misure imperfette per avere il valore migliore è l'idea che c'è dietro il valore medio.` },
    { fisico: 'Albert Michelson', anni: '1852–1931', titolo: 'La velocità della luce fuori dal suo errore', testo: R`Nel 1879 Albert Michelson era un giovane ufficiale della marina degli Stati Uniti. All'Accademia navale di Annapolis misurò la velocità della luce con uno specchio che ruotava. Il suo risultato era intorno ai 299 900 km/s, con un'incertezza di circa 50 km/s. Era la misura più precisa mai fatta. Oggi sappiamo che il valore vero è 299 792 km/s: più di cento chilometri al secondo sotto. Il valore vero stava fuori dal suo intervallo. Quindi c'era un errore sistematico che Michelson non aveva visto. Lui continuò a migliorare i suoi strumenti per tutta la vita. Nel 1926, in California, fra due montagne lontane circa 35 km, ottenne 299 796 km/s con un'incertezza di 4 km/s. Nel 1907 era stato il primo americano a vincere il premio Nobel per la fisica.`, legame: R`Un errore sistematico non si vede ripetendo la misura: si scopre confrontandola con misure fatte in modo diverso.` }
  ]
});
})();
