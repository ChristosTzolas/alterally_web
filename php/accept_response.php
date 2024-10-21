<?php
include 'dbConn.php'; // Your database connection file

$responseId = $_POST['id'] ?? null;
if ($responseId) {
    $updateQuery = "UPDATE citizen_responses SET status = 'completed' WHERE id = $responseId";
    $result = mysqli_query($link, $updateQuery);

    if ($result) {
        echo 1;
    } else {
        echo 0 . mysqli_error($link);
    }
} else {
    echo "Response ID is missing.";
}
?>
