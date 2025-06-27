// Utility functions for the MoneyWise Kids app

// Format currency for display
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Generate random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.zIndex = '9999';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationName = 'confettiFall';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationIterationCount = '1';
        confetti.style.animationTimingFunction = 'ease-out';
        container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    
    // Remove after animation
    setTimeout(() => {
        container.remove();
    }, 5000);
}

// Add confetti fall animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Show achievement popup
function showAchievement(title, description, coins = 10) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-content">
            <h3>🏆 Achievement Unlocked!</h3>
            <h4>${title}</h4>
            <p>${description}</p>
            <p class="achievement-reward">+${coins} coins!</p>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        animation: pop 0.3s ease-out;
    `;
    
    document.body.appendChild(popup);
    
    // Add coins
    addCoins(coins);
    
    // Remove after 3 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Check if achievement is already unlocked
function hasAchievement(achievementId) {
    return userData.achievements.includes(achievementId);
}

// Unlock achievement
function unlockAchievement(achievementId, title, description, coins = 10) {
    if (!hasAchievement(achievementId)) {
        userData.achievements.push(achievementId);
        saveUserData();
        showAchievement(title, description, coins);
        createConfetti();
    }
}

// Create animated coin
function createAnimatedCoin(x, y) {
    const coin = document.createElement('div');
    coin.textContent = '🪙';
    coin.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: 30px;
        pointer-events: none;
        z-index: 1000;
        animation: coinFloat 1s ease-out forwards;
    `;
    
    document.body.appendChild(coin);
    
    // Remove after animation
    setTimeout(() => coin.remove(), 1000);
}

// Add coin float animation
const coinStyle = document.createElement('style');
coinStyle.textContent = `
    @keyframes coinFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(coinStyle);

// Get difficulty multiplier (unified for all players)
function getDifficultyMultiplier() {
    return 1.5; // Standard multiplier for all players
}

// Format time for display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}