/* Laboratorio «Il sottomarino» — spinta di Archimede e densità media (argomento fluidi).
   Si sceglie quanta acqua mettere nelle casse di zavorra (il resto è aria), poi Via: il sottomarino si muove con la
   legge vera, m·a = P − F_A − attrito dell'acqua, con F_A = Σ d·V_i·g sugli strati in cui sta lo scafo.
   Scafo: 8200 kg, volume 11 m³ (torretta compresa), casse fino a 4000 L, riempite in superficie.
   La densità media compare solo dopo il tentativo. Pressione viola (Stevino a strati), forze arancio, acqua azzurra. */
(function () {
  const STILE = `
    .lab-sottomarino .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; }
    .lab-sottomarino .lab-scena > svg { width: 100%; height: 100%; }
    .lab-sottomarino svg text { font-family: var(--font); }
    .lab-sottomarino svg text, .lab-sottomarino svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-sottomarino .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-sottomarino .consegna > span { display: block; }
    .lab-sottomarino .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-sottomarino .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .4em; font-size: clamp(1rem, 2.5cqmin, 1.2rem); line-height: 1.2; height: calc(4.4 * clamp(1rem, 2.5cqmin, 1.2rem)); flex: none; }
    .lab-sottomarino .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-sottomarino .formula .ignoto { color: var(--testo3); }
    .lab-sottomarino .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-sottomarino .formula .viola { color: var(--s4); }
    .lab-sottomarino .lab-messaggio { padding: 0 4px; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-sottomarino .formula { height: calc(6.4 * clamp(1rem, 2.5cqmin, 1.2rem)); } .lab-sottomarino .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-sottomarino .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-sottomarino .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-sottomarino .btn[disabled] { opacity: .38; cursor: default; }
    .lab-sottomarino .lab-parametri { max-width: 520px; }
    .lab-sottomarino .lab-param .nome { min-width: 2.4em; font-size: .95rem; }
    .lab-sottomarino .lab-param output { min-width: 0; width: 4.3ch; flex: none; white-space: nowrap; }
    .lab-sottomarino .lab-param[data-p="litri"] output { width: 5.9ch; }   /* fino a «3440 L» */
    @container lab (max-width: 420px) { .lab-sottomarino.in-libero .lab-parametri { column-gap: 3px; } .lab-sottomarino.in-libero [data-p="litri"] .nome { font-size: .75rem; min-width: 0; } .lab-sottomarino.in-libero [data-p="litri"] output { font-size: .94em; } .lab-sottomarino.in-libero .lab-param .btn { min-width: 34px; padding: 0 4px; } }
    .lab-sottomarino .lab-param .unita { font-size: .8rem; color: var(--testo2); }
    /* nel Libero: il pedice di d₂ non sotto i 12 px, e due parametri per riga anche nel pannello di lato */
    .lab-sottomarino [data-p="d2"] .nome { font-size: 1.04rem; }
    .lab-sottomarino.in-libero .lab-param { gap: 2px; }
    .lab-sottomarino.in-libero .lab-param .nome { min-width: 1.5em; }
    .lab-sottomarino .lab-param[hidden], .lab-sottomarino .b-casuale[hidden] { display: none; }
    .lab-sottomarino .conta { position: absolute; right: 70px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-sottomarino .vinto { display: inline-block; animation: lab-sottomarino-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-sottomarino-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-sottomarino .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-sottomarino .formula .simbolo { display: none; } .lab-sottomarino .formula .nome-stretto { display: inline; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 2 nel Libero, dove la consegna non c'è) */
    .lab-sottomarino .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(2 * var(--riga) + 1 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-sottomarino .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-sottomarino .lab-lato .consegna:empty { display: none; }
    .lab-sottomarino .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-sottomarino .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
    .lab-sottomarino .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); }   /* tre righe in ogni livello: l'osservazione del Libero è lunga, e la formula non deve spostarsi */
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura: la usa anche la prova dei livelli in node) ---------------- */
  const G = 9.8, P0 = 101300;
  const M_SCAFO = 8200, V_SCAFO = 11, CAP = 4000, PASSO = 10;          /* kg, m³, L, L */
  const R = 1.2, LR = 4.6, TW = 1.4, TH = 0.8;                          /* profilo: due semicerchi, un rettangolo, la torretta */
  const A_TOT = LR * 2 * R + Math.PI * R * R + TW * TH;
  const B_LIN = 2000, C_QUAD = 2500;                                    /* attrito dell'acqua: b·v + c·v·|v| (c = ½·d·Cx·S, S ≈ 5 m²) */
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));

  /* area del profilo più in basso della quota y (profondità, positiva verso il basso), con il centro a z */
  function sotto(y, z) {
    const u = y - z; let A;
    if (u <= -R) A = LR * 2 * R + Math.PI * R * R;
    else if (u >= R) A = 0;
    else A = LR * (R - u) + R * R * Math.acos(u / R) - u * Math.sqrt(R * R - u * u);
    const alto = z - R - TH, basso = z - R;
    return A + TW * morsa(basso - Math.max(y, alto), 0, TH);
  }
  const strati = L => L.strati;
  function densitaA(L, y) { const s = strati(L); let d = s[0].d; s.forEach(t => { if (y >= t.da) d = t.d; }); return d; }
  /* legge di Stevino a strati: p = p0 + Σ d·g·(spessore) */
  function pressione(L, y) {
    if (y <= 0) return P0;
    const s = strati(L); let p = P0;
    s.forEach((t, i) => { const fine = i + 1 < s.length ? s[i + 1].da : 1e9; if (y > t.da) p += t.d * G * (Math.min(y, fine) - t.da); });
    return p;
  }
  function carico(L) { return L.carico || null; }
  const quotaCarico = z => z + R + 0.5;                                  /* il carico appeso: alto 0,4 m, mezzo metro sotto lo scafo */
  /* la spinta di Archimede: ogni strato spinge con d·V_i·g */
  function spinta(L, z) {
    const s = strati(L); let F = 0;
    s.forEach((t, i) => {
      const a = Math.max(t.da, 0), b = i + 1 < s.length ? s[i + 1].da : 1e9;
      F += t.d * V_SCAFO * (sotto(a, z) - sotto(b, z)) / A_TOT * G;
    });
    const c = carico(L);
    if (c) { const top = quotaCarico(z), f = morsa((top + 0.4) / 0.4, 0, 1); F += densitaA(L, top + 0.2) * c.V * f * G; }
    return F;
  }
  /* le casse si riempiono in superficie: acqua dello strato più alto */
  const massaCasse = (L, litri) => strati(L)[0].d * litri / 1000;
  const massa = (L, litri) => M_SCAFO + massaCasse(L, litri) + (carico(L) ? carico(L).m : 0);
  const volume = L => V_SCAFO + (carico(L) ? carico(L).V : 0);
  const zMax = L => L.fondo - R - (carico(L) ? 0.9 : 0);                /* il punto più basso tocca il fondo */
  /* a galla, ferma: dove la spinta pareggia il peso (bisezione) */
  function galla(L, litri) {
    const m = massa(L, litri);
    let a = -R - TH, b = zMax(L);
    if (spinta(L, b) < m * G) return b;
    for (let k = 0; k < 60; k++) { const c = (a + b) / 2; if (spinta(L, c) < m * G) a = c; else b = c; }
    return (a + b) / 2;
  }

  /* il moto vero: m·a = m·g − F_A − b·v − c·v·|v| (asse verso il basso); si ferma quando è in equilibrio */
  function simula(L, litri, z0, tMin) {
    const m = massa(L, litri), dt = 0.02, zM = zMax(L), pts = [z0];
    let z = z0, v = 0, t = 0, fermo = 0, n = 0, appoggio = false;
    while (t < 400) {
      const F = m * G - spinta(L, z) - B_LIN * v - C_QUAD * v * Math.abs(v);
      v += F / m * dt; z += v * dt; t += dt;
      if (z >= zM) { z = zM; if (v > 0) v = 0; }
      if (++n % 5 === 0) pts.push(z);
      const netto = m * G - spinta(L, z);
      appoggio = z >= zM - 1e-9 && netto >= 0;
      if (t > (tMin || 2) && Math.abs(v) < 0.002 && (appoggio || Math.abs(netto) < 30)) { fermo += dt; if (fermo > 1) break; } else fermo = 0;
    }
    return esito(L, litri, z, { pts, t, fermo: fermo > 1, m });
  }
  /* dove è finito: a galla, sul fondo, sospeso, o appoggiato su uno strato più denso */
  function esito(L, litri, z, r) {
    r.z = z; r.p = pressione(L, z);
    const m = massa(L, litri); r.dm = m / volume(L);
    r.FA = spinta(L, z); r.P = m * G;
    if (z - R - TH < 0) { r.tipo = 'galla'; r.fi = (sotto(0, z)) / A_TOT; return r; }
    if (z >= zMax(L) - 1e-6 && r.P - r.FA > 1) { r.tipo = 'fondo'; return r; }
    const s = strati(L);
    for (let i = 1; i < s.length; i++) {
      const y = s[i].da;
      if (y > z - R - TH && y < z + R) { r.tipo = 'strato'; r.strato = i; r.fs = sotto(y, z) / A_TOT; return r; }
    }
    r.tipo = 'sospeso'; return r;
  }

  /* ---------------- livelli ----------------
     soluzioni (contate con la prova dei livelli, casse a passi di 10 L) fra parentesi */
  const LAGO = [{ da: 0, d: 1000 }], MARE = [{ da: 0, d: 1025 }];
  const LIVELLI = [
    { consegna: 'Nel lago, acqua dolce. Porta il sottomarino <b>sul fondo</b>, a 15\u00a0m.',
      strati: LAGO, fondo: 15, inizio: { galla: true, litri: 0 }, scopo: { tipo: 'fondo' }, formula: 'media' },
    { consegna: 'Fallo galleggiare con l\'<b>80%</b> del volume sott\'acqua: il pelo dell\'acqua sulla tacca rossa.',
      strati: LAGO, fondo: 15, inizio: { galla: true, litri: 0 }, scopo: { tipo: 'frazione', f: 0.8, tol: 0.01 }, formula: 'galleggia' },
    { consegna: 'Il sottomarino è fermo a <b>8\u00a0m</b>. Regola le casse perché resti lì: né sale né scende.',
      strati: LAGO, fondo: 15, inizio: { z: 8, litri: 2000 }, scopo: { tipo: 'sospeso' }, formula: 'media' },
    { consegna: 'In mare l\'acqua è salata: <b>1025 kg/m³</b>. Resta sospeso a <b>10\u00a0m</b>.',
      strati: MARE, fondo: 18, inizio: { z: 10, litri: 2800 }, scopo: { tipo: 'sospeso' }, formula: 'media' },
    { consegna: 'Sopra acqua dolce, dai <b>12\u00a0m</b> in giù acqua salata. Fermati appoggiato sullo strato salato.',
      strati: [{ da: 0, d: 1000 }, { da: 12, d: 1030 }], fondo: 20, inizio: { galla: true, litri: 0 }, scopo: { tipo: 'strato', i: 1 }, formula: 'media' },
    { consegna: 'Stessi strati: fermati con <b>metà scafo</b> nell\'acqua salata.',
      strati: [{ da: 0, d: 1000 }, { da: 12, d: 1030 }], fondo: 20, inizio: { galla: true, litri: 0 }, scopo: { tipo: 'meta', i: 1, f: 0.5, tol: 0.05 }, formula: 'media' },
    { consegna: 'Tre strati. Fermati dove il manometro segna circa <b>240\u00a0kPa</b>.',
      strati: [{ da: 0, d: 1000 }, { da: 6, d: 1015 }, { da: 14, d: 1030 }], fondo: 22, inizio: { galla: true, litri: 0 }, scopo: { tipo: 'pressione', p: 240000, tol: 15000 }, formula: 'pressione' },
    { consegna: 'Sotto lo scafo c\'è un\'ancora d\'acciaio: <b>779\u00a0kg</b> e <b>100\u00a0L</b>. Resta sospeso a <b>10\u00a0m</b> in mare.',
      strati: MARE, fondo: 18, inizio: { z: 10, litri: 2800 }, carico: { m: 779, V: 0.1 }, scopo: { tipo: 'sospeso' }, formula: 'media' }
  ];
  const VITTORIE = [
    'Più denso dell\'acqua che sposta, e va giù: non basta pesare tanto, conta la densità media.',
    'Sott\'acqua resta la densità media divisa quella dell\'acqua: 800 su 1000, l\'80%.',
    'Massa 11 000\u00a0kg in 11 m³: densità media uguale a quella dell\'acqua, e la spinta pareggia il peso.',
    'In mare serve più zavorra: l\'acqua salata è più densa, e la spinta è più grande.',
    'Più denso dell\'acqua dolce, meno di quella salata: si ferma in mezzo, appoggiato sullo strato.',
    'Metà nel salato: la densità media è a metà fra 1000 e 1030 kg/m³.',
    'Con Stevino a strati: 240\u00a0kPa sono a 14\u00a0m, dove comincia l\'acqua da 1030 kg/m³.',
    'Anche l\'ancora riceve la spinta: il volume che conta è 11,1 m³, non 11.'
  ];
  const AIUTO = 'Il sottomarino ha uno scafo di 8200\u00a0kg e un volume di 11 m³, torretta compresa. Dentro ci sono le casse di zavorra: si riempiono d\'acqua in superficie (fino a 4000\u00a0L), e il resto è aria. Trascina il serbatoio a destra oppure usa − e + (10\u00a0L a tocco; tenendo premuto si va veloci). Con Via il sottomarino parte da fermo: su di lui agiscono il peso P = m·g e la spinta di Archimede F<sub>A</sub> = d·V·g, con V il volume immerso e d la densità dell\'acqua dove si trova; l\'acqua frena il moto. La densità media del sottomarino, d<sub>c</sub>, compare dopo il tentativo. Il manometro viola segna la pressione dove sta il sottomarino.';
  const AIUTI = {
    1: ' La tacca rossa segna l\'80% del volume (non dell\'altezza). Vale se la parte immersa è fra il 79% e l\'81%.',
    2: ' Resta sospeso solo se peso e spinta sono uguali quando è tutto sott\'acqua. Vale se dopo il tentativo è fermo entro mezzo metro dagli 8\u00a0m.',
    3: ' Le casse si riempiono con l\'acqua del mare: un litro pesa 1,025\u00a0kg.',
    4: ' Un corpo più denso dell\'acqua dolce attraversa lo strato in alto; uno meno denso dell\'acqua salata non ci entra tutto.',
    5: ' Vale se nell\'acqua salata c\'è fra il 45% e il 55% dello scafo. Lo scafo che sta in ciascuno strato riceve la spinta di quello strato.',
    6: ' La pressione cresce di d·g per ogni metro, con la d dello strato attraversato. Vale fra 225 e 255\u00a0kPa, con il sottomarino fermo e non sul fondo.',
    7: ' L\'ancora sposta anche lei acqua: 100\u00a0L. Per restare sospeso, la massa totale deve essere uguale alla massa dell\'acqua spostata.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è obiettivo. Scegli l\'acqua nelle casse, la densità d dell\'acqua in alto e d₂ di quella sotto i 10\u00a0m (uguali: niente strati). Puoi trascinare il sottomarino in su e in giù prima di Via: parte da dove lo lasci. «Casuale» propone casse e strati a caso, «Ricomincia» lo riporta in superficie.';
  const num = (v, d) => (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',').replace('-', '−');
  const texNum = (v, d) => (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}');
  const texK = v => texNum(v, 1);   /* massa delle casse (passi di 10 L, cioè 10 o 10,25 kg) e volume: sempre un decimale */

  function verdetto(L, f) {
    const s = L.scopo;
    let testo = descrivi(L, f);
    let ok = false;
    if (s.tipo === 'fondo') ok = f.tipo === 'fondo';
    else if (s.tipo === 'frazione') { ok = f.tipo === 'galla' && Math.abs(f.fi - s.f) <= s.tol + 1e-9; if (f.tipo === 'galla' && !ok) testo += ' La tacca è all\'' + num(s.f * 100, 0) + '%.'; }
    else if (s.tipo === 'sospeso') {
      ok = f.tipo === 'sospeso' && f.fermo && Math.abs(f.z - L.inizio.z) <= 0.5;
      if (f.tipo === 'galla') testo = 'È risalito fino a galla.';
      else if (f.tipo === 'fondo') testo = 'È sceso fino al fondo.';
    }
    else if (s.tipo === 'strato') ok = f.tipo === 'strato' && f.strato === s.i;
    else if (s.tipo === 'meta') ok = f.tipo === 'strato' && f.strato === s.i && Math.abs(f.fs - s.f) <= s.tol + 1e-9;
    else if (s.tipo === 'pressione') {
      ok = f.fermo && f.tipo !== 'fondo' && f.tipo !== 'galla' && Math.abs(f.p - s.p) <= s.tol;
      testo = (f.tipo === 'galla' ? 'A galla' : f.tipo === 'fondo' ? 'Sul fondo, a ' + L.fondo + '\u00a0m' : 'Fermo a ' + num(f.z, 1) + '\u00a0m') + ': il manometro segna ' + num(f.p / 1000, 0) + '\u00a0kPa.';
    }
    return { ok, testo };
  }
  function descrivi(L, f) {
    if (f.tipo === 'galla') return 'A galla, con il ' + num(f.fi * 100, 0) + '% del volume sott\'acqua.';
    if (f.tipo === 'fondo') return 'Sul fondo, a ' + num(L.fondo, 0) + '\u00a0m.';
    if (f.tipo === 'strato') return 'Fermo sullo strato a ' + num(strati(L)[f.strato].da, 0) + '\u00a0m, con il ' + num(f.fs * 100, 0) + '% dello scafo nell\'acqua sotto.';
    return (f.fermo ? 'Sospeso e fermo a ' : 'Ancora in moto, a ') + num(f.z, 1) + '\u00a0m.';
  }

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };

  QUANTO.registraLab({
    id: 'sottomarino',
    fisica: { simula, galla, spinta, pressione, verdetto, massa, volume, sotto, LIVELLI, A_TOT },
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-sottomarino')) { const s = document.createElement('style'); s.id = 'stile-lab-sottomarino'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-sottomarino');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, casse e densità dell'acqua le scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="litri"><span class="nome">casse</span><button type="button" class="btn piccolo" data-d="-1" aria-label="meno acqua nelle casse">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="più acqua nelle casse">+</button></div>
              <div class="lab-param" data-p="d" hidden><span class="nome">${ctx.tex('d')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="acqua in alto meno densa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="acqua in alto più densa">+</button></div>
              <div class="lab-param" data-p="d2" hidden><span class="nome">${ctx.tex('d_2')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="acqua in basso meno densa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="acqua in basso più densa">+</button></div>
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
      const b = { via: q('.b-via'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { litri: q('[data-p="litri"]'), d: q('[data-p="d"]'), d2: q('[data-p="d2"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, litri = 0, z = 0, tentativi = 0, finito = false, animando = false, raf = 0;
      let ultimo = null, detti = {}, libero = false, salvato = null, ombre = [];
      let pl = { d: 1000, d2: 1030 };                      /* modalità libera: densità sopra e sotto i 10 m */
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const LIBERO = () => ({ strati: pl.d2 !== pl.d ? [{ da: 0, d: pl.d }, { da: 10, d: pl.d2 }] : [{ da: 0, d: pl.d }], fondo: 20, scopo: { tipo: 'libero' }, formula: 'media' });
      let Llib = LIBERO();
      const liv = () => libero ? Llib : LIVELLI[livello];
      const inizioZ = L => L.inizio.galla ? galla(L, L.inizio.litri) : L.inizio.z;

      /* ---------------- scena: SVG in pixel veri ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Un sottomarino nell\'acqua, con le casse di zavorra', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gOmbre = el('g'), gSub = el('g'), gForze = el('g'), gCasse = el('g');
      [gFondo, gOmbre, gSub, gForze, gCasse].forEach(g => svg.appendChild(g));
      const orologio = el('text', { x: 40, y: 18, fill: 'var(--testo2)', style: 'font: 600 13px var(--font)' });
      svg.appendChild(orologio);
      let S = { w: 300, h: 300, U: 10, oy: 40, cx: 150, gx: 250, gy0: 40, gy1: 200 };
      const Y = y => S.oy + y * S.U, X = x => S.cx + x * S.U;
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(220, Math.round(r.width)), h = Math.max(200, Math.round(r.height));
        const L = liv(), alto = -2.6, basso = L.fondo + 0.8;
        const gw = 56;                                     /* a destra, il serbatoio delle casse */
        const U = Math.min((h - 6) / (basso - alto), (w - gw - 40) / 9.5);
        const oy = (h - (basso - alto) * U) / 2 - alto * U;
        /* il sottomarino a destra delle etichette degli strati (finiscono a ~140 px), se c'è posto anche per il manometro */
        const gx = w - gw + 6, mezzo = (LR / 2 + R) * U, serve = 2 * mezzo + 12, da = 140;
        const cx = da + serve <= gx - 8 ? da + mezzo + (gx - 8 - da - serve) / 2 : 34 + (gx - 40) / 2;
        S = { w, h, U, oy, cx, gx, gy0: Math.max(30, h * 0.14), gy1: h - Math.max(34, h * 0.12) };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      const opacitaAcqua = d => morsa(0.14 + (d - 1000) / 30 * 0.16, 0.06, 0.5);
      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), s = strati(L);
        s.forEach((t, i) => {
          const y0 = Y(t.da), y1 = i + 1 < s.length ? Y(s[i + 1].da) : Y(L.fondo);
          gFondo.appendChild(el('rect', { x: 0, y: y0, width: S.w, height: y1 - y0, fill: 'var(--s1)', opacity: opacitaAcqua(t.d) }));
          if (i > 0) gFondo.appendChild(el('line', { x1: 0, y1: y0, x2: S.gx - 8, y2: y0, stroke: 'var(--s1)', 'stroke-width': 1.5, 'stroke-dasharray': '6 5', opacity: .9 }));
          gFondo.appendChild(el('text', { x: 34, y: y1 - 7, fill: 'var(--testo)', style: 'font: 600 12px var(--font)', opacity: .85 }, 'd = ' + t.d + ' kg/m³'));   /* in basso a sinistra nello strato */
        });
        gFondo.appendChild(el('path', { d: 'M0 ' + Y(0) + ' ' + Array.from({ length: Math.floor(S.w / 16) }, () => 'q4 -3 8 0 t8 0').join(' '), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 1.6, opacity: .8 }));
        gFondo.appendChild(el('rect', { x: 0, y: Y(L.fondo), width: S.w, height: S.h - Y(L.fondo), fill: '#b5813f', opacity: .42 }));
        gFondo.appendChild(el('line', { x1: 0, y1: Y(L.fondo), x2: S.w, y2: Y(L.fondo), stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .5 }));
        /* righello delle profondità */
        const passo = [1, 2, 5, 10].find(p => p * S.U >= 30) || 10;
        for (let y = passo; y < L.fondo - 0.3; y += passo) {
          gFondo.appendChild(el('line', { x1: 0, y1: Y(y), x2: S.gx - 8, y2: Y(y), stroke: 'var(--testo2)', 'stroke-width': 1, 'stroke-dasharray': '2 6', opacity: .45 }));
          gFondo.appendChild(el('text', { x: 4, y: Y(y) - 3, fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, y + '\u00a0m'));
        }
        segni(L);
      }
      function segni(L) {   /* gli obiettivi del livello, disegnati sull'acqua */
        const s = L.scopo, xa = S.cx + (LR / 2 + R + 0.4) * S.U, testo = (x, y, t, col) => gFondo.appendChild(el('text', { x, y, fill: col || 'var(--no)', style: 'font: 600 12px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, t));
        if (s.tipo === 'sospeso') {
          gFondo.appendChild(el('line', { x1: 30, y1: Y(L.inizio.z), x2: S.gx - 8, y2: Y(L.inizio.z), stroke: 'var(--no)', 'stroke-width': 1.5, 'stroke-dasharray': '3 5', opacity: .8 }));
          gFondo.appendChild(el('text', { x: S.gx - 12, y: Y(L.inizio.z) - 6, 'text-anchor': 'end', fill: 'var(--no)', style: 'font: 600 12px var(--font)' }, 'qui, a ' + L.inizio.z + '\u00a0m'));
        } else if (s.tipo === 'fondo') testo(S.cx - 10, Y(L.fondo) + 16, 'qui, a ' + L.fondo + '\u00a0m');
        else if (s.tipo === 'strato' || s.tipo === 'meta') testo(xa, Y(strati(L)[s.i].da) - 6, 'acqua salata ↓');
      }
      /* la tacca dell'80%: l'altezza del pelo dell'acqua, sullo scafo, per cui la parte sotto è la frazione f del volume */
      function tacca(f) { let a = -R - TH, bb = R; for (let k = 0; k < 50; k++) { const c = (a + bb) / 2; if (sotto(c, 0) / A_TOT > f) a = c; else bb = c; } return (a + bb) / 2; }

      /* il sottomarino: scafo giallo, la torretta, e dentro le casse (acqua azzurra, aria chiara) */
      function disegnaSub(zz, lt) {
        vuota(gSub);
        const L = liv(), cy = Y(zz), cx = S.cx, U = S.U, x0 = cx - LR / 2 * U, x1 = cx + LR / 2 * U, r = R * U;
        const dScafo = `M${x0} ${cy - r} H${x1} A${r} ${r} 0 0 1 ${x1} ${cy + r} H${x0} A${r} ${r} 0 0 1 ${x0} ${cy - r} Z`;
        const tx = cx + 0.4 * U - TW / 2 * U;
        gSub.appendChild(el('rect', { x: tx, y: cy - r - TH * U, width: TW * U, height: TH * U + 2, rx: 3, fill: '#d9a21b', stroke: '#5a4208', 'stroke-width': 1.5 }));
        gSub.appendChild(el('path', { d: dScafo, fill: '#e5b02a', stroke: '#5a4208', 'stroke-width': 1.8 }));
        /* le casse dentro lo scafo */
        const ky0 = cy + 0.05 * U, kh = (R - 0.25) * U, kx0 = x0 + 0.15 * U, kw = (LR - 0.3) * U, fr = lt / CAP;
        gSub.appendChild(el('rect', { x: kx0, y: ky0, width: kw, height: kh, rx: 3, fill: '#f4f8fb', stroke: '#5a4208', 'stroke-width': 1 }));
        if (fr > 0) gSub.appendChild(el('rect', { x: kx0, y: ky0 + kh * (1 - fr), width: kw, height: kh * fr, rx: 2, fill: '#2a78d6', opacity: .85 }));
        for (let k = 0; k < 3; k++) gSub.appendChild(el('circle', { cx: cx - 1.4 * U + k * 1.2 * U, cy: cy - 0.55 * U, r: Math.max(2.5, 0.22 * U), fill: '#cfe6f7', stroke: '#5a4208', 'stroke-width': 1.2 }));
        /* la parte sott'acqua dello scafo si vede attraverso l'acqua */
        const clip = el('clipPath', { id: 'sm-scafo' });
        clip.appendChild(el('path', { d: dScafo })); clip.appendChild(el('rect', { x: tx, y: cy - r - TH * U, width: TW * U, height: TH * U + 2 }));
        gSub.appendChild(clip);
        const yAcqua = Math.max(Y(0), cy - r - TH * U - 2);
        if (yAcqua < cy + r) gSub.appendChild(el('rect', { x: x0 - r, y: yAcqua, width: (LR + 2 * R) * U, height: cy + r - yAcqua + 2, fill: '#2a78d6', opacity: .16, 'clip-path': 'url(#sm-scafo)' }));
        const c = carico(L);
        if (c) {
          const yc = Y(quotaCarico(zz)), lw = 0.9 * U;
          gSub.appendChild(el('line', { x1: cx, y1: cy + r, x2: cx, y2: yc, stroke: 'var(--testo)', 'stroke-width': 1.5 }));
          gSub.appendChild(el('rect', { x: cx - lw / 2, y: yc, width: lw, height: 0.4 * U, rx: 2, fill: 'var(--testo2)', stroke: 'var(--testo)', 'stroke-width': 1 }));
        }
        if (L.scopo.tipo === 'frazione') {
          const yt = cy + tacca(L.scopo.f) * U;
          [x0 - r * 0.6, x1 + r * 0.6].forEach(xx => gSub.appendChild(el('line', { x1: xx - 7, y1: yt, x2: xx + 7, y2: yt, stroke: 'var(--no)', 'stroke-width': 3, 'stroke-linecap': 'round' })));
        }
        /* il manometro: la pressione dove sta il sottomarino, viola */
        const p = pressione(L, zz);
        /* sotto lo scafo (o sotto l'ancora), a sinistra della freccia del peso */
        const yp = Math.min(S.h - 5, cy + r + (c ? 1.1 * U : 0) + 16);
        gSub.appendChild(el('text', { x: cx + 0.35 * U, y: yp, 'text-anchor': 'end', fill: 'var(--s4)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, 'p ' + num(p / 1000, 0) + '\u00a0kPa'));
      }

      /* il serbatoio delle casse, a destra: si trascina per riempirlo (fino a 4000 L) */
      function disegnaCasse() {
        vuota(gCasse);
        const x = S.gx, w = 34, y0 = S.gy0, y1 = S.gy1, fr = litri / CAP;
        gCasse.appendChild(el('rect', { x: x - 6, y: y0 - 22, width: w + 12, height: y1 - y0 + 44, rx: 8, fill: 'var(--sup)', stroke: 'var(--bordo)', opacity: .92 }));
        gCasse.appendChild(el('text', { x: x + w / 2, y: y0 - 7, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 600 12px var(--font)' }, 'casse'));
        gCasse.appendChild(el('rect', { class: 'serbatoio', x, y: y0, width: w, height: y1 - y0, rx: 4, fill: 'var(--sup2)', stroke: 'var(--testo2)', 'stroke-width': 1.2 }));
        if (fr > 0) gCasse.appendChild(el('rect', { x, y: y1 - (y1 - y0) * fr, width: w, height: (y1 - y0) * fr, rx: 3, fill: '#2a78d6', opacity: .85 }));
        for (let k = 1; k < 4; k++) { const y = y1 - (y1 - y0) * k / 4; gCasse.appendChild(el('line', { x1: x, y1: y, x2: x + 8, y2: y, stroke: 'var(--testo)', 'stroke-width': 1, opacity: .6 })); }
        gCasse.appendChild(el('text', { x: x + w / 2, y: y1 + 16, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 700 12px var(--font)' }, litri + ' L'));
      }

      /* peso e spinta, tutte e due arancio (sono forze): lunghezze in scala, valori in kN */
      function disegnaForze(zz, lt) {
        vuota(gForze);
        const L = liv(), P = massa(L, lt) * G, FA = spinta(L, zz), cy = Y(zz), k = morsa(2.4 * R * S.U, 44, 80) / 120000;
        const xs = S.cx - 0.7 * S.U, xd = S.cx + 0.7 * S.U;
        freccia(gForze, xd, cy, xd, cy + P * k, 'var(--s2)', 3);
        freccia(gForze, xs, cy, xs, cy - FA * k, 'var(--s2)', 3);
        etichetta(xd + 4, cy + P * k + 4, 'P', '', num(P / 1000, 1) + ' kN');
        etichetta(xs - 4, cy - FA * k + 2, 'F', 'A', num(FA / 1000, 1) + ' kN', 'end');
      }
      function etichetta(x, y, base, pedice, valore, ancora) {
        const t = el('text', { x, y, 'text-anchor': ancora || 'start', fill: 'var(--s2)', style: 'font: 700 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
        t.appendChild(document.createTextNode(base));
        if (pedice) t.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 10px' }, pedice));
        t.appendChild(el('tspan', {}, ' ' + valore));
        gForze.appendChild(t);
      }
      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1); if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(10, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaSub(z, litri); disegnaCasse(); if (ultimo && !animando) disegnaForze(z, ultimo.litri); else vuota(gForze); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        box.litri.querySelector('output').textContent = litri + ' L';
        box.d.querySelector('output').textContent = pl.d;
        box.d2.querySelector('output').textContent = pl.d2;
        box.d.hidden = box.d2.hidden = !libero;
        const lim = { litri: [0, CAP], d: [800, 1200], d2: [pl.d, 1200] }, val = { litri, d: pl.d, d2: pl.d2 };
        Object.keys(box).forEach(k => box[k].querySelectorAll('button').forEach(bt => {
          const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? val[k] <= lim[k][0] : val[k] >= lim[k][1]);
        }));
      }
      /* il ponte con la teoria: densità media = massa totale / volume; il risultato dopo il tentativo */
      function aggiornaFormula() {
        const L = liv(), fatto = libero || (ultimo && ultimo.litri === litri);
        const mc = massaCasse(L, litri), c = carico(L), dm = massa(L, litri) / volume(L);
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        const ris = s => fatto ? '<span class="pezzo esito">' + ctx.tex(s) + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>';
        const pezzi = [];
        if (L.formula === 'galleggia') pezzi.push('<span class="pezzo simbolo">' + ctx.tex('\\dfrac{V_i}{V} = \\dfrac{d_c}{d_l}') + '</span>');
        else pezzi.push('<span class="pezzo simbolo">' + ctx.tex('d_c = \\dfrac{m_\\text{scafo} + m_\\text{casse}' + (c ? ' + m_\\text{ancora}' : '') + '}{V}') + '</span>');
        pezzi.push(numerico('d_c = \\dfrac{' + M_SCAFO + ' + ' + texK(mc) + (c ? ' + ' + c.m : '') + '}{' + texK(volume(L)) + '}\\,\\text{kg/m}^3'));
        pezzi.push(ris('\\approx ' + texNum(dm, 1) + '\\,\\text{kg/m}^3'));
        if (L.formula === 'pressione') pezzi.push('<span class="pezzo viola">' + ctx.tex('p = p_0 + d \\cdot g \\cdot h') + '</span>');
        formulaEl.innerHTML = pezzi.join('');
      }
      function aggiornaLivelli() {
        const fatti = ctx.stato().livelli, sblocco = fatti.length ? Math.max.apply(null, fatti) + 1 : 0;
        Array.prototype.forEach.call(livelliEl.querySelectorAll('.lab-pallino'), (p, k) => {
          p.classList.toggle('fatto', fatti.indexOf(k) >= 0);
          p.classList.toggle('attivo', !libero && k === livello);
          p.disabled = animando || (k > sblocco && k !== livello);
          p.setAttribute('aria-current', !libero && k === livello ? 'step' : 'false');
        });
        b.libero.setAttribute('aria-pressed', libero); b.libero.disabled = animando;
      }
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'tentativi: ' + tentativi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaSub(z, litri); disegnaCasse(); }

      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false; libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        litri = L.inizio.litri; z = inizioZ(L);
        tentativi = 0; finito = false; ultimo = null; detti = {}; ombre = [];
        orologio.textContent = ''; aiutoEl.hidden = true; vuota(gOmbre);
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>'; msg.textContent = ''; msg.className = 'lab-messaggio';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function mostraLibero() { b.casuale.hidden = !libero; radice.classList.toggle('in-libero', libero); }

      /* ---------------- il tentativo: si parte da fermi e si guarda il moto vero ---------------- */
      function via() {
        if (animando || finito) return;
        const L = liv(), z0 = libero ? z : inizioZ(L);
        const f = simula(L, litri, z0, L.scopo.tipo === 'sospeso' ? 6 : 2);
        aiutoEl.hidden = true;
        if (!libero) tentativi++;
        aggiornaConta(); msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.via.disabled = b.ric.disabled = b.casuale.disabled = true; aggiornaParametri(); aggiornaLivelli();
        const lt = litri, zPrima = z, ritorno = Math.abs(zPrima - z0) > 0.05 ? 350 : 0;
        /* tempo vero; i moti lunghi scorrono più in fretta, e l'orologio lo dice */
        const fattore = Math.max(1, f.t / 5), t0 = performance.now();
        const passo = ora => {
          const ms = Math.max(0, ora - t0);
          if (ms < ritorno) { const k = ms / ritorno; z = zPrima + (z0 - zPrima) * k * (2 - k); disegnaSub(z, lt); raf = requestAnimationFrame(passo); return; }
          const t = Math.min(f.t, (ms - ritorno) / 1000 * fattore), i = t / 0.1, i0 = Math.floor(i), a = f.pts[Math.min(i0, f.pts.length - 1)], bb = f.pts[Math.min(i0 + 1, f.pts.length - 1)];
          z = t >= f.t ? f.z : a + (bb - a) * (i - i0);
          disegnaSub(z, lt); disegnaForze(z, lt);
          orologio.textContent = 't = ' + num(t, 0) + '\u00a0s' + (fattore > 1.05 ? '   (×' + num(fattore, 0) + ')' : '');
          if (t < f.t) { raf = requestAnimationFrame(passo); return; }
          raf = 0; fine(f, lt);
        };
        raf = requestAnimationFrame(passo);
      }
      function fine(f, lt) {
        animando = false; b.via.disabled = b.ric.disabled = b.casuale.disabled = false;
        const L = liv(), prec = ultimo;
        ultimo = { litri: lt, f }; z = f.z;
        aggiorna(); aggiornaLivelli(); disegnaForze(z, lt);
        if (libero) { msg.textContent = osserva(L, f); msg.className = 'lab-messaggio'; return; }
        const v = verdetto(L, f);
        if (v.ok) { vinci(v.testo); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, f, prec);
      }
      function vinci(testo) {
        finito = true; b.via.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (tentativi === 1 ? ' Al primo tentativo.' : ' Tentativi: ' + tentativi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        const frase = VITTORIE[livello]; if (frase) ctx.zenone(frase, { espressione: tentativi === 1 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }
      function dici(chiave, testo) { if (detti[chiave]) return; detti[chiave] = true; ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 }); }
      /* le idee sbagliate che i video smontano: Stilla ne parla una volta sola per livello */
      function erroreTipico(L, f, prec) {
        const s = L.scopo, lt = ultimo.litri;
        if (s.tipo === 'fondo' && f.tipo !== 'fondo') { dici('pesante', 'Pesante non basta: va giù solo se pesa più dell\'acqua che sposta, cioè se è più denso dell\'acqua.'); return; }
        if (s.tipo === 'frazione' && f.tipo === 'galla') { dici('frazione', 'La parte sott\'acqua è la densità media divisa quella dell\'acqua: quale densità media ti serve?'); return; }
        if (s.tipo === 'sospeso') {
          if (livello === 3 && lt === 2800) { dici('mare', 'Nel lago bastavano 2800\u00a0L, ma l\'acqua salata è più densa: stesso volume, spinta più grande.'); return; }
          if (L.carico && lt === 2240) { dici('ancora-v', 'Anche l\'ancora sposta acqua: 100\u00a0L, che spingono in su come quelli dello scafo.'); return; }
          if (L.carico && lt === 3000) { dici('ancora-m', 'L\'ancora pesa 779\u00a0kg: va contata nella massa, ma riceve anche lei la spinta.'); return; }
          if (prec && prec.litri !== lt && Math.abs(lt - prec.litri) <= 20 && f.tipo === prec.f.tipo) { dici('quasi', 'Bastano 10\u00a0L in più o in meno per farlo salire o scendere: sospeso vuol dire densità media uguale, non quasi uguale.'); return; }
          dici('sospeso', 'Resta fermo a mezz\'acqua solo se la massa totale è uguale alla massa dell\'acqua spostata: m = d·V.');
          return;
        }
        if ((s.tipo === 'strato' || s.tipo === 'meta' || s.tipo === 'pressione') && f.tipo === 'fondo') { dici('fondo', 'Più denso anche dell\'acqua più in basso: nessuno strato lo regge, e va fino al fondo.'); return; }
        if ((s.tipo === 'strato' || s.tipo === 'meta' || s.tipo === 'pressione') && f.tipo === 'galla') { dici('galla', 'Meno denso dell\'acqua dolce in alto: resta a galla, e agli strati sotto non arriva.'); return; }
        if (s.tipo === 'pressione' && f.tipo === 'strato' && f.strato === 1) { dici('stevino', 'Qui il manometro segna ' + num(f.p / 1000, 0) + '\u00a0kPa: con p = p₀ + d·g·h, quanto devi scendere ancora per arrivare a 240\u00a0kPa?'); return; }
        if (s.tipo === 'meta' && f.tipo === 'strato') dici('meta', 'Più è denso, più scafo entra nell\'acqua salata: la spinta dei due strati insieme deve pareggiare il peso.');
      }
      /* modalità libera: solo osservazioni neutre */
      function osserva(L, f) {
        const s = strati(L), dm = f.dm, testi = [descrivi(L, f), 'Densità media ' + num(dm, 1) + ' kg/m³'];
        if (f.tipo === 'galla') testi[1] += ', meno di ' + s[0].d + ': ne resta sotto ' + num(dm / s[0].d * 100, 0) + '%, il rapporto fra le due densità.';
        else if (f.tipo === 'fondo') testi[1] += ', più dell\'acqua più in basso.';
        else if (f.tipo === 'strato') testi[1] += ', fra ' + s[f.strato - 1].d + ' e ' + s[f.strato].d + '.';
        else testi[1] += ', uguale a quella dell\'acqua intorno.';
        return testi.join(' ');
      }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, litri, z, tentativi, finito, ultimo, detti: Object.assign({}, detti), cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        Llib = LIBERO(); litri = 0; z = galla(Llib, 0); ultimo = null; finito = false;
        consegnaEl.textContent = ''; msg.textContent = ''; msg.className = 'lab-messaggio'; orologio.textContent = '';
        b.via.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {
        if (animando) return;
        const k = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = k.livello; litri = k.litri; z = k.z; tentativi = k.tentativi; finito = k.finito; ultimo = k.ultimo; detti = k.detti;
        consegnaEl.innerHTML = k.cons; b.ric.textContent = k.ric; b.via.disabled = finito; orologio.textContent = '';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = k.msg; msg.className = k.cls;
      }
      function casuale() {
        if (animando) return;
        const scegli = a => a[Math.floor(Math.random() * a.length)];
        pl.d = scegli([1000, 1000, 1025, 1030]); pl.d2 = scegli([pl.d, pl.d + 15, pl.d + 30]);
        Llib = LIBERO(); litri = 10 * Math.round((2400 + Math.random() * 1200) / 10);
        z = galla(Llib, 0); ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna();
      }
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });

      /* ---------------- comandi ---------------- */
      function cambia(k, d, molt) {
        if (animando) return false;
        if (k === 'litri') {
          const nuovo = morsa(litri + d * PASSO * (molt || 1), 0, CAP); if (nuovo === litri) return false; litri = nuovo;
        } else {
          const lim = k === 'd' ? [800, 1200] : [pl.d, 1200], nuovo = morsa(pl[k] + d * 5, lim[0], lim[1]); if (nuovo === pl[k]) return false;
          pl[k] = nuovo; if (pl.d2 < pl.d) pl.d2 = pl.d; Llib = LIBERO(); z = Math.min(z, zMax(Llib));
        }
        if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (libero && k !== 'litri') ridisegnaTutto();
        aggiorna(); return true;
      }
      /* − e +: un passo al tocco; tenendo premuto si va da soli, sempre più in fretta (10, poi 50, poi 100 L) */
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d)) return;
        let attesa = 380, giri = 0;
        const giro = () => { giri++; const m = k === 'litri' ? (giri > 30 ? 10 : giri > 10 ? 5 : 1) : 1; if (cambia(k, d, m)) { attesa = Math.max(45, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });
      /* trascinare: sul serbatoio si riempiono le casse; in modalità libera, sul sottomarino lo si sposta in su e in giù */
      let presa = null;
      function punto(ev) { const m = svg.getScreenCTM(); if (!m) return null; const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(m.inverse()); }
      function muoviPresa(c) {
        if (presa === 'casse') {
          const nuovo = morsa(Math.round((S.gy1 - c.y) / (S.gy1 - S.gy0) * CAP / PASSO) * PASSO, 0, CAP);
          if (nuovo !== litri) { litri = nuovo; if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; } aggiorna(); }
        } else if (presa === 'sub') {
          z = morsa((c.y - S.oy) / S.U, -R - TH + 0.3, zMax(Llib)); ultimo = null; vuota(gForze); msg.textContent = ''; aggiorna();
        }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando) return;
        const c = punto(ev); if (!c) return;
        if (c.x >= S.gx - 14 && c.y >= S.gy0 - 24 && c.y <= S.gy1 + 24 && !finito) presa = 'casse';
        else if (libero && Math.abs(c.x - S.cx) < (LR / 2 + R) * S.U && Math.abs(c.y - Y(z)) < (R + 0.6) * S.U) presa = 'sub';
        else return;
        aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        muoviPresa(c); ev.preventDefault();
      });
      const muovi = ev => { if (!presa) return; const c = punto(ev); if (c) muoviPresa(c); ev.preventDefault(); };
      const molla = () => { presa = null; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.via.addEventListener('click', via);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { z = galla(Llib, 0); ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').innerHTML = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');   /* innerHTML: i pedici veri con <sub> */
        aiutoEl.hidden = false;
      });
      aiutoEl.querySelector('.m-chiudi').addEventListener('click', () => { aiutoEl.hidden = true; });
      LIVELLI.forEach((_, k) => {
        const p = document.createElement('button'); p.type = 'button'; p.className = 'lab-pallino';
        p.setAttribute('aria-label', 'Livello ' + (k + 1)); p.innerHTML = '<span>' + (k + 1) + '</span>';
        p.addEventListener('click', () => { if (!animando) avviaLivello(k); });
        livelliEl.insertBefore(p, b.libero);
      });

      avviaLivello(livello);
      let forma = '';
      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg].filter(Boolean);
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      const ro = new ResizeObserver(() => {
        fissi.forEach(stringi);
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; ridisegnaTutto();
      });
      ro.observe(svg);

      return function smonta() {
        cancelAnimationFrame(raf); fermaRipeti(); ro.disconnect(); mo.disconnect();
        window.removeEventListener('pointermove', muovi);
        window.removeEventListener('pointerup', molla);
        window.removeEventListener('pointercancel', molla);
      };
    }
  });
})();
