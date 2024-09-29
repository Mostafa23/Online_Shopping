// login.js

let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");

let loginBtn = document.querySelector("#sign_in");

// Event listener for the login button
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Validate input fields
    if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if the username and password match any registered user
    const user = users.find(user => 
        (user.username === usernameInput.value.trim() || user.email === usernameInput.value.trim()) && 
        user.password === passwordInput.value.trim()
    );

    if (user) {
        // Successfully logged in, you may want to set the user as logged in
        user.login = true; // Set login status (optional, you can store this separately if needed)
        localStorage.setItem("users", JSON.stringify(users)); // Save updated user list

        setTimeout(() => {
            window.location = "index.html"; // Redirect to home page
        }, 1500);
    } else {
        alert("Incorrect username or password.");
    }
});



(function check() {
    const users = JSON.parse(localStorage.getItem("users")) || []; 
    const currentUser = users.find(user => user.login === true);

    if (currentUser) {        
        setTimeout(() => {
            window.location = "index.html";
        }, 300);        
    }
})();


