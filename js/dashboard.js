$(document).ready(function() {
    loadDashboardSummary();
    fetchActiveVehicles();
    fetchUsersAndPopulateTable();
    loadItemsForAdmin();
});

function loadDashboardSummary() {
    $.ajax({
        url: './php/dashboard_summary.php', // The PHP file that will return the dashboard summary data
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#totalItems').text(response.totalItems);
                $('#lowStockItems').text(response.lowStockItems);
            } else {
                // Handle failure
                console.error('Failed to load dashboard summary');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error:', status, error);
        }
    });
}

document.getElementById('createRescuerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Function to create rescuer account
    function createRescuerAccount() {
        return new Promise((resolve, reject) => {
            // Get form data
            var name = document.getElementById('rescuerName').value;
            var username = document.getElementById('rescuerUsername').value;
            var email = document.getElementById('rescuerEmail').value;
            var password = document.getElementById('rescuerPassword').value;
            var phone = document.getElementById('rescuerPhone').value;
            var role = document.getElementById('rescuerRole').value; // This will always be 'emt' for rescuer accounts

            // Make an AJAX POST request to create the rescuer account
            $.ajax({
                url: './php/create_emt.php', 
                type: 'POST',
                data: {
                    'name': name,
                    'username': username,
                    'email': email,
                    'password': password,
                    'phone': phone
                },
                success: function(response) {
                    // Resolve the promise on success
                    resolve(response);
                },
                error: function(xhr, status, error) {
                    // Reject the promise on error
                    reject(error);
                }
            });
        });
    }

    // Call createRescuerAccount and handle the promise
    createRescuerAccount().then(response => {
        // Show success message
        Swal.fire('Success', 'Rescuer account created successfully!', 'success');
    }).catch(error => {
        // Show error message
        Swal.fire('Error', 'Error creating account. Please try again.', 'error');
    });
});


