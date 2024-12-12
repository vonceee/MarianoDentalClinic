<?php
// Database connection credentials
$servername = "localhost";
$username = "root";
$password = "";
$database = "esmile_db";

// Establish database connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if ID is provided via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $appointmentID = intval($_POST['id']); // Sanitize input to ensure it's an integer

    // Prepare the DELETE query
    $sql = "DELETE FROM appointment WHERE Appointment_ID = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("i", $appointmentID); // Bind the appointment ID
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo "Appointment successfully canceled.";
            } else {
                echo "Appointment not found or already canceled.";
            }
        } else {
            echo "Error canceling appointment: " . $conn->error;
        }
        $stmt->close();
    } else {
        echo "Failed to prepare the statement.";
    }
} else {
    echo "Invalid request. Appointment ID is required.";
}

// Close the database connection
$conn->close();
?>
