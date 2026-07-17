/* =====================================================
   RAGECORE ARCADE - MEMORY CARD GAME LOGIC
   ===================================================== */

// Game Constants and DOM Elements
const grid = document.getElementById("gameGrid");
const flipsDisplay = document.getElementById("flipsValue");
const timeDisplay = document.getElementById("timeValue");
const winOverlay = document.getElementById("winOverlay");
const finalFlipsDisplay = document.getElementById("finalFlips");
const finalTimeDisplay = document.getElementById("finalTime");
const btnRestart = document.getElementById("btnRestart");

// List of 8 unique neon icon classes (Font Awesome icons)
const cardIcons = [
    "fa-gamepad",
    "fa-ghost",
    "fa-gem",
    "fa-skull",
    "fa-bolt",
    "fa-fire",
    "fa-crown",
    "fa-dragon"
];

// Game State Variables
let cardsList = [];
let flippedCards = [];
let matchedPairsCount = 0;
let flipsCount = 0;
let timerSeconds = 0;
let timerInterval;
let isBoardLocked = false;
let hasGameStarted = false;

// Event Listeners
btnRestart.addEventListener("click", initGame);

// Shuffle array elements (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize / Restart Game state
function initGame() {
    // Clear DOM and intervals
    grid.innerHTML = "";
    clearInterval(timerInterval);
    
    // Reset States
    flippedCards = [];
    matchedPairsCount = 0;
    flipsCount = 0;
    timerSeconds = 0;
    isBoardLocked = false;
    hasGameStarted = false;
    
    // Update Stats Display
    flipsDisplay.textContent = flipsCount;
    timeDisplay.textContent = "00:00";
    winOverlay.classList.add("hidden");
    
    // Create duplicated deck (8 pairs = 16 cards)
    const deck = [...cardIcons, ...cardIcons];
    cardsList = shuffle(deck);
    
    // Generate Card Elements
    cardsList.forEach((iconClass, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("memory-card-element");
        cardElement.dataset.icon = iconClass;
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back">
                    <i class="fa-solid fa-code"></i>
                </div>
                <div class="card-front">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
            </div>
        `;
        
        cardElement.addEventListener("click", () => handleCardClick(cardElement));
        grid.appendChild(cardElement);
    });
}

// Handle Card clicks
function handleCardClick(card) {
    // Ignore click if board is locked, or clicking an already flipped/matched card
    if (isBoardLocked) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    
    // Start game timer on very first click
    if (!hasGameStarted) {
        hasGameStarted = true;
        startTimer();
    }
    
    // Flip Card
    card.classList.add("flipped");
    flippedCards.push(card);
    
    // Increment flips count
    flipsCount++;
    flipsDisplay.textContent = flipsCount;
    
    // If two cards are flipped, check for match
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check if the two flipped cards match
function checkMatch() {
    isBoardLocked = true; // Lock interactions during verification delay
    
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;
    
    if (isMatch) {
        // Handle Match
        setTimeout(() => {
            card1.classList.add("matched");
            card2.classList.add("matched");
            
            flippedCards = [];
            matchedPairsCount++;
            isBoardLocked = false;
            
            // Check Win Condition
            if (matchedPairsCount === cardIcons.length) {
                endGame();
            }
        }, 300);
    } else {
        // Handle Mismatch (Flip back after 1 second delay)
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            
            flippedCards = [];
            isBoardLocked = false;
        }, 1000);
    }
}

// Game Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
        const seconds = (timerSeconds % 60).toString().padStart(2, "0");
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Game Completion Win Screen
function endGame() {
    clearInterval(timerInterval);
    
    // Show stats on overlay screen
    finalFlipsDisplay.textContent = flipsCount;
    finalTimeDisplay.textContent = timeDisplay.textContent;
    winOverlay.classList.remove("hidden");
}

// Initialize on script load
initGame();
