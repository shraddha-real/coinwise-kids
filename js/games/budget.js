// Budget Builder Game
let budgetGame = {
    totalIncome: 0,
    categories: [],
    allocatedAmount: 0,
    scenario: null
};

// Budget scenarios
const budgetScenarios = [
    {
        level: 1,
        title: "Weekly Allowance",
        income: 20,
        description: "You get $20 weekly allowance. Plan how to spend it!",
        requiredCategories: ["Savings", "Fun", "Snacks"],
        tips: "Remember to save at least 25% of your money!"
    },
    {
        level: 2,
        title: "Birthday Money",
        income: 50,
        description: "You received $50 for your birthday! Make a smart plan.",
        requiredCategories: ["Savings", "Toys/Games", "Books", "Treats"],
        tips: "Birthday money is special - try to save at least half!"
    },
    {
        level: 3,
        title: "Summer Job",
        income: 100,
        description: "You earned $100 from helping neighbors. Budget wisely!",
        requiredCategories: ["Savings", "School Supplies", "Entertainment", "Charity"],
        tips: "When you earn money, it's good to share some with charity!"
    }
];

function loadBudgetGame() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="budget-game">
            <div class="game-header">
                <button class="back-btn" onclick="backToMenu()">👈 Back to Menu</button>
                <h2>📊 Budget Builder</h2>
            </div>
            
            <div class="scenario-info" id="scenarioInfo"></div>
            
            <div class="budget-container">
                <div class="income-section">
                    <h3>💰 Total Income</h3>
                    <div class="income-display" id="incomeDisplay">$0</div>
                    <div class="remaining-display">
                        <span>Remaining to allocate:</span>
                        <span id="remainingAmount" class="remaining-amount">$0</span>
                    </div>
                </div>
                
                <div class="categories-section">
                    <h3>📝 Budget Categories</h3>
                    <div id="categoriesList" class="categories-list"></div>
                    <button class="hint-btn" onclick="useBudgetHint()">
                        💡 Get Hint (<span id="budgetHints">3</span> left)
                    </button>
                </div>
                
                <div class="budget-visualization">
                    <h3>📈 Your Budget</h3>
                    <div id="budgetChart" class="budget-chart"></div>
                </div>
            </div>
            
            <div class="budget-controls">
                <button class="check-btn" onclick="checkBudget()">✅ Check Budget</button>
            </div>
            
            <div class="budget-tips" id="budgetTips"></div>
        </div>
    `;
    
    addBudgetStyles();
    initializeBudget();
}

function addBudgetStyles() {
    const styleElement = document.getElementById('budget-styles') || document.createElement('style');
    styleElement.id = 'budget-styles';
    styleElement.textContent = `
        .budget-game {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .scenario-info {
            background: #e6fffa;
            border: 3px solid #81e6d9;
            border-radius: 20px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
        }
        
        .scenario-info h3 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 1.5em;
        }
        
        .scenario-info p {
            font-size: 1.1em;
            color: #4a5568;
        }
        
        .budget-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        .income-section, .categories-section, .budget-visualization {
            background: white;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .income-display {
            font-size: 3em;
            font-weight: bold;
            color: #48bb78;
            text-align: center;
            margin: 20px 0;
        }
        
        .remaining-display {
            text-align: center;
            padding: 15px;
            background: #f7fafc;
            border-radius: 10px;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .remaining-amount {
            font-size: 1.5em;
            font-weight: bold;
            color: #e53e3e;
            display: block;
            margin-top: 5px;
            transition: all 0.3s ease;
        }
        
        .remaining-amount.zero {
            color: #48bb78;
            transform: scale(1.1);
        }
        
        .categories-list {
            margin: 20px 0;
        }
        
        .category-item {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            border: 3px solid #e2e8f0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .category-item:hover {
            border-color: #4299e1;
            box-shadow: 0 4px 10px rgba(66, 153, 225, 0.1);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .category-name {
            font-weight: bold;
            font-size: 1.3em;
            color: #2d3748;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .category-percentage {
            font-size: 1.1em;
            font-weight: bold;
            color: #4299e1;
            background: #ebf8ff;
            padding: 5px 12px;
            border-radius: 20px;
        }
        
        .category-slider {
            width: 100%;
            margin: 10px 0;
            height: 8px;
            -webkit-appearance: none;
            appearance: none;
            background: #e2e8f0;
            border-radius: 4px;
            outline: none;
        }
        
        .category-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #4299e1;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .category-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: #3182ce;
        }
        
        .category-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #4299e1;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }
        
        .category-slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            background: #3182ce;
        }
        
        .category-amount {
            display: flex;
            align-items: center;
            margin-top: 15px;
            justify-content: center;
            gap: 10px;
        }
        
        .amount-input {
            width: 100px;
            padding: 10px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1.2em;
            text-align: center;
            font-weight: bold;
            color: #2d3748;
            background: white;
        }
        
        .amount-input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
        
        .amount-buttons {
            display: flex;
            gap: 5px;
            margin-left: 10px;
        }
        
        .adjust-btn {
            width: 35px;
            height: 35px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            font-size: 1.3em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #4a5568;
        }
        
        .adjust-btn:hover {
            background: #f7fafc;
            border-color: #4299e1;
            color: #4299e1;
        }
        
        .adjust-btn:active {
            transform: scale(0.95);
        }
        
        .budget-chart {
            margin-top: 20px;
        }
        
        .chart-bar {
            margin-bottom: 15px;
        }
        
        .chart-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.9em;
        }
        
        .chart-track {
            background: #e2e8f0;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }
        
        .chart-fill {
            height: 100%;
            background: #4299e1;
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: bold;
        }
        
        .budget-controls {
            text-align: center;
            margin: 30px 0;
        }
        
        .check-btn {
            background: #48bb78;
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .check-btn:hover {
            background: #38a169;
            transform: translateY(-2px);
        }
        
        .hint-btn {
            background: #805ad5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            margin-top: 15px;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .hint-btn:hover {
            background: #6b46c1;
            transform: translateY(-2px);
        }
        
        .budget-tips {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }
        
        .budget-tips h4 {
            color: #92400e;
            margin-bottom: 10px;
        }
        
        .budget-tips p {
            color: #b45309;
        }
        
        .category-colors {
            --color-savings: #10b981;
            --color-fun: #f59e0b;
            --color-snacks: #ef4444;
            --color-toys: #8b5cf6;
            --color-books: #3b82f6;
            --color-treats: #ec4899;
            --color-school: #06b6d4;
            --color-entertainment: #f97316;
            --color-charity: #e11d48;
        }
        
        @media (max-width: 768px) {
            .budget-container {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    if (!document.getElementById('budget-styles')) {
        document.head.appendChild(styleElement);
    }
}

function initializeBudget() {
    // Get random scenario if not set
    if (!budgetGame.scenario) {
        const randomIndex = Math.floor(Math.random() * budgetScenarios.length);
        budgetGame.scenario = budgetScenarios[randomIndex];
    }
    budgetGame.totalIncome = budgetGame.scenario.income;
    budgetGame.allocatedAmount = 0;
    
    // Display scenario info
    const scenarioInfo = document.getElementById('scenarioInfo');
    scenarioInfo.innerHTML = `
        <h3>${budgetGame.scenario.title}</h3>
        <p>${budgetGame.scenario.description}</p>
    `;
    
    // Display income
    document.getElementById('incomeDisplay').textContent = formatCurrency(budgetGame.totalIncome);
    updateRemainingAmount();
    
    // Category emojis
    const categoryEmojis = {
        'Savings': '💰',
        'Fun': '🎮',
        'Snacks': '🍿',
        'Toys/Games': '🧸',
        'Books': '📚',
        'Treats': '🍭',
        'School Supplies': '✏️',
        'Entertainment': '🎬',
        'Charity': '❤️'
    };
    
    // Initialize categories
    budgetGame.categories = budgetGame.scenario.requiredCategories.map(name => ({
        name: name,
        emoji: categoryEmojis[name] || '📦',
        amount: 0,
        percentage: 0
    }));
    
    // Display categories
    displayCategories();
    
    // Display tips
    displayBudgetTips();
    
    // Update chart
    updateBudgetChart();
}

function displayCategories() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = budgetGame.categories.map((category, index) => `
        <div class="category-item">
            <div class="category-header">
                <span class="category-name">
                    <span style="font-size: 1.5em;">${category.emoji}</span>
                    ${category.name}
                </span>
                <span class="category-percentage" id="percentage-${index}">0%</span>
            </div>
            <input type="range" 
                   class="category-slider" 
                   id="slider-${index}"
                   min="0" 
                   max="${budgetGame.totalIncome}" 
                   value="0" 
                   step="1"
                   oninput="updateCategoryAmount(${index}, this.value)">
            <div class="category-amount">
                <span>Amount: $</span>
                <input type="number" 
                       class="amount-input" 
                       id="amount-${index}"
                       min="0" 
                       max="${budgetGame.totalIncome}" 
                       value="0" 
                       step="1"
                       oninput="updateCategorySlider(${index}, this.value)">
                <div class="amount-buttons">
                    <button onclick="adjustAmount(${index}, -1)" class="adjust-btn">−</button>
                    <button onclick="adjustAmount(${index}, 1)" class="adjust-btn">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCategoryAmount(index, value) {
    const amount = parseFloat(value);
    budgetGame.categories[index].amount = amount;
    
    // Update amount input
    document.getElementById(`amount-${index}`).value = Math.round(amount);
    
    // Update percentage
    const percentage = (amount / budgetGame.totalIncome * 100).toFixed(1);
    budgetGame.categories[index].percentage = parseFloat(percentage);
    document.getElementById(`percentage-${index}`).textContent = percentage + '%';
    
    // Update totals
    updateAllocatedAmount();
    updateBudgetChart();
}

function updateCategorySlider(index, value) {
    const amount = parseFloat(value) || 0;
    const maxAmount = budgetGame.totalIncome;
    
    if (amount > maxAmount) {
        document.getElementById(`amount-${index}`).value = maxAmount;
        updateCategoryAmount(index, maxAmount);
    } else {
        document.getElementById(`slider-${index}`).value = amount;
        updateCategoryAmount(index, amount);
    }
}

function adjustAmount(index, change) {
    const currentAmount = budgetGame.categories[index].amount;
    const newAmount = Math.max(0, Math.min(budgetGame.totalIncome, currentAmount + change));
    
    document.getElementById(`amount-${index}`).value = newAmount;
    document.getElementById(`slider-${index}`).value = newAmount;
    updateCategoryAmount(index, newAmount);
}

function updateAllocatedAmount() {
    budgetGame.allocatedAmount = budgetGame.categories.reduce((sum, cat) => sum + cat.amount, 0);
    updateRemainingAmount();
}

function updateRemainingAmount() {
    const remaining = budgetGame.totalIncome - budgetGame.allocatedAmount;
    const remainingElement = document.getElementById('remainingAmount');
    remainingElement.textContent = formatCurrency(Math.round(remaining));
    
    if (remaining === 0) {
        remainingElement.classList.add('zero');
        // Add visual feedback
        remainingElement.parentElement.style.background = '#f0fff4';
        remainingElement.parentElement.style.borderColor = '#48bb78';
    } else {
        remainingElement.classList.remove('zero');
        remainingElement.parentElement.style.background = '#f7fafc';
        remainingElement.parentElement.style.borderColor = 'transparent';
    }
}

function updateBudgetChart() {
    const chartContainer = document.getElementById('budgetChart');
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4', '#f97316', '#e11d48'];
    
    chartContainer.innerHTML = budgetGame.categories.map((category, index) => `
        <div class="chart-bar">
            <div class="chart-label">
                <span>${category.name}</span>
                <span>${formatCurrency(category.amount)}</span>
            </div>
            <div class="chart-track">
                <div class="chart-fill" style="width: ${category.percentage}%; background: ${colors[index % colors.length]}">
                    ${category.percentage > 10 ? category.percentage + '%' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function displayBudgetTips() {
    const tipsContainer = document.getElementById('budgetTips');
    tipsContainer.innerHTML = `
        <h4>💡 Budget Tip</h4>
        <p>${budgetGame.scenario.tips}</p>
    `;
}

function checkBudget() {
    const remaining = Math.round(budgetGame.totalIncome - budgetGame.allocatedAmount);
    
    // Check if all money is allocated
    if (remaining !== 0) {
        if (remaining > 0) {
            showBudgetError('You need to allocate all your money! You have ' + formatCurrency(remaining) + ' left to allocate.');
        } else {
            showBudgetError('You\'ve allocated too much! You\'re over budget by ' + formatCurrency(Math.abs(remaining)) + '. Please reduce your allocations.');
        }
        return;
    }
    
    // Check savings
    const savingsCategory = budgetGame.categories.find(cat => cat.name === "Savings");
    const savingsPercentage = savingsCategory ? savingsCategory.percentage : 0;
    
    let score = 0;
    let feedback = [];
    
    // Scoring based on savings
    if (savingsPercentage >= 50) {
        score += 40;
        feedback.push("Excellent saving! You saved more than half!");
    } else if (savingsPercentage >= 25) {
        score += 30;
        feedback.push("Good job saving at least 25%!");
    } else if (savingsPercentage >= 10) {
        score += 20;
        feedback.push("You're saving something, but try to save more!");
    } else {
        score += 5;
        feedback.push("Remember to always save some money!");
    }
    
    // Check for balanced budget
    const hasBalancedBudget = budgetGame.categories.every(cat => cat.amount > 0);
    if (hasBalancedBudget) {
        score += 30;
        feedback.push("Great job allocating money to all categories!");
    }
    
    // Check for charity (if applicable)
    const charityCategory = budgetGame.categories.find(cat => cat.name === "Charity");
    if (charityCategory && charityCategory.amount > 0) {
        score += 20;
        feedback.push("Wonderful! You're learning to share with others!");
    }
    
    // Bonus for high savings
    if (savingsPercentage >= 50) {
        score += 10;
        feedback.push("Excellent job saving more than half!");
    }
    
    showBudgetSuccess(score, feedback);
}

function showBudgetSuccess(score, feedback) {
    const coins = Math.floor(score / 5) + 10; // Base coin reward
    
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-content" style="text-align: center; background: white; padding: 40px; border-radius: 20px; max-width: 500px;">
            <h2>🎉 Great Budget!</h2>
            <p style="font-size: 2em; margin: 20px 0;">Score: ${score}/100</p>
            <div style="text-align: left; margin: 20px 0;">
                ${feedback.map(f => `<p style="margin: 10px 0;">✅ ${f}</p>`).join('')}
            </div>
            <p class="coin-reward" style="font-size: 1.3em; color: #48bb78; margin: 20px 0;">You earned ${coins} coins!</p>
            <button onclick="playBudgetAgain()" style="background: #48bb78; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 1.1em; cursor: pointer;">Play Again</button>
        </div>
    `;
    
    modal.style.cssText = `
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
    
    document.body.appendChild(modal);
    addCoins(coins);
    
    // Update progress
    if (api.userId) {
        api.updateProgress(coins, score, 'budget', score);
    }
}

function showBudgetError(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="error-content" style="text-align: center; background: white; padding: 40px; border-radius: 20px;">
            <h2>🤔 Not Quite!</h2>
            <p style="margin: 20px 0; font-size: 1.1em;">${message}</p>
            <button onclick="closeBudgetError()" style="background: #f56565; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 1.1em; cursor: pointer;">Try Again</button>
        </div>
    `;
    
    modal.style.cssText = `
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
    
    document.body.appendChild(modal);
}

function closeBudgetError() {
    document.querySelector('.error-modal').remove();
}

function playBudgetAgain() {
    document.querySelector('.success-modal').remove();
    
    // Reset and select a new random scenario
    const randomIndex = Math.floor(Math.random() * budgetScenarios.length);
    budgetGame.scenario = budgetScenarios[randomIndex];
    loadBudgetGame();
}

// Hint system for budget game
async function useBudgetHint() {
    if (!api.userId) return;
    
    const result = await api.useHint('budget');
    if (result.success) {
        alert(result.hint);
        document.getElementById('budgetHints').textContent = result.hintsRemaining;
    } else {
        alert(result.message);
    }
}