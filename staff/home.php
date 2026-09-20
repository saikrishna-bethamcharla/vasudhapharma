<?php
require __DIR__ . '/includes/auth.php';
staff_require_login();
$u = staff_user();
$stats = staff_portal_stats();
$desks = staff_desks();
$isAdmin = ($u['role'] ?? '') === 'admin';

// Check storage files health
$storageFiles = [
  'Careers Data' => ['path' => staff_jobs_file(), 'file' => 'jobs.json'],
  'News & Events' => ['path' => dirname(staff_root()) . '/news-events.json', 'file' => 'news-events.json'],
  'Foundation Galleries' => ['path' => dirname(staff_root()) . '/foundation-galleries.json', 'file' => 'foundation-galleries.json'],
  'Staff Users' => ['path' => staff_users_file(), 'file' => 'staff/data/users.json'],
];

$staff_title = 'Home';
require __DIR__ . '/includes/header.php';
?>

<div class="card" style="background: linear-gradient(135deg, #1E3A8A 0%, #2E4A8A 55%, #3D5CAD 100%); color:#FFFFFF; border:0; padding:28px 32px; box-shadow: 0 8px 24px rgba(46,74,138,0.18);">
  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
    <div>
      <div style="text-transform:uppercase; font-size:11px; letter-spacing:0.12em; opacity:0.85; font-weight:700; margin-bottom:6px;">
        Operations Hub &bull; Vasudha Pharma
      </div>
      <h1 style="margin:0; font-size:24px; color:#FFFFFF;">Welcome back, <?php echo htmlspecialchars($u['name']); ?></h1>
      <p style="margin:6px 0 0; opacity:0.9; font-size:13.5px;">
        Role: <span style="font-weight:700; text-transform:uppercase; background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:4px; font-size:11px;"><?php echo htmlspecialchars($u['role']); ?></span> &bull; 
        Department: <span style="font-weight:600; text-transform:capitalize;"><?php echo htmlspecialchars($u['dept']); ?></span> &bull;
        Date: <?php echo date('d M Y'); ?>
      </p>
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <a href="profile.php" class="btn" style="background:rgba(255,255,255,0.18); color:#FFFFFF; border:1px solid rgba(255,255,255,0.3); font-weight:600;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        My Account
      </a>
      <a href="../careers.html#openings" target="_blank" rel="noopener" class="btn" style="background:#FFFFFF; color:var(--sp-primary-dark); font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.12);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
        View Public Careers
      </a>
    </div>
  </div>
</div>

<!-- Key Performance & Content Metrics -->
<div class="row-4" style="margin-bottom:22px;">
  <div class="stat-card">
    <div class="stat-label">Active Requisitions</div>
    <div class="stat-num"><?php echo $stats['jobs_open']; ?></div>
    <div class="stat-sub"><?php echo $stats['jobs_total']; ?> total in jobs.json</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Conferences &amp; Events</div>
    <div class="stat-num"><?php echo $stats['events_total']; ?></div>
    <div class="stat-sub">Scheduled appearances</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">News &amp; Press</div>
    <div class="stat-num"><?php echo $stats['news_total']; ?></div>
    <div class="stat-sub">Published articles &amp; updates</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Foundation Gallery</div>
    <div class="stat-num"><?php echo $stats['gallery_total']; ?></div>
    <div class="stat-sub">Photos across galleries</div>
  </div>
</div>

<!-- Quick Action Bar -->
<div class="card" style="padding:18px 24px;">
  <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
    <div style="font-weight:700; font-size:14px; color:var(--sp-text-main); display:flex; align-items:center; gap:8px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Quick Operational Actions
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <?php if (staff_can('careers')): ?>
        <a href="jobs.php#jobForm" class="btn btn-primary" style="font-size:12.5px;">+ Post New Job</a>
      <?php endif; ?>
      <?php if (staff_can('news')): ?>
        <a href="news.php" class="btn btn-ghost" style="font-size:12.5px;">+ Add Event / News</a>
      <?php endif; ?>
      <?php if (staff_can('foundation')): ?>
        <a href="foundation.php" class="btn btn-ghost" style="font-size:12.5px;">+ Upload Photo</a>
      <?php endif; ?>
      <?php if ($isAdmin): ?>
        <a href="users.php" class="btn btn-ghost" style="font-size:12.5px;">+ Manage Users</a>
      <?php endif; ?>
    </div>
  </div>
</div>

