<?php
include "dbConn.php"; // Your database connection file

$userId = $_POST['userId'] ?? null;
$items = $_POST['items'] ?? []; // Assuming items are now item IDs
$responseDetails = $_POST['responseDetails'] ?? null; // Get response details from POST data

// Check if the user ID is present, items are not empty, and response details are provided
if ($userId && !empty($items) && $responseDetails !== null) {
    $success = true;

    // Loop through each item ID and insert into the database
    foreach ($items as $itemId) {
        // Direct SQL query without sanitization or prepared statements
        $query = "INSERT INTO citizen_responses (citizen_id, item_id, response_details, status) 
                  VALUES ($userId, $itemId, '$responseDetails', 'pending')";
        $result = mysqli_query($link, $query);

        if (!$result) {
            $success = false;
            // Break the loop if an error occurs
            break;
        }
    }

    if ($success) {
        echo 1;
    } else {
        // Output error information for debugging purposes
        echo "Error: " . mysqli_error($link);
    }
} else {
    echo "No user ID provided, no items selected, or response details missing.";
}

// Close the database connection
mysqli_close($link);
?>