// carts.js

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find(user => user.login === true);

if (!currentUser) {        
    setTimeout(() => {
        alert("Please Login!!");
        window.location = "login.html";
    }, 300);        
}

let ProductsInCart = currentUser ? currentUser.shoppingCart : [];
let favoriteProducts = currentUser ? currentUser.favoriteProducts : [];
let allProducts = document.getElementById("products");
let ProductsPrice = document.getElementById("productsPrice");

drawCartProducts(ProductsInCart);
drawFavoriteProducts(favoriteProducts);

function drawCartProducts(products) {
    let allPrice = 0;

    allProducts.innerHTML = products.map(item => {
        allPrice += item.quantity * item.price;

        return `
            <div class="col colwh text-center ">
                <div class="card cardMM">
                    <div class="row g-0 h-100">
                        <div class="col-4">
                            <img src="${item.imageUrl}" class="img-fluid rounded-start colwhi h-100" alt="${item.title}">
                        </div>
                        <div class="col-8">
                            <div class="card-body d-flex flex-column justify-content-between h-100">
                                <h5 class="card-title">Product: ${item.title}</h5>
                                <h5 class="card-title">Price: ${item.price}$</h5>
                                <h5 class="card-title">Category: ${item.category}</h5>
                                <div class="mt-auto">
                                    <span class="btnN">${item.quantity}</span>
                                    <button class="quantity-button btn btns" onclick="changeQuantity(${item.id}, 1)">+</button>
                                    <button class="quantity-button btn btns" onclick="changeQuantity(${item.id}, -1)">-</button>
                                    <button class="add_to_cart btn btn_s" onclick="removeFromCart(${item.id})">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join(""); 

    ProductsPrice.innerHTML = `<p>Total price: ${allPrice}$</p>`;
}

function drawFavoriteProducts(favoriteProducts) {
    const allProductsFavorite = document.getElementById('productsfavorite');
    const carouselDots = document.getElementById('carousel-dots');

    if (favoriteProducts.length === 0) {
        allProductsFavorite.innerHTML = '';
        carouselDots.innerHTML = '';
        return;
    }

    allProductsFavorite.innerHTML = favoriteProducts.map(item => `
        <div class="col" id="favorite-item-${item.id}">
            <div class="card card_sum card_sm">
                <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                <div class="card-body pro_">
                    <h5 class="card-title">Product: ${item.title}</h5>
                    <h5 class="card-title">Category: ${item.category}</h5>
                    <button class="add_to_cart btn" data-id="${item.id}" onclick="toggleCart(${item.id})"></button>
                    <a onclick="removeFromFavorites(${item.id})"><i class="fas fa-heart fav favorite_icon ${item.favorit ? 'red-heart' : ''}"></i></a>
                </div>
            </div>
        </div>
    `).join("");

    const productsFavoriteContainer = document.querySelector('.productsfavorite_');
    const itemWidth = allProductsFavorite.querySelector('.col').offsetWidth;
    const containerWidth = productsFavoriteContainer.offsetWidth;
    const itemsPerPage = Math.floor(containerWidth / itemWidth);
    const numPages = Math.ceil(favoriteProducts.length / itemsPerPage);

    carouselDots.innerHTML = Array.from({ length: numPages }, (_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join("");

    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function updateDots() {
        const scrollLeft = productsFavoriteContainer.scrollLeft;
        const offset = itemWidth * itemsPerPage;
        const maxScrollLeft = productsFavoriteContainer.scrollWidth - productsFavoriteContainer.clientWidth;
    
        let newIndex = Math.round(scrollLeft / offset);
    
        if (scrollLeft >= maxScrollLeft) {
            newIndex = dots.length - 1; 
        }
    
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            dots.forEach(dot => dot.classList.toggle('active', parseInt(dot.dataset.index) === currentIndex));
        }
    }

    function goToPage(index) {
        const offset = itemWidth * itemsPerPage;
        productsFavoriteContainer.scrollTo({
            left: offset * index,
            behavior: 'smooth'
        });
    }

    productsFavoriteContainer.addEventListener('scroll', updateDots);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            goToPage(index);
        });
    });

    let isDragging = false;
    let startX;
    let scrollLeft;

    productsFavoriteContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - productsFavoriteContainer.offsetLeft;
        scrollLeft = productsFavoriteContainer.scrollLeft;
        productsFavoriteContainer.classList.add('dragging');
    });

    productsFavoriteContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        productsFavoriteContainer.classList.remove('dragging');
    });

    productsFavoriteContainer.addEventListener('mouseup', () => {
        isDragging = false;
        productsFavoriteContainer.classList.remove('dragging');
    });

    productsFavoriteContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.pageX - productsFavoriteContainer.offsetLeft;
        const walk = (x - startX) * 1;
        productsFavoriteContainer.scrollLeft = scrollLeft - walk;
        updateDots();
    });
}

function changeQuantity(id, delta) {
    let item = ProductsInCart.find(item => item.id === id);

    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            ProductsInCart = ProductsInCart.filter(item => item.id !== id);
        }

        currentUser.shoppingCart = ProductsInCart;
        updateUsersInLocalStorage(users);

        drawCartProducts(ProductsInCart);
    }
}

function removeFromCart(id) {
    ProductsInCart = ProductsInCart.filter(item => item.id !== id);
    
    currentUser.shoppingCart = ProductsInCart;
    updateUsersInLocalStorage(users);

    drawCartProducts(ProductsInCart);
}

function removeFromFavorites(id) {
    const item = document.getElementById(`favorite-item-${id}`);
    if (item) {
        item.classList.add('fade-out');
        
        setTimeout(() => {
            favoriteProducts = favoriteProducts.filter(item => item.id !== id);

            currentUser.favoriteProducts = favoriteProducts;
            updateUsersInLocalStorage(users);
            
            drawFavoriteProducts(favoriteProducts);
        }, 300);
    }
}

function updateUsersInLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

window.addEventListener('resize', () => {
    location.reload();
});
