// Khai báo biến toàn cục
let products = [];  // Danh sách sản phẩm
let cart = [];  // Giỏ hàng

// ================ Fetch Data ==================
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        renderAllProducts();
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
}

// ================== DOM Loaded Event ==================
window.addEventListener('DOMContentLoaded', async function () {
    // Đảm bảo fetchProducts() hoàn thành trước khi load cart và render
    await fetchProducts();
    loadCartFromStorage();
    renderCartItems();
    updateCartCount();
});


// ================== Local Storage Handling ==================
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ================== Render Products ==================
function renderProducts(filterKey, containerId) {
    const filteredProducts = products.filter(product => product[filterKey]);
    const productList = document.getElementById(containerId);
    if (!productList) return;

    productList.innerHTML = filteredProducts.map(product => `
        <div class="product__item width__1-4">
            <div class="product__item-wrap">
                <img class="product__item-img" src="${product.img}" alt="${product.name}">
                <button class="product__buy-btn" onclick="addToCart(${product.id})">
                    <i class="product__buy-btn-icon fa-solid fa-cart-shopping"></i>
                </button>
            </div>
            <a class="product__item-link" href="#">
                <h3 class="product__item-name">${product.name}</h3>
            </a>
            <div class="product__item-price">
                <p class="product__item-price--new">${product.new_price.toLocaleString()}đ</p>
                ${product.old_price ? `<p class="product__item-price--old">${product.old_price.toLocaleString()}đ</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderAllProducts() {
    renderProducts('hot_item', 'hot-product__list');
    renderProducts('new_item', 'new-products__list');
    renderProducts('best_item', 'best-sellers__list');
}

// ================== Cart Operations ==================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingProduct = cart.find(p => p.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast(`${product.name} đã được thêm vào giỏ hàng!`, 'success');
}

function removeFromCart(id) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-list');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;

    if (totalCount === 0) {
        cartList.classList.add('cart-list--empty');
    } else {
        cartList.classList.remove('cart-list--empty');
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-item__list');
    if (!cartItems) return;

    cartItems.innerHTML = '';  
    let totalPrice = 0;  

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <img class="cart-item-img" src="${item.img}" alt="${item.name}">
            <div class="cart-item__wrap">
                <p class="cart-item__name">${item.name}</p>
                <div class="cart-item__body">
                    <div class="cart-item__info">
                        <p class="cart-item__quantity">${item.quantity}</p>
                        <p class="cart-item__multiply">x</p>
                        <p class="cart-item__price">${item.new_price.toLocaleString()}đ</p>
                    </div>
                    <button class="cart-item__remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="cart-item__remove-icon fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;

        cartItems.appendChild(itemElement);
        totalPrice += item.new_price * item.quantity;
    });

    const totalPriceElement = document.querySelector('.cart__total-count');
    if (totalPriceElement) {
        totalPriceElement.innerText = totalPrice.toLocaleString() + 'đ';
    }
}
