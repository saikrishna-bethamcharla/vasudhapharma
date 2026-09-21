<?php
require __DIR__ . '/includes/auth.php';
staff_require_desk('news');
$u = staff_user();
$file = dirname(staff_root()) . '/news-events.json';
$dir = dirname(staff_root()) . '/assets/news-events';

function ne_load($f) {
  if (!is_file($f)) return ['events' => [], 'news' => []];
  $j = json_decode(file_get_contents($f), true);
  if (!is_array($j)) $j = [];
  $j['events'] = isset($j['events']) && is_array($j['events']) ? $j['events'] : [];
  $j['news'] = isset($j['news']) && is_array($j['news']) ? $j['news'] : [];
  return $j;
}
function ne_save($f, $d) {
  $d['updated'] = date('Y-m-d H:i');
  return file_put_contents($f, json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !== false;
}
$data = ne_load($file);
$msg = '';
$err = '';

function ne_upload($dir, $input = 'image') {
  if (empty($_FILES[$input]['tmp_name']) || !is_uploaded_file($_FILES[$input]['tmp_name'])) return '';
  $ext = strtolower(pathinfo($_FILES[$input]['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, ['jpg','jpeg','png','webp'], true)) return false;
  if ($_FILES[$input]['size'] > 5 * 1024 * 1024) return false;
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $name = 'ne-' . date('Ymd-His') . '-' . mt_rand(100,999) . '.' . $ext;
  $dest = $dir . '/' . $name;
  if (!move_uploaded_file($_FILES[$input]['tmp_name'], $dest)) return false;
  return 'assets/news-events/' . $name;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  $kind = ($_POST['kind'] ?? '') === 'news' ? 'news' : 'events';

  if ($action === 'save') {
    $id = trim($_POST['id'] ?? '') ?: (strtoupper(substr($kind,0,2)) . '-' . time());
    $item = ['id' => $id, 'status' => ($_POST['status'] ?? 'live') === 'done' ? 'done' : 'live'];
    if ($kind === 'events') {
      $item += [
        'title' => trim($_POST['title'] ?? ''),
        'place' => trim($_POST['place'] ?? ''),
        'dates' => trim($_POST['dates'] ?? ''),
        'booth' => trim($_POST['booth'] ?? ''),
        'tag' => trim($_POST['tag'] ?? 'Meet us at'),
        'image' => trim($_POST['image'] ?? ''),
      ];
    } else {
      $item += [
        'title' => trim($_POST['title'] ?? ''),
        'kicker' => trim($_POST['kicker'] ?? ''),
        'date' => trim($_POST['date'] ?? ''),
        'summary' => trim($_POST['summary'] ?? ''),
        'link' => trim($_POST['link'] ?? ''),
        'image' => trim($_POST['image'] ?? ''),
      ];
    }
    $up = ne_upload($dir);
    if ($up === false) $err = 'Uploaded image must be JPG, PNG or WEBP under 5 MB.';
    elseif ($up) $item['image'] = $up;
    
    if ($item['title'] === '') {
      $err = $err ?: 'Title is required.';
    } else {
      $found = false;
      foreach ($data[$kind] as $i => $row) {
        if ($row['id'] === $id) { $data[$kind][$i] = $item; $found = true; break; }
      }
      if (!$found) $data[$kind][] = $item;
      ne_save($file, $data);
      header('Location: news.php?saved=1');
      exit;
    }
  }

  if ($action === 'done' || $action === 'live') {
    $id = $_POST['id'] ?? '';
    foreach ($data[$kind] as $i => $row) {
      if ($row['id'] === $id) $data[$kind][$i]['status'] = $action === 'done' ? 'done' : 'live';
    }
    ne_save($file, $data);
    header('Location: news.php?saved=1');
    exit;
  }

  if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $data[$kind] = array_values(array_filter($data[$kind], function ($row) use ($id) { return $row['id'] !== $id; }));
    ne_save($file, $data);
    header('Location: news.php?saved=1');
    exit;
  }
}

if (isset($_GET['saved'])) $msg = 'Successfully saved. Live items update immediately on the public website.';

$staff_title = 'News & Events';
require __DIR__ . '/includes/header.php';

$editE = $editN = null;
if (isset($_GET['edit']) && isset($_GET['kind'])) {
  $k = $_GET['kind'] === 'news' ? 'news' : 'events';
  foreach ($data[$k] as $row) {
    if ($row['id'] === $_GET['edit']) {
      if ($k === 'news') $editN = $row; else $editE = $row;
    }
  }
}

function ne_thumb($src) {
  if (!$src) return '<div style="width:90px;height:54px;background:#F1F5F9;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:11px;">No Image</div>';
  return '<img src="../'.htmlspecialchars($src).'" alt="" style="width:90px;height:54px;object-fit:cover;border-radius:6px;border:1px solid #E2E8F0;background:#eee">';
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
  <strong>News &amp; Events Desk:</strong> Manage company press updates and scheduled global exhibition appearances. 
  Items set to <strong>Live</strong> are immediately visible to the public. Items marked <strong>Done</strong> are archived.
</div>

<!-- ==================== SECTION 1: EVENTS ==================== -->
<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Global Conferences &amp; Events (<?php echo count($data['events']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Exhibitions, summits, and booth locations
      </div>
    </div>
    <a href="news.php#eventForm" class="btn btn-primary">+ Add New Event</a>
  </div>

  <div class="table-search-bar">
    <input type="text" placeholder="Search events by name, city, dates..." data-search-target="#eventsTable">
  </div>

  <table id="eventsTable">
    <thead>
      <tr>
        <th style="width:100px;">Banner</th>
        <th>Event Title</th>
        <th>Venue &amp; Dates</th>
        <th>Booth</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['events'] as $row): 
      $isLive = ($row['status'] ?? 'live') === 'live';
    ?>
      <tr>
        <td><?php echo ne_thumb($row['image'] ?? ''); ?></td>
        <td><strong style="color:var(--sp-text-main);"><?php echo htmlspecialchars($row['title']); ?></strong></td>
        <td>
          <div><?php echo htmlspecialchars($row['place'] ?? ''); ?></div>
          <div style="font-size:11.5px; color:#64748B;"><?php echo htmlspecialchars($row['dates'] ?? ''); ?></div>
        </td>
        <td><code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:12px;"><?php echo htmlspecialchars($row['booth'] ?? '—'); ?></code></td>
        <td>
          <span class="<?php echo $isLive ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isLive ? '● Live' : '○ Archived'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="news.php?kind=events&edit=<?php echo urlencode($row['id']); ?>#eventForm">Edit</a>
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="kind" value="events">
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
            <?php if ($isLive): ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" name="action" value="done">Archive</button>
            <?php else: ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px; color:#059669;" name="action" value="live">Make Live</button>
            <?php endif; ?>
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete" onclick="return confirm('Remove event <?php echo htmlspecialchars($row['title']); ?>?');">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['events']): ?><tr><td colspan="6" style="text-align:center; padding:24px; color:#64748B;">No events configured yet.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>

<div class="card" id="eventForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $editE ? ('Edit Event: ' . htmlspecialchars($editE['title'])) : 'Add New Conference Event'; ?></h2>
    <?php if ($editE): ?>
      <a class="btn btn-ghost" href="news.php" style="font-size:12px">Cancel Edit</a>
    <?php endif; ?>
  </div>
  
  <form method="post" enctype="multipart/form-data">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save">
    <input type="hidden" name="kind" value="events">
    <input type="hidden" name="image" value="<?php echo htmlspecialchars($editE['image'] ?? ''); ?>">
    
    <div class="row">
      <div>
        <label>Event ID</label>
        <input name="id" value="<?php echo htmlspecialchars($editE['id'] ?? ''); ?>" placeholder="e.g. EV-CPHI-2026 (leave blank to auto-create)">
      </div>
      <div>
        <label>Display Status</label>
        <select name="status">
          <option value="live" <?php echo (($editE['status']??'live')==='live')?'selected':''; ?>>Live (Visible on Public Website)</option>
          <option value="done" <?php echo (($editE['status']??'')==='done')?'selected':''; ?>>Archived / Done (Hidden)</option>
        </select>
      </div>
    </div>

    <label>Event Title</label>
    <input name="title" required value="<?php echo htmlspecialchars($editE['title'] ?? ''); ?>" placeholder="e.g. CPHI Milan 2026">

    <label>Venue / Location</label>
    <input name="place" value="<?php echo htmlspecialchars($editE['place'] ?? ''); ?>" placeholder="e.g. Fiera Milano, Milan, Italy">

    <div class="row">
      <div>
        <label>Dates</label>
        <input name="dates" value="<?php echo htmlspecialchars($editE['dates'] ?? ''); ?>" placeholder="e.g. 6 – 8 October, 2026">
      </div>
      <div>
        <label>Booth Details</label>
        <input name="booth" value="<?php echo htmlspecialchars($editE['booth'] ?? ''); ?>" placeholder="e.g. Hall 3, Booth 3F103">
      </div>
    </div>

    <div class="row">
      <div>
        <label>Tag / Badge Text</label>
        <input name="tag" value="<?php echo htmlspecialchars($editE['tag'] ?? 'Meet us at'); ?>" placeholder="e.g. Meet us at">
      </div>
      <div>
        <label style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span>Event Cover Photo</span>
          <span style="font-size:11px; font-weight:600; color:#2563EB; background:#EFF6FF; border:1px solid #BFDBFE; padding:2px 8px; border-radius:12px;">📐 16:9 (800 × 450 px ideal)</span>
        </label>
        <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
        <div style="font-size:11px; color:#64748B; margin-top:4px;">Recommended: 16:9 ratio, 800 × 450 px (Min 640 × 360 px), JPG/PNG/WEBP under 5 MB.</div>
      </div>
    </div>

    <?php if (!empty($editE['image'])): ?>
      <div style="margin-top:12px; display:flex; align-items:center; gap:12px;">
        <?php echo ne_thumb($editE['image']); ?>
        <span style="font-size:12px; color:#64748B;">Current image: <code><?php echo htmlspecialchars($editE['image']); ?></code></span>
      </div>
    <?php endif; ?>

    <p style="margin-top:22px;">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $editE ? 'Save Event Changes' : 'Publish Event'; ?>
      </button>
      <?php if ($editE): ?><a class="btn btn-ghost" href="news.php">Cancel</a><?php endif; ?>
    </p>
  </form>
</div>

<!-- ==================== SECTION 2: NEWS ==================== -->
<div class="card" style="margin-top:36px;">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Company News &amp; Updates (<?php echo count($data['news']); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Press releases, rating updates, and company announcements
      </div>
    </div>
    <a href="news.php#newsForm" class="btn btn-primary">+ Add New News Item</a>
  </div>

  <div class="table-search-bar">
    <input type="text" placeholder="Search news by headline, kicker, summary..." data-search-target="#newsTable">
  </div>

  <table id="newsTable">
    <thead>
      <tr>
        <th style="width:100px;">Photo</th>
        <th>Headline</th>
        <th>Category / Date</th>
        <th>Status</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($data['news'] as $row): 
      $isLive = ($row['status'] ?? 'live') === 'live';
    ?>
      <tr>
        <td><?php echo ne_thumb($row['image'] ?? ''); ?></td>
        <td>
          <div style="font-weight:600; color:var(--sp-text-main);"><?php echo htmlspecialchars($row['title']); ?></div>
          <div style="font-size:12px; color:var(--sp-text-muted); margin-top:3px; max-width:480px;">
            <?php echo htmlspecialchars(mb_strimwidth($row['summary'] ?? '', 0, 95, '...')); ?>
          </div>
        </td>
        <td>
          <div><span style="font-size:11px; font-weight:700; background:#EEF2FF; color:var(--sp-primary); padding:2px 6px; border-radius:4px;"><?php echo htmlspecialchars($row['kicker'] ?? 'Update'); ?></span></div>
          <div style="font-size:11.5px; color:#64748B; margin-top:4px;"><?php echo htmlspecialchars($row['date'] ?? 'Recent'); ?></div>
        </td>
        <td>
          <span class="<?php echo $isLive ? 'badge-open' : 'badge-closed'; ?>">
            <?php echo $isLive ? '● Live' : '○ Archived'; ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="news.php?kind=news&edit=<?php echo urlencode($row['id']); ?>#newsForm">Edit</a>
          <form method="post" style="display:inline">
            <?php echo staff_csrf_field(); ?>
            <input type="hidden" name="kind" value="news">
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
            <?php if ($isLive): ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" name="action" value="done">Archive</button>
            <?php else: ?>
              <button class="btn btn-ghost" style="padding:5px 9px; font-size:12px; color:#059669;" name="action" value="live">Make Live</button>
            <?php endif; ?>
            <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete" onclick="return confirm('Remove news item <?php echo htmlspecialchars($row['title']); ?>?');">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$data['news']): ?><tr><td colspan="5" style="text-align:center; padding:24px; color:#64748B;">No news published yet.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>

<div class="card" id="newsForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $editN ? ('Edit News: ' . htmlspecialchars($editN['title'])) : 'Publish Company News'; ?></h2>
    <?php if ($editN): ?>
      <a class="btn btn-ghost" href="news.php" style="font-size:12px">Cancel Edit</a>
    <?php endif; ?>
  </div>

  <form method="post" enctype="multipart/form-data">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="save">
    <input type="hidden" name="kind" value="news">
    <input type="hidden" name="image" value="<?php echo htmlspecialchars($editN['image'] ?? ''); ?>">
    
    <div class="row">
      <div>
        <label>News ID</label>
        <input name="id" value="<?php echo htmlspecialchars($editN['id'] ?? ''); ?>" placeholder="e.g. NW-CREDIT (leave blank to auto-create)">
      </div>
      <div>
        <label>Display Status</label>
        <select name="status">
          <option value="live" <?php echo (($editN['status']??'live')==='live')?'selected':''; ?>>Live (Visible on Public Website)</option>
          <option value="done" <?php echo (($editN['status']??'')==='done')?'selected':''; ?>>Archived / Done (Hidden)</option>
        </select>
      </div>
    </div>

    <label>Headline Title</label>
    <input name="title" required value="<?php echo htmlspecialchars($editN['title'] ?? ''); ?>" placeholder="e.g. Strong Credit Rating Affirmed">

    <div class="row">
      <div>
        <label>Kicker / Category Tag</label>
        <input name="kicker" value="<?php echo htmlspecialchars($editN['kicker'] ?? ''); ?>" placeholder="e.g. Company Update, Sustainability, R&D">
      </div>
      <div>
        <label>Date Label</label>
        <input name="date" value="<?php echo htmlspecialchars($editN['date'] ?? ''); ?>" placeholder="e.g. Recent, or Sep 2026">
      </div>
    </div>

    <label>Article Summary</label>
    <textarea name="summary" placeholder="Brief 2-3 sentence overview of this announcement..."><?php echo htmlspecialchars($editN['summary'] ?? ''); ?></textarea>

    <div class="row">
      <div>
        <label>Read More External Link (optional)</label>
        <input name="link" value="<?php echo htmlspecialchars($editN['link'] ?? ''); ?>" placeholder="https://…">
      </div>
      <div>
        <label style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span>Article Cover Photo</span>
          <span style="font-size:11px; font-weight:600; color:#2563EB; background:#EFF6FF; border:1px solid #BFDBFE; padding:2px 8px; border-radius:12px;">📐 16:9 (800 × 450 px ideal)</span>
        </label>
        <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
        <div style="font-size:11px; color:#64748B; margin-top:4px;">Recommended: 16:9 ratio, 800 × 450 px (Min 600 × 338 px), JPG/PNG/WEBP under 5 MB.</div>
      </div>
    </div>

    <?php if (!empty($editN['image'])): ?>
      <div style="margin-top:12px; display:flex; align-items:center; gap:12px;">
        <?php echo ne_thumb($editN['image']); ?>
        <span style="font-size:12px; color:#64748B;">Current image: <code><?php echo htmlspecialchars($editN['image']); ?></code></span>
      </div>
    <?php endif; ?>

    <p style="margin-top:22px;">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $editN ? 'Save News Changes' : 'Publish News Item'; ?>
      </button>
      <?php if ($editN): ?><a class="btn btn-ghost" href="news.php">Cancel</a><?php endif; ?>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
