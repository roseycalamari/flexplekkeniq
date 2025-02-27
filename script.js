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
                element.innerHTML = translation; // Changed from textContent to innerHTML
            }
        }
    });
    
    // Update active state on language buttons
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
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

// Original Kickback Calculator Functionality (renamed to avoid conflicts)
function setupCalculator() {
    const calculateButton = document.querySelector('.calculate-button');
    if (!calculateButton) return;

    calculateButton.addEventListener('click', () => {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'calculator-modal';
        modal.innerHTML = `
            <div class="calculator-content">
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

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .calculator-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }

            .calculator-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }

            .calculator-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .calculator-header h3 {
                font-size: 1.8rem;
                color: #2B6353;
                margin: 0;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                line-height: 1;
            }

            .input-group {
                margin-bottom: 25px;
            }

            .input-group label {
                display: block;
                margin-bottom: 10px;
                color: #333;
                font-weight: 500;
            }

            .amount-input {
                position: relative;
                display: flex;
                align-items: center;
            }

            .currency {
                position: absolute;
                left: 15px;
                color: #666;
                font-weight: 500;
            }

            .revenue-input {
                width: 100%;
                padding: 15px 15px 15px 35px;
                border: 2px solid #e1e1e1;
                border-radius: 10px;
                font-size: 1.1rem;
                transition: border-color 0.3s ease;
            }

            .revenue-input:focus {
                outline: none;
                border-color: #2B6353;
            }

            .calculation-result {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
            }

            .result-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e1e1e1;
            }

            .result-item:last-child {
                border-bottom: none;
                margin-top: 10px;
                padding-top: 20px;
                font-weight: 700;
            }

            .result-item .label {
                color: #666;
            }

            .result-item .value {
                font-weight: 600;
                color: #2B6353;
            }

            .qualification-status {
                font-weight: 700;
            }

            .qualification-status.qualified {
                color: #28a745 !important;
            }

            .qualification-status.not-qualified {
                color: #dc3545 !important;
            }

            .calculate-now-btn {
                width: 100%;
                padding: 15px;
                background: #2B6353;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .calculate-now-btn:hover {
                background: #55996f;
                transform: translateY(-2px);
            }
        `;

        document.head.appendChild(style);
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
            style.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Prevent closing when clicking inside calculator content
        modal.querySelector('.calculator-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced Header Scroll Behavior
function setupHeaderBehavior() {
    let lastScrollTop = 0;
    const header = document.getElementById('main-header');
    if (!header) return;
    
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
            // Scrolling down
            header.classList.add('hide');
        } else {
            // Scrolling up
            header.classList.remove('hide');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    }, false);
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
    
    // Reset any existing revealed classes
    elements.forEach(item => {
        const targetElements = document.querySelectorAll(item.selector);
        targetElements.forEach(el => {
            el.classList.remove('revealed', item.className);
            // Reset any inline transforms
            el.style.transform = '';
            el.style.opacity = '';
        });
    });
    
    // Setup new observer
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

// NEW KICKBACK SECTION FUNCTIONALITY

// Function to initialize scroll reveal animations for kickback section
function initializeKickbackReveal() {
    const revealItems = document.querySelectorAll('.kickback-intro, .how-it-works, .calculation-example, .kickback-benefits, .benefit-item');
    
    if (revealItems.length === 0) return;
    
    // Add reveal-item class to elements
    revealItems.forEach(item => {
        if (!item.classList.contains('benefit-item')) {
            item.classList.add('reveal-item');
        }
    });
    
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
        revealObserver.observe(item);
    });
}

// New Kickback Calculator Implementation
function setupKickbackCalculator() {
    // Initialize scroll reveal for kickback section
    initializeKickbackReveal();
    
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

        // Add modal styles if they don't exist
        if (!document.getElementById('calculator-styles')) {
            const style = document.createElement('style');
            style.id = 'calculator-styles';
            style.textContent = `
                .calculator-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                }

                .calculator-content {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .calculator-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .calculator-header h3 {
                    font-size: 1.8rem;
                    color: var(--primary-green);
                    margin: 0;
                }

                .close-modal {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    line-height: 1;
                }

                .input-group {
                    margin-bottom: 25px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 10px;
                    color: var(--dark-text);
                    font-weight: 500;
                }

                .amount-input {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .currency {
                    position: absolute;
                    left: 15px;
                    color: #666;
                    font-weight: 500;
                }

                .revenue-input {
                    width: 100%;
                    padding: 15px 15px 15px 35px;
                    border: 2px solid #e1e1e1;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    transition: border-color 0.3s ease;
                }

                .revenue-input:focus {
                    outline: none;
                    border-color: var(--primary-green);
                }

                .calculation-result {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .result-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e1e1e1;
                }

                .result-item:last-child {
                    border-bottom: none;
                    margin-top: 10px;
                    padding-top: 20px;
                    font-weight: 700;
                }

                .result-item .label {
                    color: #666;
                }

                .result-item .value {
                    font-weight: 600;
                    color: var(--primary-green);
                }

                .qualification-status {
                    font-weight: 700;
                }

                .qualification-status.qualified {
                    color: #28a745 !important;
                }

                .qualification-status.not-qualified {
                    color: #dc3545 !important;
                }

                .calculate-now-btn {
                    width: 100%;
                    padding: 15px;
                    background: var(--primary-green);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .calculate-now-btn:hover {
                    background: var(--secondary-green);
                    transform: translateY(-2px);
                }
            `;
            document.head.appendChild(style);
        }

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
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language first
    updateLanguage('en');
    
    // Setup all components with a slight delay between them
    setTimeout(() => setupHeaderBehavior(), 100);
    setTimeout(() => setupSmoothScrolling(), 200);
    setTimeout(() => setupCalculator(), 300);  // Original calculator
    setTimeout(() => initializeServiceAnimations(), 400);
    setTimeout(() => setupKickbackCalculator(), 500);  // New kickback calculator
    
    // Setup any scroll reveal animations
    setTimeout(() => setupScrollReveal(), 600);
    
    // Initialize room availability system
    setTimeout(() => {
        if (window.RoomAvailability && typeof initializeRoomAvailability === 'function') {
            initializeRoomAvailability();
        }
    }, 700);
});

// Add a window load event to ensure all resources are loaded
window.addEventListener('load', function() {
    // Re-initialize kickback section after everything has loaded
    initializeKickbackReveal();
});