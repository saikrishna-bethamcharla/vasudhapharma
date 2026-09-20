<?php
require __DIR__ . '/includes/auth.php';
staff_require_login();
$u = staff_user();
if (($u['role'] ?? '') !== 'admin') { 
  http_response_code(403); 
  echo 'Admin only.'; 
  exit; 
}

$msg = '';
$err = '';
$list = staff_users();
$desks = staff_desks();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  staff_verify_csrf();
  $action = $_POST['action'] ?? '';
  
  if ($action === 'add') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $name = trim($_POST['name'] ?? '');
    $dept = trim($_POST['dept'] ?? 'careers');
    $role = $dept === 'admin' ? 'admin' : ($dept === 'careers' ? 'hr' : 'user');
    $pass = $_POST['password'] ?? '';

    // Check duplicate email
    $duplicate = false;
    foreach ($list as $usr) {
      if (strtolower($usr['email']) === $email) {
        $duplicate = true;
        break;
      }
    }

    if (!$email || !$name) {
      $err = 'Full name and email are required.';
    } elseif ($duplicate) {
      $err = 'A user with this email address already exists.';
    } elseif (strlen($pass) < 6) {
      $err = 'Temporary password must be at least 6 characters.';
    } else {
      $list[] = [
        'email' => $email,
        'name' => $name,
        'role' => $role,
        'dept' => $dept === 'admin' ? 'admin' : $dept,
        'hash' => password_hash($pass, PASSWORD_DEFAULT),
      ];
      staff_save_users($list);
      $msg = 'Staff account for ' . htmlspecialchars($name) . ' was successfully created.';
    }
  }

  if ($action === 'update') {
    $old = strtolower(trim($_POST['old_email'] ?? ''));
    $email = strtolower(trim($_POST['email'] ?? ''));
    $name = trim($_POST['name'] ?? '');
    $dept = trim($_POST['dept'] ?? 'careers');
    $role = $dept === 'admin' ? 'admin' : ($dept === 'careers' ? 'hr' : 'user');
    $pass = $_POST['password'] ?? '';
    
    // Prevent admin from removing their own admin privilege
    if ($old === strtolower($u['email']) && $dept !== 'admin') {
      $err = 'You cannot demote your own administrator account.';
    } else {
      $ok = false;
      foreach ($list as $i => $row) {
        if (strtolower($row['email']) !== $old) continue;
        $list[$i]['email'] = $email ?: $row['email'];
        $list[$i]['name'] = $name ?: $row['name'];
        $list[$i]['dept'] = $dept === 'admin' ? 'admin' : $dept;
        $list[$i]['role'] = $role;
        if (!empty($pass)) {
          if (strlen($pass) < 6) {
            $err = 'New password must be at least 6 characters.';
            $ok = false;
            break;
          }
          $list[$i]['hash'] = password_hash($pass, PASSWORD_DEFAULT);
        }
        $ok = true;
        if ($old === strtolower($u['email'])) {
          $_SESSION['staff']['email'] = $list[$i]['email'];
          $_SESSION['staff']['name'] = $list[$i]['name'];
          $_SESSION['staff']['dept'] = $list[$i]['dept'];
          $_SESSION['staff']['role'] = $list[$i]['role'];
        }
      }
      if ($ok) {
        staff_save_users($list);
        $msg = 'User details successfully updated.';
      } elseif (!$err) {
        $err = 'User record not found.';
      }
    }
  }

  if ($action === 'delete') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    if ($email === strtolower($u['email'])) {
      $err = 'You cannot delete your own active login session.';
    } else {
      $list = array_values(array_filter($list, function ($x) use ($email) {
        return strtolower($x['email']) !== $email;
      }));
      staff_save_users($list);
      $msg = 'Staff member login removed.';
    }
  }
}

$edit = null;
if (isset($_GET['edit'])) {
  foreach ($list as $row) {
    if (strtolower($row['email']) === strtolower($_GET['edit'])) { $edit = $row; break; }
  }
}

$staff_title = 'Users';
require __DIR__ . '/includes/header.php';
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
  <strong>Access Control Management:</strong> Administrators can grant staff access to specific department desks. Users assigned to a desk can only view and edit their department's data.
</div>

