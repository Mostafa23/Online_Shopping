// script.js

// Elements
const allProducts = document.getElementById("products");
const cartProductDiv = document.querySelector(".carts_products div");
const badgeN = document.querySelector(".badgeN");
const badge = document.querySelector(".badge");
const shoppingCartIcon = document.querySelector(".shopping_cart");
const cartsProducts = document.querySelector(".carts_products");
const searchS = document.getElementById("Search");
const selectElement = document.getElementById("selectSearch");

let addedItem = [];

// Functions
function renderCart() {
    cartProductDiv.innerHTML = addedItem.map(item => generateCartItemHTML(item)).join('');
    badge.style.display = addedItem.length ? "flex" : "none";
    badgeN.innerHTML = addedItem.length;
}

function generateCartItemHTML(item) {
    return `
    <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-content">
            <p class="cart-item-title">${item.title}</p>
            <div class="quantity-control">
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
            </div>
        </div>
    </div>`;
}

function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

function check() {
    const users = getUsers(); 
    const currentUser = users.find(user => user.login === true);

    if (!currentUser) {        
        setTimeout(() => {
            alert("Please Login!!");
            window.location = "login.html";
        }, 300);        
        return false; 
    }
    return currentUser; // Return the currentUser object for further use
}

function toggleCart(id) {
    const users = getUsers(); // Get all users
    const currentUser = check(); // Get the current user

    if (!currentUser) return; // If not logged in, exit
    
    let choosenItem = products.find(item => item.id === id);
    let existingItemIndex = currentUser.shoppingCart.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        // Item is already in the cart, remove it
        currentUser.shoppingCart.splice(existingItemIndex, 1); // Remove from shoppingCart
        addedItem = addedItem.filter(item => item.id !== id);
        document.getElementById(`cart-item-${id}`).remove();
    } else {
        // Item is not in the cart, add it
        choosenItem.quantity = 1; // Set quantity to 1 for the new item
        currentUser.shoppingCart.push(choosenItem); // Add to shoppingCart
        addedItem = [...addedItem, choosenItem];
        cartProductDiv.innerHTML += generateCartItemHTML(choosenItem);
    }

    // Update the current user's shopping cart in the users array
    const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
            return currentUser; // Update the current user with the modified shopping cart
        }
        return user; // Keep other users unchanged
    });

    // Save updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Update the buttons immediately after cart modification
    updateProductButtons();

    // Re-render the cart
    renderCart();
}


function changeQuantity(id, delta) {
    let item = addedItem.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            addedItem = addedItem.filter(item => item.id !== id);
            document.getElementById(`cart-item-${id}`).remove();
            updateProductButtons()
        } else {
            document.querySelector(`#cart-item-${id} .quantity-control span`).textContent = item.quantity;
        }

        // تحديث السلة في localStorage
        const users = getUsers();
        const currentUser = check();
        if (currentUser) {
            currentUser.shoppingCart = addedItem;
            const updatedUsers = users.map(user => user.id === currentUser.id ? currentUser : user);
            localStorage.setItem("users", JSON.stringify(updatedUsers));
        }
    }
    renderCart();
}


function updateProductButtons() {
    document.querySelectorAll('.add_to_cart').forEach(button => {
        let id = button.getAttribute('data-id');
        let inCart = addedItem.find(item => item.id === parseInt(id));
        if (inCart) {
            button.textContent = "Remove From Cart";
            button.style.backgroundColor = 'red';
        } else {
            button.textContent = "Add To Cart";
            button.style.backgroundColor = 'green';
        }
    });
}

function toggleCartDisplay(event) {
    event.stopPropagation();
    cartsProducts.style.display = cartsProducts.style.display === "block" ? "none" : "block";
}

function closeCartOnClickOutside() {
    cartsProducts.style.display = cartsProducts.style.display === "block" ? "none" : null;
}

