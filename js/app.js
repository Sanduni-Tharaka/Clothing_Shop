let products = [
    { id: 1, name: "Classic T-Shirt", price: 2499.00, category: "shirts" },
    { id: 2, name: "Denim Jeans", price: 4599.00, category: "pants" },
    { id: 3, name: "Summer Dress", price: 3299.00, category: "shirts" },
    { id: 4, name: "Leather Belt", price: 1299.00, category: "accessories" },
    { id: 5, name: "Sunglasses", price: 1899.00, category: "accessories" },
    { id: 6, name: "Baseball Cap", price: 899.00, category: "accessories" },
    { id: 7, name: "Formal Shirt", price: 2899.00, category: "shirts" },
    { id: 8, name: "Casual Pants", price: 2399.00, category: "pants" }
];

let cart = [];
let discount = 0;

window.onload = function() {
    showProducts();
    setupButtons();
    updateCartDisplay();
};

function showProducts(category = 'all') {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <div class="price">Rs. ${product.price.toFixed(2)}</div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button class="delete-btn" onclick="removeProduct(${product.id})">Delete</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function setupButtons() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            showProducts(this.dataset.category);
        });
    });
    
    document.getElementById('applyDiscount').addEventListener('click', function() {
        const discountInput = document.getElementById('discount');
        const discountValue = parseFloat(discountInput.value);
        
        if (discountValue >= 0 && discountValue <= 100) {
            discount = discountValue;
            updateCartDisplay();
        } else {
            alert('Please enter discount between 0-100');
        }
    });
    
    document.getElementById('checkout').addEventListener('click', showReceipt);
    document.getElementById('newSale').addEventListener('click', resetSale);
    document.getElementById('closeReceipt').addEventListener('click', function() {
        document.getElementById('receiptModal').style.display = 'none';
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty">Cart is empty</p>';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                Rs. ${item.price.toFixed(2)} × ${item.quantity}
            </div>
            <div class="item-controls">
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <span class="remove-btn" onclick="removeFromCart(${item.id})">×</span>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('discountValue').textContent = `Rs. ${discountAmount.toFixed(2)}`;
    document.getElementById('total').textContent = `Rs. ${total.toFixed(2)}`;
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function showReceipt() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let subtotal = 0;
    let receiptHTML = '<h3>FashionRack Receipt</h3><div class="receipt-items">';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        receiptHTML += `
            <div class="receipt-item">
                <span>${item.name} (${item.quantity})</span>
                <span>Rs. ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    receiptHTML += `</div>
        <div class="receipt-total">
            <div class="receipt-item">
                <span>Subtotal:</span>
                <span>Rs. ${subtotal.toFixed(2)}</span>
            </div>
            <div class="receipt-item">
                <span>Discount:</span>
                <span>Rs. ${discountAmount.toFixed(2)}</span>
            </div>
            <div class="receipt-item">
                <strong>Total:</strong>
                <strong>Rs. ${total.toFixed(2)}</strong>
            </div>
        </div>
    `;
    
    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('receiptModal').style.display = 'flex';
}

function resetSale() {
    cart = [];
    discount = 0;
    document.getElementById('discount').value = '';
    updateCartDisplay();
}

function addNewProduct() {
    const name = document.getElementById('newProductName').value;
    const price = parseFloat(document.getElementById('newProductPrice').value);
    const category = document.getElementById('newProductCategory').value;
    
    if (!name || isNaN(price)) {
        alert('Please enter product name and price');
        return;
    }
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({
        id: newId,
        name: name,
        price: price,
        category: category
    });
    
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPrice').value = '';
    showProducts();
    
    alert('Product added successfully!');
}

function removeProduct(productId) {
    if (confirm('Delete this product?')) {
        products = products.filter(p => p.id !== productId);
        cart = cart.filter(item => item.id !== productId);
        showProducts();
        updateCartDisplay();
    }
}