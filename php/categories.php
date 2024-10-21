<?php
include "dbConn.php"; // Make sure this path is correct
session_start();

// Assuming you have a table named `disaster_type` with fields `id` and `name`
$sql = "SELECT `id`, `name` FROM `disaster_type` ORDER BY `name` ASC";

$result = mysqli_query($link, $sql);
$disasterTypes = array();

while ($row = mysqli_fetch_assoc($result)) {
    $disasterTypes[] = $row;
}

echo json_encode($disasterTypes);
?>
