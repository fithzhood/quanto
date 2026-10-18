/* Quanto — La luce come onda (quarto anno): velocità e natura della luce, colori e lunghezza d'onda, Young e le frange,
   diffrazione da una fenditura, reticolo, lamine sottili, polarizzazione e legge di Malus. Contratto in SCHEMA.md,
   modello cinematica.js. Simboli come in onde.js (λ, f, Δr per la differenza di cammino, a per la larghezza di una
   fessura) e come nei video luce/*: d è la distanza fra le fenditure o il passo del reticolo (qui non c'è densità),
   n l'ordine nelle formule di Young e del reticolo (come nei video), n l'indice di rifrazione nella lamina (video bolla):
   per le lamine e la fenditura singola l'intero si chiama m. Il campo elettrico E è viola come nei video.
   L'ottica geometrica (riflessione, rifrazione, lenti) sta in ottica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/luce.js */
(function () {
const R = String.raw;

/* il reticolo visto dall'alto: i raggi degli ordini da −3 a 3, solo quelli con |n|·λ ≤ d (λ in nm, N righe al mm) */
function raggioOrdine(n) {
  const s = '(' + n + ')*lam*N/1000000', esiste = 'abs(' + n + ')*lam*N <= 1000000';
  return { tipo: 'segmento', da: [0, 0], a: ['se(' + esiste + ', sqrt(1 - (' + s + ')^2), 0)', 'se(' + esiste + ', ' + s + ', 0)'], colore: 1 };
}
function nomeOrdine(n) {
  /* il nome si scrive solo se l'ordine esiste e, per n ≥ 1, se gli ordini non sono troppo fitti (seni distanti almeno 0,15) */
  const s = n + '*lam*N/1000000', esiste = n === 0 ? '0 <= 1' : 'se(lam*N >= 150000, ' + n + '*lam*N, 2000000) <= 1000000';
  return { tipo: 'testo', p: ['se(' + esiste + ', 1.13*sqrt(1 - (' + s + ')^2), 0)', 'se(' + esiste + ', 1.13*' + s + ' - 0.03, 0)'],
           testo: '{{? ' + esiste + ' | n = ' + n + ' | }}', ancora: 'start' };
}

QUANTO.registra({
  id: 'luce',
  titolo: 'La luce come onda',
  introduzione: R`La luce è la prima cosa che vediamo, eppure per secoli nessuno ha saputo dire che cosa fosse. Un getto di particelle minuscole, come pensava Newton? Oppure un'onda, come sosteneva Huygens? La risposta è arrivata all'inizio dell'Ottocento, con un esperimento sorprendente: due fasci di luce che, sommati, fanno buio.

Qui si studia la luce come onda. Pensa ai colori di una bolla di sapone, o all'arcobaleno su un CD. Pensa agli occhiali da sole che spengono i riflessi del mare. Sono tutti effetti delle onde. Con un laser e un righello si misura perfino la lunghezza d'onda della luce: è meno di un millesimo di millimetro.

Servono le idee del capitolo sulle onde: lunghezza d'onda, frequenza, interferenza, diffrazione. Dall'ottica serve l'indice di rifrazione.`,
  inBreve: [
    R`La luce è un'onda elettromagnetica. Nel vuoto viaggia a $c \approx 3 \cdot 10^8\,\text{m/s}$ e vale $c = \lambda \cdot f$. Il visibile va da 400 nm (violetto) a 700 nm (rosso).`,
    R`Nell'esperimento di Young le frange sono chiare dove la differenza di cammino è $n \cdot \lambda$, scure dove è $\left(n + \tfrac{1}{2}\right) \cdot \lambda$. Due frange chiare vicine distano $\Delta y = \dfrac{\lambda \cdot L}{d}$.`,
    R`Una fenditura sola dà una macchia centrale larga: il primo buio è dove $a \cdot \sin\theta = \lambda$. Più la fenditura è stretta, più la luce si allarga.`,
    R`Un reticolo manda ogni colore a un angolo diverso: $d \cdot \sin\theta = n \cdot \lambda$. Il rosso devia più del violetto.`,
    R`In una lamina sottile si sommano due riflessi, e il colore dipende dallo spessore. Riflettendosi su un mezzo con indice più grande, l'onda si capovolge.`,
    R`La luce è un'onda trasversale e si può polarizzare. Fra due polarizzatori passa $I = I_0 \cdot \cos^2\theta$.`
  ],
  sezioni: [
    {
      id: 'natura',
      titolo: 'Onda o corpuscolo?',
      testo: R`Che cosa esce, di preciso, da una lampadina accesa? Per Isaac Newton la luce era fatta di **corpuscoli**: palline minuscole sparate dalla sorgente. Così si capiva perché va dritta e lascia ombre nette. Christiaan Huygens, negli stessi anni, pensava invece a un'onda.

Le due idee spiegavano bene la riflessione e la rifrazione. Però davano previsioni diverse su un punto preciso: la velocità della luce nell'acqua. Per i corpuscoli doveva essere più grande che nell'aria, per le onde più piccola. Nel 1850 Léon Foucault la misurò: nell'acqua la luce va più piano.

>* La luce è un'**onda elettromagnetica**: un campo elettrico e un campo magnetico che oscillano e avanzano insieme. Viaggia anche nel vuoto, senza bisogno di un mezzo.

Il campo elettrico e il campo magnetico si studiano negli argomenti di elettromagnetismo. Qui basta pensarli come una grandezza che oscilla di traverso, come la corda.

Nel vuoto la luce va alla velocità più grande che esista:

$$c = 299\,792\,458\,\text{m/s} \approx 3 \cdot 10^8\,\text{m/s}$$

Il valore è esatto per definizione. Dal 1983 il metro si definisce proprio a partire da $c$.

Esempio. Quando è più vicino, Marte dista circa $5{,}6 \cdot 10^{10}$ m. Quanto impiega un segnale radio, che va come la luce, ad arrivare a un robot su Marte?

~ \Delta t = \dfrac{\Delta s}{c} :: moto uniforme, alla velocità della luce
~ \Delta t = \dfrac{5{,}6 \cdot 10^{10}\,\text{m}}{3 \cdot 10^8\,\text{m/s}} :: i metri si semplificano, restano i secondi
~ \Delta t \approx \evidb{187\,\text{s}} :: più di tre minuti: il robot non si può guidare in diretta

>! La luce non ha bisogno di aria. Il suono nel vuoto non passa, la luce sì: arriva dal Sole attraverso lo spazio vuoto.

La prova più forte delle onde, però, è un'altra. Solo le onde fanno **interferenza**: due onde che si incontrano possono annullarsi. Se due fasci di luce sommati danno buio, la luce è un'onda. È l'esperimento di Young, due sezioni più avanti.

> Nel Novecento la storia si è complicata. Einstein ha mostrato che la luce cede energia a pacchetti, i **fotoni**. La luce viaggia come un'onda, ma con la materia scambia energia come se fosse fatta di particelle. È il **dualismo onda–corpuscolo**, della fisica dei quanti.

?? Per la teoria dei corpuscoli di Newton, nell'acqua la luce doveva andare…
[x] più veloce che nell'aria
[ ] più piano che nell'aria
[ ] alla stessa velocità che nell'aria
=> Newton spiegava la rifrazione con un'attrazione dell'acqua sui corpuscoli, che li accelerava. Foucault misurò il contrario: nell'acqua la luce rallenta, come prevede la teoria delle onde.`
    },
    {
      id: 'colori',
      titolo: 'Colori, lunghezza d\'onda e frequenza',
      testo: R`Un raggio di sole attraverso un prisma si apre in tutti i colori dell'arcobaleno. La luce bianca è un miscuglio. Ogni colore è un'onda con la sua **lunghezza d'onda** $\lambda$.

| colore | lunghezza d'onda |
|---|---|
| violetto | 400–450 nm |
| blu | 450–490 nm |
| verde | 490–570 nm |
| giallo | 570–590 nm |
| arancio | 590–630 nm |
| rosso | 630–700 nm |

Il nanometro è un miliardesimo di metro: $1\,\text{nm} = 10^{-9}\,\text{m}$. Il visibile sta fra 400 e 700 nm. Sono meno di un millesimo di millimetro: per questo gli effetti d'onda della luce non si notano tutti i giorni.

>* Per la luce nel vuoto vale $c = \lambda \cdot f$. Il colore è fissato dalla frequenza $f$: a frequenza più alta corrisponde una lunghezza d'onda più corta.

Qui $f$ è la frequenza, non la distanza focale delle lenti.

Esempio. Un puntatore laser verde ha $\lambda = 532\,\text{nm}$. Qual è la sua frequenza?

~ f = \dfrac{c}{\lambda} :: dalla relazione $c = \lambda \cdot f$
~ f = \dfrac{3 \cdot 10^8\,\text{m/s}}{532 \cdot 10^{-9}\,\text{m}} :: i nanometri vanno scritti in metri
~ f \approx \evidb{5{,}6 \cdot 10^{14}\,\text{Hz}} :: più di cinquecentomila miliardi di oscillazioni al secondo

Tutto il visibile sta fra $4{,}3 \cdot 10^{14}\,\text{Hz}$ (rosso) e $7{,}5 \cdot 10^{14}\,\text{Hz}$ (violetto). Oltre il violetto c'è l'ultravioletto, sotto il rosso l'infrarosso: luce che l'occhio non vede.

### Nella materia

Nel vetro o nell'acqua la luce va più piano: $v = \dfrac{c}{n}$, dove $n$ è l'**indice di rifrazione** del materiale. Come ogni onda che cambia mezzo, la luce conserva la frequenza. Si accorcia invece la lunghezza d'onda:

$$\lambda_n = \dfrac{\lambda}{n}$$

Qui $\lambda$ è la lunghezza d'onda nel vuoto; nell'aria è quasi la stessa. Nell'acqua, con $n = 1{,}33$, la luce verde di 532 nm è lunga 400 nm. Il colore però non cambia, perché la frequenza è quella di prima.

[[grafico:mezzo]]

>! Sott'acqua il verde non diventa violetto. La lunghezza d'onda si accorcia, ma il colore lo decide la frequenza, e la frequenza resta la stessa.

?? Due luci: una con $\lambda = 450\,\text{nm}$, l'altra con $\lambda = 650\,\text{nm}$. Quale ha la frequenza più alta?
[x] quella da 450 nm
[ ] quella da 650 nm
[ ] hanno la stessa frequenza, perché vanno alla stessa velocità
=> Nel vuoto vanno tutte e due a $c$. Da $f = c / \lambda$: la lunghezza d'onda più corta ha la frequenza più alta. È la luce blu.`
    },
    {
      id: 'young',
      titolo: 'L\'esperimento di Young',
      testo: R`Due torce puntate sullo stesso muro fanno una macchia più chiara. Luce più luce dà sempre più luce, sembra. All'inizio dell'Ottocento Thomas Young mostrò che non è sempre così.

[[video:luce/young]]

L'esperimento è semplice. Una luce di un colore solo arriva su una parete con due **fenditure**, due tagli sottili e vicini. Da ciascuna riparte un'onda che si allarga, per la diffrazione. Le due onde si sovrappongono su uno schermo. Lo schermo non è illuminato in modo uniforme: compaiono strisce chiare e scure, le **frange**.

Le due onde vengono dalla stessa luce, quindi partono sempre cresta con cresta. Si dice che le due fenditure sono sorgenti **coerenti**. In un punto dello schermo conta la **differenza di cammino** $\Delta r$: di quanto un percorso è più lungo dell'altro.

>* Due fenditure illuminate dalla stessa luce danno una frangia **chiara** dove $\Delta r = n \cdot \lambda$. La frangia è **scura** dove $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$. In tutte e due $n = 0, 1, 2, \dots$

>! Qui $n$ è un numero intero, l'ordine della frangia. Non è l'indice di rifrazione, che ha la stessa lettera.

Al centro dello schermo i due percorsi sono uguali: $\Delta r = 0$, frangia chiara. Salendo, $\Delta r$ cresce. A mezza lunghezza d'onda c'è buio, a una lunghezza d'onda intera di nuovo luce. E così via, alternando.

Esempio. Luce di 560 nm. In un punto dello schermo la differenza di cammino è 1400 nm.

~ \dfrac{\Delta r}{\lambda} = \dfrac{1400\,\text{nm}}{560\,\text{nm}} :: quante lunghezze d'onda stanno nella differenza di cammino
~ \dfrac{\Delta r}{\lambda} = 2{,}5 = 2 + \tfrac{1}{2} :: un numero intero più mezzo
~ \text{frangia } \evidb{\text{scura}} :: cresta con gola: è la terza frangia scura dal centro

>! Nelle frange scure la luce non sparisce. Quella che manca lì si trova in più nelle frange chiare. Con due fasci uguali, al centro di una chiara l'intensità è il doppio della somma delle due luci separate.

> Perché due lampadine non danno frange? Ognuna emette onde che cambiano fase di continuo, a caso. Le frange ci sarebbero, ma si spostano così in fretta che l'occhio vede solo la media. Per questo Young divise in due la luce di una sola sorgente.

?? Due fenditure, stessa luce. In un punto dello schermo la differenza di cammino è di 3 lunghezze d'onda. Che cosa si vede?
[x] una frangia chiara
[ ] una frangia scura
[ ] una zona illuminata a metà
=> 3 è un numero intero: le onde arrivano cresta con cresta e si rinforzano. Per il buio serve un intero più mezzo.`
    },
    {
      id: 'frange',
      titolo: 'Dove cadono le frange',
      testo: R`Le frange di Young sono vicinissime: pochi millimetri l'una dall'altra. Proprio misurando quei millimetri si ricava la lunghezza d'onda della luce.

Chiamiamo $d$ la distanza fra le due fenditure e $L$ la distanza dello schermo. Un punto $P$ dello schermo, ad altezza $y$ dal centro, si vede dalle fenditure sotto un angolo $\theta$. L'angolo $\theta$ si misura dalla direzione dritta, perpendicolare alla parete.

Lo schermo è lontanissimo, quindi i due raggi verso $P$ sono quasi paralleli. Dalla fenditura alta si traccia la perpendicolare al raggio basso. Resta un triangolino rettangolo, con ipotenusa $d$ e un angolo uguale a $\theta$. Il cateto opposto a quell'angolo è il tratto in più: $\Delta r = d \cdot \sin\theta$.

[[grafico:triangolo]]

[[video:luce/frange]]

Gli angoli sono piccolissimi, frazioni di grado. Allora $\sin\theta$ è quasi uguale a $\tan\theta = y / L$.

~ d \cdot \sin\theta = n \cdot \lambda :: la condizione per la frangia chiara numero n
~ d \cdot \dfrac{y_n}{L} = n \cdot \lambda :: con gli angoli piccoli, $\sin\theta \approx \dfrac{y}{L}$
~ y_n = \dfrac{n \cdot \lambda \cdot L}{d} :: l'altezza della frangia n sullo schermo
~ \Delta y = y_{n+1} - y_n = \evidb{\dfrac{\lambda \cdot L}{d}} :: le frange sono equidistanti

>* Con due fenditure a distanza $d$, le frange chiare cadono agli angoli con $d \cdot \sin\theta = n \cdot \lambda$. Su uno schermo a distanza $L$, due frange chiare vicine distano $\Delta y = \dfrac{\lambda \cdot L}{d}$.

Esempio, quello del video. Un laser rosso illumina due fenditure con $d = 0{,}25\,\text{mm}$. Lo schermo è a $L = 2\,\text{m}$. Dieci intervalli fra le frange misurano 52 mm: quindi $\Delta y = 5{,}2\,\text{mm}$.

~ \lambda = \dfrac{\Delta y \cdot d}{L} :: giro la formula delle frange
~ \lambda = \dfrac{5{,}2\,\text{mm} \cdot 0{,}25\,\text{mm}}{2000\,\text{mm}} :: tutto in millimetri
~ \lambda = 6{,}5 \cdot 10^{-4}\,\text{mm} :: un'unità di lunghezza resta, le altre si semplificano
~ \lambda = \evidb{650\,\text{nm}} :: il rosso del laser, misurato con un righello

La formula dice come cambiano le frange.

- Luce con $\lambda$ più corta, verde invece di rossa: frange più strette.
- Schermo più lontano: frange più larghe.
- Fenditure più vicine: frange più larghe.

[[grafico:frange]]

>! Con $d$ più piccola le frange si **allargano**. Sembra al contrario, ma è la regola della diffrazione: più i dettagli sono piccoli, più la luce si apre.

?? In un esperimento di Young si avvicinano le due fenditure, e $d$ si dimezza. Le frange…
[ ] si stringono della metà
[x] diventano larghe il doppio
[ ] restano uguali
=> Da $\Delta y = \lambda \cdot L / d$: con $d$ dimezzata, $\Delta y$ raddoppia.`
    },
    {
      id: 'fenditura',
      titolo: 'La diffrazione da una fenditura',
      testo: R`Basta anche una fenditura sola per avere frange. Un laser puntato su una fessura larga un decimo di millimetro non lascia sullo schermo una riga sottile. Lascia una macchia centrale larga e luminosa, con ai lati macchie più deboli separate da strisce buie.

Il motivo è il principio di Huygens. Ogni punto della fenditura fa da sorgente di onde. In certe direzioni le onde della metà alta e quelle della metà bassa si annullano a coppie. Lì c'è buio.

~ \tfrac{a}{2} \cdot \sin\theta = \tfrac{\lambda}{2} :: un punto della metà alta e il suo compagno, a distanza a/2
~ a \cdot \sin\theta = \lambda :: tutte le coppie si annullano: è il primo buio
~ y_1 = \dfrac{\lambda \cdot L}{a} :: sullo schermo, con gli angoli piccoli come per Young

>* Una fenditura larga $a$ dà frange scure dove $a \cdot \sin\theta = m \cdot \lambda$. Qui $m$ è un intero da 1 in su. La macchia chiara centrale è larga il doppio delle altre.

Al centro, con $\theta = 0$, tutte le onde arrivano insieme: è la macchia più luminosa. Per questo $m = 0$ non dà buio.

Esempio. Luce di 500 nm attraversa una fenditura larga $a = 0{,}2\,\text{mm}$. Lo schermo è a 2 m.

~ y_1 = \dfrac{\lambda \cdot L}{a} :: il primo buio
~ y_1 = \dfrac{500 \cdot 10^{-9}\,\text{m} \cdot 2\,\text{m}}{0{,}2 \cdot 10^{-3}\,\text{m}} :: tutto in metri
~ y_1 = 5 \cdot 10^{-3}\,\text{m} = 5\,\text{mm} :: dal centro al primo buio
~ 2 \cdot y_1 = \evidb{10\,\text{mm}} :: la larghezza della macchia centrale, da un buio all'altro

[[grafico:fenditura]]

>! Attenzione al confronto con Young. Con due fenditure, $d \cdot \sin\theta = n \cdot \lambda$ dà le frange **chiare**. Con una fenditura, $a \cdot \sin\theta = m \cdot \lambda$ dà quelle **scure**. Le formule si somigliano, ma dicono cose opposte.

> Nelle fenditure vere di Young ci sono tutti e due gli effetti. Le frange fitte delle due fenditure stanno dentro la macchia larga di ciascuna.

?? Si stringe la fenditura. Che cosa succede alla macchia centrale?
[x] si allarga
[ ] si stringe
[ ] resta uguale
=> Da $y_1 = \lambda \cdot L / a$: con $a$ più piccola il primo buio va più lontano. Più la fessura è stretta, più l'onda si allarga.`
    },
    {
      id: 'reticolo',
      titolo: 'Il reticolo di diffrazione',
      testo: R`Un CD inclinato sotto una lampada si riempie di colori. Eppure il CD non ha pigmenti colorati. Ha una spirale di solchi fittissimi, a 1,6 micrometri l'uno dall'altro.

[[video:luce/reticolo]]

Un **reticolo** è una lastra con moltissime fenditure parallele, tutte alla stessa distanza $d$: il **passo** del reticolo. Di solito si dice quante righe ci sono in un millimetro. Con $N$ righe al millimetro il passo è $d = \tfrac{1}{N}$ mm: con 500 righe, $d = 0{,}002\,\text{mm} = 2\,\mu\text{m}$.

Fra due fenditure vicine la differenza di cammino è $d \cdot \sin\theta$, come in Young. Se vale un numero intero di lunghezze d'onda, le onde di **tutte** le fenditure arrivano a passo.

>* Un reticolo di passo $d$ manda la luce di lunghezza d'onda $\lambda$ agli angoli con $d \cdot \sin\theta = n \cdot \lambda$. Il numero intero $n$ è l'**ordine**.

Con due fenditure i massimi sono larghi e sfumati. Con migliaia di fenditure restano agli stessi angoli, ma diventano righe sottilissime. In mezzo è quasi tutto buio.

Esempio, quello del video: il CD e la luce verde di 532 nm, primo ordine.

~ \sin\theta = \dfrac{n \cdot \lambda}{d} :: dalla legge del reticolo, con $n = 1$
~ \sin\theta = \dfrac{532\,\text{nm}}{1600\,\text{nm}} \approx 0{,}33 :: il passo del CD in nanometri
~ \theta \approx \evidb{19{,}4^\circ} :: l'angolo che ha quel seno, con la calcolatrice

Ogni colore ha la sua $\lambda$, quindi il suo angolo. Con la luce bianca il reticolo apre uno **spettro**: violetto vicino al centro, rosso più lontano. Gli ordini però non sono infiniti. $\sin\theta$ non supera 1, quindi serve $n \cdot \lambda \le d$.

[[grafico:reticolo]]

Il CD fa lo stesso per riflessione: ogni solco rimanda un po' di luce. Gli strumenti di laboratorio usano i reticoli per separare i colori e misurare le lunghezze d'onda.

>! Nel reticolo gli angoli sono grandi: $\sin\theta \approx y / L$ e $\Delta y = \lambda \cdot L / d$ non valgono più. Si usa $d \cdot \sin\theta = n \cdot \lambda$, e l'angolo si trova con la calcolatrice.

>! In un reticolo il rosso devia **più** del violetto, perché ha la lunghezza d'onda più lunga. In un prisma succede il contrario. I due arcobaleni hanno i colori in ordine opposto.

?? Un reticolo e luce bianca. Nel primo ordine, quale colore esce più lontano dal centro?
[ ] il violetto
[x] il rosso
[ ] tutti allo stesso angolo
=> Da $\sin\theta = \lambda / d$: più grande è $\lambda$, più grande è l'angolo. Il rosso ha la lunghezza d'onda più lunga.`
    },
    {
      id: 'lamine',
      titolo: 'Le lamine sottili',
      testo: R`Una bolla di sapone è trasparente, eppure si colora. Una macchia d'olio sull'asfalto bagnato mostra anelli colorati. In tutti e due i casi c'è una **lamina sottile**: uno strato spesso poche centinaia di nanometri.

[[video:luce/bolla]]

La luce si riflette due volte: sulla faccia davanti (raggio 1) e su quella dietro (raggio 2). Il raggio 2 attraversa la lamina avanti e indietro. Chiamiamo $s$ lo spessore. Guardiamo la lamina di fronte, con la luce quasi perpendicolare. Allora il raggio 2 fa un tratto in più lungo $2 \cdot s$. Dentro la lamina la lunghezza d'onda è $\lambda / n$. Contato in lunghezze d'onda, il tratto in più vale $\dfrac{2 \cdot n \cdot s}{\lambda}$.

C'è poi un dettaglio che conta.

>* Un'onda di luce che si riflette su un mezzo con indice di rifrazione **più grande** si capovolge: la cresta diventa gola. È come mezza lunghezza d'onda in più. Riflettendosi su un mezzo con indice più piccolo non si capovolge.

Nella bolla il raggio 1 va dall'aria all'acqua e si capovolge. Il raggio 2, dentro, va dall'acqua all'aria e non si capovolge. Con un solo capovolgimento:

- riflesso **forte** se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$;
- riflesso **spento** se $2 \cdot n \cdot s = m \cdot \lambda$, con $m = 0, 1, 2, \dots$

Esempio, quello del video. Acqua e sapone ($n = 1{,}33$), spessore 200 nm, luce verde di 532 nm.

~ 2 \cdot n \cdot s = 2 \cdot 1{,}33 \cdot 200\,\text{nm} :: il tratto in più del raggio 2, moltiplicato per n perché dentro λ è più corta
~ 2 \cdot n \cdot s = 532\,\text{nm} = 1 \cdot \lambda :: proprio una lunghezza d'onda del verde
~ \lambda + \tfrac{1}{2} \cdot \lambda = 1{,}5 \cdot \lambda :: più la mezza del capovolgimento: cresta con gola
~ \text{verde } \evidb{\text{spento}} :: restano rosso e blu, e la lamina sembra viola

Ogni spessore spegne un colore e ne rinforza altri. La bolla è più spessa in basso, dove il liquido scende: per questo i colori fanno bande. In cima, prima di scoppiare, la bolla diventa nera. Lo spessore è quasi zero, e resta solo il capovolgimento.

[[grafico:lamina]]

> Le lenti degli occhiali e delle macchine fotografiche hanno uno strato **antiriflesso**. Lì i riflessi sono su due materiali con indice crescente, e si capovolgono tutti e due. Le condizioni si scambiano: il riflesso è spento se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$.

>! Lo spessore va moltiplicato per $n$, perché dentro la lamina la lunghezza d'onda è più corta. E non va dimenticato il capovolgimento: senza, i colori spenti e quelli forti si scambierebbero.

?? In cima, poco prima di scoppiare, una bolla di sapone diventa nera. Perché?
[ ] la luce la attraversa tutta senza fermarsi
[x] lo spessore è quasi zero, e il capovolgimento spegne ogni colore
[ ] il sapone, concentrato in cima, assorbe la luce
=> Con $s \approx 0$ i due raggi fanno lo stesso percorso. Resta solo la mezza lunghezza d'onda del capovolgimento: cresta con gola per tutti i colori.`
    },
    {
      id: 'polarizzazione',
      titolo: 'La polarizzazione',
      testo: R`Con gli occhiali polarizzati i riflessi sull'acqua spariscono, e si vedono i sassi sul fondo. Con occhiali scuri normali no. La differenza sta in una proprietà della luce: oscilla di traverso.

[[video:luce/polarizzazione]]

Nell'onda di luce oscilla il **campo elettrico** $E$, perpendicolare alla direzione in cui la luce va. La luce è un'onda **trasversale**. Nella luce del Sole o di una lampadina la direzione di $E$ cambia di continuo, a caso. È luce **naturale**, cioè non polarizzata.

>* Un **polarizzatore** lascia passare solo la parte del campo elettrico lungo il suo **asse**. Dopo il filtro la luce oscilla in una direzione sola: è **polarizzata**. Della luce naturale passa metà dell'intensità.

Il campo $E$ si scompone come ogni vettore: una componente lungo l'asse e una perpendicolare. La prima passa, la seconda viene assorbita. Se $E$ forma un angolo $\theta$ con l'asse, passa $E \cdot \cos\theta$.

[[grafico:filtro]]

Il suono invece non si può polarizzare. Nell'aria oscilla avanti e indietro, lungo la direzione in cui va: è un'onda longitudinale. Non ha una direzione di traverso da scegliere. La polarizzazione è la prova che la luce è un'onda trasversale.

La luce riflessa dall'acqua, dal vetro o dall'asfalto è in parte polarizzata: oscilla soprattutto in orizzontale. Le lenti polarizzate hanno l'asse verticale, e del riflesso lasciano passare poco.

> Anche gli schermi a cristalli liquidi usano dei polarizzatori. Per questo, con gli occhiali polarizzati e la testa inclinata, lo schermo di un telefono può diventare scuro.

>! Un polarizzatore non è un semplice vetro scuro. Il vetro scuro toglie luce allo stesso modo in ogni direzione. Il polarizzatore sceglie una direzione di oscillazione.

?? Perché nessun polarizzatore riesce a fermare il suono?
[ ] perché il suono è troppo debole
[x] perché il suono è un'onda longitudinale
[ ] perché il suono ha una lunghezza d'onda troppo grande
=> Un polarizzatore sceglie una direzione di oscillazione perpendicolare alla propagazione. Il suono oscilla lungo la direzione in cui va: non c'è niente da scegliere.`
    },
    {
      id: 'malus',
      titolo: 'La legge di Malus',
      testo: R`Due polarizzatori, uno dietro l'altro. Il primo polarizza la luce, il secondo la analizza. Ruotando il secondo cambia la luce che passa: tanta con gli assi paralleli, buio con gli assi incrociati.

[[video:luce/malus]]

Dopo il primo filtro il campo ha ampiezza $E$ e l'intensità è $I_0$. Il secondo filtro ha l'asse ruotato di $\theta$ e lascia passare la componente $E \cdot \cos\theta$. Ma l'intensità della luce va con il quadrato dell'ampiezza.

~ E_2 = E \cdot \cos\theta :: passa la componente lungo il secondo asse
~ \dfrac{I}{I_0} = \left(\dfrac{E \cdot \cos\theta}{E}\right)^2 :: l'intensità va con il quadrato del campo
~ I = \evidb{I_0 \cdot \cos^2\theta} :: la legge di Malus

>* **Legge di Malus**: fra due polarizzatori con gli assi a un angolo $\theta$, l'intensità che passa è $I = I_0 \cdot \cos^2\theta$. Qui $I_0$ è l'intensità dopo il primo filtro, non la soglia di udibilità del suono.

Con $\theta = 30^\circ$ si ha $\cos^2 30^\circ = 0{,}75$: passano tre quarti. A 45° passa la metà, a 60° un quarto, a 90° niente.

[[grafico:malus]]

### Il terzo filtro

Due filtri incrociati fanno buio. Ora si infila in mezzo un terzo filtro, con l'asse a 45°. Un filtro in più dovrebbe togliere luce. Invece la luce torna.

~ I_1 = I_0 \cdot \cos^2 45^\circ = \tfrac{1}{2} \cdot I_0 :: il filtro in mezzo, a 45° dal primo
~ I_2 = I_1 \cdot \cos^2 45^\circ = \tfrac{1}{4} \cdot I_0 :: l'ultimo filtro, a 45° da quello in mezzo
~ I_2 = \tfrac{1}{4} \cdot \tfrac{1}{2} \cdot I_\text{nat} = \evidb{\tfrac{1}{8} \cdot I_\text{nat}} :: $I_0$ era già metà della luce naturale

Il filtro in mezzo non crea luce. Fa oscillare la luce di sbieco, a 45°. Così la luce ha di nuovo una componente lungo l'asse dell'ultimo filtro.

>! Nella legge di Malus $I_0$ è luce già polarizzata. Sulla luce naturale il primo filtro dimezza e basta: lì $\cos^2\theta$ non si usa, perché la luce oscilla in tutte le direzioni.

?? Due polarizzatori con gli assi a 60°. Che frazione di $I_0$ passa?
[ ] metà, perché $\cos 60^\circ = 0{,}5$
[x] un quarto
[ ] niente
=> $\cos 60^\circ = 0{,}5$ è la frazione del campo. L'intensità va con il quadrato: $0{,}5^2 = 0{,}25$, cioè un quarto.`
    }
  ],
  grafici: {
    /* la stessa luce nell'aria e in un mezzo di indice n: frequenza uguale, lunghezza d'onda λ/n; il campo E è viola come nei video */
    mezzo: {
      tipo: 'piano', x: [0, 1850], y: [-2.9, 2.9], altezza: 420, proporzioni: 'libere', passo: [200, 5], etichette: { x: 'x (nm)', y: 'E' },
      parametri: [
        { nome: 'lam', min: 400, max: 700, passo: 10, valore: 560, etichetta: 'λ nel vuoto (nm)' },
        { nome: 'n', min: 1, max: 2.4, passo: 0.01, valore: 1.33, decimali: 2, etichetta: 'indice di rifrazione n' }
      ],
      funzioni: [
        { f: '1.3 + 0.8*sin(2*pi*x/lam)', colore: 4, dominio: [0, 1800] },
        { f: '-1.3 + 0.8*sin(2*pi*n*x/lam)', colore: 4, dominio: [0, 1800], tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [1800, 2.45], testo: 'nell\'aria: λ = {{lam}} nm', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [1800, -2.6], testo: 'nel mezzo: λ_n = {{lam/n|0}} nm', ancora: 'end', colore: 4 }
      ],
      didascalia: 'Due fotografie della stessa luce: sopra nell\'aria, sotto (tratteggio) in un materiale di indice n. La frequenza è la stessa; nel materiale la luce va più piano e la lunghezza d\'onda si accorcia: λₙ = λ/n. Con n = 1,33 è l\'acqua, con 1,5 un vetro.'
    },
    /* il triangolino della differenza di cammino: raggi quasi paralleli dalle due fenditure (d = 3 unità) */
    triangolo: {
      tipo: 'piano', x: [-1.2, 5.2], y: [-0.95, 6.4], assi: false, griglia: false, mirino: false,
      parametri: [{ nome: 'th', min: 10, max: 40, passo: 5, valore: 25, etichetta: 'angolo θ (°)' }],
      elementi: [
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(th*pi/180)', 'sin(th*pi/180)'], raggio: 2.6, etichetta: 'θ', colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 3], da: [0, 0], a: ['3*sin(th*pi/180)*cos(th*pi/180)', '3*sin(th*pi/180)^2'], raggio: 1, etichetta: 'θ', colore: 'grigio' },
        { tipo: 'segmento', da: [0, -0.8], a: [0, -0.18], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0.18], a: [0, 2.82], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 3.18], a: [0, 4.2], colore: 'grigio' },
        { tipo: 'testo', p: [-0.3, 1.6], testo: 'd', ancora: 'end' },
        { tipo: 'segmento', da: [0, 0], a: [4.8, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['5*cos(th*pi/180)', '5*sin(th*pi/180)'], colore: 1 },
        { tipo: 'segmento', da: [0, 3], a: ['5*cos(th*pi/180)', '3 + 5*sin(th*pi/180)'], colore: 1 },
        { tipo: 'testo', p: ['5*cos(th*pi/180) - 0.3', '3 + 5*sin(th*pi/180) - 0.85'], testo: 'verso P', ancora: 'end' },
        { tipo: 'segmento', da: [0, 3], a: ['3*sin(th*pi/180)*cos(th*pi/180)', '3*sin(th*pi/180)^2'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['3*sin(th*pi/180)*cos(th*pi/180)', '3*sin(th*pi/180)^2'], colore: 3, spessore: 4 },
        { tipo: 'testo', p: [0.25, -0.65], testo: 'Δr = d·sin θ', ancora: 'start', colore: 3 }
      ],
      didascalia: 'Le due fenditure, distanti d, viste dall\'alto (non in scala: lo schermo è lontanissimo). I raggi verso P sono quasi paralleli. Il tratteggio dalla fenditura alta è perpendicolare ai raggi: il triangolino ha ipotenusa d, e il cateto sul raggio basso, dalla fenditura al tratteggio, è il tratto in più: d·sin θ.'
    },
    /* le frange di Young sullo schermo, metà destra: I ∝ cos²(π·d·y/(λ·L)); λ in nm, d in mm, y in mm, L in m */
    frange: {
      tipo: 'piano', x: [0, 15], y: [0, 1.45], altezza: 380, proporzioni: 'libere', passo: [2, 0.5], etichette: { x: 'y (mm)', y: 'I / I_{max}' },
      parametri: [
        { nome: 'lam', min: 400, max: 700, passo: 50, valore: 600, etichetta: 'λ (nm)' },
        { nome: 'd', min: 0.1, max: 0.5, passo: 0.1, valore: 0.3, decimali: 1, etichetta: 'fenditure: d (mm)' },
        { nome: 'L', min: 1, max: 4, passo: 1, valore: 1, etichetta: 'schermo: L (m)' }
      ],
      funzioni: [{ f: 'cos(pi*d*x*1000/(lam*L))^2', colore: 3, dominio: [0, 15] }],
      elementi: [
        { tipo: 'segmento', da: ['min(15, lam*L/(1000*d))', 1.1], a: ['min(15, 2*lam*L/(1000*d))', 1.1], colore: 'grigio' },
        { tipo: 'segmento', da: ['min(15, lam*L/(1000*d))', 1.05], a: ['min(15, lam*L/(1000*d))', 1.15], colore: 'grigio' },
        { tipo: 'segmento', da: ['min(15, 2*lam*L/(1000*d))', 1.05], a: ['min(15, 2*lam*L/(1000*d))', 1.15], colore: 'grigio' },
        { tipo: 'testo', p: [14.8, 1.3], testo: 'Δy = λ·L/d = {{lam*L/(1000*d)|1}} mm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'intensità della luce sullo schermo, dal centro (y = 0) verso un lato: dall\'altra parte le frange sono uguali, a specchio. Le frange chiare sono equidistanti; il segmento grigio ne misura la distanza Δy. I tre cursori cambiano λ, d e L.'
    },
    /* una fenditura sola, schermo a 1,5 m: I ∝ (sin u / u)², u = π·a·y/(λ·L); a in mm, y in mm, λ in nm */
    fenditura: {
      tipo: 'piano', x: [0, 30], y: [0, 1.3], altezza: 380, proporzioni: 'libere', passo: [5, 0.5], etichette: { x: 'y (mm)', y: 'I / I_{max}' },
      parametri: [
        { nome: 'a', min: 0.05, max: 0.4, passo: 0.05, valore: 0.1, decimali: 2, etichetta: 'fenditura: a (mm)' },
        { nome: 'lam', min: 400, max: 700, passo: 50, valore: 600, etichetta: 'λ (nm)' }
      ],
      funzioni: [{ f: 'sin(pi*a*1000*(x + 0.00001)/(lam*1.5))^2/(pi*a*1000*(x + 0.00001)/(lam*1.5))^2', colore: 3, dominio: [0, 30] }],
      elementi: [
        { tipo: 'punto', p: ['lam*1.5/(1000*a)', 0], colore: 'grigio' },
        { tipo: 'punto', p: ['2*lam*1.5/(1000*a)', 0], colore: 'grigio' },
        { tipo: 'testo', p: [29.5, 0.75], testo: 'primo buio: y_1 = {{lam*1.5/(1000*a)|1}} mm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'L\'intensità sullo schermo, a 1,5 m da una fenditura sola, dal centro verso un lato. La macchia centrale arriva fino al primo buio (punto grigio), a y₁ = λ·L/a; le macchie laterali sono molto più deboli. Stringendo la fenditura, la macchia si allarga.'
    },
    /* il reticolo visto dall'alto: la luce arriva da sinistra ed esce solo agli angoli con d·sin θ = n·λ */
    reticolo: {
      tipo: 'piano', x: [-0.75, 1.6], y: [-1.15, 1.15], assi: false, griglia: false, mirino: false,
      parametri: [
        { nome: 'lam', min: 400, max: 700, passo: 50, valore: 650, etichetta: 'λ (nm)' },
        { nome: 'N', min: 100, max: 1000, passo: 100, valore: 600, etichetta: 'righe al millimetro N' }
      ],
      elementi: [
        { tipo: 'vettore', da: [-0.7, 0], a: [-0.04, 0], etichetta: 'luce', colore: 1 },
        { tipo: 'segmento', da: [0, -0.45], a: [0, 0.45], colore: 'grigio' },
        { tipo: 'testo', p: [-0.06, -0.55], testo: 'reticolo', ancora: 'end' },
        { tipo: 'testo', p: [-0.1, -0.85], testo: 'sin θ_1 = {{lam*N/1000000|2}}', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [-0.1, -1.0], testo: 'θ_1 = {{asin(min(1, lam*N/1000000))*180/pi|1}}°', ancora: 'end', colore: 1 }
      ].concat([-3, -2, -1, 0, 1, 2, 3].map(raggioOrdine), [0, 1, 2, 3].map(nomeOrdine)),
      didascalia: 'Visto dall\'alto: la luce di un colore arriva da sinistra sul reticolo, e ne esce soltanto in certe direzioni, una per ordine n. Ogni direzione ha d·sin θ = n·λ, con d = 1/N. Gli ordini con n·λ più grande di d non esistono: più righe al millimetro, meno ordini e più aperti.'
    },
    /* la luce riflessa da una lamina d'acqua e sapone (n = 1,33) secondo lo spessore: ∝ sin²(2π·n·s/λ) */
    lamina: {
      tipo: 'piano', x: [0, 600], y: [0, 1.45], altezza: 380, proporzioni: 'libere', passo: [100, 0.5], etichette: { x: 's (nm)', y: 'riflesso' },
      parametri: [{ nome: 'lam', min: 400, max: 700, passo: 50, valore: 650, etichetta: 'λ (nm)' }],
      funzioni: [
        { f: 'sin(2*pi*1.33*x/lam)^2', colore: 3, dominio: [0, 600] },
        { f: 'sin(2*pi*1.33*x/450)^2', colore: 3, dominio: [0, 600], tratteggio: true }
      ],
      elementi: [
        { tipo: 'testo', p: [592, 1.27], testo: 'primo massimo: s = {{lam/(4*1.33)|0}} nm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Quanta luce riflette una lamina d\'acqua e sapone (n = 1,33), secondo lo spessore s. Linea piena: la lunghezza d\'onda scelta; tratteggio: il blu, 450 nm. A spessore zero tutto è spento (la bolla nera). Allo stesso spessore un colore può essere forte e un altro spento.'
    },
    /* il campo E (viola come nei video) e l'asse del filtro: passa solo la componente lungo l'asse */
    filtro: {
      tipo: 'piano', x: [-3.6, 4.4], y: [-1.5, 4.9], assi: false, griglia: false, mirino: false,
      parametri: [{ nome: 'th', min: 0, max: 90, passo: 15, valore: 30, etichetta: 'angolo fra E e l\'asse θ (°)' }],
      elementi: [
        { tipo: 'segmento', da: ['-0.8*cos((90 - th)*pi/180)', '-0.8*sin((90 - th)*pi/180)'], a: ['4.7*cos((90 - th)*pi/180)', '4.7*sin((90 - th)*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: ['4.4*cos((90 - th)*pi/180) + 0.25', '4.4*sin((90 - th)*pi/180) - 0.35'], testo: 'asse', ancora: 'start' },
        { tipo: 'angolo', vertice: [0, 0], da: [0, 1], a: ['cos((90 - th)*pi/180)', 'sin((90 - th)*pi/180)'], raggio: 1.3, etichetta: 'θ', colore: 'grigio' },
        { tipo: 'vettore', da: [0, 0], a: [0, 4], etichetta: 'E', colore: 4, componenti: { lungo: '90 - th', etichette: ['E_∥', 'E_⊥'] } },
        { tipo: 'testo', p: [-3.5, -1.1], testo: 'passa E_∥ = {{cos(th*pi/180)|2}}·E', ancora: 'start', colore: 4 }
      ],
      didascalia: 'Il campo elettrico E della luce, visto di fronte, e l\'asse del filtro (tratteggio grigio). E si scompone lungo l\'asse e di traverso: passa solo la componente lungo l\'asse, E·cos θ; quella di traverso viene assorbita.'
    },
    /* la legge di Malus: la frazione di I₀ che passa il secondo filtro, secondo l'angolo fra gli assi */
    malus: {
      tipo: 'piano', x: [0, 180], y: [0, 1.4], altezza: 380, proporzioni: 'libere', passo: [30, 0.5], etichette: { x: 'θ (°)', y: 'I / I_0' },
      parametri: [{ nome: 'th', min: 0, max: 180, passo: 15, valore: 30, etichetta: 'angolo fra gli assi θ (°)' }],
      funzioni: [{ f: 'cos(x*pi/180)^2', colore: 3, dominio: [0, 180] }],
      elementi: [
        { tipo: 'segmento', da: ['th', 0], a: ['th', 'cos(th*pi/180)^2'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['th', 'cos(th*pi/180)^2'], colore: 3 },
        { tipo: 'testo', p: [178, 1.26], testo: 'θ = {{th}}°: passa {{cos(th*pi/180)^2|2}}·I_0', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La legge di Malus, I = I₀·cos²θ. Con gli assi paralleli (0° e 180°) passa tutto, con gli assi incrociati (90°) niente. A 45° passa metà: la curva non è una retta.'
    }
  },
  esempi: [
    {
      titolo: 'Il giallo dei lampioni al sodio',
      problema: R`I vecchi lampioni al sodio emettono una luce gialla con $\lambda = 589\,\text{nm}$. Qual è la sua frequenza? Che velocità e che lunghezza d'onda ha dentro un diamante, con $n = 2{,}42$?`,
      passi: [
        R`Dati: $\lambda = 589\,\text{nm} = 589 \cdot 10^{-9}\,\text{m}$, $n = 2{,}42$, $c = 3 \cdot 10^8\,\text{m/s}$. Cerco $f$, la velocità $v$ nel diamante e $\lambda_n$.`,
        R`La frequenza viene da $c = \lambda \cdot f$: $f = \dfrac{3 \cdot 10^8\,\text{m/s}}{589 \cdot 10^{-9}\,\text{m}} \approx 5{,}09 \cdot 10^{14}\,\text{Hz}$.`,
        R`Nel diamante la luce rallenta molto: $v = \dfrac{c}{n} = \dfrac{3 \cdot 10^8\,\text{m/s}}{2{,}42} \approx 1{,}24 \cdot 10^8\,\text{m/s}$.`,
        R`La frequenza non cambia, quindi si accorcia la lunghezza d'onda: $\lambda_n = \dfrac{\lambda}{n} = \dfrac{589\,\text{nm}}{2{,}42} \approx 243\,\text{nm}$.`,
        R`Controllo: $\lambda_n \cdot f = 243 \cdot 10^{-9}\,\text{m} \cdot 5{,}09 \cdot 10^{14}\,\text{Hz} \approx 1{,}24 \cdot 10^8\,\text{m/s}$. È la velocità nel diamante. Torna.`
      ],
      risultato: R`$f \approx 5{,}09 \cdot 10^{14}\,\text{Hz}$; nel diamante $v \approx 1{,}24 \cdot 10^8\,\text{m/s}$ e $\lambda_n \approx 243\,\text{nm}$.`
    },
    {
      titolo: 'Le frange di un laser a elio-neon',
      problema: R`Un laser a elio-neon ($\lambda = 633\,\text{nm}$) illumina due fenditure distanti $0{,}40\,\text{mm}$. Lo schermo è a 3,0 m. Quanto distano due frange chiare vicine? A che altezza dal centro cade la terza frangia chiara? E la prima scura?`,
      passi: [
        R`Dati: $\lambda = 633\,\text{nm}$, $d = 0{,}40\,\text{mm}$, $L = 3{,}0\,\text{m}$. Cerco $\Delta y$, $y_3$ e la posizione della prima frangia scura.`,
        R`Tutto in metri: $\lambda = 633 \cdot 10^{-9}\,\text{m}$, $d = 0{,}40 \cdot 10^{-3}\,\text{m}$.`,
        R`Distanza fra le frange: $\Delta y = \dfrac{\lambda \cdot L}{d} = \dfrac{633 \cdot 10^{-9} \cdot 3{,}0}{0{,}40 \cdot 10^{-3}}\,\text{m} \approx 4{,}75 \cdot 10^{-3}\,\text{m} = 4{,}75\,\text{mm}$.`,
        R`Le frange sono equidistanti: la terza chiara sta a $y_3 = 3 \cdot \Delta y \approx 14{,}2\,\text{mm}$ dal centro.`,
        R`La prima scura ha $\Delta r = \tfrac{1}{2} \cdot \lambda$: sta a metà fra la frangia centrale e la prima chiara, a circa $2{,}4\,\text{mm}$.`,
        R`Controllo degli angoli piccoli: per la terza frangia $\tan\theta = \dfrac{14{,}2\,\text{mm}}{3000\,\text{mm}} \approx 0{,}0047$, circa un quarto di grado. L'approssimazione va benissimo.`
      ],
      risultato: R`$\Delta y \approx 4{,}75\,\text{mm}$; la terza frangia chiara a $14{,}2\,\text{mm}$, la prima scura a $2{,}4\,\text{mm}$ dal centro.`
    },
    {
      titolo: 'Quanto è larga la macchia centrale',
      problema: R`Una luce verde con $\lambda = 520\,\text{nm}$ passa da una fenditura larga $0{,}08\,\text{mm}$. Lo schermo è a 2,5 m. Quanto è larga la macchia chiara centrale?`,
      passi: [
        R`Dati: $\lambda = 520\,\text{nm}$, $a = 0{,}08\,\text{mm}$, $L = 2{,}5\,\text{m}$. Cerco la larghezza della macchia centrale, cioè $2 \cdot y_1$.`,
        R`Il primo buio è dove $a \cdot \sin\theta = \lambda$. Con gli angoli piccoli, sullo schermo sta a $y_1 = \dfrac{\lambda \cdot L}{a}$.`,
        R`In metri: $y_1 = \dfrac{520 \cdot 10^{-9} \cdot 2{,}5}{0{,}08 \cdot 10^{-3}}\,\text{m} = 1{,}625 \cdot 10^{-2}\,\text{m}$, cioè $y_1 = 16{,}25\,\text{mm}$.`,
        R`La macchia va dal primo buio di sotto al primo buio di sopra: $2 \cdot y_1 \approx 32{,}5\,\text{mm}$, più di tre centimetri.`,
        R`Controllo con l'idea della diffrazione: la fenditura è stretta, appena 150 lunghezze d'onda, e la luce si apre molto. Una fenditura dieci volte più larga darebbe una macchia dieci volte più stretta.`
      ],
      risultato: R`La macchia centrale è larga circa $32{,}5\,\text{mm}$.`
    },
    {
      titolo: 'Gli ordini di un reticolo',
      problema: R`Un reticolo ha 500 righe al millimetro. Lo si illumina con luce blu di 450 nm. A che angoli escono il primo e il secondo ordine? Quanti ordini si vedono da ogni lato?`,
      passi: [
        R`Dati: $N = 500$ righe al millimetro, $\lambda = 450\,\text{nm}$. Cerco $\theta_1$, $\theta_2$ e l'ordine più alto.`,
        R`Il passo è $d = \dfrac{1}{500}\,\text{mm} = 0{,}002\,\text{mm} = 2000\,\text{nm}$.`,
        R`Primo ordine: $\sin\theta_1 = \dfrac{\lambda}{d} = \dfrac{450}{2000} = 0{,}225$, quindi $\theta_1 \approx 13{,}0^\circ$.`,
        R`Secondo ordine: $\sin\theta_2 = \dfrac{2 \cdot 450}{2000} = 0{,}45$, quindi $\theta_2 \approx 26{,}7^\circ$. L'angolo non raddoppia esattamente: raddoppia il seno.`,
        R`L'ordine più alto: serve $n \cdot \lambda \le d$, cioè $n \le \dfrac{2000}{450} \approx 4{,}4$. Si arriva a $n = 4$, con $\sin\theta_4 = 0{,}9$ e $\theta_4 \approx 64{,}2^\circ$.`
      ],
      risultato: R`$\theta_1 \approx 13{,}0^\circ$, $\theta_2 \approx 26{,}7^\circ$; si vedono 4 ordini per lato, più il centrale.`
    },
    {
      titolo: 'Lo strato antiriflesso',
      problema: R`Una lente di vetro ($n = 1{,}52$) è ricoperta da uno strato di fluoruro di magnesio ($n = 1{,}38$). Quanto deve essere spesso, al minimo, per spegnere il riflesso della luce di 550 nm, al centro del visibile, guardando la lente di fronte?`,
      passi: [
        R`Dati: lamina con $n = 1{,}38$, sopra l'aria e sotto il vetro con $n = 1{,}52$, $\lambda = 550\,\text{nm}$. Cerco lo spessore minimo $s$.`,
        R`I capovolgimenti: il primo riflesso va dall'aria (1) allo strato (1,38), indice più grande: si capovolge. Il secondo va dallo strato (1,38) al vetro (1,52), indice più grande: si capovolge anche lui.`,
        R`I due capovolgimenti si compensano. Allora conta solo il tratto in più: il riflesso è spento se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$.`,
        R`Lo spessore minimo si ha con $m = 0$: $2 \cdot n \cdot s = \tfrac{1}{2} \cdot \lambda$, quindi $s = \dfrac{\lambda}{4 \cdot n} = \dfrac{550\,\text{nm}}{4 \cdot 1{,}38} \approx 99{,}6\,\text{nm}$.`,
        R`Controllo: $2 \cdot 1{,}38 \cdot 99{,}6\,\text{nm} \approx 275\,\text{nm}$, metà di 550 nm. Cresta con gola: torna. Rosso e violetto restano un po' riflessi, e la lente sembra violacea.`
      ],
      risultato: R`Serve uno strato di circa $100\,\text{nm}$.`
    },
    {
      titolo: 'Tre filtri lasciano passare più di due',
      problema: R`Una luce naturale con intensità $120\,\text{W/m}^2$ attraversa due polarizzatori con gli assi a 60°. Quanta luce esce? E se in mezzo si mette un terzo filtro, a 30° da tutti e due?`,
      passi: [
        R`Dati: $I_\text{nat} = 120\,\text{W/m}^2$, $\theta = 60^\circ$ fra gli assi; poi un filtro in mezzo, a $30^\circ$ dal primo e dall'ultimo. Cerco l'intensità che esce nei due casi.`,
        R`Il primo filtro, sulla luce naturale, dimezza: $I_0 = \tfrac{1}{2} \cdot 120\,\text{W/m}^2 = 60\,\text{W/m}^2$.`,
        R`Con due filtri: $I = I_0 \cdot \cos^2 60^\circ = 60\,\text{W/m}^2 \cdot 0{,}25 = 15\,\text{W/m}^2$.`,
        R`Con il filtro in mezzo: $I_1 = 60\,\text{W/m}^2 \cdot \cos^2 30^\circ = 60 \cdot 0{,}75\,\text{W/m}^2 = 45\,\text{W/m}^2$. Poi $I_2 = 45\,\text{W/m}^2 \cdot \cos^2 30^\circ \approx 33{,}8\,\text{W/m}^2$.`,
        R`Controllo: $0{,}75 \cdot 0{,}75 = 0{,}5625$, più del doppio di $0{,}25$. Due passi piccoli fanno ruotare la luce perdendone meno di un passo grande.`
      ],
      risultato: R`Con due filtri esce $15\,\text{W/m}^2$; con tre, circa $33{,}8\,\text{W/m}^2$.`
    }
  ],
  formulario: [
    { nome: 'Velocità della luce nel vuoto', formula: R`c \approx 3 \cdot 10^8\,\text{m/s} \qquad c = \lambda \cdot f`, nota: R`Il visibile va da 400 nm (violetto) a 700 nm (rosso).` },
    { nome: 'La luce in un materiale', formula: R`v = \dfrac{c}{n} \qquad \lambda_n = \dfrac{\lambda}{n}`, nota: R`$n$ è l'indice di rifrazione. La frequenza non cambia.` },
    { nome: 'Young: frange chiare e scure', formula: R`\Delta r = n \cdot \lambda \qquad \Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda`, nota: R`Chiara la prima, scura la seconda. $\Delta r$ è la differenza di cammino. $n$ è l'ordine, un intero da 0 in su, non l'indice di rifrazione.` },
    { nome: 'Young: angolo delle frange chiare', formula: R`d \cdot \sin\theta = n \cdot \lambda`, nota: R`$d$ è la distanza fra le due fenditure. $n$ è l'ordine (intero), non l'indice di rifrazione.` },
    { nome: 'Young: distanza fra le frange', formula: R`\Delta y = \dfrac{\lambda \cdot L}{d}`, nota: R`Con gli angoli piccoli. $L$ è la distanza dello schermo.` },
    { nome: 'Una fenditura: frange scure', formula: R`a \cdot \sin\theta = m \cdot \lambda`, nota: R`$a$ è la larghezza della fenditura, $m$ intero: 1, 2, 3… Il primo buio sullo schermo è a $y_1 = \dfrac{\lambda \cdot L}{a}$.` },
    { nome: 'Reticolo', formula: R`d \cdot \sin\theta = n \cdot \lambda`, nota: R`$d$ è il passo: con $N$ righe al millimetro, $d = \tfrac{1}{N}$ mm. $n$ è l'ordine (intero), non l'indice di rifrazione. Serve $n \cdot \lambda \le d$.` },
    { nome: 'Lamina sottile: tratto in più', formula: R`\text{tratto in più} = 2 \cdot n \cdot s`, nota: R`Luce quasi perpendicolare. $s$ è lo spessore, $n$ l'indice di rifrazione della lamina. Riflettendosi su un indice più grande l'onda si capovolge: mezza $\lambda$ in più.` },
    { nome: 'Lamina con un capovolgimento (bolla)', formula: R`2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda`, nota: R`Riflesso forte, con $m$ intero: 0, 1, 2… Il riflesso è spento se $2 \cdot n \cdot s = m \cdot \lambda$. Con due capovolgimenti le condizioni si scambiano.` },
    { nome: 'Polarizzatore sulla luce naturale', formula: R`I_0 = \tfrac{1}{2} \cdot I_\text{nat}`, nota: R`Passa metà dell'intensità, qualunque sia l'asse.` },
    { nome: 'Legge di Malus', formula: R`I = I_0 \cdot \cos^2\theta`, nota: R`$\theta$ è l'angolo fra gli assi dei due filtri; $I_0$ è la luce già polarizzata. Intensità in $\text{W/m}^2$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'natura', tipo: 'concetto', fronte: R`Che cosa prevedevano corpuscoli e onde per la velocità della luce nell'acqua?`, retro: R`I corpuscoli di Newton: più veloce che nell'aria. Le onde: più lenta. Nel 1850 Foucault misurò che rallenta.` },
    { id: 'fc-02', sezione: 'natura', tipo: 'definizione', fronte: R`Che cos'è la luce?`, retro: R`Un'**onda elettromagnetica**: un campo elettrico e un campo magnetico che oscillano. Viaggia anche nel vuoto.` },
    { id: 'fc-03', sezione: 'natura', tipo: 'formula', fronte: R`Quanto vale la **velocità della luce** nel vuoto?`, retro: R`$c \approx 3 \cdot 10^8\,\text{m/s}$ (esattamente $299\,792\,458\,\text{m/s}$).` },
    { id: 'fc-04', sezione: 'colori', tipo: 'concetto', fronte: R`Fra quali lunghezze d'onda sta la luce **visibile**?`, retro: R`Fra 400 nm (violetto) e 700 nm (rosso). $1\,\text{nm} = 10^{-9}\,\text{m}$.` },
    { id: 'fc-05', sezione: 'colori', tipo: 'formula', fronte: R`Relazione fra lunghezza d'onda e frequenza della luce`, retro: R`$c = \lambda \cdot f$: più alta la frequenza, più corta la lunghezza d'onda.` },
    { id: 'fc-06', sezione: 'colori', tipo: 'concetto', fronte: R`Che cosa cambia quando la luce entra nell'acqua?`, retro: R`Velocità $v = c / n$ e lunghezza d'onda $\lambda / n$ diminuiscono. La frequenza, e quindi il colore, resta la stessa.` },
    { id: 'fc-07', sezione: 'young', tipo: 'concetto', fronte: R`Che cosa mostra l'esperimento di **Young**?`, retro: R`Che due fasci della stessa luce possono sommarsi e fare buio: interferenza. Quindi la luce è un'onda.` },
    { id: 'fc-08', sezione: 'young', tipo: 'formula', fronte: R`Condizioni per una frangia **chiara** e una **scura** con due fenditure`, retro: R`Chiara: $\Delta r = n \cdot \lambda$. Scura: $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$.` },
    { id: 'fc-09', sezione: 'young', tipo: 'definizione', fronte: R`Quando due sorgenti di luce sono **coerenti**?`, retro: R`Quando hanno la stessa frequenza e una differenza di fase che non cambia. Si ottengono dividendo la luce di una sola sorgente.` },
    { id: 'fc-10', sezione: 'frange', tipo: 'formula', fronte: R`Distanza fra due frange chiare vicine, nell'esperimento di Young`, retro: R`$\Delta y = \dfrac{\lambda \cdot L}{d}$, con $L$ distanza dello schermo e $d$ distanza fra le fenditure.` },
    { id: 'fc-11', sezione: 'frange', tipo: 'procedura', fronte: R`Come si misura la lunghezza d'onda con le frange di Young?`, retro: R`Si misura $\Delta y$ (meglio su molte frange), e si calcola $\lambda = \dfrac{\Delta y \cdot d}{L}$.` },
    { id: 'fc-12', sezione: 'frange', tipo: 'concetto', fronte: R`Che cosa succede alle frange se le fenditure si avvicinano?`, retro: R`Si allargano: $\Delta y$ è inversamente proporzionale a $d$.` },
    { id: 'fc-13', sezione: 'fenditura', tipo: 'formula', fronte: R`Dove cadono le frange **scure** di una fenditura sola?`, retro: R`Agli angoli con $a \cdot \sin\theta = m \cdot \lambda$, $m = 1, 2, 3, \dots$; al centro c'è il massimo.` },
    { id: 'fc-14', sezione: 'fenditura', tipo: 'concetto', fronte: R`Quanto è larga la macchia centrale di una fenditura?`, retro: R`$2 \cdot y_1 = \dfrac{2 \cdot \lambda \cdot L}{a}$: il doppio delle macchie laterali. Fenditura più stretta, macchia più larga.` },
    { id: 'fc-15', sezione: 'reticolo', tipo: 'formula', fronte: R`Legge del **reticolo**`, retro: R`$d \cdot \sin\theta = n \cdot \lambda$: $d$ è il passo, $n$ l'ordine.` },
    { id: 'fc-16', sezione: 'reticolo', tipo: 'procedura', fronte: R`Come si trova il passo di un reticolo con $N$ righe al millimetro?`, retro: R`$d = \tfrac{1}{N}$ mm. Con 500 righe al millimetro, $d = 0{,}002\,\text{mm} = 2\,\mu\text{m}$.` },
    { id: 'fc-17', sezione: 'reticolo', tipo: 'concetto', fronte: R`In un reticolo devia di più il rosso o il violetto?`, retro: R`Il rosso, perché ha la lunghezza d'onda più lunga. Nel prisma è il contrario.` },
    { id: 'fc-18', sezione: 'lamine', tipo: 'concetto', fronte: R`Quando un'onda di luce si **capovolge** riflettendosi?`, retro: R`Quando si riflette su un mezzo con indice di rifrazione più grande: è come mezza lunghezza d'onda in più.` },
    { id: 'fc-19', sezione: 'lamine', tipo: 'formula', fronte: R`Bolla di sapone: condizione per un riflesso **forte**`, retro: R`$2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$: un solo capovolgimento aggiunge mezza $\lambda$.` },
    { id: 'fc-20', sezione: 'lamine', tipo: 'concetto', fronte: R`Perché una bolla di sapone diventa nera prima di scoppiare?`, retro: R`Lo spessore è quasi zero: resta solo il capovolgimento del primo riflesso, e i due riflessi si annullano per tutti i colori.` },
    { id: 'fc-21', sezione: 'polarizzazione', tipo: 'definizione', fronte: R`Che cos'è la luce **polarizzata**?`, retro: R`Luce in cui il campo elettrico oscilla in una direzione sola. Nella luce naturale la direzione cambia a caso.` },
    { id: 'fc-22', sezione: 'polarizzazione', tipo: 'concetto', fronte: R`Perché la polarizzazione prova che la luce è un'onda trasversale?`, retro: R`Perché solo un'oscillazione di traverso ha una direzione da scegliere. Il suono, longitudinale, non si polarizza.` },
    { id: 'fc-23', sezione: 'malus', tipo: 'formula', fronte: R`Legge di **Malus**`, retro: R`$I = I_0 \cdot \cos^2\theta$, con $\theta$ angolo fra gli assi dei due polarizzatori.` },
    { id: 'fc-24', sezione: 'malus', tipo: 'concetto', fronte: R`Due filtri incrociati e un terzo in mezzo a 45°: quanta luce passa?`, retro: R`$\tfrac{1}{4} \cdot I_0$, cioè $\tfrac{1}{8}$ della luce naturale. Il filtro in mezzo fa oscillare la luce di sbieco.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un LED emette luce con frequenza $4 \cdot 10^{14}\,\text{Hz}$. Qual è la sua lunghezza d'onda nel vuoto, in nanometri? L'occhio la vede? (Usa $c = 3 \cdot 10^8\,\text{m/s}$.)`, suggerimenti: [R`Da $c = \lambda \cdot f$ ricava $\lambda$.`, R`Il risultato esce in metri: $1\,\text{nm} = 10^{-9}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 750, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{c}{f} = \dfrac{3 \cdot 10^8\,\text{m/s}}{4 \cdot 10^{14}\,\text{Hz}} = 7{,}5 \cdot 10^{-7}\,\text{m} = 750\,\text{nm}$.`, R`È oltre i 700 nm del rosso: infrarosso, che l'occhio non vede.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una luce ha frequenza $4{,}8 \cdot 10^{14}\,\text{Hz}$. Qual è la sua lunghezza d'onda nel vuoto, in nanometri?`, suggerimenti: [R`$\lambda = \dfrac{c}{f}$.`, R`Il risultato esce in metri: per i nanometri moltiplica per $10^9$.`], risposta: { tipo: 'numero', valore: 625, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{4{,}8 \cdot 10^{14}\,\text{Hz}} = 6{,}25 \cdot 10^{-7}\,\text{m} = 625\,\text{nm}$: una luce arancio.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`La sonda Voyager 1 dista dalla Terra circa $2{,}4 \cdot 10^{13}\,\text{m}$. Quante ore impiega il suo segnale radio, che va alla velocità della luce, ad arrivare fino a noi?`, suggerimenti: [R`Velocità costante: $\Delta t = \dfrac{\Delta s}{c}$.`, R`Il tempo esce in secondi: un'ora ha 3600 secondi.`], risposta: { tipo: 'numero', valore: 22.2, unita: 'h' }, soluzione: [R`$\Delta t = \dfrac{2{,}4 \cdot 10^{13}\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 8 \cdot 10^4\,\text{s}$.`, R`In ore: $\Delta t = \dfrac{80\,000}{3600}\,\text{h} \approx 22{,}2\,\text{h}$, quasi un giorno intero.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`In un vetro molto pesante, il vetro flint, la luce va a $1{,}875 \cdot 10^8\,\text{m/s}$. Quanto vale il suo indice di rifrazione?`, suggerimenti: [R`Da $v = \dfrac{c}{n}$ ricava $n = \dfrac{c}{v}$.`], risposta: { tipo: 'numero', valore: 1.6 }, segnaposto: 'Un numero (es. 1,2)', soluzione: [R`$n = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}875 \cdot 10^8\,\text{m/s}} = 1{,}6$: un numero puro, senza unità.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una luce rossa di $630\,\text{nm}$ entra in una plastica con indice di rifrazione $n = 1{,}4$. Quanto è lunga la sua lunghezza d'onda nella plastica?`, suggerimenti: [R`La frequenza resta la stessa: la lunghezza d'onda si divide per $n$.`], risposta: { tipo: 'numero', valore: 450, unita: 'nm' }, soluzione: [R`$\lambda_n = \dfrac{\lambda}{n} = \dfrac{630\,\text{nm}}{1{,}4} = 450\,\text{nm}$. Il colore resta rosso: lo decide la frequenza.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`In un esperimento di Young con luce di $450\,\text{nm}$, in un punto dello schermo la differenza di cammino è $1800\,\text{nm}$. Quante lunghezze d'onda ci stanno? La frangia è chiara o scura?`, suggerimenti: [R`Dividi la differenza di cammino per $\lambda$.`, R`Un numero intero dà una frangia chiara.`], risposta: { tipo: 'numero', valore: 4 }, segnaposto: 'Un numero (es. 2,5)', soluzione: [R`$\dfrac{\Delta r}{\lambda} = \dfrac{1800\,\text{nm}}{450\,\text{nm}} = 4$.`, R`È un numero intero: cresta con cresta, frangia **chiara** (la quarta dopo quella centrale).`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Con luce di $640\,\text{nm}$, qual è la più piccola differenza di cammino che dà una frangia scura?`, suggerimenti: [R`Frangia scura: $\Delta r = \left(n + \tfrac{1}{2}\right) \cdot \lambda$. La più piccola ha $n = 0$.`], risposta: { tipo: 'numero', valore: 320, unita: 'nm' }, soluzione: [R`Con $n = 0$: $\Delta r = \tfrac{1}{2} \cdot 640\,\text{nm} = 320\,\text{nm}$, mezza lunghezza d'onda.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Due fenditure distano $0{,}45\,\text{mm}$ e sono illuminate con luce di $540\,\text{nm}$. Lo schermo è a $2{,}5\,\text{m}$. Quanto distano due frange chiare vicine?`, suggerimenti: [R`$\Delta y = \dfrac{\lambda \cdot L}{d}$.`, R`Metti tutte le lunghezze in metri, poi passa ai millimetri.`], risposta: { tipo: 'numero', valore: 3, unita: 'mm' }, soluzione: [R`$\Delta y = \dfrac{540 \cdot 10^{-9}\,\text{m} \cdot 2{,}5\,\text{m}}{0{,}45 \cdot 10^{-3}\,\text{m}} = 3 \cdot 10^{-3}\,\text{m} = 3\,\text{mm}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`In un esperimento di Young le fenditure distano $0{,}2\,\text{mm}$ e lo schermo è a $0{,}8\,\text{m}$. Le frange chiare distano $2{,}2\,\text{mm}$. Qual è la lunghezza d'onda della luce?`, suggerimenti: [R`Gira la formula: $\lambda = \dfrac{\Delta y \cdot d}{L}$.`], risposta: { tipo: 'numero', valore: 550, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{2{,}2 \cdot 10^{-3}\,\text{m} \cdot 0{,}2 \cdot 10^{-3}\,\text{m}}{0{,}8\,\text{m}} = 5{,}5 \cdot 10^{-7}\,\text{m} = 550\,\text{nm}$: luce verde.`] },
    { id: 'b-10', livello: 'base', difficolta: 2, testo: R`Con luce di $700\,\text{nm}$ e lo schermo a $1{,}2\,\text{m}$, le frange chiare distano $4{,}2\,\text{mm}$. Quanto distano le due fenditure?`, suggerimenti: [R`Da $\Delta y = \dfrac{\lambda \cdot L}{d}$ ricava $d$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'mm' }, soluzione: [R`$d = \dfrac{\lambda \cdot L}{\Delta y} = \dfrac{700 \cdot 10^{-9}\,\text{m} \cdot 1{,}2\,\text{m}}{4{,}2 \cdot 10^{-3}\,\text{m}} = 2 \cdot 10^{-4}\,\text{m} = 0{,}2\,\text{mm}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Nell'esperimento di Young le frange chiare distano $1{,}8\,\text{mm}$. A che distanza dal centro dello schermo sta la terza frangia chiara?`, suggerimenti: [R`Le frange sono equidistanti, e al centro c'è la frangia numero zero.`], risposta: { tipo: 'numero', valore: 5.4, unita: 'mm' }, soluzione: [R`$y_3 = 3 \cdot \Delta y = 3 \cdot 1{,}8\,\text{mm} = 5{,}4\,\text{mm}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Una luce di $480\,\text{nm}$ passa da una fenditura larga $0{,}12\,\text{mm}$. Lo schermo è a $1{,}75\,\text{m}$. A che distanza dal centro cade il primo buio?`, suggerimenti: [R`Una fenditura: il primo buio è a $y_1 = \dfrac{\lambda \cdot L}{a}$.`], risposta: { tipo: 'numero', valore: 7, unita: 'mm' }, soluzione: [R`$y_1 = \dfrac{480 \cdot 10^{-9}\,\text{m} \cdot 1{,}75\,\text{m}}{0{,}12 \cdot 10^{-3}\,\text{m}} = 7 \cdot 10^{-3}\,\text{m} = 7\,\text{mm}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Una luce di $450\,\text{nm}$ passa da una fenditura larga $0{,}3\,\text{mm}$, con lo schermo a 2 m. Quanto è larga la macchia chiara centrale?`, suggerimenti: [R`La macchia centrale va dal primo buio da una parte al primo buio dall'altra: $2 \cdot y_1$.`], risposta: { tipo: 'numero', valore: 6, unita: 'mm' }, soluzione: [R`$y_1 = \dfrac{450 \cdot 10^{-9}\,\text{m} \cdot 2\,\text{m}}{0{,}3 \cdot 10^{-3}\,\text{m}} = 3 \cdot 10^{-3}\,\text{m} = 3\,\text{mm}$.`, R`Larghezza: $2 \cdot 3\,\text{mm} = 6\,\text{mm}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Un reticolo ha 400 righe al millimetro. Quanto vale il suo passo $d$, in micrometri?`, suggerimenti: [R`$d = \tfrac{1}{N}$ mm, e $1\,\text{mm} = 1000\,\mu\text{m}$.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'μm' }, soluzione: [R`$d = \dfrac{1}{400}\,\text{mm} = 0{,}0025\,\text{mm} = 2{,}5\,\mu\text{m}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Un reticolo ha passo $d = 2{,}5\,\mu\text{m}$. Lo illumina una luce di $500\,\text{nm}$. A che angolo esce il primo ordine?`, suggerimenti: [R`$\sin\theta = \dfrac{\lambda}{d}$, con le due lunghezze nella stessa unità.`, R`$2{,}5\,\mu\text{m} = 2500\,\text{nm}$. Poi l'angolo con la calcolatrice.`], risposta: { tipo: 'numero', valore: 11.5, unita: '°', tolleranza: 0.2 }, soluzione: [R`$\sin\theta = \dfrac{500\,\text{nm}}{2500\,\text{nm}} = 0{,}2$.`, R`$\theta \approx 11{,}5^\circ$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Un reticolo ha passo $d = 1{,}18\,\mu\text{m}$. Il primo ordine di una luce esce a 30°. Qual è la sua lunghezza d'onda?`, suggerimenti: [R`$\lambda = d \cdot \sin\theta$, e $\sin 30^\circ = 0{,}5$.`], risposta: { tipo: 'numero', valore: 590, unita: 'nm' }, soluzione: [R`$\lambda = 1180\,\text{nm} \cdot \sin 30^\circ = 1180\,\text{nm} \cdot 0{,}5 = 590\,\text{nm}$: luce gialla, al confine con l'arancio.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Un reticolo ha passo $d = 3\,\mu\text{m}$ ed è illuminato con luce di $700\,\text{nm}$. Qual è l'ordine più alto che si vede?`, suggerimenti: [R`$\sin\theta$ non può superare 1: serve $n \cdot \lambda \le d$.`, R`Calcola $d / \lambda$ e prendi l'intero più grande che non lo supera.`], risposta: { tipo: 'numero', valore: 4 }, segnaposto: 'Un numero intero', soluzione: [R`$\dfrac{d}{\lambda} = \dfrac{3000\,\text{nm}}{700\,\text{nm}} \approx 4{,}3$.`, R`L'ordine più alto è $n = 4$: il quinto avrebbe $\sin\theta \approx 1{,}17$, impossibile.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Una lamina d'acqua e sapone ($n = 1{,}33$) è spessa $150\,\text{nm}$. Quanto vale il tratto in più $2 \cdot n \cdot s$ del raggio riflesso dalla faccia dietro?`, suggerimenti: [R`Moltiplica: $2 \cdot n \cdot s$.`], risposta: { tipo: 'numero', valore: 399, unita: 'nm' }, soluzione: [R`$2 \cdot n \cdot s = 2 \cdot 1{,}33 \cdot 150\,\text{nm} = 399\,\text{nm}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Una luce naturale con intensità $90\,\text{W/m}^2$ attraversa un polarizzatore. Che intensità ha dopo il filtro?`, suggerimenti: [R`Della luce naturale un polarizzatore lascia passare metà, qualunque sia l'asse.`], risposta: { tipo: 'numero', valore: 45, unita: 'W/m²' }, soluzione: [R`$I_0 = \tfrac{1}{2} \cdot 90\,\text{W/m}^2 = 45\,\text{W/m}^2$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Una luce polarizzata con intensità $I_0 = 36\,\text{W/m}^2$ arriva su un polarizzatore con l'asse a 45° dalla sua direzione. Che intensità passa?`, suggerimenti: [R`Legge di Malus: $I = I_0 \cdot \cos^2\theta$.`, R`$\cos 45^\circ \approx 0{,}707$: non dimenticare il quadrato.`], risposta: { tipo: 'numero', valore: 18, unita: 'W/m²' }, soluzione: [R`$\cos^2 45^\circ = 0{,}5$.`, R`$I = 36\,\text{W/m}^2 \cdot 0{,}5 = 18\,\text{W/m}^2$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Due fenditure distanti $0{,}5\,\text{mm}$ sono illuminate con luce bianca; lo schermo è a $1{,}5\,\text{m}$. La prima frangia chiara di lato è colorata: va dal violetto (400 nm) al rosso (700 nm). Quanto è larga?`, suggerimenti: [R`Calcola la posizione della prima frangia, $y_1 = \dfrac{\lambda \cdot L}{d}$, per il violetto e per il rosso.`, R`La larghezza è la differenza fra le due posizioni.`], risposta: { tipo: 'numero', valore: 0.9, unita: 'mm' }, soluzione: [R`Violetto: $y_1 = \dfrac{400 \cdot 10^{-9} \cdot 1{,}5}{0{,}5 \cdot 10^{-3}}\,\text{m} = 1{,}2\,\text{mm}$.`, R`Rosso: $y_1 = \dfrac{700 \cdot 10^{-9} \cdot 1{,}5}{0{,}5 \cdot 10^{-3}}\,\text{m} = 2{,}1\,\text{mm}$.`, R`Larghezza: $2{,}1 - 1{,}2 = 0{,}9\,\text{mm}$. Al centro invece tutti i colori hanno $\Delta r = 0$: la frangia centrale è bianca.`] },
    { id: 'es-02', difficolta: 2, testo: R`In un esperimento di Young nell'aria le frange chiare distano $4{,}0\,\text{mm}$. Si mette tutto l'apparato sott'acqua ($n = 1{,}33$), con la stessa luce. Quanto distano ora le frange?`, suggerimenti: [R`Sott'acqua la lunghezza d'onda diventa $\lambda / n$.`, R`$\Delta y$ è proporzionale a $\lambda$.`], risposta: { tipo: 'numero', valore: 3.0, unita: 'mm', tolleranza: 0.05 }, soluzione: [R`Nell'acqua $\lambda_n = \dfrac{\lambda}{1{,}33}$, e $\Delta y = \dfrac{\lambda_n \cdot L}{d}$ si riduce nello stesso rapporto.`, R`$\Delta y = \dfrac{4{,}0\,\text{mm}}{1{,}33} \approx 3{,}0\,\text{mm}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Su un DVD i giri della spirale distano $0{,}74\,\mu\text{m}$. Lo si illumina perpendicolarmente con un laser rosso di $650\,\text{nm}$. A che angolo esce il primo ordine? C'è un secondo ordine?`, suggerimenti: [R`Il DVD fa da reticolo con $d = 740\,\text{nm}$: $\sin\theta = \dfrac{n \cdot \lambda}{d}$.`, R`Per il secondo ordine controlla se $2 \cdot \lambda \le d$.`], risposta: { tipo: 'numero', valore: 61.4, unita: '°', tolleranza: 0.3 }, soluzione: [R`$\sin\theta_1 = \dfrac{650}{740} \approx 0{,}878$, quindi $\theta_1 \approx 61{,}4^\circ$.`, R`Secondo ordine: $\dfrac{2 \cdot 650}{740} \approx 1{,}76$, più di 1. Non esiste: il DVD dà un solo ordine per lato.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un reticolo ha passo $d = 2\,\mu\text{m}$ ed è illuminato con luce bianca, da 400 a 700 nm. A che angolo finisce, sul rosso, lo spettro del secondo ordine? Il terzo ordine comincia prima o dopo?`, suggerimenti: [R`Fine del secondo ordine: il rosso, $\sin\theta = \dfrac{2 \cdot 700}{2000}$.`, R`Inizio del terzo: il violetto, $\sin\theta = \dfrac{3 \cdot 400}{2000}$. Confronta gli angoli.`], risposta: { tipo: 'numero', valore: 44.4, unita: '°', tolleranza: 0.3 }, soluzione: [R`Rosso, secondo ordine: $\sin\theta = \dfrac{1400}{2000} = 0{,}7$, quindi $\theta \approx 44{,}4^\circ$.`, R`Violetto, terzo ordine: $\sin\theta = \dfrac{1200}{2000} = 0{,}6$, quindi $\theta \approx 36{,}9^\circ$.`, R`Il terzo ordine comincia **prima** che finisca il secondo: gli spettri si sovrappongono e i colori si mescolano.`] },
    { id: 'es-05', difficolta: 2, testo: R`Qual è lo spessore minimo di una lamina d'acqua e sapone ($n = 1{,}33$) che riflette al massimo la luce verde di $520\,\text{nm}$?`, suggerimenti: [R`Nella bolla c'è un solo capovolgimento: riflesso forte se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$.`, R`Lo spessore minimo ha $m = 0$: $s = \dfrac{\lambda}{4 \cdot n}$.`], risposta: { tipo: 'numero', valore: 97.7, unita: 'nm', tolleranza: 1 }, soluzione: [R`Con $m = 0$: $2 \cdot n \cdot s = \tfrac{1}{2} \cdot \lambda$.`, R`$s = \dfrac{520\,\text{nm}}{4 \cdot 1{,}33} \approx 97{,}7\,\text{nm}$.`, R`Controllo: il tratto in più è $2 \cdot 1{,}33 \cdot 97{,}7 \approx 260\,\text{nm}$, mezza $\lambda$; con il capovolgimento fa una $\lambda$ intera: cresta con cresta.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una macchia d'olio ($n = 1{,}45$) galleggia sull'acqua ($n = 1{,}33$) ed è spessa $300\,\text{nm}$. Guardandola dall'alto, di fronte, quale lunghezza d'onda visibile riflette al massimo?`, suggerimenti: [R`Sopra: aria → olio, indice più grande, capovolgimento. Sotto: olio → acqua, indice più piccolo, niente capovolgimento.`, R`Un solo capovolgimento: riflesso forte se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$. Prova $m = 0, 1, 2$.`], risposta: { tipo: 'numero', valore: 580, unita: 'nm' }, soluzione: [R`Tratto in più: $2 \cdot 1{,}45 \cdot 300\,\text{nm} = 870\,\text{nm}$. C'è un solo capovolgimento.`, R`$\lambda = \dfrac{870\,\text{nm}}{m + \frac{1}{2}}$: con $m = 0$ viene 1740 nm (infrarosso), con $m = 1$ viene 580 nm, con $m = 2$ circa 348 nm (ultravioletto).`, R`L'unica visibile è $580\,\text{nm}$: la macchia sembra gialla.`] },
    { id: 'es-07', difficolta: 3, testo: R`Una luce naturale di $100\,\text{W/m}^2$ attraversa quattro polarizzatori, con gli assi a 0°, 30°, 60° e 90°. Quanta luce esce dall'ultimo?`, suggerimenti: [R`Il primo dimezza la luce naturale.`, R`Ogni filtro successivo è ruotato di 30° sul precedente: ognuno lascia passare $\cos^2 30^\circ = 0{,}75$.`], risposta: { tipo: 'numero', valore: 21.1, unita: 'W/m²', tolleranza: 0.2 }, soluzione: [R`Dopo il primo: $50\,\text{W/m}^2$.`, R`Tre passi da 30°: $50 \cdot 0{,}75^3\,\text{W/m}^2 = 50 \cdot 0{,}421875\,\text{W/m}^2 \approx 21{,}1\,\text{W/m}^2$.`, R`Senza i due filtri di mezzo, con gli assi a 0° e 90°, non passerebbe niente.`] },
    { id: 'es-08', difficolta: 2, testo: R`Di che angolo bisogna ruotare il secondo polarizzatore, rispetto al primo, perché passi un terzo di $I_0$?`, suggerimenti: [R`Imponi $\cos^2\theta = \tfrac{1}{3}$.`, R`$\cos\theta = \sqrt{1/3} \approx 0{,}577$; poi l'angolo con la calcolatrice.`], risposta: { tipo: 'numero', valore: 54.7, unita: '°', tolleranza: 0.3 }, soluzione: [R`$I_0 \cdot \cos^2\theta = \tfrac{1}{3} \cdot I_0$, quindi $\cos\theta = \sqrt{\tfrac{1}{3}} \approx 0{,}577$.`, R`$\theta \approx 54{,}7^\circ$. Va bene anche $180^\circ - 54{,}7^\circ$: conta solo l'angolo fra gli assi.`] },
    { id: 'es-09', difficolta: 2, testo: R`In un esperimento di Young le fenditure distano $0{,}15\,\text{mm}$ e lo schermo è a $1{,}2\,\text{m}$. Fra la frangia chiara centrale e la sesta frangia chiara ci sono $21\,\text{mm}$. Qual è la lunghezza d'onda?`, suggerimenti: [R`Fra la frangia 0 e la frangia 6 ci sono sei intervalli.`, R`Poi $\lambda = \dfrac{\Delta y \cdot d}{L}$.`], risposta: { tipo: 'numero', valore: 437.5, unita: 'nm' }, soluzione: [R`$\Delta y = \dfrac{21\,\text{mm}}{6} = 3{,}5\,\text{mm}$. Misurare tante frange insieme riduce l'errore.`, R`$\lambda = \dfrac{3{,}5 \cdot 10^{-3}\,\text{m} \cdot 0{,}15 \cdot 10^{-3}\,\text{m}}{1{,}2\,\text{m}} \approx 4{,}38 \cdot 10^{-7}\,\text{m} \approx 438\,\text{nm}$: luce violetta.`] },
    { id: 'es-10', difficolta: 3, testo: R`Su un vetro con $n = 1{,}5$ si deposita uno strato antiriflesso con $n = 1{,}25$. Quanto deve essere spesso, al minimo, per spegnere il riflesso della luce di $560\,\text{nm}$?`, suggerimenti: [R`Conta i capovolgimenti: aria → strato e strato → vetro.`, R`Con due capovolgimenti il riflesso è spento se $2 \cdot n \cdot s = \left(m + \tfrac{1}{2}\right) \cdot \lambda$.`], risposta: { tipo: 'numero', valore: 112, unita: 'nm' }, soluzione: [R`Tutti e due i riflessi vanno verso un indice più grande (da 1 a 1,25 e da 1,25 a 1,5): due capovolgimenti, che si compensano.`, R`Spento con $m = 0$: $s = \dfrac{\lambda}{4 \cdot n} = \dfrac{560\,\text{nm}}{4 \cdot 1{,}25} = 112\,\text{nm}$.`] },
    { id: 'es-11', difficolta: 2, testo: R`Una luce di $680\,\text{nm}$ passa da una fenditura. Sullo schermo, a 2 m, la macchia centrale è larga $17\,\text{mm}$. Quanto è larga la fenditura?`, suggerimenti: [R`La macchia centrale è larga $2 \cdot y_1$: il primo buio è a 8,5 mm.`, R`Da $y_1 = \dfrac{\lambda \cdot L}{a}$ ricava $a$.`], risposta: { tipo: 'numero', valore: 0.16, unita: 'mm' }, soluzione: [R`$y_1 = \dfrac{17\,\text{mm}}{2} = 8{,}5\,\text{mm}$.`, R`$a = \dfrac{\lambda \cdot L}{y_1} = \dfrac{680 \cdot 10^{-9}\,\text{m} \cdot 2\,\text{m}}{8{,}5 \cdot 10^{-3}\,\text{m}} = 1{,}6 \cdot 10^{-4}\,\text{m} = 0{,}16\,\text{mm}$.`] },
    { id: 'es-12', difficolta: 2, testo: R`Un segnale di luce percorre un chilometro dentro un vetro con $n = 1{,}5$. Quanto ritardo accumula rispetto a un segnale che percorre un chilometro nel vuoto?`, suggerimenti: [R`Nel vetro $v = \dfrac{c}{n} = 2 \cdot 10^8\,\text{m/s}$.`, R`Calcola i due tempi e sottrai.`], risposta: { tipo: 'numero', valore: 1.67, unita: 'μs' }, soluzione: [R`Nel vetro: $\Delta t = \dfrac{1000\,\text{m}}{2 \cdot 10^8\,\text{m/s}} = 5 \cdot 10^{-6}\,\text{s} = 5\,\mu\text{s}$.`, R`Nel vuoto: $\dfrac{1000\,\text{m}}{3 \cdot 10^8\,\text{m/s}} \approx 3{,}33\,\mu\text{s}$.`, R`Ritardo: $5 - 3{,}33 \approx 1{,}67\,\mu\text{s}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Quale osservazione dimostra che la luce è un'onda?`, opzioni: [R`Le frange chiare e scure di due fenditure`, R`L'ombra netta di un oggetto`, R`La riflessione su uno specchio`, R`La propagazione in linea retta`], corretta: 0, spiegazione: R`Solo le onde interferiscono: due fasci di luce che fanno buio sono possibili solo per le onde. Ombre nette, riflessione e propagazione in linea retta si spiegavano anche con i corpuscoli.` },
    { id: 'q-02', domanda: R`Quale di queste luci visibili ha la frequenza più alta?`, opzioni: [R`Il rosso`, R`Il verde`, R`Il violetto`, R`Il giallo`], corretta: 2, spiegazione: R`Da $f = c / \lambda$: la frequenza più alta va con la lunghezza d'onda più corta, cioè il violetto, intorno a 400 nm. Il rosso ha la frequenza più bassa.` },
    { id: 'q-03', domanda: R`La luce passa dall'aria all'acqua. Che cosa succede?`, opzioni: [R`La frequenza diminuisce`, R`La lunghezza d'onda si accorcia`, R`La velocità aumenta`, R`Il colore cambia`], corretta: 1, spiegazione: R`Nell'acqua la luce rallenta, $v = c / n$. La frequenza resta la stessa, quindi si accorcia la lunghezza d'onda, $\lambda / n$. Il colore lo decide la frequenza: non cambia.` },
    { id: 'q-04', domanda: R`Perché due lampadine vicine non danno frange di interferenza visibili?`, opzioni: [R`Perché la loro luce è troppo debole`, R`Perché la luce bianca non interferisce mai`, R`Perché le frange sarebbero troppo larghe`, R`Perché non sono sorgenti coerenti`], corretta: 3, spiegazione: R`Le onde di due lampadine cambiano fase a caso, di continuo: le frange si spostano troppo in fretta e l'occhio vede la media. Anche la luce bianca fa frange, colorate, se viene da una sola sorgente.` },
    { id: 'q-05', domanda: R`Nell'esperimento di Young, che cosa c'è al centro dello schermo?`, opzioni: [R`Una frangia scura`, R`Una zona buia larga`, R`Una frangia chiara`, R`Una frangia rossa, qualunque sia la luce`], corretta: 2, spiegazione: R`Al centro i due percorsi sono uguali: $\Delta r = 0$, e le onde arrivano cresta con cresta. È una frangia chiara, del colore della luce usata.` },
    { id: 'q-06', domanda: R`In un esperimento di Young si passa da un laser rosso a uno verde. Le frange…`, opzioni: [R`si stringono`, R`si allargano`, R`restano uguali`, R`spariscono`], corretta: 0, spiegazione: R`$\Delta y = \lambda \cdot L / d$: il verde ha $\lambda$ più corta del rosso, quindi le frange sono più vicine.` },
    { id: 'q-07', domanda: R`Una fenditura larga $a$ è illuminata con luce di lunghezza d'onda $\lambda$. Dove cade il primo buio?`, opzioni: [R`Dove $a \cdot \sin\theta = \tfrac{1}{2} \cdot \lambda$`, R`Dove $a \cdot \sin\theta = 2 \cdot \lambda$`, R`Al centro, dove $\theta = 0$`, R`Dove $a \cdot \sin\theta = \lambda$`], corretta: 3, spiegazione: R`Le onde della metà alta e della metà bassa si annullano a coppie quando $a \cdot \sin\theta = \lambda$. Al centro c'è il massimo, non il buio. La condizione con mezza $\lambda$ è quella delle frange scure di Young.` },
    { id: 'q-08', domanda: R`Un reticolo ha più righe di un altro, con lo stesso passo. Che differenza c'è nei massimi?`, opzioni: [R`Si spostano verso il centro`, R`Restano agli stessi angoli, ma più sottili`, R`Si allargano`, R`Cambiano colore`], corretta: 1, spiegazione: R`Gli angoli li decide $d \cdot \sin\theta = n \cdot \lambda$, che non dipende dal numero di righe. Con più righe i massimi diventano più sottili e netti.` },
    { id: 'q-09', domanda: R`Un reticolo illuminato con luce bianca: nel primo ordine, come sono disposti i colori a partire dal centro?`, opzioni: [R`Prima il rosso, poi il violetto`, R`Tutti nello stesso punto`, R`Prima il violetto, poi il rosso`, R`Resta solo luce bianca`], corretta: 2, spiegazione: R`Da $\sin\theta = \lambda / d$: il violetto, con la $\lambda$ più corta, esce più vicino al centro; il rosso più lontano. Nel prisma è il contrario.` },
    { id: 'q-10', domanda: R`Perché una bolla di sapone si colora?`, opzioni: [R`Il sapone contiene pigmenti`, R`Interferenza fra i riflessi delle due facce`, R`Rifrazione, come in un prisma`, R`Diffrazione sul bordo della bolla`], corretta: 1, spiegazione: R`La luce riflessa dalla faccia davanti e quella riflessa dalla faccia dietro si sommano o si annullano, secondo lo spessore e la lunghezza d'onda. Il sapone è trasparente.` },
    { id: 'q-11', domanda: R`La luce si riflette su un mezzo con indice di rifrazione più grande di quello da cui arriva. Che cosa succede all'onda riflessa?`, opzioni: [R`Si capovolge`, R`Non cambia: la riflessione conserva la fase`, R`Cambia frequenza, come quando cambia mezzo`, R`Rallenta, perché il mezzo è più denso`], corretta: 0, spiegazione: R`Riflettendosi verso un indice più grande l'onda si capovolge, la cresta diventa gola. La frequenza non cambia mai, e la velocità dell'onda riflessa è quella del mezzo da cui arriva.` },
    { id: 'q-12', domanda: R`Perché il suono non si può polarizzare?`, opzioni: [R`Perché è troppo lento`, R`Perché ha bisogno dell'aria`, R`Perché ha una lunghezza d'onda troppo grande`, R`Perché è un'onda longitudinale`], corretta: 3, spiegazione: R`Polarizzare vuol dire scegliere una direzione di oscillazione di traverso. Il suono oscilla lungo la direzione in cui va: non ce n'è una da scegliere. Velocità, mezzo e lunghezza d'onda non c'entrano.` },
    { id: 'q-13', domanda: R`Una luce naturale attraversa un polarizzatore. Quanta intensità passa?`, opzioni: [R`Tutta`, R`Metà`, R`Niente`, R`Dipende da come è girato il filtro`], corretta: 1, spiegazione: R`Nella luce naturale il campo oscilla in tutte le direzioni, a caso: in media passa metà, qualunque sia l'asse. La legge di Malus vale per la luce già polarizzata.` },
    { id: 'q-14', domanda: R`Fra due polarizzatori incrociati, a 90°, si mette un terzo filtro con l'asse a 45°. Che cosa succede?`, opzioni: [R`Torna un po' di luce`, R`Resta buio`, R`Passa tutta la luce`, R`Passa metà della luce naturale`], corretta: 0, spiegazione: R`Il filtro in mezzo fa oscillare la luce a 45°: ogni filtro ne lascia passare metà, e alla fine arriva $\tfrac{1}{8}$ della luce naturale. Poca, ma non zero.` },
    { id: 'q-15', domanda: R`Per quale angolo fra gli assi di due polarizzatori passa metà di $I_0$?`, opzioni: [R`30°`, R`60°`, R`90°`, R`45°`], corretta: 3, spiegazione: R`$\cos^2 45^\circ = 0{,}5$. A 30° passano tre quarti, a 60° un quarto, a 90° niente.` },
    { id: 'q-16', domanda: R`Perché gli occhiali polarizzati spengono i riflessi sull'acqua?`, opzioni: [R`Perché sono più scuri degli altri`, R`Perché assorbono il blu`, R`La luce riflessa è polarizzata in orizzontale, le lenti lasciano passare la verticale`, R`Perché il vetro delle lenti è più scuro nella parte bassa`], corretta: 2, spiegazione: R`La luce riflessa dall'acqua è in gran parte polarizzata in orizzontale. Un polarizzatore verticale ne lascia passare poca, mentre fa passare metà della luce naturale del resto della scena.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nelle formule di Young le lunghezze vanno nella stessa unità: $\lambda$ in nanometri e $d$ in millimetri si convertono prima in metri.` },
    { tipo: 'errore', testo: R`Young e una fenditura sola hanno formule simili ma opposte: con due fenditure $d \cdot \sin\theta = n \cdot \lambda$ dà le frange chiare, con una $a \cdot \sin\theta = m \cdot \lambda$ dà quelle scure.` },
    { tipo: 'errore', testo: R`Nella legge di Malus c'è il coseno **al quadrato**: a 60° passa un quarto, non metà.` },
    { tipo: 'errore', testo: R`Sulla luce naturale il primo polarizzatore dimezza e basta: il $\cos^2\theta$ serve solo dal secondo filtro in poi.` },
    { tipo: 'trucco', testo: R`Le frange sono equidistanti: misura tante frange insieme e dividi. Dieci intervalli danno $\Delta y$ con un errore dieci volte più piccolo.` },
    { tipo: 'trucco', testo: R`Più la fessura è stretta, più la luce si apre: $d$ o $a$ piccoli danno frange larghe. Se ti viene il contrario, ricontrolla la formula.` },
    { tipo: 'metodo', testo: R`Nelle lamine sottili conta prima i capovolgimenti: uno solo scambia chiaro e scuro, due si compensano. Poi confronta $2 \cdot n \cdot s$ con $\lambda$.` },
    { tipo: 'metodo', testo: R`Con un reticolo controlla sempre che $\sin\theta$ non superi 1: gli ordini con $n \cdot \lambda > d$ non esistono.` }
  ],
  aneddoti: [
    { fisico: 'Thomas Young', anni: '1773–1829', titolo: 'Il cartoncino dentro un raggio di sole', testo: R`Thomas Young era un medico inglese con una curiosità senza confini. Nel novembre del 1803 descrisse alla Royal Society un esperimento che chiunque può rifare. Fece entrare in una stanza buia un raggio di sole, da un forellino nell'imposta. Nel fascio mise di taglio un cartoncino sottile, largo circa un trentesimo di pollice. Nell'ombra del cartoncino comparvero frange chiare e scure. Se copriva la luce da un lato del cartoncino, le frange sparivano: servivano tutte e due le metà del fascio. Era interferenza. Molti non gli credettero, e una rivista di Edimburgo lo attaccò con durezza. La versione con due fenditure compare nelle sue lezioni stampate nel 1807. Young lavorò anche a decifrare i geroglifici della stele di Rosetta.`, legame: R`È la prova che la luce è un'onda: due fasci della stessa luce che si sommano e fanno buio.` },
    { fisico: 'Augustin Fresnel', anni: '1788–1827', titolo: 'Il punto luminoso in mezzo all\'ombra', testo: R`Nel 1817 l'Accademia delle scienze di Parigi mise in palio un premio sulla diffrazione. Augustin Fresnel, giovane ingegnere dei ponti e strade, presentò nel 1818 una teoria a onde con calcoli precisi. Fra i giudici c'era Siméon-Denis Poisson, che credeva nei corpuscoli. Poisson fece i conti con la teoria di Fresnel e trovò una conseguenza che gli sembrava assurda. Dietro un dischetto illuminato, proprio al centro dell'ombra, doveva esserci un punto luminoso. François Arago, un altro giudice, provò a cercarlo. Il punto c'era. Fresnel vinse il premio nel 1819. Oggi quel punto si chiama macchia di Poisson, o di Arago. In realtà era già stato visto un secolo prima, ma nessuno se ne ricordava.`, legame: R`È la diffrazione della luce: dietro un ostacolo le onde si piegano e possono sommarsi anche al centro dell'ombra.` },
    { fisico: 'Étienne-Louis Malus', anni: '1775–1812', titolo: 'I vetri del palazzo al tramonto', testo: R`Étienne-Louis Malus era un ufficiale del genio. Aveva seguito Napoleone in Egitto ed era sopravvissuto alla peste. Una sera del 1808, a Parigi, guardava dalla finestra di casa il palazzo del Lussemburgo. I vetri del palazzo riflettevano il sole al tramonto. Malus guardò quel riflesso attraverso un cristallo di spato d'Islanda, che di solito sdoppia le immagini. Girando il cristallo, una delle due immagini si indeboliva fino quasi a sparire. La luce riflessa dai vetri non era più luce comune. L'episodio lo racconta François Arago. Malus chiamò il fenomeno polarizzazione, e l'anno dopo pubblicò la legge del coseno al quadrato. Morì nel 1812, a 36 anni.`, legame: R`È la scoperta che la luce riflessa è polarizzata, e la legge $I = I_0 \cdot \cos^2\theta$ porta il suo nome.` },
    { fisico: 'Isaac Newton', anni: '1643–1727', titolo: 'Gli anelli colorati fra due vetri', testo: R`Negli anni Settanta del Seicento Isaac Newton premette una lente poco curva contro un'altra lastra di vetro. Fra le due restava un velo d'aria, sottilissimo al centro e più spesso verso il bordo. Guardando dall'alto vide anelli colorati intorno al punto di contatto. Con luce di un solo colore gli anelli diventavano chiari e scuri, alternati. Newton ne misurò i diametri con grande cura. Trovò che gli spessori d'aria degli anelli chiari crescevano come 1, 3, 5, 7, quelli degli scuri come 0, 2, 4, 6. Al centro, dove lo spessore è zero, c'era buio. Newton spiegò tutto con i corpuscoli e pubblicò le misure nell'*Ottica* del 1704. Oggi quegli anelli portano il suo nome, e sono una prova delle onde.`, legame: R`Sono l'interferenza in una lamina sottile d'aria, con il centro scuro come la bolla di sapone che sta per scoppiare.` }
  ]
});
})();
