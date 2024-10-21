<?php
	include "dbConn.php";

	$id = $_POST['id'] ?? '';
	$disaster_id = $_POST['disaster_id'] ?? null; // Default to null if not provided
	$name = $_POST['name'] ?? '';
	$description = $_POST['description'] ?? '';

	$response = [];

	if ($name && $description && $disaster_id) {
		if ($id) {
			// Update existing item
			$query = "UPDATE items SET name = '$name', description = '$description', disaster_id = $disaster_id WHERE id = $id";
		} else {
			// Insert new item
			$query = "INSERT INTO items (name, description, disaster_id) VALUES ('$name', '$description', $disaster_id)";
		}

		if (mysqli_query($link, $query)) {
			$response['success'] = true;
		} else {
			$response['error'] = "Error: " . mysqli_error($link);
		}
	} else {
		$response['error'] = 'Missing name, description, or disaster type.';
	}

	header('Content-Type: application/json');
	echo json_encode($response);
?>
