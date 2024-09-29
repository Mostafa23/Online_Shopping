// register.js

let usernameInput = document.querySelector("#username");
let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");

let registerBtn = document.querySelector("#sign_up");

// Function to get all registered users from localStorage
function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

// Function to check if the user already exists
function userExists(username, email) {
    const users = getUsers();
    return users.some(user => user.username === username || user.email === email);
}

// Function to generate a unique user ID (max ID + 1)
function generateUserId() {
    const users = getUsers();
    if (users.length === 0) return 1; // Start with ID 1 if no users exist

    // Find the maximum ID among existing users
    const maxId = Math.max(...users.map(user => user.id));
    return maxId + 1; // Return the next ID
}

// Event listener for the register button
registerBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Validate input fields
    if (usernameInput.value.trim() === "" || emailInput.value.trim() === "" || passwordInput.value.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Check if the user already exists
    if (userExists(usernameInput.value.trim(), emailInput.value.trim())) {
        alert("Username or email already exists. Please use a different one.");
        return;
    }

    // Generate a new user ID
    const newUserId = generateUserId();

    // Retrieve existing users and add the new user
    const users = getUsers();
    users.push({
        id: newUserId,
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        login: false,
        shoppingCart: [],
        favoriteProducts: []
    });

    // Store the updated users array back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Redirect to the login page after a brief delay
    setTimeout(() => {
        window.location = "login.html";
    }, 1500);
});

(function check() {
    const users = getUsers();
    const currentUser = users.find(user => user.login === true);

    if (currentUser) {        
        setTimeout(() => {
            window.location = "index.html";
        }, 300);        
    }
})();