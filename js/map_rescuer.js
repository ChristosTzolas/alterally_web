document.addEventListener('DOMContentLoaded', function() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;
    let rescuerLatLng = null; // variable to help draw the lines
    let requestLines = {}; // Store request lines
    let responseLines = {}; // Store response lines

    var baseLocation;


    fetchBaseLocation();
    fetchRescuerLocation();
        // Setting up the base layer of the map
    var maptile = L.tileLayer(
        'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fpaRZqZBSOhVZgR5NUX7 ',
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
            maxZoom: 25
        }
    );

    const rescuerIcon = L.icon({
        iconUrl: "icons/medical.png",
        iconSize: [24, 24],
    });

    const baseIcon = L.icon({
        iconUrl: "icons/base.png",
        iconSize: [18, 18],
    });



    // Initializing the main map object
    var map = new L.Map("map", {
        center: new L.LatLng(38.246361, 21.734966),
        zoom: 15,
        layers: [maptile],
        zoomControl: false,
    });
    const userMarker = new L.layerGroup();
    map.addLayer(userMarker);
    var markers = L.markerClusterGroup();

    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend legend-box'), 
            labels = [],
            categories = ['Request', 'Response', 'Completed'],
            icons = ['request.png', 'response.png', 'completed.png'];
    
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
                labels.push(
                    '<i class="icon" style="background-image: url(icons/' + icons[i] + '); background-size: cover; width: 24px; height: 24px; display: inline-block; margin-right: 5px;"></i> ' +
                    categories[i]);
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    
    legend.addTo(map);

    var toggleLinesControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            var button = L.DomUtil.create('button', 'toggle-button');
            button.innerText = 'Toggle Lines';
            button.onclick = function () {
                toggleLines();
            }
            return button;
        }
    });

    new toggleLinesControl().addTo(map);
    let displayRequestLines = true;
    function toggleLines() {
    if (displayRequestLines) {
        Object.values(requestLines).forEach(line => map.removeLayer(line));
        Object.values(responseLines).forEach(line => map.addLayer(line));
    } else {
        Object.values(responseLines).forEach(line => map.removeLayer(line));
        Object.values(requestLines).forEach(line => map.addLayer(line));
    }
    displayRequestLines = !displayRequestLines;
}


    // Glocbal function for ajax requests
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

    function fetchRescuerLocation() {
        fetchData('./php/fetchRescuerLocation.php', function(data) {
            if (data.latitude && data.longitude) {
                rescuerLatLng = L.latLng(data.latitude, data.longitude);
                initializeRescuerLocation(data.latitude, data.longitude);
            } else {
                const locateCurrentPosition = () => new  Promise((resolve, reject)=> {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            resolve(position);
                        },
                        error => {
                            console.log(error.message);
                            reject(error);
                        }
                    );
                })
                locateCurrentPosition().then(position =>{
                    let userLoc = L.marker([position.coords.latitude, position.coords.longitude], {
                        icon: rescuerIcon,
                        draggable: true
                    }).addTo(map);
                    userLoc.bindPopup("Your Location");
                    userMarker.addLayer(userLoc);
                    map.setView([position.coords.latitude,position.coords.longitude]);
                    userLoc.bindPopup("<b>Please confirm your location</b><br><button onclick='confirmLocation()'>Confirm</button>").openPopup();

                    // Function to call when user confirms location
                    window.confirmLocation = function() {
                        updateRescuerLocation(position.coords.latitude, position.coords.longitude);
                        userLoc.closePopup();
                    };
                }).catch(error => {
                    console.error("Error obtaining geolocation:", error);
                });
            }
        });
    }
    

    function initializeRescuerLocation(lat, lng) {
        let userLoc = L.marker([lat, lng], {
            icon: rescuerIcon,
            draggable: true
        }).addTo(map);
        userLoc.bindPopup("User Location");
        userMarker.addLayer(userLoc);
        map.setView([lat, lng], 15);
    
        userLoc.on('dragend', function(event) {
            // Define newLocation within this scope
            var newLocation = event.target.getLatLng();
            updateRescuerLocation(newLocation.lat, newLocation.lng);
    
            // Check proximity on location update
            checkProximityAndShowPopup(newLocation);
        });
    
        // Initial proximity check with the initial location
        checkProximityAndShowPopup(L.latLng(lat, lng));
    }
    
    // promise to update the rescuer's location
    //On confirmation, it performs an AJAX request to save the new location
    function updateRescuerLocation(lat, lng) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`
            }).then((result) => {
                if (result.isConfirmed) {
                    // User confirmed to save changes
                    $.ajax({
                        url: './php/updateRescuerLocation.php',
                        method: 'POST',
                        data: { latitude: lat, longitude: lng },
                        success: function(response) {
                            console.log('Location updated:', response);
                            Swal.fire("Saved!", "", "success");
                            resolve(response); // Resolve the promise on success
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating location:', error);
                            reject(error); // Reject the promise on error
                        }
                    });
                } else if (result.isDenied) {
                    // User denied to save changes
                    Swal.fire("Changes are not saved", "", "info");
                    reject('Update cancelled by user'); // Reject the promise if user cancels
                    reloadPage();
                }
            });
        });
    }
    


    function displayRequests(requests) {
        requests.forEach(request => {
            console.log("Here:",request);
            // Define different icons for pending and accepted requests
            let requestIconUrl = request.status === "completed" ? "icons/completed.png" : "icons/request.png";
            const requestIcon = L.icon({ iconUrl: requestIconUrl, iconSize: [24, 24] });

            let marker = L.marker([request.latitude, request.longitude], { icon: requestIcon });

            let container = L.DomUtil.create('div');
            container.innerHTML = `
                <div>
                <p>Name: ${request.name}</p>
                <p>Phone: ${request.phone}</p>
                <p>Details: ${request.details}</p>
                <p>Date: ${request.created_at}</p>
                <p>Status: ${request.status}</p>
                ${request.status === "pending" ? `<button id="takeOverRequest${request.id}" class="take-over-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Take Over This Request</button>` : '<button id="takeOverRequest${request.id}" class="take-over-btn bg-gray-500 cursor-not-allowed text-white font-bold py-2 px-4 rounded">Take Over This Request</button>'}
                </div>
            `;

            marker.bindPopup(container);

            if (request.status === "pending") {
                marker.on('popupopen', function() {
                    let takeOverButton = L.DomUtil.get(`takeOverRequest${request.id}`);
                    L.DomEvent.on(takeOverButton, 'click', function() {
                        takeOverRequest(request.id);
                    });
                });
            } 
            if (request.status === "accepted" && rescuerLatLng && request.taken_over_by_id == user_id) {
                let requestLatLng = L.latLng(request.latitude, request.longitude);
                let requestline = L.polyline([rescuerLatLng, requestLatLng], {color: 'blue'}).addTo(map);
                requestLines[request.id] = requestline;
            }
            markers.addLayer(marker);
        });
        map.addLayer(markers);
    }


    function displayCitizenResponses(responses) {
        console.log("Responses:", responses);
        responses.forEach(response => {
            // Define different icons for different statuses
            let responseIconUrl = response.status === "completed" ? "icons/completed.png" : "icons/response.png";
            const responseIcon = L.icon({ iconUrl: responseIconUrl, iconSize: [24, 24] });

            let marker = L.marker([response.latitude, response.longitude], { icon: responseIcon });

            let container = L.DomUtil.create('div');
            container.innerHTML = `
                <div>
                    <p>Name: ${response.name}</p>
                    <p>Phone: ${response.phone}</p>
                    <p>Details: ${response.details}</p>
                    <p>Date: ${response.created_at}</p>
                    <p>Status: ${response.status}</p>
                    ${response.status === "pending" ? `<button id="takeOverResponse${response.id}" class="take-over-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Take Over This Response</button>` : '`<button id="takeOverResponse${response.id}" class="take-over-btn bg-gray-500 cursor-not-allowed text-white font-bold py-2 px-4 rounded">Take Over This Response</button>'}
                </div>
            `;

            marker.bindPopup(container);

            if (response.status === "pending") {
                marker.on('popupopen', function() {
                    let takeOverButton = L.DomUtil.get(`takeOverResponse${response.id}`);
                    L.DomEvent.on(takeOverButton, 'click', function() {
                        takeOverResponse(response.id);
                    });
                });
            } 
            if (response.status === "accepted" && rescuerLatLng && response.taken_over_by_id == user_id) {
                let responseLatLng = L.latLng(response.latitude, response.longitude);
                let responseLine = L.polyline([rescuerLatLng, responseLatLng], {color: 'green'}).addTo(map);
                responseLines[response.id] = responseLine;
            }

            markers.addLayer(marker);
        });
        map.addLayer(markers);
        map.invalidateSize();
    }

    function takeOverResponse(responseId) {
        checkRescuerTaskCount(user_id)
            .then(response => {
                if (response == 1) {
                    return $.ajax({
                        url: './php/takeOverResponse.php',
                        method: 'POST',
                        data: { responseId: responseId, userId: user_id }
                    });
                } else {
                    throw new Error('Maximum task limit reached.');
                }
            })
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Response taken over successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                reloadPage();
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', error.message, 'error');
            });
    }
    

    function takeOverRequest(requestId) {
        checkRescuerTaskCount(user_id)
            .then(response => {
                if (response === 1) {
                    return $.ajax({
                        url: './php/takeOverRequest.php',
                        method: 'POST',
                        data: { requestId: requestId, userId: user_id }
                    });
                } else {
                    throw new Error('Maximum task limit reached.');
                }
            })
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Request taken over successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                reloadPage();
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', error.message, 'error');
            });
    }
    
    function checkRescuerTaskCount(userId) {
        return $.ajax({
            url: './php/checkTaskCount.php',
            method: 'POST',
            data: { rescuerId: userId }
        })
        .then(response => {
            return response
        });
    }
    

    function fetchAndDisplayTasks() {
        $.ajax({
            url: './php/fetchTasks.php', 
            method: 'GET',
            dataType: 'json',
            success: function(tasks) {
                displayTasks(tasks);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching tasks:', error);
            }
        });
    }
    
    
    function displayTasks(tasks) {
        console.log(tasks);
        const tasksContainer = document.getElementById('tasksTakenOver');
        tasksContainer.innerHTML = '';
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', 'p-4', 'border', 'border-gray-300', 'rounded', 'mb-2');
        
            let taskType = task.type === 'request' ? 'Request' : 'Response';
            let taskDetails = task.details;
            let itemName = task.itemName;
            let citizenName = task.citizenName;
            let citizenPhone = task.citizenPhone;
            let quantity = task.people;
            let taskStatus = task.status;
            let createdAt = new Date(task.created_at).toLocaleDateString();
    
            taskElement.innerHTML = `
                <h3 class="font-bold">${taskType}</h3>
                <p>Item: ${itemName}</p>
                <p>Details: ${taskDetails}</p>
                <p>Citizen: ${citizenName} (${citizenPhone})</p>
                <p>Quantity: ${quantity}
                <p>Date: ${createdAt}</p>
                <p>Status: ${taskStatus}</p>
            `;
        
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('flex', 'space-x-2', 'mt-2');
        
            // Calculate distance between rescuer and task
            let taskLatLng = L.latLng(task.latitude, task.longitude);
            let distance = rescuerLatLng.distanceTo(taskLatLng);
    
            if (taskStatus === 'completed') {
                const completedButton = document.createElement('button');
                completedButton.classList.add('bg-indigo-600', 'text-white', 'font-bold', 'py-2', 'px-3', 'rounded', 'cursor-not-allowed');
                completedButton.textContent = 'Completed';
                completedButton.disabled = true; // Make the button unclickable
                buttonsContainer.appendChild(completedButton);
            } else {
                const completeButton = document.createElement('button');
                completeButton.id = `completeTask${task.id}`;
                completeButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-2', 'px-2', 'rounded');
                completeButton.textContent = 'Complete';
    
                // Enable or disable the button based on distance
                if (distance <= 150) {
                    completeButton.addEventListener('click', () => updateTaskStatus(task.id, task.item_id, task.type, quantity, 'complete'));
                } else {
                    completeButton.disabled = true;
                    completeButton.classList.add('bg-indigo-500', 'hover:bg-indigo-600', 'cursor-not-allowed');
                }
    
                const cancelButton = document.createElement('button');
                cancelButton.id = `cancelTask${task.id}`;
                cancelButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-2', 'px-2', 'rounded');
                cancelButton.textContent = 'Cancel';
                cancelButton.addEventListener('click', () => updateTaskStatus(task.id, task.item_id, task.type, quantity, 'cancel'));
        
                buttonsContainer.appendChild(completeButton);
                buttonsContainer.appendChild(cancelButton);
            }
        
            taskElement.appendChild(buttonsContainer);
            tasksContainer.appendChild(taskElement);
        });
    }
    
    
    
    function updateTaskStatus(taskId, item_id, taskType, quantity, action) {
        console.log("Accepted",quantity);
        // Delete corresponding line before updating the task
        if (taskType === 'request') {
            deleteRequestLine(taskId);
        } else if (taskType === 'response') {
            deleteResponseLine(taskId);
        }
        let url = action === 'complete' ? './php/completeTask.php' : './php/cancelTask.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: { taskId: taskId, itemId: item_id, taskType: taskType, quantity },
            success: function(result) {
                Swal.fire({
                    title: 'Success!',
                    text: result,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                reloadPage();
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function fetchBaseLocation() {
        fetchData('./php/fetch_base_location.php', function(baseLocation) {
            if (baseLocation) {
                L.marker([baseLocation.latitude, baseLocation.longitude], { icon:baseIcon})
                    .addTo(map)
            }
        });
    }    
    
    function fetchBaseLocation() {
        fetchData('./php/fetch_base_location.php', function(baseData) {
            if (baseData && baseData.latitude && baseData.longitude) {
                baseLocation = L.latLng(parseFloat(baseData.latitude), parseFloat(baseData.longitude));
    
                // Add a marker for the base location
                L.marker([baseData.latitude, baseData.longitude], { icon: baseIcon })
                    .addTo(map)
                    .bindPopup("Base Location: " + baseData.base_name);
    
                checkProximityAndShowPopup(rescuerLatLng); // Check proximity after setting base location
            } else {
                console.error('Base location data is not available or invalid');
            }
        });
    }

    
    function checkProximityAndShowPopup(userLocation) {
        const proximityThreshold = 200; // 100 meters
    
        if (baseLocation && userLocation) {
            const distanceToBase = userLocation.distanceTo(baseLocation);
    
            if (distanceToBase <= proximityThreshold) {
                let container = L.DomUtil.create('div');
                container.innerHTML = `
                    <div>
                        <p>You are within 100 meters of the base.</p>
                        <button onclick="window.open('cargo.html', '_blank');" class="cargo-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ml-12">Manage Cargo</button>
                    </div>
                `;
    
                L.popup()
                    .setLatLng(userLocation)
                    .setContent(container)
                    .openOn(map);
            }
        }
    }    

    function fetchAndDisplayCargo(user_id) {
        $.ajax({
            url: './php/fetch_cargo.php',
            method: 'POST',
            data: { user_id: user_id },
            dataType: 'json',
            success: function(cargo) {
                displayCargo(cargo);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cargo:', error);
            }
        });
    }
    
    function displayCargo(cargoItems) {
        let cargoDiv = document.getElementById('cargo');
        cargoDiv.innerHTML = ''; // Clear existing content
    
        cargoItems.forEach(item => {
            let itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <p>Item ID: ${item.item_id}</p>
                <p>Item Name: ${item.name}</p>
                <p>Quantity: ${item.quantity}</p>
                <br>
            `;
            cargoDiv.appendChild(itemElement);
        });
    }

    function deleteRequestLine(requestId) {
        if (requestLines[requestId]) {
            map.removeLayer(requestLines[requestId]);
            delete requestLines[requestId];
        }
    }
    
    function deleteResponseLine(responseId) {
        if (responseLines[responseId]) {
            map.removeLayer(responseLines[responseId]);
            delete responseLines[responseId];
        }
    }
    
    

  
    
    // Call this function to fetch and display tasks
    fetchAndDisplayTasks();
    


    // Fetch data and display on the map
    function fetchAndDisplayData() {
        fetchCitizenResponses();
        fetchRequests();
        fetchAndDisplayTasks();
        fetchAndDisplayCargo(user_id);
    }

    function fetchCitizenResponses() {
        fetchData('./php/admin_responses.php', displayCitizenResponses);
    }

    function fetchRequests() {
        fetchData('./php/fetch_requests.php', displayRequests);
    }

    function reloadPage () {
        setTimeout(function() {
            window.location.reload();
        }, 1500); 
    }

    // Call to fetch and display data
    fetchAndDisplayData();
    });


