<?php
	include "dbConn.php";

	$id = $_POST['id'] ?? '';
	$name = $_POST['name'] ?? '';
	$description = $_POST['description'] ?? '';

	$response = [];

	if ($name && $description) {
		if ($id) {
			// Update existing item
			$query = "UPDATE items SET name = '$name', description = '$description' WHERE id = $id";
		} else {
			// Insert new item
			$query = "INSERT INTO items (name, description) VALUES ('$name', '$description')";
		}

		if (mysqli_query($link, $query)) {
			$response['success'] = true;
		} else {
			$response['error'] = "Error: " . mysqli_error($link);
		}
	} else {
		$response['error'] = 'Missing name or description.';
	}

	header('Content-Type: application/json');
	
	echo json_encode($response);
?>



