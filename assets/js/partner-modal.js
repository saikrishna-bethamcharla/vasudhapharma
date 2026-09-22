/**
 * Vasudha Pharma — Product Cards Clickability & External Partner Website Modal
 */
(function () {
  'use strict';

  function initPartnerCards() {
    var cards = document.querySelectorAll('.prod-grid article.prod-card');
    if (!cards.length) return;

    var isHindi = document.documentElement.lang === 'hi' || window.location.pathname.indexOf('-hi') !== -1 || window.location.pathname.indexOf('lang-hi') !== -1;

    // Inject modal into DOM if not present
    var modalId = 'vpPartnerRedirectModal';
    var modal = document.getElementById(modalId);

    if (!modal) {
      var modalHtml = [
        '<div id="' + modalId + '" class="vp-partner-modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="vpPartnerModalTitle">',
        '  <div class="vp-partner-modal-card">',
        '    <button type="button" class="vp-partner-modal-close" id="vpPartnerClose" aria-label="' + (isHindi ? 'बंद करें' : 'Close dialog') + '">&times;</button>',
        '    <div class="vp-partner-modal-icon">',
        '      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>',
        '        <polyline points="15 3 21 3 21 9"></polyline>',
        '        <line x1="10" y1="14" x2="21" y2="3"></line>',
        '      </svg>',
        '    </div>',
        '    <div class="vp-partner-modal-badge">' + (isHindi ? 'बाहरी पार्टनर वेबसाइट' : 'External Partner Website') + '</div>',
        '    <h3 id="vpPartnerModalTitle" class="vp-partner-modal-title">' + (isHindi ? 'सहयोगी पार्टनर वेबसाइट पर जा रहे हैं' : 'Visiting Associate Partner') + '</h3>',
        '    <p class="vp-partner-modal-desc">',
        isHindi
          ? 'आप वसुधा फार्मा छोड़कर हमारे सहयोगी पार्टनर की आधिकारिक वेबसाइट: <strong>विकासिथ लाइफसाइंसेज (Vikasith Lifesciences)</strong> पर जाने वाले हैं। यह एक नए ब्राउज़र टैब में खुलेगा।'
          : 'You are about to leave Vasudha Pharma to visit our associate partner website: <strong>Vikasith Lifesciences</strong>. This external site will open in a new browser tab.',
        '    </p>',
        '    <div class="vp-partner-modal-url-box">',
        '      <span id="vpPartnerUrlDisplay">https://vikasith.com/about</span>',
        '      <span class="vp-partner-url-tag">' + (isHindi ? 'नया टैब ↗' : 'New Tab ↗') + '</span>',
        '    </div>',
        '    <div class="vp-partner-modal-actions">',
        '      <button type="button" class="vp-partner-btn-secondary" id="vpPartnerCancel">' + (isHindi ? 'वसुधा पर रहें' : 'Stay on Vasudha') + '</button>',
        '      <button type="button" class="vp-partner-btn-primary" id="vpPartnerConfirm">' + (isHindi ? 'पार्टनर साइट पर जाएं &rarr;' : 'Continue to Partner Site &rarr;') + '</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      modal = document.getElementById(modalId);
    }

    var pendingUrl = 'https://vikasith.com/about';
    var confirmBtn = document.getElementById('vpPartnerConfirm');
    var cancelBtn = document.getElementById('vpPartnerCancel');
    var closeBtn = document.getElementById('vpPartnerClose');
    var urlDisplay = document.getElementById('vpPartnerUrlDisplay');

    function openModal(url) {
      if (url) {
        pendingUrl = url;
        if (urlDisplay) urlDisplay.textContent = url;
      }
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // Force repaint
      void modal.offsetWidth;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      if (confirmBtn) confirmBtn.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!modal.classList.contains('is-open')) {
          modal.style.display = 'none';
        }
      }, 220);
    }

    if (confirmBtn) {
      confirmBtn.onclick = function () {
        window.open(pendingUrl, '_blank', 'noopener,noreferrer');
        closeModal();
      };
    }

    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;

    modal.onclick = function (e) {
      if (e.target === modal) closeModal();
    };

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Attach clickability to each product card
    cards.forEach(function (card) {
      var link = card.querySelector('a.prod-more') || card.querySelector('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      var isExternal = link.getAttribute('target') === '_blank' ||
                        href.indexOf('http://') === 0 ||
                        href.indexOf('https://') === 0 ||
                        card.hasAttribute('data-partner-card');

      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');

      var heading = card.querySelector('h3');
      if (!card.getAttribute('aria-label')) {
        card.setAttribute('aria-label', (heading ? heading.textContent.trim() : 'Product category') + ' — ' + (isExternal ? 'open partner website' : 'view details'));
      }

      function handleAction(e) {
        // If clicking on a different interactive element (e.g., another button or link)
        if (e.target.closest && e.target.closest('button, input, select')) return;

        if (isExternal) {
          e.preventDefault();
          e.stopPropagation();
          openModal(href);
        } else {
          // Internal link navigation
          window.location.href = href;
        }
      }

      card.addEventListener('click', handleAction);

      // Keyboard enter/space navigation
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(e);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartnerCards);
  } else {
    initPartnerCards();
  }
})();
