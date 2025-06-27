// API client for CoinWise Kids
const API_BASE_URL = 'http://localhost:3000/api';

class CoinWiseAPI {
    constructor() {
        this.userId = localStorage.getItem('userId');
        this.user = null;
    }

    // User Management
    async createUser(nickname) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname })
            });
            
            const data = await response.json();
            if (data.success) {
                this.userId = data.user.id;
                this.user = data.user;
                localStorage.setItem('userId', this.userId);
                localStorage.setItem('userNickname', nickname);
            }
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    }

    async getUser() {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/user/${this.userId}`);
            const user = await response.json();
            this.user = user;
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async updateProgress(coins, xp, gameType, score) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/user/${this.userId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coins, xp, gameType, score })
            });
            
            const data = await response.json();
            if (data.success) {
                this.user = data.user;
            }
            return data;
        } catch (error) {
            console.error('Error updating progress:', error);
            return null;
        }
    }

    // Story Mode
    async getStories() {
        try {
            const response = await fetch(`${API_BASE_URL}/stories`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching stories:', error);
            return [];
        }
    }

    async getStory(storyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/story/${storyId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching story:', error);
            return null;
        }
    }

    async completeStory(storyId, choices, finalScore) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/story/${storyId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, choices, finalScore })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error completing story:', error);
            return null;
        }
    }

    // Hints
    async useHint(gameType) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/hint/use`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, gameType })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error using hint:', error);
            return null;
        }
    }

    async getHint(gameType) {
        try {
            const response = await fetch(`${API_BASE_URL}/hint/${gameType}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching hint:', error);
            return null;
        }
    }

    // Achievements
    async getAchievements() {
        try {
            const response = await fetch(`${API_BASE_URL}/achievements`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching achievements:', error);
            return [];
        }
    }

    async unlockAchievement(achievementId) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/achievement/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, achievementId })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return null;
        }
    }


    // Daily Challenges
    async getDailyChallenges() {
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/daily`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching daily challenges:', error);
            return [];
        }
    }

    async completeChallenge(challengeId) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/challenges/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, challengeId })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error completing challenge:', error);
            return null;
        }
    }

    // Export/Share Progress
    async exportProgress() {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/user/${this.userId}/export`);
            return await response.json();
        } catch (error) {
            console.error('Error exporting progress:', error);
            return null;
        }
    }

    async getSharedProfile(shareCode) {
        try {
            const response = await fetch(`${API_BASE_URL}/share/${shareCode}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching shared profile:', error);
            return null;
        }
    }

    async compareWithFriend(friendShareCode) {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/compare`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, friendShareCode })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error comparing with friend:', error);
            return null;
        }
    }

    // Parent Dashboard
    async getParentReport() {
        if (!this.userId) return null;
        
        try {
            const response = await fetch(`${API_BASE_URL}/parent/report/${this.userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching parent report:', error);
            return null;
        }
    }
}

// Create global API instance
const api = new CoinWiseAPI();