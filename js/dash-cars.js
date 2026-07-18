/* =====================================================
   RAGECORE ARCADE - DASH CARS GAME LOGIC
   ===================================================== */

// Game Constants and DOM Elements
const track = document.getElementById("gameTrack");
const player = document.getElementById("playerCar");
const scoreDisplay = document.getElementById("scoreValue");
const highScoreDisplay = document.getElementById("highScoreValue");
const livesDisplay = document.getElementById("livesValue");
const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreDisplay = document.getElementById("finalScore");

// Lane positions (in percentage of the track width)
const lanePositions = [12, 45, 78]; 
let currentLane = 1; // Start in middle lane (indices: 0, 1, 2)

// Game State Variables
let score = 0;
let highScore = localStorage.getItem("dashCars_highScore") || 0;
let lives = 3;
let gameActive = false;
let gameSpeed = 5; // Starting speed of obstacle cars
let obstacles = [];
let roadLines = [];
let gameInterval;
let spawnTimer;

// Initialize High Score UI
highScoreDisplay.textContent = highScore;

// Setup Event Listeners
document.addEventListener("keydown", handleKeyPress);
document.getElementById("btnLeft").addEventListener("click", () => movePlayer(-1));
document.getElementById("btnRight").addEventListener("click", () => movePlayer(1));
document.getElementById("btnStart").addEventListener("click", startGame);
document.getElementById("btnRestart").addEventListener("click", startGame);

// Handle Keyboard Input
function handleKeyPress(event) {
    if (!gameActive) return;
    if (event.key === "ArrowLeft" || event.key === "a") {
        movePlayer(-1);
    } else if (event.key === "ArrowRight" || event.key === "d") {
        movePlayer(1);
    }
}

// Move player left (-1) or right (+1)
function movePlayer(direction) {
    currentLane += direction;
    // Keep lane index between 0 and 2
    if (currentLane < 0) currentLane = 0;
    if (currentLane > 2) currentLane = 2;
    
    // Update player style
    player.style.left = lanePositions[currentLane] + "%";
}

// Start Game Loop
function startGame() {
    // Reset States
    score = 0;
    lives = 3;
    gameSpeed = 5;
    currentLane = 1;
    player.style.left = lanePositions[currentLane] + "%";
    
    // Clear old elements from DOM
    obstacles.forEach(obs => obs.element.remove());
    obstacles = [];
    roadLines.forEach(line => line.remove());
    roadLines = [];
    
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    
    // Hide Overlays
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    
    gameActive = true;
    
    // Create road scrolling lines
    createRoadLines();
    
    // Start game loop intervals
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS update
    spawnTimer = setInterval(spawnObstacle, 1200); // Spawn obstacle every 1.2s
}

// Create animated moving road lines
function createRoadLines() {
    for (let i = 0; i < 5; i++) {
        const line = document.createElement("div");
        line.classList.add("road-line");
        line.style.top = (i * 100) + "px";
        track.appendChild(line);
        roadLines.push(line);
    }
}

// Move road lines to give driving illusion
function scrollRoad() {
    roadLines.forEach(line => {
        let top = parseInt(line.style.top) || 0;
        top += gameSpeed;
        if (top > 450) {
            top = -40; // Wrap around to top
        }
        line.style.top = top + "px";
    });
}

// Spawn obstacle in a random lane
function spawnObstacle() {
    if (!gameActive) return;
    
    const obsElement = document.createElement("div");
    obsElement.classList.add("obstacle");
    
    // Pick random lane
    const laneIndex = Math.floor(Math.random() * 3);
    obsElement.style.left = lanePositions[laneIndex] + "%";
    obsElement.style.top = "-80px"; // Start off-screen
    
    track.appendChild(obsElement);
    obstacles.push({
        element: obsElement,
        lane: laneIndex,
        top: -80
    });
}

// Game Update Loop
function updateGame() {
    scrollRoad();
    moveObstacles();
    checkCollisions();
}

// Move obstacles downward
function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.top += gameSpeed;
        obs.element.style.top = obs.top + "px";
        
        // Check if obstacle passed player successfully
        if (obs.top > 450) {
            obs.element.remove();
            obstacles.splice(i, 1);
            
            // Add score
            score += 10;
            scoreDisplay.textContent = score;
            
            // Increase speed slowly every 50 points
            if (score % 50 === 0) {
                gameSpeed += 0.5;
            }
        }
    }
}

// Collision detection logic
function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        const obsRect = obs.element.getBoundingClientRect();
        
        // Check overlap (bounding boxes)
        if (
            playerRect.left < obsRect.right &&
            playerRect.right > obsRect.left &&
            playerRect.top < obsRect.bottom &&
            playerRect.bottom > obsRect.top
        ) {
            // Collision occurred!
            obs.element.remove();
            obstacles.splice(i, 1);
            
            loseLife();
            break;
        }
    }
}

// Handle life deduction
function loseLife() {
    lives--;
    livesDisplay.textContent = lives;
    
    // Quick visual screen flash/shake
    track.style.borderColor = "var(--error-color)";
    setTimeout(() => {
        track.style.borderColor = "var(--primary-color)";
    }, 200);
    
    if (lives <= 0) {
        endGame();
    }
}

// End Game logic
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(spawnTimer);
    
    // Save high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dashCars_highScore", highScore);
        highScoreDisplay.textContent = highScore;
    }
    
    // Show game over overlay
    finalScoreDisplay.textContent = score;
    gameOverOverlay.classList.remove("hidden");
}
