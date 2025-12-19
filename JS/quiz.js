// Base de données de questions par niveau
const QUIZ_DATA = {
    easy: {
        timePerQuestion: 30,
        pointsPerQuestion: 1,
        questions: [
            {
                question: "Quelle est la capitale de la France ?",
                answers: ["Paris", "Londres", "Berlin", "Madrid"],
                correct: 0
            },
            {
                question: "Combien de continents y a-t-il sur Terre ?",
                answers: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "Quel est le plus grand océan du monde ?",
                answers: ["Atlantique", "Pacifique", "Indien", "Arctique"],
                correct: 1
            },
            {
                question: "Quelle planète est la plus proche du Soleil ?",
                answers: ["Vénus", "Mercure", "Terre", "Mars"],
                correct: 1
            },
            {
                question: "Combien de côtés a un triangle ?",
                answers: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "Quel est le symbole chimique de l'eau ?",
                answers: ["H2O", "CO2", "O2", "NaCl"],
                correct: 0
            },
            {
                question: "Quelle est la couleur obtenue en mélangeant le rouge et le bleu ?",
                answers: ["Vert", "Violet", "Orange", "Jaune"],
                correct: 1
            },
            {
                question: "Combien de jours y a-t-il dans une semaine ?",
                answers: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "Quel est le plus grand mammifère du monde ?",
                answers: ["Éléphant", "Girafe", "Baleine bleue", "Rhinocéros"],
                correct: 2
            },
            {
                question: "Quelle est la langue la plus parlée au monde ?",
                answers: ["Anglais", "Espagnol", "Mandarin", "Français"],
                correct: 2
            }
        ]
    },
    medium: {
        timePerQuestion: 20,
        pointsPerQuestion: 2,
        questions: [
            {
                question: "Qui a peint la Joconde ?",
                answers: ["Michel-Ange", "Léonard de Vinci", "Picasso", "Van Gogh"],
                correct: 1
            },
            {
                question: "Quelle est la formule de l'aire d'un cercle ?",
                answers: ["πr²", "2πr", "πd", "r²"],
                correct: 0
            },
            {
                question: "En quelle année a eu lieu la Révolution française ?",
                answers: ["1789", "1799", "1779", "1809"],
                correct: 0
            },
            {
                question: "Quel est le plus grand désert du monde ?",
                answers: ["Sahara", "Gobi", "Antarctique", "Kalahari"],
                correct: 2
            },
            {
                question: "Combien de chromosomes possède l'être humain ?",
                answers: ["42", "44", "46", "48"],
                correct: 2
            },
            {
                question: "Quel est le symbole chimique de l'or ?",
                answers: ["Ag", "Au", "Fe", "Cu"],
                correct: 1
            },
            {
                question: "Qui a écrit '1984' ?",
                answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Jules Verne"],
                correct: 0
            },
            {
                question: "Quelle est la vitesse de la lumière ?",
                answers: ["300 000 km/s", "150 000 km/s", "450 000 km/s", "600 000 km/s"],
                correct: 0
            },
            {
                question: "Quel est le plus petit pays du monde ?",
                answers: ["Monaco", "Vatican", "Nauru", "San Marino"],
                correct: 1
            },
            {
                question: "Combien de temps la Terre met-elle pour tourner autour du Soleil ?",
                answers: ["365 jours", "366 jours", "364 jours", "367 jours"],
                correct: 0
            },
            {
                question: "Quel est le plus long fleuve du monde ?",
                answers: ["Nil", "Amazone", "Mississippi", "Yangtsé"],
                correct: 1
            },
            {
                question: "Qui a inventé le téléphone ?",
                answers: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
                correct: 1
            },
            {
                question: "Quelle est la capitale de l'Australie ?",
                answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
                correct: 2
            },
            {
                question: "Combien de côtés a un hexagone ?",
                answers: ["5", "6", "7", "8"],
                correct: 1
            },
            {
                question: "Quel est le point le plus haut de la Terre ?",
                answers: ["K2", "Mont Everest", "Kilimandjaro", "Mont Blanc"],
                correct: 1
            }
        ]
    },
    hard: {
        timePerQuestion: 15,
        pointsPerQuestion: 3,
        questions: [
            {
                question: "Quelle est la constante de Planck ?",
                answers: ["6.626 × 10⁻³⁴ J·s", "6.626 × 10⁻³³ J·s", "6.626 × 10⁻³⁵ J·s", "6.626 × 10⁻³² J·s"],
                correct: 0
            },
            {
                question: "Qui a prouvé le théorème de Fermat ?",
                answers: ["Pierre de Fermat", "Andrew Wiles", "Grigori Perelman", "Terence Tao"],
                correct: 1
            },
            {
                question: "Quelle est la formule de la relativité restreinte d'Einstein ?",
                answers: ["E = mc²", "E = hf", "F = ma", "PV = nRT"],
                correct: 0
            },
            {
                question: "Combien de symphonies Beethoven a-t-il composées ?",
                answers: ["7", "8", "9", "10"],
                correct: 2
            },
            {
                question: "Quel est le nombre d'Avogadro ?",
                answers: ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "6.022 × 10²¹"],
                correct: 0
            },
            {
                question: "Qui a écrit 'L'Étranger' ?",
                answers: ["Jean-Paul Sartre", "Albert Camus", "André Gide", "Marcel Proust"],
                correct: 1
            },
            {
                question: "Quelle est la température du zéro absolu ?",
                answers: ["-273.15°C", "-273.16°C", "-273.14°C", "-273.17°C"],
                correct: 0
            },
            {
                question: "Combien de dimensions a un tesseract ?",
                answers: ["3", "4", "5", "6"],
                correct: 1
            },
            {
                question: "Quel est le plus grand nombre premier connu (approximativement) ?",
                answers: ["2^82,589,933 - 1", "2^82,589,932 - 1", "2^82,589,934 - 1", "2^82,589,931 - 1"],
                correct: 0
            },
            {
                question: "Qui a découvert la structure de l'ADN ?",
                answers: ["Watson et Crick", "Darwin et Wallace", "Mendel et Morgan", "Pasteur et Koch"],
                correct: 0
            },
            {
                question: "Quelle est la constante de gravitation universelle ?",
                answers: ["6.674 × 10⁻¹¹ N·m²/kg²", "6.674 × 10⁻¹² N·m²/kg²", "6.674 × 10⁻¹⁰ N·m²/kg²", "6.674 × 10⁻¹³ N·m²/kg²"],
                correct: 0
            },
            {
                question: "Combien de temps met la lumière du Soleil pour atteindre la Terre ?",
                answers: ["8 minutes", "8.3 minutes", "7.5 minutes", "9 minutes"],
                correct: 1
            },
            {
                question: "Quel est le nombre d'or ?",
                answers: ["1.618", "1.414", "2.718", "3.141"],
                correct: 0
            },
            {
                question: "Qui a peint 'Les Demoiselles d'Avignon' ?",
                answers: ["Pablo Picasso", "Henri Matisse", "Salvador Dalí", "Joan Miró"],
                correct: 0
            },
            {
                question: "Quelle est la masse d'un électron ?",
                answers: ["9.109 × 10⁻³¹ kg", "9.109 × 10⁻³² kg", "9.109 × 10⁻³⁰ kg", "9.109 × 10⁻³³ kg"],
                correct: 0
            },
            {
                question: "Combien de temps dure une année-lumière ?",
                answers: ["Distance parcourue par la lumière en 1 an", "Temps de voyage à la vitesse de la lumière", "365 jours", "1 siècle"],
                correct: 0
            },
            {
                question: "Quel est le théorème de Gödel sur l'incomplétude ?",
                answers: ["Tout système formel est incomplet", "Tout système est complet", "Les mathématiques sont finies", "L'infini n'existe pas"],
                correct: 0
            },
            {
                question: "Qui a formulé le principe d'incertitude ?",
                answers: ["Albert Einstein", "Werner Heisenberg", "Niels Bohr", "Max Planck"],
                correct: 1
            },
            {
                question: "Quelle est la constante de Boltzmann ?",
                answers: ["1.381 × 10⁻²³ J/K", "1.381 × 10⁻²² J/K", "1.381 × 10⁻²⁴ J/K", "1.381 × 10⁻²¹ J/K"],
                correct: 0
            },
            {
                question: "Combien de dimensions a l'espace-temps selon la relativité ?",
                answers: ["3", "4", "5", "11"],
                correct: 1
            }
        ]
    }
};

