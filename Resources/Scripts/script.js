// Cart functionality
let cartCount = 0;
const cartLink = document.querySelector('.header-icons a:last-child');

function updateCart(count) {
    cartCount = count;
    cartLink.textContent = `Cart (${cartCount})`;
}

// Newsletter subscription
const newsletterForm = document.querySelector('.footer-section form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        if (validateEmail(email)) {
            alert('Thank you for subscribing to our newsletter!');
            e.target.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sticky header
const header = document.querySelector('.header-content');
const scrollThreshold = 50; // Threshold for adding scrolled class

window.addEventListener('scroll', () => {
    if (window.pageYOffset > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add to wishlist functionality
const wishlistButtons = document.querySelectorAll('.wishlist-btn');
wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');
        const action = button.classList.contains('active') ? 'added to' : 'removed from';
        alert(`Item ${action} your wishlist!`);
    });
}); 