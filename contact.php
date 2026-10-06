<?php
/**
 * Vasudha Pharma Chem Limited — Website Contact Submission Endpoint
 * Receives public contact form requests, sends notification emails to both admins,
 * forwards lead data to Zoho CRM WebToLead, and saves a local record for staff review.
 */

header('Content-Type: application/json; charset=utf-8');

// Read input (supports both JSON fetch and traditional x-www-form-urlencoded POST)
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

$name        = trim($data['name'] ?? '');
$email       = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$designation = trim($data['designation'] ?? '');
$company     = trim($data['company'] ?? ($data['organisation'] ?? ''));
$country     = trim($data['country'] ?? 'India');
$phone       = trim($data['phone'] ?? '');
$department  = trim($data['department'] ?? 'General / Inquiries');
$category    = trim($data['category'] ?? '');
$product     = trim($data['product'] ?? '');
$quantity    = trim($data['quantity'] ?? '');
$mfgType     = trim($data['mfgType'] ?? '');
$rndType     = trim($data['rndType'] ?? '');
$foundation  = trim($data['foundationArea'] ?? '');
$profileUrl  = trim($data['profileUrl'] ?? '');
$message     = trim($data['message'] ?? '');
$dateStr     = date('M j, Y h:i A');
$contactId   = 'VP-CT-' . date('Ymd') . '-' . rand(1000, 9999);

if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name and a valid email address are required.']);
    exit;
}

// Ensure staff data directory exists
$dataDir = __DIR__ . '/staff/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

// 1. Save local record for staff portal
$record = [
    'id'          => $contactId,
    'date'        => $dateStr,
    'timestamp'   => time(),
    'name'        => $name,
    'email'       => $email,
    'phone'       => $phone,
    'designation' => $designation,
    'company'     => $company,
    'country'     => $country,
    'department'  => $department,
    'category'    => $category,
    'product'     => $product,
    'quantity'    => $quantity,
    'mfgType'     => $mfgType,
    'rndType'     => $rndType,
    'foundation'  => $foundation,
    'profileUrl'  => $profileUrl,
    'message'     => $message,
    'status'      => 'New'
];

