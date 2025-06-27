// Virtual Store Game
let storeGame = {
    items: [],
    cart: [],
    money: 0,
    targetAmount: 0,
    taxRate: 0.08 // 8% sales tax
};

// Store items database - unified for all players
const storeItems = [
    { name: 'Apple', price: 1.00, emoji: '🍎' },
    { name: 'Banana', price: 0.50, emoji: '🍌' },
    { name: 'Cookie', price: 2.00, emoji: '🍪' },
    { name: 'Milk', price: 3.00, emoji: '🥛' },
    { name: 'Bread', price: 2.50, emoji: '🍞' },
    { name: 'Pizza Slice', price: 3.50, emoji: '🍕' },
    { name: 'Ice Cream', price: 2.25, emoji: '🍦' },
    { name: 'Juice Box', price: 1.75, emoji: '🧃' },
    { name: 'Sandwich', price: 4.50, emoji: '🥪' },
    { name: 'Water Bottle', price: 6.00, emoji: '💧' }
];

function loadStoreGame() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="store-game">
            <div class="store-header">
                <button class="back-btn" onclick="backToMenu()">👈 Back to Menu</button>
                <h2>🛒 Virtual Store</h2>
            </div>
            
            <div class="store-info">
                <div class="money-display">
                    <h3>Your Money: <span id="playerMoney">$0.00</span></h3>
                </div>
                <div class="target-display">
                    <h3>Shopping List Total (with tax): <span id="targetAmount">$0.00</span></h3>
                </div>
            </div>
            
            <div class="shopping-list" id="shoppingList">
                <h3>📝 Shopping List:</h3>
                <ul id="listItems"></ul>
            </div>
            
            <div class="store-shelf">
                <h3>🏪 Store Items:</h3>
                <div class="items-grid" id="storeItems"></div>
            </div>
            
            <div class="shopping-cart">
                <h3>🛒 Your Cart:</h3>
                <div id="cartItems"></div>
                <div class="cart-total">
                    <div>Subtotal: <span id="cartSubtotal">$0.00</span></div>
                    <div style="font-size: 0.9em; color: #666;">Tax (8%): <span id="cartTax">$0.00</span></div>
                    <div style="font-weight: bold; margin-top: 10px;">Total: <span id="cartTotal">$0.00</span></div>
                </div>
                <button class="checkout-btn" onclick="checkoutStore()">💳 Checkout</button>
            </div>
        </div>
    `;
    
    // Add store-specific styles
    addStoreStyles();
    
    // Initialize store game
    initializeStore();
}

function addStoreStyles() {
    const styleElement = document.getElementById('store-styles') || document.createElement('style');
    styleElement.id = 'store-styles';
    styleElement.textContent = `
        .store-game {
            display: grid;
            grid-template-areas:
                "header header"
                "info info"
                "list shelf"
                "cart cart";
            gap: 20px;
        }
        
        .store-header {
            grid-area: header;
        }
        
        .store-info {
            grid-area: info;
            display: flex;
            justify-content: space-around;
            background: #f7fafc;
            padding: 20px;
            border-radius: 15px;
        }
        
        .money-display, .target-display {
            text-align: center;
        }
        
        .money-display span, .target-display span {
            font-size: 1.5em;
            color: #48bb78;
            font-weight: bold;
        }
        
        .shopping-list {
            grid-area: list;
            background: #fff5f5;
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #feb2b2;
        }
        
        .shopping-list ul {
            list-style: none;
            padding: 10px 0;
        }
        
        .shopping-list li {
            padding: 8px;
            margin: 5px 0;
            background: white;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
        }
        
        .store-shelf {
            grid-area: shelf;
            background: #e6fffa;
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #81e6d9;
        }
        
        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .store-item {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .store-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-color: #4299e1;
        }
        
        .store-item .item-emoji {
            font-size: 3em;
            margin-bottom: 10px;
        }
        
        .store-item .item-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .store-item .item-price {
            color: #48bb78;
            font-size: 1.2em;
            font-weight: bold;
        }
        
        .shopping-cart {
            grid-area: cart;
            background: #f0fff4;
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #9ae6b4;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-radius: 8px;
        }
        
        .cart-item button {
            background: #fc8181;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .cart-total {
            font-size: 1.3em;
            font-weight: bold;
            margin: 15px 0;
            text-align: right;
            color: #2d3748;
        }
        
        .checkout-btn {
            width: 100%;
            padding: 15px;
            background: #48bb78;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.2em;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .checkout-btn:hover {
            background: #38a169;
        }
        
        .checkout-btn:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
            .store-game {
                grid-template-areas:
                    "header"
                    "info"
                    "list"
                    "shelf"
                    "cart";
            }
        }
    `;
    
    if (!document.getElementById('store-styles')) {
        document.head.appendChild(styleElement);
    }
}

function initializeStore() {
    // Reset game state
    storeGame.cart = [];
    storeGame.items = [...storeItems];
    
    // Generate shopping list
    generateShoppingList();
    
    // Display store items
    displayStoreItems();
    
    // Update displays
    updateStoreDisplays();
}

function generateShoppingList() {
    const itemCount = 4; // Fixed number of items
    const availableItems = [...storeItems];
    const shoppingList = [];
    
    // Pick random items for shopping list
    for (let i = 0; i < itemCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        shoppingList.push(availableItems[randomIndex]);
        availableItems.splice(randomIndex, 1);
    }
    
    // Calculate target amount with tax
    const subtotal = shoppingList.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * storeGame.taxRate;
    storeGame.targetAmount = subtotal + tax;
    
    // Give player slightly more money than needed (including tax)
    const extraMoney = 5;
    storeGame.money = storeGame.targetAmount + extraMoney;
    
    // Display shopping list
    const listElement = document.getElementById('listItems');
    listElement.innerHTML = shoppingList.map(item => `
        <li>${item.emoji} ${item.name} - ${formatCurrency(item.price)}</li>
    `).join('') + `<li style="font-size: 0.9em; color: #666; margin-top: 10px;">Plus 8% sales tax on total</li>`;
}

function displayStoreItems() {
    const itemsContainer = document.getElementById('storeItems');
    itemsContainer.innerHTML = storeGame.items.map((item, index) => `
        <div class="store-item" onclick="addToCart(${index})">
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">${formatCurrency(item.price)}</div>
        </div>
    `).join('');
}

function addToCart(itemIndex) {
    const item = storeGame.items[itemIndex];
    
    // Check if player has enough money
    const currentTotal = storeGame.cart.reduce((sum, item) => sum + item.price, 0);
    if (currentTotal + item.price > storeGame.money) {
        // Shake the money display
        document.getElementById('playerMoney').parentElement.classList.add('shake');
        setTimeout(() => {
            document.getElementById('playerMoney').parentElement.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Add to cart
    storeGame.cart.push({...item});
    
    // Animate the item
    event.target.closest('.store-item').classList.add('bounce');
    
    updateStoreDisplays();
}

function removeFromCart(index) {
    storeGame.cart.splice(index, 1);
    updateStoreDisplays();
}

function updateStoreDisplays() {
    // Update money display
    document.getElementById('playerMoney').textContent = formatCurrency(storeGame.money);
    document.getElementById('targetAmount').textContent = formatCurrency(storeGame.targetAmount);
    
    // Update cart
    const cartContainer = document.getElementById('cartItems');
    if (storeGame.cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #718096;">Your cart is empty!</p>';
    } else {
        cartContainer.innerHTML = storeGame.cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.emoji} ${item.name} - ${formatCurrency(item.price)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    // Update total with tax
    const subtotal = storeGame.cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * storeGame.taxRate;
    const total = subtotal + tax;
    
    document.getElementById('cartSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cartTax').textContent = formatCurrency(tax);
    document.getElementById('cartTotal').textContent = formatCurrency(total);
}

function checkoutStore() {
    const subtotal = storeGame.cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * storeGame.taxRate;
    const total = subtotal + tax;
    
    if (total === 0) {
        alert('Your cart is empty! Add some items first.');
        return;
    }
    
    // Check if player completed the shopping list correctly
    const cartNames = storeGame.cart.map(item => item.name).sort();
    const listElement = document.getElementById('listItems');
    const listItems = Array.from(listElement.children)
        .filter(li => !li.textContent.includes('sales tax')) // Filter out tax notice
        .map(li => {
            const text = li.textContent;
            return text.split(' - ')[0].split(' ').slice(1).join(' ');
        }).sort();
    
    const isCorrect = cartNames.length === listItems.length && 
                     cartNames.every((name, index) => name === listItems[index]);
    
    if (isCorrect && total <= storeGame.money) {
        // Success!
        const change = storeGame.money - total;
        const coins = 15; // Fixed coin reward
        
        showStoreSuccess(total, change, coins);
        
        // Track games played
        if (api.userId) {
            api.updateProgress(coins, 10, 'store', 100);
        }
        
    } else if (total > storeGame.money) {
        alert("You don't have enough money! Remove some items from your cart.");
    } else {
        alert("Check your shopping list! You might have the wrong items.");
    }
}

function showStoreSuccess(total, change, coins) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content">
            <h2>🎉 Great Job!</h2>
            <p>You spent: <strong>${formatCurrency(total)}</strong></p>
            <p>Your change: <strong>${formatCurrency(change)}</strong></p>
            <p class="coin-reward">You earned ${coins} coins!</p>
            <button onclick="playAgain()">Play Again</button>
        </div>
    `;
    
    // Add modal styles
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
    
    const content = successModal.querySelector('.success-content');
    content.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        animation: pop 0.3s ease-out;
    `;
    
    content.querySelector('button').style.cssText = `
        background: #48bb78;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.1em;
        cursor: pointer;
        margin-top: 20px;
    `;
    
    document.body.appendChild(successModal);
    
    // Add coins
    addCoins(coins);
    createConfetti();
}

function playAgain() {
    // Remove modal
    document.querySelector('.success-modal').remove();
    
    // Reinitialize store
    initializeStore();
}