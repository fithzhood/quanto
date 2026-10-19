/* Laboratorio «Il satellite» — il cannone di Newton (argomento gravitazione).
   Dalla cima di una montagna (altissima, esagerata come nell'esperimento immaginario di Newton) si spara in orizzontale,
   senza aria. La traiettoria è integrata davvero con la gravità che punta al centro del pianeta, a = −G·M·r/|r|³,
   con Verlet di velocità (simplettico) e passo piccolo e costante: le orbite chiuse si richiudono, non si allargano da sole.
   G·M = g·R² (Terra: g = 9,8 m/s², R = 6370 km, come nei video). Unità interne: km, s, km/s.
   Modello: laboratori/cannone.js (contratto in SCHEMA-LAB.md). */
(function () {
  const STILE = `
    .lab-satellite .lab-scena { background: var(--sup2); overflow: hidden; touch-action: none; cursor: crosshair; }
    .lab-satellite .lab-scena > svg { width: 100%; height: 100%; display: block; }
    .lab-satellite svg text { font-family: var(--font); }
    .lab-satellite svg text, .lab-satellite svg tspan { font-variant-numeric: tabular-nums !important; }   /* le cifre nella scena non ballano mentre un numero scorre (lo stile «font:» in linea le rimetterebbe proporzionali) */
    .lab-satellite .consegna { text-align: center; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); line-height: 1.4; color: var(--testo); height: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; display: flex; align-items: center; justify-content: center; }
    .lab-satellite .consegna > span { display: block; }
    .lab-satellite .consegna b { color: var(--accento-testo); font-weight: 600; }
    .lab-satellite .consegna:empty { display: none; }
    .lab-satellite .formula { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; gap: 2px .45em; font-size: clamp(1.1rem, 2.4cqmin, 1.2rem); line-height: 1.2; height: calc(4.4 * clamp(1.1rem, 2.4cqmin, 1.2rem)); flex: none; }
    .lab-satellite .formula .pezzo { display: inline-block; white-space: nowrap; }
    .lab-satellite .formula .ignoto { color: var(--testo3); }
    .lab-satellite .formula .esito { color: var(--s3); font-weight: 600; }
    .lab-satellite .lab-messaggio { padding: 0 4px; height: calc(2.9 * clamp(.9rem, 2.1cqmin, 1.05rem)); flex: none; font-size: clamp(.9rem, 2.1cqmin, 1.05rem); text-align: center; line-height: 1.45; }
    @container lab (min-aspect-ratio: 5 / 4) and (min-height: 560px) { .lab-satellite .formula { height: calc(6.4 * clamp(1.1rem, 2.4cqmin, 1.2rem)); } .lab-satellite .lab-messaggio { height: calc(4.35 * clamp(.9rem, 2.1cqmin, 1.05rem)); } }   /* nel pannello di lato c'è posto: la formula intera (anche la forma simbolica) e il messaggio su tre righe */
    .lab-satellite .lab-barra { padding: 0; border: 0; gap: 8px; justify-content: center; }
    .lab-satellite .lab-barra .btn { min-height: clamp(40px, 6cqh, 50px); }
    .lab-satellite .btn[disabled] { opacity: .38; cursor: default; }
    .lab-satellite .lab-parametri { max-width: 520px; }
    .lab-satellite .lab-parametri .b-casuale { justify-self: center; }
    .lab-satellite .lab-parametri .b-casuale[hidden] { display: none; }
    .lab-satellite .lab-param .nome { min-width: 1.6em; }
    .lab-satellite .lab-param output { min-width: 0; width: 8.6ch; flex: none; white-space: nowrap; }
    .lab-satellite .lab-param[data-p="h"] output { width: 7ch; }
    .lab-satellite .lab-param[data-p="corpo"] output { width: 5.6ch; }
    .lab-satellite .lab-param[hidden] { display: none; }
    /* nel Libero: due per riga (non quattro) sul tablet verticale; nel pannello stretto, di lato o sotto, v₀ e h su una riga ciascuno */
    .lab-satellite .lab-lato { container: lato / inline-size; }
    .lab-satellite.in-libero .lab-parametri { grid-template-columns: 1fr 1fr; }
    @container lato (max-width: 520px) { .lab-satellite.in-libero .lab-parametri { grid-template-columns: 1fr auto; gap: 4px 10px; } .lab-satellite.in-libero [data-p="v"], .lab-satellite.in-libero [data-p="h"] { grid-column: 1 / -1; } }
    .lab-satellite .conta { position: absolute; right: 10px; top: 8px; margin: 0; font-size: .8rem; white-space: nowrap; pointer-events: none; }
    .lab-satellite .vinto { display: inline-block; animation: lab-satellite-pop .45s cubic-bezier(.34,1.56,.64,1); }
    @keyframes lab-satellite-pop { from { transform: scale(.75); opacity: 0 } to { transform: none; opacity: 1 } }
    .lab-satellite .formula .nome-stretto { display: none; }
    @container lab (max-width: 420px) { .lab-satellite .formula .simbolo { display: none; } .lab-satellite .formula .nome-stretto { display: inline; } }
    /* il pannello ha la stessa altezza in ogni livello e nel Libero: righe dei parametri a passo fisso, e consegna + parametri
       riservano lo spazio del caso più alto (1 riga di parametri sotto la consegna nei livelli, 3 nel Libero, dove la consegna non c'è) */
    .lab-satellite .lab-lato { --riga: max(38px, 2rem); --cons: calc(4.2 * clamp(.9rem, 2.1cqmin, 1.05rem)); --pl: calc(1 * var(--riga) + 0 * 6px); --pf: calc(3 * var(--riga) + 2 * 6px); --blocco: max(calc(var(--cons) + 6px + var(--pl)), var(--pf)); }
    .lab-satellite .lab-lato .lab-parametri { row-gap: 6px; grid-auto-rows: minmax(var(--riga), auto); align-content: center; min-height: calc(var(--blocco) - var(--cons) - 6px); }
    .lab-satellite .lab-lato .consegna:empty { display: none; }
    .lab-satellite .lab-lato .consegna:empty + .lab-parametri { min-height: var(--blocco); }
    .lab-satellite .lab-barra { min-height: max(clamp(40px, 6cqh, 50px), 2.45rem); }
  `;

  /* un testo che cambia sta nello spazio riservato: se non ci sta, si rimpicciolisce invece di spingere il resto */
  function stringi(el) {
    el.style.fontSize = '';
    if (!el.clientHeight) return;
    let f = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && n++ < 14) { f *= 0.93; el.style.fontSize = f + 'px'; }
  }

  /* ---------------- fisica (pura: la usa anche la prova dei livelli in node) ---------------- */
  /* g in m/s², R in km; G·M = g·R² in km³/s² (g/1000 per passare a km/s²) */
  const CORPI = {
    terra: { nome: 'Terra', R: 6370, g: 9.8, vmax: 12, dv: 0.05, hmax: 3000, dh: 50, colore: '#3f86c6' },
    marte: { nome: 'Marte', R: 3390, g: 3.71, vmax: 7, dv: 0.02, hmax: 1500, dh: 50, colore: '#c0643a' },
    luna: { nome: 'Luna', R: 1737, g: 1.62, vmax: 3, dv: 0.01, hmax: 800, dh: 25, colore: '#8c8c8c' }
  };
  const ORDINE_CORPI = ['terra', 'marte', 'luna'];
  const GMdi = c => c.g / 1000 * c.R * c.R;

  /* il volo: Verlet di velocità con passo costante, da (0, R + h) con velocità (v, 0): la palla parte verso destra */
  function simula(p) {
    const C = CORPI[p.corpo || 'terra'], GM = GMdi(C), R = C.R, r0 = R + p.h, v0 = p.v;
    const Tc = 2 * Math.PI * Math.sqrt(r0 * r0 * r0 / GM);   /* periodo dell'orbita circolare a quella quota */
    const dt = Tc / 6000;                                    /* passo piccolo e costante */
    const rStop = 8 * R, MAXPASSI = 600000, OGNI = 8;        /* un punto salvato ogni 8 passi: 750 per giro */
    let x = 0, y = r0, vx = v0, vy = 0, t = 0;
    let r = r0, ax = 0, ay = -GM / (r0 * r0);
    let ang = 0, angPrec = 0, rMin = r0, rMax = r0;
    const punti = [[0, r0, 0]];
    const fine = { tipo: 'esce' };
    for (let k = 1; k <= MAXPASSI; k++) {
      const xp = x, yp = y, rp = r, tp = t, angP = ang;
      x += vx * dt + 0.5 * ax * dt * dt;
      y += vy * dt + 0.5 * ay * dt * dt;
      r = Math.sqrt(x * x + y * y);
      const k3 = -GM / (r * r * r), nax = k3 * x, nay = k3 * y;
      vx += 0.5 * (ax + nax) * dt; vy += 0.5 * (ay + nay) * dt;
      ax = nax; ay = nay; t += dt;
      /* angolo spazzato, in senso orario a partire dalla cima (svolto: può superare 2π) */
      const a = Math.atan2(x, y);
      let d = a - angPrec; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      ang += d; angPrec = a;
      if (r < R) {   /* a terra: interpolo fra i due passi */
        const f = (rp - R) / (rp - r);
        const xi = xp + (x - xp) * f, yi = yp + (y - yp) * f;
        fine.tipo = 'terra'; fine.t = tp + dt * f; fine.ang = angP + (ang - angP) * f;
        punti.push([xi, yi, fine.t]);
        rMin = R; break;
      }
      if (r < rMin) rMin = r; if (r > rMax) rMax = r;
      if (ang >= 2 * Math.PI) {   /* giro completo: è tornata sopra la montagna */
        const f = (2 * Math.PI - angP) / (ang - angP);
        fine.tipo = 'giro'; fine.t = tp + dt * f; fine.ang = 2 * Math.PI;
        punti.push([0, yp + (y - yp) * f, fine.t]);   /* sulla verticale della montagna */
        break;
      }
      if (r > rStop) { fine.tipo = 'esce'; fine.t = t; fine.ang = ang; punti.push([x, y, t]); break; }
      if (k % OGNI === 0) punti.push([x, y, t]);
      if (k === MAXPASSI) { fine.t = t; fine.ang = ang; punti.push([x, y, t]); }
    }
    fine.punti = punti; fine.rMin = rMin; fine.rMax = rMax; fine.r0 = r0; fine.R = R; fine.GM = GM;
    fine.E = 0.5 * v0 * v0 - GM / r0;                         /* energia per unità di massa, km²/s² = MJ/kg */
    fine.vc = Math.sqrt(GM / r0); fine.vf = Math.sqrt(2 * GM / r0);
    fine.arco = fine.tipo === 'terra' ? R * fine.ang : null;  /* distanza sul suolo dal piede della montagna */
    const ult = punti[punti.length - 1]; fine.x = ult[0]; fine.y = ult[1];
    return fine;
  }

  /* ---------------- livelli ---------------- */
  const LIVELLI = [
    { consegna: 'Montagna alta <b>300\u00a0km</b>. Fai cadere la palla sul villaggio, a <b>2000\u00a0km</b> dal piede della montagna.',
      corpo: 'terra', h: 300, inizio: 5, vista: 'vicino', ob: { tipo: 'villaggio', arco: 2000, tol: 150 }, formula: 'centripeta' },
    { consegna: 'Mettila in <b>orbita</b>: deve fare il giro della Terra e tornare sopra la montagna senza toccare terra.',
      corpo: 'terra', h: 300, inizio: 6, vista: 'intero', ob: { tipo: 'orbita' }, formula: 'centripeta' },
    { consegna: 'Orbita <b>circolare</b>: la palla deve restare dentro la corona verde, a <b>300 ± 150\u00a0km</b> di quota.',
      corpo: 'terra', h: 300, inizio: 7, vista: 'intero', ob: { tipo: 'cerchio', tol: 150 }, formula: 'centripeta' },
    { consegna: 'Montagna alta <b>2000\u00a0km</b>. Ancora un\'orbita circolare: dentro la corona, <b>2000 ± 250\u00a0km</b>.',
      corpo: 'terra', h: 2000, inizio: 7.7, vista: 'intero', ob: { tipo: 'cerchio', tol: 250 }, formula: 'centripeta' },
    { consegna: 'Dalla montagna di <b>300\u00a0km</b> raggiungi la stazione: il punto più lontano dell\'orbita a <b>10 000 ± 700\u00a0km</b> di quota.',
      corpo: 'terra', h: 300, inizio: 8, vista: 'stazione', ob: { tipo: 'apogeo', quota: 10000, tol: 700 }, formula: 'energia' },
    { consegna: 'Mandala via <b>per sempre</b>, con la velocità più bassa possibile (al massimo <b>0,2\u00a0km/s</b> più del necessario).',
      corpo: 'terra', h: 300, inizio: 9, vista: 'largo', ob: { tipo: 'fuga', margine: 0.2 }, formula: 'energia' },
    { consegna: 'Sulla <b>Luna</b>, da una montagna di <b>100\u00a0km</b>: orbita circolare, a <b>100 ± 50\u00a0km</b> di quota.',
      corpo: 'luna', h: 100, inizio: 1, vista: 'intero', ob: { tipo: 'cerchio', tol: 50 }, formula: 'centripeta' },
    { consegna: 'Montagna di <b>2000\u00a0km</b>. Senza toccare terra, la palla deve passare dall\'altra parte della Terra a <b>1000 ± 150\u00a0km</b> di quota.',
      corpo: 'terra', h: 2000, inizio: 7.2, vista: 'intero', ob: { tipo: 'perigeo', quota: 1000, tol: 150 }, formula: 'centripeta' }
  ];
  const LIBERO = { consegna: '', vista: 'auto', formula: 'libero' };

  /* il verdetto di un colpo: { ok, testo } (dice che cosa è successo, non come rimediare) */
  function verdetto(L, f, p) {
    const o = L.ob, C = CORPI[L.corpo || 'terra'];
    const caduta = () => f.arco < 5 ? 'Caduta ai piedi della montagna.' : 'Caduta a ' + km(f.arco) + ' dalla montagna.';
    const via = () => f.E >= 0 ? 'Se n\'è andata per sempre: non torna più.' : 'È uscita dalla vista: è ancora legata, ma va lontanissima.';
    if (o.tipo === 'villaggio') {
      if (f.tipo !== 'terra') return { ok: false, testo: f.tipo === 'giro' ? 'Non è caduta: ha fatto il giro della Terra.' : via() };
      const d = f.arco - o.arco;
      if (Math.abs(d) <= o.tol) return { ok: true, testo: 'Sul villaggio: a ' + km(f.arco) + '.' };
      return { ok: false, testo: (d > 0 ? 'Lunga di ' : 'Corta di ') + km(Math.abs(d)) + ': caduta a ' + km(f.arco) + '.' };
    }
    if (o.tipo === 'orbita') {
      if (f.tipo === 'giro') return { ok: true, testo: 'Giro completo in ' + durata(f.t) + ', senza toccare terra.' };
      return { ok: false, testo: f.tipo === 'terra' ? caduta() : via() };
    }
    if (o.tipo === 'cerchio') {
      if (f.tipo !== 'giro') return { ok: false, testo: f.tipo === 'terra' ? caduta() : via() };
      const qMin = f.rMin - C.R, qMax = f.rMax - C.R;
      const ok = f.rMax - f.r0 <= o.tol && f.r0 - f.rMin <= o.tol;
      return { ok, testo: (ok ? 'Quasi un cerchio: quota fra ' : 'Un\'ellisse: quota da ') + km(qMin) + (ok ? ' e ' : ' a ') + km(qMax) + (ok ? '.' : ', fuori dalla corona.') };
    }
    if (o.tipo === 'apogeo') {
      if (f.tipo !== 'giro') return { ok: false, testo: f.tipo === 'terra' ? caduta() : via() };
      const q = f.rMax - C.R, d = q - o.quota;
      if (Math.abs(d) <= o.tol) return { ok: true, testo: 'Punto più lontano a ' + km(q) + ' di quota.' };
      return { ok: false, testo: 'Punto più lontano a ' + km(q) + ' di quota: ' + (d > 0 ? 'oltre' : 'sotto') + ' la stazione di ' + km(Math.abs(d)) + '.' };
    }
    if (o.tipo === 'fuga') {
      if (f.E >= 0) {
        if (p.v <= f.vf + o.margine + 1e-9) return { ok: true, testo: 'Partita per sempre, a ' + num(p.v, 2) + '\u00a0km/s.' };
        return { ok: false, testo: 'Partita per sempre, ma più veloce del necessario.' };
      }
      return { ok: false, testo: f.tipo === 'terra' ? caduta() : f.tipo === 'giro' ? 'È tornata sopra la montagna: orbita chiusa, in ' + durata(f.t) + '.' : 'Uscita dalla vista, ma l\'energia è negativa: prima o poi torna.' };
    }
    if (o.tipo === 'perigeo') {
      if (f.tipo !== 'giro') return { ok: false, testo: f.tipo === 'terra' ? caduta() : via() };
      const q = f.rMin - C.R, d = q - o.quota;
      if (Math.abs(d) <= o.tol) return { ok: true, testo: 'Punto più basso a ' + km(q) + ' di quota.' };
      if (f.rMin > f.r0 - 1) return { ok: false, testo: 'Non è mai scesa sotto la montagna: il punto più basso è il cannone.' };
      return { ok: false, testo: 'Punto più basso a ' + km(q) + ' di quota: ' + (d > 0 ? 'troppo in alto' : 'troppo in basso') + ' di ' + km(Math.abs(d)) + '.' };
    }
    return { ok: false, testo: '' };
  }

  const VITTORIE = [
    (p, f) => 'Più veloce, più lontano: ma la Terra è curva, e il suolo si abbassa sotto la palla mentre cade.',
    (p, f) => 'In orbita: cade sempre verso il centro, ma va di lato abbastanza da non toccare mai terra.',
    (p, f) => 'Cerchio: v²/r è uguale alla gravità lassù, che fa da forza centripeta. Un giro dura ' + durata(f.t) + '.',
    (p, f) => 'Più in alto basta meno velocità: lassù la gravità è più debole. In cambio il giro dura di più, ' + durata(f.t) + '.',
    (p, f) => 'Più veloce del cerchio, l\'orbita si allunga: il cannone diventa il punto più vicino, la stazione il più lontano.',
    (p, f) => 'Energia totale zero o positiva: non torna più. La velocità di fuga è √2 volte quella dell\'orbita circolare.',
    (p, f) => 'Sulla Luna bastano ' + num(p.v, 2) + '\u00a0km/s: G·M è molto più piccolo, e la stessa formula dà molto meno.',
    (p, f) => 'Più lenta del cerchio, ma non cade: il cannone è il punto più lontano dell\'orbita, il più vicino è dall\'altra parte.'
  ];

  const AIUTO = 'Il cannone sta in cima a una montagna (alta come nessuna montagna vera: è l\'esperimento immaginario di Newton) e spara in orizzontale, senza aria. Scegli la velocità v₀ trascinando la freccia azzurra, poi regola con − e + (tieni premuto per andare veloce). La gravità (la freccia arancio, durante il volo) punta sempre verso il centro e cala col quadrato della distanza: la traiettoria è calcolata passo dopo passo con questa forza. Nella formula, v₀²/r è l\'accelerazione centripeta che servirebbe per un cerchio a quella quota, G·M/r² la gravità che c\'è davvero: il risultato compare dopo il colpo.';
  const AIUTI = {
    2: ' La corona è larga 300\u00a0km: vale se tutto il giro resta dentro.',
    3: ' La corona è larga 500\u00a0km. Montagna più alta, gravità più debole lassù: guarda come cambia G·M/r².',
    4: ' Qui la formula è l\'energia per ogni chilogrammo: ½·v₀² − G·M/r, in MJ/kg (con v in km/s, ½·v² viene già in MJ/kg). Più energia, orbita più lunga.',
    5: ' Con energia negativa la palla resta legata e prima o poi torna; con energia zero o positiva se ne va. Vale se la velocità supera quella minima di 0,2\u00a0km/s al massimo.',
    6: ' Sulla Luna g al suolo è 1,62\u00a0m/s² e il raggio 1737\u00a0km. I passi di − e + qui sono di 0,01\u00a0km/s.',
    7: ' La corona verde è larga 300\u00a0km: vale se il punto più basso dell\'orbita cade lì dentro. Guarda dove sta il punto più basso nelle orbite dei livelli precedenti.'
  };
  const AIUTO_LIBERO = 'In modalità libera non c\'è niente da colpire. Scegli il pianeta, l\'altezza h della montagna e la velocità v₀, poi spara: le tracce restano per confrontare i tiri. La formula dice la velocità del cerchio e quella di fuga a quella quota. «Casuale» propone un tiro a caso, «Ricomincia» cancella le tracce.';

  /* ---------------- numeri ---------------- */
  function num(v, d) { const s = (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace('.', ',').replace('-', '−'); }
  function texNum(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', '{,}').replace('-', '-'); }
  function migliaia(n) { const s = String(Math.round(Math.abs(n))); return (n < 0 ? '−' : '') + (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s); }
  function km(v) { return migliaia(Math.round(v / 10) * 10) + '\u00a0km'; }
  function durata(t) {
    const m = Math.round(t / 60);
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return h + '\u00a0h ' + r + ' min';   /* i minuti ci sono sempre, anche quando sono zero: \u00ab2 h 0 min\u00bb */
  }
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, testo) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (testo != null) e.textContent = testo; return e; };
  const vuota = g => { while (g.firstChild) g.removeChild(g.firstChild); };
  const morsa = (v, a, b) => Math.max(a, Math.min(b, v));
  const arrot = (v, s) => Math.round(Math.round(v / s) * s * 1000) / 1000;

  QUANTO.registraLab({
    id: 'satellite',
    fisica: { simula, verdetto, LIVELLI, CORPI },   /* per la prova dei livelli (node) */
    monta(radice, ctx) {
      if (!document.getElementById('stile-lab-satellite')) { const s = document.createElement('style'); s.id = 'stile-lab-satellite'; s.textContent = STILE; document.head.appendChild(s); }
      radice.classList.add('lab-satellite');
      radice.innerHTML = `
        <div class="lab-layout">
          <div class="lab-scena">
            <span class="lab-livello conta"></span>
            <div class="lab-aiuto" hidden data-scorre><p></p><button type="button" class="btn piccolo m-chiudi">Ho capito</button></div>
          </div>
          <div class="lab-lato">
            <div class="lab-livelli" role="group" aria-label="Livelli"><button type="button" class="btn piccolo lab-libero" aria-pressed="false" title="Modalità libera: nessun obiettivo, pianeta, montagna e velocità li scegli tu">Libero</button></div>
            <div class="consegna"></div>
            <div class="lab-parametri">
              <div class="lab-param" data-p="v"><span class="nome">${ctx.tex('v_0')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="velocità più bassa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="velocità più alta">+</button></div>
              <div class="lab-param" data-p="h" hidden><span class="nome">${ctx.tex('h')}</span><button type="button" class="btn piccolo" data-d="-1" aria-label="montagna più bassa">−</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="montagna più alta">+</button></div>
              <div class="lab-param" data-p="corpo" hidden><span class="nome">🪐</span><button type="button" class="btn piccolo" data-d="-1" aria-label="pianeta precedente">‹</button><output></output><button type="button" class="btn piccolo" data-d="1" aria-label="pianeta successivo">›</button></div>
              <button type="button" class="btn piccolo b-casuale" hidden>Casuale</button>
            </div>
            <div class="formula" aria-live="polite"></div>
            <div class="lab-messaggio" aria-live="polite"></div>
            <div class="lab-barra">
              <button type="button" class="btn primario b-fuoco">💥 Fuoco</button>
              <button type="button" class="btn piccolo b-ric">Ricomincia</button>
              <button type="button" class="btn piccolo b-aiuto" aria-label="Come si gioca">?</button>
            </div>
          </div>
        </div>`;

      const q = s => radice.querySelector(s);
      const scena = q('.lab-scena'), aiutoEl = q('.lab-aiuto'), contaEl = q('.conta');
      const consegnaEl = q('.consegna'), formulaEl = q('.formula'), msg = q('.lab-messaggio');
      const livelliEl = q('.lab-livelli'), parametriEl = q('.lab-parametri');
      const b = { fuoco: q('.b-fuoco'), ric: q('.b-ric'), casuale: q('.b-casuale'), aiuto: q('.b-aiuto'), libero: q('.lab-libero') };
      const box = { v: q('[data-p="v"]'), h: q('[data-p="h"]'), corpo: q('[data-p="corpo"]') };

      /* ---------------- stato ---------------- */
      let livello = 0, p = { v: 5, h: 300, corpo: 'terra' }, colpi = 0, finito = false, animando = false, raf = 0;
      let tracce = [], ultimo = null, detti = {}, libero = false, salvato = null;
      const completati = ctx.stato().livelli;
      livello = completati.length ? Math.max.apply(null, completati) + 1 : 0;
      if (livello >= LIVELLI.length) livello = 0;
      const liv = () => libero ? LIBERO : LIVELLI[livello];
      const corpo = () => CORPI[p.corpo];

      /* ---------------- scena ---------------- */
      const svg = el('svg', { role: 'img', 'aria-label': 'Il pianeta, la montagna con il cannone e la traiettoria della palla', preserveAspectRatio: 'xMidYMid meet' });
      scena.insertBefore(svg, scena.firstChild);
      const gFondo = el('g'), gTracce = el('g'), gCannone = el('g'), gVolo = el('g'), gTesti = el('g');
      [gFondo, gTracce, gCannone, gVolo, gTesti].forEach(g => svg.appendChild(g));
      const orologio = el('text', { x: 10, y: 20, fill: 'var(--testo2)', style: 'font: 600 14px var(--font)' });
      svg.appendChild(orologio);

      /* S = { w, h, U (px per km), cx, cy (centro del pianeta in px), K (px per km/s della freccia) } */
      let S = { w: 300, h: 300, U: 0.02, cx: 150, cy: 150, K: 10 };
      const PX = x => S.cx + x * S.U, PY = y => S.cy - y * S.U;
      /* il riquadro (in km, centro del pianeta in 0;0) che deve stare nella scena */
      function riquadro() {
        const L = liv(), C = corpo(), R = C.R, r0 = R + p.h;
        if (L.vista === 'vicino') return [-900, 4300, 4700, r0 + 700];
        if (L.vista === 'intero') return [-r0 * 1.12, r0 * 1.12, -r0 * 1.1, r0 * 1.16];
        if (L.vista === 'stazione') return [-8600, 8600, -18600, 7600];
        if (L.vista === 'largo') return [-2.6 * R, 2.6 * R, -2.6 * R, 1.6 * R];
        /* libero: il pianeta e le tracce, fino a 3,5 raggi */
        let b4 = [-r0 * 1.12, r0 * 1.12, -r0 * 1.1, r0 * 1.16];
        const lim = 3.5 * R;
        tracce.forEach(t => t.f.punti.forEach(pt => {
          const x = morsa(pt[0], -lim, lim), y = morsa(pt[1], -lim, lim);
          if (x < b4[0]) b4[0] = x; if (x > b4[1]) b4[1] = x; if (y < b4[2]) b4[2] = y; if (y > b4[3]) b4[3] = y;
        }));
        return b4;
      }
      function geometria() {
        const r = svg.getBoundingClientRect();
        const w = Math.max(200, Math.round(r.width)), h = Math.max(160, Math.round(r.height));
        const B = riquadro(), m = 14, su = 26;
        const U = Math.min((w - 2 * m) / (B[1] - B[0]), (h - su - m) / (B[3] - B[2]));
        const mx = (B[0] + B[1]) / 2, my = (B[2] + B[3]) / 2;
        S = { w, h, U, cx: w / 2 - mx * U, cy: liv().vista === 'vicino' ? su + 30 + B[3] * U : su + (h - su - m) / 2 + my * U, K: morsa(0.3 * Math.min(w, h), 70, 200) / corpo().vmax };
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      /* punto sul suolo dopo un arco s (km) in senso orario dalla cima, a quota q */
      const sulSuolo = (s, qq) => { const C = corpo(), a = s / C.R, rr = C.R + (qq || 0); return [rr * Math.sin(a), rr * Math.cos(a)]; };

      function disegnaFondo() {
        vuota(gFondo);
        const L = liv(), C = corpo(), R = C.R, r0 = R + p.h, o = L.ob || {};
        /* l'obiettivo dietro al pianeta: corone */
        const corona = (r1, r2, colore, op) => {
          const a1 = r1 * S.U, a2 = r2 * S.U;
          gFondo.appendChild(el('path', { d: `M${S.cx - a2} ${S.cy} a${a2} ${a2} 0 1 0 ${2 * a2} 0 a${a2} ${a2} 0 1 0 ${-2 * a2} 0 Z M${S.cx - a1} ${S.cy} a${a1} ${a1} 0 1 1 ${2 * a1} 0 a${a1} ${a1} 0 1 1 ${-2 * a1} 0 Z`, fill: colore, 'fill-rule': 'evenodd', opacity: op }));
        };
        if (!libero && o.tipo === 'cerchio') corona(r0 - o.tol, r0 + o.tol, 'var(--ok)', 0.22);
        if (!libero && o.tipo === 'perigeo') corona(R + o.quota - o.tol, R + o.quota + o.tol, 'var(--ok)', 0.22);
        if (!libero && o.tipo === 'apogeo') {   /* la stazione: un arco di corona di ±30° dalla parte opposta al cannone */
          const r1 = R + o.quota - o.tol, r2 = R + o.quota + o.tol, s = 30 * Math.PI / 180;
          const pt = (rr, a) => PX(rr * Math.sin(a)).toFixed(1) + ' ' + PY(rr * Math.cos(a)).toFixed(1);
          gFondo.appendChild(el('path', { d: 'M' + pt(r2, Math.PI - s) + ' A' + (r2 * S.U).toFixed(1) + ' ' + (r2 * S.U).toFixed(1) + ' 0 0 1 ' + pt(r2, Math.PI + s) + ' L' + pt(r1, Math.PI + s) + ' A' + (r1 * S.U).toFixed(1) + ' ' + (r1 * S.U).toFixed(1) + ' 0 0 0 ' + pt(r1, Math.PI - s) + ' Z', fill: 'var(--ok)', opacity: 0.25 }));
          const yT = PY(-r2) + 15;
          gFondo.appendChild(el('text', { x: PX(0), y: yT, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)' }, 'stazione, ' + km(o.quota) + ' di quota'));
        }
        /* il pianeta: un cerchio, o (se sporge dalla scena) il poligono del cerchio schiacciato sui bordi della scena */
        const rp = R * S.U;
        if (S.cx - rp >= 0 && S.cx + rp <= S.w && S.cy - rp >= 0 && S.cy + rp <= S.h) {
          gFondo.appendChild(el('circle', { cx: S.cx, cy: S.cy, r: rp, fill: C.colore, 'fill-opacity': 0.32, stroke: C.colore, 'stroke-width': 2 }));
        } else {
          let d = '';
          for (let k = 0; k <= 720; k++) { const a = k / 720 * 2 * Math.PI; d += (k ? 'L' : 'M') + morsa(S.cx + rp * Math.cos(a), 0, S.w).toFixed(1) + ' ' + morsa(S.cy + rp * Math.sin(a), 0, S.h).toFixed(1); }
          gFondo.appendChild(el('path', { d: d + 'Z', fill: C.colore, 'fill-opacity': 0.32 }));
          gFondo.appendChild(el('path', { d: pathDi(cerchioPunti(R), null, true), fill: 'none', stroke: C.colore, 'stroke-width': 2 }));
        }
        if (S.cy > 0 && S.cy < S.h) gFondo.appendChild(el('circle', { cx: S.cx, cy: S.cy, r: 2.5, fill: 'var(--testo2)' }));
        if (L.vista !== 'vicino') {
          const scritta = C.nome + ' · R = ' + migliaia(R) + '\u00a0km';
          gFondo.appendChild(el('text', { x: S.cx, y: S.cy + 18, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, scritta));
        }
        /* la montagna, in scala: alta h, con la base larga quanto l'altezza */
        const sb = Math.max(p.h * 0.7, 7 / S.U), pa = sulSuolo(-sb, 0), pb = sulSuolo(sb, 0);
        gFondo.appendChild(el('path', { d: `M${PX(pa[0])} ${PY(pa[1])} L${PX(0)} ${PY(r0)} L${PX(pb[0])} ${PY(pb[1])} Z`, fill: '#8a6a45', opacity: .8 }));
        /* il villaggio */
        if (!libero && o.tipo === 'villaggio') {
          const s = o.arco;
          const a0 = (s - o.tol) / R, a1 = (s + o.tol) / R, rr = R;
          const P1 = [rr * Math.sin(a0), rr * Math.cos(a0)], P2 = [rr * Math.sin(a1), rr * Math.cos(a1)];
          const ar = rr * S.U;
          gFondo.appendChild(el('path', { d: `M${PX(P1[0])} ${PY(P1[1])} A${ar} ${ar} 0 0 1 ${PX(P2[0])} ${PY(P2[1])}`, fill: 'none', stroke: 'var(--no)', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .8 }));
          const c = sulSuolo(s, 0), fuori = sulSuolo(s, 30 / S.U);
          gFondo.appendChild(el('line', { x1: PX(c[0]), y1: PY(c[1]), x2: PX(fuori[0]), y2: PY(fuori[1]), stroke: 'var(--testo)', 'stroke-width': 2 }));
          const t = sulSuolo(s, 46 / S.U);
          gFondo.appendChild(el('text', { x: PX(t[0]), y: PY(t[1]) + 4, 'text-anchor': 'middle', fill: 'var(--testo)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3 }, '🏘 ' + km(o.arco)));
        }
        if (L.vista === 'vicino') {   /* il righello dell'arco sul suolo, ogni 500 km */
          for (let s = 0; s <= 4500; s += 500) {
            const a = sulSuolo(s, 0), bq = sulSuolo(s, -6 / S.U), tq = sulSuolo(s, -20 / S.U);
            if (PX(a[0]) > S.w - 10) break;
            gFondo.appendChild(el('line', { x1: PX(a[0]), y1: PY(a[1]), x2: PX(bq[0]), y2: PY(bq[1]), stroke: 'var(--testo)', 'stroke-width': 1.5, opacity: .6 }));
            if (s % 1000 === 0) gFondo.appendChild(el('text', { x: PX(tq[0]), y: PY(tq[1]) + 4, 'text-anchor': 'middle', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, s === 0 ? '0' : migliaia(s)));
          }
          gFondo.appendChild(el('text', { x: S.w - 8, y: S.h - 10, 'text-anchor': 'end', fill: 'var(--testo2)', style: 'font: 12px var(--font)' }, 'km sul suolo · Terra, R = 6370\u00a0km'));
        }
      }

      function freccia(g, x1, y1, x2, y2, colore, sp) {
        const lung = Math.hypot(x2 - x1, y2 - y1);
        if (lung < 2) return;
        const ux = (x2 - x1) / lung, uy = (y2 - y1) / lung, pt = Math.min(11, lung * 0.5);
        g.appendChild(el('line', { x1, y1, x2: x2 - ux * pt * 0.7, y2: y2 - uy * pt * 0.7, stroke: colore, 'stroke-width': sp, 'stroke-linecap': 'round' }));
        g.appendChild(el('path', { d: `M${x2} ${y2} L${x2 - ux * pt - uy * pt * 0.5} ${y2 - uy * pt + ux * pt * 0.5} L${x2 - ux * pt + uy * pt * 0.5} ${y2 - uy * pt - ux * pt * 0.5} Z`, fill: colore }));
      }
      function disegnaCannone() {
        vuota(gCannone);
        const C = corpo(), x0 = PX(0), y0 = PY(C.R + p.h);
        gCannone.appendChild(el('rect', { x: x0 - 5, y: y0 - 11, width: 20, height: 8, rx: 3, fill: 'var(--testo)' }));
        gCannone.appendChild(el('circle', { cx: x0, cy: y0 - 3, r: 4, fill: 'var(--sup)', stroke: 'var(--testo)', 'stroke-width': 2 }));
        const yf = y0 - 7, lx = p.v * S.K;
        freccia(gCannone, x0 + 15, yf, x0 + 15 + lx, yf, 'var(--s1)', 3.2);
        const et = el('text', { x: x0 + 18 + Math.max(lx, 0), y: yf - 9, 'text-anchor': lx > 70 ? 'end' : 'start', fill: 'var(--s1)', style: 'font: 700 14px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
        et.appendChild(document.createTextNode('v'));
        et.appendChild(el('tspan', { 'baseline-shift': 'sub', style: 'font-size: 11px' }, '0'));
        et.appendChild(el('tspan', {}, ' ' + num(p.v, C.dv < 0.05 ? 2 : 2) + '\u00a0km/s'));
        gCannone.appendChild(et);
        const ht = el('text', { x: x0 - 10, y: y0 - 16, 'text-anchor': 'end', fill: 'var(--testo)', style: 'font: 600 13px var(--font)', 'paint-order': 'stroke', stroke: 'var(--sup2)', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'h ' + km(p.h));
        gCannone.appendChild(ht);
      }
      /* il percorso di una traccia, ritagliato al rettangolo della scena (le orbite di fuga escono: lì il tratto si interrompe) */
      function cerchioPunti(r) { const o = []; for (let k = 0; k <= 720; k++) { const a = k / 720 * 2 * Math.PI; o.push([r * Math.cos(a), r * Math.sin(a)]); } return o; }
      function pathDi(punti) {
        const x0 = 1, x1 = S.w - 1, y0 = 1, y1 = S.h - 1;
        const dentro = (X, Y) => X >= x0 && X <= x1 && Y >= y0 && Y <= y1;
        /* il punto dove il segmento da A (dentro) a B (fuori) attraversa il bordo */
        const bordo = (ax, ay, bx, by) => {
          let t = 1;
          if (bx < x0) t = Math.min(t, (x0 - ax) / (bx - ax)); if (bx > x1) t = Math.min(t, (x1 - ax) / (bx - ax));
          if (by < y0) t = Math.min(t, (y0 - ay) / (by - ay)); if (by > y1) t = Math.min(t, (y1 - ay) / (by - ay));
          return [ax + (bx - ax) * t, ay + (by - ay) * t];
        };
        let d = '', aperto = false, px = 0, py = 0, pin = false, ux = -99, uy = -99;
        const f1 = v => v.toFixed(1);
        for (let k = 0; k < punti.length; k++) {
          const X = PX(punti[k][0]), Y = PY(punti[k][1]), inn = dentro(X, Y);
          if (inn) {
            if (!aperto) {
              if (k > 0) { const q = bordo(X, Y, px, py); d += 'M' + f1(q[0]) + ' ' + f1(q[1]) + ' L' + f1(X) + ' ' + f1(Y) + ' '; }
              else d += 'M' + f1(X) + ' ' + f1(Y) + ' ';
              aperto = true; ux = X; uy = Y;
            } else if (Math.abs(X - ux) >= 0.8 || Math.abs(Y - uy) >= 0.8 || k === punti.length - 1) { d += 'L' + f1(X) + ' ' + f1(Y) + ' '; ux = X; uy = Y; }
          } else if (aperto && pin) {
            const q = bordo(px, py, X, Y); d += 'L' + f1(q[0]) + ' ' + f1(q[1]) + ' '; aperto = false;
          }
          px = X; py = Y; pin = inn;
        }
        return d;
      }
      function disegnaTracce() {
        vuota(gTracce);
        tracce.forEach((t, i) => {
          const recente = i === tracce.length - 1;
          gTracce.appendChild(el('path', { d: pathDi(t.f.punti), fill: 'none', stroke: 'var(--testo2)', 'stroke-width': recente ? 2.4 : 1.6, 'stroke-dasharray': recente ? 'none' : '6 5', opacity: recente ? 0.9 : 0.3 + 0.12 * i, 'stroke-linejoin': 'round' }));
          if (t.f.tipo === 'terra') gTracce.appendChild(el('circle', { cx: PX(t.f.x), cy: PY(t.f.y), r: recente ? 5 : 3.5, fill: 'var(--s3)', opacity: recente ? 1 : 0.6 }));
          if (recente && t.f.tipo === 'giro' && t.f.rMax - t.f.r0 > 0.03 * t.f.r0) {   /* il punto più lontano di un'ellisse */
            let m = t.f.punti[0];
            t.f.punti.forEach(pt => { if (pt[0] * pt[0] + pt[1] * pt[1] > m[0] * m[0] + m[1] * m[1]) m = pt; });
            gTracce.appendChild(el('circle', { cx: PX(m[0]), cy: PY(m[1]), r: 3.5, fill: 'var(--testo2)' }));
          }
        });
      }
      function ridisegnaTutto() { geometria(); disegnaFondo(); disegnaTracce(); disegnaCannone(); }

      /* ---------------- pannello ---------------- */
      function aggiornaParametri() {
        const C = corpo();
        box.v.querySelector('output').textContent = num(p.v, 2) + '\u00a0km/s';
        box.h.querySelector('output').textContent = migliaia(p.h) + '\u00a0km';
        box.corpo.querySelector('output').textContent = C.nome;
        box.h.hidden = !libero; box.corpo.hidden = !libero;
        const lim = { v: [0, C.vmax], h: [0, C.hmax] };
        ['v', 'h'].forEach(k => box[k].querySelectorAll('button').forEach(bt => {
          const d = +bt.dataset.d; bt.disabled = animando || (d < 0 ? p[k] <= lim[k][0] + 1e-9 : p[k] >= lim[k][1] - 1e-9);
        }));
        box.corpo.querySelectorAll('button').forEach(bt => { bt.disabled = animando; });
      }
      function aggiornaFormula() {
        const L = liv(), C = corpo(), GM = GMdi(C), r0 = C.R + p.h;
        const fatto = libero || (ultimo && ultimo.p.v === p.v && ultimo.p.h === p.h && ultimo.p.corpo === p.corpo);
        const pezzi = [];
        const numerico = s => { const i = s.indexOf(' = '); return '<span class="pezzo"><span class="nome-stretto">' + ctx.tex(s.slice(0, i)) + ' </span>' + ctx.tex(s.slice(i + 1)) + '</span>'; };
        if (L.formula === 'centripeta') {
          const ac = p.v * p.v / r0 * 1000, gr = GM / (r0 * r0) * 1000;
          const tAc = texNum(ac, 2), tG = texNum(gr, 2);
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('\\dfrac{v_0^2}{r}') + '</span>');
          pezzi.push(numerico('\\dfrac{v_0^2}{r} = \\dfrac{(' + texNum(p.v, 2) + '\\,\\text{km/s})^2}{' + migliaia(r0).replace(' ', '\\,') + '\\,\\text{km}}'));
          if (fatto) {
            const cmp = tAc === tG ? '\\approx' : (ac < gr ? '<' : '>');
            pezzi.push('<span class="pezzo esito">' + ctx.tex('\\approx ' + tAc + '\\,\\text{m/s}^2') + '</span>');
            pezzi.push('<span class="pezzo">' + ctx.tex(cmp + ' \\dfrac{G \\cdot M}{r^2} \\approx ' + tG + '\\,\\text{m/s}^2') + '</span>');
          } else {
            pezzi.push('<span class="pezzo ignoto">' + ctx.tex('= \\ ?') + '</span>');
            pezzi.push('<span class="pezzo">' + ctx.tex('\\dfrac{G \\cdot M}{r^2} \\approx ' + tG + '\\,\\text{m/s}^2') + '</span>');
          }
        } else if (L.formula === 'energia') {
          const gmr = GM / r0, E = 0.5 * p.v * p.v - gmr;
          pezzi.push('<span class="pezzo simbolo">' + ctx.tex('\\dfrac{E_m}{m} = \\tfrac{1}{2} \\cdot v_0^2 - \\dfrac{G \\cdot M}{r}') + '</span>');
          pezzi.push(numerico('\\dfrac{E_m}{m} = \\tfrac{1}{2} \\cdot ' + texNum(p.v, 2) + '^2 - ' + texNum(gmr, 1)));
          pezzi.push(fatto ? '<span class="pezzo esito">' + ctx.tex('\\approx ' + texNum(Math.abs(E) < 0.05 ? 0 : E, 1) + '\\,\\text{MJ/kg}') + '</span>' : '<span class="pezzo ignoto">' + ctx.tex('= \\ ?\\,\\text{MJ/kg}') + '</span>');
        } else {
          const vc = Math.sqrt(GM / r0);
          pezzi.push('<span class="pezzo">cerchio: ' + ctx.tex('v = \\sqrt{\\dfrac{G \\cdot M}{r}} \\approx ' + texNum(vc, 2) + '\\,\\text{km/s}') + '</span>');
          pezzi.push('<span class="pezzo">fuga: ' + ctx.tex('v_f = \\sqrt{2} \\cdot v \\approx ' + texNum(vc * Math.SQRT2, 2) + '\\,\\text{km/s}') + '</span>');
        }
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
      function aggiornaConta() { contaEl.textContent = libero ? '' : 'colpi: ' + colpi; }
      function aggiorna() { aggiornaParametri(); aggiornaFormula(); disegnaCannone(); }

      /* ---------------- livelli ---------------- */
      function avviaLivello(n) {
        cancelAnimationFrame(raf); animando = false;
        libero = false; salvato = null; mostraLibero();
        livello = n; const L = LIVELLI[n];
        p = { v: L.inizio, h: L.h, corpo: L.corpo };
        colpi = 0; finito = false; tracce = []; ultimo = null; detti = {};
        vuota(gVolo); orologio.textContent = ''; aiutoEl.hidden = true;
        consegnaEl.innerHTML = '<span>' + L.consegna + '</span>';
        msg.textContent = ''; msg.className = 'lab-messaggio';
        b.fuoco.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }

      /* ---------------- il colpo ---------------- */
      function fuoco() {
        if (animando || finito) return;
        const f = simula(p);
        aiutoEl.hidden = true;
        if (!libero) colpi++;
        aggiornaConta();
        msg.textContent = ''; msg.className = 'lab-messaggio';
        animando = true; b.fuoco.disabled = true; b.ric.disabled = true; b.casuale.disabled = true;
        aggiornaParametri(); aggiornaLivelli();
        /* il tempo scorre accelerato: un volo dura sullo schermo fra 1,6 e 4,5 s */
        /* se se ne va, l'animazione finisce quando esce dalla scena per non rientrare più */
        let tTot = f.t;
        if (f.tipo === 'esce') {
          let k = f.punti.length - 1;
          while (k > 0 && !(PX(f.punti[k][0]) > -20 && PX(f.punti[k][0]) < S.w + 20 && PY(f.punti[k][1]) > -20 && PY(f.punti[k][1]) < S.h + 20)) k--;
          tTot = f.punti[Math.min(k + 1, f.punti.length - 1)][2];
        }
        const dur =morsa(1.3 + tTot / 2500, 1.6, 4.5), fattore = tTot / dur, t0 = performance.now();
        const pista = el('path', { fill: 'none', stroke: 'var(--testo2)', 'stroke-width': 2.4, opacity: .9, 'stroke-linejoin': 'round' });
        vuota(gVolo); gVolo.appendChild(pista);
        const gV = el('g'); gVolo.appendChild(gV);
        const palla = el('circle', { r: 5.5, fill: 'var(--testo)', stroke: 'var(--sup)', 'stroke-width': 1.5 });
        gVolo.appendChild(palla);
        const P = f.punti, GM = f.GM, gSuolo = corpo().g;
        let i = 0, d = '';
        const passo = ora => {
          const t = Math.min(tTot, (ora - t0) / 1000 * fattore);
          while (i < P.length - 1 && P[i + 1][2] <= t) { i++; d += (d ? 'L' : 'M') + PX(P[i][0]).toFixed(1) + ' ' + PY(P[i][1]).toFixed(1) + ' '; }
          const a = P[i], bb = P[Math.min(i + 1, P.length - 1)], fr = bb[2] > a[2] ? (t - a[2]) / (bb[2] - a[2]) : 0;
          const x = a[0] + (bb[0] - a[0]) * fr, y = a[1] + (bb[1] - a[1]) * fr;
          pista.setAttribute('d', (d || ('M' + PX(P[0][0]).toFixed(1) + ' ' + PY(P[0][1]).toFixed(1))) + ' L' + PX(x).toFixed(1) + ' ' + PY(y).toFixed(1));
          const cx = PX(x), cy = PY(y);
          palla.setAttribute('cx', cx); palla.setAttribute('cy', cy);
          vuota(gV);
          if (t < tTot) {
            /* velocità (tangente, azzurra) e gravità (verso il centro, arancio, lunga in proporzione a G·M/r²) */
            const vx = (bb[0] - a[0]), vy = (bb[1] - a[1]), dtt = bb[2] - a[2];
            if (dtt > 0) freccia(gV, cx, cy, cx + vx / dtt * S.K, cy - vy / dtt * S.K, 'var(--s1)', 2.6);
            const r = Math.hypot(x, y), gr = GM / (r * r) * 1000, lg = 34 * gr / gSuolo;
            freccia(gV, cx, cy, cx - x / r * lg, cy + y / r * lg, 'var(--s2)', 2.6);
          }
          orologio.textContent = 't = ' + durata(t);
          if (t < tTot) { raf = requestAnimationFrame(passo); return; }
          raf = 0; atterra(f);
        };
        raf = requestAnimationFrame(passo);
      }

      function atterra(f) {
        animando = false; b.fuoco.disabled = false; b.ric.disabled = false; b.casuale.disabled = false;
        const L = liv(), prec = ultimo;
        ultimo = { p: Object.assign({}, p), f };
        tracce.push({ p: ultimo.p, f }); if (tracce.length > 4) tracce.shift();
        vuota(gVolo);
        if (libero) {
          ridisegnaTutto(); aggiorna(); aggiornaLivelli();
          msg.textContent = osserva(f); msg.className = 'lab-messaggio';
          return;
        }
        disegnaTracce(); aggiorna(); aggiornaLivelli();
        const v = verdetto(L, f, p);
        if (v.ok) { vinci(v.testo, f); return; }
        msg.textContent = v.testo; msg.className = 'lab-messaggio no';
        ctx.mascotte('sbagliato');
        erroreTipico(L, f, prec);
      }

      function vinci(testo, f) {
        finito = true; b.fuoco.disabled = true;
        msg.innerHTML = '<span class="vinto">' + testo + (colpi === 1 ? ' Al primo colpo.' : ' Colpi: ' + colpi + '.') + '</span>';
        msg.className = 'lab-messaggio ok';
        ctx.completato(livello); aggiornaLivelli();
        ctx.zenone(VITTORIE[livello](p, f), { espressione: colpi <= 2 ? 'orgoglioso' : 'felice', durata: 7000 });
        b.ric.textContent = livello < LIVELLI.length - 1 ? 'Prossimo livello ▶' : 'Ricomincia dal primo';
      }

      /* gli errori tipici che i video smontano: una volta sola per livello */
      function dici(chiave, testo) {
        if (detti[chiave]) return; detti[chiave] = true;
        ctx.zenone(testo, { tipo: 'suggerimento', espressione: 'pensa', durata: 7500 });
      }
      function erroreTipico(L, f, prec) {
        const o = L.ob;
        if (o.tipo === 'cerchio' && f.tipo === 'giro' && L.h === 2000 && p.v > f.vc) { dici('alto', 'Più in alto non serve più velocità: lassù la gravità è più debole, e per il cerchio ne basta meno.'); return; }
        if (o.tipo === 'orbita' && f.tipo === 'terra' && colpi >= 2) { dici('cade', 'Non serve salire: serve andare di lato così in fretta che il suolo si incurvi sotto la palla mentre cade.'); return; }
        if (o.tipo === 'fuga' && f.E < 0 && p.v > f.vc) { dici('ellisse', 'Oltre la velocità del cerchio l\'orbita si allunga ma resta chiusa: per andarsene serve energia totale almeno zero.'); return; }
        if (o.tipo === 'fuga' && f.E >= 0) { dici('minimo', 'Guarda l\'energia: la velocità minima è quella che la porta esattamente a zero.'); return; }
        if (o.tipo === 'cerchio' && f.tipo === 'giro') { dici('confronto', 'Nel cerchio la gravità fa da forza centripeta: confronta v₀²/r con G·M/r² nella formula.'); return; }
        if (o.tipo === 'perigeo' && f.tipo === 'giro' && p.v >= f.vc) { dici('peri', 'Più veloce del cerchio sale: il cannone diventa il punto più basso. Per scendere dall\'altra parte, parti più piano.'); return; }
        if (o.tipo === 'apogeo' && f.tipo === 'giro' && prec && prec.f.tipo === 'giro') { dici('apo', 'Poca velocità in più al cannone sposta molto il punto più lontano, dall\'altra parte della Terra.'); }
      }

      /* ---------------- modalità libera ---------------- */
      function osserva(f) {
        if (f.tipo === 'terra') return (f.arco < 5 ? 'Caduta ai piedi della montagna' : 'Caduta a ' + km(f.arco) + ' dalla montagna') + ', dopo ' + durata(f.t) + '.';
        if (f.tipo === 'giro') {
          const e = (f.rMax - f.rMin) / (f.rMax + f.rMin);
          return (e < 0.02 ? 'Quasi un cerchio: ' : 'Un\'ellisse: ') + 'un giro in ' + durata(f.t) + ', quota da ' + km(f.rMin - f.R) + ' a ' + km(f.rMax - f.R) + '.';
        }
        return f.E >= 0 ? 'Energia totale zero o positiva: se ne va e non torna più.' : 'Esce dalla vista con energia negativa: va molto lontano, poi torna.';
      }
      function mostraLibero() { b.casuale.hidden = !libero; radice.classList.toggle('in-libero', libero); }
      function entraLibero() {
        if (animando) return;
        salvato = { livello, p: Object.assign({}, p), colpi, finito, tracce: tracce.slice(), ultimo, detti: Object.assign({}, detti), cons: consegnaEl.innerHTML, msg: msg.innerHTML, cls: msg.className, ric: b.ric.textContent };
        libero = true; mostraLibero(); aiutoEl.hidden = true;
        p = { v: 7, h: 300, corpo: 'terra' }; tracce = []; ultimo = null; finito = false;
        consegnaEl.textContent = '';
        msg.textContent = ''; msg.className = 'lab-messaggio'; orologio.textContent = '';
        b.fuoco.disabled = false; b.ric.textContent = 'Ricomincia';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
      }
      function esciLibero() {
        if (animando) return;
        const z = salvato; libero = false; salvato = null; mostraLibero(); aiutoEl.hidden = true;
        livello = z.livello; p = z.p; colpi = z.colpi; finito = z.finito; tracce = z.tracce; ultimo = z.ultimo; detti = z.detti;
        consegnaEl.innerHTML = z.cons; b.ric.textContent = z.ric; b.fuoco.disabled = finito; orologio.textContent = '';
        ridisegnaTutto(); aggiorna(); aggiornaLivelli(); aggiornaConta();
        msg.innerHTML = z.msg; msg.className = z.cls;
      }
      function casuale() {
        if (animando) return;
        const c = ORDINE_CORPI[Math.floor(Math.random() * 3)], C = CORPI[c];
        const h = arrot(Math.random() * C.hmax * 0.6, C.dh), vc = Math.sqrt(GMdi(C) / (C.R + h));
        p = { corpo: c, h, v: morsa(arrot(vc * (0.75 + Math.random() * 0.6), C.dv), 0, C.vmax) };
        msg.textContent = ''; ridisegnaTutto(); aggiorna();
      }

      /* ---------------- comandi ---------------- */
      function cambia(k, d) {
        if (animando || (!libero && k !== 'v')) return false;
        if (k === 'corpo') {
          const i = (ORDINE_CORPI.indexOf(p.corpo) + d + 3) % 3, C = CORPI[ORDINE_CORPI[i]];
          p.corpo = ORDINE_CORPI[i]; p.h = Math.min(p.h, C.hmax); p.h = arrot(p.h, C.dh);
          p.v = morsa(arrot(Math.sqrt(GMdi(C) / (C.R + p.h)) * 0.9, C.dv), 0, C.vmax);
          tracce = []; ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return true;
        }
        const C = corpo(), lim = k === 'v' ? [0, C.vmax, C.dv] : [0, C.hmax, C.dh];
        const nuovo = morsa(arrot(p[k] + d * lim[2], lim[2]), lim[0], lim[1]);
        if (Math.abs(nuovo - p[k]) < 1e-9) return false;
        p[k] = nuovo;
        if (msg.classList.contains('no')) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
        if (libero) { msg.textContent = ''; if (k === 'h') { tracce = []; ultimo = null; } ridisegnaTutto(); }
        aggiorna(); return true;
      }
      let ripeti = null, ultimoGiu = 0;
      function fermaRipeti() { if (ripeti) { clearTimeout(ripeti); ripeti = null; } }
      parametriEl.addEventListener('pointerdown', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || bt.disabled) return;
        ultimoGiu = Date.now();
        const k = bt.closest('.lab-param').dataset.p, d = +bt.dataset.d;
        if (!cambia(k, d) || k === 'corpo') return;
        let attesa = 380;
        const giro = () => { if (cambia(k, d)) { attesa = Math.max(40, attesa * 0.75); ripeti = setTimeout(giro, attesa); } else ripeti = null; };
        fermaRipeti(); ripeti = setTimeout(giro, attesa);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => parametriEl.addEventListener(t, fermaRipeti));
      parametriEl.addEventListener('click', ev => {
        const bt = ev.target.closest('button[data-d]'); if (!bt || Date.now() - ultimoGiu < 600) return;
        cambia(bt.closest('.lab-param').dataset.p, +bt.dataset.d);
      });

      /* trascinare la freccia: la distanza orizzontale dal cannone è v0 (lo sparo è sempre orizzontale) */
      let mira = false;
      function punta(ev) {
        const m = svg.getScreenCTM(); if (!m) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const c = pt.matrixTransform(m.inverse()), C = corpo();
        const dx = c.x - (PX(0) + 15);
        const v = morsa(arrot(Math.max(0, dx) / S.K, C.dv), 0, C.vmax);
        if (Math.abs(v - p.v) > 1e-9) {
          p.v = v;
          if (msg.classList.contains('no') || libero) { msg.textContent = ''; msg.className = 'lab-messaggio'; }
          aggiorna();
        }
      }
      svg.addEventListener('pointerdown', ev => {
        if (animando || finito) return;
        mira = true; aiutoEl.hidden = true;
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
        punta(ev); ev.preventDefault();
      });
      const muovi = ev => { if (mira) { punta(ev); ev.preventDefault(); } };
      const molla = () => { mira = false; };
      window.addEventListener('pointermove', muovi);
      window.addEventListener('pointerup', molla);
      window.addEventListener('pointercancel', molla);

      b.fuoco.addEventListener('click', fuoco);
      b.ric.addEventListener('click', () => {
        if (animando) return;
        if (libero) { tracce = []; ultimo = null; msg.textContent = ''; ridisegnaTutto(); aggiorna(); return; }
        avviaLivello(finito ? (livello + 1) % LIVELLI.length : livello);
      });
      b.casuale.addEventListener('click', casuale);
      b.libero.addEventListener('click', () => { if (libero) esciLibero(); else entraLibero(); });
      b.aiuto.addEventListener('click', () => {
        if (!aiutoEl.hidden) { aiutoEl.hidden = true; return; }
        aiutoEl.querySelector('p').textContent = libero ? AIUTO_LIBERO : AIUTO + (AIUTI[livello] || '');
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
      /* formula, consegna e messaggio hanno un'altezza fissa: se un testo non ci sta, si rimpicciolisce */
      const fissi = [formulaEl, consegnaEl, msg].filter(Boolean);
      const mo = new MutationObserver(() => fissi.forEach(stringi));
      fissi.forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
      const ro = new ResizeObserver(() => {
        fissi.forEach(stringi);
        const r = svg.getBoundingClientRect(), nuova = Math.round(r.width) + 'x' + Math.round(r.height);
        if (nuova === forma || r.width < 10) return;
        forma = nuova; if (!animando) ridisegnaTutto();
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
