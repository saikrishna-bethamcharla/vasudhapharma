<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
  ini_set('session.cookie_httponly', 1);
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', 1);
  }
  ini_set('session.use_only_cookies', 1);
  session_start();
}

function staff_root() {
  return dirname(__DIR__);
}
function staff_users_file() {
  return staff_root() . '/data/users.json';
}
function staff_jobs_file() {
  return dirname(staff_root()) . '/jobs.json';
}
function staff_users() {
  $f = staff_users_file();
  if (!is_file($f)) return [];
  $j = json_decode(file_get_contents($f), true);
  return is_array($j) ? $j : [];
}
function staff_save_users($list) {
  return file_put_contents(staff_users_file(), json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) !== false;
}
function staff_user() {
  return isset($_SESSION['staff']) ? $_SESSION['staff'] : null;
}
function staff_require_login() {
  if (!staff_user()) {
    header('Location: index.php');
    exit;
  }
}
function staff_desks() {
  return [
    'marketing'  => ['label' => 'Marketing & Products', 'file' => 'marketing.php', 'icon' => 'tag'],
    'careers'    => ['label' => 'Careers / HR', 'file' => 'jobs.php', 'icon' => 'briefcase'],
    'foundation' => ['label' => 'Foundation', 'file' => 'foundation.php', 'icon' => 'heart'],
    'news'       => ['label' => 'News & Events', 'file' => 'news.php', 'icon' => 'newspaper'],
    'feedback'   => ['label' => 'Feedback Desk', 'file' => 'feedback.php', 'icon' => 'inbox'],
  ];
}
function staff_can($desk, $u = null) {
  $u = $u ?: staff_user();
  if (!$u) return false;
  if (($u['role'] ?? '') === 'admin') return true;
  if (($u['role'] ?? '') === 'hr' && $desk === 'careers') return true;
  if (($u['role'] ?? '') === 'marketing' && $desk === 'marketing') return true;
  return ($u['dept'] ?? '') === $desk;
}
function staff_can_jobs($u = null) {
  return staff_can('careers', $u);
}
function staff_require_desk($desk) {
  staff_require_login();
  if (!staff_can($desk)) {
    http_response_code(403);
    echo 'You do not have permission to access this department desk.';
    exit;
  }
}
function staff_login($email, $password) {
  $email = strtolower(trim($email));
  if (!$email || !$password) return false;
  foreach (staff_users() as $u) {
    $match = strtolower($u['email']) === $email || (!empty($u['alias']) && strtolower($u['alias']) === $email);
    if (!$match) continue;
    $valid = !empty($u['hash']) && password_verify($password, $u['hash']);
    if (!$valid) continue;
    session_regenerate_id(true);
    $_SESSION['staff'] = [
      'email' => $u['email'],
      'name'  => $u['name'],
      'role'  => $u['role'],
      'dept'  => $u['dept'],
    ];
    return true;
  }
  return false;
}
function staff_logout() {
  $_SESSION = [];
  if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
  }
  session_destroy();
}

/* CSRF Protection */
function staff_csrf_token() {
  if (empty($_SESSION['staff_csrf'])) {
    $_SESSION['staff_csrf'] = bin2hex(random_bytes(32));
  }
  return $_SESSION['staff_csrf'];
}
function staff_csrf_field() {
  return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(staff_csrf_token()) . '">';
}
function staff_verify_csrf() {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!$token || empty($_SESSION['staff_csrf']) || !hash_equals($_SESSION['staff_csrf'], $token)) {
      http_response_code(403);
      die('Security validation failed: Invalid or expired CSRF token. Please return to the previous page, refresh, and try again.');
    }
  }
}

/* Self-Service Profile Update */
function staff_update_profile($email, $name, $currentPassword, $newPassword = '') {
  $email = strtolower(trim($email));
  $list = staff_users();
  foreach ($list as $i => $u) {
    if (strtolower($u['email']) === $email) {
      if (!password_verify($currentPassword, $u['hash'])) {
        return ['ok' => false, 'error' => 'Current password is incorrect.'];
      }
      $list[$i]['name'] = trim($name) ?: $u['name'];
      if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
          return ['ok' => false, 'error' => 'New password must be at least 6 characters long.'];
        }
        $list[$i]['hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
      }
      if (staff_save_users($list)) {
        $_SESSION['staff']['name'] = $list[$i]['name'];
        return ['ok' => true];
      }
      return ['ok' => false, 'error' => 'Failed to write users data. Check file permissions.'];
    }
  }
  return ['ok' => false, 'error' => 'User account could not be found.'];
}

