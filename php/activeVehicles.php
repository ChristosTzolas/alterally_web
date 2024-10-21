<?php
include "dbConn.php"; // Include your database connection script

// Prepare the SQL statement to select username and role fields
$query = "SELECT u.user_id, u.username, u.email, u.name, u.phone, u.latitude, u.longitude, u.role,
          COUNT(DISTINCT r.id) AS request_count, COUNT(DISTINCT cr.id) AS response_count, 
          (COUNT(DISTINCT r.id) + COUNT(DISTINCT cr.id)) AS total_task_count FROM users u LEFT JOIN 
          requests r ON u.user_id = r.taken_over_by AND r.status IN ('accepted', 'pending')
          LEFT JOIN citizen_responses cr ON u.user_id = cr.taken_over_by AND cr.status IN ('accepted', 'pending')
          WHERE u.role = 'emt' GROUP BY u.user_id, u.username, u.email, u.name, u.phone, u.latitude, u.longitude, u.role
          HAVING total_task_count > 0
          ";

// Execute the query
$result = mysqli_query($link, $query);

// Check for errors in the SQL execution
if (!$result) {
    echo json_encode(['error' => mysqli_error($link)]);
    exit;
}

// Fetch all rows as an associative array
$userRoles = mysqli_fetch_all($result, MYSQLI_ASSOC);

// Set header to return JSON
header('Content-Type: application/json');

// Echo the user roles as a JSON string
echo json_encode($userRoles);
?>





