<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Debug: Start of the script
error_log("Debug: Script started");

// Database connection
$host = 'localhost';
$dbname = 'esmile_db';
$username = 'root';
$password = '';

// Create connection using mysqli
$mysqli = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Query to fetch appointments from the database
$sql = "SELECT Appointment_date, Appointment_time FROM appointment";
$result = $mysqli->query($sql);

// Prepare the appointments array
$appointments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }
}

// Return the data as JSON
echo json_encode($appointments);

// Close the database connection
$mysqli->close();
?>
