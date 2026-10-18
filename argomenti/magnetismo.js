/* Quanto — Il campo magnetico (magnetismo, quinto anno): calamite e campo magnetico, l'esperimento di Oersted e il
   campo di un filo, la forza di Lorentz, le cariche che girano in un campo uniforme, la forza su un filo e fra due fili,
   il motore elettrico, il solenoide, flusso e circuitazione di B (Gauss e Ampère), il campo nella materia.
   Colori come nei video: campo B verde (3), corrente e cariche positive viola (4), cariche negative e velocità
   azzurre (1), forze e momenti arancio (2). Poli in due grigi, mai rosso e azzurro: nord pieno scuro, sud chiaro.
   Contratto in SCHEMA.md, modello cinematica.js. Verifica: node strumenti/verifica-argomento.js argomenti/magnetismo.js */
(function () {
const R = String.raw;

/* Le linee del campo di una calamita a sbarra (lunga 3, alta 1, centrata nell'origine, nord a destra), solo la metà di
   sopra: quella di sotto è speculare. Calcolate con Biot-Savart per una sbarra cilindrica magnetizzata in modo uniforme
   (cioè un solenoide di 30 spire), tracciate con Runge-Kutta e ricampionate: x, y, x, y, ... Sono chiuse: dentro la
   calamita proseguono dal sud al nord. */
const LINEE = [
  [0,0.34,0.13,0.34,0.27,0.34,0.4,0.34,0.54,0.34,0.67,0.35,0.81,0.35,0.94,0.35,1.08,0.36,1.21,0.38,1.35,0.4,1.47,0.45,1.53,0.56,1.55,0.7,1.56,0.83,1.57,0.97,1.56,1.1,1.56,1.24,1.55,1.37,1.53,1.51,1.5,1.64,1.47,1.77,1.43,1.9,1.39,2.03,1.33,2.15,1.27,2.27,1.2,2.39,1.12,2.5,1.04,2.6,0.94,2.7,0.84,2.79,0.73,2.87,0.62,2.94,0.5,2.99,0.37,3.04,0.24,3.07,0.1,3.09,-0.03,3.09,-0.17,3.08,-0.3,3.06,-0.43,3.02,-0.55,2.97,-0.67,2.91,-0.78,2.83,-0.89,2.75,-0.99,2.65,-1.08,2.55,-1.16,2.45,-1.23,2.33,-1.3,2.22,-1.36,2.09,-1.41,1.97,-1.45,1.84,-1.49,1.71,-1.51,1.58,-1.54,1.44,-1.55,1.31,-1.56,1.18,-1.57,1.04,-1.56,0.91,-1.56,0.77,-1.55,0.64,-1.52,0.5,-1.42,0.42,-1.29,0.39,-1.15,0.37,-1.02,0.36,-0.88,0.35,-0.75,0.35,-0.61,0.34,-0.48,0.34,-0.34,0.34,-0.21,0.34,-0.07,0.34],
  [0,0.38,0.1,0.38,0.21,0.38,0.31,0.38,0.42,0.38,0.52,0.38,0.63,0.38,0.73,0.38,0.84,0.39,0.94,0.39,1.05,0.4,1.15,0.41,1.26,0.42,1.36,0.44,1.46,0.48,1.47,0.58,1.45,0.68,1.44,0.78,1.42,0.89,1.4,0.99,1.37,1.09,1.34,1.19,1.31,1.29,1.27,1.39,1.23,1.49,1.19,1.58,1.14,1.68,1.08,1.76,1.02,1.85,0.96,1.93,0.89,2.01,0.81,2.09,0.73,2.15,0.65,2.21,0.56,2.27,0.47,2.32,0.37,2.35,0.27,2.38,0.16,2.4,0.06,2.41,-0.05,2.41,-0.15,2.41,-0.25,2.39,-0.35,2.36,-0.45,2.32,-0.55,2.28,-0.64,2.22,-0.72,2.16,-0.8,2.09,-0.88,2.02,-0.95,1.94,-1.02,1.86,-1.08,1.78,-1.13,1.69,-1.18,1.6,-1.23,1.5,-1.27,1.4,-1.31,1.31,-1.34,1.21,-1.37,1.1,-1.39,1,-1.41,0.9,-1.43,0.8,-1.45,0.69,-1.47,0.59,-1.47,0.49,-1.37,0.45,-1.27,0.42,-1.17,0.41,-1.06,0.4,-0.96,0.39,-0.85,0.39,-0.75,0.38,-0.64,0.38,-0.54,0.38,-0.43,0.38,-0.33,0.38,-0.22,0.38,-0.12,0.38,-0.01,0.37],
  [0,0.42,0.1,0.43,0.21,0.43,0.31,0.43,0.42,0.43,0.52,0.43,0.63,0.43,0.73,0.43,0.84,0.44,0.94,0.44,1.05,0.45,1.15,0.46,1.26,0.47,1.36,0.49,1.33,0.58,1.27,0.67,1.22,0.76,1.16,0.85,1.1,0.94,1.04,1.02,0.98,1.11,0.91,1.19,0.84,1.26,0.76,1.33,0.68,1.4,0.59,1.46,0.5,1.51,0.4,1.55,0.3,1.59,0.2,1.62,0.1,1.63,-0.01,1.64,-0.11,1.63,-0.21,1.61,-0.32,1.59,-0.41,1.55,-0.51,1.5,-0.6,1.45,-0.69,1.39,-0.77,1.33,-0.84,1.25,-0.92,1.18,-0.98,1.1,-1.05,1.01,-1.11,0.93,-1.17,0.84,-1.22,0.75,-1.28,0.66,-1.33,0.57,-1.35,0.49,-1.25,0.47,-1.14,0.46,-1.04,0.45,-0.93,0.44,-0.83,0.44,-0.72,0.43,-0.62,0.43,-0.51,0.43,-0.41,0.43,-0.3,0.43,-0.2,0.43,-0.09,0.43],
  [0,0.47,0.1,0.47,0.21,0.47,0.31,0.47,0.42,0.47,0.52,0.47,0.63,0.47,0.73,0.48,0.83,0.48,0.94,0.48,1.04,0.49,1.07,0.56,0.99,0.62,0.91,0.69,0.82,0.75,0.73,0.81,0.64,0.86,0.55,0.91,0.45,0.95,0.35,0.98,0.25,1.01,0.15,1.03,0.04,1.04,-0.06,1.04,-0.17,1.03,-0.27,1.01,-0.37,0.98,-0.47,0.94,-0.56,0.9,-0.66,0.85,-0.75,0.8,-0.83,0.74,-0.92,0.68,-1,0.61,-1.08,0.55,-1.02,0.5,-0.92,0.49,-0.82,0.48,-0.71,0.48,-0.61,0.48,-0.5,0.47,-0.4,0.47,-0.3,0.47,-0.19,0.47,-0.09,0.47]
];
/* le linee come poligoni chiusi senza riempimento (verdi: è il campo B), sopra e sotto, con una freccetta sulla cima
   di ognuna (fuori il campo va dal nord al sud) e due dentro la calamita (dal sud al nord) */
function lineeCalamita() {
  const out = [];
  LINEE.forEach(function (l) {
    const sopra = [], sotto = [];
    let cima = 0;
    for (let i = 0; i < l.length; i += 2) { sopra.push([l[i], l[i + 1]]); sotto.push([l[i], -l[i + 1]]); cima = Math.max(cima, l[i + 1]); }
    out.push({ tipo: 'poligono', punti: sopra, riempi: false, colore: 3 });
    out.push({ tipo: 'poligono', punti: sotto, riempi: false, colore: 3 });
    out.push({ tipo: 'vettore', da: [0.2, cima], a: [-0.2, cima], colore: 3 });
    out.push({ tipo: 'vettore', da: [0.2, -cima], a: [-0.2, -cima], colore: 3 });
  });
  out.push({ tipo: 'vettore', da: [-1.05, 0.38], a: [-0.55, 0.38], colore: 3 });
  out.push({ tipo: 'vettore', da: [-1.05, -0.38], a: [-0.55, -0.38], colore: 3 });
  return out;
}
/* la calamita a sbarra: polo nord a destra, pieno scuro; polo sud a sinistra, chiaro. I colori 'polo-n' e 'polo-s'
   sono fissi, uguali nei due temi come nei video; le lettere sempre scritte, chiare sul nord e scure sul sud */
function sbarra() {
  return [
    { tipo: 'poligono', punti: [[-1.5, -0.5], [0, -0.5], [0, 0.5], [-1.5, 0.5]], colore: 'polo-s', pieno: true },
    { tipo: 'poligono', punti: [[0, -0.5], [1.5, -0.5], [1.5, 0.5], [0, 0.5]], colore: 'polo-n', pieno: true }
  ];
}
function lettereSbarra() {
  return [
    { tipo: 'testo', p: [0.75, -0.14], testo: 'N', classe: 'cg-polo-n' },
    { tipo: 'testo', p: [-0.75, -0.14], testo: 'S', classe: 'cg-polo-s' }
  ];
}
/* la linea di campo lungo l'asse (per simmetria è una linea anche lei): esce dalla faccia nord, rientra nella sud */
function asseCalamita() {
  return [
    { tipo: 'segmento', da: [1.5, 0], a: [2.75, 0], colore: 3, freccia: true },
    { tipo: 'segmento', da: [-2.75, 0], a: [-1.5, 0], colore: 3, freccia: true }
  ];
}
/* un ago di bussola nel punto (cx, cy), lungo la direzione (ux, uy): punta nord scura, coda sud chiara */
function ago(cx, cy, ux, uy) {
  const L = 0.5, w = 0.13;
  const N = [cx + ux * L, cy + uy * L], S = [cx - ux * L, cy - uy * L];
  const P1 = [cx - uy * w, cy + ux * w], P2 = [cx + uy * w, cy - ux * w];
  return [
    { tipo: 'poligono', punti: [S, P1, P2], colore: 'polo-s', pieno: true },
    { tipo: 'poligono', punti: [N, P1, P2], colore: 'polo-n', pieno: true }
  ];
}

QUANTO.registra({
  id: 'magnetismo',
  titolo: 'Il campo magnetico',
  introduzione: R`Una calamita tiene un foglio attaccato al frigorifero. L'ago di una bussola si gira sempre verso nord. Un motore elettrico fa girare il cestello della lavatrice. Dietro a tutte queste cose c'è il **campo magnetico**.

Per secoli le calamite sono sembrate un mondo a parte. Nel 1820 si scoprì che anche una corrente elettrica crea un campo magnetico. E un campo magnetico spinge le cariche in moto e i fili percorsi da corrente. Da qui vengono il motore elettrico, l'elettromagnete, la risonanza magnetica degli ospedali.

Servono la corrente elettrica, i vettori con il prodotto vettoriale e il moto circolare uniforme, con l'accelerazione centripeta. Aiuta aver visto il campo elettrico: molte idee si somigliano, ma con differenze importanti.`,
  inBreve: [
    R`Una calamita ha sempre due poli, nord e sud: poli uguali si respingono, diversi si attraggono. Il **campo magnetico** si misura in tesla, e le sue linee sono sempre chiuse.`,
    R`Una corrente crea un campo magnetico. Attorno a un filo le linee sono cerchi e $B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$, con $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.`,
    R`Su una carica in moto agisce la **forza di Lorentz**, $F = q \cdot v \cdot B \cdot \sin\alpha$, perpendicolare a v e a B. Una carica lanciata perpendicolare al campo gira su un cerchio di raggio $r = \dfrac{m \cdot v}{q \cdot B}$.`,
    R`Su un filo agisce $F = I \cdot \ell \cdot B \cdot \sin\alpha$. Due fili con correnti nello stesso verso si attraggono. Su una spira il campo fa un momento: è il motore elettrico.`,
    R`Dentro un solenoide il campo è uniforme: $B = \mu_0 \cdot n \cdot I$, con $n$ spire per metro. Con il ferro dentro diventa centinaia di volte più intenso.`,
    R`Il flusso di B attraverso una superficie chiusa è sempre zero. La circuitazione di B è $\mu_0$ per la corrente abbracciata: è il teorema di Ampère.`
  ],
  sezioni: [
    {
      id: 'calamite',
      titolo: 'Calamite, poli e campo magnetico',
      testo: R`Una calamita attira i chiodi, le graffette, il coperchio di una scatola di latta. Non attira la carta, il legno, la plastica, l'oro di un anello. L'attrazione è più forte vicino alle due estremità: i **poli**.

Una calamita libera di girare si ferma sempre nella stessa direzione. Il polo che guarda verso il nord geografico si chiama **polo nord** (N), l'altro **polo sud** (S). Poli uguali si respingono, poli diversi si attraggono.

[[video:magnetismo/calamite]]

Se spezzi una calamita non ottieni un nord da solo: ogni pezzo ha di nuovo un nord e un sud. Un polo isolato, il **monopolo magnetico**, non l'ha mai trovato nessuno. Le cariche elettriche invece si separano benissimo.

Attorno alla calamita gli aghi delle bussole si orientano. Lo spazio attorno alla calamita è cambiato: c'è un campo magnetico.

>* Il **campo magnetico** $\vec{B}$ è un vettore: in ogni punto ha la direzione e il verso in cui punta il nord di un ago magnetico. Si misura in **tesla** (T).

Le **linee di campo** seguono gli aghi. Escono dal polo nord, entrano nel polo sud e dentro la calamita proseguono: sono sempre **chiuse**. Dove sono fitte, il campo è intenso.

[[grafico:calamita]]

Il tesla è un'unità grande. Ecco qualche valore:

| dove | campo magnetico |
|---|---|
| superficie della Terra | circa $5 \cdot 10^{-5}\,\text{T}$ |
| calamita da frigorifero | qualche millitesla |
| calamita al neodimio, vicino al polo | circa $1\,\text{T}$ |
| risonanza magnetica | da $1{,}5$ a $3\,\text{T}$ |

Anche la **Terra** è una grande calamita, e per questo la bussola funziona.

>! Il nord dell'ago non punta verso un nord magnetico: poli uguali si respingono. Vicino al Polo Nord geografico c'è un polo **sud** magnetico.

?? Spezzi a metà una calamita a sbarra. Che cosa hai in mano?
[ ] un pezzo solo nord e un pezzo solo sud
[x] due calamite, ognuna con un nord e un sud
[ ] due pezzi di ferro non magnetici
[ ] un pezzo magnetico e uno no
=> Ogni pezzo ha di nuovo due poli. Dentro, la calamita è fatta di tante calamite piccolissime allineate: spezzarla non separa il nord dal sud.`
    },
    {
      id: 'oersted',
      titolo: 'La corrente crea un campo: l\'esperimento di Oersted',
      testo: R`Per secoli elettricità e magnetismo sono sembrati due mondi separati. Nel 1820 il danese Hans Christian Oersted mise un filo sopra una bussola, parallelo all'ago. Quando chiudeva il circuito, l'ago ruotava e si metteva quasi di traverso. Con la corrente invertita girava dall'altra parte.

>* Una **corrente elettrica crea un campo magnetico**. Attorno a un filo rettilineo le linee di campo sono cerchi, con il filo al centro.

Nei disegni il filo spesso è perpendicolare al foglio. Il simbolo ⊙ vuol dire che la corrente **esce** verso di te: è la punta della freccia. Il simbolo ⊗ vuol dire che **entra**: è la coda.

[[video:magnetismo/oersted]]

Il verso del campo si trova con la **mano destra**. Il pollice va nel verso della corrente, le dita chiuse attorno al filo girano come B. Con la corrente che esce dal foglio, B gira in senso antiorario.

Il campo è più debole lontano dal filo, e più forte con più corrente.

>* **Legge di Biot-Savart** per un filo rettilineo molto lungo: $B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$. Qui $r$ è la distanza dal filo e $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$ è la **permeabilità magnetica del vuoto**.

A distanza doppia il campo è la metà. Con la corrente doppia raddoppia. Nei conti aiuta ricordare che $\dfrac{\mu_0}{2\pi} = 2 \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.

~ B = \dfrac{\mu_0}{2\pi} \cdot \dfrac{I}{r} :: un cavo con 15 A, a 5 cm di distanza
~ B = 2 \cdot 10^{-7}\,\tfrac{\text{T} \cdot \text{m}}{\text{A}} \cdot \dfrac{15\,\text{A}}{0{,}05\,\text{m}} :: la distanza va in metri
~ B = \evidb{6 \cdot 10^{-5}\,\text{T}} :: più o meno quanto il campo della Terra

Per questo una bussola vicino a un cavo con molta corrente sbaglia direzione.

[[grafico:filo]]

>! Le linee del campo di un filo non partono dal filo e non ci arrivano. Sono cerchi chiusi, come quelle della calamita.

?? A 2 cm da un filo il campo vale 30 μT. Quanto vale a 6 cm?
[ ] 90 μT
[ ] 30 μT
[x] 10 μT
[ ] 3,3 μT
=> Il campo va come $1/r$: a distanza tripla è un terzo, $30 / 3 = 10\,\mu\text{T}$. Non va come $1/r^2$, come quello di una carica puntiforme.`
    },
    {
      id: 'lorentz',
      titolo: 'La forza di Lorentz',
      testo: R`Un campo magnetico non fa niente a una carica ferma. Se però la carica si muove, sente una forza. È la forza che piegava il fascio di elettroni nei vecchi televisori a tubo.

>* Una carica $q$ si muove con velocità v in un campo B. Su di lei agisce la **forza di Lorentz**, di modulo $F = q \cdot v \cdot B \cdot \sin\alpha$. Qui $\alpha$ è l'angolo fra v e B. La forza è perpendicolare sia a v sia a B.

In forma vettoriale si scrive con il prodotto vettoriale: $\vec{F} = q \cdot \vec{v} \wedge \vec{B}$. Con v parallela a B la forza è zero. È massima con v perpendicolare a B.

**Il verso, con la mano destra aperta.** Il pollice va lungo v, le altre dita lungo B. Per una carica positiva la forza esce dal palmo. Per una carica negativa, come l'elettrone, la forza ha il verso opposto.

È lo stesso verso del prodotto vettoriale $\vec{v} \wedge \vec{B}$. Con la regola delle dita che si chiudono da v verso B, il pollice dà F.

[[grafico:verso-forza]]

~ F = q \cdot v \cdot B \cdot \sin\alpha :: un elettrone a $3 \cdot 10^6$ m/s, perpendicolare a un campo di 0,02 T
~ F = 1{,}60 \cdot 10^{-19}\,\text{C} \cdot 3 \cdot 10^6\,\tfrac{\text{m}}{\text{s}} \cdot 0{,}02\,\text{T} :: $\sin 90° = 1$; della carica conta il valore assoluto
~ F = \evidb{9{,}6 \cdot 10^{-15}\,\text{N}} :: piccola, ma l'elettrone ha una massa di appena $9{,}11 \cdot 10^{-31}$ kg

Dalla formula viene anche l'unità del campo: $1\,\text{T} = 1\,\dfrac{\text{N}}{\text{C} \cdot \text{m/s}} = 1\,\dfrac{\text{N}}{\text{A} \cdot \text{m}}$. Prendi una carica di 1 C a 1 m/s, perpendicolare a un campo di 1 T: sente una forza di 1 N.

La forza di Lorentz è sempre perpendicolare alla velocità. Quindi **non compie lavoro**: cambia la direzione del moto, non il modulo della velocità. L'energia cinetica della carica resta la stessa.

>! La forza magnetica non è diretta lungo le linee di campo, come quella elettrica: è perpendicolare a B. Una carica ferma, o che si muove lungo B, non sente niente.

?? Un protone e un elettrone attraversano lo stesso campo con la stessa velocità. Che cosa hanno di diverso le due forze?
[ ] niente: stesso modulo e stesso verso
[x] stesso modulo, verso opposto
[ ] sul protone la forza è 1836 volte più grande
[ ] sull'elettrone la forza è zero
=> Le due cariche hanno lo stesso valore assoluto $e$, quindi $F = e \cdot v \cdot B$ è uguale. Il segno è opposto, e così il verso. È la massa a essere diversa: l'elettrone curva molto di più.`
    },
    {
      id: 'cariche-campo',
      titolo: 'Cariche che girano in tondo',
      testo: R`Lanciamo una carica perpendicolare a un campo uniforme. La forza di Lorentz è perpendicolare alla velocità e ha sempre lo stesso modulo. È proprio la situazione del moto circolare uniforme.

[[video:magnetismo/lorentz]]

La forza di Lorentz fa da forza centripeta. Dalla seconda legge della dinamica:

~ q \cdot v \cdot B = m \cdot \dfrac{v^2}{r} :: forza di Lorentz uguale a massa per accelerazione centripeta
~ q \cdot B = m \cdot \dfrac{v}{r} :: divido tutti e due i membri per $v$
~ r = \evidb{\dfrac{m \cdot v}{q \cdot B}} :: ricavo il raggio

>* Una carica che entra perpendicolare a un campo uniforme percorre una circonferenza di raggio $r = \dfrac{m \cdot v}{q \cdot B}$. Il periodo $T = \dfrac{2\pi \cdot m}{q \cdot B}$ non dipende dalla velocità.

Il periodo è un giro diviso la velocità, $T = 2\pi \cdot r / v$. Al posto di $r$ si mette $m \cdot v / (q \cdot B)$, e la $v$ si semplifica. Una carica più veloce fa un cerchio più grande, nello stesso tempo.

~ r = \dfrac{m \cdot v}{q \cdot B} :: un elettrone a $4 \cdot 10^6$ m/s in un campo di 0,5 mT
~ r = \dfrac{9{,}11 \cdot 10^{-31}\,\text{kg} \cdot 4 \cdot 10^6\,\text{m/s}}{1{,}60 \cdot 10^{-19}\,\text{C} \cdot 5 \cdot 10^{-4}\,\text{T}} :: il campo in tesla
~ r \approx \evidb{4{,}6 \cdot 10^{-2}\,\text{m}} :: un cerchio di 4,6 cm di raggio

[[grafico:lorentz]]

Se la velocità è inclinata rispetto a B, la parte parallela a B non cambia. La carica gira e intanto avanza lungo il campo: la traiettoria è un'**elica**. Così le particelle cariche che arrivano dal Sole scendono a spirale verso i poli della Terra. Lì accendono le **aurore**.

Su questa idea funziona lo **spettrometro di massa**. Ioni con la stessa carica e la stessa velocità entrano nel campo. I più pesanti fanno un cerchio più largo: così si separano gli isotopi di un elemento.

Per avere ioni tutti alla stessa velocità si usa un **filtro di velocità**. Un campo elettrico e un campo magnetico, perpendicolari fra loro, spingono gli ioni in versi opposti. Vanno dritti solo quelli in cui le due forze si bilanciano: $q \cdot E = q \cdot v \cdot B$, cioè $v = E / B$.

>! Il campo magnetico non fa andare la carica più veloce: ne curva soltanto la traiettoria. Il modulo della velocità resta lo stesso.

?? Un protone gira in un campo uniforme. Se la sua velocità raddoppia, che cosa succede al tempo di un giro?
[ ] raddoppia
[ ] si dimezza
[x] resta uguale
[ ] diventa quattro volte tanto
=> Il raggio raddoppia, ma anche la velocità: il giro è lungo il doppio e si percorre al doppio della velocità. Infatti $T = 2\pi \cdot m / (q \cdot B)$ non contiene $v$.`
    },
    {
      id: 'forza-filo',
      titolo: 'La forza su un filo e fra due fili',
      testo: R`Un filo percorso da corrente è pieno di cariche in moto. In un campo magnetico ognuna sente la forza di Lorentz. Tutte insieme spingono il filo.

Prendiamo un tratto di filo lungo $\ell$, perpendicolare a B. Le cariche in moto nel tratto sono $Q$ in tutto, con velocità $v$.

~ F = Q \cdot v \cdot B :: la forza di Lorentz su tutte le cariche in moto del tratto
~ F = Q \cdot \dfrac{\ell}{\Delta t} \cdot B :: in un tempo $\Delta t = \ell / v$ tutte quelle cariche escono dal tratto
~ F = \dfrac{Q}{\Delta t} \cdot \ell \cdot B = \evidb{I \cdot \ell \cdot B} :: carica che passa diviso tempo: è la corrente

>* Un filo lungo $\ell$ è percorso dalla corrente $I$ in un campo uniforme B. Sul filo agisce la forza $F = I \cdot \ell \cdot B \cdot \sin\alpha$. Qui $\alpha$ è l'angolo fra il filo e B. Il verso si trova con la mano destra aperta, con il pollice lungo la corrente.

Due fili paralleli percorsi da corrente si fanno forza a vicenda: ognuno sta nel campo magnetico dell'altro.

[[video:magnetismo/due-fili]]

Il filo 1 crea, alla distanza $d$, il campo $B_1 = \dfrac{\mu_0 \cdot I_1}{2\pi \cdot d}$. Sul filo 2 agisce $F = I_2 \cdot \ell \cdot B_1$, cioè:

$$\dfrac{F}{\ell} = \dfrac{\mu_0 \cdot I_1 \cdot I_2}{2\pi \cdot d}$$

>* Due fili paralleli con le correnti **nello stesso verso si attraggono**. Con le correnti in **versi opposti si respingono**. È il contrario delle cariche elettriche.

[[grafico:due-fili]]

~ \dfrac{F}{\ell} = \dfrac{\mu_0}{2\pi} \cdot \dfrac{I_1 \cdot I_2}{d} :: due fili a 4 cm, con 5 A e 20 A
~ \dfrac{F}{\ell} = 2 \cdot 10^{-7}\,\tfrac{\text{T} \cdot \text{m}}{\text{A}} \cdot \dfrac{5\,\text{A} \cdot 20\,\text{A}}{0{,}04\,\text{m}} :: la distanza in metri
~ \dfrac{F}{\ell} = \evidb{5 \cdot 10^{-4}\,\text{N/m}} :: mezzo millinewton per ogni metro di filo

Fino al 2019 questa forza definiva l'**ampere**. Due fili a 1 m, con 1 A ciascuno, si fanno una forza di $2 \cdot 10^{-7}\,\text{N}$ per ogni metro. Oggi l'ampere si definisce fissando il valore della carica elementare.

>! Sul filo 1 agisce una forza uguale e opposta a quella sul filo 2, anche se le correnti sono diverse. È il terzo principio della dinamica.

?? Due fili paralleli hanno correnti di 2 A e 8 A, nello stesso verso. Quale filo sente la forza più grande?
[ ] quello con 8 A
[ ] quello con 2 A
[x] sentono forze uguali, e si attraggono
[ ] sentono forze uguali, e si respingono
=> La formula $F/\ell = \mu_0 \cdot I_1 \cdot I_2 / (2\pi \cdot d)$ contiene tutte e due le correnti: vale per i due fili. Con le correnti nello stesso verso i fili si attraggono.`
    },
    {
      id: 'motore',
      titolo: 'La spira nel campo e il motore elettrico',
      testo: R`Mettiamo una spira rettangolare in un campo uniforme, libera di girare attorno a un asse. Sui due lati lunghi, lunghi $\ell$, la corrente va in versi opposti. Le due forze, ognuna $I \cdot \ell \cdot B$, sono opposte: non spostano la spira, ma la fanno girare.

[[video:magnetismo/motore]]

Il momento di ogni forza è forza per braccio. Il braccio dipende da come è girata la spira. È massimo quando il piano della spira è parallelo a B, zero quando è perpendicolare. Sia $a$ il lato corto della spira, e $\alpha$ l'angolo fra B e la perpendicolare alla spira. Il braccio di ogni forza è $b = \tfrac{a}{2} \cdot \sin\alpha$.

[[grafico:spira]]

~ M = 2 \cdot F \cdot b = 2 \cdot F \cdot \tfrac{a}{2} \cdot \sin\alpha :: due forze, ognuna con il braccio $b$
~ M = I \cdot \ell \cdot B \cdot a \cdot \sin\alpha :: metto $F = I \cdot \ell \cdot B$
~ M = \evidb{I \cdot S \cdot B \cdot \sin\alpha} :: $\ell \cdot a$ è l'area $S$ della spira

>* Una bobina ha $N$ spire di area $S$ ed è percorsa dalla corrente $I$. Il campo B fa su di lei un momento $M = N \cdot I \cdot S \cdot B \cdot \sin\alpha$. Qui $\alpha$ è l'angolo fra B e la perpendicolare al piano della spira.

Il prodotto $N \cdot I \cdot S$ si chiama **momento magnetico** della bobina. Più spire, più corrente, più area: più momento.

~ M = N \cdot I \cdot S \cdot B :: 50 spire di 4 cm per 3 cm, 0,2 A, campo di 0,5 T, $\sin\alpha = 1$
~ M = 50 \cdot 0{,}2\,\text{A} \cdot 1{,}2 \cdot 10^{-3}\,\text{m}^2 \cdot 0{,}5\,\text{T} :: l'area è $12\,\text{cm}^2 = 1{,}2 \cdot 10^{-3}\,\text{m}^2$
~ M = \evidb{6 \cdot 10^{-3}\,\text{N} \cdot \text{m}} :: il momento più grande, con la spira parallela alle linee

Lasciata libera, la spira gira fino a mettersi perpendicolare a B. Lì si ferma, dopo qualche oscillazione. Per farla girare sempre serve il **commutatore**: un anello tagliato in due metà, sull'asse. Due spazzole ferme portano la corrente. A ogni mezzo giro la corrente nella spira si inverte, e il momento spinge sempre nello stesso verso.

[[grafico:momento]]

>! Con il piano della spira perpendicolare a B le forze ci sono, ma il momento è zero: tirano lungo la stessa retta. Il momento è massimo con il piano della spira parallelo alle linee.

?? Con il piano parallelo alle linee di campo, una spira sente un momento di 0,04 N·m. Quanto vale con il piano perpendicolare alle linee?
[ ] 0,04 N·m
[ ] 0,02 N·m
[x] zero
[ ] 0,08 N·m
=> Con il piano perpendicolare a B, la perpendicolare alla spira è parallela a B: $\alpha = 0°$ e $\sin\alpha = 0$. Le due forze tirano in versi opposti lungo la stessa retta.`
    },
    {
      id: 'solenoide',
      titolo: 'Il solenoide e l\'elettromagnete',
      testo: R`Prima del solenoide, una spira sola: un filo piegato a cerchio, di raggio $R$. Ogni pezzetto di filo crea il suo campo. Al centro questi campi hanno tutti lo stesso verso, e si sommano. Il verso si trova con la mano destra: le dita girano come la corrente, il pollice dà B.

>* Una **spira circolare** ha raggio $R$ ed è percorsa dalla corrente $I$. Al centro il campo è perpendicolare alla spira e vale $B = \dfrac{\mu_0 \cdot I}{2 \cdot R}$.

~ B = \dfrac{\mu_0 \cdot I}{2 \cdot R} :: una spira di raggio 6 cm, con 3 A
~ B = \dfrac{4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A} \cdot 3\,\text{A}}{2 \cdot 0{,}06\,\text{m}} :: il raggio va in metri
~ B \approx \evidb{3{,}1 \cdot 10^{-5}\,\text{T}} :: un po' meno del campo della Terra

Con $N$ spire avvolte una sull'altra il campo è $N$ volte più grande. Una spira da sola, però, crea un campo debole. Dentro la spira le linee vanno tutte nello stesso verso. Se si mettono tante spire una accanto all'altra, i loro campi si sommano. Si ottiene un **solenoide**, cioè una bobina.

[[video:magnetismo/solenoide]]

Dentro un solenoide lungo le linee sono parallele e fitte: il campo è **uniforme**. Fuori è debole, e le linee si richiudono da un capo all'altro. Il solenoide si comporta come una calamita a sbarra: il polo nord è il capo da cui escono le linee.

Il verso si trova con la mano destra: le dita chiuse come la corrente nelle spire, il pollice dà B dentro il solenoide.

>* Dentro un solenoide lungo il campo è uniforme e vale $B = \mu_0 \cdot n \cdot I$. Qui $n = N / \ell$ è il numero di **spire per metro**: $N$ spire su una lunghezza $\ell$.

~ n = \dfrac{N}{\ell} = \dfrac{450}{0{,}30\,\text{m}} :: 450 spire su 30 cm, con una corrente di 2 A
~ n = 1500\,\text{m}^{-1} :: le spire per ogni metro
~ B = 4\pi \cdot 10^{-7}\,\tfrac{\text{T} \cdot \text{m}}{\text{A}} \cdot 1500\,\text{m}^{-1} \cdot 2\,\text{A} :: $B = \mu_0 \cdot n \cdot I$
~ B \approx \evidb{3{,}8 \cdot 10^{-3}\,\text{T}} :: circa 75 volte il campo della Terra

Conta la densità delle spire, non il loro numero: le stesse spire su una lunghezza doppia danno metà campo. Il raggio della bobina non c'entra, se il solenoide è lungo.

[[grafico:solenoide]]

Con un cilindro di ferro dentro, il campo diventa centinaia o migliaia di volte più intenso. È un **elettromagnete**: una calamita che si accende con la corrente e si spegne aprendo il circuito. Si usa nelle gru dei rottamatori, nei campanelli, nelle serrature elettriche.

>! In $B = \mu_0 \cdot n \cdot I$, $n$ non è il numero di spire: è il numero di spire **per metro**. Cento spire su 10 cm danno $n = 1000\,\text{m}^{-1}$.

?? Un solenoide ha 300 spire su 15 cm. Lo si allunga fino a 30 cm, con le stesse spire e la stessa corrente. Il campo dentro…
[ ] raddoppia
[x] si dimezza
[ ] resta uguale
[ ] diventa un quarto
=> Le spire per metro passano da 2000 a 1000: $n$ si dimezza, e con lui $B = \mu_0 \cdot n \cdot I$. Il numero totale di spire non basta a dire il campo.`
    },
    {
      id: 'flusso-circuitazione',
      titolo: 'Flusso e circuitazione di B',
      testo: R`Per il campo elettrico ci sono il flusso e il teorema di Gauss. Il flusso del campo magnetico si definisce allo stesso modo.

>* Il **flusso del campo magnetico** attraverso una superficie piana $S$, in un campo uniforme, è $\Phi = B \cdot S \cdot \cos\alpha$. Qui $\alpha$ è l'angolo fra B e la perpendicolare alla superficie. Si misura in **weber**: $1\,\text{Wb} = 1\,\text{T} \cdot \text{m}^2$.

Con una superficie chiusa però le cose vanno in modo diverso dal campo elettrico.

[[video:magnetismo/flusso]]

Le linee di B sono chiuse: non partono da nessuna parte. Ogni linea che entra in una superficie chiusa deve anche uscirne. Le linee del campo elettrico invece partono dalle cariche positive.

>* **Teorema di Gauss per il campo magnetico**: il flusso di B attraverso una qualunque superficie chiusa è zero. Vuol dire che non esistono cariche magnetiche, cioè poli isolati.

[[grafico:gauss-b]]

Ora facciamo un giro chiuso attorno a un filo, a piccoli passi. A ogni passo moltiplichiamo la componente di B lungo il cammino per la lunghezza del passo. La somma su tutto il giro è la **circuitazione** di B, $\Gamma_B$.

[[video:magnetismo/ampere]]

Su un cerchio attorno al filo, B è tangente e ha sempre lo stesso modulo. Allora la circuitazione è B per la circonferenza:

~ \Gamma_B = B \cdot 2\pi \cdot r :: B lungo il cammino, uguale in ogni punto del cerchio
~ \Gamma_B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r} \cdot 2\pi \cdot r :: metto il campo del filo
~ \Gamma_B = \evidb{\mu_0 \cdot I} :: il raggio si semplifica

>* **Teorema di Ampère**: lungo una qualunque linea chiusa la circuitazione di B è $\Gamma_B = \mu_0 \cdot I_c$. Qui $I_c$ è la somma delle correnti **abbracciate** dalla linea, ognuna con il suo segno.

Le correnti fuori dalla linea non contano. Girando in senso antiorario, la corrente che esce dal foglio conta con il più, quella che entra con il meno.

[[grafico:ampere]]

Per il campo elettrostatico questa somma fa sempre zero. È un altro modo di dire che la forza elettrostatica è conservativa: su un giro chiuso il suo lavoro è zero. Per B invece no. Il campo magnetico **non è conservativo**, e non ha un potenziale come il campo elettrostatico.

?? Una linea chiusa abbraccia una corrente di 5 A che esce dal foglio e una di 5 A che entra. Fuori ce n'è una di 9 A. Quanto vale la circuitazione di B?
[x] zero
[ ] $\mu_0 \cdot 9\,\text{A}$
[ ] $\mu_0 \cdot 10\,\text{A}$
[ ] $\mu_0 \cdot 19\,\text{A}$
=> Contano solo le correnti abbracciate, con il segno: $5 - 5 = 0$. La corrente di fuori non entra nel conto, anche se il suo campo c'è.`
    },
    {
      id: 'materia',
      titolo: 'Il campo magnetico nella materia',
      testo: R`Una calamita attira il ferro, ma il rame sembra non sentirla nemmeno. In realtà tutti i materiali rispondono a un campo magnetico, in modi molto diversi.

[[video:magnetismo/ferro]]

Negli atomi gli elettroni sono piccole correnti. Così ogni atomo può essere una piccola calamita. Da come si comportano queste calamite nasce la differenza fra i materiali.

- **Diamagnetici** (rame, acqua, oro): gli atomi non sono calamite. Il campo esterno crea un piccolo campo opposto, e il materiale è respinto appena appena. Succede in tutti i materiali, ma è debolissimo.
- **Paramagnetici** (alluminio, ossigeno): ogni atomo è una piccola calamita orientata a caso. Il campo le allinea un poco, l'agitazione termica le rimescola. Il materiale è attratto debolmente.
- **Ferromagnetici** (ferro, nichel, cobalto): gli atomi vicini si allineano da soli, a gruppi, nei **domini di Weiss**. Nel campo crescono i domini allineati, e il campo diventa molto più intenso.

>* La **permeabilità magnetica relativa** $\mu_r$ dice quante volte un materiale moltiplica il campo: $B = \mu_r \cdot B_0$. Qui $B_0$ è il campo che ci sarebbe nel vuoto.

| materiale | $\mu_r$ |
|---|---|
| rame (diamagnetico) | $0{,}99999$ |
| alluminio (paramagnetico) | $1{,}00002$ |
| ferro (ferromagnetico) | da centinaia a migliaia |

~ B = \mu_r \cdot B_0 :: un solenoide da 0,5 mT, con un nucleo di ferro di $\mu_r = 800$
~ B = 800 \cdot 0{,}5\,\text{mT} = 400\,\text{mT} :: il ferro moltiplica il campo
~ B = \evidb{0{,}4\,\text{T}} :: senza ferro servirebbe una corrente 800 volte più grande

Il campo nel ferro però non cresce all'infinito. Verso i 2 T i domini sono tutti allineati: il ferro è **saturo**. Tolto il campo, nel ferro dolce i domini tornano in disordine. In certi acciai invece restano allineati: così si fanno le calamite permanenti.

Sopra la **temperatura di Curie**, 770 °C per il ferro, l'agitazione termica rompe i domini. Il ferro diventa paramagnetico.

>! Il rame non è «non magnetico». È diamagnetico: il campo lo respinge, ma così poco che una calamita non lo smuove.

?? Un pezzo di ferro magnetizzato viene scaldato oltre i 770 °C. Che cosa succede?
[ ] diventa una calamita più forte
[ ] il nord e il sud si scambiano
[x] perde la magnetizzazione
[ ] diventa diamagnetico
=> Sopra la temperatura di Curie l'agitazione termica distrugge i domini di Weiss. Il ferro diventa paramagnetico: è attratto appena, e non è più una calamita.`
    }
  ],
  grafici: {
    /* la calamita a sbarra con le linee calcolate e cinque aghi di bussola (nord scuro, sud chiaro) */
    calamita: {
      tipo: 'piano', x: [-2.8, 2.8], y: [-3.4, 3.4], altezza: 720, assi: false, griglia: false,
      elementi: sbarra().concat(lineeCalamita(), asseCalamita(), ago(0, 2.75, -1, 0), ago(0, -2.75, -1, 0), ago(2.05, 0, 1, 0), ago(-2.05, 0, 1, 0),
        ago(1.95, 1.7, 0.102, 0.995), lettereSbarra()),
      didascalia: 'Le linee del campo di una calamita a sbarra, calcolate. Escono dal polo nord (scuro), rientrano nel polo sud (chiaro) e dentro la calamita proseguono: sono chiuse. Gli aghi delle bussole si mettono lungo le linee, con la punta nord (scura) nel verso di B.'
    },
    /* il filo di Oersted visto di punta: cerchi di campo, verso con la mano destra, B nel punto P lungo come I/r */
    filo: {
      tipo: 'piano', x: [-5, 5], y: [-5.4, 5.3], altezza: 560, assi: false, griglia: false,
      parametri: [
        { nome: 'I', min: 2, max: 10, passo: 1, valore: 6, etichetta: 'I (A)' },
        { nome: 'r', min: 1.5, max: 4, passo: 0.5, valore: 3, decimali: 1, etichetta: 'r (cm)' },
        { nome: 's', min: -1, max: 1, passo: 2, valore: 1, etichetta: 'verso di I (1 esce, −1 entra)' }
      ],
      elementi: [
        { tipo: 'cerchio', centro: [0, 0], raggio: 1, colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 2, colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 3, colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: 4, colore: 3 },
        { tipo: 'vettore', da: ['0.3*s', 2], a: ['-0.3*s', 2], colore: 3 },
        { tipo: 'vettore', da: ['0.3*s', 4], a: ['-0.3*s', 4], colore: 3 },
        { tipo: 'vettore', da: ['-0.3*s', -2], a: ['0.3*s', -2], colore: 3 },
        { tipo: 'vettore', da: ['-0.3*s', -4], a: ['0.3*s', -4], colore: 3 },
        { tipo: 'segmento', da: [0, 0], a: ['r', 0], colore: 'grigio', tratteggio: true },
        { tipo: 'uscente', p: ['se(s > 0, 0, sqrt(-1))', 0], raggio: 12, colore: 4 },
        { tipo: 'entrante', p: ['se(s < 0, 0, sqrt(-1))', 0], raggio: 12, colore: 4 },
        { tipo: 'vettore', da: ['r', 0], a: ['r', '0.75*s*I/r'], etichetta: 'B', colore: 3, posizione: 'destra' },
        { tipo: 'punto', p: ['r', 0], etichetta: 'P', posizione: 'basso', colore: 'grigio' },
        { tipo: 'testo', p: [4.9, -5.1], testo: 'B = {{20*I/r|0}} μT', ancora: 'end', colore: 3 },
        { tipo: 'testo', p: [-4.9, -5.1], testo: '{{? s > 0 | I esce dal foglio (⊙) | I entra nel foglio (⊗)}}', ancora: 'start', colore: 4 }
      ],
      didascalia: 'Un filo perpendicolare al foglio e le sue linee di campo: cerchi attorno al filo, percorsi come dice la mano destra. La freccia B nel punto P, alla distanza r, è lunga in proporzione a B = μ₀·I/(2π·r). Il terzo cursore inverte la corrente.'
    },
    /* il verso della forza di Lorentz: stessa velocità, cariche di segno opposto, forze opposte */
    'verso-forza': {
      tipo: 'piano', x: [-5.2, 5.2], y: [-2.9, 2.9], altezza: 360, assi: false, griglia: false,
      elementi: [
        { tipo: 'entrante', da: [-4.5, -2.25], a: [4.5, 2.25], passo: 1.5, raggio: 8, colore: 3 },
        { tipo: 'vettore', da: [-3.75, -1.5], a: [-1.75, -1.5], etichetta: 'v', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [-3.75, -1.5], a: [-3.75, 0.5], etichetta: 'F', colore: 2 },
        { tipo: 'punto', p: [-3.75, -1.5], raggio: 13, vuoto: true, colore: 4 },
        { tipo: 'testo', p: [-3.75, -1.58], testo: '+', colore: 4 },
        { tipo: 'vettore', da: [2.25, 1.5], a: [4.25, 1.5], etichetta: 'v', colore: 1 },
        { tipo: 'vettore', da: [2.25, 1.5], a: [2.25, -0.5], etichetta: 'F', colore: 2 },
        { tipo: 'punto', p: [2.25, 1.5], raggio: 13, vuoto: true, colore: 1 },
        { tipo: 'testo', p: [2.25, 1.42], testo: '−', colore: 1 }
      ],
      didascalia: 'Il campo B entra nel foglio (⊗, in verde). Una carica positiva che va verso destra è spinta verso l\'alto; una negativa con la stessa velocità, verso il basso. In tutti e due i casi F è perpendicolare a v e a B.'
    },
    /* il protone che gira in un campo uniforme: r = m·v/(q·B), periodo che dipende solo da B */
    lorentz: {
      tipo: 'piano', x: [-12, 12], y: [-12.6, 11.6], altezza: 560, assi: false, griglia: false,
      parametri: [
        { nome: 'v', min: 0.5, max: 1.5, passo: 0.25, valore: 1, decimali: 2, etichetta: 'v (10⁶ m/s)' },
        { nome: 'B', min: 0.15, max: 0.3, passo: 0.05, valore: 0.2, decimali: 2, etichetta: 'B (T)' }
      ],
      elementi: [
        { tipo: 'entrante', da: [-10, -10], a: [10, 10], passo: 4, raggio: 8, colore: 3 },
        { tipo: 'cerchio', centro: [0, 0], raggio: '1.044*v/B', colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [0, '-1.044*v/B'], a: ['4*v', '-1.044*v/B'], etichetta: 'v', colore: 1, posizione: 'destra' },
        { tipo: 'vettore', da: [0, '-1.044*v/B'], a: [0, '-1.044*v/B + 10*v*B'], etichetta: 'F', colore: 2 },
        { tipo: 'punto', p: [0, '-1.044*v/B'], raggio: 7, colore: 4 },
        { tipo: 'testo', p: [-11.7, -12.1], testo: 'r = {{1.044*v/B|1}} cm', ancora: 'start' },
        { tipo: 'testo', p: [11.7, -12.1], testo: 'giro in {{65.6/B|0}} ns', ancora: 'end' }
      ],
      didascalia: 'Un protone (viola) in un campo che entra nel foglio (⊗). La forza F è sempre perpendicolare alla velocità v e punta verso il centro: il protone gira in senso antiorario. Il raggio cresce con v e cala con B; il tempo di un giro dipende solo da B.'
    },
    /* due fili visti di punta: il filo 2 nel campo B₁ del filo 1; il verso di I₂ si può invertire */
    'due-fili': {
      tipo: 'piano', x: [-4.2, 4.2], y: [-3.25, 2.9], altezza: 440, assi: false, griglia: false,
      parametri: [{ nome: 's', min: -1, max: 1, passo: 2, valore: 1, etichetta: 'verso di I_2 (1 come I_1, −1 opposto)' }],
      elementi: [
        { tipo: 'cerchio', centro: [-1.2, 0], raggio: 2.4, colore: 3, tratteggio: true },
        { tipo: 'vettore', da: [1.2, 0], a: [1.2, 1.5], etichetta: 'B_1', colore: 3, posizione: 'destra' },
        { tipo: 'vettore', da: [1.2, 0], a: ['1.2 - 0.9*s', 0], etichetta: 'F', colore: 2 },
        { tipo: 'vettore', da: [-1.2, 0], a: ['-1.2 + 0.9*s', 0], etichetta: 'F', colore: 2, posizione: 'destra' },
        { tipo: 'uscente', p: [-1.2, 0], raggio: 12, etichetta: 'I_1', posizione: 'alto-sinistra', colore: 4 },
        { tipo: 'uscente', p: ['se(s > 0, 1.2, sqrt(-1))', 0], raggio: 12, etichetta: 'I_2', posizione: 'basso-destra', colore: 4 },
        { tipo: 'entrante', p: ['se(s < 0, 1.2, sqrt(-1))', 0], raggio: 12, etichetta: 'I_2', posizione: 'basso-destra', colore: 4 },
        { tipo: 'testo', p: [0, -3.0], testo: '{{? s > 0 | correnti nello stesso verso: si attraggono | correnti in versi opposti: si respingono}}', colore: 2 }
      ],
      didascalia: 'Due fili perpendicolari al foglio, con le correnti I₁ e I₂. Il filo 2 sta nel campo B₁ del filo 1 (il cerchio tratteggiato). Con le correnti nello stesso verso la forza F spinge ogni filo verso l\'altro; con I₂ invertita li allontana.'
    },
    /* la spira vista di taglio (lato corto a = 4 cm): due forze opposte, e il braccio b = (a/2)·sin α */
    spira: {
      tipo: 'piano', x: [-4.5, 4.5], y: [-3.9, 3.4], altezza: 460, assi: false, griglia: false,
      parametri: [{ nome: 'al', min: 0, max: 180, passo: 5, valore: 50, etichetta: 'angolo α (°)' }],
      elementi: [
        { tipo: 'vettore', da: [-4.2, 2.9], a: [4.2, 2.9], etichetta: 'B', colore: 3, spessore: 2 },
        { tipo: 'vettore', da: [-4.2, -2.9], a: [4.2, -2.9], colore: 3, spessore: 2 },
        { tipo: 'segmento', da: ['2*sin(al*pi/180)', '-2*cos(al*pi/180)'], a: ['-2*sin(al*pi/180)', '2*cos(al*pi/180)'], colore: 'grigio' },
        { tipo: 'segmento', da: [0, '2*cos(al*pi/180)'], a: ['-2*sin(al*pi/180)', '2*cos(al*pi/180)'], colore: 'grigio', tratteggio: true, etichetta: 'b' },
        { tipo: 'angolo', vertice: [0, 0], da: [1, 0], a: ['cos(al*pi/180)', 'sin(al*pi/180)'], raggio: 0.55, colore: 'grigio', etichetta: 'α' },
        { tipo: 'vettore', da: [0, 0], modulo: 1.8, angolo: 'al', etichetta: 'n', colore: 'grigio' },
        { tipo: 'vettore', da: ['-2*sin(al*pi/180)', '2*cos(al*pi/180)'], a: ['-2*sin(al*pi/180)', '2*cos(al*pi/180) + 1.3'], etichetta: 'F', colore: 2 },
        { tipo: 'vettore', da: ['2*sin(al*pi/180)', '-2*cos(al*pi/180)'], a: ['2*sin(al*pi/180)', '-2*cos(al*pi/180) - 1.3'], etichetta: 'F', colore: 2 },
        { tipo: 'uscente', p: ['-2*sin(al*pi/180)', '2*cos(al*pi/180)'], raggio: 11, colore: 4 },
        { tipo: 'entrante', p: ['2*sin(al*pi/180)', '-2*cos(al*pi/180)'], raggio: 11, colore: 4 },
        { tipo: 'punto', p: [0, 0], colore: 'grigio' },
        { tipo: 'testo', p: [0, -3.65], testo: 'braccio b = (a/2)·sin α = {{2*sin(al*pi/180)|2}} cm' }
      ],
      didascalia: 'La spira vista lungo l\'asse di rotazione (il punto al centro): sopra la corrente esce dal foglio, sotto entra. Le due forze F sono opposte e verticali; il braccio b è la distanza orizzontale dall\'asse. α è l\'angolo fra B e la perpendicolare n alla spira: con α = 0 la spira è perpendicolare a B, il braccio è zero e non gira.'
    },
    /* il momento sulla spira mentre gira: senza commutatore cambia segno, con il commutatore no */
    momento: {
      tipo: 'piano', x: [0, 390], y: [-1.45, 1.45], altezza: 380, proporzioni: 'libere', passo: [90, 0.5],
      etichette: { x: 'α (°)', y: 'M / M_max' },
      funzioni: [
        { f: 'sin(x*pi/180)', dominio: [0, 360], colore: 2, tratteggio: true },
        { f: 'abs(sin(x*pi/180))', dominio: [0, 360], colore: 2 }
      ],
      elementi: [
        { tipo: 'testo', p: [270, 1.12], testo: 'con il commutatore', colore: 2 },
        { tipo: 'testo', p: [270, -1.3], testo: 'senza commutatore', colore: 2 }
      ],
      didascalia: 'Il momento sulla spira, diviso il suo valore massimo, mentre la spira gira (α è l\'angolo fra B e la perpendicolare alla spira). Senza commutatore (tratteggio) cambia segno a ogni mezzo giro: la spira oscilla e si ferma. Con il commutatore la corrente si inverte quando il momento passa per zero, e spinge sempre nello stesso verso.'
    },
    /* il solenoide tagliato lungo l'asse: ⊙ sopra, ⊗ sotto, campo uniforme dentro, nord a destra */
    solenoide: {
      tipo: 'piano', x: [-5.6, 5.6], y: [-2.7, 2.4], altezza: 380, assi: false, griglia: false,
      parametri: [
        { nome: 'n', min: 200, max: 1000, passo: 100, valore: 400, etichetta: 'n (spire al metro)' },
        { nome: 'I', min: 0.5, max: 3, passo: 0.5, valore: 1.5, decimali: 1, etichetta: 'I (A)' }
      ],
      elementi: [
        { tipo: 'uscente', da: [-4, 1.3], a: [4, 1.3], passo: 1, raggio: 10, colore: 4 },
        { tipo: 'entrante', da: [-4, -1.3], a: [4, -1.3], passo: 1, raggio: 10, colore: 4 },
        { tipo: 'vettore', da: ['-0.0015*n*I', 0.5], a: ['0.0015*n*I', 0.5], etichetta: 'B', colore: 3 },
        { tipo: 'vettore', da: ['-0.0015*n*I', -0.5], a: ['0.0015*n*I', -0.5], colore: 3 },
        { tipo: 'testo', p: [5.0, -0.08], testo: 'N' },
        { tipo: 'testo', p: [-5.0, -0.08], testo: 'S' },
        { tipo: 'testo', p: [0, -2.45], testo: 'B = μ₀·n·I = {{4*pi*n*I/10000|2}} mT', colore: 3 }
      ],
      didascalia: 'Un solenoide tagliato lungo l\'asse: sopra la corrente esce dal foglio (⊙), sotto entra (⊗). Dentro il campo è uniforme e va verso destra: quel capo è il polo nord. Le frecce sono lunghe in proporzione a B = μ₀·n·I.'
    },
    /* Gauss per B: una superficie chiusa (vista di taglio) attorno al polo nord, che si può spostare e allargare */
    'gauss-b': {
      tipo: 'piano', x: [-2.8, 2.8], y: [-3.4, 3.4], altezza: 720, assi: false, griglia: false,
      parametri: [
        { nome: 'cx', min: -2, max: 2, passo: 0.25, valore: 1.5, decimali: 2, etichetta: 'posizione' },
        { nome: 'ea', min: 0.4, max: 1.6, passo: 0.1, valore: 0.8, decimali: 1, etichetta: 'grandezza' }
      ],
      elementi: sbarra().concat(lineeCalamita(), asseCalamita(), lettereSbarra(), [
        { tipo: 'ellisse', centro: ['cx', 0], a: 'ea', b: '1.4*ea', colore: 'grigio', tratteggio: true }
      ]),
      didascalia: 'Una superficie chiusa vista di taglio (il tratteggio), di serie attorno al polo nord. Ogni linea che ne esce ci rientra da un\'altra parte, magari passando dentro la calamita: il flusso totale è zero. Con i cursori la superficie si sposta e si allarga, e il conto torna sempre.'
    },
    /* il teorema di Ampère: una linea chiusa percorsa in senso antiorario, due correnti dentro e una fuori */
    ampere: {
      tipo: 'piano', x: [-5, 5], y: [-3.4, 3.2], altezza: 440, assi: false, griglia: false,
      parametri: [
        { nome: 'I1', min: 1, max: 8, passo: 1, valore: 5, etichetta: 'I_1 (A)' },
        { nome: 'I2', min: 1, max: 8, passo: 1, valore: 2, etichetta: 'I_2 (A)' },
        { nome: 'I3', min: 1, max: 8, passo: 1, valore: 4, etichetta: 'I_3 (A)' }
      ],
      elementi: [
        { tipo: 'ellisse', centro: [-1, 0], a: 3, b: 2.4, colore: 'grigio', tratteggio: true },
        { tipo: 'vettore', da: [-0.6, 2.4], a: [-1.4, 2.4], colore: 'grigio' },
        { tipo: 'uscente', p: [-2.2, 0.6], raggio: 12, etichetta: 'I_1 = {{I1}} A', posizione: 'alto-destra', colore: 4 },
        { tipo: 'entrante', p: [0.2, -0.8], raggio: 12, etichetta: 'I_2 = {{I2}} A', posizione: 'sinistra', colore: 4 },
        { tipo: 'uscente', p: [2.7, 1.6], raggio: 12, etichetta: 'I_3 = {{I3}} A', posizione: 'destra', colore: 4 },
        { tipo: 'testo', p: [-1, -3.15], testo: 'corrente abbracciata: {{I1}} − {{I2}} = {{I1 - I2}} A', colore: 4 }
      ],
      didascalia: 'Una linea chiusa (il tratteggio) percorsa in senso antiorario. Abbraccia I₁, che esce dal foglio e conta con il più, e I₂, che entra e conta con il meno. I₃ è fuori e non conta: la circuitazione di B è μ₀ per la corrente abbracciata.'
    }
  },
  esempi: [
    {
      titolo: 'Il cavo che disturba la bussola',
      problema: R`Un cavo rettilineo porta una corrente continua di 25 A. A che distanza dal cavo il suo campo magnetico è uguale al campo della Terra, circa $5 \cdot 10^{-5}\,\text{T}$?`,
      passi: [
        R`Dati: $I = 25\,\text{A}$, $B = 5 \cdot 10^{-5}\,\text{T}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$. Cerco la distanza $r$.`,
        R`Parto dal campo di un filo, $B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$, e ricavo la distanza: $r = \dfrac{\mu_0 \cdot I}{2\pi \cdot B}$.`,
        R`Con $\dfrac{\mu_0}{2\pi} = 2 \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$: $r = \dfrac{2 \cdot 10^{-7} \cdot 25}{5 \cdot 10^{-5}}\,\text{m} = 0{,}1\,\text{m}$.`,
        R`Più vicino di 10 cm il campo del cavo supera quello della Terra, e la bussola non indica più il nord.`,
        R`Controllo: a $0{,}1\,\text{m}$ il campo è $B = 2 \cdot 10^{-7} \cdot \dfrac{25}{0{,}1}\,\text{T} = 5 \cdot 10^{-5}\,\text{T}$. Torna.`
      ],
      risultato: R`$r = 0{,}1\,\text{m} = 10\,\text{cm}$`
    },
    {
      titolo: 'Un elettrone in un campo uniforme',
      problema: R`Un elettrone entra a $5 \cdot 10^6\,\text{m/s}$ in un campo magnetico uniforme di 2 mT, perpendicolare alla sua velocità. Quanto vale la forza su di lui? Su che cerchio gira, e in quanto tempo fa un giro?`,
      passi: [
        R`Dati: $v = 5 \cdot 10^6\,\text{m/s}$, $B = 2 \cdot 10^{-3}\,\text{T}$, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$, $m = 9{,}11 \cdot 10^{-31}\,\text{kg}$, v perpendicolare a B. Cerco la forza $F$, il raggio $r$ e il periodo $T$.`,
        R`La forza di Lorentz, con $\sin 90° = 1$: $F = e \cdot v \cdot B = 1{,}60 \cdot 10^{-19} \cdot 5 \cdot 10^6 \cdot 2 \cdot 10^{-3}\,\text{N} = 1{,}6 \cdot 10^{-15}\,\text{N}$.`,
        R`Il raggio: $r = \dfrac{m \cdot v}{e \cdot B} = \dfrac{9{,}11 \cdot 10^{-31} \cdot 5 \cdot 10^6}{1{,}60 \cdot 10^{-19} \cdot 2 \cdot 10^{-3}}\,\text{m} \approx 1{,}42 \cdot 10^{-2}\,\text{m}$, cioè circa 1,4 cm.`,
        R`Il periodo, un giro diviso la velocità: $T = \dfrac{2\pi \cdot r}{v} = \dfrac{2\pi \cdot 1{,}42 \cdot 10^{-2}}{5 \cdot 10^6}\,\text{s} \approx 1{,}8 \cdot 10^{-8}\,\text{s}$.`,
        R`Controllo con la formula senza la velocità: $T = \dfrac{2\pi \cdot m}{e \cdot B} = \dfrac{2\pi \cdot 9{,}11 \cdot 10^{-31}}{3{,}2 \cdot 10^{-22}}\,\text{s} \approx 1{,}8 \cdot 10^{-8}\,\text{s}$. Torna.`
      ],
      risultato: R`$F = 1{,}6 \cdot 10^{-15}\,\text{N}$; $r \approx 1{,}4\,\text{cm}$; $T \approx 1{,}8 \cdot 10^{-8}\,\text{s}$`
    },
    {
      titolo: 'Lo spettrometro di massa',
      problema: R`In uno spettrometro gli ioni passano prima da un filtro di velocità: un campo elettrico di $2 \cdot 10^4\,\text{V/m}$ e un campo magnetico di 0,2 T, perpendicolari fra loro. Poi entrano in un campo di 0,25 T e fanno mezzo giro. Ci sono ioni di neon-20 e di neon-22, con carica $+e$ e masse di circa 20 u e 22 u ($1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}$). Quanto distano i punti in cui arrivano?`,
      passi: [
        R`Dati: $E = 2 \cdot 10^4\,\text{V/m}$ e $B_1 = 0{,}2\,\text{T}$ nel filtro, $B_2 = 0{,}25\,\text{T}$ dopo, $q = 1{,}60 \cdot 10^{-19}\,\text{C}$, masse $20\,\text{u}$ e $22\,\text{u}$. Cerco la distanza fra i due punti d'arrivo.`,
        R`Nel filtro vanno dritti solo gli ioni per cui la forza elettrica e quella magnetica si bilanciano: $q \cdot E = q \cdot v \cdot B_1$. Quindi $v = \dfrac{E}{B_1} = \dfrac{2 \cdot 10^4}{0{,}2}\,\text{m/s} = 1 \cdot 10^5\,\text{m/s}$, per tutti e due gli isotopi.`,
        R`Il raggio del neon-20: $r_{20} = \dfrac{m \cdot v}{q \cdot B_2} = \dfrac{20 \cdot 1{,}661 \cdot 10^{-27} \cdot 10^5}{1{,}60 \cdot 10^{-19} \cdot 0{,}25}\,\text{m} \approx 0{,}0831\,\text{m}$.`,
        R`A parità di carica, velocità e campo, il raggio è proporzionale alla massa: $r_{22} = r_{20} \cdot \dfrac{22}{20} \approx 0{,}0914\,\text{m}$.`,
        R`Dopo mezzo giro ogni ione arriva a un diametro dall'ingresso. La distanza fra i due punti è $2 \cdot (r_{22} - r_{20}) \approx 2 \cdot 0{,}0083\,\text{m} \approx 0{,}017\,\text{m}$.`
      ],
      risultato: R`I due isotopi arrivano a circa $1{,}7\,\text{cm}$ l'uno dall'altro.`
    },
    {
      titolo: 'Due cavi paralleli',
      problema: R`Due cavi paralleli, lunghi 2 m e distanti 6 cm, portano correnti di 8 A e 12 A in versi opposti. Quanto vale la forza fra i due cavi? Si attraggono o si respingono?`,
      passi: [
        R`Dati: $I_1 = 8\,\text{A}$, $I_2 = 12\,\text{A}$ in versi opposti, $d = 0{,}06\,\text{m}$, $\ell = 2\,\text{m}$. Cerco la forza $F$ e il suo verso.`,
        R`Il campo del primo cavo dove sta il secondo: $B_1 = 2 \cdot 10^{-7} \cdot \dfrac{8}{0{,}06}\,\text{T} \approx 2{,}67 \cdot 10^{-5}\,\text{T}$.`,
        R`La forza sul secondo cavo, perpendicolare a $B_1$: $F = I_2 \cdot \ell \cdot B_1 = 12 \cdot 2 \cdot 2{,}67 \cdot 10^{-5}\,\text{N} \approx 6{,}4 \cdot 10^{-4}\,\text{N}$.`,
        R`Le correnti hanno versi opposti, quindi i cavi si respingono. Sul primo cavo agisce la stessa forza, nel verso opposto.`,
        R`Controllo con la formula dei due fili: $F = \dfrac{\mu_0}{2\pi} \cdot \dfrac{I_1 \cdot I_2 \cdot \ell}{d} = 2 \cdot 10^{-7} \cdot \dfrac{8 \cdot 12 \cdot 2}{0{,}06}\,\text{N} = 6{,}4 \cdot 10^{-4}\,\text{N}$. Torna.`
      ],
      risultato: R`$F \approx 6{,}4 \cdot 10^{-4}\,\text{N}$, e i cavi si respingono.`
    },
    {
      titolo: 'Il motorino di un giocattolo',
      problema: R`La bobina di un motorino ha 100 spire rettangolari di 2 cm per 3 cm ed è percorsa da 0,3 A. Il campo dei magneti vale 0,2 T. Quanto vale il momento massimo? E quanto vale quando l'angolo fra B e la perpendicolare alla bobina è 30°?`,
      passi: [
        R`Dati: $N = 100$, $S = 2\,\text{cm} \cdot 3\,\text{cm} = 6\,\text{cm}^2 = 6 \cdot 10^{-4}\,\text{m}^2$, $I = 0{,}3\,\text{A}$, $B = 0{,}2\,\text{T}$. Cerco il momento massimo e quello a $\alpha = 30°$.`,
        R`Il momento è massimo con $\sin\alpha = 1$, cioè con il piano della bobina parallelo a B: $M = N \cdot I \cdot S \cdot B = 100 \cdot 0{,}3 \cdot 6 \cdot 10^{-4} \cdot 0{,}2\,\text{N} \cdot \text{m} = 3{,}6 \cdot 10^{-3}\,\text{N} \cdot \text{m}$.`,
        R`A $30°$: $\sin 30° = 0{,}5$, quindi $M = 3{,}6 \cdot 10^{-3} \cdot 0{,}5\,\text{N} \cdot \text{m} = 1{,}8 \cdot 10^{-3}\,\text{N} \cdot \text{m}$.`,
        R`Con $\alpha = 0°$ il momento è zero. Proprio lì il commutatore inverte la corrente, e la bobina continua a girare.`,
        R`Controllo delle unità: $\text{A} \cdot \text{m}^2 \cdot \text{T} = \text{A} \cdot \text{m}^2 \cdot \dfrac{\text{N}}{\text{A} \cdot \text{m}} = \text{N} \cdot \text{m}$. Torna.`
      ],
      risultato: R`$M_{max} = 3{,}6 \cdot 10^{-3}\,\text{N} \cdot \text{m}$; a $30°$, $M = 1{,}8 \cdot 10^{-3}\,\text{N} \cdot \text{m}$`
    },
    {
      titolo: 'Un elettromagnete',
      problema: R`Un solenoide ha 500 spire su 25 cm ed è percorso da 0,8 A. Quanto vale il campo dentro? E con un nucleo di ferro di permeabilità relativa 300?`,
      passi: [
        R`Dati: $N = 500$, $\ell = 0{,}25\,\text{m}$, $I = 0{,}8\,\text{A}$, $\mu_r = 300$. Cerco il campo $B_0$ senza nucleo e il campo $B$ con il nucleo.`,
        R`Le spire per metro: $n = \dfrac{N}{\ell} = \dfrac{500}{0{,}25\,\text{m}} = 2000\,\text{m}^{-1}$.`,
        R`Senza nucleo: $B_0 = \mu_0 \cdot n \cdot I = 4\pi \cdot 10^{-7} \cdot 2000 \cdot 0{,}8\,\text{T} \approx 2{,}0 \cdot 10^{-3}\,\text{T}$.`,
        R`Con il ferro il campo si moltiplica per $\mu_r$: $B = \mu_r \cdot B_0 = 300 \cdot 2{,}0 \cdot 10^{-3}\,\text{T} \approx 0{,}60\,\text{T}$.`,
        R`Controllo: 0,6 T è sotto i 2 T circa a cui il ferro si satura. Il conto con $\mu_r$ costante è ragionevole.`
      ],
      risultato: R`$B_0 \approx 2{,}0\,\text{mT}$ senza nucleo; $B \approx 0{,}60\,\text{T}$ con il ferro`
    }
  ],
  formulario: [
    { nome: 'Campo di un filo rettilineo (Biot-Savart)', formula: R`B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}`, nota: R`Linee a cerchi attorno al filo, verso con la mano destra. Con $\mu_0/(2\pi) = 2 \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.` },
    { nome: 'Permeabilità magnetica del vuoto', formula: R`\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}`, nota: R`Il tesla: $1\,\text{T} = 1\,\text{N}/(\text{A} \cdot \text{m})$.` },
    { nome: 'Forza di Lorentz', formula: R`F = q \cdot v \cdot B \cdot \sin\alpha`, nota: R`$\alpha$ è l'angolo fra v e B. In forma vettoriale $\vec{F} = q \cdot \vec{v} \wedge \vec{B}$: perpendicolare a v e a B.` },
    { nome: 'Carica in un campo uniforme', formula: R`r = \dfrac{m \cdot v}{q \cdot B} \qquad T = \dfrac{2\pi \cdot m}{q \cdot B}`, nota: R`Con v perpendicolare a B. Il periodo non dipende dalla velocità.` },
    { nome: 'Filtro di velocità', formula: R`v = \dfrac{E}{B}`, nota: R`Campo elettrico e magnetico perpendicolari: vanno dritte solo le cariche con questa velocità.` },
    { nome: 'Forza su un filo', formula: R`F = I \cdot \ell \cdot B \cdot \sin\alpha`, nota: R`$\alpha$ è l'angolo fra il filo e B. Verso con la mano destra aperta, pollice lungo la corrente.` },
    { nome: 'Forza fra due fili paralleli', formula: R`\dfrac{F}{\ell} = \dfrac{\mu_0 \cdot I_1 \cdot I_2}{2\pi \cdot d}`, nota: R`Correnti nello stesso verso: si attraggono. In versi opposti: si respingono.` },
    { nome: 'Momento su una bobina', formula: R`M = N \cdot I \cdot S \cdot B \cdot \sin\alpha`, nota: R`$\alpha$ è l'angolo fra B e la perpendicolare alla spira. $N \cdot I \cdot S$ è il momento magnetico.` },
    { nome: 'Centro di una spira', formula: R`B = \dfrac{\mu_0 \cdot I}{2 \cdot R}`, nota: R`$R$ raggio della spira; B perpendicolare alla spira. Con $N$ spire sovrapposte il campo è $N$ volte più grande.` },
    { nome: 'Campo dentro un solenoide', formula: R`B = \mu_0 \cdot n \cdot I \qquad n = \dfrac{N}{\ell}`, nota: R`$n$ in spire al metro. Campo uniforme dentro un solenoide lungo.` },
    { nome: 'Flusso del campo magnetico', formula: R`\Phi = B \cdot S \cdot \cos\alpha`, nota: R`In weber: $1\,\text{Wb} = 1\,\text{T} \cdot \text{m}^2$. $\alpha$ è l'angolo fra B e la perpendicolare alla superficie.` },
    { nome: 'Teorema di Gauss per B', formula: R`\Phi = 0`, nota: R`Attraverso qualunque superficie chiusa: le linee di B sono chiuse, non esistono poli isolati.` },
    { nome: 'Teorema di Ampère', formula: R`\Gamma_B = \mu_0 \cdot I_c`, nota: R`Lungo qualunque linea chiusa; $I_c$ è la corrente abbracciata, con il segno.` },
    { nome: 'Campo nella materia', formula: R`B = \mu_r \cdot B_0`, nota: R`$\mu_r$ appena sotto 1 nei diamagnetici, appena sopra 1 nei paramagnetici, da centinaia a migliaia nel ferro.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'calamite', tipo: 'concetto', fronte: R`Che cosa succede se spezzi una calamita?`, retro: R`Ogni pezzo ha di nuovo un polo nord e un polo sud. Un polo isolato non è mai stato trovato.` },
    { id: 'fc-02', sezione: 'calamite', tipo: 'definizione', fronte: R`Come si definiscono direzione e verso del **campo magnetico** in un punto?`, retro: R`Sono quelli in cui punta il nord di un ago magnetico messo in quel punto. Il campo si misura in tesla (T).` },
    { id: 'fc-03', sezione: 'calamite', tipo: 'concetto', fronte: R`Come sono fatte le **linee del campo** di una calamita?`, retro: R`Escono dal polo nord, entrano nel polo sud e proseguono dentro la calamita: sono chiuse. Dove sono fitte il campo è intenso.` },
    { id: 'fc-04', sezione: 'calamite', tipo: 'concetto', fronte: R`Che polo magnetico c'è vicino al Polo Nord geografico?`, retro: R`Un polo **sud** magnetico: è quello che attira il nord dell'ago della bussola.` },
    { id: 'fc-05', sezione: 'oersted', tipo: 'concetto', fronte: R`Che cosa mostrò l'esperimento di **Oersted** (1820)?`, retro: R`Che una corrente elettrica crea un campo magnetico: l'ago di una bussola sotto un filo ruota quando passa la corrente.` },
    { id: 'fc-06', sezione: 'oersted', tipo: 'formula', fronte: R`Il campo di un **filo rettilineo** lungo`, retro: R`$B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$, con $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$. Linee a cerchi attorno al filo.` },
    { id: 'fc-07', sezione: 'oersted', tipo: 'procedura', fronte: R`La **mano destra** per il campo di un filo`, retro: R`Il pollice nel verso della corrente: le dita chiuse attorno al filo girano come B.` },
    { id: 'fc-08', sezione: 'oersted', tipo: 'definizione', fronte: R`Che cosa vogliono dire i simboli ⊙ e ⊗?`, retro: R`⊙: il vettore esce dal foglio verso di te (la punta della freccia). ⊗: entra nel foglio (la coda).` },
    { id: 'fc-09', sezione: 'lorentz', tipo: 'formula', fronte: R`La **forza di Lorentz**`, retro: R`$F = q \cdot v \cdot B \cdot \sin\alpha$, perpendicolare a v e a B; in forma vettoriale $\vec{F} = q \cdot \vec{v} \wedge \vec{B}$.` },
    { id: 'fc-10', sezione: 'lorentz', tipo: 'procedura', fronte: R`Come si trova il verso della forza di Lorentz?`, retro: R`Mano destra aperta: pollice lungo v, dita lungo B, la forza esce dal palmo. Per una carica negativa il verso si capovolge.` },
    { id: 'fc-11', sezione: 'lorentz', tipo: 'concetto', fronte: R`La forza di Lorentz compie lavoro?`, retro: R`No: è sempre perpendicolare alla velocità. Cambia la direzione del moto, non il modulo della velocità.` },
    { id: 'fc-12', sezione: 'cariche-campo', tipo: 'formula', fronte: R`Raggio e periodo di una carica in un campo uniforme`, retro: R`$r = \dfrac{m \cdot v}{q \cdot B}$ e $T = \dfrac{2\pi \cdot m}{q \cdot B}$, con v perpendicolare a B. Il periodo non dipende da v.` },
    { id: 'fc-13', sezione: 'cariche-campo', tipo: 'concetto', fronte: R`Che traiettoria fa una carica con la velocità inclinata rispetto a B?`, retro: R`Un'elica: gira attorno alle linee di campo e intanto avanza lungo di esse.` },
    { id: 'fc-14', sezione: 'forza-filo', tipo: 'formula', fronte: R`La forza su un filo in un campo magnetico`, retro: R`$F = I \cdot \ell \cdot B \cdot \sin\alpha$, con $\alpha$ angolo fra il filo e B.` },
    { id: 'fc-15', sezione: 'forza-filo', tipo: 'concetto', fronte: R`Due fili paralleli con correnti nello stesso verso: si attraggono o si respingono?`, retro: R`Si attraggono; con versi opposti si respingono. Forza per metro: $\dfrac{\mu_0 \cdot I_1 \cdot I_2}{2\pi \cdot d}$.` },
    { id: 'fc-16', sezione: 'motore', tipo: 'formula', fronte: R`Il **momento** su una bobina in un campo magnetico`, retro: R`$M = N \cdot I \cdot S \cdot B \cdot \sin\alpha$, con $\alpha$ angolo fra B e la perpendicolare alla spira.` },
    { id: 'fc-17', sezione: 'motore', tipo: 'concetto', fronte: R`A che cosa serve il **commutatore** del motore?`, retro: R`Inverte la corrente nella spira a ogni mezzo giro: così il momento spinge sempre nello stesso verso e la spira non si ferma.` },
    { id: 'fc-18', sezione: 'solenoide', tipo: 'formula', fronte: R`Il campo dentro un **solenoide**`, retro: R`$B = \mu_0 \cdot n \cdot I$, uniforme, con $n = N/\ell$ spire **per metro**.` },
    { id: 'fc-19', sezione: 'solenoide', tipo: 'definizione', fronte: R`Che cos'è un **elettromagnete**?`, retro: R`Un solenoide con un nucleo di ferro: una calamita che si accende con la corrente e si spegne aprendo il circuito.` },
    { id: 'fc-20', sezione: 'flusso-circuitazione', tipo: 'concetto', fronte: R`Che cosa dice il **teorema di Gauss** per il campo magnetico?`, retro: R`Il flusso di B attraverso una qualunque superficie chiusa è zero: le linee sono chiuse e non esistono poli isolati.` },
    { id: 'fc-21', sezione: 'flusso-circuitazione', tipo: 'formula', fronte: R`Il **teorema di Ampère**`, retro: R`$\Gamma_B = \mu_0 \cdot I_c$: la circuitazione di B lungo una linea chiusa è $\mu_0$ per la corrente abbracciata, con il segno.` },
    { id: 'fc-22', sezione: 'flusso-circuitazione', tipo: 'concetto', fronte: R`Il campo magnetico è conservativo?`, retro: R`No: la sua circuitazione attorno a una corrente non è zero. Il campo elettrostatico invece ha circuitazione sempre zero.` },
    { id: 'fc-23', sezione: 'materia', tipo: 'definizione', fronte: R`Diamagnetici, paramagnetici, ferromagnetici: un esempio per tipo`, retro: R`Rame (respinto appena), alluminio (attratto appena), ferro (attratto con forza, domini di Weiss).` },
    { id: 'fc-24', sezione: 'materia', tipo: 'concetto', fronte: R`Che cos'è la **temperatura di Curie**?`, retro: R`La temperatura oltre la quale un ferromagnetico perde i domini e diventa paramagnetico: 770 °C per il ferro.` },
    { id: 'fc-25', sezione: 'solenoide', tipo: 'formula', fronte: R`Il campo al **centro di una spira** circolare`, retro: R`$B = \dfrac{\mu_0 \cdot I}{2 \cdot R}$, con $R$ il raggio, perpendicolare alla spira. Il verso con la mano destra.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Un filo rettilineo molto lungo porta una corrente di 4 A. Quanto vale il campo magnetico a 5 cm dal filo? Dai il risultato in microtesla.`, suggerimenti: [R`$B = \dfrac{\mu_0 \cdot I}{2\pi \cdot r}$, con $\dfrac{\mu_0}{2\pi} = 2 \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$ e la distanza in metri.`], risposta: { tipo: 'numero', valore: 16, unita: 'μT' }, soluzione: [R`$B = 2 \cdot 10^{-7} \cdot \dfrac{4}{0{,}05}\,\text{T} = 1{,}6 \cdot 10^{-5}\,\text{T} = 16\,\mu\text{T}$.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un filo rettilineo porta 12 A. Quanto vale il campo a 3 cm dal filo, in microtesla?`, suggerimenti: [R`Porta i centimetri in metri: $3\,\text{cm} = 0{,}03\,\text{m}$.`], risposta: { tipo: 'numero', valore: 80, unita: 'μT' }, soluzione: [R`$B = 2 \cdot 10^{-7} \cdot \dfrac{12}{0{,}03}\,\text{T} = 8 \cdot 10^{-5}\,\text{T} = 80\,\mu\text{T}$.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`A 3 cm da un filo il campo vale 45 μT. Quanto vale a 5 cm dallo stesso filo?`, suggerimenti: [R`Il campo di un filo è inversamente proporzionale alla distanza: $B \cdot r$ resta costante.`], risposta: { tipo: 'numero', valore: 27, unita: 'μT' }, soluzione: [R`$B \cdot r$ è costante: $45 \cdot 3 = B \cdot 5$, quindi $B = \dfrac{135}{5}\,\mu\text{T} = 27\,\mu\text{T}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 2, testo: R`Un filo porta 9 A. A che distanza dal filo il campo vale 36 μT? Rispondi in centimetri.`, suggerimenti: [R`Ricava la distanza: $r = \dfrac{\mu_0 \cdot I}{2\pi \cdot B}$.`, R`$36\,\mu\text{T} = 3{,}6 \cdot 10^{-5}\,\text{T}$.`], risposta: { tipo: 'numero', valore: 5, unita: 'cm' }, soluzione: [R`$r = \dfrac{2 \cdot 10^{-7} \cdot 9}{3{,}6 \cdot 10^{-5}}\,\text{m} = 0{,}05\,\text{m} = 5\,\text{cm}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 1, testo: R`Un protone ($q = 1{,}60 \cdot 10^{-19}\,\text{C}$) si muove a $2 \cdot 10^5\,\text{m/s}$, perpendicolare a un campo di 0,5 T. Quanto vale la forza di Lorentz?`, suggerimenti: [R`$F = q \cdot v \cdot B$, perché $\sin 90° = 1$.`], risposta: { tipo: 'numero', valore: 1.6e-14, unita: 'N' }, soluzione: [R`$F = 1{,}60 \cdot 10^{-19} \cdot 2 \cdot 10^5 \cdot 0{,}5\,\text{N} = 1{,}60 \cdot 10^{-14}\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`In un filtro di velocità il campo elettrico vale 3000 V/m e il campo magnetico, perpendicolare, 0,02 T. Che velocità hanno le cariche che passano dritte? Rispondi in km/s.`, suggerimenti: [R`Le due forze si bilanciano: $q \cdot E = q \cdot v \cdot B$.`], risposta: { tipo: 'numero', valore: 150, unita: 'km/s' }, soluzione: [R`$v = \dfrac{E}{B} = \dfrac{3000}{0{,}02}\,\text{m/s} = 1{,}5 \cdot 10^5\,\text{m/s} = 150\,\text{km/s}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 2, testo: R`Una carica di 3 μC si muove a 400 m/s in un campo di 0,5 T. La velocità forma un angolo di 30° con il campo. Quanto vale la forza?`, suggerimenti: [R`$F = q \cdot v \cdot B \cdot \sin\alpha$, con $\sin 30° = 0{,}5$.`, R`$3\,\mu\text{C} = 3 \cdot 10^{-6}\,\text{C}$.`], risposta: { tipo: 'numero', valore: 3e-4, unita: 'N' }, soluzione: [R`$F = 3 \cdot 10^{-6} \cdot 400 \cdot 0{,}5 \cdot 0{,}5\,\text{N} = 3 \cdot 10^{-4}\,\text{N}$.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Un filo lungo 0,5 m, percorso da 6 A, è perpendicolare a un campo di 0,2 T. Quanto vale la forza sul filo?`, suggerimenti: [R`$F = I \cdot \ell \cdot B$, con il filo perpendicolare al campo.`], risposta: { tipo: 'numero', valore: 0.6, unita: 'N' }, soluzione: [R`$F = 6\,\text{A} \cdot 0{,}5\,\text{m} \cdot 0{,}2\,\text{T} = 0{,}6\,\text{N}$.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Un filo lungo 2 m, percorso da 5 A, forma un angolo di 30° con un campo di 0,04 T. Quanto vale la forza sul filo?`, suggerimenti: [R`$F = I \cdot \ell \cdot B \cdot \sin\alpha$.`], risposta: { tipo: 'numero', valore: 0.2, unita: 'N' }, soluzione: [R`$F = 5 \cdot 2 \cdot 0{,}04 \cdot 0{,}5\,\text{N} = 0{,}2\,\text{N}$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Un filo lungo 40 cm, percorso da 3 A e perpendicolare al campo, sente una forza di 0,36 N. Quanto vale il campo?`, suggerimenti: [R`Ricava il campo da $F = I \cdot \ell \cdot B$, con la lunghezza in metri.`], risposta: { tipo: 'numero', valore: 0.3, unita: 'T' }, soluzione: [R`$B = \dfrac{F}{I \cdot \ell} = \dfrac{0{,}36}{3 \cdot 0{,}4}\,\text{T} = 0{,}3\,\text{T}$.`] },
    { id: 'b-11', livello: 'base', difficolta: 2, testo: R`Due fili paralleli distano 9 cm e portano 3 A e 6 A. Quanto vale la forza per ogni metro di filo?`, suggerimenti: [R`$\dfrac{F}{\ell} = \dfrac{\mu_0}{2\pi} \cdot \dfrac{I_1 \cdot I_2}{d}$.`], risposta: { tipo: 'numero', valore: 4e-5, unita: 'N/m' }, soluzione: [R`$\dfrac{F}{\ell} = 2 \cdot 10^{-7} \cdot \dfrac{3 \cdot 6}{0{,}09}\,\text{N/m} = 4 \cdot 10^{-5}\,\text{N/m}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Un solenoide ha 240 spire su una lunghezza di 20 cm. Quante spire ha per ogni metro?`, suggerimenti: [R`$n = N / \ell$, con la lunghezza in metri.`], risposta: { tipo: 'numero', valore: 1200, segnaposto: 'Un numero (es. 500)' }, soluzione: [R`$n = \dfrac{240}{0{,}2\,\text{m}} = 1200$ spire al metro.`] },
    { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Un solenoide lungo ha 2500 spire al metro ed è percorso da 1 A. Quanto vale il campo dentro, in millitesla?`, suggerimenti: [R`$B = \mu_0 \cdot n \cdot I$, con $\mu_0 = 4\pi \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$.`], risposta: { tipo: 'numero', valore: 3.14, unita: 'mT', tolleranza: 0.05 }, soluzione: [R`$B = 4\pi \cdot 10^{-7} \cdot 2500 \cdot 1\,\text{T} = \pi \cdot 10^{-3}\,\text{T} \approx 3{,}14\,\text{mT}$.`] },
    { id: 'b-14', livello: 'base', difficolta: 2, testo: R`Uno ione di massa $4{,}8 \cdot 10^{-26}\,\text{kg}$ e carica $3{,}2 \cdot 10^{-19}\,\text{C}$ entra a $2 \cdot 10^5\,\text{m/s}$ in un campo di 0,6 T, perpendicolare alla velocità. Su che raggio gira? Rispondi in centimetri.`, suggerimenti: [R`$r = \dfrac{m \cdot v}{q \cdot B}$.`], risposta: { tipo: 'numero', valore: 5, unita: 'cm' }, soluzione: [R`$r = \dfrac{4{,}8 \cdot 10^{-26} \cdot 2 \cdot 10^5}{3{,}2 \cdot 10^{-19} \cdot 0{,}6}\,\text{m} = \dfrac{9{,}6 \cdot 10^{-21}}{1{,}92 \cdot 10^{-19}}\,\text{m} = 0{,}05\,\text{m} = 5\,\text{cm}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 1, testo: R`Un protone gira su un cerchio di raggio 6 cm in un campo uniforme. Il campo diventa tre volte più intenso, e la velocità resta la stessa. Che raggio ha il nuovo cerchio?`, suggerimenti: [R`In $r = \dfrac{m \cdot v}{q \cdot B}$ il campo sta al denominatore.`], risposta: { tipo: 'numero', valore: 2, unita: 'cm' }, soluzione: [R`Il raggio è inversamente proporzionale a $B$: con il campo triplo è un terzo, $6 / 3 = 2\,\text{cm}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 1, testo: R`Una spira di area $0{,}02\,\text{m}^2$ è percorsa da 5 A in un campo di 0,3 T. Quanto vale il momento massimo sulla spira?`, suggerimenti: [R`$M = N \cdot I \cdot S \cdot B \cdot \sin\alpha$, con $N = 1$ e $\sin\alpha = 1$.`], risposta: { tipo: 'numero', valore: 0.03, unita: 'N·m' }, soluzione: [R`$M = 5 \cdot 0{,}02 \cdot 0{,}3\,\text{N} \cdot \text{m} = 0{,}03\,\text{N} \cdot \text{m}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 2, testo: R`Una bobina di 200 spire, ognuna di area $10\,\text{cm}^2$, è percorsa da 0,5 A in un campo di 0,1 T. Quanto vale il momento massimo?`, suggerimenti: [R`$10\,\text{cm}^2 = 10 \cdot 10^{-4}\,\text{m}^2 = 10^{-3}\,\text{m}^2$.`], risposta: { tipo: 'numero', valore: 0.01, unita: 'N·m' }, soluzione: [R`$M = 200 \cdot 0{,}5 \cdot 10^{-3} \cdot 0{,}1\,\text{N} \cdot \text{m} = 0{,}01\,\text{N} \cdot \text{m}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un campo uniforme di 0,4 T attraversa perpendicolarmente una superficie piana di $0{,}05\,\text{m}^2$. Quanto vale il flusso?`, suggerimenti: [R`Con il campo perpendicolare alla superficie $\alpha = 0°$ e $\cos\alpha = 1$.`], risposta: { tipo: 'numero', valore: 0.02, unita: 'Wb' }, soluzione: [R`$\Phi = 0{,}4 \cdot 0{,}05\,\text{Wb} = 0{,}02\,\text{Wb}$.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Un campo uniforme di 0,2 T attraversa una superficie piana di $0{,}5\,\text{m}^2$. L'angolo fra B e la perpendicolare alla superficie è 60°. Quanto vale il flusso?`, suggerimenti: [R`$\Phi = B \cdot S \cdot \cos\alpha$, con $\cos 60° = 0{,}5$.`], risposta: { tipo: 'numero', valore: 0.05, unita: 'Wb' }, soluzione: [R`$\Phi = 0{,}2 \cdot 0{,}5 \cdot 0{,}5\,\text{Wb} = 0{,}05\,\text{Wb}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`Una linea chiusa abbraccia due fili: uno con 7 A che esce dal foglio, l'altro con 3 A che entra. Quanto vale la corrente abbracciata, girando in senso antiorario?`, suggerimenti: [R`Chi esce dal foglio conta con il più, chi entra con il meno.`], risposta: { tipo: 'numero', valore: 4, unita: 'A' }, soluzione: [R`$I_c = 7\,\text{A} - 3\,\text{A} = 4\,\text{A}$, e la circuitazione è $\Gamma_B = \mu_0 \cdot 4\,\text{A}$.`] },
    { id: 'b-21', livello: 'base', difficolta: 1, testo: R`Una spira circolare di raggio 3 cm è percorsa da 6 A. Quanto vale il campo magnetico al suo centro, in microtesla?`, suggerimenti: [R`$B = \dfrac{\mu_0 \cdot I}{2 \cdot R}$, con $R$ in metri.`], risposta: { tipo: 'numero', valore: 126, unita: 'μT' }, soluzione: [R`Dati: $R = 0{,}03\,\text{m}$, $I = 6\,\text{A}$. Cerco $B$ al centro.`, R`$B = \dfrac{4\pi \cdot 10^{-7} \cdot 6}{2 \cdot 0{,}03}\,\text{T} = 4\pi \cdot 10^{-5}\,\text{T} \approx 1{,}26 \cdot 10^{-4}\,\text{T}$.`, R`Cioè circa $126\,\mu\text{T}$: più di due volte il campo della Terra.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 2, testo: R`Due fili paralleli distano 10 cm e portano 8 A ciascuno, in versi opposti. Quanto vale il campo nel punto a metà strada?`, suggerimenti: [R`Ogni filo, da solo, dà a 5 cm un campo $2 \cdot 10^{-7} \cdot 8 / 0{,}05$.`, R`Con la mano destra: con le correnti opposte, a metà strada i due campi hanno lo stesso verso.`], risposta: { tipo: 'numero', valore: 64, unita: 'μT' }, soluzione: [R`Ogni filo: $B = 2 \cdot 10^{-7} \cdot \dfrac{8}{0{,}05}\,\text{T} = 3{,}2 \cdot 10^{-5}\,\text{T}$.`, R`Con le correnti opposte, fra i fili i due campi sono concordi e si sommano: $B = 6{,}4 \cdot 10^{-5}\,\text{T} = 64\,\mu\text{T}$.`, R`Con le correnti nello stesso verso, invece, a metà strada il campo sarebbe zero.`] },
    { id: 'es-02', difficolta: 2, testo: R`Due fili paralleli distano 12 cm e portano 2 A e 6 A nello stesso verso. In che punto fra i due fili il campo magnetico è zero? Dai la distanza dal filo con 2 A.`, suggerimenti: [R`Fra i fili, con correnti concordi, i due campi hanno versi opposti.`, R`Il campo è zero dove $\dfrac{I_1}{x} = \dfrac{I_2}{12 - x}$, con $x$ in centimetri.`], risposta: { tipo: 'numero', valore: 3, unita: 'cm' }, soluzione: [R`Chiamo $x$ la distanza dal filo con 2 A. I due campi sono uguali quando $\dfrac{2}{x} = \dfrac{6}{12 - x}$.`, R`$2 \cdot (12 - x) = 6 \cdot x \Rightarrow 24 = 8 \cdot x \Rightarrow x = 3\,\text{cm}$.`, R`Il punto è più vicino al filo con meno corrente, come c'era da aspettarsi.`] },
    { id: 'es-03', difficolta: 3, testo: R`Un elettrone parte da fermo e viene accelerato da una differenza di potenziale di 200 V. Poi entra in un campo magnetico di 1 mT, perpendicolare alla sua velocità. Su che raggio gira? Rispondi in centimetri.`, suggerimenti: [R`Prima la velocità: $\tfrac{1}{2} \cdot m \cdot v^2 = e \cdot \Delta V$.`, R`Poi il raggio: $r = \dfrac{m \cdot v}{e \cdot B}$.`], risposta: { tipo: 'numero', valore: 4.77, unita: 'cm', tolleranza: 0.05 }, soluzione: [R`$v = \sqrt{\dfrac{2 \cdot e \cdot \Delta V}{m}} = \sqrt{\dfrac{2 \cdot 1{,}60 \cdot 10^{-19} \cdot 200}{9{,}11 \cdot 10^{-31}}}\,\text{m/s} \approx 8{,}38 \cdot 10^6\,\text{m/s}$.`, R`$r = \dfrac{9{,}11 \cdot 10^{-31} \cdot 8{,}38 \cdot 10^6}{1{,}60 \cdot 10^{-19} \cdot 10^{-3}}\,\text{m} \approx 0{,}0477\,\text{m} \approx 4{,}8\,\text{cm}$.`] },
    { id: 'es-04', difficolta: 3, testo: R`Un protone si muove a $3 \cdot 10^6\,\text{m/s}$ in un campo di 0,25 T. La sua velocità forma un angolo di 30° con il campo. Che raggio ha l'elica che descrive? Rispondi in centimetri.`, suggerimenti: [R`Solo la parte della velocità perpendicolare a B fa girare il protone: $v_\perp = v \cdot \sin 30°$.`, R`$r = \dfrac{m \cdot v_\perp}{q \cdot B}$, con $m = 1{,}67 \cdot 10^{-27}\,\text{kg}$.`], risposta: { tipo: 'numero', valore: 6.26, unita: 'cm', tolleranza: 0.06 }, soluzione: [R`$v_\perp = 3 \cdot 10^6 \cdot 0{,}5\,\text{m/s} = 1{,}5 \cdot 10^6\,\text{m/s}$; la parte parallela fa avanzare il protone lungo il campo.`, R`$r = \dfrac{1{,}67 \cdot 10^{-27} \cdot 1{,}5 \cdot 10^6}{1{,}60 \cdot 10^{-19} \cdot 0{,}25}\,\text{m} \approx 0{,}0626\,\text{m} \approx 6{,}3\,\text{cm}$.`] },
    { id: 'es-05', difficolta: 2, testo: R`In un ciclotrone i protoni girano in un campo di 1,5 T. Quanti giri al secondo fanno? Rispondi in megahertz.`, suggerimenti: [R`La frequenza è l'inverso del periodo: $f = \dfrac{q \cdot B}{2\pi \cdot m}$.`, R`Non dipende dalla velocità: è proprio per questo che il ciclotrone funziona.`], risposta: { tipo: 'numero', valore: 22.9, unita: 'MHz', tolleranza: 0.3 }, soluzione: [R`$f = \dfrac{q \cdot B}{2\pi \cdot m} = \dfrac{1{,}60 \cdot 10^{-19} \cdot 1{,}5}{2\pi \cdot 1{,}67 \cdot 10^{-27}}\,\text{Hz} \approx 2{,}29 \cdot 10^7\,\text{Hz}$.`, R`Cioè circa 22,9 MHz, una frequenza da onde radio.`] },
    { id: 'es-06', difficolta: 3, testo: R`Una sbarretta di rame lunga 20 cm e di massa 6 g è orizzontale, in un campo orizzontale di 0,5 T perpendicolare alla sbarretta. Che corrente deve passare perché la forza magnetica la tenga sospesa?`, suggerimenti: [R`La forza magnetica verso l'alto deve uguagliare il peso: $I \cdot \ell \cdot B = m \cdot g$.`, R`La massa in chilogrammi: $6\,\text{g} = 0{,}006\,\text{kg}$.`], risposta: { tipo: 'numero', valore: 0.588, unita: 'A' }, soluzione: [R`$I = \dfrac{m \cdot g}{\ell \cdot B} = \dfrac{0{,}006 \cdot 9{,}8}{0{,}2 \cdot 0{,}5}\,\text{A} \approx 0{,}59\,\text{A}$.`, R`Il verso della corrente va scelto con la mano destra, perché la forza punti in alto.`] },
    { id: 'es-07', difficolta: 2, testo: R`Una bobina di 80 spire, ognuna di 5 cm per 4 cm, è percorsa da 0,25 A in un campo di 0,4 T. L'angolo fra B e la perpendicolare alla bobina è 30°. Quanto vale il momento?`, suggerimenti: [R`L'area di una spira: $5\,\text{cm} \cdot 4\,\text{cm} = 20\,\text{cm}^2 = 2 \cdot 10^{-3}\,\text{m}^2$.`, R`$M = N \cdot I \cdot S \cdot B \cdot \sin\alpha$.`], risposta: { tipo: 'numero', valore: 8e-3, unita: 'N·m' }, soluzione: [R`$M = 80 \cdot 0{,}25 \cdot 2 \cdot 10^{-3} \cdot 0{,}4 \cdot 0{,}5\,\text{N} \cdot \text{m} = 8 \cdot 10^{-3}\,\text{N} \cdot \text{m}$.`] },
    { id: 'es-08', difficolta: 2, testo: R`Vuoi un solenoide lungo 50 cm che con 2 A dia un campo di 5 mT. Quante spire servono?`, suggerimenti: [R`Ricava le spire per metro: $n = \dfrac{B}{\mu_0 \cdot I}$.`, R`Poi il numero totale: $N = n \cdot \ell$.`], risposta: { tipo: 'numero', valore: 995, tolleranza: 10, segnaposto: 'Un numero (es. 500)' }, soluzione: [R`$n = \dfrac{5 \cdot 10^{-3}}{4\pi \cdot 10^{-7} \cdot 2}\,\text{m}^{-1} \approx 1989\,\text{m}^{-1}$.`, R`$N = n \cdot \ell \approx 1989 \cdot 0{,}5 \approx 995$ spire: in pratica circa mille.`] },
    { id: 'es-09', difficolta: 3, testo: R`Un filo di rame di raggio 2 mm porta 10 A, distribuiti in modo uniforme sulla sezione. Usa il teorema di Ampère per trovare il campo **dentro** il filo, a 1 mm dall'asse. Rispondi in millitesla.`, suggerimenti: [R`Prendi come linea chiusa un cerchio di raggio 1 mm: abbraccia solo una parte della corrente.`, R`La corrente abbracciata è proporzionale all'area: $I_c = I \cdot \dfrac{r^2}{R^2}$.`, R`Poi $B \cdot 2\pi \cdot r = \mu_0 \cdot I_c$.`], risposta: { tipo: 'numero', valore: 0.5, unita: 'mT' }, soluzione: [R`Corrente abbracciata: $I_c = 10\,\text{A} \cdot \dfrac{1^2}{2^2} = 2{,}5\,\text{A}$.`, R`Dal teorema di Ampère: $B = \dfrac{\mu_0 \cdot I_c}{2\pi \cdot r} = 2 \cdot 10^{-7} \cdot \dfrac{2{,}5}{0{,}001}\,\text{T} = 5 \cdot 10^{-4}\,\text{T} = 0{,}5\,\text{mT}$.`, R`Dentro il filo il campo cresce con la distanza dall'asse; fuori cala come $1/r$.`] },
    { id: 'es-10', difficolta: 3, testo: R`In uno spettrometro entrano ioni di carbonio-12 e carbonio-14, con carica $+e$, tutti a $2 \cdot 10^5\,\text{m/s}$, in un campo di 0,4 T. Dopo mezzo giro, quanto distano i punti in cui arrivano? Prendi masse di 12 u e 14 u, con $1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}$. Rispondi in centimetri.`, suggerimenti: [R`Calcola i due raggi con $r = \dfrac{m \cdot v}{q \cdot B}$.`, R`Dopo mezzo giro ogni ione arriva a un diametro dall'ingresso: la distanza è $2 \cdot (r_{14} - r_{12})$.`], risposta: { tipo: 'numero', valore: 2.08, unita: 'cm', tolleranza: 0.05 }, soluzione: [R`$r_{12} = \dfrac{12 \cdot 1{,}661 \cdot 10^{-27} \cdot 2 \cdot 10^5}{1{,}60 \cdot 10^{-19} \cdot 0{,}4}\,\text{m} \approx 0{,}0623\,\text{m}$; $r_{14} = r_{12} \cdot \dfrac{14}{12} \approx 0{,}0727\,\text{m}$.`, R`Distanza: $2 \cdot (0{,}0727 - 0{,}0623)\,\text{m} \approx 0{,}0208\,\text{m} \approx 2{,}1\,\text{cm}$.`] },
    { id: 'es-11', difficolta: 2, testo: R`Un solenoide ha 1500 spire al metro ed è percorso da 0,6 A. Dentro c'è un nucleo di ferro con permeabilità relativa 450. Quanto vale il campo nel ferro?`, suggerimenti: [R`Prima il campo senza nucleo: $B_0 = \mu_0 \cdot n \cdot I$.`, R`Poi $B = \mu_r \cdot B_0$.`], risposta: { tipo: 'numero', valore: 0.509, unita: 'T' }, soluzione: [R`$B_0 = 4\pi \cdot 10^{-7} \cdot 1500 \cdot 0{,}6\,\text{T} \approx 1{,}13 \cdot 10^{-3}\,\text{T}$.`, R`$B = 450 \cdot 1{,}13 \cdot 10^{-3}\,\text{T} \approx 0{,}51\,\text{T}$, sotto la saturazione del ferro.`] },
    { id: 'es-12', difficolta: 3, testo: R`Un filo passa 4 cm sopra una bussola, parallelo all'ago, che indica il nord. La componente orizzontale del campo terrestre lì vale $2 \cdot 10^{-5}\,\text{T}$. Che corrente serve perché l'ago ruoti di 45°?`, suggerimenti: [R`Il campo del filo, sotto il filo, è orizzontale e perpendicolare all'ago.`, R`A 45° il campo del filo è uguale alla componente orizzontale del campo terrestre.`], risposta: { tipo: 'numero', valore: 4, unita: 'A' }, soluzione: [R`L'ago si mette lungo la somma dei due campi, che sono perpendicolari. A 45° i due campi sono uguali: $B_{filo} = 2 \cdot 10^{-5}\,\text{T}$.`, R`$I = \dfrac{2\pi \cdot r \cdot B}{\mu_0} = \dfrac{0{,}04 \cdot 2 \cdot 10^{-5}}{2 \cdot 10^{-7}}\,\text{A} = 4\,\text{A}$.`, R`È l'esperimento di Oersted fatto con i numeri.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa indicano direzione e verso del campo magnetico in un punto?`, opzioni: [R`Dove punta il nord di un ago magnetico messo lì`, R`La direzione della forza su una carica in moto`, R`La strada che fa una carica lasciata libera`, R`La direzione del polo nord geografico`], corretta: 0, spiegazione: R`Il campo magnetico si definisce con l'ago della bussola: il suo nord punta nel verso di B. La forza su una carica in moto è perpendicolare a B, non parallela.` },
    { id: 'q-02', domanda: R`Un elettrone è fermo in un campo magnetico uniforme. Che forza sente dal campo?`, opzioni: [R`Una forza lungo le linee di campo`, R`Una forza perpendicolare alle linee`, R`Nessuna forza`, R`Una forza che lo fa girare in tondo`], corretta: 2, spiegazione: R`La forza di Lorentz vale $q \cdot v \cdot B \cdot \sin\alpha$: con $v = 0$ è zero. Il campo magnetico agisce solo sulle cariche in moto.` },
    { id: 'q-03', domanda: R`Come sono fatte le linee del campo di una calamita a sbarra?`, opzioni: [R`Partono dal polo nord e finiscono sul polo sud`, R`Escono dal nord, entrano nel sud e proseguono dentro la calamita: sono chiuse`, R`Partono dal centro della calamita in tutte le direzioni`, R`Sono rette parallele alla calamita`], corretta: 1, spiegazione: R`Le linee di B non hanno né inizio né fine: dentro la calamita vanno dal sud al nord e si richiudono. Per questo non esistono poli isolati.` },
    { id: 'q-04', domanda: R`Vicino al Polo Nord geografico c'è…`, opzioni: [R`un polo nord magnetico`, R`nessun polo magnetico`, R`un polo che cambia ogni giorno`, R`un polo sud magnetico`], corretta: 3, spiegazione: R`Il nord dell'ago è attratto da quel polo, e poli diversi si attraggono: quindi è un polo sud magnetico. Il nome «nord» dell'ago viene dalla direzione geografica.` },
    { id: 'q-05', domanda: R`A distanza doppia da un filo rettilineo, il campo magnetico…`, opzioni: [R`si dimezza`, R`diventa un quarto`, R`raddoppia`, R`resta uguale`], corretta: 0, spiegazione: R`$B = \mu_0 \cdot I / (2\pi \cdot r)$ va come $1/r$. Diventerebbe un quarto se andasse come $1/r^2$, come il campo di una carica puntiforme.` },
    { id: 'q-06', domanda: R`Una carica entra in un campo uniforme con la velocità parallela alle linee di campo. Che traiettoria segue?`, opzioni: [R`Una circonferenza`, R`Un'elica`, R`Una retta, perché non sente forza`, R`Una parabola`], corretta: 2, spiegazione: R`Con v parallela a B, $\sin\alpha = 0$ e la forza è zero: la carica va dritta a velocità costante. L'elica viene con la velocità inclinata, il cerchio con la velocità perpendicolare.` },
    { id: 'q-07', domanda: R`La forza di Lorentz fa cambiare l'energia cinetica di una carica?`, opzioni: [R`Sì, la fa sempre aumentare`, R`No, perché è perpendicolare alla velocità e non compie lavoro`, R`Sì, la fa sempre diminuire`, R`Dipende dal segno della carica`], corretta: 1, spiegazione: R`Una forza perpendicolare allo spostamento non fa lavoro. La carica cambia direzione ma non il modulo della velocità, qualunque sia il suo segno.` },
    { id: 'q-08', domanda: R`Due fili paralleli portano correnti in versi opposti. Che cosa succede?`, opzioni: [R`Si attraggono`, R`Non si fanno nessuna forza`, R`Ruotano fino a incrociarsi`, R`Si respingono`], corretta: 3, spiegazione: R`Correnti nello stesso verso si attraggono, in versi opposti si respingono. È il contrario delle cariche elettriche, dove i segni uguali si respingono.` },
    { id: 'q-09', domanda: R`A che cosa serve il commutatore in un motore a corrente continua?`, opzioni: [R`A invertire la corrente nella spira a ogni mezzo giro`, R`A rendere più intenso il campo delle calamite`, R`A ridurre l'attrito sull'asse`, R`A trasformare la corrente continua in alternata per la rete`], corretta: 0, spiegazione: R`Senza commutatore il momento cambia segno dopo mezzo giro e la spira si ferma, oscillando. Invertendo la corrente proprio lì, il momento spinge sempre nello stesso verso.` },
    { id: 'q-10', domanda: R`In un solenoide raddoppi il numero di spire, con la stessa lunghezza e la stessa corrente. Il campo dentro…`, opzioni: [R`si dimezza`, R`raddoppia`, R`diventa quattro volte tanto`, R`resta uguale`], corretta: 1, spiegazione: R`Con la stessa lunghezza le spire per metro raddoppiano, e $B = \mu_0 \cdot n \cdot I$ raddoppia. Conta la densità delle spire, cioè le spire per metro.` },
    { id: 'q-11', domanda: R`Una superficie chiusa contiene il polo nord di una calamita. Quanto vale il flusso di B attraverso di essa?`, opzioni: [R`È positivo, perché dal nord le linee escono`, R`È negativo`, R`Dipende dalla grandezza della superficie`, R`È zero`], corretta: 3, spiegazione: R`Le linee che escono dal polo nord rientrano nella superficie passando dentro la calamita: tante escono, tante entrano. È il teorema di Gauss per il campo magnetico.` },
    { id: 'q-12', domanda: R`Quale di questi materiali è diamagnetico?`, opzioni: [R`Il ferro`, R`L'alluminio`, R`Il rame`, R`Il nichel`], corretta: 2, spiegazione: R`Il rame è respinto debolissimamente dal campo: è diamagnetico. L'alluminio è paramagnetico; ferro e nichel sono ferromagnetici.` },
    { id: 'q-13', domanda: R`Lungo una linea chiusa che non abbraccia nessuna corrente, la circuitazione di B…`, opzioni: [R`è zero`, R`è positiva, se ci sono fili vicini`, R`dipende dalla forma della linea`, R`è uguale a $\mu_0$`], corretta: 0, spiegazione: R`Per il teorema di Ampère conta solo la corrente abbracciata. Fuori dalla linea i fili ci sono, e il loro campo pure, ma i contributi lungo il giro si annullano.` },
    { id: 'q-14', domanda: R`Il periodo di una carica che gira in un campo magnetico uniforme dipende…`, opzioni: [R`solo dalla velocità della carica`, R`da massa, carica e campo, non dalla velocità`, R`dal raggio del cerchio e basta`, R`dalla velocità e dal campo`], corretta: 1, spiegazione: R`$T = 2\pi \cdot m / (q \cdot B)$. Una carica più veloce fa un cerchio più grande, nello stesso tempo.` },
    { id: 'q-15', domanda: R`Una spira è nel campo con il suo piano perpendicolare alle linee di campo. Quanto vale il momento su di essa?`, opzioni: [R`Il massimo`, R`La metà del massimo`, R`Zero`, R`Dipende dal verso della corrente`], corretta: 2, spiegazione: R`La perpendicolare alla spira è parallela a B: $\sin\alpha = 0$. Le forze sui lati tirano in versi opposti lungo la stessa retta, e non fanno girare.` },
    { id: 'q-16', domanda: R`A che cosa equivale un tesla?`, opzioni: [R`$1\,\text{A} \cdot \text{m/N}$`, R`$1\,\text{N} \cdot \text{A/m}$`, R`$1\,\text{C} \cdot \text{m/s}$`, R`$1\,\text{N}/(\text{A} \cdot \text{m})$`], corretta: 3, spiegazione: R`Da $F = I \cdot \ell \cdot B$: $B = F / (I \cdot \ell)$, quindi newton diviso ampere per metro. Un filo lungo 1 m con 1 A, perpendicolare a un campo di 1 T, sente 1 N.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Per la forza di Lorentz su un elettrone, la mano destra dà il verso sbagliato: va capovolto, perché la carica è negativa.` },
    { tipo: 'errore', testo: R`In $B = \mu_0 \cdot n \cdot I$, $n$ è il numero di spire **per metro**, non il numero di spire.` },
    { tipo: 'errore', testo: R`Il campo di un filo va come $1/r$, non come $1/r^2$: a distanza doppia è la metà, non un quarto.` },
    { tipo: 'trucco', testo: R`Ricorda $\dfrac{\mu_0}{2\pi} = 2 \cdot 10^{-7}\,\text{T} \cdot \text{m/A}$: il campo di un filo è $B = 2 \cdot 10^{-7} \cdot I / r$, con $r$ in metri.` },
    { tipo: 'trucco', testo: R`⊙ è la punta della freccia che arriva verso di te, ⊗ è la coda di una freccia che si allontana.` },
    { tipo: 'trucco', testo: R`Correnti nello stesso verso si attraggono, cariche dello stesso segno si respingono: è il contrario.` },
    { tipo: 'metodo', testo: R`Prima di usare $\mu_0$, porta tutto nel SI: centimetri in metri, millitesla in tesla, microcoulomb in coulomb.` },
    { tipo: 'metodo', testo: R`Controlla le unità di $r = \dfrac{m \cdot v}{q \cdot B}$: chilogrammi per metri al secondo, diviso coulomb per tesla, danno metri.` },
    { tipo: 'errore', testo: R`Vicino al Polo Nord geografico c'è un polo **sud** magnetico: è lui che attira il nord dell'ago.` }
  ],
  aneddoti: [
    { fisico: 'William Gilbert', anni: '1544–1603', titolo: 'La piccola Terra di pietra calamita', testo: R`William Gilbert era un medico di Londra, e fu anche medico della regina Elisabetta I. Per molti anni studiò le calamite, a sue spese. Nel 1600 pubblicò il *De Magnete*. Fece tornire una pietra calamita a forma di sfera e la chiamò *terrella*, «piccola Terra». Ci muoveva sopra un piccolo ago. L'ago si orientava verso i poli della sfera e si inclinava, come le bussole dei marinai in viaggio verso nord. Gilbert concluse che la Terra stessa è una grande calamita. Smontò anche vecchie credenze. Si diceva che l'aglio togliesse la forza alle calamite: lo provò, e non era vero. Nello stesso libro inventò la parola latina *electricus*, da «ambra» in greco.`, legame: R`È l'idea che la Terra sia una calamita, e che per questo la bussola funzioni.` },
    { fisico: 'Hans Christian Oersted', anni: '1777–1851', titolo: 'L\'ago che si mosse durante una lezione', testo: R`Hans Christian Oersted insegnava fisica all'Università di Copenaghen. Da anni sospettava un legame fra elettricità e magnetismo. Nella primavera del 1820, secondo il suo stesso racconto, fece una prova durante una lezione. Mise un filo collegato a una pila sopra un ago magnetico. L'ago si mosse, ma poco: il pubblico non rimase colpito. Oersted riprese gli esperimenti con calma solo in luglio, con una pila più grande. Il 21 luglio 1820 descrisse i risultati in latino, in quattro pagine. Le spedì agli scienziati di tutta Europa. In poche settimane a Ginevra, a Parigi e a Londra tutti ripetevano la prova.`, legame: R`È l'esperimento che mostra per primo che una corrente crea un campo magnetico.` },
    { fisico: 'André-Marie Ampère', anni: '1775–1836', titolo: 'Una settimana per una scienza nuova', testo: R`L'11 settembre 1820 François Arago ripeté davanti all'Accademia delle scienze di Parigi l'esperimento di Oersted. Fra il pubblico c'era André-Marie Ampère, un matematico. Si chiuse in laboratorio. Una settimana dopo, il 18 settembre, presentava già i primi risultati. Nelle settimane seguenti mostrò che due fili percorsi da corrente si attraggono o si respingono, senza nessuna calamita. Propose anche un'idea audace: dentro una calamita girano minuscole correnti in cerchio. Allora non si sapeva niente di atomi né di elettroni. Un secolo dopo la fisica degli atomi gli diede in buona parte ragione. James Clerk Maxwell lo chiamò «il Newton dell'elettricità».`, legame: R`Sono la forza fra due fili e l'idea delle correnti negli atomi, che spiega le calamite.` },
    { fisico: 'Michael Faraday', anni: '1791–1867', titolo: 'Il filo che girava attorno alla calamita', testo: R`Nel settembre del 1821 Michael Faraday lavorava come assistente alla Royal Institution di Londra. Mise una calamita dritta in una vaschetta di mercurio. Vi immerse la punta di un filo appeso in alto, libero di muoversi. Quando passava la corrente, il filo girava attorno alla calamita, senza fermarsi. Era la prima macchina che trasformava una corrente in un moto di rotazione continuo. Faraday pubblicò subito il risultato. Qualcuno però lo accusò di aver preso l'idea a William Wollaston, che aveva tentato qualcosa di simile. Faraday gli scrisse per spiegarsi, e Wollaston non se la prese. Ma le voci restarono. Nel 1824, quando Faraday fu proposto per la Royal Society, il suo maestro Humphry Davy si oppose. Fu eletto lo stesso.`, legame: R`È la forza su un filo percorso da corrente, usata per la prima volta per far girare qualcosa: l'antenato del motore elettrico.` },
    { fisico: 'Joseph Henry', anni: '1797–1878', titolo: 'L\'elettromagnete che sollevava una tonnellata', testo: R`Nel 1825 l'inglese William Sturgeon costruì il primo elettromagnete. Era un ferro di cavallo verniciato, con poche spire di filo nudo. Joseph Henry insegnava all'Albany Academy, nello Stato di New York, e capì come fare di meglio. Servivano moltissime spire. Ma con il filo nudo le spire si toccano, e la corrente salta da una all'altra. Henry allora rivestì il filo di seta e lo avvolse a strati. Nel 1831 costruì per l'Università di Yale un elettromagnete che sollevava più di 900 chilogrammi. Più tardi scoprì anche l'autoinduzione. Oggi l'unità di misura dell'induttanza si chiama henry, in suo onore.`, legame: R`È l'elettromagnete: un solenoide con il nucleo di ferro, tante spire per avere un campo intenso.` }
  ]
});
})();
