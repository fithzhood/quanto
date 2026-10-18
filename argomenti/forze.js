/* Quanto — Le forze (primo anno): forza e risultante, massa e peso, peso specifico, legge di Hooke e dinamometro,
   forza normale, attrito statico e dinamico. Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/forze.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'forze',
  titolo: 'Le forze',
  introduzione: R`Una **forza** è una spinta o una tirata. Le forze sono dappertutto. La mano apre una porta, i freni fermano una bicicletta, la Terra ci tiene con i piedi per terra. Per descriverle servono i vettori, perché conta anche verso dove spingono.

Qui si conoscono le forze di ogni giorno. Il **peso**, che non va confuso con la massa. La **forza elastica** di una molla, che serve a misurare le forze con il dinamometro. La **forza normale** di un piano che regge un corpo. E l'**attrito**, che spiega perché un armadio pesante non parte.

Bisogna saper sommare due vettori e scomporli lungo due assi. Servono anche le unità del Sistema Internazionale e la densità.`,
  inBreve: [
    R`Una **forza** può deformare un corpo o cambiarne la velocità. È un vettore e si misura in **newton** (N). Non serve per mantenere il moto.`,
    R`Le forze su un corpo si sommano come vettori: la **risultante**. Se la risultante è zero, le forze si fanno equilibrio.`,
    R`La **massa** è la quantità di materia e non cambia. Il **peso** è una forza: $P = m \cdot g$, con $g = 9{,}8\,\text{N/kg}$ sulla Terra.`,
    R`**Legge di Hooke**: l'allungamento di una molla è proporzionale alla forza, $F = k \cdot x$. Su questa legge funziona il dinamometro.`,
    R`L'**attrito statico** si adatta alla spinta fino a $\mu_s \cdot N$. Quando il corpo scivola c'è l'**attrito dinamico** $\mu_d \cdot N$, di solito più piccolo.`
  ],
  sezioni: [
    {
      id: 'forza',
      titolo: 'Che cos\'è una forza',
      testo: R`Spingi una porta e si apre. Stringi una spugna e si schiaccia. Calci un pallone e parte. In tutti e tre i casi c'è una **forza**: una spinta o una tirata.

Una forza può fare due cose. Può **deformare** un corpo, come la spugna o una molla. Oppure può **cambiarne la velocità**: farlo partire, fermarlo, fargli cambiare direzione.

>* Una **forza** è un'azione che può deformare un corpo o cambiarne la velocità. È un vettore e si misura in **newton** (N).

Come ogni vettore, una forza ha un modulo, una direzione e un verso. Per una forza conta anche il **punto di applicazione**, cioè dove agisce. Spingere una porta vicino alla maniglia non è come spingerla vicino ai cardini.

Alcune forze agiscono per **contatto**: la mano che spinge, la corda che tira, il pavimento che frena. Altre agiscono **a distanza**, senza toccare. Sono a distanza il peso, che viene dalla Terra, e la forza di una calamita.

> Le forze di tutti i giorni sembrano tante, ma vengono da due sole **interazioni fondamentali**. Il peso viene dalla **gravità**. La forza della calamita e tutte le forze di contatto vengono dalla forza **elettromagnetica** fra gli atomi. Le altre due interazioni, la **nucleare forte** e la **nucleare debole**, agiscono solo dentro il nucleo.

Quanto vale un newton? Più o meno il peso di una tavoletta di cioccolato da 100 g. Una mela da 200 g pesa circa 2 N. Una persona adulta pesa circa 700 N.

>! Una forza non serve a mantenere il moto. Un disco da hockey scivola a lungo sul ghiaccio senza che nessuno lo spinga. Rallenta perché il ghiaccio e l'aria lo frenano: anche quelle sono forze.

?? Un pallone calciato rotola sul prato e dopo un po' si ferma. Perché?
[ ] è finita la forza del calcio
[x] il prato e l'aria lo frenano
[ ] il peso lo tira indietro
=> Dopo il calcio nessuno spinge più il pallone, e non serve: andrebbe avanti da solo. Si ferma perché l'attrito con il prato e l'aria gli tolgono velocità. Il peso è verticale e non frena in orizzontale.

?? Una molla tirata richiama la mano. Da quale interazione fondamentale viene la sua forza?
[ ] dalla gravità
[x] dall'elettromagnetica
[ ] dalla nucleare forte
[ ] dalla nucleare debole
=> Gli atomi della molla, spostati, si richiamano con forze elettriche. La gravità dà il peso; le due forze nucleari agiscono solo dentro il nucleo.`
    },
    {
      id: 'risultante',
      titolo: 'Più forze insieme: la risultante',
      testo: R`Nel tiro alla fune due squadre tirano la stessa corda in versi opposti. Se tirano uguale, la corda resta ferma. Se una squadra tira di più, la corda si sposta dalla sua parte.

Quando su un corpo agiscono più forze, conta il loro effetto insieme. Le forze si sommano come vettori, con la regola punta-coda o con quella del parallelogramma.

>* La **forza risultante** è la somma vettoriale di tutte le forze che agiscono su un corpo. Se la risultante è zero, le forze si fanno **equilibrio**.

Ci sono tre casi semplici.

- **Stessa direzione e stesso verso**: i moduli si sommano.
- **Stessa direzione e versi opposti**: si fa la differenza. La risultante ha il verso della forza più grande.
- **Forze perpendicolari**: il modulo si trova con il teorema di Pitagora.

Nel disegno due forze tirano un blocco da parti opposte. La risultante, in verde, punta dalla parte di chi tira di più.

[[grafico:fune]]

Esempio. Due cani tirano un carrellino con due guinzagli perpendicolari: uno con 12 N, l'altro con 16 N.

~ R = \sqrt{F_1^2 + F_2^2} :: forze perpendicolari: la risultante è l'ipotenusa
~ R = \sqrt{(12\,\text{N})^2 + (16\,\text{N})^2} :: metto i moduli delle due forze
~ R = \sqrt{144 + 256}\,\text{N} = \sqrt{400}\,\text{N} :: prima i quadrati, poi la somma
~ R = \evidb{20\,\text{N}} :: meno di $12 + 16 = 28\,\text{N}$: i cani tirano in direzioni diverse

>! Le forze non si sommano come numeri. 12 N e 16 N danno 28 N solo se tirano nello stesso verso. A seconda dell'angolo, la risultante può andare da 4 N a 28 N.

?? Due bambini tirano un carrello in avanti, con 20 N e con 15 N. Un terzo bambino lo tira indietro con 25 N. Quanto vale la risultante?
[ ] 60 N
[x] 10 N in avanti
[ ] 30 N indietro
=> Le forze sulla stessa retta si sommano con il loro segno: $20 + 15 - 25 = 10\,\text{N}$. Il verso è quello in cui tirano i primi due.`
    },
    {
      id: 'massa-peso',
      titolo: 'Massa e peso',
      testo: R`Al mercato si chiede «un chilo di mele». In bagno si dice «peso 60 chili». Nella lingua di tutti i giorni massa e peso sono la stessa cosa. In fisica sono due grandezze diverse.

La **massa** $m$ dice quanta materia ha un corpo. Si misura in chilogrammi e non cambia, dovunque il corpo si trovi.

Il **peso** $P$ è una forza: quella con cui la Terra attira il corpo. È verticale e punta verso il basso. Come ogni forza, si misura in newton.

[[video:forze/massa-e-peso]]

>* Il **peso** è proporzionale alla massa: $P = m \cdot g$. Sulla Terra $g = 9{,}8\,\text{N/kg}$: ogni chilogrammo pesa 9,8 N.

Il numero $g$ è lo stesso della caduta libera: $9{,}8\,\text{N/kg}$ e $9{,}8\,\text{m/s}^2$ sono la stessa cosa. Ma $g$ cambia da un corpo celeste all'altro.

| dove | $g$ ($\text{N/kg}$) |
|---|---|
| Terra | 9,8 |
| Luna | 1,6 |
| Marte | 3,7 |
| Venere | 8,9 |

Esempio. Una valigia ha massa 20 kg. Quanto pesa sulla Terra? E sulla Luna?

~ P = m \cdot g :: il peso è la massa per $g$
~ P = 20\,\text{kg} \cdot 9{,}8\,\text{N/kg} = \evidb{196\,\text{N}} :: sulla Terra: i chilogrammi si semplificano
~ P_L = 20\,\text{kg} \cdot 1{,}6\,\text{N/kg} = \evidb{32\,\text{N}} :: sulla Luna $g$ è circa sei volte più piccolo

Nel grafico il peso cresce in proporzione alla massa: due rette per l'origine. La retta della Luna è molto meno ripida.

[[grafico:peso-luna]]

Le due grandezze si misurano con strumenti diversi. Una **bilancia a molla** sente il peso: sulla Luna segna meno. Una **bilancia a bracci** confronta il corpo con masse campione. Segna lo stesso ovunque, perché sulla Luna anche i campioni pesano meno.

>! «Peso 60 chili» è un modo di dire. 60 kg è la massa; il peso è circa 590 N.

?? Un astronauta porta sulla Luna un sacco di sabbia da 5 kg. Quanto vale lassù la sua massa?
[ ] circa 0,8 kg
[x] 5 kg
[ ] 8 N
=> La massa è la quantità di materia: non cambia andando sulla Luna. Cambia il peso, che lassù è circa $5 \cdot 1{,}6 = 8\,\text{N}$. E 8 N è una forza, non una massa.`
    },
    {
      id: 'peso-specifico',
      titolo: 'Il peso specifico',
      testo: R`Un litro d'acqua e un litro d'olio non pesano uguale. Per confrontare le sostanze serve il peso di un volume fisso: per esempio, di un metro cubo.

>* Il **peso specifico** è il peso diviso il volume: $P_s = \dfrac{P}{V}$. Si misura in newton al metro cubo, $\text{N/m}^3$.

Dal peso $P = m \cdot g$ si arriva a una formula comoda. Basta ricordare che la densità è $d = \dfrac{m}{V}$.

~ P_s = \dfrac{P}{V} = \dfrac{m \cdot g}{V} :: al posto del peso metto $m \cdot g$
~ P_s = \evid{\dfrac{m}{V}} \cdot g :: la frazione $m/V$ è la densità
~ P_s = \evidb{d \cdot g} :: il peso specifico è la densità per $g$

Esempio. L'alluminio ha densità $2700\,\text{kg/m}^3$. Il suo peso specifico è $P_s = 2700\,\text{kg/m}^3 \cdot 9{,}8\,\text{N/kg} = 26\,460\,\text{N/m}^3$. Un metro cubo di alluminio pesa più di 26 000 N.

Per l'acqua: $P_s = 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{N/kg} = 9800\,\text{N/m}^3$. Un litro d'acqua, che ha massa 1 kg, pesa 9,8 N.

>! Densità e peso specifico non sono la stessa grandezza. La densità è in $\text{kg/m}^3$ e non cambia da un pianeta all'altro. Il peso specifico è in $\text{N/m}^3$ e dipende da $g$.

> Il peso specifico tornerà nei fluidi. La spinta di Archimede è il peso specifico del liquido per il volume immerso.

?? Un blocco di legno viene portato dalla Terra alla Luna. Che cosa succede al suo peso specifico?
[ ] resta uguale, perché il legno è lo stesso
[x] diventa circa sei volte più piccolo
[ ] diventa zero
=> Il peso specifico è $d \cdot g$. La densità del legno resta la stessa, ma sulla Luna $g$ è circa sei volte più piccolo. È la densità a restare uguale.`
    },
    {
      id: 'hooke',
      titolo: 'La forza elastica e la legge di Hooke',
      testo: R`Tira un elastico o una molla: si allunga, e intanto tira la tua mano. Più tiri, più si allunga. Per questo una molla è il modo più semplice per misurare una forza.

[[video:forze/hooke]]

Si chiama **allungamento** $x$ la differenza fra la lunghezza della molla tirata e la sua lunghezza a riposo. Robert Hooke scoprì che l'allungamento cresce come la forza: forza doppia, allungamento doppio.

>* **Legge di Hooke**: la forza che allunga una molla è proporzionale all'allungamento, $F = k \cdot x$. La **costante elastica** $k$ si misura in $\text{N/m}$.

La costante $k$ dice quanto è dura la molla. Una molla dura ha $k$ grande: serve molta forza per allungarla di poco. Nel grafico forza–allungamento la molla è una retta che passa per l'origine. La sua pendenza è $k$.

[[grafico:hooke]]

Esempio. Appendo a una molla un peso di 3 N, e la molla si allunga di 6 cm. Quanto vale $k$?

~ k = \dfrac{F}{x} :: dalla legge di Hooke ricavo $k$
~ k = \dfrac{3\,\text{N}}{0{,}06\,\text{m}} :: l'allungamento va in metri: 6 cm sono 0,06 m
~ k = \evidb{50\,\text{N/m}} :: cioè 0,5 N per ogni centimetro di allungamento

La molla tira a sua volta chi la allunga, con una forza dello stesso modulo e verso opposto. È la **forza elastica**: $F_{el} = -k \cdot x$. Il segno meno dice che la molla tira sempre verso la lunghezza di riposo.

>! La legge di Hooke vale solo nel **tratto elastico**. Se si tira troppo, la molla si deforma per sempre e non torna più alla lunghezza di riposo.

>! Nella legge di Hooke $x$ è l'allungamento, non la lunghezza della molla. Alla lunghezza misurata si toglie sempre quella a riposo.

?? Una molla è lunga 10 cm a riposo. Con 2 N appesi è lunga 14 cm. Quanto è lunga con 4 N?
[ ] 28 cm
[x] 18 cm
[ ] 20 cm
=> Con 2 N l'allungamento è 4 cm; con una forza doppia è doppio, 8 cm. La molla è lunga $10 + 8 = 18\,\text{cm}$. Raddoppia l'allungamento, non la lunghezza.`
    },
    {
      id: 'dinamometro',
      titolo: 'Il dinamometro: misurare le forze',
      testo: R`Il **dinamometro** è lo strumento che misura le forze. Dentro c'è una molla, con un indice che scorre lungo una scala. Si aggancia il corpo e si legge la forza in newton.

>* Il **dinamometro** è una molla con una scala in newton. Funziona grazie alla legge di Hooke: l'allungamento è proporzionale alla forza.

Per questo le tacche della scala sono **equidistanti**. Se 1 N allunga la molla di 2 cm, 2 N la allungano di 4 cm. E 3 N la allungano di 6 cm.

Per costruire la scala si fa la **taratura**. Si appendono masse note e si segna dove arriva l'indice. Una massa di 100 g pesa $0{,}1\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 0{,}98\,\text{N}$, quasi un newton.

Ogni dinamometro ha una **portata**: la forza più grande che può misurare. Oltre la portata la molla esce dal tratto elastico e si rovina. Ha anche una **sensibilità**: la differenza di forza fra due tacche vicine.

Esempio. Un dinamometro ha una molla con $k = 200\,\text{N/m}$ e una portata di 10 N. Quanto è lunga la sua scala?

~ x = \dfrac{F}{k} :: dalla legge di Hooke ricavo l'allungamento
~ x = \dfrac{10\,\text{N}}{200\,\text{N/m}} :: alla portata la molla è allungata al massimo
~ x = 0{,}05\,\text{m} = \evidb{5\,\text{cm}} :: la scala è lunga 5 cm: mezzo centimetro per newton

A parità di portata, una molla più dura dà una scala più corta, con le tacche più fitte. Per misurare bene le forze piccole serve una molla morbida.

> La bilancia pesapersone misura una forza: il peso. Il numero in chilogrammi lo ricava dividendo per 9,8. Sulla Luna sbaglierebbe.

?? Appendi una grossa mela a un dinamometro e leggi 2,94 N. Qual è la massa della mela?
[ ] 2,94 kg
[x] 0,3 kg
[ ] 29 kg
=> Dal peso alla massa si divide per $g$: $m = \dfrac{2{,}94\,\text{N}}{9{,}8\,\text{N/kg}} = 0{,}3\,\text{kg}$. Moltiplicare per 9,8 darebbe un numero senza senso.`
    },
    {
      id: 'normale',
      titolo: 'La forza normale',
      testo: R`Un libro appoggiato sul tavolo non cade, eppure il suo peso lo tira giù. Vuol dire che c'è un'altra forza, verso l'alto, che lo trattiene. È il tavolo che spinge il libro.

Il tavolo si piega un pochino sotto il libro, anche se non si vede. Come una molla molto dura, reagisce spingendo verso l'alto.

>* Un piano su cui un corpo è appoggiato esercita una **reazione vincolare**. La sua parte perpendicolare al piano si chiama **forza normale** $N$: «normale» vuol dire perpendicolare.

Su un piano orizzontale, se nessun altro spinge, la forza normale è uguale al peso: $N = P$. Le due forze si fanno equilibrio e il libro resta fermo.

Se però premi il libro con la mano, il tavolo deve reggere anche la tua spinta. La forza normale cresce: $N = P + F$.

[[grafico:libro]]

~ N = P + F :: il tavolo regge il peso e la spinta della mano
~ N = 12\,\text{N} + 6\,\text{N} :: un libro da 12 N, e la mano che preme con 6 N
~ N = \evidb{18\,\text{N}} :: più del peso: il tavolo spinge di più

Se invece tiri il libro verso l'alto senza staccarlo, la forza normale cala: $N = P - F$.

>! La forza normale non è sempre uguale al peso. Lo è solo su un piano orizzontale, quando nessun'altra forza spinge o tira in verticale.

> La forza normale serve per l'attrito. Più un corpo è premuto sul piano, più è difficile farlo scivolare.

?? Una scatola da 10 N è sul tavolo. La tiri verso l'alto con un filo, con 4 N, ma non si stacca. Quanto vale la forza normale?
[ ] 14 N
[x] 6 N
[ ] 10 N
=> Il filo regge una parte del peso, e il tavolo regge solo il resto: $N = 10\,\text{N} - 4\,\text{N} = 6\,\text{N}$.`
    },
    {
      id: 'attrito-statico',
      titolo: 'L\'attrito statico',
      testo: R`Spingi un armadio pesante, e non si muove. Spingi più forte, e ancora niente. Eppure la tua forza c'è: qualcosa la annulla.

È il pavimento. Viste al microscopio, le superfici sono piene di piccole sporgenze che si incastrano. Ne nasce una forza parallela al pavimento, contraria alla spinta: l'**attrito**.

[[video:forze/attrito]]

Finché il corpo è fermo, l'attrito si chiama **statico**. Si adatta alla spinta: è uguale e opposto, e la risultante resta zero. Ma non può crescere quanto vuole.

>* L'**attrito statico** è uguale e opposto alla spinta, fino a un valore massimo: $F_{s,\text{max}} = \mu_s \cdot N$. Il numero puro $\mu_s$ è il **coefficiente di attrito statico**.

Il coefficiente dipende dai due materiali e da come sono le superfici. Non ha unità di misura: è il rapporto fra due forze.

Esempio. Un armadio pesa 600 N e sta su un pavimento con $\mu_s = 0{,}4$. Quanta forza serve per farlo partire?

~ N = P = 600\,\text{N} :: pavimento orizzontale, nessun'altra forza verticale
~ F_{s,\text{max}} = \mu_s \cdot N :: l'attrito statico non può superare questo valore
~ F_{s,\text{max}} = 0{,}4 \cdot 600\,\text{N} = \evidb{240\,\text{N}} :: con meno di 240 N l'armadio resta fermo

Con 150 N l'armadio non si muove, e l'attrito vale 150 N. Solo oltre 240 N l'armadio parte.

Nel disegno c'è una cassa con la sua spinta. Finché la cassa è ferma, l'attrito cresce insieme alla spinta. Superato il massimo, la cassa parte e la risultante non è più zero.

[[grafico:cassa]]

>! L'attrito statico non vale sempre $\mu_s \cdot N$: quello è il massimo. Se spingi poco, l'attrito è piccolo quanto la tua spinta.

?? Una cassa ferma può avere al massimo 300 N di attrito statico. La spingi con 90 N. Quanto vale l'attrito?
[ ] 300 N
[x] 90 N
[ ] zero
=> La cassa resta ferma, quindi la risultante è zero. L'attrito è uguale e opposto alla spinta, 90 N. I 300 N sono solo il massimo.`
    },
    {
      id: 'attrito-dinamico',
      titolo: 'L\'attrito dinamico',
      testo: R`Quando l'armadio finalmente parte, spingerlo diventa un po' più facile. Lo sa chi ha fatto un trasloco: il difficile è smuoverlo.

>* Quando un corpo scivola su una superficie agisce l'**attrito dinamico**, opposto al moto relativo delle due superfici: $F_d = \mu_d \cdot N$. Di solito il coefficiente $\mu_d$ è più piccolo di $\mu_s$.

Per l'armadio di prima, con $\mu_d = 0{,}3$:

~ F_d = \mu_d \cdot N :: l'attrito dinamico, con il corpo in movimento
~ F_d = 0{,}3 \cdot 600\,\text{N} = \evidb{180\,\text{N}} :: meno dei 240 N che servivano per farlo partire

Se lo spingi con 180 N, le forze orizzontali si fanno equilibrio: l'armadio scivola a velocità costante. Se lo spingi di più, accelera. Se smetti di spingere, l'attrito lo ferma.

Nel grafico c'è l'attrito su una cassa, al crescere della spinta. Prima sale insieme alla spinta. Poi la cassa parte, e l'attrito scende al valore dinamico.

[[grafico:attrito]]

L'attrito dinamico ha due proprietà sorprendenti. Quasi non dipende dalla velocità. E quasi non dipende dall'area di contatto: conta quanto il corpo è premuto, cioè $N$.

| superfici | $\mu_s$ | $\mu_d$ |
|---|---|---|
| gomma su cemento asciutto | 1,0 | 0,8 |
| acciaio su acciaio | 0,7 | 0,6 |
| legno su legno | 0,35 | 0,3 |
| ghiaccio su ghiaccio | 0,1 | 0,03 |
| teflon su acciaio | 0,04 | 0,04 |

> Sono valori indicativi: cambiano molto con lo stato delle superfici, con la polvere, con l'acqua.

Le ruote invece rotolano senza strisciare. L'**attrito volvente** è molto più piccolo di quello dinamico. Per questo un carrello si spinge con poca fatica.

>! L'attrito non è solo un fastidio. Senza attrito non si potrebbe camminare, né frenare, né tenere in mano un bicchiere.

?? Spingi l'armadio con 180 N e scivola a velocità costante. Quanto vale la risultante delle forze orizzontali?
[ ] 180 N in avanti
[x] zero
[ ] 240 N in avanti
=> La spinta (180 N) e l'attrito dinamico (180 N) sono uguali e opposti: la risultante è zero. A velocità costante non serve una forza in più: basta pareggiare l'attrito.`
    }
  ],
  grafici: {
    /* tiro alla fune: due forze opposte sulla stessa retta e la loro risultante (forze arancio, risultato verde) */
    fune: {
      tipo: 'piano', x: [-8, 8], y: [-3.4, 2.2], altezza: 300, assi: false, passo: [1, 1],
      parametri: [
        { nome: 'F1', min: 0, max: 300, passo: 10, valore: 200, etichetta: 'F_1 (N)' },
        { nome: 'F2', min: 0, max: 300, passo: 10, valore: 150, etichetta: 'F_2 (N)' }
      ],
      elementi: [
        { tipo: 'poligono', punti: [[-1, -0.7], [1, -0.7], [1, 0.7], [-1, 0.7]], colore: 'grigio' },
        { tipo: 'vettore', da: [1, 0], a: ['1 + F1/50', 0], etichetta: 'F_1', colore: 2 },
        { tipo: 'vettore', da: [-1, 0], a: ['-1 - F2/50', 0], etichetta: 'F_2', colore: 2 },
        { tipo: 'vettore', da: [0, -2], a: ['(F1 - F2)/50', -2], etichetta: 'R', colore: 3, spessore: 3.4 },
        { tipo: 'testo', p: [7.8, 1.6], testo: 'R = {{abs(F1 - F2)}} N', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Due forze opposte su un blocco (un quadretto = 50 N). La risultante R, in verde, è la differenza dei moduli e punta dalla parte della forza più grande. Con F₁ = F₂ è zero: equilibrio.'
    },
    /* il peso è proporzionale alla massa: Terra e Luna (due forze: stesso colore, la Luna tratteggiata) */
    'peso-luna': {
      tipo: 'piano', x: [0, 105], y: [0, 1000], altezza: 380,
      etichette: { x: 'm (kg)', y: 'P (N)' },
      funzioni: [
        { f: '9.8*x', colore: 2, etichetta: 'Terra' },
        { f: '1.6*x', colore: 2, tratteggio: true, etichetta: 'Luna' }
      ],
      didascalia: 'Il peso in funzione della massa: P = m·g. Sulla Terra (linea piena) g = 9,8 N/kg, sulla Luna (tratteggio) g ≈ 1,6 N/kg. Passa il dito sul grafico per leggere i valori.'
    },
    /* la legge di Hooke: retta per l'origine, pendenza k */
    hooke: {
      tipo: 'piano', x: [0, 20], y: [0, 16], altezza: 380,
      etichette: { x: 'x (cm)', y: 'F (N)' },
      parametri: [{ nome: 'k', min: 20, max: 80, passo: 5, valore: 50, etichetta: 'k (N/m)' }],
      funzioni: [{ f: 'k*x/100', colore: 2, etichetta: 'F = k·x' }],
      elementi: [
        { tipo: 'punto', p: [10, 'k/10'], etichetta: '10 cm → {{k/10}} N', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'testo', p: [10, 14.5], testo: 'k = {{k}} N/m', colore: 2 }
      ],
      didascalia: 'La forza che allunga la molla in funzione dell\'allungamento (in centimetri). Con k più grande la molla è più dura e la retta più ripida. Passa il dito sul grafico per leggere i valori.'
    },
    /* il libro sul tavolo: peso, spinta della mano, forza normale (tutte forze: arancio) */
    libro: {
      tipo: 'piano', x: [-6, 6], y: [-3.8, 7.6], altezza: 480, assi: false, passo: [1, 1],
      parametri: [{ nome: 'F', min: 0, max: 12, passo: 1, valore: 6, etichetta: 'F (N)' }],
      elementi: [
        { tipo: 'segmento', da: [-6, 0], a: [6, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-2, 0], [2, 0], [2, 1.2], [-2, 1.2]], colore: 'grigio' },
        { tipo: 'vettore', da: [0, 0.6], a: [0, -2.4], etichetta: 'P = 12 N', colore: 2 },
        { tipo: 'vettore', da: [-1.2, '1.2 + F/4'], a: [-1.2, 1.2], colore: 2 },
        { tipo: 'testo', p: [-1.5, '1.5 + F/4'], testo: 'F = {{F}} N', ancora: 'end', colore: 2 },
        { tipo: 'vettore', da: [1.2, 0], a: [1.2, '(12 + F)/4'], etichetta: 'N = {{12 + F}} N', colore: 2, posizione: 'destra' }
      ],
      didascalia: 'Un libro da 12 N sul tavolo, premuto dall\'alto con la mano (un quadretto = 4 N). La forza normale del tavolo regge il peso e la spinta: N = P + F.'
    },
    /* la cassa spinta: l'attrito statico segue la spinta fino a 120 N, poi la cassa parte e resta l'attrito dinamico, 80 N */
    cassa: {
      tipo: 'piano', x: [-7, 7], y: [-4.6, 5.6], altezza: 440, assi: false, passo: [1, 1],
      parametri: [{ nome: 'F', min: 10, max: 160, passo: 10, valore: 60, etichetta: 'spinta (N)' }],
      elementi: [
        { tipo: 'segmento', da: [-7, 0], a: [7, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-1.5, 0], [1.5, 0], [1.5, 2], [-1.5, 2]], colore: 'grigio' },
        { tipo: 'vettore', da: [-0.4, 1], a: [-0.4, -4], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: [0.5, 0], a: [0.5, 5], etichetta: 'N', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: ['-1.5 - F/40', 1.4], a: [-1.5, 1.4], colore: 2 },
        { tipo: 'testo', p: [-1.8, 2.1], testo: 'spinta', ancora: 'end', colore: 2 },
        { tipo: 'vettore', da: [-1.5, 0], a: ['-1.5 - se(F <= 120, F, 80)/40', 0], colore: 2 },
        { tipo: 'testo', p: [-1.8, -0.75], testo: 'attrito', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [6.8, 5], testo: 'attrito = {{se(F <= 120, F, 80)}} N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [6.8, 4.1], testo: 'risultante = {{se(F <= 120, 0, F - 80)}} N', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una cassa con P = N = 200 N, μs = 0,6 e μd = 0,4 (un quadretto = 40 N). Fino a 120 N l\'attrito statico è uguale alla spinta e la cassa resta ferma. Oltre, la cassa parte: l\'attrito scende a 80 N e la risultante non è più zero.'
    },
    /* l'attrito in funzione della spinta: sale fino al massimo statico, poi crolla al valore dinamico */
    attrito: {
      tipo: 'piano', x: [0, 200], y: [0, 140], altezza: 360,
      etichette: { x: 'spinta (N)', y: 'attrito (N)' },
      funzioni: [{ f: 'se(x <= 120, x, 80)', colore: 2 }],
      elementi: [
        { tipo: 'segmento', da: [120, 120], a: [120, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [120, 120], etichetta: 'massimo: 120 N', posizione: 'destra', colore: 'grigio' },
        { tipo: 'testo', p: [196, 90], testo: 'dinamico: 80 N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [70, 22], testo: 'cassa ferma' },
        { tipo: 'testo', p: [162, 50], testo: 'scivola' }
      ],
      didascalia: 'La stessa cassa (N = 200 N, μs = 0,6, μd = 0,4). Da ferma l\'attrito è uguale alla spinta, fino a 120 N. Quando la cassa parte l\'attrito diventa dinamico, 80 N, e non cresce più. Passa il dito sul grafico per leggere i valori.'
    }
  },
  esempi: [
    {
      titolo: 'Il peso su Marte',
      problema: R`Un ragazzo ha massa 45 kg. Quanto pesa sulla Terra? Quanto peserebbe su Marte, dove $g = 3{,}7\,\text{N/kg}$? E quanto vale lassù la sua massa?`,
      passi: [
        R`Dati: $m = 45\,\text{kg}$, $g_T = 9{,}8\,\text{N/kg}$, $g_M = 3{,}7\,\text{N/kg}$. Cerco il peso $P_T$ sulla Terra, il peso $P_M$ su Marte e la massa su Marte.`,
        R`Sulla Terra: $P_T = m \cdot g_T = 45\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 441\,\text{N}$.`,
        R`Su Marte: $P_M = m \cdot g_M = 45\,\text{kg} \cdot 3{,}7\,\text{N/kg} = 166{,}5\,\text{N}$.`,
        R`La massa è la quantità di materia: su Marte resta $45\,\text{kg}$.`,
        R`Controllo: $9{,}8 : 3{,}7 \approx 2{,}65$, quindi su Marte il peso è circa 2,65 volte più piccolo. $441 : 2{,}65 \approx 166$. Torna.`
      ],
      risultato: R`$P_T = 441\,\text{N}$, $P_M = 166{,}5\,\text{N}$; la massa resta $45\,\text{kg}$.`
    },
    {
      titolo: 'Due corde perpendicolari',
      problema: R`Due ragazzi spostano una cassa con due corde. Uno tira verso est con 50 N, l'altro verso nord con 120 N. Quanto vale la forza risultante?`,
      passi: [
        R`Dati: $F_1 = 50\,\text{N}$ verso est, $F_2 = 120\,\text{N}$ verso nord. Cerco il modulo $R$ della risultante.`,
        R`Le due forze sono perpendicolari. Messe punta-coda formano i cateti di un triangolo rettangolo, e la risultante è l'ipotenusa.`,
        R`Con Pitagora: $R = \sqrt{(50\,\text{N})^2 + (120\,\text{N})^2} = \sqrt{2500 + 14\,400}\,\text{N} = \sqrt{16\,900}\,\text{N}$.`,
        R`La radice vale $130$: $R = 130\,\text{N}$, in una direzione fra nord ed est, più vicina al nord.`,
        R`Controllo: la risultante deve stare fra $120 - 50 = 70\,\text{N}$ e $120 + 50 = 170\,\text{N}$. 130 N ci sta.`
      ],
      risultato: R`$R = 130\,\text{N}$`
    },
    {
      titolo: 'La costante di una molla',
      problema: R`Appendi a una molla una massa di 0,5 kg, e la molla si allunga di 7 cm. Quanto vale la costante elastica? Di quanto si allunga con una massa di 1,2 kg?`,
      passi: [
        R`Dati: $m_1 = 0{,}5\,\text{kg}$, $x_1 = 7\,\text{cm} = 0{,}07\,\text{m}$, $m_2 = 1{,}2\,\text{kg}$. Cerco $k$ e l'allungamento $x_2$.`,
        R`La forza che allunga la molla è il peso: $F_1 = m_1 \cdot g = 0{,}5\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 4{,}9\,\text{N}$.`,
        R`Dalla legge di Hooke: $k = \dfrac{F_1}{x_1} = \dfrac{4{,}9\,\text{N}}{0{,}07\,\text{m}} = 70\,\text{N/m}$.`,
        R`Con 1,2 kg la forza è $F_2 = 1{,}2\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 11{,}76\,\text{N}$, e $x_2 = \dfrac{F_2}{k} = \dfrac{11{,}76\,\text{N}}{70\,\text{N/m}} = 0{,}168\,\text{m} = 16{,}8\,\text{cm}$.`,
        R`Controllo: la massa è 2,4 volte più grande, quindi anche l'allungamento. $7\,\text{cm} \cdot 2{,}4 = 16{,}8\,\text{cm}$. Torna.`
      ],
      risultato: R`$k = 70\,\text{N/m}$; con 1,2 kg la molla si allunga di $16{,}8\,\text{cm}$.`
    },
    {
      titolo: 'Che cosa c\'è nel sacchetto?',
      problema: R`La molla di un dinamometro ha $k = 400\,\text{N/m}$. Appendi un sacchetto e la molla si allunga di 3 cm. Quanto pesa il sacchetto? Che massa ha?`,
      passi: [
        R`Dati: $k = 400\,\text{N/m}$, $x = 3\,\text{cm} = 0{,}03\,\text{m}$. Cerco il peso $P$ e la massa $m$.`,
        R`Il dinamometro misura la forza con la legge di Hooke: $P = k \cdot x = 400\,\text{N/m} \cdot 0{,}03\,\text{m} = 12\,\text{N}$.`,
        R`Dal peso alla massa si divide per $g$: $m = \dfrac{P}{g} = \dfrac{12\,\text{N}}{9{,}8\,\text{N/kg}} \approx 1{,}22\,\text{kg}$.`,
        R`Controllo: $1{,}22\,\text{kg} \cdot 9{,}8\,\text{N/kg} \approx 12\,\text{N}$. Torna.`
      ],
      risultato: R`Il sacchetto pesa $12\,\text{N}$ e ha massa $m \approx 1{,}22\,\text{kg}$.`
    },
    {
      titolo: 'Lo scatolone che non parte',
      problema: R`Uno scatolone di 25 kg è sul pavimento. I coefficienti di attrito sono $\mu_s = 0{,}45$ e $\mu_d = 0{,}35$. Lo spingi in orizzontale con 100 N: parte? E con 120 N? Una volta partito, quanta forza serve per tenerlo a velocità costante?`,
      passi: [
        R`Dati: $m = 25\,\text{kg}$, $\mu_s = 0{,}45$, $\mu_d = 0{,}35$, spinte di 100 N e di 120 N. Cerco se parte, e la spinta per la velocità costante.`,
        R`Pavimento orizzontale e spinta orizzontale: la forza normale è il peso. $N = m \cdot g = 25\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 245\,\text{N}$.`,
        R`Attrito statico massimo: $F_{s,\text{max}} = \mu_s \cdot N = 0{,}45 \cdot 245\,\text{N} \approx 110\,\text{N}$.`,
        R`Con 100 N la spinta è sotto il massimo: lo scatolone resta fermo, e l'attrito vale proprio 100 N. Con 120 N il massimo è superato: lo scatolone parte.`,
        R`In movimento c'è l'attrito dinamico: $F_d = \mu_d \cdot N = 0{,}35 \cdot 245\,\text{N} \approx 86\,\text{N}$. Con una spinta di 86 N le forze orizzontali si fanno equilibrio e la velocità resta costante.`,
        R`Controllo: $86\,\text{N}$ è meno di $110\,\text{N}$, come deve essere perché $\mu_d < \mu_s$.`
      ],
      risultato: R`Con 100 N resta fermo, con 120 N parte; poi bastano circa $86\,\text{N}$.`
    },
    {
      titolo: 'Il libro tenuto contro il muro',
      problema: R`Tieni un libro di 6 N premuto contro un muro con la mano, spingendo in orizzontale. Fra libro e muro $\mu_s = 0{,}4$. Con quanta forza, almeno, devi premere perché il libro non scivoli giù?`,
      passi: [
        R`Dati: $P = 6\,\text{N}$, $\mu_s = 0{,}4$. Cerco la spinta minima $F$ della mano.`,
        R`La mano preme il libro contro il muro, e il muro risponde con la forza normale. Qui la normale è orizzontale: $N = F$.`,
        R`In verticale il peso tira giù. Lo regge l'attrito statico, verso l'alto, che deve valere $6\,\text{N}$.`,
        R`L'attrito statico non può superare $\mu_s \cdot N = 0{,}4 \cdot F$. Serve quindi $0{,}4 \cdot F \ge 6\,\text{N}$, cioè $F \ge \dfrac{6\,\text{N}}{0{,}4} = 15\,\text{N}$.`,
        R`Controllo: con $F = 15\,\text{N}$ l'attrito massimo è $0{,}4 \cdot 15 = 6\,\text{N}$, proprio il peso del libro. Con meno, il libro scivola.`
      ],
      risultato: R`Bisogna premere con almeno $15\,\text{N}$.`
    }
  ],
  formulario: [
    { nome: 'Peso', formula: R`P = m \cdot g`, nota: R`Sulla Terra $g = 9{,}8\,\text{N/kg}$, sulla Luna circa $1{,}6\,\text{N/kg}$. La massa non cambia, il peso sì.` },
    { nome: 'Risultante sulla stessa retta', formula: R`R = F_1 + F_2 \qquad R = F_1 - F_2`, nota: R`La prima per forze con lo stesso verso, la seconda per versi opposti (verso della forza più grande).` },
    { nome: 'Risultante di forze perpendicolari', formula: R`R = \sqrt{F_1^2 + F_2^2}`, nota: R`Teorema di Pitagora: le due forze sono i cateti, la risultante è l'ipotenusa.` },
    { nome: 'Peso specifico', formula: R`P_s = \dfrac{P}{V} = d \cdot g`, nota: R`In $\text{N/m}^3$. Per l'acqua $9800\,\text{N/m}^3$. La densità $d$ è in $\text{kg/m}^3$.` },
    { nome: 'Legge di Hooke', formula: R`F = k \cdot x`, nota: R`$x$ è l'allungamento (lunghezza meno lunghezza a riposo); vale solo nel tratto elastico.` },
    { nome: 'Costante elastica e allungamento', formula: R`k = \dfrac{F}{x} \qquad x = \dfrac{F}{k}`, nota: R`$k$ in $\text{N/m}$: con $x$ in metri. Molla dura, $k$ grande.` },
    { nome: 'Forza elastica della molla', formula: R`F_{el} = -k \cdot x`, nota: R`La molla tira verso la lunghezza di riposo, in verso opposto all'allungamento.` },
    { nome: 'Forza normale su un piano orizzontale', formula: R`N = P \qquad N = P + F`, nota: R`La prima se nessun altro spinge; la seconda se una forza $F$ preme il corpo verso il basso.` },
    { nome: 'Attrito statico', formula: R`F_s \le \mu_s \cdot N`, nota: R`È uguale e opposto alla spinta, fino al massimo $F_{s,\text{max}} = \mu_s \cdot N$.` },
    { nome: 'Attrito dinamico', formula: R`F_d = \mu_d \cdot N`, nota: R`Opposto al moto; di solito $\mu_d < \mu_s$. Quasi non dipende da velocità e area di contatto.` },
    { nome: 'Coefficienti di attrito', formula: R`\mu_s = \dfrac{F_{s,\text{max}}}{N} \qquad \mu_d = \dfrac{F_d}{N}`, nota: R`Numeri puri, senza unità: sono rapporti fra due forze.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'forza', tipo: 'definizione', fronte: R`Che cos'è una **forza**?`, retro: R`Un'azione che può deformare un corpo o cambiarne la velocità. È un vettore e si misura in newton (N).` },
    { id: 'fc-02', sezione: 'forza', tipo: 'concetto', fronte: R`Serve una forza per tenere in moto un corpo?`, retro: R`No. Senza forze un corpo in moto continua a muoversi in linea retta, a velocità costante. Rallenta solo perché l'attrito, che è una forza, lo frena.` },
    { id: 'fc-03', sezione: 'forza', tipo: 'concetto', fronte: R`Forze di contatto e forze a distanza: un esempio per tipo.`, retro: R`Di contatto: la spinta di una mano, la tensione di una corda, l'attrito. A distanza: il peso, la forza di una calamita.` },
    { id: 'fc-04', sezione: 'risultante', tipo: 'definizione', fronte: R`Che cos'è la **forza risultante**?`, retro: R`La somma vettoriale di tutte le forze che agiscono su un corpo. Se è zero, le forze si fanno equilibrio.` },
    { id: 'fc-05', sezione: 'risultante', tipo: 'procedura', fronte: R`Come si somma una forza di 3 N con una di 4 N perpendicolare?`, retro: R`Con Pitagora: $R = \sqrt{3^2 + 4^2}\,\text{N} = 5\,\text{N}$. Non 7 N: quello vale solo con lo stesso verso.` },
    { id: 'fc-06', sezione: 'massa-peso', tipo: 'concetto', fronte: R`Che differenza c'è fra **massa** e **peso**?`, retro: R`La massa è la quantità di materia, in kg, e non cambia. Il peso è la forza con cui il pianeta attira il corpo, in N, e dipende da dove si è.` },
    { id: 'fc-07', sezione: 'massa-peso', tipo: 'formula', fronte: R`Formula del **peso**`, retro: R`$P = m \cdot g$, con $g = 9{,}8\,\text{N/kg}$ sulla Terra.` },
    { id: 'fc-08', sezione: 'massa-peso', tipo: 'concetto', fronte: R`Che cosa misura una bilancia a bracci? E una bilancia a molla?`, retro: R`La bilancia a bracci confronta le masse: segna lo stesso anche sulla Luna. La bilancia a molla sente il peso: sulla Luna segna meno.` },
    { id: 'fc-09', sezione: 'massa-peso', tipo: 'concetto', fronte: R`Quanto vale $g$ sulla Luna?`, retro: R`Circa $1{,}6\,\text{N/kg}$: circa sei volte meno che sulla Terra. Lassù si pesa circa un sesto.` },
    { id: 'fc-10', sezione: 'peso-specifico', tipo: 'formula', fronte: R`Formula del **peso specifico**`, retro: R`$P_s = \dfrac{P}{V} = d \cdot g$, in $\text{N/m}^3$. Per l'acqua $9800\,\text{N/m}^3$.` },
    { id: 'fc-11', sezione: 'hooke', tipo: 'formula', fronte: R`La **legge di Hooke**`, retro: R`$F = k \cdot x$: la forza è proporzionale all'allungamento. $k$ è la costante elastica, in $\text{N/m}$.` },
    { id: 'fc-12', sezione: 'hooke', tipo: 'definizione', fronte: R`Che cos'è l'**allungamento** $x$ di una molla?`, retro: R`La lunghezza della molla tirata meno la sua lunghezza a riposo.` },
    { id: 'fc-13', sezione: 'hooke', tipo: 'concetto', fronte: R`Che cosa dice la **costante elastica** $k$?`, retro: R`Quanto è dura la molla: con $k$ grande serve molta forza per allungarla di poco. Nel grafico forza–allungamento è la pendenza.` },
    { id: 'fc-14', sezione: 'hooke', tipo: 'concetto', fronte: R`Quando smette di valere la legge di Hooke?`, retro: R`Fuori dal tratto elastico: se la molla viene tirata troppo, si deforma per sempre e non torna alla lunghezza di riposo.` },
    { id: 'fc-15', sezione: 'dinamometro', tipo: 'definizione', fronte: R`Che cos'è un **dinamometro**?`, retro: R`Uno strumento per misurare le forze: una molla con una scala in newton, che funziona grazie alla legge di Hooke.` },
    { id: 'fc-16', sezione: 'dinamometro', tipo: 'concetto', fronte: R`Perché le tacche del dinamometro sono equidistanti?`, retro: R`Perché l'allungamento della molla è proporzionale alla forza: ogni newton in più allunga la molla della stessa quantità.` },
    { id: 'fc-17', sezione: 'normale', tipo: 'definizione', fronte: R`Che cos'è la **forza normale**?`, retro: R`La forza con cui un piano spinge un corpo appoggiato, perpendicolare al piano. Su un piano orizzontale, senza altre forze verticali, vale quanto il peso.` },
    { id: 'fc-18', sezione: 'normale', tipo: 'concetto', fronte: R`Premi un libro sul tavolo con la mano. Che cosa succede alla forza normale?`, retro: R`Cresce: il tavolo regge il peso e anche la spinta, $N = P + F$.` },
    { id: 'fc-19', sezione: 'attrito-statico', tipo: 'concetto', fronte: R`Quanto vale l'**attrito statico** su una cassa ferma spinta con 50 N?`, retro: R`50 N, nel verso opposto: si adatta alla spinta. Può crescere solo fino al massimo $\mu_s \cdot N$.` },
    { id: 'fc-20', sezione: 'attrito-statico', tipo: 'formula', fronte: R`L'attrito statico **massimo**`, retro: R`$F_{s,\text{max}} = \mu_s \cdot N$. Una spinta più grande fa partire il corpo.` },
    { id: 'fc-21', sezione: 'attrito-dinamico', tipo: 'formula', fronte: R`L'**attrito dinamico**`, retro: R`$F_d = \mu_d \cdot N$, opposto al moto. Di solito $\mu_d < \mu_s$: per far partire un corpo serve più forza che per tenerlo in moto.` },
    { id: 'fc-22', sezione: 'attrito-dinamico', tipo: 'concetto', fronte: R`Da che cosa **non** dipende, quasi, l'attrito dinamico?`, retro: R`Dalla velocità e dall'area di contatto. Dipende dai materiali ($\mu_d$) e da quanto il corpo è premuto ($N$).` },
    { id: 'fc-23', sezione: 'attrito-dinamico', tipo: 'procedura', fronte: R`Come si trova la spinta che tiene una cassa a velocità costante?`, retro: R`Si calcola $N$ (sul piano orizzontale, il peso) e poi $F_d = \mu_d \cdot N$. La spinta deve essere uguale all'attrito dinamico.` },
    { id: 'fc-24', sezione: 'forza', tipo: 'concetto', fronte: R`Quali sono le quattro **interazioni fondamentali**?`, retro: R`Gravitazionale, elettromagnetica, nucleare forte e nucleare debole. Le forze di tutti i giorni vengono dalle prime due.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Quanto pesa sulla Terra un corpo di massa 3 kg?`, suggerimenti: [R`$P = m \cdot g$, con $g = 9{,}8\,\text{N/kg}$.`], risposta: { tipo: 'numero', valore: 29.4, unita: 'N' }, soluzione: [R`$P = 3\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 29{,}4\,\text{N}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un corpo pesa 98 N sulla Terra. Qual è la sua massa?`, suggerimenti: [R`Dal peso alla massa si divide per $g$.`], risposta: { tipo: 'numero', valore: 10, unita: 'kg' }, soluzione: [R`$m = \dfrac{P}{g} = \dfrac{98\,\text{N}}{9{,}8\,\text{N/kg}} = 10\,\text{kg}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Quanto pesa sulla Luna un corpo di massa 15 kg? Sulla Luna $g = 1{,}6\,\text{N/kg}$.`, suggerimenti: [R`Stessa formula $P = m \cdot g$, con il $g$ della Luna.`], risposta: { tipo: 'numero', valore: 24, unita: 'N' }, soluzione: [R`$P = 15\,\text{kg} \cdot 1{,}6\,\text{N/kg} = 24\,\text{N}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Due persone spingono un'auto in panne nello stesso verso, con 45 N e con 30 N. Quanto vale la forza risultante?`, suggerimenti: [R`Stessa direzione e stesso verso: i moduli si sommano.`], risposta: { tipo: 'numero', valore: 75, unita: 'N' }, soluzione: [R`$R = 45\,\text{N} + 30\,\text{N} = 75\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Nel tiro alla fune una squadra tira con 70 N, l'altra con 45 N in verso opposto. Quanto vale il modulo della risultante?`, suggerimenti: [R`Versi opposti: si fa la differenza.`], risposta: { tipo: 'numero', valore: 25, unita: 'N' }, soluzione: [R`$R = 70\,\text{N} - 45\,\text{N} = 25\,\text{N}$, dalla parte della squadra più forte.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Su un corpo agiscono due forze perpendicolari, da 8 N e da 15 N. Quanto vale la risultante?`, suggerimenti: [R`Forze perpendicolari: teorema di Pitagora.`], risposta: { tipo: 'numero', valore: 17, unita: 'N' }, soluzione: [R`$R = \sqrt{8^2 + 15^2}\,\text{N} = \sqrt{64 + 225}\,\text{N} = \sqrt{289}\,\text{N} = 17\,\text{N}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`Su una cassa agiscono tre forze orizzontali: 50 N verso destra, 15 N verso destra e 30 N verso sinistra. Quanto vale il modulo della risultante?`, suggerimenti: [R`Scegli come positivo il verso destro: le forze verso sinistra hanno il segno meno.`], risposta: { tipo: 'numero', valore: 35, unita: 'N' }, soluzione: [R`$R = 50\,\text{N} + 15\,\text{N} - 30\,\text{N} = 35\,\text{N}$, verso destra.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una molla ha costante elastica $k = 80\,\text{N/m}$. Che forza serve per allungarla di 0,05 m?`, suggerimenti: [R`Legge di Hooke: $F = k \cdot x$.`], risposta: { tipo: 'numero', valore: 4, unita: 'N' }, soluzione: [R`$F = 80\,\text{N/m} \cdot 0{,}05\,\text{m} = 4\,\text{N}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Una forza di 9 N allunga una molla di 0,15 m. Quanto vale la costante elastica?`, suggerimenti: [R`$k = \dfrac{F}{x}$.`], risposta: { tipo: 'numero', valore: 60, unita: 'N/m' }, soluzione: [R`$k = \dfrac{9\,\text{N}}{0{,}15\,\text{m}} = 60\,\text{N/m}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una molla ha $k = 300\,\text{N/m}$. Di quanto si allunga se la tiri con 27 N?`, suggerimenti: [R`Dalla legge di Hooke: $x = \dfrac{F}{k}$.`], risposta: { tipo: 'numero', valore: 0.09, unita: 'm' }, soluzione: [R`$x = \dfrac{27\,\text{N}}{300\,\text{N/m}} = 0{,}09\,\text{m} = 9\,\text{cm}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Una molla è lunga 25 cm a riposo e ha $k = 250\,\text{N/m}$. Quanto è lunga quando la tiri con 15 N?`, suggerimenti: [R`Calcola prima l'allungamento con $x = \dfrac{F}{k}$.`, R`Poi aggiungilo alla lunghezza a riposo.`], risposta: { tipo: 'numero', valore: 31, unita: 'cm' }, soluzione: [R`$x = \dfrac{15\,\text{N}}{250\,\text{N/m}} = 0{,}06\,\text{m} = 6\,\text{cm}$.`, R`Lunghezza: $25\,\text{cm} + 6\,\text{cm} = 31\,\text{cm}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Con 2 N una molla si allunga di 5 cm. Di quanto si allunga con 6 N, restando nel tratto elastico?`, suggerimenti: [R`L'allungamento è proporzionale alla forza: forza tripla, allungamento triplo.`], risposta: { tipo: 'numero', valore: 15, unita: 'cm' }, soluzione: [R`6 N è il triplo di 2 N, quindi l'allungamento è il triplo: $3 \cdot 5\,\text{cm} = 15\,\text{cm}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Appendi un corpo a un dinamometro e leggi 39,2 N. Qual è la massa del corpo?`, suggerimenti: [R`Il dinamometro misura il peso. Per avere la massa dividi per $g$.`], risposta: { tipo: 'numero', valore: 4, unita: 'kg' }, soluzione: [R`$m = \dfrac{39{,}2\,\text{N}}{9{,}8\,\text{N/kg}} = 4\,\text{kg}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`La sabbia asciutta ha un peso specifico di circa $15\,000\,\text{N/m}^3$. Quanto pesano $0{,}03\,\text{m}^3$ di sabbia?`, suggerimenti: [R`Dalla definizione $P_s = \dfrac{P}{V}$ ricava $P$.`], risposta: { tipo: 'numero', valore: 450, unita: 'N' }, soluzione: [R`$P = P_s \cdot V = 15\,000\,\text{N/m}^3 \cdot 0{,}03\,\text{m}^3 = 450\,\text{N}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Una scatola da 40 N è sul pavimento, e sopra c'è una seconda scatola da 25 N. Con che forza normale il pavimento spinge la scatola di sotto?`, suggerimenti: [R`Il pavimento deve reggere tutte e due le scatole.`], risposta: { tipo: 'numero', valore: 65, unita: 'N' }, soluzione: [R`$N = 40\,\text{N} + 25\,\text{N} = 65\,\text{N}$: è come se la scatola di sotto fosse premuta dall'alto con 25 N.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una valigia da 150 N è sul pavimento. La tiri verso l'alto con 55 N, ma non si stacca. Quanto vale la forza normale?`, suggerimenti: [R`Il pavimento regge solo la parte del peso che non reggi tu.`], risposta: { tipo: 'numero', valore: 95, unita: 'N' }, soluzione: [R`$N = P - F = 150\,\text{N} - 55\,\text{N} = 95\,\text{N}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un mobile preme sul pavimento con una forza normale di 400 N, e $\mu_s = 0{,}7$. Quanto vale l'attrito statico massimo?`, suggerimenti: [R`$F_{s,\text{max}} = \mu_s \cdot N$.`], risposta: { tipo: 'numero', valore: 280, unita: 'N' }, soluzione: [R`$F_{s,\text{max}} = 0{,}7 \cdot 400\,\text{N} = 280\,\text{N}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un baule può avere al massimo 160 N di attrito statico. Lo spingi con 70 N e non si muove. Quanto vale l'attrito?`, suggerimenti: [R`Se il baule resta fermo, la risultante è zero.`], risposta: { tipo: 'numero', valore: 70, unita: 'N' }, soluzione: [R`Il baule è fermo: l'attrito statico è uguale e opposto alla spinta, $70\,\text{N}$. I 160 N sono solo il massimo.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`Una cassa di 40 kg scivola su un pavimento con $\mu_d = 0{,}25$. Quanto vale l'attrito dinamico?`, suggerimenti: [R`Prima la forza normale: sul pavimento orizzontale è il peso, $m \cdot g$.`, R`Poi $F_d = \mu_d \cdot N$.`], risposta: { tipo: 'numero', valore: 98, unita: 'N' }, soluzione: [R`$N = 40\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 392\,\text{N}$.`, R`$F_d = 0{,}25 \cdot 392\,\text{N} = 98\,\text{N}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Una slitta preme sulla neve con una forza normale di 400 N. Per trascinarla a velocità costante serve una forza di 60 N. Quanto vale il coefficiente di attrito dinamico?`, suggerimenti: [R`A velocità costante la forza che tira è uguale all'attrito dinamico.`, R`$\mu_d = \dfrac{F_d}{N}$.`], risposta: { tipo: 'numero', valore: 0.15 }, soluzione: [R`$\mu_d = \dfrac{F_d}{N} = \dfrac{60\,\text{N}}{400\,\text{N}} = 0{,}15$, senza unità.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 3, testo: R`Una slitta di 18 kg è tirata con una corda inclinata di 30° sull'orizzontale, con una forza di 60 N. Quanto vale la forza normale della neve sulla slitta?`, suggerimenti: [R`Scomponi la forza della corda: la componente verticale è $F \cdot \sin 30°$.`, R`La corda regge una parte del peso: $N = P - F_y$.`], risposta: { tipo: 'numero', valore: 146.4, unita: 'N' }, soluzione: [R`Peso: $P = 18\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 176{,}4\,\text{N}$.`, R`Componente verticale della corda: $F_y = 60\,\text{N} \cdot \sin 30° = 30\,\text{N}$, verso l'alto.`, R`$N = P - F_y = 176{,}4\,\text{N} - 30\,\text{N} = 146{,}4\,\text{N}$. Tirando in su si riduce anche l'attrito.`] },
    { id: 'es-02', difficolta: 3, testo: R`Tieni un quaderno di 9 N premuto contro una lavagna, spingendo in orizzontale. Fra quaderno e lavagna $\mu_s = 0{,}3$. Qual è la spinta minima perché il quaderno non scivoli?`, suggerimenti: [R`La forza normale della lavagna è uguale alla tua spinta.`, R`L'attrito statico, verso l'alto, deve reggere il peso: $\mu_s \cdot F \ge P$.`], risposta: { tipo: 'numero', valore: 30, unita: 'N' }, soluzione: [R`$N = F$ e l'attrito massimo è $\mu_s \cdot F$.`, R`Serve $0{,}3 \cdot F \ge 9\,\text{N}$, cioè $F \ge \dfrac{9}{0{,}3}\,\text{N} = 30\,\text{N}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Tiri un blocco di 8 kg con un dinamometro orizzontale, la cui molla ha $k = 294\,\text{N/m}$. Fra blocco e tavolo $\mu_s = 0{,}3$. Di quanto è allungata la molla nell'istante in cui il blocco parte?`, suggerimenti: [R`Il blocco parte quando la forza della molla raggiunge l'attrito statico massimo.`, R`$F_{s,\text{max}} = \mu_s \cdot m \cdot g$; poi $x = \dfrac{F}{k}$.`], risposta: { tipo: 'numero', valore: 0.08, unita: 'm' }, soluzione: [R`$N = 8\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 78{,}4\,\text{N}$; $F_{s,\text{max}} = 0{,}3 \cdot 78{,}4\,\text{N} = 23{,}52\,\text{N}$.`, R`$x = \dfrac{23{,}52\,\text{N}}{294\,\text{N/m}} = 0{,}08\,\text{m} = 8\,\text{cm}$.`] },
    { id: 'es-04', difficolta: 2, testo: R`Un corpo pesa 49 N sulla Terra e 65 N su un pianeta immaginario. Quanto vale $g$ su quel pianeta?`, suggerimenti: [R`Prima trova la massa, che è la stessa sui due pianeti.`, R`Poi $g = \dfrac{P}{m}$.`], risposta: { tipo: 'numero', valore: 13, unita: 'N/kg' }, soluzione: [R`$m = \dfrac{49\,\text{N}}{9{,}8\,\text{N/kg}} = 5\,\text{kg}$.`, R`$g = \dfrac{65\,\text{N}}{5\,\text{kg}} = 13\,\text{N/kg}$, cioè $13\,\text{m/s}^2$.`] },
    { id: 'es-05', difficolta: 2, testo: R`Una molla con $k = 32\,\text{N/m}$ viene portata sulla Luna ($g = 1{,}6\,\text{N/kg}$). Le appendi una massa di 0,6 kg. Di quanto si allunga?`, suggerimenti: [R`La molla sente il peso, non la massa: calcola il peso sulla Luna.`], risposta: { tipo: 'numero', valore: 0.03, unita: 'm' }, soluzione: [R`Peso sulla Luna: $P = 0{,}6\,\text{kg} \cdot 1{,}6\,\text{N/kg} = 0{,}96\,\text{N}$.`, R`$x = \dfrac{0{,}96\,\text{N}}{32\,\text{N/m}} = 0{,}03\,\text{m} = 3\,\text{cm}$. Sulla Terra sarebbero circa 18 cm.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una cassa di 30 kg è sul pavimento, con $\mu_s = 0{,}7$ e $\mu_d = 0{,}45$. La spingi in orizzontale con 220 N. Parte? Se parte, quanto vale la forza risultante mentre scivola?`, suggerimenti: [R`Confronta la spinta con l'attrito statico massimo.`, R`Mentre scivola, la risultante è la spinta meno l'attrito dinamico.`], risposta: { tipo: 'numero', valore: 87.7, unita: 'N' }, soluzione: [R`$N = 30\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 294\,\text{N}$; $F_{s,\text{max}} = 0{,}7 \cdot 294\,\text{N} = 205{,}8\,\text{N}$. La spinta è più grande: la cassa parte.`, R`Attrito dinamico: $F_d = 0{,}45 \cdot 294\,\text{N} = 132{,}3\,\text{N}$.`, R`Risultante: $220\,\text{N} - 132{,}3\,\text{N} = 87{,}7\,\text{N}$, nel verso della spinta. La cassa accelera.`] },
    { id: 'es-07', difficolta: 2, testo: R`Il ferro ha densità $7900\,\text{kg/m}^3$. Quanto pesa un blocco di ferro di $2\,\text{dm}^3$?`, suggerimenti: [R`Porta il volume in metri cubi: $1\,\text{dm}^3 = 0{,}001\,\text{m}^3$.`, R`Il peso è il peso specifico per il volume: $P = d \cdot g \cdot V$.`], risposta: { tipo: 'numero', valore: 154.84, unita: 'N' }, soluzione: [R`$V = 2\,\text{dm}^3 = 0{,}002\,\text{m}^3$.`, R`$P_s = 7900\,\text{kg/m}^3 \cdot 9{,}8\,\text{N/kg} = 77\,420\,\text{N/m}^3$.`, R`$P = 77\,420\,\text{N/m}^3 \cdot 0{,}002\,\text{m}^3 \approx 155\,\text{N}$.`] },
    { id: 'es-08', difficolta: 3, testo: R`Su un corpo agiscono tre forze: 30 N verso est, 10 N verso ovest e 15 N verso nord. Quanto vale la risultante?`, suggerimenti: [R`Prima somma le due forze sulla retta est–ovest.`, R`Poi componi il risultato con la forza verso nord, che è perpendicolare.`], risposta: { tipo: 'numero', valore: 25, unita: 'N' }, soluzione: [R`Est–ovest: $30 - 10 = 20\,\text{N}$ verso est.`, R`Con la forza verso nord: $R = \sqrt{20^2 + 15^2}\,\text{N} = \sqrt{625}\,\text{N} = 25\,\text{N}$.`] },
    { id: 'es-09', difficolta: 2, testo: R`La molla A si allunga di 4 cm con 3 N. La molla B si allunga di 3 cm con 9 N. Quante volte la costante di B è più grande di quella di A?`, suggerimenti: [R`Calcola $k$ per ciascuna molla, con gli allungamenti in metri.`], risposta: { tipo: 'numero', valore: 4 }, soluzione: [R`$k_A = \dfrac{3\,\text{N}}{0{,}04\,\text{m}} = 75\,\text{N/m}$; $k_B = \dfrac{9\,\text{N}}{0{,}03\,\text{m}} = 300\,\text{N/m}$.`, R`$\dfrac{k_B}{k_A} = \dfrac{300}{75} = 4$: B è quattro volte più dura.`] },
    { id: 'es-10', difficolta: 2, testo: R`Una cassa di 35 kg scivola a velocità costante sul pavimento, tirata da una fune orizzontale con 68,6 N. Quanto vale il coefficiente di attrito dinamico?`, suggerimenti: [R`A velocità costante la forza della fune è uguale all'attrito dinamico.`, R`$\mu_d = \dfrac{F_d}{N}$, con $N = m \cdot g$.`], risposta: { tipo: 'numero', valore: 0.2 }, soluzione: [R`$N = 35\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 343\,\text{N}$.`, R`$\mu_d = \dfrac{68{,}6\,\text{N}}{343\,\text{N}} = 0{,}2$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`In che unità si misura una forza nel Sistema Internazionale?`, opzioni: [R`chilogrammo (kg)`, R`newton (N)`, R`newton al chilogrammo (N/kg)`, R`metro al secondo quadrato ($\text{m/s}^2$)`], corretta: 1, spiegazione: R`La forza si misura in newton. Il chilogrammo è l'unità della massa; N/kg e $\text{m/s}^2$ sono le unità di $g$.` },
    { id: 'q-02', domanda: R`Un astronauta va dalla Terra alla Luna. Che cosa succede alla sua massa?`, opzioni: [R`Resta la stessa`, R`Diventa circa sei volte più piccola`, R`Diventa zero`, R`Diventa circa sei volte più grande`], corretta: 0, spiegazione: R`La massa è la quantità di materia e non dipende dal luogo. È il peso a diventare circa sei volte più piccolo.` },
    { id: 'q-03', domanda: R`Che cosa misura una bilancia a bracci?`, opzioni: [R`Il peso`, R`La massa`, R`La densità`, R`Il volume`], corretta: 1, spiegazione: R`Confronta il corpo con masse campione: sulla Luna pesano meno tutti e due, e l'equilibrio resta. Misura quindi la massa. Una bilancia a molla, invece, misura il peso.` },
    { id: 'q-04', domanda: R`Un disco da hockey scivola su un ghiaccio perfettamente liscio, senza attrito. Che forza serve per tenerlo in moto a velocità costante?`, opzioni: [R`Una forza uguale al suo peso`, R`Una forza sempre più grande`, R`Una forza costante nel verso del moto`, R`Nessuna forza`], corretta: 3, spiegazione: R`Senza attrito nessuno frena il disco, e il disco va avanti da solo. Una forza serve per cambiare la velocità, non per mantenerla.` },
    { id: 'q-05', domanda: R`Una molla, nel tratto elastico, è tirata con una forza doppia. Che cosa succede all'allungamento?`, opzioni: [R`Resta uguale`, R`Diventa quattro volte tanto`, R`Raddoppia`, R`Si dimezza`], corretta: 2, spiegazione: R`Per la legge di Hooke, $F = k \cdot x$: l'allungamento è proporzionale alla forza. Forza doppia, allungamento doppio. Raddoppia l'allungamento, non la lunghezza della molla.` },
    { id: 'q-06', domanda: R`Che unità di misura ha il coefficiente di attrito $\mu$?`, opzioni: [R`newton`, R`newton al metro`, R`nessuna: è un numero puro`, R`chilogrammo`], corretta: 2, spiegazione: R`$\mu$ è il rapporto fra l'attrito e la forza normale: due forze, i newton si semplificano. È un numero puro.` },
    { id: 'q-07', domanda: R`Una cassa ferma può avere al massimo 120 N di attrito statico. La spingi con 50 N. Quanto vale l'attrito?`, opzioni: [R`120 N`, R`50 N`, R`zero`, R`70 N`], corretta: 1, spiegazione: R`La cassa resta ferma, quindi la risultante è zero: l'attrito statico è uguale e opposto alla spinta. 120 N è solo il massimo, e 70 N è la differenza, che non c'entra.` },
    { id: 'q-08', domanda: R`Di solito, per le stesse due superfici, come sono i due coefficienti di attrito?`, opzioni: [R`$\mu_d$ è più piccolo di $\mu_s$`, R`$\mu_d$ è più grande di $\mu_s$`, R`sono sempre uguali`, R`$\mu_d$ è zero`], corretta: 0, spiegazione: R`Per far partire un corpo serve più forza che per tenerlo in moto: $\mu_d < \mu_s$. In pochi casi, come il teflon, sono quasi uguali; zero non sono mai.` },
    { id: 'q-09', domanda: R`Un mattone scivola su un tavolo, prima di piatto e poi di taglio. L'attrito dinamico…`, opzioni: [R`è più grande di piatto, perché tocca di più`, R`è più grande di taglio, perché preme di più su ogni punto`, R`è zero di taglio`, R`è circa lo stesso`], corretta: 3, spiegazione: R`L'attrito dinamico vale $\mu_d \cdot N$ e quasi non dipende dall'area di contatto. $N$ è sempre il peso del mattone.` },
    { id: 'q-10', domanda: R`Un libro è sul tavolo e lo premi dall'alto con la mano. Com'è la forza normale rispetto al peso del libro?`, opzioni: [R`Più grande`, R`Uguale`, R`Più piccola`, R`Zero`], corretta: 0, spiegazione: R`Il tavolo deve reggere il peso e anche la spinta della mano: $N = P + F$. La normale è uguale al peso solo se nessun'altra forza agisce in verticale.` },
    { id: 'q-11', domanda: R`Quando vale la legge di Hooke?`, opzioni: [R`Sempre, per qualunque forza`, R`Solo per le molle di acciaio`, R`Solo nel tratto elastico`, R`Solo per forze piccolissime, sotto 1 N`], corretta: 2, spiegazione: R`Se la molla è tirata troppo si deforma per sempre, e l'allungamento non è più proporzionale alla forza. La legge vale per molti materiali, finché restano elastici.` },
    { id: 'q-12', domanda: R`Due forze dello stesso modulo agiscono su un corpo, con la stessa direzione e versi opposti. Quanto vale la risultante?`, opzioni: [R`Il doppio di ciascuna forza`, R`Zero`, R`Quanto una delle due`, R`Dipende dalla massa del corpo`], corretta: 1, spiegazione: R`Versi opposti: si fa la differenza dei moduli, che qui è zero. Le due forze si fanno equilibrio. La massa non c'entra con la somma delle forze.` },
    { id: 'q-13', domanda: R`In che unità si misura il peso specifico?`, opzioni: [R`$\text{N/m}^3$`, R`$\text{kg/m}^3$`, R`$\text{N}$`, R`$\text{N/kg}$`], corretta: 0, spiegazione: R`È un peso diviso un volume: newton al metro cubo. I $\text{kg/m}^3$ sono della densità, i N del peso, i N/kg di $g$.` },
    { id: 'q-14', domanda: R`Che cosa vuol dire che sulla Terra $g = 9{,}8\,\text{N/kg}$?`, opzioni: [R`Che un corpo pesa 9,8 kg`, R`Che ogni corpo pesa 9,8 N`, R`Che un corpo che cade percorre 9,8 m ogni secondo`, R`Che ogni chilogrammo di massa pesa 9,8 N`], corretta: 3, spiegazione: R`$g$ dice quanti newton pesa ogni chilogrammo: $P = m \cdot g$. Il peso di un corpo dipende dalla sua massa, e il peso non si misura in kg.` },
    { id: 'q-15', domanda: R`Perché le tacche di un dinamometro sono equidistanti?`, opzioni: [R`Per comodità di lettura, ma potrebbero non esserlo`, R`Perché la molla ha sempre la stessa lunghezza`, R`Perché il peso è uguale alla massa`, R`Perché l'allungamento della molla è proporzionale alla forza`], corretta: 3, spiegazione: R`È la legge di Hooke: ogni newton in più allunga la molla della stessa quantità. Per questo la scala è regolare.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Massa e peso non sono la stessa cosa: la massa si misura in kg e non cambia, il peso è una forza in N. Per passare dall'una all'altro usa $P = m \cdot g$.` },
    { tipo: 'errore', testo: R`Nella legge di Hooke $x$ è l'allungamento, non la lunghezza della molla: togli sempre la lunghezza a riposo.` },
    { tipo: 'errore', testo: R`L'attrito statico non vale sempre $\mu_s \cdot N$: quello è il massimo. Se la cassa è ferma, l'attrito è uguale alla spinta.` },
    { tipo: 'errore', testo: R`La forza normale è uguale al peso solo sul piano orizzontale, senza altre forze verticali. Se premi o tiri il corpo, cambia.` },
    { tipo: 'trucco', testo: R`Le forze sulla stessa retta si sommano con il segno: scegli un verso positivo, e le forze nell'altro verso hanno il meno.` },
    { tipo: 'trucco', testo: R`Nella legge di Hooke, con $k$ in $\text{N/m}$ l'allungamento va in metri: 5 cm sono $0{,}05\,\text{m}$.` },
    { tipo: 'metodo', testo: R`Nei problemi di attrito, il primo passo è sempre la forza normale $N$. Poi l'attrito massimo, e solo alla fine il confronto con la spinta.` },
    { tipo: 'metodo', testo: R`Disegna il corpo e tutte le forze che agiscono su di lui, una freccia per forza. Poi sommale come vettori.` }
  ],
  aneddoti: [
    { fisico: 'Robert Hooke', anni: '1635–1703', titolo: 'La molla a spirale degli orologi da tasca', testo: R`Gli orologi da tasca del Seicento sbagliavano anche di molti minuti al giorno. Robert Hooke ebbe un'idea: mettere una piccola molla sul bilanciere, la rotella che oscilla avanti e indietro. Una molla che segue la sua legge rende le oscillazioni regolari. Nel 1675 l'olandese Christiaan Huygens presentò a Parigi un orologio con una molla a spirale. Hooke si infuriò. Sosteneva di averci pensato più di quindici anni prima, e accusò il segretario della Royal Society di aver passato le sue idee. Per dimostrarlo fece costruire dall'orologiaio Thomas Tompion un orologio per il re Carlo II. La lite non si chiuse mai. Oggi l'invenzione si riconosce, in parte, a tutti e due.`, legame: R`La molla del bilanciere funziona perché segue la legge di Hooke: la forza è proporzionale all'allungamento.` },
    { fisico: 'Leonardo da Vinci', anni: '1452–1519', titolo: 'I blocchi trascinati nei quaderni', testo: R`Fra macchine, ali e disegni di anatomia, i quaderni di Leonardo contengono anche esperimenti sull'attrito. Leonardo trascinava blocchi su un piano con una corda. La corda passava su una carrucola e reggeva un peso, che misurava la forza. Notò che l'attrito non cambia se il blocco poggia sulla faccia larga o su quella stretta. Scrisse anche che, per superfici lisce, l'attrito vale circa un quarto del peso. I suoi quaderni restarono sconosciuti per secoli. Nel 1699 il francese Guillaume Amontons riscoprì le stesse regole, che oggi portano il suo nome.`, legame: R`L'attrito dipende dalla forza che preme le superfici, non dall'area di contatto.` },
    { fisico: 'Charles-Augustin de Coulomb', anni: '1736–1806', titolo: 'Le prove nel cantiere navale', testo: R`Prima di studiare le cariche elettriche, Coulomb era un ingegnere militare. Nel cantiere navale di Rochefort, sulla costa atlantica della Francia, studiò come scivolano le travi di legno. Fece moltissime prove, cambiando carichi, superfici e tempi di attesa. Trovò che per far partire un corpo serve più forza che per tenerlo in moto. Vide anche che l'attrito statico cresce se il corpo resta fermo a lungo. Nel 1781 il suo lavoro, la *Teoria delle macchine semplici*, vinse il premio dell'Accademia delle scienze di Parigi. Lo stesso anno Coulomb entrò nell'Accademia.`, legame: R`È la differenza fra attrito statico e dinamico: di solito $\mu_d < \mu_s$.` },
    { fisico: 'Isaac Newton', anni: '1643–1727', titolo: 'La mela del giardino di Woolsthorpe', testo: R`Si racconta che Newton abbia pensato alla gravità guardando cadere una mela. La storia la raccontò lui stesso, da vecchio, all'amico William Stukeley, nel 1726. Era successo molti anni prima, nel giardino di casa sua a Woolsthorpe, in Inghilterra. La mela che gli cade in testa, invece, è un'aggiunta posteriore: una leggenda. Newton capì che la forza che fa cadere la mela è la stessa che tiene la Luna intorno alla Terra. Il peso di un corpo è proprio questa forza. Nel 1948 l'unità di misura delle forze ricevette il suo nome: il newton.`, legame: R`Il peso è la forza con cui la Terra attira un corpo, e si misura in newton.` }
  ]
});
})();
