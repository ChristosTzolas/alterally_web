<?php
include "dbConn.php"; // Ensure this points to the correct file that establishes a database connection

// Initialize the response array
$response = [
    'success' => false,
    'totalItems' => 0,
    'lowStockItems' => 0
];

// Query to count the total number of items
$totalItemsQuery = "SELECT COUNT(*) AS total FROM items";
$totalItemsResult = mysqli_query($link, $totalItemsQuery);
if ($totalItemsResult) {
    $totalItemsRow = mysqli_fetch_assoc($totalItemsResult);
    $response['totalItems'] = (int) $totalItemsRow['total'];
} else {
    $response['error'] = 'Error retrieving total items: ' . mysqli_error($link);
    exit(json_encode($response));
}

// Query to count the number of low stock items (assuming low stock is defined as quantity below 10)
$lowStockQuery = "SELECT COUNT(*) AS lowStock FROM items WHERE quantity < 10";
$lowStockResult = mysqli_query($link, $lowStockQuery);
if ($lowStockResult) {
    $lowStockRow = mysqli_fetch_assoc($lowStockResult);
    $response['lowStockItems'] = (int) $lowStockRow['lowStock'];
} else {
    $response['error'] = 'Error retrieving low stock items: ' . mysqli_error($link);
    exit(json_encode($response));
}

// If both queries were successful
$response['success'] = true;

// Set header to return JSON
header('Content-Type: application/json');

// Output the response in JSON format
echo json_encode($response);
?>
