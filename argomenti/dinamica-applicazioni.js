/* Quanto — Applicazioni della dinamica (terzo anno): corpi collegati da funi, macchina di Atwood, piano inclinato
   senza e con attrito, forza centripeta, auto in curva e curva sopraelevata, massa sulla molla, pendolo semplice.
   Contratto in SCHEMA.md, modello cinematica.js; simboli e colori di forze.js, equilibrio.js e dinamica.js
   (attrito F_s/F_d, μ_s/μ_d; P_∥ e P_⊥ sul piano inclinato). Verifica: node strumenti/verifica-argomento.js argomenti/dinamica-applicazioni.js */
(function () {
const R = String.raw;
/* punti nel riferimento del piano inclinato (slitta): u lungo il piano verso l'alto, n perpendicolare, dal punto a 6 dalla base */
const SA = 'sin(al*pi/180)', CA = 'cos(al*pi/180)';
const sl = (u, n) => ['6*' + CA + ' + (' + u + ')*' + CA + ' - (' + n + ')*' + SA, '6*' + SA + ' + (' + u + ')*' + SA + ' + (' + n + ')*' + CA];
/* punti nel riferimento della strada sopraelevata, dall'origine: u lungo la strada, n perpendicolare */
const ST = 'sin(th*pi/180)', CT = 'cos(th*pi/180)';
const sp = (u, n) => ['(' + u + ')*' + CT + ' - (' + n + ')*' + ST, '(' + u + ')*' + ST + ' + (' + n + ')*' + CT];
QUANTO.registra({
  id: 'dinamica-applicazioni',
  titolo: 'Applicazioni della dinamica',
  introduzione: R`I principi della dinamica valgono per ogni corpo. Qui li mettiamo al lavoro su cinque situazioni che tornano sempre. Due masse legate da una fune. Una slitta su un pendio. Un'auto in curva. Una massa attaccata a una molla, e un pendolo.

Il metodo è sempre lo stesso. Si disegnano le forze su ogni corpo, si sceglie un asse e si scrive $F_{\text{tot}} = m \cdot a$. Spesso la massa si semplifica, e il risultato sorprende. Una slitta carica scende come una vuota. Un pendolo batte lo stesso tempo con una pallina di piombo o di sughero. In curva un camion e un'utilitaria con le stesse gomme slittano alla stessa velocità.

Servono i tre principi della dinamica, l'attrito statico e dinamico e il piano inclinato. Bisogna saper scomporre un vettore con seno e coseno. Per la curva e le oscillazioni servono l'accelerazione centripeta e il moto armonico.`,
  inBreve: [
    R`Una **fune ideale** tira con la stessa tensione ai due capi. Nella **macchina di Atwood** $a = g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}$: più le masse si somigliano, più il moto è lento.`,
    R`Sul **piano inclinato** senza attrito $a = g \cdot \sin\alpha$. Con l'attrito dinamico, in discesa, $a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)$. In tutti e due i casi la massa non conta.`,
    R`Per girare in tondo serve una **forza centripeta** $F_c = m \cdot \dfrac{v^2}{r}$, verso il centro. Non è una forza in più: è il compito di una forza vera, come una tensione, l'attrito o il peso.`,
    R`In una curva piana tiene l'auto l'attrito statico delle gomme: si può andare al massimo a $v_{max} = \sqrt{\mu_s \cdot g \cdot r}$, qualunque sia la massa.`,
    R`Massa sulla molla: $T = 2\pi \cdot \sqrt{\dfrac{m}{k}}$. Pendolo, per piccole oscillazioni: $T = 2\pi \cdot \sqrt{\dfrac{\ell}{g}}$. Nessuno dei due periodi dipende dall'ampiezza.`
  ],
  sezioni: [
    {
      id: 'funi',
      titolo: 'Funi e carrucole: corpi collegati',
      testo: R`Un rimorchio attaccato all'auto, un secchio tirato su con una corda, un carrello trainato da un peso che scende. Sono **corpi collegati**: si muovono insieme perché una fune li lega.

Una fune tesa tira i corpi a cui è attaccata, con una forza diretta lungo la fune: la **tensione** $T$. Nei problemi si usa la **fune ideale**, che non si allunga e non ha massa.

>* Una fune ideale tira con la **stessa tensione** $T$ ai due capi. I corpi che lega hanno, in modulo, la **stessa velocità** e la **stessa accelerazione**.

Una **carrucola ideale**, senza massa e senza attrito, cambia solo la direzione della fune. La tensione resta la stessa da una parte e dall'altra.

Esempio. Un carrello di 7 kg sta su un tavolo senza attrito. Una fune passa su una carrucola al bordo e regge una massa di 3 kg, che pende. Si scrive il secondo principio **per ogni corpo**, ciascuno con il suo verso positivo. Per il carrello è il verso della carrucola, per la massa appesa il basso.

~ T = M \cdot a :: carrello: l'unica forza orizzontale è la tensione
~ m \cdot g - T = m \cdot a :: massa appesa: il peso tira giù, la fune tira su
~ m \cdot g = (M + m) \cdot a :: sommo le due righe: la tensione si cancella
~ a = \dfrac{3 \cdot 9{,}8}{10}\,\text{m/s}^2 = \evidb{2{,}94\,\text{m/s}^2} :: il peso di 3 kg muove 10 kg in tutto
~ T = 7\,\text{kg} \cdot 2{,}94\,\text{m/s}^2 \approx \evidb{20{,}6\,\text{N}} :: dalla prima riga

Nel disegno la massa appesa cambia, il carrello resta di 7 kg. La tensione cresce, ma resta sempre sotto il peso della massa che pende.

[[grafico:tavolo]]

>! La tensione **non** è uguale al peso della massa appesa. Se fosse $T = m \cdot g$, sulla massa la risultante sarebbe zero, e non accelererebbe. Qui $T \approx 20{,}6\,\text{N}$, meno dei $29{,}4\,\text{N}$ del peso.

?? Due carrelli, di 4 kg e 1 kg, sono legati da una fune. Una mano tira il carrello da 4 kg con 10 N, e quello da 1 kg viene dietro. Niente attrito. Quanto tira la fune fra i due?
[ ] 10 N
[ ] 8 N
[x] 2 N
=> Insieme accelerano con $a = 10\,\text{N} / 5\,\text{kg} = 2\,\text{m/s}^2$. La fune deve accelerare solo il carrello da 1 kg: $T = 1\,\text{kg} \cdot 2\,\text{m/s}^2 = 2\,\text{N}$.`
    },
    {
      id: 'atwood',
      titolo: 'La macchina di Atwood',
      testo: R`Due masse diverse sono appese ai capi di una fune, che passa su una carrucola. La più pesante scende, l'altra sale. È la **macchina di Atwood**, costruita nel Settecento per studiare il moto accelerato.

[[video:dinamica-applicazioni/carrucola]]

Le masse sono $m_1$ e $m_2$, con $m_1 > m_2$. Su ciascuna agiscono il peso e la tensione della fune, uguale per tutte e due. Per ogni massa il verso positivo è quello del suo moto: in giù per $m_1$, in su per $m_2$.

~ m_1 \cdot g - T = m_1 \cdot a :: la massa che scende: il peso vince sulla tensione
~ T - m_2 \cdot g = m_2 \cdot a :: la massa che sale: la tensione vince sul peso
~ (m_1 - m_2) \cdot g = (m_1 + m_2) \cdot a :: sommo le due righe: la tensione si cancella
~ a = \evidb{g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}} :: la differenza dei pesi muove la somma delle masse

>* Nella **macchina di Atwood** l'accelerazione è $a = g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}$. La tensione è $T = \dfrac{2 \cdot m_1 \cdot m_2}{m_1 + m_2} \cdot g$, e sta fra i due pesi.

Con 3 kg e 2 kg, come nel video, $a = 9{,}8\,\text{m/s}^2 \cdot \frac{1}{5} = 1{,}96\,\text{m/s}^2$: un quinto di $g$. La tensione vale $23{,}52\,\text{N}$. È più del peso di 2 kg (19,6 N) e meno del peso di 3 kg (29,4 N).

[[grafico:atwood]]

Con masse quasi uguali l'accelerazione diventa piccolissima. Con 2,1 kg contro 2 kg è circa 41 volte più piccola di $g$. Un moto così lento si misura bene anche con un cronometro a mano. Atwood costruì la macchina per mostrare le leggi del moto accelerato. Oggi la si usa anche al contrario: dall'accelerazione misurata si ricava $g$.

[[grafico:atwood-a]]

>! Il peso di $m_1$ non accelera solo $m_1$: deve trascinare anche $m_2$. Per questo al denominatore c'è la **somma** delle masse.

?? Nella macchina di Atwood si aggiunge 1 kg a ciascuna delle due masse. Che cosa succede all'accelerazione?
[ ] resta uguale, perché la differenza è la stessa
[x] diminuisce
[ ] aumenta
=> La differenza $m_1 - m_2$ non cambia, ma la somma $m_1 + m_2$ cresce. La stessa forza deve muovere più massa, e l'accelerazione cala.`
    },
    {
      id: 'piano-inclinato',
      titolo: 'Il piano inclinato senza attrito',
      testo: R`Una slitta scende da una discesa ghiacciata e va sempre più veloce: accelera. Quanto accelera dipende solo dalla pendenza.

[[video:dinamica-applicazioni/piano-inclinato]]

Sulla slitta agiscono il peso e la forza normale del piano. Conviene un asse lungo il piano, verso il basso, e uno perpendicolare. Come nell'equilibrio, il peso si scompone in due parti. Lungo il piano c'è $P_\parallel = m \cdot g \cdot \sin\alpha$, contro il piano $P_\perp = m \cdot g \cdot \cos\alpha$. Qui $\alpha$ è l'angolo fra il piano e l'orizzontale, e $\sin\alpha = h/l$.

Perpendicolarmente al piano la slitta non si muove: la forza normale annulla $P_\perp$. Lungo il piano resta solo $P_\parallel$, ed è lei a dare l'accelerazione.

~ m \cdot a = m \cdot g \cdot \sin\alpha :: secondo principio lungo il piano
~ a = \evidb{g \cdot \sin\alpha} :: la massa si semplifica
~ a = 9{,}8\,\text{m/s}^2 \cdot \sin 30^\circ = 4{,}9\,\text{m/s}^2 :: la slitta del video, su una discesa di 30°

>* Sul piano inclinato senza attrito un corpo scende con accelerazione costante $a = g \cdot \sin\alpha$, qualunque sia la sua massa.

[[grafico:slitta]]

Con $\alpha = 90^\circ$ il seno vale 1 e torna la caduta libera, $a = g$. Con $\alpha = 0$ il piano è orizzontale e $a = 0$. Il piano inclinato «diluisce» la caduta: è il trucco di Galileo per rallentarla e misurarla.

Il moto è uniformemente accelerato, quindi valgono le formule della cinematica. La slitta del video parte da ferma e percorre 10 m:

~ t = \sqrt{\dfrac{2 \cdot \Delta s}{a}} = \sqrt{\dfrac{2 \cdot 10\,\text{m}}{4{,}9\,\text{m/s}^2}} \approx 2{,}02\,\text{s} :: da $\Delta s = \frac{1}{2} \cdot a \cdot t^2$
~ v = a \cdot t \approx \evidb{9{,}9\,\text{m/s}} :: la velocità in fondo, circa 36 km/h

>! $P_\parallel$ non è l'accelerazione. $P_\parallel$ è una forza e si misura in newton. L'accelerazione è $P_\parallel$ diviso la massa.

?? Una slitta vuota e una carica partono insieme dalla cima della stessa discesa ghiacciata. Quale arriva prima in fondo?
[ ] quella carica, che pesa di più
[ ] quella vuota, che è più leggera
[x] arrivano insieme
=> Senza attrito $a = g \cdot \sin\alpha$ per tutte e due: la massa si semplifica. Il peso più grande deve muovere una massa più grande.`
    },
    {
      id: 'piano-attrito',
      titolo: 'Il piano inclinato con attrito',
      testo: R`Sulla neve la slitta scende più piano che sul ghiaccio. C'è l'attrito dinamico, che lungo il piano punta in su, contro il moto.

L'attrito dinamico vale $F_d = \mu_d \cdot N$. Sul piano inclinato la forza normale non è il peso: è $N = m \cdot g \cdot \cos\alpha$.

~ m \cdot a = m \cdot g \cdot \sin\alpha - \mu_d \cdot m \cdot g \cdot \cos\alpha :: lungo il piano: il peso tira giù, l'attrito su
~ a = \evidb{g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)} :: la massa si semplifica ancora
~ a = 9{,}8 \cdot (0{,}5 - 0{,}2 \cdot 0{,}866)\,\text{m/s}^2 \approx 3{,}2\,\text{m/s}^2 :: il video sulla neve: $\alpha = 30^\circ$, $\mu_d = 0{,}2$

>* Su un piano inclinato con attrito, un corpo che **scende** ha accelerazione $a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)$, verso il basso lungo il piano.

Per la slitta del video, di 20 kg (peso 196 N), l'attrito vale $0{,}2 \cdot 196\,\text{N} \cdot \cos 30^\circ \approx 34\,\text{N}$. Gli stessi 10 m ora richiedono circa 2,5 s. In fondo la slitta va a 8 m/s invece di 9,9.

[[grafico:discesa]]

Quando comincia a scivolare un corpo fermo? Finché è fermo agisce l'attrito statico, che regge $P_\parallel$ fino al massimo $\mu_s \cdot N$. Il corpo parte quando $m \cdot g \cdot \sin\alpha$ supera $\mu_s \cdot m \cdot g \cdot \cos\alpha$. Dividendo per $m \cdot g \cdot \cos\alpha$:

$$\tan\alpha > \mu_s$$

> È un modo semplice di misurare $\mu_s$. Si alza il piano a poco a poco e si legge l'angolo a cui il corpo parte. Con $\mu_s = 0{,}5$, per esempio, si parte a circa 27°.

>! Se il corpo viene lanciato **in salita**, l'attrito punta in giù, come $P_\parallel$. Allora rallenta con $a = g \cdot (\sin\alpha + \mu_d \cdot \cos\alpha)$. L'attrito dinamico è sempre contro lo strisciamento, non sempre verso l'alto.

?? Un blocco è fermo su un piano inclinato con attrito. Quanto vale l'attrito statico su di lui?
[x] $m \cdot g \cdot \sin\alpha$, quanto basta per tenerlo fermo
[ ] $\mu_s \cdot m \cdot g \cdot \cos\alpha$
[ ] zero, perché il blocco è fermo
=> Il blocco è fermo: lungo il piano la risultante è zero. L'attrito statico vale quanto $P_\parallel$. Il valore $\mu_s \cdot N$ è solo il massimo che può raggiungere.`
    },
    {
      id: 'centripeta',
      titolo: 'La forza centripeta',
      testo: R`Fai girare un sasso legato a uno spago. Senti lo spago che tira la mano verso il sasso. Se lo lasci andare, il sasso parte dritto, lungo la tangente.

Un corpo in moto circolare uniforme ha l'accelerazione centripeta $a_c = \dfrac{v^2}{r}$, verso il centro. Per il secondo principio serve una forza risultante nella stessa direzione.

>* Un corpo che percorre una circonferenza di raggio $r$ con velocità $v$ ha bisogno di una risultante verso il centro. È la **forza centripeta**: $F_c = m \cdot \dfrac{v^2}{r}$.

La forza centripeta **non** è un tipo di forza in più. È il nome del compito che svolge una forza vera. Per il sasso è la tensione dello spago. Per la Luna è l'attrazione della Terra. Per un'auto in curva è l'attrito dell'asfalto sulle gomme.

Esempio. Un dischetto di 0,2 kg scivola su un tavolo senza attrito. È legato a un chiodo con un filo di 0,8 m, e gira a 4 m/s.

~ F_c = m \cdot \dfrac{v^2}{r} :: la forza che serve per girare in tondo
~ T = 0{,}2\,\text{kg} \cdot \dfrac{(4\,\text{m/s})^2}{0{,}8\,\text{m}} :: qui la fa la tensione del filo
~ T = \evidb{4\,\text{N}} :: a velocità doppia servirebbe il quadruplo, 16 N

[[grafico:giro]]

>! Nel diagramma di corpo libero la forza centripeta non si aggiunge come una forza in più. Si disegnano le forze vere: la loro risultante **è** la forza centripeta.

>! Se il filo si rompe, il dischetto non vola via verso l'esterno. Va dritto lungo la tangente, per il primo principio.

?? Un dischetto gira su un tavolo liscio, legato a un chiodo. Il filo si spezza. Che strada prende il dischetto?
[ ] si allontana lungo il raggio, verso l'esterno
[x] va dritto, lungo la tangente al cerchio
[ ] continua a girare, allargando piano piano il cerchio
=> Senza filo la risultante è zero. Per il primo principio il dischetto prosegue dritto, con la velocità che aveva: tangente al cerchio. Nessuna forza lo spinge verso l'esterno.`
    },
    {
      id: 'curva',
      titolo: 'L\'auto in curva',
      testo: R`In curva un'auto non ha né spaghi né binari. Chi la spinge verso il centro?

[[video:dinamica-applicazioni/curva]]

È l'asfalto, con l'**attrito** sulle gomme. La gomma non slitta di lato: è attrito **statico**. Può crescere fino a $\mu_s \cdot N$, e su una strada piana $N = m \cdot g$.

~ m \cdot \dfrac{v^2}{r} \le \mu_s \cdot m \cdot g :: la forza che serve non può superare l'attrito massimo
~ v^2 \le \mu_s \cdot g \cdot r :: la massa si semplifica
~ v_{max} = \evidb{\sqrt{\mu_s \cdot g \cdot r}} :: la velocità più alta per fare la curva

>* Su una curva piana di raggio $r$ un veicolo non slitta se $v \le \sqrt{\mu_s \cdot g \cdot r}$. La velocità massima non dipende dalla massa.

Nel video la curva ha raggio 50 m. Sull'asciutto, con $\mu_s \approx 0{,}8$, si arriva a circa 19,8 m/s, cioè 71 km/h. Sul bagnato $\mu_s$ scende a circa 0,4, e il limite a 14 m/s, circa 50 km/h.

[[grafico:limite]]

>! Oltre il limite nessuna forza «spara fuori» l'auto. L'attrito non basta più a farla curvare abbastanza: la curva si allarga e l'auto esce di strada.

Nelle autostrade e nelle piste le curve sono **sopraelevate**: la strada si inclina verso il centro, di un angolo $\theta$. La forza normale allora è inclinata, e una sua parte punta verso il centro. Senza contare l'attrito:

~ N \cdot \cos\theta = m \cdot g :: in verticale l'auto non si muove
~ N \cdot \sin\theta = m \cdot \dfrac{v^2}{r} :: in orizzontale, la parte di N fa da forza centripeta
~ \tan\theta = \evidb{\dfrac{v^2}{g \cdot r}} :: divido la seconda riga per la prima

Una curva di raggio 120 m inclinata di 15° si fa senza attrito a $v = \sqrt{g \cdot r \cdot \tan\theta} \approx 17{,}8\,\text{m/s}$, circa 64 km/h. Con l'attrito si può andare un po' più forte.

[[grafico:sopraelevata]]

?? Un camion e un'auto fanno la stessa curva piana, con le stesse gomme. Quale può andare più forte senza slittare?
[ ] l'auto, che è più leggera
[ ] il camion, che preme di più sull'asfalto
[x] vanno uguali
=> $v_{max} = \sqrt{\mu_s \cdot g \cdot r}$: la massa si semplifica. Il camion preme di più, ma gli serve anche più forza per curvare. In pratica i camion vanno più piano per un altro motivo: rischiano di ribaltarsi.`
    },
    {
      id: 'molla',
      titolo: 'La massa sulla molla: l\'oscillatore armonico',
      testo: R`Un carrello è attaccato a una molla, su un piano senza attrito. Lo sposti e lo lasci: va avanti e indietro, sempre con lo stesso ritmo.

[[video:dinamica-applicazioni/molla]]

La molla tira sempre verso la posizione di riposo, con la forza elastica $F = -k \cdot x$. Qui $x$ è lo spostamento dalla posizione di riposo, con il segno. È una **forza di richiamo**: più il carrello si allontana, più la molla lo tira indietro.

~ m \cdot a = -k \cdot x :: secondo principio: la forza elastica è l'unica orizzontale
~ a = -\dfrac{k}{m} \cdot x :: accelerazione proporzionale allo spostamento, e opposta
~ \omega^2 = \dfrac{k}{m} :: è la legge del moto armonico, $a = -\omega^2 \cdot x$
~ T = \dfrac{2\pi}{\omega} = \evidb{2\pi \cdot \sqrt{\dfrac{m}{k}}} :: il periodo, dalla pulsazione

>* Una massa $m$ attaccata a una molla di costante $k$ è un **oscillatore armonico**. Oscilla di moto armonico con periodo $T = 2\pi \cdot \sqrt{\dfrac{m}{k}}$, che non dipende dall'ampiezza.

Con il carrello di 1 kg e la molla da 10 N/m del video:

$$T = 2\pi \cdot \sqrt{\dfrac{1\,\text{kg}}{10\,\text{N/m}}} \approx 1{,}99\,\text{s}$$

Con 4 kg il periodo raddoppia, perché la massa sta sotto radice. Con una molla quattro volte più rigida si dimezza.

[[grafico:molla]]

Perché l'ampiezza non conta? Se sposti il carrello il doppio, la molla tira il doppio. Il carrello fa il doppio della strada, ma con velocità doppia: ci mette lo stesso tempo.

> La formula vale anche per una molla appesa in verticale. Il peso sposta più in basso la posizione di riposo. Intorno a quella la massa oscilla con lo stesso periodo.

>! Nella formula la massa sta **sopra**, la costante **sotto**. Più massa vuol dire più inerzia: oscillazioni più lente. Una molla più rigida richiama più forte: oscillazioni più veloci.

?? Una massa oscilla su una molla con periodo 0,8 s. Si raddoppia l'ampiezza. Quanto diventa il periodo?
[ ] 1,6 s
[x] 0,8 s
[ ] 1,13 s
=> Il periodo $T = 2\pi \cdot \sqrt{m/k}$ non contiene l'ampiezza: resta 0,8 s. Con l'ampiezza doppia anche la velocità è doppia.`
    },
    {
      id: 'pendolo',
      titolo: 'Il pendolo semplice',
      testo: R`Un'altalena, un lampadario, il pendolo di un orologio a muro. Oscillano avanti e indietro con un ritmo regolare.

[[video:dinamica-applicazioni/pendolo]]

Il **pendolo semplice** è un modello: un filo senza massa che non si allunga, lungo $\ell$, con una pallina piccola in fondo. Il **periodo** $T$ è il tempo di un'oscillazione completa, andata e ritorno.

Sulla pallina agiscono il peso e la tensione del filo. Il peso si scompone, come sul piano inclinato. La parte lungo il filo è equilibrata dalla tensione, quando la pallina è ferma all'estremo. La parte lungo l'arco, $m \cdot g \cdot \sin\theta$, la riporta verso il basso.

[[grafico:pendolo]]

Per angoli piccoli il seno è quasi uguale all'angolo in radianti. L'angolo in radianti è l'arco $x$ diviso il raggio $\ell$: quindi $\sin\theta \approx x / \ell$.

~ m \cdot a = -m \cdot g \cdot \sin\theta :: lungo l'arco: una forza di richiamo, opposta allo spostamento
~ a \approx -\dfrac{g}{\ell} \cdot x :: angoli piccoli: $\sin\theta \approx x / \ell$, e la massa si semplifica
~ \omega^2 = \dfrac{g}{\ell} :: di nuovo $a = -\omega^2 \cdot x$: è un moto armonico
~ T = \evidb{2\pi \cdot \sqrt{\dfrac{\ell}{g}}} :: come per la molla, con $\ell/g$ al posto di $m/k$

>* Per piccole oscillazioni il periodo del pendolo semplice è $T = 2\pi \cdot \sqrt{\dfrac{\ell}{g}}$. Non dipende né dalla massa né dall'ampiezza: è l'**isocronismo**.

«Piccole» vuol dire fino a circa 10–15°. A 60° il periodo è già più lungo di circa il 7%.

Un pendolo di 1 m ha $T = 2\pi \cdot \sqrt{1\,\text{m} / 9{,}8\,\text{m/s}^2} \approx 2{,}0\,\text{s}$. Uno di 25 cm, un quarto della lunghezza, ha metà del periodo: circa 1 s. Il lampadario del video, con 3,48 s, è lungo circa 3 m.

[[grafico:periodo]]

> Dalla formula si ricava $g = \dfrac{4\pi^2 \cdot \ell}{T^2}$. Bastano un filo, un peso e un cronometro per misurare l'accelerazione di gravità.

>! La lunghezza $\ell$ va misurata fino al **centro** della pallina, non fino al suo bordo. In un pendolo corto l'errore si sente.

?? Un pendolo oscilla con periodo 2 s. Che cosa bisogna fare per portarlo a 4 s?
[ ] raddoppiare la lunghezza del filo
[x] quadruplicare la lunghezza del filo
[ ] raddoppiare la massa della pallina
=> La lunghezza sta sotto radice: per un periodo doppio serve una lunghezza quattro volte più grande. La massa non conta.`
    }
  ],
  grafici: {
    /* il carrello sul tavolo tirato dalla massa appesa: tensione uguale ai due capi, minore del peso che pende */
    tavolo: {
      tipo: 'piano', x: [-6.5, 6.5], y: [-10, 3.4], altezza: 606, assi: false, passo: [1, 1],
      parametri: [{ nome: 'm', min: 0.5, max: 5, passo: 0.5, valore: 3, etichetta: 'massa appesa m (kg)' }],
      elementi: [
        { tipo: 'segmento', da: [-6.5, 0], a: [2, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [2, 0], a: [2.6, 0.1], colore: 'grigio' },
        { tipo: 'cerchio', centro: [2.6, 0.1], raggio: 0.5, colore: 'grigio' },
        { tipo: 'poligono', punti: [[-3.5, 0], [-1, 0], [-1, 1.2], [-3.5, 1.2]], colore: 'grigio' },
        { tipo: 'testo', p: [-2.25, 0.45], testo: '7 kg' },
        { tipo: 'segmento', da: [-1, 0.6], a: [2.6, 0.6], colore: 'grigio' },
        { tipo: 'segmento', da: [3.1, 0.1], a: [3.1, -3.4], colore: 'grigio' },
        { tipo: 'poligono', punti: [[2.5, -3.4], [3.7, -3.4], [3.7, -4.6], [2.5, -4.6]], colore: 'grigio' },
        { tipo: 'testo', p: [3.1, -4.15], testo: 'm' },
        { tipo: 'vettore', da: [-1, 0.6], a: ['-1 + 6.86*m/(7 + m)', 0.6], etichetta: 'T', colore: 2 },
        { tipo: 'vettore', da: [3.1, -3.4], a: [3.1, '-3.4 + 6.86*m/(7 + m)'], etichetta: 'T', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [3.1, -4.6], a: [3.1, '-4.6 - 0.98*m'], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: [-3.5, 2.4], a: ['-3.5 + 5.88*m/(7 + m)', 2.4], etichetta: 'a', colore: 4 },
        { tipo: 'vettore', da: [4.5, -3.6], a: [4.5, '-3.6 - 5.88*m/(7 + m)'], etichetta: 'a', colore: 4 },
        { tipo: 'testo', p: [-6.3, -6.6], testo: 'a = {{9.8*m/(7 + m)}} m/s²', ancora: 'start', colore: 4 },
        { tipo: 'testo', p: [-6.3, -7.7], testo: 'T = {{68.6*m/(7 + m)}} N', ancora: 'start', colore: 2 },
        { tipo: 'testo', p: [-6.3, -8.8], testo: 'peso di m = {{9.8*m}} N', ancora: 'start', colore: 2 }
      ],
      didascalia: 'Un carrello di 7 kg su un tavolo senza attrito, tirato da una massa m che pende (un quadretto = 10 N per le forze). Peso e forza normale del carrello si annullano e non sono disegnati. La tensione T è la stessa ai due capi della fune, ed è sempre minore del peso di m. Il cursore cambia la massa appesa.'
    },
    /* la macchina di Atwood: stessa tensione sulle due masse, accelerazioni uguali e opposte */
    atwood: {
      tipo: 'piano', x: [-4.5, 4.5], y: [-8.6, 2.8], altezza: 737, assi: false, passo: [1, 1],
      parametri: [
        { nome: 'm1', min: 1, max: 5, passo: 0.5, valore: 3, etichetta: 'm_1 (kg)' },
        { nome: 'm2', min: 1, max: 5, passo: 0.5, valore: 2, etichetta: 'm_2 (kg)' }
      ],
      elementi: [
        { tipo: 'segmento', da: [-2, 2.6], a: [2, 2.6], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 2.6], a: [0, 1.5], colore: 'grigio' },
        { tipo: 'cerchio', centro: [0, 1.5], raggio: 1, colore: 'grigio' },
        { tipo: 'segmento', da: [-1, 1.5], a: [-1, -2], colore: 'grigio' },
        { tipo: 'segmento', da: [1, 1.5], a: [1, -2], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-1.6, -2], [-0.4, -2], [-0.4, -3.4], [-1.6, -3.4]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0.4, -2], [1.6, -2], [1.6, -3.2], [0.4, -3.2]], colore: 'grigio' },
        { tipo: 'testo', p: [-1, -2.85], testo: 'm_1' },
        { tipo: 'testo', p: [1, -2.75], testo: 'm_2' },
        { tipo: 'vettore', da: [-1, -2], a: [-1, '-2 + 1.96*m1*m2/(m1 + m2)'], etichetta: 'T', colore: 2 },
        { tipo: 'vettore', da: [1, -2], a: [1, '-2 + 1.96*m1*m2/(m1 + m2)'], etichetta: 'T', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [-1, -3.4], a: [-1, '-3.4 - 0.98*m1'], etichetta: 'P_1', colore: 2, posizione: 'destra' },
        { tipo: 'vettore', da: [1, -3.2], a: [1, '-3.2 - 0.98*m2'], etichetta: 'P_2', colore: 2 },
        { tipo: 'vettore', da: [-2.6, -2.7], a: [-2.6, '-2.7 - 4.9*(m1 - m2)/(m1 + m2)'], etichetta: 'a', colore: 4, posizione: 'destra' },
        { tipo: 'vettore', da: [2.6, -2.7], a: [2.6, '-2.7 + 4.9*(m1 - m2)/(m1 + m2)'], etichetta: 'a', colore: 4, posizione: 'destra' },
        { tipo: 'testo', p: [4.4, -6.6], testo: 'a = {{abs(9.8*(m1 - m2)/(m1 + m2))}} m/s²', ancora: 'end', colore: 4 },
        { tipo: 'testo', p: [4.4, -7.5], testo: 'T = {{19.6*m1*m2/(m1 + m2)}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'La macchina di Atwood con fune e carrucola ideali (un quadretto = 10 N per le forze). La tensione T è la stessa sulle due masse e sta sempre fra i due pesi. Le accelerazioni, in viola, hanno lo stesso modulo e versi opposti. Con masse uguali tutto resta fermo. I cursori cambiano le due masse.'
    },
    /* a in funzione di m1, con m2 fissata: zero con masse uguali, verso g con m1 molto grande */
    'atwood-a': {
      tipo: 'piano', x: [0, 10], y: [0, 10.5], altezza: 400, etichette: { x: 'm₁ (kg)', y: 'a (m/s²)' },
      parametri: [{ nome: 'm2', min: 1, max: 5, passo: 0.5, valore: 2, etichetta: 'm_2 (kg)' }],
      funzioni: [{ f: '9.8*(x - m2)/(x + m2)', dominio: ['m2', 10], colore: 4 }],
      elementi: [
        { tipo: 'orizzontale', y: 9.8, colore: 4, tratteggio: true },
        { tipo: 'testo', p: [9.9, 9.1], testo: 'g = 9,8 m/s²', ancora: 'end', colore: 4 },
        { tipo: 'punto', p: ['m2 + 1', '9.8/(2*m2 + 1)'], etichetta: '{{9.8/(2*m2 + 1)}} m/s²', posizione: 'basso-destra', colore: 4 }
      ],
      didascalia: 'L\'accelerazione della macchina di Atwood al crescere di m₁, con m₂ fissata dal cursore. Con masse uguali è zero; con m₁ molto più grande di m₂ si avvicina a g (tratteggio), senza mai raggiungerlo. Il punto segna m₁ = m₂ + 1 kg. Passa il dito sul grafico per leggere i valori.'
    },
    /* la slitta sul ghiaccio: il peso si scompone, la normale annulla P_⊥, resta P_∥ che dà a = g·sin α */
    slitta: {
      tipo: 'piano', x: [-3, 11], y: [-3.6, 9.6], altezza: 560, assi: false, passo: [1, 1],
      parametri: [{ nome: 'al', min: 20, max: 60, passo: 5, valore: 30, etichetta: 'angolo del piano α (°)' }],
      elementi: [
        { tipo: 'poligono', punti: [[0, 0], ['10*' + CA, 0], ['10*' + CA, '10*' + SA]], colore: 'grigio' },
        { tipo: 'poligono', punti: [sl(-0.8, 0), sl(0.8, 0), sl(0.8, 1.6), sl(-0.8, 1.6)], colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: [CA, SA], raggio: 1.6, colore: 'grigio' },
        { tipo: 'testo', p: ['(4.1 - 0.05*al)*cos(al*pi/360)', '(4.1 - 0.05*al)*sin(al*pi/360) - 0.15'], testo: 'α' },
        { tipo: 'vettore', da: sl(0, 0.8), a: [sl(0, 0.8)[0], sl(0, 0.8)[1] + ' - 4.9'], etichetta: 'P', colore: 2, posizione: 'destra', componenti: { lungo: 'al' } },
        { tipo: 'vettore', da: sl(0, 0.8), a: sl(0, '0.8 + 4.9*' + CA), etichetta: 'N', colore: 2 },
        { tipo: 'vettore', da: sl(-1, 2.2), a: sl('-1 - 3.92*' + SA, 2.2), etichetta: 'a', colore: 4, posizione: 'destra' },
        { tipo: 'testo', p: [10.8, -2.4], testo: 'P_∥ = {{196*' + SA + '|0}} N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [10.8, -3.2], testo: 'a = {{9.8*' + SA + '|1}} m/s²', ancora: 'end', colore: 4 }
      ],
      didascalia: 'La slitta di 20 kg del video su una discesa ghiacciata, senza attrito (un quadretto = 40 N per le forze; il peso vale 196 N). Il peso si scompone in due parti, tratteggiate. La forza normale N annulla quella contro il piano; resta P∥, che dà l\'accelerazione a, in viola. Il cursore rende il piano più o meno ripido.'
    },
    /* a(α) sul piano inclinato: senza attrito (tratteggio) e con l'attrito dinamico del cursore */
    discesa: {
      tipo: 'piano', x: [0, 90], y: [0, 10.5], altezza: 400, passo: [15, 2], etichette: { x: 'α (°)', y: 'a (m/s²)' },
      parametri: [{ nome: 'mu', min: 0, max: 0.55, passo: 0.05, valore: 0.2, etichetta: 'attrito dinamico μ_d' }],
      funzioni: [
        { f: '9.8*sin(x*pi/180)', dominio: [0, 90], colore: 4, tratteggio: true },
        { f: '9.8*(sin(x*pi/180) - mu*cos(x*pi/180))', dominio: ['atan(mu)*180/pi', 90], colore: 4 }
      ],
      elementi: [
        { tipo: 'testo', p: [58, 9.6], testo: 'senza attrito', ancora: 'end', colore: 4 },
        { tipo: 'punto', p: [30, '9.8*(0.5 - mu*0.866)'], etichetta: '{{9.8*(0.5 - mu*0.866)}} m/s²', posizione: 'alto-sinistra', colore: 4 }
      ],
      didascalia: 'L\'accelerazione in discesa al variare dell\'angolo. Il tratteggio è il piano senza attrito, a = g·sin α; la curva piena ha l\'attrito dinamico del cursore. La curva piena comincia dove l\'attrito pareggia la parte del peso lungo il piano. Un corpo fermo, in realtà, parte solo quando tan α supera il coefficiente statico μ_s. Il punto è a 30°.'
    },
    /* il dischetto legato al chiodo: velocità tangente, tensione verso il centro; il tratteggio è la tangente */
    giro: {
      tipo: 'piano', x: [-3.5, 3.5], y: [-2.9, 2.9], altezza: 497, assi: false, griglia: false,
      parametri: [
        { nome: 'v', min: 1, max: 6, passo: 0.5, valore: 4, etichetta: 'v (m/s)' },
        { nome: 'th', min: 0, max: 360, passo: 1, valore: 50, etichetta: 'posizione sul cerchio (°)' }
      ],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 2.4, colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['2.4*cos(th*pi/180)', '2.4*sin(th*pi/180)'], colore: 'grigio' },
        { tipo: 'segmento', da: ['2.4*cos(th*pi/180)', '2.4*sin(th*pi/180)'], a: ['2.4*cos(th*pi/180) - 4*sin(th*pi/180)', '2.4*sin(th*pi/180) + 4*cos(th*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'vettore', da: ['2.4*cos(th*pi/180)', '2.4*sin(th*pi/180)'], a: ['2.4*cos(th*pi/180) - 0.4*v*sin(th*pi/180)', '2.4*sin(th*pi/180) + 0.4*v*cos(th*pi/180)'], etichetta: 'v', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: ['2.4*cos(th*pi/180)', '2.4*sin(th*pi/180)'], a: ['(2.4 - 0.06*v^2)*cos(th*pi/180)', '(2.4 - 0.06*v^2)*sin(th*pi/180)'], etichetta: 'T', colore: 2 },
        { tipo: 'punto', p: ['2.4*cos(th*pi/180)', '2.4*sin(th*pi/180)'], trascina: true, giro: { centro: [0, 0], parametro: 'th', gradi: true }, colore: 'grigio' },
        { tipo: 'testo', p: [3.4, -2.65], testo: 'T = {{0.25*v^2}} N', ancora: 'end', colore: 2 }
      ],
      didascalia: 'Visto dall\'alto: un dischetto di 0,2 kg su un tavolo senza attrito, legato a un chiodo al centro con un filo di 0,8 m. La velocità v è tangente al cerchio, la tensione T punta verso il centro. Il tratteggio dritto è la strada che prenderebbe se il filo si rompesse. Il punto si trascina lungo il cerchio; il cursore cambia la velocità.'
    },
    /* la velocità massima in una curva piana al variare del raggio: asciutto (tratteggio) e μ_s del cursore */
    limite: {
      tipo: 'piano', x: [0, 200], y: [0, 45], altezza: 400, passo: [25, 5], etichette: { x: 'r (m)', y: 'v_max (m/s)' },
      parametri: [{ nome: 'mu', min: 0.1, max: 1, passo: 0.05, valore: 0.4, etichetta: 'attrito statico μ_s' }],
      funzioni: [
        { f: 'sqrt(0.8*9.8*x)', dominio: [0, 200], colore: 1, tratteggio: true },
        { f: 'sqrt(mu*9.8*x)', dominio: [0, 200], colore: 1 }
      ],
      elementi: [
        { tipo: 'testo', p: [196, 41.5], testo: 'asciutto, μ_s = 0,8', ancora: 'end', colore: 1 },
        { tipo: 'testo', p: [196, 7], testo: 'curva piena: μ_s = {{mu}}', ancora: 'end', colore: 1 },
        { tipo: 'punto', p: [50, 'sqrt(mu*9.8*50)'], etichetta: '{{sqrt(mu*9.8*50)}} m/s', posizione: 'basso-destra', colore: 1 }
      ],
      didascalia: 'La velocità più alta per fare una curva piana senza slittare, v = √(μ_s·g·r), al variare del raggio. Il tratteggio è l\'asfalto asciutto; la curva piena ha il coefficiente del cursore (0,4 è il bagnato). Il punto è la curva di 50 m del video. Passa il dito sul grafico per leggere i valori.'
    },
    /* la curva sopraelevata vista da dietro: N inclinata, N + P orizzontale verso il centro */
    sopraelevata: {
      tipo: 'piano', x: [-4.8, 4.8], y: [-3.9, 4.2], altezza: 504, assi: false, passo: [1, 1],
      parametri: [{ nome: 'th', min: 5, max: 35, passo: 1, valore: 25, etichetta: 'inclinazione θ (°)' }],
      elementi: [
        { tipo: 'segmento', da: sp(-3.6, 0), a: sp(3.6, 0), colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [4.6, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'poligono', punti: [sp(-1.1, 0), sp(1.1, 0), sp(1.1, 0.9), sp(-1.1, 0.9)], colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: [CT, ST], raggio: 1.5, colore: 'grigio' },
        { tipo: 'testo', p: ['2*cos(th*pi/360)', '2*sin(th*pi/360) - 0.12'], testo: 'θ' },
        { tipo: 'vettore', da: sp(0, 0), a: [sp(0, 0)[0], sp(0, 0)[1] + ' - 3'], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: sp(0, 0), a: sp(0, '3/' + CT), etichetta: 'N', colore: 2, posizione: 'destra' },
        { tipo: 'segmento', da: sp(0, '3/' + CT), a: [sp(0, '3/' + CT)[0], sp(0, '3/' + CT)[1] + ' - 3'], colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: sp(0, 0), a: [sp(0, 0)[0] + ' - 3*tan(th*pi/180)', sp(0, 0)[1]], etichetta: 'F_{tot}', colore: 3 },
        { tipo: 'testo', p: [-4.6, -3.6], testo: '← centro della curva', ancora: 'start' },
        { tipo: 'testo', p: [4.7, -3.6], testo: 'v = {{3.6*sqrt(9.8*120*tan(th*pi/180))}} km/h', ancora: 'end', colore: 1 }
      ],
      didascalia: 'Un\'auto in una curva sopraelevata, vista da dietro; il centro della curva è a sinistra. Senza attrito agiscono solo il peso P e la forza normale N, perpendicolare alla strada. La loro somma F_{tot} è orizzontale e punta verso il centro: è la forza centripeta. La scritta dà la velocità giusta per una curva di raggio 120 m. Il cursore cambia l\'inclinazione.'
    },
    /* la legge oraria della massa sulla molla: il periodo dipende da m e k, non dall'ampiezza */
    molla: {
      tipo: 'orario', grandezza: 'x', unita: 'cm', t: [0, 8], y: [-25, 30],
      parametri: [
        { nome: 'm', min: 0.5, max: 4, passo: 0.5, valore: 1, etichetta: 'massa m (kg)' },
        { nome: 'k', min: 5, max: 40, passo: 5, valore: 10, etichetta: 'costante k (N/m)' },
        { nome: 'A', min: 5, max: 20, passo: 5, valore: 10, etichetta: 'ampiezza A (cm)' }
      ],
      funzioni: [{ f: 'A*cos(t*sqrt(k/m))', colore: 1 }],
      elementi: [
        { tipo: 'testo', p: [7.9, 25.5], testo: 'T = {{2*pi*sqrt(m/k)}} s', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La posizione del carrello sulla molla, lasciato andare dallo spostamento A. Più massa: oscillazioni più lente. Molla più rigida: più veloci. L\'ampiezza cambia l\'altezza dei picchi, ma non la loro distanza, che è il periodo. Passa il dito sul grafico per leggere i valori.'
    },
    /* il pendolo fermo all'estremo: il peso si scompone lungo il filo e lungo l'arco */
    pendolo: {
      tipo: 'piano', x: [-3, 7.5], y: [-10.5, 0.6], altezza: 621, assi: false, passo: [1, 1],
      parametri: [{ nome: 'th', min: 5, max: 40, passo: 1, valore: 20, etichetta: 'angolo θ (°)' }],
      elementi: [
        { tipo: 'segmento', da: [-2.5, 0], a: [2.5, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [0, 0], a: [0, -5.6], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 0], a: ['5*' + ST, '-5*' + CT], colore: 'grigio' },
        { tipo: 'cerchio', centro: ['5*' + ST, '-5*' + CT], raggio: 0.3, colore: 'grigio' },
        { tipo: 'angolo', vertice: [0, 0], da: [0, -1], a: [ST, '-' + CT], raggio: 1.3, colore: 'grigio' },
        { tipo: 'testo', p: ['1.9*sin(th*pi/360)', '-1.9*cos(th*pi/360) - 0.1'], testo: 'θ' },
        { tipo: 'vettore', da: ['5*' + ST, '-5*' + CT], a: ['5*' + ST, '-5*' + CT + ' - 4.5'], etichetta: 'P', colore: 2 },
        { tipo: 'vettore', da: ['5*' + ST, '-5*' + CT], a: ['5*' + ST + ' - 4.5*' + ST + '*' + CT, '-5*' + CT + ' - 4.5*' + ST + '*' + ST], colore: 2, tratteggio: true },
        { tipo: 'testo', p: ['5*' + ST + ' - (4.5*' + ST + ' + 0.5)*' + CT, '-5*' + CT + ' - (4.5*' + ST + ' + 0.5)*' + ST + ' - 0.15'], testo: 'm·g·sin θ', ancora: 'end', colore: 2 },
        { tipo: 'vettore', da: ['5*' + ST, '-5*' + CT], a: ['5*' + ST + ' + 4.5*' + CT + '*' + ST, '-5*' + CT + ' - 4.5*' + CT + '*' + CT], etichetta: 'm·g·cos θ', colore: 2, tratteggio: true },
        { tipo: 'vettore', da: ['5*' + ST, '-5*' + CT], a: ['5*' + ST + ' - 4.5*' + CT + '*' + ST, '-5*' + CT + ' + 4.5*' + CT + '*' + CT], etichetta: 'T', colore: 2 },
        { tipo: 'testo', p: [7.3, -0.7], testo: 'richiamo = {{4.9*' + ST + '}} N', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [7.3, -1.5], testo: 'sin θ = {{' + ST + '}}, θ = {{th*pi/180}} rad', ancora: 'end' }
      ],
      didascalia: 'Un pendolo con una pallina di 0,5 kg, fermo all\'estremo prima di partire (un quadretto ≈ 1,1 N per le forze). Il peso si scompone in due parti, tratteggiate. Lungo il filo la tensione T pareggia m·g·cos θ; lungo l\'arco m·g·sin θ riporta la pallina in basso. Per angoli piccoli sin θ e θ in radianti quasi coincidono. Il cursore cambia l\'angolo.'
    },
    /* il periodo al variare della lunghezza: sulla Terra (tratteggio) e con la g del cursore */
    periodo: {
      tipo: 'piano', x: [0, 4], y: [0, 10.5], altezza: 400, passo: [0.5, 2], etichette: { x: 'ℓ (m)', y: 'T (s)' },
      parametri: [{ nome: 'g', min: 1.6, max: 9.8, passo: 0.1, valore: 3.7, etichetta: 'g (m/s²)' }],
      funzioni: [
        { f: '2*pi*sqrt(x/9.8)', dominio: [0, 4], colore: 3, tratteggio: true },
        { f: '2*pi*sqrt(x/g)', dominio: [0, 4], colore: 3 }
      ],
      elementi: [
        { tipo: 'punto', p: [0.25, 1.0035], etichetta: '≈ 1 s', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'punto', p: [1, 2.0071], etichetta: '≈ 2 s', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'testo', p: [3.95, 2.1], testo: 'Terra (tratteggio)', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Il periodo di un pendolo semplice al variare della lunghezza del filo. Il tratteggio è sulla Terra: un quarto della lunghezza, metà del periodo. La curva piena usa la g del cursore: 3,7 m/s² è Marte, 1,6 m/s² la Luna. Con meno gravità il pendolo è più lento. Passa il dito sul grafico per leggere i valori.'
    }
  },
  esempi: [
    {
      titolo: 'Il blocco sul tavolo, con l\'attrito',
      problema: R`Un blocco di 5 kg sta su un tavolo orizzontale, con coefficiente di attrito dinamico $\mu_d = 0{,}2$. Una fune ideale passa su una carrucola al bordo e regge una massa di 3 kg, che pende. Il sistema è già in moto. Quanto valgono l'accelerazione e la tensione della fune?`,
      passi: [
        R`Dati: $M = 5\,\text{kg}$, $m = 3\,\text{kg}$, $\mu_d = 0{,}2$, $g = 9{,}8\,\text{m/s}^2$. Cerco l'accelerazione $a$ e la tensione $T$.`,
        R`Blocco sul tavolo, verso positivo verso la carrucola. In verticale $N = M \cdot g = 49\,\text{N}$, quindi l'attrito vale $F_d = 0{,}2 \cdot 49\,\text{N} = 9{,}8\,\text{N}$. In orizzontale: $T - F_d = M \cdot a$.`,
        R`Massa appesa, verso positivo in basso: $m \cdot g - T = m \cdot a$, con $m \cdot g = 29{,}4\,\text{N}$.`,
        R`Sommo le due equazioni e la tensione si cancella: $29{,}4\,\text{N} - 9{,}8\,\text{N} = 8\,\text{kg} \cdot a$, quindi $a = \dfrac{19{,}6\,\text{N}}{8\,\text{kg}} = 2{,}45\,\text{m/s}^2$.`,
        R`Dalla massa appesa: $T = m \cdot (g - a) = 3\,\text{kg} \cdot 7{,}35\,\text{m/s}^2 = 22{,}05\,\text{N}$.`,
        R`Controllo sul blocco: $T - F_d = 22{,}05 - 9{,}8 = 12{,}25\,\text{N}$, e $M \cdot a = 5 \cdot 2{,}45 = 12{,}25\,\text{N}$. Torna.`
      ],
      risultato: R`$a = 2{,}45\,\text{m/s}^2$, $T \approx 22\,\text{N}$`
    },
    {
      titolo: 'Misurare g con la macchina di Atwood',
      problema: R`In laboratorio una macchina di Atwood porta due masse da 0,52 kg e 0,48 kg. Partendo da ferma, la massa più pesante scende di 1,00 m in 2,26 s. Quanto vale l'accelerazione? Che valore di $g$ se ne ricava?`,
      passi: [
        R`Dati: $m_1 = 0{,}52\,\text{kg}$, $m_2 = 0{,}48\,\text{kg}$, $\Delta s = 1{,}00\,\text{m}$, $t = 2{,}26\,\text{s}$, $v_0 = 0$. Cerco $a$ e poi $g$.`,
        R`L'accelerazione è costante e si parte da fermi: $\Delta s = \frac{1}{2} \cdot a \cdot t^2$, quindi $a = \dfrac{2 \cdot \Delta s}{t^2} = \dfrac{2 \cdot 1{,}00\,\text{m}}{(2{,}26\,\text{s})^2} \approx 0{,}392\,\text{m/s}^2$.`,
        R`Dalla formula di Atwood ricavo $g$: $g = a \cdot \dfrac{m_1 + m_2}{m_1 - m_2} = 0{,}392\,\text{m/s}^2 \cdot \dfrac{1{,}00}{0{,}04}$.`,
        R`$g \approx 0{,}392 \cdot 25\,\text{m/s}^2 \approx 9{,}79\,\text{m/s}^2$, molto vicino al valore vero.`,
        R`Perché funziona: l'accelerazione è 25 volte più piccola di $g$. In caduta libera lo stesso metro dura meno di mezzo secondo. Qui dura 2,26 s, cinque volte di più, e un cronometro lo misura bene.`
      ],
      risultato: R`$a \approx 0{,}392\,\text{m/s}^2$, $g \approx 9{,}79\,\text{m/s}^2$`
    },
    {
      titolo: 'Il disco lanciato in salita',
      problema: R`Un disco viene lanciato su per un piano inclinato di 20°, a 6 m/s. I coefficienti di attrito sono $\mu_d = 0{,}1$ e $\mu_s = 0{,}15$. Quanta strada fa salendo? Si ferma lassù o torna indietro?`,
      passi: [
        R`Dati: $\alpha = 20^\circ$, $v_0 = 6\,\text{m/s}$, $\mu_d = 0{,}1$, $\mu_s = 0{,}15$. Cerco lo spazio $\Delta s$ in salita, e se il disco riparte.`,
        R`In salita l'attrito punta in giù, come $P_\parallel$. Il disco rallenta con $a = g \cdot (\sin\alpha + \mu_d \cdot \cos\alpha) = 9{,}8 \cdot (0{,}342 + 0{,}094)\,\text{m/s}^2 \approx 4{,}27\,\text{m/s}^2$.`,
        R`Fino a fermarsi, senza conoscere il tempo: $\Delta s = \dfrac{v_0^2}{2 \cdot a} = \dfrac{36}{2 \cdot 4{,}27}\,\text{m} \approx 4{,}21\,\text{m}$.`,
        R`Lassù è fermo. Riparte se $\tan\alpha > \mu_s$: $\tan 20^\circ \approx 0{,}36$, più di 0,15. Quindi scivola indietro.`,
        R`In discesa l'attrito punta in su: $a = 9{,}8 \cdot (0{,}342 - 0{,}094)\,\text{m/s}^2 \approx 2{,}43\,\text{m/s}^2$. Torna in fondo a $v = \sqrt{2 \cdot 2{,}43 \cdot 4{,}21}\,\text{m/s} \approx 4{,}5\,\text{m/s}$.`,
        R`Controllo: torna più lento di come era partito. È giusto, perché l'attrito ha frenato sia in salita sia in discesa.`
      ],
      risultato: R`Sale di circa $4{,}2\,\text{m}$, poi torna indietro e arriva in fondo a circa $4{,}5\,\text{m/s}$.`
    },
    {
      titolo: 'L\'auto sul dosso',
      problema: R`Un'auto di 900 kg passa sulla cima di un dosso, che in quel punto è un arco di circonferenza di raggio 36 m. Va a 12 m/s. Quanto vale la forza normale della strada? A che velocità le ruote si staccherebbero dall'asfalto?`,
      passi: [
        R`Dati: $m = 900\,\text{kg}$, $r = 36\,\text{m}$, $v = 12\,\text{m/s}$. Cerco la forza normale $N$ e la velocità a cui $N = 0$.`,
        R`In cima l'auto sta percorrendo un arco di cerchio: la risultante deve puntare verso il centro, cioè in basso. Agiscono il peso, in giù, e la normale, in su.`,
        R`Secondo principio, verso positivo in basso: $m \cdot g - N = m \cdot \dfrac{v^2}{r}$, quindi $N = m \cdot \left(g - \dfrac{v^2}{r}\right)$.`,
        R`$\dfrac{v^2}{r} = \dfrac{144}{36}\,\text{m/s}^2 = 4\,\text{m/s}^2$, e $N = 900\,\text{kg} \cdot (9{,}8 - 4)\,\text{m/s}^2 = 5220\,\text{N}$, meno del peso di 8820 N.`,
        R`Le ruote si staccano quando $N = 0$, cioè quando $\dfrac{v^2}{r} = g$: $v = \sqrt{g \cdot r} = \sqrt{9{,}8 \cdot 36}\,\text{m/s} \approx 18{,}8\,\text{m/s}$, circa 68 km/h.`
      ],
      risultato: R`$N = 5220\,\text{N}$; le ruote si staccano a circa $18{,}8\,\text{m/s}$.`
    },
    {
      titolo: 'La molla appesa in verticale',
      problema: R`Appendi una massa di 0,5 kg a una molla, e all'equilibrio la molla si allunga di 4,9 cm. Poi tiri giù la massa e la lasci. Con che periodo oscilla?`,
      passi: [
        R`Dati: $m = 0{,}5\,\text{kg}$, allungamento all'equilibrio $\Delta l = 4{,}9\,\text{cm} = 0{,}049\,\text{m}$. Cerco la costante $k$ e il periodo $T$.`,
        R`All'equilibrio la forza elastica regge il peso: $k \cdot \Delta l = m \cdot g$, quindi $k = \dfrac{0{,}5 \cdot 9{,}8\,\text{N}}{0{,}049\,\text{m}} = 100\,\text{N/m}$.`,
        R`Il peso sposta solo la posizione di riposo. Intorno a quella la massa oscilla come su una molla orizzontale.`,
        R`$T = 2\pi \cdot \sqrt{\dfrac{m}{k}} = 2\pi \cdot \sqrt{\dfrac{0{,}5\,\text{kg}}{100\,\text{N/m}}} \approx 0{,}444\,\text{s}$.`,
        R`Controllo: da $k = m \cdot g / \Delta l$ viene $\dfrac{m}{k} = \dfrac{\Delta l}{g}$, e $2\pi \cdot \sqrt{\dfrac{0{,}049}{9{,}8}}\,\text{s} \approx 0{,}444\,\text{s}$. Torna: è il periodo di un pendolo lungo 4,9 cm.`
      ],
      risultato: R`$k = 100\,\text{N/m}$, $T \approx 0{,}44\,\text{s}$`
    },
    {
      titolo: 'Misurare g con un pendolo',
      problema: R`Un pendolo è lungo 80 cm, misurati fino al centro della pallina. Lo fai oscillare con un'ampiezza piccola e misuri 20 oscillazioni complete in 35,9 s. Quanto vale $g$?`,
      passi: [
        R`Dati: $\ell = 80\,\text{cm} = 0{,}80\,\text{m}$, 20 oscillazioni in $35{,}9\,\text{s}$. Cerco $g$.`,
        R`Il periodo è il tempo di un'oscillazione: $T = \dfrac{35{,}9\,\text{s}}{20} \approx 1{,}795\,\text{s}$. Contare molte oscillazioni riduce l'errore del cronometro.`,
        R`Da $T = 2\pi \cdot \sqrt{\ell/g}$, elevando al quadrato: $g = \dfrac{4\pi^2 \cdot \ell}{T^2}$.`,
        R`$g = \dfrac{4\pi^2 \cdot 0{,}80\,\text{m}}{(1{,}795\,\text{s})^2} = \dfrac{31{,}6}{3{,}222}\,\text{m/s}^2 \approx 9{,}80\,\text{m/s}^2$.`,
        R`Controllo delle unità: metri diviso secondi al quadrato, proprio un'accelerazione. E il valore è quello atteso.`
      ],
      risultato: R`$g \approx 9{,}80\,\text{m/s}^2$`
    }
  ],
  formulario: [
    { nome: 'Carrello sul tavolo e massa appesa', formula: R`a = \dfrac{m \cdot g}{M + m} \qquad T = M \cdot a`, nota: R`Tavolo senza attrito, fune e carrucola ideali. $M$ è il carrello, $m$ la massa che pende.` },
    { nome: 'Macchina di Atwood: accelerazione', formula: R`a = g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}`, nota: R`$m_1 > m_2$: $m_1$ scende, $m_2$ sale, con la stessa accelerazione in modulo.` },
    { nome: 'Macchina di Atwood: tensione', formula: R`T = \dfrac{2 \cdot m_1 \cdot m_2}{m_1 + m_2} \cdot g`, nota: R`Sta sempre fra il peso di $m_2$ e quello di $m_1$.` },
    { nome: 'Piano inclinato senza attrito', formula: R`a = g \cdot \sin\alpha`, nota: R`Il peso lungo il piano è $P_\parallel = m \cdot g \cdot \sin\alpha$; la normale è $N = m \cdot g \cdot \cos\alpha$.` },
    { nome: 'Piano inclinato con attrito, in discesa', formula: R`a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)`, nota: R`In salita l'attrito cambia verso: il corpo rallenta con $g \cdot (\sin\alpha + \mu_d \cdot \cos\alpha)$.` },
    { nome: 'Quando un corpo fermo comincia a scivolare', formula: R`\tan\alpha > \mu_s`, nota: R`Sotto quell'angolo l'attrito statico basta a reggere $P_\parallel$.` },
    { nome: 'Forza centripeta', formula: R`F_c = m \cdot \dfrac{v^2}{r}`, nota: R`È la risultante delle forze vere, verso il centro. In N, con m in kg, v in m/s, r in m.` },
    { nome: 'Velocità massima in una curva piana', formula: R`v_{max} = \sqrt{\mu_s \cdot g \cdot r}`, nota: R`Attrito statico fra gomme e asfalto. Non dipende dalla massa.` },
    { nome: 'Curva sopraelevata senza attrito', formula: R`\tan\theta = \dfrac{v^2}{g \cdot r}`, nota: R`$\theta$ è l'inclinazione della strada verso il centro della curva.` },
    { nome: 'Massa sulla molla', formula: R`T = 2\pi \cdot \sqrt{\dfrac{m}{k}} \qquad \omega = \sqrt{\dfrac{k}{m}}`, nota: R`Vale anche per la molla verticale. Il periodo non dipende dall'ampiezza.` },
    { nome: 'Pendolo semplice', formula: R`T = 2\pi \cdot \sqrt{\dfrac{\ell}{g}}`, nota: R`Per piccole oscillazioni, fino a circa 10–15°. Non dipende dalla massa.` },
    { nome: 'g dal pendolo', formula: R`g = \dfrac{4\pi^2 \cdot \ell}{T^2}`, nota: R`$\ell$ misurata fino al centro della pallina, $T$ da molte oscillazioni.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'funi', tipo: 'definizione', fronte: R`Che cos'è una **fune ideale**?`, retro: R`Una fune che non si allunga e non ha massa. Tira con la stessa tensione ai due capi, e i corpi che lega hanno la stessa accelerazione.` },
    { id: 'fc-02', sezione: 'funi', tipo: 'concetto', fronte: R`Che cosa fa una **carrucola ideale**?`, retro: R`Cambia solo la direzione della fune. Senza massa e senza attrito, la tensione è la stessa dalle due parti.` },
    { id: 'fc-03', sezione: 'funi', tipo: 'procedura', fronte: R`Come si risolve un problema con due corpi legati da una fune?`, retro: R`Si scrive $F_{\text{tot}} = m \cdot a$ per ogni corpo, ciascuno con il verso positivo del suo moto. Sommando le equazioni la tensione si cancella.` },
    { id: 'fc-04', sezione: 'funi', tipo: 'concetto', fronte: R`La fune che regge una massa appesa in accelerazione tira quanto il suo peso?`, retro: R`No. Se la massa scende accelerando, la tensione è minore del peso; se sale accelerando, è maggiore. È uguale al peso solo a velocità costante.` },
    { id: 'fc-05', sezione: 'atwood', tipo: 'formula', fronte: R`L'accelerazione nella **macchina di Atwood**`, retro: R`$a = g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}$: la differenza dei pesi muove la somma delle masse.` },
    { id: 'fc-06', sezione: 'atwood', tipo: 'concetto', fronte: R`A che cosa serve la macchina di Atwood?`, retro: R`A rallentare la caduta. Con masse quasi uguali l'accelerazione è piccola, si misura bene, e da lì si ricava $g$.` },
    { id: 'fc-07', sezione: 'atwood', tipo: 'concetto', fronte: R`Nella macchina di Atwood, quanto vale la tensione rispetto ai pesi?`, retro: R`Sta in mezzo: più del peso della massa che sale, meno del peso di quella che scende.` },
    { id: 'fc-08', sezione: 'piano-inclinato', tipo: 'formula', fronte: R`Accelerazione sul **piano inclinato senza attrito**`, retro: R`$a = g \cdot \sin\alpha$, con $\alpha$ angolo fra piano e orizzontale. Non dipende dalla massa.` },
    { id: 'fc-09', sezione: 'piano-inclinato', tipo: 'concetto', fronte: R`Sul piano inclinato, quanto vale la forza normale?`, retro: R`$N = m \cdot g \cdot \cos\alpha$: annulla solo la parte del peso perpendicolare al piano. È minore del peso.` },
    { id: 'fc-10', sezione: 'piano-attrito', tipo: 'formula', fronte: R`Accelerazione in discesa su un **piano inclinato con attrito**`, retro: R`$a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)$, verso il basso lungo il piano.` },
    { id: 'fc-11', sezione: 'piano-attrito', tipo: 'concetto', fronte: R`Quando un corpo fermo comincia a scivolare su un piano inclinato?`, retro: R`Quando $\tan\alpha > \mu_s$: la parte del peso lungo il piano supera l'attrito statico massimo.` },
    { id: 'fc-12', sezione: 'piano-attrito', tipo: 'concetto', fronte: R`Un corpo lanciato **in salita** su un piano con attrito: dove punta l'attrito?`, retro: R`In giù, contro il moto. Il corpo rallenta con $a = g \cdot (\sin\alpha + \mu_d \cdot \cos\alpha)$.` },
    { id: 'fc-13', sezione: 'centripeta', tipo: 'formula', fronte: R`La **forza centripeta**`, retro: R`$F_c = m \cdot \dfrac{v^2}{r}$, diretta verso il centro della circonferenza.` },
    { id: 'fc-14', sezione: 'centripeta', tipo: 'concetto', fronte: R`La forza centripeta è un tipo di forza, come il peso o l'attrito?`, retro: R`No: è il compito di una forza vera (tensione, attrito, gravità, normale). È la risultante verso il centro.` },
    { id: 'fc-15', sezione: 'centripeta', tipo: 'concetto', fronte: R`Un sasso fatto girare con uno spago: lo spago si rompe. Che strada prende il sasso?`, retro: R`Va dritto, lungo la tangente al cerchio, per il primo principio. Non vola via lungo il raggio.` },
    { id: 'fc-16', sezione: 'curva', tipo: 'formula', fronte: R`La velocità massima in una **curva piana**`, retro: R`$v_{max} = \sqrt{\mu_s \cdot g \cdot r}$: la forza centripeta la dà l'attrito statico delle gomme.` },
    { id: 'fc-17', sezione: 'curva', tipo: 'concetto', fronte: R`Perché le curve delle autostrade sono **sopraelevate**?`, retro: R`La strada inclinata fa pendere la forza normale verso il centro: una sua parte fa da forza centripeta e aiuta l'attrito.` },
    { id: 'fc-18', sezione: 'curva', tipo: 'formula', fronte: R`Curva sopraelevata senza attrito: angolo giusto`, retro: R`$\tan\theta = \dfrac{v^2}{g \cdot r}$.` },
    { id: 'fc-19', sezione: 'molla', tipo: 'formula', fronte: R`Periodo di una **massa sulla molla**`, retro: R`$T = 2\pi \cdot \sqrt{\dfrac{m}{k}}$. Più massa, più lenta; molla più rigida, più veloce.` },
    { id: 'fc-20', sezione: 'molla', tipo: 'definizione', fronte: R`Che cos'è un **oscillatore armonico**?`, retro: R`Un corpo su cui agisce una forza di richiamo proporzionale allo spostamento, come $F = -k \cdot x$. Si muove di moto armonico.` },
    { id: 'fc-21', sezione: 'pendolo', tipo: 'formula', fronte: R`Periodo del **pendolo semplice**`, retro: R`$T = 2\pi \cdot \sqrt{\dfrac{\ell}{g}}$, per piccole oscillazioni. Non dipende dalla massa.` },
    { id: 'fc-22', sezione: 'pendolo', tipo: 'definizione', fronte: R`Che cos'è l'**isocronismo** del pendolo?`, retro: R`Per oscillazioni piccole il periodo non dipende dall'ampiezza: larghe o strette, durano lo stesso tempo.` },
    { id: 'fc-23', sezione: 'pendolo', tipo: 'procedura', fronte: R`Come si misura $g$ con un pendolo?`, retro: R`Si misura $\ell$ fino al centro della pallina, si cronometrano molte oscillazioni piccole per avere $T$, e si calcola $g = \dfrac{4\pi^2 \cdot \ell}{T^2}$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`In una macchina di Atwood sono appese una massa di 9 kg e una di 5 kg. Quanto vale l'accelerazione?`, suggerimenti: [R`$a = g \cdot \dfrac{m_1 - m_2}{m_1 + m_2}$.`], risposta: { tipo: 'numero', valore: 2.8, unita: 'm/s²' }, soluzione: [R`$a = 9{,}8\,\text{m/s}^2 \cdot \dfrac{9 - 5}{9 + 5} = 9{,}8 \cdot \dfrac{4}{14}\,\text{m/s}^2 = 2{,}8\,\text{m/s}^2$.`] },
    { id: 'b-02', livello: 'base', difficolta: 2, testo: R`In una macchina di Atwood sono appese una massa di 4 kg e una di 3 kg. Quanto vale la tensione della fune?`, suggerimenti: [R`Trova prima l'accelerazione.`, R`Poi guarda la massa che sale: $T - m_2 \cdot g = m_2 \cdot a$.`], risposta: { tipo: 'numero', valore: 33.6, unita: 'N' }, soluzione: [R`$a = 9{,}8 \cdot \dfrac{1}{7}\,\text{m/s}^2 = 1{,}4\,\text{m/s}^2$.`, R`Massa da 3 kg, che sale: $T = m_2 \cdot (g + a) = 3\,\text{kg} \cdot 11{,}2\,\text{m/s}^2 = 33{,}6\,\text{N}$.`, R`Controllo: $\dfrac{2 \cdot 4 \cdot 3}{7} \cdot 9{,}8 = 33{,}6\,\text{N}$, fra 29,4 N e 39,2 N.`] },
    { id: 'b-03', livello: 'base', difficolta: 2, testo: R`Un carrello di 6 kg sta su un tavolo senza attrito. Una fune ideale, passando su una carrucola, lo collega a una massa di 4 kg che pende. Quanto vale l'accelerazione?`, suggerimenti: [R`Il peso della massa appesa muove tutte e due le masse.`, R`$a = \dfrac{m \cdot g}{M + m}$.`], risposta: { tipo: 'numero', valore: 3.92, unita: 'm/s²' }, soluzione: [R`$a = \dfrac{4\,\text{kg} \cdot 9{,}8\,\text{m/s}^2}{6\,\text{kg} + 4\,\text{kg}} = \dfrac{39{,}2}{10}\,\text{m/s}^2 = 3{,}92\,\text{m/s}^2$.`] },
    { id: 'b-04', livello: 'base', difficolta: 2, testo: R`Due carrelli, di 5 kg e 3 kg, sono legati da una fune. Una forza di 24 N tira quello da 5 kg, e quello da 3 kg viene dietro. Niente attrito. Quanto tira la fune fra i due carrelli?`, suggerimenti: [R`Prima l'accelerazione comune, con la massa totale.`, R`La fune deve accelerare solo il carrello di dietro.`], risposta: { tipo: 'numero', valore: 9, unita: 'N' }, soluzione: [R`$a = \dfrac{24\,\text{N}}{8\,\text{kg}} = 3\,\text{m/s}^2$.`, R`$T = 3\,\text{kg} \cdot 3\,\text{m/s}^2 = 9\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Una rampa senza attrito è lunga 10 m e alta 6 m. Con che accelerazione scende un carrello?`, suggerimenti: [R`$\sin\alpha = h / l$.`, R`$a = g \cdot \sin\alpha$.`], risposta: { tipo: 'numero', valore: 5.88, unita: 'm/s²' }, soluzione: [R`$\sin\alpha = \dfrac{6}{10} = 0{,}6$.`, R`$a = 9{,}8\,\text{m/s}^2 \cdot 0{,}6 = 5{,}88\,\text{m/s}^2$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un blocco scivola senza attrito su un piano inclinato di 45°. Quanto vale la sua accelerazione?`, suggerimenti: [R`$a = g \cdot \sin\alpha$, con la calcolatrice.`], risposta: { tipo: 'numero', valore: 6.93, unita: 'm/s²' }, soluzione: [R`$a = 9{,}8\,\text{m/s}^2 \cdot \sin 45^\circ \approx 9{,}8 \cdot 0{,}707\,\text{m/s}^2 \approx 6{,}93\,\text{m/s}^2$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`Una cassa scende lungo un piano inclinato con $\sin\alpha = 0{,}6$ e $\cos\alpha = 0{,}8$. Il coefficiente di attrito dinamico è $\mu_d = 0{,}3$. Quanto vale l'accelerazione?`, suggerimenti: [R`$a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)$.`], risposta: { tipo: 'numero', valore: 3.53, unita: 'm/s²' }, soluzione: [R`$\sin\alpha - \mu_d \cdot \cos\alpha = 0{,}6 - 0{,}3 \cdot 0{,}8 = 0{,}36$.`, R`$a = 9{,}8\,\text{m/s}^2 \cdot 0{,}36 \approx 3{,}53\,\text{m/s}^2$.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Un blocco di 4 kg scivola su un piano inclinato con $\cos\alpha = 0{,}8$. Il coefficiente di attrito dinamico è $\mu_d = 0{,}5$. Quanto vale la forza d'attrito?`, suggerimenti: [R`Sul piano inclinato $N = m \cdot g \cdot \cos\alpha$.`, R`Poi $F_d = \mu_d \cdot N$.`], risposta: { tipo: 'numero', valore: 15.68, unita: 'N' }, soluzione: [R`$N = 4\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}8 = 31{,}36\,\text{N}$.`, R`$F_d = 0{,}5 \cdot 31{,}36\,\text{N} = 15{,}68\,\text{N}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Un libro è appoggiato su una tavola, con $\mu_s = 0{,}7$. Si solleva piano piano un lato della tavola. A che angolo il libro comincia a scivolare?`, suggerimenti: [R`Il corpo parte quando $\tan\alpha = \mu_s$.`, R`Usa la tangente inversa della calcolatrice.`], risposta: { tipo: 'numero', valore: 35, unita: '°', tolleranza: 0.5 }, soluzione: [R`$\tan\alpha = 0{,}7$, quindi $\alpha \approx 35^\circ$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Una palla di 0,5 kg gira su una circonferenza di raggio 1,2 m, a 6 m/s. Quanto vale la forza centripeta?`, suggerimenti: [R`$F_c = m \cdot \dfrac{v^2}{r}$.`], risposta: { tipo: 'numero', valore: 15, unita: 'N' }, soluzione: [R`$F_c = 0{,}5\,\text{kg} \cdot \dfrac{(6\,\text{m/s})^2}{1{,}2\,\text{m}} = 0{,}5 \cdot 30\,\text{N} = 15\,\text{N}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un'auto di 1200 kg percorre una curva di raggio 80 m a 20 m/s. Quanto vale la forza centripeta che serve?`, suggerimenti: [R`$F_c = m \cdot \dfrac{v^2}{r}$.`], risposta: { tipo: 'numero', valore: 6000, unita: 'N' }, soluzione: [R`$F_c = 1200\,\text{kg} \cdot \dfrac{400\,\text{m}^2/\text{s}^2}{80\,\text{m}} = 1200 \cdot 5\,\text{N} = 6000\,\text{N}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Una curva piana ha raggio 70 m. Fra gomme e asfalto $\mu_s = 0{,}7$. A che velocità massima si può fare la curva senza slittare?`, suggerimenti: [R`$v_{max} = \sqrt{\mu_s \cdot g \cdot r}$.`], risposta: { tipo: 'numero', valore: 21.9, unita: 'm/s', tolleranza: 0.2 }, soluzione: [R`$v_{max} = \sqrt{0{,}7 \cdot 9{,}8 \cdot 70}\,\text{m/s} = \sqrt{480{,}2}\,\text{m/s} \approx 21{,}9\,\text{m/s}$, circa 79 km/h.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un pendolo è lungo 2,45 m. Quanto vale il suo periodo, per piccole oscillazioni?`, suggerimenti: [R`$T = 2\pi \cdot \sqrt{\ell/g}$.`], risposta: { tipo: 'numero', valore: 3.14, unita: 's' }, soluzione: [R`$\dfrac{\ell}{g} = \dfrac{2{,}45}{9{,}8}\,\text{s}^2 = 0{,}25\,\text{s}^2$, e la radice vale $0{,}5\,\text{s}$.`, R`$T = 2\pi \cdot 0{,}5\,\text{s} = \pi\,\text{s} \approx 3{,}14\,\text{s}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Sulla Luna $g = 1{,}6\,\text{m/s}^2$. Quanto vale lì il periodo di un pendolo lungo 0,9 m?`, suggerimenti: [R`Stessa formula, con la $g$ della Luna.`], risposta: { tipo: 'numero', valore: 4.71, unita: 's' }, soluzione: [R`$T = 2\pi \cdot \sqrt{\dfrac{0{,}9\,\text{m}}{1{,}6\,\text{m/s}^2}} = 2\pi \cdot 0{,}75\,\text{s} \approx 4{,}71\,\text{s}$.`, R`Sulla Terra lo stesso pendolo avrebbe un periodo di circa 1,9 s.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Una massa di 0,16 kg è attaccata a una molla con $k = 64\,\text{N/m}$. Quanto vale il periodo delle oscillazioni?`, suggerimenti: [R`$T = 2\pi \cdot \sqrt{m/k}$.`], risposta: { tipo: 'numero', valore: 0.314, unita: 's' }, soluzione: [R`$\sqrt{\dfrac{0{,}16}{64}}\,\text{s} = 0{,}05\,\text{s}$, quindi $T = 2\pi \cdot 0{,}05\,\text{s} \approx 0{,}314\,\text{s}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Un carrello di 2 kg è attaccato a una molla con $k = 50\,\text{N/m}$. Quanto vale il periodo delle oscillazioni?`, suggerimenti: [R`$T = 2\pi \cdot \sqrt{m/k}$.`], risposta: { tipo: 'numero', valore: 1.26, unita: 's' }, soluzione: [R`$\sqrt{\dfrac{2}{50}}\,\text{s} = \sqrt{0{,}04}\,\text{s} = 0{,}2\,\text{s}$.`, R`$T = 2\pi \cdot 0{,}2\,\text{s} \approx 1{,}26\,\text{s}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una massa di 0,5 kg oscilla su una molla con periodo 0,628 s. Quanto vale la costante elastica della molla?`, suggerimenti: [R`Eleva al quadrato $T = 2\pi \cdot \sqrt{m/k}$ e ricava $k$.`, R`$k = \dfrac{4\pi^2 \cdot m}{T^2}$.`], risposta: { tipo: 'numero', valore: 50, unita: 'N/m' }, soluzione: [R`$k = \dfrac{4\pi^2 \cdot 0{,}5\,\text{kg}}{(0{,}628\,\text{s})^2} = \dfrac{19{,}74}{0{,}394}\,\text{N/m} \approx 50\,\text{N/m}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Una massa su una molla oscilla con periodo 1,5 s. Si mette al suo posto una massa nove volte più grande, sulla stessa molla. Quanto diventa il periodo?`, suggerimenti: [R`La massa sta sotto radice.`], risposta: { tipo: 'numero', valore: 4.5, unita: 's' }, soluzione: [R`Massa per 9 vuol dire periodo per $\sqrt{9} = 3$: $T = 3 \cdot 1{,}5\,\text{s} = 4{,}5\,\text{s}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un pendolo ha periodo 1,2 s. Si allunga il filo fino a una lunghezza quattro volte più grande. Quanto diventa il periodo?`, suggerimenti: [R`La lunghezza sta sotto radice.`], risposta: { tipo: 'numero', valore: 2.4, unita: 's' }, soluzione: [R`Lunghezza per 4 vuol dire periodo per $\sqrt{4} = 2$: $T = 2 \cdot 1{,}2\,\text{s} = 2{,}4\,\text{s}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un pendolo fa 30 oscillazioni complete in 45 s. Quanto è lungo?`, suggerimenti: [R`Prima il periodo: tempo totale diviso numero di oscillazioni.`, R`Poi $\ell = \dfrac{g \cdot T^2}{4\pi^2}$.`], risposta: { tipo: 'numero', valore: 0.559, unita: 'm', tolleranza: 0.01 }, soluzione: [R`$T = \dfrac{45\,\text{s}}{30} = 1{,}5\,\text{s}$.`, R`$\ell = \dfrac{9{,}8 \cdot 1{,}5^2}{4\pi^2}\,\text{m} = \dfrac{22{,}05}{39{,}48}\,\text{m} \approx 0{,}56\,\text{m}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una macchina di Atwood porta masse di 3,5 kg e 2,5 kg, inizialmente ferme. Che velocità hanno dopo che la più pesante è scesa di 2 m?`, suggerimenti: [R`Calcola l'accelerazione con la formula di Atwood.`, R`Il tempo non serve: $v^2 = 2 \cdot a \cdot \Delta s$.`], risposta: { tipo: 'numero', valore: 2.56, unita: 'm/s', tolleranza: 0.03 }, soluzione: [R`$a = 9{,}8 \cdot \dfrac{1}{6}\,\text{m/s}^2 \approx 1{,}63\,\text{m/s}^2$.`, R`$v = \sqrt{2 \cdot 1{,}63 \cdot 2}\,\text{m/s} \approx 2{,}56\,\text{m/s}$, per tutte e due le masse.`] },
    { id: 'es-02', difficolta: 3, testo: R`Un blocco di 4 kg su un tavolo, con $\mu_d = 0{,}25$, è tirato da una massa di 2 kg che pende da una carrucola al bordo. Il sistema è in moto. Quanto vale la tensione della fune?`, suggerimenti: [R`Scrivi il secondo principio per il blocco e per la massa appesa, poi sommali.`, R`L'attrito sul blocco vale $\mu_d \cdot M \cdot g$.`], risposta: { tipo: 'numero', valore: 16.3, unita: 'N', tolleranza: 0.2 }, soluzione: [R`Attrito: $F_d = 0{,}25 \cdot 4 \cdot 9{,}8\,\text{N} = 9{,}8\,\text{N}$. Peso appeso: $19{,}6\,\text{N}$.`, R`Sommando: $19{,}6 - 9{,}8 = 6 \cdot a$, quindi $a \approx 1{,}63\,\text{m/s}^2$.`, R`Massa appesa: $T = 2 \cdot (9{,}8 - 1{,}63)\,\text{N} \approx 16{,}3\,\text{N}$. Controllo sul blocco: $16{,}3 - 9{,}8 = 6{,}5 \approx 4 \cdot 1{,}63$. Torna.`] },
    { id: 'es-03', difficolta: 2, testo: R`Una cassa di 12 kg è ferma su un tavolo, con $\mu_s = 0{,}35$. Una fune la collega, passando su una carrucola, a un secchio che pende. Quanta massa deve avere almeno il secchio, perché la cassa parta?`, suggerimenti: [R`Finché tutto è fermo, la tensione è uguale al peso del secchio.`, R`La cassa parte quando la tensione supera $\mu_s \cdot M \cdot g$.`], risposta: { tipo: 'numero', valore: 4.2, unita: 'kg' }, soluzione: [R`Attrito statico massimo: $0{,}35 \cdot 12 \cdot 9{,}8\,\text{N} \approx 41{,}2\,\text{N}$.`, R`Serve $m \cdot g > 0{,}35 \cdot 12\,\text{kg} \cdot g$: la $g$ si semplifica, $m > 4{,}2\,\text{kg}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Una slitta parte da ferma in cima a una discesa di 25°, lunga 40 m. Il coefficiente di attrito dinamico con la neve è $\mu_d = 0{,}15$. Con che velocità arriva in fondo?`, suggerimenti: [R`$a = g \cdot (\sin\alpha - \mu_d \cdot \cos\alpha)$.`, R`Poi $v = \sqrt{2 \cdot a \cdot \Delta s}$.`], risposta: { tipo: 'numero', valore: 15, unita: 'm/s', tolleranza: 0.2 }, soluzione: [R`$a = 9{,}8 \cdot (0{,}423 - 0{,}15 \cdot 0{,}906)\,\text{m/s}^2 \approx 2{,}81\,\text{m/s}^2$.`, R`$v = \sqrt{2 \cdot 2{,}81 \cdot 40}\,\text{m/s} \approx 15{,}0\,\text{m/s}$, circa 54 km/h.`] },
    { id: 'es-05', difficolta: 3, testo: R`Una cassa viene spinta a 8 m/s su per una rampa di 15°, e poi lasciata andare. Il coefficiente di attrito dinamico è $\mu_d = 0{,}25$. Quanta strada fa salendo, prima di fermarsi?`, suggerimenti: [R`In salita l'attrito punta in giù: $a = g \cdot (\sin\alpha + \mu_d \cdot \cos\alpha)$.`, R`$\Delta s = \dfrac{v_0^2}{2 \cdot a}$.`], risposta: { tipo: 'numero', valore: 6.53, unita: 'm', tolleranza: 0.07 }, soluzione: [R`$a = 9{,}8 \cdot (0{,}259 + 0{,}25 \cdot 0{,}966)\,\text{m/s}^2 \approx 4{,}90\,\text{m/s}^2$, contro il moto.`, R`$\Delta s = \dfrac{64}{2 \cdot 4{,}90}\,\text{m} \approx 6{,}5\,\text{m}$.`] },
    { id: 'es-06', difficolta: 2, testo: R`Un blocco, spinto una volta, scende a velocità costante lungo un piano inclinato di 22°. Quanto vale il coefficiente di attrito dinamico?`, suggerimenti: [R`Velocità costante: accelerazione zero.`, R`Allora $\sin\alpha - \mu_d \cdot \cos\alpha = 0$.`], risposta: { tipo: 'numero', valore: 0.404, tolleranza: 0.005 }, soluzione: [R`Con $a = 0$: $\mu_d = \dfrac{\sin\alpha}{\cos\alpha} = \tan 22^\circ \approx 0{,}404$.`, R`È un altro modo di misurare un coefficiente: questa volta quello dinamico.`] },
    { id: 'es-07', difficolta: 3, testo: R`Si vuole costruire una curva sopraelevata di raggio 150 m che le auto possano fare a 25 m/s anche senza attrito, per esempio sul ghiaccio. Di quanti gradi va inclinata la strada?`, suggerimenti: [R`$\tan\theta = \dfrac{v^2}{g \cdot r}$.`], risposta: { tipo: 'numero', valore: 23, unita: '°', tolleranza: 0.3 }, soluzione: [R`$\tan\theta = \dfrac{625}{9{,}8 \cdot 150} = \dfrac{625}{1470} \approx 0{,}425$.`, R`$\theta \approx 23^\circ$.`] },
    { id: 'es-08', difficolta: 3, testo: R`Fai girare un secchio d'acqua su un cerchio verticale. Il centro del secchio dista 1,1 m dalla spalla. Quanto deve andare veloce almeno, nel punto più alto, perché l'acqua non cada?`, suggerimenti: [R`In cima la forza centripeta punta in giù. Il peso dell'acqua da solo deve bastare, al limite.`, R`$m \cdot g = m \cdot \dfrac{v^2}{r}$.`], risposta: { tipo: 'numero', valore: 3.28, unita: 'm/s', tolleranza: 0.04 }, soluzione: [R`Al limite il fondo del secchio non spinge l'acqua: il peso fa da forza centripeta. $g = \dfrac{v^2}{r}$.`, R`$v = \sqrt{g \cdot r} = \sqrt{9{,}8 \cdot 1{,}1}\,\text{m/s} \approx 3{,}28\,\text{m/s}$. Più veloce, e il fondo deve anche spingere.`] },
    { id: 'es-09', difficolta: 2, testo: R`Appendi un oggetto a una molla, e all'equilibrio la molla si allunga di 9,8 cm. Con che periodo oscilla l'oggetto, se lo tiri giù e lo lasci?`, suggerimenti: [R`All'equilibrio $k \cdot \Delta l = m \cdot g$, quindi $\dfrac{m}{k} = \dfrac{\Delta l}{g}$.`], risposta: { tipo: 'numero', valore: 0.628, unita: 's', tolleranza: 0.008 }, soluzione: [R`$\dfrac{m}{k} = \dfrac{0{,}098\,\text{m}}{9{,}8\,\text{m/s}^2} = 0{,}01\,\text{s}^2$.`, R`$T = 2\pi \cdot \sqrt{0{,}01}\,\text{s} = 2\pi \cdot 0{,}1\,\text{s} \approx 0{,}628\,\text{s}$. La massa non serve conoscerla.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un pendolo lungo 75 cm è appeso al soffitto di un ascensore, che parte verso l'alto con un'accelerazione di $2{,}2\,\text{m/s}^2$. Quanto vale il periodo mentre l'ascensore accelera?`, suggerimenti: [R`Come per la bilancia in ascensore, il filo deve reggere $m \cdot (g + a)$.`, R`Nella formula del periodo, al posto di $g$ va $g + a$.`], risposta: { tipo: 'numero', valore: 1.57, unita: 's', tolleranza: 0.02 }, soluzione: [R`Nell'ascensore tutto va come se la gravità fosse $g + a = 12\,\text{m/s}^2$.`, R`$T = 2\pi \cdot \sqrt{\dfrac{0{,}75}{12}}\,\text{s} = 2\pi \cdot 0{,}25\,\text{s} \approx 1{,}57\,\text{s}$, contro 1,74 s ad ascensore fermo.`] },
    { id: 'es-11', difficolta: 2, testo: R`Un'auto fa una curva piana di raggio 90 m a 81 km/h. Quanto deve valere almeno il coefficiente di attrito statico, perché non slitti?`, suggerimenti: [R`Porta la velocità in m/s.`, R`Serve $m \cdot \dfrac{v^2}{r} \le \mu_s \cdot m \cdot g$.`], risposta: { tipo: 'numero', valore: 0.574, tolleranza: 0.01 }, soluzione: [R`$v = \dfrac{81}{3{,}6}\,\text{m/s} = 22{,}5\,\text{m/s}$.`, R`$\mu_s \ge \dfrac{v^2}{g \cdot r} = \dfrac{506{,}25}{9{,}8 \cdot 90} = \dfrac{506{,}25}{882} \approx 0{,}57$. Va bene l'asciutto, non il bagnato.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Una massa appesa a una fune scende accelerando, tirata giù dal suo peso. Com'è la tensione della fune rispetto al peso?`, opzioni: [R`Uguale al peso`, R`Maggiore del peso`, R`Minore del peso`, R`Zero`], corretta: 2, spiegazione: R`La massa accelera verso il basso, quindi la risultante punta in giù: il peso deve vincere sulla tensione. Uguale al peso vorrebbe dire velocità costante; maggiore, accelerazione in su. Zero solo in caduta libera.` },
    { id: 'q-02', domanda: R`In una macchina di Atwood le due masse diventano uguali. Che cosa succede?`, opzioni: [R`L'accelerazione è zero: restano ferme, o vanno a velocità costante`, R`Cadono tutte e due con accelerazione $g$`, R`Accelerano con $g/2$`, R`La tensione diventa zero`], corretta: 0, spiegazione: R`Con $m_1 = m_2$ la differenza dei pesi è zero, e quindi anche $a$. La tensione vale proprio il peso di ciascuna, non zero. Cadere con $g$ succederebbe solo senza fune.` },
    { id: 'q-03', domanda: R`Nella formula di Atwood perché al denominatore c'è $m_1 + m_2$?`, opzioni: [R`Perché le masse si sommano sempre`, R`Per avere un numero più piccolo`, R`Perché la tensione è la somma dei pesi`, R`Perché la differenza dei pesi deve accelerare tutte e due le masse`], corretta: 3, spiegazione: R`La forza che mette in moto il sistema è $(m_1 - m_2) \cdot g$, e deve accelerare tutta la massa legata dalla fune. La tensione non è la somma dei pesi: sta fra i due.` },
    { id: 'q-04', domanda: R`Su un piano inclinato senza attrito si raddoppia la massa del corpo. Che cosa succede all'accelerazione?`, opzioni: [R`Raddoppia`, R`Resta uguale`, R`Si dimezza`, R`Dipende dall'angolo`], corretta: 1, spiegazione: R`$a = g \cdot \sin\alpha$: la massa si semplifica. Raddoppia la forza $P_\parallel$, ma raddoppia anche la massa da muovere. L'angolo conta, ma non cambia la risposta alla domanda.` },
    { id: 'q-05', domanda: R`Sul piano inclinato, quanto vale la forza normale?`, opzioni: [R`$m \cdot g \cdot \cos\alpha$`, R`$m \cdot g$`, R`$m \cdot g \cdot \sin\alpha$`, R`$m \cdot g \cdot \tan\alpha$`], corretta: 0, spiegazione: R`La normale annulla solo la parte del peso perpendicolare al piano, $P_\perp = m \cdot g \cdot \cos\alpha$. Vale $m \cdot g$ solo sul piano orizzontale; $m \cdot g \cdot \sin\alpha$ è la parte lungo il piano.` },
    { id: 'q-06', domanda: R`Una cassa scende con attrito lungo un piano inclinato. Dove punta l'attrito dinamico?`, opzioni: [R`Verso il basso, lungo il piano`, R`Perpendicolare al piano`, R`Verso l'alto, lungo il piano`, R`Verticale, verso l'alto`], corretta: 2, spiegazione: R`L'attrito dinamico è parallelo al piano e contrario al moto. La cassa scende, quindi l'attrito punta in su lungo il piano. Perpendicolare al piano c'è la normale.` },
    { id: 'q-07', domanda: R`Un blocco è fermo su un piano inclinato con $\mu_s = 0{,}4$. Si alza il piano a poco a poco. Quando parte il blocco?`, opzioni: [R`Quando l'angolo supera 40°`, R`Quando $\sin\alpha$ supera 0,4`, R`Subito, perché un piano inclinato fa sempre scivolare`, R`Quando $\tan\alpha$ supera 0,4`], corretta: 3, spiegazione: R`Parte quando $m \cdot g \cdot \sin\alpha > \mu_s \cdot m \cdot g \cdot \cos\alpha$, cioè $\tan\alpha > \mu_s$: circa 22°. Il coefficiente non è un angolo, e il confronto non è con il seno.` },
    { id: 'q-08', domanda: R`Che cos'è la forza centripeta?`, opzioni: [R`Una forza in più, che compare quando un corpo gira`, R`La risultante delle forze vere, che punta verso il centro`, R`Una forza che spinge verso l'esterno`, R`La forza del motore in curva`], corretta: 1, spiegazione: R`Non è un nuovo tipo di forza: è il ruolo svolto da forze vere, come una tensione o l'attrito. Verso l'esterno punta la centrifuga, che è apparente. Il motore spinge in avanti, non verso il centro.` },
    { id: 'q-09', domanda: R`Un'auto fa la stessa curva a velocità doppia. La forza centripeta che le serve…`, opzioni: [R`diventa quattro volte tanto`, R`raddoppia`, R`resta uguale`, R`si dimezza`], corretta: 0, spiegazione: R`$F_c = m \cdot v^2 / r$: la velocità è al quadrato. Velocità doppia, forza quadrupla. Per questo una curva presa troppo veloce fa slittare.` },
    { id: 'q-10', domanda: R`In una curva piana, che cosa spinge un'auto verso il centro?`, opzioni: [R`La forza centrifuga`, R`Il peso dell'auto`, R`Il motore`, R`L'attrito statico fra gomme e asfalto`], corretta: 3, spiegazione: R`La gomma non slitta di lato, quindi è attrito statico, ed è diretto verso il centro. Il peso è verticale; il motore spinge avanti; la centrifuga è apparente e punta fuori.` },
    { id: 'q-11', domanda: R`Sul bagnato il coefficiente di attrito delle gomme si dimezza. Come cambia la velocità massima in una curva?`, opzioni: [R`Si dimezza`, R`Resta uguale`, R`Si divide per circa 1,41`, R`Si divide per 4`], corretta: 2, spiegazione: R`$v_{max} = \sqrt{\mu_s \cdot g \cdot r}$: con $\mu_s$ dimezzato la velocità si divide per $\sqrt{2} \approx 1{,}41$. Nel video: da circa 19,8 m/s a 14 m/s.` },
    { id: 'q-12', domanda: R`Una massa oscilla su una molla. Se si usa una molla quattro volte più rigida, il periodo…`, opzioni: [R`diventa quattro volte più lungo`, R`si dimezza`, R`raddoppia`, R`resta uguale`], corretta: 1, spiegazione: R`$T = 2\pi \cdot \sqrt{m/k}$: $k$ sta sotto radice e al denominatore. $k$ per 4 vuol dire periodo diviso 2. Una molla più rigida richiama più forte e fa oscillare più in fretta.` },
    { id: 'q-13', domanda: R`Due pendoli hanno fili uguali; uno ha una pallina di piombo, l'altro di legno. Lasciati insieme da 8°, come oscillano?`, opzioni: [R`Insieme: il periodo non dipende dalla massa`, R`Il piombo più veloce, perché pesa di più`, R`Il legno più veloce, perché è più leggero`, R`Il piombo più lento, perché ha più inerzia`], corretta: 0, spiegazione: R`Nel pendolo la massa si semplifica: $T = 2\pi \cdot \sqrt{l/g}$. Più peso vuol dire più forza, ma anche più inerzia, nella stessa proporzione.` },
    { id: 'q-14', domanda: R`L'isocronismo del pendolo dice che il periodo non dipende dall'ampiezza. Quando vale?`, opzioni: [R`Sempre, per qualunque ampiezza`, R`Solo per fili lunghi più di un metro`, R`Solo per palline pesanti`, R`Per oscillazioni piccole, fino a circa 10–15°`], corretta: 3, spiegazione: R`La formula nasce da $\sin\theta \approx \theta$, che vale per angoli piccoli. A 60° il periodo è già più lungo di circa il 7%. La lunghezza del filo e la massa non c'entrano.` }
  ],
  suggerimenti: [
    { tipo: 'metodo', testo: R`Con più corpi legati, scrivi $F_{\text{tot}} = m \cdot a$ per **ognuno**, con il verso positivo del suo moto. Poi somma le equazioni: la tensione sparisce.` },
    { tipo: 'errore', testo: R`La tensione di una fune che regge una massa in accelerazione **non** è il suo peso. Se lo fosse, la massa non accelererebbe.` },
    { tipo: 'errore', testo: R`Sul piano inclinato la forza normale è $m \cdot g \cdot \cos\alpha$, non $m \cdot g$. E l'attrito dinamico si calcola con questa.` },
    { tipo: 'errore', testo: R`L'attrito dinamico è sempre contro lo strisciamento, non sempre verso l'alto. Su un corpo che sale lungo un piano, punta in giù.` },
    { tipo: 'errore', testo: R`La forza centripeta non si aggiunge alle altre nel disegno. È la risultante delle forze vere, quella che punta verso il centro.` },
    { tipo: 'trucco', testo: R`Quando la massa si semplifica, il risultato vale per tutti: slitte sul ghiaccio, auto in curva, pendoli. Se nel tuo risultato resta la massa, ricontrolla.` },
    { tipo: 'trucco', testo: R`Molla e pendolo hanno la stessa formula: $T = 2\pi \cdot \sqrt{\text{inerzia} / \text{richiamo}}$. Massa su $k$ per la molla, $\ell$ su $g$ per il pendolo.` },
    { tipo: 'metodo', testo: R`Sul piano inclinato scegli un asse lungo il piano e uno perpendicolare. Così l'accelerazione ha una sola componente, e il peso è l'unica forza da scomporre.` }
  ],
  aneddoti: [
    { fisico: 'Galileo Galilei', anni: '1564–1642', titolo: 'Il pendolo di piombo e quello di sughero', testo: R`Nei *Discorsi* del 1638 Galileo racconta una prova con due pendoli. La descrive per bocca di Salviati, uno dei personaggi del libro. Prese due palline, una di piombo e una di sughero. La prima pesava più di cento volte la seconda. Le appese a due fili sottili e uguali, lunghi quattro o cinque braccia. Poi le scostò dalla verticale e le lasciò andare insieme. Le oscillazioni del sughero si spegnevano prima, frenate dall'aria. Il ritmo però restava lo stesso. In cento, e anche in mille oscillazioni, il piombo non anticipava mai il sughero. Galileo usava il pendolo come una caduta rallentata e ripetuta. Ne concluse che, senza l'aria, piombo e sughero cadrebbero insieme.`, legame: R`Il periodo del pendolo non dipende dalla massa: nella formula $T = 2\pi \cdot \sqrt{l/g}$ la massa non c'è.` },
    { fisico: 'George Atwood', anni: '1745–1807', titolo: 'La macchina che piaceva al primo ministro', testo: R`George Atwood insegnava al Trinity College di Cambridge. Le sue lezioni erano famose, perché piene di esperimenti. Nel 1784 pubblicò un trattato sul moto dei corpi, e vi descrisse la sua macchina. C'erano una colonna con una scala graduata e una carrucola leggerissima, che girava su altre ruote per ridurre l'attrito. Alla fune erano appese due scatole uguali. Un pesetto in più metteva in moto il sistema. Un anello lungo la colonna poteva togliere il pesetto a metà corsa. Da lì le masse andavano a velocità costante, facile da misurare. Un pendolo batteva i secondi. Alle sue lezioni andava anche il giovane William Pitt, futuro primo ministro. Nel 1784 Pitt gli diede un incarico pubblico ben pagato, e Atwood lo aiutò per anni con i conti dello Stato.`, legame: R`È la macchina di Atwood: due masse quasi uguali rallentano la caduta e la rendono misurabile.` },
    { fisico: 'Jean Richer', anni: '1630–1696', titolo: 'L\'orologio che a Cayenne restava indietro', testo: R`Nel 1672 l'Accademia delle scienze di Parigi mandò l'astronomo Jean Richer a Cayenne, nella Guyana francese, vicino all'equatore. Doveva osservare Marte, mentre a Parigi lo osservava Gian Domenico Cassini. Dalle due misure si ricavava la distanza del pianeta. Richer portò con sé un orologio a pendolo, regolato a Parigi. A Cayenne l'orologio restava indietro di circa due minuti e mezzo al giorno. Per farlo andare giusto dovette accorciare il pendolo di quasi tre millimetri. Pubblicò i risultati nel 1679. La spiegazione la diedero Huygens e Newton. Vicino all'equatore $g$ è un po' più piccola: la Terra gira, e non è una sfera perfetta.`, legame: R`Il periodo di un pendolo dipende da $g$: dove la gravità è minore, il pendolo è più lento.` },
    { fisico: 'Henry Kater', anni: '1777–1835', titolo: 'Il pendolo che si capovolge', testo: R`Henry Kater era un ufficiale inglese. In India aveva lavorato alle grandi misure del territorio. Nel 1817, mentre in Inghilterra si preparava la riforma dei pesi e delle misure, gli chiesero un dato preciso: la lunghezza del pendolo che batte il secondo, a Londra. Un pendolo vero però non è semplice. La massa è distribuita lungo la sbarra, e non si sa fino a dove misurare la lunghezza. Kater trovò una soluzione elegante. Mise un coltello d'acciaio a ciascuna estremità di una sbarra, e dei pesi scorrevoli. Il pendolo si poteva appendere da una parte o dall'altra. Spostava i pesi finché i due periodi diventavano uguali. Allora la distanza fra i coltelli era la lunghezza del pendolo semplice equivalente. Pubblicò il lavoro nel 1818.`, legame: R`Misurando $l$ e $T$ si ricava $g = 4\pi^2 \cdot l / T^2$: il pendolo di Kater lo fa con grande precisione.` }
  ]
});
})();
