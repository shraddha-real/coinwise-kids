// Educational Content - Money Lessons
let learnGame = {
    currentLesson: null,
    currentQuiz: null,
    quizScore: 0
};

// Educational content for all players
const lessons = [
    {
        id: 'needs-wants',
            title: 'Needs vs Wants',
            icon: '🤔',
            content: `
                <h3>What are Needs?</h3>
                <p>Needs are things we MUST have to live and be healthy:</p>
                <ul>
                    <li>🏠 A place to live</li>
                    <li>🍎 Food to eat</li>
                    <li>👕 Clothes to wear</li>
                    <li>💊 Medicine when sick</li>
                </ul>
                
                <h3>What are Wants?</h3>
                <p>Wants are things that are nice to have but we can live without:</p>
                <ul>
                    <li>🎮 Video games</li>
                    <li>🍬 Candy and treats</li>
                    <li>🧸 Extra toys</li>
                    <li>🎨 Fancy clothes</li>
                </ul>
            `,
            quiz: [
                { question: 'Is food a need or a want?', options: ['Need', 'Want'], correct: 0 },
                { question: 'Is a toy a need or a want?', options: ['Need', 'Want'], correct: 1 },
                { question: 'Is a house a need or a want?', options: ['Need', 'Want'], correct: 0 },
                { question: 'Is candy a need or a want?', options: ['Need', 'Want'], correct: 1 }
            ]
        },
        {
            id: 'saving-money',
            title: 'Why Save Money?',
            icon: '🐷',
            content: `
                <h3>Saving is Super!</h3>
                <p>When we save money, we can:</p>
                <ul>
                    <li>🎁 Buy something special later</li>
                    <li>🚨 Have money for emergencies</li>
                    <li>🎯 Reach our goals</li>
                    <li>😊 Feel proud of ourselves</li>
                </ul>
                
                <h3>How to Save</h3>
                <ul>
                    <li>📦 Put coins in a piggy bank</li>
                    <li>✋ Don't spend all your money at once</li>
                    <li>🎯 Set a savings goal</li>
                    <li>🎉 Celebrate when you reach it!</li>
                </ul>
            `,
            quiz: [
                { question: 'What can saving money help us do?', options: ['Buy things later', 'Waste money', 'Lose money'], correct: 0 },
                { question: 'Where can we keep our savings?', options: ['Under the bed', 'Piggy bank', 'In our pocket'], correct: 1 },
                { question: 'Should we spend all our money at once?', options: ['Yes', 'No'], correct: 1 }
            ]
        },
        {
            id: 'budgeting-basics',
            title: 'Making a Budget',
            icon: '📊',
            content: `
                <h3>What is a Budget?</h3>
                <p>A budget is a plan for your money. It helps you:</p>
                <ul>
                    <li>📝 Track what you earn</li>
                    <li>💰 Plan what to save</li>
                    <li>🛍️ Decide what to spend</li>
                    <li>🎯 Reach your goals faster</li>
                </ul>
                
                <h3>Simple Budget Example</h3>
                <p>If you get $10 allowance:</p>
                <ul>
                    <li>Save: $5 (50%)</li>
                    <li>Spend: $3 (30%)</li>
                    <li>Share: $2 (20%)</li>
                </ul>
            `,
            quiz: [
                { question: 'What is a budget?', options: ['A plan for money', 'A type of coin', 'A piggy bank'], correct: 0 },
                { question: 'If you get $10, how much should you try to save?', options: ['$0', 'At least some', 'All of it'], correct: 1 },
                { question: 'What does a budget help you do?', options: ['Waste money', 'Track and plan money', 'Lose money'], correct: 1 }
            ]
        },
        {
            id: 'earning-money',
            title: 'Ways to Earn Money',
            icon: '💼',
            content: `
                <h3>How Kids Can Earn Money</h3>
                <ul>
                    <li>🧹 Do extra chores at home</li>
                    <li>🍋 Run a lemonade stand</li>
                    <li>🐕 Walk neighbors' dogs</li>
                    <li>📚 Sell old toys or books</li>
                    <li>🎨 Make and sell crafts</li>
                </ul>
                
                <h3>Important Tips</h3>
                <ul>
                    <li>👨‍👩‍👧 Always ask parents first</li>
                    <li>💯 Do your best work</li>
                    <li>😊 Be polite and friendly</li>
                    <li>💰 Save some of what you earn</li>
                </ul>
            `,
            quiz: [
                { question: 'What should you do before starting to earn money?', options: ['Nothing', 'Ask your parents', 'Keep it secret'], correct: 1 },
                { question: 'What is a good way for kids to earn money?', options: ['Extra chores', 'Taking without asking', 'Doing nothing'], correct: 0 },
                { question: 'What should you do with money you earn?', options: ['Spend it all', 'Save some of it', 'Throw it away'], correct: 1 }
            ]
        },
        {
            id: 'banking-basics',
            title: 'Introduction to Banking',
            icon: '🏦',
            content: `
                <h3>What is a Bank?</h3>
                <p>A bank is a safe place to keep your money. Banks offer:</p>
                <ul>
                    <li>💳 Savings accounts</li>
                    <li>📈 Interest on your money</li>
                    <li>🔒 Security for your funds</li>
                    <li>💰 Debit cards for spending</li>
                </ul>
                
                <h3>How Interest Works</h3>
                <p>When you save money in a bank:</p>
                <ul>
                    <li>The bank pays you extra money called "interest"</li>
                    <li>If you save $100 at 2% interest, you get $2 extra per year</li>
                    <li>The more you save, the more interest you earn!</li>
                </ul>
            `,
            quiz: [
                { question: 'What is interest?', options: ['Money the bank pays you', 'A fee you pay', 'A type of coin'], correct: 0 },
                { question: 'Why use a bank?', options: ['It\'s not safe', 'To keep money safe', 'To lose money'], correct: 1 },
                { question: 'If you save $100 at 2% interest, how much extra do you get per year?', options: ['$0', '$2', '$20'], correct: 1 }
            ]
        },
        {
            id: 'taxes-basics',
            title: 'Understanding Taxes',
            icon: '🏛️',
            content: `
                <h3>What are Taxes?</h3>
                <p>Taxes are money that people pay to the government to help run the country. Think of it like this:</p>
                <ul>
                    <li>🏫 Taxes help build schools and pay teachers</li>
                    <li>🚒 Taxes pay for fire trucks and firefighters</li>
                    <li>🏥 Taxes help build hospitals</li>
                    <li>🛣️ Taxes build and fix roads</li>
                    <li>🚔 Taxes pay for police to keep us safe</li>
                </ul>
                <p><strong>How do taxes work?</strong></p>
                <p>When adults earn money, they give a small part to the government. If someone earns $100, they might pay $10-20 in taxes.</p>
                <p><strong>Sales Tax:</strong> When you buy something at the store, you pay a little extra. That extra money is tax! If a toy costs $10, you might pay $10.80 with tax.</p>
            `,
            quiz: [
                { question: 'What do taxes help pay for?', options: ['Only toys', 'Schools, roads, and safety services', 'Nothing important'], correct: 1 },
                { question: 'If a game costs $20 and tax is $1, how much do you pay total?', options: ['$19', '$20', '$21'], correct: 2 },
                { question: 'Why do we pay taxes?', options: ['To help our community', 'For no reason', 'To buy candy'], correct: 0 }
            ]
        },
        {
            id: 'smart-spending',
            title: 'Being a Smart Spender',
            icon: '🧠',
            content: `
                <h3>Before You Buy</h3>
                <p>Ask yourself these questions:</p>
                <ul>
                    <li>❓ Do I really need this?</li>
                    <li>💰 Can I afford it?</li>
                    <li>🔍 Is this the best price?</li>
                    <li>⏰ Can I wait for a sale?</li>
                    <li>♻️ Will I use it for a long time?</li>
                </ul>
                
                <h3>Smart Shopping Tips</h3>
                <ul>
                    <li>📝 Make a list before shopping</li>
                    <li>🏷️ Compare prices at different stores</li>
                    <li>💯 Look for quality, not just low prices</li>
                    <li>🎯 Stick to your budget</li>
                    <li>⏳ Wait 24 hours before big purchases</li>
                </ul>
            `,
            quiz: [
                { question: 'What should you do before making a big purchase?', options: ['Buy immediately', 'Wait and think', 'Never buy anything'], correct: 1 },
                { question: 'Why compare prices?', options: ['To waste time', 'To find the best deal', 'Prices are always the same'], correct: 1 },
                { question: 'What helps you stick to smart spending?', options: ['No plan', 'A shopping list and budget', 'Buying everything'], correct: 1 }
            ]
        }
];

