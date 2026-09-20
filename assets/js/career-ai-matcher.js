/**
 * Vasudha Pharma — AI Career Fit & Resume Matcher
 * Client-side NLP skill extraction, compatibility scoring against jobs.json,
 * and 1-click tailored application routing.
 */
(function () {
  'use strict';

  var PHARMA_SKILLS = [
    'hplc', 'gc', 'gc-ms', 'uv', 'ir', 'titration', 'dissolution', 'wet chemistry',
    'qc', 'qa', 'quality control', 'quality assurance', 'gmp', 'cgmp', 'who-gmp',
    'bmr', 'bpr', 'batch record', 'sop', 'deviations', 'investigations', 'capa',
    'production', 'plant', 'synthesis', 'reactor', 'centrifuge', 'dryer', 'anfd',
    'ehs', 'safety', 'environment', 'effluent', 'hazmat', 'permits', 'fire safety',
    'b.pharm', 'm.pharm', 'm.sc', 'b.sc', 'ph.d', 'chemistry', 'organic chemistry',
    'analytical', 'method validation', 'stability studies', 'regulatory', 'audit'
  ];

  var activeJobs = [];

  function loadJobs() {
    fetch('jobs.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        activeJobs = (data.jobs || []).filter(function (j) { return (j.status || 'open') === 'open'; });
      })
      .catch(function () {
        activeJobs = [];
      });
  }

  function extractKeywords(text) {
    text = text.toLowerCase();
    var found = [];
    PHARMA_SKILLS.forEach(function (skill) {
      // Word boundary match
      var regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (regex.test(text)) {
        found.push(skill);
      }
    });
    return Array.from(new Set(found));
  }

  function calculateMatch(candidateSkills, job) {
    var jobSkills = (job.skills || []).map(function (s) { return s.toLowerCase().trim(); });
    var jobText = ((job.role || '') + ' ' + (job.duties || '') + ' ' + (job.profile || '')).toLowerCase();
    
    // Add implicit skills from duties/profile
    PHARMA_SKILLS.forEach(function (s) {
      if (jobText.includes(s) && !jobSkills.includes(s)) {
        jobSkills.push(s);
      }
    });

    if (jobSkills.length === 0) return { score: 75, matched: candidateSkills.slice(0, 3), missing: [] };

    var matched = [];
    var missing = [];

    jobSkills.forEach(function (js) {
      var hit = candidateSkills.some(function (cs) {
        return cs === js || cs.includes(js) || js.includes(cs);
      });
      if (hit) matched.push(js);
      else missing.push(js);
    });

    var score = Math.round((matched.length / jobSkills.length) * 100);
    // Base bonus for having pharmaceutical domain keywords
    if (candidateSkills.length >= 4 && score < 70) score = Math.min(88, score + 20);
    if (score > 98) score = 98; // Realistic ceiling

    return {
      score: Math.max(25, score),
      matched: Array.from(new Set(matched)),
      missing: Array.from(new Set(missing))
    };
  }

  function initMatcher() {
    loadJobs();

    var analyzeBtn = document.getElementById('vpResumeAnalyzeBtn');
    var resumeInput = document.getElementById('vpResumeText');
    var fileInput = document.getElementById('vpResumeFileInput');
    var resultsBox = document.getElementById('vpResumeResults');

    if (!analyzeBtn || !resumeInput || !resultsBox) return;

    // File input handler for text files
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          resumeInput.value = evt.target.result;
          runAnalysis();
        };
        reader.readAsText(file);
      });
    }

    function runAnalysis() {
      var text = resumeInput.value.trim();
      if (!text) {
        alert('Please paste your resume summary or skills keywords first.');
        return;
      }

      var candidateSkills = extractKeywords(text);
      if (candidateSkills.length === 0) {
        resultsBox.innerHTML = '<div class="vp-matcher-empty">We could not detect standard pharmaceutical keywords. Please include skills like HPLC, GMP, QC, Production, Chemistry, or B.Pharm.</div>';
        resultsBox.hidden = false;
        return;
      }

      if (activeJobs.length === 0) {
        resultsBox.innerHTML = '<div class="vp-matcher-empty">No open requisitions are currently active to match against.</div>';
        resultsBox.hidden = false;
        return;
      }

      // Rank jobs
      var rankings = activeJobs.map(function (j) {
        var res = calculateMatch(candidateSkills, j);
        return {
          job: j,
          score: res.score,
          matched: res.matched,
          missing: res.missing
        };
      });

      rankings.sort(function (a, b) { return b.score - a.score; });

      // Render top matches
      var html = '<div class="vp-matcher-card">';
      html += '  <div class="vp-matcher-header">';
      html += '    <div class="vp-matcher-badge">AI Match Analysis Complete</div>';
      html += '    <h3 style="margin:6px 0 2px;font-size:18px;color:#0F172A;">Detected ' + candidateSkills.length + ' Technical Competencies</h3>';
      html += '    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">';
      candidateSkills.forEach(function (s) {
        html += '<span class="vp-tag-skill">' + s.toUpperCase() + '</span>';
      });
      html += '    </div>';
      html += '  </div>';

      html += '  <div class="vp-matcher-jobs-list">';
      rankings.slice(0, 3).forEach(function (r, idx) {
        var color = r.score >= 80 ? '#059669' : (r.score >= 60 ? '#254696' : '#D97706');
        var bg = r.score >= 80 ? '#ECFDF5' : (r.score >= 60 ? '#EEF2FF' : '#FFFBEB');
        html += '<div class="vp-match-row">';
        html += '  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">';
        html += '    <div>';
        html += '      <span style="font-size:11px;font-weight:700;color:#64748B;">' + (r.job.department || 'Operations') + ' &bull; ' + r.job.id + '</span>';
        html += '      <h4 style="margin:2px 0 6px;font-size:16px;color:#0F172A;">' + r.job.title + '</h4>';
        html += '      <div style="font-size:12.5px;color:#64748B;">' + (r.job.location || 'Hyderabad') + '</div>';
        html += '    </div>';
        html += '    <div class="vp-score-circle" style="background:' + bg + ';color:' + color + ';">';
        html += '      <span>' + r.score + '%</span>';
        html += '      <small style="font-size:9px;font-weight:600;">MATCH</small>';
        html += '    </div>';
        html += '  </div>';

        html += '  <div style="margin:12px 0 8px;font-size:12px;">';
        html += '    <strong style="color:#334155;">Matched Strengths: </strong>';
        if (r.matched.length > 0) {
          r.matched.slice(0, 5).forEach(function (m) {
            html += '<span class="vp-tag-matched">&#10003; ' + m.toUpperCase() + '</span> ';
          });
        } else {
          html += '<span style="color:#94A3B8;">General suitability</span>';
        }
        html += '  </div>';

        html += '  <div style="margin-top:12px;">';
        html += '    <a href="apply.html?job=' + encodeURIComponent(r.job.id) + '&skills=' + encodeURIComponent(candidateSkills.join(',')) + '" class="vp-btn-apply-matched">Apply with this Profile &rarr;</a>';
        html += '  </div>';
        html += '</div>';
      });
      html += '  </div>';
      html += '</div>';

      resultsBox.innerHTML = html;
      resultsBox.hidden = false;
      resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var SAMPLES = {
      qc: "Experienced QC Chemist with 4 years in API quality control. Proficient in HPLC, GC-MS, UV-Vis spectrophotometry, wet chemistry titration, method validation, stability studies, and cGMP compliance under USFDA & EU guidelines. M.Sc Analytical Chemistry.",
      production: "API Production Shift Executive with hands-on expertise in batch manufacturing records (BMR), SS316 & Glass-Lined Reactors (GLR), fluid bed dryers, centrifuges, cleanroom ISO Class 7 operations, solvent recovery, and plant safety SOPs.",
      regulatory: "Regulatory Affairs Specialist managing USDMF, EDQM CEP, and ASMF submissions for active pharmaceutical ingredients. Comprehensive knowledge of CTD modules, audit responses, change controls, CAPA, and post-approval variations.",
      rnd: "Synthetic Organic Chemist specializing in heterocyclic synthesis, piperidone derivatives, high-pressure catalytic hydrogenation, chiral resolution, route scouting, and technology transfer from lab to kilo-scale."
    };

    document.querySelectorAll('[data-sample]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-sample');
        if (SAMPLES[key]) {
          resumeInput.value = SAMPLES[key];
          runAnalysis();
        }
      });
    });

    analyzeBtn.addEventListener('click', runAnalysis);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatcher);
  } else {
    initMatcher();
  }
})();
