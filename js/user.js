document.addEventListener('DOMContentLoaded', function () {
    let userInfo = document.getElementById("user_info");
    let userD = document.getElementById("user");
    let links = document.getElementById("links");
    let logOutBtn = document.getElementById("logout");

    const users = getUsers(); // Get the list of users
    const currentUser = users.find(user => user.login === true); // Find the current user

    if (users.length > 0 && currentUser) {
        // User is logged in
        if (links) {
            links.remove(); // Remove links if user is logged in
        }
        if (userInfo) {
            userInfo.style.display = "flex"; // Show user info
        }
        userD.innerHTML = "Welcome " + currentUser.username; // Display welcome message
    } else {
        // User is not logged in
        if (userInfo) {
            userInfo.remove(); // Remove user info section
        }
    }

    // Logout functionality
    if (logOutBtn) {
        logOutBtn.addEventListener("click", function () {
            if (currentUser) {
                currentUser.login = false; // Set login status to false
                localStorage.setItem("users", JSON.stringify(users)); // Save updated users back to localStorage
            }
            
            setTimeout(() => {
                window.location = "login.html"; // Redirect to login page after 1 second
            }, 1000);
        });
    }
});

// Function to get all registered users from localStorage
function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}
