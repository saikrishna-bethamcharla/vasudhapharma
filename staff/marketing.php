<?php
require __DIR__ . '/includes/auth.php';
staff_require_desk('marketing');
$u = staff_user();
$data = staff_load_desk('marketing');
if (!isset($data['items']) || !is_array($data['items'])) $data['items'] = [];

// Fallback: If empty, load from marketing.json or products catalog
if (empty($data['items'])) {
  $seedFile = __DIR__ . '/data/marketing.json';
  if (is_file($seedFile)) {
    $seeded = json_decode(file_get_contents($seedFile), true);
    if (!empty($seeded['items'])) {
      $data['items'] = $seeded['items'];
      staff_save_desk('marketing', $data);
    }
  }
}

$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  
  if ($action === 'save_item') {
    $id = trim($_POST['id'] ?? '');
    if (!$id) {
      $cleanName = preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($_POST['name'] ?? '')));
      $id = 'pr-' . trim($cleanName, '-') . '-' . mt_rand(100, 999);
    }
    
    $item = [
      'id' => $id,
      'name' => trim($_POST['name'] ?? ''),
      'category' => trim($_POST['category'] ?? 'APIs'),
      'cas_no' => trim($_POST['cas_no'] ?? ''),
      'therapeutic' => trim($_POST['therapeutic'] ?? ''),
      'specifications' => trim($_POST['specifications'] ?? 'IP / USP / BP / In-House'),
      'dmf_status' => trim($_POST['dmf_status'] ?? 'Available'),
      'status' => trim($_POST['status'] ?? 'active'),
      'note' => trim($_POST['note'] ?? ''),
      'updated_at' => date('Y-m-d H:i:s'),
    ];

    if ($item['name'] === '') {
      $err = 'Product name is required.';
    } else {
      $found = false;
      foreach ($data['items'] as $i => $it) {
        if ($it['id'] === $item['id']) {
          $data['items'][$i] = array_merge($it, $item);
          $found = true;
          break;
        }
      }
      if (!$found) {
        array_unshift($data['items'], $item);
      }
      staff_save_desk('marketing', $data);
      $msg = 'Product "' . htmlspecialchars($item['name']) . '" successfully saved to Marketing portfolio.';
    }
  }

  if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $deletedName = '';
    foreach ($data['items'] as $it) {
      if ($it['id'] === $id) { $deletedName = $it['name']; break; }
    }
    $data['items'] = array_values(array_filter($data['items'], function ($it) use ($id) { return $it['id'] !== $id; }));
    staff_save_desk('marketing', $data);
    $msg = 'Product "' . htmlspecialchars($deletedName ?: $id) . '" removed from portfolio.';
  }
}

$staff_title = 'Marketing & Products';
require __DIR__ . '/includes/header.php';

$edit = null;
if (isset($_GET['edit'])) {
  foreach ($data['items'] as $it) {
    if ($it['id'] === $_GET['edit']) {
      $edit = $it;
      break;
    }
  }
}

// Calculate Category Counts
$counts = [
  'All' => count($data['items']),
  'APIs' => 0,
  'Intermediates' => 0,
  'Pellets' => 0,
  'Piperidone Derivatives' => 0,
  'Under Development' => 0,
];
foreach ($data['items'] as $it) {
  $cat = $it['category'] ?? 'APIs';
  if (isset($counts[$cat])) $counts[$cat]++;
  else $counts[$cat] = 1;
}
?>

