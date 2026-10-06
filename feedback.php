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

// 2. POST Request: Record new ticket or delete ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    // Support deletion request
    if (is_array($data) && !empty($data['action']) && $data['action'] === 'delete' && !empty($data['id'])) {
        $delId = trim($data['id']);
        $existing = [];
        if (file_exists($dataFile)) {
            $c = json_decode(file_get_contents($dataFile), true);
            if (is_array($c)) $existing = $c;
        }
        $existing = array_values(array_filter($existing, function($t) use ($delId) {
            return ($t['id'] ?? '') !== $delId;
        }));
        @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        echo json_encode(['ok' => true, 'deletedId' => $delId, 'remaining' => count($existing)]);
        exit;
    }

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

    // Send Notification Email to BOTH administrators: wisdom@vasudhapharma.com and saikrishna@zailabs.co.in
    $recipients = [
        'wisdom@vasudhapharma.com',
        'saikrishna@zailabs.co.in'
    ];
    $subject = "[VPCL Web Review] Ticket {$ticketId}: {$targetPage} ({$priority} Priority)";

    $baseUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? '6jh.8bd.mytemp.website');
    $staffUrl = $baseUrl . '/staff/feedback.php';
    $targetPageUrl = (strpos($targetPage, 'http') === 0) ? $targetPage : ($baseUrl . '/' . ltrim($targetPage, '/'));

    // Priority color styling
    $priorityStyle = 'background-color:#E0F2FE; color:#0284C7; border:1px solid #BAE6FD;';
    if ($priority === 'Critical') {
        $priorityStyle = 'background-color:#FEE2E2; color:#DC2626; border:1px solid #FECACA;';
    } elseif ($priority === 'High') {
        $priorityStyle = 'background-color:#FEF3C7; color:#D97706; border:1px solid #FDE68A;';
    }

    $templateFile = __DIR__ . '/templates/feedback-email.html';
    if (file_exists($templateFile)) {
        $tpl = file_get_contents($templateFile);
        $replacements = [
            '{{BASE_URL}}'        => $baseUrl,
            '{{TICKET_ID}}'       => htmlspecialchars($ticketId),
            '{{PRIORITY}}'        => htmlspecialchars($priority),
            '{{PRIORITY_STYLE}}'  => $priorityStyle,
            '{{CATEGORY}}'        => htmlspecialchars($category),
            '{{REVIEWER_NAME}}'   => htmlspecialchars($reviewerName),
            '{{REVIEWER_DEPT}}'   => htmlspecialchars($reviewerDept),
            '{{TARGET_PAGE}}'     => htmlspecialchars($targetPage),
            '{{TARGET_PAGE_URL}}' => htmlspecialchars($targetPageUrl),
            '{{DATE_SUBMITTED}}'  => htmlspecialchars($dateStr),
            '{{HAS_SCREENSHOT}}'  => htmlspecialchars($hasImg),
            '{{MESSAGE}}'         => htmlspecialchars($message),
            '{{STAFF_URL}}'       => htmlspecialchars($staffUrl)
        ];
        $htmlBody = str_replace(array_keys($replacements), array_values($replacements), $tpl);
    } else {
        $htmlBody = '<!DOCTYPE html><html><body><h3>Ticket ' . htmlspecialchars($ticketId) . '</h3><p>' . htmlspecialchars($message) . '</p></body></html>';
    }

    $serverHost = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com');
    $mailDomain = (strpos($serverHost, 'mytemp.website') !== false || empty($serverHost)) ? 'vasudhapharma.com' : $serverHost;

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Vasudha Review Desk <noreply@' . $mailDomain . '>',
        'Reply-To: wisdom@vasudhapharma.com',
        'Auto-Submitted: auto-generated',
        'X-Auto-Response-Suppress: All',
        'X-Mailer: VasudhaDesk/1.0'
    ];
    $headersStr = implode("\r\n", $headers);

    // 1. Send via local mail() to both addresses
    $mailSentCount = 0;
    foreach ($recipients as $toAddr) {
        $sent = @mail($toAddr, $subject, $htmlBody, $headersStr, "-f noreply@" . $mailDomain);
        if (!$sent) {
            $sent = @mail($toAddr, $subject, $htmlBody, $headersStr);
        }
        if ($sent) {
            $mailSentCount++;
        }
    }

    // 2. High-reliability Server-side Relay (bypasses shared-host sendmail restrictions)
    $relaySent = false;
    if (function_exists('curl_init')) {
        try {
            $relayPayload = json_encode([
                '_subject'            => "[VPCL Web Review] Ticket {$ticketId}: {$targetPage} ({$priority} Priority)",
                '_cc'                 => 'saikrishna@zailabs.co.in',
                'Ticket_ID'           => $ticketId,
                'Submitted_At'        => $dateStr,
                'Reviewer'            => $reviewerName,
                'Department_or_Email' => $reviewerDept,
                'Target_Page'         => $targetPage,
                'Feedback_Category'   => $category,
                'Priority_Level'      => $priority,
                'Revision_Notes'      => $message,
                'Has_Screenshot'      => $hasImg,
                'Desk_Console'        => 'https://' . ($_SERVER['HTTP_HOST'] ?? '6jh.8bd.mytemp.website') . '/staff/feedback.php'
            ]);

            $ch = curl_init('https://formsubmit.co/ajax/wisdom@vasudhapharma.com');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $relayPayload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                'User-Agent: VasudhaWebReview/1.0'
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $relayResp = curl_exec($ch);
            if ($relayResp !== false) {
                $relaySent = true;
            }
            curl_close($ch);
        } catch (\Exception $e) {
            // Silently handled
        }
    }

    echo json_encode([
        'ok'            => true,
        'ticketId'      => $ticketId,
        'mailSent'      => ($mailSentCount > 0 || $relaySent),
        'mailSentCount' => $mailSentCount,
        'relaySent'     => $relaySent,
        'recipients'    => $recipients,
        'message'       => 'Feedback ticket successfully recorded and notification sent to wisdom@vasudhapharma.com and saikrishna@zailabs.co.in.'
    ]);
    exit;
}
