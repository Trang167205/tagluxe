let products = [];  // Danh sách sản phẩm
let cart = [];  // Giỏ hàng

async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        renderAllProducts();
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
}

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

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingProduct = cart.find(p => p.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    renderCartItems();
    showToast(`${product.name} đã được thêm vào giỏ hàng!`,'success');
    
    // showToast(`${product.name} đã được thêm vào giỏ hàng!`,'error');
    // showToast(`${product.name} đã được thêm vào giỏ hàng!`,'warning');
    // showToast(`${product.name} đã được thêm vào giỏ hàng!`,'info');
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

window.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
    updateCartCount();
});

// Toast
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast__container';
    document.body.appendChild(container);
    return container;
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast__container') || createToastContainer();
    const iconClass = getIconClass(type);

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <i class="toast__icon ${iconClass}"></i>
        <span class="toast__message">${message}</span>
        <button class="toast__close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toast.querySelector('.toast__close').onclick = () => toast.remove();
    toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function getIconClass(type) {
    const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
    };
    return icons[type] || icons.info;
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-item__list'); // Đảm bảo chọn đúng phần tử
    if (!cartItems) return;

    cartItems.innerHTML = '';  // Xóa các phần tử cũ trong giỏ hàng
    let totalPrice = 0;  // Tổng tiền giỏ hàng

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

        // Tính tổng tiền (quantity * new_price)
        totalPrice += item.new_price * item.quantity;
    });

    // Hiển thị tổng tiền
    const totalPriceElement = document.querySelector('.cart__total-count');
    if (totalPriceElement) {
        totalPriceElement.innerText = totalPrice.toLocaleString() + 'đ';  // Cập nhật tổng tiền
    }
}

// ⚡ Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    renderCartItems();
}
