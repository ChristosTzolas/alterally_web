<?php
include "dbConn.php";

// Get userId from the GET parameters
$userId = isset($_GET['usrId']) ? $_GET['usrId'] : null;

if (!$userId) {
    // Handle the case where userId is not provided
    echo json_encode(['error' => 'User ID not provided']);
    exit;
}


$userId = mysqli_real_escape_string($link, $userId);


$query = "SELECT cr.id, cr.response_details, u.latitude, u.longitude, u.name, u.phone, cr.created_at, cr.status, u2.user_id AS taken_over_by_id, 
          u2.name AS taken_over_by_name, u2.phone as phone, i.name AS item_name, i.quantity AS item_quantity 
          FROM citizen_responses cr 
          JOIN users u ON cr.citizen_id = u.user_id 
          LEFT JOIN users u2 ON cr.taken_over_by = u2.user_id 
          LEFT JOIN items i ON cr.item_id = i.id 
          WHERE cr.status IN ('pending', 'accepted', 'completed') 
          AND u.user_id = '$userId'"; // Directly include the escaped userId in the query

$result = mysqli_query($link, $query);

$offers = array();
while ($row = mysqli_fetch_assoc($result)) {
    $offers[] = $row;
}

echo json_encode($offers);

mysqli_close($link);
?>