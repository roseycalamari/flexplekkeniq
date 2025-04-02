// availability-script.js
// Handles the display of room availability and booking functionality

// Initialize room availability display
function initializeRoomAvailability() {
    // Initialize room data
    window.RoomAvailability.initializeRoomData();
    
    // Update date display
    updateDateDisplay();
    
    // Render rooms
    renderRooms();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up automatic refresh
    setInterval(refreshRoomData, 60000); // Refresh every minute
}

// Update the date display
function updateDateDisplay() {
    const dateElement = document.getElementById('availability-date');
    if (dateElement) {
        dateElement.textContent = window.RoomAvailability.getCurrentDate();
    }
}

// Render room cards
function renderRooms() {
    const roomData = window.RoomAvailability.getRoomData();
    
    // Render small rooms
    renderRoomCategory('small-rooms-grid', roomData.smallRooms);
    
    // Render large rooms
    renderRoomCategory('large-rooms-grid', roomData.largeRooms);
}

// Render a category of rooms
function renderRoomCategory(containerId, rooms) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Render each room
    rooms.forEach(room => {
        const roomCard = createRoomCard(room);
        container.appendChild(roomCard);
    });
}

// Create a room card element
function createRoomCard(room) {
    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    roomCard.dataset.roomId = room.id;
    
    const statusClass = room.available ? 'available' : 'occupied';
    const statusText = room.available ? 
        (currentLang === 'en' ? 'Available' : 'Beschikbaar') : 
        (currentLang === 'en' ? 'Occupied' : 'Bezet');
    const statusIcon = room.available ? 'fa-check-circle' : 'fa-times-circle';
    
    // Time info if room is booked
    const timeInfo = !room.available && room.bookedUntil ? 
        `<div class="room-time-info booked">${currentLang === 'en' ? 'Booked until' : 'Gereserveerd tot'} ${room.bookedUntil}</div>` : '';
    
    roomCard.innerHTML = `
        <div class="room-info">
            <div class="room-name">${room.name}</div>
            <div class="room-capacity"><i class="fas fa-users"></i> ${currentLang === 'en' ? 'Capacity' : 'Capaciteit'}: ${room.capacity}</div>
            ${timeInfo}
        </div>
        <div class="room-status ${statusClass}">
            <i class="fas ${statusIcon} status-icon"></i>
            <span class="status-text">${statusText}</span>
        </div>
    `;
    
    // Add event listener for future booking functionality
    if (room.available) {
        roomCard.addEventListener('click', () => {
            openBookingModal(room);
        });
        roomCard.style.cursor = 'pointer';
    }
    
    return roomCard;
}

// Refresh room data
function refreshRoomData() {
    // Check for expired bookings
    const changes = window.RoomAvailability.checkBookingTimes();
    
    // Re-render if changes were made
    if (changes) {
        renderRooms();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Book room button
    const bookRoomBtn = document.querySelector('.book-room-btn');
    if (bookRoomBtn) {
        bookRoomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find an available room
            const roomData = window.RoomAvailability.getRoomData();
            const availableSmallRoom = roomData.smallRooms.find(room => room.available);
            const availableLargeRoom = roomData.largeRooms.find(room => room.available);
            
            // Open booking modal for first available room
            if (availableSmallRoom) {
                openBookingModal(availableSmallRoom);
            } else if (availableLargeRoom) {
                openBookingModal(availableLargeRoom);
            } else {
                alert(currentLang === 'en' ? 
                    'No rooms are currently available. Please try again later.' : 
                    'Er zijn momenteel geen kamers beschikbaar. Probeer het later opnieuw.');
            }
        });
    }
}

