<?php
require __DIR__ . '/includes/auth.php';
staff_require_desk('foundation');
$u = staff_user();
$data = staff_load_desk('foundation');
if (!isset($data['items'])) $data['items'] = [];
$msg = '';
$err = '';
$gal_file = dirname(staff_root()) . '/foundation-galleries.json';
$gal_dir = dirname(staff_root()) . '/assets/foundation';

function staff_load_gal($f) {
  if (!is_file($f)) return ['vasudha' => [], 'vrrv' => [], 'moments' => []];
  $j = json_decode(file_get_contents($f), true);
  if (!is_array($j)) $j = [];
  $j['vasudha'] = isset($j['vasudha']) && is_array($j['vasudha']) ? $j['vasudha'] : [];
  $j['vrrv'] = isset($j['vrrv']) && is_array($j['vrrv']) ? $j['vrrv'] : [];
  $j['moments'] = isset($j['moments']) && is_array($j['moments']) ? $j['moments'] : [];
  return $j;
}
function staff_save_gal($f, $g) {
  return file_put_contents($f, json_encode($g, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !== false;
}
$gal = staff_load_gal($gal_file);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  
  if ($action === 'upload_img') {
    $which = $_POST['which'] ?? 'vasudha';
    if (!in_array($which, ['vasudha','vrrv','moments'], true)) $which = 'vasudha';
    if (!empty($_FILES['image']['tmp_name']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
      $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
      if (!in_array($ext, ['jpg','jpeg','png','webp','gif'], true)) {
        $err = 'Unsupported format. Please upload JPG, PNG, WEBP, or GIF.';
      } elseif ($_FILES['image']['size'] > 6 * 1024 * 1024) {
        $err = 'Image must be under 6 MB.';
      } else {
        $folder = $which === 'moments' ? 'founder-gallery' : 'foundation';
        $dir = dirname(staff_root()) . '/assets/' . $folder;
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        $name = $which . '-' . date('Ymd-His') . '-' . mt_rand(100,999) . '.' . $ext;
        $dest = $dir . '/' . $name;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
          $gal[$which][] = 'assets/' . $folder . '/' . $name;
          staff_save_gal($gal_file, $gal);
          $label = ($which === 'vrrv' ? 'VRRV Family' : ($which === 'moments' ? 'Moments' : 'Vasudha Foundation'));
          $msg = 'Image added to the ' . $label . ' gallery stream.';
        } else {
          $err = 'Could not save the uploaded file. Check folder permissions on assets/' . $folder . '.';
        }
      }
    } else {
      $err = 'Please choose an image file to upload.';
    }
  }

  if ($action === 'delete_img') {
    $which = $_POST['which'] ?? 'vasudha';
    if (!in_array($which, ['vasudha','vrrv','moments'], true)) $which = 'vasudha';
    $src = $_POST['src'] ?? '';
    $gal[$which] = array_values(array_filter($gal[$which], function ($s) use ($src) { return $s !== $src; }));
    staff_save_gal($gal_file, $gal);
    if (strpos($src, 'assets/foundation/') === 0 || strpos($src, 'assets/founder-gallery/') === 0) {
      $path = dirname(staff_root()) . '/' . $src;
      if (is_file($path)) @unlink($path);
    }
    $msg = 'Image removed from gallery.';
  }

  if ($action === 'save_item') {
    $item = [
      'id' => trim($_POST['id'] ?? '') ?: ('EV-' . time()),
      'title' => trim($_POST['title'] ?? ''),
      'date' => trim($_POST['date'] ?? ''),
      'place' => trim($_POST['place'] ?? ''),
      'status' => ($_POST['status'] ?? 'draft') === 'live' ? 'live' : 'draft',
      'body' => trim($_POST['body'] ?? ''),
    ];
    if ($item['title'] === '') {
      $err = 'Event title is required.';
    } else {
      $found = false;
      foreach ($data['items'] as $i => $it) {
        if ($it['id'] === $item['id']) { $data['items'][$i] = $item; $found = true; break; }
      }
      if (!$found) $data['items'][] = $item;
      staff_save_desk('foundation', $data);
      $msg = 'Foundation initiative successfully saved.';
    }
  }

  if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $data['items'] = array_values(array_filter($data['items'], function ($it) use ($id) { return $it['id'] !== $id; }));
    staff_save_desk('foundation', $data);
    $msg = 'Initiative removed.';
  }
}

