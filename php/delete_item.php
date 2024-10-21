<?php
	include "dbConn.php";

	$id = $_POST['id'] ?? '';

	$response = [];

	if ($id) {
		// Prepare a delete statement
		$stmt = $link->prepare("DELETE FROM items WHERE id = ?");
		$stmt->bind_param("i", $id);
		
		if ($stmt->execute()) {
			$response['success'] = true;
		} else {
			$response['error'] = "Error: " . $stmt->error;
		}
		
		$stmt->close();
	} else {
		$response['error'] = 'Missing item ID.';
	}

	header('Content-Type: application/json');
	echo json_encode($response);
?>
