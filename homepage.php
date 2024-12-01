<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    // Redirect to login page if not logged in
    header("Location: index.html");
    exit();
}

// Display the homepage content
echo "Welcome to the Homepage!";
echo "<br>Your Account Type: " . $_SESSION['account_type'];
?>

<a href="logout.php">Logout</a>
