<?php
session_start();
include "dbConn.php"; // Database connection

$user_id = $_POST['user_id'];
$item_id = $_POST['item_id'];
$quantity = $_POST['quantity'];

// Further validation and sanitization of inputs...

$query = "UPDATE cargo SET quantity = quantity - $quantity WHERE item_id = $item_id";
$query1 = "UPDATE ITEMS SET quantity = quantity + $quantity WHERE id = $item_id";

// Execute the first query
$result1 = mysqli_query($link, $query);

// Execute the second query if it's defined
if (isset($query1)) {
    $result2 = mysqli_query($link, $query1);
} else {
    $result2 = true; // Set it to true to indicate that it wasn't executed
}

if ($result1 && $result2) {
    echo json_encode("Unoading completed");
} else {
    echo json_encode("Error completing task: " . mysqli_error($link));
}

mysqli_close($link);
?>
