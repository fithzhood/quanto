/* Quanto — Temperatura e calore (fluidi e calore, secondo anno).
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/calore.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'calore',
  titolo: 'Temperatura e calore',
  introduzione: R`Si dice «oggi fa caldo», «ho preso freddo», «la pentola scotta». Nella vita di tutti i giorni temperatura e calore sembrano quasi la stessa parola. In fisica sono due cose diverse. La **temperatura** dice quanto si agitano le particelle di un corpo. Il **calore** è energia che passa da un corpo all'altro per una differenza di temperatura.

Con queste due idee si spiegano molte cose concrete. Perché fra un binario e l'altro si lascia uno spazio? Perché d'estate la sabbia scotta e il mare resta fresco? Perché il ghiaccio nella bibita resta a 0 °C finché non si è sciolto? Perché il manico di legno non scotta e quello di metallo sì?

Serve saper usare le unità di misura e la densità. Il calore è una forma di energia. L'energia si studia al terzo anno: qui basta sapere che si misura in joule (J).`,
  inBreve: [
    R`La **temperatura** misura l'agitazione delle particelle. Il **calore** è energia che passa da un corpo caldo a uno freddo, e si misura in joule.`,
    R`In kelvin la temperatura è $T = t + 273{,}15$, con $t$ in gradi Celsius. Una differenza di temperatura ha lo stesso valore in °C e in K.`,
    R`Scaldandosi, i corpi si dilatano: $\Delta L = \lambda \cdot L_0 \cdot \Delta T$. L'acqua fra 0 °C e 4 °C fa il contrario.`,
    R`Per scaldare una massa $m$ di $\Delta T$ serve $Q = m \cdot c \cdot \Delta T$. L'acqua ha un calore specifico grande, $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$: lo stesso numero di joule che c'è in una chilocaloria.`,
    R`Due corpi a contatto arrivano alla stessa temperatura: il calore ceduto dal più caldo è uguale a quello preso dal più freddo.`,
    R`Mentre una sostanza cambia stato la temperatura resta ferma: il calore $Q = m \cdot L_f$ (fusione) o $Q = m \cdot L_v$ (vaporizzazione) serve a staccare le particelle.`
  ],
  sezioni: [
    {
      id: 'temperatura',
      titolo: 'La temperatura e il termometro',
      testo: R`Tocca la maniglia di metallo di una porta, poi il legno della porta. Il metallo sembra più freddo. Eppure sono nella stessa stanza da ore: hanno la stessa temperatura. Il tatto ci inganna. Sente quanto in fretta la mano perde calore, non la temperatura. Per misurarla serve uno strumento.

Il **termometro** più comune ha un liquido dentro un tubicino sottile. Scaldandosi il liquido si dilata e sale nel tubo. Il termometro va tenuto a contatto con il corpo finché il liquido smette di muoversi. In quel momento termometro e corpo hanno la stessa temperatura.

>* La **temperatura** è la grandezza che si misura con il termometro. Due corpi a contatto, dopo un po', arrivano alla stessa temperatura: è l'**equilibrio termico**.

La **scala Celsius** ha due punti fissi: 0 °C è il ghiaccio che fonde, 100 °C è l'acqua che bolle al livello del mare. Fra i due ci sono cento gradi uguali.

Nel Sistema Internazionale la temperatura si misura in **kelvin** (K). Un kelvin è grande come un grado Celsius, ma lo zero è spostato. Lo zero della scala Kelvin è lo **zero assoluto**, −273,15 °C: più freddo di così non si può.

>* Fra la temperatura $T$ in kelvin e la temperatura $t$ in gradi Celsius vale $T = t + 273{,}15$.

~ T = t + 273{,}15 :: la temperatura del corpo umano, in kelvin
~ T = (37 + 273{,}15)\,\text{K} :: metto $t$ in gradi Celsius
~ T = \evidb{310{,}15\,\text{K}} :: circa 310 K; si scrive K, senza il segno di grado

| | gradi Celsius | kelvin |
|---|---|---|
| zero assoluto | −273,15 | 0 |
| ghiaccio che fonde | 0 | 273,15 |
| corpo umano | 37 | 310,15 |
| acqua che bolle | 100 | 373,15 |

Un kelvin e un grado Celsius sono grandi uguali. Quindi una **differenza** di temperatura ha lo stesso numero nelle due scale. Da 10 °C a 30 °C la temperatura sale di 20 °C, cioè di 20 K. Per questo nelle formule si scrive $\Delta T$ e va bene l'una o l'altra scala.

>! Le differenze di temperatura non si convertono aggiungendo 273. Se l'acqua passa da 20 °C a 25 °C, $\Delta T = 5\,\text{K}$, non 278 K.

> Da qui in poi anche le temperature in gradi Celsius si chiamano $T$, sempre con l'unità accanto: la lettera $t$ serve già per il tempo. Nelle formule di questo argomento conta quasi sempre solo $\Delta T$, che è uguale nelle due scale. Nelle leggi dei gas, invece, $T$ sarà sempre in kelvin.

?? Quanti kelvin sono 20 °C?
[ ] 253 K
[x] 293 K
[ ] 20 K
=> Si aggiunge 273,15: $20 + 273{,}15 = 293{,}15$, circa 293 K. Si toglie 273,15 solo per tornare dai kelvin ai gradi Celsius.`
    },
    {
      id: 'calore',
      titolo: 'Temperatura e calore non sono la stessa cosa',
      testo: R`Una stellina di Capodanno lancia scintille a circa 1000 °C. Eppure una scintilla sulla mano quasi non si sente. Un bagno a 40 °C, invece, scalda tutto il corpo. Come mai?

[[video:calore/temperatura]]

Ogni corpo è fatto di particelle che si agitano senza sosta. Più il corpo è caldo, più si agitano in fretta. Ogni particella che si muove ha **energia cinetica**: più va veloce, più ne ha.

>* La **temperatura** misura l'agitazione delle particelle: è legata alla loro energia cinetica media. L'**energia interna** è l'energia di tutte le particelle del corpo, messe insieme.

La scintilla è caldissima, ma è un granello di un decimo di milligrammo. Raffreddandosi fino a 37 °C cede circa 0,04 J. La vasca è solo tiepida, ma contiene 150 kg d'acqua. Scendendo di 3 °C cede quasi due milioni di joule. Conta la temperatura, ma conta anche quanta materia c'è.

Ora mettiamo a contatto due corpi a temperature diverse. Le particelle del corpo caldo urtano quelle del freddo e le agitano di più. Il caldo si raffredda, il freddo si scalda. Lo scambio si ferma all'equilibrio termico, quando le temperature sono uguali.

>* Il **calore** è energia che passa da un corpo a un altro per una differenza di temperatura. Va da solo sempre dal corpo più caldo al più freddo. Si misura in joule, come ogni energia.

Se due corpi sono in equilibrio termico con un terzo, lo sono anche fra loro. È il **principio zero** della termodinamica. Il terzo corpo può essere un termometro: per questo con un termometro si possono confrontare le temperature di due corpi che non si toccano.

>! Un corpo non «contiene calore»: contiene energia interna. Il calore c'è solo mentre l'energia passa. E il freddo non è una cosa che si sposta: è il calore che se ne va.

?? Stringi in mano un cubetto di ghiaccio. Che cosa passa fra la mano e il ghiaccio?
[ ] il freddo, dal ghiaccio alla mano
[x] il calore, dalla mano al ghiaccio
[ ] niente, finché il ghiaccio non si scioglie
=> Da solo il calore va sempre dal corpo più caldo a quello più freddo. La mano si raffredda perché perde energia, non perché riceve «freddo».`
    },
    {
      id: 'dilatazione',
      titolo: 'La dilatazione termica',
      testo: R`D'estate i fili della luce pendono più che d'inverno. Nei ponti e fra i binari si lasciano dei giunti. Quasi tutti i corpi, scaldandosi, diventano un poco più grandi. È la **dilatazione termica**.

Il motivo sta nelle particelle. Più si agitano, più spazio occupano: le distanze medie fra loro crescono.

[[video:calore/dilatazione]]

>* Una sbarra lunga $L_0$ che si scalda di $\Delta T$ si allunga di $\Delta L = \lambda \cdot L_0 \cdot \Delta T$. Il **coefficiente di dilatazione lineare** $\lambda$ dipende dal materiale. Si misura in $^\circ\text{C}^{-1}$, cioè «per grado».

| materiale | $\lambda$ ($^\circ\text{C}^{-1}$) |
|---|---|
| alluminio | $2{,}4 \cdot 10^{-5}$ |
| rame | $1{,}7 \cdot 10^{-5}$ |
| acciaio, cemento | $1{,}2 \cdot 10^{-5}$ |
| vetro comune | $0{,}9 \cdot 10^{-5}$ |
| vetro Pyrex | $0{,}3 \cdot 10^{-5}$ |

Che cosa vuol dire $\lambda = 1{,}2 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$? Per ogni grado in più, ogni metro di acciaio si allunga di 12 millesimi di millimetro. Sono numeri piccoli, ma su tanti metri si sentono.

~ \Delta L = \lambda \cdot L_0 \cdot \Delta T :: un filo di rame lungo 20 m si scalda di 30 °C
~ \lambda \cdot L_0 = 1{,}7 \cdot 10^{-5}\,\tfrac{1}{{}^\circ\text{C}} \cdot 20\,\text{m} :: prima quanto si allunga il filo per ogni grado
~ \lambda \cdot L_0 = 3{,}4 \cdot 10^{-4}\,\tfrac{\text{m}}{{}^\circ\text{C}} :: un terzo di millimetro per grado
~ \Delta L = 3{,}4 \cdot 10^{-4}\,\tfrac{\text{m}}{{}^\circ\text{C}} \cdot 30\,{}^\circ\text{C} :: i gradi si semplificano, restano i metri
~ \Delta L \approx \evidb{0{,}010\,\text{m}} :: circa un centimetro

L'allungamento è proporzionale sia alla lunghezza sia all'aumento di temperatura. Nel grafico, a parità di lunghezza, il materiale con il $\lambda$ doppio dà una retta ripida il doppio.

[[grafico:dilatazione]]

Acciaio e cemento hanno quasi lo stesso $\lambda$. Per questo nel cemento armato i due materiali si dilatano insieme e non si staccano.

Cresce anche il volume: $\Delta V = \alpha \cdot V_0 \cdot \Delta T$. Per un solido il **coefficiente di dilatazione volumica** è circa il triplo di quello lineare, $\alpha \approx 3 \cdot \lambda$. I liquidi si dilatano molto di più: per la benzina $\alpha \approx 9{,}5 \cdot 10^{-4}\,{}^\circ\text{C}^{-1}$.

>! Scaldando un anello di metallo, il foro **non** si stringe: si allarga. Tutto l'anello si ingrandisce, come in una fotografia ingrandita.

?? Il tappo di metallo di un barattolo di vetro non si svita. Conviene metterlo sotto l'acqua calda?
[x] sì: il metallo si dilata più del vetro e il tappo si allenta
[ ] no: con il caldo il tappo si stringe sul vetro
[ ] è indifferente: vetro e metallo si dilatano uguale
=> I metalli hanno un $\lambda$ più grande del vetro comune. Scaldandosi, il tappo si allarga più dell'imboccatura del barattolo.`
    },
    {
      id: 'acqua',
      titolo: 'L\'acqua fra 0 °C e 4 °C',
      testo: R`Quasi tutte le sostanze, scaldandosi, si dilatano e diventano meno dense. L'acqua fra 0 °C e 4 °C fa il contrario.

Ricordiamo la densità: $d = \dfrac{m}{V}$. Se la massa resta la stessa e il volume cresce, la densità cala. Se il volume cala, la densità cresce.

Scaldando l'acqua da 0 °C a 4 °C, il suo volume diminuisce un poco. La densità quindi aumenta. Sopra i 4 °C l'acqua torna a comportarsi come le altre sostanze: si dilata.

>* L'acqua liquida ha la densità massima a 4 °C, circa $1000\,\text{kg/m}^3$. Fra 0 °C e 4 °C, scaldandosi, si contrae.

[[grafico:densita]]

Le differenze sono piccole, pochi decimi di chilogrammo per metro cubo. Bastano però a cambiare la vita di un lago. D'inverno l'acqua in superficie si raffredda. Finché è sopra i 4 °C diventa più densa e scende sul fondo. Quando tutto il lago è a 4 °C, le cose cambiano. L'acqua di sopra, raffreddandosi ancora, diventa meno densa e resta in alto. Così il lago gela dalla superficie.

Anche il ghiaccio è speciale. Ha densità circa $917\,\text{kg/m}^3$, minore di quella dell'acqua liquida: per questo galleggia. Lo strato di ghiaccio fa da coperta. Sotto, sul fondo, l'acqua resta liquida a circa 4 °C, e i pesci sopravvivono.

>! Gelando, l'acqua aumenta di volume di circa il 9%. Per questo una bottiglia di vetro piena d'acqua, dimenticata nel congelatore, si rompe.

?? Un lago è gelato in superficie. A che temperatura è l'acqua sul fondo?
[ ] 0 °C, come il ghiaccio
[x] circa 4 °C
[ ] sotto 0 °C
=> A 4 °C l'acqua è più densa che mai e va sul fondo. Il ghiaccio, meno denso, resta sopra e isola l'acqua che sta sotto.`
    },
    {
      id: 'calore-specifico',
      titolo: 'Il calore specifico',
      testo: R`In spiaggia, d'estate, la sabbia scotta i piedi e l'acqua del mare è fresca. Il Sole dà a tutte e due la stessa energia per ogni metro quadrato. Perché la sabbia si scalda tanto di più?

[[video:calore/calore-specifico]]

Per scaldare un corpo serve energia. Ne serve di più se la massa è grande, e se lo si vuole scaldare di molti gradi. Dipende anche dalla sostanza: l'acqua ne vuole tanta, i metalli poca.

>* Per scaldare una massa $m$ di $\Delta T$ serve il calore $Q = m \cdot c \cdot \Delta T$. Il **calore specifico** $c$ è l'energia che scalda di 1 °C un chilogrammo della sostanza. Si misura in $\text{J/(kg}\cdot{}^\circ\text{C)}$.

| sostanza | $c$ in $\text{J/(kg}\cdot{}^\circ\text{C)}$ |
|---|---|
| acqua | 4186 |
| ghiaccio | 2100 |
| alluminio | 900 |
| vetro | 840 |
| sabbia | circa 800 |
| ferro | 450 |
| rame | 385 |
| piombo | 130 |

Ecco la spiaggia: la sabbia ha $c \approx 800$, l'acqua 4186. Con la stessa energia, un chilogrammo di sabbia si scalda circa cinque volte più di un chilogrammo d'acqua. Il mare in più rimescola l'acqua, e il calore si spartisce su una massa molto più grande.

~ Q = m \cdot c \cdot \Delta T :: scaldo 2 kg d'acqua da 15 °C a 65 °C
~ \Delta T = 65\,{}^\circ\text{C} - 15\,{}^\circ\text{C} = 50\,{}^\circ\text{C} :: finale meno iniziale
~ Q = 2\,\text{kg} \cdot 4186\,\tfrac{\text{J}}{\text{kg} \cdot {}^\circ\text{C}} \cdot 50\,{}^\circ\text{C} :: chilogrammi e gradi si semplificano, restano i joule
~ Q = \evidb{418\,600\,\text{J}} \approx 419\,\text{kJ} :: quasi mezzo milione di joule

Se il corpo si raffredda, $\Delta T$ è negativo e anche $Q$ lo è: il corpo cede calore.

Il prodotto $C = m \cdot c$ è la **capacità termica** del corpo, in J/°C. Dice quanti joule servono per scaldare di un grado *quel* corpo. Una pentola grande ha una capacità termica maggiore di una piccola dello stesso metallo.

Nel grafico la temperatura sale con l'energia ricevuta. La retta è tanto meno ripida quanto più grande è la capacità termica.

[[grafico:riscaldamento]]

>! Calore specifico e capacità termica non sono la stessa cosa. Il calore specifico è della sostanza. La capacità termica è del corpo: dipende anche dalla sua massa.

Il grande calore specifico dell'acqua addolcisce il clima. D'estate il mare assorbe tanta energia scaldandosi poco. D'inverno la restituisce piano. Per questo vicino al mare gli inverni sono più miti.

?? Dai la stessa energia a 1 kg d'acqua e a 1 kg di ferro. Chi si scalda di più?
[ ] l'acqua
[x] il ferro, circa nove volte di più
[ ] si scaldano uguale, perché la massa è la stessa
=> Il ferro ha $c = 450\,\text{J/(kg}\cdot{}^\circ\text{C)}$, l'acqua $4186$. Con la stessa energia il ferro sale di circa 9 volte più gradi.`
    },
    {
      id: 'mescolanze',
      titolo: 'La temperatura di equilibrio',
      testo: R`Versi acqua bollente in una bacinella di acqua fredda e mescoli. Dopo poco tutta l'acqua ha la stessa temperatura: la **temperatura di equilibrio** $T_e$. Sta fra le due temperature di partenza. Ma dove, esattamente?

Supponiamo che il recipiente sia isolato: l'energia non esce e non entra. Allora l'energia che lascia il corpo caldo va tutta nel corpo freddo.

>* Senza dispersioni, il calore ceduto dal corpo caldo è uguale al calore assorbito dal corpo freddo: $m_1 \cdot c_1 \cdot (T_1 - T_e) = m_2 \cdot c_2 \cdot (T_e - T_2)$.

Qui il corpo 1 è il caldo e il corpo 2 il freddo. Se sono della stessa sostanza, i calori specifici si semplificano. La temperatura di equilibrio diventa una **media pesata** con le masse:

$$T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2}$$

~ T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2} :: 2 kg d'acqua a 70 °C con 3 kg d'acqua a 20 °C
~ T_e = \dfrac{2\,\text{kg} \cdot 70 + 3\,\text{kg} \cdot 20}{5\,\text{kg}}\,{}^\circ\text{C} :: i chilogrammi si semplificano
~ T_e = \dfrac{200}{5}\,{}^\circ\text{C} = \evidb{40\,{}^\circ\text{C}} :: più vicina a 20 °C, perché l'acqua fredda è di più

Controllo: la calda scende di 30 °C, la fredda sale di 20 °C. E infatti $2 \cdot 30 = 3 \cdot 20$: i due calori sono uguali.

[[grafico:equilibrio]]

Lo strumento per queste misure è il **calorimetro**. È un recipiente isolato, con un termometro e un agitatore. Ci si mette acqua a temperatura nota, poi un corpo caldo. Dalla temperatura di equilibrio si ricava il calore specifico del corpo.

>! La temperatura di equilibrio non è sempre la media delle due temperature. Lo è solo con masse uguali della stessa sostanza.

?? Mescoli 1 kg d'acqua a 10 °C con 1 kg d'acqua a 50 °C. Quanto vale la temperatura di equilibrio?
[ ] 60 °C
[x] 30 °C
[ ] 40 °C
=> Masse uguali della stessa sostanza: è la media, $\dfrac{10 + 50}{2} = 30\,{}^\circ\text{C}$. La calda scende di 20 °C, la fredda sale di 20 °C.`
    },
    {
      id: 'joule',
      titolo: 'Lavoro e calore: l\'esperimento di Joule',
      testo: R`Strofina forte le mani: si scaldano. Una sega si scalda tagliando il legno. I freni di una bici, dopo una lunga discesa, scottano. In tutti questi casi non c'è una fiamma: c'è un lavoro.

Prima di Joule il calore si misurava con un'unità tutta sua, la **caloria**. Una caloria scalda di 1 °C un grammo d'acqua; una **chilocaloria**, un chilogrammo. Molti pensavano che il calore fosse un fluido invisibile, il «calorico». Joule mostrò che lavoro e calore sono due modi di dare energia.

[[video:calore/mulinello]]

Pensiamo a una forza che tira un corpo nella stessa direzione e nello stesso verso in cui si sposta. Il suo **lavoro** è la forza per lo spostamento: $L = F \cdot s$, in joule ($1\,\text{J} = 1\,\text{N} \cdot \text{m}$). È il caso più semplice: se la forza è inclinata, conta solo la sua parte lungo lo spostamento. Il peso $m \cdot g$ di un corpo che scende di $h$ fa il lavoro $m \cdot g \cdot h$. Nel mulinello di Joule i pesi scendono e fanno girare delle palette nell'acqua. L'acqua rimescolata si scalda: il lavoro è diventato energia interna dell'acqua.

~ L = 20 \cdot m \cdot g \cdot h :: un corpo di 15 kg scende di 1,5 m, per 20 volte
~ m \cdot g = 15\,\text{kg} \cdot 9{,}8\,\tfrac{\text{m}}{\text{s}^2} :: il peso del corpo
~ m \cdot g = 147\,\text{N} :: chilogrammi per m/s² fa newton
~ L = 20 \cdot 147\,\text{N} \cdot 1{,}5\,\text{m} :: newton per metri fa joule
~ L = 4410\,\text{J} :: il lavoro di tutte le discese
~ \Delta T = \dfrac{L}{m_a \cdot c} :: tutto il lavoro scalda $m_a = 0{,}6\,\text{kg}$ d'acqua
~ \Delta T = \dfrac{4410\,\text{J}}{0{,}6\,\text{kg} \cdot 4186\,\tfrac{\text{J}}{\text{kg} \cdot {}^\circ\text{C}}} :: joule e chilogrammi si semplificano, restano i gradi
~ \Delta T \approx \evidb{1{,}8\,{}^\circ\text{C}} :: tanta fatica per meno di due gradi

>* Lavoro e calore sono due modi di trasferire energia. L'**equivalente meccanico della caloria** è $1\,\text{cal} = 4{,}186\,\text{J}$, cioè $1\,\text{kcal} = 4186\,\text{J}$.

È lo stesso numero del calore specifico dell'acqua, e non è un caso. Una chilocaloria è proprio il calore che scalda di 1 °C un chilogrammo d'acqua.

Sulle etichette dei cibi l'energia è scritta in kcal e in kJ. Una mela da 50 kcal porta circa 209 kJ.

Anche la corrente elettrica può scaldare: un bollitore trasforma energia elettrica in calore. La **potenza** $P$, in watt, dice quanti joule al secondo: $1\,\text{W} = 1\,\text{J/s}$. In un intervallo di tempo $\Delta t$ il bollitore dà il calore $Q = P \cdot \Delta t$.

>! La caloria non è un'unità del Sistema Internazionale. Nei conti si passa ai joule: si moltiplica per 4,186, oppure per 4186 se sono chilocalorie.

?? Un biscotto porta 40 kcal. Quanti kJ sono, circa?
[ ] 10 kJ
[x] 167 kJ
[ ] 40 000 kJ
=> $40\,\text{kcal} = 40 \cdot 4186\,\text{J} \approx 167\,000\,\text{J}$, cioè circa 167 kJ. Per passare ai joule si moltiplica, non si divide.`
    },
    {
      id: 'stati',
      titolo: 'I cambiamenti di stato e il calore latente',
      testo: R`Metti dei cubetti di ghiaccio in una bibita. Finché resta del ghiaccio, la bibita sta vicina a 0 °C. Eppure l'aria intorno continua a darle calore. Dove va quell'energia?

[[video:calore/cambiamenti-di-stato]]

Una sostanza può essere solida, liquida o gassosa. I passaggi hanno un nome. Da solido a liquido è la **fusione**, il contrario la **solidificazione**. Da liquido a gas è la **vaporizzazione**, il contrario la **condensazione**. Da solido a gas, senza passare dal liquido, è la **sublimazione**; il contrario è il **brinamento**.

Durante la fusione l'energia non agita di più le particelle. Serve a rompere i legami che le tengono al loro posto nel solido. Per questo la temperatura resta ferma, finché tutto il ghiaccio è fuso.

>* A pressione costante, mentre una sostanza cambia stato, la sua temperatura resta costante. Il calore che serve è $Q = m \cdot L_f$ per fondere, $Q = m \cdot L_v$ per vaporizzare. $L_f$ e $L_v$ sono i **calori latenti**, in J/kg.

Per l'acqua: fondere il ghiaccio richiede $L_f \approx 3{,}34 \cdot 10^5\,\text{J/kg}$. Farla evaporare a 100 °C richiede $L_v \approx 2{,}26 \cdot 10^6\,\text{J/kg}$, quasi sette volte tanto.

[[grafico:curva]]

~ Q = m \cdot L_f :: fondo 0,3 kg di ghiaccio a 0 °C
~ Q = 0{,}3\,\text{kg} \cdot 3{,}34 \cdot 10^5\,\text{J/kg} :: i chilogrammi si semplificano
~ Q = \evidb{100\,200\,\text{J}} \approx 100\,\text{kJ} :: e la temperatura è rimasta a 0 °C

Nel verso opposto l'energia torna indietro. Il vapore che condensa restituisce $L_v$ per ogni chilogrammo. Per questo una scottatura da vapore è peggio di una da acqua bollente. E il sudore che evapora prende calore dalla pelle: così ci rinfresca.

> La temperatura di ebollizione dipende dalla pressione. In alta montagna la pressione è più bassa e l'acqua bolle sotto i 100 °C: a 3000 m, circa a 90 °C.

>! Evaporazione ed ebollizione non sono la stessa cosa. L'acqua evapora a ogni temperatura, ma solo dalla superficie. Bolle quando si formano bolle di vapore anche dentro il liquido.

?? L'acqua della pasta bolle. Alzi la fiamma al massimo. Che cosa fa la temperatura dell'acqua?
[ ] sale sopra i 100 °C
[x] resta circa a 100 °C
[ ] scende, perché l'acqua evapora
=> Mentre l'acqua bolle, l'energia in più la fa solo evaporare più in fretta. La temperatura resta quella di ebollizione.`
    },
    {
      id: 'propagazione',
      titolo: 'Come si propaga il calore',
      testo: R`Il calore va dal caldo al freddo. Ma per quale strada? Le strade sono tre: conduzione, convezione e irraggiamento.

[[video:calore/propagazione]]

**Conduzione.** Un cucchiaio di metallo nel tè si scalda fino al manico. Le particelle vicine al tè vibrano di più e urtano le vicine, che urtano le successive. L'energia passa, la materia resta ferma. I metalli sono **buoni conduttori**; legno, plastica, lana e aria sono **isolanti**. Per questo la maniglia di metallo sembra fredda: porta via in fretta il calore della mano.

Quanto calore passa attraverso una parete ogni secondo? Dipende dall'area $S$, dallo spessore $l$ e dalla differenza di temperatura $\Delta T$ fra le due facce:

$$\dfrac{Q}{\Delta t} = k \cdot \dfrac{S \cdot \Delta T}{l}$$

$k$ è la **conducibilità termica** del materiale, in $\text{W/(m}\cdot{}^\circ\text{C)}$. Per il rame vale circa 390, per il vetro circa 1, per il legno 0,15, per l'aria ferma 0,026.

~ \dfrac{Q}{\Delta t} = k \cdot \dfrac{S \cdot \Delta T}{l} :: un muro di mattoni di 10 m², spesso 25 cm, con 15 °C di differenza
~ \dfrac{S \cdot \Delta T}{l} = \dfrac{10\,\text{m}^2 \cdot 15\,{}^\circ\text{C}}{0{,}25\,\text{m}} :: lo spessore in metri: viene $600\,\text{m} \cdot {}^\circ\text{C}$
~ \dfrac{Q}{\Delta t} = 0{,}8\,\tfrac{\text{W}}{\text{m} \cdot {}^\circ\text{C}} \cdot 600\,\text{m} \cdot {}^\circ\text{C} :: per i mattoni $k \approx 0{,}8$; metri e gradi si semplificano
~ \dfrac{Q}{\Delta t} = \evidb{480\,\text{W}} :: ogni secondo escono dal muro 480 J

**Convezione.** In una pentola sul fuoco l'acqua del fondo si scalda, diventa meno densa e sale. Quella fredda, più densa, scende a prenderne il posto. Si formano delle correnti, e il calore viaggia con il fluido che si sposta. Così il termosifone scalda la stanza.

**Irraggiamento.** Fra il Sole e la Terra c'è il vuoto, eppure il Sole ci scalda. Ogni corpo emette onde elettromagnetiche, tanto più quanto è caldo. Viaggiano anche nel vuoto, alla velocità della luce: dal Sole arrivano in circa 8 minuti.

>* Il calore si propaga in tre modi. Per **conduzione**: per contatto, e la materia resta ferma. Per **convezione**: con un fluido che si sposta. Per **irraggiamento**: con onde elettromagnetiche, anche nel vuoto.

>! Una coperta non «dà caldo». È un isolante: rallenta il calore che il corpo perde verso l'aria.

?? Perché in un thermos c'è il vuoto fra le due pareti?
[ ] per far passare la luce
[x] per bloccare conduzione e convezione
[ ] per fermare l'irraggiamento
=> Nel vuoto non ci sono particelle: il calore non può passare per contatto né con un fluido che si muove. Contro l'irraggiamento servono le pareti argentate, che riflettono le onde.`
    }
  ],
  grafici: {
    /* allungamento di due sbarre di 10 m: la pendenza è λ·L₀ (in mm per grado) */
    dilatazione: {
      tipo: 'orario', grandezza: 'ΔL', unita: 'mm', etichette: { x: 'ΔT (°C)' }, t: [0, 50], y: [0, 14],
      funzioni: [
        { f: '0.24*t', colore: 3, etichetta: 'alluminio' },
        { f: '0.12*t', colore: 3, tratteggio: true, etichetta: 'acciaio' }
      ],
      didascalia: 'Quanto si allungano due sbarre lunghe 10 m, una di alluminio (linea piena) e una di acciaio (tratteggio), al crescere della temperatura. Sono rette: con metà ΔT, metà allungamento. L\'alluminio ha λ doppio e si allunga il doppio. Passa il dito sul grafico per leggere i valori.'
    },
    /* la densità dell'acqua liquida fra 0 e 12 °C: il massimo a 4 °C */
    densita: {
      tipo: 'orario', grandezza: 'd', unita: 'kg/m³', etichette: { x: 'T (°C)' }, t: [0, 12], y: [999.4, 1000.05],
      funzioni: [{ f: '999.97 - 0.008*(t - 4)^2', colore: 1 }],
      punti: [{ x: 4, y: 999.97, etichetta: 'massimo a 4 °C', posizione: 'destra', colore: 'grigio' }],
      didascalia: 'La densità dell\'acqua liquida fra 0 °C e 12 °C (valori arrotondati). Da 0 °C a 4 °C sale: l\'acqua si contrae. Oltre i 4 °C scende: l\'acqua si dilata. Le differenze sono di pochi decimi di kg/m³.'
    },
    /* T in funzione del calore ricevuto: la pendenza è 1/(m·c) */
    riscaldamento: {
      tipo: 'orario', grandezza: 'T', unita: '°C', etichette: { x: 'Q (kJ)' }, t: [0, 60], y: [0, 100],
      parametri: [
        { nome: 'm', min: 0.5, max: 3, passo: 0.5, valore: 1, etichetta: 'massa m (kg)' },
        { nome: 'c', min: 100, max: 4200, passo: 100, valore: 800, etichetta: 'c (J/(kg·°C))' }
      ],
      funzioni: [
        { f: '20 + 1000*t/(m*4186)', colore: 2, tratteggio: true, etichetta: 'acqua' },
        { f: '20 + 1000*t/(m*c)', colore: 2, etichetta: 'materiale' }
      ],
      elementi: [
        { tipo: 'testo', p: [59, 8], testo: 'C = m·c = {{m*c}} J/°C', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Due corpi della stessa massa partono da 20 °C e ricevono calore. Il tratteggio è l\'acqua; la linea piena un materiale con il calore specifico c scelto (800 è la sabbia, 450 il ferro). Più grande la capacità termica C = m·c, meno ripida la retta.'
    },
    /* acqua calda e fredda a contatto: le due temperature vanno verso la stessa T_e */
    equilibrio: {
      tipo: 'orario', grandezza: 'T', unita: '°C', unitaTempo: 'min', t: [0, 10], y: [0, 100],
      parametri: [
        { nome: 'm1', min: 0.5, max: 3, passo: 0.5, valore: 2, etichetta: 'acqua calda m_1 (kg)' },
        { nome: 'T1', min: 50, max: 100, passo: 5, valore: 90, etichetta: 'T_1 (°C)' },
        { nome: 'm2', min: 0.5, max: 3, passo: 0.5, valore: 1, etichetta: 'acqua fredda m_2 (kg)' },
        { nome: 'T2', min: 0, max: 40, passo: 5, valore: 30, etichetta: 'T_2 (°C)' }
      ],
      funzioni: [
        { f: '(m1*T1 + m2*T2)/(m1 + m2) + (T1 - (m1*T1 + m2*T2)/(m1 + m2))*exp(0 - t/1.5)', colore: 2 },
        { f: '(m1*T1 + m2*T2)/(m1 + m2) + (T2 - (m1*T1 + m2*T2)/(m1 + m2))*exp(0 - t/1.5)', colore: 2, tratteggio: true }
      ],
      elementi: [
        { tipo: 'orizzontale', y: '(m1*T1 + m2*T2)/(m1 + m2)', colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [3.2, '(m1*T1 + m2*T2)/(m1 + m2) + (T1 - (m1*T1 + m2*T2)/(m1 + m2))*exp(0 - 2) + 5'], testo: 'calda', ancora: 'start' },
        { tipo: 'testo', p: [3.2, '(m1*T1 + m2*T2)/(m1 + m2) + (T2 - (m1*T1 + m2*T2)/(m1 + m2))*exp(0 - 2) - 9'], testo: 'fredda', ancora: 'start' },
        { tipo: 'testo', p: [9.8, 'max((m1*T1 + m2*T2)/(m1 + m2) - 8, 2)'], testo: 'T_e = {{(m1*T1 + m2*T2)/(m1 + m2)|1}} °C', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Acqua calda (linea piena) e acqua fredda (tratteggio) in un recipiente isolato. Le due temperature si avvicinano fino alla temperatura di equilibrio, la media pesata con le masse. La calda scende di più se la fredda è di più. I tempi sono indicativi.'
    },
    /* curva di riscaldamento di 0,5 kg di ghiaccio da −20 °C a vapore a 120 °C */
    curva: {
      tipo: 'orario', grandezza: 'T', unita: '°C', etichette: { x: 'Q (kJ)' }, t: [0, 1600], y: [-30, 130], altezza: 480,
      funzioni: [
        { f: '-20 + t/1.05', dominio: [0, 21], colore: 2 },
        { f: '0', dominio: [21, 188], colore: 2 },
        { f: '(t - 188)/2.093', dominio: [188, 397.3], colore: 2 },
        { f: '100', dominio: [397.3, 1527.3], colore: 2 },
        { f: '100 + (t - 1527.3)', dominio: [1527.3, 1547.3], colore: 2 }
      ],
      elementi: [
        { tipo: 'testo', p: [240, 7], testo: '← fusione: 167 kJ', ancora: 'start', colore: 3 },
        { tipo: 'testo', p: [330, 46], testo: 'acqua', ancora: 'start' },
        { tipo: 'testo', p: [960, 108], testo: 'ebollizione' },
        { tipo: 'testo', p: [960, 86], testo: '1130 kJ', colore: 3 },
        { tipo: 'testo', p: [1500, 112], testo: 'vapore', ancora: 'end' }
      ],
      didascalia: 'La temperatura di 0,5 kg di ghiaccio a −20 °C che riceve calore, fino a diventare vapore. Nei due tratti piatti cambia stato e la temperatura sta ferma. L\'ebollizione chiede quasi sette volte l\'energia della fusione.'
    }
  },
  esempi: [
    {
      titolo: 'La sbarra di alluminio al sole',
      problema: R`Una sbarra di alluminio è lunga 2,0 m a 15 °C. Al sole arriva a 65 °C. Di quanto si allunga? Quanto vale in kelvin la temperatura finale? ($\lambda = 2{,}4 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$)`,
      passi: [
        R`Dati: $L_0 = 2{,}0\,\text{m}$, $T_1 = 15\,{}^\circ\text{C}$, $T_2 = 65\,{}^\circ\text{C}$, $\lambda = 2{,}4 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$. Cerco $\Delta L$ e la temperatura finale in kelvin.`,
        R`L'aumento di temperatura: $\Delta T = 65\,{}^\circ\text{C} - 15\,{}^\circ\text{C} = 50\,{}^\circ\text{C}$.`,
        R`L'allungamento: $\Delta L = \lambda \cdot L_0 \cdot \Delta T = 2{,}4 \cdot 10^{-5}\,{}^\circ\text{C}^{-1} \cdot 2{,}0\,\text{m} \cdot 50\,{}^\circ\text{C} = 0{,}0024\,\text{m}$, cioè $2{,}4\,\text{mm}$.`,
        R`La temperatura finale in kelvin: $(65 + 273{,}15)\,\text{K} = 338{,}15\,\text{K}$.`,
        R`Controllo: la sbarra diventa lunga $2{,}0024\,\text{m}$. Poco più di due millimetri su due metri: ragionevole per un metallo.`
      ],
      risultato: R`$\Delta L = 2{,}4\,\text{mm}$; temperatura finale $\approx 338\,\text{K}$`
    },
    {
      titolo: 'L\'acqua per la pasta',
      problema: R`Per la pasta si scaldano 3 L d'acqua da 18 °C a 100 °C. Quanto calore serve? Un fornello dà all'acqua 1500 W: quanto tempo ci vuole, se non si disperde niente?`,
      passi: [
        R`Dati: $V = 3\,\text{L}$, $T_1 = 18\,{}^\circ\text{C}$, $T_2 = 100\,{}^\circ\text{C}$, $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, $P = 1500\,\text{W}$. Cerco il calore $Q$ e il tempo $\Delta t$.`,
        R`Un litro d'acqua ha massa 1 kg, quindi $m = 3\,\text{kg}$. L'aumento di temperatura è $\Delta T = 100 - 18 = 82\,{}^\circ\text{C}$.`,
        R`Il calore: $Q = m \cdot c \cdot \Delta T = 3\,\text{kg} \cdot 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 82\,{}^\circ\text{C} = 1\,029\,756\,\text{J} \approx 1{,}03 \cdot 10^6\,\text{J}$.`,
        R`Il fornello dà 1500 J ogni secondo. Da $Q = P \cdot \Delta t$: $\Delta t = \dfrac{Q}{P} = \dfrac{1\,029\,756\,\text{J}}{1500\,\text{W}} \approx 687\,\text{s}$.`,
        R`In minuti: $\Delta t = \dfrac{687}{60}\,\text{min} \approx 11{,}4\,\text{min}$. Nella realtà ci vuole di più: una parte del calore scalda la pentola e l'aria.`
      ],
      risultato: R`$Q \approx 1{,}03 \cdot 10^6\,\text{J}$; circa $11{,}4\,\text{min}$`
    },
    {
      titolo: 'Il latte freddo nel tè',
      problema: R`In una tazza ci sono 200 g di tè a 80 °C. Si aggiungono 50 g di latte a 10 °C. Quanto vale la temperatura di equilibrio? Tè e latte hanno circa il calore specifico dell'acqua; la tazza non si conta.`,
      passi: [
        R`Dati: $m_1 = 0{,}2\,\text{kg}$, $T_1 = 80\,{}^\circ\text{C}$, $m_2 = 0{,}05\,\text{kg}$, $T_2 = 10\,{}^\circ\text{C}$, stesso calore specifico. Cerco $T_e$.`,
        R`Stessa sostanza, quindi $c$ si semplifica e $T_e$ è la media pesata con le masse.`,
        R`$T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2} = \dfrac{0{,}2 \cdot 80 + 0{,}05 \cdot 10}{0{,}25}\,{}^\circ\text{C} = \dfrac{16{,}5}{0{,}25}\,{}^\circ\text{C} = 66\,{}^\circ\text{C}$.`,
        R`Controllo con i calori. Il tè cede $0{,}2 \cdot 4186 \cdot 14 \approx 11\,721\,\text{J}$. Il latte prende $0{,}05 \cdot 4186 \cdot 56 \approx 11\,721\,\text{J}$. Sono uguali: torna.`
      ],
      risultato: R`$T_e = 66\,{}^\circ\text{C}$`
    },
    {
      titolo: 'Di che metallo è fatto?',
      problema: R`Un pezzo di metallo di 0,20 kg, scaldato a 100 °C, viene immerso in un calorimetro con 0,40 kg d'acqua a 20 °C. La temperatura di equilibrio è 23,5 °C. Quanto vale il calore specifico del metallo? Di che metallo può trattarsi?`,
      passi: [
        R`Dati: $m_1 = 0{,}20\,\text{kg}$, $T_1 = 100\,{}^\circ\text{C}$, $m_2 = 0{,}40\,\text{kg}$, $T_2 = 20\,{}^\circ\text{C}$, $T_e = 23{,}5\,{}^\circ\text{C}$, $c_2 = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Cerco $c_1$.`,
        R`Calore preso dall'acqua: $Q = m_2 \cdot c_2 \cdot (T_e - T_2) = 0{,}40 \cdot 4186 \cdot 3{,}5\,\text{J} \approx 5860\,\text{J}$.`,
        R`Il metallo cede lo stesso calore scendendo di $100 - 23{,}5 = 76{,}5\,{}^\circ\text{C}$. Quindi $m_1 \cdot c_1 \cdot 76{,}5\,{}^\circ\text{C} = 5860\,\text{J}$.`,
        R`$c_1 = \dfrac{5860\,\text{J}}{0{,}20\,\text{kg} \cdot 76{,}5\,{}^\circ\text{C}} \approx 383\,\text{J/(kg}\cdot{}^\circ\text{C)}$.`,
        R`Nella tabella il valore più vicino è quello del rame, $385\,\text{J/(kg}\cdot{}^\circ\text{C)}$. La differenza sta nei limiti della misura.`
      ],
      risultato: R`$c \approx 383\,\text{J/(kg}\cdot{}^\circ\text{C)}$: probabilmente rame`
    },
    {
      titolo: 'I cubetti di ghiaccio',
      problema: R`Quanto calore serve per trasformare 0,25 kg di ghiaccio a 0 °C in acqua a 30 °C? ($L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$)`,
      passi: [
        R`Dati: $m = 0{,}25\,\text{kg}$, $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, da 0 °C a 30 °C. Cerco il calore totale $Q$.`,
        R`Ci sono due tratti: prima il ghiaccio fonde a 0 °C, poi l'acqua si scalda. Si calcolano separatamente.`,
        R`Fusione: $Q_1 = m \cdot L_f = 0{,}25\,\text{kg} \cdot 3{,}34 \cdot 10^5\,\text{J/kg} = 83\,500\,\text{J}$.`,
        R`Riscaldamento: $Q_2 = m \cdot c \cdot \Delta T = 0{,}25 \cdot 4186 \cdot 30\,\text{J} = 31\,395\,\text{J}$.`,
        R`In tutto $Q = 83\,500 + 31\,395 \approx 114\,900\,\text{J}$, circa 115 kJ. Fondere costa più del doppio che scaldare di 30 gradi.`
      ],
      risultato: R`$Q \approx 115\,\text{kJ}$`
    },
    {
      titolo: 'La stufetta nella stanza',
      problema: R`Una stanza è lunga 5 m, larga 4 m e alta 3 m. Una stufetta da 2000 W deve scaldarne l'aria di 10 °C. Quanto tempo serve, se tutto il calore resta nell'aria? Per l'aria $d = 1{,}2\,\text{kg/m}^3$ e $c = 1000\,\text{J/(kg}\cdot{}^\circ\text{C)}$.`,
      passi: [
        R`Dati: lunghezza $5\,\text{m}$, larghezza $4\,\text{m}$, altezza $3\,\text{m}$, $P = 2000\,\text{W}$, $\Delta T = 10\,{}^\circ\text{C}$, $d = 1{,}2\,\text{kg/m}^3$, $c = 1000\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Cerco il tempo $\Delta t$.`,
        R`Il volume: $V = 5 \cdot 4 \cdot 3 = 60\,\text{m}^3$. La massa dell'aria: $m = d \cdot V = 1{,}2\,\text{kg/m}^3 \cdot 60\,\text{m}^3 = 72\,\text{kg}$.`,
        R`Il calore: $Q = m \cdot c \cdot \Delta T = 72 \cdot 1000 \cdot 10\,\text{J} = 720\,000\,\text{J}$.`,
        R`Il tempo: $\Delta t = \dfrac{Q}{P} = \dfrac{720\,000\,\text{J}}{2000\,\text{W}} = 360\,\text{s}$, cioè 6 minuti.`,
        R`Controllo delle unità: joule diviso watt, cioè joule diviso joule al secondo, fa secondi. Nella realtà ci vuole molto di più: muri e mobili assorbono calore, e una parte esce dalle finestre.`
      ],
      risultato: R`$\Delta t = 360\,\text{s} = 6\,\text{min}$ (senza dispersioni)`
    }
  ],
  formulario: [
    { nome: 'Dai gradi Celsius ai kelvin', formula: R`T = t + 273{,}15`, nota: R`$T$ in kelvin, $t$ in gradi Celsius. Le differenze sono uguali: $\Delta T$ in °C vale lo stesso in K. Nelle altre formule $T$ può essere in °C.` },
    { nome: 'Dilatazione lineare', formula: R`\Delta L = \lambda \cdot L_0 \cdot \Delta T`, nota: R`$\lambda$ in $^\circ\text{C}^{-1}$; $\Delta L$ ha l'unità di $L_0$.` },
    { nome: 'Dilatazione volumica', formula: R`\Delta V = \alpha \cdot V_0 \cdot \Delta T \qquad \alpha \approx 3 \cdot \lambda`, nota: R`La seconda vale per i solidi. I liquidi hanno un $\alpha$ loro, di solito molto più grande.` },
    { nome: 'Calore e temperatura', formula: R`Q = m \cdot c \cdot \Delta T`, nota: R`$c$ in $\text{J/(kg}\cdot{}^\circ\text{C)}$; per l'acqua $c = 4186$. $Q$ negativo: il corpo cede calore.` },
    { nome: 'Capacità termica', formula: R`C = m \cdot c \qquad Q = C \cdot \Delta T`, nota: R`In J/°C: è del corpo, non della sostanza.` },
    { nome: 'Equilibrio termico', formula: R`Q_{\text{ced}} = Q_{\text{ass}}`, nota: R`Senza dispersioni: $m_1 \cdot c_1 \cdot (T_1 - T_e) = m_2 \cdot c_2 \cdot (T_e - T_2)$, con 1 il corpo caldo e 2 il freddo.` },
    { nome: 'Temperatura di equilibrio, stessa sostanza', formula: R`T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2}`, nota: R`Media pesata con le masse. Con masse uguali è la media semplice.` },
    { nome: 'Caloria e joule', formula: R`1\,\text{kcal} = 4186\,\text{J}`, nota: R`E quindi $1\,\text{cal} = 4{,}186\,\text{J}$: l'equivalente meccanico della caloria, misurato da Joule.` },
    { nome: 'Lavoro del peso', formula: R`L = m \cdot g \cdot h`, nota: R`Un peso che scende di $h$; in joule. Nell'esperimento di Joule diventa energia interna dell'acqua.` },
    { nome: 'Calore da una potenza', formula: R`Q = P \cdot \Delta t`, nota: R`$P$ in watt ($1\,\text{W} = 1\,\text{J/s}$), $\Delta t$ in secondi.` },
    { nome: 'Calore latente', formula: R`Q = m \cdot L_f \qquad Q = m \cdot L_v`, nota: R`Fusione e vaporizzazione, a temperatura costante. Acqua: $L_f \approx 3{,}34 \cdot 10^5\,\text{J/kg}$, $L_v \approx 2{,}26 \cdot 10^6\,\text{J/kg}$.` },
    { nome: 'Conduzione attraverso una parete', formula: R`\dfrac{Q}{\Delta t} = k \cdot \dfrac{S \cdot \Delta T}{l}`, nota: R`$S$ area, $l$ spessore, $k$ conducibilità in $\text{W/(m}\cdot{}^\circ\text{C)}$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'temperatura', tipo: 'definizione', fronte: R`Che cos'è l'**equilibrio termico**?`, retro: R`La situazione in cui due corpi a contatto hanno raggiunto la stessa temperatura, e lo scambio di calore si ferma.` },
    { id: 'fc-02', sezione: 'temperatura', tipo: 'formula', fronte: R`Come si passa dai gradi Celsius ai **kelvin**?`, retro: R`$T = t + 273{,}15$: si aggiunge 273,15. Per tornare ai gradi Celsius si toglie.` },
    { id: 'fc-03', sezione: 'temperatura', tipo: 'concetto', fronte: R`Una differenza di 15 °C, quanti kelvin vale?`, retro: R`15 K. Kelvin e grado Celsius sono grandi uguali: le differenze non cambiano.` },
    { id: 'fc-04', sezione: 'temperatura', tipo: 'definizione', fronte: R`Che cos'è lo **zero assoluto**?`, retro: R`La temperatura più bassa possibile: 0 K, cioè −273,15 °C.` },
    { id: 'fc-05', sezione: 'calore', tipo: 'definizione', fronte: R`Che cos'è il **calore**?`, retro: R`Energia che passa per una differenza di temperatura; da sola va dal più caldo al più freddo. Si misura in joule.` },
    { id: 'fc-06', sezione: 'calore', tipo: 'concetto', fronte: R`Che cosa misura la **temperatura**, dal punto di vista delle particelle?`, retro: R`La loro agitazione: è legata all'energia cinetica media delle particelle.` },
    { id: 'fc-07', sezione: 'calore', tipo: 'concetto', fronte: R`Un corpo «contiene calore»?`, retro: R`No: contiene **energia interna**. Il calore è solo l'energia che passa da un corpo all'altro.` },
    { id: 'fc-08', sezione: 'dilatazione', tipo: 'formula', fronte: R`La legge della **dilatazione lineare**`, retro: R`$\Delta L = \lambda \cdot L_0 \cdot \Delta T$, con $\lambda$ coefficiente di dilatazione lineare del materiale.` },
    { id: 'fc-09', sezione: 'dilatazione', tipo: 'concetto', fronte: R`Si scalda un anello di metallo. Che cosa fa il foro?`, retro: R`Si allarga: tutto l'anello si ingrandisce, foro compreso.` },
    { id: 'fc-10', sezione: 'dilatazione', tipo: 'formula', fronte: R`Dilatazione volumica di un solido`, retro: R`$\Delta V = \alpha \cdot V_0 \cdot \Delta T$, con $\alpha \approx 3 \cdot \lambda$.` },
    { id: 'fc-11', sezione: 'acqua', tipo: 'concetto', fronte: R`A che temperatura l'acqua liquida ha la densità massima?`, retro: R`A 4 °C. Fra 0 °C e 4 °C, scaldandosi, l'acqua si contrae.` },
    { id: 'fc-12', sezione: 'acqua', tipo: 'concetto', fronte: R`Perché un lago gela dalla superficie?`, retro: R`Sotto i 4 °C l'acqua più fredda è meno densa e resta in alto. Il ghiaccio, ancora meno denso, galleggia e isola il fondo, che resta a circa 4 °C.` },
    { id: 'fc-13', sezione: 'calore-specifico', tipo: 'definizione', fronte: R`Che cos'è il **calore specifico**?`, retro: R`L'energia che scalda di 1 °C un chilogrammo di una sostanza. Si misura in $\text{J/(kg}\cdot{}^\circ\text{C)}$; per l'acqua vale 4186.` },
    { id: 'fc-14', sezione: 'calore-specifico', tipo: 'formula', fronte: R`Il calore per scaldare una massa $m$ di $\Delta T$`, retro: R`$Q = m \cdot c \cdot \Delta T$.` },
    { id: 'fc-15', sezione: 'calore-specifico', tipo: 'definizione', fronte: R`Che cos'è la **capacità termica** di un corpo?`, retro: R`$C = m \cdot c$, in J/°C: il calore che scalda di un grado quel corpo.` },
    { id: 'fc-16', sezione: 'mescolanze', tipo: 'procedura', fronte: R`Come si trova la **temperatura di equilibrio** di due corpi?`, retro: R`Calore ceduto dal caldo = calore preso dal freddo: $m_1 \cdot c_1 \cdot (T_1 - T_e) = m_2 \cdot c_2 \cdot (T_e - T_2)$. Poi si ricava $T_e$.` },
    { id: 'fc-17', sezione: 'mescolanze', tipo: 'formula', fronte: R`Temperatura di equilibrio di due masse della stessa sostanza`, retro: R`$T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2}$: la media pesata con le masse.` },
    { id: 'fc-18', sezione: 'mescolanze', tipo: 'definizione', fronte: R`Che cos'è un **calorimetro**?`, retro: R`Un recipiente isolato, con termometro e agitatore, per misurare scambi di calore e calori specifici.` },
    { id: 'fc-19', sezione: 'joule', tipo: 'formula', fronte: R`L'**equivalente meccanico della caloria**`, retro: R`$1\,\text{cal} = 4{,}186\,\text{J}$, cioè $1\,\text{kcal} = 4186\,\text{J}$.` },
    { id: 'fc-20', sezione: 'joule', tipo: 'concetto', fronte: R`Che cosa mostra l'esperimento di Joule del mulinello?`, retro: R`Che il lavoro dei pesi scalda l'acqua come una fiamma: lavoro e calore sono due modi di trasferire energia.` },
    { id: 'fc-21', sezione: 'stati', tipo: 'concetto', fronte: R`Che cosa fa la temperatura mentre il ghiaccio fonde?`, retro: R`Resta ferma a 0 °C: il calore serve a rompere i legami fra le particelle, non ad agitarle di più.` },
    { id: 'fc-22', sezione: 'stati', tipo: 'formula', fronte: R`Il calore per un **cambiamento di stato**`, retro: R`$Q = m \cdot L_f$ per fondere, $Q = m \cdot L_v$ per vaporizzare, con i calori latenti in J/kg. Per l'acqua $L_f \approx 3{,}34 \cdot 10^5$, $L_v \approx 2{,}26 \cdot 10^6\,\text{J/kg}$.` },
    { id: 'fc-23', sezione: 'stati', tipo: 'definizione', fronte: R`Che cosa sono la **sublimazione** e il **brinamento**?`, retro: R`La sublimazione è il passaggio diretto da solido a gas; il brinamento è il contrario, da gas a solido.` },
    { id: 'fc-24', sezione: 'propagazione', tipo: 'concetto', fronte: R`I tre modi in cui si propaga il calore`, retro: R`Conduzione (contatto, la materia resta ferma), convezione (un fluido che si sposta), irraggiamento (onde elettromagnetiche, anche nel vuoto).` },
    { id: 'fc-25', sezione: 'propagazione', tipo: 'formula', fronte: R`Il calore che passa ogni secondo attraverso una parete`, retro: R`$\dfrac{Q}{\Delta t} = k \cdot \dfrac{S \cdot \Delta T}{l}$: $k$ conducibilità, $S$ area, $l$ spessore.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Esprimi 27 °C in kelvin. Usa 273 al posto di 273,15.`, suggerimenti: [R`$T = t + 273$.`], risposta: { tipo: 'numero', valore: 300, unita: 'K' }, soluzione: [R`$T = (27 + 273)\,\text{K} = 300\,\text{K}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`In una notte d'inverno in Siberia ci sono 250 K. Quanti gradi Celsius sono? Usa 273 al posto di 273,15.`, suggerimenti: [R`Dai kelvin ai gradi Celsius si toglie 273.`], risposta: { tipo: 'numero', valore: -23, unita: '°C' }, soluzione: [R`$t = 250 - 273 = -23$, cioè $-23\,{}^\circ\text{C}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`La temperatura di una stanza sale da 18 °C a 24 °C. Di quanti kelvin è aumentata?`, suggerimenti: [R`Kelvin e gradi Celsius sono grandi uguali: le differenze non cambiano.`], risposta: { tipo: 'numero', valore: 6, unita: 'K', altreUnita: ['°C'] }, soluzione: [R`$\Delta T = 24 - 18 = 6\,{}^\circ\text{C}$, cioè $6\,\text{K}$. Non si aggiunge 273: è una differenza.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una sbarra d'acciaio lunga 5 m si scalda di 20 °C. Di quanti millimetri si allunga? ($\lambda = 1{,}2 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$)`, suggerimenti: [R`$\Delta L = \lambda \cdot L_0 \cdot \Delta T$, poi passa dai metri ai millimetri.`], risposta: { tipo: 'numero', valore: 1.2, unita: 'mm' }, soluzione: [R`$\Delta L = 1{,}2 \cdot 10^{-5} \cdot 5 \cdot 20\,\text{m} = 0{,}0012\,\text{m}$.`, R`In millimetri: $0{,}0012\,\text{m} = 1{,}2\,\text{mm}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un filo di rame lungo 50 m passa da 0 °C a 40 °C. Di quanti centimetri si allunga? ($\lambda = 1{,}7 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$)`, suggerimenti: [R`$\Delta T = 40\,{}^\circ\text{C}$.`, R`Calcola $\Delta L$ in metri e poi moltiplica per 100.`], risposta: { tipo: 'numero', valore: 3.4, unita: 'cm' }, soluzione: [R`$\Delta L = 1{,}7 \cdot 10^{-5} \cdot 50 \cdot 40\,\text{m} = 0{,}034\,\text{m}$.`, R`Cioè $3{,}4\,\text{cm}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 2, testo: R`Un'asta di alluminio lunga 3 m si allunga di 1,8 mm. Di quanti gradi si è scaldata? ($\lambda = 2{,}4 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$)`, suggerimenti: [R`Dalla legge della dilatazione ricava $\Delta T = \dfrac{\Delta L}{\lambda \cdot L_0}$.`, R`Metti $\Delta L$ in metri: $1{,}8\,\text{mm} = 0{,}0018\,\text{m}$.`], risposta: { tipo: 'numero', valore: 25, unita: '°C', altreUnita: ['K'] }, soluzione: [R`$\Delta T = \dfrac{0{,}0018\,\text{m}}{2{,}4 \cdot 10^{-5}\,{}^\circ\text{C}^{-1} \cdot 3\,\text{m}} = \dfrac{0{,}0018}{0{,}000072}\,{}^\circ\text{C} = 25\,{}^\circ\text{C}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Quanto calore serve per scaldare 2 kg di ferro da 20 °C a 30 °C? ($c = 450\,\text{J/(kg}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`$Q = m \cdot c \cdot \Delta T$.`], risposta: { tipo: 'numero', valore: 9000, unita: 'J' }, soluzione: [R`$Q = 2\,\text{kg} \cdot 450\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 10\,{}^\circ\text{C} = 9000\,\text{J}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Quanti kJ servono per scaldare 0,5 kg d'acqua da 20 °C a 60 °C?`, suggerimenti: [R`Per l'acqua $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$.`, R`Trovi i joule: dividi per 1000.`], risposta: { tipo: 'numero', valore: 83.72, unita: 'kJ' }, soluzione: [R`$Q = 0{,}5 \cdot 4186 \cdot 40\,\text{J} = 83\,720\,\text{J}$.`, R`Cioè circa $83{,}7\,\text{kJ}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Per scaldare di 10 °C un blocco di metallo di 2 kg servono 7800 J. Quanto vale il calore specifico del metallo?`, suggerimenti: [R`Ricava $c$ da $Q = m \cdot c \cdot \Delta T$.`], risposta: { tipo: 'numero', valore: 390, unita: 'J/(kg·°C)', altreUnita: ['J/(kg·K)'] }, soluzione: [R`$c = \dfrac{Q}{m \cdot \Delta T} = \dfrac{7800\,\text{J}}{2\,\text{kg} \cdot 10\,{}^\circ\text{C}} = 390\,\text{J/(kg}\cdot{}^\circ\text{C)}$, vicino al rame.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un blocco di alluminio di 2 kg riceve 36 000 J. Di quanti gradi si scalda? ($c = 900\,\text{J/(kg}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`$\Delta T = \dfrac{Q}{m \cdot c}$.`], risposta: { tipo: 'numero', valore: 20, unita: '°C', altreUnita: ['K'] }, soluzione: [R`$\Delta T = \dfrac{36\,000\,\text{J}}{2\,\text{kg} \cdot 900\,\text{J/(kg}\cdot{}^\circ\text{C)}} = 20\,{}^\circ\text{C}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Una pentola di alluminio ha massa 1,5 kg. Quanto vale la sua capacità termica? ($c = 900\,\text{J/(kg}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`$C = m \cdot c$.`], risposta: { tipo: 'numero', valore: 1350, unita: 'J/°C', altreUnita: ['J/K'] }, soluzione: [R`$C = 1{,}5\,\text{kg} \cdot 900\,\text{J/(kg}\cdot{}^\circ\text{C)} = 1350\,\text{J/}{}^\circ\text{C}$: servono 1350 J per scaldarla di un grado.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Mescoli 3 kg d'acqua a 70 °C con 1 kg d'acqua a 10 °C. Senza dispersioni, quanto vale la temperatura di equilibrio?`, suggerimenti: [R`Stessa sostanza: $T_e = \dfrac{m_1 \cdot T_1 + m_2 \cdot T_2}{m_1 + m_2}$.`], risposta: { tipo: 'numero', valore: 55, unita: '°C' }, soluzione: [R`$T_e = \dfrac{3 \cdot 70 + 1 \cdot 10}{3 + 1}\,{}^\circ\text{C} = \dfrac{220}{4}\,{}^\circ\text{C} = 55\,{}^\circ\text{C}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Mescoli 0,2 kg d'acqua a 90 °C con 0,6 kg d'acqua a 30 °C. Senza dispersioni, quanto vale la temperatura di equilibrio?`, suggerimenti: [R`Media pesata con le masse.`, R`Al numeratore: $0{,}2 \cdot 90 + 0{,}6 \cdot 30$.`], risposta: { tipo: 'numero', valore: 45, unita: '°C' }, soluzione: [R`$T_e = \dfrac{0{,}2 \cdot 90 + 0{,}6 \cdot 30}{0{,}8}\,{}^\circ\text{C} = \dfrac{36}{0{,}8}\,{}^\circ\text{C} = 45\,{}^\circ\text{C}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un vasetto di yogurt porta 100 kcal. Quanti kJ sono?`, suggerimenti: [R`$1\,\text{kcal} = 4186\,\text{J} = 4{,}186\,\text{kJ}$.`], risposta: { tipo: 'numero', valore: 418.6, unita: 'kJ' }, soluzione: [R`$100 \cdot 4{,}186\,\text{kJ} = 418{,}6\,\text{kJ}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Un corpo riceve 8372 J di calore. Quante chilocalorie sono?`, suggerimenti: [R`Dai joule alle kcal si divide per 4186.`], risposta: { tipo: 'numero', valore: 2, unita: 'kcal' }, soluzione: [R`$\dfrac{8372}{4186}\,\text{kcal} = 2\,\text{kcal}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Quanti kJ servono per fondere 2 kg di ghiaccio a 0 °C? ($L_f = 334\,\text{kJ/kg}$)`, suggerimenti: [R`$Q = m \cdot L_f$: la temperatura non cambia.`], risposta: { tipo: 'numero', valore: 668, unita: 'kJ' }, soluzione: [R`$Q = 2\,\text{kg} \cdot 334\,\text{kJ/kg} = 668\,\text{kJ}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Quanti kJ servono per far evaporare 0,1 kg d'acqua già a 100 °C? ($L_v = 2260\,\text{kJ/kg}$)`, suggerimenti: [R`$Q = m \cdot L_v$.`], risposta: { tipo: 'numero', valore: 226, unita: 'kJ' }, soluzione: [R`$Q = 0{,}1\,\text{kg} \cdot 2260\,\text{kJ/kg} = 226\,\text{kJ}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un fornellino da 1000 W resta acceso per 2 minuti. Quanti kJ di calore dà, se non si perde niente?`, suggerimenti: [R`$Q = P \cdot \Delta t$, con il tempo in secondi.`], risposta: { tipo: 'numero', valore: 120, unita: 'kJ' }, soluzione: [R`$\Delta t = 2 \cdot 60\,\text{s} = 120\,\text{s}$.`, R`$Q = 1000\,\text{W} \cdot 120\,\text{s} = 120\,000\,\text{J} = 120\,\text{kJ}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`In un mulinello come quello di Joule una massa di 10 kg scende di 2 m, per 10 volte. Quanto lavoro fa il peso in tutto?`, suggerimenti: [R`A ogni discesa il lavoro del peso è $m \cdot g \cdot h$.`, R`Moltiplica per il numero di discese.`], risposta: { tipo: 'numero', valore: 1960, unita: 'J' }, soluzione: [R`Una discesa: $10\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 2\,\text{m} = 196\,\text{J}$.`, R`Dieci discese: $1960\,\text{J}$, che diventano energia interna dell'acqua.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un muro di 5 m² è spesso 0,2 m. Fra le due facce ci sono 10 °C di differenza. Quanti watt passano attraverso il muro? ($k = 0{,}8\,\text{W/(m}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`$\dfrac{Q}{\Delta t} = k \cdot \dfrac{S \cdot \Delta T}{l}$.`], risposta: { tipo: 'numero', valore: 200, unita: 'W' }, soluzione: [R`$\dfrac{Q}{\Delta t} = 0{,}8 \cdot \dfrac{5 \cdot 10}{0{,}2}\,\text{W} = 0{,}8 \cdot 250\,\text{W} = 200\,\text{W}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un marciapiede è fatto di lastre di cemento lunghe 4 m. Durante l'anno la temperatura va da −10 °C a 50 °C. Di quanti millimetri si allunga ogni lastra fra il giorno più freddo e il più caldo? È la larghezza minima del giunto. ($\lambda = 1{,}2 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$)`, suggerimenti: [R`La lastra si allunga fra la temperatura più bassa e la più alta: $\Delta T = 60\,{}^\circ\text{C}$.`, R`Il giunto deve lasciare spazio a tutto l'allungamento.`], risposta: { tipo: 'numero', valore: 2.88, unita: 'mm', tolleranza: 0.15 }, soluzione: [R`$\Delta T = 50 - (-10) = 60\,{}^\circ\text{C}$.`, R`$\Delta L = 1{,}2 \cdot 10^{-5} \cdot 4 \cdot 60\,\text{m} = 0{,}00288\,\text{m} \approx 2{,}9\,\text{mm}$.`, R`In pratica si lasciano giunti di 3 mm o più.`] },
    { id: 'es-02', difficolta: 3, testo: R`Una tanica d'acciaio da 20 L è piena fino all'orlo di benzina a 10 °C. La si lascia al sole e arriva a 30 °C. Quanta benzina esce? Benzina: $\alpha = 9{,}5 \cdot 10^{-4}\,{}^\circ\text{C}^{-1}$; acciaio: $\lambda = 1{,}2 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$.`, suggerimenti: [R`Si dilatano tutte e due: la benzina e la tanica.`, R`Per l'acciaio $\alpha \approx 3 \cdot \lambda$.`, R`Esce la differenza fra i due aumenti di volume.`], risposta: { tipo: 'numero', valore: 0.366, unita: 'L', tolleranza: 0.005 }, soluzione: [R`Benzina: $\Delta V = 9{,}5 \cdot 10^{-4} \cdot 20 \cdot 20\,\text{L} = 0{,}38\,\text{L}$.`, R`Tanica: $\alpha = 3{,}6 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$, $\Delta V = 3{,}6 \cdot 10^{-5} \cdot 20 \cdot 20\,\text{L} \approx 0{,}014\,\text{L}$.`, R`Esce $0{,}38 - 0{,}014 \approx 0{,}37\,\text{L}$: la tanica cresce molto meno della benzina.`] },
    { id: 'es-03', difficolta: 3, testo: R`Un pezzo di ferro di 0,5 kg a 200 °C viene gettato in un secchio con 1 kg d'acqua a 20 °C. Senza dispersioni, quanto vale la temperatura di equilibrio? ($c_\text{ferro} = 450\,\text{J/(kg}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`Le sostanze sono diverse: non basta la media pesata con le masse.`, R`$0{,}5 \cdot 450 \cdot (200 - T_e) = 1 \cdot 4186 \cdot (T_e - 20)$.`], risposta: { tipo: 'numero', valore: 29.2, unita: '°C', tolleranza: 0.3 }, soluzione: [R`Calore ceduto dal ferro = calore preso dall'acqua: $225 \cdot (200 - T_e) = 4186 \cdot (T_e - 20)$.`, R`$45\,000 - 225 \cdot T_e = 4186 \cdot T_e - 83\,720$, quindi $4411 \cdot T_e = 128\,720$.`, R`$T_e \approx 29{,}2\,{}^\circ\text{C}$. Il ferro scende di 170 gradi, l'acqua sale di soli 9: ha una capacità termica molto più grande.`] },
    { id: 'es-04', difficolta: 2, testo: R`In una vasca ci sono 4 kg d'acqua a 20 °C. Quanta acqua a 80 °C bisogna aggiungere per arrivare a 30 °C?`, suggerimenti: [R`Calore ceduto dalla calda = calore preso dalla fredda; $c$ si semplifica.`, R`$m_1 \cdot (80 - 30) = 4 \cdot (30 - 20)$.`], risposta: { tipo: 'numero', valore: 0.8, unita: 'kg' }, soluzione: [R`L'acqua calda scende di 50 °C, la fredda sale di 10 °C.`, R`$m_1 \cdot 50 = 4 \cdot 10 \Rightarrow m_1 = \dfrac{40}{50}\,\text{kg} = 0{,}8\,\text{kg}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`In 0,3 kg di tè a 70 °C si mette un cubetto di ghiaccio di 50 g a 0 °C. Senza dispersioni, quanto vale la temperatura finale? Il tè ha il calore specifico dell'acqua; $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$.`, suggerimenti: [R`Il ghiaccio prima fonde, poi l'acqua che ne viene si scalda fino a $T_e$.`, R`Calore ceduto dal tè: $0{,}3 \cdot 4186 \cdot (70 - T_e)$. Calore preso: $0{,}05 \cdot 3{,}34 \cdot 10^5 + 0{,}05 \cdot 4186 \cdot T_e$.`], risposta: { tipo: 'numero', valore: 48.6, unita: '°C', tolleranza: 0.5 }, soluzione: [R`Fondere il ghiaccio: $0{,}05 \cdot 3{,}34 \cdot 10^5 = 16\,700\,\text{J}$.`, R`Bilancio: $1255{,}8 \cdot (70 - T_e) = 16\,700 + 209{,}3 \cdot T_e$.`, R`$87\,906 - 16\,700 = 1465{,}1 \cdot T_e$, quindi $T_e \approx 48{,}6\,{}^\circ\text{C}$.`, R`Un solo cubetto abbassa il tè di più di 20 gradi. Quasi due terzi del calore ceduto dal tè servono a fondere il ghiaccio.`] },
    { id: 'es-06', difficolta: 2, testo: R`Un bollitore da 2400 W scalda 1,5 L d'acqua da 20 °C a 100 °C. Quanto tempo impiega, se tutta l'energia va nell'acqua?`, suggerimenti: [R`Calcola prima $Q = m \cdot c \cdot \Delta T$, con $m = 1{,}5\,\text{kg}$.`, R`Poi $\Delta t = \dfrac{Q}{P}$.`], risposta: { tipo: 'numero', valore: 209, unita: 's' }, soluzione: [R`$Q = 1{,}5 \cdot 4186 \cdot 80\,\text{J} = 502\,320\,\text{J}$.`, R`$\Delta t = \dfrac{502\,320\,\text{J}}{2400\,\text{W}} \approx 209\,\text{s}$, circa 3 minuti e mezzo.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un sacco di sabbia di 20 kg cade da 5 m di altezza e si ferma a terra. Se tutto il lavoro del peso diventa energia interna della sabbia, di quanto si scalda? ($c = 800\,\text{J/(kg}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`Il lavoro del peso è $m \cdot g \cdot h$.`, R`Poi $\Delta T = \dfrac{L}{m \cdot c}$: la massa compare due volte.`], risposta: { tipo: 'numero', valore: 0.061, unita: '°C', tolleranza: 0.002, altreUnita: ['K'] }, soluzione: [R`$L = 20 \cdot 9{,}8 \cdot 5\,\text{J} = 980\,\text{J}$.`, R`$\Delta T = \dfrac{980}{20 \cdot 800}\,{}^\circ\text{C} \approx 0{,}061\,{}^\circ\text{C}$.`, R`Pochi centesimi di grado: per questo misurare l'equivalente meccanico fu così difficile, e a Joule servirono termometri precisissimi. La massa si semplifica: $\Delta T = \dfrac{g \cdot h}{c}$.`] },
    { id: 'es-08', difficolta: 3, testo: R`Quanti kJ servono per trasformare 0,2 kg di ghiaccio a −10 °C in vapore a 100 °C? Ghiaccio: $c = 2100\,\text{J/(kg}\cdot{}^\circ\text{C)}$; $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$; $L_v = 2{,}26 \cdot 10^6\,\text{J/kg}$.`, suggerimenti: [R`Ci sono quattro tratti: scaldare il ghiaccio, fonderlo, scaldare l'acqua, farla evaporare.`, R`Calcola ogni tratto in joule e poi somma.`], risposta: { tipo: 'numero', valore: 607, unita: 'kJ' }, soluzione: [R`Ghiaccio da −10 °C a 0 °C: $0{,}2 \cdot 2100 \cdot 10 = 4200\,\text{J}$.`, R`Fusione: $0{,}2 \cdot 3{,}34 \cdot 10^5 = 66\,800\,\text{J}$. Acqua da 0 °C a 100 °C: $0{,}2 \cdot 4186 \cdot 100 = 83\,720\,\text{J}$.`, R`Evaporazione: $0{,}2 \cdot 2{,}26 \cdot 10^6 = 452\,000\,\text{J}$.`, R`In tutto $606\,720\,\text{J} \approx 607\,\text{kJ}$. Tre quarti se ne vanno nell'evaporazione.`] },
    { id: 'es-09', difficolta: 2, testo: R`Durante una corsa il corpo deve smaltire 600 J di calore ogni secondo (600 W), e lo fa sudando. Quanti kg di sudore devono evaporare in un'ora? Alla temperatura della pelle $L_v \approx 2{,}4 \cdot 10^6\,\text{J/kg}$.`, suggerimenti: [R`Il calore in un'ora: $Q = P \cdot \Delta t$, con $\Delta t = 3600\,\text{s}$.`, R`Poi $m = \dfrac{Q}{L_v}$.`], risposta: { tipo: 'numero', valore: 0.9, unita: 'kg' }, soluzione: [R`$Q = 600\,\text{W} \cdot 3600\,\text{s} = 2{,}16 \cdot 10^6\,\text{J}$.`, R`$m = \dfrac{2{,}16 \cdot 10^6\,\text{J}}{2{,}4 \cdot 10^6\,\text{J/kg}} = 0{,}9\,\text{kg}$: quasi un litro d'acqua da bere.`] },
    { id: 'es-10', difficolta: 2, testo: R`Il vetro di una finestra ha area 1,5 m² ed è spesso 5 mm. Fra la faccia interna e quella esterna del vetro ci sono 1,5 °C di differenza. Quanti watt passano attraverso il vetro? ($k = 1\,\text{W/(m}\cdot{}^\circ\text{C)}$)`, suggerimenti: [R`Lo spessore va in metri: $5\,\text{mm} = 0{,}005\,\text{m}$.`], risposta: { tipo: 'numero', valore: 450, unita: 'W' }, soluzione: [R`$\dfrac{Q}{\Delta t} = 1 \cdot \dfrac{1{,}5 \cdot 1{,}5}{0{,}005}\,\text{W} = 450\,\text{W}$.`, R`Tanto, per una sola finestra: per questo si usano i doppi vetri, con uno strato d'aria che isola.`] },
    { id: 'es-11', difficolta: 2, testo: R`Una sbarra lunga 2 m, scaldata di 20 °C, si allunga di 0,68 mm. Guardando la tabella dei coefficienti, di che materiale è fatta?`, suggerimenti: [R`Ricava $\lambda = \dfrac{\Delta L}{L_0 \cdot \Delta T}$, con $\Delta L$ in metri.`], risposta: { tipo: 'testo', accettate: ['rame', 'di rame', 'il rame', 'è di rame'], segnaposto: 'Il materiale' }, soluzione: [R`$\lambda = \dfrac{0{,}00068\,\text{m}}{2\,\text{m} \cdot 20\,{}^\circ\text{C}} = 1{,}7 \cdot 10^{-5}\,{}^\circ\text{C}^{-1}$.`, R`È il coefficiente del rame.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Una scintilla a 1000 °C cade sulla mano e quasi non si sente. Perché?`, opzioni: [R`Ha una temperatura alta ma una massa piccolissima: cede pochissima energia`, R`La sua temperatura è più bassa di quanto sembra`, R`La pelle non sente le temperature sopra i 100 °C`, R`Il calore delle scintille non è energia`], corretta: 0, spiegazione: R`Il calore ceduto dipende dalla temperatura ma anche dalla massa: la scintilla ha una massa di un decimo di milligrammo e cede circa 0,04 J. La temperatura è davvero alta, e il calore è sempre energia.` },
    { id: 'q-02', domanda: R`Che cosa misura la temperatura di un corpo?`, opzioni: [R`Il calore che contiene`, R`L'agitazione delle sue particelle`, R`La sua energia interna totale`, R`La sua massa`], corretta: 1, spiegazione: R`La temperatura è legata all'energia cinetica media delle particelle. L'energia interna è quella di tutte le particelle insieme e dipende anche da quante sono. Un corpo non contiene calore.` },
    { id: 'q-03', domanda: R`Due corpi a temperature diverse sono messi a contatto, isolati dal resto. Che cosa succede?`, opzioni: [R`Il freddo passa dal corpo freddo a quello caldo`, R`Il calore passa dal corpo con più massa a quello con meno massa`, R`Il calore passa dal più caldo al più freddo finché le temperature sono uguali`, R`Il calore passa dal corpo con più energia interna a quello con meno`], corretta: 2, spiegazione: R`Il calore va da solo dal corpo a temperatura più alta a quello a temperatura più bassa, fino all'equilibrio termico. Conta la temperatura, non l'energia interna né la massa; il freddo non è qualcosa che si sposta.` },
    { id: 'q-04', domanda: R`Una differenza di temperatura di 30 °C, quanto vale in kelvin?`, opzioni: [R`303 K`, R`243 K`, R`−243 K`, R`30 K`], corretta: 3, spiegazione: R`Kelvin e grado Celsius sono grandi uguali, quindi le differenze hanno lo stesso numero. 273 si aggiunge alle temperature, non alle differenze.` },
    { id: 'q-05', domanda: R`Si scalda una lastra di metallo con un foro rotondo nel mezzo. Che cosa succede al foro?`, opzioni: [R`Si allarga`, R`Si stringe`, R`Resta uguale`, R`Diventa ovale`], corretta: 0, spiegazione: R`Tutta la lastra si dilata, come una foto ingrandita: anche il foro diventa più grande. Non si stringe, perché il metallo intorno non «cresce verso l'interno».` },
    { id: 'q-06', domanda: R`Fra 0 °C e 4 °C, scaldando l'acqua, la sua densità…`, opzioni: [R`diminuisce`, R`aumenta`, R`resta uguale`, R`prima diminuisce, poi aumenta`], corretta: 1, spiegazione: R`Fra 0 °C e 4 °C l'acqua si contrae: il volume cala e la densità $d = m/V$ cresce. Ha il massimo a 4 °C; poi, scaldandosi, si dilata come le altre sostanze.` },
    { id: 'q-07', domanda: R`Perché d'estate la sabbia scotta e l'acqua del mare è fresca?`, opzioni: [R`Perché il Sole scalda meno l'acqua`, R`Perché l'acqua riflette tutta la luce`, R`Perché la sabbia è più scura`, R`Perché l'acqua ha un calore specifico molto più grande`], corretta: 3, spiegazione: R`A parità di energia ricevuta, l'acqua si scalda circa cinque volte meno della sabbia: il suo calore specifico è circa 4186 contro 800. Il Sole dà a tutte e due la stessa energia per metro quadrato.` },
    { id: 'q-08', domanda: R`Qual è la differenza fra calore specifico e capacità termica?`, opzioni: [R`Sono due nomi della stessa grandezza`, R`Il calore specifico è della sostanza; la capacità termica è del corpo e dipende dalla massa`, R`La capacità termica si misura in °C, il calore specifico in J`, R`Il calore specifico vale solo per l'acqua`], corretta: 1, spiegazione: R`Il calore specifico $c$ riguarda 1 kg della sostanza; la capacità termica è $C = m \cdot c$, in J/°C, e riguarda un corpo preciso. Ogni sostanza ha il suo calore specifico.` },
    { id: 'q-09', domanda: R`Mescoli 1 kg d'acqua a 80 °C con 4 kg d'acqua a 20 °C. La temperatura di equilibrio è…`, opzioni: [R`50 °C, la media`, R`più vicina a 80 °C`, R`più vicina a 20 °C`, R`20 °C esatti`], corretta: 2, spiegazione: R`La temperatura di equilibrio è la media pesata con le masse: l'acqua fredda è di più, quindi $T_e$ è più vicina a 20 °C (vale 32 °C). Sarebbe la media solo con masse uguali.` },
    { id: 'q-10', domanda: R`Che cosa dimostra l'esperimento di Joule del mulinello?`, opzioni: [R`Che il calore è un fluido invisibile`, R`Che l'acqua non si può scaldare senza fuoco`, R`Che il lavoro e il calore sono due modi di dare energia`, R`Che i pesi che scendono si raffreddano`], corretta: 2, spiegazione: R`Il lavoro dei pesi, attraverso le palette, scalda l'acqua come farebbe una fiamma: $1\,\text{kcal} = 4186\,\text{J}$. Il calorico, il fluido del calore, non esiste.` },
    { id: 'q-11', domanda: R`Una chilocaloria equivale a…`, opzioni: [R`4186 J`, R`4,186 J`, R`1000 J`, R`418,6 J`], corretta: 0, spiegazione: R`$1\,\text{kcal} = 4186\,\text{J}$, il calore che scalda di 1 °C un chilogrammo d'acqua. 4,186 J è una caloria sola.` },
    { id: 'q-12', domanda: R`Si scalda del ghiaccio a −10 °C con un fornello sempre uguale. Mentre il ghiaccio fonde, la temperatura…`, opzioni: [R`sale più in fretta di prima`, R`sale più piano di prima`, R`scende`, R`resta ferma a 0 °C`], corretta: 3, spiegazione: R`Durante la fusione il calore serve a rompere i legami fra le particelle, non ad agitarle di più. La temperatura resta a 0 °C finché tutto il ghiaccio è fuso.` },
    { id: 'q-13', domanda: R`Perché una scottatura da vapore a 100 °C è peggio di una da acqua a 100 °C?`, opzioni: [R`Perché il vapore è più caldo dell'acqua`, R`Perché il vapore, condensando sulla pelle, cede anche il calore latente`, R`Perché il vapore pesa di più`, R`Perché il vapore conduce meglio il calore`], corretta: 1, spiegazione: R`Hanno la stessa temperatura, ma il vapore che condensa restituisce $2{,}26 \cdot 10^6\,\text{J}$ per ogni chilogrammo, prima ancora di raffreddarsi. Il vapore conduce il calore peggio dell'acqua.` },
    { id: 'q-14', domanda: R`Il calore del Sole arriva sulla Terra attraverso il vuoto. In che modo?`, opzioni: [R`Per conduzione`, R`Per convezione`, R`Per irraggiamento`, R`Non arriva: è la Terra che si scalda da sola`], corretta: 2, spiegazione: R`Nel vuoto non ci sono particelle, quindi niente conduzione e niente convezione. Le onde elettromagnetiche invece viaggiano anche nel vuoto, alla velocità della luce.` },
    { id: 'q-15', domanda: R`In una stanza, la maniglia di metallo sembra più fredda della porta di legno. Perché?`, opzioni: [R`Il metallo conduce meglio e porta via più in fretta il calore della mano`, R`Il metallo ha una temperatura più bassa`, R`Il legno produce calore`, R`Il metallo trattiene il freddo della notte`], corretta: 0, spiegazione: R`Sono alla stessa temperatura, quella della stanza. Il metallo è un buon conduttore e sottrae calore alla mano più in fretta: il tatto sente questo, non la temperatura.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Temperatura e calore non sono la stessa cosa: la temperatura si misura in °C o in K, il calore è energia e si misura in joule.` },
    { tipo: 'errore', testo: R`Le differenze di temperatura non si convertono aggiungendo 273: un aumento di 10 °C è un aumento di 10 K.` },
    { tipo: 'errore', testo: R`La temperatura di equilibrio è la media delle due solo con masse uguali della stessa sostanza. Negli altri casi pesa di più il corpo con la capacità termica più grande.` },
    { tipo: 'trucco', testo: R`$4186$ è il numero da ricordare: è il calore specifico dell'acqua in $\text{J/(kg}\cdot{}^\circ\text{C)}$ e il numero di joule in una chilocaloria.` },
    { tipo: 'trucco', testo: R`Un litro d'acqua ha massa 1 kg: nei problemi con i litri d'acqua la massa è già pronta.` },
    { tipo: 'metodo', testo: R`Nei problemi di equilibrio scrivi da una parte il calore ceduto e dall'altra quello preso, tutti e due positivi: $m_1 \cdot c_1 \cdot (T_1 - T_e) = m_2 \cdot c_2 \cdot (T_e - T_2)$.` },
    { tipo: 'metodo', testo: R`Se c'è un cambiamento di stato, dividi il problema in tratti: in quelli in cui la temperatura cambia usi $m \cdot c \cdot \Delta T$, nei tratti piatti $m \cdot L_f$ o $m \cdot L_v$. Poi sommi.` },
    { tipo: 'errore', testo: R`Nella dilatazione le unità di $L_0$ e $\Delta L$ sono le stesse: se metti $L_0$ in metri, $\Delta L$ esce in metri. Passa ai millimetri solo alla fine.` }
  ],
  aneddoti: [
    { fisico: 'Anders Celsius', anni: '1701–1744', titolo: 'La scala che nacque a testa in giù', testo: R`Anders Celsius era un astronomo svedese dell'Università di Uppsala. Nel 1742 presentò all'Accademia delle scienze di Stoccolma una scala per i termometri, con due punti fissi: la neve che fonde e l'acqua che bolle. Controllò con cura che il punto di fusione non cambiasse con il luogo. Notò invece che quello di ebollizione dipende dalla pressione dell'aria. C'era però una sorpresa: nella sua scala l'acqua bolliva a 0 gradi e il ghiaccio fondeva a 100. Più era caldo, più il numero scendeva. Celsius morì due anni dopo. Poco dopo la scala fu capovolta, come la usiamo oggi; fra i primi a usarla così ci fu il botanico Linneo. Fino al 1948 si chiamò scala centigrada.`, legame: R`È la scala Celsius, con i suoi due punti fissi: 0 °C e 100 °C.` },
    { fisico: 'Joseph Black', anni: '1728–1799', titolo: 'Il ghiaccio che si scioglie piano', testo: R`Joseph Black, medico e chimico scozzese, insegnava a Glasgow. Verso il 1761 si chiese perché la neve, in primavera, non si sciolga tutta in un colpo. Mise in una stanza fresca, a circa 8 °C, un recipiente di ghiaccio e uno di acqua appena sopra lo zero, con la stessa massa. L'acqua si scaldò di qualche grado in mezz'ora. Il ghiaccio impiegò più di dieci ore per sciogliersi, e intanto il suo termometro restava fermo. Black capì che il ghiaccio assorbiva tanto calore senza scaldarsi: lo chiamò calore «latente», cioè nascosto. Distinse anche fra temperatura e quantità di calore. Non pubblicò quasi nulla: le sue lezioni uscirono a stampa nel 1803, dopo la sua morte. A Glasgow era suo amico il giovane James Watt, che riparava gli strumenti dell'università.`, legame: R`È il calore latente: durante la fusione il calore entra, ma la temperatura resta ferma.` },
    { fisico: 'Benjamin Thompson (conte di Rumford)', anni: '1753–1814', titolo: 'I cannoni che facevano bollire l\'acqua', testo: R`Benjamin Thompson era nato nel Massachusetts. Dopo una vita avventurosa divenne ministro in Baviera e conte di Rumford. A Monaco dirigeva l'arsenale, dove si forava il metallo per fare i cannoni. Notò che le punte scaldavano moltissimo il metallo e i trucioli. Nel 1798 descrisse un esperimento: una punta smussata, fatta girare dai cavalli, dentro una cassa piena d'acqua. Dopo circa due ore e mezza l'acqua bolliva, senza fuoco. Rumford raccontò lo stupore dei presenti. Finché i cavalli giravano, il calore non finiva mai. Allora, scrisse, il calore non può essere una sostanza: deve essere un moto. Qualche anno dopo sposò Marie-Anne Paulze, vedova di Lavoisier, il chimico che aveva dato il nome al «calorico». Il matrimonio durò poco.`, legame: R`È l'idea che il lavoro produca calore, misurata poi con precisione da Joule.` },
    { fisico: 'James Dewar', anni: '1842–1923', titolo: 'Il thermos inventato per i gas liquidi', testo: R`Lo scozzese James Dewar lavorava a Londra, alla Royal Institution, e studiava i gas a temperature bassissime. Per conservarli liquidi, nel 1892 inventò un recipiente speciale. Erano due bottiglie di vetro, una dentro l'altra, con il vuoto in mezzo. Le pareti erano argentate. Il vuoto fermava la conduzione e la convezione, l'argento rifletteva l'irraggiamento. Con questi recipienti Dewar riuscì, nel 1898, a liquefare per primo l'idrogeno. Non brevettò la sua invenzione. Nel 1904 due soffiatori di vetro tedeschi fondarono una ditta per venderla come bottiglia per le bevande, e la chiamarono Thermos. Dewar fece causa, ma la perse. Nei laboratori quei recipienti si chiamano ancora «vasi Dewar».`, legame: R`Il thermos blocca le tre strade del calore: conduzione, convezione e irraggiamento.` }
  ]
});
})();
