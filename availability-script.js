// Initialize the room availability display for the main site
function initializeRoomAvailability() {
    // Display current date
    const dateElement = document.getElementById('availability-date');
    if (dateElement) {
        dateElement.textContent = window.RoomAvailability.getCurrentDate();
    }
    
    // Get room data
    const roomData = window.RoomAvailability.getRoomData();
    
    // Render small rooms
    renderRoomGrid('small-rooms-grid', roomData.smallRooms);
    
    // Render large rooms
    renderRoomGrid('large-rooms-grid', roomData.largeRooms);
    
    // Set up periodic refresh
    setInterval(refreshRoomData, 60000); // Refresh every minute
}

// Render room cards to the specified grid
function renderRoomGrid(gridId, rooms) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    // Clear loading indicator
    grid.innerHTML = '';
    
    if (rooms.length === 0) {
        grid.innerHTML = `<div class="empty-message">${currentLang === 'en' ? 'No rooms available' : 'Geen ruimtes beschikbaar'}</div>`;
        return;
    }
    
    // Add business hours information for booking context
    const businessHours = {
        start: '8:00',
        end: '20:00'
    };
    
    // Render each room
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        
        const statusClass = room.available ? 'available' : 'occupied';
        const statusText = room.available ? 
            (currentLang === 'en' ? 'Available' : 'Beschikbaar') : 
            (currentLang === 'en' ? `Occupied until ${room.bookedUntil}` : `Bezet tot ${room.bookedUntil}`);
        const statusIcon = room.available ? 'check-circle' : 'times-circle';
        
        roomCard.innerHTML = `
            <div class="room-info">
                <div class="room-name">${room.name}</div>
                <div class="room-capacity"><i class="fas fa-users"></i> ${currentLang === 'en' ? 'Capacity' : 'Capaciteit'}: ${room.capacity}</div>
            </div>
            <div class="room-status ${statusClass}">
                <i class="fas fa-${statusIcon} status-icon"></i>
                <span class="status-text">${statusText}</span>
            </div>
        `;
        
        grid.appendChild(roomCard);
    });
    
    // Add business hours note below the grid
    const hoursNote = document.createElement('div');
    hoursNote.className = 'hours-note';
    hoursNote.innerHTML = `<small>${currentLang === 'en' ? 'Booking hours' : 'Boekingsuren'}: ${businessHours.start} - ${businessHours.end}</small>`;
    grid.appendChild(hoursNote);
}

// Refresh room data display
function refreshRoomData() {
    // Check for expired bookings first
    const hasChanges = window.RoomAvailability.checkBookingTimes();
    
    // Get latest data
    const roomData = window.RoomAvailability.getRoomData();
    
    // Re-render if there were changes or force refresh
    if (hasChanges) {
        renderRoomGrid('small-rooms-grid', roomData.smallRooms);
        renderRoomGrid('large-rooms-grid', roomData.largeRooms);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // If RoomAvailability is loaded, initialize
    if (window.RoomAvailability) {
        // Initialize room data first
        window.RoomAvailability.initializeRoomData();
        
        // Then render room availability
        initializeRoomAvailability();
    }
});