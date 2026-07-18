/* =====================================================
   RAGECORE ARCADE - ROCK PAPER SCISSORS GAME LOGIC
   ===================================================== */

// Game Constants and DOM Elements
const playerHand = document.getElementById("playerHand");
const computerHand = document.getElementById("computerHand");
const playerScoreDisplay = document.getElementById("playerScoreValue");
const computerScoreDisplay = document.getElementById("computerScoreValue");
const vsDisplay = document.getElementById("vsText");
const outcomeDisplay = document.getElementById("outcomeText");
const optionButtons = document.querySelectorAll(".option-btn");
const btnReset = document.getElementById("btnReset");

// Choice data arrays mapping
const choiceClasses = [
    "fa-hand-back-fist", // Index 0: Rock
    "fa-hand",           // Index 1: Paper
    "fa-hand-scissors"   // Index 2: Scissors
];

// Game State Variables
let playerScore = 0;
let computerScore = 0;
let isBoardLocked = false;

// Event Listeners
optionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => playRound(index));
});

btnReset.addEventListener("click", resetGame);

// Play Rock Paper Scissors Round
function playRound(playerChoiceIndex) {
    if (isBoardLocked) return;
    
    isBoardLocked = true; // Lock choice buttons during round shake animation
    optionButtons.forEach(btn => btn.classList.add("disabled"));
    
    // Reset hands to rock fist for the count-down shake animation
    playerHand.innerHTML = `<i class="fa-solid fa-hand-back-fist"></i>`;
    computerHand.innerHTML = `<i class="fa-solid fa-hand-back-fist"></i>`;
    
    // Set status
    vsDisplay.textContent = "VS";
    outcomeDisplay.innerHTML = `<span class="outcome-tie">Ready...</span>`;
    
    // Trigger shake animation classes
    playerHand.classList.add("shake-player");
    computerHand.classList.add("shake-computer");
    
    // Wait for countdown shake animation to complete
    setTimeout(() => {
        // Stop shake animation classes
        playerHand.classList.remove("shake-player");
        computerHand.classList.remove("shake-computer");
        
        // Pick Computer Selection (0, 1, or 2)
        const computerChoiceIndex = Math.floor(Math.random() * 3);
        
        // Show player choice icon
        playerHand.innerHTML = `<i class="fa-solid ${choiceClasses[playerChoiceIndex]}"></i>`;
        
        // Show computer choice icon
        computerHand.innerHTML = `<i class="fa-solid ${choiceClasses[computerChoiceIndex]}"></i>`;
        
        // Check game logic outcome
        evaluateWinner(playerChoiceIndex, computerChoiceIndex);
        
        // Unlock buttons
        isBoardLocked = false;
        optionButtons.forEach(btn => btn.classList.remove("disabled"));
    }, 1000); // 1.0s count-down delay
}

// Evaluate round winner
function evaluateWinner(player, computer) {
    if (player === computer) {
        // Tie
        outcomeDisplay.innerHTML = `<span class="outcome-tie">It's a Tie!</span>`;
    } else if (
        (player === 0 && computer === 2) || // Rock beats Scissors
        (player === 1 && computer === 0) || // Paper beats Rock
        (player === 2 && computer === 1)    // Scissors beats Paper
    ) {
        // Player Wins
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        outcomeDisplay.innerHTML = `<span class="outcome-win">You Win!</span>`;
        
        // Visual indicator flash
        playerScoreDisplay.parentElement.style.borderColor = "var(--secondary-color)";
        setTimeout(() => {
            playerScoreDisplay.parentElement.style.borderColor = "rgba(236, 72, 153, 0.3)";
        }, 300);
    } else {
        // Computer Wins
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        outcomeDisplay.innerHTML = `<span class="outcome-lose">Computer Wins!</span>`;
        
        // Visual indicator flash
        computerScoreDisplay.parentElement.style.borderColor = "var(--accent-color)";
        setTimeout(() => {
            computerScoreDisplay.parentElement.style.borderColor = "rgba(6, 182, 212, 0.3)";
        }, 300);
    }
}

// Reset Scores
function resetGame() {
    if (isBoardLocked) return;
    
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    
    playerHand.innerHTML = `<i class="fa-solid fa-hand-back-fist"></i>`;
    computerHand.innerHTML = `<i class="fa-solid fa-hand-back-fist"></i>`;
    
    vsDisplay.textContent = "VS";
    outcomeDisplay.innerHTML = `<span class="outcome-tie">Make a Move!</span>`;
}
