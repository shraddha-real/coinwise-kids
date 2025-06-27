// Global variables
let currentGame = null;
let userData = {
    coins: 0,
    level: 1,
    achievements: [],
    progress: {}
};

// Load user data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('moneyWiseKids');
    if (saved) {
        userData = JSON.parse(saved);
        updateScoreDisplay();
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('moneyWiseKids', JSON.stringify(userData));
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('totalCoins').textContent = userData.coins;
    document.getElementById('userLevel').textContent = userData.level;
    // Display username from localStorage or API user data
    const nickname = localStorage.getItem('userNickname') || userData.nickname || 'Player';
    document.getElementById('userName').textContent = nickname;
}

// Add coins and check for level up
async function addCoins(amount) {
    userData.coins += amount;
    
    // Check for level up (every 100 coins)
    const newLevel = Math.floor(userData.coins / 100) + 1;
    if (newLevel > userData.level) {
        userData.level = newLevel;
        showLevelUpAnimation();
    }
    
    updateScoreDisplay();
    
    // Update on server
    if (api.userId) {
        await api.updateProgress(amount, Math.floor(amount / 2), currentGame, 0);
    }
}

// Show level up animation
function showLevelUpAnimation() {
    const container = document.getElementById('gameContainer');
    const levelUpDiv = document.createElement('div');
    levelUpDiv.className = 'level-up-animation';
    levelUpDiv.innerHTML = `
        <h2>🎉 Level Up! 🎉</h2>
        <p>You're now Level ${userData.level}!</p>
    `;
    container.appendChild(levelUpDiv);
    
    setTimeout(() => {
        levelUpDiv.remove();
    }, 3000);
}


// Show main menu
function showMainMenu() {
    currentGame = null;
    // Hide game container and show main menu
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

// Start a game
function startGame(gameType) {
    currentGame = gameType;
    const container = document.getElementById('gameContainer');
    
    // Hide main menu and show game container
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // Add loading animation
    container.innerHTML = '<div class="loading">Loading game...</div>';
    
    // Load the appropriate game
    setTimeout(() => {
        switch(gameType) {
            case 'store':
                loadStoreGame();
                break;
            case 'piggybank':
                loadPiggyBankGame();
                break;
            case 'budget':
                loadBudgetGame();
                break;
            case 'learn':
                loadLearnGame();
                break;
        }
    }, 100);
}

// Back to menu button handler
function backToMenu() {
    showMainMenu();
    saveUserData();
}

// Show share menu
function showShareMenu() {
    if (typeof displayShareMenu === 'function') {
        displayShareMenu();
    }
}

// Register user
async function registerUser() {
    const nickname = document.getElementById('nickname').value.trim();
    
    if (!nickname) {
        alert('Please enter a nickname!');
        return;
    }
    
    // Create user on server
    const result = await api.createUser(nickname);
    if (result.success) {
        userData = result.user;
        updateScoreDisplay();
        
        // Show main menu
        document.getElementById('userRegistration').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('scoreDisplay').style.display = 'flex';
        
        showMainMenu();
    }
}


// Show share progress
function showShareProgress() {
    if (typeof displayShareMenu === 'function') {
        displayShareMenu();
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to switch players?')) {
        // Clear local storage
        localStorage.removeItem('moneyWiseKids');
        localStorage.removeItem('userId');
        
        // Reset global variables
        userData = {
            coins: 0,
            level: 1,
            achievements: [],
            progress: {}
        };
        api.userId = null;
        
        // Show registration screen
        document.getElementById('userRegistration').style.display = 'block';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';
        
        // Clear nickname input
        document.getElementById('nickname').value = '';
    }
}

// Initialize the app
window.onload = async function() {
    // Check if user exists
    loadUserData();
    
    if (api.userId) {
        // User exists, fetch latest data from server
        const serverUser = await api.getUser();
        if (serverUser) {
            userData.coins = serverUser.coins;
            userData.level = serverUser.level;
            userData.achievements = serverUser.achievements || [];
            updateScoreDisplay();
            saveUserData();
        }
        
        // Show main menu
        document.getElementById('userRegistration').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('scoreDisplay').style.display = 'flex';
    } else {
        // Show registration
        document.getElementById('userRegistration').style.display = 'block';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';
    }
};