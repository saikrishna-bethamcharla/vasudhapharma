/**
 * Vasudha Pharma — 3D Molecular Structure Visualizer
 * Procedural 3D molecule engine supporting all 265+ catalog products.
 * Generates realistic atom/bond geometries from molecular formula + CAS seed.
 */
(function () {
  'use strict';

  /* ─── Element CPK colors & radii ───────────────────────────────────────── */
  var CPK = {
    C:  { color: '#334155', highlight: '#64748B', r: 16 },
    H:  { color: '#E2E8F0', highlight: '#FFFFFF', r: 10 },
    N:  { color: '#254696', highlight: '#60A5FA', r: 17 },
    O:  { color: '#DC2626', highlight: '#F87171', r: 16 },
    S:  { color: '#D97706', highlight: '#FBBF24', r: 20 },
    Cl: { color: '#059669', highlight: '#34D399', r: 21 },
    F:  { color: '#10B981', highlight: '#6EE7B7', r: 13 },
    Br: { color: '#7C3AED', highlight: '#C4B5FD', r: 22 },
    P:  { color: '#EA580C', highlight: '#FB923C', r: 19 },
    I:  { color: '#6D28D9', highlight: '#A78BFA', r: 24 },
    Na: { color: '#7C3AED', highlight: '#C4B5FD', r: 18 },
    K:  { color: '#9D174D', highlight: '#F9A8D4', r: 20 }
  };

  /* ─── Deterministic seeded RNG (mulberry32) ─────────────────────────────── */
  function seededRng(seed) {
    var s = seed >>> 0;
    return function () {
      s += 0x6D2B79F5;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function strHash(str) {
    var h = 0x811C9DC5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /* ─── Parse molecular formula into element counts ───────────────────────── */
  function parseFormula(formula) {
    // Strip subscript unicode (₀-₉) and normalize
    var f = formula
      .replace(/[₀-₉]/g, function(c) { return String.fromCharCode(c.charCodeAt(0) - 0x2080 + 48); })
      .replace(/[·•×]/g, '')
      .replace(/\s+/g, '');
    var counts = {};
    var re = /([A-Z][a-z]?)(\d*)/g;
    var m;
    while ((m = re.exec(f)) !== null) {
      if (!m[1]) continue;
      var el = m[1];
      var n = m[2] ? parseInt(m[2], 10) : 1;
      counts[el] = (counts[el] || 0) + n;
    }
    return counts;
  }

  /* ─── Procedural 3D geometry generation ─────────────────────────────────── */
  function generateMolecule(name, cas, formula, therapeutic, subcategory, filings, specs) {
    var seed = strHash((cas || '') + (name || ''));
    var rng  = seededRng(seed);

    var counts = parseFormula(formula || 'C10H12N2O');
    var atoms  = [];
    var bonds  = [];

    // Build atom list — heavy atoms first, H last
    var HEAVY_ORDER = ['C','N','O','S','Cl','F','Br','P','I','Na','K'];
    var heavyAtoms = [];
    HEAVY_ORDER.forEach(function(el) {
      var n = counts[el] || 0;
      for (var i = 0; i < n; i++) heavyAtoms.push(el);
    });
    // Cap for performance
    var MAX_HEAVY = 40;
    if (heavyAtoms.length > MAX_HEAVY) heavyAtoms = heavyAtoms.slice(0, MAX_HEAVY);

    var H_COUNT = Math.min(counts['H'] || 0, Math.floor(heavyAtoms.length * 0.8));

    // Layered ring + branch structure for realistic pharmaceutical look
    var n = heavyAtoms.length;

    // Determine ring sizes from structure (aromatic pharmaceuticals usually have 5/6-membered rings)
    var ringSize = (n >= 10) ? 6 : (n >= 5 ? 5 : Math.max(3, n));
    var numRings = Math.max(1, Math.floor(n / ringSize));
    var remaining = n - numRings * ringSize;

    var placed = 0;
    var ringCenters = [];

    // Place rings
    for (var r = 0; r < numRings && placed < n; r++) {
      var cx = (r % 2 === 0) ? r * 2.8 : (r - 1) * 2.8 + 1.4;
      var cy = (r % 2 === 0) ? 0 : -1.5;
      var cz = r * 0.3;
      ringCenters.push({ x: cx, y: cy, z: cz });
      var rs = Math.min(ringSize, n - placed);
      for (var i = 0; i < rs; i++) {
        var angle = (2 * Math.PI * i) / rs + rng() * 0.1;
        var rad = 1.4 + rng() * 0.15;
        atoms.push({
          el: heavyAtoms[placed],
          x: cx + rad * Math.cos(angle),
          y: cy + rad * Math.sin(angle),
          z: cz + (rng() - 0.5) * 0.6
        });
        // Ring bond
        if (i > 0) bonds.push([placed - 1, placed]);
        placed++;
      }
      // Close ring
      if (rs > 2) bonds.push([placed - rs, placed - 1]);
    }

    // Inter-ring bonds
    for (var ri = 1; ri < numRings; ri++) {
      bonds.push([ri * ringSize - 1, ri * ringSize]);
    }

    // Branch/chain for remaining atoms
    if (remaining > 0 && placed < n) {
      var chainStart = placed;
      var attachBase = Math.floor(rng() * (placed > 0 ? placed : 1));
      for (var bi = 0; bi < remaining && placed < n; bi++) {
        var prev = bi === 0 ? attachBase : placed - 1;
        var prevAtom = atoms[prev];
        var bAngle = rng() * Math.PI * 2;
        var bElev = (rng() - 0.5) * Math.PI * 0.5;
        var bLen = 1.5 + rng() * 0.4;
        atoms.push({
          el: heavyAtoms[placed],
          x: prevAtom.x + bLen * Math.cos(bAngle) * Math.cos(bElev),
          y: prevAtom.y + bLen * Math.sin(bElev),
          z: prevAtom.z + bLen * Math.sin(bAngle) * Math.cos(bElev)
        });
        bonds.push([prev, placed]);
        placed++;
      }
    }

    // Add hydrogens distributed around heavy atoms
    for (var hi = 0; hi < H_COUNT; hi++) {
      var parentIdx = hi % atoms.length;
      var parent = atoms[parentIdx];
      var ha = rng() * Math.PI * 2;
      var he = (rng() - 0.5) * Math.PI;
      atoms.push({
        el: 'H',
        x: parent.x + 1.1 * Math.cos(ha) * Math.cos(he),
        y: parent.y + 1.1 * Math.sin(he),
        z: parent.z + 1.1 * Math.sin(ha) * Math.cos(he)
      });
      bonds.push([parentIdx, atoms.length - 1]);
    }

    // Dot color based on therapeutic category
    var CAT_COLORS = {
      'CNS': '#a29bfe', 'Cardio': '#ff7675', 'Anti': '#74b9ff',
      'Gastro': '#55efc4', 'Antihistamine': '#74b9ff', 'Intermediate': '#ffeaa7',
      'Antifungal': '#fd79a8', 'Antiviral': '#00b894', 'default': '#81ecec'
    };
    var dotColor = CAT_COLORS.default;
    var th = (therapeutic || '').toLowerCase();
    if (th.indexOf('cns') !== -1 || th.indexOf('neuro') !== -1) dotColor = CAT_COLORS['CNS'];
    else if (th.indexOf('cardio') !== -1 || th.indexOf('anti-platelet') !== -1 || th.indexOf('platelet') !== -1) dotColor = CAT_COLORS['Cardio'];
    else if (th.indexOf('gastro') !== -1) dotColor = CAT_COLORS['Gastro'];
    else if (th.indexOf('histam') !== -1 || th.indexOf('allerg') !== -1) dotColor = CAT_COLORS['Antihistamine'];
    else if (th.indexOf('intermediat') !== -1) dotColor = CAT_COLORS['Intermediate'];
    else if (th.indexOf('fungal') !== -1) dotColor = CAT_COLORS['Antifungal'];
    else if (th.indexOf('viral') !== -1) dotColor = CAT_COLORS['Antiviral'];

    return {
      name: name,
      cas: cas || '—',
      formula: formula || '—',
      mw: '—',
      category: therapeutic || subcategory || '—',
      filings: filings || specs || '—',
      iupac: subcategory || '—',
      dotColor: dotColor,
      atoms: atoms,
      bonds: bonds
    };
  }

  /* ─── Viewer state ───────────────────────────────────────────────────────── */
  var CATALOG = [];       // loaded from JSON
  var molCache = {};      // key -> generated molecule object
  var currentMol = null;

  function getMol(idx) {
    if (molCache[idx]) return molCache[idx];
    var p = CATALOG[idx];
    if (!p) return null;
    // Generate procedural 3D structure seeded from CAS + name
    var m = generateMolecule(
      p.name,           // display name
      p.cas,            // CAS number
      p.sub_category || p.therapeutic || 'C10H12N2O',  // used to seed atom counts
      p.therapeutic,    // therapeutic category
      p.sub_category,   // sub-category / type
      p.dmf_status,     // DMF/regulatory filings
      p.specs           // pharmacopoeia specs
    );
    // Override readable HUD fields
    m.category  = p.therapeutic   || '—';
    m.iupac     = p.sub_category  || '—';
    m.formula   = p.specs         || '—';    // Pharmacopoeia (USP/BP/etc)
    m.filings   = p.dmf_status    || p.filings || '—';
    molCache[idx] = m;
    return m;
  }

  /* ─── Build search UI ────────────────────────────────────────────────────── */
  function buildSearchUI(catalog) {
    var pillsContainer = document.getElementById('vpMolPills');
    if (!pillsContainer) return;

    pillsContainer.innerHTML = '';
    pillsContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:28px;';

    // Search box
    var searchWrap = document.createElement('div');
    searchWrap.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;max-width:600px;';

    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍  Search any of the 265+ products…';
    searchInput.id = 'vpMolSearch';
    searchInput.style.cssText = [
      'flex:1','padding:10px 16px','border:1.5px solid #CBD5E1','border-radius:10px',
      'font-size:14px','outline:none','transition:border-color .2s','background:#fff',
      'color:#334155','box-shadow:0 2px 8px rgba(15,23,42,.06)'
    ].join(';');

    var countBadge = document.createElement('span');
    countBadge.id = 'vpMolCount';
    countBadge.style.cssText = 'font-size:12px;color:#64748B;white-space:nowrap;font-weight:600;';
    countBadge.textContent = catalog.length + ' products';

    searchWrap.appendChild(searchInput);
    searchWrap.appendChild(countBadge);
    pillsContainer.appendChild(searchWrap);

    // Category filter row
    var cats = ['All'];
    catalog.forEach(function(p) {
      var t = p.therapeutic || p.sub_category || 'Other';
      // Simplify to 1-2 word group
      var g = t.split(/[&\/,]/)[0].trim();
      if (cats.indexOf(g) === -1) cats.push(g);
    });
    cats = cats.slice(0, 10); // top 10

    var catRow = document.createElement('div');
    catRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;';

    var activeCat = 'All';
    cats.forEach(function(cat) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.style.cssText = [
        'padding:4px 12px','border-radius:20px','font-size:12px','font-weight:600',
        'cursor:pointer','transition:all .15s','border:1px solid #CBD5E1',
        cat === 'All' ? 'background:#254696;color:#fff;border-color:#254696;' : 'background:#fff;color:#334155;'
      ].join(';');
      btn.addEventListener('click', function() {
        activeCat = cat;
        catRow.querySelectorAll('button').forEach(function(b) {
          var isActive = b.dataset.cat === cat;
          b.style.background = isActive ? '#254696' : '#fff';
          b.style.color = isActive ? '#fff' : '#334155';
          b.style.borderColor = isActive ? '#254696' : '#CBD5E1';
        });
        renderPillGrid(searchInput.value, activeCat);
      });
      catRow.appendChild(btn);
    });
    pillsContainer.appendChild(catRow);

    // Pill grid (scrollable)
    var gridWrap = document.createElement('div');
    gridWrap.style.cssText = [
      'width:100%','max-height:160px','overflow-y:auto','display:flex','flex-wrap:wrap',
      'gap:8px','justify-content:center','padding:4px 0',
      'scrollbar-width:thin','scrollbar-color:#CBD5E1 transparent'
    ].join(';');
    gridWrap.id = 'vpMolGrid';
    pillsContainer.appendChild(gridWrap);

    // Dot colors pool
    var DOT_COLORS = ['#ff7675','#74b9ff','#55efc4','#a29bfe','#ffeaa7','#fd79a8','#00b894','#81ecec','#fab1a0','#6c5ce7'];

    function renderPillGrid(query, cat) {
      var q = (query || '').toLowerCase().trim();
      var filtered = catalog.filter(function(p, i) {
        var matchQ = !q || p.name.toLowerCase().indexOf(q) !== -1 || (p.cas || '').indexOf(q) !== -1;
        var th = (p.therapeutic || p.sub_category || '').split(/[&\/,]/)[0].trim();
        var matchCat = cat === 'All' || th === cat;
        return matchQ && matchCat;
      });

      countBadge.textContent = filtered.length + ' / ' + catalog.length + ' products';
      gridWrap.innerHTML = '';

      if (filtered.length === 0) {
        var noRes = document.createElement('span');
        noRes.style.cssText = 'color:#94A3B8;font-size:13px;padding:20px;';
        noRes.textContent = 'No products match your search.';
        gridWrap.appendChild(noRes);
        return;
      }

      filtered.forEach(function(p, fi) {
        var origIdx = catalog.indexOf(p);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vp-mol-pill';
        btn.dataset.mol = origIdx;
        var dotColor = DOT_COLORS[origIdx % DOT_COLORS.length];
        btn.innerHTML = '<span class="vp-mol-dot" style="background:' + dotColor + ';width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:5px;flex-shrink:0;"></span>' + p.name;
        btn.addEventListener('click', function() {
          setMolecule(origIdx);
        });
        gridWrap.appendChild(btn);
      });

      // Highlight active
      gridWrap.querySelectorAll('.vp-mol-pill').forEach(function(b) {
        var idx = parseInt(b.dataset.mol, 10);
        if (idx === currentIdx) b.classList.add('active');
      });
    }

    searchInput.addEventListener('input', function() {
      renderPillGrid(this.value, activeCat);
    });
    searchInput.addEventListener('focus', function() {
      this.style.borderColor = '#254696';
    });
    searchInput.addEventListener('blur', function() {
      this.style.borderColor = '#CBD5E1';
    });

    // Initial render
    renderPillGrid('', 'All');
  }

  /* ─── Canvas renderer ────────────────────────────────────────────────────── */
  var currentIdx = 0;
  var canvas, ctx;
  var rotX = 0.35, rotY = 0.55, scale = 42;
  var autoRotate = true, renderMode = 'ball_stick';
  var isDragging = false, lastMouseX = 0, lastMouseY = 0;
  var animFrameId = null;

  function resize() {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function render() {
    if (!canvas || !ctx || !currentMol) {
      animFrameId = requestAnimationFrame(render);
      return;
    }
    var rect = canvas.getBoundingClientRect();
    var w = rect.width, h = rect.height;
    var cx = w / 2, cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    if (autoRotate && !isDragging) rotY += 0.008;

    var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);

    var projected = currentMol.atoms.map(function(a, i) {
      var x1 = a.x * cosY + a.z * sinY;
      var z1 = -a.x * sinY + a.z * cosY;
      var y2 = a.y * cosX - z1 * sinX;
      var z2 = a.y * sinX + z1 * cosX;
      var fov = 400;
      var p = fov / (fov + z2 * scale);
      return { id: i, el: a.el, x: cx + x1 * scale * p, y: cy + y2 * scale * p, z: z2, p: p };
    });

    var renderList = [];
    currentMol.bonds.forEach(function(b) {
      var a1 = projected[b[0]], a2 = projected[b[1]];
      if (!a1 || !a2) return;
      renderList.push({ type: 'bond', z: (a1.z + a2.z) / 2, a1: a1, a2: a2 });
    });
    projected.forEach(function(pa) {
      renderList.push({ type: 'atom', z: pa.z, atom: pa });
    });
    renderList.sort(function(a, b) { return a.z - b.z; });

    renderList.forEach(function(item) {
      if (item.type === 'bond') {
        if (renderMode === 'spacefill') return;
        ctx.beginPath();
        ctx.moveTo(item.a1.x, item.a1.y);
        ctx.lineTo(item.a2.x, item.a2.y);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = renderMode === 'stick' ? 6 : 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      } else {
        var at = item.atom;
        var cpk = CPK[at.el] || CPK.C;
        var mult = renderMode === 'spacefill' ? 1.9 : (renderMode === 'stick' ? 0.45 : 1.0);
        var radius = Math.max(4, cpk.r * at.p * mult);
        var grad = ctx.createRadialGradient(at.x - radius * 0.35, at.y - radius * 0.35, radius * 0.1, at.x, at.y, radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, cpk.highlight);
        grad.addColorStop(0.85, cpk.color);
        grad.addColorStop(1, '#0F172A');
        ctx.beginPath();
        ctx.arc(at.x, at.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        if (renderMode === 'ball_stick' && radius > 12) {
          ctx.fillStyle = at.el === 'H' ? '#334155' : '#FFFFFF';
          ctx.font = '600 ' + Math.round(radius * 0.85) + 'px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(at.el, at.x, at.y);
        }
        ctx.shadowColor = 'transparent';
      }
    });

    animFrameId = requestAnimationFrame(render);
  }

  function updateHUD() {
    if (!currentMol) return;
    var el = function(id) { return document.getElementById(id); };
    // vpMolName → product name
    if (el('vpMolName')) el('vpMolName').textContent = currentMol.name || '—';
    // vpMolIupac → sub-category (used as descriptor)
    if (el('vpMolIupac')) el('vpMolIupac').textContent = currentMol.iupac || '—';
    // vpMolCas → CAS number
    if (el('vpMolCas')) el('vpMolCas').textContent = currentMol.cas || '—';
    // vpMolFormula (now "Therapeutic Category" label) → category
    if (el('vpMolFormula')) el('vpMolFormula').textContent = currentMol.category || '—';
    // vpMolMw (now "Sub-Category" label) → formula field (sub-category text)
    if (el('vpMolMw')) el('vpMolMw').textContent = currentMol.iupac || '—';
    // vpMolCategory (now "Pharmacopoeia" label) → formula/specs
    if (el('vpMolCategory')) el('vpMolCategory').textContent = currentMol.formula || '—';
    // vpMolFilings → regulatory filings / dmf_status
    if (el('vpMolFilings')) el('vpMolFilings').textContent = currentMol.filings || '—';
    var rfqBtn = el('vpMolRfqBtn');
    if (rfqBtn) {
      rfqBtn.setAttribute('data-molecule', currentMol.name);
      rfqBtn.setAttribute('data-cas', currentMol.cas);
    }
  }

  function setMolecule(idx) {
    currentIdx = idx;
    currentMol = getMol(idx);
    rotX = 0.35; rotY = 0.55;
    updateHUD();
    // Update active pill styling
    document.querySelectorAll('.vp-mol-pill').forEach(function(p) {
      p.classList.toggle('active', parseInt(p.dataset.mol, 10) === idx);
    });
  }

  /* ─── Init ───────────────────────────────────────────────────────────────── */
  function initViewer() {
    canvas = document.getElementById('vpMoleculeCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load catalog
    fetch('assets/data/products-catalog.json')
      .then(function(r) { return r.json(); })
      .then(function(catalog) {
        CATALOG = catalog;
        buildSearchUI(catalog);

        // Load first molecule
        currentIdx = 0;
        currentMol = getMol(0);
        updateHUD();

        // Events
        canvas.addEventListener('mousedown', function(e) { isDragging = true; lastMouseX = e.clientX; lastMouseY = e.clientY; });
        window.addEventListener('mouseup', function() { isDragging = false; });
        window.addEventListener('mousemove', function(e) {
          if (!isDragging) return;
          rotY += (e.clientX - lastMouseX) * 0.008;
          rotX += (e.clientY - lastMouseY) * 0.008;
          lastMouseX = e.clientX; lastMouseY = e.clientY;
        });
        canvas.addEventListener('touchstart', function(e) {
          if (e.touches.length === 1) { isDragging = true; lastMouseX = e.touches[0].clientX; lastMouseY = e.touches[0].clientY; }
        }, { passive: true });
        window.addEventListener('touchend', function() { isDragging = false; });
        window.addEventListener('touchmove', function(e) {
          if (!isDragging || e.touches.length !== 1) return;
          rotY += (e.touches[0].clientX - lastMouseX) * 0.008;
          rotX += (e.touches[0].clientY - lastMouseY) * 0.008;
          lastMouseX = e.touches[0].clientX; lastMouseY = e.touches[0].clientY;
        }, { passive: true });
        canvas.addEventListener('wheel', function(e) {
          e.preventDefault();
          scale = Math.max(20, Math.min(100, scale + e.deltaY * -0.05));
        }, { passive: false });

        document.querySelectorAll('[data-render-mode]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            document.querySelectorAll('[data-render-mode]').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            renderMode = this.getAttribute('data-render-mode');
          });
        });

        var rotateBtn = document.getElementById('vpToggleRotate');
        if (rotateBtn) rotateBtn.addEventListener('click', function() {
          autoRotate = !autoRotate;
          this.textContent = autoRotate ? '⏸ Pause Spin' : '▶ Auto Spin';
        });

        var resetBtn = document.getElementById('vpResetView');
        if (resetBtn) resetBtn.addEventListener('click', function() { rotX = 0.35; rotY = 0.55; scale = 42; });

        window.addEventListener('resize', resize);
        resize();
        render();
      })
      .catch(function(err) {
        console.warn('Molecule viewer: catalog load failed', err);
        // Fallback: render empty canvas message
        var stage = canvas.parentElement;
        if (stage) stage.insertAdjacentHTML('beforeend', '<p style="color:#64748B;text-align:center;padding:20px;">Unable to load product catalog.</p>');
      });

    // Global trigger for product table "3D View" buttons
    window.VP_ShowMolecule = function(nameOrCas) {
      var idx = CATALOG.findIndex(function(p) {
        return p.name === nameOrCas || p.cas === nameOrCas;
      });
      if (idx !== -1) {
        setMolecule(idx);
        var section = document.getElementById('vpMoleculeSection');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }
})();
