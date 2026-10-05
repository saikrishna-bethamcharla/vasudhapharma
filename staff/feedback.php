<?php
require __DIR__ . '/includes/auth.php';
staff_require_login();
$u = staff_user();
if (!staff_can('feedback', $u)) {
  http_response_code(403);
  echo 'Access denied: You must be an administrator to access the Feedback & Review Desk.';
  exit;
}

$dataFile = __DIR__ . '/data/feedback.json';
$msg = '';
$err = '';

// Load data
function load_feedback_data($file) {
  if (!is_file($file)) return [];
  $j = json_decode(file_get_contents($file), true);
  return is_array($j) ? $j : [];
}

function save_feedback_data($file, $items) {
  return file_put_contents($file, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !== false;
}

// CSV Export Handler
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
  $list = load_feedback_data($dataFile);
  header('Content-Type: text/csv; charset=utf-8');
  header('Content-Disposition: attachment; filename=vasudha_feedback_tickets_' . date('Y-m-d') . '.csv');
  $out = fopen('php://output', 'w');
  fputcsv($out, ['Ticket ID', 'Date', 'Reviewer', 'Department/Email', 'Target Page', 'Category', 'Priority', 'Status', 'Developer Note', 'Status Updated At', 'Message']);
  foreach ($list as $t) {
    fputcsv($out, [
      $t['id'] ?? '',
      $t['date'] ?? '',
      $t['reviewerName'] ?? '',
      $t['reviewerDept'] ?? '',
      $t['targetPage'] ?? '',
      $t['category'] ?? '',
      $t['priority'] ?? '',
      $t['status'] ?? 'Open',
      $t['devNote'] ?? '',
      $t['statusUpdatedAt'] ?? '',
      $t['message'] ?? '',
    ]);
  }
  fclose($out);
  exit;
}

// JSON Export Handler
if (isset($_GET['export']) && $_GET['export'] === 'json') {
  $list = load_feedback_data($dataFile);
  header('Content-Type: application/json; charset=utf-8');
  header('Content-Disposition: attachment; filename=vasudha_feedback_tickets_' . date('Y-m-d') . '.json');
  echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

// POST Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  $list = load_feedback_data($dataFile);

  // 1. Update Status
  if ($action === 'update_status') {
    $ticketId = trim($_POST['ticket_id'] ?? '');
    $newStatus = trim($_POST['new_status'] ?? 'Open');
    $updated = false;

    foreach ($list as $i => $item) {
      if (($item['id'] ?? '') === $ticketId) {
        $list[$i]['status'] = $newStatus;
        $list[$i]['statusUpdatedAt'] = date('M j, Y h:i A');
        $updated = true;
        break;
      }
    }

    if ($updated && save_feedback_data($dataFile, $list)) {
      $msg = "Ticket {$ticketId} status updated to '{$newStatus}'.";
    } else {
      $err = "Failed to update ticket status.";
    }
  }

  // 2. Save Developer Resolution Note
  elseif ($action === 'save_dev_note') {
    $ticketId = trim($_POST['ticket_id'] ?? '');
    $devNote = trim($_POST['dev_note'] ?? '');
    $markResolved = !empty($_POST['mark_resolved']);
    $updated = false;

    foreach ($list as $i => $item) {
      if (($item['id'] ?? '') === $ticketId) {
        $list[$i]['devNote'] = $devNote;
        $list[$i]['statusUpdatedAt'] = date('M j, Y h:i A');
        if ($markResolved) {
          $list[$i]['status'] = 'Resolved';
        }
        $updated = true;
        break;
      }
    }

    if ($updated && save_feedback_data($dataFile, $list)) {
      $msg = "Resolution note saved for ticket {$ticketId}.";
    } else {
      $err = "Failed to save developer note.";
    }
  }

  // 3. Delete Single Ticket
  elseif ($action === 'delete_ticket') {
    $ticketId = trim($_POST['ticket_id'] ?? '');
    $list = array_filter($list, function($t) use ($ticketId) {
      return ($t['id'] ?? '') !== $ticketId;
    });

    if (save_feedback_data($dataFile, $list)) {
      $msg = "Ticket {$ticketId} removed.";
    } else {
      $err = "Failed to remove ticket.";
    }
  }

  // 4. Purge Resolved & Closed Tickets
  elseif ($action === 'purge_resolved') {
    $beforeCount = count($list);
    $list = array_filter($list, function($t) {
      $st = $t['status'] ?? 'Open';
      return $st !== 'Resolved' && $st !== 'Closed';
    });
    $purged = $beforeCount - count($list);

    if (save_feedback_data($dataFile, $list)) {
      $msg = "Cleaned up {$purged} resolved / closed tickets.";
    } else {
      $err = "Failed to purge tickets.";
    }
  }
}

