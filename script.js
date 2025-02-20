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
                element.textContent = translation;
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

// Kickback Calculator Functionality
const calculateButton = document.querySelector('.calculate-button');

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
                        <span class="label">${currentLang === 'en' ? 'Your Monthly Return (50%)' : 'Uw Maandelijkse Rendement (50%)'}</span>
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
            z-index: 1000;
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
                qualificationStatus.textContent = currentLang === 'en' ? '✓ Qualified' : '✓ Gekwalificeerd';
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


// Smooth Scrolling for Navigation Links
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

// Enhanced Header Scroll Behavior
let lastScrollTop = 0;
const header = document.getElementById('main-header');
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

// Services Section Animation
const serviceItems = document.querySelectorAll('.service-item');

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

// Form Submission Handler
const inquiryForm = document.getElementById('inquiry-form');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            message: this.querySelector('textarea').value
        };

        console.log('Form Submission:', formData);
        
        const successMessage = currentLang === 'en'
            ? 'Thank you for your inquiry! We will get back to you soon.'
            : 'Bedankt voor uw aanvraag! We nemen spoedig contact met u op.';
        
        alert(successMessage);
        
        this.reset();
    });
}

// Initialize language on page load
updateLanguage('en');