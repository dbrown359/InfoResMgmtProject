<?php
// Legacy goal-list endpoint. Returns ONLY the signed-in customer's goals.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('display_errors', '0');
session_start();
if (empty($_SESSION['uid'])) { http_response_code(401); echo json_encode(['error'=>'Sign in first']); exit; }
try {
    require __DIR__ . '/db_connect.php';
    $stmt = $conn->prepare('SELECT goal_id, customer_id, coach_id, title, category, target_hours, duration, created_at FROM goals WHERE customer_id = ? ORDER BY goal_id DESC');
    $stmt->bind_param('i', $_SESSION['uid']);
    $stmt->execute();
    echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
} catch (Throwable $e) {
    error_log('Account-a-Day get_goals: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error'=>'Database error']);
}
