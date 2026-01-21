// Enhanced UI/UX JavaScript for WebAzhar
// Handles animations, interactions, loading states, and user feedback

class UIEnhancements {
    constructor() {
        this.init();
        this.setupScrollAnimations();
        this.setupLoadingStates();
        this.setupToastNotifications();
        this.setupProgressBars();
        this.setupImageLoading();
        this.setupFormEnhancements();
        this.setupButtonAnimations();
    }

    init() {
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEnhancements());
        } else {
            this.setupEnhancements();
        }
    }

    setupEnhancements() {
        this.addFadeInAnimations();
        this.setupHoverEffects();
        this.setupClickFeedback();
        this.initializeSkeletonLoaders();
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    // Add fade-in classes to elements
    addFadeInAnimations() {
        const elements = document.querySelectorAll(
            '.product-card, .info-item, .category, .benefit-item, .contact-info, .stockist-card'
        );
        
        elements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // Loading states for buttons and forms
    setupLoadingStates() {
        this.addButtonLoading();
        this.addFormLoading();
    }

    addButtonLoading() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .button, .submit-btn');
            if (button && !button.classList.contains('loading')) {
                // Add loading state for form submissions
                if (button.type === 'submit' || button.classList.contains('submit-btn')) {
                    this.showButtonLoading(button);
                    
                    // Simulate loading (remove in real implementation)
                    setTimeout(() => {
                        this.hideButtonLoading(button);
                        this.showButtonSuccess(button);
                    }, 2000);
                }
            }
        });
    }

    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.classList.add('loading');
        button.innerHTML = '<span class="loading-spinner"></span> Loading...';
        button.disabled = true;
    }

    hideButtonLoading(button) {
        button.classList.remove('loading');
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }

    showButtonSuccess(button) {
        button.classList.add('success');
        button.innerHTML = '✓ Success!';
        setTimeout(() => {
            button.classList.remove('success');
            button.innerHTML = button.dataset.originalText;
        }, 2000);
    }

    showButtonError(button) {
        button.classList.add('error');
        button.innerHTML = '✗ Error';
        setTimeout(() => {
            button.classList.remove('error');
            button.innerHTML = button.dataset.originalText;
        }, 2000);
    }

    // Form loading states
    addFormLoading() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                e.preventDefault(); // Prevent actual submission for demo
                this.showFormLoading(form);
                
                // Simulate form processing
                setTimeout(() => {
                    this.hideFormLoading(form);
                    this.showToast('Form submitted successfully!', 'success');
                }, 3000);
            }
        });
    }

    showFormLoading(form) {
        form.classList.add('loading');
        const submitBtn = form.querySelector('button[type="submit"], .submit-btn');
        if (submitBtn) {
            this.showButtonLoading(submitBtn);
        }
    }

    hideFormLoading(form) {
        form.classList.remove('loading');
        const submitBtn = form.querySelector('button[type="submit"], .submit-btn');
        if (submitBtn) {
            this.hideButtonLoading(submitBtn);
        }
    }

    // Toast notification system
    setupToastNotifications() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            pointer-events: none;
        `;
        document.body.appendChild(this.toastContainer);
    }

    showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getToastIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Progress bar animations
    setupProgressBars() {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const fill = bar.querySelector('.progress-bar-fill');
            const targetWidth = fill.dataset.width || '0%';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }

    // Progressive image loading
    setupImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loading');
                    
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Enhanced form interactions
    setupFormEnhancements() {
        // Floating labels
        document.querySelectorAll('.input-group input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });

        // Input validation feedback
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const isValid = input.checkValidity();
        const parent = input.closest('.input-group') || input.parentNode;
        
        parent.classList.remove('valid', 'invalid');
        
        if (input.value) {
            parent.classList.add(isValid ? 'valid' : 'invalid');
        }
    }

    // Button click animations
    setupButtonAnimations() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .button, .action-btn');
            if (button) {
                this.createRippleEffect(button, e);
            }
        });
    }

    createRippleEffect(button, e) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Skeleton loader initialization
    initializeSkeletonLoaders() {
        // Add skeleton loaders for dynamic content
        document.querySelectorAll('[data-skeleton]').forEach(el => {
            const skeletonType = el.dataset.skeleton;
            this.addSkeletonLoader(el, skeletonType);
        });
    }

    addSkeletonLoader(element, type) {
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;
        
        switch(type) {
            case 'text':
                skeleton.style.height = '1em';
                skeleton.style.marginBottom = '0.5em';
                break;
            case 'image':
                skeleton.style.height = '200px';
                skeleton.style.width = '100%';
                break;
            case 'card':
                skeleton.innerHTML = `
                    <div class="skeleton" style="height: 200px; margin-bottom: 1em;"></div>
                    <div class="skeleton" style="height: 1.5em; margin-bottom: 0.5em;"></div>
                    <div class="skeleton" style="height: 1em; width: 70%;"></div>
                `;
                break;
        }

        element.appendChild(skeleton);
        
        // Remove skeleton after content loads (simulate)
        setTimeout(() => {
            skeleton.remove();
            element.classList.add('loaded');
        }, 1500 + Math.random() * 1000);
    }

    // Hover effects for cards and interactive elements
    setupHoverEffects() {
        document.querySelectorAll('.product-card, .info-item, .benefit-item').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.enhanceCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardHover(card);
            });
        });
    }

    enhanceCardHover(card) {
        const img = card.querySelector('img');
        if (img) {
            img.style.filter = 'brightness(1.1) saturate(1.2)';
        }
    }

    resetCardHover(card) {
        const img = card.querySelector('img');
        if (img) {
            img.style.filter = '';
        }
    }

    // Click feedback for interactive elements
    setupClickFeedback() {
        document.addEventListener('click', (e) => {
            const clickable = e.target.closest('a, button, .clickable');
            if (clickable && !clickable.classList.contains('no-feedback')) {
                this.addClickFeedback(clickable);
            }
        });
    }

    addClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    // Wishlist functionality with animations
    setupWishlistAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn')) {
                const btn = e.target.closest('.wishlist-btn');
                btn.classList.toggle('active');
                
                if (btn.classList.contains('active')) {
                    this.showToast('Added to wishlist!', 'success', 2000);
                } else {
                    this.showToast('Removed from wishlist', 'info', 2000);
                }
            }
        });
    }

    // Enhanced cart animations
    setupCartAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const productCard = btn.closest('.product-card');
                
                // Animate product image to cart
                if (productCard) {
                    const img = productCard.querySelector('img');
                    this.animateToCart(img);
                }
                
                this.showToast('Added to cart!', 'success', 2000);
            }
        });
    }

    animateToCart(sourceElement) {
        const cart = document.querySelector('.cart-link');
        if (!cart) return;

        const clone = sourceElement.cloneNode(true);
        const sourceRect = sourceElement.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();

        clone.style.cssText = `
            position: fixed;
            top: ${sourceRect.top}px;
            left: ${sourceRect.left}px;
            width: ${sourceRect.width}px;
            height: ${sourceRect.height}px;
            z-index: 9999;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        document.body.appendChild(clone);

        setTimeout(() => {
            clone.style.transform = `translate(${cartRect.left - sourceRect.left}px, ${cartRect.top - sourceRect.top}px) scale(0.1)`;
            clone.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            clone.remove();
        }, 900);
    }

    // Utility methods
    static showLoading(element) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.dataset.loadingSpinner = 'true';
        element.appendChild(spinner);
    }

    static hideLoading(element) {
        const spinner = element.querySelector('[data-loading-spinner]');
        if (spinner) spinner.remove();
    }

    static createProgressBar(container, progress = 0) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `<div class="progress-bar-fill" style="width: ${progress}%"></div>`;
        container.appendChild(progressBar);
        return progressBar;
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.input-group.valid input {
    border-color: var(--success-color);
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.input-group.invalid input {
    border-color: var(--error-color);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form.loading {
    opacity: 0.7;
    pointer-events: none;
}

.skeleton-text {
    height: 1em;
    margin-bottom: 0.5em;
}

.skeleton-image {
    height: 200px;
    width: 100%;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize UI enhancements
const uiEnhancements = new UIEnhancements();

// Make it globally available
window.UIEnhancements = UIEnhancements;
