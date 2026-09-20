<?php
require __DIR__ . '/includes/auth.php';
staff_require_login();
if (!staff_can_jobs()) {
  http_response_code(403);
  echo 'This desk is for HR / admin only.';
  exit;
}
$u = staff_user();
$data = staff_load_jobs();
$msg = '';
$edit = null;

if (isset($_GET['download'])) {
  header('Content-Type: application/json; charset=utf-8');
  header('Content-Disposition: attachment; filename="jobs.json"');
  echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
  exit;
}

if (isset($_GET['edit'])) {
  foreach ($data['jobs'] as $j) {
    if ($j['id'] === $_GET['edit']) { $edit = $j; break; }
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  
  if ($action === 'save') {
    $job = [
      'id' => trim($_POST['id'] ?? ''),
      'title' => trim($_POST['title'] ?? ''),
      'department' => trim($_POST['department'] ?? ''),
      'location' => trim($_POST['location'] ?? ''),
      'experience' => trim($_POST['experience'] ?? ''),
      'type' => trim($_POST['type'] ?? 'Full Time'),
      'vacancies' => trim($_POST['vacancies'] ?? '1'),
      'posted' => trim($_POST['posted'] ?? date('d M Y')),
      'status' => ($_POST['status'] ?? 'open') === 'closed' ? 'closed' : 'open',
      'skills' => array_values(array_filter(array_map('trim', explode(',', $_POST['skills'] ?? '')))),
      'role' => trim($_POST['role'] ?? ''),
      'duties' => trim($_POST['duties'] ?? ''),
      'profile' => trim($_POST['profile'] ?? ''),
    ];
    if ($job['id'] === '' || $job['title'] === '') {
      $msg = 'Job ID and Title are required.';
      $edit = $job;
    } else {
      $found = false;
      foreach ($data['jobs'] as $i => $j) {
        if ($j['id'] === $job['id']) { $data['jobs'][$i] = $job; $found = true; break; }
      }
      if (!$found) $data['jobs'][] = $job;
      staff_save_jobs($data);
      header('Location: jobs.php?saved=1');
      exit;
    }
  }

  if ($action === 'clone') {
    $id = $_POST['id'] ?? '';
    foreach ($data['jobs'] as $j) {
      if ($j['id'] === $id) {
        $copy = $j;
        $copy['id'] = $j['id'] . '-COPY-' . mt_rand(10, 99);
        $copy['title'] = $j['title'] . ' (Copy)';
        $copy['status'] = 'closed';
        $copy['posted'] = date('d M Y');
        $data['jobs'][] = $copy;
        staff_save_jobs($data);
        header('Location: jobs.php?saved=2');
        exit;
      }
    }
  }

  if ($action === 'close' || $action === 'open') {
    $id = $_POST['id'] ?? '';
    foreach ($data['jobs'] as $i => $j) {
      if ($j['id'] === $id) {
        $data['jobs'][$i]['status'] = $action === 'close' ? 'closed' : 'open';
      }
    }
    staff_save_jobs($data);
    header('Location: jobs.php?saved=1');
    exit;
  }

  if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $data['jobs'] = array_values(array_filter($data['jobs'], function ($j) use ($id) {
      return $j['id'] !== $id;
    }));
    staff_save_jobs($data);
    header('Location: jobs.php?saved=1');
    exit;
  }
}

if (isset($_GET['saved'])) {
  $msg = $_GET['saved'] === '2' ? 'Requisition cloned as a new draft.' : 'Requisition successfully saved to jobs.json.';
}

$staff_title = 'Careers / HR';
require __DIR__ . '/includes/header.php';
?>

<?php if ($msg): ?>
  <div class="card ok">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    <span><?php echo htmlspecialchars($msg); ?></span>
  </div>
<?php endif; ?>

