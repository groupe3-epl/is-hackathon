// État du jeu
let gameState = {
    ballPosition: null, // Position de la bille (0, 1 ou 2)
    isMixing: false,
    isGameActive: false,
    score: 0,
    wins: 0,
    losses: 0,
    canSelect: false
};

// Éléments DOM
const cups = document.querySelectorAll('.cup-wrapper');
const ball = document.getElementById('ball');
const startBtn = document.getElementById('start-btn');
const characterMessage = document.getElementById('character-message');
const leftArm = document.getElementById('left-arm');
const rightArm = document.getElementById('right-arm');
const resultOverlay = document.getElementById('result-overlay');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again-btn');
const helpBtn = document.getElementById('help-btn');
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    loadStats();
    updateDisplay();
});

function initializeGame() {
    // Événements des tasses
    cups.forEach((cup, index) => {
        cup.addEventListener('click', () => {
            if (gameState.canSelect && !gameState.isMixing) {
                selectCup(index);
            }
        });
    });

    // Bouton de démarrage
    startBtn.addEventListener('click', startGame);

    // Bouton rejouer
    playAgainBtn.addEventListener('click', () => {
        resultOverlay.classList.remove('show');
        resetGame();
    });

    // Bouton d'aide
    helpBtn.addEventListener('click', () => {
        instructions.classList.add('show');
    });

    closeInstructionsBtn.addEventListener('click', () => {
        instructions.classList.remove('show');
    });

    // Fermer les instructions avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && instructions.classList.contains('show')) {
            instructions.classList.remove('show');
        }
    });
}

// Démarrer le jeu
function startGame() {
    if (gameState.isMixing || gameState.isGameActive) return;

    gameState.isGameActive = true;
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mélange en cours...';

    // Choisir une position aléatoire pour la bille
    gameState.ballPosition = Math.floor(Math.random() * 3);
    
    // Afficher la bille sous la tasse choisie
    showBallUnderCup(gameState.ballPosition);

    // Message du personnage
    characterMessage.textContent = 'Regardez bien où je place la bille !';
    
    // Animation des bras
    leftArm.classList.add('mixing');
    rightArm.classList.add('mixing');

    // Attendre un peu puis cacher la bille et mélanger
    setTimeout(() => {
        hideBall();
        characterMessage.textContent = 'Je vais maintenant mélanger les tasses...';
        setTimeout(() => {
            mixCups();
        }, 1000);
    }, 2000);
}

// Afficher la bille sous une tasse
function showBallUnderCup(cupIndex) {
    const cupElement = cups[cupIndex].querySelector('.cup');
    const cupRect = cupElement.getBoundingClientRect();
    const containerRect = document.getElementById('cups-container').getBoundingClientRect();
    
    // Positionner la bille sous la tasse
    ball.style.left = `${cupRect.left - containerRect.left + cupRect.width / 2}px`;
    ball.style.bottom = '20px';
    ball.classList.add('visible');
    ball.classList.add('under-cup');
}

// Cacher la bille
function hideBall() {
    ball.classList.remove('visible');
    ball.classList.remove('under-cup');
}

// Mélanger les tasses
function mixCups() {
    gameState.isMixing = true;
    gameState.canSelect = false;
    
    characterMessage.textContent = 'Mélange en cours... Attention !';
    
    // Désactiver les tasses pendant le mélange
    cups.forEach(cup => cup.classList.add('disabled'));

    // Nombre de mélanges (entre 5 et 8)
    const mixCount = 5 + Math.floor(Math.random() * 4);
    let currentMix = 0;

    const mixInterval = setInterval(() => {
        if (currentMix >= mixCount) {
            clearInterval(mixInterval);
            finishMixing();
            return;
        }

        // Animation de mélange
        const positions = [0, 1, 2];
        const shuffled = shuffleArray([...positions]);
        
        // Animer le déplacement des tasses
        cups.forEach((cup, index) => {
            const newIndex = shuffled[index];
            cup.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            cup.classList.add('mixing');
            
            // Simuler le mouvement
            setTimeout(() => {
                cup.classList.remove('mixing');
            }, 600);
        });

        // Mettre à jour la position de la bille
        const newBallPosition = shuffled.indexOf(gameState.ballPosition);
        gameState.ballPosition = newBallPosition;

        currentMix++;
    }, 700);
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Terminer le mélange
function finishMixing() {
    gameState.isMixing = false;
    gameState.canSelect = true;
    
    // Réactiver les tasses
    cups.forEach(cup => {
        cup.classList.remove('disabled');
        cup.style.transition = 'all 0.3s ease';
    });

    // Arrêter l'animation des bras
    leftArm.classList.remove('mixing');
    rightArm.classList.remove('mixing');

    characterMessage.textContent = 'Où se trouve la bille ? Cliquez sur une tasse !';
    
    // Animation pour attirer l'attention
    cups.forEach(cup => {
        cup.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            cup.style.animation = '';
        }, 1000);
    });
}

