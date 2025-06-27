// Share and Export functionality

async function showShareProgress() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="share-progress">
            <div class="game-header">
                <button class="back-btn" onclick="backToMenu()">👈 Back to Menu</button>
                <h2>🎯 Share Your Progress</h2>
            </div>
            
            <div class="share-content">
                <div class="progress-card" id="progressCard">
                    <div class="loading">Generating your progress card...</div>
                </div>
                
                <div class="share-options">
                    <div class="share-buttons">
                        <button onclick="downloadProgressCard()" class="download-btn">
                            📥 Download Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addShareStyles();
    await loadProgressCard();
}

function addShareStyles() {
    const styleElement = document.getElementById('share-styles') || document.createElement('style');
    styleElement.id = 'share-styles';
    styleElement.textContent = `
        .share-progress {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .progress-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .progress-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 0;
        }
        
        .card-header {
            position: relative;
            z-index: 1;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .card-avatar {
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            margin: -20px auto 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-nickname {
            font-size: 2em;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .card-level {
            font-size: 1.3em;
            color: #5a67d8;
        }
        
        .card-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-box {
            text-align: center;
            padding: 20px;
            background: #f7fafc;
            border-radius: 15px;
        }
        
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #5a67d8;
            display: block;
        }
        
        .stat-label {
            color: #4a5568;
            margin-top: 5px;
        }
        
        .share-options {
            background: #f7fafc;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .share-buttons {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        
        .share-buttons button {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .download-btn {
            background: #48bb78;
            color: white;
        }
        
        .download-btn:hover {
            background: #38a169;
            transform: translateY(-2px);
        }
        
        
        .card-watermark {
            position: absolute;
            bottom: 20px;
            right: 20px;
            opacity: 0.1;
            font-size: 8em;
            transform: rotate(-15deg);
        }
        
        @media (max-width: 768px) {
            .card-stats {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    if (!document.getElementById('share-styles')) {
        document.head.appendChild(styleElement);
    }
}

async function loadProgressCard() {
    const progressData = await api.exportProgress();
    
    if (!progressData) {
        document.getElementById('progressCard').innerHTML = '<p>Error loading progress data.</p>';
        return;
    }
    
    // Create avatar based on first letter of nickname
    const avatarLetter = progressData.nickname.charAt(0).toUpperCase();
    
    document.getElementById('progressCard').innerHTML = `
        <div class="card-header">
            <div class="card-avatar">${avatarLetter}</div>
            <div class="card-nickname">${progressData.nickname}</div>
            <div class="card-level">⭐ Level ${progressData.level}</div>
        </div>
        
        <div class="card-stats">
            <div class="stat-box">
                <span class="stat-value">🪙 ${progressData.totalCoins}</span>
                <span class="stat-label">Total Coins</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">🎮 ${progressData.gamesPlayed}</span>
                <span class="stat-label">Games Played</span>
            </div>
        </div>
        
        <div class="card-watermark">💰</div>
    `;
}


function downloadProgressCard() {
    // Create canvas to render the card
    const card = document.getElementById('progressCard');
    
    html2canvas(card).then(canvas => {
        // Convert to image and download
        const link = document.createElement('a');
        link.download = 'moneywise-progress.png';
        link.href = canvas.toDataURL();
        link.click();
    }).catch(() => {
        // Fallback: Create text version
        const progressText = card.innerText;
        const blob = new Blob([progressText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'moneywise-progress.txt';
        link.href = url;
        link.click();
    });
}


// Add html2canvas library dynamically (lightweight screenshot library)
if (!window.html2canvas) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
}

// Make showShareProgress available globally
window.showShareProgress = showShareProgress;