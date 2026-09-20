</div><!-- /.wrap -->
<footer style="border-top: 1px solid var(--sp-border); padding: 20px 24px; text-align: center; color: var(--sp-text-muted); font-size: 12.5px; background: #FFFFFF; margin-top: 40px;">
  <div style="max-width: 1180px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
    <div>
      <strong>Vasudha Pharma Chem Limited</strong> &bull; Internal Operations Portal
    </div>
    <div style="color: #94A3B8;">
      Confidential &amp; Proprietary &bull; Session Active
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
