/* Quanto — L'induzione elettromagnetica (induzione, quinto anno): la corrente indotta, il flusso del campo magnetico,
   la legge di Faraday-Neumann, la f.e.m. di movimento, la legge di Lenz, l'autoinduzione e il circuito RL,
   l'alternatore e la corrente alternata, il trasformatore.
   Colori come nei video: campo magnetico B e flusso Φ verdi (3), f.e.m. e tensioni arancio (2), corrente viola (4),
   velocità azzurra (1), fili e ferro grigi, spire del trasformatore viola (portano corrente), poli con 'polo-n'/'polo-s' come in magnetismo.js. f.e.m. ℰ come in corrente.js
   (nei video si scrive ε). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/induzione.js */
(function () {
const R = String.raw;

/* pezzi per i disegni (piano senza assi) */
function filo(a, b) { return { tipo: 'segmento', da: a, a: b, colore: 'grigio' }; }
function rettangolo(x1, y1, x2, y2, riempi) { return { tipo: 'poligono', punti: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], colore: 'grigio', riempi: !!riempi }; }
/* spire di una bobina avvolta su una gamba verticale di ferro, da x1 a x2, n spire a partire da y0 */
function spire(x1, x2, y0, n, passo, colore) {
  const out = [];
  for (let i = 0; i < n; i++) out.push({ tipo: 'segmento', da: [x1, y0 + i * passo], a: [x2, y0 + i * passo + 0.18], colore: colore });
  return out;
}

QUANTO.registra({
  id: 'induzione',
  titolo: 'L\'induzione elettromagnetica',
  introduzione: R`La corrente delle prese non viene da una pila gigante. La producono gli alternatori delle centrali: bobine che girano in un campo magnetico. È l'**induzione elettromagnetica**, scoperta da Michael Faraday nel 1831. Un campo magnetico che cambia fa nascere una corrente in un circuito, anche senza pile.

La stessa idea è nel caricatore senza fili del telefono, nel piano di cottura a induzione, nella dinamo della bicicletta. Si comincia dal flusso del campo magnetico e dalla legge che dice quanta tensione nasce. Poi la legge di Lenz dice il verso della corrente, e l'autoinduzione spiega la scintilla quando si stacca una spina. Alla fine si arriva alla corrente alternata e al trasformatore, che alza e abbassa le tensioni.

Servono il campo magnetico e la forza di Lorentz, visti nel magnetismo, e la legge di Ohm.`,
  inBreve: [
    R`Il **flusso** del campo magnetico attraverso una spira è $\Phi = B \cdot S \cdot \cos\alpha$, in weber. Conta le linee di campo che attraversano la spira.`,
    R`**Legge di Faraday-Neumann**: la f.e.m. indotta è $\mathcal{E} = -\dfrac{\Delta\Phi}{\Delta t}$. Non conta quanto flusso c'è, ma quanto in fretta cambia.`,
    R`**Legge di Lenz**: la corrente indotta si oppone alla variazione di flusso che l'ha prodotta. È il segno meno della legge, ed è la conservazione dell'energia.`,
    R`Una bobina si oppone ai cambiamenti della sua corrente: $\mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t}$. L'induttanza $L$ si misura in henry, e la bobina contiene l'energia $\tfrac{1}{2} \cdot L \cdot I^2$.`,
    R`Una spira che gira in un campo dà una tensione **alternata** sinusoidale: nelle prese 50 Hz e 230 V efficaci, con un picco di circa 325 V.`,
    R`Nel **trasformatore** le tensioni stanno come le spire, $\dfrac{V_2}{V_1} = \dfrac{N_2}{N_1}$. Funziona solo in alternata, e la potenza non aumenta.`
  ],
  sezioni: [
    {
      id: 'corrente-indotta',
      titolo: 'La corrente indotta',
      testo: R`Una corrente crea un campo magnetico: lo si è visto nel magnetismo. Vale anche il contrario? Un campo magnetico può creare una corrente?

La prova più semplice usa una bobina collegata a un amperometro con lo zero al centro, e una calamita.

[[video:induzione/faraday]]

Ecco che cosa si osserva.

- Calamita ferma, fuori o dentro la bobina: l'ago resta sullo zero.
- Calamita che entra: l'ago si sposta.
- Calamita che esce: l'ago si sposta dall'altra parte.
- Calamita mossa più in fretta: l'ago si sposta di più.
- Calamita ferma e bobina che si muove: succede lo stesso.

>* Una **corrente indotta** nasce in un circuito chiuso solo mentre cambia il campo magnetico che lo attraversa. Il fenomeno si chiama **induzione elettromagnetica**.

La calamita non è indispensabile. Al suo posto si può mettere una seconda bobina, collegata a una pila con un interruttore. Quando si chiude o si apre l'interruttore, nella prima bobina passa un guizzo di corrente. Con la corrente costante, niente.

Esempio. Nella base di un caricatore senza fili c'è una bobina. Ci passa una corrente alternata, quindi il suo campo magnetico cambia di continuo. Nel telefono appoggiato sopra c'è un'altra bobina, attraversata da quel campo. Lì nasce una corrente indotta, che carica la batteria senza nessun contatto.

>! Un campo magnetico intenso ma fermo non induce niente. Una calamita potentissima, immobile dentro una bobina, non fa passare corrente.

?? Una calamita sta ferma dentro una bobina collegata a un amperometro. Che cosa segna l'amperometro?
[ ] una corrente costante, più forte se la calamita è più forte
[x] zero
[ ] una corrente che cambia verso di continuo
=> Il campo c'è, ma non cambia: senza variazione non c'è corrente indotta. L'ago si sposta solo mentre la calamita entra o esce.`
    },
    {
      id: 'flusso',
      titolo: 'Il flusso del campo magnetico',
      testo: R`Che cosa cambia, esattamente, quando la calamita entra nella bobina? Cambia il numero di linee di campo che attraversano ogni spira. Questa quantità si chiama **flusso** del campo magnetico.

Pensa a una spira piana di area $S$ in un campo uniforme $B$. Più il campo è intenso, più linee la attraversano. Più la spira è grande, più linee raccoglie. E conta come è girata: di fronte alle linee ne prende tante, di taglio nessuna.

Per dire come è girata si usa la **perpendicolare** alla spira, la retta che la attraversa ad angolo retto. L'angolo $\alpha$ si misura fra il campo e questa perpendicolare.

>* Il **flusso** del campo magnetico attraverso una superficie piana è $\Phi = B \cdot S \cdot \cos\alpha$. L'angolo $\alpha$ è quello fra $B$ e la perpendicolare alla superficie. Si misura in **weber**: $1\,\text{Wb} = 1\,\text{T} \cdot \text{m}^2$.

[[grafico:flusso-angolo]]

Con $\alpha = 0$ la spira sta di fronte alle linee e il flusso è massimo, $B \cdot S$. Con $\alpha = 90^\circ$ la spira è parallela alle linee e il flusso è zero.

Esempio. Una spira rettangolare di 20 cm per 10 cm sta di fronte alle linee di un campo di 0,5 T.

~ S = 0{,}20\,\text{m} \cdot 0{,}10\,\text{m} = 0{,}020\,\text{m}^2 :: l'area in metri quadrati
~ \Phi = B \cdot S \cdot \cos 0^\circ :: di fronte alle linee: $\alpha = 0$ e il coseno vale 1
~ \Phi = 0{,}5\,\text{T} \cdot 0{,}020\,\text{m}^2 :: metto i numeri con le unità
~ \Phi = \evidb{0{,}010\,\text{Wb}} :: cioè 10 mWb: tesla per metro quadrato fa weber

Il flusso può cambiare in tre modi. Cambia $B$, se la calamita si avvicina. Cambia $S$, se un lato della spira scorre. Cambia $\alpha$, se la spira gira. Sono i tre modi di produrre una corrente indotta.

> Nel magnetismo si è visto che il flusso di $B$ attraverso una superficie **chiusa** è sempre zero. Qui la superficie è aperta: è quella racchiusa dalla spira.

>! L'angolo $\alpha$ non è quello fra il campo e la spira, ma fra il campo e la sua perpendicolare. Una spira di fronte alle linee ha $\alpha = 0$.

?? Una spira sta in un campo uniforme, con il suo piano parallelo alle linee di campo. Quanto vale il flusso?
[ ] il massimo, $B \cdot S$
[ ] metà del massimo
[x] zero
=> Nessuna linea attraversa la spira. La perpendicolare forma 90° con il campo, e $\cos 90^\circ = 0$.`
    },
    {
      id: 'faraday-neumann',
      titolo: 'La legge di Faraday-Neumann',
      testo: R`Gli esperimenti dicono che la corrente è più forte se il flusso cambia più in fretta. La calamita spinta di corsa sposta l'ago più di quella spinta piano. Conta la **rapidità** con cui cambia il flusso.

La corrente indotta è spinta da una **forza elettromotrice indotta**, come quella di una pila. La f.e.m. si indica con $\mathcal{E}$, come nella corrente elettrica; nei video si scrive $\varepsilon$.

>* **Legge di Faraday-Neumann**: la f.e.m. indotta in un circuito è $\mathcal{E} = -\dfrac{\Delta\Phi}{\Delta t}$. In una bobina di $N$ spire uguali è $\mathcal{E} = -N \cdot \dfrac{\Delta\Phi}{\Delta t}$.

Il segno meno riguarda il verso della corrente: lo spiega la legge di Lenz, più avanti. Un weber al secondo è un volt. Se il circuito ha resistenza $R$, la corrente indotta è $I = \dfrac{\mathcal{E}}{R}$, come con una pila.

Esempio. Una bobina ha 200 spire ed è chiusa su una resistenza di 12 Ω. Il flusso in ogni spira passa da zero a 3 mWb in 0,1 s.

~ \mathcal{E} = -N \cdot \dfrac{\Delta\Phi}{\Delta t} :: la legge, con $N$ spire
~ \mathcal{E} = -200 \cdot \dfrac{0{,}003\,\text{Wb}}{0{,}1\,\text{s}} :: 3 mWb sono 0,003 Wb
~ \mathcal{E} = \evidb{-6\,\text{V}} :: weber al secondo fa volt
~ I = \dfrac{6\,\text{V}}{12\,\Omega} = 0{,}5\,\text{A} :: la corrente nella resistenza, in modulo

Nei due grafici una calamita entra in una spira in 2 s. Resta ferma 2 s, poi esce in 1 s. Dove il flusso sale, la f.e.m. è negativa. Dove scende, è positiva. Dove il flusso è piatto, la f.e.m. è zero.

[[grafico:flusso-tempo]]

[[grafico:fem-tempo]]

> La f.e.m. è la pendenza del grafico flusso–tempo, cambiata di segno. Chi conosce le derivate scrive $\mathcal{E} = -\dfrac{d\Phi}{dt}$: la f.e.m. in ogni istante.

La legge porta due nomi. Faraday scoprì il fenomeno nel 1831; il tedesco Franz Neumann lo scrisse in formula nel 1845.

>! Non conta quanto flusso c'è, ma quanto in fretta cambia. Un flusso grande e fermo dà f.e.m. zero.

?? Il flusso in una spira passa da 4 mWb a 1 mWb: una volta in 1 s, una volta in 0,1 s. Che cosa cambia?
[ ] niente: la variazione di flusso è la stessa
[x] la seconda volta la f.e.m. è dieci volte più grande
[ ] la seconda volta la f.e.m. è dieci volte più piccola
=> $\Delta\Phi$ è lo stesso, ma diviso per un tempo dieci volte più breve: la f.e.m. è dieci volte più grande.`
    },
    {
      id: 'fem-movimento',
      titolo: 'La sbarretta che scorre',
      testo: R`Il flusso può cambiare anche con un campo fermo e uniforme. Basta che cambi l'area del circuito.

Due rotaie di metallo parallele, distanti $\ell$, sono chiuse da una resistenza. Sopra scorre una sbarretta di metallo, a velocità $v$. Un campo uniforme $B$ è perpendicolare al piano delle rotaie. Sbarretta, rotaie e resistenza formano una spira che si allunga.

[[grafico:sbarretta]]

In un tempo $\Delta t$ la sbarretta avanza di $v \cdot \Delta t$. L'area della spira cresce di un rettangolo lungo $\ell$.

~ \Delta S = \ell \cdot v \cdot \Delta t :: l'area spazzata dalla sbarretta
~ \Delta\Phi = B \cdot \ell \cdot v \cdot \Delta t :: il campo è perpendicolare: $\alpha = 0$
~ |\mathcal{E}| = \dfrac{\Delta\Phi}{\Delta t} = \evidb{B \cdot \ell \cdot v} :: divido per $\Delta t$: il tempo sparisce

>* Una sbarretta lunga $\ell$ che si muove con velocità $v$ perpendicolare a un campo $B$ ha ai capi una **f.e.m. di movimento** $\mathcal{E} = B \cdot \ell \cdot v$.

La stessa formula viene dalla forza di Lorentz. Gli elettroni della sbarretta si muovono con lei dentro il campo. La forza magnetica li spinge lungo la sbarretta: è questa spinta che fa girare la corrente.

Esempio. Le rotaie distano 0,5 m, il campo vale 0,3 T, la sbarretta corre a 4 m/s. La resistenza è di 2 Ω.

~ \mathcal{E} = B \cdot \ell \cdot v :: la f.e.m. di movimento
~ \mathcal{E} = 0{,}3\,\text{T} \cdot 0{,}5\,\text{m} \cdot 4\,\text{m/s} :: metto i numeri con le unità
~ \mathcal{E} = \evidb{0{,}6\,\text{V}} :: tesla per metro per metro al secondo fa volt
~ I = \dfrac{0{,}6\,\text{V}}{2\,\Omega} = 0{,}3\,\text{A} :: la corrente nel circuito

>! Serve che la sbarretta tagli le linee di campo. Se si muovesse parallela al campo, il flusso non cambierebbe e la f.e.m. sarebbe zero.

?? La sbarretta si ferma, ma resta sulle rotaie dentro il campo. Che cosa succede alla corrente?
[ ] resta uguale, perché il campo c'è ancora
[x] si annulla
[ ] cambia verso
=> Con la sbarretta ferma l'area non cambia, quindi neanche il flusso: $\mathcal{E} = B \cdot \ell \cdot v = 0$.`
    },
    {
      id: 'lenz',
      titolo: 'La legge di Lenz',
      testo: R`Lascia cadere una calamita in un tubo verticale di rame. Il rame non è attirato dalle calamite, eppure la calamita scende piano.

[[video:induzione/lenz]]

Mentre la calamita cade, cambia il flusso negli anelli di rame del tubo. Nascono correnti indotte, e i loro campi magnetici frenano la calamita. Il verso di queste correnti segue una regola precisa.

>* **Legge di Lenz**: la corrente indotta ha il verso che si oppone alla variazione di flusso che l'ha prodotta. È il segno meno della legge di Faraday-Neumann.

Il verso si trova in tre passi.

1. Il flusso cresce o cala?
2. Se cresce, il campo della corrente indotta è opposto a quello esterno. Se cala, va nello stesso verso.
3. Dal campo indotto, con la regola della mano destra, si ricava il verso della corrente.

[[grafico:anello]]

Nel disegno il nord di una calamita sale verso un anello. Il flusso verso l'alto cresce, quindi il campo indotto punta in basso. Vista da sopra, la corrente gira in senso orario. La faccia di sotto dell'anello diventa un nord e respinge la calamita.

La legge di Lenz è la conservazione dell'energia. Se la corrente aiutasse la variazione, la calamita accelererebbe da sola: energia dal nulla. Torniamo alla sbarretta di prima: la corrente nel campo subisce una forza che la frena.

~ F = I \cdot \ell \cdot B :: la forza su un filo percorso da corrente
~ F = 0{,}3\,\text{A} \cdot 0{,}5\,\text{m} \cdot 0{,}3\,\text{T} :: i numeri della sbarretta
~ F = 0{,}045\,\text{N} :: contraria alla velocità
~ P = F \cdot v = \evidb{0{,}18\,\text{W}} :: chi spinge la sbarretta a 4 m/s
~ \mathcal{E} \cdot I = 0{,}6\,\text{V} \cdot 0{,}3\,\text{A} = 0{,}18\,\text{W} :: la stessa potenza scalda la resistenza

Le correnti indotte nascono anche in un pezzo di metallo pieno: si chiamano **correnti parassite**, o di Foucault. Frenano treni e montagne russe senza toccarli. Sul piano a induzione scaldano il fondo della pentola.

>! La corrente indotta non si oppone al campo, ma alla sua variazione. Se la calamita si allontana, l'anello la attira.

?? Allontani il nord di una calamita da un anello di rame. Che cosa fa l'anello?
[ ] la respinge, perché si oppone sempre alla calamita
[x] la attira
[ ] niente, perché la calamita si allontana
=> Il flusso cala, e la corrente indotta cerca di tenerlo: l'anello attira la calamita, frenandone l'allontanamento.`
    },
    {
      id: 'autoinduzione',
      titolo: 'L\'autoinduzione',
      testo: R`Una bobina percorsa da corrente è attraversata dal suo stesso campo magnetico. Se la corrente cambia, cambia anche questo flusso. Allora nella bobina nasce una f.e.m. indotta, che si oppone al cambiamento.

[[video:induzione/autoinduzione]]

Il flusso totale nelle spire della bobina è proporzionale alla corrente che le percorre.

>* L'**autoinduzione** è la f.e.m. indotta in un circuito dalla variazione della sua stessa corrente. Il flusso è $\Phi = L \cdot I$; la costante $L$ è l'**induttanza**, in **henry**: $1\,\text{H} = 1\,\text{Wb/A}$.

Dalla legge di Faraday-Neumann, la f.e.m. autoindotta è $\mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t}$.

Esempio. In una bobina da 0,2 H la corrente sale da zero a 3 A in 0,05 s.

~ \dfrac{\Delta I}{\Delta t} = \dfrac{3\,\text{A}}{0{,}05\,\text{s}} = 60\,\text{A/s} :: quanto in fretta cresce la corrente
~ \mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t} :: la f.e.m. autoindotta
~ \mathcal{E} = -0{,}2\,\text{H} \cdot 60\,\text{A/s} :: henry per ampere al secondo fa volt
~ \mathcal{E} = \evidb{-12\,\text{V}} :: il segno meno: frena la crescita

L'induttanza dipende solo da come è fatta la bobina. Per un solenoide lungo $\ell$, con $N$ spire di area $S$, il campo è $B = \mu_0 \cdot \dfrac{N}{\ell} \cdot I$. Da lì si ricava:

$$L = \mu_0 \cdot \dfrac{N^2 \cdot S}{\ell}$$

Il numero di spire compare al quadrato: spire doppie, induttanza quattro volte. Un nucleo di ferro la moltiplica per centinaia di volte.

Quando si apre un circuito con una bobina, la corrente deve sparire quasi di colpo. $\Delta I / \Delta t$ è enorme, e la f.e.m. può arrivare a migliaia di volt. Per questo fra i contatti salta una scintilla.

>! L'autoinduzione non si oppone alla corrente, ma alla sua variazione. Con la corrente costante la f.e.m. autoindotta è zero.

?? In una bobina da 0,5 H passa una corrente costante di 2 A. Quanto vale la f.e.m. autoindotta?
[ ] $1\,\text{V}$
[ ] $4\,\text{V}$
[x] zero
=> La corrente non cambia, quindi $\Delta I = 0$ e anche $\mathcal{E} = 0$. Conta quanto in fretta cambia la corrente, non quanto vale.`
    },
    {
      id: 'circuito-rl',
      titolo: 'Il circuito RL e l\'energia della bobina',
      testo: R`Collega in serie una bobina, una resistenza $R$ e una pila $\mathcal{E}$. Alla chiusura la corrente non salta subito al valore $\mathcal{E}/R$. La bobina si oppone alla crescita, e la corrente sale piano.

>* Nel **circuito RL**, dalla chiusura, la corrente è $I = \dfrac{\mathcal{E}}{R} \cdot \left(1 - e^{-t/\tau}\right)$, con la **costante di tempo** $\tau = \dfrac{L}{R}$. Dopo un tempo $\tau$ la corrente è al 63% del valore finale.

È la stessa curva della carica di un condensatore nel circuito RC. Con un'induttanza grande la bobina frena di più. Con una resistenza grande la corrente finale è piccola, e ci si arriva prima.

[[grafico:rl-corrente]]

Per far crescere la corrente, la pila lavora contro la f.e.m. autoindotta. Quel lavoro non va perso: resta nel campo magnetico della bobina. Una bobina di induttanza $L$ percorsa dalla corrente $I$ contiene l'energia

$U = \tfrac{1}{2} \cdot L \cdot I^2$

Per esempio, una bobina da 0,5 H percorsa da 4 A:

~ U = \tfrac{1}{2} \cdot L \cdot I^2 :: l'energia nella bobina
~ U = \tfrac{1}{2} \cdot 0{,}5\,\text{H} \cdot (4\,\text{A})^2 :: metto i numeri con le unità
~ U = \evidb{4\,\text{J}} :: henry per ampere al quadrato fa joule

All'apertura quell'energia deve andare da qualche parte: alimenta la scintilla fra i contatti. È come l'energia $\tfrac{1}{2} \cdot C \cdot V^2$ di un condensatore carico, che sta nel campo elettrico.

>! Dopo un tempo $\tau$ la corrente non è ancora arrivata al valore finale: è al 63%. Dopo circa $5 \cdot \tau$ la differenza non si vede più.

?? In un circuito RL la corrente finale è 10 A. Quanto vale la corrente dopo un tempo $\tau$ dalla chiusura?
[ ] 5 A, metà del valore finale
[x] circa 6,3 A
[ ] 10 A: è già arrivata
=> Con $t = \tau$ il fattore è $1 - e^{-1} \approx 0{,}63$: la corrente è al 63% di 10 A.`
    },
    {
      id: 'alternatore',
      titolo: 'L\'alternatore e la corrente alternata',
      testo: R`La corrente delle prese non va sempre nello stesso verso: lo cambia cento volte al secondo. È una **corrente alternata**, e la producono gli **alternatori** delle centrali.

Un alternatore è una bobina che gira con velocità angolare costante $\omega$ in un campo uniforme $B$. L'angolo fra il campo e la perpendicolare alle spire cresce in modo uniforme: $\alpha = \omega \cdot t$.

[[video:induzione/alternatore]]

~ \Phi = B \cdot S \cdot \cos\alpha :: il flusso in una spira
~ \Phi = B \cdot S \cdot \cos(\omega \cdot t) :: la spira gira: $\alpha = \omega \cdot t$
~ \mathcal{E} = \evidb{\mathcal{E}_0 \cdot \sin(\omega \cdot t)} :: la f.e.m. è la pendenza del coseno cambiata di segno: un seno, alto $N \cdot B \cdot S \cdot \omega$

>* Una bobina di $N$ spire di area $S$ ruota con velocità angolare $\omega$ in un campo uniforme $B$. Produce la f.e.m. alternata $\mathcal{E} = \mathcal{E}_0 \cdot \sin(\omega \cdot t)$, con $\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega$.

Il flusso è un coseno, la f.e.m. un seno. Quando il flusso è zero, la f.e.m. è massima in valore assoluto: è lì che il flusso cambia più in fretta. Quando il flusso è massimo, per un attimo non cambia, e la f.e.m. è zero.

[[grafico:seno-coseno]]

Il nostro è un alternatore a due poli. Per dare i 50 Hz delle prese deve fare 50 giri al secondo: $f = 50\,\text{Hz}$, periodo $T = 0{,}02\,\text{s}$. Una bobina di 100 spire da $0{,}01\,\text{m}^2$, in un campo di 0,2 T:

~ \omega = 2\pi \cdot 50\,\text{Hz} \approx 314\,\text{rad/s} :: la velocità angolare
~ \mathcal{E}_0 = N \cdot B \cdot S \cdot \omega :: il picco della f.e.m.
~ \mathcal{E}_0 = 100 \cdot 0{,}2\,\text{T} \cdot 0{,}01\,\text{m}^2 \cdot 314\,\text{s}^{-1} :: il radiante non ha unità
~ \mathcal{E}_0 \approx \evidb{62{,}8\,\text{V}} :: il valore più alto, due volte a ogni giro

Come si confronta una tensione che cambia di continuo con una costante? Si guarda il calore che produce in una resistenza.

>* Il **valore efficace** di una tensione sinusoidale è $V_{\text{eff}} = \dfrac{V_0}{\sqrt{2}}$: la tensione continua che scalda una resistenza allo stesso modo. Per la corrente vale $I_{\text{eff}} = \dfrac{I_0}{\sqrt{2}}$.

I 230 V delle prese sono un valore efficace; il picco è circa 325 V.

[[grafico:alternata]]

>! Il valore efficace non è la media. La media di un seno su un giro è zero: metà del tempo la tensione è positiva, metà negativa.

?? Il picco di una tensione alternata è 100 V. Quanto vale la tensione efficace?
[ ] 50 V
[x] circa 71 V
[ ] 141 V
=> Si divide il picco per $\sqrt{2}$: $100 / 1{,}414 \approx 71\,\text{V}$. Moltiplicare per $\sqrt{2}$ darebbe il contrario.`
    },
    {
      id: 'trasformatore',
      titolo: 'Il trasformatore',
      testo: R`Il campanello di casa funziona a pochi volt, le linee elettriche a centinaia di migliaia. A cambiare la tensione ci pensa il **trasformatore**.

È un anello di ferro con due bobine. Il **primario** è collegato alla tensione da trasformare, il **secondario** dà la tensione in uscita. Le due bobine non si toccano: le collega il flusso magnetico, che il ferro porta dall'una all'altra.

[[video:induzione/trasformatore]]

Una corrente che cambia nel primario induce una f.e.m. nel secondario. È la **mutua induzione**: $\mathcal{E}_2 = -M \cdot \dfrac{\Delta I_1}{\Delta t}$, con $M$ in henry. Qui $M$ è la mutua induttanza, non il momento di una forza. In continua il flusso è costante e il secondario non dà niente: il trasformatore funziona solo in alternata.

Ogni spira, del primario o del secondario, è attraversata dallo stesso flusso, e ha la stessa f.e.m. Le spire di una bobina sono in serie. Quindi ogni tensione è proporzionale al numero di spire.

>* In un trasformatore ideale $\dfrac{V_2}{V_1} = \dfrac{N_2}{N_1}$. La potenza si conserva, $V_1 \cdot I_1 = V_2 \cdot I_2$: se la tensione sale, la corrente scende nello stesso rapporto.

[[grafico:trasformatore]]

Esempio. Il trasformatore di un campanello ha 500 spire nel primario, collegato a 230 V, e 25 nel secondario. Il campanello assorbe 2 A.

~ V_2 = V_1 \cdot \dfrac{N_2}{N_1} :: le tensioni stanno come le spire
~ V_2 = 230\,\text{V} \cdot \dfrac{25}{500} :: venti volte meno spire nel secondario
~ V_2 = \evidb{11{,}5\,\text{V}} :: venti volte meno tensione
~ I_1 = 2\,\text{A} \cdot \dfrac{25}{500} = 0{,}1\,\text{A} :: la corrente sta al contrario delle spire

Per questo l'energia elettrica viaggia ad alta tensione. Nella corrente elettrica si è visto che i fili scaldano come $R \cdot I^2$. Vicino alla centrale un trasformatore alza la tensione, e la corrente nei fili diventa piccola. Vicino alle case altri trasformatori la riportano a 230 V.

>! Un trasformatore non crea energia. Se alza la tensione, abbassa la corrente: la potenza in uscita non supera quella in entrata.

?? Il secondario di un trasformatore ideale ha il triplo delle spire del primario. Che cosa succede alla corrente?
[ ] è il triplo di quella del primario
[x] è un terzo di quella del primario
[ ] è uguale: cambia solo la tensione
=> La tensione triplica, e la potenza resta la stessa: $V_1 \cdot I_1 = V_2 \cdot I_2$. Quindi la corrente nel secondario è un terzo.`
    }
  ],
  grafici: {
    /* la spira vista di taglio fra le linee di B: il flusso va con cos α */
    'flusso-angolo': {
      tipo: 'piano', x: [-4.6, 4.6], y: [-3.5, 3.0], assi: false, griglia: false,
      parametri: [{ nome: 'th', min: 0, max: 90, passo: 5, valore: 30, etichetta: 'α (gradi)' }],
      elementi: [
        { tipo: 'vettore', da: [-4.4, 2.4], a: [4.4, 2.4], etichetta: 'B', colore: 3 },
        { tipo: 'vettore', da: [-4.4, 1.2], a: [4.4, 1.2], colore: 3 },
        { tipo: 'vettore', da: [-4.4, 0], a: [4.4, 0], colore: 3 },
        { tipo: 'vettore', da: [-4.4, -1.2], a: [4.4, -1.2], colore: 3 },
        { tipo: 'vettore', da: [-4.4, -2.4], a: [4.4, -2.4], colore: 3 },
        { tipo: 'segmento', da: [0, 0], a: ['2*cos(th*pi/180)', '2*sin(th*pi/180)'], colore: 'grigio', tratteggio: true },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(th*pi/180)', 'sin(th*pi/180)'], raggio: 0.9, etichetta: 'α', colore: 'grigio' },
        { tipo: 'segmento', da: ['1.8*sin(th*pi/180)', '-1.8*cos(th*pi/180)'], a: ['-1.8*sin(th*pi/180)', '1.8*cos(th*pi/180)'], colore: 'grigio' },
        { tipo: 'punto', p: ['1.8*sin(th*pi/180)', '-1.8*cos(th*pi/180)'], colore: 'grigio' },
        { tipo: 'punto', p: ['-1.8*sin(th*pi/180)', '1.8*cos(th*pi/180)'], colore: 'grigio' },
        { tipo: 'testo', p: [0, -3.15], testo: 'Φ = {{100*cos(th*pi/180)|0}}% del massimo', colore: 3 }
      ],
      didascalia: 'La spira vista di taglio (il segmento grigio con i due pallini) fra le linee di un campo uniforme B. Il tratteggio è la perpendicolare alla spira; α è l\'angolo fra B e la perpendicolare. Con α = 0 la spira raccoglie tutte le linee, con α = 90° nessuna: Φ = B·S·cos α. Sposta il cursore per girare la spira.'
    },
    /* una calamita entra in 2 s, resta ferma, esce in 1 s: il flusso in una spira */
    'flusso-tempo': {
      tipo: 'orario', grandezza: 'Φ', unita: 'mWb', t: [0, 7], y: [0, 2.4], passo: [1, 0.5],
      funzioni: [
        { f: 't', dominio: [0, 2], colore: 3 },
        { f: '2', dominio: [2, 4], colore: 3 },
        { f: '2 - 2*(t - 4)', dominio: [4, 5], colore: 3 },
        { f: '0', dominio: [5, 7], colore: 3 }
      ],
      elementi: [
        { tipo: 'testo', p: [1.3, 0.5], testo: 'entra', ancora: 'start' },
        { tipo: 'testo', p: [3, 1.7], testo: 'ferma' },
        { tipo: 'testo', p: [5.0, 1.0], testo: 'esce', ancora: 'start' }
      ],
      didascalia: 'Il flusso in una spira mentre una calamita entra: 2 mWb in 2 s. Poi la calamita resta ferma per 2 s ed esce: 2 mWb in 1 s. Passa il dito sul grafico per leggere i valori.'
    },
    /* la f.e.m. dello stesso moto: meno la pendenza del grafico di sopra */
    'fem-tempo': {
      tipo: 'orario', grandezza: 'ℰ', unita: 'mV', t: [0, 7], y: [-1.6, 2.4], passo: [1, 1],
      funzioni: [
        { f: '-1', dominio: [0, 2], colore: 2 },
        { f: '0', dominio: [2, 4], colore: 2 },
        { f: '2', dominio: [4, 5], colore: 2 },
        { f: '0', dominio: [5, 7], colore: 2 }
      ],
      elementi: [
        { tipo: 'testo', p: [1, -1.38], testo: 'ℰ = −1 mV', colore: 2 },
        { tipo: 'testo', p: [4.5, 1.65], testo: 'ℰ = 2 mV', colore: 2 },
        { tipo: 'testo', p: [3, 0.3], testo: 'zero' }
      ],
      didascalia: 'La f.e.m. indotta nella stessa spira: ℰ = −ΔΦ/Δt. Mentre la calamita entra il flusso sale di 1 mWb al secondo e ℰ = −1 mV; mentre esce scende due volte più in fretta e ℰ = +2 mV; con la calamita ferma, zero.'
    },
    /* la sbarretta sulle rotaie: il campo entra nel foglio, la corrente gira in senso antiorario */
    sbarretta: {
      tipo: 'piano', x: [-1.0, 8.2], y: [-1.5, 4.3], assi: false, griglia: false,
      parametri: [{ nome: 'v', min: 1, max: 8, passo: 1, valore: 4, etichetta: 'v (m/s)' }],
      elementi: [
        rettangolo(0, 0, 5.5, 3, true),
        filo([0, 3], [7.2, 3]), filo([0, 0], [7.2, 0]),
        filo([0, 0], [0, 0.85]), filo([0, 2.15], [0, 3]),
        rettangolo(-0.25, 0.85, 0.25, 2.15, false),
        { tipo: 'segmento', da: [5.5, -0.3], a: [5.5, 3.3], colore: 'grigio' },
        { tipo: 'entrante', da: [1, 0.5], a: [4, 2.5], passo: 1, colore: 3 },
        { tipo: 'vettore', da: [5.5, 0.9], a: [5.5, 2.1], etichetta: 'I', posizione: 'destra', colore: 4 },
        { tipo: 'vettore', da: [3, 3], a: [2, 3], etichetta: 'I', posizione: 'destra', colore: 4 },
        { tipo: 'vettore', da: [5.5, 3.75], a: [4.3, 3.75], etichetta: 'F', colore: 2 },
        { tipo: 'vettore', da: [5.5, -0.65], a: ['5.5 + 0.3*v', -0.65], etichetta: 'v', posizione: 'destra', colore: 1 },
        { tipo: 'segmento', da: [7.45, 0], a: [7.45, 3], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [7.95, 1.5], testo: 'ℓ = 0,5 m', rotazione: 90 },
        { tipo: 'testo', p: [-0.45, 1.5], testo: 'R', ancora: 'end' },
        { tipo: 'testo', p: [-0.9, -0.85], testo: 'ℰ = B·l·v = {{0.15*v|2}} V', ancora: 'start', colore: 2 },
        { tipo: 'testo', p: [-0.9, -1.35], testo: 'I = {{0.075*v|2}} A', ancora: 'start', colore: 4 }
      ],
      didascalia: 'Rotaie distanti 0,5 m (la lunghezza l della sbarretta), chiuse da R = 2 Ω. Sono in un campo B = 0,3 T che entra nel foglio (⊗). La sbarretta corre verso destra e la zona grigia, la spira, si allarga. La corrente indotta I gira in senso antiorario, e il campo frena la sbarretta con la forza F. Sposta il cursore per cambiare la velocità.'
    },
    /* il nord che sale verso l'anello: il campo indotto (tratteggio) punta in basso, la corrente gira in senso orario vista da sopra */
    anello: {
      tipo: 'piano', x: [-3, 3.4], y: [-4.0, 3.2], assi: false, griglia: false, altezza: 600,
      elementi: [
        { tipo: 'ellisse', centro: [0, 1.4], a: 2, b: 0.5, colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.55, -2.3], [0.55, -2.3], [0.55, -0.9], [-0.55, -0.9]], colore: 'polo-n', pieno: true },
        { tipo: 'poligono', punti: [[-0.55, -3.7], [0.55, -3.7], [0.55, -2.3], [-0.55, -2.3]], colore: 'polo-s', pieno: true },
        { tipo: 'testo', p: [0, -1.85], testo: 'N', classe: 'cg-polo-n' },
        { tipo: 'testo', p: [0, -3.25], testo: 'S', classe: 'cg-polo-s' },
        { tipo: 'vettore', da: [0, -0.6], a: [0, 2.7], etichetta: 'B', colore: 3 },
        { tipo: 'segmento', da: [-1.0, 2.5], a: [-1.0, 0.3], colore: 3, tratteggio: true, freccia: true },
        { tipo: 'testo', p: [-1.25, 2.3], testo: 'B_{ind}', ancora: 'end', colore: 3 },
        { tipo: 'vettore', da: [1.5, 1.07], a: [0.6, 0.93], etichetta: 'I', colore: 4 },
        { tipo: 'uscente', p: [2, 1.4], colore: 4 },
        { tipo: 'entrante', p: [-2, 1.4], colore: 4 },
        { tipo: 'testo', p: [2.35, 2.1], testo: 'anello', ancora: 'start' },
        { tipo: 'vettore', da: [1.3, -3.4], a: [1.3, -1.6], etichetta: 'v', colore: 1 }
      ],
      didascalia: 'Una calamita sale con il nord verso un anello di rame. Il suo campo B attraversa l\'anello verso l\'alto, e il flusso cresce. La corrente indotta I crea un campo verso il basso (la freccia tratteggiata): a destra esce dal foglio (⊙), a sinistra entra (⊗). Vista da sopra gira in senso orario, e l\'anello respinge la calamita.'
    },
    /* la corrente in un circuito RL: pila da 9 V, R = 3 Ω, induttanza da scegliere */
    'rl-corrente': {
      tipo: 'orario', grandezza: 'I', unita: 'A', t: [0, 3], y: [0, 3.6],
      parametri: [{ nome: 'L', min: 0.3, max: 3, passo: 0.3, valore: 1.2, decimali: 1, etichetta: 'L (H)' }],
      funzioni: [{ f: '3*(1 - exp(-3*t/L))', colore: 4 }],
      elementi: [
        { tipo: 'orizzontale', y: 3, colore: 'grigio', tratteggio: true, etichetta: 'ℰ / R = 3 A' },
        { tipo: 'verticale', x: 'L/3', colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['L/3', 1.896], etichetta: '63%', posizione: 'basso-destra', colore: 4 },
        { tipo: 'testo', p: ['L/3 + 0.08', 0.3], testo: 'τ = L / R = {{L/3}} s', ancora: 'start' }
      ],
      didascalia: 'Una pila da 9 V, una resistenza da 3 Ω e una bobina. Alla chiusura la corrente sale piano verso ℰ/R = 3 A; dopo un tempo τ = L/R è al 63%. Con L doppia la salita è due volte più lenta, ma la corrente finale è la stessa. Sposta il cursore per cambiare l\'induttanza.'
    },
    /* il flusso è un coseno, la f.e.m. un seno: uno è zero dove l'altro è massimo */
    'seno-coseno': {
      tipo: 'piano', x: [0, 400], y: [-1.3, 1.4], proporzioni: 'libere', passo: [90, 0.5], altezza: 400,
      etichette: { x: 'α (°)', y: ' ' },
      parametri: [{ nome: 'th', min: 0, max: 360, passo: 15, valore: 30, etichetta: 'α = ω·t (gradi)' }],
      funzioni: [
        { f: 'cos(x*pi/180)', colore: 3, dominio: [0, 360] },
        { f: 'sin(x*pi/180)', colore: 2, dominio: [0, 360] }
      ],
      elementi: [
        { tipo: 'verticale', x: 'th', colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['th', 'cos(th*pi/180)'], colore: 3 },
        { tipo: 'punto', p: ['th', 'sin(th*pi/180)'], colore: 2 },
        { tipo: 'testo', p: [345, 1.13], testo: 'Φ', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [90, 1.13], testo: 'ℰ', colore: 2 }
      ],
      didascalia: 'Il flusso Φ (verde) e la f.e.m. ℰ (arancio) di una spira che gira, ciascuno diviso per il suo valore massimo. A 90° e a 270° il flusso è zero e la f.e.m. è massima in valore assoluto (a 270° negativa); a 0° e a 180° il flusso è massimo e la f.e.m. è zero. Sposta il cursore per girare la spira.'
    },
    /* la f.e.m. di un alternatore con N·B·S = 0,2 Wb: più giri al secondo, picco più alto e oscillazioni più fitte */
    alternata: {
      tipo: 'orario', grandezza: 'ℰ', unita: 'V', unitaTempo: 'ms', t: [0, 40], y: [-160, 175],
      parametri: [{ nome: 'f', min: 25, max: 100, passo: 5, valore: 50, etichetta: 'f (Hz)' }],
      funzioni: [{ f: '0.4*pi*f*sin(2*pi*f*t/1000)', colore: 2 }],
      elementi: [
        { tipo: 'orizzontale', y: '0.4*pi*f/sqrt(2)', colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [39.5, 155], testo: 'ℰ_0 = {{0.4*pi*f|0}} V', ancora: 'end', colore: 2 }
      ],
      didascalia: 'La f.e.m. di una bobina di 100 spire da 0,01 m² in un campo di 0,2 T, in 40 millesimi di secondo. Il picco è ℰ₀ = N·B·S·2π·f: girando più in fretta cresce, e le oscillazioni si stringono. Il tratteggio è il valore efficace, ℰ₀/√2. Sposta il cursore per cambiare la frequenza.'
    },
    /* il trasformatore: 8 spire nel primario, 4 nel secondario, il flusso che gira nel ferro */
    trasformatore: {
      tipo: 'piano', x: [-5.2, 5.2], y: [-3.1, 3.3], assi: false, griglia: false,
      elementi: [
        rettangolo(-3, -2.4, 3, 2.4, false),
        rettangolo(-1.8, -1.2, 1.8, 1.2, false)
      ].concat(spire(-3.3, -1.5, -1.75, 8, 0.45, 4), spire(1.5, 3.3, -0.85, 4, 0.45, 4), [
        filo([-3.3, -1.75], [-4.4, -1.75]), filo([-3.3, 1.4], [-4.4, 1.4]),
        filo([3.3, -0.67], [4.4, -0.67]), filo([3.3, 0.68], [4.4, 0.68]),
        { tipo: 'testo', p: [-4.6, -0.1], testo: 'V_1', ancora: 'end', colore: 2 },
        { tipo: 'testo', p: [4.6, 0.1], testo: 'V_2', ancora: 'start', colore: 2 },
        { tipo: 'testo', p: [-2.4, 2.75], testo: 'N_1 = 8' },
        { tipo: 'testo', p: [2.4, 2.75], testo: 'N_2 = 4' },
        { tipo: 'testo', p: [-2.4, -2.95], testo: 'primario' },
        { tipo: 'testo', p: [2.4, -2.95], testo: 'secondario' },
        { tipo: 'vettore', da: [-0.9, 1.8], a: [0.9, 1.8], etichetta: 'Φ', colore: 3 },
        { tipo: 'vettore', da: [0.9, -1.8], a: [-0.9, -1.8], etichetta: 'Φ', colore: 3 }
      ]),
      didascalia: 'Un anello di ferro con due bobine: 8 spire nel primario, 4 nel secondario. Il flusso Φ gira nel ferro e attraversa tutte le spire. Il secondario ha metà delle spire, quindi dà metà della tensione: V₂ = V₁·N₂/N₁.'
    }
  },
  esempi: [
    {
      titolo: 'La calamita nella bobina',
      problema: R`Una bobina di 250 spire è collegata a un circuito con resistenza totale di 5 Ω. Avvicinando una calamita, il flusso in ogni spira passa da 0,2 mWb a 1,4 mWb in 0,3 s. Quanto valgono la f.e.m. media e la corrente? E se poi la calamita torna indietro in 0,6 s?`,
      passi: [
        R`Dati: $N = 250$, $R = 5\,\Omega$, $\Phi_1 = 0{,}2\,\text{mWb}$, $\Phi_2 = 1{,}4\,\text{mWb}$, $\Delta t = 0{,}3\,\text{s}$. Cerco $\mathcal{E}$ e $I$, all'andata e al ritorno.`,
        R`La variazione di flusso in ogni spira: $\Delta\Phi = 1{,}4\,\text{mWb} - 0{,}2\,\text{mWb} = 1{,}2\,\text{mWb}$, cioè $1{,}2 \cdot 10^{-3}\,\text{Wb}$.`,
        R`Faraday-Neumann: $\mathcal{E} = -N \cdot \dfrac{\Delta\Phi}{\Delta t} = -250 \cdot \dfrac{1{,}2 \cdot 10^{-3}\,\text{Wb}}{0{,}3\,\text{s}} = -1\,\text{V}$.`,
        R`La corrente, in modulo: $I = \dfrac{1\,\text{V}}{5\,\Omega} = 0{,}2\,\text{A}$.`,
        R`Al ritorno il flusso cala della stessa quantità, in un tempo doppio: $\mathcal{E} = -250 \cdot \dfrac{-1{,}2 \cdot 10^{-3}\,\text{Wb}}{0{,}6\,\text{s}} = +0{,}5\,\text{V}$, e $I = 0{,}1\,\text{A}$.`,
        R`Controllo: segno opposto, quindi corrente nel verso opposto, come nell'esperimento. Tempo doppio, f.e.m. dimezzata. Torna.`
      ],
      risultato: R`All'andata $\mathcal{E} = -1\,\text{V}$ e $I = 0{,}2\,\text{A}$; al ritorno $\mathcal{E} = +0{,}5\,\text{V}$ e $I = 0{,}1\,\text{A}$, nell'altro verso.`
    },
    {
      titolo: 'Il campo che si spegne',
      problema: R`Una spira circolare di raggio 6 cm e resistenza 0,5 Ω è perpendicolare a un campo di 0,8 T. Il campo esce dal foglio e cala in modo uniforme fino a zero in 0,4 s. Quanto vale la corrente indotta? In che verso gira?`,
      passi: [
        R`Dati: $r = 6\,\text{cm} = 0{,}06\,\text{m}$, $R = 0{,}5\,\Omega$, $B$ da $0{,}8\,\text{T}$ a zero, $\Delta t = 0{,}4\,\text{s}$, $\alpha = 0$. Cerco $I$ e il suo verso.`,
        R`L'area della spira: $S = \pi \cdot r^2 = \pi \cdot (0{,}06\,\text{m})^2 \approx 0{,}0113\,\text{m}^2$.`,
        R`Il flusso iniziale: $\Phi = B \cdot S = 0{,}8\,\text{T} \cdot 0{,}0113\,\text{m}^2 \approx 9{,}05 \cdot 10^{-3}\,\text{Wb}$. Alla fine è zero.`,
        R`La f.e.m., in modulo: $|\mathcal{E}| = \dfrac{9{,}05 \cdot 10^{-3}\,\text{Wb}}{0{,}4\,\text{s}} \approx 22{,}6\,\text{mV}$.`,
        R`La corrente: $I = \dfrac{22{,}6\,\text{mV}}{0{,}5\,\Omega} \approx 45\,\text{mA}$.`,
        R`Il verso, con Lenz: il flusso cala, quindi il campo indotto ha lo stesso verso di quello esterno e prova a sostenerlo. Con la mano destra, il pollice verso chi guarda: la corrente gira in senso antiorario.`
      ],
      risultato: R`$I \approx 45\,\text{mA}$, in senso antiorario: il campo indotto esce dal foglio come quello che si spegne.`
    },
    {
      titolo: 'Le ali di un aereo',
      problema: R`Un aereo con un'apertura alare di 60 m vola in orizzontale a 240 m/s. La componente verticale del campo magnetico terrestre vale $4 \cdot 10^{-5}\,\text{T}$. Quanto vale la f.e.m. fra le punte delle ali?`,
      passi: [
        R`Dati: $\ell = 60\,\text{m}$, $v = 240\,\text{m/s}$, $B = 4 \cdot 10^{-5}\,\text{T}$ (la componente perpendicolare al moto e alle ali). Cerco $\mathcal{E}$.`,
        R`Le ali sono una sbarretta di metallo che taglia le linee del campo verticale: f.e.m. di movimento.`,
        R`$\mathcal{E} = B \cdot \ell \cdot v = 4 \cdot 10^{-5}\,\text{T} \cdot 60\,\text{m} \cdot 240\,\text{m/s}$.`,
        R`Faccio il conto: $4 \cdot 60 \cdot 240 = 57\,600$, quindi $\mathcal{E} = 57\,600 \cdot 10^{-5}\,\text{V} \approx 0{,}58\,\text{V}$.`,
        R`Non passa nessuna corrente. Un filo che collegasse le punte viaggerebbe con l'aereo, e avrebbe la stessa f.e.m. in senso opposto nel circuito.`
      ],
      risultato: R`$\mathcal{E} \approx 0{,}58\,\text{V}$, ma nessuna corrente.`
    },
    {
      titolo: 'La scintilla di una bobina',
      problema: R`Un solenoide in aria è lungo 40 cm, ha 800 spire e sezione di 5 cm². Ci passano 3 A. Aprendo l'interruttore, la corrente si annulla in 0,4 ms. Quanto vale l'induttanza? Che f.e.m. media nasce? Quanta energia c'era nella bobina?`,
      passi: [
        R`Dati: $\ell = 0{,}40\,\text{m}$, $N = 800$, $S = 5\,\text{cm}^2 = 5 \cdot 10^{-4}\,\text{m}^2$, $I = 3\,\text{A}$, $\Delta t = 0{,}4\,\text{ms}$. Cerco $L$, $\mathcal{E}$ e l'energia $U$.`,
        R`Induttanza: $L = \mu_0 \cdot \dfrac{N^2 \cdot S}{\ell}$.`,
        R`$L = 4\pi \cdot 10^{-7} \cdot \dfrac{640\,000 \cdot 5 \cdot 10^{-4}}{0{,}40}\,\text{H} \approx 1{,}0 \cdot 10^{-3}\,\text{H}$.`,
        R`Rapidità della corrente: $\dfrac{\Delta I}{\Delta t} = \dfrac{-3\,\text{A}}{4 \cdot 10^{-4}\,\text{s}} = -7500\,\text{A/s}$.`,
        R`La f.e.m.: $\mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t} \approx -1{,}0 \cdot 10^{-3}\,\text{H} \cdot (-7500\,\text{A/s}) \approx +7{,}5\,\text{V}$. Positiva: prova a mantenere la corrente.`,
        R`L'energia: $U = \tfrac{1}{2} \cdot L \cdot I^2 \approx \tfrac{1}{2} \cdot 1{,}0 \cdot 10^{-3}\,\text{H} \cdot (3\,\text{A})^2 \approx 4{,}5 \cdot 10^{-3}\,\text{J}$.`,
        R`Con un nucleo di ferro l'induttanza sarebbe centinaia di volte più grande, e così la f.e.m.: ecco la scintilla.`
      ],
      risultato: R`$L \approx 1{,}0\,\text{mH}$, $\mathcal{E} \approx 7{,}5\,\text{V}$, $U \approx 4{,}5\,\text{mJ}$.`
    },
    {
      titolo: 'Un piccolo alternatore',
      problema: R`Una bobina ha 200 spire rettangolari di 5 cm per 8 cm. Gira a 1500 giri al minuto in un campo uniforme di 0,3 T. Quanto vale il picco della f.e.m.? E il valore efficace?`,
      passi: [
        R`Dati: $N = 200$, $S = 5\,\text{cm} \cdot 8\,\text{cm}$, $B = 0{,}3\,\text{T}$, 1500 giri al minuto. Cerco $\mathcal{E}_0$ e $\mathcal{E}_{\text{eff}}$.`,
        R`L'area in metri quadrati: $S = 0{,}05\,\text{m} \cdot 0{,}08\,\text{m} = 4 \cdot 10^{-3}\,\text{m}^2$.`,
        R`La frequenza: $f = \dfrac{1500}{60}\,\text{Hz} = 25\,\text{Hz}$, cioè 25 giri al secondo.`,
        R`La velocità angolare: $\omega = 2\pi \cdot f = 2\pi \cdot 25\,\text{Hz} \approx 157\,\text{rad/s}$.`,
        R`Il picco: $\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega$, cioè $\mathcal{E}_0 = 200 \cdot 0{,}3\,\text{T} \cdot 4 \cdot 10^{-3}\,\text{m}^2 \cdot 157\,\text{rad/s} \approx 37{,}7\,\text{V}$.`,
        R`Il valore efficace: $\mathcal{E}_{\text{eff}} = \dfrac{37{,}7\,\text{V}}{\sqrt{2}} \approx 26{,}7\,\text{V}$.`
      ],
      risultato: R`$\mathcal{E}_0 \approx 37{,}7\,\text{V}$, valore efficace $\approx 26{,}7\,\text{V}$.`
    },
    {
      titolo: 'La lampada alogena',
      problema: R`Una lampada alogena da 50 W funziona a 12 V. Il suo trasformatore ha 1150 spire nel primario, collegato a 230 V. Quante spire servono nel secondario? Quali correnti passano nelle due bobine, se il trasformatore è ideale?`,
      passi: [
        R`Dati: $V_1 = 230\,\text{V}$, $V_2 = 12\,\text{V}$, $N_1 = 1150$, $P = 50\,\text{W}$. Cerco $N_2$, $I_1$ e $I_2$.`,
        R`Le spire stanno come le tensioni: $N_2 = N_1 \cdot \dfrac{V_2}{V_1} = 1150 \cdot \dfrac{12}{230} = 60$.`,
        R`Nel secondario: $I_2 = \dfrac{P}{V_2} = \dfrac{50\,\text{W}}{12\,\text{V}} \approx 4{,}17\,\text{A}$.`,
        R`Nel primario la potenza è la stessa: $I_1 = \dfrac{P}{V_1} = \dfrac{50\,\text{W}}{230\,\text{V}} \approx 0{,}217\,\text{A}$.`,
        R`Controllo con il rapporto delle spire: $I_1 = I_2 \cdot \dfrac{N_2}{N_1} = 4{,}17 \cdot \dfrac{60}{1150} \approx 0{,}217\,\text{A}$. Torna.`
      ],
      risultato: R`$N_2 = 60$; $I_2 \approx 4{,}17\,\text{A}$ e $I_1 \approx 0{,}217\,\text{A}$.`
    }
  ],
  formulario: [
    { nome: 'Flusso del campo magnetico', formula: R`\Phi = B \cdot S \cdot \cos\alpha`, nota: R`$\alpha$ è l'angolo fra $B$ e la perpendicolare alla superficie. In weber: $1\,\text{Wb} = 1\,\text{T} \cdot \text{m}^2$.` },
    { nome: 'Legge di Faraday-Neumann', formula: R`\mathcal{E} = -\dfrac{\Delta\Phi}{\Delta t} \qquad \mathcal{E} = -N \cdot \dfrac{\Delta\Phi}{\Delta t}`, nota: R`La seconda per una bobina di $N$ spire. La corrente indotta è $I = \mathcal{E}/R$.` },
    { nome: 'Legge di Lenz', formula: R`\text{segno meno: si oppone a } \Delta\Phi`, nota: R`La corrente indotta si oppone alla variazione di flusso che l'ha prodotta, non al campo.` },
    { nome: 'f.e.m. di movimento', formula: R`\mathcal{E} = B \cdot \ell \cdot v`, nota: R`Sbarretta lunga $\ell$ che si muove con velocità $v$ perpendicolare al campo $B$.` },
    { nome: 'Autoinduzione', formula: R`\Phi = L \cdot I \qquad \mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t}`, nota: R`$L$ induttanza, in henry: $1\,\text{H} = 1\,\text{Wb/A}$.` },
    { nome: 'Induttanza di un solenoide', formula: R`L = \mu_0 \cdot \dfrac{N^2 \cdot S}{\ell}`, nota: R`In aria; $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$. Un nucleo di ferro la moltiplica.` },
    { nome: 'Circuito RL alla chiusura', formula: R`I = \dfrac{\mathcal{E}}{R} \cdot \left(1 - e^{-t/\tau}\right)`, nota: R`Costante di tempo $\tau = L/R$: dopo $\tau$ la corrente è al 63% del valore finale.` },
    { nome: 'Energia in una bobina', formula: R`U = \tfrac{1}{2} \cdot L \cdot I^2`, nota: R`In joule. È immagazzinata nel campo magnetico.` },
    { nome: 'f.e.m. di un alternatore', formula: R`\mathcal{E} = \mathcal{E}_0 \cdot \sin(\omega \cdot t)`, nota: R`Bobina che ruota con velocità angolare $\omega$ in un campo uniforme.` },
    { nome: 'Picco della f.e.m. alternata', formula: R`\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega`, nota: R`$N$ spire di area $S$; con $\omega$ in rad/s si ottengono volt.` },
    { nome: 'Pulsazione e periodo', formula: R`\omega = 2\pi \cdot f \qquad T = \dfrac{1}{f}`, nota: R`Nelle prese europee $f = 50\,\text{Hz}$, $T = 0{,}02\,\text{s}$.` },
    { nome: 'Valori efficaci', formula: R`V_{\text{eff}} = \dfrac{V_0}{\sqrt{2}} \qquad I_{\text{eff}} = \dfrac{I_0}{\sqrt{2}}`, nota: R`Solo per grandezze sinusoidali. Le prese danno 230 V efficaci, circa 325 V di picco.` },
    { nome: 'Mutua induzione', formula: R`\mathcal{E}_2 = -M \cdot \dfrac{\Delta I_1}{\Delta t}`, nota: R`La corrente che cambia nel primario induce una f.e.m. nel secondario. $M$ in henry.` },
    { nome: 'Trasformatore ideale', formula: R`\dfrac{V_2}{V_1} = \dfrac{N_2}{N_1} \qquad V_1 \cdot I_1 = V_2 \cdot I_2`, nota: R`Solo in alternata. Se la tensione sale, la corrente scende nello stesso rapporto.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'corrente-indotta', tipo: 'definizione', fronte: R`Che cos'è l'**induzione elettromagnetica**?`, retro: R`La nascita di una corrente in un circuito chiuso mentre cambia il campo magnetico che lo attraversa.` },
    { id: 'fc-02', sezione: 'corrente-indotta', tipo: 'concetto', fronte: R`Una calamita ferma dentro una bobina fa passare corrente?`, retro: R`No. La corrente indotta c'è solo mentre il campo cambia: quando la calamita entra o esce.` },
    { id: 'fc-03', sezione: 'flusso', tipo: 'formula', fronte: R`Formula del **flusso** del campo magnetico attraverso una spira`, retro: R`$\Phi = B \cdot S \cdot \cos\alpha$, con $\alpha$ l'angolo fra $B$ e la perpendicolare alla spira.` },
    { id: 'fc-04', sezione: 'flusso', tipo: 'definizione', fronte: R`Che cos'è il **weber**?`, retro: R`L'unità del flusso magnetico: $1\,\text{Wb} = 1\,\text{T} \cdot \text{m}^2$.` },
    { id: 'fc-05', sezione: 'flusso', tipo: 'concetto', fronte: R`In quali tre modi può cambiare il flusso in una spira?`, retro: R`Cambiando il campo $B$, l'area $S$ o l'angolo $\alpha$ (la spira che gira).` },
    { id: 'fc-06', sezione: 'faraday-neumann', tipo: 'formula', fronte: R`**Legge di Faraday-Neumann**`, retro: R`$\mathcal{E} = -\dfrac{\Delta\Phi}{\Delta t}$; per $N$ spire $\mathcal{E} = -N \cdot \dfrac{\Delta\Phi}{\Delta t}$.` },
    { id: 'fc-07', sezione: 'faraday-neumann', tipo: 'concetto', fronte: R`La f.e.m. indotta dipende da quanto flusso c'è?`, retro: R`No: dipende da quanto in fretta il flusso cambia. Un flusso grande e costante dà f.e.m. zero.` },
    { id: 'fc-08', sezione: 'faraday-neumann', tipo: 'concetto', fronte: R`Nel grafico flusso–tempo, dove si legge la f.e.m.?`, retro: R`Nella pendenza, cambiata di segno. Tratto piatto: f.e.m. zero.` },
    { id: 'fc-09', sezione: 'fem-movimento', tipo: 'formula', fronte: R`f.e.m. ai capi di una **sbarretta** che si muove in un campo`, retro: R`$\mathcal{E} = B \cdot \ell \cdot v$, con $v$ perpendicolare a $B$ e alla sbarretta.` },
    { id: 'fc-10', sezione: 'fem-movimento', tipo: 'concetto', fronte: R`Da dove viene la f.e.m. di una sbarretta che si muove nel campo?`, retro: R`Dalla forza di Lorentz sugli elettroni che si muovono con lei; oppure dall'area del circuito che cresce.` },
    { id: 'fc-11', sezione: 'lenz', tipo: 'definizione', fronte: R`Che cosa dice la **legge di Lenz**?`, retro: R`La corrente indotta ha il verso che si oppone alla variazione di flusso che l'ha prodotta.` },
    { id: 'fc-12', sezione: 'lenz', tipo: 'procedura', fronte: R`Come si trova il verso di una corrente indotta?`, retro: R`Il flusso cresce o cala? Se cresce, il campo indotto è opposto a quello esterno; se cala, concorde. Poi la mano destra.` },
    { id: 'fc-13', sezione: 'lenz', tipo: 'concetto', fronte: R`Perché la legge di Lenz non può andare al contrario?`, retro: R`Perché la corrente indotta aiuterebbe la variazione: il moto accelererebbe da solo, energia dal nulla.` },
    { id: 'fc-14', sezione: 'lenz', tipo: 'definizione', fronte: R`Che cosa sono le **correnti parassite** (di Foucault)?`, retro: R`Correnti indotte in un pezzo di metallo pieno. Frenano i treni e scaldano le pentole sul piano a induzione.` },
    { id: 'fc-15', sezione: 'autoinduzione', tipo: 'definizione', fronte: R`Che cos'è l'**autoinduzione**?`, retro: R`La f.e.m. indotta in un circuito dalla variazione della sua stessa corrente: $\mathcal{E} = -L \cdot \dfrac{\Delta I}{\Delta t}$.` },
    { id: 'fc-16', sezione: 'autoinduzione', tipo: 'definizione', fronte: R`Che cos'è l'**induttanza** e come si misura?`, retro: R`La costante $L$ in $\Phi = L \cdot I$. Si misura in henry: $1\,\text{H} = 1\,\text{Wb/A}$.` },
    { id: 'fc-17', sezione: 'autoinduzione', tipo: 'formula', fronte: R`Induttanza di un **solenoide**`, retro: R`$L = \mu_0 \cdot \dfrac{N^2 \cdot S}{\ell}$: spire doppie, induttanza quattro volte.` },
    { id: 'fc-18', sezione: 'circuito-rl', tipo: 'formula', fronte: R`**Costante di tempo** di un circuito RL`, retro: R`$\tau = \dfrac{L}{R}$. Dopo un tempo $\tau$ dalla chiusura la corrente è al 63% del valore finale.` },
    { id: 'fc-19', sezione: 'circuito-rl', tipo: 'formula', fronte: R`Energia immagazzinata in una bobina`, retro: R`$U = \tfrac{1}{2} \cdot L \cdot I^2$, nel suo campo magnetico.` },
    { id: 'fc-20', sezione: 'alternatore', tipo: 'formula', fronte: R`f.e.m. di una bobina che ruota in un campo uniforme`, retro: R`$\mathcal{E} = \mathcal{E}_0 \cdot \sin(\omega \cdot t)$, con $\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega$.` },
    { id: 'fc-21', sezione: 'alternatore', tipo: 'concetto', fronte: R`Nell'alternatore, quando la f.e.m. è massima in valore assoluto?`, retro: R`Quando il flusso è zero: è lì che il flusso cambia più in fretta.` },
    { id: 'fc-22', sezione: 'alternatore', tipo: 'definizione', fronte: R`Che cos'è il **valore efficace** di una tensione alternata?`, retro: R`La tensione continua che scalda una resistenza allo stesso modo: per un seno $V_{\text{eff}} = V_0 / \sqrt{2}$.` },
    { id: 'fc-23', sezione: 'trasformatore', tipo: 'formula', fronte: R`Rapporto delle tensioni in un **trasformatore** ideale`, retro: R`$\dfrac{V_2}{V_1} = \dfrac{N_2}{N_1}$, e $V_1 \cdot I_1 = V_2 \cdot I_2$.` },
    { id: 'fc-24', sezione: 'trasformatore', tipo: 'concetto', fronte: R`Perché un trasformatore non funziona in corrente continua?`, retro: R`Con la corrente costante il flusso nel ferro non cambia, e nel secondario non si induce niente.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una spira di area $0{,}03\,\text{m}^2$ è perpendicolare a un campo magnetico di 0,25 T. Quanto vale il flusso, in milliweber?`, suggerimenti: [R`Perpendicolare alla spira vuol dire $\alpha = 0$: $\Phi = B \cdot S$.`], risposta: { tipo: 'numero', valore: 7.5, unita: 'mWb' }, soluzione: [R`$\Phi = B \cdot S = 0{,}25\,\text{T} \cdot 0{,}03\,\text{m}^2 = 0{,}0075\,\text{Wb} = 7{,}5\,\text{mWb}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una spira quadrata di lato 30 cm sta di fronte alle linee di un campo di 0,4 T. Quanto vale il flusso, in milliweber?`, suggerimenti: [R`Prima l'area in metri quadrati.`, R`$S = 0{,}30\,\text{m} \cdot 0{,}30\,\text{m}$.`], risposta: { tipo: 'numero', valore: 36, unita: 'mWb' }, soluzione: [R`$S = 0{,}30^2\,\text{m}^2 = 0{,}09\,\text{m}^2$.`, R`$\Phi = 0{,}4\,\text{T} \cdot 0{,}09\,\text{m}^2 = 0{,}036\,\text{Wb} = 36\,\text{mWb}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Il flusso in una spira cambia di 0,012 Wb in 0,03 s. Quanto vale, in modulo, la f.e.m. indotta?`, suggerimenti: [R`$|\mathcal{E}| = \dfrac{\Delta\Phi}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'V' }, soluzione: [R`$|\mathcal{E}| = \dfrac{0{,}012\,\text{Wb}}{0{,}03\,\text{s}} = 0{,}4\,\text{V}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una bobina ha 50 spire. Il flusso in ogni spira cambia di 2 mWb in 0,04 s. Quanto vale, in modulo, la f.e.m. indotta?`, suggerimenti: [R`Con $N$ spire: $|\mathcal{E}| = N \cdot \dfrac{\Delta\Phi}{\Delta t}$.`, R`2 mWb sono 0,002 Wb.`], risposta: { tipo: 'numero', valore: 2.5, unita: 'V' }, soluzione: [R`$|\mathcal{E}| = 50 \cdot \dfrac{0{,}002\,\text{Wb}}{0{,}04\,\text{s}} = 50 \cdot 0{,}05\,\text{V} = 2{,}5\,\text{V}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`In un circuito di resistenza 4 Ω nasce una f.e.m. indotta di 2,8 V. Quanto vale la corrente indotta?`, suggerimenti: [R`Come con una pila: $I = \mathcal{E}/R$.`], risposta: { tipo: 'numero', valore: 0.7, unita: 'A' }, soluzione: [R`$I = \dfrac{2{,}8\,\text{V}}{4\,\Omega} = 0{,}7\,\text{A}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`In una spira il flusso cambia di 0,09 Wb e nasce una f.e.m. media di 1,5 V. In quanto tempo è avvenuta la variazione?`, suggerimenti: [R`Dalla legge di Faraday-Neumann ricava $\Delta t$.`], risposta: { tipo: 'numero', valore: 0.06, unita: 's' }, soluzione: [R`$\Delta t = \dfrac{\Delta\Phi}{|\mathcal{E}|} = \dfrac{0{,}09\,\text{Wb}}{1{,}5\,\text{V}} = 0{,}06\,\text{s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Una sbarretta lunga 0,8 m si muove a 5 m/s perpendicolare a un campo di 0,25 T. Quanto vale la f.e.m. ai suoi capi?`, suggerimenti: [R`$\mathcal{E} = B \cdot \ell \cdot v$.`], risposta: { tipo: 'numero', valore: 1, unita: 'V' }, soluzione: [R`$\mathcal{E} = 0{,}25\,\text{T} \cdot 0{,}8\,\text{m} \cdot 5\,\text{m/s} = 1\,\text{V}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Una sbarretta lunga 0,3 m si muove in un campo di 0,4 T, perpendicolare alle linee. Ai suoi capi c'è una f.e.m. di 0,36 V. Con che velocità si muove?`, suggerimenti: [R`Da $\mathcal{E} = B \cdot \ell \cdot v$ ricava $v$.`], risposta: { tipo: 'numero', valore: 3, unita: 'm/s' }, soluzione: [R`$v = \dfrac{\mathcal{E}}{B \cdot \ell} = \dfrac{0{,}36\,\text{V}}{0{,}4\,\text{T} \cdot 0{,}3\,\text{m}} = \dfrac{0{,}36}{0{,}12}\,\text{m/s} = 3\,\text{m/s}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Una sbarretta lunga 0,4 m scorre a 6 m/s su due rotaie, in un campo perpendicolare di 0,5 T. Il circuito ha resistenza 3 Ω. Quanto vale la corrente indotta?`, suggerimenti: [R`Prima la f.e.m.: $\mathcal{E} = B \cdot \ell \cdot v$.`, R`Poi $I = \mathcal{E}/R$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'A' }, soluzione: [R`$\mathcal{E} = 0{,}5 \cdot 0{,}4 \cdot 6\,\text{V} = 1{,}2\,\text{V}$.`, R`$I = \dfrac{1{,}2\,\text{V}}{3\,\Omega} = 0{,}4\,\text{A}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`In una bobina passa una corrente di 1,5 A, e il flusso totale nelle sue spire è 0,06 Wb. Quanto vale l'induttanza, in millihenry?`, suggerimenti: [R`$\Phi = L \cdot I$.`], risposta: { tipo: 'numero', valore: 40, unita: 'mH' }, soluzione: [R`$L = \dfrac{\Phi}{I} = \dfrac{0{,}06\,\text{Wb}}{1{,}5\,\text{A}} = 0{,}04\,\text{H} = 40\,\text{mH}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`In una bobina da 0,4 H la corrente sale da zero a 5 A in 0,2 s. Quanto vale, in modulo, la f.e.m. autoindotta?`, suggerimenti: [R`$|\mathcal{E}| = L \cdot \dfrac{\Delta I}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 10, unita: 'V' }, soluzione: [R`$\dfrac{\Delta I}{\Delta t} = \dfrac{5\,\text{A}}{0{,}2\,\text{s}} = 25\,\text{A/s}$.`, R`$|\mathcal{E}| = 0{,}4\,\text{H} \cdot 25\,\text{A/s} = 10\,\text{V}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`In una bobina da 0,8 H passa una corrente di 1,5 A. Quanta energia contiene?`, suggerimenti: [R`$U = \tfrac{1}{2} \cdot L \cdot I^2$.`], risposta: { tipo: 'numero', valore: 0.9, unita: 'J' }, soluzione: [R`$U = \tfrac{1}{2} \cdot 0{,}8\,\text{H} \cdot (1{,}5\,\text{A})^2 = 0{,}4 \cdot 2{,}25\,\text{J} = 0{,}9\,\text{J}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un circuito RL ha una bobina da 0,9 H e una resistenza da 30 Ω. Quanto vale la costante di tempo, in millisecondi?`, suggerimenti: [R`$\tau = L / R$.`], risposta: { tipo: 'numero', valore: 30, unita: 'ms' }, soluzione: [R`$\tau = \dfrac{0{,}9\,\text{H}}{30\,\Omega} = 0{,}03\,\text{s} = 30\,\text{ms}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Una bobina di 40 spire, ognuna di area $0{,}02\,\text{m}^2$, gira a 100 rad/s in un campo uniforme di 0,1 T. Quanto vale il picco della f.e.m.?`, suggerimenti: [R`$\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega$.`], risposta: { tipo: 'numero', valore: 8, unita: 'V' }, soluzione: [R`$\mathcal{E}_0 = 40 \cdot 0{,}1\,\text{T} \cdot 0{,}02\,\text{m}^2 \cdot 100\,\text{rad/s} = 8\,\text{V}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Negli Stati Uniti la corrente alternata ha una frequenza di 60 Hz. Quanto dura un periodo, in millisecondi?`, suggerimenti: [R`Il periodo è l'inverso della frequenza.`], risposta: { tipo: 'numero', valore: 16.7, unita: 'ms' }, soluzione: [R`$T = \dfrac{1}{f} = \dfrac{1}{60\,\text{Hz}} \approx 0{,}0167\,\text{s} = 16{,}7\,\text{ms}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una tensione alternata sinusoidale ha un picco di 170 V. Quanto vale il valore efficace?`, suggerimenti: [R`Si divide il picco per $\sqrt{2}$.`], risposta: { tipo: 'numero', valore: 120, unita: 'V' }, soluzione: [R`$V_{\text{eff}} = \dfrac{170\,\text{V}}{\sqrt{2}} \approx \dfrac{170}{1{,}414}\,\text{V} \approx 120\,\text{V}$: è la tensione delle prese americane.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una tensione alternata sinusoidale ha un valore efficace di 24 V. Quanto vale il picco?`, suggerimenti: [R`Il picco è il valore efficace per $\sqrt{2}$.`], risposta: { tipo: 'numero', valore: 33.9, unita: 'V' }, soluzione: [R`$V_0 = V_{\text{eff}} \cdot \sqrt{2} = 24 \cdot 1{,}414\,\text{V} \approx 33{,}9\,\text{V}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un trasformatore ha 1000 spire nel primario, collegato a 230 V, e 40 spire nel secondario. Che tensione dà il secondario?`, suggerimenti: [R`$V_2 = V_1 \cdot \dfrac{N_2}{N_1}$.`], risposta: { tipo: 'numero', valore: 9.2, unita: 'V' }, soluzione: [R`$V_2 = 230\,\text{V} \cdot \dfrac{40}{1000} = 9{,}2\,\text{V}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un trasformatore deve abbassare 120 V a 6 V. Il primario ha 400 spire. Quante spire servono nel secondario?`, suggerimenti: [R`Le spire stanno come le tensioni.`], risposta: { tipo: 'numero', valore: 20 }, soluzione: [R`$N_2 = N_1 \cdot \dfrac{V_2}{V_1} = 400 \cdot \dfrac{6}{120} = 20$ spire.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Un trasformatore ideale ha 1200 spire nel primario e 48 nel secondario. Nel secondario passano 5 A. Quanta corrente passa nel primario?`, suggerimenti: [R`La potenza si conserva: la corrente sta al contrario delle spire.`, R`$I_1 = I_2 \cdot \dfrac{N_2}{N_1}$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'A' }, soluzione: [R`$I_1 = 5\,\text{A} \cdot \dfrac{48}{1200} = 5\,\text{A} \cdot 0{,}04 = 0{,}2\,\text{A}$.`] },

    /* ---- esercizi avanzati ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una bobina di 300 spire, ognuna di area 4 cm², ha resistenza 7,5 Ω. È perpendicolare a un campo che sale in modo uniforme da zero a 0,5 T in 20 ms. Quanto vale la corrente indotta?`, suggerimenti: [R`Porta l'area in metri quadrati: $4\,\text{cm}^2 = 4 \cdot 10^{-4}\,\text{m}^2$.`, R`$\Delta\Phi$ in ogni spira è $\Delta B \cdot S$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'A' }, soluzione: [R`$\Delta\Phi = 0{,}5\,\text{T} \cdot 4 \cdot 10^{-4}\,\text{m}^2 = 2 \cdot 10^{-4}\,\text{Wb}$ in ogni spira.`, R`$|\mathcal{E}| = 300 \cdot \dfrac{2 \cdot 10^{-4}\,\text{Wb}}{0{,}02\,\text{s}} = 3\,\text{V}$.`, R`$I = \dfrac{3\,\text{V}}{7{,}5\,\Omega} = 0{,}4\,\text{A}$.`] },
    { id: 'es-02', difficolta: 2, testo: R`Una spira quadrata di lato 10 cm è di fronte alle linee di un campo di 0,6 T. In 0,15 s viene girata fino a diventare parallela alle linee. Quanto vale la f.e.m. media indotta, in millivolt?`, suggerimenti: [R`All'inizio $\alpha = 0$, alla fine $\alpha = 90^\circ$.`, R`Il flusso passa da $B \cdot S$ a zero.`], risposta: { tipo: 'numero', valore: 40, unita: 'mV' }, soluzione: [R`$S = 0{,}01\,\text{m}^2$, $\Phi_1 = 0{,}6 \cdot 0{,}01\,\text{Wb} = 6 \cdot 10^{-3}\,\text{Wb}$, $\Phi_2 = 0$.`, R`$|\mathcal{E}| = \dfrac{6 \cdot 10^{-3}\,\text{Wb}}{0{,}15\,\text{s}} = 0{,}04\,\text{V} = 40\,\text{mV}$.`] },
    { id: 'es-03', difficolta: 3, testo: R`Una sbarretta lunga 25 cm scorre a 2 m/s costanti su due rotaie chiuse da una resistenza di 0,5 Ω. Il campo è perpendicolare e vale 0,8 T. Con che forza bisogna spingere la sbarretta per tenerla a velocità costante? (Trascura l'attrito.)`, suggerimenti: [R`Calcola $\mathcal{E}$, poi $I$.`, R`La forza magnetica sulla sbarretta è $F = I \cdot \ell \cdot B$, contraria al moto: bisogna spingere con una forza uguale.`], risposta: { tipo: 'numero', valore: 0.16, unita: 'N' }, soluzione: [R`$\mathcal{E} = 0{,}8 \cdot 0{,}25 \cdot 2\,\text{V} = 0{,}4\,\text{V}$; $I = \dfrac{0{,}4\,\text{V}}{0{,}5\,\Omega} = 0{,}8\,\text{A}$.`, R`$F = I \cdot \ell \cdot B = 0{,}8\,\text{A} \cdot 0{,}25\,\text{m} \cdot 0{,}8\,\text{T} = 0{,}16\,\text{N}$.`, R`Controllo: $F \cdot v = 0{,}32\,\text{W}$ e $\mathcal{E} \cdot I = 0{,}32\,\text{W}$. Torna.`] },
    { id: 'es-04', difficolta: 3, testo: R`Una sbarretta di massa 20 g e lunghezza 20 cm scivola senza attrito lungo due rotaie verticali. In alto le rotaie sono chiuse da una resistenza di 0,4 Ω. Un campo orizzontale di 0,5 T è perpendicolare alle rotaie. A che velocità costante finisce per cadere?`, suggerimenti: [R`Alla velocità limite la forza magnetica $I \cdot \ell \cdot B$ bilancia il peso $m \cdot g$.`, R`$I = \dfrac{B \cdot \ell \cdot v}{R}$, quindi la forza vale $\dfrac{B^2 \cdot \ell^2 \cdot v}{R}$.`], risposta: { tipo: 'numero', valore: 7.84, unita: 'm/s' }, soluzione: [R`Equilibrio: $m \cdot g = \dfrac{B^2 \cdot \ell^2 \cdot v}{R}$, quindi $v = \dfrac{m \cdot g \cdot R}{B^2 \cdot \ell^2}$.`, R`$v = \dfrac{0{,}02 \cdot 9{,}8 \cdot 0{,}4}{0{,}5^2 \cdot 0{,}2^2}\,\text{m/s} = \dfrac{0{,}0784}{0{,}01}\,\text{m/s} \approx 7{,}84\,\text{m/s}$.`, R`È la calamita nel tubo di rame: la frenata cresce con la velocità, finché bilancia il peso.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un solenoide in aria è lungo 50 cm, ha 1000 spire e sezione di 20 cm². Quanto vale la sua induttanza, in millihenry?`, suggerimenti: [R`$L = \mu_0 \cdot \dfrac{N^2 \cdot S}{\ell}$, con $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.`, R`$20\,\text{cm}^2 = 2 \cdot 10^{-3}\,\text{m}^2$.`], risposta: { tipo: 'numero', valore: 5.03, unita: 'mH' }, soluzione: [R`$L = 4\pi \cdot 10^{-7} \cdot \dfrac{10^6 \cdot 2 \cdot 10^{-3}}{0{,}5}\,\text{H} = 4\pi \cdot 10^{-7} \cdot 4000\,\text{H}$.`, R`$L \approx 5{,}03 \cdot 10^{-3}\,\text{H} \approx 5{,}0\,\text{mH}$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un circuito RL ha una pila da 6 V, una resistenza da 2 Ω e una bobina da 0,4 H. Quanta corrente passa 0,4 s dopo la chiusura?`, suggerimenti: [R`Calcola la corrente finale e la costante di tempo.`, R`0,4 s sono due costanti di tempo: $I = I_{\text{fin}} \cdot (1 - e^{-2})$.`], risposta: { tipo: 'numero', valore: 2.59, unita: 'A' }, soluzione: [R`Corrente finale $\dfrac{6\,\text{V}}{2\,\Omega} = 3\,\text{A}$; $\tau = \dfrac{0{,}4\,\text{H}}{2\,\Omega} = 0{,}2\,\text{s}$.`, R`$I = 3\,\text{A} \cdot (1 - e^{-0{,}4/0{,}2}) = 3 \cdot (1 - e^{-2})\,\text{A} \approx 3 \cdot 0{,}865\,\text{A} \approx 2{,}59\,\text{A}$.`] },
    { id: 'es-07', difficolta: 2, testo: R`Una bobina ha 120 spire, ognuna di area $0{,}03\,\text{m}^2$. Gira a 50 giri al secondo in un campo uniforme di 0,25 T. Quanto vale la tensione efficace che produce?`, suggerimenti: [R`$\omega = 2\pi \cdot f$; poi $\mathcal{E}_0 = N \cdot B \cdot S \cdot \omega$.`, R`Il valore efficace è il picco diviso $\sqrt{2}$.`], risposta: { tipo: 'numero', valore: 200, unita: 'V' }, soluzione: [R`$\omega = 2\pi \cdot 50\,\text{Hz} \approx 314\,\text{rad/s}$.`, R`$\mathcal{E}_0 = 120 \cdot 0{,}25 \cdot 0{,}03 \cdot 314\,\text{V} \approx 283\,\text{V}$.`, R`$\mathcal{E}_{\text{eff}} = \dfrac{283\,\text{V}}{\sqrt{2}} \approx 200\,\text{V}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Una stufa da 2000 W è collegata alla presa da 230 V efficaci. Quanto vale il picco della corrente che la attraversa?`, suggerimenti: [R`La potenza media è $V_{\text{eff}} \cdot I_{\text{eff}}$.`, R`Il picco è il valore efficace per $\sqrt{2}$.`], risposta: { tipo: 'numero', valore: 12.3, unita: 'A' }, soluzione: [R`$I_{\text{eff}} = \dfrac{2000\,\text{W}}{230\,\text{V}} \approx 8{,}70\,\text{A}$.`, R`$I_0 = I_{\text{eff}} \cdot \sqrt{2} \approx 8{,}70 \cdot 1{,}414\,\text{A} \approx 12{,}3\,\text{A}$.`] },
    { id: 'es-09', difficolta: 3, testo: R`Una centrale produce energia a 20 kV. Un trasformatore la porta a 400 kV prima di mandarla sulla linea, a parità di potenza. Di quante volte diminuisce il calore perso nei fili della linea?`, suggerimenti: [R`Tensione 20 volte più alta, corrente 20 volte più bassa.`, R`Il calore nei fili va come $R \cdot I^2$.`], risposta: { tipo: 'numero', valore: 400 }, soluzione: [R`A parità di potenza $I = P/V$: con la tensione 20 volte più alta la corrente è 20 volte più bassa.`, R`Il calore perso è $R \cdot I^2$: diminuisce di $20^2 = 400$ volte.`] },
    { id: 'es-10', difficolta: 2, testo: R`Due bobine vicine hanno mutua induttanza 0,05 H. Nella prima la corrente sale in modo uniforme da zero a 4 A in 10 ms. Quanto vale, in modulo, la f.e.m. indotta nella seconda?`, suggerimenti: [R`$|\mathcal{E}_2| = M \cdot \dfrac{\Delta I_1}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 20, unita: 'V' }, soluzione: [R`$\dfrac{\Delta I_1}{\Delta t} = \dfrac{4\,\text{A}}{0{,}01\,\text{s}} = 400\,\text{A/s}$.`, R`$|\mathcal{E}_2| = 0{,}05\,\text{H} \cdot 400\,\text{A/s} = 20\,\text{V}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`In quale di questi casi nasce una corrente indotta in una spira chiusa?`, opzioni: [R`Una calamita molto forte è ferma accanto alla spira`, R`La spira è ferma in un campo uniforme e costante`, R`Una calamita si allontana dalla spira`, R`Nella spira è inserita una resistenza grande`], corretta: 2, spiegazione: R`Serve che il flusso cambi: la calamita che si allontana lo fa calare. Un campo fermo, anche intenso, non induce niente; la resistenza cambia solo quanta corrente passa, se c'è una f.e.m.` },
    { id: 'q-02', domanda: R`Da che cosa dipende la f.e.m. indotta in una spira?`, opzioni: [R`Da quanto in fretta cambia il flusso`, R`Dal valore del flusso`, R`Dal valore del campo magnetico`, R`Dalla resistenza della spira`], corretta: 0, spiegazione: R`Per Faraday-Neumann $\mathcal{E} = -\Delta\Phi/\Delta t$: conta la rapidità della variazione. Un flusso o un campo grandi ma costanti danno zero; la resistenza decide la corrente, non la f.e.m.` },
    { id: 'q-03', domanda: R`Una spira è in un campo uniforme. Quando il flusso è massimo?`, opzioni: [R`Quando il piano della spira è parallelo alle linee`, R`Quando la perpendicolare alla spira forma 45° con il campo`, R`Quando la spira gira più in fretta`, R`Quando il campo è perpendicolare al piano della spira`], corretta: 3, spiegazione: R`Con il campo perpendicolare alla spira $\alpha = 0$ e $\cos\alpha = 1$: la spira raccoglie tutte le linee. Parallela alle linee il flusso è zero; la velocità di rotazione cambia la f.e.m., non il flusso massimo.` },
    { id: 'q-04', domanda: R`Che cosa dice la legge di Lenz?`, opzioni: [R`Che la corrente indotta si oppone sempre al campo magnetico esterno`, R`Che la corrente indotta si oppone alla variazione di flusso che la produce`, R`Che la corrente indotta è proporzionale al flusso`, R`Che la corrente indotta va sempre in senso orario`], corretta: 1, spiegazione: R`Si oppone alla variazione, non al campo: se il flusso cala, il campo indotto ha lo stesso verso di quello esterno. Il verso dipende dalla situazione, e la corrente dipende dalla variazione del flusso, non dal flusso.` },
    { id: 'q-05', domanda: R`Una calamita cade in un tubo verticale di rame e scende piano. Perché?`, opzioni: [R`Le correnti indotte nel rame creano campi che si oppongono alla caduta`, R`Il rame attira la calamita come il ferro`, R`L'aria dentro il tubo frena la calamita`, R`Il rame scherma il campo gravitazionale`], corretta: 0, spiegazione: R`Il flusso negli anelli del tubo cambia, nascono correnti indotte che per Lenz frenano la calamita. Il rame non è attirato dalle calamite, l'aria conta pochissimo e la gravità non si scherma.` },
    { id: 'q-06', domanda: R`Se la corrente indotta aiutasse la variazione di flusso invece di opporsi, che cosa succederebbe?`, opzioni: [R`Niente di diverso, cambierebbe solo il verso`, R`La corrente indotta sarebbe zero`, R`Si otterrebbe energia dal nulla`, R`Il flusso resterebbe costante`], corretta: 2, spiegazione: R`Una calamita che si avvicina verrebbe attirata, accelererebbe e indurrebbe ancora più corrente, senza che nessuno faccia lavoro. La legge di Lenz è la conservazione dell'energia.` },
    { id: 'q-07', domanda: R`In una bobina passa una corrente costante di 3 A. Quanto vale la f.e.m. autoindotta?`, opzioni: [R`Dipende dall'induttanza: $L \cdot 3\,\text{A}$`, R`3 V`, R`È massima, perché la corrente è grande`, R`Zero`], corretta: 3, spiegazione: R`La f.e.m. autoindotta è $-L \cdot \Delta I / \Delta t$: con la corrente costante $\Delta I = 0$. $L \cdot I$ è il flusso, non la f.e.m.` },
    { id: 'q-08', domanda: R`Perché salta una scintilla quando si apre un circuito con una bobina?`, opzioni: [R`Perché la resistenza della bobina si annulla`, R`Perché la corrente cala quasi di colpo e la f.e.m. autoindotta diventa grandissima`, R`Perché la pila si scarica all'improvviso`, R`Perché il ferro del nucleo si magnetizza`], corretta: 1, spiegazione: R`$\Delta I / \Delta t$ è enorme, e con lui $L \cdot \Delta I / \Delta t$: migliaia di volt, che fanno saltare la scintilla. L'energia viene dal campo magnetico della bobina, non dalla pila.` },
    { id: 'q-09', domanda: R`In un circuito RL si raddoppia l'induttanza e si lascia uguale la resistenza. Che cosa succede alla corrente dopo la chiusura?`, opzioni: [R`Sale due volte più lentamente, fino allo stesso valore finale`, R`Arriva a un valore finale doppio`, R`Arriva a un valore finale dimezzato`, R`Sale due volte più in fretta`], corretta: 0, spiegazione: R`La costante di tempo $\tau = L/R$ raddoppia: salita più lenta. Il valore finale $\mathcal{E}/R$ non dipende da $L$.` },
    { id: 'q-10', domanda: R`In un alternatore, in quale posizione della spira la f.e.m. è massima in valore assoluto?`, opzioni: [R`Quando il flusso è massimo`, R`Quando la spira è ferma`, R`Quando il flusso vale metà del massimo`, R`Quando il flusso è zero`], corretta: 3, spiegazione: R`La f.e.m. dipende da quanto in fretta cambia il flusso. Il flusso è un coseno e cambia più in fretta dove passa per lo zero; dove è massimo, per un attimo è fermo e la f.e.m. è zero.` },
    { id: 'q-11', domanda: R`Le prese di casa danno «230 V». Che cosa vuol dire?`, opzioni: [R`Che la tensione è sempre 230 V`, R`Che la tensione oscilla fra 0 e 230 V`, R`Che 230 V è il valore efficace: il picco è circa 325 V`, R`Che 230 V è il valore medio`], corretta: 2, spiegazione: R`La tensione è sinusoidale, con picco $230 \cdot \sqrt{2} \approx 325\,\text{V}$. 230 V è il valore efficace; la media su un giro è zero, perché metà del tempo la tensione è negativa.` },
    { id: 'q-12', domanda: R`Perché un trasformatore non funziona con una pila?`, opzioni: [R`Perché la tensione della pila è troppo bassa`, R`Perché con la corrente continua il flusso nel ferro non cambia`, R`Perché la pila ha una resistenza interna`, R`Perché il ferro non si magnetizza in continua`], corretta: 1, spiegazione: R`Il secondario lavora per induzione: serve un flusso che cambia. In continua il flusso è costante, e c'è solo un guizzo quando si chiude o si apre il circuito.` },
    { id: 'q-13', domanda: R`Un trasformatore ideale alza la tensione da 230 V a 2300 V. Che cosa succede alla corrente?`, opzioni: [R`Nel secondario è dieci volte più piccola che nel primario`, R`Nel secondario è dieci volte più grande`, R`È uguale nelle due bobine`, R`Nel secondario è cento volte più piccola`], corretta: 0, spiegazione: R`La potenza si conserva, $V_1 \cdot I_1 = V_2 \cdot I_2$: tensione dieci volte più alta, corrente dieci volte più bassa. Un trasformatore non crea energia.` },
    { id: 'q-14', domanda: R`Una sbarretta si muove su due rotaie in un campo magnetico. In quale caso la f.e.m. ai suoi capi è zero?`, opzioni: [R`Quando la velocità è perpendicolare al campo`, R`Quando il campo è molto debole ma la sbarretta è veloce`, R`Quando la sbarretta è lunga`, R`Quando la sbarretta si muove parallela alle linee del campo`], corretta: 3, spiegazione: R`Muovendosi parallela alle linee non le taglia: il flusso nel circuito non cambia e $\mathcal{E} = 0$. Negli altri casi $\mathcal{E} = B \cdot \ell \cdot v$ è piccola o grande, ma non zero.` },
    { id: 'q-15', domanda: R`Il piano a induzione scalda la pentola d'acciaio ma non un piatto di vetro. Perché?`, opzioni: [R`Il vetro riflette il campo magnetico`, R`Il vetro è troppo spesso`, R`Nel metallo il campo alternato induce correnti che lo scaldano; nel vetro, isolante, no`, R`La pentola d'acciaio assorbe meglio la luce del piano`], corretta: 2, spiegazione: R`Sotto il piano una bobina crea un campo che cambia di continuo. Nel fondo metallico nascono correnti parassite, che lo scaldano per effetto Joule. Il vetro non conduce: niente correnti, niente calore. Per questo servono pentole con il fondo di acciaio o di ghisa, che si magnetizzano.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Un campo forte ma fermo non induce niente. Per la corrente indotta serve un flusso che **cambia**.` },
    { tipo: 'errore', testo: R`Nel flusso $\Phi = B \cdot S \cdot \cos\alpha$ l'angolo è fra il campo e la **perpendicolare** alla spira, non fra il campo e la spira.` },
    { tipo: 'errore', testo: R`La corrente indotta non si oppone al campo, ma alla sua **variazione**: se il flusso cala, il campo indotto lo sostiene.` },
    { tipo: 'trucco', testo: R`Per il verso della corrente indotta chiediti solo: il flusso cresce o cala? Poi il campo indotto fa il contrario della variazione.` },
    { tipo: 'trucco', testo: R`Le unità aiutano. Un weber al secondo è un volt; anche un henry per ampere al secondo. Un henry per ampere al quadrato è un joule.` },
    { tipo: 'metodo', testo: R`Nei problemi di induzione calcola prima il flusso iniziale e quello finale. Poi la variazione, e solo alla fine dividi per il tempo.` },
    { tipo: 'errore', testo: R`I 230 V delle prese sono un valore **efficace**: il picco è circa 325 V. Il valore efficace non è la media, che su un giro è zero.` },
    { tipo: 'trucco', testo: R`Nel trasformatore le tensioni stanno come le spire, le correnti al contrario. E funziona solo in alternata.` }
  ],
  aneddoti: [
    { fisico: 'Michael Faraday', anni: '1791–1867', titolo: 'L\'anello di ferro con due bobine', testo: R`Da anni Michael Faraday cercava di ottenere elettricità dal magnetismo. Il 29 agosto 1831, alla Royal Institution di Londra, provò con un anello di ferro dolce largo circa 15 centimetri. Su una metà avvolse una bobina di filo di rame, sull'altra metà una seconda bobina. La seconda era collegata a un filo che passava sopra un ago magnetico. Quando collegò la prima bobina a una pila, l'ago oscillò e poi tornò fermo. Quando la staccò, l'ago si mosse di nuovo, dall'altra parte. Con la corrente costante, niente. A ottobre ottenne una corrente spingendo una calamita dentro una bobina. Il 24 novembre 1831 presentò i risultati alla Royal Society. L'anello si conserva ancora alla Royal Institution.`, legame: R`È la scoperta dell'induzione: la corrente nasce solo mentre il flusso cambia. E quell'anello è il primo trasformatore.` },
    { fisico: 'Heinrich Lenz', anni: '1804–1865', titolo: 'Il fisico che fece il giro del mondo', testo: R`Heinrich Lenz nacque a Dorpat, l'odierna Tartu, in Estonia. A diciannove anni si imbarcò come fisico sulla nave russa *Predprijatie*, comandata da Otto von Kotzebue. Fu un viaggio intorno al mondo, dal 1823 al 1826. Lenz misurava la temperatura e la salinità del mare, anche in profondità, con strumenti costruiti apposta. Tornato, diventò membro dell'Accademia delle scienze di San Pietroburgo. Lesse delle scoperte di Faraday e si dedicò all'elettromagnetismo. Nel 1834 pubblicò la regola per il verso delle correnti indotte. Studiò anche il calore prodotto dalla corrente, negli stessi anni di Joule: in Russia quella legge si chiama ancora legge di Joule-Lenz. Morì a Roma, durante un viaggio, nel 1865.`, legame: R`È la legge di Lenz: la corrente indotta si oppone alla variazione di flusso che la produce.` },
    { fisico: 'Galileo Ferraris', anni: '1847–1897', titolo: 'Il motore che non volle brevettare', testo: R`Galileo Ferraris insegnava fisica tecnica a Torino. All'Esposizione di Torino del 1884 studiò il «generatore secondario» di Gaulard e Gibbs, uno dei primi trasformatori. Pensando alle correnti alternate, nel 1885 ebbe un'idea. Due bobine incrociate, percorse da due correnti alternate sfasate, creano un campo magnetico che gira. Un cilindro di rame messo in mezzo comincia a ruotare dietro al campo. Ferraris costruì un piccolo motore e nel marzo 1888 presentò la scoperta all'Accademia delle scienze di Torino. Non chiese brevetti: per lui era una scoperta da pubblicare. Negli stessi anni Nikola Tesla arrivò allo stesso principio negli Stati Uniti, e lo brevettò.`, legame: R`Nel cilindro di rame il campo che gira induce correnti, e per la legge di Lenz il cilindro lo insegue: è il motore a induzione, che funziona a corrente alternata.` },
    { fisico: 'Nikola Tesla', anni: '1856–1943', titolo: 'Le cascate che accesero Buffalo', testo: R`Alla fine dell'Ottocento negli Stati Uniti si combatté la «guerra delle correnti». Thomas Edison distribuiva corrente continua, che non si può trasformare: le centrali dovevano stare vicino ai clienti. George Westinghouse puntava sulla corrente alternata, con i trasformatori e i motori brevettati da Nikola Tesla. Edison insisteva sui pericoli dell'alta tensione alternata. Nel 1893 Westinghouse illuminò l'Esposizione universale di Chicago. Poi vinse l'appalto per la centrale delle cascate del Niagara. Nel novembre 1896 la corrente alternata del Niagara arrivò a Buffalo, a una quarantina di chilometri. Da allora quasi tutte le reti del mondo sono in alternata.`, legame: R`L'alternata vinse grazie al trasformatore: alzare la tensione permette di portare l'energia lontano con poche perdite.` }
  ]
});
})();
