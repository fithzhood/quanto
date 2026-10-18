/* Laboratorio «Lo spettrometro» — cariche in un campo magnetico (argomento magnetismo).
   Uno ione entra da una fenditura in un campo B uniforme, perpendicolare al foglio (⊗ entra, ⊙ esce): la forza di
   Lorentz, sempre perpendicolare a v, lo fa girare su un cerchio di raggio r = m·v/(q·B). Dopo mezzo giro torna sulla
   lastra a 2r dalla fenditura: deve cadere nel buco giusto. Nei livelli alti la velocità la sceglie un filtro di
   velocità (campo E e campo B₁ incrociati): passa dritto solo chi ha v = E/B₁.
   La traiettoria è quella vera, calcolata: nei campi uniformi il moto è v(t) = v_d + R(Ω·t)·(v₀ − v_d), con
   v_d = E∧B/B² (la deriva) e Ω = q·B/m; senza campo elettrico è un cerchio. Unità interne: cm e μs (1·10⁵ m/s = 10 cm/μs);
   costanti come nella teoria: e = 1,60·10⁻¹⁹ C, u = 1,66·10⁻²⁷ kg.
   Colori del magnetismo: B verde (--s3) con ⊙/⊗, v azzurra (--s1), F arancio (--s2), cariche positive viola (--s4),
   negative azzurre (--s1); il campo elettrico del filtro è grigio. Modello: laboratori/cannone.js. */
