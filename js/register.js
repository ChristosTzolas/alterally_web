let selectedLocation = { lat: null, lng: null };
document.addEventListener('DOMContentLoaded', function() {
  if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
          // Initialize the map on the user's current location
          var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
         
          L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fpaRZqZBSOhVZgR5NUX7', {
              maxZoom: 18,
              attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add a marker on the user's current location
          var marker = L.marker([position.coords.latitude, position.coords.longitude], {
              draggable: true // Make the marker draggable
          }).addTo(map);

          // Event listener for marker drag end to get the new position
          marker.on('dragend', function(event) {
              var newPosition = event.target.getLatLng();
              selectedLocation = newPosition;
          });

      }, function(err) {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          // Handle location access denied or other errors
          // You may want to provide a default location
      });
  } else {
      // Handle case where Geolocation is not available
      alert("Geolocation is not supported by this browser.");
  }
});


function register() {
  const username = document.getElementById("user").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;


  if (!username) return showAlert("warning", "Username", "Username must not be blank!");
  if (!email) return showAlert("warning", "Email", "Email must not be blank!");
  if (!password) return showAlert("warning", "Password", "Password must not be blank!");
  if (!ValidateEmail(email)) return showAlert("warning", "Invalid email", "The format of the email is not valid!");

  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!strongRegex.test(password)) {
    return showAlert("warning", "Password", "Password must include uppercase, lowercase, special character, and numeric letter!");
  }

  $.ajax({
    url: "./php/register.php",
    method: "POST",
    data: {
        username: username,
        password: password,
        email: email,
        name: name,
        phone: phone,
        lat: selectedLocation.lat, 
        lng: selectedLocation.lng
    },
    success: handleRegistrationSuccess,
  });
}

function handleRegistrationSuccess(data) {
  switch (data) {
      case 0:
          showAlert("info", "Already in use", "This username is already in use!");
          break;
      case 1:
          showAlert("info", "Already in use", "This email is already in use!");
          break;
      case 2:
          showSuccessMessage();
          redirectToIndex();
  }
}

function showSuccessMessage() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: 'success',
    title: 'Registration Successful. Your account has been created successfully! Redirecting to login page'
  });
}

function ValidateEmail(mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

function showAlert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    background: '#c0c2c9',
    timer: 5500,
    showConfirmButton: false,
  });
}

function redirectToIndex() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 3000);
}