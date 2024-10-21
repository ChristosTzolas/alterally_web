const logged_user = JSON.parse(localStorage.getItem("logged_user"));
      if (!logged_user) 
        // If no logged user, redirect to login page
        window.location.href = "./unauthorized.html";
      
