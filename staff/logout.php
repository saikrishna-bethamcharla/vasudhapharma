<?php
require __DIR__ . '/includes/auth.php';
staff_logout();
header('Location: index.php');
exit;
