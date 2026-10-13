<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$sql = "SELECT * FROM goals ORDER BY goal_id DESC";
$result = $conn->query($sql);

$goals = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $goals[] = $row;
    }
}

echo json_encode($goals);
$conn->close();
?>