/* Quanto — Cariche e campo elettrico (elettrostatica, quarto anno): la carica e l'elettrizzazione, conduttori e
   isolanti, la legge di Coulomb, la sovrapposizione, il campo elettrico e le linee di campo, il flusso e il teorema
   di Gauss, i conduttori in equilibrio, l'esperimento di Millikan.
   Colori come nei video: cariche positive viola (4), negative azzurre (1), forze arancio (2), campo grigio (C.ink).
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/elettrostatica.js */
(function () {
const R = String.raw;

/* il campo di una carica in 8 direzioni, su due cerchi: frecce lunghe come Q/r² (verso l'esterno se Q > 0) */
function frecceCampo(raggi) {
  const out = [];
  raggi.forEach(function (r) {
    for (let i = 0; i < 8; i++) {
      const th = i * Math.PI / 4, c = Math.cos(th).toFixed(4), s = Math.sin(th).toFixed(4);
      const L = '0.825*Q/' + (r * r).toFixed(4);
      const el = { tipo: 'vettore', da: [+(r * c).toFixed(4), +(r * s).toFixed(4)],
        a: [(r * c).toFixed(4) + ' + ' + c + '*' + L, (r * s).toFixed(4) + ' + ' + s + '*' + L], colore: 'grigio' };
      if (r === raggi[0] && i === 1) el.etichetta = 'E';
      out.push(el);
    }
  });
  return out;
}
/* una carica disegnata come cerchietto con il segno dentro: viola se positiva, azzurra se negativa.
   x è un'espressione; q è l'espressione della carica (il segno sceglie il colore) */
function caricaVariabile(x, y, q) {
  return [
    { tipo: 'punto', p: ['se(' + q + ' > 0, ' + x + ', sqrt(-1))', y], raggio: 16, vuoto: true, colore: 4 },
    { tipo: 'punto', p: ['se(' + q + ' < 0, ' + x + ', sqrt(-1))', y], raggio: 16, vuoto: true, colore: 1 },
    { tipo: 'testo', p: [x, y + '- 0.08'], testo: '{{? ' + q + ' > 0 | + | }}', colore: 4 },
    { tipo: 'testo', p: [x, y + '- 0.08'], testo: '{{? ' + q + ' < 0 | − | }}', colore: 1 }
  ];
}
function caricaFissa(x, y, segno, dy) {
  const col = segno > 0 ? 4 : 1;
  return [
    { tipo: 'punto', p: [x, y], raggio: 16, vuoto: true, colore: col },
    { tipo: 'testo', p: [x, y - (dy || 0.08)], testo: segno > 0 ? '+' : '−', colore: col }
  ];
}

QUANTO.registra({
  id: 'elettrostatica',
  titolo: 'Cariche e campo elettrico',
  introduzione: R`Una penna strofinata sul maglione attira i pezzetti di carta. Dopo una camminata sulla moquette, la maniglia della porta dà la scossa. Da una nuvola scende un fulmine. Sono tutti effetti della **carica elettrica**. Quando le cariche sono ferme si parla di **elettrostatica**.

Si parte da come si carica un corpo e da come le cariche si attraggono e si respingono: è la legge di Coulomb. Poi arriva un'idea nuova, il **campo elettrico**. Una carica cambia lo spazio attorno a sé, anche dove non c'è niente. Con il teorema di Gauss si capisce perché un'auto protegge da un fulmine. Con l'esperimento di Millikan si scopre che la carica viene a pacchetti.

Servono i vettori e la loro somma, i principi della dinamica e la notazione scientifica. Aiuta aver già visto la gravitazione: la legge di Coulomb le somiglia molto.`,
  inBreve: [
    R`La carica elettrica si conserva ed è **quantizzata**: ogni carica libera è un multiplo di $e = 1{,}60 \cdot 10^{-19}\,\text{C}$. Un corpo si carica perché guadagna o perde elettroni.`,
    R`**Legge di Coulomb**: $F = \dfrac{k \cdot q_1 \cdot q_2}{r^2}$, con $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$. Cariche dello stesso segno si respingono, di segno opposto si attraggono.`,
    R`Il **campo elettrico** è la forza su ogni coulomb di carica di prova: $\vec{E} = \vec{F}/q$, in N/C. Per una carica puntiforme $E = \dfrac{k \cdot Q}{r^2}$.`,
    R`Le **linee di campo** escono dalle cariche positive ed entrano nelle negative; dove sono fitte il campo è intenso. Con più cariche i campi si sommano come vettori.`,
    R`**Teorema di Gauss**: il flusso del campo attraverso una superficie chiusa è $\Phi = Q/\varepsilon_0$, dove $Q$ è la carica dentro.`,
    R`In un conduttore in equilibrio il campo dentro è zero e la carica sta sulla superficie: è la **gabbia di Faraday**.`
  ],
  sezioni: [
    {
      id: 'carica',
      titolo: 'La carica elettrica',
      testo: R`In una giornata secca i capelli pettinati si alzano e seguono il pettine. Una penna strofinata attira la carta. Sono effetti della **carica elettrica**, una proprietà della materia come la massa.

La materia è fatta di atomi. Nel nucleo ci sono i **protoni**, con carica positiva, e i neutroni, senza carica. Attorno al nucleo si muovono gli **elettroni**, con carica negativa.

>* La carica dell'elettrone è $-e$, quella del protone è $+e$. La **carica elementare** vale $e = 1{,}60 \cdot 10^{-19}\,\text{C}$. La carica si misura in **coulomb** (C).

Un corpo con tanti elettroni quanti protoni è **neutro**: la sua carica totale è zero. Dentro però ci sono moltissime cariche, positive e negative.

[[video:elettrostatica/cariche]]

Strofinando una bacchetta di plastica con la lana, alcuni elettroni passano dalla lana alla plastica. La plastica diventa negativa, la lana positiva. I protoni restano fermi nei nuclei: si spostano solo gli elettroni.

>* **Conservazione della carica**: la carica non si crea e non si distrugge. In un sistema isolato la carica totale resta sempre la stessa.

Ogni carica libera è un multiplo intero di $e$: si dice che la carica è **quantizzata**. Contato in elettroni, un coulomb è una carica enorme.

~ n = \dfrac{Q}{e} :: quanti elettroni servono per avere una carica Q
~ n = \dfrac{1\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} :: per un coulomb: i coulomb si semplificano
~ n = \evidb{6{,}25 \cdot 10^{18}} :: più di sei miliardi di miliardi di elettroni

Per questo nella vita di tutti i giorni si usano i sottomultipli: il microcoulomb, $1\,\mu\text{C} = 10^{-6}\,\text{C}$, e il nanocoulomb, $1\,\text{nC} = 10^{-9}\,\text{C}$.

>! Un corpo positivo non ha ricevuto protoni da fuori. Ha perso elettroni: i protoni non lasciano il nucleo.

?? Una bacchetta strofinata diventa negativa. Che cosa è successo?
[x] ha ricevuto elettroni dal panno
[ ] ha perso protoni
[ ] si è creata della carica negativa
=> Si spostano solo gli elettroni: la bacchetta li ha presi dal panno, che ora è positivo. La carica totale non cambia.`
    },
    {
      id: 'elettrizzazione',
      titolo: 'Conduttori, isolanti e induzione elettrostatica',
      testo: R`Le cariche dello stesso segno si respingono, quelle di segno opposto si attraggono. Ma allora perché la penna carica attira la carta neutra? Per capirlo bisogna sapere come si muovono le cariche nei materiali.

>* Nei **conduttori**, come i metalli, alcuni elettroni si muovono liberi in tutto il corpo. Negli **isolanti**, come plastica, vetro e carta, gli elettroni restano legati ai loro atomi.

Anche il corpo umano e l'acqua del rubinetto conducono, meno bene dei metalli. Per questo una sbarra di metallo tenuta in mano non si carica strofinandola: le cariche scappano attraverso di noi.

Ci sono tre modi di elettrizzare un corpo.

- **Strofinio**: due isolanti diversi, sfregati, si scambiano elettroni.
- **Contatto**: un corpo carico tocca un conduttore e gli cede una parte della sua carica, dello stesso segno.
- **Induzione elettrostatica**: un corpo carico si avvicina a un conduttore senza toccarlo. Gli elettroni liberi si spostano e le cariche si separano.

Due sfere di metallo uguali, messe a contatto, si dividono la carica totale in parti uguali.

Nell'induzione la sfera resta neutra. Però le cariche di segno opposto alla bacchetta si raccolgono dalla parte vicina. La forza cala con la distanza, quindi l'attrazione vince sulla repulsione. Un corpo carico attira sempre un conduttore neutro.

Anche un isolante neutro viene attirato. Le sue molecole si **polarizzano**: dentro ognuna le cariche si spostano un poco. Ecco perché la penna strofinata attira i pezzetti di carta.

Se durante l'induzione la sfera è collegata a terra, le cariche respinte dalla bacchetta scappano a terra. Con una bacchetta negativa se ne vanno elettroni; con una positiva ne salgono da terra. Si stacca il filo e solo dopo si allontana la bacchetta: la sfera resta carica, con segno opposto a quello della bacchetta.

>! Attrazione non vuol dire per forza cariche opposte: un corpo carico attira anche un corpo neutro. Solo la **repulsione** prova che due corpi hanno carica dello stesso segno.

L'**elettroscopio** dice se un corpo è carico. Due foglioline di metallo leggero pendono da un'asta. Toccando l'asta con un corpo carico, le foglioline si caricano dello stesso segno e si allargano.

?? Avvicini una bacchetta negativa a una sfera di metallo neutra, appesa a un filo isolante, senza toccarla. Che cosa succede?
[ ] la sfera è respinta
[x] la sfera è attratta
[ ] niente, perché la sfera è neutra
=> Gli elettroni liberi della sfera vanno dalla parte lontana. Dalla parte vicina restano cariche positive, più vicine alla bacchetta: l'attrazione vince.`
    },
    {
      id: 'coulomb',
      titolo: 'La legge di Coulomb',
      testo: R`Più le cariche sono grandi, più la forza fra loro è forte. Più sono lontane, più la forza è debole. Nel 1785 Charles-Augustin de Coulomb misurò questa forza con una bilancia di torsione.

[[video:elettrostatica/coulomb]]

>* **Legge di Coulomb**: due cariche puntiformi $q_1$ e $q_2$, a distanza $r$, si scambiano una forza $F = \dfrac{k \cdot q_1 \cdot q_2}{r^2}$. La forza sta sulla retta che le unisce. Cariche dello stesso segno si respingono, di segno opposto si attraggono.

Con i segni delle cariche nella formula, $F$ positiva vuol dire repulsione e $F$ negativa attrazione. Le due forze, una su ciascuna carica, sono uguali e opposte, come vuole il terzo principio.

Nel vuoto la costante vale $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$, e nell'aria quasi lo stesso. Spesso si scrive $k = \dfrac{1}{4\pi \cdot \varepsilon_0}$. Qui $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$ è la **costante dielettrica del vuoto**. Dentro un isolante, come l'acqua, la forza si divide per la costante dielettrica relativa $\varepsilon_r$: per l'acqua circa 80.

È una legge dell'inversa del quadrato, come la gravitazione di Newton. Distanza doppia, forza un quarto. Carica doppia, forza doppia.

[[grafico:forze-coulomb]]

Quanto è grande un coulomb? Prendiamo due cariche di 1 C, a un chilometro di distanza.

~ F = \dfrac{k \cdot q_1 \cdot q_2}{r^2} :: due cariche di 1 C, a 1 km = 1000 m
~ F = \dfrac{8{,}99 \cdot 10^9 \cdot 1 \cdot 1}{1000^2}\,\text{N} :: con coulomb e metri restano i newton
~ F \approx \evidb{9 \cdot 10^3\,\text{N}} :: il peso di quasi una tonnellata

La forza elettrica è enormemente più forte della gravità. Fra l'elettrone e il protone di un atomo, il rapporto non dipende dalla distanza:

~ \dfrac{F_e}{F_g} = \dfrac{k \cdot e^2}{G \cdot m_e \cdot m_p} :: le due leggi hanno lo stesso $r^2$: si semplifica
~ k \cdot e^2 \approx 2{,}30 \cdot 10^{-28}\,\text{N} \cdot \text{m}^2 :: con $e = 1{,}60 \cdot 10^{-19}\,\text{C}$
~ G \cdot m_e \cdot m_p \approx 1{,}01 \cdot 10^{-67}\,\text{N} \cdot \text{m}^2 :: con $G = 6{,}67 \cdot 10^{-11}$ e le masse $9{,}11 \cdot 10^{-31}$ e $1{,}67 \cdot 10^{-27}\,\text{kg}$
~ \dfrac{F_e}{F_g} \approx \evidb{2{,}3 \cdot 10^{39}} :: un due seguito da 39 cifre

Perché allora la gravità sembra comandare? Perché la materia è quasi sempre neutra: attrazioni e repulsioni si compensano.

>! Nella legge di Coulomb le cariche vanno in coulomb e la distanza in metri. Una carica di 3 μC si scrive $3 \cdot 10^{-6}\,\text{C}$; una distanza di 20 cm è $0{,}20\,\text{m}$.

?? Due cariche si respingono con forza $F$. Una delle due raddoppia, e intanto raddoppia anche la distanza. Quanto vale ora la forza?
[x] $F/2$
[ ] $F$
[ ] $2 \cdot F$
=> Carica doppia: forza per 2. Distanza doppia: forza divisa per $2^2 = 4$. In tutto $2/4 = 1/2$.`
    },
    {
      id: 'sovrapposizione',
      titolo: 'Più cariche: le forze si sommano',
      testo: R`Una carica vicina a molte altre sente una forza da ciascuna. Ogni coppia segue la legge di Coulomb, come se le altre cariche non ci fossero.

>* **Principio di sovrapposizione**: la forza totale su una carica è la somma vettoriale delle forze di tutte le altre cariche, $\vec{F} = \vec{F}_1 + \vec{F}_2 + \dots$

Le frecce sopra le lettere ricordano che si sommano vettori, non numeri. Con le cariche tutte sulla stessa retta basta fare attenzione ai versi.

Esempio. Su una retta ci sono tre cariche positive, a 1 m l'una dall'altra. A sinistra c'è +4 μC, in mezzo $q = +1\,\mu\text{C}$, a destra +1 μC. Quanto vale la forza su $q$?

~ F_1 = \dfrac{k \cdot 4 \cdot 10^{-6} \cdot 10^{-6}}{1^2}\,\text{N} \approx 0{,}036\,\text{N} :: la carica di sinistra spinge q verso destra
~ F_2 = \dfrac{k \cdot 10^{-6} \cdot 10^{-6}}{1^2}\,\text{N} \approx 0{,}009\,\text{N} :: quella di destra, più piccola, spinge verso sinistra
~ F = 0{,}036\,\text{N} - 0{,}009\,\text{N} = \evidb{0{,}027\,\text{N}} :: versi opposti: si sottraggono, e vince la spinta verso destra

Quando le forze hanno direzioni diverse, si scompongono lungo due assi. Poi si sommano le componenti $x$ fra loro e le componenti $y$ fra loro. Se le due forze sono perpendicolari, il modulo della somma viene dal teorema di Pitagora.

Per ogni forza conviene fare così: il modulo con la legge di Coulomb, senza segni; la direzione e il verso dal disegno, guardando chi attrae e chi respinge.

>! I moduli non si sommano, se le forze non stanno sulla stessa retta. Prima si scompongono le forze, poi si sommano le componenti.

?? Una carica $q$ positiva sta esattamente a metà fra due cariche uguali, tutte e due positive. Quanto vale la forza totale su $q$?
[ ] il doppio della forza di una carica sola
[x] zero
[ ] dipende dal segno di $q$
=> Le due forze hanno lo stesso modulo e versi opposti: si annullano. Se $q$ fosse negativa si invertirebbero tutte e due, e la somma resterebbe zero.`
    },
    {
      id: 'campo',
      titolo: 'Il campo elettrico',
      testo: R`Una carica $Q$, ferma, cambia lo spazio attorno a sé. Un'altra carica, messa in un punto qualunque, sente subito una forza. Per descrivere questo spazio si usa il **campo elettrico**.

In un punto si mette una piccola **carica di prova** $q$, positiva, e si misura la forza $F$. Con una carica di prova doppia la forza raddoppia, ma il rapporto $F/q$ resta lo stesso. Quel rapporto dipende solo dal punto.

[[video:elettrostatica/campo]]

>* Il **campo elettrico** in un punto è la forza su ogni coulomb di carica di prova positiva: $\vec{E} = \dfrac{\vec{F}}{q}$. Si misura in newton al coulomb, N/C.

Il campo è un vettore, come la forza. Ha il verso della forza su una carica positiva. Una carica negativa sente invece una forza opposta al campo: $\vec{F} = q \cdot \vec{E}$, con $q < 0$.

Per una carica puntiforme $Q$, la legge di Coulomb dà la forza su $q$. Dividendo per $q$, la carica di prova se ne va:

$$E = \dfrac{k \cdot Q}{r^2}$$

Il campo punta in fuori dalle cariche positive e verso le cariche negative. Somiglia al campo gravitazionale $g = G \cdot M / r^2$, con un'altra costante. Ma la carica può essere anche negativa, mentre il campo gravitazionale punta sempre verso la massa.

[[grafico:campo-carica]]

Esempio. Una carica $Q = +5\,\mu\text{C}$. Quanto vale il campo a 50 cm? E che forza sente una carica di −2 nC messa lì?

~ E = \dfrac{8{,}99 \cdot 10^9 \cdot 5 \cdot 10^{-6}}{0{,}50^2}\,\text{N/C} :: carica in coulomb, distanza in metri
~ E \approx \evidb{1{,}8 \cdot 10^5\,\text{N/C}} :: verso l'esterno, perché Q è positiva
~ F = |q| \cdot E = 2 \cdot 10^{-9} \cdot 1{,}8 \cdot 10^5\,\text{N} :: il modulo della forza: carica per campo
~ F \approx \evidb{3{,}6 \cdot 10^{-4}\,\text{N}} :: la carica è negativa: la forza punta verso Q

>! Il campo non dipende dalla carica di prova. Dipende solo dalle cariche che lo creano e dal punto. Se togli la carica di prova, il campo resta.

?? Nello stesso punto metti una carica di prova $3 \cdot q$ al posto di $q$. Che cosa succede al campo elettrico?
[ ] triplica
[ ] diventa un terzo
[x] non cambia
=> Triplica la forza, ma triplica anche la carica: il rapporto $F/q$ resta uguale. Il campo è una proprietà del punto.`
    },
    {
      id: 'linee',
      titolo: 'Le linee di campo e il dipolo',
      testo: R`Disegnare una freccia in ogni punto crea presto un groviglio. Michael Faraday ebbe un'idea più semplice: le **linee di campo**, che lui chiamava linee di forza.

>* Le **linee di campo** sono tangenti al campo in ogni punto e ne seguono il verso. Escono dalle cariche positive ed entrano in quelle negative. Dove le linee sono più fitte, il campo è più intenso.

Due linee di campo non si incrociano mai. Nel punto d'incrocio il campo avrebbe due direzioni, ed è impossibile. Per una carica isolata le linee sono rette a raggiera: escono dalla carica se è positiva, ci entrano se è negativa.

Con più cariche, anche i campi si sommano come vettori: $\vec{E} = \vec{E}_1 + \vec{E}_2 + \dots$ È lo stesso principio di sovrapposizione delle forze.

Il caso più importante è il **dipolo elettrico**: due cariche uguali e opposte, $+q$ e $-q$, vicine. Molte molecole, come quella dell'acqua, si comportano come piccoli dipoli. Le linee partono dalla carica positiva e si curvano fino a quella negativa.

[[grafico:dipolo]]

Esempio. Un dipolo ha cariche di +1 nC e −1 nC, a 6 cm l'una dall'altra. Un punto P sta sulla retta perpendicolare al dipolo che passa per il centro, a 4 cm dal centro. Quanto vale il campo in P?

~ r = \sqrt{3^2 + 4^2}\,\text{cm} = 5\,\text{cm} :: distanza di P da ciascuna carica: metà dipolo è 3 cm
~ E_1 = \dfrac{8{,}99 \cdot 10^9 \cdot 10^{-9}}{0{,}05^2}\,\text{N/C} \approx 3600\,\text{N/C} :: lo stesso modulo per le due cariche
~ E = 2 \cdot E_1 \cdot \dfrac{3}{5} \approx \evidb{4{,}3 \cdot 10^3\,\text{N/C}} :: ognuna vale $E_1 \cdot 3/5$ (metà dipolo diviso la distanza): le componenti perpendicolari si annullano

Il campo in P è parallelo al dipolo e punta dalla carica positiva verso la negativa.

>! Una linea di campo non è la strada che fa una carica. La forza è tangente alla linea, ma la velocità no: dove la linea si curva, la carica se ne stacca.

?? Due linee di campo possono incrociarsi in un punto?
[ ] sì, dove i campi di due cariche si sommano
[x] no, mai
[ ] sì, ma solo vicino alle cariche negative
=> In ogni punto il campo totale ha una sola direzione. Se due linee si incrociassero, lì il campo ne avrebbe due.`
    },
    {
      id: 'gauss',
      titolo: 'Il flusso e il teorema di Gauss',
      testo: R`Perché il campo di una carica cala proprio come $1/r^2$? Le linee di campo danno una risposta semplice.

Avvolgiamo la carica in una sfera di raggio $r$: tutte le linee che escono dalla carica la bucano. La superficie della sfera è $4\pi \cdot r^2$. Con il raggio doppio, le stesse linee si spartiscono una superficie quattro volte più grande.

[[video:elettrostatica/gauss]]

Per contare le linee che attraversano una superficie si usa il **flusso**.

>* Il **flusso del campo elettrico** attraverso una superficie piana $S$, in un campo uniforme, è $\Phi = E \cdot S \cdot \cos\alpha$. Qui $\alpha$ è l'angolo fra il campo e la perpendicolare alla superficie. Si misura in $\text{N} \cdot \text{m}^2/\text{C}$.

Il flusso è massimo con la superficie messa di fronte al campo ($\alpha = 0°$). È zero con la superficie parallela alle linee ($\alpha = 90°$).

[[grafico:flusso]]

~ \Phi = E \cdot S \cdot \cos\alpha :: campo di 200 N/C, superficie di 0,5 m², perpendicolare inclinata di 60°
~ \Phi = 200\,\text{N/C} \cdot 0{,}5\,\text{m}^2 \cdot 0{,}5 :: $\cos 60° = 0{,}5$
~ \Phi = \evidb{50\,\text{N} \cdot \text{m}^2/\text{C}} :: metà del flusso che avrebbe di fronte al campo

Per una superficie chiusa la perpendicolare si prende verso l'esterno. Le linee che escono contano positive, quelle che entrano negative.

>* **Teorema di Gauss**: il flusso del campo elettrico attraverso una superficie chiusa è $\Phi = \dfrac{Q}{\varepsilon_0}$. Qui $Q$ è la carica totale che c'è dentro.

Vale per qualunque forma della superficie. Le cariche fuori non contano: le loro linee entrano ed escono, e il flusso totale è zero. Dal teorema si ritrova la legge di Coulomb. Sulla sfera il campo è perpendicolare e uguale dappertutto:

~ E \cdot 4\pi \cdot r^2 = \dfrac{Q}{\varepsilon_0} :: sulla sfera il flusso è campo per superficie
~ E = \dfrac{Q}{4\pi \cdot \varepsilon_0 \cdot r^2} :: divido per la superficie della sfera
~ E = \evidb{\dfrac{k \cdot Q}{r^2}} :: con $k = 1/(4\pi \cdot \varepsilon_0)$: è il campo di Coulomb

Con lo stesso metodo si trova il campo di una lastra piana molto grande, carica in modo uniforme. Sia $\sigma$ la carica su ogni metro quadrato, in C/m²: è la **densità superficiale di carica**. Come superficie chiusa si prende una scatoletta che attraversa la lastra. Il campo esce dalle due basi, di area $S$, quindi $2 \cdot E \cdot S = \dfrac{\sigma \cdot S}{\varepsilon_0}$. Il campo vale $E = \dfrac{\sigma}{2 \cdot \varepsilon_0}$, uguale a ogni distanza. Fra due lastre con cariche opposte i due campi si sommano: $E = \dfrac{\sigma}{\varepsilon_0}$, uniforme. Fuori dalle lastre si annullano.

Il terzo caso è un **filo** rettilineo molto lungo, carico in modo uniforme. Sia $\lambda$ la carica su ogni metro di filo, in C/m: è la **densità lineare di carica**. Il campo è radiale, perpendicolare al filo. Come superficie chiusa si prende un cilindro di raggio $r$ e lunghezza $\ell$, con il filo sull'asse. Dalle due basi non esce flusso, perché il campo le sfiora.

~ E \cdot 2\pi \cdot r \cdot \ell = \dfrac{\lambda \cdot \ell}{\varepsilon_0} :: il flusso esce solo dal fianco; dentro c'è la carica $\lambda \cdot \ell$
~ E = \evidb{\dfrac{\lambda}{2\pi \cdot \varepsilon_0 \cdot r}} :: la lunghezza $\ell$ si semplifica

Il campo del filo cala come $1/r$, non come $1/r^2$. Ha la stessa forma del campo magnetico di un filo con corrente, $B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$, che vedrai in «Il campo magnetico».

>! Flusso zero non vuol dire campo zero. Con una carica fuori, la superficie ha flusso zero, ma su di essa il campo c'è.

?? Una superficie chiusa contiene una carica di +3 nC e una di −3 nC. Quanto vale il flusso del campo attraverso la superficie?
[ ] il doppio del flusso di una carica sola
[x] zero
[ ] dipende dalla forma della superficie
=> Conta solo la carica totale dentro: $+3 - 3 = 0$, quindi $\Phi = 0$. La forma della superficie non c'entra.`
    },
    {
      id: 'conduttori',
      titolo: 'I conduttori in equilibrio',
      testo: R`In un metallo gli elettroni liberi si muovono appena sentono una forza. Quando tutto si è fermato, il conduttore è in **equilibrio elettrostatico**. Ci arriva in un tempo brevissimo.

[[video:elettrostatica/conduttori]]

>* In un conduttore in equilibrio il campo elettrico all'interno è **zero**. La carica in eccesso sta tutta sulla **superficie**. Appena fuori, il campo è **perpendicolare** alla superficie.

Le tre proprietà vengono da un'idea sola. Se dentro ci fosse un campo, gli elettroni liberi si muoverebbero, e non sarebbe equilibrio. Un campo lungo la superficie farebbe scorrere le cariche: quindi il campo è perpendicolare. Infine, con il campo zero, per Gauss dentro non c'è carica.

Un conduttore neutro in un campo esterno fa lo stesso. Gli elettroni si spostano contro il campo e lasciano cariche positive dall'altra parte. Dentro, il campo di queste cariche annulla quello esterno.

[[grafico:conduttore]]

Appena fuori dalla superficie il campo vale $E = \dfrac{\sigma}{\varepsilon_0}$. È il doppio della lastra isolata: dentro il metallo il campo è zero, quindi tutto il flusso esce da una parte sola. Le cariche si addensano dove la superficie è più curva: sulle **punte** il campo diventa fortissimo. Oltre circa $3 \cdot 10^6$ N/C l'aria diventa conduttrice e scocca una scintilla. È il **potere delle punte**.

Fuori da una sfera di metallo carica il campo è quello di una carica puntiforme messa al centro. Dentro è zero.

[[grafico:sfera-carica]]

~ E = \dfrac{k \cdot Q}{R^2} :: il campo sulla superficie di una sfera di raggio 10 cm
~ Q = \dfrac{E \cdot R^2}{k} = \dfrac{3 \cdot 10^6 \cdot 0{,}10^2}{8{,}99 \cdot 10^9}\,\text{C} :: con il campo massimo che l'aria sopporta
~ Q \approx \evidb{3{,}3 \cdot 10^{-6}\,\text{C}} :: poco più di 3 μC: oltre, l'aria scarica la sfera

Il **parafulmine** è una punta di metallo collegata a terra con un cavo. Non crea il fulmine: gli offre una strada sicura verso terra.

>* Dentro una scatola di metallo chiusa, il campo delle cariche esterne è zero: è la **gabbia di Faraday**.

Per questo in auto, durante un temporale, si è al sicuro. Non per le gomme: dopo chilometri di aria, pochi centimetri di gomma non fermano un fulmine.

>! Una sfera di metallo cava e una piena, con la stessa carica, hanno lo stesso campo fuori. In tutte e due la carica sta sulla superficie esterna.

?? Una sfera di metallo piena viene caricata con +6 nC. Dove si trova la carica in eccesso?
[ ] distribuita in tutto il volume
[x] sulla superficie esterna
[ ] concentrata nel centro
=> Le cariche dello stesso segno si respingono e si allontanano il più possibile. In equilibrio stanno tutte sulla superficie.`
    },
    {
      id: 'millikan',
      titolo: 'L\'esperimento di Millikan',
      testo: R`La carica si può dividere in pezzi piccoli a piacere? Nel 1909 Robert Millikan rispose con delle goccioline d'olio.

Fra due piatti di metallo orizzontali c'è un campo elettrico uniforme, diretto verso il basso. Si spruzzano goccioline d'olio, e alcune si caricano per strofinio. Al microscopio se ne segue una.

[[video:elettrostatica/millikan]]

Senza campo, la goccia cade. L'aria la frena, e presto scende a velocità costante. Da questa velocità si ricava la sua massa $m$. Poi si accende il campo e lo si regola finché la goccia resta ferma.

>* Una goccia ferma fra i piatti è in equilibrio: la forza elettrica pareggia il peso, $|q| \cdot E = m \cdot g$. Quindi $|q| = \dfrac{m \cdot g}{E}$.

Prendiamo una goccia di massa $3{,}71 \cdot 10^{-15}\,\text{kg}$: resta ferma con un campo di $7{,}57 \cdot 10^4\,\text{N/C}$.

~ |q| = \dfrac{m \cdot g}{E} :: forza elettrica e peso si equilibrano
~ |q| = \dfrac{3{,}71 \cdot 10^{-15} \cdot 9{,}8}{7{,}57 \cdot 10^4}\,\text{C} :: newton diviso newton al coulomb dà coulomb
~ |q| \approx 4{,}80 \cdot 10^{-19}\,\text{C} = \evidb{3 \cdot e} :: tre cariche elementari

Il campo punta in basso e la forza elettrica in alto: la goccia è negativa. Ha tre elettroni in più.

Nel grafico c'è un'altra goccia, con due elettroni in più.

[[grafico:millikan]]

Millikan misurò moltissime gocce. Le cariche erano sempre multipli interi di uno stesso valore, mai a metà strada. Quel valore è la carica elementare $e$.

>* La carica è **quantizzata**: ogni carica libera è un multiplo intero della carica elementare, $q = n \cdot e$, con $e = 1{,}60 \cdot 10^{-19}\,\text{C}$.

> Protoni e neutroni sono fatti di quark, con cariche di $\pm\frac{1}{3} \cdot e$ e $\pm\frac{2}{3} \cdot e$. Ma i quark non si trovano mai isolati: le cariche libere sono sempre multipli di $e$.

>! La forza elettrica su una goccia negativa è opposta al campo. Se il campo punta in basso, la goccia negativa è spinta in alto.

?? Quale di queste cariche **non** può avere una goccia d'olio?
[ ] $11{,}2 \cdot 10^{-19}\,\text{C}$
[x] $4{,}0 \cdot 10^{-19}\,\text{C}$
[ ] $9{,}6 \cdot 10^{-19}\,\text{C}$
=> Divido per $e$: $11{,}2$ dà 7 e $9{,}6$ dà 6, ma $4{,}0$ dà 2,5. Mezza carica elementare non esiste.`
    }
  ],
  grafici: {
    /* due cariche e le forze di Coulomb: q₁ = 2 μC fissa, q₂ e la distanza sui cursori. F in newton = 179,8·q₂/r²
       (q₂ in μC, r in cm; cariche a ±r/20 unità); frecce di 0,45 unità per newton, dal bordo della carica */
    'forze-coulomb': {
      tipo: 'piano', x: [-2.8, 2.8], y: [-1.9, 1.5], assi: false, griglia: false,
      parametri: [
        { nome: 'q2', min: -3, max: 3, passo: 0.5, valore: 2.5, etichetta: 'q_2 (μC)' },
        { nome: 'r', min: 20, max: 40, passo: 1, valore: 22, etichetta: 'r (cm)' }
      ],
      elementi: [
        { tipo: 'segmento', da: ['-r/20', -0.55], a: ['r/20', -0.55], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['-r/20', -0.4], a: ['-r/20', -0.7], colore: 'grigio' },
        { tipo: 'segmento', da: ['r/20', -0.4], a: ['r/20', -0.7], colore: 'grigio' },
        { tipo: 'testo', p: [0, -1.05], testo: 'r = {{r}} cm' },
        { tipo: 'vettore', da: ['r/20 + 0.2*sign(q2)', 0], a: ['r/20 + 0.2*sign(q2) + 80.91*q2/r^2', 0], colore: 2, etichetta: 'F' },
        { tipo: 'vettore', da: ['-r/20 - 0.2*sign(q2)', 0], a: ['-r/20 - 0.2*sign(q2) - 80.91*q2/r^2', 0], colore: 2, etichetta: 'F' }
      ].concat(caricaFissa('-r/20', 0, +1), caricaVariabile('r/20', '0', 'q2'), [
        { tipo: 'testo', p: ['-r/20', 0.6], testo: 'q_1 = 2 μC', colore: 4 },
        { tipo: 'testo', p: ['se(q2 > 0, r/20, -99)', 0.6], testo: 'q_2 = {{q2}} μC', colore: 4 },
        { tipo: 'testo', p: ['se(q2 < 0, r/20, -99)', 0.6], testo: 'q_2 = {{q2}} μC', colore: 1 },
        { tipo: 'testo', p: ['se(q2 == 0, r/20, -99)', 0.6], testo: 'q_2 = 0' },
        { tipo: 'testo', p: [0, -1.65], testo: 'F = {{179.8*abs(q2)/r^2|2}} N{{? q2 > 0 | : si respingono | }}{{? q2 < 0 | : si attraggono | }}' }
      ]),
      didascalia: 'Una carica fissa di 2 μC e una seconda carica q₂. Le due forze sono uguali e opposte, e le frecce sono lunghe in proporzione alla forza. Stesso segno: si respingono. Segni opposti: si attraggono. I cursori cambiano q₂ e la distanza: a distanza doppia la forza diventa un quarto.'
    },
    'campo-carica': {
      tipo: 'piano', x: [-3.6, 3.6], y: [-3.6, 3.6], assi: false, griglia: false, altezza: 500,
      parametri: [{ nome: 'Q', min: -3, max: 3, passo: 0.5, valore: 2.5, etichetta: 'Q (nC)' }],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 1.5, colore: 'grigio', tratteggio: true },
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 'grigio', tratteggio: true }
      ].concat(frecceCampo([1.5, 3]), caricaVariabile('0', '0', 'Q')),
      didascalia: 'Il campo elettrico attorno a una carica Q, in punti a due distanze: le frecce esterne sono al doppio della distanza, e lunghe un quarto. Con Q positiva il campo punta in fuori, con Q negativa verso la carica. Il cursore cambia la carica.'
    },
    /* la somma dei campi di un dipolo in un punto P trascinabile: E₁ in fuori da +q, E₂ verso −q, lunghi come 1/r² */
    dipolo: {
      tipo: 'piano', x: [-4, 4], y: [-0.8, 5.1], assi: false, griglia: false, altezza: 440,
      parametri: [
        { nome: 'px', min: -3, max: 3, passo: 0.1, valore: 0.4, etichetta: 'x di P' },
        { nome: 'py', min: 2.8, max: 3.8, passo: 0.1, valore: 3, etichetta: 'y di P' }
      ],
      elementi: [
        { tipo: 'somma', da: ['px', 'py'],
          vettori: [['16*(px + 1.5)/((px + 1.5)^2 + py^2)^1.5', '16*py/((px + 1.5)^2 + py^2)^1.5'],
                    ['16*(1.5 - px)/((px - 1.5)^2 + py^2)^1.5', '-16*py/((px - 1.5)^2 + py^2)^1.5']],
          etichette: ['E_1', 'E_2'], colori: ['grigio', 'grigio'], parallelogramma: true, risultante: { etichetta: 'E', colore: 3 } },
        { tipo: 'punto', p: ['px', 'py'], trascina: true, colore: 'grigio', etichetta: 'P', posizione: 'basso-sinistra' }
      ].concat(caricaFissa(-1.5, 0, +1), caricaFissa(1.5, 0, -1)),
      didascalia: 'Un dipolo: +q a sinistra, −q a destra. Nel punto P il campo della carica positiva, E₁, punta lontano da lei; quello della negativa, E₂, punta verso di lei. Il campo totale E è la loro somma, con la regola del parallelogramma. Il punto P si trascina, oppure si sposta con i cursori.'
    },
    /* il flusso di un campo uniforme attraverso una superficie piana vista di taglio: Φ = E·S·cos α */
    flusso: {
      tipo: 'piano', x: [-4, 4], y: [-2.75, 2.5], assi: false, griglia: false,
      parametri: [{ nome: 'al', min: 0, max: 180, passo: 5, valore: 40, etichetta: 'α (gradi)' }],
      elementi: [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map(function (y) {
        return { tipo: 'segmento', da: [-3.9, y], a: [3.9, y], colore: 'grigio', freccia: true };
      }).concat([
        { tipo: 'poligono', colore: 3, punti: [
          ['-1.5*sin(al*pi/180) - 0.06*cos(al*pi/180)', '1.5*cos(al*pi/180) - 0.06*sin(al*pi/180)'],
          ['-1.5*sin(al*pi/180) + 0.06*cos(al*pi/180)', '1.5*cos(al*pi/180) + 0.06*sin(al*pi/180)'],
          ['1.5*sin(al*pi/180) + 0.06*cos(al*pi/180)', '-1.5*cos(al*pi/180) + 0.06*sin(al*pi/180)'],
          ['1.5*sin(al*pi/180) - 0.06*cos(al*pi/180)', '-1.5*cos(al*pi/180) - 0.06*sin(al*pi/180)']] },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(al*pi/180)', 'sin(al*pi/180)'], raggio: 0.6, colore: 3, etichetta: 'α' },
        { tipo: 'vettore', da: [0, 0], a: ['1.4*cos(al*pi/180)', '1.4*sin(al*pi/180)'], colore: 3, etichetta: 'n' },
        { tipo: 'testo', p: [0, -2.5], testo: 'Φ = E·S·cos α = {{cos(al*pi/180)|2}}·E·S', colore: 3 }
      ]),
      didascalia: 'Una superficie piana, vista di taglio (la striscia verde), in un campo uniforme: le righe grigie sono le linee del campo. La freccia n è perpendicolare alla superficie; α è l\'angolo fra n e il campo. Di fronte al campo (α = 0°) la superficie raccoglie più linee; parallela (α = 90°) nessuna; girata oltre 90° il flusso è negativo. Il cursore cambia l\'angolo.'
    },
    /* un conduttore neutro in un campo esterno: cariche indotte sulle facce, campo zero dentro, linee perpendicolari */
    conduttore: {
      tipo: 'piano', x: [-4, 4], y: [-1.9, 1.9], assi: false, griglia: false, altezza: 360,
      elementi: [
        { tipo: 'poligono', punti: [[-1.3, -1.4], [1.3, -1.4], [1.3, 1.4], [-1.3, 1.4]], colore: 'grigio' }
      ].concat([-1, -0.5, 0, 0.5, 1].reduce(function (acc, y) {
        return acc.concat([
          { tipo: 'segmento', da: [-3.9, y], a: [-1.35, y], colore: 'grigio', freccia: true },
          { tipo: 'segmento', da: [1.35, y], a: [3.9, y], colore: 'grigio', freccia: true },
          { tipo: 'testo', p: [-1.1, y - 0.08], testo: '−', colore: 1 },
          { tipo: 'testo', p: [1.1, y - 0.08], testo: '+', colore: 4 }
        ]);
      }, []), [
        { tipo: 'testo', p: [0, -0.08], testo: 'E = 0' },
        { tipo: 'testo', p: [-2.75, 1.5], testo: 'campo esterno' }
      ]),
      didascalia: 'Schema di un blocco di metallo neutro in un campo esterno che punta verso destra. Gli elettroni si spostano a sinistra, contro il campo; a destra restano cariche positive. Dentro, il campo delle cariche spostate annulla quello esterno. Fuori, le linee arrivano perpendicolari alle facce del metallo.'
    },
    /* il campo di una sfera conduttrice con Q = 10 nC: zero dentro, k·Q/r² fuori (in 10³ N/C, r in cm) */
    'sfera-carica': {
      tipo: 'piano', x: [0, 30], y: [0, 60], altezza: 400, passo: [5, 10], etichette: { x: 'r (cm)', y: 'E (10³ N/C)' },
      parametri: [{ nome: 'R', min: 5, max: 15, passo: 1, valore: 8, etichetta: 'R (cm)' }],
      funzioni: [
        { f: '0', dominio: [0, 'R'], colore: 'grigio' },
        { f: '899/x^2', dominio: ['R', 24], colore: 'grigio' }
      ],
      elementi: [
        { tipo: 'verticale', x: 'R', colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['R', '899/R^2'], colore: 'grigio' },
        { tipo: 'testo', p: ['R/2', 5], testo: 'E = 0' },
        { tipo: 'testo', p: [29.5, 54], testo: 'sulla superficie: {{899/R^2|1}}·10³ N/C', ancora: 'end' }
      ],
      didascalia: 'Il campo di una sfera di metallo con carica 10 nC, in funzione della distanza r dal centro. Dentro la sfera (a sinistra del tratteggio) il campo è zero. Fuori è quello di una carica puntiforme al centro, e cala come 1/r². Una sfera più piccola, con la stessa carica, ha un campo più forte sulla superficie. Il cursore cambia il raggio.'
    },
    /* Millikan: goccia di massa 4,9·10⁻¹⁵ kg e carica −2e; ferma con E = 1,5·10⁵ N/C. Frecce: 0,085 unità per 10⁴ N/C */
    millikan: {
      tipo: 'piano', x: [-3, 3], y: [-2.65, 2.55], assi: false, griglia: false,
      parametri: [{ nome: 'E', min: 0, max: 25, passo: 0.5, valore: 10, etichetta: 'E (10⁴ N/C)' }],
      elementi: [
        { tipo: 'poligono', punti: [[-2.7, 2], [2.7, 2], [2.7, 2.1], [-2.7, 2.1]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-2.7, -2], [2.7, -2], [2.7, -2.1], [-2.7, -2.1]], colore: 'grigio' },
        { tipo: 'testo', p: [0, 2.28], testo: '+   +   +   +   +   +   +', colore: 4 },
        { tipo: 'testo', p: [0, -2.48], testo: '−   −   −   −   −   −   −', colore: 1 },
        { tipo: 'vettore', da: [-2.1, '0.0425*E'], a: [-2.1, '-0.0425*E'], colore: 'grigio', etichetta: 'E', posizione: 'destra' },
        { tipo: 'vettore', da: [0.2, -0.3], a: [0.2, -1.575], colore: 2, etichetta: 'm·g' },
        { tipo: 'vettore', da: [0.2, -0.3], a: [0.2, '-0.3 + 0.085*E'], colore: 2, etichetta: 'q·E' },
        { tipo: 'punto', p: [0.2, -0.3], raggio: 8, colore: 1 },
        { tipo: 'testo', p: [1.65, 1.5], testo: 'la goccia {{? E < 14.9 | scende | }}{{? E > 15.1 | sale | }}{{? se(E >= 14.9, se(E <= 15.1, 1, 0), 0) | è ferma | }}' }
      ],
      didascalia: 'Una goccia d\'olio di massa 4,9·10⁻¹⁵ kg con due elettroni in più (carica −2e), fra due piatti carichi. Il campo E punta in basso; sulla goccia negativa la forza elettrica q·E punta in alto. Il peso m·g resta sempre lo stesso, la forza elettrica cresce con il campo. Con E = 1,5·10⁵ N/C le due frecce sono uguali: la goccia resta ferma. Il cursore cambia il campo.'
    }
  },
  esempi: [
    {
      titolo: 'Gli elettroni passati dalla lana',
      problema: R`Dopo lo strofinio un panno di lana ha una carica di +4,8 nC. Quanti elettroni ha perso? Che carica ha la bacchetta con cui è stato strofinato, se all'inizio erano tutti e due neutri?`,
      passi: [
        R`Dati: $Q = +4{,}8\,\text{nC} = 4{,}8 \cdot 10^{-9}\,\text{C}$, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$. Cerco il numero $n$ di elettroni e la carica della bacchetta.`,
        R`Il panno è positivo perché ha perso elettroni, ognuno con carica $-e$. La carica che gli manca è $n \cdot e$.`,
        R`Il numero di elettroni: $n = \dfrac{Q}{e} = \dfrac{4{,}8 \cdot 10^{-9}\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} = 3{,}0 \cdot 10^{10}$.`,
        R`La carica si conserva: all'inizio il totale era zero, e resta zero. Gli elettroni sono passati alla bacchetta, che ha carica $-4{,}8\,\text{nC}$.`,
        R`Controllo: trenta miliardi di elettroni pesano appena $3{,}0 \cdot 10^{10} \cdot 9{,}11 \cdot 10^{-31}\,\text{kg} \approx 2{,}7 \cdot 10^{-20}\,\text{kg}$. Per questo la bacchetta carica non pesa di più.`
      ],
      risultato: R`$n = 3{,}0 \cdot 10^{10}$ elettroni; la bacchetta ha carica $-4{,}8\,\text{nC}$.`
    },
    {
      titolo: 'La forza fra due cariche',
      problema: R`Una carica di +3 μC e una di −5 μC sono a 30 cm l'una dall'altra, nell'aria. Con che forza si attirano?`,
      passi: [
        R`Dati: $q_1 = +3\,\mu\text{C}$, $q_2 = -5\,\mu\text{C}$, $r = 30\,\text{cm}$. Cerco il modulo della forza $F$ e se è attrattiva o repulsiva.`,
        R`Unità coerenti con $k$: $q_1 = 3 \cdot 10^{-6}\,\text{C}$, $q_2 = -5 \cdot 10^{-6}\,\text{C}$, $r = 0{,}30\,\text{m}$.`,
        R`Il prodotto delle cariche, senza segno: $3 \cdot 10^{-6} \cdot 5 \cdot 10^{-6} = 1{,}5 \cdot 10^{-11}\,\text{C}^2$. Il quadrato della distanza: $0{,}09\,\text{m}^2$.`,
        R`La legge di Coulomb: $F = \dfrac{8{,}99 \cdot 10^9 \cdot 1{,}5 \cdot 10^{-11}}{0{,}09}\,\text{N} \approx 1{,}5\,\text{N}$.`,
        R`I segni sono opposti: la forza è attrattiva. Con i segni nella formula verrebbe $F \approx -1{,}5\,\text{N}$, e il meno dice proprio «attrazione».`
      ],
      risultato: R`$F \approx 1{,}5\,\text{N}$, attrattiva`
    },
    {
      titolo: 'Due forze ad angolo retto',
      problema: R`Una carica $q = +2\,\mu\text{C}$ sta nell'origine. A 30 cm alla sua sinistra c'è una carica di +6 μC; 20 cm sopra c'è una carica di −4 μC. Quanto vale la forza totale su $q$, e che direzione ha?`,
      passi: [
        R`Dati: $q = 2 \cdot 10^{-6}\,\text{C}$; $q_1 = 6 \cdot 10^{-6}\,\text{C}$ a $r_1 = 0{,}30\,\text{m}$; $q_2 = -4 \cdot 10^{-6}\,\text{C}$ a $r_2 = 0{,}20\,\text{m}$. Cerco il modulo e la direzione della forza totale.`,
        R`Forza di $q_1$: $F_1 = \dfrac{8{,}99 \cdot 10^9 \cdot 6 \cdot 10^{-6} \cdot 2 \cdot 10^{-6}}{0{,}30^2}\,\text{N} \approx 1{,}20\,\text{N}$. Stesso segno: respinge $q$ verso destra, lungo l'asse $x$.`,
        R`Forza di $q_2$: $F_2 = \dfrac{8{,}99 \cdot 10^9 \cdot 4 \cdot 10^{-6} \cdot 2 \cdot 10^{-6}}{0{,}20^2}\,\text{N} \approx 1{,}80\,\text{N}$. Segni opposti: attira $q$ verso l'alto, lungo l'asse $y$.`,
        R`Le due forze sono perpendicolari. Il modulo della somma viene da Pitagora: $F = \sqrt{1{,}20^2 + 1{,}80^2}\,\text{N} \approx 2{,}16\,\text{N}$.`,
        R`La direzione: $\tan\theta = \dfrac{F_y}{F_x} = \dfrac{1{,}80}{1{,}20} = 1{,}5$, quindi $\theta \approx 56°$ sopra l'asse $x$.`,
        R`Controllo: la somma è più lunga di ciascuna forza e più corta della somma dei moduli, $3{,}00\,\text{N}$. Torna.`
      ],
      risultato: R`$F \approx 2{,}2\,\text{N}$, a circa $56°$ sopra l'asse $x$`
    },
    {
      titolo: 'Un elettrone vicino a una carica',
      problema: R`Una carica puntiforme di +2,0 nC è ferma. Quanto vale il campo elettrico a 3,0 cm da lei? Che forza e che accelerazione ha un elettrone messo lì?`,
      passi: [
        R`Dati: $Q = 2{,}0 \cdot 10^{-9}\,\text{C}$, $r = 0{,}030\,\text{m}$, carica dell'elettrone $-e$, massa $m_e = 9{,}11 \cdot 10^{-31}\,\text{kg}$. Cerco il campo $E$, la forza $F$ e l'accelerazione $a$.`,
        R`Il campo della carica puntiforme: $E = \dfrac{8{,}99 \cdot 10^9 \cdot 2{,}0 \cdot 10^{-9}}{0{,}030^2}\,\text{N/C} \approx 2{,}0 \cdot 10^4\,\text{N/C}$, verso l'esterno.`,
        R`La forza sull'elettrone, in modulo: $F = e \cdot E = 1{,}60 \cdot 10^{-19}\,\text{C} \cdot 2{,}0 \cdot 10^4\,\text{N/C} \approx 3{,}2 \cdot 10^{-15}\,\text{N}$. L'elettrone è negativo: la forza punta verso la carica.`,
        R`Il secondo principio: $a = \dfrac{F}{m_e} = \dfrac{3{,}2 \cdot 10^{-15}\,\text{N}}{9{,}11 \cdot 10^{-31}\,\text{kg}} \approx 3{,}5 \cdot 10^{15}\,\text{m/s}^2$.`,
        R`Controllo: la forza è piccolissima, ma la massa dell'elettrone lo è molto di più. Per questo l'accelerazione è enorme. Il peso dell'elettrone, $m_e \cdot g \approx 9 \cdot 10^{-30}\,\text{N}$, non conta niente.`
      ],
      risultato: R`$E \approx 2{,}0 \cdot 10^4\,\text{N/C}$; $F \approx 3{,}2 \cdot 10^{-15}\,\text{N}$; $a \approx 3{,}5 \cdot 10^{15}\,\text{m/s}^2$`
    },
    {
      titolo: 'Il flusso attraverso una scatola',
      problema: R`Dentro una scatola chiusa ci sono tre cariche: +3 nC, −5 nC e +4 nC. Fuori, vicino alla scatola, c'è una carica di +6 nC. Quanto vale il flusso del campo elettrico attraverso le pareti della scatola?`,
      passi: [
        R`Dati: cariche dentro $+3$, $-5$, $+4\,\text{nC}$; carica fuori $+6\,\text{nC}$; $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$. Cerco il flusso $\Phi$.`,
        R`Per il teorema di Gauss conta solo la carica dentro. La carica di fuori fa entrare ed uscire le sue linee: flusso zero.`,
        R`La carica totale dentro: $Q = 3 - 5 + 4 = 2\,\text{nC} = 2 \cdot 10^{-9}\,\text{C}$.`,
        R`Il flusso: $\Phi = \dfrac{Q}{\varepsilon_0} = \dfrac{2 \cdot 10^{-9}}{8{,}85 \cdot 10^{-12}}\,\text{N} \cdot \text{m}^2/\text{C} \approx 226\,\text{N} \cdot \text{m}^2/\text{C}$.`,
        R`Controllo con le unità: $\text{C}$ diviso $\text{C}^2/(\text{N} \cdot \text{m}^2)$ dà $\text{N} \cdot \text{m}^2/\text{C}$, l'unità del flusso. La forma della scatola non è mai entrata nel conto.`
      ],
      risultato: R`$\Phi \approx 226\,\text{N} \cdot \text{m}^2/\text{C}$`
    },
    {
      titolo: 'Una goccia sospesa',
      problema: R`In un apparato di Millikan c'è una goccia d'olio di massa $6{,}53 \cdot 10^{-15}\,\text{kg}$. Resta ferma quando il campo fra i piatti vale $1{,}00 \cdot 10^5\,\text{N/C}$, verso il basso. Che carica ha la goccia? Quanti elettroni ha in più o in meno?`,
      passi: [
        R`Dati: $m = 6{,}53 \cdot 10^{-15}\,\text{kg}$, $E = 1{,}00 \cdot 10^5\,\text{N/C}$ verso il basso, $g = 9{,}8\,\text{m/s}^2$. Cerco la carica $q$ e il numero $n$ di cariche elementari.`,
        R`La goccia è ferma: la forza elettrica pareggia il peso, $|q| \cdot E = m \cdot g$.`,
        R`Il modulo della carica: $|q| = \dfrac{m \cdot g}{E} = \dfrac{6{,}53 \cdot 10^{-15} \cdot 9{,}8}{1{,}00 \cdot 10^5}\,\text{C} \approx 6{,}4 \cdot 10^{-19}\,\text{C}$.`,
        R`Il segno: il peso tira giù, quindi la forza elettrica spinge su, contro il campo. La carica è negativa: $q \approx -6{,}4 \cdot 10^{-19}\,\text{C}$.`,
        R`In cariche elementari: $n = \dfrac{6{,}4 \cdot 10^{-19}}{1{,}60 \cdot 10^{-19}} \approx 4{,}0$. Un numero intero, come deve essere: quattro elettroni in più.`
      ],
      risultato: R`$q \approx -6{,}4 \cdot 10^{-19}\,\text{C} = -4 \cdot e$: quattro elettroni in più`
    }
  ],
  formulario: [
    { nome: 'Carica quantizzata', formula: R`q = n \cdot e \qquad e = 1{,}60 \cdot 10^{-19}\,\text{C}`, nota: R`$n$ intero. L'elettrone ha carica $-e$, il protone $+e$.` },
    { nome: 'Legge di Coulomb', formula: R`F = \dfrac{k \cdot q_1 \cdot q_2}{r^2}`, nota: R`Lungo la retta che unisce le cariche. Stesso segno: repulsione; segni opposti: attrazione.` },
    { nome: 'Costante di Coulomb', formula: R`k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2`, nota: R`Nel vuoto, e quasi uguale nell'aria. Si scrive anche $k = 1/(4\pi \cdot \varepsilon_0)$.` },
    { nome: 'Costante dielettrica del vuoto', formula: R`\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)`, nota: R`In un isolante la forza fra due cariche si divide per $\varepsilon_r$ (acqua: circa 80).` },
    { nome: 'Principio di sovrapposizione', formula: R`\vec{F} = \vec{F}_1 + \vec{F}_2 + \dots`, nota: R`Somma di vettori: si sommano le componenti. Vale anche per i campi.` },
    { nome: 'Campo elettrico', formula: R`\vec{E} = \dfrac{\vec{F}}{q} \qquad \vec{F} = q \cdot \vec{E}`, nota: R`In N/C. Su una carica negativa la forza è opposta al campo.` },
    { nome: 'Campo di una carica puntiforme', formula: R`E = \dfrac{k \cdot Q}{r^2}`, nota: R`In fuori se $Q > 0$, verso la carica se $Q < 0$. Vale anche fuori da una sfera carica.` },
    { nome: 'Flusso attraverso una superficie piana', formula: R`\Phi = E \cdot S \cdot \cos\alpha`, nota: R`Campo uniforme; $\alpha$ fra il campo e la perpendicolare. In $\text{N} \cdot \text{m}^2/\text{C}$.` },
    { nome: 'Teorema di Gauss', formula: R`\Phi = \dfrac{Q}{\varepsilon_0}`, nota: R`Per ogni superficie chiusa; $Q$ è la carica totale dentro.` },
    { nome: 'Una lastra; due lastre opposte', formula: R`E = \dfrac{\sigma}{2 \cdot \varepsilon_0} \qquad E = \dfrac{\sigma}{\varepsilon_0}`, nota: R`$\sigma$ in C/m². Campo uniforme; fra due lastre opposte i campi si sommano.` },
    { nome: 'Filo carico', formula: R`E = \dfrac{\lambda}{2\pi \cdot \varepsilon_0 \cdot r}`, nota: R`$\lambda$ carica per metro, in C/m; $r$ distanza dal filo. Campo radiale, cala come $1/r$.` },
    { nome: 'Conduttore in equilibrio', formula: R`E_\text{dentro} = 0 \qquad E = \dfrac{\sigma}{\varepsilon_0}`, nota: R`La seconda è il campo appena fuori dalla superficie, perpendicolare a essa.` },
    { nome: 'Goccia ferma (Millikan)', formula: R`|q| \cdot E = m \cdot g`, nota: R`Forza elettrica uguale al peso: $|q| = m \cdot g / E$.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'carica', tipo: 'definizione', fronte: R`Che cos'è la **carica elementare**, e quanto vale?`, retro: R`La carica del protone, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$. L'elettrone ha carica $-e$.` },
    { id: 'fc-02', sezione: 'carica', tipo: 'concetto', fronte: R`Quando un corpo è **neutro**?`, retro: R`Quando ha tanti elettroni quanti protoni: la carica totale è zero, anche se dentro ci sono moltissime cariche.` },
    { id: 'fc-03', sezione: 'carica', tipo: 'definizione', fronte: R`Che cosa dice la **conservazione della carica**?`, retro: R`La carica non si crea e non si distrugge: in un sistema isolato la carica totale resta la stessa.` },
    { id: 'fc-04', sezione: 'carica', tipo: 'concetto', fronte: R`Un corpo diventa positivo. Che cosa è successo?`, retro: R`Ha perso elettroni. I protoni restano nei nuclei: non si spostano mai da un corpo all'altro.` },
    { id: 'fc-05', sezione: 'elettrizzazione', tipo: 'definizione', fronte: R`Che differenza c'è fra un **conduttore** e un **isolante**?`, retro: R`Nel conduttore alcuni elettroni si muovono liberi in tutto il corpo; nell'isolante restano legati ai loro atomi.` },
    { id: 'fc-06', sezione: 'elettrizzazione', tipo: 'procedura', fronte: R`I tre modi di elettrizzare un corpo`, retro: R`Strofinio (si scambiano elettroni), contatto (si cede carica dello stesso segno), induzione elettrostatica (si separano le cariche senza toccare).` },
    { id: 'fc-07', sezione: 'elettrizzazione', tipo: 'concetto', fronte: R`Perché un corpo carico attira un conduttore **neutro**?`, retro: R`Per induzione elettrostatica le cariche opposte del conduttore vanno dalla parte vicina. Sono più vicine, quindi l'attrazione vince sulla repulsione.` },
    { id: 'fc-08', sezione: 'elettrizzazione', tipo: 'concetto', fronte: R`Perché una penna strofinata attira la carta, che è isolante?`, retro: R`Le molecole della carta si **polarizzano**: le loro cariche si spostano un poco, e l'attrazione sulle più vicine vince.` },
    { id: 'fc-09', sezione: 'coulomb', tipo: 'formula', fronte: R`La **legge di Coulomb**`, retro: R`$F = \dfrac{k \cdot q_1 \cdot q_2}{r^2}$, lungo la retta che unisce le cariche. Qui $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$.` },
    { id: 'fc-10', sezione: 'coulomb', tipo: 'concetto', fronte: R`Che cos'è $\varepsilon_0$ e che legame ha con $k$?`, retro: R`La costante dielettrica del vuoto, $8{,}85 \cdot 10^{-12}\,\text{C}^2/(\text{N} \cdot \text{m}^2)$. Vale $k = \dfrac{1}{4\pi \cdot \varepsilon_0}$.` },
    { id: 'fc-11', sezione: 'coulomb', tipo: 'concetto', fronte: R`Se la distanza fra due cariche triplica, che cosa succede alla forza?`, retro: R`Diventa un nono: la forza va con l'inverso del quadrato della distanza.` },
    { id: 'fc-12', sezione: 'coulomb', tipo: 'concetto', fronte: R`Quanto è più forte la forza elettrica della gravità, fra elettrone e protone?`, retro: R`Circa $2{,}3 \cdot 10^{39}$ volte, a qualunque distanza: tutte e due vanno come $1/r^2$.` },
    { id: 'fc-13', sezione: 'sovrapposizione', tipo: 'definizione', fronte: R`Che cosa dice il **principio di sovrapposizione**?`, retro: R`La forza totale su una carica è la somma vettoriale delle forze delle altre cariche. Ognuna si calcola come se fosse sola.` },
    { id: 'fc-14', sezione: 'campo', tipo: 'definizione', fronte: R`Che cos'è il **campo elettrico** in un punto?`, retro: R`La forza su ogni coulomb di una carica di prova positiva: $\vec{E} = \vec{F}/q$, in N/C. Non dipende dalla carica di prova.` },
    { id: 'fc-15', sezione: 'campo', tipo: 'formula', fronte: R`Il campo di una **carica puntiforme** $Q$`, retro: R`$E = \dfrac{k \cdot Q}{r^2}$: in fuori se $Q$ è positiva, verso la carica se è negativa.` },
    { id: 'fc-16', sezione: 'campo', tipo: 'concetto', fronte: R`Che verso ha la forza su una carica negativa, in un campo elettrico?`, retro: R`Opposto al campo: $\vec{F} = q \cdot \vec{E}$ con $q < 0$.` },
    { id: 'fc-17', sezione: 'linee', tipo: 'definizione', fronte: R`Le proprietà delle **linee di campo**`, retro: R`Sono tangenti al campo, escono dalle cariche positive ed entrano nelle negative, non si incrociano; dove sono fitte il campo è intenso.` },
    { id: 'fc-18', sezione: 'linee', tipo: 'definizione', fronte: R`Che cos'è un **dipolo elettrico**?`, retro: R`Una coppia di cariche uguali e opposte, $+q$ e $-q$, vicine. Le linee vanno dalla positiva alla negativa.` },
    { id: 'fc-19', sezione: 'gauss', tipo: 'formula', fronte: R`Il **flusso** di un campo uniforme attraverso una superficie piana`, retro: R`$\Phi = E \cdot S \cdot \cos\alpha$, con $\alpha$ angolo fra il campo e la perpendicolare alla superficie. In $\text{N} \cdot \text{m}^2/\text{C}$.` },
    { id: 'fc-20', sezione: 'gauss', tipo: 'formula', fronte: R`Il **teorema di Gauss**`, retro: R`Il flusso del campo attraverso una superficie chiusa è $\Phi = Q/\varepsilon_0$, con $Q$ la carica totale dentro. Le cariche fuori non contano.` },
    { id: 'fc-21', sezione: 'conduttori', tipo: 'concetto', fronte: R`Le tre proprietà di un **conduttore in equilibrio**`, retro: R`Dentro il campo è zero; la carica in eccesso sta sulla superficie; appena fuori il campo è perpendicolare alla superficie.` },
    { id: 'fc-22', sezione: 'conduttori', tipo: 'definizione', fronte: R`Che cos'è una **gabbia di Faraday**?`, retro: R`Un involucro di metallo chiuso: dentro, il campo delle cariche esterne è zero. La carrozzeria di un'auto ne è un esempio.` },
    { id: 'fc-23', sezione: 'conduttori', tipo: 'concetto', fronte: R`Che cos'è il **potere delle punte**?`, retro: R`Sulle punte di un conduttore la carica si addensa e il campo diventa fortissimo: l'aria può diventare conduttrice e scaricarlo.` },
    { id: 'fc-24', sezione: 'millikan', tipo: 'procedura', fronte: R`Come si ricava la carica di una goccia nell'esperimento di **Millikan**?`, retro: R`Si regola il campo finché la goccia resta ferma: allora $|q| \cdot E = m \cdot g$, e $|q| = m \cdot g / E$.` },
    { id: 'fc-25', sezione: 'millikan', tipo: 'concetto', fronte: R`Che cosa vuol dire che la carica è **quantizzata**?`, retro: R`Che ogni carica libera è un multiplo intero della carica elementare: $q = n \cdot e$.` },
    { id: 'fc-26', sezione: 'gauss', tipo: 'formula', fronte: R`Il campo di un **filo carico** lungo, con carica uniforme`, retro: R`$E = \dfrac{\lambda}{2\pi \cdot \varepsilon_0 \cdot r}$, con $\lambda$ carica per metro. Si trova con Gauss su un cilindro attorno al filo: cala come $1/r$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Una goccia d'olio ha carica $-3{,}2 \cdot 10^{-18}\,\text{C}$. Quanti elettroni ha in più?`, suggerimenti: [R`Ogni elettrone porta $-e$, con $e = 1{,}60 \cdot 10^{-19}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 20 }, soluzione: [R`$n = \dfrac{3{,}2 \cdot 10^{-18}\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} = 20$ elettroni in più.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Una sferetta neutra perde $2{,}5 \cdot 10^{12}$ elettroni. Che carica ha ora, in microcoulomb?`, suggerimenti: [R`La carica è $n \cdot e$, positiva perché mancano elettroni.`, R`$1\,\mu\text{C} = 10^{-6}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 0.4, unita: 'μC' }, soluzione: [R`$q = n \cdot e = 2{,}5 \cdot 10^{12} \cdot 1{,}60 \cdot 10^{-19}\,\text{C} = 4 \cdot 10^{-7}\,\text{C}$.`, R`In microcoulomb: $q = +0{,}4\,\mu\text{C}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Due sfere di metallo uguali hanno cariche di +8 μC e −2 μC. Si mettono a contatto e poi si separano. Che carica ha ciascuna?`, suggerimenti: [R`La carica totale si conserva.`, R`Due sfere uguali si dividono la carica totale a metà.`], risposta: { tipo: 'numero', valore: 3, unita: 'μC' }, soluzione: [R`Carica totale: 8 − 2 = 6 μC, che si conserva.`, R`Le sfere sono uguali: ognuna prende metà, +3 μC.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Due cariche di +1 μC ciascuna sono a 15 cm l'una dall'altra. Con che forza si respingono?`, suggerimenti: [R`Porta le cariche in coulomb e la distanza in metri.`, R`$F = \dfrac{k \cdot q_1 \cdot q_2}{r^2}$, con $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$.`], risposta: { tipo: 'numero', valore: 0.3996, unita: 'N' }, soluzione: [R`$F = \dfrac{8{,}99 \cdot 10^9 \cdot 10^{-6} \cdot 10^{-6}}{0{,}15^2}\,\text{N} = \dfrac{8{,}99 \cdot 10^{-3}}{0{,}0225}\,\text{N} \approx 0{,}4\,\text{N}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Due cariche si respingono con una forza di 18 N. Quanto vale la forza se la distanza diventa tripla?`, suggerimenti: [R`La forza va con l'inverso del quadrato della distanza.`], risposta: { tipo: 'numero', valore: 2, unita: 'N' }, soluzione: [R`Distanza tripla: forza divisa per $3^2 = 9$. $F = \dfrac{18\,\text{N}}{9} = 2\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Due cariche si attraggono con una forza di 5 N. Si raddoppiano tutte e due le cariche, senza cambiare la distanza. Quanto vale ora la forza?`, suggerimenti: [R`La forza è proporzionale a ciascuna carica.`], risposta: { tipo: 'numero', valore: 20, unita: 'N' }, soluzione: [R`Ogni carica doppia moltiplica la forza per 2: in tutto per $2 \cdot 2 = 4$. $F = 4 \cdot 5\,\text{N} = 20\,\text{N}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Una carica di +2 μC e una di −3 μC sono a 60 cm di distanza. Quanto vale il modulo della forza fra loro?`, suggerimenti: [R`Calcola il modulo senza segni; i segni dicono solo che si attraggono.`], risposta: { tipo: 'numero', valore: 0.15, unita: 'N' }, soluzione: [R`$F = \dfrac{8{,}99 \cdot 10^9 \cdot 2 \cdot 10^{-6} \cdot 3 \cdot 10^{-6}}{0{,}60^2}\,\text{N} = \dfrac{0{,}0539}{0{,}36}\,\text{N} \approx 0{,}15\,\text{N}$, attrattiva.`] },
    { id: 'b-08', livello: 'base', difficolta: 2, testo: R`Due cariche uguali di 4 μC si respingono con una forza di 3,6 N. A che distanza si trovano?`, suggerimenti: [R`Ricava $r$ dalla legge di Coulomb: $r^2 = \dfrac{k \cdot q_1 \cdot q_2}{F}$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'm' }, soluzione: [R`$r^2 = \dfrac{8{,}99 \cdot 10^9 \cdot (4 \cdot 10^{-6})^2}{3{,}6}\,\text{m}^2 = \dfrac{0{,}144}{3{,}6}\,\text{m}^2 \approx 0{,}040\,\text{m}^2$.`, R`$r = \sqrt{0{,}040}\,\text{m} = 0{,}20\,\text{m}$, cioè 20 cm.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`In un punto una carica di prova di 5 nC sente una forza di $1{,}5 \cdot 10^{-5}\,\text{N}$. Quanto vale il campo elettrico in quel punto?`, suggerimenti: [R`Il campo è la forza diviso la carica di prova.`], risposta: { tipo: 'numero', valore: 3000, unita: 'N/C' }, soluzione: [R`$E = \dfrac{F}{q} = \dfrac{1{,}5 \cdot 10^{-5}\,\text{N}}{5 \cdot 10^{-9}\,\text{C}} = 3 \cdot 10^3\,\text{N/C}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`In un campo elettrico di 5000 N/C si mette una carica di −4 μC. Quanto vale il modulo della forza che sente?`, suggerimenti: [R`$F = |q| \cdot E$. Il segno dice solo che la forza è opposta al campo.`], risposta: { tipo: 'numero', valore: 0.02, unita: 'N' }, soluzione: [R`$F = 4 \cdot 10^{-6}\,\text{C} \cdot 5000\,\text{N/C} = 0{,}02\,\text{N}$, con verso opposto al campo.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Quanto vale il campo elettrico a 90 cm da una carica puntiforme di 9 nC?`, suggerimenti: [R`$E = \dfrac{k \cdot Q}{r^2}$, con la carica in coulomb e la distanza in metri.`], risposta: { tipo: 'numero', valore: 99.9, unita: 'N/C' }, soluzione: [R`$E = \dfrac{8{,}99 \cdot 10^9 \cdot 9 \cdot 10^{-9}}{0{,}90^2}\,\text{N/C} = \dfrac{80{,}91}{0{,}81}\,\text{N/C} \approx 100\,\text{N/C}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`A 10 cm da una carica puntiforme il campo vale 800 N/C. Quanto vale a 40 cm?`, suggerimenti: [R`Il campo va con l'inverso del quadrato della distanza.`], risposta: { tipo: 'numero', valore: 50, unita: 'N/C' }, soluzione: [R`Distanza quattro volte più grande: campo diviso per $4^2 = 16$. $E = \dfrac{800}{16}\,\text{N/C} = 50\,\text{N/C}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`A 2 m da una carica puntiforme il campo vale $4{,}5 \cdot 10^4\,\text{N/C}$. Quanto vale la carica, in microcoulomb?`, suggerimenti: [R`Ricava $Q$ da $E = \dfrac{k \cdot Q}{r^2}$: $Q = \dfrac{E \cdot r^2}{k}$.`], risposta: { tipo: 'numero', valore: 20, unita: 'μC' }, soluzione: [R`$Q = \dfrac{4{,}5 \cdot 10^4 \cdot 2^2}{8{,}99 \cdot 10^9}\,\text{C} \approx 2{,}0 \cdot 10^{-5}\,\text{C}$, cioè 20 μC.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Una sfera di metallo di raggio 15 cm ha una carica di 5 nC. Quanto vale il campo appena fuori dalla sua superficie?`, suggerimenti: [R`Fuori dalla sfera il campo è quello di una carica puntiforme al centro.`, R`La distanza dal centro è il raggio.`], risposta: { tipo: 'numero', valore: 1998, unita: 'N/C' }, soluzione: [R`$E = \dfrac{k \cdot Q}{R^2} = \dfrac{8{,}99 \cdot 10^9 \cdot 5 \cdot 10^{-9}}{0{,}15^2}\,\text{N/C} = \dfrac{44{,}95}{0{,}0225}\,\text{N/C} \approx 2{,}0 \cdot 10^3\,\text{N/C}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Due grandi lastre parallele hanno cariche opposte, con densità superficiale $\sigma = 4{,}43 \cdot 10^{-8}\,\text{C/m}^2$. Quanto vale il campo fra le lastre?`, suggerimenti: [R`Fra due lastre opposte $E = \dfrac{\sigma}{\varepsilon_0}$.`], risposta: { tipo: 'numero', valore: 5006, unita: 'N/C' }, soluzione: [R`$E = \dfrac{4{,}43 \cdot 10^{-8}}{8{,}85 \cdot 10^{-12}}\,\text{N/C} \approx 5{,}0 \cdot 10^3\,\text{N/C}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Dentro una superficie chiusa ci sono una carica di +7 nC e una di −3 nC. Quanto vale il flusso del campo elettrico attraverso la superficie?`, suggerimenti: [R`Teorema di Gauss: $\Phi = \dfrac{Q}{\varepsilon_0}$, con $Q$ la carica totale dentro.`], risposta: { tipo: 'numero', valore: 452, unita: 'N·m²/C' }, soluzione: [R`$Q = 7 - 3 = 4\,\text{nC} = 4 \cdot 10^{-9}\,\text{C}$.`, R`$\Phi = \dfrac{4 \cdot 10^{-9}}{8{,}85 \cdot 10^{-12}}\,\text{N} \cdot \text{m}^2/\text{C} \approx 452\,\text{N} \cdot \text{m}^2/\text{C}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Un campo uniforme di 300 N/C attraversa una superficie piana di $0{,}4\,\text{m}^2$. La perpendicolare alla superficie forma un angolo di 30° con il campo. Quanto vale il flusso?`, suggerimenti: [R`$\Phi = E \cdot S \cdot \cos\alpha$, e $\cos 30° \approx 0{,}866$.`], risposta: { tipo: 'numero', valore: 104, unita: 'N·m²/C' }, soluzione: [R`$\Phi = 300 \cdot 0{,}4 \cdot 0{,}866\,\text{N} \cdot \text{m}^2/\text{C} \approx 104\,\text{N} \cdot \text{m}^2/\text{C}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Il flusso del campo elettrico attraverso una superficie chiusa vale $1130\,\text{N} \cdot \text{m}^2/\text{C}$. Quanta carica c'è dentro, in nanocoulomb?`, suggerimenti: [R`Dal teorema di Gauss: $Q = \Phi \cdot \varepsilon_0$.`], risposta: { tipo: 'numero', valore: 10, unita: 'nC' }, soluzione: [R`$Q = 1130 \cdot 8{,}85 \cdot 10^{-12}\,\text{C} \approx 1{,}0 \cdot 10^{-8}\,\text{C} = 10\,\text{nC}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 2, testo: R`Una goccia d'olio con tre elettroni in più resta ferma fra i piatti, con un campo di $4{,}9 \cdot 10^4\,\text{N/C}$. Che massa ha la goccia?`, suggerimenti: [R`Goccia ferma: $|q| \cdot E = m \cdot g$.`, R`La carica è $3 \cdot e = 4{,}8 \cdot 10^{-19}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 2.4e-15, unita: 'kg' }, soluzione: [R`$m = \dfrac{|q| \cdot E}{g} = \dfrac{4{,}8 \cdot 10^{-19} \cdot 4{,}9 \cdot 10^4}{9{,}8}\,\text{kg} = 2{,}4 \cdot 10^{-15}\,\text{kg}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Millikan misura su una goccia una carica di $8{,}0 \cdot 10^{-19}\,\text{C}$ (in modulo). A quante cariche elementari corrisponde?`, suggerimenti: [R`Dividi per $e = 1{,}60 \cdot 10^{-19}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 5 }, soluzione: [R`$n = \dfrac{8{,}0 \cdot 10^{-19}}{1{,}60 \cdot 10^{-19}} = 5$.`] },
    { id: 'b-21', livello: 'base', difficolta: 2, testo: R`Un filo rettilineo molto lungo porta una carica di 2 nC su ogni metro. Quanto vale il campo elettrico a 3 cm dal filo?`, suggerimenti: [R`$E = \dfrac{\lambda}{2\pi \cdot \varepsilon_0 \cdot r}$, con $r$ in metri.`, R`Oppure $E = \dfrac{2 \cdot k \cdot \lambda}{r}$, perché $\dfrac{1}{2\pi \cdot \varepsilon_0} = 2 \cdot k$.`], risposta: { tipo: 'numero', valore: 1200, unita: 'N/C' }, soluzione: [R`Dati: $\lambda = 2 \cdot 10^{-9}\,\text{C/m}$, $r = 0{,}03\,\text{m}$. Cerco $E$.`, R`$E = \dfrac{2 \cdot 10^{-9}}{2\pi \cdot 8{,}85 \cdot 10^{-12} \cdot 0{,}03}\,\text{N/C} \approx 1{,}2 \cdot 10^3\,\text{N/C}$.`, R`Controllo: $\dfrac{2 \cdot k \cdot \lambda}{r} = \dfrac{2 \cdot 8{,}99 \cdot 10^9 \cdot 2 \cdot 10^{-9}}{0{,}03}\,\text{N/C} \approx 1200\,\text{N/C}$.`] },

    /* ---- esercizi avanzati ---- */
    { id: 'es-01', difficolta: 2, testo: R`Due protoni si respingono per la forza elettrica e si attraggono per la gravità. Quante volte la prima è più forte della seconda? (Massa del protone $1{,}67 \cdot 10^{-27}\,\text{kg}$, $G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$.)`, suggerimenti: [R`Fai il rapporto fra le due leggi: la distanza si semplifica.`, R`$\dfrac{F_e}{F_g} = \dfrac{k \cdot e^2}{G \cdot m_p^2}$.`], risposta: { tipo: 'numero', valore: 1.24e36, tolleranza: 0.05e36 }, soluzione: [R`$k \cdot e^2 = 8{,}99 \cdot 10^9 \cdot (1{,}60 \cdot 10^{-19})^2 \approx 2{,}30 \cdot 10^{-28}\,\text{N} \cdot \text{m}^2$.`, R`$G \cdot m_p^2 = 6{,}67 \cdot 10^{-11} \cdot (1{,}67 \cdot 10^{-27})^2 \approx 1{,}86 \cdot 10^{-64}\,\text{N} \cdot \text{m}^2$.`, R`Rapporto: circa $1{,}24 \cdot 10^{36}$, a qualunque distanza. Meno che fra elettrone e protone, perché il protone ha più massa.`] },
    { id: 'es-02', difficolta: 2, testo: R`Una carica di +9 μC e una di +4 μC sono a 1,0 m di distanza. Dove bisogna mettere una terza carica, sulla retta fra le due, perché la forza totale su di essa sia zero? Dai la distanza dalla carica di 9 μC.`, suggerimenti: [R`Fra le due cariche le due forze hanno versi opposti: devono avere lo stesso modulo.`, R`Chiama $x$ la distanza dalla carica di 9 μC: $\dfrac{9}{x^2} = \dfrac{4}{(1 - x)^2}$.`, R`Fai la radice dei due membri: $\dfrac{3}{x} = \dfrac{2}{1 - x}$.`], risposta: { tipo: 'numero', valore: 0.6, unita: 'm' }, soluzione: [R`La terza carica $q$ si semplifica, e anche $k$: resta $\dfrac{9}{x^2} = \dfrac{4}{(1 - x)^2}$, con $x$ in metri.`, R`Radice dei due membri: $\dfrac{3}{x} = \dfrac{2}{1 - x}$, quindi $3 - 3 \cdot x = 2 \cdot x$ e $x = 0{,}6\,\text{m}$.`, R`Il punto è più vicino alla carica più piccola, come ci si aspetta. Il risultato non dipende dal segno della terza carica.`] },
    { id: 'es-03', difficolta: 2, testo: R`Tre cariche uguali di +2 μC stanno ai vertici di un triangolo equilatero di lato 10 cm. Quanto vale la forza totale su una di esse?`, suggerimenti: [R`Le due forze hanno lo stesso modulo e formano un angolo di 60°.`, R`Somma le componenti: quelle lungo la bisettrice si sommano, le altre si annullano. Ognuna vale $F \cdot \cos 30°$.`], risposta: { tipo: 'numero', valore: 6.23, unita: 'N' }, soluzione: [R`Ogni forza: $F = \dfrac{8{,}99 \cdot 10^9 \cdot (2 \cdot 10^{-6})^2}{0{,}10^2}\,\text{N} \approx 3{,}60\,\text{N}$.`, R`Le componenti perpendicolari alla bisettrice si annullano; quelle lungo la bisettrice valgono $F \cdot \cos 30°$ ciascuna.`, R`$F_\text{tot} = 2 \cdot 3{,}60 \cdot \cos 30°\,\text{N} \approx 6{,}23\,\text{N}$, lungo la bisettrice, verso l'esterno del triangolo.`] },
    { id: 'es-04', difficolta: 3, testo: R`Due palline uguali di 0,90 g, con la stessa carica, sono appese allo stesso punto con due fili. In equilibrio distano 6,0 cm, e ogni filo forma un angolo di 10° con la verticale. Quanto vale la carica di ciascuna pallina, in nanocoulomb?`, suggerimenti: [R`Su ogni pallina agiscono il peso, la tensione del filo e la forza elettrica, orizzontale.`, R`Dall'equilibrio: $F = m \cdot g \cdot \tan 10°$.`, R`Poi $F = \dfrac{k \cdot q^2}{r^2}$, con $r = 0{,}060\,\text{m}$.`], risposta: { tipo: 'numero', valore: 25, unita: 'nC', tolleranza: 0.5 }, soluzione: [R`Equilibrio: la componente orizzontale della tensione pareggia la forza elettrica, quella verticale il peso. Quindi $F = m \cdot g \cdot \tan 10°$.`, R`$F = 9{,}0 \cdot 10^{-4} \cdot 9{,}8 \cdot 0{,}176\,\text{N} \approx 1{,}56 \cdot 10^{-3}\,\text{N}$.`, R`$q = r \cdot \sqrt{\dfrac{F}{k}} = 0{,}060 \cdot \sqrt{\dfrac{1{,}56 \cdot 10^{-3}}{8{,}99 \cdot 10^9}}\,\text{C} \approx 2{,}5 \cdot 10^{-8}\,\text{C} = 25\,\text{nC}$.`] },
    { id: 'es-05', difficolta: 2, testo: R`Un dipolo ha cariche di +4 nC e −4 nC, a 8 cm l'una dall'altra. Un punto sta sulla retta perpendicolare al dipolo, passante per il centro, a 3 cm dal centro. Quanto vale lì il campo?`, suggerimenti: [R`La distanza del punto da ciascuna carica è l'ipotenusa di un triangolo con cateti 4 cm e 3 cm.`, R`Le componenti perpendicolari al dipolo si annullano. Quelle parallele valgono $E_1 \cdot \dfrac{4}{5}$ ciascuna.`], risposta: { tipo: 'numero', valore: 23014, unita: 'N/C' }, soluzione: [R`Distanza da ciascuna carica: $r = \sqrt{4^2 + 3^2}\,\text{cm} = 5\,\text{cm}$.`, R`$E_1 = \dfrac{8{,}99 \cdot 10^9 \cdot 4 \cdot 10^{-9}}{0{,}05^2}\,\text{N/C} \approx 1{,}44 \cdot 10^4\,\text{N/C}$.`, R`$E = 2 \cdot E_1 \cdot \dfrac{4}{5} \approx 2{,}3 \cdot 10^4\,\text{N/C}$, parallelo al dipolo, dalla carica positiva verso la negativa.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una carica di +16 nC e una di −1 nC sono a 30 cm di distanza. In che punto della retta che le unisce il campo totale è zero? Dai la distanza dalla carica negativa.`, suggerimenti: [R`Fra le due cariche i due campi hanno lo stesso verso: lì non si annullano.`, R`Il punto è fuori, dalla parte della carica più piccola. Chiama $x$ la sua distanza dalla carica negativa.`, R`$\dfrac{16}{(0{,}30 + x)^2} = \dfrac{1}{x^2}$: fai la radice.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'm' }, soluzione: [R`Fra le cariche il campo della positiva e quello della negativa puntano tutti e due verso la negativa: non si annullano. Oltre la carica grande vince sempre lei. Resta la parte oltre la carica piccola.`, R`Lì i moduli devono essere uguali: $\dfrac{16}{(0{,}30 + x)^2} = \dfrac{1}{x^2}$.`, R`Radice: $\dfrac{4}{0{,}30 + x} = \dfrac{1}{x}$, quindi $4 \cdot x = 0{,}30 + x$ e $x = 0{,}10\,\text{m}$: 10 cm oltre la carica negativa.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un elettrone parte da fermo in un campo uniforme di $1{,}0 \cdot 10^3\,\text{N/C}$. Che velocità ha dopo aver percorso 1,0 cm? (Massa dell'elettrone $9{,}11 \cdot 10^{-31}\,\text{kg}$.)`, suggerimenti: [R`Prima l'accelerazione: $a = \dfrac{e \cdot E}{m_e}$, costante.`, R`Poi il moto uniformemente accelerato senza il tempo: $v^2 = 2 \cdot a \cdot \Delta s$.`], risposta: { tipo: 'numero', valore: 1.87e6, unita: 'm/s', tolleranza: 40000 }, soluzione: [R`$a = \dfrac{1{,}60 \cdot 10^{-19} \cdot 1{,}0 \cdot 10^3}{9{,}11 \cdot 10^{-31}}\,\text{m/s}^2 \approx 1{,}76 \cdot 10^{14}\,\text{m/s}^2$, nel verso opposto al campo.`, R`$v = \sqrt{2 \cdot 1{,}76 \cdot 10^{14} \cdot 0{,}010}\,\text{m/s} \approx 1{,}9 \cdot 10^6\,\text{m/s}$.`, R`Il peso dell'elettrone, circa $9 \cdot 10^{-30}\,\text{N}$, è trascurabile rispetto alla forza elettrica, $1{,}6 \cdot 10^{-16}\,\text{N}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Una sfera di metallo cava, di raggio 20 cm, ha una carica di 6 μC. Quanto vale il campo a 10 cm dal centro? E a 40 cm dal centro? Scrivi il secondo valore.`, suggerimenti: [R`Dentro un conduttore in equilibrio, e nella cavità senza cariche, il campo è zero.`, R`Fuori, la sfera si comporta come una carica puntiforme al centro.`], risposta: { tipo: 'numero', valore: 337125, unita: 'N/C' }, soluzione: [R`A 10 cm siamo dentro la sfera: il campo è zero. Per Gauss, una sfera di raggio 10 cm non contiene carica.`, R`A 40 cm: $E = \dfrac{8{,}99 \cdot 10^9 \cdot 6 \cdot 10^{-6}}{0{,}40^2}\,\text{N/C} \approx 3{,}4 \cdot 10^5\,\text{N/C}$.`] },
    { id: 'es-09', difficolta: 2, testo: R`Una sfera di metallo deve tenere una carica di 2 μC nell'aria, che si scarica sopra $3 \cdot 10^6\,\text{N/C}$. Quanto deve essere grande almeno il suo raggio, in centimetri?`, suggerimenti: [R`Il campo più forte è sulla superficie: $E = \dfrac{k \cdot Q}{R^2}$.`, R`Deve restare sotto il limite: $R^2 \ge \dfrac{k \cdot Q}{E_\text{max}}$.`], risposta: { tipo: 'numero', valore: 7.74, unita: 'cm', tolleranza: 0.1 }, soluzione: [R`$R^2 = \dfrac{8{,}99 \cdot 10^9 \cdot 2 \cdot 10^{-6}}{3 \cdot 10^6}\,\text{m}^2 \approx 6{,}0 \cdot 10^{-3}\,\text{m}^2$.`, R`$R \approx 0{,}077\,\text{m}$: almeno 7,7 cm. Con una sfera più piccola il campo sulla superficie supera il limite e l'aria la scarica.`] },
    { id: 'es-10', difficolta: 3, testo: R`Una goccia d'olio ha raggio 1,2 μm e densità $900\,\text{kg/m}^3$. Resta ferma fra i piatti con un campo di $2{,}00 \cdot 10^5\,\text{N/C}$. Quante cariche elementari porta?`, suggerimenti: [R`La massa è densità per volume, con il volume della sfera $\frac{4}{3}\pi \cdot r^3$.`, R`Goccia ferma: $|q| = \dfrac{m \cdot g}{E}$.`], risposta: { tipo: 'numero', valore: 2 }, soluzione: [R`Volume: $\frac{4}{3}\pi \cdot (1{,}2 \cdot 10^{-6})^3\,\text{m}^3 \approx 7{,}24 \cdot 10^{-18}\,\text{m}^3$. Massa: $900 \cdot 7{,}24 \cdot 10^{-18}\,\text{kg} \approx 6{,}51 \cdot 10^{-15}\,\text{kg}$.`, R`$|q| = \dfrac{6{,}51 \cdot 10^{-15} \cdot 9{,}8}{2{,}00 \cdot 10^5}\,\text{C} \approx 3{,}2 \cdot 10^{-19}\,\text{C}$.`, R`$n = \dfrac{3{,}2 \cdot 10^{-19}}{1{,}60 \cdot 10^{-19}} \approx 2$ cariche elementari.`] },
    { id: 'es-11', difficolta: 3, testo: R`In un modello semplice dell'atomo di idrogeno, l'elettrone gira attorno al protone su un cerchio. Se il raggio dell'orbita è $2{,}12 \cdot 10^{-10}\,\text{m}$, a che velocità gira?`, suggerimenti: [R`La forza di Coulomb fa da forza centripeta: $\dfrac{k \cdot e^2}{r^2} = \dfrac{m_e \cdot v^2}{r}$.`, R`$v = \sqrt{\dfrac{k \cdot e^2}{m_e \cdot r}}$.`], risposta: { tipo: 'numero', valore: 1.09e6, unita: 'm/s' }, soluzione: [R`La forza elettrica è la forza centripeta: $\dfrac{k \cdot e^2}{r^2} = \dfrac{m_e \cdot v^2}{r}$, quindi $v^2 = \dfrac{k \cdot e^2}{m_e \cdot r}$.`, R`$v^2 = \dfrac{2{,}30 \cdot 10^{-28}}{9{,}11 \cdot 10^{-31} \cdot 2{,}12 \cdot 10^{-10}}\,\text{m}^2/\text{s}^2 \approx 1{,}19 \cdot 10^{12}\,\text{m}^2/\text{s}^2$.`, R`$v \approx 1{,}09 \cdot 10^6\,\text{m/s}$: più di mille chilometri al secondo.`] },
    { id: 'es-12', difficolta: 2, testo: R`Una carica di 9 nC sta al centro di un cubo. Quanto vale il flusso del campo attraverso una sola faccia del cubo?`, suggerimenti: [R`Il flusso totale sulle sei facce è $Q/\varepsilon_0$.`, R`Per simmetria ogni faccia ne prende un sesto.`], risposta: { tipo: 'numero', valore: 169.5, unita: 'N·m²/C' }, soluzione: [R`Flusso totale: $\Phi = \dfrac{9 \cdot 10^{-9}}{8{,}85 \cdot 10^{-12}}\,\text{N} \cdot \text{m}^2/\text{C} \approx 1017\,\text{N} \cdot \text{m}^2/\text{C}$.`, R`La carica è al centro: le sei facce sono uguali. Su una faccia: $\dfrac{1017}{6} \approx 170\,\text{N} \cdot \text{m}^2/\text{C}$.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Strofinando una bacchetta di plastica con la lana, che cosa passa da un corpo all'altro?`, opzioni: [R`Protoni`, R`Neutroni`, R`Elettroni`, R`Atomi interi`], corretta: 2, spiegazione: R`Si spostano solo gli elettroni, i più esterni e i meno legati. Protoni e neutroni restano chiusi nei nuclei, e gli atomi non passano da un corpo all'altro.` },
    { id: 'q-02', domanda: R`Un corpo ha carica positiva. Che cosa vuol dire?`, opzioni: [R`Ha meno elettroni che protoni`, R`Ha ricevuto protoni da un altro corpo`, R`Non ha più elettroni`, R`Ha più neutroni che protoni`], corretta: 0, spiegazione: R`Un corpo positivo ha perso alcuni elettroni: ne ha meno dei protoni. I protoni non si spostano, i neutroni non hanno carica, e gli elettroni rimasti sono comunque moltissimi.` },
    { id: 'q-03', domanda: R`Due cariche si attraggono con forza $F$. La loro distanza si dimezza. Quanto vale ora la forza?`, opzioni: [R`$F/2$`, R`$F/4$`, R`$2 \cdot F$`, R`$4 \cdot F$`], corretta: 3, spiegazione: R`La forza va con l'inverso del quadrato della distanza: distanza metà, $r^2$ un quarto, forza quattro volte tanto.` },
    { id: 'q-04', domanda: R`Una bacchetta carica attira una pallina appesa a un filo. Che cosa si può dire con certezza della pallina?`, opzioni: [R`Ha carica opposta alla bacchetta`, R`Potrebbe anche essere neutra`, R`Ha carica dello stesso segno della bacchetta`, R`È di metallo`], corretta: 1, spiegazione: R`Un corpo carico attira anche un corpo neutro, per induzione o per polarizzazione, conduttore o isolante che sia. Solo la repulsione prova una carica dello stesso segno.` },
    { id: 'q-05', domanda: R`In che unità si misura il campo elettrico?`, opzioni: [R`$\text{N} \cdot \text{C}$`, R`$\text{N/C}$`, R`$\text{C/N}$`, R`$\text{N} \cdot \text{m}^2/\text{C}$`], corretta: 1, spiegazione: R`Il campo è una forza divisa una carica: newton al coulomb. $\text{N} \cdot \text{m}^2/\text{C}$ è l'unità del flusso, non del campo.` },
    { id: 'q-06', domanda: R`In un punto il campo elettrico punta verso est. Una carica negativa messa lì sente una forza…`, opzioni: [R`verso est`, R`nulla, perché il campo agisce solo sulle positive`, R`verso nord`, R`verso ovest`], corretta: 3, spiegazione: R`$\vec{F} = q \cdot \vec{E}$: con $q$ negativa la forza ha la stessa direzione del campo e verso opposto. Il campo agisce su tutte le cariche.` },
    { id: 'q-07', domanda: R`In una zona le linee di campo sono più fitte che in un'altra. Che cosa vuol dire?`, opzioni: [R`Lì il campo è più intenso`, R`Lì il campo è più debole`, R`Lì il campo cambia verso`, R`Lì ci sono più cariche di prova`], corretta: 0, spiegazione: R`La densità delle linee misura l'intensità del campo. Il verso lo dicono le frecce sulle linee; le cariche di prova non c'entrano, perché il campo non dipende da loro.` },
    { id: 'q-08', domanda: R`Una superficie chiusa non contiene cariche, ma vicino c'è una carica $Q$ all'esterno. Quanto vale il flusso del campo attraverso la superficie?`, opzioni: [R`$Q/\varepsilon_0$`, R`$-Q/\varepsilon_0$`, R`Zero`, R`Dipende dalla distanza della carica`], corretta: 2, spiegazione: R`Conta solo la carica dentro. Le linee della carica esterna entrano da una parte ed escono dall'altra: il flusso totale è zero, a qualunque distanza.` },
    { id: 'q-09', domanda: R`Una carica sta al centro di una sfera immaginaria. Si raddoppia il raggio della sfera. Che cosa succede al flusso del campo?`, opzioni: [R`Diventa quattro volte tanto`, R`Raddoppia`, R`Diventa un quarto`, R`Non cambia`], corretta: 3, spiegazione: R`Il campo diventa un quarto, ma la superficie quattro volte più grande: il prodotto resta uguale. Lo dice Gauss: $\Phi = Q/\varepsilon_0$, e la carica dentro è la stessa.` },
    { id: 'q-10', domanda: R`Quanto vale il campo elettrico dentro un conduttore in equilibrio?`, opzioni: [R`Zero`, R`Lo stesso valore che ha appena fuori`, R`È massimo al centro`, R`Dipende dalla carica del conduttore`], corretta: 0, spiegazione: R`Se dentro ci fosse un campo, gli elettroni liberi si muoverebbero e non ci sarebbe equilibrio. Il campo dentro è zero qualunque sia la carica; fuori invece c'è.` },
    { id: 'q-11', domanda: R`Perché chi è dentro un'auto è protetto da un fulmine?`, opzioni: [R`Perché le gomme isolano l'auto da terra`, R`Perché la carrozzeria di metallo fa da gabbia di Faraday`, R`Perché i fulmini non colpiscono gli oggetti in movimento`, R`Perché i vetri fermano le cariche`], corretta: 1, spiegazione: R`La carica del fulmine resta sulla carrozzeria, e dentro il campo è zero. Le gomme non c'entrano: dopo chilometri di aria, pochi centimetri di gomma non fermano un fulmine.` },
    { id: 'q-12', domanda: R`Che cosa mostrò l'esperimento di Millikan con le gocce d'olio?`, opzioni: [R`Che la carica totale si conserva`, R`Che la forza elettrica va come $1/r^2$`, R`Che la carica è sempre un multiplo intero di $e$`, R`Che gli elettroni hanno massa`], corretta: 2, spiegazione: R`Le cariche delle gocce erano sempre multipli di uno stesso valore, la carica elementare $e$: la carica è quantizzata. La conservazione e la legge $1/r^2$ si provano in altri modi.` },
    { id: 'q-13', domanda: R`Un elettrone e un protone si allontanano l'uno dall'altro. Che cosa succede al rapporto fra la forza elettrica e la forza di gravità?`, opzioni: [R`Resta lo stesso`, R`Cresce`, R`Cala`, R`Si annulla quando sono lontanissime`], corretta: 0, spiegazione: R`Tutte e due le forze vanno come $1/r^2$: calano insieme, nello stesso modo. Il rapporto resta circa $2{,}3 \cdot 10^{39}$ a qualunque distanza.` },
    { id: 'q-14', domanda: R`Un conduttore carico ha la forma di una goccia, rotonda da una parte e appuntita dall'altra. Dove il campo appena fuori è più intenso?`, opzioni: [R`È uguale dappertutto`, R`Vicino alla parte rotonda e larga`, R`Al centro del conduttore`, R`Vicino alla punta`], corretta: 3, spiegazione: R`La carica si addensa dove la superficie è più curva: sulla punta il campo è più forte. È il potere delle punte, lo stesso del parafulmine. Al centro, dentro il conduttore, il campo è zero.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Prima di usare $k$, porta tutto in coulomb e metri: 3 μC sono $3 \cdot 10^{-6}\,\text{C}$, 20 cm sono $0{,}20\,\text{m}$.` },
    { tipo: 'errore', testo: R`Attrazione non vuol dire per forza cariche opposte: un corpo carico attira anche un corpo neutro. Solo la repulsione dice «stesso segno».` },
    { tipo: 'errore', testo: R`Il campo non dipende dalla carica di prova: se la cambi, cambia la forza, ma non il campo.` },
    { tipo: 'errore', testo: R`Su una carica negativa la forza è **opposta** al campo. Nell'esperimento di Millikan, con il campo verso il basso, la goccia negativa è spinta in su.` },
    { tipo: 'trucco', testo: R`La legge di Coulomb funziona come quella di Newton: distanza doppia, forza un quarto; distanza tripla, un nono. Spesso basta il rapporto, senza $k$.` },
    { tipo: 'metodo', testo: R`Con più cariche: calcola il modulo di ogni forza senza segni, poi disegna la sua freccia guardando chi attrae e chi respinge. Alla fine somma le componenti.` },
    { tipo: 'trucco', testo: R`Con il teorema di Gauss conta solo la carica **dentro** la superficie, e la forma della superficie non importa.` },
    { tipo: 'metodo', testo: R`Cerchi il punto dove il campo è zero? Sta dove i due campi hanno versi opposti, più vicino alla carica più piccola.` }
  ],
  aneddoti: [
    { fisico: 'Stephen Gray', anni: '1666–1736', titolo: 'Il ragazzo appeso ai fili di seta', testo: R`Stephen Gray faceva il tintore a Canterbury, come suo padre. Da vecchio visse da pensionato povero alla Charterhouse di Londra, un ospizio per anziani. Lì studiava l'elettricità con un tubo di vetro strofinato. Nel 1729 scoprì che l'effetto viaggiava lungo uno spago, per centinaia di metri. Lo spago però doveva essere sostenuto da fili di seta. Con sostegni di ottone l'effetto spariva: la carica scappava. Nel 1730 fece l'esperimento più famoso. Appese un ragazzo in orizzontale, con corde di seta. Poi avvicinò ai suoi piedi il tubo strofinato. Pezzetti di foglia d'ottone saltavano verso il viso del ragazzo. Nel 1731 la Royal Society gli assegnò la prima medaglia Copley della storia.`, legame: R`Gray separò per primo i materiali che lasciano passare la carica, i conduttori, da quelli che la fermano, gli isolanti.` },
    { fisico: 'Benjamin Franklin', anni: '1706–1790', titolo: 'L\'aquilone e i nomi delle cariche', testo: R`Benjamin Franklin era un tipografo di Filadelfia. Verso il 1746 cominciò a studiare l'elettricità. Pensava a un unico «fluido elettrico». Chiamò positivo un corpo con fluido in più, negativo uno con fluido in meno. La scelta era arbitraria: il vetro strofinato divenne positivo. Gli elettroni furono scoperti solo nel 1897. Per quella scelta, oggi la loro carica è negativa. Franklin voleva anche provare che i fulmini sono scintille elettriche. Nel 1752, racconta, fece volare un aquilone durante un temporale e trasse scintille da una chiave legata al filo. Alcuni storici dubitano che sia andata proprio così. Di certo nel 1753, a San Pietroburgo, il fisico Georg Richmann morì folgorato durante una prova simile.`, legame: R`Da Franklin vengono i nomi «positivo» e «negativo» delle cariche, e il parafulmine.` },
    { fisico: 'Charles-Augustin de Coulomb', anni: '1736–1806', titolo: 'La bilancia che misurava le forze piccole', testo: R`Nel 1785 Coulomb presentò all'Accademia delle scienze di Parigi uno strumento delicatissimo: la bilancia di torsione. Dentro un cilindro di vetro, un ago leggero pendeva orizzontale da un sottile filo d'argento. A un capo dell'ago c'era una pallina di midollo di sambuco. Una seconda pallina, fissa, veniva caricata insieme alla prima e la respingeva. L'ago girava e torceva il filo. Più il filo era torto, più forte era la forza: così Coulomb la misurava. Nella prova più famosa, per avvicinare le palline a metà distanza servì una torsione circa quattro volte più grande. Era la legge dell'inversa del quadrato. Coulomb fece poche misure, e altri prima di lui l'avevano sospettata. Ma la legge porta il suo nome.`, legame: R`È la misura da cui nasce la legge di Coulomb, $F = k \cdot q_1 \cdot q_2 / r^2$.` },
    { fisico: 'Michael Faraday', anni: '1791–1867', titolo: 'Lo scienziato chiuso nella gabbia', testo: R`Nel 1836, alla Royal Institution di Londra, Michael Faraday si fece costruire una stanza strana. Era un cubo di legno di circa 3,7 metri di lato. Le pareti erano una rete di fili di rame, coperta di carta e di strisce di stagnola. Il cubo poggiava su sostegni isolanti. Faraday lo caricò con una potente macchina elettrostatica. Dalla superficie esterna partivano scintille. Poi entrò dentro, con candele accese e gli strumenti più sensibili che aveva. Scrisse di esserci rimasto a lungo, come se ci abitasse. Non trovò il minimo segno di elettricità. Fuori la carica era enorme, dentro il campo era zero. Oggi una stanza così si chiama gabbia di Faraday.`, legame: R`Mostra che dentro un conduttore cavo il campo elettrico è zero: è la gabbia di Faraday.` },
    { fisico: 'Robert Millikan', anni: '1868–1953', titolo: 'La goccia d\'olio e il patto con lo studente', testo: R`All'Università di Chicago Millikan cercava di misurare la carica dell'elettrone. All'inizio usava goccioline d'acqua, che però evaporavano in pochi secondi. Nel 1909 un suo dottorando, Harvey Fletcher, provò con l'olio da orologi, che evapora molto meno. Funzionò: una goccia si poteva seguire per ore. Fletcher fece buona parte delle misure. Millikan però gli propose un patto. L'articolo principale sulle gocce d'olio sarebbe uscito con il solo nome di Millikan. Fletcher avrebbe firmato da solo un altro lavoro, valido per la sua tesi. Fletcher accettò. Lo si seppe solo nel 1982, quando uscirono le sue memorie, dopo la sua morte. Nel 1923 Millikan ricevette il premio Nobel.`, legame: R`È l'esperimento che ha mostrato che la carica è quantizzata, e ha misurato $e$.` }
  ]
});
})();
