<?php
if (!isset($u)) $u = staff_user();
$desks = staff_desks();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($staff_title ?? 'Staff'); ?> | Vasudha Operations Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --sp-primary: #3D5CAD;
      --sp-primary-dark: #2E4A8A;
      --sp-primary-hover: #254696;
      --sp-primary-light: #EEF2FB;
      --sp-accent: #5B7AD4;
      --sp-accent-light: #7C9AE8;
      --sp-bg: #F4F7FC;
      --sp-card-bg: #FFFFFF;
      --sp-border: #E2E8F0;
      --sp-text-main: #0F172A;
      --sp-text-muted: #475569;
      --sp-success-bg: #ECFDF5;
      --sp-success-text: #059669;
      --sp-danger-bg: #FEF2F2;
      --sp-danger-text: #DC2626;
      --sp-warning-bg: #FFFBEB;
      --sp-warning-text: #D97706;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--sp-bg);
      color: var(--sp-text-main);
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
    }
    .staff-shimmer-bar {
      height: 3px;
      background: linear-gradient(90deg, #3D5CAD 0%, #5B7AD4 50%, #7C9AE8 100%);
      width: 100%;
    }
    header.staff-top {
      background: #FFFFFF;
      border-bottom: 1px solid var(--sp-border);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .staff-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }
    .staff-logo-hex {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(61,92,173,0.16);
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .staff-logo-hex img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .staff-brand-text strong {
      display: block;
      font-size: 15px;
      font-weight: 800;
      color: #C8102E;
      letter-spacing: 0.02em;
      line-height: 1.2;
    }
    .staff-brand-text span {
      display: block;
      font-size: 11px;
      font-style: italic;
      color: #0088AA;
      line-height: 1.2;
      margin-top: 1px;
    }
    .staff-brand-badge {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      background: var(--sp-primary-light);
      color: var(--sp-primary);
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.06em;
      border: 1px solid rgba(61,92,173,0.2);
      margin-left: 8px;
    }
    .staff-brand-badge {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      background: var(--sp-primary-light);
      color: var(--sp-primary);
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .staff-user-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--sp-text-muted);
    }
    .staff-avatar-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #F1F5F9;
      padding: 5px 12px;
      border-radius: 9999px;
      font-weight: 600;
      color: var(--sp-text-main);
      text-decoration: none;
      transition: background 0.15s;
    }
    .staff-avatar-pill:hover {
      background: #E2E8F0;
    }
    .staff-avatar-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
    }
    .staff-site-link {
      color: var(--sp-text-muted);
      text-decoration: none;
      font-size: 12.5px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .staff-site-link:hover {
      color: var(--sp-primary);
      background: var(--sp-primary-light);
    }
    .staff-logout-btn {
      color: var(--sp-danger-text);
      text-decoration: none;
      font-weight: 500;
      font-size: 12.5px;
      padding: 5px 10px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .staff-logout-btn:hover {
      background: var(--sp-danger-bg);
    }
    nav.staff-nav {
      background: #0F172A;
      padding: 6px 24px;
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    nav.staff-nav a {
      color: #94A3B8;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 13px;
      border-radius: 7px;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    nav.staff-nav a:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
    }
    nav.staff-nav a.on {
      color: #FFFFFF;
      background: var(--sp-primary);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 28px 24px 60px;
    }
    .card {
      background: var(--sp-card-bg);
      border-radius: 14px;
      padding: 24px 28px;
      margin-bottom: 22px;
      border: 1px solid var(--sp-border);
      box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.02);
    }
    h1, h2, h3 { color: var(--sp-text-main); font-weight: 700; letter-spacing: -0.02em; }
    label {
      display: block;
      font-size: 12.5px;
      font-weight: 600;
      color: #334155;
      margin: 14px 0 6px;
      letter-spacing: 0.01em;
    }
    input, textarea, select {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 13px;
      border: 1px solid var(--sp-border);
      border-radius: 8px;
      font: inherit;
      font-size: 13.5px;
      background: #FAFAFA;
      color: #0F172A;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--sp-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(37, 70, 150, 0.15);
    }
    textarea { min-height: 100px; resize: vertical; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .row-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    @media (max-width: 768px) { .row, .row-3 { grid-template-columns: 1fr; } }
    button, .btn {
      cursor: pointer;
      border: 0;
      border-radius: 8px;
      padding: 9px 18px;
      font-weight: 600;
      font-size: 13px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .btn-red, .btn-primary {
      background: var(--sp-primary);
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(37, 70, 150, 0.25);
    }
    .btn-red:hover, .btn-primary:hover {
      background: var(--sp-primary-hover);
      transform: translateY(-1px);
    }
    .btn-ghost {
      background: #F1F5F9;
      color: #334155;
      border: 1px solid var(--sp-border);
    }
    .btn-ghost:hover {
      background: #E2E8F0;
    }
    .btn-danger {
      background: var(--sp-danger-bg);
      color: var(--sp-danger-text);
      border: 1px solid #FECACA;
    }
    .btn-danger:hover {
      background: #FEE2E2;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 13.5px;
    }
    th {
      text-align: left;
      padding: 11px 14px;
      background: #F8FAFC;
      color: #475569;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--sp-border);
    }
    th:first-child { border-top-left-radius: 8px; }
    th:last-child { border-top-right-radius: 8px; }
    td {
      padding: 13px 14px;
      border-bottom: 1px solid var(--sp-border);
      vertical-align: middle;
      color: #1E293B;
    }
    tr:last-child td { border-bottom: 0; }
    tbody tr:hover { background: #F8FAFC; }
    .ok {
      background: var(--sp-success-bg);
      color: var(--sp-success-text);
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #A7F3D0;
      font-size: 13.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .err-box {
      background: var(--sp-danger-bg);
      color: var(--sp-danger-text);
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #FECACA;
      font-size: 13.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hint {
      font-size: 13px;
      color: var(--sp-text-muted);
      line-height: 1.6;
      background: #F1F5F9;
      border-left: 3px solid var(--sp-primary);
      padding: 12px 16px;
      border-radius: 4px;
    }
    .badge-open, .open {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      background: #DCFCE7;
      color: #15803D;
    }
    .badge-closed, .closed {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      background: #F1F5F9;
      color: #64748B;
    }
    .badge-live {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      background: #EFF6FF;
      color: #1D4ED8;
    }
    .stat-card {
      background: #FFFFFF;
      border: 1px solid var(--sp-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
    }
    .stat-num {
      font-size: 32px;
      font-weight: 800;
      color: var(--sp-primary);
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .stat-label {
      font-size: 12.5px;
      color: var(--sp-text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-sub {
      font-size: 12px;
      color: #94A3B8;
    }
    .table-search-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .table-search-bar input {
      max-width: 320px;
      background: #FFFFFF;
    }
  </style>
</head>
<body>
<div class="staff-shimmer-bar"></div>
<header class="staff-top">
  <div class="staff-brand">
    <div class="staff-logo-hex">
      <img src="../assets/vasudha-logo.jpg" alt="Vasudha Pharma Chem Limited">
    </div>
    <div class="staff-brand-text">
      <strong>VASUDHA PHARMA CHEM LIMITED</strong>
      <span>Contributing to affordable health care... &bull; <em>Since 1994</em></span>
    </div>
    <span class="staff-brand-badge">Operations Portal</span>
  </div>
  <div class="staff-user-meta">
    <a href="../careers.html" target="_blank" rel="noopener" class="staff-site-link" title="Open public Careers page in a new tab">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      <span>Public Careers</span>
    </a>
    <a href="../home.html" target="_blank" rel="noopener" class="staff-site-link" title="Open public website in a new tab">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      <span>Main Website</span>
    </a>
    <a href="profile.php" class="staff-avatar-pill" title="My Account / Change Password">
      <span class="staff-avatar-dot"></span>
      <span><?php echo htmlspecialchars($u['name'] ?? 'Staff'); ?></span>
      <span style="font-weight:400;color:#64748B;">(<?php echo htmlspecialchars($u['dept'] ?? 'Desk'); ?>)</span>
    </a>
    <a href="logout.php" class="staff-logout-btn">Log out</a>
  </div>
</header>
<nav class="staff-nav">
  <a href="home.php" class="<?php echo ($staff_title ?? '') === 'Home' ? 'on' : ''; ?>">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Home</span>
  </a>
  <?php foreach ($desks as $key => $d):
    if (!staff_can($key)) continue; 
    $active = ($staff_title ?? '') === $d['label'] ? 'on' : ''; ?>
    <a href="<?php echo htmlspecialchars($d['file']); ?>" class="<?php echo $active; ?>"><?php echo htmlspecialchars($d['label']); ?></a>
  <?php endforeach; ?>
  <?php if (($u['role'] ?? '') === 'admin'): ?>
    <a href="users.php" class="<?php echo ($staff_title ?? '') === 'Users' ? 'on' : ''; ?>">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <span>Users</span>
    </a>
  <?php endif; ?>
  <a href="profile.php" class="<?php echo ($staff_title ?? '') === 'My Account' ? 'on' : ''; ?>" style="margin-left:auto;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>Account</span>
  </a>
</nav>
<div class="wrap">
