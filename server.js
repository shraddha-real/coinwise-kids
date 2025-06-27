const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
    extensions: ['html', 'js', 'css', 'ico'],
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        } else if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        }
    }
}));

// In-memory storage (in production, use a database)
const users = new Map();
const achievements = new Map();

// Initialize achievements
initializeAchievements();

// API Routes

// User Management
app.post('/api/user/create', (req, res) => {
    const { nickname } = req.body;
    const userId = uuidv4();
    
    const user = {
        id: userId,
        nickname,
        coins: 0,
        level: 1,
        xp: 0,
        achievements: [],
        gameProgress: {},
        hints: {
            store: 3,
            piggybank: 3,
            budget: 3,
            learn: 3
        },
        createdAt: new Date()
    };
    
    users.set(userId, user);
    res.json({ success: true, user });
});

// Get user data
app.get('/api/user/:userId', (req, res) => {
    const user = users.get(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// Update user progress
app.post('/api/user/:userId/progress', (req, res) => {
    const user = users.get(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { coins, xp, gameType, score } = req.body;
    
    user.coins += coins || 0;
    user.xp += xp || 0;
    
    // Check for level up
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
        user.level = newLevel;
    }
    
    // Update game progress
    if (gameType && score !== undefined) {
        if (!user.gameProgress[gameType]) {
            user.gameProgress[gameType] = { highScore: 0, plays: 0 };
        }
        user.gameProgress[gameType].plays++;
        user.gameProgress[gameType].highScore = Math.max(user.gameProgress[gameType].highScore, score);
    }
    
    users.set(req.params.userId, user);
    res.json({ success: true, user });
});

// Story Mode API - REMOVED

// Hint System
app.post('/api/hint/use', (req, res) => {
    const { userId, gameType } = req.body;
    const user = users.get(userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.hints[gameType] !== undefined && user.hints[gameType] > 0) {
        const hintIndex = 3 - user.hints[gameType]; // 0, 1, or 2
        user.hints[gameType]--;
        users.set(userId, user);
        res.json({ success: true, hintsRemaining: user.hints[gameType], hint: getHint(gameType, hintIndex) });
    } else if (user.hints[gameType] === undefined) {
        // Invalid game type - still return a generic hint
        res.json({ success: true, hintsRemaining: 0, hint: getHint(gameType, 0) });
    } else {
        res.json({ success: false, message: 'No hints remaining for this game' });
    }
});

// Get hint without using it
app.get('/api/hint/:gameType', (req, res) => {
    const hint = getHint(req.params.gameType, 0);
    res.json({ hint });
});

// Achievements
app.get('/api/achievements', (req, res) => {
    res.json(Array.from(achievements.values()));
});

app.post('/api/achievement/unlock', (req, res) => {
    const { userId, achievementId } = req.body;
    const user = users.get(userId);
    const achievement = achievements.get(achievementId);
    
    if (!user || !achievement) {
        return res.status(404).json({ error: 'User or achievement not found' });
    }
    
    if (!user.achievements.includes(achievementId)) {
        user.achievements.push(achievementId);
        user.coins += achievement.coinReward;
        users.set(userId, user);
        res.json({ success: true, achievement, user });
    } else {
        res.json({ success: false, message: 'Achievement already unlocked' });
    }
});

// Leaderboard - REMOVED

// Daily Challenges - REMOVED

// Export/Share Progress
app.get('/api/user/:userId/export', (req, res) => {
    const user = users.get(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate shareable progress card data
    const progressCard = {
        nickname: user.nickname,
        level: user.level,
        totalCoins: user.coins,
        achievements: user.achievements.length,
        gamesPlayed: Object.values(user.gameProgress).reduce((sum, game) => sum + game.plays, 0),
        topSkills: identifyTopSkills(user),
        shareCode: generateShareCode(user.id),
        createdAt: new Date().toISOString()
    };
    
    res.json(progressCard);
});

// Get progress by share code
app.get('/api/share/:shareCode', (req, res) => {
    const shareCode = req.params.shareCode;
    const userId = decodeShareCode(shareCode);
    
    if (!userId || !users.has(userId)) {
        return res.status(404).json({ error: 'Invalid share code' });
    }
    
    const user = users.get(userId);
    const publicProfile = {
        nickname: user.nickname,
        level: user.level,
        totalCoins: user.coins,
        achievements: user.achievements.length,
        joinDate: user.createdAt
    };
    
    res.json(publicProfile);
});

// Compare with friend
app.post('/api/compare', (req, res) => {
    const { userId, friendShareCode } = req.body;
    const user = users.get(userId);
    const friendId = decodeShareCode(friendShareCode);
    const friend = friendId ? users.get(friendId) : null;
    
    if (!user || !friend) {
        return res.status(404).json({ error: 'User or friend not found' });
    }
    
    const comparison = {
        user: {
            nickname: user.nickname,
            level: user.level,
            coins: user.coins,
            achievements: user.achievements.length,
            gamesPlayed: Object.values(user.gameProgress).reduce((sum, game) => sum + game.plays, 0)
        },
        friend: {
            nickname: friend.nickname,
            level: friend.level,
            coins: friend.coins,
            achievements: friend.achievements.length,
            gamesPlayed: Object.values(friend.gameProgress).reduce((sum, game) => sum + game.plays, 0)
        },
        insights: generateComparisonInsights(user, friend)
    };
    
    res.json(comparison);
});

// Parent Dashboard
app.get('/api/parent/report/:userId', (req, res) => {
    const user = users.get(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const report = {
        user: {
            nickname: user.nickname,
            level: user.level,
            totalCoins: user.coins,
            joinDate: user.createdAt
        },
        progress: {
            gamesPlayed: Object.values(user.gameProgress).reduce((sum, game) => sum + game.plays, 0),
            achievementsUnlocked: user.achievements.length,
            averageScore: calculateAverageScore(user)
        },
        learning: {
            strongAreas: identifyStrongAreas(user),
            needsImprovement: identifyWeakAreas(user),
            recommendedActivities: getRecommendations(user)
        },
        timeSpent: estimateTimeSpent(user)
    };
    
    res.json(report);
});

// Helper functions
function initializeAchievements() {
    // Initialize achievements
    achievements.set('coin-collector', {
        id: 'coin-collector',
        name: 'Coin Collector',
        description: 'Collect 100 coins',
        icon: '🪙',
        coinReward: 25
    });
    
    achievements.set('shopping-expert', {
        id: 'shopping-expert',
        name: 'Shopping Expert',
        description: 'Complete 10 shopping trips',
        icon: '🛒',
        coinReward: 50
    });
    
    achievements.set('super-saver', {
        id: 'super-saver',
        name: 'Super Saver',
        description: 'Save 500 coins in your piggy bank',
        icon: '🐷',
        coinReward: 100
    });
    
    achievements.set('counting-master', {
        id: 'counting-master',
        name: 'Counting Master',
        description: 'Get perfect scores in counting game 5 times',
        icon: '🔢',
        coinReward: 75
    });
}

function getHint(gameType, index = 0) {
    const hints = {
        store: [
            'Look at your shopping list first - count how many items you need to buy. Do you have enough money for all of them?',
            'Add up the prices of items on your list BEFORE putting them in your cart. Try using your fingers or writing it down!',
            'If you don\'t have enough money, remove the most expensive item first and see if that helps you stay within budget.'
        ],
        piggybank: [
            'Look at your savings goal amount. Now divide your allowance in half - can you save that much and still have fun money?',
            'Try this trick: Save $1 for every $2 you get. So if you get $10, save $5. This way you reach goals faster!',
            'Count how many weeks it will take to reach your goal. If you save more each week, you\'ll get there sooner!'
        ],
        budget: [
            'Start with savings! A good rule is to save at least 25% of your income. So if you have $20, save at least $5.',
            'After savings, think about needs vs wants. Needs come first! Then divide the rest between your wants.',
            'Use the sliders to see percentages. Try this split: 30% savings, 30% fun, 40% for other categories. Adjust as needed!'
        ],
        learn: [
            'Read each lesson carefully and look for key words like "save", "spend", "need", and "want". These are important!',
            'For quiz questions, think about what would help you have MORE money in the future. Usually saving is the right answer!',
            'Remember: Needs are things you must have (like food), wants are things that are nice to have (like toys). Always take care of needs first!'
        ]
    };
    
    const gameHints = hints[gameType] || ['Keep trying, you can do it!'];
    // Return hint at specific index, or last hint if index is out of bounds
    return gameHints[Math.min(index, gameHints.length - 1)];
}

function calculateAverageScore(user) {
    const games = Object.values(user.gameProgress);
    if (games.length === 0) return 0;
    
    const totalScore = games.reduce((sum, game) => sum + game.highScore, 0);
    return Math.round(totalScore / games.length);
}

function identifyStrongAreas(user) {
    const areas = [];
    const progress = user.gameProgress;
    
    if (progress.counting?.highScore > 80) areas.push('Money Recognition');
    if (progress.store?.highScore > 80) areas.push('Shopping & Budgeting');
    if (progress.piggybank?.highScore > 80) areas.push('Saving Habits');
    
    return areas.length > 0 ? areas : ['Keep playing to discover strengths!'];
}

function identifyWeakAreas(user) {
    const areas = [];
    const progress = user.gameProgress;
    
    if (!progress.counting || progress.counting.plays < 3) areas.push('Money Counting Practice');
    if (!progress.store || progress.store.plays < 3) areas.push('Shopping Experience');
    if (!progress.piggybank || progress.piggybank.plays < 3) areas.push('Saving Practice');
    
    return areas.length > 0 ? areas : ['Great job exploring all areas!'];
}

function getRecommendations(user) {
    const recommendations = [];
    const progress = user.gameProgress;
    
    if (!progress.counting || progress.counting.plays < 5) {
        recommendations.push('Try the Coin Counter game to improve money recognition');
    }
    
    if (user.level < 5) {
        recommendations.push('Play more games to level up faster');
    }
    
    return recommendations.length > 0 ? recommendations : ['Keep up the great work!'];
}

function estimateTimeSpent(user) {
    // Rough estimates based on activity
    const gamesPlayed = Object.values(user.gameProgress).reduce((sum, game) => sum + game.plays, 0);
    
    const gameMinutes = gamesPlayed * 5; // Assume 5 minutes per game
    
    return {
        total: gameMinutes,
        games: gameMinutes
    };
}

function identifyTopSkills(user) {
    const skills = [];
    const progress = user.gameProgress;
    
    // Check game performance
    if (progress.counting?.highScore > 80) skills.push({ name: 'Money Master', emoji: '🪙' });
    if (progress.store?.highScore > 80) skills.push({ name: 'Smart Shopper', emoji: '🛒' });
    if (progress.piggybank?.highScore > 80) skills.push({ name: 'Super Saver', emoji: '🐷' });
    
    // Check achievements
    if (user.achievements.length > 5) skills.push({ name: 'Achievement Hunter', emoji: '🏆' });
    
    // Level-based skills
    if (user.level >= 10) skills.push({ name: 'Money Expert', emoji: '🌟' });
    else if (user.level >= 5) skills.push({ name: 'Rising Star', emoji: '⭐' });
    
    return skills.slice(0, 3); // Return top 3 skills
}

function generateShareCode(userId) {
    // Simple encoding for share codes
    const timestamp = Date.now().toString(36);
    const userPart = userId.substring(0, 8).replace(/-/g, '');
    return `MW${userPart}${timestamp}`.toUpperCase();
}

function decodeShareCode(shareCode) {
    // Extract user ID from share code
    if (!shareCode || !shareCode.startsWith('MW')) return null;
    
    // For this simple implementation, we'll store a mapping
    // In production, you'd want a more sophisticated approach
    for (const [userId, user] of users.entries()) {
        const userShareCode = generateShareCode(userId);
        if (shareCode.substring(0, 10) === userShareCode.substring(0, 10)) {
            return userId;
        }
    }
    return null;
}

function generateComparisonInsights(user1, user2) {
    const insights = [];
    
    // Level comparison
    if (user1.level > user2.level) {
        insights.push(`${user1.nickname} is ${user1.level - user2.level} levels ahead!`);
    } else if (user2.level > user1.level) {
        insights.push(`${user2.nickname} is ${user2.level - user1.level} levels ahead!`);
    } else {
        insights.push('You\'re both at the same level!');
    }
    
    // Coins comparison
    if (user1.coins > user2.coins) {
        insights.push(`${user1.nickname} has saved ${user1.coins - user2.coins} more coins!`);
    } else if (user2.coins > user1.coins) {
        insights.push(`${user2.nickname} has saved ${user2.coins - user1.coins} more coins!`);
    }
    
    // Achievements
    if (user1.achievements.length > user2.achievements.length) {
        insights.push(`${user1.nickname} has unlocked more achievements!`);
    } else if (user2.achievements.length > user1.achievements.length) {
        insights.push(`${user2.nickname} has unlocked more achievements!`);
    }
    
    return insights;
}

// Catch-all route to serve index.html for client-side routing
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`CoinWise Kids server running on port ${PORT}`);
    });
}

// Export app for testing
module.exports = app;