// État du jeu
let gameState = {
    currentLevel: null,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    timeRemaining: 0,
    timerInterval: null,
    startTime: null,
    isPaused: false,
    selectedAnswer: null,
    questions: []
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeLevelSelection();
    initializeGame();
    initializePauseModal();
});

// Initialisation de la sélection de niveau
function initializeLevelSelection() {
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            const level = card.dataset.level;
            startGame(level);
        });
    });
}

// Initialisation du jeu
function initializeGame() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextQuestion);
    }
}

// Initialisation du modal de pause
function initializePauseModal() {
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const quitBtn = document.getElementById('quit-btn');
    const pauseModal = document.getElementById('pause-modal');

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            pauseGame();
        });
    }

    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            resumeGame();
        });
    }

    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            quitGame();
        });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pauseModal.classList.contains('active')) {
            resumeGame();
        }
    });
}

// Démarrer le jeu
function startGame(level) {
    gameState.currentLevel = level;
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.selectedAnswer = null;
    gameState.startTime = Date.now();
    gameState.isPaused = false;

    const levelData = QUIZ_DATA[level];
    gameState.questions = [...levelData.questions].sort(() => Math.random() - 0.5);

    // Mettre à jour l'interface
    updateLevelBadge(level);
    document.getElementById('total-questions').textContent = gameState.questions.length;
    
    // Changer d'écran
    document.getElementById('level-selection').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    // Afficher la première question
    displayQuestion();
}

