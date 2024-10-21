<?php
session_start();
include "dbConn.php"; // Database connection file

$userId = $_SESSION['user_id']; // Assuming user_id is stored in session

// Prepare an array to hold the response
$responseData = array();

// Query to fetch requests
$queryRequests = "SELECT r.id, r.item_id, r.details as details, r.created_at, r.status, r.people, 
                  u.name as citizenName, u.phone as citizenPhone, u.latitude, u.longitude, 
                  i.name as itemName
                  FROM requests r 
                  JOIN users u ON r.user_id = u.user_id 
                  LEFT JOIN items i ON r.item_id = i.id
                  WHERE r.taken_over_by = '$userId' AND (r.status = 'accepted' OR r.status = 'completed')";



$resultRequests = mysqli_query($link, $queryRequests);

if ($resultRequests) {
    while ($row = mysqli_fetch_assoc($resultRequests)) {
        $row['type'] = 'request'; // Add a type key to distinguish between requests and responses
        $responseData[] = $row;
    }
}

// Query to fetch responses
$queryResponses = "SELECT cr.id, cr.item_id, cr.response_details as details, cr.created_at, cr.status, cr.people, 
                   u.name as citizenName, u.phone as citizenPhone, u.latitude, u.longitude,
                   i.name as itemName
                   FROM citizen_responses cr 
                   JOIN users u ON cr.citizen_id = u.user_id 
                   LEFT JOIN items i ON cr.item_id = i.id
                   WHERE cr.taken_over_by = '$userId' AND (cr.status = 'accepted' OR cr.status = 'completed')";

$resultResponses = mysqli_query($link, $queryResponses);

if ($resultResponses) {
    while ($row = mysqli_fetch_assoc($resultResponses)) {
        $row['type'] = 'response'; // Add a type key to distinguish between requests and responses
        $responseData[] = $row;
    }
}

// Close the database connection
mysqli_close($link);

// Return the response data as JSON
echo json_encode($responseData);
?>