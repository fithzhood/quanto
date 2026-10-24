/* Quanto — Stilla, la mascotte: la goccia d'acqua dei video, disegnata con lo stesso codice
   (CVIDEO.drawStilla di quanto-video.js) su una piccola tela in basso a destra.
   Reagisce a quello che succede (risposte giuste e sbagliate, passi svelati, livelli superati,
   inattività) e parla con una bolla. Quando si annoia si addormenta e gela in un cubetto di ghiaccio;
   al traguardo diventa una nuvola e fa due gocce di pioggia.
   Espone window.CMASC (stessa API di Ada in Compasso): monta(), dici(), espressione(), reagisci(),
   chiudi(), visibile(), aperta(). */
(function () {
  'use strict';

  const LW = 150, LH = 140;                       /* tela logica: Stilla coi piedi in (75, 128), scala 1 */
  const FACCE = ['neutro', 'felice', 'occhiolino', 'pensa', 'sorpreso', 'festa', 'freddo', 'dorme'];
  /* le espressioni di Ada che Stilla non ha: una faccia sua più un segno accanto alla testa */
  const ALIAS = { triste: ['pensa', 'lacrima'], confuso: ['pensa', 'domanda'], ops: ['sorpreso', 'goccia'], orgoglioso: ['occhiolino', 'scintille'], parla: ['neutro', null] };
  const P = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const moto = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;

  let radice, bolla, testoEl, azioniEl, tipoEl, figura, tela, ctx, timerChiusura = null, timerFaccia = null, timerSonno = null, timerStato = null;
  let faccia = 'neutro', facciaDa = 0, segno = null, dorme = false, parlaFino = 0;
  let stato = { da: [0, 0], a: [0, 0], da0: -99, verso: null }, pioggia = null;
  let guardo = [2, -1.5], mira = [2, -1.5], t0 = 0, entrata = 0.15, ultimoDisegno = 0, inCorso = false, pronta = false;

  const ora = () => (performance.now() - t0) / 1000;

  /* ---------- lo stato fisico: liquida, ghiaccio, nuvola (ogni cambio dura 1,5 s, come nei video) ---------- */
  const VAL = { liquida: [0, 0], ghiaccio: [1, 0], nuvola: [0, 1] };
  function valeStato(t) { const k = P(t, stato.da0, stato.da0 + 1.5); return [stato.da[0] + (stato.a[0] - stato.da[0]) * k, stato.da[1] + (stato.a[1] - stato.da[1]) * k]; }
  function diventa(nome) {
    const t = ora(), v = valeStato(t);
    if (stato.verso === nome && t - stato.da0 < 1.5) return;
    stato = { da: v, a: VAL[nome] || [0, 0], da0: t, verso: nome };
    avvia();
  }

  /* ---------- il fotogramma ---------- */
  function fotogramma(t) {
    const dt = t - facciaDa;
    let jump = 0, shake = 0, tilt = 0, squash = 0, alfa = 1, cade = 0;
    const allegra = faccia === 'felice' || faccia === 'occhiolino' || faccia === 'festa';
    if (allegra && dt < .55) jump = Math.sin(dt / .55 * Math.PI) * 12;
    if (allegra && dt >= .55 && dt < .85) squash = Math.sin((dt - .55) / .3 * Math.PI);
    if (faccia === 'sorpreso' && dt < .45) shake = Math.sin(dt * 70) * 3 * (1 - dt / .45);
    if (faccia === 'freddo') shake = Math.sin(t * 47) * .9;
    if (faccia === 'pensa') tilt = Math.sin(dt * 3.4) * .045;
    /* entrata: cade dall'alto e atterra schiacciandosi */
    const en = t - entrata;
    if (en < 0) alfa = 0;
    else if (en < .7) { const k = en / .7; cade = -120 * (1 - k * k); }
    else if (en < 1) squash = Math.max(squash, Math.sin((en - .7) / .3 * Math.PI));
    const v = valeStato(t), kk = P(t, stato.da0, stato.da0 + 1.5);
    const vapore = stato.verso === 'nuvola' && kk < 1 ? Math.sin(Math.PI * kk) : 0;
    const brina = stato.verso === 'ghiaccio' && kk < 1 ? Math.sin(Math.PI * kk) : 0;
    const piove = pioggia && t >= pioggia[0] && t <= pioggia[1] ? t - pioggia[0] : null;
    const talk = t < parlaFino ? Math.abs(Math.sin(t * 13)) * (.55 + .45 * Math.abs(Math.sin(t * 3.1))) : 0;
    guardo = [guardo[0] + (mira[0] - guardo[0]) * .2, guardo[1] + (mira[1] - guardo[1]) * .2];
    return {
      x: 75, y: 128, s: 1, face: faccia, faceAt: facciaDa, t, talk, jump, shake, tilt, squash,
      ice: v[0], nub: v[1], vapore, brina, piove, alfa, cade, scioglie: 0, look: guardo,
      blink: ((t + .7) % 3.9) < .13 && faccia !== 'festa' && faccia !== 'dorme'
    };
  }
  /* i segni accanto alla testa, per le espressioni che la goccia non ha */
  function disegnaSegno(st) {
    if (!segno || st.alfa < .5) return;
    const su = -24 * st.nub - st.jump + st.cade;
    ctx.save();
    ctx.globalAlpha = Math.min(1, (st.t - facciaDa) * 4);
    if (segno === 'domanda') {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accento') || '#0b7f91';
      ctx.font = '700 26px Fraunces, Georgia, serif'; ctx.textAlign = 'center';
      ctx.fillText('?', 122, 46 + su + Math.sin(st.t * 3) * 2);
    } else if (segno === 'goccia' || segno === 'lacrima') {
      const x = segno === 'goccia' ? 112 : 58, y = (segno === 'goccia' ? 58 : 100) + su + ((st.t - facciaDa) * 14 % 10);
      ctx.fillStyle = 'rgba(64,150,230,.9)';
      ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.quadraticCurveTo(x + 5, y + 1, x, y + 3.5); ctx.quadraticCurveTo(x - 5, y + 1, x, y - 7); ctx.fill();
    } else if (segno === 'scintille') {
      ctx.fillStyle = '#f5b841';
      [[26, 44, 0], [124, 56, 1.3], [118, 26, 2.4]].forEach(([x, y, f]) => {
        const r = 6 * Math.max(.2, Math.abs(Math.sin(st.t * 3 + f)));
        ctx.beginPath(); ctx.moveTo(x, y + su - r); ctx.quadraticCurveTo(x, y + su, x + r, y + su); ctx.quadraticCurveTo(x, y + su, x, y + su + r); ctx.quadraticCurveTo(x, y + su, x - r, y + su); ctx.quadraticCurveTo(x, y + su, x, y + su - r); ctx.fill();
      });
    }
    ctx.restore();
  }
  /* «z» che salgono mentre dorme (sul cubetto la faccia non basta) */
  function disegnaZeta(t) {
    if (!dorme) return;
    ctx.save(); ctx.fillStyle = 'rgba(120,150,190,.85)'; ctx.textAlign = 'center';
    for (let i = 0; i < 2; i++) {
      const f = ((t * .5 + i * .5) % 1);
      ctx.globalAlpha = Math.sin(Math.PI * f); ctx.font = '700 ' + (11 + 6 * f).toFixed(1) + 'px Lexend, sans-serif';
      ctx.fillText('z', 116 + 10 * f, 34 - 22 * f);
    }
    ctx.restore();
  }
  function misura() {
    if (!tela) return 1;
    const r = tela.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (tela.width !== w || tela.height !== h) { tela.width = w; tela.height = h; }
    return w / LW;
  }
  function disegna() {
    if (!ctx || !window.CVIDEO || !CVIDEO.drawStilla) return;
    const k = misura(), t = ora();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, tela.width, tela.height);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const st = fotogramma(t);
    try { CVIDEO.drawStilla(ctx, st); } catch (e) { /* un fotogramma storto non deve fermare il sito */ }
    disegnaSegno(st); disegnaZeta(t);
  }
  /* il ciclo gira solo quando serve: ~30 fotogrammi al secondo mentre qualcosa si muove, ~12 a riposo */
  function ciclo(ts) {
    if (!inCorso) return;
    if (document.hidden || !radice || radice.hidden) { inCorso = false; return; }
    const t = ora(), attivo = t - facciaDa < 2 || t < parlaFino || t - stato.da0 < 1.6 || (pioggia && t < pioggia[1] + .5) || t - entrata < 1.2 || segno || Math.abs(mira[0] - guardo[0]) + Math.abs(mira[1] - guardo[1]) > .05;
    if (ts - ultimoDisegno >= (attivo ? 33 : 80)) { ultimoDisegno = ts; disegna(); }
    requestAnimationFrame(ciclo);
  }
  function avvia() { if (!pronta) return; if (!moto()) { disegna(); return; } if (!inCorso) { inCorso = true; requestAnimationFrame(ciclo); } }

  /* ---------- espressioni ---------- */
  function espressione(nome, perQuanto) {
    if (!pronta) return;
    let f = nome, s = null;
    if (ALIAS[nome]) { f = ALIAS[nome][0]; s = ALIAS[nome][1]; }
    if (FACCE.indexOf(f) < 0) f = 'neutro';
    clearTimeout(timerFaccia);
    faccia = f; segno = s; facciaDa = ora();
    avvia();
    if (perQuanto) timerFaccia = setTimeout(() => espressione('neutro'), perQuanto);
  }
  function muoviBocca(secondi) { parlaFino = ora() + secondi; avvia(); }

  /* gli occhi seguono il puntatore (solo con il mouse) */
  function guarda(ev) {
    if (!tela || ev.pointerType === 'touch' || dorme) return;
    const r = tela.getBoundingClientRect(); if (!r.width) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height * .6;
    const dx = Math.max(-1, Math.min(1, (ev.clientX - cx) / 260)), dy = Math.max(-1, Math.min(1, (ev.clientY - cy) / 220));
    mira = [2 + dx * 3.6, -1.5 + dy * 3]; avvia();
  }
  /* si addormenta dopo 75 s e gela; si sveglia sciogliendosi */
  function sveglia() {
    clearTimeout(timerSonno);
    if (dorme) { dorme = false; diventa('liquida'); espressione('sorpreso', 1100); }
    timerSonno = setTimeout(() => { if (aperta()) return sveglia(); dorme = true; clearTimeout(timerFaccia); faccia = 'dorme'; segno = null; facciaDa = ora(); diventa('ghiaccio'); }, 75000);
  }

  function monta(contenitore) {
    radice = document.createElement('div');
    radice.className = 'mascotte';
    radice.innerHTML = '<div class="mascotte-bolla" hidden><div class="mascotte-bolla-tipo"></div><div class="mascotte-bolla-testo"></div><div class="mascotte-bolla-azioni"></div></div>' +
      '<button class="mascotte-figura" type="button" aria-label="Stilla, la mascotte: tocca per un consiglio"><canvas class="mascotte-tela" aria-hidden="true"></canvas></button>';
    contenitore.appendChild(radice);
    bolla = radice.querySelector('.mascotte-bolla');
    tipoEl = radice.querySelector('.mascotte-bolla-tipo');
    testoEl = radice.querySelector('.mascotte-bolla-testo');
    azioniEl = radice.querySelector('.mascotte-bolla-azioni');
    figura = radice.querySelector('.mascotte-figura');
    tela = radice.querySelector('canvas'); ctx = tela.getContext('2d');
    bolla.addEventListener('pointerdown', () => clearTimeout(timerChiusura));
    bolla.addEventListener('click', ev => { if (document.body.classList.contains('in-lab') && !ev.target.closest('.mascotte-azione')) chiudiBolla(); });
    t0 = performance.now(); pronta = true;
    if (!moto()) entrata = -5;
    window.addEventListener('pointermove', ev => { guarda(ev); if (dorme) sveglia(); }, { passive: true });
    ['pointerdown', 'keydown', 'scroll'].forEach(t => window.addEventListener(t, sveglia, { passive: true }));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) avvia(); });
    window.addEventListener('resize', () => { if (!inCorso) disegna(); });
    /* i font dei segni e lo schermo pronto: il primo disegno dopo il caricamento */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => avvia());
    sveglia(); avvia();
    return radice;
  }

  /* ---- i fumetti ----
     Un testo lungo si spezza in più fumetti brevi, sfogliabili (‹ 2/4 ›), invece di un blocco unico.
     Quando Stilla parla da sola (spontaneo, il caso normale) il fumetto è compatto, mostra solo il primo
     pezzo e si chiude da solo; se c'era altro, compare «Dimmi di più». Quando è lo studente a
     chiedere (opz.chiesto) i pezzi sono un po' più lunghi e il fumetto resta finché non lo chiude.
     REGOLA: Stilla non parla mai da sola. Un fumetto si apre solo se lo studente lo chiede
     (opz.chiesto: tocco sulla mascotte, «Dimmi di più», un pulsante di aiuto) o se risponde a una sua
     azione (opz.azione: fine livello o errore in un laboratorio, conferma di un comando appena dato).
     Una chiamata senza nessuno dei due è spontanea: niente fumetto, cambia solo la faccia. */
  const LIM_SPONTANEO = 120, LIM_CHIESTO = 230;
  const lunghezza = h => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').length;
  function spezza(html, lim) {
    /* prima i paragrafi, poi le frasi dentro i paragrafi lunghi (mai dentro un tag) */
    const paragrafi = /<p[\s>]/.test(html) ? (html.match(/<p[\s\S]*?<\/p>/g) || [html]).map(x => x.replace(/^<p[^>]*>|<\/p>$/g, '')) : [html];
    const frasi = [];
    paragrafi.forEach(par => {
      if (lunghezza(par) <= lim) { frasi.push('\x01' + par); return; }
      const pezzi = []; let buf = '', dentro = 0;
      for (let i = 0; i < par.length; i++) {
        const c = par[i]; buf += c;
        if (c === '<') dentro++; else if (c === '>') dentro = Math.max(0, dentro - 1);
        if (!dentro && /[.!?]/.test(c) && /\s/.test(par[i + 1] || '') && /[A-ZÀ-Ý«"(0-9$<]/.test((par.slice(i + 1).replace(/^\s+/, '')[0]) || '')) { pezzi.push(buf.trim()); buf = ''; }
      }
      if (buf.trim()) pezzi.push(buf.trim());
      pezzi.forEach((f, i) => frasi.push((i ? '' : '\x01') + f));
    });
    const pagine = []; let cur = '';
    /* \x01 segna l'inizio di un paragrafo: nello stesso fumetto diventa un a capo */
    frasi.forEach(f => { const nuovo = f[0] === '\x01'; f = f.replace(/^\x01/, ''); if (cur && lunghezza(cur) + lunghezza(f) > lim) { pagine.push(cur); cur = f; } else cur = cur ? cur + (nuovo ? '</p><p>' : ' ') + f : f; });
    if (cur) pagine.push(cur);
    return pagine.length ? pagine : [html];
  }
  const escapa = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* dici(testo, {tipo:'suggerimento'|'aneddoto'|'commento'|'errore', titolo, html, chiesto, azione, azioni:[{testo, fn}], durata, espressione}) */
  function dici(testo, opz) {
    opz = opz || {};
    if (!radice) return;
    const modo = opz.chiesto ? 'chiesto' : opz.azione ? 'azione' : 'spontaneo';
    if (modo === 'spontaneo') { if (!aperta() && !dorme) espressione(opz.espressione || 'neutro', 2200); return; }
    clearTimeout(timerChiusura);
    if (dorme) sveglia();
    const html = opz.html ? String(testo) : escapa(testo);
    let chiesto = !!opz.chiesto;
    let pagine = spezza(html, chiesto ? LIM_CHIESTO : LIM_SPONTANEO), k = 0;
    const etichetta = opz.titolo || ({ suggerimento: 'Un suggerimento', aneddoto: 'Lo sapevi?', errore: 'Occhio' }[opz.tipo] || '');
    tipoEl.textContent = etichetta; tipoEl.hidden = !etichetta;
    bolla.dataset.tipo = opz.tipo || 'commento';
    bolla.classList.toggle('compatta', !chiesto);
    const mostra = () => {
      testoEl.innerHTML = '<p>' + pagine[k] + '</p>';
      azioniEl.innerHTML = '';
      const aggiungi = (testoB, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'mascotte-azione' + (cls ? ' ' + cls : ''); b.innerHTML = testoB; b.addEventListener('click', ev => { ev.stopPropagation(); fn(); }); azioniEl.appendChild(b); return b; };
      if (!chiesto && pagine.length > 1) {
        aggiungi('Dimmi di più ›', () => { chiesto = true; bolla.classList.remove('compatta'); clearTimeout(timerChiusura); pagine = spezza(html, LIM_CHIESTO); k = Math.min(1, pagine.length - 1); mostra(); muoviBocca(.8); });
      } else if (pagine.length > 1) {
        aggiungi('‹', () => { k = Math.max(0, k - 1); mostra(); }, 'mascotte-freccia').disabled = k === 0;
        const n = document.createElement('span'); n.className = 'mascotte-pagina'; n.textContent = (k + 1) + '/' + pagine.length; azioniEl.appendChild(n);
        aggiungi('›', () => { k = Math.min(pagine.length - 1, k + 1); mostra(); muoviBocca(.8); }, 'mascotte-freccia').disabled = k === pagine.length - 1;
      }
      if (k === pagine.length - 1 || !chiesto) (opz.azioni || []).forEach(a => aggiungi(escapa(a.testo), a.fn));
      aggiungi('✕', chiudiBolla, 'mascotte-chiudi').setAttribute('aria-label', 'Chiudi');
      if (opz.dopoRender) opz.dopoRender(testoEl);
    };
    mostra();
    bolla.hidden = false;
    bolla.classList.remove('appare'); void bolla.offsetWidth; bolla.classList.add('appare');
    espressione(opz.espressione || 'neutro');
    muoviBocca(Math.min(2.4, .6 + lunghezza(pagine[0]) / 70));
    /* chi parla da solo non resta lì a occupare lo schermo: si chiude, a meno che lo studente non lo tocchi */
    /* nei laboratori il fumetto resta finché non lo si tocca o non si cambia livello */
    if (document.body.classList.contains('in-lab')) return;
    const durata = opz.durata || (!chiesto ? 3500 + 45 * lunghezza(pagine[0]) : 0);
    if (durata && !chiesto) timerChiusura = setTimeout(chiudiBolla, durata);
    else if (opz.durata) timerChiusura = setTimeout(chiudiBolla, opz.durata);
  }

  /* reagisci(evento, testo?): la faccia cambia secondo quello che è successo. Mai un fumetto: le reazioni
     alle risposte sono solo espressione e animazione (il testo, se arriva, si ignora). */
  function reagisci(evento, testo) {
    if (!pronta || (radice && radice.hidden)) return;
    if (dorme) sveglia();
    switch (evento) {
      case 'giusto': espressione(Math.random() < 0.25 ? 'occhiolino' : 'felice', 1800); break;
      case 'sbagliato': espressione('sorpreso'); setTimeout(() => { if (faccia === 'sorpreso') espressione('pensa', 2200); }, 650); break;
      case 'sbagliato-ancora': espressione('confuso', 2600); break;
      case 'passo': espressione('pensa', 1100); break;
      case 'livello': espressione('festa', 2400); break;
      case 'traguardo': {
        /* la festa grande: diventa nuvola, fa due gocce di pioggia, e torna goccia */
        clearTimeout(timerStato);
        diventa('nuvola'); const t = ora(); pioggia = [t + 1.4, t + 4.2];
        timerStato = setTimeout(() => { diventa('liquida'); espressione('festa', 1800); }, 4600);
        espressione('festa', 4400);
        break;
      }
      case 'ops': espressione('ops', 1600); break;
      default: espressione(evento, 1600);
    }
  }

  function chiudiBolla() { if (bolla) bolla.hidden = true; clearTimeout(timerChiusura); parlaFino = 0; if (!dorme) espressione('neutro'); }
  function visibile(si) { if (radice) { radice.hidden = !si; if (si) avvia(); } }
  function aperta() { return !!(bolla && !bolla.hidden); }

  window.CMASC = { monta, dici, espressione, reagisci, chiudi: chiudiBolla, visibile, aperta };
})();
