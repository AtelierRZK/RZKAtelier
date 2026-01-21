// Cart state
let cart = [];
const CART_STORAGE_KEY = 'shopping_cart';

// Initialize cart from session storage
function initCart() {
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCartDisplay();
}

// Save cart to session storage
function saveCart() {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartDisplay();
}

// Add item to cart
function addToCart(product) {
    if (!product.size || product.size === '') {
        alert('Please select a size');
        return;
    }

    const existingItem = cart.find(item => 
        item.id === product.id && item.size === product.size
    );
        
        if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
        cart.push({
            ...product,
                quantity: 1
            });
        }
        
    saveCart();
    showCartNotification();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Update item quantity
function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = (item.quantity || 1) + change;
    
    if (newQuantity < 1) {
        removeFromCart(index);
    } else {
        item.quantity = newQuantity;
        saveCart();
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
}

// Update cart display
function updateCartDisplay() {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }

    // Update cart modal content
    const cartItems = document.getElementById('cart-items');
    const cartTotals = document.getElementById('cart-totals');
    
    if (!cartItems || !cartTotals) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotals.innerHTML = '';
            return;
        }

    // Render cart items
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-cart-index="${index}">
            <img src="${item.image || 'placeholder-image.jpg'}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>Price: R${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <input type="number" value="${item.quantity || 1}" min="1" step="1" data-action="qty-input">
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
        </div>
    `).join('');

    // Adjust quantity input widths to fit value length
    cartItems.querySelectorAll('input[type="number"][data-action="qty-input"]').forEach((input) => {
        adjustQuantityInputWidth(input);
    });

    // Update totals
    const total = calculateTotal();
    cartTotals.innerHTML = `
            <div class="subtotal">
                <span>Subtotal:</span>
            <span>R${total.toFixed(2)}</span>
            </div>
            <div class="shipping">
                <span>Shipping:</span>
            <span>${total >= 75 ? 'FREE' : 'R4.99'}</span>
            </div>
            <div class="total">
                <span>Total:</span>
            <span>R${(total + (total >= 75 ? 0 : 4.99)).toFixed(2)}</span>
            </div>
        <button id="checkout-btn" class="add-to-cart-btn" onclick="checkout()">Checkout</button>
    `;
}

// Show cart notification
function showCartNotification() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
    }
}

// Checkout function
function checkout() {
    alert('Checkout functionality would be implemented here');
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.toggle('active');
    }
}

// Close cart when clicking anywhere outside the cart content
document.addEventListener('click', (e) => {
    const cartModal = document.querySelector('.cart-modal');
    const cartContent = document.querySelector('.cart-modal-content');
    const cartLink = document.querySelector('.cart-link');

    if (!cartModal || !cartContent) return;
    if (!cartModal.classList.contains('active')) return;

    const clickedInsideCart = cartContent.contains(e.target);
    const clickedCartLink = cartLink && cartLink.contains(e.target);

    if (!clickedInsideCart && !clickedCartLink) {
        cartModal.classList.remove('active');
    }
});

// Close cart when clicking close button
document.addEventListener('DOMContentLoaded', () => {
    initCart();

    // Add click event listener to cart link
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    // Add click event listener to close button
    const closeBtn = document.querySelector('.close-cart');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const cartModal = document.querySelector('.cart-modal');
            if (cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Clear cart button
    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            const confirmed = confirm('Clear all items from your cart?');
            if (!confirmed) return;
            cart = [];
            saveCart();
        });
    }

    // Quantity controls (event delegation)
    const cartItemsEl = document.getElementById('cart-items');
    if (cartItemsEl) {
        // Change committed (on blur/enter)
        cartItemsEl.addEventListener('change', (e) => {
            const input = e.target.closest('input[type="number"][data-action="qty-input"]');
            if (!input) return;
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            const index = parseInt(cartItem.getAttribute('data-cart-index'));
            if (Number.isNaN(index)) return;

            const value = parseInt(input.value);
            if (Number.isNaN(value) || value < 1) {
                input.value = cart[index] ? (cart[index].quantity || 1) : 1;
                adjustQuantityInputWidth(input);
                return;
            }

            const current = cart[index] ? (cart[index].quantity || 1) : 1;
            const delta = value - current;
            if (delta !== 0) updateQuantity(index, delta);
            adjustQuantityInputWidth(input);
        });

        // Live width resize as user types
        cartItemsEl.addEventListener('input', (e) => {
            const input = e.target.closest('input[type="number"][data-action="qty-input"]');
            if (!input) return;
            adjustQuantityInputWidth(input);
        });

        // Support ArrowUp/ArrowDown to increment/decrement
        cartItemsEl.addEventListener('keydown', (e) => {
            const input = e.target.closest('input[type="number"][data-action="qty-input"]');
            if (!input) return;
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            const index = parseInt(cartItem.getAttribute('data-cart-index'));
            if (Number.isNaN(index)) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                updateQuantity(index, 1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                updateQuantity(index, -1);
            }
        });
    }
}); 

// Helper: adjust quantity input width to length of its value
function adjustQuantityInputWidth(input) {
    const length = String(input.value || '1').length;
    const ch = Math.max(2, length + 1);
    input.style.width = ch + 'ch';
}