// Mettre à jour le badge de niveau
function updateLevelBadge(level) {
    const badge = document.getElementById('current-level-badge');
    const levelNames = {
        easy: 'Facile',
        medium: 'Moyen',
        hard: 'Difficile'
    };
    const levelIcons = {
        easy: 'fa-seedling',
        medium: 'fa-fire',
        hard: 'fa-trophy'
    };
    
    badge.innerHTML = `
        <i class="fa-solid ${levelIcons[level]}"></i>
        <span>${levelNames[level]}</span>
    `;
}

// Afficher une question
function displayQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    const levelData = QUIZ_DATA[gameState.currentLevel];
    
    // Réinitialiser l'état
    gameState.selectedAnswer = null;
    gameState.timeRemaining = levelData.timePerQuestion;

    // Mettre à jour l'interface
    document.getElementById('question-num').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('question-number').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-score').textContent = gameState.score;
    document.getElementById('next-btn').disabled = true;

    // Calculer la progression
    const progress = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';

    // Afficher les réponses
    displayAnswers(question);

    // Démarrer le chronomètre
    startTimer();
}

// Afficher les réponses
function displayAnswers(question) {
    const container = document.getElementById('answers-container');
    container.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.dataset.index = index;
        
        button.addEventListener('click', () => {
            if (gameState.selectedAnswer === null && !gameState.isPaused) {
                selectAnswer(index, question.correct);
            }
        });

        container.appendChild(button);
    });
}

// Sélectionner une réponse
function selectAnswer(selectedIndex, correctIndex) {
    gameState.selectedAnswer = selectedIndex;
    clearInterval(gameState.timerInterval);

    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.classList.add('disabled');
        
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            btn.classList.add('incorrect');
        }
    });

    // Mettre à jour le score
    if (selectedIndex === correctIndex) {
        gameState.correctAnswers++;
        const levelData = QUIZ_DATA[gameState.currentLevel];
        gameState.score += levelData.pointsPerQuestion;
        document.getElementById('current-score').textContent = gameState.score;
    }

    // Activer le bouton suivant
    document.getElementById('next-btn').disabled = false;
}

// Gérer la question suivante
function handleNextQuestion() {
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
    } else {
        displayQuestion();
    }
}

