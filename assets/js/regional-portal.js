/**
 * Vasudha Pharma Chem Limited — Regional Portal Interactive Logic
 * Handles language picker, category filtering, CAS copy, and direct RFQ pre-fill
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Language Dropdown Toggle
  var langPicker = document.querySelector('.rp-lang-picker');
  var langBtn = document.querySelector('.rp-lang-btn');

  if (langPicker && langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langPicker.classList.toggle('is-open');
    });

    document.addEventListener('click', function (e) {
      if (!langPicker.contains(e.target)) {
        langPicker.classList.remove('is-open');
      }
    });
  }

  // 2. Product Category Filtering
  var filterBtns = document.querySelectorAll('.rp-filter-btn');
  var productRows = document.querySelectorAll('.rp-table tbody tr');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var cat = btn.getAttribute('data-filter');

      productRows.forEach(function (row) {
        if (cat === 'all' || row.getAttribute('data-category') === cat) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // 3. CAS Number 1-Click Copy
  var casPills = document.querySelectorAll('.rp-cas-pill');
  casPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var text = pill.getAttribute('data-cas') || pill.textContent.trim();
      navigator.clipboard.writeText(text).then(function () {
        var orig = pill.innerHTML;
        pill.innerHTML = '✓ Copied';
        setTimeout(function () {
          pill.innerHTML = orig;
        }, 1500);
      });
    });
  });

  // 4. Inquire Button Pre-fill
  var inquireBtns = document.querySelectorAll('.rp-inquire-btn');
  var productInput = document.getElementById('rpInquiryProduct');
  var contactSection = document.getElementById('contact');

  inquireBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var mol = btn.getAttribute('data-mol');
      if (mol && productInput) {
        productInput.value = mol;
      }
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. Contact Form Handler
  var form = document.getElementById('rpInquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.rp-form-submit');
      var origText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        alert('Thank you! Your regional inquiry has been sent. Our team will contact you within 24 business hours.');
        form.reset();
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
});
