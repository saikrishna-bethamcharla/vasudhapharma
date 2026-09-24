/**
 * Vasudha Pharma Chem Limited — Interactive Unit-by-Unit Facility & Equipment Explorer
 * Handles interactive unit selection, region filtering, and dynamic specs presentation.
 */

(function () {
  'use strict';

  const UNITS_DATA = [
    {
      id: 'unit-1',
      name: 'UNIT-1, Hyderabad',
      shortName: 'Unit 1',
      tagline: 'APIs & High-Purity Piperidine Derivatives',
      region: 'hyderabad',
      location: 'Jeedimetla, Hyderabad, Telangana',
      area: '4.0 Acres (16,220 Sq.Mt)',
      image: 'assets/unit-1.jpg',
      badges: ['USFDA Inspected', 'WHO-GMP', 'KFDA / COFEPRIS'],
      desc: 'Our foundation manufacturing facility operational since 1994. Specialized in bulk active pharmaceutical ingredients and high-purity piperidine synthesis, with advanced computerized process automation and zero-harm safety culture.',
      totalVolume: '99 KL',
      reactorsCount: '34 Vessels',
      tempRange: '-15°C to +200°C',
      pressureRange: 'Up to 15 kg/cm²',
      cleanrooms: '9 ISO Class 8 Suites',
      cleanUtilities: 'USP Purified Water, Clean Compressed Air, High-Vacuum Distillation (0.5 mmHg)',
      metallurgy: { glr: 65, ss: 35, hast: 0 },
      coreTechnologies: [
        'Piperidine & Piperidone Synthesis',
        'Catalytic Hydrogenation (Liquid Phase)',
        'Fractional High-Vacuum Distillation',
        'Centrifugal Solid-Liquid Separation'
      ],
      keyProducts: [
        'Amitriptyline Hydrochloride (Ph. Eur, USP)',
        'Cyproheptadine Hydrochloride',
        'Fexofenadine HCl Intermediates',
        'Piperidine Speciality Reagents'
      ],
      accreditations: ['USFDA', 'WHO-GMP', 'KFDA (South Korea)', 'COFEPRIS (Mexico)', 'ISO 9001:2015', 'ISO 14001:2015']
    },
    {
      id: 'unit-2',
      name: 'UNIT-2, Visakhapatnam',
      shortName: 'Unit 2',
      tagline: 'Scale-Up Hub & High-Potency API Synthesis',
      region: 'vizag',
      location: 'JN Pharma City, Parawada, Visakhapatnam, AP',
      area: '10.63 Acres (43,040 Sq.Mt)',
      image: 'assets/unit-2.jpg',
      badges: ['USFDA Inspected', 'PMDA Japan', 'EDQM CEP'],
      desc: 'High-tech commercial site paired with DSIR-recognized research scale-up suites and multi-product synthesis trains. Features cutting-edge cryogenic envelopes and Hastelloy reactors for corrosive, low-temperature transformations.',
      totalVolume: '371 KL',
      reactorsCount: '111 Vessels',
      tempRange: '-80°C to +220°C',
      pressureRange: 'Up to 40 kg/cm²',
      cleanrooms: '14 ISO Class 8 Suites',
      cleanUtilities: 'WFI & Pure Steam Loop, Chilled Brine (-80°C), Dedicated Ultra-Pure N2 Plant',
      metallurgy: { glr: 35, ss: 25, hast: 40 },
      coreTechnologies: [
        'Extreme Cryogenic Synthesis (-80°C)',
        'Chiral Asymmetric Induction',
        'High-Pressure Autoclave Hydrogenation',
        'Closed-Loop Micronization & Milling'
      ],
      keyProducts: [
        'Olmesartan Medoxomil (EDQM CEP)',
        'Clopidogrel Bisulfate (USP / Ph. Eur)',
        'Aripiprazole API',
        'High-Potency Cardiological Actives'
      ],
      accreditations: ['USFDA', 'PMDA Japan', 'EDQM / CEP', 'WHO-GMP', 'ISO 14001:2015', 'ISO 45001:2018']
    },
    {
      id: 'unit-3',
      name: 'UNIT-3, Visakhapatnam',
      shortName: 'Unit 3',
      tagline: 'High-Volume Commercial APIs & Export Powerhouse',
      region: 'vizag',
      location: 'JNPC SEZ, Parawada, Visakhapatnam, AP',
      area: '9.02 Acres (36,529 Sq.Mt)',
      image: 'assets/unit-3.jpg',
      badges: ['USFDA Inspected (2025)', 'PMDA Japan', 'ANVISA Brazil'],
      desc: 'Located in the prestigious Jawaharlal Nehru Pharma City SEZ, this facility services highly regulated European and North American markets. Successfully concluded USFDA cGMP inspection in September 2025 with zero data-integrity observations.',
      totalVolume: '232 KL',
      reactorsCount: '68 Vessels',
      tempRange: '-25°C to +250°C',
      pressureRange: 'Up to 50 bar',
      cleanrooms: '7 ISO Class 8 Suites',
      cleanUtilities: 'USP Purified Water System, Scrubber Containment, Automated DCS Supervisory',
      metallurgy: { glr: 55, ss: 45, hast: 0 },
      coreTechnologies: [
        'Proton Pump Inhibitor (PPI) Chemistry',
        'Sulfoxidation & Stereoselective Synthesis',
        'Computerized Process Safety Management (PSM)',
        'Fluidized Bed Centrifugal Drying'
      ],
      keyProducts: [
        'Pantoprazole Sodium (USP / Ph. Eur / IP)',
        'Esomeprazole Magnesium Trihydrate',
        'Rabeprazole Sodium',
        'Omeprazole Bulk Actives'
      ],
      accreditations: ['USFDA (Inspected 2025)', 'PMDA Japan', 'ANVISA Brazil', 'European Written Confirmation (EU-WC)', 'WHO-GMP']
    },
    {
      id: 'unit-4',
      name: 'UNIT-4, Visakhapatnam',
      shortName: 'Unit 4',
      tagline: 'Modified-Release Pellets, Beads & MUPS Suite',
      region: 'vizag',
      location: 'Auto Nagar, Gajuwaka, Visakhapatnam, AP',
      area: '3.32 Acres (13,436 Sq.Mt)',
      image: 'assets/unit-4.jpg',
      badges: ['WHO-GMP Certified', 'ISO 9001:2015', '80 MT / Month Output'],
      desc: 'Our specialized semi-finished formulations center engineered for multi-particulate drug delivery systems. Equipped with advanced Glatt/Wurster fluid bed coaters delivering micro-encapsulated, enteric, and sustained-release pellets.',
      totalVolume: '80 MT / Month',
      reactorsCount: '16 Coater Trains',
      tempRange: '+15°C to +80°C (Controlled RH)',
      pressureRange: 'Fluid Bed Aerodynamic',
      cleanrooms: 'Class 100,000 (ISO 8) Processing',
      cleanUtilities: 'Dehumidified Clean Air (RH < 35%), Clean Steam, HEPA Class H14 Air Handling',
      metallurgy: { glr: 0, ss: 100, hast: 0 },
      coreTechnologies: [
        'Wurster Bottom-Spray Fluid Bed Coating',
        'Extrusion & Spheronization Matrix',
        'Multiple-Unit Pellet Systems (MUPS)',
        'Dual-Release Fixed Dose Beads'
      ],
      keyProducts: [
        'Pantoprazole Gastro-Resistant Pellets 8.5% & 15%',
        'Omeprazole Enteric-Coated Pellets 8.5% & 20%',
        'Esomeprazole MUPS Pellets',
        'Itraconazole 22% Pellets'
      ],
      accreditations: ['WHO-GMP', 'ISO 9001:2015', 'State DCA Drug License (11/VSP/AP/2016/F/R)']
    },
    {
      id: 'unit-5',
      name: 'UNIT-5, Visakhapatnam',
      shortName: 'Unit 5 (Mega Flagship)',
      tagline: 'Flagship Global Mega Campus — 801 KL API Hub',
      region: 'vizag',
      location: 'APSEZ, Atchutapuram, Visakhapatnam, AP',
      area: '26.02 Acres (105,300 Sq.Mt)',
      image: 'assets/unit-5.jpg',
      badges: ['USFDA / PMDA GMP', 'EDQM CEP Certified', '801 KL Mega Volume'],
      desc: 'The crowning achievement of Vasudha Pharma: a 26-acre mega campus housing 108 heavy-duty reactors, 21 finishing cleanrooms, and fully computerized Siemens PCS7 DCS control architecture with multi-stage Zero Liquid Discharge (ZLD).',
      totalVolume: '801 KL',
      reactorsCount: '108 Heavy Vessels',
      tempRange: '-80°C to +250°C',
      pressureRange: 'Vacuum to 45 bar',
      cleanrooms: '21 ISO Class 8 Cleanroom Suites',
      cleanUtilities: 'Dedicated Multi-Effect Evaporator (MEE) ZLD, WFI Loops, Captive Nitrogen Generation',
      metallurgy: { glr: 60, ss: 40, hast: 0 },
      coreTechnologies: [
        'Continuous Process Distillation Columns',
        'Multi-Step Stereoselective Chemistry',
        'Automated Clean-In-Place (CIP/SIP) Systems',
        'Full 21 CFR Part 11 Electronic Batch Records'
      ],
      keyProducts: [
        'Olmesartan Medoxomil CEP API',
        'Loperamide Hydrochloride (PMDA Japan GMP)',
        'Telmisartan API',
        'Global Anti-Hypertensive Franchise'
      ],
      accreditations: ['USFDA Inspected', 'PMDA Japan GMP', 'EDQM CEP', 'EU Written Confirmation (EU-WC)', 'WHO-GMP', 'ISO 14001:2015']
    },
    {
      id: 'unit-shriram',
      name: 'SHRI RAM CHLOROCHEM',
      shortName: 'Shri Ram Chlorochem',
      tagline: 'Specialty Chlorination & Corrosive Chemistry Center',
      region: 'hyderabad',
      location: 'Sangareddy District, Telangana',
      area: '5.17 Acres (20,931 Sq.Mt)',
      image: 'assets/unit-shriram-chlorochem.jpg',
      badges: ['USFDA Approved', 'Chlorination Specialist', '220 KL Volume'],
      desc: 'Strategic manufacturing facility integrated into Vasudha Pharma to secure high-hazard synthesis, phosphorus oxychloride transformations, and bulk intermediate chemistry feeding our global regulatory API portfolio.',
      totalVolume: '220 KL',
      reactorsCount: '59 Heavy Vessels',
      tempRange: '-10°C to +180°C',
      pressureRange: 'Up to 20 bar',
      cleanrooms: 'Bulk Industrial Intermediate Suites',
      cleanUtilities: 'Multi-Stage Acid Gas Scrubber Towers, Thermal Oxidizer, Online TOC Effluent Sensors',
      metallurgy: { glr: 80, ss: 10, hast: 10 },
      coreTechnologies: [
        'Thionyl Chloride & POCl3 Chlorination',
        'Bromination & Halogenation Reactions',
        'Corrosion-Resistant Glass-Lined Trains',
        'Bulk Key Starting Material (KSM) Synthesis'
      ],
      keyProducts: [
        '4-Chloro-1-Methylpiperidine HCl',
        'Chlorinated Heterocyclic Intermediates',
        'Piperidone Synthetic Precursors',
        'Custom Specialty Intermediates'
      ],
      accreditations: ['USFDA Approved for KSM', 'Integrated EHS ISO 14001:2015', 'ISO 9001:2015', 'State Pollution Control Board Clearance']
    },
    {
      id: 'unit-vikasith',
      name: 'VIKASITH R&D CENTER',
      shortName: 'Vikasith R&D Hub',
      tagline: 'Corporate Innovation, AR&D & Tech Transfer HQ',
      region: 'hyderabad',
      location: 'Corporate R&D Hub, Hyderabad, Telangana',
      area: '50,000+ Sq.Ft State-of-the-Art Labs',
      image: 'assets/company-aerial.jpg',
      badges: ['DSIR Recognized', '120+ Fume Hoods', 'Kilo-Lab & Pilot Suite'],
      desc: 'Our central research and technology development engine. Staffed by 150+ research chemists and doctorate scientists working across synthetic organic scouting, polymorph discovery, process safety calorimeters, and analytical validation.',
      totalVolume: 'Kilo-Lab to 500L Pilot',
      reactorsCount: '24 Pilot Vessels',
      tempRange: '-90°C to +250°C',
      pressureRange: 'RC1e Reaction Calorimeter & Buchi Glass Autoclaves',
      cleanrooms: 'Class 10,000 Sample Preparation',
      cleanUtilities: 'Dedicated Gas Lines (H2, N2, He, Ar), Chilled Glycol, Pure Steam Generator',
      metallurgy: { glr: 50, ss: 30, hast: 20 },
      coreTechnologies: [
        'Route Scouting & Non-Infringing Process Design',
        'RC1e Reaction Calorimetry & Thermal Hazard Evaluation',
        'Polymorph Screening & Chiral Resolution',
        'Trace Impurity Profiling by LC-MS/MS & NMR'
      ],
      keyProducts: [
        'Green Chemistry Synthesis Routes',
        'US/EU Patent Non-Infringing Processes',
        'Analytical Method Validation Protocols',
        'Technology Transfer Dossiers'
      ],
      accreditations: ['DSIR Recognized (Govt. of India)', 'GLP-Compliant Analytical Documentation', '21 CFR Part 11 Chromatography Software']
    }
  ];

  function renderUnitExplorer() {
    const mountPoint = document.getElementById('vueExplorerMount');
    if (!mountPoint) return;

    let activeUnitId = 'unit-5'; // default to flagship
    let activeRegion = 'all';

    function buildMarkup() {
      const activeUnit = UNITS_DATA.find(u => u.id === activeUnitId) || UNITS_DATA[0];

      return `
        <div class="vue-explorer-section" id="mfg-interactive-explorer">
          <div class="container">
            <div class="vue-header">
              <div class="vue-kicker">Interactive Technical Showcase</div>
              <h2 class="vue-title">Unit-by-Unit Facility &amp; Equipment Explorer</h2>
              <p class="vue-desc">Explore reactor metallurgy, temperature envelopes, cleanroom classifications, clean utilities, and regulatory accreditations across our 7 manufacturing campuses and research headquarters.</p>
            </div>

            <!-- Region Filter Chips -->
            <div class="vue-region-filter">
              <button type="button" class="vue-filter-chip ${activeRegion === 'all' ? 'active' : ''}" data-region="all">
                All Campuses (${UNITS_DATA.length})
              </button>
              <button type="button" class="vue-filter-chip ${activeRegion === 'vizag' ? 'active' : ''}" data-region="vizag">
                Visakhapatnam Hub (4)
              </button>
              <button type="button" class="vue-filter-chip ${activeRegion === 'hyderabad' ? 'active' : ''}" data-region="hyderabad">
                Hyderabad &amp; Telangana (3)
              </button>
            </div>

            <!-- Unit Navigation Tabs -->
            <div class="vue-tabs-scroller" role="tablist" aria-label="Manufacturing Facilities">
              ${UNITS_DATA.map(unit => {
                const isHidden = activeRegion !== 'all' && unit.region !== activeRegion;
                if (isHidden) return '';
                const isActive = unit.id === activeUnitId;
                return `
                  <button type="button" class="vue-tab-btn ${isActive ? 'active' : ''}" data-unit-id="${unit.id}" role="tab" aria-selected="${isActive}">
                    <span class="vue-tab-num">${unit.shortName}</span>
                    <span class="vue-tab-loc">${unit.location.split(',')[0]}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Interactive Showcase Card -->
            <div class="vue-showcase-card">
              <div class="vue-grid">
                <!-- Left Visual Column -->
                <div class="vue-visual-col">
                  <div class="vue-image-box">
                    <img src="${activeUnit.image}" alt="${activeUnit.name}" loading="lazy" decoding="async">
                    <div class="vue-badge-bar">
                      <span class="vue-badge highlight">${activeUnit.totalVolume}</span>
                      ${activeUnit.badges.map(b => `<span class="vue-badge">${b}</span>`).join('')}
                    </div>
                  </div>

                  <div class="vue-site-info">
                    <h3 class="vue-site-title">${activeUnit.name}</h3>
                    <div class="vue-site-sub">${activeUnit.tagline}</div>
                    <p class="vue-site-desc">${activeUnit.desc}</p>

                    <div style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--vue-text-muted); margin-bottom: 8px;">
                      Verified Regulatory Accreditations
                    </div>
                    <div class="vue-accreditations-strip">
                      ${activeUnit.accreditations.map(acc => `
                        <span class="vue-pill-tag">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--vue-primary);"><path d="M20 6L9 17l-5-5"/></svg>
                          ${acc}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- Right Technical Column -->
                <div class="vue-details-col">
                  <div>
                    <!-- KPI Metrics Grid -->
                    <div class="vue-metrics-grid">
                      <div class="vue-metric-card">
                        <div class="vue-metric-val">${activeUnit.totalVolume}</div>
                        <div class="vue-metric-lbl">Total Capacity</div>
                      </div>
                      <div class="vue-metric-card">
                        <div class="vue-metric-val">${activeUnit.reactorsCount}</div>
                        <div class="vue-metric-lbl">Reactor Fleet</div>
                      </div>
                      <div class="vue-metric-card">
                        <div class="vue-metric-val">${activeUnit.cleanrooms.split(' ')[0]}</div>
                        <div class="vue-metric-lbl">Cleanroom Suites</div>
                      </div>
                      <div class="vue-metric-card">
                        <div class="vue-metric-val">${activeUnit.tempRange.split(' ')[0]}</div>
                        <div class="vue-metric-lbl">Cryogenic Limit</div>
                      </div>
                    </div>

                    <!-- Reactor Metallurgy Meter -->
                    <div class="vue-spec-section">
                      <div class="vue-spec-heading">
                        <span>Reactor Metallurgy Breakdown</span>
                        <span style="font-size:11px; color:var(--vue-text-muted);">Corrosion Resistance</span>
                      </div>
                      <div class="vue-meter-track" title="GLR: ${activeUnit.metallurgy.glr}%, SS-316L: ${activeUnit.metallurgy.ss}%, Hastelloy: ${activeUnit.metallurgy.hast}%">
                        <div class="vue-meter-bar-glr" style="width: ${activeUnit.metallurgy.glr}%;"></div>
                        <div class="vue-meter-bar-ss" style="width: ${activeUnit.metallurgy.ss}%;"></div>
                        <div class="vue-meter-bar-hast" style="width: ${activeUnit.metallurgy.hast}%;"></div>
                      </div>
                      <div class="vue-meter-legend">
                        <span class="vue-legend-item"><span class="vue-dot vue-dot-glr"></span> Glass-Lined (GLR) ${activeUnit.metallurgy.glr}%</span>
                        <span class="vue-legend-item"><span class="vue-dot vue-dot-ss"></span> Stainless Steel (SS-316L) ${activeUnit.metallurgy.ss}%</span>
                        ${activeUnit.metallurgy.hast > 0 ? `<span class="vue-legend-item"><span class="vue-dot vue-dot-hast"></span> Hastelloy C-276 ${activeUnit.metallurgy.hast}%</span>` : ''}
                      </div>
                    </div>

                    <!-- Capabilities & Products Grid -->
                    <div class="vue-capabilities-grid">
                      <div class="vue-cap-box">
                        <div class="vue-cap-title">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--vue-primary);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          Process &amp; Chemistry Strengths
                        </div>
                        <ul class="vue-cap-list">
                          ${activeUnit.coreTechnologies.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                      </div>

                      <div class="vue-cap-box">
                        <div class="vue-cap-title">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--vue-primary);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                          Key Products Manufactured
                        </div>
                        <ul class="vue-cap-list">
                          ${activeUnit.keyProducts.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                      </div>
                    </div>

                    <!-- Clean Utilities Details -->
                    <div style="background:#f1f5f9; border-radius:10px; padding:12px 16px; margin-bottom:20px; font-size:12.5px; color:#334155; line-height:1.5;">
                      <strong style="color:var(--vue-text); display:block; font-size:11.5px; text-transform:uppercase; margin-bottom:3px; letter-spacing:0.04em;">Clean Utilities &amp; Environmental Infrastructure:</strong>
                      ${activeUnit.cleanUtilities}
                    </div>
                  </div>

                  <!-- Action Bar -->
                  <div class="vue-action-bar">
                    <div class="vue-action-note">
                      Site Area: <strong>${activeUnit.area}</strong> | Pressure Envelope: <strong>${activeUnit.pressureRange}</strong>
                    </div>
                    <a href="contact.html?inquiry_unit=${encodeURIComponent(activeUnit.shortName)}" class="vue-btn-inquire">
                      Inquire About Capacity at ${activeUnit.shortName} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function update() {
      mountPoint.innerHTML = buildMarkup();
      attachEvents();
    }

    function attachEvents() {
      // Region filters
      mountPoint.querySelectorAll('.vue-filter-chip').forEach(btn => {
        btn.addEventListener('click', function () {
          activeRegion = this.getAttribute('data-region');
          // if current activeUnit is hidden by region, switch to first visible
          const visible = UNITS_DATA.filter(u => activeRegion === 'all' || u.region === activeRegion);
          if (!visible.some(u => u.id === activeUnitId)) {
            activeUnitId = visible[0].id;
          }
          update();
        });
      });

      // Unit tab buttons
      mountPoint.querySelectorAll('.vue-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          activeUnitId = this.getAttribute('data-unit-id');
          update();
        });
      });
    }

    update();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUnitExplorer);
  } else {
    renderUnitExplorer();
  }
})();