<style>
.cat-pill {
  border: 1px solid var(--sp-border);
  background: #FFFFFF;
  color: var(--sp-text-muted);
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}
.cat-pill:hover {
  background: var(--sp-primary-light);
  color: var(--sp-primary-dark);
  border-color: #A7F3D0;
}
.cat-pill.is-active {
  background: var(--sp-primary);
  color: #FFFFFF;
  border-color: var(--sp-primary-dark);
  box-shadow: 0 2px 8px rgba(14, 143, 108, 0.25);
}
.badge-cat {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.badge-cat-api { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.badge-cat-int { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.badge-cat-pel { background: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; }
.badge-cat-pip { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
.badge-cat-dev { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
.badge-cat-def { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
</style>

<?php if ($msg): ?>
  <div class="card ok">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    <span><?php echo htmlspecialchars($msg); ?></span>
  </div>
<?php endif; ?>

<?php if ($err): ?>
  <div class="card err-box">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span><?php echo htmlspecialchars($err); ?></span>
  </div>
<?php endif; ?>

<!-- Desk Overview Banner -->
<div class="card hint" style="border-left: 4px solid var(--sp-primary); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
  <div>
    <strong style="color: var(--sp-primary-dark); font-size: 14px;">Marketing &amp; Commercial Portfolio Desk</strong><br>
    Central working registry for APIs, Intermediates, Pellets, Piperidone Derivatives, and Pipeline Molecules.
    Update CAS numbers, pharmacopeial standards, and regulatory DMF availability in real-time.
  </div>
  <a href="#productForm" class="btn btn-primary" style="font-size: 13px; font-weight: 700;">+ Register New Product</a>
</div>

<!-- Category Metrics Overview -->
<div class="row-4" style="margin-bottom: 22px;">
  <div class="stat-card">
    <div class="stat-label">Total Portfolio</div>
    <div class="stat-num"><?php echo $counts['All']; ?></div>
    <div class="stat-sub">Commercial &amp; Pipeline</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">APIs (Active)</div>
    <div class="stat-num" style="color: #059669;"><?php echo $counts['APIs'] ?? 0; ?></div>
    <div class="stat-sub">Commercial APIs</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Intermediates</div>
    <div class="stat-num" style="color: #2563EB;"><?php echo $counts['Intermediates'] ?? 0; ?></div>
    <div class="stat-sub">Advanced Intermediates</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Pellets &amp; Derivatives</div>
    <div class="stat-num" style="color: #7C3AED;"><?php echo ($counts['Pellets'] ?? 0) + ($counts['Piperidone Derivatives'] ?? 0); ?></div>
    <div class="stat-sub">Pellets &amp; Piperidones</div>
  </div>
</div>

<!-- Product Table Card -->
<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Product Registry &amp; Directory (<span id="visibleCount"><?php echo count($data['items']); ?></span> / <?php echo count($data['items']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Filter by category, search by chemical name or CAS #, and click Edit to update any product.
      </div>
    </div>
  </div>

  <!-- Interactive Category Filter Pills -->
  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
    <button type="button" class="cat-pill is-active" data-cat="all">All (<?php echo $counts['All']; ?>)</button>
    <button type="button" class="cat-pill" data-cat="APIs">APIs (<?php echo $counts['APIs'] ?? 0; ?>)</button>
    <button type="button" class="cat-pill" data-cat="Intermediates">Intermediates (<?php echo $counts['Intermediates'] ?? 0; ?>)</button>
    <button type="button" class="cat-pill" data-cat="Pellets">Pellets (<?php echo $counts['Pellets'] ?? 0; ?>)</button>
    <button type="button" class="cat-pill" data-cat="Piperidone Derivatives">Piperidone (<?php echo $counts['Piperidone Derivatives'] ?? 0; ?>)</button>
    <button type="button" class="cat-pill" data-cat="Under Development">Pipeline / Dev (<?php echo $counts['Under Development'] ?? 0; ?>)</button>
  </div>

  <!-- Search Input -->
  <div class="table-search-bar">
    <input type="text" id="productSearchInput" placeholder="Quick search by product name, CAS #, therapeutic use, or specs..." style="width: 100%; max-width: 480px;">
  </div>

  <table id="marketingTable">
    <thead>
      <tr>
        <th>Code / ID</th>
        <th>Product Name</th>
        <th>Category</th>
        <th>CAS #</th>
        <th>Therapeutic Segment</th>
        <th>Specifications</th>
        <th>DMF Status</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['items'] as $it): 
      $isActive = ($it['status'] ?? 'active') === 'active';
      $cat = $it['category'] ?? 'APIs';
      $catBadgeClass = 'badge-cat-def';
      if ($cat === 'APIs') $catBadgeClass = 'badge-cat-api';
      elseif ($cat === 'Intermediates') $catBadgeClass = 'badge-cat-int';
      elseif ($cat === 'Pellets') $catBadgeClass = 'badge-cat-pel';
      elseif ($cat === 'Piperidone Derivatives') $catBadgeClass = 'badge-cat-pip';
      elseif ($cat === 'Under Development') $catBadgeClass = 'badge-cat-dev';
    ?>
      <tr data-cat="<?php echo htmlspecialchars($cat); ?>">
        <td><code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:11.5px;"><?php echo htmlspecialchars($it['id']); ?></code></td>
        <td>
          <strong style="color:var(--sp-text-main); font-size:13.5px;"><?php echo htmlspecialchars($it['name']); ?></strong>
          <?php if (!empty($it['note'])): ?>
            <div style="font-size:11px; color:#64748B; margin-top:2px;">📝 <?php echo htmlspecialchars($it['note']); ?></div>
          <?php endif; ?>
        </td>
        <td><span class="badge-cat <?php echo $catBadgeClass; ?>"><?php echo htmlspecialchars($cat); ?></span></td>
        <td><span style="font-family:monospace; font-size:12px; color:#475569;"><?php echo htmlspecialchars($it['cas_no'] ?? '—'); ?></span></td>
        <td><span style="font-size:12.5px;"><?php echo htmlspecialchars($it['therapeutic'] ?? '—'); ?></span></td>
        <td><span style="font-size:11.5px; color:#475569;"><?php echo htmlspecialchars($it['specifications'] ?? 'IP/USP/BP'); ?></span></td>
        <td><span style="font-size:11.5px; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 6px; border-radius:4px;"><?php echo htmlspecialchars($it['dmf_status'] ?? 'Available'); ?></span></td>
        <td>
          <span class="<?php echo $isActive ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isActive ? '● Active' : '○ Pipeline'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 10px; font-size:12px;" href="marketing.php?edit=<?php echo urlencode($it['id']); ?>#productForm">Edit</a>
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($it['id']); ?>">
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" type="submit" onclick="return confirm('Remove product <?php echo htmlspecialchars($it['name']); ?>?');">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['items']): ?>
      <tr><td colspan="9" style="text-align:center; padding:24px; color:#64748B;">No products found in portfolio registry.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>

<!-- Add / Edit Product Form Card -->
<div class="card" id="productForm" style="<?php echo $edit ? 'border: 2px solid var(--sp-primary); background: #FAFDFB;' : ''; ?>">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
    <div>
      <h2 style="margin:0; font-size:18px;">
        <?php if ($edit): ?>
          ✏️ Edit Product: <span style="color:var(--sp-primary-dark);"><?php echo htmlspecialchars($edit['name']); ?></span>
        <?php else: ?>
          ➕ Register New Product / Molecule
        <?php endif; ?>
      </h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        <?php echo $edit ? 'Update specifications, CAS numbers, commercial status, or regulatory filings below.' : 'Add a new API, intermediate, pellet, or pipeline molecule to the marketing catalogue.'; ?>
      </div>
    </div>
    <?php if ($edit): ?>
      <a class="btn btn-ghost" href="marketing.php" style="font-size:12.5px; color:var(--sp-text-muted);">✖ Cancel Edit</a>
    <?php endif; ?>
  </div>

  <form method="post">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save_item">

    <div class="row">
      <div>
        <label>Product Code / ID</label>
        <input name="id" value="<?php echo htmlspecialchars($edit['id'] ?? ''); ?>" placeholder="e.g. PR-API-001 (leave blank to auto-generate)" <?php echo $edit ? 'readonly style="background:#F1F5F9;"' : ''; ?>>
      </div>
      <div>
        <label>Commercial Status</label>
        <select name="status">
          <option value="active" <?php echo (($edit['status'] ?? 'active')==='active')?'selected':''; ?>>Active Commercial Supply</option>
          <option value="pipeline" <?php echo (($edit['status'] ?? '')==='pipeline')?'selected':''; ?>>Under Development / Pipeline</option>
          <option value="evaluation" <?php echo (($edit['status'] ?? '')==='evaluation')?'selected':''; ?>>Feasibility Evaluation</option>
        </select>
      </div>
    </div>

    <label>Product / Chemical Name <span style="color:#DC2626;">*</span></label>
    <input name="name" required value="<?php echo htmlspecialchars($edit['name'] ?? ''); ?>" placeholder="e.g. Atorvastatin Calcium Trihydrate">

    <div class="row-3">
      <div>
        <label>Category</label>
        <select name="category">
          <?php
            $cats = ["APIs", "Intermediates", "Pellets", "Piperidone Derivatives", "Under Development", "Custom Synthesis / CDMO"];
            $curCat = $edit["category"] ?? "APIs";
            foreach ($cats as $c) {
              $sel = ($curCat === $c) ? " selected" : "";
              echo "<option value=\"".htmlspecialchars($c)."\"".$sel.">".htmlspecialchars($c)."</option>";
            }
          ?>
        </select>
      </div>
      <div>
        <label>CAS Number</label>
        <input name="cas_no" value="<?php echo htmlspecialchars($edit['cas_no'] ?? ''); ?>" placeholder="e.g. 134523-03-8">
      </div>
      <div>
        <label>Therapeutic Segment</label>
        <input name="therapeutic" value="<?php echo htmlspecialchars($edit['therapeutic'] ?? ''); ?>" placeholder="e.g. Cardiovascular / Statin">
      </div>
    </div>

    <div class="row">
      <div>
        <label>Pharmacopeial Specifications</label>
        <input name="specifications" value="<?php echo htmlspecialchars($edit['specifications'] ?? 'IP / USP / BP / Ph.Eur / In-House'); ?>" placeholder="e.g. IP/USP/BP/Ph.Eur/JP">
      </div>
      <div>
        <label>DMF / Regulatory Filing Status</label>
        <input name="dmf_status" value="<?php echo htmlspecialchars($edit['dmf_status'] ?? 'Available'); ?>" placeholder="e.g. USDMF, CEP, KDMF, EU-GMP">
      </div>
    </div>

    <label>Internal Marketing &amp; Client Note</label>
    <input name="note" value="<?php echo htmlspecialchars($edit['note'] ?? ''); ?>" placeholder="e.g. Commercial batch availability, target markets, scale...">

    <p style="margin-top:22px;">
      <button class="btn btn-primary" type="submit" style="padding:10px 22px; font-weight:700;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $edit ? 'Save Product Updates' : 'Register Product'; ?>
      </button>
      <?php if ($edit): ?>
        <a class="btn btn-ghost" href="marketing.php" style="margin-left:8px;">Cancel</a>
      <?php endif; ?>
    </p>
  </form>
</div>

<script>
// Live Product Filter & Search
(function() {
  const searchInput = document.getElementById('productSearchInput');
  const catPills = document.querySelectorAll('.cat-pill');
  const table = document.getElementById('marketingTable');
  const visibleCountEl = document.getElementById('visibleCount');
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tbody tr'));
  let activeCat = 'all';

  function applyFilters() {
    const term = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let visible = 0;

    rows.forEach(r => {
      // Skip empty placeholder row
      if (r.querySelector('td[colspan]')) return;
      const rowCat = (r.getAttribute('data-cat') || '').trim();
      const catMatch = (activeCat === 'all' || rowCat === activeCat);
      const textMatch = !term || r.textContent.toLowerCase().includes(term);

      if (catMatch && textMatch) {
        r.style.display = '';
        visible++;
      } else {
        r.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visible;

    let noResults = table.querySelector('.search-no-results');
    if (visible === 0 && rows.length > 0) {
      if (!noResults) {
        noResults = document.createElement('tr');
        noResults.className = 'search-no-results';
        noResults.innerHTML = '<td colspan="9" style="text-align:center;padding:24px;color:#94A3B8;">No products matching your search or category filter.</td>';
        table.querySelector('tbody').appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', function() {
      catPills.forEach(p => p.classList.remove('is-active'));
      this.classList.add('is-active');
      activeCat = this.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
})();
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
