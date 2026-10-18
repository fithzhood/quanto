/* Quanto — La fisica dei quanti (quinto anno): corpo nero e quanti di Planck, effetto fotoelettrico, il fotone e la sua
   quantità di moto (Compton), lo spettro a righe e l'atomo di Bohr, le onde di materia di de Broglie, il principio di
   indeterminazione. Contratto in SCHEMA.md, modello cinematica.js.
   Simboli come nei video quanti/* e negli argomenti vicini: f frequenza e λ lunghezza d'onda con c = λ·f (luce.js),
   h costante di Planck (6,63·10⁻³⁴ J·s, come nei video), 1 eV = 1,60·10⁻¹⁹ J (potenziale.js), W lavoro di estrazione e
   K_max energia cinetica massima degli elettroni (video fotoelettrico: K = h·f − W), f₀ frequenza di soglia, V₀
   potenziale d'arresto, Eₙ = −13,6 eV/n² (video bohr), p quantità di moto (relativita.js), a larghezza della fessura
   (luce.js e video heisenberg). Energia e risultati in verde (colore 3), velocità azzurre (1), guide grigie.
   Verifica: node strumenti/verifica-argomento.js argomenti/quanti.js */
(function () {
const R = String.raw;

/* il lavoro di estrazione del metallo scelto nel grafico «fotoelettrico»: 1 cesio, 2 sodio, 3 calcio, 4 zinco (eV) */
const WM = '(se(m < 1.5, 2.1, se(m < 2.5, 2.3, se(m < 3.5, 2.9, 4.3))))';
/* h in eV·s per 10¹⁴ Hz: K_max = 0,414·f − W, con f in 10¹⁴ Hz */
const HF = '0.4136';
/* l'energia dei livelli dell'idrogeno, in eV */
const EN = n => -13.6 / (n * n);

QUANTO.registra({
  id: 'quanti',
  titolo: 'La fisica dei quanti',
  introduzione: R`Verso la fine dell'Ottocento la fisica sembrava quasi completa. Restavano pochi fatti strani: il colore di un ferro rovente, la luce che strappa elettroni ai metalli, le righe di un gas acceso. Per spiegarli è servita una fisica nuova.

L'idea di partenza è semplice e sconvolgente. L'energia della luce non arriva in modo continuo, come l'acqua da un rubinetto. Arriva a **pacchetti**, come le gocce di un contagocce. Ogni pacchetto si chiama **quanto**, e dà il nome a questo capitolo e a questo sito. Dai quanti vengono i laser, i pannelli solari, i sensori delle fotocamere, i LED.

Servono le onde elettromagnetiche e la relazione $c = \lambda \cdot f$, l'esperimento di Young e l'elettronvolt.`,
  inBreve: [
    R`Un **corpo nero** emette uno spettro che dipende solo dalla temperatura. Il picco segue la legge di Wien, $\lambda_{\text{max}} \cdot T = 2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}$: più caldo vuol dire più blu.`,
    R`Planck: la radiazione si scambia a **quanti** di energia $E = h \cdot f$, con $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$. Più alta la frequenza, più grande il quanto.`,
    R`Nell'**effetto fotoelettrico** ogni fotone dà tutta la sua energia a un solo elettrone: $K_{\text{max}} = h \cdot f - W$. Conta la frequenza della luce, non la sua intensità.`,
    R`Il fotone ha anche **quantità di moto**: $p = \dfrac{h}{\lambda}$. La luce viaggia come un'onda e scambia energia come una particella.`,
    R`Nell'atomo di **Bohr** l'elettrone sta solo su livelli $E_n = -\dfrac{13{,}6\,\text{eV}}{n^2}$. Ogni salto verso il basso emette un fotone con $h \cdot f = E_i - E_f$: lo spettro a righe.`,
    R`Anche la materia è un'onda, con $\lambda = \dfrac{h}{m \cdot v}$ (de Broglie). Posizione e quantità di moto non si conoscono insieme meglio di $\Delta x \cdot \Delta p \ge \dfrac{h}{4\pi}$ (Heisenberg).`
  ],
  sezioni: [
    {
      id: 'corpo-nero',
      titolo: 'Il corpo nero e la catastrofe ultravioletta',
      testo: R`Un chiodo messo sul fuoco diventa prima rosso scuro, poi arancione, poi quasi bianco. Anche prima di brillare emette qualcosa: avvicinando la mano si sente il caldo. Ogni corpo emette onde elettromagnetiche. Quante e di che tipo, lo decide soprattutto la temperatura.

Il nostro corpo emette nell'infrarosso: non lo vediamo, ma una termocamera sì. Il Sole ha il massimo dello spettro nel visibile. Una stella azzurra è più calda di una stella rossa.

[[video:quanti/planck]]

Per studiare questa luce senza disturbi i fisici usavano un forno chiuso, con un forellino. La luce che entra dal foro rimbalza dentro e non esce più: il foro assorbe tutto. La luce che esce dal foro dipende solo dalla temperatura delle pareti.

>* Un **corpo nero** assorbe tutta la radiazione che riceve. Lo spettro che emette, cioè quanta luce esce per ogni lunghezza d'onda, dipende solo dalla sua temperatura assoluta $T$.

La curva dello spettro ha un massimo. Scaldando il corpo, il massimo si sposta verso le onde corte.

>* **Legge di Wien**: la lunghezza d'onda del massimo è inversamente proporzionale alla temperatura assoluta, $\lambda_{\text{max}} \cdot T = 2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}$.

~ \lambda_{\text{max}} = \dfrac{2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{T} :: ricavo la lunghezza d'onda dalla legge di Wien
~ \lambda_{\text{max}} = \dfrac{2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{310\,\text{K}} :: la pelle è a circa 37 °C, cioè 310 K
~ \lambda_{\text{max}} \approx \evidb{9{,}3 \cdot 10^{-6}\,\text{m}} :: 9,3 micrometri: infrarosso, quello che vedono le termocamere

[[grafico:corpo-nero]]

> Anche la potenza emessa cresce con la temperatura, e molto in fretta. Per la **legge di Stefan–Boltzmann** è $P = \sigma \cdot S \cdot T^4$, con $\sigma = 5{,}67 \cdot 10^{-8}\,\text{W/(m}^2 \cdot \text{K}^4)$ e $S$ la superficie. A temperatura doppia la potenza diventa 16 volte tanto.

Alla fine dell'Ottocento la curva era misurata con cura. Mancava una teoria che la spiegasse. La fisica classica divideva l'energia in parti uguali fra tutte le onde possibili nel forno. Le onde corte però sono infinite, e a ognuna toccava la sua parte. Il conto prevedeva una luce sempre più intensa verso l'ultravioletto, e un'energia totale infinita.

>! La teoria classica non è sbagliata dappertutto. Per le onde lunghe va d'accordo con le misure. Sbaglia, e di grosso, verso le onde corte: nel 1911 Paul Ehrenfest la chiamò **catastrofe ultravioletta**.

?? Una stella è azzurra, un'altra è rossa. Quale ha la superficie più calda?
[x] quella azzurra
[ ] quella rossa
[ ] dal colore non si può dire
=> Per la legge di Wien il massimo dello spettro va verso le onde corte quando la temperatura sale. Una stella azzurra ha il massimo verso il blu: è la più calda.`
    },
    {
      id: 'quanto',
      titolo: 'Il quanto di Planck',
      testo: R`Nel 1900, a Berlino, Max Planck trovò una formula che seguiva la curva misurata punto per punto. Per giustificarla dovette fare un'ipotesi che a lui stesso non piaceva.

Pensa a una rampa e a una scala. Sulla rampa ti puoi fermare a qualunque altezza. Sulla scala solo sui gradini. Per Planck l'energia che un corpo scambia con la luce è come una scala: va a gradini.

>* **Ipotesi di Planck**: un corpo emette e assorbe la radiazione di frequenza $f$ solo a pacchetti di energia $E = h \cdot f$, i **quanti**. La **costante di Planck** vale $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$.

Il quanto non ha una grandezza fissa. Fissa è $h$; il quanto $h \cdot f$ cresce con la frequenza. Un quanto di luce blu vale più di un quanto di luce rossa.

Così sparisce la catastrofe. Le onde corte hanno frequenza alta, quindi quanti molto cari. L'agitazione termica delle pareti raccoglie raramente tanta energia in una volta sola. Quei quanti escono di rado, e la curva scende verso l'ultravioletto. Con le onde lunghe i quanti costano poco, e tutto va come nella fisica classica.

Esempio. Quanta energia porta un quanto di luce blu, con $\lambda = 450\,\text{nm}$?

~ f = \dfrac{c}{\lambda} = \dfrac{3 \cdot 10^8\,\text{m/s}}{450 \cdot 10^{-9}\,\text{m}} :: prima la frequenza, dalla relazione $c = \lambda \cdot f$
~ f \approx 6{,}67 \cdot 10^{14}\,\text{Hz} :: seicentosessantamila miliardi di oscillazioni al secondo
~ E = h \cdot f :: l'ipotesi di Planck
~ E = 6{,}63 \cdot 6{,}67 \cdot 10^{-20}\,\text{J} :: $h$ per $f$: le mantisse si moltiplicano, gli esponenti si sommano ($-34 + 14$); J·s per Hz fa J
~ E \approx \evidb{4{,}4 \cdot 10^{-19}\,\text{J}} :: un'energia minuscola

Per energie così piccole si usa l'**elettronvolt**, lo stesso del potenziale: $1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$. Il quanto blu vale circa 2,8 eV. I quanti del visibile vanno da circa 1,8 eV (rosso) a 3,1 eV (violetto). In elettronvolt la costante di Planck vale $h = 4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}$.

Una lampada che emette 1 W di quella luce blu manda fuori circa $2 \cdot 10^{18}$ quanti al secondo. Sono così tanti che la luce ci sembra continua, come la sabbia che scende in una clessidra.

> *Quantum* in latino vuol dire «quanto»: una quantità precisa. Planck chiamò $h$ il «quanto d'azione». Per anni pensò che fosse solo un trucco di calcolo. In una lettera del 1931 al fisico americano Robert Wood la definì «un atto di disperazione».

>! L'energia non è sempre un multiplo dello stesso numero. Ogni frequenza ha il suo quanto: $h \cdot f$ cambia da colore a colore.

?? Due quanti: uno di luce rossa e uno di luce violetta. Quale porta più energia?
[ ] quello rosso, che ha la lunghezza d'onda più grande
[x] quello violetto
[ ] portano la stessa energia, perché vanno tutti e due a $c$
=> L'energia è $E = h \cdot f$. La luce violetta ha la frequenza più alta, quindi il quanto più grande. La lunghezza d'onda più grande va con la frequenza più piccola.`
    },
    {
      id: 'fotoelettrico',
      titolo: 'L\'effetto fotoelettrico',
      testo: R`Nel 1887 Heinrich Hertz notò che le sue scintille scoccavano più facilmente sotto la luce ultravioletta. L'anno dopo Wilhelm Hallwachs caricò negativamente una lastra di zinco. Sotto l'ultravioletto la lastra si scaricava; sotto la luce di una lampada comune, no. La luce strappava elettroni al metallo: è l'**effetto fotoelettrico**.

[[video:quanti/fotoelettrico]]

Le misure, fatte soprattutto da Philipp Lenard, mostravano tre fatti strani.

1. Sotto una certa frequenza, la **frequenza di soglia** $f_0$, non esce nessun elettrone. Neanche con una luce fortissima.
2. Sopra la soglia gli elettroni escono subito, anche con una luce debolissima.
3. L'energia degli elettroni dipende dalla frequenza della luce, non dalla sua intensità. L'intensità cambia solo quanti elettroni escono.

Con le onde classiche non torna niente. L'energia di un'onda si spande su tutta la lastra e si accumula col tempo. Una luce forte dovrebbe staccare elettroni di qualunque colore.

>* **Einstein, 1905**: la luce è fatta di quanti, i **fotoni**, ognuno con energia $h \cdot f$. Ogni fotone dà tutta la sua energia a un solo elettrone. Gli elettroni più veloci escono con l'energia cinetica $K_{\text{max}} = h \cdot f - W$.

$K$ è l'energia cinetica, quella che nei capitoli di meccanica si chiama $E_c$: per l'effetto fotoelettrico molti libri, e il video, usano $K$.

$W$ è il **lavoro di estrazione**: l'energia minima per strappare un elettrone al metallo. È un lavoro, che negli altri argomenti si chiama $L$: qui si usa la lettera dei libri sul fotoelettrico. Dipende dal metallo: circa 2,1 eV per il cesio, 4,3 eV per lo zinco. Se $h \cdot f$ è minore di $W$, l'elettrone resta dentro. Per questo esiste la soglia: $f_0 = \dfrac{W}{h}$.

Esempio. Sulla lastra di zinco arriva ultravioletto di 200 nm.

~ f = \dfrac{3 \cdot 10^8\,\text{m/s}}{2{,}00 \cdot 10^{-7}\,\text{m}} :: prima la frequenza, $f = c / \lambda$, con 200 nm in metri
~ f = 1{,}5 \cdot 10^{15}\,\text{Hz} :: ultravioletto
~ E = 4{,}14 \cdot 1{,}5\,\text{eV} \approx 6{,}2\,\text{eV} :: $E = h \cdot f$ con $h = 4{,}14 \cdot 10^{-15}$ eV·s: le potenze di dieci si semplificano
~ K_{\text{max}} = 6{,}2\,\text{eV} - 4{,}3\,\text{eV} :: l'equazione di Einstein, con $W = 4{,}3$ eV per lo zinco
~ K_{\text{max}} = \evidb{1{,}9\,\text{eV}} :: quello che avanza diventa energia cinetica

Per misurare $K_{\text{max}}$ si mette davanti alla lastra un elettrodo negativo. Gli elettroni devono risalire una differenza di potenziale. Il **potenziale d'arresto** $V_0$ è quello che ferma anche i più veloci: $e \cdot V_0 = K_{\text{max}}$, con $e = 1{,}60 \cdot 10^{-19}\,\text{C}$ la carica dell'elettrone (in modulo).

[[grafico:fotoelettrico]]

>! Una luce più intensa non dà elettroni più veloci. Porta più fotoni al secondo, quindi più elettroni, tutti con la stessa energia massima.

?? Una luce sopra la soglia stacca elettroni da un metallo. Se si raddoppia l'intensità della luce, che cosa succede?
[ ] l'energia cinetica massima raddoppia
[x] raddoppia il numero di elettroni, l'energia massima resta uguale
[ ] la soglia si abbassa
=> Raddoppiare l'intensità vuol dire raddoppiare i fotoni al secondo, con la stessa frequenza. Ogni fotone ha la stessa energia $h \cdot f$: escono più elettroni, ma non più veloci. La soglia dipende solo dal metallo.

> Sulla stessa idea funzionano le fotocellule delle porte automatiche e i sensori delle fotocamere. Anche nelle celle solari un fotone libera un elettrone, ma dentro il materiale.`
    },
    {
      id: 'fotone',
      titolo: 'Il fotone: energia e quantità di moto',
      testo: R`Il nome **fotone** lo propose il chimico Gilbert Lewis nel 1926. Il fotone non ha massa e nel vuoto va sempre a $c$. Porta l'energia $E = h \cdot f$. E porta anche una spinta, come una pallina che urta.

>* Un fotone di lunghezza d'onda $\lambda$ ha **quantità di moto** $p = \dfrac{E}{c} = \dfrac{h}{\lambda}$.

La relazione $p = E/c$ vale per tutto ciò che non ha massa. Per il fotone non si può usare $p = m \cdot v$: la massa è zero, eppure $p$ non lo è.

~ p = \dfrac{h}{\lambda} :: un fotone di raggi X di 0,071 nm, come quelli usati da Compton
~ p = \dfrac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}}{7{,}1 \cdot 10^{-11}\,\text{m}} :: i nanometri in metri; J·s/m sono kg·m/s
~ p \approx \evidb{9{,}3 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}} :: migliaia di volte quella di un fotone visibile

Nel 1923 Arthur Compton mandò raggi X contro un blocchetto di grafite. I raggi deviati uscivano con una lunghezza d'onda un po' più lunga. Con le onde classiche non si spiega: un'onda deviata conserva la sua frequenza. Con i fotoni sì. Il fotone urta un elettrone come una palla da biliardo e gli cede energia e quantità di moto. Esce con meno energia, quindi con $\lambda$ più grande.

Il conto, con la conservazione dell'energia e della quantità di moto, dà l'**effetto Compton**:

$$\Delta\lambda = \dfrac{h}{m_e \cdot c} \cdot (1 - \cos\theta)$$

Qui $\theta$ è l'angolo di deviazione e $m_e$ la massa dell'elettrone; $\dfrac{h}{m_e \cdot c} \approx 2{,}43 \cdot 10^{-12}\,\text{m}$. Per i raggi X da 0,071 nm la variazione arriva a qualche per cento. Per la luce visibile sarebbe un millesimo di per cento: per questo servivano i raggi X.

> La spinta dei fotoni spiega la **pressione di radiazione** delle onde elettromagnetiche. Ogni fotone assorbito cede la sua quantità di moto $h/\lambda$.

Allora la luce è un'onda o una pioggia di fotoni? È tutte e due le cose. Viaggia come un'onda e fa le frange di Young. Scambia energia e quantità di moto a fotoni, uno alla volta. Nel 1909 Geoffrey Taylor fotografò le frange di diffrazione attorno all'ombra di un ago, con una luce debolissima. I fotoni passavano in pratica uno alla volta, e l'esposizione durò mesi. Le frange c'erano lo stesso. È il **dualismo onda–corpuscolo**.

>! Il fotone non è una pallina che segue una strada precisa. Dove arriva lo decide l'onda: dove l'onda è intensa, arrivano tanti fotoni.

?? Un fotone di luce violetta e uno di luce rossa. Quale ha la quantità di moto più grande?
[x] quello violetto
[ ] quello rosso
[ ] nessuno dei due: i fotoni non hanno massa
=> Da $p = h/\lambda$: la lunghezza d'onda più corta dà la quantità di moto più grande. Il fotone non ha massa, ma la quantità di moto sì.`
    },
    {
      id: 'bohr',
      titolo: 'Lo spettro a righe e l\'atomo di Bohr',
      testo: R`Un filamento incandescente, scomposto con un prisma, dà tutti i colori: uno **spettro continuo**. Un gas rarefatto, acceso da una scarica elettrica, dà invece poche righe colorate: uno **spettro a righe**. Ogni elemento ha le sue righe, come un'impronta digitale.

Anche la luce del Sole ha righe, ma scure: la luce che manca. Le studiò Joseph von Fraunhofer nel 1814. Nel 1868 una riga gialla mai vista rivelò un elemento nuovo nel Sole: l'**elio**, da *helios*, «sole». Sulla Terra fu trovato solo nel 1895.

Nel 1911 Ernest Rutherford scoprì che l'atomo ha un nucleo piccolissimo, con gli elettroni attorno. Ma per la fisica classica un elettrone che gira irraggia. Perdendo energia, dovrebbe cadere sul nucleo in meno di un miliardesimo di secondo.

[[video:quanti/bohr]]

>* **Modello di Bohr (1913)**: l'elettrone dell'idrogeno sta solo su certe orbite, numerate da $n = 1, 2, 3, \ldots$ Su ognuna ha un'energia fissa, $E_n = -\dfrac{13{,}6\,\text{eV}}{n^2}$, e non irraggia. Saltando a un livello più basso emette un fotone con $h \cdot f = E_i - E_f$.

L'energia è negativa perché l'elettrone è legato. Il livello più basso, $n = 1$, è lo **stato fondamentale**. Per strappare l'elettrone da lì servono 13,6 eV: è l'**energia di ionizzazione**. Le orbite crescono come $n^2$: $r_n = n^2 \cdot r_1$, con $r_1 = 0{,}053\,\text{nm}$.

~ \Delta E = E_2 - E_1 :: il salto da $n = 2$ a $n = 1$: partenza meno arrivo
~ \Delta E = -3{,}4\,\text{eV} + 13{,}6\,\text{eV} :: $E_2 = -13{,}6/4 = -3{,}4$ eV ed $E_1 = -13{,}6$ eV
~ \Delta E = 10{,}2\,\text{eV} :: è l'energia del fotone emesso
~ f = \dfrac{10{,}2\,\text{eV}}{4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}} :: la frequenza del fotone, $f = \Delta E / h$
~ f \approx 2{,}46 \cdot 10^{15}\,\text{Hz} :: gli elettronvolt si semplificano
~ \lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{2{,}46 \cdot 10^{15}\,\text{Hz}} :: la lunghezza d'onda, $\lambda = c / f$
~ \lambda \approx \evidb{1{,}22 \cdot 10^{-7}\,\text{m}} :: 122 nm, ultravioletto: questa riga non si vede

Fra i salti che finiscono su $n = 2$ ci sono le quattro righe visibili dell'idrogeno, le righe di Balmer.

[[grafico:livelli]]

Vale anche al contrario. Un atomo assorbe un fotone solo se la sua energia è uguale a un salto fra due livelli. Per questo nella luce del Sole mancano proprio le righe dei gas della sua atmosfera.

> Nel 1914 James Franck e Gustav Hertz mandarono elettroni in un vapore di mercurio. Gli atomi assorbivano energia solo a pacchetti di 4,9 eV. Era la prova che i livelli esistono davvero.

>! Le orbite di Bohr non sono strade vere, come quelle dei pianeti. Sono un modello, e funziona bene solo per l'idrogeno. I livelli di energia invece sono veri, e si misurano.

?? Un atomo di idrogeno nello stato fondamentale riceve un fotone di 5 eV. Che cosa succede?
[ ] l'elettrone sale a metà strada fra $n = 1$ e $n = 2$
[x] il fotone non viene assorbito
[ ] l'elettrone viene strappato dall'atomo
=> Per salire da $n = 1$ a $n = 2$ servono esattamente 10,2 eV. Livelli intermedi non esistono: un fotone da 5 eV passa senza essere assorbito.`
    },
    {
      id: 'de-broglie',
      titolo: 'Le onde di materia',
      testo: R`La luce, che è un'onda, si comporta anche da particella. Nel 1924 un giovane francese, Louis de Broglie, si chiese se valesse anche il contrario. Un elettrone, che è una particella, si comporta anche da onda?

[[video:quanti/de-broglie]]

>* **Ipotesi di de Broglie**: a ogni particella con quantità di moto $p = m \cdot v$ è associata un'onda di lunghezza $\lambda = \dfrac{h}{p} = \dfrac{h}{m \cdot v}$.

È la stessa formula del fotone, letta al contrario. Ma $h$ è piccolissima. Per un oggetto di tutti i giorni $\lambda$ è molto più piccola di un nucleo: nessun effetto d'onda si può vedere. Per un elettrone, che ha una massa minuscola, la lunghezza d'onda diventa misurabile.

Esempio. Nella prima orbita di Bohr l'elettrone va a circa $2{,}2 \cdot 10^6\,\text{m/s}$.

~ p = m \cdot v :: la quantità di moto dell'elettrone
~ p = 9{,}11 \cdot 2{,}2 \cdot 10^{-25}\,\text{kg} \cdot \text{m/s} :: $m = 9{,}11 \cdot 10^{-31}$ kg per $v = 2{,}2 \cdot 10^6$ m/s: gli esponenti si sommano
~ p \approx 2{,}0 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s} :: piccolissima, ma anche $h$ lo è
~ \lambda = \dfrac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}}{2{,}0 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}} :: l'ipotesi di de Broglie, $\lambda = h/p$
~ \lambda \approx \evidb{0{,}33\,\text{nm}} :: proprio la lunghezza dell'orbita, $2\pi \cdot 0{,}053\,\text{nm}$

Il risultato è sorprendente. L'onda dell'elettrone sta sulla prima orbita una volta esatta, come un'onda stazionaria. Sulla seconda ci sta due volte, sulla terza tre. Le orbite permesse di Bohr sono quelle su cui l'onda si chiude su se stessa.

In formula: $2\pi \cdot r_n = n \cdot \lambda$. Con $\lambda = h/(m \cdot v)$ diventa $m \cdot v \cdot r_n = n \cdot \dfrac{h}{2\pi}$: è la regola con cui Bohr aveva scelto le orbite.

Nel 1927 due gruppi videro le onde degli elettroni. In America Clinton Davisson e Lester Germer le fecero riflettere su un cristallo di nichel. In Scozia George Paget Thomson le fece passare attraverso fogli sottili di metallo. Curiosità: suo padre, J. J. Thomson, aveva vinto il Nobel nel 1906 per aver mostrato che l'elettrone è una particella. Il figlio lo vinse nel 1937 per aver mostrato che è un'onda.

[[grafico:onda-elettrone]]

Con gli elettroni sparati uno alla volta contro due fenditure si formano, punto dopo punto, le frange di Young. A Bologna lo fecero nel 1974 Pier Giorgio Merli, Gian Franco Missiroli e Giulio Pozzi. Ogni elettrone arriva in un punto solo. L'onda dice la **probabilità** di trovarlo in ogni punto: è l'interpretazione di Max Born, del 1926.

> Il **microscopio elettronico** usa onde di elettroni invece della luce. La loro lunghezza d'onda è migliaia di volte più corta di quella del visibile. Così si vedono dettagli che la luce non può mostrare, come i virus.

?? Un elettrone e un protone vanno alla stessa velocità. Quale ha la lunghezza d'onda più grande?
[x] l'elettrone
[ ] il protone
[ ] hanno la stessa lunghezza d'onda
=> Da $\lambda = h / (m \cdot v)$: a parità di velocità, la massa più piccola dà la lunghezza d'onda più grande. Il protone ha una massa circa 1836 volte quella dell'elettrone.`
    },
    {
      id: 'heisenberg',
      titolo: 'Il principio di indeterminazione',
      testo: R`Per sapere dove passa un elettrone, lo si può far passare da una fessura stretta. Più la fessura è stretta, meglio si conosce la sua posizione. Ma dietro la fessura succede qualcosa di inatteso.

[[video:quanti/heisenberg]]

Con la luce si vede bene. Dopo una fessura larga $a$ l'onda si apre a ventaglio: è la diffrazione. Il primo buio cade dove $\sin\theta = \lambda / a$. Un fotone che passa era nella fessura: la sua posizione di traverso è nota entro $\Delta x = a$. Dopo, va in una direzione incerta dentro il ventaglio.

~ p = \dfrac{h}{\lambda} :: la quantità di moto del fotone
~ \Delta p \approx p \cdot \sin\theta :: la parte di traverso, fino al primo buio
~ \Delta p \approx \dfrac{h}{\lambda} \cdot \dfrac{\lambda}{a} = \evidb{\dfrac{h}{a}} :: la lunghezza d'onda si semplifica

Stringendo la fessura, $\Delta x$ cala e $\Delta p$ cresce: il prodotto resta circa $h$. Per un elettrone vale lo stesso, con la sua onda di de Broglie.

>* **Principio di indeterminazione di Heisenberg (1927)**: la posizione $x$ e la quantità di moto $p$ di una particella non si possono conoscere insieme con precisione qualsiasi. Le loro indeterminazioni rispettano $\Delta x \cdot \Delta p \ge \dfrac{h}{4\pi}$.

Il limite vale $\dfrac{h}{4\pi} \approx 5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}$. Per una palla o un'auto è niente. Per un elettrone dentro un atomo è tantissimo.

Esempio. Un elettrone sta dentro un atomo, largo circa $10^{-10}$ m.

~ \Delta p \ge \dfrac{h}{4\pi \cdot \Delta x} :: ricavo l'indeterminazione sulla quantità di moto
~ \Delta p \ge \dfrac{5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}}{10^{-10}\,\text{m}} :: la posizione è nota entro la grandezza dell'atomo
~ \Delta p \ge 5{,}3 \cdot 10^{-25}\,\text{kg} \cdot \text{m/s} :: l'indeterminazione minima sulla quantità di moto
~ \Delta v \ge \dfrac{5{,}3 \cdot 10^{-25}}{9{,}11 \cdot 10^{-31}}\,\text{m/s} :: $\Delta v = \Delta p / m$: divido per la massa dell'elettrone
~ \Delta v \ge \evidb{5{,}8 \cdot 10^5\,\text{m/s}} :: centinaia di chilometri al secondo

Un elettrone chiuso in un atomo non può stare fermo. Più lo si stringe vicino al nucleo, più si agita. Anche per questo l'elettrone non cade sul nucleo.

[[grafico:indeterminazione]]

>! L'indeterminazione non è un difetto degli strumenti. Nessuno strumento migliore la toglie: viene dalla natura d'onda della materia.

> C'è una relazione simile fra energia e tempo: $\Delta E \cdot \Delta t \ge \dfrac{h}{4\pi}$. Un livello che dura pochissimo ha un'energia un po' incerta, e la sua riga è un po' allargata.

?? Si dimezza la larghezza della fessura da cui passa un elettrone. L'indeterminazione minima sulla sua quantità di moto…
[ ] si dimezza
[x] raddoppia
[ ] resta uguale
=> Il prodotto $\Delta x \cdot \Delta p$ non può scendere sotto $h / (4\pi)$. Se $\Delta x$ si dimezza, il $\Delta p$ minimo raddoppia.`
    },
    {
      id: 'problemi',
      titolo: 'Come si imposta un problema sui quanti',
      testo: R`I numeri della fisica dei quanti sono strani: esponenti come $10^{-34}$, nanometri, elettronvolt. Gli errori nascono quasi sempre lì. Conviene seguire sempre gli stessi passi.

1. **Scrivi i dati con i loro simboli**, con le unità.
2. **Porta tutto in unità coerenti.** I nanometri in metri: $1\,\text{nm} = 10^{-9}\,\text{m}$. Gli elettronvolt in joule, se usi $h$ in J·s.
3. **Scegli la relazione giusta.** Energia e frequenza: $E = h \cdot f$. Lunghezza d'onda: $f = c / \lambda$. Quantità di moto: $p = h / \lambda$.
4. **Fai il conto con le potenze di dieci a parte.** Prima le mantisse, poi gli esponenti.
5. **Controlla l'ordine di grandezza.** Un fotone visibile vale qualche elettronvolt; un elettrone in un atomo ha $\lambda$ di qualche decimo di nanometro.

> In ogni problema: dati con i simboli, unità coerenti, la relazione giusta, potenze di dieci a parte, controllo dell'ordine di grandezza.

Un trucco fa risparmiare molti conti. Il prodotto $h \cdot c$, espresso in elettronvolt per nanometro, vale circa 1240. Allora l'energia di un fotone, in eV, è 1240 diviso la sua lunghezza d'onda in nanometri.

Esempio. Le fibre ottiche dei cavi internet usano infrarosso di 1550 nm.

~ E = \dfrac{h \cdot c}{\lambda} :: l'energia del fotone
~ E = \dfrac{1240\,\text{eV} \cdot \text{nm}}{1550\,\text{nm}} :: uso il trucco: i nanometri si semplificano
~ E \approx \evidb{0{,}80\,\text{eV}} :: meno di un fotone rosso: è infrarosso, come doveva

| che cosa | ordine di grandezza |
|---|---|
| fotone visibile | da 1,8 a 3,1 eV |
| livelli dell'atomo di idrogeno | qualche eV |
| fotone di raggi X | migliaia di eV |
| onda di un elettrone a 100 V | circa 0,12 nm |

>! L'elettronvolt è un'unità di energia, il volt di potenziale. Un elettrone che attraversa 10 V acquista 10 eV, non 10 V.

?? Un fotone ha un'energia di 3,0 eV. Quanto vale in joule?
[ ] 3,0 J
[x] $4{,}8 \cdot 10^{-19}$ J
[ ] $1{,}9 \cdot 10^{19}$ J
=> Ogni elettronvolt vale $1{,}60 \cdot 10^{-19}$ J, quindi si moltiplica: $3{,}0 \cdot 1{,}60 \cdot 10^{-19} = 4{,}8 \cdot 10^{-19}$ J. Dividendo verrebbe un numero enorme, impossibile per un fotone.`
    }
  ],
  grafici: {
    /* lo spettro del corpo nero (curva di Planck, verde) e la previsione classica di Rayleigh–Jeans (grigia, tratteggiata).
       λ in nm; altezza riferita al massimo a 6000 K: y = 3,74·(1000/λ)⁵ / (e^(14388000/(λ·T)) − 1). Wien: λ_max = 2898000/T nm */
    'corpo-nero': {
      tipo: 'orario', t: [0, 2500], y: [0, 1.7], passo: [500, 0.4],
      etichette: { x: 'λ (nm)', y: 'intensità' }, mirino: false,
      parametri: [{ nome: 'T', min: 4000, max: 6500, passo: 250, valore: 6000, etichetta: 'temperatura T (K)' }],
      funzioni: [
        { f: '3.74*T/14388*(1000/x)^4', colore: 'grigio', tratteggio: true, dominio: [300, 2500] },
        { f: '3.74*(1000/x)^5/(exp(14388000/(x*T)) - 1)', colore: 3, dominio: [60, 2500] }
      ],
      elementi: [
        { tipo: 'area', f: '1.7', da: 400, a: 700, colore: 'grigio' },
        { tipo: 'segmento', da: ['2898000/T', 0], a: ['2898000/T', '3.74*(T/2898)^5/(exp(4.965) - 1)'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: ['1000*(3.74*T/(14388*1.45))^0.25 + 60', 1.45], testo: 'teoria classica', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [2450, 1.12], testo: 'λ_max = {{2898000/T|0}} nm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'Lo spettro di un corpo nero: quanta luce emette per ogni lunghezza d\'onda (verde), con l\'altezza riferita al massimo a 6000 K. La striscia grigia è il visibile. Scaldando, la curva cresce molto e il massimo va verso le onde corte. La teoria classica (tratteggio) va bene solo per le onde lunghe.'
    },
    /* l'energia cinetica massima degli elettroni contro la frequenza della luce: K_max = h·f − W, retta di pendenza h.
       f in 10¹⁴ Hz, h = 0,4136 eV per 10¹⁴ Hz; quattro metalli; sotto la soglia il prolungamento tratteggiato arriva a −W */
    fotoelettrico: {
      tipo: 'orario', t: [0, 15], y: [-5, 3.4], passo: [2, 1],
      etichette: { x: 'f (·10¹⁴ Hz)', y: 'K_max (eV)' }, mirino: false,
      parametri: [
        { nome: 'm', min: 1, max: 4, passo: 1, valore: 2, etichetta: 'metallo' },
        { nome: 'fr', min: 3, max: 15, passo: 0.5, valore: 7.5, decimali: 1, etichetta: 'frequenza f (·10¹⁴ Hz)' }
      ],
      funzioni: [
        { f: HF + '*x - ' + WM, colore: 3, dominio: [WM + '/' + HF, 15] },
        { f: HF + '*x - ' + WM, colore: 'grigio', tratteggio: true, dominio: [0, WM + '/' + HF] }
      ],
      elementi: [
        { tipo: 'area', f: '3.4', g: '-5', da: 4.3, a: 7.5, colore: 'grigio' },
        { tipo: 'punto', p: [0, '-' + WM], etichetta: '−W', posizione: 'basso-destra', colore: 'grigio' },
        { tipo: 'punto', p: [WM + '/' + HF, 0], etichetta: 'f_0', posizione: 'alto-sinistra', colore: 'grigio' },
        { tipo: 'punto', p: ['fr', 'se(fr >= ' + WM + '/' + HF + ', ' + HF + '*fr - ' + WM + ', 100)'], colore: 3 },
        { tipo: 'testo', p: [14.8, -3.5], testo: '{{? m == 1 | cesio: W = 2,1 eV | }}{{? m == 2 | sodio: W = 2,3 eV | }}{{? m == 3 | calcio: W = 2,9 eV | }}{{? m == 4 | zinco: W = 4,3 eV | }}', ancora: 'end', colore: 'grigio' },
        { tipo: 'testo', p: ['se(fr >= ' + WM + '/' + HF + ', 14.8, 1000)', -4.4], testo: 'K_max = {{' + HF + '*fr - ' + WM + '|2}} eV', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: ['se(fr >= ' + WM + '/' + HF + ', 1000, 14.8)', -4.4], testo: 'sotto la soglia: nessun elettrone', ancora: 'end', colore: 'grigio' }
      ],
      didascalia: 'L\'energia cinetica massima degli elettroni contro la frequenza della luce, per quattro metalli. Sotto la soglia f₀ non esce niente; sopra, una retta di pendenza h, la stessa per tutti i metalli. Il prolungamento tratteggiato taglia l\'asse verticale in −W. La striscia grigia è il visibile.'
    },
    /* i livelli dell'idrogeno da n = 2 in su (Eₙ = −13,6 eV/n²) e il salto verso n = 2 che dà le righe di Balmer:
       λ = 1240 eV·nm / ΔE (656, 486, 434, 410 nm come nel video) */
    livelli: {
      tipo: 'piano', x: [0, 10], y: [-4.6, 0.4], altezza: 600, proporzioni: 'libere', assi: false, griglia: false,
      parametri: [{ nome: 'ni', min: 3, max: 6, passo: 1, valore: 3, etichetta: 'livello di partenza n' }],
      elementi: [
        { tipo: 'segmento', da: [2.2, 0], a: [7.8, 0], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: [2.2, EN(2)], a: [7.8, EN(2)], colore: 'grigio' },
        { tipo: 'segmento', da: [2.2, EN(3)], a: [7.8, EN(3)], colore: 'grigio' },
        { tipo: 'segmento', da: [2.2, EN(4)], a: [7.8, EN(4)], colore: 'grigio' },
        { tipo: 'segmento', da: [2.2, EN(5)], a: [7.8, EN(5)], colore: 'grigio' },
        { tipo: 'segmento', da: [2.2, EN(6)], a: [7.8, EN(6)], colore: 'grigio' },
        { tipo: 'testo', p: [2.0, EN(2)], testo: 'n = 2', ancora: 'end' },
        { tipo: 'testo', p: [2.0, EN(3)], testo: 'n = 3', ancora: 'end' },
        { tipo: 'testo', p: [2.0, EN(4)], testo: 'n = 4', ancora: 'end' },
        { tipo: 'testo', p: [2.0, EN(5)], testo: 'n = 5', ancora: 'end' },
        { tipo: 'testo', p: [8.0, EN(6)], testo: 'n = 6', ancora: 'start' },
        { tipo: 'testo', p: [8.0, 0], testo: 'n = ∞', ancora: 'start' },
        { tipo: 'testo', p: [8.0, EN(2)], testo: '−3,40 eV', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [8.0, EN(3)], testo: '−1,51 eV', ancora: 'start', colore: 'grigio' },
        { tipo: 'testo', p: [8.0, EN(4)], testo: '−0,85 eV', ancora: 'start', colore: 'grigio' },
        { tipo: 'vettore', da: [5, '-13.6/ni^2'], a: [5, EN(2)], colore: 3 },
        { tipo: 'testo', p: [5, -3.95], testo: 'da n = {{ni}} a n = 2: ΔE = {{3.4 - 13.6/ni^2|2}} eV', colore: 3 },
        { tipo: 'testo', p: [5, -4.4], testo: 'fotone di λ = {{1240/(3.4 - 13.6/ni^2)|0}} nm', colore: 3 }
      ],
      didascalia: 'I livelli di energia dell\'idrogeno, da n = 2 in su: più si sale, più sono vicini. La freccia è il salto verso n = 2. L\'energia persa esce in un fotone, e la sua lunghezza d\'onda è una delle quattro righe di Balmer. Il livello n = 1, a −13,6 eV, è molto più in basso.'
    },
    /* la lunghezza d'onda di de Broglie di un elettrone accelerato da fermo: λ = h / √(2·m·e·ΔV) = 1,226 nm / √ΔV.
       La fascia grigia: le distanze fra gli atomi di un cristallo (0,1–0,3 nm) */
    'onda-elettrone': {
      tipo: 'orario', t: [0, 1000], y: [0, 0.43], passo: [200, 0.1],
      etichette: { x: 'ΔV (V)', y: 'λ (nm)' },
      parametri: [{ nome: 'V', min: 20, max: 1000, passo: 20, valore: 100, etichetta: 'tensione che accelera ΔV (V)' }],
      funzioni: [{ f: '1.226/sqrt(x)', colore: 3, dominio: [9.4, 1000] }],
      elementi: [
        { tipo: 'area', f: '0.3', g: '0.1', da: 0, a: 1000, colore: 'grigio' },
        { tipo: 'testo', p: [990, 0.265], testo: 'distanze fra gli atomi', ancora: 'end', colore: 'grigio' },
        { tipo: 'punto', p: ['V', '1.226/sqrt(V)'], colore: 3 },
        { tipo: 'testo', p: [990, 0.365], testo: 'a {{V}} V: λ = {{1.226/sqrt(V)|3}} nm', ancora: 'end', colore: 3 }
      ],
      didascalia: 'La lunghezza d\'onda di un elettrone che parte da fermo e attraversa la tensione ΔV. Già con poche decine di volt è grande quanto le distanze fra gli atomi (fascia grigia): un cristallo la diffrange come un reticolo. Più tensione, onda più corta.'
    },
    /* l'indeterminazione minima sulla velocità di un elettrone: Δv ≥ h / (4π·m·Δx) = 57,9 km/s diviso Δx in nm */
    indeterminazione: {
      tipo: 'orario', t: [0, 1], y: [0, 740], passo: [0.2, 100],
      etichette: { x: 'Δx (nm)', y: 'Δv_{min} (km/s)' },
      parametri: [{ nome: 'dx', min: 0.12, max: 1, passo: 0.04, valore: 0.2, decimali: 2, etichetta: 'Δx (nm)' }],
      funzioni: [{ f: '57.9/x', colore: 1, dominio: [0.1, 1] }],
      elementi: [
        { tipo: 'area', f: '57.9/x', da: 0.1, a: 1, colore: 'grigio' },
        { tipo: 'testo', p: [0.25, 60], testo: 'impossibile', colore: 'grigio' },
        { tipo: 'testo', p: [0.7, 420], testo: 'possibile', colore: 'grigio' },
        { tipo: 'punto', p: ['dx', '57.9/dx'], colore: 1 },
        { tipo: 'testo', p: [0.98, 640], testo: 'Δx = {{dx}} nm → Δv ≥ {{57.9/dx|0}} km/s', ancora: 'end', colore: 1 }
      ],
      didascalia: 'L\'indeterminazione minima sulla velocità di un elettrone, se la sua posizione è nota entro Δx. La zona grigia, sotto la curva, è vietata dal principio di Heisenberg. Più si stringe Δx, più la velocità è incerta.'
    }
  },
  esempi: [
    {
      titolo: 'Il colore di una stella rossa',
      problema: R`La superficie della stella Betelgeuse è a circa 3500 K. A che lunghezza d'onda emette di più? Quanta energia ha, in elettronvolt, un fotone di quella lunghezza d'onda?`,
      passi: [
        R`Dati: $T = 3500\,\text{K}$, costante di Wien $2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}$. Cerco $\lambda_{\text{max}}$ e l'energia $E$ del fotone, in eV.`,
        R`Dalla legge di Wien: $\lambda_{\text{max}} = \dfrac{2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{3500\,\text{K}} \approx 8{,}28 \cdot 10^{-7}\,\text{m} = 828\,\text{nm}$.`,
        R`828 nm è oltre il rosso: il massimo cade nell'infrarosso vicino. Nel visibile prevale il rosso, e la stella ci appare rossa.`,
        R`Energia del fotone: $E = \dfrac{h \cdot c}{\lambda} = \dfrac{6{,}63 \cdot 10^{-34} \cdot 3 \cdot 10^8}{8{,}28 \cdot 10^{-7}}\,\text{J} \approx 2{,}40 \cdot 10^{-19}\,\text{J}$.`,
        R`In elettronvolt: $E = \dfrac{2{,}40 \cdot 10^{-19}}{1{,}60 \cdot 10^{-19}}\,\text{eV} \approx 1{,}50\,\text{eV}$.`,
        R`Controllo con il trucco: $\dfrac{1240}{828}\,\text{eV} \approx 1{,}50\,\text{eV}$, poco sotto il rosso (1,8 eV). Torna.`
      ],
      risultato: R`$\lambda_{\text{max}} \approx 828\,\text{nm}$ (infrarosso); il fotone vale circa $1{,}50\,\text{eV}$.`
    },
    {
      titolo: 'Quanti fotoni escono da un puntatore laser',
      problema: R`Un puntatore laser verde emette una potenza di 5,0 mW con $\lambda = 520\,\text{nm}$. Quanti fotoni emette ogni secondo?`,
      passi: [
        R`Dati: $P = 5{,}0\,\text{mW} = 5{,}0 \cdot 10^{-3}\,\text{W}$, $\lambda = 520\,\text{nm} = 5{,}20 \cdot 10^{-7}\,\text{m}$. Cerco il numero $N$ di fotoni al secondo.`,
        R`Energia di un fotone: $E = \dfrac{h \cdot c}{\lambda} = \dfrac{6{,}63 \cdot 10^{-34} \cdot 3 \cdot 10^8}{5{,}20 \cdot 10^{-7}}\,\text{J} \approx 3{,}83 \cdot 10^{-19}\,\text{J}$.`,
        R`In un secondo il laser emette $5{,}0 \cdot 10^{-3}\,\text{J}$. Il numero di fotoni è l'energia totale divisa l'energia di uno: $N = \dfrac{5{,}0 \cdot 10^{-3}\,\text{J}}{3{,}83 \cdot 10^{-19}\,\text{J}}$.`,
        R`Faccio il conto: $N \approx 1{,}3 \cdot 10^{16}$ fotoni al secondo: più di dieci milioni di miliardi.`,
        R`Controllo: un fotone vale $\dfrac{3{,}83 \cdot 10^{-19}}{1{,}60 \cdot 10^{-19}}\,\text{eV} \approx 2{,}4\,\text{eV}$, dentro il visibile. Torna.`
      ],
      risultato: R`Circa $1{,}3 \cdot 10^{16}$ fotoni al secondo.`
    },
    {
      titolo: 'Elettroni strappati al calcio',
      problema: R`Su una lastra di calcio, con lavoro di estrazione $W = 2{,}9\,\text{eV}$, arriva ultravioletto di 250 nm. Con che energia cinetica massima escono gli elettroni? Con che velocità? Quanto vale il potenziale d'arresto?`,
      passi: [
        R`Dati: $W = 2{,}9\,\text{eV}$, $\lambda = 250\,\text{nm}$, $m_e = 9{,}11 \cdot 10^{-31}\,\text{kg}$. Cerco $K_{\text{max}}$, la velocità $v$ e $V_0$.`,
        R`Energia del fotone: $E = \dfrac{h \cdot c}{\lambda} = \dfrac{6{,}63 \cdot 10^{-34} \cdot 3 \cdot 10^8}{2{,}50 \cdot 10^{-7}}\,\text{J} \approx 7{,}96 \cdot 10^{-19}\,\text{J} \approx 4{,}97\,\text{eV}$.`,
        R`Equazione di Einstein: $K_{\text{max}} = h \cdot f - W = 4{,}97\,\text{eV} - 2{,}9\,\text{eV} \approx 2{,}07\,\text{eV}$, cioè $3{,}31 \cdot 10^{-19}\,\text{J}$.`,
        R`Velocità, da $K = \frac{1}{2} \cdot m \cdot v^2$: $v = \sqrt{\dfrac{2 \cdot 3{,}31 \cdot 10^{-19}}{9{,}11 \cdot 10^{-31}}}\,\text{m/s} \approx 8{,}5 \cdot 10^5\,\text{m/s}$.`,
        R`Potenziale d'arresto: $e \cdot V_0 = K_{\text{max}}$. Un elettronvolt per ogni volt, quindi $V_0 \approx 2{,}07\,\text{V}$.`,
        R`Controllo con la soglia: $\lambda_0 = \dfrac{1240}{2{,}9}\,\text{nm} \approx 430\,\text{nm}$. I 250 nm sono più corti della soglia, quindi gli elettroni escono davvero. Torna.`
      ],
      risultato: R`$K_{\text{max}} \approx 2{,}07\,\text{eV}$, $v \approx 8{,}5 \cdot 10^5\,\text{m/s}$, $V_0 \approx 2{,}07\,\text{V}$.`
    },
    {
      titolo: 'Una riga dell\'idrogeno che non si vede',
      problema: R`Nell'atomo di idrogeno l'elettrone salta da $n = 4$ a $n = 3$. Quanta energia ha il fotone emesso? Qual è la sua lunghezza d'onda? Si vede?`,
      passi: [
        R`Dati: $n_i = 4$, $n_f = 3$, $E_n = -\dfrac{13{,}6\,\text{eV}}{n^2}$. Cerco l'energia $\Delta E$ del fotone e la sua $\lambda$.`,
        R`I due livelli: $E_4 = -\dfrac{13{,}6}{16}\,\text{eV} = -0{,}85\,\text{eV}$ e $E_3 = -\dfrac{13{,}6}{9}\,\text{eV} \approx -1{,}51\,\text{eV}$.`,
        R`Energia del fotone, partenza meno arrivo: $\Delta E = -0{,}85\,\text{eV} - (-1{,}51\,\text{eV}) \approx 0{,}66\,\text{eV}$.`,
        R`In joule: $\Delta E \approx 0{,}661 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} \approx 1{,}06 \cdot 10^{-19}\,\text{J}$.`,
        R`Lunghezza d'onda: $\lambda = \dfrac{h \cdot c}{\Delta E} = \dfrac{6{,}63 \cdot 10^{-34} \cdot 3 \cdot 10^8}{1{,}06 \cdot 10^{-19}}\,\text{m} \approx 1{,}88 \cdot 10^{-6}\,\text{m}$.`,
        R`Sono circa 1880 nm: infrarosso. La riga c'è, ma l'occhio non la vede.`,
        R`Controllo: il salto 4 → 3 è il salto 4 → 2 meno il salto 3 → 2. Con le righe di Balmer: $2{,}55 - 1{,}89 = 0{,}66\,\text{eV}$. Torna.`
      ],
      risultato: R`$\Delta E \approx 0{,}66\,\text{eV}$, $\lambda \approx 1{,}88 \cdot 10^{-6}\,\text{m}$: infrarosso, invisibile.`
    },
    {
      titolo: 'L\'onda di un neutrone lento',
      problema: R`Nei reattori nucleari ci sono neutroni lenti, che vanno a circa 2200 m/s. La massa del neutrone è $1{,}67 \cdot 10^{-27}\,\text{kg}$. Quanto vale la sua lunghezza d'onda di de Broglie?`,
      passi: [
        R`Dati: $v = 2200\,\text{m/s}$, $m = 1{,}67 \cdot 10^{-27}\,\text{kg}$, $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$. Cerco $\lambda$.`,
        R`Quantità di moto: $p = m \cdot v = 1{,}67 \cdot 10^{-27}\,\text{kg} \cdot 2200\,\text{m/s} \approx 3{,}67 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}$.`,
        R`Lunghezza d'onda: $\lambda = \dfrac{h}{p} = \dfrac{6{,}63 \cdot 10^{-34}}{3{,}67 \cdot 10^{-24}}\,\text{m} \approx 1{,}8 \cdot 10^{-10}\,\text{m} = 0{,}18\,\text{nm}$.`,
        R`È quanto la distanza fra gli atomi di un cristallo. Per questo i neutroni lenti si usano per studiare i cristalli, come i raggi X.`,
        R`Controllo con le unità: $\dfrac{\text{J} \cdot \text{s}}{\text{kg} \cdot \text{m/s}} = \dfrac{\text{kg} \cdot \text{m}^2/\text{s}}{\text{kg} \cdot \text{m/s}} = \text{m}$. Torna.`
      ],
      risultato: R`$\lambda \approx 1{,}8 \cdot 10^{-10}\,\text{m} = 0{,}18\,\text{nm}$`
    },
    {
      titolo: 'Un elettrone e un granello nella stessa fessura',
      problema: R`Un elettrone passa da una fessura larga 0,40 μm. Qual è l'indeterminazione minima sulla sua velocità di traverso? E per un granello di polvere di 1 μg, nella stessa fessura?`,
      passi: [
        R`Dati: $\Delta x = 0{,}40\,\mu\text{m} = 4{,}0 \cdot 10^{-7}\,\text{m}$, $m_e = 9{,}11 \cdot 10^{-31}\,\text{kg}$, granello $m = 1\,\mu\text{g} = 10^{-9}\,\text{kg}$. Cerco $\Delta v$ minimo per tutti e due.`,
        R`Dal principio di Heisenberg: $\Delta p \ge \dfrac{h}{4\pi \cdot \Delta x} = \dfrac{5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}}{4{,}0 \cdot 10^{-7}\,\text{m}} \approx 1{,}3 \cdot 10^{-28}\,\text{kg} \cdot \text{m/s}$.`,
        R`Elettrone: $\Delta v = \dfrac{\Delta p}{m_e} \ge \dfrac{1{,}3 \cdot 10^{-28}}{9{,}11 \cdot 10^{-31}}\,\text{m/s} \approx 145\,\text{m/s}$. Non è poco.`,
        R`Granello: $\Delta v \ge \dfrac{1{,}3 \cdot 10^{-28}}{10^{-9}}\,\text{m/s} \approx 1{,}3 \cdot 10^{-19}\,\text{m/s}$. Per spostarsi di un metro gli servirebbero oltre duecento miliardi di anni.`,
        R`Controllo: $\Delta p$ è lo stesso. Il rapporto fra le due $\Delta v$ è quindi il rapporto fra le masse, circa $10^{21}$. Torna.`
      ],
      risultato: R`Elettrone: $\Delta v \ge 145\,\text{m/s}$. Granello: $\Delta v \ge 1{,}3 \cdot 10^{-19}\,\text{m/s}$.`
    }
  ],
  formulario: [
    { nome: 'Legge di Wien', formula: R`\lambda_{\text{max}} \cdot T = 2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}`, nota: R`$T$ in kelvin. Più caldo, massimo più corto.` },
    { nome: 'Legge di Stefan–Boltzmann', formula: R`P = \sigma \cdot S \cdot T^4`, nota: R`Potenza emessa da un corpo nero di superficie $S$; $\sigma = 5{,}67 \cdot 10^{-8}\,\text{W/(m}^2 \cdot \text{K}^4)$.` },
    { nome: 'Quanto di Planck', formula: R`E = h \cdot f \qquad E = \dfrac{h \cdot c}{\lambda}`, nota: R`$h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} = 4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}$.` },
    { nome: 'Elettronvolt', formula: R`1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}`, nota: R`Trucco: $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$, quindi $E$ in eV $= 1240 / \lambda$ in nm.` },
    { nome: 'Effetto fotoelettrico', formula: R`K_{\text{max}} = h \cdot f - W`, nota: R`$W$ lavoro di estrazione del metallo. Se $h \cdot f < W$ non esce nessun elettrone.` },
    { nome: 'Soglia e potenziale d\'arresto', formula: R`f_0 = \dfrac{W}{h} \qquad e \cdot V_0 = K_{\text{max}}`, nota: R`Sotto $f_0$ niente elettroni; $V_0$ ferma anche i più veloci.` },
    { nome: 'Quantità di moto del fotone', formula: R`p = \dfrac{h}{\lambda} = \dfrac{E}{c}`, nota: R`Il fotone non ha massa, ma ha quantità di moto. In $\text{kg} \cdot \text{m/s}$.` },
    { nome: 'Effetto Compton', formula: R`\Delta\lambda = \dfrac{h}{m_e \cdot c} \cdot (1 - \cos\theta)`, nota: R`$\theta$ angolo di deviazione del fotone; $\dfrac{h}{m_e \cdot c} \approx 2{,}43 \cdot 10^{-12}\,\text{m}$.` },
    { nome: 'Livelli dell\'idrogeno (Bohr)', formula: R`E_n = -\dfrac{13{,}6\,\text{eV}}{n^2} \qquad r_n = n^2 \cdot r_1`, nota: R`$n = 1, 2, 3, \ldots$; $r_1 = 0{,}053\,\text{nm}$. Energia di ionizzazione: 13,6 eV.` },
    { nome: 'Fotone emesso in un salto', formula: R`h \cdot f = E_i - E_f`, nota: R`Dal livello iniziale più alto a quello finale più basso. Assorbimento: il contrario.` },
    { nome: 'Condizione di Bohr', formula: R`m \cdot v \cdot r_n = n \cdot \dfrac{h}{2\pi}`, nota: R`L'onda di de Broglie sta $n$ volte sull'orbita: $2\pi \cdot r_n = n \cdot \lambda$.` },
    { nome: 'Lunghezza d\'onda di de Broglie', formula: R`\lambda = \dfrac{h}{p} = \dfrac{h}{m \cdot v}`, nota: R`Vale per ogni particella. Conta solo quando $\lambda$ è paragonabile agli ostacoli.` },
    { nome: 'Principio di indeterminazione', formula: R`\Delta x \cdot \Delta p \ge \dfrac{h}{4\pi}`, nota: R`$\dfrac{h}{4\pi} \approx 5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}$. Vale anche $\Delta E \cdot \Delta t \ge \dfrac{h}{4\pi}$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'corpo-nero', tipo: 'definizione', fronte: R`Che cos'è un **corpo nero**?`, retro: R`Un corpo che assorbe tutta la radiazione che riceve. Il suo spettro di emissione dipende solo dalla temperatura.` },
    { id: 'fc-02', sezione: 'corpo-nero', tipo: 'formula', fronte: R`La **legge di Wien**`, retro: R`$\lambda_{\text{max}} \cdot T = 2{,}898 \cdot 10^{-3}\,\text{m} \cdot \text{K}$: il massimo dello spettro si sposta verso le onde corte quando $T$ sale.` },
    { id: 'fc-03', sezione: 'corpo-nero', tipo: 'concetto', fronte: R`Che cos'è la **catastrofe ultravioletta**?`, retro: R`La previsione della fisica classica: lo spettro del corpo nero cresce senza limite verso le onde corte, con un'energia totale infinita. Le misure dicono il contrario.` },
    { id: 'fc-04', sezione: 'corpo-nero', tipo: 'formula', fronte: R`La legge di **Stefan–Boltzmann**`, retro: R`$P = \sigma \cdot S \cdot T^4$: a temperatura doppia, potenza emessa 16 volte più grande.` },
    { id: 'fc-05', sezione: 'quanto', tipo: 'definizione', fronte: R`Che cosa dice l'**ipotesi di Planck**?`, retro: R`La radiazione di frequenza $f$ si emette e si assorbe solo a pacchetti, i quanti, di energia $E = h \cdot f$.` },
    { id: 'fc-06', sezione: 'quanto', tipo: 'formula', fronte: R`Quanto vale la **costante di Planck**?`, retro: R`$h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$, cioè $4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}$.` },
    { id: 'fc-07', sezione: 'quanto', tipo: 'concetto', fronte: R`Quanti joule ha un fotone da 1 eV?`, retro: R`$1{,}60 \cdot 10^{-19}\,\text{J}$. L'elettronvolt è un'unità di energia: vale per i fotoni come per gli elettroni.` },
    { id: 'fc-08', sezione: 'quanto', tipo: 'concetto', fronte: R`Con i quanti, perché un corpo caldo emette poco ultravioletto?`, retro: R`A frequenza alta il quanto $h \cdot f$ è grande. L'agitazione termica raccoglie raramente tanta energia, quindi quei quanti escono di rado.` },
    { id: 'fc-09', sezione: 'fotoelettrico', tipo: 'definizione', fronte: R`Che cos'è l'**effetto fotoelettrico**?`, retro: R`L'emissione di elettroni da un metallo colpito dalla luce. Avviene solo sopra una frequenza di soglia.` },
    { id: 'fc-10', sezione: 'fotoelettrico', tipo: 'formula', fronte: R`L'**equazione di Einstein** per l'effetto fotoelettrico`, retro: R`$K_{\text{max}} = h \cdot f - W$: l'energia del fotone, meno il lavoro di estrazione, è l'energia cinetica massima dell'elettrone.` },
    { id: 'fc-11', sezione: 'fotoelettrico', tipo: 'definizione', fronte: R`Che cos'è il **lavoro di estrazione** $W$?`, retro: R`L'energia minima per strappare un elettrone a un metallo. Dipende dal metallo; si misura di solito in eV.` },
    { id: 'fc-12', sezione: 'fotoelettrico', tipo: 'concetto', fronte: R`Nell'effetto fotoelettrico, che cosa cambia con l'intensità della luce e che cosa con la frequenza?`, retro: R`L'intensità cambia il numero di elettroni al secondo. La frequenza cambia la loro energia cinetica massima.` },
    { id: 'fc-13', sezione: 'fotoelettrico', tipo: 'procedura', fronte: R`Come si misura l'energia cinetica massima degli elettroni emessi?`, retro: R`Con il potenziale d'arresto $V_0$, la tensione che ferma anche i più veloci: $K_{\text{max}} = e \cdot V_0$. In eV ha lo stesso numero dei volt.` },
    { id: 'fc-14', sezione: 'fotone', tipo: 'formula', fronte: R`La **quantità di moto di un fotone**`, retro: R`$p = \dfrac{h}{\lambda} = \dfrac{E}{c}$, anche se il fotone non ha massa.` },
    { id: 'fc-15', sezione: 'fotone', tipo: 'concetto', fronte: R`Che cosa mostra l'**effetto Compton**?`, retro: R`I raggi X deviati da elettroni escono con $\lambda$ più lunga. Il fotone urta l'elettrone come una pallina e gli cede energia e quantità di moto.` },
    { id: 'fc-16', sezione: 'fotone', tipo: 'concetto', fronte: R`Che cos'è il **dualismo onda–corpuscolo**?`, retro: R`La luce viaggia come un'onda (interferenza, diffrazione) e scambia energia e quantità di moto a fotoni, uno alla volta. Vale anche per la materia.` },
    { id: 'fc-17', sezione: 'bohr', tipo: 'formula', fronte: R`I **livelli di energia** dell'atomo di idrogeno`, retro: R`$E_n = -\dfrac{13{,}6\,\text{eV}}{n^2}$, con $n = 1, 2, 3, \ldots$ Il livello più basso, $n = 1$, è lo stato fondamentale.` },
    { id: 'fc-18', sezione: 'bohr', tipo: 'concetto', fronte: R`Da dove vengono le righe dello spettro dell'idrogeno?`, retro: R`Dai salti dell'elettrone fra livelli: ogni salto in giù emette un fotone con $h \cdot f = E_i - E_f$, quindi di un colore preciso.` },
    { id: 'fc-19', sezione: 'bohr', tipo: 'definizione', fronte: R`Che cos'è l'**energia di ionizzazione**?`, retro: R`L'energia minima per strappare l'elettrone all'atomo. Per l'idrogeno nello stato fondamentale vale 13,6 eV.` },
    { id: 'fc-20', sezione: 'de-broglie', tipo: 'formula', fronte: R`La **lunghezza d'onda di de Broglie**`, retro: R`$\lambda = \dfrac{h}{p} = \dfrac{h}{m \cdot v}$: a ogni particella è associata un'onda.` },
    { id: 'fc-21', sezione: 'de-broglie', tipo: 'concetto', fronte: R`Quale esperimento ha mostrato che gli elettroni sono onde?`, retro: R`La loro diffrazione su un cristallo (Davisson e Germer, 1927). Poi le frange di Young con elettroni sparati uno alla volta (Bologna, 1974).` },
    { id: 'fc-25', sezione: 'de-broglie', tipo: 'formula', fronte: R`La **condizione di Bohr**, e da dove viene`, retro: R`$m \cdot v \cdot r_n = n \cdot \dfrac{h}{2\pi}$. Viene da $2\pi \cdot r_n = n \cdot \lambda$: l'onda di de Broglie sta un numero intero di volte sull'orbita.` },
    { id: 'fc-22', sezione: 'heisenberg', tipo: 'formula', fronte: R`Il **principio di indeterminazione** di Heisenberg`, retro: R`$\Delta x \cdot \Delta p \ge \dfrac{h}{4\pi}$: più è nota la posizione, meno è nota la quantità di moto.` },
    { id: 'fc-23', sezione: 'heisenberg', tipo: 'concetto', fronte: R`L'indeterminazione si può togliere con strumenti migliori?`, retro: R`No. Viene dalla natura d'onda della materia, non da un difetto degli strumenti.` },
    { id: 'fc-24', sezione: 'problemi', tipo: 'procedura', fronte: R`Come si passa velocemente dalla lunghezza d'onda all'energia di un fotone?`, retro: R`Con $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$: l'energia in eV è 1240 diviso $\lambda$ in nanometri.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Il filamento di una lampadina a incandescenza è a 2900 K. A che lunghezza d'onda emette di più? Usa la costante di Wien arrotondata, $2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}$.`, suggerimenti: [R`Legge di Wien: $\lambda_{\text{max}} = \dfrac{2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{T}$.`], risposta: { tipo: 'numero', valore: 1e-6, unita: 'm' }, soluzione: [R`$\lambda_{\text{max}} = \dfrac{2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{2900\,\text{K}} = 1{,}0 \cdot 10^{-6}\,\text{m} = 1000\,\text{nm}$.`, R`È infrarosso: per questo una lampadina a incandescenza scalda più di quanto illumini.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Lo spettro di una piccola stella rossa ha il massimo a 1160 nm. Quanto vale la temperatura della sua superficie? Usa $2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}$.`, suggerimenti: [R`Da $\lambda_{\text{max}} \cdot T = 2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}$ ricava $T$.`, R`I nanometri vanno scritti in metri: $1160\,\text{nm} = 1{,}16 \cdot 10^{-6}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 2500, unita: 'K' }, soluzione: [R`$T = \dfrac{2{,}9 \cdot 10^{-3}\,\text{m} \cdot \text{K}}{1{,}16 \cdot 10^{-6}\,\text{m}} = 2500\,\text{K}$.`, R`Meno della metà della temperatura del Sole: la stella ci appare rossa.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Due stelle hanno la stessa superficie, ma la temperatura assoluta della prima è il triplo di quella della seconda. Quante volte più potenza emette la prima?`, suggerimenti: [R`Legge di Stefan–Boltzmann: la potenza è proporzionale a $T^4$.`], risposta: { tipo: 'numero', valore: 81 }, segnaposto: 'Un numero', soluzione: [R`$\dfrac{P_1}{P_2} = \left(\dfrac{T_1}{T_2}\right)^4 = 3^4 = 81$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Un fotone ha frequenza $5{,}0 \cdot 10^{14}\,\text{Hz}$. Quanta energia porta, in joule?`, suggerimenti: [R`$E = h \cdot f$, con $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$.`], risposta: { tipo: 'numero', valore: 3.315e-19, unita: 'J' }, soluzione: [R`$E = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 5{,}0 \cdot 10^{14}\,\text{Hz} \approx 3{,}3 \cdot 10^{-19}\,\text{J}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Esprimi in joule l'energia di un fotone da 2,5 eV.`, suggerimenti: [R`$1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$.`], risposta: { tipo: 'numero', valore: 4e-19, unita: 'J', soloUnita: true }, soluzione: [R`$E = 2{,}5 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} = 4{,}0 \cdot 10^{-19}\,\text{J}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Un fotone porta un'energia di $6{,}63 \cdot 10^{-19}\,\text{J}$. Qual è la sua lunghezza d'onda?`, suggerimenti: [R`Da $E = h \cdot f$ ricava $f$.`, R`Poi $\lambda = \dfrac{c}{f}$.`], risposta: { tipo: 'numero', valore: 300, unita: 'nm' }, soluzione: [R`$f = \dfrac{E}{h} = \dfrac{6{,}63 \cdot 10^{-19}\,\text{J}}{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}} = 1{,}0 \cdot 10^{15}\,\text{Hz}$.`, R`$\lambda = \dfrac{3 \cdot 10^8\,\text{m/s}}{1{,}0 \cdot 10^{15}\,\text{Hz}} = 3{,}0 \cdot 10^{-7}\,\text{m} = 300\,\text{nm}$: ultravioletto.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Quanta energia ha, in elettronvolt, un fotone di luce arancione con $\lambda = 620\,\text{nm}$? Usa $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$.`, suggerimenti: [R`$E = \dfrac{h \cdot c}{\lambda}$: con $\lambda$ in nm il risultato esce in eV.`], risposta: { tipo: 'numero', valore: 2, unita: 'eV' }, soluzione: [R`$E = \dfrac{1240\,\text{eV} \cdot \text{nm}}{620\,\text{nm}} = 2{,}0\,\text{eV}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un fotone ha un'energia di 1,6 eV. Qual è la sua lunghezza d'onda? Usa $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$.`, suggerimenti: [R`Da $E = \dfrac{h \cdot c}{\lambda}$ ricava $\lambda$.`], risposta: { tipo: 'numero', valore: 775, unita: 'nm' }, soluzione: [R`$\lambda = \dfrac{1240\,\text{eV} \cdot \text{nm}}{1{,}6\,\text{eV}} = 775\,\text{nm}$: appena oltre il rosso, nell'infrarosso.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Una lampadina LED emette 2,0 W di luce, a fotoni da $5{,}0 \cdot 10^{-19}\,\text{J}$ l'uno. Quanti fotoni emette ogni secondo?`, suggerimenti: [R`In un secondo emette 2,0 J. Il numero di fotoni è l'energia totale divisa l'energia di uno.`], risposta: { tipo: 'numero', valore: 4e18 }, segnaposto: 'Un numero (es. 3·10^5)', soluzione: [R`$N = \dfrac{2{,}0\,\text{J/s}}{5{,}0 \cdot 10^{-19}\,\text{J}} = 4{,}0 \cdot 10^{18}$ fotoni al secondo.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Fotoni da 5,5 eV colpiscono un metallo con lavoro di estrazione 3,5 eV. Qual è l'energia cinetica massima degli elettroni emessi?`, suggerimenti: [R`$K_{\text{max}} = h \cdot f - W$, tutto in eV.`], risposta: { tipo: 'numero', valore: 2, unita: 'eV' }, soluzione: [R`$K_{\text{max}} = 5{,}5\,\text{eV} - 3{,}5\,\text{eV} = 2{,}0\,\text{eV}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un metallo ha lavoro di estrazione 2,48 eV. Quanto vale la sua frequenza di soglia? Usa $h = 4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}$.`, suggerimenti: [R`Alla soglia il fotone ha proprio l'energia $W$: $f_0 = \dfrac{W}{h}$.`], risposta: { tipo: 'numero', valore: 5.99e14, unita: 'Hz' }, soluzione: [R`$f_0 = \dfrac{W}{h} = \dfrac{2{,}48\,\text{eV}}{4{,}14 \cdot 10^{-15}\,\text{eV} \cdot \text{s}} \approx 6{,}0 \cdot 10^{14}\,\text{Hz}$: luce verde-azzurra.`] },
    { id: 'b-12', livello: 'base', difficolta: 2, testo: R`Il tungsteno ha lavoro di estrazione $W = 4{,}5\,\text{eV}$. Qual è la lunghezza d'onda di soglia, oltre la quale la luce non stacca più elettroni? Usa $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$.`, suggerimenti: [R`Alla soglia $\dfrac{h \cdot c}{\lambda_0} = W$.`, R`$\lambda_0 = \dfrac{h \cdot c}{W}$.`], risposta: { tipo: 'numero', valore: 276, unita: 'nm', tolleranza: 2 }, soluzione: [R`$\lambda_0 = \dfrac{1240\,\text{eV} \cdot \text{nm}}{4{,}5\,\text{eV}} \approx 276\,\text{nm}$.`, R`Serve ultravioletto: la luce visibile non basta.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Gli elettroni più veloci emessi da una lastra hanno energia cinetica 1,2 eV. Quanto vale il potenziale d'arresto?`, suggerimenti: [R`$e \cdot V_0 = K_{\text{max}}$: un elettronvolt per ogni volt.`], risposta: { tipo: 'numero', valore: 1.2, unita: 'V' }, soluzione: [R`$V_0 = \dfrac{K_{\text{max}}}{e} = \dfrac{1{,}2\,\text{eV}}{e} = 1{,}2\,\text{V}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Fotoni da 5,2 eV colpiscono un metallo. Il potenziale d'arresto è 2,8 V. Quanto vale il lavoro di estrazione del metallo?`, suggerimenti: [R`Il potenziale d'arresto dà $K_{\text{max}} = 2{,}8\,\text{eV}$.`, R`Da $K_{\text{max}} = h \cdot f - W$ ricava $W$.`], risposta: { tipo: 'numero', valore: 2.4, unita: 'eV' }, soluzione: [R`$K_{\text{max}} = e \cdot V_0 = 2{,}8\,\text{eV}$.`, R`$W = h \cdot f - K_{\text{max}} = 5{,}2\,\text{eV} - 2{,}8\,\text{eV} = 2{,}4\,\text{eV}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`Nell'atomo di idrogeno l'elettrone salta da $n = 3$ a $n = 1$. Quanta energia ha il fotone emesso?`, suggerimenti: [R`$E_n = -\dfrac{13{,}6\,\text{eV}}{n^2}$.`, R`Energia del fotone: livello di partenza meno livello d'arrivo.`], risposta: { tipo: 'numero', valore: 12.09, unita: 'eV' }, soluzione: [R`$E_3 = -\dfrac{13{,}6}{9}\,\text{eV} \approx -1{,}51\,\text{eV}$, $E_1 = -13{,}6\,\text{eV}$.`, R`$\Delta E = -1{,}51\,\text{eV} - (-13{,}6\,\text{eV}) \approx 12{,}1\,\text{eV}$: ultravioletto.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Nel modello di Bohr la prima orbita ha raggio 0,053 nm. Quanto vale il raggio dell'orbita $n = 3$?`, suggerimenti: [R`I raggi crescono come $n^2$: $r_n = n^2 \cdot r_1$.`], risposta: { tipo: 'numero', valore: 0.477, unita: 'nm', tolleranza: 0.005 }, soluzione: [R`$r_3 = 3^2 \cdot 0{,}053\,\text{nm} = 9 \cdot 0{,}053\,\text{nm} \approx 0{,}48\,\text{nm}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Una particella ha quantità di moto $6{,}63 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}$. Quanto vale la sua lunghezza d'onda di de Broglie?`, suggerimenti: [R`$\lambda = \dfrac{h}{p}$.`], risposta: { tipo: 'numero', valore: 1e-10, unita: 'm' }, soluzione: [R`$\lambda = \dfrac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}}{6{,}63 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}} = 1{,}0 \cdot 10^{-10}\,\text{m} = 0{,}1\,\text{nm}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 2, testo: R`Un elettrone ($m = 9{,}11 \cdot 10^{-31}\,\text{kg}$) va a $1{,}0 \cdot 10^7\,\text{m/s}$. Quanto vale la sua lunghezza d'onda di de Broglie?`, suggerimenti: [R`Prima la quantità di moto $p = m \cdot v$.`, R`Poi $\lambda = \dfrac{h}{p}$.`], risposta: { tipo: 'numero', valore: 7.28e-11, unita: 'm' }, soluzione: [R`$p = 9{,}11 \cdot 10^{-31}\,\text{kg} \cdot 1{,}0 \cdot 10^7\,\text{m/s} = 9{,}11 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}$.`, R`$\lambda = \dfrac{6{,}63 \cdot 10^{-34}}{9{,}11 \cdot 10^{-24}}\,\text{m} \approx 7{,}3 \cdot 10^{-11}\,\text{m}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Quanto vale la quantità di moto di un fotone di luce rossa con $\lambda = 663\,\text{nm}$?`, suggerimenti: [R`$p = \dfrac{h}{\lambda}$, con $\lambda$ in metri.`], risposta: { tipo: 'numero', valore: 1e-27, unita: 'kg·m/s' }, soluzione: [R`$p = \dfrac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}}{6{,}63 \cdot 10^{-7}\,\text{m}} = 1{,}0 \cdot 10^{-27}\,\text{kg} \cdot \text{m/s}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 2, testo: R`La posizione di un elettrone è nota entro $\Delta x = 0{,}50\,\text{nm}$. Qual è l'indeterminazione minima sulla sua quantità di moto? Usa $\dfrac{h}{4\pi} = 5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}$.`, suggerimenti: [R`$\Delta p \ge \dfrac{h}{4\pi \cdot \Delta x}$.`, R`$0{,}50\,\text{nm} = 5{,}0 \cdot 10^{-10}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 1.06e-25, unita: 'kg·m/s', tolleranza: 0.05e-25 }, soluzione: [R`$\Delta p \ge \dfrac{5{,}3 \cdot 10^{-35}\,\text{J} \cdot \text{s}}{5{,}0 \cdot 10^{-10}\,\text{m}} \approx 1{,}1 \cdot 10^{-25}\,\text{kg} \cdot \text{m/s}$.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 3, testo: R`Come fece Millikan, si illumina un metallo con due luci. Con $f_1 = 6{,}0 \cdot 10^{14}\,\text{Hz}$ il potenziale d'arresto è 0,40 V; con $f_2 = 8{,}0 \cdot 10^{14}\,\text{Hz}$ è 1,23 V. Quanto vale la costante di Planck che si ricava?`, suggerimenti: [R`Scrivi $e \cdot V_0 = h \cdot f - W$ per le due luci e sottrai: $W$ sparisce.`, R`$h = \dfrac{e \cdot (V_2 - V_1)}{f_2 - f_1}$: è la pendenza della retta.`], risposta: { tipo: 'numero', valore: 6.64e-34, unita: 'J·s', tolleranza: 0.05e-34 }, soluzione: [R`Sottraendo le due equazioni: $e \cdot (V_2 - V_1) = h \cdot (f_2 - f_1)$.`, R`$h = \dfrac{1{,}60 \cdot 10^{-19}\,\text{C} \cdot 0{,}83\,\text{V}}{2{,}0 \cdot 10^{14}\,\text{Hz}} \approx 6{,}6 \cdot 10^{-34}\,\text{J} \cdot \text{s}$.`, R`Il lavoro di estrazione viene $W = h \cdot f_1 - e \cdot V_1 \approx 2{,}49\,\text{eV} - 0{,}40\,\text{eV} \approx 2{,}1\,\text{eV}$.`] },
    { id: 'es-02', difficolta: 2, testo: R`Una stazione radio a onde medie trasmette a 1,0 MHz con una potenza di 10 kW. Quanti fotoni emette ogni secondo?`, suggerimenti: [R`Prima l'energia di un fotone: $E = h \cdot f$.`, R`Poi divide la potenza (joule al secondo) per l'energia di un fotone.`], risposta: { tipo: 'numero', valore: 1.508e31 }, segnaposto: 'Un numero (es. 3·10^5)', soluzione: [R`$E = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 1{,}0 \cdot 10^6\,\text{Hz} = 6{,}63 \cdot 10^{-28}\,\text{J}$.`, R`$N = \dfrac{1{,}0 \cdot 10^4\,\text{J/s}}{6{,}63 \cdot 10^{-28}\,\text{J}} \approx 1{,}5 \cdot 10^{31}$ fotoni al secondo.`, R`Per questo nelle onde radio i quanti non si notano mai: sono minuscoli e tantissimi.`] },
    { id: 'es-03', difficolta: 2, testo: R`Le righe di Balmer finiscono tutte su $n = 2$. Si addensano verso un limite: il salto da un livello lontanissimo ($n \to \infty$, energia zero). Qual è la lunghezza d'onda di questo limite?`, suggerimenti: [R`L'energia del fotone è $0 - E_2$.`, R`$E_2 = -\dfrac{13{,}6}{4}\,\text{eV}$; poi usa $h \cdot c \approx 1240\,\text{eV} \cdot \text{nm}$.`], risposta: { tipo: 'numero', valore: 365, unita: 'nm', tolleranza: 2 }, soluzione: [R`$\Delta E = 0 - (-3{,}40\,\text{eV}) = 3{,}40\,\text{eV}$.`, R`$\lambda = \dfrac{1240\,\text{eV} \cdot \text{nm}}{3{,}40\,\text{eV}} \approx 365\,\text{nm}$: già nell'ultravioletto. Tutte le righe di Balmer stanno fra 365 e 656 nm.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un fotone da 15,0 eV colpisce un atomo di idrogeno nello stato fondamentale e gli strappa l'elettrone. Con che velocità esce l'elettrone?`, suggerimenti: [R`Per strappare l'elettrone servono 13,6 eV: il resto diventa energia cinetica.`, R`Passa ai joule e usa $K = \frac{1}{2} \cdot m \cdot v^2$, con $m = 9{,}11 \cdot 10^{-31}\,\text{kg}$.`], risposta: { tipo: 'numero', valore: 7.01e5, unita: 'm/s' }, soluzione: [R`$K = 15{,}0\,\text{eV} - 13{,}6\,\text{eV} = 1{,}4\,\text{eV} = 1{,}4 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} \approx 2{,}24 \cdot 10^{-19}\,\text{J}$.`, R`$v = \sqrt{\dfrac{2 \cdot K}{m}} = \sqrt{\dfrac{2 \cdot 2{,}24 \cdot 10^{-19}}{9{,}11 \cdot 10^{-31}}}\,\text{m/s} \approx 7{,}0 \cdot 10^5\,\text{m/s}$.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un elettrone parte da fermo e attraversa una differenza di potenziale di 150 V. Quanto vale poi la sua lunghezza d'onda di de Broglie?`, suggerimenti: [R`L'energia cinetica è $K = e \cdot \Delta V$.`, R`La quantità di moto si ricava da $K = \dfrac{p^2}{2 \cdot m}$: $p = \sqrt{2 \cdot m \cdot K}$.`, R`Poi $\lambda = h / p$.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'nm', tolleranza: 0.002 }, soluzione: [R`$K = e \cdot \Delta V = 1{,}60 \cdot 10^{-19}\,\text{C} \cdot 150\,\text{V} = 2{,}40 \cdot 10^{-17}\,\text{J}$.`, R`$p = \sqrt{2 \cdot 9{,}11 \cdot 10^{-31} \cdot 2{,}40 \cdot 10^{-17}}\,\text{kg} \cdot \text{m/s} \approx 6{,}61 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}$.`, R`$\lambda = \dfrac{6{,}63 \cdot 10^{-34}}{6{,}61 \cdot 10^{-24}}\,\text{m} \approx 1{,}00 \cdot 10^{-10}\,\text{m} = 0{,}100\,\text{nm}$: la scala degli atomi.`] },
    { id: 'es-06', difficolta: 3, testo: R`Raggi X di lunghezza d'onda 0,0500 nm vengono deviati di 90° da elettroni quasi fermi. Qual è la lunghezza d'onda dei raggi deviati?`, suggerimenti: [R`Effetto Compton: $\Delta\lambda = \dfrac{h}{m_e \cdot c} \cdot (1 - \cos\theta)$.`, R`Con $\theta = 90°$ il coseno vale zero: $\Delta\lambda = 2{,}43 \cdot 10^{-12}\,\text{m}$.`], risposta: { tipo: 'numero', valore: 0.0524, unita: 'nm', tolleranza: 0.0003 }, soluzione: [R`$\Delta\lambda = 2{,}43 \cdot 10^{-12}\,\text{m} \cdot (1 - 0) = 0{,}00243\,\text{nm}$.`, R`$\lambda' = 0{,}0500\,\text{nm} + 0{,}00243\,\text{nm} \approx 0{,}0524\,\text{nm}$: circa il 5% più lunga.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un protone ($m = 1{,}67 \cdot 10^{-27}\,\text{kg}$) è chiuso in un nucleo largo circa $1{,}0 \cdot 10^{-14}\,\text{m}$. Qual è l'indeterminazione minima sulla sua velocità?`, suggerimenti: [R`$\Delta p \ge \dfrac{h}{4\pi \cdot \Delta x}$, con $\dfrac{h}{4\pi} \approx 5{,}28 \cdot 10^{-35}\,\text{J} \cdot \text{s}$.`, R`Poi $\Delta v = \Delta p / m$.`], risposta: { tipo: 'numero', valore: 3.16e6, unita: 'm/s', tolleranza: 0.05e6 }, soluzione: [R`$\Delta p \ge \dfrac{5{,}28 \cdot 10^{-35}}{1{,}0 \cdot 10^{-14}}\,\text{kg} \cdot \text{m/s} = 5{,}28 \cdot 10^{-21}\,\text{kg} \cdot \text{m/s}$.`, R`$\Delta v \ge \dfrac{5{,}28 \cdot 10^{-21}}{1{,}67 \cdot 10^{-27}}\,\text{m/s} \approx 3{,}2 \cdot 10^6\,\text{m/s}$: i protoni nel nucleo si agitano fortissimo.`] },
    { id: 'es-08', difficolta: 3, testo: R`Un fotone e un elettrone hanno la stessa lunghezza d'onda, 0,20 nm. Il fotone ha un'energia di circa 6200 eV. Quanta energia cinetica ha l'elettrone, in eV?`, suggerimenti: [R`Stessa $\lambda$ vuol dire stessa quantità di moto $p = h / \lambda$.`, R`Per l'elettrone $K = \dfrac{p^2}{2 \cdot m}$.`], risposta: { tipo: 'numero', valore: 37.7, unita: 'eV', tolleranza: 0.5 }, soluzione: [R`$p = \dfrac{6{,}63 \cdot 10^{-34}}{2{,}0 \cdot 10^{-10}}\,\text{kg} \cdot \text{m/s} \approx 3{,}32 \cdot 10^{-24}\,\text{kg} \cdot \text{m/s}$.`, R`$K = \dfrac{(3{,}32 \cdot 10^{-24})^2}{2 \cdot 9{,}11 \cdot 10^{-31}}\,\text{J} \approx 6{,}03 \cdot 10^{-18}\,\text{J} \approx 37{,}7\,\text{eV}$.`, R`A parità di lunghezza d'onda, l'elettrone porta un'energia oltre cento volte più piccola di quella del fotone.`] },
    { id: 'es-09', difficolta: 2, testo: R`In una fotocellula illuminata passa una corrente di $2{,}0\,\mu\text{A}$. Quanti elettroni escono dal metallo ogni secondo?`, suggerimenti: [R`La corrente è la carica che passa ogni secondo.`, R`Ogni elettrone porta $1{,}60 \cdot 10^{-19}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 1.25e13 }, segnaposto: 'Un numero (es. 3·10^5)', soluzione: [R`In un secondo passano $2{,}0 \cdot 10^{-6}\,\text{C}$.`, R`$N = \dfrac{2{,}0 \cdot 10^{-6}\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} = 1{,}25 \cdot 10^{13}$ elettroni al secondo.`, R`Raddoppiando l'intensità della luce raddoppiano i fotoni, quindi anche questa corrente.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un laser da 1,0 W colpisce una superficie nera che assorbe tutta la luce. Quanto vale la forza che la luce esercita sulla superficie?`, suggerimenti: [R`Ogni fotone assorbito cede $p = E / c$.`, R`In un secondo arriva l'energia $P \cdot 1\,\text{s}$: la quantità di moto ceduta ogni secondo è $P / c$, ed è la forza.`], risposta: { tipo: 'numero', valore: 3.33e-9, unita: 'N' }, soluzione: [R`$N$ fotoni al secondo portano l'energia $N \cdot E = P$ e la quantità di moto $N \cdot \dfrac{E}{c} = \dfrac{P}{c}$.`, R`La forza è la quantità di moto ceduta ogni secondo: $F = \dfrac{P}{c} = \dfrac{1{,}0\,\text{W}}{3 \cdot 10^8\,\text{m/s}} \approx 3{,}3 \cdot 10^{-9}\,\text{N}$.`, R`È minuscola: più o meno il peso di un granello di polvere.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa dice la legge di Wien?`, opzioni: [R`La potenza emessa cresce come $T^4$`, R`Il massimo dello spettro è sempre nel visibile`, R`La lunghezza d'onda del massimo è inversamente proporzionale alla temperatura assoluta`, R`Un corpo nero non emette luce`], corretta: 2, spiegazione: R`$\lambda_{\text{max}} \cdot T$ è costante: più caldo, massimo più corto. La crescita come $T^4$ è la legge di Stefan–Boltzmann. Il massimo può stare nell'infrarosso o nell'ultravioletto, e un corpo nero emette eccome: «nero» vuol dire che assorbe tutto.` },
    { id: 'q-02', domanda: R`Che cos'era la «catastrofe ultravioletta»?`, opzioni: [R`La previsione classica di un'energia infinita alle onde corte`, R`Il fatto che i corpi caldi non emettono ultravioletto`, R`L'impossibilità di misurare l'ultravioletto con gli strumenti dell'Ottocento`, R`La scoperta dei raggi ultravioletti`], corretta: 0, spiegazione: R`La fisica classica dava a ogni onda della cavità la stessa energia. Le onde corte sono infinite, e il conto dava un'energia infinita. Le misure dicevano il contrario: la curva scende, ma un po' di ultravioletto c'è. Non era un problema di strumenti, ma di teoria: lo risolsero i quanti di Planck.` },
    { id: 'q-03', domanda: R`Se la frequenza di una radiazione raddoppia, come cambia l'energia di un suo quanto?`, opzioni: [R`Resta uguale`, R`Si dimezza`, R`Diventa quattro volte tanto`, R`Raddoppia`], corretta: 3, spiegazione: R`$E = h \cdot f$ è proporzionale alla frequenza, non al suo quadrato. È $h$ a restare uguale, non il quanto.` },
    { id: 'q-04', domanda: R`Una luce rossa fortissima non stacca elettroni da un metallo con la soglia nel verde. Perché?`, opzioni: [R`Perché la luce rossa non trasporta energia`, R`Perché ogni fotone rosso ha meno energia del lavoro di estrazione`, R`Perché gli elettroni non hanno avuto abbastanza tempo per accumulare energia`, R`Perché la luce intensa respinge gli elettroni`], corretta: 1, spiegazione: R`Ogni fotone agisce da solo su un elettrone: se $h \cdot f < W$, l'elettrone resta dentro, per quanti fotoni arrivino. L'energia non si accumula col tempo, e la luce rossa trasporta energia: scalda.` },
    { id: 'q-05', domanda: R`Nel grafico dell'energia cinetica massima degli elettroni contro la frequenza della luce, che cosa dà la pendenza della retta?`, opzioni: [R`Il lavoro di estrazione`, R`La costante di Planck`, R`La frequenza di soglia`, R`L'intensità della luce`], corretta: 1, spiegazione: R`Da $K_{\text{max}} = h \cdot f - W$: la pendenza è $h$, uguale per tutti i metalli. La retta taglia l'asse delle frequenze in $f_0$ e, prolungata, l'asse verticale in $-W$. L'intensità non compare.` },
    { id: 'q-06', domanda: R`Che cos'è il lavoro di estrazione di un metallo?`, opzioni: [R`L'energia cinetica degli elettroni emessi`, R`L'energia di un fotone di luce visibile`, R`Il lavoro del campo elettrico che accelera gli elettroni`, R`L'energia minima per strappare un elettrone al metallo`], corretta: 3, spiegazione: R`È l'energia che un elettrone deve ricevere per uscire, e dipende dal metallo. L'energia cinetica è quello che avanza dopo averla pagata.` },
    { id: 'q-07', domanda: R`Il fotone non ha massa. Ha quantità di moto?`, opzioni: [R`Sì: $p = h / \lambda$`, R`No: con $m = 0$ anche $p = m \cdot v$ vale zero`, R`Solo se è un fotone di raggi X`, R`Solo nell'istante in cui urta un elettrone`], corretta: 0, spiegazione: R`Per il fotone vale $p = E / c = h / \lambda$, a qualunque frequenza. La formula $p = m \cdot v$ non si applica a ciò che non ha massa. L'effetto Compton e la pressione della luce lo confermano.` },
    { id: 'q-08', domanda: R`Nell'effetto Compton, il fotone deviato da un elettrone esce con…`, opzioni: [R`la stessa lunghezza d'onda`, R`una lunghezza d'onda più corta`, R`una lunghezza d'onda più lunga`, R`una velocità minore di $c$`], corretta: 2, spiegazione: R`Il fotone cede all'elettrone parte della sua energia, quindi esce con frequenza più bassa e lunghezza d'onda più lunga. Nel vuoto un fotone va sempre a $c$.` },
    { id: 'q-09', domanda: R`Perché un gas di idrogeno acceso emette solo certe righe di colore?`, opzioni: [R`Perché gli elettroni girano tutti alla stessa velocità`, R`Perché il prisma lascia passare solo alcuni colori`, R`Perché il gas è troppo freddo per emettere uno spettro continuo`, R`Perché i livelli di energia sono discreti, e ogni salto dà un fotone di energia precisa`], corretta: 3, spiegazione: R`L'elettrone sta solo su certi livelli. Un salto fra due livelli emette un fotone con $h \cdot f = E_i - E_f$: solo certe frequenze, solo certi colori. Il prisma scompone la luce, non la sceglie.` },
    { id: 'q-10', domanda: R`L'energia dello stato fondamentale dell'idrogeno è $-13{,}6\,\text{eV}$. Che cosa vuol dire?`, opzioni: [R`Che l'elettrone ha energia cinetica negativa`, R`Che servono 13,6 eV per strappare l'elettrone all'atomo`, R`Che l'atomo emette 13,6 eV ogni secondo`, R`Che il nucleo ha carica negativa`], corretta: 1, spiegazione: R`Il segno meno vuol dire che l'elettrone è legato: zero è l'energia dell'elettrone libero e fermo. Per arrivarci bisogna dargli 13,6 eV. L'energia cinetica non è mai negativa, e nello stato fondamentale l'atomo non irraggia.` },
    { id: 'q-11', domanda: R`L'elettrone di un atomo di idrogeno passa dal livello $n = 3$ al livello $n = 2$. Che cosa succede?`, opzioni: [R`L'atomo emette un fotone con energia $E_3 - E_2$`, R`L'atomo assorbe un fotone con energia $E_3 - E_2$`, R`L'atomo emette un elettrone`, R`L'atomo emette un fotone con energia $E_3 + E_2$`], corretta: 0, spiegazione: R`Scendendo di livello l'elettrone perde energia, e la emette tutta in un fotone: è la riga rossa di Balmer, a 656 nm. Per salire servirebbe invece assorbire un fotone. L'energia del fotone è una differenza fra livelli, mai una somma.` },
    { id: 'q-12', domanda: R`Com'è la lunghezza d'onda di de Broglie di una palla da tennis lanciata?`, opzioni: [R`Circa come quella della luce visibile`, R`Uguale a quella di un elettrone veloce`, R`Così piccola che nessun effetto d'onda si può vedere`, R`Più grande di quella di un elettrone, perché la palla ha più massa`], corretta: 2, spiegazione: R`Da $\lambda = h / (m \cdot v)$: con una massa di decine di grammi e $h$ minuscola, $\lambda$ è molto più piccola di un nucleo. Massa più grande vuol dire onda più corta, non più lunga.` },
    { id: 'q-13', domanda: R`Elettroni sparati uno alla volta contro due fenditure vicine. Che cosa si vede, dopo moltissimi elettroni, sullo schermo?`, opzioni: [R`Un solo punto, dove arrivano tutti`, R`Due sole strisce, dietro le due fenditure`, R`Niente: un elettrone alla volta non lascia traccia`, R`Tante frange chiare e scure, come la luce di Young`], corretta: 3, spiegazione: R`Ogni elettrone arriva in un punto, ma i punti si addensano a frange: l'onda di ogni elettrone passa da tutte e due le fenditure e interferisce. Due sole strisce sarebbero di palline senza onda.` },
    { id: 'q-14', domanda: R`Che cosa dice il principio di indeterminazione di Heisenberg?`, opzioni: [R`Che posizione e quantità di moto di una particella non si conoscono insieme con precisione qualsiasi`, R`Che ogni misura ha un errore, che si può sempre ridurre`, R`Che le particelle si muovono a caso perché gli strumenti le disturbano`, R`Che l'energia di un atomo non si conserva`], corretta: 0, spiegazione: R`$\Delta x \cdot \Delta p \ge h / (4\pi)$: è un limite della natura, che nessuno strumento migliore può superare. Non è un errore di misura che si riduce con più cura.` },
    { id: 'q-15', domanda: R`Quale fra queste radiazioni ha i fotoni di energia più grande?`, opzioni: [R`Le onde radio`, R`I raggi X`, R`La luce rossa`, R`L'infrarosso`], corretta: 1, spiegazione: R`L'energia del fotone è $h \cdot f$: vince la frequenza più alta, cioè la lunghezza d'onda più corta. In ordine crescente: radio, infrarosso, rosso, raggi X.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`I nanometri vanno in metri prima di usare $h$ in J·s: $1\,\text{nm} = 10^{-9}\,\text{m}$. Dimenticarlo sbaglia il risultato di un miliardo di volte.` },
    { tipo: 'errore', testo: R`Più intensità non vuol dire fotoni più energetici. L'energia di un fotone la decide solo la frequenza: $E = h \cdot f$.` },
    { tipo: 'errore', testo: R`L'elettronvolt è un'unità di **energia**, il volt di potenziale. Un elettrone che attraversa 5 V acquista 5 eV.` },
    { tipo: 'errore', testo: R`Per il fotone non si usa $p = m \cdot v$: non ha massa, ma ha quantità di moto $p = h / \lambda$.` },
    { tipo: 'trucco', testo: R`Dalla lunghezza d'onda all'energia in un colpo: $E$ in eV $\approx 1240$ diviso $\lambda$ in nanometri.` },
    { tipo: 'trucco', testo: R`Un fotone visibile vale fra 1,8 e 3,1 eV. Se il tuo fotone di luce ti viene mille volte di più, c'è un errore nelle potenze di dieci.` },
    { tipo: 'metodo', testo: R`Nei salti dell'atomo di Bohr scrivi prima le due energie con $E_n = -13{,}6\,\text{eV}/n^2$. Poi fai partenza meno arrivo: è l'energia del fotone.` },
    { tipo: 'metodo', testo: R`Con numeri come $10^{-34}$ fai il conto in due tempi: prima i numeri davanti, poi gli esponenti. Alla fine controlla l'ordine di grandezza.` }
  ],
  aneddoti: [
    { fisico: 'Max Planck', anni: '1858–1947', titolo: 'La cartolina spedita la sera stessa', testo: R`Domenica 7 ottobre 1900 il fisico Heinrich Rubens andò a trovare Max Planck nella sua casa di Berlino. Con il collega Ferdinand Kurlbaum aveva appena misurato lo spettro del corpo nero nell'infrarosso lontano. Alle onde lunghe le misure non seguivano la formula usata fino ad allora. Quella sera stessa Planck cercò una formula che andasse bene a tutte le lunghezze d'onda. La trovò, la scrisse su una cartolina e la spedì a Rubens. Il 19 ottobre la presentò alla Società tedesca di fisica. Poi passò settimane a cercarne il perché. Il 14 dicembre 1900 diede la spiegazione: l'energia scambiata a pacchetti $h \cdot f$. Quel giorno è considerato la nascita della fisica dei quanti.`, legame: R`È l'ipotesi dei quanti, $E = h \cdot f$, nata per spiegare lo spettro del corpo nero.` },
    { fisico: 'Robert Millikan', anni: '1868–1953', titolo: 'Dieci anni per dare torto a Einstein', testo: R`Robert Millikan non credeva ai fotoni. L'idea di Einstein gli sembrava contraria a tutto quello che si sapeva sulla luce come onda. Così, all'Università di Chicago, decise di metterla alla prova. Per anni misurò l'energia degli elettroni strappati dalla luce a metalli come il sodio e il litio. Le superfici dovevano essere pulitissime: le raschiava con un coltellino mosso da una calamita, dentro il vuoto. Nel 1916 pubblicò i risultati. L'equazione di Einstein funzionava alla perfezione. Dalla pendenza delle rette ricavò un valore di $h$ vicinissimo a quello di oggi. Nello stesso articolo, però, scrisse che la teoria di Einstein gli sembrava ancora insostenibile. Più tardi raccontò di aver dovuto dargli ragione contro ogni sua aspettativa.`, legame: R`È la verifica dell'equazione $K_{\text{max}} = h \cdot f - W$ e la misura di $h$ con il potenziale d'arresto.` },
    { fisico: 'Niels Bohr', anni: '1885–1962', titolo: 'La formula di un insegnante di Basilea', testo: R`Nel 1912 il giovane danese Niels Bohr lavorò alcuni mesi a Manchester con Ernest Rutherford. Voleva capire come potesse stare in piedi un atomo con il nucleo e gli elettroni attorno. Tornato a Copenaghen, all'inizio del 1913 ne parlò con il collega Hans Marius Hansen, che studiava gli spettri. Hansen gli chiese se conoscesse la formula di Balmer per le righe dell'idrogeno. Bohr non l'aveva presente. L'aveva trovata nel 1885 Johann Jakob Balmer, insegnante in una scuola femminile di Basilea, cercando una regola nei numeri delle righe. Più tardi Bohr raccontò che, appena vista quella formula, tutto gli fu chiaro. Il suo modello uscì a luglio del 1913.`, legame: R`È l'origine dei livelli $E_n = -13{,}6\,\text{eV}/n^2$, che spiegano le righe di Balmer.` },
    { fisico: 'Louis de Broglie', anni: '1892–1987', titolo: 'L\'angolo sollevato del grande velo', testo: R`Louis de Broglie veniva da una famiglia nobile francese, e all'università si laureò in storia. Poi lo conquistò la fisica, anche grazie al fratello maggiore Maurice, che studiava i raggi X. Durante la Prima guerra mondiale fece il radiotelegrafista alla stazione della torre Eiffel. Nel 1924 discusse a Parigi la sua tesi di dottorato: a ogni particella va associata un'onda. I professori erano perplessi. Paul Langevin ne mandò una copia a Einstein, per avere un parere. Einstein la prese sul serio e scrisse a Hendrik Lorentz che de Broglie aveva «sollevato un angolo del grande velo». Tre anni dopo la diffrazione degli elettroni gli diede ragione. Nel 1929 ricevette il premio Nobel.`, legame: R`È l'ipotesi delle onde di materia, $\lambda = h / p$.` },
    { fisico: 'Werner Heisenberg', anni: '1901–1976', titolo: 'Il principio scritto mentre Bohr sciava', testo: R`Nell'inverno del 1927 Werner Heisenberg lavorava a Copenaghen, nell'istituto di Niels Bohr. I due discutevano per ore su che cosa volesse dire misurare un elettrone. A febbraio Bohr partì per una vacanza sugli sci in Norvegia. Rimasto solo, Heisenberg immaginò un microscopio che illumina un elettrone con raggi gamma. Più corta l'onda, meglio si vede la posizione. Ma il fotone dà all'elettrone un colpo che non si può prevedere. Da qui ricavò il principio di indeterminazione. Lo spiegò in una lunga lettera all'amico Wolfgang Pauli, poi scrisse l'articolo. Al ritorno Bohr trovò un errore nel ragionamento sul microscopio. La conclusione però restava giusta, e Heisenberg aggiunse una nota prima della stampa.`, legame: R`È il principio $\Delta x \cdot \Delta p \ge h / (4\pi)$.` }
  ]
});
})();
