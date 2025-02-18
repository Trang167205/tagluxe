// ================== Local Storage Handling ==================
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = []; // Nếu localStorage trống, khởi tạo giỏ hàng rỗng
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ================== Fetch Data ==================
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();

        syncCartWithProducts();
        renderCartItems(); 
        renderAllProducts();
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
}

// Đồng bộ cart với danh sách sản phẩm từ server
function syncCartWithProducts() {
    cart = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            return {
                ...item,
                name: product.name,
                img: product.img,
                new_price: product.new_price
            };
        }
        return item;
    });

    saveCartToStorage();
}

// ================== DOM Loaded Event ==================
window.addEventListener('DOMContentLoaded', async function () {
    loadCartFromStorage(); 
    renderCartItems(); 
    updateCartCount();

    await fetchProducts(); 
});

// ================== Lưu Thông Tin Đơn Hàng ==================
document.addEventListener("DOMContentLoaded", function () {
    const orderButton = document.querySelector(".cart__order-btn"); 
    
    if (orderButton) {
        orderButton.addEventListener("click", function () {
            const name = document.getElementById("customer-name").value.trim();
            const phone = document.getElementById("customer-phone").value.trim();
            const address = document.getElementById("customer-address").value.trim();
            const shipping = document.getElementById("shipping-method").value;
            const payment = document.getElementById("payment-method").value;

            if (!name || !phone || !address) {
                showToast(`Vui lòng nhập đầy đủ thông tin khách hàng`, 'warning');
                return;
            }

            const orderData = {
                customer: { name, phone, address },
                shippingMethod: shipping,
                paymentMethod: payment,
                cart: cart, 
                totalPrice: calculateTotalPrice()
            };

            localStorage.setItem("orderData", JSON.stringify(orderData));
            localStorage.removeItem('cart')
            showToast(`Thông tin đơn hàng của bạn đã được lưu`, 'success');
            setTimeout(() => {
                showToast(`Đang chuyển hướng về trang chính`, 'info');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            }, 1000);
        });
    }
});

// ================== Tính Tổng Tiền ==================
function calculateTotalPrice() {
    return cart.reduce((total, item) => total + item.new_price * item.quantity, 0);
}

// ================== Hiển thị Giỏ Hàng ==================
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