// Démarrer le chronomètre
function startTimer() {
    const timerText = document.getElementById('timer-text');
    const clockFace = document.getElementById('clock-face');
    const clockHand = document.getElementById('clock-hand');
    const levelData = QUIZ_DATA[gameState.currentLevel];
    const totalTime = levelData.timePerQuestion;

    // Réinitialiser les classes
    clockFace.classList.remove('warning', 'danger');

    gameState.timerInterval = setInterval(() => {
        if (gameState.isPaused) return;

        gameState.timeRemaining--;
        timerText.textContent = gameState.timeRemaining;

        // Calculer l'angle de la pendule (0° à 12h, 180° à 6h)
        const percentage = gameState.timeRemaining / totalTime;
        const angle = percentage * 180; // De 0° à 180°
        clockHand.style.transform = `translateX(-50%) rotate(${angle}deg)`;

        // Changer la couleur selon le temps restant
        if (gameState.timeRemaining <= totalTime * 0.3) {
            clockFace.classList.add('danger');
            clockFace.classList.remove('warning');
        } else if (gameState.timeRemaining <= totalTime * 0.5) {
            clockFace.classList.add('warning');
        }

        // Temps écoulé
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

// Gérer le temps écoulé
function handleTimeUp() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Désactiver tous les boutons
    buttons.forEach(btn => btn.classList.add('disabled'));

    // Afficher la bonne réponse
    buttons[question.correct].classList.add('correct');

    // Activer le bouton suivant
    document.getElementById('next-btn').disabled = false;
}

// Mettre en pause le jeu
function pauseGame() {
    if (gameState.isPaused) return;
    
    gameState.isPaused = true;
    clearInterval(gameState.timerInterval);
    document.getElementById('pause-modal').classList.add('active');
}

// Reprendre le jeu
function resumeGame() {
    if (!gameState.isPaused) return;
    
    gameState.isPaused = false;
    document.getElementById('pause-modal').classList.remove('active');
    startTimer();
}

// Quitter le jeu
function quitGame() {
    clearInterval(gameState.timerInterval);
    document.getElementById('pause-modal').classList.remove('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('level-selection').classList.add('active');
    resetGame();
}

// Réinitialiser le jeu
function resetGame() {
    gameState = {
        currentLevel: null,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        timeRemaining: 0,
        timerInterval: null,
        startTime: null,
        isPaused: false,
        selectedAnswer: null,
        questions: []
    };
}

// Terminer le jeu
function endGame() {
    clearInterval(gameState.timerInterval);
    
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const totalQuestions = gameState.questions.length;
    const percentage = Math.round((gameState.correctAnswers / totalQuestions) * 100);

    // Mettre à jour les résultats
    document.getElementById('correct-answers').textContent = `${gameState.correctAnswers}/${totalQuestions}`;
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('percentage').textContent = percentage + '%';
    document.getElementById('time-taken').textContent = timeString;

    // Mettre à jour l'icône et le titre selon le résultat
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');
    const resultsSubtitle = document.getElementById('results-subtitle');

    if (percentage >= 80) {
        resultsIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        resultsIcon.style.color = 'var(--warning)';
        resultsTitle.textContent = 'Excellent !';
        resultsSubtitle.textContent = 'Vous maîtrisez parfaitement ce niveau !';
    } else if (percentage >= 60) {
        resultsIcon.innerHTML = '<i class="fa-solid fa-medal"></i>';
        resultsIcon.style.color = 'var(--primary)';
        resultsTitle.textContent = 'Bien joué !';
        resultsSubtitle.textContent = 'Bon score, continuez ainsi !';
    } else if (percentage >= 40) {
        resultsIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
        resultsIcon.style.color = 'var(--success)';
        resultsTitle.textContent = 'Pas mal !';
        resultsSubtitle.textContent = 'Vous pouvez encore vous améliorer !';
    } else {
        resultsIcon.innerHTML = '<i class="fa-solid fa-redo"></i>';
        resultsIcon.style.color = 'var(--error)';
        resultsTitle.textContent = 'Continuez !';
        resultsSubtitle.textContent = 'Entraînez-vous davantage pour améliorer votre score !';
    }

    // Changer d'écran
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('results-screen').classList.add('active');

    // Initialiser les boutons de résultats
    document.getElementById('play-again-btn').addEventListener('click', () => {
        startGame(gameState.currentLevel);
        document.getElementById('results-screen').classList.remove('active');
    });

    document.getElementById('change-level-btn').addEventListener('click', () => {
        document.getElementById('results-screen').classList.remove('active');
        document.getElementById('level-selection').classList.add('active');
        resetGame();
    });
}

