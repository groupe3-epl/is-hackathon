
//charger le fichier texte
fetch("liste.txt")
    .then(response => response.text())
    .then(data => {
        var wordList = data.split("\n")
        var randomIndex = Math.floor (Math.random() * wordList.length)
        const wordToGuess = wordList[randomIndex].trim();
        //alert(wordToGuess);
        var wordLength = wordToGuess.length;
        var hiddenWord = ""
        for (var i=0; i<wordLength; i++){
            hiddenWord += "-";
        }
        document.getElementById("word").innerText = hiddenWord;
        var guessInput = document.getElementById("guess");
        var submitGuess = document.getElementById("submitGuess");
        var resultDisplay = document.getElementById("result");
        var link = document.getElementById("link");
        link.style.display = "none";
        var guessedLetters = new Set();
        submitGuess.onclick = function(){
            var playerGuess = guessInput.value.trim().toUpperCase();
            if (playerGuess.length > 1 || playerGuess.length === 0){
                resultDisplay.innerHTML = "Veuillez entrer une seule lettre";
            } else if (guessedLetters.has(playerGuess)){
                resultDisplay.innerText = "Vous avez déjà deviné cette lettre.";
            } else {
                guessedLetters.add(playerGuess);
                if (wordToGuess.indexOf(playerGuess) === -1){
                    resultDisplay.innerText = "La lettre " + playerGuess + " n'est pas dans le mot.";
                } else {
                    for (var j=0; j<wordLength; j++){
                        if (wordToGuess[j] === playerGuess){
                            hiddenWord = hiddenWord.substr(0,j) + playerGuess + hiddenWord.substr(j+1);
                        }
                    }
                    document.getElementById("word").innerHTML = hiddenWord;
                    if (hiddenWord === wordToGuess){
                        resultDisplay.innerText = "Bravo! Vous avez trouvé le mot: " + wordToGuess;
                        guessInput.style.display = "none";
                        submitGuess.style.display = "none";
                        link.style.display = "block";
                    } else {
                        resultDisplay.innerText = "Bonne lettre ! Continuez.";
                    }
                }
            }
            guessInput.value = "";
        }
    })