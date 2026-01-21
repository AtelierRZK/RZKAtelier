// Welcome and Onboarding System for WebAzhar
// Provides guided tours, welcome messages, and interactive onboarding

class WelcomeSystem {
    constructor() {
        this.currentStep = 0;
        this.tourSteps = [];
        this.isFirstVisit = this.checkFirstVisit();
        this.init();
    }

    init() {
        this.createWelcomeModal();
        this.setupTourSteps();
        this.createTourOverlay();
        this.setupEventListeners();
        
        if (this.isFirstVisit) {
            this.showWelcomeMessage();
        }

        this.createFeatureHighlights();
        this.setupProductCarousel();
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('webazhar-visited');
        if (!hasVisited) {
            localStorage.setItem('webazhar-visited', 'true');
            return true;
        }
        return false;
    }

    createWelcomeModal() {
        const modal = document.createElement('div');
        modal.id = 'welcome-modal';
        modal.className = 'welcome-modal';
        modal.innerHTML = `
            <div class="welcome-modal-content">
                <div class="welcome-header">
                    <h2>Welcome to WebAzhar! 👋</h2>
                    <button class="close-welcome" aria-label="Close">&times;</button>
                </div>
                <div class="welcome-body">
                    <div class="welcome-step active" data-step="1">
                        <div class="welcome-icon">🎉</div>
                        <h3>Welcome to Your Fashion Destination</h3>
                        <p>Discover unique clothing designs, customize your style, and shop with confidence. We're excited to have you here!</p>
                        <div class="welcome-features">
                            <div class="feature-item">
                                <span class="feature-icon">👕</span>
                                <span>Custom Designs</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🛍️</span>
                                <span>Easy Shopping</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🎨</span>
                                <span>Personalization</span>
                            </div>
                        </div>
                    </div>
                    <div class="welcome-step" data-step="2">
                        <div class="welcome-icon">🗺️</div>
                        <h3>Let Us Show You Around</h3>
                        <p>Take our guided tour to discover all the amazing features we have to offer. It only takes a minute!</p>
                        <div class="tour-benefits">
                            <div class="benefit-item">✨ Discover hidden features</div>
                            <div class="benefit-item">🎯 Learn navigation shortcuts</div>
                            <div class="benefit-item">💡 Get pro shopping tips</div>
                        </div>
                    </div>
                    <div class="welcome-step" data-step="3">
                        <div class="welcome-icon">🎁</div>
                        <h3>Special Welcome Offer</h3>
                        <p>As a new visitor, enjoy <strong>15% OFF</strong> your first order with code:</p>
                        <div class="promo-code">
                            <code id="welcome-code">WELCOME15</code>
                            <button class="copy-code" data-tooltip="Copy to clipboard">📋</button>
                        </div>
                        <small>Valid for 7 days. Cannot be combined with other offers.</small>
                    </div>
                </div>
                <div class="welcome-footer">
                    <div class="step-indicators">
                        <span class="step-dot active" data-step="1"></span>
                        <span class="step-dot" data-step="2"></span>
                        <span class="step-dot" data-step="3"></span>
                    </div>
                    <div class="welcome-actions">
                        <button class="btn-secondary skip-welcome">Skip</button>
                        <button class="btn-primary next-step">Next</button>
                        <button class="btn-primary start-tour" style="display: none;">Start Tour</button>
                        <button class="btn-primary start-shopping" style="display: none;">Start Shopping</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupTourSteps() {
        this.tourSteps = [
            {
                target: '.header-logo',
                title: 'Welcome to WebAzhar',
                content: 'This is your fashion destination. Click our logo anytime to return to the homepage.',
                position: 'bottom'
            },
            {
                target: 'nav a[href*="Men"]',
                title: 'Shop by Category',
                content: 'Browse our categories for Men, Women, and more. Each section has curated collections.',
                position: 'bottom'
            },
            {
                target: '.cart-link',
                title: 'Your Shopping Cart',
                content: 'Items you add will appear here. You can review and checkout anytime.',
                position: 'left'
            },
            {
                target: 'nav a[href*="Customizer"]',
                title: 'Design Your Own',
                content: 'Use our customizer to create unique designs and personalized clothing.',
                position: 'bottom'
            },
            {
                target: '.theme-toggle',
                title: 'Theme Toggle',
                content: 'Switch between light and dark themes for your preferred viewing experience.',
                position: 'left'
            },
            {
                target: '.hero, .featured-categories',
                title: 'Discover Products',
                content: 'Explore featured categories and trending items right on our homepage.',
                position: 'center'
            }
        ];
    }

    createTourOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.className = 'tour-overlay';
        overlay.innerHTML = `
            <div class="tour-spotlight"></div>
            <div class="tour-tooltip">
                <div class="tour-content">
                    <h3 class="tour-title"></h3>
                    <p class="tour-description"></p>
                    <div class="tour-progress">
                        <span class="current-step">1</span> of <span class="total-steps">${this.tourSteps.length}</span>
                    </div>
                </div>
                <div class="tour-actions">
                    <button class="btn-secondary skip-tour">Skip Tour</button>
                    <div class="tour-navigation">
                        <button class="btn-outline prev-step" disabled>Previous</button>
                        <button class="btn-primary next-step">Next</button>
                        <button class="btn-primary finish-tour" style="display: none;">Finish</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    setupEventListeners() {
        // Welcome modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-welcome') || e.target.classList.contains('skip-welcome')) {
                this.hideWelcomeModal();
            }
            
            if (e.target.classList.contains('next-step') && e.target.closest('.welcome-modal')) {
                this.nextWelcomeStep();
            }
            
            if (e.target.classList.contains('start-tour')) {
                this.hideWelcomeModal();
                this.startGuidedTour();
            }
            
            if (e.target.classList.contains('start-shopping')) {
                this.hideWelcomeModal();
                this.scrollToProducts();
            }
            
            if (e.target.classList.contains('copy-code')) {
                this.copyPromoCode();
            }

            // Tour events
            if (e.target.classList.contains('skip-tour')) {
                this.endTour();
            }
            
            if (e.target.classList.contains('next-step') && e.target.closest('.tour-overlay')) {
                this.nextTourStep();
            }
            
            if (e.target.classList.contains('prev-step')) {
                this.prevTourStep();
            }
            
            if (e.target.classList.contains('finish-tour')) {
                this.endTour();
            }

            // Step indicators
            if (e.target.classList.contains('step-dot')) {
                const step = parseInt(e.target.dataset.step);
                this.goToWelcomeStep(step);
            }
        });

        // Add tour trigger button
        this.addTourButton();
    }

    addTourButton() {
        const button = document.createElement('button');
        button.className = 'tour-trigger';
        button.innerHTML = '🎯 Take Tour';
        button.title = 'Take a guided tour of our website';
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 4px 20px var(--shadow-medium);
            z-index: 1400;
            transition: var(--transition);
        `;
        
        button.addEventListener('click', () => this.startGuidedTour());
        document.body.appendChild(button);

        // Auto-hide after some time
        setTimeout(() => {
            button.style.transform = 'translateX(150px)';
            setTimeout(() => button.remove(), 300);
        }, 10000);
    }

    showWelcomeMessage() {
        const modal = document.getElementById('welcome-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextWelcomeStep() {
        const currentStep = document.querySelector('.welcome-step.active');
        const currentStepNum = parseInt(currentStep.dataset.step);
        
        if (currentStepNum < 3) {
            const nextStepNum = currentStepNum + 1;
            const nextStep = document.querySelector(`[data-step="${nextStepNum}"]`);
            const nextDot = document.querySelector(`.step-dot[data-step="${nextStepNum}"]`);
            
            currentStep.classList.remove('active');
            document.querySelector(`.step-dot[data-step="${currentStepNum}"]`).classList.remove('active');
            
            nextStep.classList.add('active');
            nextDot.classList.add('active');

            // Update buttons
            if (nextStepNum === 2) {
                document.querySelector('.next-step').textContent = 'Next';
            } else if (nextStepNum === 3) {
                document.querySelector('.next-step').style.display = 'none';
                document.querySelector('.start-tour').style.display = 'inline-block';
                document.querySelector('.start-shopping').style.display = 'inline-block';
            }
        }
    }

    goToWelcomeStep(stepNum) {
        document.querySelectorAll('.welcome-step').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.step-dot').forEach(dot => dot.classList.remove('active'));
        
        document.querySelector(`[data-step="${stepNum}"]`).classList.add('active');
        document.querySelector(`.step-dot[data-step="${stepNum}"]`).classList.add('active');
    }

    startGuidedTour() {
        this.currentStep = 0;
        this.showTourStep(0);
        document.getElementById('tour-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    showTourStep(stepIndex) {
        if (stepIndex >= this.tourSteps.length) {
            this.endTour();
            return;
        }

        const step = this.tourSteps[stepIndex];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextTourStep();
            return;
        }

        // Update tour content
        document.querySelector('.tour-title').textContent = step.title;
        document.querySelector('.tour-description').textContent = step.content;
        document.querySelector('.current-step').textContent = stepIndex + 1;

        // Position spotlight and tooltip
        this.positionTourElements(target, step.position);

        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-step');
        const nextBtn = document.querySelector('.next-step');
        const finishBtn = document.querySelector('.finish-tour');

        prevBtn.disabled = stepIndex === 0;
        
        if (stepIndex === this.tourSteps.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
        }

        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionTourElements(target, position) {
        const spotlight = document.querySelector('.tour-spotlight');
        const tooltip = document.querySelector('.tour-tooltip');
        const rect = target.getBoundingClientRect();

        // Position spotlight
        spotlight.style.cssText = `
            position: absolute;
            top: ${rect.top + window.scrollY - 10}px;
            left: ${rect.left - 10}px;
            width: ${rect.width + 20}px;
            height: ${rect.height + 20}px;
            border-radius: var(--border-radius);
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
            z-index: 2001;
            pointer-events: none;
        `;

        // Position tooltip
        let tooltipTop, tooltipLeft;
        switch (position) {
            case 'bottom':
                tooltipTop = rect.bottom + window.scrollY + 20;
                tooltipLeft = rect.left + (rect.width / 2);
                tooltip.style.transform = 'translateX(-50%)';
                break;
            case 'top':
                tooltipTop = rect.top + window.scrollY - 20;
                tooltipLeft = rect.left + (rect.width / 2);
                tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
                break;
            case 'left':
                tooltipTop = rect.top + window.scrollY + (rect.height / 2);
                tooltipLeft = rect.left - 20;
                tooltip.style.transform = 'translateX(-100%) translateY(-50%)';
                break;
            case 'right':
                tooltipTop = rect.top + window.scrollY + (rect.height / 2);
                tooltipLeft = rect.right + 20;
                tooltip.style.transform = 'translateY(-50%)';
                break;
            default: // center
                tooltipTop = window.innerHeight / 2 + window.scrollY;
                tooltipLeft = window.innerWidth / 2;
                tooltip.style.transform = 'translate(-50%, -50%)';
        }

        tooltip.style.top = `${tooltipTop}px`;
        tooltip.style.left = `${tooltipLeft}px`;
    }

    nextTourStep() {
        this.currentStep++;
        this.showTourStep(this.currentStep);
    }

    prevTourStep() {
        this.currentStep--;
        this.showTourStep(this.currentStep);
    }

    endTour() {
        document.getElementById('tour-overlay').classList.remove('active');
        document.body.style.overflow = '';
        
        // Show completion message
        if (window.uiEnhancements) {
            window.uiEnhancements.showToast('Tour completed! Happy shopping! 🎉', 'success', 3000);
        }
    }

    copyPromoCode() {
        const code = document.getElementById('welcome-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            if (window.uiEnhancements) {
                window.uiEnhancements.showToast('Promo code copied! 📋', 'success', 2000);
            }
        });
    }

    scrollToProducts() {
        const productsSection = document.querySelector('.featured-products, .featured-categories');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    createFeatureHighlights() {
        // Add feature highlights to the homepage
        const highlights = [
            {
                icon: '🎨',
                title: 'Custom Designs',
                description: 'Create your unique style with our design tools'
            },
            {
                icon: '⚡',
                title: 'Fast Delivery',
                description: 'Get your orders delivered in 2-3 business days'
            },
            {
                icon: '🛡️',
                title: 'Quality Guarantee',
                description: '100% satisfaction guarantee on all products'
            },
            {
                icon: '💫',
                title: 'Premium Materials',
                description: 'Only the finest fabrics and materials used'
            }
        ];

        const highlightsContainer = document.createElement('div');
        highlightsContainer.className = 'feature-highlights';
        highlightsContainer.innerHTML = `
            <div class="highlights-header fade-in">
                <h2>Why Choose WebAzhar?</h2>
                <p>Experience the difference with our premium features</p>
            </div>
            <div class="highlights-grid">
                ${highlights.map((feature, index) => `
                    <div class="highlight-card fade-in" style="transition-delay: ${index * 0.1}s">
                        <div class="highlight-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        `;

        // Insert after hero section or at the end of main content
        const insertPoint = document.querySelector('.hero') || document.querySelector('main');
        if (insertPoint) {
            insertPoint.insertAdjacentElement('afterend', highlightsContainer);
        }
    }

    setupProductCarousel() {
        // Enhanced product carousel with auto-scroll and interaction
        const carousel = document.querySelector('.featured-products .product-grid');
        if (!carousel) return;

        carousel.classList.add('product-carousel');
        
        // Add navigation buttons
        const navigation = document.createElement('div');
        navigation.className = 'carousel-navigation';
        navigation.innerHTML = `
            <button class="carousel-btn prev" data-tooltip="Previous products">‹</button>
            <button class="carousel-btn next" data-tooltip="Next products">›</button>
        `;
        carousel.parentNode.insertBefore(navigation, carousel);

        // Add scroll indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        carousel.parentNode.appendChild(indicators);

        this.initializeCarousel(carousel);
    }

    initializeCarousel(carousel) {
        let currentIndex = 0;
        const cards = carousel.querySelectorAll('.product-card');
        const cardsPerView = this.getCardsPerView();
        const totalSlides = Math.ceil(cards.length / cardsPerView);

        // Create indicators
        const indicators = carousel.parentNode.querySelector('.carousel-indicators');
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            indicators.appendChild(dot);
        }

        // Navigation buttons
        const prevBtn = carousel.parentNode.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.parentNode.querySelector('.carousel-btn.next');

        prevBtn.addEventListener('click', () => {
            currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
            this.updateCarousel(carousel, currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
            this.updateCarousel(carousel, currentIndex);
        });

        // Auto-scroll (optional)
        setInterval(() => {
            currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
            this.updateCarousel(carousel, currentIndex);
        }, 5000);
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    updateCarousel(carousel, index) {
        const cardsPerView = this.getCardsPerView();
        const offset = -index * (100 / this.getCardsPerView());
        carousel.style.transform = `translateX(${offset}%)`;

        // Update indicators
        const indicators = carousel.parentNode.querySelectorAll('.carousel-dot');
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    goToSlide(index) {
        this.updateCarousel(document.querySelector('.product-carousel'), index);
    }
}

// CSS for welcome system
const welcomeCSS = `
/* Welcome Modal Styles */
.welcome-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.welcome-modal.active {
    opacity: 1;
    visibility: visible;
}

.welcome-modal-content {
    background: var(--card-background);
    border-radius: var(--border-radius-large);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px var(--shadow-heavy);
    transform: translateY(50px);
    transition: transform 0.3s ease;
}

.welcome-modal.active .welcome-modal-content {
    transform: translateY(0);
}

.welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 30px 0;
}

.welcome-header h2 {
    margin: 0;
    color: var(--accent-color);
    font-size: 2rem;
}

.close-welcome {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--nav-text);
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
}

.close-welcome:hover {
    background: var(--nav-hover-bg);
    color: var(--accent-color);
}

.welcome-body {
    padding: 20px 30px;
}

.welcome-step {
    display: none;
    text-align: center;
    animation: fadeIn 0.5s ease;
}

.welcome-step.active {
    display: block;
}

.welcome-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.welcome-step h3 {
    color: var(--text-color);
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.welcome-step p {
    color: var(--nav-text);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 25px;
}

.welcome-features {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin: 25px 0;
}

.feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background: var(--secondary-color);
    border-radius: var(--border-radius);
    flex: 1;
    transition: var(--transition);
}

.feature-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--shadow-light);
}

.feature-icon {
    font-size: 2rem;
}

.tour-benefits {
    text-align: left;
    max-width: 300px;
    margin: 0 auto;
}

.benefit-item {
    padding: 8px 0;
    color: var(--text-color);
    font-weight: 500;
}

.promo-code {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--secondary-color);
    padding: 20px;
    border-radius: var(--border-radius);
    margin: 20px 0;
}

.promo-code code {
    font-family: 'Courier New', monospace;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color);
    background: var(--card-background);
    padding: 10px 20px;
    border-radius: var(--border-radius-small);
    border: 2px dashed var(--accent-color);
}

.copy-code {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
}

.copy-code:hover {
    transform: scale(1.1);
}

.welcome-footer {
    padding: 0 30px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.step-indicators {
    display: flex;
    gap: 8px;
}

.step-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--input-border);
    border: none;
    cursor: pointer;
    transition: var(--transition);
}

.step-dot.active {
    background: var(--accent-color);
    transform: scale(1.2);
}

.welcome-actions {
    display: flex;
    gap: 15px;
}

/* Tour Overlay Styles */
.tour-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.tour-overlay.active {
    opacity: 1;
    visibility: visible;
}

.tour-tooltip {
    position: absolute;
    background: var(--card-background);
    border-radius: var(--border-radius);
    padding: 25px;
    max-width: 350px;
    box-shadow: 0 15px 40px var(--shadow-heavy);
    z-index: 2002;
}

.tour-title {
    margin: 0 0 10px 0;
    color: var(--accent-color);
    font-size: 1.3rem;
}

.tour-description {
    color: var(--text-color);
    margin: 0 0 20px 0;
    line-height: 1.6;
}

.tour-progress {
    text-align: center;
    color: var(--nav-text);
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.tour-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tour-navigation {
    display: flex;
    gap: 10px;
}

/* Feature Highlights */
.feature-highlights {
    padding: 80px 5%;
    background: var(--secondary-color);
}

.highlights-header {
    text-align: center;
    margin-bottom: 50px;
}

.highlights-header h2 {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 15px;
}

.highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.highlight-card {
    background: var(--card-background);
    padding: 40px 25px;
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: 0 8px 25px var(--shadow-light);
    transition: var(--transition);
}

.highlight-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px var(--shadow-heavy);
}

.highlight-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.highlight-card h3 {
    color: var(--accent-color);
    margin-bottom: 15px;
    font-size: 1.3rem;
}

/* Carousel Styles */
.product-carousel {
    display: flex;
    transition: transform 0.5s ease;
    overflow: hidden;
}

.carousel-navigation {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 10;
}

.carousel-btn {
    background: var(--card-background);
    border: 2px solid var(--accent-color);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    color: var(--accent-color);
    cursor: pointer;
    pointer-events: auto;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-btn:hover {
    background: var(--accent-color);
    color: white;
    transform: scale(1.1);
}

.carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 30px;
}

.carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--input-border);
    border: none;
    cursor: pointer;
    transition: var(--transition);
}

.carousel-dot.active {
    background: var(--accent-color);
    transform: scale(1.3);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .welcome-features {
        flex-direction: column;
        gap: 15px;
    }
    
    .welcome-actions {
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
    
    .welcome-actions button {
        width: 100%;
    }
    
    .highlights-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .tour-tooltip {
        max-width: 300px;
        padding: 20px;
    }
}
`;

// Inject CSS
const welcomeStyle = document.createElement('style');
welcomeStyle.textContent = welcomeCSS;
document.head.appendChild(welcomeStyle);

// Initialize welcome system
const welcomeSystem = new WelcomeSystem();

// Make it globally available
window.WelcomeSystem = WelcomeSystem;
