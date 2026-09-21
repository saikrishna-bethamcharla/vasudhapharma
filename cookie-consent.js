(function() {
  'use strict';
  var STORAGE_KEY = 'vp_cookie_consent_v1';

  // Floating 30-Day Testing Feedback Widget
  function initFeedbackWidget() {
    if (window.location.pathname.endsWith('feedback.html')) return;
    if (document.getElementById('vpFeedbackFloatPill')) return;

    var pathParts = window.location.pathname.split('/');
    var currentPage = pathParts.pop() || 'index.html';
    // If inside subfolder (like /staff/), keep relative path
    var isSubdir = pathParts.length > 0 && pathParts[pathParts.length - 1] === 'staff';
    var targetUrl = (isSubdir ? '../feedback.html' : 'feedback.html') + '?page=' + encodeURIComponent(currentPage);

    var link = document.createElement('a');
    link.id = 'vpFeedbackFloatPill';
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.title = 'Open 30-Day Testing Feedback & Edit Request Desk';
    link.innerHTML = '<span style="font-size:13px; line-height:1;">📝</span><span>Testing Feedback</span>';
    link.style.cssText = [
      'position: fixed',
      'bottom: 22px',
      'right: 22px',
      'z-index: 99990',
      'display: inline-flex',
      'align-items: center',
      'gap: 7px',
      'background: #1E3A8A',
      'color: #FFFFFF',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 12px',
      'font-weight: 600',
      'padding: 8px 15px',
      'border-radius: 9999px',
      'box-shadow: 0 4px 14px rgba(30, 58, 138, 0.35)',
      'border: 1px solid rgba(255, 255, 255, 0.3)',
      'text-decoration: none',
      'transition: all 0.2s ease',
      'cursor: pointer'
    ].join(';');

    link.onmouseenter = function() {
      link.style.transform = 'translateY(-2px) scale(1.02)';
      link.style.background = '#2563EB';
      link.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.45)';
    };
    link.onmouseleave = function() {
      link.style.transform = 'none';
      link.style.background = '#1E3A8A';
      link.style.boxShadow = '0 4px 14px rgba(30, 58, 138, 0.35)';
    };

    document.body.appendChild(link);
  }

  function init() {
    initFeedbackWidget();

    if (localStorage.getItem(STORAGE_KEY)) return;

    var banner = document.createElement('div');
    banner.id = 'vpCookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = [
      '<div class="vp-cb-inner">',
      '  <div class="vp-cb-content">',
      '    <p class="vp-cb-title">We value your privacy</p>',
      '    <p class="vp-cb-text">We use cookies and similar technologies to enhance browsing experience, analyze traffic, and ensure seamless site operations in compliance with global standards. Read our <a href="cookies.html" class="vp-cb-link">Cookie Policy</a>.</p>',
      '  </div>',
      '  <div class="vp-cb-actions">',
      '    <button type="button" class="vp-cb-btn vp-cb-accept" id="vpAcceptCookies">Accept All</button>',
      '    <button type="button" class="vp-cb-btn vp-cb-essential" id="vpEssentialCookies">Essential Only</button>',
      '  </div>',
      '</div>'
    ].join('');

    var style = document.createElement('style');
    style.textContent = [
      '#vpCookieBanner {',
      '  position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 520px; margin: 0 auto 0 0;',
      '  background: rgba(255, 255, 255, 0.94);',
      '  backdrop-filter: blur(16px) saturate(180%);',
      '  -webkit-backdrop-filter: blur(16px) saturate(180%);',
      '  border: 1px solid rgba(226, 232, 240, 0.9);',
      '  border-radius: 16px;',
      '  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.04);',
      '  padding: 18px 22px;',
      '  z-index: 99999;',
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  animation: vpSlideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
      '}',
      '@keyframes vpSlideInUp {',
      '  from { opacity: 0; transform: translateY(20px); }',
      '  to { opacity: 1; transform: translateY(0); }',
      '}',
      '.vp-cb-title { font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.01em; }',
      '.vp-cb-text { font-size: 12.5px; color: #475569; line-height: 1.5; margin: 0 0 14px; }',
      '.vp-cb-link { color: #3D5CAD; text-decoration: underline; text-underline-offset: 2px; }',
      '.vp-cb-actions { display: flex; gap: 10px; flex-wrap: wrap; }',
      '.vp-cb-btn { font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; border: 0; }',
      '.vp-cb-accept { background: #3D5CAD; color: #fff; box-shadow: 0 2px 8px rgba(61, 92, 173, 0.25); }',
      '.vp-cb-accept:hover { background: #2E4A8A; transform: translateY(-1px); }',
      '.vp-cb-essential { background: #F1F5F9; color: #334155; }',
      '.vp-cb-essential:hover { background: #E2E8F0; }',
      '@media (max-width: 640px) {',
      '  #vpCookieBanner { left: 14px; right: 14px; bottom: 14px; max-width: none; }',
      '}'
    ].join('\n');

    document.head.appendChild(style);
    document.body.appendChild(banner);

    function close(type) {
      localStorage.setItem(STORAGE_KEY, type);
      banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(16px)';
      setTimeout(function() {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 300);
    }

    var acc = document.getElementById('vpAcceptCookies');
    var ess = document.getElementById('vpEssentialCookies');
    if (acc) acc.addEventListener('click', function() { close('accepted_all'); });
    if (ess) ess.addEventListener('click', function() { close('essential_only'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
