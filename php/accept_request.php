<?php
include 'dbConn.php'; // Your database connection file

$requestId = $_POST['id'] ?? null;
if ($requestId) {
    $updateQuery = "UPDATE requests SET status = 'accepted' WHERE id = $requestId";
    $result = mysqli_query($link, $updateQuery);

    if ($result) {
        echo 1;
    } else {
        echo 0 . mysqli_error($link);
    }
} else {
    echo "Request ID is missing.";
}
?>
