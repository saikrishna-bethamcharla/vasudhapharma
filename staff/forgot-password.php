<?php
require __DIR__ . '/includes/auth.php';

// If already logged in, redirect to home unless explicitly resetting
$u = staff_user();

$step = $_GET['step'] ?? 'request';
$err = '';
$msg = '';
$userKey = $_SESSION['pwd_reset_user_key'] ?? '';
$targetEmail = $_SESSION['pwd_reset_email'] ?? '';
$targetName = $_SESSION['pwd_reset_name'] ?? '';
$targetDept = $_SESSION['pwd_reset_dept'] ?? '';
$devOtp = $_SESSION['pwd_reset_otp'] ?? '';
$mailSent = $_SESSION['pwd_reset_mail_sent'] ?? false;

// Handle Form Submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? '';

  // 1. Request OTP Code
  if ($action === 'request_otp') {
    $identifier = trim($_POST['identifier'] ?? '');
    $dept = trim($_POST['dept'] ?? '');

    if (!$identifier) {
      $err = 'Please enter your corporate email address or select your department.';
      $step = 'request';
    } else {
      $res = staff_send_reset_otp($identifier, $dept);
      if ($res['ok']) {
        $_SESSION['pwd_reset_user_key'] = $res['user_key'];
        $_SESSION['pwd_reset_email']    = $res['email'];
        $_SESSION['pwd_reset_name']     = $res['name'];
        $_SESSION['pwd_reset_dept']     = $res['dept'];
        $_SESSION['pwd_reset_otp']      = $res['otp'];
        $_SESSION['pwd_reset_mail_sent'] = $res['mail_sent'];

        $userKey = $res['user_key'];
        $targetEmail = $res['email'];
        $targetName = $res['name'];
        $targetDept = $res['dept'];
        $devOtp = $res['otp'];
        $mailSent = $res['mail_sent'];

        $msg = 'A 6-digit verification code has been generated and sent to ' . htmlspecialchars($res['email']) . '.';
        $step = 'verify';
      } else {
        $err = $res['error'] ?? 'Could not find a matching staff account.';
        $step = 'request';
      }
    }
  }

  // 2. Verify OTP and Set New Password
  elseif ($action === 'verify_and_reset') {
    $otp = trim($_POST['otp'] ?? '');
    $newPass = $_POST['new_password'] ?? '';
    $confirmPass = $_POST['confirm_password'] ?? '';
    $postUserKey = $_POST['user_key'] ?? $userKey;

    if (!$postUserKey) {
      $err = 'Session expired or invalid reset request. Please start again.';
      $step = 'request';
    } elseif (!$otp || strlen($otp) !== 6) {
      $err = 'Please enter the complete 6-digit verification code.';
      $step = 'verify';
    } elseif (strlen($newPass) < 6) {
      $err = 'New password must be at least 6 characters long.';
      $step = 'verify';
    } elseif ($newPass !== $confirmPass) {
      $err = 'New password and confirmation do not match.';
      $step = 'verify';
    } else {
      $res = staff_complete_password_reset($postUserKey, $otp, $newPass);
      if ($res['ok']) {
        // Clear reset session
        unset($_SESSION['pwd_reset_user_key'], $_SESSION['pwd_reset_email'], $_SESSION['pwd_reset_name'], $_SESSION['pwd_reset_dept'], $_SESSION['pwd_reset_otp'], $_SESSION['pwd_reset_mail_sent']);
        $step = 'success';
      } else {
        $err = $res['error'] ?? 'Verification failed.';
        $step = 'verify';
      }
    }
  }

  // 3. Resend OTP
  elseif ($action === 'resend_otp') {
    $postUserKey = $_POST['user_key'] ?? $userKey;
    if ($postUserKey && $targetEmail) {
      $res = staff_send_reset_otp($targetEmail, $targetDept);
      if ($res['ok']) {
        $_SESSION['pwd_reset_otp'] = $res['otp'];
        $_SESSION['pwd_reset_mail_sent'] = $res['mail_sent'];
        $devOtp = $res['otp'];
        $mailSent = $res['mail_sent'];
        $msg = 'A fresh 6-digit verification code has been generated and sent.';
      } else {
        $err = $res['error'] ?? 'Please wait a moment before requesting another code.';
      }
    }
    $step = 'verify';
  }

  // 4. Cancel / Restart
  elseif ($action === 'restart') {
    unset($_SESSION['pwd_reset_user_key'], $_SESSION['pwd_reset_email'], $_SESSION['pwd_reset_name'], $_SESSION['pwd_reset_dept'], $_SESSION['pwd_reset_otp'], $_SESSION['pwd_reset_mail_sent']);
    header('Location: forgot-password.php');
    exit;
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Password | Vasudha Operations Portal</title>
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
      max-width: 460px;
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
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
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
    input, select {
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
    input:focus, select:focus {
      outline: none;
      border-color: var(--sp-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(14, 143, 108, 0.18);
    }
    .otp-input {
      font-size: 24px !important;
      font-weight: 800 !important;
      letter-spacing: 8px !important;
      text-align: center !important;
      font-family: monospace, monospace !important;
      background: #FFFFFF !important;
      border: 2px solid var(--sp-primary) !important;
      color: var(--sp-primary-dark) !important;
      padding: 12px 16px !important;
    }
    button[type="submit"], .btn-submit {
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
      text-decoration: none;
      display: block;
      text-align: center;
    }
    button[type="submit"]:hover, .btn-submit:hover {
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
    .info {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      padding: 12px 14px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 16px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.45;
    }
    .test-otp-callout {
      background: #F0FDF4;
      border: 1.5px dashed #059669;
      border-radius: 10px;
      padding: 12px 16px;
      margin: 14px 0;
      text-align: center;
      font-size: 13px;
      color: #064E3B;
    }
    .test-otp-callout strong {
      font-size: 20px;
      font-family: monospace;
      letter-spacing: 4px;
      color: #047857;
      display: block;
      margin-top: 4px;
    }
    .links-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--sp-border);
      font-size: 12.5px;
    }
    .links-bar a {
      color: var(--sp-text-muted);
      text-decoration: none;
      transition: color 0.15s;
    }
    .links-bar a:hover {
      color: var(--sp-primary);
    }
    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #D1FAE5;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
    }
  </style>
  <link rel="stylesheet" href="../assets/css/vasudha-capsule-logo.css">
</head>
<body>
  <div class="box">
    <div class="brand-header" style="text-align: center; margin-bottom: 20px;">
      <a href="../home.html" class="logo" style="margin: 0 auto 16px; display: inline-flex;">
        <div class="logo-flow-bubbles" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="logo-hex-wrap">
          <div class="logo-hex-body">
            <img src="../assets/vasudha-logo.jpg" alt="Vasudha Pharma Chem Limited" class="logo-img">
          </div>
        </div>
        <div class="logo-text">
          <strong>VASUDHA PHARMA CHEM LIMITED</strong>
          <span>Contributing to affordable health care...</span>
        </div>
      </a>
      <h1 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px;">Vasudha Operations Portal</h1>
      <div class="brand-sub" style="font-size: 13px; color: var(--sp-text-muted);">Security &amp; Account Recovery</div>
    </div>

    <?php if ($err): ?>
      <div class="err">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><?php echo htmlspecialchars($err); ?></span>
      </div>
    <?php endif; ?>

    <?php if ($msg && $step !== 'success'): ?>
      <div class="info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;margin-top:1px;"><path d="M20 6L9 17l-5-5"/></svg>
        <span><?php echo htmlspecialchars($msg); ?></span>
      </div>
    <?php endif; ?>

    <!-- STEP 1: REQUEST VERIFICATION CODE -->
    <?php if ($step === 'request'): ?>
      <p class="lead" style="text-align:center;">
        Enter your corporate email or select your department to receive a 6-digit verification code.
      </p>

      <div style="margin-bottom:16px;">
        <div style="font-size:11.5px; font-weight:700; color:var(--sp-primary-dark); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
          <span>⚡ Select Department Account</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; margin-bottom:10px;">
          <button type="button" class="btn-quick" onclick="onPickDept('admin', 'admin@vasudhapharma.com')">👑 Admin</button>
          <button type="button" class="btn-quick" onclick="onPickDept('careers', 'hr@vasudhapharma.com')">👥 HR</button>
          <button type="button" class="btn-quick" onclick="onPickDept('marketing', 'marketing@vasudhapharma.com')">💼 Marketing</button>
          <button type="button" class="btn-quick" onclick="onPickDept('foundation', 'foundation@vasudhapharma.com')">🤝 Foundation</button>
          <button type="button" class="btn-quick" onclick="onPickDept('news', 'news@vasudhapharma.com')">📰 News</button>
          <button type="button" class="btn-quick" onclick="onPickDept('admin', 'saikrishna@zailabs.co.in')">💻 Lead Dev</button>
        </div>
      </div>

      <form method="post" autocomplete="on">
        <input type="hidden" name="action" value="request_otp">
        
        <label>Corporate Email or Department Address</label>
        <input id="identInput" type="email" name="identifier" placeholder="wisdom@vasudhapharma.com" value="<?php echo htmlspecialchars($targetEmail ?: 'wisdom@vasudhapharma.com'); ?>" required autofocus>

        <label>Department Desk</label>
        <select id="deptSelect" name="dept">
          <option value="admin">VPCL Operations Admin (All Desks)</option>
          <option value="marketing">Marketing Desk (Products &amp; Portfolio)</option>
          <option value="careers">HR &amp; Careers</option>
          <option value="foundation">Vasudha Foundation CSR</option>
          <option value="news">Corporate Media &amp; PR</option>
        </select>

        <button type="submit">Send Verification Code &rarr;</button>
      </form>

      <div class="links-bar">
        <a href="index.php">&larr; Back to Staff Login</a>
        <a href="../feedback.html">Support / Help</a>
      </div>

    <!-- STEP 2: VERIFY OTP AND SET NEW PASSWORD -->
    <?php elseif ($step === 'verify'): ?>
      <p class="lead" style="text-align:center; margin-bottom:12px;">
        A 6-digit verification code was generated for <strong><?php echo htmlspecialchars($targetName ?: 'Staff Member'); ?></strong> (<code><?php echo htmlspecialchars($targetEmail); ?></code>).
      </p>

      <?php if ($devOtp): ?>
        <div class="test-otp-callout">
          <div>🧪 <strong>Testing Mode OTP Code</strong></div>
          <strong><?php echo htmlspecialchars($devOtp); ?></strong>
          <span style="font-size:11.5px; color:#065F46;">(Dispatched via corporate email; also shown here for instant testing)</span>
        </div>
      <?php endif; ?>

      <form method="post" autocomplete="off">
        <input type="hidden" name="action" value="verify_and_reset">
        <input type="hidden" name="user_key" value="<?php echo htmlspecialchars($userKey); ?>">

        <label style="text-align:center;">Enter 6-Digit Verification Code</label>
        <input class="otp-input" type="text" name="otp" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;" value="<?php echo htmlspecialchars($devOtp); ?>" required autofocus>

        <label>New Department Password</label>
        <input type="password" name="new_password" minlength="6" placeholder="Enter new password (min. 6 chars)" required>

        <label>Confirm New Password</label>
        <input type="password" name="confirm_password" minlength="6" placeholder="Re-type new password" required>

        <button type="submit">Verify Code &amp; Reset Password &rarr;</button>
      </form>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:12.5px;">
        <form method="post" style="display:inline;">
          <input type="hidden" name="action" value="resend_otp">
          <input type="hidden" name="user_key" value="<?php echo htmlspecialchars($userKey); ?>">
          <button type="submit" style="background:none; border:none; color:var(--sp-primary); font-weight:600; cursor:pointer; padding:0; font-size:12.5px;">Resend Code</button>
        </form>
        <form method="post" style="display:inline;">
          <input type="hidden" name="action" value="restart">
          <button type="submit" style="background:none; border:none; color:var(--sp-text-muted); cursor:pointer; padding:0; font-size:12.5px;">Change Account</button>
        </form>
      </div>

      <div class="links-bar">
        <a href="index.php">&larr; Cancel and return to Login</a>
      </div>

    <!-- STEP 3: SUCCESS STATE -->
    <?php elseif ($step === 'success'): ?>
      <div style="text-align:center; padding:10px 0;">
        <div class="success-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style="font-size:20px; font-weight:800; color:var(--sp-primary-dark); margin:0 0 8px;">Password Reset Successfully!</h2>
        <p style="font-size:13.5px; color:var(--sp-text-muted); line-height:1.5; margin:0 0 24px;">
          Your department credentials have been securely updated. You can now access your Operations Desk with the new password.
        </p>

        <a class="btn-submit" href="index.php">Proceed to Sign In &rarr;</a>
      </div>
    <?php endif; ?>

  </div>

  <script>
    function onPickDept(dept, alias) {
      const inp = document.getElementById('identInput');
      const sel = document.getElementById('deptSelect');
      if (inp) inp.value = alias || 'wisdom@vasudhapharma.com';
      if (sel && dept) sel.value = dept;
    }
  </script>
</body>
</html>
