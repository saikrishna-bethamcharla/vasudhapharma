<?php
require __DIR__ . '/includes/auth.php';
if (staff_user()) {
  header('Location: home.php');
  exit;
}
$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $ok = staff_login($_POST['email'] ?? '', $_POST['password'] ?? '');
  if ($ok) {
    header('Location: home.php');
    exit;
  }
  $err = 'Invalid email or password. Please verify your credentials and try again.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Staff Login | Vasudha Operations Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --sp-primary: #0E8F6C;
      --sp-primary-dark: #096B51;
      --sp-primary-hover: #075E46;
      --sp-primary-light: #ECFDF5;
      --sp-bg: #F4FBF7;
      --sp-card-bg: #FFFFFF;
      --sp-border: #E2E8F0;
      --sp-text-main: #0F172A;
      --sp-text-muted: #556987;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 15%, #ECFDF5 0%, #F4FBF7 85%);
      color: var(--sp-text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }
    .box {
      width: 100%;
      max-width: 440px;
      background: var(--sp-card-bg);
      padding: 38px 36px;
      border-radius: 20px;
      border: 1px solid var(--sp-border);
      box-shadow: 0 24px 50px -12px rgba(14, 143, 108, 0.12), 0 0 0 1px rgba(14, 143, 108, 0.04);
    }
    .brand-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
    }
    .brand-logo-hex {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 6px 18px rgba(14, 143, 108, 0.15);
      overflow: hidden;
      padding: 6px;
    }
    .brand-logo-hex img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 19px;
      font-weight: 800;
      color: var(--sp-primary-dark);
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 12px;
      color: #0E8F6C;
      font-style: italic;
      margin: 0 0 8px;
    }
    p.lead {
      margin: 0 0 20px;
      color: var(--sp-text-muted);
      font-size: 13px;
      line-height: 1.5;
    }
    .quick-logins {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .btn-quick {
      background: #ECFDF5;
      color: var(--sp-primary-dark);
      border: 1px solid #A7F3D0;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s;
    }
    .btn-quick:hover {
      background: #D1FAE5;
      border-color: var(--sp-primary);
    }
    label {
      display: block;
      font-size: 12.5px;
      font-weight: 600;
      color: #334155;
      margin: 14px 0 6px;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 14px;
      border: 1px solid var(--sp-border);
      border-radius: 9px;
      font: inherit;
      font-size: 14px;
      background: #FAFAFA;
      transition: all 0.15s ease;
    }
    input:focus {
      outline: none;
      border-color: var(--sp-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(14, 143, 108, 0.18);
    }
    button[type="submit"] {
      margin-top: 22px;
      width: 100%;
      background: linear-gradient(135deg, var(--sp-primary) 0%, var(--sp-primary-dark) 100%);
      color: #fff;
      border: 0;
      border-radius: 9px;
      padding: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(14, 143, 108, 0.25);
      transition: all 0.15s ease;
    }
    button[type="submit"]:hover {
      background: linear-gradient(135deg, var(--sp-primary-hover) 0%, #064E3B 100%);
      transform: translateY(-1px);
    }
    .err {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
      padding: 12px 14px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hint {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid var(--sp-border);
      font-size: 12px;
      color: var(--sp-text-muted);
      line-height: 1.5;
    }
    .hint code {
      background: #ECFDF5;
      padding: 2px 5px;
      border-radius: 4px;
      color: var(--sp-primary-dark);
      font-weight: 600;
    }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 16px;
      font-size: 12.5px;
      color: var(--sp-text-muted);
      text-decoration: none;
      transition: color 0.15s;
    }
    .back-link:hover {
      color: var(--sp-primary);
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="brand-header">
      <div class="brand-logo-hex">
        <img src="../assets/vasudha-logo.jpg" alt="Vasudha Pharma">
      </div>
      <h1>Vasudha Operations Portal</h1>
      <div class="brand-sub">Contributing to affordable health care... &bull; Since 1994</div>
      <p class="lead">Internal management &amp; department operations gateway.</p>
    </div>

    <?php if ($err): ?>
      <div class="err">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><?php echo htmlspecialchars($err); ?></span>
      </div>
    <?php endif; ?>

    <div style="margin-bottom:16px;">
      <div style="font-size:11.5px; font-weight:700; color:var(--sp-primary-dark); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
        <span>🧪 Testing Mode: 1-Click Autofill</span>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; margin-bottom:10px;">
        <button type="button" class="btn-quick" onclick="onSelectDept('admin')" id="btn-admin">👑 Admin</button>
        <button type="button" class="btn-quick" onclick="onSelectDept('hr')" id="btn-hr">👥 HR (Careers)</button>
        <button type="button" class="btn-quick" onclick="onSelectDept('marketing')" id="btn-marketing">💼 Marketing</button>
        <button type="button" class="btn-quick" onclick="onSelectDept('foundation')" id="btn-foundation">🤝 Foundation</button>
        <button type="button" class="btn-quick" onclick="onSelectDept('news')" id="btn-news">📰 News &amp; PR</button>
        <button type="button" class="btn-quick" onclick="onSelectDept('dev')" id="btn-dev">💻 Lead Dev</button>
      </div>

      <label style="margin-top:0;">Or Select from Dropdown</label>
      <select id="deptSelect" onchange="onSelectDept(this.value)" style="width:100%; box-sizing:border-box; padding:11px 14px; border:1px solid var(--sp-border); border-radius:9px; font:inherit; font-size:13.5px; background:#FAFAFA; color:var(--sp-text-main);">
        <option value="">-- Choose Department Account --</option>
        <option value="admin">VPCL Operations Admin (All Desks)</option>
        <option value="marketing">Marketing Desk (Products &amp; Commercial Portfolio)</option>
        <option value="hr">HR &amp; Talent Acquisition (Careers)</option>
        <option value="foundation">Vasudha Foundation CSR</option>
        <option value="news">Corporate Media &amp; PR (News &amp; Events)</option>
        <option value="dev">Lead Developer (Root Admin)</option>
      </select>
    </div>

    <form method="post" autocomplete="on">
      <label>Corporate Email Address</label>
      <input id="emailInput" type="email" name="email" placeholder="wisdom@vasudhapharma.com" value="wisdom@vasudhapharma.com" required autofocus>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; margin-bottom:6px;">
        <label style="margin:0;">Department Password</label>
        <a href="forgot-password.php" style="font-size:12px; color:var(--sp-primary); text-decoration:none; font-weight:600;">Forgot Password?</a>
      </div>
      <input id="passInput" type="password" name="password" placeholder="Enter assigned password" value="Vasudha@Admin2026!" required>
      <button type="submit">Sign in to Operations Desk &rarr;</button>
    </form>

    <div class="hint" style="text-align:center;">
      🔒 <strong>Testing Mode Enabled:</strong> All accounts accept <code>wisdom@vasudhapharma.com</code>. Department passwords auto-fill above.
    </div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:12.5px;">
      <a href="../home.html" style="color:var(--sp-text-muted); text-decoration:none;">&larr; Public Website</a>
      <a href="forgot-password.php" style="color:var(--sp-primary); text-decoration:none; font-weight:600;">🔑 Reset via OTP</a>
      <a href="../feedback.html" style="color:#0088AA; text-decoration:none;">📝 Testing Feedback</a>
    </div>
  </div>

  <script>
    const DEPT_PASSWORDS = {
      admin: 'Vasudha@Admin2026!',
      marketing: 'Vasudha@Marketing2026!',
      hr: 'Vasudha@HR2026!',
      foundation: 'Vasudha@CSR2026!',
      news: 'Vasudha@News2026!',
      dev: 'Vasudha@Dev2026!'
    };
    function onSelectDept(dept) {
      if (!dept) return;
      document.getElementById('emailInput').value = 'wisdom@vasudhapharma.com';
      const pass = document.getElementById('passInput');
      if (DEPT_PASSWORDS[dept]) pass.value = DEPT_PASSWORDS[dept];
      const sel = document.getElementById('deptSelect');
      if (sel) sel.value = dept;

      document.querySelectorAll('.btn-quick').forEach(b => {
        b.style.borderColor = '#A7F3D0';
        b.style.background = '#ECFDF5';
      });
      const activeBtn = document.getElementById('btn-' + dept);
      if (activeBtn) {
        activeBtn.style.borderColor = 'var(--sp-primary)';
        activeBtn.style.background = '#D1FAE5';
      }
      pass.focus();
    }
    // Auto-fill default Admin credentials on load
    window.addEventListener('DOMContentLoaded', function() {
      onSelectDept('admin');
    });
  </script>
</body>
</html>
