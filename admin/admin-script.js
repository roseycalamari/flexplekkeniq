// admin-script.js
// Admin functionality for room management

// Simple authentication functionality - for basic protection
function verifyAdminAccess() {
    // Check if already authenticated in this session
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    
    if (!isAuthenticated) {
        const password = prompt("Enter admin password:");
        // Replace with a proper password in production
        if (password === "admin1234") {
            sessionStorage.setItem('admin_authenticated', 'true');
        } else {
            alert("Access denied");
            window.location.href = "../index.html"; // Redirect to main site
            return false;
        }
    }
    return true;
}

// DOM Elements
const smallRoomsList = document.getElementById('small-rooms-list');
const largeRoomsList = document.getElementById('large-rooms-list');
const availableRoomsElement = document.getElementById('available-rooms').querySelector('.status-value');
const occupiedRoomsElement = document.getElementById('occupied-rooms').querySelector('.status-value');
const totalCapacityElement = document.getElementById('total-capacity').querySelector('.status-value');
const currentTimeElement = document.getElementById('occupancy-time').querySelector('.status-value');
const resetAllButton = document.getElementById('reset-all-rooms');
const reloadDataButton = document.getElementById('reload-data');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmActionButton = document.getElementById('confirm-action');
const cancelActionButton = document.getElementById('cancel-action');
const closeModalButton = document.querySelector('.close-modal');
const confirmationMessage = document.getElementById('confirmation-message');

// Current action reference for modal
let currentAction = null;

// Initialize admin console
function initializeAdminConsole() {
    // Verify admin access first
    if (!verifyAdminAccess()) return;
    
    // Initialize and load room data
    window.RoomAvailability.initializeRoomData();
    
    // Render room management interface
    renderRoomManagement();
    
    // Update dashboard metrics
    updateDashboardMetrics();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up timer for current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // Update time every minute
    
    // Setup detection for external changes to data
    setupExternalChangeDetection();
}

// Render room management interface
function renderRoomManagement() {
    // Get latest room data
    const roomData = window.RoomAvailability.getRoomData();
    
    // Clear existing content
    smallRoomsList.innerHTML = '';
    largeRoomsList.innerHTML = '';
    
    // Render small rooms
    roomData.smallRooms.forEach(room => {
        smallRoomsList.appendChild(createRoomItem('smallRooms', room));
    });
    
    // Render large rooms
    roomData.largeRooms.forEach(room => {
        largeRoomsList.appendChild(createRoomItem('largeRooms', room));
    });
}

// Create room item element
function createRoomItem(roomType, room) {
    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    
    // Generate unique IDs for form elements
    const toggleId = `toggle-${room.id}`;
    const timeInputId = `time-${room.id}`;
    
    roomItem.innerHTML = `
        <div class="room-details">
            <div class="room-name">${room.name}</div>
            <div class="room-capacity"><i class="fas fa-users"></i> Capacity: ${room.capacity}</div>
        </div>
        <label class="status-toggle">
            <input type="checkbox" id="${toggleId}" 
                   data-room-type="${roomType}" 
                   data-room-id="${room.id}"
                   ${!room.available ? 'checked' : ''}>
            <span class="toggle-slider"></span>
        </label>
        <div class="end-time">
            <input type="time" id="${timeInputId}" class="time-input" 
                   ${room.available ? 'disabled' : ''} 
                   value="${room.bookedUntil || ''}">
        </div>
    `;
    
    // Add event listeners after element is created
    setTimeout(() => {
        const toggleInput = document.getElementById(toggleId);
        const timeInput = document.getElementById(timeInputId);
        
        if (toggleInput && timeInput) {
            // Toggle switch event listener
            toggleInput.addEventListener('change', function() {
                const isOccupied = this.checked;
                timeInput.disabled = !isOccupied;
                
                if (isOccupied && !timeInput.value) {
                    // Default to current time + 1 hour
                    const now = new Date();
                    now.setHours(now.getHours() + 1);
                    timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                }
                
                updateRoomStatus(roomType, room.id, !isOccupied, isOccupied ? timeInput.value : null);
                
                // Log the change
                logStatusChange(roomType, room.id, room.available, !isOccupied);
            });
            
            // Time input event listener
            timeInput.addEventListener('change', function() {
                if (!toggleInput.checked) return; // Only update if room is occupied
                
                updateRoomStatus(roomType, room.id, false, this.value);
            });
        }
    }, 0);
    
    return roomItem;
}

// Update room status
function updateRoomStatus(roomType, roomId, isAvailable, bookedUntil) {
    // Update data
    window.RoomAvailability.updateRoomAvailability(roomType, roomId, isAvailable, bookedUntil);
    
    // Update dashboard metrics
    updateDashboardMetrics();
}

