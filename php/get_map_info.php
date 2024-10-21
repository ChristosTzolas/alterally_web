<?php
include 'dbConn.php'; // Your database connection file

// Fetch pending requests with additional information
$requestsQuery = "SELECT r.id, r.details, u.latitude, u.longitude, u.name, u.phone, r.created_at 
                  FROM requests r
                  JOIN users u ON r.user_id = u.user_id 
                  WHERE r.status = 'pending' OR r.status ='accepted' or r.status = 'completed'";
$requestsResult = mysqli_query($link, $requestsQuery);
$requests = mysqli_fetch_all($requestsResult, MYSQLI_ASSOC);

// Fetch active citizen responses with additional information
$responsesQuery = "SELECT cr.id, cr.response_details, u.latitude, u.longitude, u.name, u.phone, cr.created_at 
                   FROM citizen_responses cr
                   JOIN users u ON cr.citizen_id = u.user_id 
                   WHERE cr.status = 'pending' OR cr.status = 'accepted' or cr.status = 'completed'";
$responsesResult = mysqli_query($link, $responsesQuery);
$responses = mysqli_fetch_all($responsesResult, MYSQLI_ASSOC);

// Prepare data for JSON
$data = [
    'requests' => $requests,
    'responses' => $responses
];

// Output JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