<div class="card">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
    <div>
      <h2 style="margin:0; font-size:18px;">Staff Logins (<?php echo count($list); ?>)</h2>
      <div style="font-size:12.5px; color:var(--sp-text-muted); margin-top:2px;">
        Registered internal portal users
      </div>
    </div>
    <a href="users.php#userForm" class="btn btn-primary" onclick="document.getElementById('userNameInput').focus();">+ Add New Staff</a>
  </div>

  <div class="table-search-bar">
    <input type="text" placeholder="Search users by name, email, or desk..." data-search-target="#usersTable">
    <span style="font-size:12px; color:var(--sp-text-muted);">Quick filter</span>
  </div>

  <table id="usersTable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Department Desk</th>
        <th>Role Level</th>
        <th style="text-align:right">Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($list as $row): 
      $isSelf = strtolower($row['email']) === strtolower($u['email']);
      $deptKey = $row['dept'] ?? 'careers';
      $deskLabel = $deptKey === 'admin' ? 'All Desks (Administrator)' : ($desks[$deptKey]['label'] ?? ucfirst($deptKey));
    ?>
      <tr>
        <td>
          <div style="font-weight:600; color:var(--sp-text-main);">
            <?php echo htmlspecialchars($row['name']); ?>
            <?php if ($isSelf): ?>
              <span style="font-size:11px; background:#EEF2FF; color:var(--sp-primary); padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:600;">You</span>
            <?php endif; ?>
          </div>
        </td>
        <td><code><?php echo htmlspecialchars($row['email']); ?></code></td>
        <td>
          <span style="font-weight:500;"><?php echo htmlspecialchars($deskLabel); ?></span>
        </td>
        <td>
          <span style="text-transform:uppercase; font-size:11px; font-weight:700; letter-spacing:0.04em; background:<?php echo ($row['role'] === 'admin') ? '#EEF2FF' : '#F1F5F9'; ?>; color:<?php echo ($row['role'] === 'admin') ? 'var(--sp-primary)' : '#475569'; ?>; padding:3px 8px; border-radius:6px;">
            <?php echo htmlspecialchars($row['role']); ?>
          </span>
        </td>
        <td style="text-align:right; white-space:nowrap;">
          <a class="btn btn-ghost" style="padding:5px 9px; font-size:12px;" href="users.php?edit=<?php echo urlencode($row['email']); ?>#userForm">Edit</a>
          <?php if (!$isSelf): ?>
            <form method="post" style="display:inline" onsubmit="return confirm('Permanently remove access for <?php echo htmlspecialchars($row['name']); ?> (<?php echo htmlspecialchars($row['email']); ?>)?');">
              <?php echo staff_csrf_field(); ?>
              <input type="hidden" name="email" value="<?php echo htmlspecialchars($row['email']); ?>">
              <button class="btn btn-danger" style="padding:5px 9px; font-size:12px;" name="action" value="delete">Remove</button>
            </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>

<div class="card" id="userForm">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
    <h2 style="margin:0; font-size:18px;"><?php echo $edit ? ('Edit Staff: ' . htmlspecialchars($edit['name'])) : 'Add New Staff Member'; ?></h2>
    <?php if ($edit): ?>
      <a class="btn btn-ghost" href="users.php" style="font-size:12px">Cancel Edit</a>
    <?php endif; ?>
  </div>
  
  <form method="post">
    <?php echo staff_csrf_field(); ?>
    <input type="hidden" name="action" value="<?php echo $edit ? 'update' : 'add'; ?>">
    <input type="hidden" name="old_email" value="<?php echo htmlspecialchars($edit['email'] ?? ''); ?>">
    
    <div class="row">
      <div>
        <label>Full Name</label>
        <input id="userNameInput" name="name" required placeholder="e.g. John Doe" value="<?php echo htmlspecialchars($edit['name'] ?? ''); ?>">
      </div>
      <div>
        <label>Corporate Email Address</label>
        <input type="email" name="email" required placeholder="name@vasudha.local" value="<?php echo htmlspecialchars($edit['email'] ?? ''); ?>">
      </div>
    </div>

    <div class="row">
      <div>
        <label>Assigned Department Desk</label>
        <select name="dept">
          <option value="admin" <?php echo (($edit['dept'] ?? '')==='admin')?'selected':''; ?>>Administrator (Access to All Desks &amp; User Control)</option>
          <optgroup label="Department Specific Desks">
            <?php foreach ($desks as $k => $d): ?>
              <option value="<?php echo htmlspecialchars($k); ?>" <?php echo (($edit['dept'] ?? '')===$k)?'selected':''; ?>>
                <?php echo htmlspecialchars($d['label']); ?> Desk
              </option>
            <?php endforeach; ?>
          </optgroup>
        </select>
      </div>
      <div>
        <label><?php echo $edit ? 'Reset Password (leave blank to keep current)' : 'Temporary Initial Password'; ?></label>
        <input name="password" type="password" <?php echo $edit ? '' : 'required'; ?> minlength="6" placeholder="At least 6 characters">
      </div>
    </div>

    <p style="margin-top:22px">
      <button class="btn btn-primary" type="submit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        <?php echo $edit ? 'Save User Changes' : 'Create Staff Login'; ?>
      </button>
      <?php if ($edit): ?>
        <a class="btn btn-ghost" href="users.php">Cancel</a>
      <?php endif; ?>
    </p>
  </form>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
