/* =====================================================
   RAGECORE ARCADE - SNAKE GAME LOGIC
   ===================================================== */

// Game Constants and DOM Elements
const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("scoreValue");
const highScoreDisplay = document.getElementById("highScoreValue");
const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreDisplay = document.getElementById("finalScore");

const GRID_SIZE = 20; // 20x20 grid
const cells = []; // Store cell DOM elements

// Game State Variables
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: -1 }; // Start moving UP
let nextDirection = { x: 0, y: -1 }; // Prevent rapid multi-tap turn self-collision
let score = 0;
let highScore = localStorage.getItem("snake_highScore") || 0;
let gameActive = false;
let gameSpeed = 150; // Update delay in milliseconds
let gameInterval;

// Initialize high score in UI
highScoreDisplay.textContent = highScore;

// Populate game board with grid cells
function createBoard() {
    board.innerHTML = '';
    cells.length = 0; // Clear array
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Map 2D coordinates (x, y) to 1D index
function getIndex(x, y) {
    return y * GRID_SIZE + x;
}

// Setup event listeners for keyboard movement
document.addEventListener("keydown", handleKeyPress);
document.getElementById("btnUp").addEventListener("click", () => changeDirection(0, -1));
document.getElementById("btnDown").addEventListener("click", () => changeDirection(0, 1));
document.getElementById("btnLeft").addEventListener("click", () => changeDirection(-1, 0));
document.getElementById("btnRight").addEventListener("click", () => changeDirection(1, 0));
document.getElementById("btnStart").addEventListener("click", startGame);
document.getElementById("btnRestart").addEventListener("click", startGame);

// Handle Keypresses (Arrow keys and WASD)
function handleKeyPress(event) {
    if (!gameActive) return;
    
    switch (event.key) {
        case "ArrowUp":
        case "w":
            changeDirection(0, -1);
            break;
        case "ArrowDown":
        case "s":
            changeDirection(0, 1);
            break;
        case "ArrowLeft":
        case "a":
            changeDirection(-1, 0);
            break;
        case "ArrowRight":
        case "d":
            changeDirection(1, 0);
            break;
    }
}

// Change snake direction while preventing immediate reverse collisions (180 turns)
function changeDirection(x, y) {
    if (x !== 0 && direction.x === 0) {
        nextDirection = { x, y };
    } else if (y !== 0 && direction.y === 0) {
        nextDirection = { x, y };
    }
}

// Start Game
function startGame() {
    createBoard();
    
    // Reset Snake to center
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    
    // Reset States
    direction = { x: 0, y: -1 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    gameSpeed = 150;
    scoreDisplay.textContent = score;
    
    // Hide overlay screens
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    
    // Place first food
    spawnFood();
    
    // Render initial state
    drawGame();
    
    // Start interval loop
    gameActive = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameStep, gameSpeed);
}

// Place food randomly on the board
function spawnFood() {
    let foodPlaced = false;
    
    while (!foodPlaced) {
        const randX = Math.floor(Math.random() * GRID_SIZE);
        const randY = Math.floor(Math.random() * GRID_SIZE);
        
        // Ensure food is not spawned inside snake
        const onSnake = snake.some(segment => segment.x === randX && segment.y === randY);
        
        if (!onSnake) {
            food = { x: randX, y: randY };
            foodPlaced = true;
        }
    }
}

// Update game step on each tick
function gameStep() {
    if (!gameActive) return;
    
    // Update snake direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Check for wall collisions (Game Over)
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        endGame();
        return;
    }
    
    // Check self collisions (Game Over)
    const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
    if (hitSelf) {
        endGame();
        return;
    }
    
    // Add new head to snake body
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        spawnFood();
        
        // Speed up game gradually
        if (score % 50 === 0 && gameSpeed > 70) {
            gameSpeed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameStep, gameSpeed);
        }
    } else {
        // Remove tail segment if food was not eaten
        snake.pop();
    }
    
    drawGame();
}

// Render snake body and food elements on the board
function drawGame() {
    // Clear all previous cells styling classes
    cells.forEach(cell => {
        cell.className = "cell";
    });
    
    // Draw Snake body
    snake.forEach((segment, index) => {
        const idx = getIndex(segment.x, segment.y);
        // Make sure index is in bounds
        if (idx >= 0 && idx < cells.length) {
            if (index === 0) {
                cells[idx].classList.add("snake-body", "snake-head");
            } else {
                cells[idx].classList.add("snake-body");
            }
        }
    });
    
    // Draw Food
    const foodIdx = getIndex(food.x, food.y);
    if (foodIdx >= 0 && foodIdx < cells.length) {
        cells[foodIdx].classList.add("food");
    }
}

// End Game
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    // Update High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snake_highScore", highScore);
        highScoreDisplay.textContent = highScore;
    }
    
    // Display game over screen
    finalScoreDisplay.textContent = score;
    gameOverOverlay.classList.remove("hidden");
}
