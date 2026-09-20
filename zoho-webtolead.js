(function() {
  'use strict';
  // Utility for Zoho CRM Web-to-Lead Forms across the website
  window.VP_Zoho = window.VP_Zoho || {
    getParams: function() {
      var search = location.search.substring(1);
      if (!search) return {};
      var params = {};
      search.split('&').forEach(function(pair) {
        var parts = pair.split('=');
        if (parts[0]) params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
      });
      return params;
    },
    trackLeadSource: function(formEl) {
      if (!formEl) return;
      var params = this.getParams();
      var utmSource = params.utm_source || document.referrer || 'Direct Website';
      var srcInput = formEl.querySelector('input[name="Lead Source"]');
      if (srcInput && !srcInput.value) {
        srcInput.value = utmSource;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    var leadForms = document.querySelectorAll('form[action*="WebToLeadForm"]');
    leadForms.forEach(function(f) {
      window.VP_Zoho.trackLeadSource(f);
    });
  });
})();
