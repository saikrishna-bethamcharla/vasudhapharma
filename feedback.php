<?php
/**
 * Vasudha Pharma Chem Limited — Feedback & Review Submission Handler
 * Receives testing review tickets, saves them to staff/data/feedback.json,
 * and notifies the core review team via email.
 */

header('Content-Type: application/json; charset=utf-8');

$dataFile = __DIR__ . '/staff/data/feedback.json';

// Ensure data folder exists
if (!is_dir(__DIR__ . '/staff/data')) {
    @mkdir(__DIR__ . '/staff/data', 0755, true);
}

// 1. GET Request: Return stored tickets
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        $json = json_decode($content, true);
        echo json_encode(is_array($json) ? $json : []);
    } else {
        echo json_encode([]);
    }
    exit;
}

// 2. POST Request: Record new ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Message is required.']);
        exit;
    }

    $ticketId     = trim($data['id'] ?? ('VP-FB-' . rand(1000, 9999)));
    $reviewerName = trim($data['reviewerName'] ?? 'Anonymous Reviewer');
    $reviewerDept = trim($data['reviewerDept'] ?? 'General Testing');
    $targetPage   = trim($data['targetPage'] ?? 'General / Not Specified');
    $category     = trim($data['category'] ?? 'General Observation');
    $priority     = trim($data['priority'] ?? 'Normal');
    $message      = trim($data['message']);
    $dateStr      = trim($data['date'] ?? date('M j, Y h:i A'));
    $hasImg       = !empty($data['screenshotMeta']) ? 'Yes' : 'No';

    $ticket = [
        'id'             => $ticketId,
        'date'           => $dateStr,
        'timestamp'      => time() * 1000,
        'reviewerName'   => $reviewerName,
        'reviewerDept'   => $reviewerDept,
        'targetPage'     => $targetPage,
        'category'       => $category,
        'priority'       => $priority,
        'message'        => $message,
        'screenshotMeta' => $data['screenshotMeta'] ?? null,
        'status'         => 'Open',
        'devNote'        => '',
        'statusUpdatedAt'=> ''
    ];

    // Read existing
    $existing = [];
    if (file_exists($dataFile)) {
        $c = json_decode(file_get_contents($dataFile), true);
        if (is_array($c)) $existing = $c;
    }

    array_unshift($existing, $ticket);
    @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

    // Send Notification Email via PHP mail()
    $to = 'wisdom@vasudhapharma.com, saikrishna@zailabs.co.in';
    $subject = "[VPCL Web Review] Ticket {$ticketId}: {$targetPage} ({$priority} Priority)";

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
    .priority-critical { background: #FEE2E2; color: #DC2626; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
    .priority-high { background: #FEF3C7; color: #D97706; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
    .priority-normal { background: #DBEAFE; color: #1E40AF; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
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
      <div class="title">Vasudha Web Review Desk</div>
      <div class="badge">' . htmlspecialchars($ticketId) . '</div>
    </div>

    <table class="meta-table">
      <tr><td class="label">Reviewer:</td><td class="val"><strong>' . htmlspecialchars($reviewerName) . '</strong> (' . htmlspecialchars($reviewerDept) . ')</td></tr>
      <tr><td class="label">Target Page:</td><td class="val"><a href="https://' . ($_SERVER['HTTP_HOST'] ?? '6jh.8bd.mytemp.website') . '/' . htmlspecialchars($targetPage) . '" style="color:#0E8F6C; font-weight:600;">' . htmlspecialchars($targetPage) . '</a></td></tr>
      <tr><td class="label">Category:</td><td class="val">' . htmlspecialchars($category) . '</td></tr>
      <tr><td class="label">Priority:</td><td class="val">' . htmlspecialchars($priority) . '</td></tr>
      <tr><td class="label">Submitted At:</td><td class="val">' . htmlspecialchars($dateStr) . '</td></tr>
      <tr><td class="label">Screenshot Attached:</td><td class="val">' . htmlspecialchars($hasImg) . '</td></tr>
    </table>

    <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Notes / Requested Changes:</div>
    <div class="msg-box">' . htmlspecialchars($message) . '</div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://' . ($_SERVER['HTTP_HOST'] ?? '6jh.8bd.mytemp.website') . '/feedback.html" style="background: #0E8F6C; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block;">Open Feedback Console &rarr;</a>
    </div>

    <div class="footer">
      Vasudha Pharma Chem Limited &bull; Review &amp; Launch Console
    </div>
  </div>
</body>
</html>';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Vasudha Review Desk <noreply@' . ($_SERVER['SERVER_NAME'] ?? 'vasudhapharma.com') . '>',
        'Reply-To: wisdom@vasudhapharma.com',
        'X-Mailer: PHP/' . phpversion()
    ];

    $mailOk = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));

    echo json_encode([
        'ok'      => true,
        'ticketId'=> $ticketId,
        'mailSent'=> $mailOk,
        'message' => 'Feedback ticket successfully recorded.'
    ]);
    exit;
}
