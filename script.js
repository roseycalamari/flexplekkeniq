// Mobile Menu Functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

// Open mobile menu
function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Enable scrolling
}

// Set up mobile menu event listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on a nav link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
        
        // Smooth scroll to section
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                setTimeout(() => {
                    const yOffset = -60; // Account for header height
                    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 300); // Delay to allow menu to close first
            }
        }
    });
});

// Language Switching with Flags
const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'en';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Update active state on language buttons
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Sync language across all language buttons
    const allLangButtons = document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`);
    allLangButtons.forEach(btn => {
        btn.classList.add('active');
    });
    
    currentLang = lang;
}

// Initialize language buttons
langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        updateLanguage(lang);
    });
});

// Price Toggle Functionality
const priceToggleButtons = document.querySelectorAll('.price-toggle-btn');
priceToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dropdown = this.nextElementSibling;
        const isActive = dropdown.classList.contains('active');
        
        // Close all dropdowns first
        document.querySelectorAll('.price-dropdown').forEach(drop => {
            drop.classList.remove('active');
        });

        // Toggle the clicked dropdown
        if (!isActive) {
            dropdown.classList.add('active');
        }
    });
});

// Close price dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.service-item')) {
        document.querySelectorAll('.price-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Kickback Calculator Functionality
function setupKickbackCalculator() {
    const calculateButton = document.querySelector('.calculate-button');
    if (!calculateButton) return;

    calculateButton.addEventListener('click', () => {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'calculator-modal';
        modal.innerHTML = `
            <div class="calculator-content glass-effect">
                <div class="calculator-header">
                    <h3>${currentLang === 'en' ? 'Kickback Calculator' : 'Kickback Calculator'}</h3>
                    <button class="close-modal">×</button>
                </div>
                
                <div class="calculator-body">
                    <div class="input-group">
                        <label>${currentLang === 'en' ? 'Enter Your Monthly Investment' : 'Voer Uw Maandelijkse Investering in'}</label>
                        <div class="amount-input">
                            <span class="currency">€</span>
                            <input type="number" min="0" step="100" placeholder="3300" class="revenue-input">
                        </div>
                    </div>

                    <div class="calculation-result" style="display: none;">
                        <div class="result-item status">
                            <span class="label">${currentLang === 'en' ? 'Status' : 'Status'}</span>
                            <span class="value qualification-status"></span>
                        </div>
                        <div class="result-item threshold">
                            <span class="label">${currentLang === 'en' ? 'Monthly Investment' : 'Maandelijkse Investering'}</span>
                            <span class="value monthly-investment">€0</span>
                        </div>
                        <div class="result-item excess">
                            <span class="label">${currentLang === 'en' ? 'Amount Above €2,200' : 'Bedrag Boven €2.200'}</span>
                            <span class="value excess-amount">€0</span>
                        </div>
                        <div class="result-item kickback">
                            <span class="label">${currentLang === 'en' ? 'Your Monthly Return' : 'Uw Maandelijkse Rendement'}</span>
                            <span class="value kickback-amount">€0</span>
                        </div>
                        <div class="result-item annual">
                            <span class="label">${currentLang === 'en' ? 'Annual Returns' : 'Jaarlijks Rendement'}</span>
                            <span class="value annual-savings">€0</span>
                        </div>
                    </div>

                    <button class="calculate-now-btn">
                        ${currentLang === 'en' ? 'Calculate Now' : 'Nu Berekenen'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Calculator functionality
        const calculateNowBtn = modal.querySelector('.calculate-now-btn');
        const revenueInput = modal.querySelector('.revenue-input');
        const calculationResult = modal.querySelector('.calculation-result');
        const monthlyInvestment = modal.querySelector('.monthly-investment');
        const excessAmount = modal.querySelector('.excess-amount');
        const kickbackAmount = modal.querySelector('.kickback-amount');
        const annualSavings = modal.querySelector('.annual-savings');
        const qualificationStatus = modal.querySelector('.qualification-status');

        calculateNowBtn.addEventListener('click', () => {
            const revenue = parseFloat(revenueInput.value);
            
            if (!isNaN(revenue)) {
                const threshold = 2200;
                let excess = 0;
                let monthlyKickback = 0;
                
                if (revenue >= threshold) {
                    excess = revenue - threshold;
                    monthlyKickback = excess * 0.5; // 50% of excess amount
                    const percentage = 50;
                    qualificationStatus.textContent = currentLang === 'en' ? 
                        `✓ Qualified (${percentage}% return)` : 
                        `✓ Gekwalificeerd (${percentage}% rendement)`;
                    qualificationStatus.className = 'value qualification-status qualified';
                } else {
                    const amountNeeded = threshold - revenue;
                    qualificationStatus.textContent = currentLang === 'en' ? 
                        `€${amountNeeded.toFixed(2)} more needed to qualify` : 
                        `€${amountNeeded.toFixed(2)} meer nodig om te kwalificeren`;
                    qualificationStatus.className = 'value qualification-status not-qualified';
                }

                monthlyInvestment.textContent = `€${revenue.toFixed(2)}`;
                excessAmount.textContent = `€${excess.toFixed(2)}`;
                kickbackAmount.textContent = `€${monthlyKickback.toFixed(2)}`;
                annualSavings.textContent = `€${(monthlyKickback * 12).toFixed(2)}`;
                
                calculationResult.style.display = 'block';
            }
        });

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Prevent closing when clicking inside calculator content
        modal.querySelector('.calculator-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Focus the input field for better user experience
        setTimeout(() => {
            revenueInput.focus();
        }, 300);
    });
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return; // Skip links with just '#'
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const yOffset = -60; // Account for header height
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });
}

