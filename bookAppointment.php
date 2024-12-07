<?php
// Connect to the database
$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "esmile_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON input from the frontend
$data = json_decode(file_get_contents("php://input"), true);

// Extract the date and time
$date = $data['date'];
$time = $data['time'];

// Insert appointment into the database
$sql = "INSERT INTO appointment (Appointment_date, Appointment_time) VALUES ('$date', '$time')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Appointment booked successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to book the appointment."]);
}

$conn->close();
?>
