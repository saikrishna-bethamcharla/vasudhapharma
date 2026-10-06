<?php
/**
 * Vasudha Pharma Chem Limited - Careers CV Application Handler
 * Securely receives and logs job applicant submissions with resume attachments.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$name  = trim($_POST['name'] ?? '');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = trim($_POST['phone'] ?? '');
$job   = trim($_POST['job'] ?? 'General Application');
$jobId = trim($_POST['jobid'] ?? '');
$loc   = trim($_POST['loc'] ?? '');
$note  = trim($_POST['note'] ?? '');

if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name and valid email are required']);
    exit;
}

$uploadedCvPath = null;
$uploadDir = __DIR__ . '/uploads/resumes';

if (!empty($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
    $fileTmp  = $_FILES['cv']['tmp_name'];
    $fileName = $_FILES['cv']['name'];
    $fileSize = $_FILES['cv']['size'];

    // 1. Size check: 8 MB max
    if ($fileSize > 8 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'File size exceeds 8MB limit']);
        exit;
    }

    // 2. Strict extension whitelist
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ['pdf', 'doc', 'docx'];
    if (!in_array($ext, $allowedExts, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid file format. Only PDF, DOC, and DOCX are accepted.']);
        exit;
    }

    // 3. Ensure target directory exists with .htaccess execution protection
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }

    $htaccessPath = $uploadDir . '/.htaccess';
    if (!file_exists($htaccessPath)) {
        @file_put_contents($htaccessPath, "# Prevent script execution\n<FilesMatch \"\\.(php|phtml|phar|sh|pl|cgi)$\">\n  Require all denied\n  Deny from all\n</FilesMatch>\nOptions -Indexes\n");
    }

    // 4. Randomized sanitized filename
    $safeName = 'cv_' . date('Ymd_His') . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $targetFile = $uploadDir . '/' . $safeName;

    if (move_uploaded_file($fileTmp, $targetFile)) {
        $uploadedCvPath = 'uploads/resumes/' . $safeName;
    }
}

// 5. Append record to applications log for HR desk review
$appRecord = [
    'id'         => 'APP-' . date('Ymd') . '-' . substr(bin2hex(random_bytes(4)), 0, 6),
    'date'       => date('Y-m-d H:i:s'),
    'name'       => $name,
    'email'      => $email,
    'phone'      => $phone,
    'job_title'  => $job,
    'job_id'     => $jobId,
    'location'   => $loc,
    'note'       => $note,
    'cv_path'    => $uploadedCvPath
];

$dataFile = __DIR__ . '/staff/data/applications.json';
$apps = [];
if (file_exists($dataFile)) {
    $existing = json_decode(file_get_contents($dataFile), true);
    if (is_array($existing)) $apps = $existing;
}
$apps[] = $appRecord;
@file_put_contents($dataFile, json_encode($apps, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Send Notification Email to BOTH administrators
$recipients = [
    'wisdom@vasudhapharma.com',
    'saikrishna@zailabs.co.in'
];
$subject = "[VPCL Career Application] {$appRecord['id']}: {$name} — {$job}";
$serverHost = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com');
$mailDomain = (strpos($serverHost, 'mytemp.website') !== false || empty($serverHost)) ? 'vasudhapharma.com' : $serverHost;
$resumeUrl = !empty($uploadedCvPath) ? 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com') . '/' . $uploadedCvPath : null;

$htmlBody = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 28px 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
    .header { border-bottom: 2px solid #0E8F6C; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 18px; font-weight: 800; color: #096B51; }
    .badge { background: #ECFDF5; color: #0E8F6C; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 10px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td.label { font-weight: 600; color: #64748b; width: 35%; }
    .meta-table td.val { color: #0f172a; }
    .msg-box { background: #f8fafc; border-left: 4px solid #0E8F6C; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin: 16px 0; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">New Career Job Application</div>
      <div class="badge">' . htmlspecialchars($appRecord['id']) . '</div>
    </div>
    <table class="meta-table">
      <tr><td class="label">Candidate Name:</td><td class="val"><strong>' . htmlspecialchars($name) . '</strong></td></tr>
      <tr><td class="label">Email:</td><td class="val"><a href="mailto:' . htmlspecialchars($email) . '" style="color:#0E8F6C; font-weight:600;">' . htmlspecialchars($email) . '</a></td></tr>
      <tr><td class="label">Phone:</td><td class="val">' . htmlspecialchars($phone ?: 'Not provided') . '</td></tr>
      <tr><td class="label">Job Position:</td><td class="val"><strong style="color:#096B51;">' . htmlspecialchars($job) . '</strong></td></tr>
      <tr><td class="label">Job ID:</td><td class="val">' . htmlspecialchars($jobId ?: 'General') . '</td></tr>
      <tr><td class="label">Location:</td><td class="val">' . htmlspecialchars($loc ?: 'India') . '</td></tr>';

if ($resumeUrl) {
    $htmlBody .= '<tr><td class="label">Resume / CV:</td><td class="val"><a href="' . htmlspecialchars($resumeUrl) . '" target="_blank" style="color:#2563EB; font-weight:700; text-decoration:underline;">Download Attached CV &rarr;</a></td></tr>';
}

$htmlBody .= '<tr><td class="label">Applied At:</td><td class="val">' . htmlspecialchars($appRecord['date']) . '</td></tr>
    </table>
    <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Cover Note / Summary:</div>
    <div class="msg-box">' . htmlspecialchars($note ?: 'No additional notes provided.') . '</div>
    <div class="footer">Vasudha Pharma Chem Limited &bull; Human Resources &amp; Talent Acquisition Desk</div>
  </div>
</body>
</html>';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Vasudha HR Desk <noreply@' . $mailDomain . '>',
    'Reply-To: ' . $email,
    'Auto-Submitted: auto-generated',
    'X-Auto-Response-Suppress: All',
    'X-Mailer: VasudhaDesk/1.0'
];
$headersStr = implode("\r\n", $headers);

foreach ($recipients as $toAddr) {
    $sent = @mail($toAddr, $subject, $htmlBody, $headersStr, "-f noreply@" . $mailDomain);
    if (!$sent) {
        @mail($toAddr, $subject, $htmlBody, $headersStr);
    }
}

echo json_encode([
    'ok'      => true,
    'id'      => $appRecord['id'],
    'message' => 'Application received successfully',
    'has_cv'  => !empty($uploadedCvPath)
]);