// Enhanced Header Scroll Behavior
function setupHeaderBehavior() {
    let lastScrollTop = 0;
    const header = document.getElementById('main-header');
    const mobileHeader = document.getElementById('mobile-header');
    
    if (!header && !mobileHeader) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Desktop header behavior
        if (header) {
            const headerHeight = header.offsetHeight;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
                // Scrolling down
                header.classList.add('hide');
            } else {
                // Scrolling up
                header.classList.remove('hide');
            }
        }

        // Update last scroll position
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

// Services Section Animation
function initializeServiceAnimations() {
    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const serviceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        serviceObserver.observe(item);
    });
}

// Function to initialize scroll reveal animations for kickback section
function initializeKickbackReveal() {
    const revealItems = document.querySelectorAll('.kickback-intro, .how-it-works, .calculation-example, .kickback-benefits, .benefit-item');
    
    if (revealItems.length === 0) return;
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all reveal items
    revealItems.forEach(item => {
        if (!item.classList.contains('benefit-item')) {
            item.classList.add('reveal-item');
        }
        revealObserver.observe(item);
    });
}

// Initialize Aspect Ratio Control
function initializeAspectRatioControl() {
    // Use CSS aspect-ratio property for modern browsers
    // For older browsers, use a fallback method
    const imageContainers = document.querySelectorAll('.service-image-container');
    
    if (!CSS.supports('aspect-ratio', '16 / 9')) {
        imageContainers.forEach(container => {
            // Create a placeholder to maintain aspect ratio
            const placeholder = document.createElement('div');
            placeholder.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
            placeholder.style.position = 'relative';
            
            // Move the image inside the placeholder
            const img = container.querySelector('img');
            if (img) {
                placeholder.appendChild(img.cloneNode(true));
                img.remove();
            }
            
            // Add the placeholder to the container
            container.appendChild(placeholder);
        });
    }
}

// Lazy Load Images
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    if (img.src) {
                        img.dataset.src = img.src;
                        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Tiny transparent gif
                    }
                    imageObserver.observe(img);
                }
            });
        }
    }
}

// Performance optimization
function optimizeWebPerformance() {
    // Passive event listeners for scroll and touch events
    const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'wheel'];
    passiveEvents.forEach(event => {
        window.addEventListener(event, () => {}, { passive: true });
    });
    
    // Debounce scroll handler
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll-intensive functions
    const debouncedScroll = debounce(() => {
        // Add any scroll-intensive operations here
    }, 100);
    
    window.addEventListener('scroll', debouncedScroll, { passive: true });
}

// Ensure external links open in new tab
function setupExternalLinks() {
    const links = document.querySelectorAll('a');
    const currentDomain = window.location.hostname;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.indexOf('http') === 0 && !href.includes(currentDomain)) {
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
}

// Add touch device detection
function detectTouchDevice() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch');
    }
}

// Setup scroll reveal animations
function setupScrollReveal() {
    // Define which elements should be animated
    const elements = [
        { selector: '.unique-concept', className: 'reveal-scale' },
        { selector: '.calculation-overview', className: 'reveal-slide-up' },
        { selector: '.workspace-card', className: 'reveal-slide-left', delay: 0 },
        { selector: '.office-card', className: 'reveal-slide-up', delay: 200 },
        { selector: '.meeting-card', className: 'reveal-slide-right', delay: 400 },
        { selector: '.calculate-button', className: 'reveal-bounce' }
    ];
    
    // Setup observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find the element in our config
                const config = elements.find(item => 
                    entry.target.matches(item.selector)
                );
                
                if (config) {
                    // Apply delay if specified
                    if (config.delay) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed', config.className);
                        }, config.delay);
                    } else {
                        entry.target.classList.add('revealed', config.className);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Apply initial state and observe elements
    elements.forEach(item => {
        const targetElements = document.querySelectorAll(item.selector);
        targetElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language first
    updateLanguage('en');
    
    // Setup core functionality
    setupMobileAccessibility();
    setupSmoothScrolling();
    setupHeaderBehavior();
    setupKickbackCalculator();
    initializeServiceAnimations();
    initializeKickbackReveal();
    initializeAspectRatioControl();
    setupLazyLoading();
    optimizeWebPerformance();
    setupExternalLinks();
    detectTouchDevice();
    setupScrollReveal();
    
    // Initialize room availability system
    setTimeout(() => {
        if (window.RoomAvailability && typeof initializeRoomAvailability === 'function') {
            initializeRoomAvailability();
        }
    }, 700);
});

// Mobile accessibility enhancements
function setupMobileAccessibility() {
    // Ensure touch targets are at least 44x44px
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    touchTargets.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
            // Don't actually modify elements, just log for debugging
            console.log(`Touch target too small: ${element.tagName}`, element);
        }
    });
    
    // Add focus styles for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });
    
    // Remove focus styles when mouse is used
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
}

// Add window load event to ensure all resources are loaded
window.addEventListener('load', function() {
    // Hide loading indicators once everything is loaded
    document.querySelectorAll('.loading-indicator').forEach(indicator => {
        indicator.style.display = 'none';
    });
    
    // Reinitialize reveal animations after all resources are loaded
    initializeKickbackReveal();
    
    // Update layout after images are loaded
    initializeAspectRatioControl();
});