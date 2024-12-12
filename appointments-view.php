<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check Appointments</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .content {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
        }
        .appointment-section {
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0d6efd;
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
        }
        .appointment-list {
            max-height: 400px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <!-- Check Appointments Section -->
        <div class="content">
            <div class="header text-center">
                <h2>Check Appointments</h2>
            </div>
            <div class="appointment-section mt-4">
                <div class="appointment-list">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Appointment Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Database connection
                            $conn = new mysqli('localhost', 'root', '', 'esmile_db');

                            // Check connection
                            if ($conn->connect_error) {
                                die("Connection failed: " . $conn->connect_error);
                            }

                            // Fetch appointments securely
                            $sql = "SELECT Appointment_ID, Appointment_date, Appointment_time, Status FROM appointment ORDER BY Appointment_date, Appointment_time";
                            $stmt = $conn->prepare($sql);
                            $stmt->execute();
                            $result = $stmt->get_result();

                            if ($result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($row['Appointment_date']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['Appointment_time']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['Status']) . "</td>";
                                    echo "<td><button class='btn btn-danger btn-sm' onclick='cancelAppointment(" . htmlspecialchars($row['Appointment_ID']) . ")'>Cancel</button></td>";
                                    echo "</tr>";
                                }
                            } else {
                                echo "<tr><td colspan='4' class='text-center'>No appointments found.</td></tr>";
                            }

                            $conn->close();
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script>
        function cancelAppointment(appointmentID) {
            if (confirm('Are you sure you want to cancel this appointment?')) {
                // Use Fetch API for AJAX request
                fetch('cancel_appointment.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `id=${appointmentID}`
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => {
                    alert('Failed to cancel appointment.');
                    console.error('Error:', error);
                });
            }
        }
    </script>
</body>
</html>
