// Class to fetch and store games data
class GameDataManager {
    constructor() {
        this.games = [];
        this.dataUrl = "assets/data/games.json";
    }

    // Fetch games from JSON file
    fetchGames() {
        return fetch(this.dataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load games. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.games = data;
                console.log("Games loaded:", this.games.length);
                return this.games;
            })
            .catch(error => {
                console.error("Error loading games:", error);
                throw error;
            });
    }

    // Get all loaded games
    getAllGames() {
        return this.games;
    }
}

// Expose globally for other scripts
window.GameDataManager = GameDataManager;