// Update dashboard metrics
function updateDashboardMetrics() {
    const roomData = window.RoomAvailability.getRoomData();
    
    // Count available/occupied rooms and total capacity
    let availableCount = 0;
    let occupiedCount = 0;
    let totalCapacity = 0;
    
    // Function to process a room array
    const processRooms = (rooms) => {
        rooms.forEach(room => {
            if (room.available) {
                availableCount++;
            } else {
                occupiedCount++;
            }
            totalCapacity += room.capacity;
        });
    };
    
    // Process all room types
    processRooms(roomData.smallRooms);
    processRooms(roomData.largeRooms);
    
    // Update UI elements
    availableRoomsElement.textContent = availableCount;
    occupiedRoomsElement.textContent = occupiedCount;
    totalCapacityElement.textContent = totalCapacity;
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentTimeElement.textContent = timeString;
}

// Set up event listeners
function setupEventListeners() {
    // Reset all rooms button
    resetAllButton.addEventListener('click', function() {
        showConfirmationModal(
            'Are you sure you want to reset all rooms to available?',
            function() {
                window.RoomAvailability.resetAllRoomsToAvailable();
                renderRoomManagement();
                updateDashboardMetrics();
                
                // Log the action
                console.log(`[${new Date().toISOString()}] All rooms reset to available`);
            }
        );
    });
    
    // Reload data button
    reloadDataButton.addEventListener('click', function() {
        // Animation for button
        this.classList.add('rotating');
        
        // Re-initialize and re-render
        window.RoomAvailability.initializeRoomData();
        renderRoomManagement();
        updateDashboardMetrics();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 1000);
    });
    
    // Modal event listeners
    confirmActionButton.addEventListener('click', function() {
        hideConfirmationModal();
        if (typeof currentAction === 'function') {
            currentAction();
        }
        currentAction = null;
    });
    
    cancelActionButton.addEventListener('click', hideConfirmationModal);
    closeModalButton.addEventListener('click', hideConfirmationModal);
    
    // Close modal when clicking outside content
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            hideConfirmationModal();
        }
    });
}

// Show confirmation modal
function showConfirmationModal(message, action) {
    confirmationMessage.textContent = message;
    currentAction = action;
    confirmationModal.classList.add('active');
}

// Hide confirmation modal
function hideConfirmationModal() {
    confirmationModal.classList.remove('active');
}

// Log status changes (for audit purposes)
function logStatusChange(roomType, roomId, previousState, newState) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Room ${roomId} changed: ${previousState ? 'Available' : 'Occupied'} → ${newState ? 'Available' : 'Occupied'}`);
    
    // Optionally store in localStorage for audit trail
    const auditLog = JSON.parse(localStorage.getItem('room_status_log') || '[]');
    auditLog.push({
        timestamp,
        roomType,
        roomId,
        previousState: previousState ? 'Available' : 'Occupied',
        newState: newState ? 'Available' : 'Occupied'
    });
    
    // Keep log at a reasonable size (last 100 entries)
    if (auditLog.length > 100) {
        auditLog.shift(); // Remove oldest entry
    }
    
    localStorage.setItem('room_status_log', JSON.stringify(auditLog));
}

// Monitor for external changes to data
function setupExternalChangeDetection() {
    let lastKnownData = localStorage.getItem('flexplekken_room_availability');
    
    // Check every 10 seconds for changes
    setInterval(() => {
        const currentData = localStorage.getItem('flexplekken_room_availability');
        
        // If data was changed externally
        if (currentData && currentData !== lastKnownData) {
            console.log("External data change detected, refreshing display");
            // Refresh the interface
            window.RoomAvailability.initializeRoomData();
            renderRoomManagement();
            updateDashboardMetrics();
            lastKnownData = currentData;
        }
    }, 10000);
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminConsole();
});

// Add to the createRoomItem function, inside the setTimeout callback
// After timeInput event listener setup
timeInput.addEventListener('change', function() {
    if (!toggleInput.checked) return; // Only update if room is occupied
    
    // Validate time is within business hours (8:00 - 20:00)
    const inputTime = this.value;
    const [hours, minutes] = inputTime.split(':').map(Number);
    
    if (hours < 8 || hours > 20 || (hours === 20 && minutes > 0)) {
        alert('Please set a time between 8:00 and 20:00 (business hours)');
        // Reset to default value or current time within business hours
        const now = new Date();
        const currentHours = now.getHours();
        if (currentHours < 8) {
            this.value = '08:00';
        } else if (currentHours >= 20) {
            this.value = '20:00';
        } else {
            this.value = `${String(currentHours).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }
    
    updateRoomStatus(roomType, room.id, false, this.value);
});