class ThemeManager {
    constructor() {
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        // If no theme is set, use system preference
        this.theme = localStorage.getItem('theme') || (this.prefersDark.matches ? 'dark' : 'light');
        // Logo paths for light/dark themes
        this.logoPaths = {
            light: 'Resources/Images/logo.png',
            dark: 'Resources/Images/logod.png'
        };
        this.init();
        this.setupMediaListener();
    }

    init() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = this.getThemeIcon();
        document.body.appendChild(themeToggle);

        // Add click event listener
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Apply initial theme
        this.applyTheme();
    }

    setupMediaListener() {
        // Listen for system theme changes
        this.prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    getThemeIcon() {
        return this.theme === 'dark' ? 
            '<i class="fas fa-sun" aria-hidden="true"></i>' : 
            '<i class="fas fa-moon" aria-hidden="true"></i>';
    }

    toggleTheme() {
        // Simply toggle between light and dark
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        // Remove any existing theme
        document.documentElement.removeAttribute('data-theme');
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Update button icon
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.getThemeIcon();
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', 
                this.theme === 'dark' ? '#121212' : '#ffffff');
        }

        // Update header logos to match theme
        this.updateLogos();

        // Dispatch event for other scripts that might need to know about theme changes
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.theme }
        }));
    }

    updateLogos() {
        const targetSrc = this.theme === 'dark' ? this.logoPaths.dark : this.logoPaths.light;
        document.querySelectorAll('.header-logo').forEach((img) => {
            if (img && img.getAttribute('src') !== targetSrc) {
                img.setAttribute('src', targetSrc);
            }
        });
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeManager());
} else {
    new ThemeManager();
} 