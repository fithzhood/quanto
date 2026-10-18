/* Quanto — motore dei grafici (SVG), parser di espressioni e lettore delle risposte con le unità.
   Preso da Compasso (compasso-grafici.js) e allargato alla fisica: vettori con componenti, somma
   punta-coda, grafici orari (tipo 'orario', variabile t, assi con le unità), misure come «12 m/s».
   Nessuna dipendenza. Espone window.CGRAF (e module.exports per il validatore).
   Specifiche accettate: vedi SCHEMA.md §3. */
(function () {
  'use strict';

  /* ============================================================
     1. PARSER DI ESPRESSIONI
     Sintassi: x^2 - 2*x - 3, 2x, sin(x), sqrt(x+1), abs(x), pi, e
     Moltiplicazione implicita: 2x, 3(x+1), x(x-2), 2pi
     ============================================================ */
  const FUNZ = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x),
    asin: Math.asin, arcsin: Math.asin, acos: Math.acos, arccos: Math.acos,
    atan: Math.atan, arctan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    exp: Math.exp, ln: Math.log, log: Math.log, log10: Math.log10, log2: Math.log2,
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil,
    round: (x, n) => { const k = Math.pow(10, n || 0); return Math.round(x * k) / k; }, sign: Math.sign, min: Math.min, max: Math.max, pow: Math.pow,
    /* se(condizione, a, b): a se la condizione è vera (diversa da zero), b altrimenti; i confronti valgono 1 o 0 */
    se: (c, a, b) => (c ? a : b),
    fact: n => { if (n < 0 || n !== Math.floor(n)) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  };
  const COST = { pi: Math.PI, 'π': Math.PI, e: Math.E, inf: Infinity, Infinity: Infinity };

  function tokenizza(s) {
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++;
        if (s[j] === 'e' && /[0-9]/.test(s[j + 1] || '')) { j++; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        t.push({ k: 'num', v: parseFloat(s.slice(i, j)) }); i = j; continue;
      }
      if (/[A-Za-zπ_]/.test(c)) {
        let j = i; while (j < s.length && /[A-Za-z0-9π_]/.test(s[j])) j++;
        t.push({ k: 'id', v: s.slice(i, j) }); i = j; continue;
      }
      /* confronti (per se(…)): <, >, <=, >=, ==, != */
      if ((c === '<' || c === '>' || c === '=' || c === '!') && s[i + 1] === '=') { t.push({ k: c + '=' }); i += 2; continue; }
      if (c === '<' || c === '>') { t.push({ k: c }); i++; continue; }
      if (c === '≤' || c === '≥' || c === '≠') { t.push({ k: c === '≤' ? '<=' : c === '≥' ? '>=' : '!=' }); i++; continue; }
      if ('+-*/^(),!'.includes(c)) { t.push({ k: c }); i++; continue; }
      if (c === '·' || c === '×') { t.push({ k: '*' }); i++; continue; }
      if (c === '−') { t.push({ k: '-' }); i++; continue; }
      throw new Error('Carattere non valido "' + c + '" in "' + s + '"');
    }
    t.push({ k: 'fine' });
    return t;
  }

  function analizza(src) {
    const tk = tokenizza(String(src)); let p = 0;
    const vede = () => tk[p], prendi = () => tk[p++];
    function attesa(k) { if (vede().k !== k) throw new Error('Atteso "' + k + '" in "' + src + '"'); return prendi(); }
    const CONFRONTI = ['<', '>', '<=', '>=', '==', '!='];
    function confronto() {
      let n = somma();
      while (CONFRONTI.indexOf(vede().k) >= 0) { const op = prendi().k; n = { t: op, a: n, b: somma() }; }
      return n;
    }
    function somma() {
      let n = prodotto();
      while (vede().k === '+' || vede().k === '-') { const op = prendi().k; n = { t: op, a: n, b: prodotto() }; }
      return n;
    }
    function iniziaFattore(x) { return x.k === 'num' || x.k === 'id' || x.k === '('; }
    function prodotto() {
      let n = unario();
      for (;;) {
        if (vede().k === '*' || vede().k === '/') { const op = prendi().k; n = { t: op, a: n, b: unario() }; }
        else if (iniziaFattore(vede())) { n = { t: '*', a: n, b: unario() }; }   // moltiplicazione implicita
        else break;
      }
      return n;
    }
    function unario() {
      if (vede().k === '-') { prendi(); return { t: 'neg', a: unario() }; }
      if (vede().k === '+') { prendi(); return unario(); }
      return potenza();
    }
    function potenza() {
      const base = postfisso();
      if (vede().k === '^') { prendi(); return { t: '^', a: base, b: unario() }; }
      return base;
    }
    function postfisso() {
      let n = atomo();
      while (vede().k === '!') { prendi(); n = { t: 'fn', f: 'fact', args: [n] }; }
      return n;
    }
    function atomo() {
      const x = prendi();
      if (x.k === 'num') return { t: 'num', v: x.v };
      if (x.k === 'id') {
        if (vede().k === '(' && FUNZ[x.v]) {
          prendi(); const args = [confronto()];
          while (vede().k === ',') { prendi(); args.push(confronto()); }
          attesa(')'); return { t: 'fn', f: x.v, args };
        }
        return { t: 'var', v: x.v };
      }
      if (x.k === '(') { const n = confronto(); attesa(')'); return n; }
      throw new Error('Espressione non valida: "' + src + '"');
    }
    const ast = confronto();
    if (vede().k !== 'fine') throw new Error('Testo in eccesso in "' + src + '"');
    return ast;
  }

  function variabili(ast, acc) {
    acc = acc || new Set();
    if (!ast) return acc;
    if (ast.t === 'var' && !(ast.v in COST)) acc.add(ast.v);
    if (ast.a) variabili(ast.a, acc);
    if (ast.b) variabili(ast.b, acc);
    if (ast.args) ast.args.forEach(a => variabili(a, acc));
    return acc;
  }

  function valuta(ast, v) {
    switch (ast.t) {
      case 'num': return ast.v;
      case 'var': return (v && ast.v in v) ? v[ast.v] : (ast.v in COST ? COST[ast.v] : NaN);
      case '+': return valuta(ast.a, v) + valuta(ast.b, v);
      case '-': return valuta(ast.a, v) - valuta(ast.b, v);
      case '*': return valuta(ast.a, v) * valuta(ast.b, v);
      case '/': return valuta(ast.a, v) / valuta(ast.b, v);
      case '^': return Math.pow(valuta(ast.a, v), valuta(ast.b, v));
      case 'neg': return -valuta(ast.a, v);
      case '<': return valuta(ast.a, v) < valuta(ast.b, v) ? 1 : 0;
      case '>': return valuta(ast.a, v) > valuta(ast.b, v) ? 1 : 0;
      case '<=': return valuta(ast.a, v) <= valuta(ast.b, v) ? 1 : 0;
      case '>=': return valuta(ast.a, v) >= valuta(ast.b, v) ? 1 : 0;
      case '==': return Math.abs(valuta(ast.a, v) - valuta(ast.b, v)) < 1e-9 ? 1 : 0;
      case '!=': return Math.abs(valuta(ast.a, v) - valuta(ast.b, v)) >= 1e-9 ? 1 : 0;
      case 'fn': return FUNZ[ast.f].apply(null, ast.args.map(a => valuta(a, v)));
    }
    return NaN;
  }

  const cacheComp = new Map();
  function compila(src) {
    if (typeof src === 'number') return () => src;
    const key = String(src);
    if (cacheComp.has(key)) return cacheComp.get(key);
    const ast = analizza(key);
    const f = v => valuta(ast, v);
    f.variabili = [...variabili(ast)];
    cacheComp.set(key, f);
    return f;
  }
  /* numero o espressione con parametri → numero */
  function num(x, vars) {
    if (x == null) return NaN;
    if (typeof x === 'number') return x;
    if (x === 'inf' || x === '+inf') return Infinity;
    if (x === '-inf') return -Infinity;
    return compila(x)(vars || {});
  }

  /* ============================================================
     2. UTILITÀ SVG
     ============================================================ */
  const NS = 'http://www.w3.org/2000/svg';
  function el(nome, attr, figli) {
    const e = document.createElementNS(NS, nome);
    if (attr) for (const k in attr) if (attr[k] != null) e.setAttribute(k, attr[k]);
    if (figli) (Array.isArray(figli) ? figli : [figli]).forEach(f => { if (f) e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return e;
  }
  /* il pedice: _{…} qualunque, oppure lettere e cifre attaccate, oppure un simbolo solo (∥ ⊥ ∞ ° ′ …) */
  const RE_PEDICE = /_\{([^}]*)\}|_([A-Za-z0-9α-ωΑ-Ω]+|[^\s{}()\[\],;:=+\-−·/|A-Za-z0-9])/g;
  /* lo stesso per l'HTML (etichette dei cursori): «F_∥» → F<sub>∥</sub> */
  const escHtml = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function riccoHtml(t) { return escHtml(t).replace(RE_PEDICE, (m, a, b) => '<sub>' + (a != null ? a : b) + '</sub>'); }
  /* testo con i pedici: «F_x», «v_0», «F_{12}», «F_∥» → tspan abbassati (gli altri caratteri restano come sono) */
  function ricco(t) {
    if (typeof t !== 'string' || t.indexOf('_') < 0) return t;
    const parti = [], re = RE_PEDICE; re.lastIndex = 0; let ult = 0, m, giu = false;
    while ((m = re.exec(t))) {
      if (m.index > ult) { parti.push(el('tspan', giu ? { dy: '-.22em' } : null, t.slice(ult, m.index))); giu = false; }
      const ped = m[1] != null ? m[1] : m[2];
      /* ∥ e ⊥ nel carattere dei titoli in corsivo escono come un blocco pieno: i simboli vanno in un carattere che li ha */
      parti.push(el('tspan', { dy: giu ? null : '.3em', 'font-size': '72%', style: /^[A-Za-z0-9α-ωΑ-Ω]+$/.test(ped) ? null : 'font-style:normal;font-family:"Segoe UI Symbol","Noto Sans Symbols 2","DejaVu Sans",sans-serif' }, ped)); giu = true;
      ult = re.lastIndex;
    }
    if (ult < t.length) parti.push(el('tspan', giu ? { dy: '-.22em' } : null, t.slice(ult)));
    return parti;
  }
  const fmt = (n, d) => {
    if (!isFinite(n)) return '';
    const r = Math.round(n * 1e6) / 1e6;
    return String(Number(r.toFixed(d == null ? 2 : d))).replace('.', ',').replace('-', '−');   /* il meno vero, non il trattino */
  };
  /* con i decimali fissi (per {{espressione|2}}): 2,50 */
  const fmtFisso = (n, d) => isFinite(n) ? (Math.abs(n) < 0.5 * Math.pow(10, -d) ? 0 : n).toFixed(d).replace('.', ',').replace('-', '−') : '';
  /* {{espressione}} nelle etichette: {{v}} col formato di serie (al massimo due decimali), {{v|1}} con un decimale fisso,
     {{? condizione | testo se vera | testo se falsa }} per un testo che cambia con i cursori */
  function modelloCon(vars) {
    return s => String(s).replace(/\{\{([^}]+)\}\}/g, (_, e) => {
      try {
        e = e.trim();
        if (e.charAt(0) === '?') { const parti = e.slice(1).split('|'); return num(parti[0].trim(), vars) ? (parti[1] || '').trim() : (parti[2] || '').trim(); }
        const k = e.lastIndexOf('|'), d = k > 0 ? parseInt(e.slice(k + 1), 10) : NaN;
        const v = num(k > 0 && isFinite(d) ? e.slice(0, k).trim() : e, vars);
        return !isFinite(v) ? 'non esiste' : isFinite(d) ? fmtFisso(v, d) : fmt(v);
      } catch (x) { return '?'; }
    });
  }
  /* il colore di un testo va nello stile: la classe .cg-etichetta del CSS vince sull'attributo fill */
  const colora = (t, col) => { if (col) t.style.fill = col; return t; };
  const colore = i => i === 'grigio' ? 'var(--g-testo)' : i === 'polo-n' ? 'var(--polo-n)' : i === 'polo-s' ? 'var(--polo-s)' : 'var(--s' + (((i || 1) - 1) % 4 + 1) + ')';   /* 'grigio': cose neutre (posizioni, guide) */
  let contatoreId = 0;

  /* passo "bello" per le tacche */
  function passoBello(range, target) {
    const grezzo = range / (target || 8);
    const mag = Math.pow(10, Math.floor(Math.log10(grezzo)));
    const n = grezzo / mag;
    const s = n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10;
    return s * mag;
  }
  function etichettaTacca(v, passo) {
    const d = passo >= 1 ? 0 : passo >= 0.1 ? 1 : 2;
    return fmt(v, d);
  }

  /* ============================================================
     3. PIANO CARTESIANO (funzioni + elementi geometrici)
     ============================================================ */
  /* trascinamento dei punti: i gestori stanno sull'svg (che sopravvive ai ridisegni) */
  function iniziaTrascinamento(svg) {
    if (svg.__dragInit) return; svg.__dragInit = true;
    const coord = ev => { const c = svg.__ctx; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return [c.xmin + (q.x - c.m.l) / c.pw * (c.xmax - c.xmin), c.ymax - (q.y - c.m.t) / c.ph * (c.ymax - c.ymin)]; };
    svg.addEventListener('pointermove', ev => { const d = svg.__drag; if (!d) return; ev.preventDefault(); const [x, y] = coord(ev); const c = svg.__ctx;
      if (d.giro) { const g = d.giro, cx = num(g.centro[0], c.vars), cy = num(g.centro[1], c.vars); let a = Math.atan2(y - cy, x - cx); if (g.gradi) { a = a * 180 / Math.PI; if (a < 0) a += 360; } else if (a < 0) a += 2 * Math.PI; c.vars[g.parametro] = c.limita(g.parametro, a, 'giro'); c.aggiorna(); return; }
      if (d.px) c.vars[d.px] = c.limita(d.px, x, 'x'); if (d.py) c.vars[d.py] = c.limita(d.py, y, 'y'); c.aggiorna(); });
    const fine = () => { svg.__drag = null; };
    svg.addEventListener('pointerup', fine); svg.addEventListener('pointercancel', fine);
  }

  /* nome e unità da un'etichetta d'asse: «v (m/s)» → ['v', 'm/s'] */
  function nomeUnita(et) { const m = String(et || '').match(/^(.*?)\s*\(([^)]+)\)\s*$/); return m ? [m[1].trim(), m[2].trim()] : [String(et || '').trim(), '']; }

  function renderPiano(spec, vars, svgEl, aggiorna) {
    const W = 600;
    const maniglie = [];
    const modello = modelloCon(vars);
    /* grafici orari: la variabile delle funzioni si chiama t (e vale anche x) */
    const varT = spec.variabile === 't';
    const conX = x => Object.assign({}, vars, varT ? { x, t: x } : { x });
    const xr = spec.x || [-5, 5], yr = spec.y || [-5, 5];
    let xmin = num(xr[0], vars), xmax = num(xr[1], vars), ymin = num(yr[0], vars), ymax = num(yr[1], vars);
    /* figure geometriche (e vettori): stessa scala sui due assi, altrimenti i cerchi diventano ellissi e gli angoli mentono */
    const geometrico = spec.proporzioni === 'uguali' || (spec.proporzioni !== 'libere' && (spec.assi === false || (spec.elementi || []).some(e => ['cerchio', 'angolo', 'poligono', 'ellisse', 'vettore', 'somma'].includes(e.tipo))));
    const rapporto = (ymax - ymin) / (xmax - xmin);
    let H = Math.round(W * rapporto);
    if (spec.altezza) H = spec.altezza; else H = Math.max(220, Math.min(520, H));
    /* il margine sinistro si misura sulla tacca più lunga dell'asse y («160», «−20», «0,5»): con 34 fissi, come in
       Compasso, le tacche a tre cifre si tagliavano. Si conta a 21 px, la misura delle tacche sul telefono. */
    let ml = 34;
    if (spec.assi !== false) {
      const pyStima = spec.passo ? num(spec.passo[1], vars) : passoBello(ymax - ymin, 8);
      for (let y = Math.ceil(ymin / pyStima) * pyStima; y <= ymax + 1e-9; y += pyStima) {
        const t = etichettaTacca(y, pyStima), w = t.split('').reduce((a, c) => a + (/[,.]/.test(c) ? 6.3 : 12.6), 0);
        ml = Math.max(ml, Math.ceil(w + 10));
      }
    }
    const m = { l: ml, r: 16, t: 14, b: 26 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    if (geometrico) {
      const kx = pw / (xmax - xmin), ky = ph / (ymax - ymin);
      if (kx > ky) { const w = pw / ky, cx = (xmin + xmax) / 2; xmin = cx - w / 2; xmax = cx + w / 2; }
      else if (ky > kx) { const hg = ph / kx, cy = (ymin + ymax) / 2; ymin = cy - hg / 2; ymax = cy + hg / 2; }
    }
    const sx = x => m.l + (x - xmin) / (xmax - xmin) * pw;
    const sy = y => m.t + (ymax - y) / (ymax - ymin) * ph;
    const id = 'clip' + (++contatoreId);

    const svg = svgEl || el('svg');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'cg-svg cg-piano');
    svg.setAttribute('role', 'img');
    if (spec.didascalia) svg.setAttribute('aria-label', spec.didascalia);

    svg.appendChild(el('defs', null, el('clipPath', { id }, el('rect', { x: m.l, y: m.t, width: pw, height: ph }))));
    svg.appendChild(el('rect', { x: m.l, y: m.t, width: pw, height: ph, class: 'cg-sfondo' }));

    /* griglia e assi */
    const px = spec.passo ? num(spec.passo[0], vars) : passoBello(xmax - xmin, varT ? 7 : 10);   /* il tempo: tacche più rade */
    const py = spec.passo ? num(spec.passo[1], vars) : passoBello(ymax - ymin, 8);
    const gGriglia = el('g', { class: 'cg-griglia' });
    const gTacche = el('g', { class: 'cg-tacche' });
    if (spec.griglia !== false) {
      for (let x = Math.ceil(xmin / px) * px; x <= xmax + 1e-9; x += px) {
        gGriglia.appendChild(el('line', { x1: sx(x), x2: sx(x), y1: m.t, y2: m.t + ph }));
      }
      for (let y = Math.ceil(ymin / py) * py; y <= ymax + 1e-9; y += py) {
        gGriglia.appendChild(el('line', { x1: m.l, x2: m.l + pw, y1: sy(y), y2: sy(y) }));
      }
    }
    svg.appendChild(gGriglia);
    if (spec.assi !== false) {
      const gAssi = el('g', { class: 'cg-assi' });
      const y0 = (ymin <= 0 && ymax >= 0) ? sy(0) : (ymin > 0 ? sy(ymin) : sy(ymax));
      const x0 = (xmin <= 0 && xmax >= 0) ? sx(0) : (xmin > 0 ? sx(xmin) : sx(xmax));
      gAssi.appendChild(el('line', { x1: m.l, x2: m.l + pw, y1: y0, y2: y0, 'marker-end': 'url(#freccia-asse)' }));
      gAssi.appendChild(el('line', { x1: x0, x2: x0, y1: m.t + ph, y2: m.t }));
      /* frecce */
      gAssi.appendChild(el('path', { d: 'M' + (m.l + pw) + ',' + y0 + ' l-8,-4 v8 z', class: 'cg-freccia' }));
      gAssi.appendChild(el('path', { d: 'M' + x0 + ',' + m.t + ' l-4,8 h8 z', class: 'cg-freccia' }));
      const lx = (spec.etichette && spec.etichette.x) || 'x', ly = (spec.etichette && spec.etichette.y) || 'y';
      /* nei grafici orari il nome del tempo sta sotto l'asse, al posto delle ultime tacche: sopra l'asse c'è il moto */
      if (varT) gAssi.appendChild(el('text', { x: m.l + pw, y: y0 + 15, class: 'cg-nome-asse', 'text-anchor': 'end' }, ricco(lx)));
      else gAssi.appendChild(el('text', { x: m.l + pw - 4, y: y0 - 6, class: 'cg-nome-asse', 'text-anchor': 'end' }, ricco(lx)));
      gAssi.appendChild(el('text', { x: x0 + 8, y: m.t + 12, class: 'cg-nome-asse' }, ricco(ly)));
      /* quanto è largo il nome dell'asse x (a 22 px, la misura sul telefono): le tacche sotto di lui non si scrivono */
      const largoNome = String(lx).replace(/_\{?|\}/g, '').length * 11.5 + 14;
      /* tacche numeriche */
      for (let x = Math.ceil(xmin / px) * px; x <= xmax + 1e-9; x += px) {
        if (Math.abs(x) < 1e-9) continue;
        gTacche.appendChild(el('line', { x1: sx(x), x2: sx(x), y1: y0 - 3, y2: y0 + 3 }));
        const etx = etichettaTacca(x, px), mezza = etx.length * 6.3;
        if (sx(x) + mezza < m.l + pw - largoNome) gTacche.appendChild(el('text', { x: sx(x), y: y0 + 14, 'text-anchor': 'middle' }, etx));
      }
      for (let y = Math.ceil(ymin / py) * py; y <= ymax + 1e-9; y += py) {
        if (Math.abs(y) < 1e-9) continue;
        gTacche.appendChild(el('line', { x1: x0 - 3, x2: x0 + 3, y1: sy(y), y2: sy(y) }));
        gTacche.appendChild(el('text', { x: x0 - 6, y: sy(y) + 4, 'text-anchor': 'end' }, etichettaTacca(y, py)));
      }
      if (xmin <= 0 && xmax >= 0 && ymin <= 0 && ymax >= 0) gTacche.appendChild(el('text', { x: x0 - 6, y: y0 + 14, 'text-anchor': 'end' }, 'O'));
      svg.appendChild(gAssi);
      svg.appendChild(gTacche);
    }

    const gDati = el('g', { 'clip-path': 'url(#' + id + ')' });
    const gSopra = el('g');           /* etichette e punti, non ritagliati */
    svg.appendChild(gDati); svg.appendChild(gSopra);

    /* campionamento di una funzione → array di tratti */
    function campiona(fsrc, dom) {
      const f = compila(fsrc);
      const a = dom ? num(dom[0], vars) : xmin, b = dom ? num(dom[1], vars) : xmax;
      const N = 500, yrange = ymax - ymin;
      const tratti = []; let cur = [];
      let prev = null;
      /* dove la funzione smette di esistere (una radice di un numero negativo) si cerca il bordo con la bisezione,
         così la curva arriva fino allo zero invece di fermarsi al campione prima */
      const bordo = (xf, xn) => { for (let k = 0; k < 30; k++) { const xm = (xf + xn) / 2; if (isFinite(f(conX(xm)))) xf = xm; else xn = xm; } return xf; };
      let xPrec = null, finitoPrec = false;
      for (let i = 0; i <= N; i++) {
        const x = a + (b - a) * i / N;
        let y = f(conX(x));
        const finito = isFinite(y);
        if (xPrec !== null && finito !== finitoPrec) {
          const xb = finito ? bordo(x, xPrec) : bordo(xPrec, x), yb = f(conX(xb));
          if (isFinite(yb)) { const ybc = Math.max(ymin - yrange * 2, Math.min(ymax + yrange * 2, yb)); if (finito) { if (cur.length) tratti.push(cur); cur = [[sx(xb), sy(ybc)]]; } else cur.push([sx(xb), sy(ybc)]); }
        }
        xPrec = x; finitoPrec = finito;
        if (!finito) { if (cur.length) tratti.push(cur); cur = []; prev = null; continue; }
        /* salto verticale enorme → discontinuità (asintoto) */
        if (prev !== null && Math.abs(y - prev) > yrange * 1.5 && (y > ymax || y < ymin || prev > ymax || prev < ymin)) {
          if (cur.length) tratti.push(cur); cur = [];
        }
        const yc = Math.max(ymin - yrange * 2, Math.min(ymax + yrange * 2, y));
        cur.push([sx(x), sy(yc)]);
        prev = y;
      }
      if (cur.length) tratti.push(cur);
      return tratti;
    }
    const pathDa = tratti => tratti.map(t => 'M' + t.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L')).join(' ');

    /* elementi geometrici */
    const P = p => [sx(num(p[0], vars)), sy(num(p[1], vars))];
    /* ogni etichetta può contenere {{espressione}}: il valore si aggiorna quando si muove qualcosa;
       e i pedici con il trattino basso: F_x, v_0, F_{12} (dentro l'SVG non c'è KaTeX) */
    const etich = (x, y, testo, cls, anchor) => el('text', { x, y, class: 'cg-etichetta ' + (cls || ''), 'text-anchor': anchor || 'middle' }, ricco(typeof testo === 'string' && testo.includes('{{') ? modello(testo) : testo));
    /* un testo ruotato (rotazione in gradi, in senso antiorario come gli angoli) attorno al suo punto */
    const ruota = (t, x, y, gradi) => { const g = num(gradi, vars); if (isFinite(g) && g) t.setAttribute('transform', 'rotate(' + (-g).toFixed(2) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); return t; };
    /* una freccia vera: asta e punta piena, lunga quanto il vettore (la punta non sporge oltre la cima) */
    function freccia(A, B, col, o) {
      o = o || {};
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
      if (!(L > 0.5)) return;
      const sp = o.spessore || 2.6, h = Math.min(o.testa || (8 + sp * 2.2), L * 0.6), w = h * 0.52;
      const ux = dx / L, uy = dy / L, base = [B[0] - ux * h, B[1] - uy * h];
      const g = o.dove || gSopra;
      if (L > h) g.appendChild(el('line', { x1: A[0].toFixed(1), y1: A[1].toFixed(1), x2: (base[0] + ux).toFixed(1), y2: (base[1] + uy).toFixed(1), stroke: col, 'stroke-width': sp, 'stroke-linecap': o.tratteggio ? 'butt' : 'round', 'stroke-dasharray': o.tratteggio ? '6 4' : null, class: 'cg-vettore' + (o.tratteggio ? ' cg-componente' : '') }));
      g.appendChild(el('path', { d: 'M' + B[0].toFixed(1) + ',' + B[1].toFixed(1) + ' L' + (base[0] - uy * w).toFixed(1) + ',' + (base[1] + ux * w).toFixed(1) + ' L' + (base[0] + uy * w).toFixed(1) + ',' + (base[1] - ux * w).toFixed(1) + ' Z', fill: col, class: 'cg-punta' }));
    }
    /* l'etichetta di un vettore: a metà strada (un po' oltre), di fianco all'asta, mai sulla punta.
       lato = +1 a sinistra di chi cammina lungo il vettore, −1 a destra */
    /* il nome di una grandezza (F, v_0, F_x) va in corsivo; un valore con l'unità («9,8 m/s») resta in tondo */
    const classeVettore = t => 'cg-etichetta-vettore' + (/^[A-Za-zα-ωΑ-Ω](_\{?[A-Za-z0-9∥⊥∞]+\}?|[₀-₉ₓᵧ'′∥⊥]*)?(\s*[+−-]\s*[A-Za-zα-ωΑ-Ω](_\{?[A-Za-z0-9∥⊥∞]+\}?|[₀-₉ₓᵧ'′∥⊥]*)?)*$/.test(String(t).trim()) ? ' nome' : '');
    function etichettaVettore(A, B, testo, lato, col) {
      if (!testo) return;
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, k = 0.55, d = 14;
      const nx = dy / L * lato, ny = -dx / L * lato;
      const x = A[0] + dx * k + nx * d, y = A[1] + dy * k + ny * d;
      const anchor = Math.abs(nx) < 0.35 ? 'middle' : (nx > 0 ? 'start' : 'end');
      const t = etich(x, y + 4 + ny * 3, testo, classeVettore(testo), anchor);
      colora(t, col);
      gSopra.appendChild(t);
    }
    /* componenti di un vettore date come [dx, dy] oppure { modulo, angolo } (angolo in gradi dall'asse x) */
    const componentiDi = v => Array.isArray(v) ? [num(v[0], vars), num(v[1], vars)] : [num(v.modulo, vars) * Math.cos(num(v.angolo || 0, vars) * Math.PI / 180), num(v.modulo, vars) * Math.sin(num(v.angolo || 0, vars) * Math.PI / 180)];
    const spostamento = { alto: [0, -10], basso: [0, 16], destra: [10, 4], sinistra: [-10, 4], 'alto-destra': [8, -8], 'alto-sinistra': [-8, -8], 'basso-destra': [8, 14], 'basso-sinistra': [-8, 14] };
    const anchorDi = pos => /destra/.test(pos || '') ? 'start' : /sinistra/.test(pos || '') ? 'end' : 'middle';

    (spec.elementi || []).forEach(e => {
      const col = colore(e.colore);
      const tratt = e.tratteggio ? '7 5' : null;
      switch (e.tipo) {
        case 'area': {
          const f = compila(e.f), g = e.g ? compila(e.g) : null;
          const a = num(e.da, vars), b = num(e.a, vars), N = 200;
          const sopra = [], sotto = [];
          for (let i = 0; i <= N; i++) {
            const x = a + (b - a) * i / N, v = conX(x);
            let y1 = f(v), y2 = g ? g(v) : 0;
            if (!isFinite(y1)) y1 = 0; if (!isFinite(y2)) y2 = 0;
            sopra.push([sx(x), sy(y1)]); sotto.push([sx(x), sy(y2)]);
          }
          const d = 'M' + sopra.map(p => p.join(',')).join('L') + 'L' + sotto.reverse().map(p => p.join(',')).join('L') + 'Z';
          gDati.appendChild(el('path', { d, fill: col, 'fill-opacity': .22, stroke: 'none' }));
          if (e.etichetta) gSopra.appendChild(etich((sx(a) + sx(b)) / 2, sy(0) - 8, e.etichetta));
          break;
        }
        case 'tangente': {
          const f = compila(e.f), x0 = num(e.x0, vars), h = 1e-4;
          const y0 = f(conX(x0));
          const der = (f(conX(x0 + h)) - f(conX(x0 - h))) / (2 * h);
          const y1 = y0 + der * (xmin - x0), y2 = y0 + der * (xmax - x0);
          gDati.appendChild(el('line', { x1: sx(xmin), y1: sy(y1), x2: sx(xmax), y2: sy(y2), stroke: col, 'stroke-width': 2, 'stroke-dasharray': tratt }));
          gSopra.appendChild(el('circle', { cx: sx(x0), cy: sy(y0), r: 5, fill: col, class: 'cg-punto' }));
          if (e.etichetta !== false) gSopra.appendChild(etich(sx(x0), sy(y0) - 10, e.etichetta || ('m = ' + fmt(der))));
          break;
        }
        case 'retta': {
          let x1, y1, x2, y2;
          if (e.per) { const [p1, p2] = e.per; const ax = num(p1[0], vars), ay = num(p1[1], vars), bx = num(p2[0], vars), by = num(p2[1], vars);
            if (Math.abs(bx - ax) < 1e-12) { x1 = x2 = ax; y1 = ymin; y2 = ymax; } else { const mm = (by - ay) / (bx - ax); x1 = xmin; x2 = xmax; y1 = ay + mm * (xmin - ax); y2 = ay + mm * (xmax - ax); } }
          else { const mm = num(e.m, vars), q = num(e.q, vars); x1 = xmin; x2 = xmax; y1 = mm * xmin + q; y2 = mm * xmax + q; }
          gDati.appendChild(el('line', { x1: sx(x1), y1: sy(y1), x2: sx(x2), y2: sy(y2), stroke: col, 'stroke-width': 2, 'stroke-dasharray': tratt }));
          if (e.etichetta) { const xe = xmin + (xmax - xmin) * 0.8; const ye = y1 + (y2 - y1) * 0.8; gSopra.appendChild(etich(sx(xe), sy(ye) - 8, e.etichetta)); }
          break;
        }
        case 'verticale': {
          const x = num(e.x, vars);
          gDati.appendChild(el('line', { x1: sx(x), x2: sx(x), y1: m.t, y2: m.t + ph, stroke: col, 'stroke-width': 2, 'stroke-dasharray': tratt || (e.asintoto ? '7 5' : null) }));
          if (e.etichetta) gSopra.appendChild(etich(sx(x) + 6, m.t + 14, e.etichetta, '', 'start'));
          break;
        }
        case 'orizzontale': {
          const y = num(e.y, vars);
          gDati.appendChild(el('line', { y1: sy(y), y2: sy(y), x1: m.l, x2: m.l + pw, stroke: col, 'stroke-width': 2, 'stroke-dasharray': tratt || (e.asintoto ? '7 5' : null) }));
          if (e.etichetta) gSopra.appendChild(etich(m.l + pw - 6, sy(y) - 6, e.etichetta, '', 'end'));
          break;
        }
        case 'segmento': {
          const a = P(e.da), b = P(e.a);
          if (e.freccia) freccia(a, b, col, { tratteggio: !!e.tratteggio, spessore: 2.5, dove: gDati });
          else gDati.appendChild(el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': tratt, 'stroke-linecap': 'round' }));
          if (e.etichetta) { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; const nx = -dy / L * 10, ny = dx / L * 10; gSopra.appendChild(etich((a[0] + b[0]) / 2 + nx, (a[1] + b[1]) / 2 + ny + 4, e.etichetta)); }
          break;
        }
        case 'vettore': {
          /* da [x, y] (di serie l'origine) fino ad a [x, y], oppure modulo + angolo in gradi dall'asse x */
          const da = e.da || [0, 0], ax = num(da[0], vars), ay = num(da[1], vars);
          let bx, by;
          if (e.a) { bx = num(e.a[0], vars); by = num(e.a[1], vars); }
          else { const c = componentiDi({ modulo: e.modulo, angolo: e.angolo }); bx = ax + c[0]; by = ay + c[1]; }
          if (![ax, ay, bx, by].every(isFinite)) break;
          const A = [sx(ax), sy(ay)], B = [sx(bx), sy(by)];
          /* un vettore lungo zero non si disegna, e nemmeno la sua etichetta */
          if (Math.hypot(B[0] - A[0], B[1] - A[1]) < 2) break;
          const cc0 = e.componenti && e.componenti !== true ? e.componenti : {};
          if (e.componenti && cc0.lungo != null) {
            /* componenti lungo assi inclinati (il piano inclinato): u lungo l'asse di angolo «lungo», n perpendicolare */
            const th = num(cc0.lungo, vars) * Math.PI / 180, ux = Math.cos(th), uy = Math.sin(th);
            const vx = bx - ax, vy = by - ay, cu = vx * ux + vy * uy, cn = -vx * uy + vy * ux;
            const Pu = [ax + cu * ux, ay + cu * uy], Pn = [ax - cn * uy, ay + cn * ux];
            const SU = [sx(Pu[0]), sy(Pu[1])], SN = [sx(Pn[0]), sy(Pn[1])];
            const et = cc0.etichette || (e.etichetta ? [e.etichetta + '_∥', e.etichetta + '_⊥'] : []);
            const ccol = cc0.colore ? colore(cc0.colore) : col;
            if (Math.abs(cu) > 1e-9 && Math.abs(cn) > 1e-9) {
              gSopra.appendChild(el('line', { x1: B[0], y1: B[1], x2: SU[0], y2: SU[1], class: 'cg-proiezione' }));
              gSopra.appendChild(el('line', { x1: B[0], y1: B[1], x2: SN[0], y2: SN[1], class: 'cg-proiezione' }));
            }
            /* ogni etichetta dalla parte opposta al vettore intero (prodotto vettoriale componente × vettore) */
            const lato = (c1, c2) => (c1 * vy - c2 * vx > 0 ? -1 : 1);
            if (Math.abs(cu) > 1e-9) { freccia(A, SU, ccol, { tratteggio: true, spessore: 2.2 }); etichettaVettore(A, SU, et[0], lato(cu * ux, cu * uy), ccol); }
            if (Math.abs(cn) > 1e-9) { freccia(A, SN, ccol, { tratteggio: true, spessore: 2.2 }); etichettaVettore(A, SN, et[1], lato(-cn * uy, cn * ux), ccol); }
          } else if (e.componenti) {
            /* le due componenti partono dalla coda, lungo gli assi; la punta si proietta con due tratteggi */
            const cc = e.componenti === true ? {} : e.componenti;
            const et = cc.etichette || (e.etichetta ? [e.etichetta + '_x', e.etichetta + '_y'] : []);
            const ccol = cc.colore ? colore(cc.colore) : col;
            const Cx = [sx(bx), sy(ay)], Cy = [sx(ax), sy(by)];
            if (Math.abs(by - ay) > 1e-9 && Math.abs(bx - ax) > 1e-9) {
              gSopra.appendChild(el('line', { x1: B[0], y1: B[1], x2: Cx[0], y2: Cx[1], class: 'cg-proiezione' }));
              gSopra.appendChild(el('line', { x1: B[0], y1: B[1], x2: Cy[0], y2: Cy[1], class: 'cg-proiezione' }));
            }
            freccia(A, Cx, ccol, { tratteggio: true, spessore: 2.2 });
            freccia(A, Cy, ccol, { tratteggio: true, spessore: 2.2 });
            /* le etichette delle componenti stanno dalla parte interna (verso il vettore): fuori ci sono le tacche degli assi */
            if (et[0] && Math.abs(bx - ax) > 1e-9) gSopra.appendChild(colora(etich((A[0] + Cx[0]) / 2, A[1] + (by >= ay ? -9 : 20), et[0], classeVettore(et[0])), ccol));
            if (et[1] && Math.abs(by - ay) > 1e-9) gSopra.appendChild(colora(etich(A[0] + (bx >= ax ? 9 : -9), (A[1] + Cy[1]) / 2 + 5, et[1], classeVettore(et[1]), bx >= ax ? 'start' : 'end'), ccol));
          }
          freccia(A, B, col, { tratteggio: !!e.tratteggio, spessore: e.spessore || 3 });
          etichettaVettore(A, B, e.etichetta, e.posizione === 'destra' ? -1 : 1, col);
          break;
        }
        case 'somma': {
          /* somma punta-coda: ogni vettore parte dalla punta del precedente; la risultante va dalla prima coda
             all'ultima punta. Con parallelogramma: true (due vettori) partono tutti e due dalla stessa coda. */
          const da = e.da || [0, 0], x0 = num(da[0], vars), y0 = num(da[1], vars);
          const vs = (e.vettori || []).map(componentiDi);
          if (!vs.length || !vs.every(v => isFinite(v[0]) && isFinite(v[1]))) break;
          const colori = e.colori || vs.map((_, i) => i + 1), et = e.etichette || [];
          const sxT = vs.reduce((s, v) => s + v[0], 0), syT = vs.reduce((s, v) => s + v[1], 0);
          const O = [sx(x0), sy(y0)], S = [sx(x0 + sxT), sy(y0 + syT)];
          /* da che parte della risultante sta la catena: le etichette vanno dalla parte opposta */
          const croce = sxT * vs[0][1] - syT * vs[0][0], latoCatena = croce > 0 ? 1 : -1;
          if (e.parallelogramma && vs.length === 2) {
            const U = [sx(x0 + vs[0][0]), sy(y0 + vs[0][1])], V = [sx(x0 + vs[1][0]), sy(y0 + vs[1][1])];
            gSopra.appendChild(el('line', { x1: U[0], y1: U[1], x2: S[0], y2: S[1], class: 'cg-proiezione' }));
            gSopra.appendChild(el('line', { x1: V[0], y1: V[1], x2: S[0], y2: S[1], class: 'cg-proiezione' }));
            freccia(O, U, colore(colori[0])); etichettaVettore(O, U, et[0], latoCatena, colore(colori[0]));
            freccia(O, V, colore(colori[1])); etichettaVettore(O, V, et[1], -latoCatena, colore(colori[1]));
          } else {
            let cx = x0, cy = y0;
            vs.forEach((v, i) => { const A = [sx(cx), sy(cy)]; cx += v[0]; cy += v[1]; const B = [sx(cx), sy(cy)]; freccia(A, B, colore(colori[i])); etichettaVettore(A, B, et[i], latoCatena, colore(colori[i])); });
          }
          const R = e.risultante === false ? null : (e.risultante || {});
          if (R) { const rc = colore(R.colore || 4); freccia(O, S, rc, { spessore: 3.4 }); etichettaVettore(O, S, R.etichetta, R.posizione === 'destra' ? -1 : R.posizione === 'sinistra' ? 1 : -latoCatena, rc); }
          break;
        }
        case 'poligono': {
          const pts = e.punti.map(P);
          /* pieno: true riempie del tutto, con il bordo del colore dei poli (le calamite di magnetismo) */
          if (e.pieno) gDati.appendChild(el('polygon', { points: pts.map(p => p.join(',')).join(' '), stroke: 'var(--polo-bordo)', 'stroke-width': 2, fill: col, 'fill-opacity': 1, 'stroke-linejoin': 'round' }));
          else gDati.appendChild(el('polygon', { points: pts.map(p => p.join(',')).join(' '), stroke: col, 'stroke-width': 2.5, fill: e.riempi === false ? 'none' : col, 'fill-opacity': e.riempi === false ? 0 : .15, 'stroke-linejoin': 'round' }));
          if (e.etichette) { const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
            pts.forEach((p, i) => { if (!e.etichette[i]) return; const dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1; gSopra.appendChild(etich(p[0] + dx / L * 14, p[1] + dy / L * 14 + 4, e.etichette[i], 'cg-etichetta-punto')); }); }
          break;
        }
        case 'cerchio': {
          const c = P(e.centro), r = num(e.raggio, vars);
          const rx = r / (xmax - xmin) * pw, ry = r / (ymax - ymin) * ph;
          gDati.appendChild(el('ellipse', { cx: c[0], cy: c[1], rx, ry, stroke: col, 'stroke-width': 2.5, fill: e.riempi ? col : 'none', 'fill-opacity': e.riempi ? .12 : 0, 'stroke-dasharray': tratt }));
          if (e.etichetta) gSopra.appendChild(etich(c[0] + rx * 0.72, c[1] - ry * 0.72 - 4, e.etichetta));
          break;
        }
        case 'ellisse': {
          const c = P(e.centro), a = num(e.a, vars), b = num(e.b, vars);
          gDati.appendChild(el('ellipse', { cx: c[0], cy: c[1], rx: a / (xmax - xmin) * pw, ry: b / (ymax - ymin) * ph, stroke: col, 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': tratt }));
          break;
        }
        case 'angolo': {
          const v = [num(e.vertice[0], vars), num(e.vertice[1], vars)];
          const a1 = Math.atan2(num(e.da[1], vars) - v[1], num(e.da[0], vars) - v[0]);
          let a2 = Math.atan2(num(e.a[1], vars) - v[1], num(e.a[0], vars) - v[0]);
          const r = num(e.raggio == null ? 0.7 : e.raggio, vars);
          const rx = r / (xmax - xmin) * pw, ry = r / (ymax - ymin) * ph;
          let d = a2 - a1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
          /* oltre 180°: ampiezza in gradi (da «da», verso antiorario; negativa = orario), oppure verso forzato */
          if (e.ampiezza != null) d = num(e.ampiezza, vars) * Math.PI / 180;
          else if (e.verso === 'antiorario' && d < 0) d += 2 * Math.PI;
          else if (e.verso === 'orario' && d > 0) d -= 2 * Math.PI;
          const N = Math.max(24, Math.ceil(Math.abs(d) * 16)), pts = [];
          if (Math.abs(Math.abs(d) - Math.PI / 2) < 0.009 && e.retto !== false) {
            /* angolo retto: il quadratino dei libri, non l'arco */
            const V = [sx(v[0]), sy(v[1])], k = 0.75, p1 = [V[0] + k * rx * Math.cos(a1), V[1] - k * ry * Math.sin(a1)], p2 = [V[0] + k * rx * Math.cos(a1 + d), V[1] - k * ry * Math.sin(a1 + d)];
            gDati.appendChild(el('path', { d: 'M' + V.join(',') + 'L' + p1.join(',') + 'L' + (p1[0] + p2[0] - V[0]) + ',' + (p1[1] + p2[1] - V[1]) + 'L' + p2.join(',') + 'Z', fill: col, 'fill-opacity': .2, stroke: col, 'stroke-width': 1.5 }));
          } else {
            for (let i = 0; i <= N; i++) { const t = a1 + d * i / N; pts.push([sx(v[0]) + rx * Math.cos(t), sy(v[1]) - ry * Math.sin(t)]); }
            gDati.appendChild(el('path', { d: 'M' + sx(v[0]) + ',' + sy(v[1]) + 'L' + pts.map(p => p.join(',')).join('L') + 'Z', fill: col, 'fill-opacity': .25, stroke: col, 'stroke-width': 1.5 }));
          }
          if (e.etichetta) { const t = a1 + d / 2; gSopra.appendChild(etich(sx(v[0]) + rx * 1.6 * Math.cos(t), sy(v[1]) - ry * 1.6 * Math.sin(t) + 4, e.etichetta)); }
          break;
        }
        case 'testo': {
          const p = P(e.p);
          const tt = etich(p[0], p[1], modello(e.testo), e.classe || '', e.ancora || 'middle');
          if (e.colore) colora(tt, col);   /* testo colorato come la serie di cui parla */
          if (e.rotazione != null) ruota(tt, p[0], p[1], e.rotazione);
          gSopra.appendChild(tt);
          break;
        }
        case 'uscente': case 'entrante': {
          /* in un punto (p) oppure a griglia su un rettangolo (da, a, passo): il campo magnetico che esce o entra */
          const segno = (cx, cy) => {
            const r = e.raggio || 9;
            gSopra.appendChild(el('circle', { cx, cy, r, fill: 'var(--g-sfondo)', stroke: col, 'stroke-width': 2, class: 'cg-perpendicolare' }));
            if (e.tipo === 'uscente') gSopra.appendChild(el('circle', { cx, cy, r: r * 0.28, fill: col }));
            else { const k = r * 0.62; gSopra.appendChild(el('path', { d: 'M' + (cx - k) + ',' + (cy - k) + 'L' + (cx + k) + ',' + (cy + k) + 'M' + (cx + k) + ',' + (cy - k) + 'L' + (cx - k) + ',' + (cy + k), stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round' })); }
          };
          if (e.da && e.a) {
            const x1 = num(e.da[0], vars), y1 = num(e.da[1], vars), x2 = num(e.a[0], vars), y2 = num(e.a[1], vars), ps = num(e.passo || 1, vars);
            if (ps > 0) for (let gx = Math.min(x1, x2); gx <= Math.max(x1, x2) + 1e-9; gx += ps) for (let gy = Math.min(y1, y2); gy <= Math.max(y1, y2) + 1e-9; gy += ps) segno(sx(gx), sy(gy));
          } else if (e.p) { const q = P(e.p); if (isFinite(q[0]) && isFinite(q[1])) { segno(q[0], q[1]); if (e.etichetta) { const s2 = spostamento[e.posizione || 'alto-destra'] || spostamento['alto-destra']; gSopra.appendChild(colora(etich(q[0] + s2[0] * 1.4, q[1] + s2[1] * 1.4, e.etichetta, classeVettore(e.etichetta), anchorDi(e.posizione || 'alto-destra')), col)); } } }
          break;
        }
        case 'punto': {
          const p = P(e.p);
          if (!isFinite(p[0]) || !isFinite(p[1])) break;   /* punto non definito (es. Δ<0): non si disegna */
          gSopra.appendChild(el('circle', { cx: p[0], cy: p[1], r: e.raggio || (e.trascina ? 7 : 5), fill: e.vuoto ? 'var(--g-sfondo)' : col, stroke: e.trascina ? 'var(--g-sfondo)' : col, 'stroke-width': 2, class: 'cg-punto' + (e.trascina ? ' cg-punto-trascinabile' : '') }));
          if (e.etichetta) { const s = spostamento[e.posizione || 'alto-destra'] || spostamento['alto-destra']; gSopra.appendChild(etich(p[0] + s[0], p[1] + s[1], modello(e.etichetta), 'cg-etichetta-punto', anchorDi(e.posizione || 'alto-destra'))); }
          if (e.trascina) {
            const nome = i => (typeof e.p[i] === 'string' && /^[A-Za-z_]\w*$/.test(e.p[i].trim())) ? e.p[i].trim() : null;
            const h = el('circle', { cx: p[0], cy: p[1], r: 18, fill: 'transparent', class: 'cg-maniglia' });
            h.addEventListener('pointerdown', ev => { svg.__drag = e.giro ? { giro: e.giro } : { px: nome(0), py: nome(1) }; try { svg.setPointerCapture(ev.pointerId); } catch (x) { /* niente */ } ev.preventDefault(); });
            maniglie.push(h);
          }
          break;
        }
      }
    });

    /* funzioni */
    const funzioni = spec.funzioni || [];
    funzioni.forEach((fs, i) => {
      const col = colore(fs.colore || (i + 1));
      const tratti = campiona(fs.f, fs.dominio);
      gDati.appendChild(el('path', { d: pathDa(tratti), fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': fs.tratteggio ? '7 5' : null, 'stroke-linejoin': 'round', class: 'cg-curva' }));
      if (fs.etichetta) {
        /* etichetta diretta: sull'ultimo punto visibile del tratto più lungo */
        let migliore = null;
        tratti.forEach(t => t.forEach(p => { if (p[1] > m.t + 14 && p[1] < m.t + ph - 6 && (!migliore || p[0] > migliore[0])) migliore = p; }));
        if (migliore) gSopra.appendChild(el('text', { x: Math.min(migliore[0], m.l + pw - 4), y: migliore[1] - 8, class: 'cg-etichetta cg-etichetta-serie', 'text-anchor': 'end', fill: col, style: 'fill:' + col }, ricco(modello(fs.etichetta))));
      }
    });
    /* punti semplici (scorciatoia rispetto a elementi) */
    (spec.punti || []).forEach(pt => {
      const p = P([pt.x, pt.y]); const col = colore(pt.colore);
      if (!isFinite(p[0]) || !isFinite(p[1])) return;
      gSopra.appendChild(el('circle', { cx: p[0], cy: p[1], r: 5, fill: pt.vuoto ? 'var(--g-sfondo)' : col, stroke: col, 'stroke-width': 2, class: 'cg-punto' }));
      if (pt.etichetta) { const s = spostamento[pt.posizione || 'alto-destra'] || spostamento['alto-destra']; gSopra.appendChild(etich(p[0] + s[0], p[1] + s[1], pt.etichetta, 'cg-etichetta-punto', anchorDi(pt.posizione || 'alto-destra'))); }
    });

    /* mirino interattivo sulle funzioni */
    if (funzioni.length && spec.mirino !== false) {
      const gM = el('g', { class: 'cg-mirino', visibility: 'hidden' });
      const lv = el('line', { y1: m.t, y2: m.t + ph }); const cerchi = funzioni.map((_, i) => el('circle', { r: 4.5, fill: colore(funzioni[i].colore || (i + 1)) }));
      const box = el('g'); const rect = el('rect', { rx: 4, class: 'cg-tooltip-sfondo' }); const testo = el('text', { class: 'cg-tooltip-testo' });
      box.appendChild(rect); box.appendChild(testo);
      gM.appendChild(lv); cerchi.forEach(c => gM.appendChild(c)); gM.appendChild(box);
      svg.appendChild(gM);
      const cattura = el('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent', style: 'cursor:crosshair' });
      svg.appendChild(cattura);
      const muovi = ev => {
        const pt = svg.createSVGPoint(); const src = ev.touches ? ev.touches[0] : ev; pt.x = src.clientX; pt.y = src.clientY;
        const q = pt.matrixTransform(svg.getScreenCTM().inverse());
        const x = xmin + (q.x - m.l) / pw * (xmax - xmin);
        if (x < xmin || x > xmax) return;
        gM.setAttribute('visibility', 'visible');
        lv.setAttribute('x1', sx(x)); lv.setAttribute('x2', sx(x));
        /* nei grafici con le unità (orari) il mirino le scrive: «t = 2,5 s», «v = 7,5 m/s» */
        const [nx, ux] = nomeUnita((spec.etichette && spec.etichette.x) || 'x'), [ny, uy] = nomeUnita((spec.etichette && spec.etichette.y) || 'y');
        const conU = (v, u) => (isFinite(v) ? fmt(v) : '—') + (u && isFinite(v) ? ' ' + u : '');
        const righe = [(nx || 'x').replace(/_\{?([^}\s]*)\}?/g, '$1') + ' = ' + conU(x, ux)];
        funzioni.forEach((fs, i) => {
          const y = compila(fs.f)(conX(x));
          if (isFinite(y) && y >= ymin && y <= ymax) { cerchi[i].setAttribute('visibility', 'visible'); cerchi[i].setAttribute('cx', sx(x)); cerchi[i].setAttribute('cy', sy(y)); }
          else cerchi[i].setAttribute('visibility', 'hidden');
          righe.push((fs.etichetta ? modello(fs.etichetta).replace(/\s*=.*$/, '').replace(/_\{?([^}\s]*)\}?/g, '$1') : (ny || 'y').replace(/_\{?([^}\s]*)\}?/g, '$1')) + ' = ' + conU(y, uy));
        });
        while (testo.firstChild) testo.removeChild(testo.firstChild);
        righe.forEach((r, i) => testo.appendChild(el('tspan', { x: 0, dy: i ? 15 : 0 }, r)));
        const bw = Math.max(...righe.map(r => r.length)) * 7 + 14, bh = righe.length * 15 + 8;
        let bx = sx(x) + 12; if (bx + bw > W - 4) bx = sx(x) - bw - 12;
        box.setAttribute('transform', 'translate(' + bx + ',' + (m.t + 8) + ')');
        rect.setAttribute('x', -7); rect.setAttribute('y', -13); rect.setAttribute('width', bw); rect.setAttribute('height', bh);
      };
      cattura.addEventListener('mousemove', muovi);
      cattura.addEventListener('touchstart', muovi, { passive: true });
      cattura.addEventListener('touchmove', muovi, { passive: true });
      cattura.addEventListener('mouseleave', () => gM.setAttribute('visibility', 'hidden'));
    }
    if (maniglie.length) {
      const g = el('g', { class: 'cg-maniglie' }); maniglie.forEach(x => g.appendChild(x)); svg.appendChild(g);
      svg.__ctx = { xmin, xmax, ymin, ymax, m, pw, ph, vars, aggiorna: aggiorna || (() => {}), limita: (nome, v, asse) => {
        const p = (spec.parametri || []).find(q => q.nome === nome);
        let lo = asse === 'x' ? xmin : asse === 'giro' ? -Infinity : ymin, hi = asse === 'x' ? xmax : asse === 'giro' ? Infinity : ymax;
        if (p) { if (p.min != null) lo = num(p.min); if (p.max != null) hi = num(p.max); if (p.passo) v = Math.round(v / p.passo) * p.passo; }
        return Math.max(lo, Math.min(hi, Math.round(v * 1e6) / 1e6));
      } };
      iniziaTrascinamento(svg);
    }
    return svg;
  }

  /* ============================================================
     4. RETTA REALE (intervalli, per le disequazioni)
     ============================================================ */
  function renderRettaReale(spec, vars, svgEl) {
    /* riga: più intervalli sulla stessa riga (per esempio le due parti della soluzione di una disequazione) */
    const righe = (spec.intervalli || []).map((iv, i) => iv.riga != null ? iv.riga : i);
    const nRighe = righe.length ? Math.max(...righe) + 1 : 1;
    const W = 600, RIGA = 56, H = 100 + RIGA * Math.max(1, nRighe);   /* sul telefono diventa la metà: prima era schiacciata */
    const modello = modelloCon(vars);
    const xr = spec.x || [-5, 5]; const xmin = num(xr[0], vars), xmax = num(xr[1], vars);
    const m = { l: 24, r: 24 }; const pw = W - m.l - m.r;
    const sx = x => m.l + (x - xmin) / (xmax - xmin) * pw;
    const svg = svgEl || el('svg'); while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'cg-svg cg-retta-reale');
    const yAsse = H - 40;
    svg.appendChild(el('line', { x1: m.l, x2: m.l + pw, y1: yAsse, y2: yAsse, class: 'cg-asse-reale' }));
    svg.appendChild(el('path', { d: 'M' + (m.l + pw) + ',' + yAsse + ' l-8,-4 v8 z', class: 'cg-freccia' }));
    const passo = spec.passo || passoBello(xmax - xmin, 10);
    for (let x = Math.ceil(xmin / passo) * passo; x <= xmax - passo / 2; x += passo) {
      svg.appendChild(el('line', { x1: sx(x), x2: sx(x), y1: yAsse - 4, y2: yAsse + 4, class: 'cg-asse-reale' }));
      svg.appendChild(el('text', { x: sx(x), y: yAsse + 30, 'text-anchor': 'middle', class: 'cg-tacche' }, etichettaTacca(x, passo)));
    }
    (spec.intervalli || []).forEach((iv, i) => {
      const col = colore(iv.colore || (i + 1));
      const a = num(iv.da, vars), b = num(iv.a, vars);
      const xa = isFinite(a) ? sx(a) : m.l, xb = isFinite(b) ? sx(b) : m.l + pw;
      const y = yAsse - 20 - righe[i] * RIGA;
      svg.appendChild(el('line', { x1: xa, x2: xb, y1: y, y2: y, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'butt', opacity: .85 }));
      if (isFinite(a)) svg.appendChild(el('circle', { cx: xa, cy: y, r: 5.5, fill: iv.chiusoDa ? col : 'var(--g-sfondo)', stroke: col, 'stroke-width': 2.5 }));
      if (isFinite(b)) svg.appendChild(el('circle', { cx: xb, cy: y, r: 5.5, fill: iv.chiusoA ? col : 'var(--g-sfondo)', stroke: col, 'stroke-width': 2.5 }));
      if (iv.etichetta) svg.appendChild(el('text', { x: (xa + xb) / 2, y: y - 13, 'text-anchor': 'middle', class: 'cg-etichetta', fill: col, style: 'fill:' + col }, ricco(modello(iv.etichetta))));
      /* proiezione tratteggiata sull'asse */
      [a, b].forEach(v => { if (isFinite(v)) svg.appendChild(el('line', { x1: sx(v), x2: sx(v), y1: y, y2: yAsse, class: 'cg-griglia', 'stroke-dasharray': '3 3' })); });
    });
    (spec.punti || []).forEach(pt => {
      const x = num(pt.x, vars); const col = colore(pt.colore);
      svg.appendChild(el('circle', { cx: sx(x), cy: yAsse, r: 5.5, fill: pt.escluso ? 'var(--g-sfondo)' : col, stroke: col, 'stroke-width': 2.5 }));
      if (pt.etichetta) svg.appendChild(el('text', { x: sx(x), y: yAsse - 10, 'text-anchor': 'middle', class: 'cg-etichetta' }, ricco(modello(pt.etichetta))));
    });
    return svg;
  }

  /* ============================================================
     5. BARRE (statistica)
     ============================================================ */
  const serieMulti = spec => Array.isArray(spec.serie) && spec.serie.length > 1;
  function renderBarre(spec, vars, svgEl) {
    const W = 600;
    const cat = spec.categorie || [];
    /* le categorie: si misurano a 21 px (sul telefono); troppo larghe → due righe; ancora troppo → inclinate */
    const gruppo0 = (W - 60) / Math.max(1, cat.length), largo = t => String(t).length * 11;
    const dueRighe = t => { const w = String(t).split(' '); if (w.length < 2) return [String(t)]; let best = null; for (let k = 1; k < w.length; k++) { const a = w.slice(0, k).join(' '), b = w.slice(k).join(' '); const mx = Math.max(a.length, b.length); if (!best || mx < best[2]) best = [a, b, mx]; } return [best[0], best[1]]; };
    let modoCat = 'una';
    if (cat.some(c => largo(c) > gruppo0 - 6)) modoCat = cat.every(c => dueRighe(c).every(r => largo(r) <= gruppo0 - 6)) ? 'due' : 'inclinate';
    const lungaCat = Math.max(0, ...cat.map(c => String(c).length));
    const basso = modoCat === 'inclinate' ? 30 + Math.min(lungaCat, 16) * 8 : modoCat === 'due' ? 64 : 40;
    const H = (spec.altezza || 300) + (basso - 40);
    const m = { l: 44, r: 16, t: spec.etichettaY || serieMulti(spec) ? 36 : 18, b: basso + (spec.etichettaX ? 14 : 0) };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const serie = spec.serie || [{ nome: spec.nome || '', valori: spec.valori || [] }];
    const tutti = serie.flatMap(s => s.valori.map(v => num(v, vars)));
    const vmax = spec.max != null ? spec.max : Math.max(0, ...tutti);
    const vmin = Math.min(0, ...tutti);
    const passo = passoBello(vmax - vmin, 6);
    const top = Math.ceil(vmax / passo) * passo || passo, bottom = Math.floor(vmin / passo) * passo;
    const sy = v => m.t + (top - v) / (top - bottom) * ph;
    const svg = svgEl || el('svg'); while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'cg-svg cg-barre');
    const gG = el('g', { class: 'cg-griglia' }), gT = el('g', { class: 'cg-tacche' });
    for (let v = bottom; v <= top + 1e-9; v += passo) {
      gG.appendChild(el('line', { x1: m.l, x2: m.l + pw, y1: sy(v), y2: sy(v) }));
      gT.appendChild(el('text', { x: m.l - 8, y: sy(v) + 4, 'text-anchor': 'end' }, etichettaTacca(v, passo)));
    }
    svg.appendChild(gG); svg.appendChild(gT);
    svg.appendChild(el('line', { x1: m.l, x2: m.l + pw, y1: sy(0), y2: sy(0), class: 'cg-assi' }));
    const n = cat.length, ns = serie.length;
    const gruppo = pw / n, gap = Math.min(18, gruppo * 0.25), bw = (gruppo - gap) / ns - (ns > 1 ? 2 : 0);
    cat.forEach((c, i) => {
      serie.forEach((s, j) => {
        const v = num(s.valori[i], vars); const col = colore(s.colore || (j + 1));
        const x = m.l + i * gruppo + gap / 2 + j * (bw + (ns > 1 ? 2 : 0));
        const y1 = sy(Math.max(0, v)), y2 = sy(Math.min(0, v)); const h = Math.max(0, y2 - y1);
        const r = el('rect', { x, y: y1, width: bw, height: h, fill: col, rx: 3, class: 'cg-barra' });
        r.appendChild(el('title', null, c + (s.nome ? ' — ' + s.nome : '') + ': ' + fmt(v)));
        svg.appendChild(r);
        if (spec.valori_visibili !== false && n * ns <= 12) svg.appendChild(el('text', { x: x + bw / 2, y: (v >= 0 ? y1 - 5 : y2 + 13), 'text-anchor': 'middle', class: 'cg-etichetta cg-valore' }, fmt(v)));
      });
      const xc = m.l + i * gruppo + gruppo / 2, yc = m.t + ph + 22;
      if (modoCat === 'inclinate') svg.appendChild(el('text', { x: xc, y: yc, 'text-anchor': 'end', class: 'cg-tacche cg-categoria', transform: 'rotate(-40 ' + xc.toFixed(1) + ' ' + yc + ')' }, ricco(String(c))));
      else if (modoCat === 'due') { const [r1, r2] = dueRighe(c); const t = el('text', { x: xc, y: yc, 'text-anchor': 'middle', class: 'cg-tacche cg-categoria' }); t.appendChild(el('tspan', { x: xc }, r1)); if (r2) t.appendChild(el('tspan', { x: xc, dy: '1.15em' }, r2)); svg.appendChild(t); }
      else svg.appendChild(el('text', { x: xc, y: yc, 'text-anchor': 'middle', class: 'cg-tacche cg-categoria' }, ricco(String(c))));
    });
    if (spec.etichettaY) svg.appendChild(el('text', { x: 4, y: 16, class: 'cg-nome-asse' }, ricco(spec.etichettaY)));
    if (spec.etichettaX) svg.appendChild(el('text', { x: m.l + pw / 2, y: H - 4, 'text-anchor': 'middle', class: 'cg-nome-asse' }, ricco(spec.etichettaX)));
    if (ns > 1) { /* legenda */
      let lx = m.l + pw; serie.slice().reverse().forEach((s, k) => { const j = ns - 1 - k; const t = el('text', { x: lx, y: spec.etichettaY ? 32 : 13, 'text-anchor': 'end', class: 'cg-legenda' }, s.nome || ''); svg.appendChild(t); const larg = (s.nome || '').length * 6.5 + 18; svg.appendChild(el('rect', { x: lx - larg + 2, y: spec.etichettaY ? 22 : 3, width: 10, height: 10, rx: 2, fill: colore(s.colore || (j + 1)) })); lx -= larg + 10; });
    }
    return svg;
  }

  /* ============================================================
     6. CIRCONFERENZA GONIOMETRICA (interattiva)
     ============================================================ */
  function renderCirconferenza(spec, vars, svgEl, aggiorna) {
    const W = 600, H = 400; const cx = 210, cy = 200, R = 150;
    const gradi = vars.angolo != null ? vars.angolo : (spec.angolo != null ? spec.angolo : 60);
    const t = gradi * Math.PI / 180;
    const svg = svgEl || el('svg'); while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'cg-svg cg-circonferenza');
    const gG = el('g', { class: 'cg-griglia' });
    for (let k = -1; k <= 1; k += .5) { gG.appendChild(el('line', { x1: cx + k * R, x2: cx + k * R, y1: cy - R - 20, y2: cy + R + 20 })); gG.appendChild(el('line', { y1: cy + k * R, y2: cy + k * R, x1: cx - R - 20, x2: cx + R + 20 })); }
    svg.appendChild(gG);
    const gA = el('g', { class: 'cg-assi' });
    gA.appendChild(el('line', { x1: cx - R - 30, x2: cx + R + 30, y1: cy, y2: cy })); gA.appendChild(el('line', { y1: cy + R + 30, y2: cy - R - 30, x1: cx, x2: cx }));
    svg.appendChild(gA);
    const gT = el('g', { class: 'cg-tacche' });
    [['1', cx + R, cy + 16], ['−1', cx - R, cy + 16], ['1', cx - 10, cy - R + 4], ['−1', cx - 14, cy + R + 4], ['O', cx - 8, cy + 14]].forEach(([s, x, y]) => gT.appendChild(el('text', { x, y, 'text-anchor': 'middle' }, s)));
    svg.appendChild(gT);
    svg.appendChild(el('circle', { cx, cy, r: R, fill: 'none', stroke: 'var(--g-asse)', 'stroke-width': 2 }));
    const px = cx + R * Math.cos(t), py = cy - R * Math.sin(t);
    const mostra = spec.mostra || ['sin', 'cos', 'tan'];
    /* arco dell'angolo */
    const ar = 34; const grande = Math.abs(t) > Math.PI ? 1 : 0; const verso = t >= 0 ? 0 : 1;
    svg.appendChild(el('path', { d: 'M' + (cx + ar) + ',' + cy + ' A' + ar + ',' + ar + ' 0 ' + grande + ',' + verso + ' ' + (cx + ar * Math.cos(t)) + ',' + (cy - ar * Math.sin(t)), fill: 'none', stroke: 'var(--s4)', 'stroke-width': 2 }));
    svg.appendChild(el('text', { x: cx + 48 * Math.cos(t / 2), y: cy - 48 * Math.sin(t / 2) + 4, class: 'cg-etichetta', fill: 'var(--s4)', 'text-anchor': 'middle' }, 'α'));
    if (mostra.includes('cos')) { svg.appendChild(el('line', { x1: cx, y1: cy, x2: px, y2: cy, stroke: 'var(--s1)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .9 })); svg.appendChild(el('line', { x1: px, y1: cy, x2: px, y2: py, class: 'cg-griglia', 'stroke-dasharray': '4 3' })); }
    if (mostra.includes('sin')) { svg.appendChild(el('line', { x1: px, y1: cy, x2: px, y2: py, stroke: 'var(--s2)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .9 })); }
    if (mostra.includes('tan') && Math.abs(Math.cos(t)) > 1e-6) {
      const tanv = Math.tan(t); const ty = cy - R * tanv;
      const tyc = Math.max(cy - R - 25, Math.min(cy + R + 25, ty));
      svg.appendChild(el('line', { x1: cx + R, y1: cy - R - 25, x2: cx + R, y2: cy + R + 25, class: 'cg-griglia' }));
      svg.appendChild(el('line', { x1: cx + R, y1: cy, x2: cx + R, y2: tyc, stroke: 'var(--s3)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .9 }));
      const L = 420; svg.appendChild(el('line', { x1: cx - L * Math.cos(t) * 0.35, y1: cy + L * Math.sin(t) * 0.35, x2: cx + L * Math.cos(t), y2: cy - L * Math.sin(t), class: 'cg-griglia', 'stroke-dasharray': '4 3' }));
    }
    svg.appendChild(el('line', { x1: cx, y1: cy, x2: px, y2: py, stroke: 'var(--g-testo)', 'stroke-width': 2 }));
    svg.appendChild(el('circle', { cx: px, cy: py, r: 8, fill: 'var(--s4)', stroke: 'var(--g-sfondo)', 'stroke-width': 2, class: 'cg-punto-trascinabile' }));
    svg.appendChild(el('text', { x: px + 10 * Math.cos(t) + 4, y: py - 10 * Math.sin(t) - 6, class: 'cg-etichetta' }, 'P'));
    /* P si trascina lungo la circonferenza: l'angolo segue il dito (a passi di 1°) */
    if (aggiorna && 'angolo' in vars) {
      const h = el('circle', { cx: px, cy: py, r: 22, fill: 'transparent', class: 'cg-maniglia' });
      h.addEventListener('pointerdown', ev => { svg.__giroP = true; try { svg.setPointerCapture(ev.pointerId); } catch (x) { /* niente */ } ev.preventDefault(); });
      svg.appendChild(h);
      if (!svg.__giroInit) {
        svg.__giroInit = true;
        svg.addEventListener('pointermove', ev => {
          if (!svg.__giroP) return; ev.preventDefault();
          const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse());
          let g = Math.round(Math.atan2(cy - q.y, q.x - cx) * 180 / Math.PI); if (g < 0) g += 360;
          vars.angolo = g; svg.__aggiorna();
        });
        const fine = () => { svg.__giroP = false; };
        svg.addEventListener('pointerup', fine); svg.addEventListener('pointercancel', fine);
      }
      svg.__aggiorna = aggiorna;
    }
    /* pannello valori */
    const gV = el('g', { transform: 'translate(400,60)', class: 'cg-valori' });
    const righe = [['α', gradi + '°', 'var(--s4)'], ['α', fmt(t, 3) + ' rad', 'var(--s4)']];
    if (mostra.includes('sin')) righe.push(['sin α', fmt(Math.sin(t), 3), 'var(--s2)']);
    if (mostra.includes('cos')) righe.push(['cos α', fmt(Math.cos(t), 3), 'var(--s1)']);
    if (mostra.includes('tan')) righe.push(['tan α', Math.abs(Math.cos(t)) < 1e-6 ? 'non esiste' : fmt(Math.tan(t), 3), 'var(--s3)']);
    righe.forEach((r, i) => { gV.appendChild(el('rect', { x: 0, y: i * 34, width: 12, height: 12, rx: 3, fill: r[2] })); gV.appendChild(el('text', { x: 20, y: i * 34 + 11, class: 'cg-etichetta' }, r[0] + ' = ' + r[1])); });
    svg.appendChild(gV);
    return svg;
  }

  /* ============================================================
     7. RENDER GENERALE con cursori dei parametri
     ============================================================ */
  const RENDER = { piano: renderPiano, funzione: renderPiano, orario: renderPiano, 'retta-reale': renderRettaReale, barre: renderBarre, 'circonferenza-goniometrica': renderCirconferenza };
  /* grafico orario: un piano con t in orizzontale e la grandezza in verticale, ognuno con la sua unità.
     grandezza 's' | 'x' | 'v' | 'a' dà nome e unità da sola; altrimenti si scrivono grandezza e unita. */
  const GRANDEZZE = { s: ['s', 'm'], x: ['x', 'm'], v: ['v', 'm/s'], a: ['a', 'm/s²'] };
  function specOrario(s) {
    const g = GRANDEZZE[s.grandezza] || [s.grandezza || 'y', ''];
    const u = s.unita != null ? s.unita : g[1];
    const et = Object.assign({ x: 't (' + (s.unitaTempo || 's') + ')', y: g[0] + (u ? ' (' + u + ')' : '') }, s.etichette || {});
    return Object.assign({}, s, { tipo: 'piano', x: s.t || s.x || [0, 10], variabile: 't', etichette: et, proporzioni: s.proporzioni || 'libere', altezza: s.altezza || 420 });
  }

  /* il valore accanto al cursore: decimali scelti (decimali: 1) o quelli del passo */
  const fmtCursore = (p, v) => p && p.decimali != null ? fmtFisso(v, p.decimali) : fmt(v);
  function render(spec, contenitore) {
    const wrap = document.createElement('figure'); wrap.className = 'cg-figura';
    if (spec.tipo === 'animazione') {
      wrap.classList.add('cg-anim');
      if (window.CANIM) window.CANIM.render(spec, wrap); else wrap.textContent = 'Animazioni non disponibili';
    } else if (spec.tipo === 'svg') {
      const div = document.createElement('div'); div.className = 'cg-svg-grezzo'; div.innerHTML = spec.codice; wrap.appendChild(div);
    } else {
      if (spec.tipo === 'orario') { spec = specOrario(spec); wrap.classList.add('cg-orario'); }
      const fn = RENDER[spec.tipo];
      if (!fn) { wrap.textContent = 'Tipo di grafico sconosciuto: ' + spec.tipo; return wrap; }
      const vars = {};
      let parametri = (spec.parametri || []).slice();
      if ((spec.tipo === 'circonferenza-goniometrica') && !parametri.length && spec.interattiva !== false) parametri = [{ nome: 'angolo', min: 0, max: 360, passo: 1, valore: spec.angolo != null ? spec.angolo : 60, etichetta: 'α (gradi)' }];
      parametri.forEach(p => { vars[p.nome] = p.valore != null ? num(p.valore) : num(p.min || 0); });
      /* marker frecce condivisi */
      const defs = el('defs');
      for (let i = 0; i < 4; i++) defs.appendChild(el('marker', { id: 'freccia-' + i, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, el('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'var(--s' + (i + 1) + ')' })));
      const svg = el('svg'); wrap.appendChild(svg);
      const cursori = {};
      const aggiorna = () => { fn(spec, vars, svg, aggiorna); svg.insertBefore(defs, svg.firstChild); for (const n in cursori) { cursori[n].inp.value = vars[n]; cursori[n].val.textContent = fmtCursore(cursori[n].p, vars[n]); } };
      aggiorna();
      const visibili = parametri.filter(p => !p.nascosto);
      if (visibili.length) {
        const pan = document.createElement('div'); pan.className = 'cg-parametri';
        visibili.forEach(p => {
          const riga = document.createElement('label'); riga.className = 'cg-parametro';
          const nome = document.createElement('span'); nome.className = 'cg-parametro-nome'; nome.innerHTML = riccoHtml(p.etichetta || p.nome);
          const val = document.createElement('span'); val.className = 'cg-parametro-valore'; val.textContent = fmtCursore(p, vars[p.nome]);
          const inp = document.createElement('input'); inp.type = 'range'; inp.min = num(p.min); inp.max = num(p.max); inp.step = p.passo || 0.1; inp.value = vars[p.nome];
          inp.addEventListener('input', () => { vars[p.nome] = parseFloat(inp.value); aggiorna(); });
          cursori[p.nome] = { inp, val, p };
          riga.appendChild(nome); riga.appendChild(inp); riga.appendChild(val); pan.appendChild(riga);
        });
        wrap.appendChild(pan);
      }
    }
    if (spec.didascalia) { const c = document.createElement('figcaption'); c.textContent = spec.didascalia; wrap.appendChild(c); }
    if (contenitore) contenitore.appendChild(wrap);
    return wrap;
  }

  /* verifica statica di una specifica (usata dal validatore e dall'app) */
  function verifica(spec) {
    const errori = [];
    if (!spec || typeof spec !== 'object') return ['specifica mancante'];
    if (spec.tipo === 'animazione') {
      const CA = (typeof window !== 'undefined' && window.CANIM) || null;
      if (CA && !CA.ANIM[spec.nome]) errori.push('animazione sconosciuta: ' + spec.nome + ' (disponibili: ' + CA.nomi().join(', ') + ')');
      return errori;
    }
    if (!RENDER[spec.tipo] && spec.tipo !== 'svg') errori.push('tipo sconosciuto: ' + spec.tipo);
    const nomiParamDich = new Set((spec.parametri || []).map(p => p.nome));
    (spec.elementi || []).forEach((e, i) => { if (e.tipo === 'punto' && e.giro) { if (!e.giro.parametro || !nomiParamDich.has(e.giro.parametro)) errori.push('elementi[' + i + '](punto con giro): giro.parametro va dichiarato in parametri'); if (!Array.isArray(e.giro.centro) || e.giro.centro.length !== 2) errori.push('elementi[' + i + '](punto con giro): giro.centro deve essere [x, y]'); } });
    (spec.elementi || []).forEach((e, i) => { if (e.tipo === 'punto' && e.trascina && !e.giro) [0, 1].forEach(k => { const v = e.p && e.p[k]; if (typeof v === 'string' && /^[A-Za-z_]\w*$/.test(v.trim()) && !nomiParamDich.has(v.trim())) errori.push('elementi[' + i + '](punto trascinabile): il parametro "' + v + '" va dichiarato in parametri (con valore iniziale, min e max)'); }); });
    const nomiParam = new Set((spec.parametri || []).map(p => p.nome));
    const orario = spec.tipo === 'orario';
    const consentite = new Set(['x', ...nomiParam]);
    if (orario) consentite.add('t');
    if (spec.tipo === 'circonferenza-goniometrica') consentite.add('angolo');
    const controlla = (src, dove, conX) => {
      if (src == null || typeof src === 'number') return;
      if (src === 'inf' || src === '-inf' || src === '+inf') return;
      try { const f = compila(src); f.variabili.forEach(v => { if (!consentite.has(v) || (!conX && (v === 'x' || (orario && v === 't')))) errori.push(dove + ': variabile non definita "' + v + '" in "' + src + '"'); }); }
      catch (e) { errori.push(dove + ': ' + e.message); }
    };
    function controllaModello(t, dove) {
      const re = /\{\{([^}]+)\}\}/g; let m;
      while ((m = re.exec(t))) { let e = m[1].trim(); if (e.charAt(0) === '?') e = e.slice(1).split('|')[0]; else if (/\|\s*\d+\s*$/.test(e)) e = e.replace(/\|\s*\d+\s*$/, ''); controlla(e.trim(), dove + ' {{' + m[1].trim() + '}}', false); }
    }
    (spec.funzioni || []).forEach((f, i) => { if (typeof f.etichetta === 'string') controllaModello(f.etichetta, 'funzioni[' + i + '].etichetta'); });
    (spec.intervalli || []).forEach((iv, i) => { if (typeof iv.etichetta === 'string') controllaModello(iv.etichetta, 'intervalli[' + i + '].etichetta'); });
    (spec.funzioni || []).forEach((f, i) => { if (!f.f) errori.push('funzioni[' + i + '] senza f'); else controlla(f.f, 'funzioni[' + i + ']', true); if (f.dominio) f.dominio.forEach(d => controlla(d, 'funzioni[' + i + '].dominio', false)); });
    (spec.elementi || []).forEach((e, i) => {
      const dove = 'elementi[' + i + '](' + e.tipo + ')';
      const tipi = ['area', 'tangente', 'retta', 'verticale', 'orizzontale', 'segmento', 'vettore', 'somma', 'poligono', 'cerchio', 'ellisse', 'angolo', 'testo', 'punto', 'uscente', 'entrante'];
      if (!tipi.includes(e.tipo)) errori.push(dove + ': tipo elemento sconosciuto');
      const pt = (p, n) => { if (!Array.isArray(p) || p.length !== 2) errori.push(dove + ': ' + n + ' deve essere [x,y]'); else p.forEach(c => controlla(c, dove + '.' + n, false)); };
      /* le espressioni dentro {{…}} delle etichette */
      ['etichetta', 'testo'].forEach(k => { if (typeof e[k] === 'string') controllaModello(e[k], dove + '.' + k); });
      if (e.tipo === 'uscente' || e.tipo === 'entrante') { if (e.p) pt(e.p, 'p'); else if (e.da && e.a) { pt(e.da, 'da'); pt(e.a, 'a'); controlla(e.passo, dove + '.passo', false); } else errori.push(dove + ': serve p: [x, y], oppure da, a (e passo) per una griglia'); }
      if (e.tipo === 'angolo') { controlla(e.ampiezza, dove + '.ampiezza', false); if (e.verso && e.verso !== 'orario' && e.verso !== 'antiorario') errori.push(dove + ': verso deve essere orario o antiorario'); }
      if (e.tipo === 'testo') controlla(e.rotazione, dove + '.rotazione', false);
      if (e.tipo === 'vettore' && e.componenti && e.componenti.lungo != null) controlla(e.componenti.lungo, dove + '.componenti.lungo', false);
      if (e.f) controlla(e.f, dove + '.f', true); if (e.g) controlla(e.g, dove + '.g', true);
      if (e.tipo === 'area') { controlla(e.da, dove + '.da', false); controlla(e.a, dove + '.a', false); if (e.da == null || e.a == null) errori.push(dove + ': servono da e a'); }
      if (e.tipo === 'tangente') controlla(e.x0, dove + '.x0', false);
      if (e.tipo === 'retta') { if (e.per) e.per.forEach((p, k) => pt(p, 'per[' + k + ']')); else { controlla(e.m, dove + '.m', false); controlla(e.q, dove + '.q', false); if (e.m == null || e.q == null) errori.push(dove + ': serve m e q, oppure per'); } }
      if (e.tipo === 'verticale') controlla(e.x, dove + '.x', false);
      if (e.tipo === 'orizzontale') controlla(e.y, dove + '.y', false);
      if (e.tipo === 'segmento') { pt(e.da, 'da'); pt(e.a, 'a'); }
      if (e.tipo === 'vettore') {
        if (e.da != null) pt(e.da, 'da');
        if (e.a != null) pt(e.a, 'a'); else if (e.modulo == null) errori.push(dove + ': serve a: [x, y] oppure modulo (e angolo in gradi)');
        else { controlla(e.modulo, dove + '.modulo', false); controlla(e.angolo, dove + '.angolo', false); }
        if (e.componenti && e.componenti !== true && e.componenti.etichette && (!Array.isArray(e.componenti.etichette) || e.componenti.etichette.length !== 2)) errori.push(dove + ': componenti.etichette deve avere due voci');
      }
      if (e.tipo === 'somma') {
        if (e.da != null) pt(e.da, 'da');
        if (!Array.isArray(e.vettori) || !e.vettori.length) errori.push(dove + ': servono vettori: [[dx, dy], …] (o { modulo, angolo })');
        else e.vettori.forEach((v, k) => { if (Array.isArray(v)) pt(v, 'vettori[' + k + ']'); else if (!v || v.modulo == null) errori.push(dove + ': vettori[' + k + '] deve essere [dx, dy] oppure { modulo, angolo }'); else { controlla(v.modulo, dove + '.vettori[' + k + '].modulo', false); controlla(v.angolo, dove + '.vettori[' + k + '].angolo', false); } });
        if (e.parallelogramma && (e.vettori || []).length !== 2) errori.push(dove + ': il parallelogramma vuole esattamente due vettori');
      }
      if (e.tipo === 'poligono') { if (!Array.isArray(e.punti) || e.punti.length < 3) errori.push(dove + ': servono almeno 3 punti'); else e.punti.forEach((p, k) => pt(p, 'punti[' + k + ']')); }
      if (e.tipo === 'cerchio') { pt(e.centro, 'centro'); controlla(e.raggio, dove + '.raggio', false); }
      if (e.tipo === 'ellisse') { pt(e.centro, 'centro'); controlla(e.a, dove + '.a', false); controlla(e.b, dove + '.b', false); }
      if (e.tipo === 'angolo') { pt(e.vertice, 'vertice'); pt(e.da, 'da'); pt(e.a, 'a'); }
      if (e.tipo === 'testo' || e.tipo === 'punto') pt(e.p, 'p');
    });
    (spec.punti || []).forEach((p, i) => { controlla(p.x, 'punti[' + i + '].x', false); controlla(p.y, 'punti[' + i + '].y', false); });
    (spec.intervalli || []).forEach((iv, i) => { controlla(iv.da, 'intervalli[' + i + '].da', false); controlla(iv.a, 'intervalli[' + i + '].a', false); });
    if (spec.tipo === 'barre') { if (!Array.isArray(spec.categorie)) errori.push('barre: manca categorie'); const s = spec.serie || [{ valori: spec.valori }]; s.forEach((sr, i) => { if (!Array.isArray(sr.valori) || sr.valori.length !== (spec.categorie || []).length) errori.push('barre: serie[' + i + '] deve avere tanti valori quante categorie'); }); }
    if ((spec.tipo === 'piano' || spec.tipo === 'funzione') && (!spec.x || !spec.y)) errori.push('piano: servono x:[min,max] e y:[min,max]');
    if (orario) {
      if (!(spec.t || spec.x) || !spec.y) errori.push('orario: servono t:[min,max] e y:[min,max]');
      if (!spec.grandezza && !(spec.etichette && spec.etichette.y)) errori.push('orario: serve grandezza (s, x, v, a, o un nome con unita) oppure etichette.y');
      if (spec.grandezza && !GRANDEZZE[spec.grandezza] && spec.unita == null) errori.push('orario: grandezza "' + spec.grandezza + '" senza unita');
    }
    (spec.parametri || []).forEach(p => { if (!p.nome || p.min == null || p.max == null) errori.push('parametro incompleto: ' + JSON.stringify(p)); });
    return errori;
  }


  /* ============================================================
     8. RISPOSTE DEGLI ESERCIZI: numeri, misure con le unità, confronto
     (qui e non in quanto.js perché le usa anche il validatore, che prova ogni risposta giusta)
     ============================================================ */
  const APICI = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '' };
  function normalizza(s, tieniX) {
    const n = String(s).toLowerCase().replace(/\s+/g, '').replace(/−/g, '-').replace(/×|·/g, '*').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, a => '^' + a.split('').map(c => APICI[c]).join('')).replace(/\+-/g, '±').replace(/,/g, '.').replace(/\.$/, '').replace(/\*\*/g, '^').replace(/\*/g, (m, i, t) => /[a-zπ(√]/.test(t.charAt(i + 1)) || /[a-zπ)]/.test(t.charAt(i - 1)) ? '' : m).replace(/[«»"'’‘“”]/g, '').replace(/ℝ/g, 'r').replace(/∀/g, 'perogni');
    return tieniX ? n : n.replace(/^x=/, '');
  }
  /* la notazione scientifica in tutte le forme: 1,2·10^3  1,2 × 10³  1,2*10^-3  1,2 x 10⁻³  →  1,2e3 */
  function scientifica(s) {
    return String(s)
      .replace(/(\d)\s*[·×*xX⋅]\s*10\s*\^\s*\(?\s*([-+−]?)\s*(\d+)\s*\)?/g, (m, d, seg, e) => d + 'e' + (seg === '−' || seg === '-' ? '-' : '') + e)
      .replace(/(\d)\s*[·×*xX⋅]\s*10\s*([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, d, a) => d + 'e' + a.split('').map(c => APICI[c]).join(''));
  }
  /* un numero scritto dallo studente. puro = true: niente unità o parole in fondo (le separa separaMisura) */
  function numeroDa(s, puro) {
    s = scientifica(s);
    /* esponenti in apice: 2⁵ → 2^5, e⁻¹ → e^(-1) */
    s = String(s).replace(/([\d.πe)])([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g, (m, p, a) => p + '^(' + a.split('').map(c => APICI[c]).join('') + ')');
    s = s.trim().replace(/(\d)\s+su\s+(\d)/gi, '$1/$2');
    if (!puro) s = s.replace(/(\d[²³]?)\s+(?!rad\b|sqrt|ln\b|log|pi\b|e\b|cm|m\b|mq|gradi|rad)[a-zà-ù]+(\s+[a-zà-ù]+)*\s*$/i, '$1');
    s = s.replace(/^[a-zA-Zα-ωΑ-ΩΔ][a-zA-Z0-9₀-₉'’_]{0,3}\s*=\s*/, '').replace(/^≈\s*/, '').replace(/−/g, '-').replace(/,/g, '.').replace(/\s+/g, '').replace(/pi|Π/gi, 'π').replace(/[·×⋅]/g, '*').replace(/\*(?=π)/g, '');
    /* unità di misura in fondo: «36,87°», «20 cm²», «70 gradi», «1,2 rad» */
    if (!puro) s = s.replace(/(°|gradi|radianti|rad|[kcdm]?m(²|\^2|³|\^3)?|mq|u)$/i, '');
    if (/^[-+]?\d+(?:\.\d+)?e[-+]?\d+$/i.test(s)) return parseFloat(s);
    /* multipli e frazioni di π: π, -π, 2π, 3π/4, π/2, 0.5π */
    let m = s.match(/^([-+]?)(\d+(?:\.\d+)?)?π(?:\/(\d+(?:\.\d+)?))?$/); if (m) return (m[1] === '-' ? -1 : 1) * (m[2] ? parseFloat(m[2]) : 1) * Math.PI / (m[3] ? parseFloat(m[3]) : 1);
    m = s.match(/^([-+]?\d+(?:\.\d+)?)\/([-+]?\d+(?:\.\d+)?)$/); if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    /* potenze del numero e: e, 2e, e^2, e^-1 */
    m = s.match(/^([-+]?)(\d+(?:\.\d+)?)?e(?:\^\(?([-+]?\d+(?:\.\d+)?)\)?)?$/); if (m) return (m[1] === '-' ? -1 : 1) * (m[2] ? parseFloat(m[2]) : 1) * Math.exp(m[3] ? parseFloat(m[3]) : 1);
    /* radici con coefficiente e denominatore: √3/2, 2√3, -3√2/4, sqrt(3)/2, rad3, (√3)/2 */
    { const t = s.replace(/^([-+]?)\((.+)\)(\/[\d.]+)$/, '$1$2$3');
      const mr = t.match(/^([-+]?)(\d+(?:\.\d+)?)?(?:√|sqrt|rad)\(?(\d+(?:\.\d+)?)\)?(?:\/(\d+(?:\.\d+)?))?$/);
      if (mr) return (mr[1] === '-' ? -1 : 1) * (mr[2] ? parseFloat(mr[2]) : 1) * Math.sqrt(parseFloat(mr[3])) / (mr[4] ? parseFloat(mr[4]) : 1); }
    m = s.match(/^([-+]?)(?:√|sqrt\(?)(\d+(?:\.\d+)?)\)?$/); if (m) return (m[1] === '-' ? -1 : 1) * Math.sqrt(parseFloat(m[2]));
    if (/^[-+]?\d+(?:\.\d+)?$/.test(s)) return parseFloat(s);
    if (/^[-+]?(inf|∞|infinito)$/.test(s)) return s.charAt(0) === '-' ? -Infinity : Infinity;
    /* ultima prova: un'espressione numerica qualunque, con il parser dei grafici: 1/√2, (√6+√2)/4, 2^10, 3π/4 + 1 */
    if (/^[\d.+\-*/^()√πe!]*$/.test(s.replace(/sqrt|rad|pi|ln|log10|log2|log/g, '')) && /\d|π/.test(s)) {
      try {
        const t = s.replace(/rad/g, 'sqrt').replace(/√\(/g, 'sqrt(').replace(/√([\d.]+)/g, 'sqrt($1)').replace(/π/g, 'pi').replace(/log(?!10|2)/g, 'log10').replace(/(ln|log10|log2|sqrt)([\d.]+)/g, '$1($2)');
        const v = num(t, {}); if (isFinite(v)) return v;
      } catch (e) { /* non è un'espressione */ }
    }
    return NaN;
  }
  function numeriDa(s) {
    /* nomi delle incognite (x1 =, x₂ =, y =) via; «+-4» vale ±4; il segno staccato dal numero si riattacca */
    s = scientifica(s);
    s = String(s).replace(/\b[a-z][\d₀-₉]?\s*=\s*/gi, ' ').replace(/\+\s*[-−]/g, '±').replace(/(^|[;,]|\be\b)\s*([-+−])\s+(?=[\dπ√(])/g, '$1$2');
    /* separate da punto e virgola: ogni pezzo può essere un'espressione (π/6; 5π/6; √2/2) */
    if (/;/.test(String(s))) { const v = String(s).replace(/^\s*[a-z]\s*=\s*/i, '').split(';').map(x => x.replace(/^\s*[a-z]\d?\s*=\s*/i, '').trim()).filter(Boolean).map(x => numeroDa(x)); if (v.length && v.every(n => isFinite(n))) return v; }
    s = String(s).replace(/−/g, '-').replace(/,/g, '.');
    s = s.replace(/±\s*(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)/g, '-$1 $1');
    s = s.replace(/pi|Π/gi, 'π').replace(/[*·]/g, '');
    const trovati = s.match(/[-+]?(?:\d+(?:\.\d+)?)?π(?:\/\d+(?:\.\d+)?)?|[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?:\/\d+(?:\.\d+)?)?/gi) || [];
    return trovati.map(x => numeroDa(x)).filter(n => isFinite(n));
  }
  const vicino = (a, b, tol) => (!isFinite(b) || !isFinite(a)) ? a === b : Math.abs(a - b) <= (tol != null ? tol : Math.max(0.01, Math.abs(b) * 1e-3));

  /* ---------- le unità di misura ----------
     Ogni unità è un vettore di dimensioni [m, kg, s, A, K, mol, cd, angolo, °C, °F] e un fattore verso il SI.
     °C ha una dimensione sua (le temperature assolute non si convertono con un fattore); °, rad, % sono
     pure (angolo, numero). Si accettano le forme del libro: m/s, m·s⁻¹, m s^-1, km/h, J/(kg·°C), kg·m/s², N·m. */
  const D = (m, kg, s, A, K, mol, cd, ang, C, Fa) => [m || 0, kg || 0, s || 0, A || 0, K || 0, mol || 0, cd || 0, ang || 0, C || 0, Fa || 0];
  const UNITA = {};   /* simbolo → [dimensioni, fattore, unità di base] */
  const BASE = {      /* simbolo → [dimensioni, fattore, prefissi ammessi] */
    m: [D(1), 1, 1], g: [D(0, 1), 1e-3, 1], s: [D(0, 0, 1), 1, 1], A: [D(0, 0, 0, 1), 1, 1], K: [D(0, 0, 0, 0, 1), 1, 1], mol: [D(0, 0, 0, 0, 0, 1), 1, 1], cd: [D(0, 0, 0, 0, 0, 0, 1), 1, 0],
    N: [D(1, 1, -2), 1, 1], J: [D(2, 1, -2), 1, 1], W: [D(2, 1, -3), 1, 1], Pa: [D(-1, 1, -2), 1, 1], Hz: [D(0, 0, -1), 1, 1],
    C: [D(0, 0, 1, 1), 1, 1], V: [D(2, 1, -3, -1), 1, 1], 'Ω': [D(2, 1, -3, -2), 1, 1], F: [D(-2, -1, 4, 2), 1, 1], T: [D(0, 1, -2, -1), 1, 1],
    Wb: [D(2, 1, -2, -1), 1, 1], H: [D(2, 1, -2, -2), 1, 1], L: [D(3), 1e-3, 1], l: [D(3), 1e-3, 1], eV: [D(2, 1, -2), 1.602176634e-19, 1],
    Wh: [D(2, 1, -2), 3600, 1], cal: [D(2, 1, -2), 4.186, 1], bar: [D(-1, 1, -2), 1e5, 1],
    h: [D(0, 0, 1), 3600, 0], min: [D(0, 0, 1), 60, 0], atm: [D(-1, 1, -2), 101325, 0], mmHg: [D(-1, 1, -2), 133.322, 0], u: [D(0, 1), 1.66053907e-27, 0],
    '°': [D(0, 0, 0, 0, 0, 0, 0, 1), Math.PI / 180, 0], rad: [D(0, 0, 0, 0, 0, 0, 0, 1), 1, 0], '%': [D(), 0.01, 0], '°C': [D(0, 0, 0, 0, 0, 0, 0, 0, 1), 1, 0],
    /* aggiunte del 17/10: tempi e distanze dell'astronomia, °F, lux e lumen */
    d: [D(0, 0, 1), 86400, 0], a: [D(0, 0, 1), 31557600, 0], UA: [D(1), 1.495978707e11, 0], AU: [D(1), 1.495978707e11, 0],
    pc: [D(1), 3.0856775814913673e16, 1], ly: [D(1), 9.4607304725808e15, 0], '°F': [D(0, 0, 0, 0, 0, 0, 0, 0, 0, 1), 1, 0],
    lx: [D(-2, 0, 0, 0, 0, 0, 1), 1, 1], lm: [D(0, 0, 0, 0, 0, 0, 1), 1, 1], Bq: [D(0, 0, -1), 1, 1], dB: [D(), 1, 0]
  };
  const PREFISSI = { P: 1e15, T: 1e12, G: 1e9, M: 1e6, k: 1e3, h: 1e2, d: 1e-1, c: 1e-2, m: 1e-3, 'μ': 1e-6, 'µ': 1e-6, n: 1e-9, p: 1e-12, f: 1e-15 };
  Object.keys(BASE).forEach(b => {
    UNITA[b] = [BASE[b][0], BASE[b][1], b];
    if (BASE[b][2]) Object.keys(PREFISSI).forEach(p => { if (!UNITA[p + b]) UNITA[p + b] = [BASE[b][0], BASE[b][1] * PREFISSI[p], b]; });
  });
  UNITA.ohm = UNITA.Ohm = UNITA['Ω']; UNITA.kohm = UNITA['kΩ']; UNITA['℃'] = UNITA['°C']; UNITA['º'] = UNITA['°']; UNITA['℉'] = UNITA['°F'];
  ['m', 's', 'g', 'A', 'C', 'F', 'T', 'J', 'V', 'W', 'L'].forEach(b => { UNITA['u' + b] = UNITA['μ' + b]; });   /* «uF» per chi non trova la μ */
  const SIMBOLI = Object.keys(UNITA).sort((a, b) => b.length - a.length);
  /* le unità scritte a parole (le più comuni) */
  const PAROLE = [[/\banni\s+luce\b/g, 'ly'], [/\banno\s+luce\b/g, 'ly'], [/\bann[oi]\b/g, 'a'], [/\bgiorn[oi]\b/g, 'd'], [/\bunità\s+astronomich[ae]\b/g, 'UA'], [/\blux\b/g, 'lx'], [/\blumen\b/g, 'lm'],
    [/\bgrad[oi]\s+fahrenheit\b/gi, '°F'], [/\bmetri?\b/g, 'm'], [/\bchilometri?\b/g, 'km'], [/\bcentimetri?\b/g, 'cm'], [/\bmillimetri?\b/g, 'mm'], [/\bsecond[oi]\b/g, 's'], [/\bminut[oi]\b/g, 'min'], [/\bor[ae]\b/g, 'h'],
    [/\bchilogramm[oi]\b/g, 'kg'], [/\bgramm[oi]\b/g, 'g'], [/\bnewton\b/gi, 'N'], [/\bjoule\b/gi, 'J'], [/\bwatt\b/gi, 'W'], [/\bpascal\b/gi, 'Pa'], [/\bhertz\b/gi, 'Hz'], [/\bvolt\b/gi, 'V'],
    [/\bampere\b/gi, 'A'], [/\bcoulomb\b/gi, 'C'], [/\bfarad\b/gi, 'F'], [/\btesla\b/gi, 'T'], [/\bkelvin\b/gi, 'K'], [/\blitr[oi]\b/g, 'L'], [/\bgrad[oi]\s+(celsius|centigradi)\b/gi, '°C'], [/\bgrad[oi]\b/g, '°'], [/\bradianti?\b/g, 'rad'],
    [/\bal\b/g, '/'], [/\bper\b/g, '·'], [/\s*\bquadr[oiat]+\b/g, '²'], [/\s*\bcub[oi]\b/g, '³']];
  /* «m/s²» → { dim, f }; null se non è un'unità che conosco */
  function leggiUnita(src) {
    let s = String(src == null ? '' : src).trim();
    if (!s) return null;
    PAROLE.forEach(p => { s = s.replace(p[0], p[1]); });
    s = s.replace(/−/g, '-').replace(/\s*\/\s*/g, '/').trim();
    let i = 0; const usate = [];   /* le unità di base usate: servono per distinguere un momento (N·m) da un lavoro (J) */
    function esponente() {
      let m = s.slice(i).match(/^\^\s*\(?\s*([-+]?\d+)\s*\)?/);
      if (m) { i += m[0].length; return parseInt(m[1], 10); }
      m = s.slice(i).match(/^[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/);
      if (m) { i += m[0].length; return parseInt(m[0].split('').map(c => APICI[c]).join(''), 10); }
      m = s.slice(i).match(/^-?[1-9](?![\d.,])/);   /* «m s-1», «m2»: esponente scritto senza ^ */
      if (m && /[A-Za-zΩ°)]/.test(s.charAt(i - 1))) { i += m[0].length; return parseInt(m[0], 10); }
      return 1;
    }
    function simbolo() {
      for (let j = 0; j < SIMBOLI.length; j++) {
        const k = SIMBOLI[j];
        if (s.substr(i, k.length) !== k) continue;
        i += k.length; usate.push(UNITA[k][2] || k); return { dim: UNITA[k][0], f: UNITA[k][1] };
      }
      return null;
    }
    function gruppo() {
      const dim = D(); let f = 1, segno = 1, almeno = false;
      while (i < s.length) {
        const c = s.charAt(i);
        if (c === ')') break;
        if (/[\s·*⋅.]/.test(c)) { i++; continue; }
        if (c === '/') { segno = -1; i++; continue; }   /* tutto quello che segue la barra va al denominatore: J/kg·K = J/(kg·K) */
        let fat;
        if (c === '(') { i++; fat = gruppo(); if (!fat || s.charAt(i) !== ')') return null; i++; }
        else { fat = simbolo(); if (!fat) return null; }
        const e = esponente();
        for (let k = 0; k < dim.length; k++) dim[k] += segno * e * fat.dim[k];
        f *= Math.pow(fat.f, segno * e); almeno = true;
      }
      return almeno ? { dim, f } : null;
    }
    const r = gruppo();
    if (r) r.usate = usate;
    return r && i >= s.length ? r : null;
  }
  const stesseDim = (a, b, senzaAngolo) => a.every((v, k) => (senzaAngolo && k === 7) || Math.abs(v - b[k]) < 1e-9);
  const ENERGIE = ['J', 'eV', 'Wh', 'cal'];
  /* due unità con le stesse dimensioni ma grandezze diverse: un momento (N·m) non è un lavoro (J);
     e il radiante è un numero puro (rad/s = s⁻¹), ma gli hertz no: ω in rad/s non si scrive in Hz */
  function confrontabili(ue, mu) {
    const momento = u => u.usate.indexOf('N') >= 0 && u.usate.indexOf('m') >= 0 && !u.usate.some(x => ENERGIE.indexOf(x) >= 0);
    const energia = u => u.usate.some(x => ENERGIE.indexOf(x) >= 0);
    if (momento(ue) && energia(mu)) return false;   /* il contrario va bene: un lavoro si può scrivere in N·m */
    const conRad = ue.usate.indexOf('rad') >= 0 || mu.usate.indexOf('rad') >= 0, conHz = ue.usate.indexOf('Hz') >= 0 || mu.usate.indexOf('Hz') >= 0;
    return stesseDim(ue.dim, mu.dim, conRad && !conHz);
  }
  /* «12,5 m/s» → { n: 12.5, unita: 'm/s', u: {dim, f} }; senza unità unita = ''; unità sconosciuta: u = null */
  function separaMisura(src) {
    const s = String(src).trim().replace(/^≈\s*/, '').replace(/^[a-zA-Zα-ωΑ-ΩΔ][a-zA-Z0-9₀-₉'’_]{0,4}\s*(\([^)]*\))?\s*[=≈]\s*/, '');
    let ignota = null;
    for (let i = 1; i < s.length; i++) {
      if (!/[A-Za-zΩµμ°%℃º(]/.test(s.charAt(i))) continue;
      if (s.charAt(i) === '(' && !/\s/.test(s.charAt(i - 1))) continue;
      const prima = s.slice(0, i), dopo = s.slice(i).trim();
      const n = numeroDa(prima, true); if (!isFinite(n)) continue;
      const u = leggiUnita(dopo);
      if (u) return { n, unita: dopo, u };
      if (!ignota) ignota = { n, unita: dopo, u: null };
    }
    const n = numeroDa(s, true);
    if (isFinite(n)) return { n, unita: '', u: null };
    return ignota || { n: NaN, unita: '', u: null };
  }
  /* il confronto: true, false, oppure 'unita' (il numero va, l'unità no) o 'unita-ignota' */
  function controlla(r, valoreUtente) {
    if (r.tipo === 'numero' && r.unita && !r.migliaia) {
      /* «1.200 J»: se letto come decimale non va, si prova il punto delle migliaia */
      const esito = controlla(Object.assign({}, r, { migliaia: true }), valoreUtente);
      const mig = String(valoreUtente).trim().match(/^(-?[1-9]\d{0,2}(?:\.\d{3})+)(?![\d.,])\s*(.*)$/);
      if (esito !== true && mig) { const altro = controlla(Object.assign({}, r, { migliaia: true }), mig[1].replace(/\./g, '') + ' ' + mig[2]); if (altro === true || esito === false) return altro; }
      return esito;
    }
    if (r.tipo === 'numero' && r.unita) {
      const ue = leggiUnita(r.unita), m = separaMisura(valoreUtente);
      if (!isFinite(m.n)) return false;
      const tol = r.tolleranza != null ? r.tolleranza : Math.max(1e-12, Math.abs(r.valore) * 0.01);
      /* una percentuale scritta come frazione: 5 % e 0,05 vanno bene tutti e due */
      if (!m.unita) return vicino(m.n, r.valore, tol) || (String(r.unita).trim() === '%' && vicino(m.n * 100, r.valore, tol));
      const scritta = m.unita.replace(/\s+/g, '');
      if ((r.altreUnita || []).some(a => a.replace(/\s+/g, '') === scritta) && vicino(m.n, r.valore, tol)) return true;
      if (!m.u) return 'unita-ignota';
      /* «25 gradi» per una temperatura: i gradi sono Celsius */
      if (ue && ue.dim[8] === 1 && m.u.dim[7] === 1 && Math.abs(m.u.f - Math.PI / 180) < 1e-12 && vicino(m.n, r.valore, tol)) return true;
      /* soloUnita: negli esercizi di equivalenze «72 km/h» non può valere come risposta a «quanto fa in m/s?» */
      if (ue && confrontabili(ue, m.u) && (!r.soloUnita || Math.abs(m.u.f / ue.f - 1) < 1e-9) && vicino(m.n * m.u.f / ue.f, r.valore, tol)) return true;
      if (vicino(m.n, r.valore, tol)) return 'unita';
      return false;
    }
    if (r.tipo === 'numero') {
      /* suffisso: una velocità come frazione di c («0,8c», «0,8 c», «0,8·c») vale come «0,8» */
      if (r.suffisso) valoreUtente = String(valoreUtente).replace(new RegExp('[\\s·*⋅]*' + String(r.suffisso).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$'), '');
      if (/%\s*$/.test(String(valoreUtente))) { const p = numeroDa(String(valoreUtente).replace(/%\s*$/, '')); return isFinite(p) && (vicino(p / 100, r.valore, r.tolleranza) || vicino(p, r.valore, r.tolleranza)); }
      const n = numeroDa(valoreUtente); if (isFinite(n) && vicino(n, r.valore, r.tolleranza)) return true;
      const mig = String(valoreUtente).trim(); if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(mig)) return vicino(+mig.replace(/\./g, ''), r.valore, r.tolleranza);
      return false;
    }
    if (r.tipo === 'numeri') {
      if (r.valori.length === 1 && controlla({ tipo: 'numero', valore: r.valori[0], tolleranza: r.tolleranza }, String(valoreUtente).replace(/^\s*[a-z][\d₀-₉]?\s*=\s*/i, ''))) return true;
      /* coppie con il punto delle migliaia («3.000; 1.400») */
      if (/(^|[;\s])[1-9]\d{0,2}(\.\d{3})+($|[;\s])/.test(valoreUtente) && controlla(r, String(valoreUtente).replace(/(\d)\.(?=\d{3}(\D|$))/g, '$1'))) return true;
      const combacia = dati => {
        if (dati.length !== r.valori.length) return false;
        if (r.ordinati) return dati.every((d, i) => vicino(d, r.valori[i], r.tolleranza));
        const resto = r.valori.slice();
        for (let j = 0; j < dati.length; j++) { const k = resto.findIndex(v => vicino(dati[j], v, r.tolleranza)); if (k < 0) return false; resto.splice(k, 1); }
        return true;
      };
      if (combacia(numeriDa(valoreUtente))) return true;
      /* chi scrive «-5,5» per dire -5 e 5: se i conti non tornano, la virgola si legge come separatore */
      if (/,/.test(valoreUtente) && !/;/.test(valoreUtente)) return combacia(numeriDa(String(valoreUtente).replace(/,\s*/g, '; ')));
      return false;
    }
    if (r.tipo === 'testo') {
      /* «x=» davanti si ignora, tranne quando la risposta è proprio una retta x = k (allora «2» da solo non basta) */
      const tieni = r.accettate.some(a => /^x=/.test(normalizza(a, true)));
      const u = normalizza(valoreUtente, tieni); return r.accettate.some(a => normalizza(a, tieni) === u);
    }
    if (r.tipo === 'intervallo') {
      const u = valoreUtente; const da = numeroDa(u.da), a = numeroDa(u.a);
      const rda = r.da === '-inf' ? -Infinity : r.da, ra = r.a === 'inf' ? Infinity : r.a;
      if (!(da === rda || vicino(da, rda, r.tolleranza)) || !(a === ra || vicino(a, ra, r.tolleranza))) return false;
      if (isFinite(rda) && !!u.chiusoDa !== !!r.chiusoDa) return false;
      if (isFinite(ra) && !!u.chiusoA !== !!r.chiusoA) return false;
      return true;
    }
    return false;
  }
  /* il numero all'italiana (per i messaggi e per il validatore): 1.5e-7 → «1,5·10^-7» */
  function numeroIt(v) {
    if (!isFinite(v)) return String(v);
    const a = Math.abs(v);
    if (a !== 0 && (a >= 1e6 || a < 1e-3)) { const e = Math.floor(Math.log10(a) + 1e-9), mnt = Math.round(v / Math.pow(10, e) * 1e6) / 1e6; return String(mnt).replace('.', ',') + '·10^' + e; }
    return String(Math.round(v * 1e9) / 1e9).replace('.', ',');
  }
  const risposte = { normalizza, numeroDa, numeriDa, leggiUnita, separaMisura, controlla, numeroIt, scientifica, vicino };

  const api = { compila, analizza, num, render, verifica, fmt, risposte, riccoHtml };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.CGRAF = api;
})();
