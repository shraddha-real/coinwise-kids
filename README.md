# CoinWise Kids 🪙

An interactive financial literacy web application designed to teach children essential money management skills through fun, engaging games and activities.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-v4.18+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Overview

CoinWise Kids helps children ages 6-12 learn about money management, budgeting, saving, and smart spending through interactive games. The application features a colorful, kid-friendly interface with reward systems to keep children motivated while learning important financial concepts.

## ✨ Features

### 🎮 Interactive Games

1. **Virtual Store** 🛒
   - Practice shopping with a budget
   - Learn about sales tax (8%)
   - Make change and manage money
   - Complete shopping challenges

2. **Piggy Bank Savings** 🐷
   - Set savings goals
   - Make weekly spending vs saving decisions
   - Learn delayed gratification
   - Track progress visually

3. **Budget Builder** 📊
   - Allocate money across categories
   - Understand percentages and priorities
   - Practice real-life budgeting scenarios

4. **Money Lessons** 📚
   - Interactive educational content
   - Topics: earning, saving, spending, taxes
   - Quiz system with rewards
   - Progressive difficulty levels

### 🏆 Gamification

- **Coin Rewards**: Earn coins for completing games
- **Level System**: Progress through levels (XP-based)
- **Achievements**: Unlock special badges
- **Progress Tracking**: Visual achievement display

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coinwise-kids.git
cd coinwise-kids
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite (if available)

## 🌐 Deployment

### Deploy to Render

1. Push your code to GitHub
2. Create account at [render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repository
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`

The app will be live at `https://your-app-name.onrender.com`

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (server-side)
- **Deployment**: Render

## 📁 Project Structure

```
coinwise-kids/
├── index.html          # Main application page
├── server.js           # Express server & API
├── package.json        # Dependencies
├── css/
│   ├── styles.css      # Main styles
│   └── animations.css  # Animation effects
├── js/
│   ├── main.js         # Core application logic
│   ├── api.js          # API client
│   ├── utils.js        # Utility functions
│   ├── hints.js        # Hint system
│   ├── share.js        # Progress sharing
│   └── games/          # Game modules
│       ├── store.js
│       ├── piggybank.js
│       ├── budget.js
│       └── learn.js
└── favicon.ico         # Site icon
```

## 🎯 Learning Objectives

Children using CoinWise Kids will learn:

- **Money Recognition**: Understanding currency values
- **Basic Math**: Addition, subtraction, percentages
- **Budgeting**: Resource allocation
- **Saving**: Goal setting and achievement
- **Smart Spending**: Informed decisions
- **Taxes**: Basic sales tax concepts

## 🔒 Privacy & Safety

- No personal data collection (only nicknames)
- No external accounts required
- All data stored server-side
- No social features
- Kid-safe content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### User Management
- `POST /api/user/create` - Create new user
- `GET /api/user/:userId` - Get user data
- `POST /api/user/:userId/progress` - Update progress

### Game Features
- `POST /api/hint/use` - Use a hint
- `GET /api/hint/:gameType` - Get hint info
- `GET /api/achievements` - List achievements
- `POST /api/achievement/unlock` - Unlock achievement

### Progress Sharing
- `GET /api/user/:userId/export` - Export progress
- `GET /api/share/:shareCode` - View shared progress
- `GET /api/parent/report/:userId` - Parent dashboard

## ⚠️ Known Limitations

- **In-memory storage**: Data resets when server restarts
- **Single server**: Not suitable for high traffic
- **No authentication**: Simple nickname-based system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Designed for educational purposes
- Created to promote financial literacy
- Built with ❤️ for young learners

---

**Note**: This application is for educational use only and does not involve real money transactions.