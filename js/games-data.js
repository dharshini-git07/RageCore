// ==========================================
// RageCore - Game Data Loader
// ==========================================

let games = [];

// Load games from games.json
async function loadGames() {

    try {

        const response = await fetch("games.json");

        if (!response.ok) {
            throw new Error(`Failed to load games.json (Status: ${response.status})`);
        }

        games = await response.json();

        console.log(`Loaded ${games.length} games`);

        // Notify games.js that data is ready
        if (typeof initializeGames === "function") {
            initializeGames();
        }

    }

    catch (error) {

        console.error("Error loading games:", error);

    }

}

// Load the JSON immediately
loadGames();