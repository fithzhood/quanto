/* Quanto — I fluidi in movimento (terzo anno): portata e continuità, teorema di Bernoulli, tubo di Venturi,
   efflusso (Torricelli), viscosità e legge di Stokes, tensione superficiale. Contratto in SCHEMA.md, modello cinematica.js.
   Colori come nei video e in fluidi.js/energia.js: velocità azzurra (1), forze arancio (2), energia verde (3),
   pressione viola (4). Densità d, spinta F_A.
   Verifica: node strumenti/verifica-argomento.js argomenti/fluidodinamica.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'fluidodinamica',
  titolo: 'I fluidi in movimento',
  introduzione: R`Nei fluidi in equilibrio l'acqua stava ferma. Qui si muove: scorre in un tubo, esce da un rubinetto, passa sopra un'ala. Bastano poche idee per spiegare tanti fenomeni di tutti i giorni. Perché un fiume corre più veloce nelle strettoie? Perché, chiudendo la canna con il dito, il getto va più lontano? Come fa un ago d'acciaio a stare a galla?

Le leggi principali sono due. L'**equazione di continuità** dice che l'acqua non si accumula: dove il tubo si stringe, accelera. Il **teorema di Bernoulli** è la conservazione dell'energia per un fluido: dove corre, preme meno. Poi si guardano i fluidi veri, con la viscosità e la tensione superficiale.

Servono la pressione e la legge di Stevino, la densità $d$, l'energia cinetica e quella potenziale.`,
  inBreve: [
    R`La **portata** è il volume che passa in un secondo: $Q = S \cdot v$, in $\text{m}^3\text{/s}$. In un tubo pieno la portata è la stessa ovunque: $S_1 \cdot v_1 = S_2 \cdot v_2$. Dove il tubo si stringe, il fluido corre.`,
    R`Il **teorema di Bernoulli** è la conservazione dell'energia per unità di volume: $p + \tfrac{1}{2} \cdot d \cdot v^2 + d \cdot g \cdot h$ resta costante lungo un tubo di flusso.`,
    R`In un tubo orizzontale, dove la velocità cresce la pressione cala: è il **tubo di Venturi**.`,
    R`Un liquido esce da un foro a profondità $h$ con $v = \sqrt{2 \cdot g \cdot h}$ (**Torricelli**), come se cadesse dal pelo libero.`,
    R`Nei fluidi veri c'è un attrito interno, la **viscosità** $\eta$. Una sfera che cade in un liquido viscoso arriva presto a una **velocità limite** e poi scende a velocità costante.`,
    R`La superficie di un liquido tira come una pelle tesa: la **tensione superficiale** $\gamma$ è la forza per metro di bordo, in N/m.`
  ],
  sezioni: [
    {
      id: 'portata',
      titolo: 'La portata',
      testo: R`Apri un rubinetto e metti sotto un secchio da 10 litri. Se si riempie in 40 secondi, ogni secondo arrivano 0,25 litri. Questo numero è la **portata** del rubinetto.

Per cominciare immaginiamo un fluido semplice. Un fluido **ideale** è incomprimibile: il suo volume non cambia, comunque lo si spinga. Ed è senza viscosità: scorre senza attriti interni. L'acqua ci va vicino, il miele no.

Supponiamo anche che il moto sia **stazionario**: in ogni punto la velocità resta la stessa nel tempo. Un fiume tranquillo lo è, un'onda che si rompe no. Le traiettorie delle particelle si chiamano **linee di flusso**. In un moto stazionario non si incrociano mai. Un fascio di linee di flusso forma un **tubo di flusso**: il fluido che ci entra non ne esce di lato, come in un tubo vero.

>* La **portata** $Q$ è il volume di fluido che attraversa una sezione in un secondo: $Q = \dfrac{V}{\Delta t}$. Nel SI si misura in $\text{m}^3\text{/s}$.

Qui $Q$ è la portata, non il calore.

Un litro è un decimetro cubo, cioè $0{,}001\,\text{m}^3$. Quindi $1\,\text{L/s} = 0{,}001\,\text{m}^3\text{/s}$.

La portata si calcola anche dalla velocità. In un tempo $\Delta t$ l'acqua avanza di un tratto $v \cdot \Delta t$. Il volume passato è un cilindro: la base è la sezione $S$ del tubo, l'altezza è quel tratto.

~ V = S \cdot v \cdot \Delta t :: il cilindro d'acqua che passa in un tempo $\Delta t$
~ Q = \dfrac{V}{\Delta t} = \evidb{S \cdot v} :: il tempo si semplifica

Esempio. In un tubo di sezione $5\,\text{cm}^2$ l'acqua corre a 1,2 m/s.

~ S = 5\,\text{cm}^2 = 5 \cdot 10^{-4}\,\text{m}^2 :: la sezione in metri quadrati
~ Q = 5 \cdot 10^{-4}\,\text{m}^2 \cdot 1{,}2\,\text{m/s} :: sezione per velocità
~ Q = \evidb{6 \cdot 10^{-4}\,\text{m}^3\text{/s}} :: cioè 0,6 litri al secondo

>! La portata non è la velocità. Un fiume largo e lento porta molta più acqua di un ruscello veloce.

?? Un tubo porta 2 L/s. Si raddoppia la sezione, con la stessa velocità dell'acqua. Quanto diventa la portata?
[ ] 2 L/s
[x] 4 L/s
[ ] 1 L/s
=> $Q = S \cdot v$: sezione doppia e stessa velocità vogliono dire portata doppia.`
    },
    {
      id: 'continuita',
      titolo: 'L\'equazione di continuità',
      testo: R`Chiudi con il dito una parte dell'uscita di una canna da giardino. Il getto diventa sottile e arriva molto più lontano: l'acqua esce più veloce. Perché?

Un tubo pieno di fluido incomprimibile non può accumulare acqua da nessuna parte. Quanta ne entra da un capo in un secondo, tanta ne esce dall'altro. Quindi la portata è la stessa in ogni sezione.

[[video:fluidodinamica/continuita]]

>* **Equazione di continuità**: in un fluido incomprimibile, in moto stazionario, la portata è la stessa in tutte le sezioni del tubo: $S_1 \cdot v_1 = S_2 \cdot v_2$.

Sezione e velocità sono **inversamente proporzionali**. Dove il tubo si stringe, il fluido corre; dove si allarga, rallenta. Succede anche in un fiume: nelle strettoie l'acqua accelera, dove il letto è largo scorre piano.

Esempio. Una canna ha sezione $3\,\text{cm}^2$ e l'acqua ci scorre a 1,5 m/s. In fondo c'è un ugello di $0{,}5\,\text{cm}^2$.

~ S_1 \cdot v_1 = S_2 \cdot v_2 :: la stessa portata nella canna e nell'ugello
~ v_2 = v_1 \cdot \dfrac{S_1}{S_2} :: ricavo la velocità nell'ugello
~ v_2 = 1{,}5\,\text{m/s} \cdot \dfrac{3\,\text{cm}^2}{0{,}5\,\text{cm}^2} :: le sezioni restano in cm²: conta solo il rapporto
~ v_2 = \evidb{9\,\text{m/s}} :: sezione sei volte più piccola, velocità sei volte più grande

[[grafico:tubo]]

Attenzione al diametro. La sezione di un tubo tondo è $S = \pi \cdot r^2$: va con il **quadrato** del raggio. Diametro metà vuol dire sezione un quarto, e velocità quattro volte.

>! Stringere il tubo non aumenta la portata. Aumenta la velocità, ma il volume che esce ogni secondo non cresce. Il getto della canna con il dito va lontano, ma il secchio non si riempie prima: anzi, di solito un po' dopo.

?? Il diametro di un tubo si riduce a un terzo. Che cosa succede alla velocità dell'acqua?
[ ] diventa tre volte più grande
[x] diventa nove volte più grande
[ ] diventa un terzo
=> La sezione va con il quadrato del diametro: diametro un terzo, sezione un nono. Per far passare la stessa portata, la velocità diventa nove volte più grande.`
    },
    {
      id: 'bernoulli',
      titolo: 'Il teorema di Bernoulli',
      testo: R`Nel tratto stretto di un tubo l'acqua accelera. Ma per accelerare serve una forza. Chi la spinge? L'acqua che sta dietro, a pressione più alta. Quindi, dove il fluido corre più veloce, la pressione è più bassa.

[[video:fluidodinamica/bernoulli]]

Il ragionamento si fa con l'energia. Prendiamo un volume $V$ d'acqua, di massa $m$, in un tubo orizzontale. Passa dal tratto largo, con pressione $p_1$ e velocità $v_1$, al tratto stretto, con $p_2$ e $v_2$. La pressione di dietro lo spinge, quella davanti lo frena.

~ L = (p_1 - p_2) \cdot V :: lavoro delle forze di pressione: $p \cdot S$ per lo spostamento fa $p \cdot V$
~ L = \tfrac{1}{2} \cdot m \cdot (v_2^2 - v_1^2) :: teorema dell'energia cinetica: $L = \Delta E_c$
~ p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2) :: divido per $V$: $m / V$ è la densità $d$
~ p + \tfrac{1}{2} \cdot d \cdot v^2 = \evidb{\text{costante}} :: a sinistra le grandezze del punto 1, a destra quelle del punto 2: la somma è la stessa

Il termine $\tfrac{1}{2} \cdot d \cdot v^2$ è un'energia cinetica divisa per il volume. Si misura in $\text{J/m}^3$, che è come dire pascal. Se il tubo sale o scende, cambia anche l'energia potenziale: divisa per il volume, è $d \cdot g \cdot h$.

>* **Teorema di Bernoulli**: per un fluido ideale in moto stazionario, lungo un tubo di flusso, $p + \tfrac{1}{2} \cdot d \cdot v^2 + d \cdot g \cdot h$ resta costante. È la conservazione dell'energia, per unità di volume.

Esempio. In un tubo orizzontale l'acqua scorre a 1 m/s con pressione $130\,\text{kPa}$. Poi entra in un tratto dove corre a 3 m/s.

~ p_2 = p_1 + \tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2) :: Bernoulli, con la stessa quota nei due punti
~ \tfrac{1}{2} \cdot d = 500\,\text{kg/m}^3 :: metà della densità dell'acqua
~ v_1^2 - v_2^2 = (1 - 9)\,\text{m}^2/\text{s}^2 :: la differenza dei quadrati delle velocità
~ \tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2) = -4000\,\text{Pa} :: il prodotto: $\text{kg/m}^3$ per $\text{m}^2/\text{s}^2$ fa pascal
~ p_2 = 130\,\text{kPa} - 4\,\text{kPa} :: 4000 Pa sono 4 kPa
~ p_2 = \evidb{126\,\text{kPa}} :: dove corre di più, la pressione è più bassa

Con l'acqua ferma, $v = 0$, resta costante $p + d \cdot g \cdot h$: è la legge di Stevino.

[[grafico:venturi]]

>! Più veloce non vuol dire «preme di più». Il getto di una canna colpisce forte perché porta tanta quantità di moto. Quando si ferma contro di noi, ce la cede. Appena uscito nell'aria, la sua pressione è quella dell'aria intorno.

?? In un tubo orizzontale l'acqua passa da un tratto largo a uno stretto. Nel tratto stretto la pressione è…
[ ] più alta, perché l'acqua è più schiacciata
[x] più bassa, perché l'acqua va più veloce
[ ] uguale, perché il tubo è orizzontale
=> Nel tratto stretto la velocità cresce, e con lei $\tfrac{1}{2} \cdot d \cdot v^2$. Perché la somma resti costante, la pressione deve calare.`
    },
    {
      id: 'venturi',
      titolo: 'Venturi, fogli e ali',
      testo: R`Un tubo con una strozzatura si chiama **tubo di Venturi**. Sopra il tratto largo e sopra la strozzatura si mettono due tubicini aperti. L'acqua sale in ciascuno fino a un'altezza che misura la pressione lì sotto. Sopra la strozzatura la colonna è più bassa.

>* Nella strozzatura di un tubo di Venturi la velocità aumenta e la pressione diminuisce: $p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2)$.

Il dislivello $\Delta h$ fra le colonne dà la differenza di pressione: $p_1 - p_2 = d \cdot g \cdot \Delta h$. Per esempio, la sezione della strozzatura è un terzo di quella larga. Nel tratto largo l'acqua va a 1,2 m/s, nella strozzatura a 3,6 m/s.

~ p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2) :: Bernoulli fra tratto largo e strozzatura
~ v_2^2 - v_1^2 = (3{,}6^2 - 1{,}2^2)\,\tfrac{\text{m}^2}{\text{s}^2} :: la differenza dei quadrati delle velocità
~ v_2^2 - v_1^2 = 11{,}52\,\tfrac{\text{m}^2}{\text{s}^2} :: 12,96 meno 1,44
~ p_1 - p_2 = 500\,\tfrac{\text{kg}}{\text{m}^3} \cdot 11{,}52\,\tfrac{\text{m}^2}{\text{s}^2} :: metto i numeri con le unità: metà della densità dell'acqua
~ p_1 - p_2 = 5760\,\text{Pa} :: la differenza di pressione
~ \Delta h = \dfrac{5760\,\text{Pa}}{9800\,\text{N/m}^3} \approx \evidb{59\,\text{cm}} :: diviso il peso specifico $d \cdot g$ dell'acqua

Si fa anche il contrario: dal dislivello si ricavano la velocità e la portata. È il **venturimetro**, che misura l'acqua negli acquedotti.

Se la strozzatura è molto stretta, lì la pressione scende sotto quella dell'aria. Un tubicino laterale allora aspira. Così funziona la **trompa** dei laboratori, che aspira l'aria da un recipiente. Il carburatore dei vecchi motori aspirava la benzina nello stesso modo.

Prendi due fogli di carta, appendili vicini e paralleli, e soffia in mezzo. Invece di allontanarsi, si avvicinano. Il soffio, per attrito, trascina via l'aria che sta fra i fogli. Al suo posto entra altra aria da fuori: parte ferma, alla pressione $p_0$, e accelera. Lungo il suo percorso la pressione cala. Fra i fogli resta un po' sotto $p_0$, e l'aria di fuori li avvicina.

>! Bernoulli confronta punti **dello stesso tubo di flusso**. Non si applica fra l'aria ferma di una stanza e il soffio che esce dalla bocca: non sono la stessa corrente.

Anche sopra l'ala di un aereo la pressione è più bassa che sotto. Questa differenza dà la **portanza**, la forza che regge l'aereo. Una spiegazione famosa dice che l'aria di sopra fa più strada e deve arrivare insieme a quella di sotto. È falsa: le misure mostrano che l'aria di sopra arriva prima. L'ala spinge l'aria verso il basso, e l'aria spinge l'ala verso l'alto.

?? Due barche a motore procedono affiancate, vicine e veloci. L'acqua fra le due scorre più in fretta. Che cosa rischiano?
[ ] di allontanarsi, spinte dall'acqua in mezzo
[x] di avvicinarsi fino a toccarsi
[ ] niente: l'acqua non preme di lato
=> Fra le barche l'acqua accelera e la sua pressione cala. Fuori la pressione è più alta e spinge le barche una verso l'altra. Per questo le navi non si affiancano troppo.`
    },
    {
      id: 'torricelli',
      titolo: 'L\'efflusso: la legge di Torricelli',
      testo: R`Fai un foro nella parete di un secchio pieno d'acqua. Esce un getto. Con che velocità? La risposta la diede Evangelista Torricelli nel 1644, quasi un secolo prima di Bernoulli. Oggi la ricaviamo con Bernoulli in poche righe.

[[video:fluidodinamica/efflusso]]

Confrontiamo due punti: il pelo libero, in alto, e il foro, a profondità $h$ sotto di lui. In tutti e due c'è la pressione dell'aria $p_0$: sopra l'acqua e fuori dal foro. Il recipiente è largo, quindi il pelo libero scende piano: lì la velocità è quasi zero.

~ d \cdot g \cdot h = \tfrac{1}{2} \cdot d \cdot v^2 :: Bernoulli: in alto c'è la quota, al foro la velocità; $p_0$ c'è in tutti e due i punti e si toglie
~ g \cdot h = \tfrac{1}{2} \cdot v^2 :: divido per $d$
~ v = \evidb{\sqrt{2 \cdot g \cdot h}} :: la legge di Torricelli

>* **Legge di Torricelli**: un liquido esce da un foro, a profondità $h$ sotto il pelo libero, con velocità $v = \sqrt{2 \cdot g \cdot h}$. È la velocità di un corpo che cade da fermo dall'altezza $h$.

Esempio. Un foro sta 45 cm sotto il pelo libero: $v = \sqrt{2 \cdot 9{,}8 \cdot 0{,}45}\,\text{m/s} \approx 3{,}0\,\text{m/s}$. La densità non conta: dallo stesso foro anche l'olio uscirebbe a 3,0 m/s. La velocità cresce con la radice della profondità: profondità quattro volte, velocità due volte.

Fuori dal foro il getto è un **lancio orizzontale**: avanza a velocità $v$ e intanto cade. Il pelo libero sta ad altezza $H$ da terra, il foro ad altezza $H - h$. Il tempo di volo è quello di una caduta da lì: $t^2 = 2 \cdot (H - h) / g$.

~ x = v \cdot t :: in orizzontale il getto avanza a velocità costante
~ x^2 = 2 \cdot g \cdot h \cdot \dfrac{2 \cdot (H - h)}{g} :: elevo al quadrato e metto $v^2$ e $t^2$
~ x = \evidb{2 \cdot \sqrt{h \cdot (H - h)}} :: $g$ si semplifica

[[grafico:getti]]

>! Il foro più profondo dà il getto più **veloce**, non il più **lungo**. Per un recipiente appoggiato a terra, il getto più lungo esce a metà altezza fra il pelo libero e terra.

?? Un foro sta 2 m sotto il pelo libero di un serbatoio. Un altro sta 18 m sotto. Quante volte è più veloce il secondo getto?
[ ] 9 volte
[x] 3 volte
[ ] 81 volte
=> $v = \sqrt{2 \cdot g \cdot h}$: profondità nove volte, velocità $\sqrt{9} = 3$ volte.`
    },
    {
      id: 'viscosita',
      titolo: 'I fluidi reali: la viscosità',
      testo: R`Versa da un cucchiaio un po' d'acqua, poi un po' di miele. L'acqua cade subito, il miele scende piano, in un filo. Il miele è più **viscoso**.

Nei fluidi veri gli strati scorrono uno sull'altro e si frenano. In un tubo l'acqua a contatto con la parete resta ferma. Lo strato vicino scivola su di lei, e va un po' più veloce. Al centro del tubo il fluido corre più di tutto.

[[video:fluidodinamica/viscosita]]

> Nel video la spinta di Archimede si chiama $S$ e l'attrito $F$. Qui le chiamiamo $F_A$ e $F_v$, perché $S$ è già la sezione del tubo.

>* La **viscosità** è l'attrito interno di un fluido. Si misura con il coefficiente $\eta$ (eta), in $\text{Pa} \cdot \text{s}$. Più $\eta$ è grande, più il fluido frena.

Qui $\eta$ è la viscosità, non il rendimento di una macchina.

| fluido, a 20 °C | $\eta$ in $\text{Pa} \cdot \text{s}$ |
|---|---|
| aria | 0,000018 |
| acqua | 0,001 |
| olio d'oliva | circa 0,08 |
| glicerina | circa 1,4 |
| miele | circa 10 |

La viscosità dipende molto dalla temperatura. Il miele scaldato scorre meglio, e l'olio del motore a freddo è più viscoso.

Una sfera che si muove lenta in un fluido subisce un attrito che cresce con la velocità. È la **legge di Stokes**: $F_v = 6\pi \cdot \eta \cdot r \cdot v$, con $r$ raggio della sfera.

Una pallina lasciata cadere in un liquido accelera solo per un attimo. Sulla pallina agiscono tre forze: il peso $P$ verso il basso, la spinta di Archimede $F_A$ e l'attrito viscoso $F_v$ verso l'alto. L'attrito cresce con la velocità, finché le tre forze si fanno equilibrio. Da lì scende a velocità costante, la **velocità limite**. Chiamiamo $d_c$ la densità della pallina e $d_l$ quella del liquido.

~ F_v = P - F_A :: alla velocità limite le forze si fanno equilibrio
~ 6\pi \cdot \eta \cdot r \cdot v = \Delta d \cdot V \cdot g :: a destra il peso meno la spinta, con $\Delta d = d_c - d_l$
~ v_{\text{lim}} = \evidb{\dfrac{2 \cdot r^2 \cdot g \cdot (d_c - d_l)}{9 \cdot \eta}} :: con $V = \tfrac{4}{3}\pi \cdot r^3$, $\pi$ e una $r$ si semplificano

Per esempio, una pallina d'acciaio di raggio 2 mm cade nella glicerina. La formula dà circa 4 cm/s. Con il raggio doppio la velocità è quattro volte, perché va con $r^2$.

[[grafico:stokes]]

>! La legge di Stokes vale solo per moti lenti e ordinati, detti **laminari**. Se il fluido va veloce si formano vortici: il moto diventa **turbolento**, e l'attrito cresce molto di più.

?? Una pallina scende nel miele a velocità costante. Quanto vale la forza totale su di lei?
[ ] quanto il suo peso, verso il basso
[x] zero
[ ] quanto l'attrito, verso l'alto
=> Velocità costante vuol dire accelerazione zero. Per il secondo principio la forza totale è zero: peso, spinta e attrito si fanno equilibrio.`
    },
    {
      id: 'tensione',
      titolo: 'La tensione superficiale',
      testo: R`Un ago d'acciaio è quasi otto volte più denso dell'acqua. Eppure, appoggiato piano, resta a galla. Anche certi insetti camminano sull'acqua. La superficie dell'acqua si comporta come una pelle tesa.

[[video:fluidodinamica/tensione-superficiale]]

Il motivo sta nelle molecole. Dentro il liquido ogni molecola è attirata dalle vicine in tutte le direzioni, e le forze si annullano. In superficie, sopra, non c'è acqua che tiri. Le molecole sono tirate verso l'interno e di lato, e la superficie tende a restringersi.

>* La **tensione superficiale** $\gamma$ (gamma) è la forza con cui la superficie tira, per ogni metro di bordo: $\gamma = \dfrac{F}{L}$. Si misura in $\text{N/m}$. Per l'acqua a 20 °C, $\gamma \approx 0{,}073\,\text{N/m}$.

Esempio. Un filo lungo 6 cm è appoggiato sull'acqua. Su ciascun lato del filo la superficie tira con una forza:

~ F = \gamma \cdot L :: forza per metro, per la lunghezza del bordo
~ F = 0{,}073\,\text{N/m} \cdot 0{,}06\,\text{m} :: il bordo lungo un lato del filo
~ F \approx \evidb{4{,}4 \cdot 10^{-3}\,\text{N}} :: poco: è il peso di circa mezzo grammo

Sotto l'ago la superficie si incurva. Le due forze della pelle sono inclinate verso l'alto. La loro parte verticale, con la pressione dell'acqua sotto l'ago, regge il peso.

[[grafico:ago]]

La tensione superficiale spiega anche le gocce tonde. A parità di volume, la sfera è la forma con meno superficie. Il sapone abbassa $\gamma$ a circa un terzo: con una goccia di detersivo l'ago va a fondo.

In un tubo sottile, un **capillare**, l'acqua sale sopra il livello esterno: è la **capillarità**. L'acqua bagna il vetro, e la pelle tira il liquido in su lungo la parete. Per un tubo di raggio $r$ vale la legge di Jurin, $h = \dfrac{2 \cdot \gamma}{d \cdot g \cdot r}$. Più il tubo è sottile, più l'acqua sale: con $r = 0{,}5\,\text{mm}$, circa 3 cm. Il mercurio non bagna il vetro, e scende sotto il livello.

>! L'ago a galla non smentisce Archimede. La spinta è sempre il peso dell'acqua spostata. Con la conca intorno, però, l'ago sposta molta più acqua del suo volume. La pelle porta sull'ago la spinta di tutta la conca.

?? Sull'acqua galleggia un ago. Si fa cadere una goccia di sapone lontano dall'ago. Che cosa succede?
[ ] niente, perché il sapone è lontano
[x] l'ago affonda
[ ] l'ago galleggia ancora meglio
=> Il sapone si spande sulla superficie e abbassa la tensione superficiale. La pelle non regge più il peso, e l'ago va a fondo.`
    }
  ],
  grafici: {
    /* un tubo che si stringe: la velocità (frecce in scala) cresce quanto si riduce la sezione */
    tubo: {
      tipo: 'piano', x: [-0.5, 13.5], y: [-3, 2.8], assi: false, griglia: false,
      parametri: [{ nome: 'k', min: 1, max: 4, passo: 0.5, valore: 3, etichetta: 'S_1 / S_2', decimali: 1 }],
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[0, 1.6], [3, 1.6], [4.5, '1.6/k'], [9.5, '1.6/k'], [11, 1.6], [13, 1.6], [13, -1.6], [11, -1.6], [9.5, '-1.6/k'], [4.5, '-1.6/k'], [3, -1.6], [0, -1.6]] },
        { tipo: 'vettore', da: [0.6, 0], a: [1.6, 0], colore: 1 },
        { tipo: 'vettore', da: [5, 0], a: ['5 + k', 0], colore: 1 },
        { tipo: 'vettore', da: [11.4, 0], a: [12.4, 0], colore: 1 },
        { tipo: 'testo', p: [7, -2.3], testo: 'v_2 = {{k}} m/s', colore: 1 },
        { tipo: 'testo', p: [1.5, -2.3], testo: 'v_1 = 1 m/s', colore: 1 },
        { tipo: 'testo', p: [1.5, 2.2], testo: 'S_1' },
        { tipo: 'testo', p: [7, '1.6/k + 0.6'], testo: 'S_2 = S_1 / {{k}}' },
        { tipo: 'testo', p: [12, 2.2], testo: 'S_1', colore: 'grigio' }
      ],
      didascalia: 'Un tubo pieno d\'acqua che si stringe e poi si riallarga; nel disegno le altezze fanno le veci delle sezioni. Nel tratto largo l\'acqua va a 1 m/s. La portata è la stessa ovunque: nella strozzatura la velocità è tante volte più grande quante volte la sezione è più piccola. Frecce in scala.'
    },
    /* lungo un tubo di Venturi: p (viola) + ½·d·v² (verde) resta costante */
    venturi: {
      tipo: 'piano', x: [0, 30], y: [0, 9.5], altezza: 440, passo: [5, 2],
      etichette: { x: 'x (cm)', y: 'kPa' },
      parametri: [{ nome: 'v1', min: 0.4, max: 1.8, passo: 0.2, valore: 1, etichetta: 'v_1 (m/s)', decimali: 1 }],
      funzioni: [
        { f: '8', colore: 'grigio', tratteggio: true },
        { f: '8 - 0.5*v1^2*se(x < 10, 1, se(x < 12, 1 + (x - 10)/2, se(x < 18, 2, se(x < 20, 2 - (x - 18)/2, 1))))^2', colore: 4, etichetta: 'p' },
        { f: '0.5*v1^2*se(x < 10, 1, se(x < 12, 1 + (x - 10)/2, se(x < 18, 2, se(x < 20, 2 - (x - 18)/2, 1))))^2', colore: 3, etichetta: '½·d·v²' }
      ],
      elementi: [
        { tipo: 'segmento', da: [12, 0], a: [12, 8.6], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [18, 0], a: [18, 8.6], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [15, 9], testo: 'strozzatura' }
      ],
      didascalia: 'Un tubo orizzontale che fra 12 e 18 cm ha la sezione dimezzata: lì la velocità raddoppia. La pressione è quella misurata sopra la pressione dell\'aria, in kPa; anche ½·d·v² è in kPa, perché 1 J/m³ = 1 Pa. Dove ½·d·v² sale, p scende della stessa quantità: la somma, tratteggiata, resta 8 kPa.'
    },
    /* il getto da un foro: v = √(2·g·h), gittata 2·√(h·(H − h)) con il pelo libero a 1 m da terra */
    getti: {
      tipo: 'piano', x: [-0.5, 1.25], y: [-0.1, 1.2], assi: false, griglia: false,
      parametri: [{ nome: 'h', min: 0.1, max: 0.9, passo: 0.05, valore: 0.3, etichetta: 'h (m)', decimali: 2 }],
      funzioni: [
        { f: '0.5 - x^2/2', dominio: [0, 1], colore: 'grigio', tratteggio: true },
        { f: '(1 - h) - x^2/(4*h)', dominio: [0, '2*sqrt(h*(1 - h))'], colore: 1 }
      ],
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[-0.4, 0], [0, 0], [0, 1], [-0.4, 1]] },
        { tipo: 'segmento', da: [-0.5, 0], a: [1.25, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [-0.2, 1], a: [-0.2, '1 - h'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [-0.27, '1 - h/2'], testo: 'h', ancora: 'end' },
        { tipo: 'punto', p: [0, '1 - h'], colore: 1 },
        { tipo: 'punto', p: ['2*sqrt(h*(1 - h))', 0], colore: 3 },
        { tipo: 'testo', p: [1.2, 1.1], testo: 'v = {{sqrt(19.6*h)|2}} m/s', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [1.2, 1.0], testo: 'gittata = {{2*sqrt(h*(1 - h))|2}} m', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un recipiente largo appoggiato a terra, con il pelo libero a 1 m di altezza e un foro a profondità h. Più il foro è profondo, più l\'acqua esce veloce; ma il getto più lungo, tratteggiato, esce a metà altezza (h = 0,5 m) e arriva a 1 m.'
    },
    /* la velocità limite di una sfera d'acciaio in un liquido come il miele: cresce con r² */
    stokes: {
      tipo: 'piano', x: [0, 5], y: [0, 7.5], altezza: 440, passo: [1, 1],
      etichette: { x: 'r (mm)', y: 'v_{lim} (cm/s)' },
      parametri: [{ nome: 'eta', min: 5, max: 20, passo: 1, valore: 10, etichetta: 'η (Pa·s)' }],
      funzioni: [{ f: '1.3938*x^2/eta', colore: 1 }],
      elementi: [
        { tipo: 'punto', p: [3, '1.3938*9/eta'], etichetta: 'r = 3 mm: {{1.3938*9/eta|2}} cm/s', posizione: 'alto-sinistra', colore: 'grigio' }
      ],
      didascalia: 'La velocità limite di una sfera d\'acciaio (7800 kg/m³) che cade in un liquido denso 1400 kg/m³, come il miele, in funzione del raggio. Raggio doppio, velocità quattro volte. Con una viscosità più grande la curva si abbassa.'
    },
    /* l'ago a galla: la pelle tira lungo la superficie incurvata, la parte verticale regge il peso */
    ago: {
      tipo: 'piano', x: [-3.6, 3.6], y: [-3.8, 0.7], assi: false, griglia: false,
      elementi: [
        { tipo: 'poligono', colore: 1, punti: [[-3.6, -3.8], [3.6, -3.8], [3.6, 0], [2.552, 0], [0.3, -1.05], [-0.3, -1.05], [-2.552, 0], [-3.6, 0]] },
        { tipo: 'cerchio', centro: [0, -1.25], raggio: 0.3, colore: 'grigio', riempi: true },
        { tipo: 'segmento', da: [0.3, -1.05], a: [1.7, -1.05], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0.3, -1.05], da: [1.3, -1.05], a: [1.206, -0.627], raggio: 0.9, etichetta: 'α', colore: 'grigio' },
        { tipo: 'vettore', da: [0.3, -1.05], a: [2.113, -0.205], etichetta: 'F_γ', colore: 2 },
        { tipo: 'vettore', da: [-0.3, -1.05], a: [-2.113, -0.205], etichetta: 'F_γ', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [0, -1.25], a: [0, -3.54], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: [0.6, -2.05], a: [0.6, -1.45], etichetta: 'F_A', colore: 2, posizione: 'destra' }
      ],
      didascalia: 'Un ago visto di punta, appoggiato sull\'acqua. La superficie si incurva: da ogni lato la pelle tira lungo la superficie con una forza γ·L, inclinata di α. Le due parti verticali di queste forze, più la piccola spinta che l\'acqua dà da sotto, reggono il peso P. Frecce in scala.'
    }
  },
  esempi: [
    {
      titolo: 'La piscina e il tubo dell\'acqua',
      problema: R`Una piscina da $50\,\text{m}^3$ si riempie con un tubo di raggio 1 cm, in cui l'acqua corre a 1,5 m/s. Qual è la portata? Quante ore servono per riempirla?`,
      passi: [
        R`Dati: $V = 50\,\text{m}^3$, $r = 1\,\text{cm}$, $v = 1{,}5\,\text{m/s}$. Cerco la portata $Q$ e il tempo $\Delta t$.`,
        R`La sezione del tubo, in metri quadrati: $S = \pi \cdot r^2 = \pi \cdot (0{,}01\,\text{m})^2 \approx 3{,}14 \cdot 10^{-4}\,\text{m}^2$.`,
        R`La portata è sezione per velocità: $Q = 3{,}14 \cdot 10^{-4}\,\text{m}^2 \cdot 1{,}5\,\text{m/s} \approx 4{,}71 \cdot 10^{-4}\,\text{m}^3\text{/s}$, circa 0,47 litri al secondo.`,
        R`Il tempo è il volume diviso la portata: $\Delta t = \dfrac{50\,\text{m}^3}{4{,}71 \cdot 10^{-4}\,\text{m}^3\text{/s}} \approx 106\,000\,\text{s}$.`,
        R`In ore: $\Delta t = \dfrac{106\,000}{3600}\,\text{h} \approx 29{,}5\,\text{h}$. Più di un giorno intero.`,
        R`Controllo con una stima: mezzo litro al secondo fa 1800 litri all'ora, cioè $1{,}8\,\text{m}^3$. Per $50\,\text{m}^3$ servono circa $50 / 1{,}8 \approx 28$ ore. Torna.`
      ],
      risultato: R`$Q \approx 4{,}7 \cdot 10^{-4}\,\text{m}^3\text{/s}$; servono circa $29{,}5\,\text{h}$.`
    },
    {
      titolo: 'L\'ugello e la fontana',
      problema: R`Una canna ha diametro 2,4 cm e l'acqua ci scorre a 1,2 m/s. In fondo c'è un ugello di diametro 0,8 cm, rivolto verso l'alto. Con che velocità esce l'acqua? Fino a che altezza arriva il getto, trascurando l'aria?`,
      passi: [
        R`Dati: diametri $D_1 = 2{,}4\,\text{cm}$ e $D_2 = 0{,}8\,\text{cm}$, $v_1 = 1{,}2\,\text{m/s}$. Cerco la velocità d'uscita $v_2$ e l'altezza $h$ del getto.`,
        R`Le sezioni stanno come i quadrati dei diametri: $\dfrac{S_1}{S_2} = \left(\dfrac{2{,}4}{0{,}8}\right)^2 = 3^2 = 9$.`,
        R`Continuità: $v_2 = v_1 \cdot \dfrac{S_1}{S_2} = 1{,}2\,\text{m/s} \cdot 9 = 10{,}8\,\text{m/s}$.`,
        R`Il getto sale finché tutta l'energia cinetica è diventata potenziale: $h = \dfrac{v_2^2}{2 \cdot g} = \dfrac{10{,}8^2}{19{,}6}\,\text{m} \approx 5{,}95\,\text{m}$.`,
        R`Controllo con Torricelli al contrario: un corpo che cade da 5,95 m arriva a $\sqrt{2 \cdot 9{,}8 \cdot 5{,}95}\,\text{m/s} \approx 10{,}8\,\text{m/s}$. Torna.`
      ],
      risultato: R`L'acqua esce a $10{,}8\,\text{m/s}$; il getto arriva a circa $6\,\text{m}$.`
    },
    {
      titolo: 'Il venturimetro',
      problema: R`In un venturimetro orizzontale il tratto largo ha sezione $12\,\text{cm}^2$, tre volte quella della strozzatura. Fra i due tubicini c'è un dislivello di 20 cm. Quanto è veloce l'acqua nel tratto largo? Qual è la portata?`,
      passi: [
        R`Dati: $S_1 = 12\,\text{cm}^2$, $S_1 / S_2 = 3$, $\Delta h = 20\,\text{cm}$, $d = 1000\,\text{kg/m}^3$. Cerco la velocità $v_1$ e la portata $Q$.`,
        R`Il dislivello dà la differenza di pressione: $p_1 - p_2 = d \cdot g \cdot \Delta h = 1000 \cdot 9{,}8 \cdot 0{,}20\,\text{Pa} = 1960\,\text{Pa}$.`,
        R`Continuità: sezione tre volte più piccola, velocità tripla. Quindi $v_2 = 3 \cdot v_1$ e $v_2^2 = 9 \cdot v_1^2$.`,
        R`Bernoulli: $p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (9 \cdot v_1^2 - v_1^2) = 4 \cdot d \cdot v_1^2$. Quindi $v_1^2 = \dfrac{1960}{4000}\,\text{m}^2/\text{s}^2 = 0{,}49\,\text{m}^2/\text{s}^2$, e $v_1 = 0{,}7\,\text{m/s}$.`,
        R`La portata: $Q = S_1 \cdot v_1 = 12 \cdot 10^{-4}\,\text{m}^2 \cdot 0{,}7\,\text{m/s} = 8{,}4 \cdot 10^{-4}\,\text{m}^3\text{/s}$, cioè 0,84 litri al secondo.`,
        R`Controllo: nella strozzatura $v_2 = 2{,}1\,\text{m/s}$, e $500 \cdot (2{,}1^2 - 0{,}7^2)\,\text{Pa} = 500 \cdot 3{,}92\,\text{Pa} = 1960\,\text{Pa}$. Torna.`
      ],
      risultato: R`$v_1 = 0{,}7\,\text{m/s}$; $Q = 8{,}4 \cdot 10^{-4}\,\text{m}^3\text{/s} = 0{,}84\,\text{L/s}$.`
    },
    {
      titolo: 'L\'acqua che sale al secondo piano',
      problema: R`A pianterreno l'acqua scorre in un tubo a 1,5 m/s, con una pressione di $300\,000\,\text{Pa}$. Il tubo sale di 6 m e la sua sezione si dimezza. Quanto vale la pressione al secondo piano?`,
      passi: [
        R`Dati: $p_1 = 300\,000\,\text{Pa}$, $v_1 = 1{,}5\,\text{m/s}$, dislivello $h_2 - h_1 = 6\,\text{m}$, $S_2 = S_1 / 2$. Cerco la pressione $p_2$.`,
        R`Continuità: sezione metà, velocità doppia. Quindi $v_2 = 3\,\text{m/s}$.`,
        R`Bernoulli con le quote: $p_2 = p_1 + \tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2) - d \cdot g \cdot (h_2 - h_1)$.`,
        R`Il termine delle velocità: $500 \cdot (2{,}25 - 9)\,\text{Pa} = -3375\,\text{Pa}$. Il termine della quota: $1000 \cdot 9{,}8 \cdot 6\,\text{Pa} = 58\,800\,\text{Pa}$.`,
        R`Quindi $p_2 = 300\,000\,\text{Pa} - 3375\,\text{Pa} - 58\,800\,\text{Pa} = 237\,825\,\text{Pa} \approx 238\,000\,\text{Pa}$.`,
        R`Controllo: quasi tutto il calo viene dalla quota. Sei metri d'acqua valgono circa 0,6 atmosfere, come dice Stevino.`
      ],
      risultato: R`Al secondo piano $p_2 \approx 238\,000\,\text{Pa}$.`
    },
    {
      titolo: 'Il serbatoio bucato',
      problema: R`Un serbatoio largo, appoggiato a terra, è pieno d'acqua fino a 2,3 m di altezza. Ha un foro di $3\,\text{cm}^2$ a 0,5 m da terra. Con che velocità esce l'acqua? Quanti litri escono al secondo? A che distanza dal serbatoio il getto tocca terra?`,
      passi: [
        R`Dati: pelo libero a $H = 2{,}3\,\text{m}$, foro a $0{,}5\,\text{m}$ da terra, sezione del foro $S = 3\,\text{cm}^2$. Cerco la velocità $v$, la portata $Q$ e la gittata $x$.`,
        R`Il foro sta $h = 2{,}3\,\text{m} - 0{,}5\,\text{m} = 1{,}8\,\text{m}$ sotto il pelo libero.`,
        R`Torricelli: $v = \sqrt{2 \cdot 9{,}8 \cdot 1{,}8}\,\text{m/s} = \sqrt{35{,}28}\,\text{m/s} \approx 5{,}94\,\text{m/s}$.`,
        R`La portata: $Q = S \cdot v = 3 \cdot 10^{-4}\,\text{m}^2 \cdot 5{,}94\,\text{m/s} \approx 1{,}78 \cdot 10^{-3}\,\text{m}^3\text{/s}$, circa 1,8 litri al secondo.`,
        R`Il tempo di caduta da 0,5 m: $t = \sqrt{\dfrac{2 \cdot 0{,}5}{9{,}8}}\,\text{s} \approx 0{,}319\,\text{s}$. La gittata: $x = 5{,}94\,\text{m/s} \cdot 0{,}319\,\text{s} \approx 1{,}90\,\text{m}$.`,
        R`Controllo con la formula: $x = 2 \cdot \sqrt{h \cdot (H - h)} = 2 \cdot \sqrt{1{,}8 \cdot 0{,}5}\,\text{m} \approx 1{,}90\,\text{m}$. Torna.`
      ],
      risultato: R`$v \approx 5{,}9\,\text{m/s}$, circa $1{,}8\,\text{L/s}$; il getto tocca terra a circa $1{,}9\,\text{m}$.`
    },
    {
      titolo: 'La viscosità misurata con una pallina',
      problema: R`Una pallina d'acciaio, di densità $7800\,\text{kg/m}^3$ e raggio 1,5 mm, scende nell'olio di ricino, di densità $960\,\text{kg/m}^3$. A velocità costante percorre 15 cm in 4,5 s. Quanto vale la viscosità dell'olio?`,
      passi: [
        R`Dati: $r = 1{,}5\,\text{mm}$, $d_c = 7800\,\text{kg/m}^3$, $d_l = 960\,\text{kg/m}^3$, $15\,\text{cm}$ in $4{,}5\,\text{s}$. Cerco la viscosità $\eta$.`,
        R`La velocità è costante, quindi è la velocità limite: $v = \dfrac{0{,}15\,\text{m}}{4{,}5\,\text{s}} \approx 0{,}0333\,\text{m/s}$.`,
        R`Dalla formula della velocità limite ricavo $\eta$: $\eta = \dfrac{2 \cdot r^2 \cdot g \cdot (d_c - d_l)}{9 \cdot v}$.`,
        R`Con i numeri nel SI: $\eta = \dfrac{2 \cdot (1{,}5 \cdot 10^{-3})^2 \cdot 9{,}8 \cdot 6840}{9 \cdot 0{,}0333}\,\text{Pa} \cdot \text{s} \approx 1{,}0\,\text{Pa} \cdot \text{s}$.`,
        R`Controllo: l'olio di ricino a 20 °C ha proprio $\eta \approx 1\,\text{Pa} \cdot \text{s}$, mille volte l'acqua. La pallina va piano, quindi il moto è laminare e Stokes vale.`
      ],
      risultato: R`$\eta \approx 1{,}0\,\text{Pa} \cdot \text{s}$`
    }
  ],
  formulario: [
    { nome: 'Portata', formula: R`Q = \dfrac{V}{\Delta t} \qquad Q = S \cdot v`, nota: R`In $\text{m}^3\text{/s}$. $S$ è la sezione del tubo, $v$ la velocità del fluido.` },
    { nome: 'Litri e metri cubi', formula: R`1\,\text{L/s} = 10^{-3}\,\text{m}^3\text{/s}`, nota: R`Un litro è un decimetro cubo. E $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$.` },
    { nome: 'Equazione di continuità', formula: R`S_1 \cdot v_1 = S_2 \cdot v_2`, nota: R`Fluido incomprimibile, moto stazionario. Diametro metà: sezione un quarto, velocità quattro volte.` },
    { nome: 'Teorema di Bernoulli', formula: R`p + \tfrac{1}{2} \cdot d \cdot v^2 + d \cdot g \cdot h = \text{cost.}`, nota: R`Fluido ideale, moto stazionario, lungo uno stesso tubo di flusso. Ogni termine è in pascal.` },
    { nome: 'Tubo di Venturi', formula: R`p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2)`, nota: R`Tubo orizzontale. Con i tubicini: $p_1 - p_2 = d \cdot g \cdot \Delta h$.` },
    { nome: 'Legge di Torricelli', formula: R`v = \sqrt{2 \cdot g \cdot h}`, nota: R`$h$ è la profondità del foro sotto il pelo libero, in un recipiente largo.` },
    { nome: 'Gittata del getto', formula: R`x = 2 \cdot \sqrt{h \cdot (H - h)}`, nota: R`Recipiente a terra, pelo libero ad altezza $H$. Massima con il foro a metà altezza: $x = H$.` },
    { nome: 'Legge di Stokes', formula: R`F_v = 6\pi \cdot \eta \cdot r \cdot v`, nota: R`Sfera di raggio $r$ in moto lento (laminare). $\eta$ in $\text{Pa} \cdot \text{s}$.` },
    { nome: 'Velocità limite di una sfera', formula: R`v_{\text{lim}} = \dfrac{2 \cdot r^2 \cdot g \cdot (d_c - d_l)}{9 \cdot \eta}`, nota: R`$d_c$ densità della sfera, $d_l$ del liquido. Raggio doppio, velocità quattro volte.` },
    { nome: 'Tensione superficiale', formula: R`\gamma = \dfrac{F}{L}`, nota: R`In $\text{N/m}$. Per l'acqua a 20 °C, $\gamma \approx 0{,}073\,\text{N/m}$.` },
    { nome: 'Legge di Jurin', formula: R`h = \dfrac{2 \cdot \gamma}{d \cdot g \cdot r}`, nota: R`Risalita in un capillare di raggio $r$, per un liquido che bagna bene il vetro.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'portata', tipo: 'definizione', fronte: R`Che cos'è la **portata**?`, retro: R`Il volume di fluido che attraversa una sezione in un secondo: $Q = \dfrac{V}{\Delta t}$, in $\text{m}^3\text{/s}$.` },
    { id: 'fc-02', sezione: 'portata', tipo: 'formula', fronte: R`La portata con sezione e velocità`, retro: R`$Q = S \cdot v$: sezione del tubo per velocità del fluido.` },
    { id: 'fc-03', sezione: 'portata', tipo: 'definizione', fronte: R`Che cos'è un **fluido ideale**?`, retro: R`Un fluido incomprimibile (il volume non cambia) e senza viscosità (nessun attrito interno).` },
    { id: 'fc-04', sezione: 'portata', tipo: 'definizione', fronte: R`Quando un moto si dice **stazionario**?`, retro: R`Quando in ogni punto la velocità del fluido resta la stessa nel tempo. Le linee di flusso non si incrociano.` },
    { id: 'fc-05', sezione: 'continuita', tipo: 'formula', fronte: R`L'**equazione di continuità**`, retro: R`$S_1 \cdot v_1 = S_2 \cdot v_2$: la portata è la stessa in tutte le sezioni del tubo.` },
    { id: 'fc-06', sezione: 'continuita', tipo: 'concetto', fronte: R`Perché vale l'equazione di continuità?`, retro: R`Perché il fluido è incomprimibile: non si accumula da nessuna parte. Quanto ne entra in un secondo, tanto ne esce.` },
    { id: 'fc-07', sezione: 'continuita', tipo: 'concetto', fronte: R`Il diametro di un tubo si dimezza. Che cosa succede alla velocità?`, retro: R`Diventa quattro volte più grande: la sezione va con il quadrato del diametro, e diventa un quarto.` },
    { id: 'fc-08', sezione: 'bernoulli', tipo: 'formula', fronte: R`Il **teorema di Bernoulli**`, retro: R`$p + \tfrac{1}{2} \cdot d \cdot v^2 + d \cdot g \cdot h = \text{costante}$ lungo un tubo di flusso, per un fluido ideale in moto stazionario.` },
    { id: 'fc-09', sezione: 'bernoulli', tipo: 'concetto', fronte: R`Da quale principio viene il teorema di Bernoulli?`, retro: R`Dalla conservazione dell'energia: il lavoro delle forze di pressione diventa energia cinetica e potenziale. Ogni termine è un'energia per unità di volume.` },
    { id: 'fc-10', sezione: 'bernoulli', tipo: 'concetto', fronte: R`In che unità si misura $\tfrac{1}{2} \cdot d \cdot v^2$?`, retro: R`In $\text{J/m}^3$, che è lo stesso del pascal: $1\,\text{J/m}^3 = 1\,\text{N/m}^2 = 1\,\text{Pa}$.` },
    { id: 'fc-11', sezione: 'bernoulli', tipo: 'concetto', fronte: R`Che cosa diventa Bernoulli con il fluido fermo?`, retro: R`Con $v = 0$ resta $p + d \cdot g \cdot h$ costante: è la legge di Stevino.` },
    { id: 'fc-12', sezione: 'venturi', tipo: 'definizione', fronte: R`Che cos'è un **tubo di Venturi**?`, retro: R`Un tubo con una strozzatura. Lì la velocità cresce e la pressione cala; dal dislivello fra due tubicini si ricava la portata.` },
    { id: 'fc-13', sezione: 'venturi', tipo: 'concetto', fronte: R`Si soffia fra due fogli vicini. Perché si avvicinano?`, retro: R`L'aria che entra fra i fogli parte ferma a $p_0$ e accelera: la sua pressione cala sotto $p_0$. L'aria di fuori li spinge uno verso l'altro.` },
    { id: 'fc-14', sezione: 'venturi', tipo: 'concetto', fronte: R`Fra quali punti si può applicare Bernoulli?`, retro: R`Fra punti dello stesso tubo di flusso. Non fra l'aria ferma di una stanza e un getto che viene da un'altra parte.` },
    { id: 'fc-15', sezione: 'torricelli', tipo: 'formula', fronte: R`La **legge di Torricelli**`, retro: R`$v = \sqrt{2 \cdot g \cdot h}$, con $h$ profondità del foro sotto il pelo libero.` },
    { id: 'fc-16', sezione: 'torricelli', tipo: 'concetto', fronte: R`A che cosa somiglia la velocità con cui l'acqua esce da un foro?`, retro: R`Alla velocità di un sasso che cade da fermo dal pelo libero fino al foro.` },
    { id: 'fc-17', sezione: 'torricelli', tipo: 'concetto', fronte: R`Recipiente a terra con più fori: quale getto arriva più lontano?`, retro: R`Quello del foro a metà altezza fra il pelo libero e terra. Il più profondo è il più veloce, ma cade da poco in alto.` },
    { id: 'fc-18', sezione: 'viscosita', tipo: 'definizione', fronte: R`Che cos'è la **viscosità**?`, retro: R`L'attrito interno di un fluido, fra strati che scorrono uno sull'altro. Si misura con $\eta$, in $\text{Pa} \cdot \text{s}$.` },
    { id: 'fc-19', sezione: 'viscosita', tipo: 'formula', fronte: R`La **legge di Stokes**`, retro: R`$F_v = 6\pi \cdot \eta \cdot r \cdot v$: l'attrito viscoso su una sfera in moto lento.` },
    { id: 'fc-20', sezione: 'viscosita', tipo: 'concetto', fronte: R`Che cos'è la **velocità limite** di una pallina in un liquido?`, retro: R`La velocità costante a cui arriva quando l'attrito viscoso più la spinta uguagliano il peso. Cresce con $r^2$ e cala con $\eta$.` },
    { id: 'fc-21', sezione: 'viscosita', tipo: 'concetto', fronte: R`Moto **laminare** e moto **turbolento**`, retro: R`Laminare: strati ordinati, a bassa velocità. Turbolento: vortici, ad alta velocità. Stokes vale solo nel moto laminare.` },
    { id: 'fc-22', sezione: 'tensione', tipo: 'definizione', fronte: R`Che cos'è la **tensione superficiale**?`, retro: R`La forza con cui la superficie di un liquido tira, per metro di bordo: $\gamma = F / L$, in N/m. Per l'acqua circa $0{,}073\,\text{N/m}$.` },
    { id: 'fc-23', sezione: 'tensione', tipo: 'concetto', fronte: R`Che cos'è la **capillarità**?`, retro: R`In un tubo sottile l'acqua sale sopra il livello esterno; più il tubo è sottile, più sale: $h = \dfrac{2 \cdot \gamma}{d \cdot g \cdot r}$.` },
    { id: 'fc-24', sezione: 'tensione', tipo: 'concetto', fronte: R`Perché una goccia di sapone fa affondare un ago che galleggia?`, retro: R`Il sapone abbassa la tensione superficiale a circa un terzo: la pelle dell'acqua non regge più il peso dell'ago.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una bottiglia da 12 litri si riempie in 4 s. Qual è la portata del rubinetto, in litri al secondo?`, suggerimenti: [R`Portata: volume diviso tempo.`], risposta: { tipo: 'numero', valore: 3, unita: 'L/s' }, soluzione: [R`$Q = \dfrac{V}{\Delta t} = \dfrac{12\,\text{L}}{4\,\text{s}} = 3\,\text{L/s}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`In un tubo di sezione $4\,\text{cm}^2$ l'acqua scorre a 3 m/s. Qual è la portata, in $\text{m}^3\text{/s}$?`, suggerimenti: [R`Porta prima la sezione in metri quadrati: $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$.`, R`Poi $Q = S \cdot v$.`], risposta: { tipo: 'numero', valore: 0.0012, unita: 'm³/s' }, soluzione: [R`$S = 4 \cdot 10^{-4}\,\text{m}^2$.`, R`$Q = S \cdot v = 4 \cdot 10^{-4}\,\text{m}^2 \cdot 3\,\text{m/s} = 1{,}2 \cdot 10^{-3}\,\text{m}^3\text{/s}$, cioè 1,2 L/s.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Esprimi $0{,}5\,\text{m}^3\text{/s}$ in litri al secondo.`, suggerimenti: [R`Un metro cubo contiene 1000 litri.`], risposta: { tipo: 'numero', valore: 500, unita: 'L/s', soloUnita: true }, soluzione: [R`$Q = 0{,}5 \cdot 1000\,\text{L/s} = 500\,\text{L/s}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un serbatoio da 60 litri si riempie con una portata di 0,5 litri al secondo. Quanti secondi ci vogliono?`, suggerimenti: [R`Il tempo è il volume diviso la portata.`], risposta: { tipo: 'numero', valore: 120, unita: 's' }, soluzione: [R`$\Delta t = \dfrac{V}{Q} = \dfrac{60\,\text{L}}{0{,}5\,\text{L/s}} = 120\,\text{s}$, cioè due minuti.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un tubo di sezione $20\,\text{cm}^2$ porta 8 litri al secondo. Con che velocità scorre l'acqua?`, suggerimenti: [R`Da $Q = S \cdot v$ ricava $v$, con le unità del SI.`, R`$8\,\text{L/s} = 0{,}008\,\text{m}^3\text{/s}$ e $20\,\text{cm}^2 = 0{,}002\,\text{m}^2$.`], risposta: { tipo: 'numero', valore: 4, unita: 'm/s' }, soluzione: [R`$v = \dfrac{Q}{S} = \dfrac{0{,}008\,\text{m}^3\text{/s}}{0{,}002\,\text{m}^2} = 4\,\text{m/s}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un tubo passa da una sezione di $15\,\text{cm}^2$ a una di $5\,\text{cm}^2$. Nel tratto largo l'acqua va a 2,5 m/s. Quanto è veloce nel tratto stretto?`, suggerimenti: [R`Equazione di continuità: $S_1 \cdot v_1 = S_2 \cdot v_2$.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'm/s' }, soluzione: [R`$v_2 = v_1 \cdot \dfrac{S_1}{S_2} = 2{,}5\,\text{m/s} \cdot \dfrac{15}{5} = 7{,}5\,\text{m/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`In un tubo tondo l'acqua scorre a 0,6 m/s. Più avanti il diametro del tubo si dimezza. Quanto è veloce l'acqua nel tratto stretto?`, suggerimenti: [R`La sezione va con il quadrato del diametro.`, R`Diametro metà: sezione un quarto.`], risposta: { tipo: 'numero', valore: 2.4, unita: 'm/s' }, soluzione: [R`La sezione diventa un quarto, quindi la velocità diventa quattro volte.`, R`$v_2 = 4 \cdot 0{,}6\,\text{m/s} = 2{,}4\,\text{m/s}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`In un tubo di sezione $30\,\text{cm}^2$ l'acqua va a 1 m/s. Quanto deve essere grande la sezione di un ugello perché l'acqua esca a 5 m/s?`, suggerimenti: [R`Da $S_1 \cdot v_1 = S_2 \cdot v_2$ ricava $S_2$.`], risposta: { tipo: 'numero', valore: 6, unita: 'cm²' }, soluzione: [R`$S_2 = S_1 \cdot \dfrac{v_1}{v_2} = 30\,\text{cm}^2 \cdot \dfrac{1}{5} = 6\,\text{cm}^2$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`In un tubo orizzontale l'acqua passa da 2 m/s a 4 m/s. Nel tratto lento la pressione è 150 kPa. Quanto vale nel tratto veloce?`, suggerimenti: [R`Bernoulli con la stessa quota: $p_2 = p_1 + \tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2)$.`, R`Per l'acqua $\tfrac{1}{2} \cdot d = 500\,\text{kg/m}^3$.`], risposta: { tipo: 'numero', valore: 144, unita: 'kPa' }, soluzione: [R`$\tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2) = 500 \cdot (4 - 16)\,\text{Pa} = -6000\,\text{Pa}$.`, R`$p_2 = 150\,000\,\text{Pa} - 6000\,\text{Pa} = 144\,000\,\text{Pa} = 144\,\text{kPa}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`L'acqua scorre a 5 m/s. Quanto vale il termine $\tfrac{1}{2} \cdot d \cdot v^2$, in kPa?`, suggerimenti: [R`$d = 1000\,\text{kg/m}^3$. Il risultato esce in pascal.`], risposta: { tipo: 'numero', valore: 12.5, unita: 'kPa' }, soluzione: [R`$\tfrac{1}{2} \cdot 1000\,\text{kg/m}^3 \cdot (5\,\text{m/s})^2 = 500 \cdot 25\,\text{Pa} = 12\,500\,\text{Pa} = 12{,}5\,\text{kPa}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`In un tubo orizzontale l'acqua scorre a 2 m/s. In una strozzatura la pressione è più bassa di 16 000 Pa. Quanto è veloce l'acqua nella strozzatura?`, suggerimenti: [R`$p_1 - p_2 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2)$.`, R`$16\,000 = 500 \cdot (v_2^2 - 4)$.`], risposta: { tipo: 'numero', valore: 6, unita: 'm/s' }, soluzione: [R`$v_2^2 - 4 = \dfrac{16\,000}{500} = 32$, quindi $v_2^2 = 36\,\text{m}^2/\text{s}^2$.`, R`$v_2 = 6\,\text{m/s}$: la velocità triplica.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Un tubo di sezione costante sale di 4 m. L'acqua scorre sempre alla stessa velocità. Di quanti kPa cala la pressione fra la base e la cima?`, suggerimenti: [R`Sezione costante: la velocità non cambia, e in Bernoulli il termine $\tfrac{1}{2} \cdot d \cdot v^2$ si toglie.`, R`Resta $p_1 - p_2 = d \cdot g \cdot (h_2 - h_1)$.`], risposta: { tipo: 'numero', valore: 39.2, unita: 'kPa' }, soluzione: [R`$p_1 - p_2 = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 4\,\text{m} = 39\,200\,\text{Pa} = 39{,}2\,\text{kPa}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un serbatoio largo ha un foro 5 m sotto il pelo libero. Con che velocità esce l'acqua?`, suggerimenti: [R`Legge di Torricelli: $v = \sqrt{2 \cdot g \cdot h}$.`], risposta: { tipo: 'numero', valore: 9.9, unita: 'm/s' }, soluzione: [R`$v = \sqrt{2 \cdot 9{,}8 \cdot 5}\,\text{m/s} = \sqrt{98}\,\text{m/s} \approx 9{,}9\,\text{m/s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Da un foro di un serbatoio l'acqua esce a 7 m/s. Quanto sta sotto il pelo libero il foro?`, suggerimenti: [R`Da $v^2 = 2 \cdot g \cdot h$ ricava $h$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'm' }, soluzione: [R`$h = \dfrac{v^2}{2 \cdot g} = \dfrac{49}{19{,}6}\,\text{m} = 2{,}5\,\text{m}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Da un foro di $2{,}5\,\text{cm}^2$ l'acqua esce a 4 m/s. Quanti litri escono al secondo?`, suggerimenti: [R`$Q = S \cdot v$, con la sezione in metri quadrati.`], risposta: { tipo: 'numero', valore: 1, unita: 'L/s' }, soluzione: [R`$Q = 2{,}5 \cdot 10^{-4}\,\text{m}^2 \cdot 4\,\text{m/s} = 10^{-3}\,\text{m}^3\text{/s} = 1\,\text{L/s}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Un recipiente sta a terra. Un foro è 0,4 m sotto il pelo libero e 0,9 m sopra terra. A che distanza dal recipiente il getto tocca terra?`, suggerimenti: [R`Usa $x = 2 \cdot \sqrt{h \cdot (H - h)}$: $H - h$ è l'altezza del foro da terra.`], risposta: { tipo: 'numero', valore: 1.2, unita: 'm' }, soluzione: [R`$x = 2 \cdot \sqrt{0{,}4 \cdot 0{,}9}\,\text{m} = 2 \cdot \sqrt{0{,}36}\,\text{m} = 2 \cdot 0{,}6\,\text{m} = 1{,}2\,\text{m}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una sfera di raggio 4 mm si muove a 5 cm/s in un olio con $\eta = 1{,}5\,\text{Pa} \cdot \text{s}$. Quanto vale l'attrito viscoso, in millinewton?`, suggerimenti: [R`Legge di Stokes: $F_v = 6\pi \cdot \eta \cdot r \cdot v$.`, R`Tutto nel SI: $r = 0{,}004\,\text{m}$, $v = 0{,}05\,\text{m/s}$.`], risposta: { tipo: 'numero', valore: 5.65, unita: 'mN', tolleranza: 0.06 }, soluzione: [R`$F_v = 6\pi \cdot 1{,}5 \cdot 0{,}004 \cdot 0{,}05\,\text{N} \approx 5{,}65 \cdot 10^{-3}\,\text{N}$.`, R`Cioè circa $5{,}7\,\text{mN}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Una pallina scende in un liquido con velocità limite 6 cm/s. La stessa pallina cade in un liquido con la stessa densità, ma con $\eta$ tre volte più grande. Qual è la nuova velocità limite?`, suggerimenti: [R`La velocità limite è inversamente proporzionale a $\eta$.`], risposta: { tipo: 'numero', valore: 2, unita: 'cm/s' }, soluzione: [R`In $v_{\text{lim}}$ la viscosità sta al denominatore: $\eta$ tre volte, velocità un terzo.`, R`$v = \dfrac{6\,\text{cm/s}}{3} = 2\,\text{cm/s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un filo lungo 10 cm è appoggiato sull'acqua ($\gamma = 0{,}073\,\text{N/m}$). Con che forza la superficie tira un lato del filo, in millinewton?`, suggerimenti: [R`$F = \gamma \cdot L$, con $L$ in metri.`], risposta: { tipo: 'numero', valore: 7.3, unita: 'mN' }, soluzione: [R`$F = 0{,}073\,\text{N/m} \cdot 0{,}1\,\text{m} = 0{,}0073\,\text{N} = 7{,}3\,\text{mN}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`La superficie di un liquido tira un bordo lungo 0,2 m con una forza di 0,012 N. Quanto vale la tensione superficiale?`, suggerimenti: [R`$\gamma = \dfrac{F}{L}$.`], risposta: { tipo: 'numero', valore: 0.06, unita: 'N/m' }, soluzione: [R`$\gamma = \dfrac{0{,}012\,\text{N}}{0{,}2\,\text{m}} = 0{,}06\,\text{N/m}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Il sangue esce dal cuore nell'aorta, di sezione $3\,\text{cm}^2$, a 30 cm/s. Poi si divide in miliardi di capillari, che tutti insieme hanno una sezione di $2000\,\text{cm}^2$. Quanto è veloce il sangue nei capillari, in mm/s?`, suggerimenti: [R`La portata totale è la stessa: quella dell'aorta si divide fra tutti i capillari.`, R`$S_1 \cdot v_1 = S_2 \cdot v_2$, con $S_2$ la sezione totale dei capillari.`], risposta: { tipo: 'numero', valore: 0.45, unita: 'mm/s' }, soluzione: [R`Portata: $Q = 3\,\text{cm}^2 \cdot 30\,\text{cm/s} = 90\,\text{cm}^3\text{/s}$, circa 5,4 litri al minuto.`, R`Nei capillari: $v_2 = \dfrac{90\,\text{cm}^3\text{/s}}{2000\,\text{cm}^2} = 0{,}045\,\text{cm/s} = 0{,}45\,\text{mm/s}$.`, R`Il sangue rallenta proprio dove deve scambiare ossigeno con i tessuti.`] },
    { id: 'es-02', difficolta: 2, testo: R`Una canna orizzontale di diametro 2 cm finisce con un ugello di diametro 1 cm. Nella canna l'acqua va a 1,75 m/s. Di quanto la pressione nella canna supera quella dell'aria?`, suggerimenti: [R`All'uscita il getto è nell'aria: la sua pressione è $p_0$.`, R`Trova prima la velocità d'uscita con la continuità, poi usa Bernoulli.`], risposta: { tipo: 'numero', valore: 23, unita: 'kPa', tolleranza: 0.2 }, soluzione: [R`Diametro metà: sezione un quarto, velocità quattro volte. $v_2 = 4 \cdot 1{,}75\,\text{m/s} = 7\,\text{m/s}$.`, R`Bernoulli fra canna e uscita: $p_1 - p_0 = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2) = 500 \cdot (49 - 3{,}0625)\,\text{Pa}$.`, R`$p_1 - p_0 \approx 22\,970\,\text{Pa} \approx 23\,\text{kPa}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`In un tubo di Venturi orizzontale la strozzatura ha metà della sezione del tratto largo. Nel tratto largo l'acqua va a 2,1 m/s. Quanto è il dislivello fra le colonne d'acqua dei due tubicini, in centimetri?`, suggerimenti: [R`Nella strozzatura la velocità raddoppia: $v_2 = 4{,}2\,\text{m/s}$.`, R`$d \cdot g \cdot \Delta h = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2)$.`], risposta: { tipo: 'numero', valore: 67.5, unita: 'cm' }, soluzione: [R`$p_1 - p_2 = 500 \cdot (4{,}2^2 - 2{,}1^2)\,\text{Pa} = 500 \cdot 13{,}23\,\text{Pa} = 6615\,\text{Pa}$.`, R`$\Delta h = \dfrac{6615\,\text{Pa}}{9800\,\text{N/m}^3} = 0{,}675\,\text{m} = 67{,}5\,\text{cm}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`In cantina l'acqua scorre in un tubo largo a 1 m/s, con pressione $350\,000\,\text{Pa}$. Il tubo sale di 10 m fino a un rubinetto, dove l'acqua corre a 4 m/s. Quanto vale la pressione davanti al rubinetto?`, suggerimenti: [R`Bernoulli completo, con il termine della velocità e quello della quota.`, R`$p_2 = p_1 + \tfrac{1}{2} \cdot d \cdot (v_1^2 - v_2^2) - d \cdot g \cdot (h_2 - h_1)$.`], risposta: { tipo: 'numero', valore: 244500, unita: 'Pa' }, soluzione: [R`Velocità: $500 \cdot (1 - 16)\,\text{Pa} = -7500\,\text{Pa}$.`, R`Quota: $1000 \cdot 9{,}8 \cdot 10\,\text{Pa} = 98\,000\,\text{Pa}$.`, R`$p_2 = 350\,000 - 7500 - 98\,000 = 244\,500\,\text{Pa}$, circa 245 kPa.`] },
    { id: 'es-05', difficolta: 2, testo: R`Una botte larga ha un foro di $1{,}5\,\text{cm}^2$, 3,2 m sotto il pelo libero. Quanti litri escono al minuto, finché il livello resta quasi lo stesso?`, suggerimenti: [R`Prima la velocità con Torricelli, poi la portata $Q = S \cdot v$.`, R`Alla fine porta i $\text{m}^3\text{/s}$ in litri al minuto.`], risposta: { tipo: 'numero', valore: 71, unita: 'L/min', tolleranza: 1 }, soluzione: [R`$v = \sqrt{2 \cdot 9{,}8 \cdot 3{,}2}\,\text{m/s} = \sqrt{62{,}72}\,\text{m/s} \approx 7{,}92\,\text{m/s}$.`, R`$Q = 1{,}5 \cdot 10^{-4}\,\text{m}^2 \cdot 7{,}92\,\text{m/s} \approx 1{,}19 \cdot 10^{-3}\,\text{m}^3\text{/s} = 1{,}19\,\text{L/s}$.`, R`In un minuto: $1{,}19\,\text{L/s} \cdot 60\,\text{s} \approx 71\,\text{L}$.`] },
    { id: 'es-06', difficolta: 2, testo: R`Una tanica a terra è piena d'acqua fino a 1,6 m. Si vuole il getto più lungo possibile. Quanto lontano arriva?`, suggerimenti: [R`Il getto più lungo esce a metà altezza: $h = H - h$.`, R`Usa $x = 2 \cdot \sqrt{h \cdot (H - h)}$.`], risposta: { tipo: 'numero', valore: 1.6, unita: 'm' }, soluzione: [R`Foro a metà: $h = 0{,}8\,\text{m}$ sotto il pelo libero e $0{,}8\,\text{m}$ sopra terra.`, R`$x = 2 \cdot \sqrt{0{,}8 \cdot 0{,}8}\,\text{m} = 2 \cdot 0{,}8\,\text{m} = 1{,}6\,\text{m}$.`, R`Il getto più lungo arriva a una distanza pari all'altezza del pelo libero.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una goccia di nebbia ha raggio $20\,\mu\text{m}$. Quanto vale la sua velocità limite nell'aria ($\eta = 1{,}8 \cdot 10^{-5}\,\text{Pa} \cdot \text{s}$), in cm/s? La spinta dell'aria è trascurabile.`, suggerimenti: [R`$v_{\text{lim}} = \dfrac{2 \cdot r^2 \cdot g \cdot (d_c - d_l)}{9 \cdot \eta}$, con $d_c = 1000\,\text{kg/m}^3$ e $d_l \approx 0$.`, R`$r = 2 \cdot 10^{-5}\,\text{m}$, quindi $r^2 = 4 \cdot 10^{-10}\,\text{m}^2$.`], risposta: { tipo: 'numero', valore: 4.8, unita: 'cm/s', tolleranza: 0.1 }, soluzione: [R`$v_{\text{lim}} = \dfrac{2 \cdot 4 \cdot 10^{-10} \cdot 9{,}8 \cdot 1000}{9 \cdot 1{,}8 \cdot 10^{-5}}\,\text{m/s} = \dfrac{7{,}84 \cdot 10^{-6}}{1{,}62 \cdot 10^{-4}}\,\text{m/s}$.`, R`$v_{\text{lim}} \approx 0{,}048\,\text{m/s} \approx 4{,}8\,\text{cm/s}$. Basta una lieve corrente verso l'alto a tenerla sospesa.`] },
    { id: 'es-08', difficolta: 2, testo: R`Un tubicino di vetro ha raggio 0,4 mm. Di quanti centimetri sale l'acqua dentro di lui ($\gamma = 0{,}073\,\text{N/m}$)?`, suggerimenti: [R`Legge di Jurin: $h = \dfrac{2 \cdot \gamma}{d \cdot g \cdot r}$.`, R`$r = 4 \cdot 10^{-4}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 3.72, unita: 'cm', tolleranza: 0.1 }, soluzione: [R`$h = \dfrac{2 \cdot 0{,}073}{1000 \cdot 9{,}8 \cdot 4 \cdot 10^{-4}}\,\text{m} = \dfrac{0{,}146}{3{,}92}\,\text{m} \approx 0{,}037\,\text{m}$.`, R`Circa 3,7 cm.`] },
    { id: 'es-09', difficolta: 3, testo: R`Una lamina di acqua saponata ($\gamma = 0{,}025\,\text{N/m}$) è tesa in un telaio con un lato mobile lungo 8 cm. Che forza serve a tenere fermo il lato mobile, in millinewton?`, suggerimenti: [R`La lamina ha due facce, e ognuna tira il lato mobile.`, R`$F = 2 \cdot \gamma \cdot L$.`], risposta: { tipo: 'numero', valore: 4, unita: 'mN' }, soluzione: [R`Le due superfici della lamina tirano tutte e due: il bordo conta due volte.`, R`$F = 2 \cdot 0{,}025\,\text{N/m} \cdot 0{,}08\,\text{m} = 0{,}004\,\text{N} = 4\,\text{mN}$.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un ago lungo 4 cm galleggia sull'acqua ($\gamma = 0{,}073\,\text{N/m}$). Ai due lati la superficie sale con un'inclinazione di 30°. Trascurando la pressione dell'acqua sotto l'ago, quanto pesa l'ago, in millinewton?`, suggerimenti: [R`Da ogni lato la pelle tira con $F = \gamma \cdot L$, inclinata di 30°.`, R`Contano solo le parti verticali: $2 \cdot \gamma \cdot L \cdot \sin 30°$.`], risposta: { tipo: 'numero', valore: 2.92, unita: 'mN', tolleranza: 0.05 }, soluzione: [R`Da ogni lato: $F = 0{,}073\,\text{N/m} \cdot 0{,}04\,\text{m} = 2{,}92 \cdot 10^{-3}\,\text{N}$.`, R`Parte verticale delle due forze: $2 \cdot 2{,}92 \cdot 10^{-3}\,\text{N} \cdot \sin 30° = 2{,}92 \cdot 10^{-3}\,\text{N}$.`, R`L'ago può pesare circa $2{,}9\,\text{mN}$, cioè circa 0,3 g.`] },
    { id: 'es-11', difficolta: 3, testo: R`In un'arteria il sangue ($d = 1060\,\text{kg/m}^3$) scorre a 0,4 m/s. Una placca riduce la sezione a un terzo. Di quanti pascal cala la pressione nel tratto ristretto?`, suggerimenti: [R`Sezione un terzo: velocità tripla.`, R`$\Delta p = \tfrac{1}{2} \cdot d \cdot (v_2^2 - v_1^2)$.`], risposta: { tipo: 'numero', valore: 678, unita: 'Pa' }, soluzione: [R`$v_2 = 3 \cdot 0{,}4\,\text{m/s} = 1{,}2\,\text{m/s}$.`, R`$\Delta p = \tfrac{1}{2} \cdot 1060 \cdot (1{,}44 - 0{,}16)\,\text{Pa} = 530 \cdot 1{,}28\,\text{Pa} \approx 678\,\text{Pa}$.`, R`Sono circa 5 mmHg. La parete dell'arteria, premuta meno da dentro, tende a chiudersi.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cos'è la portata di un tubo?`, opzioni: [R`La velocità dell'acqua al centro del tubo`, R`La massa d'acqua che contiene`, R`Il volume d'acqua che passa da una sezione in un secondo`, R`La pressione dell'acqua sul fondo`], corretta: 2, spiegazione: R`La portata è $Q = V / \Delta t$, in $\text{m}^3\text{/s}$. Dipende dalla velocità ma non è una velocità: $Q = S \cdot v$. Non è una massa né una pressione.` },
    { id: 'q-02', domanda: R`Che cosa vuol dire che un fluido è «ideale»?`, opzioni: [R`Che è incomprimibile e senza viscosità`, R`Che è fermo`, R`Che ha densità $1000\,\text{kg/m}^3$`, R`Che è un gas perfetto`], corretta: 0, spiegazione: R`Ideale vuol dire incomprimibile (volume costante) e senza attrito interno. Può muoversi, e non deve per forza essere acqua. Il gas perfetto è un'altra cosa, e un gas si comprime.` },
    { id: 'q-03', domanda: R`Un tubo si stringe e la sua sezione diventa metà. Che cosa succede alla velocità dell'acqua?`, opzioni: [R`Resta uguale`, R`Diventa metà`, R`Diventa quattro volte`, R`Diventa doppia`], corretta: 3, spiegazione: R`$S_1 \cdot v_1 = S_2 \cdot v_2$: sezione metà, velocità doppia. Quattro volte succederebbe con il diametro metà, perché allora la sezione diventa un quarto.` },
    { id: 'q-04', domanda: R`In un tubo tondo il diametro si dimezza. La velocità dell'acqua…`, opzioni: [R`raddoppia`, R`diventa quattro volte`, R`si dimezza`, R`non cambia`], corretta: 1, spiegazione: R`La sezione $\pi \cdot r^2$ va con il quadrato del raggio: diametro metà, sezione un quarto. Per la continuità la velocità diventa quattro volte.` },
    { id: 'q-05', domanda: R`Nella strozzatura di un tubo di Venturi orizzontale, la pressione rispetto al tratto largo è…`, opzioni: [R`minore`, R`maggiore`, R`uguale`, R`uguale a quella dell'aria esterna`], corretta: 0, spiegazione: R`Nella strozzatura l'acqua è più veloce, e $\tfrac{1}{2} \cdot d \cdot v^2$ cresce. Per Bernoulli la pressione deve calare. Cala, ma non per forza fino alla pressione dell'aria: dipende da quanto è stretta.` },
    { id: 'q-06', domanda: R`Si soffia fra due fogli di carta appesi, vicini e paralleli. Che cosa fanno?`, opzioni: [R`Si allontanano, spinti dal soffio`, R`Restano fermi`, R`Si avvicinano`, R`Si arrotolano verso l'esterno`], corretta: 2, spiegazione: R`L'aria che entra fra i fogli accelera e la sua pressione scende sotto quella esterna. L'aria di fuori li spinge uno verso l'altro. Il soffio non li allontana.` },
    { id: 'q-07', domanda: R`Il teorema di Bernoulli è una forma di…`, opzioni: [R`conservazione della massa`, R`terzo principio della dinamica`, R`principio di Pascal`, R`conservazione dell'energia`], corretta: 3, spiegazione: R`Si ricava uguagliando il lavoro delle forze di pressione alla variazione di energia cinetica e potenziale. La conservazione della massa, per un fluido incomprimibile, è l'equazione di continuità.` },
    { id: 'q-08', domanda: R`Nel teorema di Bernoulli si mette $v = 0$ (fluido fermo). Che legge si ottiene?`, opzioni: [R`Il principio di Pascal`, R`La legge di Stevino`, R`Il principio di Archimede`, R`La legge di Torricelli`], corretta: 1, spiegazione: R`Resta $p + d \cdot g \cdot h$ costante: la pressione cresce scendendo di $d \cdot g$ per ogni metro. È la legge di Stevino. Torricelli invece ha bisogno della velocità.` },
    { id: 'q-09', domanda: R`Un foro è a profondità quattro volte maggiore di un altro, nello stesso recipiente. La velocità dell'acqua che esce è…`, opzioni: [R`quattro volte`, R`uguale`, R`doppia`, R`sedici volte`], corretta: 2, spiegazione: R`$v = \sqrt{2 \cdot g \cdot h}$: con $h$ quattro volte, $v$ è $\sqrt{4} = 2$ volte. Sedici volte sarebbe il quadrato, non la radice.` },
    { id: 'q-10', domanda: R`Secondo la legge di Torricelli, l'acqua esce da un foro con la stessa velocità…`, opzioni: [R`di un sasso caduto da fermo dal pelo libero fino al foro`, R`del livello dell'acqua che scende`, R`del suono nell'acqua`, R`dell'acqua che entra dal rubinetto che riempie il recipiente`], corretta: 0, spiegazione: R`$v = \sqrt{2 \cdot g \cdot h}$ è la velocità di caduta libera da un'altezza $h$. Dipende da quanto il foro sta sotto il pelo libero, quindi cambia se il livello scende.` },
    { id: 'q-11', domanda: R`Un recipiente a terra ha tre fori a diverse altezze. Quale getto arriva più lontano?`, opzioni: [R`Quello del foro più basso, che è il più veloce`, R`Quello del foro più alto, che cade da più in alto`, R`Arrivano tutti alla stessa distanza`, R`Quello del foro più vicino a metà altezza`], corretta: 3, spiegazione: R`La gittata è $2 \cdot \sqrt{h \cdot (H - h)}$, massima per $h = H / 2$. Il foro basso dà il getto più veloce, ma cade da poco; quello alto cade da più su, ma è lento.` },
    { id: 'q-12', domanda: R`Che cosa misura il coefficiente di viscosità $\eta$?`, opzioni: [R`La densità del fluido`, R`L'attrito interno fra gli strati del fluido`, R`La forza della superficie per metro di bordo`, R`La pressione del fluido in movimento`], corretta: 1, spiegazione: R`La viscosità è l'attrito interno: più $\eta$ è grande, più il fluido frena. Il miele ha $\eta$ diecimila volte quella dell'acqua, ma è solo poco più denso. La forza per metro di bordo è la tensione superficiale.` },
    { id: 'q-13', domanda: R`Una pallina cade in un liquido viscoso e ha raggiunto la velocità limite. Che cosa vale per lei?`, opzioni: [R`Le forze si fanno equilibrio e la velocità resta costante`, R`Il peso è sparito`, R`Accelera con $g$`, R`Rallenta fino a fermarsi`], corretta: 0, spiegazione: R`Alla velocità limite peso, spinta e attrito viscoso si fanno equilibrio. Il peso c'è sempre: è bilanciato. Senza forza totale la pallina non accelera e non rallenta.` },
    { id: 'q-14', domanda: R`Un ago d'acciaio, appoggiato piano, galleggia sull'acqua. Perché?`, opzioni: [R`Perché l'acciaio è meno denso dell'acqua`, R`Perché l'aria sopra l'ago lo tira su`, R`Perché la superficie dell'acqua lo regge come una pelle tesa`, R`Perché la spinta di Archimede non vale per gli oggetti sottili`], corretta: 2, spiegazione: R`L'acciaio è quasi otto volte più denso dell'acqua. Lo regge la tensione superficiale, con la superficie che si incurva sotto di lui. Archimede vale sempre: contando l'acqua della conca, la spinta è proprio il peso dell'acqua spostata. Ma la pressione che preme direttamente sotto l'ago è piccola: il resto lo trasmette la pelle.` },
    { id: 'q-15', domanda: R`Che cosa fa il sapone alla tensione superficiale dell'acqua?`, opzioni: [R`La aumenta`, R`La abbassa`, R`La lascia uguale`, R`La aumenta solo se l'acqua è calda`], corretta: 1, spiegazione: R`Il sapone abbassa $\gamma$, a circa un terzo. Per questo un ago a galla affonda con una goccia di detersivo, e l'acqua saponata bagna e lava meglio.` },
    { id: 'q-16', domanda: R`Due capillari di vetro, uno di raggio 1 mm e uno di raggio 0,5 mm, stanno in una bacinella d'acqua. In quale l'acqua sale di più?`, opzioni: [R`In quello di raggio 1 mm`, R`Sale uguale in tutti e due`, R`In nessuno dei due: scende`, R`In quello di raggio 0,5 mm`], corretta: 3, spiegazione: R`Per la legge di Jurin la risalita è inversamente proporzionale al raggio: nel tubo di raggio metà l'acqua sale il doppio. Scende sotto il livello il mercurio, non l'acqua.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Diametro e sezione non vanno di pari passo: diametro metà vuol dire sezione un quarto, e velocità quattro volte.` },
    { tipo: 'errore', testo: R`Nel rapporto $S_1 / S_2$ le sezioni possono restare in $\text{cm}^2$. Nella portata $Q = S \cdot v$ invece servono i metri quadrati.` },
    { tipo: 'errore', testo: R`Bernoulli vale lungo lo stesso tubo di flusso. Non confrontare l'aria ferma di una stanza con un soffio che viene da un'altra parte.` },
    { tipo: 'trucco', testo: R`Per l'acqua $\tfrac{1}{2} \cdot d \cdot v^2$ fa $500 \cdot v^2$ pascal: a 2 m/s sono 2000 Pa.` },
    { tipo: 'trucco', testo: R`Torricelli è la caduta libera: l'acqua esce dal foro come un sasso caduto dal pelo libero. $v = \sqrt{2 \cdot g \cdot h}$.` },
    { tipo: 'metodo', testo: R`Nei problemi di fluidi in moto, prima la continuità per trovare le velocità, poi Bernoulli per le pressioni.` },
    { tipo: 'metodo', testo: R`Il pelo libero e un getto nell'aria hanno tutti e due la pressione dell'aria $p_0$: in Bernoulli si cancella.` },
    { tipo: 'errore', testo: R`Il foro più profondo dà il getto più veloce, non il più lungo. Il più lungo esce a metà altezza.` }
  ],
  aneddoti: [
    { fisico: 'Daniel Bernoulli', anni: '1700–1782', titolo: 'Il padre che retrodatò il suo libro', testo: R`Daniel Bernoulli veniva da una famiglia di matematici di Basilea. Il padre Johann era famoso, e molto geloso. Nel 1734 l'Accademia delle scienze di Parigi divise un suo premio fra padre e figlio. Si racconta che Johann, offeso, cacciò Daniel di casa. Nel 1738 Daniel pubblicò a Strasburgo l'*Hydrodynamica*. Lì legava la pressione di un fluido alla sua velocità, con la conservazione della «forza viva», l'antenata dell'energia cinetica. Pochi anni dopo uscì l'*Hydraulica* del padre, con idee molto simili. Sul frontespizio Johann aveva messo una data falsa, il 1732. Così il suo libro sembrava venuto prima di quello del figlio. La formula nella forma di oggi la scrisse poi Leonhard Euler, amico di Daniel.`, legame: R`È il teorema di Bernoulli: dove il fluido corre, la pressione cala.` },
    { fisico: 'Giovanni Battista Venturi', anni: '1746–1822', titolo: 'Il prete che lesse i quaderni di Leonardo', testo: R`Giovanni Battista Venturi era un sacerdote di Reggio Emilia e insegnava fisica a Modena. Nel 1796 andò a Parigi, in missione diplomatica. Lì trovò i manoscritti di Leonardo da Vinci, portati via da Milano dalle truppe di Napoleone. Venturi fu tra i primi a studiarli sul serio, e nel 1797 pubblicò un saggio sulle opere scientifiche di Leonardo. Nello stesso anno uscirono le sue ricerche sui fluidi. Faceva passare l'acqua in tubi che si stringevano e si allargavano, e ne osservava gli effetti. Quasi un secolo dopo l'ingegnere americano Clemens Herschel costruì un misuratore di portata per gli acquedotti. Lo chiamò «tubo di Venturi», in suo onore.`, legame: R`È il tubo con la strozzatura: dalla differenza di pressione si misura la portata.` },
    { fisico: 'George Gabriel Stokes', anni: '1819–1903', titolo: 'Perché le nuvole non cadono', testo: R`George Gabriel Stokes era irlandese e insegnò a Cambridge per più di cinquant'anni. Nel 1851 pubblicò un lungo lavoro sui pendoli. Voleva capire quanto l'aria frena un pendolo che oscilla. Per farlo calcolò l'attrito di un fluido viscoso su una sfera che si muove piano. Alla fine si pose una domanda curiosa. Le nuvole sono fatte di goccioline d'acqua, quasi mille volte più dense dell'aria. Perché restano lassù? La risposta stava nella sua formula. Una goccia piccolissima ha un peso minuscolo, e l'aria la frena molto. La sua velocità limite è di circa un centimetro al secondo, o anche meno. Basta una lieve corrente d'aria verso l'alto per tenerla sospesa.`, legame: R`È la legge di Stokes, $F_v = 6\pi \cdot \eta \cdot r \cdot v$, e la velocità limite.` },
    { fisico: 'Agnes Pockels', anni: '1862–1935', titolo: 'Un laboratorio nel lavello di cucina', testo: R`Agnes Pockels nacque a Venezia nel 1862 e crebbe a Braunschweig, in Germania. Le università allora non accettavano le donne. Lei studiò la fisica sui libri del fratello Friedrich, che era fisico. Lavando i piatti notò che l'acqua sporca di sapone o di grasso si comportava in modo strano. In cucina si costruì una vaschetta di latta, con una striscia mobile per spostare la pellicola in superficie. Con una piccola bilancia misurava la forza per staccare un dischetto dall'acqua. Per anni nessuno ne seppe niente. Nel 1891 scrisse una lunga lettera a Lord Rayleigh, che studiava gli stessi fenomeni in Inghilterra. Rayleigh la fece pubblicare sulla rivista *Nature*. Nel 1932 il politecnico di Braunschweig le diede una laurea ad honorem.`, legame: R`Misurava la tensione superficiale e come il sapone la abbassa.` }
  ]
});
})();
