let gameState = {
    score: 0,
    correctAnswers: 0,
    totalGames: 0,
    playerName: "",
    gameActive: true
};

const choices = ["pierre", "papier", "ciseaux"];

document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    const playerName = prompt("Entrez votre nom:");
    
    if (!playerName || playerName.trim() === "") {
        alert("Nom requis pour jouer!");
        window.location.href = "../HTML/pierre.html";
        return;
    }
    
    gameState.playerName = playerName.trim();
    document.getElementById('playerInfo').textContent = `Bienvenue Mr/Mme ${gameState.playerName}!`;
    updateScore();
}

function playGame(playerChoice) {
    if (!gameState.gameActive) return;
    
    gameState.gameActive = false;
    gameState.totalGames++;
    
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = determineWinner(playerChoice, computerChoice);
    
    displayResult(playerChoice, computerChoice, result);
    
    document.getElementById('playAgainBtn').style.display = 'inline-block';
    document.getElementById('choicesContainer').style.opacity = '0.5';
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
}

function determineWinner(player, computer) {
    if (player === computer) {
        return { status: 'draw', message: 'Match Nul!' };
    } else if (
        (player === "pierre" && computer === "ciseaux") ||
        (player === "papier" && computer === "pierre") ||
        (player === "ciseaux" && computer === "papier")
    ) {
        gameState.score++;
        gameState.correctAnswers++;
        return { status: 'win', message: `🎉 Mr/Mme ${gameState.playerName}, Vous avez gagné!` };
    } else {
        return { status: 'lose😒', message: '❌ Perdu!' };
    }
}

function displayResult(playerChoice, computerChoice, result) {
    const resultArea = document.getElementById('resultArea');
    const resultMessage = document.getElementById('resultMessage');
    
    const choiceEmoji = {
        'pierre': '🪨',
        'papier': '📄',
        'ciseaux': '✂️'
    };
    
    let html = `
        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 20px;">
            <div>
                <p style="font-size: 24px; margin: 0;">${choiceEmoji[playerChoice]}</p>
                <p style="color: #555;">Votre choix</p>
            </div>
            <div style="font-size: 24px; color: #7e7bc1;">VS</div>
            <div>
                <p style="font-size: 24px; margin: 0;">${choiceEmoji[computerChoice]}</p>
                <p style="color: #555;">Ordinateur</p>
            </div>
        </div>
    `;
    
    const statusClass = result.status === 'win' ? 'winner' : result.status === 'lose' ? 'loser' : 'draw';
    html += `<div class="${statusClass}">${result.message}</div>`;
    
    resultMessage.innerHTML = html;
    resultArea.style.display = 'block';
    
    updateScore();
}

function updateScore() {
    document.getElementById('scoreDisplay').textContent = 
        `Score: ${gameState.score} / ${gameState.totalGames} parties`;
}

function resetRound() {
    gameState.gameActive = true;
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'none';
    document.getElementById('choicesContainer').style.opacity = '1';
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
}

function quitGame() {
    if (confirm(`Quitter le jeu? Votre score: ${gameState.score}/${gameState.totalGames}`)) {
        window.location.href = "../HTML/pierre2.html";
    }
}