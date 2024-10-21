var user_id;
$(document).ready(function() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    user_id = logged_user[0].user_id; 
    //checkProximity();
    loadDisasterTypes();
    loadItems();
});

// function fetchRescuerLocation() {
//     fetchData('./php/fetchRescuerLocation.php', function(data) {
//         if (data.latitude && data.longitude) {
//             let rescuerLatLng = L.latLng(data.latitude, data.longitude);
//             checkProximity(rescuerLatLng);
//         } else {
//             console.error('No location data available');
//         }
//     });
// }

// function checkProximity(userLocation) {
//     fetchData('./php/fetch_base_location.php', function(baseData) {
//         let baseLocation = L.latLng(parseFloat(baseData.latitude), parseFloat(baseData.longitude));

//         const distanceToBase = userLocation.distanceTo(baseLocation);
//         const proximityThreshold = 100; // 100 meters

//         if (distanceToBase > proximityThreshold) {
//             Swal.fire({
//                 title: 'Out of Range',
//                 text: `Your location is ${distanceToBase.toFixed(2)} meters from the base. Redirecting to home page.`,
//                 icon: 'warning',
//                 confirmButtonText: 'Ok'
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = 'rescuer_dashboard.html';
//                 }
//             });
//         }
//     });
// }

  
// Function to load disaster types into the selector
function loadDisasterTypes() {
    $.ajax({
        type: "GET",
        url: "./php/get_disaster_types.php", // PHP file that returns a JSON array of disaster types
        dataType: "json",
        success: function(response) {
            var disasterTypeSelector = $('#disasterTypeSelector');
            disasterTypeSelector.empty();
            disasterTypeSelector.append('<option value="">Select a Disaster Type</option>');
            response.forEach(function(type) {
                disasterTypeSelector.append(`<option value="${type.id}">${type.name}</option>`);
            });
        },
        error: function(error) {
            console.error("Error loading disaster types:", error);
        }
    });
  }
  
  function loadItem(itemId) {
    var quantity = $(`#quantity${itemId}`).val();
    $.ajax({
        url: './php/load_cargo.php',
        type: 'POST',
        data: {
            user_id: user_id,
            item_id: itemId,
            quantity: quantity
        },
        success: function(response) {
            var result = JSON.parse(response); // Parse the JSON encoded string
			console.log(result)
            if (result) {
                // If the response is not 0, then the operation was successful
                Swal.fire('Success', 'Item loaded into cargo', 'success');
            }
			else if (result === 0) {
                // If the response is 0, then there is insufficient quantity
                Swal.fire('Error', 'Insufficient quantity', 'error');
            } 
        },
        error: function(xhr, status, error) {
            // Handle any ajax error
            Swal.fire('Error', 'An error occurred: ' + error, 'error');
        }
    });
}