// Open booking modal (placeholder for future Stripe integration)
function openBookingModal(room) {
    // This is a placeholder for future Stripe integration
    // For now, just show an alert
    alert(
        currentLang === 'en' ? 
        `Room booking for ${room.name} will be available soon with Stripe integration!` : 
        `Kamerboeking voor ${room.name} komt binnenkort beschikbaar met Stripe-integratie!`
    );
    
    // The code below is commented out until Stripe integration is implemented
    /*
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.id = 'booking-modal';
    
    // Get available time slots
    const timeSlots = window.RoomAvailability.getAvailableTimeSlots(room.id);
    
    // Generate time slot HTML
    let timeSlotsHtml = '';
    timeSlots.forEach(slot => {
        const availableClass = slot.available ? '' : 'unavailable';
        timeSlotsHtml += `
            <div class="time-slot ${availableClass}" data-time="${slot.time}">
                ${slot.time}
            </div>
        `;
    });
    
    // Modal content
    modal.innerHTML = `
        <div class="booking-modal-content">
            <div class="booking-modal-header">
                <h2 class="booking-modal-title">${currentLang === 'en' ? 'Book Room' : 'Boek Kamer'}: ${room.name}</h2>
                <button class="booking-modal-close">&times;</button>
            </div>
            <div class="booking-form">
                <div class="form-group">
                    <label for="booking-name">${currentLang === 'en' ? 'Your Name' : 'Je Naam'}</label>
                    <input type="text" id="booking-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="booking-email">${currentLang === 'en' ? 'Email Address' : 'E-mailadres'}</label>
                    <input type="email" id="booking-email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>${currentLang === 'en' ? 'Select Time Slot' : 'Selecteer Tijdslot'}</label>
                    <div class="time-slot-selector">
                        ${timeSlotsHtml}
                    </div>
                </div>
                <button class="payment-button" disabled>
                    ${currentLang === 'en' ? 'Proceed to Payment' : 'Ga naar Betaling'}
                </button>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Set up event listeners
    const closeButton = modal.querySelector('.booking-modal-close');
    closeButton.addEventListener('click', () => {
        closeBookingModal(modal);
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingModal(modal);
        }
    });
    
    // Time slot selection
    const timeSlotElements = modal.querySelectorAll('.time-slot:not(.unavailable)');
    timeSlotElements.forEach(slot => {
        slot.addEventListener('click', () => {
            // Remove selected class from all slots
            timeSlotElements.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked slot
            slot.classList.add('selected');
            
            // Enable payment button
            const paymentButton = modal.querySelector('.payment-button');
            paymentButton.disabled = false;
        });
    });
    
    // Payment button
    const paymentButton = modal.querySelector('.payment-button');
    paymentButton.addEventListener('click', () => {
        // Here, Stripe integration would be implemented
        // For now, just show success message
        showBookingSuccess(modal, room);
    });
    */
}

// Close booking modal
function closeBookingModal(modal) {
    modal.classList.remove('active');
    
    // Remove from DOM after animation
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Show booking success message
function showBookingSuccess(modal, room) {
    const modalContent = modal.querySelector('.booking-modal-content');
    const selectedTime = modal.querySelector('.time-slot.selected').dataset.time;
    
    modalContent.innerHTML = `
        <div class="booking-success-message">
            <div class="booking-success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 class="booking-success-title">${currentLang === 'en' ? 'Booking Confirmed!' : 'Boeking Bevestigd!'}</h2>
            <p class="booking-success-text">
                ${currentLang === 'en' ? 
                    'Your room has been successfully booked.' : 
                    'Je kamer is succesvol geboekt.'}
            </p>
            <div class="booking-details">
                <div class="booking-detail-item">
                    <span class="booking-detail-label">${currentLang === 'en' ? 'Room' : 'Kamer'}</span>
                    <span class="booking-detail-value">${room.name}</span>
                </div>
                <div class="booking-detail-item">
                    <span class="booking-detail-label">${currentLang === 'en' ? 'Time' : 'Tijd'}</span>
                    <span class="booking-detail-value">${selectedTime}</span>
                </div>
                <div class="booking-detail-item">
                    <span class="booking-detail-label">${currentLang === 'en' ? 'Capacity' : 'Capaciteit'}</span>
                    <span class="booking-detail-value">${room.capacity} ${currentLang === 'en' ? 'people' : 'mensen'}</span>
                </div>
            </div>
            <button class="payment-button close-success-btn">${currentLang === 'en' ? 'Close' : 'Sluiten'}</button>
        </div>
    `;
    
    // Close button event listener
    const closeButton = modalContent.querySelector('.close-success-btn');
    closeButton.addEventListener('click', () => {
        closeBookingModal(modal);
    });
}

// Language support
function updateTranslations() {
    // Update room cards
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        const statusElement = card.querySelector('.room-status .status-text');
        const isAvailable = statusElement.parentElement.classList.contains('available');
        
        if (statusElement) {
            statusElement.textContent = isAvailable ? 
                (currentLang === 'en' ? 'Available' : 'Beschikbaar') : 
                (currentLang === 'en' ? 'Occupied' : 'Bezet');
        }
        
        const capacityElement = card.querySelector('.room-capacity');
        if (capacityElement) {
            const capacityValue = capacityElement.textContent.match(/\d+/)[0];
            capacityElement.innerHTML = `<i class="fas fa-users"></i> ${currentLang === 'en' ? 'Capacity' : 'Capaciteit'}: ${capacityValue}`;
        }
        
        const timeInfoElement = card.querySelector('.room-time-info');
        if (timeInfoElement && timeInfoElement.classList.contains('booked')) {
            const timeValue = timeInfoElement.textContent.match(/\d+:\d+/)[0];
            timeInfoElement.textContent = `${currentLang === 'en' ? 'Booked until' : 'Gereserveerd tot'} ${timeValue}`;
        }
    });
    
    // Update date display
    updateDateDisplay();
}

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.RoomAvailability !== 'undefined') {
        initializeRoomAvailability();
    }
});

// Update translations when language changes
document.addEventListener('languageChanged', function() {
    updateTranslations();
});