function loadLearnGame() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="learn-game">
            <div class="game-header">
                <button class="back-btn" onclick="backToMenu()">👈 Back to Menu</button>
                <h2>📚 Money Lessons</h2>
            </div>
            
            <div class="lesson-selection" id="lessonSelection">
                <h3>Choose a lesson to learn about money!</h3>
                <div class="lessons-grid" id="lessonsGrid"></div>
            </div>
            
            <div class="lesson-content" id="lessonContent" style="display: none;">
                <button class="back-to-lessons" onclick="backToLessons()">👈 Back to Lessons</button>
                <div class="lesson-header">
                    <h2 id="lessonTitle"></h2>
                </div>
                <div class="lesson-body" id="lessonBody"></div>
                <button class="start-quiz-btn" onclick="startQuiz()">🎯 Take the Quiz!</button>
            </div>
            
            <div class="quiz-container" id="quizContainer" style="display: none;">
                <div class="quiz-header">
                    <h3>Quiz Time!</h3>
                    <div class="quiz-progress">
                        Question <span id="currentQuestion">1</span> of <span id="totalQuestions">3</span>
                    </div>
                </div>
                <div class="quiz-body">
                    <h4 id="questionText"></h4>
                    <div class="quiz-options" id="quizOptions"></div>
                </div>
            </div>
        </div>
    `;
    
    addLearnStyles();
    displayLessons();
}

function addLearnStyles() {
    const styleElement = document.getElementById('learn-styles') || document.createElement('style');
    styleElement.id = 'learn-styles';
    styleElement.textContent = `
        .learn-game {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .lesson-selection {
            text-align: center;
            padding: 20px;
        }
        
        .lessons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .lesson-card {
            background: white;
            border: 3px solid #e2e8f0;
            border-radius: 20px;
            padding: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .lesson-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-color: #805ad5;
        }
        
        .lesson-icon {
            font-size: 4em;
            margin-bottom: 15px;
        }
        
        .lesson-title {
            font-size: 1.4em;
            font-weight: bold;
            color: #2d3748;
        }
        
        .lesson-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .back-to-lessons {
            background: #e2e8f0;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
            margin-bottom: 20px;
        }
        
        .lesson-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #e2e8f0;
        }
        
        .lesson-header h2 {
            color: #5a67d8;
            font-size: 2.5em;
        }
        
        .lesson-body {
            font-size: 1.1em;
            line-height: 1.8;
            color: #2d3748;
        }
        
        .lesson-body h3 {
            color: #805ad5;
            margin: 25px 0 15px;
            font-size: 1.5em;
        }
        
        .lesson-body ul {
            background: #f7fafc;
            padding: 20px 20px 20px 40px;
            border-radius: 15px;
            margin: 15px 0;
        }
        
        .lesson-body li {
            margin: 10px 0;
        }
        
        .start-quiz-btn {
            display: block;
            margin: 40px auto 0;
            padding: 20px 40px;
            background: #48bb78;
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.3em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .start-quiz-btn:hover {
            background: #38a169;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
        }
        
        .quiz-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .quiz-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .quiz-header h3 {
            color: #5a67d8;
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .quiz-progress {
            font-size: 1.2em;
            color: #4a5568;
        }
        
        .quiz-body {
            text-align: center;
        }
        
        #questionText {
            font-size: 1.5em;
            color: #2d3748;
            margin-bottom: 30px;
        }
        
        .quiz-options {
            display: grid;
            gap: 15px;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .quiz-option {
            padding: 20px;
            background: #f7fafc;
            border: 3px solid #e2e8f0;
            border-radius: 15px;
            font-size: 1.2em;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quiz-option:hover {
            background: #e6fffa;
            border-color: #81e6d9;
            transform: translateX(5px);
        }
        
        .quiz-option.correct {
            background: #c6f6d5;
            border-color: #48bb78;
            animation: pulse 0.5s ease;
        }
        
        .quiz-option.incorrect {
            background: #fed7d7;
            border-color: #f56565;
            animation: shake 0.5s ease;
        }
        
        .quiz-result {
            text-align: center;
            padding: 40px;
        }
        
        .quiz-result h3 {
            font-size: 2.5em;
            color: #48bb78;
            margin-bottom: 20px;
        }
        
        .quiz-result p {
            font-size: 1.3em;
            margin: 10px 0;
        }
        
        .quiz-result button {
            margin-top: 30px;
            padding: 15px 30px;
            background: #5a67d8;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            cursor: pointer;
        }
    `;
    
    if (!document.getElementById('learn-styles')) {
        document.head.appendChild(styleElement);
    }
}

function displayLessons() {
    const lessonsGrid = document.getElementById('lessonsGrid');
    
    lessonsGrid.innerHTML = lessons.map(lesson => `
        <div class="lesson-card" onclick="openLesson('${lesson.id}')">
            <div class="lesson-icon">${lesson.icon}</div>
            <div class="lesson-title">${lesson.title}</div>
        </div>
    `).join('');
}

function openLesson(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    learnGame.currentLesson = lesson;
    
    // Hide selection, show lesson
    document.getElementById('lessonSelection').style.display = 'none';
    document.getElementById('lessonContent').style.display = 'block';
    
    // Display lesson content
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonBody').innerHTML = lesson.content;
    
    // Add animation
    document.getElementById('lessonContent').classList.add('fade-in');
}

function backToLessons() {
    document.getElementById('lessonContent').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('lessonSelection').style.display = 'block';
    learnGame.currentLesson = null;
    learnGame.currentQuiz = null;
}

function startQuiz() {
    if (!learnGame.currentLesson || !learnGame.currentLesson.quiz) return;
    
    learnGame.currentQuiz = {
        questions: [...learnGame.currentLesson.quiz],
        currentIndex: 0,
        score: 0,
        answers: []
    };
    
    // Hide lesson, show quiz
    document.getElementById('lessonContent').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    
    // Display first question
    displayQuestion();
}

function displayQuestion() {
    const quiz = learnGame.currentQuiz;
    const question = quiz.questions[quiz.currentIndex];
    
    // Update progress
    document.getElementById('currentQuestion').textContent = quiz.currentIndex + 1;
    document.getElementById('totalQuestions').textContent = quiz.questions.length;
    
    // Display question
    document.getElementById('questionText').textContent = question.question;
    
    // Display options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <button class="quiz-option" onclick="selectAnswer(${index})">${option}</button>
    `).join('');
}

function selectAnswer(answerIndex) {
    const quiz = learnGame.currentQuiz;
    const question = quiz.questions[quiz.currentIndex];
    const isCorrect = answerIndex === question.correct;
    
    // Record answer
    quiz.answers.push({
        question: question.question,
        selected: answerIndex,
        correct: question.correct,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        quiz.score++;
    }
    
    // Show feedback
    const options = document.querySelectorAll('.quiz-option');
    options[answerIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    options[question.correct].classList.add('correct');
    
    // Disable all options
    options.forEach(option => option.disabled = true);
    
    // Next question or show results
    setTimeout(() => {
        quiz.currentIndex++;
        if (quiz.currentIndex < quiz.questions.length) {
            displayQuestion();
        } else {
            showQuizResults();
        }
    }, 1500);
}

function showQuizResults() {
    const quiz = learnGame.currentQuiz;
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    const coins = Math.round(10 + (percentage / 10));
    
    // Achievement check
    if (percentage === 100) {
        unlockAchievement('perfect_student', 'Perfect Student', 'Get 100% on a quiz!', 25);
    }
    
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-result">
            <h3>🎉 Quiz Complete!</h3>
            <p>You got ${quiz.score} out of ${quiz.questions.length} correct!</p>
            <p style="font-size: 3em; margin: 20px 0;">${percentage}%</p>
            <p class="coin-reward" style="font-size: 1.3em; color: #48bb78;">You earned ${coins} coins!</p>
            <button onclick="backToLessons()">Back to Lessons</button>
        </div>
    `;
    
    // Add coins
    addCoins(coins);
    
    if (percentage >= 80) {
        createConfetti();
    }
}