function unloadItem(itemId) {
    var quantity = $(`#quantity${itemId}`).val();
    $.ajax({
        url: './php/unload_cargo.php',
        type: 'POST',
        data: {
            user_id: user_id,
            item_id: itemId,
            quantity: quantity
        },
        success: function(response) {
            Swal.fire('Success', 'Item unloaded from cargo to base', 'success');
        },
        error: function() {
            Swal.fire('Error', 'An error occurred while loading the item.', 'error');
        }
    });
}

  
// Function to load and display items based on the selected disaster type
function loadItems() {
var disasterTypeId = $('#disasterTypeSelector').val(); // Get selected disaster type
$.ajax({
    type: "GET",
    url: "./php/get_items.php",
    data: { disasterTypeId: disasterTypeId },
    dataType: "json",
    success: function(response) {
        var itemList = $("#itemList");
        itemList.empty();
        
        if (response.length > 0) {
            var gridHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
            response.forEach(function(item) {
                gridHtml += `
                    <div class="bg-white rounded-lg shadow hover:shadow-md p-4 transition duration-300">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-lg font-semibold">${item.name}</h3>
                                <p class="text-gray-600">${item.description}</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="number" class="quantity-input form-input mt-1 block w-20 pl-2 pr-2 border rounded-md text-gray-700" id="quantity${item.id}" value="${item.quantity}" data-item-id="${item.id}">
                                <button onclick="loadItem(${item.id})" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Load</button>
                                <button onclick="unloadItem(${item.id})" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Unload</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            gridHtml += '</div>';
            itemList.append(gridHtml);
        } else {
            itemList.append("<div class='text-center text-gray-500'>Please select a disaster type.</div>");
        }
    },
    error: function(error) {
        console.error("Error loading items:", error);
    }
});
}

  
// Event handler for form submission
$('#itemForm').on('submit', function(event) {
event.preventDefault();

const itemId = $('#itemId').val();
const itemName = $('#itemName').val();
const itemDescription = $('#itemDescription').val();

$.ajax({
    url: './php/save_item.php',
    type: 'POST',
    data: {
        id: itemId,
        name: itemName,
        description: itemDescription
    },
    success: function(response) {
        closeModal();
        if (response.success) {
            Swal.fire('Success', 'The item has been saved successfully','success');
            // Reload the item list
            loadItems();
        } else {
            Swal.fire('Error', response.error || 'An error occurred while saving the item.', 'error');
        }
    },
    error: function() {
        Swal.fire('Error', 'An error occurred while saving the item.', 'error');
    }
});
});

// function fetchData(url, callback) {
// fetch(url)
//     .then(response => response.json())
//     .then(data => callback(data))
//     .catch(error => console.error('Error fetching data:', error));
// }

function fetchData(url, callback) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function(data) {
            callback(data);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}
  
  

// $(document).ready(function() {
//     const userId = /* Retrieve the user ID from your application context */;
//     function loadItems(userId, items) {
//         $.ajax({
//             url: './php/loadItems.php', // Path to your loadItems PHP script
//             method: 'POST',
//             data: {
//                 user_id: userId,
//                 items: items
//             },
//             success: function(response) {
//                 console.log(response);
//                 Swal.fire("Items Loaded", "", "success");
//                 // Additional code to update the UI or perform other actions
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error loading items:', error);
//             }
//         });
//     }

//     function unloadItems(userId) {
//         $.ajax({
//             url: './php/unloadItems.php', // Path to your unloadItems PHP script
//             method: 'POST',
//             data: {
//                 user_id: userId
//             },
//             success: function(response) {
//                 console.log(response);
//                 Swal.fire("Items Unloaded", "", "success");
//                 // Additional code to update the UI or perform other actions
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error unloading items:', error);
//             }
//         });
//     }
    
//     function selectItemsToLoad() {
//             $.ajax({
//                 url: './php/fetchAvailableItems.php',
//                 method: 'GET', // Assuming this is a simple fetch operation
//                 success: function(response) {
//                     // Assuming the response is an array of items
//                     const items = JSON.parse(response); // Parse response if it's a JSON string
//                     displayItemsForLoading(items);
//                 },
//                 error: function(xhr, status, error) {
//                     console.error('Error fetching items:', error);
//                 }
//             });
//         }
        
        
//         function displayItemsForLoading(items) {
//             let container = document.createElement('div');
//             container.innerHTML = '<h3>Select Items to Load</h3>';
        
//             items.forEach(item => {
//                 let itemElement = document.createElement('div');
//                 itemElement.innerHTML = `
//                     <p>${item.item_name}: ${item.quantity} available</p>
//                     <input type="number" min="1" max="${item.quantity}" value="1" id="quantity${item.item_id}" />
//                     <button id="loadButton${item.item_id}">Load</button>
//                 `;
//                 container.appendChild(itemElement);
//             });
        
//             document.body.appendChild(container); // Or attach it to a specific element in your HTML
        
//             // Attach event listeners after elements are added to the DOM
//             items.forEach(item => {
//                 const loadButton = document.getElementById(`loadButton${item.item_id}`);
//                 const quantityInput = document.getElementById(`quantity${item.item_id}`);
//                 loadButton.addEventListener('click', () => loadItem(item.item_id, quantityInput.value));
//             });
//         }
        
        
//         function loadItem(itemId, quantity) {
//             loadItems(user_id, [{ item_id: itemId, quantity: quantity }]);
//         }
//     });