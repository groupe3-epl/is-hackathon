// État du jeu
let gameState = {
    score: 0,
    correctAnswers: 0,
    isPaused: false,
    playerName: ""
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    const quitBtn = document.getElementById('quitter');
    const jeu = ["pierre", "papier", "ciseaux"];
    const name = prompt("Entrez votre nom:").toLowerCase();
    
    if (!name) {
        document.writeln("Nom requis pour jouer!");
        return;
    }
    
    gameState.playerName = name;
    
    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            quitGame();
        });
    }
    
    playGame(jeu, name);
}

function playGame(jeu, name) {
    let continuer = true;
    
    while (continuer) {
        const gamer = prompt(`Mr/Mme ${name}, Entrez votre choix (pierre/papier/ciseaux):`).toLowerCase();
        
        if (!gamer) break;
        
        if (!jeu.includes(gamer)) {
            alert("Faites attention, Reessayez");
            continue;
        }
        
        const ordi = jeu[Math.floor(Math.random() * jeu.length)];
        
        let resultat = determineWinner(gamer, ordi, name);
        displayResult(resultat, ordi);
        
        const rep = prompt("Vous voulez Continuer ou stopper?\n(Écrivez juste 'c' pour poursuivre)").toLowerCase();
        if (rep !== "c") {
            alert("Alors, à la prochaine!");
            continuer = false;
        }
    }
}

function determineWinner(gamer, ordi, name) {
    if (gamer === ordi) {
        return "Match Nul";
    } else if (
        (gamer === "pierre" && ordi === "ciseaux") ||
        (gamer === "papier" && ordi === "pierre") ||
        (gamer === "ciseaux" && ordi === "papier")
    ) {
        gameState.correctAnswers++;
        gameState.score++;
        return `Mr/Mme ${name}, Vous avez gagné Bravo!!!`;
    } else {
        return "Perdu!!!!";
    }
}

function displayResult(message, computerChoice) {
    alert(`Ordinateur : ${computerChoice}\n${message}`);
}

function resumeGame() {
    if (!gameState.isPaused) return;
    
    gameState.isPaused = false;
    const pauseModal = document.getElementById('pause-modal');
    if (pauseModal) {
        pauseModal.classList.remove('active');
    }
}

function quitGame() {
    const pauseModal = document.getElementById('pause-modal');
    const gameScreen = document.getElementById('game-screen');
    const levelSelection = document.getElementById('level-selection');
    
    if (pauseModal) pauseModal.classList.remove('active');
    if (gameScreen) gameScreen.classList.remove('active');
    if (levelSelection) levelSelection.classList.add('active');
    
    resetGame();
}

function resetGame() {
    gameState = {
        jeu: [],
        score: 0,
        correctAnswers: 0,
        isPaused: false,
        playerName: ""
    };
}