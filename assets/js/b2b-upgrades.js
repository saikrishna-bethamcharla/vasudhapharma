/**
 * Vasudha Pharma — B2B Procurement & Scientific Experience Upgrades
 * 1. 1-Click Copy CAS Number with Micro-Tooltip
 * 2. Multi-Product RFQ Cart (Slide-out Drawer + Zoho CRM Integration)
 * 3. Product Specification PDF Export
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'vasudha_rfq_cart';

  function getCart() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
    updateRfqBadge();
  }

  // ==========================================
  // 1. 1-Click Copy CAS Number
  // ==========================================
  window.vpCopyCas = function (chip, cas, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var text = cas || (chip ? chip.getAttribute('data-cas') : '');
    if (!text && chip) {
      var numEl = chip.querySelector('.vp-cas-num');
      if (numEl) text = numEl.textContent.trim();
    }
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }

    if (chip) {
      chip.classList.add('is-copied');
      setTimeout(function () {
        chip.classList.remove('is-copied');
      }, 1800);
    }
  };

  function enhanceCasCells() {
    var rows = document.querySelectorAll('.api-row, .udev-row');
    rows.forEach(function (row) {
      var cas = (row.getAttribute('data-cas') || '').trim();
      var cells = row.querySelectorAll('.api-cell');

      cells.forEach(function (cell) {
        // Avoid modifying action cell or name cell
        if (cell.classList.contains('api-action') || cell.classList.contains('api-name')) return;
        if (cell.querySelector('.vp-cas-chip')) return;

        var text = cell.textContent.trim();
        if (/^\d{2,7}-\d{2}-\d$/.test(text)) {
          if (!cas) cas = text;
          cell.innerHTML = [
            '<span class="vp-cas-chip" data-cas="' + text + '" onclick="window.vpCopyCas(this, \'' + text + '\', event)" title="Click to copy CAS #">',
            '  <span class="vp-cas-num">' + text + '</span>',
            '  <span class="vp-cas-copy-icon">',
            '    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
            '  </span>',
            '  <span class="vp-cas-tip">Copied!</span>',
            '</span>'
          ].join('');
        }
      });

      // Also enhance in detail grid
      var detailGrid = row.querySelector('.api-detail-grid');
      if (detailGrid) {
        detailGrid.querySelectorAll('div').forEach(function (div) {
          var lbl = div.querySelector('.adl');
          var val = div.querySelector('.adv');
          if (lbl && val && lbl.textContent.indexOf('CAS') >= 0 && !val.querySelector('.vp-cas-chip')) {
            var vText = val.textContent.trim();
            if (/^\d{2,7}-\d{2}-\d$/.test(vText)) {
              val.innerHTML = [
                '<span class="vp-cas-chip" data-cas="' + vText + '" onclick="window.vpCopyCas(this, \'' + vText + '\', event)" title="Click to copy CAS #">',
                '  <span class="vp-cas-num">' + vText + '</span>',
                '  <span class="vp-cas-copy-icon">',
                '    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
                '  </span>',
                '  <span class="vp-cas-tip">Copied!</span>',
                '</span>'
              ].join('');
            }
          }
        });
      }
    });
  }

  // ==========================================
  // 2. Multi-Product RFQ Cart
  // ==========================================
  function extractProductData(row) {
    if (!row) return null;
    var name = (row.getAttribute('data-name') || '').trim();
    if (!name) {
      var s = row.querySelector('.api-name strong') || row.querySelector('strong');
      if (s) name = s.textContent.trim();
    }
    var cas = (row.getAttribute('data-cas') || '').trim();
    if (!cas) {
      var chip = row.querySelector('.vp-cas-chip');
      if (chip) cas = chip.getAttribute('data-cas');
    }
    var spec = (row.getAttribute('data-spec') || '').trim();
    var ther = (row.getAttribute('data-cat') || row.getAttribute('data-ther') || '').trim();

    var detail = row.querySelector('.api-detail');
    if (detail) {
      detail.querySelectorAll('.api-detail-grid > div').forEach(function (d) {
        var k = ((d.querySelector('.adl') || {}).textContent || '').toLowerCase();
        var v = ((d.querySelector('.adv') || {}).textContent || '').trim();
        if (k.indexOf('product') >= 0 && !name) name = v;
        if (k.indexOf('spec') >= 0 && !spec) spec = v;
        if (k.indexOf('cas') >= 0 && !cas) cas = v;
        if (k.indexOf('therap') >= 0 && !ther) ther = v;
      });
    }

    var path = (location.pathname || '').toLowerCase();
    var cat = 'APIs';
    if (path.indexOf('pellet') >= 0) cat = 'Pellets & MUPS';
    else if (path.indexOf('intermediate') >= 0) cat = 'Intermediates';
    else if (path.indexOf('piperidone') >= 0) cat = 'Piperidone Derivatives';
    else if (path.indexOf('under-development') >= 0) cat = 'Under Development APIs';

    return {
      name: name || 'Pharmaceutical Compound',
      cas: cas || 'In-House',
      spec: spec || 'IP / USP / BP / In-House',
      category: cat,
      qty: '100 kg'
    };
  }

  window.vpToggleRfq = function (btn, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var row = btn.closest('.api-row') || btn.closest('.udev-row');
    if (!row) return;

    var prod = extractProductData(row);
    if (!prod || !prod.name) return;

    var cart = getCart();
    var existingIndex = cart.findIndex(function (item) {
      return item.name.toLowerCase() === prod.name.toLowerCase();
    });

    if (existingIndex >= 0) {
      // Remove
      cart.splice(existingIndex, 1);
      btn.classList.remove('is-added');
      btn.innerHTML = '+ RFQ';
      btn.title = 'Add to RFQ list';
    } else {
      // Add
      cart.push(prod);
      btn.classList.add('is-added');
      btn.innerHTML = '✓ Added';
      btn.title = 'Remove from RFQ list';
    }
    saveCart(cart);
  };

  function updateRfqButtons() {
    var cart = getCart();
    var rows = document.querySelectorAll('.api-row, .udev-row');
    rows.forEach(function (row) {
      var btn = row.querySelector('.api-rfq-btn');
      if (!btn) {
        var actionCell = row.querySelector('.api-action');
        if (actionCell) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'api-rfq-btn';
          btn.innerHTML = '+ RFQ';
          btn.title = 'Add to Multi-Product RFQ list';
          btn.setAttribute('onclick', 'window.vpToggleRfq(this, event)');
          actionCell.appendChild(btn);
        }
      }
      if (btn) {
        var prod = extractProductData(row);
        var inCart = prod && cart.some(function (item) {
          return item.name.toLowerCase() === prod.name.toLowerCase();
        });
        if (inCart) {
          btn.classList.add('is-added');
          btn.innerHTML = '✓ Added';
        } else {
          btn.classList.remove('is-added');
          btn.innerHTML = '+ RFQ';
        }
      }
    });
  }

  function ensureRfqFloatAndDrawer() {
    // 1. Floating Badge
    var floatEl = document.getElementById('vpRfqFloat');
    if (!floatEl) {
      floatEl = document.createElement('div');
      floatEl.id = 'vpRfqFloat';
      floatEl.className = 'vp-rfq-float';
      floatEl.style.display = 'none';
      floatEl.setAttribute('onclick', 'window.vpOpenRfqDrawer()');
      floatEl.innerHTML = [
        '<div class="vp-rfq-float-inner">',
        '  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        '  <span>RFQ Cart</span>',
        '  <span class="vp-rfq-badge-count" id="vpRfqCount">0</span>',
        '</div>'
      ].join('');
      document.body.appendChild(floatEl);
    }

    // 2. Slide-out Drawer
    var drawerOverlay = document.getElementById('vpRfqDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'vpRfqDrawerOverlay';
      drawerOverlay.className = 'vp-rfq-drawer-overlay';
      drawerOverlay.setAttribute('aria-hidden', 'true');
      drawerOverlay.addEventListener('click', function (e) {
        if (e.target === drawerOverlay) window.vpCloseRfqDrawer();
      });

      drawerOverlay.innerHTML = [
        '<div class="vp-rfq-drawer" role="dialog" aria-labelledby="vpRfqTitle">',
        '  <div class="vp-rfq-head">',
        '    <div>',
        '      <h3 id="vpRfqTitle">Multi-Product RFQ Cart</h3>',
        '      <p>Consolidated procurement inquiry for sourcing managers</p>',
        '    </div>',
        '    <button type="button" class="vp-rfq-close" onclick="window.vpCloseRfqDrawer()" aria-label="Close">&times;</button>',
        '  </div>',
        '  <div class="vp-rfq-body">',
        '    <div id="vpRfqContent">',
        '      <div class="vp-rfq-table-wrap">',
        '        <table class="vp-rfq-table">',
        '          <thead>',
        '            <tr>',
        '              <th>Product</th>',
        '              <th>CAS No.</th>',
        '              <th>Target Quantity</th>',
        '              <th></th>',
        '            </tr>',
        '          </thead>',
        '          <tbody id="vpRfqTableBody"></tbody>',
        '        </table>',
        '      </div>',
        '      <form id="vpRfqForm" onsubmit="return window.vpSubmitRfq(event);">',
        '        <div class="vp-rfq-grid">',
        '          <div class="vp-rfq-field">',
        '            <label>Your Name <span style="color:#dc3545;">*</span></label>',
        '            <input type="text" id="rfqName" required placeholder="Full name">',
        '          </div>',
        '          <div class="vp-rfq-field">',
        '            <label>Corporate Email <span style="color:#dc3545;">*</span></label>',
        '            <input type="email" id="rfqEmail" required placeholder="email@pharma.com">',
        '          </div>',
        '          <div class="vp-rfq-field">',
        '            <label>Company / Organization <span style="color:#dc3545;">*</span></label>',
        '            <input type="text" id="rfqCompany" required placeholder="Company Name">',
        '          </div>',
        '          <div class="vp-rfq-field">',
        '            <label>Phone / WhatsApp</label>',
        '            <input type="tel" id="rfqPhone" placeholder="+91 XXXXX XXXXX">',
        '          </div>',
        '          <div class="vp-rfq-field">',
        '            <label>Destination Port / Market</label>',
        '            <input type="text" id="rfqDestination" placeholder="e.g. Rotterdam, New Jersey, Tokyo">',
        '          </div>',
        '          <div class="vp-rfq-field">',
        '            <label>Commercial Timeline</label>',
        '            <input type="text" id="rfqTimeline" placeholder="e.g. Q3 2026 Commercial Batch">',
        '          </div>',
        '          <div class="vp-rfq-field full">',
        '            <label>Additional Specifications / DMF Requirements</label>',
        '            <textarea id="rfqRemarks" rows="2" placeholder="Custom particle size, CoA request, regulatory access letter requirements..."></textarea>',
        '          </div>',
        '        </div>',
        '        <div class="vp-rfq-foot">',
        '          <button type="button" class="btn btn-outline" onclick="window.vpClearRfq()" style="background:#fff; border:1px solid #cbd5e1; padding:8px 16px; border-radius:6px; cursor:pointer;">Clear List</button>',
        '          <button type="submit" class="btn btn-primary" id="rfqSubmitBtn" style="background:#C8102E; color:#fff; border:none; padding:10px 24px; font-weight:700; border-radius:6px; cursor:pointer;">Submit Consolidated RFQ</button>',
        '        </div>',
        '      </form>',
        '    </div>',
        '    <div class="vp-rfq-success" id="vpRfqSuccess" style="display:none;">',
        '      <div class="vp-rfq-success-icon">✓</div>',
        '      <h4>Consolidated RFQ Submitted Successfully</h4>',
        '      <p>Thank you for submitting your multi-product procurement request. Our Commercial &amp; Regulatory teams will review your required quantities and send a formal commercial offer.</p>',
        '      <button type="button" class="btn btn-primary" onclick="window.vpCloseRfqDrawer()" style="background:#C8102E; color:#fff; border:none; padding:10px 24px; font-weight:700; border-radius:6px; cursor:pointer;">Done</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
      document.body.appendChild(drawerOverlay);
    }
  }

  function updateRfqBadge() {
    var cart = getCart();
    var floatEl = document.getElementById('vpRfqFloat');
    var countEl = document.getElementById('vpRfqCount');
    if (countEl) countEl.textContent = cart.length;

    if (floatEl) {
      if (cart.length > 0) {
        floatEl.style.display = 'block';
      } else {
        floatEl.style.display = 'none';
      }
    }
  }

  window.vpOpenRfqDrawer = function () {
    ensureRfqFloatAndDrawer();
    var cart = getCart();
    var overlay = document.getElementById('vpRfqDrawerOverlay');
    var tbody = document.getElementById('vpRfqTableBody');
    var contentBox = document.getElementById('vpRfqContent');
    var successBox = document.getElementById('vpRfqSuccess');

    if (contentBox) contentBox.style.display = 'block';
    if (successBox) successBox.style.display = 'none';

    if (tbody) {
      if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:24px; color:#64748b;">No products in your RFQ list yet. Click <strong>+ RFQ</strong> on any product row to add it here.</td></tr>';
      } else {
        tbody.innerHTML = cart.map(function (item, idx) {
          return [
            '<tr>',
            '  <td><strong>' + item.name + '</strong><br><small style="color:#64748b;">' + item.category + '</small></td>',
            '  <td><code>' + item.cas + '</code></td>',
            '  <td><input type="text" class="vp-rfq-qty-input" value="' + (item.qty || '100 kg') + '" onchange="window.vpUpdateRfqQty(' + idx + ', this.value)"></td>',
            '  <td style="text-align:center;"><button type="button" class="vp-rfq-remove-btn" onclick="window.vpRemoveRfqItem(' + idx + ')" title="Remove item">&times;</button></td>',
            '</tr>'
          ].join('');
        }).join('');
      }
    }

    if (overlay) {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  window.vpCloseRfqDrawer = function () {
    var overlay = document.getElementById('vpRfqDrawerOverlay');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  window.vpUpdateRfqQty = function (idx, val) {
    var cart = getCart();
    if (cart[idx]) {
      cart[idx].qty = val.trim() || '100 kg';
      saveCart(cart);
    }
  };

  window.vpRemoveRfqItem = function (idx) {
    var cart = getCart();
    if (cart[idx]) {
      cart.splice(idx, 1);
      saveCart(cart);
      updateRfqButtons();
      window.vpOpenRfqDrawer();
    }
  };

  window.vpClearRfq = function () {
    saveCart([]);
    updateRfqButtons();
    window.vpOpenRfqDrawer();
  };

  window.vpSubmitRfq = function (e) {
    if (e) e.preventDefault();
    var cart = getCart();
    if (cart.length === 0) {
      alert('Please add at least one product to your RFQ list.');
      return false;
    }

    var name = ((document.getElementById('rfqName') || {}).value || '').trim();
    var email = ((document.getElementById('rfqEmail') || {}).value || '').trim();
    var company = ((document.getElementById('rfqCompany') || {}).value || '').trim();
    var phone = ((document.getElementById('rfqPhone') || {}).value || '').trim();
    var dest = ((document.getElementById('rfqDestination') || {}).value || '').trim();
    var timeline = ((document.getElementById('rfqTimeline') || {}).value || '').trim();
    var remarks = ((document.getElementById('rfqRemarks') || {}).value || '').trim();

    if (!name || !email || !company) {
      alert('Please fill in your name, corporate email, and company name.');
      return false;
    }

    var productSummary = cart.map(function (it, idx) {
      return (idx + 1) + '. ' + it.name + ' (CAS: ' + it.cas + ') | Qty: ' + it.qty + ' | Category: ' + it.category;
    }).join('\n');

    var description = [
      'CONSOLIDATED MULTI-PRODUCT RFQ (' + cart.length + ' PRODUCTS):',
      productSummary,
      '',
      'Target Port / Market: ' + (dest || 'Not specified'),
      'Commercial Timeline: ' + (timeline || 'Not specified'),
      'Remarks / Specifications: ' + (remarks || 'Standard commercial supply')
    ].join('\n');

    try {
      if (typeof window.__vpPostEnquiryToZoho === 'function') {
        window.__vpPostEnquiryToZoho({
          lastName: name,
          email: email,
          phone: phone,
          company: company,
          description: description,
          leadSource: 'Website Multi-Product RFQ Cart',
          enquiryType: 'Consolidated RFQ',
          productCategory: 'Multi-Product Sourcing',
          productName: cart.map(function (c) { return c.name; }).join(', '),
          quantityRequired: cart.map(function (c) { return c.qty; }).join('; ')
        });
      }
    } catch (err) {}

    // Show success & clear cart
    var contentBox = document.getElementById('vpRfqContent');
    var successBox = document.getElementById('vpRfqSuccess');
    if (contentBox) contentBox.style.display = 'none';
    if (successBox) successBox.style.display = 'block';

    saveCart([]);
    updateRfqButtons();
    return false;
  };

  // ==========================================
  // 3. Product Specification PDF Export
  // ==========================================
  window.vpDownloadProductPdf = function () {
    var pName = ((document.getElementById('enqPName') || {}).textContent || 'Pharmaceutical Product').trim();
    var pSpec = ((document.getElementById('enqPSpec') || {}).textContent || 'IP / USP / BP / In-House').trim();
    var pReg = ((document.getElementById('enqPReg') || {}).textContent || 'USDMF / CEP / WHO-GMP Available').trim();
    var pTher = ((document.getElementById('enqPTher') || {}).textContent || 'Therapeutic Active').trim();
    var pCas = ((document.getElementById('enqPCas') || {}).textContent || 'In-House Standard').trim();

    var dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var printContent = [
      '<!DOCTYPE html>',
      '<html><head><meta charset="utf-8">',
      '<title>Vasudha Pharma — Product Specification Brief — ' + pName + '</title>',
      '<style>',
      '  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; }',
      '  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #C8102E; padding-bottom: 20px; margin-bottom: 30px; }',
      '  .brand h1 { margin: 0; font-size: 22px; color: #C8102E; text-transform: uppercase; letter-spacing: 0.5px; }',
      '  .brand p { margin: 4px 0 0; font-style: italic; font-size: 13px; color: #0088AA; }',
      '  .badge { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; text-align: right; }',
      '  .doc-title { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }',
      '  .doc-sub { font-size: 13px; color: #64748b; margin-bottom: 24px; }',
      '  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }',
      '  th, td { padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 14px; text-align: left; }',
      '  th { background: #f8fafc; color: #334155; width: 35%; }',
      '  td { color: #0f172a; font-weight: 500; }',
      '  .cas-box { font-family: monospace; font-size: 15px; font-weight: 700; color: #0d6efd; }',
      '  .quality-note { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; font-size: 13px; color: #166534; line-height: 1.6; margin-bottom: 30px; }',
      '  .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; align-items: center; }',
      '  @media print { body { padding: 20px; } button { display: none; } }',
      '</style>',
      '</head><body>',
      '  <div class="header">',
      '    <div class="brand">',
      '      <h1>VASUDHA PHARMA CHEM LIMITED</h1>',
      '      <p>Contributing to affordable health care... Since 1994</p>',
      '    </div>',
      '    <div class="badge">',
      '      <strong>Commercial Product Brief</strong><br>Generated: ' + dateStr,
      '    </div>',
      '  </div>',
      '  <div class="doc-title">Product Technical Specification &amp; Regulatory Overview</div>',
      '  <div class="doc-sub">Official Commercial Dossier Extract for Regulatory &amp; Sourcing Evaluation</div>',
      '  <table>',
      '    <tr><th>Product Name</th><td><strong>' + pName + '</strong></td></tr>',
      '    <tr><th>Chemical CAS Number</th><td><span class="cas-box">' + pCas + '</span></td></tr>',
      '    <tr><th>Pharmacopeial Specification</th><td>' + pSpec + '</td></tr>',
      '    <tr><th>Regulatory Filings / DMF Status</th><td>' + pReg + '</td></tr>',
      '    <tr><th>Therapeutic Category</th><td>' + pTher + '</td></tr>',
      '    <tr><th>Manufacturing Standards</th><td>cGMP Compliant / US FDA &amp; WHO-GMP Audited Facilities</td></tr>',
      '    <tr><th>Packaging &amp; Supply</th><td>Custom multi-layer drum packaging available upon request</td></tr>',
      '  </table>',
      '  <div class="quality-note">',
      '    <strong>Quality &amp; Regulatory Commitment:</strong> Vasudha Pharma Chem Limited manufactures all active substances under strict cGMP protocols aligned with ICH Q7 guidelines. Complete open-part DMFs, Certificates of Analysis (CoA), and impurity profiles are available under mutual CDA.',
      '  </div>',
      '  <div class="footer">',
      '    <div>Vasudha Pharma Chem Limited &bull; Hyderabad &amp; Visakhapatnam, India<br>Web: www.vasudhapharma.com &bull; Email: vasudha@vasudhapharma.com</div>',
      '    <div style="text-align:right;">Confidential Commercial Document<br>Page 1 of 1</div>',
      '  </div>',
      '  <script>window.onload = function() { window.print(); };<\/script>',
      '</body></html>'
    ].join('\n');

    var printWin = window.open('', '_blank', 'width=840,height=900');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printContent);
      printWin.document.close();
    } else {
      alert('Please allow popups to generate and download the specification sheet.');
    }
  };

  function addPdfExportButtonToEnquiry() {
    var overlay = document.getElementById('enqOverlay');
    if (!overlay) return;
    var actions = overlay.querySelector('.enq-actions');
    if (actions && !document.getElementById('enqDownloadPdf')) {
      var pdfBtn = document.createElement('button');
      pdfBtn.type = 'button';
      pdfBtn.id = 'enqDownloadPdf';
      pdfBtn.className = 'enq-btn enq-btn-pdf';
      pdfBtn.innerHTML = '📄 Download Spec Sheet (PDF)';
      pdfBtn.title = 'Generate branded printable specification brief';
      pdfBtn.setAttribute('onclick', 'window.vpDownloadProductPdf()');
      actions.insertBefore(pdfBtn, actions.firstChild);
    }
  }

  // ==========================================
  // Initialization
  // ==========================================
  function init() {
    enhanceCasCells();
    ensureRfqFloatAndDrawer();
    updateRfqButtons();
    updateRfqBadge();
    addPdfExportButtonToEnquiry();

    // Re-run on search input changes
    var searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        setTimeout(enhanceCasCells, 50);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
