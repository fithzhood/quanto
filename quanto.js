/* Quanto — motore del sito: router, contenuti, flashcard, esercizi, quiz, mascotte, progressi.
   Preso da Compasso (compasso.js) e portato alla fisica: aree con l'anno, galleria dei fisici, risposte con le unità. */
(function () {
  'use strict';

  /* Safari < 16 non ha roundRect sulla tela, che i video e Stilla usano dappertutto: un sostituto con gli archi */
  if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    let q = Array.isArray(r) ? r[0] : (r || 0); q = Math.max(0, Math.min(q, Math.abs(w) / 2, Math.abs(h) / 2));
    this.moveTo(x + q, y); this.arcTo(x + w, y, x + w, y + h, q); this.arcTo(x + w, y + h, x, y + h, q); this.arcTo(x, y + h, x, y, q); this.arcTo(x, y, x + w, y, q); this.closePath(); return this;
  };

  /* Safari < 13.1 (iPad vecchi) non ha ResizeObserver, che i laboratori usano per adattarsi allo schermo:
     un sostituto che richiama al ridimensionamento della finestra e al cambio di orientamento */
  if (!window.ResizeObserver) window.ResizeObserver = function (cb) {
    const bersagli = [], ro = this;
    const chiama = () => { if (bersagli.length) cb(bersagli.map(t => ({ target: t, contentRect: t.getBoundingClientRect() })), ro); };
    let attesa = 0; const presto = () => { clearTimeout(attesa); attesa = setTimeout(chiama, 60); };
    this.observe = t => { if (bersagli.indexOf(t) < 0) bersagli.push(t); if (bersagli.length === 1) { addEventListener('resize', presto); addEventListener('orientationchange', presto); } presto(); };
    this.unobserve = t => { const i = bersagli.indexOf(t); if (i >= 0) bersagli.splice(i, 1); };
    this.disconnect = () => { bersagli.length = 0; removeEventListener('resize', presto); removeEventListener('orientationchange', presto); clearTimeout(attesa); };
  };

  const IND = window.QUANTO_INDICE;
  const VER_TAG = ((document.currentScript && document.currentScript.src || '').match(/\?v=\d+/) || [''])[0];
  const VERSIONE = (VER_TAG.match(/\d+/) || ['dev'])[0];
  const app = document.getElementById('app');
  const GIORNO = 86400000;

  /* =====================================================================
     STATO PERSISTENTE
     ===================================================================== */
  const CHIAVE = 'quanto.v1';   /* Compasso usa compasso.v1 sullo stesso dominio: le memorie restano separate */
  const statoBase = () => ({ progressi: {}, carte: {}, carteMie: {}, selezione: {}, impostazioni: { tema: 'auto', mascotte: true, mescola: true }, ultimo: null });
  let stato = statoBase();
  try { const s = localStorage.getItem(CHIAVE); if (s) stato = Object.assign(statoBase(), JSON.parse(s)); } catch (e) { /* niente memoria: si va avanti */ }
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(stato)); } catch (e) { /* ignora */ } }
  function progresso(id) { return stato.progressi[id] || (stato.progressi[id] = { eserciziFatti: [], quizMigliore: null, quizTot: null, visitato: null }); }

  /* =====================================================================
     TEMA
     ===================================================================== */
  function applicaTema() {
    const t = stato.impostazioni.tema;
    const scuro = t === 'scuro' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.tema = scuro ? 'scuro' : 'chiaro';
    const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = scuro ? '#0e1a1e' : '#f1f5f3';
  }
  applicaTema();
  /* lettura facilitata: testo più grande e più spaziato, senza corsivi (per chi fa fatica a leggere) */
  function applicaLettura() { const si = !!stato.impostazioni.letturaFacile; document.documentElement.classList.toggle('lettura-facile', si); const b = document.getElementById('btn-lettura'); if (b) b.setAttribute('aria-pressed', si); }
  applicaLettura();
  document.getElementById('btn-lettura').addEventListener('click', () => { stato.impostazioni.letturaFacile = !stato.impostazioni.letturaFacile; salva(); applicaLettura(); if (window.CMASC) CMASC.espressione('occhiolino', 1500); });
  { const mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', applicaTema); else if (mq.addListener) mq.addListener(applicaTema); }   /* Safari < 14 conosce solo addListener */
  document.getElementById('btn-tema').addEventListener('click', (ev) => {
    const scuro = document.documentElement.dataset.tema === 'scuro';
    const cambia = () => { stato.impostazioni.tema = scuro ? 'chiaro' : 'scuro'; salva(); applicaTema(); const sel = document.querySelector('.s-tema'); if (sel) sel.value = stato.impostazioni.tema; };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return cambia();
    const r = ev.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const raggio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(cambia).ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${raggio}px at ${x}px ${y}px)`] }, { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  });

  /* =====================================================================
     REGISTRO DEGLI ARGOMENTI (caricati al volo)
     ===================================================================== */
  const registro = {}, inCorso = {}, registroLab = {}, labInCorso = {};
  window.QUANTO = { registra(a) { registro[a.id] = a; }, registraLab(l) { registroLab[l.id] = l; } };
  function voce(id) { return IND.argomenti.find(a => a.id === id); }
  function area(id) { return IND.aree.find(a => a.id === id); }
  function labsDi(argId) { return (IND.laboratori || []).filter(l => l.argomento === argId); }
  function caricaLab(id) {
    if (registroLab[id]) return Promise.resolve(registroLab[id]);
    if (labInCorso[id]) return labInCorso[id];
    labInCorso[id] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'laboratori/' + id + '.js' + VER_TAG;
      s.onload = () => { delete labInCorso[id]; registroLab[id] ? res(registroLab[id]) : rej(new Error('non registrato')); };
      s.onerror = () => { delete labInCorso[id]; rej(new Error('file mancante')); };
      document.head.appendChild(s);
    });
    return labInCorso[id];
  }
  let smontaLab = null;   /* pulizia del laboratorio aperto, chiamata a ogni cambio di pagina */
  function chiudiLab() { if (smontaLab) { try { smontaLab(); } catch (e) { /* niente */ } smontaLab = null; } if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
  function caricaArgomento(id) {
    if (registro[id]) return Promise.resolve(registro[id]);
    if (inCorso[id]) return inCorso[id];
    inCorso[id] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'argomenti/' + id + '.js' + VER_TAG;
      s.onload = () => { delete inCorso[id]; registro[id] ? res(registro[id]) : rej(new Error('non registrato')); };
      s.onerror = () => { delete inCorso[id]; rej(new Error('file mancante')); };
      document.head.appendChild(s);
    });
    return inCorso[id];
  }

  /* =====================================================================
     UTILITÀ
     ===================================================================== */
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const mescola = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const scegli = a => a[Math.floor(Math.random() * a.length)];
  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  const ICONE = {
    libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    lampadina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
    carte: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></svg>',
    penna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    spunta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    formule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 12h10M4 19h16"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3"/><path d="M7.5 15h9"/></svg>',
    schermo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    cerca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    mescola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
    sinistra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    destra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    gira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>'
  };
  const SCHEDE = [['teoria', 'Teoria', 'libro'], ['esempi', 'Esempi', 'lampadina'], ['flashcard', 'Flashcard', 'carte'], ['esercizi', 'Esercizi', 'penna'], ['quiz', 'Quiz', 'spunta'], ['formulario', 'Formulario', 'formule']];

  /* =====================================================================
     MINI-MARKDOWN + KATEX
     ===================================================================== */
  /* \evid{…} evidenzia la parte che cambia (evidenziatore che passa), \evidb{…} con il secondo colore */
  const KATEX_OPZ = { throwOnError: false, strict: 'ignore', output: 'html', macros: { '\\evid': '\\htmlClass{evid}{#1}', '\\evidb': '\\htmlClass{evid evid2}{#1}' }, trust: c => c.command === '\\htmlClass' };
  function tex(src, display) {
    try { return katex.renderToString(src, Object.assign({}, KATEX_OPZ, { displayMode: !!display, macros: Object.assign({}, KATEX_OPZ.macros) })); }
    catch (e) { return '<code>' + esc(src) + '</code>'; }
  }
  function inline(s) {
    return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\w)/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  const RE_NUM_UNITA = /(\d) (?=(?:km\/h|m\/s²|m\/s|kg\/m³|J\/kg|N\/m|°C|°F|kWh|MWh|kcal|cal|kJ|MJ|kW|MW|kPa|hPa|MPa|kHz|MHz|GHz|kV|mA|μA|kΩ|MΩ|μF|nF|pF|nm|μm|mm|cm|dm|km|mg|kg|ms|μs|min|eV|keV|MeV|GeV|mol|rad|lux|Hz|Pa|dB|Wh|UA|ly|pc|kpc|Mpc|m²|m³|cm²|cm³|dm³|mL|m|g|s|h|N|J|W|V|A|Ω|T|K|L|C|F|%|anni|anno|giorni|ore|minuti|secondi|metri|chilometri|chilogrammi|grammi|newton|joule|watt|volt|ampere|ohm|kelvin|pascal|hertz|litri|gradi)(?![A-Za-zà-ù0-9²³]))/g;
  function md(src) {
    if (src == null) return '';
    const mat = [];
    let s = String(src);
    /* righe di derivazione "~ LATEX :: commento": il LaTeX va reso prima dell'escape */
    s = s.replace(/^[ \t]*~[ \t]+(.+?)(?:[ \t]+::[ \t]+(.*))?[ \t]*$/gm, (_, t, c) => { mat.push(tex(t, true)); return '~ \x01' + (mat.length - 1) + '\x01' + (c ? ' \x02 ' + c : ''); });
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { mat.push(tex(t, true)); return '' + (mat.length - 1) + ''; });
    s = s.replace(/\$([^$\n]+?)\$/g, (_, t) => { mat.push(tex(t, false)); return '' + (mat.length - 1) + ''; });
    s = esc(s);
    /* fra un numero e la sua unità uno spazio che non va a capo: «20 m/s» non si spezza in «20» e «m/s» */
    s = s.replace(RE_NUM_UNITA, '$1\u00a0');
    const righe = s.split('\n'); const out = []; let par = [], lista = null, tipoLista = '', quote = null, tipoQuote = '', tab = null;
    const chiudiPar = () => { if (par.length) { out.push('<p>' + inline(par.join(' ')) + '</p>'); par = []; } };
    const chiudiLista = () => { if (lista) { out.push('<' + tipoLista + '>' + lista.map(x => '<li>' + inline(x) + '</li>').join('') + '</' + tipoLista + '>'); lista = null; } };
    const chiudiQuote = () => { if (quote) { const cls = { '!': 'attenzione', '*': 'idea', '': 'nota' }[tipoQuote]; out.push('<div class="riquadro ' + cls + '"><p>' + inline(quote.join(' ')) + '</p></div>'); quote = null; } };
    const chiudiTab = () => {
      if (!tab) return;
      const righeT = tab.filter(r => !/^\|?\s*:?-{2,}/.test(r)).map(r => r.replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim())));
      let html = '<div class="tabella-scroll"><table>';
      righeT.forEach((r, i) => { const tag = i === 0 ? 'th' : 'td'; html += '<tr>' + r.map(c => '<' + tag + '>' + c + '</' + tag + '>').join('') + '</tr>'; });
      out.push(html + '</table></div>'); tab = null;
    };
    /* derivazione: righe "~ formula :: commento" consecutive, svelate un passo alla volta */
    let der = null, prova = null;
    const chiudiDer = () => {
      if (!der) return;
      out.push('<div class="derivazione"><ol class="d-passi">' + der.map(([f, c]) => '<li class="d-passo"><div class="d-f">' + f + '</div>' + (c ? '<div class="d-c">' + inline(c) + '</div>' : '') + '</li>').join('') + '</ol></div>');
      der = null;
    };
    /* prova tu: "?? domanda", poi "[x] giusta" / "[ ] sbagliata", poi "=> spiegazione" (senza opzioni: risposta da svelare) */
    const chiudiProva = () => {
      if (!prova) return;
      const P = prova; prova = null;
      const ops = P.opzioni.map(o => '<button type="button" class="prova-op"' + (o.ok ? ' data-ok="1"' : '') + '><span class="prova-lettera"></span><span>' + inline(o.t) + '</span></button>').join('');
      out.push('<div class="prova" data-modo="' + (P.opzioni.length ? 'scelta' : 'rivela') + '"><div class="prova-testa"><span class="prova-ico">?</span>Prova tu</div><div class="prova-domanda"><p>' + inline(P.domanda.join(' ')) + '</p></div>' +
        (P.opzioni.length ? '<div class="prova-opzioni">' + ops + '</div>' : '<button type="button" class="btn piccolo prova-rivela">Pensaci, poi tocca qui</button>') +
        '<div class="prova-spiega"><p>' + inline(P.spiega.join(' ')) + '</p></div></div>');
    };
    const chiudiTutto = () => { chiudiPar(); chiudiLista(); chiudiQuote(); chiudiTab(); chiudiDer(); chiudiProva(); };
    for (let riga of righe) {
      const r = riga.trim();
      let m;
      if (!r) { chiudiTutto(); continue; }
      if ((m = r.match(/^~ (\x01\d+\x01)(?: \x02 (.*))?$/))) { if (!der) { chiudiTutto(); der = []; } der.push([m[1], m[2] || '']); continue; }
      if (der) chiudiDer();
      if ((m = r.match(/^\?\?\s+(.+)$/))) { chiudiTutto(); prova = { domanda: [m[1]], opzioni: [], spiega: [], fase: 'domanda' }; continue; }
      if (prova) {
        if ((m = r.match(/^\[([ xX])\]\s+(.+)$/))) { prova.opzioni.push({ ok: m[1] !== ' ', t: m[2] }); prova.fase = 'opzioni'; continue; }
        if ((m = r.match(/^=&gt;\s*(.*)$/))) { prova.spiega.push(m[1]); prova.fase = 'spiega'; continue; }
        if (prova.fase === 'domanda') prova.domanda.push(r); else if (prova.fase === 'spiega') prova.spiega.push(r); else prova.opzioni[prova.opzioni.length - 1].t += ' ' + r;
        continue;
      }
      if ((m = r.match(/^\[\[grafico:([^\]]+)\]\]$/))) { chiudiTutto(); out.push('<div class="grafico-slot" data-grafico="' + esc(m[1]) + '"></div>'); continue; }
      if ((m = r.match(/^\[\[animazione:([^\]]+)\]\]$/))) { chiudiTutto(); out.push('<div class="grafico-slot" data-animazione="' + esc(m[1]) + '"></div>'); continue; }
      if ((m = r.match(/^\[\[video:([^\]]+)\]\]$/))) { chiudiTutto(); out.push('<div class="video-slot" data-video="' + esc(m[1]) + '"></div>'); continue; }
      if ((m = r.match(/^###\s+(.+)$/))) { chiudiTutto(); out.push('<h4>' + inline(m[1]) + '</h4>'); continue; }
      if ((m = r.match(/^-\s+(.+)$/))) { chiudiPar(); chiudiQuote(); chiudiTab(); if (lista && tipoLista !== 'ul') chiudiLista(); tipoLista = 'ul'; (lista = lista || []).push(m[1]); continue; }
      if ((m = r.match(/^\d+[.)]\s+(.+)$/))) { chiudiPar(); chiudiQuote(); chiudiTab(); if (lista && tipoLista !== 'ol') chiudiLista(); tipoLista = 'ol'; (lista = lista || []).push(m[1]); continue; }
      if ((m = r.match(/^&gt;([!*]?)\s?(.*)$/))) { chiudiPar(); chiudiLista(); chiudiTab(); if (quote && tipoQuote !== m[1]) chiudiQuote(); tipoQuote = m[1]; (quote = quote || []).push(m[2]); continue; }
      if (/^\|/.test(r)) { chiudiPar(); chiudiLista(); chiudiQuote(); (tab = tab || []).push(r); continue; }
      if (lista) { lista[lista.length - 1] += ' ' + r; continue; }
      if (quote) { quote.push(r); continue; }
      chiudiTab(); par.push(r);
    }
    chiudiTutto();
    return out.join('\n').replace(/(\d+)/g, (_, i) => mat[+i]);
  }
  function montaGrafici(radice, arg) {
    radice.querySelectorAll('.grafico-slot').forEach(slot => {
      if (slot.dataset.animazione) { try { CGRAF.render({ tipo: 'animazione', nome: slot.dataset.animazione }, slot); } catch (e) { slot.textContent = 'Animazione non disponibile (' + e.message + ')'; } return; }
      const spec = arg && arg.grafici && arg.grafici[slot.dataset.grafico];
      if (spec) { try { CGRAF.render(spec, slot); } catch (e) { slot.textContent = 'Grafico non disponibile (' + e.message + ')'; } }
      else slot.textContent = 'Grafico "' + slot.dataset.grafico + '" mancante';
    });
    radice.querySelectorAll('.video-slot').forEach(slot => { if (window.CVIDEO) CVIDEO.monta(slot, slot.dataset.video); else slot.textContent = 'Video non disponibile'; });
    radice.querySelectorAll('.derivazione').forEach(montaDerivazione);
    radice.querySelectorAll('.prova').forEach(montaProva);
  }
  /* derivazione svelata un passo alla volta; con la stampa o senza animazioni si vede tutta */
  function montaDerivazione(d) {
    const passi = [...d.querySelectorAll('.d-passo')];
    if (passi.length < 2 || d.dataset.pronta) return;
    d.dataset.pronta = '1';
    const barra = h(`<div class="d-barra"><button type="button" class="btn piccolo primario d-avanti">Passo successivo ${ICONE.destra}</button><button type="button" class="btn piccolo d-tutto">Mostra tutto</button><span class="d-conta"></span></div>`);
    d.appendChild(barra);
    const avanti = barra.querySelector('.d-avanti'), tutto = barra.querySelector('.d-tutto'), conta = barra.querySelector('.d-conta');
    let n = 1;
    const aggiorna = (nuovo) => {
      passi.forEach((p, i) => { p.classList.toggle('nascosto', i >= n); p.classList.toggle('ultimo', i === n - 1); if (i === nuovo) { p.classList.remove('entra'); void p.offsetWidth; p.classList.add('entra'); } });
      conta.textContent = n + ' di ' + passi.length;
      const fine = n >= passi.length;
      avanti.innerHTML = fine ? 'Ricomincia' : 'Passo successivo ' + ICONE.destra;
      avanti.classList.toggle('primario', !fine); tutto.hidden = fine;
      d.classList.toggle('finita', fine);
    };
    d.classList.add('a-passi');
    avanti.addEventListener('click', () => { if (n >= passi.length) { n = 1; aggiorna(0); } else { n++; aggiorna(n - 1); CMASC.reagisci(n >= passi.length ? 'giusto' : 'passo'); } });
    tutto.addEventListener('click', () => { n = passi.length; aggiorna(-1); });
    aggiorna(-1);
  }
  function montaProva(p) {
    if (p.dataset.pronta) return; p.dataset.pronta = '1';
    const spiega = p.querySelector('.prova-spiega');
    const ops = [...p.querySelectorAll('.prova-op')];
    ops.forEach((b, i) => { b.querySelector('.prova-lettera').textContent = 'ABCDEF'[i]; });
    if (p.dataset.modo === 'scelta') {
      /* le opzioni si rimescolano, così la giusta non sta sempre nello stesso posto */
      const cont = p.querySelector('.prova-opzioni'); mescola(ops).forEach((b, i) => { b.querySelector('.prova-lettera').textContent = 'ABCDEF'[i]; cont.appendChild(b); });
      ops.forEach(b => b.addEventListener('click', () => {
        if (p.classList.contains('risolta')) return;
        const ok = !!b.dataset.ok;
        b.classList.add(ok ? 'giusta' : 'sbagliata');
        if (ok) { p.classList.add('risolta'); ops.forEach(o => { o.disabled = true; }); spiega.classList.add('aperta'); festa(b); CMASC.reagisci('giusto'); }
        else { b.disabled = true; CMASC.reagisci('sbagliato'); if (ops.filter(o => o.disabled).length >= ops.length - 1) { ops.forEach(o => { if (o.dataset.ok) o.classList.add('giusta'); o.disabled = true; }); p.classList.add('risolta'); spiega.classList.add('aperta'); } }
      }));
    } else {
      const btn = p.querySelector('.prova-rivela');
      btn.addEventListener('click', () => { spiega.classList.add('aperta'); p.classList.add('risolta'); btn.hidden = true; CMASC.reagisci('passo'); });
    }
  }

  /* =====================================================================
     MOVIMENTO: comparsa allo scorrimento, cursore delle schede, barra di
     lettura, coriandoli. Tutto spento con prefers-reduced-motion.
     ===================================================================== */
  const MOTO = !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window;
  if (MOTO) document.documentElement.classList.add('js-rivela');
  const RIVELA = '.tessera, .tessera-lab, .area-testa, .sezione, .intro, .in-breve, .riquadro, .cg-figura, .derivazione, .prova, .esempio, .formula, .esercizio, .mat, .prosa > .tabella-scroll, .sezione p > .katex-display, .quiz-avvio, .mat-dettaglio';
  let osservatore = null;
  function mostraEl(el) {
    el.classList.add('visibile');
    setTimeout(() => el.classList.add('fatto'), 1500);   /* libera le transizioni di hover, e fa da rete se il browser congela */
    el.querySelectorAll('.cg-curva').forEach(c => {
      if (c.dataset.tracciata || c.getAttribute('stroke-dasharray')) return; c.dataset.tracciata = '1';
      c.setAttribute('pathLength', '1'); c.classList.add('traccia');
      setTimeout(() => { c.classList.remove('traccia'); c.removeAttribute('pathLength'); }, 1800);
    });
    el.querySelectorAll('.cg-barra').forEach((b, i) => { if (b.dataset.cresciuta) return; b.dataset.cresciuta = '1'; b.style.setProperty('--i', i); b.classList.add('cresce'); setTimeout(() => b.classList.remove('cresce'), 1800); });
    el.querySelectorAll('[data-conta]').forEach(contaSu);
  }
  function animaPagina(radice) {
    if (!MOTO) { radice.querySelectorAll('[data-conta]').forEach(b => { b.textContent = b.dataset.conta; }); return; }
    if (!osservatore) osservatore = new IntersectionObserver(voci => voci.forEach(v => { if (v.isIntersecting) { osservatore.unobserve(v.target); mostraEl(v.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    radice.querySelectorAll(RIVELA).forEach(el => {
      if (el.dataset.rivela) return; el.dataset.rivela = '1';
      const par = el.parentElement;
      if (par && /griglia|formulario/.test(par.className)) el.style.setProperty('--i', Math.min([...par.children].indexOf(el), 8));
      el.classList.add('rivela'); osservatore.observe(el);
    });
    radice.querySelectorAll('[data-conta]:not([data-contato])').forEach(b => { if (!b.closest('.rivela')) contaSu(b); });
  }
  function contaSu(b) {
    if (b.dataset.contato) return; b.dataset.contato = '1';
    const fine = +b.dataset.conta || 0; if (!fine || !MOTO) { b.textContent = fine; return; }
    const t0 = performance.now(), durata = Math.min(1200, 500 + fine * 40);
    const passo = (t) => { const k = Math.min(1, (t - t0) / durata); b.textContent = Math.round(fine * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
    setTimeout(() => { b.textContent = fine; }, durata + 400);
  }
  /* ogni volta che il contenuto cambia, si guardano i pezzi nuovi */
  let animaInCoda = false;
  new MutationObserver(() => { if (animaInCoda) return; animaInCoda = true; requestAnimationFrame(() => { animaInCoda = false; animaPagina(app); }); }).observe(app, { childList: true, subtree: true });

  /* il cursore che scivola sotto la scheda attiva */
  let cursore = null;
  function cursoreSchede(anima) {
    const navInt = app.querySelector('.schede-nav-int'); if (!navInt) return;
    const att = navInt.querySelector('.scheda-tab.attiva'); if (!att) return;
    let c = navInt.querySelector('.tab-cursore'); if (!c) { c = document.createElement('span'); c.className = 'tab-cursore'; navInt.prepend(c); }
    const x = att.offsetLeft, w = att.offsetWidth;
    if (cursore && anima && MOTO) { c.style.transition = 'none'; c.style.transform = 'translateX(' + cursore.x + 'px)'; c.style.width = cursore.w + 'px'; void c.offsetWidth; c.style.transition = ''; }
    else c.style.transition = 'none';
    c.style.transform = 'translateX(' + x + 'px)'; c.style.width = w + 'px';
    if (!anima || !MOTO) { void c.offsetWidth; c.style.transition = ''; }
    cursore = { x, w };
  }
  window.addEventListener('resize', () => cursoreSchede(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => cursoreSchede(false));

  /* barra di lettura nella teoria */
  const lettura = document.createElement('div'); lettura.className = 'lettura'; lettura.hidden = true; lettura.innerHTML = '<i></i>'; document.body.appendChild(lettura);
  function aggiornaLettura() {
    const teoria = app.querySelector('.teoria');
    if (!teoria) { lettura.hidden = true; return; }
    const alto = teoria.getBoundingClientRect().top + scrollY, basso = alto + teoria.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, (scrollY - alto + 140) / Math.max(1, basso - alto + 140)));
    lettura.hidden = false; lettura.firstChild.style.setProperty('--p', p.toFixed(4));
  }
  let letturaInCoda = false;
  window.addEventListener('scroll', () => { if (letturaInCoda) return; letturaInCoda = true; requestAnimationFrame(() => { letturaInCoda = false; aggiornaLettura(); }); }, { passive: true });

  /* coriandoli di simboli quando una risposta è giusta */
  const SIMBOLI = ['Δ', 'λ', 'Ω', 'μ', 'π', '√', '∞', '=', '→', '°', '≈', 'ν'];
  function festa(el) {
    if (!MOTO || !el) return;
    const r = el.getBoundingClientRect(), cx = r.left + Math.min(r.width / 2, 70), cy = r.top + r.height / 2;
    for (let i = 0; i < 12; i++) {
      const c = document.createElement('span'); c.className = 'coriandolo'; c.textContent = SIMBOLI[(i + Math.floor(Math.random() * 12)) % 12];
      const ang = Math.random() * Math.PI * 2, d = 45 + Math.random() * 75;
      c.style.left = cx + 'px'; c.style.top = cy + 'px'; c.style.color = 'var(--s' + (1 + i % 4) + ')';
      c.style.setProperty('--dx', (Math.cos(ang) * d).toFixed(1) + 'px'); c.style.setProperty('--dy', (Math.sin(ang) * d - 30).toFixed(1) + 'px'); c.style.setProperty('--r', (Math.random() * 240 - 120).toFixed(0) + 'deg');
      document.body.appendChild(c); setTimeout(() => c.remove(), 1000);
    }
  }

  /* nella home: una goccia che cade nell'acqua. Le «foto» lasciate ogni stesso intervallo di tempo distano
     come 1, 3, 5, 7 (la caduta libera: s cresce come t²), e all'arrivo partono le onde. */
  function gocciaSVG() {
    const X = 104, Y0 = 18, K = 12.8, PEL = 232;          /* posizione della goccia all'istante n: Y0 + K·n² (la CSS la fa cadere di 16·K) */
    const y = n => Y0 + K * n * n;
    const forma = (cx, cy, r) => `M${cx} ${(cy - r * 1.55).toFixed(1)} C${(cx + r * .55).toFixed(1)} ${(cy - r * .7).toFixed(1)} ${cx + r} ${(cy - r * .15).toFixed(1)} ${cx + r} ${(cy + r * .35).toFixed(1)} A${r} ${r} 0 0 1 ${cx - r} ${(cy + r * .35).toFixed(1)} C${cx - r} ${(cy - r * .15).toFixed(1)} ${(cx - r * .55).toFixed(1)} ${(cy - r * .7).toFixed(1)} ${cx} ${(cy - r * 1.55).toFixed(1)}Z`;
    const foto = [0, 1, 2, 3, 4].map(n => `<path class="g-foto" style="animation-delay:${(n * .3).toFixed(1)}s" d="${forma(X, y(n), 3.8)}"/>`).join('');
    const numeri = [1, 3, 5, 7].map((d, n) => `<path class="g-graffa" style="animation-delay:${((n + 1) * .3).toFixed(1)}s" d="M${X + 10} ${(y(n) + 1).toFixed(1)} q4 0 4 4 v${Math.max(0, y(n + 1) - y(n) - 10).toFixed(1)} q0 4 -4 4"/><text class="g-num" x="${X + 22}" y="${((y(n) + y(n + 1)) / 2 + 5).toFixed(1)}" style="animation-delay:${((n + 1) * .3).toFixed(1)}s">${d}</text>`).join('');
    const onde = [0, 1, 2].map(i => `<ellipse class="g-onda" cx="${X}" cy="${PEL}" rx="100" ry="17" style="animation-delay:${(1.2 + i * .32).toFixed(2)}s"/>`).join('');
    const onda = `M-10 ${PEL} Q22 ${PEL - 4} 54 ${PEL} T118 ${PEL} T182 ${PEL} T246 ${PEL} T310 ${PEL}`;
    return `<svg viewBox="0 0 260 260" aria-hidden="true">
      <defs><radialGradient id="g-sfuma" cx=".42" cy="0" r=".45"><stop offset="0" stop-color="currentColor" stop-opacity=".26"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient>
        <linearGradient id="g-sfuma-pelo" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset=".4" stop-color="currentColor" stop-opacity=".75"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
      <path class="g-acqua" d="${onda} V300 H-10 Z"/>
      <path class="g-pelo" d="${onda}"/>
      ${foto}${numeri}${onde}
      <g class="g-cade"><path class="g-goccia" d="${forma(X, Y0, 8)}"/><ellipse class="g-luce" cx="${X - 3}" cy="${Y0 + 1}" rx="1.8" ry="3.6" transform="rotate(25 ${X - 3} ${Y0 + 1})"/></g>
      <circle class="g-schizzo g-s1" cx="${X}" cy="${PEL - 3}" r="2.8"/><circle class="g-schizzo g-s2" cx="${X}" cy="${PEL - 3}" r="2.2"/>
      <text class="g-legge" x="206" y="150">s = ½·g·t²</text>
    </svg>`;
  }

  /* per i collaudi: rende un pezzo di markdown dentro la pagina (usato da strumenti/banco.js) */
  window.QUANTO.prova = (src, dove) => { const d = frammento(src, null); (dove || app).appendChild(d); return d; };
  function frammento(src, arg) { const d = document.createElement('div'); d.className = 'prosa'; d.innerHTML = md(src); montaGrafici(d, arg); return d; }

  /* =====================================================================
     ROUTER
     ===================================================================== */
  let paginaCorrente = null, argCorrente = null, labCorrente = null;
  function naviga(hash) { location.hash = hash; }
  let schedaCorrente = null;
  /* la sezione della teoria: si scorre senza ridisegnare la pagina (un video che va non si ferma, i «Prova tu» restano) */
  function scorriA(ancora) { const t = document.getElementById('sez-' + ancora); if (t) t.scrollIntoView({ behavior: MOTO ? 'smooth' : 'auto', block: 'start' }); return !!t; }
  function route() {
    const parti = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const p = parti[0] || '';
    if (p === 'argomento' && parti[1] && parti[1] === argCorrente && (parti[2] || 'teoria') === schedaCorrente && parti[3] && parti[2] !== 'lab' && app.querySelector('#pannello') && scorriA(parti[3])) return;
    CMASC.chiudi(); chiudiLab();
    const inLab = p === 'argomento' && parti[2] === 'lab' && !!parti[3];
    document.body.classList.toggle('in-lab', inLab);
    if (inLab) return paginaLab(parti[1], parti[3]);
    const accesa = { '': 'home', argomento: 'home', matematici: 'fisici' }[p] || p;
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('attiva', a.dataset.pagina === accesa));
    if (p === 'argomento' && parti[1]) return paginaArgomento(parti[1], parti[2] || 'teoria', parti[3]);
    argCorrente = null;
    if (p === 'ripasso') return paginaRipasso(parti[1]);
    if (p === 'fisici' || p === 'matematici') return paginaFisici(parti[1]);
    if (p === 'impostazioni') return paginaImpostazioni();
    return paginaHome();
  }
  window.addEventListener('hashchange', route);

  function svuota() { app.innerHTML = ''; window.scrollTo(0, 0); lettura.hidden = true; }

  /* =====================================================================
     HOME
     ===================================================================== */
  function carteDaRipassare() {
    const ora = Date.now(); let n = 0;
    for (const a in stato.carte) for (const c in stato.carte[a]) if (stato.carte[a][c].prossima && stato.carte[a][c].prossima <= ora) n++;
    return n;
  }
  function aggiornaBadge() { const b = document.getElementById('nav-ripasso'); const n = carteDaRipassare(); b.textContent = n; b.hidden = !n; }
  function percentuale(id) {
    const p = stato.progressi[id]; if (!p || !p.visitato) return 0;
    let v = 0.2;
    if (p.quizTot) v += 0.45 * (p.quizMigliore / p.quizTot);
    if (p.nEsercizi) v += 0.35 * Math.min(1, p.eserciziFatti.length / p.nEsercizi);
    return Math.round(v * 100);
  }
  const CONSIGLI = [
    'Un argomento alla volta. Anche la pioggia arriva una goccia alla volta, e intanto riempie il mare.',
    'Le flashcard rendono di più in dosi piccole e frequenti: dieci minuti oggi, dieci domani.',
    'Nel quiz sbagliare è utile, a patto di leggere la spiegazione. È lì che si impara.',
    'Prima di aprire un argomento, dai un\'occhiata ai prerequisiti: se traballano, torna indietro un passo.',
    'Un esercizio fatto senza guardare la soluzione vale dieci letti.',
    'Se un\'idea non ti entra, prova a spiegarla ad alta voce come se io non la sapessi. Sono una goccia: non la so davvero.',
    'I grafici con i cursori si possono muovere: prova a cambiare i numeri e guarda cosa succede.',
    'In fisica un numero senza unità di misura non vuol dire niente: 12 cosa? Metri, secondi, chilogrammi?',
    'Prima di fare il conto, stima il risultato. Se poi ti viene un\'auto a 3000 km/h, sai che qualcosa non torna.',
    'Nei video la voce si spegne e si riaccende con il pulsante dell\'altoparlante. E puoi fermarli quando vuoi per pensarci.',
    'Nella scheda Flashcard puoi scegliere quali carte studiare e aggiungerne di tue.'
  ];
  /* ---------- la ricerca ----------
     senza accenti e senza differenza fra maiuscole («velocita» trova velocità, «e=mc2» trova E = mc²); le parole vuote
     («di», «la», «legge», «principio»…) e quelle di una o due lettere non contano; prima vengono gli argomenti che
     contengono tutte le parole rimaste, poi quelli che ne hanno qualcuna; la frase intera trovata vale di più. */
  const piano = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/²/g, '2').replace(/³/g, '3').replace(/[’']/g, ' ');
  const VUOTE = new Set(['di', 'del', 'dello', 'della', 'dei', 'degli', 'delle', 'da', 'dal', 'dalla', 'la', 'il', 'lo', 'le', 'gli', 'un', 'una', 'uno', 'e', 'ed', 'per', 'con', 'su', 'in', 'nel', 'nella', 'al', 'alla', 'che', 'come', 'cosa', 'cos', 'legge', 'leggi', 'principio', 'principi', 'teorema', 'formula', 'formule', 'esercizi', 'esercizio']);
  function cercaArgomenti(q) {
    const qp = piano(q).trim(), tutteW = qp.split(/[\s,;]+/).filter(Boolean);
    let w = tutteW.filter(x => !VUOTE.has(x) && (x.length >= 3 || /\d|=/.test(x)));
    if (!w.length) w = tutteW.filter(x => !VUOTE.has(x));
    if (!w.length) return [];
    const frase = qp.replace(/\s+/g, ' ');
    const conta = (titolo, testo, parole) => {
      let punti = 0, prese = 0;
      w.forEach(x => { let s = 0; if (piano(titolo).indexOf(x) >= 0) s += 3; if (parole.some(p => piano(p).indexOf(x) >= 0)) s += 2; if (testo.indexOf(x) >= 0) s += 1; if (s) prese++; punti += s; });
      if (tutteW.length > 1 && (piano(titolo).indexOf(frase) >= 0 || parole.some(p => piano(p).indexOf(frase) >= 0))) punti += 8;
      return { punti, tutte: prese === w.length };
    };
    const ris = [];
    IND.argomenti.forEach(a => {
      const parole = a.parole || [], c = conta(a.titolo, piano(a.titolo + ' ' + a.breve + ' ' + parole.join(' ')), parole);
      if (c.punti) ris.push({ arg: a, punti: c.punti, tutte: c.tutte, parole: parole.filter(p => w.some(x => piano(p).indexOf(x) >= 0)) });
    });
    (IND.laboratori || []).forEach(l => { const c = conta(l.titolo, piano(l.titolo + ' ' + l.sotto), []); if (c.punti) ris.push({ lab: l, punti: c.punti - 0.5, tutte: c.tutte }); });
    return ris.sort((x, y) => (y.tutte - x.tutte) || (y.punti - x.punti));
  }
  /* «1º–3º anno»: gli anni che un'area copre */
  function anniDi(args) { const a = args.map(x => x.anno).filter(Boolean); if (!a.length) return ''; const lo = Math.min.apply(null, a), hi = Math.max.apply(null, a); return lo === hi ? lo + 'º anno' : lo + 'º–' + hi + 'º anno'; }
  function paginaHome() {
    paginaCorrente = 'home'; document.title = 'Quanto — la fisica, un argomento alla volta';
    svuota();
    const visitati = IND.argomenti.filter(a => stato.progressi[a.id] && stato.progressi[a.id].visitato).length;
    const superati = IND.argomenti.filter(a => { const p = stato.progressi[a.id]; return p && p.quizTot && p.quizMigliore / p.quizTot >= 0.7; }).length;
    const daRip = carteDaRipassare();
    const ultimo = stato.ultimo && voce(stato.ultimo);
    const eroe = h(`<section class="scheda eroe">
      <div>
        <div class="eroe-sopra">Fisica per il liceo</div>
        <h1>La fisica, <em>goccia a goccia</em></h1>
        <p>Per ogni argomento c'è la spiegazione con i video, poi esempi svolti un passo alla volta, esercizi con le unità di misura e quiz per metterti alla prova. Stilla, la goccia qui in basso, ti dà un consiglio quando serve.</p>
        <div class="eroe-stat">
          ${ultimo ? `<a class="stat riprendi" href="#/argomento/${ultimo.id}">Riprendi: <b>${esc(ultimo.titolo)}</b> →</a>` : ''}
          <span class="stat"><b data-conta="${visitati}">0</b>su ${IND.argomenti.length} argomenti aperti</span>
          <span class="stat"><b data-conta="${superati}">0</b>quiz superati</span>
          <span class="stat"><b data-conta="${daRip}">0</b>${daRip === 1 ? 'carta' : 'carte'} da ripassare ${daRip ? '<a href="#/ripasso">→ ripassa</a>' : ''}</span>
        </div>
      </div>
      <div class="costruzione">${gocciaSVG()}</div>
    </section>`);
    app.appendChild(eroe);

    const cerca = h(`<div class="cerca">${ICONE.cerca}<input type="search" id="cerca" placeholder="Cerca un argomento o una parola (attrito, lente, ohm…)" autocomplete="off"></div>`);
    app.appendChild(cerca);
    const risultati = h('<div class="risultati" hidden></div>'); app.appendChild(risultati);
    const contenitoreAree = document.createElement('div'); app.appendChild(contenitoreAree);
    const inp = cerca.querySelector('input');
    inp.addEventListener('input', () => {
      const q = inp.value.trim();
      risultati.innerHTML = ''; risultati.hidden = !q; contenitoreAree.hidden = !!q;
      if (!q) return;
      const trovati = cercaArgomenti(q);
      if (!trovati.length) { risultati.innerHTML = '<div class="fc-vuoto">Niente con «' + esc(q) + '». Prova con un\'altra parola.</div>'; return; }
      trovati.slice(0, 12).forEach(t => {
        if (t.lab) { const va = voce(t.lab.argomento); risultati.appendChild(h(`<a class="risultato" href="#/argomento/${t.lab.argomento}/lab/${t.lab.id}"><b>${esc(t.lab.icona || '🧪')} ${esc(t.lab.titolo)}</b> <span class="etichetta">Laboratorio</span><small>${esc(t.lab.sotto)}${va ? ' · ' + esc(va.titolo) : ''}</small></a>`)); return; }
        const a = t.arg, ar = area(a.area);
        risultati.appendChild(h(`<a class="risultato" href="#/argomento/${a.id}"><b>${esc(a.titolo)}</b> <span class="etichetta area" style="background:var(--${ar.colore})">${esc(ar.nome)}</span><small>${esc(a.breve)}${t.parole.length ? ' · <mark>' + esc(t.parole.join(', ')) + '</mark>' : ''}</small></a>`));
      });
    });

    /* gli argomenti stanno chiusi nei gruppi (le aree): si apre un gruppo alla volta, e resta aperto tornando indietro */
    const gruppi = h('<section class="gruppi" aria-label="Argomenti per area"></section>');
    const apriGruppo = (id, scorri) => {
      gruppi.querySelectorAll('.gruppo').forEach(g => {
        const si = g.dataset.area === id, btn = g.querySelector('.gruppo-tasto');
        if (si && !g.dataset.pieno) riempiGruppo(g);
        g.classList.toggle('aperto', si); btn.setAttribute('aria-expanded', si);
      });
      try { id ? sessionStorage.setItem('quanto.gruppo', id) : sessionStorage.removeItem('quanto.gruppo'); } catch (e) { /* ignora */ }
      if (id && scorri) { const g = gruppi.querySelector(`.gruppo[data-area="${id}"]`); setTimeout(() => { const r = g.getBoundingClientRect(); if (r.top < 70 || r.top > innerHeight * 0.45) window.scrollTo({ top: scrollY + r.top - 80, behavior: MOTO ? 'smooth' : 'auto' }); }, 60); }
    };
    const riempiGruppo = g => {
      g.dataset.pieno = '1';
      const ar = area(g.dataset.area), griglia = g.querySelector('.griglia-argomenti');
      IND.argomenti.filter(a => a.area === ar.id).forEach((a, i) => {
        const pc = percentuale(a.id);
        griglia.appendChild(h(`<a class="scheda tessera esplode${stato.ultimo === a.id ? ' prossimo' : ''}" data-rivela="1" href="#/argomento/${a.id}" style="--colore-area:var(--${ar.colore});--i:${Math.min(i, 10)}">
          <h3>${esc(a.titolo)}</h3><p>${esc(a.breve)}</p>
          <div class="tessera-pie"><span class="etichetta anno anno-${a.anno}">${a.anno}º anno</span><span class="progresso"><i style="width:${pc}%"></i></span><span class="progresso-testo">${pc ? pc + '%' : ''}</span></div>
        </a>`));
      });
    };
    IND.aree.forEach(ar => {
      const args = IND.argomenti.filter(a => a.area === ar.id);
      const media = args.length ? Math.round(args.reduce((t, a) => t + percentuale(a.id), 0) / args.length) : 0;
      const aperti = args.filter(a => stato.progressi[a.id] && stato.progressi[a.id].visitato).length;
      const g = h(`<div class="gruppo" data-area="${ar.id}" style="--colore-area:var(--${ar.colore})">
        <button type="button" class="gruppo-tasto" aria-expanded="false" aria-controls="gruppo-${ar.id}">
          <span class="simbolo" style="background:var(--${ar.colore})">${esc(ar.simbolo)}</span>
          <span class="gruppo-testo"><b>${esc(ar.nome)}</b><small>${esc(ar.descrizione)}</small><span class="gruppo-mini">${args.length} argomenti · ${anniDi(args)}${aperti ? ` · ${aperti} ${aperti === 1 ? 'aperto' : 'aperti'}` : ''}</span></span>
          <span class="gruppo-conto"><b>${args.length}</b> argomenti<small>${anniDi(args)}${aperti ? ` · ${aperti} ${aperti === 1 ? 'aperto' : 'aperti'}` : ''}</small></span>
          <span class="gruppo-freccia" aria-hidden="true">${ICONE.destra}</span>
          ${media ? `<span class="gruppo-progresso" aria-hidden="true"><i style="width:${media}%"></i></span>` : ''}
        </button>
        <div class="gruppo-corpo" id="gruppo-${ar.id}"><div class="gruppo-dentro"><div class="griglia-argomenti"></div></div></div>
      </div>`);
      g.querySelector('.gruppo-tasto').addEventListener('click', () => apriGruppo(g.classList.contains('aperto') ? null : ar.id, true));
      gruppi.appendChild(g);
    });
    contenitoreAree.appendChild(gruppi);
    let giaAperto = null; try { giaAperto = sessionStorage.getItem('quanto.gruppo'); } catch (e) { /* ignora */ }
    if (giaAperto && area(giaAperto)) apriGruppo(giaAperto, false);

    if ((IND.laboratori || []).length) {
      const bl = h(`<section class="area-blocco lab-blocco"><div class="area-testa"><span class="simbolo simbolo-lab">🧪</span><div><h2>Laboratori</h2><p>Piccoli giochi con dentro un concetto: si impara con le mani, senza leggere niente prima. Sono ${IND.laboratori.length}, nell'ordine degli argomenti.<span class="lab-scorri"> Scorri di lato →</span></p></div></div><div class="griglia-lab-scorre"><div class="griglia-lab"></div></div></section>`);
      const g = bl.querySelector('.griglia-lab'); const ordine = id => IND.argomenti.findIndex(a => a.id === id); IND.laboratori.slice().sort((x, y) => ordine(x.argomento) - ordine(y.argomento)).forEach(l => g.appendChild(tesseraLab(l, true)));
      contenitoreAree.appendChild(bl);
    }
    app.appendChild(h(`<div class="versione">Quanto v${VERSIONE}</div>`));
    aggiornaBadge();
  }

  /* =====================================================================
     PAGINA ARGOMENTO
     ===================================================================== */
  function paginaArgomento(id, scheda, ancora) {
    const v = voce(id);
    if (!v) { argCorrente = null; document.title = 'Argomento sconosciuto — Quanto'; svuota(); app.appendChild(h('<div class="scheda fc-vuoto">Argomento sconosciuto. <a href="#/">Torna all\'elenco</a>.</div>')); return; }
    /* una scheda che non esiste, o il laboratorio di un argomento che non ne ha: si va alla teoria */
    const valide = SCHEDE.map(x => x[0]).concat(labsDi(id).length ? ['lab'] : []);
    if (valide.indexOf(scheda) < 0) { scheda = 'teoria'; ancora = null; try { history.replaceState(null, '', '#/argomento/' + id + '/teoria'); } catch (e) { /* niente */ } }
    paginaCorrente = 'argomento'; document.title = v.titolo + ' — Quanto';
    if (argCorrente !== id) { svuota(); app.appendChild(h('<div class="fc-vuoto">Carico «' + esc(v.titolo) + '»…</div>')); }
    caricaArgomento(id).then(arg => {
      argCorrente = id;
      const p = progresso(id); const prima = !p.visitato;
      p.visitato = Date.now(); p.nEsercizi = arg.esercizi.length; p.nFlashcard = arg.flashcards.length; stato.ultimo = id; salva();
      disegnaArgomento(v, arg, scheda, ancora);
    }).catch(err => {
      svuota();
      app.appendChild(h(`<div class="scheda quiz-avvio"><h2>${esc(v.titolo)}</h2><p>Questo argomento è ancora in preparazione (${esc(err.message)}).</p><a class="btn" href="#/">Torna agli argomenti</a></div>`));
    });
  }

  function disegnaArgomento(v, arg, scheda, ancora) {
    const ar = area(v.area);
    let testa = app.querySelector('.arg-testa');
    if (!testa) {
      svuota();
      testa = h(`<header class="arg-testa" style="--colore-area:var(--${ar.colore})">
        <span class="filigrana" aria-hidden="true">${esc(ar.simbolo)}</span>
        <div class="briciole"><a href="#/">Argomenti</a> › <span class="etichetta area" style="background:var(--${ar.colore})">${esc(ar.nome)}</span> <span class="etichetta anno anno-${v.anno}">${v.anno}º anno</span></div>
        <h1>${esc(arg.titolo)}</h1>
        <p class="sottotitolo">${esc(v.breve || '')}</p>
        <div class="prerequisiti">${v.prerequisiti.length ? 'Prima conviene sapere: ' + v.prerequisiti.map(pid => { const pv = voce(pid); return pv ? `<a href="#/argomento/${pid}">${esc(pv.titolo)}</a>` : ''; }).join('') : 'Nessun prerequisito: si parte da qui.'}</div>
      </header>`);
      app.appendChild(testa);
      const nav = h('<nav class="schede-nav"><div class="schede-nav-int"></div></nav>');
      app.appendChild(nav);
      app.appendChild(h(`<div id="pannello" class="pannello" style="--colore-area:var(--${ar.colore})"></div>`));
      app.appendChild(h(`<div class="versione">Quanto v${VERSIONE}</div>`));
    }
    const navInt = app.querySelector('.schede-nav-int'); navInt.innerHTML = '';
    const p = progresso(v.id);
    const schede = SCHEDE.slice();
    if (labsDi(v.id).length) schede.splice(2, 0, ['lab', 'Laboratorio', 'lab']);
    schede.forEach(([sid, nome, icona]) => {
      let extra = '';
      if (sid === 'quiz' && p.quizTot) extra = ` <span class="spunta">${p.quizMigliore}/${p.quizTot}</span>`;
      if (sid === 'esercizi' && p.eserciziFatti.length) extra = ` <span class="spunta">${p.eserciziFatti.length}/${arg.esercizi.length}</span>`;
      navInt.appendChild(h(`<a class="scheda-tab${sid === scheda ? ' attiva' : ''}${sid === 'lab' ? ' tab-lab' : ''}" href="#/argomento/${v.id}/${sid}">${ICONE[icona]}${nome}${extra}</a>`));
    });
    const attiva = navInt.querySelector('.attiva'); if (attiva && attiva.scrollIntoView) setTimeout(() => attiva.scrollIntoView({ inline: 'center', block: 'nearest' }), 0);
    cursoreSchede(true);
    chiudiLab();
    const pannello = app.querySelector('#pannello'); pannello.innerHTML = ''; pannello.className = 'pannello';
    schedaCorrente = scheda;
    const disegna = { teoria: schedaTeoria, esempi: schedaEsempi, flashcard: schedaFlashcard, esercizi: schedaEsercizi, quiz: schedaQuiz, formulario: schedaFormulario, lab: schedaLab }[scheda] || schedaTeoria;
    disegna(pannello, arg, v, ancora);
    if (!ancora) window.scrollTo(0, 0);
    requestAnimationFrame(aggiornaLettura);
  }

  /* ---------- scheda LABORATORIO: esperienze manipolative ---------- */
  function tesseraLab(l, conArgomento) {
    const va = voce(l.argomento);
    return h(`<a class="scheda tessera-lab${l.nuovo ? ' nuovo' : ''}" href="#/argomento/${l.argomento}/lab/${l.id}">
      <div class="lab-icona">${esc(l.icona || '🧪')}</div>
      <div><h3>${esc(l.titolo)}</h3><p>${esc(l.sotto)}</p>${conArgomento && va ? `<small class="lab-arg">${esc(va.titolo)}</small>` : ''}</div></a>`);
  }
  function schedaLab(pannello, arg, v) {
    const labs = labsDi(v.id);
    pannello.appendChild(h('<p class="intro-scheda">Qui si impara con le mani: ogni laboratorio è un piccolo gioco che nasconde dentro il concetto. Si apre a tutto schermo, e non c\'è niente da leggere prima.</p>'));
    const g = h('<div class="griglia-lab griglia-lab-grande"></div>'); labs.forEach(l => g.appendChild(tesseraLab(l))); pannello.appendChild(g);
  }

  /* ---------- il laboratorio: una schermata sola, senza scorrere ---------- */
  function paginaLab(argId, labId) {
    const v = voce(argId), meta = (IND.laboratori || []).find(l => l.id === labId && l.argomento === argId);
    paginaCorrente = 'lab'; argCorrente = null; labCorrente = meta;
    svuota();
    if (!v || !meta) { document.title = 'Laboratorio sconosciuto — Quanto'; app.appendChild(h(`<div class="scheda fc-vuoto">Laboratorio sconosciuto. <a href="#/">Torna agli argomenti</a>.</div>`)); return; }
    document.title = meta.titolo + ' — Quanto';
    const ar = area(v.area);
    const schermo = h(`<section class="schermo-lab" style="--colore-area:var(--${ar.colore})">
      <header class="sl-barra">
        <a class="sl-indietro icona-btn" href="#/argomento/${esc(argId)}/lab" aria-label="Torna all'argomento" title="Torna all'argomento">${ICONE.destra}</a>
        <div class="sl-titolo"><span class="sl-ico">${esc(meta.icona || '🧪')}</span><div><b>${esc(meta.titolo)}</b><small>${esc(v.titolo)}</small></div></div>
        <button type="button" class="icona-btn sl-schermo" aria-label="Schermo intero" title="Schermo intero">${ICONE.schermo}</button>
      </header>
      <div class="lab-stage" data-lab="${esc(meta.id)}"><div class="fc-vuoto">Carico il laboratorio…</div></div>
    </section>`);
    app.appendChild(schermo);
    const stage = schermo.querySelector('.lab-stage');
    /* il fumetto di Stilla si chiude quando si cambia livello (pallini, «Prossimo livello», «Ricomincia», «Libero») */
    stage.addEventListener('click', ev => {
      const b = ev.target.closest('button, [role=button], a'); if (!b || !CMASC.aperta()) return;
      if (b.closest('.lab-livelli') || b.classList.contains('lab-pallino') || b.classList.contains('lab-libero') || /prossim|livello|ricomincia|avanti|libero|svuota/i.test(b.textContent)) CMASC.chiudi();
    }, true);
    schermo.querySelector('.sl-schermo').addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); });
    const p = progresso(v.id); p.lab = p.lab || {}; const st = p.lab[meta.id] = p.lab[meta.id] || { livelli: [] };
    const ctx = {
      zenone: (testo, opz) => { if (stato.impostazioni.mascotte) CMASC.dici(testo, Object.assign({ tipo: 'commento', espressione: 'felice' }, opz || {}, { azione: true })); },
      mascotte: (evento, testo) => CMASC.reagisci(evento, testo),
      completato: (livello) => { if (!st.livelli.includes(livello)) st.livelli.push(livello); salva(); CMASC.reagisci('livello'); },
      stato: () => st, tema: () => document.documentElement.dataset.tema || 'chiaro', CGRAF: window.CGRAF,
      md: s => md(s), tex: (s, d) => (window.katex ? tex(s, d) : esc(s))
    };
    caricaLab(meta.id).then(lab => {
      if (!document.body.contains(stage)) return;
      stage.innerHTML = '';
      const sm = lab.monta(stage, ctx);
      smontaLab = typeof sm === 'function' ? sm : null;
    }).catch(err => { stage.innerHTML = `<div class="fc-vuoto">Il laboratorio non si è caricato (${esc(err.message)}).</div>`; });
  }

  /* ---------- Teoria ---------- */
  function schedaTeoria(pan, arg, v, ancora) {
    const wrap = h('<div class="teoria"><aside class="sommario"><h4>In questa pagina</h4></aside><div class="colonna"></div></div>');
    const som = wrap.querySelector('.sommario'), col = wrap.querySelector('.colonna');
    som.appendChild(h('<a href="#/argomento/' + v.id + '/teoria/intro">Introduzione</a>'));
    const intro = h('<section class="intro sezione-intro" id="sez-intro"></section>'); intro.appendChild(frammento(arg.introduzione, arg)); col.appendChild(intro);
    if (Array.isArray(arg.inBreve) && arg.inBreve.length) {
      const ib = h('<aside class="in-breve rivela"><h3><span class="ib-ico">✦</span>In breve: cosa devi portarti via</h3><ul></ul></aside>');
      arg.inBreve.forEach((t, i) => { const li = document.createElement('li'); li.style.setProperty('--i', i); li.innerHTML = md(t).replace(/^<p>|<\/p>$/g, ''); ib.querySelector('ul').appendChild(li); });
      col.appendChild(ib);
    }
    arg.sezioni.forEach((s, i) => {
      som.appendChild(h(`<a href="#/argomento/${v.id}/teoria/${s.id}">${i + 1}. ${esc(s.titolo)}</a>`));
      const sez = h(`<section class="scheda sezione" id="sez-${esc(s.id)}"><h2><span class="num">${i + 1}</span>${esc(s.titolo)}</h2></section>`);
      sez.appendChild(frammento(s.testo, arg)); col.appendChild(sez);
    });
    const fine = h(`<div class="riga-btn" style="margin:10px 0 30px"><a class="btn primario" href="#/argomento/${v.id}/esempi">Vai agli esempi svolti ${ICONE.destra}</a><a class="btn" href="#/argomento/${v.id}/flashcard">Ripassa con le flashcard</a></div>`);
    col.appendChild(fine);
    pan.appendChild(wrap);
    /* evidenzia la sezione visibile */
    const link = [...som.querySelectorAll('a')];
    const oss = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const id = e.target.id.replace(/^sez-/, ''); link.forEach(a => a.classList.toggle('attiva', a.getAttribute('href').endsWith('/' + id))); } });
    }, { rootMargin: '-120px 0px -70% 0px' });
    col.querySelectorAll('section').forEach(s => oss.observe(s));
    link.forEach(a => a.addEventListener('click', ev => { const id = a.getAttribute('href').split('/').pop(); if (scorriA(id)) { ev.preventDefault(); try { history.replaceState(null, '', a.getAttribute('href')); } catch (e) { /* niente */ } } }));
    if (ancora) { const t = document.getElementById('sez-' + ancora); if (t) setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }
  }

  /* ---------- Esempi ---------- */
  function schedaEsempi(pan, arg) {
    pan.appendChild(h('<p class="sotto-pagina">Esercizi svolti, dal più semplice al più difficile. La soluzione si apre un passo alla volta: prima di aprire il passo successivo, prova a farlo tu.</p>'));
    arg.esempi.forEach((e, i) => {
      const card = h(`<article class="scheda esempio rivela"><h3><span class="es-num">${i + 1}</span>${esc(e.titolo)}</h3><div class="problema prosa"></div><ol class="passi"></ol><div class="esempio-barra"><button type="button" class="btn primario piccolo e-avanti">Primo passo ${ICONE.destra}</button><button type="button" class="btn piccolo e-tutto">Mostra tutta la soluzione</button><span class="e-conta"></span></div></article>`);
      card.querySelector('.problema').innerHTML = md(e.problema);
      const ol = card.querySelector('.passi');
      e.passi.forEach(p => { const li = document.createElement('li'); li.className = 'prosa nascosto'; li.innerHTML = md(p); ol.appendChild(li); });
      let r = null;
      if (e.risultato) { r = h('<div class="risultato-finale prosa nascosto"></div>'); r.innerHTML = md(e.risultato); card.insertBefore(r, card.querySelector('.esempio-barra')); }
      const lis = [...ol.children], avanti = card.querySelector('.e-avanti'), tutto = card.querySelector('.e-tutto'), conta = card.querySelector('.e-conta');
      let n = 0;
      const mostra = (anima) => {
        lis.forEach((li, k) => { const vis = k < n; if (vis && li.classList.contains('nascosto') && anima) { li.classList.add('entra'); } li.classList.toggle('nascosto', !vis); });
        const fine = n >= lis.length;
        if (r) { if (fine && r.classList.contains('nascosto') && anima) r.classList.add('entra'); r.classList.toggle('nascosto', !fine); }
        ol.hidden = n === 0;
        avanti.hidden = fine; tutto.hidden = fine;
        avanti.innerHTML = (n === 0 ? 'Primo passo ' : 'Passo successivo ') + ICONE.destra;
        conta.textContent = fine ? '' : (n ? n + ' passi su ' + lis.length : lis.length + ' passi');
        card.classList.toggle('completo', fine);
      };
      avanti.addEventListener('click', () => { n++; mostra(true); CMASC.reagisci(n >= lis.length ? 'giusto' : 'passo'); });
      tutto.addEventListener('click', () => { n = lis.length; mostra(true); });
      mostra(false);
      montaGrafici(card, arg); pan.appendChild(card);
    });
  }

  /* ---------- Formulario ---------- */
  function schedaFormulario(pan, arg) {
    const g = h('<div class="formulario"></div>');
    arg.formulario.forEach(f => {
      const c = h(`<div class="scheda formula"><h3>${md(f.nome).replace(/^<p>|<\/p>$/g, '')}</h3><div class="f"></div>${f.nota ? '<div class="nota prosa"></div>' : ''}</div>`);
      c.querySelector('.f').innerHTML = tex(f.formula, true);
      if (f.nota) c.querySelector('.nota').innerHTML = md(f.nota);
      g.appendChild(c);
    });
    pan.appendChild(g);
  }

  /* =====================================================================
     FLASHCARD (Leitner a 4 scatole)
     ===================================================================== */
  const INTERVALLI = [0, 1, 3, 7, 14];   /* giorni per scatola 1..4 */
  const fraGiorni = n => n <= 0 ? 'subito' : n === 1 ? 'domani' : 'fra ' + n + ' giorni';
  const oggi = () => new Date().toDateString();
  /* dove va la carta con ciascuna risposta: «sì» sale di una scatola (una carta nuova saputa subito va alla 2, così
     «sì» e «così così» non fanno la stessa cosa), «così così» scende di una (almeno la 1), «no» torna alla 1 */
  const scatolaDopo = (sc, esito) => esito === 'no' ? 1 : esito === 'quasi' ? Math.max(1, (sc || 0) - 1) : (sc ? Math.min(4, sc + 1) : 2);
  function statoCarta(argId, cId) { const a = stato.carte[argId] || (stato.carte[argId] = {}); return a[cId] || (a[cId] = { scatola: 0, prossima: 0, viste: 0 }); }
  function valutaCarta(argId, cId, esito) {
    const c = statoCarta(argId, cId); c.viste++;
    /* una carta già promossa oggi non sale ancora: il metodo delle scatole vuole il tempo in mezzo */
    if (esito === 'si' && c.promossa === oggi()) { salva(); return; }
    c.scatola = scatolaDopo(c.scatola, esito);
    if (esito === 'si') c.promossa = oggi(); else if (esito === 'no') c.promossa = null;
    c.prossima = Date.now() + INTERVALLI[c.scatola] * GIORNO * (esito === 'no' ? 0 : 1) + (esito === 'no' ? 600000 : 0);
    salva(); aggiornaBadge();
  }
  function carteDi(arg) {
    const mie = (stato.carteMie[arg.id] || []).map(c => Object.assign({ mia: true }, c));
    return arg.flashcards.concat(mie);
  }
  function selezionate(arg) { const escl = new Set((stato.selezione[arg.id] || {}).esclusi || []); return carteDi(arg).filter(c => !escl.has(c.id)); }
  function impostaEsclusi(argId, ids) { stato.selezione[argId] = { esclusi: ids }; salva(); }

  /* componente di studio: mazzo = [{arg, carta}] */
  function studioFlashcard(pan, mazzo, opz) {
    opz = opz || {};
    if (!mazzo.length) { pan.appendChild(h('<div class="scheda fc-vuoto">' + (opz.vuoto || 'Nessuna carta selezionata: scegline qualcuna qui sotto.') + '</div>')); return; }
    let ordine = stato.impostazioni.mescola ? mescola(mazzo) : mazzo.slice();
    let i = 0, girata = false, serie = 0;
    const bilancio = { si: 0, quasi: 0, no: 0 }, viste = new Set();
    const box = h(`<div>
      <div class="fc-barra"><span class="fc-contatore"></span><span class="spazio"></span>
        <button class="btn piccolo b-mescola" type="button">${ICONE.mescola} Mescola</button>
        ${opz.filtroDovute ? '<button class="btn piccolo b-dovute" type="button">Solo da ripassare</button>' : ''}
      </div>
      <div class="fc-scena"><div class="fc-carta" tabindex="0" role="button" aria-label="Flashcard: tocca per girare">
        <div class="fc-faccia fc-fronte"><span class="fc-tipo"></span><span class="fc-sez"></span><div class="testo prosa"></div><span class="fc-aiuto">tocca per girare</span></div>
        <div class="fc-faccia fc-retro"><span class="fc-tipo">Risposta</span><div class="testo prosa"></div><span class="fc-aiuto">Come è andata?</span></div>
      </div></div>
      <div class="fc-valuta" hidden>
        <button class="btn no" type="button" data-esito="no">Non la sapevo<small>la rivedrai subito</small></button>
        <button class="btn quasi" type="button" data-esito="quasi">Così così<small>domani</small></button>
        <button class="btn si" type="button" data-esito="si">La sapevo<small></small></button>
      </div>
      <div class="fc-nav"><button class="btn b-prev" type="button" aria-label="Carta precedente">${ICONE.sinistra}<span class="fc-nav-testo"> Precedente</span></button><button class="btn b-gira" type="button">${ICONE.gira} Gira</button><button class="btn b-next" type="button" aria-label="Carta successiva"><span class="fc-nav-testo">Successiva </span>${ICONE.destra}</button></div>
      <div class="fc-fine scheda" hidden></div>
    </div>`);
    pan.appendChild(box);
    const carta = box.querySelector('.fc-carta'), cont = box.querySelector('.fc-contatore'), valuta = box.querySelector('.fc-valuta');
    const fronte = box.querySelector('.fc-fronte .testo'), retro = box.querySelector('.fc-retro .testo');
    function mostra() {
      const { arg, carta: c } = ordine[i];
      girata = false; carta.classList.remove('girata'); valuta.hidden = true;
      fronte.innerHTML = md(c.fronte); retro.innerHTML = md(c.retro);
      box.querySelector('.fc-fronte .fc-tipo').textContent = c.tipo || (c.mia ? 'carta mia' : 'carta');
      box.querySelector('.fc-fronte').classList.toggle('mia', !!c.mia);
      const sez = arg.sezioni.find(s => s.id === c.sezione);
      box.querySelector('.fc-fronte .fc-sez').textContent = opz.multi ? arg.titolo : (sez ? sez.titolo : '');
      const sc = statoCarta(arg.id, c.id);
      box.querySelector('.si small').textContent = sc.promossa === oggi() ? 'già salita oggi' : fraGiorni(INTERVALLI[scatolaDopo(sc.scatola, 'si')]);
      box.querySelector('.quasi small').textContent = fraGiorni(INTERVALLI[scatolaDopo(sc.scatola, 'quasi')]);
      cont.textContent = (i + 1) + ' / ' + ordine.length + (viste.size ? ' · ' + viste.size + ' valutate' : '') + (sc.scatola ? ' · scatola ' + sc.scatola : '');
    }
    /* la fine della seduta: tutte le carte valutate (le «non la sapevo» tornano in coda finché non le sai) */
    function fineSeduta() {
      const fine = box.querySelector('.fc-fine');
      [box.querySelector('.fc-scena'), valuta, box.querySelector('.fc-nav'), box.querySelector('.fc-barra')].forEach(x => { x.hidden = true; });
      const pross = mazzo.map(x => statoCarta(x.arg.id, x.carta.id).prossima).filter(t => t > Date.now()).sort((a, b) => a - b)[0];
      const fraQuanto = pross ? fraGiorni(Math.round((pross - Date.now()) / GIORNO)) : '';
      fine.innerHTML = `<h3>Seduta finita</h3><p>${viste.size} ${viste.size === 1 ? 'carta valutata' : 'carte valutate'}: ${bilancio.si} sapute, ${bilancio.quasi} così così${bilancio.no ? ', ' + bilancio.no + ' da rivedere (rifatte finché non le hai sapute)' : ''}.${fraQuanto ? ' La prossima torna ' + fraQuanto + '.' : ''}</p><div class="riga-btn"><button class="btn primario b-ancora" type="button">Ristudia tutto il mazzo</button></div>`;
      fine.hidden = false; fine.scrollIntoView({ behavior: MOTO ? 'smooth' : 'auto', block: 'center' });
      fine.querySelector('.b-ancora').addEventListener('click', () => { ordine = stato.impostazioni.mescola ? mescola(mazzo) : mazzo.slice(); i = 0; viste.clear(); bilancio.si = bilancio.quasi = bilancio.no = 0; fine.hidden = true; [box.querySelector('.fc-scena'), box.querySelector('.fc-nav'), box.querySelector('.fc-barra')].forEach(x => { x.hidden = false; }); mostra(); });
      CMASC.reagisci('traguardo', bilancio.no ? 'Seduta finita. Le carte difficili tornano presto: è così che restano.' : 'Seduta finita, tutte sapute. Ci vediamo alla prossima scadenza.');
    }
    function gira() { girata = !girata; carta.classList.toggle('girata', girata); valuta.hidden = !girata; }
    function avanti() { if (!ordine.length) return; i = (i + 1) % ordine.length; mostra(); }
    function indietro() { if (!ordine.length) return; i = (i - 1 + ordine.length) % ordine.length; mostra(); }
    carta.addEventListener('click', gira);
    carta.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); gira(); } });
    box.querySelector('.b-gira').addEventListener('click', gira);
    box.querySelector('.b-next').addEventListener('click', avanti);
    box.querySelector('.b-prev').addEventListener('click', indietro);
    box.querySelector('.b-mescola').addEventListener('click', () => { ordine = mescola(ordine); i = 0; mostra(); });
    if (opz.filtroDovute) box.querySelector('.b-dovute').addEventListener('click', ev => {
      const b = ev.currentTarget; const attivo = b.classList.toggle('attivo');
      const ora = Date.now();
      ordine = attivo ? mazzo.filter(x => { const c = statoCarta(x.arg.id, x.carta.id); return c.prossima > 0 && c.prossima <= ora; }) : (stato.impostazioni.mescola ? mescola(mazzo) : mazzo.slice());
      if (!ordine.length) { ordine = mazzo.slice(); b.classList.remove('attivo'); CMASC.dici('Non c\'è niente da ripassare oggi: le carte tornano quando è il momento. Studia pure tutto il mazzo.', { tipo: 'commento', azione: true, durata: 5000 }); }
      i = 0; mostra();
    });
    valuta.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const esito = b.dataset.esito, x = ordine[i], { arg, carta: c } = x;
      valutaCarta(arg.id, c.id, esito); CMASC.reagisci({ si: 'giusto', quasi: 'pensa', no: 'ops' }[esito] || 'neutro');
      if (esito === 'si') { serie++; if (serie === 5) setTimeout(() => CMASC.espressione('orgoglioso', 1800), 700); } else serie = 0;
      /* la carta valutata esce dalla seduta; quella che non sapevi torna in fondo */
      viste.add(arg.id + '/' + c.id); bilancio[esito]++;
      ordine.splice(i, 1);
      if (esito === 'no') ordine.push(x);
      if (opz.dopoValuta) opz.dopoValuta();
      if (!ordine.length) { fineSeduta(); return; }
      if (i >= ordine.length) i = 0;
      mostra();
    }));
    const tasti = e => { if (!document.body.contains(box)) { window.removeEventListener('keydown', tasti); return; } if (e.target.matches('input,textarea,select')) return; if (e.key === 'ArrowRight') avanti(); else if (e.key === 'ArrowLeft') indietro(); else if (girata && ['1', '2', '3'].includes(e.key)) valuta.querySelectorAll('button')[+e.key - 1].click(); };
    window.addEventListener('keydown', tasti);
    mostra();
  }

  function schedaFlashcard(pan, arg, v) {
    const sel = selezionate(arg);
    const tot = carteDi(arg).length;
    pan.appendChild(h(`<p class="sotto-pagina">Tocca la carta per girarla, poi dimmi come è andata: le carte che non sai tornano prima, quelle che sai si allontanano (metodo Leitner). Stai studiando <b>${sel.length}</b> carte su ${tot}.</p>`));
    const studio = document.createElement('div'); pan.appendChild(studio);
    studioFlashcard(studio, sel.map(c => ({ arg, carta: c })), { filtroDovute: true });

    /* --- pannello di scelta --- */
    const det = h(`<details class="scheda fc-selezione"><summary>Scegli quali carte studiare, o aggiungine di tue</summary>
      <div class="riga-btn" style="margin-top:10px"><button class="btn piccolo b-tutte" type="button">Tutte</button><button class="btn piccolo b-nessuna" type="button">Nessuna</button><button class="btn piccolo b-inverti" type="button">Inverti</button><span class="fc-contatore b-conta"></span></div>
      <div class="gruppi"></div>
      <form class="fc-nuova"><b>Nuova carta mia</b>
        <label>Fronte (domanda)<textarea name="fronte" required placeholder="Puoi usare le formule fra $…$"></textarea></label>
        <label>Retro (risposta)<textarea name="retro" required></textarea></label>
        <label>Sezione <select name="sezione">${arg.sezioni.map(s => `<option value="${esc(s.id)}">${esc(s.titolo)}</option>`).join('')}</select></label>
        <div class="riga-btn"><button class="btn primario piccolo" type="submit">Aggiungi la carta</button></div>
      </form></details>`);
    pan.appendChild(det);
    const gruppi = det.querySelector('.gruppi');
    function ridisegnaGruppi() {
      gruppi.innerHTML = '';
      const escl = new Set((stato.selezione[arg.id] || {}).esclusi || []);
      const tutte = carteDi(arg);
      const sezioni = arg.sezioni.concat([{ id: '__altre', titolo: 'Altre' }]);
      sezioni.forEach(s => {
        const carte = tutte.filter(c => (arg.sezioni.some(z => z.id === c.sezione) ? c.sezione : '__altre') === s.id);
        if (!carte.length) return;
        const g = h(`<div class="fc-gruppo"><div class="fc-gruppo-testa"><span>${esc(s.titolo)}</span><span class="fc-contatore">${carte.filter(c => !escl.has(c.id)).length}/${carte.length}</span><button class="btn piccolo fantasma" type="button">tutte / nessuna</button></div></div>`);
        g.querySelector('button').addEventListener('click', () => { const tutteSel = carte.every(c => !escl.has(c.id)); carte.forEach(c => tutteSel ? escl.add(c.id) : escl.delete(c.id)); impostaEsclusi(arg.id, [...escl]); ridisegnaGruppi(); });
        carte.forEach(c => {
          const sc = statoCarta(arg.id, c.id);
          const riga = h(`<label class="fc-voce"><input type="checkbox" ${escl.has(c.id) ? '' : 'checked'}><span><span class="fronte-mini prosa"></span><span class="retro-mini prosa"></span></span><span class="stato">${sc.scatola ? 'scatola ' + sc.scatola : ''}${c.mia ? ' <button class="btn piccolo fantasma b-elimina" type="button" title="Elimina">✕</button>' : ''}</span></label>`);
          riga.querySelector('.fronte-mini').innerHTML = md(c.fronte); riga.querySelector('.retro-mini').innerHTML = md(c.retro);
          riga.querySelector('input').addEventListener('change', ev => { ev.target.checked ? escl.delete(c.id) : escl.add(c.id); impostaEsclusi(arg.id, [...escl]); g.querySelector('.fc-contatore').textContent = carte.filter(x => !escl.has(x.id)).length + '/' + carte.length; aggiornaConta(); });
          const del = riga.querySelector('.b-elimina');
          if (del) del.addEventListener('click', ev => { ev.preventDefault(); stato.carteMie[arg.id] = (stato.carteMie[arg.id] || []).filter(x => x.id !== c.id); salva(); ridisegnaGruppi(); });
          g.appendChild(riga);
        });
        gruppi.appendChild(g);
      });
      aggiornaConta();
    }
    function aggiornaConta() { const n = selezionate(arg).length; det.querySelector('.b-conta').textContent = n + ' selezionate · ricarica la scheda per studiarle'; }
    det.querySelector('.b-tutte').addEventListener('click', () => { impostaEsclusi(arg.id, []); ridisegnaGruppi(); });
    det.querySelector('.b-nessuna').addEventListener('click', () => { impostaEsclusi(arg.id, carteDi(arg).map(c => c.id)); ridisegnaGruppi(); });
    det.querySelector('.b-inverti').addEventListener('click', () => { const escl = new Set((stato.selezione[arg.id] || {}).esclusi || []); impostaEsclusi(arg.id, carteDi(arg).filter(c => !escl.has(c.id)).map(c => c.id)); ridisegnaGruppi(); });
    det.querySelector('form').addEventListener('submit', ev => {
      ev.preventDefault(); const f = ev.target;
      const lista = stato.carteMie[arg.id] || (stato.carteMie[arg.id] = []);
      lista.push({ id: 'mia-' + Date.now().toString(36), fronte: f.fronte.value.trim(), retro: f.retro.value.trim(), sezione: f.sezione.value, tipo: 'concetto' });
      salva(); f.reset(); ridisegnaGruppi();
      CMASC.dici('Carta aggiunta al mazzo. La trovi mescolata alle altre alla prossima apertura della scheda.', { tipo: 'commento', azione: true, espressione: 'felice', durata: 4000, azioni: [{ testo: 'Ricarica adesso', fn: () => disegnaArgomento(v, arg, 'flashcard') }] });
    });
    ridisegnaGruppi();
    det.querySelector('.b-conta').textContent = '';
    det.addEventListener('toggle', () => { if (!det.open && selezionate(arg).length !== sel.length) disegnaArgomento(v, arg, 'flashcard'); });
  }

  /* =====================================================================
     ESERCIZI
     ===================================================================== */
  /* il lettore delle risposte (numeri, misure con le unità, confronto) sta in quanto-grafici.js,
     perché il validatore prova con lo stesso codice che ogni risposta giusta passi davvero */
  const RISP = CGRAF.risposte;
  /* 6,64·10^-34 → 6,64·10⁻³⁴ (nei messaggi; il lettore delle risposte capisce tutte e due le forme) */
  const APICE = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const numeroBello = v => RISP.numeroIt(v).replace(/\^(-?\d+)/, (m, e) => e.split('').map(c => APICE[c]).join(''));
  const controllaRisposta = (r, v) => RISP.controlla(r, v);
  /* il testo grigio d'esempio non deve mai essere la risposta: se lo è, se ne cambiano le cifre (3√2 → 4√3) */
  function segnapostoSicuro(r, ph) {
    if (!ph || !/\d/.test(ph)) return ph;
    const tradisce = t => t.replace(/^.*?\b(es\.|esempio:?|per esempio)\s*/i, '').split(/\s+o\s+|\s+oppure\s+/).some(x => { try { return /\d/.test(x) && controllaRisposta(r, x.trim()) === true; } catch (err) { return false; } });
    if (!tradisce(ph)) return ph;
    for (let k = 1; k <= 3; k++) { const alt = ph.replace(/\d/g, d => String((+d + k) % 10 || 1)); if (!tradisce(alt)) return alt; }
    return { numero: 'La tua risposta', numeri: 'Le soluzioni, separate da ;', testo: 'La tua risposta' }[r.tipo] || 'La tua risposta';
  }
  /* la fila di tasti sotto la casella: con le unità quelli della fisica, senza quelli dei conti */
  const TASTI_FISICA = ['·10^', '²', '³', '/', '°', 'Ω', 'μ', '−'];
  const TASTI_CONTI = ['√', 'π', '^', '/', ';', '(', ')', '−'];
  const TASTI_DISUG = ['<', '>', '≤', '≥', '∞', '(', ')', ';', '−'];
  function tastiDi(r) {
    if (r.simboli) return r.simboli;
    if (r.tipo === 'testo' && (r.accettate || []).some(a => /[<>≤≥]/.test(a))) return TASTI_DISUG;
    if (r.tipo === 'numero' && r.unita) return TASTI_FISICA;
    return TASTI_CONTI;
  }
  /* il segnaposto di serie: con l'unità si mostra la forma (senza svelare il numero) */
  function segnapostoDi(r) {
    if (r.segnaposto) return r.segnaposto;
    if (r.tipo === 'numero' && r.unita) return 'Numero e unità (es. 2,5 ' + r.unita + ')';
    return { numero: 'La tua risposta (es. 2,5 oppure 5/2)', numeri: 'Le soluzioni (es. -1; 3)', testo: 'La tua risposta' }[r.tipo];
  }

  function schedaEsercizi(pan, arg, v) {
    const p = progresso(v.id);
    const base = arg.esercizi.filter(e => e.livello === 'base');
    const avanzati = arg.esercizi.filter(e => e.livello !== 'base');
    const conta = () => { const tab = app.querySelector('.scheda-tab[href$="/esercizi"] .spunta'); if (tab) tab.textContent = p.eserciziFatti.length + '/' + arg.esercizi.length; };
    function segnaFatto(id, si) { const f = p.eserciziFatti; const k = f.indexOf(id); if (si && k < 0) f.push(id); if (!si && k >= 0) f.splice(k, 1); salva(); conta(); if (allenamento) allenamento.aggiorna(); }

    /* una carta esercizio: testo, suggerimenti, casella di risposta, soluzione */
    function creaCarta(e, etichetta, alGiusto) {
      const fatto = p.eserciziFatti.includes(e.id);
      const card = h(`<article class="scheda esercizio${fatto ? ' fatto' : ''}" data-d="${e.difficolta}" id="es-${esc(e.id)}">
        <div class="es-testa"><span class="numero">${esc(etichetta)}</span><span class="stelle">${'★'.repeat(e.difficolta)}${'☆'.repeat(3 - e.difficolta)}</span><label class="fatto-spunta"><input type="checkbox" ${fatto ? 'checked' : ''}> fatto</label></div>
        <div class="testo prosa"></div>
        <div class="es-suggerimenti"></div>
        <div class="es-risposta" hidden></div>
        <div class="es-esito" hidden></div>
        <div class="es-azioni"><button class="btn piccolo b-sugg" type="button">${ICONE.lampadina} Suggerimento</button><button class="btn piccolo b-sol" type="button">Mostra la soluzione</button></div>
        <div class="es-soluzione" hidden><b>Soluzione</b><ol class="passi"></ol></div>
      </article>`);
      card.querySelector('.testo').innerHTML = md(e.testo);
      card.querySelector('.fatto-spunta input').addEventListener('change', ev => { segnaFatto(e.id, ev.target.checked); card.classList.toggle('fatto', ev.target.checked); });
      let dati = 0; const sugg = card.querySelector('.es-suggerimenti');
      card.querySelector('.b-sugg').addEventListener('click', () => {
        if (dati >= e.suggerimenti.length) { CMASC.dici('Suggerimenti finiti: ora tocca a te. Se proprio non va, guarda la soluzione e poi rifallo da capo.', { tipo: 'commento', azione: true, espressione: 'pensa', durata: 5000 }); return; }
        const s = e.suggerimenti[dati]; dati++;
        const r = h('<div class="riquadro nota prosa"></div>'); r.innerHTML = md(s); sugg.appendChild(r);
        CMASC.espressione('pensa');
        card.querySelector('.b-sugg').textContent = dati < e.suggerimenti.length ? 'Altro suggerimento (' + (e.suggerimenti.length - dati) + ')' : 'Suggerimenti finiti';
      });
      const sol = card.querySelector('.es-soluzione'); const ol = sol.querySelector('.passi');
      e.soluzione.forEach(s => { const li = document.createElement('li'); li.className = 'prosa'; li.innerHTML = md(s); ol.appendChild(li); });
      card.querySelector('.b-sol').addEventListener('click', ev => { sol.hidden = !sol.hidden; ev.target.textContent = sol.hidden ? 'Mostra la soluzione' : 'Nascondi la soluzione'; if (!sol.hidden) { montaGrafici(sol, arg); CMASC.espressione('pensa'); } });
      if (e.risposta) {
        const box = card.querySelector('.es-risposta'); box.hidden = false;
        const esito = card.querySelector('.es-esito');
        let leggi;
        if (e.risposta.tipo === 'intervallo') {
          box.innerHTML = `<span class="intervallo"><select class="pa"><option value="(">(</option><option value="[">[</option></select><input class="da" placeholder="−∞ o numero"><span>;</span><input class="a" placeholder="+∞ o numero"><select class="pb"><option value=")">)</option><option value="]">]</option></select></span><button class="btn piccolo primario b-ok" type="button">Controlla</button>`;
          leggi = () => ({ da: box.querySelector('.da').value, a: box.querySelector('.a').value, chiusoDa: box.querySelector('.pa').value === '[', chiusoA: box.querySelector('.pb').value === ']' });
        } else {
          const ph = segnapostoSicuro(e.risposta, segnapostoDi(e.risposta));
          box.innerHTML = `<input type="text" inputmode="text" placeholder="${esc(ph)}" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn piccolo primario b-ok" type="button">Controlla</button><div class="es-simboli" aria-label="Simboli">${tastiDi(e.risposta).map(c => `<button type="button" class="es-simbolo${c.length > 1 ? ' largo' : ''}" data-c="${c === '−' ? '-' : c}">${c}</button>`).join('')}</div>`;
          leggi = () => box.querySelector('input').value;
          /* i simboli che sulla tastiera del telefono non ci sono: si inseriscono dove sta il cursore */
          const inpS = box.querySelector('input');
          box.querySelectorAll('.es-simbolo').forEach(b => b.addEventListener('pointerdown', ev => { ev.preventDefault(); const c = b.dataset.c, a = (inpS.selectionStart != null ? inpS.selectionStart : inpS.value.length), z = (inpS.selectionEnd != null ? inpS.selectionEnd : a); inpS.value = inpS.value.slice(0, a) + c + inpS.value.slice(z); inpS.focus(); inpS.setSelectionRange(a + c.length, a + c.length); }));
          box.querySelector('input').addEventListener('keydown', ev => { if (ev.key === 'Enter') box.querySelector('.b-ok').click(); });
        }
        let tentativi = 0;
        box.querySelector('.b-ok').addEventListener('click', () => {
          const val = leggi(); if (val === '' || (typeof val === 'object' && !val.da && !val.a)) return;
          const esitoR = controllaRisposta(e.risposta, val);
          /* un'unità che non conosco non è un tentativo sbagliato: si chiede di riscriverla */
          if (esitoR === 'unita-ignota') { esito.hidden = false; esito.className = 'es-esito forse'; esito.textContent = 'Non riconosco l\'unità «' + RISP.separaMisura(val).unita + '». Scrivila come sul libro (m/s, km/h, J…), oppure scrivi solo il numero.'; CMASC.reagisci('pensa'); return; }
          const ok = esitoR === true; tentativi++;
          const senzaUnita = ok && e.risposta.unita && !RISP.separaMisura(val).unita;
          esito.hidden = false; esito.className = 'es-esito ' + (ok ? 'ok' : esitoR === 'unita' ? 'forse' : 'no');
          esito.textContent = ok ? (senzaUnita ? 'Giusto! Con l\'unità di misura: ' + numeroBello(e.risposta.valore) + ' ' + e.risposta.unita + '.' : 'Giusto!') :
            esitoR === 'unita' ? 'Il numero va, l\'unità no: ricontrolla l\'unità di misura.' :
            (tentativi >= 2 ? 'Non ancora. Prova un suggerimento, o guarda la soluzione.' : 'Non è questa. Ricontrolla i calcoli e riprova.');
          if (ok) {
            segnaFatto(e.id, true); card.classList.add('fatto'); card.querySelector('.fatto-spunta input').checked = true;
            festa(box.querySelector('.b-ok')); CMASC.reagisci('giusto');
            if (alGiusto) alGiusto();
          } else if (tentativi >= 2) CMASC.espressione('confuso', 2600);   /* il consiglio è già nell'esito: un fumetto lo coprirebbe */
          else CMASC.reagisci('sbagliato');
        });
      }
      montaGrafici(card, arg);
      return card;
    }

    /* ---- allenamento: gli esercizi di base, uno alla volta ---- */
    let allenamento = null;
    if (base.length) {
      const sez = h(`<section class="allenamento">
        <div class="al-testa"><div><h2>Allenamento</h2><p>${base.length} esercizi di base, solo su questo argomento. Uno alla volta: quando lo hai fatto, passa al prossimo.</p></div><div class="al-conto"><b>0</b>/${base.length}</div></div>
        <div class="al-barra"><i></i></div>
        <div class="al-pallini" role="tablist" aria-label="Esercizi di base"></div>
        <div class="al-carta"></div>
        <div class="al-nav"><button type="button" class="btn b-prec">${ICONE.destra} Precedente</button><button type="button" class="btn primario b-succ">Prossimo ${ICONE.destra}</button></div>
      </section>`);
      pan.appendChild(sez);
      const pallini = sez.querySelector('.al-pallini'), posto = sez.querySelector('.al-carta');
      const primoDaFare = () => { const k = base.findIndex(e => !p.eserciziFatti.includes(e.id)); return k < 0 ? 0 : k; };
      let i = primoDaFare();
      base.forEach((e, k) => { const b = h(`<button type="button" class="al-pallino" role="tab" aria-label="Esercizio ${k + 1}">${k + 1}</button>`); b.addEventListener('click', () => vai(k)); pallini.appendChild(b); });
      function vai(k, dir) {
        i = Math.max(0, Math.min(base.length - 1, k));
        const nuova = creaCarta(base[i], 'Esercizio ' + (i + 1) + ' di ' + base.length, () => { sez.querySelector('.b-succ').classList.add('pulsa'); });
        nuova.classList.add(dir === -1 ? 'da-sinistra' : 'da-destra');
        posto.innerHTML = ''; posto.appendChild(nuova);
        aggiorna();
        const inp = nuova.querySelector('.es-risposta input'); if (inp && dir) setTimeout(() => inp.focus({ preventScroll: true }), 350);
      }
      function aggiorna() {
        const fatti = base.filter(e => p.eserciziFatti.includes(e.id)).length;
        sez.querySelector('.al-conto b').textContent = fatti;
        sez.querySelector('.al-barra i').style.width = (100 * fatti / base.length) + '%';
        [...pallini.children].forEach((b, k) => { b.classList.toggle('fatto', p.eserciziFatti.includes(base[k].id)); b.classList.toggle('attivo', k === i); b.setAttribute('aria-selected', k === i); });
        const att = pallini.children[i]; if (att && att.scrollIntoView) att.scrollIntoView({ block: 'nearest', inline: 'center' });
        sez.querySelector('.b-prec').disabled = i === 0;
        const succ = sez.querySelector('.b-succ'); succ.classList.remove('pulsa');
        succ.innerHTML = i === base.length - 1 ? 'Agli esercizi avanzati ' + ICONE.destra : 'Prossimo ' + ICONE.destra;
        if (fatti === base.length && !sez.dataset.finito) { sez.dataset.finito = '1'; CMASC.reagisci('traguardo', 'Tutti e ' + base.length + ' gli esercizi di base fatti. Adesso prova quelli avanzati.'); }
      }
      sez.querySelector('.b-prec').addEventListener('click', () => vai(i - 1, -1));
      sez.querySelector('.b-succ').addEventListener('click', () => { if (i === base.length - 1) { const t = pan.querySelector('.avanzati-titolo'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else vai(i + 1, 1); });
      allenamento = { aggiorna };
      vai(i);
    }

    /* ---- esercizi avanzati (o tutti, se l'argomento non ha l'allenamento) ---- */
    if (avanzati.length) {
      pan.appendChild(h(`<div class="avanzati-titolo"><h2>${base.length ? 'Esercizi avanzati' : 'Esercizi'}</h2><p class="sotto-pagina">${base.length ? 'Qui l\'argomento si mescola con quelli che hai già studiato, e servono più passaggi.' : 'Prova da solo.'} Se ti blocchi, chiedi un suggerimento: arrivano uno alla volta. La soluzione completa aprila per ultima.</p></div>`));
      let filtro = 0, nascondiFatti = false;
      const filtri = h(`<div class="es-filtri"><button class="btn piccolo attivo" data-d="0" type="button">Tutti</button><button class="btn piccolo" data-d="1" type="button">★ facili</button><button class="btn piccolo" data-d="2" type="button">★★ medi</button><button class="btn piccolo" data-d="3" type="button">★★★ difficili</button><span class="spazio" style="flex:1"></span><label class="fatto-spunta" style="display:inline-flex;gap:6px;align-items:center;font-size:.86rem;color:var(--testo2)"><input type="checkbox" class="b-nascondi"> nascondi i fatti</label></div>`);
      pan.appendChild(filtri);
      const lista = document.createElement('div'); pan.appendChild(lista);
      filtri.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { filtro = +b.dataset.d; filtri.querySelectorAll('[data-d]').forEach(x => x.classList.toggle('attivo', x === b)); applica(); }));
      filtri.querySelector('.b-nascondi').addEventListener('change', e => { nascondiFatti = e.target.checked; applica(); });
      function applica() { lista.querySelectorAll('.esercizio').forEach(el => { const d = +el.dataset.d, fatto = el.classList.contains('fatto'); el.hidden = (filtro && d !== filtro) || (nascondiFatti && fatto); }); }
      avanzati.forEach((e, k) => lista.appendChild(creaCarta(e, (k + 1) + '.')));
    }
  }

  /* =====================================================================
     QUIZ
     ===================================================================== */
  function schedaQuiz(pan, arg, v) {
    const p = progresso(v.id);
    const avvio = h(`<div class="scheda quiz-avvio"><h2>Quiz di teoria</h2><p>Domande su definizioni, proprietà e ragionamenti: niente calcoli lunghi. Dopo ogni risposta vedi subito se è giusta e perché.${p.quizTot ? `<br>Il tuo miglior risultato: <b>${p.quizMigliore}/${p.quizTot}</b>.` : ''}</p>
      <div class="quiz-opz"><span style="align-self:center;color:var(--testo2)">Quante domande?</span>${[5, 10, arg.quiz.length].filter((n, i, a) => n <= arg.quiz.length && a.indexOf(n) === i).map(n => `<button class="btn" data-n="${n}" type="button">${n === arg.quiz.length ? 'Tutte (' + n + ')' : n}</button>`).join('')}</div></div>`);
    pan.appendChild(avvio);
    avvio.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => avviaQuiz(pan, arg, v, +b.dataset.n)));
  }
  function avviaQuiz(pan, arg, v, n) {
    pan.innerHTML = '';
    const domande = mescola(arg.quiz).slice(0, n).map(q => {
      const opz = q.opzioni.map((o, i) => ({ testo: o, giusta: i === q.corretta }));
      return { q, opz: mescola(opz) };
    });
    let i = 0, punteggio = 0; const esiti = [];
    const barra = h('<div class="quiz-barra"><i style="width:0%"></i></div>'); pan.appendChild(barra);
    const card = h('<div class="scheda quiz-domanda"></div>'); pan.appendChild(card);
    function mostra() {
      const d = domande[i];
      barra.querySelector('i').style.width = (i / domande.length * 100) + '%';
      card.innerHTML = `<div class="num">Domanda ${i + 1} di ${domande.length}</div><h3 class="prosa">${md(d.q.domanda)}</h3><div class="quiz-opzioni"></div><div class="quiz-spiega prosa" hidden></div><div class="riga-btn" style="margin-top:14px;justify-content:flex-end"><button class="btn primario b-avanti" type="button" hidden>${i + 1 < domande.length ? 'Avanti' : 'Vedi il risultato'} ${ICONE.destra}</button></div>`;
      const cont = card.querySelector('.quiz-opzioni');
      d.opz.forEach((o, k) => {
        const b = h(`<button class="quiz-opzione prosa" type="button" data-lettera="${'ABCD'[k]}"></button>`); b.innerHTML = md(o.testo);
        b.addEventListener('click', () => {
          cont.querySelectorAll('button').forEach(x => { x.disabled = true; });
          b.classList.add(o.giusta ? 'giusta' : 'sbagliata');
          cont.querySelectorAll('button').forEach((x, j) => { if (d.opz[j].giusta) x.classList.add('giusta'); });
          if (o.giusta) { punteggio++; festa(b); CMASC.reagisci('giusto'); } else CMASC.reagisci('sbagliato');
          esiti.push({ q: d.q, ok: o.giusta });
          const sp = card.querySelector('.quiz-spiega'); sp.hidden = false; sp.innerHTML = md(d.q.spiegazione);
          card.querySelector('.b-avanti').hidden = false;
        });
        cont.appendChild(b);
      });
      card.querySelector('.b-avanti').addEventListener('click', () => { i++; if (i < domande.length) mostra(); else fine(); });
      montaGrafici(card, arg);
      window.scrollTo({ top: Math.max(0, card.getBoundingClientRect().top + window.scrollY - 130), behavior: 'smooth' });
    }
    function fine() {
      const p = progresso(v.id);
      if (!p.quizTot || punteggio / domande.length > p.quizMigliore / p.quizTot) { p.quizMigliore = punteggio; p.quizTot = domande.length; }
      p.quizUltimo = punteggio; salva();
      barra.querySelector('i').style.width = '100%';
      const frazione = punteggio / domande.length;
      const commento = frazione === 1 ? 'Tutte giuste. Se fossi una nuvola, adesso pioverei di gioia.' : frazione >= 0.7 ? 'Bene. Le sbagliate le trovi qui sotto con la spiegazione: rileggile e sono tue.' : frazione >= 0.5 ? 'A metà strada. Torna alla teoria per le sezioni delle domande sbagliate, poi rifai il quiz.' : 'Questa volta è andata così. Ripassa la teoria con calma: il quiz non evapora, e nemmeno io.';
      card.innerHTML = `<div class="quiz-risultato"><div class="punteggio">${punteggio} / ${domande.length}</div><div class="commento">${esc(commento)}</div>
        <div class="riga-btn" style="justify-content:center"><button class="btn primario b-rifai" type="button">Rifai il quiz</button><a class="btn" href="#/argomento/${v.id}/teoria">Torna alla teoria</a><a class="btn" href="#/argomento/${v.id}/esercizi">Vai agli esercizi</a></div>
        <div class="quiz-riepilogo"></div></div>`;
      const rie = card.querySelector('.quiz-riepilogo');
      esiti.forEach(e => { const x = h(`<div class="voce ${e.ok ? 'ok' : 'no'}"><span class="segno">${e.ok ? '✓' : '✕'}</span><div class="prosa"></div></div>`); x.querySelector('.prosa').innerHTML = md(e.q.domanda) + (e.ok ? '' : '<div class="quiz-spiega">' + md(e.q.spiegazione) + '</div>'); rie.appendChild(x); });
      card.querySelector('.b-rifai').addEventListener('click', () => avviaQuiz(pan, arg, v, n));
      const tab = app.querySelector('.scheda-tab[href$="/quiz"]'); if (tab) { let s = tab.querySelector('.spunta'); if (!s) { s = document.createElement('span'); s.className = 'spunta'; tab.appendChild(document.createTextNode(' ')); tab.appendChild(s); } s.textContent = p.quizMigliore + '/' + p.quizTot; }
      /* il commento sta già nel riquadro del risultato: Stilla reagisce solo con la faccia */
      CMASC.reagisci(frazione >= 0.7 ? 'livello' : 'pensa');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    mostra();
  }

  /* =====================================================================
     RIPASSO GLOBALE
     ===================================================================== */
  function paginaRipasso(azione) {
    paginaCorrente = 'ripasso'; document.title = 'Ripasso — Quanto';
    svuota();
    const ora = Date.now();
    const argomentiConCarte = IND.argomenti.filter(a => stato.progressi[a.id] && stato.progressi[a.id].visitato);
    app.appendChild(h(`<div><h1 class="titolo-pagina">Ripasso</h1><p class="sotto-pagina">Le flashcard di tutti gli argomenti che hai aperto, con il metodo delle scatole: una carta che sai passa alla scatola successiva e torna dopo più tempo (1, 3, 7, 14 giorni); una che non sai torna nella prima scatola. Studia solo le carte che hai selezionato in ogni argomento.</p></div>`));
    if (!argomentiConCarte.length) { app.appendChild(h('<div class="scheda fc-vuoto">Non hai ancora aperto nessun argomento. <a href="#/">Comincia da uno</a>: le sue carte compariranno qui.</div>')); return; }
    const scelta = h('<div class="scheda" style="padding:16px 20px"><b>Argomenti da includere</b><div class="scelta-argomenti"></div><div class="riga-btn"><button class="btn primario b-dovute" type="button">Ripassa le carte in scadenza</button><button class="btn b-tutte" type="button">Studia tutte le selezionate</button></div></div>');
    const griglia = scelta.querySelector('.scelta-argomenti');
    const inclusi = new Set(JSON.parse(sessionStorage.getItem('quanto.ripasso') || 'null') || argomentiConCarte.map(a => a.id));
    argomentiConCarte.forEach(a => {
      const carte = stato.carte[a.id] || {}; const dovute = Object.values(carte).filter(c => c.prossima && c.prossima <= ora).length;
      const l = h(`<label data-arg="${a.id}"><input type="checkbox" ${inclusi.has(a.id) ? 'checked' : ''}> ${esc(a.titolo)} <small>${dovute ? dovute + ' in scadenza' : ''}</small></label>`);
      l.querySelector('input').addEventListener('change', e => { e.target.checked ? inclusi.add(a.id) : inclusi.delete(a.id); sessionStorage.setItem('quanto.ripasso', JSON.stringify([...inclusi])); });
      griglia.appendChild(l);
    });
    app.appendChild(scelta);
    const studio = document.createElement('div'); studio.style.marginTop = '18px'; app.appendChild(studio);
    async function avvia(soloDovute) {
      studio.innerHTML = '<div class="fc-vuoto">Preparo il mazzo…</div>';
      const ids = [...inclusi]; const argomenti = await Promise.all(ids.map(id => caricaArgomento(id).catch(() => null)));
      let mazzo = [];
      argomenti.forEach(arg => { if (!arg) return; selezionate(arg).forEach(c => { const sc = statoCarta(arg.id, c.id); if (!soloDovute || (sc.prossima > 0 && sc.prossima <= Date.now())) mazzo.push({ arg, carta: c }); }); });
      studio.innerHTML = '';
      if (soloDovute && !mazzo.length) { studio.appendChild(h('<div class="scheda fc-vuoto">Nessuna carta in scadenza oggi. Puoi studiare comunque tutte le selezionate.</div>')); return; }
      mazzo = mazzo.sort((x, y) => statoCarta(x.arg.id, x.carta.id).prossima - statoCarta(y.arg.id, y.carta.id).prossima);
      const ricontaScadenze = () => griglia.querySelectorAll('label[data-arg]').forEach(l => { const n = Object.values(stato.carte[l.dataset.arg] || {}).filter(c => c.prossima && c.prossima <= Date.now()).length; l.querySelector('small').textContent = n ? n + ' in scadenza' : ''; });
      studioFlashcard(studio, mazzo, { multi: true, vuoto: 'Nessuna carta selezionata negli argomenti scelti.', dopoValuta: ricontaScadenze });
      studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    scelta.querySelector('.b-dovute').addEventListener('click', () => avvia(true));
    scelta.querySelector('.b-tutte').addEventListener('click', () => avvia(false));
    if (azione === 'oggi' || carteDaRipassare()) avvia(true);
  }

  /* =====================================================================
     GALLERIA DEI FISICI (gli aneddoti di tutti gli argomenti, raccolti per persona)
     ===================================================================== */
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  /* stessa persona scritta in modi diversi ("Galileo Galilei", "Galileo"; "Isaac Newton", "Newton") → una chiave sola */
  const ALIAS = { galileo: 'galilei', archimedes: 'archimede', euler: 'eulero', descartes: 'cartesio', kepler: 'keplero', aristotle: 'aristotele', ptolemy: 'tolomeo', copernicus: 'copernico', kelvin: 'william-thomson' };
  const FERMI = new Set(['di', 'da', 'de', 'del', 'della', 'dei', 'degli', 'von', 'van', 'der', 'la', 'le', 'il', 'lo', 'gli', 'i', 'the', 'sir', 'lord', 'alessandria', 'siracusa', 'samo', 'mileto', 'pisa', 'jr', 'sr', 'ii', 'iii']);
  function chiaveFisico(nome) {
    const base = String(nome).replace(/\([^)]*\)/g, '').trim();
    if (/\s+e\s+/i.test(base) && base.split(/\s+e\s+/).length === 2 && /^[A-ZÀ-Ý]/.test(base.split(/\s+e\s+/)[1] || '')) return slug(base);   /* coppie: "Tartaglia e Cardano" restano coppie */
    const tok = slug(base).split('-').filter(t => t && !FERMI.has(t));
    if (!tok.length) return slug(base);
    if (tok[0] === 'al' && tok[1]) return 'al-' + tok[1];
    const ultimo = tok[tok.length - 1];
    return ALIAS[ultimo] || ultimo;
  }
  function annoDa(anni) {
    /* «I secolo d.C.», «V secolo a.C.»: metà del secolo */
    const r = String(anni).match(/\b([IVX]+)\s+sec/);
    if (r && !/\d{3,4}/.test(anni)) { const v = { I: 1, V: 5, X: 10 }; let n = 0; const c = r[1]; for (let i = 0; i < c.length; i++) { const a = v[c[i]], b = v[c[i + 1]] || 0; n += a < b ? -a : a; } const y = (n - 1) * 100 + 50; return /a\.\s?C/i.test(anni) ? -y : y; }
    const m = String(anni).match(/(\d{3,4})/); if (!m) return null;
    let a = parseInt(m[1], 10); if (/a\.\s?C/i.test(anni)) a = -a; return a;
  }
  /* l'anno dell'opera, non della nascita: nascita + 42 (senza superare la morte, né oggi). Einstein va nel Novecento,
     Galileo nel Seicento, Faraday nell'Ottocento. Serve all'epoca, all'ordine e alla linea del tempo. */
  function annoOpera(anni) {
    const n = annoDa(anni); if (n == null) return null;
    if (!/\d{3,4}/.test(anni)) return n;   /* «III secolo a.C.»: annoDa dà già la metà del secolo */
    const numeri = String(anni).match(/\d{3,4}/g) || [], ac = /a\.\s?C/i.test(anni);
    const morte = numeri.length > 1 ? parseInt(numeri[1], 10) * (ac ? -1 : 1) : new Date().getFullYear();
    return Math.min(n + 42, morte);
  }
  /* il nome della scuola italiana per chi sui libri ha il nome italianizzato (le chiavi interne sono già quelle) */
  const NOME_SCUOLA = { cartesio: 'Cartesio (René Descartes)', eulero: 'Eulero (Leonhard Euler)' };
  const coloreDa = s => 'var(--a' + ((slug(s).split('').reduce((x, c) => x + c.charCodeAt(0), 0) % 6) + 1) + ')';
  /* ---------- chi compare in un aneddoto: le coppie («Newton e Leibniz») diventano due persone ---------- */
  const ANNI_NOTI = { erone: 'I secolo d.C.', tolomeo: 'II secolo d.C.' };
  /* stessa famiglia, persone diverse: la chiave usa nome e cognome (Daniel e Jakob Bernoulli, J. J. e William Thomson, Marie e Pierre Curie) */
  const OMONIMI = new Set(['bernoulli', 'thomson', 'curie', 'bragg', 'herschel', 'bohr']);
  const COLLETTIVO = /^(gli|i|la|le|il)\s|leggenda|equipaggio|apollo|collaborazione|esperimento/i;
  /* chi è il protagonista di un aneddoto: il campo è «fisico» (in Compasso era «matematico») */
  const chiDi = an => String(an.fisico || an.matematico || '');
  function personeDi(an) {
    const nome = chiDi(an), anni = String(an.anni || '');
    if (COLLETTIVO.test(nome)) {
      const scacchiera = /scacchier|sessa/i.test(nome);
      return [{ chiave: scacchiera ? 'leggenda-scacchiera' : slug(nome.replace(/\([^)]*\)/g, '')), nome: nome.replace(/\s*\(pseudonimo[^)]*\)/, ''), anni, collettivo: true }];
    }
    const parti = nome.replace(/\([^)]*\)/g, '').trim().split(/,\s+|\s+e\s+/).map(x => x.trim()).filter(Boolean);
    const anniParti = anni.split(/\s+e\s+/);
    /* l'appellativo fra parentesi («conte di Rumford») resta nel nome mostrato di una persona sola */
    const appellativo = parti.length === 1 ? (nome.match(/\(([^)]*)\)/) || [])[1] : null;
    return parti.map((p, i) => {
      let k = chiaveFisico(p); if (OMONIMI.has(k)) k = slug(p);
      const lord = /kelvin/i.test(nome) && /william/i.test(p) ? ' (Lord Kelvin)' : appellativo && !/pseudonimo/i.test(appellativo) ? ' (' + appellativo + ')' : '';
      return { chiave: k, nome: NOME_SCUOLA[k] || (p + lord), anni: ANNI_NOTI[k] || (anniParti.length === parti.length ? anniParti[i] : anni), originale: nome };
    });
  }
  const cognome = p => { const t = slug(p.nome.replace(/\([^)]*\)/g, '')).split('-').filter(x => x && !FERMI.has(x)); return p.collettivo ? 'zzz' + p.nome : (t[t.length - 1] || p.nome); };
  const EPOCHE = [[-9999, 'Antichità', 'fino al V secolo'], [500, 'Medioevo', 'dal VI al XV secolo'], [1450, 'Rinascimento', 'dal 1450 al 1600'], [1600, 'Seicento', 'la rivoluzione scientifica'], [1700, 'Settecento', ''], [1800, 'Ottocento', 'calore ed elettricità'], [1900, 'Novecento', 'relatività e quanti'], [1990, 'Oggi', '']];
  const epocaDi = p => { if (p.collettivo || p.anno == null) return null; let e = EPOCHE[0]; EPOCHE.forEach(x => { if (p.anno >= x[0]) e = x; }); return e; };

  function paginaFisici(sel) {
    paginaCorrente = 'fisici'; document.title = 'I fisici — Quanto';
    svuota();
    app.appendChild(h('<div><h1 class="titolo-pagina">Le persone dietro le leggi</h1><p class="sotto-pagina">Tutti gli aneddoti che Stilla racconta, raccolti per persona: chi ha misurato, sbagliato, riprovato. Tocca un nome per leggere le storie e vedere in quali argomenti compare.</p></div>'));
    const cont = h('<div class="fc-vuoto">Sto raccogliendo le storie da tutti gli argomenti…</div>'); app.appendChild(cont);
    cont.dataset.attesa = '1';
    Promise.all(IND.argomenti.map(a => caricaArgomento(a.id).catch(() => null))).then(argomenti => {
      const persone = {};
      argomenti.forEach(arg => { if (!arg) return; (arg.aneddoti || []).forEach(an => personeDi(an).forEach(q => {
        const p = persone[q.chiave] || (persone[q.chiave] = { chiave: q.chiave, nome: q.nome, anni: q.anni, anno: annoOpera(q.anni), collettivo: !!q.collettivo, storie: [], argomenti: [], nomi: [] });
        if (q.nome.length < p.nome.length && !q.collettivo && !NOME_SCUOLA[q.chiave]) p.nome = q.nome;   /* la forma più corta è di solito la più pulita */
        if (q.originale && p.nomi.indexOf(q.originale) < 0) p.nomi.push(q.originale);   /* per la ricerca: anche «Rumford» */
        /* le date con i numeri vincono su quelle a secoli («570–495 a.C.» meglio di «VI secolo a.C.») */
        if ((p.anno == null && annoDa(q.anni) != null) || (!/\d{3,4}/.test(p.anni) && /\d{3,4}/.test(q.anni))) { p.anno = annoOpera(q.anni); p.anni = q.anni; }
        if (!p.storie.some(s => s.an === an)) p.storie.push({ an, arg });
        if (!p.argomenti.includes(arg.id)) p.argomenti.push(arg.id);
      })); });
      const tutte = Object.values(persone);
      cont.innerHTML = ''; cont.className = ''; delete cont.dataset.attesa;   /* via lo stile dell'attesa (centrato, grigio) */
      if (!tutte.length) { cont.textContent = 'Nessun aneddoto disponibile.'; return; }
      const imp = stato.impostazioni; const scelta = { ordina: imp.matOrdina || 'epoca', gruppi: imp.matGruppi || 'no', cerca: '' };

      /* dettaglio */
      const det = document.createElement('div');
      function mostraDettaglio(p) {
        det.innerHTML = '';
        const d = h(`<section class="scheda mat-dettaglio"><div class="mat-dett-testa"><span class="ritratto" style="background:${coloreDa(p.nome)}">${esc(iniziali(p.nome))}</span><div><h2>${esc(p.nome)}</h2><div style="color:var(--testo2)">${esc(p.anni)}</div></div><button type="button" class="btn piccolo fantasma mat-chiudi" aria-label="Chiudi">✕</button></div></section>`);
        d.querySelector('.mat-chiudi').addEventListener('click', () => { det.innerHTML = ''; history.replaceState(null, '', '#/fisici'); });
        p.storie.forEach(({ an, arg }) => {
          const a = h(`<article class="aneddoto"><h3>${esc(an.titolo)}</h3><div class="prosa"></div><div class="legame"></div></article>`);
          a.querySelector('.prosa').innerHTML = md(an.testo);
          a.querySelector('.legame').innerHTML = (an.legame ? md(an.legame) : '') + `<a href="#/argomento/${arg.id}">→ ${esc(arg.titolo)}</a>`;
          d.appendChild(a);
        });
        det.appendChild(d);
        det.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      /* linea del tempo */
      const conAnno = tutte.filter(p => p.anno != null && !p.collettivo);
      if (conAnno.length > 1) {
        const min = Math.min(...conAnno.map(p => p.anno)), max = Math.max(...conAnno.map(p => p.anno));
        /* scala a tratti: l'antichità è lunga e vuota, gli ultimi cinque secoli sono pieni */
        const nodi = [[min, 0], [0, 0.12], [1500, 0.25], [Math.max(max, 1990), 1]].filter((n, i, a) => i === 0 || n[0] > a[i - 1][0]);
        const posTempo = anno => { for (let i = 1; i < nodi.length; i++) if (anno <= nodi[i][0]) return (nodi[i - 1][1] + (anno - nodi[i - 1][0]) / (nodi[i][0] - nodi[i - 1][0]) * (nodi[i][1] - nodi[i - 1][1])) * 100; return 100; };
        const lt = h('<div class="linea-tempo"><div class="asse"></div></div>'); const asse = lt.querySelector('.asse');
        conAnno.forEach(p => {
          const t = h(`<span class="tacca" data-chiave="${esc(p.chiave)}" style="left:${posTempo(p.anno)}%;background:${coloreDa(p.nome)}" title="${esc(p.nome)} (${esc(p.anni)})"></span>`);
          t.addEventListener('click', () => mostraDettaglio(p));
          asse.appendChild(t);
        });
        (innerWidth < 500 ? [0, 1500, 1700, 1800, 1900] : [-500, 0, 1000, 1300, 1500, 1600, 1700, 1800, 1900, 1950]).filter(a => a >= min - 100 && a <= Math.max(max, 1990)).forEach((a, i) => asse.appendChild(h(`<span class="anno ${i % 2 ? 'sopra' : ''}" style="left:${posTempo(a)}%">${a < 0 ? -a + ' a.C.' : a}</span>`)));
        cont.appendChild(lt);
      }

      /* comandi: cerca, ordina, raggruppa */
      const bottoni = (nome, voci) => `<div class="mat-scelta" role="group" aria-label="${nome}"><span>${nome}</span>${voci.map(([v, t]) => `<button type="button" class="btn piccolo" data-v="${v}">${t}</button>`).join('')}</div>`;
      const comandi = h(`<div class="mat-comandi">
        <div class="cerca mat-cerca">${ICONE.cerca}<input type="search" placeholder="Cerca un nome…" autocomplete="off"></div>
        ${bottoni('Ordina', [['epoca', 'per epoca'], ['nome', 'per nome'], ['storie', 'per numero di storie']])}
        ${bottoni('Raggruppa', [['no', 'niente'], ['epoca', 'per epoca'], ['area', 'per area'], ['argomento', 'per argomento']])}
        <div class="mat-conta"></div>
      </div>`);
      cont.appendChild(comandi);
      cont.appendChild(det);
      const zona = document.createElement('div'); cont.appendChild(zona);
      const [selOrd, selGr] = comandi.querySelectorAll('.mat-scelta');
      const aggiornaBottoni = () => { selOrd.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === scelta.ordina)); selGr.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === scelta.gruppi)); };
      selOrd.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; scelta.ordina = imp.matOrdina = b.dataset.v; salva(); disegna(); });
      selGr.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; scelta.gruppi = imp.matGruppi = b.dataset.v; salva(); disegna(); });
      comandi.querySelector('input').addEventListener('input', e => { scelta.cerca = e.target.value.trim().toLowerCase(); disegna(); });

      const ordinatore = {
        epoca: (a, b) => (a.collettivo - b.collettivo) || ((a.anno == null ? 9999 : a.anno) - (b.anno == null ? 9999 : b.anno)),
        nome: (a, b) => (a.collettivo - b.collettivo) || cognome(a).localeCompare(cognome(b), 'it'),
        storie: (a, b) => (b.storie.length - a.storie.length) || ((a.anno == null ? 9999 : a.anno) - (b.anno == null ? 9999 : b.anno))
      };
      function carta(p) {
        const areeP = [...new Set(p.argomenti.map(id => (voce(id) || {}).area))].map(area).filter(Boolean);
        const c = h(`<div class="scheda mat${p.collettivo ? ' collettivo' : ''}" role="button" tabindex="0"><span class="ritratto" style="background:${coloreDa(p.nome)}">${esc(p.collettivo ? '✦' : iniziali(p.nome))}</span><div><h3>${esc(p.nome)}</h3><small>${esc(p.anni)} · ${p.storie.length} ${p.storie.length === 1 ? 'storia' : 'storie'}</small><span class="mat-aree">${areeP.map(a => `<i style="background:var(--${a.colore})" title="${esc(a.nome)}"></i>`).join('')}</span></div></div>`);
        c.addEventListener('click', () => { history.replaceState(null, '', '#/fisici/' + p.chiave); mostraDettaglio(p); });
        c.addEventListener('keydown', e => { if (e.key === 'Enter') c.click(); });
        return c;
      }
      function griglia(lista, titolo, sotto) {
        const g = h('<section class="mat-gruppo"></section>');
        if (titolo) g.appendChild(h(`<div class="mat-gruppo-testa"><h2>${titolo}</h2>${sotto ? `<span>${sotto}</span>` : ''}<span class="mat-gruppo-n">${lista.length}</span></div>`));
        const gr = h('<div class="griglia-mat"></div>'); lista.forEach(p => gr.appendChild(carta(p))); g.appendChild(gr);
        zona.appendChild(g);
      }
      function disegna() {
        aggiornaBottoni();
        zona.innerHTML = '';
        const q = scelta.cerca;
        const lista = tutte.filter(p => !q || slug(p.nome + ' ' + (p.nomi || []).join(' ')).includes(slug(q)) || p.nome.toLowerCase().includes(q)).sort(ordinatore[scelta.ordina]);
        comandi.querySelector('.mat-conta').textContent = lista.length === tutte.length ? tutte.filter(p => !p.collettivo).length + ' persone' + (tutte.some(p => p.collettivo) ? ' e ' + tutte.filter(p => p.collettivo).length + ' storie senza un autore' : '') : lista.length + ' su ' + tutte.length;
        cont.querySelectorAll('.linea-tempo .tacca').forEach(t => t.classList.toggle('spenta', !!q && !lista.some(p => p.chiave === t.dataset.chiave)));
        if (!lista.length) { zona.appendChild(h('<div class="fc-vuoto">Nessuno con questo nome.</div>')); return; }
        if (scelta.gruppi === 'no') { griglia(lista); return; }
        if (scelta.gruppi === 'epoca') {
          EPOCHE.forEach(e => { const l = lista.filter(p => epocaDi(p) === e); if (l.length) griglia(l, e[1], e[2]); });
          const senza = lista.filter(p => !epocaDi(p)); if (senza.length) griglia(senza, 'Leggende e opere senza un autore');
          return;
        }
        if (scelta.gruppi === 'area') {
          IND.aree.forEach(ar => { const l = lista.filter(p => p.argomenti.some(id => (voce(id) || {}).area === ar.id)); if (l.length) griglia(l, `<span class="simbolo-mini" style="background:var(--${ar.colore})">${esc(ar.simbolo)}</span>${esc(ar.nome)}`); });
          return;
        }
        IND.argomenti.forEach(a => { const l = lista.filter(p => p.argomenti.includes(a.id)); if (l.length) griglia(l, `<a href="#/argomento/${a.id}">${esc(a.titolo)}</a>`, esc((area(a.area) || {}).nome || '')); });
      }
      disegna();
      if (sel) { const p = persone[sel] || persone[chiaveFisico(sel.replace(/-/g, ' '))] || tutte.find(x => slug(x.nome).includes(sel)); if (p) mostraDettaglio(p); }
    });
  }
  function iniziali(nome) {
    /* «Ibn al-Haytham» → IH: la parte dopo il trattino conta; le parentesi no */
    const parti = nome.replace(/\([^)]*\)/g, '').replace(/^(gli|i|le|la|il)\s+/i, '').split(/\s+e\s+|\s+/).map(w => /^[a-z]+-[A-ZÀ-Ý]/.test(w) ? w.split('-').pop() : w).filter(w => /^[A-ZÀ-Ý]/.test(w));
    return (parti[0] || nome)[0] + (parti.length > 1 ? parti[parti.length - 1][0] : '');
  }

  /* =====================================================================
     IMPOSTAZIONI
     ===================================================================== */
  /* dopo un import o un azzeramento: tema, lettura, mascotte e distintivo come dice lo stato nuovo */
  function riapplicaStato() { applicaTema(); applicaLettura(); CMASC.visibile(stato.impostazioni.mascotte); aggiornaBadge(); }
  function paginaImpostazioni() {
    paginaCorrente = 'impostazioni'; document.title = 'Impostazioni — Quanto';
    svuota();
    const imp = stato.impostazioni;
    app.appendChild(h('<h1 class="titolo-pagina">Impostazioni</h1>'));
    app.appendChild(h('<p class="sotto-pagina">Tutto quello che fai (progressi, carte, selezioni) resta in questo browser. Puoi esportarlo e reimportarlo su un altro dispositivo.</p>'));
    const sez = h('<section class="scheda"></section>'); app.appendChild(sez);
    sez.innerHTML = `
      <div class="impostazione"><div class="desc">Tema<small>Chiaro, scuro o come il sistema.</small></div><select class="s-tema" style="padding:8px;border-radius:8px;border:1px solid var(--bordo2);background:var(--sup)"><option value="auto">Automatico</option><option value="chiaro">Chiaro</option><option value="scuro">Scuro</option></select></div>
      <div class="impostazione"><div class="desc">Lettura facilitata<small>Testo più grande, più spazio fra righe, lettere e parole, niente corsivo. Si accende anche dal pulsante «Aa» in alto.</small></div><button class="interruttore s-lett" role="switch" aria-checked="${!!imp.letturaFacile}" type="button"></button></div>
      <div class="impostazione"><div class="desc">Stilla, la mascotte<small>Suggerimenti e aneddoti mentre studi. Spenta, resta comunque disponibile nei pulsanti «Suggerimento».</small></div><button class="interruttore s-masc" role="switch" aria-checked="${imp.mascotte}" type="button"></button></div>
      <div class="impostazione"><div class="desc">Mescola le flashcard<small>Se è spento, le carte seguono l'ordine della teoria.</small></div><button class="interruttore s-mesc" role="switch" aria-checked="${imp.mescola}" type="button"></button></div>
      <div class="impostazione"><div class="desc">Esporta i progressi<small>Un file JSON con progressi, carte tue e selezioni.</small></div><button class="btn piccolo s-esp" type="button">Esporta</button></div>
      <div class="impostazione"><div class="desc">Importa i progressi<small>Sostituisce quelli attuali.</small></div><label class="btn piccolo">Scegli il file<input type="file" accept="application/json" class="s-imp" hidden></label></div>
      <div class="impostazione"><div class="desc">Azzera tutto<small>Cancella progressi, carte tue e selezioni. Non si torna indietro.</small></div><button class="btn piccolo s-azz" type="button" style="color:var(--no);border-color:var(--no)">Azzera</button></div>`;
    app.appendChild(h(`<div class="versione">Quanto v${VERSIONE}</div>`));
    const tema = sez.querySelector('.s-tema'); tema.value = imp.tema; tema.addEventListener('change', () => { imp.tema = tema.value; salva(); applicaTema(); });
    sez.querySelector('.s-lett').addEventListener('click', e => { imp.letturaFacile = !imp.letturaFacile; e.target.setAttribute('aria-checked', imp.letturaFacile); salva(); applicaLettura(); });
    sez.querySelector('.s-masc').addEventListener('click', e => { imp.mascotte = !imp.mascotte; e.target.setAttribute('aria-checked', imp.mascotte); salva(); CMASC.visibile(imp.mascotte); });
    sez.querySelector('.s-mesc').addEventListener('click', e => { imp.mescola = !imp.mescola; e.target.setAttribute('aria-checked', imp.mescola); salva(); });
    sez.querySelector('.s-esp').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(stato, null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'quanto-progressi.json'; document.body.appendChild(a); a.click(); a.remove();
    });
    sez.querySelector('.s-imp').addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => { const d = JSON.parse(t); if (!d || typeof d !== 'object' || !d.progressi) throw new Error('formato'); stato = Object.assign(statoBase(), d); salva(); riapplicaStato(); route(); CMASC.dici('Progressi importati.', { tipo: 'commento', azione: true, espressione: 'felice', durata: 3000 }); }).catch(() => alert('File non valido.'));
    });
    sez.querySelector('.s-azz').addEventListener('click', () => { if (confirm('Cancellare davvero tutti i progressi?')) { stato = statoBase(); salva(); riapplicaStato(); route(); } });
  }

  /* =====================================================================
     MASCOTTE: comportamenti
     ===================================================================== */
  function raccontaAneddoto(arg) {
    const an = scegli(arg.aneddoti);
    const html = `<p><span class="chi">${esc(chiDi(an))}</span> <small class="anni">${esc(an.anni)}</small><br><b>${esc(an.titolo)}</b></p>${md(an.testo)}${an.legame ? '<p style="color:var(--testo2);font-size:.88rem">' + md(an.legame).replace(/^<p>|<\/p>$/g, '') + '</p>' : ''}`;
    CMASC.dici(html, { tipo: 'aneddoto', html: true, chiesto: true, espressione: 'felice', azioni: [{ testo: 'Un altro', fn: () => raccontaAneddoto(arg) }, { testo: 'Tutti i fisici', fn: () => naviga('#/fisici/' + personeDi(an)[0].chiave) }] });
  }
  function menuMascotte() {
    if (CMASC.aperta()) { CMASC.chiudi(); return; }
    const arg = argCorrente && registro[argCorrente];
    if (arg) {
      CMASC.dici('Vuoi un suggerimento o una storia?', { tipo: 'commento', chiesto: true, espressione: 'felice', azioni: [
        { testo: 'Un suggerimento', fn: () => { const s = scegli(arg.suggerimenti); CMASC.dici(md(s.testo), { tipo: s.tipo === 'errore' ? 'errore' : 'suggerimento', html: true, chiesto: true, espressione: 'pensa', azioni: [{ testo: 'Un altro', fn: () => document.querySelector('.mascotte-figura').click() }] }); } },
        { testo: 'Un aneddoto', fn: () => raccontaAneddoto(arg) }
      ] });
    } else if (paginaCorrente === 'lab' && labCorrente) {
      CMASC.dici(labCorrente.intro || labCorrente.sotto, { tipo: 'suggerimento', titolo: 'Come si gioca', chiesto: true, espressione: 'pensa', azioni: [{ testo: 'Torna all\'argomento', fn: () => naviga('#/argomento/' + labCorrente.argomento + '/teoria') }] });
    } else {
      CMASC.dici(scegli(CONSIGLI), { tipo: 'suggerimento', chiesto: true, espressione: 'pensa', azioni: [
        { testo: 'Un altro', fn: () => { CMASC.chiudi(); menuMascotte(); } },
        { testo: 'Una storia a caso', fn: () => { const v = scegli(IND.argomenti); caricaArgomento(v.id).then(raccontaAneddoto).catch(() => CMASC.dici('Quella storia non è ancora pronta. Riprova.', { tipo: 'commento', azione: true, durata: 3000 })); } }
      ] });
    }
  }
  CMASC.monta(document.body);
  document.querySelector('.mascotte-figura').addEventListener('click', menuMascotte);
  CMASC.visibile(stato.impostazioni.mascotte);

  /* avvio */
  aggiornaBadge();
  route();
})();
