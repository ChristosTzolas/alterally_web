<?php
include "dbConn.php";
session_start();

if (isset($_POST["username"]) && isset($_POST["new_role"])) {
    $username = mysqli_real_escape_string($link, $_POST["username"]);
    $new_role = mysqli_real_escape_string($link, $_POST["new_role"]);

    // Create the SQL query
    $query = "UPDATE users SET role = '$new_role' WHERE username = '$username'";

    // Execute the query and check for success
    if (mysqli_query($link, $query)) {
        echo json_encode(["success" => true, "message" => "User role updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating user role: " . mysqli_error($link)]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Username or new role not provided."]);
}
?>
