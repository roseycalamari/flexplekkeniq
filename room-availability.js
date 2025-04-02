// room-availability.js
// Simplified data layer for room availability without admin functionality

// Room data structure with initial state
const roomData = {
    smallRooms: [
        { id: 'small-1', name: 'Small Meeting Room 1', capacity: 4, available: true, bookedUntil: null },
        { id: 'small-2', name: 'Small Meeting Room 2', capacity: 4, available: false, bookedUntil: '14:30' },
        { id: 'small-3', name: 'Small Meeting Room 3', capacity: 4, available: true, bookedUntil: null }
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
    
    // Update timestamp on room data
    updateTimestamp();
    
    // Check for expired bookings
    checkBookingTimes();
    
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

// Get all room data
function getRoomData() {
    return JSON.parse(JSON.stringify(roomData)); // Return a copy
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

// Find a room by ID
function findRoomById(roomId) {
    let foundRoom = null;
    
    // Check in small rooms
    foundRoom = roomData.smallRooms.find(room => room.id === roomId);
    if (foundRoom) return { room: foundRoom, type: 'smallRooms' };
    
    // Check in large rooms
    foundRoom = roomData.largeRooms.find(room => room.id === roomId);
    if (foundRoom) return { room: foundRoom, type: 'largeRooms' };
    
    return null;
}

// Get available time slots for a room (for future booking functionality)
function getAvailableTimeSlots(roomId, date) {
    // Find the room
    const roomInfo = findRoomById(roomId);
    if (!roomInfo) return [];
    
    const { room } = roomInfo;
    
    // Business hours are 8:00 to 20:00
    const businessHours = {
        start: 8,
        end: 20
    };
    
    // Generate hourly time slots
    const timeSlots = [];
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        timeSlots.push({
            time: `${formattedHour}:00`,
            available: true
        });
    }
    
    // If the room is currently booked, mark the booked slots as unavailable
    if (!room.available && room.bookedUntil) {
        const [bookedHour] = room.bookedUntil.split(':').map(Number);
        
        // Mark all slots up to the booked hour as unavailable
        const now = new Date();
        const currentHour = now.getHours();
        
        timeSlots.forEach(slot => {
            const slotHour = parseInt(slot.time.split(':')[0]);
            
            // Mark as unavailable if the slot is before the booked time
            // or if it's in the past
            if (slotHour < bookedHour || slotHour < currentHour) {
                slot.available = false;
            }
        });
    }
    
    return timeSlots;
}

// Export functions for use in other files
window.RoomAvailability = {
    initializeRoomData,
    getRoomData,
    getCurrentDate,
    getAvailableTimeSlots,
    findRoomById,
    checkBookingTimes
};

// Set up periodic check for expired bookings (every minute)
setInterval(() => {
    window.RoomAvailability.checkBookingTimes();
}, 60000);