/* Password Reset & OTP Helpers */
function staff_password_resets_file() {
  return staff_root() . '/data/password_resets.json';
}

function staff_load_password_resets() {
  $f = staff_password_resets_file();
  if (!is_file($f)) return [];
  $j = json_decode(file_get_contents($f), true);
  if (!is_array($j)) return [];
  $now = time();
  $valid = [];
  foreach ($j as $item) {
    if (!empty($item['expires_at']) && $item['expires_at'] > $now) {
      $valid[] = $item;
    }
  }
  return $valid;
}

function staff_save_password_resets($list) {
  return file_put_contents(staff_password_resets_file(), json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) !== false;
}

function staff_find_user($identifier, $dept = '') {
  $id = strtolower(trim($identifier));
  if (!$id) return null;
  $users = staff_users();
  // 1. Exact alias match (unique per department)
  foreach ($users as $u) {
    if (!empty($u['alias']) && strtolower($u['alias']) === $id) {
      return $u;
    }
  }
  // 2. Email + Dept match
  if ($dept) {
    foreach ($users as $u) {
      if (strtolower($u['email']) === $id && ($u['dept'] ?? '') === $dept) {
        return $u;
      }
    }
  }
  // 3. Fallback: match by email
  foreach ($users as $u) {
    if (strtolower($u['email']) === $id) {
      return $u;
    }
  }
  return null;
}

function staff_send_reset_otp($identifier, $dept = '') {
  $user = staff_find_user($identifier, $dept);
  if (!$user) {
    return ['ok' => false, 'error' => 'No active staff account found matching that email or department.'];
  }

  $resets = staff_load_password_resets();
  $userKey = strtolower($user['alias'] ?: ($user['email'] . ':' . ($user['dept'] ?? 'admin')));

  // Rate limiting: 45 seconds between requests
  foreach ($resets as $r) {
    if (($r['user_key'] ?? '') === $userKey && (time() - ($r['created_at'] ?? 0)) < 45) {
      $wait = 45 - (time() - $r['created_at']);
      return ['ok' => false, 'error' => "A code was recently sent. Please wait {$wait}s before requesting a new one."];
    }
  }

  // Purge any prior code for this user
  $resets = array_filter($resets, function($r) use ($userKey) {
    return ($r['user_key'] ?? '') !== $userKey;
  });

  $otp = sprintf("%06d", mt_rand(100000, 999999));
  $now = time();
  $expiresAt = $now + 900; // 15 mins

  $record = [
    'user_key'   => $userKey,
    'email'      => $user['email'],
    'alias'      => $user['alias'] ?? '',
    'name'       => $user['name'],
    'dept'       => $user['dept'] ?? '',
    'otp'        => $otp,
    'otp_hash'   => password_hash($otp, PASSWORD_DEFAULT),
    'attempts'   => 0,
    'created_at' => $now,
    'expires_at' => $expiresAt,
  ];

  $resets[] = $record;
  staff_save_password_resets($resets);

  // Send HTML Email via PHP mail()
  $to = $user['email'];
  $subject = 'Vasudha Operations Portal - Password Reset Code [' . $otp . ']';

  $htmlBody = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #f4fbf7; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 19px; font-weight: 800; color: #096b51; letter-spacing: 0.5px; text-transform: uppercase; }
    .sub { font-size: 12px; color: #0e8f6c; margin-top: 4px; font-style: italic; }
    .code-box { background: #ecfdf5; border: 1.5px dashed #0e8f6c; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 36px; font-weight: 800; color: #096b51; letter-spacing: 8px; font-family: monospace; }
    .expiry { font-size: 12px; color: #047857; margin-top: 8px; font-weight: 600; }
    .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #64748b; line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Vasudha Operations Portal</div>
      <div class="sub">Vasudha Pharma Chem Limited &bull; Hyderabad, India</div>
    </div>
    <h2 style="font-size: 18px; margin: 0 0 12px; color: #0f172a;">Password Reset Verification</h2>
    <p style="font-size: 14px; line-height: 1.5; color: #334155; margin: 0 0 16px;">
      Hello <strong>' . htmlspecialchars($user['name']) . '</strong>,
    </p>
    <p style="font-size: 13.5px; line-height: 1.5; color: #475569; margin: 0 0 16px;">
      A request was received to reset the password for your <strong>' . htmlspecialchars(ucfirst($user['dept'] ?? 'Operations')) . '</strong> staff account (' . htmlspecialchars($user['email']) . ').
    </p>
    <div class="code-box">
      <div class="otp-code">' . $otp . '</div>
      <div class="expiry">This verification code expires in 15 minutes.</div>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0 0 12px;">
      Enter this 6-digit code on the password reset screen to verify your identity and set a new password.
    </p>
    <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0;">
      If you did not request a password reset, please disregard this message. Your current password remains secure and unchanged.
    </p>
    <div class="footer">
      Vasudha Pharma Chem Limited &bull; Operations &amp; Technology Desk<br>
      Plot 78/A, Vengalrao Nagar, Hyderabad - 500 038, Telangana, India
    </div>
  </div>
</body>
</html>';

  $domain = $_SERVER['SERVER_NAME'] ?? 'vasudhapharma.com';
  $headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Vasudha Operations Security <noreply@' . $domain . '>',
    'Reply-To: wisdom@vasudhapharma.com',
    'X-Mailer: PHP/' . phpversion(),
  ];

  $mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));

  return [
    'ok'        => true,
    'user_key'  => $userKey,
    'email'     => $user['email'],
    'alias'     => $user['alias'] ?? '',
    'name'      => $user['name'],
    'dept'      => $user['dept'] ?? '',
    'otp'       => $otp,
    'mail_sent' => $mailSent,
  ];
}