// Sélectionner une tasse
function selectCup(selectedIndex) {
    if (!gameState.canSelect) return;

    gameState.canSelect = false;
    gameState.isGameActive = false;

    // Désactiver toutes les tasses
    cups.forEach(cup => {
        cup.classList.add('disabled');
        cup.style.pointerEvents = 'none';
    });

    // Animer la sélection
    const selectedCup = cups[selectedIndex];
    selectedCup.classList.add('selected');

    // Animation de levée de la tasse
    setTimeout(() => {
        selectedCup.classList.add('lift');
        
        // Vérifier le résultat après l'animation
        setTimeout(() => {
            checkResult(selectedIndex);
        }, 500);
    }, 300);
}

// Vérifier le résultat
function checkResult(selectedIndex) {
    const isCorrect = selectedIndex === gameState.ballPosition;
    
    // Afficher la bille sous la bonne tasse
    showBallUnderCup(gameState.ballPosition);
    
    // Mettre à jour les statistiques
    if (isCorrect) {
        gameState.wins++;
        gameState.score += 10;
        showResult(true);
    } else {
        gameState.losses++;
        showResult(false);
    }

    // Sauvegarder les stats
    saveStats();
    updateDisplay();

    // Réinitialiser le bouton
    startBtn.disabled = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Rejouer';
}

// Afficher le résultat
function showResult(isWin) {
    if (isWin) {
        resultIcon.className = 'result-icon success';
        resultIcon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
        resultTitle.textContent = 'Bravo !';
        resultMessage.textContent = `Vous avez trouvé la bille ! +10 points`;
    } else {
        resultIcon.className = 'result-icon error';
        resultIcon.innerHTML = '<i class="fa-solid fa-times-circle"></i>';
        resultTitle.textContent = 'Dommage !';
        resultMessage.textContent = `La bille était sous la tasse ${gameState.ballPosition + 1}. Essayez encore !`;
    }

    resultOverlay.classList.add('show');
}

// Réinitialiser le jeu
function resetGame() {
    gameState.isMixing = false;
    gameState.isGameActive = false;
    gameState.canSelect = false;
    gameState.ballPosition = null;

    // Réinitialiser les tasses
    cups.forEach(cup => {
        cup.classList.remove('selected', 'lift', 'mixing', 'disabled');
        cup.style.transition = 'all 0.3s ease';
        cup.style.pointerEvents = 'auto';
        cup.style.animation = '';
    });

    // Cacher la bille
    hideBall();

    // Réinitialiser le message
    characterMessage.textContent = 'Cliquez sur "Commencer" pour jouer !';

    // Réinitialiser les bras
    leftArm.classList.remove('mixing');
    rightArm.classList.remove('mixing');

    // Réinitialiser le bouton
    startBtn.disabled = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Commencer';
}

// Mettre à jour l'affichage
function updateDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('wins').textContent = gameState.wins;
    document.getElementById('losses').textContent = gameState.losses;
    
    const total = gameState.wins + gameState.losses;
    const winRate = total > 0 ? Math.round((gameState.wins / total) * 100) : 0;
    document.getElementById('win-rate').textContent = winRate + '%';
}

// Sauvegarder les statistiques
function saveStats() {
    const stats = {
        score: gameState.score,
        wins: gameState.wins,
        losses: gameState.losses
    };
    localStorage.setItem('tasseGameStats', JSON.stringify(stats));
}

// Charger les statistiques
function loadStats() {
    const saved = localStorage.getItem('tasseGameStats');
    if (saved) {
        const stats = JSON.parse(saved);
        gameState.score = stats.score || 0;
        gameState.wins = stats.wins || 0;
        gameState.losses = stats.losses || 0;
    }
}

// Animation pulse pour les tasses
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);

