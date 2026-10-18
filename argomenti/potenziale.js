/* Quanto — Potenziale e condensatori (potenziale, quarto anno): il lavoro della forza elettrica e l'energia potenziale,
   il potenziale e la differenza di potenziale, la carica puntiforme, le equipotenziali, il condensatore e la sua energia,
   serie e parallelo, le cariche accelerate (elettronvolt) e deviate (tubo a raggi catodici).
   Colori come in elettrostatica.js e nei video: cariche positive viola (4), negative azzurre (1), forze arancio (2),
   campo grigio, potenziale ed energia verdi (3, come le equipotenziali dei video), velocità azzurre (1).
   L'energia potenziale elettrica è U, come nei video (in meccanica era E_p).
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/potenziale.js */
(function () {
const R = String.raw;

/* una carica disegnata come cerchietto con il segno dentro (come in elettrostatica.js): viola se positiva */
function caricaFissa(x, y, segno, dy) {
  const col = segno > 0 ? 4 : 1;
  return [
    { tipo: 'punto', p: [x, y], raggio: 16, vuoto: true, colore: col },
    { tipo: 'testo', p: [x, (typeof y === 'string' ? y + ' - ' + (dy || 0.1) : y - (dy || 0.1))], testo: segno > 0 ? '+' : '−', colore: col }
  ];
}
/* le linee radiali del campo di una carica positiva al centro, da r1 a r2, ogni «passo» gradi */
function raggiera(r1, r2, passo) {
  const out = [];
  for (let g = 0; g < 360; g += passo) {
    const c = Math.cos(g * Math.PI / 180), s = Math.sin(g * Math.PI / 180);
    out.push({ tipo: 'segmento', da: [+(r1 * c).toFixed(3), +(r1 * s).toFixed(3)], a: [+(r2 * c).toFixed(3), +(r2 * s).toFixed(3)], colore: 'grigio', freccia: true });
  }
  return out;
}

QUANTO.registra({
  id: 'potenziale',
  titolo: 'Potenziale e condensatori',
  introduzione: R`Una pila da 1,5 V, la presa di casa a 230 V, un fulmine a centinaia di milioni di volt. Il volt è l'unità più famosa dell'elettricità. Misura il **potenziale elettrico**, cioè l'energia per ogni coulomb di carica. È il «dislivello» che fa muovere le cariche, come l'altezza fa scendere l'acqua.

Si parte dal lavoro della forza elettrica e dall'energia potenziale. Poi vengono il potenziale e le superfici equipotenziali. Poi il **condensatore**, che mette da parte carica ed energia: c'è in quasi ogni circuito, dal flash al defibrillatore. Alla fine, le cariche che il campo accelera e devia, come nei vecchi tubi a raggi catodici.

Servono il campo elettrico e la legge di Coulomb, il lavoro e l'energia potenziale della meccanica. Aiuta il moto parabolico: un elettrone fra due piatti carichi fa la stessa strada di un sasso lanciato.`,
  inBreve: [
    R`La forza **elettrostatica**, quella delle cariche ferme, è **conservativa**: una carica ha un'energia potenziale $U$, e il lavoro del campo è $L = -\Delta U$.`,
    R`Il **potenziale** è l'energia per coulomb, $V = U/q$, in volt. Conta solo la differenza $\Delta V$: una carica positiva libera va verso il potenziale più basso.`,
    R`Attorno a una carica puntiforme $V = \dfrac{k \cdot Q}{r}$; nel campo uniforme $\Delta V = E \cdot d$, in modulo. Le **equipotenziali** sono perpendicolari alle linee di campo.`,
    R`La **capacità** è $C = Q/V$, in farad. Per il condensatore piano $C = \varepsilon_0 \cdot S / d$, e l'energia immagazzinata è $U = \frac{1}{2} \cdot C \cdot V^2$.`,
    R`In **parallelo** le capacità si sommano; in **serie** si sommano i loro inversi.`,
    R`Una carica accelerata da ferma acquista $\frac{1}{2} \cdot m \cdot v^2 = q \cdot \Delta V$. Un elettrone che attraversa 1 V guadagna 1 **elettronvolt**, $1{,}60 \cdot 10^{-19}\,\text{J}$.`
  ],
  sezioni: [
    {
      id: 'lavoro-elettrico',
      titolo: 'Il lavoro della forza elettrica',
      testo: R`Un sasso che cade prende velocità: il peso fa lavoro, e l'energia potenziale cala. Con le cariche succede qualcosa di molto simile.

Prendiamo due piastre parallele, una positiva sopra e una negativa sotto. Fra loro il campo $E$ è uniforme e punta verso il basso. Una carica positiva $q$ sente la forza $F = q \cdot E$, uguale in ogni punto. È come il peso $m \cdot g$ vicino al suolo.

Se la carica scende di un tratto $h$ lungo il campo, la forza elettrica fa il lavoro $L = q \cdot E \cdot h$. Se si sposta di traverso, il lavoro è zero: la forza è perpendicolare allo spostamento. Su una strada qualunque conta solo di quanto si è scesi lungo il campo.

In meccanica l'energia potenziale si chiamava $E_p$. Qui, come nei video e in molti libri, si chiama $U$.

>* La forza **elettrostatica**, quella delle cariche ferme, è **conservativa**: il suo lavoro dipende solo da dove la carica parte e da dove arriva. Per questo una carica ha un'**energia potenziale elettrica** $U$, e il lavoro del campo è $L = -\Delta U$.

Nel campo uniforme mettiamo lo zero sulla piastra negativa. Una carica positiva all'altezza $h$ ha allora $U = q \cdot E \cdot h$: è l'analogo di $m \cdot g \cdot h$.

[[grafico:lavoro-piastre]]

~ L = q \cdot E \cdot h :: una carica di 5 nC scende di 3 cm in un campo di 400 N/C
~ L = 5 \cdot 10^{-9}\,\text{C} \cdot 400\,\text{N/C} \cdot 0{,}03\,\text{m} :: tutto in unità del SI
~ L = \evidb{6 \cdot 10^{-8}\,\text{J}} :: il campo fa lavoro positivo: $U$ cala di altrettanto

Anche la legge di Coulomb dà una forza conservativa, come la gravitazione. Ogni distribuzione di cariche ferme ha quindi la sua energia potenziale.

>! Per una carica negativa vale il contrario. La forza punta verso la piastra positiva, cioè in su. Se la carica negativa scende lungo il campo, la sua energia potenziale cresce.

?? Una carica positiva si sposta fra le piastre in orizzontale, parallela alle piastre. Quanto lavoro fa la forza elettrica?
[ ] $q \cdot E$ per lo spostamento
[x] zero
[ ] dipende dalla velocità della carica
=> La forza è verticale e lo spostamento orizzontale: sono perpendicolari, e il lavoro è zero. Come il peso di una valigia portata in piano.`
    },
    {
      id: 'potenziale',
      titolo: 'Il potenziale elettrico',
      testo: R`Nello stesso punto, una carica doppia ha un'energia potenziale doppia. Il rapporto $U/q$ invece non cambia: dipende solo dal punto. È il **potenziale**.

[[video:potenziale/potenziale]]

>* Il **potenziale elettrico** in un punto è l'energia potenziale per ogni coulomb di carica: $V = \dfrac{U}{q}$. Si misura in joule al coulomb, cioè in **volt** (V): $1\,\text{V} = 1\,\text{J/C}$.

Il potenziale è un numero, non un vettore: niente frecce né componenti. Come per l'altezza, lo zero si sceglie. Cambiando lo zero cambiano tutti i valori, ma non le **differenze di potenziale** $\Delta V$ fra due punti. Nei conti contano solo quelle. La differenza di potenziale si chiama anche **tensione**.

>* Una carica $q$ va da A a B, e il campo fa il lavoro $L$. La differenza di potenziale è $\Delta V = V_B - V_A = -\dfrac{L}{q}$.

Una forza esterna può spostare la carica piano piano, senza farle prendere velocità. Fa il lavoro opposto a quello del campo: $L_{est} = q \cdot \Delta V$. Per 1 C positivo, $\Delta V$ è proprio questo lavoro.

Lasciata libera, una carica positiva «scende» verso il potenziale più basso, come un sasso. Una carica negativa fa il contrario: «sale» verso il potenziale più alto.

Nel campo uniforme il potenziale cala di $E \cdot d$ lungo un tratto $d$ nel verso del campo. Quindi $E = \Delta V / d$, in modulo. Per questo il campo si misura anche in volt al metro: $1\,\text{V/m} = 1\,\text{N/C}$.

~ U = q \cdot V :: in un punto a 150 V metto una carica di −2 μC
~ U = -2 \cdot 10^{-6}\,\text{C} \cdot 150\,\text{V} :: la carica va con il suo segno
~ U = \evidb{-3 \cdot 10^{-4}\,\text{J}} :: negativa: per le cariche negative i potenziali alti sono «buche»

>! Il volt non è un'energia. Il potenziale è energia per coulomb: per avere i joule bisogna moltiplicare per la carica.

?? Una carica positiva, ferma in un campo elettrico, viene lasciata libera. Verso dove si muove?
[x] verso i punti a potenziale più basso
[ ] verso i punti a potenziale più alto
[ ] lungo una linea a potenziale costante
=> Il campo fa lavoro positivo, quindi $\Delta V = -L/q$ è negativo: il potenziale scende. Una carica negativa andrebbe invece verso i potenziali più alti.`
    },
    {
      id: 'carica-puntiforme',
      titolo: 'Il potenziale di una carica puntiforme',
      testo: R`Attorno a una carica puntiforme $Q$ il campo non è uniforme: cala come $1/r^2$. Anche il potenziale cambia con la distanza, ma più lentamente. Per una carica isolata conviene mettere lo zero lontanissimo, all'infinito.

>* Il potenziale a distanza $r$ da una carica puntiforme $Q$, con lo zero all'infinito, è $V = \dfrac{k \cdot Q}{r}$. È positivo attorno alle cariche positive, negativo attorno alle negative.

A distanza doppia il potenziale si dimezza, mentre il campo diventa un quarto.

[[grafico:potenziale-carica]]

~ V = \dfrac{k \cdot Q}{r} :: una carica di 3 nC, a 9 cm di distanza
~ V = \dfrac{8{,}99 \cdot 10^9 \cdot 3 \cdot 10^{-9}}{0{,}09}\,\text{V} :: con k nel SI, la carica in coulomb e la distanza in metri il risultato esce in volt
~ V \approx \evidb{300\,\text{V}} :: per portare lì 1 C dall'infinito servono 300 J

Con più cariche i potenziali si sommano: $V = V_1 + V_2 + \dots$ È una somma di numeri, ognuno con il suo segno. È molto più facile della somma dei campi, che sono vettori.

Due cariche puntiformi $q_1$ e $q_2$ a distanza $r$ hanno l'energia potenziale $U = \dfrac{k \cdot q_1 \cdot q_2}{r}$. È il lavoro che serve per avvicinarle partendo da lontanissimo. Con lo stesso segno $U$ è positiva: per avvicinarle bisogna spingere. Con segni opposti è negativa: si attirano da sole. Somiglia all'energia potenziale gravitazionale, $E_p = -G \cdot M \cdot m / r$: stessa forma, ma sempre negativa, perché la gravità attira sempre.

>! $V = k \cdot Q / r$ non è il campo. Il campo ha $r^2$ al denominatore ed è un vettore. Il potenziale ha $r$ ed è un numero con il segno.

?? Due cariche, +5 nC e −5 nC, sono a una certa distanza. Quanto vale il potenziale nel punto di mezzo?
[ ] il doppio di quello di una carica sola
[x] zero
[ ] non si può dire senza la distanza
=> I due potenziali hanno lo stesso valore e segni opposti: la somma è zero. Il campo lì invece non è zero: punta verso la carica negativa.`
    },
    {
      id: 'equipotenziali',
      titolo: 'Le superfici equipotenziali',
      testo: R`Sulle carte dei sentieri, le curve di livello uniscono i punti alla stessa altezza. Per il potenziale si fa lo stesso.

[[video:potenziale/equipotenziali]]

>* Una **superficie equipotenziale** unisce i punti che hanno lo stesso potenziale. È sempre perpendicolare alle linee di campo.

Per una carica puntiforme le equipotenziali sono sfere con la carica al centro. Fra due piastre parallele sono piani paralleli alle piastre.

Perché perpendicolari? Su un'equipotenziale $\Delta V = 0$. Spostando lì una carica, il campo non fa lavoro. Allora la forza deve essere perpendicolare allo spostamento.

[[grafico:equipotenziali]]

Disegnate a passi uguali di volt, le equipotenziali dicono anche quanto è intenso il campo. Dove sono fitte, il campo è forte. Il campo punta verso i potenziali più bassi. Il suo modulo è il dislivello diviso la distanza fra due equipotenziali vicine.

~ E = \dfrac{\Delta V}{\Delta s} :: due equipotenziali che differiscono di 20 V, a 4 mm l'una dall'altra
~ E = \dfrac{20\,\text{V}}{0{,}004\,\text{m}} :: la distanza in metri
~ E = \evidb{5000\,\text{V/m}} :: più sono vicine, più il campo è intenso

Un conduttore in equilibrio è tutto allo stesso potenziale. Dentro il campo è zero, quindi muoversi lì non costa lavoro. La sua superficie è un'equipotenziale: per questo il campo, appena fuori, è perpendicolare. Una sfera carica, all'esterno, ha il potenziale di una carica puntiforme al centro. Sulla sua superficie vale $V = k \cdot Q / R$.

>! Equipotenziale non vuol dire campo zero. Lungo un'equipotenziale il potenziale non cambia, ma il campo c'è e la attraversa ad angolo retto.

?? Una carica va da un punto a 50 V a un altro punto a 50 V, lungo una strada tortuosa. Quanto lavoro fa il campo?
[ ] dipende dalla strada
[ ] è positivo, perché la carica si è mossa
[x] zero
=> Il lavoro del campo è $-q \cdot \Delta V$, e qui $\Delta V = 0$. La strada non conta: la forza elettrostatica è conservativa.`
    },
    {
      id: 'condensatore',
      titolo: 'Il condensatore e la capacità',
      testo: R`Un **condensatore** è fatto di due conduttori vicini, le **armature**, separati da un isolante. Collegato a una pila, prende cariche uguali e opposte: $+Q$ su un'armatura, $-Q$ sull'altra. Si trova in quasi ogni circuito: nei telefoni, nei flash, negli alimentatori.

[[video:potenziale/condensatore]]

Con una tensione doppia, la carica raddoppia. Il rapporto fra carica e tensione non cambia: dipende solo da come è fatto il condensatore.

>* La **capacità** di un condensatore è $C = \dfrac{Q}{V}$. Qui $Q$ è la carica di un'armatura e $V$ la tensione fra le due. Si misura in **farad**: $1\,\text{F} = 1\,\text{C/V}$.

Il farad è un'unità enorme. I condensatori veri hanno capacità di microfarad (μF), nanofarad (nF) o picofarad (pF). Un condensatore da 10 μF collegato a 6 V prende $Q = C \cdot V = 60\,\mu\text{C}$.

Il caso più semplice è il **condensatore piano**: due lastre di area $S$, a distanza $d$. Con il teorema di Gauss si è visto il campo fra due lastre con cariche opposte. Vale $E = \sigma / \varepsilon_0$, dove $\sigma = Q/S$ è la carica per metro quadrato.

~ E = \dfrac{\sigma}{\varepsilon_0} = \dfrac{Q}{\varepsilon_0 \cdot S} :: il campo fra le armature, uniforme
~ V = E \cdot d = \dfrac{Q \cdot d}{\varepsilon_0 \cdot S} :: nel campo uniforme la tensione è $E \cdot d$
~ C = \dfrac{Q}{V} = \evidb{\dfrac{\varepsilon_0 \cdot S}{d}} :: la carica si semplifica: resta solo la forma

Armature più grandi o più vicine danno più capacità. La costante $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{F/m}$ è la **costante dielettrica del vuoto**, la stessa del teorema di Gauss. $\text{F/m}$ e $\text{C}^2/(\text{N} \cdot \text{m}^2)$ sono la stessa unità: un farad è un coulomb al volt, e un volt è un joule al coulomb.

Con un isolante fra le armature, come plastica o vetro, la capacità cresce: $C = \varepsilon_r \cdot \varepsilon_0 \cdot S / d$. Il numero $\varepsilon_r$ è la **costante dielettrica relativa** del materiale. Vale 1 nel vuoto e quasi 1 nell'aria, fra 2 e 10 per plastiche e vetri.

>! La capacità non dice quanta carica c'è. Dice quanta ne prende il condensatore per ogni volt. Un condensatore scarico ha la stessa capacità di uno carico.

?? Un condensatore piano resta collegato alla stessa pila. Le armature vengono avvicinate a metà distanza. Che cosa succede alla carica?
[ ] si dimezza
[x] raddoppia
[ ] resta uguale
=> Con $d$ dimezzata la capacità $\varepsilon_0 \cdot S / d$ raddoppia. La pila tiene la stessa tensione, quindi $Q = C \cdot V$ raddoppia anche lei.`
    },
    {
      id: 'energia-condensatore',
      titolo: 'L\'energia del condensatore',
      testo: R`Il flash di una macchina fotografica si carica per qualche secondo, poi si scarica in un lampo. L'energia del lampo era immagazzinata in un condensatore.

Caricare un condensatore costa lavoro. La prima carica passa da un'armatura all'altra senza fatica, perché la tensione è ancora zero. Poi la tensione cresce, e ogni carica in più deve salire un dislivello più alto. In media, ogni carica sale di $V/2$.

>* Un condensatore con carica $Q$ e tensione $V$ immagazzina l'energia $U = \frac{1}{2} \cdot Q \cdot V = \frac{1}{2} \cdot C \cdot V^2$.

Nel grafico tensione–carica la tensione cresce in linea retta, $V = Q/C$. L'energia è l'area del triangolo sotto la retta, come lo spazio sotto il grafico velocità–tempo.

[[grafico:carica-condensatore]]

~ U = \tfrac{1}{2} \cdot C \cdot V^2 :: il condensatore di un flash: 100 μF a 300 V
~ U = \tfrac{1}{2} \cdot 100 \cdot 10^{-6}\,\text{F} \cdot (300\,\text{V})^2 :: la tensione va al quadrato
~ U = \evidb{4{,}5\,\text{J}} :: liberati in circa un millesimo di secondo: un lampo potente

Dove sta questa energia? Nel campo fra le armature. Con $C = \varepsilon_0 \cdot S / d$ e $V = E \cdot d$, l'energia diventa $\frac{1}{2} \cdot \varepsilon_0 \cdot E^2 \cdot S \cdot d$. Il prodotto $S \cdot d$ è il volume fra le armature. Ogni metro cubo di campo contiene quindi l'energia $u = \frac{1}{2} \cdot \varepsilon_0 \cdot E^2$. Dove c'è un campo elettrico, c'è energia.

>! L'energia non è $Q \cdot V$. Le prime cariche sono passate con una tensione piccola: per questo c'è il fattore $\frac{1}{2}$.

?? Lo stesso condensatore viene caricato con una tensione doppia. Che cosa succede all'energia immagazzinata?
[ ] raddoppia
[x] diventa quattro volte tanto
[ ] resta uguale, perché la capacità non cambia
=> In $U = \frac{1}{2} \cdot C \cdot V^2$ la tensione compare al quadrato. Raddoppiano sia la carica sia la tensione: il triangolo è largo il doppio e alto il doppio.`
    },
    {
      id: 'serie-parallelo',
      titolo: 'Condensatori in parallelo e in serie',
      testo: R`Nei circuiti i condensatori si collegano spesso a gruppi. Il gruppo si comporta come un condensatore solo, con una **capacità equivalente**.

[[video:potenziale/serie-parallelo]]

**In parallelo** i condensatori sono affiancati: ognuno è collegato agli stessi due punti. Hanno tutti la **stessa tensione**. Le cariche invece si sommano: $Q = Q_1 + Q_2$, cioè $C \cdot V = C_1 \cdot V + C_2 \cdot V$.

>* In parallelo la capacità equivalente è la somma delle capacità: $C = C_1 + C_2 + \dots$

**In serie** i condensatori sono uno dopo l'altro, sullo stesso filo. La pila carica solo le due armature agli estremi. Le armature di mezzo sono isolate e si caricano per induzione elettrostatica. Così tutti i condensatori hanno la **stessa carica** $Q$. Le tensioni invece si sommano.

~ V = V_1 + V_2 :: in serie le tensioni si sommano
~ \dfrac{Q}{C} = \dfrac{Q}{C_1} + \dfrac{Q}{C_2} :: ogni tensione è la carica divisa la capacità
~ \dfrac{1}{C} = \evidb{\dfrac{1}{C_1} + \dfrac{1}{C_2}} :: divido tutto per $Q$, che è la stessa

>* In serie si sommano gli inversi: $\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \dots$ La capacità equivalente è minore della più piccola.

Due condensatori uguali da 10 μF in parallelo fanno 20 μF; in serie fanno 5 μF. Il parallelo è come un'armatura più grande. La serie è come armature più lontane.

| | parallelo | serie |
|---|---|---|
| uguale | tensione | carica |
| si somma | carica | tensione |
| $C$ | $C_1 + C_2$ | $\tfrac{C_1 \cdot C_2}{C_1 + C_2}$ |

>! In serie le capacità non si sommano. Aggiungere un condensatore in serie fa calare la capacità del gruppo.

?? Due condensatori, da 2 μF e da 8 μF, sono collegati in serie. Quanto vale la capacità equivalente?
[ ] $10\,\mu\text{F}$
[x] $1{,}6\,\mu\text{F}$
[ ] $5\,\mu\text{F}$
=> In serie si sommano gli inversi: $\frac{1}{2} + \frac{1}{8} = \frac{5}{8}$, quindi $C = \frac{8}{5} = 1{,}6\,\mu\text{F}$. È meno del condensatore più piccolo, come deve essere.`
    },
    {
      id: 'cariche-accelerate',
      titolo: 'Cariche accelerate e l\'elettronvolt',
      testo: R`Una carica libera in un campo elettrico non resta ferma. La forza $F = q \cdot E$ la accelera, e il campo fa lavoro. Quel lavoro diventa energia cinetica.

[[video:potenziale/cannone-elettronico]]

L'energia si conserva. Quello che la carica perde in energia potenziale, lo guadagna in energia cinetica. Non serve sapere com'è fatto il campo, né quanto è lunga la strada: conta solo la differenza di potenziale.

>* Una carica $q$ parte da ferma e attraversa la differenza di potenziale $\Delta V$. Acquista l'energia cinetica $\frac{1}{2} \cdot m \cdot v^2 = q \cdot \Delta V$, in modulo.

Per elettroni e protoni il joule è un'unità troppo grande. Si usa l'**elettronvolt**.

>* Un **elettronvolt** (eV) è l'energia che acquista un elettrone attraversando una differenza di potenziale di 1 V: $1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$.

~ E_c = e \cdot \Delta V = 500\,\text{eV} :: un elettrone parte da fermo e attraversa 500 V: un elettronvolt per ogni volt
~ E_c = 8{,}0 \cdot 10^{-17}\,\text{J} :: in joule: 500 per $1{,}60 \cdot 10^{-19}$ J
~ v = \sqrt{\dfrac{2 \cdot E_c}{m}} :: dall'energia cinetica $\frac{1}{2} \cdot m \cdot v^2$
~ v = \sqrt{\dfrac{2 \cdot 8{,}0 \cdot 10^{-17}\,\text{J}}{9{,}11 \cdot 10^{-31}\,\text{kg}}} :: un joule al chilogrammo è un metro quadrato al secondo quadrato
~ v \approx \evidb{1{,}33 \cdot 10^7\,\text{m/s}} :: circa il 4% della velocità della luce

L'energia cresce come la tensione, la velocità invece come la sua radice. Con una tensione quattro volte più grande la velocità raddoppia.

[[grafico:cannone]]

>! Un protone e un elettrone che attraversano la stessa differenza di potenziale prendono la stessa energia cinetica. Ma il protone ha una massa 1836 volte più grande: va circa 43 volte più piano. E i due vanno in versi opposti.

?? Un elettrone parte da fermo e attraversa una differenza di potenziale di 50 V. Quanta energia cinetica acquista?
[x] $50\,\text{eV}$
[ ] $50\,\text{J}$
[ ] $50\,\text{V}$
=> Per definizione, ogni volt attraversato dà all'elettrone un elettronvolt. In joule sono $50 \cdot 1{,}60 \cdot 10^{-19} = 8 \cdot 10^{-18}\,\text{J}$. Il volt invece non è un'unità di energia.`
    },
    {
      id: 'deflessione',
      titolo: 'L\'elettrone deviato e il tubo a raggi catodici',
      testo: R`Che cosa succede se un elettrone veloce entra di traverso fra due piatti carichi? Il campo è perpendicolare alla sua velocità.

[[video:potenziale/deflessione]]

In orizzontale non c'è forza: l'elettrone conserva la velocità $v_0$ con cui è entrato. In verticale c'è la forza $e \cdot E$, costante, verso il piatto positivo. È come un sasso lanciato in orizzontale: moto uniforme in una direzione, accelerato nell'altra.

>* Fra i piatti l'elettrone si muove con $x = v_0 \cdot t$ e $y = \frac{1}{2} \cdot a \cdot t^2$, dove $a = \dfrac{e \cdot E}{m}$. La traiettoria è una **parabola**.

~ t = \dfrac{x}{v_0} :: dal moto orizzontale ricavo il tempo
~ y = \tfrac{1}{2} \cdot \dfrac{e \cdot E}{m} \cdot \dfrac{x^2}{v_0^2} :: lo metto nel moto verticale
~ y = \evidb{\dfrac{e \cdot E}{2 \cdot m \cdot v_0^2} \cdot x^2} :: $y$ proporzionale a $x^2$: una parabola

Fuori dai piatti il campo non c'è più. L'elettrone prosegue dritto, lungo la tangente alla parabola.

Il peso non conta niente. In un campo di $10^4\,\text{V/m}$ la forza elettrica sull'elettrone vale circa $1{,}6 \cdot 10^{-15}\,\text{N}$. Il suo peso è circa $8{,}9 \cdot 10^{-30}\,\text{N}$, cioè $1{,}8 \cdot 10^{14}$ volte più piccolo.

[[grafico:deflessione]]

Su questa idea funzionava il **tubo a raggi catodici** degli oscilloscopi. Un cannone elettronico lancia nel vuoto un fascio di elettroni: sono i «raggi catodici», perché escono dal catodo. Il fascio colpisce uno schermo coperto di una sostanza che si illumina. Una coppia di piatti sposta il fascio in orizzontale, un'altra in verticale. La deviazione è proporzionale alla tensione fra i piatti: il puntino «disegna» una tensione che cambia. Anche i vecchi televisori avevano un tubo così, ma lì il fascio lo deviavano delle bobine magnetiche.

>! L'elettrone è negativo: la forza su di lui è opposta al campo. Fra i piatti piega verso il piatto positivo, non verso quello negativo.

?? Mentre attraversa i piatti, che cosa succede alla velocità orizzontale dell'elettrone?
[x] resta uguale
[ ] cresce
[ ] diminuisce
=> In orizzontale non agisce nessuna forza: la componente orizzontale della velocità resta $v_0$. Cambia solo quella verticale.`
    }
  ],
  grafici: {
    /* il campo uniforme fra due piastre (cm): E = 1000 N/C, q = +4 μC all'altezza h sopra la piastra negativa.
       U = q·E·h = 4·10⁻⁶ · 1000 · h/100 J = 40·h μJ. La forza è la stessa in ogni punto: freccia di lunghezza fissa */
    'lavoro-piastre': {
      tipo: 'piano', x: [-4, 4], y: [-1, 6], assi: false, griglia: false, altezza: 520,
      parametri: [{ nome: 'h', min: 1.5, max: 4.5, passo: 0.5, valore: 3, decimali: 1, etichetta: 'h (cm)' }],
      elementi: [
        { tipo: 'poligono', punti: [[-3.8, 5], [3.8, 5], [3.8, 5.15], [-3.8, 5.15]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[-3.8, -0.15], [3.8, -0.15], [3.8, 0], [-3.8, 0]], colore: 'grigio' },
        { tipo: 'testo', p: [0, 5.45], testo: '+     +     +     +     +     +     +', colore: 4 },
        { tipo: 'testo', p: [0, -0.62], testo: '−     −     −     −     −     −     −', colore: 1 },
        { tipo: 'segmento', da: [-3.4, 4.85], a: [-3.4, 0.15], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [-2.6, 4.85], a: [-2.6, 0.15], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [-1.8, 4.85], a: [-1.8, 0.15], colore: 'grigio', freccia: true },
        { tipo: 'segmento', da: [3.6, 4.85], a: [3.6, 0.15], colore: 'grigio', freccia: true },
        { tipo: 'testo', p: [-3.0, 2.4], testo: 'E', colore: 'grigio' },
        { tipo: 'vettore', da: [-0.6, 'h - 0.35'], a: [-0.6, 'h - 1.35'], colore: 2, etichetta: 'F', posizione: 'destra' },
        { tipo: 'segmento', da: [0.4, 0], a: [0.4, 'h'], colore: 'grigio', tratteggio: true },
        { tipo: 'testo', p: [0.6, 'h/2'], testo: 'h = {{h|1}} cm', ancora: 'start' },
        { tipo: 'testo', p: [1.5, 4.2], testo: 'U = q·E·h = {{40*h|0}} μJ', colore: 3 }
      ].concat(caricaFissa(-0.6, 'h', +1)),
      didascalia: 'Due piastre cariche: il campo E fra loro è uniforme, 1000 N/C verso il basso. Una carica q = +4 μC sente la stessa forza F in ogni punto. Con lo zero sulla piastra negativa, la sua energia potenziale è U = q·E·h, come m·g·h per un sasso. Il cursore cambia l\'altezza della carica.'
    },
    /* V = k·Q/r con Q in nC e r in cm: V (volt) = 899·Q/r */
    'potenziale-carica': {
      tipo: 'piano', x: [0, 30], y: [-700, 700], passo: [5, 200], altezza: 480, etichette: { x: 'r (cm)', y: 'V (V)' },
      parametri: [
        { nome: 'Q', min: -3, max: 3, passo: 0.5, valore: 2, decimali: 1, etichetta: 'Q (nC)' },
        { nome: 'rp', min: 4, max: 15, passo: 1, valore: 6, etichetta: 'r (cm)' }
      ],
      funzioni: [{ f: '899*Q/x', dominio: [3.9, 27], colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: ['rp', 0], a: ['rp', '899*Q/rp'], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['2*rp', 0], a: ['2*rp', '899*Q/(2*rp)'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['rp', '899*Q/rp'], colore: 3 },
        { tipo: 'punto', p: ['2*rp', '899*Q/(2*rp)'], colore: 'grigio' },
        { tipo: 'testo', p: [29.4, 600], testo: 'a {{rp}} cm: V = {{899*Q/rp|0}} V', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [29.4, 500], testo: 'a {{2*rp}} cm: V = {{899*Q/(2*rp)|0}} V', ancora: 'end' }
      ],
      didascalia: 'Il potenziale attorno a una carica puntiforme Q, con lo zero all\'infinito: V = k·Q/r. Con Q positiva è positivo, con Q negativa è negativo. Il punto grigio è a distanza doppia: lì il potenziale è la metà. I cursori cambiano la carica e la distanza.'
    },
    /* carica Q (nC) al centro, lunghezze in cm: equipotenziali di 100, 200, 300 V a r = 899·Q/V cm.
       Una carica di prova q sull'equipotenziale dei 200 V: la forza è radiale, perpendicolare al cerchio */
    equipotenziali: {
      tipo: 'piano', x: [-20, 20], y: [-20, 20], assi: false, griglia: false, altezza: 590,
      parametri: [
        { nome: 'Q', min: 1.5, max: 2.1, passo: 0.1, valore: 2, decimali: 1, etichetta: 'Q (nC)' },
        { nome: 'th', min: 0, max: 360, passo: 15, valore: 30, etichetta: 'posizione di q (gradi)' }
      ],
      elementi: raggiera(2.1, 19.6, 60).concat([
        { tipo: 'cerchio', centro: [0, 0], raggio: '8.99*Q', colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: '4.495*Q', colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: '2.997*Q', colore: 3 },
        { tipo: 'testo', p: [0, '8.99*Q - 1.5'], testo: '100 V', colore: 3 },
        { tipo: 'testo', p: [0, '-4.495*Q + 1.5'], testo: '200 V', colore: 3 },
        { tipo: 'testo', p: [0, '2.997*Q - 1.5'], testo: '300 V', colore: 3 },
        { tipo: 'vettore', da: ['(4.495*Q + 0.9)*cos(th*pi/180)', '(4.495*Q + 0.9)*sin(th*pi/180)'],
          a: ['(4.495*Q + 5.4)*cos(th*pi/180)', '(4.495*Q + 5.4)*sin(th*pi/180)'], colore: 2, etichetta: 'F' },
        { tipo: 'punto', p: ['4.495*Q*cos(th*pi/180)', '4.495*Q*sin(th*pi/180)'], raggio: 7, colore: 4 }
      ]).concat(caricaFissa(0, 0, +1, 0.55)),
      didascalia: 'Una carica positiva Q e le sue equipotenziali di 100, 200 e 300 V (i cerchi verdi): a passi uguali di volt, sono più fitte vicino alla carica, dove il campo è più intenso. Le linee di campo, grigie, le tagliano ad angolo retto. La carica di prova q, sull\'equipotenziale dei 200 V, sente una forza F perpendicolare al cerchio: muovendosi lungo il cerchio il campo non fa lavoro. I cursori cambiano Q e la posizione di q.'
    },
    /* un condensatore da 4 μF: V = Q/4 (Q in μC). Energia = area = ½·Q·V = 2·V² μJ */
    'carica-condensatore': {
      tipo: 'piano', x: [0, 110], y: [0, 28], passo: [20, 5], altezza: 420, etichette: { x: 'Q (μC)', y: 'V (V)' },
      parametri: [{ nome: 'Vc', min: 0, max: 25, passo: 1, valore: 18, etichetta: 'tensione (V)' }],
      funzioni: [{ f: 'x/4', dominio: [0, 105], colore: 'grigio' }],
      elementi: [
        { tipo: 'area', f: 'x/4', da: 0, a: '4*Vc', colore: 3 },
        { tipo: 'segmento', da: ['4*Vc', 0], a: ['4*Vc', 'Vc'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['4*Vc', 'Vc'], colore: 3 },
        { tipo: 'testo', p: [52, 25.5], testo: 'U = ½·Q·V = {{2*Vc*Vc|0}} μJ', colore: 3 },
        { tipo: 'testo', p: [52, 22.3], testo: 'Q = {{4*Vc}} μC, V = {{Vc}} V' }
      ],
      didascalia: 'La carica di un condensatore da 4 μF: la tensione cresce in linea retta con la carica, V = Q/C. L\'area verde, un triangolo, è l\'energia immagazzinata: ½·Q·V. Con la tensione doppia il triangolo è largo il doppio e alto il doppio, e l\'energia diventa quattro volte tanto. Il cursore cambia la tensione finale.'
    },
    /* elettrone accelerato da fermo: v = √(2·e·ΔV/m) = 0,5927·10⁶·√ΔV m/s (e = 1,60·10⁻¹⁹ C, m = 9,11·10⁻³¹ kg) */
    cannone: {
      tipo: 'piano', x: [0, 2500], y: [0, 32], passo: [500, 5], altezza: 420, etichette: { x: 'ΔV (V)', y: 'v (10⁶ m/s)' },
      parametri: [{ nome: 'dV', min: 0, max: 2500, passo: 50, valore: 400, etichetta: 'ΔV (V)' }],
      funzioni: [{ f: '0.5927*sqrt(x)', colore: 1 }],
      elementi: [
        { tipo: 'segmento', da: ['dV', 0], a: ['dV', '0.5927*sqrt(dV)'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['dV', '0.5927*sqrt(dV)'], colore: 1 },
        { tipo: 'testo', p: [2450, 9], testo: 'E_c = {{dV}} eV', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [2450, 4.5], testo: 'v = {{0.5927*sqrt(dV)|1}}·10⁶ m/s', ancora: 'end', colore: 1 }
      ],
      didascalia: 'Un elettrone parte da fermo e attraversa la differenza di potenziale ΔV. L\'energia cinetica in elettronvolt è proprio ΔV; la velocità cresce come la radice di ΔV: con una tensione quattro volte più grande va al doppio. Fino a qualche migliaio di volt la formula classica va bene. Il cursore cambia la tensione.'
    },
    /* elettrone accelerato da 1000 V (v₀ ≈ 1,87·10⁷ m/s) fra piatti lunghi 5 cm, a 2 cm: x in cm, y in mm.
       y = V·x²/(4·d·V_acc) → 0,00125·V·x² mm; all'uscita 0,03125·V mm, pendenza 0,0125·V mm/cm; schermo a 12 cm */
    deflessione: {
      tipo: 'piano', x: [-2, 12.5], y: [-26, 26], assi: false, griglia: false, proporzioni: 'libere', altezza: 400,
      parametri: [{ nome: 'Vp', min: -200, max: 200, passo: 10, valore: 150, etichetta: 'tensione fra i piatti (V)' }],
      funzioni: [
        { f: 'se(x < 5, 0.00125*Vp*x^2, 0.03125*Vp + 0.0125*Vp*(x - 5))', dominio: [0, 12], colore: 'grigio' }
      ],
      elementi: [
        { tipo: 'poligono', punti: [[0, 10], [5, 10], [5, 11.2], [0, 11.2]], colore: 'grigio' },
        { tipo: 'poligono', punti: [[0, -10], [5, -10], [5, -11.2], [0, -11.2]], colore: 'grigio' },
        { tipo: 'testo', p: [2.5, 13.2], testo: '{{? Vp > 0 | +    +    +    + | }}', colore: 4 },
        { tipo: 'testo', p: [2.5, 13.2], testo: '{{? Vp < 0 | −    −    −    − | }}', colore: 1 },
        { tipo: 'testo', p: [2.5, -15.2], testo: '{{? Vp > 0 | −    −    −    − | }}', colore: 1 },
        { tipo: 'testo', p: [2.5, -15.2], testo: '{{? Vp < 0 | +    +    +    + | }}', colore: 4 },
        { tipo: 'segmento', da: [12, -25], a: [12, 25], colore: 'grigio' },
        { tipo: 'vettore', da: [-1.8, 0], a: [0, 0], colore: 1, etichetta: 'v_0' },
        { tipo: 'punto', p: [12, '0.11875*Vp'], raggio: 6, colore: 1 },
        { tipo: 'testo', p: [2.5, 20], testo: 'all\'uscita: {{0.03125*Vp|1}} mm' },
        { tipo: 'testo', p: [2.5, -22], testo: 'sullo schermo: {{0.11875*Vp|1}} mm' }
      ],
      didascalia: 'Un elettrone entra a 1,87·10⁷ m/s fra due piatti lunghi 5 cm e distanti 2 cm. Fra i piatti fa una parabola verso il piatto positivo; fuori va dritto fino allo schermo, la riga a destra. La scala verticale, in millimetri, è ingrandita. Con la tensione rovesciata il fascio piega dall\'altra parte; la deviazione è proporzionale alla tensione. Il cursore cambia la tensione fra i piatti.'
    }
  },
  esempi: [
    {
      titolo: 'Una carica che scende fra due piastre',
      problema: R`Fra due piastre cariche il campo è uniforme e vale 2500 N/C. Una carica di +3 μC si sposta di 4 cm nel verso del campo. Quanto lavoro fa il campo? Di quanto cambiano l'energia potenziale e il potenziale?`,
      passi: [
        R`Dati: $E = 2500\,\text{N/C}$, $q = 3\,\mu\text{C} = 3 \cdot 10^{-6}\,\text{C}$, $d = 4\,\text{cm} = 0{,}04\,\text{m}$. Cerco il lavoro $L$, la variazione $\Delta U$ e la differenza di potenziale $\Delta V$.`,
        R`La forza $q \cdot E$ è costante e parallela allo spostamento: $L = q \cdot E \cdot d = 3 \cdot 10^{-6} \cdot 2500 \cdot 0{,}04\,\text{J} = 3 \cdot 10^{-4}\,\text{J}$.`,
        R`Il lavoro del campo è l'energia potenziale persa: $\Delta U = -L = -3 \cdot 10^{-4}\,\text{J}$.`,
        R`La differenza di potenziale: $\Delta V = -\dfrac{L}{q} = -\dfrac{3 \cdot 10^{-4}\,\text{J}}{3 \cdot 10^{-6}\,\text{C}} = -100\,\text{V}$.`,
        R`Controllo con il campo uniforme: $E \cdot d = 2500\,\text{V/m} \cdot 0{,}04\,\text{m} = 100\,\text{V}$. Lungo il campo il potenziale scende, quindi il segno meno torna.`
      ],
      risultato: R`$L = 3 \cdot 10^{-4}\,\text{J}$, $\Delta U = -3 \cdot 10^{-4}\,\text{J}$, $\Delta V = -100\,\text{V}$`
    },
    {
      titolo: 'Il potenziale fra due cariche',
      problema: R`Una carica di +4 nC e una di −2 nC sono a 10 cm l'una dall'altra. Quanto vale il potenziale nel punto di mezzo? Quanto lavoro serve per portarci, piano piano, una carica di +1 nC che sta lontanissima?`,
      passi: [
        R`Dati: $Q_1 = 4 \cdot 10^{-9}\,\text{C}$, $Q_2 = -2 \cdot 10^{-9}\,\text{C}$, distanza di ciascuna dal punto $r = 0{,}05\,\text{m}$, $q = 1 \cdot 10^{-9}\,\text{C}$. Cerco il potenziale $V$ e il lavoro esterno $L_{est}$.`,
        R`Il potenziale della prima carica: $V_1 = \dfrac{8{,}99 \cdot 10^9 \cdot 4 \cdot 10^{-9}}{0{,}05}\,\text{V} \approx 719\,\text{V}$.`,
        R`Quello della seconda ha il segno meno e metà valore: $V_2 \approx -360\,\text{V}$.`,
        R`I potenziali si sommano con il loro segno: $V = V_1 + V_2 \approx 360\,\text{V}$.`,
        R`Lontanissimo il potenziale è zero. Il lavoro esterno per portare lì la carica è l'aumento della sua energia potenziale: $L_{est} = q \cdot V = 10^{-9} \cdot 360\,\text{J} \approx 3{,}6 \cdot 10^{-7}\,\text{J}$.`,
        R`Controllo: la carica negativa è la metà di quella positiva, alla stessa distanza, quindi $V = V_1 - V_1/2 = V_1/2 \approx 360\,\text{V}$. Torna. Il campo lì invece non è zero: i due campi puntano verso la carica negativa e si sommano.`
      ],
      risultato: R`$V \approx 360\,\text{V}$; servono circa $3{,}6 \cdot 10^{-7}\,\text{J}$`
    },
    {
      titolo: 'Un condensatore piano',
      problema: R`Un condensatore piano ha armature di 200 cm², a 0,5 mm di distanza, con aria in mezzo. Viene collegato a una pila da 9 V. Quanto valgono la capacità, la carica, l'energia immagazzinata e il campo fra le armature?`,
      passi: [
        R`Dati: $S = 200\,\text{cm}^2 = 0{,}02\,\text{m}^2$, $d = 0{,}5\,\text{mm} = 5 \cdot 10^{-4}\,\text{m}$, $V = 9\,\text{V}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{F/m}$. Cerco $C$, $Q$, $U$ ed $E$.`,
        R`La capacità: $C = \dfrac{\varepsilon_0 \cdot S}{d} = \dfrac{8{,}85 \cdot 10^{-12} \cdot 0{,}02}{5 \cdot 10^{-4}}\,\text{F} \approx 3{,}54 \cdot 10^{-10}\,\text{F}$, cioè 354 pF.`,
        R`La carica: $Q = C \cdot V = 3{,}54 \cdot 10^{-10}\,\text{F} \cdot 9\,\text{V} \approx 3{,}2 \cdot 10^{-9}\,\text{C}$, circa 3,2 nC.`,
        R`L'energia: $U = \tfrac{1}{2} \cdot C \cdot V^2 = \tfrac{1}{2} \cdot 3{,}54 \cdot 10^{-10} \cdot 81\,\text{J} \approx 1{,}4 \cdot 10^{-8}\,\text{J}$.`,
        R`Il campo, uniforme: $E = \dfrac{V}{d} = \dfrac{9\,\text{V}}{5 \cdot 10^{-4}\,\text{m}} = 18\,000\,\text{V/m}$.`,
        R`Controllo con Gauss: $E = \dfrac{Q}{\varepsilon_0 \cdot S} = \dfrac{3{,}19 \cdot 10^{-9}}{8{,}85 \cdot 10^{-12} \cdot 0{,}02}\,\text{V/m} \approx 18\,000\,\text{V/m}$. Torna.`
      ],
      risultato: R`$C \approx 354\,\text{pF}$, $Q \approx 3{,}2\,\text{nC}$, $U \approx 1{,}4 \cdot 10^{-8}\,\text{J}$, $E = 1{,}8 \cdot 10^4\,\text{V/m}$`
    },
    {
      titolo: 'Tre condensatori, serie e parallelo',
      problema: R`Due condensatori da 2 μF e da 4 μF sono in parallelo. Il gruppo è in serie con un condensatore da 3 μF, e tutto è collegato a 9 V. Quanto valgono la capacità equivalente, la carica e la tensione di ogni condensatore?`,
      passi: [
        R`Dati: $C_1 = 2\,\mu\text{F}$, $C_2 = 4\,\mu\text{F}$ in parallelo; $C_3 = 3\,\mu\text{F}$ in serie; $V = 9\,\text{V}$. Cerco $C$, le cariche e le tensioni.`,
        R`Il parallelo: $C_{12} = C_1 + C_2 = 6\,\mu\text{F}$.`,
        R`La serie con $C_3$: $\dfrac{1}{C} = \dfrac{1}{6} + \dfrac{1}{3} = \dfrac{3}{6}$, quindi $C = 2\,\mu\text{F}$.`,
        R`La carica fornita dalla pila: $Q = C \cdot V = 2\,\mu\text{F} \cdot 9\,\text{V} = 18\,\mu\text{C}$. In serie è la stessa per $C_3$ e per il gruppo.`,
        R`Le tensioni: $V_3 = \dfrac{18\,\mu\text{C}}{3\,\mu\text{F}} = 6\,\text{V}$ e $V_{12} = \dfrac{18\,\mu\text{C}}{6\,\mu\text{F}} = 3\,\text{V}$. Somma: 9 V, come la pila.`,
        R`Nel parallelo la tensione è la stessa, 3 V: $Q_1 = 2\,\mu\text{F} \cdot 3\,\text{V} = 6\,\mu\text{C}$ e $Q_2 = 4\,\mu\text{F} \cdot 3\,\text{V} = 12\,\mu\text{C}$. Controllo: $6 + 12 = 18\,\mu\text{C}$. Torna.`
      ],
      risultato: R`$C = 2\,\mu\text{F}$; $Q_3 = 18\,\mu\text{C}$ a 6 V; $Q_1 = 6\,\mu\text{C}$ e $Q_2 = 12\,\mu\text{C}$ a 3 V`
    },
    {
      titolo: 'Un protone accelerato',
      problema: R`Un protone parte da fermo e attraversa una differenza di potenziale di 2000 V. Quanta energia cinetica acquista, in elettronvolt e in joule? A che velocità arriva? La massa del protone è $1{,}67 \cdot 10^{-27}\,\text{kg}$.`,
      passi: [
        R`Dati: $q = e = 1{,}60 \cdot 10^{-19}\,\text{C}$, $\Delta V = 2000\,\text{V}$, $m = 1{,}67 \cdot 10^{-27}\,\text{kg}$, $v_0 = 0$. Cerco l'energia cinetica $E_c$ e la velocità $v$.`,
        R`Il protone ha la stessa carica dell'elettrone, positiva. Ogni volt gli dà un elettronvolt: $E_c = 2000\,\text{eV}$.`,
        R`In joule: $E_c = 2000 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} = 3{,}2 \cdot 10^{-16}\,\text{J}$.`,
        R`Dalla conservazione dell'energia: $v = \sqrt{\dfrac{2 \cdot E_c}{m}} = \sqrt{\dfrac{6{,}4 \cdot 10^{-16}}{1{,}67 \cdot 10^{-27}}}\,\text{m/s} \approx 6{,}2 \cdot 10^5\,\text{m/s}$.`,
        R`Controllo: $\tfrac{1}{2} \cdot 1{,}67 \cdot 10^{-27}\,\text{kg} \cdot (6{,}2 \cdot 10^5\,\text{m/s})^2 \approx 3{,}2 \cdot 10^{-16}\,\text{J}$. Torna.`
      ],
      risultato: R`$E_c = 2000\,\text{eV} = 3{,}2 \cdot 10^{-16}\,\text{J}$; $v \approx 6{,}2 \cdot 10^5\,\text{m/s}$`
    },
    {
      titolo: 'Un elettrone fra i piatti',
      problema: R`Un elettrone entra a $2{,}0 \cdot 10^7\,\text{m/s}$, parallelo ai piatti, fra due piatti lunghi 4 cm e distanti 1 cm. Fra i piatti c'è una tensione di 50 V. Di quanto è deviato quando esce? Con che angolo esce?`,
      passi: [
        R`Dati: $v_0 = 2{,}0 \cdot 10^7\,\text{m/s}$, lunghezza dei piatti $\ell = 0{,}04\,\text{m}$, distanza $d = 0{,}01\,\text{m}$, $\Delta V = 50\,\text{V}$, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$, $m = 9{,}11 \cdot 10^{-31}\,\text{kg}$. Cerco la deviazione $y$ e l'angolo d'uscita.`,
        R`Il campo fra i piatti: $E = \dfrac{\Delta V}{d} = \dfrac{50\,\text{V}}{0{,}01\,\text{m}} = 5000\,\text{V/m}$.`,
        R`L'accelerazione verticale: $a = \dfrac{e \cdot E}{m} = \dfrac{1{,}60 \cdot 10^{-19} \cdot 5000}{9{,}11 \cdot 10^{-31}}\,\text{m/s}^2 \approx 8{,}8 \cdot 10^{14}\,\text{m/s}^2$.`,
        R`Il tempo fra i piatti, dal moto orizzontale: $t = \dfrac{\ell}{v_0} = \dfrac{0{,}04}{2{,}0 \cdot 10^7}\,\text{s} = 2{,}0 \cdot 10^{-9}\,\text{s}$.`,
        R`La deviazione: $y = \tfrac{1}{2} \cdot a \cdot t^2 = \tfrac{1}{2} \cdot 8{,}8 \cdot 10^{14} \cdot 4 \cdot 10^{-18}\,\text{m} \approx 1{,}8 \cdot 10^{-3}\,\text{m}$, cioè 1,8 mm, verso il piatto positivo.`,
        R`L'angolo: la velocità verticale all'uscita è $a \cdot t \approx 1{,}76 \cdot 10^6\,\text{m/s}$. Quindi $\tan\alpha = \dfrac{1{,}76 \cdot 10^6}{2{,}0 \cdot 10^7} \approx 0{,}088$, e $\alpha \approx 5°$.`,
        R`Controllo: $1{,}8\,\text{mm}$ è meno dei 5 mm che separano l'asse da un piatto. L'elettrone esce senza toccare i piatti.`
      ],
      risultato: R`$y \approx 1{,}8\,\text{mm}$ verso il piatto positivo; esce inclinato di circa $5°$`
    }
  ],
  formulario: [
    { nome: 'Lavoro del campo ed energia potenziale', formula: R`L = -\Delta U \qquad U = q \cdot E \cdot h`, nota: R`$U$ è l'energia potenziale elettrica ($E_p$ in meccanica). La seconda vale nel campo uniforme, con lo zero sulla piastra negativa e $h$ contata lungo il campo.` },
    { nome: 'Potenziale elettrico', formula: R`V = \dfrac{U}{q} \qquad 1\,\text{V} = 1\,\text{J/C}`, nota: R`È un numero, non un vettore. Lo zero si sceglie; contano le differenze.` },
    { nome: 'Differenza di potenziale e lavoro', formula: R`\Delta V = V_B - V_A = -\dfrac{L}{q}`, nota: R`$L$ è il lavoro del campo da A a B. Il lavoro di chi sposta la carica piano piano è $q \cdot \Delta V$.` },
    { nome: 'Campo uniforme', formula: R`\Delta V = E \cdot d \qquad E = \dfrac{\Delta V}{d}`, nota: R`In modulo, con $d$ misurato lungo il campo. $1\,\text{V/m} = 1\,\text{N/C}$.` },
    { nome: 'Potenziale di una carica puntiforme', formula: R`V = \dfrac{k \cdot Q}{r}`, nota: R`Zero all'infinito; $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$. Con più cariche i potenziali si sommano con il segno.` },
    { nome: 'Energia potenziale di due cariche', formula: R`U = \dfrac{k \cdot q_1 \cdot q_2}{r}`, nota: R`Positiva con cariche dello stesso segno, negativa con segni opposti.` },
    { nome: 'Capacità', formula: R`C = \dfrac{Q}{V} \qquad 1\,\text{F} = 1\,\text{C/V}`, nota: R`$Q$ è la carica di un'armatura, $V$ la tensione fra le due.` },
    { nome: 'Condensatore piano', formula: R`C = \dfrac{\varepsilon_0 \cdot S}{d}`, nota: R`$\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{F/m}$. Con un isolante in mezzo si moltiplica per $\varepsilon_r$.` },
    { nome: 'Energia del condensatore', formula: R`U = \tfrac{1}{2} \cdot Q \cdot V \qquad U = \tfrac{1}{2} \cdot C \cdot V^2`, nota: R`È l'area sotto la retta del grafico tensione–carica.` },
    { nome: 'Condensatori in parallelo', formula: R`C = C_1 + C_2`, nota: R`Stessa tensione per tutti; le cariche si sommano.` },
    { nome: 'Condensatori in serie', formula: R`\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2}`, nota: R`Stessa carica per tutti; le tensioni si sommano. $C$ è minore della capacità più piccola.` },
    { nome: 'Carica accelerata da ferma', formula: R`\tfrac{1}{2} \cdot m \cdot v^2 = q \cdot \Delta V`, nota: R`In modulo. Vale qualunque sia la forma del campo.` },
    { nome: 'Elettronvolt', formula: R`1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}`, nota: R`L'energia di un elettrone che attraversa 1 V.` },
    { nome: 'Elettrone fra due piatti', formula: R`x = v_0 \cdot t \qquad y = \tfrac{1}{2} \cdot a \cdot t^2`, nota: R`Con $a = \dfrac{e \cdot E}{m}$: una parabola. Il peso è trascurabile.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'lavoro-elettrico', tipo: 'concetto', fronte: R`Che cosa vuol dire che la forza elettrostatica è **conservativa**?`, retro: R`Che il suo lavoro dipende solo dai punti di partenza e di arrivo, non dalla strada. Per questo esiste l'energia potenziale $U$, con $L = -\Delta U$.` },
    { id: 'fc-02', sezione: 'lavoro-elettrico', tipo: 'formula', fronte: R`Energia potenziale di una carica nel **campo uniforme**`, retro: R`$U = q \cdot E \cdot h$, con lo zero sulla piastra negativa e $h$ l'altezza sopra di essa. È l'analogo di $m \cdot g \cdot h$.` },
    { id: 'fc-03', sezione: 'potenziale', tipo: 'definizione', fronte: R`Che cos'è il **potenziale elettrico** in un punto?`, retro: R`L'energia potenziale per ogni coulomb: $V = U/q$. Si misura in volt, $1\,\text{V} = 1\,\text{J/C}$.` },
    { id: 'fc-04', sezione: 'potenziale', tipo: 'formula', fronte: R`Legame fra il lavoro del campo e la **differenza di potenziale**`, retro: R`$\Delta V = V_B - V_A = -\dfrac{L}{q}$, con $L$ lavoro del campo sulla carica che va da A a B.` },
    { id: 'fc-05', sezione: 'potenziale', tipo: 'concetto', fronte: R`Lasciata libera, verso dove va una carica positiva? E una negativa?`, retro: R`La positiva verso il potenziale più basso, come un sasso che cade. La negativa verso il potenziale più alto.` },
    { id: 'fc-06', sezione: 'potenziale', tipo: 'concetto', fronte: R`Dove sta lo **zero** del potenziale?`, retro: R`Dove lo si sceglie. Cambiando lo zero cambiano tutti i valori, ma non le differenze di potenziale, che sono quelle che contano.` },
    { id: 'fc-07', sezione: 'potenziale', tipo: 'formula', fronte: R`Differenza di potenziale nel **campo uniforme**`, retro: R`$\Delta V = E \cdot d$ in modulo, con $d$ lungo il campo. Per questo il campo si misura anche in V/m.` },
    { id: 'fc-08', sezione: 'carica-puntiforme', tipo: 'formula', fronte: R`Potenziale di una **carica puntiforme**`, retro: R`$V = \dfrac{k \cdot Q}{r}$, con lo zero all'infinito. Ha il segno della carica.` },
    { id: 'fc-09', sezione: 'carica-puntiforme', tipo: 'procedura', fronte: R`Come si trova il potenziale creato da più cariche?`, retro: R`Si calcola il potenziale di ciascuna e si sommano i numeri con il loro segno. Niente vettori.` },
    { id: 'fc-10', sezione: 'carica-puntiforme', tipo: 'formula', fronte: R`Energia potenziale di **due cariche** puntiformi`, retro: R`$U = \dfrac{k \cdot q_1 \cdot q_2}{r}$: positiva con lo stesso segno, negativa con segni opposti.` },
    { id: 'fc-11', sezione: 'equipotenziali', tipo: 'definizione', fronte: R`Che cos'è una **superficie equipotenziale**?`, retro: R`L'insieme dei punti con lo stesso potenziale. Per una carica puntiforme è una sfera, fra due piastre un piano.` },
    { id: 'fc-12', sezione: 'equipotenziali', tipo: 'concetto', fronte: R`Perché le equipotenziali sono **perpendicolari** alle linee di campo?`, retro: R`Lungo un'equipotenziale $\Delta V = 0$ e il campo non fa lavoro: la forza deve essere perpendicolare allo spostamento.` },
    { id: 'fc-13', sezione: 'equipotenziali', tipo: 'concetto', fronte: R`Equipotenziali disegnate a passi uguali di volt: che cosa vuol dire se sono **fitte**?`, retro: R`Che il campo è intenso. Il suo modulo è $E = \Delta V / \Delta s$, e punta verso i potenziali più bassi.` },
    { id: 'fc-14', sezione: 'equipotenziali', tipo: 'concetto', fronte: R`Che potenziale ha un **conduttore** in equilibrio?`, retro: R`Lo stesso in ogni punto: dentro il campo è zero. La sua superficie è un'equipotenziale.` },
    { id: 'fc-15', sezione: 'condensatore', tipo: 'definizione', fronte: R`Che cos'è la **capacità** di un condensatore?`, retro: R`Il rapporto fra la carica di un'armatura e la tensione: $C = Q/V$. Si misura in farad, $1\,\text{F} = 1\,\text{C/V}$.` },
    { id: 'fc-16', sezione: 'condensatore', tipo: 'formula', fronte: R`Capacità del **condensatore piano** nel vuoto`, retro: R`$C = \dfrac{\varepsilon_0 \cdot S}{d}$, con $S$ area di un'armatura e $d$ distanza; $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{F/m}$.` },
    { id: 'fc-17', sezione: 'condensatore', tipo: 'concetto', fronte: R`Che cosa fa un **isolante** messo fra le armature?`, retro: R`Aumenta la capacità: $C = \varepsilon_r \cdot \varepsilon_0 \cdot S / d$, con $\varepsilon_r$ costante dielettrica relativa del materiale.` },
    { id: 'fc-18', sezione: 'energia-condensatore', tipo: 'formula', fronte: R`Energia immagazzinata in un **condensatore**`, retro: R`$U = \frac{1}{2} \cdot Q \cdot V = \frac{1}{2} \cdot C \cdot V^2$: l'area sotto la retta tensione–carica.` },
    { id: 'fc-19', sezione: 'energia-condensatore', tipo: 'concetto', fronte: R`Perché nell'energia del condensatore c'è il fattore $\frac{1}{2}$?`, retro: R`Perché la tensione cresce da 0 a $V$ durante la carica: in media ogni carica sale di $V/2$.` },
    { id: 'fc-20', sezione: 'serie-parallelo', tipo: 'formula', fronte: R`Condensatori in **parallelo**`, retro: R`Stessa tensione, cariche che si sommano: $C = C_1 + C_2 + \dots$` },
    { id: 'fc-21', sezione: 'serie-parallelo', tipo: 'formula', fronte: R`Condensatori in **serie**`, retro: R`Stessa carica, tensioni che si sommano: $\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \dots$, minore della capacità più piccola.` },
    { id: 'fc-22', sezione: 'cariche-accelerate', tipo: 'formula', fronte: R`Energia di una carica accelerata da ferma da una differenza di potenziale`, retro: R`$\frac{1}{2} \cdot m \cdot v^2 = q \cdot \Delta V$, in modulo. Conta solo $\Delta V$, non la forma del campo.` },
    { id: 'fc-23', sezione: 'cariche-accelerate', tipo: 'definizione', fronte: R`Che cos'è un **elettronvolt**?`, retro: R`L'energia che acquista un elettrone attraversando 1 V: $1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$.` },
    { id: 'fc-24', sezione: 'deflessione', tipo: 'concetto', fronte: R`Che strada fa un elettrone che entra di traverso fra due piatti carichi?`, retro: R`Una parabola verso il piatto positivo: moto uniforme lungo i piatti, accelerato verso il piatto. Il peso è trascurabile.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Il campo è uniforme e vale 200 N/C. Una carica di +8 μC si sposta di 5 cm nel verso del campo. Quanto lavoro fa il campo?`, suggerimenti: [R`La forza è $q \cdot E$, parallela allo spostamento: $L = q \cdot E \cdot d$.`, R`Carica in coulomb, distanza in metri.`], risposta: { tipo: 'numero', valore: 8e-5, unita: 'J' }, soluzione: [R`$L = 8 \cdot 10^{-6}\,\text{C} \cdot 200\,\text{N/C} \cdot 0{,}05\,\text{m} = 8 \cdot 10^{-5}\,\text{J}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`In un punto il potenziale vale 40 V. Quanta energia potenziale ha una carica di +5 μC messa lì?`, suggerimenti: [R`Da $V = U/q$ ricava $U$.`], risposta: { tipo: 'numero', valore: 2e-4, unita: 'J' }, soluzione: [R`$U = q \cdot V = 5 \cdot 10^{-6}\,\text{C} \cdot 40\,\text{V} = 2 \cdot 10^{-4}\,\text{J}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Una carica di 8 nC, in un certo punto, ha un'energia potenziale di $4 \cdot 10^{-6}\,\text{J}$. Quanto vale il potenziale in quel punto?`, suggerimenti: [R`Il potenziale è l'energia potenziale per coulomb.`], risposta: { tipo: 'numero', valore: 500, unita: 'V' }, soluzione: [R`$V = \dfrac{U}{q} = \dfrac{4 \cdot 10^{-6}\,\text{J}}{8 \cdot 10^{-9}\,\text{C}} = 500\,\text{V}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Una carica di +6 μC va piano piano da un punto a 30 V a un punto a 100 V. Quanto lavoro deve fare la forza esterna che la sposta?`, suggerimenti: [R`Il lavoro esterno è l'aumento di energia potenziale: $q \cdot \Delta V$.`], risposta: { tipo: 'numero', valore: 4.2e-4, unita: 'J' }, soluzione: [R`$\Delta V = 100 - 30 = 70\,\text{V}$.`, R`$L_{est} = q \cdot \Delta V = 6 \cdot 10^{-6}\,\text{C} \cdot 70\,\text{V} = 4{,}2 \cdot 10^{-4}\,\text{J}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Due piastre parallele distano 6 mm e fra loro c'è una tensione di 24 V. Quanto vale il campo elettrico fra le piastre?`, suggerimenti: [R`Nel campo uniforme $E = \Delta V / d$.`, R`La distanza in metri: $6\,\text{mm} = 0{,}006\,\text{m}$.`], risposta: { tipo: 'numero', valore: 4000, unita: 'V/m' }, soluzione: [R`$E = \dfrac{24\,\text{V}}{0{,}006\,\text{m}} = 4000\,\text{V/m}$, cioè 4000 N/C.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Il campo è uniforme e vale 800 V/m. Due punti distano 2,5 cm lungo il campo. Quanto vale la differenza di potenziale fra loro, in modulo?`, suggerimenti: [R`$\Delta V = E \cdot d$.`], risposta: { tipo: 'numero', valore: 20, unita: 'V' }, soluzione: [R`$\Delta V = 800\,\text{V/m} \cdot 0{,}025\,\text{m} = 20\,\text{V}$. Andando nel verso del campo il potenziale scende di 20 V.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`Quanto vale il potenziale a 45 cm da una carica puntiforme di +6 nC, con lo zero all'infinito?`, suggerimenti: [R`$V = k \cdot Q / r$, con $k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$.`], risposta: { tipo: 'numero', valore: 120, unita: 'V' }, soluzione: [R`$V = \dfrac{8{,}99 \cdot 10^9 \cdot 6 \cdot 10^{-9}}{0{,}45}\,\text{V} \approx 120\,\text{V}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Quanto vale il potenziale a 20 cm da una carica puntiforme di −4 nC, con lo zero all'infinito?`, suggerimenti: [R`$V = k \cdot Q / r$: la carica va con il suo segno.`], risposta: { tipo: 'numero', valore: -180, unita: 'V' }, soluzione: [R`$V = \dfrac{8{,}99 \cdot 10^9 \cdot (-4 \cdot 10^{-9})}{0{,}20}\,\text{V} \approx -180\,\text{V}$: negativo, come la carica.`] },
    { id: 'b-09', livello: 'base', difficolta: 2, testo: R`Due cariche di +2 μC e +3 μC sono a 60 cm l'una dall'altra. Quanto vale la loro energia potenziale?`, suggerimenti: [R`$U = k \cdot q_1 \cdot q_2 / r$.`, R`Il prodotto delle cariche è $6 \cdot 10^{-12}\,\text{C}^2$.`], risposta: { tipo: 'numero', valore: 0.0899, unita: 'J' }, soluzione: [R`$U = \dfrac{8{,}99 \cdot 10^9 \cdot 2 \cdot 10^{-6} \cdot 3 \cdot 10^{-6}}{0{,}60}\,\text{J} \approx 0{,}090\,\text{J}$.`, R`È positiva: le cariche hanno lo stesso segno, e per avvicinarle è servito lavoro.`] },
    { id: 'b-10', livello: 'base', difficolta: 2, testo: R`Una carica di +5 μC, lasciata libera, va da un punto a 90 V a un punto a 40 V. Partiva da ferma. Quanta energia cinetica ha acquistato?`, suggerimenti: [R`L'energia cinetica guadagnata è l'energia potenziale persa.`, R`$\Delta U = q \cdot \Delta V$.`], risposta: { tipo: 'numero', valore: 2.5e-4, unita: 'J' }, soluzione: [R`$\Delta V = 40 - 90 = -50\,\text{V}$, quindi $\Delta U = 5 \cdot 10^{-6} \cdot (-50)\,\text{J} = -2{,}5 \cdot 10^{-4}\,\text{J}$.`, R`L'energia potenziale persa diventa cinetica: $E_c = 2{,}5 \cdot 10^{-4}\,\text{J}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Un condensatore da 5 μF è collegato a 20 V. Quanta carica ha su ogni armatura?`, suggerimenti: [R`$Q = C \cdot V$.`], risposta: { tipo: 'numero', valore: 1e-4, unita: 'C' }, soluzione: [R`$Q = 5 \cdot 10^{-6}\,\text{F} \cdot 20\,\text{V} = 10^{-4}\,\text{C} = 100\,\mu\text{C}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un condensatore prende una carica di 30 μC quando è collegato a 15 V. Qual è la sua capacità?`, suggerimenti: [R`$C = Q/V$.`], risposta: { tipo: 'numero', valore: 2e-6, unita: 'F' }, soluzione: [R`$C = \dfrac{30 \cdot 10^{-6}\,\text{C}}{15\,\text{V}} = 2 \cdot 10^{-6}\,\text{F} = 2\,\mu\text{F}$.`] },
    { id: 'b-13', livello: 'base', difficolta: 2, testo: R`Un condensatore piano ha armature di $0{,}5\,\text{m}^2$, a 2 mm di distanza, nel vuoto. Qual è la sua capacità?`, suggerimenti: [R`$C = \varepsilon_0 \cdot S / d$, con $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\text{F/m}$.`], risposta: { tipo: 'numero', valore: 2.21e-9, unita: 'F' }, soluzione: [R`$C = \dfrac{8{,}85 \cdot 10^{-12} \cdot 0{,}5}{0{,}002}\,\text{F} \approx 2{,}2 \cdot 10^{-9}\,\text{F}$, cioè circa 2,2 nF.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Quanta energia immagazzina un condensatore da 20 μF caricato a 100 V?`, suggerimenti: [R`$U = \frac{1}{2} \cdot C \cdot V^2$.`], risposta: { tipo: 'numero', valore: 0.1, unita: 'J' }, soluzione: [R`$U = \tfrac{1}{2} \cdot 20 \cdot 10^{-6}\,\text{F} \cdot (100\,\text{V})^2 = 10^{-5} \cdot 10^4\,\text{J} = 0{,}1\,\text{J}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Un condensatore ha una carica di 6 μC e una tensione di 30 V. Quanta energia immagazzina?`, suggerimenti: [R`$U = \frac{1}{2} \cdot Q \cdot V$.`], risposta: { tipo: 'numero', valore: 9e-5, unita: 'J' }, soluzione: [R`$U = \tfrac{1}{2} \cdot 6 \cdot 10^{-6}\,\text{C} \cdot 30\,\text{V} = 9 \cdot 10^{-5}\,\text{J}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Due condensatori da 2,2 μF e da 4,7 μF sono collegati in parallelo. Quanto vale la capacità equivalente?`, suggerimenti: [R`In parallelo le capacità si sommano.`], risposta: { tipo: 'numero', valore: 6.9e-6, unita: 'F' }, soluzione: [R`$C = 2{,}2\,\mu\text{F} + 4{,}7\,\mu\text{F} = 6{,}9\,\mu\text{F}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Due condensatori da 5 μF e da 20 μF sono collegati in serie. Quanto vale la capacità equivalente?`, suggerimenti: [R`In serie si sommano gli inversi.`, R`$\frac{1}{5} + \frac{1}{20} = \frac{5}{20}$.`], risposta: { tipo: 'numero', valore: 4e-6, unita: 'F' }, soluzione: [R`$\dfrac{1}{C} = \dfrac{1}{5} + \dfrac{1}{20} = \dfrac{4 + 1}{20} = \dfrac{1}{4}$, quindi $C = 4\,\mu\text{F}$: meno del più piccolo.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Due condensatori in serie hanno ciascuno una carica di 30 μC. Il primo ha capacità 6 μF. Quanto vale la tensione ai suoi capi?`, suggerimenti: [R`In serie la carica è la stessa; per ciascuno $V = Q/C$.`], risposta: { tipo: 'numero', valore: 5, unita: 'V' }, soluzione: [R`$V_1 = \dfrac{Q}{C_1} = \dfrac{30\,\mu\text{C}}{6\,\mu\text{F}} = 5\,\text{V}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un elettrone parte da fermo e attraversa una differenza di potenziale di 250 V. Quanta energia cinetica acquista, in joule?`, suggerimenti: [R`Ogni volt dà un elettronvolt.`, R`$1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$.`], risposta: { tipo: 'numero', valore: 4e-17, unita: 'J' }, soluzione: [R`$E_c = 250\,\text{eV} = 250 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} = 4 \cdot 10^{-17}\,\text{J}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Un elettrone si trova in un campo elettrico uniforme di 3000 N/C. Quanto vale il modulo della forza su di lui?`, suggerimenti: [R`$F = e \cdot E$, con $e = 1{,}60 \cdot 10^{-19}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 4.8e-16, unita: 'N' }, soluzione: [R`$F = 1{,}60 \cdot 10^{-19}\,\text{C} \cdot 3000\,\text{N/C} = 4{,}8 \cdot 10^{-16}\,\text{N}$, opposta al campo.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Una carica di +8 nC è ferma. Quanto lavoro serve per portare piano piano una carica di +2 nC da lontanissimo fino a 6 cm da lei?`, suggerimenti: [R`Calcola il potenziale a 6 cm, con lo zero all'infinito.`, R`Il lavoro esterno è $q \cdot \Delta V$.`], risposta: { tipo: 'numero', valore: 2.4e-6, unita: 'J' }, soluzione: [R`$V = \dfrac{8{,}99 \cdot 10^9 \cdot 8 \cdot 10^{-9}}{0{,}06}\,\text{V} \approx 1200\,\text{V}$.`, R`$L_{est} = q \cdot (V - 0) = 2 \cdot 10^{-9} \cdot 1200\,\text{J} \approx 2{,}4 \cdot 10^{-6}\,\text{J}$. È positivo: le due cariche si respingono.`] },
    { id: 'es-02', difficolta: 3, testo: R`Una carica di +5 nC sta nell'origine, una di −3 nC a 40 cm, sull'asse $x$. In quale punto fra le due il potenziale è zero? Dai la distanza dalla carica positiva.`, suggerimenti: [R`Chiama $x$ la distanza dalla carica positiva: dall'altra la distanza è $0{,}40 - x$.`, R`$\dfrac{k \cdot 5}{x} = \dfrac{k \cdot 3}{0{,}40 - x}$: $k$ e i nanocoulomb si semplificano.`], risposta: { tipo: 'numero', valore: 25, unita: 'cm' }, soluzione: [R`$V = 0$ quando $\dfrac{5}{x} = \dfrac{3}{0{,}40 - x}$.`, R`$5 \cdot (0{,}40 - x) = 3 \cdot x \Rightarrow 2 = 8 \cdot x \Rightarrow x = 0{,}25\,\text{m}$.`, R`Il punto è a 25 cm dalla carica positiva, 15 cm da quella negativa: più vicino alla carica più piccola.`] },
    { id: 'es-03', difficolta: 2, testo: R`Un elettrone parte da fermo vicino al piatto negativo e arriva a quello positivo. Fra i piatti c'è una tensione di 90 V. A che velocità arriva?`, suggerimenti: [R`L'energia cinetica è $e \cdot \Delta V$.`, R`$v = \sqrt{2 \cdot e \cdot \Delta V / m}$, con $m = 9{,}11 \cdot 10^{-31}\,\text{kg}$.`], risposta: { tipo: 'numero', valore: 5.62e6, unita: 'm/s' }, soluzione: [R`$E_c = 90\,\text{eV} = 90 \cdot 1{,}60 \cdot 10^{-19}\,\text{J} = 1{,}44 \cdot 10^{-17}\,\text{J}$.`, R`$v = \sqrt{\dfrac{2 \cdot 1{,}44 \cdot 10^{-17}}{9{,}11 \cdot 10^{-31}}}\,\text{m/s} \approx 5{,}6 \cdot 10^6\,\text{m/s}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un condensatore piano da 3 μF viene caricato a 40 V e poi staccato dalla pila. Poi le armature vengono allontanate fino al triplo della distanza. Quanta energia immagazzina alla fine?`, suggerimenti: [R`Staccato dalla pila, il condensatore conserva la sua carica.`, R`Con la distanza tripla la capacità diventa un terzo, e la tensione $Q/C$ triplica.`], risposta: { tipo: 'numero', valore: 7.2e-3, unita: 'J' }, soluzione: [R`La carica, che resta: $Q = 3\,\mu\text{F} \cdot 40\,\text{V} = 120\,\mu\text{C}$.`, R`Alla fine $C = 1\,\mu\text{F}$ e $V = \dfrac{120\,\mu\text{C}}{1\,\mu\text{F}} = 120\,\text{V}$.`, R`$U = \tfrac{1}{2} \cdot Q \cdot V = \tfrac{1}{2} \cdot 120 \cdot 10^{-6} \cdot 120\,\text{J} = 7{,}2 \cdot 10^{-3}\,\text{J}$, il triplo dei $2{,}4 \cdot 10^{-3}\,\text{J}$ iniziali.`, R`L'energia in più viene dal lavoro fatto per allontanare le armature, che si attirano.`] },
    { id: 'es-05', difficolta: 3, testo: R`Un condensatore da 1 μF e uno da 3 μF sono in parallelo. Il gruppo è in serie con un condensatore da 12 μF, e tutto è collegato a 28 V. Quanta carica ha il condensatore da 1 μF?`, suggerimenti: [R`Prima il parallelo, poi la serie: trova la capacità equivalente e la carica fornita dalla pila.`, R`La carica del gruppo in parallelo è quella del 12 μF; da lì ricavi la tensione sul parallelo.`], risposta: { tipo: 'numero', valore: 2.1e-5, unita: 'C' }, soluzione: [R`Parallelo: $1 + 3 = 4\,\mu\text{F}$. Serie con 12 μF: $\dfrac{1}{C} = \dfrac{1}{4} + \dfrac{1}{12} = \dfrac{1}{3}$, quindi $C = 3\,\mu\text{F}$.`, R`Carica: $Q = 3\,\mu\text{F} \cdot 28\,\text{V} = 84\,\mu\text{C}$, la stessa sul 12 μF e sul gruppo.`, R`Tensione sul parallelo: $\dfrac{84\,\mu\text{C}}{4\,\mu\text{F}} = 21\,\text{V}$ (sul 12 μF ne restano 7).`, R`Sul condensatore da 1 μF: $Q_1 = 1\,\mu\text{F} \cdot 21\,\text{V} = 21\,\mu\text{C}$.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un elettrone entra a $3{,}0 \cdot 10^7\,\text{m/s}$, parallelo ai piatti, fra due piatti lunghi 6 cm. I piatti distano 2 cm e hanno 300 V fra loro. Di quanti millimetri è deviato quando esce dai piatti?`, suggerimenti: [R`Il campo è $\Delta V / d$; l'accelerazione $e \cdot E / m$.`, R`Il tempo fra i piatti è la lunghezza divisa $v_0$; poi $y = \frac{1}{2} \cdot a \cdot t^2$.`], risposta: { tipo: 'numero', valore: 5.27, unita: 'mm', tolleranza: 0.1 }, soluzione: [R`$E = \dfrac{300\,\text{V}}{0{,}02\,\text{m}} = 1{,}5 \cdot 10^4\,\text{V/m}$; $a = \dfrac{1{,}60 \cdot 10^{-19} \cdot 1{,}5 \cdot 10^4}{9{,}11 \cdot 10^{-31}}\,\text{m/s}^2 \approx 2{,}63 \cdot 10^{15}\,\text{m/s}^2$.`, R`$t = \dfrac{0{,}06}{3{,}0 \cdot 10^7}\,\text{s} = 2{,}0 \cdot 10^{-9}\,\text{s}$.`, R`$y = \tfrac{1}{2} \cdot 2{,}63 \cdot 10^{15} \cdot (2{,}0 \cdot 10^{-9})^2\,\text{m} \approx 5{,}3 \cdot 10^{-3}\,\text{m} = 5{,}3\,\text{mm}$, verso il piatto positivo.`] },
    { id: 'es-07', difficolta: 2, testo: R`Una particella alfa (carica $2 \cdot e$, massa $6{,}64 \cdot 10^{-27}\,\text{kg}$) parte da ferma e attraversa una differenza di potenziale di 5000 V. A che velocità arriva?`, suggerimenti: [R`Con carica $2 \cdot e$, ogni volt dà 2 eV.`, R`$E_c = 2 \cdot e \cdot \Delta V$, poi $v = \sqrt{2 \cdot E_c / m}$.`], risposta: { tipo: 'numero', valore: 6.94e5, unita: 'm/s' }, soluzione: [R`$E_c = 2 \cdot 5000\,\text{eV} = 10\,000\,\text{eV} = 1{,}6 \cdot 10^{-15}\,\text{J}$.`, R`$v = \sqrt{\dfrac{2 \cdot 1{,}6 \cdot 10^{-15}}{6{,}64 \cdot 10^{-27}}}\,\text{m/s} \approx 6{,}9 \cdot 10^5\,\text{m/s}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`L'aria diventa conduttrice, e fa scoccare una scintilla, quando il campo supera circa $3 \cdot 10^6\,\text{V/m}$. Qual è la tensione massima per un condensatore piano ad aria con le armature a 2 mm?`, suggerimenti: [R`Nel campo uniforme $V = E \cdot d$.`], risposta: { tipo: 'numero', valore: 6000, unita: 'V' }, soluzione: [R`$V_{max} = 3 \cdot 10^6\,\text{V/m} \cdot 0{,}002\,\text{m} = 6000\,\text{V}$.`, R`Per questo i condensatori ad alta tensione hanno un isolante solido fra le armature, che regge campi più forti.`] },
    { id: 'es-09', difficolta: 2, testo: R`Un quadrato ha il lato di 20 cm. Ai vertici ci sono le cariche +3 nC, +3 nC, −2 nC e −2 nC. Quanto vale il potenziale nel centro del quadrato?`, suggerimenti: [R`Tutte le cariche sono alla stessa distanza dal centro: mezza diagonale.`, R`I potenziali si sommano con il segno: conta la carica totale.`], risposta: { tipo: 'numero', valore: 127, unita: 'V' }, soluzione: [R`Mezza diagonale: $r = \dfrac{0{,}20 \cdot \sqrt{2}}{2}\,\text{m} \approx 0{,}141\,\text{m}$.`, R`Carica totale: $3 + 3 - 2 - 2 = 2\,\text{nC}$.`, R`$V = \dfrac{8{,}99 \cdot 10^9 \cdot 2 \cdot 10^{-9}}{0{,}141}\,\text{V} \approx 127\,\text{V}$. Non importa come sono disposte le cariche sui vertici.`] },
    { id: 'es-10', difficolta: 3, testo: R`Un elettrone va a $4{,}0 \cdot 10^6\,\text{m/s}$ ed entra in un campo elettrico uniforme diretto come la sua velocità. La forza, opposta al campo, lo frena. Quale differenza di potenziale deve attraversare per fermarsi?`, suggerimenti: [R`Tutta l'energia cinetica deve diventare energia potenziale.`, R`$\frac{1}{2} \cdot m \cdot v^2 = e \cdot \Delta V$.`], risposta: { tipo: 'numero', valore: 45.6, unita: 'V', tolleranza: 0.5 }, soluzione: [R`$E_c = \tfrac{1}{2} \cdot 9{,}11 \cdot 10^{-31} \cdot (4{,}0 \cdot 10^6)^2\,\text{J} \approx 7{,}29 \cdot 10^{-18}\,\text{J}$.`, R`$\Delta V = \dfrac{E_c}{e} = \dfrac{7{,}29 \cdot 10^{-18}}{1{,}60 \cdot 10^{-19}}\,\text{V} \approx 46\,\text{V}$.`, R`L'elettrone, negativo, va verso i potenziali più bassi: perde energia cinetica scendendo di 46 V.`] },
    { id: 'es-11', difficolta: 2, testo: R`Una sfera di metallo di raggio 15 cm, isolata, si trova a un potenziale di 3000 V rispetto all'infinito. Quanta carica c'è sulla sfera?`, suggerimenti: [R`Fuori, una sfera carica si comporta come una carica puntiforme nel centro.`, R`Sulla superficie $V = k \cdot Q / R$.`], risposta: { tipo: 'numero', valore: 5e-8, unita: 'C' }, soluzione: [R`$Q = \dfrac{V \cdot R}{k} = \dfrac{3000 \cdot 0{,}15}{8{,}99 \cdot 10^9}\,\text{C} \approx 5{,}0 \cdot 10^{-8}\,\text{C} = 50\,\text{nC}$.`, R`Tutta la sfera è allo stesso potenziale, anche dentro: è un conduttore in equilibrio.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`A quale combinazione di unità corrisponde il volt?`, opzioni: [R`Newton al coulomb`, R`Coulomb al joule`, R`Joule al coulomb`, R`Joule per coulomb, moltiplicati`], corretta: 2, spiegazione: R`Il potenziale è energia per unità di carica: $1\,\text{V} = 1\,\text{J/C}$. Il newton al coulomb è l'unità del campo, che equivale al volt al metro.` },
    { id: 'q-02', domanda: R`Una carica positiva, inizialmente ferma, viene lasciata libera in un campo elettrico. Verso dove si muove?`, opzioni: [R`Verso i potenziali più bassi`, R`Verso i potenziali più alti`, R`Verso il punto dove il potenziale vale zero`, R`Lungo un'equipotenziale`], corretta: 0, spiegazione: R`Il campo fa lavoro positivo e $\Delta V = -L/q$ è negativo. Lo zero del potenziale si sceglie, quindi non può decidere il moto; lungo un'equipotenziale il campo non spinge.` },
    { id: 'q-03', domanda: R`Come sono le superfici equipotenziali rispetto alle linee di campo?`, opzioni: [R`Parallele`, R`Inclinate di 45°`, R`Parallele vicino alle cariche, perpendicolari lontano`, R`Sempre perpendicolari`], corretta: 3, spiegazione: R`Lungo un'equipotenziale il campo non fa lavoro, quindi la forza è sempre perpendicolare allo spostamento. Vale in ogni punto, vicino o lontano dalle cariche.` },
    { id: 'q-04', domanda: R`A distanza doppia da una carica puntiforme, il potenziale (zero all'infinito)…`, opzioni: [R`diventa un quarto`, R`si dimezza`, R`raddoppia`, R`resta uguale`], corretta: 1, spiegazione: R`$V = k \cdot Q / r$ va con $1/r$: distanza doppia, potenziale dimezzato. È il campo, con $1/r^2$, a diventare un quarto.` },
    { id: 'q-05', domanda: R`Quale di queste cose si può scegliere a piacere senza cambiare nessun risultato fisico?`, opzioni: [R`La differenza di potenziale fra due punti`, R`Il punto in cui il potenziale vale zero`, R`Il campo elettrico in un punto`, R`Il lavoro del campo fra due punti`], corretta: 1, spiegazione: R`Lo zero del potenziale è una convenzione, come lo zero delle altezze. Le differenze di potenziale, il campo e il lavoro non cambiano spostando lo zero.` },
    { id: 'q-06', domanda: R`Una carica si sposta lungo una superficie equipotenziale. Quanto vale il lavoro del campo?`, opzioni: [R`È positivo`, R`È negativo`, R`Dipende dalla strada`, R`È zero`], corretta: 3, spiegazione: R`Il lavoro del campo è $-q \cdot \Delta V$, e lungo un'equipotenziale $\Delta V = 0$. Per una forza conservativa la strada non conta.` },
    { id: 'q-07', domanda: R`La capacità di un condensatore piano raddoppia se…`, opzioni: [R`si raddoppia l'area delle armature`, R`si raddoppia la distanza fra le armature`, R`si raddoppia la tensione`, R`si raddoppia la carica`], corretta: 0, spiegazione: R`$C = \varepsilon_0 \cdot S / d$ dipende solo dalla forma: con l'area doppia raddoppia. Con la distanza doppia si dimezza. Tensione e carica crescono insieme, e il loro rapporto resta lo stesso.` },
    { id: 'q-08', domanda: R`Due condensatori uguali sono collegati in serie. Quanto vale la capacità equivalente?`, opzioni: [R`Il doppio di quella di uno`, R`Quella di uno`, R`La metà di quella di uno`, R`Un quarto di quella di uno`], corretta: 2, spiegazione: R`$\frac{1}{C} = \frac{1}{C_1} + \frac{1}{C_1} = \frac{2}{C_1}$, quindi $C = C_1 / 2$. Il doppio è il risultato del parallelo.` },
    { id: 'q-09', domanda: R`Che cosa hanno sempre in comune due condensatori collegati in parallelo?`, opzioni: [R`La carica`, R`L'energia`, R`La capacità`, R`La tensione`], corretta: 3, spiegazione: R`In parallelo ogni condensatore è collegato agli stessi due punti: la tensione è la stessa. La carica è la stessa nei condensatori in serie; capacità ed energia possono essere diverse.` },
    { id: 'q-10', domanda: R`Che cos'è un elettronvolt?`, opzioni: [R`Una tensione di 1 V applicata a un elettrone`, R`Un'energia, pari a $1{,}60 \cdot 10^{-19}\,\text{J}$`, R`La carica di un elettrone`, R`Una potenza, come il watt`], corretta: 1, spiegazione: R`Nonostante il nome, l'elettronvolt è un'energia: quella che acquista un elettrone attraversando 1 V. La carica dell'elettrone ha lo stesso numero, ma in coulomb.` },
    { id: 'q-11', domanda: R`Un elettrone e un protone partono da fermi e attraversano la stessa differenza di potenziale. Che cosa hanno di uguale alla fine?`, opzioni: [R`L'energia cinetica`, R`La velocità`, R`Il verso del moto`, R`La quantità di moto`], corretta: 0, spiegazione: R`Hanno carica uguale in modulo: tutti e due guadagnano $e \cdot \Delta V$. Il protone, molto più pesante, va più piano; e si muovono in versi opposti. La quantità di moto no: a parità di energia è più grande per il corpo più pesante.` },
    { id: 'q-12', domanda: R`Un elettrone entra fra due piatti carichi con la velocità parallela ai piatti. Che traiettoria segue fra i piatti?`, opzioni: [R`Una retta`, R`Un arco di circonferenza`, R`Una parabola`, R`Una spirale`], corretta: 2, spiegazione: R`Lungo i piatti la velocità resta costante, verso un piatto c'è una forza costante: è il moto di un proiettile. La retta ci sarebbe senza campo; la circonferenza è tipica di una forza sempre perpendicolare alla velocità.` },
    { id: 'q-13', domanda: R`Un condensatore carico viene staccato dalla pila; poi le armature vengono allontanate. Che cosa resta uguale?`, opzioni: [R`La tensione`, R`La carica`, R`La capacità`, R`L'energia`], corretta: 1, spiegazione: R`Staccato dalla pila, il condensatore non può perdere né prendere carica. La capacità cala, quindi la tensione $Q/C$ cresce, e cresce anche l'energia.` },
    { id: 'q-14', domanda: R`In un punto il potenziale vale zero. Che cosa si può dire del campo elettrico in quel punto?`, opzioni: [R`È sicuramente zero`, R`È sicuramente massimo`, R`Punta verso i potenziali più alti`, R`Può essere diverso da zero`], corretta: 3, spiegazione: R`Il campo dipende da come cambia il potenziale, non dal suo valore. A metà fra una carica positiva e una negativa uguali $V = 0$, ma il campo c'è. E il campo punta sempre verso i potenziali più bassi.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Il potenziale è un numero con il segno, non un vettore. Con più cariche si sommano i potenziali con i loro segni, senza frecce né componenti.` },
    { tipo: 'errore', testo: R`Non confondere $V = k \cdot Q / r$ con $E = k \cdot Q / r^2$. Il potenziale cala come $1/r$, il campo come $1/r^2$.` },
    { tipo: 'errore', testo: R`Il volt non è un'energia: per avere i joule moltiplica il potenziale per la carica, $U = q \cdot V$.` },
    { tipo: 'trucco', testo: R`Volt al metro e newton al coulomb sono la stessa unità. Nel campo uniforme $E = \Delta V / d$.` },
    { tipo: 'trucco', testo: R`Controllo veloce: in serie la capacità equivalente è minore della più piccola; in parallelo è maggiore della più grande.` },
    { tipo: 'trucco', testo: R`Per elettroni e protoni conta in elettronvolt: attraversando 300 V un elettrone guadagna 300 eV. Ai joule passi solo alla fine.` },
    { tipo: 'metodo', testo: R`Condensatore collegato alla pila: resta fissa la tensione. Staccato dalla pila: resta fissa la carica. Decidilo prima di fare i conti.` },
    { tipo: 'metodo', testo: R`Per una carica accelerata usa la conservazione dell'energia, $\frac{1}{2} \cdot m \cdot v^2 = q \cdot \Delta V$: non serve conoscere la forma del campo.` }
  ],
  aneddoti: [
    { fisico: 'Pieter van Musschenbroek', anni: '1692–1761', titolo: 'La bottiglia che dava la scossa', testo: R`A Leida, in Olanda, Pieter van Musschenbroek cercava di conservare l'elettricità in una bottiglia. La riempì d'acqua e ci immerse un filo collegato a una macchina elettrostatica. Un frequentatore del laboratorio, l'avvocato Andreas Cunaeus, ripeté la prova tenendo la bottiglia in mano. Quando toccò il filo con l'altra mano, prese una scossa violenta. Musschenbroek provò anche lui. Nel gennaio del 1746 scrisse al francese Réaumur di aver creduto di morire. Aggiunse che non avrebbe ripetuto la prova nemmeno per il regno di Francia. Pochi mesi prima, in Pomerania, Ewald von Kleist aveva scoperto la stessa cosa. La «bottiglia di Leida» fece il giro d'Europa. Era il primo condensatore: l'acqua e la mano facevano da armature, il vetro da isolante.`, legame: R`La bottiglia di Leida è un condensatore: due conduttori separati da un isolante, che immagazzinano carica ed energia.` },
    { fisico: 'Alessandro Volta', anni: '1745–1827', titolo: 'Il disco che alzava la tensione', testo: R`Alessandro Volta insegnava fisica a Pavia. Nel 1782 descrisse uno strumento per scoprire cariche piccolissime, e lo chiamò «condensatore». Era un disco di metallo appoggiato su un piano appena isolante. Collegato a una sorgente debole, il disco raccoglieva carica con una tensione molto bassa. Poi Volta lo sollevava per il manico isolante. Le pagliette dell'elettrometro collegato si aprivano di colpo. La carica era la stessa, ma lontano dal piano la tensione era salita di molto. Volta parlava proprio di «tensione elettrica», la parola che usiamo ancora. Nel 1800 annunciò la pila. Nel 1881 un congresso internazionale di elettricità, a Parigi, chiamò «volt» l'unità di misura del potenziale.`, legame: R`Il disco di Volta è $C = Q/V$ all'opera: allontanando le armature la capacità cala, e la tensione cresce.` },
    { fisico: 'Michael Faraday', anni: '1791–1867', titolo: 'L\'isolante che non stava a guardare', testo: R`Nel 1837 Michael Faraday si chiese se l'isolante fra due conduttori contasse qualcosa. Costruì due condensatori identici. Ognuno era una sfera di ottone dentro una sfera cava più grande. In uno lo spazio fra le sfere era pieno d'aria. Nell'altro mise della gommalacca, poi provò zolfo e vetro. Caricava un condensatore e divideva la carica con l'altro. Con una bilancia di torsione, come quella di Coulomb, confrontava le tensioni. Con la gommalacca il condensatore prendeva circa il doppio della carica, a parità di tensione. L'isolante non era un semplice spettatore. Faraday chiamò questi materiali «dielettrici». In suo onore l'unità della capacità si chiama farad.`, legame: R`È la costante dielettrica relativa: un isolante fra le armature moltiplica la capacità per $\varepsilon_r$.` },
    { fisico: 'Joseph John Thomson', anni: '1856–1940', titolo: 'I raggi che Hertz non riuscì a piegare', testo: R`Nell'Ottocento i fisici discutevano dei raggi catodici, che facevano brillare di verde il vetro dei tubi a vuoto. Erano onde o particelle cariche? Nel 1883 Heinrich Hertz li fece passare fra due piatti carichi. I raggi andarono dritti, e Hertz concluse che non avevano carica. Nel 1897, a Cambridge, Joseph John Thomson ripeté la prova con un vuoto molto migliore. Questa volta i raggi piegarono verso il piatto positivo: erano cariche negative. Nel tubo di Hertz il gas rimasto, diventato conduttore, aveva schermato il campo. Misurando quanto piegavano, Thomson trovò che quelle particelle erano più di mille volte più leggere di un atomo di idrogeno. Le chiamò «corpuscoli»: oggi sono gli elettroni. Nel 1906 ricevette il premio Nobel.`, legame: R`È la deflessione di un fascio di elettroni fra due piatti carichi, la stessa del tubo a raggi catodici.` }
  ]
});
})();
