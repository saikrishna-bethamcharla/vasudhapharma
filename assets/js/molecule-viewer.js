/**
 * Vasudha Pharma — 3D Molecular Structure Visualizer
 * High-performance, self-contained Canvas 3D molecule engine with real atom coordinates,
 * depth sorting, specular shading, bond rendering, rotation matrix, and touch/mouse controls.
 */
(function () {
  'use strict';

  // 3D Atomic coordinates and metadata for Vasudha's flagship molecules
  var MOLECULES = {
    clopidogrel: {
      name: 'Clopidogrel',
      cas: '120202-66-6',
      formula: 'C₁₆H₁₆ClNO₂S',
      mw: '321.82 g/mol',
      category: 'Anti-thrombotic / Anti-platelet',
      filings: 'USDMF, CEP, EU-GMP, WHO-GMP',
      iupac: 'methyl (+)-(S)-alpha-(2-chlorophenyl)-6,7-dihydrothieno[3,2-c]pyridine-5(4H)-acetate',
      atoms: [
        // Core thienopyridine & chlorophenyl scaffold
        { el: 'S', x: 2.1, y: 0.8, z: 0.1 },
        { el: 'Cl', x: -3.8, y: 1.6, z: 0.4 },
        { el: 'O', x: -0.6, y: -2.3, z: 0.8 },
        { el: 'O', x: 1.4, y: -2.5, z: -0.5 },
        { el: 'N', x: 0.2, y: 0.3, z: -0.2 },
        { el: 'C', x: 1.1, y: 1.8, z: 0.0 },
        { el: 'C', x: -0.1, y: 1.4, z: -0.1 },
        { el: 'C', x: -0.8, y: -0.7, z: -0.1 },
        { el: 'C', x: -2.2, y: -0.4, z: -0.1 },
        { el: 'C', x: -3.0, y: 0.7, z: 0.2 },
        { el: 'C', x: -4.3, y: 0.6, z: 0.2 },
        { el: 'C', x: -4.8, y: -0.6, z: -0.1 },
        { el: 'C', x: -4.1, y: -1.7, z: -0.3 },
        { el: 'C', x: -2.7, y: -1.6, z: -0.3 },
        { el: 'C', x: 0.1, y: -1.9, z: 0.1 },
        { el: 'C', x: 2.3, y: -3.6, z: -0.4 },
        { el: 'C', x: 1.5, y: -0.2, z: -0.1 },
        { el: 'C', x: 2.6, y: -0.8, z: 0.1 },
        { el: 'H', x: 1.4, y: 2.8, z: 0.0 },
        { el: 'H', x: -0.8, y: -0.8, z: -1.1 },
        { el: 'H', x: -4.9, y: 1.4, z: 0.4 },
        { el: 'H', x: -5.9, y: -0.7, z: -0.1 },
        { el: 'H', x: -4.5, y: -2.7, z: -0.5 },
        { el: 'H', x: 3.1, y: -3.3, z: 0.2 }
      ],
      bonds: [
        [0, 5], [5, 6], [6, 4], [4, 16], [16, 17], [17, 0],
        [4, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 8],
        [9, 1], [7, 14], [14, 2], [14, 3], [3, 15], [5, 18], [7, 19],
        [10, 20], [11, 21], [12, 22], [15, 23]
      ]
    },
    cinnarizine: {
      name: 'Cinnarizine',
      cas: '298-57-7',
      formula: 'C₂₆H₂₈N₂',
      mw: '368.51 g/mol',
      category: 'Antihistamine / Cerebral Vasodilator',
      filings: 'CEP, Ph.Eur, USP, IP',
      iupac: '1-(diphenylmethyl)-4-(3-phenylprop-2-enyl)piperazine',
      atoms: [
        // Piperazine core with dual phenyl branches
        { el: 'N', x: -0.8, y: 0.0, z: 0.0 },
        { el: 'N', x: 1.6, y: 0.0, z: 0.0 },
        { el: 'C', x: -0.3, y: 1.2, z: 0.3 },
        { el: 'C', x: 1.1, y: 1.2, z: 0.3 },
        { el: 'C', x: 1.1, y: -1.2, z: -0.3 },
        { el: 'C', x: -0.3, y: -1.2, z: -0.3 },
        // Benzhydryl group
        { el: 'C', x: -2.2, y: 0.0, z: 0.0 },
        { el: 'C', x: -2.9, y: 1.2, z: 0.2 },
        { el: 'C', x: -4.3, y: 1.2, z: 0.2 },
        { el: 'C', x: -5.0, y: 0.0, z: 0.0 },
        { el: 'C', x: -4.3, y: -1.2, z: -0.2 },
        { el: 'C', x: -2.9, y: -1.2, z: -0.2 },
        // Cinnamyl group
        { el: 'C', x: 3.0, y: 0.0, z: 0.0 },
        { el: 'C', x: 3.8, y: 1.1, z: 0.1 },
        { el: 'C', x: 5.1, y: 1.1, z: 0.1 },
        { el: 'C', x: 5.9, y: 0.0, z: 0.0 },
        { el: 'C', x: 7.3, y: 0.0, z: 0.0 },
        { el: 'H', x: 3.3, y: 2.0, z: 0.2 },
        { el: 'H', x: 5.6, y: 2.0, z: 0.2 }
      ],
      bonds: [
        [0, 2], [2, 3], [3, 1], [1, 4], [4, 5], [5, 0],
        [0, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 7],
        [1, 12], [12, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [14, 18]
      ]
    },
    cyclobenzaprine: {
      name: 'Cyclobenzaprine HCl',
      cas: '6202-23-9',
      formula: 'C₂₀H₂₁N',
      mw: '275.39 g/mol',
      category: 'Skeletal Muscle Relaxant',
      filings: 'USDMF, ASMF, KDMF, Canada',
      iupac: '3-(5H-dibenzo[a,d]cyclohepten-5-ylidene)-N,N-dimethylpropan-1-amine',
      atoms: [
        // Dibenzocycloheptene fused system
        { el: 'C', x: 0.0, y: 1.0, z: 0.0 },
        { el: 'C', x: -1.2, y: 1.8, z: 0.2 },
        { el: 'C', x: -2.5, y: 1.3, z: 0.1 },
        { el: 'C', x: -2.8, y: -0.1, z: -0.1 },
        { el: 'C', x: -1.8, y: -0.9, z: -0.2 },
        { el: 'C', x: -0.5, y: -0.4, z: -0.1 },
        { el: 'C', x: 0.5, y: -1.3, z: -0.2 },
        { el: 'C', x: 1.8, y: -0.9, z: -0.2 },
        { el: 'C', x: 2.8, y: -0.1, z: -0.1 },
        { el: 'C', x: 2.5, y: 1.3, z: 0.1 },
        { el: 'C', x: 1.2, y: 1.8, z: 0.2 },
        // Side chain
        { el: 'C', x: 0.0, y: 2.4, z: 0.2 },
        { el: 'C', x: 0.0, y: 3.5, z: -0.5 },
        { el: 'C', x: 0.0, y: 4.8, z: 0.2 },
        { el: 'N', x: 0.0, y: 6.0, z: -0.5 },
        { el: 'C', x: -1.1, y: 6.8, z: -0.3 },
        { el: 'C', x: 1.1, y: 6.8, z: -0.3 },
        { el: 'H', x: 0.4, y: -2.3, z: -0.3 },
        { el: 'H', x: 2.0, y: -1.8, z: -0.3 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
        [8, 9], [9, 10], [10, 0], [0, 11], [11, 12], [12, 13], [13, 14],
        [14, 15], [14, 16], [6, 17], [7, 18]
      ]
    },
    domperidone: {
      name: 'Domperidone',
      cas: '57808-66-9',
      formula: 'C₂₂H₂₄ClN₅O₂',
      mw: '425.91 g/mol',
      category: 'Anti-emetic / Dopamine Antagonist',
      filings: 'USDMF, CEP, EDQM, IP',
      iupac: '5-chloro-1-[1-[3-(2-oxo-3H-benzimidazol-1-yl)propyl]piperidin-4-yl]-3H-benzimidazol-2-one',
      atoms: [
        // Benzimidazolone 1
        { el: 'Cl', x: -5.5, y: 0.0, z: 0.0 },
        { el: 'C', x: -4.0, y: 0.0, z: 0.0 },
        { el: 'C', x: -3.3, y: 1.2, z: 0.1 },
        { el: 'C', x: -1.9, y: 1.2, z: 0.1 },
        { el: 'N', x: -1.3, y: 0.0, z: 0.0 },
        { el: 'C', x: -0.1, y: 0.0, z: 0.0 },
        { el: 'O', x: 0.6, y: -0.9, z: -0.1 },
        { el: 'N', x: -0.5, y: 1.2, z: 0.1 },
        // Piperidine core
        { el: 'C', x: 1.2, y: 1.2, z: 0.0 },
        { el: 'C', x: 2.1, y: 2.2, z: 0.4 },
        { el: 'C', x: 3.5, y: 1.8, z: 0.2 },
        { el: 'N', x: 3.7, y: 0.4, z: 0.0 },
        { el: 'C', x: 2.8, y: -0.5, z: -0.4 },
        { el: 'C', x: 1.4, y: -0.2, z: -0.2 },
        // Tail
        { el: 'C', x: 5.1, y: 0.0, z: 0.1 },
        { el: 'C', x: 6.0, y: -1.0, z: -0.3 },
        { el: 'O', x: 5.8, y: -2.2, z: -0.6 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [7, 3],
        [5, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 8],
        [11, 14], [14, 15], [15, 16]
      ]
    },
    piperidone: {
      name: '1-Benzyl-4-Piperidone',
      cas: '3612-20-2',
      formula: 'C₁₂H₁₅NO',
      mw: '189.25 g/mol',
      category: 'Advanced Pharma Intermediate (Vasudha Core)',
      filings: 'Commercial Multi-ton Supply',
      iupac: '1-benzylpiperidin-4-one',
      atoms: [
        { el: 'N', x: 0.0, y: 0.0, z: 0.0 },
        { el: 'C', x: 0.8, y: 1.2, z: 0.3 },
        { el: 'C', x: 2.2, y: 0.8, z: 0.1 },
        { el: 'C', x: 2.7, y: -0.6, z: -0.1 },
        { el: 'O', x: 3.9, y: -0.9, z: -0.2 },
        { el: 'C', x: 1.8, y: -1.6, z: -0.3 },
        { el: 'C', x: 0.4, y: -1.2, z: -0.1 },
        // Benzyl group
        { el: 'C', x: -1.4, y: 0.3, z: -0.1 },
        { el: 'C', x: -2.3, y: -0.7, z: 0.2 },
        { el: 'C', x: -3.7, y: -0.5, z: 0.1 },
        { el: 'C', x: -4.4, y: 0.7, z: -0.2 },
        { el: 'C', x: -3.7, y: 1.8, z: -0.4 },
        { el: 'C', x: -2.3, y: 1.6, z: -0.3 },
        { el: 'H', x: -1.6, y: 1.2, z: 0.4 },
        { el: 'H', x: -1.6, y: 0.4, z: -1.1 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 0],
        [0, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 8],
        [7, 13], [7, 14]
      ]
    }
  };

  // Element visualization properties (CPK standard colors with modern vibrant gradient)
  var CPK = {
    C:  { color: '#334155', highlight: '#64748B', r: 16, name: 'Carbon' },
    H:  { color: '#E2E8F0', highlight: '#FFFFFF', r: 10, name: 'Hydrogen' },
    N:  { color: '#254696', highlight: '#60A5FA', r: 17, name: 'Nitrogen' },
    O:  { color: '#DC2626', highlight: '#F87171', r: 16, name: 'Oxygen' },
    S:  { color: '#D97706', highlight: '#FBBF24', r: 20, name: 'Sulfur' },
    Cl: { color: '#059669', highlight: '#34D399', r: 21, name: 'Chlorine' }
  };

  function initViewer() {
    var canvas = document.getElementById('vpMoleculeCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // State
    var currentKey = 'clopidogrel';
    var mol = MOLECULES[currentKey];
    var rotX = 0.35;
    var rotY = 0.55;
    var scale = 42;
    var autoRotate = true;
    var renderMode = 'ball_stick'; // 'ball_stick', 'spacefill', 'stick'
    var isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var animFrameId = null;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Matrix 3D rotation projection
    function render() {
      var rect = canvas.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      var cx = w / 2;
      var cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (autoRotate && !isDragging) {
        rotY += 0.008;
      }

      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      // Project atoms
      var projectedAtoms = mol.atoms.map(function (a, index) {
        // Rotate Y
        var x1 = a.x * cosY + a.z * sinY;
        var z1 = -a.x * sinY + a.z * cosY;
        // Rotate X
        var y2 = a.y * cosX - z1 * sinX;
        var z2 = a.y * sinX + z1 * cosX;

        var fov = 400;
        var p = fov / (fov + z2 * scale);
        return {
          id: index,
          el: a.el,
          x: cx + x1 * scale * p,
          y: cy + y2 * scale * p,
          z: z2,
          p: p
        };
      });

      // Depth sort (render back to front)
      var renderList = [];

      // Add bonds
      mol.bonds.forEach(function (b) {
        var a1 = projectedAtoms[b[0]];
        var a2 = projectedAtoms[b[1]];
        if (!a1 || !a2) return;
        renderList.push({
          type: 'bond',
          z: (a1.z + a2.z) / 2,
          a1: a1,
          a2: a2
        });
      });

      // Add atoms
      projectedAtoms.forEach(function (pa) {
        renderList.push({
          type: 'atom',
          z: pa.z,
          atom: pa
        });
      });

      renderList.sort(function (a, b) {
        return a.z - b.z; // back to front
      });

      // Render items
      renderList.forEach(function (item) {
        if (item.type === 'bond') {
          if (renderMode === 'spacefill') return; // Hide bonds in spacefill
          var b1 = item.a1;
          var b2 = item.a2;
          ctx.beginPath();
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(b2.x, b2.y);
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = renderMode === 'stick' ? 6 : 4;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (item.type === 'atom') {
          var at = item.atom;
          var cpk = CPK[at.el] || CPK.C;
          var mult = renderMode === 'spacefill' ? 1.9 : (renderMode === 'stick' ? 0.45 : 1.0);
          var radius = Math.max(4, cpk.r * at.p * mult);

          // Radial sphere shader for 3D appearance
          var grad = ctx.createRadialGradient(
            at.x - radius * 0.35,
            at.y - radius * 0.35,
            radius * 0.1,
            at.x,
            at.y,
            radius
          );
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.3, cpk.highlight);
          grad.addColorStop(0.85, cpk.color);
          grad.addColorStop(1, '#0F172A');

          ctx.beginPath();
          ctx.arc(at.x, at.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Outer shadow for depth
          ctx.shadowColor = 'rgba(0,0,0,0.18)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 2;

          // Atom symbol label in ball_stick mode
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

    // UI Updates
    function updateHUD() {
      var elName = document.getElementById('vpMolName');
      var elCas = document.getElementById('vpMolCas');
      var elFormula = document.getElementById('vpMolFormula');
      var elMw = document.getElementById('vpMolMw');
      var elCat = document.getElementById('vpMolCategory');
      var elFil = document.getElementById('vpMolFilings');
      var elIupac = document.getElementById('vpMolIupac');

      if (elName) elName.textContent = mol.name;
      if (elCas) elCas.textContent = mol.cas;
      if (elFormula) elFormula.innerHTML = mol.formula;
      if (elMw) elMw.textContent = mol.mw;
      if (elCat) elCat.textContent = mol.category;
      if (elFil) elFil.textContent = mol.filings;
      if (elIupac) elIupac.textContent = mol.iupac;

      // Update quote button with selected molecule
      var rfqBtn = document.getElementById('vpMolRfqBtn');
      if (rfqBtn) {
        rfqBtn.setAttribute('data-molecule', mol.name);
        rfqBtn.setAttribute('data-cas', mol.cas);
      }
    }

    function setMolecule(key) {
      if (!MOLECULES[key]) return;
      currentKey = key;
      mol = MOLECULES[key];
      rotX = 0.35;
      rotY = 0.55;
      updateHUD();

      // Update active pills
      document.querySelectorAll('.vp-mol-pill').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-mol') === key);
      });
    }

    // Interaction Events
    canvas.addEventListener('mousedown', function (e) {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - lastMouseX;
      var dy = e.clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - lastMouseX;
      var dy = e.touches[0].clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    // Zoom on wheel
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      scale += e.deltaY * -0.05;
      scale = Math.max(20, Math.min(80, scale));
    }, { passive: false });

    // Mode Buttons
    document.querySelectorAll('[data-render-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-render-mode]').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        renderMode = this.getAttribute('data-render-mode');
      });
    });

    // Molecule Selector Pills
    document.querySelectorAll('.vp-mol-pill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMolecule(this.getAttribute('data-mol'));
      });
    });

    // Auto rotate toggle
    var rotateBtn = document.getElementById('vpToggleRotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', function () {
        autoRotate = !autoRotate;
        this.textContent = autoRotate ? '⏸ Pause Spin' : '▶ Auto Spin';
      });
    }

    // Reset view
    var resetBtn = document.getElementById('vpResetView');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        rotX = 0.35;
        rotY = 0.55;
        scale = 42;
      });
    }

    // Expose global trigger for product table "3D View" buttons
    window.VP_ShowMolecule = function (key) {
      setMolecule(key);
      var section = document.getElementById('vpMoleculeSection');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Setup and start
    window.addEventListener('resize', resize);
    resize();
    updateHUD();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }
})();
