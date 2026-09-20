<?php
require __DIR__ . '/includes/auth.php';
staff_require_desk('marketing');
$u = staff_user();
$data = staff_load_desk('marketing');
if (!isset($data['items'])) $data['items'] = [];
$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  
  if ($action === 'save_item') {
    $item = [
      'id' => trim($_POST['id'] ?? '') ?: ('PR-' . time()),
      'name' => trim($_POST['name'] ?? ''),
      'category' => trim($_POST['category'] ?? 'APIs'),
      'cas_no' => trim($_POST['cas_no'] ?? ''),
      'therapeutic' => trim($_POST['therapeutic'] ?? ''),
      'dmf_status' => trim($_POST['dmf_status'] ?? 'Under Evaluation'),
      'status' => trim($_POST['status'] ?? 'active'),
      'note' => trim($_POST['note'] ?? ''),
    ];
    if ($item['name'] === '') {
      $err = 'Product name is required.';
    } else {
      $found = false;
      foreach ($data['items'] as $i => $it) {
        if ($it['id'] === $item['id']) { $data['items'][$i] = $item; $found = true; break; }
      }
      if (!$found) $data['items'][] = $item;
      staff_save_desk('marketing', $data);
      $msg = 'Product item successfully saved to Marketing portfolio.';
    }
  }

  if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $data['items'] = array_values(array_filter($data['items'], function ($it) use ($id) { return $it['id'] !== $id; }));
    staff_save_desk('marketing', $data);
    $msg = 'Product removed from portfolio.';
  }
}

$staff_title = 'Marketing';
require __DIR__ . '/includes/header.php';
$edit = null;
if (isset($_GET['edit'])) {
  foreach ($data['items'] as $it) if ($it['id'] === $_GET['edit']) $edit = $it;
}
?>

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

<div class="card hint">
  <strong>Marketing &amp; Portfolio Desk:</strong> Working registry for APIs, Intermediates, Pellets, and Pipeline Molecules. 
  Maintain therapeutic categories, CAS numbers, and DMF availability here.
</div>

<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Product Portfolio &amp; Pipeline (<?php echo count($data['items']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Commercial and development candidate registry
      </div>
    </div>
    <a href="marketing.php#productForm" class="btn btn-primary">+ Add Product</a>
  </div>

  <div class="table-search-bar">
    <input type="text" placeholder="Search by name, category, CAS #, or therapeutic segment..." data-search-target="#marketingTable">
  </div>

  <table id="marketingTable">
    <thead>
      <tr>
        <th>ID / Code</th>
        <th>Product Name</th>
        <th>Category</th>
        <th>CAS #</th>
        <th>Therapeutic Segment</th>
        <th>DMF Status</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['items'] as $it): 
      $isActive = ($it['status'] ?? 'active') === 'active';
    ?>
      <tr>
        <td><code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:12px;"><?php echo htmlspecialchars($it['id']); ?></code></td>
        <td><strong style="color:var(--sp-text-main);"><?php echo htmlspecialchars($it['name']); ?></strong></td>
        <td><span style="font-size:12px; color:var(--sp-primary); font-weight:600;"><?php echo htmlspecialchars($it['category'] ?? 'APIs'); ?></span></td>
        <td><span style="font-family:monospace; font-size:12px; color:#475569;"><?php echo htmlspecialchars($it['cas_no'] ?? '—'); ?></span></td>
        <td><?php echo htmlspecialchars($it['therapeutic'] ?? '—'); ?></td>
        <td><span style="font-size:11.5px; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 6px; border-radius:4px;"><?php echo htmlspecialchars($it['dmf_status'] ?? 'Available'); ?></span></td>
        <td>
          <span class="<?php echo $isActive ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isActive ? '● Active' : '○ Pipeline'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="marketing.php?edit=<?php echo urlencode($it['id']); ?>#productForm">Edit</a>
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($it['id']); ?>">
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete" onclick="return confirm('Delete product <?php echo htmlspecialchars($it['name']); ?>?');">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['items']): ?>
      <tr><td colspan="8" style="text-align:center; padding:24px; color:#64748B;">No products added to this portfolio desk yet.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="card" id="productForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $edit ? ('Edit Product: ' . htmlspecialchars($edit['name'])) : 'Register New Product / Molecule'; ?></h2>
    <?php if ($edit): ?><a class="btn btn-ghost" href="marketing.php" style="font-size:12px">Cancel</a><?php endif; ?>
  </div>

  <form method="post">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save_item">

    <div class="row">
      <div>
        <label>Product Code / ID</label>
        <input name="id" value="<?php echo htmlspecialchars($edit['id'] ?? ''); ?>" placeholder="e.g. PR-ATV-01 (leave blank to auto-create)">
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

    <label>Product / Chemical Name</label>
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
        <label>DMF / Regulatory Filing Status</label>
        <input name="dmf_status" value="<?php echo htmlspecialchars($edit['dmf_status'] ?? 'USDMF / CEP Available'); ?>" placeholder="e.g. USDMF, CEP, EU-GMP">
      </div>
      <div>
        <label>Internal Marketing Note</label>
        <input name="note" value="<?php echo htmlspecialchars($edit['note'] ?? ''); ?>" placeholder="e.g. Key client targets, capacity, batch sizes...">
      </div>
    </div>

    <p style="margin-top:22px;">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $edit ? 'Save Product Changes' : 'Register Product'; ?>
      </button>
      <?php if ($edit): ?><a class="btn btn-ghost" href="marketing.php">Cancel</a><?php endif; ?>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
