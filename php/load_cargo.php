<?php
session_start();
include "dbConn.php"; // Database connection

$user_id = $_POST['user_id'];
$item_id = $_POST['item_id'];
$quantity = $_POST['quantity'];


// Check the current quantity before proceeding
$checkQuantityQuery = "SELECT quantity FROM ITEMS WHERE id = '$item_id'";
$checkResult = mysqli_query($link, $checkQuantityQuery);
$checkRow = mysqli_fetch_assoc($checkResult);

if ($checkRow && $checkRow['quantity'] >= $quantity) {
    // Proceed if there is enough quantity
    $insertQuery = "INSERT INTO cargo (user_id, item_id, quantity) VALUES ('$user_id', '$item_id', '$quantity')";
    $updateQuery = "UPDATE ITEMS SET quantity = quantity - '$quantity' WHERE id = '$item_id' AND quantity >= '$quantity'";

    $insertResult = mysqli_query($link, $insertQuery);

    if ($insertResult) {
        $updateResult = mysqli_query($link, $updateQuery);
        if ($updateResult) {
            echo 1;
        } else {
            echo json_encode("Error updating quantity: " . mysqli_error($link));
        }
    } else {
        echo json_encode("Error inserting record: " . mysqli_error($link));
    }
} else {
    echo 0;
}

mysqli_close($link);
?>
