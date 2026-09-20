<?php
require __DIR__ . '/includes/auth.php';
$desk = preg_replace('/[^a-z]/', '', strtolower($_GET['d'] ?? ''));
$allowed = ['manufacturing','rnd','ehs','governance'];
if (!in_array($desk, $allowed, true)) { 
  http_response_code(404); 
  echo 'Unknown desk'; 
  exit; 
}
staff_require_desk($desk);
$u = staff_user();
$data = staff_load_desk($desk);
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $data['body'] = trim($_POST['body'] ?? '');
  $data['highlights'] = trim($_POST['highlights'] ?? '');
  $data['documents'] = trim($_POST['documents'] ?? '');
  $data['updated_by'] = $u['name'] ?? $u['email'];
  staff_save_desk($desk, $data);
  $msg = 'Department records successfully saved.';
  $data = staff_load_desk($desk);
}

$labels = staff_desks();
$staff_title = $labels[$desk]['label'] ?? ucfirst($desk);
require __DIR__ . '/includes/header.php';
?>

<?php if ($msg): ?>
  <div class="card ok">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    <span><?php echo htmlspecialchars($msg); ?></span>
  </div>
<?php endif; ?>

<div class="card hint">
  <strong><?php echo htmlspecialchars($staff_title); ?> Department Desk:</strong>
  Maintain operational notes, equipment capabilities, compliance updates, and policies for <?php echo htmlspecialchars($staff_title); ?>.
  <?php if (!empty($data['updated'])): ?>
    <div style="margin-top:4px; font-size:11.5px; color:#64748B;">
      Last saved: <strong><?php echo htmlspecialchars($data['updated']); ?></strong>
      <?php if (!empty($data['updated_by'])): ?> by <em><?php echo htmlspecialchars($data['updated_by']); ?></em><?php endif; ?>
    </div>
  <?php endif; ?>
</div>

<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h2 style="margin:0; font-size:18px;"><?php echo htmlspecialchars($staff_title); ?> Operations Console</h2>
    <span class="badge-open">Desk Active</span>
  </div>

  <form method="post">
    <?php echo staff_csrf_field(); ?>

    <label>Department Overview &amp; Operational Notes</label>
    <textarea name="body" style="min-height:160px;" placeholder="Document plant expansions, process scale-ups, audits, regulatory inspections, or internal notes..."><?php echo htmlspecialchars($data['body'] ?? ''); ?></textarea>

    <div class="row" style="margin-top:10px;">
      <div>
        <label>Key Metrics &amp; Operational Highlights</label>
        <textarea name="highlights" style="min-height:120px;" placeholder="e.g. Unit capacities, reactor volumes, cleanroom classifications, ISO/GMP certifications..."><?php echo htmlspecialchars($data['highlights'] ?? ''); ?></textarea>
      </div>
      <div>
        <label>Key Documents &amp; Compliance Links</label>
        <textarea name="documents" style="min-height:120px;" placeholder="e.g. Standard Operating Procedures, CFO/CFE clearances, public disclosures, report links..."><?php echo htmlspecialchars($data['documents'] ?? ''); ?></textarea>
      </div>
    </div>

    <p style="margin-top:24px;">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save <?php echo htmlspecialchars($staff_title); ?> Records
      </button>
      <a class="btn btn-ghost" href="home.php">Back to Dashboard</a>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