// Reload updated data
$tickets = load_feedback_data($dataFile);

// Calculate metrics
$totalCount = count($tickets);
$openCount = 0;
$inProgressCount = 0;
$resolvedCount = 0;
$closedCount = 0;
$criticalCount = 0;

foreach ($tickets as $t) {
  $st = $t['status'] ?? 'Open';
  if ($st === 'Open') $openCount++;
  elseif ($st === 'In Progress') $inProgressCount++;
  elseif ($st === 'Resolved') $resolvedCount++;
  elseif ($st === 'Closed') $closedCount++;

  if (($t['priority'] ?? '') === 'Critical') $criticalCount++;
}

$staff_title = 'Feedback Desk';
require __DIR__ . '/includes/header.php';
?>

<!-- Desk Header -->
<div class="desk-header">
  <div class="desk-header-title">
    <h1>Testing Feedback &amp; Review Desk</h1>
    <p>Central operations console for compiling, reviewing, assigning, and resolving user feedback and revision requests submitted from the web platform.</p>
  </div>
  <div style="display:flex; gap:10px; flex-wrap:wrap;">
    <a href="?export=csv" class="btn btn-secondary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export CSV (Excel)
    </a>
    <a href="?export=json" class="btn btn-secondary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export JSON
    </a>
    <a href="../feedback.html" target="_blank" rel="noopener" class="btn btn-primary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Public Form
    </a>
  </div>
</div>

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

<!-- Metrics Row -->
<div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px;">
  <div class="stat-card">
    <div class="stat-num"><?php echo $totalCount; ?></div>
    <div class="stat-label">Total Tickets</div>
    <div class="stat-sub">All recorded notes</div>
  </div>
  <div class="stat-card" style="border-left: 4px solid #F59E0B;">
    <div class="stat-num" style="color: #D97706;"><?php echo $openCount; ?></div>
    <div class="stat-label">🟡 Open</div>
    <div class="stat-sub">Awaiting developer action</div>
  </div>
  <div class="stat-card" style="border-left: 4px solid #3B82F6;">
    <div class="stat-num" style="color: #2563EB;"><?php echo $inProgressCount; ?></div>
    <div class="stat-label">🔵 In Progress</div>
    <div class="stat-sub">Actively being revised</div>
  </div>
  <div class="stat-card" style="border-left: 4px solid #10B981;">
    <div class="stat-num" style="color: #059669;"><?php echo $resolvedCount; ?></div>
    <div class="stat-label">🟢 Resolved</div>
    <div class="stat-sub">Edits completed &amp; verified</div>
  </div>
  <div class="stat-card" style="border-left: 4px solid #EF4444;">
    <div class="stat-num" style="color: #DC2626;"><?php echo $criticalCount; ?></div>
    <div class="stat-label">🔴 Critical Priority</div>
    <div class="stat-sub">Launch blocker issues</div>
  </div>
</div>

