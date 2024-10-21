<?php
session_start();
include "dbConn.php"; // Database connectionie("Connection failed: " . $conn->connect_error);
$user_id = $_POST['user_id'];

$query = "SELECT c.cargo_id, c. item_id, c.quantity, i.name FROM cargo as c 
          INNER JOIN items as i ON c.item_id = i.id INNER JOIN users 
          ON c.user_id = users.user_id WHERE c.user_id = $user_id 
          AND c.quantity > 0";
$result = mysqli_query($link, $query);

$cargo = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $cargo[] = $row;
    }
    echo json_encode($cargo);
} else {
    echo json_encode([]);
}

?>