function staff_verify_reset_otp($userKey, $otp) {
  $otp = trim($otp);
  if (!$otp || strlen($otp) !== 6) {
    return ['ok' => false, 'error' => 'Verification code must be exactly 6 digits.'];
  }

  $resets = staff_load_password_resets();
  $found = null;
  $foundIdx = null;

  foreach ($resets as $idx => $r) {
    if (($r['user_key'] ?? '') === $userKey) {
      $found = $r;
      $foundIdx = $idx;
      break;
    }
  }

  if (!$found) {
    return ['ok' => false, 'error' => 'No active password reset request found. Please request a new code.'];
  }

  if (time() > ($found['expires_at'] ?? 0)) {
    unset($resets[$foundIdx]);
    staff_save_password_resets($resets);
    return ['ok' => false, 'error' => 'This verification code has expired. Please request a new code.'];
  }

  if (($found['attempts'] ?? 0) >= 5) {
    unset($resets[$foundIdx]);
    staff_save_password_resets($resets);
    return ['ok' => false, 'error' => 'Too many invalid attempts. For security, please request a new verification code.'];
  }

  $matches = ($otp === ($found['otp'] ?? '')) || (!empty($found['otp_hash']) && password_verify($otp, $found['otp_hash']));
  if (!$matches) {
    $resets[$foundIdx]['attempts'] = ($resets[$foundIdx]['attempts'] ?? 0) + 1;
    staff_save_password_resets($resets);
    $left = 5 - $resets[$foundIdx]['attempts'];
    return ['ok' => false, 'error' => "Invalid verification code. {$left} attempt(s) remaining."];
  }

  return ['ok' => true, 'record' => $found];
}

