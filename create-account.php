<?php
session_start(); // Start the session

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "esmile_db"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Debugging: Check if form data is being received
    echo '<pre>';
    print_r($_POST);
    echo '</pre>';

    // Get form data
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $region = $_POST['region'];
    $province = $_POST['province'];
    $city_municipality = $_POST['city_municipality'];
    $barangay = $_POST['barangay'];
    $dob = $_POST['dob'];
    $mobile_no = $_POST['mobile_no'];
    $sex = $_POST['sex'];
    $telephone_no = $_POST['telephone_no'];

    // Validate input
    if (empty($first_name) || empty($last_name) || empty($username) || empty($email) || empty($password) || empty($region) || empty($province) || empty($city_municipality) || empty($barangay) || empty($dob) || empty($mobile_no) || empty($sex) || empty($telephone_no)) {
        $_SESSION['error'] = "All fields are required!";
        header('Location: create-account.php');
        exit();
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL query to insert user data
    $stmt = $conn->prepare("INSERT INTO patient_details (first_name, last_name, username, password, email, region, province, city_municipality, barangay, dob, mobile_no, sex, telephone_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        die('MySQL prepare error: ' . $conn->error); // Check for errors in preparation
    }

    $stmt->bind_param("sssssssssssss", $first_name, $last_name, $username, $hashed_password, $email, $region, $province, $city_municipality, $barangay, $dob, $mobile_no, $sex, $telephone_no);

    // Execute query and check for success
    if ($stmt->execute()) {
        $_SESSION['success'] = "Account created successfully!";
        header('Location: index.html');
        exit();
    } else {
        $_SESSION['error'] = "Error creating account. " . $stmt->error; // Display detailed error
        header('Location: create-account.php');
        exit();
    }
}
?>
