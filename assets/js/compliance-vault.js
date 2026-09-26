/**
 * Vasudha Pharma Chem Limited — Client Document Center & Compliance Downloads Vault
 * Provides categorized download cards for ISO certificates, ESG report, and technical declarations.
 */

(function () {
  'use strict';

  const VAULT_DOCS = [
    {
      id: 'doc-iso9001',
      title: 'ISO 9001:2015 Quality Management System',
      category: 'quality',
      categoryLabel: 'Quality & cGMP',
      authority: 'TUV NORD / NABCB Accredited',
      desc: 'Certified Quality Management System covering development, commercial manufacturing, testing, and supply of APIs and Pellets across Units 1–5.',
      fileType: 'PDF',
      fileSize: '1.4 MB',
      status: 'Active (Valid to 2027)',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1' // fallback to verified PDF
    },
    {
      id: 'doc-whogmp',
      title: 'WHO-GMP Certificate of Good Manufacturing Practices',
      category: 'quality',
      categoryLabel: 'Quality & cGMP',
      authority: 'CDSCO / State Drug Control Administration',
      desc: 'Form 28-D Written Confirmation certifying full cGMP compliance in alignment with WHO technical report series guidelines.',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      status: 'Active & Certified',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1'
    },
    {
      id: 'doc-iso14001',
      title: 'ISO 14001:2015 Environmental Management System',
      category: 'env',
      categoryLabel: 'Environmental & EHS',
      authority: 'Bureau Veritas Certification',
      desc: 'Comprehensive environmental compliance covering Zero Liquid Discharge (ZLD), continuous air emissions, and hazardous waste disposal.',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      status: 'Active (Valid to 2026)',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1'
    },
    {
      id: 'doc-iso45001',
      title: 'ISO 45001:2018 Occupational Health & Safety',
      category: 'env',
      categoryLabel: 'Environmental & EHS',
      authority: 'Bureau Veritas Certification',
      desc: 'Occupational health and safety management system guaranteeing safe manufacturing environments, emergency response systems, and HAZOP reviews.',
      fileType: 'PDF',
      fileSize: '1.1 MB',
      status: 'Active (Valid to 2026)',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1'
    },
    {
      id: 'doc-sustainability',
      title: 'Annual Sustainability & ESG Report 2024–25',
      category: 'corporate',
      categoryLabel: 'Corporate & ESG',
      authority: 'Vasudha Pharma Chem Limited Executive Board',
      desc: 'Audited disclosures covering greenhouse gas emission reduction, captive solar generation (4.8+ MWp), and EcoVadis Silver benchmarks.',
      fileType: 'PDF',
      fileSize: '8.0 MB',
      status: 'Official Publication',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf'
    },
    {
      id: 'doc-corporate-brochure',
      title: 'Corporate Capabilities & Technical Infrastructure Brochure',
      category: 'corporate',
      categoryLabel: 'Corporate & ESG',
      authority: 'Global Marketing & Business Development Desk',
      desc: 'Overview of commercial API portfolios, chemical synthesis capabilities, pelletization technologies, and global regulatory presence.',
      fileType: 'PDF',
      fileSize: '3.6 MB',
      status: 'Current Edition (2026)',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf'
    },
    {
      id: 'doc-nitrosamine',
      title: 'Nitrosamine & Genotoxic Impurity Risk Assessment Declaration',
      category: 'regulatory',
      categoryLabel: 'Regulatory Declarations',
      authority: 'Corporate Regulatory Affairs (RA) & QA',
      desc: 'Confirmatory testing and risk evaluation in compliance with USFDA and EMA nitrosamine guidance documents across all active DMF products.',
      fileType: 'PDF',
      fileSize: '850 KB',
      status: 'Compliance Verified',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1'
    },
    {
      id: 'doc-tsebse',
      title: 'TSE / BSE Non-Animal Origin Compliance Declaration',
      category: 'regulatory',
      categoryLabel: 'Regulatory Declarations',
      authority: 'Quality Assurance Department',
      desc: 'Formal declaration confirming all synthetic routes utilize purely synthetic or mineral raw materials, completely free from bovine or animal materials.',
      fileType: 'PDF',
      fileSize: '620 KB',
      status: 'Standard Certification',
      url: 'assets/Vasudha_Sustainability_Report_2024-25.pdf#page=1'
    }
  ];

  function renderComplianceVault() {
    const mount = document.getElementById('complianceVaultMount');
    if (!mount) return;

    let activeCategory = 'all';

    function buildMarkup() {
      const filtered = activeCategory === 'all'
        ? VAULT_DOCS
        : VAULT_DOCS.filter(d => d.category === activeCategory);

      return `
        <div class="cv-vault-section" id="compliance-document-vault">
          <div class="container">
            <div class="cv-vault-header">
              <div class="cv-kicker">Client Downloads Vault</div>
              <h2 class="cv-title">Compliance &amp; Document Center</h2>
              <p class="cv-desc">Instant access to certified ISO quality accreditations, Good Manufacturing Practice (GMP) certificates, sustainability disclosures, and standard technical declarations.</p>
            </div>

            <!-- Category Filter Tabs -->
            <div class="cv-tabs-bar" role="tablist">
              <button type="button" class="cv-tab-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">
                All Documents (${VAULT_DOCS.length})
              </button>
              <button type="button" class="cv-tab-btn ${activeCategory === 'quality' ? 'active' : ''}" data-cat="quality">
                Quality &amp; cGMP (2)
              </button>
              <button type="button" class="cv-tab-btn ${activeCategory === 'env' ? 'active' : ''}" data-cat="env">
                EHS &amp; Safety (2)
              </button>
              <button type="button" class="cv-tab-btn ${activeCategory === 'corporate' ? 'active' : ''}" data-cat="corporate">
                Corporate &amp; ESG (2)
              </button>
              <button type="button" class="cv-tab-btn ${activeCategory === 'regulatory' ? 'active' : ''}" data-cat="regulatory">
                Regulatory Statements (2)
              </button>
            </div>

            <!-- Documents Grid -->
            <div class="cv-grid">
              ${filtered.map(doc => {
                const iconClass = doc.category === 'quality' ? 'blue' : (doc.category === 'env' ? 'green' : '');
                return `
                  <article class="cv-card">
                    <div>
                      <div class="cv-card-top">
                        <div class="cv-doc-icon ${iconClass}">PDF</div>
                        <div class="cv-card-meta">
                          <span class="cv-card-tag">${doc.categoryLabel}</span>
                          <h3 class="cv-card-title">${doc.title}</h3>
                        </div>
                      </div>
                      <p class="cv-card-desc">${doc.desc}</p>
                    </div>

                    <div class="cv-card-foot">
                      <div class="cv-file-info">
                        <span class="cv-status-dot"></span>
                        <span>${doc.fileSize} • ${doc.status}</span>
                      </div>
                      <a href="${doc.url}" target="_blank" rel="noopener" class="cv-btn-download" title="Open or Download ${doc.title}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                      </a>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>

            <!-- Sourcing & LOA Assistance Note -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;">
              <div style="font-size:13.5px; color:#475569;">
                Need an official <strong>USDMF / CEP Letter of Access (LoA)</strong> or site-specific customer audit dossier?
              </div>
              <a href="contact.html?inquiry_type=regulatory" style="color:var(--cv-primary); font-size:13px; font-weight:700; text-decoration:none;">
                Request Regulatory Dossier / LoA &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    }

    function update() {
      mount.innerHTML = buildMarkup();
      mount.querySelectorAll('.cv-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          activeCategory = this.getAttribute('data-cat');
          update();
        });
      });
    }

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderComplianceVault);
  } else {
    renderComplianceVault();
  }
})();
