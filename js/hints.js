// Hint system for all games

// Global hint button component
function createHintButton(gameType) {
    const hintButton = document.createElement('div');
    hintButton.className = 'hint-button-container';
    hintButton.innerHTML = `
        <button class="hint-button" onclick="showGameHint('${gameType}')">
            💡 Need a Hint? <span id="${gameType}HintsLeft"></span>
        </button>
    `;
    return hintButton;
}

// Update hint count display
async function updateHintCount(gameType) {
    const user = await api.getUser();
    if (user && user.hints) {
        const hintsLeft = user.hints[gameType] || 0;
        const hintSpan = document.getElementById(`${gameType}HintsLeft`);
        if (hintSpan) {
            hintSpan.textContent = `(${hintsLeft} left)`;
        }
        
        // Disable button if no hints left
        const hintButton = document.querySelector(`.hint-button[onclick="showGameHint('${gameType}')"]`);
        if (hintButton && hintsLeft === 0) {
            hintButton.disabled = true;
            hintButton.style.opacity = '0.5';
            hintButton.style.cursor = 'not-allowed';
        }
    }
}

// Show hint for specific game
async function showGameHint(gameType) {
    // First try to use a hint from the user's balance
    const result = await api.useHint(gameType);
    
    if (result && result.success) {
        // Show the hint
        showHintModal(result.hint, gameType);
        
        // Update hint count display
        await updateHintCount(gameType);
    } else {
        // No hints left, show how to get more
        showNoHintsModal();
    }
}

// Show hint modal
function showHintModal(hintText, gameType) {
    // Remove any existing modal
    const existingModal = document.querySelector('.hint-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'hint-modal';
    modal.innerHTML = `
        <div class="hint-modal-content">
            <div class="hint-modal-header">
                <h3>💡 Hint for ${getGameName(gameType)}</h3>
                <button class="close-hint" onclick="this.closest('.hint-modal').remove()">×</button>
            </div>
            <div class="hint-modal-body">
                <p>${hintText}</p>
            </div>
            <div class="hint-modal-footer">
                <button class="got-it-btn" onclick="this.closest('.hint-modal').remove()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add animation
    setTimeout(() => modal.classList.add('show'), 10);
}

// Show no hints modal
function showNoHintsModal() {
    const modal = document.createElement('div');
    modal.className = 'hint-modal no-hints';
    modal.innerHTML = `
        <div class="hint-modal-content">
            <div class="hint-modal-header">
                <h3>😅 No Hints Left!</h3>
                <button class="close-hint" onclick="this.closest('.hint-modal').remove()">×</button>
            </div>
            <div class="hint-modal-body">
                <p>You've used all your hints for this game!</p>
                <p>Ways to get more hints:</p>
                <ul>
                    <li>🎮 Play more games</li>
                    <li>🏆 Unlock achievements</li>
                    <li>⭐ Level up your character</li>
                </ul>
            </div>
            <div class="hint-modal-footer">
                <button class="got-it-btn" onclick="this.closest('.hint-modal').remove()">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Get game name for display
function getGameName(gameType) {
    const names = {
        store: 'Virtual Store',
        piggybank: 'Piggy Bank',
        budget: 'Budget Builder',
        learn: 'Money Lessons'
    };
    return names[gameType] || gameType;
}

// Add hint styles
const hintStyles = document.createElement('style');
hintStyles.textContent = `
    .hint-button-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .hint-button {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #78350f;
        border: none;
        padding: 15px 25px;
        border-radius: 50px;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(251, 191, 36, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .hint-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
    }
    
    .hint-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .hint-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .hint-modal.show {
        opacity: 1;
    }
    
    .hint-modal-content {
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .hint-modal.show .hint-modal-content {
        transform: scale(1);
    }
    
    .hint-modal-header {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #78350f;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .hint-modal-header h3 {
        margin: 0;
        font-size: 1.5em;
    }
    
    .close-hint {
        background: none;
        border: none;
        color: #78350f;
        font-size: 2em;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .close-hint:hover {
        background: rgba(120, 53, 15, 0.1);
    }
    
    .hint-modal-body {
        padding: 30px;
        font-size: 1.2em;
        line-height: 1.6;
        color: #2d3748;
    }
    
    .hint-modal-body ul {
        margin-top: 15px;
        padding-left: 20px;
    }
    
    .hint-modal-body li {
        margin: 10px 0;
    }
    
    .hint-modal-footer {
        padding: 20px;
        background: #f7fafc;
        text-align: center;
    }
    
    .got-it-btn {
        padding: 12px 30px;
        background: #48bb78;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .got-it-btn:hover {
        background: #38a169;
        transform: translateY(-2px);
    }
    
    .no-hints .hint-modal-header {
        background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
        color: white;
    }
    
    .no-hints .close-hint {
        color: white;
    }
    
    @media (max-width: 768px) {
        .hint-button-container {
            bottom: 70px;
            right: 10px;
        }
        
        .hint-button {
            padding: 12px 20px;
            font-size: 1em;
        }
    }
`;
document.head.appendChild(hintStyles);

// Inject hint button into games when they load
const originalLoadFunctions = {
    loadStoreGame: window.loadStoreGame,
    loadPiggyBankGame: window.loadPiggyBankGame,
    loadCountingGame: window.loadCountingGame
};

// Override game load functions to add hint button
window.loadStoreGame = function() {
    originalLoadFunctions.loadStoreGame();
    setTimeout(() => {
        const container = document.getElementById('gameContainer');
        if (container && !container.querySelector('.hint-button-container')) {
            container.appendChild(createHintButton('store'));
            updateHintCount('store');
        }
    }, 100);
};

window.loadPiggyBankGame = function() {
    originalLoadFunctions.loadPiggyBankGame();
    setTimeout(() => {
        const container = document.getElementById('gameContainer');
        if (container && !container.querySelector('.hint-button-container')) {
            container.appendChild(createHintButton('piggybank'));
            updateHintCount('piggybank');
        }
    }, 100);
};

window.loadCountingGame = function() {
    originalLoadFunctions.loadCountingGame();
    setTimeout(() => {
        const container = document.getElementById('gameContainer');
        if (container && !container.querySelector('.hint-button-container')) {
            container.appendChild(createHintButton('counting'));
            updateHintCount('counting');
        }
    }, 100);
};