<!-- Main Tickets Table Card -->
<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:18px;">
    <!-- Live Search -->
    <div style="flex:1; min-width:260px; max-width:440px;">
      <input type="text" id="fbSearchInput" placeholder="🔍 Search by ticket ID, reviewer, page, or keyword..." style="width:100%; box-sizing:border-box; padding:10px 14px; border:1px solid var(--sp-border); border-radius:9px; font-size:13.5px;" onkeyup="filterFeedbackTable()">
    </div>

    <!-- Filter Pills -->
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" class="btn btn-ghost fb-filter-btn active" onclick="setFilter('all', this)">All (<?php echo $totalCount; ?>)</button>
      <button type="button" class="btn btn-ghost fb-filter-btn" onclick="setFilter('Open', this)">Open (<?php echo $openCount; ?>)</button>
      <button type="button" class="btn btn-ghost fb-filter-btn" onclick="setFilter('In Progress', this)">In Progress (<?php echo $inProgressCount; ?>)</button>
      <button type="button" class="btn btn-ghost fb-filter-btn" onclick="setFilter('Resolved', this)">Resolved (<?php echo $resolvedCount; ?>)</button>
      <button type="button" class="btn btn-ghost fb-filter-btn" onclick="setFilter('Critical', this)">Critical (<?php echo $criticalCount; ?>)</button>
    </div>
  </div>

  <?php if (empty($tickets)): ?>
    <div style="text-align:center; padding:48px 20px; color:var(--sp-text-muted);">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" style="margin-bottom:12px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <div style="font-weight:700; font-size:16px; color:#334155;">No Feedback Tickets Yet</div>
      <p style="font-size:13.5px; max-width:420px; margin:6px auto 0;">All feedback submitted on the public website review form will automatically be compiled here for review and resolution.</p>
    </div>
  <?php else: ?>
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:13.5px;" id="feedbackTable">
        <thead>
          <tr style="background:#F8FAFC; border-bottom:2px solid var(--sp-border); text-align:left; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:0.04em;">
            <th style="padding:12px 14px;">Ticket</th>
            <th style="padding:12px 14px;">Target Page</th>
            <th style="padding:12px 14px;">Reviewer</th>
            <th style="padding:12px 14px; min-width:280px;">Requested Changes</th>
            <th style="padding:12px 14px;">Status</th>
            <th style="padding:12px 14px; text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($tickets as $idx => $t): 
            $status = $t['status'] ?? 'Open';
            $prio = $t['priority'] ?? 'Normal';
            $prioClass = ($prio === 'Critical') ? 'background:#FEE2E2; color:#DC2626; border:1px solid #FECACA;' : (($prio === 'High') ? 'background:#FEF3C7; color:#D97706; border:1px solid #FDE68A;' : 'background:#F1F5F9; color:#475569;');
            $statusColor = ($status === 'Resolved') ? 'background:#ECFDF5; color:#059669; border:1px solid #A7F3D0;' : (($status === 'In Progress') ? 'background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE;' : (($status === 'Closed') ? 'background:#F1F5F9; color:#64748B;' : 'background:#FFFBEB; color:#D97706; border:1px solid #FDE68A;'));
          ?>
            <tr class="fb-row" data-status="<?php echo htmlspecialchars($status); ?>" data-priority="<?php echo htmlspecialchars($prio); ?>" style="border-bottom:1px solid var(--sp-border);">
              <td style="padding:14px; vertical-align:top;">
                <strong style="color:var(--sp-primary-dark); font-family:monospace; font-size:13px;"><?php echo htmlspecialchars($t['id'] ?? 'VP-FB'); ?></strong>
                <div style="font-size:11px; color:#64748B; margin-top:3px;"><?php echo htmlspecialchars($t['date'] ?? ''); ?></div>
                <div style="margin-top:6px;">
                  <span style="font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:4px; <?php echo $prioClass; ?>">
                    <?php echo htmlspecialchars($prio); ?>
                  </span>
                </div>
              </td>

              <td style="padding:14px; vertical-align:top;">
                <div style="font-weight:600; color:var(--sp-text-main);">
                  <a href="../<?php echo htmlspecialchars($t['targetPage'] ?? 'index.html'); ?>" target="_blank" rel="noopener" style="color:var(--sp-primary); text-decoration:underline;">
                    <?php echo htmlspecialchars($t['targetPage'] ?? 'General'); ?>
                  </a>
                </div>
                <div style="font-size:11.5px; color:#64748B; margin-top:3px;">
                  <?php echo htmlspecialchars($t['category'] ?? 'Observation'); ?>
                </div>
              </td>

              <td style="padding:14px; vertical-align:top;">
                <div style="font-weight:600; color:#1E293B;"><?php echo htmlspecialchars($t['reviewerName'] ?? 'Reviewer'); ?></div>
                <div style="font-size:12px; color:#64748B;"><?php echo htmlspecialchars($t['reviewerDept'] ?? ''); ?></div>
              </td>

              <td style="padding:14px; vertical-align:top;">
                <div style="color:#0F172A; line-height:1.55; white-space:pre-wrap; word-break:break-word; max-width:440px;"><?php echo htmlspecialchars($t['message'] ?? ''); ?></div>
                
                <?php if (!empty($t['devNote'])): ?>
                  <div style="margin-top:8px; padding:7px 10px; background:#F0FDF4; border-left:3px solid #10B981; border-radius:4px; font-size:12px; color:#065F46;">
                    <strong>Dev Resolution:</strong> <?php echo htmlspecialchars($t['devNote']); ?>
                    <?php if (!empty($t['statusUpdatedAt'])): ?>
                      <span style="font-size:11px; color:#047857; margin-left:6px;">(<?php echo htmlspecialchars($t['statusUpdatedAt']); ?>)</span>
                    <?php endif; ?>
                  </div>
                <?php endif; ?>

                <?php if (!empty($t['screenshotMeta'])): ?>
                  <div style="margin-top:6px; font-size:12px; color:var(--sp-primary);">
                    📷 <em>Screenshot attached: <?php echo htmlspecialchars($t['screenshotMeta']['name'] ?? 'image'); ?></em>
                  </div>
                <?php endif; ?>
              </td>

              <td style="padding:14px; vertical-align:top;">
                <form method="post" style="display:inline;">
                  <?php echo staff_csrf_field(); ?>
                  <input type="hidden" name="action" value="update_status">
                  <input type="hidden" name="ticket_id" value="<?php echo htmlspecialchars($t['id']); ?>">
                  <select name="new_status" onchange="this.form.submit()" style="padding:5px 8px; font-size:12px; font-weight:700; border-radius:6px; cursor:pointer; <?php echo $statusColor; ?>">
                    <option value="Open" <?php echo $status === 'Open' ? 'selected' : ''; ?>>🟡 Open</option>
                    <option value="In Progress" <?php echo $status === 'In Progress' ? 'selected' : ''; ?>>🔵 In Progress</option>
                    <option value="Resolved" <?php echo $status === 'Resolved' ? 'selected' : ''; ?>>🟢 Resolved</option>
                    <option value="Closed" <?php echo $status === 'Closed' ? 'selected' : ''; ?>>⚪ Closed</option>
                  </select>
                </form>
              </td>

              <td style="padding:14px; vertical-align:top; text-align:right; white-space:nowrap;">
                <button type="button" class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" onclick="openDevNoteModal('<?php echo htmlspecialchars($t['id']); ?>', '<?php echo htmlspecialchars(addslashes($t['devNote'] ?? '')); ?>')">
                  💬 Note
                </button>
                <form method="post" style="display:inline;" onsubmit="return confirm('Permanently remove ticket <?php echo htmlspecialchars($t['id']); ?>?');">
                  <?php echo staff_csrf_field(); ?>
                  <input type="hidden" name="action" value="delete_ticket">
                  <input type="hidden" name="ticket_id" value="<?php echo htmlspecialchars($t['id']); ?>">
                  <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid var(--sp-border);">
      <div style="font-size:12.5px; color:var(--sp-text-muted);">
        Showing <strong><span id="visibleCount"><?php echo $totalCount; ?></span></strong> of <strong><?php echo $totalCount; ?></strong> tickets
      </div>
      <form method="post" onsubmit="return confirm('Are you sure you want to clear all Resolved and Closed tickets? This cannot be undone.');">
        <?php echo staff_csrf_field(); ?>
        <input type="hidden" name="action" value="purge_resolved">
        <button type="submit" class="btn btn-ghost" style="color:#DC2626; font-size:12px;">🧹 Purge Resolved &amp; Closed</button>
      </form>
    </div>
  <?php endif; ?>
