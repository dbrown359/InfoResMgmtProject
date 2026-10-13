<?php
$servername = "localhost";
$username   = "root";
$password   = ""; 
$dbname     = "missiondataintake";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>