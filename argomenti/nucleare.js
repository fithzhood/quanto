/* Quanto — Il nucleo (nucleare, quinto anno). Contratto in SCHEMA.md, modello cinematica.js.
   Verifica: node strumenti/verifica-argomento.js argomenti/nucleare.js
   Masse dei nuclei (non degli atomi) in u: protone 1,007276, neutrone 1,008665, deutone 2,013553, tritone 3,015501,
   elio-3 3,014932, elio-4 4,001506, litio-7 7,014357, carbonio-12 11,996709, ossigeno-16 15,990526; 1 u·c² = 931,5 MeV.
   Valori della curva dell'energia di legame per nucleone (MeV, come nel video fissione-fusione): ²H 1,112, ⁴He 7,074,
   ¹²C 7,680, ²⁸Si 8,448, ⁵⁶Fe 8,790, ⁹⁰Zr 8,710, ¹³⁸Ba 8,393, ²⁰⁸Pb 7,868, ²³⁵U 7,591. */
(function () {
const R = String.raw;
QUANTO.registra({
  id: 'nucleare',
  titolo: 'Il nucleo',
  introduzione: R`Un atomo è quasi tutto vuoto. Al centro c'è il **nucleo**, centomila volte più piccolo dell'atomo, che contiene quasi tutta la massa. È fatto di protoni e neutroni, tenuti insieme da una forza nuova: la **forza nucleare forte**.

La fisica del nucleo spiega cose molto concrete. Perché il Sole brilla da miliardi di anni. Come funziona una centrale nucleare. Come si cura un tumore con le radiazioni, e come si fa una PET in ospedale. Come si sa che un osso di mammut ha ventimila anni. Le energie in gioco sono milioni di volte più grandi di quelle delle reazioni chimiche.

Servono la legge di Coulomb, l'elettronvolt, l'energia a riposo $E_0 = m \cdot c^2$ della relatività e l'idea di fotone della fisica dei quanti. Per la datazione servono anche le potenze e i logaritmi.`,
  inBreve: [
    R`Il nucleo ha $Z$ protoni e $A - Z$ neutroni. Gli **isotopi** di un elemento hanno lo stesso $Z$ e un diverso numero di neutroni.`,
    R`La **forza forte** attrae tutti i nucleoni ed è molto più intensa della repulsione elettrica, ma sparisce oltre 2–3 fm.`,
    R`Nei decadimenti si conservano la carica e il numero di nucleoni. **Alfa**: $Z$ cala di 2, $A$ di 4. **Beta meno**: $Z$ sale di 1. **Gamma**: non cambia niente, solo l'energia.`,
    R`Dopo ogni **tempo di dimezzamento** $T_{1/2}$ resta metà dei nuclei: $N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$. Quale nucleo decade non si può sapere.`,
    R`Un nucleo ha meno massa dei suoi nucleoni: il **difetto di massa** vale l'energia di legame, $E_l = \Delta m \cdot c^2$. Avvicinarsi al ferro, spezzando i nuclei pesanti o unendo i leggeri, libera energia.`
  ],
  sezioni: [
    {
      id: 'nucleo',
      titolo: 'Com\'è fatto il nucleo',
      testo: R`Un atomo è largo circa $10^{-10}\,\text{m}$. Nel 1911 Ernest Rutherford capì che quasi tutta la sua massa sta in un nucleo minuscolo, carico positivamente. Il nucleo misura circa $10^{-15}\,\text{m}$. Questa lunghezza si chiama **femtometro**: $1\,\text{fm} = 10^{-15}\,\text{m}$.

Nel nucleo ci sono due tipi di particelle. I **protoni** hanno carica $+e$. I **neutroni** non hanno carica, e li scoprì James Chadwick nel 1932. Protoni e neutroni insieme si chiamano **nucleoni**. Hanno quasi la stessa massa, circa un'**unità di massa atomica**, un dodicesimo della massa dell'atomo di carbonio-12: $1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}$.

>* Il **numero atomico** $Z$ conta i protoni e decide l'elemento. Il **numero di massa** $A$ conta i nucleoni. I neutroni sono $N = A - Z$. Si scrive $^{A}_{Z}\text{X}$, con X il simbolo dell'elemento.

Esempio. Nel nucleo $^{235}_{92}\text{U}$ ci sono 92 protoni e $235 - 92 = 143$ neutroni. Spesso si scrive solo uranio-235: il numero atomico lo dice già il nome.

Nuclei con lo stesso $Z$ e un diverso $A$ sono **isotopi** dello stesso elemento. Carbonio-12, carbonio-13 e carbonio-14 hanno tutti 6 protoni. Gli elettroni sono gli stessi, quindi anche la chimica è la stessa. Cambia solo la massa.

I nucleoni stanno stretti come biglie in un sacchetto. Il volume del nucleo cresce come $A$, e il raggio come la radice cubica di $A$:

~ R = R_0 \cdot A^{1/3} :: con $R_0 = 1{,}2\,\text{fm}$, quasi il raggio di un nucleone
~ R = 1{,}2\,\text{fm} \cdot 238^{1/3} :: il nucleo di uranio-238
~ R \approx 1{,}2\,\text{fm} \cdot 6{,}2 = \evidb{7{,}4\,\text{fm}} :: 238 nucleoni, ma solo sei volte il raggio di uno

Per lo stesso motivo tutti i nuclei hanno la stessa densità, circa $d = 2{,}3 \cdot 10^{17}\,\text{kg/m}^3$. Un cucchiaino di materia nucleare peserebbe un miliardo di tonnellate.

>! Il numero di massa $A$ non è una massa: è un numero intero che conta i nucleoni. La massa del nucleo in u è vicina ad $A$, ma non uguale.

?? Quanti neutroni ci sono nel nucleo $^{56}_{26}\text{Fe}$?
[ ] 26
[x] 30
[ ] 56
=> I neutroni sono $A - Z = 56 - 26 = 30$. Il numero 26 conta i protoni, 56 tutti i nucleoni.`
    },
    {
      id: 'forza-forte',
      titolo: 'La forza nucleare forte',
      testo: R`Nel nucleo i protoni sono vicinissimi, e cariche dello stesso segno si respingono. Quanto vale questa repulsione? Si calcola con la legge di Coulomb.

~ F = \dfrac{k \cdot e^2}{r^2} :: due protoni a contatto, a $r = 1\,\text{fm} = 10^{-15}\,\text{m}$
~ F = \dfrac{8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2 \cdot (1{,}60 \cdot 10^{-19}\,\text{C})^2}{(10^{-15}\,\text{m})^2} :: i coulomb al quadrato e i metri al quadrato si semplificano
~ F \approx \evidb{230\,\text{N}} :: il peso di un bambino di 23 kg, su una particella minuscola

Se ci fosse solo questa forza, il nucleo scoppierebbe all'istante. La gravità non aiuta: fra due protoni è circa $10^{36}$ volte più debole della repulsione elettrica.

[[video:nucleare/nucleo]]

>* La **forza nucleare forte** attrae fra loro tutti i nucleoni, protoni e neutroni allo stesso modo. A 1 fm è molto più intensa della repulsione elettrica. Ha però un **raggio d'azione cortissimo**: oltre 2–3 fm sparisce.

Sotto circa 0,5 fm la forza forte diventa repulsiva: per questo i nucleoni non si schiacciano l'uno nell'altro.

La repulsione elettrica invece cala piano, come $1/r^2$. Nel grafico c'è la sua curva, calcolata. La forza forte non ha una formula semplice da liceo: per questo il grafico ne segna solo il raggio d'azione.

[[grafico:forze]]

In un nucleo grande ogni nucleone sente la forza forte solo dei vicini. La repulsione elettrica invece agisce fra tutti i protoni, anche lontani. Per questo i nuclei grandi hanno bisogno di più neutroni: sono una colla senza carica. Il carbonio-12 ha 6 protoni e 6 neutroni. L'uranio-238 ha 92 protoni e 146 neutroni.

Oltre un certo punto nemmeno i neutroni bastano. Dopo il piombo, $Z = 82$, nessun nucleo è davvero stabile.

>! I neutroni non tengono insieme il nucleo perché sono neutri. Lo tengono insieme perché sentono la forza forte e non aggiungono repulsione.

?? Due neutroni sono a 1 fm l'uno dall'altro. Che forza agisce fra loro?
[ ] la repulsione elettrica, come fra due protoni
[x] l'attrazione della forza forte
[ ] nessuna forza: sono neutri
=> I neutroni non hanno carica, quindi niente forza elettrica. La forza forte però agisce su tutti i nucleoni allo stesso modo, e a 1 fm li attrae.`
    },
    {
      id: 'radioattivita',
      titolo: 'Alfa, beta, gamma',
      testo: R`Nel 1896 Henri Becquerel scoprì che i sali di uranio emettono da soli una radiazione invisibile. Oggi sappiamo che viene dal nucleo. Alcuni nuclei sono **instabili**: prima o poi si trasformano da soli in un altro nucleo, ed emettono radiazione. È il **decadimento radioattivo**. Rutherford chiamò le radiazioni con le prime lettere greche: alfa, beta, gamma.

[[video:nucleare/radioattivita]]

>* **Alfa**: esce un nucleo di elio, $^{4}_{2}\text{He}$; $Z$ cala di 2 e $A$ di 4. **Beta meno**: un neutrone diventa protone, ed escono un elettrone e un antineutrino; $Z$ sale di 1, $A$ resta uguale. **Gamma**: esce un fotone; $Z$ e $A$ non cambiano.

In ogni decadimento si conservano la carica e il numero di nucleoni. In una reazione scritta bene, la somma dei numeri in alto è uguale nei due lati. Lo stesso vale per i numeri in basso.

Esempio. Il radio-226 decade alfa e diventa radon:

~ {}^{226}_{88}\text{Ra} \to {}^{222}_{86}\text{Rn} + {}^{4}_{2}\text{He} :: il nucleo perde due protoni e due neutroni
~ 226 = 222 + 4 :: i nucleoni si conservano
~ 88 = 86 + 2 :: anche la carica: il nucleo figlio ha $Z = 86$, il radon

Nel beta meno l'elettrone non è uno degli elettroni dell'atomo. Nasce nel nucleo, in quell'istante: $n \to p + e^- + \bar{\nu}$. Esiste anche il **beta più**, in cui un protone diventa neutrone ed esce un positrone $e^+$. Allora $Z$ cala di 1. Lo usa la PET in ospedale.

| radiazione | $Z$ | $A$ | la ferma |
|---|---|---|---|
| alfa (nucleo di elio) | $-2$ | $-4$ | un foglio di carta |
| beta meno (elettrone) | $+1$ | $0$ | pochi mm di alluminio |
| gamma (fotone) | $0$ | $0$ | cm di piombo (attenua) |

Le alfa si fermano subito e cedono tutta la loro energia lì. Fuori dal corpo le ferma la pelle. Il radon delle cantine però è un gas che le emette. Se lo si respira, le alfa colpiscono i polmoni da dentro e fanno molti danni.

>! Il piombo non ferma del tutto i gamma: li attenua. Ogni strato di un certo spessore ne lascia passare la metà.

?? Un nucleo emette un raggio gamma. Che cosa cambia nel nucleo?
[ ] $Z$ cala di 1
[ ] $A$ cala di 4
[x] solo la sua energia
=> Il gamma è un fotone: non porta via né carica né nucleoni. Il nucleo resta lo stesso elemento, con meno energia.`
    },
    {
      id: 'dimezzamento',
      titolo: 'Il tempo di dimezzamento',
      testo: R`Un nucleo instabile non invecchia. La probabilità che decada nel prossimo secondo è sempre la stessa. Non conta se è nato ieri o un milione di anni fa. Quale nucleo decadrà per primo non si può prevedere. Con tantissimi nuclei, però, il caso diventa una legge precisa.

[[video:nucleare/dimezzamento]]

>* Il **tempo di dimezzamento** $T_{1/2}$ è il tempo dopo il quale resta metà dei nuclei. Dopo un tempo $t$ ne restano $N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$, dove $N_0$ è il numero iniziale. Qui $N$ è il numero di nuclei, non dei neutroni.

Dopo $T_{1/2}$ resta la metà, dopo $2 \cdot T_{1/2}$ un quarto, dopo $3 \cdot T_{1/2}$ un ottavo. La curva scende sempre più piano e non arriva mai a zero: è un'**esponenziale**.

Alcuni libri usano la **vita media** $\tau$, il tempo che un nucleo vive in media. È un po' più lunga del dimezzamento: $\tau \approx 1{,}44 \cdot T_{1/2}$.

Esempio. Lo iodio-131 si usa per curare la tiroide e ha $T_{1/2} = 8$ giorni. Un campione ne contiene 80 mg. Quanti ne restano dopo 24 giorni?

~ \dfrac{t}{T} = \dfrac{24\,\text{giorni}}{8\,\text{giorni}} = 3 :: quanti dimezzamenti stanno nel tempo dato
~ m = 80\,\text{mg} \cdot \left(\tfrac{1}{2}\right)^3 :: la massa dello iodio rimasto segue la stessa legge
~ m = \dfrac{80}{8}\,\text{mg} = \evidb{10\,\text{mg}} :: 80, poi 40, 20, 10

[[grafico:decadimento]]

Ogni isotopo ha il suo $T_{1/2}$, e i valori sono diversissimi:

| isotopo | tempo di dimezzamento |
|---|---|
| uranio-238 | 4,5 miliardi di anni |
| radio-226 | 1600 anni |
| iodio-131 | 8 giorni |
| polonio-214 | 0,16 millesimi di secondo |

Il numero di decadimenti al secondo si chiama **attività**. Si misura in becquerel (Bq): un decadimento al secondo. L'attività è proporzionale ai nuclei rimasti, quindi anche lei si dimezza ogni $T_{1/2}$.

>! Dopo due tempi di dimezzamento non è finito tutto. Resta un quarto, perché ogni volta si dimezza quello che è rimasto.

?? Un campione radioattivo ha $T_{1/2} = 2$ ore. Dopo 4 ore, quanto ne resta?
[ ] niente
[x] un quarto
[ ] metà
=> In 4 ore stanno due dimezzamenti: metà della metà, cioè un quarto. Non si sottraggono metà e metà.`
    },
    {
      id: 'datazione',
      titolo: 'La datazione con il carbonio-14',
      testo: R`Il carbonio-14 è radioattivo, con $T_{1/2} = 5730$ anni. Eppure non è sparito dalla Terra, perché se ne forma sempre di nuovo. In alta atmosfera i raggi cosmici producono neutroni. Un neutrone che urta un nucleo di azoto-14 lo trasforma in carbonio-14:

$$n + {}^{14}_{7}\text{N} \to {}^{14}_{6}\text{C} + p$$

Il carbonio-14 entra nell'anidride carbonica dell'aria. Le piante lo assorbono, gli animali mangiano le piante. Finché è vivo, ogni organismo ha la stessa proporzione dell'aria: circa un atomo di carbonio-14 ogni mille miliardi di atomi di carbonio.

>* Quando un organismo muore, smette di assorbire carbonio. Il suo carbonio-14 cala soltanto, e si dimezza ogni 5730 anni. Misurando quanto ne resta si ricava da quanto tempo è morto.

Esempio. In un legno antico il carbonio-14 è un ottavo di quello di un legno vivo. Quanti anni ha?

~ \tfrac{1}{8} = \left(\tfrac{1}{2}\right)^3 :: un ottavo vuol dire tre dimezzamenti
~ t = 3 \cdot T_{1/2} = 3 \cdot 5730\,\text{anni} :: ogni dimezzamento dura 5730 anni
~ t = \evidb{17\,190\,\text{anni}} :: il legno è dell'ultima glaciazione

Se la frazione rimasta non è una potenza di $\tfrac{1}{2}$, si usano i logaritmi. Da $N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$ si ricava $t = T_{1/2} \cdot \dfrac{\log(N_0/N)}{\log 2}$.

[[grafico:carbonio]]

Il metodo ha un limite. Dopo circa 50 000 anni resta meno di un trecentesimo del carbonio-14, troppo poco per misurarlo bene. Per le rocce si usano isotopi più lenti. Con l'uranio-238, che diventa piombo, si è misurata l'età della Terra: 4,5 miliardi di anni.

>! Il carbonio-14 data solo ciò che è stato vivo: legno, ossa, stoffe, semi. Una pietra non si data così.

?? Si può datare con il carbonio-14 una punta di freccia di selce?
[ ] sì, come qualunque reperto antico
[x] no, la selce non è mai stata viva
[ ] sì, ma solo se ha meno di 5730 anni
=> Il metodo misura il carbonio-14 assorbito da un essere vivente. La selce è una pietra: si può datare il legno dell'asta, non la punta.`
    },
    {
      id: 'energia-legame',
      titolo: 'Il difetto di massa e l\'energia di legame',
      testo: R`Per smontare un nucleo nei suoi nucleoni bisogna vincere la forza forte: serve energia. Per la relatività una massa equivale a un'energia, $E_0 = m \cdot c^2$. Quindi il nucleo intero ha **meno massa** dei suoi nucleoni separati.

>* Il **difetto di massa** è $\Delta m = Z \cdot m_p + N \cdot m_n - m_{\text{nucleo}}$. L'**energia di legame** è $E_l = \Delta m \cdot c^2$: l'energia che serve per separare tutti i nucleoni.

> Qui le masse sono quelle dei **nuclei**, senza elettroni. Le tabelle danno spesso quelle degli atomi: come usarle è spiegato in fondo, nell'ultima sezione.

Le energie dei nuclei si misurano in **megaelettronvolt**: $1\,\text{MeV} = 10^6\,\text{eV} = 1{,}60 \cdot 10^{-13}\,\text{J}$. Le masse si misurano in u. Un'unità di massa atomica vale $1\,\text{u} \cdot c^2 = 931{,}5\,\text{MeV}$, con $c$ ed $e$ a più cifre.

Esempio. Il nucleo di elio-4 ha massa $4{,}001506\,\text{u}$. I protoni hanno $m_p = 1{,}007276\,\text{u}$, i neutroni $m_n = 1{,}008665\,\text{u}$.

~ \Delta m = 2 \cdot m_p + 2 \cdot m_n - m_{\alpha} :: due protoni e due neutroni, meno il nucleo intero
~ \Delta m = (2{,}014552 + 2{,}017330 - 4{,}001506)\,\text{u} :: le masse dei nucleoni separati
~ \Delta m = 0{,}030376\,\text{u} :: il nucleo ha circa lo 0,75% di massa in meno delle sue parti
~ E_l = 0{,}030376 \cdot 931{,}5\,\text{MeV} \approx \evidb{28{,}3\,\text{MeV}} :: ogni u di massa vale 931,5 MeV

Divisa per i 4 nucleoni fa circa 7,1 MeV per nucleone. L'**energia di legame per nucleone** $E_l / A$ dice quanto è legato ogni nucleone. Più è alta, più il nucleo è stabile.

[[grafico:legame]]

La curva sale in fretta, ha il massimo al ferro-56, con 8,8 MeV per nucleone, e poi scende piano. I nuclei leggeri e quelli pesanti sono meno legati di quelli medi.

[[video:nucleare/fissione-fusione]]

Ogni trasformazione che porta verso il ferro libera energia. Ci si arriva in due modi. Si può spezzare un nucleo pesante: è la **fissione**. Oppure si possono unire due nuclei leggeri: è la **fusione**.

>! L'energia di legame non è un'energia che il nucleo contiene e può cedere. È quella che bisogna dargli per smontarlo. Un nucleo molto legato è uno che ha molta meno massa delle sue parti.

?? La massa di un nucleo di elio-4, rispetto a quella di due protoni e due neutroni separati, è…
[ ] uguale: la massa si conserva sempre
[x] minore
[ ] maggiore, perché c'è anche l'energia di legame
=> Per separare i nucleoni bisogna dare energia, e quindi massa. Il nucleo intero ha meno massa delle sue parti: è il difetto di massa.`
    },
    {
      id: 'fissione',
      titolo: 'La fissione e la reazione a catena',
      testo: R`Nel 1938 a Berlino Otto Hahn e Fritz Strassmann bombardarono l'uranio con neutroni. Trovarono il bario, un elemento grande la metà. Pochi giorni dopo Lise Meitner e Otto Frisch capirono che il nucleo si era spezzato in due.

>* Nella **fissione** un nucleo pesante, colpito da un neutrone, si spezza in due nuclei medi. Escono anche 2 o 3 neutroni ed energia.

Una delle fissioni possibili dell'uranio-235 è:

$$n + {}^{235}_{92}\text{U} \to {}^{141}_{56}\text{Ba} + {}^{92}_{36}\text{Kr} + 3 \cdot n$$

I nucleoni sono 236 prima e dopo, i protoni 92. I frammenti sono più legati dell'uranio: circa 8,4 MeV per nucleone invece di 7,6.

L'energia liberata da una reazione si chiama $Q$.

~ Q \approx (8{,}4 - 7{,}6)\,\text{MeV} \cdot 235 :: ogni nucleone guadagna circa 0,8 MeV di legame
~ Q \approx 190\,\text{MeV} :: più qualche MeV dai decadimenti dei frammenti
~ Q \approx 200\,\text{MeV} = 200 \cdot 1{,}60 \cdot 10^{-13}\,\text{J} = \evidb{3{,}2 \cdot 10^{-11}\,\text{J}} :: da un solo nucleo

Bruciare un atomo di carbonio dà circa 4 eV. Una fissione dà cinquanta milioni di volte di più.

I neutroni che escono possono spezzare altri nuclei. Se ogni fissione ne provoca in media $K$ altre, il numero di fissioni si moltiplica per $K$ a ogni generazione. $K$ è il **fattore di moltiplicazione**. È la **reazione a catena**.

[[grafico:catena]]

>* Con $K > 1$ la reazione cresce sempre più in fretta: è la bomba. Con $K = 1$ resta costante: è il reattore. Con $K < 1$ si spegne.

Perché la catena parta serve abbastanza uranio-235: è la **massa critica**. Se il pezzo è piccolo, troppi neutroni escono senza colpire niente.

In un reattore l'uranio contiene dal 3 al 5% di uranio-235; quello naturale ne ha lo 0,7%. Il **moderatore**, di solito acqua, rallenta i neutroni: quelli lenti spezzano l'uranio-235 molto più facilmente. Le **barre di controllo**, di cadmio o di boro, assorbono neutroni e tengono $K = 1$.

>! Un reattore non può esplodere come una bomba: il suo uranio è troppo poco arricchito. L'incidente di Černobyl' nel 1986 fu un'esplosione di vapore seguita da un incendio.

?? In un reattore che funziona a potenza costante, quanto vale $K$?
[ ] più di 1
[x] esattamente 1
[ ] zero
=> Ogni fissione ne provoca in media una sola: il numero di fissioni al secondo resta costante. Con $K > 1$ la potenza crescerebbe, con $K < 1$ si spegnerebbe.`
    },
    {
      id: 'fusione',
      titolo: 'La fusione, l\'energia delle stelle',
      testo: R`Dall'altra parte della curva ci sono i nuclei leggeri. Unendoli si sale verso il ferro e si libera energia.

>* Nella **fusione** due nuclei leggeri si uniscono in un nucleo più pesante e più legato. Le fusioni del Sole e dei reattori liberano, per nucleone, più energia della fissione.

Nel centro del Sole quattro protoni diventano, in più passaggi, un nucleo di elio-4. Escono anche due positroni e due neutrini, e 26,7 MeV. Sono circa 6,7 MeV per nucleone, contro gli 0,8 della fissione.

C'è un ostacolo. I nuclei sono positivi e si respingono. Per fondersi devono arrivare a pochi fm, dove agisce la forza forte. L'energia per avvicinare due protoni a 2 fm è:

~ U = \dfrac{k \cdot e^2}{r} :: l'energia potenziale elettrica di due protoni
~ U = \dfrac{8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2 \cdot (1{,}60 \cdot 10^{-19}\,\text{C})^2}{2 \cdot 10^{-15}\,\text{m}} \approx 1{,}15 \cdot 10^{-13}\,\text{J} :: i coulomb al quadrato si semplificano: restano N·m, cioè joule
~ U \approx \evidb{0{,}72\,\text{MeV}} :: diviso $1{,}60 \cdot 10^{-13}\,\text{J}$ per ogni MeV

Nel centro del Sole ci sono 15 milioni di kelvin. Lì l'energia media di agitazione di un protone è circa 2 keV, centinaia di volte meno. Un keV sono mille elettronvolt. La fusione avviene lo stesso, per un effetto quantistico che va oltre il liceo. Un protone ha una piccola probabilità di attraversare la barriera senza scavalcarla: è l'**effetto tunnel**.

Sulla Terra si prova a fondere deuterio e trizio, due isotopi dell'idrogeno:

~ {}^{2}_{1}\text{H} + {}^{3}_{1}\text{H} \to {}^{4}_{2}\text{He} + n :: deuterio e trizio danno elio e un neutrone
~ \Delta m = (2{,}013553 + 3{,}015501 - 4{,}001506 - 1{,}008665)\,\text{u} = 0{,}018883\,\text{u} :: massa prima meno massa dopo
~ Q = 0{,}018883 \cdot 931{,}5\,\text{MeV} \approx \evidb{17{,}6\,\text{MeV}} :: l'energia della reazione

Il gas va scaldato a più di 100 milioni di gradi e tenuto lontano dalle pareti con campi magnetici. In Francia si sta costruendo il reattore sperimentale ITER. Il deuterio si estrae dall'acqua del mare.

>! Il Sole non brucia come un fuoco. Se fosse fatto di carbone acceso, si sarebbe spento in poche migliaia di anni.

?? Che cosa succederebbe fondendo due nuclei di uranio in uno solo?
[ ] si libererebbe ancora più energia
[x] si dovrebbe spendere energia
[ ] nulla: la massa resterebbe uguale
=> Oltre il ferro la curva dell'energia di legame scende. Unire due nuclei pesanti allontana dal ferro: costa energia invece di liberarla.`
    },
    {
      id: 'problemi',
      titolo: 'Come si imposta un problema sul nucleo',
      testo: R`I problemi sul nucleo sono di pochi tipi. Conviene affrontarli sempre con gli stessi passi.

1. **Scrivi la reazione** con $A$ in alto e $Z$ in basso. Controlla che le due somme siano uguali nei due lati.
2. **Riconosci il decadimento.** Alfa: $Z - 2$ e $A - 4$. Beta meno: $Z + 1$. Gamma: nessun cambio.
3. **Per i dimezzamenti** conta quanti $T_{1/2}$ stanno nel tempo dato, con $T_{1/2}$ e $t$ nella stessa unità. Se il numero non è intero, usa l'esponente $t/T_{1/2}$ o i logaritmi.
4. **Per le energie** calcola il difetto di massa in u. Poi moltiplica per $931{,}5\,\text{MeV}$, e se serve passa ai joule con $1\,\text{MeV} = 1{,}60 \cdot 10^{-13}\,\text{J}$.
5. **Distingui** l'energia di legame totale da quella per nucleone.
6. **Controlla l'ordine di grandezza.** Una reazione nucleare dà qualche MeV, una fissione circa 200 MeV, una reazione chimica pochi eV.

>* In ogni problema: reazione bilanciata, tipo di decadimento, numero di dimezzamenti, masse in u e poi MeV, controllo dell'ordine di grandezza.

Esempio. Il cobalto-60 ha $T_{1/2} = 5{,}3$ anni. Che frazione ne resta dopo 2 anni?

~ \dfrac{t}{T} = \dfrac{2\,\text{anni}}{5{,}3\,\text{anni}} \approx 0{,}377 :: meno di un dimezzamento intero
~ \dfrac{N}{N_0} = \left(\tfrac{1}{2}\right)^{0{,}377} :: l'esponente non è intero: serve la calcolatrice
~ \dfrac{N}{N_0} \approx \evidb{0{,}77} :: resta il 77%, fra il 100% e il 50%

> Con le masse servono molte cifre. Il difetto di massa è una piccola differenza fra numeri grandi: arrotondando subito le masse, sparisce.

>! Le masse delle tabelle sono spesso quelle degli **atomi**, con gli elettroni. Se usi le masse degli atomi, al posto di $m_p$ usa la massa dell'atomo di idrogeno: gli elettroni si compensano.`
    }
  ],
  grafici: {
    /* la repulsione fra due protoni, calcolata come nel video nucleo: 230 N a 1 fm, 58 N a 2 fm, 26 N a 3 fm.
       La forza forte non ha una curva da liceo: se ne segna solo il raggio d'azione */
    forze: {
      tipo: 'piano', x: [0, 5], y: [0, 260], altezza: 420, passo: [1, 50], proporzioni: 'libere',
      etichette: { x: 'r (fm)', y: 'F (N)' },
      funzioni: [{ f: '230.1/x^2', dominio: [0.94, 5], colore: 2 }],
      elementi: [
        { tipo: 'verticale', x: 2.5, colore: 'grigio', tratteggio: true, etichetta: '2,5 fm' },
        { tipo: 'punto', p: [1, 230.1], etichetta: '230 N', posizione: 'destra', colore: 2 },
        { tipo: 'punto', p: [2, 57.5], etichetta: '58 N', posizione: 'sinistra', colore: 2 },
        { tipo: 'punto', p: [3, 25.6], etichetta: '26 N', posizione: 'alto-destra', colore: 2 },
        { tipo: 'testo', p: [2.42, 165], testo: 'forza forte', ancora: 'end', colore: 'grigio' }
      ],
      didascalia: 'La repulsione elettrica fra due protoni in funzione della distanza, F = k·e²/r². A 1 fm vale circa 230 N e cala piano. A sinistra del tratteggio agisce anche la forza forte, che attrae ed è molto più intensa; oltre 2–3 fm sparisce. Passa il dito sulla curva per leggere i valori.'
    },
    /* la legge del decadimento con il tempo di dimezzamento scelto: metà, un quarto, un ottavo */
    decadimento: {
      tipo: 'orario', grandezza: 'N', unita: '%', unitaTempo: 'giorni', t: [0, 40], y: [0, 100],
      etichette: { y: 'N (% di N_0)' },
      parametri: [{ nome: 'T', min: 2, max: 10, passo: 1, valore: 4, etichetta: 'T_{1/2} (giorni)' }],
      funzioni: [{ f: '100*0.5^(t/T)', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: ['T', 0], a: ['T', 50], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['2*T', 0], a: ['2*T', 25], colore: 'grigio', tratteggio: true },
        { tipo: 'segmento', da: ['3*T', 0], a: ['3*T', 12.5], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: ['T', 50], etichetta: '50%', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: ['2*T', 25], etichetta: '25%', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: ['3*T', 12.5], etichetta: '12,5%', posizione: 'alto-destra', colore: 'grigio' }
      ],
      didascalia: 'I nuclei rimasti, in percentuale di quelli iniziali. Dopo un tempo di dimezzamento T_{1/2} ne resta metà, dopo 2·T_{1/2} un quarto, dopo 3·T_{1/2} un ottavo: la curva non arriva mai a zero. Sposta il cursore per cambiare T_{1/2}; passa il dito sulla curva per leggere i valori.'
    },
    /* il carbonio-14 rimasto in un reperto, con T = 5730 anni */
    carbonio: {
      tipo: 'orario', grandezza: 'C-14', unita: '%', unitaTempo: 'anni', t: [0, 30000], y: [0, 100],
      etichette: { y: 'C-14 rimasto (%)' },
      parametri: [{ nome: 'eta', min: 0, max: 30000, passo: 100, valore: 8000, etichetta: 'età (anni)' }],
      funzioni: [{ f: '100*0.5^(t/5730)', colore: 3 }],
      elementi: [
        { tipo: 'segmento', da: ['eta', 0], a: ['eta', '100*0.5^(eta/5730)'], colore: 'grigio', tratteggio: true },
        { tipo: 'punto', p: [5730, 50], etichetta: '50%', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: [11460, 25], etichetta: '25%', posizione: 'alto-destra', colore: 'grigio' },
        { tipo: 'punto', p: ['eta', '100*0.5^(eta/5730)'], colore: 3 },
        { tipo: 'testo', p: [13000, 75], testo: 'resta il {{100*0.5^(eta/5730)|1}} %', ancora: 'start', colore: 3 }
      ],
      didascalia: 'Il carbonio-14 rimasto in un resto di essere vivente, in percentuale di quello di un organismo vivo, in funzione dell\'età. Ogni 5730 anni si dimezza. Sposta il cursore sull\'età del reperto.'
    },
    /* la curva dell'energia di legame per nucleone: valori veri, uniti da segmenti */
    legame: {
      tipo: 'piano', x: [0, 250], y: [0, 10], altezza: 420, passo: [50, 2], proporzioni: 'libere',
      etichette: { x: 'A', y: 'E_l/A (MeV)' },
      elementi: [
        { tipo: 'segmento', da: [2, 1.112], a: [4, 7.074], colore: 3 },
        { tipo: 'segmento', da: [4, 7.074], a: [12, 7.680], colore: 3 },
        { tipo: 'segmento', da: [12, 7.680], a: [28, 8.448], colore: 3 },
        { tipo: 'segmento', da: [28, 8.448], a: [56, 8.790], colore: 3 },
        { tipo: 'segmento', da: [56, 8.790], a: [90, 8.710], colore: 3 },
        { tipo: 'segmento', da: [90, 8.710], a: [138, 8.393], colore: 3 },
        { tipo: 'segmento', da: [138, 8.393], a: [208, 7.868], colore: 3 },
        { tipo: 'segmento', da: [208, 7.868], a: [235, 7.591], colore: 3 },
        { tipo: 'punto', p: [2, 1.112], etichetta: 'deuterio 1,1', posizione: 'destra', colore: 3 },
        { tipo: 'punto', p: [4, 7.074], etichetta: 'elio-4 7,1', posizione: 'basso-destra', colore: 3 },
        { tipo: 'punto', p: [12, 7.680], colore: 3 },
        { tipo: 'punto', p: [28, 8.448], colore: 3 },
        { tipo: 'punto', p: [56, 8.790], etichetta: 'ferro-56 8,8', posizione: 'alto', colore: 3 },
        { tipo: 'punto', p: [90, 8.710], colore: 3 },
        { tipo: 'punto', p: [138, 8.393], colore: 3 },
        { tipo: 'punto', p: [208, 7.868], colore: 3 },
        { tipo: 'punto', p: [235, 7.591], colore: 3 },
        { tipo: 'testo', p: [238, 6.7], testo: 'uranio-235 7,6', ancora: 'end' },
        { tipo: 'testo', p: [40, 5], testo: 'fusione →', ancora: 'start' },
        { tipo: 'testo', p: [215, 5.5], testo: '← fissione', ancora: 'end' }
      ],
      didascalia: 'L\'energia di legame per nucleone, in MeV, in funzione del numero di nucleoni. I punti sono nuclei veri: deuterio, elio-4, carbonio-12, silicio-28, ferro-56, zirconio-90, bario-138, piombo-208, uranio-235. Il massimo è al ferro: unire nuclei leggeri o spezzare nuclei pesanti avvicina al ferro e libera energia.'
    },
    /* la reazione a catena: le fissioni di ogni generazione, se ognuna ne provoca k */
    catena: {
      tipo: 'barre', altezza: 300,
      categorie: ['0', '1', '2', '3', '4', '5', '6'], etichettaX: 'generazione',
      parametri: [{ nome: 'k', min: 0.5, max: 2.5, passo: 0.5, valore: 2, decimali: 1, etichetta: 'K' }],
      serie: [{ nome: 'fissioni', valori: ['1', 'k', 'k^2', 'k^3', 'k^4', 'k^5', 'k^6'], colore: 3 }],
      etichettaY: 'fissioni',
      didascalia: 'Le fissioni di ogni generazione, partendo da una sola, se ogni fissione ne provoca in media K altre. Con K = 2 si arriva a 64 in sei generazioni; con K = 1 restano sempre una; con K minore di 1 la catena si spegne. Sposta il cursore per cambiare K.'
    }
  },
  esempi: [
    {
      titolo: 'Dentro il nucleo d\'oro',
      problema: R`Il nucleo d'oro più comune è $^{197}_{79}\text{Au}$. Quanti neutroni contiene? Quanto è grande il suo raggio?`,
      passi: [
        R`Dati: $A = 197$, $Z = 79$, $R_0 = 1{,}2\,\text{fm}$. Cerco il numero di neutroni $N$ e il raggio $R$.`,
        R`I neutroni sono i nucleoni che non sono protoni: $N = A - Z = 197 - 79 = 118$.`,
        R`Il raggio cresce con la radice cubica di $A$: $R = R_0 \cdot A^{1/3} = 1{,}2\,\text{fm} \cdot 197^{1/3}$.`,
        R`Con la calcolatrice $197^{1/3} \approx 5{,}82$, quindi $R \approx 1{,}2 \cdot 5{,}82\,\text{fm} \approx 7{,}0\,\text{fm}$.`,
        R`Controllo all'indietro: $\left(\dfrac{7{,}0}{1{,}2}\right)^3 \approx 198$, quasi 197. Torna.`
      ],
      risultato: R`118 neutroni; raggio di circa $7{,}0\,\text{fm}$, cioè $7{,}0 \cdot 10^{-15}\,\text{m}$.`
    },
    {
      titolo: 'Due decadimenti di fila',
      problema: R`L'uranio-238, $^{238}_{92}\text{U}$, decade alfa. Il nucleo che ne nasce decade poi beta meno. Che nucleo si ottiene alla fine?`,
      passi: [
        R`Dati: nucleo di partenza con $A = 238$ e $Z = 92$; un decadimento alfa, poi uno beta meno. Cerco $A$ e $Z$ del nucleo finale.`,
        R`Alfa: il nucleo perde due protoni e due neutroni. $A = 238 - 4 = 234$, $Z = 92 - 2 = 90$: è il torio, $^{234}_{90}\text{Th}$.`,
        R`Beta meno: un neutrone diventa protone. $A$ resta 234, $Z$ sale a 91: è il protoattinio, $^{234}_{91}\text{Pa}$.`,
        R`Controllo con le somme. Nucleoni: $238 = 234 + 4 + 0$. Carica: $92 = 91 + 2 - 1$, dove $-1$ è l'elettrone. Torna.`
      ],
      risultato: R`Protoattinio-234, $^{234}_{91}\text{Pa}$.`
    },
    {
      titolo: 'Il tecnezio dell\'ospedale',
      problema: R`Per una scintigrafia si usa il tecnezio-99m, con $T_{1/2} = 6$ ore. Una dose ha un'attività di 640 MBq. Quanto vale l'attività dopo 24 ore? Dopo quante ore scende a 10 MBq?`,
      passi: [
        R`Dati: $T_{1/2} = 6\,\text{h}$, attività iniziale $640\,\text{MBq}$, $t = 24\,\text{h}$. Cerco l'attività dopo 24 ore e il tempo per arrivare a $10\,\text{MBq}$.`,
        R`L'attività è proporzionale ai nuclei rimasti, quindi si dimezza anche lei ogni 6 ore.`,
        R`In 24 ore stanno $\dfrac{24}{6} = 4$ dimezzamenti: $640 \cdot \left(\tfrac{1}{2}\right)^4 = \dfrac{640}{16} = 40\,\text{MBq}$.`,
        R`Per arrivare a 10 MBq l'attività deve ridursi di $\dfrac{640}{10} = 64 = 2^6$ volte: servono 6 dimezzamenti, cioè $6 \cdot 6\,\text{h} = 36\,\text{h}$.`,
        R`Controllo con la sequenza: 640, 320, 160, 80, 40, 20, 10. Sei passi di 6 ore. Torna.`
      ],
      risultato: R`Dopo 24 ore $40\,\text{MBq}$; si arriva a $10\,\text{MBq}$ dopo 36 ore.`
    },
    {
      titolo: 'Quanti anni ha il legno',
      problema: R`In un attrezzo di legno trovato in uno scavo resta il 30% del carbonio-14 di un legno vivo. Quanti anni ha?`,
      passi: [
        R`Dati: $N / N_0 = 0{,}30$, $T_{1/2} = 5730\,\text{anni}$. Cerco l'età $t$.`,
        R`Il 30% non è una potenza di $\tfrac{1}{2}$: servono i logaritmi. Da $N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$ viene $t = T_{1/2} \cdot \dfrac{\log(N_0/N)}{\log 2}$.`,
        R`$\dfrac{N_0}{N} = \dfrac{1}{0{,}30} \approx 3{,}33$, e $\dfrac{\log 3{,}33}{\log 2} \approx \dfrac{0{,}523}{0{,}301} \approx 1{,}737$: sono circa 1,74 dimezzamenti.`,
        R`$t \approx 1{,}737 \cdot 5730\,\text{anni} \approx 9950\,\text{anni}$.`,
        R`Controllo: il 30% sta fra il 50% (5730 anni) e il 25% (11 460 anni), più vicino al 25%. L'età trovata è coerente.`
      ],
      risultato: R`Circa $9950$ anni.`
    },
    {
      titolo: 'L\'energia di legame del carbonio-12',
      problema: R`Il nucleo di carbonio-12 ha massa $11{,}996709\,\text{u}$. Quanto vale la sua energia di legame? E quella per nucleone? ($m_p = 1{,}007276\,\text{u}$, $m_n = 1{,}008665\,\text{u}$.)`,
      passi: [
        R`Dati: $Z = 6$, $N = 6$, $m_{\text{nucleo}} = 11{,}996709\,\text{u}$, $m_p$ e $m_n$. Cerco $E_l$ e $E_l / A$. (L'atomo pesa 12 u esatte; il nucleo ha 6 elettroni in meno, da 0,000549 u ciascuno.)`,
        R`Massa dei nucleoni separati: $6 \cdot 1{,}007276\,\text{u} + 6 \cdot 1{,}008665\,\text{u} = 12{,}095646\,\text{u}$.`,
        R`Difetto di massa: $\Delta m = 12{,}095646\,\text{u} - 11{,}996709\,\text{u} = 0{,}098937\,\text{u}$.`,
        R`Energia di legame: $E_l = 0{,}098937 \cdot 931{,}5\,\text{MeV} \approx 92{,}2\,\text{MeV}$.`,
        R`Per nucleone: $\dfrac{92{,}2\,\text{MeV}}{12} \approx 7{,}68\,\text{MeV}$. Controllo con la curva: il carbonio-12 sta poco sopra l'elio-4 e sotto il ferro. Torna.`
      ],
      risultato: R`$E_l \approx 92{,}2\,\text{MeV}$, circa $7{,}68\,\text{MeV}$ per nucleone.`
    },
    {
      titolo: 'Un grammo di uranio-235',
      problema: R`Ogni fissione dell'uranio-235 libera circa 200 MeV. Quanta energia si ottiene dalla fissione di tutti i nuclei di 1 g di uranio-235?`,
      passi: [
        R`Dati: $m = 1\,\text{g} = 10^{-3}\,\text{kg}$, massa di un nucleo $\approx 235\,\text{u}$, $1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}$, 200 MeV a fissione. Cerco l'energia totale in joule.`,
        R`Numero di nuclei: $\dfrac{10^{-3}\,\text{kg}}{235 \cdot 1{,}661 \cdot 10^{-27}\,\text{kg}} \approx 2{,}56 \cdot 10^{21}$.`,
        R`Energia di una fissione: $200 \cdot 1{,}60 \cdot 10^{-13}\,\text{J} = 3{,}2 \cdot 10^{-11}\,\text{J}$.`,
        R`Energia totale: $2{,}56 \cdot 10^{21} \cdot 3{,}2 \cdot 10^{-11}\,\text{J} \approx 8{,}2 \cdot 10^{10}\,\text{J}$. Bruciando benzina servirebbero circa 1,8 tonnellate.`,
        R`Controllo con la massa. Sparisce una frazione $\dfrac{200}{235 \cdot 931{,}5} \approx 0{,}09\%$ della massa. Con $E = m \cdot c^2$: $0{,}0009 \cdot 10^{-3}\,\text{kg} \cdot 9 \cdot 10^{16}\,\text{m}^2/\text{s}^2 \approx 8 \cdot 10^{10}\,\text{J}$. Torna.`
      ],
      risultato: R`Circa $8{,}2 \cdot 10^{10}\,\text{J}$.`
    }
  ],
  formulario: [
    { nome: 'Composizione del nucleo', formula: R`N = A - Z \qquad {}^{A}_{Z}\text{X}`, nota: R`$Z$ protoni, $A$ nucleoni, $N$ neutroni. Gli isotopi hanno lo stesso $Z$ e un diverso $A$.` },
    { nome: 'Raggio del nucleo', formula: R`R = R_0 \cdot A^{1/3}`, nota: R`$R_0 = 1{,}2\,\text{fm}$, con $1\,\text{fm} = 10^{-15}\,\text{m}$. La densità è la stessa per tutti i nuclei.` },
    { nome: 'Repulsione fra due protoni', formula: R`F = \dfrac{k \cdot e^2}{r^2}`, nota: R`$k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$. A 1 fm vale circa 230 N.` },
    { nome: 'Decadimento alfa', formula: R`{}^{A}_{Z}\text{X} \to {}^{A-4}_{Z-2}\text{Y} + {}^{4}_{2}\text{He}`, nota: R`Esce un nucleo di elio: due protoni e due neutroni.` },
    { nome: 'Decadimento beta meno', formula: R`{}^{A}_{Z}\text{X} \to {}^{A}_{Z+1}\text{Y} + e^- + \bar{\nu}`, nota: R`Nel nucleo $n \to p + e^- + \bar{\nu}$. Nel beta più esce un positrone e $Z$ cala di 1. Nel gamma non cambia niente.` },
    { nome: 'Legge del decadimento', formula: R`N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}`, nota: R`$T_{1/2}$ è il tempo di dimezzamento; $t$ e $T_{1/2}$ nella stessa unità. Vale anche per la massa e l'attività.` },
    { nome: 'Età di un reperto', formula: R`t = T_{1/2} \cdot \dfrac{\log(N_0/N)}{\log 2}`, nota: R`Per il carbonio-14 $T_{1/2} = 5730$ anni. Con una potenza di $\tfrac{1}{2}$ basta contare i dimezzamenti.` },
    { nome: 'Difetto di massa', formula: R`\Delta m = Z \cdot m_p + N \cdot m_n - m_{\text{nucleo}}`, nota: R`$m_p = 1{,}007276\,\text{u}$, $m_n = 1{,}008665\,\text{u}$; $m_{\text{nucleo}}$ è la massa del nucleo, senza elettroni.` },
    { nome: 'Energia di legame', formula: R`E_l = \Delta m \cdot c^2`, nota: R`Per nucleone $E_l / A$: massima al ferro-56, circa 8,8 MeV.` },
    { nome: 'Unità di massa atomica', formula: R`1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}`, nota: R`La sua energia a riposo: $1\,\text{u} \cdot c^2 = 931{,}5\,\text{MeV}$ (con $c$ ed $e$ a più cifre).` },
    { nome: 'Megaelettronvolt', formula: R`1\,\text{MeV} = 1{,}60 \cdot 10^{-13}\,\text{J}`, nota: R`Un MeV è un milione di eV, e $1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$` },
    { nome: 'Energia di una reazione', formula: R`Q = (m_{\text{prima}} - m_{\text{dopo}}) \cdot c^2`, nota: R`Se $Q$ è positivo la reazione libera energia. Una fissione di uranio-235 dà circa 200 MeV.` },
    { nome: 'Reazione a catena', formula: R`\text{fissioni nella generazione } g = K^g`, nota: R`$K$ fattore di moltiplicazione: $K > 1$ cresce, $K = 1$ costante (reattore), $K < 1$ si spegne.` }
  ],
  flashcards: [
    { id: 'fc-01', sezione: 'nucleo', tipo: 'definizione', fronte: R`Che cosa indicano $Z$ e $A$ in $^{A}_{Z}\text{X}$?`, retro: R`$Z$, numero atomico, conta i protoni e decide l'elemento. $A$, numero di massa, conta i nucleoni. I neutroni sono $A - Z$.` },
    { id: 'fc-02', sezione: 'nucleo', tipo: 'definizione', fronte: R`Che cosa sono gli **isotopi**?`, retro: R`Nuclei dello stesso elemento (stesso $Z$) con un diverso numero di neutroni. Hanno la stessa chimica e una massa diversa.` },
    { id: 'fc-03', sezione: 'nucleo', tipo: 'formula', fronte: R`Il **raggio** di un nucleo`, retro: R`$R = R_0 \cdot A^{1/3}$, con $R_0 = 1{,}2\,\text{fm}$. Tutti i nuclei hanno circa la stessa densità.` },
    { id: 'fc-04', sezione: 'forza-forte', tipo: 'concetto', fronte: R`Le proprietà della **forza nucleare forte**`, retro: R`Attrae tutti i nucleoni allo stesso modo, a 1 fm è molto più intensa della repulsione elettrica, e sparisce oltre 2–3 fm.` },
    { id: 'fc-05', sezione: 'forza-forte', tipo: 'concetto', fronte: R`Perché i nuclei pesanti hanno più neutroni che protoni?`, retro: R`La repulsione elettrica agisce fra tutti i protoni, la forza forte solo fra vicini. I neutroni danno forza forte senza aggiungere repulsione.` },
    { id: 'fc-06', sezione: 'forza-forte', tipo: 'formula', fronte: R`Quanto vale la repulsione fra due protoni a 1 fm?`, retro: R`$F = \dfrac{k \cdot e^2}{r^2} \approx 230\,\text{N}$: enorme per due particelle così piccole.` },
    { id: 'fc-07', sezione: 'radioattivita', tipo: 'definizione', fronte: R`Il decadimento **alfa**`, retro: R`Il nucleo emette un nucleo di elio, $^{4}_{2}\text{He}$: $Z$ cala di 2, $A$ cala di 4.` },
    { id: 'fc-08', sezione: 'radioattivita', tipo: 'definizione', fronte: R`Il decadimento **beta meno**`, retro: R`Nel nucleo un neutrone diventa protone: $n \to p + e^- + \bar{\nu}$. $Z$ sale di 1, $A$ resta uguale.` },
    { id: 'fc-09', sezione: 'radioattivita', tipo: 'definizione', fronte: R`Il decadimento **gamma**`, retro: R`Il nucleo emette un fotone di altissima energia. $Z$ e $A$ non cambiano: il nucleo perde solo energia.` },
    { id: 'fc-10', sezione: 'radioattivita', tipo: 'concetto', fronte: R`Che cosa si conserva in ogni decadimento?`, retro: R`La carica e il numero di nucleoni: le somme dei numeri in basso e di quelli in alto sono uguali nei due lati.` },
    { id: 'fc-11', sezione: 'radioattivita', tipo: 'concetto', fronte: R`Che cosa ferma alfa, beta e gamma?`, retro: R`Alfa: un foglio di carta. Beta: pochi millimetri di alluminio. Gamma: centimetri di piombo, che li attenuano senza fermarli del tutto.` },
    { id: 'fc-12', sezione: 'dimezzamento', tipo: 'definizione', fronte: R`Che cos'è il **tempo di dimezzamento**?`, retro: R`Il tempo $T_{1/2}$ dopo il quale resta metà dei nuclei radioattivi. Dipende solo dall'isotopo.` },
    { id: 'fc-13', sezione: 'dimezzamento', tipo: 'formula', fronte: R`La **legge del decadimento**`, retro: R`$N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$: dopo $T_{1/2}$ resta metà, dopo $2 \cdot T_{1/2}$ un quarto, dopo $3 \cdot T_{1/2}$ un ottavo.` },
    { id: 'fc-14', sezione: 'dimezzamento', tipo: 'concetto', fronte: R`Si può prevedere quando decadrà un certo nucleo?`, retro: R`No: decade a caso, e la probabilità non cresce con l'età. Si può prevedere solo quanti nuclei di un campione grande restano.` },
    { id: 'fc-15', sezione: 'datazione', tipo: 'procedura', fronte: R`Come si data un reperto con il **carbonio-14**?`, retro: R`Si misura quanto carbonio-14 resta rispetto a un organismo vivo. Si contano i dimezzamenti di 5730 anni, o si usa $t = T_{1/2} \cdot \dfrac{\log(N_0/N)}{\log 2}$.` },
    { id: 'fc-16', sezione: 'datazione', tipo: 'concetto', fronte: R`Quali sono i limiti della datazione con il carbonio-14?`, retro: R`Vale solo per ciò che è stato vivo, e fino a circa 50 000 anni: poi resta troppo poco carbonio-14.` },
    { id: 'fc-17', sezione: 'energia-legame', tipo: 'definizione', fronte: R`Che cos'è il **difetto di massa**?`, retro: R`La massa dei nucleoni separati meno la massa del nucleo: $\Delta m = Z \cdot m_p + N \cdot m_n - m_{\text{nucleo}}$. È sempre positivo.` },
    { id: 'fc-18', sezione: 'energia-legame', tipo: 'formula', fronte: R`L'**energia di legame** di un nucleo`, retro: R`$E_l = \Delta m \cdot c^2$, l'energia che serve per separare i nucleoni. Con le masse in u: $1\,\text{u} \cdot c^2 = 931{,}5\,\text{MeV}$.` },
    { id: 'fc-19', sezione: 'energia-legame', tipo: 'concetto', fronte: R`Come va l'energia di legame per nucleone al crescere di $A$?`, retro: R`Sale in fretta, ha il massimo al ferro-56 (circa 8,8 MeV) e poi scende piano. Avvicinarsi al ferro libera energia.` },
    { id: 'fc-20', sezione: 'fissione', tipo: 'definizione', fronte: R`Che cos'è la **fissione**?`, retro: R`Un nucleo pesante, colpito da un neutrone, si spezza in due nuclei medi, con 2 o 3 neutroni. Per l'uranio-235 libera circa 200 MeV.` },
    { id: 'fc-21', sezione: 'fissione', tipo: 'concetto', fronte: R`Il fattore $K$ della **reazione a catena**`, retro: R`Le fissioni provocate in media da ogni fissione. $K > 1$: cresce (bomba). $K = 1$: costante (reattore). $K < 1$: si spegne.` },
    { id: 'fc-22', sezione: 'fusione', tipo: 'concetto', fronte: R`Perché la **fusione** richiede temperature altissime?`, retro: R`I nuclei sono positivi e si respingono: devono arrivare a pochi fm perché agisca la forza forte. Nel Sole aiuta anche l'effetto tunnel.` },
    { id: 'fc-23', sezione: 'problemi', tipo: 'procedura', fronte: R`Come si passa dal difetto di massa all'energia in joule?`, retro: R`Si moltiplica $\Delta m$ in u per $931{,}5\,\text{MeV}$, poi ogni MeV vale $1{,}60 \cdot 10^{-13}\,\text{J}$.` }
  ],
  esercizi: [
    /* ---- allenamento: 20 esercizi di base, numeri semplici, uno alla volta ---- */
    { id: 'b-01', livello: 'base', difficolta: 1, testo: R`Quanti neutroni ci sono nel nucleo di calcio $^{40}_{20}\text{Ca}$?`, suggerimenti: [R`I neutroni sono $A - Z$.`], risposta: { tipo: 'numero', valore: 20, segnaposto: 'Un numero' }, soluzione: [R`$N = A - Z = 40 - 20 = 20$ neutroni.`] },
    { id: 'b-02', livello: 'base', difficolta: 1, testo: R`Un nucleo di piombo ha 82 protoni e 126 neutroni. Quanto vale il suo numero di massa $A$?`, suggerimenti: [R`$A$ conta tutti i nucleoni, protoni più neutroni.`], risposta: { tipo: 'numero', valore: 208, segnaposto: 'Un numero' }, soluzione: [R`$A = Z + N = 82 + 126 = 208$: è il piombo-208.`] },
    { id: 'b-03', livello: 'base', difficolta: 1, testo: R`Quanto è il raggio del nucleo di alluminio-27? Usa $R_0 = 1{,}2\,\text{fm}$ e rispondi in femtometri.`, suggerimenti: [R`$R = R_0 \cdot A^{1/3}$.`, R`La radice cubica di 27 è 3.`], risposta: { tipo: 'numero', valore: 3.6, unita: 'fm' }, soluzione: [R`$R = 1{,}2\,\text{fm} \cdot 27^{1/3} = 1{,}2\,\text{fm} \cdot 3 = 3{,}6\,\text{fm}$.`] },
    { id: 'b-04', livello: 'base', difficolta: 1, testo: R`Quanto è il raggio del nucleo di rame-64? Usa $R_0 = 1{,}2\,\text{fm}$ e rispondi in femtometri.`, suggerimenti: [R`$R = R_0 \cdot A^{1/3}$, e $4^3 = 64$.`], risposta: { tipo: 'numero', valore: 4.8, unita: 'fm' }, soluzione: [R`$R = 1{,}2\,\text{fm} \cdot 64^{1/3} = 1{,}2\,\text{fm} \cdot 4 = 4{,}8\,\text{fm}$.`] },
    { id: 'b-05', livello: 'base', difficolta: 2, testo: R`Due protoni sono a $1{,}6\,\text{fm}$ l'uno dall'altro. Con che forza si respingono? ($k = 8{,}99 \cdot 10^9\,\text{N} \cdot \text{m}^2/\text{C}^2$, $e = 1{,}60 \cdot 10^{-19}\,\text{C}$.)`, suggerimenti: [R`Legge di Coulomb: $F = \dfrac{k \cdot e^2}{r^2}$.`, R`$r = 1{,}6 \cdot 10^{-15}\,\text{m}$: al quadrato fa $2{,}56 \cdot 10^{-30}\,\text{m}^2$, come $e^2$ fa $2{,}56 \cdot 10^{-38}\,\text{C}^2$.`], risposta: { tipo: 'numero', valore: 89.9, unita: 'N' }, soluzione: [R`$F = \dfrac{8{,}99 \cdot 10^9 \cdot 2{,}56 \cdot 10^{-38}}{2{,}56 \cdot 10^{-30}}\,\text{N} = 8{,}99 \cdot 10^9 \cdot 10^{-8}\,\text{N} \approx 89{,}9\,\text{N}$.`] },
    { id: 'b-06', livello: 'base', difficolta: 1, testo: R`Il polonio $^{210}_{84}\text{Po}$ decade alfa. Quanto vale $Z$ per il nucleo che ne nasce?`, suggerimenti: [R`Nel decadimento alfa escono due protoni e due neutroni.`], risposta: { tipo: 'numero', valore: 82, segnaposto: 'Un numero' }, soluzione: [R`$Z = 84 - 2 = 82$: è il piombo, $^{206}_{82}\text{Pb}$.`] },
    { id: 'b-07', livello: 'base', difficolta: 1, testo: R`L'americio $^{241}_{95}\text{Am}$, quello dei rivelatori di fumo, decade alfa. Quanto vale $A$ per il nucleo che ne nasce?`, suggerimenti: [R`La particella alfa porta via 4 nucleoni.`], risposta: { tipo: 'numero', valore: 237, segnaposto: 'Un numero' }, soluzione: [R`$A = 241 - 4 = 237$. Con $Z = 95 - 2 = 93$ è il nettunio-237.`] },
    { id: 'b-08', livello: 'base', difficolta: 1, testo: R`Lo stronzio $^{90}_{38}\text{Sr}$ decade beta meno. Quanto vale $Z$ per il nucleo che ne nasce?`, suggerimenti: [R`Nel beta meno un neutrone diventa protone.`], risposta: { tipo: 'numero', valore: 39, segnaposto: 'Un numero' }, soluzione: [R`$Z = 38 + 1 = 39$: è l'ittrio, $^{90}_{39}\text{Y}$. $A$ resta 90.`] },
    { id: 'b-09', livello: 'base', difficolta: 1, testo: R`Il cesio $^{137}_{55}\text{Cs}$ decade beta meno. Quanto vale $A$ per il nucleo che ne nasce?`, suggerimenti: [R`Nel beta meno il numero di nucleoni cambia?`], risposta: { tipo: 'numero', valore: 137, segnaposto: 'Un numero' }, soluzione: [R`Un neutrone diventa protone: i nucleoni restano 137. Il nucleo figlio è il bario-137, con $Z = 56$.`] },
    { id: 'b-10', livello: 'base', difficolta: 1, testo: R`Il carbonio-11, $^{11}_{6}\text{C}$, usato nella PET, decade beta più. Quanto vale $Z$ per il nucleo che ne nasce?`, suggerimenti: [R`Nel beta più un protone diventa neutrone ed esce un positrone.`], risposta: { tipo: 'numero', valore: 5, segnaposto: 'Un numero' }, soluzione: [R`$Z = 6 - 1 = 5$: è il boro-11.`] },
    { id: 'b-11', livello: 'base', difficolta: 1, testo: R`Il fosforo-32 ha un tempo di dimezzamento di 14 giorni. Un campione ne contiene 48 mg. Quanti milligrammi ne restano dopo 28 giorni?`, suggerimenti: [R`Quanti dimezzamenti stanno in 28 giorni?`], risposta: { tipo: 'numero', valore: 12, unita: 'mg' }, soluzione: [R`$\dfrac{28}{14} = 2$ dimezzamenti: $48\,\text{mg} \cdot \tfrac{1}{4} = 12\,\text{mg}$.`] },
    { id: 'b-12', livello: 'base', difficolta: 1, testo: R`Lo stronzio-90 ha un tempo di dimezzamento di circa 29 anni. Dopo quanti anni ne resta un sedicesimo?`, suggerimenti: [R`$\tfrac{1}{16} = \left(\tfrac{1}{2}\right)^4$.`], risposta: { tipo: 'numero', valore: 116, unita: 'a' }, soluzione: [R`Un sedicesimo vuol dire 4 dimezzamenti: $4 \cdot 29\,\text{anni} = 116\,\text{anni}$.`] },
        { id: 'b-13', livello: 'base', difficolta: 1, testo: R`Il sodio-24 ha un tempo di dimezzamento di 15 ore. Una sorgente ha un'attività di 800 kBq. Quanto vale l'attività dopo 45 ore?`, suggerimenti: [R`L'attività è proporzionale ai nuclei rimasti: si dimezza ogni 15 ore.`], risposta: { tipo: 'numero', valore: 100, unita: 'kBq' }, soluzione: [R`$\dfrac{45}{15} = 3$ dimezzamenti: $800\,\text{kBq} \cdot \tfrac{1}{8} = 100\,\text{kBq}$, cioè $10^5$ decadimenti al secondo.`] },
    { id: 'b-14', livello: 'base', difficolta: 1, testo: R`Il radon-222 ha un tempo di dimezzamento di 3,8 giorni. Dopo quanti giorni un campione si riduce a un ottavo?`, suggerimenti: [R`Un ottavo vuol dire tre dimezzamenti.`], risposta: { tipo: 'numero', valore: 11.4, unita: 'd' }, soluzione: [R`$3 \cdot 3{,}8\,\text{giorni} = 11{,}4\,\text{giorni}$.`] },
    { id: 'b-15', livello: 'base', difficolta: 2, testo: R`In un reperto resta un trentaduesimo del carbonio-14 di un organismo vivo. Quanti anni ha? ($T_{1/2} = 5730$ anni.)`, suggerimenti: [R`$32 = 2^5$.`], risposta: { tipo: 'numero', valore: 28650, unita: 'a' }, soluzione: [R`$\tfrac{1}{32} = \left(\tfrac{1}{2}\right)^5$: 5 dimezzamenti, $5 \cdot 5730\,\text{anni} = 28\,650\,\text{anni}$.`] },
    { id: 'b-16', livello: 'base', difficolta: 2, testo: R`Un grammo di carbonio di un legno vivo dà 16 decadimenti di carbonio-14 al minuto. Un grammo di carbonio di un legno antico ne dà 1 al minuto. Quanti anni ha il legno antico? ($T_{1/2} = 5730$ anni.)`, suggerimenti: [R`L'attività è proporzionale al carbonio-14 rimasto.`, R`Da 16 a 1: quanti dimezzamenti?`], risposta: { tipo: 'numero', valore: 22920, unita: 'a' }, soluzione: [R`L'attività si è ridotta di 16 volte: 16, 8, 4, 2, 1 sono 4 dimezzamenti.`, R`$t = 4 \cdot 5730\,\text{anni} = 22\,920\,\text{anni}$.`] },
    { id: 'b-17', livello: 'base', difficolta: 1, testo: R`Il difetto di massa di un nucleo è $0{,}2\,\text{u}$. Quanto vale la sua energia di legame, in MeV?`, suggerimenti: [R`$1\,\text{u} \cdot c^2 = 931{,}5\,\text{MeV}$.`], risposta: { tipo: 'numero', valore: 186.3, unita: 'MeV' }, soluzione: [R`$E_l = 0{,}2 \cdot 931{,}5\,\text{MeV} = 186{,}3\,\text{MeV}$.`] },
    { id: 'b-18', livello: 'base', difficolta: 1, testo: R`Un nucleo con 20 nucleoni ha un'energia di legame di 160 MeV. Quanto vale l'energia di legame per nucleone?`, suggerimenti: [R`Dividi per il numero di nucleoni.`], risposta: { tipo: 'numero', valore: 8, unita: 'MeV' }, soluzione: [R`$\dfrac{E_l}{A} = \dfrac{160\,\text{MeV}}{20} = 8\,\text{MeV}$ per nucleone.`] },
    { id: 'b-19', livello: 'base', difficolta: 1, testo: R`Una particella alfa ha un'energia cinetica di 5 MeV. Quanto vale in joule?`, suggerimenti: [R`$1\,\text{MeV} = 1{,}60 \cdot 10^{-13}\,\text{J}$.`], risposta: { tipo: 'numero', valore: 8e-13, unita: 'J' }, soluzione: [R`$E = 5 \cdot 1{,}60 \cdot 10^{-13}\,\text{J} = 8 \cdot 10^{-13}\,\text{J}$.`] },
    { id: 'b-20', livello: 'base', difficolta: 1, testo: R`In una reazione a catena ogni fissione ne provoca altre 3. Si parte da una sola fissione, la generazione 0. Quante fissioni ci sono nella generazione 4?`, suggerimenti: [R`A ogni generazione le fissioni si moltiplicano per 3.`], risposta: { tipo: 'numero', valore: 81, segnaposto: 'Un numero' }, soluzione: [R`$3^4 = 3 \cdot 3 \cdot 3 \cdot 3 = 81$ fissioni.`] },

    /* ---- esercizi avanzati: più passaggi, o un'idea in più ---- */
    { id: 'es-01', difficolta: 3, testo: R`Una stella di neutroni ha la densità della materia nucleare, $2{,}3 \cdot 10^{17}\,\text{kg/m}^3$, e una massa di $2{,}8 \cdot 10^{30}\,\text{kg}$, circa una volta e mezza il Sole. Se è una sfera, quanto è il suo raggio?`, suggerimenti: [R`Il volume è massa diviso densità: $V = m / d$.`, R`Poi $V = \tfrac{4}{3} \cdot \pi \cdot R^3$: ricava $R$ con la radice cubica.`], risposta: { tipo: 'numero', valore: 14.3, unita: 'km', tolleranza: 0.5 }, soluzione: [R`$V = \dfrac{2{,}8 \cdot 10^{30}}{2{,}3 \cdot 10^{17}}\,\text{m}^3 \approx 1{,}22 \cdot 10^{13}\,\text{m}^3$.`, R`$R^3 = \dfrac{3 \cdot V}{4 \cdot \pi} \approx 2{,}9 \cdot 10^{12}\,\text{m}^3$, quindi $R \approx 1{,}43 \cdot 10^4\,\text{m} \approx 14\,\text{km}$.`, R`Una stella più pesante del Sole, grande come una città.`] },
    { id: 'es-02', difficolta: 3, testo: R`Il torio $^{232}_{90}\text{Th}$ diventa piombo $^{208}_{82}\text{Pb}$ con una catena di decadimenti alfa e beta meno. Quanti decadimenti alfa e quanti beta meno ci sono in tutto? Scrivi prima il numero delle alfa, poi quello delle beta.`, suggerimenti: [R`Solo le alfa cambiano $A$: di quanto cala $A$ in tutto?`, R`Le alfa abbassano $Z$ di 2 ciascuna, le beta lo alzano di 1.`], risposta: { tipo: 'numeri', valori: [6, 4], ordinati: true }, soluzione: [R`$A$ cala di $232 - 208 = 24$: servono $24 / 4 = 6$ decadimenti alfa.`, R`Le 6 alfa abbassano $Z$ di 12: da 90 a 78. Ma il piombo ha $Z = 82$: servono 4 beta meno.`, R`In tutto 6 alfa e 4 beta meno.`] },
    { id: 'es-03', difficolta: 2, testo: R`Il nucleo di litio-7 ($Z = 3$) ha massa $7{,}014357\,\text{u}$. Quanto vale l'energia di legame per nucleone? ($m_p = 1{,}007276\,\text{u}$, $m_n = 1{,}008665\,\text{u}$.)`, suggerimenti: [R`Il litio-7 ha 3 protoni e 4 neutroni.`, R`Calcola $\Delta m$, moltiplica per 931,5 MeV e dividi per 7.`], risposta: { tipo: 'numero', valore: 5.61, unita: 'MeV', tolleranza: 0.03 }, soluzione: [R`$\Delta m = 3 \cdot 1{,}007276 + 4 \cdot 1{,}008665 - 7{,}014357 = 0{,}042131\,\text{u}$.`, R`$E_l = 0{,}042131 \cdot 931{,}5\,\text{MeV} \approx 39{,}2\,\text{MeV}$.`, R`$\dfrac{39{,}2\,\text{MeV}}{7} \approx 5{,}61\,\text{MeV}$: meno dell'elio-4. Il litio è poco legato.`] },
    { id: 'es-04', difficolta: 2, testo: R`Il nucleo di ossigeno-16 ($Z = 8$) ha massa $15{,}990526\,\text{u}$. Quanto vale la sua energia di legame totale, in MeV?`, suggerimenti: [R`8 protoni e 8 neutroni; $m_p = 1{,}007276\,\text{u}$, $m_n = 1{,}008665\,\text{u}$.`, R`Tieni tutte le cifre: il difetto di massa è una piccola differenza.`], risposta: { tipo: 'numero', valore: 127.6, unita: 'MeV', tolleranza: 0.5 }, soluzione: [R`Nucleoni separati: $8 \cdot 1{,}007276 + 8 \cdot 1{,}008665 = 16{,}127528\,\text{u}$.`, R`$\Delta m = 16{,}127528 - 15{,}990526 = 0{,}137002\,\text{u}$.`, R`$E_l = 0{,}137002 \cdot 931{,}5\,\text{MeV} \approx 127{,}6\,\text{MeV}$, circa 7,98 MeV per nucleone.`] },
    { id: 'es-05', difficolta: 3, testo: R`Due nuclei di deuterio possono fondersi così: $^{2}_{1}\text{H} + {}^{2}_{1}\text{H} \to {}^{3}_{2}\text{He} + n$. Quanta energia libera la reazione? Masse dei nuclei: deuterio $2{,}013553\,\text{u}$, elio-3 $3{,}014932\,\text{u}$, neutrone $1{,}008665\,\text{u}$.`, suggerimenti: [R`$Q = (m_{\text{prima}} - m_{\text{dopo}}) \cdot c^2$.`, R`Prima ci sono due deuteri; dopo un elio-3 e un neutrone.`], risposta: { tipo: 'numero', valore: 3.27, unita: 'MeV', tolleranza: 0.03 }, soluzione: [R`Prima: $2 \cdot 2{,}013553 = 4{,}027106\,\text{u}$. Dopo: $3{,}014932 + 1{,}008665 = 4{,}023597\,\text{u}$.`, R`$\Delta m = 0{,}003509\,\text{u}$, quindi $Q = 0{,}003509 \cdot 931{,}5\,\text{MeV} \approx 3{,}27\,\text{MeV}$.`, R`Molto meno della reazione deuterio–trizio: per questo i reattori a fusione puntano su quella. Per nucleone sono circa 0,8 MeV, quanto la fissione: non tutte le fusioni rendono come quella del Sole.`] },
    { id: 'es-06', difficolta: 3, testo: R`Un reattore produce $3000\,\text{MW}$ di potenza termica con la fissione dell'uranio-235, circa 200 MeV per fissione. Quanti chilogrammi di uranio-235 consuma in un giorno?`, suggerimenti: [R`Fissioni al secondo: potenza divisa per l'energia di una fissione, in joule.`, R`Moltiplica per i secondi di un giorno (86 400) e per la massa di un nucleo, $235 \cdot 1{,}661 \cdot 10^{-27}\,\text{kg}$.`], risposta: { tipo: 'numero', valore: 3.16, unita: 'kg', tolleranza: 0.1 }, soluzione: [R`Energia di una fissione: $200 \cdot 1{,}60 \cdot 10^{-13}\,\text{J} = 3{,}2 \cdot 10^{-11}\,\text{J}$.`, R`Fissioni al secondo: $\dfrac{3 \cdot 10^9\,\text{J/s}}{3{,}2 \cdot 10^{-11}\,\text{J}} \approx 9{,}4 \cdot 10^{19}$; in un giorno $\approx 8{,}1 \cdot 10^{24}$.`, R`Massa: $8{,}1 \cdot 10^{24} \cdot 235 \cdot 1{,}661 \cdot 10^{-27}\,\text{kg} \approx 3{,}2\,\text{kg}$ al giorno.`] },
    { id: 'es-07', difficolta: 2, testo: R`Un seme trovato in uno scavo ha il 40% del carbonio-14 di un seme di oggi. Quanti anni ha? ($T_{1/2} = 5730$ anni.)`, suggerimenti: [R`Usa $t = T_{1/2} \cdot \dfrac{\log(N_0/N)}{\log 2}$, con $N_0/N = 2{,}5$.`], risposta: { tipo: 'numero', valore: 7570, unita: 'a', tolleranza: 60 }, soluzione: [R`$\dfrac{\log 2{,}5}{\log 2} \approx \dfrac{0{,}398}{0{,}301} \approx 1{,}322$ dimezzamenti.`, R`$t \approx 1{,}322 \cdot 5730\,\text{anni} \approx 7570\,\text{anni}$: fra uno e due dimezzamenti, come deve essere.`] },
    { id: 'es-08', difficolta: 2, testo: R`Una sorgente per radioterapia contiene 20 g di cobalto-60 ($T_{1/2} = 5{,}3$ anni). Quanti grammi di cobalto-60 restano dopo 10 anni?`, suggerimenti: [R`$t/T_{1/2}$ non è intero: usa $N = N_0 \cdot \left(\tfrac{1}{2}\right)^{t/T_{1/2}}$ con la calcolatrice.`], risposta: { tipo: 'numero', valore: 5.41, unita: 'g', tolleranza: 0.06 }, soluzione: [R`$\dfrac{t}{T} = \dfrac{10}{5{,}3} \approx 1{,}89$.`, R`$m = 20\,\text{g} \cdot 0{,}5^{1{,}89} \approx 20\,\text{g} \cdot 0{,}27 \approx 5{,}4\,\text{g}$: poco più di un quarto, perché i dimezzamenti sono quasi due.`] },
    { id: 'es-09', difficolta: 3, testo: R`Nelle stelle più grandi del Sole un protone si fonde con un nucleo di carbonio-12 ($Z = 6$). Quanta energia serve per portare il protone a $4\,\text{fm}$ dal centro del nucleo, vincendo la repulsione? Rispondi in MeV.`, suggerimenti: [R`Energia potenziale elettrica: $U = \dfrac{k \cdot q_1 \cdot q_2}{r}$, con $q_1 = e$ e $q_2 = 6 \cdot e$.`, R`Calcola in joule, poi dividi per $1{,}60 \cdot 10^{-13}\,\text{J}$.`], risposta: { tipo: 'numero', valore: 2.16, unita: 'MeV', tolleranza: 0.05 }, soluzione: [R`$U = \dfrac{8{,}99 \cdot 10^9 \cdot 6 \cdot (1{,}60 \cdot 10^{-19})^2}{4 \cdot 10^{-15}}\,\text{J} \approx 3{,}45 \cdot 10^{-13}\,\text{J}$.`, R`$U \approx \dfrac{3{,}45 \cdot 10^{-13}}{1{,}60 \cdot 10^{-13}}\,\text{MeV} \approx 2{,}16\,\text{MeV}$: la carica sei volte più grande alza molto la barriera.`] },
    { id: 'es-10', difficolta: 2, testo: R`Per certi raggi gamma, uno strato di piombo di 1,2 cm ne lascia passare metà. Quanto deve essere spesso uno schermo che ne lascia passare uno su 128?`, suggerimenti: [R`Ogni strato da 1,2 cm dimezza i raggi che gli arrivano.`, R`$128 = 2^7$.`], risposta: { tipo: 'numero', valore: 8.4, unita: 'cm' }, soluzione: [R`Uno su 128 vuol dire $\left(\tfrac{1}{2}\right)^7$: servono 7 strati.`, R`$7 \cdot 1{,}2\,\text{cm} = 8{,}4\,\text{cm}$. Lo schermo attenua molto, ma non ferma tutto.`] }
  ],
  quiz: [
    { id: 'q-01', domanda: R`Che cosa hanno in comune due isotopi dello stesso elemento?`, opzioni: [R`Il numero di neutroni`, R`La massa`, R`Il numero di protoni`, R`Il numero di massa`], corretta: 2, spiegazione: R`Gli isotopi hanno lo stesso $Z$, quindi gli stessi protoni e la stessa chimica. Cambiano i neutroni, e con loro $A$ e la massa.` },
    { id: 'q-02', domanda: R`Perché i nuclei pesanti hanno più neutroni che protoni?`, opzioni: [R`I neutroni sentono la forza forte senza aggiungere repulsione`, R`I neutroni attraggono elettricamente i protoni`, R`I neutroni pesano meno dei protoni`, R`Con il tempo tutti i protoni diventano neutroni`], corretta: 0, spiegazione: R`La repulsione agisce fra tutti i protoni, la forza forte solo fra vicini: i neutroni aggiungono colla senza carica. Non hanno carica, quindi non attraggono elettricamente nessuno, e pesano un po' più dei protoni.` },
    { id: 'q-03', domanda: R`Quanto è il raggio d'azione della forza nucleare forte?`, opzioni: [R`Infinito, come quello della gravità`, R`Uguale a quello della forza elettrica`, R`Circa quanto un atomo intero`, R`Circa 2–3 fm, le dimensioni di un piccolo nucleo`], corretta: 3, spiegazione: R`La forza forte è cortissima: oltre 2–3 fm sparisce. Gravità e forza elettrica invece calano come $1/r^2$ ma arrivano lontano. Un atomo è centomila volte più grande.` },
    { id: 'q-04', domanda: R`Nel decadimento beta meno, che cosa succede nel nucleo?`, opzioni: [R`Un elettrone dell'atomo cade nel nucleo`, R`Un neutrone diventa un protone`, R`Un protone diventa un neutrone`, R`Il nucleo perde due protoni e due neutroni`], corretta: 1, spiegazione: R`$n \to p + e^- + \bar{\nu}$: l'elettrone nasce nel nucleo e $Z$ sale di 1. Il protone che diventa neutrone è il beta più; perdere due protoni e due neutroni è l'alfa.` },
    { id: 'q-05', domanda: R`Quale radiazione si ferma con un foglio di carta?`, opzioni: [R`Gamma`, R`Beta`, R`Alfa`, R`Tutte e tre`], corretta: 2, spiegazione: R`Le alfa sono pesanti e cariche: cedono subito la loro energia. Le beta passano la carta e si fermano in pochi millimetri di alluminio; i gamma richiedono centimetri di piombo.` },
    { id: 'q-06', domanda: R`Un isotopo ha un tempo di dimezzamento di 10 anni. Dopo 30 anni, quanto ne resta?`, opzioni: [R`Un ottavo`, R`Niente`, R`Un terzo`, R`Un sesto`], corretta: 0, spiegazione: R`In 30 anni stanno tre dimezzamenti: $\tfrac{1}{2} \cdot \tfrac{1}{2} \cdot \tfrac{1}{2} = \tfrac{1}{8}$. Il decadimento non toglie la stessa quantità ogni volta, ma la metà di quello che resta.` },
    { id: 'q-07', domanda: R`Un nucleo radioattivo esiste da moltissimo tempo. La probabilità che decada nel prossimo minuto…`, opzioni: [R`è più alta, perché è vecchio`, R`è più bassa, perché ha resistito finora`, R`è zero, se ha superato il tempo di dimezzamento`, R`è la stessa di un nucleo appena formato`], corretta: 3, spiegazione: R`Un nucleo non invecchia: la probabilità di decadere in un minuto è sempre la stessa. Il tempo di dimezzamento riguarda un grande numero di nuclei, non dice quando decade uno solo.` },
    { id: 'q-08', domanda: R`Il carbonio-14 ha un tempo di dimezzamento di 5730 anni. Perché non è sparito dalla Terra?`, opzioni: [R`Perché nell'aria non decade`, R`Perché si forma di continuo nell'atmosfera`, R`Perché lo producono le piante`, R`Perché 5730 anni sono pochi rispetto all'età della Terra`], corretta: 1, spiegazione: R`I neutroni dei raggi cosmici trasformano l'azoto-14 in carbonio-14. Le piante lo assorbono ma non lo producono, e decade ovunque allo stesso modo. Proprio perché 5730 anni sono pochi, senza produzione sarebbe sparito da tempo.` },
    { id: 'q-09', domanda: R`Che cos'è il difetto di massa di un nucleo?`, opzioni: [R`La massa dei nucleoni separati meno la massa del nucleo`, R`La massa persa in un decadimento alfa`, R`La massa degli elettroni dell'atomo`, R`La differenza fra $A$ e $Z$`], corretta: 0, spiegazione: R`Il nucleo pesa meno delle sue parti: la differenza, per $c^2$, è l'energia di legame. $A - Z$ è il numero di neutroni, non una massa.` },
    { id: 'q-10', domanda: R`Quale di questi nuclei ha l'energia di legame per nucleone più alta?`, opzioni: [R`Uranio-235`, R`Elio-4`, R`Ferro-56`, R`Deuterio`], corretta: 2, spiegazione: R`La curva ha il massimo al ferro-56, circa 8,8 MeV per nucleone. L'uranio è a 7,6, l'elio-4 a 7,1, il deuterio appena a 1,1.` },
    { id: 'q-11', domanda: R`Perché sia la fissione dell'uranio sia la fusione dell'idrogeno liberano energia?`, opzioni: [R`Perché distruggono alcuni nucleoni`, R`Perché i neutroni portano energia dall'esterno`, R`Perché la forza forte viene spenta`, R`Perché i prodotti sono più legati, più vicini al ferro`], corretta: 3, spiegazione: R`In tutte e due i prodotti hanno un'energia di legame per nucleone più alta, e quindi meno massa. I nucleoni non si distruggono: si contano uguali prima e dopo.` },
    { id: 'q-12', domanda: R`In una reazione a catena ogni fissione ne provoca in media meno di una. Che cosa succede?`, opzioni: [R`La reazione cresce sempre più in fretta`, R`La reazione si spegne`, R`La reazione resta costante`, R`Il materiale esplode`], corretta: 1, spiegazione: R`Con $K < 1$ le fissioni calano a ogni generazione, e la catena si spegne. Resta costante con $K = 1$ e cresce con $K > 1$.` },
    { id: 'q-13', domanda: R`Perché la fusione richiede temperature di milioni di gradi?`, opzioni: [R`Perché i nuclei, positivi, devono avvicinarsi vincendo la repulsione`, R`Perché bisogna fondere il recipiente`, R`Perché servono neutroni lenti`, R`Perché la forza forte funziona solo a caldo`], corretta: 0, spiegazione: R`La forza forte agisce solo a pochi fm, ma prima i nuclei si respingono. Servono velocità enormi, cioè temperature altissime. I neutroni lenti servono alla fissione, non alla fusione.` },
    { id: 'q-14', domanda: R`In un reattore a fissione, a che cosa serve il moderatore?`, opzioni: [R`Ad assorbire i neutroni e spegnere la reazione`, R`A raffreddare le barre di controllo`, R`A rallentare i neutroni`, R`Ad arricchire l'uranio`], corretta: 2, spiegazione: R`I neutroni lenti spezzano l'uranio-235 più facilmente: il moderatore, di solito acqua, li rallenta. Ad assorbirli ci pensano le barre di controllo; l'arricchimento si fa prima, in fabbrica.` }
  ],
  suggerimenti: [
    { tipo: 'errore', testo: R`Nel beta meno $Z$ **sale** di 1, non scende: un neutrone diventa protone. È nel beta più che $Z$ cala.` },
    { tipo: 'errore', testo: R`Dopo due tempi di dimezzamento non resta zero: resta un quarto. Ogni volta si dimezza quello che è rimasto.` },
    { tipo: 'errore', testo: R`Il numero di massa $A$ conta i nucleoni: non è la massa in kg, e neanche esattamente quella in u.` },
    { tipo: 'trucco', testo: R`Con le masse in u non serve passare dai kg: si moltiplica il difetto di massa per $931{,}5\,\text{MeV}$.` },
    { tipo: 'trucco', testo: R`Nei dimezzamenti pensa alle potenze di 2: un ottavo sono tre dimezzamenti, un sedicesimo quattro, un trentaduesimo cinque.` },
    { tipo: 'metodo', testo: R`Scrivi ogni reazione con $A$ in alto e $Z$ in basso, poi controlla le due somme. Se non tornano, manca una particella.` },
    { tipo: 'metodo', testo: R`Nel difetto di massa tieni tutte le cifre delle masse: è una piccola differenza fra numeri grandi, e arrotondando sparisce.` },
    { tipo: 'trucco', testo: R`Ordini di grandezza da ricordare: pochi eV una reazione chimica, qualche MeV un decadimento, circa 200 MeV una fissione.` }
  ],
  aneddoti: [
    { fisico: 'Henri Becquerel', anni: '1852–1908', titolo: 'Le lastre lasciate nel cassetto', testo: R`All'inizio del 1896 tutti parlavano dei raggi X, scoperti da Röntgen poche settimane prima. A Parigi Henri Becquerel si chiese se li emettessero anche i sali che brillano dopo essere stati al sole. Avvolse una lastra fotografica in carta nera e ci posò sopra un sale di uranio. Dopo qualche ora al sole, la lastra sviluppata era annerita. Il 26 e il 27 febbraio però il cielo di Parigi era coperto. Becquerel chiuse lastre e sali in un cassetto, in attesa del sole. Il 1° marzo sviluppò lo stesso le lastre, aspettandosi immagini debolissime. Erano invece nere come le altre. Il sole non c'entrava: l'uranio emetteva radiazione da solo. Nel 1903 ebbe il premio Nobel insieme a Marie e Pierre Curie.`, legame: R`È la scoperta della radioattività: nuclei instabili che emettono radiazione senza che nessuno li ecciti.` },
    { fisico: 'Marie Curie', anni: '1867–1934', titolo: 'Il capannone e i quaderni ancora radioattivi', testo: R`Nel 1898 Marie Curie si accorse che la pechblenda, un minerale di uranio, era più radioattiva di quanto l'uranio spiegasse. Dentro dovevano esserci elementi nuovi. Con il marito Pierre ne annunciò due quell'anno: il polonio, dal nome della sua Polonia, e il radio. Per isolare il radio lavorarono in un capannone della Scuola di fisica e chimica di Parigi. Il chimico Wilhelm Ostwald, in visita, lo descrisse come un incrocio fra una stalla e una cantina per patate. Marie mescolava per ore pentoloni di minerale sciolto. Nel 1902 ottenne un decimo di grammo di cloruro di radio da circa una tonnellata di scarti. I suoi quaderni sono ancora radioattivi. A Parigi si consultano con guanti e camice, dopo aver firmato un modulo.`, legame: R`Il radio-226 ha un tempo di dimezzamento di 1600 anni: fra 1600 anni quei quaderni saranno radioattivi la metà.` },
    { fisico: 'Lise Meitner', anni: '1878–1968', titolo: 'La passeggiata nella neve di Natale', testo: R`Lise Meitner era austriaca, di famiglia ebrea. Per trent'anni lavorò a Berlino con il chimico Otto Hahn. Nel luglio 1938 dovette fuggire dalla Germania nazista e finì a Stoccolma. A dicembre Hahn le scrisse: bombardando l'uranio con neutroni, trovava bario, e non sapeva spiegarlo. Per Natale Meitner era a Kungälv, vicino a Göteborg, con il nipote Otto Frisch, anche lui fisico. Fecero una passeggiata nella neve: lui con gli sci, lei a piedi. Seduti su un tronco, fecero i conti su pezzetti di carta. Il nucleo di uranio poteva allungarsi e dividersi in due, come una goccia. Dal difetto di massa, con $E = m \cdot c^2$, venivano circa 200 MeV. Frisch prese dalla biologia il nome «fissione». Il Nobel del 1944 andò soltanto a Hahn.`, legame: R`È la prima spiegazione della fissione e dei suoi 200 MeV, ricavati dal difetto di massa.` },
    { fisico: 'Enrico Fermi', anni: '1901–1954', titolo: 'La pila sotto le tribune di Chicago', testo: R`Il 2 dicembre 1942 Enrico Fermi diresse un esperimento in un campo da squash, sotto le tribune dello stadio dell'Università di Chicago. Il suo gruppo vi aveva impilato, strato dopo strato, blocchi di grafite e di uranio: era la Chicago Pile-1, il primo reattore nucleare. Barre di cadmio infilate nella pila assorbivano i neutroni. Quella mattina l'ultima barra fu estratta poco alla volta, misurando i neutroni a ogni passo. Fermi controllava i conti con il regolo calcolatore. A un certo punto mandò tutti a pranzo. Alle 15:25 annunciò che la reazione si sosteneva da sola. La pila funzionò circa quattro minuti e mezzo, con mezzo watt di potenza. Eugene Wigner aveva portato un fiasco di Chianti, e i presenti firmarono la paglia che lo avvolgeva.`, legame: R`È la prima reazione a catena controllata, con $K = 1$ tenuto dalle barre di controllo.` },
    { fisico: 'Willard Libby', anni: '1908–1980', titolo: 'Il legno delle tombe dei faraoni', testo: R`Alla fine degli anni Quaranta, all'Università di Chicago, il chimico Willard Libby ebbe l'idea di usare il carbonio-14 come orologio. Prima però doveva dimostrare che il metodo funzionava. Con il collaboratore James Arnold misurò campioni di età già nota: legno delle tombe dei faraoni Djoser e Snefru, in Egitto. Le età date dal carbonio-14 coincidevano con quelle degli storici, entro gli errori. I risultati uscirono nel 1949. Libby usava un tempo di dimezzamento di 5568 anni; misure più precise diedero poi 5730 anni. Per convenzione i laboratori calcolano ancora le «età radiocarbonio» con il valore di Libby, e poi le correggono. Nel 1960 Libby ricevette il premio Nobel per la chimica.`, legame: R`È la datazione con il carbonio-14 e la legge del dimezzamento.` }
  ]
});
})();
