<?php
// Include the database connection
include 'db_connection.php';

// Get form data
$email = $_POST['email'];
$password = $_POST['password'];

// Query to check user credentials
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Verify the password
    if ($password === $user['password']) {
        // Start a session to store user information
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['account_type'] = $user['account_type'];
        
        // Redirect to the homepage
        header("Location: homepage.php");
        exit();
    } else {
        echo "Invalid password.";
    }
} else {
    echo "No account found with that email.";
}

// Close the connection
$conn->close();
?>
