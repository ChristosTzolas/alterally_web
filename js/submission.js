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

function openAddItemModal() {
  Swal.fire({
    title: 'Add New Item',
    html: `
      <input id="swal-input-name" class="swal2-input" placeholder="Item Name">
      <textarea id="swal-input-description" class="swal2-textarea" placeholder="Item Description"></textarea>
      <select id="swal-input-disaster" class="swal2-input">${$('#disasterTypeSelector').html()}</select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Save',
    preConfirm: () => {
      const name = document.getElementById('swal-input-name').value;
      const description = document.getElementById('swal-input-description').value;
      const disasterId = document.getElementById('swal-input-disaster').value;
      return { name: name, description: description, disasterId: disasterId };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // AJAX call to save the new item
      $.ajax({
        url: './php/save_new_item.php',
        type: 'POST',
        data: {
          name: result.value.name,
          description: result.value.description,
          disaster_id: result.value.disasterId // Ensure this key matches your PHP script's expected POST variable
        },
        success: function(response) {
          if (response.success) {
            Swal.fire('Success', 'The item has been added successfully!', 'success');
            loadItems(); // Reload items to reflect the changes
          } else {
            Swal.fire('Error', response.error || 'An error occurred while adding the item.', 'error');
          }
        },
        error: function(xhr, status, error) {
          Swal.fire('Error', `An error occurred: ${error}`, 'error');
        }
      });
    }
  });
}


// Function to open the edit modal with pre-filled item data
function openEditModal(itemId, itemName, itemDescription) {
  Swal.fire({
      title: 'Edit Item',
      html: `<input id="swal-input1" class="swal2-input" value="${itemId}" disabled>` +
            `<input id="swal-input2" class="swal2-input" value="${itemName}">` +
            `<textarea id="swal-input3" class="swal2-textarea">${itemDescription}</textarea>`,
      focusConfirm: false,
      preConfirm: () => {
          return [
              $('#swal-input1').val(),
              $('#swal-input2').val(),
              $('#swal-input3').val()
          ];
      }
  }).then((result) => {
      if (result.isConfirmed) {
          updateItem(itemId, result.value[1], result.value[2]);
      }
  });
}

// Function to update the item after editing
function updateItem(itemId, itemName, itemDescription) {
  $.ajax({
      url: './php/save_item.php',
      type: 'POST',
      data: {
          id: itemId,
          name: itemName,
          description: itemDescription
      },
      success: function(response) {
          if (response.success) {
              Swal.fire('Success', 'The item has been updated successfully!', 'success');
              loadItems(); // Reload items to reflect the changes
          } else {
              Swal.fire('Error', response.error || 'An error occurred while updating the item.', 'error');
          }
      },
      error: function() {
          Swal.fire('Error', 'An error occurred while updating the item.', 'error');
      }
  });
}

// Function to close the item modal
function closeModal() {
  $('#itemModal').addClass('hidden');
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
                                <input type="number" class="quantity-input form-input mt-1 block w-20 pl-2 pr-2 border rounded-md text-gray-700" value="${item.quantity}" data-item-id="${item.id}">
                            </div>
                        </div>
                        <div class="flex justify-end mt-4 space-x-2">
                            <button class="flex items-center px-2 py-1 text-white font-semibold rounded-md transition duration-300 edit-item" data-item-id="${item.id}" data-item-name="${item.name}" data-item-description="${item.description}">
                                <img src="./icons/edit.png" alt="Edit" class="h-4 w-4 mr-2">
                            </button>
                            <button class="flex items-center px-2 py-1 hover:bg-white-600 text-white font-semibold rounded-md transition duration-300 delete-item" data-item-id="${item.id}">
                                <img src="./icons/trash.png" alt="Delete" class="h-4 w-4 mr-2">
                            </button>
                            <button class="save-quantity text-white p-1 rounded-md" data-item-id="${item.id}">
                            <img src="./icons/save.png" alt="Save" class="h-5 w-5">
                            </button>
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


// Event delegation for edit item buttons
$(document).on('click', '.edit-item', function() {
  var itemId = $(this).data('item-id');
  var itemName = $(this).data('item-name');
  var itemDescription = $(this).data('item-description');
  openEditModal(itemId, itemName, itemDescription);
});

// Function to close the modal when clicking outside of it
$(document).on('click', '#itemModal', function(event) {
  if (event.target.id === 'itemModal') {
      closeModal();
  }
});

// Prevent closing modal when clicking inside the modal content
$(document).on('click', '.modal-content', function(event) {
  event.stopPropagation();
});

$(document).on('click', '.delete-item', function() {
  const itemId = $(this).data('item-id');
  
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
      if (result.isConfirmed) {
          // AJAX call to delete the item
          $.ajax({
              url: './php/delete_item.php',
              type: 'POST',
              data: { id: itemId },
              success: function(response) {
                  if (response.success) {
                      Swal.fire(
                          'Deleted!',
                          'The item has been deleted.',
                          'success'
                      );
                      loadItems(); // Reload items to reflect changes
                  } else {
                      Swal.fire('Error', response.error || 'An error occurred while deleting the item.', 'error');
                  }
              },
              error: function(xhr, status, error) {
                  Swal.fire('Error', `An error occurred: ${error}`, 'error');
              }
          });
      }
  });
});

// Event handler to save the new quantity
$(document).on('click', '.save-quantity', function() {
  const itemId = $(this).data('item-id');
  const newQuantity = $(`.quantity-input[data-item-id="${itemId}"]`).val();
  updateItemQuantity(itemId, newQuantity);
});

function updateItemQuantity(itemId, newQuantity) {
  $.ajax({
      url: './php/update_quantity.php',
      type: 'POST',
      data: {
          id: itemId,
          quantity: newQuantity
      },
      success: function(response) {
          if (response.success) {
              Swal.fire('Success', 'The quantity has been updated successfully!', 'success');
          } else {
              Swal.fire('Error', response.error || 'An error occurred while updating the quantity.', 'error');
          }
      },
      error: function(xhr, status, error) {
          Swal.fire('Error', `An error occurred: ${error}`, 'error');
      }
  });
}


// Call to load disaster types on document ready
loadDisasterTypes();

// Load items initially or you may want to load items based on a default or selected disaster type
loadItems();

