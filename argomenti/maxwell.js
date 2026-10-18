/* Quanto — Le onde elettromagnetiche (maxwell, quinto anno): il campo elettrico indotto, la corrente di spostamento,
   le quattro equazioni di Maxwell (flusso e circuitazione), l'onda elettromagnetica, c = 1/√(ε₀·μ₀), lo spettro,
   energia e intensità. Contratto in SCHEMA.md, modello cinematica.js.
   Simboli come in elettrostatica.js e magnetismo.js: flussi Φ_E e Φ_B, circuitazioni Γ_E e Γ_B, corrente I,
   f.e.m. 𝓔 come in corrente.js e induzione.js, ε₀ = 8,85·10⁻¹² C²/(N·m²), μ₀ = 4π·10⁻⁷ T·m/A.
   Colori: E grigio come nei video maxwell/* e in elettrostatica.js (il viola di luce.js segue i video di luce),
   B verde (3) come nei video e in magnetismo.js, la corrente viola come in magnetismo.js, la direzione dell'onda
   azzurra (1), energia e intensità verdi (3). Gli esempi vanno dal più facile al più difficile.
   Verifica: node strumenti/verifica-argomento.js argomenti/maxwell.js */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'maxwell',
  titolo: 'Le onde elettromagnetiche',
  introduzione: R`Il telefono in tasca riceve messaggi da un'antenna lontana chilometri. Il forno a microonde scalda il cibo senza fiamma. La luce del Sole arriva fino a noi attraverso lo spazio vuoto. Sono tutte la stessa cosa: un'**onda elettromagnetica**.

L'idea è di James Clerk Maxwell, a metà dell'Ottocento. Mise insieme le leggi dell'elettricità e del magnetismo in quattro equazioni. Ci aggiunse un pezzo nuovo: un campo elettrico che cambia crea un campo magnetico. Dalle equazioni uscì un'onda fatta solo di campi. Maxwell ne calcolò la velocità, e venne quella della luce.

Servono il teorema di Gauss, il teorema di Ampère e la legge di Faraday-Neumann. Dalle onde servono lunghezza d'onda, frequenza e la relazione fra le due.`,
  inBreve: [
    R`Un campo magnetico che cambia crea un campo elettrico con le linee chiuse, anche senza fili: $\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}$.`,
    R`Un campo elettrico che cambia crea un campo magnetico, come una corrente. È la **corrente di spostamento** di Maxwell: $I_s = \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}$.`,
    R`Le quattro equazioni di Maxwell dicono il flusso e la circuitazione dei due campi. Con queste e con la forza di Lorentz si spiega tutto l'elettromagnetismo classico.`,
    R`Le cariche che oscillano emettono un'onda elettromagnetica: E e B perpendicolari fra loro e alla direzione dell'onda, in fase, con $E = c \cdot B$. Va anche nel vuoto.`,
    R`Nel vuoto l'onda va a $c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}} \approx 3 \cdot 10^8\,\text{m/s}$: la luce è un'onda elettromagnetica. Radio, microonde, luce, raggi X e gamma differiscono solo per la lunghezza d'onda.`,
    R`L'onda porta energia. L'intensità media è $I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$, e da una sorgente piccola cala come $\dfrac{1}{r^2}$.`
  ],
  sezioni: [
    {
      id: 'campo-indotto',
      titolo: 'Il campo elettrico indotto',
      testo: R`Una calamita entra in una spira di rame, e nella spira passa corrente. È la legge di Faraday-Neumann: il flusso di B cambia e nasce una forza elettromotrice. Ma chi spinge gli elettroni del rame? Non c'è una pila.

Maxwell rispose così: li spinge un **campo elettrico**. Il campo magnetico che cambia crea un campo elettrico nello spazio attorno. Il campo c'è anche senza la spira: il rame serve solo a renderlo visibile.

Questo campo è diverso da quello delle cariche ferme. Le sue linee non partono da cariche positive: sono **chiuse**, e girano attorno alla zona dove B cambia.

[[grafico:anello]]

La forza elettromotrice lungo un giro chiuso è il lavoro del campo su una carica di 1 C. È quindi la **circuitazione** del campo elettrico, $\Gamma_E$: la somma, lungo il giro, della componente di E per la lunghezza di ogni pezzetto.

>* **Legge di Faraday-Neumann** per i campi: la circuitazione del campo elettrico lungo una linea chiusa è $\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}$. Qui $\Phi_B$ è il flusso di B attraverso la superficie che ha per bordo la linea.

Quindi $\Gamma_E = \mathcal{E}$, la f.e.m. dell'induzione. Da qui in poi i flussi hanno il pedice, $\Phi_E$ e $\Phi_B$, perché i campi sono due.

Il segno meno è la legge di Lenz. Il campo indotto gira nel verso in cui la sua corrente creerebbe un campo magnetico contrario alla variazione del flusso.

Esempio. In un solenoide lungo il campo B cresce di 2 tesla al secondo. Quanto vale il campo elettrico a 10 cm dall'asse, dentro il solenoide?

~ E \cdot 2\pi \cdot r = \pi \cdot r^2 \cdot \dfrac{\Delta B}{\Delta t} :: sul cerchio E è tangente e uguale ovunque; il flusso è B per l'area
~ E = \dfrac{r}{2} \cdot \dfrac{\Delta B}{\Delta t} :: divido per la circonferenza (il segno dice solo il verso)
~ E = \dfrac{0{,}1\,\text{m}}{2} \cdot 2\,\text{T/s} = \evidb{0{,}1\,\text{V/m}} :: un volt al metro vale un newton al coulomb

>! Il campo indotto non è conservativo. Il campo delle cariche ferme ha circuitazione zero, e per questo ha un potenziale. Il campo indotto no: lungo un giro chiuso fa un lavoro.

?? Si toglie la spira di rame dal solenoide, e B continua a crescere. Che cosa succede al campo elettrico indotto?
[ ] sparisce, perché non c'è più un circuito
[x] c'è lo stesso, nello spazio vuoto
[ ] diventa un campo magnetico
=> Il campo elettrico lo crea la variazione di B, non il filo. Il filo serve solo a far muovere degli elettroni e a misurare la corrente.`
    },
    {
      id: 'spostamento',
      titolo: 'La corrente di spostamento',
      testo: R`Il teorema di Ampère dice che la circuitazione di B è $\Gamma_B = \mu_0 \cdot I_c$. Qui $I_c$ è la corrente abbracciata, quella che attraversa una superficie con il bordo sulla linea chiusa. Maxwell si accorse che, con un condensatore, questa regola non regge.

Un condensatore si sta caricando. Nel filo passa la corrente $I$, ma fra le armature c'è il vuoto. Prendiamo un anello attorno al filo. Come superficie scegliamo un dischetto attraversato dal filo: la corrente è $I$. Ora gonfiamo la superficie come un sacchetto, fino a farla passare fra le armature. Il bordo è lo stesso, ma nessuna carica la attraversa. Il teorema darebbe due risposte diverse.

[[grafico:condensatore]]

Fra le armature però qualcosa cambia: il campo elettrico cresce, perché sulle armature arriva carica. Il campo del condensatore è $E = \dfrac{Q}{\varepsilon_0 \cdot S}$, con $S$ l'area di un'armatura. Vediamo quanto cambia il suo flusso.

~ \Phi_E = E \cdot S = \dfrac{Q}{\varepsilon_0} :: il flusso del campo fra le armature
~ \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t} = \dfrac{\Delta Q}{\Delta t} :: moltiplico per $\varepsilon_0$ e guardo quanto cambia in un tempo $\Delta t$
~ \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t} = \evidb{I} :: la carica che arriva ogni secondo è la corrente nel filo

Il flusso del campo elettrico che cambia fa la stessa parte della corrente. Maxwell la chiamò **corrente di spostamento**.

>* La **corrente di spostamento** è $I_s = \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}$. Il **teorema di Ampère-Maxwell** dice: $\Gamma_B = \mu_0 \cdot (I_c + I_s)$. Un campo elettrico che cambia crea un campo magnetico, come una corrente.

Così il sacchetto e il dischetto danno la stessa circuitazione. Fra le armature c'è un campo magnetico vero, con le linee che girano attorno al campo elettrico. Si misura, anche se è debolissimo.

>! La corrente di spostamento non è un moto di cariche. Nessun elettrone salta da un'armatura all'altra. Si chiama corrente perché crea un campo magnetico come una corrente.

?? Un condensatore si carica con una corrente di 3 A. Quanto vale la corrente di spostamento fra le armature?
[ ] zero, perché fra le armature non passano cariche
[x] 3 A
[ ] dipende dalla distanza fra le armature
=> Il flusso del campo elettrico cresce al ritmo giusto per dare $I_s = I = 3\,\text{A}$. Così la «corrente» non si interrompe: nei fili è moto di cariche, fra le armature è campo che cambia.`
    },
    {
      id: 'equazioni',
      titolo: 'Le quattro equazioni di Maxwell',
      testo: R`Per descrivere un campo bastano due domande. Quanto campo esce da una superficie chiusa? È il **flusso**. Quanto campo gira lungo una linea chiusa? È la **circuitazione**. Per due campi, E e B, le risposte sono quattro.

>* Le **equazioni di Maxwell** dicono il flusso e la circuitazione del campo elettrico e del campo magnetico. Sono quattro.

**1. Gauss per E.** Il flusso di E da una superficie chiusa dipende dalla carica dentro.

$$\Phi_E = \dfrac{Q}{\varepsilon_0}$$

**2. Gauss per B.** Il flusso di B da una superficie chiusa è sempre zero.

$$\Phi_B = 0$$

**3. Faraday-Neumann.** Un campo magnetico che cambia crea un campo elettrico. Qui $\Phi_B$ è il flusso attraverso una superficie che ha per bordo la linea.

$$\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}$$

**4. Ampère-Maxwell.** Le correnti, e i campi elettrici che cambiano, creano un campo magnetico. Anche qui $\Phi_E$ è il flusso attraverso una superficie che ha per bordo la linea.

$$\Gamma_B = \mu_0 \cdot \left(I_c + \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}\right)$$

> Se il flusso non cambia in modo uniforme, $\Delta\Phi / \Delta t$ si prende su un intervallo piccolissimo. È la derivata $d\Phi/dt$ che si trova sui libri.

Ognuna dice una cosa che si può raccontare a parole:

| equazione | che cosa dice |
|---|---|
| Gauss per E | le linee di E partono dalle cariche positive e finiscono sulle negative |
| Gauss per B | non esistono poli magnetici isolati: le linee di B sono chiuse |
| Faraday-Neumann | B che cambia fa girare un campo E attorno a sé |
| Ampère-Maxwell | correnti ed E che cambia fanno girare un campo B attorno a sé |

Con i campi che non cambiano si ritrova quello che già si sapeva. La terza dà $\Gamma_E = 0$: il campo delle cariche ferme è conservativo. La quarta diventa il teorema di Ampère.

Nel vuoto, lontano da cariche e correnti, $Q = 0$ e $I = 0$. Restano due campi che si creano a vicenda: E che cambia crea B, B che cambia crea E. È il punto di partenza dell'onda elettromagnetica.

> Insieme alla forza di Lorentz, che dice come i campi spingono le cariche, queste equazioni spiegano tutto l'elettromagnetismo classico. Maxwell le pubblicò nel 1865, scritte in un'altra forma e più numerose. La forma compatta di oggi è di Oliver Heaviside.

?? Quale delle quattro equazioni dice che non esiste un polo nord da solo?
[ ] la legge di Faraday-Neumann
[x] il teorema di Gauss per il campo magnetico
[ ] il teorema di Ampère-Maxwell
[ ] il teorema di Gauss per il campo elettrico
=> $\Phi_B = 0$ vuol dire che ogni linea di B che entra in una superficie chiusa ne esce. Un polo isolato farebbe uscire linee senza farle rientrare, come fa una carica con E.`
    },
    {
      id: 'onda',
      titolo: 'L\'onda elettromagnetica',
      testo: R`In un'antenna le cariche vanno su e giù, centinaia di milioni di volte al secondo. Il campo elettrico attorno cambia di continuo. Il campo E che cambia crea un campo B. Anche B cambia, e crea un nuovo E un po' più in là. I due campi si passano il testimone e si allontanano dall'antenna.

[[video:maxwell/onde-em]]

>* Un'**onda elettromagnetica** è fatta di un campo elettrico e di un campo magnetico che oscillano. E e B sono **perpendicolari** fra loro e alla direzione dell'onda: l'onda è **trasversale**. I due campi sono **in fase** e in ogni punto vale $E = c \cdot B$.

[[grafico:onda]]

L'onda non ha bisogno di un mezzo. Il suono fa vibrare l'aria; l'onda elettromagnetica è fatta solo di campi, che esistono anche nel vuoto. Per questo la luce delle stelle arriva fino a noi.

Il campo magnetico dell'onda è piccolissimo, perché $c$ è un numero enorme. Con un campo elettrico di 60 N/C:

~ B = \dfrac{E}{c} :: dalla relazione fra i due campi
~ B = \dfrac{60\,\text{N/C}}{3 \cdot 10^8\,\text{m/s}} :: un newton al coulomb diviso un metro al secondo fa un tesla
~ B = \evidb{2 \cdot 10^{-7}\,\text{T}} :: meno di un centesimo del campo magnetico terrestre

Le onde le emettono soltanto le cariche **accelerate**. Una carica ferma ha solo il suo campo elettrico. Una carica a velocità costante crea un campo magnetico, ma non irradia. Le cariche che oscillano in un'antenna accelerano di continuo, e irradiano.

Un'antenna fa anche da ricevitore. Il campo E dell'onda spinge avanti e indietro gli elettroni del metallo. Un'antenna a dipolo, due aste in fila, funziona meglio se è parallela a E. In tutto deve essere lunga circa mezza lunghezza d'onda. Lo stilo dell'auto, un'asta sola sopra il metallo della carrozzeria, è lungo circa un quarto.

>! L'onda non è un oggetto che sale e scende. La sinusoide disegna quanto vale il campo nei punti di una retta. Nello spazio niente si sposta in su e in giù.

?? Le cariche di un'antenna si fermano di colpo. Che cosa succede all'onda già partita?
[ ] si ferma anche lei
[ ] torna indietro verso l'antenna
[x] continua a viaggiare da sola
=> Ogni campo che cambia crea l'altro più avanti: l'onda si regge da sola. Smette solo di partire onda nuova.`
    },
    {
      id: 'velocita',
      titolo: 'La velocità della luce dalle costanti',
      testo: R`Dalle sue equazioni Maxwell ricavò anche la velocità dell'onda. Non dipende dalla frequenza né dall'ampiezza. Dipende solo da due costanti misurate in laboratorio con cariche e correnti.

>* Nel vuoto ogni onda elettromagnetica viaggia a $c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}}$. Qui $\varepsilon_0$ è la costante dielettrica del vuoto, $\mu_0$ la permeabilità magnetica del vuoto.

Facciamo il conto con $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$ e $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.

~ \mu_0 \approx 1{,}257 \cdot 10^{-6}\,\text{T} \cdot \text{m/A} :: il valore di $\mu_0$ in cifre
~ \varepsilon_0 \cdot \mu_0 \approx 1{,}112 \cdot 10^{-17}\,\text{s}^2/\text{m}^2 :: moltiplico per $\varepsilon_0$: le unità danno l'inverso di una velocità al quadrato
~ c = \dfrac{1}{\sqrt{1{,}112 \cdot 10^{-17}\,\text{s}^2/\text{m}^2}} :: radice e reciproco
~ c \approx \evidb{3{,}00 \cdot 10^8\,\text{m/s}} :: proprio la velocità della luce

Nel 1849 Hippolyte Fizeau aveva misurato la velocità della luce con una ruota dentata: circa 315 000 km/s. Con le misure elettriche di allora, a Maxwell veniva circa 310 000 km/s. Meno del 2% di differenza, da esperimenti che non c'entravano niente con la luce. Maxwell concluse che la luce è un'onda elettromagnetica.

### Nei materiali

In un isolante la costante dielettrica è più grande: $\varepsilon = \varepsilon_r \cdot \varepsilon_0$. Nei materiali non magnetici la permeabilità resta circa $\mu_0$. Allora la velocità diventa più piccola:

$$v = \dfrac{1}{\sqrt{\varepsilon_r \cdot \varepsilon_0 \cdot \mu_0}} = \dfrac{c}{\sqrt{\varepsilon_r}}$$

L'indice di rifrazione dell'ottica è quindi $n = \sqrt{\varepsilon_r}$. Attenzione però: $\varepsilon_r$ dipende dalla frequenza. Per l'acqua vale 80 con i campi fermi, ma circa 1,8 alla frequenza della luce. Infatti $\sqrt{1{,}8} \approx 1{,}34$, quasi l'indice dell'acqua.

>! La velocità $c$ non dipende dalla frequenza. Nel vuoto le onde radio e i raggi gamma vanno esattamente alla stessa velocità. Cambia solo la lunghezza d'onda.

?? Se $\varepsilon_0$ fosse quattro volte più grande, quanto varrebbe la velocità delle onde nel vuoto?
[ ] quattro volte $c$
[ ] un quarto di $c$
[x] metà di $c$
=> $c$ dipende da $1/\sqrt{\varepsilon_0 \cdot \mu_0}$. Con $\varepsilon_0$ quattro volte più grande, sotto la radice c'è un fattore 4, e $\sqrt{4} = 2$: la velocità si dimezza.`
    },
    {
      id: 'spettro',
      titolo: 'Lo spettro elettromagnetico',
      testo: R`La radio, il Wi-Fi, il calore di una stufa, la luce, una radiografia. Sembrano cose diverse, ma sono la stessa onda. Cambia solo quanto è lunga.

>* Per ogni onda elettromagnetica nel vuoto vale $c = \lambda \cdot f$. Le onde si ordinano per lunghezza d'onda nello **spettro elettromagnetico**: più $\lambda$ è corta, più la frequenza è alta.

Esempio. Una stazione radio FM trasmette a 100 MHz. Quanto è lunga la sua onda?

~ \lambda = \dfrac{c}{f} :: dalla relazione $c = \lambda \cdot f$
~ \lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{1 \cdot 10^8\,\text{Hz}} :: 100 MHz sono $10^8$ oscillazioni al secondo
~ \lambda = \evidb{3\,\text{m}} :: un'onda lunga quanto una stanza

[[video:maxwell/spettro]]

| banda | lunghezza d'onda | da dove viene |
|---|---|---|
| radio | oltre 1 m | correnti che oscillano in un'antenna |
| microonde | da 1 mm a 1 m | antenne piccole, forni, radar |
| infrarosso | da 700 nm a 1 mm | i corpi caldi, anche il nostro |
| visibile | da 400 a 700 nm | il Sole, le lampade |
| ultravioletto | da 10 a 400 nm | il Sole, lampade speciali |
| raggi X | da $10^{-11}$ a $10^{-8}$ m | elettroni veloci frenati di colpo |
| raggi gamma | sotto $10^{-11}$ m | i nuclei degli atomi |

I confini fra le bande non sono netti. Raggi X e gamma, per esempio, si sovrappongono: si distinguono per l'origine.

[[grafico:spettro]]

L'occhio vede solo una fettina dello spettro. Non è un caso: l'atmosfera lascia passare bene proprio il visibile, e il Sole emette soprattutto lì. L'ozono ferma quasi tutto l'ultravioletto più corto.

Dall'ultravioletto più corto in giù le onde sono **ionizzanti**: staccano elettroni dagli atomi e possono rompere le molecole del DNA. Per questo con i raggi X si sta attenti, e con le onde radio no. Il perché è nella fisica dei quanti: l'energia dell'onda arriva a pacchetti, più grandi a frequenza più alta.

>! Le microonde non sono «radiazioni» pericolose come i raggi X. Nel forno scaldano perché fanno ruotare le molecole d'acqua. Non rendono il cibo radioattivo.

?? Nel vuoto, chi va più veloce fra un'onda radio e un raggio X?
[ ] il raggio X, che ha la frequenza più alta
[ ] l'onda radio, che è più lunga
[x] vanno alla stessa velocità
=> Nel vuoto tutte le onde elettromagnetiche vanno a $c$. Il raggio X ha frequenza più alta e lunghezza d'onda più corta, ma il prodotto $\lambda \cdot f$ è lo stesso.`
    },
    {
      id: 'energia',
      titolo: 'Energia e intensità',
      testo: R`Al sole la pelle si scalda. L'energia arriva da 150 milioni di chilometri, attraverso il vuoto: la trasporta l'onda elettromagnetica.

Un campo elettrico contiene energia. In un condensatore ce n'è $\tfrac{1}{2} \cdot \varepsilon_0 \cdot E^2$ in ogni metro cubo. Anche il campo magnetico ne contiene: $\dfrac{B^2}{2 \cdot \mu_0}$ per metro cubo. Nell'onda le due parti sono uguali.

~ \dfrac{B^2}{2 \cdot \mu_0} = \dfrac{E^2}{2 \cdot \mu_0 \cdot c^2} :: nell'onda $B = E / c$
~ \dfrac{1}{\mu_0 \cdot c^2} = \varepsilon_0 :: perché $c^2 = 1/(\varepsilon_0 \cdot \mu_0)$
~ \dfrac{B^2}{2 \cdot \mu_0} = \evid{\tfrac{1}{2} \cdot \varepsilon_0 \cdot E^2} :: metà dell'energia è elettrica, metà magnetica
~ u = \evidb{\varepsilon_0 \cdot E^2} :: sommo la parte elettrica e quella magnetica: è la densità di energia, in $\text{J/m}^3$

>* L'**intensità** di un'onda è l'energia che attraversa ogni secondo un metro quadrato perpendicolare all'onda: $I = \dfrac{P}{S}$, in $\text{W/m}^2$. Per un'onda con ampiezza $E_0$ l'intensità media è $I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$.

Da dove viene? In un secondo passa l'energia contenuta in un tubo lungo $c$ metri: $I = c \cdot u$. Il campo però oscilla, e in media $E^2$ vale metà di $E_0^2$. Da qui il fattore $\tfrac{1}{2}$.

Esempio. Fuori dall'atmosfera la luce del Sole ha intensità $1360\,\text{W/m}^2$. Quanto vale l'ampiezza del campo elettrico?

~ E_0 = \sqrt{\dfrac{2 \cdot I}{c \cdot \varepsilon_0}} :: ricavo $E_0$ dalla formula dell'intensità
~ E_0 = \sqrt{\dfrac{2 \cdot 1360\,\text{W/m}^2}{2{,}655 \cdot 10^{-3}\,\text{C}^2/(\text{N} \cdot \text{m} \cdot \text{s})}} :: $c \cdot \varepsilon_0 \approx 2{,}655 \cdot 10^{-3}$: sotto la radice restano $(\text{V/m})^2$
~ E_0 \approx \evidb{1010\,\text{V/m}} :: circa mille volt al metro

Una sorgente piccola irradia in tutte le direzioni. A distanza $r$ la sua potenza $P$ si spalma su una sfera di area $4\pi \cdot r^2$: $I = \dfrac{P}{4\pi \cdot r^2}$. A distanza doppia l'intensità diventa un quarto.

[[grafico:intensita]]

> L'onda spinge anche. Su una superficie che la assorbe esercita una **pressione di radiazione** $p = \dfrac{I}{c}$, il doppio se la riflette. Per la luce del Sole sono pochi milionesimi di pascal. Nel 2010 la sonda giapponese IKAROS ha aperto una vela sottilissima e si è fatta spingere dalla luce del Sole.

>! L'intensità va con il **quadrato** del campo. Un'onda con ampiezza doppia porta quattro volte l'energia, non il doppio.

?? Un'antenna irradia in tutte le direzioni. A 3 km l'intensità vale $I$. Quanto vale a 6 km?
[ ] $I/2$
[x] $I/4$
[ ] $I/8$
=> La stessa potenza si spalma su una sfera di area $4\pi \cdot r^2$. A distanza doppia l'area è quattro volte più grande, e l'intensità un quarto.`
    }
  ],
  grafici: {
    /* il solenoide visto di fronte: B entra nel foglio e cresce; il campo E indotto gira in senso antiorario (Lenz) */
    anello: {
      tipo: 'piano', x: [-4.2, 4.2], y: [-4.2, 4.2], assi: false, griglia: false,
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 2.2, colore: 'grigio' },
        { tipo: 'entrante', da: [-1.5, -1.5], a: [1.5, 1.5], passo: 1, colore: 3 },
        { tipo: 'testo', p: [-1, -1.12], testo: 'B', colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 3.2, colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [3.2, -1.2], a: [3.2, 1.2], etichetta: 'E', posizione: 'destra', colore: 'grigio' },
        { tipo: 'vettore', da: [1.2, 3.2], a: [-1.2, 3.2], colore: 'grigio' },
        { tipo: 'vettore', da: [-3.2, 1.2], a: [-3.2, -1.2], colore: 'grigio' },
        { tipo: 'vettore', da: [-1.2, -3.2], a: [1.2, -3.2], colore: 'grigio' }
      ],
      didascalia: 'Un solenoide visto di fronte: dentro, il campo B entra nel foglio e cresce. Attorno nasce un campo elettrico E con le linee chiuse, in senso antiorario. Non serve nessun filo: il campo c\'è anche nel vuoto.'
    },
    /* il condensatore che si carica: la corrente I nei fili, il campo E che cresce fra le armature, B attorno a tutti e due */
    condensatore: {
      tipo: 'piano', x: [-5, 5], y: [-2.9, 2.9], assi: false, griglia: false,
      elementi: [
        { tipo: 'segmento', da: [-5, 0], a: [-0.7, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [0.7, 0], a: [5, 0], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-0.82, -1.7], [-0.68, -1.7], [-0.68, 1.7], [-0.82, 1.7]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0.68, -1.7], [0.82, -1.7], [0.82, 1.7], [0.68, 1.7]], colore: 'grigio' },
        { tipo: 'vettore', da: [-4.8, 0], a: [-3.3, 0], etichetta: 'I', colore: 4 },
        { tipo: 'vettore', da: [3.3, 0], a: [4.8, 0], etichetta: 'I', colore: 4 },
        { tipo: 'vettore', da: [-0.55, 1.1], a: [0.55, 1.1], colore: 'grigio' },
        { tipo: 'vettore', da: [-0.55, 0], a: [0.55, 0], colore: 'grigio' },
        { tipo: 'vettore', da: [-0.55, -1.1], a: [0.55, -1.1], colore: 'grigio' },
        { tipo: 'testo', p: [0, 2.45], testo: 'E cresce', colore: 'grigio' },
        { tipo: 'segmento', da: [-2, 1.2], a: [0, 1.5], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, 1.5], a: [0, -1.5], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [0, -1.5], a: [-2, -1.2], colore: 'grigio', tratteggio: true },
        { tipo: 'ellisse', centro: [-2, 0], a: 0.35, b: 1.2, colore: 3 },
        { tipo: 'ellisse', centro: [2, 0], a: 0.35, b: 1.2, colore: 3 },
        { tipo: 'testo', p: [-2, 1.6], testo: 'B', colore: 3 },
        { tipo: 'testo', p: [2, 1.6], testo: 'B', colore: 3 },
        { tipo: 'testo', p: [-3.6, -1.5], testo: 'dischetto: I' },
        { tipo: 'testo', p: [0.3, -2.45], testo: 'sacchetto: 0 cariche' }
      ],
      didascalia: 'Un condensatore che si carica. L\'anello attorno al filo di sinistra è il bordo di due superfici: il dischetto, che il filo attraversa con la corrente I, e il sacchetto tratteggiato, che passa fra le armature dove non passano cariche. Lì però il campo E cresce, e crea il campo magnetico come una corrente.'
    },
    /* l'onda elettromagnetica fotografata lungo la direzione in cui va: E e B in fase; t/T sposta l'onda in avanti */
    onda: {
      tipo: 'piano', x: [0, 4], y: [-2.9, 2.9], altezza: 420, proporzioni: 'libere', assi: false, griglia: false,
      parametri: [{ nome: 'fase', min: 0, max: 1, passo: 0.05, valore: 0, decimali: 2, etichetta: 'tempo t / T' }],
      funzioni: [
        { f: '1.5 + 0.9*sin(2*pi*(x - fase))', colore: 'grigio', dominio: [0, 4] },
        { f: '-1.5 + 0.7*sin(2*pi*(x - fase))', colore: 3, dominio: [0, 4] }
      ],
      elementi: [
        { tipo: 'testo', p: [3.95, 2.62], testo: 'E', ancora: 'end', colore: 'grigio' },
        { tipo: 'testo', p: [3.95, -0.18], testo: 'B', ancora: 'end', colore: 3 },
        { tipo: 'vettore', da: [0.15, -2.6], a: [1.15, -2.6], etichetta: 'c', posizione: 'destra', colore: 1 }
      ],
      didascalia: 'L\'onda in un istante, lungo la retta su cui viaggia. Sopra il campo elettrico, sotto quello magnetico: sono massimi e nulli negli stessi punti. Nella realtà B è perpendicolare al foglio; qui è disegnato sotto per non sovrapporlo a E. Il cursore fa scorrere il tempo: l\'onda avanza verso destra.'
    },
    /* lo spettro in scala logaritmica: ogni tacca è una lunghezza d'onda mille volte più corta */
    spettro: {
      tipo: 'piano', x: [-3.6, 13.2], y: [-1.1, 3.1], altezza: 420, proporzioni: 'libere', assi: false, griglia: false,
      elementi: [
        { tipo: 'segmento', da: [-3.6, 0], a: [13.2, 0], colore: 'grigio' },
        { tipo: 'segmento', da: [-3, -0.12], a: [-3, 0.12], colore: 'grigio' },
        { tipo: 'segmento', da: [0, -0.12], a: [0, 2.7], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [3, -0.12], a: [3, 2.7], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [6, -0.12], a: [6, 0.12], colore: 'grigio' },
        { tipo: 'segmento', da: [9, -0.12], a: [9, 0.12], colore: 'grigio' },
        { tipo: 'segmento', da: [12, -0.12], a: [12, 0.12], colore: 'grigio' },
        { tipo: 'segmento', da: [8, 0], a: [8, 2.7], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [11, 0], a: [11, 2.7], colore: 'grigio', tratteggio: true },
        { tipo: 'poligono', punti: [[6.15, 0], [6.4, 0], [6.4, 2.7], [6.15, 2.7]], colore: 'grigio' },
        { tipo: 'testo', p: [-3, -0.62], testo: '10³' },
        { tipo: 'testo', p: [0, -0.62], testo: '1' },
        { tipo: 'testo', p: [3, -0.62], testo: '10⁻³' },
        { tipo: 'testo', p: [6, -0.62], testo: '10⁻⁶' },
        { tipo: 'testo', p: [9, -0.62], testo: '10⁻⁹' },
        { tipo: 'testo', p: [12, -0.62], testo: '10⁻¹²' },
        { tipo: 'testo', p: [-1.75, 0.25], testo: 'radio', ancora: 'start', rotazione: 90 },
        { tipo: 'testo', p: [1.5, 0.25], testo: 'microonde', ancora: 'start', rotazione: 90 },
        { tipo: 'testo', p: [4.6, 0.25], testo: 'infrarosso', ancora: 'start', rotazione: 90 },
        { tipo: 'testo', p: [6.27, 2.85], testo: 'visibile' },
        { tipo: 'testo', p: [7.5, 0.25], testo: 'ultravioletto', ancora: 'start', rotazione: 90 },
        { tipo: 'testo', p: [9.5, 0.25], testo: 'raggi X', ancora: 'start', rotazione: 90 },
        { tipo: 'testo', p: [12.1, 0.25], testo: 'raggi gamma', ancora: 'start', rotazione: 90 }
      ],
      didascalia: 'Lo spettro elettromagnetico, con la lunghezza d\'onda in metri. La scala è logaritmica: da una tacca a quella alla sua destra λ diventa mille volte più corta, e la frequenza mille volte più alta. Il visibile è la striscia sottile fra infrarosso e ultravioletto.'
    },
    /* l'intensità di una sorgente piccola che irradia in tutte le direzioni: I = P / (4π·r²) */
    intensita: {
      tipo: 'piano', x: [0, 10], y: [0, 8], altezza: 420, proporzioni: 'libere', passo: [1, 2], etichette: { x: 'r (m)', y: 'I (W/m²)' },
      parametri: [
        { nome: 'P', min: 50, max: 300, passo: 10, valore: 200, etichetta: 'potenza P (W)' },
        { nome: 'r1', min: 1.5, max: 4, passo: 0.5, valore: 3, decimali: 1, etichetta: 'distanza r (m)' }
      ],
      funzioni: [{ f: 'P/(4*pi*x^2)', colore: 3, dominio: [1.4, 8.2] }],
      elementi: [
        { tipo: 'punto', p: ['r1', 'P/(4*pi*r1^2)'], colore: 3 },
        { tipo: 'punto', p: ['2*r1', 'P/(4*pi*(2*r1)^2)'], colore: 3 },
        { tipo: 'testo', p: [9.8, 7.3], testo: 'a {{r1|1}} m: {{P/(4*pi*r1^2)|2}} W/m²', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [9.8, 6.3], testo: 'a {{2*r1|1}} m: {{P/(4*pi*(2*r1)^2)|2}} W/m², un quarto', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Una sorgente piccola che irradia la potenza P in tutte le direzioni. L\'intensità cala come 1/r²: a distanza doppia diventa un quarto, a distanza tripla un nono.'
    }
  },
  esempi: [
    {
      titolo: 'Il segnale del GPS',
      problema: R`Un satellite GPS trasmette alla frequenza di $1575{,}42\,\text{MHz}$, da circa $20\,200\,\text{km}$ di altezza. Quanto è lunga l'onda? Quanto tempo impiega il segnale ad arrivare a terra, sulla verticale?`,
      passi: [
        R`Dati: $f = 1575{,}42\,\text{MHz} = 1{,}57542 \cdot 10^9\,\text{Hz}$, distanza $\Delta s = 2{,}02 \cdot 10^7\,\text{m}$. Cerco $\lambda$ e il tempo $\Delta t$.`,
        R`Lunghezza d'onda: $\lambda = \dfrac{c}{f} = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}57542 \cdot 10^9\,\text{Hz}} \approx 0{,}19\,\text{m}$. Sono microonde di 19 cm.`,
        R`Il segnale va a velocità costante $c$: $\Delta t = \dfrac{\Delta s}{c} = \dfrac{2{,}02 \cdot 10^7\,\text{m}}{3 \cdot 10^8\,\text{m/s}} \approx 0{,}067\,\text{s}$.`,
        R`Il ricevitore calcola la distanza dal tempo. Un errore di un microsecondo sul tempo vale $3 \cdot 10^8 \cdot 10^{-6} = 300\,\text{m}$ sulla posizione: per questo i satelliti hanno orologi atomici.`
      ],
      risultato: R`$\lambda \approx 19\,\text{cm}$; il segnale arriva in circa $0{,}067\,\text{s}$.`
    },
    {
      titolo: 'Un puntatore laser più intenso del Sole',
      problema: R`Un puntatore laser da 5 mW fa un fascio di 2 mm di diametro. Qual è l'intensità del fascio? Quanto vale l'ampiezza del campo elettrico?`,
      passi: [
        R`Dati: $P = 5 \cdot 10^{-3}\,\text{W}$, diametro $2\,\text{mm}$, quindi raggio $10^{-3}\,\text{m}$. Cerco l'intensità $I$ e l'ampiezza $E_0$.`,
        R`Area del fascio: $S = \pi \cdot (10^{-3}\,\text{m})^2 \approx 3{,}14 \cdot 10^{-6}\,\text{m}^2$.`,
        R`Intensità: $I = \dfrac{P}{S} = \dfrac{5 \cdot 10^{-3}\,\text{W}}{3{,}14 \cdot 10^{-6}\,\text{m}^2} \approx 1590\,\text{W/m}^2$. Più della luce del Sole fuori dall'atmosfera.`,
        R`Ampiezza del campo: $E_0 = \sqrt{\dfrac{2 \cdot I}{c \cdot \varepsilon_0}} = \sqrt{\dfrac{2 \cdot 1590}{3 \cdot 10^8 \cdot 8{,}85 \cdot 10^{-12}}}\,\text{V/m} \approx 1090\,\text{V/m}$.`,
        R`Controllo: $\tfrac{1}{2} \cdot 3 \cdot 10^8 \cdot 8{,}85 \cdot 10^{-12} \cdot 1090^2 \approx 1580\,\text{W/m}^2$. Torna, a meno degli arrotondamenti. Per questo il laser non si punta mai negli occhi.`
      ],
      risultato: R`$I \approx 1590\,\text{W/m}^2$, $E_0 \approx 1090\,\text{V/m}$.`
    },
    {
      titolo: 'Il campo di una stazione radio',
      problema: R`Un'antenna trasmette 50 kW, all'incirca in tutte le direzioni. Quanto valgono l'intensità e le ampiezze dei campi E e B a 10 km di distanza?`,
      passi: [
        R`Dati: $P = 5 \cdot 10^4\,\text{W}$, $r = 10^4\,\text{m}$. Cerco $I$, $E_0$ e $B_0$.`,
        R`La potenza si spalma su una sfera: $I = \dfrac{P}{4\pi \cdot r^2} = \dfrac{5 \cdot 10^4}{4\pi \cdot 10^8}\,\text{W/m}^2 \approx 4{,}0 \cdot 10^{-5}\,\text{W/m}^2$.`,
        R`Ampiezza del campo elettrico: $E_0 = \sqrt{\dfrac{2 \cdot I}{c \cdot \varepsilon_0}} = \sqrt{\dfrac{2 \cdot 4{,}0 \cdot 10^{-5}}{2{,}655 \cdot 10^{-3}}}\,\text{V/m} \approx 0{,}173\,\text{V/m}$.`,
        R`Ampiezza del campo magnetico: $B_0 = \dfrac{E_0}{c} = \dfrac{0{,}173}{3 \cdot 10^8}\,\text{T} \approx 5{,}8 \cdot 10^{-10}\,\text{T}$.`,
        R`Campi così piccoli bastano: in un'antenna ricevente fanno oscillare gli elettroni quanto serve all'amplificatore.`
      ],
      risultato: R`$I \approx 4 \cdot 10^{-5}\,\text{W/m}^2$, $E_0 \approx 0{,}17\,\text{V/m}$, $B_0 \approx 5{,}8 \cdot 10^{-10}\,\text{T}$.`
    },
    {
      titolo: 'Il campo indotto in un solenoide',
      problema: R`In un solenoide lungo, di raggio 3 cm, il campo B cresce in modo uniforme da 0 a 0,6 T in 0,2 s. Quanto vale il campo elettrico indotto a 2 cm dall'asse? Quanto vale la f.e.m. in una spira che abbraccia tutto il solenoide?`,
      passi: [
        R`Dati: $R = 0{,}03\,\text{m}$, $\Delta B = 0{,}6\,\text{T}$, $\Delta t = 0{,}2\,\text{s}$, $r = 0{,}02\,\text{m}$. Cerco il campo $E$ a distanza $r$ e la f.e.m. $\mathcal{E}$ della spira.`,
        R`Il ritmo con cui cresce il campo: $\dfrac{\Delta B}{\Delta t} = \dfrac{0{,}6\,\text{T}}{0{,}2\,\text{s}} = 3\,\text{T/s}$.`,
        R`Su un cerchio di raggio $r$ attorno all'asse il campo E è tangente e ha sempre lo stesso modulo. La circuitazione è $E \cdot 2\pi \cdot r$, il flusso è $\pi \cdot r^2 \cdot B$.`,
        R`Da $E \cdot 2\pi \cdot r = \pi \cdot r^2 \cdot \dfrac{\Delta B}{\Delta t}$ si ricava $E = \dfrac{r}{2} \cdot \dfrac{\Delta B}{\Delta t} = \dfrac{0{,}02\,\text{m}}{2} \cdot 3\,\text{T/s} = 0{,}03\,\text{V/m}$.`,
        R`La spira abbraccia tutto il flusso: $\mathcal{E} = \pi \cdot R^2 \cdot \dfrac{\Delta B}{\Delta t} = \pi \cdot 0{,}03^2 \cdot 3\,\text{V} \approx 8{,}5 \cdot 10^{-3}\,\text{V}$.`,
        R`Controllo con il campo sul bordo: $E = \dfrac{0{,}03}{2} \cdot 3 = 0{,}045\,\text{V/m}$, e $0{,}045 \cdot 2\pi \cdot 0{,}03 \approx 8{,}5 \cdot 10^{-3}\,\text{V}$. Torna.`
      ],
      risultato: R`$E = 0{,}03\,\text{V/m}$ a 2 cm dall'asse; $\mathcal{E} \approx 8{,}5\,\text{mV}$ nella spira.`
    },
    {
      titolo: 'Il campo magnetico fra le armature',
      problema: R`Un condensatore ha armature circolari di area $0{,}01\,\text{m}^2$. Mentre si carica, il campo fra le armature cresce di $1{,}5 \cdot 10^{12}\,\text{V/m}$ ogni secondo. Quanto vale la corrente di spostamento? Quanto vale B sul bordo delle armature?`,
      passi: [
        R`Dati: $S = 0{,}01\,\text{m}^2$, $\dfrac{\Delta E}{\Delta t} = 1{,}5 \cdot 10^{12}\,\text{V/(m}\cdot\text{s)}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$. Cerco $I_s$ e il campo $B$ sul bordo.`,
        R`Il flusso fra le armature è $\Phi_E = E \cdot S$, quindi cambia di $S \cdot \dfrac{\Delta E}{\Delta t}$ ogni secondo.`,
        R`Corrente di spostamento: $I_s = \varepsilon_0 \cdot S \cdot \dfrac{\Delta E}{\Delta t} = 8{,}85 \cdot 10^{-12} \cdot 0{,}01 \cdot 1{,}5 \cdot 10^{12}\,\text{A} \approx 0{,}133\,\text{A}$.`,
        R`Il raggio delle armature: da $\pi \cdot R^2 = 0{,}01\,\text{m}^2$ viene $R = \sqrt{0{,}01 / \pi}\,\text{m} \approx 0{,}0564\,\text{m}$.`,
        R`Teorema di Ampère-Maxwell su un cerchio di raggio $R$, che abbraccia tutta la corrente di spostamento: $B \cdot 2\pi \cdot R = \mu_0 \cdot I_s$.`,
        R`Quindi $B = \dfrac{\mu_0 \cdot I_s}{2\pi \cdot R} = \dfrac{4\pi \cdot 10^{-7} \cdot 0{,}133}{2\pi \cdot 0{,}0564}\,\text{T} \approx 4{,}7 \cdot 10^{-7}\,\text{T}$. È lo stesso campo di un filo con 0,133 A di corrente.`
      ],
      risultato: R`$I_s \approx 0{,}133\,\text{A}$; sul bordo $B \approx 4{,}7 \cdot 10^{-7}\,\text{T}$.`
    }
  ],
  formulario: [
    { nome: 'Faraday-Neumann (circuitazione di E)', formula: R`\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}`, nota: R`La circuitazione di E lungo una linea chiusa è la f.e.m. indotta, in volt.` },
    { nome: 'Campo indotto in un campo uniforme che cresce', formula: R`E = \dfrac{r}{2} \cdot \dfrac{\Delta B}{\Delta t}`, nota: R`Dentro un solenoide lungo, a distanza $r$ dall'asse. In $\text{V/m} = \text{N/C}$.` },
    { nome: 'Corrente di spostamento', formula: R`I_s = \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}`, nota: R`In un condensatore che si carica è uguale alla corrente nei fili.` },
    { nome: 'Ampère-Maxwell (circuitazione di B)', formula: R`\Gamma_B = \mu_0 \cdot (I_c + I_s)`, nota: R`$I_c$ sono le correnti abbracciate, $I_s$ la corrente di spostamento. In $\text{T} \cdot \text{m}$.` },
    { nome: 'Gauss per E e per B', formula: R`\Phi_E = \dfrac{Q}{\varepsilon_0} \qquad \Phi_B = 0`, nota: R`Per ogni superficie chiusa; $Q$ è la carica dentro.` },
    { nome: 'Velocità delle onde nel vuoto', formula: R`c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}}`, nota: R`$c \approx 3 \cdot 10^8\,\text{m/s}$ per ogni frequenza.` },
    { nome: 'Costanti del vuoto', formula: R`\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}`, nota: R`E $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$.` },
    { nome: 'Velocità in un isolante', formula: R`v = \dfrac{c}{\sqrt{\varepsilon_r}}`, nota: R`Materiali non magnetici; $\varepsilon_r$ alla frequenza dell'onda. L'indice di rifrazione è $n = \sqrt{\varepsilon_r}$.` },
    { nome: 'Campi nell\'onda', formula: R`E = c \cdot B`, nota: R`In ogni punto e in ogni istante. E e B perpendicolari, in fase.` },
    { nome: 'Lunghezza d\'onda e frequenza', formula: R`c = \lambda \cdot f`, nota: R`Nel vuoto, per tutto lo spettro: $\lambda$ corta vuol dire frequenza alta.` },
    { nome: 'Densità di energia dell\'onda', formula: R`u = \varepsilon_0 \cdot E^2`, nota: R`Metà elettrica e metà magnetica. In $\text{J/m}^3$.` },
    { nome: 'Intensità media', formula: R`I = \dfrac{P}{S} \qquad I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2`, nota: R`In $\text{W/m}^2$; $E_0$ è l'ampiezza del campo elettrico.` },
    { nome: 'Sorgente che irradia in tutte le direzioni', formula: R`I = \dfrac{P}{4\pi \cdot r^2}`, nota: R`A distanza doppia l'intensità è un quarto.` },
    { nome: 'Pressione di radiazione', formula: R`p = \dfrac{I}{c}`, nota: R`Su una superficie che assorbe; il doppio se la superficie riflette.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'campo-indotto', tipo: 'concetto', fronte: R`Che cosa crea un campo magnetico che cambia?`, retro: R`Un campo elettrico con le linee chiuse, anche nel vuoto, senza nessun filo.` },
    { id: 'fc-02', sezione: 'campo-indotto', tipo: 'formula', fronte: R`La legge di **Faraday-Neumann** scritta con i campi`, retro: R`$\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}$: la circuitazione di E è meno la rapidità con cui cambia il flusso di B.` },
    { id: 'fc-03', sezione: 'campo-indotto', tipo: 'concetto', fronte: R`Che differenza c'è fra il campo elettrico indotto e quello delle cariche ferme?`, retro: R`Il campo delle cariche ferme ha le linee aperte e circuitazione zero. Quello indotto ha le linee chiuse e non è conservativo.` },
    { id: 'fc-04', sezione: 'spostamento', tipo: 'concetto', fronte: R`Perché il teorema di Ampère non regge con un condensatore che si carica?`, retro: R`Con una superficie che taglia il filo la corrente è $I$; con una che passa fra le armature è zero. Il bordo è lo stesso, la risposta no.` },
    { id: 'fc-05', sezione: 'spostamento', tipo: 'formula', fronte: R`Formula della **corrente di spostamento**`, retro: R`$I_s = \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}$, in ampere.` },
    { id: 'fc-06', sezione: 'spostamento', tipo: 'formula', fronte: R`Il teorema di **Ampère-Maxwell**`, retro: R`$\Gamma_B = \mu_0 \cdot (I_c + I_s)$: correnti e campi elettrici che cambiano creano un campo magnetico.` },
    { id: 'fc-07', sezione: 'spostamento', tipo: 'concetto', fronte: R`La corrente di spostamento è un moto di cariche?`, retro: R`No. È un campo elettrico che cambia. Si chiama corrente perché crea un campo magnetico come una corrente.` },
    { id: 'fc-08', sezione: 'equazioni', tipo: 'formula', fronte: R`Le due equazioni di Maxwell sul **flusso**`, retro: R`$\Phi_E = \dfrac{Q}{\varepsilon_0}$ e $\Phi_B = 0$, per ogni superficie chiusa.` },
    { id: 'fc-09', sezione: 'equazioni', tipo: 'concetto', fronte: R`Che cosa vuol dire $\Phi_B = 0$ su ogni superficie chiusa?`, retro: R`Che le linee di B sono chiuse: non esistono poli magnetici isolati.` },
    { id: 'fc-10', sezione: 'equazioni', tipo: 'concetto', fronte: R`Che cosa dicono le equazioni di Maxwell nel vuoto, senza cariche né correnti?`, retro: R`Che un campo elettrico che cambia crea un campo magnetico, e un campo magnetico che cambia crea un campo elettrico.` },
    { id: 'fc-11', sezione: 'equazioni', tipo: 'concetto', fronte: R`Con i campi che non cambiano, che cosa diventano le equazioni delle circuitazioni?`, retro: R`$\Gamma_E = 0$ (il campo elettrostatico è conservativo) e $\Gamma_B = \mu_0 \cdot I_c$ (il teorema di Ampère).` },
    { id: 'fc-12', sezione: 'onda', tipo: 'definizione', fronte: R`Che cos'è un'**onda elettromagnetica**?`, retro: R`Un campo elettrico e un campo magnetico che oscillano, perpendicolari fra loro e alla direzione dell'onda, in fase. Va anche nel vuoto.` },
    { id: 'fc-13', sezione: 'onda', tipo: 'formula', fronte: R`Relazione fra E e B in un'onda elettromagnetica`, retro: R`$E = c \cdot B$: con E in V/m e B in tesla, il campo magnetico è piccolissimo.` },
    { id: 'fc-14', sezione: 'onda', tipo: 'concetto', fronte: R`Quali cariche emettono onde elettromagnetiche?`, retro: R`Solo quelle accelerate, per esempio le cariche che oscillano in un'antenna. Una carica a velocità costante non irradia.` },
    { id: 'fc-15', sezione: 'onda', tipo: 'concetto', fronte: R`Come funziona un'antenna ricevente a dipolo?`, retro: R`Il campo E dell'onda fa oscillare gli elettroni delle due aste in fila. Funziona meglio parallela a E e lunga in tutto circa mezza lunghezza d'onda.` },
    { id: 'fc-16', sezione: 'velocita', tipo: 'formula', fronte: R`La velocità delle onde elettromagnetiche nel vuoto`, retro: R`$c = \dfrac{1}{\sqrt{\varepsilon_0 \cdot \mu_0}} \approx 3 \cdot 10^8\,\text{m/s}$, uguale per tutte le frequenze.` },
    { id: 'fc-17', sezione: 'velocita', tipo: 'formula', fronte: R`Velocità di un'onda elettromagnetica in un isolante non magnetico`, retro: R`$v = \dfrac{c}{\sqrt{\varepsilon_r}}$, quindi $n = \sqrt{\varepsilon_r}$, con $\varepsilon_r$ alla frequenza dell'onda.` },
    { id: 'fc-18', sezione: 'spettro', tipo: 'concetto', fronte: R`Le bande dello spettro, dalla lunghezza d'onda più lunga alla più corta`, retro: R`Radio, microonde, infrarosso, visibile, ultravioletto, raggi X, raggi gamma.` },
    { id: 'fc-19', sezione: 'spettro', tipo: 'concetto', fronte: R`Che cosa hanno in comune una radio e una radiografia?`, retro: R`Usano la stessa onda elettromagnetica, alla stessa velocità $c$. Cambiano solo lunghezza d'onda e frequenza.` },
    { id: 'fc-20', sezione: 'spettro', tipo: 'concetto', fronte: R`Quali onde elettromagnetiche sono **ionizzanti**?`, retro: R`L'ultravioletto più corto, i raggi X e i raggi gamma. Staccano elettroni dagli atomi.` },
    { id: 'fc-21', sezione: 'energia', tipo: 'formula', fronte: R`Densità di energia di un'onda elettromagnetica`, retro: R`$u = \varepsilon_0 \cdot E^2$, metà nel campo elettrico e metà nel campo magnetico.` },
    { id: 'fc-22', sezione: 'energia', tipo: 'formula', fronte: R`Intensità media di un'onda di ampiezza $E_0$`, retro: R`$I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$, in $\text{W/m}^2$.` },
    { id: 'fc-23', sezione: 'energia', tipo: 'concetto', fronte: R`Come cambia l'intensità allontanandosi da una sorgente piccola?`, retro: R`Come $\dfrac{1}{r^2}$: $I = \dfrac{P}{4\pi \cdot r^2}$. A distanza doppia diventa un quarto.` },
    { id: 'fc-24', sezione: 'energia', tipo: 'formula', fronte: R`La **pressione di radiazione**`, retro: R`$p = \dfrac{I}{c}$ su una superficie che assorbe, il doppio su una che riflette.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una stazione radio trasmette a 75 MHz. Quanto è lunga la sua onda?`, suggerimenti: [R`$\lambda = \dfrac{c}{f}$, con $c = 3 \cdot 10^8\,\text{m/s}$.`, R`75 MHz sono $7{,}5 \cdot 10^7\,\text{Hz}$.`], risposta: { tipo: 'numero', valore: 4, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{7{,}5 \cdot 10^7\,\text{Hz}} = 4\,\text{m}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un'onda elettromagnetica è lunga 0,5 m. Qual è la sua frequenza, in MHz?`, suggerimenti: [R`$f = \dfrac{c}{\lambda}$.`], risposta: { tipo: 'numero', valore: 600, unita: 'MHz' }, soluzione: [R`$f = \dfrac{3 \cdot 10^8\,\text{m/s}}{0{,}5\,\text{m}} = 6 \cdot 10^8\,\text{Hz} = 600\,\text{MHz}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Una luce ha frequenza $5 \cdot 10^{14}\,\text{Hz}$. Quanto è lunga la sua onda, in nanometri? Di che colore è?`, suggerimenti: [R`$\lambda = \dfrac{c}{f}$; poi $1\,\text{nm} = 10^{-9}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 600, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{5 \cdot 10^{14}\,\text{Hz}} = 6 \cdot 10^{-7}\,\text{m} = 600\,\text{nm}$: una luce arancio.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un raggio X ha frequenza $3 \cdot 10^{18}\,\text{Hz}$. Quanto è lunga la sua onda, in nanometri?`, suggerimenti: [R`$\lambda = \dfrac{c}{f}$, poi $1\,\text{nm} = 10^{-9}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{3 \cdot 10^8}{3 \cdot 10^{18}}\,\text{m} = 10^{-10}\,\text{m} = 0{,}1\,\text{nm}$: grande come un atomo.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`In un punto di un'onda elettromagnetica il campo magnetico vale $4 \cdot 10^{-8}\,\text{T}$. Quanto vale il campo elettrico nello stesso punto?`, suggerimenti: [R`Nell'onda $E = c \cdot B$.`], risposta: { tipo: 'numero', valore: 12, unita: 'N/C' }, soluzione: [R`$E = 3 \cdot 10^8\,\text{m/s} \cdot 4 \cdot 10^{-8}\,\text{T} = 12\,\text{N/C}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Il campo elettrico di un'onda ha ampiezza 900 V/m. Quanto vale l'ampiezza del campo magnetico, in microtesla?`, suggerimenti: [R`$B = \dfrac{E}{c}$.`], risposta: { tipo: 'numero', valore: 3, unita: 'μT' }, soluzione: [R`$B = \dfrac{900\,\text{V/m}}{3 \cdot 10^8\,\text{m/s}} = 3 \cdot 10^{-6}\,\text{T} = 3\,\mu\text{T}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Una sonda vicino a Giove dista dalla Terra $7{,}2 \cdot 10^{11}\,\text{m}$. Quanti minuti impiega il suo segnale radio ad arrivare?`, suggerimenti: [R`Le onde radio vanno a $c$: $\Delta t = \dfrac{\Delta s}{c}$.`, R`Il tempo esce in secondi: dividi per 60.`], risposta: { tipo: 'numero', valore: 40, unita: 'min' }, soluzione: [R`$\Delta t = \dfrac{7{,}2 \cdot 10^{11}\,\text{m}}{3 \cdot 10^8\,\text{m/s}} = 2400\,\text{s}$.`, R`In minuti: $\dfrac{2400}{60} = 40\,\text{min}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un radar manda un impulso verso un aereo e riceve l'eco dopo $2 \cdot 10^{-4}\,\text{s}$. A che distanza è l'aereo, in km?`, suggerimenti: [R`In quel tempo l'onda fa andata e ritorno.`], risposta: { tipo: 'numero', valore: 30, unita: 'km' }, soluzione: [R`Strada totale: $3 \cdot 10^8\,\text{m/s} \cdot 2 \cdot 10^{-4}\,\text{s} = 6 \cdot 10^4\,\text{m}$.`, R`L'aereo è a metà: $3 \cdot 10^4\,\text{m} = 30\,\text{km}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Il flusso di B attraverso una superficie che ha per bordo una linea chiusa scende da 0,2 Wb a 0,05 Wb in 0,5 s. Quanto vale, in valore assoluto, la circuitazione del campo elettrico indotto?`, suggerimenti: [R`$\Gamma_E = -\dfrac{\Delta\Phi_B}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 0.3, unita: 'V' }, soluzione: [R`$\Delta\Phi_B = 0{,}05 - 0{,}2 = -0{,}15\,\text{Wb}$.`, R`$\Gamma_E = -\dfrac{-0{,}15\,\text{Wb}}{0{,}5\,\text{s}} = 0{,}3\,\text{V}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Dentro un solenoide lungo il campo B cresce di 0,5 T al secondo. Quanto vale il campo elettrico indotto a 20 cm dall'asse, ancora dentro il solenoide?`, suggerimenti: [R`$E = \dfrac{r}{2} \cdot \dfrac{\Delta B}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 0.05, unita: 'V/m' }, soluzione: [R`$E = \dfrac{0{,}2\,\text{m}}{2} \cdot 0{,}5\,\text{T/s} = 0{,}05\,\text{V/m}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Fra le armature di un condensatore il flusso del campo elettrico cresce di $10^{11}\,\text{V} \cdot \text{m}$ ogni secondo. Quanto vale la corrente di spostamento?`, suggerimenti: [R`$I_s = \varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 0.885, unita: 'A' }, soluzione: [R`$I_s = 8{,}85 \cdot 10^{-12} \cdot 10^{11}\,\text{A} = 0{,}885\,\text{A}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un condensatore si carica con una corrente di 2 A nei fili. Quanto vale la corrente di spostamento fra le armature?`, suggerimenti: [R`Fra le armature il flusso di E cresce al ritmo della carica che arriva.`], risposta: { tipo: 'numero', valore: 2, unita: 'A' }, soluzione: [R`$\varepsilon_0 \cdot \dfrac{\Delta\Phi_E}{\Delta t} = \dfrac{\Delta Q}{\Delta t} = I$, quindi $I_s = 2\,\text{A}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Una linea chiusa passa fra le armature di un condensatore e abbraccia una corrente di spostamento di 5 A. Nessun filo la attraversa. Quanto vale la circuitazione di B?`, suggerimenti: [R`Ampère-Maxwell: $\Gamma_B = \mu_0 \cdot (I_c + I_s)$, con $I_c = 0$.`], risposta: { tipo: 'numero', valore: 6.28e-6, unita: 'T·m' }, soluzione: [R`$\Gamma_B = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A} \cdot 5\,\text{A} \approx 6{,}28 \cdot 10^{-6}\,\text{T} \cdot \text{m}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Una superficie chiusa contiene una carica di $8{,}85 \cdot 10^{-10}\,\text{C}$. Quanto vale il flusso del campo elettrico che la attraversa?`, suggerimenti: [R`Prima equazione di Maxwell: $\Phi_E = \dfrac{Q}{\varepsilon_0}$.`], risposta: { tipo: 'numero', valore: 100, unita: 'N·m²/C' }, soluzione: [R`$\Phi_E = \dfrac{8{,}85 \cdot 10^{-10}}{8{,}85 \cdot 10^{-12}}\,\text{N} \cdot \text{m}^2/\text{C} = 100\,\text{N} \cdot \text{m}^2/\text{C}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`In un materiale non magnetico, alla frequenza della luce, la costante dielettrica relativa vale $\varepsilon_r = 2{,}25$. Quanto vale l'indice di rifrazione? A che velocità va la luce? Scrivi l'indice.`, suggerimenti: [R`$n = \sqrt{\varepsilon_r}$, e $v = \dfrac{c}{n}$.`], risposta: { tipo: 'numero', valore: 1.5 }, segnaposto: 'Un numero (es. 1,2)', soluzione: [R`$n = \sqrt{2{,}25} = 1{,}5$: un numero puro.`, R`$v = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}5} = 2 \cdot 10^8\,\text{m/s}$, come nel vetro.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`In un punto di un'onda elettromagnetica il campo elettrico vale 200 V/m. Quanta energia c'è in un metro cubo?`, suggerimenti: [R`$u = \varepsilon_0 \cdot E^2$.`], risposta: { tipo: 'numero', valore: 3.54e-7, unita: 'J/m³' }, soluzione: [R`$u = 8{,}85 \cdot 10^{-12} \cdot 200^2\,\text{J/m}^3 = 8{,}85 \cdot 10^{-12} \cdot 4 \cdot 10^4\,\text{J/m}^3 \approx 3{,}54 \cdot 10^{-7}\,\text{J/m}^3$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un pannello solare di $2\,\text{m}^2$, perpendicolare ai raggi, riceve 1600 W di luce. Qual è l'intensità della luce?`, suggerimenti: [R`$I = \dfrac{P}{S}$.`], risposta: { tipo: 'numero', valore: 800, unita: 'W/m²' }, soluzione: [R`$I = \dfrac{1600\,\text{W}}{2\,\text{m}^2} = 800\,\text{W/m}^2$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Una sorgente piccola irradia 75 W in tutte le direzioni. Qual è l'intensità a 2,5 m?`, suggerimenti: [R`$I = \dfrac{P}{4\pi \cdot r^2}$.`], risposta: { tipo: 'numero', valore: 0.955, unita: 'W/m²' }, soluzione: [R`$I = \dfrac{75\,\text{W}}{4\pi \cdot (2{,}5\,\text{m})^2} = \dfrac{75}{78{,}5}\,\text{W/m}^2 \approx 0{,}955\,\text{W/m}^2$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`A 4 m da una lampada l'intensità della luce è $36\,\text{W/m}^2$. Quanto vale a 8 m?`, suggerimenti: [R`L'intensità cala come $1/r^2$.`], risposta: { tipo: 'numero', valore: 9, unita: 'W/m²' }, soluzione: [R`Distanza doppia, intensità divisa per $2^2 = 4$: $\dfrac{36}{4} = 9\,\text{W/m}^2$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`Il campo elettrico di un'onda ha ampiezza 100 V/m. Qual è l'intensità media dell'onda?`, suggerimenti: [R`$I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$.`], risposta: { tipo: 'numero', valore: 13.3, unita: 'W/m²' }, soluzione: [R`$I = \tfrac{1}{2} \cdot 3 \cdot 10^8 \cdot 8{,}85 \cdot 10^{-12} \cdot 100^2\,\text{W/m}^2 \approx 13{,}3\,\text{W/m}^2$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Un solenoide lungo ha raggio 6 cm, e il suo campo cresce in modo uniforme da 0 a 1,2 T in 4 s. Attorno al solenoide c'è una spira coassiale di raggio 10 cm. Quanto vale la f.e.m. indotta nella spira?`, suggerimenti: [R`Fuori dal solenoide il campo B è quasi zero: il flusso passa solo dalla sezione del solenoide.`, R`$\mathcal{E} = \pi \cdot R^2 \cdot \dfrac{\Delta B}{\Delta t}$, con il raggio del solenoide.`], risposta: { tipo: 'numero', valore: 3.39, unita: 'mV' }, soluzione: [R`$\dfrac{\Delta B}{\Delta t} = \dfrac{1{,}2\,\text{T}}{4\,\text{s}} = 0{,}3\,\text{T/s}$.`, R`$\mathcal{E} = \pi \cdot 0{,}06^2 \cdot 0{,}3\,\text{V} \approx 3{,}39 \cdot 10^{-3}\,\text{V} = 3{,}39\,\text{mV}$.`, R`Il raggio della spira non conta. Eppure la spira passa dove B è zero: lì c'è comunque il campo elettrico indotto.`] },
    { id: 'es-02', difficolta: 3, testo: R`Un condensatore ha armature circolari di raggio 5 cm e si carica con una corrente di 0,3 A. Quanto vale il campo magnetico sul bordo delle armature, a metà fra le due?`, suggerimenti: [R`Fra le armature la corrente di spostamento vale quanto la corrente nei fili.`, R`Ampère-Maxwell su un cerchio di raggio 5 cm: $B \cdot 2\pi \cdot R = \mu_0 \cdot I_s$.`], risposta: { tipo: 'numero', valore: 1.2, unita: 'μT' }, soluzione: [R`$I_s = 0{,}3\,\text{A}$, tutta dentro il cerchio di raggio $R = 0{,}05\,\text{m}$.`, R`$B = \dfrac{\mu_0 \cdot I_s}{2\pi \cdot R} = \dfrac{2 \cdot 10^{-7} \cdot 0{,}3}{0{,}05}\,\text{T} = 1{,}2 \cdot 10^{-6}\,\text{T} = 1{,}2\,\mu\text{T}$.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un'onda elettromagnetica ha campo elettrico di ampiezza 15 V/m. Quanto valgono l'intensità media e l'ampiezza del campo magnetico? Scrivi l'intensità.`, suggerimenti: [R`$I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$; poi $B_0 = E_0 / c$.`], risposta: { tipo: 'numero', valore: 0.299, unita: 'W/m²' }, soluzione: [R`$I = \tfrac{1}{2} \cdot 3 \cdot 10^8 \cdot 8{,}85 \cdot 10^{-12} \cdot 15^2\,\text{W/m}^2 \approx 0{,}299\,\text{W/m}^2$.`, R`$B_0 = \dfrac{15}{3 \cdot 10^8}\,\text{T} = 5 \cdot 10^{-8}\,\text{T}$.`] },
    { id: 'es-04', difficolta: 2, testo: R`Il Sole irradia una potenza di $3{,}8 \cdot 10^{26}\,\text{W}$. Marte dista dal Sole circa $2{,}28 \cdot 10^{11}\,\text{m}$. Qual è l'intensità della luce del Sole su Marte?`, suggerimenti: [R`La potenza si spalma su una sfera di raggio pari alla distanza Sole–Marte.`], risposta: { tipo: 'numero', valore: 582, unita: 'W/m²' }, soluzione: [R`$I = \dfrac{3{,}8 \cdot 10^{26}\,\text{W}}{4\pi \cdot (2{,}28 \cdot 10^{11}\,\text{m})^2} = \dfrac{3{,}8 \cdot 10^{26}}{6{,}53 \cdot 10^{23}}\,\text{W/m}^2 \approx 582\,\text{W/m}^2$.`, R`Meno della metà che vicino alla Terra: Marte è circa una volta e mezza più lontano, e $1{,}5^2 \approx 2{,}3$.`] },
    { id: 'es-05', difficolta: 2, testo: R`All'altezza di Venere la luce del Sole ha intensità $2600\,\text{W/m}^2$. Che forza esercita su una vela di $100\,\text{m}^2$ che la assorbe tutta, perpendicolare ai raggi? Rispondi in millinewton.`, suggerimenti: [R`Pressione di radiazione su una superficie che assorbe: $p = I / c$.`, R`Forza: pressione per area.`], risposta: { tipo: 'numero', valore: 0.867, unita: 'mN' }, soluzione: [R`$p = \dfrac{2600}{3 \cdot 10^8}\,\text{Pa} \approx 8{,}67 \cdot 10^{-6}\,\text{Pa}$.`, R`$F = p \cdot S = 8{,}67 \cdot 10^{-6} \cdot 100\,\text{N} \approx 8{,}67 \cdot 10^{-4}\,\text{N} = 0{,}867\,\text{mN}$: il peso di tre o quattro chicchi di riso, ma non smette mai.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un telefono trasmette con una potenza di 0,25 W, che supponiamo uguale in tutte le direzioni. Quanto vale l'ampiezza del campo elettrico a 1 m?`, suggerimenti: [R`Prima l'intensità: $I = \dfrac{P}{4\pi \cdot r^2}$.`, R`Poi $E_0 = \sqrt{\dfrac{2 \cdot I}{c \cdot \varepsilon_0}}$.`], risposta: { tipo: 'numero', valore: 3.87, unita: 'V/m' }, soluzione: [R`$I = \dfrac{0{,}25}{4\pi}\,\text{W/m}^2 \approx 0{,}0199\,\text{W/m}^2$.`, R`$E_0 = \sqrt{\dfrac{2 \cdot 0{,}0199}{3 \cdot 10^8 \cdot 8{,}85 \cdot 10^{-12}}}\,\text{V/m} \approx 3{,}87\,\text{V/m}$.`] },
    { id: 'es-07', difficolta: 1, testo: R`Un'antenna ricevente a dipolo, due aste in fila, funziona bene se è lunga in tutto mezza lunghezza d'onda. Quanto deve essere lunga per un segnale a 150 MHz?`, suggerimenti: [R`Prima la lunghezza d'onda, $\lambda = c / f$; poi la metà.`], risposta: { tipo: 'numero', valore: 1, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{3 \cdot 10^8}{1{,}5 \cdot 10^8}\,\text{m} = 2\,\text{m}$, quindi l'antenna è lunga $1\,\text{m}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Un impulso laser parte da un osservatorio, si riflette sugli specchi lasciati sulla Luna e torna dopo 2,5 s. Quanto dista la Luna, in metri?`, suggerimenti: [R`In 2,5 s la luce fa andata e ritorno.`], risposta: { tipo: 'numero', valore: 3.75e8, unita: 'm' }, soluzione: [R`$\Delta s = \dfrac{c \cdot \Delta t}{2} = \dfrac{3 \cdot 10^8 \cdot 2{,}5}{2}\,\text{m} = 3{,}75 \cdot 10^8\,\text{m}$.`, R`Il valore vero cambia lungo il mese, fra circa 356 000 e 407 000 km.`] },
    { id: 'es-09', difficolta: 2, testo: R`Un'onda ha intensità $2\,\text{W/m}^2$. Se l'ampiezza del suo campo elettrico diventa tripla, quanto diventa l'intensità?`, suggerimenti: [R`L'intensità va con il quadrato dell'ampiezza.`], risposta: { tipo: 'numero', valore: 18, unita: 'W/m²' }, soluzione: [R`$I \propto E_0^2$: ampiezza tripla, intensità $3^2 = 9$ volte tanto.`, R`$9 \cdot 2 = 18\,\text{W/m}^2$.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un condensatore piano ha armature di $0{,}02\,\text{m}^2$ distanti 1 mm, con il vuoto in mezzo. La tensione cresce di $3 \cdot 10^4\,\text{V}$ al secondo. Quanto vale la corrente di spostamento, in microampere?`, suggerimenti: [R`Nel condensatore piano $E = V / d$: il campo cresce di $\dfrac{\Delta V / \Delta t}{d}$ ogni secondo.`, R`$I_s = \varepsilon_0 \cdot S \cdot \dfrac{\Delta E}{\Delta t}$.`], risposta: { tipo: 'numero', valore: 5.31, unita: 'μA' }, soluzione: [R`$\dfrac{\Delta E}{\Delta t} = \dfrac{3 \cdot 10^4\,\text{V/s}}{10^{-3}\,\text{m}} = 3 \cdot 10^7\,\text{V/(m}\cdot\text{s)}$.`, R`$I_s = 8{,}85 \cdot 10^{-12} \cdot 0{,}02 \cdot 3 \cdot 10^7\,\text{A} \approx 5{,}31 \cdot 10^{-6}\,\text{A} = 5{,}31\,\mu\text{A}$.`, R`Controllo: è $C \cdot \dfrac{\Delta V}{\Delta t}$, con $C = \dfrac{\varepsilon_0 \cdot S}{d} \approx 1{,}77 \cdot 10^{-10}\,\text{F}$. Torna.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa crea, nello spazio vuoto, un campo magnetico che cambia?`, opzioni: [R`Una corrente, ma solo se c'è un filo di rame`, R`Un campo magnetico costante`, R`Un campo elettrico con le linee chiuse`, R`Nuove cariche elettriche`], corretta: 2, spiegazione: R`È la legge di Faraday-Neumann letta da Maxwell: B che cambia crea un campo elettrico che gli gira attorno. Il filo serve solo a rivelarlo con una corrente; cariche nuove non se ne creano.` },
    { id: 'q-02', domanda: R`Che cos'è la corrente di spostamento?`, opzioni: [R`Un campo elettrico che cambia, che crea un campo magnetico come una corrente`, R`Un flusso di elettroni che salta da un'armatura all'altra`, R`La corrente che si perde nei fili per effetto Joule`, R`La corrente che scorre quando si sposta un condensatore`], corretta: 0, spiegazione: R`Fra le armature non passano cariche. Il flusso del campo elettrico cambia, e questo crea un campo magnetico come farebbe la corrente $I_s = \varepsilon_0 \cdot \Delta\Phi_E / \Delta t$.` },
    { id: 'q-03', domanda: R`Quale legge Maxwell completò con un termine nuovo?`, opzioni: [R`Il teorema di Gauss per il campo elettrico`, R`Il teorema di Gauss per il campo magnetico`, R`La legge di Faraday-Neumann`, R`Il teorema di Ampère`], corretta: 3, spiegazione: R`Al teorema di Ampère aggiunse la corrente di spostamento: $\Gamma_B = \mu_0 \cdot (I_c + I_s)$. Le altre tre leggi c'erano già, nella sostanza: il teorema di Gauss, l'assenza di poli isolati e l'induzione di Faraday.` },
    { id: 'q-04', domanda: R`In un'onda elettromagnetica, come sono disposti i campi E e B?`, opzioni: [R`Paralleli fra loro e alla direzione dell'onda`, R`Perpendicolari fra loro e alla direzione dell'onda`, R`E lungo la direzione dell'onda, B di traverso`, R`Nella stessa direzione, ma con versi opposti`], corretta: 1, spiegazione: R`E e B sono perpendicolari fra loro e tutti e due perpendicolari alla direzione in cui l'onda va: l'onda è trasversale. Per questo la luce si può polarizzare.` },
    { id: 'q-05', domanda: R`Quale di queste cariche **non** emette onde elettromagnetiche?`, opzioni: [R`Un elettrone che oscilla in un'antenna`, R`Un elettrone che gira in cerchio in un acceleratore`, R`Una carica che va dritta a velocità costante`, R`Un elettrone frenato di colpo in un tubo a raggi X`], corretta: 2, spiegazione: R`Irradiano solo le cariche accelerate. Anche chi gira in cerchio accelera, perché cambia direzione. La carica a velocità costante crea un campo magnetico, ma non emette onde.` },
    { id: 'q-06', domanda: R`Nel vuoto, un'onda radio lunga 100 m e la luce verde…`, opzioni: [R`vanno alla stessa velocità`, R`la luce va più veloce, perché ha frequenza più alta`, R`l'onda radio va più veloce, perché è più lunga`, R`dipende dalla potenza della sorgente`], corretta: 0, spiegazione: R`Nel vuoto tutte le onde elettromagnetiche vanno a $c = 1/\sqrt{\varepsilon_0 \cdot \mu_0}$, che non contiene né la frequenza né la potenza.` },
    { id: 'q-07', domanda: R`Quale elenco va in ordine di frequenza crescente?`, opzioni: [R`raggi X, visibile, microonde, radio`, R`visibile, radio, microonde, raggi X`, R`radio, raggi X, visibile, microonde`, R`radio, microonde, visibile, raggi X`], corretta: 3, spiegazione: R`La frequenza cresce quando la lunghezza d'onda si accorcia: radio (metri), microonde (centimetri), visibile (centinaia di nanometri), raggi X (dimensioni di un atomo). L'elenco che parte dai raggi X va al contrario.` },
    { id: 'q-08', domanda: R`L'ampiezza del campo elettrico di un'onda raddoppia. Che cosa succede all'intensità?`, opzioni: [R`Raddoppia`, R`Diventa quattro volte tanto`, R`Resta uguale`, R`Si dimezza`], corretta: 1, spiegazione: R`$I = \tfrac{1}{2} \cdot c \cdot \varepsilon_0 \cdot E_0^2$: l'intensità va con il quadrato dell'ampiezza, $2^2 = 4$.` },
    { id: 'q-09', domanda: R`Perché la luce del Sole arriva sulla Terra e il suono del Sole no?`, opzioni: [R`Perché l'onda elettromagnetica è fatta di campi, che esistono anche nel vuoto`, R`Perché la luce è più veloce del suono`, R`Perché il suono si spegne per la distanza`, R`Perché il suono, fra il Sole e la Terra, viene assorbito dall'atmosfera`], corretta: 0, spiegazione: R`Il suono ha bisogno di un mezzo che vibri, e fra il Sole e la Terra c'è il vuoto: non c'è niente da assorbire né da far vibrare. L'onda elettromagnetica non ha bisogno di un mezzo. La velocità non c'entra.` },
    { id: 'q-10', domanda: R`Che cosa dice la formula $c = 1/\sqrt{\varepsilon_0 \cdot \mu_0}$?`, opzioni: [R`Che la luce va più veloce nei materiali con costante dielettrica grande`, R`Che la velocità della luce dipende dalla frequenza`, R`Che la velocità della luce si ricava da misure di elettricità e magnetismo`, R`Che la velocità della luce cambia con la potenza della sorgente`], corretta: 2, spiegazione: R`$\varepsilon_0$ e $\mu_0$ si misurano con cariche e correnti, e il conto dà la velocità della luce. Nei materiali la costante dielettrica è più grande e la luce va più piano, non più veloce.` },
    { id: 'q-11', domanda: R`Una superficie chiusa contiene una carica positiva; un'altra contiene il polo nord di una calamita. Che cosa si può dire dei flussi $\Phi_E$ e $\Phi_B$?`, opzioni: [R`Sono zero tutti e due`, R`Sono positivi tutti e due`, R`$\Phi_E$ è zero, $\Phi_B$ è positivo`, R`$\Phi_E$ è positivo, $\Phi_B$ è zero`], corretta: 3, spiegazione: R`Le linee di E nascono dalle cariche: con una carica positiva dentro, $\Phi_E = Q / \varepsilon_0$ è positivo. Le linee di B sono chiuse: ogni linea che esce ci rientra, e $\Phi_B = 0$. Sono i due teoremi di Gauss, per il campo elettrico e per il campo magnetico.` },
    { id: 'q-12', domanda: R`Quanto vale la circuitazione del campo elettrico prodotto da cariche ferme?`, opzioni: [R`Dipende dalla carica abbracciata`, R`Zero`, R`$\mu_0 \cdot I$`, R`$Q / \varepsilon_0$, con $Q$ la carica abbracciata`], corretta: 1, spiegazione: R`Il campo delle cariche ferme è conservativo: lungo un giro chiuso il lavoro è zero. La circuitazione è diversa da zero solo se B cambia. $Q / \varepsilon_0$ è il flusso da una superficie chiusa (Gauss), $\mu_0 \cdot I$ la circuitazione di B.` },
    { id: 'q-13', domanda: R`In un'onda elettromagnetica nel vuoto, come si divide l'energia fra campo elettrico e campo magnetico?`, opzioni: [R`Quasi tutta nel campo elettrico, perché B è piccolissimo`, R`Quasi tutta nel campo magnetico`, R`Metà e metà`, R`Dipende dalla frequenza`], corretta: 2, spiegazione: R`B è piccolo in tesla, ma la sua energia è $B^2 / (2 \cdot \mu_0)$, e $\mu_0$ è piccolissimo. Con $B = E/c$ viene esattamente $\tfrac{1}{2} \cdot \varepsilon_0 \cdot E^2$, come la parte elettrica.` },
    { id: 'q-14', domanda: R`Quale di queste onde è ionizzante, cioè stacca elettroni dagli atomi?`, opzioni: [R`I raggi X`, R`Le microonde`, R`Le onde radio`, R`L'infrarosso`], corretta: 0, spiegazione: R`Sono ionizzanti l'ultravioletto più corto, i raggi X e i gamma. Microonde, radio e infrarosso scaldano, ma non staccano elettroni.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`La corrente di spostamento non è un moto di cariche: fra le armature non salta niente. È il campo elettrico che cambia.` },
    { tipo: 'errore', testo: R`Nel vuoto tutte le onde elettromagnetiche vanno a $c$. Frequenza alta non vuol dire velocità alta: vuol dire lunghezza d'onda corta.` },
    { tipo: 'errore', testo: R`L'intensità va con il **quadrato** del campo. Campo doppio, intensità quattro volte.` },
    { tipo: 'trucco', testo: R`Per E e B nell'onda ricorda $E = c \cdot B$: il campo magnetico in tesla è sempre un numero minuscolo.` },
    { tipo: 'trucco', testo: R`Nei conti di intensità $c \cdot \varepsilon_0 \approx 2{,}655 \cdot 10^{-3}$: tienilo pronto, torna spesso.` },
    { tipo: 'metodo', testo: R`Con le circuitazioni scegli una linea dove il campo è tangente e uguale ovunque, di solito un cerchio. Allora la circuitazione è campo per circonferenza.` },
    { tipo: 'metodo', testo: R`Le quattro equazioni si ricordano a coppie: due flussi (Gauss per E e per B) e due circuitazioni (Faraday-Neumann e Ampère-Maxwell).` }
  ],
  aneddoti: [
    { fisico: 'James Clerk Maxwell', anni: '1831–1879', titolo: 'Il conto fatto in campagna, senza i libri', testo: R`Nell'estate del 1861 James Clerk Maxwell era a Glenlair, la sua casa di campagna in Scozia. Lavorava a un modello meccanico del campo magnetico, fatto di vortici e piccole ruote. Con quel modello calcolò la velocità di un'onda di traverso nel mezzo. Il risultato dipendeva solo da misure elettriche e magnetiche. A Glenlair però non aveva con sé i numeri degli esperimenti. Tornato a Londra in autunno, li confrontò. Dalle misure elettriche di Wilhelm Weber e Rudolf Kohlrausch, nel suo conto veniva circa 310 000 km/s. Fizeau aveva misurato la luce: circa 315 000 km/s. Maxwell lo raccontò a Faraday in una lettera dell'ottobre 1861. Nel 1862 scrisse che era difficile non concludere che la luce fosse fatta di onde elettromagnetiche.`, legame: R`È la scoperta che $c = 1/\sqrt{\varepsilon_0 \cdot \mu_0}$ è la velocità della luce.` },
    { fisico: 'Heinrich Hertz', anni: '1857–1894', titolo: 'Le scintille nella stanza buia', testo: R`Nel 1886 Heinrich Hertz insegnava al Politecnico di Karlsruhe. Costruì un trasmettitore con due sfere di metallo collegate a un rocchetto a induzione. Fra le sfere scoccavano scintille, e le cariche oscillavano avanti e indietro. Come ricevitore usava un anello di filo aperto in un punto. Nella stanza al buio, a qualche metro, fra le punte dell'anello comparivano scintille minuscole. Qualcosa aveva attraversato l'aria senza fili. Nel 1888 Hertz fece riflettere le onde su una grande lastra di zinco. Misurò la loro lunghezza con le onde stazionarie. Mostrò che si riflettono, si rifrangono e si polarizzano come la luce. Maxwell aveva ragione, ma era morto da nove anni. Hertz morì nel 1894, a 36 anni.`, legame: R`È la prima prova sperimentale delle onde elettromagnetiche previste dalle equazioni di Maxwell.` },
    { fisico: 'Guglielmo Marconi', anni: '1874–1937', titolo: 'Tre punti attraverso l\'oceano', testo: R`Poco più che ventenne, Guglielmo Marconi provava le onde di Hertz nella villa di famiglia a Pontecchio, vicino a Bologna. Nel 1895 riuscì a mandare un segnale oltre una collina. Nel 1896 si trasferì a Londra e brevettò il suo sistema. Il 12 dicembre 1901 era a St. John's, in Terranova, con una cuffia collegata a un'antenna sollevata da un aquilone. Dall'altra parte dell'Atlantico, in Cornovaglia, la stazione di Poldhu batteva la lettera S dell'alfabeto Morse: tre punti. Marconi disse di averla sentita. Alcuni storici ne dubitano, perché il segnale era debolissimo e confuso con il rumore. Negli anni seguenti, però, i messaggi attraverso l'oceano diventarono normali. Nel 1909 ebbe il premio Nobel per la fisica, insieme a Ferdinand Braun.`, legame: R`Sono le onde radio, la parte più lunga dello spettro elettromagnetico, usate per comunicare.` },
    { fisico: 'William Herschel', anni: '1738–1822', titolo: 'Il termometro oltre il rosso', testo: R`William Herschel era un musicista tedesco trasferito in Inghilterra, diventato astronomo: nel 1781 aveva scoperto Urano. Nel 1800 volle sapere quale colore della luce del Sole scaldasse di più. Fece passare la luce in un prisma e mise dei termometri nei diversi colori, con il bulbo annerito. La temperatura cresceva dal violetto verso il rosso. Poi spostò un termometro oltre il rosso, dove non si vedeva niente. Lì la temperatura saliva ancora di più. Herschel concluse che il Sole manda anche raggi invisibili che scaldano, e li chiamò raggi calorifici. Oggi li chiamiamo infrarosso. L'anno dopo Johann Ritter, dall'altra parte dello spettro, trovò l'ultravioletto: anneriva il cloruro d'argento più del violetto.`, legame: R`È la scoperta che lo spettro continua oltre il visibile, con onde che l'occhio non vede.` }
  ]
});
})();