(function () {
  const STILE = `
    .lab-spettrometro .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; }
    .lab-spettrometro .lab-scena > svg { width: 100%; height: 100%; }
    .lab-spettrometro svg text { font-family: var(--font); }
    .lab-spettrometro .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); }
    .lab-spettrometro .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-spettrometro .consegna:empty { display: none; }
    .lab-spettrometro .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2px .5em; font-size: clamp(1rem, 2.4cqmin, 1.15rem); line-height: 1.2; min-height: 2.4em; }
    .lab-spettrometro .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-spettrometro .formula .ignoto { color: var(--testo3); }
    .lab-spettrometro .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-spettrometro .formula .nome-stretto { display: none; }
    .lab-spettrometro .formula .solo-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-spettrometro .formula .simbolo, .lab-spettrometro .formula .solo-largo { display: none; } .lab-spettrometro .formula .nome-stretto { display: inline; } .lab-spettrometro .formula .solo-stretto { display: inline-block; } }
    .lab-spettrometro .lab-messaggio { padding: 0 4px; min-height: 1.45em; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    .lab-spettrometro .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-spettrometro .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    @container lab (max-width: 420px) { .lab-spettrometro .lab-barra { gap: 5px; } .lab-spettrometro .lab-barra .btn { padding-left: 8px; padding-right: 8px; font-size: .82rem; } }   /* a 130 %: dopo la vittoria i pulsanti restano su una riga */
    .lab-spettrometro .btn[disabled] { opacity: .38; cursor: default; }
    .lab-spettrometro .lab-parametri { max-width: 520px; }
    .lab-spettrometro .lab-param[hidden], .lab-spettrometro .b-casuale[hidden] { display: none; }
    .lab-spettrometro .lab-parametri .b-casuale { justify-self: center; }
    .lab-spettrometro .lab-param { gap: 3px; }
    .lab-spettrometro .lab-param .nome { min-width: 0; }
    .lab-spettrometro .lab-param .btn { min-width: 34px; padding: 0 4px; }
    .lab-spettrometro .lab-param output { min-width: 2.4em; white-space: nowrap; }
    .lab-spettrometro .lab-param output small { font-size: .75em; font-weight: 500; color: var(--testo2); }
    .lab-spettrometro .lab-param .b-verso { min-width: 5.6em; font-size: 1rem; }
    .lab-spettrometro .lab-param.ione output { min-width: 3.2em; }
    .lab-spettrometro .lab-lato sup, .lab-spettrometro .lab-lato sub { font-size: .85em; }
    .lab-spettrometro .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-spettrometro .vinto { display: inline-block; animation: lab-spettrometro-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-spettrometro-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
  `;

  /* ---------------- fisica (pura, senza disegno: la usa anche la prova dei livelli in node) ---------------- */
  const QE = 1.60e-19, UM = 1.66e-27;
  const KW = QE / UM * 1e-6;          /* Ω in rad/μs = KW · (q/m in e/u) · B in T  (≈ 96,39) */
  const V10 = 10;                     /* 1·10⁵ m/s = 10 cm/μs */
  const TOL = 0.4;                    /* buchi larghi 8 mm: vale se lo ione arriva a meno di 4 mm dal centro */
  const Y_SORG = -15, Y_F0 = -12, Y_F1 = -2, X_PIASTRA = 1.2, FEND = 0.25;   /* sorgente, filtro (da −12 a −2 cm), piastre a ±1,2 cm */
  const IONI = {
    ne20: { m: 20, q: 1, el: 'Ne', a: 20, nome: 'neon-20' },
    ne22: { m: 22, q: 1, el: 'Ne', a: 22, nome: 'neon-22' },
    cl35: { m: 35, q: -1, el: 'Cl', a: 35, nome: 'cloro-35' },
    cl37: { m: 37, q: -1, el: 'Cl', a: 37, nome: 'cloro-37' },
    ar40: { m: 40, q: 2, el: 'Ar', a: 40, nome: 'argon-40' },
    c12: { m: 12, q: 1, el: 'C', a: 12, nome: 'carbonio-12' },
    c14: { m: 14, q: 1, el: 'C', a: 14, nome: 'carbonio-14' },
    o16: { m: 16, q: -1, el: 'O', a: 16, nome: 'ossigeno-16' },
    li7: { m: 7, q: 1, el: 'Li', a: 7, nome: 'litio-7' }
  };
  const ORDINE_LIBERO = ['ne20', 'ne22', 'cl35', 'ar40', 'c12', 'o16', 'li7'];
  const LIM = { v: [0.2, 4, 0.1], E: [0, 40, 0.5], B1: [0.05, 0.5, 0.01], B: [0.01, 0.8, 0.01] };

  /* il moto in campi uniformi E (lungo x, in V/m) e B (lungo z, in T, positivo = ⊙ esce), da p0 con velocità v0 (cm/μs):
     u = v − v_d ruota con velocità angolare Ω = −q·Bz/m (positiva = antioraria). Esatto, nessuna integrazione numerica. */
  function moto(ione, E, Bz, p0, v0) {
    const W = -KW * ione.q / ione.m * Bz;
    const vd = Bz ? [0, -E * 1e-4 / Bz] : [0, 0];      /* E∧B/B² con E = (E, 0, 0), B = (0, 0, Bz); 1 m/s = 10⁻⁴ cm/μs */
    const u0 = [v0[0] - vd[0], v0[1] - vd[1]];
    return {
      W, vd,
      pos(t) {
        if (Math.abs(W) < 1e-9) return [p0[0] + v0[0] * t, p0[1] + v0[1] * t];
        const s = Math.sin(W * t), c = Math.cos(W * t);
        return [p0[0] + vd[0] * t + (s * u0[0] + (c - 1) * u0[1]) / W, p0[1] + vd[1] * t + ((1 - c) * u0[0] + s * u0[1]) / W];
      },
      vel(t) { const s = Math.sin(W * t), c = Math.cos(W * t); return [vd[0] + c * u0[0] - s * u0[1], vd[1] + s * u0[0] + c * u0[1]]; }
    };
  }

  /* i numeri di un tiro: p = { v (10⁵ m/s, se non c'è il filtro), E (kV/m), B1, B (T), s (+1 ⊙, −1 ⊗) } */
  function velocita(p, L) {
    if (!L.filtro) return p.v;
    const B1 = L.filtro.unico ? p.B : p.B1;
    return B1 > 0 ? p.E * 1000 / B1 / 1e5 : 0;          /* v = E/B₁, in unità di 10⁵ m/s */
  }
  const raggio = (ione, v, B) => (B > 0 ? ione.m * UM * v * 1e5 / (Math.abs(ione.q) * QE * B) * 100 : Infinity);   /* in cm */

  /* il percorso di uno ione nel campo: entra in (0, 0) andando verso +y; regione del campo |x| ≤ W, 0 ≤ y ≤ W/2 */
  function volo(ione, v, p, L) {
    const Wl = L.W, H = L.W / 2, Bz = p.s * p.B;
    const m = moto(ione, 0, Bz, [0, 0], [0, v * V10]);
    const r = raggio(ione, v, p.B), tMezzo = Math.PI / Math.abs(m.W);
    const fuori = q => q[0] < -Wl - 1e-9 || q[0] > Wl + 1e-9 || q[1] > H + 1e-9;
    if (!fuori(m.pos(tMezzo / 2)) && 2 * r <= Wl && r <= H) {
      const xa = m.pos(tMezzo)[0];
      return { tipo: 'lastra', x: xa, r, t: tMezzo, m, tMezzo, lato: xa < 0 ? -1 : 1 };
    }
    /* esce dal campo: primo istante fuori (campionato, poi bisezione), poi tira dritto */
    let a = 0, b = tMezzo;
    const N = 400;
    for (let k = 1; k <= N; k++) { const t = tMezzo * k / N; if (fuori(m.pos(t))) { a = tMezzo * (k - 1) / N; b = t; break; } }
    for (let k = 0; k < 50; k++) { const c = (a + b) / 2; if (fuori(m.pos(c))) b = c; else a = c; }
    const pe = m.pos(b), ve = m.vel(b);
    return { tipo: 'fuori', x: pe[0], y: pe[1], r, t: b, m, tMezzo, uscita: pe, vUscita: ve, lato: pe[0] < 0 ? -1 : 1 };
  }

  /* il filtro di velocità: B₁ entra nel foglio (⊗), E va da + (a sinistra) a − (a destra). Lo ione con v = E/B₁ va dritto;
     gli altri curvano e sbattono su una piastra o sul bordo della fenditura d'uscita. */
  function nelFiltro(ione, v, p, L) {
    const B1 = L.filtro.unico ? p.B : p.B1, E = p.E * 1000;
    const m = moto(ione, E, -B1, [0, Y_F0], [0, v * V10]);
    const dt = 0.002, tMax = 40;
    let t = 0, q = m.pos(0);
    for (t = dt; t < tMax; t += dt) {
      q = m.pos(t);
      if (Math.abs(q[0]) >= X_PIASTRA) return { m, t, tipo: 'piastra', fine: q };
      if (q[1] >= Y_F1) return Math.abs(q[0]) <= FEND ? { m, t, tipo: 'passa', fine: q } : { m, t, tipo: 'bordo', fine: q };
      if (q[1] < Y_F0 - 0.5) return { m, t, tipo: 'indietro', fine: q };
    }
    return { m, t, tipo: 'indietro', fine: q };
  }

  /* un tiro intero: per ogni ione del fascio, dove arriva e se è nel suo buco */
  function tiro(p, L) {
    const v = velocita(p, L);
    const vMax = L.filtro ? 4 : LIM.v[1];
    const passa = !L.filtro || (v >= 0.2 - 1e-9 && v <= vMax + 1e-9 && p.E > 0);
    const esiti = L.ioni.map((id, i) => {
      const ione = IONI[id];
      if (!passa) return { id, ione, tipo: 'filtro' };
      const f = volo(ione, v, p, L);
      f.id = id; f.ione = ione;
      if (f.tipo === 'lastra' && L.buchi) {
        const b = L.buchi.find(h => Math.abs(f.x - h.x) <= TOL);
        f.buco = b || null;
        f.ok = !!b && b.ione === id;
      }
      return f;
    });
    return { v, passa, esiti, ok: !!L.buchi && esiti.every(e => e.ok) };
  }

  /* ---------------- livelli ----------------
     liberi: i comandi che si possono toccare. soluzione: i comandi con cui sono stati calcolati i buchi (al decimo di cm).
     La prova dei livelli conta le soluzioni sulla griglia dei comandi (B a passi di 0,01 T, E di 0,5 kV/m). */
  const LIVELLI = [
    { consegna: 'Neon-20 (carica +e) a <b>1,0·10<sup>5</sup>&nbsp;m/s</b>: regola B per mandarlo nel buco.',
      ioni: ['ne20'], inizio: { v: 1, B: 0.5, s: -1 }, liberi: ['B'], soluzione: { B: 0.25 }, W: 20 },                     /* B = 0,25 T */
    { consegna: 'Ora cloro-35, uno ione <b>negativo</b>: scegli verso e intensità di B.',
      ioni: ['cl35'], inizio: { v: 1, B: 0.4, s: -1 }, liberi: ['B', 's'], soluzione: { B: 0.35, s: 1 }, W: 24 },          /* ⊙ 0,35 T */
    { consegna: 'Il <b>filtro</b> fa passare dritto solo chi ha la velocità giusta. Regola E.',
      ioni: ['ne20'], filtro: {}, inizio: { E: 10, B1: 0.1, B: 0.25, s: -1 }, liberi: ['E'], soluzione: { E: 15 }, W: 28 }, /* E = 15 kV/m */
    { consegna: 'Argon-40 con carica <b>+2e</b>, a 1,0·10<sup>5</sup>&nbsp;m/s: regola B.',
      ioni: ['ar40'], inizio: { v: 1, B: 0.5, s: -1 }, liberi: ['B'], soluzione: { B: 0.2 }, W: 24 },                      /* B = 0,20 T */
    { consegna: 'Due isotopi del cloro. E è fisso: regola B<sub>1</sub>, uno ione per buco.',
      ioni: ['cl35', 'cl37'], filtro: {}, inizio: { E: 20, B1: 0.4, B: 0.4, s: 1 }, liberi: ['B1'], soluzione: { B1: 0.2 }, W: 24 },   /* B₁ = 0,20 T */
    { consegna: 'Neon-20 (+e) e cloro-35 (−e) insieme: ognuno nel suo buco.',
      ioni: ['ne20', 'cl35'], filtro: {}, inizio: { E: 20, B1: 0.2, B: 0.2, s: 1 }, liberi: ['B', 's'], soluzione: { B: 0.3, s: -1 }, W: 28 },   /* ⊗ 0,30 T */
    { consegna: 'Un campo solo: lo stesso B nel filtro e nel cerchio. E è fisso.',
      ioni: ['c12'], filtro: { unico: true }, inizio: { E: 10, B: 0.2, s: -1 }, liberi: ['B'], soluzione: { B: 0.1 }, W: 28 },  /* B = 0,10 T */
    { consegna: 'Carbonio-12 e 14: tutti i comandi sono tuoi.',
      ioni: ['c12', 'c14'], filtro: {}, inizio: { E: 10, B1: 0.1, B: 0.4, s: -1 }, liberi: ['E', 'B1', 'B', 's'], soluzione: { E: 20, B1: 0.1, B: 0.4, s: 1 }, W: 18 }   /* v/B₂ = 5·10⁵ */
  ];
  /* i buchi si calcolano dalla soluzione, con la stessa fisica del gioco */
  LIVELLI.forEach(L => {
    const p = Object.assign({}, L.inizio, L.soluzione);
    L.buchi = L.ioni.map(id => { const f = volo(IONI[id], velocita(p, L), p, L); return { ione: id, x: Math.round(f.x * 10) / 10 }; });
  });
  const LIBERO = { ioni: ['ne20'], W: 30, libero: true };

  /* le frasi di Stilla a fine livello (corte: si legge solo la prima frase) */
  const VITTORIE = [
    'Campo dimezzato, cerchio doppio: in r = m·v/(q·B) il campo sta al denominatore.',
    'Carica negativa, forza al contrario: per mandarlo dalla stessa parte del neon si capovolge B.',
    'Il filtro sceglie la velocità, v = E/B₁: più E, ioni più veloci e cerchi più larghi.',
    'Massa doppia ma anche carica doppia: conta m/q, e argon-40²⁺ gira come il neon-20⁺.',
    'Più B₁ nel filtro vuol dire ioni più lenti: B₁ e B₂ stringono tutti e due il cerchio.',
    'Stesso campo, cariche opposte: girano in versi opposti, e ciascuno con il suo m/q.',
    'Con un campo solo r = m·E/(q·B²): B dimezzato, cerchio quattro volte più grande.',
    'Conta solo il rapporto v/B₂: i due buchi sono a 2,1\u00a0cm l\'uno dall\'altro, come nel problema della teoria.'
  ];

  const AIUTO = 'Lo ione entra dalla fenditura con velocità v (la freccia azzurra), perpendicolare al campo B (verde: ⊗ entra nel foglio, ⊙ esce). La forza di Lorentz F = q·v·B (arancio) è sempre perpendicolare a v: lo fa girare su un cerchio di raggio r = m·v/(q·B), senza cambiare il modulo della velocità. Dopo mezzo giro torna sulla lastra a 2r dalla fenditura. Il verso: mano destra aperta, pollice su v, dita su B, F esce dal palmo; per una carica negativa è il contrario. I buchi sono larghi 8\u00a0mm: il livello è superato se lo ione arriva a meno di 4\u00a0mm dal centro. Masse in u (1 u = 1,66·10⁻²⁷ kg), e = 1,60·10⁻¹⁹ C.';
  const AIUTO_FILTRO = ' Nel filtro il campo elettrico E spinge lo ione da una parte e il campo B₁ dall\'altra: vanno dritti solo gli ioni con q·E = q·v·B₁, cioè v = E/B₁, qualunque siano massa e carica. Gli altri sbattono.';
  const AIUTI = {
    3: ' Qui la carica è 2e: guarda bene dove sta q nella formula.',
    6: ' Qui B₁ = B: il campo compare due volte, nel filtro e nel cerchio.',
    7: ' Scegli prima il verso di B₂ guardando dove sono i buchi; poi conta solo il rapporto v/B₂.'
  };
  const AIUTO_LIBERO = 'In modalità libera non ci sono buchi da centrare. Scegli lo ione, la velocità v, il campo B e il suo verso, poi Via: le tracce restano, così puoi confrontare i tiri (per esempio lo stesso ione con due velocità: guarda il tempo di mezzo giro). «Casuale» propone un tiro a caso, «Ricomincia» cancella le tracce.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}'); }
  /* 1,5 · 10^5 */
  function texSci(x, d) {
    if (!(x > 0)) return '0';
    let e = Math.floor(Math.log10(x)), c = x / Math.pow(10, e);
    if (Math.round(c * Math.pow(10, d)) >= 10 * Math.pow(10, d)) { c /= 10; e++; }
    return texNum(c, d) + ' \\cdot 10^{' + e + '}';
  }
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };

  QUANTO.registraLab({
    id: 'spettrometro',
    fisica: { IONI, LIVELLI, LIM, tiro, volo, nelFiltro, velocita, raggio, moto, TOL },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-spettrometro')) { const s = document.createElement('style'); s.id = 'stile-lab-spettrometro'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-spettrometro');
      const bott = (d, et) => `<button type="button" class="btn piccolo" data-d="${d}" aria-label="${et}">${d < 0 ? '−' : '+'}</button>`;
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun buco, ione, velocità e campo li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param ione" data-p="ione" title="Lo ione">${bott(-1, 'ione precedente')}<output></output>${bott(1, 'ione successivo')}</div>
              <div class="lab-param" data-p="v"><span class="nome">${ctx.tex('v')}</span>${bott(-1, 'velocità più bassa')}<output></output>${bott(1, 'velocità più alta')}</div>
              <div class="lab-param" data-p="E"><span class="nome">${ctx.tex('E')}</span>${bott(-1, 'campo elettrico più debole')}<output></output>${bott(1, 'campo elettrico più forte')}</div>
              <div class="lab-param" data-p="B1"><span class="nome">${ctx.tex('B_1')}</span>${bott(-1, 'campo del filtro più debole')}<output></output>${bott(1, 'campo del filtro più forte')}</div>
              <div class="lab-param" data-p="B"><span class="nome nome-B">${ctx.tex('B')}</span>${bott(-1, 'campo più debole')}<output></output>${bott(1, 'campo più forte')}</div>
              <div class="lab-param" data-p="s"><button type="button" class="btn piccolo b-verso" aria-label="Inverti il verso del campo"></button></div>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-via">▶ Via</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { via: q('.b-via'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero'), verso: q('.b-verso') };
      const box = {}; ['ione', 'v', 'E', 'B1', 'B', 's'].forEach(k => { box[k] = q('[data-p="' + k + '"]'); });

      /* ---------------- stato ---------------- */
      let livello = 0, p = {}, colpi = 0, finito = false, animando = false, raf = 0;
      let tracce = [], ultimo = null, detti = {}, ioneLibero = 0;
      let libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const libera = k => libero ? (k !== 'E' && k !== 'B1') : LIVELLI[livello].liberi.indexOf(k) >= 0;

      /* ---------------- scena: SVG in pixel veri; la lastra orizzontale (ioni che salgono) o verticale (ioni che vanno a destra),
         scelta in base alla forma dello spazio. Coordinate del laboratorio in cm: fenditura in (0, 0), campo per y > 0. ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Uno spettrometro di massa: la sorgente, il filtro di velocità, la fenditura, il campo magnetico e la lastra con i buchi', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gTracce = el('g'), gVolo = el('g'), gTesti = el('g');
      [gFondo, gTracce, gVolo, gTesti].forEach(g => svg.appendChild(g));
      const orologio = el('text', { x: 10, y: 40, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 600 14px var(--font)' });
      svg.appendChild(orologio);

      let S = { w: 0, h: 0, U: 8, ox: 0, oy: 0, vert: false };
      /* dal laboratorio (cm) allo schermo (px): orizzontale x → destra, y → su; verticale (ruotato di 90° in senso orario) y → destra, x → giù */
      const P = (x, y) => S.vert ? [S.ox + y * S.U, S.oy + x * S.U] : [S.ox + x * S.U, S.oy - y * S.U];
      const Y_MIN = Y_SORG - 1.5;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const L = liv(), Wl = L.W, H = Wl / 2, mx = 2.5;
        const lungo = 2 * Wl + 2 * mx, corto = H + 1.5 - Y_MIN;     /* in cm */
        const Uo = Math.min((w - 20) / lungo, (h - 34) / corto), Uv = Math.min((w - 20) / corto, (h - 34) / lungo);
        const vert = Uv > Uo * 1.08;
        const U = vert ? Uv : Uo;
        let ox, oy;
        if (vert) { ox = (w - corto * U) / 2 - Y_MIN * U; oy = h / 2 + 6; }
        else { ox = w / 2; oy = (h - corto * U) / 2 + (H + 1.5) * U + 8; }
        S = { w, h, U, ox, oy, vert };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        orologio.setAttribute('x', vert ? 10 : w - 10); orologio.setAttribute('y', vert ? 20 : 40); orologio.setAttribute('text-anchor', vert ? 'start' : 'end');
        svg.setAttribute('data-vert', vert ? ' verticale' : ' orizzontale');
      }
      /* rettangolo fra due angoli del laboratorio */
      function rett(x0, y0, x1, y1, a) {
        const A = P(x0, y0), B = P(x1, y1);
        return el('rect', Object.assign({ x: Math.min(A[0], B[0]), y: Math.min(A[1], B[1]), width: Math.abs(B[0] - A[0]), height: Math.abs(B[1] - A[1]) }, a));
      }
      function linea(x0, y0, x1, y1, a) { const A = P(x0, y0), B = P(x1, y1); return el('line', Object.assign({ x1: A[0], y1: A[1], x2: B[0], y2: B[1] }, a)); }
      /* testo con pedici e apici: pezzi = [[testo, 'sub'|'sup'|''], ...] */
      function scritta(g, x, y, pezzi, a) {
        const t = el('text', Object.assign({ x, y, fill: 'var(--testo)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, a));
        pezzi.forEach(pz => {
          if (typeof pz === 'string') pz = [pz, ''];
          if (!pz[1]) { t.appendChild(document.createTextNode(pz[0])); return; }
          t.appendChild(el('tspan', { 'baseline-shift': pz[1] === 'sub' ? 'sub' : 'super', style: 'font-size: 10px' }, pz[0]));
        });
        g.appendChild(t);
        try {   /* se esce dai bordi, la sposto dentro */
          const bb = t.getBBox(), sx = bb.x < 3 ? 3 - bb.x : (bb.x + bb.width > S.w - 3 ? S.w - 3 - bb.x - bb.width : 0);
          if (sx) t.setAttribute('x', x + sx);
        } catch (e) { /* non ancora disegnata */ }
        return t;
      }
      /* il simbolo dello ione: ²⁰Ne⁺, ⁴⁰Ar²⁺, ³⁵Cl⁻ */
      const caricaTesto = q => (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−');
      const simboloIone = io => [[String(io.a), 'sup'], io.el, [caricaTesto(io.q), 'sup']];
      const coloreCarica = io => io.q > 0 ? 'var(--s4)' : 'var(--s1)';
      /* ⊙ (s = +1, esce dal foglio: la punta) e ⊗ (s = −1, entra: la coda) */
      function simboloB(g, cx, cy, r, s, op) {
        const gg = el('g', { opacity: op == null ? 1 : op });
        gg.appendChild(el('circle', { cx, cy, r, fill: 'none', stroke: 'var(--s3)', 'stroke-width': 1.6 }));
        if (s > 0) gg.appendChild(el('circle', { cx, cy, r: r * 0.3, fill: 'var(--s3)' }));
        else { const a = r * 0.55; gg.appendChild(el('path', { d: `M${cx - a} ${cy - a} L${cx + a} ${cy + a} M${cx + a} ${cy - a} L${cx - a} ${cy + a}`, stroke: 'var(--s3)', 'stroke-width': 1.6, 'stroke-linecap': 'round' })); }
        g.appendChild(gg);
      }
      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }

      function disegnaFondo() {
        vuota(gFondo); vuota(gTesti);
        const L = liv(), Wl = L.W, H = Wl / 2, U = S.U;
        /* la regione del campo, con la griglia dei simboli ⊗/⊙ */
        gFondo.appendChild(rett(-Wl, 0, Wl, H, { fill: 'var(--s3)', opacity: .07 }));
        gFondo.appendChild(rett(-Wl, 0, Wl, H, { fill: 'none', stroke: 'var(--s3)', 'stroke-width': 1.2, 'stroke-dasharray': '6 5', opacity: .55 }));
        const passo = [2, 2.5, 4, 5, 6].find(s => s * U >= 34) || 8;
        for (let x = passo / 2; x < Wl; x += passo) for (let y = passo / 2; y < H; y += passo) {
          [x, -x].forEach(xx => { const c = P(xx, y); simboloB(gFondo, c[0], c[1], Math.min(7, passo * U * 0.18), p.s, 0.5); });
        }
        /* la lastra con la fenditura e i buchi */
        const spess = 5, buchi = (L.buchi || []).map(h => [h.x - TOL, h.x + TOL]).concat([[-FEND, FEND]]).sort((a, c) => a[0] - c[0]);
        let da = -Wl;
        buchi.forEach(h => { if (h[0] > da) gFondo.appendChild(lastra(da, h[0], spess)); da = h[1]; });
        if (da < Wl) gFondo.appendChild(lastra(da, Wl, spess));
        /* il righello della lastra, dalla parte di fuori, in cm dalla fenditura */
        const pr = [1, 2, 5, 10].find(s => s * U >= 30) || 10;
        for (let x = -Math.floor(Wl / pr) * pr; x <= Wl + 1e-9; x += pr) {
          if (Math.abs(x) < 1e-9) continue;
          gFondo.appendChild(linea(x, 0, x, -0.9 * 8 / U - 0.3, { stroke: 'var(--testo2)', 'stroke-width': 1.2 }));
          if (Math.abs(x) < (S.vert ? 7 : 3.2) + 1e-9 || x > Wl - 1e-9) continue;
          const c = P(x, 0);
          if (S.vert) gTesti.appendChild(el('text', { x: c[0] - 12, y: c[1] + 4, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, String(Math.abs(x))));
          else gTesti.appendChild(el('text', { x: c[0], y: c[1] + 22, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, String(Math.abs(x))));
        }
        const cm = P(Wl, 0);
        if (S.vert) gTesti.appendChild(el('text', { x: cm[0] - 12, y: cm[1] + 16, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'cm'));
        else gTesti.appendChild(el('text', { x: cm[0] + 4, y: cm[1] + 22, 'text-anchor': 'start', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'cm'));
        /* i buchi: un raccoglitore dietro, e l'etichetta con lo ione e la distanza */
        (L.buchi || []).forEach(h => {
          gFondo.appendChild(rett(h.x - TOL, -0.3, h.x + TOL, -0.3 - 10 / U, { fill: coloreCarica(IONI[h.ione]), opacity: .35, rx: 2 }));
          const c = P(h.x, 0), io = IONI[h.ione];
          const vicino = (L.buchi || []).filter(k => k !== h && Math.abs(k.x - h.x) < 4);
          const secondo = vicino.length && Math.abs(h.x) > Math.abs(vicino[0].x);   /* due buchi vicini: le scritte una più in là dell'altra */
          const testo = simboloIone(io).concat([' ' + num(Math.abs(h.x), 1) + '\u00a0cm']);
          const et = S.vert ? scritta(gTesti, c[0] + 10, c[1] + 4 + (vicino.length ? (secondo ? 1 : -1) * 9 * Math.sign(h.x) : 0), testo, { 'text-anchor': 'start' })
            : scritta(gTesti, c[0], c[1] - 10 - (secondo ? 17 : 0), testo, { 'text-anchor': 'middle' });
          try {   /* un fondino sotto l'etichetta: non copre più i simboli del campo */
            const bb = et.getBBox();
            gTesti.insertBefore(el('rect', { x: bb.x - 3, y: bb.y - 1, width: bb.width + 6, height: bb.height + 2, rx: 4, fill: 'var(--sup2)', opacity: .92 }), et);
          } catch (e) { /* non ancora disegnata */ }
        });
        /* sotto la fenditura: il filtro di velocità, oppure l'acceleratore che dà la velocità */
        if (L.filtro) disegnaFiltro(L); else disegnaAcceleratore(L);
        /* la sorgente */
        gFondo.appendChild(rett(-2.2, Y_SORG - 1, 2.2, Y_SORG + 1, { fill: 'var(--testo2)', opacity: .35, rx: 4 }));
        const cs = P(2.4, Y_SORG), pezzi = [];
        L.ioni.forEach((id, i) => { if (i) pezzi.push(' e '); simboloIone(IONI[id]).forEach(z => pezzi.push(z)); });
        if (S.vert) { const c0 = P(0, Y_SORG); scritta(gTesti, c0[0], c0[1] + 2.2 * U + 16 + (L.filtro ? 34 : 0), pezzi, { 'text-anchor': 'middle' }); }
        else scritta(gTesti, cs[0] + 6, cs[1] + 5, pezzi, { 'text-anchor': 'start' });
        /* il verso del campo, scritto in un angolo della regione */
        const ang = S.vert ? P(-Wl, 0) : P(-Wl, H);
        const etB = p.s > 0 ? 'B esce (⊙)' : 'B entra (⊗)';
        scritta(gTesti, ang[0] + 2, ang[1] - 7, [L.filtro && !L.filtro.unico ? ['B', ''] : 'B', L.filtro && !L.filtro.unico ? ['2', 'sub'] : '', ' = ' + num(p.B, 2) + '\u00a0T, ' + etB.slice(2)], { fill: 'var(--s3)', 'text-anchor': 'start' });
      }
      function lastra(x0, x1, sp) {
        const A = P(x0, 0), B = P(x1, 0);
        return S.vert ? el('rect', { x: A[0] - sp, y: Math.min(A[1], B[1]), width: sp, height: Math.abs(B[1] - A[1]), fill: 'var(--testo)', opacity: .75 })
                      : el('rect', { x: Math.min(A[0], B[0]), y: A[1], width: Math.abs(B[0] - A[0]), height: sp, fill: 'var(--testo)', opacity: .75 });
      }
      function disegnaFiltro(L) {
        const U = S.U, x0 = -X_PIASTRA, x1 = X_PIASTRA;
        /* le piastre: + a sinistra (x < 0), − a destra; il campo elettrico (grigio) va dalla + alla − */
        gFondo.appendChild(rett(x0 - 0.5, Y_F0, x0, Y_F1, { fill: 'var(--testo2)', opacity: .55, rx: 1.5 }));
        gFondo.appendChild(rett(x1, Y_F0, x1 + 0.5, Y_F1, { fill: 'var(--testo2)', opacity: .55, rx: 1.5 }));
        gFondo.appendChild(rett(x0, Y_F0, x1, Y_F1, { fill: 'var(--testo2)', opacity: .08 }));
        /* il tappo d'uscita del filtro, con la sua fenditura */
        gFondo.appendChild(rett(x0 - 0.5, Y_F1, -FEND, Y_F1 + 0.35, { fill: 'var(--testo)', opacity: .6 }));
        gFondo.appendChild(rett(FEND, Y_F1, x1 + 0.5, Y_F1 + 0.35, { fill: 'var(--testo)', opacity: .6 }));
        const piu = P(x0 - 0.25, Y_F0 - 0.9), meno = P(x1 + 0.25, Y_F0 - 0.9);
        gTesti.appendChild(el('text', { x: piu[0], y: piu[1] + 5, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 700 15px var(--font)' }, '+'));
        gTesti.appendChild(el('text', { x: meno[0], y: meno[1] + 5, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 700 15px var(--font)' }, '−'));
        /* frecce di E e simboli di B₁ (entra) dentro il filtro */
        const nE = Math.max(2, Math.min(5, Math.floor((Y_F1 - Y_F0) * U / 40)));
        for (let k = 0; k < nE; k++) {
          const y = Y_F0 + (k + 0.5) * (Y_F1 - Y_F0) / nE;
          const A = P(x0 + 0.15, y), B = P(x0 + 0.95, y);
          if (k % 2 === 0) freccia(gFondo, A[0], A[1], B[0], B[1], 'var(--testo2)', 1.6);
          else { const c = P(0.6, y); simboloB(gFondo, c[0], c[1], Math.min(6, 0.42 * U), -1, 0.8); }
        }
        const B1 = L.filtro.unico ? p.B : p.B1;
        const et = P(x1 + 0.9, (Y_F0 + Y_F1) / 2);
        if (S.vert) {
          const c = P(x1 + 0.6, Y_F1 - 1);
          scritta(gTesti, c[0] + 2, c[1] + 14, ['E = ' + num(p.E, p.E % 1 ? 1 : 0) + ' kV/m'], { 'text-anchor': 'end', fill: 'var(--testo2)' });
          scritta(gTesti, c[0] + 2, c[1] + 31, ['B', ['1', 'sub'], ' = ' + num(B1, 2) + '\u00a0T'], { 'text-anchor': 'end', fill: 'var(--s3)' });
        } else {
          scritta(gTesti, et[0] + 4, et[1] - 4, ['E = ' + num(p.E, p.E % 1 ? 1 : 0) + ' kV/m'], { 'text-anchor': 'start', fill: 'var(--testo2)' });
          scritta(gTesti, et[0] + 4, et[1] + 14, ['B', ['1', 'sub'], ' = ' + num(B1, 2) + '\u00a0T (⊗)'], { 'text-anchor': 'start', fill: 'var(--s3)' });
        }
        const lab = P(x0 - 0.6, (Y_F0 + Y_F1) / 2);
        if (!S.vert) scritta(gTesti, lab[0] - 6, lab[1] + 4, ['filtro'], { 'text-anchor': 'end', fill: 'var(--testo2)' });
      }
      function disegnaAcceleratore(L) {
        gFondo.appendChild(rett(-1.4, Y_SORG + 1, 1.4, Y_F1, { fill: 'var(--testo2)', opacity: .14, rx: 3 }));
        const c = P(1.6, (Y_SORG + Y_F1) / 2 + 1);
        const t = ['v = ' + num(p.v, 1) + '·10', ['5', 'sup'], '\u00a0m/s'];
        if (S.vert) { const d = P(0, (Y_SORG + Y_F1) / 2); scritta(gTesti, d[0], d[1] - 1.4 * S.U - 8, t, { 'text-anchor': 'middle', fill: 'var(--s1)' }); }
        else scritta(gTesti, c[0] + 4, c[1] + 4, t, { 'text-anchor': 'start', fill: 'var(--s1)' });
      }

      /* le tracce dei tiri già fatti: l'ultimo pieno, gli altri sbiaditi (al massimo quattro tiri) */
      function percorso(e) {   /* i punti del volo nel campo, fino alla lastra o oltre l'uscita */
        const pts = [], n = 90;
        for (let k = 0; k <= n; k++) pts.push(e.m.pos(e.t * k / n));
        if (e.tipo === 'fuori') { const vv = e.vUscita, lv = Math.hypot(vv[0], vv[1]); pts.push([e.uscita[0] + vv[0] / lv * 6, e.uscita[1] + vv[1] / lv * 6]); }
        return pts;
      }
      const dPath = pts => pts.map((q, k) => { const c = P(q[0], q[1]); return (k ? 'L' : 'M') + c[0].toFixed(1) + ' ' + c[1].toFixed(1); }).join(' ');
      function disegnaTracce() {
        vuota(gTracce);
        tracce.forEach((t, i) => {
          const recente = i === tracce.length - 1, op = recente ? 0.95 : 0.22 + 0.12 * i;
          t.esiti.forEach(e => {
            if (e.tipo === 'filtro') return;
            const col = coloreCarica(e.ione);
            gTracce.appendChild(el('path', { d: dPath([[0, Y_F1], [0, 0]].concat(percorso(e))), fill: 'none', stroke: col, 'stroke-width': recente ? 2.2 : 1.5, 'stroke-dasharray': recente ? 'none' : '6 5', opacity: op }));
            if (e.tipo === 'lastra') {
              const c = P(e.x, 0);
              gTracce.appendChild(el('circle', { cx: c[0], cy: c[1], r: recente ? 5 : 3.5, fill: e.ok ? 'var(--ok)' : (e.buco ? 'var(--no)' : col), stroke: 'var(--sup)', 'stroke-width': 1.5, opacity: recente ? 1 : 0.6 }));
            }
          });
          /* il raggio dell'ultimo tiro, sul primo ione arrivato sulla lastra */
          const e0 = recente && t.esiti.find(e => e.tipo === 'lastra');
          if (e0) {
            const cx = e0.x / 2, A = P(cx, 0), B = P(cx, e0.r);
            gTracce.appendChild(el('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'var(--testo2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }));
            gTracce.appendChild(el('circle', { cx: A[0], cy: A[1], r: 2.5, fill: 'var(--testo2)' }));
            /* la scritta del raggio appena oltre la cima del cerchio */
            if (S.vert) scritta(gTracce, B[0] + 8, B[1] + 4, ['r = ' + num(e0.r, 1) + '\u00a0cm'], { fill: 'var(--testo2)', 'text-anchor': 'start' });
            else scritta(gTracce, B[0], B[1] - 8, ['r = ' + num(e0.r, 1) + '\u00a0cm'], { fill: 'var(--testo2)', 'text-anchor': 'middle' });
          }
        });
      }

      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaTracce(); }

      /* ---------------- pannello ---------------- */
      const ioneHTML = io => '<sup>' + io.a + '</sup>' + io.el + '<sup>' + caricaTesto(io.q) + '</sup>';
      const ioniHTML = L => L.ioni.map(id => ioneHTML(IONI[id])).join(' e ');
      function aggiornaParametri() {
        const L = liv(), filtro = !!L.filtro, unico = filtro && L.filtro.unico;
        box.ione.querySelector('output').innerHTML = ioneHTML(IONI[L.ioni[0]]);
        box.v.querySelector('output').innerHTML = num(p.v, 1) + '·10<sup>5</sup>&nbsp;<small>m/s</small>';   /* come nella scena e nella formula */
        box.E.querySelector('output').innerHTML = num(p.E, p.E % 1 ? 1 : 0) + '&nbsp;<small>kV/m</small>';
        box.B1.querySelector('output').innerHTML = num(p.B1, 2) + '&nbsp;<small>T</small>';
        box.B.querySelector('output').innerHTML = num(p.B, 2) + '&nbsp;<small>T</small>';
        b.verso.textContent = p.s > 0 ? '⊙ esce' : '⊗ entra';
        /* nel pannello solo i comandi che si toccano: quelli fissi si leggono nella scena */
        box.ione.hidden = !libero; box.v.hidden = !libero;
        ['E', 'B1', 'B', 's'].forEach(k => { box[k].hidden = !libera(k); });
        box.B.querySelector('.nome-B').innerHTML = ctx.tex(filtro && !unico ? 'B_2' : 'B');
        Object.keys(LIM).forEach(k => box[k].querySelectorAll('button[data-d]').forEach(bt => {
          const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? p[k] <= LIM[k][0] + 1e-9 : p[k] >= LIM[k][1] - 1e-9);
        }));
        box.ione.querySelectorAll('button').forEach(bt => { bt.disabled = animando; });
        b.verso.disabled = animando;
      }
      /* il ponte con la teoria: v = E/B₁ (nel filtro) e r = m·v/(q·B), con i numeri scelti; il raggio solo dopo il tiro */
      function aggiornaFormula() {
        const L = liv(), v = velocita(p, L), filtro = !!L.filtro, unico = filtro && L.filtro.unico;
        const fatto = libero || (ultimo && ['v', 'E', 'B1', 'B', 's'].every(k => ultimo.p[k] === p[k]));
        const pezzi = [];
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = s => fatto ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('\\approx \\ ?') + '</span>';
        const nB = filtro && !unico ? 'B_2' : 'B';
        if (filtro) {
          const B1 = unico ? p.B : p.B1, nB1 = unico ? 'B' : 'B_1';
          const vRis = p.E > 0 ? texSci(v * 1e5, 1) + '\\,\\text{m/s}' : '0';
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('v = \\dfrac{E}{' + nB1 + '}') + '</span>');
          pezzi.push('<span class="pezzo solo-largo">' + ctx.tex('= \\dfrac{' + texSci(p.E * 1000, 1) + '}{' + texNum(B1, 2) + '}\\,\\text{m/s} = ' + vRis) + '</span>');
          pezzi.push('<span class="pezzo solo-stretto">' + ctx.tex('v = E/' + nB1 + ' = ' + vRis) + '</span>');
          pezzi.push('<span style="flex-basis: 100%; height: 0"></span>');
        }
        const io = IONI[L.ioni[0]];
        const qTex = (Math.abs(io.q) > 1 ? Math.abs(io.q) + ' \\cdot ' : '') + '1{,}60 \\cdot 10^{-19}';
        pezzi.push('<span class="pezzo simbolo">' + ctx.tex('r = \\dfrac{m \\cdot v}{q \\cdot ' + nB + '}') + '</span>');
        pezzi.push(numerico('r = \\dfrac{' + io.m + ' \\cdot 1{,}66 \\cdot 10^{-27} \\cdot ' + texSci(Math.max(v, 1e-9) * 1e5, 1) + '}{' + qTex + ' \\cdot ' + texNum(p.B, 2) + '}\\,\\text{m}'));
        if (filtro && !(v > 0)) pezzi.pop();
        const rr = L.ioni.map(id => { const r = raggio(IONI[id], v, p.B); return (L.ioni.length > 1 ? 'r_{' + IONI[id].a + '}' : '') + ' \\approx ' + (r < 1000 ? texNum(r, 1) + '\\,\\text{cm}' : '\\infty'); });
        if (v > 0) pezzi.push(ris(rr.join(',\\ ')));
        formulaEl.innerHTML = pezzi.join('');
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (pl, k) => {
          pl.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          pl.classList.toggle('attivo', !libero && k === livello);
          pl.disabled = animando || (k > sblocco && k !== livello);
          pl.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero);
        b.libero.disabled = animando;
      }
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'tiri: ' + colpi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        p = Object.assign({ v: 1, E: 10, B1: 0.1, B: 0.25, s: -1 }, L.inizio);
        colpi = 0; finito = false; tracce = []; ultimo = null; detti = {};
        vuota(gVolo); orologio.textContent = ''; aiutoEl.hidden = true;
        consegnaEl.innerHTML = L.consegna;
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- il volo, animato col tempo vero (al rallentatore: 1 μs dura 0,45 s) ---------------- */
      const KS = 0.45, T_MAX = 2.4;
      /* le tracce animate: prima del campo (sorgente → fenditura, oppure dentro il filtro), poi nel campo */
      function pistePrima(L, t) {
        const out = [];
        if (L.filtro) {
          /* due ioni «sbagliati», più lenti e più veloci di E/B₁, che sbattono: calcolati con la stessa legge */
          const vd = morsa(t.v, 0.5, 3);
          [0.6, 1.6].forEach(f => {
            const io = IONI[L.ioni[0]], r = nelFiltro(io, vd * f, p, L), pts = [[0, Y_SORG + 1]];
            const n = 40; for (let k = 0; k <= n; k++) pts.push(r.m.pos(r.t * k / n));
            out.push({ pts, ione: io, prova: true });
          });
        }
        return out;
      }
      function fuoco() {
        if (animando || finito) return;
        const L = liv(), t = tiro(p, L);
        aiutoEl.hidden = true;
        if (!libero) colpi++;
        aggiornaConta();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.via.disabled = true; b.ric.disabled = true; b.casuale.disabled = true;
        aggiornaParametri(); aggiornaLivelli();
        vuota(gVolo); orologio.textContent = '';
        const prove = pistePrima(L, t);
        const tCampo = Math.max.apply(null, t.esiti.map(e => e.tipo === 'filtro' ? 0 : e.t + (e.tipo === 'fuori' ? 6 / (t.v * V10) : 0)));
        const fattore = Math.max(1, tCampo * KS / T_MAX), D1 = 0.55, D2 = tCampo * KS / fattore;
        const linee = t.esiti.map(e => { const g = el('path', { fill: 'none', stroke: coloreCarica(e.ione), 'stroke-width': 2.2, opacity: .9 }); gVolo.appendChild(g); return g; });
        const lineeP = prove.map(pr => { const g = el('path', { fill: 'none', stroke: coloreCarica(pr.ione), 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: .6 }); gVolo.appendChild(g); return g; });
        const gV = el('g'); gVolo.appendChild(gV);
        const t0 = performance.now();
        const passo = ora => {
          const s = (ora - t0) / 1000;
          vuota(gV);
          /* prima parte: tutti salgono verso la fenditura (i «sbagliati» del filtro curvano e sbattono) */
          const f1 = Math.min(1, s / D1);
          prove.forEach((pr, i) => {
            const n = Math.max(1, Math.round(f1 * (pr.pts.length - 1)));
            lineeP[i].setAttribute('d', dPath(pr.pts.slice(0, n + 1)));
            if (f1 < 1) { const c = P(pr.pts[n][0], pr.pts[n][1]); ione(gV, c[0], c[1], pr.ione, 0.6); }
          });
          t.esiti.forEach((e, i) => {
            if (e.tipo === 'filtro') return;
            const yy = Y_SORG + 1 + (0 - Y_SORG - 1) * f1;
            if (s < D1) {
              linee[i].setAttribute('d', dPath([[0, Y_SORG + 1], [0, yy]]));
              const c = P(0, yy); ione(gV, c[0], c[1], e.ione, 1);
              if (L.filtro && yy > Y_F0 && yy < Y_F1) forzeFiltro(gV, c, e.ione);
              else frecciaV(gV, c, [0, 1], t.v);
              return;
            }
            /* nel campo: tempo vero del laboratorio */
            const tc = Math.min((s - D1) / KS * fattore, e.t + (e.tipo === 'fuori' ? 6 / (t.v * V10) : 0));
            const pts = [[0, Y_SORG + 1], [0, 0]];
            const tArco = Math.min(tc, e.t), n = Math.max(2, Math.round(80 * tArco / e.t));
            for (let k = 0; k <= n; k++) pts.push(e.m.pos(tArco * k / n));
            let pos = e.m.pos(tArco), vel = e.m.vel(tArco), dentro = tc <= e.t;
            if (!dentro) { const vv = e.vUscita; pos = [e.uscita[0] + vv[0] * (tc - e.t), e.uscita[1] + vv[1] * (tc - e.t)]; vel = vv; pts.push(pos); }
            linee[i].setAttribute('d', dPath(pts));
            const fineCorsa = tc >= e.t + (e.tipo === 'fuori' ? 6 / (t.v * V10) : 0) - 1e-9;
            if (!fineCorsa) {
              const c = P(pos[0], pos[1]), lv = Math.hypot(vel[0], vel[1]);
              ione(gV, c[0], c[1], e.ione, 1);
              frecciaV(gV, c, [vel[0] / lv, vel[1] / lv], t.v);
              if (dentro) {   /* la forza di Lorentz punta verso il centro del cerchio: perpendicolare a v */
                const cen = [e.r * (e.m.W > 0 ? -1 : 1), 0], dx = cen[0] - pos[0], dy = cen[1] - pos[1], ld = Math.hypot(dx, dy) || 1;
                frecciaF(gV, c, [dx / ld, dy / ld], Math.abs(e.ione.q) * t.v * p.B);
              }
            }
          });
          if (s >= D1) {
            const tv = Math.min((s - D1) / KS * fattore, tCampo);
            orologio.textContent = 't = ' + num(tv, 2) + ' μs' + (fattore > 1.05 ? '   (×' + num(fattore * 1, 1) + ' più veloce)' : '');
          }
          if (s < D1 + D2) { raf = requestAnimationFrame(passo); return; }
          raf = 0; vuota(gV); atterra(t);
        };
        raf = requestAnimationFrame(passo);
      }
      /* lo ione: un pallino viola con + (positivo) o azzurro con − (negativo) */
      function ione(g, x, y, io, op) {
        const gg = el('g', { opacity: op });
        gg.appendChild(el('circle', { cx: x, cy: y, r: 7.5, fill: coloreCarica(io), stroke: 'var(--sup)', 'stroke-width': 1.5 }));
        gg.appendChild(el('path', { d: io.q > 0 ? `M${x - 3.5} ${y} H${x + 3.5} M${x} ${y - 3.5} V${y + 3.5}` : `M${x - 3.5} ${y} H${x + 3.5}`, stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }));
        g.appendChild(gg);
      }
      /* direzioni del laboratorio → schermo (la scena verticale è ruotata) */
      const dir = d => S.vert ? [d[1], d[0]] : [d[0], -d[1]];
      function frecciaV(g, c, d, v) {   /* lunghezza in proporzione al modulo: nel campo non cambia mai */
        const L = morsa(16 + 14 * v, 18, 64), s = dir(d);
        freccia(g, c[0] + s[0] * 9, c[1] + s[1] * 9, c[0] + s[0] * (9 + L), c[1] + s[1] * (9 + L), 'var(--s1)', 2.6);
      }
      function frecciaF(g, c, d, qvB) {
        const L = morsa(70 * qvB, 14, 56), s = dir(d);
        freccia(g, c[0] + s[0] * 9, c[1] + s[1] * 9, c[0] + s[0] * (9 + L), c[1] + s[1] * (9 + L), 'var(--s2)', 2.6);
      }
      function forzeFiltro(g, c, io) {   /* nel filtro, per lo ione che va dritto: q·E da una parte, q·v·B₁ dall'altra, uguali */
        const segno = io.q > 0 ? 1 : -1;
        const a = dir([segno, 0]), bb = dir([-segno, 0]);
        freccia(g, c[0] + a[0] * 9, c[1] + a[1] * 9, c[0] + a[0] * 30, c[1] + a[1] * 30, 'var(--s2)', 2.4);
        freccia(g, c[0] + bb[0] * 9, c[1] + bb[1] * 9, c[0] + bb[0] * 30, c[1] + bb[1] * 30, 'var(--s2)', 2.4);
      }

      /* ---------------- l'esito ---------------- */
      function descrivi(e, L) {   /* che cosa ha fatto uno ione, in parole (HTML) */
        const nome = ioneHTML(e.ione);
        if (e.tipo === 'fuori') return nome + ' esce dal campo: r = ' + num(e.r, 1) + '&nbsp;cm, troppo largo';
        const buco = (L.buchi || []).find(h => h.ione === e.id);
        if (e.ok) return nome + ' nel buco';
        if (e.buco) return nome + ' nel buco sbagliato';
        if (!buco) return nome + ' a ' + num(Math.abs(e.x), 1) + '&nbsp;cm';
        if (Math.sign(buco.x) !== Math.sign(e.x)) return nome + ' dalla parte sbagliata';
        const d = Math.abs(e.x) - Math.abs(buco.x);
        return nome + ' a ' + num(Math.abs(e.x), 1) + '&nbsp;cm: ' + (d < 0 ? 'corto' : 'lungo') + ' di ' + num(Math.abs(d), 1) + '&nbsp;cm';
      }
      function atterra(t) {
        animando = false; b.via.disabled = false; b.ric.disabled = false; b.casuale.disabled = false;
        const L = liv(), prec = ultimo;
        ultimo = { p: Object.assign({}, p), t };
        tracce.push(t); if (tracce.length > 4) tracce.shift();
        vuota(gVolo); disegnaTracce(); aggiorna(); aggiornaLivelli();
        if (libero) { msg.innerHTML = osserva(t); msg.className = 'lab-messaggio'; return; }
        if (!t.passa) {
          msg.innerHTML = p.E <= 0 ? 'Con E = 0 la forza magnetica nel filtro non è bilanciata: nessuno ione esce.'
            : 'v = E/' + (L.filtro && L.filtro.unico ? 'B' : 'B<sub>1</sub>') + ' = ' + num(t.v, 1) + '·10<sup>5</sup>&nbsp;m/s: la sorgente non ha ioni così ' + (t.v > 1 ? 'veloci' : 'lenti') + '.';
          msg.className = 'lab-messaggio no'; ctx.mascotte('sbagliato'); return;
        }
        if (t.ok) { vinci(); return; }
        const frasi = t.esiti.map(e => descrivi(e, L)), nomi = t.esiti.map(e => ioneHTML(e.ione));
        const resto = frasi.map((f, i) => f.slice(nomi[i].length));
        msg.innerHTML = (frasi.length > 1 && resto.every(r => r === resto[0]) && resto[0].indexOf('cm') < 0
          ? 'Tutti e due' + resto[0] : frasi.join('; ')) + '.';
        msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, t, prec);
      }
      function vinci() {
        finito = true; b.via.disabled = true;
        const L = LIVELLI[livello];
        msg.innerHTML = '<span class="vinto">' + (L.ioni.length > 1 ? 'Tutti e due nel loro buco.' : 'Nel buco.') + (colpi === 1 ? ' Al primo tiro.' : ' Tiri: ' + colpi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello], { espressione: colpi === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video e la teoria smontano: Stilla ne parla una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, t, prec) {
        const e = t.esiti[0], buco = L.buchi.find(h => h.ione === e.id);
        if (e.tipo === 'lastra' && Math.sign(e.x) !== Math.sign(buco.x)) {
          if (e.ione.q < 0) dici('lato', 'Per una carica negativa la forza ha il verso opposto: la mano destra va capovolta.');
          else dici('lato', 'Il verso lo decide la mano destra: pollice su v, dita su B, la forza esce dal palmo.');
          return;
        }
        /* L7: ha cambiato B in proporzione inversa alla distanza, come se r andasse con 1/B (e allora il cerchio esplode) */
        if (L.filtro && L.filtro.unico && prec && prec.t.passa && prec.t.esiti[0].tipo === 'lastra' && prec.p.B !== p.B) {
          const lineare = prec.p.B * Math.abs(prec.t.esiti[0].x) / Math.abs(buco.x);
          if (Math.abs(p.B - lineare) <= 0.011) { dici('quadrato', 'Qui B conta due volte, nel filtro e nel cerchio: r = m·E/(q·B²).'); return; }
        }
        if (e.tipo === 'fuori') { dici('fuori', 'Il cerchio è troppo largo e lo ione esce dal campo: r = m·v/(q·B).'); return; }
        /* L4: si è dimenticato la carica 2e (cade a metà strada) */
        if (L.ioni[0] === 'ar40' && Math.abs(Math.abs(e.x) - Math.abs(buco.x) / 2) < 0.8) { dici('carica', 'La carica è 2e: q sta al denominatore, e il raggio è la metà di quello di uno ione +e.'); return; }
        if (!prec || !prec.t.passa) return;
        const e0 = prec.t.esiti[0];
        if (e0.tipo !== 'lastra' || Math.sign(e0.x) !== Math.sign(buco.x)) return;
        const serve = Math.abs(buco.x) > Math.abs(e0.x) ? 1 : -1;       /* +1: serviva un cerchio più largo */
        const cambiati = ['E', 'B1', 'B', 's'].filter(k => prec.p[k] !== p[k]);
        if (cambiati.length !== 1) return;
        const k = cambiati[0], verso = p[k] > prec.p[k] ? 1 : -1;
        if (k === 'B' && verso === serve) { dici('B', 'Più campo, cerchio più stretto: in r = m·v/(q·B) il campo sta al denominatore.'); return; }
        if (k === 'B1' && verso === serve) { dici('B1', 'Più B₁ nel filtro fa passare ioni più lenti, v = E/B₁: e il cerchio si stringe.'); return; }
        if (k === 'E' && verso !== serve) { dici('E', 'Più E nel filtro fa passare ioni più veloci, v = E/B₁: e il cerchio si allarga.'); }
      }

      /* ---------------- modalità libera: nessun buco, nessun verdetto ---------------- */
      function osserva(t) {
        const e = t.esiti[0];
        let s = 'r = ' + num(e.r, 1) + '&nbsp;cm';
        if (e.tipo === 'lastra') {
          s += ', mezzo giro in ' + num(e.tMezzo, 2) + '&nbsp;μs.';
          const gemello = tracce.slice(0, -1).reverse().find(tr => tr.esiti[0].tipo === 'lastra' && tr.esiti[0].id === e.id && Math.abs(tr.esiti[0].tMezzo - e.tMezzo) < 1e-9 && Math.abs(tr.v - t.v) > 1e-9);
          if (gemello) s += ' Stesso tempo del tiro a ' + num(gemello.v, 1) + '·10<sup>5</sup>&nbsp;m/s: il tempo non dipende da v.';
        } else s += ': esce dal campo prima di mezzo giro.';
        return s;
      }
      function mostraLibero() {
        b.casuale.hidden = !libero;
        radice.classList.toggle('in-libero', libero);
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), colpi, finito, tracce: tracce.slice(), ultimo, detti: Object.assign({}, detti), cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        LIBERO.ioni = [ORDINE_LIBERO[ioneLibero]];
        p = { v: 1, E: 10, B1: 0.1, B: 0.25, s: -1 }; tracce = []; ultimo = null; finito = false;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio'; orologio.textContent = '';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; colpi = z.colpi; finito = z.finito; tracce = z.tracce; ultimo = z.ultimo; detti = z.detti;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.via.disabled = finito; orologio.textContent = '';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const r = (lo, hi, s) => Math.round((lo + Math.round(Math.random() * (hi - lo) / s) * s) * 100) / 100;
        ioneLibero = Math.floor(Math.random() * ORDINE_LIBERO.length); LIBERO.ioni = [ORDINE_LIBERO[ioneLibero]];
        const io = IONI[LIBERO.ioni[0]];
        p.v = r(0.5, 2.5, 0.1); p.s = Math.random() < 0.5 ? -1 : 1;
        /* un campo che tenga il cerchio dentro la regione (2r fra 6 e 26 cm) */
        const Bmin = io.m * UM * p.v * 1e5 / (Math.abs(io.q) * QE * 0.13), Bmax = io.m * UM * p.v * 1e5 / (Math.abs(io.q) * QE * 0.03);
        p.B = morsa(r(Bmin, Math.min(0.8, Bmax), 0.01), Math.max(0.01, Math.ceil(Bmin * 100) / 100), 0.8);
        msg.textContent = ''; ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        if (animando) return false;
        if (k === 'ione') {
          if (!libero) return false;
          ioneLibero = (ioneLibero + d + ORDINE_LIBERO.length) % ORDINE_LIBERO.length;
          LIBERO.ioni = [ORDINE_LIBERO[ioneLibero]];
          msg.textContent = ''; ridisegnaTutto(); aggiorna(); return true;
        }
        if (!libera(k)) return false;
        const lim = LIM[k];
        const nuovo = morsa(Math.round((p[k] + d * lim[2]) * 100) / 100, lim[0], lim[1]);
        if (nuovo === p[k]) return false;
        p[k] = nuovo;
        dopoCambio(); return true;
      }
      function dopoCambio() {
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        disegnaFondo(); disegnaTracce(); aggiorna();
      }
      /* − e +: un passo al tocco, e tenendo premuto si va avanti da soli */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        if (k === 'ione') return;
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {   /* da tastiera (o da un clic senza pointerdown) */
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });
      b.verso.addEventListener('click', () => {
        if (animando || !libera('s')) return;
        p.s = -p.s; dopoCambio();
      });

      b.via.addEventListener('click', fuoco);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { tracce = []; ultimo = null; msg.textContent = ''; orologio.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        const L = liv();
        aiutoEl.querySelector('p').textContent = libero ? AIUTO_LIBERO : AIUTO + (L.filtro ? AIUTO_FILTRO : '') + (AIUTI[livello] || '');
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      LIVELLI.forEach((_, k) => {
        const pl = document.createElement('button'); pl.type = 'button'; pl.className = 'lab-pallino';
        pl.setAttribute('aria-label', 'Livello ' + (k + 1)); pl.innerHTML = '<span>' + (k + 1) + '</span>';
        pl.addEventListener('click', () => { if (!animando) avviaLivello(k); });
        livelliEl.insertBefore(pl, b.libero);
      });

      avviaLivello(livello);
      let forma = '';
      const ro = new ResizeObserver(() => {
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); fermaRipeti(); ro.disconnect();
      };
    }
  });
})();
