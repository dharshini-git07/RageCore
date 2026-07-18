/* =====================================================
   RAGECORE ARCADE - TIC TAC TOE GAME LOGIC
   ===================================================== */

// Game Constants and DOM Elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const modeBtnAI = document.getElementById("modeAI");
const modeBtnLocal = document.getElementById("modeLocal");
const overlay = document.getElementById("resultOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const btnRestart = document.getElementById("btnRestart");

// Board representation (9 index positions)
let boardState = ["", "", "", "", "", "", "", "", ""];

// Game State Variables
let currentPlayer = "X"; // Player is X, Computer/Friend is O
let isVsAI = true;
let isGameActive = true;

// Winning combos indices mapping
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

modeBtnAI.addEventListener("click", () => switchMode(true));
modeBtnLocal.addEventListener("click", () => switchMode(false));
btnRestart.addEventListener("click", restartGame);

// Switch between vs AI and Local 2 Player
function switchMode(vsAI) {
    isVsAI = vsAI;
    if (vsAI) {
        modeBtnAI.classList.add("active");
        modeBtnLocal.classList.remove("active");
    } else {
        modeBtnAI.classList.remove("active");
        modeBtnLocal.classList.add("active");
    }
    restartGame();
}

// Handle User Clicks on Board Cells
function handleCellClick(cell, index) {
    // Return if cell already taken or game over
    if (boardState[index] !== "" || !isGameActive) return;
    
    // Make Player's Move
    makeMove(index, currentPlayer);
    
    // Check game outcome
    if (checkWinner(currentPlayer)) {
        endGame(currentPlayer === "X" ? "Player X Wins!" : "Player O Wins!");
        return;
    }
    
    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }
    
    // Switch Turn
    if (isVsAI) {
        // AI Turn
        currentPlayer = "O";
        statusText.textContent = "Computer is thinking...";
        isGameActive = false; // Temporarily block player clicks during AI delay
        
        setTimeout(() => {
            const aiMoveIndex = getBestMove();
            makeMove(aiMoveIndex, "O");
            
            if (checkWinner("O")) {
                endGame("Computer Wins!");
                return;
            }
            
            if (checkDraw()) {
                endGame("It's a Draw!");
                return;
            }
            
            currentPlayer = "X";
            statusText.textContent = "Your Turn (X)";
            isGameActive = true;
        }, 500); // 0.5s realistic delay
    } else {
        // Local 2-Player Turn switch
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Record and Render Move on Board
function makeMove(index, playerSymbol) {
    boardState[index] = playerSymbol;
    cells[index].textContent = playerSymbol;
    cells[index].classList.add("taken");
    cells[index].classList.add(playerSymbol === "X" ? "x-mark" : "o-mark");
}

// Check if playerSymbol satisfies any winning combo
function checkWinner(playerSymbol) {
    return winCombos.some(combo => {
        return combo.every(index => boardState[index] === playerSymbol);
    });
}

// Check if board is fully filled without winning
function checkDraw() {
    return boardState.every(cell => cell !== "");
}

// AI logic heuristic helper
function getBestMove() {
    // 1. Can AI Win in this move?
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (boardState[a] === "O" && boardState[b] === "O" && boardState[c] === "") return c;
        if (boardState[a] === "O" && boardState[c] === "O" && boardState[b] === "") return b;
        if (boardState[b] === "O" && boardState[c] === "O" && boardState[a] === "") return a;
    }
    
    // 2. Can Player Win? Block them!
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (boardState[a] === "X" && boardState[b] === "X" && boardState[c] === "") return c;
        if (boardState[a] === "X" && boardState[c] === "X" && boardState[b] === "") return b;
        if (boardState[b] === "X" && boardState[c] === "X" && boardState[a] === "") return a;
    }
    
    // 3. Take Center if open
    if (boardState[4] === "") return 4;
    
    // 4. Take Corners if open
    const corners = [0, 2, 6, 8];
    const freeCorners = corners.filter(index => boardState[index] === "");
    if (freeCorners.length > 0) {
        return freeCorners[Math.floor(Math.random() * freeCorners.length)];
    }
    
    // 5. Take any remaining open cell
    const freeSlots = [];
    boardState.forEach((val, idx) => {
        if (val === "") freeSlots.push(idx);
    });
    return freeSlots[Math.floor(Math.random() * freeSlots.length)];
}

// Trigger Game Over overlay
function endGame(message) {
    isGameActive = false;
    overlayTitle.textContent = message;
    
    // Dynamic overlay style mapping
    if (message.includes("Draw")) {
        overlay.className = "overlay-screen draw-screen";
    } else {
        overlay.className = "overlay-screen win-screen";
    }
    
    overlay.classList.remove("hidden");
    statusText.textContent = "Game Over";
}

// Reset Game Board and Variables
function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell";
    });
    
    overlay.classList.add("hidden");
    statusText.textContent = "Your Turn (X)";
}