$contactsFile = $dataDir . '/contacts.json';
$existing = [];
if (file_exists($contactsFile)) {
    $c = json_decode(file_get_contents($contactsFile), true);
    if (is_array($c)) $existing = $c;
}
array_unshift($existing, $record);
@file_put_contents($contactsFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

// 2. Format and Send Notification Email to BOTH administrators
$recipients = [
    'wisdom@vasudhapharma.com',
    'saikrishna@zailabs.co.in'
];
$subject = "[VPCL Contact Inquiry] {$contactId}: {$name} — {$department} ({$company})";

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
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">New Website Contact Form Submission</div>
      <div class="badge">' . htmlspecialchars($contactId) . '</div>
    </div>

    <table class="meta-table">
      <tr><td class="label">Contact Name:</td><td class="val"><strong>' . htmlspecialchars($name) . '</strong></td></tr>
      <tr><td class="label">Email Address:</td><td class="val"><a href="mailto:' . htmlspecialchars($email) . '" style="color:#0E8F6C; font-weight:600;">' . htmlspecialchars($email) . '</a></td></tr>
      <tr><td class="label">Phone:</td><td class="val">' . htmlspecialchars($phone ?: 'Not provided') . '</td></tr>
      <tr><td class="label">Organisation:</td><td class="val">' . htmlspecialchars($company ?: 'Not provided') . '</td></tr>
      <tr><td class="label">Designation:</td><td class="val">' . htmlspecialchars($designation ?: 'Not provided') . '</td></tr>
      <tr><td class="label">Country:</td><td class="val">' . htmlspecialchars($country) . '</td></tr>
      <tr><td class="label">Target Department:</td><td class="val"><strong style="color:#096B51;">' . htmlspecialchars($department) . '</strong></td></tr>';

if ($category) {
    $htmlBody .= '<tr><td class="label">Product Category:</td><td class="val">' . htmlspecialchars($category) . '</td></tr>';
}
if ($product) {
    $htmlBody .= '<tr><td class="label">Product Name:</td><td class="val"><strong>' . htmlspecialchars($product) . '</strong></td></tr>';
}
if ($quantity) {
    $htmlBody .= '<tr><td class="label">Estimated Quantity:</td><td class="val">' . htmlspecialchars($quantity) . '</td></tr>';
}
if ($mfgType) {
    $htmlBody .= '<tr><td class="label">Manufacturing Type:</td><td class="val">' . htmlspecialchars($mfgType) . '</td></tr>';
}
if ($rndType) {
    $htmlBody .= '<tr><td class="label">R&amp;D Requirement:</td><td class="val">' . htmlspecialchars($rndType) . '</td></tr>';
}
if ($foundation) {
    $htmlBody .= '<tr><td class="label">Foundation Area:</td><td class="val">' . htmlspecialchars($foundation) . '</td></tr>';
}
if ($profileUrl) {
    $htmlBody .= '<tr><td class="label">LinkedIn / URL:</td><td class="val"><a href="' . htmlspecialchars($profileUrl) . '" target="_blank">' . htmlspecialchars($profileUrl) . '</a></td></tr>';
}

$htmlBody .= '<tr><td class="label">Submitted At:</td><td class="val">' . htmlspecialchars($dateStr) . '</td></tr>
    </table>

    <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Message / Inquiry Details:</div>
    <div class="msg-box">' . htmlspecialchars($message ?: 'No additional message provided.') . '</div>

    <div class="footer">
      Vasudha Pharma Chem Limited &bull; Inbound Communications Desk
    </div>
  </div>
</body>
</html>';

$serverHost = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com');
$mailDomain = (strpos($serverHost, 'mytemp.website') !== false || empty($serverHost)) ? 'vasudhapharma.com' : $serverHost;

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Vasudha Contact Desk <noreply@' . $mailDomain . '>',
    'Reply-To: ' . $email,
    'Auto-Submitted: auto-generated',
    'X-Auto-Response-Suppress: All',
    'X-Mailer: VasudhaDesk/1.0'
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
            '_subject'     => $subject,
            '_replyto'     => $email,
            '_cc'          => 'saikrishna@zailabs.co.in',
            'Contact_ID'   => $contactId,
            'Submitted_At' => $dateStr,
            'Name'         => $name,
            'Email'        => $email,
            'Phone'        => $phone ?: 'Not provided',
            'Company'      => $company ?: 'Not provided',
            'Designation'  => $designation ?: 'Not provided',
            'Country'      => $country,
            'Department'   => $department,
            'Category'     => $category ?: '—',
            'Product'      => $product ?: '—',
            'Quantity'     => $quantity ?: '—',
            'Message'      => $message ?: '—'
        ]);

        $ch = curl_init('https://formsubmit.co/ajax/wisdom@vasudhapharma.com');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $relayPayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: VasudhaContact/1.0'
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
        $descLines = [
            '=== WEBSITE CONTACT FORM ===',
            'Department: ' . ($department ?: '—'),
            'Designation: ' . ($designation ?: '—'),
            'Company: ' . ($company ?: '—'),
            'Country: ' . ($country ?: '—')
        ];
        if ($category) $descLines[] = 'Product Category: ' . $category;
        if ($product) $descLines[] = 'Product: ' . $product;
        if ($quantity) $descLines[] = 'Estimated Quantity: ' . $quantity;
        if ($mfgType) $descLines[] = 'Manufacturing Inquiry: ' . $mfgType;
        if ($rndType) $descLines[] = 'R&D Requirement: ' . $rndType;
        if ($foundation) $descLines[] = 'Foundation Area: ' . $foundation;
        if ($profileUrl) $descLines[] = 'LinkedIn / URL: ' . $profileUrl;
        $descLines[] = '';
        $descLines[] = 'Message:';
        $descLines[] = $message ?: '—';
        $description = implode("\n", $descLines);

        $zohoFields = [
            'xnQsjsdp'    => 'b8e658fb5ade04176bfdfb6f74e4217cbec006e2c955226df4855aec0bb7de92',
            'zc_gad'      => '',
            'xmIwtLD'     => '037d840b8b2ced74645b10ffbc644734063aa7185a0558216e0bc3fbfc614f804063ece5c7df9c085d5ee35483e2090b',
            'actionType'  => 'TGVhZHM=',
            'returnURL'   => 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vasudhapharma.com') . '/home.html',
            'Last Name'   => $name,
            'Email'       => $email,
            'Phone'       => $phone,
            'Company'     => $company ?: 'Not provided',
            'Country'     => $country,
            'Designation' => $designation,
            'LEADCF15'    => $department,
            'Description' => $description,
            'Lead Source' => 'Website Contact',
            'Lead Status' => 'Not Contacted'
        ];
        if ($category) $zohoFields['LEADCF5'] = $category;
        if ($product)  $zohoFields['LEADCF6'] = $product;
        if ($quantity) $zohoFields['LEADCF2'] = $quantity;
        if ($mfgType)  $zohoFields['LEADCF16'] = $mfgType;

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
    'ok'            => true,
    'id'            => $contactId,
    'mailSent'      => ($mailSentCount > 0 || $relaySent),
    'zohoSent'      => $zohoSent,
    'recipients'    => $recipients,
    'message'       => 'Thank you. Your message has been received and routed to our team.'
]);
