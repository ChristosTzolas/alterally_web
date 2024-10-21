$(document).ready(function() {
    const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
    const userId = loggedUser ? loggedUser[0].user_id : null;
    console.log(userId);
    loadUserInfo();
    loadOffers();

    // Toggle notification panel
    $('#notificationBell').click(function() {
        $('#notificationPanel').removeClass('hidden');
    });

    $('#closePanel').click(function() {
        $('#notificationPanel').addClass('hidden');
    });

    // Load disaster categories
    $.ajax({
        url: "./php/get_disaster_types.php",
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            categories.forEach(function(category) {
                $('#categoryFilter').append(new Option(category.name, category.id));
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading categories:', textStatus, errorThrown);
        }
    });

    // Event listener for category change
    $('#categoryFilter').change(function() {
        var selectedCategory = $(this).val();
        updateItemsDropdown(selectedCategory);
    });

    // Fetch items in need for admin view
    $.ajax({
        type: "GET",
        url: "./php/items_in_need.php",
        dataType: "json",
        success: function(response) {
            var itemsDropdown = $("#itemsToMark");
            itemsDropdown.empty();
            response.forEach(function(item) {
                itemsDropdown.append(`<option value="${item.id}">${item.name}</option>`);
            });
        },
        error: function(error) {
            console.error("Error loading items for admin:", error);
        }
    });

    $('#itemSelection').change(function() {
        let selectedItemId = $(this).val(); // Get the selected item ID from the dropdown
        $('#selectedItemId').val(selectedItemId); // Set the selected item ID in the hidden input
    });

    function updateItemsDropdown(categoryId) {
        $('#itemSelection').empty(); // Clear existing options
        console.log(categoryId);
    
        // AJAX call to get items based on selected category
        $.ajax({
            type: 'POST',
            url: './php/get_items_by_category.php', // Path to PHP script to get items by category
            data: { categoryId: categoryId },
            dataType: 'json', // Expecting JSON response
            success: function(items) {
                items.forEach(function(item) {
                    $('#itemSelection').append(new Option(item.name, item.id));
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error loading items:', textStatus, errorThrown);
            }
        });
    }

    // Autocomplete search functionality
    $('#itemSearch').on('input', function() {
        var searchQuery = $(this).val();

        if (searchQuery.length >= 3) {
            // Perform AJAX request to get search results
            $.ajax({
                url: './php/search_items.php', // Server endpoint that returns search results
                type: 'POST',
                data: { query: searchQuery },
                dataType: 'json',
                success: function(items) {
                    var resultsHtml = '';
                    items.forEach(function(item) {
                        // Ensure each item has a `data-itemid` attribute
                        resultsHtml += `<div class="search-result-item" data-itemid="${item.id}">${item.name}</div>`;
                    });
                    $('#searchResults').html(resultsHtml);
                },
                error: function() {
                    $('#searchResults').html('<div>Error loading results</div>');
                }
            });
        } else {
            $('#searchResults').empty();
        }
    });

    $('#searchResults').on('click', '.search-result-item', function() {
    let selectedItemName = $(this).text();
    let selectedItemId = $(this).data('itemid'); 

    $('#itemSearch').val(selectedItemName); 
    $('#selectedItemId').val(selectedItemId);
    
    $('#searchResults').empty(); 
});


    // Submit request functionality
    
   // Submit request functionality
    $('#submitRequest').click(function() {
        const quantity = $('#quantity').val();
        const selectedItemId = $('#selectedItemId').val(); // Get the selected item ID from the hidden input
        const selectedItemName = $('#selectedItemText').val(); // Assuming you want the name from the text input
        const requestDetails = $('#requestDetails').val();
        const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
        const userId = loggedUser ? loggedUser[0].user_id : null;
        console.log(selectedItemId,quantity);
        if (!userId) {
            Swal.fire('Error', 'User is not logged in', 'error');
            return;
        }
    
        if (!selectedItemId || quantity <= 0) {
            Swal.fire('Error', 'Please select an item and specify a valid quantity', 'error');
            return;
        }
    
        $.ajax({
            type: 'POST',
            url: './php/submit_request.php',
            data: {
                userId: userId,
                itemId: selectedItemId,
                requestDetails: requestDetails,
                quantity: quantity
            },
            success: function(response) {
                Swal.fire(response == 1 ? 'Success' : 'Error', 
                          response == 1 ? 'Request submitted successfully' : 'Failed to submit request', 
                          response == 1 ? 'success' : 'error');
                setTimeout(function() {
                    location.reload();}, 1500);
            },
            error: function() {
                Swal.fire('Error', 'Error in submitting request', 'error');
            }
        });
    });


    function loadOffers() {
        let usr = JSON.parse(localStorage.getItem("logged_user"));
        let usrId = loggedUser ? loggedUser[0].user_id : null;
        $.ajax({
            type: "GET",
            url: "./php/fetch_responses.php",
            data: { usrId: usrId }, // Pass userId as a parameter
            dataType: "json",
            success: function (offers) {
                populateOffersTable(offers);
            }
        });
    }
    
    
    function populateOffersTable(offers) {
        const tableBody = document.getElementById('responsesTable');
        
        if (!Array.isArray(offers) || offers.length === 0) {
            console.error('Invalid or empty offers array:', offers);
            return;
        }
    
        tableBody.innerHTML = ''; // Clear existing rows
    
        offers.forEach(offer => {
            const isDisabled = offer.status === 'completed' || offer.status === 'cancelled';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${offer.id}
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${offer.item_name}
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${offer.response_details}
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${offer.status}
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${new Date(offer.created_at).toLocaleDateString()}
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button ${isDisabled ? 'disabled style="opacity: 0.5;"' : ''} onclick="cancelResponse(${offer.id}, ${isDisabled})">
                        <img src="./icons/delete.png" class="h-6 w-6">
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
        $.ajax({
            type: "POST",
            url: "./php/get_requests.php", 
            data: {
                userId: userId,
            },
            dataType: "json",
            success: function(response) {
                populateReqeuestsTable(response)
            },
            error: function(err) {
                console.error("Error loading user requests:", err);
            }
        });

        function populateReqeuestsTable(response) {
            const tableBody = document.getElementById('requestsTable');
            tableBody.innerHTML = ''; // Clear existing rows
            response.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        ${request.name}
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        ${request.created_at}
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        ${request.status}
                    </td>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }


    // Handle form submission for marking items as in need
    $('#markItemsInNeedForm').on('submit', function(e) {
        e.preventDefault();
        var selectedItems = $('#itemsToMark').val();

        if (selectedItems.length > 0) {
            Swal.fire({
                title: 'Items Marked as In Need',
                text: `Items with IDs: ${selectedItems.join(', ')} have been marked as in need.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire('Error', 'No items selected', 'error');
        }
    });
});

// Notification array and functions
var notifications = [];

function addNotification(title, message) {
    notifications.push({ title, message });
    updateNotificationPanel();
}

function updateNotificationPanel() {
    var notificationsHtml = notifications.map((notification, index) =>
        `<div class="p-2 mb-2 bg-gray-200  hover:bg-gray-300 rounded shadow" id="notification-${index}">
            <h4 class="font-bold">${notification.title}</h4>
            <p>${notification.message}</p>
            <button onclick="deleteNotification(${index})" class="bg-gray-200 hover:bg-gray-500 text-white p-1 rounded"><img src="./icons/bin.png" class="h-6 w-6"></button>
        </div>`
    ).join('');
    $('#notificationsList').html(notificationsHtml);
}


function checkForNotifications() {
    var storedNotification = localStorage.getItem('newNotification');
    if (storedNotification) {
        var notification = JSON.parse(storedNotification);
        addNotification(notification.title, notification.message);
        localStorage.removeItem('newNotification'); // Clear the notification after displaying it
    }
}

// Set an interval to check for notifications periodically
setInterval(checkForNotifications, 10000); // Checks every 10 seconds

function deleteNotification(index) {
    // Remove the notification from the array
    notifications.splice(index, 1);

    // Update Local Storage
    localStorage.setItem('newNotification', JSON.stringify(notifications));

    // Update the notification panel
    updateNotificationPanel();
}



$('#markItemsToGive').on('submit', function(e) {
    e.preventDefault();
    const selectedItems = $('#itemsToMark').val();
    const responseDetails = $('#responseDetails').val();
    const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
    const userId = loggedUser[0].user_id
    console.log("details:",responseDetails);
    if (userId && selectedItems.length > 0) {
        $.ajax({
            type: "POST",
            url: "./php/mark_items_to_give.php", // Path to your server-side script
            data: {
                items: selectedItems,
                userId: userId,
                responseDetails: responseDetails
            },
            success: function(response) {
                if (response == 1) {
                    fireFeedback("success");
                } else {
                    Swal.fire('Error', 'There was an unexpected issue', 'error');
                }
            },
            error: function(error) {
                // Handle errors - Display error message
                Swal.fire('Error', 'There was an error processing your request', 'error');
            }
        });
    } else {
        if (!userId) {
            Swal.fire('Error', 'User is not logged in', 'error');
        } else {
            Swal.fire('Error', 'No items selected', 'error');
        }
    }
});


function editUserInfo(field) {
    Swal.fire({
        title: `Edit ${field}`,
        input: field === 'password' ? 'password' : 'text',
        inputPlaceholder: `Enter new ${field}`,
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: (newValue) => {
            return updateUserInfo(field, newValue);
        }
    });
}

function updateUserInfo(field, newValue) {
    if (field === 'password') {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!strongRegex.test(newValue)) {
            Swal.fire('Error', 'Password does not meet the requirements.', 'error');
            return;
        }
    }

    $.ajax({
        type: "POST",
        url: "./php/update_user_info.php",
        data: { field: field, value: newValue },
        success: function(response) {
            if (response == 1) {
                Swal.fire('Updated!', 'Your information has been updated.', 'success');
                if (field !== 'password') {
                    $(`#user${field.charAt(0).toUpperCase() + field.slice(1)}`).text(newValue);
                }
            } else {
                Swal.fire('Error', 'There was an issue updating your information.', 'error');
            }
        },
        error: function(xhr, status, error) {
            Swal.fire('Error', 'There was an issue updating your information: ' + xhr.responseText, 'error');
        }
    });
}

function loadUserInfo() {
    $.ajax({
        type: "GET",
        url: "./php/fetch_user_info.php",
        dataType: "json",
        success: function(response) {
            $('#userName').text(response.username);
            $('#userEmail').text(response.email);
            $('#name').text(response.name);
            $('#userPhone').text(response.phone);
        }
    });
}

function cancelResponse(responseId) {
    $.ajax({
        type: 'POST',
        url: './php/cancelResponse.php',
        data: { id: responseId },
        success: function(result) {
            fireFeedback("delete"); 
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}



// Helper function for feedback regarding like/dislike/inventory
function fireFeedback(indicator) {
    let config;
  
    if (indicator === "success") {
      config = {
        icon: 'success',
        title: 'Response',
        text: 'Your response has been submitted!',
        background: '#f1f5f9',
        timer: 1500,
        showConfirmButton: false
      };
    } else if (indicator === "delete") {
      config = {
          icon: 'error', //
          title: 'Cancelled',
          text: 'You cancelled the pickup',
          timer: 1500,
          showConfirmButton: false
      };
    } else {
      return; // Invalid indicator
    }
  
    Swal.fire(config);
    setTimeout(function() {location.reload();}, 1500);
  }
  
