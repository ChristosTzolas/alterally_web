<?php
include "dbConn.php"; // Your database connection file

$responseId = $_POST['id'] ?? null;

if ($responseId) {
    // Direct SQL query without sanitization or prepared statements
    $query = "UPDATE citizen_responses SET status = 'cancelled' WHERE id = $responseId";

    if (mysqli_query($link, $query)) {
        echo json_encode("Response deleted successfully");
    } else {
        echo "Error: " . mysqli_error($link);
    }
} else {
    echo "No ID provided";
}

mysqli_close($link);
?>
