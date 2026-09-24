/**
 * Vasudha Pharma Chem Limited — Candidate Application Status Tracker
 * Handles application reference lookup, pipeline stepper rendering, and live form hook.
 */

(function () {
  'use strict';

  const MOCK_APPLICATIONS = {
    'VP-2026-GET': {
      id: 'VP-2026-GET',
      name: 'Aarav Sharma',
      role: 'Graduate Executive Trainee (GET) — Synthesis & Scale-Up',
      location: 'Unit-2, Visakhapatnam',
      appliedDate: '18 September, 2026',
      currentStep: 3, // 1 to 4
      statusLabel: 'Panel Interview Scheduled',
      statusClass: 'in-progress',
      reviewerNote: 'Technical assessment passed with commendation (Score: 92%). Panel interview scheduled with Senior Technical Committee & HR on September 28, 2026.'
    },
    'VP-2026-QA': {
      id: 'VP-2026-QA',
      name: 'Priyanka Rao',
      role: 'Assistant Manager — Quality Assurance (Analytical Reviews)',
      location: 'Unit-5, Atchutapuram, Vizag',
      appliedDate: '10 September, 2026',
      currentStep: 4,
      statusLabel: 'Formal Offer Issued',
      statusClass: 'passed',
      reviewerNote: 'All technical and executive panel rounds cleared. Formal appointment letter dispatched to registered email. Induction scheduled at Unit-5.'
    },
    'VP-2026-RND': {
      id: 'VP-2026-RND',
      name: 'Dr. K. Srinivas',
      role: 'Senior Research Scientist — Process Chemistry & Catalysis',
      location: 'Vikasith R&D Center, Hyderabad',
      appliedDate: '21 September, 2026',
      currentStep: 2,
      statusLabel: 'Technical Evaluation In Progress',
      statusClass: 'in-progress',
      reviewerNote: 'Application profile approved by Talent Acquisition. Non-infringing route scouting case study is currently under technical review by Principal Scientist.'
    }
  };

  const STEPS_DATA = [
    { num: 1, title: 'Profile Screening', desc: 'Initial CV & cGMP credential evaluation by Talent Acquisition' },
    { num: 2, title: 'Technical Assessment', desc: 'Written synthesis / chromatography evaluation' },
    { num: 3, title: 'Panel Interview', desc: 'Department Head & Technical Leadership consultation' },
    { num: 4, title: 'Offer & Onboarding', desc: 'Formal offer issuance, verification & Day-1 induction' }
  ];

  function initTracker() {
    const portalBox = document.querySelector('.cp-form-box');
    const applyForm = document.getElementById('applyMainForm');
    if (!portalBox || !applyForm) return;

    // 1. Create Top Mode Switcher (Apply Form vs Tracker)
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'cat-mode-tabs';
    tabsContainer.innerHTML = `
      <button type="button" class="cat-mode-tab active" id="catTabApply">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Submit New Application
      </button>
      <button type="button" class="cat-mode-tab" id="catTabTrack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Track Application Status
      </button>
    `;
    portalBox.insertBefore(tabsContainer, portalBox.firstChild);

    // 2. Create Tracker Panel Container
    const trackerPanel = document.createElement('div');
    trackerPanel.className = 'cat-tracker-panel';
    trackerPanel.id = 'catTrackerPanel';
    trackerPanel.innerHTML = `
      <div class="cat-search-box">
        <div style="font-size: 16px; font-weight: 700; color: var(--cat-text); margin-bottom: 6px;">Check Your Application Progress</div>
        <p style="font-size: 13.5px; color: var(--cat-text-muted); margin-bottom: 14px;">Enter the official Application Reference ID provided upon submission or received via email.</p>

        <form class="cat-search-form" id="catTrackSearchForm">
          <input type="text" class="cat-search-input" id="catSearchInput" placeholder="e.g. VP-2026-GET, VP-2026-QA, VP-2026-RND" required>
          <button type="submit" class="cat-btn-track">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Track Status
          </button>
        </form>

        <div class="cat-samples-strip">
          <span>Quick Samples:</span>
          <button type="button" class="cat-sample-chip" data-sample="VP-2026-GET">VP-2026-GET (Trainee)</button>
          <button type="button" class="cat-sample-chip" data-sample="VP-2026-QA">VP-2026-QA (Offer Issued)</button>
          <button type="button" class="cat-sample-chip" data-sample="VP-2026-RND">VP-2026-RND (In Review)</button>
        </div>
      </div>

      <div id="catResultContainer"></div>
    `;

    // Insert tracker panel after the apply form container
    portalBox.appendChild(trackerPanel);

    // Get elements
    const tabApply = document.getElementById('catTabApply');
    const tabTrack = document.getElementById('catTabTrack');
    const alertBox = portalBox.querySelector('.careers-alert');
    const searchForm = document.getElementById('catTrackSearchForm');
    const searchInput = document.getElementById('catSearchInput');
    const resultContainer = document.getElementById('catResultContainer');

    function switchTab(mode) {
      if (mode === 'apply') {
        tabApply.classList.add('active');
        tabTrack.classList.remove('active');
        applyForm.style.display = '';
        if (alertBox) alertBox.style.display = '';
        trackerPanel.classList.remove('active');
      } else {
        tabTrack.classList.add('active');
        tabApply.classList.remove('active');
        applyForm.style.display = 'none';
        if (alertBox) alertBox.style.display = 'none';
        trackerPanel.classList.add('active');

        // Check if user has an active application in localStorage
        const storedApp = localStorage.getItem('vp_user_application');
        if (storedApp) {
          try {
            const parsed = JSON.parse(storedApp);
            renderResult(parsed);
            searchInput.value = parsed.id;
            return;
          } catch (e) {}
        }

        // Otherwise show sample default
        renderResult(MOCK_APPLICATIONS['VP-2026-GET']);
      }
    }

    tabApply.addEventListener('click', () => switchTab('apply'));
    tabTrack.addEventListener('click', () => switchTab('track'));

    // Handle Search
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const queryId = searchInput.value.trim().toUpperCase();
      if (!queryId) return;

      if (MOCK_APPLICATIONS[queryId]) {
        renderResult(MOCK_APPLICATIONS[queryId]);
        return;
      }

      // Check localStorage
      const stored = localStorage.getItem('vp_user_application');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id.toUpperCase() === queryId) {
            renderResult(parsed);
            return;
          }
        } catch (e) {}
      }

      // Dynamic generic lookup for custom IDs
      renderResult({
        id: queryId,
        name: 'Applicant Candidate',
        role: 'Pharmaceutical Professional Track',
        location: 'Hyderabad / Vizag Facility',
        appliedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        currentStep: 1,
        statusLabel: 'Application Received & Under Review',
        statusClass: 'in-progress',
        reviewerNote: `Application ${queryId} has been successfully registered with Vasudha Pharma Chem Talent Acquisition. Initial qualification screening typically completes within 3 to 5 business days.`
      });
    });

    // Sample Chips
    trackerPanel.querySelectorAll('.cat-sample-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        const id = this.getAttribute('data-sample');
        searchInput.value = id;
        renderResult(MOCK_APPLICATIONS[id]);
      });
    });

    function renderResult(app) {
      resultContainer.innerHTML = `
        <div class="cat-result-card">
          <div class="cat-app-head">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: var(--cat-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
                Application ID: ${app.id}
              </div>
              <h3 class="cat-app-role">${app.role}</h3>
              <div class="cat-app-meta">
                <span>Candidate: <strong>${app.name}</strong></span>
                <span>•</span>
                <span>Location: <strong>${app.location}</strong></span>
                <span>•</span>
                <span>Submitted: <strong>${app.appliedDate}</strong></span>
              </div>
            </div>
            <span class="cat-status-badge ${app.statusClass}">
              <span style="width:7px; height:7px; border-radius:50%; background:currentColor;"></span>
              ${app.statusLabel}
            </span>
          </div>

          <!-- Stepper -->
          <div class="cat-stepper">
            ${STEPS_DATA.map(step => {
              let stateClass = '';
              let circleContent = step.num;
              if (step.num < app.currentStep) {
                stateClass = 'completed';
                circleContent = '✓';
              } else if (step.num === app.currentStep) {
                stateClass = 'current';
              }
              return `
                <div class="cat-step-item ${stateClass}">
                  <div class="cat-step-circle">${circleContent}</div>
                  <div class="cat-step-title">${step.title}</div>
                  <div class="cat-step-desc">${step.desc}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Reviewer Note -->
          <div class="cat-notes-banner">
            <strong style="color:var(--cat-text); display:block; margin-bottom:4px; font-size:13px;">Latest Talent Acquisition Update:</strong>
            ${app.reviewerNote}
          </div>
        </div>
      `;
    }

    // 3. Intercept applyMainForm Submission to generate real Reference ID
    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const role = document.getElementById('appRole')?.value || 'Pharmaceutical Candidate';
      const name = document.getElementById('appFullName')?.value || 'Applicant';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `VP-2026-${randomNum}`;

      const newApp = {
        id: generatedId,
        name: name,
        role: role,
        location: 'Vasudha Pharma Chem Ltd',
        appliedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        currentStep: 1,
        statusLabel: 'Submitted & In Initial Review',
        statusClass: 'in-progress',
        reviewerNote: `Congratulations ${name}! Your application has been logged into the recruitment queue under Reference ID ${generatedId}. You will receive status notifications at your registered email.`
      };

      try {
        localStorage.setItem('vp_user_application', JSON.stringify(newApp));
      } catch (err) {}

      // Show success modal with tracker link
      const successBox = document.getElementById('applyMainSuccess');
      if (successBox) {
        successBox.hidden = false;
        successBox.innerHTML = `
          <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:14px; padding:28px 24px; text-align:center; margin-bottom:24px;">
            <div style="width:52px; height:52px; border-radius:50%; background:#10b981; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:14px;">✓</div>
            <h3 style="font-size:22px; font-weight:800; color:#065f46; margin-bottom:8px;">Application Successfully Received!</h3>
            <p style="font-size:15px; color:#047857; line-height:1.6; max-width:600px; margin:0 auto 16px;">
              Thank you for applying to Vasudha Pharma Chem Limited. Your dedicated Application Reference ID is:
            </p>
            <div style="display:inline-block; background:#ffffff; border:2px dashed #059669; padding:8px 20px; border-radius:8px; font-size:20px; font-weight:800; color:#065f46; letter-spacing:1px; margin-bottom:20px;">
              ${generatedId}
            </div>
            <div>
              <button type="button" id="btnTrackNow" style="background:#0E8F6C; color:#ffffff; border:none; padding:12px 24px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer;">
                Track Application Status Now &rarr;
              </button>
            </div>
          </div>
        `;
        document.getElementById('btnTrackNow')?.addEventListener('click', function () {
          successBox.hidden = true;
          switchTab('track');
        });
      }

      applyForm.reset();
      window.scrollTo({ top: 250, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
  } else {
    initTracker();
  }
})();
