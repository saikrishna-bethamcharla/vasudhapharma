</div><!-- /.wrap -->
<footer style="border-top: 1px solid var(--sp-border); padding: 20px 24px; color: var(--sp-text-muted); font-size: 12.5px; background: #FFFFFF; margin-top: 40px;">
  <div style="max-width: 1180px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <a href="home.php" class="logo" style="transform: scale(0.9); transform-origin: left center;">
      <div class="logo-hex-wrap" style="width:40px; height:40px;">
        <div class="logo-hex-body">
          <img src="../assets/vasudha-logo.jpg" alt="Vasudha Pharma Chem Limited" class="logo-img">
        </div>
      </div>
      <div class="logo-text">
        <strong style="font-size:13.5px;">VASUDHA PHARMA CHEM LIMITED</strong>
        <span style="font-size:10.5px;">Contributing to affordable health care...</span>
      </div>
    </a>
    <div style="color: #94A3B8; text-align: right; font-size: 12px;">
      <div>&copy; 2026 Vasudha Pharma Chem Limited &bull; Operations Portal</div>
      <div style="font-size: 11px; margin-top: 2px;">Confidential &amp; Proprietary &bull; Internal Desk Active</div>
    </div>
  </div>
</footer>
<script>
// Table Live Search
document.querySelectorAll('[data-search-target]').forEach(input => {
  input.addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    const table = document.querySelector(this.dataset.searchTarget);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    let visible = 0;
    rows.forEach(r => {
      // Ignore empty placeholder rows
      if (r.querySelector('td[colspan]')) return;
      const text = r.textContent.toLowerCase();
      if (text.includes(term)) {
        r.style.display = '';
        visible++;
      } else {
        r.style.display = 'none';
      }
    });
    const emptyRow = table.querySelector('.search-no-results');
    if (visible === 0 && rows.length > 0 && term !== '') {
      if (!emptyRow) {
        const tr = document.createElement('tr');
        tr.className = 'search-no-results';
        tr.innerHTML = `<td colspan="10" style="text-align:center;padding:24px;color:#94A3B8;">No records matching "${term}"</td>`;
        table.querySelector('tbody').appendChild(tr);
      }
    } else if (emptyRow) {
      emptyRow.remove();
    }
  });
});

// Auto-fade success alert
setTimeout(() => {
  document.querySelectorAll('.ok').forEach(el => {
    el.style.transition = 'opacity 0.6s ease';
    el.style.opacity = '0.35';
  });
}, 5000);
</script>
</body>
</html>