<!-- Department Desks Grid -->
<div class="card">
  <h2 style="margin-top:0; font-size:17px; margin-bottom:18px;">Your Accessible Department Desks</h2>
  <div class="row" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
    <?php foreach ($desks as $key => $d):
      $canAccess = staff_can($key);
    ?>
      <div style="border:1px solid <?php echo $canAccess ? 'var(--sp-border)' : '#F1F5F9'; ?>; border-radius:12px; padding:18px 20px; background:<?php echo $canAccess ? '#FFFFFF' : '#FAFAFA'; ?>; display:flex; flex-direction:column; justify-content:space-between; gap:14px; transition:all 0.15s ease;" <?php if ($canAccess) echo 'onmouseover="this.style.borderColor=\'var(--sp-primary)\';this.style.boxShadow=\'0 4px 14px rgba(37,70,150,0.08)\';" onmouseout="this.style.borderColor=\'var(--sp-border)\';this.style.boxShadow=\'none\';"'; ?>>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <h3 style="margin:0; font-size:16px; color:<?php echo $canAccess ? 'var(--sp-primary)' : '#94A3B8'; ?>;">
              <?php echo htmlspecialchars($d['label']); ?>
            </h3>
            <?php if ($canAccess): ?>
              <span class="badge-open" style="font-size:11px;">Access Active</span>
            <?php else: ?>
              <span class="badge-closed" style="font-size:11px;">Restricted</span>
            <?php endif; ?>
          </div>
          <p style="margin:0; font-size:12.5px; color:var(--sp-text-muted); line-height:1.5;">
            <?php
              switch ($key) {
                case 'careers': echo 'Manage open job requisitions, candidate requirements, and automated publishing on careers.html.'; break;
                case 'news': echo 'Publish upcoming global pharmaceutical conferences, booth locations, and press announcements.'; break;
                case 'foundation': echo 'Curate social responsibility photo streams for Vasudha Foundation and VRRV Family Foundation.'; break;
                case 'marketing': echo 'Track pipeline products, catalogue sync, and lead intake.'; break;
                case 'manufacturing': echo 'Update plant footprint, operational notes, and unit compliance.'; break;
                case 'rnd': echo 'Document synthesis capabilities, technology transfer notes, and pipeline status.'; break;
                case 'ehs': echo 'Manage environmental, health & safety policies, sustainability ratings, and audit notices.'; break;
                case 'governance': echo 'Manage corporate statutory regulations, director disclosures, and committee policies.'; break;
                default: echo 'Department operational workspace.';
              }
            ?>
          </p>
        </div>
        <div>
          <?php if ($canAccess): ?>
            <a href="<?php echo htmlspecialchars($d['file']); ?>" class="btn btn-primary" style="width:100%; justify-content:center; font-size:12.5px;">
              Open Desk &rarr;
            </a>
          <?php else: ?>
            <button class="btn btn-ghost" disabled style="width:100%; justify-content:center; opacity:0.6; cursor:not-allowed; font-size:12.5px;">
              Permission Required
            </button>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<!-- Storage Health Widget -->
<div class="card">
  <h2 style="margin-top:0; font-size:17px; margin-bottom:14px;">System Data Storage Health</h2>
  <p class="hint" style="margin-bottom:16px;">
    The portal runs on file-based JSON persistence. Ensure all files remain writable by the PHP server process.
  </p>
  <table>
    <thead>
      <tr>
        <th>Data Target</th>
        <th>File Path</th>
        <th>Status</th>
        <th>Size</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($storageFiles as $label => $info):
        $exists = is_file($info['path']);
        $writable = $exists ? is_writable($info['path']) : is_writable(dirname($info['path']));
        $size = $exists ? round(filesize($info['path']) / 1024, 1) . ' KB' : '—';
        $mtime = $exists ? date('d M Y, H:i', filemtime($info['path'])) : 'Not created yet';
      ?>
        <tr>
          <td><strong><?php echo htmlspecialchars($label); ?></strong></td>
          <td><code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:12px; color:#334155;"><?php echo htmlspecialchars($info['file']); ?></code></td>
          <td>
            <?php if ($exists && $writable): ?>
              <span class="badge-open">&#10003; Healthy &amp; Writable</span>
            <?php elseif ($exists && !$writable): ?>
              <span class="badge-closed" style="background:#FEE2E2; color:#DC2626;">&#9888; Read-Only</span>
            <?php else: ?>
              <span class="badge-closed">&#9888; Pending Creation</span>
            <?php endif; ?>
          </td>
          <td><?php echo $size; ?></td>
          <td><?php echo $mtime; ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
