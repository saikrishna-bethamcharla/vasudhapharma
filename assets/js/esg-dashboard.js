/**
 * Vasudha Pharma Chem Limited — Interactive Sustainability & ESG Dashboard
 * Handles animated metrics counting, pillar tabs, and interactive client impact estimation.
 */

(function () {
  'use strict';

  const ESG_PILLARS = {
    env: {
      title: 'Environmental Stewardship & Zero Liquid Discharge (ZLD)',
      features: [
        {
          title: '1,200+ KLD Advanced ZLD Processing',
          desc: '100% of industrial effluent is treated through Multiple Effect Evaporators (MEE) and Agitated Thin Film Dryers (ATFD), returning pure condensate to plant cooling towers.'
        },
        {
          title: 'Hazardous Air Scrubber Containment',
          desc: 'Packed acid scrubber towers with multi-stage caustic and oxidizing scrubbing ensure atmospheric gaseous emissions remain well below central pollution board thresholds.'
        },
        {
          title: 'Captive Solar Energy Generation (4.8+ MWp)',
          desc: 'Rooftop and ground-mounted solar photovoltaic arrays power continuous daytime agitation and packaging suites, avoiding thousands of tons of grid CO₂ annually.'
        },
        {
          title: 'Continuous Online CEMS Monitoring',
          desc: 'Real-time Continuous Emission Monitoring Systems (CEMS) and online TOC/pH sensors stream round-the-clock compliance telemetry directly to state regulatory portals.'
        }
      ]
    },
    chem: {
      title: 'Green Chemistry, Atom Economy & Circular Solvents',
      features: [
        {
          title: '>92.5% Solvent Fractional Recovery',
          desc: 'Dedicated automated distillation columns recover process solvents (toluene, THF, ethyl acetate, methylene chloride) at pharmaceutical grade purity for closed-loop reuse.'
        },
        {
          title: 'High Atom Economy Catalytic Hydrogenation',
          desc: 'Transition from stoichiometric chemical reduction agents to catalytic high-pressure hydrogenation dramatically reduces hazardous solid waste and process mass intensity.'
        },
        {
          title: 'Elimination of Toxic Chlorinated Reagents',
          desc: 'Vikasith R&D actively re-engineers legacy synthetic routes to replace chlorinated solvents with eco-friendly alcohol and aqueous-compatible reaction systems.'
        },
        {
          title: 'Process Mass Intensity (PMI) Optimization',
          desc: 'Systematic reduction of raw material consumption per kilogram of finished API, achieving industry-leading E-Factor metrics across key therapeutic lines.'
        }
      ]
    },
    soc: {
      title: 'Corporate Social Responsibility (CSR) & Community Care',
      features: [
        {
          title: '150,000+ Native Trees Planted',
          desc: 'Extensive green belt reforestation programs established across manufacturing peripheries in Parawada, Atchutapuram, and Telangana through the Vasudha Foundation.'
        },
        {
          title: '45+ Rural Health Screening Camps',
          desc: 'Regular medical diagnosis, free pharmaceutical distribution, and specialist consultations conducted across neighboring village communities in Visakhapatnam and Nalgonda.'
        },
        {
          title: 'Education & School Infrastructure Support',
          desc: 'Scholarships, clean drinking water reverse osmosis units, and modern digital classrooms funded for thousands of students across rural government schools.'
        },
        {
          title: 'Zero-Harm Occupational Health & Safety',
          desc: 'Certified to ISO 45001:2018 with continuous behavioral safety training, HAZOP reviews, and dedicated on-site medical centers with emergency health officers.'
        }
      ]
    }
  };

  function renderEsgDashboard() {
    const mount = document.getElementById('esgDashboardMount');
    if (!mount) return;

    let activePillar = 'env';
    let currentBatchMT = 25; // default 25 MT supply

    function calculateImpact(mt) {
      return {
        solventLiters: (mt * 1420).toLocaleString(),
        waterKLD: (mt * 38.5).toFixed(1),
        solarKwh: (mt * 420).toLocaleString(),
        co2SavedKg: (mt * 315).toLocaleString()
      };
    }

    function buildMarkup() {
      const pillar = ESG_PILLARS[activePillar];
      const impact = calculateImpact(currentBatchMT);

      return `
        <div class="esg-dashboard-section" id="esg-metrics-hub">
          <div class="container">
            <div class="esg-dash-header">
              <div class="esg-kicker">ESG &amp; Corporate Responsibility</div>
              <h2 class="esg-dash-title">Interactive Sustainability &amp; ESG Metrics Dashboard</h2>
              <p class="esg-dash-desc">Transparent environmental stewardship, closed-loop circular solvent recovery, and community social investment across Vasudha Pharma's manufacturing footprint.</p>
            </div>

            <!-- 4-Card Hero Metric Grid -->
            <div class="esg-kpi-grid">
              <div class="esg-kpi-card">
                <div class="esg-kpi-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>
                <div class="esg-kpi-val" data-target="1200" id="kpi-zld">1,200+</div>
                <div class="esg-kpi-label">KLD Effluent Recycled</div>
                <div class="esg-kpi-detail">100% Zero Liquid Discharge (ZLD) via Multiple Effect Evaporator &amp; ATFD systems.</div>
              </div>

              <div class="esg-kpi-card">
                <div class="esg-kpi-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                </div>
                <div class="esg-kpi-val" data-target="4.8" id="kpi-solar">4.8+</div>
                <div class="esg-kpi-label">MWp Captive Solar Energy</div>
                <div class="esg-kpi-detail">Rooftop &amp; captive solar installations powering daytime production operations.</div>
              </div>

              <div class="esg-kpi-card">
                <div class="esg-kpi-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div class="esg-kpi-val" data-target="92.5" id="kpi-solv">>92.5%</div>
                <div class="esg-kpi-label">Solvent Recovery Rate</div>
                <div class="esg-kpi-detail">High-efficiency fractional columns returning process solvents to pure specifications.</div>
              </div>

              <div class="esg-kpi-card">
                <div class="esg-kpi-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </div>
                <div class="esg-kpi-val" data-target="150000" id="kpi-trees">150,000+</div>
                <div class="esg-kpi-label">Trees Planted &amp; Nurtured</div>
                <div class="esg-kpi-detail">Extensive green belt belts planted across AP &amp; Telangana via Vasudha Foundation.</div>
              </div>
            </div>

            <!-- Interactive Pillars Filter Tabs -->
            <div class="esg-tabs-bar" role="tablist">
              <button type="button" class="esg-tab-btn ${activePillar === 'env' ? 'active' : ''}" data-pillar="env">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                Environmental &amp; ZLD (EcoVadis Silver)
              </button>
              <button type="button" class="esg-tab-btn ${activePillar === 'chem' ? 'active' : ''}" data-pillar="chem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>
                Green Chemistry &amp; Circular Solvents
              </button>
              <button type="button" class="esg-tab-btn ${activePillar === 'soc' ? 'active' : ''}" data-pillar="soc">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Social Responsibility &amp; Vasudha Foundation
              </button>
            </div>

            <!-- Pillar Feature Content -->
            <div class="esg-pillar-card">
              <h3 style="font-size:20px; font-weight:800; color:var(--esg-text); margin-bottom:20px;">${pillar.title}</h3>
              <div class="esg-pillar-grid">
                ${pillar.features.map(f => `
                  <div class="esg-feature-item">
                    <div class="esg-feature-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <div class="esg-feature-content">
                      <h4>${f.title}</h4>
                      <p>${f.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Interactive Supply Impact Estimator -->
            <div class="esg-calc-box">
              <div class="esg-calc-grid">
                <div class="esg-calc-intro">
                  <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.1); border-radius:14px; padding:3px 10px; font-size:11.5px; font-weight:700; text-transform:uppercase; color:#6ee7b7; margin-bottom:10px;">
                    Sustainable Sourcing Calculator
                  </div>
                  <h3>Calculate Your Supply Environmental Dividends</h3>
                  <p>Slide to your estimated annual API sourcing volume to view estimated solvent recycling, water conservation, and clean energy benefits under Vasudha's ESG manufacturing framework.</p>

                  <div class="esg-slider-wrap">
                    <div class="esg-slider-head">
                      <span>Annual Sourcing Volume:</span>
                      <strong id="sliderValDisplay" style="color:#6ee7b7; font-size:16px;">${currentBatchMT} Metric Tons (MT)</strong>
                    </div>
                    <input type="range" min="1" max="150" value="${currentBatchMT}" class="esg-slider" id="esgBatchSlider">
                  </div>
                </div>

                <div class="esg-calc-results">
                  <div class="esg-result-card">
                    <div class="esg-result-val" id="resSolvent">${impact.solventLiters} L</div>
                    <div class="esg-result-lbl">Solvent Recycled</div>
                  </div>
                  <div class="esg-result-card">
                    <div class="esg-result-val" id="resWater">${impact.waterKLD} KL</div>
                    <div class="esg-result-lbl">Water Conserved via ZLD</div>
                  </div>
                  <div class="esg-result-card">
                    <div class="esg-result-val" id="resSolar">${impact.solarKwh} kWh</div>
                    <div class="esg-result-lbl">Clean Solar Energy</div>
                  </div>
                  <div class="esg-result-card">
                    <div class="esg-result-val" id="resCo2">${impact.co2SavedKg} kg</div>
                    <div class="esg-result-lbl">CO₂ Avoidance</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Download Official Sustainability Report Banner -->
            <div class="esg-report-banner">
              <div class="esg-report-left">
                <div class="esg-pdf-icon">PDF</div>
                <div class="esg-report-text">
                  <h4>Vasudha Sustainability &amp; ESG Annual Report 2024–25</h4>
                  <p>Comprehensive verified disclosures on carbon metrics, EcoVadis silver ranking, and water stewardship.</p>
                </div>
              </div>
              <a href="assets/Vasudha_Sustainability_Report_2024-25.pdf" target="_blank" rel="noopener" class="esg-report-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download Annual Report (PDF)
              </a>
            </div>
          </div>
        </div>
      `;
    }

    function updateView() {
      mount.innerHTML = buildMarkup();
      attachEvents();
    }

    function attachEvents() {
      // Tab clicks
      mount.querySelectorAll('.esg-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          activePillar = this.getAttribute('data-pillar');
          updateView();
        });
      });

      // Slider input
      const slider = mount.querySelector('#esgBatchSlider');
      if (slider) {
        slider.addEventListener('input', function () {
          currentBatchMT = parseInt(this.value, 10);
          const valDisplay = mount.querySelector('#sliderValDisplay');
          if (valDisplay) valDisplay.textContent = currentBatchMT + ' Metric Tons (MT)';

          const impact = calculateImpact(currentBatchMT);
          const elSolvent = mount.querySelector('#resSolvent');
          const elWater = mount.querySelector('#resWater');
          const elSolar = mount.querySelector('#resSolar');
          const elCo2 = mount.querySelector('#resCo2');

          if (elSolvent) elSolvent.textContent = impact.solventLiters + ' L';
          if (elWater) elWater.textContent = impact.waterKLD + ' KL';
          if (elSolar) elSolar.textContent = impact.solarKwh + ' kWh';
          if (elCo2) elCo2.textContent = impact.co2SavedKg + ' kg';
        });
      }
    }

    updateView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEsgDashboard);
  } else {
    renderEsgDashboard();
  }
})();