<div class="card hint">
  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
    <div>
      <strong>HR Operations Desk:</strong> Open requisitions here are live on the public <a href="../careers.html" target="_blank" rel="noopener" style="color:var(--sp-primary); font-weight:600; text-decoration:underline;">Careers Portal</a>. Closed postings remain archived and hidden from candidates.
    </div>
    <a href="../careers.html" target="_blank" rel="noopener" class="btn btn-ghost" style="font-size:12px; background:#FFFFFF;">
      Preview Careers Page &rarr;
    </a>
  </div>
</div>

<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Active &amp; Archived Positions (<?php echo count($data['jobs']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        <?php
          $openCt = count(array_filter($data['jobs'], function($j){ return ($j['status'] ?? 'open') === 'open'; }));
          echo $openCt . ' Open positions published';
        ?>
      </div>
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <a href="jobs.php?download=1" class="btn btn-ghost" title="Download jobs.json for static hosting or backup">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download jobs.json
      </a>
      <a href="jobs.php#jobForm" class="btn btn-primary" onclick="document.getElementById('jobIdInput').focus();">+ New Requisition</a>
    </div>
  </div>

  <!-- Search and filter -->
  <div class="table-search-bar">
    <div style="position:relative; width:100%; max-width:320px;">
      <input type="text" placeholder="Search by title, ID, dept, skills..." data-search-target="#jobsTable">
    </div>
    <span style="font-size:12px; color:var(--sp-text-muted);">Instant filter by any keyword</span>
  </div>

  <table id="jobsTable">
    <thead>
      <tr>
        <th>Job ID</th>
        <th>Title</th>
        <th>Department</th>
        <th>Location</th>
        <th>Type / Exp</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['jobs'] as $j): 
      $isOpen = ($j['status'] ?? 'open') !== 'closed';
    ?>
      <tr>
        <td><strong style="color:var(--sp-primary);"><?php echo htmlspecialchars($j['id']); ?></strong></td>
        <td>
          <div style="font-weight:600; color:var(--sp-text-main);"><?php echo htmlspecialchars($j['title']); ?></div>
          <?php if (!empty($j['skills'])): ?>
            <div style="font-size:11px; color:var(--sp-text-muted); margin-top:3px;">
              <?php echo htmlspecialchars(implode(', ', array_slice($j['skills'], 0, 4))); ?>
              <?php if (count($j['skills']) > 4) echo ' +' . (count($j['skills']) - 4); ?>
            </div>
          <?php endif; ?>
        </td>
        <td><span style="color:#475569; font-weight:500;"><?php echo htmlspecialchars($j['department'] ?? '—'); ?></span></td>
        <td><?php echo htmlspecialchars($j['location'] ?? 'Hyderabad'); ?></td>
        <td>
          <div style="font-size:12.5px;"><?php echo htmlspecialchars($j['type'] ?? 'Full Time'); ?></div>
          <div style="font-size:11px; color:#94A3B8;"><?php echo htmlspecialchars($j['experience'] ?? 'Relevant Exp'); ?></div>
        </td>
        <td>
          <span class="<?php echo $isOpen ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isOpen ? '● Open' : '○ Closed'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="jobs.php?edit=<?php echo urlencode($j['id']); ?>#jobForm" title="Edit Requisition">Edit</a>
          
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($j['id']); ?>">
            <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" name="action" value="clone" title="Duplicate Requisition">Clone</button>
            <?php if (!$isOpen): ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px; color:#059669;" name="action" value="open" title="Make Open">Publish</button>
            <?php else: ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px; color:#64748B;" name="action" value="close" title="Close Requisition">Close</button>
            <?php endif; ?>
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete" onclick="return confirm('Permanently delete requisition <?php echo htmlspecialchars($j['id']); ?>?');" title="Delete">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['jobs']): ?>
      <tr><td colspan="7" style="text-align:center; color:#64748B; padding:28px">No job requisitions recorded yet.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="card" id="jobForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $edit ? ('Edit Requisition: ' . htmlspecialchars($edit['id'])) : 'Create New Requisition'; ?></h2>
    <?php if ($edit): ?>
      <a class="btn btn-ghost" href="jobs.php" style="font-size:12px">Cancel Edit</a>
    <?php endif; ?>
  </div>
  <form method="post">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save">
    <div class="row">
      <div>
        <label>Job Code / ID</label>
        <input id="jobIdInput" name="id" required placeholder="e.g. VP-QC-004" value="<?php echo htmlspecialchars($edit['id'] ?? ''); ?>">
      </div>
      <div>
        <label>Visibility Status</label>
        <select name="status">
          <option value="open" <?php echo (($edit['status'] ?? 'open')==='open')?'selected':''; ?>>Open (Published on Careers)</option>
          <option value="closed" <?php echo (($edit['status'] ?? '')==='closed')?'selected':''; ?>>Closed (Archived / Hidden)</option>
        </select>
      </div>
    </div>
    
    <label>Job Title</label>
    <input name="title" required placeholder="e.g. Quality Assurance Executive" value="<?php echo htmlspecialchars($edit['title'] ?? ''); ?>">

    <div class="row-3">
      <div>
        <label>Department</label>
        <select name="department">
          <?php
            $depts = ["Quality","Manufacturing","R&D","EHS","Marketing","Foundation","Corporate Governance","Careers / HR","Supply Chain","Regulatory Affairs","Other"];
            $cur = $edit["department"] ?? "";
            echo "<option value=\"\">Select Department...</option>";
            foreach ($depts as $d) {
              $sel = ($cur === $d) ? " selected" : "";
              echo "<option value=\"".htmlspecialchars($d)."\"".$sel.">".htmlspecialchars($d)."</option>";
            }
          ?>
        </select>
      </div>
      <div>
        <label>Work Location</label>
        <input name="location" placeholder="e.g. Hyderabad, Telangana, IN" value="<?php echo htmlspecialchars($edit['location'] ?? 'Hyderabad, Telangana, IN'); ?>">
      </div>
      <div>
        <label>Employment Type</label>
        <select name="type">
          <?php
            $types = ["Full Time", "Contract", "Internship", "Part Time"];
            $curType = $edit["type"] ?? "Full Time";
            foreach ($types as $t) {
              $sel = ($curType === $t) ? " selected" : "";
              echo "<option value=\"".htmlspecialchars($t)."\"".$sel.">".htmlspecialchars($t)."</option>";
            }
          ?>
        </select>
      </div>
    </div>

    <div class="row-3">
      <div>
        <label>Experience Required</label>
        <input name="experience" placeholder="e.g. 2–5 Years or Freshers" value="<?php echo htmlspecialchars($edit['experience'] ?? ''); ?>">
      </div>
      <div>
        <label>Vacancies Count</label>
        <input name="vacancies" type="number" min="1" placeholder="e.g. 1" value="<?php echo htmlspecialchars($edit['vacancies'] ?? '1'); ?>">
      </div>
      <div>
        <label>Posting Date Label</label>
        <input name="posted" placeholder="e.g. Sep 2026 or Immediate" value="<?php echo htmlspecialchars($edit['posted'] ?? date('d M Y')); ?>">
      </div>
    </div>

    <div>
      <label>Skills &amp; Keywords (comma-separated, used for candidate matching)</label>
      <input name="skills" placeholder="e.g. QC, GMP, HPLC, Analysis, B.Pharm, M.Sc" value="<?php echo htmlspecialchars(implode(', ', $edit['skills'] ?? [])); ?>">
    </div>

    <label>Role Summary</label>
    <textarea name="role" placeholder="High-level overview of role purpose and site scope..."><?php echo htmlspecialchars($edit['role'] ?? ''); ?></textarea>
    
    <label>Key Duties &amp; Responsibilities</label>
    <textarea name="duties" placeholder="Detailed day-to-day responsibilities..."><?php echo htmlspecialchars($edit['duties'] ?? ''); ?></textarea>
    
    <label>Ideal Candidate Profile &amp; Education</label>
    <textarea name="profile" placeholder="Educational background, certifications, experience..."><?php echo htmlspecialchars($edit['profile'] ?? ''); ?></textarea>
    
    <p style="margin-top:22px">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save Requisition
      </button>
      <a class="btn btn-ghost" href="jobs.php">Cancel</a>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