function staff_complete_password_reset($userKey, $otp, $newPassword) {
  $check = staff_verify_reset_otp($userKey, $otp);
  if (!$check['ok']) {
    return $check;
  }

  if (strlen($newPassword) < 6) {
    return ['ok' => false, 'error' => 'New password must be at least 6 characters long.'];
  }

  $record = $check['record'];
  $users = staff_users();
  $updated = false;

  foreach ($users as $i => $u) {
    $matchAlias = !empty($record['alias']) && !empty($u['alias']) && strtolower($u['alias']) === strtolower($record['alias']);
    $matchEmailDept = strtolower($u['email']) === strtolower($record['email']) && ($u['dept'] ?? '') === ($record['dept'] ?? '');
    if ($matchAlias || $matchEmailDept) {
      $users[$i]['hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
      $updated = true;
      break;
    }
  }

  if (!$updated) {
    return ['ok' => false, 'error' => 'Matching staff user record could not be updated.'];
  }

  if (!staff_save_users($users)) {
    return ['ok' => false, 'error' => 'Failed to save updated credentials to database.'];
  }

  // Remove reset record
  $resets = staff_load_password_resets();
  $resets = array_filter($resets, function($r) use ($userKey) {
    return ($r['user_key'] ?? '') !== $userKey;
  });
  staff_save_password_resets($resets);

  return ['ok' => true];
}

/* Data File Helpers */
function staff_load_jobs() {
  $f = staff_jobs_file();
  if (!is_file($f)) return ['updated' => date('Y-m-d'), 'jobs' => []];
  $j = json_decode(file_get_contents($f), true);
  if (!is_array($j)) $j = ['jobs' => []];
  if (!isset($j['jobs']) || !is_array($j['jobs'])) $j['jobs'] = [];
  return $j;
}
function staff_save_jobs($data) {
  $data['updated'] = date('Y-m-d');
  $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if ($json === false) return false;
  return file_put_contents(staff_jobs_file(), $json) !== false;
}
function staff_desk_file($desk) {
  $desk = preg_replace('/[^a-z]/', '', strtolower($desk));
  return staff_root() . '/data/' . $desk . '.json';
}
function staff_load_desk($desk) {
  $f = staff_desk_file($desk);
  if (!is_file($f)) return ['updated' => '', 'body' => '', 'items' => []];
  $j = json_decode(file_get_contents($f), true);
  return is_array($j) ? $j : ['body' => '', 'items' => []];
}
function staff_save_desk($desk, $data) {
  $data['updated'] = date('Y-m-d H:i');
  return file_put_contents(staff_desk_file($desk), json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !== false;
}

/* Operations Statistics Helper */
function staff_portal_stats() {
  $jobsData = staff_load_jobs();
  $jobs = $jobsData['jobs'] ?? [];
  $openJobs = 0;
  $closedJobs = 0;
  foreach ($jobs as $j) {
    if (($j['status'] ?? 'open') === 'open') $openJobs++;
    else $closedJobs++;
  }

  $neFile = dirname(staff_root()) . '/news-events.json';
  $eventsCount = 0;
  $newsCount = 0;
  if (is_file($neFile)) {
    $ne = json_decode(file_get_contents($neFile), true);
    if (is_array($ne)) {
      $eventsCount = count($ne['events'] ?? []);
      $newsCount = count($ne['news'] ?? []);
    }
  }

  $galFile = dirname(staff_root()) . '/foundation-galleries.json';
  $galCount = 0;
  if (is_file($galFile)) {
    $gal = json_decode(file_get_contents($galFile), true);
    if (is_array($gal)) {
      $galCount = count($gal['vasudha'] ?? []) + count($gal['vrrv'] ?? []) + count($gal['moments'] ?? []);
    }
  }

  $users = staff_users();

  $fbFile = staff_root() . '/data/feedback.json';
  $fbTotal = 0;
  $fbOpen = 0;
  if (is_file($fbFile)) {
    $fb = json_decode(file_get_contents($fbFile), true);
    if (is_array($fb)) {
      $fbTotal = count($fb);
      foreach ($fb as $item) {
        $st = $item['status'] ?? 'Open';
        if ($st === 'Open' || $st === 'In Progress') $fbOpen++;
      }
    }
  }

  return [
    'jobs_total'     => count($jobs),
    'jobs_open'      => $openJobs,
    'jobs_closed'    => $closedJobs,
    'events_total'   => $eventsCount,
    'news_total'     => $newsCount,
    'gallery_total'  => $galCount,
    'users_total'    => count($users),
    'feedback_total' => $fbTotal,
    'feedback_open'  => $fbOpen,
  ];
}
