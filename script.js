// Language Switching Functionality
const languageSelect = document.getElementById('languageSelect');
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
    currentLang = lang;
}

languageSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
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

// Header Scroll Behavior
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Hide header on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        header.classList.add('hidden');
    } else if (scrollTop < lastScrollTop || scrollTop <= headerHeight) {
        header.classList.remove('hidden');
    }

    lastScrollTop = scrollTop;
});

// Initialize Map
function initMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=CjJUUuaqGXfKiV9rFYZv',
        center: [4.656435, 52.484174], // Coordinates for Schieland 18, Beverwijk
        zoom: 15
    });

    // Add marker for the location
    const marker = new mapboxgl.Marker({
        color: "#55996f",
        scale: 1.2
    })
    .setLngLat([4.656435, 52.484174])
    .addTo(map);

    // Add popup with address
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25
    })
    .setHTML('<div style="padding: 10px;"><strong>FlexPlekken IQ</strong><br>Schieland 18, 1948 RM Beverwijk</div>')
    .setLngLat([4.656435, 52.484174]);

    marker.setPopup(popup);
    popup.addTo(map);

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
}

// Initialize map when the page loads
window.addEventListener('load', initMap);

// Booking Button Handlers
const bookingButtons = document.querySelectorAll('.book-now-btn, .cta-button, .book-membership-btn, .book-daypass-btn');

bookingButtons.forEach(button => {
    button.addEventListener('click', function() {
        const message = currentLang === 'en' 
            ? 'Booking functionality will be implemented soon. Please contact us at info@flexplekkeniq.com for reservations.'
            : 'Boekingsfunctionaliteit wordt binnenkort geïmplementeerd. Neem contact op via info@flexplekkeniq.com voor reserveringen.';
        alert(message);
    });
});

// Form Submission Handler with Language Support
const inquiryForm = document.getElementById('inquiry-form');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            message: this.querySelector('textarea').value
        };

        // Simulated form submission
        console.log('Form Submission:', formData);
        
        // Show success message based on current language
        const successMessage = currentLang === 'en'
            ? 'Thank you for your inquiry! We will get back to you soon.'
            : 'Bedankt voor uw aanvraag! We nemen spoedig contact met u op.';
        
        alert(successMessage);
        
        // Reset form
        this.reset();
    });
}

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

// Booking Options Animation
const bookingTypes = document.querySelectorAll('.booking-type');

const bookingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

bookingTypes.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease-out';
    bookingObserver.observe(item);
});

// Form Input Animation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Initialize language on page load
updateLanguage('en');