$staff_title = 'Foundation';
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

<div class="card hint" style="background:#EEF2FB; border-left:4px solid var(--sp-primary); padding:16px 20px; border-radius:8px;">
  <div style="font-weight:700; color:var(--sp-primary-dark); font-size:14px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    Foundation Desk: 3-Scroll Image Gallery Manager
  </div>
  <p style="margin:0 0 8px; font-size:13px; color:var(--sp-text-main); line-height:1.5;">
    Manage the community photo streams for the 3 live carousels on the Foundation page:
    <strong>1. Vasudha Foundation</strong>, <strong>2. VRRV Family Foundation</strong>, and <strong>3. Moments from the Foundation</strong>.
    Staff can <strong>add new photos</strong> or <strong>remove existing photos</strong> from each stream.
  </p>
  <div style="background:#FFFFFF; border:1px solid #C7D7F5; padding:10px 14px; border-radius:6px; font-size:12px; color:#1E3A8A; display:flex; align-items:flex-start; gap:8px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <div>
      <strong>Design &amp; Layout Policy:</strong> The image frame dimensions, aspect ratios, responsive scaling, and continuous marquee scroll speeds are centrally fixed by corporate website stylesheets to ensure uniform rendering across all mobile and desktop devices. Staff cannot alter scroll speeds or frame sizes.
    </div>
  </div>
</div>

<?php
function staff_gal_panel($title, $which, $list) {
  $count = count($list);
  ?>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
      <h2 style="margin:0; font-size:18px;">
        <?php echo htmlspecialchars($title); ?> 
        <span style="font-size:13px; font-weight:500; color:var(--sp-text-muted);">(<?php echo $count; ?> images)</span>
      </h2>
    </div>
    
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:14px; margin-bottom:20px;">
      <?php foreach ($list as $src): ?>
        <div style="border:1px solid var(--sp-border); border-radius:10px; padding:8px; background:#FAFAFA; display:flex; flex-direction:column; justify-content:space-between;">
          <a href="../<?php echo htmlspecialchars($src); ?>" target="_blank" rel="noopener">
            <img src="../<?php echo htmlspecialchars($src); ?>" alt="" style="width:100%; height:96px; object-fit:cover; border-radius:6px; background:#eee;">
          </a>
          <div style="font-size:10.5px; color:#64748B; margin:6px 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="<?php echo htmlspecialchars(basename($src)); ?>">
            <?php echo htmlspecialchars(basename($src)); ?>
          </div>
          <form method="post" onsubmit="return confirm('Remove this image from the scroll?');">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="action" value="delete_img">
            <input type="hidden" name="which" value="<?php echo htmlspecialchars($which); ?>">
            <input type="hidden" name="src" value="<?php echo htmlspecialchars($src); ?>">
            <button class="btn btn-danger" type="submit" style="width:100%; justify-content:center; padding:4px 8px; font-size:11.5px;">Remove</button>
          </form>
        </div>
      <?php endforeach; ?>
      <?php if (!$list): ?>
        <div style="grid-column: 1 / -1; padding:24px; text-align:center; color:#94A3B8; background:#F8FAFC; border-radius:8px;">
          No images uploaded in this collection yet.
        </div>
      <?php endif; ?>
    </div>

    <form method="post" enctype="multipart/form-data" style="border-top:1px solid var(--sp-border); padding-top:16px;">
      <?php echo staff_csrf_field(); ?>
      <input type="hidden" name="action" value="upload_img">
      <input type="hidden" name="which" value="<?php echo htmlspecialchars($which); ?>">
      <label style="margin-top:0;">Upload photo to <?php echo htmlspecialchars($title); ?></label>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" required style="max-width:360px;">
        <button class="btn btn-primary" type="submit">+ Upload &amp; Add to Gallery</button>
      </div>
    </form>
  </div>
  <?php
}

