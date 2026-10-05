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

echo json_encode([
    'ok'      => true,
    'id'      => $appRecord['id'],
    'message' => 'Application received successfully',
    'has_cv'  => !empty($uploadedCvPath)
]);
