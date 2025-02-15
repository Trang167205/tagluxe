// // Cart 
// let cart = [];

// function addToCart(id) { //Hàm thêm sản phẩm vào giỏ hàng
//     const product = products.find(p => p.id === id); //Tìm sản phẩm theo id
//     const existingProduct = cart.find(p => p.id === id); //Kiểm tra nếu sản phẩm đã có trong giỏ

//     if (existingProduct) {
//         existingProduct.quantity += 1; // Tăng số lượng nếu sản phẩm đã tồn tại
//     } else {
//         cart.push({ ...product, quantity: 1 }); // Thêm sản phẩm mới
//     }
    
//     updateCartCount(); //Cập nhật sản phẩm trong giỏ
//     showToast(`${product.name} đã được thêm vào giỏ hàng!`);
// }

// //Hàm cập nhật số lượng sản phẩm trong giỏ hàng
// function updateCartCount() {
//     const cartCount = document.getElementById('cart-count');
//     //Tính tổng số lượng tất cả các sản phẩm trong giỏ
//     cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0); // Tính tổng số lượng
// }