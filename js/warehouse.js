$(document).ready(function() {
    loadCategories(); //autorun during page start up
});

// Function to handle category filter change
$('#categoryFilter').change(function() {
    loadItems(); // This will reload items based on the new filter selection
});

function loadCategories() {
    // Fetch categories and populate the category filter dropdown
    $.ajax({
        url: "./php/get_disaster_types.php", // Update this path to your PHP script that fetches categories
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            categories.forEach(function(category) { //loop for each elemeent
                $('#categoryFilter').append(new Option(category.name, category.id));//find item with id "categoryFilter" add it to the dropdown List
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading categories:', textStatus, errorThrown);
        }
    });
}

function loadItems() {
    // Fetch items and populate the table
    const selectedCategory = $('#categoryFilter').val(); // Assuming this will be a single value
    $.ajax({
        url: "./php/wh_items.php",
        type: 'GET',
        data: { category_id: selectedCategory[0] }, // Send the selected category to the server 'first column is unique id'
        dataType: 'json',
        success: function(response) {
            const tableBody = $('#warehouseTable tbody');
            tableBody.empty();

            // Check if the response contains items
            if (response.items && response.items.length > 0) {
                response.items.forEach(function(item) {
                    tableBody.append(`
                    <tr>
                        <td class="px-6 py-4">${item.name}</td>
                        <td class="px-6 py-4">${item.category_name}</td> <!-- Use the alias from the SQL query -->
                        <td class="px-6 py-4">${item.quantity}</td>
                    </tr>
                `);
                });
            } else if (response.error) {
                // Handle any errors
                console.error('Error:', response.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading items:', textStatus, errorThrown);
        }
    });
}