</div>

<!-- Modal: Add / Edit Resolution Note -->
<div id="devNoteModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.6); z-index:9999; align-items:center; justify-content:center; padding:16px;">
  <div style="background:#FFFFFF; border-radius:16px; width:100%; max-width:500px; padding:28px 24px; box-shadow:0 20px 40px rgba(0,0,0,0.25);">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="margin:0; font-size:17px; color:var(--sp-primary-dark);" id="modalTicketTitle">Developer Resolution Note</h3>
      <button type="button" onclick="closeDevNoteModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748B;">&times;</button>
    </div>
    <form method="post">
      <?php echo staff_csrf_field(); ?>
      <input type="hidden" name="action" value="save_dev_note">
      <input type="hidden" name="ticket_id" id="modalTicketId">

      <label style="display:block; font-size:12.5px; font-weight:600; color:#334155; margin-bottom:6px;">Resolution / Technical Action Performed:</label>
      <textarea name="dev_note" id="modalDevNote" rows="5" required style="width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid var(--sp-border); border-radius:8px; font-family:inherit; font-size:13.5px;" placeholder="e.g. Updated product table and corrected CAS number in apis.html. Verified on live server."></textarea>

      <div style="margin-top:12px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#334155; cursor:pointer;">
          <input type="checkbox" name="mark_resolved" value="1" checked>
          <span>Mark ticket status as <strong>Resolved (🟢)</strong></span>
        </label>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
        <button type="button" class="btn btn-ghost" onclick="closeDevNoteModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Resolution Note</button>
      </div>
    </form>
  </div>
