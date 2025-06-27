// Piggy Bank Simulator Game
let piggyBankGame = {
    currentSavings: 0,
    savingsGoal: 0,
    weeklyAllowance: 0,
    currentWeek: 1,
    choices: [],
    goalItem: null
};

// Savings goals - unified for all players
const savingsGoals = [
    { name: 'Toy Car', price: 15, emoji: '🚗', weeks: 5 },
    { name: 'Board Game', price: 25, emoji: '🎲', weeks: 6 },
    { name: 'Art Set', price: 30, emoji: '🎨', weeks: 7 },
    { name: 'Soccer Ball', price: 35, emoji: '⚽', weeks: 8 },
    { name: 'Video Game', price: 50, emoji: '🎮', weeks: 10 },
    { name: 'Headphones', price: 60, emoji: '🎧', weeks: 12 }
];

function loadPiggyBankGame() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="piggybank-game">
            <div class="game-header">
                <button class="back-btn" onclick="backToMenu()">👈 Back to Menu</button>
                <h2>🐷 Piggy Bank Savings</h2>
            </div>
            
            <div class="goal-selection" id="goalSelection">
                <h3>What would you like to save for?</h3>
                <div class="goals-grid" id="goalsGrid"></div>
            </div>
            
            <div class="savings-tracker" id="savingsTracker" style="display: none;">
                <div class="piggy-visual">
                    <div class="piggy-bank" id="piggyBank">
                        <div class="piggy-fill" id="piggyFill"></div>
                        <span class="piggy-emoji">🐷</span>
                    </div>
                </div>
                
                <div class="savings-info">
                    <div class="goal-info">
                        <h3>Saving for: <span id="goalName"></span></h3>
                        <p>Goal: <span id="goalAmount"></span></p>
                    </div>
                    
                    <div class="progress-info">
                        <p>Current Savings: <span id="currentSavings">$0</span></p>
                        <p>Week: <span id="currentWeek">1</span></p>
                        <p>Weekly Allowance: <span id="weeklyAllowance"></span></p>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                        <span class="progress-text" id="progressText">0%</span>
                    </div>
                </div>
                
                <div class="weekly-decision" id="weeklyDecision">
                    <h3>Week <span id="decisionWeek">1</span> - You have <span id="decisionMoney"></span></h3>
                    <p>What would you like to do?</p>
                    <div class="decision-buttons">
                        <button onclick="makeDecision('save', 1)" class="save-all">💰 Save it all!</button>
                        <button onclick="makeDecision('save', 0.5)" class="save-half">💵 Save half</button>
                        <button onclick="makeDecision('spend', 0)" class="spend-all">🍭 Spend it all</button>
                    </div>
                </div>
                
                <div class="choices-history" id="choicesHistory">
                    <h4>Your Choices:</h4>
                    <div id="historyList"></div>
                </div>
            </div>
        </div>
    `;
    
    addPiggyBankStyles();
    initializePiggyBank();
}

function addPiggyBankStyles() {
    const styleElement = document.getElementById('piggybank-styles') || document.createElement('style');
    styleElement.id = 'piggybank-styles';
    styleElement.textContent = `
        .piggybank-game {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .goal-selection {
            text-align: center;
            padding: 20px;
        }
        
        .goals-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .goal-item {
            background: white;
            border: 3px solid #e2e8f0;
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .goal-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-color: #f687b3;
        }
        
        .goal-emoji {
            font-size: 4em;
            margin-bottom: 10px;
        }
        
        .goal-name {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .goal-price {
            font-size: 1.5em;
            color: #48bb78;
            font-weight: bold;
        }
        
        .goal-time {
            color: #718096;
            margin-top: 5px;
        }
        
        .savings-tracker {
            display: grid;
            gap: 30px;
        }
        
        .piggy-visual {
            text-align: center;
            margin: 20px 0;
        }
        
        .piggy-bank {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto;
            background: #ffc0cb;
            border-radius: 50%;
            border: 5px solid #ff69b4;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .piggy-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ff1493;
            transition: height 1s ease;
            height: 0%;
        }
        
        .piggy-emoji {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 5em;
            z-index: 10;
        }
        
        .savings-info {
            background: #f7fafc;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .goal-info h3 {
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .progress-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .progress-info p {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
        }
        
        .progress-info span {
            display: block;
            font-size: 1.3em;
            font-weight: bold;
            color: #5a67d8;
            margin-top: 5px;
        }
        
        .progress-bar {
            position: relative;
            height: 40px;
            background: #e2e8f0;
            border-radius: 20px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
            transition: width 1s ease;
            width: 0%;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
            color: #2d3748;
            font-size: 1.2em;
        }
        
        .weekly-decision {
            background: #fff5f5;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border: 3px solid #feb2b2;
        }
        
        .decision-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .decision-buttons button {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        
        .save-all {
            background: #48bb78;
            color: white;
        }
        
        .save-all:hover {
            background: #38a169;
            transform: translateY(-3px);
        }
        
        .save-half {
            background: #4299e1;
            color: white;
        }
        
        .save-half:hover {
            background: #3182ce;
            transform: translateY(-3px);
        }
        
        .spend-all {
            background: #f56565;
            color: white;
        }
        
        .spend-all:hover {
            background: #e53e3e;
            transform: translateY(-3px);
        }
        
        .choices-history {
            background: #e6fffa;
            padding: 20px;
            border-radius: 15px;
            margin-top: 20px;
        }
        
        .choice-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-radius: 8px;
        }
        
        .choice-saved {
            color: #48bb78;
            font-weight: bold;
        }
        
        .choice-spent {
            color: #f56565;
            font-weight: bold;
        }
    `;
    
    if (!document.getElementById('piggybank-styles')) {
        document.head.appendChild(styleElement);
    }
}

function initializePiggyBank() {
    // Reset game state
    piggyBankGame.currentSavings = 0;
    piggyBankGame.currentWeek = 1;
    piggyBankGame.choices = [];
    
    // Display goals
    displaySavingsGoals();
}

function displaySavingsGoals() {
    const goalsGrid = document.getElementById('goalsGrid');
    
    goalsGrid.innerHTML = savingsGoals.map((goal, index) => `
        <div class="goal-item" onclick="selectGoal(${index})">
            <div class="goal-emoji">${goal.emoji}</div>
            <div class="goal-name">${goal.name}</div>
            <div class="goal-price">${formatCurrency(goal.price)}</div>
            <div class="goal-time">Save for ${goal.weeks} weeks</div>
        </div>
    `).join('');
}

function selectGoal(index) {
    const goal = savingsGoals[index];
    piggyBankGame.goalItem = goal;
    piggyBankGame.savingsGoal = goal.price;
    piggyBankGame.weeklyAllowance = Math.ceil(goal.price / goal.weeks * 1.2); // Give a bit extra
    
    // Hide goal selection, show tracker
    document.getElementById('goalSelection').style.display = 'none';
    document.getElementById('savingsTracker').style.display = 'block';
    
    // Update displays
    document.getElementById('goalName').textContent = `${goal.emoji} ${goal.name}`;
    document.getElementById('goalAmount').textContent = formatCurrency(goal.price);
    document.getElementById('weeklyAllowance').textContent = formatCurrency(piggyBankGame.weeklyAllowance);
    document.getElementById('decisionMoney').textContent = formatCurrency(piggyBankGame.weeklyAllowance);
    
    updatePiggyBankDisplay();
    
    // Force update progress bar after DOM is ready
    setTimeout(() => {
        updatePiggyBankDisplay();
    }, 100);
}

function makeDecision(action, savePercent) {
    const amountSaved = Math.round(piggyBankGame.weeklyAllowance * savePercent * 100) / 100;
    const amountSpent = piggyBankGame.weeklyAllowance - amountSaved;
    
    // Record choice
    piggyBankGame.choices.push({
        week: piggyBankGame.currentWeek,
        saved: amountSaved,
        spent: amountSpent,
        action: action
    });
    
    // Update savings
    piggyBankGame.currentSavings += amountSaved;
    
    // Animate piggy bank
    const piggyBank = document.getElementById('piggyBank');
    piggyBank.classList.add('bounce');
    setTimeout(() => piggyBank.classList.remove('bounce'), 1000);
    
    if (amountSaved > 0) {
        createAnimatedCoin(
            piggyBank.offsetLeft + piggyBank.offsetWidth / 2,
            piggyBank.offsetTop
        );
    }
    
    // Check if goal reached
    if (piggyBankGame.currentSavings >= piggyBankGame.savingsGoal) {
        // Update display to show 100%
        updatePiggyBankDisplay();
        showPiggyBankSuccess();
        return;
    }
    
    // Next week
    piggyBankGame.currentWeek++;
    
    // Update displays
    updatePiggyBankDisplay();
    updateChoicesHistory();
    
    // Update week display
    document.getElementById('currentWeek').textContent = piggyBankGame.currentWeek;
    document.getElementById('decisionWeek').textContent = piggyBankGame.currentWeek;
}

function updatePiggyBankDisplay() {
    // Update savings display
    const savingsElement = document.getElementById('currentSavings');
    if (savingsElement) {
        savingsElement.textContent = formatCurrency(piggyBankGame.currentSavings);
    }
    
    // Update progress
    let progress = (piggyBankGame.currentSavings / piggyBankGame.savingsGoal) * 100;
    
    // Ensure 100% when goal is reached
    if (piggyBankGame.currentSavings >= piggyBankGame.savingsGoal) {
        progress = 100;
    } else {
        progress = Math.min(progress, 99.9); // Cap at 99.9% if not reached
    }
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        // Remove transition temporarily for immediate update
        progressFill.style.transition = 'none';
        progressFill.style.width = progress + '%';
        
        // Force a reflow
        progressFill.offsetHeight;
        
        // Re-enable transition
        setTimeout(() => {
            progressFill.style.transition = 'width 1s ease';
        }, 10);
    }
    
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = Math.round(progress) + '%';
    }
    
    // Update piggy bank fill
    const piggyFill = document.getElementById('piggyFill');
    if (piggyFill) {
        // Remove transition temporarily for immediate update
        piggyFill.style.transition = 'none';
        piggyFill.style.height = progress + '%';
        
        // Force a reflow
        piggyFill.offsetHeight;
        
        // Re-enable transition
        setTimeout(() => {
            piggyFill.style.transition = 'height 1s ease';
        }, 10);
    }
}

function updateChoicesHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = piggyBankGame.choices.map(choice => `
        <div class="choice-item">
            <span>Week ${choice.week}:</span>
            <span>
                ${choice.saved > 0 ? `<span class="choice-saved">Saved ${formatCurrency(choice.saved)}</span>` : ''}
                ${choice.saved > 0 && choice.spent > 0 ? ' & ' : ''}
                ${choice.spent > 0 ? `<span class="choice-spent">Spent ${formatCurrency(choice.spent)}</span>` : ''}
            </span>
        </div>
    `).join('');
}

function showPiggyBankSuccess() {
    const weeksNeeded = piggyBankGame.currentWeek;
    const totalSaved = piggyBankGame.currentSavings;
    const coins = Math.round(20 * getDifficultyMultiplier());
    
    // Achievement check
    if (weeksNeeded <= piggyBankGame.goalItem.weeks - 2) {
        unlockAchievement('fast_saver', 'Fast Saver', 'Reach your goal 2 weeks early!', 30);
    }
    
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content" style="text-align: center; background: white; padding: 40px; border-radius: 20px; max-width: 500px; color: #2d3748;">
            <h2 style="color: #2d3748;">🎉 Goal Reached!</h2>
            <p style="font-size: 3em; margin: 20px 0;">${piggyBankGame.goalItem.emoji}</p>
            <p style="color: #4a5568; font-size: 1.2em;">You saved ${formatCurrency(totalSaved)} in ${weeksNeeded} weeks!</p>
            <p style="color: #4a5568; font-size: 1.1em;">You can now buy your ${piggyBankGame.goalItem.name}!</p>
            <p class="coin-reward" style="font-size: 1.3em; color: #48bb78; margin: 20px 0;">You earned ${coins} coins!</p>
            <button onclick="newSavingsGoal()" style="background: #48bb78; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 1.1em; cursor: pointer;">New Goal →</button>
        </div>
    `;
    
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(successModal);
    
    addCoins(coins);
    createConfetti();
}

function newSavingsGoal() {
    document.querySelector('.success-modal').remove();
    document.getElementById('goalSelection').style.display = 'block';
    document.getElementById('savingsTracker').style.display = 'none';
    initializePiggyBank();
}