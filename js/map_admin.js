document.addEventListener('DOMContentLoaded', function() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    const user_id = logged_user[0].user_id;
    let rescuerLatLng = null; // variable to help draw the lines
    let requestLines = []; // the polylines will be stored here
    let responseLines = []; // the polylines will be stored here
    let requestsData = []; // Array to store requests data
    let responsesData = []; // Array to store responses data

    // layers for toggle button
    var acceptedResponsesMarkers = L.markerClusterGroup();
    var pendingResponsesMarkers = L.markerClusterGroup();

    var rescuersMarkers = L.markerClusterGroup();
    var acceptedRequestsMarkers = L.markerClusterGroup();
    var pendingRequestsMarkers = L.markerClusterGroup();



        // Setting up the base layer of the map
    var maptile = L.tileLayer(
        'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fpaRZqZBSOhVZgR5NUX7 ',
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
            maxZoom: 25
        }
    );

    const baseIcon = L.icon({
        iconUrl: "icons/base.png",
        iconSize: [18, 18],
    });

    var map = new L.Map("map", {
        zoom: 15,
        layers: [maptile],
        zoomControl: false,
    });

    $.ajax({
        url: "./php/fetch_base_location.php",
        type: "POST",
        dataType: "json" 
    }).done(function(response) {
        map.setView(new L.LatLng(response.latitude, response.longitude), 15);
    });
    
    
    var markers = L.markerClusterGroup();

    var overlayMaps = {
        "Accepted Requests": acceptedRequestsMarkers,
        "Pending Requests": pendingRequestsMarkers,
        "Accepted Responses": acceptedResponsesMarkers,
        "Pending Responses": pendingResponsesMarkers,
        "Rescuers with Accepted Tasks": rescuersMarkers
    };
    
    L.control.layers(null, overlayMaps).addTo(map);

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
            requestLines.forEach(line => map.removeLayer(line));
            responseLines.forEach(line => map.addLayer(line));
        } else {
            responseLines.forEach(line => map.removeLayer(line));
            requestLines.forEach(line => map.addLayer(line));
        }
        displayRequestLines = !displayRequestLines;
    }


    // Generalized callback function for ajax requests
    function fetchData(url, callback) {  //fetchData('./php/fetch_emt_locations.php', displayEMTLocations);
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
    

    function displayRequests(requests) {
        acceptedRequestsMarkers.clearLayers();
        pendingRequestsMarkers.clearLayers();

        requests.forEach(request => {
            requestsData = requests;
            // Define different icons for pending and accepted requests
            let requestIconUrl = request.status === "completed" ? "icons/completed.png" : "icons/request.png";
            const requestIcon = L.icon({ iconUrl: requestIconUrl, iconSize: [24, 24] });

            let marker = L.marker([request.latitude, request.longitude], { icon: requestIcon });

            let container = L.DomUtil.create('div');
            if (!request.taken_over_by_id){
                container.innerHTML = `
                <div>
                <p class="info-line">Name: ${request.name}</p>
                <p class="info-line">Phone: ${request.phone}</p>
                <p class="info-line">Item: ${request.item_name}</p>
                <p class="info-line">Quantity: ${request.quantity}</p>
                <p class="info-line">Warehouse: ${request.item_quantity}</p>
                <p class="info-line">Details: ${request.details}</p>
                <p class="info-line">Date: ${request.created_at}</p>
                <p class="info-line">Status: ${request.status}</p>
                <P class="info-line"> Request status is pending...</p>
            `;
            } else {
                container.innerHTML = `
                <div>
                <p class="info-line">Name: ${request.name}</p>
                <p class="info-line">Phone: ${request.phone}</p>
                <p class="info-line">Item: ${request.item_name}</p>
                <p class="info-line">Quantity: ${request.quantity}</p>
                <p class="info-line">Warehouse: ${request.item_quantity}</p>
                <p class="info-line">Details: ${request.details}</p>
                <p class="info-line">Date: ${request.created_at}</p>
                <p class="info-line">Status: ${request.status}</p>
                <p class="info-line">Taken over by: ${request.taken_over_by_name + ' - Rescuer ID:'+ request.taken_over_by_id + '  Phone:'+request.phone}</p>
            `;
            }
            

            marker.bindPopup(container);
            if (request.status === "accepted") {
            acceptedRequestsMarkers.addLayer(marker);
           } else if (request.status === "pending") {
            pendingRequestsMarkers.addLayer(marker);
           }
        });
        map.addLayer(acceptedRequestsMarkers);
        map.addLayer(pendingRequestsMarkers);
    }


    function displayCitizenResponses(responses) {
        acceptedResponsesMarkers.clearLayers();
        pendingResponsesMarkers.clearLayers();
        responsesData = responses;
        responses.forEach(response => {
            let responseIconUrl = response.status === "completed" ? "icons/completed.png" : "icons/response.png";
            const responseIcon = L.icon({ iconUrl: responseIconUrl, iconSize: [24, 24] });
    
            let marker = L.marker([response.latitude, response.longitude], { icon: responseIcon });
    
            let container = L.DomUtil.create('div');
            if (!response.taken_over_by_id) {
                container.innerHTML = `
                <div>
                    <p class="info-line">Name: ${response.name}</p>
                    <p class="info-line">Phone: ${response.phone}</p>
                    <p class="info-line">Item: ${response.item_name}</p>
                    <p class="info-line">Details: ${response.response_details}</p>
                    <p class="info-line">Date: ${response.created_at}</p>
                    <p class="info-line">Status: ${response.status}</p>
                    <p class="info-line">Warehouse: ${response.item_quantity}</p>
                    <p>Response status is pending...</p>
                </div>
                `;
            } else {
                container.innerHTML = `
                <div>
                    <p class="info-line">Name: ${response.name}</p>
                    <p class="info-line">Phone: ${response.phone}</p>
                    <p class="info-line">Item: ${response.item_name}</p>
                    <p class="info-line">Details: ${response.response_details}</p>
                    <p class="info-line">Date: ${response.created_at}</p>
                    <p class="info-line">Status: ${response.status}</p>
                    <p class="info-line">Warehouse: ${response.item_quantity}</p>
                    <p>Taken over by: ${response.taken_over_by_name} - Rescuer ID: ${response.taken_over_by_id}</p>
                    <p>Phone: ${response.phone}</p>
                </div>
                `;
            }
    
            marker.bindPopup(container);
            if (response.status === "accepted") {
                acceptedResponsesMarkers.addLayer(marker);
            } else if (response.status === "pending") {
                pendingResponsesMarkers.addLayer(marker);
            }
        });
        map.addLayer(acceptedResponsesMarkers);
        map.addLayer(pendingResponsesMarkers);
    }
    

    let emtDataMap = {};
    function displayEMTLocations(emtData) {
        console.log(emtData);
        rescuersMarkers.clearLayers();
        emtData.forEach(emt => {
            if (emt.latitude && emt.longitude) {
                // Process EMT data
                if (!emtDataMap[emt.user_id]) {
                    emtDataMap[emt.user_id] = {
                        latitude: emt.latitude,
                        longitude: emt.longitude,
                        name: emt.name,
                        tasks: []
                    };
    
                    const emtIcon = L.icon({
                        iconUrl: 'icons/medical.png',
                        iconSize: [24, 24]
                    });
    
                    let emtMarker = L.marker([emt.latitude, emt.longitude], { icon: emtIcon });
                    emtMarker.bindPopup(
                        `<p class="info-line">Username: ${emt.username}</p>
                        <p class="info-line">Rescuer: ${emt.name}</p>
                        <p class="info-line">Cargo: ${emt.cargo_items}</p>
                        <p class="info-line">Quantities: ${emt.cargo_quantities}<p class="info-line">
                        <p class="info-line">Phone: ${emt.phone}</p>
                        <p class="info-line">Request IDs: ${emt.request_id}</p>
                        <p class="info-line">Response IDs: ${emt.response_id}</p>`
                    );
                    rescuersMarkers.addLayer(emtMarker);
                }
    
                // Add tasks to the EMT
                emtDataMap[emt.user_id].tasks.push({ id: emt.request_id, type: 'request' });
                emtDataMap[emt.user_id].tasks.push({ id: emt.response_id, type: 'response' });
            }
        });
    
        map.addLayer(rescuersMarkers);
        drawAllPolylines();
    }
    
    
    function drawAllPolylines() {
        Object.values(emtDataMap).forEach(emt => {
            emt.tasks.forEach(task => {
                let taskCoords = getTaskCoordinates(task.id);
                if (taskCoords) {
                    let color = task.type === 'request' ? 'blue' : 'green';
                    let polyline = L.polyline([[emt.latitude, emt.longitude], taskCoords], { color: color });
                    polyline.addTo(map);
                    if (task.type === 'request') {
                        requestLines.push(polyline);
                    } else {
                        responseLines.push(polyline);
                    }
                }
            });
        });
    }
    

    function getTaskCoordinates(taskId) {
        taskId = parseInt(taskId, 10);
    
        let request = requestsData.find(req => parseInt(req.id, 10) === taskId);
        if (request) {
            let coords = [parseFloat(request.latitude), parseFloat(request.longitude)];
            console.log("Request Coords for Task ID " + taskId + ": ", coords);
            return coords;
        }
    
        let response = responsesData.find(res => parseInt(res.id, 10) === taskId);
        if (response) {
            return [parseFloat(response.latitude), parseFloat(response.longitude)];
        }
    
        return null;
    }


    // Function to fetch and display the base location
    function fetchBaseLocation() {
        fetchData('./php/fetch_base_location.php', function(baseLocation) {
            if (baseLocation) {
                L.marker([baseLocation.latitude, baseLocation.longitude], { icon:baseIcon, draggable: true })
                    .addTo(map)
                    .on('dragend', function(event) {
                        var newLocation = event.target.getLatLng();
                        updateBaseLocation(newLocation.lat, newLocation.lng);
                    });
            }
        });
    }

    // Function to update the base location in the database
    function updateBaseLocation(lat, lng) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update the base location?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: './php/update_base_location.php',
                        method: 'POST',
                        data: { latitude: lat, longitude: lng },
                        success: function(response) {
                            console.log('Base location updated:', response);
                            resolve(response); // Resolve the promise
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating base location:', error);
                            reject(error); // Reject the promise
                        }
                    });
                } else {
                    reject('Update cancelled by user'); // Reject the promise if user cancels
                    reloadPage();
                }
            });
        });
    }
    

    // Fetch data and display on the map
    function fetchAndDisplayData() {
        fetchCitizenResponses();
        fetchRequests();
        fetchEMTData();
        fetchBaseLocation();
    }

    function fetchCitizenResponses() {
        fetchData('./php/admin_responses.php', displayCitizenResponses);
    }

    function fetchRequests() {
        fetchData('./php/fetch_requests.php', displayRequests);
    }

    function fetchEMTData() {
        fetchData('./php/fetch_emt_locations.php', displayEMTLocations);
    }
    

    function reloadPage () {
        setTimeout(function() {
            window.location.reload();
        }, 1500); 
    }

    // Call to fetch and display data
    fetchAndDisplayData();
    });