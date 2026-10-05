/**
 * Vasudha Pharma — 3D Molecular Structure Visualizer
 * Procedural 3D molecule engine supporting all 265+ catalog products.
 * Generates realistic atom/bond geometries from molecular formula + CAS seed.
 *
 * Supports:
 * - Single scrollable options horizontal line with navigation arrows & wheel scroll
 * - Strict category isolation: only APIs on apis.html, each product in its own category
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
    var f = (formula || '')
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

  /* ─── Procedural 3D Molecule Generator ─────────────────────────────────── */
  function generateMolecule(name, cas, formulaStr, category, subCat, dmf, specs) {
    var seed = strHash((cas || '') + ':' + name);
    var rand = seededRng(seed);

    var counts = parseFormula(formulaStr || '');
    var totalHeavy = 0;
    Object.keys(counts).forEach(function(el) {
      if (el !== 'H') totalHeavy += counts[el];
    });

    if (totalHeavy < 6 || totalHeavy > 50) {
      var n = 12 + Math.floor(rand() * 14);
      counts = { C: n, N: rand() > 0.4 ? 2 : 1, O: rand() > 0.3 ? 2 : 1 };
      if (rand() > 0.6) counts.Cl = 1;
      if (rand() > 0.7) counts.S = 1;
      counts.H = Math.round(n * 1.2 + rand() * 4);
    }

    var atoms = [];
    var bonds = [];

    var ringSize = rand() > 0.4 ? 6 : 5;
    var ringRadius = 1.35;
    for (var r = 0; r < ringSize; r++) {
      var theta = (r / ringSize) * Math.PI * 2;
      var rEl = 'C';
      if (r === 2 && counts.N && counts.N > 0) { rEl = 'N'; counts.N--; }
      else if (r === 4 && counts.S && counts.S > 0) { rEl = 'S'; counts.S--; }
      else if (counts.C && counts.C > 0) { counts.C--; }
      atoms.push({
        el: rEl,
        x: Math.cos(theta) * ringRadius,
        y: Math.sin(theta) * ringRadius,
        z: (rand() - 0.5) * 0.2
      });
      if (r > 0) bonds.push([r - 1, r]);
    }
    bonds.push([ringSize - 1, 0]);

    var hasSecondRing = rand() > 0.35;
    var secondRingStart = atoms.length;
    if (hasSecondRing) {
      var offsetTheta = rand() * Math.PI * 2;
      var cx = Math.cos(offsetTheta) * (ringRadius * 2.1);
      var cy = Math.sin(offsetTheta) * (ringRadius * 2.1);
      var r2Size = 6;
      for (var r2 = 0; r2 < r2Size; r2++) {
        var t2 = (r2 / r2Size) * Math.PI * 2;
        var el2 = 'C';
        if (r2 === 1 && counts.N && counts.N > 0) { el2 = 'N'; counts.N--; }
        else if (counts.C && counts.C > 0) { counts.C--; }
        atoms.push({
          el: el2,
          x: cx + Math.cos(t2) * ringRadius,
          y: cy + Math.sin(t2) * ringRadius,
          z: (rand() - 0.5) * 0.4
        });
        if (r2 > 0) bonds.push([secondRingStart + r2 - 1, secondRingStart + r2]);
      }
      bonds.push([secondRingStart + r2Size - 1, secondRingStart]);
      bonds.push([Math.floor(rand() * ringSize), secondRingStart]);
    }

    var remaining = [];
    Object.keys(counts).forEach(function(el) {
      if (el === 'H') return;
      for (var k = 0; k < counts[el]; k++) remaining.push(el);
    });

    var heavyCount = atoms.length;
    var curParent = Math.floor(rand() * heavyCount);
    for (var i = 0; i < remaining.length; i++) {
      var pAtom = atoms[curParent];
      var phi = rand() * Math.PI * 2;
      var costheta = rand() * 2 - 1;
      var u = rand();
      var thetaA = Math.acos(costheta);
      var rA = 1.35 + rand() * 0.25;

      var newX = pAtom.x + rA * Math.sin(thetaA) * Math.cos(phi);
      var newY = pAtom.y + rA * Math.sin(thetaA) * Math.sin(phi);
      var newZ = pAtom.z + rA * Math.cos(thetaA);

      var newIdx = atoms.length;
      atoms.push({ el: remaining[i], x: newX, y: newY, z: newZ });
      bonds.push([curParent, newIdx]);

      if (rand() > 0.4) {
        curParent = newIdx;
      } else {
        curParent = Math.floor(rand() * atoms.length);
      }
    }

    var hCount = Math.min(counts.H || 12, atoms.length * 2);
    for (var h = 0; h < hCount; h++) {
      var targetParent = Math.floor(rand() * atoms.length);
      var pa = atoms[targetParent];
      if (pa.el === 'Cl' || pa.el === 'Br' || pa.el === 'I' || pa.el === 'F') continue;
      var hPhi = rand() * Math.PI * 2;
      var hTheta = rand() * Math.PI;
      var hR = 0.95;
      var hIdx = atoms.length;
      atoms.push({
        el: 'H',
        x: pa.x + hR * Math.sin(hTheta) * Math.cos(hPhi),
        y: pa.y + hR * Math.sin(hTheta) * Math.sin(hPhi),
        z: pa.z + hR * Math.cos(hTheta)
      });
      bonds.push([targetParent, hIdx]);
    }

    var avgX = 0, avgY = 0, avgZ = 0;
    atoms.forEach(function(a) { avgX += a.x; avgY += a.y; avgZ += a.z; });
    avgX /= atoms.length; avgY /= atoms.length; avgZ /= atoms.length;
    atoms.forEach(function(a) { a.x -= avgX; a.y -= avgY; a.z -= avgZ; });

    var maxDist = 0.1;
    atoms.forEach(function(a) {
      var d = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
      if (d > maxDist) maxDist = d;
    });
    var scaleNorm = 2.4 / maxDist;
    atoms.forEach(function(a) { a.x *= scaleNorm; a.y *= scaleNorm; a.z *= scaleNorm; });

    return {
      name: name,
      cas: cas,
      formula: formulaStr,
      category: category,
      subCat: subCat,
      dmf: dmf,
      specs: specs,
      atoms: atoms,
      bonds: bonds
    };
  }

  /* ─── State & Cache ──────────────────────────────────────────────────────── */
  var MASTER_CATALOG = [];
  var CATALOG = [];
  var PAGE_CATEGORY = null;
  var currentIdx = 0;
  var currentMol = null;
  var molCache = {};

  function getMol(idx) {
    if (molCache[idx]) return molCache[idx];
    var p = CATALOG[idx];
    if (!p) return null;
    var casVal = p.cas || p.cas_no || '';
    var subCatVal = p.sub_category || p.intermediate_name || p.composition || p.pellet_type || p.therapeutic || '';
    var specVal = p.specs || p.specifications || '';
    var filingsVal = p.dmf_status || p.filings || '';
    var m = generateMolecule(
      p.name,
      casVal,
      subCatVal || 'C10H12N2O',
      p.therapeutic || p.category,
      subCatVal,
      filingsVal,
      specVal
    );
    m.category = p.therapeutic  || p.category || '—';
    m.iupac    = subCatVal      || '—';
    m.formula  = specVal        || '—';
    m.filings  = filingsVal     || '—';
    m.cas      = casVal         || '—';
    molCache[idx] = m;
    return m;
  }

  /* ─── Detect active page context ────────────────────────────────────────── */
  function detectPageCategory() {
    var path = (window.location.pathname || '').toLowerCase();
    var href = (window.location.href || '').toLowerCase();
    if (path.indexOf('apis') !== -1 || href.indexOf('apis.html') !== -1) return 'apis';
    if (path.indexOf('intermediate') !== -1 || href.indexOf('intermediates.html') !== -1) return 'intermediates';
    if (path.indexOf('pellet') !== -1 || href.indexOf('pellets.html') !== -1) return 'pellets';
    if (path.indexOf('piperidone') !== -1 || href.indexOf('piperidone-derivatives.html') !== -1) return 'piperidones';
    if (path.indexOf('under-dev') !== -1 || href.indexOf('under-development.html') !== -1) return 'under-dev';
    return 'all';
  }

  /* ─── Build single horizontal scroll UI (no search bar, no sub divisions) ─── */
  function buildSearchUI(activeCatalog, pageCat, masterCatalog) {
    var pillsContainer = document.getElementById('vpMolPills');
    if (!pillsContainer) return;

    pillsContainer.innerHTML = '';
    pillsContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:24px;width:100%;';

    // Single Scrollable Horizontal Options Line (with Left & Right Arrows)
    var hscrollWrap = document.createElement('div');
    hscrollWrap.className = 'vp-mol-hscroll-wrap';

    var leftArrow = document.createElement('button');
    leftArrow.type = 'button';
    leftArrow.className = 'vp-mol-scroll-btn vp-mol-scroll-left';
    leftArrow.innerHTML = '&lsaquo;';
    leftArrow.title = 'Scroll left';
    leftArrow.setAttribute('aria-label', 'Scroll products left');

    var rightArrow = document.createElement('button');
    rightArrow.type = 'button';
    rightArrow.className = 'vp-mol-scroll-btn vp-mol-scroll-right';
    rightArrow.innerHTML = '&rsaquo;';
    rightArrow.title = 'Scroll right';
    rightArrow.setAttribute('aria-label', 'Scroll products right');

    var gridWrap = document.createElement('div');
    gridWrap.id = 'vpMolGrid';

    leftArrow.addEventListener('click', function() {
      gridWrap.scrollBy({ left: -260, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', function() {
      gridWrap.scrollBy({ left: 260, behavior: 'smooth' });
    });

    // Horizontal wheel scroll support
    gridWrap.addEventListener('wheel', function(e) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        gridWrap.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    hscrollWrap.appendChild(leftArrow);
    hscrollWrap.appendChild(gridWrap);
    hscrollWrap.appendChild(rightArrow);
    pillsContainer.appendChild(hscrollWrap);

    var DOT_COLORS = ['#ff7675','#74b9ff','#55efc4','#a29bfe','#ffeaa7','#fd79a8','#00b894','#81ecec','#fab1a0','#6c5ce7'];

    function renderPillGrid() {
      gridWrap.innerHTML = '';
      var pool = (pageCat === 'all') ? masterCatalog : activeCatalog;

      if (!pool || pool.length === 0) {
        var noRes = document.createElement('span');
        noRes.style.cssText = 'color:#94A3B8;font-size:13px;padding:12px 20px;';
        noRes.textContent = 'No products found.';
        gridWrap.appendChild(noRes);
        return;
      }

      pool.forEach(function(p, fi) {
        var origIdx = CATALOG.indexOf(p);
        if (origIdx === -1) {
          origIdx = CATALOG.length;
          CATALOG.push(p);
        }

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vp-mol-pill';
        btn.dataset.mol = origIdx;
        var dotColor = DOT_COLORS[origIdx % DOT_COLORS.length];
        btn.innerHTML = '<span class="vp-mol-dot" style="background:' + dotColor + ';width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:6px;flex-shrink:0;"></span>' + p.name;

        btn.addEventListener('click', function() {
          setMolecule(origIdx);
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        gridWrap.appendChild(btn);
      });

      // Highlight active product pill and center it
      var activeBtn = null;
      gridWrap.querySelectorAll('.vp-mol-pill').forEach(function(b) {
        var idx = parseInt(b.dataset.mol, 10);
        if (idx === currentIdx) {
          b.classList.add('active');
          activeBtn = b;
        } else {
          b.classList.remove('active');
        }
      });
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Initial render
    renderPillGrid();
  }

  /* ─── Canvas renderer ────────────────────────────────────────────────────── */
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
    if (el('vpMolName')) el('vpMolName').textContent = currentMol.name || '—';
    if (el('vpMolIupac')) el('vpMolIupac').textContent = currentMol.iupac || '—';
    if (el('vpMolCas')) el('vpMolCas').textContent = currentMol.cas || '—';
    if (el('vpMolCategory')) el('vpMolCategory').textContent = currentMol.category || '—';
    if (el('vpMolMw')) el('vpMolMw').textContent = currentMol.iupac || '—';
    if (el('vpMolFormula')) el('vpMolFormula').textContent = currentMol.formula || '—';
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

    PAGE_CATEGORY = detectPageCategory();

    fetch('assets/data/products-catalog.json?v=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(rawCatalog) {
        var list = Array.isArray(rawCatalog) ? rawCatalog : (rawCatalog && Array.isArray(rawCatalog.items) ? rawCatalog.items : []);
        MASTER_CATALOG = list;

        // When on a category-specific page, isolate catalog strictly to that category
        if (PAGE_CATEGORY && PAGE_CATEGORY !== 'all') {
          CATALOG = list.filter(function(p) {
            var cat = (p.category || '').toLowerCase();
            return cat === PAGE_CATEGORY || cat === PAGE_CATEGORY.replace(/-/g, '') || cat.indexOf(PAGE_CATEGORY) !== -1;
          });
          if (!CATALOG.length) CATALOG = list;
        } else {
          CATALOG = list;
        }

        buildSearchUI(CATALOG, PAGE_CATEGORY, MASTER_CATALOG);

        // Load first molecule
        currentIdx = 0;
        currentMol = getMol(0);
        updateHUD();

        // Canvas interaction events
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
        var stage = canvas.parentElement;
        if (stage) stage.insertAdjacentHTML('beforeend', '<p style="color:#64748B;text-align:center;padding:20px;">Unable to load product catalog.</p>');
      });

    // Global trigger for external buttons
    window.VP_ShowMolecule = function(nameOrCas) {
      var pool = (PAGE_CATEGORY && PAGE_CATEGORY !== 'all') ? CATALOG : MASTER_CATALOG;
      var idx = pool.findIndex(function(p) {
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
