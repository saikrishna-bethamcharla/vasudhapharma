<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
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
    'careers' => ['label' => 'Careers / HR', 'file' => 'jobs.php', 'icon' => 'briefcase'],
    'news' => ['label' => 'News & Events', 'file' => 'news.php', 'icon' => 'newspaper'],
    'foundation' => ['label' => 'Foundation', 'file' => 'foundation.php', 'icon' => 'heart'],
    'marketing' => ['label' => 'Marketing', 'file' => 'marketing.php', 'icon' => 'target'],
    'manufacturing' => ['label' => 'Manufacturing', 'file' => 'desk.php?d=manufacturing', 'icon' => 'factory'],
    'rnd' => ['label' => 'R&D', 'file' => 'desk.php?d=rnd', 'icon' => 'flask'],
    'ehs' => ['label' => 'EHS', 'file' => 'desk.php?d=ehs', 'icon' => 'shield'],
    'governance' => ['label' => 'Corporate Governance', 'file' => 'desk.php?d=governance', 'icon' => 'file-text'],
  ];
}
function staff_can($desk, $u = null) {
  $u = $u ?: staff_user();
  if (!$u) return false;
  if (($u['role'] ?? '') === 'admin') return true;
  if (($u['role'] ?? '') === 'hr' && $desk === 'careers') return true;
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
  foreach (staff_users() as $u) {
    if (strtolower($u['email']) !== $email) continue;
    $valid = (!empty($u['hash']) && password_verify($password, $u['hash'])) || (!empty($u['password']) && hash_equals($u['password'], $password));
    if (!$valid) return false;
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

  return [
    'jobs_total' => count($jobs),
    'jobs_open' => $openJobs,
    'jobs_closed' => $closedJobs,
    'events_total' => $eventsCount,
    'news_total' => $newsCount,
    'gallery_total' => $galCount,
    'users_total' => count($users),
  ];
}
