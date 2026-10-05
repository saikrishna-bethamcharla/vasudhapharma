<?php
/**
 * Vasudha Pharma Chem Limited — Product Enquiry & Survey Submission Endpoint
 * Receives product inquiries, RFQ cart requests, and website surveys.
 * Automatically sends email notifications to both admins, forwards leads to Zoho CRM,
 * and saves records for operations desk review.
 */

header('Content-Type: application/json; charset=utf-8');

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data)) {
    $data = $_POST;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request method or payload.']);
    exit;
}

$type = trim($data['type'] ?? ($data['enquiryType'] ?? 'Product Enquiry'));
$dateStr = date('M j, Y h:i A');

// Ensure staff data directory exists
$dataDir = __DIR__ . '/staff/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$recipients = [
    'wisdom@vasudhapharma.com',
    'saikrishna@zailabs.co.in'
];

$serverHost = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com');
$mailDomain = (strpos($serverHost, 'mytemp.website') !== false || empty($serverHost)) ? 'vasudhapharma.com' : $serverHost;

// =========================================================================
// CASE A: WEBSITE SURVEY SUBMISSION
// =========================================================================
if ($type === 'survey' || $type === 'Website Survey') {
    $surveyId = 'VP-SRV-' . date('Ymd') . '-' . rand(1000, 9999);
    $q1 = trim($data['q1'] ?? '—');
    $q2 = trim($data['q2'] ?? '—');
    $q3 = trim($data['q3'] ?? '—');
    $q4 = trim($data['q4'] ?? '—');
    $q5 = trim($data['q5'] ?? '—');
    $sourcePage = trim($data['page'] ?? ($data['sourcePage'] ?? 'General Website'));

    $record = [
        'id'        => $surveyId,
        'type'      => 'Website Survey',
        'date'      => $dateStr,
        'timestamp' => time(),
        'sourcePage'=> $sourcePage,
        'q1'        => $q1,
        'q2'        => $q2,
        'q3'        => $q3,
        'q4'        => $q4,
        'q5'        => $q5
    ];

    $surveyFile = $dataDir . '/surveys.json';
    $existing = [];
    if (file_exists($surveyFile)) {
        $c = json_decode(file_get_contents($surveyFile), true);
        if (is_array($c)) $existing = $c;
    }
    array_unshift($existing, $record);
    @file_put_contents($surveyFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

    // Survey Email
    $subject = "[VPCL Website Survey] Feedback on {$sourcePage} ({$surveyId})";
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
    .q-item { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
    .q-label { font-size: 12.5px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
    .q-val { font-size: 14px; color: #0f172a; font-weight: 500; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">Website User Experience Survey</div>
      <div class="badge">' . htmlspecialchars($surveyId) . '</div>
    </div>
    <div class="q-item"><div class="q-label">Originating Page:</div><div class="q-val">' . htmlspecialchars($sourcePage) . '</div></div>
    <div class="q-item"><div class="q-label">Q1. How did you find us today?:</div><div class="q-val">' . htmlspecialchars($q1) . '</div></div>
    <div class="q-item"><div class="q-label">Q2. What brought you to our website today?:</div><div class="q-val">' . htmlspecialchars($q2) . '</div></div>
    <div class="q-item"><div class="q-label">Q3. How did you find the information?:</div><div class="q-val">' . htmlspecialchars($q3) . '</div></div>
    <div class="q-item"><div class="q-label">Q4. Were you able to find what you were looking for?:</div><div class="q-val">' . htmlspecialchars($q4) . '</div></div>
    <div class="q-item"><div class="q-label">Q5. How could we improve the site experience?:</div><div class="q-val">' . htmlspecialchars($q5) . '</div></div>
    <div class="footer">Vasudha Pharma Chem Limited &bull; User Experience Desk</div>
  </div>
</body>
</html>';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Vasudha Survey Desk <noreply@' . $mailDomain . '>',
        'Reply-To: wisdom@vasudhapharma.com',
        'Cc: saikrishna@zailabs.co.in',
        'X-Mailer: PHP/' . phpversion()
    ];
    $headersStr = implode("\r\n", $headers);

    $mailSentCount = 0;
    foreach ($recipients as $toAddr) {
        $sent = @mail($toAddr, $subject, $htmlBody, $headersStr, "-f noreply@" . $mailDomain);
        if (!$sent) {
            $sent = @mail($toAddr, $subject, $htmlBody, $headersStr);
        }
        if ($sent) $mailSentCount++;
    }

    // Server-side forward to Zoho CRM
    if (function_exists('curl_init')) {
        try {
            $surveyDesc = "=== WEBSITE SURVEY ===\nOrigin Page: {$sourcePage}\nQ1: {$q1}\nQ2: {$q2}\nQ3: {$q3}\nQ4: {$q4}\nQ5: {$q5}";
            $zFields = [
                'xnQsjsdp'    => 'b8e658fb5ade04176bfdfb6f74e4217cbec006e2c955226df4855aec0bb7de92',
                'zc_gad'      => '',
                'xmIwtLD'     => '037d840b8b2ced74645b10ffbc644734063aa7185a0558216e0bc3fbfc614f804063ece5c7df9c085d5ee35483e2090b',
                'actionType'  => 'TGVhZHM=',
                'returnURL'   => 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com') . '/home.html',
                'Last Name'   => 'Website Survey Response',
                'Company'     => 'Website Visitor Feedback',
                'Description' => $surveyDesc,
                'Lead Source' => 'Website Survey',
                'Lead Status' => 'Not Contacted',
                'LEADCF9'     => $q1,
                'LEADCF11'    => $q2,
                'LEADCF10'    => $q3,
                'LEADCF12'    => $q4,
                'LEADCF4'     => $q5
            ];
            $zch = curl_init('https://crm.zoho.in/crm/WebToLeadForm');
            curl_setopt($zch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($zch, CURLOPT_POST, true);
            curl_setopt($zch, CURLOPT_POSTFIELDS, http_build_query($zFields));
            curl_setopt($zch, CURLOPT_TIMEOUT, 6);
            curl_setopt($zch, CURLOPT_SSL_VERIFYPEER, false);
            curl_exec($zch);
            curl_close($zch);
        } catch (\Exception $e) {}
    }

    echo json_encode(['ok' => true, 'id' => $surveyId, 'type' => 'survey', 'message' => 'Survey recorded successfully.']);
    exit;
}

// =========================================================================
// CASE B: PRODUCT ENQUIRY / RFQ CART SUBMISSION
// =========================================================================
$enquiryId  = 'VP-ENQ-' . date('Ymd') . '-' . rand(1000, 9999);
$name       = trim($data['lastName'] ?? ($data['name'] ?? ''));
$email      = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone      = trim($data['phone'] ?? '');
$company    = trim($data['company'] ?? '');
$product    = trim($data['productName'] ?? ($data['product'] ?? ''));
$category   = trim($data['productCategory'] ?? ($data['category'] ?? ''));
$cas        = trim($data['casNumber'] ?? ($data['cas'] ?? ''));
$spec       = trim($data['specifications'] ?? ($data['spec'] ?? ''));
$reg        = trim($data['regulatoryStatus'] ?? ($data['reg'] ?? ''));
$ther       = trim($data['therapeuticUse'] ?? ($data['ther'] ?? ''));
$qty        = trim($data['quantityRequired'] ?? ($data['qty'] ?? ''));
$desc       = trim($data['description'] ?? ($data['message'] ?? ''));
$items      = !empty($data['items']) && is_array($data['items']) ? $data['items'] : [];

if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name and a valid email address are required.']);
    exit;
}

// 1. Save local record for staff portal
$record = [
    'id'          => $enquiryId,
    'date'        => $dateStr,
    'timestamp'   => time(),
    'type'        => !empty($items) ? 'Multi-Product RFQ' : 'Product Enquiry',
    'name'        => $name,
    'email'       => $email,
    'phone'       => $phone,
    'company'     => $company,
    'product'     => $product,
    'category'    => $category,
    'cas'         => $cas,
    'spec'        => $spec,
    'reg'         => $reg,
    'ther'        => $ther,
    'qty'         => $qty,
    'description' => $desc,
    'items'       => $items,
    'status'      => 'New'
];

$enquiriesFile = $dataDir . '/enquiries.json';
$existing = [];
if (file_exists($enquiriesFile)) {
    $c = json_decode(file_get_contents($enquiriesFile), true);
    if (is_array($c)) $existing = $c;
}
array_unshift($existing, $record);
@file_put_contents($enquiriesFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

// 2. Format and Send Notification Email to BOTH administrators
$subject = "[VPCL Product RFQ] {$enquiryId}: {$name} — " . ($product ?: (!empty($items) ? count($items) . ' Products in RFQ' : 'Product Enquiry'));

$htmlBody = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 28px 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
    .header { border-bottom: 2px solid #0E8F6C; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 18px; font-weight: 800; color: #096B51; }
    .badge { background: #ECFDF5; color: #0E8F6C; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 10px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td.label { font-weight: 600; color: #64748b; width: 35%; }
    .meta-table td.val { color: #0f172a; }
    .msg-box { background: #f8fafc; border-left: 4px solid #0E8F6C; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin: 16px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12.5px; }
    .items-table th { background: #F1F5F9; padding: 8px 10px; text-align: left; color: #475569; font-weight: 700; border-bottom: 2px solid #CBD5E1; }
    .items-table td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">New Commercial Product Enquiry</div>
      <div class="badge">' . htmlspecialchars($enquiryId) . '</div>
    </div>

    <table class="meta-table">
      <tr><td class="label">Buyer Name:</td><td class="val"><strong>' . htmlspecialchars($name) . '</strong></td></tr>
      <tr><td class="label">Email Address:</td><td class="val"><a href="mailto:' . htmlspecialchars($email) . '" style="color:#0E8F6C; font-weight:600;">' . htmlspecialchars($email) . '</a></td></tr>
      <tr><td class="label">Phone:</td><td class="val">' . htmlspecialchars($phone ?: 'Not provided') . '</td></tr>
      <tr><td class="label">Company / Org:</td><td class="val"><strong>' . htmlspecialchars($company ?: 'Not provided') . '</strong></td></tr>';

if ($product) {
    $htmlBody .= '<tr><td class="label">Product Name:</td><td class="val"><strong style="color:#096B51; font-size:14px;">' . htmlspecialchars($product) . '</strong></td></tr>';
}
if ($category) {
    $htmlBody .= '<tr><td class="label">Category:</td><td class="val">' . htmlspecialchars($category) . '</td></tr>';
}
if ($cas) {
    $htmlBody .= '<tr><td class="label">CAS Number:</td><td class="val"><code>' . htmlspecialchars($cas) . '</code></td></tr>';
}
if ($spec) {
    $htmlBody .= '<tr><td class="label">Pharmacopoeia:</td><td class="val">' . htmlspecialchars($spec) . '</td></tr>';
}
if ($reg) {
    $htmlBody .= '<tr><td class="label">Regulatory Filing:</td><td class="val">' . htmlspecialchars($reg) . '</td></tr>';
}
if ($ther) {
    $htmlBody .= '<tr><td class="label">Therapeutic Class:</td><td class="val">' . htmlspecialchars($ther) . '</td></tr>';
}
if ($qty) {
    $htmlBody .= '<tr><td class="label">Quantity Needed:</td><td class="val"><strong style="color:#B91C1C;">' . htmlspecialchars($qty) . '</strong></td></tr>';
}

$htmlBody .= '<tr><td class="label">Submitted At:</td><td class="val">' . htmlspecialchars($dateStr) . '</td></tr>
    </table>';

if (!empty($items)) {
    $htmlBody .= '<div style="font-size:13px; font-weight:700; color:#334155; margin:16px 0 6px;">Multi-Product RFQ Basket:</div>';
    $htmlBody .= '<table class="items-table"><thead><tr><th>Product</th><th>Category</th><th>CAS</th><th>Target Qty</th></tr></thead><tbody>';
    foreach ($items as $it) {
        $htmlBody .= '<tr>';
        $htmlBody .= '<td><strong>' . htmlspecialchars($it['productName'] ?? ($it['name'] ?? '—')) . '</strong></td>';
        $htmlBody .= '<td>' . htmlspecialchars($it['category'] ?? '—') . '</td>';
        $htmlBody .= '<td>' . htmlspecialchars($it['cas'] ?? '—') . '</td>';
        $htmlBody .= '<td>' . htmlspecialchars($it['qty'] ?? '—') . '</td>';
        $htmlBody .= '</tr>';
    }
    $htmlBody .= '</tbody></table>';
}

$htmlBody .= '<div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Notes / Custom Specs:</div>
    <div class="msg-box">' . htmlspecialchars($desc ?: 'No additional notes provided.') . '</div>

    <div class="footer">
      Vasudha Pharma Chem Limited &bull; Commercial Sales &amp; Marketing Operations
    </div>
  </div>
</body>
</html>';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Vasudha RFQ Desk <noreply@' . $mailDomain . '>',
    'Reply-To: ' . $email,
    'Cc: saikrishna@zailabs.co.in',
    'X-Mailer: PHP/' . phpversion()
];
$headersStr = implode("\r\n", $headers);

// 2a. Direct PHP mail() to both addresses
$mailSentCount = 0;
foreach ($recipients as $toAddr) {
    $sent = @mail($toAddr, $subject, $htmlBody, $headersStr, "-f noreply@" . $mailDomain);
    if (!$sent) {
        $sent = @mail($toAddr, $subject, $htmlBody, $headersStr);
    }
    if ($sent) $mailSentCount++;
}

// 2b. High-reliability relay fallback
$relaySent = false;
if (function_exists('curl_init')) {
    try {
        $relayPayload = json_encode([
            '_subject'          => $subject,
            '_replyto'          => $email,
            '_cc'               => 'saikrishna@zailabs.co.in',
            'Enquiry_ID'        => $enquiryId,
            'Submitted_At'      => $dateStr,
            'Buyer_Name'        => $name,
            'Email'             => $email,
            'Phone'             => $phone ?: 'Not provided',
            'Company'           => $company ?: 'Not provided',
            'Product_Name'      => $product ?: '—',
            'Category'          => $category ?: '—',
            'CAS_Number'        => $cas ?: '—',
            'Specifications'    => $spec ?: '—',
            'Regulatory_Status' => $reg ?: '—',
            'Therapeutic_Class' => $ther ?: '—',
            'Quantity_Required' => $qty ?: '—',
            'Additional_Notes'  => $desc ?: '—'
        ]);

        $ch = curl_init('https://formsubmit.co/ajax/wisdom@vasudhapharma.com');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $relayPayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: VasudhaRFQ/1.0'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        if ($res !== false) $relaySent = true;
        curl_close($ch);
    } catch (\Exception $e) {}
}

// 3. Server-side Dispatch to Zoho CRM WebToLead
$zohoSent = false;
if (function_exists('curl_init')) {
    try {
        $fullDescLines = [
            '=== PRODUCT ENQUIRY ===',
            'Category: ' . ($category ?: '—'),
            'Product: ' . ($product ?: '—'),
            'CAS: ' . ($cas ?: '—'),
            'Spec: ' . ($spec ?: '—'),
            'Regulatory: ' . ($reg ?: '—'),
            'Therapeutic: ' . ($ther ?: '—'),
            'Qty: ' . ($qty ?: '—'),
            '',
            'Buyer Notes:',
            $desc ?: '—'
        ];
        if (!empty($items)) {
            $fullDescLines[] = '';
            $fullDescLines[] = '--- MULTI-PRODUCT CART ---';
            foreach ($items as $it) {
                $fullDescLines[] = ($it['productName'] ?? ($it['name'] ?? 'Product')) . ' | Qty: ' . ($it['qty'] ?? '—') . ' | CAS: ' . ($it['cas'] ?? '—');
            }
        }
        $zohoDescription = implode("\n", $fullDescLines);

        $zohoFields = [
            'xnQsjsdp'    => 'b8e658fb5ade04176bfdfb6f74e4217cbec006e2c955226df4855aec0bb7de92',
            'zc_gad'      => '',
            'xmIwtLD'     => '037d840b8b2ced74645b10ffbc644734063aa7185a0558216e0bc3fbfc614f804063ece5c7df9c085d5ee35483e2090b',
            'actionType'  => 'TGVhZHM=',
            'returnURL'   => 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com') . '/home.html',
            'Last Name'   => $name,
            'Email'       => $email,
            'Phone'       => $phone,
            'Company'     => $company ?: 'Website enquiry',
            'Description' => $zohoDescription,
            'Lead Source' => 'Website Product Enquiry',
            'Lead Status' => 'Not Contacted',
            'LEADCF5'     => $category,
            'LEADCF6'     => $product,
            'LEADCF8'     => $spec,
            'LEADCF3'     => $cas,
            'LEADCF7'     => $reg,
            'LEADCF1'     => $ther,
            'LEADCF2'     => $qty
        ];

        $zch = curl_init('https://crm.zoho.in/crm/WebToLeadForm');
        curl_setopt($zch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($zch, CURLOPT_POST, true);
        curl_setopt($zch, CURLOPT_POSTFIELDS, http_build_query($zohoFields));
        curl_setopt($zch, CURLOPT_TIMEOUT, 6);
        curl_setopt($zch, CURLOPT_SSL_VERIFYPEER, false);
        $zRes = curl_exec($zch);
        if ($zRes !== false) $zohoSent = true;
        curl_close($zch);
    } catch (\Exception $e) {}
}

echo json_encode([
    'ok'         => true,
    'id'         => $enquiryId,
    'mailSent'   => ($mailSentCount > 0 || $relaySent),
    'zohoSent'   => $zohoSent,
    'recipients' => $recipients,
    'message'    => 'Thank you. Your commercial product enquiry has been received and routed to our sales & marketing desks.'
]);