staff_gal_panel('Vasudha Foundation Gallery', 'vasudha', $gal['vasudha']);
staff_gal_panel('VRRV Family Foundation Gallery', 'vrrv', $gal['vrrv']);
staff_gal_panel('Moments from the Foundation Gallery', 'moments', $gal['moments']);
?>

<div class="card" style="margin-top:32px;">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Foundation Programs &amp; Initiatives (<?php echo count($data['items']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Community health camps, education scholarships, and CSR records
      </div>
    </div>
    <a href="foundation.php#itemForm" class="btn btn-primary">+ New Initiative</a>
  </div>

  <table id="foundationTable">
    <thead>
      <tr>
        <th>ID</th>
        <th>Program Title</th>
        <th>Date &amp; Venue</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['items'] as $it): 
      $isLive = ($it['status'] ?? '') === 'live';
    ?>
      <tr>
        <td><code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:12px;"><?php echo htmlspecialchars($it['id']); ?></code></td>
        <td><strong style="color:var(--sp-text-main);"><?php echo htmlspecialchars($it['title']); ?></strong></td>
        <td><?php echo htmlspecialchars(($it['date'] ?? '') . (!empty($it['place']) ? ' · ' . $it['place'] : '')); ?></td>
        <td>
          <span class="<?php echo $isLive ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isLive ? '● Live' : '○ Draft'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="foundation.php?edit=<?php echo urlencode($it['id']); ?>#itemForm">Edit</a>
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($it['id']); ?>">
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete" onclick="return confirm('Remove this initiative?');">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['items']): ?>
      <tr><td colspan="5" style="text-align:center; padding:24px; color:#64748B;">No initiatives recorded yet.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="card" id="itemForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $edit ? ('Edit Initiative: ' . htmlspecialchars($edit['title'])) : 'Record New Initiative'; ?></h2>
    <?php if ($edit): ?><a class="btn btn-ghost" href="foundation.php" style="font-size:12px">Cancel</a><?php endif; ?>
  </div>

  <form method="post">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save_item">
    
    <div class="row">
      <div>
        <label>Record ID</label>
        <input name="id" value="<?php echo htmlspecialchars($edit['id'] ?? ''); ?>" placeholder="e.g. CSR-2026-01 (leave blank to auto-create)">
      </div>
      <div>
        <label>Status</label>
        <select name="status">
          <option value="live" <?php echo (($edit['status'] ?? 'live')==='live')?'selected':''; ?>>Live</option>
          <option value="draft" <?php echo (($edit['status'] ?? '')==='draft')?'selected':''; ?>>Draft</option>
        </select>
      </div>
    </div>

    <label>Program Title</label>
    <input name="title" required value="<?php echo htmlspecialchars($edit['title'] ?? ''); ?>" placeholder="e.g. Rural Healthcare &amp; Medical Camp">

    <div class="row">
      <div>
        <label>Date</label>
        <input name="date" value="<?php echo htmlspecialchars($edit['date'] ?? ''); ?>" placeholder="e.g. August 2026">
      </div>
      <div>
        <label>Location / Village / District</label>
        <input name="place" value="<?php echo htmlspecialchars($edit['place'] ?? ''); ?>" placeholder="e.g. Visakhapatnam, Andhra Pradesh">
      </div>
    </div>

    <label>Details &amp; Impact Description</label>
    <textarea name="body" placeholder="Describe community reach, beneficiaries, medical equipment distributed..."><?php echo htmlspecialchars($edit['body'] ?? ''); ?></textarea>

    <p style="margin-top:22px;">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $edit ? 'Save Changes' : 'Save Initiative'; ?>
      </button>
      <?php if ($edit): ?><a class="btn btn-ghost" href="foundation.php">Cancel</a><?php endif; ?>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
