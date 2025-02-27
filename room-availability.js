// room-availability.js
// Shared data layer between main site and admin interface

// Room data structure with initial state
const roomData = {
    smallRooms: [
        { id: 'small-1', name: 'Small Meeting Room 1', capacity: 4, available: true, bookedUntil: null },
        { id: 'small-2', name: 'Small Meeting Room 2', capacity: 4, available: false, bookedUntil: '14:30' }
    ],
    largeRooms: [
        { id: 'large-1', name: 'Large Conference Room 1', capacity: 10, available: true, bookedUntil: null },
        { id: 'large-2', name: 'Large Conference Room 2', capacity: 12, available: false, bookedUntil: '16:00' }
    ]
};

// Local storage key for availability data
const STORAGE_KEY = 'flexplekken_room_availability';

// Initialize room data from local storage or defaults
function initializeRoomData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Update with saved data but maintain structure
            Object.keys(roomData).forEach(roomType => {
                if (parsedData[roomType]) {
                    roomData[roomType] = parsedData[roomType];
                }
            });
        } catch (e) {
            console.error('Error parsing saved room data:', e);
            // If data is corrupted, we'll use the defaults
        }
    }
    
    // Update timestamp on room data to today's date
    updateTimestamp();
    
    // Save initial data
    saveRoomData();
    
    return roomData;
}

// Save current room data to local storage
function saveRoomData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...roomData,
        lastUpdated: new Date().toISOString()
    }));
}

// Get formatted current date
function getCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    
    // Default to English if currentLang is not defined
    const language = typeof currentLang !== 'undefined' ? currentLang : 'en';
    return now.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', options);
}

// Update timestamp on room data
function updateTimestamp() {
    roomData.lastUpdated = new Date().toISOString();
}

// Update a room's availability
function updateRoomAvailability(roomType, roomId, isAvailable, bookedUntil = null) {
    const roomList = roomData[roomType];
    if (!roomList) return false;
    
    const roomIndex = roomList.findIndex(room => room.id === roomId);
    if (roomIndex === -1) return false;
    
    roomList[roomIndex].available = isAvailable;
    roomList[roomIndex].bookedUntil = bookedUntil;
    
    updateTimestamp();
    saveRoomData();
    return true;
}

// Get all room data
function getRoomData() {
    return JSON.parse(JSON.stringify(roomData)); // Return a copy
}

// Reset all rooms to available
function resetAllRoomsToAvailable() {
    Object.keys(roomData).forEach(roomType => {
        if (Array.isArray(roomData[roomType])) {
            roomData[roomType].forEach(room => {
                room.available = true;
                room.bookedUntil = null;
            });
        }
    });
    
    updateTimestamp();
    saveRoomData();
    return true;
}

// Check if booking times have expired and automatically update status
function checkBookingTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let hasChanges = false;
    
    // Helper function to process rooms
    const processRooms = (roomType) => {
        roomData[roomType].forEach(room => {
            if (!room.available && room.bookedUntil) {
                const [hours, minutes] = room.bookedUntil.split(':').map(Number);
                
                // Check if booking time has passed
                if ((currentHour > hours) || 
                    (currentHour === hours && currentMinute >= minutes)) {
                    room.available = true;
                    room.bookedUntil = null;
                    hasChanges = true;
                    console.log(`Room ${room.name} automatically marked as available (booking expired)`);
                }
            }
        });
    };
    
    // Process all room types
    Object.keys(roomData).forEach(roomType => {
        if (Array.isArray(roomData[roomType])) {
            processRooms(roomType);
        }
    });
    
    // Save changes if any rooms were updated
    if (hasChanges) {
        updateTimestamp();
        saveRoomData();
    }
    
    return hasChanges;
}

// Export functions for use in other files
window.RoomAvailability = {
    initializeRoomData,
    getRoomData,
    updateRoomAvailability,
    getCurrentDate,
    resetAllRoomsToAvailable,
    checkBookingTimes
};

// Set up periodic check for expired bookings (every minute)
setInterval(() => {
    window.RoomAvailability.checkBookingTimes();
}, 60000);