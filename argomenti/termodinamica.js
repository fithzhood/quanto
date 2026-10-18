/* Quanto — La termodinamica (fluidi e calore, quarto anno).
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/termodinamica.js
   Simboli come nei video: Q calore ASSORBITO dal gas, L lavoro fatto DAL gas, ΔU = Q − L; T sempre in kelvin;
   Q_ass e Q_ced (preso positivo) per le macchine; T_c e T_f per le sorgenti calda e fredda.
   Colori come in gas.js ed energia.js: le linee del piano p–V viola (pressione, colore 4), il lavoro come area verde
   (energia, colore 3), il calore arancio (colore 2, come nei video), la sorgente fredda azzurra (colore 1, come nei video). */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'termodinamica',
  titolo: 'La termodinamica',
  introduzione: R`La **termodinamica** studia come il calore diventa lavoro, e il lavoro diventa calore. È nata nell'Ottocento per capire le macchine a vapore. Oggi spiega il motore di un'auto, una centrale elettrica, il frigorifero di casa, le nuvole che si formano in cielo.

Due leggi reggono tutto. Il **primo principio** è la conservazione dell'energia, con il calore dentro il conto. Il **secondo principio** dice in che verso vanno le cose da sole: il calore passa da solo dal caldo al freddo, mai al contrario. Ne viene un limite che nessun ingegnere può superare. Un motore non trasforma mai in lavoro tutto il calore che riceve.

Servono le leggi dei gas, con l'equazione di stato $p \cdot V = n \cdot R \cdot T$, e il lavoro e l'energia.`,
  inBreve: [
    R`Il lavoro fatto da un gas a pressione costante è $L = p \cdot \Delta V$. Nel piano p–V il lavoro è l'**area** sotto la linea della trasformazione.`,
    R`**Primo principio**: $\Delta U = Q - L$, con $Q$ il calore assorbito e $L$ il lavoro fatto dal gas. L'energia interna di un gas perfetto dipende solo dalla temperatura.`,
    R`Isocora: $L = 0$ e $Q = \Delta U$. Isoterma: $\Delta U = 0$ e $Q = L$. Adiabatica: $Q = 0$ e $L = -\Delta U$.`,
    R`Una **macchina termica** prende calore da una sorgente calda, fa lavoro e cede il resto a una sorgente fredda. Il rendimento $\eta = L / Q_{\text{ass}}$ è sempre minore di 1.`,
    R`Da solo il calore va dal caldo al freddo: è il **secondo principio**. Fra due temperature il rendimento massimo è quello di Carnot, $\eta = 1 - T_f / T_c$, in kelvin.`,
    R`In un sistema isolato l'**entropia** non diminuisce mai: lo stato con più microstati è il più probabile.`
  ],
  sezioni: [
    {
      id: 'lavoro-gas',
      titolo: 'Il lavoro di un gas',
      testo: R`Quando l'acqua bolle in una pentola, a volte il coperchio si solleva e saltella. Il vapore spinge il coperchio verso l'alto: fa un lavoro. Nei motori succede la stessa cosa, con un pistone al posto del coperchio.

In termodinamica si sceglie un **sistema**: di solito un gas chiuso in un cilindro. Tutto il resto è l'**ambiente**. Sistema e ambiente si scambiano energia in due modi: con il calore e con il lavoro.

Il gas preme sul pistone con la forza $F = p \cdot S$, dove $S$ è l'area del pistone. Se la pressione resta costante e il pistone sale di $\Delta h$, ecco il lavoro di quella forza:

~ L = F \cdot \Delta h :: forza e spostamento hanno la stessa direzione e lo stesso verso
~ L = p \cdot S \cdot \Delta h :: la forza del gas è pressione per area
~ L = \evidb{p \cdot \Delta V} :: $S \cdot \Delta h$ è proprio l'aumento di volume

>* A pressione costante il **lavoro fatto dal gas** è $L = p \cdot \Delta V$. È positivo se il gas si espande, negativo se viene compresso.

Esempio. Un gas a 150 kPa si espande da 2,0 L a 5,0 L, a pressione costante.

~ \Delta V = 5{,}0\,\text{L} - 2{,}0\,\text{L} = 3{,}0\,\text{L} :: l'aumento di volume
~ L = 1{,}5 \cdot 10^5\,\text{Pa} \cdot 0{,}0030\,\text{m}^3 :: in pascal e metri cubi: un litro è un millesimo di metro cubo
~ L = \evidb{450\,\text{J}} :: un pascal per un metro cubo fa un joule

> Un trucco comodo: un chilopascal per un litro fa proprio un joule. Sono mille pascal per un millesimo di metro cubo: $1\,\text{kPa} \cdot 1\,\text{L} = 1\,\text{J}$.

Nel **piano p–V** ogni stato del gas è un punto: il volume in orizzontale, la pressione in verticale. Una trasformazione è una linea. A pressione costante la linea è orizzontale. Il lavoro $p \cdot \Delta V$ è l'area del rettangolo sotto di essa.

[[grafico:lavoro]]

>* Nel piano p–V il lavoro fatto dal gas è l'**area sotto la linea** della trasformazione. Vale anche quando la pressione cambia.

>! Il lavoro dipende dal verso. Andando verso destra, cioè in espansione, è positivo. Tornando verso sinistra, in compressione, è negativo.

?? Un gas viene compresso a pressione costante. Il lavoro fatto dal gas è…
[ ] positivo
[x] negativo
[ ] zero, perché la pressione non cambia
=> Il volume diminuisce, quindi $\Delta V < 0$ e $L = p \cdot \Delta V < 0$. È l'ambiente a fare lavoro sul gas.`
    },
    {
      id: 'primo-principio',
      titolo: 'L\'energia interna e il primo principio',
      testo: R`Gonfiando la gomma della bici, la pompa si scalda, soprattutto in fondo, dove l'aria viene compressa. Non c'è nessuna fiamma: il riscaldamento viene dal lavoro fatto per comprimere l'aria.

Le molecole di un gas corrono e rimbalzano. La somma delle loro energie si chiama **energia interna** $U$. Nel gas perfetto conta solo l'energia cinetica delle molecole. Per questo $U$ dipende solo dalla temperatura: più caldo vuol dire molecole più veloci.

Per un gas monoatomico, come l'elio, vale $U = \tfrac{3}{2} \cdot n \cdot R \cdot T$. È l'energia media di una molecola, $\tfrac{3}{2} \cdot k \cdot T$, moltiplicata per il numero delle molecole.

L'energia interna cambia in due modi. Si può dare **calore** al gas, per esempio con una fiamma. Oppure si può fare **lavoro** sul gas, spingendo il pistone. Servono due regole sui segni, le stesse dei video:

- $Q$ è il calore **assorbito** dal gas: positivo se entra, negativo se esce;
- $L$ è il lavoro fatto **dal** gas: positivo se il gas si espande, negativo se viene compresso.

[[video:termodinamica/primo-principio]]

>* **Primo principio della termodinamica.** La variazione di energia interna è il calore assorbito meno il lavoro fatto dal gas: $\Delta U = Q - L$.

È la conservazione dell'energia. Il calore che entra va in parte in energia interna, in parte esce come lavoro. Esempio: un gas assorbe 500 J di calore e intanto, espandendosi, fa 200 J di lavoro.

~ \Delta U = Q - L :: il primo principio
~ \Delta U = 500\,\text{J} - 200\,\text{J} :: il calore entra e il gas fa lavoro: tutti e due positivi
~ \Delta U = \evidb{300\,\text{J}} :: l'energia interna sale: il gas si scalda

Se il pistone si muove di colpo, il gas non fa in tempo a scambiare calore: $Q = 0$. Allora $\Delta U = -L$. In compressione $L$ è negativo e l'energia interna sale: il gas si scalda. In espansione il gas si raffredda. Anche l'aria che sale trova una pressione più bassa e si espande. Conduce male il calore, quindi quasi non ne scambia: si raffredda, e si formano le nuvole.

>! Attenzione ai segni. Se è l'ambiente a comprimere il gas, $L$ è negativo, e il termine $-L$ fa crescere $U$.

?? Un gas viene compresso senza scambiare calore con l'ambiente. La sua temperatura…
[x] sale
[ ] scende
[ ] resta la stessa
=> Con $Q = 0$ vale $\Delta U = -L$. Comprimendo, $L$ è negativo, quindi $\Delta U$ è positivo: l'energia interna cresce, e con lei la temperatura.`
    },
    {
      id: 'trasformazioni',
      titolo: 'Le quattro trasformazioni',
      testo: R`Un gas può andare da uno stato a un altro per molte strade. Quattro sono le più semplici: in ognuna c'è una cosa che resta ferma.

[[video:termodinamica/trasformazioni]]

- **Isobara**, a pressione costante. Il lavoro è $L = p \cdot \Delta V$. Il calore serve in parte a scaldare il gas, in parte a fare lavoro.
- **Isocora**, a volume costante. Il pistone è bloccato e $L = 0$. Tutto il calore diventa energia interna: $\Delta U = Q$.
- **Isoterma**, a temperatura costante. Il gas sta a contatto con un corpo grande a temperatura fissa, e si espande piano. $U$ non cambia, quindi $Q = L$: il calore preso diventa tutto lavoro.
- **Adiabatica**, senza scambi di calore: $Q = 0$. Il lavoro si paga con l'energia interna: $L = -\Delta U$.

| trasformazione | primo principio |
|---|---|
| isobara, $p$ fisso | $Q = \Delta U + p \cdot \Delta V$ |
| isocora, $V$ fisso | $Q = \Delta U$ |
| isoterma, $T$ fissa | $Q = L$ |
| adiabatica, $Q = 0$ | $L = -\Delta U$ |

Nell'isoterma la pressione cambia: nel piano p–V la linea è un'iperbole, con $p \cdot V$ costante. Il lavoro è l'area sotto l'iperbole. Il conto esatto si fa con il calcolo integrale, al quinto anno. Il risultato è $L = n \cdot R \cdot T \cdot \ln \dfrac{V_f}{V_i}$. Qui ln è il logaritmo naturale, in base $e \approx 2{,}718$: sulla calcolatrice è il tasto ln.

Esempio. Mezza mole di gas a 400 K triplica il suo volume, a temperatura costante.

~ n \cdot R = 0{,}50\,\text{mol} \cdot 8{,}31\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} :: le moli si semplificano
~ n \cdot R = 4{,}155\,\tfrac{\text{J}}{\text{K}} :: restano joule al kelvin
~ n \cdot R \cdot T = 4{,}155\,\tfrac{\text{J}}{\text{K}} \cdot 400\,\text{K} :: i kelvin si semplificano
~ n \cdot R \cdot T = 1662\,\text{J} :: resta un'energia
~ L = 1662\,\text{J} \cdot \ln 3 \approx \evidb{1826\,\text{J}} :: con $\ln 3 \approx 1{,}10$; e il calore assorbito è lo stesso

Controllo a vista: l'area sotto l'iperbole sta fra il rettangolo basso, $p_f \cdot \Delta V \approx 1108\,\text{J}$, e quello alto, $p_i \cdot \Delta V \approx 3324\,\text{J}$. I 1826 J ci stanno.

Nell'adiabatica la pressione scende più in fretta che nell'isoterma, perché intanto il gas si raffredda. Se la trasformazione è reversibile, la curva segue $p \cdot V^\gamma = \text{costante}$, con $\gamma \approx 1{,}4$ per l'aria. Che cosa sia γ si vede nella prossima sezione.

[[grafico:strade]]

>* L'energia interna è una **funzione di stato**: $\Delta U$ dipende solo dallo stato iniziale e da quello finale. Il lavoro e il calore invece dipendono dalla strada.

>! Isoterma non vuol dire «senza calore». Per espandersi restando alla stessa temperatura, il gas deve assorbire calore. Senza calore è l'adiabatica.

?? In un'isocora un gas assorbe 120 J di calore. Quanto lavoro fa il gas?
[ ] 120 J
[x] zero
[ ] −120 J
=> A volume costante il pistone non si muove: $\Delta V = 0$ e $L = 0$. I 120 J vanno tutti in energia interna.`
    },
    {
      id: 'calori-specifici',
      titolo: 'I calori specifici di un gas',
      testo: R`Per scaldare un gas di un grado serve più calore se lo si lascia espandere. Una parte del calore, infatti, se ne va in lavoro.

Per i gas il calore si conta per mole. Il **calore specifico molare** è il calore che scalda di un kelvin una mole di gas. Si misura in J/(mol·K). Ce ne sono due:

- $c_V$, a volume costante: $Q = n \cdot c_V \cdot \Delta T$;
- $c_p$, a pressione costante: $Q = n \cdot c_p \cdot \Delta T$.

A volume costante il lavoro è zero, quindi tutto il calore va in energia interna. Per un gas monoatomico $\Delta U = \tfrac{3}{2} \cdot n \cdot R \cdot \Delta T$, quindi $c_V = \tfrac{3}{2} \cdot R$.

A pressione costante, in più, il gas si espande e fa lavoro:

~ n \cdot c_p \cdot \Delta T = \Delta U + p \cdot \Delta V :: il primo principio, a pressione costante
~ \Delta U = n \cdot c_V \cdot \Delta T :: $U$ dipende solo da $T$: cambia come a volume costante
~ p \cdot \Delta V = n \cdot R \cdot \Delta T :: dall'equazione di stato, con $p$ fisso
~ \evidb{c_p = c_V + R} :: sommo i due pezzi e divido tutto per $n \cdot \Delta T$

>* **Relazione di Mayer**: $c_p = c_V + R$. Gas monoatomico: $c_V = \tfrac{3}{2} \cdot R$ e $c_p = \tfrac{5}{2} \cdot R$. Gas biatomico, come l'aria: $c_V = \tfrac{5}{2} \cdot R$ e $c_p = \tfrac{7}{2} \cdot R$.

Le molecole di due atomi hanno più energia interna, perché possono anche ruotare. In ogni trasformazione di un gas perfetto vale $\Delta U = n \cdot c_V \cdot \Delta T$, anche quando il volume cambia.

Il rapporto $\gamma = c_p / c_V$ è il numero dell'adiabatica (qui $\gamma$ non è la tensione superficiale dei liquidi). Vale $\tfrac{5}{3} \approx 1{,}67$ per i gas monoatomici e $\tfrac{7}{5} = 1{,}4$ per l'aria.

Esempio. Due moli di elio si scaldano di 30 K a pressione costante.

~ c_p = \tfrac{5}{2} \cdot R \approx 20{,}8\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} :: l'elio è monoatomico
~ n \cdot c_p = 2{,}0\,\text{mol} \cdot 20{,}8\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} :: le moli si semplificano
~ n \cdot c_p = 41{,}6\,\tfrac{\text{J}}{\text{K}} :: il calore per ogni kelvin
~ Q_p = 41{,}6\,\tfrac{\text{J}}{\text{K}} \cdot 30\,\text{K} :: i kelvin si semplificano
~ Q_p \approx \evidb{1248\,\text{J}} :: a volume costante ne basterebbero circa 750: il resto è lavoro

>! Il calore specifico di un gas non è uno solo: dipende da come lo si scalda. Prima di fare il conto, guarda se è fermo il volume o la pressione. Nei solidi e nei liquidi la differenza è piccola: per questo lì ogni sostanza ha il suo.

?? Per scaldare di 10 K lo stesso gas, a pressione costante serve più calore che a volume costante. Perché?
[ ] perché a pressione costante il gas è più denso
[x] perché una parte del calore diventa lavoro di espansione
[ ] perché l'energia interna cresce di più
=> Lo stesso $\Delta T$ dà lo stesso $\Delta U$. A pressione costante il gas si espande e fa lavoro: il calore in più se ne va lì.`
    },
    {
      id: 'macchine',
      titolo: 'Le macchine termiche',
      testo: R`Una locomotiva a vapore, il motore di un'auto, una centrale elettrica. Tutte prendono calore da qualcosa di caldo e ne ricavano lavoro. Sono **macchine termiche**.

Una macchina deve lavorare di continuo. Per questo il gas compie un **ciclo**: una serie di trasformazioni che lo riporta allo stato di partenza. Poi ricomincia.

[[video:termodinamica/macchina-termica]]

Alla fine di un ciclo il gas è di nuovo nello stato iniziale, quindi $\Delta U = 0$. Dal primo principio, il lavoro netto è uguale al calore netto. Nel piano p–V il ciclo è una linea chiusa. Se è percorsa in senso orario, il gas fa più lavoro in espansione di quanto ne subisca in compressione. Il lavoro netto è l'area racchiusa.

[[grafico:ciclo]]

In un giro la macchina assorbe il calore $Q_{\text{ass}}$ dalla **sorgente calda** e cede il calore $Q_{\text{ced}}$ alla **sorgente fredda**. Qui $Q_{\text{ced}}$ si prende positivo: dice quanto calore esce. Il lavoro è la differenza: $L = Q_{\text{ass}} - Q_{\text{ced}}$.

[[grafico:motore]]

>* Il **rendimento** di una macchina termica è il lavoro diviso il calore assorbito: $\eta = \dfrac{L}{Q_{\text{ass}}} = 1 - \dfrac{Q_{\text{ced}}}{Q_{\text{ass}}}$. È sempre minore di 1.

Esempio. In un ciclo un motore assorbe 900 J e ne cede 675 alla sorgente fredda.

~ L = Q_{\text{ass}} - Q_{\text{ced}} :: in un ciclo $\Delta U = 0$
~ L = 900\,\text{J} - 675\,\text{J} = 225\,\text{J} :: il lavoro di un giro
~ \eta = \dfrac{225\,\text{J}}{900\,\text{J}} = \evidb{0{,}25} :: un quarto del calore diventa lavoro

Un motore a benzina, in media, trasforma in lavoro fra un quarto e un terzo del calore. Il resto esce con i gas di scarico e dal radiatore.

>! Il calore ceduto non è uno spreco che si può eliminare. Senza una sorgente fredda il motore non funziona: lo dice il secondo principio.

?? In un ciclo il gas torna allo stato di partenza. Quanto vale $\Delta U$ in un giro?
[ ] quanto il lavoro fatto
[ ] quanto il calore assorbito
[x] zero
=> L'energia interna dipende solo dallo stato. Tornato al punto di partenza, il gas ha di nuovo la stessa $U$: $\Delta U = 0$.`
    },
    {
      id: 'secondo-principio',
      titolo: 'Il secondo principio',
      testo: R`Un caffè caldo lasciato sul tavolo si raffredda. Non capita mai che si scaldi da solo prendendo calore dall'aria più fresca della stanza.

Eppure il primo principio non lo vieterebbe: l'energia si conserverebbe lo stesso. Serve un'altra legge, il **secondo principio della termodinamica**. Si può dire in due modi equivalenti.

[[video:termodinamica/secondo-principio]]

>* **Secondo principio.** Clausius: nessuna trasformazione può avere come unico risultato il passaggio di calore da un corpo freddo a uno caldo. Kelvin: nessuna trasformazione può avere come unico risultato trasformare in lavoro tutto il calore preso da una sola sorgente.

La parola chiave è «unico risultato». Il frigorifero porta calore dal suo interno freddo alla cucina, più calda. Ci riesce solo spendendo lavoro: quello del compressore, mosso dalla corrente.

[[grafico:frigorifero]]

Il frigorifero è una macchina termica che gira al contrario. Assorbe $Q_{\text{ass}}$ dall'interno, riceve il lavoro $L$ e cede alla stanza $Q_{\text{ced}} = Q_{\text{ass}} + L$. Qui anche $L$ si prende positivo: è il lavoro speso dal compressore. Il lavoro fatto dal gas, in un giro, è $-L$. Quanto è bravo lo dice il **coefficiente di prestazione**: il calore tolto diviso il lavoro speso, $\text{COP} = \dfrac{Q_{\text{ass}}}{L}$.

~ Q_{\text{ced}} = Q_{\text{ass}} + L :: un frigorifero toglie 500 J spendendo 200 J
~ Q_{\text{ced}} = 500\,\text{J} + 200\,\text{J} :: il calore tolto più il lavoro
~ Q_{\text{ced}} = 700\,\text{J} :: alla cucina arriva più calore di quello tolto
~ \text{COP} = \dfrac{500\,\text{J}}{200\,\text{J}} = \evidb{2{,}5} :: per ogni joule speso ne toglie due e mezzo

L'enunciato di Kelvin, invece, parla dei motori. Nell'isoterma il gas trasforma in lavoro tutto il calore preso. Ma intanto si è espanso: non è l'unico risultato. Per lavorare ancora deve tornare indietro, e tornando cede calore. Una parte del calore va sempre ceduta a una sorgente più fredda. Per questo il rendimento non arriva mai a 1. Se uno dei due enunciati fosse falso, lo sarebbe anche l'altro.

>! Un frigorifero aperto non raffredda la cucina. Il calore tolto dall'interno torna nella stanza, e in più c'è il lavoro del motore: la cucina si scalda.

?? Il COP di un frigorifero vale 3. Che cosa vuol dire?
[ ] che rende il 300%, e quindi crea energia
[x] che toglie 3 J dall'interno per ogni joule di lavoro speso
[ ] che cede alla stanza 3 J per ogni joule tolto dall'interno
=> Il COP è $Q_{\text{ass}} / L$. Non è un rendimento: il calore non viene creato, viene spostato. Alla stanza arrivano $3 + 1 = 4$ J.`
    },
    {
      id: 'carnot',
      titolo: 'Il ciclo di Carnot',
      testo: R`Se nessun motore può rendere il 100%, quanto può rendere al massimo? Lo capì nel 1824 un giovane ingegnere francese, Sadi Carnot.

Prima serve un'idea. Una trasformazione è **reversibile** se si può percorrere al contrario, riportando indietro sia il sistema sia l'ambiente. Deve avvenire piano, senza attriti e senza salti di temperatura. Le trasformazioni vere sono tutte **irreversibili**: quella reversibile è un caso limite ideale.

Il **ciclo di Carnot** lavora fra due sole sorgenti, a $T_c$ e a $T_f$. È fatto di quattro trasformazioni reversibili:

1. un'espansione isoterma a $T_c$, in cui il gas assorbe calore;
2. un'espansione adiabatica, in cui il gas si raffredda fino a $T_f$;
3. una compressione isoterma a $T_f$, in cui il gas cede calore;
4. una compressione adiabatica, che lo riporta a $T_c$.

[[video:termodinamica/carnot]]

[[grafico:carnot]]

>* Il rendimento di una macchina di Carnot dipende solo dalle temperature delle due sorgenti, in kelvin: $\eta = 1 - \dfrac{T_f}{T_c}$. **Teorema di Carnot**: nessuna macchina che lavori fra le stesse due temperature rende di più.

~ \eta = 1 - \dfrac{T_f}{T_c} :: un motore ideale fra 500 K e 300 K
~ \eta = 1 - \dfrac{300\,\text{K}}{500\,\text{K}} = 1 - 0{,}6 :: i kelvin si semplificano
~ \eta = \evidb{0{,}40} :: al massimo il 40%: un motore vero rende meno

Per rendere tanto serve una grande differenza di temperatura. La sorgente fredda di solito è l'aria o l'acqua di un fiume, intorno ai 300 K. Allora conviene alzare $T_c$. Il rendimento sale, avvicinandosi a 1 senza mai arrivarci.

[[grafico:rendimento]]

>! Le temperature vanno in kelvin. Fra 100 °C e 20 °C il rendimento massimo non è $1 - 20/100$, cioè l'80%. È $1 - 293/373 \approx 0{,}21$, cioè circa il 21%.

?? Un motore di Carnot ha la sorgente fredda a 300 K e quella calda a 600 K. Se la calda sale a 1200 K, il rendimento…
[ ] raddoppia, dal 50% al 100%
[x] sale dal 50% al 75%
[ ] resta il 50%
=> $\eta = 1 - 300/1200 = 0{,}75$. Non può raddoppiare: arriverebbe al 100%, e nessun motore ci arriva.`
    },
    {
      id: 'entropia',
      titolo: 'L\'entropia',
      testo: R`Una goccia d'inchiostro in un bicchiere d'acqua si allarga piano, fino a colorare tutta l'acqua. Nessuno l'ha mai vista tornare a raccogliersi in una goccia. Eppure le leggi del moto delle molecole non lo vietano.

[[video:termodinamica/entropia]]

La risposta sta nel contare i modi. Prendiamo 6 molecole in una scatola divisa in due metà uguali. Ogni molecola può stare a sinistra o a destra: in tutto i modi sono $2^6 = 64$. Tutte a sinistra: un modo solo. Tre e tre: 20 modi.

[[grafico:modi]]

Ogni modo di sistemare le molecole si chiama **microstato**. Lo stato che vediamo, per esempio «tre a sinistra e tre a destra», si ottiene con molti microstati. Con miliardi di miliardi di molecole, lo stato sparso ha quasi tutti i microstati. Gli altri sono così rari che non si vedono mai.

>* L'**entropia** $S$ misura quanti microstati $W$ danno lo stesso stato: $S = k \cdot \ln W$, con $k$ costante di Boltzmann. In un sistema isolato l'entropia non diminuisce mai: cresce nei processi irreversibili.

Clausius era arrivato all'entropia per un'altra strada, con il calore. Un corpo a temperatura $T$ assorbe il calore $Q$ in modo reversibile. La sua entropia cresce di $\Delta S = \dfrac{Q}{T}$, in J/K.

Esempio. 1200 J di calore passano da un corpo a 400 K a uno a 300 K. I corpi sono così grandi che la loro temperatura non cambia.

~ \Delta S_1 = \dfrac{-1200\,\text{J}}{400\,\text{K}} = -3\,\text{J/K} :: il corpo caldo cede calore: la sua entropia cala
~ \Delta S_2 = \dfrac{1200\,\text{J}}{300\,\text{K}} = +4\,\text{J/K} :: il freddo prende lo stesso calore, a temperatura più bassa
~ \Delta S = \evidb{+1\,\text{J/K}} :: in tutto l'entropia cresce: il calore va solo in questo verso

Al contrario, dal freddo al caldo, l'entropia totale calerebbe di 1 J/K. È l'enunciato di Clausius detto con l'entropia.

>! «Disordine» è un'immagine comoda, non la definizione: l'entropia conta i microstati. E può calare in una parte del sistema, come nel corpo caldo, purché altrove cresca di più.

?? Un sistema isolato cambia stato da solo. Che cosa fa la sua entropia?
[ ] diminuisce
[ ] resta sempre la stessa
[x] cresce, o al massimo resta uguale
=> Da solo un sistema isolato va verso gli stati con più microstati. L'entropia resta uguale solo nel caso ideale reversibile.

### Il terzo principio

Che cosa succede all'entropia vicino allo zero assoluto? Le molecole si agitano sempre meno. In un cristallo perfetto finiscono ognuna al suo posto, nello stato di energia più bassa. C'è un modo solo di sistemarle: $W = 1$, quindi $S = k \cdot \ln 1 = 0$.

>* **Terzo principio della termodinamica**: avvicinandosi allo zero assoluto, l'entropia di un cristallo perfetto tende a zero. Lo zero assoluto non si raggiunge con un numero finito di trasformazioni.

Lo si è già visto con le leggi dei gas: allo zero assoluto ci si avvicina, ma non ci si arriva. Ogni passo di raffreddamento abbassa la temperatura di un tratto più piccolo del passo prima.

?? Un apparecchio porta un campione a 0,001 K. Ripetendo gli stessi passi di raffreddamento, arriverà a 0 K?
[ ] sì, con un passo in più
[ ] sì, se il campione è un gas
[x] no: ci si avvicina sempre di più, ma non ci si arriva
=> È il terzo principio. Ogni passo porta più vicino a 0 K, ma nessun numero finito di passi ci arriva.`
    }
  ],
  grafici: {
    /* il lavoro a pressione costante: l'area del rettangolo sotto l'isobara (kPa·L = J) */
    lavoro: {
      tipo: 'piano', x: [0, 8], y: [0, 320], altezza: 480, passo: [1, 50], proporzioni: 'libere',
      etichette: { x: 'V (L)', y: 'p (kPa)' },
      parametri: [
        { nome: 'p', min: 50, max: 250, passo: 10, valore: 150, etichetta: 'p (kPa)' },
        { nome: 'V2', min: 2.5, max: 7.5, passo: 0.5, valore: 5, decimali: 1, etichetta: 'V_f (L)' }
      ],
      elementi: [
        { tipo: 'area', f: 'p', da: 2, a: 'V2', colore: 3 },
        { tipo: 'segmento', da: [2, 'p'], a: ['V2', 'p'], colore: 4, freccia: true },
        { tipo: 'punto', p: [2, 'p'], etichetta: 'A', posizione: 'alto-sinistra', colore: 4 },
        { tipo: 'punto', p: ['V2', 'p'], etichetta: 'B', posizione: 'alto-destra', colore: 4 },
        { tipo: 'testo', p: [7.9, 296], testo: 'L = p·ΔV = {{p*(V2 - 2)|0}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un gas si espande a pressione costante da A (2 L) a B. Il rettangolo verde ha base ΔV e altezza p: la sua area è il lavoro fatto dal gas. Un chilopascal per un litro fa un joule. Con i cursori si cambiano la pressione e il volume finale.'
    },
    /* quattro strade da A (4 L, 300 kPa): isocora, isobara, isoterma (p·V = 1200), adiabatica (γ = 1,4) */
    strade: {
      tipo: 'piano', x: [0, 12], y: [0, 500], altezza: 500, passo: [1, 100], proporzioni: 'libere',
      etichette: { x: 'V (L)', y: 'p (kPa)' },
      parametri: [{ nome: 'Vf', min: 5, max: 9, passo: 0.5, valore: 8, decimali: 1, etichetta: 'V_f (L)' }],
      funzioni: [
        { f: '300', dominio: [4, 'Vf'], colore: 4 },
        { f: '1200/x', dominio: [4, 'Vf'], colore: 4 },
        { f: '300*(4/x)^1.4', dominio: [4, 'Vf'], colore: 4 }
      ],
      elementi: [
        { tipo: 'area', f: '1200/x', da: 4, a: 'Vf', colore: 3 },
        { tipo: 'segmento', da: [4, 300], a: [4, 450], colore: 4 },
        { tipo: 'punto', p: [4, 300], etichetta: 'A', posizione: 'sinistra', colore: 4 },
        { tipo: 'testo', p: [4.2, 440], testo: 'isocora', ancora: 'start' },
        { tipo: 'testo', p: ['Vf + 0.15', 306], testo: 'isobara', ancora: 'start' },
        { tipo: 'testo', p: ['Vf + 0.15', '1200/Vf + 10'], testo: 'isoterma', ancora: 'start' },
        { tipo: 'testo', p: ['Vf + 0.15', '300*(4/Vf)^1.4 - 24'], testo: 'adiabatica', ancora: 'start' },
        { tipo: 'testo', p: [11.9, 470], testo: 'isoterma: L = {{1200*ln(Vf/4)|0}} J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Quattro strade che partono dallo stesso stato A: 300 kPa, 4 L. L\'isocora sale in verticale e il suo lavoro è zero. Le altre tre arrivano allo stesso volume finale, con lavori diversi: a 8 L sono 1200 J per l\'isobara, 832 J per l\'isoterma (l\'area verde), 726 J per l\'adiabatica. L\'adiabatica scende più ripida, perché il gas si raffredda.'
    },
    /* un ciclo rettangolare percorso in senso orario: il lavoro netto è l'area racchiusa */
    ciclo: {
      tipo: 'piano', x: [0, 8], y: [0, 400], altezza: 480, passo: [1, 50], proporzioni: 'libere',
      etichette: { x: 'V (L)', y: 'p (kPa)' },
      parametri: [{ nome: 'pa', min: 150, max: 350, passo: 10, valore: 300, etichetta: 'pressione alta (kPa)' }],
      elementi: [
        { tipo: 'poligono', colore: 3, punti: [[2, 100], [2, 'pa'], [6, 'pa'], [6, 100]] },
        { tipo: 'segmento', da: [2, 100], a: [2, 'pa'], colore: 4, freccia: true },
        { tipo: 'segmento', da: [2, 'pa'], a: [6, 'pa'], colore: 4, freccia: true },
        { tipo: 'segmento', da: [6, 'pa'], a: [6, 100], colore: 4, freccia: true },
        { tipo: 'segmento', da: [6, 100], a: [2, 100], colore: 4, freccia: true },
        { tipo: 'punto', p: [2, 100], etichetta: 'A', posizione: 'basso-sinistra', colore: 4 },
        { tipo: 'punto', p: [2, 'pa'], etichetta: 'B', posizione: 'alto-sinistra', colore: 4 },
        { tipo: 'punto', p: [6, 'pa'], etichetta: 'C', posizione: 'alto-destra', colore: 4 },
        { tipo: 'punto', p: [6, 100], etichetta: 'D', posizione: 'basso-destra', colore: 4 },
        { tipo: 'testo', p: [4, '(100 + pa)/2 - 6'], testo: 'L = {{(pa - 100)*4}} J', colore: 3 }
      ],
      didascalia: 'Un ciclo in senso orario: A → B scaldando a volume costante, B → C espansione, C → D raffreddando, D → A compressione. In espansione il gas fa lavoro, in compressione lo subisce. Resta l\'area verde racchiusa: il lavoro netto di un giro.'
    },
    /* il bilancio di un motore: Q_ass dalla sorgente calda, L fuori, Q_ced alla sorgente fredda */
    motore: {
      tipo: 'piano', x: [-4.2, 4.2], y: [-4.6, 4.6], assi: false, griglia: false, altezza: 560,
      parametri: [
        { nome: 'Qa', min: 500, max: 2000, passo: 100, valore: 1000, etichetta: 'Q_{ass} (J)' },
        { nome: 'eta', min: 0.05, max: 0.6, passo: 0.05, valore: 0.35, decimali: 2, etichetta: 'rendimento η' }
      ],
      elementi: [
        { tipo: 'poligono', colore: 2, punti: [[-3.7, 2.9], [3.7, 2.9], [3.7, 4.3], [-3.7, 4.3]] },
        { tipo: 'testo', p: [0, 3.45], testo: 'sorgente calda, T_c' },
        { tipo: 'cerchio', centro: [0, 0], raggio: 1.1, colore: 'grigio' },
        { tipo: 'testo', p: [0, -0.15], testo: 'motore' },
        { tipo: 'vettore', da: [0, 2.9], a: [0, 1.1], etichetta: 'Q_{ass} = {{Qa}} J', colore: 2 },
        { tipo: 'vettore', da: [1.1, 0], a: [4, 0], etichetta: 'L = {{eta*Qa|0}} J', colore: 3 },
        { tipo: 'vettore', da: [0, -1.1], a: [0, -2.9], etichetta: 'Q_{ced} = {{(1 - eta)*Qa|0}} J', colore: 2 },
        { tipo: 'poligono', colore: 1, punti: [[-3.7, -2.9], [3.7, -2.9], [3.7, -4.3], [-3.7, -4.3]] },
        { tipo: 'testo', p: [0, -3.75], testo: 'sorgente fredda, T_f' }
      ],
      didascalia: 'Il bilancio di un giro di un motore. Il calore assorbito entra dalla sorgente calda; una parte esce come lavoro, il resto è il calore ceduto alla sorgente fredda. In un ciclo ΔU = 0: il calore assorbito è uguale al lavoro più il calore ceduto. Il rendimento è il lavoro diviso il calore assorbito.'
    },
    /* il frigorifero: una macchina termica che gira al contrario */
    frigorifero: {
      tipo: 'piano', x: [-4.2, 4.2], y: [-4.6, 4.6], assi: false, griglia: false, altezza: 560,
      parametri: [
        { nome: 'Qa', min: 100, max: 1000, passo: 50, valore: 500, etichetta: 'calore tolto Q_{ass} (J)' },
        { nome: 'Lv', min: 50, max: 500, passo: 50, valore: 200, etichetta: 'lavoro speso L (J)' }
      ],
      elementi: [
        { tipo: 'poligono', colore: 2, punti: [[-3.7, 2.9], [3.7, 2.9], [3.7, 4.3], [-3.7, 4.3]] },
        { tipo: 'testo', p: [0, 3.45], testo: 'cucina, più calda' },
        { tipo: 'cerchio', centro: [0, 0], raggio: 1.1, colore: 'grigio' },
        { tipo: 'testo', p: [0, -0.15], testo: 'frigo' },
        { tipo: 'vettore', da: [0, 1.1], a: [0, 2.9], etichetta: 'Q_{ced} = {{Qa + Lv}} J', posizione: 'destra', colore: 2 },
        { tipo: 'vettore', da: [4, 0], a: [1.1, 0], etichetta: 'L = {{Lv}} J', posizione: 'destra', colore: 3 },
        { tipo: 'vettore', da: [0, -2.9], a: [0, -1.1], etichetta: 'Q_{ass} = {{Qa}} J', posizione: 'destra', colore: 2 },
        { tipo: 'testo', p: [-4.3, 0.25], testo: 'COP = {{Qa/Lv|1}}', ancora: 'start' },
        { tipo: 'poligono', colore: 1, punti: [[-3.7, -2.9], [3.7, -2.9], [3.7, -4.3], [-3.7, -4.3]] },
        { tipo: 'testo', p: [0, -3.75], testo: 'interno, più freddo' }
      ],
      didascalia: 'Il frigorifero toglie calore dal suo interno freddo e lo porta nella cucina, più calda. Ci riesce solo ricevendo il lavoro del compressore. Alla cucina arriva il calore tolto più il lavoro. Il coefficiente di prestazione, COP, è il calore tolto diviso il lavoro.'
    },
    /* il ciclo di Carnot fra 500 K e 300 K: n·R = 2 J/K (p in kPa, V in L), gas monoatomico (γ = 5/3) */
    carnot: {
      tipo: 'piano', x: [0, 12], y: [0, 650], altezza: 500, passo: [2, 100], proporzioni: 'libere',
      etichette: { x: 'V (L)', y: 'p (kPa)' },
      funzioni: [
        { f: '1000/x', dominio: [2, 5], colore: 4 },
        { f: '200*(5/x)^(5/3)', dominio: [5, 10.758], colore: 4 },
        { f: '600/x', dominio: [4.303, 10.758], colore: 4 },
        { f: '500*(2/x)^(5/3)', dominio: [2, 4.303], colore: 4 }
      ],
      elementi: [
        { tipo: 'area', f: 'se(x < 5, 1000/x, 200*(5/x)^(5/3))', g: 'se(x < 4.303, 500*(2/x)^(5/3), 600/x)', da: 2, a: 10.758, colore: 3 },
        { tipo: 'segmento', da: [3.2, 312.5], a: [3.5, 285.7], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [7.5, 101.75], a: [8, 91.38], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [8, 75], a: [7.5, 80], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [2.9, 269.2], a: [2.6, 322.9], colore: 'grigio', freccia: true },
        { tipo: 'punto', p: [2, 500], etichetta: 'A', posizione: 'destra', colore: 4 },
        { tipo: 'punto', p: [5, 200], etichetta: 'B', posizione: 'alto-destra', colore: 4 },
        { tipo: 'punto', p: [10.758, 55.77], etichetta: 'C', posizione: 'alto', colore: 4 },
        { tipo: 'punto', p: [4.303, 139.4], etichetta: 'D', posizione: 'basso-sinistra', colore: 4 },
        { tipo: 'testo', p: [3.7, 330], testo: 'T_c = 500 K', ancora: 'start' },
        { tipo: 'testo', p: [7.6, 26], testo: 'T_f = 300 K' },
        { tipo: 'testo', p: [11.8, 450], testo: 'area verde: L ≈ 367 J', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Un ciclo di Carnot fra 500 K e 300 K, in senso orario. Da A a B isoterma a 500 K (il gas assorbe circa 916 J), da B a C adiabatica, da C a D isoterma a 300 K (cede circa 550 J), da D ad A adiabatica. Il lavoro è l\'area racchiusa: η = 367 / 916 = 0,40.'
    },
    /* il rendimento di Carnot in funzione della temperatura calda */
    rendimento: {
      tipo: 'piano', x: [0, 1600], y: [0, 110], altezza: 400, passo: [200, 20], proporzioni: 'libere',
      etichette: { x: 'T_c (K)', y: 'η (%)' },
      parametri: [
        { nome: 'Tf', min: 250, max: 400, passo: 10, valore: 300, etichetta: 'T_f (K)' },
        { nome: 'Tc', min: 400, max: 1600, passo: 50, valore: 1500, etichetta: 'T_c (K)' }
      ],
      funzioni: [{ f: '100*(1 - Tf/x)', dominio: ['Tf', 1600], colore: 3 }],
      elementi: [
        { tipo: 'orizzontale', y: 100, colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [1580, 103], testo: 'limite: 100%', ancora: 'end' },
        { tipo: 'verticale', x: 'Tc', colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['Tc', '100*(1 - Tf/Tc)'], etichetta: '{{100*(1 - Tf/Tc)|1}} %', posizione: 'alto-sinistra', colore: 3 }
      ],
      didascalia: 'Il rendimento di un motore di Carnot al crescere della temperatura calda, con la sorgente fredda fissa. Parte da zero quando le due temperature sono uguali, sale in fretta e poi sempre più piano. Si avvicina al 100% senza arrivarci.'
    },
    /* 6 molecole in due metà: quanti microstati per ogni modo di dividerle */
    modi: {
      tipo: 'barre', altezza: 400,
      categorie: ['0', '1', '2', '3', '4', '5', '6'],
      serie: [{ nome: 'microstati', valori: [1, 6, 15, 20, 15, 6, 1], colore: 3 }],
      etichettaY: 'microstati', etichettaX: 'molecole nella metà sinistra', max: 24,
      didascalia: 'Sei molecole in una scatola divisa in due metà: in quanti modi si possono sistemare, per ogni numero di molecole a sinistra. In tutto i modi sono 64. Tutte a sinistra o tutte a destra: un modo solo. Tre per parte: 20 modi, quasi un terzo del totale.'
    }
  },
  esempi: [
    {
      titolo: 'Il gas che si espande e si scalda',
      problema: R`Un cilindro con un pistone libero contiene aria, alla pressione costante di 120 kPa. L'aria riceve 1680 J di calore e si espande da 3,0 L a 7,0 L. Quanto lavoro fa? Di quanto cambia la sua energia interna?`,
      passi: [
        R`Dati: $p = 120\,\text{kPa}$, $V_i = 3{,}0\,\text{L}$, $V_f = 7{,}0\,\text{L}$, $Q = 1680\,\text{J}$. Cerco il lavoro $L$ e la variazione $\Delta U$.`,
        R`È un'isobara: il lavoro è $L = p \cdot \Delta V$, con $\Delta V = 7{,}0\,\text{L} - 3{,}0\,\text{L} = 4{,}0\,\text{L}$.`,
        R`In unità del SI: $L = 120 \cdot 10^3\,\text{Pa} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 480\,\text{J}$. È positivo: il gas si espande. Con il trucco dei chilopascal: $120\,\text{kPa} \cdot 4{,}0\,\text{L} = 480\,\text{J}$.`,
        R`Primo principio: $\Delta U = Q - L = 1680\,\text{J} - 480\,\text{J} = 1200\,\text{J}$. L'energia interna sale: il gas si scalda.`,
        R`Controllo: l'aria è biatomica, quindi $\Delta U = \tfrac{5}{2} \cdot n \cdot R \cdot \Delta T = \tfrac{5}{2} \cdot p \cdot \Delta V = \tfrac{5}{2} \cdot 480\,\text{J} = 1200\,\text{J}$. Torna.`
      ],
      risultato: R`$L = 480\,\text{J}$, $\Delta U = 1200\,\text{J}$`
    },
    {
      titolo: 'Scaldare l\'elio a volume costante',
      problema: R`Un recipiente rigido e chiuso contiene 3,0 mol di elio a 20 °C. Lo si scalda fino a 80 °C. Quanto calore ha assorbito il gas? Quanto lavoro ha fatto?`,
      passi: [
        R`Dati: $n = 3{,}0\,\text{mol}$ di gas monoatomico, $t_i = 20\,{}^\circ\text{C}$, $t_f = 80\,{}^\circ\text{C}$, volume costante. Cerco $Q$ e $L$.`,
        R`Il recipiente è rigido: è un'isocora. Il volume non cambia, quindi $L = 0$ e $Q = \Delta U$.`,
        R`La variazione di temperatura vale lo stesso in gradi Celsius e in kelvin: $\Delta T = 60\,\text{K}$.`,
        R`Per un gas monoatomico $c_V = \tfrac{3}{2} \cdot R$. Quindi $Q = n \cdot c_V \cdot \Delta T = 3{,}0\,\text{mol} \cdot 12{,}465\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} \cdot 60\,\text{K} \approx 2244\,\text{J}$.`,
        R`Controllo con le unità: moli per $\text{J/(mol}\cdot\text{K)}$ per kelvin fa joule. Circa 2,2 kJ, tutti finiti in energia interna.`
      ],
      risultato: R`$Q \approx 2{,}24\,\text{kJ}$, $L = 0$`
    },
    {
      titolo: 'La compressione lenta',
      problema: R`0,80 mol di gas a 350 K vengono compresse lentamente fino a metà del volume, a temperatura costante. Quanto lavoro fa il gas? Quanto calore scambia con l'ambiente?`,
      passi: [
        R`Dati: $n = 0{,}80\,\text{mol}$, $T = 350\,\text{K}$, $V_f / V_i = 0{,}5$. Cerco $L$ e $Q$.`,
        R`È un'isoterma: $L = n \cdot R \cdot T \cdot \ln \dfrac{V_f}{V_i}$.`,
        R`Prima il prodotto: $n \cdot R \cdot T = 0{,}80\,\text{mol} \cdot 8{,}31\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} \cdot 350\,\text{K} = 2326{,}8\,\text{J}$.`,
        R`Poi il logaritmo: $\ln 0{,}5 \approx -0{,}693$, quindi $L \approx 2326{,}8\,\text{J} \cdot (-0{,}693) \approx -1613\,\text{J}$. È negativo: è l'ambiente a comprimere il gas.`,
        R`La temperatura non cambia, quindi $\Delta U = 0$ e $Q = L \approx -1613\,\text{J}$. Il segno meno dice che il gas cede calore: altrimenti si scalderebbe.`
      ],
      risultato: R`$L = Q \approx -1{,}61\,\text{kJ}$: il gas riceve lavoro e cede calore.`
    },
    {
      titolo: 'Il motore e la sua potenza',
      problema: R`A ogni ciclo un motore fa 0,9 kJ di lavoro e cede 2,1 kJ di calore alla sorgente fredda. Fa 25 cicli al secondo. Quanto vale il rendimento? Che potenza sviluppa?`,
      passi: [
        R`Dati: $L = 0{,}9\,\text{kJ}$ e $Q_{\text{ced}} = 2{,}1\,\text{kJ}$ per ciclo, 25 cicli al secondo. Cerco il rendimento $\eta$ e la potenza $P$.`,
        R`In un ciclo $\Delta U = 0$, quindi il calore assorbito è $Q_{\text{ass}} = L + Q_{\text{ced}} = 0{,}9\,\text{kJ} + 2{,}1\,\text{kJ} = 3{,}0\,\text{kJ}$.`,
        R`Rendimento: $\eta = \dfrac{L}{Q_{\text{ass}}} = \dfrac{0{,}9\,\text{kJ}}{3{,}0\,\text{kJ}} = 0{,}30$, cioè il 30%.`,
        R`Potenza: lavoro diviso tempo. In un secondo il motore fa $25 \cdot 0{,}9\,\text{kJ} = 22{,}5\,\text{kJ}$, quindi $P = 22{,}5\,\text{kW}$.`,
        R`Controllo con l'altra formula: $\eta = 1 - \dfrac{2{,}1\,\text{kJ}}{3{,}0\,\text{kJ}} = 1 - 0{,}7 = 0{,}30$. Torna.`
      ],
      risultato: R`$\eta = 0{,}30$, $P = 22{,}5\,\text{kW}$`
    },
    {
      titolo: 'Il limite di una centrale',
      problema: R`In una centrale il vapore entra nella turbina a 500 °C. Il condensatore, raffreddato dall'acqua di un fiume, sta a 40 °C. Quanto può rendere la centrale, al massimo? Quella vera rende il 38%: quanto calore va al fiume per ogni 100 J presi dal vapore?`,
      passi: [
        R`Dati: $t_c = 500\,{}^\circ\text{C}$, $t_f = 40\,{}^\circ\text{C}$, $\eta = 0{,}38$. Cerco $\eta_C$ e $Q_{\text{ced}}$ su $Q_{\text{ass}} = 100\,\text{J}$.`,
        R`Prima le temperature in kelvin: $T_c = (500 + 273)\,\text{K} = 773\,\text{K}$ e $T_f = (40 + 273)\,\text{K} = 313\,\text{K}$.`,
        R`Rendimento di Carnot: $\eta_C = 1 - \dfrac{313\,\text{K}}{773\,\text{K}} \approx 1 - 0{,}405 = 0{,}595$, circa il 60%.`,
        R`La centrale vera rende il 38%, meno del limite: deve essere così. Su 100 J presi dal vapore fa 38 J di lavoro.`,
        R`Il resto va al fiume: $Q_{\text{ced}} = 100\,\text{J} - 38\,\text{J} = 62\,\text{J}$. Quasi due terzi del calore finiscono a scaldare l'acqua.`
      ],
      risultato: R`$\eta_C \approx 0{,}60$; al fiume vanno $62\,\text{J}$ ogni $100\,\text{J}$ presi dal vapore.`
    },
    {
      titolo: 'Il ghiaccio che fonde in cucina',
      problema: R`0,20 kg di ghiaccio a 0 °C fondono in una cucina a 25 °C. Per fondere un chilogrammo di ghiaccio servono $3{,}34 \cdot 10^5\,\text{J}$. Di quanto cambia l'entropia del ghiaccio? E quella della cucina? E il totale?`,
      passi: [
        R`Dati: $m = 0{,}20\,\text{kg}$, calore di fusione $3{,}34 \cdot 10^5\,\text{J/kg}$, ghiaccio a $273\,\text{K}$, cucina a $298\,\text{K}$. Cerco le variazioni di entropia.`,
        R`Il calore che serve: $Q = 0{,}20\,\text{kg} \cdot 3{,}34 \cdot 10^5\,\text{J/kg} = 66\,800\,\text{J}$.`,
        R`Il ghiaccio fonde a temperatura costante: $\Delta S_g = \dfrac{66\,800\,\text{J}}{273\,\text{K}} \approx +244{,}7\,\text{J/K}$.`,
        R`La cucina cede lo stesso calore a 298 K, e la sua temperatura quasi non cambia: $\Delta S_c = \dfrac{-66\,800\,\text{J}}{298\,\text{K}} \approx -224{,}2\,\text{J/K}$.`,
        R`Totale: $\Delta S \approx 244{,}7\,\text{J/K} - 224{,}2\,\text{J/K} = +20{,}5\,\text{J/K}$. È positivo: la fusione in una stanza calda è irreversibile.`
      ],
      risultato: R`$\Delta S_g \approx +245\,\text{J/K}$, $\Delta S_c \approx -224\,\text{J/K}$, in tutto $+20{,}5\,\text{J/K}$.`
    }
  ],
  formulario: [
    { nome: 'Lavoro a pressione costante', formula: R`L = p \cdot \Delta V`, nota: R`Positivo in espansione. In generale è l'area sotto la linea nel piano p–V. $1\,\text{kPa} \cdot 1\,\text{L} = 1\,\text{J}$.` },
    { nome: 'Primo principio', formula: R`\Delta U = Q - L`, nota: R`$Q$ è il calore assorbito dal gas, $L$ il lavoro fatto dal gas.` },
    { nome: 'Energia interna di un gas monoatomico', formula: R`U = \tfrac{3}{2} \cdot n \cdot R \cdot T`, nota: R`Dipende solo dalla temperatura. Per un gas biatomico c'è $\tfrac{5}{2}$ al posto di $\tfrac{3}{2}$.` },
    { nome: 'Calore a volume e a pressione costante', formula: R`Q = n \cdot c \cdot \Delta T`, nota: R`$c = c_V$ a volume costante, $c = c_p$ a pressione costante, in J/(mol·K); $Q_p > Q_V$ perché a pressione costante una parte del calore diventa lavoro. In ogni trasformazione $\Delta U = n \cdot c_V \cdot \Delta T$.` },
    { nome: 'Relazione di Mayer e γ', formula: R`c_p = c_V + R \qquad \gamma = \dfrac{c_p}{c_V}`, nota: R`Monoatomico: $c_V = \tfrac{3}{2} \cdot R$ e $\gamma = \tfrac{5}{3}$. Biatomico: $c_V = \tfrac{5}{2} \cdot R$ e $\gamma = 1{,}4$.` },
    { nome: 'Isocora', formula: R`L = 0 \qquad Q = \Delta U`, nota: R`Volume costante: il pistone è fermo e tutto il calore va in energia interna.` },
    { nome: 'Isoterma', formula: R`L = Q = n \cdot R \cdot T \cdot \ln \dfrac{V_f}{V_i}`, nota: R`$\Delta U = 0$: il calore assorbito diventa tutto lavoro.` },
    { nome: 'Adiabatica', formula: R`p \cdot V^\gamma = \text{costante}`, nota: R`Adiabatica reversibile: veloce rispetto agli scambi di calore, ma senza vortici né attriti. $Q = 0$, quindi $L = -\Delta U$: espandendosi il gas si raffredda.` },
    { nome: 'Lavoro in un ciclo', formula: R`L = Q_{\text{ass}} - Q_{\text{ced}}`, nota: R`In un ciclo $\Delta U = 0$. Nel piano p–V il lavoro è l'area racchiusa.` },
    { nome: 'Rendimento di una macchina termica', formula: R`\eta = \dfrac{L}{Q_{\text{ass}}} = 1 - \dfrac{Q_{\text{ced}}}{Q_{\text{ass}}}`, nota: R`Un numero puro, sempre minore di 1.` },
    { nome: 'Frigorifero', formula: R`\text{COP} = \dfrac{Q_{\text{ass}}}{L}`, nota: R`Calore tolto dall'interno diviso lavoro speso. Alla stanza arriva $Q_{\text{ced}} = Q_{\text{ass}} + L$.` },
    { nome: 'Rendimento di Carnot', formula: R`\eta = 1 - \dfrac{T_f}{T_c}`, nota: R`Temperature in kelvin. È il massimo possibile fra due sorgenti.` },
    { nome: 'Entropia secondo Clausius', formula: R`\Delta S = \dfrac{Q}{T}`, nota: R`Calore scambiato in modo reversibile a temperatura costante. In J/K.` },
    { nome: 'Entropia secondo Boltzmann', formula: R`S = k \cdot \ln W`, nota: R`$W$ è il numero di microstati, $k \approx 1{,}38 \cdot 10^{-23}\,\text{J/K}$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'lavoro-gas', tipo: 'definizione', fronte: R`Che cosa sono **sistema** e **ambiente**?`, retro: R`Il sistema è la parte che si studia, di solito un gas in un cilindro. L'ambiente è tutto il resto. Si scambiano energia come calore e come lavoro.` },
    { id: 'fc-02', sezione: 'lavoro-gas', tipo: 'formula', fronte: R`Lavoro di un gas a **pressione costante**`, retro: R`$L = p \cdot \Delta V$: positivo in espansione, negativo in compressione.` },
    { id: 'fc-03', sezione: 'lavoro-gas', tipo: 'concetto', fronte: R`Nel piano p–V, che cosa rappresenta l'**area** sotto la linea di una trasformazione?`, retro: R`Il lavoro fatto dal gas, anche quando la pressione cambia.` },
    { id: 'fc-04', sezione: 'lavoro-gas', tipo: 'procedura', fronte: R`Quanto fa un chilopascal per un litro?`, retro: R`Un joule: $10^3\,\text{Pa} \cdot 10^{-3}\,\text{m}^3 = 1\,\text{J}$. Con $p$ in kPa e $V$ in L il lavoro esce in joule.` },
    { id: 'fc-05', sezione: 'primo-principio', tipo: 'definizione', fronte: R`Che cos'è l'**energia interna** di un gas?`, retro: R`La somma delle energie delle sue molecole. Nel gas perfetto dipende solo dalla temperatura.` },
    { id: 'fc-06', sezione: 'primo-principio', tipo: 'formula', fronte: R`Il **primo principio** della termodinamica`, retro: R`$\Delta U = Q - L$, con $Q$ calore assorbito e $L$ lavoro fatto dal gas.` },
    { id: 'fc-07', sezione: 'primo-principio', tipo: 'concetto', fronte: R`Perché un gas compresso di colpo si scalda?`, retro: R`Non fa in tempo a scambiare calore: $Q = 0$ e $\Delta U = -L$. In compressione $L$ è negativo, quindi $U$ e la temperatura salgono.` },
    { id: 'fc-08', sezione: 'trasformazioni', tipo: 'definizione', fronte: R`Isobara, isocora, isoterma, adiabatica: che cosa resta fermo?`, retro: R`Nell'isobara la pressione, nell'isocora il volume, nell'isoterma la temperatura. Nell'adiabatica non si scambia calore.` },
    { id: 'fc-09', sezione: 'trasformazioni', tipo: 'concetto', fronte: R`In un'**isoterma** di un gas perfetto, dove va il calore assorbito?`, retro: R`Diventa tutto lavoro: $\Delta U = 0$, quindi $Q = L$.` },
    { id: 'fc-10', sezione: 'trasformazioni', tipo: 'concetto', fronte: R`Perché in un'**isocora** vale $Q = \Delta U$?`, retro: R`Il volume non cambia e il lavoro è zero: tutto il calore va in energia interna.` },
    { id: 'fc-11', sezione: 'trasformazioni', tipo: 'definizione', fronte: R`Che cos'è una **funzione di stato**?`, retro: R`Una grandezza che dipende solo dallo stato, non dalla strada fatta per arrivarci: come l'energia interna. Lavoro e calore non lo sono.` },
    { id: 'fc-12', sezione: 'calori-specifici', tipo: 'formula', fronte: R`La **relazione di Mayer**`, retro: R`$c_p = c_V + R$: a pressione costante serve in più il calore che diventa lavoro.` },
    { id: 'fc-13', sezione: 'calori-specifici', tipo: 'concetto', fronte: R`$c_V$, $c_p$ e $\gamma$ di un gas **monoatomico**`, retro: R`$c_V = \tfrac{3}{2} \cdot R$, $c_p = \tfrac{5}{2} \cdot R$, $\gamma = \tfrac{5}{3}$.` },
    { id: 'fc-14', sezione: 'calori-specifici', tipo: 'formula', fronte: R`L'equazione dell'**adiabatica**`, retro: R`$p \cdot V^\gamma$ costante, con $\gamma = c_p / c_V$: 1,4 per l'aria.` },
    { id: 'fc-15', sezione: 'macchine', tipo: 'definizione', fronte: R`Che cos'è una **macchina termica**?`, retro: R`Un dispositivo che, con un ciclo, prende calore da una sorgente calda, fa lavoro e cede il resto a una sorgente fredda.` },
    { id: 'fc-16', sezione: 'macchine', tipo: 'formula', fronte: R`Il **rendimento** di una macchina termica`, retro: R`$\eta = \dfrac{L}{Q_{\text{ass}}} = 1 - \dfrac{Q_{\text{ced}}}{Q_{\text{ass}}}$, sempre minore di 1.` },
    { id: 'fc-17', sezione: 'macchine', tipo: 'concetto', fronte: R`In un ciclo, quanto vale $\Delta U$? E il lavoro?`, retro: R`$\Delta U = 0$. Il lavoro netto è l'area racchiusa dal ciclo: $L = Q_{\text{ass}} - Q_{\text{ced}}$.` },
    { id: 'fc-18', sezione: 'secondo-principio', tipo: 'definizione', fronte: R`L'enunciato di **Clausius**`, retro: R`Nessuna trasformazione può avere come unico risultato il passaggio di calore da un corpo freddo a uno caldo.` },
    { id: 'fc-19', sezione: 'secondo-principio', tipo: 'definizione', fronte: R`L'enunciato di **Kelvin**`, retro: R`Nessuna trasformazione può avere come unico risultato trasformare in lavoro tutto il calore preso da una sola sorgente.` },
    { id: 'fc-20', sezione: 'secondo-principio', tipo: 'formula', fronte: R`Il **COP** di un frigorifero`, retro: R`$\text{COP} = Q_{\text{ass}} / L$: il calore tolto dall'interno diviso il lavoro speso. Può essere maggiore di 1.` },
    { id: 'fc-21', sezione: 'carnot', tipo: 'definizione', fronte: R`Quando una trasformazione è **reversibile**?`, retro: R`Quando si può percorrere al contrario riportando indietro sistema e ambiente: piano, senza attriti, senza salti di temperatura.` },
    { id: 'fc-22', sezione: 'carnot', tipo: 'formula', fronte: R`Il rendimento di **Carnot**`, retro: R`$\eta = 1 - T_f / T_c$, con le temperature in kelvin: il massimo possibile fra due sorgenti.` },
    { id: 'fc-23', sezione: 'entropia', tipo: 'definizione', fronte: R`Che cos'è un **microstato**?`, retro: R`Un modo preciso di sistemare le molecole. Lo stesso stato visibile si ottiene con molti microstati.` },
    { id: 'fc-24', sezione: 'entropia', tipo: 'formula', fronte: R`L'entropia secondo **Boltzmann** e secondo **Clausius**`, retro: R`$S = k \cdot \ln W$. Per un calore scambiato in modo reversibile a temperatura $T$: $\Delta S = Q / T$.` },
    { id: 'fc-25', sezione: 'entropia', tipo: 'concetto', fronte: R`Il secondo principio detto con l'**entropia**`, retro: R`In un sistema isolato l'entropia non diminuisce mai: cresce nei processi irreversibili.` },
    { id: 'fc-26', sezione: 'entropia', tipo: 'definizione', fronte: R`Che cosa dice il **terzo principio** della termodinamica?`, retro: R`Vicino allo zero assoluto l'entropia di un cristallo perfetto tende a zero. Lo zero assoluto non si raggiunge con un numero finito di trasformazioni.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un gas si espande alla pressione costante di 100 kPa, da 2,0 L a 5,2 L. Quanto lavoro fa il gas?`, suggerimenti: [R`Usa $L = p \cdot \Delta V$. Un chilopascal per un litro fa un joule.`], risposta: { tipo: 'numero', valore: 320, unita: 'J' }, soluzione: [R`$\Delta V = 5{,}2\,\text{L} - 2{,}0\,\text{L} = 3{,}2\,\text{L}$.`, R`$L = 100 \cdot 10^3\,\text{Pa} \cdot 3{,}2 \cdot 10^{-3}\,\text{m}^3 = 320\,\text{J}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un gas viene compresso alla pressione costante di 40 kPa, da 9 L a 3 L. Quanto vale il lavoro fatto dal gas?`, suggerimenti: [R`Il volume diminuisce: aspettati un segno meno.`, R`$\Delta V = V_f - V_i$, finale meno iniziale.`], risposta: { tipo: 'numero', valore: -240, unita: 'J' }, soluzione: [R`$\Delta V = 3\,\text{L} - 9\,\text{L} = -6\,\text{L}$.`, R`$L = 40\,\text{kPa} \cdot (-6\,\text{L}) = -240\,\text{J}$: è l'ambiente a fare lavoro sul gas.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Un gas alla pressione costante di $2{,}2 \cdot 10^5\,\text{Pa}$ aumenta il suo volume di $0{,}004\,\text{m}^3$. Quanto lavoro fa?`, suggerimenti: [R`$L = p \cdot \Delta V$, con pascal e metri cubi.`], risposta: { tipo: 'numero', valore: 880, unita: 'J' }, soluzione: [R`$L = 2{,}2 \cdot 10^5\,\text{Pa} \cdot 0{,}004\,\text{m}^3 = 880\,\text{J}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un gas assorbe 900 J di calore e fa 340 J di lavoro. Di quanto cambia la sua energia interna?`, suggerimenti: [R`Primo principio: $\Delta U = Q - L$.`], risposta: { tipo: 'numero', valore: 560, unita: 'J' }, soluzione: [R`$\Delta U = 900\,\text{J} - 340\,\text{J} = 560\,\text{J}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 2, testo: R`Un gas assorbe 300 J di calore mentre viene compresso: l'ambiente fa su di lui un lavoro di 120 J. Di quanto cambia la sua energia interna?`, suggerimenti: [R`Il lavoro fatto **dal** gas è negativo: $L = -120\,\text{J}$.`, R`$\Delta U = Q - L$, con attenzione al meno.`], risposta: { tipo: 'numero', valore: 420, unita: 'J' }, soluzione: [R`$Q = 300\,\text{J}$, $L = -120\,\text{J}$.`, R`$\Delta U = 300\,\text{J} - (-120\,\text{J}) = 420\,\text{J}$: calore e lavoro entrano tutti e due.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un gas si espande senza scambiare calore e fa 180 J di lavoro. Di quanto cambia la sua energia interna?`, suggerimenti: [R`Senza calore $Q = 0$, quindi $\Delta U = -L$.`], risposta: { tipo: 'numero', valore: -180, unita: 'J' }, soluzione: [R`$\Delta U = 0 - 180\,\text{J} = -180\,\text{J}$: il gas si raffredda.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Un gas chiuso in un recipiente rigido assorbe 360 J di calore. Di quanto aumenta la sua energia interna?`, suggerimenti: [R`Volume costante: il lavoro è zero.`], risposta: { tipo: 'numero', valore: 360, unita: 'J' }, soluzione: [R`Isocora: $L = 0$, quindi $\Delta U = Q = 360\,\text{J}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un gas perfetto si espande a temperatura costante e assorbe 680 J di calore. Quanto lavoro fa?`, suggerimenti: [R`A temperatura costante l'energia interna non cambia.`], risposta: { tipo: 'numero', valore: 680, unita: 'J' }, soluzione: [R`Isoterma: $\Delta U = 0$, quindi $L = Q = 680\,\text{J}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Un gas cede 150 J di calore e la sua energia interna diminuisce di 400 J. Quanto lavoro fa il gas?`, suggerimenti: [R`Calore ceduto: $Q = -150\,\text{J}$. Energia che cala: $\Delta U = -400\,\text{J}$.`, R`Dal primo principio: $L = Q - \Delta U$.`], risposta: { tipo: 'numero', valore: 250, unita: 'J' }, soluzione: [R`$L = Q - \Delta U = -150\,\text{J} - (-400\,\text{J}) = 250\,\text{J}$.`, R`È positivo: il gas si espande e paga il lavoro con la sua energia interna.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Di quanto aumenta l'energia interna di 1,0 mol di gas monoatomico che si scalda di 20 K? (Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.)`, suggerimenti: [R`Per un gas monoatomico $\Delta U = \tfrac{3}{2} \cdot n \cdot R \cdot \Delta T$.`], risposta: { tipo: 'numero', valore: 249.3, unita: 'J' }, soluzione: [R`$\Delta U = \tfrac{3}{2} \cdot 1{,}0 \cdot 8{,}31 \cdot 20\,\text{J} \approx 249\,\text{J}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`2,0 mol di gas monoatomico si scaldano di 15 K a volume costante. Quanto calore assorbono?`, suggerimenti: [R`A volume costante $Q = n \cdot c_V \cdot \Delta T$, con $c_V = \tfrac{3}{2} \cdot R$.`], risposta: { tipo: 'numero', valore: 374, unita: 'J' }, soluzione: [R`$c_V = \tfrac{3}{2} \cdot 8{,}31 \approx 12{,}47\,\text{J/(mol}\cdot\text{K)}$.`, R`$Q = 2{,}0\,\text{mol} \cdot 12{,}47\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} \cdot 15\,\text{K} \approx 374\,\text{J}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`1,0 mol di gas monoatomico si scalda di 10 K a pressione costante. Quanto calore assorbe?`, suggerimenti: [R`A pressione costante $Q = n \cdot c_p \cdot \Delta T$, con $c_p = \tfrac{5}{2} \cdot R$.`], risposta: { tipo: 'numero', valore: 208, unita: 'J' }, soluzione: [R`$c_p = \tfrac{5}{2} \cdot 8{,}31 \approx 20{,}8\,\text{J/(mol}\cdot\text{K)}$.`, R`$Q = 1{,}0 \cdot 20{,}8 \cdot 10\,\text{J} \approx 208\,\text{J}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`In un ciclo un motore assorbe 1500 J dalla sorgente calda e ne cede 1100 alla sorgente fredda. Quanto lavoro fa?`, suggerimenti: [R`In un ciclo $\Delta U = 0$: $L = Q_{\text{ass}} - Q_{\text{ced}}$.`], risposta: { tipo: 'numero', valore: 400, unita: 'J' }, soluzione: [R`$L = 1500\,\text{J} - 1100\,\text{J} = 400\,\text{J}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un motore fa 200 J di lavoro per ogni 1000 J di calore assorbito. Quanto vale il suo rendimento?`, suggerimenti: [R`$\eta = L / Q_{\text{ass}}$.`], risposta: { tipo: 'numero', valore: 20, unita: '%' }, soluzione: [R`$\eta = \dfrac{200\,\text{J}}{1000\,\text{J}} = 0{,}20$, cioè il 20%.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Un motore con rendimento 0,15 assorbe 2000 J a ogni ciclo. Quanto calore cede alla sorgente fredda?`, suggerimenti: [R`Prima il lavoro: $L = \eta \cdot Q_{\text{ass}}$.`, R`Poi $Q_{\text{ced}} = Q_{\text{ass}} - L$.`], risposta: { tipo: 'numero', valore: 1700, unita: 'J' }, soluzione: [R`$L = 0{,}15 \cdot 2000\,\text{J} = 300\,\text{J}$.`, R`$Q_{\text{ced}} = 2000\,\text{J} - 300\,\text{J} = 1700\,\text{J}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un motore di Carnot lavora fra 800 K e 280 K. Quanto vale il suo rendimento?`, suggerimenti: [R`$\eta = 1 - T_f / T_c$.`], risposta: { tipo: 'numero', valore: 65, unita: '%' }, soluzione: [R`$\eta = 1 - \dfrac{280\,\text{K}}{800\,\text{K}} = 1 - 0{,}35 = 0{,}65$, cioè il 65%.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Un motore di Carnot lavora fra 477 °C e 27 °C. Quanto vale il suo rendimento?`, suggerimenti: [R`Prima porta le temperature in kelvin: si aggiunge 273.`, R`Poi $\eta = 1 - T_f / T_c$.`], risposta: { tipo: 'numero', valore: 60, unita: '%' }, soluzione: [R`$T_c = (477 + 273)\,\text{K} = 750\,\text{K}$, $T_f = (27 + 273)\,\text{K} = 300\,\text{K}$.`, R`$\eta = 1 - \dfrac{300\,\text{K}}{750\,\text{K}} = 1 - 0{,}4 = 0{,}6$, cioè il 60%. Con i gradi Celsius sarebbe venuto il 94%: sbagliato.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un frigorifero toglie 540 J dal suo interno spendendo 180 J di lavoro. Quanto calore cede alla cucina?`, suggerimenti: [R`Alla cucina arriva il calore tolto più il lavoro.`], risposta: { tipo: 'numero', valore: 720, unita: 'J' }, soluzione: [R`$Q_{\text{ced}} = Q_{\text{ass}} + L = 540\,\text{J} + 180\,\text{J} = 720\,\text{J}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un frigorifero toglie 800 J dal suo interno con 200 J di lavoro. Quanto vale il suo COP?`, suggerimenti: [R`$\text{COP} = Q_{\text{ass}} / L$.`], risposta: { tipo: 'numero', valore: 4 }, soluzione: [R`$\text{COP} = \dfrac{800\,\text{J}}{200\,\text{J}} = 4$: toglie 4 J per ogni joule speso.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un corpo a 350 K assorbe 1750 J di calore in modo reversibile, senza cambiare temperatura. Di quanto aumenta la sua entropia?`, suggerimenti: [R`$\Delta S = Q / T$, in J/K.`], risposta: { tipo: 'numero', valore: 5, unita: 'J/K' }, soluzione: [R`$\Delta S = \dfrac{1750\,\text{J}}{350\,\text{K}} = 5\,\text{J/K}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`0,50 mol di gas monoatomico si scaldano a pressione costante da 300 K a 400 K. Quanto calore assorbono?`, suggerimenti: [R`Il lavoro a pressione costante è $p \cdot \Delta V = n \cdot R \cdot \Delta T$.`, R`Somma $\Delta U = \tfrac{3}{2} \cdot n \cdot R \cdot \Delta T$ e il lavoro, oppure usa $c_p = \tfrac{5}{2} \cdot R$.`], risposta: { tipo: 'numero', valore: 1039, unita: 'J' }, soluzione: [R`Dati: $n = 0{,}50\,\text{mol}$, $\Delta T = 100\,\text{K}$. Lavoro: $L = n \cdot R \cdot \Delta T = 0{,}50 \cdot 8{,}31 \cdot 100\,\text{J} = 415{,}5\,\text{J}$.`, R`Energia interna: $\Delta U = \tfrac{3}{2} \cdot 415{,}5\,\text{J} \approx 623{,}3\,\text{J}$.`, R`$Q = \Delta U + L \approx 1039\,\text{J}$. Controllo: $n \cdot c_p \cdot \Delta T = 0{,}50 \cdot 20{,}775 \cdot 100\,\text{J} \approx 1039\,\text{J}$.`] },
    { id: 'es-02', difficolta: 2, testo: R`1,5 mol di gas a 320 K si espandono a temperatura costante da 4,0 L a 16 L. Quanto calore assorbono?`, suggerimenti: [R`Isoterma: $Q = L = n \cdot R \cdot T \cdot \ln \dfrac{V_f}{V_i}$.`, R`Il volume quadruplica: serve $\ln 4 \approx 1{,}39$.`], risposta: { tipo: 'numero', valore: 5530, unita: 'J' }, soluzione: [R`$n \cdot R \cdot T = 1{,}5\,\text{mol} \cdot 8{,}31\,\tfrac{\text{J}}{\text{mol} \cdot \text{K}} \cdot 320\,\text{K} = 3988{,}8\,\text{J}$.`, R`$L = 3988{,}8\,\text{J} \cdot \ln 4 \approx 5530\,\text{J}$.`, R`$\Delta U = 0$, quindi $Q = L \approx 5{,}53\,\text{kJ}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Nel cilindro di un motore diesel l'aria, a 300 K e 100 kPa, viene compressa di colpo fino a un decimo del volume. Considera la compressione adiabatica, con $\gamma = 1{,}4$. A che temperatura arriva l'aria?`, suggerimenti: [R`Dall'adiabatica: $p_2 = p_1 \cdot \left(\dfrac{V_1}{V_2}\right)^\gamma = 100\,\text{kPa} \cdot 10^{1{,}4}$.`, R`Poi l'equazione generale dei gas: $\dfrac{p_1 \cdot V_1}{T_1} = \dfrac{p_2 \cdot V_2}{T_2}$.`], risposta: { tipo: 'numero', valore: 754, unita: 'K', tolleranza: 5 }, soluzione: [R`$p_2 = 100\,\text{kPa} \cdot 10^{1{,}4} \approx 100 \cdot 25{,}1\,\text{kPa} \approx 2512\,\text{kPa}$.`, R`$T_2 = T_1 \cdot \dfrac{p_2 \cdot V_2}{p_1 \cdot V_1} = 300\,\text{K} \cdot \dfrac{2512}{100} \cdot \dfrac{1}{10} \approx 754\,\text{K}$.`, R`Sono circa 480 °C: abbastanza per accendere il gasolio senza scintilla.`] },
    { id: 'es-04', difficolta: 2, testo: R`Un gas percorre in senso orario un ciclo rettangolare nel piano p–V: le pressioni sono 120 kPa e 300 kPa, i volumi 1,0 L e 6,0 L. A ogni giro assorbe 4000 J di calore. Quanto vale il rendimento?`, suggerimenti: [R`Il lavoro è l'area del rettangolo: base $\Delta V$, altezza $\Delta p$.`, R`Un chilopascal per un litro fa un joule.`], risposta: { tipo: 'numero', valore: 22.5, unita: '%' }, soluzione: [R`$L = (300 - 120)\,\text{kPa} \cdot (6{,}0 - 1{,}0)\,\text{L} = 180\,\text{kPa} \cdot 5{,}0\,\text{L} = 900\,\text{J}$.`, R`$\eta = \dfrac{900\,\text{J}}{4000\,\text{J}} = 0{,}225$, cioè il 22,5%.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un motore ideale di Carnot lavora fra 500 K e 350 K e assorbe 4400 J a ogni ciclo. Quanto lavoro fa in un ciclo?`, suggerimenti: [R`Prima il rendimento di Carnot, poi $L = \eta \cdot Q_{\text{ass}}$.`], risposta: { tipo: 'numero', valore: 1320, unita: 'J' }, soluzione: [R`$\eta = 1 - \dfrac{350\,\text{K}}{500\,\text{K}} = 1 - 0{,}70 = 0{,}30$.`, R`$L = 0{,}30 \cdot 4400\,\text{J} = 1320\,\text{J}$. Gli altri 3080 J vanno alla sorgente fredda.`] },
    { id: 'es-06', difficolta: 2, testo: R`Un inventore dice di aver costruito un motore che lavora fra 600 K e 330 K con un rendimento del 50%. Qual è il rendimento massimo possibile fra queste due temperature? Gli credi?`, suggerimenti: [R`Il massimo è il rendimento di Carnot.`], risposta: { tipo: 'numero', valore: 45, unita: '%' }, soluzione: [R`$\eta_C = 1 - \dfrac{330\,\text{K}}{600\,\text{K}} = 1 - 0{,}55 = 0{,}45$, cioè il 45%.`, R`Nessun motore fra queste temperature può superare il 45%: il 50% è impossibile, per il teorema di Carnot.`] },
    { id: 'es-07', difficolta: 3, testo: R`Un frigorifero assorbe dalla rete una potenza di 120 W e ha COP 3. Quanto calore toglie dal suo interno in un'ora di funzionamento?`, suggerimenti: [R`Ogni secondo riceve 120 J di lavoro, e toglie il triplo di calore.`, R`Un'ora sono 3600 s.`], risposta: { tipo: 'numero', valore: 1296, unita: 'kJ' }, soluzione: [R`Lavoro in un'ora: $L = 120\,\text{W} \cdot 3600\,\text{s} = 432\,000\,\text{J}$.`, R`Calore tolto: $Q_{\text{ass}} = \text{COP} \cdot L = 3 \cdot 432\,000\,\text{J} = 1\,296\,000\,\text{J} \approx 1296\,\text{kJ}$, circa 1,3 MJ.`] },
    { id: 'es-08', difficolta: 2, testo: R`2000 J di calore passano da un corpo a 800 K a un corpo a 400 K. I corpi sono così grandi che la loro temperatura non cambia. Di quanto varia l'entropia totale?`, suggerimenti: [R`Il corpo caldo cede calore: $\Delta S_1 = -Q / T_c$. Il freddo lo prende: $\Delta S_2 = +Q / T_f$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'J/K' }, soluzione: [R`$\Delta S_1 = \dfrac{-2000\,\text{J}}{800\,\text{K}} = -2{,}5\,\text{J/K}$; $\Delta S_2 = \dfrac{2000\,\text{J}}{400\,\text{K}} = +5\,\text{J/K}$.`, R`Totale: $+2{,}5\,\text{J/K}$. L'entropia cresce: il passaggio è irreversibile.`] },
    { id: 'es-09', difficolta: 3, testo: R`Cinque molecole si muovono in una scatola divisa in due metà uguali. Qual è la probabilità di trovarle tutte nella metà sinistra?`, suggerimenti: [R`Ogni molecola può stare a sinistra o a destra: quanti microstati ci sono in tutto?`, R`Tutte a sinistra è un solo microstato.`], risposta: { tipo: 'numero', valore: 3.125, unita: '%', tolleranza: 0.15 }, soluzione: [R`I microstati sono $2^5 = 32$, tutti ugualmente probabili.`, R`Tutte a sinistra: un solo microstato. Probabilità $\dfrac{1}{32} \approx 0{,}031$, cioè circa il 3%.`] },
    { id: 'es-10', difficolta: 2, testo: R`Il motore di un'auto sviluppa una potenza di 30 kW con un rendimento del 25%. Quanto calore cede all'ambiente ogni secondo?`, suggerimenti: [R`In un secondo fa 30 kJ di lavoro: è un quarto del calore assorbito.`, R`$Q_{\text{ced}} = Q_{\text{ass}} - L$.`], risposta: { tipo: 'numero', valore: 90, unita: 'kJ' }, soluzione: [R`In un secondo: $L = 30\,\text{kJ}$ e $Q_{\text{ass}} = \dfrac{L}{\eta} = \dfrac{30\,\text{kJ}}{0{,}25} = 120\,\text{kJ}$.`, R`$Q_{\text{ced}} = 120\,\text{kJ} - 30\,\text{kJ} = 90\,\text{kJ}$: tre volte il lavoro utile.`] },
    { id: 'es-11', difficolta: 2, testo: R`2,0 mol di gas biatomico si scaldano di 25 K a pressione costante. Quanto calore assorbono?`, suggerimenti: [R`Per un gas biatomico $c_V = \tfrac{5}{2} \cdot R$. Con la relazione di Mayer trovi $c_p$.`], risposta: { tipo: 'numero', valore: 1454, unita: 'J' }, soluzione: [R`$c_p = c_V + R = \tfrac{7}{2} \cdot R \approx 29{,}1\,\text{J/(mol}\cdot\text{K)}$.`, R`$Q = 2{,}0 \cdot \tfrac{7}{2} \cdot 8{,}31 \cdot 25\,\text{J} \approx 1454\,\text{J}$.`] },
    { id: 'es-12', difficolta: 3, testo: R`0,40 mol di gas monoatomico si espandono senza scambiare calore e si raffreddano da 450 K a 250 K. Quanto lavoro fa il gas?`, suggerimenti: [R`Adiabatica: $Q = 0$, quindi $L = -\Delta U$.`, R`$\Delta U = \tfrac{3}{2} \cdot n \cdot R \cdot \Delta T$, con $\Delta T$ negativo.`], risposta: { tipo: 'numero', valore: 997, unita: 'J' }, soluzione: [R`$\Delta T = 250\,\text{K} - 450\,\text{K} = -200\,\text{K}$.`, R`$\Delta U = \tfrac{3}{2} \cdot 0{,}40 \cdot 8{,}31 \cdot (-200)\,\text{J} \approx -997\,\text{J}$.`, R`$L = -\Delta U \approx 997\,\text{J}$: il gas lavora a spese della sua energia interna.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa dice il primo principio della termodinamica?`, opzioni: [R`Che il calore passa sempre dal caldo al freddo`, R`Che l'energia interna di un gas non cambia mai`, R`Che $\Delta U = Q - L$: l'energia si conserva, contando anche il calore`, R`Che il rendimento di un motore è minore di 1`], corretta: 2, spiegazione: R`Il primo principio è la conservazione dell'energia. Il verso del calore e il limite del rendimento sono il secondo principio. L'energia interna cambia, eccome: con il calore e con il lavoro.` },
    { id: 'q-02', domanda: R`Un gas perfetto si espande a temperatura costante. Che cosa si può dire?`, opzioni: [R`Che il calore assorbito è uguale al lavoro fatto`, R`Che non scambia calore`, R`Che la sua energia interna cresce`, R`Che il lavoro è zero`], corretta: 0, spiegazione: R`Con $T$ costante l'energia interna non cambia: $\Delta U = 0$, quindi $Q = L$. Il gas deve assorbire calore, altrimenti si raffredderebbe; e il lavoro è positivo, perché si espande.` },
    { id: 'q-03', domanda: R`In quale trasformazione il lavoro fatto dal gas è sempre zero?`, opzioni: [R`Isobara`, R`Isoterma`, R`Adiabatica`, R`Isocora`], corretta: 3, spiegazione: R`Nell'isocora il volume non cambia: $\Delta V = 0$ e nel piano p–V la linea è verticale, senza area sotto. Nelle altre il volume cambia e il gas lavora.` },
    { id: 'q-04', domanda: R`Nel piano p–V, che cosa rappresenta l'area racchiusa da un ciclo?`, opzioni: [R`Il calore assorbito`, R`Il lavoro netto del ciclo`, R`La variazione di energia interna`, R`Il rendimento`], corretta: 1, spiegazione: R`È la differenza fra il lavoro fatto in espansione e quello subito in compressione: il lavoro netto. La variazione di energia interna in un ciclo è zero.` },
    { id: 'q-05', domanda: R`L'energia interna di un gas perfetto dipende…`, opzioni: [R`dal volume`, R`dalla pressione`, R`solo dalla temperatura`, R`dalla strada fatta per arrivare in quello stato`], corretta: 2, spiegazione: R`Nel gas perfetto l'energia interna è l'energia cinetica delle molecole, che dipende solo da $T$. È una funzione di stato: la strada non conta.` },
    { id: 'q-06', domanda: R`Un gas si espande senza scambiare calore. La sua temperatura…`, opzioni: [R`scende`, R`sale`, R`resta uguale`, R`può salire o scendere, a seconda del gas`], corretta: 0, spiegazione: R`Con $Q = 0$ vale $\Delta U = -L$. Espandendosi il gas fa lavoro positivo, quindi $U$ cala, e con lei la temperatura. È per questo che l'aria che sale in quota si raffredda.` },
    { id: 'q-07', domanda: R`Perché per un gas $c_p$ è maggiore di $c_V$?`, opzioni: [R`Perché a pressione costante il gas è più compresso`, R`Perché $c_p$ si misura in un'altra unità`, R`Perché l'energia interna dipende dalla pressione`, R`Perché a pressione costante una parte del calore diventa lavoro`], corretta: 3, spiegazione: R`A pressione costante il gas si espande e lavora: per lo stesso $\Delta T$ serve il calore in più $n \cdot R \cdot \Delta T$. Da qui $c_p = c_V + R$. Le unità sono le stesse, e $U$ dipende solo da $T$.` },
    { id: 'q-08', domanda: R`Un motore potrebbe avere rendimento 1 se…`, opzioni: [R`non avesse nessun attrito`, R`in nessun caso: deve sempre cedere calore a una sorgente più fredda`, R`la sorgente calda fosse caldissima`, R`usasse un gas perfetto`], corretta: 1, spiegazione: R`Lo vieta il secondo principio, nell'enunciato di Kelvin. Anche il motore ideale di Carnot, senza attriti, ha $\eta = 1 - T_f / T_c$: minore di 1 per ogni temperatura calda.` },
    { id: 'q-09', domanda: R`Quale frase è l'enunciato di Clausius del secondo principio?`, opzioni: [R`L'energia dell'universo è costante`, R`Un gas perfetto ha energia interna proporzionale a $T$`, R`Il calore non può passare da un corpo freddo a uno caldo come unico risultato`, R`Il lavoro di un gas è l'area sotto la curva`], corretta: 2, spiegazione: R`È l'enunciato di Clausius: da solo il calore va dal caldo al freddo. La conservazione dell'energia è il primo principio; le altre due frasi sono vere ma parlano d'altro.` },
    { id: 'q-10', domanda: R`Un frigorifero porta calore dal suo interno freddo alla cucina, più calda. Viola il secondo principio?`, opzioni: [R`No: lo fa spendendo lavoro, quindi non è l'unico risultato`, R`Sì, ma di poco, e per questo si accetta`, R`No, perché in realtà il calore va dalla cucina all'interno`, R`Sì: per questo consuma corrente`], corretta: 0, spiegazione: R`Clausius vieta il passaggio dal freddo al caldo come **unico** risultato. Il frigorifero spende il lavoro del compressore: c'è un altro risultato, e il principio è salvo.` },
    { id: 'q-11', domanda: R`Il rendimento di un motore di Carnot dipende…`, opzioni: [R`dal tipo di gas`, R`dalla quantità di gas`, R`da quanti giri fa al secondo`, R`solo dalle temperature delle due sorgenti`], corretta: 3, spiegazione: R`$\eta = 1 - T_f / T_c$: contano solo le due temperature, in kelvin. Gas, quantità e velocità cambiano il lavoro e la potenza, non il rendimento massimo.` },
    { id: 'q-12', domanda: R`Due motori di Carnot hanno la sorgente fredda a 300 K. Quale rende di più?`, opzioni: [R`Quello con la sorgente calda a 400 K`, R`Quello con la sorgente calda a 900 K`, R`Rendono uguale, perché la fredda è la stessa`, R`Dipende dal gas che usano`], corretta: 1, spiegazione: R`Più grande è $T_c$, più piccolo è $T_f / T_c$: a 900 K il rendimento è circa il 67%, a 400 K il 25%. Per rendere tanto serve una grande differenza di temperatura.` },
    { id: 'q-13', domanda: R`Che cos'è una trasformazione reversibile?`, opzioni: [R`Una trasformazione che si può ripetere quante volte si vuole`, R`Una trasformazione senza scambi di calore`, R`Una trasformazione che si può percorrere al contrario, riportando indietro sistema e ambiente`, R`Una trasformazione a temperatura costante`], corretta: 2, spiegazione: R`Reversibile vuol dire che si può tornare indietro senza lasciare tracce nell'ambiente. Serve che avvenga piano e senza attriti. Una trasformazione senza calore è adiabatica, una a $T$ costante isoterma: possono essere reversibili o no.` },
    { id: 'q-14', domanda: R`In un sistema isolato, l'entropia…`, opzioni: [R`non diminuisce mai`, R`diminuisce sempre`, R`resta sempre costante`, R`cambia a caso, senza una regola`], corretta: 0, spiegazione: R`È il secondo principio detto con l'entropia: cresce nei processi irreversibili e resta uguale solo in quelli ideali reversibili. Non diminuisce mai.` },
    { id: 'q-15', domanda: R`Tre molecole stanno in una scatola divisa in due metà. In quanti modi possono stare tutte a sinistra?`, opzioni: [R`3`, R`8`, R`0`, R`1`], corretta: 3, spiegazione: R`Ogni molecola deve stare a sinistra: c'è un solo microstato. I microstati in tutto sono $2^3 = 8$.` },
    { id: 'q-16', domanda: R`Un motore assorbe calore e fa lavoro. Dove va il calore che non diventa lavoro?`, opzioni: [R`Scompare`, R`Va alla sorgente fredda`, R`Torna nella sorgente calda`, R`Si accumula nel gas come energia interna`], corretta: 1, spiegazione: R`In un ciclo $\Delta U = 0$: il gas non accumula energia. L'energia non scompare, e il calore da solo non torna verso il caldo. Il resto va alla sorgente fredda: $Q_{\text{ced}} = Q_{\text{ass}} - L$.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`In questo argomento $L$ è il lavoro fatto **dal** gas. In compressione è negativo, e nel primo principio il termine $-L$ diventa positivo.` },
    { tipo: 'errore', testo: R`Nel rendimento di Carnot le temperature vanno in kelvin. Con i gradi Celsius il conto viene sbagliato, e di molto.` },
    { tipo: 'errore', testo: R`Isoterma non vuol dire senza calore: vuol dire temperatura costante. Senza calore è l'adiabatica.` },
    { tipo: 'trucco', testo: R`Un chilopascal per un litro fa un joule: con la pressione in kPa e il volume in L il lavoro esce già in joule.` },
    { tipo: 'trucco', testo: R`In un ciclo $\Delta U = 0$: il lavoro è la differenza fra il calore assorbito e quello ceduto.` },
    { tipo: 'metodo', testo: R`Per ogni trasformazione chiediti che cosa resta fermo: pressione, volume, temperatura o calore. Ognuno semplifica il primo principio in un modo diverso.` },
    { tipo: 'metodo', testo: R`Nei problemi con le moli cerca subito $n \cdot R \cdot T$ o $n \cdot R \cdot \Delta T$: compaiono quasi sempre.` },
    { tipo: 'errore', testo: R`Il COP di un frigorifero può superare 1 senza creare energia: il calore non viene prodotto, viene spostato.` }
  ],
  aneddoti: [
    { fisico: 'Sadi Carnot', anni: '1796–1832', titolo: 'Il libretto che quasi nessuno lesse', testo: R`Nel 1824 un ingegnere militare di 28 anni, Sadi Carnot, pubblicò a sue spese un libretto: *Riflessioni sulla potenza motrice del fuoco*. Era figlio di Lazare Carnot, uno dei capi della Francia rivoluzionaria. Voleva capire quanto lavoro si può ricavare dal calore. Immaginò una macchina ideale che lavora fra due temperature, e dimostrò che nessuna macchina può fare meglio. Il libro passò quasi inosservato. Carnot credeva ancora che il calore fosse un fluido, il calorico. Nel 1832 morì di colera, a 36 anni. Per paura del contagio molte sue carte furono bruciate. Nei quaderni rimasti, pubblicati dal fratello nel 1878, si legge che aveva cambiato idea: il calore è movimento.`, legame: R`È il ciclo di Carnot, con il suo rendimento massimo $\eta = 1 - T_f / T_c$.` },
    { fisico: 'Rudolf Clausius', anni: '1822–1888', titolo: 'Una parola nuova, simile a energia', testo: R`Nel 1850 il fisico tedesco Rudolf Clausius mise d'accordo due idee che sembravano nemiche. Da una parte c'era Carnot, con le sue macchine fra due temperature. Dall'altra c'era Joule, con il calore che è energia. Ne uscirono il primo e il secondo principio. Poi Clausius cercò per anni una grandezza che dicesse il secondo principio con una formula. La trovò nel calore diviso la temperatura. Nel 1865 le diede un nome. Prese la parola greca *tropé*, che vuol dire trasformazione, e ne fece «entropia». La scelse apposta simile a «energia», perché le due grandezze sono parenti strette. L'articolo finiva con due frasi rimaste famose: l'energia del mondo è costante, l'entropia del mondo tende a un massimo.`, legame: R`È la grandezza $\Delta S = Q / T$, e il secondo principio detto con l'entropia.` },
    { fisico: 'James Clerk Maxwell', anni: '1831–1879', titolo: 'Il diavoletto che smista le molecole', testo: R`Nel dicembre 1867 James Clerk Maxwell scrisse una lettera all'amico Peter Guthrie Tait. Proponeva un esperimento immaginario. Una scatola di gas è divisa in due da una parete con uno sportello. Un essere piccolissimo guarda arrivare le molecole. Fa passare le veloci da una parte e le lente dall'altra. Così, senza lavoro, una metà si scalda e l'altra si raffredda. Il secondo principio sembrava violato. Qualche anno dopo William Thomson chiamò quell'essere «demone». Per chiudere la questione ci volle più di un secolo. Per scegliere, il diavoletto deve misurare le molecole e ricordarsi le misure. Prima o poi deve cancellare la sua memoria. E cancellare un'informazione produce entropia, quanta basta a salvare il secondo principio.`, legame: R`Il secondo principio è una legge sui grandi numeri: smistare le molecole una per una ha un costo in entropia.` },
    { fisico: 'Ludwig Boltzmann', anni: '1844–1906', titolo: 'La formula incisa sulla tomba', testo: R`Il fisico austriaco Ludwig Boltzmann credeva negli atomi quando molti colleghi non ci credevano. Nel 1877 legò l'entropia al numero dei modi in cui si possono sistemare le particelle. Così spiegava perché le cose vanno in un verso solo: verso gli stati più probabili. Fisici famosi, come Ernst Mach, lo attaccarono: gli atomi nessuno li aveva mai visti. Queste discussioni lo amareggiarono per anni. Boltzmann morì nel 1906 a Duino, vicino a Trieste. Poco dopo gli esperimenti di Jean Perrin convinsero quasi tutti che gli atomi esistono. Sulla sua tomba, a Vienna, è incisa la formula $S = k \cdot \log W$: lì «log» è il logaritmo naturale, il nostro ln. In questa forma però non la scrisse lui, ma Max Planck, che introdusse anche la costante $k$.`, legame: R`È la formula $S = k \cdot \ln W$: l'entropia conta i microstati.` }
  ]
});
})();