</div>

<script>
  let activeFilter = 'all';

  function setFilter(filter, btn) {
    activeFilter = filter;
    document.querySelectorAll('.fb-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    filterFeedbackTable();
  }

  function filterFeedbackTable() {
    const q = (document.getElementById('fbSearchInput').value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#feedbackTable tbody tr.fb-row');
    let visible = 0;

    rows.forEach(r => {
      const status = r.dataset.status;
      const priority = r.dataset.priority;
      const text = r.innerText.toLowerCase();

      let matchFilter = (activeFilter === 'all') || 
                        (activeFilter === status) || 
                        (activeFilter === priority);
      let matchSearch = !q || text.indexOf(q) !== -1;

      if (matchFilter && matchSearch) {
        r.style.display = '';
        visible++;
      } else {
        r.style.display = 'none';
      }
    });

    const cnt = document.getElementById('visibleCount');
    if (cnt) cnt.textContent = visible;
  }

  function openDevNoteModal(ticketId, existingNote) {
    document.getElementById('modalTicketId').value = ticketId;
    document.getElementById('modalTicketTitle').textContent = 'Resolution Note: ' + ticketId;
    document.getElementById('modalDevNote').value = existingNote || '';
    const modal = document.getElementById('devNoteModal');
    modal.style.display = 'flex';
  }

  function closeDevNoteModal() {
    document.getElementById('devNoteModal').style.display = 'none';
  }
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