function fetchActiveVehicles() {
    fetch('./php/activeVehicles.php')
    .then(response => response.json())
    .then(vehicles => {
        populateVehicles(vehicles);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function populateVehicles(vehicles) {
    console.log(vehicles);
    const tableBody = document.getElementById('activeVehicles');
    tableBody.innerHTML = ''; 
    vehicles.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-4 px-6 border-b border-grey-light">
                <strong>Name:</strong> ${user.name}
            </td>
            <td class="py-4 px-6 border-b border-grey-light">
                <strong>Phone:</strong> ${user.phone}
            </td>
            <td class="py-4 px-6 border-b border-grey-light">
                <strong>Tasks:</strong> ${user.total_task_count}
            </td>
        `;

        tableBody.appendChild(tr);
    });
}


function fetchUsersAndPopulateTable() {
    fetch('./php/user_roles.php')
    .then(response => response.json())
    .then(users => {
        populateTable(users);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function populateTable(users) {
    console.log(users);
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = ''; 
    users.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-4 px-6 border-b border-grey-light">
                <span class="cursor-pointer text-blue-500 hover:text-blue-800" onclick="showUserResponses('${user.username}')">${user.username}</span>
            </td>
            <td id="role-${user.username}" class="py-4 px-6 border-b border-grey-light">${user.role}</td>
            <td class="py-4 px-6 border-b border-grey-light">
                <button onclick="changeUserRole('${user.username}', 'emt')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded">
                    <img src="./icons/handover.png" class="h-5 w-5">
                </button>
                <button onclick="changeUserRole('${user.username}', 'citizen')" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded">
                    <img src="./icons/user.png" class="h-5 w-5">
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}


function loadItemsForAdmin() {
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
}

$(document).ready(function() {
    loadItemsForAdmin();
});


$('#markItemsInNeedForm').on('submit', function(e) {
    e.preventDefault();
    var selectedItemIds = $('#itemsToMark').val(); // Get selected item IDs

    if (selectedItemIds.length > 0) {
        // Get item names from the dropdown options
        var selectedItemNames = selectedItemIds.map(id => {
            return $("#itemsToMark option[value='" + id + "']").text();
        });

        // Create the notification message with item names
        var message = ` ${selectedItemNames.join(', ')} in need!`;

        // Create the notification object
        var newNotification = {
            title: 'Items Marked as In Need',
            message: message
        };

        // Store the notification in Local Storage
        localStorage.setItem('newNotification', JSON.stringify(newNotification));
        
        // Display a success message to the admin
        Swal.fire({
            title: 'Items Marked as In Need',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        // Display an error message if no items are selected
        Swal.fire('Error', 'No items selected', 'error');
    }
});

function uploadJsonFile() {
    var fileInput = document.getElementById('jsonFileInput');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var itemsData = JSON.parse(event.target.result);
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to upload new items.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, upload it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    sendItemsToServer(itemsData);
                }
            });
        };
        reader.readAsText(file);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a JSON file to upload.'
        });
    }
}

function sendItemsToServer(itemsData) {
    $.ajax({
        type: "POST",
        url: "./php/upload_items.php", // Path to your PHP script
        data: JSON.stringify({ items: itemsData }),
        contentType: "application/json",
        success: function(response) {
            // The response from the server should be '1' for success
            if (response == 1) {
                Swal.fire(
                    'Uploaded!',
                    'Your items have been uploaded.',
                    'success'
                );
            } else {
                Swal.fire(
                    'Error!',
                    'There was an issue uploading your items.',
                    'error'
                );
            }
        }
    });
}

function showUserResponses(username) {
    fetch(`./php/fetch_user_responses.php?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(responses => {
        let content = '';
        if (responses.length > 0) {
            content = responses.map(response => `Item ID: ${response.item_id}, Details: ${response.response_details}`).join('<br>');
        } else {
            content = 'No responses available.';
        }

        Swal.fire({
            title: `Responses for ${username}`,
            html: content,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    })
    .catch(error => {
        console.error('Error fetching responses:', error);
    });
}


document.getElementById('graphGenerationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const graphType = document.getElementById('graphType').value;

    // Function to fetch graph data
    function fetchGraphData() {
        return new Promise((resolve, reject) => {
            const url = graphType === 'responses' 
                        ? `./php/graph_responses.php?startDate=${startDate}&endDate=${endDate}`
                        : `./php/graph_requests.php?startDate=${startDate}&endDate=${endDate}`;

            $.ajax({
                url: url,
                type: 'GET',
                success: function(data) {
                    resolve(data);
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    // Call fetchGraphData and handle the promise
    fetchGraphData().then(data => {
        const titleCaseGraphType = graphType.charAt(0).toUpperCase() + graphType.slice(1);
        const chartTitle = `Total ${titleCaseGraphType} from ${startDate} to ${endDate}`;
        const datasetLabel = `Number of ${titleCaseGraphType} by Status`;
        Swal.fire({
            title: chartTitle,
            html: '<canvas id="swalChart" width="400" height="400"></canvas>',
            willOpen: () => {
                const swalCtx = Swal.getPopup().querySelector('#swalChart').getContext('2d');
                const myChart = new Chart(swalCtx, {
                    type: 'bar',
                        data: {
                            labels: ['Pending','Accepted', 'Cancelled', 'Completed'],
                            datasets: [{
                                label: datasetLabel,
                                data: [data.pending, data.accepted, data.cancelled, data.completed],
                                backgroundColor: [
                                    'rgba(249, 105, 114, 0.5)', //Orange
                                    'rgba(54, 162, 235, 0.5)', // Blue
                                    'rgba(255, 99, 132, 0.5)', // Red
                                    'rgba(75, 192, 192, 0.5)' // Green
                                ],
                                borderColor: [
                                    'rgba(249, 105, 114, 0.5)', //Orange
                                    'rgba(54, 162, 235, 1)', // Blue
                                    'rgba(255, 99, 132, 1)', // Red
                                    'rgba(75, 192, 192, 1)' // Green
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            maintainAspectRatio: true,
                            aspectRatio: 2,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                },
            didClose: () => {
                if (myChart) {
                    myChart.destroy();
                }
            }
        });
    }).catch(error => {
        console.error('Error fetching graph data:', error);
        Swal.fire('Error', 'Error fetching graph data. Please try again.', 'error');
    });
});

