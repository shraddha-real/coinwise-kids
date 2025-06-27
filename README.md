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
- `npm test` - Run all tests (37 tests)
- `npm run test:api` - Run API tests only (30 tests)
- `npm run test:integration` - Run integration tests only (7 tests)
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Run tests with code coverage report

## 🧪 Testing

CoinWise Kids includes a comprehensive test suite with 37 tests covering all major features:

### Test Coverage

- **User Management**: User creation, profile updates, progress tracking
- **Game Features**: Hints system, achievements, game progress
- **Social Features**: Progress sharing, friend comparisons
- **Integration Tests**: Complete user journeys, multi-user scenarios
- **Server Health**: Static file serving, MIME types, error handling

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api          # API tests only (30 tests)
npm run test:integration  # Integration tests only (7 tests)

# Development testing
npm run test:watch       # Watch mode for continuous testing
npm run test:coverage    # Generate code coverage report
```

### Testing Stack

- **Test Framework**: Mocha
- **Assertion Library**: Chai
- **HTTP Testing**: Supertest
- **Test Structure**: BDD-style with descriptive test names

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (server-side)
- **Testing**: Mocha, Chai, Supertest
- **Deployment**: Render

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