function updateFilteredProducts() {
    let searchTerm = searchS.value.toLowerCase();
    let selectedOption = selectElement.value;

    let filteredProducts = products.filter(item => {
        if (selectedOption === "1") {
            return item.title.toLowerCase().includes(searchTerm);
        } else if (selectedOption === "2") {
            return item.category.toLowerCase().includes(searchTerm);
        }
        return false;
    });

    drawFilteredItems(filteredProducts);
}

function changeHeart(itemId) {
    const users = getUsers(); // احصل على جميع المستخدمين
    const currentUser = check(); // احصل على المستخدم الحالي

    if (!currentUser) return; // إذا لم يكن المستخدم مسجل الدخول، خروج

    let item = products.find(product => product.id === itemId);
    if (item) {
        item.favorit = !item.favorit; // عكس حالة التفضيل للمنتج

        if (item.favorit) {
            // إذا كان مفضلًا، أضفه إلى قائمة التفضيلات
            currentUser.favoriteProducts.push(item);
        } else {
            // إذا لم يكن مفضلًا، قم بإزالته من قائمة التفضيلات
            currentUser.favoriteProducts = currentUser.favoriteProducts.filter(fav => fav.id !== itemId);
        }

        // تحديث قائمة التفضيلات للمستخدم الحالي في مصفوفة المستخدمين
        const updatedUsers = users.map(user => {
            if (user.id === currentUser.id) {
                return currentUser; // تحديث المستخدم الحالي مع قائمة التفضيلات المعدلة
            }
            return user; // إبقاء باقي المستخدمين بدون تغيير
        });

        // حفظ المستخدمين المحدثين في localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        updateFilteredProducts();
    }
}


function drawFilteredItems(filteredProducts) {
    let productsF = filteredProducts.map(item => {
        return `
        <div class="col">
            <div class="card card_sum">
                <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                <div class="card-body pro_">
                    <h5 class="card-title">Product: ${item.title}</h5>
                    <h5 class="card-title">Price: ${item.price}$</h5>
                    <h5 class="card-title">Category: ${item.category}</h5>
                    <button class="add_to_cart btn btn-secondary btnSS" data-id="${item.id}" onClick="toggleCart(${item.id})"></button>
                    <a onClick="changeHeart(${item.id})"><i class="fas fa-heart fav favorite_icon ${item.favorit ? 'red-heart' : ''}"></i></a>   
                </div>
                <!-- Icon for Modal Trigger -->
                <a href="#" class="info-icon info_icon" data-bs-toggle="modal" data-bs-target="#productModal${item.id}"><i class="fas fa-question-circle"></i></a>
            </div>
        </div>
        
        <!-- Bootstrap Modal for Product Description -->
        <div class="modal fade" id="productModal${item.id}" tabindex="-1" aria-labelledby="productModalLabel${item.id}" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productModalLabel${item.id}">${item.title} - Description</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${item.description} <!-- This is where you will show the product description -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    allProducts.innerHTML = productsF;
    updateProductButtons();
}


// Event listeners
shoppingCartIcon.addEventListener("click", toggleCartDisplay);
cartsProducts.addEventListener("click", event => event.stopPropagation());
document.addEventListener("click", closeCartOnClickOutside);
selectElement.addEventListener('change', updateFilteredProducts);
searchS.addEventListener('input', updateFilteredProducts);

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    let users = getUsers();
    let currentUser = users.find(user => user.login === true);

    if (currentUser) {
        // تحميل عربة التسوق وقائمة التفضيلات من حساب المستخدم الحالي
        addedItem = currentUser.shoppingCart || [];
        let savedFavorites = currentUser.favoriteProducts || [];

        products.forEach(p => {
            let fav = savedFavorites.find(f => f.id === p.id);
            if (fav) {
                p.favorit = fav.favorit;
            }
        });
    }
    
    drawFilteredItems(products); 
    renderCart(); 
});


updateFilteredProducts();