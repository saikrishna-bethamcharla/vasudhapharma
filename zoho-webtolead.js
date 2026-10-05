(function() {
  'use strict';
  // Utility for Zoho CRM Web-to-Lead Forms & Email Relay across the website
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
      var retInput = formEl.querySelector('input[name="returnURL"]');
      if (retInput) {
        retInput.value = window.location.origin + '/home.html';
      }
    },
    // Background relay to ensure dual emails & local logging whenever a lead form posts
    relayToBackend: function(formData) {
      try {
        var leadSource = (formData.get('Lead Source') || formData.get('leadSource') || '').toString();
        var isContact = leadSource.indexOf('Contact') !== -1;
        var isSurvey = leadSource.indexOf('Survey') !== -1;
        var endpoint = isContact ? 'contact.php' : 'enquiry.php';

        var payload = {};
        formData.forEach(function(value, key) {
          payload[key] = value;
        });

        // Normalize standard fields
        payload.name = payload['Last Name'] || payload['First Name'] || '';
        payload.lastName = payload.name;
        payload.email = payload['Email'] || '';
        payload.phone = payload['Phone'] || '';
        payload.company = payload['Company'] || '';
        payload.description = payload['Description'] || '';
        payload.designation = payload['Designation'] || '';
        payload.department = payload['LEADCF15'] || '';
        payload.inquiryType = payload['LEADCF16'] || '';
        payload.productCategory = payload['LEADCF5'] || '';
        payload.productName = payload['LEADCF6'] || '';
        payload.specifications = payload['LEADCF8'] || '';
        payload.casNumber = payload['LEADCF3'] || '';
        payload.regulatoryStatus = payload['LEADCF7'] || '';
        payload.therapeuticUse = payload['LEADCF1'] || '';
        payload.quantityRequired = payload['LEADCF2'] || '';

        if (isSurvey) {
          payload.type = 'survey';
          payload.q1 = payload['LEADCF9'] || '';
          payload.q2 = payload['LEADCF11'] || '';
          payload.q3 = payload['LEADCF10'] || '';
          payload.q4 = payload['LEADCF12'] || '';
          payload.q5 = payload['LEADCF4'] || '';
          payload.sourcePage = window.location.pathname.split('/').pop() || 'website';
        }

        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function(r) { return r.json(); })
          .then(function(d) { console.log('Dual-dispatch confirmed:', d); })
          .catch(function(err) { console.warn('Dual-dispatch note:', err); });
      } catch (e) {}
    }
  };

  // Intercept form submissions targeting Zoho WebToLeadForm to guarantee dual email dispatch
  var originalSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function() {
    try {
      if (this.action && this.action.indexOf('WebToLeadForm') !== -1 && !this.__vpRelayed) {
        this.__vpRelayed = true;
        var fd = new FormData(this);
        window.VP_Zoho.relayToBackend(fd);
      }
    } catch(e) {}
    return originalSubmit.apply(this, arguments);
  };

  document.addEventListener('DOMContentLoaded', function() {
    var leadForms = document.querySelectorAll('form[action*="WebToLeadForm"]');
    leadForms.forEach(function(f) {
      window.VP_Zoho.trackLeadSource(f);
      f.addEventListener('submit', function() {
        if (!f.__vpRelayed) {
          f.__vpRelayed = true;
          var fd = new FormData(f);
          window.VP_Zoho.relayToBackend(fd);
        }
      });
    });
  });
})();
