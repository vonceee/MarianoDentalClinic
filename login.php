<?php
include 'db_connection.php';

// Start the session
session_start();

// Check if form data is set
if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM patient_details WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the hashed password
        if (password_verify($password, $user['Password'])) {
            // Store user information in session variables
            $_SESSION['user_id'] = $user['P_ID'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['region'] = $user['region'];
            $_SESSION['account_type'] = 'patient'; // Assuming account type for this table

            // Redirect to the homepage
            header("Location: homepage.php");
            exit();
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No account found with that email.";
    }

    // Close the statement
    $stmt->close();
} else {
    echo "Please fill in both email and password.";
}

// Close the connection
$conn->close();
?>