<?php
// Connect to the database
session_start(); // Start the session

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "mrc_db"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON input from the frontend (sent via fetch API)
$data = json_decode(file_get_contents("php://input"), true);

// Extract the date and time from the received data
$date = $data['date'];
$time = $data['time'];

// Prepare the SQL query to insert the appointment into the database
$sql = "INSERT INTO appointments (appointment_date, appointment_time) VALUES ('$date', '$time')";

if ($conn->query($sql) === TRUE) {
    // If the query is successful, send a success response
    echo json_encode(["success" => true, "message" => "Appointment booked successfully!"]);
} else {
    // If there's an error, send a failure response
    echo json_encode(["success" => false, "message" => "Failed to book the appointment."]);
}

// Close the database connection
$conn->close();
?>
