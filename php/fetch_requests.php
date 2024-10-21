<?php
	include "dbConn.php"; // Database connection

	// Joint query to select the requests info made by the user as well as the rescuer info who carries it out
	$query = "SELECT r.id, r.details, r.people as quantity, u.latitude, u.longitude, u.name, u.phone, r.created_at, r.status, 
			  u2.user_id AS taken_over_by_id, u2.name AS taken_over_by_name, u2.phone AS phone, i.name AS item_name, i.quantity 
			  AS item_quantity FROM requests r JOIN users u ON r.user_id = u.user_id LEFT JOIN users u2 ON r.taken_over_by = u2.user_id
			  LEFT JOIN items i ON r.item_id = i.id WHERE r.status IN ('pending', 'accepted', 'completed')
			  ";
	$result = mysqli_query($link, $query);

	$requests = [];
	while ($row = mysqli_fetch_assoc($result)) {
		$requests[] = $row;
	}

	echo json_encode($requests);

	mysqli_close($link);
?>
